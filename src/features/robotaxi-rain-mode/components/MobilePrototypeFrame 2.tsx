import type { ReactNode } from "react";
import "../rain-theme.css";

type MobilePrototypeFrameProps = {
  children: ReactNode;
};

/** Editable iOS-style phone chrome — CSS/DOM only, no raster frame image */
export function MobilePrototypeFrame({ children }: MobilePrototypeFrameProps) {
  return (
    <div className="rain-prototype mx-auto w-full max-w-[390px]">
      <div className="rounded-[2.75rem] border-[3px] border-[#1a1a1a] bg-[#1a1a1a] p-[10px] shadow-2xl shadow-stone-900/25">
        <div className="overflow-hidden rounded-[2.2rem] bg-white">
          <div className="phone-status-bar flex items-end justify-between px-6 pb-1 pt-3 text-[#1a1a1a]">
            <span className="text-[15px] font-semibold tabular-nums">9:41</span>
            <div className="phone-dynamic-island h-[26px] w-[100px] rounded-full bg-[#1a1a1a]" aria-hidden />
            <div className="flex items-center gap-1 text-[11px]">
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </div>
          </div>
          <div className="phone-content relative h-[680px] bg-[#f3f4f6]">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width={16} height={12} viewBox="0 0 16 12" aria-hidden>
      <rect x={0} y={8} width={3} height={4} fill="currentColor" />
      <rect x={4} y={5} width={3} height={7} fill="currentColor" />
      <rect x={8} y={2} width={3} height={10} fill="currentColor" />
      <rect x={12} y={0} width={3} height={12} fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width={14} height={12} viewBox="0 0 14 12" aria-hidden>
      <path
        d="M7 10a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm-3.5-2a4.5 4.5 0 0 1 7 0M2 5.5a7.5 7.5 0 0 1 10 0"
        stroke="currentColor"
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width={22} height={12} viewBox="0 0 22 12" aria-hidden>
      <rect x={0.5} y={0.5} width={18} height={11} rx={2} stroke="currentColor" fill="none" />
      <rect x={2} y={2} width={13} height={8} rx={1} fill="currentColor" />
      <rect x={19} y={4} width={2} height={4} rx={0.5} fill="currentColor" />
    </svg>
  );
}
