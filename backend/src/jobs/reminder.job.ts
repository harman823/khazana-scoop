import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { sendSessionReminder } from '../services/notification.service';

export const runReminderSweep = async (now = new Date()) => {
  // Calculate start intervals for strict 24h & 1h queries
  // Look for bookings exactly in range of hour
  const next1hStart = new Date(now.getTime() + 1 * 60 * 60 * 1000);
  const next1hEnd = new Date(next1hStart.getTime() + 60 * 60 * 1000);
  
  const next24hStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const next24hEnd = new Date(next24hStart.getTime() + 60 * 60 * 1000);

  const findReminders = async (start: Date, end: Date, remType: 'REMINDER_1HR' | 'REMINDER_24HR') => {
    return prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        bookingDateTime: {
          gte: start,
          lt: end,
        },
        // Prevent duplicates
        reminderLogs: {
          none: { type: remType }
        }
      },
      include: { service: true, calendarEvent: true }
    });
  };

  const [oneHourBookings, twentyFourHourBookings] = await Promise.all([
    findReminders(next1hStart, next1hEnd, 'REMINDER_1HR'),
    findReminders(next24hStart, next24hEnd, 'REMINDER_24HR')
  ]);

  for (const b of oneHourBookings) {
    const success = await sendSessionReminder({
      clientEmail: b.clientEmail,
      clientName: b.clientName,
      serviceTitle: b.service.title,
      dateTime: b.bookingDateTime.toISOString(),
      clientTimezone: b.clientTimezone,
      meetLink: b.calendarEvent?.meetLink,
      reminderWindowLabel: '1 hour',
    });
    await prisma.reminderLog.create({
      data: {
        bookingId: b.id,
        type: 'REMINDER_1HR',
        success,
        errorStr: success ? null : 'Email delivery failed',
      }
    });
  }

  for (const b of twentyFourHourBookings) {
    const success = await sendSessionReminder({
      clientEmail: b.clientEmail,
      clientName: b.clientName,
      serviceTitle: b.service.title,
      dateTime: b.bookingDateTime.toISOString(),
      clientTimezone: b.clientTimezone,
      meetLink: b.calendarEvent?.meetLink,
      reminderWindowLabel: '24 hours',
    });
    await prisma.reminderLog.create({
      data: {
        bookingId: b.id,
        type: 'REMINDER_24HR',
        success,
        errorStr: success ? null : 'Email delivery failed',
      }
    });
  }

  return {
    checkedAt: now.toISOString(),
    remindersSent1Hour: oneHourBookings.length,
    remindersSent24Hour: twentyFourHourBookings.length,
  };
};

export const initReminderJobs = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Running hourly reminder checks...', new Date().toISOString());

    try {
      const result = await runReminderSweep();
      console.log('[CRON] Reminder sweep completed.', result);
    } catch (e) {
      console.error('[CRON] Failed running reminders', e);
    }
  });
};
