import type { ReactNode } from "react";
import "./figma-tokens.css";

/** Prototype viewport only — no physical phone bezel */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="figma-rain-root">
      <div className="figma-screen">
        <header className="figma-status" aria-hidden>
          <div className="figma-island" />
          <div className="figma-status-row">
            <span className="figma-status-time">1:47</span>
            <div className="figma-status-icons">
              <StatusCellular />
              <StatusWifi />
              <StatusBattery />
            </div>
          </div>
        </header>
        <div className="figma-app">{children}</div>
        <div className="figma-home-bar" aria-hidden />
      </div>
    </div>
  );
}

function StatusCellular() {
  return (
    <svg viewBox="0 0 18 12" aria-hidden className="figma-status-icon figma-status-icon--cell">
      <rect x={0} y={6.5} width={3} height={5.5} rx={0.6} fill="currentColor" />
      <rect x={4.5} y={4.5} width={3} height={7.5} rx={0.6} fill="currentColor" />
      <rect x={9} y={2} width={3} height={10} rx={0.6} fill="currentColor" />
      <rect x={13.5} y={0} width={3} height={12} rx={0.6} fill="currentColor" />
    </svg>
  );
}

function StatusWifi() {
  return (
    <svg viewBox="0 0 16 12" aria-hidden className="figma-status-icon figma-status-icon--wifi">
      <path
        d="M8 2.8C5.1 2.8 2.6 4.1.5 6.4l1.2 1.4C3.4 5.4 5.6 4.5 8 4.5s4.6.9 6.3 3.3l1.2-1.4C13.4 4.1 10.9 2.8 8 2.8z"
        fill="currentColor"
      />
      <path
        d="M8 6.6c-1.6 0-3 .7-4 1.9l1.2 1.4c.7-.9 1.7-1.4 2.8-1.4s2.1.5 2.8 1.4l1.2-1.4c-1-1.2-2.4-1.9-4-1.9z"
        fill="currentColor"
      />
      <circle cx={8} cy={10.8} r={1.35} fill="currentColor" />
    </svg>
  );
}

function StatusBattery() {
  return (
    <svg viewBox="0 0 27 13" aria-hidden className="figma-status-icon figma-status-icon--bat">
      <rect x={0.5} y={0.5} width={22} height={12} rx={3.2} stroke="currentColor" fill="none" opacity={0.35} />
      <rect x={2} y={2} width={16} height={9} rx={1.8} fill="currentColor" />
      <path d="M24 4.3v4.4c1.1-.35 1.9-1.1 1.9-2.2s-.8-1.85-1.9-2.2z" fill="currentColor" opacity={0.4} />
    </svg>
  );
}
