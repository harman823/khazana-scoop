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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <h2 className="text-5xl font-black leading-tight text-[#073f43]">Your shopping bag</h2>
        <div className="mt-3 border-t border-[#d8e3df]" />

        <div>
          {items.map((item) => (
            <article className="grid gap-4 border-b border-[#d8e3df] py-5 sm:grid-cols-[92px_1fr_auto_auto]" key={item.id}>
              <div className="grid h-[92px] w-[92px] place-items-center rounded-[7px] bg-[#ffe2ec] text-[#d93575]">
                <Sparkles size={30} fill="currentColor" />
              </div>
              <div className="self-center">
                <h3 className="text-xl font-black text-[#073f43]">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
                <p className="mt-2 text-base font-black text-[#073f43]">{formatRupees(item.unitPrice)}</p>
              </div>
              <div className="grid h-12 w-32 grid-cols-3 self-center rounded-[7px] border border-[#d8e3df] bg-white text-sm font-black text-[#244c4e]">
                <button aria-label={`Decrease ${item.subtitle}`} onClick={() => updateQuantity(item.id, -1)} type="button">−</button>
                <span className="grid place-items-center">{item.quantity}</span>
                <button aria-label={`Increase ${item.subtitle}`} onClick={() => updateQuantity(item.id, 1)} type="button">+</button>
              </div>
              <button
                className="self-center text-xs font-black text-[#c9155c] underline underline-offset-4"
                onClick={() => removeItem(item.id)}
                type="button"
              >
                Remove
              </button>
            </article>
          ))}
          {items.length === 0 ? (
            <p className="border-b border-[#d8e3df] py-8 text-muted">Your bag is empty.</p>
          ) : null}
        </div>
      </section>

      <aside className="rounded-[8px] border border-[#d8e3df] bg-[#fbfdfc] p-6">
        <h2 className="text-5xl font-black leading-tight text-[#073f43]">Order summary</h2>
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <strong>{formatRupees(subtotal)}</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>
          <div className="mt-4 flex justify-between gap-4 border-t border-[#d8e3df] pt-4 text-base">
            <span>Total before offers</span>
            <strong>{formatRupees(subtotal)}</strong>
          </div>
        </div>

        <form className="mt-7 grid gap-3" onSubmit={startCheckout}>
          <h3 className="text-base font-black text-[#073f43]">Delivery details</h3>
          <input className="h-11 rounded-[7px] border border-[#d8e3df] px-3 text-sm" name="name" placeholder="Full name" required />
          <input className="h-11 rounded-[7px] border border-[#d8e3df] px-3 text-sm" name="phone" placeholder="Phone" required />
          <input className="h-11 rounded-[7px] border border-[#d8e3df] px-3 text-sm" name="email" placeholder="Email" required type="email" />
          <textarea
            className="min-h-20 rounded-[7px] border border-[#d8e3df] p-3 text-sm"
            name="address"
            placeholder="Complete shipping address"
            required
          />
          {message ? <p className="rounded-[7px] bg-[#fff0ee] p-3 text-sm font-bold text-[#d63f3f]">{message}</p> : null}
          <button className="button-primary mt-2 w-full" disabled={loading || items.length === 0} type="submit">
            {loading ? "Starting checkout..." : "Continue to payment"}
          </button>
        </form>
      </aside>
    </div>
  );
}
