import type {
  CandidateWithComputedMetrics,
  PickupSelectionOutput,
  PudoCandidate,
  VehicleApproachRoute,
  WalkingRoute,
} from "../data/types";
import { calculateExposureByPudo, calculateRouteExposure } from "./exposureCalculator";
import {
  calculateEstimatedBoardingTime,
  estimateEtaByPudo,
} from "./etaCalculator";
import { filterValidPudoCandidates } from "./hardFilter";
import { calculateRainComfortScore } from "./scoring";

const SEARCH_RADIUS_M = 150;
const SHELTERED_WALK_CAP_MULTIPLIER = 1.5;
const SHELTERED_ETA_CAP_MIN = 3;
const EXPOSURE_REDUCTION_TARGET_M = 20;

function candidateId(candidate: PudoCandidate) {
  return candidate.id ?? candidate.pudo_id;
}

function debugId(candidate: PudoCandidate) {
  switch (candidate.optionType ?? candidate.option_type) {
    case "closest":
      return "P1";
    case "sheltered":
      return "P2";
    case "soonest":
      return "P3";
    default:
      return candidateId(candidate);
  }
}

function minBy<T>(items: T[], value: (item: T) => number) {
  return items.reduce((best, item) => (value(item) < value(best) ? item : best));
}

function maxBy<T>(items: T[], value: (item: T) => number) {
  return items.reduce((best, item) => (value(item) > value(best) ? item : best));
}

