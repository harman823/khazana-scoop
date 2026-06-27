import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  adminLogin,
  createAdminProduct,
  createCheckout,
  getAdminCustomers,
  getAdminProducts,
  getAdminStats,
  getInventory,
  getOrders,
  getProducts,
  updateInventory,
  updateOrder,
} from "./api";
import type { AdminStats, CartItem, Customer, InventoryItem, Order, Product, ProductType, Variant } from "./types";
import { uploadProductImage } from "./supabase";
import {
  AboutPage,
  CartPage,
  CatalogPage,
  ContactPage,
  CustomerOrdersPage,
  CustomerProfilePage,
  FaqPage,
  PolicyPage,
  ProductDetailPage,
} from "./StorePages";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const emptyCustomer: Customer = { name: "", phone: "", email: "", address: "" };

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/shop" element={<CatalogPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-orders" element={<CustomerOrdersPage />} />
        <Route path="/profile" element={<CustomerProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/shipping" element={<PolicyPage kind="shipping" />} />
        <Route path="/returns" element={<PolicyPage kind="returns" />} />
        <Route path="/privacy" element={<PolicyPage kind="privacy" />} />
        <Route path="/terms" element={<PolicyPage kind="terms" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNote, setOrderNote] = useState("");
  const [category, setCategory] = useState("All");
  const [sortMode, setSortMode] = useState("featured");
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts().then(setProducts).catch((caught: Error) => setError(caught.message));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const mysteryProduct = products.find((product) => product.product_type === "mystery_scoop");
  const byoProduct = products.find((product) => product.product_type === "build_your_own");
  const featuredScoops = [mysteryProduct, byoProduct].filter(Boolean) as Product[];
  const individualProducts = products.filter((product) => product.product_type === "individual");
  const categories = useMemo(() => ["All", ...Array.from(new Set(individualProducts.map((product) => product.category)))], [individualProducts]);
  const visibleProducts = useMemo(() => {
    let next = individualProducts.filter((product) => category === "All" || product.category === category);
    if (sortMode === "low") next = [...next].sort((a, b) => a.price - b.price);
    if (sortMode === "high") next = [...next].sort((a, b) => b.price - a.price);
    return next;
  }, [category, individualProducts, sortMode]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product: Product, variant: Variant | null, preferences: Record<string, string> = {}) {
    const variantId = variant?.id ?? "standard";
    const localKey = `${product.id}:${variantId}:${JSON.stringify(preferences)}`;
    setCart((current) => {
      const existing = current.find((item) => item.localId === localKey);
      if (existing) return current.map((item) => (item.localId === localKey ? { ...item, quantity: item.quantity + 1 } : item));
      return [
        ...current,
        {
          localId: localKey,
          product_id: product.id,
          product_name: variant?.name ?? product.name,
          variant_id: variantId,
          variant_name: variant?.item_count ?? product.category,
          item_count: variant?.item_count,
          price: variant?.price ?? product.price,
          quantity: 1,
          preferences,
        },
      ];
    });
    setToast(`${variant?.name ?? product.name} added to cart`);
  }

  function updateQuantity(localId: string, delta: number) {
    setCart((current) => current.map((item) => (item.localId === localId ? { ...item, quantity: item.quantity + delta } : item)).filter((item) => item.quantity > 0));
  }

  async function submitCheckout(customer: Customer) {
    const order = await createCheckout(customer, cart, orderNote);
    setCart([]);
    setOrderNote("");
    setCheckoutOpen(false);
    setCartOpen(false);
    setToast(`Order ${order.id} created`);
  }

  return (
    <>
      <div className="announce">FREE SHIPPING PAN INDIA • Ships in 5-6 working days</div>
      <header className="site-header">
        <button className="icon-button mobile-only" onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu"><span /><span /><span /></button>
        <a className="brand" href="#home" aria-label="KhazanaScoop home"><span className="brand-mark">KS</span><span>KhazanaScoop</span></a>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/shop">Shop All</Link><Link to="/shop?type=mystery_scoop">Mystery Scoops</Link><Link to="/shop?type=build_your_own">Build Your Scoop</Link><Link to="/about">About</Link><Link to="/profile">Account</Link>
        </nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart">Cart <span>{cartCount}</span></button>
      </header>
      {error ? <div className="api-error">{error}</div> : null}

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <h1>Cute surprises, packed just for you.</h1>
            <p>Pick a mystery scoop or build your own box with adorable stationery, accessories, beauty minis, and little happy finds.</p>
            <div className="hero-actions"><Link className="button primary" to="/shop?type=mystery_scoop">Shop Mystery Scoops</Link><Link className="button secondary" to="/shop?type=build_your_own">Build My Scoop</Link></div>
            <div className="trust-row"><span>Prepaid only</span><span>Order notes</span><span>Gift-ready</span></div>
          </div>
          <div className="hero-media">
            <img src="/assets/khazana-product-hero.png" alt="Pastel mystery scoop box with cute products" />
            <div className="mini-card"><strong>{mysteryProduct?.name ?? "Mystery Scoop"}</strong><span>{mysteryProduct?.variants[1]?.item_count ?? "12 products + 2 surprise gifts"} • {money.format(mysteryProduct?.variants[1]?.price ?? 999)}</span></div>
          </div>
        </section>

        <section className="section how">
          <div className="section-heading"><h2>How it works</h2><p>Choose a path, add your notes, and we pack a cheerful box based on stock and preferences.</p></div>
          <div className="steps">
            <article><span>1</span><h3>Choose scoop</h3><p>Mystery, build-your-own, or fixed cute essentials.</p></article>
            <article><span>2</span><h3>Add notes</h3><p>Tell us what to avoid: earrings, keychains, hair clips, colours.</p></article>
            <article><span>3</span><h3>Pay prepaid</h3><p>Checkout creates a paid order for careful fulfilment.</p></article>
          </div>
        </section>

        <section className="section scoop-shortcuts">
          <div className="section-heading"><h2>Scoop options live in the shop</h2><p>Keep the dashboard clean. Compare Mystery Scoop and Build Your Own from the shop filters or product pages.</p></div>
          <div className="scoop-card-grid">
            {featuredScoops.map((product) => {
              const defaultVariant = product.variants.find((variant) => variant.is_default) ?? product.variants[0];
              const typeLabel = product.product_type === "mystery_scoop" ? "Mystery Scoop" : "Build Your Own";
              return <article className="scoop-shortcut-card" key={product.id}><p className="soft-label">{typeLabel}</p><h3>{product.name}</h3><p>{product.description}</p><strong>{money.format(defaultVariant?.price ?? product.price)}</strong><span>{defaultVariant?.item_count ?? product.category}</span><div><Link className="button primary" to={`/products/${product.slug}`}>View details</Link><Link className="button secondary" to={`/shop?type=${product.product_type}`}>Filter shop</Link></div></article>;
            })}
          </div>
        </section>

        <section className="section" id="collection">
          <div className="section-heading"><h2>Cute Essentials</h2><p>Browse fixed products when you want to choose the exact little happy find.</p></div>
          <div className="filter-row">
            <div className="chips">{categories.map((item) => <button className={`chip ${category === item ? "active" : ""}`} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price low to high</option><option value="high">Price high to low</option></select>
          </div>
          <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={() => addToCart(product, null)} />)}</div>
        </section>
        <ReviewsAndFaq />
      </main>

      <CartDrawer isOpen={isCartOpen} cart={cart} orderNote={orderNote} subtotal={subtotal} shipping={shipping} total={total} onClose={() => setCartOpen(false)} onNote={setOrderNote} onQuantity={updateQuantity} onCheckout={() => cart.length ? setCheckoutOpen(true) : setToast("Add an item before checkout")} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setCheckoutOpen(false)} onSubmit={(customer) => void submitCheckout(customer)} />
      <footer className="footer"><div><strong>KhazanaScoop</strong><p>Cute mystery boxes, organized ordering, careful packing.</p></div><div><strong>Shop</strong><Link to="/shop?type=mystery_scoop">Mystery Scoops</Link><Link to="/shop?type=build_your_own">Build Your Scoop</Link><a href="#collection">Cute Essentials</a></div><div><strong>Help</strong><a href="#faq">FAQ</a><Link to="/admin">Admin Login</Link><a href="#home">Contact Us</a></div></footer>
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const { token } = await adminLogin(password);
      localStorage.setItem("khazanaAdminToken", token);
      navigate("/admin");
    } catch {
      setError("Incorrect password");
    }
  }

  return (
    <main className="admin-login">
      <form className="checkout-card" onSubmit={submit}>
        <Link to="/" className="brand"><span className="brand-mark">KS</span><span>KhazanaScoop</span></Link>
        <h1>Admin login</h1>
        <p>Enter the store owner password to manage paid orders, stock, products, customers, and analytics.</p>
        <label>Password <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" autoFocus /></label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button primary full" type="submit">Unlock admin</button>
        <p className="fine-print">MVP default password: khazana-admin. Change ADMIN_PASSWORD in .env.</p>
      </form>
    </main>
  );
}

