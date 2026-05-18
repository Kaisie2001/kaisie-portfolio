"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GUIDED_WALKTHROUGH_STEPS } from "./guidedDemoCopy";

const STEP_COUNT = 4;
const TRACK_PAD = "4px";
const SLOT_WIDTH = `calc((100% - ${TRACK_PAD} * 2) / ${STEP_COUNT})`;

/** Static screenshot walkthrough — no live demo */
export function GuidedDemoWalkthrough() {
  const { lang } = useLanguage();
  const steps = GUIDED_WALKTHROUGH_STEPS[lang];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = steps[activeIndex] ?? steps[0];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative mx-auto grid w-full max-w-[36rem] grid-cols-4 items-center rounded-full bg-gradient-to-b from-[#3f3f42] via-[#2a2a2c] to-[#252528] p-1 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.1),inset_0_-1px_2px_rgb(0_0_0_/_0.35),0_6px_20px_rgb(28_28_30_/_0.1)]"
        role="tablist"
        aria-label="Walkthrough steps"
      >
        <span
          className="absolute bottom-1 top-1 z-0 rounded-full bg-gradient-to-b from-[#fafafa] via-[#ececef] to-[#e2e2e6] shadow-[0_1px_0_rgb(255_255_255_/_0.95),0_2px_6px_rgb(0_0_0_/_0.08),0_6px_14px_rgb(0_0_0_/_0.1)] transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-[1ms]"
          style={{
            left: `calc(${TRACK_PAD} + (${SLOT_WIDTH}) * ${activeIndex})`,
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
                "relative z-10 cursor-pointer whitespace-nowrap rounded-full border-0 bg-transparent px-1.5 py-2.5 font-mono text-[9px] font-medium leading-tight tracking-[0.08em] transition-colors sm:px-2",
                selected
                  ? "text-[#3a3a3c]"
                  : "text-white/45 hover:text-white/75",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {step.tabLabel}
            </button>
          );
        })}
      </div>

      <div
        key={`${lang}-${activeIndex}`}
        className="overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-stone-50 to-stone-100 shadow-[0_20px_56px_rgb(28_25_23_/_0.08)]"
        role="tabpanel"
        aria-live="polite"
      >
        <figure className="m-0 px-5 pt-5">
          <div className="relative mx-auto aspect-[260/515] w-[min(100%,220px)] overflow-hidden rounded-[28px] bg-stone-200 shadow-[0_12px_40px_rgb(28_25_23_/_0.12)]">
            <Image
              src={active.imageSrc}
              alt={active.imageAlt[lang]}
              fill
              sizes="(max-width: 640px) 220px, 220px"
              className="object-cover object-top"
              priority={activeIndex === 0}
            />
          </div>
          <figcaption className="px-4 py-5 text-left sm:px-6 sm:text-center">
            <h3 className="font-display text-lg font-normal tracking-tight text-stone-950">
              {active.title}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
              {active.copy}
            </p>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
