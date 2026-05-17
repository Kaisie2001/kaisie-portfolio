"use client";

import { MapTopActions } from "../MapChrome";
import { PinIcon, SearchIcon } from "../icons/RainModeIcons";
import { PrimaryButton } from "../PrimaryButton";
import { PrototypeScreen } from "../PrototypeScreen";

type TripSetupScreenProps = {
  onContinue: () => void;
};

export function TripSetupScreen({ onContinue }: TripSetupScreenProps) {
  return (
    <PrototypeScreen
      mapVariant="tripSetup"
      showRainPill
      mapActions={<MapTopActions />}
      sheetChildren={
        <>
          <div className="field-row">
            <PinIcon color="#00a8b5" />
            <div>
              <p className="field-label">Pickup</p>
              <p className="field-value">Current location</p>
            </div>
          </div>
          <div className="field-row">
            <SearchIcon />
            <div className="flex-1">
              <p className="field-label">Drop-off</p>
              <p className="field-input">Where to?</p>
            </div>
          </div>
          <p className="hint-row">
            <svg width={11} height={11} viewBox="0 0 24 24" aria-hidden>
              <path
                d="M6 14h12a3 3 0 000-6 4 4 0 00-7.5-1.2A2.5 2.5 0 006 14z"
                fill="#8e8e93"
              />
            </svg>
            Rain detected nearby
          </p>
        </>
      }
      sheetFooter={<PrimaryButton onClick={onContinue}>Set destination</PrimaryButton>}
    />
  );
}
