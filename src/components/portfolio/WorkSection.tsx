"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import SplitText from "@/components/ui/SplitText";
import type { Lang } from "@/lib/portfolioCopy";

const ease = [0.22, 1, 0.36, 1] as const;

const slideDeckTitleClassName =
  "font-display text-[clamp(1.85rem,4.5vw,2.85rem)] font-medium leading-[1.08] tracking-[-0.032em] text-stone-900";

type Featured = {
  title: string;
  description: string;
  keywords: ReadonlyArray<string>;
  /** In-progress / concept line (not shown when `completed` is true). */
  status?: string;
  /** When true, show a Completed badge instead of `status`. */
  completed?: boolean;
  /** Internal route to the project case-study page. */
  href?: string;
};

type Additional = { title: string; line: string };

type Props = {
  lang: Lang;
  featuredTitle: string;
  /** One line under the main title in slide / deck mode. */
  featuredLead?: string;
  additionalTitle: string;
  featured: ReadonlyArray<Featured>;
  additional: ReadonlyArray<Additional>;
  density?: "comfortable" | "slide";
};

function Keyword({ children, generous }: { children: string; generous?: boolean }) {
  if (generous) {
    return (
      <span className="rounded-md bg-stone-100/90 px-2.5 py-1 text-[11px] font-medium tracking-[-0.01em] text-stone-600 sm:text-xs">
        {children}
      </span>
    );
  }
  return (
    <span className="rounded-md bg-stone-100/90 px-2 py-0.5 text-[10px] font-medium tracking-[-0.01em] text-stone-600 sm:text-[11px]">
      {children}
    </span>
  );
}

/**
 * Work — comfortable: single editorial column. Slide deck: same column for
 * headline, featured cards, and additional list so horizontal measure aligns.
 */
