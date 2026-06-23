import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  CircleUserRound,
  Heart,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Truck,
  X,
} from "lucide-react";
import { createCheckout, getMyOrders, getProduct, getProducts } from "./api";
import type { CartItem, Customer, Order, Product, Variant } from "./types";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const CART_KEY = "khazanascoopCustomerCart";
const PROFILE_KEY = "khazanascoopCustomerProfile";
const WISHLIST_KEY = "khazanascoopWishlist";
const spritePositions: Record<string, string> = {
  scrunchie: "0% 0%",
  pen: "33.333% 0%",
  mirror: "66.666% 0%",
  stickers: "100% 0%",
  clip: "0% 100%",
  charm: "33.333% 100%",
  mini: "66.666% 100%",
  gift: "100% 100%",
};

function ProductVisual({ product, className }: { product: Product; className?: string }) {
  if (product.image) return <img className={className} src={product.image} alt={product.name} />;
  return <span className={`sprite-product ${className ?? ""}`} style={{ "--sprite-position": spritePositions[product.id] ?? "0% 0%" } as CSSProperties} role="img" aria-label={product.name} />;
}

function readCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"); } catch { return []; }
}

function writeCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("khazana-cart"));
}

function addProduct(product: Product, variant?: Variant) {
  const selected = variant ?? product.variants[0];
  const variantId = selected?.id ?? "standard";
  const key = `${product.id}:${variantId}`;
  const cart = readCart();
  const existing = cart.find((item) => item.localId === key);
  if (existing) existing.quantity += 1;
  else cart.push({
    localId: key,
    product_id: product.id,
    product_name: product.name,
    variant_id: variantId,
    variant_name: selected?.name ?? product.category,
    item_count: selected?.item_count,
    quantity: 1,
    price: selected?.price ?? product.price,
    preferences: {},
  });
  writeCart(cart);
}

function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(() => readCart().reduce((sum, item) => sum + item.quantity, 0));
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    window.addEventListener("khazana-cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("khazana-cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function search(event: FormEvent) {
    event.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  }

  return <>
    <div className="commerce-announce">Free shipping above ₹499 <span>•</span> Packed with care <span>•</span> Prepaid orders</div>
    <header className="commerce-header">
      <button className="commerce-icon mobile-only" onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu"><Menu /></button>
      <Link className="commerce-brand" to="/"><span>KS</span><strong>KhazanaScoop</strong></Link>
      <form className="commerce-search" onSubmit={search}><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cute finds, scoops and gifts" /></form>
      <nav className={`commerce-actions ${menuOpen ? "open" : ""}`}>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/my-orders">Orders</NavLink>
        <NavLink className="action-icon" to="/profile" aria-label="Profile"><CircleUserRound /></NavLink>
        <NavLink className="action-icon cart-link" to="/cart" aria-label={`Cart with ${count} items`}><ShoppingBag /><span>{count}</span></NavLink>
      </nav>
    </header>
    <nav className="category-nav">
      <Link to="/shop?type=mystery_scoop">Mystery Scoops</Link>
      <Link to="/shop?type=build_your_own">Build Your Scoop</Link>
      <Link to="/shop?category=Hair+Accessories">Hair Accessories</Link>
      <Link to="/shop?category=Cute+Pens">Stationery</Link>
      <Link to="/shop?category=Keychains+%26+Charms">Keychains & Charms</Link>
      <Link to="/shop?max=99">Under ₹99</Link>
    </nav>
  </>;
}

function StoreFooter() {
  return <footer className="commerce-footer">
    <div><Link className="commerce-brand" to="/"><span>KS</span><strong>KhazanaScoop</strong></Link><p>Cute finds, mystery scoops and thoughtful little gifts, packed in India.</p></div>
    <div><strong>Shop</strong><Link to="/shop">All products</Link><Link to="/shop?type=mystery_scoop">Mystery scoops</Link><Link to="/shop?type=build_your_own">Build your scoop</Link></div>
    <div><strong>Customer care</strong><Link to="/my-orders">Track my order</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contact us</Link><Link to="/returns">Returns</Link></div>
    <div><strong>Information</strong><Link to="/about">About us</Link><Link to="/shipping">Shipping policy</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div>
  </footer>;
}

function StoreLayout({ children }: { children: React.ReactNode }) {
  return <><StoreHeader /><main className="commerce-main">{children}</main><StoreFooter /></>;
}

