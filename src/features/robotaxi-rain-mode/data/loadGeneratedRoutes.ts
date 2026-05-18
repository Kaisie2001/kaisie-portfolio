import type { FeatureCollection, LineString } from "geojson";
import type { PickupZoneId } from "./mapModes";

const BASE = "/data/robotaxi-map/generated";

export type RouteFeatureCollection = FeatureCollection<LineString>;

export type GeneratedRoutes = {
  walkingClosest: RouteFeatureCollection | null;
  walkingSheltered: RouteFeatureCollection | null;
  walkingSoonest: RouteFeatureCollection | null;
  vehicleToSheltered: RouteFeatureCollection | null;
  tripOverview: RouteFeatureCollection | null;
  missing: string[];
};

const ROUTE_FILES: { key: keyof Omit<GeneratedRoutes, "missing">; file: string }[] = [
  { key: "walkingClosest", file: "walking_route_closest.geojson" },
  { key: "walkingSheltered", file: "walking_route_sheltered.geojson" },
  { key: "walkingSoonest", file: "walking_route_soonest.geojson" },
  { key: "vehicleToSheltered", file: "vehicle_route_to_sheltered.geojson" },
  { key: "tripOverview", file: "trip_overview_route.geojson" },
];

async function fetchRoute(path: string): Promise<RouteFeatureCollection | null> {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) return null;
    const data = (await res.json()) as RouteFeatureCollection;
    const geom = data.features?.[0]?.geometry;
    if (geom?.type !== "LineString" || geom.coordinates.length < 2) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Loads pre-generated ORS route GeoJSON from public/data/robotaxi-map/generated/.
 * Missing files are listed in `missing` — callers should degrade gracefully.
 */
export async function loadGeneratedRoutes(): Promise<GeneratedRoutes> {
  const missing: string[] = [];
  const out = {} as Omit<GeneratedRoutes, "missing">;

  await Promise.all(
    ROUTE_FILES.map(async ({ key, file }) => {
      const data = await fetchRoute(`${BASE}/${file}`);
      if (!data) {
        missing.push(file);
        out[key] = null;
      } else {
        out[key] = data;
      }
    }),
  );

  return { ...out, missing };
}

export function getWalkingRouteForZone(
  routes: GeneratedRoutes,
  zoneId: PickupZoneId,
): RouteFeatureCollection | null {
  switch (zoneId) {
    case "closest":
      return routes.walkingClosest;
    case "sheltered":
      return routes.walkingSheltered;
    case "soonest":
      return routes.walkingSoonest;
  }
}

/** Lon/lat points along the first LineString in the collection */
export function routeCoordinates(
  fc: RouteFeatureCollection | null,
): [number, number][] | null {
  const coords = fc?.features?.[0]?.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;
  return coords as [number, number][];
}

/** Pick a point along the route for the vehicle marker (lon, lat) */
export function pointAlongRoute(
  coords: [number, number][],
  fraction = 0.55,
): [number, number] {
  return pointAndBearingAlongRoute(coords, fraction).point;
}

/** Bearing in degrees (0 = north, clockwise) for map marker rotation */
export function bearingDegrees(
  from: [number, number],
  to: [number, number],
): number {
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const lat1r = (lat1 * Math.PI) / 180;
  const lat2r = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2r);
  const x =
    Math.cos(lat1r) * Math.sin(lat2r) -
    Math.sin(lat1r) * Math.cos(lat2r) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Interpolated position + heading toward route end (pickup) */
