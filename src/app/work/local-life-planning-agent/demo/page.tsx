import type { Metadata } from "next";
import { LocalLifePlanningDemo } from "./LocalLifePlanningDemo";

export const metadata: Metadata = {
  title: "Local-life Planning Agent Demo",
  description:
    "Interactive mock demo: goal input, intent summary, route timeline, POI cards, fallbacks, and execution simulation.",
};

export default function LocalLifePlanningAgentDemoPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <LocalLifePlanningDemo />
      </div>
    </div>
  );
}
