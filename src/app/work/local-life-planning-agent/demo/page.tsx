import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Local-life Planning Agent Demo",
  description:
    "Placeholder route for the Local-life Planning Agent interactive prototype.",
};

export default function LocalLifePlanningAgentDemoPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
          Demo · Placeholder
        </p>
        <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
          Local-life Planning Agent Demo
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-stone-800 sm:text-base">
          This route will host the migrated local prototype.
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-700 sm:text-base">
          The demo will show goal input, intent summary, route timeline, POI
          cards, fallback plans, and execution simulation.
        </p>
        <Link
          href="/work/local-life-planning-agent"
          className="mt-12 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900 hover:decoration-stone-500"
        >
          ← Back to case study
        </Link>
      </div>
    </div>
  );
}
