"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import type { FigmaScreen } from "./types";

export const SHEET_SNAP_COLLAPSED = 0.48;

/** Expanded height tuned per screen so content fits without a large blank footer */
const SHEET_SNAP_EXPANDED: Record<FigmaScreen, number> = {
  1: 0.58,
  2: 0.56,
  3: 0.8,
  4: 0.58,
  5: 0.72,
};

export function getSheetSnaps(screen: FigmaScreen) {
  return {
    collapsed: SHEET_SNAP_COLLAPSED,
    expanded: SHEET_SNAP_EXPANDED[screen],
  };
}

type SheetHeightContextValue = {
  heightPct: number;
  setHeightPct: (pct: number) => void;
  heightRef: MutableRefObject<number>;
  snaps: { collapsed: number; expanded: number };
  snapTo: (target: "collapsed" | "expanded") => void;
  screenKey: FigmaScreen;
};

const SheetHeightContext = createContext<SheetHeightContextValue | null>(null);

export function SheetHeightProvider({
  screenKey,
  children,
}: {
  screenKey: FigmaScreen;
  children: ReactNode;
}) {
  const snaps = useMemo(() => getSheetSnaps(screenKey), [screenKey]);
  const [heightPct, setHeightPct] = useState(snaps.collapsed);
  const heightRef = useRef(snaps.collapsed);

  useEffect(() => {
    heightRef.current = heightPct;
  }, [heightPct]);

  const setSheetHeightPct = useCallback((pct: number) => {
    heightRef.current = pct;
    setHeightPct(pct);
  }, []);

  const snapTo = useCallback(
    (target: "collapsed" | "expanded") => {
      const pct = target === "expanded" ? snaps.expanded : snaps.collapsed;
      setSheetHeightPct(pct);
    },
    [setSheetHeightPct, snaps.collapsed, snaps.expanded],
  );

  useEffect(() => {
    setSheetHeightPct(snaps.collapsed);
  }, [screenKey, setSheetHeightPct, snaps.collapsed]);

  return (
    <SheetHeightContext.Provider
      value={{
        heightPct,
        setHeightPct: setSheetHeightPct,
        heightRef,
        snaps,
        snapTo,
        screenKey,
      }}
    >
      {children}
    </SheetHeightContext.Provider>
  );
}

export function useSheetHeight() {
  const ctx = useContext(SheetHeightContext);
  if (!ctx) {
    throw new Error("useSheetHeight must be used within SheetHeightProvider");
  }
  return ctx;
}
