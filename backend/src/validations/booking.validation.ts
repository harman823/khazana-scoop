import { z } from 'zod';

export const initiateBookingSchema = z.object({
  body: z.object({
    serviceId: z.string().min(1),
    bookingDateTime: z.string().datetime(),
    clientName: z.string().min(2),
    clientEmail: z.string().email(),
    clientPhone: z.string().min(10),
    clientTimezone: z.string().min(1),
    dob: z.string().optional(),
    birthTime: z.string().optional(),
    birthPlace: z.string().optional(),
    keyConcern: z.string().optional(),
    customQuestions: z.string().optional(),
  }),
});
