/**
 * From /Users/apple/Downloads/Robotaxi.md (Figma export)
 * Device 260×563 · Screen 237.61×515 · Bezel inset 11px / 10px
 */
export const FIGMA_SPEC = {
  device: { width: 260, height: 563, radius: 44, bg: "#1A1A1A" },
  screen: { width: 238, height: 515, radius: 36 },
  inset: { x: 11, top: 10 },
  colors: {
    teal: "#00A8B5",
    handle: "#D1D1D6",
    field: "#F2F2F7",
    sheet: "#FFFFFF",
    text: "#000000",
    muted: "#8E8E93",
  },
  handle: { width: 32, height: 4, radius: 2 },
  sheet: {
    radius: 24,
    btnRadius: 12,
    rainChipRadius: 20,
  },
} as const;
