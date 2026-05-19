import type {
  RainModeThresholds,
  RainModeUserRequest,
  RainServiceStatus,
} from "../data/types";

const rainRank = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
} as const;

const DEMO_RAIN_INTENSITY_THRESHOLD = 0.4;

export type ContextTriggerOutput = {
  rainModeTriggered: boolean;
  observedRainIntensity: RainServiceStatus["rain_intensity"];
  triggerThreshold: RainModeThresholds["triggerRainIntensityMin"];
  requestSummary: {
    origin: string;
    destination: string;
    pickupWindowMin: number;
  };
};

export function evaluateContextTrigger(
  request: RainModeUserRequest,
  serviceStatus: RainServiceStatus,
  thresholds: RainModeThresholds,
): ContextTriggerOutput {
  const earliest = new Date(request.pickupTimeWindow.earliestPickupIso).getTime();
  const latest = new Date(request.pickupTimeWindow.latestPickupIso).getTime();
  const pickupWindowMin = Math.max(0, Math.round((latest - earliest) / 60000));
  const rainModeTriggered =
    serviceStatus.rain_mode_enabled &&
    rainRank[serviceStatus.rain_intensity] >=
      rainRank[thresholds.triggerRainIntensityMin];

  return {
    rainModeTriggered,
    observedRainIntensity: serviceStatus.rain_intensity,
    triggerThreshold: thresholds.triggerRainIntensityMin,
    requestSummary: {
      origin: request.userLocation.label,
      destination: request.destination.label,
      pickupWindowMin,
    },
  };
}

export type RainModeContextInput = {
  userLocation: {
    label: string;
    coordinates: [number, number];
  };
  destination: {
    label: string;
    coordinates: [number, number];
  };
  pickupTimeWindowMin: number;
  weatherStatus: "clear" | "light_rain" | "moderate_rain" | "heavy_rain";
  rainIntensity: number;
  serviceAreaId: string;
  withinServiceArea: boolean;
  withinOdd: boolean;
  weatherConfidenceLevel: "low" | "medium" | "high";
};

export type RainModeContextOutput = {
  rainModeActive: boolean;
  weatherStatus: RainModeContextInput["weatherStatus"];
  rainIntensity: number;
  serviceAreaMatched: boolean;
  withinOdd: boolean;
  nextStage: "service-gate" | "inactive";
  debug: {
    triggerRule: "rainIntensity >= rainIntensityThreshold";
    threshold: number;
    value: number;
  };
};

export function buildRainModeContext(
  input: RainModeContextInput,
): RainModeContextOutput {
  const serviceAreaMatched = Boolean(input.serviceAreaId) && input.withinServiceArea;
  const requestInsideOperationalDomain = serviceAreaMatched && input.withinOdd;
  const pickupWindowHasRain =
    input.weatherStatus !== "clear" &&
    input.weatherConfidenceLevel !== "low";
  const rainThresholdMet =
    input.rainIntensity >= DEMO_RAIN_INTENSITY_THRESHOLD;
  const rainModeActive =
    requestInsideOperationalDomain && pickupWindowHasRain && rainThresholdMet;

  return {
    rainModeActive,
    weatherStatus: input.weatherStatus,
    rainIntensity: input.rainIntensity,
    serviceAreaMatched,
    withinOdd: input.withinOdd,
    nextStage: rainModeActive ? "service-gate" : "inactive",
    debug: {
      triggerRule: "rainIntensity >= rainIntensityThreshold",
      threshold: DEMO_RAIN_INTENSITY_THRESHOLD,
      value: input.rainIntensity,
    },
  };
}
