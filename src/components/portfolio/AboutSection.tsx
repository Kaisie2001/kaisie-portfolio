"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import SplitText from "@/components/ui/SplitText";
import { CONTACT_LINKS } from "@/lib/contactLinks";
import { portfolioCopy, type Lang } from "@/lib/portfolioCopy";

const ease = [0.22, 1, 0.36, 1] as const;

const slideAboutTitleClassName =
  "font-display text-[clamp(1.85rem,4.5vw,2.85rem)] font-medium leading-[1.08] tracking-[-0.032em] text-stone-900";

function Chip({ children }: { children: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="inline-block rounded border border-stone-200/90 bg-stone-50 px-2 py-1 text-xs leading-snug text-stone-800 sm:px-2.5 sm:text-[13px]"
      whileHover={reduce ? undefined : { scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease }}
    >
      {children}
    </motion.span>
  );
}

function BackgroundChip({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="inline-block rounded-md border border-stone-200/80 bg-white/90 px-2.5 py-1.5 text-xs font-medium leading-snug tracking-[-0.01em] text-stone-700 shadow-[0_1px_0_rgba(28,25,23,0.04)] sm:px-3 sm:text-[13px]"
      whileHover={
        reduce ? undefined : { y: -2, boxShadow: "0 8px 20px rgba(28, 25, 23, 0.08)" }
      }
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease }}
    >
      {label}
    </motion.span>
  );
}

function HoverCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileHover={
        reduce
          ? undefined
          : {
              y: -4,
              boxShadow: "0 14px 32px rgba(28, 25, 23, 0.1)",
            }
      }
      whileTap={reduce ? undefined : { scale: 0.995 }}
      transition={{ duration: 0.22, ease }}
    >
      {children}
    </motion.div>
  );
}

type Density = "comfortable" | "slide";

