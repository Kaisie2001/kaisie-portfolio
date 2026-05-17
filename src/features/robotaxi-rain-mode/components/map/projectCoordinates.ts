import type { GeoPoint } from "../../data/types";
import { FALLBACK_PIN_LAYOUT, FALLBACK_USER, MAP_VIEWBOX } from "./mapGeometry";

type LatLon = { lat: number; lon: number };

function collectPoints(
  user?: GeoPoint,
  points: LatLon[] = [],
): LatLon[] {
  const out = [...points];
  if (user?.coordinates) {
    const [lon, lat] = user.coordinates;
    out.push({ lat, lon });
  }
  return out;
}

function bounds(points: LatLon[]) {
  if (points.length === 0) {
    return {
      minLat: 22.519,
      maxLat: 22.523,
      minLon: 113.93,
      maxLon: 113.936,
    };
  }
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLon = points[0].lon;
  let maxLon = points[0].lon;
  for (const p of points) {
    minLat = Math.min(minLat, p.lat);
    maxLat = Math.max(maxLat, p.lat);
    minLon = Math.min(minLon, p.lon);
    maxLon = Math.max(maxLon, p.lon);
  }
  const pad = 0.0008;
  return {
    minLat: minLat - pad,
    maxLat: maxLat + pad,
    minLon: minLon - pad,
    maxLon: maxLon + pad,
  };
}

export function projectLatLon(
  lat: number,
  lon: number,
  b: ReturnType<typeof bounds>,
): { x: number; y: number } {
  const x =
    ((lon - b.minLon) / Math.max(b.maxLon - b.minLon, 1e-9)) *
    (MAP_VIEWBOX.width - 48);
  const y =
    (1 - (lat - b.minLat) / Math.max(b.maxLat - b.minLat, 1e-9)) *
    (MAP_VIEWBOX.height - 40);
  return { x: x + 24, y: y + 20 };
}

export function projectUserLocation(user?: GeoPoint): { x: number; y: number } {
  if (!user?.coordinates) return FALLBACK_USER;
  const [lon, lat] = user.coordinates;
  const b = bounds([{ lat, lon }]);
  return projectLatLon(lat, lon, b);
}

export function projectCandidate(
  lat: number | undefined,
  lon: number | undefined,
  optionType: string,
  allPoints: LatLon[],
  user?: GeoPoint,
): { x: number; y: number } {
  if (lat == null || lon == null) {
    return FALLBACK_PIN_LAYOUT[optionType] ?? FALLBACK_PIN_LAYOUT.default;
  }
  const b = bounds(collectPoints(user, allPoints));
  return projectLatLon(lat, lon, b);
}

export function latLonFromPoint(point: GeoPoint): LatLon {
  const [lon, lat] = point.coordinates;
  return { lat, lon };
}
