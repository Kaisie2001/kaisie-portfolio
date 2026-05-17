import type { ReactNode } from "react";
import { BottomSheet } from "./BottomSheet";

type MapFirstLayoutProps = {
  map: ReactNode;
  sheetTitle?: string;
  sheetSubtitle?: string;
  sheetChildren: ReactNode;
  sheetFooter?: ReactNode;
  sheetFooterSecondary?: ReactNode;
  topOverlay?: ReactNode;
  /** Figma: map dimmed behind service-status sheet */
  dimMap?: boolean;
};

/** Figma 00robotaxi — full-bleed map with bottom sheet overlay (not 52/48 split). */
export function MapFirstLayout({
  map,
  sheetTitle,
  sheetSubtitle,
  sheetChildren,
  sheetFooter,
  sheetFooterSecondary,
  topOverlay,
  dimMap = false,
}: MapFirstLayoutProps) {
  return (
    <div className="map-first-layout relative h-full min-h-0 flex-1 w-full">
      <div className="map-full-bleed absolute inset-0 z-0">
        {map}
        {dimMap ? <div className="map-dim-overlay" aria-hidden /> : null}
        {topOverlay ? (
          <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center px-3">
            {topOverlay}
          </div>
        ) : null}
      </div>
      <BottomSheet
        footer={
          sheetFooter || sheetFooterSecondary ? (
            <div className="sheet-footer-stack">
              {sheetFooter}
              {sheetFooterSecondary}
            </div>
          ) : undefined
        }
      >
        {sheetTitle ? (
          <header className="bottom-sheet-header">
            <h2 className="sheet-title">{sheetTitle}</h2>
            {sheetSubtitle ? <p className="sheet-subtitle">{sheetSubtitle}</p> : null}
          </header>
        ) : null}
        {sheetChildren}
      </BottomSheet>
    </div>
  );
}
