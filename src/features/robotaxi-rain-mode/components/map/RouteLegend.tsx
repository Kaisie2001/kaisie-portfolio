/** Editable route legend — text + vector swatches */
export function RouteLegend() {
  return (
    <g className="map-legend" transform="translate(12, 12)">
      <rect width={88} height={36} rx={6} fill="#0f172a" opacity={0.72} />
      <text className="map-legend-label" x={8} y={14} fill="#64748b" fontSize={7}>
        Covered
      </text>
      <line
        className="map-route-covered"
        x1={52}
        y1={10}
        x2={78}
        y2={10}
        stroke="#22d3ee"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <text className="map-legend-label" x={8} y={28} fill="#64748b" fontSize={7}>
        Exposed
      </text>
      <line
        className="map-route-exposed"
        x1={52}
        y1={24}
        x2={78}
        y2={24}
        stroke="#94a3b8"
        strokeWidth={2}
        strokeDasharray="3 2"
        strokeLinecap="round"
      />
    </g>
  );
}
