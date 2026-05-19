"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GuidedDemoCompareCarousel } from "./GuidedDemoCompareCarousel";
import { GuidedDemoPhoneShowcase } from "./GuidedDemoPhoneShowcase";
import { GUIDED_WALKTHROUGH_STEPS } from "./guidedDemoCopy";
import {
  COMPARE_CAROUSEL_MS,
  COMPARE_CAROUSEL_VARIANTS,
} from "./guidedDemoStaticData";

const DEFAULT_STEP_AUTOPLAY_MS = 2000;
const COMPARE_STEP_AUTOPLAY_MS =
  COMPARE_CAROUSEL_MS * COMPARE_CAROUSEL_VARIANTS.length + 500;
const SEARCH_STEP_AUTOPLAY_MS = 6000;
const GUIDED_DEMO_STEP_COUNT = 4;

/** Static UI walkthrough — code-rendered frozen scenario only. */
export function GuidedDemoWalkthrough() {
  const { lang } = useLanguage();
  const steps = GUIDED_WALKTHROUGH_STEPS[lang];
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepIndicator, setStepIndicator] = useState({ top: 0, height: 0 });
  const stepNavRef = useRef<HTMLElement | null>(null);
  const stepButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = steps[activeIndex] ?? steps[0];

  useEffect(() => {
    const duration =
      activeIndex === 1
        ? COMPARE_STEP_AUTOPLAY_MS
        : activeIndex === 2
          ? SEARCH_STEP_AUTOPLAY_MS
          : DEFAULT_STEP_AUTOPLAY_MS;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % GUIDED_DEMO_STEP_COUNT);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const nav = stepNavRef.current;
      const button = stepButtonRefs.current[activeIndex];

      if (!nav || !button) return;

      const navRect = nav.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setStepIndicator({
        top: buttonRect.top - navRect.top,
        height: buttonRect.height,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeIndex, lang]);

  return (
    <div
      className="overflow-hidden rounded-3xl border border-stone-200/45 bg-stone-50/45 shadow-[0_10px_34px_rgb(28_25_23_/_0.035),0_0_0_1px_rgb(255_255_255_/_0.22)] backdrop-blur-lg"
      role="region"
      aria-label={lang === "zh" ? "流程演示" : "Guided demo walkthrough"}
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,17.5rem)]">
        <div
          className="flex items-center justify-center border-b border-stone-200/35 bg-gradient-to-b from-stone-50/35 to-transparent px-6 py-10 sm:px-10 sm:py-12 lg:border-b-0 lg:border-r lg:py-14"
          role="tabpanel"
          id={`guided-demo-panel-${active.id}`}
          aria-labelledby={`guided-demo-step-${active.id}`}
        >
          <div className="relative flex min-h-[560px] w-full items-center justify-center overflow-hidden">
            <div
              key={`active-${lang}-${active.id}`}
              className="guided-demo-flow-in flex w-full items-center justify-center"
            >
              {active.id === 2 ? (
                <GuidedDemoCompareCarousel lang={lang} />
              ) : (
                <GuidedDemoPhoneShowcase stepId={active.id} lang={lang} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-8 sm:px-7 sm:py-10 lg:px-8">
          <nav
            ref={stepNavRef}
            className="relative flex flex-col gap-1.5"
            role="tablist"
            aria-label={lang === "zh" ? "演示步骤" : "Walkthrough steps"}
          >
            <span
              className="absolute left-0 right-0 z-0 rounded-full bg-stone-950 shadow-[0_10px_30px_rgba(28,25,23,0.12)] transition-[height,transform] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                height: stepIndicator.height,
                transform: `translateY(${stepIndicator.top}px)`,
              }}
              aria-hidden
            />
            {steps.map((step, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={step.id}
                  ref={(node) => {
                    stepButtonRefs.current[index] = node;
                  }}
                  id={`guided-demo-step-${step.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`guided-demo-panel-${step.id}`}
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "relative z-10 w-full rounded-full px-4 py-2.5 text-left font-mono text-[11px] tracking-[0.12em] transition-colors duration-[260ms]",
                    selected
                      ? "font-medium text-stone-50"
                      : "text-stone-500 hover:text-stone-900",
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
            className="guided-demo-copy-in mt-8 min-h-[5.5rem] border-t border-stone-100 pt-6"
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
