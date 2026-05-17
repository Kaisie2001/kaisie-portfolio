import type { PudoCandidate } from "../data/types";

const ZONE_COLOR: Record<string, string> = {
  closest: "#e53935",
  sheltered: "#34a853",
  soonest: "#f5a623",
};

/** Figma map pin callouts — fixed positions matching 00robotaxi layout. */
export function MapPinLabels({ candidates }: { candidates: PudoCandidate[] }) {
  const positions: Record<string, { left: string; top: string }> = {
    closest: { left: "45%", top: "42%" },
    sheltered: { left: "53%", top: "46%" },
    soonest: { left: "61%", top: "40%" },
  };

  return (
    <>
      {candidates.map((c) => {
        const pos = positions[c.option_type];
        if (!pos) return null;
        const color = ZONE_COLOR[c.option_type] ?? "#666";
        return (
          <div
            key={c.pudo_id}
            className="map-pin-label"
            style={{ left: pos.left, top: pos.top, transform: "translate(-50%, -50%)" }}
          >
            <div className="pin-label-box">
              <div className="pin-name" style={{ color }}>
                {c.label_en}
              </div>
              <div className="pin-dist">{c.walking_distance_m} m</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function SelectedPickupPinLabel({
  candidate,
  subtitle,
}: {
  candidate: PudoCandidate;
  subtitle?: string;
}) {
  const color = ZONE_COLOR[candidate.option_type] ?? "#34a853";
  return (
    <div
      className="map-pin-label"
      style={{ left: "50%", top: "46%", transform: "translate(-50%, -50%)" }}
    >
      <div className="pin-label-box">
        <div className="pin-name" style={{ color }}>
          {candidate.label_en}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 6, color: "#8e8e93" }}>{subtitle}</div>
        ) : (
          <div className="pin-dist">{candidate.walking_distance_m} m</div>
        )}
      </div>
    </div>
  );
}

export function VehicleDistancePill() {
  return (
    <div className="vehicle-distance-pill" style={{ left: "42%", top: "28%" }}>
      1.2 km →
    </div>
  );
}
