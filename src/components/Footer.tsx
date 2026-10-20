import Link from "next/link";
import { Logo } from "./Logo";
import { DELIVERY } from "@/lib/delivery";
import { formatRM } from "@/lib/money";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/bundles", label: "Bundles" },
  { href: "/how-to-order", label: "How to Order" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-navy text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-white/70">
            Quality household cleaning products at affordable prices.
          </p>
        </div>
        <nav aria-label="Footer" className="-my-2 flex flex-wrap content-start gap-x-6 text-sm">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 text-white/80 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-white/80">
          <p className="font-semibold text-white">Delivery</p>
          <p>{DELIVERY.areas.join(" · ")}</p>
          <p>Free delivery above {formatRM(DELIVERY.freeAboveSen)}</p>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        &copy; {new Date().getFullYear()} CleanHome. All rights reserved.
      </p>
    </footer>
  );
}
