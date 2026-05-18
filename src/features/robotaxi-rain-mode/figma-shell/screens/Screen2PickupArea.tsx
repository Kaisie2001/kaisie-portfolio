"use client";

import { PICKUP_NEARBY_NAMES } from "../../data/demoPlaceNames";
import type { ScenarioLocation } from "../../data/scenarioTypes";
import { IconPinTeal } from "../icons";
import { ScreenShell } from "../ScreenShell";
import { SheetHeader } from "../SheetHeader";

type Props = {
  onBack: () => void;
  onSelectAnchor: (anchor: ScenarioLocation) => void;
  onChooseOnMap: () => void;
  currentLocationPreset: ScenarioLocation;
};

/** Pickup area search — choose anchor before pickup zone selection */
export function Screen2PickupArea({
  onBack,
  onSelectAnchor,
  onChooseOnMap,
  currentLocationPreset,
}: Props) {
  return (
    <ScreenShell>
      <SheetHeader onBack={onBack} title="Pick-up area" />
      <div className="figma-search-options">
        <button
          type="button"
          className="figma-address figma-address--input"
          onClick={() => onSelectAnchor(currentLocationPreset)}
        >
          <IconPinTeal />
          <div className="figma-address-text">
            <p className="figma-address-label">Suggested</p>
            <p className="figma-address-value">Current location</p>
          </div>
        </button>
        {PICKUP_NEARBY_NAMES.slice(0, 6).map((name) => (
          <button
            key={name}
            type="button"
            className="figma-address figma-address--input"
            onClick={() => onSelectAnchor({ ...currentLocationPreset, label: name })}
          >
            <IconPinTeal />
            <div className="figma-address-text">
              <p className="figma-address-value">{name}</p>
            </div>
          </button>
        ))}
        <button
          type="button"
          className="figma-address figma-address--input"
          onClick={onChooseOnMap}
        >
          <IconPinTeal />
          <div className="figma-address-text">
            <p className="figma-address-value">Choose on map</p>
          </div>
        </button>
      </div>
    </ScreenShell>
  );
}
