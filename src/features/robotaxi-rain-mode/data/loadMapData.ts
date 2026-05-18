import type { FeatureCollection, Geometry } from "geojson";
import { DEMO_DESTINATION } from "./demoData";
import type { MapMode, PickupZoneId } from "./mapModes";

export type GeoJsonLayer = FeatureCollection<Geometry> | null;

export type MapManifest = {
  generated?: string;
  osm_source?: string;
  bbox?: {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  };
  missing_fallbacks?: string[];
};

export type MapGeoLayers = {
  roads: GeoJsonLayer;
  water: GeoJsonLayer;
  parks: GeoJsonLayer;
  buildings: GeoJsonLayer;
  pois: GeoJsonLayer;
  pudoZones: GeoJsonLayer;
  walkingRoutes: GeoJsonLayer;
  vehicleRoute: GeoJsonLayer;
  manifest: MapManifest | null;
  missing: string[];
};

/** Demo user location (Coastal City / Houhai pack) — lon, lat */
export const DEMO_USER_LOCATION: [number, number] = [113.93345, 22.52015];

/** Walking route features in walking_routes.geojson use pudo_id */
export const PUDO_ID_BY_ZONE: Record<PickupZoneId, string> = {
  closest: "P1",
  sheltered: "P2",
  soonest: "P3",
};

const BASE = "/data/robotaxi-map";

export const MAP_LAYER_FILES = [
  "base_roads.geojson",
  "base_water.geojson",
  "base_parks.geojson",
  "base_buildings.geojson",
  "base_pois.geojson",
  "pudo_zones.geojson",
  "walking_routes.geojson",
  "vehicle_route.geojson",
] as const;

const LAYER_FILES: {
  key: keyof Omit<MapGeoLayers, "manifest" | "missing">;
  file: (typeof MAP_LAYER_FILES)[number];
}[] = [
  { key: "roads", file: "base_roads.geojson" },
  { key: "water", file: "base_water.geojson" },
  { key: "parks", file: "base_parks.geojson" },
  { key: "buildings", file: "base_buildings.geojson" },
  { key: "pois", file: "base_pois.geojson" },
  { key: "pudoZones", file: "pudo_zones.geojson" },
  { key: "walkingRoutes", file: "walking_routes.geojson" },
  { key: "vehicleRoute", file: "vehicle_route.geojson" },
];

async function fetchGeoJson(path: string): Promise<GeoJsonLayer> {
  const res = await fetch(path, { cache: "force-cache" });
  if (!res.ok) return null;
  return (await res.json()) as FeatureCollection<Geometry>;
}

/**
 * Loads OSM-derived GeoJSON layers from public/data/robotaxi-map/.
 * Missing files are listed in `missing` — the map still renders available layers.
 */
export async function loadMapData(): Promise<MapGeoLayers> {
  const missing: string[] = [];
  const layers = {} as Omit<MapGeoLayers, "manifest" | "missing">;

  await Promise.all(
    LAYER_FILES.map(async ({ key, file }) => {
      try {
        const data = await fetchGeoJson(`${BASE}/${file}`);
        if (!data) {
          missing.push(file);
          layers[key] = null;
        } else {
          layers[key] = data;
        }
      } catch {
        missing.push(file);
        layers[key] = null;
      }
    }),
  );

  let manifest: MapManifest | null = null;
  try {
    const res = await fetch(`${BASE}/manifest.json`, { cache: "force-cache" });
    if (res.ok) manifest = (await res.json()) as MapManifest;
    else missing.push("manifest.json");
  } catch {
    missing.push("manifest.json");
  }

  return { ...layers, manifest, missing };
}

export function listLoadedLayers(layers: MapGeoLayers): string[] {
  return LAYER_FILES.filter(({ key }) => layers[key] != null).map(({ file }) => file);
}

export const DEFAULT_MAP_BOUNDS: [[number, number], [number, number]] = [
  [22.517, 113.923],
  [22.526, 113.936],
];

