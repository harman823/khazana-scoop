export type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
};

export type CatalogCollection = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
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
  stockQuantity: number;
  route: string;
};

export type StorefrontCatalogFacet = {
  id: number;
  name: string;
  slug: string;
  image: string;
  href: string;
  productCount: number;
  description?: string | null;
};

export type StorefrontCatalogCollectionSection = {
  collection: StorefrontCatalogFacet;
  products: StorefrontCatalogProduct[];
};

export type StorefrontCatalogHomeData = {
  products: StorefrontCatalogProduct[];
  categories: StorefrontCatalogFacet[];
  collections: StorefrontCatalogFacet[];
  collectionSections: StorefrontCatalogCollectionSection[];
  featuredProducts: StorefrontCatalogProduct[];
  favouriteProducts: StorefrontCatalogProduct[];
};
