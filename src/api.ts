import type { AdminStats, CartItem, Customer, InventoryItem, Order, Product } from "./types";

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
  return request<Product[]>("/api/products");
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
  });
}

export function getOrders() {
  return request<Order[]>("/api/admin/orders", adminInit());
}

export function updateOrder(orderId: string, body: Partial<Pick<Order, "fulfilment_status" | "tracking_number">>) {
  return request<Order>(`/api/admin/orders/${orderId}`, {
    ...adminInit(),
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function getInventory() {
  return request<InventoryItem[]>("/api/admin/inventory", adminInit());
}

export function updateInventory(itemId: string, body: Partial<Pick<InventoryItem, "stock" | "cost_price" | "sell_price" | "status">>) {
  return request<InventoryItem>(`/api/admin/inventory/${itemId}`, {
    ...adminInit(),
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function adminLogin(password: string) {
  return request<{ token: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function getAdminStats() {
  return request<AdminStats>("/api/admin/stats", adminInit());
}

export function getAdminProducts() {
  return request<Product[]>("/api/admin/products", adminInit());
}

export function createAdminProduct(product: {
  name: string;
  slug: string;
  product_type: string;
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
  });
}

export function getAdminCustomers() {
  return request<Array<Customer & { id: string; created_at?: string }>>("/api/admin/customers", adminInit());
}

function adminInit(): RequestInit {
  const token = localStorage.getItem("khazanaAdminToken");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
