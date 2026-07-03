export type ScoopTierName = "Small Scoop" | "Medium Scoop" | "Large Scoop";

export type AddOnName = "Re-scoop" | "Guarantee a theme" | "Lucky capsule";

export type OrderStatus =
  | "Pending"
  | "Awaiting Approval"
  | "Scooped"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type ScoopTier = {
  id: string;
  name: ScoopTierName;
  priceCents: number;
  volumeMl: number;
  description: string;
  imageHint: string;
  bestValue?: boolean;
};

export type AddOn = {
  id: string;
  name: AddOnName;
  priceCents: number;
  description: string;
  enabledByDefault?: boolean;
};

export type CartLine = {
  label: string;
  priceCents: number;
  quantity: number;
};

export type CartSelection = {
  tierId: string;
  addOnIds: string[];
};

export type CartSummary = {
  lines: CartLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  pointsEarned: number;
};

export type CustomerOrder = {
  id: string;
  tierName: ScoopTierName;
  status: OrderStatus;
  itemCount: number;
  createdAt: string;
  packingVideoUrl?: string;
  scoopPhotoUrl?: string;
  totalCents: number;
  approvalExpiresAt?: string;
  reScoopCount: number;
  reScoopLimit: number;
};

export type InventoryItem = {
  id: string;
  itemName: string;
  category: string;
  onHandGrams: number;
  reservedGrams: number;
  availableGrams: number;
  lowStockThreshold: number;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  scoopPoints: number;
  memberSince: string;
};
