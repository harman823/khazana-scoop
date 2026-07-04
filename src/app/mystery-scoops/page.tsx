import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { ScoopPreferencesBuilder } from "@/components/product/scoop-preferences-builder";
import { StorefrontFooter, StorefrontPageHero, StorefrontSectionTitle } from "@/components/storefront-shell";

export default function MysteryScoopsPage(): React.ReactElement {
  return (
    <main className="min-h-screen pb-10">
      <StorefrontPageHero
        currentPath="/mystery-scoops"
        subtitle="Choose your scoop size, then let the pack team pull a joyful mix of charms, crystals, stationery, miniatures, lucky capsules, and tiny collectible treasures."
        title="Mystery scoops packed for pure surprise."
      >
        <div className="relative h-[260px] w-full max-w-[360px] overflow-hidden rounded-[30px] border border-white/75 bg-white/65 shadow-[0_22px_52px_rgba(118,140,134,0.12)]">
          <Image
            alt="Pastel scoop filled with tiny mystery collectibles"
            className="object-cover"
            fill
            priority
            sizes="360px"
            src="/mystery-scoop-hero.png"
          />
        </div>
      </StorefrontPageHero>

      <section className="shell pt-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Different every time", "No two scoops match."],
            ["Packed on video", "Watch the reveal when available."],
            ["Re-scoop option", "Try again if the add-on is enabled."],
          ].map(([title, body]) => (
            <div className="rounded-[28px] border border-[#FFE2E2] bg-white p-5 shadow-[0_18px_48px_rgba(118,140,134,0.12)]" key={title}>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFE2E2] text-[#C5B3D3]">
                <Star size={17} fill="currentColor" />
              </span>
              <h2 className="mt-4 text-2xl font-baloo text-[#1e293b]">{title}</h2>
              <p className="mt-2 text-sm leading-7 font-poppins text-[#1e293b]/70">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell pt-12">
        <div className="rounded-[32px] border border-[#FFE2E2] bg-white px-6 py-8 shadow-[0_24px_58px_rgba(118,140,134,0.12)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <StorefrontSectionTitle>Build your scoop preferences</StorefrontSectionTitle>
              <p className="-mt-2 max-w-3xl text-base leading-8 font-poppins text-[#1e293b]/70">
                Move through size, mix, and add-on choices in one place, then keep heading toward cart and checkout when your surprise blend feels right.
              </p>
            </div>
            <Link className="px-6 py-3 bg-[#C5B3D3] hover:bg-[#1e293b] text-white font-baloo font-bold rounded-full transition-colors inline-flex items-center gap-2" href="/cart">
              Add to cart <Sparkles size={17} />
            </Link>
          </div>

          <div className="mt-8 border-t border-[#FFE2E2] pt-8">
            <ScoopPreferencesBuilder />
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
