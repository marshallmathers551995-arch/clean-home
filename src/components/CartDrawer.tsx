"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { formatRM } from "@/lib/money";
import { DELIVERY } from "@/lib/delivery";
import { QuantityStepper } from "./QuantityStepper";

export function CartDrawer() {
  const cart = useCart();
  const { drawerOpen, setDrawerOpen } = cart;

  // While the drawer is open: freeze the page behind it (so its scrollbar and scrolling don't show through),
  // keep the page from shifting sideways when the scrollbar disappears, and close on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (scrollbarWidth > 0) html.style.paddingRight = `${scrollbarWidth}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  const close = () => cart.setDrawerOpen(false);
  const remainingForFree = DELIVERY.freeAboveSen - cart.subtotalSen;

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Your order">
      <div className="absolute inset-0 bg-black/40" onClick={close} aria-hidden="true" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">Your Order</h2>
          <button type="button" onClick={close} aria-label="Close" className="rounded-md p-1 text-2xl leading-none">
            &times;
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-muted">Your order is empty.</p>
            <Link href="/products" onClick={close} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-5">
              {cart.items.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="flex items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-sm text-muted">{formatRM(item.unitPriceSen)}</p>
                    <button
                      type="button"
                      onClick={() => cart.remove(item.kind, item.id)}
                      className="mt-1 text-xs text-muted underline hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => cart.setQuantity(item.kind, item.id, q)}
                      label={item.name}
                    />
                    <span className="text-sm font-bold">{formatRM(item.unitPriceSen * item.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-line px-5 py-4 text-sm">
              {remainingForFree >= 0 && (
                <p className="rounded-md bg-mint px-3 py-2 text-leaf">
                  Add {formatRM(remainingForFree + 1)} more for free delivery.
                </p>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatRM(cart.subtotalSen)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span>{cart.deliveryFeeSen === 0 ? "FREE" : formatRM(cart.deliveryFeeSen)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatRM(cart.totalSen)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="mt-2 block rounded-full bg-wa py-3 text-center font-semibold text-white hover:bg-wa-dark"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
