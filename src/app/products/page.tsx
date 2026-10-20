import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const active = CATEGORIES.find((c) => c.slug === category)?.slug;
  const products = await getProducts(active);

  const pill = (isActive: boolean) =>
    `grow whitespace-nowrap rounded-full border px-4 py-1.5 text-center text-sm font-medium sm:grow-0 ${
      isActive ? "border-brand bg-brand text-white" : "border-line bg-white hover:bg-tint"
    }`;

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-navy">Products</h1>
      <p className="mt-1 text-muted">Find the right products for every area of your home.</p>

      <div className="mt-6 flex flex-wrap gap-2" role="navigation" aria-label="Categories">
        <Link href="/products" className={pill(!active)}>All</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/products?category=${c.slug}`} className={pill(active === c.slug)}>
            {c.sub}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-muted">No products in this category yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
