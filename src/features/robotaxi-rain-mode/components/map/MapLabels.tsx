import { MAP_LABELS } from "./mapGeometry";

/** Editable map text labels — real SVG text elements */
export function MapLabels() {
  return (
    <g className="map-labels-layer">
      {MAP_LABELS.map((label) => (
        <text
          key={label.id}
          id={label.id}
          className={`map-label ${label.className ?? ""}`}
          x={label.x}
          y={label.y}
          textAnchor="middle"
        >
          {label.text}
        </text>
      ))}
      <g className="map-metro-icon" transform="translate(168, 52)">
        <circle cx={10} cy={10} r={9} fill="#1976d2" />
        <text x={10} y={14} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>
          M
        </text>
      </g>
    </g>
  );
}
