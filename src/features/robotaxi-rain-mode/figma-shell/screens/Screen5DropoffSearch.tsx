"use client";

import { resolveDropoffPlaceLocation } from "../../data/demoPlaceCoordinates";
import { DROPOFF_DESTINATION_NAMES } from "../../data/demoPlaceNames";
import type { ScenarioLocation } from "../../data/scenarioTypes";
import { IconTargetBlue } from "../icons";
import { ScreenShell } from "../ScreenShell";
import { SheetHeader } from "../SheetHeader";

type Props = {
  onBack: () => void;
  onSelectDropoff: (location: ScenarioLocation) => void;
};

/** Drop-off search — separate from pickup zone selection */
export function Screen5DropoffSearch({ onBack, onSelectDropoff }: Props) {
  return (
    <ScreenShell>
      <SheetHeader onBack={onBack} title="Drop-off" />
      <div className="figma-search-options">
        {DROPOFF_DESTINATION_NAMES.slice(0, 8).map((name) => (
          <button
            key={name}
            type="button"
            className="figma-address figma-address--input"
            onClick={() => {
              const resolved =
                resolveDropoffPlaceLocation(name) ?? { lng: 0, lat: 0, label: name };
              onSelectDropoff(resolved);
            }}
          >
            <IconTargetBlue />
            <div className="figma-address-text">
              <p className="figma-address-value">{name}</p>
            </div>
          </button>
        ))}
      </div>
    </ScreenShell>
  );
}
