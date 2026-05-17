import {
  MAP_LAND_PATH,
  MAP_PARK_PATHS,
  MAP_ROADS,
  MAP_VIEWBOX,
  MAP_WATER_PATH,
} from "./mapGeometry";

/** Base map: land, water, parks, road surfaces + outlines */
export function EditableMapLayer() {
  return (
    <g className="map-base-layer">
      <rect className="map-canvas" width={MAP_VIEWBOX.width} height={MAP_VIEWBOX.height} />
      <path className="map-land" d={MAP_LAND_PATH} />
      <path className="map-water" d={MAP_WATER_PATH} />
      {MAP_PARK_PATHS.map((d, i) => (
        <path key={`park-${i}`} className="map-park" d={d} />
      ))}

      {MAP_ROADS.map((road) => (
        <g key={road.id} className="map-road-group">
          <path
            className="map-road-outline"
            d={road.d}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={road.width + 3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id={road.id}
            className="map-road-surface"
            d={road.d}
            fill="none"
            stroke="#ffffff"
            strokeWidth={road.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </g>
  );
}
