"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { GuidedDemoWalkthrough } from "./GuidedDemoWalkthrough";
import {
  GUIDED_DEMO_SECTION_SUBTITLE,
  GUIDED_DEMO_SECTION_TITLE,
} from "./guidedDemoCopy";

/** Static visual walkthrough — screenshots only, no live demo */
export function RobotaxiGuidedDemoSection() {
  const { lang } = useLanguage();

  return (
    <section className="mt-14" aria-labelledby="robotaxi-guided-demo">
      <h2
        id="robotaxi-guided-demo"
        className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
      >
        {GUIDED_DEMO_SECTION_TITLE[lang]}
      </h2>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-stone-600">
        {GUIDED_DEMO_SECTION_SUBTITLE[lang]}
      </p>
      <div className="mt-8">
        <GuidedDemoWalkthrough />
      </div>
    </section>
  );
}
