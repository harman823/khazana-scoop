import { google } from 'googleapis';
import dayjs from 'dayjs';
import { BookingStatus } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED];

type BusyInterval = {
  start: Date;
  end: Date;
  source: 'calendar' | 'database';
};

const getOAuthClient = () => {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    (env.GOOGLE_REDIRECT_URI || '') + (env.GOOGLE_REDIRECT_END_POINT || '/oauth/callback')
  );
};

const oAuthClient = getOAuthClient();

type GoogleToken = {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
};

const normalizeToken = (token: {
  access_token?: string | null;
  refresh_token?: string | null;
  scope?: string | null;
  token_type?: string | null;
  expiry_date?: number | null;
}): GoogleToken => ({
  access_token: token.access_token ?? undefined,
  refresh_token: token.refresh_token ?? undefined,
  scope: token.scope ?? undefined,
  token_type: token.token_type ?? undefined,
  expiry_date: token.expiry_date ?? undefined,
});

const initialToken: GoogleToken | null =
  env.GOOGLE_ACCESS_TOKEN || env.GOOGLE_REFRESH_TOKEN
    ? normalizeToken({
        access_token: env.GOOGLE_ACCESS_TOKEN,
        refresh_token: env.GOOGLE_REFRESH_TOKEN,
        scope: env.GOOGLE_CALENDAR_SCOPE,
        token_type: 'Bearer',
        expiry_date: env.GOOGLE_TOKEN_EXPIRY_DATE,
      })
    : null;

let storedToken: GoogleToken | null = initialToken;

if (storedToken) {
  oAuthClient.setCredentials(storedToken);
}

const hasConnectedCalendarAuth = () => Boolean(storedToken?.access_token || storedToken?.refresh_token);

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const setOAuthCredentials = (token: {
  access_token?: string | null;
  refresh_token?: string | null;
  scope?: string | null;
  token_type?: string | null;
  expiry_date?: number | null;
}) => {
  const normalizedToken = normalizeToken(token);
  storedToken = normalizedToken;
  oAuthClient.setCredentials(normalizedToken);
};

export const getOAuthClientUrl = () => {
  return oAuthClient.generateAuthUrl({
    access_type: env.GOOGLE_TOKEN_ACCESS_TYPE as 'offline' | 'online',
    scope: env.GOOGLE_CALENDAR_SCOPE,
  });
};

export const exchangeCodeForToken = async (code: string) => {
  const { tokens } = await oAuthClient.getToken(code);
  setOAuthCredentials(tokens);
  return normalizeToken(tokens);
};

const getCalendarClient = () => {
  if (storedToken) {
    oAuthClient.setCredentials(storedToken);
  }

  return google.calendar({ version: 'v3', auth: oAuthClient });
};

const generateTimeSlots = (date: string, durationMin: number): { start: string; end: string }[] => {
  const slots: { start: string; end: string }[] = [];
  const startTime = dayjs(`${date}T${env.START_TIME}`);
  const endTime = dayjs(`${date}T${env.END_TIME}`);

  let cursor = startTime;

  while (cursor.isBefore(endTime)) {
    const slotEnd = cursor.add(durationMin, 'minute');

    if (slotEnd.isAfter(endTime)) {
      break;
    }

    slots.push({ start: cursor.toISOString(), end: slotEnd.toISOString() });
    cursor = slotEnd.add(env.APPOINTMENT_INTERVAL, 'minute');
  }

  return slots;
};

const intervalsOverlap = (startA: Date, endA: Date, startB: Date, endB: Date) => {
  return startA < endB && startB < endA;
};

const getServiceDurationMin = async (serviceId?: string) => {
  if (!serviceId) {
    return env.APPOINTMENT_DURATION;
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMin: true },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  return service.durationMin;
};

const getBookedEvents = async (timeMin: string, timeMax: string) => {
  if (!hasConnectedCalendarAuth()) {
    return [];
  }

  try {
    const cal = getCalendarClient();
    const res = await cal.events.list({
      calendarId: env.GOOGLE_CALENDAR_ID || 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100,
    });

    return res.data.items || [];
  } catch (err) {
    console.warn('[CALENDAR] Falling back to database-only availability:', getErrorMessage(err));
    return [];
  }
};

const getDatabaseBusyIntervals = async (
  rangeStart: Date,
  rangeEnd: Date,
  excludeBookingId?: string
): Promise<BusyInterval[]> => {
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ACTIVE_BOOKING_STATUSES },
      bookingDateTime: {
        gte: rangeStart,
        lt: rangeEnd,
      },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    include: {
      service: {
        select: { durationMin: true },
      },
    },
  }) as Array<{ bookingDateTime: Date; service: { durationMin: number } }>;

  return bookings.map((booking) => ({
    start: booking.bookingDateTime,
    end: new Date(booking.bookingDateTime.getTime() + booking.service.durationMin * 60_000),
    source: 'database',
  }));
};

const getGoogleBusyIntervals = async (rangeStart: Date, rangeEnd: Date): Promise<BusyInterval[]> => {
  const items = await getBookedEvents(rangeStart.toISOString(), rangeEnd.toISOString());

  return items.flatMap((event) => {
    const startValue = event.start?.dateTime || event.start?.date;
    const endValue = event.end?.dateTime || event.end?.date;

    if (!startValue || !endValue) {
      return [];
    }

    return [{
      start: new Date(startValue),
      end: new Date(endValue),
      source: 'calendar' as const,
    }];
  });
};

