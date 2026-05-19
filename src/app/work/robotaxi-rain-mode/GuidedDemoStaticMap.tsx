import type { CSSProperties } from "react";
import type { Lang } from "@/lib/portfolioCopy";
import type { GuidedDemoStepId } from "./guidedDemoCopy";
import type { CompareOptionId, LonLat } from "./guidedDemoFrozenScenario";
import {
  COMPARE_OPTION_ORDER,
  GUIDED_DEMO_FROZEN_SCENARIO,
  getSelectedFrozenOption,
} from "./guidedDemoFrozenScenario";

type Props = {
  stepId: GuidedDemoStepId;
  lang: Lang;
  dimmed?: boolean;
  highlightPickupId?: CompareOptionId;
};

const MAP_W = 260;
const MAP_H = 515;
const TILE_SIZE = 256;

function projectWebMercator([lon, lat]: LonLat, zoom: number) {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const scale = TILE_SIZE * 2 ** zoom;

  return {
    x: ((lon + 180) / 360) * scale,
    y:
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
      scale,
  };
}

function projectToScreen(point: LonLat) {
  const { zoom, center } = GUIDED_DEMO_FROZEN_SCENARIO.viewport;
  const projected = projectWebMercator(point, zoom);
  const projectedCenter = projectWebMercator(center, zoom);

  return {
    x: MAP_W / 2 + projected.x - projectedCenter.x,
    y: MAP_H / 2 + projected.y - projectedCenter.y,
  };
}

function pathPoints(points: readonly LonLat[]) {
  return points
    .map((point) => {
      const projected = projectToScreen(point);
      return `${projected.x.toFixed(1)},${projected.y.toFixed(1)}`;
    })
    .join(" ");
}

function markerStyle(point: LonLat): CSSProperties {
  const projected = projectToScreen(point);
  return {
    left: projected.x,
    top: projected.y,
  };
}

function tileGrid() {
  const { zoom, center } = GUIDED_DEMO_FROZEN_SCENARIO.viewport;
  const centerPx = projectWebMercator(center, zoom);
  const centerTileX = Math.floor(centerPx.x / TILE_SIZE);
  const centerTileY = Math.floor(centerPx.y / TILE_SIZE);
  const tiles = [];

  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -2; dy <= 2; dy += 1) {
      const x = centerTileX + dx;
      const y = centerTileY + dy;
      tiles.push({
        key: `${x}-${y}`,
        src: `https://a.basemaps.cartocdn.com/light_all/${zoom}/${x}/${y}.png`,
        left: x * TILE_SIZE - centerPx.x + MAP_W / 2,
        top: y * TILE_SIZE - centerPx.y + MAP_H / 2,
      });
    }
  }

  return tiles;
}

function optionColor(id: CompareOptionId) {
  return GUIDED_DEMO_FROZEN_SCENARIO.options[id].color;
}

/** Read-only tile/SVG renderer for one frozen real scenario. */
export function GuidedDemoStaticMap({
  stepId,
  lang,
  dimmed,
  highlightPickupId,
}: Props) {
  const scenario = GUIDED_DEMO_FROZEN_SCENARIO;
  const selected = getSelectedFrozenOption();
  const activeId =
    highlightPickupId ?? (stepId >= 3 ? scenario.selectedOptionId : undefined);
  const activeOption = activeId ? scenario.options[activeId] : null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-100" aria-hidden>
      <div className="absolute inset-0 overflow-hidden">
        {tileGrid().map((tile) => (
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            draggable={false}
            className="pointer-events-none absolute max-w-none select-none"
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              left: tile.left,
              top: tile.top,
            }}
          />
        ))}
      </div>
      {dimmed ? <div className="absolute inset-0 z-[2] bg-white/25" /> : null}
      <div className="absolute left-3 top-[88px] z-[8] max-w-[160px] rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-semibold text-stone-800 shadow-sm">
        <span className="block truncate">{scenario.area.title[lang]}</span>
      </div>

      <div
        className="absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.22)]"
        style={markerStyle(scenario.pickupAnchor.coordinate)}
      />

      <svg
        className="absolute inset-0 z-[6] h-full w-full"
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {stepId === 1 ? (
          <polyline
            points={pathPoints(scenario.tripOverviewRoute)}
            fill="none"
            stroke="#1677ff"
            strokeWidth={3.2}
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {stepId === 2 && activeOption ? (
          <polyline
            points={pathPoints(activeOption.walkingRoute)}
            fill="none"
            stroke="#00a8b5"
            strokeWidth={3}
            strokeDasharray="3.5 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {stepId === 3 ? (
          <polyline
            points={pathPoints(scenario.vehicleRouteToSelected)}
            fill="none"
            stroke="#f5a623"
            strokeWidth={3}
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {stepId === 4 ? (
          <>
            <polyline
              points={pathPoints(selected.walkingRoute)}
              fill="none"
              stroke="#00a8b5"
              strokeWidth={3}
              strokeDasharray="3.5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={pathPoints(scenario.vehicleRouteToSelected)}
              fill="none"
              stroke="#1677ff"
              strokeWidth={3.2}
              strokeDasharray="6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : null}
        {COMPARE_OPTION_ORDER.map((id) => {
          const option = scenario.options[id];
          return (
            <line
              key={id}
              x1={projectToScreen(option.zone[0]).x}
              y1={projectToScreen(option.zone[0]).y}
              x2={projectToScreen(option.zone[1]).x}
              y2={projectToScreen(option.zone[1]).y}
              stroke={option.color}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={id === activeId ? 0.66 : 0.25}
            />
          );
        })}
      </svg>

      {stepId === 2
        ? COMPARE_OPTION_ORDER.map((id) => {
            const option = scenario.options[id];
            const active = id === activeId;
            return (
              <div
                key={id}
                className="absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                style={{
                  ...markerStyle(option.marker),
                  background: optionColor(id),
                  transform: active
                    ? "translate(-50%, -50%) scale(1.65)"
                    : "translate(-50%, -50%)",
                  boxShadow: active
                    ? "0 0 0 2px rgba(255,255,255,.98), 0 0 0 7px rgba(0,168,181,.14), 0 8px 18px rgba(28,25,23,.18)"
                    : undefined,
                }}
              />
            );
          })
        : stepId >= 3 && activeOption ? (
          <div
            className="absolute z-10 h-2.5 w-2.5 rounded-full border-2 border-white"
            style={{
              ...markerStyle(activeOption.marker),
              background: activeOption.color,
              transform: "translate(-50%, -50%) scale(1.65)",
              boxShadow:
                "0 0 0 2px rgba(255,255,255,.98), 0 0 0 7px rgba(0,168,181,.14), 0 8px 18px rgba(28,25,23,.18)",
            }}
          />
        ) : null}

      {stepId === 1 ? (
        <div
          className="absolute z-10 h-3.5 w-3.5 rounded-full rounded-bl-none border-2 border-white bg-blue-600 shadow-sm"
          style={{
            ...markerStyle(scenario.dropoff.coordinate),
            transform: "translate(-50%, -50%) rotate(-45deg)",
          }}
        />
      ) : null}
    </div>
  );
}
