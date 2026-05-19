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
import { rainModeDemoData } from "../../data/rainModeDemoData";
import { selectPickupOptions } from "../../engine/selectPickupOptions";
import { planPickupCoordination } from "../../engine/pickupCoordination";

type Props = {
  pickup: PickupId;
  onBack: () => void;
  onStartWalking: () => void;
};

export function Screen4OnTheWay({ pickup, onBack, onStartWalking }: Props) {
  const p = getPickupOption(pickup);
  const selection = selectPickupOptions(
    rainModeDemoData.pudoCandidates,
    rainModeDemoData.walkingRoutes,
    rainModeDemoData.vehicleApproachRoutes,
  );
  const coordination = planPickupCoordination(
    selection,
    rainModeDemoData.vehicleApproachRoutes,
    rainModeDemoData.operationNotices,
  );
  const exposure = selection.exposureByPudo[pickup];
  const eta = selection.etaByPudo[pickup];
  const walkM = exposure?.walkingDistanceM ?? Number.parseInt(p.walk, 10);
  const exposedM =
    exposure?.rainExposedWalkingDistanceM ?? Number.parseInt(p.exposureVal, 10);
  const etaMin = eta?.vehicle_eta_min ?? Number.parseInt(p.etaVal, 10);

  return (
    <ScreenShell>
      <SheetHeader onBack={onBack} title="Robotaxi is on the way" />
      <div className="figma-stat-row">
        <div className="figma-stat-cell">
          <div className="ico">
            <IconCar />
          </div>
          <p>{(coordination.approachDistanceM / 1000).toFixed(1)} km</p>
        </div>
        <div className="figma-stat-cell">
          <div className="ico">
            <IconClock />
          </div>
          <p>In {etaMin} min</p>
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
          Walk {walkM} m · about <strong>{p.walkMin}</strong>
        </span>
      </div>
      <div className="figma-detail">
        <IconUmbrella />
        <span>
          Only <strong>{exposedM} m</strong> is exposed to rain
        </span>
      </div>
      <div className="figma-detail">
        <IconCar />
        <span>
          Vehicle arrives in <strong>{etaMin} min</strong>
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
