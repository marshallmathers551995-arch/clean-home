"use client";

import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

/** Empties the cart once an order has been placed (or paid). */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  return null;
}
