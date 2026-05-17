import type {
  ConfidenceLevel,
  QueueStatus,
  RainIntensity,
  ReliabilityLevel,
  ServiceStatus,
  SupplyLevel,
  WeatherStatus,
} from "./types";

export function formatWeatherStatus(v: WeatherStatus): string {
  return v.replace(/_/g, " ");
}

export function formatRainIntensity(v: RainIntensity): string {
  const map: Record<RainIntensity, string> = {
    none: "None",
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  return map[v] ?? v;
}

export function formatServiceStatus(v: ServiceStatus): string {
  const map: Record<ServiceStatus, string> = {
    available: "Service available",
    limited_available: "Limited availability",
    suspended: "Service suspended",
  };
  return map[v] ?? v;
}

export function formatSupplyLevel(v: SupplyLevel): string {
  const map: Record<SupplyLevel, string> = {
    normal: "Normal",
    low: "Low",
    very_low: "Very low",
    unavailable: "Unavailable",
  };
  return map[v] ?? v;
}

export function formatReliability(v: ReliabilityLevel): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function formatQueueStatus(v: QueueStatus): string {
  const map: Record<QueueStatus, string> = {
    normal: "Normal",
    longer_than_usual: "Longer than usual",
    unavailable: "Unavailable",
  };
  return map[v] ?? v;
}

export function formatConfidence(v: ConfidenceLevel): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}
