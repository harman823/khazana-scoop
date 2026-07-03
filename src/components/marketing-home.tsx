"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CircleUserRound,
  Gift,
  PackageCheck,
  Play,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import CircularGallery from "./circular-gallery";
import { EcommerceFooter } from "./ecommerce-footer";
import { PillNav } from "./pill-nav";
import { StaggeredMenu } from "./staggered-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { calculateCart, formatMoney } from "@/lib/pricing";
import { featuredProducts } from "@/lib/products";
import type { AddOn, CustomerOrder, UserProfile } from "@/lib/types";

type MarketingHomeProps = {
  addOns: AddOn[];
  currentUser: UserProfile;
  orders: CustomerOrder[];
};

const showreelItems = [
  { title: "Medium scoops", caption: "Freshly packed charms", status: "LIVE" },
  { title: "Large unboxings", caption: "Soft pastel crystal pulls", status: "NEW" },
  { title: "Small surprise packs", caption: "Cute starter hauls", status: "SOON" },
  { title: "Lucky capsule reveal", caption: "Tiny bonus surprises", status: "LIVE" },
  { title: "Stationery sparkle mix", caption: "Clips, flakes, minis", status: "NEW" },
  { title: "Charm rush", caption: "Fast scoop highlights", status: "LIVE" },
];

const profileMenuItems = [
  { key: "profile", label: "Your profile", ariaLabel: "Open your profile" },
  { key: "orders", label: "Your orders", ariaLabel: "Open your orders" },
  { key: "rewards", label: "Rewards", ariaLabel: "Open rewards" },
  { key: "settings", label: "Settings", ariaLabel: "Open settings" },
];

