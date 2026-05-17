"use client";

import type { ReactNode } from "react";
import type { MapMode, PickupZoneId } from "../data/mapModes";
import type { PudoOptionType } from "../data/types";
import { MapChrome } from "./MapChrome";
import { MapFirstLayout } from "./MapFirstLayout";
import { MapLegend } from "./MapLegend";
import { RobotaxiMapLazy } from "./RobotaxiMapLazy";

type PrototypeScreenProps = {
  mapVariant: MapMode;
  selectedOptionType?: PudoOptionType;
  sheetTitle?: string;
  sheetSubtitle?: string;
  sheetChildren: ReactNode;
  sheetFooter?: ReactNode;
  sheetFooterSecondary?: ReactNode;
  showRainPill?: boolean;
  mapActions?: ReactNode;
  showWalkingLegend?: boolean;
  showVehicleLegend?: boolean;
  dimMap?: boolean;
  mapOverlay?: ReactNode;
  sheetTitleRow?: ReactNode;
};

function toPickupZoneId(type?: PudoOptionType): PickupZoneId {
  if (type === "closest" || type === "sheltered" || type === "soonest") return type;
  return "sheltered";
}

function mapLayerFlags(mode: MapMode) {
  switch (mode) {
    case "tripSetup":
    case "destinationConfirm":
    case "serviceStatus":
      return {
        showPickupZones: false,
        showWalkingRoutes: false,
        showVehicleRoute: false,
      };
    case "choosePickup":
      return {
        showPickupZones: true,
        showWalkingRoutes: true,
        showVehicleRoute: false,
      };
    case "confirmPickup":
    case "robotaxiOnTheWay":
      return {
        showPickupZones: true,
        showWalkingRoutes: true,
        showVehicleRoute: mode === "robotaxiOnTheWay",
      };
  }
}

export function PrototypeScreen({
  mapVariant,
  selectedOptionType = "sheltered",
  sheetTitle,
  sheetSubtitle,
  sheetChildren,
  sheetFooter,
  sheetFooterSecondary,
  showRainPill = false,
  mapActions,
  showWalkingLegend = false,
  showVehicleLegend = false,
  dimMap,
  mapOverlay,
  sheetTitleRow,
}: PrototypeScreenProps) {
  const zoneId = toPickupZoneId(selectedOptionType);
  const flags = mapLayerFlags(mapVariant);

  return (
    <MapFirstLayout
      dimMap={dimMap ?? mapVariant === "serviceStatus"}
      map={
        <>
          <RobotaxiMapLazy
            key={`${mapVariant}-${zoneId}`}
            mode={mapVariant}
            selectedZoneId={zoneId}
            {...flags}
          />
          <MapChrome showRainPill={showRainPill} actions={mapActions} />
          <MapLegend
            showWalkingLegend={showWalkingLegend}
            showVehicleLegend={showVehicleLegend}
          />
          {mapOverlay}
        </>
      }
      sheetTitle={sheetTitleRow ? undefined : sheetTitle}
      sheetSubtitle={sheetTitleRow ? undefined : sheetSubtitle}
      sheetFooter={sheetFooter}
      sheetFooterSecondary={sheetFooterSecondary}
      sheetChildren={
        sheetTitleRow ? (
          <>
            {sheetTitleRow}
            {sheetChildren}
          </>
        ) : (
          sheetChildren
        )
      }
    />
  );
}
