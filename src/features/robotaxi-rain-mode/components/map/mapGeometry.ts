/**
 * Editable map geometry — paths reconstructed from Figma visual reference.
 * Image used as reference only; not embedded as raster background.
 */

export const MAP_VIEWBOX = { width: 390, height: 300 } as const;

export const MAP_LAND_PATH = "M0 0 H390 V300 H0 Z";

/** Coastline / water (east side) */
export const MAP_WATER_PATH =
  "M248 0 C310 8 370 40 390 90 V300 H248 C220 260 210 200 230 140 C240 100 235 50 248 0 Z";

/** Park blocks */
export const MAP_PARK_PATHS = [
  "M32 48 C56 36 88 40 104 58 C112 70 96 88 72 92 C48 96 24 78 32 48 Z",
  "M148 32 C172 28 196 36 208 52 C216 64 200 76 178 80 C156 84 140 68 148 32 Z",
];

export type RoadSegment = {
  id: string;
  d: string;
  width: number;
  className: "map-road-primary" | "map-road-secondary";
};

/** Road centerlines — pair with map-road-surface in EditableMapLayer */
export const MAP_ROADS: RoadSegment[] = [
  { id: "coastal-avenue", d: "M16 188 H374", width: 14, className: "map-road-primary" },
  { id: "metro-spur", d: "M198 28 V248", width: 10, className: "map-road-primary" },
  { id: "mall-approach", d: "M198 96 C230 88 262 82 290 96", width: 8, className: "map-road-secondary" },
  { id: "user-link", d: "M88 210 C120 200 160 192 198 188", width: 7, className: "map-road-secondary" },
  { id: "east-loop", d: "M290 96 C318 120 330 150 318 188", width: 7, className: "map-road-secondary" },
];

export type MapLabel = {
  id: string;
  x: number;
  y: number;
  text: string;
  className?: string;
};

export const MAP_LABELS: MapLabel[] = [
  { id: "coastal-avenue", x: 128, y: 178, text: "Coastal Avenue" },
  { id: "metro-exit", x: 178, y: 58, text: "Metro Exit" },
  { id: "mall-entrance", x: 228, y: 82, text: "Mall North Entrance" },
];

export const FALLBACK_PIN_LAYOUT: Record<string, { x: number; y: number }> = {
  closest: { x: 108, y: 198 },
  sheltered: { x: 268, y: 102 },
  soonest: { x: 312, y: 178 },
  default: { x: 200, y: 150 },
  fallback: { x: 88, y: 140 },
};

export const FALLBACK_USER = { x: 72, y: 218 };

export const SHELTER_LANDMARK = {
  x: 268,
  y: 102,
  label: "Mall North Entrance",
};

/** Vehicle position for guidance screen (on Coastal Avenue) */
export const VEHICLE_DEMO_POSITION = { x: 318, y: 172 };
