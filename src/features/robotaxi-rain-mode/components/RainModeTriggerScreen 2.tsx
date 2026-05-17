"use client";

import type { RainModeDemoBundle } from "../data/types";
import {
  formatRainIntensity,
  formatWeatherStatus,
} from "../data/formatLabels";
import { DemoDisclaimer } from "./DemoDisclaimer";
import { EditableRainMap } from "./map/EditableRainMap";
import { MapFirstLayout } from "./MapFirstLayout";
import { PrimaryButton } from "./PrimaryButton";
import { RainModeBanner } from "./RainModeBanner";
import { getComparisonCandidates } from "../data/demoDataAdapter";

type RainModeTriggerScreenProps = {
  bundle: RainModeDemoBundle;
  onContinue: () => void;
};

export function RainModeTriggerScreen({
  bundle,
  onContinue,
}: RainModeTriggerScreenProps) {
  const { service_status: s, scenario } = bundle;
  const previewCandidates = getComparisonCandidates(bundle);

  return (
    <MapFirstLayout
      map={
        <EditableRainMap
          candidates={previewCandidates}
          selectedPudoId={previewCandidates[0]?.pudo_id ?? ""}
          userLocation={bundle.user_location}
          compact={false}
        />
      }
      topOverlay={<RainModeBanner />}
      sheetTitle="Rain detected"
      sheetSubtitle="检测到降雨"
      sheetFooter={<PrimaryButton onClick={onContinue}>Check service status</PrimaryButton>}
      sheetChildren={
        <div className="space-y-3">
          <p className="text-[13px] leading-relaxed text-slate-300">
            Pickup and waiting time may be affected.
          </p>
          <p className="copy-cn text-[11px] text-slate-500">上车与等待体验可能受到影响。</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <p className="text-slate-500">Weather</p>
              <p className="font-medium capitalize text-slate-100">
                {formatWeatherStatus(s.weather_status)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Intensity</p>
              <p className="font-medium text-slate-100">
                {formatRainIntensity(s.rain_intensity)}
              </p>
            </div>
          </div>
          {scenario.area_name ? (
            <p className="text-[11px] text-slate-400">
              {scenario.area_name} · {scenario.city}
            </p>
          ) : null}
          <DemoDisclaimer text={scenario.demo_disclaimer} compact />
        </div>
      }
    />
  );
}
