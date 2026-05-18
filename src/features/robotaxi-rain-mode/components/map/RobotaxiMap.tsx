"use client";

import type { Feature, FeatureCollection, Geometry, LineString } from "geojson";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { GeoJSON, MapContainer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { boundsFromManifest, type MapGeoLayers } from "../../data/loadMapData";
import type { MapMode } from "../../data/mapModes";
import { DEMO_DESTINATION } from "../../data/demoData";
import type { RainModeDemoBundle } from "../../data/types";
import "./robotaxi-map.css";

export type RobotaxiMapProps = {
  mode: MapMode;
  mapLayers: MapGeoLayers;
  bundle: RainModeDemoBundle;
  selectedZoneId?: string;
  showPickupZones?: boolean;
  showWalkingRoutes?: boolean;
  showVehicleRoute?: boolean;
};

const ZONE_COLOR: Record<string, string> = {
  closest: "#e53935",
  sheltered: "#34a853",
  soonest: "#f5a623",
  fallback: "#8e8e93",
};

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [18, 18], maxZoom: 17 });
    const t = window.setTimeout(() => map.invalidateSize(), 100);
    return () => window.clearTimeout(t);
  }, [map, bounds]);
  return null;
}

function pudoIdToOptionType(bundle: RainModeDemoBundle, pudoId: string): string {
  return bundle.pudo_candidates.find((c) => c.pudo_id === pudoId)?.option_type ?? "";
}

export function RobotaxiMap({
  mode,
  mapLayers,
  bundle,
  selectedZoneId = "",
  showPickupZones = false,
  showWalkingRoutes = false,
  showVehicleRoute = false,
}: RobotaxiMapProps) {
  const bounds = useMemo(
    () => boundsFromManifest(mapLayers.manifest),
    [mapLayers.manifest],
  );

  const selectedOptionType = pudoIdToOptionType(bundle, selectedZoneId);
  const comparisonTypes = new Set(["closest", "sheltered", "soonest"]);

  const userLatLng = useMemo(() => {
    const [lon, lat] = bundle.user_location.geometry.coordinates;
    return [lat, lon] as [number, number];
  }, [bundle.user_location]);

  const destLatLng = useMemo(() => {
    const [lon, lat] = DEMO_DESTINATION.geometry.coordinates;
    return [lat, lon] as [number, number];
  }, []);

  const walkingFeatures = useMemo(() => {
    if (!showWalkingRoutes || !mapLayers.walkingRoutes) return [];
    const pudoId = selectedZoneId || bundle.pudo_candidates.find((c) => c.option_type === "sheltered")?.pudo_id;
    return mapLayers.walkingRoutes.features.filter(
      (f) => f.properties?.pudo_id === pudoId,
    );
  }, [showWalkingRoutes, mapLayers.walkingRoutes, selectedZoneId, bundle.pudo_candidates]);

  return (
    <div className="robotaxi-leaflet-map">
      <MapContainer
        center={userLatLng}
        zoom={16}
        scrollWheelZoom
        dragging
        zoomControl={false}
        attributionControl={false}
      >
        <FitBounds bounds={bounds} />

        {mapLayers.water ? (
          <GeoJSON
            data={mapLayers.water}
            style={() => ({ fillColor: "#c5e3f6", fillOpacity: 0.85, color: "#a8d4f0", weight: 0.5 })}
          />
        ) : null}
        {mapLayers.parks ? (
          <GeoJSON
            data={mapLayers.parks}
            style={() => ({ fillColor: "#d4edda", fillOpacity: 0.7, color: "#b8dfc4", weight: 0.5 })}
          />
        ) : null}
        {mapLayers.buildings ? (
          <GeoJSON
            data={mapLayers.buildings}
            style={() => ({ fillColor: "#dde2e8", fillOpacity: 0.9, color: "#cfd5dc", weight: 0.3 })}
          />
        ) : null}
        {mapLayers.roads ? (
          <GeoJSON
            data={mapLayers.roads}
            style={() => ({ color: "#ffffff", weight: 2.5, opacity: 1 })}
          />
        ) : null}
        {mapLayers.pois ? (
          <GeoJSON
            data={mapLayers.pois}
            pointToLayer={(_f, latlng) =>
              L.circleMarker(latlng, {
                radius: 3,
                fillColor: "#8e8e93",
                fillOpacity: 0.5,
                color: "#fff",
                weight: 1,
              })
            }
          />
        ) : null}

        {showPickupZones && mapLayers.pudoZones
          ? mapLayers.pudoZones.features
              .filter((f) => {
                const t = String(f.properties?.option_type ?? "");
                if (mode === "robotaxiOnTheWay") {
                  return t === selectedOptionType && selectedOptionType !== "";
                }
                return comparisonTypes.has(t);
              })
              .map((feature, i) => (
                <GeoJSON
                  key={`zone-${i}`}
                  data={feature as Feature<Geometry>}
                  style={() => {
                    const t = String(feature.properties?.option_type ?? "");
                    const selected =
                      t === selectedOptionType ||
                      (!selectedOptionType && t === "sheltered");
                    return {
                      color: ZONE_COLOR[t] ?? "#666",
                      weight: selected ? 7 : 4,
                      opacity: selected ? 1 : 0.65,
                      lineCap: "round",
                    };
                  }}
                />
              ))
          : null}

        {walkingFeatures.map((feature, i) => {
          const segment = String(feature.properties?.segment ?? "exposed");
          const isCovered = segment === "covered";
          return (
            <GeoJSON
              key={`walk-${i}`}
              data={feature as Feature<LineString>}
              style={() => ({
                color: "#34a853",
                weight: isCovered ? 4 : 3,
                opacity: 0.95,
                dashArray: isCovered ? undefined : "4, 6",
                lineCap: "round",
              })}
            />
          );
        })}

        {showVehicleRoute && mapLayers.vehicleRoute ? (
          <GeoJSON
            data={mapLayers.vehicleRoute}
            style={() => ({
              color: "#00a8b5",
              weight: 3,
              opacity: 0.9,
              dashArray: "6, 8",
              lineCap: "round",
            })}
          />
        ) : null}

        <Marker
          position={userLatLng}
          icon={L.divIcon({
            className: "",
            html: '<div style="width:12px;height:12px;border-radius:50%;background:#007AFF;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          })}
        />

        {(mode === "serviceStatus" || mode === "tripSetup") && (
          <Marker
            position={destLatLng}
            icon={L.divIcon({
              className: "",
              html: '<div style="width:10px;height:10px;border-radius:50%;background:#1c1c1e;border:2px solid #fff"></div>',
              iconSize: [10, 10],
              iconAnchor: [5, 5],
            })}
          />
        )}

        {showVehicleRoute && mapLayers.vehicleRoute?.features[0]?.geometry?.type === "LineString" ? (
          <VehicleMarker
            coords={
              mapLayers.vehicleRoute.features[0].geometry
                .coordinates as [number, number][]
            }
          />
        ) : null}
      </MapContainer>
    </div>
  );
}

function VehicleMarker({ coords }: { coords: [number, number][] }) {
  const mid = coords[Math.floor(coords.length / 2)] ?? coords[coords.length - 1];
  if (!mid) return null;
  const [lon, lat] = mid;
  return (
    <Marker
      position={[lat, lon]}
      icon={L.divIcon({
        className: "",
        html: `<div style="width:22px;height:14px;border-radius:4px;background:#00a8b5;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center"><span style="font-size:8px">🚗</span></div>`,
        iconSize: [22, 14],
        iconAnchor: [11, 7],
      })}
    />
  );
}
