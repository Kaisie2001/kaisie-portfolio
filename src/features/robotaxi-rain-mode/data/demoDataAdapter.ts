import type {
  ConfidenceLevel,
  DataSourceMeta,
  EtaEstimate,
  GeoLineString,
  GeoPoint,
  LegalStoppingRule,
  OperationNotice,
  PudoCandidate,
  PudoOptionType,
  RainIntensity,
  RainModeDemoBundle,
  RainModeScenario,
  RainServiceStatus,
  RawPudoCandidate,
  RawRainModeBundle,
  ShelterFeature,
  SourceType,
  WalkingRoute,
  WeatherStatus,
} from "./types";

const DEFAULT_NOTICE_ID = "notice_rain_limited_001";

function parseConfidence(raw?: string): ConfidenceLevel {
  if (!raw) return "low";
  const v = raw.toLowerCase();
  if (v.includes("high")) return "high";
  if (v.includes("medium")) return "medium";
  return "low";
}

function normalizeRainIntensity(raw?: string): RainIntensity {
  if (!raw) return "medium";
  const v = raw.toLowerCase();
  if (v === "none") return "none";
  if (v === "low" || v === "light") return "low";
  if (v === "high" || v === "heavy") return "high";
  return "medium";
}

function normalizeWeatherStatus(raw?: string): WeatherStatus {
  if (!raw) return "moderate_rain";
  const v = raw.toLowerCase();
  if (v.includes("heavy")) return "heavy_rain";
  if (v.includes("light")) return "light_rain";
  if (v.includes("moderate")) return "moderate_rain";
  if (v === "clear") return "clear";
  return "moderate_rain";
}

function normalizeSourceType(raw?: string): SourceType {
  if (!raw) return "simulated";
  if (
    raw.includes("OSM") ||
    raw.includes("osm") ||
    raw.includes("manual_simulation")
  ) {
    return "OSM_reference_plus_manual_simulation";
  }
  if (raw.includes("simulated")) return "simulated";
  if (raw.includes("manual")) return "manual_annotation_simulated";
  return raw as SourceType;
}

function toPoint(lat?: number, lon?: number): GeoPoint {
  // Fallback demo coordinates — only used when lat/lon missing in source JSON
  return {
    type: "Point",
    coordinates: [lon ?? 113.93345, lat ?? 22.52015],
  };
}

function normalizePudo(raw: RawPudoCandidate): PudoCandidate {
  const legal = raw.legal_stopping_assumption ?? true;
  const vehicle = raw.vehicle_accessible_assumption ?? true;
  const withinArea = raw.within_service_area_assumption ?? true;
  const withinOdd = raw.within_odd_assumption ?? true;
  const hardPassed = legal && vehicle && withinArea && withinOdd;

  const vehicleEta =
    raw.vehicle_eta_min ??
    raw.vehicle_eta_min_simulated ??
    // Fallback demo ETA when field missing in bundle
    6;

  const boarding =
    raw.estimated_boarding_time_min ??
    raw.estimated_boarding_time_min_simulated;

  const walkingM = raw.walking_distance_m ?? 0;
  const walkingTime =
    walkingM > 0 ? Math.max(1, Math.round((walkingM / 80) * 10) / 10) : undefined;

  const shelter =
    raw.shelter_score ?? raw.shelter_score_simulated ?? 0;

  const isValid =
    raw.is_valid_pudo === true ||
    raw.is_valid_pudo === "assumed_valid_for_demo" ||
    raw.is_valid_pudo === "true";

  return {
    pudo_id: raw.pudo_id ?? "unknown",
    option_type: (raw.option_type ?? "default") as PudoOptionType,
    label_en: raw.label ?? raw.recommendation_reason_en ?? "Pickup option",
    label_zh: raw.cn_label ?? raw.recommendation_reason_zh ?? "上车点",
    geometry: toPoint(raw.lat, raw.lon),
    is_valid_pudo: Boolean(isValid),
    validity_type: "assumed_valid_for_demo",
    legal_stopping: legal,
    vehicle_accessible: vehicle,
    within_service_area: withinArea,
    within_odd: withinOdd,
    hard_constraint_passed: hardPassed,
    walking_distance_m: walkingM,
    rain_exposed_distance_m: raw.rain_exposed_distance_m ?? 0,
    covered_distance_m: raw.covered_distance_m,
    vehicle_eta_min: vehicleEta,
    walking_time_min: walkingTime,
    estimated_boarding_time_min: boarding,
    shelter_score: shelter,
    same_side_access: raw.same_side_access,
    crossing_count: raw.crossing_count,
    recommendation_reason_en:
      raw.recommendation_reason_en ??
      raw.recommendation_reason ??
      "Demo recommendation reason.",
    recommendation_reason_zh:
      raw.recommendation_reason_zh ??
      raw.cn_recommendation_reason ??
      "演示推荐理由。",
    tradeoff_summary_en: raw.tradeoff_summary_en,
    tradeoff_summary_zh: raw.tradeoff_summary_zh,
    source_type: normalizeSourceType(raw.source_type),
    confidence_level: parseConfidence(raw.source_confidence),
    osm_reference: raw.osm_reference ?? undefined,
  };
}

