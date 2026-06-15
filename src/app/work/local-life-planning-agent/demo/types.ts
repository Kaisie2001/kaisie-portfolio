export type PoiCategory = "activity" | "food" | "optional";

export type PoiStop = {
  id: string;
  name: string;
  category: PoiCategory;
  arriveAt: string;
  travelMinutes: number | null;
  matchReason: string;
  rating: number;
  priceLevel: string;
};

export type FallbackOption = {
  id: string;
  trigger: string;
  poiName: string;
  note: string;
};

export type ParsedIntent = {
  time: string;
  group: string;
  budget: string;
  foodPreference: string;
  activityPreference: string;
  mobility: string;
};

export type ExecutionActionId = "reserve" | "order" | "ticket" | "share";

export type DemoPlan = {
  goal: string;
  intent: ParsedIntent;
  stops: PoiStop[];
  fallbacks: FallbackOption[];
};
