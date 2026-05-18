import type { FeatureCollection, Geometry, LineString, Polygon } from "geojson";
import { DEMO_SCENARIO, getPickupZone, segmentCenter } from "./demoScenario";
import { pickupZoneTypeFromId } from "./pickupZoneTypes";
import type { PickupZoneId, PudoZoneState, ScenarioLocation } from "./scenarioTypes";

type RoadLayers = {
  roads: FeatureCollection<LineString> | null;
  pudoZones: FeatureCollection<Geometry> | null;
  missing: string[];
};

type PudoZoneSnapshot = {
  zones: PudoZoneState[];
  roadDataMissing: boolean;
  message?: string;
};

type DropoffZoneSnapshot = {
  candidates: PudoZoneState[];
  selected: PudoZoneState | null;
  roadDataMissing: boolean;
  message?: string;
};

const ROAD_LAYER_BASE = "/data/robotaxi-map";

const ZONE_META: Record<
  PickupZoneId,
  {
    label: string;
    bearing: number;
    distanceM: number;
    walkM: number;
    exposureM: number;
    coveredM: number;
    eta: number;
  }
> = {
  closest: {
    label: "Closest Zone",
    bearing: 35,
    distanceM: 58,
    walkM: 55,
    exposureM: 50,
    coveredM: 5,
    eta: 6,
  },
  sheltered: {
    label: "Shelter-adjacent Zone",
    bearing: 258,
    distanceM: 155,
    walkM: 72,
    exposureM: 18,
    coveredM: 54,
    eta: 7,
  },
  soonest: {
    label: "Soonest Zone",
    bearing: 88,
    distanceM: 145,
    walkM: 68,
    exposureM: 36,
    coveredM: 32,
    eta: 4,
  },
};

let roadLayersPromise: Promise<RoadLayers> | null = null;

export function zoneCoords(zone: PudoZoneState): { lng: number; lat: number } {
  return zone.representativePoint ?? { lng: zone.lng, lat: zone.lat };
}

export function preloadRoadLayers(): void {
  void loadRoadLayers();
}

export async function loadRoadLayers(): Promise<RoadLayers> {
  roadLayersPromise ??= loadRoadLayersNow();
  return roadLayersPromise;
}

export async function generatePudoZonesForAnchor(
  anchor: ScenarioLocation,
): Promise<PudoZoneSnapshot> {
  const layers = await loadRoadLayers();
  const zones = buildPickupZones(anchor);
  return {
    zones,
    roadDataMissing: !layers.roads,
    message: layers.roads ? undefined : "Road layer is unavailable; using simulated pickup zones.",
  };
}

export function provisionalDropoffZoneFromAnchor(
  anchor: ScenarioLocation,
): PudoZoneState {
  return buildZone("closest", anchor, {
    label: "Drop-off Zone",
    bearing: 125,
    distanceM: 36,
    walkM: 36,
    exposureM: 28,
    coveredM: 8,
    eta: 0,
  });
}

export async function generateDropoffZoneForAnchor(
  anchor: ScenarioLocation,
): Promise<DropoffZoneSnapshot> {
  const layers = await loadRoadLayers();
  const selected = provisionalDropoffZoneFromAnchor(anchor);
  return {
    candidates: [selected],
    selected,
    roadDataMissing: !layers.roads,
    message: layers.roads ? undefined : "Road layer is unavailable; using simulated drop-off zone.",
  };
}

async function loadRoadLayersNow(): Promise<RoadLayers> {
  const [roads, pudoZones] = await Promise.all([
    fetchLayer<LineString>("base_roads.geojson"),
    fetchLayer<Geometry>("pudo_zones.geojson"),
  ]);
  const missing = [
    roads ? null : "base_roads.geojson",
    pudoZones ? null : "pudo_zones.geojson",
  ].filter((file): file is string => Boolean(file));

  return { roads, pudoZones, missing };
}

async function fetchLayer<T extends Geometry>(
  file: string,
): Promise<FeatureCollection<T> | null> {
  try {
    const res = await fetch(`${ROAD_LAYER_BASE}/${file}`, { cache: "force-cache" });
    if (!res.ok) return null;
    return (await res.json()) as FeatureCollection<T>;
  } catch {
    return null;
  }
}

