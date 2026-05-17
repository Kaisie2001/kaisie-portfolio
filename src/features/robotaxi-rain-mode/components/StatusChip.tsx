type StatusChipProps = {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "neutral" | "info" | "warning" | "success";
};

const toneClasses: Record<NonNullable<StatusChipProps["tone"]>, string> = {
  neutral: "border-[#eeeeee] bg-[#fafafa] text-[#1a1a1a]",
  info: "border-[#b3e5fc] bg-[#e1f5fe] text-[#01579b]",
  warning: "border-[#ffe0b2] bg-[#fff3e0] text-[#e65100]",
  success: "border-[#c8e6c9] bg-[#e8f5e9] text-[#2e7d32]",
};

export function StatusChip({
  label,
  value,
  sublabel,
  tone = "neutral",
}: StatusChipProps) {
  return (
    <div className={`status-chip rounded-xl border px-3 py-2.5 ${toneClasses[tone]}`}>
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#666]">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] font-semibold leading-snug">{value}</p>
      {sublabel ? <p className="copy-cn mt-1 text-[11px] opacity-80">{sublabel}</p> : null}
    </div>
  );
}