const getBusyIntervals = async (
  rangeStart: Date,
  rangeEnd: Date,
  excludeBookingId?: string
): Promise<BusyInterval[]> => {
  const [databaseBusyIntervals, calendarBusyIntervals] = await Promise.all([
    getDatabaseBusyIntervals(rangeStart, rangeEnd, excludeBookingId),
    getGoogleBusyIntervals(rangeStart, rangeEnd),
  ]);

  return [...databaseBusyIntervals, ...calendarBusyIntervals];
};

const isBusyInterval = (start: Date, end: Date, busyIntervals: BusyInterval[]) => {
  return busyIntervals.some((busyInterval) =>
    intervalsOverlap(start, end, busyInterval.start, busyInterval.end)
  );
};

export const findDatabaseConflict = async (
  db: any,
  bookingDateTime: Date,
  durationMin: number,
  excludeBookingId?: string
) => {
  const requestedEnd = new Date(bookingDateTime.getTime() + durationMin * 60_000);
  const dayStart = dayjs(bookingDateTime).startOf('day').toDate();
  const dayEnd = dayjs(bookingDateTime).endOf('day').toDate();

  const bookings = await db.booking.findMany({
    where: {
      status: { in: ACTIVE_BOOKING_STATUSES },
      bookingDateTime: {
        gte: dayStart,
        lte: dayEnd,
      },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    include: {
      service: {
        select: { durationMin: true },
      },
    },
  });

  return bookings.find((booking: any) => {
    const existingEnd = new Date(booking.bookingDateTime.getTime() + booking.service.durationMin * 60_000);
    return intervalsOverlap(bookingDateTime, requestedEnd, booking.bookingDateTime, existingEnd);
  }) || null;
};

export const hasCalendarConflict = async (bookingDateTime: Date, durationMin: number) => {
  const requestedEnd = new Date(bookingDateTime.getTime() + durationMin * 60_000);
  const dayStart = dayjs(bookingDateTime).startOf('day').toDate();
  const dayEnd = dayjs(bookingDateTime).endOf('day').toDate();
  const busyIntervals = await getGoogleBusyIntervals(dayStart, dayEnd);

  return isBusyInterval(bookingDateTime, requestedEnd, busyIntervals);
};

export const getMonthlyAvailability = async (year: number, month: number, serviceId?: string) => {
  const startDate = dayjs(`${year}-${String(month).padStart(2, '0')}-01`).startOf('month');
  const endDate = startDate.endOf('month');
  const durationMin = await getServiceDurationMin(serviceId);
  const busyIntervals = await getBusyIntervals(startDate.startOf('day').toDate(), endDate.endOf('day').toDate());
  const days: { day: number; hasSlots: boolean }[] = [];

  let cursor = startDate;

  while (!cursor.isAfter(endDate)) {
    const isWeekend = cursor.day() === 0 || cursor.day() === 6;
    const isPast = cursor.isBefore(dayjs(), 'day');
    const dayKey = cursor.format('YYYY-MM-DD');
    const hasSlots = !isWeekend && !isPast && generateTimeSlots(dayKey, durationMin).some((slot) =>
      !isBusyInterval(new Date(slot.start), new Date(slot.end), busyIntervals)
    );

    days.push({ day: cursor.date(), hasSlots });
    cursor = cursor.add(1, 'day');
  }

  return days;
};

export const getAvailableSlotsForDay = async (date: string, serviceId?: string) => {
  const day = dayjs(date);
  const durationMin = await getServiceDurationMin(serviceId);

  if (day.day() === 0 || day.day() === 6) {
    return [];
  }

  if (day.isBefore(dayjs(), 'day')) {
    return [];
  }

  const busyIntervals = await getBusyIntervals(day.startOf('day').toDate(), day.endOf('day').toDate());

  return generateTimeSlots(date, durationMin).map((slot) => ({
    start: slot.start,
    end: slot.end,
    label: dayjs(slot.start).format('hh:mm A'),
    booked: isBusyInterval(new Date(slot.start), new Date(slot.end), busyIntervals),
  }));
};

export const createCalendarEvent = async (params: {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  clientEmail: string;
}) => {
  if (!hasConnectedCalendarAuth()) {
    return {
      eventId: `mock_event_${Date.now()}`,
      meetLink: null,
    };
  }

  try {
    const cal = getCalendarClient();
    const res = await cal.events.insert({
      calendarId: env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: {
        summary: params.title,
        description: params.description,
        start: { dateTime: params.startTime, timeZone: 'Asia/Kolkata' },
        end: { dateTime: params.endTime, timeZone: 'Asia/Kolkata' },
        attendees: [{ email: params.clientEmail }],
        conferenceData: { createRequest: { requestId: `kosmic-${Date.now()}` } },
      },
      conferenceDataVersion: 1,
    });

    const meetLink =
      res.data.hangoutLink ||
      res.data.conferenceData?.entryPoints?.find((entryPoint) => entryPoint.entryPointType === 'video')?.uri ||
      res.data.htmlLink ||
      null;

    return {
      eventId: res.data.id || `event_${Date.now()}`,
      meetLink,
    };
  } catch (err) {
    console.warn('[MOCK CALENDAR] Falling back to mock event creation:', getErrorMessage(err));
    return {
      eventId: `mock_event_${Date.now()}`,
      meetLink: null,
    };
  }
};
