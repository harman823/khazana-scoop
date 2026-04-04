import { PaymentStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { sendEmail } from './notification.service';
import dayjs from 'dayjs';
import { findDatabaseConflict, hasCalendarConflict } from './calendar.service';

export const cancelBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true }
  });

  if (!booking) throw new Error('Booking not found');
  if (booking.status === 'CANCELLED') throw new Error('Booking is already cancelled');

  // Verify Refund Window (e.g. 24h before)
  const isEligibleForRefund = booking.bookingDateTime.getTime() > Date.now() + 24 * 60 * 60 * 1000;

  // Process Cancel atomically
  const updatedBooking = await prisma.$transaction(async (tx: any) => {
    // 1. Mark booking as cancelled
    const b = await tx.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { service: true }
    });

    // 2. Remove calendar mapping safely if exists
    await tx.calendarEventMap.deleteMany({ where: { bookingId } });

    // 3. Mark payment as Refunded if eligible
    if (isEligibleForRefund) {
      await tx.payment.updateMany({
        where: { bookingId },
        data: { status: PaymentStatus.REFUNDED }
      });
    }

    return b;
  });

  // Notify Client
  const refundText = isEligibleForRefund 
    ? 'Your payment will be refunded within 5-7 business days.' 
    : 'As per policy, cancellations under 24 hours are non-refundable.';

  await sendEmail({
    to: updatedBooking.clientEmail,
    subject: `Booking Cancelled: ${updatedBooking.service.title}`,
    html: `<p>Your booking for ${updatedBooking.service.title} on ${updatedBooking.bookingDateTime.toLocaleDateString()} has been cancelled.</p><p>${refundText}</p>`
  });

  return { updatedBooking, refunded: isEligibleForRefund };
};

export const rescheduleBooking = async (bookingId: string, newDateTime: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true }
  });

  if (!booking) throw new Error('Booking not found');
  if (booking.status !== 'CONFIRMED') throw new Error('Only confirmed bookings can be rescheduled');

  const parsedDate = new Date(newDateTime);
  const bookingDayKey = dayjs(parsedDate).format('YYYY-MM-DD');
  const calendarConflict = await hasCalendarConflict(parsedDate, booking.service.durationMin);

  if (calendarConflict) throw new Error('The requested time slot is not available');

  const updatedBooking = await prisma.$transaction(async (tx: any) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`booking-day:${bookingDayKey}`}))`;

    const conflict = await findDatabaseConflict(tx, parsedDate, booking.service.durationMin, bookingId);

    if (conflict) throw new Error('The requested time slot is not available');

    return tx.booking.update({
      where: { id: bookingId },
      data: { bookingDateTime: parsedDate },
      include: { service: true }
    });
  });

  await sendEmail({
    to: updatedBooking.clientEmail,
    subject: `Booking Rescheduled: ${updatedBooking.service.title}`,
    html: `<p>Your booking has been successfully rescheduled to ${updatedBooking.bookingDateTime.toLocaleString()}.</p>`
  });

  return updatedBooking;
};
