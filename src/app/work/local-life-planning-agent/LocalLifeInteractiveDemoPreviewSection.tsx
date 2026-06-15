"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LocalLifeDemoApp } from "./demo/LocalLifeDemoApp";
import {
  LOCAL_LIFE_INTERACTIVE_DEMO_COPY,
  LOCAL_LIFE_INTERACTIVE_DEMO_CTA,
  LOCAL_LIFE_INTERACTIVE_DEMO_TITLE,
} from "./localLifeDetailCopy";

export function LocalLifeInteractiveDemoPreviewSection() {
  const { lang } = useLanguage();

  return (
    <section className="mt-14" aria-labelledby="local-life-interactive-demo-preview">
      <h2
        id="local-life-interactive-demo-preview"
        className="font-display text-2xl font-normal tracking-tight text-stone-900 sm:text-[1.65rem]"
      >
        {LOCAL_LIFE_INTERACTIVE_DEMO_TITLE[lang]}
      </h2>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-stone-600 sm:text-sm">
        {LOCAL_LIFE_INTERACTIVE_DEMO_COPY[lang]}
      </p>

      <div className="mt-8 flex justify-center">
        <div
          className="flex w-full max-w-[390px] flex-col overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-[0_18px_46px_rgba(28,25,23,0.12)] ring-1 ring-stone-900/[0.04]"
          aria-label="Local-life planning demo preview"
        >
          <div className="flex shrink-0 items-center justify-center border-b border-stone-200/60 bg-[#f7f6f3] px-4 py-3">
            <div className="h-1.5 w-24 rounded-full bg-stone-300/80" aria-hidden />
          </div>
          <LocalLifeDemoApp mode="preview" />
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/work/local-life-planning-agent/demo"
          className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
        >
          {LOCAL_LIFE_INTERACTIVE_DEMO_CTA[lang]}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
