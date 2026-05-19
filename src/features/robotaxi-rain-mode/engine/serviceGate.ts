import type { RainModeThresholds, RainServiceStatus } from "../data/types";

export type ServiceGateOutput = {
  passed: boolean;
  serviceStatus: RainServiceStatus["service_status"];
  vehicleSupplyLevel: RainServiceStatus["vehicle_supply_level"];
  etaReliability: RainServiceStatus["eta_reliability"];
  queueStatus: RainServiceStatus["queue_status"];
  gateReason: string;
};

export function evaluateServiceGate(
  status: RainServiceStatus,
  thresholds: RainModeThresholds,
): ServiceGateOutput {
  const serviceAvailable =
    status.service_status === "available" ||
    status.service_status === "limited_available";
  const supplyAvailable = status.vehicle_supply_level !== "unavailable";
  const reliabilityAccepted =
    status.eta_reliability === "high" ||
    status.eta_reliability === thresholds.maxEtaReliabilityRisk;
  const passed = serviceAvailable && supplyAvailable && reliabilityAccepted;

  return {
    passed,
    serviceStatus: status.service_status,
    vehicleSupplyLevel: status.vehicle_supply_level,
    etaReliability: status.eta_reliability,
    queueStatus: status.queue_status,
    gateReason: passed
      ? "Service remains available; ETA reliability is acceptable for Rain Mode ranking."
      : "Service gate blocks pickup ranking because availability or ETA reliability is below threshold.",
  };
}
