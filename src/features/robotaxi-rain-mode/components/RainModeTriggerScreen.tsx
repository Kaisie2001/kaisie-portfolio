"use client";

import { getComparisonCandidates } from "../data/demoDataAdapter";
import type { RainModeDemoBundle } from "../data/types";
import { formatRainIntensity, formatWeatherStatus } from "../data/formatLabels";
import { EditableRainMap } from "./map/EditableRainMap";
import { MapFirstLayout } from "./MapFirstLayout";
import { PrimaryButton } from "./PrimaryButton";
import { RainModeBanner } from "./RainModeBanner";

type RainModeTriggerScreenProps = {
  bundle: RainModeDemoBundle;
  onContinue: () => void;
};

export function RainModeTriggerScreen({ bundle, onContinue }: RainModeTriggerScreenProps) {
  const { service_status: s, scenario } = bundle;
  const preview = getComparisonCandidates(bundle);

  return (
    <MapFirstLayout
      map={
        <EditableRainMap
          candidates={preview}
          selectedPudoId={preview[0]?.pudo_id ?? ""}
          userLocation={bundle.user_location}
        />
      }
      topOverlay={<RainModeBanner />}
      sheetTitle="Rain detected"
      sheetSubtitle="Pickup and waiting time may be affected."
      sheetFooter={<PrimaryButton onClick={onContinue}>Check service status</PrimaryButton>}
      sheetChildren={
        <div className="space-y-2 pb-2 text-[13px] text-[var(--rain-text-secondary,#666)]">
          <p>
            <span className="font-medium text-[var(--rain-text-primary,#1a1a1a)]">
              {formatWeatherStatus(s.weather_status)}
            </span>
            {" · "}
            {formatRainIntensity(s.rain_intensity)} intensity
          </p>
          {scenario.area_name ? (
            <p>
              {scenario.area_name} · {scenario.city}
            </p>
          ) : null}
        </div>
      }
    />
  );
}
