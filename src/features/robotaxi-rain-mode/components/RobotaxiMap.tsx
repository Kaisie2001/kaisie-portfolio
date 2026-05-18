"use client";

import type {
  FeatureCollection,
  GeoJsonObject,
  LineString,
  Polygon,
} from "geojson";
import L from "leaflet";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Circle,
  CircleMarker,
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { MapMode } from "../data/mapModes";
import {
  centerMapOnCurrent,
  fitMapToScenarioPoints,
  getScenarioMapPoints,
  toLeafletLatLng,
} from "../data/scenarioMapBounds";
import {
  orientRouteFromVehicleToPickup,
  primaryLineStringRoute,
  routeCoordinates,
  vehicleMarkerOnApproachRoute,
} from "../data/loadGeneratedRoutes";
import {
  getDispatchSearchCenterCoords,
  getDropoffAnchor,
  getPickupAnchor,
  getPickupAnchorName,
  getSelectedDropoffZone,
  getSelectedPickupZone,
  getTripRoute,
  getUserCurrentLocation,
  getVehicleRouteToPickup,
  getWalkingRouteToPickup,
  hasPickupZoneConfirmed,
  hasValidDropoffPoi,
  shouldShowPickupAnchorMarker,
} from "../data/scenarioHelpers";
import { distanceMeters } from "../data/randomScenario";
import { zoneCoords } from "../data/pudoZoneService";
import type {
  PickupZoneId,
  PudoZoneState,
  RobotaxiScenario,
  ScenarioLocation,
  WalkingRouteToPickup,
} from "../data/scenarioTypes";
import type { RouteFeatureCollection } from "../data/loadGeneratedRoutes";
import { useOptionalMapControl } from "../figma-shell/MapControlContext";
import "./robotaxi-map.css";

/** CARTO Positron — light gray/white mobility basemap (OSM data) */
const BASEMAP_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const WALK_COVERED = "#2f9e4e";
const WALK_EXPOSED = "#9fd4ad";
const VEHICLE_CYAN = "#0097a3";
const TRIP_CYAN = "#1a6fb5";

const DISPATCH_SEARCH_COLOR = "#1976d2";
const DISPATCH_SEARCH_MIN_M = 70;
const DISPATCH_SEARCH_MAX_M = 400;
const DISPATCH_SEARCH_MS = 2400;

type ZoneVisualStyle = {
  stroke: string;
  fill: string;
  centerline: string;
  fillOpacity: number;
  strokeOpacity: number;
  centerOpacity: number;
  weight: number;
  centerWeight: number;
};

const ZONE_VISUAL: Record<
  PickupZoneId,
  { idle: ZoneVisualStyle; selected: ZoneVisualStyle }
> = {
  closest: {
    idle: {
      stroke: "#e07a5f",
      fill: "#e07a5f",
      centerline: "#d45656",
      fillOpacity: 0.18,
      strokeOpacity: 0.55,
      centerOpacity: 0.7,
      weight: 2,
      centerWeight: 3,
    },
    selected: {
      stroke: "#c94a4a",
      fill: "#d45656",
      centerline: "#b83c3c",
      fillOpacity: 0.34,
      strokeOpacity: 0.95,
      centerOpacity: 1,
      weight: 3,
      centerWeight: 5,
    },
  },
  sheltered: {
    idle: {
      stroke: "#4fa66a",
      fill: "#3d9a5a",
      centerline: "#2f9e4e",
      fillOpacity: 0.16,
      strokeOpacity: 0.52,
      centerOpacity: 0.68,
      weight: 2,
      centerWeight: 3,
    },
    selected: {
      stroke: "#1f7a38",
      fill: "#2f9e4e",
      centerline: "#1a6b32",
      fillOpacity: 0.38,
      strokeOpacity: 1,
      centerOpacity: 1,
      weight: 3.5,
      centerWeight: 5.5,
    },
  },
  soonest: {
    idle: {
      stroke: "#d4a017",
      fill: "#e8b84a",
      centerline: "#4a90c4",
      fillOpacity: 0.16,
      strokeOpacity: 0.52,
      centerOpacity: 0.72,
      weight: 2,
      centerWeight: 3,
    },
    selected: {
      stroke: "#b8860b",
      fill: "#d99a2e",
      centerline: "#2f7ab8",
      fillOpacity: 0.32,
      strokeOpacity: 0.95,
      centerOpacity: 1,
      weight: 3,
      centerWeight: 5,
    },
  },
};

