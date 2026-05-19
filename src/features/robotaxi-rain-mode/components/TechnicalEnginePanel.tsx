import type { ReactNode } from "react";
import type { Lang } from "@/lib/portfolioCopy";
import type { FigmaScreen, PickupId } from "../figma-shell/types";
import type { RobotaxiDemoStageId } from "../figma-shell/FigmaRainModeDemo";
import { rainModeDemoData } from "../data/rainModeDemoData";
import type { TechnicalStage } from "../data/types";
import { buildRainModeContext } from "../engine/contextTrigger";
import { evaluateServiceGate } from "../engine/serviceGate";
import { selectPickupOptions } from "../engine/selectPickupOptions";
import {
  buildPickupCoordinationState,
  planPickupCoordination,
} from "../engine/pickupCoordination";

type Props = {
  screen: FigmaScreen;
  lang: Lang;
  activeStage?: RobotaxiDemoStageId;
  selectedPickupOption?: PickupId;
};

const TECHNICAL_STAGE_BY_ACTIVE_STAGE: Record<RobotaxiDemoStageId, TechnicalStage> = {
  "context-trigger": "contextTrigger",
  "service-gate": "serviceGate",
  "pudo-selection": "pudoSelection",
  "pickup-coordination": "pickupCoordination",
};

export const TECHNICAL_STAGE_BY_SCREEN: Record<1 | 2 | 3 | 4, TechnicalStage> = {
  1: "contextTrigger",
  2: "serviceGate",
  3: "pudoSelection",
  4: "pickupCoordination",
};

const PANEL_COPY: Record<
  Lang,
  {
    eyebrow: string;
    stageTitle: Record<TechnicalStage, string>;
    sections: {
      input: string;
      method: string;
      parameters: string;
      parametersThresholds: string;
      computed: string;
      hardConstraints: string;
      walkingExposure: string;
      etaBoarding: string;
      weights: string;
      comfortScore: string;
    };
    screen1Method: string[];
    labels: Record<string, string>;
    values: Record<string, string>;
    sentences: Record<string, string>;
  }
