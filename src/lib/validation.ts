import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const cartSchema = z.object({
  tierId: z.string().min(1),
  addOnIds: z.array(z.string()).default([]),
});

export const statusSchema = z.object({
  status: z.enum(["Pending", "Awaiting Approval", "Scooped", "Shipped", "Delivered", "Cancelled"]),
});

export const videoSchema = z.object({
  packingVideoUrl: z.url(),
  scoopPhotoUrl: z.url().or(z.string().startsWith("/")).optional(),
});

export const inventoryUpdateSchema = z.object({
  itemId: z.string().min(1),
  onHandGrams: z.number().int().nonnegative(),
  reservedGrams: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative(),
});
