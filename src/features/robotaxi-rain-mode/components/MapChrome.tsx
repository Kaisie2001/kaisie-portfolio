import type { ReactNode } from "react";

type MapChromeProps = {
  showRainPill?: boolean;
  actions?: ReactNode;
};

export function MapChrome({ showRainPill = false, actions }: MapChromeProps) {
  if (!showRainPill && !actions) return null;

  return (
    <div className="map-chrome">
      {showRainPill ? (
        <div className="rain-mode-pill">
          <svg width={12} height={12} viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M6 18h12a4 4 0 000-8 5 5 0 00-9.5-1.5A3.5 3.5 0 006 18z" />
          </svg>
          Rain Mode · Moderate rain
        </div>
      ) : (
        <span />
      )}
      {actions ? <div className="map-chrome-actions">{actions}</div> : null}
    </div>
  );
}

export function MapTopActions() {
  return (
    <>
      <button type="button" className="map-circle-btn" aria-label="Profile">
        <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
          <circle cx={12} cy={8} r={4} fill="#8e8e93" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#8e8e93" />
        </svg>
      </button>
      <button type="button" className="map-circle-btn" aria-label="More">
        <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
          <circle cx={6} cy={12} r={1.5} fill="#8e8e93" />
          <circle cx={12} cy={12} r={1.5} fill="#8e8e93" />
          <circle cx={18} cy={12} r={1.5} fill="#8e8e93" />
        </svg>
      </button>
    </>
  );
}
