"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { StorefrontCatalogProduct } from "@/lib/catalog-types";

type CatalogProductOrderClientProps = {
  product: StorefrontCatalogProduct;
};

type OrderResult = {
  error?: string;
  orderId?: number;
};

export function CatalogProductOrderClient({
  product,
}: CatalogProductOrderClientProps): React.ReactElement {
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [orderId, setOrderId] = useState<number | null>(null);

  const maxQuantity = 10;

  async function submitOrder(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setOrderId(null);

    const response = await fetch("/api/catalog-orders", {
      body: JSON.stringify({
        customerAddress,
        customerName,
        customerPhone,
        productId: product.id,
        quantity,
        slug: product.slug,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result = (await response.json().catch(() => null)) as OrderResult | null;
    setLoading(false);

    if (!response.ok || !result?.orderId) {
      setMessage(result?.error ?? "The order could not be created right now.");
      return;
    }

    setOrderId(result.orderId);
    setMessage(`Order #${result.orderId} has been created and the stock was reserved.`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="rounded-[32px] border border-[#ece3d9] bg-white p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
        <div className="relative h-72 overflow-hidden rounded-[26px] bg-[#FBEFEF]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 34vw, 100vw"
          />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#18a59e]">
          {product.eyebrow}
        </p>
        <h2
          className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#31514b]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {product.name}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#657871]">{product.summary}</p>
        <div className="mt-5 rounded-[24px] border border-[#ece3d9] bg-[#fffdfa] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-[#627771]">Unit price</span>
            <strong className="text-base font-black text-[#1e293b]">{product.priceLabel}</strong>
          </div>
          {product.originalPriceLabel ? (
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#627771]">Original price</span>
              <span className="text-sm text-[#8b9b97] line-through">{product.originalPriceLabel}</span>
            </div>
          ) : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {product.collections.map((collection) => (
            <Link className="storefront-mini-pill" href={`/products?collection=${collection.slug}`} key={collection.slug}>
              {collection.name}
            </Link>
          ))}
        </div>
      </aside>

      <section className="rounded-[32px] border border-[#ece3d9] bg-[linear-gradient(135deg,#fff9ef_0%,#f1fbfb_100%)] p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">
              Standard catalog checkout
            </p>
            <h1
              className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#32524b]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Reserve this product
            </h1>
          </div>
          <Link className="text-sm font-black uppercase tracking-[0.12em] text-[#18a59e]" href={product.route}>
            Back to product
          </Link>
        </div>

        <form className="mt-8 grid gap-4" onSubmit={submitOrder}>
          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <label className="grid gap-2">
              <span className="text-sm font-black uppercase tracking-[0.12em] text-[#627771]">
                Quantity
              </span>
              <input
                min={1}
                max={maxQuantity}
                type="number"
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    Math.max(1, Math.min(maxQuantity, Number(event.target.value) || 1)),
                  )
                }
                className="storefront-input"
              />
            </label>
            <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-[0_14px_34px_rgba(118,140,134,0.08)]">
              <p className="text-sm font-semibold text-[#627771]">Order summary</p>
              <p className="mt-2 text-lg font-black text-[#31514b]">
                {quantity} x {product.name}
              </p>
              <p className="mt-2 text-sm text-[#627771]">
                A shared dashboard order, item record, and stock movement will be created as soon as you submit.
              </p>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-black uppercase tracking-[0.12em] text-[#627771]">
              Full name
            </span>
            <input
              className="storefront-input"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Customer name"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black uppercase tracking-[0.12em] text-[#627771]">
              Phone number
            </span>
            <input
              className="storefront-input"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="Phone number"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black uppercase tracking-[0.12em] text-[#627771]">
              Shipping address
            </span>
            <textarea
              className="storefront-input min-h-28 resize-none py-3"
              value={customerAddress}
              onChange={(event) => setCustomerAddress(event.target.value)}
              placeholder="Full shipping address"
              required
            />
          </label>

          {message ? (
            <p
              className={`rounded-[20px] p-4 text-sm font-bold ${
                orderId
                  ? "bg-[#eefbf8] text-[#158a84]"
                  : "bg-[#fff0ee] text-[#d63f3f]"
              }`}
            >
              {message}
            </p>
          ) : null}

          <button className="button-primary mt-2 w-full" disabled={loading} type="submit">
            {loading ? "Creating order..." : "Create shared order"}
          </button>
        </form>
      </section>
    </div>
  );
}