function buildPickupZones(anchor: ScenarioLocation): PudoZoneState[] {
  const useStaticZones = distanceMeters(anchor, {
    lng: DEMO_SCENARIO.userLocation[0],
    lat: DEMO_SCENARIO.userLocation[1],
  }) < 8;

  return (["closest", "sheltered", "soonest"] as const).map((id) => {
    const meta = ZONE_META[id];
    if (useStaticZones) {
      return buildZoneFromLine(id, getPickupZone(id).segment, meta, anchor);
    }
    return buildZone(id, anchor, meta);
  });
}

function buildZone(
  id: PickupZoneId,
  anchor: ScenarioLocation,
  meta: (typeof ZONE_META)[PickupZoneId],
): PudoZoneState {
  const center = pointAtDistanceMeters(anchor.lng, anchor.lat, meta.distanceM, meta.bearing);
  const lineBearing = meta.bearing + 90;
  const start = pointAtDistanceMeters(center.lng, center.lat, 12, lineBearing + 180);
  const end = pointAtDistanceMeters(center.lng, center.lat, 12, lineBearing);
  return buildZoneFromLine(
    id,
    [
      [start.lng, start.lat],
      [end.lng, end.lat],
    ],
    meta,
    anchor,
  );
}

function buildZoneFromLine(
  id: PickupZoneId,
  segment: [[number, number], [number, number]],
  meta: (typeof ZONE_META)[PickupZoneId],
  anchor: ScenarioLocation,
): PudoZoneState {
  const [lng, lat] = segmentCenter({ segment });
  const line: LineString = { type: "LineString", coordinates: segment };
  const point = { lng, lat };
  return {
    id,
    type: pickupZoneTypeFromId(id),
    label: meta.label,
    geometry: polygonAroundSegment(segment),
    zoneGeometry: polygonAroundSegment(segment),
    centerline: line,
    representativePoint: point,
    lng,
    lat,
    shelteredWaitingPoint:
      id === "sheltered"
        ? {
            ...pointAtDistanceMeters(lng, lat, 34, 225),
            label: "Sheltered waiting area",
          }
        : undefined,
    distanceToShelterM: id === "sheltered" ? 34 : undefined,
    anchorDistanceM: Math.round(distanceMeters(anchor, point)),
    walkM: meta.walkM,
    exposureM: meta.exposureM,
    coveredM: meta.coveredM,
    vehicleEtaMin: meta.eta,
    isSimulated: true,
    isSimulatedShelter: true,
    validity: "assumed_valid_for_demo",
  };
}

function polygonAroundSegment(
  segment: [[number, number], [number, number]],
): Polygon {
  const [[lngA, latA], [lngB, latB]] = segment;
  const centerLat = (latA + latB) / 2;
  const metersPerDegLat = 111_320;
  const metersPerDegLng = metersPerDegLat * Math.cos((centerLat * Math.PI) / 180);
  const dx = (lngB - lngA) * metersPerDegLng;
  const dy = (latB - latA) * metersPerDegLat;
  const len = Math.hypot(dx, dy) || 1;
  const offsetM = 4;
  const offLng = (-dy / len / metersPerDegLng) * offsetM;
  const offLat = (dx / len / metersPerDegLat) * offsetM;
  const ring: [number, number][] = [
    [lngA + offLng, latA + offLat],
    [lngB + offLng, latB + offLat],
    [lngB - offLng, latB - offLat],
    [lngA - offLng, latA - offLat],
    [lngA + offLng, latA + offLat],
  ];
  return { type: "Polygon", coordinates: [ring] };
}

function pointAtDistanceMeters(
  lng: number,
  lat: number,
  distanceM: number,
  bearingDeg: number,
): { lng: number; lat: number } {
  const R = 6_371_000;
  const brng = (bearingDeg * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lng * Math.PI) / 180;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceM / R) +
      Math.cos(lat1) * Math.sin(distanceM / R) * Math.cos(brng),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(distanceM / R) * Math.cos(lat1),
      Math.cos(distanceM / R) - Math.sin(lat1) * Math.sin(lat2),
    );
  return { lng: (lon2 * 180) / Math.PI, lat: (lat2 * 180) / Math.PI };
}

function distanceMeters(
  a: { lng: number; lat: number },
  b: { lng: number; lat: number },
): number {
  const R = 6_371_000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
