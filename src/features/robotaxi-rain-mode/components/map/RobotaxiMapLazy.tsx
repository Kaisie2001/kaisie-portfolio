"use client";

import dynamic from "next/dynamic";
import type { RobotaxiMapProps } from "./RobotaxiMap";

export const RobotaxiMap = dynamic<RobotaxiMapProps>(
  () => import("./RobotaxiMap").then((m) => m.RobotaxiMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[var(--rain-map-land,#eef1f4)] text-[11px] text-[var(--rain-text-secondary,#8e8e93)]">
        Loading map…
      </div>
    ),
  },
);
