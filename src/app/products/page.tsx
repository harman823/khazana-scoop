import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageChrome } from "@/components/page-chrome";
import {
  filterStorefrontCatalogProducts,
  getStorefrontCatalogHomeData,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string;
    collection?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps): Promise<React.ReactElement> {
  const filters = (await searchParams) ?? {};
  const homeData = await getStorefrontCatalogHomeData();
  const products = filterStorefrontCatalogProducts(homeData.products, {
    categorySlug: filters.category,
    collectionSlug: filters.collection,
  });
  const heroProduct = products[0];
  const secondaryProducts = products.slice(1, 3);
  const catalogProducts = products.slice(3);
  const activeFilterLabel = filters.collection
    ? homeData.collections.find((collection) => collection.slug === filters.collection)?.name
    : filters.category
      ? homeData.categories.find((category) => category.slug === filters.category)?.name
      : null;

  return (
    <PageChrome
      currentPath="/products"
      title="Products"
      subtitle={
        activeFilterLabel
          ? `Browsing the live ${activeFilterLabel} selection synced from the dashboard.`
          : "Browse mystery scoops, lucky capsules, charm mixes, crystals, and stationery packs."
      }
    >
      <div className="grid gap-6">
        <section className="rounded-[28px] border border-[#ece3d9] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(118,140,134,0.1)] sm:px-6">
          <div className="flex flex-wrap gap-3">
            <Link
              className={`storefront-mini-pill ${!filters.category && !filters.collection ? "bg-[#C5B3D3] text-white" : ""}`}
              href="/products"
            >
              All products
            </Link>
            {homeData.categories.slice(0, 6).map((category) => (
              <Link
                className={`storefront-mini-pill ${filters.category === category.slug ? "bg-[#C5B3D3] text-white" : ""}`}
                href={category.href}
                key={category.slug}
              >
                {category.name}
              </Link>
            ))}
            {homeData.collections.slice(0, 4).map((collection) => (
              <Link
                className={`storefront-mini-pill ${filters.collection === collection.slug ? "bg-[#18a59e] text-white" : ""}`}
                href={collection.href}
                key={collection.slug}
              >
                {collection.name}
              </Link>
            ))}
          </div>
        </section>

        {heroProduct ? (
          <section className="storefront-subtle-panel overflow-hidden px-6 py-7 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#6c817b]">{heroProduct.eyebrow}</p>
                <h2
                  className="mt-3 max-w-[10ch] text-5xl font-black leading-[0.94] tracking-[-0.05em] text-[#31514b] sm:text-6xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {heroProduct.name}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#627872]">{heroProduct.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {heroProduct.highlights.map((highlight) => (
                    <span className="storefront-mini-pill" key={highlight}>
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link className="button-primary focus-ring" href={heroProduct.route}>
                    Shop this drop <Sparkles size={17} />
                  </Link>
                  <Link className="button-secondary focus-ring" href="/mystery-scoops">
                    Build your scoop <ArrowRight size={17} />
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden rounded-[30px] border border-white/70 bg-white/70 shadow-[0_24px_58px_rgba(118,140,134,0.12)]">
                <Image
                  alt={heroProduct.name}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  src={heroProduct.image}
                />
              </div>
            </div>
          </section>
        ) : null}

        {secondaryProducts.length > 0 ? (
          <section className="grid gap-6 lg:grid-cols-2">
          {secondaryProducts.map((product, index) => (
            <Link
              className={`app-card grid gap-5 overflow-hidden p-5 transition hover:-translate-y-1 sm:p-6 ${
                index % 2 === 0 ? "lg:grid-cols-[0.95fr_1.05fr]" : "lg:grid-cols-[1.05fr_0.95fr]"
              }`}
              href={product.route}
              key={product.slug}
            >
              <div className={`space-y-4 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <span className="storefront-status-badge bg-[#f5faf9] text-[#62807a] border-[#dbe9e4]">{product.eyebrow}</span>
                <div>
                  <h2 className="text-4xl font-black tracking-[-0.05em] text-[#33534d]" style={{ fontFamily: "var(--font-display)" }}>
                    {product.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#667b75]">{product.summary}</p>
                </div>
                <div className="grid gap-2">
                  {product.highlights.map((highlight) => (
                    <p className="text-sm font-bold text-[#36534d]" key={highlight}>
                      {highlight}
                    </p>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex flex-col gap-1">
                    <strong className="text-sm uppercase tracking-[0.1em] text-[#18a59e]">{product.priceLabel}</strong>
                    {product.originalPriceLabel ? (
                      <span className="text-xs text-[#8b9b97] line-through">{product.originalPriceLabel}</span>
                    ) : null}
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-[#35534d]">
                    Open <ArrowRight size={16} />
                  </span>
                </div>
              </div>

              <div className={`relative min-h-[260px] overflow-hidden rounded-[26px] bg-[#fff4ee] ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <Image
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 24vw, 100vw"
                  src={product.image}
                />
              </div>
            </Link>
          ))}
          </section>
        ) : null}

        <section className="rounded-[32px] border border-[#ece3d9] bg-white px-6 py-8 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:px-8">
          <div className="flex flex-col gap-3 border-b border-[#efe7de] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#6c817b]">Browse the full shelf</p>
              <h2
                className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#31514b] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Small surprises by mood
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#667b75]">
              Every pack in the lineup stays rooted in the same collectible spirit, just with a different focus on bonus reveals, charm themes, crystals, or desk treats.
            </p>
          </div>

          {catalogProducts.length > 0 ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {catalogProducts.map((product) => (
              <Link className="rounded-[28px] border border-[#ebe2d8] bg-[#fffdfa] p-5 transition hover:-translate-y-1 hover:border-[#bde5df]" href={product.route} key={product.slug}>
                <div className="relative h-56 overflow-hidden rounded-[24px] bg-[#fdf3eb]">
                  <Image
                    alt={product.name}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 27vw, 100vw"
                    src={product.image}
                  />
                </div>
                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#18a59e]">{product.eyebrow}</p>
                  <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#35534d]">{product.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#667b75]">{product.summary}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm uppercase tracking-[0.1em] text-[#35534d]">{product.priceLabel}</strong>
                      {product.originalPriceLabel ? (
                        <span className="text-xs text-[#8b9b97] line-through">{product.originalPriceLabel}</span>
                      ) : null}
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-[#35534d]">
                      Explore <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[28px] border border-dashed border-[#d7e8e3] bg-[#f9fffe] px-5 py-10 text-center text-sm leading-7 text-[#667b75]">
              No products matched that filter yet. Try another category or collection from the live catalog.
            </div>
          )}
        </section>
      </div>
    </PageChrome>
  );
}
