import type { ReactNode } from "react";
import type { MapPlaceholderVariant, PickupZoneId } from "../data/mapModes";
import { MapPlaceholder } from "./MapPlaceholder";
import { MoreIcon, ProfileIcon, RainCloudIcon } from "./icons/RainModeIcons";

type PrototypeLayoutProps = {
  mapVariant: MapPlaceholderVariant;
  mapDimmed?: boolean;
  selectedZone?: PickupZoneId;
  showRainChrome?: boolean;
  mapOverlay?: ReactNode;
  children: ReactNode;
};

/** Figma layout: full-bleed map + absolute bottom sheet */
export function PrototypeLayout({
  mapVariant,
  mapDimmed = false,
  selectedZone = "sheltered",
  showRainChrome = false,
  mapOverlay,
  children,
}: PrototypeLayoutProps) {
  return (
    <div className="prototype-layout">
      <MapPlaceholder variant={mapVariant} dimmed={mapDimmed} selectedZone={selectedZone} />
      {showRainChrome ? (
        <div className="map-chrome">
          <div className="rain-badge">
            <RainCloudIcon />
            Rain Mode · Moderate rain
          </div>
          <div className="map-chrome-actions">
            <button type="button" className="circle-btn" aria-label="Profile">
              <ProfileIcon />
            </button>
            <button type="button" className="circle-btn" aria-label="More">
              <MoreIcon />
            </button>
          </div>
        </div>
      ) : null}
      {mapOverlay}
      <div className="bottom-sheet">{children}</div>
    </div>
  );
}
