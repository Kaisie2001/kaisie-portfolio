import type { FeatureCollection, LineString } from "geojson";
import { loadGeneratedRoutes, type GeneratedRoutes } from "./loadGeneratedRoutes";
import { scenarioMatchesDefaultStaticRoutes } from "./scenarioDefaults";
import {
  getPickupAnchor,
  getTripDestinationCoords,
  getTripOriginCoords,
  getWalkingRouteOriginCoords,
  hasDropoffCoordinates,
  hasPickupAnchor,
} from "./scenarioHelpers";
import { zoneCoords } from "./pudoZoneService";
import {
  segmentWalkingRoute,
  segmentWalkingRoutesForScenario,
  syncZoneExposureFromWalkingRoutes,
} from "./walkingRouteSegments";
import type {
  PickupZoneId,
  PudoZoneState,
  RobotaxiScenario,
  WalkingRouteToPickup,
} from "./scenarioTypes";
import { buildRoadSnappedWalkingFallback } from "./walkingRouteFallback";

type RawWalkingRoutes = Partial<Record<PickupZoneId, FeatureCollection<LineString>>>;

export type ScenarioRoutesResult = {
  tripRoute?: FeatureCollection<LineString>;
  tripOverviewRoute?: FeatureCollection<LineString>;
  walkingRoutes?: Partial<Record<PickupZoneId, WalkingRouteToPickup>>;
  walkingRouteToPickup?: WalkingRouteToPickup;
  walkingRouteToSelectedPickup?: WalkingRouteToPickup;
  vehicleRouteToPickup?: FeatureCollection<LineString>;
  vehicleRoute?: FeatureCollection<LineString>;
  vehicleRouteToSelectedPickup?: FeatureCollection<LineString>;
  routesMissing: boolean;
  routesMessage?: string;
  /** Zones with walk / exposure synced to segmented routes */
  pickupZoneCandidates?: PudoZoneState[];
};

function finalizeWalkingRoutes(
  raw: RawWalkingRoutes | undefined,
  zones: PudoZoneState[],
  selectedZoneId: PickupZoneId,
  anchor?: { lng: number; lat: number; label: string },
): Pick<
  ScenarioRoutesResult,
  "walkingRoutes" | "walkingRouteToPickup" | "walkingRouteToSelectedPickup" | "pickupZoneCandidates"
> {
  const segmented = segmentWalkingRoutesForScenario(raw, zones, anchor);
  const updatedZones = syncZoneExposureFromWalkingRoutes(zones, segmented);
  const walkSelected = segmented[selectedZoneId];
  return {
    walkingRoutes: segmented,
    walkingRouteToPickup: walkSelected,
    walkingRouteToSelectedPickup: walkSelected,
    pickupZoneCandidates: updatedZones,
  };
}

function fromGeneratedRoutes(
  routes: GeneratedRoutes,
  scenario: RobotaxiScenario,
): ScenarioRoutesResult {
  const missing = routes.missing.length > 0;
  const raw: RawWalkingRoutes = {
    closest: routes.walkingClosest ?? undefined,
    sheltered: routes.walkingSheltered ?? undefined,
    soonest: routes.walkingSoonest ?? undefined,
  };
  const walking = finalizeWalkingRoutes(
    raw,
    scenario.pickupZoneCandidates,
    scenario.selectedZoneId,
    hasPickupAnchor(scenario) ? getPickupAnchor(scenario) : undefined,
  );
  const vehicle = routes.vehicleToSheltered ?? undefined;
  const trip = routes.tripOverview ?? undefined;
  return {
    tripRoute: trip,
    tripOverviewRoute: trip,
    ...walking,
    vehicleRouteToPickup: vehicle,
    vehicleRoute: vehicle,
    vehicleRouteToSelectedPickup: vehicle,
    routesMissing: missing,
    routesMessage: missing ? "Route has not been generated yet." : undefined,
  };
}

type ApiRouteResponse = {
  tripOverviewRoute?: FeatureCollection<LineString>;
  walkingRoutes?: RawWalkingRoutes;
  walkingRouteToSelectedPickup?: FeatureCollection<LineString>;
  vehicleRoute?: FeatureCollection<LineString>;
  vehicleRouteToSelectedPickup?: FeatureCollection<LineString>;
  error?: string;
};

function enrichWithSelectedWalking(
  result: ScenarioRoutesResult,
  zoneId: PickupZoneId,
): ScenarioRoutesResult {
  const walkSelected =
    result.walkingRouteToPickup ??
    result.walkingRouteToSelectedPickup ??
    result.walkingRoutes?.[zoneId];
  const vehicle =
    result.vehicleRouteToPickup ??
    result.vehicleRouteToSelectedPickup ??
    result.vehicleRoute;
  return {
    ...result,
    walkingRouteToPickup: walkSelected,
    walkingRouteToSelectedPickup: walkSelected,
    vehicleRouteToPickup: vehicle,
    vehicleRoute: vehicle,
    vehicleRouteToSelectedPickup: vehicle,
  };
}

export type FetchRoutesOptions = {
  /** Skip walking ORS calls — use on trip setup after drop-off is chosen */
  includeWalking?: boolean;
};

