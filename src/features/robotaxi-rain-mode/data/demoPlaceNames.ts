/**
 * Simulated place names for the Shenzhen coastal commercial demo area.
 * Not real geocoded POIs — labels only, paired with random coordinates in the service bbox.
 */

export const PICKUP_NEARBY_NAMES = [
  "Coastal Avenue",
  "Poly Cultural Plaza",
  "Houhai MixC North Gate",
  "Shenzhen Bay Park South Entrance",
  "Houhai Harbour Walk",
  "Nanshan Book City Plaza",
  "Coastal City Bus Platform",
  "Houhai Metro Exit A",
  "Baishi Road Junction",
  "Wenxin Road Curbside",
] as const;

export const DROPOFF_DESTINATION_NAMES = [
  "Coastal City Mall",
  "Sea World Plaza",
  "MixC World",
  "Shenzhen Bay Sports Center",
  "Houhai Office Tower Lobby",
  "Raffles City Shenzhen",
  "Nanshan Hospital South Gate",
  "Coastal Science Park Gate",
  "Houhai Financial Center",
  "Shenzhen Bay Marriott Entrance",
  "Talent Park North Gate",
  "Houhai Shopping Park",
] as const;

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

const PICKUP_LABEL_PREFIX = "Current location · ";

/** Strip legacy "Current location · …" prefix for display */
export function displayPlaceLabel(label: string): string {
  const trimmed = label.trim();
  if (trimmed.startsWith(PICKUP_LABEL_PREFIX)) {
    return trimmed.slice(PICKUP_LABEL_PREFIX.length);
  }
  return trimmed;
}

/** Curbside / pickup place name for Trip Setup */
export function randomPickupPlaceLabel(random: () => number): string {
  return pick(PICKUP_NEARBY_NAMES, random);
}

/** Drop-off destination name for Trip Setup */
export function randomDropoffPlaceLabel(random: () => number): string {
  return pick(DROPOFF_DESTINATION_NAMES, random);
}