export function AboutSection({
  lang,
  density = "comfortable",
}: {
  lang: Lang;
  density?: Density;
}) {
  const a = portfolioCopy[lang].about;
  const te = a.toolsExploring;
  const co = portfolioCopy[lang].contact;
  const slide = density === "slide";
  const hasStack = a.capabilityBlocks.length > 0;
  const reduceMotion = useReducedMotion();
  const motionDuration = reduceMotion ? 0.14 : 0.85;
  const motionBlur = reduceMotion ? 0 : 6;
  const aboutHeadline = lang === "en" ? "About" : "关于";

  const capabilityAndTools = hasStack ? (
    <>
      <h3
        id="capability-stack-heading"
        className="font-display text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl lg:text-[2.125rem]"
      >
        {a.capabilityStackTitle}
      </h3>

      <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
        {a.capabilityBlocks.map((block) => (
          <HoverCard
            key={block.label}
            className="rounded-xl border border-stone-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04)] sm:p-6"
          >
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
              {block.label}
            </h4>
            <ul className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
              {block.items.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </HoverCard>
        ))}
      </div>

      <HoverCard className="mt-6 rounded-xl border border-stone-200/90 bg-stone-50/80 p-5 sm:mt-7 sm:p-6">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
          {te.toolsLabel}
        </h4>
        <ul className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {te.toolsItems.map((item) => (
            <li key={item}>
              <Chip>{item}</Chip>
            </li>
          ))}
        </ul>
        <h4 className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
          {te.exploringLabel}
        </h4>
        <ul className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {te.exploringItems.map((item) => (
            <li key={item}>
              <Chip>{item}</Chip>
            </li>
          ))}
        </ul>
      </HoverCard>
    </>
  ) : (
    <HoverCard className="rounded-xl border border-stone-200/90 bg-stone-50/80 p-5 sm:p-6">
      <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
        {te.toolsLabel}
      </h4>
      <ul className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
        {te.toolsItems.map((item) => (
          <li key={item}>
            <Chip>{item}</Chip>
          </li>
        ))}
      </ul>
      <h4 className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
        {te.exploringLabel}
      </h4>
      <ul className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
        {te.exploringItems.map((item) => (
          <li key={item}>
            <Chip>{item}</Chip>
          </li>
        ))}
      </ul>
    </HoverCard>
  );

  const contactBlock = (
    <div id="about-contact" aria-labelledby="about-contact-heading">
      <h3
        id="about-contact-heading"
        className="font-display text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl lg:text-[2.125rem]"
      >
        {a.contactCardTitle}
      </h3>
      <HoverCard className="mt-7 grid gap-6 rounded-xl border border-stone-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04)] sm:mt-8 sm:grid-cols-2 sm:gap-8 sm:p-6">
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
            {a.resumeColumnLabel}
          </h4>
          <ul className="mt-3 space-y-2.5">
            <li>
              <a
                href="/resume-ai-product-en.pdf"
                download="CV_AI_Product_EN.pdf"
                className="text-sm leading-snug text-stone-800 underline decoration-stone-300 underline-offset-[3px] transition hover:text-stone-900 hover:decoration-stone-500 sm:text-[15px]"
              >
                {co.resumeEn}
              </a>
            </li>
            <li>
              <a
                href="/resume-ai-product-zh.pdf"
                download="CV_AI_Product_ZH.pdf"
                className="text-sm leading-snug text-stone-800 underline decoration-stone-300 underline-offset-[3px] transition hover:text-stone-900 hover:decoration-stone-500 sm:text-[15px]"
              >
                {co.resumeZh}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
            {a.contactColumnLabel}
          </h4>
          <ul className="mt-3 space-y-2.5">
            <li>
              <a
                href={CONTACT_LINKS.email}
                className="break-all text-sm leading-snug text-stone-800 underline decoration-stone-300 underline-offset-[3px] transition hover:text-stone-900 hover:decoration-stone-500 sm:text-[15px]"
              >
                {CONTACT_LINKS.emailDisplay}
              </a>
            </li>
            <li className="text-sm leading-snug text-stone-800 sm:text-[15px]">
              <span>{co.wechat}</span>
              <span className="mx-1.5 text-stone-400" aria-hidden>
                ·
              </span>
              <span className="select-all">{CONTACT_LINKS.wechatId}</span>
            </li>
            <li>
              <a
                href={CONTACT_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-snug text-stone-800 underline decoration-stone-300 underline-offset-[3px] transition hover:text-stone-900 hover:decoration-stone-500 sm:text-[15px]"
              >
                {co.linkedin}
              </a>
            </li>
            <li>
              <a
                href={CONTACT_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-snug text-stone-800 underline decoration-stone-300 underline-offset-[3px] transition hover:text-stone-900 hover:decoration-stone-500 sm:text-[15px]"
              >
                {co.github}
              </a>
            </li>
          </ul>
        </div>
      </HoverCard>
    </div>
  );

  const lowerSection = (
    <div className="mt-10 space-y-12 sm:mt-12">
      <div aria-labelledby={hasStack ? "capability-stack-heading" : undefined}>
        {capabilityAndTools}
      </div>
      <div className="border-t border-stone-200/90 pt-10 sm:pt-12">{contactBlock}</div>
    </div>
  );

  return (
    <section
      id="about"
      className={
        slide
          ? "min-h-0 w-full bg-[#f7f6f3] text-stone-900"
          : "scroll-mt-28 bg-[#f7f6f3] text-stone-900 sm:scroll-mt-32"
      }
      aria-label={lang === "en" ? "About" : "关于"}
    >
      <div
        className={
          slide
            ? "mx-auto w-full max-w-4xl px-6 py-8 sm:px-8 sm:py-10"
            : "mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-16"
        }
      >
        <header>
          {slide ? (
            <>
              {reduceMotion ? (
                <h2 className={slideAboutTitleClassName}>{aboutHeadline}</h2>
              ) : (
                <SplitText
                  key={`about-title-${lang}`}
                  tag="h2"
                  text={aboutHeadline}
                  immediate
                  className={slideAboutTitleClassName}
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
                    : { opacity: 0, y: 16, filter: `blur(${motionBlur}px)` }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                transition={{ duration: motionDuration, ease }}
              >
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-stone-500 sm:mt-5 sm:text-[13px]">
                  {a.sectionLabel}
                </p>
                <p className="mt-6 max-w-2xl font-sans text-[1.0625rem] leading-[1.62] text-stone-700 sm:mt-7 sm:text-lg sm:leading-relaxed">
                  {a.paragraph}
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone-500 sm:text-[13px]">
                {a.sectionLabel}
              </p>
              <h2 className="mt-2 font-display text-[1.875rem] font-medium leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-[2.75rem]">
                {aboutHeadline}
              </h2>
            </>
          )}
        </header>

        <ul className="mt-7 flex flex-wrap gap-2 sm:mt-8">
          {a.backgroundChips.map((chip) => (
            <li key={chip}>
              <BackgroundChip label={chip} />
            </li>
          ))}
        </ul>

        {!slide ? (
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-stone-800 sm:mt-8 sm:text-[17px] sm:leading-[1.65]">
            {a.paragraph}
          </p>
        ) : null}

        {lowerSection}
      </div>
    </section>
  );
}
