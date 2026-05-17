type PickupPinProps = {
  x: number;
  y: number;
  selected: boolean;
  optionType: string;
  title: string;
  subtitle: string;
  onSelect?: () => void;
};

const PIN_THEME: Record<string, { fill: string; stroke: string }> = {
  closest: { fill: "#d32f2f", stroke: "#b71c1c" },
  sheltered: { fill: "#2e7d32", stroke: "#1b5e20" },
  soonest: { fill: "#f57c00", stroke: "#e65100" },
  default: { fill: "#757575", stroke: "#616161" },
};

/** Editable map pin + callout label (SVG text, not raster) */
export function PickupPin({
  x,
  y,
  selected,
  optionType,
  title,
  subtitle,
  onSelect,
}: PickupPinProps) {
  const theme = PIN_THEME[optionType] ?? PIN_THEME.default;
  const calloutW = Math.max(72, title.length * 4.5 + 24);

  return (
    <g
      className={`map-pin map-pin-${optionType} ${selected ? "map-pin-selected" : ""}`}
      transform={`translate(${x}, ${y})`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (onSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      style={{ cursor: onSelect ? "pointer" : undefined }}
    >
      <g className="map-pin-callout-group" transform="translate(0, -42)">
        <rect
          className="map-pin-callout"
          x={-calloutW / 2}
          y={-22}
          width={calloutW}
          height={selected ? 30 : 26}
          rx={6}
          strokeWidth={selected ? 1.5 : 1}
          stroke={selected ? theme.fill : "#e0e0e0"}
        />
        <text className="map-pin-callout-text" y={-8} textAnchor="middle" fontWeight={600}>
          {title}
        </text>
        <text className="map-pin-callout-text" y={4} textAnchor="middle" fill="#666" fontSize={7}>
          {subtitle}
        </text>
      </g>

      <ellipse className="map-pin-shadow" cx={0} cy={16} rx={7} ry={2} fill="#000" opacity={0.12} />
      <path
        className="map-pin-body"
        d="M0 -12 C7 -12 11 -5 11 2 C11 9 0 18 0 18 C0 18 -11 9 -11 2 C-11 -5 -7 -12 0 -12 Z"
        fill={theme.fill}
        stroke={theme.stroke}
        strokeWidth={1.25}
      />
      <circle className="map-pin-dot" cx={0} cy={1} r={3} fill="#ffffff" />
    </g>
  );
}

export function formatPinSubtitle(
  walkingDistanceM: number,
  walkMin?: number,
): string {
  const walk = walkMin ?? Math.max(1, Math.round(walkingDistanceM / 80));
  return `${walkingDistanceM} m · ${walk} min`;
}
