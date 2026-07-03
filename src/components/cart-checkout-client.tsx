"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart } from "lucide-react";
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
      <section className="app-card p-6">
        <h2 className="text-2xl font-black">Build your bag</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {tiers.map((tier) => (
            <button
              className={`rounded-[7px] border p-4 text-left transition ${
                tier.id === tierId ? "border-[#f72c7b] bg-[#fff3f7]" : "border-[#efe4e8] bg-white"
              }`}
              key={tier.id}
              onClick={() => setTierId(tier.id)}
              type="button"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-black">{tier.name}</span>
                <span className="text-sm font-black">{formatMoney(tier.priceCents)}</span>
              </span>
              <span className="mt-2 block text-sm text-muted">{tier.description}</span>
            </button>
          ))}
        </div>

        <h3 className="mt-8 text-xl font-black">Add-ons</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {addOns.map((addOn) => (
            <button
              className={`rounded-[7px] border p-4 text-left transition ${
                addOnIds.includes(addOn.id) ? "border-[var(--teal)] bg-[rgba(0,184,173,0.1)]" : "border-[#efe4e8] bg-white"
              }`}
              key={addOn.id}
              onClick={() => toggleAddOn(addOn.id)}
              type="button"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-black">{addOn.name}</span>
                {addOnIds.includes(addOn.id) ? <Check size={18} className="text-[var(--teal)]" /> : null}
              </span>
              <span className="mt-2 block text-sm text-muted">{addOn.description}</span>
              <span className="mt-3 block text-sm font-black">+{formatMoney(addOn.priceCents)}</span>
            </button>
          ))}
        </div>
      </section>

      <aside className="app-card h-fit p-6">
        <h2 className="flex items-center gap-2 text-2xl font-black">
          <ShoppingCart size={22} /> {mode === "checkout" ? "Checkout" : "Cart"}
        </h2>
        <div className="mt-5 space-y-3">
          {summary.lines.map((line) => (
            <div className="flex justify-between gap-4 text-sm" key={line.label}>
              <span>{line.quantity} x {line.label}</span>
              <strong>{formatMoney(line.priceCents * line.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-[#efe4e8] pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><strong>{formatMoney(summary.subtotalCents)}</strong></div>
          <div className="flex justify-between"><span>Shipping</span><strong>{formatMoney(summary.shippingCents)}</strong></div>
          <div className="flex justify-between text-lg"><span>Total</span><strong>{formatMoney(summary.totalCents)}</strong></div>
        </div>
        {message ? <p className="mt-4 rounded-[7px] bg-[#fff0ee] p-3 text-sm font-bold text-[#d63f3f]">{message}</p> : null}
        {mode === "cart" ? (
          <Link className="button-primary mt-5 w-full" href="/checkout">
            Review checkout
          </Link>
        ) : (
          <button className="button-primary mt-5 w-full" disabled={loading} onClick={startCheckout} type="button">
            {loading ? "Starting checkout..." : "Continue to Stripe"}
          </button>
        )}
        <p className="mt-4 rounded-[7px] bg-[rgba(0,184,173,0.1)] p-3 text-sm font-bold text-[var(--teal-dark)]">
          You will earn {summary.pointsEarned} Scoop Points.
        </p>
      </aside>
    </div>
  );
}