function buildTradeoffs(candidates: PudoCandidate[]): PudoCandidate[] {
  const closest = candidates.find((c) => c.option_type === "closest");
  const sheltered = candidates.find((c) => c.option_type === "sheltered");
  const soonest = candidates.find((c) => c.option_type === "soonest");

  return candidates.map((c) => {
    if (c.tradeoff_summary_en) return c;

    if (c.option_type === "closest" && sheltered) {
      const extraWalk = c.walking_distance_m - sheltered.walking_distance_m;
      return {
        ...c,
        tradeoff_summary_en:
          extraWalk < 0
            ? `Shortest walk (${c.walking_distance_m}m), but more rain exposure than sheltered option.`
            : `Shortest walk among compared options.`,
        tradeoff_summary_zh: `步行最短（${c.walking_distance_m}米），但雨中暴露可能更多。`,
      };
    }

    if (c.option_type === "sheltered" && closest) {
      const extraWalk = c.walking_distance_m - closest.walking_distance_m;
      return {
        ...c,
        tradeoff_summary_en:
          extraWalk > 0
            ? `Walk ${extraWalk}m more than closest, with less rain exposure.`
            : `Better shelter with comparable walk distance.`,
        tradeoff_summary_zh:
          extraWalk > 0
            ? `比最近选项多走约 ${extraWalk} 米，但更少淋雨。`
            : `遮蔽更好，步行距离相近。`,
      };
    }

    if (c.option_type === "soonest" && closest) {
      const etaDelta = (
        (c.estimated_boarding_time_min ?? c.vehicle_eta_min) -
        (closest.estimated_boarding_time_min ?? closest.vehicle_eta_min)
      ).toFixed(1);
      return {
        ...c,
        tradeoff_summary_en:
          Number(etaDelta) < 0
            ? `Soonest estimated boarding, with more rain exposure.`
            : `Vehicle may arrive faster; check rain exposure on walk.`,
        tradeoff_summary_zh: `预计更早上车，但步行淋雨可能更多。`,
      };
    }

    return c;
  });
}

function buildWalkingRoutes(
  userId: string,
  userGeom: GeoPoint,
  candidates: PudoCandidate[],
): WalkingRoute[] {
  const [ux, uy] = userGeom.coordinates;

  return candidates.map((c) => {
    const [px, py] = c.geometry.coordinates;
    const mid: [number, number] = [
      ux + (px - ux) * 0.45,
      uy + (py - uy) * 0.45,
    ];
    const geometry: GeoLineString = {
      type: "LineString",
      coordinates: [
        [ux, uy],
        mid,
        [px, py],
      ],
    };

    return {
      route_id: `R_${c.pudo_id}`,
      origin_id: userId,
      pudo_id: c.pudo_id,
      geometry,
      total_distance_m: c.walking_distance_m,
      rain_exposed_distance_m: c.rain_exposed_distance_m,
      covered_distance_m: c.covered_distance_m,
      crossing_count: c.crossing_count,
      same_side_access: c.same_side_access,
      estimated_walk_time_min: c.walking_time_min,
      route_confidence: "demo_manual",
      source_type: c.source_type,
    };
  });
}

