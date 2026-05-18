import type { FeatureCollection, LineString } from "geojson";
import { isShelterAdjacentZone } from "./pickupZoneTypes";
import { distanceMeters } from "./randomScenario";
import type {
  PickupZoneId,
  PudoZoneState,
  ScenarioLocation,
  WalkingRouteSegment,
  WalkingRouteToPickup,
} from "./scenarioTypes";

type LonLat = [number, number];

const ZONE_EXPOSURE_PROFILE: Record<
  PickupZoneId,
  { coveredM: number; exposureM: number }
> = {
  closest: { coveredM: 5, exposureM: 40 },
  sheltered: { coveredM: 45, exposureM: 15 },
  soonest: { coveredM: 30, exposureM: 30 },
};

function routeCoordinatesFromCollection(
  fc: FeatureCollection<LineString> | null | undefined,
): LonLat[] | null {
  const coords = fc?.features?.[0]?.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;
  return coords as LonLat[];
}

function polylineLengthM(coords: LonLat[]): number {
  let sum = 0;
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1]!;
    const b = coords[i]!;
    sum += distanceMeters(
      { lng: a[0], lat: a[1] },
      { lng: b[0], lat: b[1] },
    );
  }
  return sum;
}

function interpolateAtDistance(coords: LonLat[], targetM: number): LonLat {
  if (targetM <= 0) return [...coords[0]!];
  let acc = 0;
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1]!;
    const b = coords[i]!;
    const seg = distanceMeters(
      { lng: a[0], lat: a[1] },
      { lng: b[0], lat: b[1] },
    );
    if (acc + seg >= targetM) {
      const t = seg > 0 ? (targetM - acc) / seg : 0;
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
      ];
    }
    acc += seg;
  }
  return [...coords[coords.length - 1]!];
}

function slicePolyline(coords: LonLat[], startM: number, endM: number): LonLat[] {
  if (endM <= startM) return [];
  const startPt = interpolateAtDistance(coords, startM);
  const endPt = interpolateAtDistance(coords, endM);
  const inner: LonLat[] = [startPt];
  let acc = 0;
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1]!;
    const b = coords[i]!;
    const seg = distanceMeters(
      { lng: a[0], lat: a[1] },
      { lng: b[0], lat: b[1] },
    );
    const segStart = acc;
    const segEnd = acc + seg;
    if (segEnd > startM && segStart < endM) {
      if (
        segStart >= startM &&
        segEnd <= endM &&
        (inner.length === 0 ||
          inner[inner.length - 1]![0] !== a[0] ||
          inner[inner.length - 1]![1] !== a[1])
      ) {
        inner.push([...a]);
      }
      if (segEnd > endM) break;
      if (segEnd <= endM) inner.push([...b]);
    }
    acc = segEnd;
    if (acc >= endM) break;
  }
  const last = inner[inner.length - 1];
  if (!last || last[0] !== endPt[0] || last[1] !== endPt[1]) {
    inner.push(endPt);
  }
  return inner.length >= 2 ? inner : [startPt, endPt];
}

function makeSegment(
  id: string,
  type: WalkingRouteSegment["segmentType"],
  coords: LonLat[],
): WalkingRouteSegment | null {
  if (coords.length < 2) return null;
  const geometry: LineString = { type: "LineString", coordinates: coords };
  return {
    segmentId: id,
    segmentType: type,
    geometry,
    distanceM: Math.round(polylineLengthM(coords)),
    isSimulated: true,
  };
}

function distanceAlongPolylineToPoint(coords: LonLat[], point: { lng: number; lat: number }): number {
  let bestAlong = 0;
  let bestDist = Infinity;
  let acc = 0;
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1]!;
    const b = coords[i]!;
    const seg = distanceMeters(
      { lng: a[0], lat: a[1], label: "" },
      { lng: b[0], lat: b[1], label: "" },
    );
    const mid = { lng: (a[0] + b[0]) / 2, lat: (a[1] + b[1]) / 2, label: "" };
    const d = distanceMeters(mid, point);
    if (d < bestDist) {
      bestDist = d;
      bestAlong = acc + seg / 2;
    }
    acc += seg;
  }
  return bestAlong;
}

