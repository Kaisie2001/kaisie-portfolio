/**
 * Generate road-following route GeoJSON via OpenRouteService (server-side only).
 *
 * Usage:
 *   npm run generate:robotaxi-routes
 *
 * Requires ORS_API_KEY in .env.local at the project root.
 * The key is never written to generated files or frontend bundles.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import type { Feature, FeatureCollection, LineString } from "geojson";

loadEnv({ path: resolve(process.cwd(), ".env.local") });

const ORS_BASE = "https://api.openrouteservice.org/v2/directions";
const OUTPUT_DIR = resolve(
  process.cwd(),
  "public/data/robotaxi-map/generated",
);

type OrsProfile = "foot-walking" | "driving-car";

type RouteJob = {
  outfile: string;
  profile: OrsProfile;
  from: [number, number];
  to: [number, number];
  label: string;
};

type OrsGeoJsonResponse = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: LineString;
    properties?: {
      summary?: { distance?: number; duration?: number };
      segments?: Array<{ distance?: number; duration?: number }>;
    };
  }>;
  error?: { code?: number; message?: string };
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function buildFeatureCollection(
  geometry: LineString,
  meta: {
    route_id: string;
    profile: OrsProfile;
    label: string;
    from: [number, number];
    to: [number, number];
    ors?: OrsGeoJsonResponse["features"][0]["properties"];
  },
): FeatureCollection<LineString> {
  const summary = meta.ors?.summary;
  const distanceM = summary?.distance ?? meta.ors?.segments?.[0]?.distance;
  const durationS = summary?.duration ?? meta.ors?.segments?.[0]?.duration;

  const feature: Feature<LineString> = {
    type: "Feature",
    geometry,
    properties: {
      route_id: meta.route_id,
      profile: meta.profile,
      label: meta.label,
      from_lon: meta.from[0],
      from_lat: meta.from[1],
      to_lon: meta.to[0],
      to_lat: meta.to[1],
      distance_m: distanceM ?? null,
      duration_s: durationS ?? null,
      point_count: geometry.coordinates.length,
      generated_by: "openrouteservice",
      generated_at: new Date().toISOString(),
    },
  };

  return { type: "FeatureCollection", features: [feature] };
}

async function fetchOrsRouteWithMeta(
  apiKey: string,
  job: RouteJob,
): Promise<FeatureCollection<LineString>> {
  const url = `${ORS_BASE}/${job.profile}/geojson`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
      Accept: "application/geo+json;charset=UTF-8",
    },
    body: JSON.stringify({
      coordinates: [job.from, job.to],
    }),
  });

  const data = (await res.json()) as OrsGeoJsonResponse;

  if (!res.ok) {
    const msg = data.error?.message ?? res.statusText;
    throw new Error(`${job.label}: ORS ${job.profile} (${res.status}) — ${msg}`);
  }

  const rawFeature = data.features?.[0];
  const geometry = rawFeature?.geometry;

  if (!geometry || geometry.type !== "LineString") {
    throw new Error(`${job.label}: no LineString in ORS response`);
  }

  if (geometry.coordinates.length < 3) {
    throw new Error(
      `${job.label}: only ${geometry.coordinates.length} coordinate(s); refusing straight-line fallback`,
    );
  }

  const routeId = job.outfile.replace(/\.geojson$/, "");

  return buildFeatureCollection(geometry, {
    route_id: routeId,
    profile: job.profile,
    label: job.label,
    from: job.from,
    to: job.to,
    ors: rawFeature.properties,
  });
}

async function main(): Promise<void> {
  const apiKey = process.env.ORS_API_KEY?.trim();

  if (!apiKey) {
    console.error(
      [
        "",
        "Robotaxi route generation skipped.",
        "",
        "  ORS_API_KEY is not set.",
        "  Add it to .env.local at the project root:",
        "    ORS_API_KEY=your_key_here",
        "",
        "  Get a free key: https://openrouteservice.org/dev/#/signup",
        "",
      ].join("\n"),
    );
    process.exit(0);
    return;
  }

  const { DEMO_SCENARIO, getPickupZone, segmentCenter } = await import(
    "../src/features/robotaxi-rain-mode/data/demoScenario"
  );

  const user = DEMO_SCENARIO.userLocation;
  const dropoff = DEMO_SCENARIO.dropoffLocation;
  const vehicleStart = DEMO_SCENARIO.vehicleStartLocation;
  const shelteredCenter = segmentCenter(DEMO_SCENARIO.shelteredPickupZone);

  const jobs: RouteJob[] = [
    {
      outfile: "walking_route_closest.geojson",
      profile: "foot-walking",
      from: user,
      to: segmentCenter(getPickupZone("closest")),
      label: "Walking → closest pickup",
    },
    {
      outfile: "walking_route_sheltered.geojson",
      profile: "foot-walking",
      from: user,
      to: segmentCenter(getPickupZone("sheltered")),
      label: "Walking → sheltered pickup",
    },
    {
      outfile: "walking_route_soonest.geojson",
      profile: "foot-walking",
      from: user,
      to: segmentCenter(getPickupZone("soonest")),
      label: "Walking → soonest pickup",
    },
    {
      outfile: "vehicle_route_to_sheltered.geojson",
      profile: "driving-car",
      from: vehicleStart,
      to: shelteredCenter,
      label: "Vehicle → sheltered pickup",
    },
    {
      outfile: "trip_overview_route.geojson",
      profile: "driving-car",
      from: shelteredCenter,
      to: dropoff,
      label: "Trip overview (sheltered pickup → drop-off)",
    },
  ];

  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("Generating Robotaxi routes via OpenRouteService…");
  console.log(`Output: ${OUTPUT_DIR}\n`);

  let ok = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      process.stdout.write(`  ${job.label} … `);
      const fc = await fetchOrsRouteWithMeta(apiKey, job);
      const outPath = resolve(OUTPUT_DIR, job.outfile);
      writeFileSync(outPath, `${JSON.stringify(fc, null, 2)}\n`, "utf8");
      const pts = fc.features[0]?.geometry.coordinates.length ?? 0;
      const dist = fc.features[0]?.properties?.distance_m;
      console.log(`OK (${pts} points${dist != null ? `, ${Math.round(dist)} m` : ""})`);
      ok += 1;
      await sleep(350);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`FAILED`);
      console.error(`    ${msg}`);
      failed += 1;
    }
  }

  console.log("");
  if (ok === jobs.length) {
    console.log(`Done. ${ok}/${jobs.length} routes saved.`);
  } else {
    console.log(`Finished with errors. ${ok} saved, ${failed} failed.`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
