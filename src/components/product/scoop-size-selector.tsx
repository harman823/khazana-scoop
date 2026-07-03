"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { formatMoney } from "@/lib/pricing";
import type { ScoopTier } from "@/lib/types";

type ScoopSizeSelectorProps = {
  tiers: ScoopTier[];
};

const tierColors: Record<string, string> = {
  "Small Scoop": "#ff80aa",
  "Medium Scoop": "#00b8ad",
  "Large Scoop": "#f72c7b",
};

export function ScoopSizeSelector({ tiers }: ScoopSizeSelectorProps): React.ReactElement {
  const [selectedTierId, setSelectedTierId] = useState<string>("medium");
  const selectedTier = tiers.find((tier) => tier.id === selectedTierId) ?? tiers[1];

  return (
    <section className="mt-10">
      <h2 className="text-4xl font-black tracking-normal">1. Choose your scoop size</h2>
      <div className="mt-8 grid gap-5 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.25fr]">
        {tiers.map((tier) => {
          const selected = tier.id === selectedTierId;

          return (
            <button
              key={tier.id}
              className={`app-card relative flex min-h-[500px] flex-col items-start p-7 text-left transition ${
                selected ? "border-[#f72c7b] shadow-[0_18px_50px_rgba(247,44,123,0.12)]" : ""
              }`}
              type="button"
              onClick={() => setSelectedTierId(tier.id)}
              aria-pressed={selected}
            >
              <div
                className="mx-auto mt-16 grid h-32 w-32 place-items-center rounded-full text-5xl"
                style={{ backgroundColor: `${tierColors[tier.name]}22` }}
              >
                {tier.name === "Large Scoop" ? "🪣" : "🥄"}
              </div>
              <div className="mt-10 w-full pr-8">
                <div className="min-w-0">
                  <h3 className="text-2xl font-black leading-tight">{tier.name}</h3>
                  <p className="mt-4 max-w-[150px] text-base leading-7 text-muted">{tier.description}</p>
                </div>
                <span
                  className={`absolute right-7 top-[250px] grid h-7 w-7 place-items-center rounded-full border ${
                    selected ? "border-[#f72c7b] bg-[#f72c7b] text-white" : "border-[#d9cfd5]"
                  }`}
                >
                  {selected ? <Check size={17} /> : null}
                </span>
              </div>
              <p className="mt-8 text-xl font-black">{formatMoney(tier.priceCents)}</p>
            </button>
          );
        })}

        <aside className="app-card flex min-h-[500px] flex-col justify-between p-7">
          <div>
            <p className="text-xl font-black leading-8">
              Each scoop includes a mix of charms, crystals, stationery, miniatures & more.
            </p>
            <ul className="mt-9 space-y-6">
              {["Different every time", "Hand-packed with care", "Packed to thrill"].map((item) => (
                <li key={item} className="flex items-center gap-4 text-base font-black">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f72c7b] text-white">
                    <Check size={17} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-base font-black">Selected:</p>
            <p className="text-lg font-black">{selectedTier.name}</p>
            <p className="mt-2 text-base leading-7 text-muted">{selectedTier.volumeMl} ml scoop volume</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
