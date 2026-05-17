"use client";

import type { PudoCandidate, RainModeDemoBundle } from "../data/types";
import { CarIcon, PinIcon, UmbrellaIcon, WalkIcon } from "./icons/RainModeIcons";
import { DetailRow } from "./DetailRow";
import { DemoDisclaimer } from "./DemoDisclaimer";
import { EditableRainMap } from "./map/EditableRainMap";
import { MapFirstLayout } from "./MapFirstLayout";
import { PrimaryButton } from "./PrimaryButton";
import { ValidationBanner } from "./ValidationBanner";

type SelectedPickupGuidanceScreenProps = {
  bundle: RainModeDemoBundle;
  selected: PudoCandidate;
  onRestart?: () => void;
  mode?: "confirm" | "walking";
};

export function SelectedPickupGuidanceScreen({
  bundle,
  selected,
  onRestart,
  mode = "confirm",
}: SelectedPickupGuidanceScreenProps) {
  const route = bundle.walking_routes.find((r) => r.pudo_id === selected.pudo_id);
  const walkMin =
    selected.walking_time_min ??
    Math.max(1, Math.round(selected.walking_distance_m / 80));
  const landmark =
    selected.osm_reference?.includes("Mall") || selected.osm_reference?.includes("海岸")
      ? "Mall North Entrance"
      : selected.osm_reference ?? selected.label_en;

  const isWalking = mode === "walking";

  return (
    <MapFirstLayout
      map={
        <EditableRainMap
          candidates={[selected]}
          selectedPudoId={selected.pudo_id}
          route={route}
          userLocation={bundle.user_location}
          showVehicle={isWalking}
          vehicleDistanceLabel="1.2 km"
        />
      }
      sheetTitle={isWalking ? "Robotaxi is on the way" : "Confirm your pickup"}
      sheetFooter={
        <PrimaryButton onClick={onRestart ?? (() => undefined)}>
          {isWalking ? "Start walking" : "Request Robotaxi"}
        </PrimaryButton>
      }
      sheetFooterSecondary={
        onRestart ? (
          <PrimaryButton variant="link" onClick={onRestart}>
            Change pickup
          </PrimaryButton>
        ) : undefined
      }
      sheetChildren={
        <div className="space-y-3 pb-2">
          {!isWalking ? (
            <div className="space-y-0.5">
              <DetailRow icon={<PinIcon color="#2e7d32" />}>
                Pickup: {selected.label_en} · {landmark}
              </DetailRow>
              <DetailRow icon={<span className="h-2 w-2 rounded-full bg-[#1976d2]" />}>
                Drop-off: Coastal City Mall
              </DetailRow>
              <DetailRow icon={<WalkIcon />}>
                Walk to pickup: {selected.walking_distance_m} m · about {walkMin} min
              </DetailRow>
              <DetailRow icon={<CarIcon />}>
                Vehicle dispatch ETA: {selected.vehicle_eta_min} min
              </DetailRow>
              <DetailRow icon={<UmbrellaIcon />}>
                Rain exposure: Only {selected.rain_exposed_distance_m} m exposed to rain
              </DetailRow>
            </div>
          ) : (
            <div className="status-grid grid grid-cols-2 gap-2 text-[11px]">
              <StatusCell label="Vehicle assigned" value="✓" />
              <StatusCell label="Approaching" value="Coastal Avenue" />
              <StatusCell label="Distance" value="1.2 km away" />
              <StatusCell label="Turns" value="2 turns to pickup" />
              <StatusCell
                label="Arriving in"
                value={`${selected.vehicle_eta_min} min`}
                sub="ETA may vary by ±2 min"
                className="col-span-2"
              />
            </div>
          )}

          {isWalking ? (
            <>
              <p className="text-[13px] font-semibold text-[var(--rain-text-primary,#1a1a1a)]">
                Pickup guidance
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--rain-text-secondary,#666)]">
                <span>Walk {selected.walking_distance_m} m to {landmark}</span>
                <span>About {walkMin} min on foot</span>
                <span>Only {selected.rain_exposed_distance_m} m exposed to rain</span>
                {selected.covered_distance_m != null ? (
                  <span>Covered distance: {selected.covered_distance_m} m</span>
                ) : null}
              </div>
            </>
          ) : null}

          <ValidationBanner
            message={
              isWalking
                ? "Valid pickup point confirmed"
                : "This pickup point is valid for Robotaxi boarding"
            }
            submessage={
              isWalking ? "Please arrive at the pickup point before the vehicle." : undefined
            }
          />

          <DemoDisclaimer text={bundle.data_source_meta.disclaimer} compact />
        </div>
      }
    />
  );
}

function StatusCell({
  label,
  value,
  sub,
  className = "",
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-[#eeeeee] bg-[#fafafa] px-2 py-1.5 ${className}`}
    >
      <p className="text-[10px] text-[var(--rain-text-secondary,#666)]">{label}</p>
      <p className="font-medium text-[var(--rain-text-primary,#1a1a1a)]">{value}</p>
      {sub ? <p className="text-[9px] text-[var(--rain-text-secondary,#666)]">{sub}</p> : null}
    </div>
  );
}
