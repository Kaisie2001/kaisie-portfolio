"use client";

import type { MapPlaceholderVariant, PickupZoneId } from "../data/mapModes";

type MapPlaceholderProps = {
  variant: MapPlaceholderVariant;
  dimmed?: boolean;
  selectedZone?: PickupZoneId;
};

/** Figma map area — SVG placeholder only (no Leaflet / GeoJSON). */
export function MapPlaceholder({
  variant,
  dimmed = false,
  selectedZone = "sheltered",
}: MapPlaceholderProps) {
  return (
    <div className={`map-layer${dimmed ? " dimmed" : ""}`} aria-hidden>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 340"
        preserveAspectRatio="xMidYMid slice"
      >
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
        <rect x="100" y="220" width="60" height="40" rx="3" fill="#f0ebe3" opacity="0.7" />
        <rect x="30" y="240" width="40" height="35" rx="3" fill="#f5f0e1" opacity="0.7" />
        <path d="M0 160 L240 160" stroke="#fff" strokeWidth="6" fill="none" />
        <path d="M120 0 L120 340" stroke="#fff" strokeWidth="5" fill="none" />
        <path d="M0 220 Q120 200 240 230" stroke="#fff" strokeWidth="4" fill="none" />
        <path d="M40 0 Q80 120 60 240" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
        <path d="M180 0 Q160 150 200 280" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
        <text x="95" y="168" fontSize="7" fill="#8e8e93" opacity="0.6">
          Coastal Avenue
        </text>
        <MapOverlay variant={variant} selectedZone={selectedZone} />
      </svg>
    </div>
  );
}

function MapOverlay({
  variant,
  selectedZone,
}: {
  variant: MapPlaceholderVariant;
  selectedZone: PickupZoneId;
}) {
  if (variant === "route") {
    return (
      <g>
        <path
          d="M60 280 Q120 200 180 160"
          stroke="#00a8b5"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={60} cy={280} r={8} fill="#007AFF" stroke="white" strokeWidth={2} />
        <circle cx={60} cy={280} r={14} fill="#007AFF" opacity={0.2} />
        <circle cx={180} cy={160} r={6} fill="#1c1c1e" stroke="white" strokeWidth={2} />
      </g>
    );
  }

  if (variant === "pickup-options") {
    const routeColor =
      selectedZone === "sheltered"
        ? "#34a853"
        : selectedZone === "closest"
          ? "#e53935"
          : "#f5a623";
    const dest =
      selectedZone === "closest"
        ? { x: 155, y: 175 }
        : selectedZone === "sheltered"
          ? { x: 175, y: 185 }
          : { x: 195, y: 170 };

    return (
      <g>
        <circle cx={70} cy={250} r={7} fill="#007AFF" stroke="white" strokeWidth={2} />
        <circle cx={70} cy={250} r={12} fill="#007AFF" opacity={0.2} />
        <circle cx={155} cy={175} r={6} fill="#e53935" stroke="white" strokeWidth={1.5} />
        <circle cx={175} cy={185} r={6} fill="#34a853" stroke="white" strokeWidth={1.5} />
        <circle cx={195} cy={170} r={6} fill="#f5a623" stroke="white" strokeWidth={1.5} />
        <path
          d={`M70 250 Q110 220 ${dest.x} ${dest.y}`}
          stroke={routeColor}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (variant === "walk") {
    return (
      <g>
        <circle cx={75} cy={265} r={7} fill="#007AFF" stroke="white" strokeWidth={2} />
        <circle cx={75} cy={265} r={12} fill="#007AFF" opacity={0.2} />
        <path
          d="M75 265 Q120 230 165 200"
          stroke="#34a853"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={165} cy={200} r={6} fill="#34a853" stroke="white" strokeWidth={1.5} />
        <path
          d="M30 120 Q80 100 130 90 Q180 85 220 95"
          stroke="#00a8b5"
          strokeWidth={2}
          fill="none"
          strokeDasharray="5 4"
          opacity={0.7}
        />
        <rect x={125} y={82} width={16} height={10} rx={2} fill="#00a8b5" />
      </g>
    );
  }

  return (
    <g>
      <circle cx={120} cy={220} r={8} fill="#007AFF" stroke="white" strokeWidth={2} />
      <circle cx={120} cy={220} r={14} fill="#007AFF" opacity={0.2} />
    </g>
  );
}
