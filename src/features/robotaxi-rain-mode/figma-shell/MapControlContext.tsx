"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type MapControlContextValue = {
  recenterOnUser: () => void;
  registerRecenter: (fn: (() => void) | null) => void;
  /** Bottom sheet height as fraction of screen (0–1), for map centering above sheet */
  sheetCoverPct: number;
};

const MapControlContext = createContext<MapControlContextValue | null>(null);

export function MapControlProvider({
  children,
  sheetCoverPct,
}: {
  children: ReactNode;
  sheetCoverPct: number;
}) {
  const recenterRef = useRef<(() => void) | null>(null);
  const sheetCoverRef = useRef(sheetCoverPct);
  sheetCoverRef.current = sheetCoverPct;

  const registerRecenter = useCallback((fn: (() => void) | null) => {
    recenterRef.current = fn;
  }, []);

  const recenterOnUser = useCallback(() => {
    recenterRef.current?.();
  }, []);

  const value = useMemo(
    () => ({
      recenterOnUser,
      registerRecenter,
      get sheetCoverPct() {
        return sheetCoverRef.current;
      },
    }),
    [recenterOnUser, registerRecenter],
  );

  return (
    <MapControlContext.Provider value={value}>{children}</MapControlContext.Provider>
  );
}

export function useMapControl() {
  const ctx = useContext(MapControlContext);
  if (!ctx) {
    throw new Error("useMapControl must be used within MapControlProvider");
  }
  return ctx;
}

export function useOptionalMapControl() {
  return useContext(MapControlContext);
}
