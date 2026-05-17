import type { MapKind } from "./types";

type MapViewProps = {
  kind: MapKind;
  dimmed?: boolean;
  selectedPickup?: "closest" | "sheltered" | "soonest";
};

/** Static map placeholder — no Leaflet / GeoJSON */
export function MapView({ kind, dimmed, selectedPickup = "sheltered" }: MapViewProps) {
  return (
    <motion className={`figma-map${dimmed ? " dim" : ""}`}>
      <svg width="100%" height="100%" viewBox="0 0 240 340" preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="340" fill="#eef1f4" />
        <path d="M0 0 L240 0 L240 90 Q180 110 120 95 Q60 80 0 100 Z" fill="#c5e3f6" />
        <path
          d="M0 100 Q60 120 120 105 Q180 90 240 110 L240 0 L0 0"
          fill="#d4eaf8"
          opacity="0.5"
        />
        <ellipse cx="200" cy="250" rx="35" ry="25" fill="#d4edda" opacity="0.7" />
        <ellipse cx="50" cy="180" rx="25" ry="18" fill="#d4edda" opacity="0.6" />
        <rect x="20" y="130" width="50" height="40" rx="3" fill="#f5f0e1" opacity="0.8" />
        <rect x="80" y="150" width="45" height="35" rx="3" fill="#f0ebe3" opacity="0.8" />
        <rect x="140" y="120" width="55" height="45" rx="3" fill="#f5f0e1" opacity="0.8" />
        <path d="M0 160 L240 160" stroke="#fff" strokeWidth="6" fill="none" />
        <path d="M120 0 L120 340" stroke="#fff" strokeWidth="5" fill="none" />
        <path d="M0 220 Q120 200 240 230" stroke="#fff" strokeWidth="4" fill="none" />
        <Overlay kind={kind} selected={selectedPickup} />
      </svg>
      {kind === "service" ? <div className="figma-map-zone" /> : null}
    </motion>
  );
}

function Overlay({
  kind,
  selected,
}: {
  kind: MapKind;
  selected: "closest" | "sheltered" | "soonest";
}) {
  if (kind === "service") {
    return (
      <g>
        <circle cx={120} cy={220} r={8} fill="#007AFF" stroke="#fff" strokeWidth={2} />
        <circle cx={120} cy={220} r={14} fill="#007AFF" opacity={0.2} />
      </g>
    );
  }

  if (kind === "pickup") {
    const color =
      selected === "closest" ? "#e53935" : selected === "soonest" ? "#f5a623" : "#34a853";
    const dx = selected === "closest" ? 155 : selected === "soonest" ? 195 : 175;
    const dy = selected === "closest" ? 175 : selected === "soonest" ? 170 : 185;
    return (
      <g>
        <circle cx={70} cy={250} r={7} fill="#007AFF" stroke="#fff" strokeWidth={2} />
        <circle cx={155} cy={175} r={6} fill="#e53935" stroke="#fff" strokeWidth={1.5} />
        <circle cx={175} cy={185} r={6} fill="#34a853" stroke="#fff" strokeWidth={1.5} />
        <circle cx={195} cy={170} r={6} fill="#f5a623" stroke="#fff" strokeWidth={1.5} />
        <path
          d={`M70 250 Q110 220 ${dx} ${dy}`}
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (kind === "enroute") {
    return (
      <g>
        <circle cx={75} cy={265} r={7} fill="#007AFF" stroke="#fff" strokeWidth={2} />
        <path
          d="M75 265 Q120 230 165 200"
          stroke="#34a853"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={165} cy={200} r={6} fill="#34a853" stroke="#fff" strokeWidth={1.5} />
        <path
          d="M30 120 Q80 100 130 90 Q180 85 220 95"
          stroke="#00a8b5"
          strokeWidth={2}
          fill="none"
          strokeDasharray="5 4"
          opacity={0.75}
        />
        <rect x={125} y={82} width={16} height={10} rx={2} fill="#00a8b5" />
      </g>
    );
  }

  return (
    <g>
      <circle cx={120} cy={220} r={8} fill="#007AFF" stroke="#fff" strokeWidth={2} />
      <circle cx={120} cy={220} r={14} fill="#007AFF" opacity={0.2} />
    </g>
  );
}
