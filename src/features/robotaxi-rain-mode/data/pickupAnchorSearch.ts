import { resolvePickupPlaceLocation } from "./demoPlaceCoordinates";
import { PICKUP_NEARBY_NAMES } from "./demoPlaceNames";
import type { ScenarioLocation } from "./scenarioTypes";
import { distanceMeters } from "./randomScenario";

export type StartingPlaceResult = {
  name: string;
  distanceM: number;
  hint?: string;
  location: ScenarioLocation;
};

const PLACE_HINTS: Partial<Record<(typeof PICKUP_NEARBY_NAMES)[number], string>> = {
  "Shenzhen Bay Park South Entrance": "Nanshan · coastal walkway",
  "Houhai Metro Exit A": "Houhai · metro plaza",
  "Coastal City Bus Platform": "Nanshan · retail district",
  "Poly Cultural Plaza": "Houhai · cultural district",
  "Nanshan Book City Plaza": "Nanshan · civic plaza",
  "Houhai MixC North Gate": "Houhai · mall entrance",
  "Coastal Avenue": "Houhai · waterfront",
  "Houhai Harbour Walk": "Houhai · harbour front",
};

/** Simulated starting-place search — results are anchor locations, not pickup zones */
export function searchStartingPlaces(
  query: string,
  from: ScenarioLocation,
): StartingPlaceResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return PICKUP_NEARBY_NAMES.filter((name) => name.toLowerCase().includes(q))
    .slice(0, 6)
    .map((name) => {
      const location =
        resolvePickupPlaceLocation(name) ?? {
          lng: from.lng,
          lat: from.lat,
          label: name,
        };
      return {
        name,
        distanceM: Math.round(distanceMeters(from, location)),
        hint: PLACE_HINTS[name],
        location,
      };
    });
}

export function formatDistanceAway(distanceM: number): string {
  if (distanceM < 1000) return `${distanceM} m away`;
  return `${(distanceM / 1000).toFixed(1)} km away`;
}

/** Pickup zone screen title — keep short; anchor name shown elsewhere */
export function pickupNearHeaderTitle(): string {
  return "Choose pick-up area";
}
