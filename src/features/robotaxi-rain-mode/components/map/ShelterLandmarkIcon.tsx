type ShelterLandmarkIconProps = {
  x: number;
  y: number;
  label?: string;
};

/** Editable shelter / landmark marker on map */
export function ShelterLandmarkIcon({ x, y, label }: ShelterLandmarkIconProps) {
  return (
    <g className="map-landmark" transform={`translate(${x}, ${y})`}>
      <rect
        className="map-landmark-plate"
        x={-36}
        y={-28}
        width={72}
        height={32}
        rx={6}
        fill="#1e3a5f"
        opacity={0.55}
      />
      <path
        className="map-landmark-roof"
        d="M-14 -8 L0 -18 L14 -8 L10 4 L-10 4 Z"
        fill="none"
        stroke="#38bdf8"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle className="map-landmark-dot" cx={0} cy={-6} r={2.5} fill="#38bdf8" />
      {label ? (
        <text
          className="map-landmark-label"
          x={0}
          y={-32}
          textAnchor="middle"
          fill="#64748b"
          fontSize={8}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}
