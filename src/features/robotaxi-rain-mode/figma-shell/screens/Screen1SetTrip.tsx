"use client";

import { displayPlaceLabel } from "../../data/demoPlaceNames";
import { useScenario, getTripSetupPickupLabel } from "../ScenarioContext";
import { IconInfoBlue, IconPinTeal, IconTargetBlue } from "../icons";
import { ScreenShell } from "../ScreenShell";
import { useSheet } from "../SheetContext";

type Props = {
  onOpenPickup: () => void;
  onOpenDropoff: () => void;
  onRequestRobotaxi: () => void;
};

export function Screen1SetTrip({
  onOpenPickup,
  onOpenDropoff,
  onRequestRobotaxi,
}: Props) {
  return (
    <ScreenShell>
      <Screen1SheetContent
        onOpenPickup={onOpenPickup}
        onOpenDropoff={onOpenDropoff}
        onRequestRobotaxi={onRequestRobotaxi}
      />
    </ScreenShell>
  );
}

function Screen1SheetContent({
  onOpenPickup,
  onOpenDropoff,
  onRequestRobotaxi,
}: Props) {
  const { expand } = useSheet();
  const { scenario, pickupZoneConfirmed, requestRobotaxiReady } = useScenario();

  const pickupDisplay = getTripSetupPickupLabel(scenario);
  const dropoffLabel = displayPlaceLabel(scenario.dropoffLocation.label);

  const openPickup = () => {
    expand();
    onOpenPickup();
  };

  const openDropoff = () => {
    expand();
    onOpenDropoff();
  };

  return (
    <>
      <button
        type="button"
        className="figma-address figma-address--input"
        onClick={openPickup}
      >
        <IconPinTeal />
        <div className="figma-address-text">
          <p className="figma-address-label">Pick-up</p>
          <p
            className={
              pickupZoneConfirmed
                ? "figma-address-value"
                : "figma-address-placeholder"
            }
            title={pickupDisplay || undefined}
          >
            {pickupZoneConfirmed
              ? pickupDisplay
              : "Where are you starting from?"}
          </p>
        </div>
      </button>

      <button
        type="button"
        className="figma-address figma-address--input"
        onClick={openDropoff}
      >
        <IconTargetBlue />
        <div className="figma-address-text">
          <p className="figma-address-label">Drop-off</p>
          <p
            className={
              dropoffLabel ? "figma-address-value" : "figma-address-placeholder"
            }
            title={dropoffLabel || undefined}
          >
            {dropoffLabel || "Where to?"}
          </p>
        </div>
      </button>

      <div className="figma-banner-info">
        <IconInfoBlue />
        <span>Rain Mode will help optimize your pick-up</span>
      </div>

      <button
        type="button"
        className="figma-btn"
        onClick={onRequestRobotaxi}
        disabled={!requestRobotaxiReady}
      >
        Request Robotaxi
      </button>
    </>
  );
}
