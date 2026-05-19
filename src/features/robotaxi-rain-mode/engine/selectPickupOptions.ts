import type {
  PickupSelectionOutput,
  PudoCandidate,
  RainModeThresholds,
  RainModeWeights,
  WalkingRoute,
} from "../data/types";
import { calculateExposureByPudo } from "./exposureCalculator";
import { estimateEtaByPudo } from "./etaCalculator";
import { filterValidPudoCandidates } from "./hardFilter";
import { scoreCandidates } from "./scoring";

function candidateId(candidate: PudoCandidate) {
  return candidate.id ?? candidate.pudo_id;
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
  thresholds: RainModeThresholds,
  weights: RainModeWeights,
): PickupSelectionOutput {
  const hardFilter = filterValidPudoCandidates(candidates);
  const validIds = new Set(hardFilter.valid.map(candidateId));
  const validRoutes = walkingRoutes.filter((route) => validIds.has(route.pudo_id));
  const exposureByPudo = calculateExposureByPudo(validRoutes);
  const etaByPudo = estimateEtaByPudo(hardFilter.valid, thresholds);
  const scores = scoreCandidates(
    hardFilter.valid,
    exposureByPudo,
    etaByPudo,
    thresholds,
    weights,
  );

  const closest = minBy(
    hardFilter.valid,
    (candidate) => candidate.walkingDistanceM ?? candidate.walking_distance_m,
  );
  const sheltered = maxBy(scores, (score) => score.rainComfortScore);
  const soonest = minBy(
    hardFilter.valid,
    (candidate) => candidate.vehicleEtaMin ?? candidate.vehicle_eta_min,
  );

  return {
    rawCandidateCount: candidates.length,
    validCandidateCount: hardFilter.valid.length,
    hardFilterResults: hardFilter.results,
    rejectedCandidates: hardFilter.rejected,
    exposureByPudo,
    etaByPudo,
    scores,
    selections: {
      closest: candidateId(closest),
      sheltered: sheltered.pudoId,
      soonest: candidateId(soonest),
      recommended: scores[0]?.pudoId ?? candidateId(closest),
    },
  };
}
