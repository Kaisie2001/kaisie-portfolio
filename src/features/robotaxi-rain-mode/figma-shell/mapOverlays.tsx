"use client";

import { PICKUP_OPTIONS } from "./pickup-data";
import type { PickupId } from "./types";

export function MapDotHits({ onSelect }: { onSelect: (id: PickupId) => void }) {
  return (
    <>
      {PICKUP_OPTIONS.map((p) => (
        <button
          key={p.id}
          type="button"
          className="figma-map-dot-hit"
          style={{ left: p.mapLeft, top: p.mapTop }}
          aria-label={`Select ${p.name} pick-up`}
          onClick={() => onSelect(p.id)}
        />
      ))}
    </>
  );
}

export function MapLegend() {
  return (
    <div className="figma-map-legend">
      <div className="figma-legend-item">
        <span className="figma-legend-line covered" />
        Covered
      </div>
      <div className="figma-legend-item">
        <span className="figma-legend-line exposed" />
        Exposed
      </div>
    </div>
  );
}

export function MapPinLabel({ activeId }: { activeId: PickupId }) {
  const pin = PICKUP_OPTIONS.find((p) => p.id === activeId);
  if (!pin) return null;
  return (
    <div className="figma-map-pin" style={{ left: pin.mapLeft, top: pin.mapTop }}>
      <div className="figma-map-pin-box">
        <div className="figma-map-pin-name" style={{ color: pin.color }}>
          {pin.name}
        </div>
        <div className="figma-map-pin-dist">{pin.walk}</div>
      </div>
      <span className="figma-map-pin-tail" aria-hidden />
    </div>
  );
}

export function Screen4MapOverlay({ pickup }: { pickup: PickupId }) {
  const pin = PICKUP_OPTIONS.find((p) => p.id === pickup) ?? PICKUP_OPTIONS[1];
  return (
    <>
      <div
        className="figma-map-pin figma-map-pin--md-dot"
        style={{ left: pin.mapLeft, top: pin.mapTop }}
      >
        <div className="figma-map-pin-box">
          <div className="figma-map-pin-name" style={{ color: pin.color }}>
            {pin.name}
          </div>
          <div className="figma-map-pin-dist">{pin.walk}</div>
        </div>
        <span className="figma-map-pin-tail" aria-hidden />
      </div>
      <div className="figma-map-pill" style={{ left: "42%", top: "28%" }}>
        1.2 km →
      </div>
    </>
  );
}
