import type { Metadata } from "next";
import Link from "next/link";
import { RobotaxiRainModeCaseStudy } from "./RobotaxiRainModeCaseStudy";
import { RobotaxiRainModePageClient } from "./RobotaxiRainModePageClient";

export const metadata: Metadata = {
  title: "Robotaxi Rain Mode",
  description:
    "An interactive Robotaxi Rain Mode demo for pickup optimization under rainy conditions.",
};

export default function RobotaxiRainModePage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
          Product case · Robotaxi
        </p>
        <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
          Robotaxi Rain Mode
        </h1>

        <RobotaxiRainModeCaseStudy />

        <section className="mt-14">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
            Prototype
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-stone-700">
            Interactive UI shell aligned with Figma 00robotaxi. Five-screen
            passenger flow with map-based pickup zones, rainy-day tradeoffs, and
            dispatch states.
          </p>
          <p className="mt-4 max-w-2xl rounded-lg border border-stone-200/80 bg-stone-100/50 px-3 py-2 text-[12px] leading-relaxed text-stone-600">
            Simulated demo / operational data for portfolio demonstration only.
            Not official Robotaxi data.
          </p>
          <div className="mt-8">
            <RobotaxiRainModePageClient />
          </div>
        </section>

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
