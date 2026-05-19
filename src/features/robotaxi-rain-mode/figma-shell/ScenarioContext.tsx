"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEMO_SCENARIO } from "../data/demoScenario";
import { createDefaultScenario } from "../data/scenarioDefaults";
import { displayPlaceLabel } from "../data/demoPlaceNames";
import { resolveDropoffPlaceLocation } from "../data/demoPlaceCoordinates";
import {
  canRequestRobotaxi,
  clearRouteFields,
  getPickupAnchor,
  getPickupAnchorName,
  getSelectedPickupZone,
  getTripOriginCoords,
  getUserCurrentLocation,
  hasDropoffLocation,
  hasPickupAnchor,
  hasPickupZoneConfirmed,
  hasUserLocation,
  pickupAnchorFromUserLocation,
  PICKUP_ANCHOR_SAME_AS_USER_METERS,
} from "../data/scenarioHelpers";
import type { ScenarioRoutesResult } from "../data/routeService";
import type { PickupZoneId, RobotaxiScenario, ScenarioLocation } from "../data/scenarioTypes";
import { formatPickupZoneFieldLabel, getDispatchPickupLabel } from "./pickupFieldLabel";
import {
  generateDropoffZoneForAnchor,
  generatePudoZonesForAnchor,
  preloadRoadLayers,
  provisionalDropoffZoneFromAnchor,
} from "../data/pudoZoneService";
import type { FetchRoutesOptions } from "../data/routeService";
import {
  distanceMeters,
  formatLngLat,
  generateVehicleNearZone,
  randomCurrentInServiceArea,
  randomDropoffFromCurrent,
  resetScenarioRandomSeed,
} from "../data/randomScenario";
import { fetchRoutesForScenario } from "../data/routeService";
import type { RobotaxiDemoEvent, RobotaxiDemoEventDetail } from "./demoEvents";

type ScenarioContextValue = {
  scenario: RobotaxiScenario;
  dropoffReady: boolean;
  pickupZoneConfirmed: boolean;
  requestRobotaxiReady: boolean;
  routesLoading: boolean;
  userCurrentLocation: ScenarioLocation;
  initializePickupNearCurrent: () => void;
  useCurrentLocationAsPickupAnchor: () => void;
  setSelectedZoneId: (id: PickupZoneId) => void;
  setPickupAnchor: (anchor: ScenarioLocation) => void;
  setDropoffLocation: (location: ScenarioLocation) => void;
  confirmPickupZone: (id?: PickupZoneId) => void;
  requestRobotaxi: () => void;
  continueToAssignedVehicle: () => void;
  markVehicleAssigned: () => void;
  cancelRobotaxiRequest: () => void;
  /** Trip setup / demo: moves blue dot + anchor together */
  randomSimulateUserLocation: () => void;
  /** Pickup search: moves anchor only, blue dot stays */
  randomPickupAnchorOnly: () => void;
  randomDropoff: () => void;
  generateDemoTrip: () => void;
  resetScenario: () => void;
  refreshRoutes: () => Promise<void>;
};

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

const DEFAULT_USER_LOCATION: ScenarioLocation = {
  lng: DEMO_SCENARIO.userLocation[0],
  lat: DEMO_SCENARIO.userLocation[1],
  label: "Current location",
};

async function attachPudoPickupZones(
  base: RobotaxiScenario,
): Promise<RobotaxiScenario> {
  const pudo = await generatePudoZonesForAnchor(base.pickupAnchorLocation);
  return {
    ...base,
    pickupZoneCandidates: pudo.zones,
    pudoRoadDataMissing: pudo.roadDataMissing,
    pudoMessage: pudo.message,
  };
}

