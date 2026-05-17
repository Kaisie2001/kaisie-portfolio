import type { ReactNode } from "react";

type DetailRowProps = {
  icon: ReactNode;
  children: ReactNode;
};

export function DetailRow({ icon, children }: DetailRowProps) {
  return (
    <div className="detail-row flex items-start gap-2.5 py-1.5">
      <span className="detail-row-icon mt-0.5 shrink-0 text-[var(--rain-text-secondary,#666)]">
        {icon}
      </span>
      <p className="text-[13px] leading-snug text-[var(--rain-text-primary,#1a1a1a)]">
        {children}
      </p>
    </div>
  );
}
