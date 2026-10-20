"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * After paying on Stripe, the customer can land here a moment before Stripe's webhook confirms the payment.
 * Re-check every few seconds (for up to ~1 minute) so the page flips to "paid" by itself.
 */
export function AutoRefresh({ everyMs = 3000, maxTries = 20 }: { everyMs?: number; maxTries?: number }) {
  const router = useRouter();
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      if (++tries > maxTries) return clearInterval(id);
      router.refresh();
    }, everyMs);
    return () => clearInterval(id);
  }, [router, everyMs, maxTries]);
  return null;
}
