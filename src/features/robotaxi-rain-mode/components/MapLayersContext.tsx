"use client";

import { createContext, useContext } from "react";
import type { MapGeoLayers } from "../data/loadMapData";

const MapLayersContext = createContext<MapGeoLayers | null>(null);

export function MapLayersProvider({
  layers,
  children,
}: {
  layers: MapGeoLayers | null;
  children: React.ReactNode;
}) {
  return <MapLayersContext.Provider value={layers}>{children}</MapLayersContext.Provider>;
}

export function useMapLayers(): MapGeoLayers | null {
  return useContext(MapLayersContext);
}
