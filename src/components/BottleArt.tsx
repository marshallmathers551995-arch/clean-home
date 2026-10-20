// Placeholder artwork until real product photos are supplied.
const COLORS: Record<string, { bg: string; fill: string }> = {
  dishwashing: { bg: "#e8f7ec", fill: "#2e9e4f" },
  laundry: { bg: "#e6f0ff", fill: "#1b5fd1" },
  bleach: { bg: "#eef2f7", fill: "#9fb4d1" },
  floor: { bg: "#f1e9fb", fill: "#7a3fc4" },
  bathroom: { bg: "#e3f4fb", fill: "#1d9bd8" },
  general: { bg: "#fff4e0", fill: "#f29b1d" },
};

export function BottleArt({ category, className = "h-36" }: { category: string; className?: string }) {
  const c = COLORS[category] ?? COLORS.general;
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ background: c.bg }} aria-hidden="true">
      <svg width="56" height="88" viewBox="0 0 56 88" fill="none">
        <rect x="20" y="2" width="16" height="10" rx="2" fill={c.fill} opacity="0.7" />
        <path d="M18 14h20v8c8 4 12 10 12 20v36a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V42c0-10 4-16 12-20v-8Z" fill={c.fill} />
        <rect x="14" y="44" width="28" height="22" rx="3" fill="#fff" opacity="0.85" />
      </svg>
    </div>
  );
}
