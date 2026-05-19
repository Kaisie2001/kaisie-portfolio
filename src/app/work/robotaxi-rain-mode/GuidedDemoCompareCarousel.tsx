"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/portfolioCopy";
import { GuidedDemoPhoneShowcase } from "./GuidedDemoPhoneShowcase";
import {
  COMPARE_CAROUSEL_MS,
  COMPARE_CAROUSEL_VARIANTS,
} from "./guidedDemoStaticData";

type Props = {
  lang: Lang;
};

/** Step 02 only — auto-rotating compare visuals, local state only. */
export function GuidedDemoCompareCarousel({ lang }: Props) {
  const [index, setIndex] = useState(0);
  const variant = COMPARE_CAROUSEL_VARIANTS[index] ?? COMPARE_CAROUSEL_VARIANTS[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % COMPARE_CAROUSEL_VARIANTS.length);
    }, COMPARE_CAROUSEL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-[560px] w-full flex-col items-center justify-center gap-4">
      <div className="flex min-h-[515px] w-full justify-center">
        <GuidedDemoPhoneShowcase
          stepId={2}
          lang={lang}
          highlightPickupId={variant.pickupKey}
          compareCycleKey={index}
        />
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label={lang === "zh" ? "上车方案比较" : "Pickup option comparison"}
      >
        {COMPARE_CAROUSEL_VARIANTS.map((item, itemIndex) => {
          const active = itemIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setIndex(itemIndex)}
              className={[
                "rounded-full border px-3 py-1.5 font-mono text-[10px] transition-colors",
                active
                  ? "border-cyan-600/30 bg-cyan-50/50 font-medium text-stone-900"
                  : "border-stone-200/80 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-700",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.label[lang]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
