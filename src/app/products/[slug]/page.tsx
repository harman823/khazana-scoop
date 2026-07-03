import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ShoppingCart, Sparkles } from "lucide-react";
import type React from "react";
import { featuredProducts, getProductBySlug } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams(): { slug: string }[] {
  return featuredProducts
    .filter((product) => product.slug !== "mystery-scoops")
    .map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.slug === "mystery-scoops") {
    notFound();
  }

  const accentClass = product.accent === "teal" ? "text-[var(--teal)]" : "text-[var(--strawberry)]";

  return (
    <main>
      <section className="shell grid min-h-[620px] items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <Link className="text-sm font-black text-[var(--teal)]" href="/#products">
            Back to products
          </Link>
          <p className={`mt-8 text-sm font-black ${accentClass}`}>{product.eyebrow}</p>
          <h1 className="mt-3 max-w-[640px] text-5xl font-black leading-[1.02] tracking-normal sm:text-7xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-[560px] text-lg leading-8 text-muted">{product.description}</p>
          <p className="mt-7 text-3xl font-black">{product.priceLabel}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary focus-ring" href="/checkout">
              Add to cart <ShoppingCart size={17} />
            </Link>
            <Link className="button-secondary focus-ring" href="/mystery-scoops">
              Build a mystery scoop <Sparkles size={17} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[430px] overflow-hidden rounded-[8px] bg-[#fff1f6]">
          <Image
            alt={product.name}
            className="object-cover object-center"
            fill
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            src={product.image}
          />
        </div>
      </section>

      <section className="shell border-t border-[#efe4e8] py-10">
        <h2 className="text-3xl font-black">What is inside</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {product.highlights.map((highlight) => (
            <div className="app-card flex gap-3 p-5" key={highlight}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[7px] bg-[rgba(0,184,173,0.12)] text-[var(--teal)]">
                <Check size={20} />
              </span>
              <span className="text-sm font-black">{highlight}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
