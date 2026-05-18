import L from "leaflet";
import type { MapMode } from "./mapModes";
import type { RouteFeatureCollection } from "./loadGeneratedRoutes";
import { routeCoordinates } from "./loadGeneratedRoutes";
import { walkingRouteCoordinates } from "./walkingRouteSegments";
import { isShelterAdjacentZone } from "./pickupZoneTypes";
import { zoneCoords } from "./pudoZoneService";
import {
  getDropoffAnchor,
  getDispatchSearchCenterCoords,
  getPickupAnchor,
  getSelectedDropoffZone,
  hasDropoffAnchor,
  getSelectedPickupZone,
  getTripRoute,
  getUserCurrentLocation,
  getWalkingRouteToPickup,
  getVehicleRouteToPickup,
  hasDropoffCoordinates,
  hasPickupAnchor,
  hasPickupZoneConfirmed,
  isPickupAnchorDifferentFromCurrentLocation,
} from "./scenarioHelpers";
import type { PickupZoneId, PudoZoneState, RobotaxiScenario } from "./scenarioTypes";

export type LonLat = [number, number];

export function toLeafletLatLng(lng: number, lat: number): [number, number] {
  return [lat, lng];
}

function appendRouteCoords(pts: LonLat[], route?: RouteFeatureCollection | null) {
  const coords = routeCoordinates(route ?? null);
  if (!coords) return;
  for (const c of coords) pts.push([c[0], c[1]]);
}

function appendZoneGeometry(pts: LonLat[], zone: PudoZoneState) {
  if (isShelterAdjacentZone(zone) && zone.shelteredWaitingPoint) {
    const s = zone.shelteredWaitingPoint;
    pts.push([s.lng, s.lat]);
  }
  const ring = zone.geometry.coordinates[0];
  if (ring?.length) {
    for (const c of ring) pts.push([c[0]!, c[1]!]);
    return;
  }
  for (const c of zone.centerline.coordinates) {
    pts.push([c[0]!, c[1]!]);
  }
}

export function getScenarioMapPoints(
  mode: MapMode,
  scenario: RobotaxiScenario,
  options?: { dropoffReady?: boolean },
): LonLat[] {
  const user = getUserCurrentLocation(scenario);
  const anchor = hasPickupAnchor(scenario)
    ? getPickupAnchor(scenario)
    : user;
  const selectedPickup = getSelectedPickupZone(scenario);
  const selectedDropoff = getSelectedDropoffZone(scenario);
  const dropoffReady =
    options?.dropoffReady ?? hasDropoffCoordinates(scenario);

  if (mode === "choosePickup") {
    const pts: LonLat[] = [[anchor.lng, anchor.lat]];
    if (isPickupAnchorDifferentFromCurrentLocation(scenario)) {
      pts.push([user.lng, user.lat]);
    }
    for (const z of scenario.pickupZoneCandidates) {
      appendZoneGeometry(pts, z);
    }
    return pts;
  }

  if (mode === "tripSetup" && dropoffReady && selectedPickup) {
    const pts: LonLat[] = [];
    const pickup = zoneCoords(selectedPickup);
    pts.push([pickup.lng, pickup.lat]);
    if (hasDropoffAnchor(scenario)) {
      const poi = getDropoffAnchor(scenario);
      pts.push([poi.lng, poi.lat]);
    }
    if (selectedDropoff) {
      appendZoneGeometry(pts, selectedDropoff);
      const drop = zoneCoords(selectedDropoff);
      pts.push([drop.lng, drop.lat]);
    } else {
      pts.push([scenario.dropoffLocation.lng, scenario.dropoffLocation.lat]);
    }
    appendRouteCoords(pts, getTripRoute(scenario));
    return pts;
  }

  if (
    mode === "tripSetup" &&
    !dropoffReady &&
    hasPickupZoneConfirmed(scenario) &&
    selectedPickup
  ) {
    const pts: LonLat[] = [[user.lng, user.lat]];
    if (isPickupAnchorDifferentFromCurrentLocation(scenario)) {
      pts.push([anchor.lng, anchor.lat]);
    }
    appendZoneGeometry(pts, selectedPickup);
    const pickup = zoneCoords(selectedPickup);
    pts.push([pickup.lng, pickup.lat]);
    const walkRoute = getWalkingRouteToPickup(scenario);
    const walkCoords = walkingRouteCoordinates(walkRoute);
    if (walkCoords) {
      for (const c of walkCoords) pts.push([c[0], c[1]]);
    }
    return pts;
  }

  if (mode === "tripSetup") {
    return [[user.lng, user.lat]];
  }

  if (mode === "serviceStatus") {
    const searchCenter = getDispatchSearchCenterCoords(scenario);
    if (!searchCenter) return [[anchor.lng, anchor.lat]];
    const [lng, lat] = searchCenter;
    const pad = 0.0028;
    return [
      [lng, lat],
      [lng + pad, lat + pad],
      [lng - pad, lat - pad],
      [lng + pad, lat - pad],
      [lng - pad, lat + pad],
    ];
  }

  if (mode === "robotaxiOnTheWay" && selectedPickup) {
    const pts: LonLat[] = [];
    if (isPickupAnchorDifferentFromCurrentLocation(scenario)) {
      pts.push([anchor.lng, anchor.lat]);
    }
    const pickup = zoneCoords(selectedPickup);
    pts.push([pickup.lng, pickup.lat]);
    appendZoneGeometry(pts, selectedPickup);
    if (selectedDropoff) {
      const drop = zoneCoords(selectedDropoff);
      pts.push([drop.lng, drop.lat]);
    }
    if (scenario.vehicleLocation) {
      pts.push([scenario.vehicleLocation.lng, scenario.vehicleLocation.lat]);
    }
    const walkRoute = getWalkingRouteToPickup(scenario);
    const walkCoords = walkingRouteCoordinates(walkRoute);
    if (walkCoords) {
      for (const c of walkCoords) pts.push([c[0], c[1]]);
    }
    appendRouteCoords(pts, getVehicleRouteToPickup(scenario));
    return pts;
  }

  return [[anchor.lng, anchor.lat]];
}

