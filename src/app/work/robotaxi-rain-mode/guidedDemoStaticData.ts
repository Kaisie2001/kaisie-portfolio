import type { GuidedDemoStepId } from "./guidedDemoCopy";
import type { CompareOptionId, FrozenPickupOption } from "./guidedDemoFrozenScenario";
import {
  COMPARE_OPTION_ORDER,
  GUIDED_DEMO_FROZEN_SCENARIO,
} from "./guidedDemoFrozenScenario";

export type { CompareOptionId, FrozenPickupOption } from "./guidedDemoFrozenScenario";
export {
  COMPARE_OPTION_ORDER,
  GUIDED_DEMO_FROZEN_SCENARIO,
  exposureLabel,
  formatEta,
  formatExposure,
  formatWalk,
  getFrozenScenarioOption,
  getSelectedFrozenOption,
  tripLabels,
} from "./guidedDemoFrozenScenario";

export type CompareCarouselVariant = {
  id: CompareOptionId;
  pickupKey: CompareOptionId;
  label: { en: string; zh: string };
};

export const COMPARE_CAROUSEL_MS = 2500;

export const COMPARE_CAROUSEL_VARIANTS: CompareCarouselVariant[] = [
  {
    id: "sheltered",
    pickupKey: "sheltered",
    label: { en: "Sheltered area", zh: "遮蔽区域" },
  },
  {
    id: "farthest",
    pickupKey: "farthest",
    label: { en: "Farthest area", zh: "最远区域" },
  },
  {
    id: "soonest",
    pickupKey: "soonest",
    label: { en: "Soonest area", zh: "最快区域" },
  },
];

export function getCompareOptions(): FrozenPickupOption[] {
  return COMPARE_OPTION_ORDER.map(
    (id) => GUIDED_DEMO_FROZEN_SCENARIO.options[id],
  );
}

export const STATIC_SHEET_HEIGHT: Record<GuidedDemoStepId, string> = {
  1: "48%",
  2: "36%",
  3: "58%",
  4: "54%",
};