function Breadcrumbs({ items }: { items: Array<{ label: string; to?: string }> }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>{items.map((item) => <span key={item.label}><ChevronRight size={14} />{item.to ? <Link to={item.to}>{item.label}</Link> : item.label}</span>)}</nav>;
}

function CatalogCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? "[]").includes(product.id));
  function toggleLike() {
    const current: string[] = JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? "[]");
    const next = current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    setLiked(next.includes(product.id));
  }
  return <article className="catalog-card">
    <div className="catalog-media" style={{ "--product-color": product.color ?? "#ffe8ed" } as CSSProperties}>
      <Link to={`/products/${product.slug}`}><ProductVisual product={product} /></Link>
      {product.badge ? <em>{product.badge}</em> : null}
      <button onClick={toggleLike} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}><Heart fill={liked ? "currentColor" : "none"} /></button>
    </div>
    <Link className="catalog-copy" to={`/products/${product.slug}`}><small>{product.category}</small><h3>{product.name}</h3><div className="rating"><Star size={14} fill="currentColor" /> 4.8 <span>(24)</span></div></Link>
    <div className="catalog-price"><strong>{money.format(product.price)}</strong><button onClick={() => addProduct(product)}>Add to cart</button></div>
  </article>;
}

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => { void getProducts().then(setProducts); }, []);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products]);
  const query = (params.get("q") ?? "").toLowerCase();
  const category = params.get("category") ?? "";
  const type = params.get("type") ?? "";
  const sort = params.get("sort") ?? "featured";
  const max = Number(params.get("max") ?? 0);

  const visible = useMemo(() => {
    const filtered = products.filter((product) =>
      product.status === "active" &&
      (!query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query)) &&
      (!category || product.category === category) &&
      (!type || product.product_type === type) &&
      (!max || product.price <= max)
    );
    if (sort === "price-low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [products, query, category, type, max, sort]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  return <StoreLayout>
    <section className="catalog-page">
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <div className="catalog-heading"><div><h1>Shop all cute finds</h1><p>Discover stationery, accessories, gifts and scoop-ready favorites.</p></div><span>{visible.length} products</span></div>
      <div className="mobile-catalog-tools"><button onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={18} /> Filters</button><select value={sort} onChange={(event) => setParam("sort", event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></div>
      <div className="catalog-layout">
        <aside className={`catalog-filters ${filtersOpen ? "open" : ""}`}>
          <div className="filter-title"><strong>Filters</strong><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div>
          <fieldset><legend>Product type</legend><label><input type="radio" checked={!type} onChange={() => setParam("type", "")} /> All products</label><label><input type="radio" checked={type === "individual"} onChange={() => setParam("type", "individual")} /> Cute essentials</label><label><input type="radio" checked={type === "mystery_scoop"} onChange={() => setParam("type", "mystery_scoop")} /> Mystery scoops</label><label><input type="radio" checked={type === "build_your_own"} onChange={() => setParam("type", "build_your_own")} /> Build your own</label></fieldset>
          <fieldset><legend>Category</legend><label><input type="radio" checked={!category} onChange={() => setParam("category", "")} /> All categories</label>{categories.map((item) => <label key={item}><input type="radio" checked={category === item} onChange={() => setParam("category", item)} /> {item}</label>)}</fieldset>
          <fieldset><legend>Price</legend><label><input type="radio" checked={!max} onChange={() => setParam("max", "")} /> Any price</label><label><input type="radio" checked={max === 99} onChange={() => setParam("max", "99")} /> Under ₹99</label><label><input type="radio" checked={max === 199} onChange={() => setParam("max", "199")} /> Under ₹199</label><label><input type="radio" checked={max === 999} onChange={() => setParam("max", "999")} /> Under ₹999</label></fieldset>
          <button className="clear-filters" onClick={() => setParams({})}>Clear all filters</button>
        </aside>
        <div>
          <div className="desktop-sort"><span>Showing {visible.length} results</span><label>Sort by <select value={sort} onChange={(event) => setParam("sort", event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label></div>
          {visible.length ? <div className="catalog-grid">{visible.map((product) => <CatalogCard product={product} key={product.id} />)}</div> : <div className="empty-state"><Search /><h2>No cute finds matched</h2><p>Try clearing a filter or searching for another product.</p><button onClick={() => setParams({})}>View all products</button></div>}
        </div>
      </div>
    </section>
  </StoreLayout>;
}

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    void Promise.all([getProduct(slug), getProducts()]).then(([current, all]) => {
      setProduct(current);
      setSelectedId(current.variants[0]?.id ?? "");
      setRelated(all.filter((item) => item.id !== current.id && item.category === current.category).slice(0, 4));
    });
  }, [slug]);
  if (!product) return <StoreLayout><div className="page-loading">Loading product…</div></StoreLayout>;
  const currentProduct = product;
  const selected = currentProduct.variants.find((variant) => variant.id === selectedId);
  const price = selected?.price ?? currentProduct.price;
  function add() {
    for (let index = 0; index < quantity; index += 1) addProduct(currentProduct, selected);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }
  return <StoreLayout>
    <section className="product-page">
      <Breadcrumbs items={[{ label: "Shop", to: "/shop" }, { label: currentProduct.name }]} />
      <div className="product-detail">
        <div className="detail-gallery">
          <div className="detail-main-media" style={{ "--product-color": currentProduct.color ?? "#ffe8ed" } as CSSProperties}><ProductVisual product={currentProduct} /></div>
          <div className="detail-thumbs">{["Front view", "Gift view", "Packed view"].map((label, index) => <button className={index === 0 ? "active" : ""} key={label} aria-label={label}><ProductVisual product={currentProduct} /></button>)}</div>
        </div>
        <div className="detail-info">
          <p className="detail-category">{currentProduct.category}</p><h1>{currentProduct.name}</h1>
          <div className="detail-rating"><span><Star size={16} fill="currentColor" /> 4.8</span><a href="#reviews">24 reviews</a></div>
          <div className="detail-price"><strong>{money.format(price)}</strong><span>Inclusive of all taxes</span></div>
          <p className="stock-line">In stock and ready to pack</p><p className="detail-description">{currentProduct.description}</p>
          {currentProduct.variants.length ? <div className="detail-options"><strong>Choose your scoop</strong>{currentProduct.variants.map((variant) => <button className={variant.id === selectedId ? "active" : ""} onClick={() => setSelectedId(variant.id)} key={variant.id}><span>{variant.name}</span><small>{variant.item_count}</small><strong>{money.format(variant.price)}</strong></button>)}</div> : null}
          <div className="purchase-row"><div className="quantity-stepper"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus /></button><strong>{quantity}</strong><button onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus /></button></div><button className="add-cart-primary" onClick={add}>{added ? "Added to cart" : "Add to cart"}</button></div>
          <Link className="buy-now" to="/cart" onClick={add}>Buy now</Link>
          <div className="delivery-check"><Truck /><div><strong>Delivery availability</strong><p>Usually dispatched in 2-5 working days across India.</p></div></div>
          <details open><summary>Product details</summary><p>{currentProduct.description} Product colors and exact designs may vary slightly depending on available stock.</p></details>
          <details><summary>Shipping and returns</summary><p>Free shipping above ₹499. Damaged or incorrect items can be reported within 48 hours of delivery.</p></details>
          <details><summary>Care and packing</summary><p>Every order is checked and packed carefully. Mystery products remain surprise-based.</p></details>
        </div>
      </div>
      <section className="related-section"><div><h2>You may also like</h2><Link to="/shop">View all</Link></div><div className="catalog-grid">{related.map((item) => <CatalogCard product={item} key={item.id} />)}</div></section>
    </section>
  </StoreLayout>;
}

export function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const [profile, setProfile] = useState<Customer>(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{"name":"","phone":"","email":"","address":""}'); } catch { return { name: "", phone: "", email: "", address: "" }; }
  });
  const [message, setMessage] = useState("");
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal && subtotal < 499 ? 49 : 0;
  function update(localId: string, delta: number) {
    const next = cart.map((item) => item.localId === localId ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0);
    setCart(next); writeCart(next);
  }
  async function checkout(event: FormEvent) {
    event.preventDefault();
    const order = await createCheckout(profile, cart, "");
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    writeCart([]); setCart([]); setMessage(`Order ${order.id} placed successfully.`);
  }
  return <StoreLayout><section className="standard-page cart-page"><Breadcrumbs items={[{ label: "Cart" }]} /><h1>Your shopping bag</h1>{message ? <div className="success-banner"><PackageCheck />{message}<Link to="/my-orders">View order</Link></div> : null}{cart.length ? <div className="cart-layout"><div className="cart-list">{cart.map((item) => <article key={item.localId}><div className="cart-product-art">✦</div><div><h3>{item.product_name}</h3><p>{item.variant_name}</p><strong>{money.format(item.price)}</strong></div><div className="quantity-stepper"><button onClick={() => update(item.localId, -1)}><Minus /></button><strong>{item.quantity}</strong><button onClick={() => update(item.localId, 1)}><Plus /></button></div><button className="remove-item" onClick={() => update(item.localId, -item.quantity)}>Remove</button></article>)}</div><form className="checkout-summary" onSubmit={checkout}><h2>Order summary</h2><div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping ? money.format(shipping) : "Free"}</strong></div><div className="summary-total"><span>Total</span><strong>{money.format(subtotal + shipping)}</strong></div><h3>Delivery details</h3><input required placeholder="Full name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /><input required placeholder="Phone" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /><input required type="email" placeholder="Email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /><textarea required placeholder="Complete shipping address" value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} /><button>Checkout prepaid</button><small>Secure prepaid checkout simulation for this MVP.</small></form></div> : <div className="empty-state"><ShoppingBag /><h2>Your bag is waiting</h2><p>Add a few cute finds and they will appear here.</p><Link to="/shop">Start shopping</Link></div>}</section></StoreLayout>;
}

function AccountLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return <StoreLayout><section className="standard-page account-page"><Breadcrumbs items={[{ label: "Account" }]} /><div className="account-heading"><h1>{title}</h1><p>Manage your details and keep track of every KhazanaScoop order.</p></div><div className="account-layout"><aside><NavLink to="/profile"><CircleUserRound /> Profile</NavLink><NavLink to="/my-orders"><ShoppingBag /> My orders</NavLink><NavLink to="/shop"><Heart /> Wishlist & shop</NavLink><NavLink to="/contact"><Truck /> Help & support</NavLink></aside><div className="account-content">{children}</div></div></section></StoreLayout>;
}

export function CustomerProfilePage() {
  const [profile, setProfile] = useState<Customer>(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{"name":"","phone":"","email":"","address":""}'); } catch { return { name: "", phone: "", email: "", address: "" }; }
  });
  const [saved, setSaved] = useState(false);
  function save(event: FormEvent) { event.preventDefault(); localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); setSaved(true); }
  return <AccountLayout title="My profile"><form className="profile-form" onSubmit={save}><div><h2>Personal information</h2><p>These details make checkout faster and help find your orders.</p></div><label>Full name<input required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label><label>Phone number<input required value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label><label>Email address<input required type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label><label className="full-field">Default shipping address<textarea required value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} /></label><button>Save profile</button>{saved ? <span className="saved-note">Profile saved</span> : null}</form></AccountLayout>;
}