const homeNavItems = [
  { label: "Scoops", href: "#scoops" },
  { label: "Products", href: "#products" },
  { label: "Live videos", href: "#videos" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const bestSellerProducts = [
  featuredProducts[0],
  featuredProducts[1],
  featuredProducts[2],
  featuredProducts[4],
  featuredProducts[3],
].filter(Boolean);

const attractionProducts = [
  featuredProducts[3],
  featuredProducts[2],
  featuredProducts[0],
  featuredProducts[4],
  featuredProducts[1],
].filter(Boolean);

const testimonials = [
  {
    title: "The cutest packing experience",
    quote: "My scoop arrived exactly like the live reveal. The colors, tiny charms, and tracking updates made it feel personal from start to finish.",
    author: "Maya Chen",
    role: "Collector and repeat customer",
    avatar: "MC",
  },
  {
    title: "Fast, clear, and genuinely fun",
    quote: "I ordered a medium scoop with a lucky capsule. The order page showed every step and the packing video was the best part.",
    author: "Jordan Lee",
    role: "Stationery lover",
    avatar: "JL",
  },
  {
    title: "Great gift energy",
    quote: "I sent one to my sister and she immediately asked where to build another. The assortment felt curated, not random.",
    author: "Priya Shah",
    role: "Gift buyer",
    avatar: "PS",
  },
  {
    title: "Re-scoop made it stress free",
    quote: "The approval window and re-scoop option made the whole process feel fair. I knew exactly what was happening.",
    author: "Alex Rivera",
    role: "Scoop Points member",
    avatar: "AR",
  },
];

export function MarketingHome({
  addOns,
  currentUser,
  orders,
}: MarketingHomeProps): React.ReactElement {
  const selectedAddOns = addOns.filter((addOn) => addOn.enabledByDefault).map((addOn) => addOn.id);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [activeProfilePanel, setActiveProfilePanel] = useState<string>("profile");
  const cart = useMemo(
    () => calculateCart({ tierId: "medium", addOnIds: selectedAddOns }),
    [selectedAddOns],
  );

  return (
    <main>
      <section className="hero-video-section" id="scoops">
        <video
          aria-label="Mystery Scoop collectible assortment background video"
          autoPlay
          className="hero-video"
          loop
          muted
          playsInline
          poster="/mystery-scoop-hero.png"
        >
          <source src="/mystery-scoop-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-dim-layer" />

        <header className="hero-nav shell">
          <PillNav
            activeHref="#scoops"
            baseColor="#1e293b"
            className="hero-pill-nav"
            hoveredPillTextColor="#ffffff"
            items={homeNavItems}
            pillColor="#fffdf5"
            pillTextColor="#1e293b"
          />
          <div className="flex items-center gap-2">
            <button className="button-quiet hero-icon-button focus-ring" aria-label="Search">
              <Search size={24} strokeWidth={2.6} />
            </button>
            <button
              className="button-quiet hero-icon-button hidden md:inline-flex"
              type="button"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen(true)}
            >
              <CircleUserRound size={24} strokeWidth={2.6} />
            </button>
            <button
              className="button-primary hero-cart-button"
              type="button"
              aria-label="Open cart"
              aria-expanded={cartOpen}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={25} strokeWidth={2.7} />
            </button>
          </div>
        </header>

        <div className="hero-bottom-content shell">
          <h1>
            Pick a scoop.
            <span>Reveal the surprise.</span>
          </h1>
          <p>
            Choose a size, add a lucky twist, and watch your mystery assortment come to life.
          </p>
          <div className="hero-cta-row">
            <Link className="button-primary focus-ring" href="/mystery-scoops">
              Build my scoop <Sparkles size={18} />
            </Link>
            <Link className="button-secondary focus-ring" href="/mystery-scoops">
              Mystery scoops
            </Link>
          </div>
        </div>
      </section>

      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} />
      <StaggeredMenu
        open={profileOpen}
        items={profileMenuItems}
        activeKey={activeProfilePanel}
        onSelect={setActiveProfilePanel}
        onClose={() => setProfileOpen(false)}
        colors={["#ffe2ec", "#dff9f7", "#00b8ad"]}
        accentColor="#f72c7b"
      >
        {activeProfilePanel === "profile" ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <ProfileSidebarPanel currentUser={currentUser} />
            <OrdersSidebarPanel orders={orders} />
          </div>
        ) : null}
        {activeProfilePanel === "orders" ? <OrdersSidebarPanel orders={orders} /> : null}
        {activeProfilePanel === "rewards" ? <RewardsSidebarPanel /> : null}
        {activeProfilePanel === "settings" ? <SettingsSidebarPanel /> : null}
      </StaggeredMenu>

      <section id="products" className="product-showcase shell">
        <ProductGallerySection
          title="Best sellers"
          tone="pink"
          products={bestSellerProducts}
          bend={2.8}
          scrollSpeed={1.05}
        />
        <ProductGallerySection
          title="Our best attractions"
          tone="teal"
          products={attractionProducts}
          bend={-2.4}
          scrollSpeed={0.9}
        />
      </section>

      <section id="videos" className="shell border-t border-[#efe4e8] py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Watch it packed</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              A smooth showreel of recent mystery scoop reveals, styled like a clean looping GIF.
            </p>
          </div>
          <Link className="hidden text-sm font-black text-[var(--teal-dark)] sm:block" href="/orders/MS-12487">
            View all
          </Link>
        </div>

        <Carousel opts={{ align: "start" }} className="showreel-carousel mt-6 w-full">
          <CarouselContent>
            {showreelItems.map((item) => (
              <CarouselItem className="basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4" key={item.title}>
                <Card className="showreel-card">
                  <CardContent className="p-0">
                    <div className="relative h-44 bg-[#ffe9f1] sm:h-52">
                      <Image
                        alt={item.title}
                        fill
                        src="/mystery-scoop-hero.png"
                        className="object-cover"
                        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <span className="absolute left-3 top-3 rounded-[5px] bg-[#f72c7b] px-2 py-1 text-xs font-black text-white">
                        {item.status}
                      </span>
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-black/55 text-white">
                          <Play size={20} fill="currentColor" />
                        </span>
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-black">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted">{item.caption}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <TestimonialsSection />

      <section className="shell border-t border-[#efe4e8] py-10">
        <div>
          <h2 className="text-3xl font-black">Built for trust & care</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <TrustItem icon={<PackageCheck size={20} />} title="Real-time inventory" body="We only sell what we can pack." />
            <TrustItem icon={<Bell size={20} />} title="Low-stock alerts" body="Popular items are restocked fast." />
            <TrustItem icon={<PackageCheck size={20} />} title="Fair & transparent" body="Our promise to every scooper." />
          </div>
          <Link className="button-secondary mt-6 w-fit" href="/admin/fulfillment">Open admin operations</Link>
        </div>
      </section>

      <EcommerceFooter />
    </main>
  );
}

function ProductGallerySection({
  title,
  tone,
  products,
  bend,
  scrollSpeed,
}: {
  title: string;
  tone: "pink" | "teal";
  products: typeof featuredProducts;
  bend: number;
  scrollSpeed: number;
}): React.ReactElement {
  return (
    <section className={`product-gallery-section product-gallery-section-${tone}`}>
      <div className="product-gallery-heading">
        <h2>{title}</h2>
        <Link className="button-secondary" href="/products">View all products</Link>
      </div>
      <div className="product-gallery-frame">
        <CircularGallery
          items={products.map((product) => ({
            href: product.route,
            image: product.image,
            text: product.name,
          }))}
          bend={bend}
          borderRadius={0.07}
          font="bold 34px Arial"
          scrollEase={0.022}
          scrollSpeed={scrollSpeed}
          textColor="#1e293b"
        />
      </div>
    </section>
  );
}

function TestimonialsSection(): React.ReactElement {
  return (
    <section className="testimonials-section shell" aria-labelledby="testimonials-title">
      <div className="testimonials-header">
        <span className="testimonials-badge">
          <Star size={14} fill="currentColor" />
          Customer love
        </span>
        <h2 id="testimonials-title">Collectors keep coming back</h2>
        <p>
          Real notes from scoop lovers who track the reveal, watch the packing, and save
          their favorite tiny treasures.
        </p>
        <div className="testimonials-links">
          <Link href="/products">
            Shop best sellers <ArrowRight size={16} />
          </Link>
          <Link href="/contact">
            Share feedback <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <Carousel opts={{ align: "start" }} className="testimonials-carousel-wrap">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3" key={testimonial.author}>
              <Card className="testimonial-card">
                <CardContent>
                  <div className="testimonial-stars" aria-label="Five star review">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star fill="currentColor" key={index} size={16} />
                    ))}
                  </div>
                  <h3>{testimonial.title}</h3>
                  <p>{testimonial.quote}</p>
                  <div className="testimonial-author">
                    <span>{testimonial.avatar}</span>
                    <div>
                      <strong>{testimonial.author}</strong>
                      <small>{testimonial.role}</small>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}

