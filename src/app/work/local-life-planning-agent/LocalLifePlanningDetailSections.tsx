"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  LOCAL_LIFE_AGENT_WORKFLOW_STEPS,
  LOCAL_LIFE_AGENT_WORKFLOW_SUBTITLE,
  LOCAL_LIFE_AGENT_WORKFLOW_TITLE,
  LOCAL_LIFE_HIGHLIGHTS,
  LOCAL_LIFE_HIGHLIGHTS_SUBTITLE,
  LOCAL_LIFE_HIGHLIGHTS_TITLE,
  LOCAL_LIFE_ROLE_COPY,
  LOCAL_LIFE_ROLE_TITLE,
} from "./localLifeDetailCopy";

export function LocalLifePlanningDetailSections() {
  const { lang } = useLanguage();
  const workflowSteps = LOCAL_LIFE_AGENT_WORKFLOW_STEPS[lang];
  const highlights = LOCAL_LIFE_HIGHLIGHTS[lang];

  return (
    <>
      <section className="mt-14" aria-labelledby="local-life-agent-workflow">
        <h2
          id="local-life-agent-workflow"
          className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
        >
          {LOCAL_LIFE_AGENT_WORKFLOW_TITLE[lang]}
        </h2>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-stone-600 sm:text-[15px]">
          {LOCAL_LIFE_AGENT_WORKFLOW_SUBTITLE[lang]}
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-stone-200/80 bg-white/80 p-5 shadow-[0_1px_3px_rgba(28,25,23,0.04)] ring-1 ring-stone-900/[0.03]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-base font-medium tracking-tight text-stone-900">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-stone-600 sm:text-sm">
                {step.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="local-life-highlights">
        <h2
          id="local-life-highlights"
          className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
        >
          {LOCAL_LIFE_HIGHLIGHTS_TITLE[lang]}
        </h2>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-stone-600 sm:text-[15px]">
          {LOCAL_LIFE_HIGHLIGHTS_SUBTITLE[lang]}
        </p>

        <ul className="mt-8 divide-y divide-stone-200/80 border-t border-stone-200/80">
          {highlights.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-2 py-5 first:pt-5 sm:flex-row sm:items-start sm:gap-10 sm:py-6"
            >
              <h3 className="shrink-0 font-display text-base font-medium text-stone-900 sm:w-40">
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-stone-600 sm:flex-1 sm:text-sm">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="local-life-role">
        <h2
          id="local-life-role"
          className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
        >
          {LOCAL_LIFE_ROLE_TITLE[lang]}
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-700 sm:text-base">
          {LOCAL_LIFE_ROLE_COPY[lang]}
        </p>
      </section>
    </>
  );
}
