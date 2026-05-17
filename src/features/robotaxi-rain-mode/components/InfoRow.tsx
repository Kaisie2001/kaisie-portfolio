import type { ReactNode } from "react";

type InfoRowProps = {
  icon: ReactNode;
  children: ReactNode;
};

export function InfoRow({ icon, children }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="mt-0.5 shrink-0 text-[var(--rain-text-secondary,#8e8e93)]">{icon}</span>
      <p className="text-[11px] leading-snug text-[var(--rain-text-primary,#1c1c1e)]">{children}</p>
    </div>
  );
}
