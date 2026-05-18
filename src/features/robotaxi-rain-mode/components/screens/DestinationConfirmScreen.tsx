"use client";

import { DEMO_DESTINATION } from "../../data/demoData";
import { BackIcon, PinIcon, TargetIcon } from "../icons/RainModeIcons";
import { InfoBanner } from "../InfoBanner";
import { PrimaryButton } from "../PrimaryButton";
import { PrototypeScreen } from "../PrototypeScreen";

type DestinationConfirmScreenProps = {
  onContinue: () => void;
  onBack: () => void;
};

export function DestinationConfirmScreen({ onContinue, onBack }: DestinationConfirmScreenProps) {
  return (
    <PrototypeScreen
      mapVariant="destinationConfirm"
      sheetChildren={
        <>
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back">
            <BackIcon />
          </button>
          <div className="field-row">
            <PinIcon color="#00a8b5" />
            <div>
              <p className="field-label">Pick-up</p>
              <p className="field-value">Current location · Coastal Avenue</p>
            </div>
          </div>
          <div className="field-row">
            <TargetIcon />
            <div>
              <p className="field-label">Drop-off</p>
              <p className="field-value">{DEMO_DESTINATION.label}</p>
            </div>
          </div>
          <InfoBanner>Rain Mode will help optimize your pick-up</InfoBanner>
        </>
      }
      sheetFooter={<PrimaryButton onClick={onContinue}>Continue</PrimaryButton>}
    />
  );
}
