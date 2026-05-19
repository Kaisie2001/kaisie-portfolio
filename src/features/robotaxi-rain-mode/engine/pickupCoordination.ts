import type {
  CandidateWithComputedMetrics,
  OperationNotice,
  PickupSelectionOutput,
  PudoCandidate,
  VehicleApproachRoute,
  WalkingRoute,
} from "../data/types";
import { calculateRouteExposure } from "./exposureCalculator";

const PICKUP_GEOFENCE_RADIUS_M = 25;
const BOARDING_BUFFER_MIN = 0.5;
const ETA_UPDATE_INTERVAL_SEC = 15;
const MAX_ARRIVAL_SYNC_GAP_MIN = 5;

export type PickupCoordinationOutput = {
  selectedPudoId: string;
  vehicleId: string;
  approachDistanceM: number;
  approachPointCount: number;
  passengerInstruction: string;
  operationNotice?: OperationNotice;
};

export function planPickupCoordination(
  selection: PickupSelectionOutput,
  vehicleRoutes: VehicleApproachRoute[],
  notices: OperationNotice[],
): PickupCoordinationOutput {
  const selectedPudoId = selection.selections.recommended;
  const route =
    vehicleRoutes.find((item) => item.pudoId === selectedPudoId) ??
    vehicleRoutes[0];

  return {
    selectedPudoId,
    vehicleId: route?.vehicleId ?? "rbtx-demo",
    approachDistanceM: route?.distanceM ?? 0,
    approachPointCount: route?.coordinates.length ?? 0,
    passengerInstruction:
      "Hold passenger at covered waiting point until the vehicle reaches the legal curbside PUDO.",
    operationNotice: notices[0],
  };
}

export type PickupCoordinationStateInput = {
  selectedCandidate: PudoCandidate | CandidateWithComputedMetrics;
  walkingRoute: WalkingRoute;
  vehicleApproachRoute: VehicleApproachRoute;
  vehicleEtaMin?: number;
  vehicleDistanceKm?: number;
  pickupValidity?: "confirmed" | "invalid" | "needs_recheck";
};

export type PickupCoordinationState = {
  selectedPudoId: string;
  selectedPickupLabel: string;
  passengerWalkDistanceM: number;
  passengerWalkTimeMin: number;
  rainExposedDistanceM: number;
  coveredDistanceM: number;
  vehicleDistanceKm: number;
  vehicleEtaMin: number;
  arrivalSyncGapMin: number;
  pickupValidity: "confirmed" | "invalid" | "needs_recheck";
  fallbackRequired: boolean;
  debug: {
    pickupGeofenceRadiusM: number;
    boardingBufferMin: number;
    etaUpdateIntervalSec: number;
    maxArrivalSyncGapMin: number;
  };
};

function candidateId(candidate: PudoCandidate | CandidateWithComputedMetrics) {
  return candidate.id ?? candidate.pudo_id;
}

function displayLabel(candidate: PudoCandidate | CandidateWithComputedMetrics) {
  if ((candidate.optionType ?? candidate.option_type) === "sheltered") {
    return "Sheltered";
  }

  return candidate.label_en?.replace(" area", "") ?? candidate.label ?? candidateId(candidate);
}

export function buildPickupCoordinationState({
  selectedCandidate,
  walkingRoute,
  vehicleApproachRoute,
  vehicleEtaMin,
  vehicleDistanceKm,
  pickupValidity = "confirmed",
}: PickupCoordinationStateInput): PickupCoordinationState {
  const exposure = calculateRouteExposure(walkingRoute);
  const passengerWalkTimeMin =
    selectedCandidate.walkingTimeMin ??
    selectedCandidate.walking_time_min ??
    walkingRoute.estimated_walk_time_min ??
    Math.ceil(exposure.totalDistanceM / 75);
  const resolvedVehicleEtaMin =
    vehicleEtaMin ??
    selectedCandidate.vehicleEtaMin ??
    selectedCandidate.vehicle_eta_min;
  const resolvedVehicleDistanceKm =
    vehicleDistanceKm ?? vehicleApproachRoute.distanceM / 1000;
  const arrivalSyncGapMin = Math.abs(
    resolvedVehicleEtaMin - passengerWalkTimeMin,
  );
  const fallbackRequired =
    pickupValidity !== "confirmed" || arrivalSyncGapMin > MAX_ARRIVAL_SYNC_GAP_MIN;

  return {
    selectedPudoId:
      (selectedCandidate as CandidateWithComputedMetrics).debugId ??
      candidateId(selectedCandidate),
    selectedPickupLabel: displayLabel(selectedCandidate),
    passengerWalkDistanceM: exposure.totalDistanceM,
    passengerWalkTimeMin,
    rainExposedDistanceM: exposure.rainExposedDistanceM,
    coveredDistanceM: exposure.coveredDistanceM,
    vehicleDistanceKm: Number(resolvedVehicleDistanceKm.toFixed(1)),
    vehicleEtaMin: resolvedVehicleEtaMin,
    arrivalSyncGapMin,
    pickupValidity,
    fallbackRequired,
    debug: {
      pickupGeofenceRadiusM: PICKUP_GEOFENCE_RADIUS_M,
      boardingBufferMin: BOARDING_BUFFER_MIN,
      etaUpdateIntervalSec: ETA_UPDATE_INTERVAL_SEC,
      maxArrivalSyncGapMin: MAX_ARRIVAL_SYNC_GAP_MIN,
    },
  };
}
