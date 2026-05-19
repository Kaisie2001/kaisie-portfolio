export type DemoLang = "en" | "zh";
export type LonLat = [number, number];
export type GuidedDemoStepId = 1 | 2 | 3 | 4;
export type CompareOptionId = "sheltered" | "farthest" | "soonest";
export type ExposureLevel = "low" | "medium" | "high";

export type FrozenPickupOption = {
  id: CompareOptionId;
  name: Record<DemoLang, string>;
  sub: Record<DemoLang, string>;
  marker: LonLat;
  zone: [LonLat, LonLat];
  walkingRoute: LonLat[];
  walkM: number;
  walkMin: number;
  exposureM: number;
  exposureLevel: ExposureLevel;
  vehicleEtaMin: number;
  color: string;
  dotClass: "green" | "red" | "orange";
  selectedClass: "is-green" | "is-red" | "is-orange";
  sourceRoute: string;
};

export const COMPARE_OPTION_ORDER: CompareOptionId[] = [
  "sheltered",
  "farthest",
  "soonest",
];

const walkingRouteSheltered: LonLat[] = [
  [113.933433, 22.520154],
  [113.933552, 22.520603],
  [113.932885, 22.520683],
  [113.932315, 22.520748],
  [113.93203, 22.520782],
  [113.932002, 22.520685],
  [113.931965, 22.520565],
  [113.932012, 22.520557],
  [113.931948, 22.520385],
  [113.931889, 22.520165],
];

const walkingRouteClosest: LonLat[] = [
  [113.933433, 22.520154],
  [113.933379, 22.519949],
  [113.933337, 22.519953],
  [113.933353, 22.520008],
  [113.933484, 22.520546],
  [113.933492, 22.520582],
  [113.933248, 22.52061],
];

const walkingRouteSoonest: LonLat[] = [
  [113.933433, 22.520154],
  [113.933552, 22.520603],
  [113.933799, 22.520574],
  [113.93385, 22.520516],
  [113.934208, 22.520475],
  [113.934502, 22.520442],
  [113.934571, 22.520487],
  [113.934925, 22.520447],
  [113.934913, 22.52035],
  [113.934893, 22.520181],
];

const tripOverviewRoute: LonLat[] = [
  [113.931956, 22.520149],
  [113.931588, 22.518847],
  [113.930792, 22.519027],
  [113.930784, 22.51896],
  [113.931216, 22.518862],
];

const vehicleRouteToSheltered: LonLat[] = [
  [113.936186, 22.521753],
  [113.936341, 22.521714],
  [113.938479, 22.521177],
  [113.937846, 22.518971],
  [113.937422, 22.517478],
  [113.936504, 22.517697],
  [113.935625, 22.517912],
  [113.935142, 22.51803],
  [113.934671, 22.518145],
  [113.934468, 22.518194],
  [113.933981, 22.5183],
  [113.933001, 22.518523],
  [113.93167, 22.518828],
  [113.932202, 22.520731],
  [113.932217, 22.520785],
  [113.932136, 22.520794],
  [113.932123, 22.52074],
  [113.931956, 22.520149],
];

const pickupOptions: Record<CompareOptionId, FrozenPickupOption> = {
  sheltered: {
    id: "sheltered",
    name: { en: "Sheltered area", zh: "遮蔽区域" },
    sub: { en: "Best rain protection", zh: "遮蔽最好" },
    marker: [113.9318718, 22.5201693],
    zone: [
      [113.93174, 22.52007],
      [113.93208, 22.52027],
    ],
    walkingRoute: walkingRouteSheltered,
    walkM: 285,
    walkMin: 4,
    exposureM: 42,
    exposureLevel: "low",
    vehicleEtaMin: 5,
    color: "#34a853",
    dotClass: "green",
    selectedClass: "is-green",
    sourceRoute: "walking_route_sheltered.geojson",
  },
  farthest: {
    id: "farthest",
    name: { en: "Farthest area", zh: "最远区域" },
    sub: { en: "Shortest walk", zh: "步行最近" },
    marker: [113.9332498, 22.5206235],
    zone: [
      [113.9331, 22.52054],
      [113.93356, 22.52064],
    ],
    walkingRoute: walkingRouteClosest,
    walkM: 125,
    walkMin: 2,
    exposureM: 116,
    exposureLevel: "high",
    vehicleEtaMin: 8,
    color: "#e53935",
    dotClass: "red",
    selectedClass: "is-red",
    sourceRoute: "walking_route_closest.geojson",
  },
  soonest: {
    id: "soonest",
    name: { en: "Soonest area", zh: "最快区域" },
    sub: { en: "Fastest vehicle ETA", zh: "车辆最快到达" },
    marker: [113.9349283, 22.5201772],
    zone: [
      [113.93474, 22.52009],
      [113.9351, 22.52027],
    ],
    walkingRoute: walkingRouteSoonest,
    walkM: 228,
    walkMin: 3,
    exposureM: 76,
    exposureLevel: "medium",
    vehicleEtaMin: 3,
    color: "#f5a623",
    dotClass: "orange",
    selectedClass: "is-orange",
    sourceRoute: "walking_route_soonest.geojson",
  },
};

