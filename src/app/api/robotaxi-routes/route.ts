import { NextResponse } from "next/server";
import type { Feature, FeatureCollection, LineString } from "geojson";

const ORS_BASE = "https://api.openrouteservice.org/v2/directions";

type OrsProfile = "foot-walking" | "driving-car";

type RouteJob = {
  profile: OrsProfile;
  from: [number, number];
  to: [number, number];
  label: string;
};

type RequestBody = {
  /** Walking origin — pickup anchor, not user blue dot */
  pickupAnchor: [number, number];
  /** Trip origin — selected pickup zone representative point */
  tripOrigin?: [number, number];
  /** Trip destination — selected drop-off zone representative point */
  tripDestination?: [number, number];
  dropoff?: [number, number];
  pickupZones: Array<{
    id: string;
    lng: number;
    lat: number;
    shelterLng?: number;
    shelterLat?: number;
  }>;
  selectedZoneId?: string;
  vehicle?: [number, number];
  /** When false, only driving trip (and vehicle) — skip walking ORS calls */
  includeWalking?: boolean;
};

type OrsGeoJsonResponse = {
  features?: Array<{
    geometry?: LineString;
    properties?: {
      summary?: { distance?: number; duration?: number };
      segments?: Array<{ distance?: number; duration?: number }>;
    };
  }>;
  error?: { message?: string };
};

function buildFeatureCollection(
  geometry: LineString,
  meta: { route_id: string; profile: OrsProfile; label: string },
): FeatureCollection<LineString> {
  const feature: Feature<LineString> = {
    type: "Feature",
    geometry,
    properties: {
      route_id: meta.route_id,
      profile: meta.profile,
      label: meta.label,
      point_count: geometry.coordinates.length,
      generated_by: "openrouteservice",
    },
  };
  return { type: "FeatureCollection", features: [feature] };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOrsRoute(
  apiKey: string,
  job: RouteJob,
  options?: { waypoints?: [number, number][]; rejectStraightLine?: boolean },
): Promise<FeatureCollection<LineString> | null> {
  const coordinates: [number, number][] = options?.waypoints?.length
    ? [job.from, ...options.waypoints, job.to]
    : [job.from, job.to];

  const res = await fetch(`${ORS_BASE}/${job.profile}/geojson`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
      Accept: "application/geo+json;charset=UTF-8",
    },
    body: JSON.stringify({ coordinates }),
  });

  const data = (await res.json()) as OrsGeoJsonResponse;
  if (!res.ok) return null;

  const geometry = data.features?.[0]?.geometry;
  if (!geometry || geometry.type !== "LineString" || geometry.coordinates.length < 2) {
    return null;
  }

  const coords = geometry.coordinates;
  const rejectStraight = options?.rejectStraightLine ?? job.profile === "driving-car";

  if (rejectStraight && coords.length < 4) {
    const [a0, a1] = coords[0]!;
    const [b0, b1] = coords[coords.length - 1]!;
    const directM =
      Math.hypot((b0 - a0) * 111_320 * Math.cos(((a1 + b1) / 2) * (Math.PI / 180)), (b1 - a1) * 110_540);
    let pathM = 0;
    for (let i = 1; i < coords.length; i++) {
      const [x0, y0] = coords[i - 1]!;
      const [x1, y1] = coords[i]!;
      pathM += Math.hypot(
        (x1 - x0) * 111_320 * Math.cos(((y0 + y1) / 2) * (Math.PI / 180)),
        (y1 - y0) * 110_540,
      );
    }
    if (pathM < directM * 1.08) return null;
  }

  return buildFeatureCollection(geometry, {
    route_id: job.label.replace(/\s+/g, "_").toLowerCase(),
    profile: job.profile,
    label: job.label,
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.ORS_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Route has not been generated yet." },
      { status: 503 },
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const walkingOrigin = body.pickupAnchor;
  if (!walkingOrigin?.length) {
    return NextResponse.json({ error: "Missing pickup anchor" }, { status: 400 });
  }

  const selectedZone =
    body.pickupZones.find((z) => z.id === (body.selectedZoneId ?? "sheltered")) ??
    body.pickupZones.find((z) => z.id === "sheltered") ??
    body.pickupZones[0];
  const vehicle = body.vehicle;

  const includeWalking = body.includeWalking !== false;
  const tripEnd = body.tripDestination ?? body.dropoff;

  const tripPromise =
    body.tripOrigin?.length && tripEnd?.length
      ? fetchOrsRoute(
          apiKey,
          {
            profile: "driving-car",
            from: body.tripOrigin,
            to: tripEnd,
            label: "trip_overview",
          },
          { rejectStraightLine: true },
        )
      : Promise.resolve(null);

  const walkingRoutes: Record<string, FeatureCollection<LineString>> = {};
  if (includeWalking) {
    const selectedId = body.selectedZoneId ?? "sheltered";
    const ordered = [
      ...body.pickupZones.filter((z) => z.id === selectedId),
      ...body.pickupZones.filter((z) => z.id !== selectedId),
    ];

    for (const zone of ordered) {
      const hasShelter =
        Number.isFinite(zone.shelterLng) &&
        Number.isFinite(zone.shelterLat) &&
        (Math.abs(zone.shelterLng!) > 1e-6 || Math.abs(zone.shelterLat!) > 1e-6);

      let walk: FeatureCollection<LineString> | null = null;
      for (let attempt = 0; attempt < 2 && !walk; attempt++) {
        walk = await fetchOrsRoute(
          apiKey,
          {
            profile: "foot-walking",
            from: walkingOrigin,
            to: [zone.lng, zone.lat],
            label: `walk_${zone.id}`,
          },
          {
            rejectStraightLine: false,
            waypoints: hasShelter ? [[zone.shelterLng!, zone.shelterLat!]] : undefined,
          },
        );
        if (!walk && attempt === 0) await sleep(180);
      }

      if (walk) walkingRoutes[zone.id] = walk;
      await sleep(120);
    }
  }

  const vehiclePromise =
    selectedZone && vehicle?.length
      ? fetchOrsRoute(apiKey, {
          profile: "driving-car",
          from: vehicle,
          to: [selectedZone.lng, selectedZone.lat],
          label: "vehicle_to_pickup",
        })
      : Promise.resolve(null);

  const [tripOverviewRoute, vehicleRoute] = await Promise.all([
    tripPromise,
    vehiclePromise,
  ]);

  const walkingRouteToSelectedPickup = selectedZone
    ? walkingRoutes[selectedZone.id]
    : undefined;

  return NextResponse.json({
    tripOverviewRoute: tripOverviewRoute ?? undefined,
    walkingRoutes,
    walkingRouteToSelectedPickup,
    vehicleRoute: vehicleRoute ?? undefined,
    vehicleRouteToSelectedPickup: vehicleRoute ?? undefined,
  });
}
