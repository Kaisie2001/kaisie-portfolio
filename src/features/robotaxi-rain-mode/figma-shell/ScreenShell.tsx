import type { ReactNode } from "react";
import type { MapKind } from "./types";
import { MapView } from "./MapView";
import { IconMore, IconProfile, IconRain } from "./icons";

type ScreenShellProps = {
  mapKind: MapKind;
  mapDimmed?: boolean;
  selectedPickup?: "closest" | "sheltered" | "soonest";
  showRainHeader?: boolean;
  mapOverlay?: ReactNode;
  children: ReactNode;
};

export function ScreenShell({
  mapKind,
  mapDimmed,
  selectedPickup,
  showRainHeader,
  mapOverlay,
  children,
}: ScreenShellProps) {
  return (
    <>
      <MapView kind={mapKind} dimmed={mapDimmed} selectedPickup={selectedPickup} />
      {showRainHeader ? (
        <div className="figma-top">
          <span className="figma-rain-chip">
            <IconRain />
            Rain Mode · Moderate rain
          </span>
          <div className="figma-top-actions">
            <button type="button" className="figma-icon-btn" aria-label="Profile">
              <IconProfile />
            </button>
            <button type="button" className="figma-icon-btn" aria-label="More">
              <IconMore />
            </button>
          </motion>
        </motion>
      ) : null}
      {mapOverlay}
      <div className="figma-sheet">{children}</motion>
    </>
  );
}
