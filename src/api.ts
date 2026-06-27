import type { AdminStats, CartItem, CatalogQuery, Customer, InventoryItem, Order, Product, ProductType, Promotion, Review } from "./types";
import { demoInventory, demoOrder, demoProducts, demoPromotions, demoReviews } from "./demoData";
import { getSession, isSupabaseConfigured } from "./supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const DEMO_FALLBACK = import.meta.env.VITE_ENABLE_DEMO_FALLBACK === "true" || !isSupabaseConfigured;

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

async function customerInit(): Promise<RequestInit> {
  const session = await getSession();
  return session ? { headers: { Authorization: `Bearer ${session.access_token}` } } : {};
}

export function getProducts(query: CatalogQuery = {}) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.product_type) params.set("product_type", query.product_type);
  query.categories?.forEach((category) => params.append("categories", category));
  query.colors?.forEach((color) => params.append("colors", color));
  if (query.min_price != null) params.set("min_price", String(query.min_price));
  if (query.max_price != null) params.set("max_price", String(query.max_price));
  if (query.sort) params.set("sort", query.sort);
  const suffix = params.size ? `?${params}` : "";
  return request<Product[]>(`/api/products${suffix}`).catch(() => {
    let products = [...demoProducts];
    if (query.q) {
      const needle = query.q.toLowerCase();
      products = products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(needle));
    }
    if (query.product_type) products = products.filter((product) => product.product_type === query.product_type);
    if (query.categories?.length) products = products.filter((product) => query.categories!.includes(product.category));
    if (query.colors?.length) products = products.filter((product) => product.color && query.colors!.includes(product.color));
    if (query.min_price != null) products = products.filter((product) => product.price >= query.min_price!);
    if (query.max_price != null) products = products.filter((product) => product.price <= query.max_price!);
    if (query.sort === "price-low") products.sort((a, b) => a.price - b.price);
    if (query.sort === "price-high") products.sort((a, b) => b.price - a.price);
    if (query.sort === "name") products.sort((a, b) => a.name.localeCompare(b.name));
    return products;
  });
}

export function getProduct(slug: string) {
  return request<Product>(`/api/products/${encodeURIComponent(slug)}`).catch(() => {
    const product = demoProducts.find((entry) => entry.slug === slug);
    if (!product) throw new Error("Product not found");
    return product;
  });
}

export async function getMyOrders(email = "") {
  const auth = await customerInit();
  const suffix = email ? `?email=${encodeURIComponent(email)}` : "";
  return request<Order[]>(`/api/my-orders${suffix}`, auth).catch((error) => {
    if (!DEMO_FALLBACK) throw error;
    return readDemoOrders().filter((order) => !email || order.customer.email.toLowerCase() === email.toLowerCase());
  });
}

export async function createCheckout(customer: Customer, items: CartItem[], orderNote: string, exclusions = "", promotionCode = "") {
  const auth = await customerInit();
  return request<Order>("/api/checkout", {
    ...auth,
    method: "POST",
    body: JSON.stringify({
      customer,
      order_note: orderNote,
      exclusions,
      promotion_code: promotionCode || null,
      items: items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        preferences: item.preferences,
      })),
    }),
  }).catch((error) => {
    if (!DEMO_FALLBACK) throw error;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order: Order = {
      id: `KS-${Date.now().toString().slice(-8)}`,
      customer,
      items: items.map(({ localId: _localId, ...item }) => item),
      order_note: orderNote,
      exclusions,
      payment_status: "paid",
      fulfilment_status: "unfulfilled",
      subtotal,
      discount_total: 0,
      shipping_fee: subtotal >= 499 ? 0 : 49,
      total: subtotal + (subtotal >= 499 ? 0 : 49),
      promotion_code: null,
      tracking_number: "",
      created_at: new Date().toISOString(),
    };
    saveDemoOrders([order, ...readDemoOrders()]);
    return order;
  });
}

export function getPromotions() {
  return request<Promotion[]>("/api/promotions").catch(() => demoPromotions);
}

export function getReviews(productId: string) {
  return request<Review[]>(`/api/products/${encodeURIComponent(productId)}/reviews`).catch(() =>
    demoReviews.filter((review) => review.product_id === productId),
  );
}

export async function createReview(productId: string, body: Pick<Review, "rating" | "title" | "body">) {
  const auth = await customerInit();
  return request<Review>(`/api/products/${encodeURIComponent(productId)}/reviews`, {
    ...auth,
    method: "POST",
    body: JSON.stringify(body),
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
  image?: string;
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
    average_rating: 0,
    review_count: 0,
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
