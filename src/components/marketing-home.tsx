import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { StorefrontCatalogHomeData } from "@/lib/catalog-types";
import { StorefrontFooter, StorefrontHeader } from "@/components/storefront-shell";

type MarketingHomeProps = {
  homeData: StorefrontCatalogHomeData;
};

function ProductPrice({
  current,
  original,
}: {
  current: string;
  original: string | null;
}): React.ReactElement {
  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="font-barlow text-lg font-bold text-[#C5B3D3]">{current}</span>
      {original ? (
        <span className="font-barlow text-sm text-[#1e293b]/50 line-through">{original}</span>
      ) : null}
    </div>
  );
}

export function MarketingHome({ homeData }: MarketingHomeProps): React.ReactElement {
  const heroProduct = homeData.featuredProducts[0] ?? homeData.products[0] ?? null;
  const featuredCards = homeData.featuredProducts.slice(1, 3);
  const trendingProducts = homeData.products.slice(0, 8);
  const favouriteProducts = homeData.favouriteProducts;
  const categoryCards = homeData.categories.slice(0, 6);
  const collectionCards = homeData.collections.slice(0, 4);

  return (
    <main className="min-h-screen bg-white text-[#1e293b]">
      <StorefrontHeader />

      {heroProduct ? (
        <section className="w-full px-4 pt-4 md:px-8">
          <div className="relative mx-auto h-[52vh] max-w-[1600px] overflow-hidden rounded-[36px] border border-[#ffe3e3] bg-[#FBEFEF] md:h-[72vh]">
            <Image
              src={heroProduct.image}
              alt={heroProduct.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b]/55 via-[#1e293b]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 top-0 flex items-end">
              <div className="max-w-[640px] px-6 pb-10 text-white md:px-10 md:pb-14">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-[#ffe8f4]">
                  {heroProduct.eyebrow}
                </p>
                <h1 className="mt-4 font-baloo text-4xl font-bold leading-[0.9] sm:text-5xl md:text-7xl">
                  {heroProduct.name}
                </h1>
                <p className="mt-4 max-w-[46ch] font-poppins text-sm leading-7 text-white/84 md:text-base">
                  {heroProduct.summary}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href={heroProduct.route}
                    className="rounded-full bg-[#C5B3D3] px-7 py-3 font-baloo text-lg font-semibold text-[#1e293b] transition-colors hover:bg-white"
                  >
                    SHOP NOW
                  </Link>
                  <span className="rounded-full border border-white/40 bg-white/12 px-4 py-2 font-poppins text-sm font-semibold text-white/90 backdrop-blur">
                    {heroProduct.priceLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-12 px-4 md:px-8">
        <h2 className="text-center font-baloo text-3xl md:text-4xl font-bold mb-8 text-[#1e293b]">
          Shop by Category
        </h2>
        <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-8 justify-start lg:justify-center px-4 pb-4">
          {categoryCards.map((category) => (
            <Link
              href={category.href}
              key={category.slug}
              className="flex min-w-[108px] flex-col items-center gap-3 md:min-w-[124px] group"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-transparent transition-colors group-hover:border-[#C5B3D3] md:h-32 md:w-32">
                <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="text-center">
                <span className="font-poppins text-sm md:text-base font-semibold whitespace-nowrap transition-colors group-hover:text-[#C5B3D3]">
                  {category.name}
                </span>
                <p className="mt-1 text-xs font-medium text-[#1e293b]/55">{category.productCount} items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {featuredCards.map((product, index) => (
            <Link
              href={product.route}
              key={product.slug}
              className="group relative aspect-[16/9] overflow-hidden rounded-3xl md:aspect-[4/3]"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
                  {index === 0 ? "Featured drop" : "Fresh pick"}
                </p>
                <h3 className="mt-2 font-baloo text-3xl font-bold">{product.name}</h3>
                <span className="inline-block border-b-2 border-white font-poppins font-semibold pb-1">
                  Shop Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-baloo text-3xl md:text-4xl font-bold text-[#1e293b]">
            Trending Right Now
          </h2>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1 font-poppins font-semibold text-[#C5B3D3] transition-colors hover:text-[#1e293b]"
          >
            View All <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {trendingProducts.map((product) => (
            <div key={product.slug} className="group flex flex-col bg-white">
              <Link href={product.route} className="relative mb-3 aspect-[4/5] overflow-hidden rounded-2xl bg-[#FBEFEF]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="flex w-full items-center justify-center rounded-full bg-[#F5CBCB] py-2.5 font-baloo font-semibold text-[#1e293b] shadow-lg transition-colors hover:bg-[#C5B3D3]">
                    View Product
                  </span>
                </div>
              </Link>
              <Link href={product.route} className="flex flex-1 flex-col px-1">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#1e293b]/45">
                  {product.eyebrow}
                </p>
                <h3 className="mt-2 font-poppins text-sm md:text-base font-medium text-[#1e293b] line-clamp-2">
                  {product.name}
                </h3>
                <ProductPrice current={product.priceLabel} original={product.originalPriceLabel} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-[#FFE2E2] py-4 overflow-hidden whitespace-nowrap text-xl md:text-3xl font-baloo font-bold uppercase tracking-wider text-[#1e293b]">
        <div className="animate-marquee inline-block">
          <span className="mx-6">Live dashboard catalog</span> •
          <span className="mx-6"> Fresh drops synced automatically</span> •
          <span className="mx-6"> Shop by categories and collections</span> •
          <span className="mx-6"> Live dashboard catalog</span> •
          <span className="mx-6"> Fresh drops synced automatically</span> •
          <span className="mx-6"> Shop by categories and collections</span>
        </div>
      </div>

      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <h2 className="mb-10 text-center font-baloo text-3xl md:text-4xl font-bold text-[#1e293b]">
          Explore Collections
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {collectionCards.map((collection) => (
            <Link
              href={collection.href}
              key={collection.slug}
              className="group relative aspect-square overflow-hidden rounded-3xl bg-[#FFE2E2] p-6"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover opacity-70 mix-blend-multiply transition duration-500 group-hover:scale-105"
              />
              <div className="relative z-10 flex h-full items-end">
                <div>
                  <span className="inline-flex rounded-full bg-white/90 px-4 py-2 font-baloo font-semibold text-[#1e293b] shadow-sm backdrop-blur transition-colors group-hover:bg-[#C5B3D3] group-hover:text-white">
                    {collection.name}
                  </span>
                  <p className="mt-3 font-poppins text-sm font-semibold text-[#1e293b]">
                    {collection.productCount} products
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto mb-16 rounded-3xl bg-[#FBEFEF]">
        <h2 className="mb-10 text-center font-baloo text-3xl md:text-4xl font-bold text-[#1e293b]">
          Customer Favourites
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {favouriteProducts.map((product) => (
            <div
              key={`${product.slug}-fav`}
              className="group flex flex-col rounded-2xl border border-[#C5B3D3]/20 bg-white p-3 shadow-sm"
            >
              <Link href={product.route} className="relative mb-3 aspect-[4/5] overflow-hidden rounded-xl bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
              <Link href={product.route} className="flex flex-1 flex-col px-1 text-center">
                <h3 className="font-poppins text-sm md:text-base font-medium text-[#1e293b] line-clamp-1">
                  {product.name}
                </h3>
                <div className="mt-1 flex justify-center">
                  <ProductPrice current={product.priceLabel} original={product.originalPriceLabel} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <StorefrontFooter />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 15s linear infinite;
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `,
        }}
      />
    </main>
  );
}
