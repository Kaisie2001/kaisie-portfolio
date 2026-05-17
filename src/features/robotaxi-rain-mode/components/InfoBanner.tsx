import type { ReactNode } from "react";
import { InfoCircleIcon } from "./icons/RainModeIcons";

export function InfoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="banner-info">
      <InfoCircleIcon />
      <span>{children}</span>
    </div>
  );
}

export function ValidBanner({ children }: { children: ReactNode }) {
  return (
    <div className="banner-valid">
      <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3 8.5 6.5 12 13 4"
          stroke="#34a853"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </svg>
      <span>{children}</span>
    </div>
  );
}
