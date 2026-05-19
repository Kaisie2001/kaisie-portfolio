import type {
  CandidateScore,
  EtaEstimate,
  PudoCandidate,
  RainModeThresholds,
  RainModeWeights,
} from "../data/types";
import type { ExposureResult } from "./exposureCalculator";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function scoreLowerIsBetter(value: number, max: number) {
  return clamp01(1 - value / max);
}

export type RainComfortNormalizationContext = {
  maxRainExposedDistanceM: number;
  maxWalkingDistanceM: number;
  maxVehicleEtaMin: number;
};

export const RAIN_COMFORT_WEIGHTS = {
  shelter: 0.3,
  covered: 0.2,
  sameSide: 0.1,
  recognition: 0.1,
  exposed: 0.3,
  walk: 0.1,
  eta: 0.1,
  crossing: 0.08,
};

export function calculateRainComfortScore(
  candidate: PudoCandidate,
  normalizationContext: RainComfortNormalizationContext,
) {
  const walkingDistanceM = candidate.walkingDistanceM ?? candidate.walking_distance_m;
  const rainExposedDistanceM =
    candidate.rainExposedDistanceM ??
    candidate.rainExposedWalkingDistanceM ??
    candidate.rain_exposed_distance_m;
  const vehicleEtaMin = candidate.vehicleEtaMin ?? candidate.vehicle_eta_min;
  const shelterScore = candidate.shelterScore ?? candidate.shelter_score;
  const coveredRatio =
    candidate.coveredRatio ??
    (walkingDistanceM === 0
      ? 0
      : (candidate.coveredDistanceM ??
          candidate.coveredWalkingDistanceM ??
          candidate.covered_distance_m ??
          0) / walkingDistanceM);
  const sameSideAccessScore =
    candidate.sameSideAccess ?? candidate.same_side_access ? 1 : 0;
  const crossingPenalty = candidate.crossingCount ?? candidate.crossing_count ?? 0;
  const normalizedRainExposedDistance =
    normalizationContext.maxRainExposedDistanceM === 0
      ? 0
      : rainExposedDistanceM / normalizationContext.maxRainExposedDistanceM;
  const normalizedWalkingDistance =
    normalizationContext.maxWalkingDistanceM === 0
      ? 0
      : walkingDistanceM / normalizationContext.maxWalkingDistanceM;
  const normalizedVehicleEta =
    normalizationContext.maxVehicleEtaMin === 0
      ? 0
      : vehicleEtaMin / normalizationContext.maxVehicleEtaMin;

  // These weights are demo parameters only. In production, they should be
  // calibrated with user behavior and operations data.
  const score =
    RAIN_COMFORT_WEIGHTS.shelter * shelterScore +
    RAIN_COMFORT_WEIGHTS.covered * coveredRatio +
    RAIN_COMFORT_WEIGHTS.sameSide * sameSideAccessScore +
    RAIN_COMFORT_WEIGHTS.recognition * (candidate.recognizabilityScore ?? 0.5) -
    RAIN_COMFORT_WEIGHTS.exposed * normalizedRainExposedDistance -
    RAIN_COMFORT_WEIGHTS.walk * normalizedWalkingDistance -
    RAIN_COMFORT_WEIGHTS.eta * normalizedVehicleEta -
    RAIN_COMFORT_WEIGHTS.crossing * crossingPenalty;

  return Math.round(score * 1000) / 10;
}

export function scoreCandidate(
  candidate: PudoCandidate,
  exposure: ExposureResult,
  eta: EtaEstimate,
  thresholds: RainModeThresholds,
  weights: RainModeWeights,
): CandidateScore {
  const coveredRatio =
    exposure.walkingDistanceM === 0
      ? 0
      : exposure.coveredWalkingDistanceM / exposure.walkingDistanceM;
  const components = {
    walkingDistance: scoreLowerIsBetter(
      exposure.walkingDistanceM,
      thresholds.maxWalkingDistanceM,
    ),
    rainExposure: scoreLowerIsBetter(
      exposure.rainExposedWalkingDistanceM,
      thresholds.maxExposedWalkingDistanceM,
    ),
    coveredWalking: clamp01(coveredRatio),
    shelterScore: clamp01(candidate.shelterScore ?? candidate.shelter_score),
    sameSideAccess: candidate.sameSideAccess ?? candidate.same_side_access ? 1 : 0,
    crossingCount: scoreLowerIsBetter(
      candidate.crossingCount ?? candidate.crossing_count ?? 0,
      thresholds.maxCrossingCount + 1,
    ),
    vehicleEta: scoreLowerIsBetter(eta.vehicle_eta_min, 10),
    boardingTime: scoreLowerIsBetter(
      eta.estimated_boarding_time_min ?? eta.vehicle_eta_min,
      12,
    ),
    recognizability: clamp01(candidate.recognizabilityScore ?? 0.5),
    demandProximity: clamp01(candidate.demandProximityScore ?? 0.5),
  };
  const weightedScore = Object.entries(components).reduce(
    (sum, [key, value]) => sum + value * weights[key as keyof RainModeWeights],
    0,
  );
  const rainComfortScore = calculateRainComfortScore(candidate, {
    maxRainExposedDistanceM: thresholds.maxExposedWalkingDistanceM,
    maxWalkingDistanceM: thresholds.maxWalkingDistanceM,
    maxVehicleEtaMin: 10,
  });

  return {
    pudoId: candidate.id ?? candidate.pudo_id,
    rainComfortScore,
    weightedScore: Math.round(weightedScore * 1000) / 10,
    components,
  };
}

export function scoreCandidates(
  candidates: PudoCandidate[],
  exposureByPudo: Record<string, ExposureResult>,
  etaByPudo: Record<string, EtaEstimate>,
  thresholds: RainModeThresholds,
  weights: RainModeWeights,
) {
  return candidates
    .map((candidate) => {
      const id = candidate.id ?? candidate.pudo_id;
      return scoreCandidate(
        candidate,
        exposureByPudo[id],
        etaByPudo[id],
        thresholds,
        weights,
      );
    })
    .sort((a, b) => b.weightedScore - a.weightedScore);
}
