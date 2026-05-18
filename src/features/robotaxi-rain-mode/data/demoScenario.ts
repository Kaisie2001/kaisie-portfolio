import type { MapMode, PickupZoneId } from "./mapModes";

/** GeoJSON order: [longitude, latitude] */
export type LonLat = [number, number];

/** Short curbside segment — two endpoints, [lon, lat] each */
export type PickupZoneSegment = {
  /** Replace with final demo coordinates later. */
  segment: [LonLat, LonLat];
};

export const DEMO_SCENARIO = {
  /** Replace with final demo coordinates later. */
  userLocation: [113.93345, 22.52015] as LonLat,

  /** Replace with final demo coordinates later. */
  dropoffLocation: [113.9312, 22.5188] as LonLat,

  /** Replace with final demo coordinates later. */
  closestPickupZone: {
    segment: [
      [113.9331298, 22.5205835],
      [113.9333698, 22.5206635],
    ],
  } satisfies PickupZoneSegment,

  /** Replace with final demo coordinates later. */
  shelteredPickupZone: {
    segment: [
      [113.9317518, 22.5201293],
      [113.9319918, 22.5202093],
    ],
  } satisfies PickupZoneSegment,

  /** Replace with final demo coordinates later. */
  soonestPickupZone: {
    segment: [
      [113.9348083, 22.5201372],
      [113.9350483, 22.5202172],
    ],
  } satisfies PickupZoneSegment,

  /** Replace with final demo coordinates later. */
  vehicleStartLocation: [113.9362, 22.5218] as LonLat,
} as const;

export const PICKUP_ZONE_COLORS: Record<PickupZoneId, string> = {
  closest: "#e53935",
  sheltered: "#34a853",
  soonest: "#f5a623",
};

/** Leaflet uses [latitude, longitude] */
export function toLeafletLatLng([lon, lat]: LonLat): [number, number] {
  return [lat, lon];
}

export function segmentCenter(zone: PickupZoneSegment): LonLat {
  const [[lonA, latA], [lonB, latB]] = zone.segment;
  return [(lonA + lonB) / 2, (latA + latB) / 2];
}

export function getPickupZone(
  id: PickupZoneId,
): PickupZoneSegment & { id: PickupZoneId } {
  const zones = {
    closest: DEMO_SCENARIO.closestPickupZone,
    sheltered: DEMO_SCENARIO.shelteredPickupZone,
    soonest: DEMO_SCENARIO.soonestPickupZone,
  } as const;
  return { id, ...zones[id] };
}

export const PICKUP_ZONE_IDS: PickupZoneId[] = ["closest", "sheltered", "soonest"];

/** Collect [lon, lat] points to frame the map for a given screen mode */
export function getScenarioPoints(
  mode: MapMode,
  selectedZoneId: PickupZoneId = "sheltered",
): LonLat[] {
  const points: LonLat[] = [DEMO_SCENARIO.userLocation];

  if (mode === "tripSetup" || mode === "serviceStatus") {
    points.push(DEMO_SCENARIO.dropoffLocation);
  }

  if (mode === "choosePickup") {
    for (const id of PICKUP_ZONE_IDS) {
      points.push(...getPickupZone(id).segment);
    }
  }

  if (mode === "robotaxiOnTheWay") {
    points.push(...getPickupZone(selectedZoneId).segment);
    points.push(DEMO_SCENARIO.vehicleStartLocation);
  }

  return points;
}

/** Stable map anchor — current location stays near viewport center across screens */
export function getStableMapView(): { center: [number, number]; zoom: number } {
  return {
    center: toLeafletLatLng(DEMO_SCENARIO.userLocation),
    zoom: 16,
  };
}

/** [lat, lon] center for Leaflet setView */
export function getScenarioCenter(
  mode: MapMode,
  selectedZoneId: PickupZoneId = "sheltered",
): [number, number] {
  const pts = getScenarioPoints(mode, selectedZoneId);
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const [lon, lat] of pts) {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  return [(minLat + maxLat) / 2, (minLon + maxLon) / 2];
}
