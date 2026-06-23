export type ProductType = "mystery_scoop" | "build_your_own" | "individual";

export type Variant = {
  id: string;
  name: string;
  item_count: string;
  price: number;
  badge?: string | null;
  line?: string | null;
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
  payment_status: "paid" | "pending" | "failed";
  fulfilment_status: "unfulfilled" | "packed" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping_fee: number;
  total: number;
  tracking_number: string;
  created_at: string;
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
