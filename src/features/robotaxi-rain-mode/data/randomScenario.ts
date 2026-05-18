import { clampToDemoServiceArea, DEMO_SERVICE_AREA, isInsideDemoServiceArea } from "./demoServiceArea";
import { randomDropoffPlaceLabel, randomPickupPlaceLabel } from "./demoPlaceNames";
import { zoneCoords } from "./pudoZoneService";
import type { PickupZoneId, PudoZoneState, RobotaxiScenario, ScenarioLocation } from "./scenarioTypes";

/** Deterministic demo RNG — stable across reloads for the same step count */
export function createSeededRandom(seed = 42): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let rng = createSeededRandom(42);

export function resetScenarioRandomSeed(seed = 42): void {
  rng = createSeededRandom(seed);
}

/** Uses demo RNG — call after scenario actions for consistent naming */
export function nextRandomDropoffPlaceLabel(): string {
  return randomDropoffPlaceLabel(rng);
}

function randomInRange(min: number, max: number): number {
  return min + rng() * (max - min);
}

function randomBearing(): number {
  return randomInRange(0, 360);
}

/** Haversine distance in meters */
export function distanceMeters(
  a: { lng: number; lat: number },
  b: { lng: number; lat: number },
): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Destination point at distance (m) and bearing (deg) from origin */
export function pointAtDistanceMeters(
  lng: number,
  lat: number,
  distanceM: number,
  bearingDeg: number,
): [number, number] {
  const R = 6371000;
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
  return clampToDemoServiceArea((lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI);
}

export function randomCurrentInServiceArea(): ScenarioLocation {
  const lng = randomInRange(DEMO_SERVICE_AREA.minLng, DEMO_SERVICE_AREA.maxLng);
  const lat = randomInRange(DEMO_SERVICE_AREA.minLat, DEMO_SERVICE_AREA.maxLat);
  const [clng, clat] = clampToDemoServiceArea(lng, lat);
  const outside = !isInsideDemoServiceArea(clng, clat);
  const label = randomPickupPlaceLabel(rng);
  return {
    lng: clng,
    lat: clat,
    label: outside ? `${label} (demo area)` : label,
  };
}

export function randomDropoffFromCurrent(
  current: ScenarioLocation,
  minM = 800,
  maxM = 4000,
): ScenarioLocation {
  let attempts = 0;
  while (attempts < 40) {
    const dist = randomInRange(minM, maxM);
    const bearing = randomBearing();
    const [lng, lat] = pointAtDistanceMeters(current.lng, current.lat, dist, bearing);
    if (isInsideDemoServiceArea(lng, lat)) {
      return {
        lng,
        lat,
        label: randomDropoffPlaceLabel(rng),
      };
    }
    attempts += 1;
  }
  const [lng, lat] = pointAtDistanceMeters(current.lng, current.lat, 1200, 135);
  return { lng, lat, label: randomDropoffPlaceLabel(rng) };
}

const ZONE_META: Record<
  PickupZoneId,
  { label: string; minM: number; maxM: number; walkM: number; exposureM: number; coveredM: number; eta: number }
> = {
  closest: {
    label: "Closest Zone",
    minM: 40,
    maxM: 60,
    walkM: 45,
    exposureM: 40,
    coveredM: 5,
    eta: 6,
  },
  sheltered: {
    label: "Shelter-adjacent Zone",
    minM: 55,
    maxM: 80,
    walkM: 60,
    exposureM: 15,
    coveredM: 45,
    eta: 7,
  },
  soonest: {
    label: "Soonest Zone",
    minM: 60,
    maxM: 100,
    walkM: 65,
    exposureM: 30,
    coveredM: 30,
    eta: 4,
  },
};

/** Simulated representative zone points near current location — not official pickup points */
/** @deprecated use generatePudoZonesForAnchor from pudoZoneService */
export function generatePickupZonesNear(current: ScenarioLocation): PudoZoneState[] {
  const ids: PickupZoneId[] = ["closest", "sheltered", "soonest"];
  const bearings: number[] = [];
  return ids.map((id): PudoZoneState => {
    const meta = ZONE_META[id];
    let bearing = randomBearing();
    let guard = 0;
    while (bearings.some((b) => Math.abs(b - bearing) < 35) && guard < 12) {
      bearing = randomBearing();
      guard += 1;
    }
    bearings.push(bearing);
    const dist = randomInRange(meta.minM, meta.maxM);
    const [lng, lat] = pointAtDistanceMeters(current.lng, current.lat, dist, bearing);
    return {
      id,
      label: meta.label,
      lng,
      lat,
      walkM: meta.walkM,
      exposureM: meta.exposureM,
      coveredM: meta.coveredM,
      vehicleEtaMin: meta.eta,
    } as PudoZoneState;
  });
}

export function generateVehicleNearZone(
  zone: PudoZoneState,
  current: ScenarioLocation,
): ScenarioLocation {
  const rep = zoneCoords(zone);
  const [lng, lat] = pointAtDistanceMeters(rep.lng, rep.lat, randomInRange(350, 650), randomBearing());
  return {
    lng,
    lat,
    label: "Robotaxi",
  };
}

export function parseLngLatInput(raw: string): { lng: number; lat: number } | null {
  const cleaned = raw.trim().replace(/\s+/g, " ");
  const parts = cleaned.split(/[,;\s]+/).filter(Boolean);
  if (parts.length < 2) return null;
  const lng = Number(parts[0]);
  const lat = Number(parts[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
  const [clng, clat] = clampToDemoServiceArea(lng, lat);
  return { lng: clng, lat: clat };
}

export function formatLngLat(lng: number, lat: number): string {
  return `${lng.toFixed(5)}, ${lat.toFixed(5)}`;
}

export function applyLocationFromInput(
  base: ScenarioLocation,
  raw: string,
  fallbackLabel: string,
): ScenarioLocation | null {
  const parsed = parseLngLatInput(raw);
  if (!parsed) return null;
  const outside = !isInsideDemoServiceArea(parsed.lng, parsed.lat);
  return {
    lng: parsed.lng,
    lat: parsed.lat,
    label: outside ? `${fallbackLabel} (clamped to demo area)` : fallbackLabel,
  };
}

export function regenerateScenarioTrip(
  prev: RobotaxiScenario,
  mode: "current" | "dropoff" | "full",
): RobotaxiScenario {
  const current =
    mode === "dropoff" ? prev.userCurrentLocation : randomCurrentInServiceArea();
  const dropoff =
    mode === "current"
      ? prev.dropoffLocation
      : randomDropoffFromCurrent(current);
  const pickupZones = generatePickupZonesNear(current);
  const selected = prev.selectedZoneId ?? "sheltered";
  const zone = pickupZones.find((z) => z.id === selected) ?? pickupZones[1];
  return {
    ...prev,
    userCurrentLocation: current,
    pickupAnchorLocation: current,
    dropoffLocation: dropoff,
    pickupZoneCandidates: pickupZones,
    dropoffAnchorLocation: dropoff,
    dropoffZoneCandidates: [],
    selectedDropoffZone: null,
    selectedZoneId: selected,
    vehicleLocation: generateVehicleNearZone(zone!, current),
    tripOverviewRoute: undefined,
    walkingRoutes: undefined,
    vehicleRoute: undefined,
    routesMissing: undefined,
    routesMessage: undefined,
  };
}
