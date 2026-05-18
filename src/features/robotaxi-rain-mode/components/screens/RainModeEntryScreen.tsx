"use client";

import { AddressField } from "../AddressField";
import { InfoBanner } from "../InfoBanner";
import { PrototypeLayout } from "../PrototypeLayout";
import {
  PinTealIcon,
  RainSmallIcon,
  SearchGrayIcon,
  TargetTealIcon,
} from "../icons/RainModeIcons";

type RainModeEntryScreenProps = {
  mode: "setDestination" | "confirmDestination";
  onContinue: () => void;
};

/** Figma screen 1 — Rain Mode entry / destination (gray address cards) */
export function RainModeEntryScreen({ mode, onContinue }: RainModeEntryScreenProps) {
  const isConfirm = mode === "confirmDestination";

  return (
    <PrototypeLayout mapVariant="entry" showRainChrome>
      <div className="sheet-handle" />
      {isConfirm ? (
        <>
          <AddressField
            icon={<PinTealIcon />}
            label="Pick-up"
            value="Current location · Coastal Avenue"
          />
          <AddressField
            icon={<TargetTealIcon />}
            label="Drop-off"
            value="Coastal City Mall"
          />
          <InfoBanner>Rain Mode will help optimize your pick-up</InfoBanner>
          <button type="button" className="btn-primary" onClick={onContinue}>
            Continue
          </button>
        </>
      ) : (
        <>
          <AddressField icon={<PinTealIcon />} label="Pick-up" value="Current location" />
          <AddressField
            icon={<SearchGrayIcon />}
            label="Drop-off"
            value="Where to?"
            placeholder
          />
          <p className="hint-row">
            <RainSmallIcon />
            Rain detected nearby
          </p>
          <button type="button" className="btn-primary" onClick={onContinue}>
            Set destination
          </button>
        </>
      )}
    </PrototypeLayout>
  );
}
