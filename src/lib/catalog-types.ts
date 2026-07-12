export type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
};

export type CatalogCollection = {
  id: number;
  name: string;
  slug: string;
};

export type CatalogImage = {
  id: number;
  productId: number;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type CatalogDiscount = {
  id: number;
  targetType: "product" | "category" | "collection";
  targetId: number;
  amount: number;
  type: "fixed" | "percent";
  startAt: string | null;
  endAt: string | null;
  active: boolean;
};

export type StorefrontCatalogProduct = {
  id: number;
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  image: string;
  gallery: CatalogImage[];
  category: CatalogCategory | null;
  collections: CatalogCollection[];
  availableColours: string[];
  highlights: string[];
  basePrice: number | null;
  effectivePrice: number | null;
  priceLabel: string;
  originalPriceLabel: string | null;
  activeDiscount: CatalogDiscount | null;
  route: string;
};

export type StorefrontCatalogFacet = {
  id: number;
  name: string;
  slug: string;
  image: string;
  href: string;
  productCount: number;
};

export type StorefrontCatalogHomeData = {
  products: StorefrontCatalogProduct[];
  categories: StorefrontCatalogFacet[];
  collections: StorefrontCatalogFacet[];
  featuredProducts: StorefrontCatalogProduct[];
  favouriteProducts: StorefrontCatalogProduct[];
};
