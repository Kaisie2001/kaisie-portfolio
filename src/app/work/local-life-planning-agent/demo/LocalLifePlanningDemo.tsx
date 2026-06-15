"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_COPY } from "./demoCopy";
import {
  buildMockPlan,
  DEFAULT_DEMO_GOAL,
  DEFAULT_DEMO_GOAL_ZH,
} from "./mockData";
import type { DemoPlan, ExecutionActionId } from "./types";

const EXECUTION_IDS: ExecutionActionId[] = [
  "reserve",
  "order",
  "ticket",
  "share",
];

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-stone-200/80 pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function LocalLifePlanningDemo() {
  const { lang } = useLanguage();
  const copy = DEMO_COPY[lang];
  const defaultGoal = lang === "zh" ? DEFAULT_DEMO_GOAL_ZH : DEFAULT_DEMO_GOAL;

  const [goal, setGoal] = useState(defaultGoal);
  const [plan, setPlan] = useState<DemoPlan | null>(null);
  const [simulated, setSimulated] = useState<Set<ExecutionActionId>>(
    () => new Set(),
  );

  const intentEntries = useMemo(() => {
    if (!plan) return [];
    return Object.entries(plan.intent) as [
      keyof DemoPlan["intent"],
      string,
    ][];
  }, [plan]);

  function handleGenerate() {
    setPlan(buildMockPlan(goal));
    setSimulated(new Set());
  }

  function handleSimulate(id: ExecutionActionId) {
    setSimulated((current) => new Set(current).add(id));
  }

  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
        {copy.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-stone-600">
        {copy.disclaimer}
      </p>

      <div className="mt-10 rounded-2xl border border-stone-200/80 bg-white/90 p-5 shadow-[0_1px_3px_rgba(28,25,23,0.05)] sm:p-7">
        <Panel title={copy.goalLabel}>
          <label className="sr-only" htmlFor="local-life-demo-goal">
            {copy.goalLabel}
          </label>
          <textarea
            id="local-life-demo-goal"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            rows={3}
            placeholder={copy.goalPlaceholder}
            className="w-full resize-y rounded-xl border border-stone-200 bg-[#f7f6f3]/60 px-4 py-3 text-[15px] leading-relaxed text-stone-800 outline-none ring-stone-300 transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2"
          />
          <button
            type="button"
            onClick={handleGenerate}
            className="mt-4 inline-flex rounded-full bg-stone-950 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-50 shadow-[0_10px_30px_rgba(28,25,23,0.12)] transition hover:bg-stone-800"
          >
            {copy.planButton}
          </button>
        </Panel>

        {plan ? (
          <>
            <Panel title={copy.intentTitle}>
              <dl className="grid gap-3 sm:grid-cols-2">
                {intentEntries.map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone-400">
                      {copy.intentLabels[key]}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-stone-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel title={copy.mainPlanTitle}>
              <p className="text-sm leading-relaxed text-stone-700">
                {plan.goal}
              </p>
            </Panel>

            <Panel title={copy.timelineTitle}>
              <ol className="space-y-0">
                {plan.stops.map((stop, index) => (
                  <li key={stop.id}>
                    {stop.travelMinutes != null ? (
                      <p className="flex items-center gap-2 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400">
                        <span className="h-px flex-1 bg-stone-200" aria-hidden />
                        {stop.travelMinutes} min
                        <span className="h-px flex-1 bg-stone-200" aria-hidden />
                      </p>
                    ) : null}
                    <article className="rounded-xl border border-stone-200/80 bg-[#f7f6f3]/50 p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone-400">
                          {String(index + 1).padStart(2, "0")} ·{" "}
                          {copy.categoryLabels[stop.category]} · {stop.arriveAt}
                        </p>
                        <p className="font-mono text-[10px] text-stone-500">
                          {stop.rating}★ · {stop.priceLevel}
                        </p>
                      </div>
                      <h3 className="mt-2 font-display text-base font-medium text-stone-900">
                        {stop.name}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                        {stop.matchReason}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title={copy.fallbacksTitle}>
              <ul className="divide-y divide-stone-200/80 border-t border-stone-200/80">
                {plan.fallbacks.map((fallback) => (
                  <li
                    key={fallback.id}
                    className="flex flex-col gap-1 py-4 first:pt-4 sm:flex-row sm:items-start sm:gap-8"
                  >
                    <p className="shrink-0 font-display text-sm font-medium text-stone-900 sm:w-40">
                      {fallback.trigger}
                    </p>
                    <div className="sm:flex-1">
                      <p className="text-sm font-medium text-stone-800">
                        {fallback.poiName}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                        {fallback.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title={copy.executeTitle}>
              <p className="text-[13px] leading-relaxed text-stone-600">
                {copy.executeNote}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {EXECUTION_IDS.map((id) => {
                  const done = simulated.has(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSimulate(id)}
                      className={[
                        "rounded-full border px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] transition",
                        done
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400",
                        lang === "en" ? "uppercase" : "",
                      ].join(" ")}
                    >
                      {done
                        ? `${copy.executionActions[id]} · ${copy.simulated}`
                        : copy.executionActions[id]}
                    </button>
                  );
                })}
              </div>
            </Panel>
          </>
        ) : null}
      </div>

      <Link
        href="/work/local-life-planning-agent"
        className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900 hover:decoration-stone-500"
      >
        {copy.backLink}
      </Link>
    </>
  );
}
