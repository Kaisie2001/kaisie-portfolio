"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GuidedDemoCompareCarousel } from "./GuidedDemoCompareCarousel";
import { GuidedDemoPhoneShowcase } from "./GuidedDemoPhoneShowcase";
import { GUIDED_WALKTHROUGH_STEPS } from "./guidedDemoCopy";

/** Static UI walkthrough — code-rendered frozen scenario only. */
export function GuidedDemoWalkthrough() {
  const { lang } = useLanguage();
  const steps = GUIDED_WALKTHROUGH_STEPS[lang];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = steps[activeIndex] ?? steps[0];

  return (
    <div
      className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_8px_40px_rgb(28_25_23_/_0.06),0_0_0_1px_rgb(0_0_0_/_0.03)]"
      role="region"
      aria-label={lang === "zh" ? "流程演示" : "Guided demo walkthrough"}
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,17.5rem)]">
        <div
          className="flex items-center justify-center border-b border-stone-100 bg-gradient-to-b from-white to-stone-50/60 px-6 py-10 sm:px-10 sm:py-12 lg:border-b-0 lg:border-r lg:py-14"
          role="tabpanel"
          id={`guided-demo-panel-${active.id}`}
          aria-labelledby={`guided-demo-step-${active.id}`}
        >
          {active.id === 2 ? (
            <GuidedDemoCompareCarousel lang={lang} />
          ) : (
            <GuidedDemoPhoneShowcase stepId={active.id} lang={lang} />
          )}
        </div>

        <div className="flex flex-col justify-center px-5 py-8 sm:px-7 sm:py-10 lg:px-8">
          <nav
            className="flex flex-col gap-1.5"
            role="tablist"
            aria-label={lang === "zh" ? "演示步骤" : "Walkthrough steps"}
          >
            {steps.map((step, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={step.id}
                  id={`guided-demo-step-${step.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`guided-demo-panel-${step.id}`}
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "w-full rounded-xl border px-3.5 py-2.5 text-left font-mono text-[11px] tracking-[0.04em] transition-[border-color,background-color,box-shadow,color] duration-200",
                    selected
                      ? "border-cyan-600/25 bg-cyan-50/40 font-medium text-stone-900 shadow-[0_0_0_1px_rgb(8_145_178_/_0.08)]"
                      : "border-transparent bg-transparent text-stone-500 hover:border-stone-200/80 hover:bg-stone-50/60 hover:text-stone-700",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {step.tabLabel}
                </button>
              );
            })}
          </nav>

          <div
            key={`${lang}-copy-${active.id}`}
            className="mt-8 min-h-[5.5rem] border-t border-stone-100 pt-6"
            aria-live="polite"
          >
            <h3 className="font-display text-lg font-normal tracking-tight text-stone-950">
              {active.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-stone-600">
              {active.copy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
