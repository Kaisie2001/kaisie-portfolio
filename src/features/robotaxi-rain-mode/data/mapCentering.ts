import type L from "leaflet";
import type { RobotaxiScenario } from "./scenarioTypes";
import { centerMapOnCurrent } from "./scenarioMapBounds";

/** @deprecated Use centerMapOnCurrent from scenarioMapBounds */
export function centerMapOnUserLocation(
  map: L.Map,
  sheetCoverPct: number,
  scenario: RobotaxiScenario,
  options?: { zoom?: number; animate?: boolean },
): void {
  centerMapOnCurrent(map, scenario, sheetCoverPct, options);
}
