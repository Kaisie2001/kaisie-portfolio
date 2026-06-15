import type { DemoPlan } from "./types";

export const DEFAULT_DEMO_GOAL =
  "Plan a Saturday afternoon with friends: photogenic, not too expensive, dinner included.";

export const DEFAULT_DEMO_GOAL_ZH =
  "周六下午和朋友出门，想拍照、别太贵，还要吃晚饭。";

/** Mock plan builder — structured demo data only, no external APIs. */
export function buildMockPlan(goal: string): DemoPlan {
  const trimmed = goal.trim() || DEFAULT_DEMO_GOAL;

  return {
    goal: trimmed,
    intent: {
      time: "Saturday · 14:00–20:00",
      group: "Friends · 3–4 people",
      budget: "Moderate · ¥80–120 / person",
      foodPreference: "Casual dinner · local favorites",
      activityPreference: "Photogenic · outdoor or gallery",
      mobility: "Walking · ≤ 15 min between stops",
    },
    stops: [
      {
        id: "stop-1",
        name: "OCT Loft Creative Park",
        category: "activity",
        arriveAt: "14:30",
        travelMinutes: null,
        matchReason: "Outdoor lanes and murals fit a photogenic afternoon",
        rating: 4.6,
        priceLevel: "Free entry",
      },
      {
        id: "stop-2",
        name: "Chaozhou Garden Bistro",
        category: "food",
        arriveAt: "17:15",
        travelMinutes: 12,
        matchReason: "Casual dinner within budget, 4.5★, tables available",
        rating: 4.5,
        priceLevel: "¥68 / person",
      },
      {
        id: "stop-3",
        name: "Seaside Café & Dessert",
        category: "optional",
        arriveAt: "19:00",
        travelMinutes: 8,
        matchReason: "Optional stop if the group wants dessert after dinner",
        rating: 4.4,
        priceLevel: "¥32 / person",
      },
    ],
    fallbacks: [
      {
        id: "fb-1",
        trigger: "Table booking fails",
        poiName: "Nanyuan Clay-pot Kitchen",
        note: "Same cuisine tier, 6 min closer walk, queue ~15 min",
      },
      {
        id: "fb-2",
        trigger: "Queue time > 30 min",
        poiName: "Light bites at mall food court",
        note: "Keeps the timeline inside the dinner window",
      },
      {
        id: "fb-3",
        trigger: "Route conflict / rain",
        poiName: "Indoor photo exhibition",
        note: "Swaps the outdoor activity while keeping dinner slot",
      },
    ],
  };
}
