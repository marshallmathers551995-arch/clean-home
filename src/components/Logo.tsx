export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M5 17 18 5l13 12" stroke={light ? "#fff" : "#1b5fd1"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 15v15h20V15" stroke={light ? "#fff" : "#1b5fd1"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 27c-4 0-6-3-5-7 4 0 7 2 5 7Z" fill="#2e9e4f" />
      </svg>
      <span className="leading-none">
        <span className={`block text-lg font-extrabold tracking-tight sm:text-xl ${light ? "text-white" : "text-brand"}`}>
          Clean<span className="text-leaf">Home</span>
        </span>
        <span className={`whitespace-nowrap text-[9px] font-semibold tracking-[0.18em] ${light ? "block text-white/70" : "hidden text-muted sm:block"}`}>
          CLEANER HOME · HAPPIER YOU
        </span>
      </span>
    </span>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.4L3 21Z" />
      <path d="M9 9c0 3 3 6 6 6l1-1.500-2-1-.8.800c-1-.4-1.800-1.200-2.200-2.200l.8-.8-1-2L9 9Z" />
    </svg>
  );
}