export function selectPickupOptions(
  candidates: PudoCandidate[],
  walkingRoutes: WalkingRoute[],
  vehicleApproachRoutes: VehicleApproachRoute[] = [],
): PickupSelectionOutput {
  const hardFilter = filterValidPudoCandidates(candidates);
  const validIds = new Set(hardFilter.valid.map(candidateId));
  const validRoutes = walkingRoutes.filter((route) => validIds.has(route.pudo_id));
  const exposureByPudo = calculateExposureByPudo(validRoutes);
  const etaByPudo = estimateEtaByPudo(hardFilter.valid, {
    triggerRainIntensityMin: "medium",
    maxEtaReliabilityRisk: "medium",
    maxWalkingDistanceM: 150,
    maxExposedWalkingDistanceM: 80,
    maxCrossingCount: 2,
    boardingBufferMin: 0.5,
    minComfortScore: 0,
  });
  const maxRainExposedDistanceM = Math.max(
    ...hardFilter.valid.map(
      (candidate) =>
        candidate.rainExposedDistanceM ??
        candidate.rainExposedWalkingDistanceM ??
        candidate.rain_exposed_distance_m,
    ),
  );
  const maxWalkingDistanceM = Math.max(
    ...hardFilter.valid.map(
      (candidate) => candidate.walkingDistanceM ?? candidate.walking_distance_m,
    ),
  );
  const maxVehicleEtaMin = Math.max(
    ...hardFilter.valid.map(
      (candidate) => candidate.vehicleEtaMin ?? candidate.vehicle_eta_min,
    ),
  );
  const candidatesWithComputedMetrics: CandidateWithComputedMetrics[] =
    hardFilter.valid.map((candidate) => {
      const route = validRoutes.find((item) => item.pudo_id === candidateId(candidate));
      const exposure = route
        ? calculateRouteExposure(route)
        : {
            totalDistanceM: candidate.walkingDistanceM ?? candidate.walking_distance_m,
            coveredDistanceM:
              candidate.coveredDistanceM ??
              candidate.coveredWalkingDistanceM ??
              candidate.covered_distance_m ??
              0,
            rainExposedDistanceM:
              candidate.rainExposedDistanceM ??
              candidate.rainExposedWalkingDistanceM ??
              candidate.rain_exposed_distance_m,
            coveredRatio:
              candidate.coveredRatio ??
              (candidate.covered_distance_m ?? 0) / candidate.walking_distance_m,
          };
      const estimatedBoardingTimeMin = calculateEstimatedBoardingTime(candidate);
      const computedCandidate = {
        ...candidate,
        debugId: debugId(candidate),
        totalDistanceM: exposure.totalDistanceM,
        walkingDistanceM: exposure.totalDistanceM,
        coveredDistanceM: exposure.coveredDistanceM,
        coveredWalkingDistanceM: exposure.coveredDistanceM,
        rainExposedDistanceM: exposure.rainExposedDistanceM,
        rainExposedWalkingDistanceM: exposure.rainExposedDistanceM,
        coveredRatio: exposure.coveredRatio,
        estimatedBoardingTimeMin,
        estimated_boarding_time_min: estimatedBoardingTimeMin,
        rainComfortScore: 0,
      } satisfies CandidateWithComputedMetrics;

      return {
        ...computedCandidate,
        rainComfortScore: calculateRainComfortScore(computedCandidate, {
          maxRainExposedDistanceM,
          maxWalkingDistanceM,
          maxVehicleEtaMin,
        }),
      };
    });
  const scores = candidatesWithComputedMetrics
    .map((candidate) => ({
      pudoId: candidateId(candidate),
      rainComfortScore: candidate.rainComfortScore,
      weightedScore: candidate.rainComfortScore,
      components: {
        walkingDistance: candidate.walkingDistanceM ?? 0,
        rainExposure: candidate.rainExposedDistanceM,
        coveredWalking: candidate.coveredRatio,
        shelterScore: candidate.shelterScore ?? candidate.shelter_score,
        sameSideAccess: candidate.sameSideAccess ? 1 : 0,
        crossingCount: candidate.crossingCount ?? 0,
        vehicleEta: candidate.vehicleEtaMin ?? candidate.vehicle_eta_min,
        boardingTime: candidate.estimatedBoardingTimeMin,
        recognizability: candidate.recognizabilityScore ?? 0,
        demandProximity: candidate.demandProximityScore ?? 0,
      },
    }))
    .sort((a, b) => b.rainComfortScore - a.rainComfortScore);

  const closest = minBy(
    candidatesWithComputedMetrics,
    (candidate) => candidate.walkingDistanceM ?? candidate.walking_distance_m,
  );
  const fastest = minBy(
    candidatesWithComputedMetrics,
    (candidate) => candidate.vehicleEtaMin ?? candidate.vehicle_eta_min,
  );
  const shelteredPool = candidatesWithComputedMetrics.filter((candidate) => {
    const walkingDistanceM = candidate.walkingDistanceM ?? candidate.walking_distance_m;
    const vehicleEtaMin = candidate.vehicleEtaMin ?? candidate.vehicle_eta_min;
    const rainExposedDistanceM = candidate.rainExposedDistanceM;
    const closestExposedDistanceM = closest.rainExposedDistanceM;
    return (
      walkingDistanceM <=
        SHELTERED_WALK_CAP_MULTIPLIER *
          (closest.walkingDistanceM ?? closest.walking_distance_m) &&
      vehicleEtaMin <=
        (fastest.vehicleEtaMin ?? fastest.vehicle_eta_min) +
          SHELTERED_ETA_CAP_MIN &&
      closestExposedDistanceM - rainExposedDistanceM >= EXPOSURE_REDUCTION_TARGET_M
    );
  });
  const sheltered = maxBy(
    shelteredPool.length > 0 ? shelteredPool : candidatesWithComputedMetrics,
    (candidate) => candidate.rainComfortScore,
  );
  const soonest = minBy(
    candidatesWithComputedMetrics,
    (candidate) => candidate.estimatedBoardingTimeMin,
  );
  const selectedRecommendation = sheltered;

  return {
    rawCandidateCount: candidates.length,
    validCandidateCount: hardFilter.valid.length,
    hardFilterResults: hardFilter.results,
    rejectedCandidates: hardFilter.rejected,
    exposureByPudo,
    etaByPudo,
    scores,
    candidatesWithComputedMetrics,
    closest,
    sheltered,
    soonest,
    selectedRecommendation,
    debugPipeline: [
      `Query candidate pool within ${SEARCH_RADIUS_M}m search radius`,
      "Apply hard feasibility filters",
      "Calculate walking route exposure",
      "Estimate vehicle ETA and boarding time",
      "Calculate rain comfort score",
      `Select Closest / Sheltered / Soonest with ${vehicleApproachRoutes.length} vehicle approach route(s) available`,
    ],
    selections: {
      closest: candidateId(closest),
      sheltered: candidateId(sheltered),
      soonest: candidateId(soonest),
      recommended: candidateId(selectedRecommendation),
    },
  };
}
