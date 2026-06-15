"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  LOCAL_LIFE_PROJECT_EYEBROW,
  LOCAL_LIFE_PROJECT_SUBTITLE,
  LOCAL_LIFE_PROJECT_TITLE,
} from "./localLifeProjectCopy";

export function LocalLifePlanningPageHero() {
  const { lang } = useLanguage();

  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
        {LOCAL_LIFE_PROJECT_EYEBROW[lang]}
      </p>
      <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
        {LOCAL_LIFE_PROJECT_TITLE[lang]}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-600 sm:text-base">
        {LOCAL_LIFE_PROJECT_SUBTITLE[lang]}
      </p>
    </>
  );
}