function AdminShell() {
  const token = localStorage.getItem("khazanaAdminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link to="/" className="brand"><span className="brand-mark">KS</span><span>KhazanaScoop</span></Link>
        <nav>
          <NavLink end to="/admin">Overview</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/inventory">Inventory</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/customers">Customers</NavLink>
          <NavLink to="/admin/analytics">Analytics</NavLink>
        </nav>
        <button className="button secondary full" onClick={() => { localStorage.removeItem("khazanaAdminToken"); location.href = "/admin/login"; }}>Sign out</button>
      </aside>
      <section className="admin-workspace">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Routes>
      </section>
    </div>
  );
}

function AdminOverview() {
  const { stats, orders, inventory } = useAdminData();
  return (
    <>
      <AdminHeading title="Admin overview" body="Store health, paid order queue, low-stock alerts, and quick fulfilment context." />
      <StatsGrid stats={stats} />
      <div className="admin-grid">
        <div className="admin-panel"><h3>Newest paid orders</h3>{orders.slice(0, 4).map((order) => <OrderSummary key={order.id} order={order} />)}</div>
        <div className="admin-panel"><h3>Stock watch</h3>{inventory.filter((item) => item.stock <= item.low_stock_at || item.stock < 40).map((item) => <InventorySummary key={item.id} item={item} />)}</div>
      </div>
    </>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => { getOrders().then(setOrders); }, []);
  const filtered = orders.filter((order) => filter === "all" || order.fulfilment_status === filter);
  async function patch(orderId: string, body: Partial<Pick<Order, "fulfilment_status" | "tracking_number">>) {
    const updated = await updateOrder(orderId, body);
    setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
  }
  return (
    <>
      <AdminHeading title="Orders" body="View paid orders, customer notes, selected variants, packing status, and tracking numbers." />
      <div className="admin-toolbar"><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option value="unfulfilled">Unfulfilled</option><option value="packed">Packed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select></div>
      <div className="admin-panel">{filtered.map((order) => <article className="admin-order detailed" key={order.id}><OrderSummary order={order} /><div className="order-lines">{order.items.map((item) => <p key={`${order.id}-${item.product_id}-${item.variant_id}`}>{item.quantity}x {item.product_name} • {item.variant_name} • {money.format(item.price)}</p>)}</div><p><strong>Address:</strong> {order.customer.address}</p><div className="action-row"><select value={order.fulfilment_status} onChange={(event) => void patch(order.id, { fulfilment_status: event.target.value as Order["fulfilment_status"] })}>{["unfulfilled", "packed", "shipped", "delivered", "cancelled"].map((status) => <option key={status}>{status}</option>)}</select><input value={order.tracking_number} onChange={(event) => void patch(order.id, { tracking_number: event.target.value })} placeholder="Tracking number" /></div></article>)}</div>
    </>
  );
}

function AdminInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  useEffect(() => { getInventory().then(setInventory); }, []);
  async function patch(item: InventoryItem, body: Partial<Pick<InventoryItem, "stock" | "cost_price" | "sell_price" | "status">>) {
    const updated = await updateInventory(item.id, body);
    setInventory((current) => current.map((entry) => (entry.id === item.id ? updated : entry)));
  }
  return (
    <>
      <AdminHeading title="Inventory" body="Track scoop packing categories, available units, cost, sell price, status, and low-stock thresholds." />
      <div className="admin-table">{inventory.map((item) => <div className="inventory-card" key={item.id}><div><h3>{item.name}</h3><p>{item.category}</p><span className={`tag ${item.stock <= item.low_stock_at ? "danger" : ""}`}>{item.stock <= item.low_stock_at ? "Low stock" : "Healthy"}</span></div><label>Stock<input type="number" value={item.stock} onChange={(event) => void patch(item, { stock: Number(event.target.value || 0) })} /></label><label>Cost<input type="number" value={item.cost_price} onChange={(event) => void patch(item, { cost_price: Number(event.target.value || 0) })} /></label><label>Sell<input type="number" value={item.sell_price} onChange={(event) => void patch(item, { sell_price: Number(event.target.value || 0) })} /></label><label>Status<select value={item.status} onChange={(event) => void patch(item, { status: event.target.value })}><option>active</option><option>paused</option><option>archived</option></select></label></div>)}</div>
    </>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<{ name: string; slug: string; product_type: ProductType; category: string; description: string; price: number; badge: string; icon: string; color: string; image: string; status: string }>({ name: "", slug: "", product_type: "individual", category: "", description: "", price: 0, badge: "", icon: "✦", color: "#E4FFFA", image: "", status: "active" });
  const [uploading, setUploading] = useState(false);
  useEffect(() => { getAdminProducts().then(setProducts); }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const created = await createAdminProduct(form);
    setProducts((current) => [...current, created]);
    setForm({ name: "", slug: "", product_type: "individual", category: "", description: "", price: 0, badge: "", icon: "✦", color: "#E4FFFA", image: "", status: "active" });
  }
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const image = await uploadProductImage(file);
      setForm((current) => ({ ...current, image }));
    } finally {
      setUploading(false);
    }
  }
  return (
    <>
      <AdminHeading title="Products" body="Manage catalogue data backed by Prisma: active products, slugs, types, categories, and prices." />
      <div className="admin-grid">
        <form className="admin-panel preference-form" onSubmit={submit}><h3>Add product</h3><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replaceAll(" ", "-") })} /></label><label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label><label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>Price<input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value || 0) })} /></label><label>Product image<input type="file" accept="image/*" onChange={(event) => void upload(event.target.files?.[0])} /></label>{form.image ? <img className="admin-upload-preview" src={form.image} alt="Uploaded product preview" /> : null}<button className="button primary" disabled={uploading}>{uploading ? "Uploading…" : "Create product"}</button></form>
        <div className="admin-panel"><h3>Catalogue</h3>{products.map((product) => <div className="product-row" key={product.id}><strong>{product.name}</strong><span>{product.product_type}</span><span>{product.category}</span><span>{money.format(product.price)}</span><span className="tag">{product.status}</span></div>)}</div>
      </div>
    </>
  );
}

