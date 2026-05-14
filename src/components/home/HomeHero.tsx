"use client";

import { motion, useReducedMotion } from "motion/react";
import SplitText from "@/components/ui/SplitText";

type Props = {
  title: string;
  subtitle: string;
  oneLiner: string;
  capabilityTags: ReadonlyArray<string>;
  focusLine: string;
  /** Tighter layout for full-screen deck slide */
  density?: "comfortable" | "slide";
};

const ease = [0.22, 1, 0.36, 1] as const;

const titleClassName =
  "font-display text-[clamp(2.35rem,5.8vw,3.85rem)] font-medium leading-[1.06] tracking-[-0.035em] text-stone-900";

/**
 * Editorial intro: top-aligned copy, tighter vertical rhythm.
 * Main title uses GSAP SplitText (React Bits–style) when motion is allowed.
 */
export function HomeHero({
  title,
  subtitle,
  oneLiner,
  capabilityTags,
  focusLine,
  density = "comfortable",
}: Props) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.14 : 0.85;
  const blur = reduceMotion ? 0 : 6;
  const slide = density === "slide";

  return (
    <div className="bg-[#f7f6f3] text-stone-900">
      <div
        className={
          slide
            ? "mx-auto max-w-4xl px-4 pb-3 pt-8 sm:px-6 sm:pb-4 sm:pt-10"
            : "mx-auto max-w-4xl px-6 pb-8 pt-[clamp(4.5rem,12vh,6.5rem)] sm:px-8 sm:pb-10 sm:pt-20"
        }
      >
        {reduceMotion ? (
          <h1 className={titleClassName}>{title}</h1>
        ) : (
          <SplitText
            key={title}
            tag="h1"
            text={title}
            immediate
            syncWithHomeIntro
            className={titleClassName}
            textAlign="left"
            delay={40}
            duration={0.58}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 32 }}
            to={{ opacity: 1, y: 0 }}
          />
        )}

        <motion.div
          className="will-change-transform"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 16, filter: `blur(${blur}px)` }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={{ duration, ease }}
        >
          <p className="mt-4 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-stone-500 sm:mt-5 sm:text-sm sm:tracking-[0.2em]">
            {subtitle}
          </p>
          <p className="mt-6 max-w-2xl font-sans text-[1.0625rem] leading-[1.62] text-stone-700 sm:mt-7 sm:text-lg sm:leading-relaxed">
            {oneLiner}
          </p>
        </motion.div>

        <ul
          className={
            slide
              ? "mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2"
              : "mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-2.5"
          }
        >
          {capabilityTags.map((tag) => (
            <li key={tag}>
              <span className="inline-block rounded-md border border-stone-200/80 bg-white/90 px-2.5 py-1.5 text-[11px] font-medium leading-snug tracking-[-0.01em] text-stone-700 shadow-[0_1px_0_rgba(28,25,23,0.04)] sm:px-3 sm:text-xs">
                {tag}
              </span>
            </li>
          ))}
        </ul>

        <p
          className={
            slide
              ? "mt-4 max-w-2xl border-l-2 border-stone-300/90 pl-3 font-sans text-[0.875rem] leading-snug text-stone-700 sm:mt-5 sm:pl-4 sm:text-[0.9375rem]"
              : "mt-8 max-w-2xl border-l-2 border-stone-300/90 pl-4 font-sans text-[0.9375rem] leading-relaxed text-stone-700 sm:mt-9 sm:pl-5 sm:text-[1rem]"
          }
        >
          {focusLine}
        </p>
      </div>
    </div>
  );
}
