"use client";

import type { PickupZoneId } from "../../data/mapModes";
import { PrototypeLayout } from "../PrototypeLayout";
import { PinIcon } from "../icons/RainModeIcons";

const OPTIONS: {
  id: PickupZoneId;
  name: string;
  color: string;
  walk: string;
  eta: string;
  exposure: string;
  note: string;
  noteGreen?: boolean;
}[] = [
  {
    id: "closest",
    name: "Closest",
    color: "#e53935",
    walk: "45 m",
    eta: "6 min",
    exposure: "40 m",
    note: "Shortest walk",
  },
  {
    id: "sheltered",
    name: "Sheltered",
    color: "#34a853",
    walk: "60 m",
    eta: "7 min",
    exposure: "15 m",
    note: "Less rain exposure",
    noteGreen: true,
  },
  {
    id: "soonest",
    name: "Soonest",
    color: "#f5a623",
    walk: "65 m",
    eta: "4 min",
    exposure: "30 m",
    note: "Fastest boarding",
  },
];

type ChoosePickupScreenProps = {
  selected: PickupZoneId;
  onSelect: (id: PickupZoneId) => void;
  onConfirm: () => void;
};

/** Figma screen 3 — PUDO option comparison */
export function ChoosePickupScreen({ selected, onSelect, onConfirm }: ChoosePickupScreenProps) {
  return (
    <PrototypeLayout
      mapVariant="pickup-options"
      selectedZone={selected}
      mapOverlay={
        <>
          <MapLegend />
          <PinLabels />
        </>
      }
    >
      <div className="sheet-handle" />
      <h2 className="sheet-title">Choose your pick-up priority</h2>
      <p className="sheet-subtitle">All options are valid Robotaxi pick-up candidates</p>
      <div className="pickup-cards">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          const selectedClass =
            opt.id === "closest"
              ? "selected-red"
              : opt.id === "soonest"
                ? "selected-orange"
                : "selected-green";
          return (
            <button
              key={opt.id}
              type="button"
              className={`pickup-card${isSelected ? ` ${selectedClass}` : ""}`}
              onClick={() => onSelect(opt.id)}
            >
              {isSelected ? <span className="pickup-badge">SELECTED</span> : null}
              <div className="pickup-card-header">
                <PinIcon color={opt.color} />
                <span className="pickup-card-name" style={{ color: opt.color }}>
                  {opt.name}
                </span>
              </div>
              <div className="pickup-stats">
                <span>
                  <span className="stat-label">Walk </span>
                  <span className="stat-val">{opt.walk}</span>
                </span>
                <span>
                  <span className="stat-label">Exposure </span>
                  <span className="stat-val">{opt.exposure}</span>
                </span>
                <span>
                  <span className="stat-label">ETA </span>
                  <span
                    className={`stat-val${opt.id === "soonest" ? " highlight" : ""}`}
                  >
                    {opt.eta}
                  </span>
                </span>
              </div>
              <p className={`pickup-note${opt.noteGreen ? " green" : ""}`}>{opt.note}</p>
            </button>
          );
        })}
      </div>
      <button type="button" className="btn-primary" onClick={onConfirm}>
        Confirm pick-up
      </button>
    </PrototypeLayout>
  );
}

function MapLegend() {
  return (
    <div className="map-legend">
      <div className="legend-item">
        <span className="legend-line covered" />
        Covered
      </div>
      <div className="legend-item">
        <span className="legend-line exposed" />
        Exposed
      </div>
    </div>
  );
}

function PinLabels() {
  const pins = [
    { name: "Closest", color: "#e53935", dist: "45 m", left: "48%", top: "43%" },
    { name: "Sheltered", color: "#34a853", dist: "60 m", left: "56%", top: "47%" },
    { name: "Soonest", color: "#f5a623", dist: "65 m", left: "64%", top: "41%" },
  ];
  return (
    <>
      {pins.map((p) => (
        <div
          key={p.name}
          className="map-pin-label"
          style={{ left: p.left, top: p.top }}
        >
          <div className="pin-label-box">
            <div className="pin-name" style={{ color: p.color, fontWeight: 700 }}>
              {p.name}
            </div>
            <div className="pin-dist" style={{ fontSize: 6, color: "#8e8e93" }}>
              {p.dist}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
