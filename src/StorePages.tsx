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
import { createCheckout, createReview, getMyOrders, getProduct, getProducts, getPromotions, getReviews } from "./api";
import { getUser, isSupabaseConfigured, signIn, signOut, signUp } from "./supabase";
import type { CartItem, Customer, Order, Product, Promotion, Review, Variant } from "./types";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const CART_KEY = "khazanascoopCustomerCart";
const PROFILE_KEY = "khazanascoopCustomerProfile";
const WISHLIST_KEY = "khazanascoopWishlist";
const byoCategoryOptions = ["Stationery", "Hair Accessories", "Keychains & Charms", "Beauty Minis", "Cute Pens", "Pocket Mirrors", "Stickers & Notes", "Surprise Gifts"];
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

function addProduct(product: Product, variant?: Variant, preferences: Record<string, string> = {}) {
  const selected = variant ?? product.variants[0];
  const variantId = selected?.id ?? "standard";
  const key = `${product.id}:${variantId}:${JSON.stringify(preferences)}`;
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
    preferences,
  });
  writeCart(cart);
}

function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(() => readCart().reduce((sum, item) => sum + item.quantity, 0));
  const [query, setQuery] = useState("");
  const [banner, setBanner] = useState<Promotion | null>(null);
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

  useEffect(() => {
    void getPromotions().then((promotions) => {
      setBanner(promotions.find((promotion) => promotion.banner_placement === "top") ?? null);
    });
  }, []);

  function search(event: FormEvent) {
    event.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  }

  return <>
    <div className="commerce-announce">{banner?.title ?? "Free shipping above ₹499"} <span>•</span> {banner?.message ?? "Packed with care"} <span>•</span> Prepaid orders</div>
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
    <Link className="catalog-copy" to={`/products/${product.slug}`}><small>{product.category}</small><h3>{product.name}</h3><div className="rating"><Star size={14} fill="currentColor" /> {product.average_rating || "New"} <span>({product.review_count})</span></div></Link>
    <div className="catalog-price"><strong>{money.format(product.price)}</strong><button onClick={() => addProduct(product)}>Add to cart</button></div>
  </article>;
}

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") ?? "";
  const categoriesSelected = params.getAll("category");
  const colorsSelected = params.getAll("color");
  const type = params.get("type") ?? "";
  const sort = params.get("sort") ?? "featured";
  const minPrice = Number(params.get("min") ?? 0);
  const maxPrice = Number(params.get("max") ?? 0);

  useEffect(() => {
    void Promise.all([getProducts(), getPromotions()]).then(([catalog, activePromotions]) => {
      setAllProducts(catalog);
      setPromotions(activePromotions);
    });
  }, []);

  useEffect(() => {
    void getProducts({
      q: query || undefined,
      product_type: type || undefined,
      categories: categoriesSelected,
      colors: colorsSelected,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      sort,
    }).then(setProducts);
  }, [params.toString()]);

  const categories = useMemo(() => Array.from(new Set(allProducts.map((product) => product.category))).sort(), [allProducts]);
  const colors = useMemo(() => Array.from(new Set(allProducts.map((product) => product.color).filter(Boolean) as string[])).sort(), [allProducts]);
  const visible = products;

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  function toggleParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    const selected = next.getAll(key);
    next.delete(key);
    (selected.includes(value) ? selected.filter((entry) => entry !== value) : [...selected, value]).forEach((entry) => next.append(key, entry));
    setParams(next);
  }

  return <StoreLayout>
    <section className="catalog-page">
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <div className="catalog-heading"><div><h1>Shop all cute finds</h1><p>Discover stationery, accessories, gifts and scoop-ready favorites.</p></div><span>{visible.length} products</span></div>
      {promotions.filter((promotion) => promotion.banner_placement === "catalog").map((promotion) => <div className="promo-banner" key={promotion.id}><div><strong>{promotion.title}</strong><p>{promotion.message}</p></div><Link to={`/shop?${Array.from(new Set(promotion.product_ids.map((id) => allProducts.find((product) => product.id === id)?.category).filter(Boolean))).map((category) => `category=${encodeURIComponent(category!)}`).join("&")}`}>Shop the combo</Link></div>)}
      <div className="mobile-catalog-tools"><button onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={18} /> Filters</button><select value={sort} onChange={(event) => setParam("sort", event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></div>
      <div className="catalog-layout">
        <aside className={`catalog-filters ${filtersOpen ? "open" : ""}`}>
          <div className="filter-title"><strong>Filters</strong><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div>
          <fieldset><legend>Product type</legend><label><input type="radio" checked={!type} onChange={() => setParam("type", "")} /> All products</label><label><input type="radio" checked={type === "individual"} onChange={() => setParam("type", "individual")} /> Cute essentials</label><label><input type="radio" checked={type === "mystery_scoop"} onChange={() => setParam("type", "mystery_scoop")} /> Mystery scoops</label><label><input type="radio" checked={type === "build_your_own"} onChange={() => setParam("type", "build_your_own")} /> Build your own</label></fieldset>
          <fieldset><legend>Category</legend>{categories.map((item) => <label key={item}><input type="checkbox" checked={categoriesSelected.includes(item)} onChange={() => toggleParam("category", item)} /> {item}</label>)}</fieldset>
          <fieldset><legend>Color</legend><div className="color-filter-grid">{colors.map((item) => <label key={item} title={item}><input type="checkbox" checked={colorsSelected.includes(item)} onChange={() => toggleParam("color", item)} /><span style={{ background: item }} />{item}</label>)}</div></fieldset>
          <fieldset><legend>Price range</legend><div className="price-filter-row"><label>Min<input type="number" min="0" value={minPrice || ""} onChange={(event) => setParam("min", event.target.value)} placeholder="₹0" /></label><label>Max<input type="number" min="0" value={maxPrice || ""} onChange={(event) => setParam("max", event.target.value)} placeholder="₹2000" /></label></div></fieldset>
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });
  const [reviewMessage, setReviewMessage] = useState("");
  const [byoPreferences, setByoPreferences] = useState({ colour: "Pastel mix", occasion: "Self-care", loved: ["Stationery", "Hair Accessories"], avoid: ["Earrings"] });
  useEffect(() => {
    void Promise.all([getProduct(slug), getProducts()]).then(([current, all]) => {
      setProduct(current);
      setSelectedId(current.variants.find((variant) => variant.is_default)?.id ?? current.variants[0]?.id ?? "");
      setRelated(all.filter((item) => item.id !== current.id && item.category === current.category).slice(0, 4));
      setByoPreferences({ colour: "Pastel mix", occasion: "Self-care", loved: ["Stationery", "Hair Accessories"], avoid: ["Earrings"] });
      void getReviews(current.id).then(setReviews);
    });
  }, [slug]);
  if (!product) return <StoreLayout><div className="page-loading">Loading product…</div></StoreLayout>;
  const currentProduct = product;
  const selected = currentProduct.variants.find((variant) => variant.id === selectedId);
  const price = selected?.price ?? currentProduct.price;
  const isBuildYourOwn = currentProduct.product_type === "build_your_own";
  const byoPreferencePayload: Record<string, string> = isBuildYourOwn ? {
    colour: byoPreferences.colour,
    loved: byoPreferences.loved.join(", "),
    avoid: byoPreferences.avoid.length ? byoPreferences.avoid.join(", ") : "None",
    occasion: byoPreferences.occasion,
  } : {};
  function toggleByoPreference(group: "loved" | "avoid", value: string) {
    setByoPreferences((current) => {
      const values = current[group];
      const nextValues = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      return { ...current, [group]: nextValues };
    });
  }
  function add() {
    for (let index = 0; index < quantity; index += 1) addProduct(currentProduct, selected, byoPreferencePayload);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }
  async function submitReview(event: FormEvent) {
    event.preventDefault();
    try {
      const review = await createReview(currentProduct.id, reviewForm);
      setReviews((current) => [review, ...current.filter((item) => item.id !== review.id)]);
      setReviewForm({ rating: 5, title: "", body: "" });
      setReviewMessage("Thanks — your review is live.");
    } catch (error) {
      setReviewMessage(error instanceof Error ? error.message : "Sign in to leave a review.");
    }
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
          <div className="detail-rating"><span><Star size={16} fill="currentColor" /> {currentProduct.average_rating || "New"}</span><a href="#reviews">{currentProduct.review_count} reviews</a></div>
          <div className="detail-price"><strong>{money.format(price)}</strong><span>Inclusive of all taxes</span></div>
          <p className="stock-line">In stock and ready to pack</p><p className="detail-description">{currentProduct.description}</p>
          {currentProduct.variants.length ? <div className="detail-options"><strong>Choose your scoop</strong>{currentProduct.variants.map((variant) => <button className={variant.id === selectedId ? "active" : ""} onClick={() => setSelectedId(variant.id)} key={variant.id}><span>{variant.name}</span><small>{variant.item_count}</small><strong>{money.format(variant.price)}</strong>{variant.compare_at_price ? <del>{money.format(variant.compare_at_price)}</del> : null}</button>)}</div> : null}
          {selected ? <div className="variant-rules"><strong>What this tier includes</strong><ul>{selected.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul><p>{selected.min_items === selected.max_items ? `${selected.min_items} core items` : `${selected.min_items}-${selected.max_items} core items`} + {selected.surprise_gift_count} surprise {selected.surprise_gift_count === 1 ? "gift" : "gifts"}.</p></div> : null}
          {isBuildYourOwn ? <div className="byo-preferences"><strong>Build preferences</strong><div className="preference-select-row"><label>Colour mood<select value={byoPreferences.colour} onChange={(event) => setByoPreferences((current) => ({ ...current, colour: event.target.value }))}><option>Pastel mix</option><option>Pink and cute</option><option>Blue and mint</option><option>Lavender</option><option>Neutral surprise</option></select></label><label>Occasion<select value={byoPreferences.occasion} onChange={(event) => setByoPreferences((current) => ({ ...current, occasion: event.target.value }))}><option>Self-care</option><option>Birthday</option><option>Gifting</option><option>School or college</option><option>Just because</option></select></label></div><fieldset><legend>Loved categories</legend>{byoCategoryOptions.map((item) => <label key={item}><input type="checkbox" checked={byoPreferences.loved.includes(item)} onChange={() => toggleByoPreference("loved", item)} /> {item}</label>)}</fieldset><fieldset><legend>Avoid categories</legend>{["Earrings", "Keychains & Charms", "Hair Accessories", "Beauty Minis", "Cute Pens", "Pocket Mirrors"].map((item) => <label key={item}><input type="checkbox" checked={byoPreferences.avoid.includes(item)} onChange={() => toggleByoPreference("avoid", item)} /> {item}</label>)}</fieldset></div> : null}
          <div className="purchase-row"><div className="quantity-stepper"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus /></button><strong>{quantity}</strong><button onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus /></button></div><button className="add-cart-primary" onClick={add}>{added ? "Added to cart" : "Add to cart"}</button></div>
          <Link className="buy-now" to="/cart" onClick={add}>Buy now</Link>
          <div className="delivery-check"><Truck /><div><strong>Delivery availability</strong><p>Usually dispatched in 2-5 working days across India.</p></div></div>
          <details open><summary>Product details</summary><p>{currentProduct.description} Product colors and exact designs may vary slightly depending on available stock.</p></details>
          <details><summary>Shipping and returns</summary><p>Free shipping above ₹499. Damaged or incorrect items can be reported within 48 hours of delivery.</p></details>
          <details><summary>Care and packing</summary><p>Every order is checked and packed carefully. Mystery products remain surprise-based.</p></details>
        </div>
      </div>
      <section className="product-reviews" id="reviews">
        <div className="reviews-heading"><div><h2>Customer reviews</h2><p><Star size={18} fill="currentColor" /> {currentProduct.average_rating || "New"} from {currentProduct.review_count} reviews</p></div><span>Verified buyers are marked after a paid order.</span></div>
        <div className="reviews-layout">
          <div className="review-list">{reviews.length ? reviews.map((review) => <article key={review.id}><div className="review-stars">{"★★★★★".slice(0, review.rating)}<span>{"★★★★★".slice(review.rating)}</span></div><h3>{review.title}</h3><p>{review.body}</p><footer><strong>{review.customer_name}</strong>{review.verified ? <em>Verified buyer</em> : null}<time>{new Date(review.created_at).toLocaleDateString("en-IN")}</time></footer></article>) : <div className="empty-review"><Star /><h3>Be the first to review this product</h3></div>}</div>
          <form className="review-form" onSubmit={submitReview}><h3>Share your experience</h3><label>Rating<select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}>{[5, 4, 3, 2, 1].map((rating) => <option value={rating} key={rating}>{rating} stars</option>)}</select></label><label>Title<input required value={reviewForm.title} onChange={(event) => setReviewForm({ ...reviewForm, title: event.target.value })} placeholder="What stood out?" /></label><label>Review<textarea required value={reviewForm.body} onChange={(event) => setReviewForm({ ...reviewForm, body: event.target.value })} placeholder="Tell other shoppers about the item count, packing and preferences." /></label><button>Submit review</button>{reviewMessage ? <p className="review-message">{reviewMessage}</p> : null}</form>
        </div>
      </section>
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
  const [orderNote, setOrderNote] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal && subtotal < 499 ? 49 : 0;
  function update(localId: string, delta: number) {
    const next = cart.map((item) => item.localId === localId ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0);
    setCart(next); writeCart(next);
  }
  async function checkout(event: FormEvent) {
    event.preventDefault();
    const order = await createCheckout(profile, cart, orderNote, exclusions, promotionCode);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    writeCart([]); setCart([]); setMessage(`Order ${order.id} placed successfully.`);
  }
  return <StoreLayout><section className="standard-page cart-page"><Breadcrumbs items={[{ label: "Cart" }]} /><h1>Your shopping bag</h1>{message ? <div className="success-banner"><PackageCheck />{message}<Link to="/my-orders">View order</Link></div> : null}{cart.length ? <div className="cart-layout"><div className="cart-list">{cart.map((item) => <article key={item.localId}><div className="cart-product-art">✦</div><div><h3>{item.product_name}</h3><p>{item.variant_name}</p><strong>{money.format(item.price)}</strong></div><div className="quantity-stepper"><button onClick={() => update(item.localId, -1)}><Minus /></button><strong>{item.quantity}</strong><button onClick={() => update(item.localId, 1)}><Plus /></button></div><button className="remove-item" onClick={() => update(item.localId, -item.quantity)}>Remove</button></article>)}</div><form className="checkout-summary" onSubmit={checkout}><h2>Order summary</h2><div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping ? money.format(shipping) : "Free"}</strong></div><div className="summary-total"><span>Total before offers</span><strong>{money.format(subtotal + shipping)}</strong></div><h3>Delivery details</h3><input required placeholder="Full name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /><input required placeholder="Phone" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /><input required type="email" placeholder="Email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /><textarea required placeholder="Complete shipping address" value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} /><h3>Scoop preferences</h3><label>Do not include<textarea value={exclusions} onChange={(event) => setExclusions(event.target.value)} placeholder="Earrings, keychains, specific colours or materials" /></label><label>Order and gift notes<textarea value={orderNote} onChange={(event) => setOrderNote(event.target.value)} placeholder="Birthday message, colour preferences, packing requests" /></label><label>Promotion code<input value={promotionCode} onChange={(event) => setPromotionCode(event.target.value.toUpperCase())} placeholder="Optional" /></label><button>Checkout prepaid</button><small>Automatic combo and free-shipping offers are calculated securely by the backend.</small></form></div> : <div className="empty-state"><ShoppingBag /><h2>Your bag is waiting</h2><p>Add a few cute finds and they will appear here.</p><Link to="/shop">Start shopping</Link></div>}</section></StoreLayout>;
}

function AccountLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return <StoreLayout><section className="standard-page account-page"><Breadcrumbs items={[{ label: "Account" }]} /><div className="account-heading"><h1>{title}</h1><p>Manage your details and keep track of every KhazanaScoop order.</p></div><div className="account-layout"><aside><NavLink to="/profile"><CircleUserRound /> Profile</NavLink><NavLink to="/my-orders"><ShoppingBag /> My orders</NavLink><NavLink to="/shop"><Heart /> Wishlist & shop</NavLink><NavLink to="/contact"><Truck /> Help & support</NavLink></aside><div className="account-content">{children}</div></div></section></StoreLayout>;
}

export function CustomerProfilePage() {
  const [profile, setProfile] = useState<Customer>(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{"name":"","phone":"","email":"","address":""}'); } catch { return { name: "", phone: "", email: "", address: "" }; }
  });
  const [saved, setSaved] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authUserEmail, setAuthUserEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  useEffect(() => {
    void getUser().then((user) => {
      if (user?.email) {
        setAuthUserEmail(user.email);
        setAuthEmail(user.email);
        setProfile((current) => ({ ...current, email: current.email || user.email || "" }));
      }
    });
  }, []);
  function save(event: FormEvent) { event.preventDefault(); localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); setSaved(true); }
  async function authenticate(event: FormEvent) {
    event.preventDefault();
    try {
      const result = authMode === "signin" ? await signIn(authEmail, authPassword) : await signUp(authEmail, authPassword);
      const email = result.user?.email ?? authEmail;
      setAuthUserEmail(email);
      setProfile((current) => ({ ...current, email }));
      setAuthMessage(authMode === "signup" && !result.session ? "Check your email to confirm the account." : "You are signed in.");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed.");
    }
  }
  async function logout() {
    await signOut();
    setAuthUserEmail("");
    setAuthMessage("Signed out.");
  }
  return <AccountLayout title="My profile"><div className="account-stack">{isSupabaseConfigured ? authUserEmail ? <section className="auth-status"><div><strong>Signed in securely</strong><p>{authUserEmail}</p></div><button onClick={() => void logout()}>Sign out</button></section> : <form className="auth-form" onSubmit={authenticate}><div><h2>{authMode === "signin" ? "Sign in" : "Create account"}</h2><p>Use Supabase Auth to protect orders and verified reviews.</p></div><label>Email<input required type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} /></label><label>Password<input required minLength={6} type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} /></label><button>{authMode === "signin" ? "Sign in" : "Create account"}</button><button className="auth-switch" type="button" onClick={() => setAuthMode((mode) => mode === "signin" ? "signup" : "signin")}>{authMode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}</button>{authMessage ? <p>{authMessage}</p> : null}</form> : <div className="auth-warning"><strong>Supabase Auth is ready in code.</strong><p>Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sign-in.</p></div>}<form className="profile-form" onSubmit={save}><div><h2>Personal information</h2><p>These details make checkout faster and are linked to your account after checkout.</p></div><label>Full name<input required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label><label>Phone number<input required value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label><label>Email address<input required readOnly={Boolean(authUserEmail)} type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label><label className="full-field">Default shipping address<textarea required value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} /></label><button>Save profile</button>{saved ? <span className="saved-note">Profile saved</span> : null}</form></div></AccountLayout>;
}

