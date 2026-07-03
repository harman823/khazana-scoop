import Image from "next/image";
import Link from "next/link";
import { PageChrome } from "@/components/page-chrome";
import { featuredProducts } from "@/lib/products";

export default function ProductsPage(): React.ReactElement {
  return (
    <PageChrome
      title="Products"
      subtitle="Browse mystery scoops, lucky capsules, charm mixes, crystals, and stationery packs."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featuredProducts.map((product) => (
          <Link className="app-card overflow-hidden transition hover:-translate-y-1" href={product.route} key={product.slug}>
            <div className="relative h-52 bg-[#fff1f6]">
              <Image alt={product.name} className="object-cover" fill sizes="(min-width: 1024px) 33vw, 100vw" src={product.image} />
            </div>
            <div className="p-5">
              <p className={`text-xs font-black ${product.accent === "teal" ? "text-[var(--teal)]" : "text-[#f72c7b]"}`}>
                {product.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black">{product.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{product.summary}</p>
              <p className="mt-4 font-black">{product.priceLabel}</p>
            </div>
          </Link>
        ))}
      </div>
    </PageChrome>
  );
}
