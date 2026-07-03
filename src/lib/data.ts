import type { AddOn, CustomerOrder, InventoryItem, ScoopTier, UserProfile } from "./types";

export const scoopTiers: ScoopTier[] = [
  {
    id: "small",
    name: "Small Scoop",
    priceCents: 699,
    volumeMl: 7,
    description: "7 basic items + 2 premium items",
    imageHint: "small scoop",
  },
  {
    id: "medium",
    name: "Medium Scoop",
    priceCents: 1199,
    volumeMl: 12,
    description: "12 basic items + 3 premium items",
    imageHint: "medium scoop",
    bestValue: true,
  },
  {
    id: "large",
    name: "Large Scoop",
    priceCents: 1699,
    volumeMl: 15,
    description: "15 basic items + 5 premium items",
    imageHint: "large scoop",
  },
];

export const addOns: AddOn[] = [
  {
    id: "re-scoop",
    name: "Re-scoop",
    priceCents: 499,
    description: "Do not love your scoop? Get another shot.",
    enabledByDefault: true,
  },
  {
    id: "theme",
    name: "Guarantee a theme",
    priceCents: 399,
    description: "Pick a vibe. We will pack with that in mind.",
  },
  {
    id: "lucky-capsule",
    name: "Lucky capsule",
    priceCents: 299,
    description: "Add a sealed capsule with a bonus surprise.",
    enabledByDefault: true,
  },
];

export const currentUser: UserProfile = {
  id: "user_demo_alex",
  name: "Alex",
  email: "alex@example.com",
  scoopPoints: 1280,
  memberSince: "April 2024",
};

export const demoOrders: CustomerOrder[] = [
  {
    id: "MS-12488",
    tierName: "Small Scoop",
    status: "Pending",
    itemCount: 2,
    createdAt: "2026-05-18",
    totalCents: 3796,
    reScoopCount: 0,
    reScoopLimit: 1,
  },
  {
    id: "MS-12487",
    tierName: "Medium Scoop",
    status: "Awaiting Approval",
    itemCount: 1,
    createdAt: "2026-05-16",
    scoopPhotoUrl: "/mystery-scoop-hero.png",
    totalCents: 3796,
    approvalExpiresAt: new Date(Date.now() + 4 * 60 * 1000 + 32 * 1000).toISOString(),
    reScoopCount: 0,
    reScoopLimit: 1,
  },
  {
    id: "MS-12486",
    tierName: "Large Scoop",
    status: "Scooped",
    itemCount: 1,
    createdAt: "2026-05-13",
    totalCents: 5797,
    reScoopCount: 1,
    reScoopLimit: 1,
  },
  {
    id: "MS-12485",
    tierName: "Medium Scoop",
    status: "Shipped",
    itemCount: 1,
    createdAt: "2026-05-09",
    totalCents: 2998,
    reScoopCount: 0,
    reScoopLimit: 1,
  },
];

export const inventoryItems: InventoryItem[] = [
  {
    id: "crystal-charm-mix",
    itemName: "Crystal charm mix",
    category: "Charms",
    onHandGrams: 1240,
    reservedGrams: 320,
    availableGrams: 920,
    lowStockThreshold: 300,
  },
  {
    id: "mini-food-eraser",
    itemName: "Mini food eraser",
    category: "Miniatures",
    onHandGrams: 280,
    reservedGrams: 210,
    availableGrams: 70,
    lowStockThreshold: 120,
  },
  {
    id: "acrylic-keychain",
    itemName: "Acrylic keychain",
    category: "Stationery",
    onHandGrams: 190,
    reservedGrams: 90,
    availableGrams: 60,
    lowStockThreshold: 95,
  },
  {
    id: "lucky-capsule",
    itemName: "Lucky capsule",
    category: "Add-ons",
    onHandGrams: 96,
    reservedGrams: 20,
    availableGrams: 76,
    lowStockThreshold: 40,
  },
  {
    id: "sticker-flakes",
    itemName: "Sticker flakes",
    category: "Stationery",
    onHandGrams: 2000,
    reservedGrams: 410,
    availableGrams: 1590,
    lowStockThreshold: 300,
  },
];
