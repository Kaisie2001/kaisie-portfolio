import { clampToDemoServiceArea } from "./demoServiceArea";
import {
  DROPOFF_DESTINATION_NAMES,
  PICKUP_NEARBY_NAMES,
  displayPlaceLabel,
} from "./demoPlaceNames";
import type { ScenarioLocation } from "./scenarioTypes";

/** Simulated POI coordinates in the demo bbox — not real geocoding */
const DROPOFF_COORDS: Record<(typeof DROPOFF_DESTINATION_NAMES)[number], [number, number]> = {
  "Coastal City Mall": [113.9312, 22.5188],
  "Sea World Plaza": [113.9382, 22.5201],
  "MixC World": [113.9298, 22.5164],
  "Shenzhen Bay Sports Center": [113.9395, 22.5172],
  "Houhai Office Tower Lobby": [113.9304, 22.5212],
  "Raffles City Shenzhen": [113.9352, 22.5194],
  "Nanshan Hospital South Gate": [113.9324, 22.5176],
  "Coastal Science Park Gate": [113.9408, 22.5182],
  "Houhai Financial Center": [113.9346, 22.5228],
  "Shenzhen Bay Marriott Entrance": [113.9412, 22.5196],
  "Talent Park North Gate": [113.9388, 22.5169],
  "Houhai Shopping Park": [113.9364, 22.5216],
};

const PICKUP_COORDS: Record<(typeof PICKUP_NEARBY_NAMES)[number], [number, number]> = {
  "Coastal Avenue": [113.9348, 22.5224],
  "Poly Cultural Plaza": [113.9318, 22.5218],
  "Houhai MixC North Gate": [113.9302, 22.5172],
  "Shenzhen Bay Park South Entrance": [113.9392, 22.5168],
  "Houhai Harbour Walk": [113.9376, 22.5232],
  "Nanshan Book City Plaza": [113.9336, 22.5236],
  "Coastal City Bus Platform": [113.9316, 22.5196],
  "Houhai Metro Exit A": [113.9328, 22.5208],
  "Baishi Road Junction": [113.9296, 22.522],
  "Wenxin Road Curbside": [113.9358, 22.5188],
};

function lookupCoords(
  label: string,
  table: Record<string, [number, number]>,
): [number, number] | null {
  const key = displayPlaceLabel(label);
  const coords = table[key];
  if (!coords) return null;
  const [lng, lat] = clampToDemoServiceArea(coords[0], coords[1]);
  return [lng, lat];
}

/** Resolve a named drop-off from the search list to a stable map location */
export function resolveDropoffPlaceLocation(
  label: string,
): ScenarioLocation | null {
  const coords = lookupCoords(label, DROPOFF_COORDS);
  if (!coords) return null;
  return { lng: coords[0], lat: coords[1], label: displayPlaceLabel(label) };
}

/** Resolve a named pick-up anchor from the search list */
export function resolvePickupPlaceLocation(
  label: string,
): ScenarioLocation | null {
  const coords = lookupCoords(label, PICKUP_COORDS);
  if (!coords) return null;
  return { lng: coords[0], lat: coords[1], label: displayPlaceLabel(label) };
}

export function hasNamedDropoffCoordinates(label: string): boolean {
  return lookupCoords(label, DROPOFF_COORDS) != null;
}
