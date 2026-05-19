import type { ReactNode } from "react";
import type { Lang } from "@/lib/portfolioCopy";
import type { FigmaScreen, PickupId } from "../figma-shell/types";
import type { RobotaxiDemoStageId } from "../figma-shell/demoEvents";
import type { RobotaxiInteractionEvent } from "../figma-shell/FigmaRainModeDemo";
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
  lastInteractionEvent?: RobotaxiInteractionEvent | string | null;
};

const TECHNICAL_STAGE_BY_ACTIVE_STAGE: Record<
  Exclude<RobotaxiDemoStageId, "empty">,
  TechnicalStage
> = {
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
      pipeline: string;
      formulas: string;
      selectedDebug: string;
      hardConstraints: string;
      walkingExposure: string;
      etaBoarding: string;
      comfortScore: string;
      weights: string;
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
      pipeline: "Computation Pipeline",
      formulas: "Formulas",
      selectedDebug: "Selected Option Debug",
      hardConstraints: "Hard Constraints",
      walkingExposure: "Walking Exposure",
      etaBoarding: "ETA / Boarding Time",
      comfortScore: "Rain Comfort Score",
      weights: "Parameters / Weights",
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
      moderateRain: "moderate_rain",
      medium: "medium",
      originName: "Shenzhen Bay Sports Center",
      destinationName: "Talent Park",
      serviceAreaName: "sz-bay-sports-center",
      noneRejected: "No rejected candidates.",
      rejected: "rejected",
    },
    sentences: {
      serviceGateMethod:
        "Gate service availability, supply, and ETA reliability before soft ranking.",
      weightsSummary:
        "rain {rainExposure} · shelter {shelter} · covered {coveredWalk} · ETA {eta}",
      maxEtaRisk: "Max ETA risk",
      gateResult: "Gate result",
      serviceGatePassed: "Service available; ETA reliability acceptable.",
      serviceGateBlocked: "Gate blocks ranking — availability or ETA below threshold.",
      coordinationMethod:
        "Bind vehicle route to legal PUDO; keep passenger under cover until curbside arrival.",
      coordinationNote:
        "The selected PUDO becomes the executable pickup target aligning passenger walking and vehicle approach.",
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
      pipeline: "计算管线",
      formulas: "公式",
      selectedDebug: "当前选项调试",
      hardConstraints: "硬约束",
      walkingExposure: "步行暴露",
      etaBoarding: "ETA / 上车时间",
      comfortScore: "雨天舒适度得分",
      weights: "参数 / 权重",
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
      moderateRain: "中雨",
      medium: "中等",
      originName: "深圳湾体育中心",
      destinationName: "人才公园",
      serviceAreaName: "深圳湾服务区",
    },
    sentences: {
      serviceGateMethod:
        "在进入软排序前，先检查服务可用性、供给和 ETA 可靠性。",
      maxEtaRisk: "最高 ETA 风险",
      gateResult: "门控结果",
      serviceGatePassed: "服务可用，ETA 可靠性满足要求。",
      serviceGateBlocked: "可用性或 ETA 低于阈值，门控阻断排序。",
      coordinationMethod:
        "将车辆路线绑定到合法 PUDO，乘客在遮蔽点等待路侧到达。",
      weightsSummary:
        "暴露 {rainExposure} · 遮蔽 {shelter} · 有遮蔽步行 {coveredWalk} · ETA {eta}",
      coordinationNote:
        "选中的 PUDO 成为可执行上车目标，同时约束乘客步行引导与车辆接近路线。",
    },
  },
};

function TechnicalMetricCard({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string | number;
  multiline?: boolean;
}) {
  return (
    <div
      className={
        multiline
          ? "robotaxi-tech-metric-card robotaxi-tech-metric-card--multiline"
          : "robotaxi-tech-metric-card"
      }
    >
      <span className="robotaxi-tech-metric-card__label">{label}</span>
      <span className="robotaxi-tech-metric-card__value">{value}</span>
    </div>
  );
}

function Chip({
  label,
  value,
  variant = "metric",
}: {
  label: string;
  value: string | number;
  variant?: "metric" | "text";
}) {
  return (
    <TechnicalMetricCard
      label={label}
      value={value}
      multiline={variant === "text"}
    />
  );
}

function ScoreRow({ label, value }: { label: string; value: string | number }) {
  return <TechnicalMetricCard label={label} value={value} />;
}

function formatScoreLabel(pudoId: string) {
  switch (pudoId) {
    case "closest":
      return "Closest";
    case "sheltered":
      return "Sheltered";
    case "soonest":
      return "Soonest";
    default:
      return pudoId;
  }
}

