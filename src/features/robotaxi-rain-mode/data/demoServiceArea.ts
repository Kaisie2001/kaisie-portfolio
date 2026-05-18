/**
 * Simulated Shenzhen coastal commercial demo service area.
 * Not an official Robotaxi ODD boundary — replace with production data later.
 */
export const DEMO_SERVICE_AREA = {
  name: "Shenzhen coastal commercial (simulated)",
  minLng: 113.9285,
  maxLng: 113.9425,
  minLat: 22.5155,
  maxLat: 22.5245,
} as const;

export function isInsideDemoServiceArea(lng: number, lat: number): boolean {
  return (
    lng >= DEMO_SERVICE_AREA.minLng &&
    lng <= DEMO_SERVICE_AREA.maxLng &&
    lat >= DEMO_SERVICE_AREA.minLat &&
    lat <= DEMO_SERVICE_AREA.maxLat
  );
}

export function clampToDemoServiceArea(lng: number, lat: number): [number, number] {
  return [
    Math.min(DEMO_SERVICE_AREA.maxLng, Math.max(DEMO_SERVICE_AREA.minLng, lng)),
    Math.min(DEMO_SERVICE_AREA.maxLat, Math.max(DEMO_SERVICE_AREA.minLat, lat)),
  ];
}