export function CustomerOrdersPage() {
  const [email, setEmail] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}").email ?? ""; } catch { return ""; }
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  async function lookup(event?: FormEvent) { event?.preventDefault(); if (!email) return; setOrders(await getMyOrders(email)); setSearched(true); }
  useEffect(() => { if (email) void lookup(); }, []);
  return <AccountLayout title="My orders"><form className="order-lookup" onSubmit={lookup}><label>Order email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><button>Find my orders</button></form>{orders.length ? <div className="customer-orders">{orders.map((order) => <article key={order.id}><header><div><small>Order</small><strong>{order.id}</strong></div><div><small>Placed</small><strong>{new Date(order.created_at).toLocaleDateString("en-IN")}</strong></div><div><small>Total</small><strong>{money.format(order.total)}</strong></div><span>{order.fulfilment_status}</span></header><div className="order-products">{order.items.map((item) => <p key={`${order.id}-${item.product_id}`}>{item.quantity} × {item.product_name} <span>{item.variant_name}</span></p>)}</div><div className="order-progress"><i className="done" /><i className={["packed", "shipped", "delivered"].includes(order.fulfilment_status) ? "done" : ""} /><i className={["shipped", "delivered"].includes(order.fulfilment_status) ? "done" : ""} /><i className={order.fulfilment_status === "delivered" ? "done" : ""} /></div><div className="progress-labels"><span>Confirmed</span><span>Packed</span><span>Shipped</span><span>Delivered</span></div>{order.tracking_number ? <p className="tracking">Tracking: <strong>{order.tracking_number}</strong></p> : null}</article>)}</div> : searched ? <div className="empty-state"><ShoppingBag /><h2>No orders found</h2><p>Check the email used at checkout or start a new order.</p><Link to="/shop">Browse products</Link></div> : <div className="account-placeholder"><PackageCheck /><h2>Find your KhazanaScoop orders</h2><p>Enter the same email address you used during checkout.</p></div>}</AccountLayout>;
}

