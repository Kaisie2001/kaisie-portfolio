import type { ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "link";
  className?: string;
};

export function PrimaryButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: PrimaryButtonProps) {
  const base =
    "w-full rounded-[12px] px-4 py-3 text-[14px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const styles =
    variant === "primary"
      ? "bg-[var(--rain-teal,#00a8b5)] text-white hover:bg-[var(--rain-teal-hover,#008f9a)] focus-visible:outline-[#00a8b5]"
      : variant === "secondary"
        ? "border border-[#e0e0e0] bg-white text-[var(--rain-text-primary,#1a1a1a)] hover:bg-[#fafafa]"
        : "mt-2 bg-transparent py-2 text-[12px] font-normal text-[var(--rain-text-secondary,#8e8e93)] hover:text-[var(--rain-teal,#00a8b5)]";

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
