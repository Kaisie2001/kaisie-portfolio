"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/portfolioCopy";

import type { DispatchPhase, FigmaScreen, PickupId } from "./types";
import { DemoControlsPanel } from "./DemoControlsPanel";
import { PhoneFrame } from "./PhoneFrame";
import { MapControlProvider } from "./MapControlContext";
import { MapLocateButton } from "./MapLocateButton";
import {
  canRequestRobotaxi,
  hasPickupAnchor,
} from "../data/scenarioHelpers";
import { ScenarioProvider, useScenario } from "./ScenarioContext";
import { SheetHeightProvider, useSheetHeight } from "./SheetHeightContext";
import { MapView } from "./MapView";
import { mapKindFromScreen } from "./mapKind";
import { MapLegend } from "./mapOverlays";
import { IconRain } from "./icons";
import { Screen1SetTrip } from "./screens/Screen1SetTrip";
import { Screen2ServiceStatus } from "./screens/Screen2ServiceStatus";
import { Screen3ChoosePickup } from "./screens/Screen3ChoosePickup";
import { Screen4OnTheWay } from "./screens/Screen4OnTheWay";
import { Screen5DropoffSearch } from "./screens/Screen5DropoffSearch";
import { getDispatchPickupLabelForScenario } from "./ScenarioContext";
import type { StartingPlaceResult } from "../data/pickupAnchorSearch";
import { TechnicalEnginePanel } from "../components/TechnicalEnginePanel";

/** Dispatch screen: searching → assigned → auto open en-route screen */
const DISPATCH_SEARCH_MS = 4000;
const DISPATCH_ASSIGNED_MS = 1800;

export type FigmaRainModeDemoProps = {
  /** Existing site-level language passed by the page. */
  lang?: Lang;
  /** When set, screen is controlled by the parent (e.g. guided step navigator). */
  screen?: FigmaScreen;
  onScreenChange?: (screen: FigmaScreen) => void;
  /** Keeps dispatch on the searching state — used by guided demo step 3. */
  pauseDispatchAuto?: boolean;
  /** Optional left column inside the demo showcase (guided steps). Layout only. */
  guidedPanel?: ReactNode;
  /** Active guided step — applies minimal scenario presets when set. */
  guidedStep?: 1 | 2 | 3 | 4;
  /** Visual-only pickup highlight during guided step 2 preview (does not confirm). */
  guidedPreviewOption?: PickupId | null;
  /** Called when the user interacts with the demo (pauses guided autoplay). */
  onUserInteraction?: () => void;
};

/**
 * Flow: Trip Setup → Pick-up zones → Trip Setup → Drop-off → Dispatch search → En route
 */
export function FigmaRainModeDemo(props: FigmaRainModeDemoProps = {}) {
  return (
    <div className="figma-demo-wrap">
      <ScenarioProvider>
        <FigmaRainModeDemoInner {...props} />
      </ScenarioProvider>
    </div>
  );
}

