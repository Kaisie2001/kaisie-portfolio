"use client";

import type { MapGeoLayers } from "../data/loadMapData";
import type { PudoCandidate, RainModeDemoBundle } from "../data/types";
import { MapFirstLayout } from "./MapFirstLayout";
import { PrimaryButton } from "./PrimaryButton";
import { PudoOptionCard } from "./PudoOptionCard";
import { RobotaxiMap } from "./map/RobotaxiMapLazy";

type PudoOptionComparisonScreenProps = {
  bundle: RainModeDemoBundle;
  mapLayers: MapGeoLayers;
  candidates: PudoCandidate[];
  selectedPudoId: string;
  onSelect: (pudoId: string) => void;
  onConfirm: () => void;
};

export function PudoOptionComparisonScreen({
  bundle,
  mapLayers,
  candidates,
  selectedPudoId,
  onSelect,
  onConfirm,
}: PudoOptionComparisonScreenProps) {
  return (
    <MapFirstLayout
      map={
        <RobotaxiMap
          mode="choosePickup"
          mapLayers={mapLayers}
          bundle={bundle}
          selectedZoneId={selectedPudoId}
          showPickupZones
          showWalkingRoutes
        />
      }
      sheetTitle="Choose your pick-up priority"
      sheetSubtitle="All options are valid Robotaxi pick-up candidates"
      sheetFooter={<PrimaryButton onClick={onConfirm}>Confirm pick-up</PrimaryButton>}
      sheetChildren={
        <div className="space-y-2.5 pb-2">
          {candidates.map((c) => (
            <PudoOptionCard
              key={c.pudo_id}
              candidate={c}
              selected={c.pudo_id === selectedPudoId}
              onSelect={() => onSelect(c.pudo_id)}
            />
          ))}
        </div>
      }
    />
  );
}
