"use client";

import { useState } from "react";
import {
  FigmaRainModeDemo,
  type RobotaxiDemoStageId,
  type RobotaxiInteractionEvent,
} from "@/features/robotaxi-rain-mode/figma-shell";
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

/** Live coded prototype — unchanged FigmaRainModeDemo, no guided wiring */
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
      <div className="robotaxi-shared-demo-shell mt-6">
        <div
          className="robotaxi-demo-guide-rail"
          aria-label={lang === "zh" ? "阶段导览" : "Stage guide"}
        >
          <div
            className="robotaxi-demo-stage-controls"
            role="toolbar"
            aria-label={
              lang === "zh" ? "原型阶段导航" : "Prototype stage navigation"
            }
          >
          <div className="robotaxi-demo-stage-controls__inner flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousStage}
                className="rounded-full border border-stone-200 bg-white/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-600 transition hover:border-stone-300 hover:text-stone-950"
              >
                {lang === "zh" ? "上一步" : "Previous"}
              </button>
              <button
                type="button"
                onClick={nextStage}
                className="rounded-full bg-stone-950 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-50 shadow-[0_10px_24px_rgba(28,25,23,0.12)] transition hover:bg-stone-800"
              >
                {lang === "zh" ? "下一步" : "Next"}
              </button>
            </div>
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="tablist"
              aria-label={lang === "zh" ? "原型阶段" : "Prototype stages"}
            >
              {DEMO_STAGES.map((stage, index) => {
                const selected = stage.id === activeStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setStageFromSecondaryControl(stage.id)}
                    className={[
                      "rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] transition-colors",
                      selected
                        ? "bg-stone-950 text-stone-50"
                        : "bg-white/65 text-stone-500 hover:text-stone-950",
                    ].join(" ")}
                  >
                    {String(index + 1).padStart(2, "0")} {stage.label[lang]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        </div>
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
