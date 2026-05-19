/** External technical stages — driven by demo events, not phone screen. */
export type RobotaxiDemoStageId =
  | "empty"
  | "context-trigger"
  | "service-gate"
  | "pudo-selection"
  | "pickup-coordination";

import type { PickupId } from "./types";

export type RobotaxiDemoEventDetail = {
  pickupOption?: PickupId;
};

/** Events emitted by the phone demo upward to the portfolio shell. */
export type RobotaxiDemoEvent =
  | "demo_idle"
  | "scenario_generated"
  | "trip_setup_completed"
  | "pickup_candidates_generated"
  | "pickup_option_selected"
  | "service_status_checked"
  | "robotaxi_requested"
  | "vehicle_assigned"
  | "walking_guidance_started"
  | "demo_reset";

/** Maps a demo event to the technical explanation stage (panel only). */
export function techStageFromDemoEvent(
  event: RobotaxiDemoEvent,
): RobotaxiDemoStageId {
  switch (event) {
    case "demo_idle":
    case "demo_reset":
      return "empty";
    case "scenario_generated":
    case "trip_setup_completed":
      return "context-trigger";
    case "pickup_candidates_generated":
    case "pickup_option_selected":
      return "pudo-selection";
    case "service_status_checked":
      return "service-gate";
    case "robotaxi_requested":
    case "vehicle_assigned":
    case "walking_guidance_started":
      return "pickup-coordination";
  }
}

export function isScenarioGeneratedEvent(event: RobotaxiDemoEvent): boolean {
  return event !== "demo_idle" && event !== "demo_reset";
}
