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
  const rainComfortScore = Math.round(
    (components.rainExposure * 0.45 +
      components.coveredWalking * 0.25 +
      components.shelterScore * 0.2 +
      components.sameSideAccess * 0.1) *
      100,
  );

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
