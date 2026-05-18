"use client";

import { useState } from "react";
import { FigmaRainModeDemo } from "@/features/robotaxi-rain-mode/figma-shell";
import { useLanguage } from "@/contexts/LanguageContext";
import { GUIDED_DEMO_STEPS } from "./guidedDemoCopy";
import "./guided-demo-orbit.css";

const STEP_COUNT = 4;
const SLOT_WIDTH = `calc((100% - 0.25rem) / ${STEP_COUNT})`;

/** Step tabs (Case Overview style) + central demo card — visual selection only */
export function GuidedDemoOrbitShowcase() {
  const { lang } = useLanguage();
  const steps = GUIDED_DEMO_STEPS[lang];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = steps[activeIndex] ?? steps[0];

  return (
    <div className="guided-demo-orbit">
      <div className="overflow-x-auto">
        <div
          className="relative mx-auto grid w-full max-w-[36rem] min-w-[30rem] grid-cols-4 items-center gap-0 rounded-full px-0.5 py-0.5 sm:min-w-0"
          role="tablist"
          aria-label="Demo steps"
        >
          <span
            className="absolute bottom-0.5 top-0.5 z-0 rounded-full bg-stone-950 shadow-[0_10px_30px_rgba(28,25,23,0.12)] transition-all duration-[270ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: `calc(0.125rem + (${SLOT_WIDTH}) * ${activeIndex})`,
              width: SLOT_WIDTH,
            }}
            aria-hidden
          />
          {steps.map((step, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={step.title}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveIndex(index)}
                className={[
                  "relative z-10 inline-flex min-h-9 w-full items-center justify-center whitespace-nowrap rounded-full px-2 text-center font-mono text-[9px] tracking-[0.16em] transition-colors duration-200 sm:px-3 sm:text-[10px]",
                  selected
                    ? "text-stone-50"
                    : "text-stone-500 hover:text-stone-900",
                  lang === "en" ? "uppercase" : "",
                ].join(" ")}
              >
                {step.tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="guided-demo-orbit__card">
        <div className="guided-demo-orbit__detail" role="tabpanel">
          <h3 className="guided-demo-orbit__detail-title">{active?.title}</h3>
          <p className="guided-demo-orbit__detail-copy">{active?.copy}</p>
        </div>
        <FigmaRainModeDemo />
      </div>
    </div>
  );
}
