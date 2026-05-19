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

export type RobotaxiDemoStageId =
  | "context-trigger"
  | "service-gate"
  | "pudo-selection"
  | "pickup-coordination";

export type RobotaxiInteractionEvent =
  | "trip_setup_confirmed"
  | "service_status_confirmed"
  | "pickup_option_selected"
  | "pickup_confirmed"
  | "walking_guidance_started";

export type FigmaRainModeDemoProps = {
  /** Existing site-level language passed by the page. */
  lang?: Lang;
  /** Slideshow stage controlled by the case-study section. */
  activeStage?: RobotaxiDemoStageId;
  activeTechStage?: RobotaxiDemoStageId;
  selectedPickupOption?: PickupId;
  lastInteractionEvent?: RobotaxiInteractionEvent | null;
  /** Keeps phone primary actions aligned with stage navigation. */
  slideshowMode?: boolean;
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
  onTripSetupConfirmed?: () => void;
  onServiceStatusConfirmed?: () => void;
  onPickupOptionSelected?: (option: PickupId) => void;
  onPickupConfirmed?: () => void;
  onWalkingGuidanceStarted?: () => void;
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
  activeStage,
  activeTechStage,
  selectedPickupOption,
  lastInteractionEvent,
  slideshowMode = false,
  screen: controlledScreen,
  onScreenChange,
  pauseDispatchAuto = false,
  guidedPanel,
  guidedStep,
  guidedPreviewOption = null,
  onUserInteraction,
  onTripSetupConfirmed,
  onServiceStatusConfirmed,
  onPickupOptionSelected,
  onPickupConfirmed,
  onWalkingGuidanceStarted,
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
  const { scenario, randomSimulateUserLocation, randomPickupAnchorOnly } =
    useScenario();

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
            : "figma-demo-stage figma-demo-stage--shared-board"
        }
        onPointerDownCapture={() => onUserInteraction?.()}
      >
        {guidedPanel ? (
          <div className="figma-demo-guided-panel">{guidedPanel}</div>
        ) : null}
        <div
          className={
            guidedPanel ? "figma-demo-center" : "figma-demo-center figma-demo-phone-slot"
          }
        >
          <div className="figma-demo-center__phone">
            <PhoneFrame>
              <SheetHeightProvider screenKey={screen}>
                <FigmaDemoStage
                  screen={screen}
                  onScreenChange={setScreen}
                  pauseDispatchAuto={pauseDispatchAuto}
                  guidedStep={guidedStep}
                  guidedPreviewOption={guidedPreviewOption}
                  selectedPickupOption={selectedPickupOption}
                  slideshowMode={slideshowMode}
                  onUserInteraction={onUserInteraction}
                  onTripSetupConfirmed={onTripSetupConfirmed}
                  onServiceStatusConfirmed={onServiceStatusConfirmed}
                  onPickupOptionSelected={onPickupOptionSelected}
                  onPickupConfirmed={onPickupConfirmed}
                  onStartWalking={() => {
                    onUserInteraction?.();
                    onWalkingGuidanceStarted?.();
                    setToast("Navigation started.");
                    window.setTimeout(() => setToast(null), 2500);
                  }}
                />
              </SheetHeightProvider>
            </PhoneFrame>
          </div>
        </div>
        <motion.div
          key={activeTechStage ?? activeStage ?? "context-trigger"}
          className={
            guidedPanel
              ? "figma-demo-technical"
              : "figma-demo-technical figma-demo-technical-slot"
          }
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <TechnicalEnginePanel
            screen={screen}
            lang={lang}
            activeStage={activeTechStage ?? activeStage}
            selectedPickupOption={
              selectedPickupOption ?? guidedPreviewOption ?? scenario.selectedZoneId
            }
            lastInteractionEvent={lastInteractionEvent}
          />
        </motion.div>
        <div className="figma-demo-board-controls">
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
  selectedPickupOption?: PickupId;
  slideshowMode?: boolean;
  onUserInteraction?: () => void;
  onTripSetupConfirmed?: () => void;
  onServiceStatusConfirmed?: () => void;
  onPickupOptionSelected?: (option: PickupId) => void;
  onPickupConfirmed?: () => void;
  onStartWalking: () => void;
};

function FigmaDemoStage({
  screen,
  onScreenChange,
  pauseDispatchAuto = false,
  guidedStep,
  guidedPreviewOption = null,
  selectedPickupOption,
  slideshowMode = false,
  onUserInteraction,
  onTripSetupConfirmed,
  onServiceStatusConfirmed,
  onPickupOptionSelected,
  onPickupConfirmed,
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
    generateDemoTrip,
  } = useScenario();
  const [dispatchPhase, setDispatchPhase] = useState<DispatchPhase>("searching");
  const dispatchAutoRef = useRef(true);
  const pickup = scenario.selectedZoneId;
  const displayPickup =
    selectedPickupOption ??
    (guidedStep === 2 && guidedPreviewOption
      ? guidedPreviewOption
      : pickup);

  const handlePickupSelect = (id: PickupId) => {
    onUserInteraction?.();
    setSelectedZoneId(id);
    onPickupOptionSelected?.(id);
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
    onPickupConfirmed?.();
    onScreenChange(slideshowMode ? 4 : 1);
  };

  const handleDropoffSelect = (location: { lng: number; lat: number; label: string }) => {
    setDropoffLocation(location);
    onScreenChange(1);
  };

  const handleRequestRobotaxi = () => {
    requestRobotaxi();
    onTripSetupConfirmed?.();
    onScreenChange(2);
  };

  const handleServiceStatusContinue = () => {
    onServiceStatusConfirmed?.();
    onScreenChange(3);
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
        if (slideshowMode && !canRequestRobotaxi(scenario)) {
          generateDemoTrip();
        }
        break;
      case 2:
        ensurePickupZones();
        break;
      case 3:
        if (ensurePickupZones()) {
          if (!scenario.pickupZoneConfirmed) {
            confirmPickupZone(slideshowMode ? scenario.selectedZoneId : "sheltered");
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
    generateDemoTrip,
    slideshowMode,
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
              onContinue={slideshowMode ? handleServiceStatusContinue : undefined}
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
