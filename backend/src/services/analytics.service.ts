import { BookingStatus, PaymentStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED];
const ADMIN_TIMEZONE = 'Asia/Kolkata';

const formatScheduleDay = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: ADMIN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const serializeBooking = (booking: {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientTimezone: string;
  bookingDateTime: Date;
  createdAt: Date;
  status: BookingStatus;
  service: {
    title: string;
    slug: string;
    durationMin: number;
    price: number;
    sessionMode: string;
  };
  payment: {
    status: PaymentStatus;
    amount: number;
    currency: string;
    orderId: string;
    transactionId: string | null;
  } | null;
  intakeForm?: {
    keyConcern: string | null;
    birthPlace: string | null;
  } | null;
  calendarEvent?: {
    meetLink: string | null;
  } | null;
}) => ({
  id: booking.id,
  clientName: booking.clientName,
  clientEmail: booking.clientEmail,
  clientPhone: booking.clientPhone,
  clientTimezone: booking.clientTimezone,
  bookingDateTime: booking.bookingDateTime.toISOString(),
  createdAt: booking.createdAt.toISOString(),
  status: booking.status,
  service: booking.service,
  paymentStatus: booking.payment?.status || PaymentStatus.PENDING,
  amount: booking.payment?.amount || booking.service.price,
  currency: booking.payment?.currency || 'INR',
  orderId: booking.payment?.orderId || null,
  transactionId: booking.payment?.transactionId || null,
  keyConcern: booking.intakeForm?.keyConcern || null,
  birthPlace: booking.intakeForm?.birthPlace || null,
  meetLink: booking.calendarEvent?.meetLink || null,
});

export const getDashboardAnalytics = async () => {
  const now = new Date();
  const scheduleWindowEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    totalRevenue,
    totalBookings,
    confirmedBookings,
    pendingBookings,
    upcomingSessions,
    totalWebinars,
    totalServices,
    uniqueCustomers,
    recentBookings,
    upcomingSchedule,
    scheduleBookings,
    services,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: PaymentStatus.SUCCESS } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
    prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
    prisma.booking.count({
      where: {
        status: { in: ACTIVE_BOOKING_STATUSES },
        bookingDateTime: { gte: now },
      },
    }),
    prisma.webinar.count(),
    prisma.service.count(),
    prisma.booking.findMany({
      distinct: ['clientEmail'],
      select: { clientEmail: true },
    }),
    prisma.booking.findMany({
      take: 12,
      orderBy: { createdAt: 'desc' },
      include: {
        service: {
          select: {
            title: true,
            slug: true,
            durationMin: true,
            price: true,
            sessionMode: true,
          },
        },
        payment: {
          select: {
            status: true,
            amount: true,
            currency: true,
            orderId: true,
            transactionId: true,
          },
        },
        intakeForm: {
          select: {
            keyConcern: true,
            birthPlace: true,
          },
        },
        calendarEvent: {
          select: {
            meetLink: true,
          },
        },
      },
    }),
    prisma.booking.findMany({
      take: 20,
      where: {
        status: { in: ACTIVE_BOOKING_STATUSES },
        bookingDateTime: { gte: now },
      },
      orderBy: { bookingDateTime: 'asc' },
      include: {
        service: {
          select: {
            title: true,
            slug: true,
            durationMin: true,
            price: true,
            sessionMode: true,
          },
        },
        payment: {
          select: {
            status: true,
            amount: true,
            currency: true,
            orderId: true,
            transactionId: true,
          },
        },
        intakeForm: {
          select: {
            keyConcern: true,
            birthPlace: true,
          },
        },
        calendarEvent: {
          select: {
            meetLink: true,
          },
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        status: { in: ACTIVE_BOOKING_STATUSES },
        bookingDateTime: {
          gte: now,
          lt: scheduleWindowEnd,
        },
      },
      orderBy: { bookingDateTime: 'asc' },
      select: {
        bookingDateTime: true,
        status: true,
        service: {
          select: {
            title: true,
            durationMin: true,
          },
        },
      },
    }),
    prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        bookings: {
          select: {
            status: true,
            bookingDateTime: true,
            payment: {
              select: {
                status: true,
                amount: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const scheduleLoadMap = new Map<
    string,
    {
      day: string;
      totalSessions: number;
      confirmedSessions: number;
      pendingSessions: number;
      bookedMinutes: number;
      services: string[];
    }
  >();

  for (const booking of scheduleBookings) {
    const day = formatScheduleDay(booking.bookingDateTime);
    const dayLoad = scheduleLoadMap.get(day) || {
      day,
      totalSessions: 0,
      confirmedSessions: 0,
      pendingSessions: 0,
      bookedMinutes: 0,
      services: [],
    };

    dayLoad.totalSessions += 1;
    dayLoad.bookedMinutes += booking.service.durationMin;

    if (booking.status === BookingStatus.CONFIRMED) {
      dayLoad.confirmedSessions += 1;
    }

    if (booking.status === BookingStatus.PENDING) {
      dayLoad.pendingSessions += 1;
    }

    if (!dayLoad.services.includes(booking.service.title)) {
      dayLoad.services.push(booking.service.title);
    }

    scheduleLoadMap.set(day, dayLoad);
  }

  const serviceDemand = services
    .map((service) => {
      const totalRequests = service.bookings.length;
      const confirmedRequests = service.bookings.filter(
        (booking) => booking.status === BookingStatus.CONFIRMED
      ).length;
      const pendingRequests = service.bookings.filter(
        (booking) => booking.status === BookingStatus.PENDING
      ).length;
      const cancelledRequests = service.bookings.filter(
        (booking) => booking.status === BookingStatus.CANCELLED
      ).length;
      const failedRequests = service.bookings.filter(
        (booking) => booking.status === BookingStatus.FAILED
      ).length;
      const revenueCollected = service.bookings.reduce((sum, booking) => {
        if (booking.payment?.status === PaymentStatus.SUCCESS) {
          return sum + booking.payment.amount;
        }

        return sum;
      }, 0);

      const lastRequestedAt =
        service.bookings.reduce<Date | null>((latest, booking) => {
          if (!latest || booking.bookingDateTime > latest) {
            return booking.bookingDateTime;
          }

          return latest;
        }, null)?.toISOString() || null;

      return {
        id: service.id,
        slug: service.slug,
        title: service.title,
        durationMin: service.durationMin,
        price: service.price,
        sessionMode: service.sessionMode,
        totalRequests,
        confirmedRequests,
        pendingRequests,
        cancelledRequests,
        failedRequests,
        revenueCollected,
        lastRequestedAt,
      };
    })
    .sort((left, right) => {
      if (right.totalRequests !== left.totalRequests) {
        return right.totalRequests - left.totalRequests;
      }

      return right.revenueCollected - left.revenueCollected;
    });

  return {
    summary: {
      leadsCaptured: totalLeads,
      revenueCollected: totalRevenue._sum.amount || 0,
      totalBookings,
      bookingsConfirmed: confirmedBookings,
      pendingBookings,
      upcomingSessions,
      totalWebinars,
      totalServices,
      uniqueCustomers: uniqueCustomers.length,
    },
    serviceDemand,
    recentBookings: recentBookings.map(serializeBooking),
    upcomingSchedule: upcomingSchedule.map(serializeBooking),
    scheduleLoad: Array.from(scheduleLoadMap.values()).sort((left, right) =>
      left.day.localeCompare(right.day)
    ),
  };
};
