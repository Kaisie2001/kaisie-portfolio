import type { ReactNode } from "react";
import "./figma-tokens.css";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="figma-rain-root">
      <motion className="figma-phone">
        <div className="figma-screen">
          <div className="figma-status" aria-hidden>
            <span className="time">9:41</span>
            <div className="figma-island" />
            <div className="icons">
              <StatusIcons />
            </motion>
          </motion>
          <div className="figma-app">{children}</motion>
          <div className="figma-home-bar" aria-hidden />
        </motion>
      </motion>
    </motion>
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
          d="M7 2.5C4.5 2.5 2.3 3.5.5 5.2l1 1.2C3 4.7 4.9 4 7 4s4 .7 5.5 2.4l1-1.2C11.7 3.5 9.5 2.5 7 2.5z"
          fill="currentColor"
        />
        <circle cx={7} cy={8.5} r={1.2} fill="currentColor" />
      </svg>
      <svg width={22} height={10} viewBox="0 0 22 10" aria-hidden>
        <rect x={0} y={1} width={18} height={8} rx={2} stroke="currentColor" fill="none" />
        <rect x={1.5} y={2.5} width={13} height={5} rx={1} fill="currentColor" />
      </svg>
    </>
  );
}
