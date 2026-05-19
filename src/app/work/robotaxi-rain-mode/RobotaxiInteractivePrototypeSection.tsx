"use client";

import { FigmaRainModeDemo } from "@/features/robotaxi-rain-mode/figma-shell";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PROTOTYPE_SECTION_COPY,
  PROTOTYPE_SECTION_DISCLAIMER,
  PROTOTYPE_SECTION_TITLE,
} from "./guidedDemoCopy";

/** Live coded prototype — unchanged FigmaRainModeDemo, no guided wiring */
export function RobotaxiInteractivePrototypeSection() {
  const { lang } = useLanguage();

  return (
    <section
      className="mt-14"
      aria-labelledby="robotaxi-interactive-prototype"
    >
      <h2
        id="robotaxi-interactive-prototype"
        className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
      >
        {PROTOTYPE_SECTION_TITLE[lang]}
      </h2>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-stone-600">
        {PROTOTYPE_SECTION_COPY[lang]}
      </p>
      <p className="mt-4 max-w-2xl rounded-lg border border-stone-200/80 bg-stone-100/50 px-3 py-2 text-[12px] leading-relaxed text-stone-600">
        {PROTOTYPE_SECTION_DISCLAIMER[lang]}
      </p>
      <div className="mt-6 overflow-hidden rounded-[28px] border border-black/[0.05] bg-stone-50 shadow-[0_20px_56px_rgb(28_25_23_/_0.08)]">
        <FigmaRainModeDemo lang={lang} />
      </div>
    </section>
  );
}
