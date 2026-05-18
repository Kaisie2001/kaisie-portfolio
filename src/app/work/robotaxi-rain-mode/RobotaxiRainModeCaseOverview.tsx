"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CASE_OVERVIEW_TABS,
  type CaseOverviewTabId,
} from "./robotaxiCaseOverviewCopy";

export function RobotaxiRainModeCaseOverview() {
  const { lang } = useLanguage();
  const tabs = CASE_OVERVIEW_TABS[lang];
  const [activeTab, setActiveTab] = useState<CaseOverviewTabId>("snapshot");
  const [displayedTab, setDisplayedTab] =
    useState<CaseOverviewTabId>("snapshot");
  const [activeFlowCard, setActiveFlowCard] = useState<number | null>(null);
  const [isEntering, setIsEntering] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [indicatorIndex, setIndicatorIndex] = useState(0);
  const [indicatorCompressed, setIndicatorCompressed] = useState(false);
  const swapTimer = useRef<number | null>(null);
  const indicatorIndexRef = useRef(0);
  const indicatorTimers = useRef<number[]>([]);

  const active = useMemo(
    () => tabs.find((tab) => tab.id === displayedTab) ?? tabs[0],
    [displayedTab, tabs],
  );
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab),
  );
  const slotWidth = "calc((100% - 0.25rem) / 3)";
  const indicatorWidth = indicatorCompressed ? "2.1rem" : slotWidth;
  const indicatorLeft = indicatorCompressed
    ? `calc(0.125rem + (${slotWidth}) * ${indicatorIndex} + (${slotWidth} - 2.1rem) / 2)`
    : `calc(0.125rem + (${slotWidth}) * ${indicatorIndex})`;

  useEffect(() => {
    return () => {
      if (swapTimer.current) window.clearTimeout(swapTimer.current);
      indicatorTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [lang]);

  useEffect(() => {
    setIsEntering(true);
  }, [lang]);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === current);
        const next = tabs[(currentIndex + 1 + tabs.length) % tabs.length];
        return next?.id ?? "snapshot";
      });
    }, 2500);
    return () => window.clearInterval(interval);
  }, [isPaused, tabs]);

  useEffect(() => {
    if (activeTab === displayedTab) return;
    if (swapTimer.current) window.clearTimeout(swapTimer.current);
    setIsEntering(false);
    swapTimer.current = window.setTimeout(() => {
      setDisplayedTab(activeTab);
      setActiveFlowCard(null);
      setIsEntering(true);
    }, 150);
  }, [activeTab, displayedTab]);

  useEffect(() => {
    indicatorIndexRef.current = indicatorIndex;
  }, [indicatorIndex]);

  useEffect(() => {
    if (activeIndex === indicatorIndexRef.current) {
      setIndicatorCompressed(false);
      return;
    }

    indicatorTimers.current.forEach((timer) => window.clearTimeout(timer));
    setIndicatorCompressed(true);

    indicatorTimers.current = [
      window.setTimeout(() => {
        indicatorIndexRef.current = activeIndex;
        setIndicatorIndex(activeIndex);
      }, 135),
      window.setTimeout(() => {
        setIndicatorCompressed(false);
      }, 390),
    ];

    return () => {
      indicatorTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [activeIndex]);

  return (
    <section
      className="mt-12"
      aria-labelledby="robotaxi-case-overview"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setActiveFlowCard(null);
      }}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="robotaxi-case-overview"
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500"
        >
          Case Overview
        </h2>

        <div className="mt-5 flex h-[20rem] items-center justify-center px-2 py-8 sm:h-[18rem] sm:py-10">
          <div
            key={`${lang}-${active.id}`}
            className={[
              "mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center transition-all duration-300 ease-out",
              isEntering ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            ].join(" ")}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
              {active.eyebrow}
            </p>
            <h3 className="mt-4 font-display text-[28px] font-normal leading-tight tracking-tight text-stone-950 sm:text-[34px]">
              {Array.isArray(active.title)
                ? active.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))
                : active.title}
            </h3>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-stone-700 sm:text-[16px]">
              {active.oneLiner}
            </p>

            {active.keywords ? (
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {active.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-stone-200 bg-white/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-stone-600"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}

            {active.flowCards ? (
              <div className="mt-6 grid w-full max-w-[31rem] grid-cols-2 gap-1.5 md:grid-cols-4">
                {active.flowCards.map((card, index) => {
                  const selected = activeFlowCard === index;
                  return (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() =>
                        setActiveFlowCard((current) =>
                          current === index ? null : index,
                        )
                      }
                      className={[
                        "group relative h-[3.75rem] overflow-hidden rounded-[7px] border text-left transition-all duration-300 ease-out",
                        "hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white hover:shadow-[0_7px_20px_rgba(28,25,23,0.06)]",
                        selected
                          ? "border-stone-400 bg-white shadow-[0_7px_20px_rgba(28,25,23,0.06)]"
                          : "border-stone-200 bg-stone-50/70",
                      ].join(" ")}
                      style={{
                        transitionDelay: active.id === "logic" ? `${index * 70}ms` : "0ms",
                      }}
                    >
                      <span
                        className={[
                          "absolute inset-0 flex flex-col justify-center px-2.5 transition-all duration-[250ms] ease-out",
                          selected
                            ? "-translate-y-1 opacity-0"
                            : "translate-y-0 opacity-100 group-hover:-translate-y-1 group-hover:opacity-0",
                        ].join(" ")}
                      >
                        <span className="block h-3 font-mono text-[9px] font-normal uppercase leading-3 tracking-[0.14em] text-stone-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mt-1.5 flex h-7 items-start font-mono text-[9px] font-normal uppercase leading-[1.15] tracking-[0.08em] text-stone-900">
                          {card.title}
                        </span>
                      </span>
                      <span
                        className={[
                          "absolute inset-0 flex flex-col justify-center px-2.5 font-mono text-[9px] font-normal uppercase leading-[1.15] tracking-[0.06em] text-stone-600 transition-all duration-[250ms] ease-out",
                          selected
                            ? "translate-y-0 opacity-100"
                            : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                        ].join(" ")}
                      >
                        {card.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-1 overflow-x-auto">
          <div className="relative mx-auto grid w-full max-w-[34rem] min-w-[28rem] grid-cols-3 items-center gap-0 rounded-full px-0.5 py-0.5 sm:min-w-0">
            <span
              className="absolute bottom-0.5 top-0.5 z-0 rounded-full bg-stone-950 shadow-[0_10px_30px_rgba(28,25,23,0.12)] transition-all duration-[270ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: indicatorLeft,
                width: indicatorWidth,
              }}
              aria-hidden
            />
            {tabs.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "relative z-10 inline-flex min-h-9 w-full items-center justify-center whitespace-nowrap rounded-full px-3 text-center font-mono text-[9px] tracking-[0.16em] transition-colors duration-200 sm:px-4 sm:text-[10px]",
                    selected
                      ? "text-stone-50"
                      : "text-stone-500 hover:text-stone-900",
                    lang === "en" ? "uppercase" : "",
                  ].join(" ")}
                  aria-pressed={selected}
                >
                  {tab.tabLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
