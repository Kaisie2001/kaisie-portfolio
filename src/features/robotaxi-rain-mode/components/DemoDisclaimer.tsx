type DemoDisclaimerProps = {
  text: string;
  compact?: boolean;
};

export function DemoDisclaimer({ text, compact = false }: DemoDisclaimerProps) {
  return (
    <p
      className={`demo-disclaimer text-slate-500 ${
        compact ? "text-[9px] leading-snug" : "text-[10px] leading-relaxed"
      }`}
    >
      {text}
    </p>
  );
}
