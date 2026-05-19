import type { EtaEstimate, PudoCandidate, RainModeThresholds } from "../data/types";

export const BOARDING_BUFFER_MIN = 0.5;

export function calculateEstimatedBoardingTime(candidate: PudoCandidate) {
  const etaMin = candidate.vehicleEtaMin ?? candidate.vehicle_eta_min;
  const walkMin =
    candidate.walkingTimeMin ??
    candidate.walking_time_min ??
    Math.ceil((candidate.walkingDistanceM ?? candidate.walking_distance_m) / 75);

  return Math.max(walkMin, etaMin) + BOARDING_BUFFER_MIN;
}

export function estimateEtaAndBoardingTime(
  candidate: PudoCandidate,
  thresholds: RainModeThresholds,
): EtaEstimate {
  void thresholds;
  const etaMin = candidate.vehicleEtaMin ?? candidate.vehicle_eta_min;
  const estimatedBoardingTimeMin = calculateEstimatedBoardingTime(candidate);

  return {
    pudo_id: candidate.id ?? candidate.pudo_id,
    vehicle_eta_min: etaMin,
    estimated_boarding_time_min: estimatedBoardingTimeMin,
    source_type: "simulated",
    confidence_level: candidate.confidence_level,
  };
}

export function estimateEtaByPudo(
  candidates: PudoCandidate[],
  thresholds: RainModeThresholds,
) {
  return Object.fromEntries(
    candidates.map((candidate) => {
      const estimate = estimateEtaAndBoardingTime(candidate, thresholds);
      return [estimate.pudo_id, estimate];
    }),
  );
}
