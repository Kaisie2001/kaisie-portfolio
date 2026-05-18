"use client";

import { getServiceDisplayMetrics } from "../data/demoData";
import type { MapGeoLayers } from "../data/loadMapData";
import type { RainModeDemoBundle } from "../data/types";
import { MapFirstLayout } from "./MapFirstLayout";
import { PrimaryButton } from "./PrimaryButton";
import { StatusChip } from "./StatusChip";
import { RobotaxiMap } from "./map/RobotaxiMapLazy";

type RainyServiceStatusScreenProps = {
  bundle: RainModeDemoBundle;
  mapLayers: MapGeoLayers;
  onContinue: () => void;
};

export function RainyServiceStatusScreen({
  bundle,
  mapLayers,
  onContinue,
}: RainyServiceStatusScreenProps) {
  const m = getServiceDisplayMetrics(bundle);

  return (
    <MapFirstLayout
      map={
        <RobotaxiMap
          mode="serviceStatus"
          mapLayers={mapLayers}
          bundle={bundle}
          selectedZoneId=""
        />
      }
      sheetTitle={m.title}
      sheetSubtitle={m.subtitle}
      sheetFooter={
        <PrimaryButton onClick={onContinue}>Choose pick-up option</PrimaryButton>
      }
      sheetChildren={
        <div className="space-y-3 pb-2">
          <div className="grid grid-cols-2 gap-2">
            <StatusChip label="Estimated wait" value={m.estimatedWait} />
            <StatusChip label="Usual wait" value={m.usualWait} />
            <StatusChip label="Rain delay" value={m.rainDelay} tone="warning" />
            <StatusChip label="Queue ahead" value={m.queueAhead} />
            <StatusChip label="Nearby vehicles" value={m.nearbyVehicles} />
            <StatusChip label="ETA uncertainty" value={m.etaUncertainty} tone="info" />
          </div>
          <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-[var(--rain-text-secondary,#666)]">
            <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#e0e0e0] text-[8px] font-bold text-[#666]">
              i
            </span>
            Arrival times may change slightly as conditions update.
          </p>
        </div>
      }
    />
  );
}
