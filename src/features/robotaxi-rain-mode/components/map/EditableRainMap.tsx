"use client";

import "../rain-map.css";
import "../rain-theme.css";

/**
 * Vector map — reconstructed from Figma visual reference image (editable SVG).
 * Reference image is NOT used as a static background.
 */

import type { PudoCandidate, WalkingRoute } from "../../data/types";
import { EditableMapLayer } from "./EditableMapLayer";
import { MapLabels } from "./MapLabels";
import { MapRouteLayer } from "./MapRouteLayer";
import { PickupPin, formatPinSubtitle } from "./PickupPin";
import { MAP_VIEWBOX, VEHICLE_DEMO_POSITION } from "./mapGeometry";
import { latLonFromPoint, projectCandidate, projectUserLocation } from "./projectCoordinates";
import { UserLocationMarker } from "./UserLocationMarker";
import { VehicleMarker } from "./VehicleMarker";

export type MapPinLayout = {
  id: string;
  x: number;
  y: number;
  candidate: PudoCandidate;
};

type EditableRainMapProps = {
  candidates: PudoCandidate[];
  selectedPudoId: string;
  route?: WalkingRoute;
  userLocation?: { geometry: { type: "Point"; coordinates: [number, number] } };
  compact?: boolean;
  onSelectPin?: (pudoId: string) => void;
  showAllRoutes?: boolean;
  showVehicle?: boolean;
  vehicleDistanceLabel?: string;
};

function buildPinLayouts(
  candidates: PudoCandidate[],
  userLocation?: EditableRainMapProps["userLocation"],
): MapPinLayout[] {
  const userPoint = userLocation?.geometry;
  const latLons = candidates
    .filter((c) => c.geometry?.coordinates)
    .map((c) => latLonFromPoint(c.geometry));

  return candidates.map((c) => {
    const [lon, lat] = c.geometry?.coordinates ?? [undefined, undefined];
    const { x, y } = projectCandidate(lat, lon, c.option_type, latLons, userPoint);
    return { id: c.pudo_id, x, y, candidate: c };
  });
}

function pinTitle(c: PudoCandidate): string {
  if (c.option_type === "closest") return "Closest";
  if (c.option_type === "sheltered") return "Sheltered";
  if (c.option_type === "soonest") return "Soonest";
  return c.label_en;
}

function pinSubtitle(c: PudoCandidate): string {
  if (c.option_type === "sheltered" && c.osm_reference) {
    const short = c.osm_reference.includes("Mall")
      ? "Mall North Entrance"
      : c.osm_reference;
    return short.length > 28 ? `${short.slice(0, 26)}…` : short;
  }
  return formatPinSubtitle(c.walking_distance_m, c.walking_time_min);
}

export function EditableRainMap({
  candidates,
  selectedPudoId,
  route,
  userLocation,
  compact = false,
  onSelectPin,
  showAllRoutes = false,
  showVehicle = false,
  vehicleDistanceLabel,
}: EditableRainMapProps) {
  const pins = buildPinLayouts(candidates, userLocation);
  const user = projectUserLocation(userLocation?.geometry);
  const selected = pins.find((p) => p.id === selectedPudoId) ?? pins[0];

  const exposedLen =
    route?.rain_exposed_distance_m ?? selected?.candidate.rain_exposed_distance_m ?? 0;
  const coveredLen = route?.covered_distance_m ?? selected?.candidate.covered_distance_m ?? 0;
  const total = Math.max(exposedLen + coveredLen, 1);
  const coveredRatio = coveredLen / total;

  const inactiveRoutes =
    showAllRoutes && selected
      ? pins
          .filter((p) => p.id !== selected.id)
          .map((p) => ({ user, pin: { x: p.x, y: p.y } }))
      : [];

  const height = compact ? 220 : MAP_VIEWBOX.height;

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      className={`map-rain-editable w-full`}
      style={{ height }}
      role="img"
      aria-label="Editable map with pick-up candidates"
    >
      <EditableMapLayer />
      <MapLabels />

      {showAllRoutes
        ? pins
            .filter((p) => p.id !== selectedPudoId)
            .map((p) => (
              <MapRouteLayer
                key={`route-${p.id}`}
                user={user}
                pin={{ x: p.x, y: p.y }}
                coveredRatio={0.2}
              />
            ))
        : null}

      {selected ? (
        <MapRouteLayer
          user={user}
          pin={{ x: selected.x, y: selected.y }}
          coveredRatio={coveredRatio}
          inactiveRoutes={showAllRoutes ? [] : inactiveRoutes}
        />
      ) : null}

      {pins.map((pin) => (
        <PickupPin
          key={pin.id}
          x={pin.x}
          y={pin.y}
          selected={pin.id === selectedPudoId}
          optionType={pin.candidate.option_type}
          title={pinTitle(pin.candidate)}
          subtitle={pinSubtitle(pin.candidate)}
          onSelect={onSelectPin ? () => onSelectPin(pin.id) : undefined}
        />
      ))}

      <UserLocationMarker x={user.x} y={user.y} />

      {showVehicle ? (
        <>
          <path
            className="map-vehicle-path"
            d={`M ${VEHICLE_DEMO_POSITION.x} ${VEHICLE_DEMO_POSITION.y} Q 290 140 ${selected?.x ?? 268} ${selected?.y ?? 102}`}
            fill="none"
            stroke="#1976d2"
            strokeWidth={2}
            strokeDasharray="6 5"
            opacity={0.7}
          />
          <VehicleMarker
            x={VEHICLE_DEMO_POSITION.x}
            y={VEHICLE_DEMO_POSITION.y}
            distanceLabel={vehicleDistanceLabel}
          />
        </>
      ) : null}
    </svg>
  );
}