export function pointAndBearingAlongRoute(
  coords: [number, number][],
  fraction = 0.22,
): { point: [number, number]; bearing: number } {
  if (coords.length < 2) {
    const c = coords[0] ?? [0, 0];
    return { point: c, bearing: 0 };
  }
  const total = coords.length - 1;
  const pos = Math.min(0.92, Math.max(0, fraction)) * total;
  const idx = Math.min(total - 1, Math.max(0, Math.floor(pos)));
  const t = pos - idx;
  const a = coords[idx]!;
  const b = coords[idx + 1]!;
  const point: [number, number] = [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
  return { point, bearing: bearingDegrees(a, b) };
}

function coordDistanceM(
  a: [number, number],
  b: { lng: number; lat: number },
): number {
  const R = 6371000;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const dLat = ((b.lat - a[1]) * Math.PI) / 180;
  const dLon = ((b.lng - a[0]) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Keep a single LineString feature for clean map rendering */
export function primaryLineStringRoute(
  fc: RouteFeatureCollection | null,
): RouteFeatureCollection | null {
  if (!fc?.features?.length) return null;
  let best: (typeof fc.features)[0] | null = null;
  let bestLen = 0;
  for (const f of fc.features) {
    if (f.geometry?.type !== "LineString") continue;
    const n = f.geometry.coordinates.length;
    if (n > bestLen) {
      bestLen = n;
      best = f;
    }
  }
  if (!best || best.geometry?.type !== "LineString" || best.geometry.coordinates.length < 2) {
    return null;
  }
  return { type: "FeatureCollection", features: [best] };
}

/** Ensure polyline runs from vehicle start toward pickup destination */
export function orientRouteFromVehicleToPickup(
  coords: [number, number][],
  vehicle: { lng: number; lat: number } | null | undefined,
  pickup: { lng: number; lat: number } | null | undefined,
): [number, number][] {
  if (coords.length < 2 || !pickup) return coords;
  const first = coords[0]!;
  const last = coords[coords.length - 1]!;
  const dFirstP = coordDistanceM(first, pickup);
  const dLastP = coordDistanceM(last, pickup);

  let forwardScore = dLastP;
  let reverseScore = dFirstP;
  if (vehicle) {
    forwardScore = coordDistanceM(first, vehicle) + dLastP;
    reverseScore = coordDistanceM(last, vehicle) + dFirstP;
  }

  if (reverseScore + 8 < forwardScore) return [...coords].reverse();
  return coords;
}

function closestPointOnSegment(
  point: [number, number],
  a: [number, number],
  b: [number, number],
): [number, number] {
  const [px, py] = point;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-12) return a;
  const t = Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return [ax + dx * t, ay + dy * t];
}

function pointOnSegment(
  a: [number, number],
  b: [number, number],
  t: number,
): [number, number] {
  const clamped = Math.min(1, Math.max(0, t));
  return [
    a[0] + (b[0] - a[0]) * clamped,
    a[1] + (b[1] - a[1]) * clamped,
  ];
}

function cumulativeRouteDistances(coords: [number, number][]): number[] {
  const cum: number[] = [0];
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1]!;
    const cur = coords[i]!;
    cum.push(
      cum[i - 1]! +
        coordDistanceM(prev, { lng: cur[0], lat: cur[1] }),
    );
  }
  return cum;
}

/** Position + tangent along polyline by arc-length fraction (0 = route tail) */
export function pointAndBearingAlongRouteByDistance(
  coords: [number, number][],
  fraction = 0.05,
): { point: [number, number]; bearing: number } {
  if (coords.length < 2) {
    const c = coords[0] ?? [0, 0];
    return { point: c, bearing: 0 };
  }

  const cum = cumulativeRouteDistances(coords);
  const total = cum[cum.length - 1] ?? 0;
  if (total <= 0) {
    return { point: coords[0]!, bearing: bearingDegrees(coords[0]!, coords[1]!) };
  }

  const target = total * Math.min(0.35, Math.max(0, fraction));

  for (let i = 1; i < cum.length; i++) {
    if (cum[i]! >= target) {
      const segLen = cum[i]! - cum[i - 1]!;
      const t = segLen > 0 ? (target - cum[i - 1]!) / segLen : 0;
      const a = coords[i - 1]!;
      const b = coords[i]!;
      return {
        point: pointOnSegment(a, b, t),
        bearing: bearingDegrees(a, b),
      };
    }
  }

  const n = coords.length - 1;
  return {
    point: coords[n]!,
    bearing: bearingDegrees(coords[n - 1]!, coords[n]!),
  };
}

/**
 * Vehicle marker on the route tail — same polyline geometry as the rendered route.
 */
export function vehicleMarkerOnApproachRoute(
  coords: [number, number][],
  _vehicle?: { lng: number; lat: number } | null | undefined,
  _pickup?: { lng: number; lat: number } | null | undefined,
): { point: [number, number]; bearing: number } {
  return pointAndBearingAlongRouteByDistance(coords, 0.05);
}

function segmentParameter(
  point: [number, number],
  a: [number, number],
  b: [number, number],
): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-12) return 0;
  return ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / lenSq;
}
