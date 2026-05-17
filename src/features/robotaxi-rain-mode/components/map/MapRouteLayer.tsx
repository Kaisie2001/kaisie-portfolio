type MapRouteLayerProps = {
  user: { x: number; y: number };
  pin: { x: number; y: number };
  coveredRatio: number;
  inactiveRoutes?: { user: { x: number; y: number }; pin: { x: number; y: number } }[];
};

function segments(
  user: { x: number; y: number },
  pin: { x: number; y: number },
  coveredRatio: number,
) {
  const splitX = user.x + (pin.x - user.x) * coveredRatio;
  const splitY = user.y + (pin.y - user.y) * coveredRatio;
  const cx = user.x + (pin.x - user.x) * coveredRatio * 0.5;
  const cy = user.y + (pin.y - user.y) * coveredRatio * 0.5;
  return {
    covered: `M ${user.x} ${user.y} Q ${cx} ${cy} ${splitX} ${splitY}`,
    exposed: `M ${splitX} ${splitY} L ${pin.x} ${pin.y}`,
  };
}

export function MapRouteLayer({
  user,
  pin,
  coveredRatio,
  inactiveRoutes = [],
}: MapRouteLayerProps) {
  const active = segments(user, pin, coveredRatio);

  return (
    <g className="map-route-layer">
      {inactiveRoutes.map((r, i) => (
        <path
          key={`inactive-${i}`}
          className="map-route-inactive"
          d={`M ${r.user.x} ${r.user.y} L ${r.pin.x} ${r.pin.y}`}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
      <path
        className="map-route-covered map-route-selected"
        d={active.covered}
        fill="none"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        className="map-route-exposed"
        d={active.exposed}
        fill="none"
        strokeWidth={3}
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
    </g>
  );
}
