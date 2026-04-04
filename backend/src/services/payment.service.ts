import crypto from 'crypto';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import { createCalendarEvent } from './calendar.service';
import { sendBookingConfirmation } from './notification.service';

type PaymentVerificationResult = {
  alreadyVerified: boolean;
  meetLink: string | null;
  confirmationEmailSent: boolean;
};

type PaymentWithBooking = {
  id: string;
  bookingId: string;
  status: string;
  transactionId: string | null;
  booking: {
    id: string;
    bookingDateTime: Date;
    clientName: string;
    clientEmail: string;
    clientTimezone: string;
    service: {
      title: string;
      durationMin: number;
    };
    calendarEvent: {
      meetLink: string | null;
      externalEventId: string;
    } | null;
    reminderLogs: Array<{
      id: string;
      type: string;
      success: boolean;
    }>;
  };
};

const usingMockPayment =
  env.RAZORPAY_KEY_ID.toLowerCase().includes('placeholder') ||
  env.RAZORPAY_KEY_SECRET.toLowerCase().includes('placeholder');

const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string) => {
  const generatedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

const loadPaymentWithBooking = async (orderId: string) => {
  return prisma.payment.findUnique({
    where: { orderId },
    include: {
      booking: {
        include: {
          service: true,
          calendarEvent: true,
          reminderLogs: true,
        },
      },
    },
  }) as Promise<PaymentWithBooking | null>;
};

const ensurePostPaymentSideEffects = async (payment: PaymentWithBooking) => {
  const booking = payment.booking;
  let meetLink = booking.calendarEvent?.meetLink || null;
  let confirmationEmailSent = false;

  if (!booking.calendarEvent) {
    const calendarEvent = await createCalendarEvent({
      title: `${booking.service.title} - ${booking.clientName}`,
      description: `Booking confirmation for ${booking.clientName} (${booking.clientEmail})`,
      startTime: booking.bookingDateTime.toISOString(),
      endTime: new Date(booking.bookingDateTime.getTime() + booking.service.durationMin * 60_000).toISOString(),
      clientEmail: booking.clientEmail,
    });

    meetLink = calendarEvent.meetLink;

    await prisma.calendarEventMap.create({
      data: {
        bookingId: booking.id,
        externalEventId: calendarEvent.eventId,
        meetLink: calendarEvent.meetLink,
      },
    });
  }

  const confirmationLog = booking.reminderLogs.find((log) => log.type === 'CONFIRMATION');

  if (!confirmationLog || !confirmationLog.success) {
    confirmationEmailSent = await sendBookingConfirmation({
      clientEmail: booking.clientEmail,
      clientName: booking.clientName,
      serviceTitle: booking.service.title,
      dateTime: booking.bookingDateTime.toISOString(),
      clientTimezone: booking.clientTimezone,
      meetLink,
    });

    if (confirmationLog) {
      await prisma.reminderLog.update({
        where: { id: confirmationLog.id },
        data: {
          sentAt: new Date(),
          success: confirmationEmailSent,
          errorStr: confirmationEmailSent ? null : 'Failed to send booking confirmation email.',
        },
      });
    } else {
      await prisma.reminderLog.create({
        data: {
          bookingId: booking.id,
          type: 'CONFIRMATION',
          success: confirmationEmailSent,
          errorStr: confirmationEmailSent ? null : 'Failed to send booking confirmation email.',
        },
      });
    }
  } else {
    confirmationEmailSent = true;
  }

  return { meetLink, confirmationEmailSent };
};

const finalizeSuccessfulPayment = async (orderId: string, transactionId: string): Promise<PaymentVerificationResult> => {
  const currentPayment = await loadPaymentWithBooking(orderId);

  if (!currentPayment) {
    throw new Error('Payment order not found');
  }

  const alreadyVerified = currentPayment.status === 'SUCCESS';

  if (!alreadyVerified) {
    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { orderId },
        data: {
          status: 'SUCCESS',
          transactionId,
        },
      });

      await tx.booking.update({
        where: { id: currentPayment.bookingId },
        data: { status: 'CONFIRMED' },
      });
    });
  }

  let meetLink: string | null = currentPayment.booking.calendarEvent?.meetLink || null;
  let confirmationEmailSent = false;

  try {
    const refreshedPayment = await loadPaymentWithBooking(orderId);
    if (!refreshedPayment) {
      throw new Error('Payment order not found after confirmation');
    }

    const sideEffects = await ensurePostPaymentSideEffects(refreshedPayment);
    meetLink = sideEffects.meetLink;
    confirmationEmailSent = sideEffects.confirmationEmailSent;
  } catch (err) {
    console.error('Failed to execute post-payment side effects:', err);
  }

  return {
    alreadyVerified,
    meetLink,
    confirmationEmailSent,
  };
};

export const verifyPayment = async (
  orderId: string,
  razorpayPaymentId?: string,
  razorpaySignature?: string,
  webhookEventId?: string
): Promise<PaymentVerificationResult> => {
  if (webhookEventId) {
    const existingWebhook = await prisma.webhookEvent.findUnique({ where: { eventId: webhookEventId } });

    if (existingWebhook) {
      const existingPayment = await loadPaymentWithBooking(orderId);
      return finalizeSuccessfulPayment(orderId, existingPayment?.transactionId || `txn_replay_${Date.now()}`);
    }

    await prisma.webhookEvent.create({
      data: {
        eventId: webhookEventId,
        provider: 'RAZORPAY',
        payload: { orderId, razorpayPaymentId },
        processed: true,
      },
    });
  }

  if (usingMockPayment) {
    return finalizeSuccessfulPayment(orderId, razorpayPaymentId || `txn_mock_${Date.now()}`);
  }

  if (!razorpayPaymentId || !razorpaySignature) {
    throw new Error('Missing Razorpay payment verification fields');
  }

  if (!verifyRazorpaySignature(orderId, razorpayPaymentId, razorpaySignature)) {
    throw new Error('Invalid Razorpay signature');
  }

  return finalizeSuccessfulPayment(orderId, razorpayPaymentId);
};