> = {
  en: {
    eyebrow: "Rain-aware PUDO Selection Engine",
    stageTitle: {
      contextTrigger: "Context Ingestion & Rain Mode Trigger",
      serviceGate: "Service Availability & ETA Reliability Gate",
      pudoSelection: "Shelter-aware PUDO Candidate Selection Engine",
      pickupCoordination: "Pickup Execution & Passenger-Vehicle Coordination",
    },
    sections: {
      input: "Input Data",
      method: "Computation Method",
      parameters: "Parameters",
      parametersThresholds: "Parameters / Thresholds",
      computed: "Computed Output",
      hardConstraints: "Hard Constraints",
      walkingExposure: "Walking Exposure Calculation",
      etaBoarding: "ETA / Boarding Time",
      weights: "Parameters / Weights",
      comfortScore: "Rain Comfort Score",
    },
    screen1Method: [
      "Match request to service area",
      "Check weather during pickup window",
      "Check ODD / service boundary",
      "Activate Rain Mode when threshold is met",
    ],
    labels: {
      userLocation: "user_location",
      destination: "destination",
      pickupWindow: "pickup_time_window",
      weatherStatus: "weather_status",
      rainIntensity: "rain_intensity",
      serviceArea: "service_area",
      oddBoundary: "ODD boundary",
      rainThreshold: "rain_intensity_threshold",
      weatherConfidence: "weather_confidence",
      rainMode: "rain_mode",
      serviceAreaMatched: "service_area_matched",
      withinOdd: "within_odd",
      nextStage: "next_stage",
      triggerRule: "debug.trigger_rule",
      service: "Service",
      supply: "Supply",
      etaReliability: "ETA Reliability",
      queue: "Queue",
      rawCandidates: "Raw Candidates",
      afterHardFilter: "After Hard Filter",
      selectedPudo: "Selected PUDO",
      vehicle: "Vehicle",
    },
    values: {
      inside: "inside",
      outside: "outside",
      active: "active",
      inactive: "inactive",
      true: "true",
      false: "false",
      serviceAvailabilityCheck: "service availability check",
      pass: "pass",
      blocked: "blocked",
      noneRejected: "No rejected candidates.",
      rejected: "rejected",
      walk: "walk",
      exposed: "exposed",
      exposure: "exposure",
      eta: "ETA",
      boarding: "boarding",
      comfort: "comfort",
      weighted: "weighted",
      closest: "Closest",
      sheltered: "Sheltered",
      soonest: "Soonest",
      recommended: "Recommended",
      notice: "Notice",
      routePoints: "route points",
      moderateRain: "moderate_rain",
      medium: "medium",
      originName: "Shenzhen Bay Sports Center",
      destinationName: "Talent Park",
      serviceAreaName: "sz-bay-sports-center",
    },
    sentences: {
      serviceGateMethod:
        "Gate service availability, vehicle supply, and ETA reliability before soft pickup ranking runs.",
      maxEtaRisk: "Max accepted ETA reliability risk:",
      gateResult: "Gate result:",
      serviceGatePassed:
        "Service remains available; ETA reliability is acceptable for Rain Mode ranking.",
      serviceGateBlocked:
        "Service gate blocks pickup ranking because availability or ETA reliability is below threshold.",
      hardRejectedPrefix: "rejected:",
      weights:
        "Rain exposure {rainExposure}, shelter {shelter}, covered walk {coveredWalk}, ETA {eta}",
      coordinationMethod:
        "Bind the dispatched vehicle route to the selected legal PUDO, then keep the passenger under cover until curbside arrival.",
      boardingBuffer: "Boarding rain buffer:",
      approachRoute: "Approach route:",
      across: "across",
      passengerInstruction:
        "Hold passenger at covered waiting point until the vehicle reaches the legal curbside PUDO.",
    },
  },
  zh: {
    eyebrow: "雨天感知 PUDO 选择引擎",
    stageTitle: {
      contextTrigger: "上下文接入与 Rain Mode 触发",
      serviceGate: "服务可用性与 ETA 可靠性门控",
      pudoSelection: "遮蔽感知 PUDO 候选点选择引擎",
      pickupCoordination: "上车执行与乘客-车辆协同",
    },
    sections: {
      input: "输入数据",
      method: "计算方法",
      parameters: "参数",
      parametersThresholds: "参数 / 阈值",
      computed: "计算输出",
      hardConstraints: "硬约束",
      walkingExposure: "步行暴露计算",
      etaBoarding: "ETA / 上车时间",
      weights: "参数 / 权重",
      comfortScore: "雨天舒适度得分",
    },
    screen1Method: [
      "将用户请求匹配到服务区域",
      "检查上车时间窗口内的天气",
      "检查 ODD / 服务边界",
      "当雨量阈值满足时激活 Rain Mode",
    ],
    labels: {
      userLocation: "用户位置",
      destination: "目的地",
      pickupWindow: "上车时间窗口",
      weatherStatus: "天气状态",
      rainIntensity: "雨量强度",
      serviceArea: "服务区域",
      oddBoundary: "ODD 边界",
      rainThreshold: "雨量触发阈值",
      weatherConfidence: "天气置信度",
      rainMode: "Rain Mode",
      serviceAreaMatched: "服务区域匹配",
      withinOdd: "位于 ODD 内",
      nextStage: "下一阶段",
      triggerRule: "调试：触发规则",
      service: "服务状态",
      supply: "车辆供给",
      etaReliability: "ETA 可靠性",
      queue: "排队状态",
      rawCandidates: "原始候选点",
      afterHardFilter: "硬过滤后",
      selectedPudo: "选中 PUDO",
      vehicle: "车辆",
    },
    values: {
      inside: "范围内",
      outside: "范围外",
      active: "已激活",
      inactive: "未激活",
      true: "是",
      false: "否",
      serviceAvailabilityCheck: "服务可用性检查",
      pass: "通过",
      blocked: "阻断",
      noneRejected: "没有被拒绝的候选点。",
      rejected: "被拒绝",
      walk: "步行",
      exposed: "暴露",
      exposure: "暴露占比",
      eta: "ETA",
      boarding: "上车",
      comfort: "舒适度",
      weighted: "加权分",
      closest: "最近",
      sheltered: "遮蔽",
      soonest: "最快",
      recommended: "推荐",
      notice: "提示",
      routePoints: "路线点",
      moderateRain: "中雨",
      medium: "中等",
      originName: "深圳湾体育中心",
      destinationName: "人才公园",
      serviceAreaName: "深圳湾服务区",
    },
    sentences: {
      serviceGateMethod:
        "在进入软排序前，先检查服务可用性、车辆供给和 ETA 可靠性。",
      maxEtaRisk: "可接受的最高 ETA 风险：",
      gateResult: "门控结果：",
      serviceGatePassed:
        "服务仍可用，ETA 可靠性满足 Rain Mode 排序要求。",
      serviceGateBlocked:
        "服务可用性或 ETA 可靠性低于阈值，门控阻断后续排序。",
      hardRejectedPrefix: "被拒绝：",
      weights:
        "雨中暴露 {rainExposure}，遮蔽 {shelter}，有遮蔽步行 {coveredWalk}，ETA {eta}",
      coordinationMethod:
        "将派发车辆路线绑定到选中的合法 PUDO，并让乘客在遮蔽点等待车辆到达路侧上车点。",
      boardingBuffer: "雨天上车缓冲：",
      approachRoute: "接近路线：",
      across: "经过",
      passengerInstruction:
        "乘客先在遮蔽等待点等候，直到车辆到达合法路侧 PUDO。",
    },
  },
};

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-stone-200/70 bg-white/55 px-3 py-2">
      <p className="m-0 font-mono text-[9px] uppercase tracking-[0.12em] text-stone-400">
        {label}
      </p>
      <p className="m-0 mt-1 text-sm font-semibold leading-tight text-stone-950">
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-stone-200/70 pt-3 first:border-t-0 first:pt-0">
      <h4 className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">
        {title}
      </h4>
      <div className="mt-2 text-[12px] leading-relaxed text-stone-700">
        {children}
      </div>
    </section>
  );
}