export function WorkSection({
  lang,
  featuredTitle,
  featuredLead,
  additionalTitle,
  featured,
  additional,
  density = "comfortable",
}: Props) {
  const kEyebrow = lang === "en" ? "Work" : "作品";
  const completedLabel = lang === "en" ? "Completed" : "已完成";
  const viewProjectLabel = lang === "en" ? "View project" : "查看项目";
  const slide = density === "slide";
  const reduceMotion = useReducedMotion();
  const motionDuration = reduceMotion ? 0.14 : 0.85;
  const motionBlur = reduceMotion ? 0 : 6;

  const comfortableHeader = (
    <header className="shrink-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:text-[11px]">
        {kEyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
        {featuredTitle}
      </h2>
    </header>
  );

  const slideDeckHeader = (
    <header className="shrink-0">
      {reduceMotion ? (
        <h2 className={slideDeckTitleClassName}>{featuredTitle}</h2>
      ) : (
        <SplitText
          key={`work-title-${lang}-${featuredTitle}`}
          tag="h2"
          text={featuredTitle}
          immediate
          className={slideDeckTitleClassName}
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
          {kEyebrow}
        </p>
        {featuredLead ? (
          <p className="mt-6 max-w-2xl text-pretty font-sans text-[1.0625rem] leading-[1.62] text-stone-700 sm:mt-7 sm:text-lg sm:leading-relaxed">
            {featuredLead}
          </p>
        ) : null}
      </motion.div>
    </header>
  );

  return (
    <section
      id="work"
      aria-label={lang === "en" ? "Work" : "作品"}
      className={
        slide
          ? "min-h-0 w-full bg-[#f7f6f3] py-4 sm:py-6"
          : "scroll-mt-28 border-b border-stone-200/60 bg-[#f7f6f3] sm:scroll-mt-32"
      }
    >
      <div
        className={
          slide
            ? "mx-auto w-full max-w-4xl min-w-0 px-4 sm:px-6"
            : "mx-auto max-w-4xl px-6 py-8 sm:px-8 sm:py-10"
        }
      >
        {slide ? slideDeckHeader : comfortableHeader}

        {!slide && featuredLead ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-700 sm:mt-5 sm:text-[17px] sm:leading-[1.65]">
            {featuredLead}
          </p>
        ) : null}

        <ul
          className={
            slide
              ? "mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              : "mt-8 grid grid-cols-1 gap-4 sm:mt-9 md:grid-cols-2 md:gap-5 lg:mt-10 lg:grid-cols-3 lg:gap-5"
          }
        >
          {featured.map((item) => {
            const cardClassName = slide
              ? "group flex h-full min-h-[220px] flex-col rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_2px_8px_rgba(28,25,23,0.06)] ring-1 ring-stone-900/[0.04] transition-[border-color,box-shadow] duration-200 ease-out hover:border-stone-400/75 hover:shadow-[0_18px_46px_rgba(28,25,23,0.14)] hover:ring-stone-900/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 sm:min-h-[240px] sm:p-7 lg:min-h-0"
              : "group flex h-full flex-col rounded-xl border border-stone-200/75 bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.06)] ring-1 ring-stone-900/[0.03] transition-[border-color,box-shadow] duration-200 ease-out hover:border-stone-400/70 hover:shadow-[0_14px_36px_rgba(28,25,23,0.12)] hover:ring-stone-900/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 sm:p-5";
            const cursorClass = item.href ? "cursor-pointer" : "cursor-default";

            const cardBody = (
              <>
                <div>
                  <h3
                    className={
                      slide
                        ? "font-display text-lg font-medium leading-snug tracking-[-0.02em] text-stone-900 transition group-hover:text-stone-800 sm:text-xl lg:text-[1.35rem]"
                        : "font-display text-[1.0625rem] font-medium leading-snug tracking-[-0.02em] text-stone-900 transition group-hover:text-stone-800 sm:text-lg"
                    }
                  >
                    {item.title}
                  </h3>
                  <div
                    className={
                      slide
                        ? "mt-2 flex min-h-[2rem] items-center sm:mt-2.5 sm:min-h-[2.125rem]"
                        : "mt-2 flex min-h-[1.625rem] items-center sm:min-h-[1.75rem]"
                    }
                  >
                    {item.completed ? (
                      <span
                        className={
                          slide
                            ? "inline-flex rounded-full border border-emerald-200/90 bg-emerald-50/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-emerald-900 sm:text-[11px]"
                            : "inline-flex rounded-full border border-emerald-200/90 bg-emerald-50/95 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-emerald-900 sm:px-2.5 sm:py-1 sm:text-[10px]"
                        }
                      >
                        {completedLabel}
                      </span>
                    ) : item.status ? (
                      <span
                        className={
                          slide
                            ? "inline-flex rounded-full border border-amber-200/90 bg-amber-50/95 px-2.5 py-1 text-[10px] font-medium text-amber-950 sm:text-[11px]"
                            : "inline-flex rounded-full border border-amber-200/90 bg-amber-50/95 px-2 py-0.5 text-[9px] font-medium text-amber-950 sm:px-2.5 sm:py-1 sm:text-[10px]"
                        }
                      >
                        {item.status}
                      </span>
                    ) : null}
                  </div>
                </div>
                <p
                  className={
                    slide
                      ? "mt-4 flex-1 font-sans text-sm leading-relaxed text-stone-600 sm:text-[15px] sm:leading-relaxed"
                      : "mt-3 flex-1 font-sans text-sm leading-relaxed text-stone-600 sm:text-[15px]"
                  }
                >
                  {item.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2">
                  {item.keywords.map((kw) => (
                    <li key={kw}>
                      <Keyword generous={slide}>{kw}</Keyword>
                    </li>
                  ))}
                </ul>
                {item.href ? (
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 transition group-hover:text-stone-800 sm:mt-5 sm:text-[11px]">
                    {viewProjectLabel} →
                  </p>
                ) : null}
              </>
            );

            return (
              <li key={item.title} className="min-h-0">
                {item.href ? (
                  <Link href={item.href} className="block h-full">
                    <motion.article
                      initial={false}
                      whileHover={
                        reduceMotion
                          ? undefined
                          : {
                              y: -6,
                              transition: { duration: 0.22, ease },
                            }
                      }
                      whileTap={
                        reduceMotion ? undefined : { scale: 0.985, y: -2 }
                      }
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      className={`${cardClassName} ${cursorClass}`}
                    >
                      {cardBody}
                    </motion.article>
                  </Link>
                ) : (
                  <motion.article
                    initial={false}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -6,
                            transition: { duration: 0.22, ease },
                          }
                    }
                    whileTap={
                      reduceMotion ? undefined : { scale: 0.985, y: -2 }
                    }
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    className={`${cardClassName} ${cursorClass}`}
                  >
                    {cardBody}
                  </motion.article>
                )}
              </li>
            );
          })}
        </ul>

        <div
          className={
            slide
              ? "mt-10 shrink-0 border-t border-stone-200/70 pt-8 sm:mt-12 sm:pt-10"
              : "mt-9 border-t border-stone-200/70 pt-7 sm:mt-10 sm:pt-8"
          }
        >
          <h3
            className={
              slide
                ? "font-mono text-xs uppercase tracking-[0.22em] text-stone-500 sm:text-[13px]"
                : "font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:text-[11px]"
            }
          >
            {additionalTitle}
          </h3>
          <ul
            className={
              slide
                ? "mt-5 divide-y divide-stone-200/80"
                : "mt-5 divide-y divide-stone-200/80"
            }
          >
            {additional.map((item) => (
              <li
                key={item.title}
                className={
                  slide
                    ? "flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-start sm:gap-10 sm:py-5"
                    : "flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-start sm:gap-8 sm:py-5"
                }
              >
                <h4
                  className={
                    slide
                      ? "shrink-0 font-display text-base font-medium text-stone-900 sm:w-36 sm:text-lg"
                      : "shrink-0 font-display text-base font-medium text-stone-900 sm:w-36 sm:pt-0.5"
                  }
                >
                  {item.title}
                </h4>
                <p
                  className={
                    slide
                      ? "font-sans text-sm leading-relaxed text-stone-600 sm:flex-1 sm:text-[15px]"
                      : "font-sans text-sm leading-relaxed text-stone-600 sm:flex-1 sm:text-[15px]"
                  }
                >
                  {item.line}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