const DROPOFF_ZONE_VISUAL: ZoneVisualStyle = {
  stroke: "#3c3c43",
  fill: "#52525b",
  centerline: "#1c1c1e",
  fillOpacity: 0.22,
  strokeOpacity: 0.75,
  centerOpacity: 0.9,
  weight: 2.5,
  centerWeight: 4,
};

export type RobotaxiMapProps = {
  mode: MapMode;
  scenario: RobotaxiScenario;
  selectedZoneId?: PickupZoneId;
  dropoffReady?: boolean;
};

function subtleLabelIcon(text: string, emphasized = false) {
  return L.divIcon({
    className: `robotaxi-map-label${emphasized ? " robotaxi-map-label--emphasized" : ""}`,
    html: `<span class="robotaxi-map-label__text">${text}</span>`,
    iconSize: [1, 1],
    iconAnchor: [0, 20],
  });
}

/** Destination POI the user selected in search (not the roadside drop-off zone) */
function dropoffDestinationIcon() {
  return L.divIcon({
    className: "leaflet-div-icon robotaxi-dropoff-dest-icon",
    html: '<div class="robotaxi-dropoff-dest-icon__dot" aria-hidden="true"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

/** Neutral pickup anchor when different from user blue dot */
function pickupAnchorIcon() {
  return L.divIcon({
    className: "leaflet-div-icon robotaxi-anchor-icon",
    html: `<div style="width:12px;height:12px;border-radius:50% 50% 50% 0;background:#6b6b70;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transform:rotate(-45deg)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 12],
  });
}

function vehicleDirectionIcon(bearingDeg: number) {
  return L.divIcon({
    className: "leaflet-div-icon robotaxi-vehicle-icon-wrap",
    html: `<div class="robotaxi-vehicle-icon__body" style="margin-left:-14px;margin-top:-14px;transform:rotate(${bearingDeg}deg);transform-origin:14px 14px" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="11" fill="#0097a3" stroke="#ffffff" stroke-width="2"/>
        <path d="M14 7 L17.5 15.5 L14 12.5 L10.5 15.5 Z" fill="#ffffff"/>
      </svg>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function UserLocationMarker({ position }: { position: [number, number] }) {
  return (
    <>
      <CircleMarker
        center={position}
        radius={12}
        pathOptions={{ stroke: false, fillColor: "#007AFF", fillOpacity: 0.2 }}
        {...({ zIndexOffset: 900 } as Record<string, unknown>)}
      />
      <CircleMarker
        center={position}
        radius={5}
        pathOptions={{
          color: "#ffffff",
          weight: 2.5,
          fillColor: "#007AFF",
          fillOpacity: 1,
        }}
        {...({ zIndexOffset: 901 } as Record<string, unknown>)}
      />
    </>
  );
}

function zoneAreaCollection(zone: PudoZoneState): FeatureCollection<Polygon> {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: zone.geometry,
        properties: { zoneId: zone.id },
      },
    ],
  };
}

function zoneCenterlineCollection(zone: PudoZoneState): FeatureCollection<LineString> {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: zone.centerline,
        properties: { zoneId: zone.id },
      },
    ],
  };
}

function centerlineMidpoint(zone: PudoZoneState): [number, number] {
  const coords = zone.centerline.coordinates;
  const mid = coords[Math.floor(coords.length / 2)] ?? coords[0];
  return [mid![0]!, mid![1]!];
}

