import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Sparkles, Star } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ScoopPreferencesBuilder } from "@/components/product/scoop-preferences-builder";

export default function MysteryScoopsPage(): React.ReactElement {
  return (
    <main className="min-h-screen pb-16">
      <header className="shell flex min-h-20 items-center justify-between gap-4 py-4">
        <BrandMark />
        <nav className="hidden items-center gap-8 text-sm font-black md:flex">
          <Link href="/">Home</Link>
          <Link href="/mystery-scoops">Mystery scoops</Link>
          <Link href="/cart">Cart</Link>
        </nav>
        <Link className="button-primary h-14 w-14 p-0" href="/cart" aria-label="Open cart">
          <ShoppingCart size={27} strokeWidth={2.5} />
        </Link>
      </header>

      <section className="shell grid gap-8 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <h1 className="max-w-[650px] text-5xl font-black leading-[1.02] tracking-normal sm:text-7xl">
            Mystery scoops packed for pure surprise.
          </h1>
          <p className="mt-6 max-w-[560px] text-lg leading-8 text-muted">
            Choose your scoop size, then let the pack team pull a joyful mix of charms, crystals,
            stationery, miniatures, lucky capsules, and tiny collectible treasures.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="button-primary focus-ring" href="#choose-size">
              Choose size <Sparkles size={17} />
            </a>
            <Link className="button-secondary focus-ring" href="/cart">
              Add to cart
            </Link>
          </div>
          <div className="mt-8 grid max-w-[620px] gap-4 sm:grid-cols-3">
            {[
              ["Different every time", "No two scoops match"],
              ["Packed on video", "Watch the reveal"],
              ["Re-scoop option", "Try again if enabled"],
            ].map(([title, body]) => (
              <div className="flex items-center gap-3" key={title}>
                <span className="grid h-9 w-9 place-items-center rounded-[7px] bg-[#fff0b8] text-[#c98308]">
                  <Star size={17} fill="currentColor" />
                </span>
                <span>
                  <span className="block text-sm font-black">{title}</span>
                  <span className="block text-xs text-muted">{body}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[8px] bg-[#fff1f6]">
          <Image
            alt="Pastel scoop filled with tiny mystery collectibles"
            className="object-cover"
            fill
            priority
            src="/mystery-scoop-hero.png"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>

      <section id="choose-size" className="shell border-t border-[#efe4e8] pt-12 mt-12">
        <ScoopPreferencesBuilder />
      </section>
    </main>
  );
}
