"use client";

import { useCallback, useState } from "react";
import {
  FigmaRainModeDemo,
  type RobotaxiDemoEvent,
  type RobotaxiDemoStageId,
} from "@/features/robotaxi-rain-mode/figma-shell";
import { DemoRemoteOverlay } from "@/features/robotaxi-rain-mode/components/DemoRemoteOverlay";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PickupId } from "@/features/robotaxi-rain-mode/figma-shell/types";
import {
  isScenarioGeneratedEvent,
  techStageFromDemoEvent,
  type RobotaxiDemoEventDetail,
} from "@/features/robotaxi-rain-mode/figma-shell/demoEvents";
import {
  PROTOTYPE_SECTION_COPY,
  PROTOTYPE_SECTION_DISCLAIMER,
  PROTOTYPE_SECTION_TITLE,
} from "./guidedDemoCopy";

type TechStageIndicator = {
  id: RobotaxiDemoStageId;
  label: { en: string; zh: string };
};

/** Passive technical-stage indicators — observe demo; do not drive the phone. */
const TECH_STAGE_INDICATORS: TechStageIndicator[] = [
  { id: "empty", label: { en: "Reset", zh: "初始" } },
  { id: "context-trigger", label: { en: "Set Trip", zh: "设置行程" } },
  { id: "pudo-selection", label: { en: "Pickup", zh: "上车点选择" } },
  { id: "service-gate", label: { en: "Service", zh: "服务状态" } },
  { id: "pickup-coordination", label: { en: "On the Way", zh: "车辆接近" } },
];

/** Live coded prototype — phone is primary; technical panel observes demo events. */
export function RobotaxiInteractivePrototypeSection() {
  const { lang } = useLanguage();
  const [activeTechStage, setActiveTechStage] =
    useState<RobotaxiDemoStageId>("context-trigger");
  const [scenarioGenerated, setScenarioGenerated] = useState(true);
  const [selectedPickupOption, setSelectedPickupOption] =
    useState<PickupId>("sheltered");
  const [lastDemoEvent, setLastDemoEvent] = useState<RobotaxiDemoEvent | null>(
    null,
  );

  const handleDemoEvent = useCallback(
    (event: RobotaxiDemoEvent, detail?: RobotaxiDemoEventDetail) => {
      setLastDemoEvent(event);
      setActiveTechStage(techStageFromDemoEvent(event));
      if (isScenarioGeneratedEvent(event)) {
        setScenarioGenerated(true);
      }
      if (event === "demo_reset" || event === "demo_idle") {
        setScenarioGenerated(false);
        setSelectedPickupOption("sheltered");
      }
      if (event === "pickup_option_selected" && detail?.pickupOption) {
        setSelectedPickupOption(detail.pickupOption);
      }
    },
    [],
  );

  const previewTechStage = (stage: RobotaxiDemoStageId) => {
    setActiveTechStage(stage);
  };

  return (
    <section
      className="mt-14"
      aria-labelledby="robotaxi-interactive-prototype"
      data-scenario-generated={scenarioGenerated ? "true" : "false"}
    >
      <h2
        id="robotaxi-interactive-prototype"
        className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
      >
        {PROTOTYPE_SECTION_TITLE[lang]}
      </h2>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-stone-600">
        {PROTOTYPE_SECTION_COPY[lang]}
      </p>
      <div className="mt-10">
        <div className="robotaxi-case-board">
          <div className="robotaxi-interactive-board__shell">
            <div className="robotaxi-interactive-board__remote">
              <DemoRemoteOverlay
                lang={lang}
                activeTechStage={activeTechStage}
                stages={TECH_STAGE_INDICATORS}
                onTechStagePreview={previewTechStage}
              />
            </div>
            <FigmaRainModeDemo
              lang={lang}
              activeTechStage={activeTechStage}
              selectedPickupOption={selectedPickupOption}
              lastDemoEvent={lastDemoEvent}
              onDemoEvent={handleDemoEvent}
            />
          </div>
        </div>
      </div>
      <p className="robotaxi-prototype-disclaimer mt-4 max-w-2xl">
        {PROTOTYPE_SECTION_DISCLAIMER[lang]}
      </p>
    </section>
  );
}
