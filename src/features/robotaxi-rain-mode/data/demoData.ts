import type { RainModeDemoBundle } from "./types";

export type ServiceDisplayMetrics = {
  title: string;
  subtitle: string;
  estimatedWait: string;
  usualWait: string;
  rainDelay: string;
  queueAhead: string;
  nearbyVehicles: string;
  etaUncertainty: string;
};

/** Simulated operational metrics for portfolio demo (not live fleet data). */
export function getServiceDisplayMetrics(bundle: RainModeDemoBundle): ServiceDisplayMetrics {
  const notice = bundle.operation_notices.find(
    (n) => n.notice_id === bundle.service_status.operation_notice_id,
  );
  const supply = bundle.service_status.vehicle_supply_level;
  const queue = bundle.service_status.queue_status;

  const estimatedWait =
    supply === "very_low" ? "12–15 min" : supply === "low" ? "8–10 min" : "5–7 min";
  const usualWait = "5 min";
  const rainDelay = bundle.service_status.rain_mode_enabled ? "+3 to 5 min" : "+0 min";
  const queueAhead =
    queue === "longer_than_usual" ? "3 requests" : queue === "unavailable" ? "—" : "1 request";
  const nearbyVehicles =
    supply === "unavailable" ? "0" : supply === "very_low" ? "4" : supply === "low" ? "12" : "18";
  const etaUncertainty =
    bundle.service_status.eta_reliability === "low"
      ? "±4 min"
      : bundle.service_status.eta_reliability === "medium"
        ? "±2 min"
        : "±1 min";

  return {
    title: "Robotaxi service is available",
    subtitle:
      notice?.body_en ??
      "Rain is affecting arrival times in this area",
    estimatedWait,
    usualWait,
    rainDelay,
    queueAhead,
    nearbyVehicles,
    etaUncertainty,
  };
}

/** Demo drop-off used on trip / service status maps */
export const DEMO_DESTINATION = {
  label: "Coastal City Mall",
  geometry: {
    type: "Point" as const,
    coordinates: [113.9312, 22.5188] as [number, number],
  },
};

export function getVehicleDistanceLabel(): string {
  return "1.2 km away";
}

export function getVehicleApproachLabel(): string {
  return "Approaching via Coastal Avenue";
}
