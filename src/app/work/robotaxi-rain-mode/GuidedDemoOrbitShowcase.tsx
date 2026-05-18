"use client";

import { useState } from "react";
import { FigmaRainModeDemo } from "@/features/robotaxi-rain-mode/figma-shell";
import { useLanguage } from "@/contexts/LanguageContext";
import { GUIDED_DEMO_STEPS } from "./guidedDemoCopy";
import "./guided-demo-orbit.css";

/** Step tabs in a top row + central demo card — visual selection only (no guidedStep sync) */
export function GuidedDemoOrbitShowcase() {
  const { lang } = useLanguage();
  const steps = GUIDED_DEMO_STEPS[lang];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = steps[activeIndex] ?? steps[0];

  return (
    <div className="guided-demo-orbit">
      <div className="guided-demo-orbit__tabs" role="tablist" aria-label="Demo steps">
        {steps.map((step, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={step.title}
              type="button"
              role="tab"
              aria-selected={selected}
              className={[
                "guided-demo-orbit__tab",
                selected ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setActiveIndex(index)}
            >
              {step.tabLabel}
            </button>
          );
        })}
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