async function attachDropoffPudo(
  base: RobotaxiScenario,
  anchor: ScenarioLocation,
): Promise<RobotaxiScenario> {
  const label = displayPlaceLabel(anchor.label);
  const dropAnchor: ScenarioLocation = {
    lng: anchor.lng,
    lat: anchor.lat,
    label,
  };
  const snap = await generateDropoffZoneForAnchor(dropAnchor);
  return {
    ...base,
    dropoffAnchorLocation: dropAnchor,
    dropoffAnchorName: label,
    dropoffLocation: { ...dropAnchor, label },
    dropoffZoneCandidates: snap.candidates,
    selectedDropoffZone: snap.selected,
    pudoRoadDataMissing: base.pudoRoadDataMissing || snap.roadDataMissing,
    pudoMessage: snap.message ?? base.pudoMessage,
  };
}

function mergeRouteFields(
  base: RobotaxiScenario,
  routes: ScenarioRoutesResult,
): RobotaxiScenario {
  const trip = routes.tripRoute ?? routes.tripOverviewRoute;
  const walk = routes.walkingRouteToPickup ?? routes.walkingRouteToSelectedPickup;
  const vehicle =
    routes.vehicleRouteToPickup ??
    routes.vehicleRouteToSelectedPickup ??
    routes.vehicleRoute;
  return {
    ...base,
    pickupZoneCandidates: routes.pickupZoneCandidates ?? base.pickupZoneCandidates,
    tripRoute: trip,
    tripOverviewRoute: trip,
    walkingRoutes: routes.walkingRoutes,
    walkingRouteToPickup: walk,
    walkingRouteToSelectedPickup: walk,
    vehicleRouteToPickup: vehicle,
    vehicleRoute: vehicle,
    vehicleRouteToSelectedPickup: vehicle,
    routesMissing: routes.routesMissing,
    routesMessage: routes.routesMessage,
  };
}

async function attachRoutes(
  base: RobotaxiScenario,
  options?: FetchRoutesOptions,
): Promise<RobotaxiScenario> {
  const routes = await fetchRoutesForScenario(base, options);
  return mergeRouteFields(base, routes);
}

async function attachPudoAndRoutes(base: RobotaxiScenario): Promise<RobotaxiScenario> {
  const withPudo = await attachPudoPickupZones(base);
  return attachRoutes(withPudo);
}

function anchorDisplayName(label: string): string {
  const trimmed = displayPlaceLabel(label).trim();
  return trimmed || "Current location";
}

function withPickupAnchor(
  prev: RobotaxiScenario,
  anchor: ScenarioLocation,
  anchorName: string,
): RobotaxiScenario {
  return {
    ...prev,
    pickupAnchorLocation: anchor,
    pickupAnchorName: anchorName,
    pickupZoneCandidates: [],
    selectedZoneId: "sheltered",
    selectedPickupZone: null,
    pickupPlaceLabel: anchorName,
    pickupZoneConfirmed: false,
    requestStatus: "idle",
    vehicleLocation: undefined,
    pudoRoadDataMissing: false,
    pudoMessage: undefined,
    ...clearRouteFields(prev),
  };
}

