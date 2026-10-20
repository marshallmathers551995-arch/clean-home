import Link from "next/link";
import { CATEGORIES, getBestSellers, getBundles } from "@/lib/catalog";
import { DELIVERY } from "@/lib/delivery";
import { formatRM } from "@/lib/money";
import { ProductCard } from "@/components/ProductCard";
import { BundleCard } from "@/components/BundleCard";
import { BottleArt } from "@/components/BottleArt";
import { SectionHeader } from "@/components/SectionHeader";

export const dynamic = "force-dynamic";

const CATEGORY_ART: Record<string, string> = {
  dishwashing: "dishwashing",
  laundry: "laundry",
  floor: "floor",
  bathroom: "bathroom",
  bleach: "bleach",
  general: "general",
};

const STEPS = [
  { n: 1, title: "Choose Your Products", text: "Browse our range and add what you need." },
  { n: 2, title: "Add to Order", text: "Pick quantities and review your order." },
  { n: 3, title: "Pay or WhatsApp", text: "Pay online, or send your order on WhatsApp." },
  { n: 4, title: "Receive at Home", text: "Sit back and relax. We deliver to your door." },
];

export default async function HomePage() {
  const [bestSellers, bundles] = await Promise.all([getBestSellers(), getBundles()]);

  return (
    <>
      <section className="bg-gradient-to-br from-tint via-white to-mint">
        <div className="container-page grid items-center gap-8 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl lg:text-5xl">
              Everything Your Home Needs to Stay Clean.
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted">
              Quality household cleaning products at affordable prices, delivered straight to your door.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="min-w-fit flex-1 rounded-full border border-brand bg-brand px-4 py-3 text-center font-semibold text-white hover:bg-brand-dark sm:flex-none sm:px-6">
                Shop Products
              </Link>
              <Link href="/bundles" className="min-w-fit flex-1 rounded-full border border-brand px-4 py-3 text-center font-semibold text-brand hover:bg-tint sm:flex-none sm:px-6">
                View Bundles
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm font-medium text-navy sm:grid-cols-4">
              {["Effective Cleaning", "Trusted Quality", "Fast & Reliable Delivery", "A Cleaner Home for Your Family"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 text-leaf" aria-hidden="true">&#10003;</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden justify-center gap-3 md:flex" aria-hidden="true">
            {(["laundry", "dishwashing", "bleach", "floor"] as const).map((c, i) => (
              <BottleArt key={c} category={c} className={`w-24 rounded-2xl ${i % 2 ? "h-52" : "h-64"}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-tint py-12">
        <div className="container-page">
          <SectionHeader title="Shop by What You Need" subtitle="Find the right products for your cleaning needs." />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="overflow-hidden rounded-xl border border-line bg-white shadow-sm transition hover:shadow-md"
              >
                <BottleArt category={CATEGORY_ART[c.slug]} className="h-24" />
                <div className="p-3">
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className="text-xs text-brand">{c.sub} &rsaquo;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <SectionHeader
            title="Our Best Sellers"
            subtitle="Well-loved by many households."
            action={{ href: "/products", label: "View All Products" }}
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint py-12">
        <div className="container-page">
          <SectionHeader
            title="Household Bundle Deals"
            subtitle="Save more when you buy as a set!"
            action={{ href: "/bundles", label: "View All Bundles" }}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bundles.map((b) => (
              <BundleCard key={b.id} bundle={b} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <SectionHeader title="How to Order" subtitle="It's easy! Just a few simple steps." />
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-xl border border-line p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{s.n}</span>
                <p className="mt-3 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-tint py-8">
        <div className="container-page grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold text-navy">Delivery Available</p>
            <p className="text-muted">{DELIVERY.areas.join(" | ")}</p>
            <p className="font-semibold text-leaf">Free delivery above {formatRM(DELIVERY.freeAboveSen)}</p>
          </div>
          <div>
            <p className="font-semibold text-navy">Trusted &amp; Quality Products</p>
            <p className="text-muted">Safe, effective and suitable for your home.</p>
          </div>
          <div>
            <p className="font-semibold text-navy">Need Help?</p>
            <p className="text-muted">
              <Link href="/contact" className="text-brand underline">Chat with us on WhatsApp</Link>. We&apos;re happy to assist you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
