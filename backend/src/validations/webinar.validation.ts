import { z } from 'zod';

export const registerWebinarSchema = z.object({
  body: z.object({
    webinarId: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
  })
});