/** Roadside curb zone — polygon + emphasized centerline segment */
function PudoZoneLayer({
  zone,
  visual,
  selected = false,
}: {
  zone: PudoZoneState;
  visual: ZoneVisualStyle;
  selected?: boolean;
}) {
  return (
    <>
      <GeoJSON
        key={`pudo-area-${zone.id}-${selected ? "sel" : "idle"}`}
        data={zoneAreaCollection(zone)}
        style={() => ({
          color: visual.stroke,
          weight: visual.weight,
          opacity: visual.strokeOpacity,
          fillColor: visual.fill,
          fillOpacity: visual.fillOpacity,
          lineCap: "round",
          lineJoin: "round",
        })}
      />
      <GeoJSON
        key={`pudo-curb-${zone.id}-${selected ? "sel" : "idle"}`}
        data={zoneCenterlineCollection(zone)}
        style={() => ({
          color: visual.centerline,
          weight: visual.centerWeight,
          opacity: visual.centerOpacity,
          lineCap: "round",
          lineJoin: "round",
        })}
      />
    </>
  );
}

function ZoneLabel({
  zone,
  text,
  emphasized = false,
}: {
  zone: PudoZoneState;
  text: string;
  emphasized?: boolean;
}) {
  const [lng, lat] = centerlineMidpoint(zone);
  return (
    <Marker
      position={toLeafletLatLng(lng, lat)}
      icon={subtleLabelIcon(text, emphasized)}
      zIndexOffset={emphasized ? 780 : 740}
    />
  );
}

function WalkingRouteSegments({
  route,
  emphasized = false,
}: {
  route: WalkingRouteToPickup;
  emphasized?: boolean;
}) {
  return (
    <>
      {route.segments.map((seg) => {
        const covered = seg.segmentType === "covered";
        return (
          <GeoJSON
            key={seg.segmentId}
            data={
              {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: seg.geometry,
                    properties: { segmentType: seg.segmentType },
                  },
                ],
              } as GeoJsonObject
            }
            style={() => ({
              color: covered ? WALK_COVERED : WALK_EXPOSED,
              weight: emphasized ? (covered ? 4.5 : 3.5) : covered ? 3.5 : 2.5,
              opacity: emphasized ? 0.96 : covered ? 0.9 : 0.78,
              lineCap: "round",
              lineJoin: "round",
              dashArray: covered ? undefined : "4, 7",
            })}
          />
        );
      })}
    </>
  );
}

function RouteGeoJson({
  data,
  color,
  weight = 4,
  opacity = 0.95,
  dashed = false,
}: {
  data: RouteFeatureCollection;
  color: string;
  weight?: number;
  opacity?: number;
  dashed?: boolean;
}) {
  return (
    <GeoJSON
      data={data as FeatureCollection<LineString>}
      style={() => ({
        color,
        weight,
        opacity,
        lineCap: "round",
        lineJoin: "round",
        dashArray: dashed ? "7, 9" : undefined,
      })}
    />
  );
}

function PickupZonesOnMap({
  zones,
  selectedZoneId,
  walkingRoutes,
  showOnlySelected,
}: {
  zones: PudoZoneState[];
  selectedZoneId: PickupZoneId;
  walkingRoutes?: RobotaxiScenario["walkingRoutes"];
  showOnlySelected: boolean;
}) {
  const visible = showOnlySelected
    ? zones.filter((z) => z.id === selectedZoneId)
    : zones;
  const unselected = visible.filter((z) => z.id !== selectedZoneId);
  const selected = visible.find((z) => z.id === selectedZoneId);
  const selectedWalk = selected ? walkingRoutes?.[selected.id] : undefined;

  return (
    <>
      {unselected.map((zone) => {
        const visual = ZONE_VISUAL[zone.id].idle;
        return (
          <Fragment key={`zone-idle-${zone.id}`}>
            <PudoZoneLayer zone={zone} visual={visual} selected={false} />
            <ZoneLabel zone={zone} text={zone.label} emphasized={false} />
          </Fragment>
        );
      })}

      {selected ? (
        <Fragment key={`zone-selected-${selected.id}`}>
          {selectedWalk?.segments?.length && !showOnlySelected ? (
            <WalkingRouteSegments route={selectedWalk} emphasized />
          ) : null}
          <PudoZoneLayer
            zone={selected}
            visual={ZONE_VISUAL[selected.id].selected}
            selected
          />
          <ZoneLabel zone={selected} text={selected.label} emphasized />
        </Fragment>
      ) : null}
    </>
  );
}