function FigmaRainModeDemoInner({
  lang = "en",
  screen: controlledScreen,
  onScreenChange,
  pauseDispatchAuto = false,
  guidedPanel,
  guidedStep,
  guidedPreviewOption = null,
  onUserInteraction,
}: FigmaRainModeDemoProps) {
  const reduceMotion = useReducedMotion();
  const [internalScreen, setInternalScreen] = useState<FigmaScreen>(1);
  const isControlled = controlledScreen !== undefined;
  const screen = isControlled ? controlledScreen : internalScreen;

  const setScreen = (next: FigmaScreen) => {
    if (next === screen) return;
    onUserInteraction?.();
    if (!isControlled) setInternalScreen(next);
    onScreenChange?.(next);
  };

  const [toast, setToast] = useState<string | null>(null);
  const { randomSimulateUserLocation, randomPickupAnchorOnly } = useScenario();

  const handleRandomPickup = () => {
    if (screen === 3) {
      randomPickupAnchorOnly();
    } else {
      randomSimulateUserLocation();
    }
  };

  return (
    <>
      <div
        className={
          guidedPanel
            ? "figma-demo-stage figma-demo-stage--guided"
            : "figma-demo-stage"
        }
        onPointerDownCapture={() => onUserInteraction?.()}
      >
        {guidedPanel ? (
          <div className="figma-demo-guided-panel">{guidedPanel}</div>
        ) : null}
        <div className="figma-demo-center">
          <motion.div
            key={guidedStep ?? screen}
            className="figma-demo-center__phone"
            initial={
              guidedPanel && !reduceMotion ? { opacity: 0, y: 6 } : false
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: guidedPanel && !reduceMotion ? 0.3 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <PhoneFrame>
              <SheetHeightProvider screenKey={screen}>
                <FigmaDemoStage
                  screen={screen}
                  onScreenChange={setScreen}
                  pauseDispatchAuto={pauseDispatchAuto}
                  guidedStep={guidedStep}
                  guidedPreviewOption={guidedPreviewOption}
                  onUserInteraction={onUserInteraction}
                  onStartWalking={() => {
                    onUserInteraction?.();
                    setToast("Navigation started.");
                    window.setTimeout(() => setToast(null), 2500);
                  }}
                />
              </SheetHeightProvider>
            </PhoneFrame>
          </motion.div>
        </div>
        <div className="figma-demo-right-rail">
          <TechnicalEnginePanel screen={screen} lang={lang} />
          <DemoControlsPanel onRandomPickup={handleRandomPickup} />
        </div>
      </div>
      {toast ? (
        <div className="figma-toast" role="status">
          {toast}
        </div>
      ) : null}
    </>
  );
}

type FigmaDemoStageProps = {
  screen: FigmaScreen;
  onScreenChange: (s: FigmaScreen) => void;
  pauseDispatchAuto?: boolean;
  guidedStep?: 1 | 2 | 3 | 4;
  guidedPreviewOption?: PickupId | null;
  onUserInteraction?: () => void;
  onStartWalking: () => void;
};

function FigmaDemoStage({
  screen,
  onScreenChange,
  pauseDispatchAuto = false,
  guidedStep,
  guidedPreviewOption = null,
  onUserInteraction,
  onStartWalking,
}: FigmaDemoStageProps) {
  const {
    scenario,
    dropoffReady,
    setSelectedZoneId,
    setPickupAnchor,
    initializePickupNearCurrent,
    setDropoffLocation,
    confirmPickupZone,
    requestRobotaxi,
    continueToAssignedVehicle,
    markVehicleAssigned,
    cancelRobotaxiRequest,
  } = useScenario();
  const [dispatchPhase, setDispatchPhase] = useState<DispatchPhase>("searching");
  const dispatchAutoRef = useRef(true);
  const pickup = scenario.selectedZoneId;
  const displayPickup =
    guidedStep === 2 && guidedPreviewOption
      ? guidedPreviewOption
      : pickup;

  const handlePickupSelect = (id: PickupId) => {
    onUserInteraction?.();
    setSelectedZoneId(id);
  };
  const { heightPct } = useSheetHeight();
  const stageStyle = {
    ["--sheet-height" as string]: `${heightPct * 100}%`,
  } as CSSProperties;

  const openPickupZones = () => {
    if (!hasPickupAnchor(scenario) || scenario.pickupZoneCandidates.length === 0) {
      initializePickupNearCurrent();
    }
    onScreenChange(3);
  };

  const handleStartingPlace = (place: StartingPlaceResult) => {
    setPickupAnchor(place.location);
  };

  const confirmZoneAndReturn = () => {
    confirmPickupZone(scenario.selectedZoneId);
    onScreenChange(1);
  };

  const handleDropoffSelect = (location: { lng: number; lat: number; label: string }) => {
    setDropoffLocation(location);
    onScreenChange(1);
  };

  const handleRequestRobotaxi = () => {
    requestRobotaxi();
    onScreenChange(2);
  };

  useEffect(() => {
    if (guidedStep === undefined) return;

    const ensurePickupZones = () => {
      if (!hasPickupAnchor(scenario) || scenario.pickupZoneCandidates.length === 0) {
        initializePickupNearCurrent();
        return false;
      }
      return true;
    };

    switch (guidedStep) {
      case 1:
        break;
      case 2:
        ensurePickupZones();
        break;
      case 3:
        if (ensurePickupZones()) {
          if (
            !scenario.pickupZoneConfirmed ||
            scenario.selectedZoneId !== "sheltered"
          ) {
            confirmPickupZone("sheltered");
          }
        }
        setDispatchPhase("searching");
        break;
      case 4:
        if (scenario.requestStatus !== "onTheWay") {
          if (canRequestRobotaxi(scenario)) {
            continueToAssignedVehicle();
          }
        }
        break;
      default:
        break;
    }
  }, [
    guidedStep,
    scenario.pickupZoneCandidates.length,
    scenario.selectedZoneId,
    scenario.pickupZoneConfirmed,
    scenario.requestStatus,
    initializePickupNearCurrent,
    confirmPickupZone,
    markVehicleAssigned,
    continueToAssignedVehicle,
  ]);

  useEffect(() => {
    if (guidedStep !== 3) return;
    if (
      scenario.pickupZoneConfirmed &&
      canRequestRobotaxi(scenario) &&
      scenario.requestStatus === "idle"
    ) {
      requestRobotaxi();
    }
  }, [
    guidedStep,
    scenario.pickupZoneConfirmed,
    scenario.requestStatus,
    requestRobotaxi,
  ]);

  useEffect(() => {
    if (screen !== 2) {
      setDispatchPhase("searching");
      dispatchAutoRef.current = false;
      return;
    }

    setDispatchPhase("searching");
    if (pauseDispatchAuto) {
      dispatchAutoRef.current = false;
      return;
    }

    dispatchAutoRef.current = true;

    const assignTimer = window.setTimeout(() => {
      if (!dispatchAutoRef.current) return;
      markVehicleAssigned();
      setDispatchPhase("assigned");
    }, DISPATCH_SEARCH_MS);

    const enRouteTimer = window.setTimeout(() => {
      if (!dispatchAutoRef.current) return;
      dispatchAutoRef.current = false;
      continueToAssignedVehicle();
      onScreenChange(4);
    }, DISPATCH_SEARCH_MS + DISPATCH_ASSIGNED_MS);

    return () => {
      dispatchAutoRef.current = false;
      window.clearTimeout(assignTimer);
      window.clearTimeout(enRouteTimer);
    };
  }, [
    screen,
    pauseDispatchAuto,
    markVehicleAssigned,
    continueToAssignedVehicle,
    onScreenChange,
  ]);

  const handleCancelDispatch = () => {
    dispatchAutoRef.current = false;
    cancelRobotaxiRequest();
    onScreenChange(1);
  };

  const handleContinueToVehicle = () => {
    dispatchAutoRef.current = false;
    continueToAssignedVehicle();
    onScreenChange(4);
  };

  const dispatchPickupLabel = getDispatchPickupLabelForScenario(scenario);

  return (
    <MapControlProvider sheetCoverPct={heightPct}>
      <div className="figma-screen-transition">
        <div className="figma-screen-stage" style={stageStyle}>
          <MapView
            kind={mapKindFromScreen(screen)}
            scenario={scenario}
            dropoffReady={dropoffReady}
            selectedPickup={displayPickup}
          />

          {screen === 1 ? (
            <div className="figma-top">
              <span className="figma-rain-chip">
                <IconRain />
                Rain Mode · Moderate rain
              </span>
            </div>
          ) : null}

          {screen === 3 ? <MapLegend /> : null}

          <MapLocateButton />

          {screen === 1 ? (
            <Screen1SetTrip
              onOpenPickup={openPickupZones}
              onOpenDropoff={() => onScreenChange(5)}
              onRequestRobotaxi={handleRequestRobotaxi}
            />
          ) : null}
          {screen === 2 ? (
            <Screen2ServiceStatus
              phase={dispatchPhase}
              pickupLabel={dispatchPickupLabel}
              onBack={handleCancelDispatch}
              onCancel={handleCancelDispatch}
            />
          ) : null}
          {screen === 3 ? (
            <Screen3ChoosePickup
              selected={displayPickup}
              onSelect={handlePickupSelect}
              onBack={() => onScreenChange(1)}
              onConfirm={confirmZoneAndReturn}
              onSelectStartingPlace={handleStartingPlace}
            />
          ) : null}
          {screen === 4 ? (
            <Screen4OnTheWay
              pickup={displayPickup}
              onBack={() => onScreenChange(1)}
              onStartWalking={onStartWalking}
            />
          ) : null}
          {screen === 5 ? (
            <Screen5DropoffSearch
              onBack={() => onScreenChange(1)}
              onSelectDropoff={handleDropoffSelect}
            />
          ) : null}
        </div>
      </div>
    </MapControlProvider>
  );
}