function AdminCustomers() {
  const [customers, setCustomers] = useState<Array<Customer & { id: string; created_at?: string }>>([]);
  useEffect(() => { getAdminCustomers().then(setCustomers); }, []);
  return <><AdminHeading title="Customers" body="Customer contact and shipping data captured from paid checkout." /><div className="admin-panel">{customers.map((customer) => <div className="customer-row" key={customer.id}><strong>{customer.name}</strong><span>{customer.phone}</span><span>{customer.email}</span><p>{customer.address}</p></div>)}</div></>;
}

function AdminAnalytics() {
  const { stats, orders, inventory } = useAdminData();
  const aov = stats && stats.paid_orders ? Math.round(stats.revenue / stats.paid_orders) : 0;
  return <><AdminHeading title="Analytics" body="MVP operating metrics for revenue, order volume, fulfilment load, and stock readiness." /><StatsGrid stats={stats} /><div className="admin-grid"><div className="admin-panel"><h3>Revenue notes</h3><p>Average order value: <strong>{money.format(aov)}</strong></p><p>Paid orders: <strong>{stats?.paid_orders ?? 0}</strong></p><p>Unfulfilled queue: <strong>{stats?.unfulfilled_orders ?? 0}</strong></p></div><div className="admin-panel"><h3>Category stock</h3>{inventory.map((item) => <InventorySummary item={item} key={item.id} />)}</div></div><div className="admin-panel"><h3>Recent fulfilment statuses</h3>{orders.map((order) => <OrderSummary key={order.id} order={order} />)}</div></>;
}

