"use client";

import type { Feature, LineString } from "geojson";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DEMO_DESTINATION } from "../data/demoData";
import {
  boundsFromManifest,
  DEMO_USER_LOCATION,
  listLoadedLayers,
  loadMapData,
  PUDO_ID_BY_ZONE,
  type MapGeoLayers,
} from "../data/loadMapData";
import type { MapMode, PickupZoneId } from "../data/mapModes";
import "./robotaxi-map.css";

export type RobotaxiMapProps = {
  mode: MapMode;
  selectedZoneId?: PickupZoneId;
  showPickupZones?: boolean;
  showWalkingRoutes?: boolean;
  showVehicleRoute?: boolean;
  /** Pre-loaded layers; if omitted, fetched from /data/robotaxi-map/ */
  mapLayers?: MapGeoLayers;
  /** Show dev overlay listing missing files */
  showLoadStatus?: boolean;
};

const ZONE_COLOR: Record<string, string> = {
  closest: "#e53935",
  sheltered: "#34a853",
  soonest: "#f5a623",
};

const COMPARISON_ZONES = new Set<PickupZoneId>(["closest", "sheltered", "soonest"]);

function hasRenderableLayers(layers: MapGeoLayers | null | undefined): boolean {
  return Boolean(layers && (layers.roads || layers.water || layers.buildings));
}

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [16, 16], maxZoom: 17 });
    const id = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(id);
  }, [map, bounds]);
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

export function RobotaxiMap({
  mode,
  selectedZoneId = "sheltered",
  showPickupZones = false,
  showWalkingRoutes = false,
  showVehicleRoute = false,
  mapLayers: mapLayersProp,
  showLoadStatus = false,
}: RobotaxiMapProps) {
  const preloaded = hasRenderableLayers(mapLayersProp);
  const [layers, setLayers] = useState<MapGeoLayers | null>(
    preloaded ? (mapLayersProp ?? null) : null,
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!preloaded);

  useEffect(() => {
    if (hasRenderableLayers(mapLayersProp)) {
      setLayers(mapLayersProp);
      setLoading(false);
      setLoadError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadMapData()
      .then((data) => {
        if (!cancelled) {
          setLayers(data);
          setLoadError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Failed to load map data");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mapLayersProp]);

  const bounds = useMemo(
    () => boundsFromManifest(layers?.manifest ?? null),
    [layers?.manifest],
  );

  const [userLon, userLat] = DEMO_USER_LOCATION;
  const userLatLng: [number, number] = [userLat, userLon];
  const [destLon, destLat] = DEMO_DESTINATION.geometry.coordinates;
  const destLatLng: [number, number] = [destLat, destLon];

  const walkingFeatures = useMemo(() => {
    if (!showWalkingRoutes || !layers?.walkingRoutes) return [];
    const pudoId = PUDO_ID_BY_ZONE[selectedZoneId];
    return layers.walkingRoutes.features.filter(
      (f) => String(f.properties?.pudo_id ?? "") === pudoId,
    );
  }, [showWalkingRoutes, layers?.walkingRoutes, selectedZoneId]);

  if (loading) {
    return (
      <div className="robotaxi-map-fallback" role="status">
        Loading map…
      </div>
    );
  }

  if (loadError || !layers) {
    return (
      <div className="robotaxi-map-fallback" role="alert">
        {loadError ?? "Map data unavailable"}
      </div>
    );
  }

  const hasBase = Boolean(layers.roads || layers.water || layers.buildings);
  if (!hasBase) {
    return (
      <div className="robotaxi-map-fallback" role="alert">
        Base map layers missing. Check public/data/robotaxi-map/.
        {layers.missing.length > 0 ? (
          <span className="mt-1 block text-[10px]">Missing: {layers.missing.join(", ")}</span>
        ) : null}
      </div>
    );
  }

  const loaded = listLoadedLayers(layers);

  return (
    <div className="robotaxi-leaflet-map">
      {showLoadStatus ? (
        <div className="robotaxi-map-status" aria-live="polite">
          {loaded.length} layer(s)
          {layers.missing.length > 0 ? ` · missing: ${layers.missing.join(", ")}` : ""}
        </div>
      ) : null}

      <MapContainer
        center={userLatLng}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        dragging
        touchZoom
        doubleClickZoom
        zoomControl={false}
        attributionControl={false}
      >
        <FitBounds bounds={bounds} />
        <ResizeOnMount />

        {layers.water ? (
          <GeoJSON
            key="water"
            data={layers.water}
            style={() => ({
              fillColor: "#c5e3f6",
              fillOpacity: 0.85,
              color: "#a8d4f0",
              weight: 0.5,
            })}
          />
        ) : null}

        {layers.parks ? (
          <GeoJSON
            key="parks"
            data={layers.parks}
            style={() => ({
              fillColor: "#d4edda",
              fillOpacity: 0.7,
              color: "#b8dfc4",
              weight: 0.5,
            })}
          />
        ) : null}

        {layers.buildings ? (
          <GeoJSON
            key="buildings"
            data={layers.buildings}
            style={() => ({
              fillColor: "#dde2e8",
              fillOpacity: 0.9,
              color: "#cfd5dc",
              weight: 0.3,
            })}
          />
        ) : null}

        {layers.roads ? (
          <GeoJSON
            key="roads"
            data={layers.roads}
            style={() => ({ color: "#ffffff", weight: 2.5, opacity: 1, lineCap: "round" })}
          />
        ) : null}

        {layers.pois ? (
          <GeoJSON
            key="pois"
            data={layers.pois}
            pointToLayer={(_f, latlng) =>
              L.circleMarker(latlng, {
                radius: 3,
                fillColor: "#8e8e93",
                fillOpacity: 0.45,
                color: "#fff",
                weight: 1,
              })
            }
          />
        ) : null}

        {showPickupZones && layers.pudoZones
          ? layers.pudoZones.features
              .filter((f) => {
                const t = String(f.properties?.option_type ?? "") as PickupZoneId;
                if (mode === "robotaxiOnTheWay" || mode === "confirmPickup") {
                  return t === selectedZoneId;
                }
                return COMPARISON_ZONES.has(t);
              })
              .map((feature, i) => (
                <GeoJSON
                  key={`pudo-zone-${i}`}
                  data={feature as Feature<LineString>}
                  style={() => {
                    const t = String(feature.properties?.option_type ?? "");
                    const isSelected = t === selectedZoneId;
                    return {
                      color: ZONE_COLOR[t] ?? "#666",
                      weight: isSelected ? 7 : 4,
                      opacity: isSelected ? 1 : 0.7,
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
              key={`walk-${feature.properties?.route_id}-${segment}-${i}`}
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

        {showVehicleRoute && layers.vehicleRoute ? (
          <GeoJSON
            key="vehicle"
            data={layers.vehicleRoute}
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

        {(mode === "tripSetup" ||
          mode === "destinationConfirm" ||
          mode === "serviceStatus") && (
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

        {showVehicleRoute &&
        layers.vehicleRoute?.features[0]?.geometry?.type === "LineString" ? (
          <VehicleMarker
            coords={
              (layers.vehicleRoute.features[0].geometry as LineString).coordinates as [
                number,
                number,
              ][]
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
        html: '<div style="width:22px;height:14px;border-radius:4px;background:#00a8b5;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center"><span style="font-size:8px">🚗</span></div>',
        iconSize: [22, 14],
        iconAnchor: [11, 7],
      })}
    />
  );
}
