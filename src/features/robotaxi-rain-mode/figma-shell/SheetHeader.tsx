"use client";

import type { ReactNode } from "react";
import { IconBack } from "./icons";

type SheetHeaderProps = {
  title: string;
  onBack: () => void;
  icon?: ReactNode;
  /** Back on left, title visually centered (screen 2) */
  centerTitle?: boolean;
};

export function SheetHeader({ title, onBack, icon, centerTitle }: SheetHeaderProps) {
  return (
    <div
      className={`figma-sheet-header${centerTitle ? " figma-sheet-header--centered" : ""}`}
    >
      <button
        type="button"
        className="figma-back figma-back--inline"
        onClick={onBack}
        aria-label="Back"
      >
        <IconBack />
      </button>
      {icon ? (
        <div className="figma-sheet-header-main figma-title-row">
          {icon}
          <h2 className="figma-sheet-title">{title}</h2>
        </div>
      ) : (
        <h2 className="figma-sheet-title figma-sheet-title--in-header">{title}</h2>
      )}
    </div>
  );
}
