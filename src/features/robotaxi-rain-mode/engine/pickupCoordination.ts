import type {
  OperationNotice,
  PickupSelectionOutput,
  VehicleApproachRoute,
} from "../data/types";

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
