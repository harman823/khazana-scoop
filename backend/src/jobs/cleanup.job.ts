import cron from 'node-cron';
import { prisma } from '../lib/prisma';

export const runCleanupSweep = async (now = new Date()) => {
  const lockThreshold = new Date(now.getTime() - 15 * 60 * 1000);

  const staleBookings = await prisma.booking.findMany({
    where: {
      status: 'PENDING',
      createdAt: {
        lt: lockThreshold
      }
    }
  });

  if (staleBookings.length === 0) {
    return {
      checkedAt: now.toISOString(),
      deletedCount: 0,
    };
  }

  const ids = staleBookings.map((b: any) => b.id);

  // We should first delete related intake forms and payments to satisfy FK constraints gracefully
  await prisma.$transaction([
    prisma.intakeForm.deleteMany({ where: { bookingId: { in: ids } } }),
    prisma.payment.deleteMany({ where: { bookingId: { in: ids } } }),
    prisma.booking.deleteMany({ where: { id: { in: ids } } })
  ]);

  return {
    checkedAt: now.toISOString(),
    deletedCount: ids.length,
  };
};

export const initCleanupJobs = () => {
  // Cleanup stale pending bookings every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('[CRON] Sweeping stale pending bookings...', new Date().toISOString());

    try {
      const result = await runCleanupSweep();
      console.log(`[CRON] Cleanup sweep completed. Deleted ${result.deletedCount} stale pending slots.`);
    } catch (err) {
      console.error('[CRON] Failed cleaning up stale bookings:', err);
    }
  });
};
