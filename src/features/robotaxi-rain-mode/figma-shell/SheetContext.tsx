"use client";

import { createContext, useContext } from "react";

type SheetContextValue = {
  expand: () => void;
  collapse: () => void;
  isExpanded: boolean;
  fitToContent: () => void;
};

export const SheetContext = createContext<SheetContextValue | null>(null);

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("useSheet must be used within BottomSheet");
  }
  return ctx;
}
