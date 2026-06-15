import type { Metadata } from "next";
import Link from "next/link";
import { LocalLifeDemoApp } from "./LocalLifeDemoApp";

export const metadata: Metadata = {
  title: "Local-life Planning Agent Demo",
  description:
    "Interactive prototype for the Meituan local-life planning agent case study.",
};

export default function LocalLifePlanningAgentDemoPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
          Interactive prototype
        </p>

        <div className="mt-8 flex justify-center">
          <div
            className="flex h-[min(844px,calc(100dvh-8rem))] w-full max-w-[390px] flex-col overflow-hidden rounded-[32px] border border-stone-200/80 bg-[#f5f6f8] shadow-[0_18px_46px_rgba(28,25,23,0.12)] ring-1 ring-stone-900/[0.04]"
            aria-label="Local-life planning demo prototype shell"
          >
            <div className="flex shrink-0 items-center justify-center border-b border-stone-200/60 bg-[#f7f6f3] px-4 py-3">
              <div className="h-1.5 w-24 rounded-full bg-stone-300/80" aria-hidden />
            </div>
            <LocalLifeDemoApp mode="full" />
          </div>
        </div>

        <Link
          href="/work/local-life-planning-agent"
          className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900 hover:decoration-stone-500"
        >
          ← Back to case study
        </Link>
      </div>
    </div>
  );
}