export function boundsFromManifest(manifest: MapManifest | null): [[number, number], [number, number]] {
  const b = manifest?.bbox;
  if (!b) return DEFAULT_MAP_BOUNDS;
  return [
    [b.minLat, b.minLon],
    [b.maxLat, b.maxLon],
  ];
}

export type MapBounds = [[number, number], [number, number]];

function walkCoordinates(coords: unknown, visit: (lon: number, lat: number) => void): void {
  if (!Array.isArray(coords)) return;
  if (typeof coords[0] === "number" && typeof coords[1] === "number") {
    visit(coords[0], coords[1]);
    return;
  }
  for (const part of coords) walkCoordinates(part, visit);
}

function expandBoundsToAspect(
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number,
  viewportAspect: number,
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
  const centerLat = (minLat + maxLat) / 2;
  const latSpan = Math.max(maxLat - minLat, 1e-6);
  const lonSpan = Math.max(maxLon - minLon, 1e-6);
  const cosLat = Math.cos((centerLat * Math.PI) / 180);
  const geoAspect = (lonSpan * cosLat) / latSpan;

  if (geoAspect < viewportAspect) {
    const targetLonSpan = (latSpan * viewportAspect) / cosLat;
    const extra = (targetLonSpan - lonSpan) / 2;
    return { minLat, maxLat, minLon: minLon - extra, maxLon: maxLon + extra };
  }

  const targetLatSpan = (lonSpan * cosLat) / viewportAspect;
  const extra = (targetLatSpan - latSpan) / 2;
  return { minLat: minLat - extra, maxLat: maxLat + extra, minLon, maxLon };
}

/**
 * Tight bounds around demo story content (user, destination, PUDO, routes).
 * Avoids fitting the full OSM extract bbox into a tall phone viewport (which causes letterboxing).
 */
export function boundsFromDemoContent(
  layers: MapGeoLayers | null,
  mode: MapMode,
  selectedZoneId: PickupZoneId,
  options?: { viewportAspect?: number; padDegrees?: number },
): MapBounds {
  const pad = options?.padDegrees ?? 0.0018;
  const points: [number, number][] = [
    DEMO_USER_LOCATION,
    DEMO_DESTINATION.geometry.coordinates,
  ];

  const includeAllPudos = mode === "choosePickup";
  const includeSelectedPudo = mode === "robotaxiOnTheWay";

  if (layers?.pudoZones) {
    for (const feature of layers.pudoZones.features) {
      const zoneType = String(feature.properties?.option_type ?? "");
      if (zoneType === "fallback") continue;
      if (includeAllPudos || (includeSelectedPudo && zoneType === selectedZoneId)) {
        walkCoordinates(feature.geometry?.coordinates, (lon, lat) => points.push([lon, lat]));
      }
    }
  }

  if (layers?.walkingRoutes && (mode === "choosePickup" || mode === "robotaxiOnTheWay")) {
    const pudoId = PUDO_ID_BY_ZONE[selectedZoneId];
    for (const feature of layers.walkingRoutes.features) {
      if (String(feature.properties?.pudo_id ?? "") !== pudoId) continue;
      walkCoordinates(feature.geometry?.coordinates, (lon, lat) => points.push([lon, lat]));
    }
  }

  if (layers?.vehicleRoute && mode === "robotaxiOnTheWay") {
    for (const feature of layers.vehicleRoute.features) {
      walkCoordinates(feature.geometry?.coordinates, (lon, lat) => points.push([lon, lat]));
    }
  }

  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const [lon, lat] of points) {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  if (!Number.isFinite(minLon)) {
    return boundsFromManifest(layers?.manifest ?? null);
  }

  minLon -= pad;
  maxLon += pad;
  minLat -= pad;
  maxLat += pad;

  const aspect = options?.viewportAspect ?? 238 / 515;
  const expanded = expandBoundsToAspect(minLat, maxLat, minLon, maxLon, aspect);

  return [
    [expanded.minLat, expanded.minLon],
    [expanded.maxLat, expanded.maxLon],
  ];
}
