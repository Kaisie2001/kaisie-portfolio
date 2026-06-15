import type { Metadata } from "next";
import Link from "next/link";
import { LocalLifeInteractiveDemoPreviewSection } from "./LocalLifeInteractiveDemoPreviewSection";
import { LocalLifePlanningCaseOverview } from "./LocalLifePlanningCaseOverview";
import { LocalLifePlanningDetailSections } from "./LocalLifePlanningDetailSections";
import { LocalLifePlanningPageHero } from "./LocalLifePlanningPageHero";
import { LOCAL_LIFE_PROJECT_META } from "./localLifeProjectCopy";

export const metadata: Metadata = {
  title: LOCAL_LIFE_PROJECT_META.title,
  description: LOCAL_LIFE_PROJECT_META.description,
};

export default function LocalLifePlanningAgentPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <LocalLifePlanningPageHero />

        <LocalLifePlanningCaseOverview />

        <LocalLifeInteractiveDemoPreviewSection />

        <LocalLifePlanningDetailSections />

        <Link
          href="/#work"
          className="mt-12 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900 hover:decoration-stone-500"
        >
          ← Work index · 返回作品索引
        </Link>
      </div>
    </div>
  );
}