function ScenarioMapViewSync({
  mode,
  scenario,
  dropoffReady,
}: {
  mode: MapMode;
  scenario: RobotaxiScenario;
  dropoffReady: boolean;
}) {
  const map = useMap();
  const mapControl = useOptionalMapControl();

  useEffect(() => {
    const sheetPct = mapControl?.sheetCoverPct ?? 0.48;

    const run = () => {
      if (map.getSize().x <= 0) return;
      if (mode === "tripSetup" && !dropoffReady) {
        if (hasPickupZoneConfirmed(scenario) && getSelectedPickupZone(scenario)) {
          const points = getScenarioMapPoints(mode, scenario, { dropoffReady: false });
          fitMapToScenarioPoints(map, points, sheetPct, {
            animate: false,
            maxZoom: 17,
          });
          return;
        }
        centerMapOnCurrent(map, scenario, sheetPct, { animate: false, zoom: 16 });
        return;
      }
      const points = getScenarioMapPoints(mode, scenario, { dropoffReady });
      fitMapToScenarioPoints(map, points, sheetPct, { animate: false, maxZoom: 17 });
    };

    map.whenReady(run);
    const id = window.setTimeout(() => {
      map.invalidateSize();
      run();
    }, 120);
    return () => window.clearTimeout(id);
  }, [map, mapControl, mode, scenario, dropoffReady]);

  return null;
}

function MapRecenterRegistration({ scenario }: { scenario: RobotaxiScenario }) {
  const map = useMap();
  const mapControl = useOptionalMapControl();

  useEffect(() => {
    if (!mapControl) return;
    const recenter = () => {
      map.invalidateSize();
      centerMapOnCurrent(map, scenario, mapControl.sheetCoverPct, {
        animate: true,
        zoom: 16,
      });
    };
    mapControl.registerRecenter(recenter);
    return () => mapControl.registerRecenter(null);
  }, [map, mapControl, scenario]);

  return null;
}

function ResizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 200);
    return () => window.clearTimeout(id);
  }, [map]);
  return null;
}

/** Keep overlay layers aligned when zoom / resize changes */
function MapZoomSync() {
  const map = useMap();
  useEffect(() => {
    const sync = () => {
      map.invalidateSize({ pan: false });
    };
    map.on("zoomend", sync);
    map.on("resize", sync);
    return () => {
      map.off("zoomend", sync);
      map.off("resize", sync);
    };
  }, [map]);
  return null;
}

function DispatchSearchPulse({ center }: { center: [number, number] }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      setTick(now - start);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const rings = useMemo(() => {
    const phases = [0, 0.33, 0.66];
    return phases.map((offset, i) => {
      const t = ((tick % DISPATCH_SEARCH_MS) / DISPATCH_SEARCH_MS + offset) % 1;
      const radius =
        DISPATCH_SEARCH_MIN_M + t * (DISPATCH_SEARCH_MAX_M - DISPATCH_SEARCH_MIN_M);
      const fillOpacity = 0.26 * (1 - t);
      return { radius, fillOpacity, key: i };
    });
  }, [tick]);

  const centerLatLng = toLeafletLatLng(center[0], center[1]);

  return (
    <>
      {rings.map((ring) => (
        <Circle
          key={ring.key}
          center={centerLatLng}
          radius={ring.radius}
          pathOptions={{
            color: DISPATCH_SEARCH_COLOR,
            fillColor: DISPATCH_SEARCH_COLOR,
            fillOpacity: ring.fillOpacity,
            weight: 0,
            opacity: 0,
          }}
        />
      ))}
      <CircleMarker
        center={centerLatLng}
        radius={7}
        pathOptions={{
          fillColor: DISPATCH_SEARCH_COLOR,
          fillOpacity: 0.92,
          color: "#ffffff",
          weight: 2,
          opacity: 1,
        }}
      />
    </>
  );
}

