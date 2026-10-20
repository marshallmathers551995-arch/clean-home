import type { Metadata } from "next";
import { getBundles } from "@/lib/catalog";
import { BundleCard } from "@/components/BundleCard";

export const metadata: Metadata = { title: "Bundle Deals" };
export const dynamic = "force-dynamic";

export default async function BundlesPage() {
  const bundles = await getBundles();
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-navy">Household Bundle Deals</h1>
      <p className="mt-1 text-muted">Save more when you buy as a set!</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bundles.map((b) => (
          <BundleCard key={b.id} bundle={b} />
        ))}
      </div>
    </div>
  );
}
