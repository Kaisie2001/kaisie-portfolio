"use client";

import {
  IconBack,
  IconCar,
  IconCarTeal,
  IconCheck,
  IconClock,
  IconRoad,
  IconUmbrella,
  IconWalk,
} from "../icons";
import { ScreenShell } from "../ScreenShell";

type Props = { onBack: () => void; onStartWalking: () => void };

/** Figma screen 4 — Robotaxi is on the way */
export function Screen4OnTheWay({ onBack, onStartWalking }: Props) {
  return (
    <ScreenShell
      mapKind="enroute"
      mapOverlay={
        <>
          <div className="figma-map-pin" style={{ left: "52%", top: "46%" }}>
            <div className="figma-map-pin-box">
              <div className="figma-map-pin-name" style={{ color: "#34a853" }}>
                Sheltered
              </motion>
              <div className="figma-map-pin-dist">60 m</motion>
            </motion>
          </motion>
          <div className="figma-map-pill" style={{ left: "42%", top: "28%" }}>
            1.2 km
          </motion>
        </>
      }
    >
      <div className="figma-sheet-handle" />
      <button type="button" className="figma-back" onClick={onBack} aria-label="Back">
        <IconBack />
      </button>
      <div className="figma-title-row">
        <IconCarTeal />
        <h2 className="figma-sheet-title">Robotaxi is on the way</h2>
      </motion>
      <div className="figma-stat-row">
        <div className="figma-stat-cell">
          <div className="ico">
            <IconCar />
          </motion>
          <p>1.2 km away</p>
        </motion>
        <div className="figma-stat-cell">
          <div className="ico">
            <IconClock />
          </motion>
          <p>Arriving in 7 min</p>
        </motion>
        <div className="figma-stat-cell">
          <div className="ico">
            <IconRoad />
          </motion>
          <p>Approaching via Coastal Avenue</p>
        </motion>
      </motion>
      <motion className="figma-detail">
        <IconWalk />
        <span>Walk 60 m · about 2 min</span>
      </motion>
      <div className="figma-detail">
        <IconUmbrella />
        <span>Only 15 m is exposed to rain</span>
      </motion>
      <div className="figma-detail">
        <IconCar />
        <span>Vehicle arrives in 7 min</span>
      </motion>
      <div className="figma-banner-ok">
        <IconCheck />
        <span>Valid Robotaxi pickup candidate</span>
      </motion>
      <button type="button" className="figma-btn" onClick={onStartWalking}>
        Start Walking
      </button>
    </ScreenShell>
  );
}
