"use client";

import {
  IconBack,
  IconCar,
  IconClock,
  IconCloud,
  IconInfoGray,
  IconPeople,
} from "../icons";
import { ScreenShell } from "../ScreenShell";

type Props = { onBack: () => void; onContinue: () => void };

/** Figma screen 2 — Service is available (2×2 metrics) */
export function Screen2ServiceStatus({ onBack, onContinue }: Props) {
  return (
    <ScreenShell mapKind="service" mapDimmed>
      <div className="figma-sheet-handle" />
      <button type="button" className="figma-back" onClick={onBack} aria-label="Back">
        <IconBack />
      </button>
      <h2 className="figma-sheet-title">Service is available</h2>
      <p className="figma-sheet-sub">Rain is affecting arrival times in this area</p>
      <div className="figma-metrics">
        <div className="figma-metric">
          <div className="figma-metric-icon">
            <IconClock />
          </motion>
          <p className="figma-metric-text">
            Estimated wait: <strong>8–10 min</strong>
          </p>
        </motion>
        <div className="figma-metric">
          <motion className="figma-metric-icon">
            <IconCloud />
          </motion>
          <p className="figma-metric-text warn">
            Rain delay: <strong>+3 to 5 min</strong>
          </p>
        </motion>
        <div className="figma-metric">
          <div className="figma-metric-icon">
            <IconPeople />
          </motion>
          <p className="figma-metric-text">
            Queue ahead: <strong>3 requests</strong>
          </p>
        </motion>
        <div className="figma-metric">
          <div className="figma-metric-icon">
            <IconCar />
          </motion>
          <p className="figma-metric-text">
            Nearby vehicles: <strong>6</strong>
          </p>
        </motion>
      </motion>
      <p className="figma-banner-note">
        <IconInfoGray />
        <span>Arrival times may change slightly as conditions update.</span>
      </p>
      <button type="button" className="figma-btn" onClick={onContinue}>
        Continue
      </button>
    </ScreenShell>
  );
}
