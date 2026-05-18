import type { PickupId } from "./types";

export type PickupOption = {
  id: PickupId;
  name: string;
  color: string;
  selectedClass: string;
  selectedSub: string;
  walk: string;
  walkMin: string;
  exposureVal: string;
  exposureColor: string;
  etaVal: string;
  etaLabelColor?: string;
  mapLeft: string;
  mapTop: string;
  dotClass: "red" | "green" | "orange";
};

export const PICKUP_OPTIONS: PickupOption[] = [
  {
    id: "closest",
    name: "Closest",
    color: "#e53935",
    selectedClass: "is-red",
    selectedSub: "Shortest walk",
    walk: "45 m",
    walkMin: "2 min",
    exposureVal: "40 m",
    exposureColor: "#e53935",
    etaVal: "6 min",
    mapLeft: "52%",
    mapTop: "42%",
    dotClass: "red",
  },
  {
    id: "sheltered",
    name: "Sheltered",
    color: "#34a853",
    selectedClass: "is-green",
    selectedSub: "Less rain exposure",
    walk: "60 m",
    walkMin: "2 min",
    exposureVal: "15 m",
    exposureColor: "#34a853",
    etaVal: "7 min",
    mapLeft: "58%",
    mapTop: "48%",
    dotClass: "green",
  },
  {
    id: "soonest",
    name: "Soonest",
    color: "#f5a623",
    selectedClass: "is-orange",
    selectedSub: "Fastest boarding",
    walk: "65 m",
    walkMin: "2 min",
    exposureVal: "30 m",
    exposureColor: "#1c1c1e",
    etaVal: "4 min",
    etaLabelColor: "#f5a623",
    mapLeft: "66%",
    mapTop: "40%",
    dotClass: "orange",
  },
];

export function getPickupOption(id: PickupId): PickupOption {
  return PICKUP_OPTIONS.find((o) => o.id === id) ?? PICKUP_OPTIONS[1];
}
