import { zoneCoords } from "./pudoZoneService";
import { distanceMeters } from "./randomScenario";
import type {
  PudoZoneState,
  RobotaxiScenario,
  ScenarioLocation,
  WalkingRouteToPickup,
} from "./scenarioTypes";
import { isWalkingRouteToPickup } from "./walkingRouteSegments";

const COORD_EPS = 0.00005;

export const PICKUP_ANCHOR_SAME_AS_USER_METERS = 5;

export function getUserCurrentLocation(scenario: RobotaxiScenario): ScenarioLocation {
  return scenario.userCurrentLocation;
}

export function getPickupAnchor(scenario: RobotaxiScenario): ScenarioLocation {
  return scenario.pickupAnchorLocation;
}

export function getDropoffAnchor(scenario: RobotaxiScenario): ScenarioLocation {
  return scenario.dropoffAnchorLocation;
}

export function getPickupZoneCandidates(scenario: RobotaxiScenario): PudoZoneState[] {
  return scenario.pickupZoneCandidates ?? [];
}

export function locationsNear(
  a: { lng: number; lat: number },
  b: { lng: number; lat: number },
  eps = COORD_EPS,
): boolean {
  return Math.abs(a.lng - b.lng) < eps && Math.abs(a.lat - b.lat) < eps;
}

export function isPickupAnchorDifferentFromCurrentLocation(
  scenario: RobotaxiScenario,
): boolean {
  if (!hasPickupAnchor(scenario) || !hasUserLocation(scenario)) return false;
  return (
    distanceMeters(
      scenario.userCurrentLocation,
      scenario.pickupAnchorLocation,
    ) >= PICKUP_ANCHOR_SAME_AS_USER_METERS
  );
}

export function pickupAnchorAtUserLocation(scenario: RobotaxiScenario): boolean {
  return hasPickupAnchor(scenario) && !isPickupAnchorDifferentFromCurrentLocation(scenario);
}

export function shouldShowPickupAnchorMarker(scenario: RobotaxiScenario): boolean {
  return isPickupAnchorDifferentFromCurrentLocation(scenario);
}

export function pickupAnchorFromUserLocation(
  user: ScenarioLocation,
): ScenarioLocation {
  return { lng: user.lng, lat: user.lat, label: "Current location" };
}

export function hasPickupAnchor(scenario: RobotaxiScenario): boolean {
  return Boolean(
    scenario.pickupAnchorName?.trim() ||
      scenario.pickupAnchorLocation.label?.trim(),
  );
}

export function getPickupAnchorName(scenario: RobotaxiScenario): string {
  return (
    scenario.pickupAnchorName?.trim() ||
    scenario.pickupAnchorLocation.label?.trim() ||
    "Current location"
  );
}

export function hasDropoffAnchor(scenario: RobotaxiScenario): boolean {
  return Boolean(
    scenario.dropoffAnchorName?.trim() || scenario.dropoffLocation.label?.trim(),
  );
}

export function hasDropoffLocation(scenario: RobotaxiScenario): boolean {
  return hasDropoffAnchor(scenario) && hasDropoffCoordinates(scenario);
}

/** User-selected destination POI (building / place name) — separate from roadside drop-off zone */
export function hasValidDropoffPoi(scenario: RobotaxiScenario): boolean {
  const poi = scenario.dropoffAnchorLocation;
  return (
    hasDropoffAnchor(scenario) &&
    Number.isFinite(poi.lng) &&
    Number.isFinite(poi.lat) &&
    (Math.abs(poi.lng) > 1e-6 || Math.abs(poi.lat) > 1e-6)
  );
}

export function hasPickupZoneConfirmed(scenario: RobotaxiScenario): boolean {
  return Boolean(
    scenario.pickupZoneConfirmed &&
      scenario.selectedPickupZone &&
      getPickupZoneCandidates(scenario).some((z) => z.id === scenario.selectedZoneId),
  );
}

export function canRequestRobotaxi(scenario: RobotaxiScenario): boolean {
  return hasPickupZoneConfirmed(scenario) && hasDropoffLocation(scenario);
}

export function hasUserLocation(scenario: RobotaxiScenario): boolean {
  return (
    Number.isFinite(scenario.userCurrentLocation.lng) &&
    Number.isFinite(scenario.userCurrentLocation.lat)
  );
}

export function hasCurrentLocation(scenario: RobotaxiScenario): boolean {
  return hasUserLocation(scenario);
}

export function getSelectedPickupZone(
  scenario: RobotaxiScenario,
): PudoZoneState | null {
  if (scenario.pickupZoneConfirmed && scenario.selectedPickupZone) {
    return scenario.selectedPickupZone;
  }
  return (
    getPickupZoneCandidates(scenario).find((z) => z.id === scenario.selectedZoneId) ??
    scenario.selectedPickupZone ??
    null
  );
}

export function getSelectedDropoffZone(scenario: RobotaxiScenario): PudoZoneState | null {
  return scenario.selectedDropoffZone ?? null;
}