export function AboutPage() {
  return <StoreLayout><section className="about-page"><div className="about-hero"><div><Breadcrumbs items={[{ label: "About" }]} /><h1>Small joys deserve thoughtful packing.</h1><p>KhazanaScoop began with a simple idea: make cute, useful little finds easier to discover, gift and enjoy.</p><Link to="/shop">Explore the collection</Link></div><img src="/assets/khazana-product-hero.png" alt="KhazanaScoop mystery box and cute products" /></div><div className="about-story"><h2>Made for happy unboxing</h2><p>We bring together stationery, accessories, beauty minis and surprise gifts in clear, easy-to-shop collections. Mystery scoops keep the fun of surprise, while Build Your Own gives you more control over colours, categories and occasions.</p><p>Every order note is read before packing. We cannot guarantee every preference, but we always try to make each box feel considered rather than random.</p></div><div className="values-row"><article><strong>Clear choices</strong><p>Prices, item counts and policies are visible before checkout.</p></article><article><strong>Careful packing</strong><p>Products are checked and prepared for a cheerful arrival.</p></article><article><strong>Useful cuteness</strong><p>Little finds designed for desks, bags, gifting and daily joy.</p></article></div></section></StoreLayout>;
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  return <StoreLayout><section className="standard-page support-page"><Breadcrumbs items={[{ label: "Contact" }]} /><div className="support-grid"><div><h1>How can we help?</h1><p>Questions about an order, product or mystery scoop? Send us a note and include your order number when possible.</p><div className="contact-details"><strong>Email</strong><a href="mailto:hello@khazanascoop.com">hello@khazanascoop.com</a><strong>Support hours</strong><span>Monday–Saturday, 10 AM–6 PM IST</span></div></div><form onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label>Name<input required /></label><label>Email<input required type="email" /></label><label>Order number<input placeholder="Optional" /></label><label>Message<textarea required rows={6} /></label><button>Send message</button>{sent ? <p className="saved-note">Thanks. Your message has been recorded for this MVP.</p> : null}</form></div></section></StoreLayout>;
}

export function FaqPage() {
  const faqs = [
    ["What is a mystery scoop?", "A surprise box containing a stated number of handpicked products. Exact colors, designs and combinations vary."],
    ["Can I request specific categories?", "Yes. Add order notes or choose Build Your Own. Requests are followed where available but cannot be guaranteed."],
    ["How long does shipping take?", "Orders usually dispatch within 2-5 working days. Delivery time depends on your location and courier."],
    ["Can I return a mystery scoop?", "Mystery scoops are not returnable for preference reasons. Damaged, missing or incorrect products can be reported within 48 hours."],
    ["How do I track my order?", "Open My Orders and enter the email address used during checkout."],
  ];
  return <StoreLayout><section className="standard-page faq-page"><Breadcrumbs items={[{ label: "FAQ" }]} /><h1>Frequently asked questions</h1><p>Everything you should know before ordering your scoop.</p><div>{faqs.map(([question, answer], index) => <details open={index === 0} key={question}><summary>{question}<Plus /></summary><p>{answer}</p></details>)}</div></section></StoreLayout>;
}

const policies = {
  shipping: ["Shipping policy", "Orders are normally dispatched within 2-5 working days. Free shipping applies above ₹499; smaller orders have a ₹49 shipping fee.", "Delivery timelines vary by pincode and courier availability. Tracking details appear in My Orders once the package is shipped."],
  returns: ["Returns and refunds", "Mystery scoops and preference-based boxes are not returnable because their contents are selected and packed specifically for each order.", "For damaged, missing or incorrect products, contact us within 48 hours with your order number and an unboxing video or clear photographs."],
  privacy: ["Privacy policy", "KhazanaScoop collects the contact, delivery and order information required to process purchases and provide support.", "We do not sell personal data. Local profile details in this MVP remain in your browser, while completed order records are stored by the backend."],
  terms: ["Terms of service", "By placing an order, you accept that mystery product designs, colors and combinations may vary from illustrative images.", "Orders are prepaid. Availability, dispatch estimates and promotional terms may change, but confirmed order totals remain unchanged."],
} as const;

export function PolicyPage({ kind }: { kind: keyof typeof policies }) {
  const [title, ...paragraphs] = policies[kind];
  return <StoreLayout><section className="standard-page policy-page"><Breadcrumbs items={[{ label: title }]} /><h1>{title}</h1><p className="policy-date">Last updated: 24 June 2026</p>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<h2>Need help?</h2><p>Contact <Link to="/contact">KhazanaScoop support</Link> with your order number and the email used at checkout.</p></section></StoreLayout>;
}
