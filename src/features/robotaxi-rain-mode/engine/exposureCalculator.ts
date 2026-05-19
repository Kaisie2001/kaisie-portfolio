import type { WalkingRoute } from "../data/types";

export type ExposureResult = {
  pudoId: string;
  walkingDistanceM: number;
  rainExposedWalkingDistanceM: number;
  coveredWalkingDistanceM: number;
  coveredRatio: number;
  exposureRatio: number;
};

export type RouteExposureMetrics = {
  totalDistanceM: number;
  coveredDistanceM: number;
  rainExposedDistanceM: number;
  coveredRatio: number;
};

export function calculateRouteExposure(route: WalkingRoute): RouteExposureMetrics {
  const segments = route.segments ?? [];

  if (segments.length === 0) {
    const totalDistanceM = route.total_distance_m;
    const coveredDistanceM = route.covered_distance_m ?? 0;
    const rainExposedDistanceM = route.rain_exposed_distance_m;
    return {
      totalDistanceM,
      coveredDistanceM,
      rainExposedDistanceM,
      coveredRatio: totalDistanceM === 0 ? 0 : coveredDistanceM / totalDistanceM,
    };
  }

  const totals = segments.reduce(
    (acc, segment) => {
      const lengthM = segment.lengthM ?? segment.distanceM;
      const coverageRatio =
        segment.coverageRatio ??
        (segment.type === "covered" ? 1 : segment.type === "exposed" ? 0 : 0);
      return {
        totalDistanceM: acc.totalDistanceM + lengthM,
        coveredDistanceM: acc.coveredDistanceM + lengthM * coverageRatio,
        rainExposedDistanceM:
          acc.rainExposedDistanceM + lengthM * (1 - coverageRatio),
      };
    },
    { totalDistanceM: 0, coveredDistanceM: 0, rainExposedDistanceM: 0 },
  );

  return {
    ...totals,
    coveredRatio:
      totals.totalDistanceM === 0
        ? 0
        : totals.coveredDistanceM / totals.totalDistanceM,
  };
}

export function calculateWalkingExposure(
  route: WalkingRoute,
): ExposureResult {
  const exposure = calculateRouteExposure(route);
  const walkingDistanceM = exposure.totalDistanceM;
  const rainExposedWalkingDistanceM = exposure.rainExposedDistanceM;
  const coveredWalkingDistanceM = exposure.coveredDistanceM;

  return {
    pudoId: route.pudo_id,
    walkingDistanceM,
    rainExposedWalkingDistanceM,
    coveredWalkingDistanceM,
    coveredRatio: exposure.coveredRatio,
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