/**
 * Trip / vehicle pickup end — always the roadside zone representative point, never shelteredWaitingPoint.
 * Confirmed trip uses selectedPickupZone; trip-setup preview uses the highlighted candidate zone.
 */
export function getTripOriginCoords(
  scenario: RobotaxiScenario,
  opts?: { confirmedOnly?: boolean },
): [number, number] | null {
  if (opts?.confirmedOnly) {
    if (!scenario.pickupZoneConfirmed || !scenario.selectedPickupZone) return null;
    const c = zoneCoords(scenario.selectedPickupZone);
    return [c.lng, c.lat];
  }

  const zone = getSelectedPickupZone(scenario);
  if (zone) {
    const c = zone.representativePoint ?? zoneCoords(zone);
    return [c.lng, c.lat];
  }

  if (hasPickupAnchor(scenario)) {
    const anchor = getPickupAnchor(scenario);
    return [anchor.lng, anchor.lat];
  }

  return null;
}

/** Dispatch search pulse — user's pick-up anchor / current location, not curb zone rep */
export function getDispatchSearchCenterCoords(
  scenario: RobotaxiScenario,
): [number, number] | null {
  if (!hasPickupZoneConfirmed(scenario)) return null;
  if (!isPickupAnchorDifferentFromCurrentLocation(scenario)) {
    const user = getUserCurrentLocation(scenario);
    return [user.lng, user.lat];
  }
  const anchor = getPickupAnchor(scenario);
  return [anchor.lng, anchor.lat];
}

/** Drop-off end of the driving route — zone representative point, or anchor coords */
export function getTripDestinationCoords(
  scenario: RobotaxiScenario,
): [number, number] | null {
  const zone = scenario.selectedDropoffZone;
  if (zone) {
    const c = zone.representativePoint ?? zoneCoords(zone);
    return [c.lng, c.lat];
  }
  const anchor = scenario.dropoffAnchorLocation;
  if (
    hasDropoffAnchor(scenario) &&
    Number.isFinite(anchor.lng) &&
    Number.isFinite(anchor.lat) &&
    (Math.abs(anchor.lng) > 1e-6 || Math.abs(anchor.lat) > 1e-6)
  ) {
    return [anchor.lng, anchor.lat];
  }
  return null;
}

export function getWalkingRouteOriginCoords(
  scenario: RobotaxiScenario,
): [number, number] {
  if (hasPickupAnchor(scenario)) {
    const anchor = getPickupAnchor(scenario);
    return [anchor.lng, anchor.lat];
  }
  const user = getUserCurrentLocation(scenario);
  return [user.lng, user.lat];
}

export function hasDropoffCoordinates(scenario: RobotaxiScenario): boolean {
  const dest = getTripDestinationCoords(scenario);
  if (dest) return true;
  return (
    hasDropoffAnchor(scenario) &&
    Number.isFinite(scenario.dropoffLocation.lng) &&
    Number.isFinite(scenario.dropoffLocation.lat) &&
    (Math.abs(scenario.dropoffLocation.lng) > 1e-6 ||
      Math.abs(scenario.dropoffLocation.lat) > 1e-6)
  );
}

export function getTripRoute(scenario: RobotaxiScenario) {
  return scenario.tripRoute ?? scenario.tripOverviewRoute;
}

export function getWalkingRouteToPickup(
  scenario: RobotaxiScenario,
): WalkingRouteToPickup | null {
  const route =
    scenario.walkingRouteToPickup ??
    scenario.walkingRouteToSelectedPickup ??
    scenario.walkingRoutes?.[scenario.selectedZoneId];
  return isWalkingRouteToPickup(route) ? route : null;
}

export function getVehicleRouteToPickup(scenario: RobotaxiScenario) {
  return (
    scenario.vehicleRouteToPickup ??
    scenario.vehicleRouteToSelectedPickup ??
    scenario.vehicleRoute
  );
}

export function clearRouteFields(
  _scenario: RobotaxiScenario,
): Pick<
  RobotaxiScenario,
  | "tripRoute"
  | "tripOverviewRoute"
  | "walkingRoutes"
  | "walkingRouteToPickup"
  | "walkingRouteToSelectedPickup"
  | "vehicleRouteToPickup"
  | "vehicleRoute"
  | "vehicleRouteToSelectedPickup"
  | "routesMissing"
  | "routesMessage"
> {
  return {
    tripRoute: undefined,
    tripOverviewRoute: undefined,
    walkingRoutes: undefined,
    walkingRouteToPickup: undefined,
    walkingRouteToSelectedPickup: undefined,
    vehicleRouteToPickup: undefined,
    vehicleRoute: undefined,
    vehicleRouteToSelectedPickup: undefined,
    routesMissing: undefined,
    routesMessage: undefined,
  };
}

export function emptyLocation(): ScenarioLocation {
  return { lng: 0, lat: 0, label: "" };
}

export function emptyDropoff(): ScenarioLocation {
  return emptyLocation();
}
