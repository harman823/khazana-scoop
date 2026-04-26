import { prisma } from './src/lib/prisma';

async function checkBooking() {
  const latestBooking = await prisma.booking.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      reminderLogs: true,
      payment: true,
      calendarEvent: true,
      service: true
    }
  });
  console.log(JSON.stringify(latestBooking, null, 2));
}

checkBooking().finally(() => process.exit(0));
