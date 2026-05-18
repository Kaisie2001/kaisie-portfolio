import { getStableMapView } from "./demoScenario";

/** Legacy placeholder variants (older prototype screens) */
export type MapPlaceholderVariant =
  | "entry"
  | "service-zone"
  | "pickup-options"
  | "walk"
  | "route";

/** Leaflet map modes — aligned with Figma 00robotaxi (4 screens) */
export type MapMode =
  | "tripSetup"
  | "destinationConfirm"
  | "serviceStatus"
  | "choosePickup"
  | "confirmPickup"
  | "robotaxiOnTheWay";

export type PickupZoneId = "closest" | "sheltered" | "soonest";

/** [latitude, longitude] — Leaflet order */
export type MapCenter = [number, number];

export type MapViewConfig = {
  center: MapCenter;
  zoom: number;
};

/** Fixed demo viewport — anchored on current location (no per-screen jump) */
export function getMapViewConfig(
  _mode?: MapMode,
  _selectedZoneId?: PickupZoneId,
): MapViewConfig {
  return getStableMapView();
}

/** @deprecated GeoJSON overlays not enabled — kept for legacy imports */
export type MapLayerFlags = {
  showPickupZones: boolean;
  showWalkingRoutes: boolean;
  showVehicleRoute: boolean;
};

/** @deprecated GeoJSON overlays not enabled — kept for legacy imports */
export function getMapLayerVisibility(
  mode: MapMode,
  options?: { hasPickupHighlight?: boolean },
): MapLayerFlags {
  void mode;
  void options;
  return {
    showPickupZones: false,
    showWalkingRoutes: false,
    showVehicleRoute: false,
  };
}
