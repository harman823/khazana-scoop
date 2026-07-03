"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";

type ScoopPreferenceSize = {
  id: "small" | "medium" | "large";
  label: string;
  basicLimit: number;
  premiumLimit: number;
  priceLabel: string;
};

const scoopSizes: ScoopPreferenceSize[] = [
  { id: "small", label: "Small Scoop", basicLimit: 7, premiumLimit: 2, priceLabel: "₹699" },
  { id: "medium", label: "Medium Scoop", basicLimit: 12, premiumLimit: 3, priceLabel: "₹1,199" },
  { id: "large", label: "Large Scoop", basicLimit: 15, premiumLimit: 5, priceLabel: "₹1,699" },
];

const basicItems = [
  "Stickers (Sheet)",
  "Mini Notebook",
  "Cute Pen",
  "Keychain",
  "Washi Tape",
  "Sticky Notes",
  "Eraser",
  "Bookmark",
];

const premiumItems = [
  "Premium Journal",
  "Premium Bracelet",
  "Korean Hair Claw",
  "Charm Keychain Set",
  "Beauty Combo",
  "Desk Organizer",
  "Mini Perfume",
  "Satin Scrunchie Set",
  "Gift Pouch",
  "Premium Stationery Set",
];

export function ScoopPreferencesBuilder(): React.ReactElement {
  const [selectedSizeId, setSelectedSizeId] = useState<ScoopPreferenceSize["id"]>("medium");
  const [basicCounts, setBasicCounts] = useState<Record<string, number>>(
    Object.fromEntries(basicItems.map((item) => [item, 0])),
  );
  const [premiumSelections, setPremiumSelections] = useState<string[]>([]);
  const [instagramVideo, setInstagramVideo] = useState<boolean>(false);
  const selectedSize = scoopSizes.find((size) => size.id === selectedSizeId) ?? scoopSizes[1];
  const basicTotal = useMemo(
    () => Object.values(basicCounts).reduce((total, count) => total + count, 0),
    [basicCounts],
  );

  function adjustBasicItem(item: string, direction: -1 | 1): void {
    setBasicCounts((current) => {
      const currentValue = current[item] ?? 0;
      const nextValue = Math.min(3, Math.max(0, currentValue + direction));

      if (direction > 0 && basicTotal >= selectedSize.basicLimit && nextValue > currentValue) {
        return current;
      }

      return { ...current, [item]: nextValue };
    });
  }

  function togglePremiumItem(item: string): void {
    setPremiumSelections((current) => {
      if (current.includes(item)) {
        return current.filter((selection) => selection !== item);
      }
      if (current.length >= selectedSize.premiumLimit) {
        return current;
      }
      return [...current, item];
    });
  }

  function changeSize(size: ScoopPreferenceSize): void {
    setSelectedSizeId(size.id);
    setPremiumSelections((current) => current.slice(0, size.premiumLimit));
    setBasicCounts((current) => {
      let remaining = size.basicLimit;
      return Object.fromEntries(
        basicItems.map((item) => {
          const count = Math.min(current[item] ?? 0, remaining);
          remaining -= count;
          return [item, count];
        }),
      );
    });
  }

  return (
    <section className="mt-10">
      <h2 className="text-4xl font-black tracking-normal">1. Build your scoop preferences</h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {scoopSizes.map((size) => {
          const selected = size.id === selectedSizeId;
          return (
            <button
              aria-pressed={selected}
              className={`rounded-[7px] border bg-white p-4 text-left transition ${
                selected ? "border-[#f72c7b] shadow-[0_16px_38px_rgba(247,44,123,0.12)]" : "border-[#d8e3df]"
              }`}
              key={size.id}
              onClick={() => changeSize(size)}
              type="button"
            >
              <span className="block text-base font-black">{size.label}</span>
              <span className="mt-1 block text-sm leading-5 text-muted">
                {size.basicLimit} basic items + {size.premiumLimit} premium items
              </span>
              <span className="mt-2 block text-lg font-black text-[#2d4a45]">{size.priceLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="app-card mt-5 overflow-hidden bg-[#f8fffd] p-5">
        <div className="rounded-[7px] border border-[#d8e3df] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-black text-[#003b37]">{selectedSize.label}</h3>
            <div className="flex flex-wrap gap-3 text-sm font-black text-[#006a63]">
              <span className="rounded-full bg-[rgba(0,184,173,0.13)] px-4 py-2">
                {basicTotal}/{selectedSize.basicLimit} basic items
              </span>
              <span className="rounded-full bg-[rgba(0,184,173,0.13)] px-4 py-2">
                {premiumSelections.length}/{selectedSize.premiumLimit} premium items
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h3 className="text-base font-black text-[#003b37]">Basic items</h3>
            <p className="text-sm text-muted">Choose up to {selectedSize.basicLimit} (Max 3 per item)</p>
            <div className="mt-4 max-h-[280px] overflow-y-auto pr-3">
              {basicItems.map((item) => (
                <div className="grid grid-cols-[1fr_110px] items-center gap-4 py-2" key={item}>
                  <span className="text-sm font-black text-[#003b37]">{item}</span>
                  <div className="grid h-12 grid-cols-3 items-center rounded-[7px] border border-[#d8e3df] bg-white text-sm font-black">
                    <button aria-label={`Decrease ${item}`} className="h-full" onClick={() => adjustBasicItem(item, -1)} type="button">
                      -
                    </button>
                    <span className="text-center">{basicCounts[item] ?? 0}</span>
                    <button aria-label={`Increase ${item}`} className="h-full" onClick={() => adjustBasicItem(item, 1)} type="button">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-black text-[#003b37]">Premium items</h3>
            <p className="text-sm text-muted">Choose up to {selectedSize.premiumLimit}</p>
            <div className="mt-4 grid gap-3">
              {premiumItems.map((item) => {
                const selected = premiumSelections.includes(item);
                return (
                  <button
                    className="flex items-center gap-3 text-left text-sm font-black text-[#385552]"
                    key={item}
                    onClick={() => togglePremiumItem(item)}
                    type="button"
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        selected ? "border-[#00b8ad] bg-[#00b8ad] text-white" : "border-[#9cafaa]"
                      }`}
                    >
                      {selected ? <Check size={13} /> : null}
                    </span>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <label className="mt-5 flex min-h-12 items-center gap-3 rounded-[7px] border border-[#d8e3df] bg-white px-4 text-sm font-black">
        <input
          checked={instagramVideo}
          className="h-5 w-5 accent-[#00b8ad]"
          onChange={(event) => setInstagramVideo(event.target.checked)}
          type="checkbox"
        />
        Add Instagram Video to show your scoop (+₹50)
      </label>
    </section>
  );
}
