import { prisma } from './src/lib/prisma';

async function sweep() {
  const ids = (await prisma.booking.findMany({ where: { status: 'PENDING' } })).map((b: any) => b.id);
  if (ids.length > 0) {
    await prisma.$transaction([
      prisma.intakeForm.deleteMany({ where: { bookingId: { in: ids } } }),
      prisma.payment.deleteMany({ where: { bookingId: { in: ids } } }),
      prisma.calendarEventMap.deleteMany({ where: { bookingId: { in: ids } } }),
      prisma.reminderLog.deleteMany({ where: { bookingId: { in: ids } } }),
      prisma.booking.deleteMany({ where: { id: { in: ids } } })
    ]);
    console.log('Swept ' + ids.length + ' bookings!');
  } else {
    console.log('No pending bookings to clear.');
  }
}

sweep().finally(() => process.exit(0));
