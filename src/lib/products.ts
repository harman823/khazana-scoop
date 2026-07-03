export type FeaturedProduct = {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  priceLabel: string;
  route: string;
  image: string;
  accent: "pink" | "teal";
  highlights: string[];
};

export const featuredProducts: FeaturedProduct[] = [
  {
    slug: "mystery-scoops",
    name: "Mystery Scoops",
    eyebrow: "Choose your size",
    summary: "A hand-packed scoop of charms, crystals, stationery, miniatures, and tiny surprises.",
    description:
      "Pick Small, Medium, or Large and we pack a balanced mystery mix with cute collectible energy. Add a re-scoop later if the reveal needs another try.",
    priceLabel: "From $9.99",
    route: "/mystery-scoops",
    image: "/mystery-scoop-hero.png",
    accent: "pink",
    highlights: ["Four scoop sizes", "Packing video included", "Earn Scoop Points"],
  },
  {
    slug: "lucky-capsules",
    name: "Lucky Capsules",
    eyebrow: "Bonus surprise",
    summary: "Sealed capsules with a tiny bonus charm, mini, crystal, or stationery treat.",
    description:
      "Lucky Capsules are small add-on surprises made for collectors who love one extra reveal. Each capsule is sealed before packing so the bonus stays a true mystery.",
    priceLabel: "$2.99",
    route: "/products/lucky-capsules",
    image: "/mystery-scoop-hero.png",
    accent: "teal",
    highlights: ["Sealed capsule", "Tiny bonus item", "Great cart add-on"],
  },
  {
    slug: "charm-mixes",
    name: "Charm Mixes",
    eyebrow: "Collector favorite",
    summary: "Curated mini charm assortments in soft themes and bright little color stories.",
    description:
      "Charm Mixes focus on cute acrylics, resin charms, and small character-style pieces. They are ideal for keychains, phone cases, journals, and tiny display trays.",
    priceLabel: "From $12.00",
    route: "/products/charm-mixes",
    image: "/mystery-scoop-hero.png",
    accent: "pink",
    highlights: ["Theme-led bundles", "Small-batch curation", "Display-ready pieces"],
  },
  {
    slug: "crystal-scoops",
    name: "Crystal Scoops",
    eyebrow: "Soft sparkle",
    summary: "Pastel crystals and polished stones mixed for gentle shine and shelf appeal.",
    description:
      "Crystal Scoops bring a softer collectible mood with polished stones, mini points, and sparkle accents. Each pack balances color, texture, and size.",
    priceLabel: "From $14.00",
    route: "/products/crystal-scoops",
    image: "/mystery-scoop-hero.png",
    accent: "teal",
    highlights: ["Pastel stones", "Balanced textures", "Gift-friendly"],
  },
  {
    slug: "stationery-packs",
    name: "Stationery Packs",
    eyebrow: "Desk treats",
    summary: "Sticker flakes, clips, tabs, and tiny paper goods for journaling and gifting.",
    description:
      "Stationery Packs are made for planners, pen pals, and desk drawers that deserve a little joy. Expect sticker flakes, clips, tabs, and sweet paper goods.",
    priceLabel: "From $8.00",
    route: "/products/stationery-packs",
    image: "/mystery-scoop-hero.png",
    accent: "pink",
    highlights: ["Sticker flakes", "Journal-ready", "Easy gift add-on"],
  },
];

export function getProductBySlug(slug: string): FeaturedProduct | undefined {
  return featuredProducts.find((product) => product.slug === slug);
}
