import type { WalkingRoute } from "../data/types";

export type ExposureResult = {
  pudoId: string;
  walkingDistanceM: number;
  rainExposedWalkingDistanceM: number;
  coveredWalkingDistanceM: number;
  exposureRatio: number;
};

export function calculateWalkingExposure(
  route: WalkingRoute,
): ExposureResult {
  const walkingDistanceM = route.total_distance_m;
  const rainExposedWalkingDistanceM = route.rain_exposed_distance_m;
  const coveredWalkingDistanceM = route.covered_distance_m ?? 0;

  return {
    pudoId: route.pudo_id,
    walkingDistanceM,
    rainExposedWalkingDistanceM,
    coveredWalkingDistanceM,
    exposureRatio:
      walkingDistanceM === 0 ? 0 : rainExposedWalkingDistanceM / walkingDistanceM,
  };
}

export function calculateExposureByPudo(routes: WalkingRoute[]) {
  return Object.fromEntries(
    routes.map((route) => {
      const result = calculateWalkingExposure(route);
      return [result.pudoId, result];
    }),
  );
}
