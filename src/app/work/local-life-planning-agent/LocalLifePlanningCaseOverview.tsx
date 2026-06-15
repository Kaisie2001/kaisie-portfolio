"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LOCAL_LIFE_CASE_OVERVIEW_LABEL,
  LOCAL_LIFE_CASE_OVERVIEW_TABS,
  type LocalLifeCaseOverviewTabId,
} from "./localLifeCaseOverviewCopy";

const CONTENT_MIN_HEIGHT = "min-h-[440px] sm:min-h-[420px]";

export function LocalLifePlanningCaseOverview() {
  const { lang } = useLanguage();
  const tabs = LOCAL_LIFE_CASE_OVERVIEW_TABS[lang];
  const [activeTab, setActiveTab] =
    useState<LocalLifeCaseOverviewTabId>("snapshot");
  const [displayedTab, setDisplayedTab] =
    useState<LocalLifeCaseOverviewTabId>("snapshot");
  const [isEntering, setIsEntering] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const swapTimer = useRef<number | null>(null);

  const active = useMemo(
    () => tabs.find((tab) => tab.id === displayedTab) ?? tabs[0],
    [displayedTab, tabs],
  );

  useEffect(() => {
    return () => {
      if (swapTimer.current) window.clearTimeout(swapTimer.current);
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
      setIsEntering(true);
    }, 150);
  }, [activeTab, displayedTab]);

  return (
    <section
      className="mt-12"
      aria-labelledby="local-life-case-overview"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="local-life-case-overview"
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500"
        >
          {LOCAL_LIFE_CASE_OVERVIEW_LABEL[lang]}
        </h2>

        <div
          className={`mt-4 flex ${CONTENT_MIN_HEIGHT} items-center justify-center px-2 py-5 sm:py-6`}
        >
          <div
            key={`${lang}-${active.id}`}
            className={[
              "mx-auto flex w-full max-w-2xl flex-col items-center justify-center transition-all duration-300 ease-out",
              isEntering ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            ].join(" ")}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
              {active.eyebrow}
            </p>
            <h3 className="mt-2 font-display text-xl font-normal leading-tight tracking-tight text-stone-950 sm:text-2xl">
              {active.title}
            </h3>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-stone-700 sm:text-[16px]">
              {active.subtitle}
            </p>

            <div className="mt-5 flex max-w-lg flex-wrap justify-center gap-2">
              {active.items.map((item) => (
                <span
                  key={item}
                  className={[
                    "rounded-full border border-stone-200 bg-white/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-stone-600",
                    lang === "en" ? "uppercase" : "",
                  ].join(" ")}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
          {tabs.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "font-mono text-[9px] tracking-[0.16em] transition-colors duration-200 sm:text-[10px]",
                  selected
                    ? "rounded-full bg-stone-950 px-4 py-2 text-stone-50 shadow-[0_10px_30px_rgba(28,25,23,0.12)]"
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
    </section>
  );
}
