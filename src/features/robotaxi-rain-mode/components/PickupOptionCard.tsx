"use client";

import type { PudoCandidate, PudoOptionType } from "../data/types";
import { PinIcon } from "./icons/RainModeIcons";

type PickupOptionCardProps = {
  candidate: PudoCandidate;
  selected: boolean;
  onSelect: () => void;
};

const STYLE: Record<
  PudoOptionType,
  { color: string; selectedBorder: string; selectedBg: string; noteClass?: string }
> = {
  closest: {
    color: "#e53935",
    selectedBorder: "#e53935",
    selectedBg: "#fdecea",
  },
  sheltered: {
    color: "#34a853",
    selectedBorder: "#34a853",
    selectedBg: "#e8f6ec",
    noteClass: "text-[#34a853]",
  },
  soonest: {
    color: "#f5a623",
    selectedBorder: "#f5a623",
    selectedBg: "#fff4e0",
  },
  default: { color: "#00a8b5", selectedBorder: "#34a853", selectedBg: "#e8f6ec" },
  fallback: { color: "#8e8e93", selectedBorder: "#8e8e93", selectedBg: "#f5f5f5" },
};

export function PickupOptionCard({ candidate, selected, onSelect }: PickupOptionCardProps) {
  const s = STYLE[candidate.option_type] ?? STYLE.default;
  const etaHighlight = candidate.option_type === "soonest";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "relative w-full rounded-[12px] border-[1.5px] px-2.5 py-2 text-left transition",
        selected ? "" : "border-[#e5e5ea] bg-white hover:border-[#c7c7cc]",
      ].join(" ")}
      style={
        selected
          ? { borderColor: s.selectedBorder, backgroundColor: s.selectedBg }
          : undefined
      }
    >
      {selected ? (
        <span className="pickup-badge">SELECTED</span>
      ) : null}

      <div className="mb-1 flex items-center gap-1.5 pr-14">
        <PinIcon color={s.color} />
        <span className="text-[12px] font-semibold" style={{ color: s.color }}>
          {candidate.label_en}
        </span>
      </div>

      <div className="mb-0.5 flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10px]">
        <span>
          <span className="text-[var(--rain-text-secondary,#8e8e93)]">Walk </span>
          <span className="font-semibold text-[var(--rain-text-primary,#1c1c1e)]">
            {candidate.walking_distance_m} m
          </span>
        </span>
        <span>
          <span className="text-[var(--rain-text-secondary,#8e8e93)]">Exposure </span>
          <span className="font-semibold text-[var(--rain-text-primary,#1c1c1e)]">
            {candidate.rain_exposed_distance_m} m
          </span>
        </span>
        <span>
          <span className="text-[var(--rain-text-secondary,#8e8e93)]">ETA </span>
          <span
            className={[
              "font-semibold",
              etaHighlight ? "text-[var(--rain-teal,#00a8b5)]" : "text-[var(--rain-text-primary,#1c1c1e)]",
            ].join(" ")}
          >
            {candidate.vehicle_eta_min} min
          </span>
        </span>
      </div>

      <p
        className={[
          "text-[9px] leading-snug text-[var(--rain-text-secondary,#8e8e93)]",
          s.noteClass,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {candidate.recommendation_reason_en}
      </p>
    </button>
  );
}
