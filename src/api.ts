import type { AdminStats, CartItem, Customer, InventoryItem, Order, Product, ProductType } from "./types";
import { demoInventory, demoOrder, demoProducts } from "./demoData";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getProducts() {
  return request<Product[]>("/api/products").catch(() => demoProducts);
}

export function createCheckout(customer: Customer, items: CartItem[], orderNote: string) {
  return request<Order>("/api/checkout", {
    method: "POST",
    body: JSON.stringify({
      customer,
      order_note: orderNote,
      items: items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        preferences: item.preferences,
      })),
    }),
  }).catch(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order: Order = {
      id: `KS-${Date.now().toString().slice(-8)}`,
      customer,
      items: items.map(({ localId: _localId, ...item }) => item),
      order_note: orderNote,
      payment_status: "paid",
      fulfilment_status: "unfulfilled",
      subtotal,
      shipping_fee: subtotal >= 499 ? 0 : 49,
      total: subtotal + (subtotal >= 499 ? 0 : 49),
      tracking_number: "",
      created_at: new Date().toISOString(),
    };
    saveDemoOrders([order, ...readDemoOrders()]);
    return order;
  });
}

export function getOrders() {
  return request<Order[]>("/api/admin/orders", adminInit()).catch(() => readDemoOrders());
}

export function updateOrder(orderId: string, body: Partial<Pick<Order, "fulfilment_status" | "tracking_number">>) {
  return request<Order>(`/api/admin/orders/${orderId}`, {
    ...adminInit(),
    method: "PATCH",
    body: JSON.stringify(body),
  }).catch(() => {
    const orders = readDemoOrders();
    const updated = { ...orders.find((order) => order.id === orderId)!, ...body };
    saveDemoOrders(orders.map((order) => (order.id === orderId ? updated : order)));
    return updated;
  });
}

export function getInventory() {
  return request<InventoryItem[]>("/api/admin/inventory", adminInit()).catch(() => readDemoInventory());
}

export function updateInventory(itemId: string, body: Partial<Pick<InventoryItem, "stock" | "cost_price" | "sell_price" | "status">>) {
  return request<InventoryItem>(`/api/admin/inventory/${itemId}`, {
    ...adminInit(),
    method: "PATCH",
    body: JSON.stringify(body),
  }).catch(() => {
    const inventory = readDemoInventory();
    const updated = { ...inventory.find((item) => item.id === itemId)!, ...body };
    localStorage.setItem("khazanascoopDemoInventory", JSON.stringify(inventory.map((item) => (item.id === itemId ? updated : item))));
    return updated;
  });
}

export function adminLogin(password: string) {
  return request<{ token: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  }).catch(() => {
    if (password !== "khazana-admin") throw new Error("Incorrect admin password");
    return { token: "vercel-demo-admin" };
  });
}

export function getAdminStats() {
  return request<AdminStats>("/api/admin/stats", adminInit()).catch(() => {
    const orders = readDemoOrders();
    const inventory = readDemoInventory();
    return {
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      paid_orders: orders.length,
      unfulfilled_orders: orders.filter((order) => order.fulfilment_status === "unfulfilled").length,
      products: demoProducts.length,
      inventory_units: inventory.reduce((sum, item) => sum + item.stock, 0),
      low_stock_items: inventory.filter((item) => item.stock <= item.low_stock_at).length,
    };
  });
}

export function getAdminProducts() {
  return request<Product[]>("/api/admin/products", adminInit()).catch(() => demoProducts);
}

export function createAdminProduct(product: {
  name: string;
  slug: string;
  product_type: ProductType;
  category: string;
  description: string;
  price: number;
  badge?: string;
  icon?: string;
  color?: string;
  status?: string;
}) {
  return request<Product>("/api/admin/products", {
    ...adminInit(),
    method: "POST",
    body: JSON.stringify(product),
  }).catch(() => ({
    id: `product-${Date.now()}`,
    ...product,
    status: product.status ?? "active",
    variants: [],
  }));
}

export function getAdminCustomers() {
  return request<Array<Customer & { id: string; created_at?: string }>>("/api/admin/customers", adminInit()).catch(() =>
    readDemoOrders().map((order) => ({ ...order.customer, id: order.id, created_at: order.created_at })),
  );
}

function adminInit(): RequestInit {
  const token = localStorage.getItem("khazanaAdminToken");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

function readDemoOrders(): Order[] {
  const stored = localStorage.getItem("khazanascoopDemoOrders");
  return stored ? JSON.parse(stored) : [demoOrder];
}

function saveDemoOrders(orders: Order[]) {
  localStorage.setItem("khazanascoopDemoOrders", JSON.stringify(orders));
}

function readDemoInventory(): InventoryItem[] {
  const stored = localStorage.getItem("khazanascoopDemoInventory");
  return stored ? JSON.parse(stored) : demoInventory;
}
