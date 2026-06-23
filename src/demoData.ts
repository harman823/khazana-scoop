import type { InventoryItem, Order, Product } from "./types";

export const demoProducts: Product[] = [
  {
    id: "mystery-scoop",
    name: "Mystery Scoop",
    slug: "mystery-scoop",
    product_type: "mystery_scoop",
    category: "Mystery Scoops",
    description: "A cute surprise box filled with handpicked products from our collection.",
    price: 999,
    image: "/assets/khazana-product-hero.png",
    status: "active",
    variants: [
      { id: "small", name: "Small Scoop", item_count: "7-8 products", price: 549, badge: "Starter Pick", line: "Best for first orders" },
      { id: "medium", name: "Medium Scoop", item_count: "12-15 products", price: 999, badge: "Best Value", line: "Most loved size" },
      { id: "large", name: "Large Scoop", item_count: "20-22 products", price: 1499, badge: "Big Surprise", line: "For gifting or hauls" },
    ],
  },
  {
    id: "build-your-own",
    name: "Build Your Own Scoop",
    slug: "build-your-own-scoop",
    product_type: "build_your_own",
    category: "Build Your Scoop",
    description: "A semi-customized scoop packed around your colours, categories, and occasion notes.",
    price: 1199,
    image: "/assets/khazana-product-hero.png",
    status: "active",
    variants: [
      { id: "byo-small", name: "Small BYO", item_count: "8-9 items", price: 699, badge: "Simple", line: "A few favorites" },
      { id: "byo-medium", name: "Medium BYO", item_count: "14-15 items", price: 1199, badge: "Balanced", line: "More category mix" },
      { id: "byo-large", name: "Large BYO", item_count: "22-25 items", price: 1699, badge: "Gift Box", line: "Big custom bundle" },
    ],
  },
  ...[
    ["scrunchie", "Cloud Soft Scrunchie", "Hair Accessories", 89, "✿", "#FFD1DC"],
    ["pen", "Pastel Gel Pen Set", "Cute Pens", 149, "✎", "#E6E6FA"],
    ["mirror", "Pocket Mirror", "Pocket Mirrors", 129, "◐", "#CDF6F0"],
    ["stickers", "Sticker & Note Pack", "Stickers & Notes", 99, "✦", "#FFE8A3"],
    ["clip", "Mini Hair Clip Pair", "Hair Accessories", 79, "♡", "#F0FFF0"],
    ["charm", "Keychain Charm", "Keychains & Charms", 119, "♢", "#D8F5E6"],
    ["mini", "Beauty Mini", "Beauty Minis", 169, "◌", "#FFD6E8"],
    ["gift", "Surprise Gift Add-on", "Surprise Gifts", 199, "✧", "#E4FFFA"],
  ].map(([id, name, category, price, icon, color]) => ({
    id: String(id),
    name: String(name),
    slug: String(id),
    product_type: "individual" as const,
    category: String(category),
    description: `${name} from the KhazanaScoop cute essentials collection.`,
    price: Number(price),
    badge: "Cute",
    icon: String(icon),
    color: String(color),
    status: "active",
    variants: [],
  })),
];

export const demoInventory: InventoryItem[] = [
  { id: "stationery", name: "Stationery minis", category: "Stationery", cost_price: 28, sell_price: 99, stock: 82, low_stock_at: 10, status: "active" },
  { id: "hair", name: "Hair accessories", category: "Hair Accessories", cost_price: 22, sell_price: 89, stock: 54, low_stock_at: 10, status: "active" },
  { id: "charms", name: "Keychains & charms", category: "Keychains & Charms", cost_price: 35, sell_price: 119, stock: 37, low_stock_at: 10, status: "active" },
  { id: "beauty", name: "Beauty minis", category: "Beauty Minis", cost_price: 55, sell_price: 169, stock: 29, low_stock_at: 10, status: "active" },
  { id: "mirrors", name: "Pocket mirrors", category: "Pocket Mirrors", cost_price: 42, sell_price: 129, stock: 21, low_stock_at: 10, status: "active" },
];

export const demoOrder: Order = {
  id: "KS-DEMO-1024",
  customer: {
    name: "Demo Customer",
    phone: "+91 90000 00000",
    email: "demo@example.com",
    address: "Demo address, Jaipur 302001",
  },
  items: [
    {
      product_id: "mystery-scoop",
      product_name: "Mystery Scoop",
      variant_id: "medium",
      variant_name: "Medium Scoop",
      item_count: "12-15 products",
      quantity: 1,
      price: 999,
      preferences: {},
    },
  ],
  order_note: "No earrings, prefer pink stationery.",
  payment_status: "paid",
  fulfilment_status: "packed",
  subtotal: 999,
  shipping_fee: 0,
  total: 999,
  tracking_number: "SHIP123456",
  created_at: new Date().toISOString(),
};
