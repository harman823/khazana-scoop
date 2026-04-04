import { z } from 'zod';

export const cancelBookingSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1)
  })
});

export const rescheduleBookingSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1),
    newBookingDateTime: z.string().datetime()
  })
});
