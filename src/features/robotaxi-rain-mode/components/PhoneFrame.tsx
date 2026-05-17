import type { ReactNode } from "react";
import "./rain-theme.css";

type PhoneFrameProps = {
  children: ReactNode;
};

/** Figma 00robotaxi — 260×563 device shell */
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="rain-prototype">
      <div className="phone-device">
        <div className="phone-screen-wrap">
          <div className="phone-status-bar" aria-hidden>
            <span className="status-time">9:41</span>
            <div className="phone-dynamic-island" />
            <div className="status-icons">
              <StatusIcons />
            </div>
          </div>
          <div className="phone-app">{children}</div>
          <div className="phone-home-indicator" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function StatusIcons() {
  return (
    <>
      <svg width={15} height={10} viewBox="0 0 15 10" aria-hidden>
        <rect x={0} y={6} width={2.5} height={4} rx={0.5} fill="currentColor" />
        <rect x={3.5} y={4} width={2.5} height={6} rx={0.5} fill="currentColor" />
        <rect x={7} y={2} width={2.5} height={8} rx={0.5} fill="currentColor" />
        <rect x={10.5} y={0} width={2.5} height={10} rx={0.5} fill="currentColor" />
      </svg>
      <svg width={14} height={10} viewBox="0 0 14 10" aria-hidden>
        <path
          d="M7 2.5C4.5 2.5 2.3 3.5.5 5.2l1 1.2C3 4.7 4.9 4 7 4s4 .7 5.5 2.4l1-1.2C11.7 3.5 9.5 2.5 7 2.5zm0 3c-1.5 0-2.8.6-3.8 1.6l1 1.2c.7-.7 1.7-1.1 2.8-1.1s2.1.4 2.8 1.1l1-1.2C9.8 6.1 8.5 5.5 7 5.5z"
          fill="currentColor"
        />
        <circle cx={7} cy={8.5} r={1.2} fill="currentColor" />
      </svg>
      <svg width={22} height={10} viewBox="0 0 22 10" aria-hidden>
        <rect
          x={0}
          y={1}
          width={18}
          height={8}
          rx={2}
          stroke="currentColor"
          strokeWidth={1}
          fill="none"
        />
        <rect x={1.5} y={2.5} width={13} height={5} rx={1} fill="currentColor" />
        <path d="M19 3.5v3a1.5 1.5 0 000-3z" fill="currentColor" />
      </svg>
    </>
  );
}
