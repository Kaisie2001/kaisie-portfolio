import type { FigmaScreen } from "./types";
import type { MapKind } from "./types";

export function mapKindFromScreen(screen: FigmaScreen): MapKind {
  switch (screen) {
    case 1:
    case 5:
      return "entry";
    case 2:
      return "service";
    case 3:
      return "pickup";
    case 4:
      return "enroute";
    default:
      return "entry";
  }
}
