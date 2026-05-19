"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/portfolioCopy";
import type { GuidedDemoStepId } from "./guidedDemoCopy";
import type { CompareOptionId } from "./guidedDemoFrozenScenario";
import { GdIconLocate, GdIconRain } from "./GuidedDemoIcons";
import { GuidedDemoStaticMap } from "./GuidedDemoStaticMap";
import { GuidedDemoStaticScreen } from "./GuidedDemoStaticScreen";
import { STATIC_SHEET_HEIGHT } from "./guidedDemoStaticData";

type Props = {
  stepId: GuidedDemoStepId;
  lang: Lang;
  highlightPickupId?: CompareOptionId;
  compareCycleKey?: number;
};

function StatusBar() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 h-11" aria-hidden>
      <div className="absolute left-1/2 top-2 z-40 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-black" />
      <div className="absolute inset-x-0 top-[13px] z-40 flex h-[18px] items-center justify-between px-5 text-stone-900">
        <span className="text-xs font-semibold leading-none">1:47</span>
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 18 12" width={14} height={9} aria-hidden>
            <rect x={0} y={6.5} width={3} height={5.5} rx={0.6} fill="currentColor" />
            <rect x={4.5} y={4.5} width={3} height={7.5} rx={0.6} fill="currentColor" />
            <rect x={9} y={2} width={3} height={10} rx={0.6} fill="currentColor" />
            <rect x={13.5} y={0} width={3} height={12} rx={0.6} fill="currentColor" />
          </svg>
          <svg viewBox="0 0 27 13" width={21} height={10} aria-hidden>
            <rect x={0.5} y={0.5} width={22} height={12} rx={3.2} stroke="currentColor" fill="none" opacity={0.35} />
            <rect x={2} y={2} width={16} height={9} rx={1.8} fill="currentColor" />
          </svg>
        </div>
      </div>
    </header>
  );
}

/** Crisp static phone UI that mirrors the live demo without importing it. */
export function GuidedDemoPhoneShowcase({
  stepId,
  lang,
  highlightPickupId,
  compareCycleKey,
}: Props) {
  const isCompareStep = stepId === 2;
  const [compareSheetRevealed, setCompareSheetRevealed] = useState(!isCompareStep);
  const sheetStyle = {
    height: STATIC_SHEET_HEIGHT[stepId],
    minHeight: STATIC_SHEET_HEIGHT[stepId],
    transform: isCompareStep
      ? `translateY(${compareSheetRevealed ? 18 : 72}px)`
      : undefined,
    transition: isCompareStep
      ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)"
      : undefined,
  } as CSSProperties;
  const locateBottom = isCompareStep
    ? `calc(${STATIC_SHEET_HEIGHT[stepId]} + ${compareSheetRevealed ? 30 : 84}px)`
    : `calc(${STATIC_SHEET_HEIGHT[stepId]} + 14px)`;

  useEffect(() => {
    if (!isCompareStep) {
      setCompareSheetRevealed(true);
      return;
    }

    setCompareSheetRevealed(false);
    const timer = window.setTimeout(() => {
      setCompareSheetRevealed(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [compareCycleKey, isCompareStep]);

  return (
    <div className="flex justify-center">
      <div
        key={`${lang}-${stepId}-${compareCycleKey ?? "base"}`}
        className="relative h-[515px] w-[260px] shrink-0 overflow-hidden bg-slate-100"
        style={{
          borderRadius: 36,
          boxShadow:
            "0 16px 48px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.06)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        }}
        role="img"
        aria-label={`Rain Mode app screen step ${stepId}`}
      >
        <StatusBar />
        <GuidedDemoStaticMap
          stepId={stepId}
          lang={lang}
          dimmed={stepId >= 2}
          highlightPickupId={highlightPickupId}
        />
        <div className="pointer-events-none absolute inset-x-0 top-[46px] z-20 px-3.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-600 px-2.5 py-1 text-[10px] font-semibold text-white">
            <GdIconRain />
            Rain Mode
          </span>
        </div>
        <div
          className="absolute right-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-stone-700 shadow"
          style={{ bottom: locateBottom }}
          aria-hidden
        >
          <GdIconLocate />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.1)]"
          style={sheetStyle}
        >
          <div className="flex justify-center px-0 pb-2 pt-2.5">
            <span className="h-1 w-8 rounded-full bg-zinc-300" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden px-4 pb-2">
            <GuidedDemoStaticScreen
              stepId={stepId}
              lang={lang}
              highlightPickupId={highlightPickupId}
            />
          </div>
          <div className="h-2" />
        </div>
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1 w-[72px] -translate-x-1/2 rounded-full bg-black/30" />
      </div>
    </div>
  );
}
