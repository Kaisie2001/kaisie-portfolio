import type { ReactNode } from "react";

type BottomSheetProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function BottomSheet({ children, footer }: BottomSheetProps) {
  return (
    <div className="bottom-sheet pointer-events-auto flex flex-col rounded-t-[18px] bg-[var(--rain-sheet,#fff)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className="flex justify-center py-2" aria-hidden>
        <div className="sheet-handle" />
      </div>
      <div className="flex-1 overflow-y-auto px-3.5 pb-2">{children}</div>
      {footer ? <div className="shrink-0 px-3.5 pb-3.5 pt-1">{footer}</div> : null}
    </div>
  );
}
