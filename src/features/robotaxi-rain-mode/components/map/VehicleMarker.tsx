type VehicleMarkerProps = {
  x: number;
  y: number;
  distanceLabel?: string;
};

/** Editable vehicle icon on map (guidance screen) */
export function VehicleMarker({ x, y, distanceLabel = "1.2 km" }: VehicleMarkerProps) {
  return (
    <g className="map-vehicle" transform={`translate(${x}, ${y})`}>
      <path
        className="map-vehicle-body"
        d="M-14 0h28l3 6v6h-34v-6l3-6zm-10 8h8v4h-8v-4zm16 0h8v4h-8v-4z"
        fill="#1a1a1a"
        stroke="#424242"
        strokeWidth={0.5}
      />
      <circle cx={-8} cy={14} r={3} fill="#333" />
      <circle cx={8} cy={14} r={3} fill="#333" />
      {distanceLabel ? (
        <g className="map-vehicle-label" transform="translate(18, -8)">
          <rect x={0} y={0} width={44} height={18} rx={4} fill="#ffffff" stroke="#e0e0e0" />
          <text x={8} y={12} fill="#1976d2" fontSize={8} fontWeight={600}>
            {distanceLabel}
          </text>
          <text x={36} y={12} fill="#1976d2" fontSize={9}>
            →
          </text>
        </g>
      ) : null}
    </g>
  );
}