export function RobotaxiMap({
  mode,
  scenario,
  selectedZoneId = "sheltered",
  dropoffReady = false,
}: RobotaxiMapProps) {
  const user = getUserCurrentLocation(scenario);
  const userPos = toLeafletLatLng(user.lng, user.lat);
  const anchor = getPickupAnchor(scenario);
  const anchorPos = toLeafletLatLng(anchor.lng, anchor.lat);
  const showPickupAnchor = shouldShowPickupAnchorMarker(scenario);
  const dropoffAnchor = getDropoffAnchor(scenario);
  const dropoffPos = toLeafletLatLng(dropoffAnchor.lng, dropoffAnchor.lat);
  const dropoffMapLabel =
    scenario.dropoffLocation.label.trim() || "Drop-off";
  const anchorMapLabel = getPickupAnchorName(scenario);

  const confirmedPickup = getSelectedPickupZone(scenario);
  const pickupConfirmed = hasPickupZoneConfirmed(scenario);
  const confirmedDropoff = getSelectedDropoffZone(scenario);
  const walkingToSelectedPickup = getWalkingRouteToPickup(scenario);
  const vehicleRouteOnTheWay = getVehicleRouteToPickup(scenario);
  const tripRoute = getTripRoute(scenario);

  const showDropoffOnMap =
    (mode === "tripSetup" && dropoffReady) || mode === "robotaxiOnTheWay";
  const showDropoffDestination =
    showDropoffOnMap && hasValidDropoffPoi(scenario);
  const showDropoffZone =
    showDropoffOnMap && Boolean(confirmedDropoff);
  const dropoffPoiNearZone =
    showDropoffDestination &&
    confirmedDropoff &&
    distanceMeters(dropoffAnchor, confirmedDropoff.representativePoint) < 28;
  const showPickupZones = mode === "choosePickup" || mode === "robotaxiOnTheWay";
  const showTripPickupZone =
    pickupConfirmed && Boolean(confirmedPickup) && mode === "tripSetup";
  const showTripPickupWalking =
    showTripPickupZone &&
    !dropoffReady &&
    Boolean(walkingToSelectedPickup?.segments?.length);
  const showTripRoute = mode === "tripSetup" && dropoffReady;

  const dispatchSearchCenter = useMemo(
    () => getDispatchSearchCenterCoords(scenario),
    [scenario],
  );

  const vehicleRouteDisplay = useMemo(() => {
    const primary = primaryLineStringRoute(vehicleRouteOnTheWay ?? null);
    if (!primary) return null;
    const raw = routeCoordinates(primary);
    if (!raw?.length) return null;
    const pickup = confirmedPickup ? zoneCoords(confirmedPickup) : null;
    const oriented = orientRouteFromVehicleToPickup(
      raw,
      scenario.vehicleLocation,
      pickup,
    );
    return {
      route: {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {},
            geometry: { type: "LineString" as const, coordinates: oriented },
          },
        ],
      },
      coords: oriented,
    };
  }, [vehicleRouteOnTheWay, scenario.vehicleLocation, confirmedPickup]);

  const vehicleOnRoute = useMemo(() => {
    if (!vehicleRouteDisplay?.coords.length) return null;
    const pickup = confirmedPickup ? zoneCoords(confirmedPickup) : null;
    return vehicleMarkerOnApproachRoute(
      vehicleRouteDisplay.coords,
      scenario.vehicleLocation,
      pickup,
    );
  }, [vehicleRouteDisplay, scenario.vehicleLocation, confirmedPickup]);

  const showRoutesNotice =
    (scenario.pudoRoadDataMissing || scenario.pudoMessage || scenario.routesMissing) &&
    (showTripRoute ||
      showPickupZones ||
      (mode as MapMode) === "robotaxiOnTheWay");

  const initialCenter = userPos;

  return (
    <div className="robotaxi-leaflet-map" data-map-mode={mode}>
      {showRoutesNotice ? (
        <div className="robotaxi-routes-fallback" role="status">
          {scenario.pudoMessage ??
            scenario.routesMessage ??
            "Route has not been generated yet."}
        </div>
      ) : null}

      <MapContainer
        center={initialCenter}
        zoom={16}
        minZoom={12}
        maxZoom={19}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        dragging
        touchZoom
        doubleClickZoom
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url={BASEMAP_TILE_URL}
          attribution={BASEMAP_ATTRIBUTION}
          subdomains="abcd"
          maxZoom={20}
        />
        <ScenarioMapViewSync
          mode={mode}
          scenario={scenario}
          dropoffReady={dropoffReady}
        />
        <MapRecenterRegistration scenario={scenario} />
        <ResizeOnMount />
        <MapZoomSync />

        {showTripRoute && tripRoute ? (
          <RouteGeoJson
            data={tripRoute}
            color={TRIP_CYAN}
            weight={3}
            opacity={0.82}
          />
        ) : null}

        {showPickupZones ? (
          <PickupZonesOnMap
            zones={scenario.pickupZoneCandidates}
            selectedZoneId={selectedZoneId}
            walkingRoutes={scenario.walkingRoutes}
            showOnlySelected={mode === "robotaxiOnTheWay"}
          />
        ) : null}

        {showTripPickupWalking && walkingToSelectedPickup ? (
          <WalkingRouteSegments route={walkingToSelectedPickup} emphasized />
        ) : null}

        {showTripPickupZone && confirmedPickup ? (
          <>
            <PudoZoneLayer
              zone={confirmedPickup}
              visual={ZONE_VISUAL[confirmedPickup.id].selected}
              selected
            />
            <ZoneLabel zone={confirmedPickup} text={confirmedPickup.label} emphasized />
          </>
        ) : null}

        {mode === "serviceStatus" && dispatchSearchCenter ? (
          <DispatchSearchPulse center={dispatchSearchCenter} />
        ) : null}

        {showDropoffZone && confirmedDropoff ? (
          <>
            <PudoZoneLayer zone={confirmedDropoff} visual={DROPOFF_ZONE_VISUAL} selected />
            <ZoneLabel zone={confirmedDropoff} text="Drop-off zone" emphasized={false} />
          </>
        ) : null}

        {showDropoffDestination ? (
          <>
            <Marker
              position={dropoffPos}
              icon={dropoffDestinationIcon()}
              zIndexOffset={812}
            />
            <Marker
              position={dropoffPos}
              icon={subtleLabelIcon(
                dropoffPoiNearZone
                  ? `${dropoffMapLabel} · destination`
                  : dropoffMapLabel,
                true,
              )}
              zIndexOffset={815}
            />
          </>
        ) : null}

        {mode === "robotaxiOnTheWay" && walkingToSelectedPickup ? (
          <WalkingRouteSegments route={walkingToSelectedPickup} emphasized />
        ) : null}

        {mode === "robotaxiOnTheWay" && vehicleRouteDisplay ? (
          <RouteGeoJson
            data={vehicleRouteDisplay.route}
            color={VEHICLE_CYAN}
            weight={3.5}
            opacity={0.92}
            dashed
          />
        ) : null}

        {mode === "robotaxiOnTheWay" && vehicleOnRoute ? (
          <Marker
            position={[
              vehicleOnRoute.point[1],
              vehicleOnRoute.point[0],
            ]}
            icon={vehicleDirectionIcon(vehicleOnRoute.bearing)}
            zIndexOffset={860}
          />
        ) : null}

        {mode !== "serviceStatus" ? <UserLocationMarker position={userPos} /> : null}

        {showPickupAnchor && mode !== "serviceStatus" ? (
          <>
            <Marker position={anchorPos} icon={pickupAnchorIcon()} zIndexOffset={820} />
            <Marker
              position={anchorPos}
              icon={subtleLabelIcon(anchorMapLabel)}
              zIndexOffset={825}
            />
          </>
        ) : null}
      </MapContainer>
    </div>
  );
}
