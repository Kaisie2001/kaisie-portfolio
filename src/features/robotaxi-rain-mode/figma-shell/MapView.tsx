"use client";

import { RobotaxiMapLazy } from "../components/RobotaxiMapLazy";
import type { MapMode } from "../data/mapModes";
import type { RobotaxiScenario } from "../data/scenarioTypes";
import type { MapKind } from "./types";

type MapViewProps = {
  kind: MapKind;
  scenario: RobotaxiScenario;
  dimmed?: boolean;
  dropoffReady?: boolean;
  selectedPickup?: "closest" | "sheltered" | "soonest";
};

function mapKindToMode(kind: MapKind): MapMode {
  switch (kind) {
    case "entry":
      return "tripSetup";
    case "service":
      return "serviceStatus";
    case "pickup":
      return "choosePickup";
    case "enroute":
      return "robotaxiOnTheWay";
  }
}

export function MapView({
  kind,
  scenario,
  dimmed,
  dropoffReady = false,
  selectedPickup = "sheltered",
}: MapViewProps) {
  const mode = mapKindToMode(kind);

  return (
    <div
      className={`figma-map figma-map--${kind}${dimmed ? " dim" : ""}`}
      aria-hidden
    >
      <RobotaxiMapLazy
        mode={mode}
        scenario={scenario}
        selectedZoneId={selectedPickup}
        dropoffReady={dropoffReady}
      />
    </div>
  );
}
