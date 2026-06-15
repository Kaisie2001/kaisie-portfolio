"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  LOCAL_LIFE_DEMO_STEPS,
  LOCAL_LIFE_DEMO_TITLE,
} from "./localLifeDetailCopy";

export function LocalLifePlanningDetailSections() {
  const { lang } = useLanguage();
  const demoSteps = LOCAL_LIFE_DEMO_STEPS[lang];

  return (
    <section className="mt-14" aria-labelledby="local-life-demo-walkthrough">
      <h2
        id="local-life-demo-walkthrough"
        className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
      >
        {LOCAL_LIFE_DEMO_TITLE[lang]}
      </h2>

      <ul className="mt-8 divide-y divide-stone-200/80 border-t border-stone-200/80">
        {demoSteps.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col gap-2 py-5 first:pt-5 sm:flex-row sm:items-start sm:gap-10 sm:py-6"
          >
            <div className="shrink-0 sm:w-36">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-display text-base font-medium text-stone-900">
                {step.title}
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed text-stone-600 sm:flex-1 sm:text-sm">
              {step.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
