"use client";

import {
  IconInfoBlue,
  IconPinTeal,
  IconTargetBlue,
} from "../icons";
import { ScreenShell } from "../ScreenShell";

type Props = { onContinue: () => void };

/** Figma screen 1 — Destination entry */
export function Screen1Destination({ onContinue }: Props) {
  return (
    <ScreenShell mapKind="entry" showRainHeader>
      <div className="figma-sheet-handle" />
      <div className="figma-address">
        <IconPinTeal />
        <div>
          <p className="figma-address-label">Pickup</p>
          <p className="figma-address-value">Current location · Coastal Avenue</p>
        </motion>
      </motion>
      <div className="figma-address">
        <IconTargetBlue />
        <div>
          <p className="figma-address-label">Drop-off</p>
          <p className="figma-address-value">Coastal City Mall</p>
        </motion>
      </motion>
      <div className="figma-banner-info">
        <IconInfoBlue />
        <span>Rain Mode will help optimize your pickup</span>
      </motion>
      <button type="button" className="figma-btn" onClick={onContinue}>
        Continue
      </button>
    </ScreenShell>
  );
}
