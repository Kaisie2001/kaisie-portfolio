"use client";

import type { PudoCandidate } from "../data/types";
import { CarIcon, UmbrellaIcon, WalkIcon } from "./icons/RainModeIcons";

type PudoOptionCardProps = {
  candidate: PudoCandidate;
  selected: boolean;
  onSelect: () => void;
};

const ACCENT: Record<string, { dot: string; border: string; bg: string }> = {
  closest: { dot: "#d32f2f", border: "#ffcdd2", bg: "#fff" },
  sheltered: { dot: "#2e7d32", border: "#2e7d32", bg: "#e8f5e9" },
  soonest: { dot: "#f57c00", border: "#ffe0b2", bg: "#fff" },
  default: { dot: "#757575", border: "#e0e0e0", bg: "#fff" },
};

export function PudoOptionCard({ candidate, selected, onSelect }: PudoOptionCardProps) {
  const accent = ACCENT[candidate.option_type] ?? ACCENT.default;
  const walkMin =
    candidate.walking_time_min ??
    Math.max(1, Math.round(candidate.walking_distance_m / 80));

  return (
    <button
      type="button"
      onClick={onSelect}
      className="pudo-option-card relative w-full rounded-xl border px-3 py-3 text-left transition"
      style={{
        borderColor: selected ? accent.dot : "#eeeeee",
        backgroundColor: selected ? accent.bg : "#ffffff",
        boxShadow: selected ? `0 0 0 1px ${accent.dot}22` : undefined,
      }}
    >
      {selected ? (
        <span className="absolute right-2 top-2 rounded bg-[#34a853] px-1 py-0.5 text-[7px] font-bold tracking-wide text-white">
          SELECTED
        </span>
      ) : null}
      <div className="flex items-start justify-between gap-2 pr-10">
        <div className="flex items-start gap-2">
          <span
            className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: accent.dot }}
            aria-hidden
          />
          <div>
            <p className="text-[14px] font-semibold text-[var(--rain-text-primary,#1a1a1a)]">
              {candidate.label_en}
            </p>
            <p className="copy-cn text-[11px] text-[var(--rain-text-secondary,#666)]">
              {candidate.label_zh}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5 text-[12px] text-[var(--rain-text-primary,#1a1a1a)]">
        <MetricRow
          icon={<WalkIcon color="#666" />}
          text={`Walk ${candidate.walking_distance_m} m · ${walkMin} min`}
        />
        <MetricRow
          icon={<UmbrellaIcon color="#666" />}
          text={`Rain exposure ${candidate.rain_exposed_distance_m} m`}
        />
        {candidate.covered_distance_m != null ? (
          <MetricRow
            icon={<UmbrellaIcon color="#2e7d32" />}
            text={`Covered distance ${candidate.covered_distance_m} m`}
          />
        ) : null}
        <MetricRow
          icon={<CarIcon color="#666" />}
          text={`Vehicle ETA ${candidate.vehicle_eta_min} min`}
        />
        {candidate.estimated_boarding_time_min != null ? (
          <MetricRow
            icon={<CarIcon color="#666" />}
            text={`Boarding ETA ${candidate.estimated_boarding_time_min} min`}
          />
        ) : null}
      </div>

      <p className="mt-2 text-[12px] leading-relaxed text-[var(--rain-text-secondary,#666)]">
        {candidate.tradeoff_summary_en ?? candidate.recommendation_reason_en}
      </p>
    </button>
  );
}

function MetricRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="metric-row flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}
