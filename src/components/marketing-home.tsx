"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, ChevronRight } from "lucide-react";
import { featuredProducts } from "@/lib/products";
import { formatMoney } from "@/lib/pricing";
import type { AddOn, CustomerOrder, UserProfile } from "@/lib/types";
import { StorefrontFooter } from "@/components/storefront-shell";

type MarketingHomeProps = {
  addOns: AddOn[];
  currentUser: UserProfile;
  orders: CustomerOrder[];
};

export function MarketingHome({
  addOns,
  currentUser,
  orders,
}: MarketingHomeProps): React.ReactElement {
  
  const categories = [
    { name: "All Products", image: featuredProducts[0]?.image || "/mystery-scoop-hero.png" },
    { name: "Mystery Scoops", image: featuredProducts[1]?.image || "/mystery-scoop-hero.png" },
    { name: "Lucky Capsules", image: featuredProducts[2]?.image || "/mystery-scoop-hero.png" },
    { name: "Stationery", image: featuredProducts[3]?.image || "/mystery-scoop-hero.png" },
    { name: "Charm Mixes", image: featuredProducts[4]?.image || "/mystery-scoop-hero.png" },
    { name: "Crystal Scoops", image: featuredProducts[0]?.image || "/mystery-scoop-hero.png" },
  ];

  return (
    <main className="min-h-screen bg-white text-[#1e293b]">
      {/* Top Banner Promo */}
      <div className="bg-[#F5CBCB] text-[#1e293b] py-2 flex justify-center items-center gap-2 md:gap-4 text-xs font-poppins font-semibold tracking-wide">
        <span>Free Shipping</span>
        <span>•</span>
        <span>PAN India</span>
        <span>•</span>
        <span>5-6 days delivery</span>
      </div>

      {/* Header Mimicking Uniseoul */}
      <header className="sticky top-0 z-50 bg-white shadow-sm py-4 px-4 md:px-8 flex items-center justify-between">
        <div className="flex-1 lg:hidden">
          <button className="p-2 text-[#1e293b]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
        
        {/* Nav Links (Desktop) */}
        <nav className="hidden lg:flex flex-1 items-center gap-8 font-baloo text-lg font-medium text-[#1e293b]">
          <Link href="/products" className="hover:text-[#C5B3D3] transition-colors">SHOP</Link>
          <Link href="/new" className="hover:text-[#C5B3D3] transition-colors">NEW ARRIVALS</Link>
          <Link href="/mystery-scoops" className="text-[#C5B3D3]">MYSTERY SCOOPS</Link>
          <Link href="/about" className="hover:text-[#C5B3D3] transition-colors">ABOUT US</Link>
        </nav>

        {/* Logo */}
        <div className="flex-1 flex justify-center lg:flex-none">
          <Link href="/" className="font-baloo text-3xl font-bold tracking-tight text-[#C5B3D3]">
            KHAZANA SCOOP
          </Link>
        </div>

        {/* Icons */}
        <div className="flex-1 flex justify-end items-center gap-4 lg:gap-6 text-[#1e293b]">
          <button aria-label="Search" className="hover:text-[#C5B3D3] transition-colors">
            <Search size={22} strokeWidth={2.5} />
          </button>
          <Link href="/account" aria-label="Account" className="hidden lg:block hover:text-[#C5B3D3] transition-colors">
            <User size={22} strokeWidth={2.5} />
          </Link>
          <button aria-label="Cart" className="relative hover:text-[#C5B3D3] transition-colors">
            <ShoppingBag size={22} strokeWidth={2.5} />
            <span className="absolute -top-1 -right-2 bg-[#F5CBCB] text-[#1e293b] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </header>

      {/* Hero Banner Area */}
      <section className="w-full">
        <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] bg-[#FBEFEF]">
          <Image 
            src="/mystery-scoop-hero.png" 
            alt="Hero Banner" 
            fill 
            className="object-cover"
            priority
          />
          {/* Overlay to match Uniseoul's vibrant text banners if needed */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 bg-gradient-to-t from-black/40 to-transparent">
             <Link href="/products" className="bg-[#C5B3D3]text-[#1e293b] font-baloo font-semibold text-lg px-8 py-3 rounded-full transition-colors">
               SHOP NOW
             </Link>
          </div>
        </div>
      </section>

      {/* Circular Categories */}
      <section className="py-12 px-4">
        <h2 className="text-center font-baloo text-3xl md:text-4xl font-bold mb-8 text-[#1e293b]">Shop by Category</h2>
        <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-8 justify-start lg:justify-center px-4 pb-4">
          {categories.map((cat, i) => (
            <Link href="/products" key={i} className="flex flex-col items-center gap-3 min-w-[100px] md:min-w-[120px] group">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#C5B3D3] transition-colors">
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="font-poppins text-sm md:text-base font-semibold text-center whitespace-nowrap group-hover:text-[#C5B3D3] transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Double Banners */}
      <section className="py-8 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <Link href="/mystery-scoops" className="relative aspect-[16/9] md:aspect-[4/3] rounded-3xl overflow-hidden group">
            <Image src={featuredProducts[1]?.image || "/mystery-scoop-hero.png"} alt="Mystery" fill className="object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="font-baloo text-3xl font-bold mb-2">Build a Scoop</h3>
              <span className="inline-block border-b-2 border-white font-poppins font-semibold pb-1">Shop Collection</span>
            </div>
          </Link>
          <Link href="/products/lucky-capsules" className="relative aspect-[16/9] md:aspect-[4/3] rounded-3xl overflow-hidden group">
            <Image src={featuredProducts[2]?.image || "/mystery-scoop-hero.png"} alt="Hamper" fill className="object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="font-baloo text-3xl font-bold mb-2">Lucky Hamper</h3>
              <span className="inline-block border-b-2 border-white font-poppins font-semibold pb-1">Shop Collection</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Hampers Section Grid */}
      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-baloo text-3xl md:text-4xl font-bold text-[#1e293b]">Hampers</h2>
          <Link href="/products" className="hidden md:flex items-center gap-1 font-poppins font-semibold text-[#C5B3D3] hover:text-[#1e293b] transition-colors">
            View All <ChevronRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <div key={product.slug + '-hamper'} className="group flex flex-col bg-white">
              <Link href={product.route} className="relative aspect-[4/5] bg-[#FBEFEF] rounded-2xl overflow-hidden mb-3">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition duration-500 group-hover:scale-105" 
                />
                {/* Hover Add to Cart */}
                <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button className="w-full bg-[#F5CBCB] text-[#1e293b] font-baloo font-semibold py-2.5 rounded-full shadow-lg hover:bg-[#C5B3D3]text-[#1e293b] transition-colors">
                    Add to Cart
                  </button>
                </div>
              </Link>
              <Link href={product.route} className="flex flex-col flex-1 px-1">
                <h3 className="font-poppins text-sm md:text-base font-medium text-[#1e293b] line-clamp-2">{product.name}</h3>
                <div className="mt-auto pt-2 flex items-center gap-2">
                  <span className="font-barlow text-lg font-bold text-[#C5B3D3]">{formatMoney(product.priceCents)}</span>
                  <span className="font-barlow text-sm text-[#1e293b]/50 line-through">{formatMoney(product.priceCents + 500)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee Separator */}
      <div className="bg-[#FFE2E2] text-[#1e293b] py-4 overflow-hidden whitespace-nowrap text-xl md:text-3xl font-baloo font-bold uppercase tracking-wider">
        <div className="animate-marquee inline-block">
          <span className="mx-6">✨ NEW MYSTERY SCOOPS</span> • <span className="mx-6">🎀 CUTE STATIONERY</span> • <span className="mx-6">💖 LUCKY HAMPERS</span> • <span className="mx-6">✨ NEW MYSTERY SCOOPS</span> • <span className="mx-6">🎀 CUTE STATIONERY</span> • <span className="mx-6">💖 LUCKY HAMPERS</span>
        </div>
      </div>

      {/* EXPLORE COLLECTIONS */}
      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <h2 className="font-baloo text-3xl md:text-4xl font-bold text-[#1e293b] text-center mb-10">Explore Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {['Gift Sets', 'Plushies', 'Stickers', 'Keychains'].map((col, i) => (
            <Link href="/products" key={i} className="group relative aspect-square bg-[#FFE2E2] rounded-3xl overflow-hidden flex items-end p-6">
              <Image src={`/mystery-scoop-hero.png`} alt={col} fill className="object-cover group-hover:scale-105 transition duration-500 opacity-60 mix-blend-multiply" />
              <div className="relative z-10 w-full text-center">
                <span className="bg-white/90 backdrop-blur text-[#1e293b] font-baloo font-semibold px-4 py-2 rounded-full shadow-sm group-hover:bg-[#C5B3D3]text-[#1e293b] transition-colors">{col}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Time Favourite collections */}
      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto bg-[#FBEFEF] rounded-3xl mb-16">
        <h2 className="font-baloo text-3xl md:text-4xl font-bold text-[#1e293b] text-center mb-10">All Time Favourite collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <div key={product.slug + '-fav'} className="group flex flex-col bg-white p-3 rounded-2xl shadow-sm border border-[#C5B3D3]/20">
              <Link href={product.route} className="relative aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden mb-3">
                <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button className="w-full bg-[#C5B3D3]text-[#1e293b] font-baloo font-semibold py-2 rounded-full shadow hover:bg-[#1e293b] transition-colors">
                    Add to Cart
                  </button>
                </div>
              </Link>
              <Link href={product.route} className="flex flex-col flex-1 px-1 text-center">
                <h3 className="font-poppins text-sm md:text-base font-medium text-[#1e293b] line-clamp-1">{product.name}</h3>
                <div className="mt-1 flex justify-center items-center gap-2">
                  <span className="font-barlow text-lg font-bold text-[#C5B3D3]">{formatMoney(product.priceCents)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Too Cute to Miss! */}
      <section className="py-8 px-4 md:px-8 max-w-[1600px] mx-auto">
        <h2 className="font-baloo text-3xl md:text-4xl font-bold text-[#1e293b] text-center mb-10">Too Cute to Miss!</h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((item) => (
            <Link href="/products" key={item} className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden group shadow-md border border-[#FFE2E2]">
              <Image src={`/mystery-scoop-hero.png`} alt="Cute feature" fill className="object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Watch & Shop */}
      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-baloo text-3xl md:text-4xl font-bold text-[#1e293b]">Watch & Shop</h2>
          <Link href="/mystery-scoops" className="hidden md:flex items-center gap-1 font-poppins font-semibold text-[#C5B3D3] hover:text-[#1e293b] transition-colors">
            View All <ChevronRight size={18} />
          </Link>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
          {[1, 2, 3, 4, 5].map((reel) => (
            <Link href="/products" key={reel} className="relative min-w-[200px] w-[200px] md:min-w-[280px] md:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden group shadow-sm flex-shrink-0">
              <Image src={`/mystery-scoop-hero.png`} alt="Reel" fill className="object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#C5B3D3]text-[#1e293b] border border-white/50 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z"/></svg>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-poppins text-sm font-medium line-clamp-2 drop-shadow-md">Pack an order with us! ✨🎀</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <StorefrontFooter />

      {/* Marquee Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </main>
  );
}