export function TechnicalEnginePanel({
  screen,
  lang,
  activeStage,
  selectedPickupOption = "sheltered",
}: Props) {
  const copy = PANEL_COPY[lang];
  const contextInput = {
    userLocation: rainModeDemoData.userRequest.userLocation,
    destination: rainModeDemoData.userRequest.destination,
    pickupTimeWindowMin: 15,
    weatherStatus: "moderate_rain" as const,
    rainIntensity: 0.62,
    serviceAreaId: rainModeDemoData.serviceStatus.area_id,
    withinServiceArea: true,
    withinOdd: true,
    weatherConfidenceLevel: "medium" as const,
  };
  const context = buildRainModeContext(contextInput);
  const serviceGate = evaluateServiceGate(
    rainModeDemoData.serviceStatus,
    rainModeDemoData.thresholds,
  );
  const selection = selectPickupOptions(
    rainModeDemoData.pudoCandidates,
    rainModeDemoData.walkingRoutes,
    rainModeDemoData.vehicleApproachRoutes,
  );
  const coordination = planPickupCoordination(
    selection,
    rainModeDemoData.vehicleApproachRoutes,
    rainModeDemoData.operationNotices,
  );
  const shelteredCandidate =
    selection.sheltered ??
    selection.candidatesWithComputedMetrics?.find(
      (candidate) => (candidate.id ?? candidate.pudo_id) === "sheltered",
    );
  const shelteredWalkingRoute =
    rainModeDemoData.walkingRoutes.find((route) => route.pudo_id === "sheltered") ??
    rainModeDemoData.walkingRoutes[0];
  const shelteredApproachRoute =
    rainModeDemoData.vehicleApproachRoutes.find(
      (route) => route.pudoId === "sheltered",
    ) ?? rainModeDemoData.vehicleApproachRoutes[0];
  const pickupCoordinationState =
    shelteredCandidate && shelteredWalkingRoute && shelteredApproachRoute
      ? buildPickupCoordinationState({
          selectedCandidate: shelteredCandidate,
          walkingRoute: shelteredWalkingRoute,
          vehicleApproachRoute: {
            ...shelteredApproachRoute,
            distanceM: 1200,
          },
          vehicleEtaMin: 7,
          vehicleDistanceKm: 1.2,
          pickupValidity: "confirmed",
        })
      : null;
  const stage =
    activeStage
      ? TECHNICAL_STAGE_BY_ACTIVE_STAGE[activeStage]
      : screen >= 1 && screen <= 4
      ? TECHNICAL_STAGE_BY_SCREEN[screen as 1 | 2 | 3 | 4]
      : TECHNICAL_STAGE_BY_SCREEN[1];
  const selectedPickupMetrics =
    selection.candidatesWithComputedMetrics?.find(
      (candidate) => (candidate.id ?? candidate.pudo_id) === selectedPickupOption,
    ) ?? selection.selectedRecommendation;
  const selectedInsight =
    selectedPickupOption === "closest"
      ? {
          title: lang === "zh" ? "当前选择：P1 最近" : "Selected: P1 Closest",
          bullets:
            lang === "zh"
              ? [
                  "优化最短步行距离",
                  "雨中暴露距离更高",
                  "选择依据：min walkingDistanceM",
                ]
              : [
                  "optimized for shortest walking distance",
                  "higher rain-exposed distance",
                  "selected by min walkingDistanceM",
                ],
        }
      : selectedPickupOption === "soonest"
        ? {
            title: lang === "zh" ? "当前选择：P3 最快" : "Selected: P3 Soonest",
            bullets:
              lang === "zh"
                ? [
                    "优化最早成功上车",
                    "选择依据：min estimatedBoardingTimeMin",
                    "不一定是最遮蔽方案",
                  ]
                : [
                    "optimized for earliest boarding",
                    "selected by min estimatedBoardingTimeMin",
                    "not necessarily the most sheltered option",
                  ],
          }
        : {
            title: lang === "zh" ? "当前选择：P2 遮蔽" : "Selected: P2 Sheltered",
            bullets:
              lang === "zh"
                ? [
                    "优化雨天舒适度",
                    "雨中暴露距离更低",
                    "选择依据：max rainComfortScore",
                  ]
                : [
                    "optimized for rain comfort",
                    "lower rain-exposed distance",
                    "selected by max rainComfortScore",
                  ],
          };

  return (
    <aside className="robotaxi-technical-panel">
      <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
        {copy.eyebrow}
      </p>
      <h3 className="m-0 mt-2 text-[15px] font-semibold leading-snug text-stone-950">
        {copy.stageTitle[stage]}
      </h3>

      <div className="mt-4 grid gap-3">
        {stage === "contextTrigger" ? (
          <>
            <Section title={copy.sections.input}>
              <div className="grid gap-2">
                <Metric
                  label={copy.labels.userLocation}
                  value={copy.values.originName}
                />
                <Metric
                  label={copy.labels.destination}
                  value={copy.values.destinationName}
                />
                <Metric
                  label={copy.labels.pickupWindow}
                  value={`${contextInput.pickupTimeWindowMin} min`}
                />
                <Metric
                  label={copy.labels.weatherStatus}
                  value={copy.values.moderateRain}
                />
                <Metric
                  label={copy.labels.rainIntensity}
                  value={contextInput.rainIntensity}
                />
                <Metric
                  label={copy.labels.serviceArea}
                  value={copy.values.serviceAreaName}
                />
                <Metric
                  label={copy.labels.oddBoundary}
                  value={
                    contextInput.withinOdd
                      ? copy.values.inside
                      : copy.values.outside
                  }
                />
              </div>
            </Section>
            <Section title={copy.sections.method}>
              <ul className="m-0 space-y-1 p-0">
                {copy.screen1Method.map((item) => (
                  <li key={item} className="list-none">
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title={copy.sections.parameters}>
              <div className="grid gap-2">
                <Metric
                  label={copy.labels.pickupWindow}
                  value={`${contextInput.pickupTimeWindowMin} min`}
                />
                <Metric
                  label={copy.labels.rainThreshold}
                  value={context.debug.threshold}
                />
                <Metric
                  label={copy.labels.weatherConfidence}
                  value={copy.values.medium}
                />
              </div>
            </Section>
            <Section title={copy.sections.computed}>
              <div className="grid gap-2">
                <Metric
                  label={copy.labels.rainMode}
                  value={
                    context.rainModeActive
                      ? copy.values.active
                      : copy.values.inactive
                  }
                />
                <Metric
                  label={copy.labels.weatherStatus}
                  value={copy.values.moderateRain}
                />
                <Metric
                  label={copy.labels.serviceAreaMatched}
                  value={
                    context.serviceAreaMatched
                      ? copy.values.true
                      : copy.values.false
                  }
                />
                <Metric
                  label={copy.labels.withinOdd}
                  value={context.withinOdd ? copy.values.true : copy.values.false}
                />
                <Metric
                  label={copy.labels.nextStage}
                  value={
                    context.nextStage === "service-gate"
                      ? copy.values.serviceAvailabilityCheck
                      : copy.values.inactive
                  }
                />
                <Metric
                  label={copy.labels.triggerRule}
                  value={`${context.debug.triggerRule} (${context.debug.value} >= ${context.debug.threshold})`}
                />
              </div>
            </Section>
          </>
        ) : null}

        {stage === "serviceGate" ? (
          <>
            <Section title={copy.sections.input}>
              <div className="grid grid-cols-2 gap-2">
                <Metric label={copy.labels.service} value={serviceGate.serviceStatus} />
                <Metric label={copy.labels.supply} value={serviceGate.vehicleSupplyLevel} />
                <Metric
                  label={copy.labels.etaReliability}
                  value={serviceGate.etaReliability}
                />
                <Metric label={copy.labels.queue} value={serviceGate.queueStatus ?? "n/a"} />
              </div>
            </Section>
            <Section title={copy.sections.method}>
              {copy.sentences.serviceGateMethod}
            </Section>
            <Section title={copy.sections.parametersThresholds}>
              {copy.sentences.maxEtaRisk}{" "}
              <strong>{rainModeDemoData.thresholds.maxEtaReliabilityRisk}</strong>
            </Section>
            <Section title={copy.sections.computed}>
              {copy.sentences.gateResult}{" "}
              <strong>
                {serviceGate.passed ? copy.values.pass : copy.values.blocked}
              </strong>
              <br />
              {serviceGate.passed
                ? copy.sentences.serviceGatePassed
                : copy.sentences.serviceGateBlocked}
            </Section>
          </>
        ) : null}

        {stage === "pudoSelection" ? (
          <>
            <Section title={copy.sections.input}>
              <div className="grid grid-cols-2 gap-2">
                <Metric
                  label="PudoCandidate"
                  value={`${rainModeDemoData.pudoCandidates.length} items`}
                />
                <Metric
                  label="ShelterFeature"
                  value={`${rainModeDemoData.shelterFeatures.length} item`}
                />
                <Metric
                  label="WalkingRoute"
                  value={`${rainModeDemoData.walkingRoutes.length} routes`}
                />
                <Metric
                  label="VehicleApproachRoute"
                  value={`${rainModeDemoData.vehicleApproachRoutes.length} route`}
                />
                <Metric
                  label="EtaEstimate"
                  value={`${rainModeDemoData.etaEstimates.length} estimates`}
                />
                <Metric
                  label="LegalStoppingRule"
                  value={lang === "zh" ? "assumed_valid_for_demo" : "assumed_valid_for_demo"}
                />
                <Metric
                  label="OddServiceBoundary"
                  value={lang === "zh" ? "范围内" : "within boundary"}
                />
              </div>
            </Section>
            <Section title={lang === "zh" ? "计算管线" : "Computation Pipeline"}>
              <ul className="m-0 space-y-1 p-0">
                {(selection.debugPipeline ?? []).map((item) => (
                  <li key={item} className="list-none">
                    {lang === "zh"
                      ? item
                          .replace("Query candidate pool within 150m search radius", "在 150m 搜索半径内查询候选点池")
                          .replace("Apply hard feasibility filters", "应用硬可行性过滤")
                          .replace("Calculate walking route exposure", "计算步行路线暴露")
                          .replace("Estimate vehicle ETA and boarding time", "估算车辆 ETA 与上车时间")
                          .replace("Calculate rain comfort score", "计算雨天舒适度得分")
                          .replace("Select Closest / Sheltered / Soonest", "选择最近 / 遮蔽 / 最快")
                      : item}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title={lang === "zh" ? "参数与指标" : "Parameters & Indicators"}>
              <div className="grid gap-2">
                <Metric label="search radius" value="150 m" />
                <Metric label="boarding buffer" value="0.5 min" />
                <Metric label="sheltered walk cap" value="1.5 × closest walk" />
                <Metric label="sheltered ETA cap" value="fastest ETA + 3 min" />
                <Metric label="exposure reduction target" value="20 m" />
              </div>
            </Section>
            <Section title={lang === "zh" ? "公式" : "Formulas"}>
              <ul className="m-0 space-y-1 p-0">
                <li className="list-none">
                  covered distance = Σ segment length × coverage ratio
                </li>
                <li className="list-none">
                  exposed distance = Σ segment length × (1 - coverage ratio)
                </li>
                <li className="list-none">
                  boarding time = max(walk time, vehicle ETA) + buffer
                </li>
                <li className="list-none">
                  rain comfort score = shelter + covered + same-side + recognition - exposure - walk - ETA - crossing
                </li>
              </ul>
            </Section>
            <Section title={copy.sections.computed}>
              <div className="grid gap-2">
                <Metric label="raw candidates" value={selection.rawCandidateCount} />
                <Metric
                  label="valid after hard filter"
                  value={selection.validCandidateCount}
                />
                <Metric
                  label="Closest"
                  value={`${selection.closest?.debugId ?? "P1"}, selected by minimum walking distance`}
                />
                <Metric
                  label="Sheltered"
                  value={`${selection.sheltered?.debugId ?? "P2"}, selected by maximum rain comfort score`}
                />
                <Metric
                  label="Soonest"
                  value={`${selection.soonest?.debugId ?? "P3"}, selected by minimum estimated boarding time`}
                />
                {(selection.candidatesWithComputedMetrics ?? []).map((candidate) => (
                  <Metric
                    key={candidate.debugId}
                    label={`${candidate.debugId} ${candidate.label}`}
                    value={`${candidate.walkingDistanceM}m walk · ${candidate.rainExposedDistanceM}m exposed · ${candidate.vehicleEtaMin}m ETA · ${candidate.estimatedBoardingTimeMin}m boarding · ${candidate.rainComfortScore} score`}
                  />
                ))}
              </div>
            </Section>
            <Section title={selectedInsight.title}>
              <ul className="m-0 space-y-1 p-0">
                {selectedInsight.bullets.map((item) => (
                  <li key={item} className="list-none">
                    {item}
                  </li>
                ))}
              </ul>
              {selectedPickupMetrics ? (
                <div className="mt-2 grid gap-2">
                  <Metric
                    label="computed metrics"
                    value={`${selectedPickupMetrics.debugId}: ${selectedPickupMetrics.walkingDistanceM}m walk · ${selectedPickupMetrics.rainExposedDistanceM}m exposed · ${selectedPickupMetrics.estimatedBoardingTimeMin}m boarding`}
                  />
                </div>
              ) : null}
            </Section>
          </>
        ) : null}

        {stage === "pickupCoordination" ? (
          <>
            <Section title={copy.sections.input}>
              <div className="grid gap-2">
                <Metric
                  label="selected_pudo"
                  value={
                    pickupCoordinationState
                      ? `${pickupCoordinationState.selectedPickupLabel} / ${pickupCoordinationState.selectedPudoId}`
                      : coordination.selectedPudoId
                  }
                />
                <Metric
                  label="passenger_walking_route"
                  value={
                    pickupCoordinationState
                      ? `${pickupCoordinationState.passengerWalkDistanceM} m · ${pickupCoordinationState.passengerWalkTimeMin} min`
                      : "n/a"
                  }
                />
                <Metric
                  label="vehicle_approach_route"
                  value={
                    pickupCoordinationState
                      ? `${pickupCoordinationState.vehicleDistanceKm} km`
                      : `${coordination.approachDistanceM} m`
                  }
                />
                <Metric
                  label="vehicle_position"
                  value={shelteredApproachRoute?.vehicleId ?? coordination.vehicleId}
                />
                <Metric
                  label="vehicle_eta"
                  value={
                    pickupCoordinationState
                      ? `${pickupCoordinationState.vehicleEtaMin} min`
                      : "n/a"
                  }
                />
                <Metric
                  label="route_confidence"
                  value={shelteredWalkingRoute?.route_confidence ?? "medium"}
                />
              </div>
            </Section>
            <Section title={copy.sections.method}>
              <ul className="m-0 space-y-1 p-0">
                {(lang === "zh"
                  ? [
                      "锁定选中的 PUDO",
                      "启动乘客步行引导",
                      "追踪车辆接近路线",
                      "比较乘客到达时间与车辆 ETA",
                      "持续监控上车点是否仍然有效",
                    ]
                  : [
                      "Lock selected PUDO",
                      "Start passenger walking guidance",
                      "Track vehicle approach route",
                      "Compare passenger arrival time and vehicle ETA",
                      "Monitor whether pickup remains valid",
                    ]
                ).map((item) => (
                  <li key={item} className="list-none">
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title={copy.sections.parametersThresholds}>
              <div className="grid gap-2">
                <Metric
                  label="pickup geofence radius"
                  value={`${pickupCoordinationState?.debug.pickupGeofenceRadiusM ?? 25} m`}
                />
                <Metric
                  label="boarding buffer"
                  value={`${pickupCoordinationState?.debug.boardingBufferMin ?? 0.5} min`}
                />
                <Metric
                  label="ETA update interval"
                  value={`${pickupCoordinationState?.debug.etaUpdateIntervalSec ?? 15} sec`}
                />
                <Metric
                  label="max arrival sync gap"
                  value={`${pickupCoordinationState?.debug.maxArrivalSyncGapMin ?? 5} min`}
                />
              </div>
            </Section>
            <Section title={copy.sections.computed}>
              <div className="grid gap-2">
                <Metric
                  label="selected pickup"
                  value={
                    pickupCoordinationState
                      ? `${pickupCoordinationState.selectedPickupLabel} / ${pickupCoordinationState.selectedPudoId}`
                      : "Sheltered / P2"
                  }
                />
                <Metric
                  label="passenger walk"
                  value={`${pickupCoordinationState?.passengerWalkDistanceM ?? 60} m`}
                />
                <Metric
                  label="exposed distance"
                  value={`${pickupCoordinationState?.rainExposedDistanceM ?? 15} m`}
                />
                <Metric
                  label="covered distance"
                  value={`${pickupCoordinationState?.coveredDistanceM ?? 45} m`}
                />
                <Metric
                  label="vehicle distance"
                  value={`${pickupCoordinationState?.vehicleDistanceKm ?? 1.2} km`}
                />
                <Metric
                  label="vehicle ETA"
                  value={`${pickupCoordinationState?.vehicleEtaMin ?? 7} min`}
                />
                <Metric
                  label="arrival sync gap"
                  value={`${pickupCoordinationState?.arrivalSyncGapMin ?? 5} min`}
                />
                <Metric
                  label="pickup validity"
                  value={pickupCoordinationState?.pickupValidity ?? "confirmed"}
                />
                <Metric
                  label="fallback required"
                  value={String(pickupCoordinationState?.fallbackRequired ?? false)}
                />
              </div>
              <p className="m-0 mt-2">
                {lang === "zh"
                  ? "选中的 PUDO 不只是 UI 选项，而是同时约束乘客步行引导与车辆接近路线的可执行上车目标。"
                  : "The selected PUDO is not only a UI choice; it becomes the executable pickup target that aligns passenger walking guidance with vehicle approach guidance."}
              </p>
            </Section>
          </>
        ) : null}
      </div>
    </aside>
  );
}
