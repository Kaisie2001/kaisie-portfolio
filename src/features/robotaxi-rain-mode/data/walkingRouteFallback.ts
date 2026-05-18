import {
  length,
  lineSliceAlong,
  lineString,
  nearestPointOnLine,
  point,
} from "@turf/turf";
import type { Feature, FeatureCollection, LineString } from "geojson";
import { loadRoadLayers } from "./pudoZoneService";
import type { ScenarioLocation } from "./scenarioTypes";

type RoadFeature = Feature<LineString, { highway?: string; osm_id?: string }>;

const PEDESTRIAN_ONLY = new Set([
  "footway",
  "path",
  "steps",
  "pedestrian",
  "cycleway",
  "track",
]);

function isWalkableRoad(highway: string | undefined): boolean {
  if (!highway) return true;
  return !PEDESTRIAN_ONLY.has(highway);
}

function toFc(coords: [number, number][]): FeatureCollection<LineString> {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
        properties: {
          route_id: "walk_road_fallback",
          profile: "foot-walking",
          label: "Walking (road network fallback)",
          generated_by: "road_network_fallback",
        },
      },
    ],
  };
}

/**
 * When ORS is unavailable, approximate a walk along the nearest drivable road segment.
 */
export async function buildRoadSnappedWalkingFallback(
  from: ScenarioLocation,
  to: { lng: number; lat: number },
): Promise<FeatureCollection<LineString> | null> {
  const { roads } = await loadRoadLayers();
  if (!roads?.features?.length) return null;

  const fromPt = point([from.lng, from.lat]);
  const toPt = point([to.lng, to.lat]);

  let bestFrom: { road: RoadFeature; dist: number; along: number } | null = null;
  let bestTo: { road: RoadFeature; dist: number; along: number } | null = null;

  for (const f of roads.features) {
    const road = f as RoadFeature;
    if (road.geometry?.type !== "LineString" || !isWalkableRoad(road.properties?.highway)) {
      continue;
    }
    const snapFrom = nearestPointOnLine(road, fromPt, { units: "meters" });
    const snapTo = nearestPointOnLine(road, toPt, { units: "meters" });
    const dFrom =
      typeof snapFrom.properties?.dist === "number" ? snapFrom.properties.dist : 9999;
    const dTo = typeof snapTo.properties?.dist === "number" ? snapTo.properties.dist : 9999;

    if (!bestFrom || dFrom < bestFrom.dist) {
      const lineLen = length(road, { units: "meters" });
      const loc = snapFrom.properties?.location as number | undefined;
      bestFrom = { road, dist: dFrom, along: (loc ?? 0.5) * lineLen };
    }
    if (!bestTo || dTo < bestTo.dist) {
      const lineLen = length(road, { units: "meters" });
      const loc = snapTo.properties?.location as number | undefined;
      bestTo = { road, dist: dTo, along: (loc ?? 0.5) * lineLen };
    }
  }

  if (!bestFrom || !bestTo || bestFrom.dist > 200 || bestTo.dist > 200) {
    return null;
  }

  if (bestFrom.road.properties?.osm_id === bestTo.road.properties?.osm_id) {
    const road = bestFrom.road;
    const lineLen = length(road, { units: "meters" });
    const startM = Math.min(bestFrom.along, bestTo.along);
    const endM = Math.max(bestFrom.along, bestTo.along);
    try {
      const sliced = lineSliceAlong(road, startM, Math.max(startM + 2, endM), {
        units: "meters",
      });
      const coords = sliced.geometry.coordinates as [number, number][];
      if (coords.length >= 2) return toFc(coords);
    } catch {
      /* fall through */
    }
  }

  const coords: [number, number][] = [
    [from.lng, from.lat],
    bestFrom.road.geometry.coordinates[
      Math.floor(bestFrom.road.geometry.coordinates.length / 2)
    ]! as [number, number],
    bestTo.road.geometry.coordinates[
      Math.floor(bestTo.road.geometry.coordinates.length / 2)
    ]! as [number, number],
    [to.lng, to.lat],
  ];
  return toFc(coords);
}
