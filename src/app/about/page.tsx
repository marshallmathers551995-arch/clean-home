import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="text-3xl font-bold text-navy">About CleanHome</h1>
      <div className="mt-6 space-y-4 text-muted">
        <p>
          CleanHome supplies quality household cleaning products at affordable prices. From dishwashing and laundry to
          floors and bathrooms, we make it simple to keep your home clean.
        </p>
        <p>
          We have served customers in person for years. Now you can browse our range and order online, with delivery
          straight to your door.
        </p>
        <p className="rounded-lg bg-tint p-4 text-sm">
          Placeholder copy. Replace this page with CleanHome&apos;s real story once the client supplies it.
        </p>
      </div>
    </div>
  );
}
