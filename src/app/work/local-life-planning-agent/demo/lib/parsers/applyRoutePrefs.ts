import type { ParseResult } from "../types";
import type { RoutePreferences } from "../types";

export function applyRoutePrefs(parseResult: ParseResult, prefs: RoutePreferences): ParseResult {
  return {
    ...parseResult,
    intent: {
      ...parseResult.intent,
      routePrefs: {
        transport: prefs.transport,
        goal: prefs.goal,
        customGoal: prefs.customGoal,
      },
    },
  };
}
