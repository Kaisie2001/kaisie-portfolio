import type { Metadata } from "next";
import Link from "next/link";
import { RobotaxiRainModeCaseStudy } from "./RobotaxiRainModeCaseStudy";
import { RobotaxiGuidedInteractiveDemo } from "./RobotaxiGuidedInteractiveDemo";

export const metadata: Metadata = {
  title: "Robotaxi Rain Mode",
  description:
    "Rain-aware pickup zone recommendation for Robotaxi passengers — interactive product case and coded demo.",
};

export default function RobotaxiRainModePage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
          Product case · Robotaxi
        </p>

        <RobotaxiRainModeCaseStudy />

        <RobotaxiGuidedInteractiveDemo />

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
