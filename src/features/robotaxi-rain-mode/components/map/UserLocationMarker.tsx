type UserLocationMarkerProps = { x: number; y: number };

export function UserLocationMarker({ x, y }: UserLocationMarkerProps) {
  return (
    <g className="map-user-location" transform={`translate(${x}, ${y})`}>
      <circle
        className="map-user-location-pulse"
        r={20}
        fill="#1976d2"
        opacity={0.15}
      />
      <circle
        className="map-user-location-pulse"
        r={14}
        fill="#1976d2"
        opacity={0.2}
      />
      <circle
        className="map-user-location-ring"
        r={8}
        fill="#1976d2"
        stroke="#ffffff"
        strokeWidth={2.5}
      />
      <circle className="map-user-location-core" r={3} fill="#ffffff" />
    </g>
  );
}
