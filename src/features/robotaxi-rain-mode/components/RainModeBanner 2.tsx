/** Inline SVG rain icon — editable vector, not raster */
export function RainIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 2v2M8 1v2M12 2v2M2 8h2M6 7h2M10 8h2M3 12l1-2M7 11l1-2M11 12l1-2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type RainModeBannerProps = {
  title?: string;
  subtitle?: string;
};

export function RainModeBanner({
  title = "Rain Mode is on",
  subtitle = "雨天模式已开启",
}: RainModeBannerProps) {
  return (
    <div className="rain-mode-banner flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-slate-900/85 px-3 py-2 shadow-lg backdrop-blur-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
        <RainIcon />
      </span>
      <div>
        <p className="text-[12px] font-semibold text-cyan-100">{title}</p>
        <p className="copy-cn text-[10px] text-cyan-200/70">{subtitle}</p>
      </div>
    </div>
  );
}
