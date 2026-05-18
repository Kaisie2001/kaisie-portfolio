import { DEMO_SCENARIO } from "./demoScenario";
import type { RobotaxiScenario } from "./scenarioTypes";
import { emptyLocation } from "./scenarioHelpers";

/** Empty trip setup — anchor, zone, and drop-off filled via in-app flow or demo panel */
export function createDefaultScenario(): RobotaxiScenario {
  const mapCenter = {
    lng: DEMO_SCENARIO.userLocation[0],
    lat: DEMO_SCENARIO.userLocation[1],
  };

  return {
    scenarioSeed: 42,
    userCurrentLocation: { ...mapCenter, label: "Current location" },
    pickupAnchorLocation: emptyLocation(),
    pickupAnchorName: "",
    pickupZoneCandidates: [],
    dropoffAnchorLocation: emptyLocation(),
    dropoffAnchorName: "",
    dropoffZoneCandidates: [],
    selectedDropoffZone: null,
    dropoffLocation: emptyLocation(),
    selectedZoneId: "sheltered",
    selectedPickupZone: null,
    pickupPlaceLabel: "",
    pickupZoneConfirmed: false,
    requestStatus: "idle",
    vehicleLocation: undefined,
  };
}

export function scenarioMatchesDefaultStaticRoutes(scenario: RobotaxiScenario): boolean {
  const eps = 0.0001;
  const near = (a: number, b: number) => Math.abs(a - b) < eps;
  return (
    near(scenario.pickupAnchorLocation.lng, DEMO_SCENARIO.userLocation[0]) &&
    near(scenario.pickupAnchorLocation.lat, DEMO_SCENARIO.userLocation[1]) &&
    near(scenario.dropoffLocation.lng, DEMO_SCENARIO.dropoffLocation[0]) &&
    near(scenario.dropoffLocation.lat, DEMO_SCENARIO.dropoffLocation[1]) &&
    Boolean(scenario.dropoffLocation.label?.trim()) &&
    Boolean(scenario.selectedPickupZone)
  );
}
