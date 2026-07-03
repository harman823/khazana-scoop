import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import {
  AddOnType,
  OrderStatus as PrismaOrderStatus,
  Role,
  type AddOn as PrismaAddOn,
  type BulkInventory,
  type Order,
  type ScoopTier as PrismaScoopTier,
  type User,
} from "@prisma/client";
import { addOns, inventoryItems, scoopTiers } from "@/lib/data";
import { getPrisma, hasDatabaseUrl } from "@/lib/clients";
import { SHIPPING_CENTS } from "@/lib/pricing";
import type { AddOn, CartLine, CartSelection, CartSummary, CustomerOrder, InventoryItem, OrderStatus, ScoopTier, UserProfile } from "@/lib/types";

export const SESSION_COOKIE_NAME = "mystery_scoop_session";

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
  ) {
    super(message);
  }
}

export type SessionResult = {
  user: UserProfile;
  token: string;
  expiresAt: Date;
};

const addOnTypes: Record<string, AddOnType> = {
  "re-scoop": AddOnType.RE_SCOOP,
  theme: AddOnType.THEME_GUARANTEE,
  "lucky-capsule": AddOnType.LUCKY_CAPSULE,
};

export function requireDatabase(): void {
  if (!hasDatabaseUrl()) {
    throw new ServiceError("Database is not configured. Set DATABASE_URL to your Supabase Postgres connection string.", 503);
  }
}

export async function ensureCatalogSeed(): Promise<void> {
  requireDatabase();
  const prisma = getPrisma();
  const [tierCount, addOnCount, inventoryCount] = await Promise.all([
    prisma.scoopTier.count(),
    prisma.addOn.count(),
    prisma.bulkInventory.count(),
  ]);

  if (tierCount === 0) {
    await prisma.scoopTier.createMany({
      data: scoopTiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        priceCents: tier.priceCents,
        baseVolumeMl: tier.volumeMl,
        imageUrl: "/mystery-scoop-hero.png",
        description: tier.description,
        active: true,
      })),
    });
  }

  if (addOnCount === 0) {
    await prisma.addOn.createMany({
      data: addOns.map((addOn) => ({
        id: addOn.id,
        name: addOn.name,
        priceCents: addOn.priceCents,
        type: addOnTypes[addOn.id] ?? AddOnType.LUCKY_CAPSULE,
        description: addOn.description,
        active: true,
      })),
    });
  }

  if (inventoryCount === 0) {
    await prisma.bulkInventory.createMany({
      data: inventoryItems.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        category: item.category,
        totalWeightGrams: item.onHandGrams,
        reservedGrams: item.reservedGrams,
        lowStockThreshold: item.lowStockThreshold,
      })),
    });
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<SessionResult> {
  requireDatabase();
  const prisma = getPrisma();
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    throw new ServiceError("An account already exists for this email address.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
      role: Role.USER,
    },
  });

  return createSessionForUser(user);
}