function buildShelterFeatures(candidates: PudoCandidate[]): ShelterFeature[] {
  return candidates
    .filter((c) => c.option_type === "sheltered" || c.shelter_score >= 0.7)
    .map((c) => ({
      shelter_id: `S_${c.pudo_id}`,
      shelter_type:
        c.option_type === "sheltered" ? "bus_shelter" : "building_canopy",
      name: c.osm_reference,
      geometry: c.geometry,
      coverage_level:
        c.shelter_score >= 0.8
          ? ("good" as const)
          : c.shelter_score >= 0.5
            ? ("partial" as const)
            : ("none" as const),
      related_pudo_ids: [c.pudo_id],
      source_type: c.source_type,
      confidence_level: c.confidence_level,
      notes: "Shelter proxy derived from demo bundle shelter_score.",
    }));
}

function buildScenario(
  raw: RawRainModeBundle,
  areaName: string,
): RainModeScenario {
  const s = raw.scenario ?? {};
  const weather = String(s.weather_status ?? "moderate_rain");

  return {
    scenario_id: String(s.area_id ?? "demo_zone_houhai_001"),
    scenario_name:
      raw.metadata?.demo_name ??
      "Rainy pickup near Houhai commercial district",
    city: "Shenzhen",
    area_name: areaName,
    scenario_type: "commercial_office_district",
    user_goal: "Request a Robotaxi pickup during rain",
    weather_context: `Weather: ${weather.replace(/_/g, " ")}`,
    demo_disclaimer:
      raw.metadata?.disclaimer ??
      "Simulated demo data. Not official Robotaxi operational data.",
    language: "bilingual",
  };
}

function buildServiceStatus(raw: RawRainModeBundle): RainServiceStatus {
  const s = raw.scenario ?? {};
  const weather = normalizeWeatherStatus(String(s.weather_status ?? ""));
  const rainEnabled =
    weather !== "clear" &&
    normalizeRainIntensity(String(s.rain_intensity ?? "")) !== "none";

  return {
    area_id: String(s.area_id ?? "demo_zone_houhai_001"),
    weather_status: weather,
    rain_intensity: normalizeRainIntensity(String(s.rain_intensity ?? "")),
    rain_mode_enabled: rainEnabled,
    service_status: (String(s.service_status ?? "limited_available") ||
      "limited_available") as RainServiceStatus["service_status"],
    vehicle_supply_level: (String(
      s.vehicle_supply_level ?? "low",
    ) || "low") as RainServiceStatus["vehicle_supply_level"],
    eta_reliability: (String(s.eta_reliability ?? "medium") ||
      "medium") as RainServiceStatus["eta_reliability"],
    queue_status: s.queue_status
      ? (String(s.queue_status) as RainServiceStatus["queue_status"])
      : "longer_than_usual",
    operation_notice_id: DEFAULT_NOTICE_ID,
    fallback_suggestion: String(
      s.fallback_suggestion_en ?? s.fallback_suggestion ?? "",
    ),
    fallback_suggestion_zh: String(s.fallback_suggestion_zh ?? ""),
    source_type: normalizeSourceType(String(s.source_type ?? "simulated")),
    confidence_level: "low",
  };
}

