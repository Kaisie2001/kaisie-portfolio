import type { ReactNode } from "react";
import { PrimaryButton } from "./PrimaryButton";

type DemoScreenShellProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function DemoScreenShell({ children, footer }: DemoScreenShellProps) {
  return (
    <div className="flex min-h-[520px] flex-col px-4 pb-4 pt-3">
      <div className="flex-1 space-y-3 overflow-y-auto">{children}</div>
      {footer ? (
        <div className="mt-3 shrink-0 border-t border-slate-800/80 pt-3">{footer}</div>
      ) : null}
    </div>
  );
}

export function DemoPrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return <PrimaryButton onClick={onClick}>{children}</PrimaryButton>;
}
