export type ProductType = "mystery_scoop" | "build_your_own" | "individual";

export type Variant = {
  id: string;
  name: string;
  tier: "budget" | "standard" | "premium" | string;
  item_count: string;
  min_items: number;
  max_items: number;
  surprise_gift_count: number;
  rules: string[];
  price: number;
  compare_at_price?: number | null;
  badge?: string | null;
  line?: string | null;
  is_default?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  product_type: ProductType;
  category: string;
  description: string;
  price: number;
  image?: string | null;
  badge?: string | null;
  icon?: string | null;
  color?: string | null;
  status: string;
  average_rating: number;
  review_count: number;
  variants: Variant[];
};

export type CartItem = {
  localId: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  item_count?: string | null;
  quantity: number;
  price: number;
  preferences: Record<string, string>;
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  item_count?: string | null;
  quantity: number;
  price: number;
  preferences: Record<string, string>;
};

export type Order = {
  id: string;
  customer: Customer;
  items: OrderItem[];
  order_note: string;
  exclusions: string;
  payment_status: "paid" | "pending" | "failed";
  fulfilment_status: "unfulfilled" | "packed" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  discount_total: number;
  shipping_fee: number;
  total: number;
  promotion_code?: string | null;
  tracking_number: string;
  created_at: string;
};

export type Promotion = {
  id: string;
  name: string;
  title: string;
  message: string;
  code?: string | null;
  promotion_type: "banner" | "combo" | "free_shipping" | string;
  discount_type: "none" | "percentage" | "fixed" | string;
  discount_value: number;
  min_subtotal: number;
  free_shipping: boolean;
  automatic: boolean;
  banner_placement: string;
  starts_at: string;
  ends_at?: string | null;
  product_ids: string[];
};

export type Review = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  created_at: string;
};

export type CatalogQuery = {
  q?: string;
  product_type?: string;
  categories?: string[];
  colors?: string[];
  min_price?: number;
  max_price?: number;
  sort?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  cost_price: number;
  sell_price: number;
  stock: number;
  low_stock_at: number;
  status: string;
  image?: string | null;
};

export type AdminStats = {
  revenue: number;
  paid_orders: number;
  unfulfilled_orders: number;
  products: number;
  inventory_units: number;
  low_stock_items: number;
};
