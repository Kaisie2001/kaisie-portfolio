"use client";

import { DEMO_DESTINATION } from "../../data/demoData";
import type { PudoCandidate } from "../../data/types";
import {
  CarIcon,
  ClockIcon,
  PinIcon,
  TargetIcon,
  TreeIcon,
  UmbrellaIcon,
  WalkIcon,
} from "../icons/RainModeIcons";
import { InfoBanner } from "../InfoBanner";
import { PrimaryButton } from "../PrimaryButton";
import { PrototypeScreen } from "../PrototypeScreen";
import { SelectedPickupPinLabel } from "../MapPinLabels";
import { ValidationBanner } from "../ValidationBanner";

type ConfirmPickupScreenProps = {
  selected: PudoCandidate;
  onConfirm: () => void;
  onChangePickup: () => void;
};

export function ConfirmPickupScreen({
  selected,
  onConfirm,
  onChangePickup,
}: ConfirmPickupScreenProps) {
  const walkMin =
    selected.walking_time_min ??
    Math.max(1, Math.round(selected.walking_distance_m / 80));
  const boarding =
    selected.estimated_boarding_time_min ?? selected.vehicle_eta_min + 1;
  const landmark = "Mall North Entrance";

  return (
    <PrototypeScreen
      mapVariant="confirmPickup"
      selectedOptionType={selected.option_type}
      showWalkingLegend
      mapOverlay={
        <SelectedPickupPinLabel
          candidate={selected}
          subtitle={`${selected.label_en} · ${landmark}`}
        />
      }
      sheetTitle="Confirm your pick-up"
      sheetFooter={<PrimaryButton onClick={onConfirm}>Request Robotaxi</PrimaryButton>}
      sheetFooterSecondary={
        <PrimaryButton variant="link" onClick={onChangePickup}>
          Change pick-up
        </PrimaryButton>
      }
      sheetChildren={
        <div className="pb-1">
          <div className="detail-row">
            <PinIcon color="#34a853" />
            <span>
              <strong>Pick-up:</strong> {selected.label_en} · {landmark}
            </span>
          </div>
          <div className="detail-row">
            <TargetIcon />
            <span>
              <strong>Drop-off:</strong> {DEMO_DESTINATION.label}
            </span>
          </div>
          <div className="detail-divider" />
          <div className="detail-row">
            <WalkIcon />
            <span>
              Walk {selected.walking_distance_m} m · about {walkMin} min
            </span>
          </div>
          <div className="detail-row">
            <UmbrellaIcon />
            <span>Rain exposure {selected.rain_exposed_distance_m} m</span>
          </div>
          {selected.covered_distance_m != null ? (
            <div className="detail-row">
              <TreeIcon color="#34a853" />
              <span>Covered distance {selected.covered_distance_m} m</span>
            </div>
          ) : null}
          <div className="detail-row">
            <CarIcon />
            <span>Vehicle ETA {selected.vehicle_eta_min} min</span>
          </div>
          <div className="detail-row">
            <ClockIcon />
            <span>Boarding ETA {boarding} min</span>
          </div>
          <InfoBanner>{selected.recommendation_reason_en}</InfoBanner>
          <ValidationBanner message="Valid Robotaxi pick-up candidate" />
        </div>
      }
    />
  );
}
