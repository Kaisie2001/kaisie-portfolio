"use client";

import { useId, type MouseEvent } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { Lang } from "@/lib/portfolioCopy";
import type { RobotaxiDemoStageId } from "../figma-shell/FigmaRainModeDemo";

export type DemoRemoteOverlayStage = {
  id: RobotaxiDemoStageId;
  label: { en: string; zh: string };
};

export type DemoRemoteOverlayProps = {
  lang: Lang;
  activeStage: RobotaxiDemoStageId;
  stages: DemoRemoteOverlayStage[];
  onPrevious: () => void;
  onNext: () => void;
  onStageSelect: (stageId: RobotaxiDemoStageId) => void;
};

const STAGE_PILL_LAYOUT_ID = "robotaxi-demo-stage-pill-bg";

/** Hover-reveal stage guide above the shared demo board (desktop); always visible on touch. */
export function DemoRemoteOverlay({
  lang,
  activeStage,
  stages,
  onPrevious,
  onNext,
  onStageSelect,
}: DemoRemoteOverlayProps) {
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const toolbarLabel =
    lang === "zh" ? "原型阶段导航" : "Prototype stage navigation";
  const stagesLabel = lang === "zh" ? "原型阶段" : "Prototype stages";

  const pillTransition = reduceMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 340,
        damping: 30,
        mass: 0.82,
      };

  const releaseFocus = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
  };

  return (
    <div
      className="robotaxi-demo-remote-overlay"
      aria-label={lang === "zh" ? "阶段导览" : "Stage guide"}
    >
      <div
        id={panelId}
        className="robotaxi-demo-stage-controls"
        role="toolbar"
        aria-label={toolbarLabel}
      >
        <div className="robotaxi-demo-stage-controls__inner flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="robotaxi-demo-stage-nav flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                onPrevious();
                releaseFocus(event);
              }}
              className="robotaxi-demo-stage-nav__btn robotaxi-demo-stage-nav__btn--ghost"
            >
              {lang === "zh" ? "上一步" : "Previous"}
            </button>
            <button
              type="button"
              onClick={(event) => {
                onNext();
                releaseFocus(event);
              }}
              className="robotaxi-demo-stage-nav__btn robotaxi-demo-stage-nav__btn--primary"
            >
              {lang === "zh" ? "下一步" : "Next"}
            </button>
          </div>
          <LayoutGroup id="robotaxi-demo-stage-pills">
            <div
              className="robotaxi-demo-stage-pills"
              role="tablist"
              aria-label={stagesLabel}
            >
              {stages.map((stage, index) => {
                const selected = stage.id === activeStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    data-selected={selected ? "true" : "false"}
                    onClick={(event) => {
                      onStageSelect(stage.id);
                      releaseFocus(event);
                    }}
                    className="robotaxi-demo-stage-pill"
                  >
                    {selected ? (
                      <motion.span
                        layoutId={STAGE_PILL_LAYOUT_ID}
                        className="robotaxi-demo-stage-pill__bg"
                        transition={pillTransition}
                      />
                    ) : null}
                    <span className="robotaxi-demo-stage-pill__label">
                      {String(index + 1).padStart(2, "0")} {stage.label[lang]}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
}