export const GUIDED_DEMO_FROZEN_SCENARIO = {
  viewport: {
    center: [113.93475, 22.51992] as LonLat,
    zoom: 15,
  },
  stepViewports: {
    1: {
      center: [113.93345, 22.52015] as LonLat,
      focus: { x: 130, y: 152 },
    },
    2: {
      center: [113.93345, 22.52028] as LonLat,
      focus: { x: 130, y: 218 },
    },
    3: {
      center: [113.93345, 22.52015] as LonLat,
      focus: { x: 130, y: 150 },
    },
    4: {
      center: [113.93265, 22.52018] as LonLat,
      focus: { x: 130, y: 152 },
    },
  },
  routeSources: {
    walkingSheltered: "public/data/robotaxi-map/generated/walking_route_sheltered.geojson",
    walkingClosest: "public/data/robotaxi-map/generated/walking_route_closest.geojson",
    walkingSoonest: "public/data/robotaxi-map/generated/walking_route_soonest.geojson",
    vehicleToSheltered: "public/data/robotaxi-map/generated/vehicle_route_to_sheltered.geojson",
    tripOverview: "public/data/robotaxi-map/generated/trip_overview_route.geojson",
  },
  area: {
    title: { en: "Shenzhen Bay Sports Center", zh: "深圳湾体育中心" },
    subtitle: { en: "Rainy-day pickup planning", zh: "雨天上车规划" },
  },
  pickupAnchor: {
    label: { en: "Current reference point", zh: "当前参考位置" },
    coordinate: [113.93345, 22.52015] as LonLat,
  },
  dropoff: {
    label: { en: "Talent Park", zh: "人才公园" },
    coordinate: [113.9312, 22.5188] as LonLat,
  },
  selectedOptionId: "sheltered" as CompareOptionId,
  options: pickupOptions,
  tripOverviewRoute,
  vehicleRouteToSelected: vehicleRouteToSheltered,
  vehicleCurrent: {
    coordinate: [113.932202, 22.520731] as LonLat,
    label: { en: "Robotaxi", zh: "Robotaxi" },
  },
  search: {
    waitLabel: { en: "about 5 min", zh: "约 5 分钟" },
    queue: 2,
    nearbyVehicles: 4,
    rainDelayLabel: { en: "+1 min", zh: "+1 分钟" },
  },
  enRoute: {
    etaMin: 5,
    vehicleKm: 1.6,
    street: { en: "Haide 3rd Road", zh: "海德三道" },
  },
};

export function getFrozenScenarioOption(id: CompareOptionId) {
  return GUIDED_DEMO_FROZEN_SCENARIO.options[id];
}

export function getSelectedFrozenOption() {
  return getFrozenScenarioOption(GUIDED_DEMO_FROZEN_SCENARIO.selectedOptionId);
}

export function tripLabels(lang: DemoLang) {
  const scenario = GUIDED_DEMO_FROZEN_SCENARIO;
  return {
    pickup: scenario.pickupAnchor.label[lang],
    dropoff: scenario.dropoff.label[lang],
    pickupZone: getSelectedFrozenOption().name[lang],
  };
}

export function formatWalk(option: FrozenPickupOption) {
  return `${option.walkM} m`;
}

export function formatExposure(option: FrozenPickupOption) {
  return `${option.exposureM} m`;
}

export function formatEta(option: FrozenPickupOption) {
  return `${option.vehicleEtaMin} min`;
}

export function exposureLabel(level: ExposureLevel, lang: DemoLang) {
  const labels: Record<ExposureLevel, Record<DemoLang, string>> = {
    low: { en: "low", zh: "低" },
    medium: { en: "medium", zh: "中" },
    high: { en: "high", zh: "高" },
  };
  return labels[level][lang];
}
