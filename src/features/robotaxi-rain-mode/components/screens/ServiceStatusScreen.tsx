"use client";

import type { ReactNode } from "react";
import { PrototypeLayout } from "../PrototypeLayout";
import {
  CarIcon,
  ChartIcon,
  ClockIcon,
  ClockOrangeIcon,
  PeopleIcon,
} from "../icons/RainModeIcons";

type ServiceStatusScreenProps = {
  onContinue: () => void;
};

/** Figma screen 2 — Rainy-day service status */
export function ServiceStatusScreen({ onContinue }: ServiceStatusScreenProps) {
  return (
    <PrototypeLayout mapVariant="route" mapDimmed>
      <div className="sheet-handle" />
      <h2 className="sheet-title">Robotaxi service is available</h2>
      <p className="sheet-subtitle">Rain is affecting arrival times in this area</p>
      <div className="metric-grid">
        <MetricCard icon={<ClockIcon />}>
          Estimated wait: <strong>8–10 min</strong>
        </MetricCard>
        <MetricCard icon={<ClockIcon />}>
          Usual wait: <strong>5 min</strong>
        </MetricCard>
        <MetricCard icon={<ClockOrangeIcon />} orange>
          Rain delay: <strong>+3 to 5 min</strong>
        </MetricCard>
        <MetricCard icon={<PeopleIcon />}>
          Queue ahead: <strong>3 requests</strong>
        </MetricCard>
        <MetricCard icon={<CarIcon />}>
          Nearby vehicles: <strong>12</strong>
        </MetricCard>
        <MetricCard icon={<ChartIcon />}>
          ETA uncertainty: <strong>±2 min</strong>
        </MetricCard>
      </div>
      <p className="banner-note">
        <svg width={10} height={10} viewBox="0 0 24 24" className="mt-0.5 shrink-0" aria-hidden>
          <circle cx={12} cy={12} r={10} fill="#aeaeb2" />
          <text x={12} y={16} textAnchor="middle" fill="white" fontSize={10} fontWeight="bold">
            i
          </text>
        </svg>
        Arrival times may change slightly as conditions update.
      </p>
      <button type="button" className="btn-primary" onClick={onContinue}>
        Choose pick-up option
      </button>
    </PrototypeLayout>
  );
}

function MetricCard({
  icon,
  children,
  orange,
}: {
  icon: ReactNode;
  children: ReactNode;
  orange?: boolean;
}) {
  return (
    <div className="metric-card">
      <div className="mb-1">{icon}</div>
      <div className={`metric-text${orange ? " orange" : ""}`}>{children}</div>
    </div>
  );
}