/**
 * Shelter-adjacent: split ORS foot path at sheltered waiting point and boarding zone (along roads).
 */
function segmentShelterAdjacentWalkingRoute(
  zone: PudoZoneState,
  anchor: ScenarioLocation,
  orsCoords: LonLat[] | null,
): WalkingRouteToPickup | null {
  const shelter = zone.shelteredWaitingPoint;
  const board = zone.representativePoint;
  if (!shelter) return null;

  if (!orsCoords || orsCoords.length < 2) {
    return null;
  }

  const totalLen = polylineLengthM(orsCoords);
  const shelterAlong = distanceAlongPolylineToPoint(orsCoords, shelter);
  const boardAlong = Math.max(
    shelterAlong + 4,
    Math.min(totalLen, distanceAlongPolylineToPoint(orsCoords, board)),
  );

  const coveredCoords = slicePolyline(orsCoords, 0, Math.max(shelterAlong, 6));
  const exposedCoords = slicePolyline(
    orsCoords,
    Math.min(shelterAlong, totalLen - 4),
    Math.max(boardAlong, shelterAlong + 4),
  );

  const segments: WalkingRouteSegment[] = [];
  const coveredSeg = makeSegment(`${zone.id}-covered`, "covered", coveredCoords);
  const exposedSeg = makeSegment(`${zone.id}-exposed`, "exposed", exposedCoords);
  if (coveredSeg) segments.push(coveredSeg);
  if (exposedSeg) segments.push(exposedSeg);
  if (segments.length === 0) return null;

  const totalWalkM = segments.reduce((n, s) => n + s.distanceM, 0);
  const totalCoveredM = segments
    .filter((s) => s.segmentType === "covered")
    .reduce((n, s) => n + s.distanceM, 0);
  const totalExposedM = segments
    .filter((s) => s.segmentType === "exposed")
    .reduce((n, s) => n + s.distanceM, 0);

  return {
    segments,
    isSimulatedExposure: true,
    totalWalkM,
    totalCoveredM,
    totalExposedM,
  };
}

/**
 * Closest / soonest: exposed from anchor, covered near roadside boarding zone.
 */
function segmentDirectWalkingRoute(
  route: FeatureCollection<LineString> | null | undefined,
  zoneId: PickupZoneId,
  profile?: { coveredM: number; exposureM: number },
): WalkingRouteToPickup | null {
  const coords = routeCoordinatesFromCollection(route);
  if (!coords) return null;

  const totalLen = polylineLengthM(coords);
  if (totalLen < 2) return null;

  const targets = profile ?? ZONE_EXPOSURE_PROFILE[zoneId];
  const targetSum = targets.coveredM + targets.exposureM;
  const coveredTarget = Math.min(
    totalLen * 0.92,
    totalLen * (targets.coveredM / targetSum),
  );
  const exposedTarget = Math.min(totalLen - 1, totalLen - coveredTarget);

  let coveredLen = coveredTarget;
  let exposedLen = exposedTarget;

  if (zoneId === "closest") {
    exposedLen = Math.min(totalLen * 0.88, Math.max(exposedTarget, totalLen * 0.75));
    coveredLen = totalLen - exposedLen;
  } else {
    coveredLen = totalLen * 0.5;
    exposedLen = totalLen - coveredLen;
  }

  coveredLen = Math.max(2, Math.min(totalLen - 2, coveredLen));
  exposedLen = totalLen - coveredLen;

  const exposedCoords = slicePolyline(coords, 0, exposedLen);
  const coveredCoords = slicePolyline(coords, exposedLen, totalLen);

  const segments: WalkingRouteSegment[] = [];
  const exposedSeg = makeSegment(`${zoneId}-exposed`, "exposed", exposedCoords);
  const coveredSeg = makeSegment(`${zoneId}-covered`, "covered", coveredCoords);
  if (exposedSeg) segments.push(exposedSeg);
  if (coveredSeg) segments.push(coveredSeg);

  if (segments.length === 0) return null;

  return {
    segments,
    isSimulatedExposure: true,
    totalWalkM: Math.round(totalLen),
    totalCoveredM: segments
      .filter((s) => s.segmentType === "covered")
      .reduce((n, s) => n + s.distanceM, 0),
    totalExposedM: segments
      .filter((s) => s.segmentType === "exposed")
      .reduce((n, s) => n + s.distanceM, 0),
  };
}

