"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type CheckoutBagItem = {
  id: "medium" | "large";
  title: string;
  subtitle: string;
  unitPrice: number;
  quantity: number;
};

const initialItems: CheckoutBagItem[] = [
  {
    id: "medium",
    title: "Mystery Scoop",
    subtitle: "Medium Scoop",
    unitPrice: 1199,
    quantity: 1,
  },
  {
    id: "large",
    title: "Mystery Scoop",
    subtitle: "Large Scoop",
    unitPrice: 1699,
    quantity: 1,
  },
];

function formatRupees(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(value);
}

export function CheckoutBagClient(): React.ReactElement {
  const router = useRouter();
  const [items, setItems] = useState<CheckoutBagItem[]>(initialItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );
  const primaryItem = items[0] ?? initialItems[0];

  function updateQuantity(itemId: CheckoutBagItem["id"], delta: -1 | 1): void {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  }

  function removeItem(itemId: CheckoutBagItem["id"]): void {
    setItems((current) => current.filter((item) => item.id !== itemId));
  }

  async function startCheckout(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/checkout", {
      body: JSON.stringify({
        tierId: primaryItem.id,
        addOnIds: ["re-scoop", "lucky-capsule"],
      }),
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
      setMessage(result?.error ?? "Checkout could not start. Check login, Stripe, and database setup.");
      return;
    }

    window.location.href = result.checkoutUrl;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_410px]">
      <section className="rounded-[32px] border border-[#ece3d9] bg-white p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Checkout bag</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#32524b]" style={{ fontFamily: "var(--font-display)" }}>
              Your shopping bag
            </h2>
          </div>
          <span className="rounded-full bg-[#f2fbfa] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#18a59e]">
            {items.length} items
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article
              className="grid gap-4 rounded-[28px] border border-[#ece3d9] bg-[#fffdfa] p-5 shadow-[0_14px_34px_rgba(118,140,134,0.10)] sm:grid-cols-[92px_1fr_auto]"
              key={item.id}
            >
              <div className="grid h-[92px] w-[92px] place-items-center rounded-[22px] bg-[#ffe7f0] text-[#e16594]">
                <Sparkles size={30} fill="currentColor" />
              </div>
              <div className="self-center">
                <h3 className="text-2xl font-black tracking-[-0.04em] text-[#35534d]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#6d817b]">{item.subtitle}</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-[#18a59e]">{formatRupees(item.unitPrice)}</p>
              </div>
              <div className="flex flex-col items-start gap-3 self-center sm:items-end">
                <div className="grid h-12 w-32 grid-cols-3 items-center rounded-full border border-[#dbe9e6] bg-white text-sm font-black text-[#244c4e]">
                  <button aria-label={`Decrease ${item.subtitle}`} onClick={() => updateQuantity(item.id, -1)} type="button">−</button>
                  <span className="grid place-items-center">{item.quantity}</span>
                  <button aria-label={`Increase ${item.subtitle}`} onClick={() => updateQuantity(item.id, 1)} type="button">+</button>
                </div>
                <button
                  className="text-xs font-black uppercase tracking-[0.12em] text-[#e16594]"
                  onClick={() => removeItem(item.id)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
          {items.length === 0 ? (
            <p className="rounded-[24px] border border-[#ece3d9] bg-[#fffdfa] px-5 py-8 text-[#6d817b]">Your bag is empty.</p>
          ) : null}
        </div>
      </section>

      <aside className="rounded-[32px] border border-[#ece3d9] bg-[linear-gradient(135deg,#fff9ef_0%,#f1fbfb_100%)] p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
        <h2 className="text-4xl font-black tracking-[-0.05em] text-[#32524b]" style={{ fontFamily: "var(--font-display)" }}>
          Order summary
        </h2>
        <div className="mt-6 space-y-3 text-sm text-[#60756f]">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <strong>{formatRupees(subtotal)}</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>
          <div className="mt-4 flex justify-between gap-4 border-t border-[#d8e8e4] pt-4 text-base font-black text-[#32524b]">
            <span>Total before offers</span>
            <strong>{formatRupees(subtotal)}</strong>
          </div>
        </div>

        <form className="mt-7 grid gap-3" onSubmit={startCheckout}>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Delivery details</h3>
          <input className="storefront-input" name="name" placeholder="Full name" required />
          <input className="storefront-input" name="phone" placeholder="Phone" required />
          <input className="storefront-input" name="email" placeholder="Email" required type="email" />
          <textarea
            className="storefront-input min-h-24 resize-none py-3"
            name="address"
            placeholder="Complete shipping address"
            required
          />
          {message ? <p className="rounded-[20px] bg-[#fff0ee] p-3 text-sm font-bold text-[#d63f3f]">{message}</p> : null}
          <button className="button-primary mt-2 w-full" disabled={loading || items.length === 0} type="submit">
            {loading ? "Starting checkout..." : "Continue to payment"}
          </button>
        </form>
      </aside>
    </div>
  );
}