function CartDrawer({
  cart,
  open,
  onClose,
}: {
  cart: ReturnType<typeof calculateCart>;
  open: boolean;
  onClose: () => void;
}): React.ReactElement {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        className={`absolute inset-0 bg-black/20 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        type="button"
        aria-label="Close cart drawer"
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-[560px] overflow-y-auto border-l border-[#eadfe4] bg-white p-5 shadow-[-24px_0_60px_rgba(72,28,44,0.16)] transition-transform duration-200 sm:p-8 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Your scoop bag"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Your scoop bag</h2>
          <button
            className="grid h-9 w-9 place-items-center rounded-[7px] text-xl text-muted hover:bg-[#fff1f6]"
            type="button"
            aria-label="Close cart"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {cart.lines.map((line) => (
            <div
              key={line.label}
              className="flex min-h-[76px] items-center justify-between rounded-[7px] bg-[#fff8fb] px-4 py-3"
            >
              <div>
                <p className="text-base font-black">{line.label}</p>
                <p className="text-sm text-muted">{line.quantity} x {formatMoney(line.priceCents)}</p>
              </div>
              <button className="text-lg text-muted" type="button" aria-label={`Remove ${line.label}`}>
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-[#efe4e8] pt-6 text-base">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <strong>{formatMoney(cart.subtotalCents)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <strong>{formatMoney(cart.shippingCents)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Est. total</span>
            <strong>{formatMoney(cart.totalCents)}</strong>
          </div>
        </div>

        <Link className="button-primary mt-7 w-full" href="/checkout">
          View cart ({cart.lines.length})
        </Link>
        <p className="mt-5 rounded-[7px] bg-[#effbf5] p-4 text-sm font-bold text-[#06734f]">
          You will earn {cart.pointsEarned} Scoop Points on this order.
        </p>
      </aside>
    </div>
  );
}

function ProfileSidebarPanel({ currentUser }: { currentUser: UserProfile }): React.ReactElement {
  return (
    <section className="app-card p-6">
      <h2 className="text-3xl font-black">Your rewards & profile</h2>
      <div className="mt-7 flex items-center gap-5">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-[#ffe2ec] text-4xl">Hi</span>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-black">Hey, {currentUser.name}!</p>
          <p className="text-sm text-muted">Scoop lover since {currentUser.memberSince}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black">Scoop Points</p>
          <p className="text-5xl font-black text-[#f72c7b]">{currentUser.scoopPoints.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-7 h-3 rounded-full bg-[#f2e8ed]">
        <div className="h-3 w-2/3 rounded-full bg-[#f72c7b]" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {["100 pts Birthday bonus", "1 pt / $1 Earn on every order", "Early access To drops & themes", "Exclusive perks Just for members"].map((perk) => (
          <div className="rounded-[7px] bg-[#fff3f7] p-4 text-center text-xs font-bold" key={perk}>
            <Gift className="mx-auto mb-2 text-[#f72c7b]" size={22} />
            {perk}
          </div>
        ))}
      </div>
      <Link className="button-secondary mt-5 w-full" href="/account">View rewards</Link>
    </section>
  );
}

function OrdersSidebarPanel({ orders }: { orders: CustomerOrder[] }): React.ReactElement {
  return (
    <section className="app-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Your orders</h2>
      <Link className="text-sm font-black text-[var(--teal-dark)]" href="/account">View all</Link>
      </div>
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <Link
            className="flex items-center gap-4 rounded-[7px] border border-[#efe4e8] p-4"
            href={`/orders/${order.id}`}
            key={order.id}
          >
            <StatusIcon status={order.status} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black">Order #{order.id}</span>
              <span className="block text-xs text-muted">{order.createdAt} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}</span>
            </span>
            <span className="rounded-[5px] bg-[#f7f3f5] px-2 py-1 text-xs font-black">{order.status}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RewardsSidebarPanel(): React.ReactElement {
  return (
    <section className="app-card p-6">
      <h2 className="text-3xl font-black">Rewards</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {["Birthday surprise", "Theme drop early access", "Free lucky capsule", "Member-only scoops"].map((reward) => (
          <div className="rounded-[7px] bg-[#fff3f7] p-5 text-sm font-black" key={reward}>
            <Gift className="mb-3 text-[#f72c7b]" size={24} />
            {reward}
          </div>
        ))}
      </div>
    </section>
  );
}

function SettingsSidebarPanel(): React.ReactElement {
  return (
    <section className="app-card p-6">
      <h2 className="text-3xl font-black">Settings</h2>
      <div className="mt-5 space-y-3">
        {["Email notifications", "Live scoop reminders", "Shipping preferences"].map((setting) => (
          <label className="flex items-center justify-between rounded-[7px] bg-[#fff8fb] p-4 text-sm font-black" key={setting}>
            {setting}
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#f72c7b]" />
          </label>
        ))}
      </div>
    </section>
  );
}

function StatusIcon({ status }: { status: string }): React.ReactElement {
  const className =
    status === "Pending" ? "bg-[#fff5dc] text-[#f2a51d]" :
    status === "Scooped" ? "bg-[rgba(0,184,173,0.1)] text-[var(--teal-dark)]" :
    status === "Shipped" ? "bg-[rgba(0,184,173,0.1)] text-[var(--teal)]" :
    "bg-[#f5f0f3] text-[#6f6469]";
  return (
    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${className}`}>
      <PackageCheck size={20} />
    </span>
  );
}

function TrustItem({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}): React.ReactElement {
  return (
    <div className="app-card flex gap-3 p-5">
      <span className="grid h-10 w-10 place-items-center rounded-[7px] bg-[rgba(0,184,173,0.1)] text-[var(--teal)]">{icon}</span>
      <span>
        <strong className="block text-sm">{title}</strong>
        <span className="text-xs text-muted">{body}</span>
      </span>
    </div>
  );
}
