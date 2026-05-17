"use client";

import type { PickupId } from "../types";
import { IconBack, IconPin } from "../icons";
import { ScreenShell } from "../ScreenShell";

const OPTIONS: {
  id: PickupId;
  tag: string;
  tagBg: string;
  walk: string;
  exposure: string;
  eta: string;
  note: string;
  noteGreen?: boolean;
  selectedClass: string;
}[] = [
  {
    id: "closest",
    tag: "Closest",
    tagBg: "#e53935",
    walk: "45 m",
    exposure: "40 m",
    eta: "6 min",
    note: "Shortest walk",
    selectedClass: "is-red",
  },
  {
    id: "sheltered",
    tag: "Sheltered",
    tagBg: "#34a853",
    walk: "60 m",
    exposure: "15 m",
    eta: "7 min",
    note: "Less rain exposure",
    noteGreen: true,
    selectedClass: "is-green",
  },
  {
    id: "soonest",
    tag: "Soonest",
    tagBg: "#f5a623",
    walk: "65 m",
    exposure: "30 m",
    eta: "4 min",
    note: "Fastest boarding",
    selectedClass: "is-orange",
  },
];

type Props = {
  selected: PickupId;
  onSelect: (id: PickupId) => void;
  onBack: () => void;
  onRequest: () => void;
};

/** Figma screen 3 — Choose your pickup */
export function Screen3ChoosePickup({ selected, onSelect, onBack, onRequest }: Props) {
  return (
    <ScreenShell
      mapKind="pickup"
      selectedPickup={selected}
      mapOverlay={<PickupMapLabels />}
    >
      <div className="figma-sheet-handle" />
      <button type="button" className="figma-back" onClick={onBack} aria-label="Back">
        <IconBack />
      </button>
      <h2 className="figma-sheet-title">Choose your pickup</h2>
      <p className="figma-sheet-sub">All options are valid Robotaxi pickup candidates</p>
      <div className="figma-options">
        {OPTIONS.map((o) => {
          const active = selected === o.id;
          return (
            <button
              key={o.id}
              type="button"
              className={`figma-option${active ? ` ${o.selectedClass}` : ""}`}
              onClick={() => onSelect(o.id)}
            >
              <span className="figma-option-tag" style={{ background: o.tagBg }}>
                {o.tag}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <IconPin color={o.tagBg} />
              </motion>
              <div className="figma-option-stats">
                <span>
                  <span className="lbl">Walk </span>
                  <span className="val">{o.walk}</span>
                </span>
                <span>
                  <span className="lbl">Exposure </span>
                  <span className="val">{o.exposure}</span>
                </span>
                <span>
                  <span className="lbl">ETA </span>
                  <span className={`val${o.id === "soonest" ? " hl" : ""}`}>{o.eta}</span>
                </span>
              </motion>
              <p className={`figma-option-note${o.noteGreen ? " green" : ""}`}>{o.note}</p>
            </button>
          );
        })}
      </motion>
      <button type="button" className="figma-btn" onClick={onRequest}>
        Request Robotaxi
      </button>
    </ScreenShell>
  );
}

function PickupMapLabels() {
  const pins = [
    { name: "Closest", color: "#e53935", dist: "45 m", left: "48%", top: "42%" },
    { name: "Sheltered", color: "#34a853", dist: "60 m", left: "56%", top: "46%" },
    { name: "Soonest", color: "#f5a623", dist: "65 m", left: "64%", top: "40%" },
  ];
  return (
    <>
      {pins.map((p) => (
        <div key={p.name} className="figma-map-pin" style={{ left: p.left, top: p.top }}>
          <div className="figma-map-pin-box">
            <div className="figma-map-pin-name" style={{ color: p.color }}>
              {p.name}
            </motion>
            <motion className="figma-map-pin-dist">{p.dist}</motion>
          </motion>
        </motion>
      ))}
    </>
  );
}
