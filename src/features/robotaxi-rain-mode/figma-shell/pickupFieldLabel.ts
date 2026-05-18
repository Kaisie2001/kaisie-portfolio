import { displayPlaceLabel } from "../data/demoPlaceNames";
import type { PickupZoneId } from "../data/scenarioTypes";
import { getPickupOption } from "./pickup-data";

/** Trip Setup pickup field — e.g. "Sheltered Zone · Coastal Avenue" */
export function formatPickupZoneFieldLabel(
  zoneId: PickupZoneId,
  placeLabel: string,
): string {
  const zone = getPickupOption(zoneId);
  const place = displayPlaceLabel(placeLabel).trim() || placeLabel.trim();
  return place ? `${zone.name} Zone · ${place}` : `${zone.name} Zone`;
}

/** Dispatch screen — zone only when anchor is generic current location */
export function getDispatchPickupLabel(
  zoneId: PickupZoneId,
  placeLabel: string,
): string {
  const place = displayPlaceLabel(placeLabel).trim();
  if (!place || place === "Current location") {
    return `${getPickupOption(zoneId).name} Zone`;
  }
  return formatPickupZoneFieldLabel(zoneId, placeLabel);
}

export function extractPickupPlaceLabel(fullLabel: string): string {
  const trimmed = displayPlaceLabel(fullLabel).trim();
  const zoneSuffix = trimmed.match(/^(.+?) Zone · (.+)$/);
  if (zoneSuffix) return zoneSuffix[2]!.trim();
  return trimmed;
}
