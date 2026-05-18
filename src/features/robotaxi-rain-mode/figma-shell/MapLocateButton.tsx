"use client";

import { IconLocateCurrent } from "./icons";
import { useMapControl } from "./MapControlContext";

/** Floating locate control — above bottom sheet, on the map (not inside the sheet). */
export function MapLocateButton() {
  const { recenterOnUser } = useMapControl();

  return (
    <button
      type="button"
      className="figma-map-locate-btn"
      aria-label="Center map on current location"
      onClick={(e) => {
        e.stopPropagation();
        recenterOnUser();
      }}
    >
      <IconLocateCurrent />
    </button>
  );
}
