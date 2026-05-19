"use client";

import { useId, type MouseEvent } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { Lang } from "@/lib/portfolioCopy";
import type { RobotaxiDemoStageId } from "../figma-shell/demoEvents";

export type DemoRemoteOverlayStage = {
  id: RobotaxiDemoStageId;
  label: { en: string; zh: string };
};

export type DemoRemoteOverlayProps = {
  lang: Lang;
  /** Current technical stage (observed from demo; pills are passive preview). */
  activeTechStage: RobotaxiDemoStageId;
  stages: DemoRemoteOverlayStage[];
  /** Preview technical explanation only — does not control the phone demo. */
  onTechStagePreview: (stageId: RobotaxiDemoStageId) => void;
};

const STAGE_PILL_LAYOUT_ID = "robotaxi-demo-stage-pill-bg";

/** Passive technical-stage indicator above the shared demo board. */
export function DemoRemoteOverlay({
  lang,
  activeTechStage,
  stages,
  onTechStagePreview,
}: DemoRemoteOverlayProps) {
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const stagesLabel =
    lang === "zh" ? "技术说明阶段（仅预览）" : "Technical stages (preview only)";

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
      aria-label={lang === "zh" ? "技术阶段指示" : "Technical stage indicator"}
    >
      <motion.div
        id={panelId}
        className="robotaxi-demo-stage-controls"
        role="group"
        aria-label={stagesLabel}
      >
        <div className="robotaxi-demo-stage-controls__inner flex flex-col gap-2">
          <LayoutGroup id="robotaxi-demo-stage-pills">
            <div
              className="robotaxi-demo-stage-pills"
              role="list"
              aria-label={stagesLabel}
            >
              {stages.map((stage, index) => {
                const selected = stage.id === activeTechStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    role="listitem"
                    aria-current={selected ? "step" : undefined}
                    data-selected={selected ? "true" : "false"}
                    onClick={(event) => {
                      onTechStagePreview(stage.id);
                      releaseFocus(event);
                    }}
                    className="robotaxi-demo-stage-pill robotaxi-demo-stage-pill--passive"
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
      </motion.div>
    </div>
  );
}
