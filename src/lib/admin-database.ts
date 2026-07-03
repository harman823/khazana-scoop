import { getPrisma } from "@/lib/clients";
import { requireDatabase } from "@/lib/production-store";

export type AdminTableKey =
  | "users"
  | "orders"
  | "orderItems"
  | "inventory"
  | "tiers"
  | "addons"
  | "payments"
  | "shipping"
  | "reviews"
  | "points"
  | "storage";

export type AdminTableColumn = {
  key: string;
  label: string;
};

export type AdminTableConfig = {
  key: AdminTableKey;
  label: string;
  description: string;
  columns: AdminTableColumn[];
  primaryAction?: {
    label: string;
    href: string;
  };
};

export type AdminTableSnapshot = AdminTableConfig & {
  count: number;
  rows: Record<string, unknown>[];
  source: "supabase";
};

type CountRow = {
  count: bigint | number | string;
};

export const adminTableConfigs: AdminTableConfig[] = [
  {
    key: "orders",
    label: "Orders",
    description: "Customer order status, totals, approval timers, and video/photo links.",
    columns: [
      { key: "id", label: "Order ID" },
      { key: "status", label: "Status" },
      { key: "totalCents", label: "Total" },
      { key: "createdAt", label: "Created" },
    ],
    primaryAction: { label: "Manage orders", href: "/admin/fulfillment" },
  },
  {
    key: "inventory",
    label: "Bulk inventory",
    description: "Stock on hand, reserved amounts, low-stock thresholds, and item categories.",
    columns: [
      { key: "itemName", label: "Item" },
      { key: "category", label: "Category" },
      { key: "totalWeightGrams", label: "On hand" },
      { key: "reservedGrams", label: "Reserved" },
      { key: "lowStockThreshold", label: "Threshold" },
    ],
    primaryAction: { label: "Manage inventory", href: "/admin/inventory" },
  },
  {
    key: "storage",
    label: "Storage assets",
    description: "Supabase bucket objects for product images, scoop photos, videos, and avatars.",
    columns: [
      { key: "kind", label: "Use" },
      { key: "bucket", label: "Bucket" },
      { key: "path", label: "Path" },
      { key: "createdAt", label: "Created" },
    ],
    primaryAction: { label: "Storage setup", href: "/admin/database?table=storage" },
  },
  {
    key: "users",
    label: "Users",
    description: "Customer and admin profiles, roles, points, and account dates.",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "scoopPoints", label: "Points" },
    ],
  },
  {
    key: "tiers",
    label: "Scoop tiers",
    description: "Small, Medium, and Large scoop storefront pricing.",
    columns: [
      { key: "name", label: "Name" },
      { key: "priceCents", label: "Price" },
      { key: "baseVolumeMl", label: "Volume" },
      { key: "active", label: "Active" },
    ],
  },
  {
    key: "addons",
    label: "Add-ons",
    description: "Re-scoop, theme guarantee, lucky capsule, and future add-ons.",
    columns: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "priceCents", label: "Price" },
      { key: "active", label: "Active" },
    ],
  },
  {
    key: "payments",
    label: "Payments",
    description: "Stripe checkout session references, amounts, and payment states.",
    columns: [
      { key: "orderId", label: "Order" },
      { key: "provider", label: "Provider" },
      { key: "status", label: "Status" },
      { key: "amountCents", label: "Amount" },
    ],
  },
  {
    key: "shipping",
    label: "Shipping",
    description: "Recipient details, destinations, and tracking numbers.",
    columns: [
      { key: "orderId", label: "Order" },
      { key: "recipientName", label: "Recipient" },
      { key: "postalCode", label: "Postal code" },
      { key: "trackingNumber", label: "Tracking" },
    ],
  },
  {
    key: "orderItems",
    label: "Order items",
    description: "Line items connecting orders to scoop tiers and add-ons.",
    columns: [
      { key: "orderId", label: "Order" },
      { key: "tierId", label: "Tier" },
      { key: "addOnId", label: "Add-on" },
      { key: "quantity", label: "Qty" },
    ],
  },
  {
    key: "reviews",
    label: "Reviews",
    description: "Customer ratings and feedback on completed scoop experiences.",
    columns: [
      { key: "userId", label: "User" },
      { key: "orderId", label: "Order" },
      { key: "rating", label: "Rating" },
      { key: "createdAt", label: "Created" },
    ],
  },
  {
    key: "points",
    label: "Scoop points ledger",
    description: "Every reward points credit or adjustment for customer accounts.",
    columns: [
      { key: "userId", label: "User" },
      { key: "orderId", label: "Order" },
      { key: "points", label: "Points" },
      { key: "reason", label: "Reason" },
    ],
  },
];

export function getAdminTableConfig(key: string | undefined): AdminTableConfig {
  return adminTableConfigs.find((table) => table.key === key) ?? adminTableConfigs[0];
}

export async function getAdminTableSnapshot(key: AdminTableKey): Promise<AdminTableSnapshot> {
  const config = getAdminTableConfig(key);
  requireDatabase();
  const [count, rows] = await Promise.all([getTableCount(key), getTableRows(key)]);
  return {
    ...config,
    count,
    rows,
    source: "supabase",
  };
}

async function getTableCount(key: AdminTableKey): Promise<number> {
  const prisma = getPrisma();
  const rows = await prisma.$queryRawUnsafe<CountRow[]>(`select count(*) as count from ${getQuotedTableName(key)}`);
  const value = rows[0]?.count ?? 0;

  return Number(value);
}

async function getTableRows(key: AdminTableKey): Promise<Record<string, unknown>[]> {
  const prisma = getPrisma();
  return prisma.$queryRawUnsafe<Record<string, unknown>[]>(
    `select * from ${getQuotedTableName(key)} order by ${getOrderColumn(key)} desc limit 25`,
  );
}

function getQuotedTableName(key: AdminTableKey): string {
  const names: Record<AdminTableKey, string> = {
    users: '"User"',
    orders: '"Order"',
    orderItems: '"OrderItem"',
    inventory: '"BulkInventory"',
    tiers: '"ScoopTier"',
    addons: '"AddOn"',
    payments: '"Payment"',
    shipping: '"Shipping"',
    reviews: '"Review"',
    points: '"ScoopPointsLedger"',
    storage: '"StorageAsset"',
  };

  return names[key];
}

function getOrderColumn(key: AdminTableKey): string {
  if (key === "inventory" || key === "storage" || key === "orders") {
    return '"updatedAt"';
  }

  if (key === "tiers" || key === "addons" || key === "orderItems") {
    return '"id"';
  }

  return '"createdAt"';
}
