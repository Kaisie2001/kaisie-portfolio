"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { GuidedDemoOrbitShowcase } from "./GuidedDemoOrbitShowcase";
import {
  GUIDED_DEMO_SECTION_EYEBROW,
  GUIDED_DEMO_SECTION_LEDE,
  GUIDED_DEMO_SECTION_TITLE,
} from "./guidedDemoCopy";

export function RobotaxiRainModePageClient() {
  const { lang } = useLanguage();

  return (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400">
        {GUIDED_DEMO_SECTION_EYEBROW[lang]}
      </p>
      <h2
        id="robotaxi-guided-demo"
        className="mt-2 font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
      >
        {GUIDED_DEMO_SECTION_TITLE[lang]}
      </h2>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-stone-600">
        {GUIDED_DEMO_SECTION_LEDE[lang]}
      </p>
      <div className="mt-8">
        <GuidedDemoOrbitShowcase />
      </div>
    </>
  );
}
