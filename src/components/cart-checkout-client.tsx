"use client";

import Link from "next/link";
import { Check, ShoppingBag, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { calculateCart, formatMoney } from "@/lib/pricing";
import type { AddOn, CartSelection, ScoopTier } from "@/lib/types";

type CartCheckoutClientProps = {
  addOns: AddOn[];
  mode: "cart" | "checkout";
  tiers: ScoopTier[];
};

export function CartCheckoutClient({ addOns, mode, tiers }: CartCheckoutClientProps): React.ReactElement {
  const router = useRouter();
  const [tierId, setTierId] = useState<string>("medium");
  const [addOnIds, setAddOnIds] = useState<string[]>(["re-scoop", "lucky-capsule"]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const selection: CartSelection = useMemo(() => ({ addOnIds, tierId }), [addOnIds, tierId]);
  const summary = calculateCart(selection);

  function toggleAddOn(addOnId: string): void {
    setAddOnIds((current) =>
      current.includes(addOnId) ? current.filter((id) => id !== addOnId) : [...current, addOnId],
    );
  }

  async function startCheckout(): Promise<void> {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/checkout", {
      body: JSON.stringify(selection),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const result = (await response.json().catch(() => null)) as { checkoutUrl?: string; error?: string } | null;
    setLoading(false);

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (!response.ok || !result?.checkoutUrl) {
      setMessage(result?.error ?? "Checkout could not start. Please check your account and payment setup.");
      return;
    }

    window.location.href = result.checkoutUrl;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-[32px] border border-[#ece3d9] bg-white p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Choose your scoop</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#32524b]" style={{ fontFamily: "var(--font-display)" }}>
              Build your bag
            </h2>
          </div>
          <Link className="text-sm font-black uppercase tracking-[0.12em] text-[#18a59e]" href="/products">
            Browse products
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {tiers.map((tier) => (
            <button
              className={`rounded-[28px] border p-5 text-left transition ${
                tier.id === tierId
                  ? "border-[#86d8d3] bg-[#f2fbfa] shadow-[0_16px_36px_rgba(24,165,158,0.12)]"
                  : "border-[#ece3d9] bg-[#fffdfa]"
              }`}
              key={tier.id}
              onClick={() => setTierId(tier.id)}
              type="button"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-xl font-black tracking-[-0.03em] text-[#35534d]">{tier.name}</span>
                <span className="text-sm font-black uppercase tracking-[0.08em] text-[#18a59e]">{formatMoney(tier.priceCents)}</span>
              </span>
              <span className="mt-3 block text-sm leading-7 text-[#667b75]">{tier.description}</span>
              {tier.bestValue ? (
                <span className="mt-4 inline-flex rounded-full bg-[#fff3d9] px-3 py-2 text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#be8a14]">
                  Best value
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Add-ons</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {addOns.map((addOn) => {
              const selected = addOnIds.includes(addOn.id);
              return (
                <button
                  className={`rounded-[28px] border p-5 text-left transition ${
                    selected
                      ? "border-[#86d8d3] bg-[#f2fbfa] shadow-[0_16px_36px_rgba(24,165,158,0.12)]"
                      : "border-[#ece3d9] bg-white"
                  }`}
                  key={addOn.id}
                  onClick={() => toggleAddOn(addOn.id)}
                  type="button"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-lg font-black tracking-[-0.03em] text-[#35534d]">{addOn.name}</span>
                    {selected ? <Check size={18} className="text-[#18a59e]" /> : null}
                  </span>
                  <span className="mt-3 block text-sm leading-7 text-[#667b75]">{addOn.description}</span>
                  <span className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.08em] text-[#ef8fb3]">
                    +{formatMoney(addOn.priceCents)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="rounded-[32px] border border-[#ece3d9] bg-[linear-gradient(135deg,#fff9ef_0%,#f1fbfb_100%)] p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
        <h2 className="inline-flex items-center gap-2 text-3xl font-black tracking-[-0.04em] text-[#34524c]">
          <ShoppingBag size={24} />
          {mode === "checkout" ? "Checkout" : "Cart"}
        </h2>
        <div className="mt-6 space-y-4">
          {summary.lines.map((line) => (
            <div className="rounded-[22px] border border-white/75 bg-white/82 p-4 shadow-[0_14px_34px_rgba(118,140,134,0.10)]" key={line.label}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-black text-[#35534d]">{line.label}</p>
                  <p className="mt-1 text-sm text-[#6d817b]">{line.quantity} selection{line.quantity > 1 ? "s" : ""}</p>
                </div>
                <strong className="text-sm uppercase tracking-[0.08em] text-[#18a59e]">
                  {formatMoney(line.priceCents * line.quantity)}
                </strong>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 border-t border-[#e6ebe7] pt-4 text-sm text-[#5f756f]">
          <div className="flex justify-between"><span>Subtotal</span><strong>{formatMoney(summary.subtotalCents)}</strong></div>
          <div className="flex justify-between"><span>Shipping</span><strong>{formatMoney(summary.shippingCents)}</strong></div>
          <div className="flex justify-between text-lg font-black text-[#34524c]"><span>Total</span><strong>{formatMoney(summary.totalCents)}</strong></div>
        </div>
        {message ? <p className="mt-4 rounded-[20px] bg-[#fff0ee] p-3 text-sm font-bold text-[#d63f3f]">{message}</p> : null}
        {mode === "cart" ? (
          <Link className="button-primary mt-6 w-full" href="/checkout">
            Review checkout
          </Link>
        ) : (
          <button className="button-primary mt-6 w-full" disabled={loading} onClick={startCheckout} type="button">
            {loading ? "Starting checkout..." : "Continue to Stripe"}
          </button>
        )}
        <p className="mt-4 rounded-[22px] bg-white/82 p-4 text-sm font-bold text-[#2d7d76] shadow-[0_14px_34px_rgba(118,140,134,0.10)]">
          <Sparkles className="mr-2 inline-block" size={16} />
          You will earn {summary.pointsEarned} Scoop Points on this order.
        </p>
      </aside>
    </div>
  );
}
