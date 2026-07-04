import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingCart, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import type React from "react";
import { StorefrontFooter, StorefrontHeader, StorefrontSectionTitle } from "@/components/storefront-shell";
import { getStorefrontCatalogProductBySlug } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const product = await getStorefrontCatalogProductBySlug(slug);
  const canOrderCatalogProduct = product?.id && product.id > 0 && product.effectivePrice !== null;

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-10">
      <StorefrontHeader currentPath="/products" />

      <section className="shell pt-8">
        <div className="overflow-hidden rounded-[34px] border border-[#ebe4db] bg-[linear-gradient(135deg,#fff8ef_0%,#f1fbfb_44%,#edf8ff_100%)] shadow-[0_32px_80px_rgba(121,146,140,0.13)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-10">
            <div className="flex flex-col justify-center">
              <Link className="text-sm font-black uppercase tracking-[0.16em] text-[#18a59e]" href="/products">
                Back to products
              </Link>
              <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-[#728781]">{product.eyebrow}</p>
              <h1
                className="mt-3 max-w-[11ch] text-5xl font-black leading-[0.92] tracking-[-0.05em] text-[#31514b] sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.name}
              </h1>
              <p className="mt-6 max-w-[560px] text-base leading-8 text-[#627771] sm:text-lg">{product.description}</p>
              <div className="mt-6 flex flex-col gap-1">
                <p className="text-base font-black uppercase tracking-[0.18em] text-[#18a59e]">{product.priceLabel}</p>
                {product.originalPriceLabel ? (
                  <p className="text-sm text-[#8b9b97] line-through">{product.originalPriceLabel}</p>
                ) : null}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {canOrderCatalogProduct ? (
                  <Link className="button-primary focus-ring" href={`${product.route}/buy`}>
                    Order this item <ShoppingCart size={17} />
                  </Link>
                ) : null}
                <Link className="button-secondary focus-ring" href="/mystery-scoops">
                  Build a mystery scoop <Sparkles size={17} />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[30px] border border-white/75 bg-white/65 shadow-[0_24px_58px_rgba(118,140,134,0.12)]">
              <Image
                alt={product.name}
                className="object-cover object-center"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                src={product.image}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="shell pt-10">
        <div className="rounded-[32px] border border-[#ece3d9] bg-white px-6 py-8 shadow-[0_24px_58px_rgba(118,140,134,0.12)]">
          <StorefrontSectionTitle>What is inside</StorefrontSectionTitle>
          <div className="grid gap-4 md:grid-cols-3">
            {(product.highlights.length > 0
              ? product.highlights
              : ["Freshly synced from the dashboard", "Ready for category merchandising", "Collection-ready listing"]
            ).map((highlight) => (
              <div className="rounded-[26px] border border-[#ece3d9] bg-[#fffcf8] p-5" key={highlight}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f0fbfa] text-[#0ea69f]">
                  <Check size={18} />
                </span>
                <p className="mt-4 text-lg font-black tracking-[-0.03em] text-[#35534d]">{highlight}</p>
              </div>
            ))}
          </div>
          {product.availableColours.length > 0 ? (
            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#728781]">Available colours</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.availableColours.map((colour) => (
                  <span className="storefront-mini-pill" key={colour}>
                    {colour}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {product.collections.length > 0 ? (
            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#728781]">Collections</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.collections.map((collection) => (
                  <Link
                    href={`/products?collection=${collection.slug}`}
                    className="storefront-mini-pill"
                    key={collection.slug}
                  >
                    {collection.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
