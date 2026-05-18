"use client";

import { PrototypeLayout } from "../PrototypeLayout";
import { ValidBanner } from "../InfoBanner";
import {
  CarTealIcon,
  CarIcon,
  ClockIcon,
  RoadIcon,
  UmbrellaIcon,
  WalkIcon,
  TreeIcon,
} from "../icons/RainModeIcons";

type OnTheWayScreenProps = {
  onStartWalking: () => void;
  onChangePickup: () => void;
};

/** Figma screen 4 — Robotaxi on the way / pickup guidance */
export function OnTheWayScreen({ onStartWalking, onChangePickup }: OnTheWayScreenProps) {
  return (
    <PrototypeLayout
      mapVariant="walk"
      mapOverlay={
        <>
          <div className="map-pin-label" style={{ left: "52%", top: "46%" }}>
            <div className="pin-label-box">
              <div style={{ color: "#34a853", fontWeight: 700, fontSize: 7 }}>Sheltered</div>
              <div style={{ fontSize: 6, color: "#8e8e93" }}>60 m</div>
            </div>
          </div>
          <div className="vehicle-distance-pill" style={{ left: "42%", top: "28%" }}>
            1.2 km →
          </div>
        </>
      }
    >
      <div className="sheet-handle" />
      <div className="sheet-title-row">
        <CarTealIcon />
        <h2 className="sheet-title">Robotaxi is on the way</h2>
      </div>
      <div className="status-row">
        <div className="status-card">
          <div className="sc-icon">
            <CarIcon />
          </div>
          <p className="sc-text">1.2 km away</p>
        </div>
        <div className="status-card">
          <div className="sc-icon">
            <ClockIcon />
          </div>
          <p className="sc-text">Arriving in 7 min</p>
        </div>
        <div className="status-card">
          <div className="sc-icon">
            <RoadIcon />
          </div>
          <p className="sc-text">Approaching via Coastal Avenue</p>
        </div>
      </div>
      <p className="section-title">Pick-up guidance</p>
      <div className="detail-row">
        <WalkIcon />
        <span>Walk 60 m to Mall North Entrance</span>
      </div>
      <div className="detail-row">
        <ClockIcon />
        <span>About 2 min on foot</span>
      </div>
      <div className="detail-row">
        <UmbrellaIcon />
        <span>Rain exposure 15 m</span>
      </div>
      <div className="detail-row">
        <TreeIcon color="#34a853" />
        <span>Covered distance 45 m</span>
      </div>
      <ValidBanner>Valid pick-up point confirmed</ValidBanner>
      <button type="button" className="btn-primary" onClick={onStartWalking}>
        Start walking
      </button>
      <button type="button" className="btn-link" onClick={onChangePickup}>
        Change pick-up
      </button>
    </PrototypeLayout>
  );
}