function MetricGrid({
  children,
  stack = false,
}: {
  children: ReactNode;
  stack?: boolean;
}) {
  return (
    <div
      className={
        stack
          ? "robotaxi-tech-metric-grid robotaxi-tech-metric-grid--stack"
          : "robotaxi-tech-metric-grid"
      }
    >
      {children}
    </div>
  );
}

function ChipGrid({
  children,
  stack = false,
}: {
  children: ReactNode;
  stack?: boolean;
}) {
  return <MetricGrid stack={stack}>{children}</MetricGrid>;
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="robotaxi-technical-panel__block">
      <h4 className="robotaxi-technical-panel__block-title">{title}</h4>
      <div className="robotaxi-technical-panel__block-body">{children}</div>
    </div>
  );
}

function CompactList({ items }: { items: string[] }) {
  return (
    <ul className="robotaxi-tech-list robotaxi-tech-list--compact">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TechnicalEnginePanel({
  screen,
  lang,
  activeStage,
  selectedPickupOption = "sheltered",
  lastInteractionEvent,
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
  if (activeStage === "empty") {
    return (
      <aside className="robotaxi-technical-panel robotaxi-technical-panel--idle">
        <div className="robotaxi-technical-panel__header">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
            {copy.eyebrow}
          </p>
          <h3 className="m-0 mt-1.5 text-[14px] font-semibold leading-snug text-stone-950">
            {lang === "zh" ? "等待行程上下文" : "Waiting for Trip Context"}
          </h3>
          <p className="m-0 mt-2 text-[11px] leading-relaxed text-stone-500">
            {lang === "zh"
              ? "在手机中生成或重置场景后，技术说明将随操作自动更新。"
              : "Generate or reset a scenario on the phone to sync technical notes with your actions."}
          </p>
        </div>
      </aside>
    );
  }

  const stage = activeStage
    ? TECHNICAL_STAGE_BY_ACTIVE_STAGE[activeStage]
    : screen >= 1 && screen <= 4
      ? TECHNICAL_STAGE_BY_SCREEN[screen as 1 | 2 | 3 | 4]
      : TECHNICAL_STAGE_BY_SCREEN[1];
  const selectedPickupMetrics =
    selection.candidatesWithComputedMetrics?.find(
      (candidate) => (candidate.id ?? candidate.pudo_id) === selectedPickupOption,
    ) ?? selection.selectedRecommendation;

  const pipelineSteps =
    lang === "zh"
      ? (selection.debugPipeline ?? []).map((item) =>
          item
            .replace(
              "Query candidate pool within 150m search radius",
              "150m 半径查询候选池",
            )
            .replace("Apply hard feasibility filters", "硬可行性过滤")
            .replace("Calculate walking route exposure", "计算步行暴露")
            .replace(
              "Estimate vehicle ETA and boarding time",
              "估算 ETA 与上车时间",
            )
            .replace("Calculate rain comfort score", "计算雨天舒适度")
            .replace(
              "Select Closest / Sheltered / Soonest",
              "选择最近 / 遮蔽 / 最快",
            ),
        )
      : (selection.debugPipeline ?? []);

  const selectedDebugLabel =
    selectedPickupOption === "closest"
      ? lang === "zh"
        ? "P1 最近"
        : "P1 Closest"
      : selectedPickupOption === "soonest"
        ? lang === "zh"
          ? "P3 最快"
          : "P3 Soonest"
        : lang === "zh"
          ? "P2 遮蔽"
          : "P2 Sheltered";

  const selectedDebugDetail =
    selectedPickupOption === "closest"
      ? lang === "zh"
        ? "min walkingDistanceM"
        : "min walkingDistanceM"
      : selectedPickupOption === "soonest"
        ? lang === "zh"
          ? "min estimatedBoardingTimeMin"
          : "min estimatedBoardingTimeMin"
        : lang === "zh"
          ? "max rainComfortScore"
          : "max rainComfortScore";

  const coordinationSteps =
    lang === "zh"
      ? [
          "锁定选中 PUDO",
          "启动乘客步行引导",
          "追踪车辆接近路线",
          "比较到达时间与 ETA",
          "监控上车点有效性",
        ]
      : [
          "Lock selected PUDO",
          "Start passenger walking guidance",
          "Track vehicle approach route",
          "Compare arrival time vs ETA",
          "Monitor pickup validity",
        ];

  return (
    <aside className="robotaxi-technical-panel">
      <div className="robotaxi-technical-panel__header">
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
          {copy.eyebrow}
        </p>
        <h3 className="m-0 mt-1.5 text-[14px] font-semibold leading-snug text-stone-950">
          {copy.stageTitle[stage]}
        </h3>
        {lastInteractionEvent ? (
          <p className="robotaxi-tech-event">event: {lastInteractionEvent}</p>
        ) : null}
      </div>

      <div
        key={`${stage}-${selectedPickupOption}-${lastInteractionEvent ?? "idle"}`}
        className="robotaxi-technical-panel__body mt-2"
      >
        <div className="robotaxi-technical-panel__sections">
          {stage === "contextTrigger" ? (
            <>
              <Block title={copy.sections.input}>
                <ChipGrid>
                  <Chip label={copy.labels.userLocation} value={copy.values.originName} />
                  <Chip label={copy.labels.destination} value={copy.values.destinationName} />
                  <Chip label={copy.labels.weatherStatus} value={copy.values.moderateRain} />
                  <Chip label={copy.labels.rainIntensity} value={contextInput.rainIntensity} />
                  <Chip
                    label={copy.labels.pickupWindow}
                    value={`${contextInput.pickupTimeWindowMin} min`}
                  />
                  <Chip label={copy.labels.serviceArea} value={copy.values.serviceAreaName} />
                </ChipGrid>
              </Block>
              <Block title={copy.sections.method}>
                <CompactList items={copy.screen1Method} />
              </Block>
              <div className="robotaxi-technical-panel__row robotaxi-technical-panel__row--2col">
                <Block title={copy.sections.parameters}>
                  <ChipGrid>
                    <Chip
                      label={copy.labels.rainThreshold}
                      value={context.debug.threshold}
                    />
                    <Chip
                      label={copy.labels.weatherConfidence}
                      value={copy.values.medium}
                    />
                  </ChipGrid>
                </Block>
                <Block title={copy.sections.computed}>
                  <ChipGrid>
                    <Chip
                      label={copy.labels.rainMode}
                      value={
                        context.rainModeActive
                          ? copy.values.active
                          : copy.values.inactive
                      }
                    />
                    <Chip
                      label={copy.labels.nextStage}
                      value={
                        context.nextStage === "service-gate"
                          ? copy.values.serviceAvailabilityCheck
                          : copy.values.inactive
                      }
                    />
                    <Chip
                      label={copy.labels.triggerRule}
                      value={`${context.debug.value} ≥ ${context.debug.threshold}`}
                    />
                    <Chip
                      label={copy.labels.withinOdd}
                      value={context.withinOdd ? copy.values.true : copy.values.false}
                    />
                  </ChipGrid>
                </Block>
              </div>
            </>
          ) : null}

          {stage === "serviceGate" ? (
            <>
              <Block title={copy.sections.input}>
                <ChipGrid>
                  <Chip label={copy.labels.service} value={serviceGate.serviceStatus} />
                  <Chip label={copy.labels.supply} value={serviceGate.vehicleSupplyLevel} />
                  <Chip
                    label={copy.labels.etaReliability}
                    value={serviceGate.etaReliability}
                  />
                  <Chip label={copy.labels.queue} value={serviceGate.queueStatus ?? "n/a"} />
                </ChipGrid>
              </Block>
              <Block title={copy.sections.method}>
                <CompactList
                  items={[
                    copy.sentences.serviceGateMethod,
                    `${copy.sentences.maxEtaRisk}: ${rainModeDemoData.thresholds.maxEtaReliabilityRisk}`,
                  ]}
                />
              </Block>
              <div className="robotaxi-technical-panel__row robotaxi-technical-panel__row--2col">
                <Block title={copy.sections.parametersThresholds}>
                  <ChipGrid>
                    <Chip
                      label="max_eta_risk"
                      value={rainModeDemoData.thresholds.maxEtaReliabilityRisk}
                    />
                    <Chip label="service_status" value={serviceGate.serviceStatus} />
                  </ChipGrid>
                </Block>
                <Block title={copy.sections.computed}>
                  <ChipGrid>
                    <Chip
                      label={copy.sentences.gateResult}
                      value={serviceGate.passed ? copy.values.pass : copy.values.blocked}
                    />
                  </ChipGrid>
                  <p className="m-0 mt-1.5 text-[10px] leading-snug text-stone-600">
                    {serviceGate.passed
                      ? copy.sentences.serviceGatePassed
                      : copy.sentences.serviceGateBlocked}
                  </p>
                </Block>
              </div>
            </>
          ) : null}

          {stage === "pudoSelection" ? (
            <>
              <Block title={copy.sections.input}>
                <ChipGrid>
                  <Chip
                    label="PudoCandidate"
                    value={`${rainModeDemoData.pudoCandidates.length} items`}
                  />
                  <Chip
                    label="WalkingRoute"
                    value={`${rainModeDemoData.walkingRoutes.length} routes`}
                  />
                  <Chip
                    label="ShelterFeature"
                    value={`${rainModeDemoData.shelterFeatures.length} item`}
                  />
                  <Chip
                    label="VehicleApproachRoute"
                    value={`${rainModeDemoData.vehicleApproachRoutes.length} route`}
                  />
                  <Chip
                    label="EtaEstimate"
                    value={`${rainModeDemoData.etaEstimates.length} estimates`}
                  />
                  <Chip label="LegalStoppingRule" value="assumed_valid_for_demo" />
                </ChipGrid>
              </Block>
              <Block title={copy.sections.pipeline}>
                <CompactList items={pipelineSteps} />
              </Block>
              <Block title={copy.sections.hardConstraints}>
                <CompactList
                  items={
                    selection.hardFilterResults.length > 0
                      ? selection.hardFilterResults.map((result) =>
                          `${result.pudoId}: ${
                            result.passed
                              ? copy.values.pass
                              : `${copy.values.rejected} (${result.failed.join(", ")})`
                          }`,
                        )
                      : [copy.values.noneRejected]
                  }
                />
              </Block>
              <div className="robotaxi-technical-panel__row robotaxi-technical-panel__row--2col">
                <Block title={copy.sections.walkingExposure}>
                  <CompactList
                    items={(selection.candidatesWithComputedMetrics ?? []).map(
                      (candidate) =>
                        `${candidate.debugId}: ${candidate.walkingDistanceM}m walk · ${candidate.rainExposedDistanceM}m exposed · ${Math.round((candidate.coveredRatio ?? 0) * 100)}% covered`,
                    )}
                  />
                </Block>
                <Block title={copy.sections.etaBoarding}>
                  <CompactList
                    items={(selection.candidatesWithComputedMetrics ?? []).map(
                      (candidate) => {
                        const pudoKey = candidate.id ?? candidate.pudo_id;
                        const eta = selection.etaByPudo[pudoKey];
                        return `${candidate.debugId}: ETA ${candidate.vehicleEtaMin ?? eta?.vehicle_eta_min ?? "n/a"}m · boarding ${candidate.estimatedBoardingTimeMin}m`;
                      },
                    )}
                  />
                </Block>
              </div>
              <div className="robotaxi-technical-panel__row robotaxi-technical-panel__row--2col">
                <Block title={copy.sections.parametersThresholds}>
                  <ChipGrid>
                    <Chip label="search radius" value="150 m" />
                    <Chip
                      label="boarding buffer"
                      value={`${rainModeDemoData.thresholds.boardingBufferMin} min`}
                    />
                    <Chip label="sheltered walk cap" value="1.5 × closest walk" />
                    <Chip label="sheltered ETA cap" value="fastest ETA + 3 min" />
                    <Chip label="exposure reduction" value="20 m" />
                  </ChipGrid>
                </Block>
                <Block title={copy.sections.weights}>
                  <p className="m-0 text-[11px] leading-snug text-stone-600">
                    {copy.sentences.weightsSummary
                      .replace(
                        "{rainExposure}",
                        String(rainModeDemoData.weights.rainExposure),
                      )
                      .replace(
                        "{shelter}",
                        String(rainModeDemoData.weights.shelterScore),
                      )
                      .replace(
                        "{coveredWalk}",
                        String(rainModeDemoData.weights.coveredWalking),
                      )
                      .replace("{eta}", String(rainModeDemoData.weights.vehicleEta))}
                  </p>
                </Block>
              </div>
              <Block title={copy.sections.formulas}>
                <div className="robotaxi-tech-formula-box">
                  covered distance = Σ segment length × coverage ratio
                  <br />
                  exposed distance = Σ segment length × (1 − coverage ratio)
                  <br />
                  boarding time = max(walk time, vehicle ETA) + buffer
                  <br />
                  rain comfort = shelter + covered + same-side + recognition −
                  exposure − walk − ETA − crossing
                </div>
              </Block>
              <Block title={copy.sections.comfortScore}>
                <MetricGrid stack>
                  {selection.scores.map((score) => (
                    <ScoreRow
                      key={score.pudoId}
                      label={formatScoreLabel(score.pudoId)}
                      value={`${score.rainComfortScore} score`}
                    />
                  ))}
                </MetricGrid>
              </Block>
              <Block title={copy.sections.computed}>
                <ChipGrid>
                  <Chip label="raw candidates" value={selection.rawCandidateCount} />
                  <Chip
                    label="valid after hard filter"
                    value={selection.validCandidateCount}
                  />
                  <Chip
                    variant="text"
                    label="Closest"
                    value={`${selection.closest?.debugId ?? "P1"} · min walking distance`}
                  />
                  <Chip
                    variant="text"
                    label="Sheltered"
                    value={`${selection.sheltered?.debugId ?? "P2"} · max rain comfort score`}
                  />
                  <Chip
                    variant="text"
                    label="Soonest"
                    value={`${selection.soonest?.debugId ?? "P3"} · min boarding time`}
                  />
                </ChipGrid>
                <MetricGrid stack>
                  {(selection.candidatesWithComputedMetrics ?? []).map(
                    (candidate) => (
                      <TechnicalMetricCard
                        key={candidate.debugId}
                        multiline
                        label={`${candidate.debugId} ${candidate.label}`}
                        value={`${candidate.walkingDistanceM}m walk · ${candidate.rainExposedDistanceM}m exposed · ${candidate.vehicleEtaMin}m ETA · ${candidate.estimatedBoardingTimeMin}m boarding · ${candidate.rainComfortScore} score`}
                      />
                    ),
                  )}
                </MetricGrid>
              </Block>
              <Block title={copy.sections.selectedDebug}>
                <div className="robotaxi-tech-debug-strip">
                  <strong>{selectedDebugLabel}</strong>
                  <span>{selectedDebugDetail}</span>
                  {selectedPickupMetrics ? (
                    <span>
                      {selectedPickupMetrics.walkingDistanceM}m walk ·{" "}
                      {selectedPickupMetrics.rainExposedDistanceM}m exposed ·{" "}
                      {selectedPickupMetrics.estimatedBoardingTimeMin}m boarding
                    </span>
                  ) : null}
                </div>
              </Block>
            </>
          ) : null}

          {stage === "pickupCoordination" ? (
            <>
              <Block title={copy.sections.input}>
                <ChipGrid>
                  <Chip
                    label="selected_pudo"
                    value={
                      pickupCoordinationState
                        ? `${pickupCoordinationState.selectedPickupLabel}`
                        : coordination.selectedPudoId
                    }
                  />
                  <Chip
                    label="passenger_walk"
                    value={
                      pickupCoordinationState
                        ? `${pickupCoordinationState.passengerWalkDistanceM} m`
                        : "n/a"
                    }
                  />
                  <Chip
                    label="vehicle_approach"
                    value={
                      pickupCoordinationState
                        ? `${pickupCoordinationState.vehicleDistanceKm} km`
                        : `${coordination.approachDistanceM} m`
                    }
                  />
                  <Chip
                    label="vehicle_eta"
                    value={
                      pickupCoordinationState
                        ? `${pickupCoordinationState.vehicleEtaMin} min`
                        : "n/a"
                    }
                  />
                  <Chip
                    label="route_confidence"
                    value={shelteredWalkingRoute?.route_confidence ?? "medium"}
                  />
                </ChipGrid>
              </Block>
              <Block title={copy.sections.method}>
                <CompactList items={coordinationSteps} />
              </Block>
              <div className="robotaxi-technical-panel__row robotaxi-technical-panel__row--2col">
                <Block title={copy.sections.parametersThresholds}>
                  <ChipGrid>
                    <Chip
                      label="geofence"
                      value={`${pickupCoordinationState?.debug.pickupGeofenceRadiusM ?? 25} m`}
                    />
                    <Chip
                      label="buffer"
                      value={`${pickupCoordinationState?.debug.boardingBufferMin ?? 0.5} min`}
                    />
                    <Chip
                      label="sync gap"
                      value={`${pickupCoordinationState?.debug.maxArrivalSyncGapMin ?? 5} min`}
                    />
                  </ChipGrid>
                </Block>
                <Block title={copy.sections.computed}>
                  <ChipGrid>
                    <Chip
                      label="exposed"
                      value={`${pickupCoordinationState?.rainExposedDistanceM ?? 15} m`}
                    />
                    <Chip
                      label="covered"
                      value={`${pickupCoordinationState?.coveredDistanceM ?? 45} m`}
                    />
                    <Chip
                      label="sync gap"
                      value={`${pickupCoordinationState?.arrivalSyncGapMin ?? 5} min`}
                    />
                    <Chip
                      label="validity"
                      value={pickupCoordinationState?.pickupValidity ?? "confirmed"}
                    />
                  </ChipGrid>
                  <p className="m-0 mt-2 text-[11px] leading-snug text-stone-600">
                    {copy.sentences.coordinationNote}
                  </p>
                </Block>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