async function fillMissingWalkingWithRoadFallback(
  raw: RawWalkingRoutes | undefined,
  scenario: RobotaxiScenario,
): Promise<RawWalkingRoutes> {
  const out: RawWalkingRoutes = { ...raw };
  if (!hasPickupAnchor(scenario) || scenario.pickupZoneCandidates.length === 0) {
    return out;
  }
  const anchor = getPickupAnchor(scenario);
  for (const zone of scenario.pickupZoneCandidates) {
    if (out[zone.id]) continue;
    const c = zoneCoords(zone);
    const fallback = await buildRoadSnappedWalkingFallback(anchor, c);
    if (fallback) out[zone.id] = fallback;
  }
  return out;
}

/**
 * Walking: pickupAnchor → zone.representativePoint (segmented covered / exposed)
 * Trip: selectedPickupZone → selectedDropoffZone
 * Vehicle: vehicle → selectedPickupZone
 */
export async function fetchRoutesForScenario(
  scenario: RobotaxiScenario,
  options?: FetchRoutesOptions,
): Promise<ScenarioRoutesResult> {
  const includeWalking = options?.includeWalking !== false;
  if (scenarioMatchesDefaultStaticRoutes(scenario)) {
    const staticRoutes = await loadGeneratedRoutes();
    return fromGeneratedRoutes(staticRoutes, scenario);
  }

  const walkingOrigin = getWalkingRouteOriginCoords(scenario);
  const tripOrigin = getTripOriginCoords(scenario);
  const tripDestination = getTripDestinationCoords(scenario);
  const dropoffReady = hasDropoffCoordinates(scenario);
  const canFetchTripPreview =
    dropoffReady && tripOrigin != null && tripDestination != null;

  if (scenario.pickupZoneCandidates.length === 0) {
    if (!canFetchTripPreview) {
      return {
        routesMissing: true,
        routesMessage: scenario.pudoMessage ?? "Route has not been generated yet.",
      };
    }
  }

  try {
    const res = await fetch("/api/robotaxi-routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupAnchor: walkingOrigin,
        tripOrigin: tripOrigin && dropoffReady ? tripOrigin : undefined,
        tripDestination: tripDestination && dropoffReady ? tripDestination : undefined,
        dropoff: dropoffReady && tripDestination ? tripDestination : undefined,
        pickupZones: scenario.pickupZoneCandidates.map((z) => {
          const c = zoneCoords(z);
          return { id: z.id, lng: c.lng, lat: c.lat };
        }),
        selectedZoneId: scenario.selectedZoneId,
        vehicle: scenario.vehicleLocation
          ? [scenario.vehicleLocation.lng, scenario.vehicleLocation.lat]
          : undefined,
        includeWalking,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      return {
        routesMissing: true,
        routesMessage: err.error ?? "Route has not been generated yet.",
      };
    }

    const data = (await res.json()) as ApiRouteResponse;
    const trip = data.tripOverviewRoute;
    let rawWalking: RawWalkingRoutes = { ...data.walkingRoutes };
    if (data.walkingRouteToSelectedPickup && scenario.selectedZoneId) {
      rawWalking[scenario.selectedZoneId] = data.walkingRouteToSelectedPickup;
    }
    if (includeWalking) {
      rawWalking = await fillMissingWalkingWithRoadFallback(rawWalking, scenario);
    }

    const walking = finalizeWalkingRoutes(
      rawWalking,
      scenario.pickupZoneCandidates,
      scenario.selectedZoneId,
      hasPickupAnchor(scenario) ? getPickupAnchor(scenario) : undefined,
    );

    const base: ScenarioRoutesResult = {
      tripRoute: trip,
      tripOverviewRoute: trip,
      ...walking,
      vehicleRouteToPickup: data.vehicleRouteToSelectedPickup ?? data.vehicleRoute,
      vehicleRoute: data.vehicleRoute ?? data.vehicleRouteToSelectedPickup,
      vehicleRouteToSelectedPickup: data.vehicleRouteToSelectedPickup ?? data.vehicleRoute,
      routesMissing: false,
      routesMessage: undefined,
    };

    const enriched = enrichWithSelectedWalking(base, scenario.selectedZoneId);
    const needsTrip = Boolean(
      dropoffReady && tripOrigin != null && tripDestination != null,
    );
    const missingWalking =
      includeWalking &&
      scenario.pickupZoneCandidates.length > 0 &&
      !enriched.walkingRoutes?.closest &&
      !enriched.walkingRoutes?.sheltered &&
      !enriched.walkingRoutes?.soonest;
    const missingTrip = needsTrip && !enriched.tripRoute;

    return {
      ...enriched,
      routesMissing: missingWalking || missingTrip,
      routesMessage: missingTrip
        ? "Trip route could not be generated. Check ORS_API_KEY in .env.local."
        : missingWalking
          ? "Route has not been generated yet."
          : undefined,
    };
  } catch {
    return {
      routesMissing: true,
      routesMessage: "Route has not been generated yet.",
    };
  }
}

/** Segment a single raw walking line when ORS geometry arrives later */
export function segmentWalkingRouteForZone(
  route: FeatureCollection<LineString> | null | undefined,
  zoneId: PickupZoneId,
  zone?: PudoZoneState,
  anchor?: { lng: number; lat: number; label: string },
): WalkingRouteToPickup | null {
  return segmentWalkingRoute(
    route,
    zoneId,
    zone ? { coveredM: zone.coveredM, exposureM: zone.exposureM } : undefined,
    { zone, anchor },
  );
}
