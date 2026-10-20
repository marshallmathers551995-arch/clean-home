import type { BundleView } from "@/lib/catalog";
import { formatRM } from "@/lib/money";
import { AddToOrder } from "./AddToOrder";

export function BundleCard({ bundle }: { bundle: BundleView }) {
  return (
    <article className="relative flex flex-col rounded-xl border border-line bg-white p-4 shadow-sm">
      {bundle.badge && (
        <span className="absolute right-3 top-0 -translate-y-1/2 rounded bg-leaf px-2 py-0.5 text-[11px] font-semibold text-white">
          {bundle.badge}
        </span>
      )}
      <h3 className="font-semibold leading-tight">{bundle.name}</h3>
      {bundle.description && <p className="mt-1 text-xs text-muted">{bundle.description}</p>}
      <ul className="mt-3 space-y-0.5 text-xs text-muted">
        {bundle.items.map((i) => (
          <li key={i.name}>
            &bull; {i.quantity > 1 ? `${i.quantity} x ` : ""}
            {i.name} {i.size}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            {bundle.savedSen > 0 && <p className="text-xs text-muted line-through">{formatRM(bundle.originalSen)}</p>}
            <p className="text-xl font-bold">{formatRM(bundle.priceSen)}</p>
          </div>
          {bundle.savePercent > 0 && (
            <span className="rounded bg-mint px-2 py-0.5 text-xs font-bold text-leaf">Save {bundle.savePercent}%</span>
          )}
        </div>
        <AddToOrder kind="bundle" id={bundle.id} name={bundle.name} unitPriceSen={bundle.priceSen} showStepper={false} tone="blue" />
      </div>
    </article>
  );
}
