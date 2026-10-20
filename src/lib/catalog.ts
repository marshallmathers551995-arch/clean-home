import { db } from "./db";
import { bundleSavings } from "./pricing";

export const CATEGORIES = [
  { slug: "dishwashing", label: "Clean My Dishes", sub: "Dishwashing" },
  { slug: "laundry", label: "Wash My Clothes", sub: "Laundry" },
  { slug: "floor", label: "Clean My Floor", sub: "Floor Cleaner" },
  { slug: "bathroom", label: "Clean My Bathroom", sub: "Bathroom Cleaner" },
  { slug: "bleach", label: "Remove Tough Stains", sub: "Bleach" },
  { slug: "general", label: "General Cleaning", sub: "Other Products" },
] as const;

export type ProductView = {
  id: number;
  slug: string;
  name: string;
  size: string;
  category: string;
  bullets: string[];
  priceSen: number;
  badge: string | null;
};

export type BundleView = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  priceSen: number;
  badge: string | null;
  items: { name: string; size: string; quantity: number }[];
  originalSen: number;
  savedSen: number;
  savePercent: number;
};

type ProductRow = Awaited<ReturnType<typeof db.product.findFirstOrThrow>>;

const toProduct = (p: ProductRow): ProductView => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  size: p.size,
  category: p.category,
  bullets: JSON.parse(p.bullets) as string[],
  priceSen: p.priceSen,
  badge: p.badge,
});

export async function getProducts(category?: string): Promise<ProductView[]> {
  const rows = await db.product.findMany({
    where: { active: true, ...(category ? { category } : {}) },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toProduct);
}

export async function getBestSellers(): Promise<ProductView[]> {
  const rows = await db.product.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" }, take: 6 });
  return rows.map(toProduct);
}

export async function getBundles(): Promise<BundleView[]> {
  const rows = await db.bundle.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { items: { include: { product: true } } },
  });
  return rows.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    description: b.description,
    priceSen: b.priceSen,
    badge: b.badge,
    items: b.items.map((i) => ({ name: i.product.name, size: i.product.size, quantity: i.quantity })),
    ...bundleSavings(
      b.priceSen,
      b.items.map((i) => ({ priceSen: i.product.priceSen, quantity: i.quantity })),
    ),
  }));
}
