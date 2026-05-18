import type { PickupZoneId } from "./scenarioTypes";

/** Semantic zone role — `sheltered` id maps to shelter-adjacent roadside boarding */
export type PickupZoneType = "closest" | "shelter_adjacent" | "soonest";

export function pickupZoneTypeFromId(id: PickupZoneId): PickupZoneType {
  if (id === "sheltered") return "shelter_adjacent";
  return id;
}

export function isShelterAdjacentZone(
  zone: { id: PickupZoneId; type?: PickupZoneType },
): boolean {
  return zone.type === "shelter_adjacent" || zone.id === "sheltered";
}
