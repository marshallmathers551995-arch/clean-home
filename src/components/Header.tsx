"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/bundles", label: "Bundles" },
  { href: "/how-to-order", label: "How to Order" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count, ready, setDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="CleanHome home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 py-1 text-sm font-medium ${
                  active ? "border-brand text-brand" : "border-transparent text-foreground hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="My Order"
            className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-wa px-3 py-2 text-sm font-semibold text-white hover:bg-wa-dark sm:px-4"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 4h2l2.4 11h10.2L20 7H6" />
              <circle cx="9" cy="19.500" r="1.200" />
              <circle cx="17" cy="19.500" r="1.200" />
            </svg>
            <span className="hidden sm:inline">My Order</span>
            {ready && count > 0 && (
              <span className="rounded-full bg-white px-2 text-xs font-bold text-wa-dark sm:ml-1" aria-label={`${count} items`}>
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-white lg:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="py-3 text-sm font-medium">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