export async function loginUser(email: string, password: string): Promise<SessionResult> {
  requireDatabase();
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

  if (!user) {
    throw new ServiceError("Invalid credentials.", 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ServiceError("Invalid credentials.", 401);
  }

  return createSessionForUser(user);
}

export async function logoutUser(sessionToken: string | undefined): Promise<void> {
  if (!sessionToken || !hasDatabaseUrl()) return;

  const prisma = getPrisma();
  await prisma.session.deleteMany({
    where: {
      tokenHash: hashToken(sessionToken),
    },
  });
}

export async function getUserFromSession(sessionToken: string | undefined): Promise<UserProfile | null> {
  if (!sessionToken || !hasDatabaseUrl()) return null;

  const prisma = getPrisma();
  const session = await prisma.session.findUnique({
    include: { user: true },
    where: { tokenHash: hashToken(sessionToken) },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return toUserProfile(session.user);
}

export async function requireUserFromSession(sessionToken: string | undefined): Promise<UserProfile> {
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    throw new ServiceError("Authentication required.", 401);
  }

  return user;
}

export async function getCatalog(): Promise<{ tiers: ScoopTier[]; addOns: AddOn[] }> {
  await ensureCatalogSeed();
  const prisma = getPrisma();
  const [tiers, catalogAddOns] = await Promise.all([
    prisma.scoopTier.findMany({ where: { active: true }, orderBy: { priceCents: "asc" } }),
    prisma.addOn.findMany({ where: { active: true }, orderBy: { priceCents: "desc" } }),
  ]);

  return {
    tiers: tiers.map(toScoopTier),
    addOns: catalogAddOns.map(toAddOn),
  };
}

export async function calculateDatabaseCart(selection: CartSelection): Promise<CartSummary> {
  await ensureCatalogSeed();
  const prisma = getPrisma();
  const tier = await prisma.scoopTier.findFirst({
    where: {
      active: true,
      OR: [{ id: selection.tierId }, { name: selection.tierId }],
    },
  });

  if (!tier) {
    throw new ServiceError("Selected scoop tier is unavailable.", 404);
  }

  const selectedAddOns = selection.addOnIds.length
    ? await prisma.addOn.findMany({
        where: {
          active: true,
          id: { in: selection.addOnIds },
        },
      })
    : [];
  const lines: CartLine[] = [
    { label: tier.name, priceCents: tier.priceCents, quantity: 1 },
    ...selectedAddOns.map((addOn) => ({
      label: addOn.name,
      priceCents: addOn.priceCents,
      quantity: 1,
    })),
  ];
  const subtotalCents = lines.reduce((total, line) => total + line.priceCents * line.quantity, 0);
  const totalCents = subtotalCents + SHIPPING_CENTS;

  return {
    lines,
    subtotalCents,
    shippingCents: SHIPPING_CENTS,
    totalCents,
    pointsEarned: Math.floor(totalCents / 10),
  };
}

export async function createOrder(userId: string, selection: CartSelection): Promise<CustomerOrder> {
  await ensureCatalogSeed();
  const prisma = getPrisma();
  const tier = await prisma.scoopTier.findFirst({
    where: { active: true, OR: [{ id: selection.tierId }, { name: selection.tierId }] },
  });

  if (!tier) {
    throw new ServiceError("Selected scoop tier is unavailable.", 404);
  }

  const selectedAddOns = selection.addOnIds.length
    ? await prisma.addOn.findMany({ where: { active: true, id: { in: selection.addOnIds } } })
    : [];
  const totalCents = await calculateTotalCents(tier, selectedAddOns);
  const hasReScoop = selectedAddOns.some((addOn) => addOn.type === AddOnType.RE_SCOOP);
  const order = await prisma.order.create({
    data: {
      userId,
      status: PrismaOrderStatus.PENDING,
      totalCents,
      reScoopLimit: hasReScoop ? 1 : 0,
      items: {
        create: [
          {
            tierId: tier.id,
            quantity: 1,
            priceCents: tier.priceCents,
          },
          ...selectedAddOns.map((addOn) => ({
            addOnId: addOn.id,
            quantity: 1,
            priceCents: addOn.priceCents,
          })),
        ],
      },
    },
    include: { items: { include: { tier: true } } },
  });

  return toCustomerOrder(order, tier.name, selectedAddOns.length + 1);
}

export async function listOrders(userId?: string): Promise<CustomerOrder[]> {
  requireDatabase();
  const prisma = getPrisma();
  const orders = await prisma.order.findMany({
    include: { items: { include: { tier: true } } },
    orderBy: { createdAt: "desc" },
    where: userId ? { userId } : undefined,
  });

  return orders.map((order) => {
    const tierName = order.items.find((item) => item.tier)?.tier?.name ?? "Medium Scoop";
    return toCustomerOrder(order, tierName, order.items.length);
  });
}

export async function getOrder(orderId: string): Promise<CustomerOrder | null> {
  requireDatabase();
  const prisma = getPrisma();
  const order = await prisma.order.findUnique({
    include: { items: { include: { tier: true } } },
    where: { id: orderId },
  });

  if (!order) return null;

  const tierName = order.items.find((item) => item.tier)?.tier?.name ?? "Medium Scoop";
  return toCustomerOrder(order, tierName, order.items.length);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<CustomerOrder | null> {
  requireDatabase();
  const prisma = getPrisma();
  const order = await prisma.order.update({
    data: { status: toPrismaOrderStatus(status) },
    include: { items: { include: { tier: true } } },
    where: { id: orderId },
  }).catch(() => null);

  if (!order) return null;

  const tierName = order.items.find((item) => item.tier)?.tier?.name ?? "Medium Scoop";
  return toCustomerOrder(order, tierName, order.items.length);
}

export async function attachPackingVideo(orderId: string, packingVideoUrl: string, scoopPhotoUrl?: string): Promise<CustomerOrder | null> {
  requireDatabase();
  const prisma = getPrisma();
  const order = await prisma.order.update({
    data: {
      approvalExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      packingVideoUrl,
      scoopPhotoUrl,
      status: PrismaOrderStatus.AWAITING_APPROVAL,
    },
    include: { items: { include: { tier: true } } },
    where: { id: orderId },
  }).catch(() => null);

  if (!order) return null;

  const tierName = order.items.find((item) => item.tier)?.tier?.name ?? "Medium Scoop";
  return toCustomerOrder(order, tierName, order.items.length);
}

export async function acceptScoop(orderId: string): Promise<CustomerOrder | null> {
  return updateOrderStatus(orderId, "Scooped");
}

export async function triggerReScoop(orderId: string): Promise<CustomerOrder | null> {
  requireDatabase();
  const prisma = getPrisma();
  const existing = await prisma.order.findUnique({ where: { id: orderId } });

  if (!existing || existing.reScoopCount >= existing.reScoopLimit) {
    return null;
  }

  const order = await prisma.order.update({
    data: {
      approvalExpiresAt: null,
      reScoopCount: { increment: 1 },
      scoopPhotoUrl: null,
      status: PrismaOrderStatus.PENDING,
    },
    include: { items: { include: { tier: true } } },
    where: { id: orderId },
  });
  const tierName = order.items.find((item) => item.tier)?.tier?.name ?? "Medium Scoop";
  return toCustomerOrder(order, tierName, order.items.length);
}

export async function listInventory(): Promise<InventoryItem[]> {
  await ensureCatalogSeed();
  const rows = await getPrisma().bulkInventory.findMany({ orderBy: { itemName: "asc" } });
  return rows.map(toInventoryItem);
}

export async function updateInventory(
  itemId: string,
  onHandGrams: number,
  reservedGrams: number,
  lowStockThreshold: number,
): Promise<InventoryItem | null> {
  requireDatabase();
  const item = await getPrisma().bulkInventory.update({
    data: {
      lowStockThreshold,
      reservedGrams,
      totalWeightGrams: onHandGrams,
    },
    where: { id: itemId },
  }).catch(() => null);

  return item ? toInventoryItem(item) : null;
}

export async function createPaymentForOrder(orderId: string, providerCheckoutSession: string, amountCents: number): Promise<void> {
  requireDatabase();
  await getPrisma().payment.upsert({
    create: {
      amountCents,
      orderId,
      provider: "stripe",
      providerCheckoutSession,
      status: "created",
    },
    update: {
      amountCents,
      providerCheckoutSession,
      status: "created",
    },
    where: { orderId },
  });
}

export async function markStripeCheckoutPaid(orderId: string, checkoutSessionId: string | null): Promise<void> {
  requireDatabase();
  await getPrisma().payment.updateMany({
    data: {
      providerCheckoutSession: checkoutSessionId ?? undefined,
      status: "paid",
    },
    where: { orderId },
  });
}

async function createSessionForUser(user: User): Promise<SessionResult> {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await getPrisma().session.create({
    data: {
      expiresAt,
      tokenHash: hashToken(token),
      userId: user.id,
    },
  });

  return {
    user: toUserProfile(user),
    token,
    expiresAt,
  };
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function calculateTotalCents(tier: PrismaScoopTier, selectedAddOns: PrismaAddOn[]): Promise<number> {
  return tier.priceCents + selectedAddOns.reduce((total, addOn) => total + addOn.priceCents, 0) + SHIPPING_CENTS;
}

function toUserProfile(user: User): UserProfile {
  return {
    email: user.email,
    id: user.id,
    memberSince: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(user.createdAt),
    name: user.name,
    scoopPoints: user.scoopPoints,
  };
}

function toScoopTier(tier: PrismaScoopTier): ScoopTier {
  return {
    description: tier.description,
    id: tier.id,
    imageHint: tier.imageUrl,
    name: tier.name as ScoopTier["name"],
    priceCents: tier.priceCents,
    volumeMl: tier.baseVolumeMl,
  };
}

function toAddOn(addOn: PrismaAddOn): AddOn {
  return {
    description: addOn.description,
    id: addOn.id,
    name: addOn.name as AddOn["name"],
    priceCents: addOn.priceCents,
  };
}

function toInventoryItem(item: BulkInventory): InventoryItem {
  return {
    availableGrams: Math.max(0, item.totalWeightGrams - item.reservedGrams),
    category: item.category,
    id: item.id,
    itemName: item.itemName,
    lowStockThreshold: item.lowStockThreshold,
    onHandGrams: item.totalWeightGrams,
    reservedGrams: item.reservedGrams,
  };
}

function toCustomerOrder(order: Order, tierName: string, itemCount: number): CustomerOrder {
  return {
    approvalExpiresAt: order.approvalExpiresAt?.toISOString(),
    createdAt: order.createdAt.toISOString().slice(0, 10),
    id: order.id,
    itemCount,
    packingVideoUrl: order.packingVideoUrl ?? undefined,
    reScoopCount: order.reScoopCount,
    reScoopLimit: order.reScoopLimit,
    scoopPhotoUrl: order.scoopPhotoUrl ?? undefined,
    status: fromPrismaOrderStatus(order.status),
    tierName: tierName as CustomerOrder["tierName"],
    totalCents: order.totalCents,
  };
}

function toPrismaOrderStatus(status: OrderStatus): PrismaOrderStatus {
  const statuses: Record<OrderStatus, PrismaOrderStatus> = {
    "Awaiting Approval": PrismaOrderStatus.AWAITING_APPROVAL,
    Cancelled: PrismaOrderStatus.CANCELLED,
    Delivered: PrismaOrderStatus.DELIVERED,
    Pending: PrismaOrderStatus.PENDING,
    Scooped: PrismaOrderStatus.SCOOPED,
    Shipped: PrismaOrderStatus.SHIPPED,
  };

  return statuses[status];
}

function fromPrismaOrderStatus(status: PrismaOrderStatus): OrderStatus {
  const statuses: Record<PrismaOrderStatus, OrderStatus> = {
    AWAITING_APPROVAL: "Awaiting Approval",
    CANCELLED: "Cancelled",
    DELIVERED: "Delivered",
    PENDING: "Pending",
    SCOOPED: "Scooped",
    SHIPPED: "Shipped",
  };

  return statuses[status];
}
