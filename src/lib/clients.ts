import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import Stripe from "stripe";

let prismaClient: PrismaClient | null = null;
let stripeClient: Stripe | null = null;
let prismaPool: Pool | null = null;

export function getPrisma(): PrismaClient {
  if (!prismaClient) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Prisma/Supabase database access.");
    }

    prismaPool = new Pool({
      connectionString,
      max: 5,
    });
    const adapter = new PrismaPg(prismaPool);
    prismaClient = new PrismaClient({ adapter });
  }
  return prismaClient;
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