export function CustomerOrdersPage() {
  const [email, setEmail] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}").email ?? ""; } catch { return ""; }
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  async function lookup(event?: FormEvent) { event?.preventDefault(); setOrders(await getMyOrders(email)); setSearched(true); }
  useEffect(() => { void getUser().then((user) => { setSignedIn(Boolean(user)); if (user?.email) setEmail(user.email); if (user) void lookup(); }); }, []);
  return <AccountLayout title="My orders">{signedIn ? <div className="signed-in-order-note"><PackageCheck /><span>Orders are protected by your signed-in account.</span><button onClick={() => void lookup()}>Refresh</button></div> : <div className="auth-warning"><strong>Sign in to view orders</strong><p>For privacy, production order history no longer uses email-only lookup.</p><Link to="/profile">Go to sign in</Link></div>}{orders.length ? <div className="customer-orders">{orders.map((order) => <article key={order.id}><header><div><small>Order</small><strong>{order.id}</strong></div><div><small>Placed</small><strong>{new Date(order.created_at).toLocaleDateString("en-IN")}</strong></div><div><small>Total</small><strong>{money.format(order.total)}</strong></div><span>{order.fulfilment_status}</span></header><div className="order-products">{order.items.map((item) => <p key={`${order.id}-${item.product_id}`}>{item.quantity} × {item.product_name} <span>{item.variant_name}</span></p>)}</div>{order.exclusions ? <p className="order-exclusions"><strong>Excluded:</strong> {order.exclusions}</p> : null}{order.discount_total ? <p><strong>Promotion savings:</strong> {money.format(order.discount_total)}</p> : null}<div className="order-progress"><i className="done" /><i className={["packed", "shipped", "delivered"].includes(order.fulfilment_status) ? "done" : ""} /><i className={["shipped", "delivered"].includes(order.fulfilment_status) ? "done" : ""} /><i className={order.fulfilment_status === "delivered" ? "done" : ""} /></div><div className="progress-labels"><span>Confirmed</span><span>Packed</span><span>Shipped</span><span>Delivered</span></div>{order.tracking_number ? <p className="tracking">Tracking: <strong>{order.tracking_number}</strong></p> : null}</article>)}</div> : searched ? <div className="empty-state"><ShoppingBag /><h2>No orders found</h2><p>Your signed-in account has no completed orders yet.</p><Link to="/shop">Browse products</Link></div> : <div className="account-placeholder"><PackageCheck /><h2>Your protected order history</h2><p>Sign in to load orders linked to your Supabase account.</p></div>}</AccountLayout>;
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
