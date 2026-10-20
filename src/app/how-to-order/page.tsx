import type { Metadata } from "next";
import Link from "next/link";
import { DELIVERY } from "@/lib/delivery";
import { formatRM } from "@/lib/money";

export const metadata: Metadata = { title: "How to Order" };

const STEPS = [
  ["Choose your products", "Browse the Products or Bundles pages and add what you need to your order."],
  ["Review your order", "Open My Order to adjust quantities. You can see the total and delivery fee."],
  ["Checkout", "Enter your name, phone number and delivery address."],
  ["Pay online or order via WhatsApp", "Pay by card or FPX, or send your order to us on WhatsApp and we will confirm the total and delivery details."],
  ["Receive at home", "We deliver to your door."],
];

export default function HowToOrderPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="text-3xl font-bold text-navy">How to Order</h1>
      <p className="mt-1 text-muted">It&apos;s easy! Just a few simple steps.</p>
      <ol className="mt-8 space-y-4">
        {STEPS.map(([title, text], i) => (
          <li key={title} className="flex gap-4 rounded-xl border border-line p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 rounded-xl bg-tint p-5 text-sm">
        <p className="font-semibold text-navy">Delivery</p>
        <p className="text-muted">
          We deliver to {DELIVERY.areas.join(" and ")}. Delivery is {formatRM(DELIVERY.feeSen)}, and free for orders above {formatRM(DELIVERY.freeAboveSen)}.
        </p>
      </div>
      <Link href="/products" className="mt-8 block rounded-full bg-brand px-6 py-3 text-center font-semibold text-white hover:bg-brand-dark sm:inline-block">
        Start shopping
      </Link>
    </div>
  );
}
