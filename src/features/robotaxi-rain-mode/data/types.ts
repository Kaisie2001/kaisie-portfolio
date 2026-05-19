/** Four-screen Figma prototype flow (00robotaxi) */
export type RainModeScreen =
  | "rainModeEntry"
  | "serviceStatus"
  | "choosePickup"
  | "onTheWay";

export type PudoOptionType =
  | "closest"
  | "sheltered"
  | "soonest"
  | "default"
  | "fallback";

export type ConfidenceLevel = "high" | "medium" | "low";

export type SourceType =
  | "simulated"
  | "OSM_reference"
  | "manual_annotation_simulated"
  | string;

export type WeatherStatus =
  | "clear"
  | "light_rain"
  | "moderate_rain"
  | "heavy_rain";

export type RainIntensity = "none" | "low" | "medium" | "high";

export type ServiceStatus =
  | "available"
  | "limited_available"
  | "suspended";

export type SupplyLevel = "normal" | "low" | "very_low" | "unavailable";

export type ReliabilityLevel = "low" | "medium" | "high" | string;

export type QueueStatus = "normal" | "longer_than_usual" | "unavailable";

export type GeoPoint = {
  type: "Point";
  coordinates: [number, number];
};

export type GeoLineString = {
  type: "LineString";
  coordinates: [number, number][];
};

export type PudoCandidate = {
  pudo_id: string;
  option_type: PudoOptionType;
  label_en: string;
  label_zh: string;
  geometry: GeoPoint;
  /** Data-driven engine fields. Kept optional so legacy JSON adapters remain valid. */
  id?: string;
  label?: string;
  coordinates?: [number, number];
  is_valid_pudo: boolean;
  isValidPudo?: boolean;
  validity_type: string;
  legal_stopping: boolean;
  legalStopping?: boolean;
  vehicle_accessible: boolean;
  vehicleAccessible?: boolean;
  within_service_area: boolean;
  withinServiceArea?: boolean;
  within_odd: boolean;
  withinOdd?: boolean;
  roadSafetyPass?: boolean;
  boardingSafetyPass?: boolean;
  realTimeRoadPass?: boolean;
  hard_constraint_passed: boolean;
  walking_distance_m: number;
  walkingDistanceM?: number;
  rain_exposed_distance_m: number;
  rainExposedWalkingDistanceM?: number;
  covered_distance_m?: number;
  coveredWalkingDistanceM?: number;
  vehicle_eta_min: number;
  vehicleEtaMin?: number;
  walking_time_min?: number;
  walkingTimeMin?: number;
  estimated_boarding_time_min?: number;
  estimatedBoardingTimeMin?: number;
  shelter_score: number;
  shelterScore?: number;
  same_side_access?: boolean;
  sameSideAccess?: boolean;
  crossing_count?: number;
  crossingCount?: number;
  recognizabilityScore?: number;
  demandProximityScore?: number;
  demandIndex?: number;
  recommendation_reason_en: string;
  recommendation_reason_zh: string;
  tradeoff_summary_en?: string;
  tradeoff_summary_zh?: string;
  source_type: SourceType;
  confidence_level: ConfidenceLevel;
  osm_reference?: string;
};

export type WalkingRoute = {
  route_id: string;
  origin_id: string;
  pudo_id: string;
  geometry: GeoLineString;
  total_distance_m: number;
  rain_exposed_distance_m: number;
  covered_distance_m?: number;
  crossing_count?: number;
  same_side_access?: boolean;
  estimated_walk_time_min?: number;
  route_confidence: string;
  source_type: SourceType;
};

export type ShelterFeature = {
  shelter_id: string;
  shelter_type: string;
  name?: string;
  geometry: GeoPoint;
  coverage_level: "good" | "partial" | "none";
  related_pudo_ids: string[];
  source_type: SourceType;
  confidence_level: ConfidenceLevel;
  notes?: string;
};

export type RainModeScenario = {
  scenario_id: string;
  scenario_name: string;
  city: string;
  area_name: string;
  scenario_type: string;
  user_goal: string;
  weather_context: string;
  demo_disclaimer: string;
  language: string;
};

export type RainServiceStatus = {
  area_id: string;
  weather_status: WeatherStatus;
  rain_intensity: RainIntensity;
  rain_mode_enabled: boolean;
  service_status: ServiceStatus;
  vehicle_supply_level: SupplyLevel;
  eta_reliability: ReliabilityLevel;
  queue_status?: QueueStatus;
  operation_notice_id: string;
  fallback_suggestion: string;
  fallback_suggestion_zh: string;
  source_type: SourceType;
  confidence_level: ConfidenceLevel;
};

export type OperationNotice = {
  notice_id: string;
  title_en: string;
  title_zh: string;
  body_en: string;
  body_zh: string;
  severity: string;
  source_type: SourceType;
};

export type LegalStoppingRule = {
  rule_id: string;
  rule: string;
  description: string;
  source_type: SourceType;
};

export type EtaEstimate = {
  pudo_id: string;
  vehicle_eta_min: number;
  estimated_boarding_time_min?: number;
  source_type: SourceType;
  confidence_level: ConfidenceLevel;
};

