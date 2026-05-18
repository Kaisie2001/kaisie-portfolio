"use client";

import type { ReactNode } from "react";
import { BottomSheet } from "./BottomSheet";

/** Bottom sheet only — map is rendered once in FigmaRainModeDemo */
type ScreenShellProps = {
  children: ReactNode;
};

export function ScreenShell({ children }: ScreenShellProps) {
  return (
    <div className="figma-screen-layer">
      <BottomSheet>{children}</BottomSheet>
    </div>
  );
}