export function fitMapToScenarioPoints(
  map: L.Map,
  points: LonLat[],
  sheetCoverPct: number,
  options?: { animate?: boolean; maxZoom?: number },
): void {
  if (points.length === 0) return;
  const size = map.getSize();
  if (size.x <= 0 || size.y <= 0) return;

  const latlngs = points.map(([lng, lat]) => L.latLng(lat, lng));
  if (latlngs.length === 1) {
    const clampedSheet = Math.min(0.92, Math.max(0, sheetCoverPct));
    const mapCenterPx = size.divideBy(2);
    const targetPoint = L.point(mapCenterPx.x, (size.y * (1 - clampedSheet)) / 2);
    const centerOffset = targetPoint.subtract(mapCenterPx);
    const p = map.project(latlngs[0]!, map.getZoom()).subtract(centerOffset);
    map.setView(map.unproject(p, map.getZoom()), Math.min(map.getZoom(), 17), {
      animate: options?.animate ?? true,
    });
    return;
  }

  const bounds = L.latLngBounds(latlngs);
  const padSide = 28;
  const padBottom = Math.round(size.y * Math.min(0.92, Math.max(0, sheetCoverPct))) + 36;
  map.fitBounds(bounds, {
    paddingTopLeft: L.point(padSide, padSide),
    paddingBottomRight: L.point(padSide, padBottom),
    maxZoom: options?.maxZoom ?? 17,
    animate: options?.animate ?? true,
  });
}

export function centerMapOnCurrent(
  map: L.Map,
  scenario: RobotaxiScenario,
  sheetCoverPct: number,
  options?: { zoom?: number; animate?: boolean },
): void {
  const zoom = options?.zoom ?? 16;
  const size = map.getSize();
  if (size.x <= 0 || size.y <= 0) return;

  const user = getUserCurrentLocation(scenario);
  const userLatLng = L.latLng(user.lat, user.lng);
  const clampedSheet = Math.min(0.92, Math.max(0, sheetCoverPct));
  const mapCenterPx = size.divideBy(2);
  const targetPoint = L.point(mapCenterPx.x, (size.y * (1 - clampedSheet)) / 2);
  const centerOffset = targetPoint.subtract(mapCenterPx);
  const centerPx = map.project(userLatLng, zoom).subtract(centerOffset);
  map.setView(map.unproject(centerPx, zoom), zoom, {
    animate: options?.animate ?? true,
  });
}

export function getPickupZoneById(
  scenario: RobotaxiScenario,
  id: PickupZoneId,
) {
  return scenario.pickupZoneCandidates.find((z) => z.id === id);
}
