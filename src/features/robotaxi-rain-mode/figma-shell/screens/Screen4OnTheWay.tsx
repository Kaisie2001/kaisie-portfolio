"use client";

import type { PickupId } from "../types";
import { getPickupOption } from "../pickup-data";
import {
  IconCar,
  IconCheckBadge,
  IconClock,
  IconRoad,
  IconUmbrella,
  IconWalk,
} from "../icons";
import { ScreenShell } from "../ScreenShell";
import { SheetHeader } from "../SheetHeader";

type Props = {
  pickup: PickupId;
  onBack: () => void;
  onStartWalking: () => void;
};

export function Screen4OnTheWay({ pickup, onBack, onStartWalking }: Props) {
  const p = getPickupOption(pickup);

  return (
    <ScreenShell>
      <SheetHeader onBack={onBack} title="Robotaxi is on the way" />
      <div className="figma-stat-row">
        <div className="figma-stat-cell">
          <div className="ico">
            <IconCar />
          </div>
          <p>1.2 km</p>
        </div>
        <div className="figma-stat-cell">
          <div className="ico">
            <IconClock />
          </div>
          <p>In {p.etaVal}</p>
        </div>
        <div className="figma-stat-cell">
          <div className="ico">
            <IconRoad />
          </div>
          <p>Coastal Ave</p>
        </div>
      </div>
      <div className="figma-detail">
        <IconWalk />
        <span>
          Walk {p.walk} · about <strong>{p.walkMin}</strong>
        </span>
      </div>
      <div className="figma-detail">
        <IconUmbrella />
        <span>
          Only <strong>{p.exposureVal}</strong> is exposed to rain
        </span>
      </div>
      <div className="figma-detail">
        <IconCar />
        <span>
          Vehicle arrives in <strong>{p.etaVal}</strong>
        </span>
      </div>
      <div className="figma-banner-ok">
        <IconCheckBadge />
        <span>Valid Robotaxi pick-up candidate</span>
      </div>
      <button type="button" className="figma-btn" onClick={onStartWalking}>
        Confirm
      </button>
    </ScreenShell>
  );
}
