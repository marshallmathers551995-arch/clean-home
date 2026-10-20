import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type P = {
  slug: string; name: string; size: string; category: string;
  bullets: string[]; priceSen: number; badge?: string;
};

// Placeholder catalogue taken from the design mockup. Replace with the client's real data.
const products: P[] = [
  { slug: "dishwashing-liquid", name: "Dishwashing Liquid", size: "1L", category: "dishwashing", priceSen: 690, badge: "Best Seller",
    bullets: ["Removes tough grease", "Gentle on hands", "Fresh lemon fragrance"] },
  { slug: "liquid-laundry-detergent", name: "Liquid Laundry Detergent", size: "2L", category: "laundry", priceSen: 1290, badge: "Customer Favourite",
    bullets: ["Suitable for daily washing", "Fresh fragrance", "Helps remove dirt & stains"] },
  { slug: "bleach", name: "Bleach", size: "2L", category: "bleach", priceSen: 890, badge: "Most Value",
    bullets: ["Kills 99.9% germs", "Whitens & brightens", "Multi-surface use"] },
  { slug: "floor-cleaner", name: "Floor Cleaner", size: "2L", category: "floor", priceSen: 990,
    bullets: ["Deep cleans floors", "Long lasting freshness", "Suitable for all floor types"] },
  { slug: "bathroom-cleaner", name: "Bathroom Cleaner", size: "750ml", category: "bathroom", priceSen: 790,
    bullets: ["Removes soap scum", "Kills 99.9% germs", "Keeps bathroom fresh"] },
  { slug: "multi-purpose-cleaner", name: "Multi-Purpose Cleaner", size: "750ml", category: "general", priceSen: 650,
    bullets: ["Cleans multiple surfaces", "Removes dirt & stains", "Fresh citrus scent"] },
  { slug: "fabric-softener", name: "Fabric Softener", size: "2L", category: "laundry", priceSen: 890,
    bullets: ["Soft, fresh-smelling clothes", "Reduces static", "Long lasting fragrance"] },
  { slug: "stain-remover", name: "Stain Remover", size: "500ml", category: "laundry", priceSen: 590,
    bullets: ["Targets tough stains", "Safe on coloured fabrics", "Pre-treat before washing"] },
  { slug: "mop-refill", name: "Mop Refill", size: "1 pc", category: "floor", priceSen: 890,
    bullets: ["Absorbent microfibre", "Machine washable", "Fits standard mop heads"] },
];

// Fixed bundle prices. Savings are computed from the item prices.
const bundles = [
  { slug: "basic-home-cleaning-set", name: "Basic Home Cleaning Set", priceSen: 3290,
    description: "Everyday essentials for a clean home.",
    items: [["dishwashing-liquid", 1], ["liquid-laundry-detergent", 1], ["floor-cleaner", 1], ["bathroom-cleaner", 1]] },
  { slug: "laundry-set", name: "Laundry Set", priceSen: 2190,
    description: "Everything for fresh, stain-free clothes.",
    items: [["liquid-laundry-detergent", 1], ["fabric-softener", 1], ["stain-remover", 1]] },
  { slug: "floor-cleaning-set", name: "Floor Cleaning Set", priceSen: 1990,
    description: "Spotless floors, start to finish.",
    items: [["floor-cleaner", 1], ["multi-purpose-cleaner", 1], ["mop-refill", 1]] },
  { slug: "complete-home-set", name: "Complete Home Set", priceSen: 6490, badge: "Popular",
    description: "All the essentials for your home. Best value.",
    items: [["dishwashing-liquid", 1], ["liquid-laundry-detergent", 1], ["bleach", 1], ["floor-cleaner", 1],
      ["bathroom-cleaner", 1], ["multi-purpose-cleaner", 1], ["fabric-softener", 1], ["stain-remover", 1], ["mop-refill", 1]] },
] as const;

// Safe to run repeatedly, including against a live database: products and bundles are matched by slug
// and updated in place, and orders are never touched. Entries removed from this file are left as they are.
async function main() {
  const bySlug = new Map<string, number>();
  for (const [i, p] of products.entries()) {
    const data = { ...p, bullets: JSON.stringify(p.bullets), badge: p.badge ?? null, sortOrder: i };
    const row = await db.product.upsert({ where: { slug: p.slug }, create: data, update: data });
    bySlug.set(p.slug, row.id);
  }
  for (const [i, b] of bundles.entries()) {
    const data = {
      slug: b.slug, name: b.name, priceSen: b.priceSen, description: b.description,
      badge: "badge" in b ? b.badge : null, sortOrder: i,
    };
    const row = await db.bundle.upsert({ where: { slug: b.slug }, create: data, update: data });
    await db.bundleItem.deleteMany({ where: { bundleId: row.id } });
    await db.bundleItem.createMany({
      data: b.items.map(([slug, quantity]) => ({ bundleId: row.id, productId: bySlug.get(slug)!, quantity })),
    });
  }
  console.log(`Seeded ${products.length} products and ${bundles.length} bundles.`);
}

main().finally(() => db.$disconnect());
