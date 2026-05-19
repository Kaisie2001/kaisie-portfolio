import type {
  HardConstraintKey,
  HardConstraintResult,
  PudoCandidate,
} from "../data/types";

export const HARD_CONSTRAINTS: HardConstraintKey[] = [
  "isValidPudo",
  "legalStopping",
  "vehicleAccessible",
  "withinServiceArea",
  "withinOdd",
  "roadSafetyPass",
  "boardingSafetyPass",
  "realTimeRoadPass",
];

function constraintValue(candidate: PudoCandidate, key: HardConstraintKey) {
  switch (key) {
    case "isValidPudo":
      return candidate.isValidPudo ?? candidate.is_valid_pudo;
    case "legalStopping":
      return candidate.legalStopping ?? candidate.legal_stopping;
    case "vehicleAccessible":
      return candidate.vehicleAccessible ?? candidate.vehicle_accessible;
    case "withinServiceArea":
      return candidate.withinServiceArea ?? candidate.within_service_area;
    case "withinOdd":
      return candidate.withinOdd ?? candidate.within_odd;
    case "roadSafetyPass":
    case "boardingSafetyPass":
    case "realTimeRoadPass":
      return candidate[key] ?? false;
  }
}

export function evaluateHardConstraints(
  candidate: PudoCandidate,
): HardConstraintResult {
  const failed = HARD_CONSTRAINTS.filter((key) => !constraintValue(candidate, key));

  return {
    pudoId: candidate.id ?? candidate.pudo_id,
    passed: failed.length === 0,
    failed,
  };
}

export function filterValidPudoCandidates(candidates: PudoCandidate[]) {
  const results = candidates.map(evaluateHardConstraints);
  const valid = candidates.filter((candidate) => {
    const id = candidate.id ?? candidate.pudo_id;
    return results.find((result) => result.pudoId === id)?.passed;
  });

  return {
    results,
    valid,
    rejected: results.filter((result) => !result.passed),
  };
}

export function filterValidCandidates(candidates: PudoCandidate[]) {
  const filtered = filterValidPudoCandidates(candidates);

  return {
    validCandidates: filtered.valid,
    rejectedCandidates: filtered.rejected.map((result) => ({
      candidateId: result.pudoId,
      reasons: result.failed,
    })),
  };
}