export type DataSourceMeta = {
  demo_name: string;
  created?: string;
  osm_source_file?: string;
  data_status: string;
  disclaimer: string;
  is_simulated: boolean;
};

export type PickupTimeWindow = {
  requestedAtIso: string;
  earliestPickupIso: string;
  latestPickupIso: string;
};

export type RainModeUserRequest = {
  requestId: string;
  userLocation: {
    id: string;
    label: string;
    coordinates: [number, number];
  };
  destination: {
    id: string;
    label: string;
    coordinates: [number, number];
  };
  pickupTimeWindow: PickupTimeWindow;
};

export type HardConstraintKey =
  | "isValidPudo"
  | "legalStopping"
  | "vehicleAccessible"
  | "withinServiceArea"
  | "withinOdd"
  | "roadSafetyPass"
  | "boardingSafetyPass"
  | "realTimeRoadPass";

export type HardConstraintResult = {
  pudoId: string;
  passed: boolean;
  failed: HardConstraintKey[];
};

export type WalkingRouteSegment = {
  segmentId: string;
  type: "covered" | "exposed" | "crossing";
  distanceM: number;
  coordinates: [number, number][];
};

export type VehicleApproachRoute = {
  routeId: string;
  pudoId: string;
  vehicleId: string;
  coordinates: [number, number][];
  distanceM: number;
};

export type RainModeThresholds = {
  triggerRainIntensityMin: RainIntensity;
  maxEtaReliabilityRisk: ReliabilityLevel;
  maxWalkingDistanceM: number;
  maxExposedWalkingDistanceM: number;
  maxCrossingCount: number;
  boardingBufferMin: number;
  minComfortScore: number;
};

export type RainModeWeights = {
  walkingDistance: number;
  rainExposure: number;
  coveredWalking: number;
  shelterScore: number;
  sameSideAccess: number;
  crossingCount: number;
  vehicleEta: number;
  boardingTime: number;
  recognizability: number;
  demandProximity: number;
};

export type CandidateScore = {
  pudoId: string;
  rainComfortScore: number;
  weightedScore: number;
  components: Record<keyof RainModeWeights, number>;
};

export type PickupSelectionOutput = {
  rawCandidateCount: number;
  validCandidateCount: number;
  hardFilterResults: HardConstraintResult[];
  rejectedCandidates: HardConstraintResult[];
  exposureByPudo: Record<
    string,
    {
      walkingDistanceM: number;
      rainExposedWalkingDistanceM: number;
      coveredWalkingDistanceM: number;
      exposureRatio: number;
    }
  >;
  etaByPudo: Record<string, EtaEstimate>;
  scores: CandidateScore[];
  selections: {
    closest: string;
    sheltered: string;
    soonest: string;
    recommended: string;
  };
};

export type TechnicalStage =
  | "contextTrigger"
  | "serviceGate"
  | "pudoSelection"
  | "pickupCoordination";

export type RainModeDemoBundle = {
  scenario: RainModeScenario;
  service_status: RainServiceStatus;
  pudo_candidates: PudoCandidate[];
  shelter_features: ShelterFeature[];
  walking_routes: WalkingRoute[];
  eta_estimates: EtaEstimate[];
  legal_stopping_rules: LegalStoppingRule[];
  operation_notices: OperationNotice[];
  data_source_meta: DataSourceMeta;
  user_location: {
    id: string;
    label: string;
    geometry: GeoPoint;
  };
};

/** Raw portfolio JSON — fields read by demoDataAdapter.normalizePudo */
export type RawPudoCandidate = {
  pudo_id?: string;
  option_type?: string;
  label?: string;
  cn_label?: string;
  lat?: number;
  lon?: number;
  legal_stopping_assumption?: boolean;
  vehicle_accessible_assumption?: boolean;
  within_service_area_assumption?: boolean;
  within_odd_assumption?: boolean;
  vehicle_eta_min?: number;
  vehicle_eta_min_simulated?: number;
  estimated_boarding_time_min?: number;
  estimated_boarding_time_min_simulated?: number;
  walking_distance_m?: number;
  rain_exposed_distance_m?: number;
  covered_distance_m?: number;
  shelter_score?: number;
  shelter_score_simulated?: number;
  is_valid_pudo?: boolean | string;
  same_side_access?: boolean;
  crossing_count?: number;
  recommendation_reason_en?: string;
  recommendation_reason_zh?: string;
  recommendation_reason?: string;
  cn_recommendation_reason?: string;
  tradeoff_summary_en?: string;
  tradeoff_summary_zh?: string;
  source_type?: string;
  source_confidence?: string;
  osm_reference?: string;
};

export type RawRainModeBundle = {
  metadata?: {
    demo_name?: string;
    created?: string;
    osm_source_file?: string;
    data_status?: string;
    disclaimer?: string;
  };
  scenario?: Record<string, unknown>;
  user_location?: {
    id?: string;
    label?: string;
    lat?: number;
    lon?: number;
  };
  pudo_candidates?: RawPudoCandidate[];
  legal_rules_summary?: Array<{ rule?: string; description?: string }>;
};