function buildOperationNotices(raw: RawRainModeBundle): OperationNotice[] {
  const s = raw.scenario ?? {};
  return [
    {
      notice_id: DEFAULT_NOTICE_ID,
      title_en: "Rain may affect service",
      title_zh: "降雨可能影响服务",
      body_en: String(
        s.operation_notice_en ??
          "Rain may reduce vehicle availability. Waiting time may be longer than usual.",
      ),
      body_zh: String(
        s.operation_notice_zh ??
          "受降雨影响，车辆供给可能减少，等待时间可能延长。",
      ),
      severity: "warning",
      source_type: normalizeSourceType(String(s.source_type ?? "simulated")),
    },
  ];
}

function buildLegalRules(raw: RawRainModeBundle): LegalStoppingRule[] {
  const rules = raw.legal_rules_summary ?? [];
  return rules.map((r, i) => ({
    rule_id: `rule_${i + 1}`,
    rule: String(r.rule ?? `rule_${i + 1}`),
    description: String(r.description ?? ""),
    source_type: "simulated",
  }));
}

function buildDataSourceMeta(raw: RawRainModeBundle): DataSourceMeta {
  const m = raw.metadata ?? {};
  return {
    demo_name: m.demo_name ?? "Robotaxi Rain Mode Demo",
    created: m.created,
    osm_source_file: m.osm_source_file,
    data_status: m.data_status ?? "simulated",
    disclaimer:
      m.disclaimer ??
      "This demo uses OSM / POI references and simulated fields. Not official Robotaxi data.",
    is_simulated: true,
  };
}

/** Normalize raw portfolio bundle JSON into the unified RainModeDemoBundle interface. */
export function normalizeDemoBundle(raw: RawRainModeBundle): RainModeDemoBundle {
  const areaName = "Houhai / Coastal City demo area";
  const user = raw.user_location ?? {};
  const userGeom = toPoint(user.lat, user.lon);

  const allCandidates = (raw.pudo_candidates ?? []).map(normalizePudo);
  const withTradeoffs = buildTradeoffs(allCandidates);

  const eta_estimates: EtaEstimate[] = withTradeoffs.map((c) => ({
    pudo_id: c.pudo_id,
    vehicle_eta_min: c.vehicle_eta_min,
    estimated_boarding_time_min: c.estimated_boarding_time_min,
    source_type: c.source_type,
    confidence_level: c.confidence_level,
  }));

  const walking_routes = buildWalkingRoutes(
    String(user.id ?? "U1"),
    userGeom,
    withTradeoffs,
  );

  return {
    scenario: buildScenario(raw, areaName),
    service_status: buildServiceStatus(raw),
    pudo_candidates: withTradeoffs,
    shelter_features: buildShelterFeatures(withTradeoffs),
    walking_routes,
    eta_estimates,
    legal_stopping_rules: buildLegalRules(raw),
    operation_notices: buildOperationNotices(raw),
    data_source_meta: buildDataSourceMeta(raw),
    user_location: {
      id: String(user.id ?? "U1"),
      label: String(user.label ?? "User current location"),
      geometry: userGeom,
    },
  };
}

/** Primary comparison options for Screen 3 (excludes fallback unless only options left). */
export function getComparisonCandidates(
  bundle: RainModeDemoBundle,
): PudoCandidate[] {
  const preferred: PudoOptionType[] = ["closest", "sheltered", "soonest"];
  const byType = new Map(
    bundle.pudo_candidates.map((c) => [c.option_type, c]),
  );
  const ordered = preferred
    .map((t) => byType.get(t))
    .filter((c): c is PudoCandidate => Boolean(c));

  if (ordered.length > 0) return ordered;

  return bundle.pudo_candidates.filter(
    (c) => c.hard_constraint_passed && c.option_type !== "fallback",
  );
}

export function getDefaultSelectedPudoId(
  candidates: PudoCandidate[],
): string {
  const sheltered = candidates.find((c) => c.option_type === "sheltered");
  if (sheltered) return sheltered.pudo_id;
  return candidates[0]?.pudo_id ?? "";
}

export function getOperationNotice(
  bundle: RainModeDemoBundle,
  noticeId: string,
): OperationNotice | undefined {
  return bundle.operation_notices.find((n) => n.notice_id === noticeId);
}
