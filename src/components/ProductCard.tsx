import type { ProductView } from "@/lib/catalog";
import { formatRM } from "@/lib/money";
import { AddToOrder } from "./AddToOrder";
import { BottleArt } from "./BottleArt";

export function ProductCard({ product }: { product: ProductView }) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">
          {product.badge}
        </span>
      )}
      <BottleArt category={product.category} />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-tight">{product.name}</h3>
        <p className="text-sm text-muted">{product.size}</p>
        <ul className="mt-2 space-y-0.5 text-xs text-muted">
          {product.bullets.map((b) => (
            <li key={b}>&bull; {b}</li>
          ))}
        </ul>
        <div className="mt-auto pt-4">
          <p className="mb-3 text-lg font-bold text-brand">{formatRM(product.priceSen)}</p>
          <AddToOrder
            kind="product"
            id={product.id}
            name={`${product.name} ${product.size}`}
            unitPriceSen={product.priceSen}
          />
        </div>
      </div>
    </article>
  );
}