export function segmentWalkingRoute(
  route: FeatureCollection<LineString> | WalkingRouteToPickup | null | undefined,
  zoneId: PickupZoneId,
  profile?: { coveredM: number; exposureM: number },
  options?: { zone?: PudoZoneState; anchor?: ScenarioLocation },
): WalkingRouteToPickup | null {
  if (route && "segments" in route && route.segments.length > 0) {
    return route;
  }

  const zone = options?.zone;
  const anchor = options?.anchor;
  const orsCoords = routeCoordinatesFromCollection(
    route as FeatureCollection<LineString> | null | undefined,
  );

  if (zone && anchor && isShelterAdjacentZone(zone) && zone.shelteredWaitingPoint) {
    const shelterRoute = segmentShelterAdjacentWalkingRoute(zone, anchor, orsCoords);
    if (shelterRoute) return shelterRoute;
  }

  return segmentDirectWalkingRoute(
    route as FeatureCollection<LineString> | null | undefined,
    zoneId,
    profile,
  );
}

export function segmentWalkingRoutesForScenario(
  walkingRoutes: Partial<Record<PickupZoneId, FeatureCollection<LineString>>> | undefined,
  zones: PudoZoneState[],
  anchor?: ScenarioLocation,
): Partial<Record<PickupZoneId, WalkingRouteToPickup>> {
  const out: Partial<Record<PickupZoneId, WalkingRouteToPickup>> = {};
  const ids: PickupZoneId[] = ["closest", "sheltered", "soonest"];

  for (const id of ids) {
    const raw = walkingRoutes?.[id];
    const zone = zones.find((z) => z.id === id);
    const profile = zone
      ? { coveredM: zone.coveredM, exposureM: zone.exposureM }
      : undefined;
    const segmented = segmentWalkingRoute(raw, id, profile, { zone, anchor });
    if (segmented) out[id] = segmented;
  }
  return out;
}

/** Sync zone walk / exposure card values from segmented route totals */
export function syncZoneExposureFromWalkingRoutes(
  zones: PudoZoneState[],
  walkingRoutes: Partial<Record<PickupZoneId, WalkingRouteToPickup>>,
): PudoZoneState[] {
  return zones.map((zone) => {
    const route = walkingRoutes[zone.id];
    if (!route?.segments.length) return zone;
    const coveredM = route.totalCoveredM ?? 0;
    const exposureM = route.totalExposedM ?? 0;
    const walkM = route.totalWalkM ?? coveredM + exposureM;
    return {
      ...zone,
      walkM: Math.round(walkM),
      coveredM: Math.round(coveredM),
      exposureM: Math.round(exposureM),
    };
  });
}

export function isWalkingRouteToPickup(
  value: unknown,
): value is WalkingRouteToPickup {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    "segments" in (value as WalkingRouteToPickup) &&
    Array.isArray((value as WalkingRouteToPickup).segments)
  );
}

export function walkingRouteCoordinates(
  route: WalkingRouteToPickup | FeatureCollection<LineString> | null | undefined,
): LonLat[] | null {
  if (isWalkingRouteToPickup(route)) {
    const coords: LonLat[] = [];
    for (const seg of route.segments) {
      const c = seg.geometry.coordinates as LonLat[];
      if (coords.length === 0) {
        coords.push(...c);
      } else {
        coords.push(...c.slice(1));
      }
    }
    return coords.length >= 2 ? coords : null;
  }
  return routeCoordinatesFromCollection(route as FeatureCollection<LineString> | null);
}
