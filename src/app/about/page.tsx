import Image from "next/image";
import { PageChrome } from "@/components/page-chrome";

export default function AboutPage(): React.ReactElement {
  return (
    <PageChrome
      currentPath="/about"
      heroAside={
        <div className="grid w-full max-w-[380px] gap-4">
          <div className="relative min-h-[230px] overflow-hidden rounded-[30px] border border-white/75 bg-white/70 shadow-[0_20px_44px_rgba(124,146,140,0.14)]">
            <Image
              alt="Mystery Scoop collectible tray"
              className="object-cover"
              fill
              loading="eager"
              priority
              sizes="380px"
              src="/mystery-scoop-hero.png"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Hand-packed", body: "Each scoop is balanced before it ships." },
              { title: "Approval-led", body: "Orders stay transparent from reveal to delivery." },
            ].map((item) => (
              <div className="rounded-[26px] border border-white/75 bg-white/84 p-5 shadow-[0_20px_44px_rgba(124,146,140,0.14)] backdrop-blur" key={item.title}>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6d807a]">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-[#5d746d]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      }
      title="About Mystery Scoop"
      subtitle="We pack collectible surprise scoops with clear tracking, rewards, and a customer-first approval flow."
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-[#ece3d9] bg-white p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">What makes the experience work</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#32524b]" style={{ fontFamily: "var(--font-display)" }}>
            Small surprises with a clearer system behind them.
          </h2>
          <div className="mt-6 grid gap-4">
            {[
              ["Hand-packed", "Every scoop is assembled with a balanced mix of charms, crystals, stationery, and miniatures."],
              ["Watch the reveal", "Packing media can be attached to each order so customers can see the moment their scoop comes together."],
              ["Built for trust", "Inventory, orders, payments, and rewards are managed with production database flows."],
            ].map(([title, body]) => (
              <section className="rounded-[28px] border border-[#ece3d9] bg-[#fffdfa] p-5" key={title}>
                <h2 className="text-2xl font-black tracking-[-0.04em] text-[#35534d]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#667b75]">{body}</p>
              </section>
            ))}
          </div>
        </section>

        <aside className="rounded-[32px] border border-[#ece3d9] bg-[linear-gradient(135deg,#fff9ef_0%,#f1fbfb_100%)] p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Mystery Scoop promise</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#32524b]" style={{ fontFamily: "var(--font-display)" }}>
            Soft surprises, clearer order flow.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#627771]">
            The store pairs playful collectible energy with the practical layers shoppers need: trackable orders, customer rewards, and support-friendly status updates.
          </p>
          <div className="mt-6 grid gap-3">
            {[
              "Track orders without hunting through messages.",
              "Keep re-scoop windows and packing media visible.",
              "Make rewards and repeat shopping feel worth it.",
            ].map((item) => (
              <div className="rounded-[22px] bg-white/84 p-4 text-sm font-bold text-[#35534d] shadow-[0_14px_34px_rgba(118,140,134,0.10)]" key={item}>
                {item}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </PageChrome>
  );
}
