"use client";

import { useState } from "react";
import {
  FigmaRainModeDemo,
  type RobotaxiDemoStageId,
  type RobotaxiInteractionEvent,
} from "@/features/robotaxi-rain-mode/figma-shell";
import { DemoRemoteOverlay } from "@/features/robotaxi-rain-mode/components/DemoRemoteOverlay";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FigmaScreen } from "@/features/robotaxi-rain-mode/figma-shell/types";
import type { PickupId } from "@/features/robotaxi-rain-mode/figma-shell/types";
import {
  PROTOTYPE_SECTION_COPY,
  PROTOTYPE_SECTION_DISCLAIMER,
  PROTOTYPE_SECTION_TITLE,
} from "./guidedDemoCopy";

type DemoStage = {
  id: RobotaxiDemoStageId;
  screen: FigmaScreen;
  guidedStep: 1 | 2 | 3 | 4;
  label: { en: string; zh: string };
};

const DEMO_STAGES: DemoStage[] = [
  {
    id: "context-trigger",
    screen: 1,
    guidedStep: 1,
    label: { en: "Set Trip", zh: "设置行程" },
  },
  {
    id: "pudo-selection",
    screen: 3,
    guidedStep: 3,
    label: { en: "Pickup", zh: "上车点选择" },
  },
  {
    id: "service-gate",
    screen: 2,
    guidedStep: 2,
    label: { en: "Service", zh: "服务状态" },
  },
  {
    id: "pickup-coordination",
    screen: 4,
    guidedStep: 4,
    label: { en: "On the Way", zh: "车辆接近" },
  },
];

function stageFromScreen(screen: FigmaScreen): RobotaxiDemoStageId {
  switch (screen) {
    case 2:
      return "service-gate";
    case 3:
      return "pudo-selection";
    case 4:
      return "pickup-coordination";
    case 1:
    case 5:
    default:
      return "context-trigger";
  }
}

/** Live coded prototype — phone is primary; stage remote is secondary overlay */
export function RobotaxiInteractivePrototypeSection() {
  const { lang } = useLanguage();
  const [activeStage, setActiveStage] =
    useState<RobotaxiDemoStageId>("context-trigger");
  const [activeTechStage, setActiveTechStage] =
    useState<RobotaxiDemoStageId>("context-trigger");
  const [selectedPickupOption, setSelectedPickupOption] =
    useState<PickupId>("sheltered");
  const [lastInteractionEvent, setLastInteractionEvent] =
    useState<RobotaxiInteractionEvent | null>(null);
  const activeIndex = Math.max(
    0,
    DEMO_STAGES.findIndex((stage) => stage.id === activeStage),
  );
  const active = DEMO_STAGES[activeIndex] ?? DEMO_STAGES[0];
  const setStageFromEvent = (
    stage: RobotaxiDemoStageId,
    event: RobotaxiInteractionEvent,
  ) => {
    setActiveStage(stage);
    setActiveTechStage(stage);
    setLastInteractionEvent(event);
  };
  const setStageFromSecondaryControl = (stage: RobotaxiDemoStageId) => {
    setActiveStage(stage);
    setActiveTechStage(stage);
  };
  const previousStage = () => {
    setStageFromSecondaryControl(
      DEMO_STAGES[(activeIndex - 1 + DEMO_STAGES.length) % DEMO_STAGES.length].id,
    );
  };
  const nextStage = () => {
    setStageFromSecondaryControl(
      DEMO_STAGES[(activeIndex + 1) % DEMO_STAGES.length].id,
    );
  };

  return (
    <section
      className="mt-14"
      aria-labelledby="robotaxi-interactive-prototype"
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
      <p className="mt-4 max-w-2xl rounded-lg border border-stone-200/80 bg-stone-100/50 px-3 py-2 text-[12px] leading-relaxed text-stone-600">
        {PROTOTYPE_SECTION_DISCLAIMER[lang]}
      </p>
      <div className="robotaxi-demo-section-wrap mt-6">
        <DemoRemoteOverlay
          lang={lang}
          activeStage={activeStage}
          stages={DEMO_STAGES}
          onPrevious={previousStage}
          onNext={nextStage}
          onStageSelect={setStageFromSecondaryControl}
        />
        <FigmaRainModeDemo
          lang={lang}
          activeStage={active.id}
          activeTechStage={activeTechStage}
          selectedPickupOption={selectedPickupOption}
          lastInteractionEvent={lastInteractionEvent}
          screen={active.screen}
          guidedStep={active.guidedStep}
          pauseDispatchAuto
          slideshowMode
          onTripSetupConfirmed={() =>
            setStageFromEvent("service-gate", "trip_setup_confirmed")
          }
          onServiceStatusConfirmed={() =>
            setStageFromEvent("pudo-selection", "service_status_confirmed")
          }
          onPickupOptionSelected={(option) => {
            setSelectedPickupOption(option);
            setActiveStage("pudo-selection");
            setActiveTechStage("pudo-selection");
            setLastInteractionEvent("pickup_option_selected");
          }}
          onPickupConfirmed={() =>
            setStageFromEvent("pickup-coordination", "pickup_confirmed")
          }
          onWalkingGuidanceStarted={() =>
            setStageFromEvent(
              "pickup-coordination",
              "walking_guidance_started",
            )
          }
          onScreenChange={(screen) =>
            setStageFromSecondaryControl(stageFromScreen(screen))
          }
        />
      </div>
    </section>
  );
}
