"use client";

import dynamic from "next/dynamic";
import type { RobotaxiMapProps } from "./RobotaxiMap";

export const RobotaxiMapLazy = dynamic<RobotaxiMapProps>(
  () => import("./RobotaxiMap").then((m) => m.RobotaxiMap),
  {
    ssr: false,
    loading: () => (
      <div className="robotaxi-map-fallback" role="status">
        Loading map…
      </div>
    ),
  },
);
