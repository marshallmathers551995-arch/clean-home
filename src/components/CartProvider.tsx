"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { computeTotals, MAX_QTY } from "@/lib/pricing";

export type CartItem = {
  kind: "product" | "bundle";
  id: number;
  name: string;
  unitPriceSen: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalSen: number;
  deliveryFeeSen: number;
  totalSen: number;
  ready: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (kind: CartItem["kind"], id: number, quantity: number) => void;
  remove: (kind: CartItem["kind"], id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cleanhome-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage after mount
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const totals = computeTotals(items);
    const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, n));
    return {
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      ...totals,
      ready,
      drawerOpen,
      setDrawerOpen,
      add: (item, quantity = 1) =>
        setItems((cur) => {
          const existing = cur.find((i) => i.kind === item.kind && i.id === item.id);
          if (existing) {
            return cur.map((i) => (i === existing ? { ...i, quantity: clamp(i.quantity + quantity) } : i));
          }
          return [...cur, { ...item, quantity: clamp(quantity) }];
        }),
      setQuantity: (kind, id, quantity) =>
        setItems((cur) => cur.map((i) => (i.kind === kind && i.id === id ? { ...i, quantity: clamp(quantity) } : i))),
      remove: (kind, id) => setItems((cur) => cur.filter((i) => !(i.kind === kind && i.id === id))),
      clear: () => setItems([]),
    };
  }, [items, ready, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