export function ScenarioProvider({
  children,
  onDemoEvent,
}: {
  children: ReactNode;
  onDemoEvent?: (event: RobotaxiDemoEvent, detail?: RobotaxiDemoEventDetail) => void;
}) {
  const [scenario, setScenario] = useState<RobotaxiScenario>(() =>
    createDefaultScenario(),
  );
  const [routesLoading, setRoutesLoading] = useState(false);
  const onDemoEventRef = useRef(onDemoEvent);
  onDemoEventRef.current = onDemoEvent;
  /** Defer so parent setState never runs during this provider's render/updater. */
  const emitDemoEvent = useCallback(
    (event: RobotaxiDemoEvent, detail?: RobotaxiDemoEventDetail) => {
      queueMicrotask(() => {
        onDemoEventRef.current?.(event, detail);
      });
    },
    [],
  );

  const dropoffReady = hasDropoffLocation(scenario);
  const pickupZoneConfirmed = hasPickupZoneConfirmed(scenario);
  const requestRobotaxiReady = canRequestRobotaxi(scenario);

  const applyScenario = useCallback(
    async (
      next: RobotaxiScenario,
      reloadRoutes = true,
      routeOptions?: FetchRoutesOptions,
    ) => {
      if (!reloadRoutes) {
        setScenario(next);
        return;
      }
      setRoutesLoading(true);
      try {
        setScenario(await attachRoutes(next, routeOptions));
      } finally {
        setRoutesLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    preloadRoadLayers();
    void applyScenario(createDefaultScenario());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load
  }, []);

  const bumpSeed = useCallback((prev: RobotaxiScenario) => {
    const seed = prev.scenarioSeed + 1;
    resetScenarioRandomSeed(seed);
    return seed;
  }, []);

  const refreshRoutes = useCallback(async () => {
    await applyScenario(scenario);
  }, [applyScenario, scenario]);

  const reloadPickupPudoAndRoutes = useCallback(async (base: RobotaxiScenario) => {
    setRoutesLoading(true);
    try {
      const withPudo = await attachPudoPickupZones(base);
      setScenario({
        ...withPudo,
        ...clearRouteFields(withPudo),
        routesMessage: "Loading walking routes…",
      });

      const routed = await attachRoutes(withPudo, { includeWalking: true });
      setScenario(routed);
      if (routed.pickupZoneCandidates.length > 0) {
        emitDemoEvent("pickup_candidates_generated");
      }
    } finally {
      setRoutesLoading(false);
    }
  }, [emitDemoEvent]);

  const reloadDropoffPudoAndRoutes = useCallback(
    async (base: RobotaxiScenario, anchor: ScenarioLocation) => {
      setRoutesLoading(true);
      try {
        let withPickup = base;
        if (!hasPickupAnchor(withPickup) && hasUserLocation(withPickup)) {
          const user = getUserCurrentLocation(withPickup);
          withPickup = {
            ...withPickup,
            pickupAnchorLocation: pickupAnchorFromUserLocation(user),
            pickupAnchorName: "Current location",
            pickupPlaceLabel: "Current location",
          };
        }
        if (
          withPickup.pickupZoneCandidates.length === 0 &&
          !withPickup.selectedPickupZone &&
          hasPickupAnchor(withPickup)
        ) {
          withPickup = await attachPudoPickupZones(withPickup);
        }

        const dropAnchor: ScenarioLocation = {
          lng: anchor.lng,
          lat: anchor.lat,
          label: displayPlaceLabel(anchor.label),
        };
        const provisional = provisionalDropoffZoneFromAnchor(dropAnchor);
        const optimistic: RobotaxiScenario = {
          ...withPickup,
          dropoffAnchorLocation: dropAnchor,
          dropoffAnchorName: dropAnchor.label,
          dropoffLocation: { ...dropAnchor },
          dropoffZoneCandidates: [provisional],
          selectedDropoffZone: provisional,
          ...clearRouteFields(withPickup),
        };
        setScenario(optimistic);

        const snap = await generateDropoffZoneForAnchor(dropAnchor);
        const selected = snap.selected ?? provisional;
        const withDrop: RobotaxiScenario = {
          ...optimistic,
          dropoffAnchorLocation: dropAnchor,
          dropoffAnchorName: dropAnchor.label,
          dropoffLocation: { ...dropAnchor },
          dropoffZoneCandidates: snap.candidates,
          selectedDropoffZone: selected,
          pudoRoadDataMissing: optimistic.pudoRoadDataMissing || snap.roadDataMissing,
          pudoMessage: snap.message ?? optimistic.pudoMessage,
        };
        setScenario(withDrop);

        setScenario(await attachRoutes(withDrop, { includeWalking: false }));
        emitDemoEvent("trip_setup_completed");
      } finally {
        setRoutesLoading(false);
      }
    },
    [emitDemoEvent],
  );

  const useCurrentLocationAsPickupAnchor = useCallback(() => {
    setScenario((prev) => {
      const user = getUserCurrentLocation(prev);
      const next = withPickupAnchor(
        prev,
        pickupAnchorFromUserLocation(user),
        "Current location",
      );
      void reloadPickupPudoAndRoutes(next);
      return next;
    });
  }, [reloadPickupPudoAndRoutes]);

  const initializePickupNearCurrent = useCallback(() => {
    setScenario((prev) => {
      const user = getUserCurrentLocation(prev);
      const next = withPickupAnchor(
        prev,
        pickupAnchorFromUserLocation(user),
        "Current location",
      );
      void reloadPickupPudoAndRoutes(next);
      return next;
    });
  }, [reloadPickupPudoAndRoutes]);

  const setPickupAnchor = useCallback((anchor: ScenarioLocation) => {
    if (!anchor.label.trim()) return;

    setScenario((prev) => {
      const user = getUserCurrentLocation(prev);
      let normalized: ScenarioLocation;
      let anchorName: string;

      const anchorMatchesUser =
        anchor.label === "Current location" ||
        distanceMeters(anchor, user) < PICKUP_ANCHOR_SAME_AS_USER_METERS;

      if (anchorMatchesUser) {
        normalized = pickupAnchorFromUserLocation(user);
        anchorName = "Current location";
      } else {
        normalized = {
          lng: anchor.lng,
          lat: anchor.lat,
          label: anchorDisplayName(anchor.label),
        };
        anchorName = anchorDisplayName(anchor.label);
      }

      const next = withPickupAnchor(prev, normalized, anchorName);
      void reloadPickupPudoAndRoutes(next);
      return next;
    });
  }, [reloadPickupPudoAndRoutes]);

  const setDropoffLocation = useCallback(
    (location: ScenarioLocation) => {
      setScenario((prev) => {
        if (!location.label.trim()) return prev;
        const tripOrigin = getTripOriginCoords(prev);
        const originLngLat = tripOrigin
          ? { lng: tripOrigin[0], lat: tripOrigin[1], label: "" }
          : hasPickupAnchor(prev)
            ? getPickupAnchor(prev)
            : getUserCurrentLocation(prev);
        const namedDropoff = resolveDropoffPlaceLocation(location.label);
        const resolved =
          namedDropoff ??
          (!location.lng && !location.lat
            ? { ...randomDropoffFromCurrent(originLngLat), label: location.label }
            : location);
        const anchorLoc: ScenarioLocation = {
          lng: resolved.lng,
          lat: resolved.lat,
          label: displayPlaceLabel(resolved.label),
        };
        const provisional = provisionalDropoffZoneFromAnchor(anchorLoc);
        const next: RobotaxiScenario = {
          ...prev,
          dropoffAnchorLocation: anchorLoc,
          dropoffAnchorName: anchorLoc.label,
          dropoffLocation: { ...anchorLoc },
          dropoffZoneCandidates: [provisional],
          selectedDropoffZone: provisional,
          requestStatus: "idle",
          ...clearRouteFields(prev),
        };
        void reloadDropoffPudoAndRoutes(next, anchorLoc);
        return next;
      });
    },
    [reloadDropoffPudoAndRoutes],
  );

  const randomSimulateUserLocation = useCallback(() => {
    const sampled = randomCurrentInServiceArea();
    const placeLabel = anchorDisplayName(sampled.label);
    const userLoc: ScenarioLocation = {
      lng: sampled.lng,
      lat: sampled.lat,
      label: "Current location",
    };
    const anchorLoc: ScenarioLocation = {
      lng: sampled.lng,
      lat: sampled.lat,
      label: placeLabel,
    };
    const keepDropoff = hasDropoffLocation(scenario)
      ? {
          anchor: scenario.dropoffAnchorLocation,
          zone: scenario.selectedDropoffZone,
          candidates: scenario.dropoffZoneCandidates,
          label: scenario.dropoffLocation.label,
        }
      : null;

    const next: RobotaxiScenario = {
      ...scenario,
      scenarioSeed: bumpSeed(scenario),
      userCurrentLocation: userLoc,
      pickupAnchorLocation: anchorLoc,
      pickupAnchorName: "Current location",
      pickupZoneCandidates: [],
      selectedZoneId: "sheltered",
      selectedPickupZone: null,
      pickupPlaceLabel: "Current location",
      pickupZoneConfirmed: false,
      requestStatus: "idle",
      vehicleLocation: undefined,
      dropoffAnchorLocation: keepDropoff?.anchor ?? scenario.dropoffAnchorLocation,
      dropoffAnchorName: keepDropoff?.label ?? scenario.dropoffAnchorName,
      dropoffLocation: keepDropoff
        ? { ...keepDropoff.anchor, label: keepDropoff.label }
        : scenario.dropoffLocation,
      dropoffZoneCandidates: keepDropoff?.candidates ?? [],
      selectedDropoffZone: keepDropoff?.zone ?? null,
      ...clearRouteFields(scenario),
    };
    void reloadPickupPudoAndRoutes(next);
  }, [reloadPickupPudoAndRoutes, scenario, bumpSeed]);

  const randomPickupAnchorOnly = useCallback(() => {
    setScenario((prev) => {
      const sampled = randomCurrentInServiceArea();
      const anchorName = anchorDisplayName(sampled.label);
      const anchorLoc: ScenarioLocation = {
        lng: sampled.lng,
        lat: sampled.lat,
        label: anchorName,
      };
      const next = withPickupAnchor(prev, anchorLoc, anchorName);
      void reloadPickupPudoAndRoutes(next);
      return next;
    });
  }, [reloadPickupPudoAndRoutes]);

  const randomDropoff = useCallback(() => {
    const tripOrigin = getTripOriginCoords(scenario);
    const origin = tripOrigin
      ? { lng: tripOrigin[0], lat: tripOrigin[1], label: "" }
      : hasPickupAnchor(scenario)
        ? getPickupAnchor(scenario)
        : getUserCurrentLocation(scenario);
    if (!hasUserLocation(scenario) && !hasPickupAnchor(scenario)) return;
    const anchorLoc = randomDropoffFromCurrent(origin);
    const base: RobotaxiScenario = {
      ...scenario,
      scenarioSeed: bumpSeed(scenario),
      requestStatus: "idle",
      ...clearRouteFields(scenario),
    };
    void reloadDropoffPudoAndRoutes(base, anchorLoc);
  }, [reloadDropoffPudoAndRoutes, scenario, bumpSeed]);

  const generateDemoTrip = useCallback(() => {
    const user = hasUserLocation(scenario)
      ? getUserCurrentLocation(scenario)
      : { ...DEFAULT_USER_LOCATION };
    const sampled = randomCurrentInServiceArea();
    const placeLabel = anchorDisplayName(sampled.label);
    const userLoc: ScenarioLocation = {
      lng: sampled.lng,
      lat: sampled.lat,
      label: "Current location",
    };
    const anchorLoc: ScenarioLocation = {
      lng: sampled.lng,
      lat: sampled.lat,
      label: placeLabel,
    };
    const dropoffAnchor = hasDropoffLocation(scenario)
      ? scenario.dropoffAnchorLocation
      : randomDropoffFromCurrent(anchorLoc);

    const base = withPickupAnchor(
      {
        ...scenario,
        scenarioSeed: bumpSeed(scenario),
        userCurrentLocation: userLoc,
      },
      anchorLoc,
      "Current location",
    );

    void (async () => {
      setRoutesLoading(true);
      try {
        const withPudo = await attachPudoPickupZones(base);
        const sheltered =
          withPudo.pickupZoneCandidates.find((z) => z.id === "sheltered") ??
          withPudo.pickupZoneCandidates[0];
        if (!sheltered) {
          setScenario(withPudo);
          return;
        }
        const withPickup: RobotaxiScenario = {
          ...withPudo,
          selectedZoneId: "sheltered",
          selectedPickupZone: sheltered,
          pickupZoneConfirmed: true,
          pickupPlaceLabel: "Current location",
          vehicleLocation: generateVehicleNearZone(sheltered, anchorLoc),
        };
        const withDrop = await attachDropoffPudo(withPickup, dropoffAnchor);
        setScenario(await attachRoutes(withDrop));
        emitDemoEvent("scenario_generated");
      } finally {
        setRoutesLoading(false);
      }
    })();
  }, [scenario, bumpSeed, emitDemoEvent]);

  const resetScenario = useCallback(() => {
    resetScenarioRandomSeed(42);
    void applyScenario(createDefaultScenario());
    emitDemoEvent("demo_reset");
  }, [applyScenario, emitDemoEvent]);

  const setSelectedZoneId = useCallback((id: PickupZoneId) => {
    setScenario((prev) => {
      const zone = prev.pickupZoneCandidates.find((z) => z.id === id);
      const anchor = getPickupAnchor(prev);
      const next: RobotaxiScenario = {
        ...prev,
        selectedZoneId: id,
        selectedPickupZone: prev.pickupZoneConfirmed && zone ? zone : prev.selectedPickupZone,
        vehicleLocation: zone
          ? generateVehicleNearZone(zone, anchor)
          : prev.vehicleLocation,
        walkingRouteToPickup: prev.walkingRoutes?.[id] ?? prev.walkingRouteToPickup,
        walkingRouteToSelectedPickup: prev.walkingRoutes?.[id],
      };
      if (!prev.pickupZoneConfirmed) {
        void applyScenario(next, true, {
          includeWalking: !hasDropoffLocation(prev),
        });
        return next;
      }
      if (hasDropoffLocation(prev)) {
        const cleared = { ...next, ...clearRouteFields(prev) };
        void applyScenario(cleared, true, { includeWalking: false });
        return cleared;
      }
      return next;
    });
  }, [applyScenario]);

  const confirmPickupZone = useCallback((id?: PickupZoneId) => {
    setScenario((prev) => {
      const zoneId = id ?? prev.selectedZoneId;
      const zone = prev.pickupZoneCandidates.find((z) => z.id === zoneId);
      if (!zone || !hasPickupAnchor(prev)) return prev;
      const placeLabel = getPickupAnchorName(prev);
      const anchor = getPickupAnchor(prev);
      const next: RobotaxiScenario = {
        ...prev,
        selectedZoneId: zoneId,
        selectedPickupZone: zone,
        pickupPlaceLabel: placeLabel,
        pickupAnchorName: placeLabel,
        pickupZoneConfirmed: true,
        requestStatus: "idle",
        vehicleLocation: generateVehicleNearZone(zone, anchor),
        walkingRouteToPickup: prev.walkingRoutes?.[zoneId],
        walkingRouteToSelectedPickup: prev.walkingRoutes?.[zoneId],
        ...clearRouteFields(prev),
      };
      void applyScenario(next, true, {
        includeWalking: !hasDropoffLocation(prev),
      });
      return next;
    });
  }, [applyScenario]);

  const requestRobotaxi = useCallback(() => {
    let requested = false;
    setScenario((prev) => {
      if (!canRequestRobotaxi(prev)) return prev;
      requested = true;
      return {
        ...prev,
        requestStatus: "searching",
        walkingRouteToPickup:
          prev.walkingRouteToPickup ??
          prev.walkingRoutes?.[prev.selectedZoneId],
        walkingRouteToSelectedPickup:
          prev.walkingRouteToPickup ??
          prev.walkingRoutes?.[prev.selectedZoneId],
      };
    });
    if (requested) {
      emitDemoEvent("robotaxi_requested");
    }
  }, [emitDemoEvent]);

  const markVehicleAssigned = useCallback(() => {
    let assigned = false;
    setScenario((prev) => {
      if (prev.requestStatus !== "searching") return prev;
      assigned = true;
      return { ...prev, requestStatus: "assigned" };
    });
    if (assigned) {
      emitDemoEvent("vehicle_assigned");
    }
  }, [emitDemoEvent]);

  const continueToAssignedVehicle = useCallback(() => {
    let enRoute = false;
    setScenario((prev) => {
      if (!canRequestRobotaxi(prev)) return prev;
      const zone = getSelectedPickupZone(prev);
      const anchor = getPickupAnchor(prev);
      if (!zone) return prev;
      enRoute = true;
      const next: RobotaxiScenario = {
        ...prev,
        requestStatus: "onTheWay",
        vehicleLocation:
          prev.vehicleLocation ?? generateVehicleNearZone(zone, anchor),
      };
      void applyScenario(next, true, { includeWalking: false });
      return next;
    });
    if (enRoute) {
      emitDemoEvent("vehicle_assigned");
    }
  }, [applyScenario, emitDemoEvent]);

  const cancelRobotaxiRequest = useCallback(() => {
    setScenario((prev) => ({
      ...prev,
      requestStatus: "idle",
    }));
  }, []);

  const value = useMemo(
    () => ({
      scenario,
      dropoffReady,
      pickupZoneConfirmed,
      requestRobotaxiReady,
      routesLoading,
      userCurrentLocation: scenario.userCurrentLocation,
      initializePickupNearCurrent,
      useCurrentLocationAsPickupAnchor,
      setSelectedZoneId,
      setPickupAnchor,
      setDropoffLocation,
      confirmPickupZone,
      requestRobotaxi,
      continueToAssignedVehicle,
      markVehicleAssigned,
      cancelRobotaxiRequest,
      randomSimulateUserLocation,
      randomPickupAnchorOnly,
      randomDropoff,
      generateDemoTrip,
      resetScenario,
      refreshRoutes,
    }),
    [
      scenario,
      dropoffReady,
      pickupZoneConfirmed,
      requestRobotaxiReady,
      routesLoading,
      initializePickupNearCurrent,
      useCurrentLocationAsPickupAnchor,
      setSelectedZoneId,
      setPickupAnchor,
      setDropoffLocation,
      confirmPickupZone,
      requestRobotaxi,
      continueToAssignedVehicle,
      markVehicleAssigned,
      cancelRobotaxiRequest,
      randomSimulateUserLocation,
      randomPickupAnchorOnly,
      randomDropoff,
      generateDemoTrip,
      resetScenario,
      refreshRoutes,
    ],
  );

  return (
    <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>
  );
}

export function useScenario() {
  const ctx = useContext(ScenarioContext);
  if (!ctx) {
    throw new Error("useScenario must be used within ScenarioProvider");
  }
  return ctx;
}

export function formatScenarioCoords(lng: number, lat: number) {
  return formatLngLat(lng, lat);
}

/** Trip Setup pickup field after zone is confirmed */
export function getTripSetupPickupLabel(scenario: RobotaxiScenario): string {
  if (!hasPickupZoneConfirmed(scenario)) return "";
  return formatPickupZoneFieldLabel(
    scenario.selectedZoneId,
    getPickupAnchorName(scenario),
  );
}

/** Finding your Robotaxi — omits generic "Current location" suffix */
export function getDispatchPickupLabelForScenario(
  scenario: RobotaxiScenario,
): string {
  if (!hasPickupZoneConfirmed(scenario)) return "";
  return getDispatchPickupLabel(
    scenario.selectedZoneId,
    getPickupAnchorName(scenario),
  );
}