function useAdminData() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  useEffect(() => { void Promise.all([getAdminStats(), getOrders(), getInventory()]).then(([statsData, orderData, inventoryData]) => { setStats(statsData); setOrders(orderData); setInventory(inventoryData); }); }, []);
  return { stats, orders, inventory };
}

function AdminHeading({ title, body }: { title: string; body: string }) {
  return <header className="admin-heading"><div><h1>{title}</h1><p>{body}</p></div><Link className="button secondary" to="/">View store</Link></header>;
}

function StatsGrid({ stats }: { stats: AdminStats | null }) {
  const cards = [
    ["Revenue", money.format(stats?.revenue ?? 0)],
    ["Paid orders", String(stats?.paid_orders ?? 0)],
    ["Unfulfilled", String(stats?.unfulfilled_orders ?? 0)],
    ["Products", String(stats?.products ?? 0)],
    ["Inventory units", String(stats?.inventory_units ?? 0)],
    ["Low stock", String(stats?.low_stock_items ?? 0)],
  ];
  return <div className="stats-grid">{cards.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>;
}

function OrderSummary({ order }: { order: Order }) {
  return <div className="order-summary"><div><strong>{order.id}</strong><p>{order.customer.name} • {order.customer.phone}</p><p><strong>Note:</strong> {order.order_note || "No note"}</p><p><strong>Exclusions:</strong> {order.exclusions || "None"}</p></div><div><span className="tag">{order.fulfilment_status}</span><strong>{money.format(order.total)}</strong>{order.discount_total ? <small>Saved {money.format(order.discount_total)}</small> : null}</div></div>;
}

function InventorySummary({ item }: { item: InventoryItem }) {
  return <div className="inventory-row"><strong>{item.name}</strong><span>{item.stock} units</span><span className={`tag ${item.stock <= item.low_stock_at ? "danger" : ""}`}>{item.stock <= item.low_stock_at ? "Low" : "OK"}</span></div>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return <article className="product-card"><Link to={`/products/${product.slug}`} className="product-card-link"><div className="product-art" style={{ "--art-bg": product.color ?? "#E4FFFA" } as CSSProperties} aria-hidden="true">{product.image ? <img src={product.image} alt="" /> : product.icon}</div><h3>{product.name}</h3><p>{product.category}</p></Link><div className="row"><strong>{money.format(product.price)}</strong><button className="button primary" onClick={onAdd}>Add</button></div></article>;
}

function VariantGrid({ variants, selectedId, onSelect }: { variants: Variant[]; selectedId: string; onSelect: (id: string) => void }) {
  return <div className="variant-grid">{variants.map((variant) => <button className={`variant-card ${variant.id === selectedId ? "active" : ""}`} key={variant.id} onClick={() => onSelect(variant.id)}>{variant.badge ? <span className="badge">{variant.badge}</span> : null}<strong>{variant.name}</strong><small>{variant.item_count}</small><span className="price">{money.format(variant.price)}</span>{variant.compare_at_price ? <del>{money.format(variant.compare_at_price)}</del> : null}<small>{variant.line}</small><ul>{variant.rules.slice(0, 2).map((rule) => <li key={rule}>{rule}</li>)}</ul></button>)}</div>;
}

function ReviewsAndFaq() {
  return <><section className="section reviews"><div className="section-heading"><h2>Trusted by careful cutie shoppers</h2><p>Clear notes, gentle packing, and no fake urgency.</p></div><div className="review-grid"><article><strong>“The box felt so personal.”</strong><p>They avoided earrings and packed pink stationery exactly like my note.</p></article><article><strong>“Perfect gift.”</strong><p>My sister loved the medium scoop. The item count was clear before checkout.</p></article><article><strong>“No DM confusion.”</strong><p>I could compare prices and order from my phone in a few minutes.</p></article></div></section><section className="section faq" id="faq"><div><h2>FAQ</h2><details open><summary>What is a mystery scoop?</summary><p>A surprise box with handpicked cute products. Designs and combinations vary.</p></details><details><summary>Can I choose products?</summary><p>Use Build Your Own for preferences. Mystery scoops stay surprise-based.</p></details><details><summary>Are mystery scoops returnable?</summary><p>They are non-returnable unless the product arrives damaged, wrong, or missing.</p></details></div><div className="policy-card"><h3>Important notes</h3><p>Mystery scoops are surprise-based. Product designs, colours, and combinations may vary.</p><p>Cash on Delivery is not available in this MVP flow.</p></div></section></>;
}

function CartDrawer({ isOpen, cart, orderNote, subtotal, shipping, total, onClose, onNote, onQuantity, onCheckout }: { isOpen: boolean; cart: CartItem[]; orderNote: string; subtotal: number; shipping: number; total: number; onClose: () => void; onNote: (note: string) => void; onQuantity: (localId: string, delta: number) => void; onCheckout: () => void }) {
  return <aside className={`cart-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}><div className="drawer-panel"><div className="drawer-head"><h2>Your cart</h2><button className="icon-close" onClick={onClose} aria-label="Close cart">×</button></div>{cart.length ? cart.map((item) => <article className="cart-item" key={item.localId}><header><strong>{item.product_name}</strong><button onClick={() => onQuantity(item.localId, -item.quantity)} aria-label={`Remove ${item.product_name}`}>Remove</button></header><small>{item.variant_name} • {money.format(item.price)}</small><PreferenceTags preferences={item.preferences} /><div className="cart-actions"><span>Quantity</span><span><button onClick={() => onQuantity(item.localId, -1)} aria-label="Decrease quantity">−</button><strong>{item.quantity}</strong><button onClick={() => onQuantity(item.localId, 1)} aria-label="Increase quantity">+</button></span></div></article>) : <p>Your cart is empty. Pick a scoop to begin.</p>}<label className="cart-note">Order notes<textarea value={orderNote} onChange={(event) => onNote(event.target.value)} placeholder="Example: no earrings, no keychains, prefer stationery or pink items." /></label><div className="summary"><div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping ? money.format(shipping) : "Free"}</strong></div><div className="total"><span>Total</span><strong>{money.format(total)}</strong></div></div><button className="button primary full" onClick={onCheckout}>Checkout prepaid</button><p className="fine-print">Prepaid orders only. Product combinations may vary.</p></div></aside>;
}

function CheckoutModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (customer: Customer) => void }) {
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  function update<K extends keyof Customer>(key: K, value: Customer[K]) { setCustomer((current) => ({ ...current, [key]: value })); }
  return <div className={`modal ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}><form className="checkout-card" onSubmit={(event) => { event.preventDefault(); onSubmit(customer); setCustomer(emptyCustomer); }}><button className="icon-close" type="button" onClick={onClose} aria-label="Close checkout">×</button><h2>Prepaid checkout</h2><div className="form-grid"><label>Name <input required value={customer.name} onChange={(event) => update("name", event.target.value)} placeholder="Customer name" /></label><label>Phone <input required value={customer.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+91" /></label><label>Email <input required type="email" value={customer.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></label><label>Address <textarea required value={customer.address} onChange={(event) => update("address", event.target.value)} placeholder="Flat, street, city, pincode" /></label></div><div className="info-box"><strong>Payment simulation</strong><p>This MVP verifies the prepaid flow through FastAPI and creates a paid order for admin fulfilment.</p></div><button className="button primary full" type="submit">Pay & create order</button></form></div>;
}

function PreferenceTags({ preferences }: { preferences: Record<string, string> }) {
  const entries = Object.entries(preferences).filter(([, value]) => value);
  if (!entries.length) return null;
  return <div>{entries.map(([key, value]) => <span className="tag" key={key}>{key}: {value}</span>)}</div>;
}

export default App;
