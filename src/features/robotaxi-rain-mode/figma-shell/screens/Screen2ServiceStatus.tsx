"use client";

import { useEffect } from "react";
import type { DispatchPhase } from "../types";
import {
  IconAlertGray,
  IconCar,
  IconCheckBadge,
  IconClock,
  IconCloud,
  IconPeople,
  IconPinTeal,
} from "../icons";
import { ScreenShell } from "../ScreenShell";
import { useSheet } from "../SheetContext";
import { SheetHeader } from "../SheetHeader";
import { rainModeDemoData } from "../../data/rainModeDemoData";
import { selectPickupOptions } from "../../engine/selectPickupOptions";

type Props = {
  phase: DispatchPhase;
  pickupLabel: string;
  onBack: () => void;
  onCancel: () => void;
};

/** Runs inside BottomSheet so useSheet is valid */
function Screen2SheetBody({
  phase,
  pickupLabel,
  onBack,
  onCancel,
}: Props) {
  const assigned = phase === "assigned";
  const { fitToContent } = useSheet();
  const selection = selectPickupOptions(
    rainModeDemoData.pudoCandidates,
    rainModeDemoData.walkingRoutes,
    rainModeDemoData.thresholds,
    rainModeDemoData.weights,
  );
  const selectedEta = selection.etaByPudo[selection.selections.recommended];
  const etaMin = selectedEta?.vehicle_eta_min ?? 5;
  const boardingMin = selectedEta?.estimated_boarding_time_min ?? etaMin + 2;
  const queueAhead =
    rainModeDemoData.serviceStatus.queue_status === "normal" ? 2 : 3;
  const nearbyVehicleCount = selection.validCandidateCount;
  const rainDelayMin = rainModeDemoData.thresholds.boardingBufferMin;

  useEffect(() => {
    const id = requestAnimationFrame(fitToContent);
    return () => cancelAnimationFrame(id);
  }, [phase, fitToContent]);

  return (
    <>
      <SheetHeader
        onBack={onBack}
        title={assigned ? "Robotaxi assigned" : "Finding your Robotaxi"}
        centerTitle
      />
      <p className="figma-sheet-sub">
        {assigned
          ? "Your vehicle is heading to your pickup zone"
          : "Searching nearby vehicles for your selected pickup zone"}
      </p>
      {pickupLabel ? (
        <div className="figma-detail">
          <IconPinTeal />
          <span>
            Pickup: <strong>{pickupLabel}</strong>
          </span>
        </div>
      ) : null}
      <div className="figma-metrics">
        <div className="figma-metric">
          <div className="figma-metric-icon">
            <IconClock />
          </div>
          <span className="figma-metric-label">Estimated wait:</span>
          <span className="figma-metric-value">
            {assigned
              ? `${etaMin}–${etaMin + rainDelayMin} min`
              : `${boardingMin}–${boardingMin + rainDelayMin} min`}
          </span>
        </div>
        <div className="figma-metric">
          <div className="figma-metric-icon">
            <IconPeople />
          </div>
          <span className="figma-metric-label">Queue ahead:</span>
          <span className="figma-metric-value">
            {assigned ? "0 requests" : `${queueAhead} requests`}
          </span>
        </div>
        <div className="figma-metric">
          <div className="figma-metric-icon">
            <IconCar />
          </div>
          <span className="figma-metric-label">Nearby:</span>
          <span className="figma-metric-value">
            {assigned ? "1" : nearbyVehicleCount}
          </span>
        </div>
        <div className={`figma-metric${assigned ? "" : " is-warn"}`}>
          <div className="figma-metric-icon">
            <IconCloud />
          </div>
          <span className="figma-metric-label">Rain delay:</span>
          <span className="figma-metric-value">
            {assigned ? "Included" : `+${rainDelayMin} min`}
          </span>
        </div>
      </div>
      {assigned ? (
        <div className="figma-banner-ok">
          <IconCheckBadge />
          <span>Vehicle matched · opening trip view</span>
        </div>
      ) : (
        <div className="figma-notice-pill">
          <IconAlertGray />
          <span>Rain may slightly affect dispatch time.</span>
        </div>
      )}
      <div className="figma-sheet-actions figma-sheet-actions--compact">
        <button
          type="button"
          className="figma-btn-text figma-btn-text--compact"
          onClick={onCancel}
        >
          Cancel request
        </button>
      </div>
    </>
  );
}

export function Screen2ServiceStatus(props: Props) {
  return (
    <ScreenShell>
      <Screen2SheetBody {...props} />
    </ScreenShell>
  );
}
