import type { ReactNode } from "react";
import type { Lang } from "@/lib/portfolioCopy";
import type { FigmaScreen } from "../figma-shell/types";
import { rainModeDemoData } from "../data/rainModeDemoData";
import type { PudoCandidate, TechnicalStage } from "../data/types";
import { buildRainModeContext } from "../engine/contextTrigger";
import { evaluateServiceGate } from "../engine/serviceGate";
import { HARD_CONSTRAINTS } from "../engine/hardFilter";
import { selectPickupOptions } from "../engine/selectPickupOptions";
import { planPickupCoordination } from "../engine/pickupCoordination";

type Props = {
  screen: FigmaScreen;
  lang: Lang;
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

function formatPudoLabel(candidate: PudoCandidate, lang: Lang) {
  return lang === "zh"
    ? candidate.label_zh
    : candidate.label_en ?? candidate.label ?? candidate.pudo_id;
}

function candidateById(id: string) {
  return rainModeDemoData.pudoCandidates.find((candidate) => {
    return (candidate.id ?? candidate.pudo_id) === id;
  });
}

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

export function TechnicalEnginePanel({ screen, lang }: Props) {
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
    rainModeDemoData.thresholds,
    rainModeDemoData.weights,
  );
  const coordination = planPickupCoordination(
    selection,
    rainModeDemoData.vehicleApproachRoutes,
    rainModeDemoData.operationNotices,
  );
  const stage =
    screen >= 1 && screen <= 4
      ? TECHNICAL_STAGE_BY_SCREEN[screen as 1 | 2 | 3 | 4]
      : TECHNICAL_STAGE_BY_SCREEN[1];
  const selectedCandidate = candidateById(coordination.selectedPudoId);

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
                  label={copy.labels.rawCandidates}
                  value={selection.rawCandidateCount}
                />
                <Metric
                  label={copy.labels.afterHardFilter}
                  value={selection.validCandidateCount}
                />
              </div>
            </Section>
            <Section title={copy.sections.hardConstraints}>
              <p className="m-0">
                {HARD_CONSTRAINTS.join(" · ")}
              </p>
              {selection.rejectedCandidates.length > 0 ? (
                <ul className="m-0 mt-2 space-y-1 p-0">
                  {selection.rejectedCandidates.map((item) => (
                    <li key={item.pudoId} className="list-none">
                      <strong>{item.pudoId}</strong>{" "}
                      {copy.sentences.hardRejectedPrefix}{" "}
                      {item.failed.join(", ")}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 mt-2">{copy.values.noneRejected}</p>
              )}
            </Section>
            <Section title={copy.sections.walkingExposure}>
              <div className="grid gap-2">
                {Object.entries(selection.exposureByPudo).map(([pudoId, exposure]) => (
                  <Metric
                    key={pudoId}
                    label={pudoId}
                    value={`${exposure.walkingDistanceM}m ${copy.values.walk} · ${exposure.rainExposedWalkingDistanceM}m ${copy.values.exposed} · ${Math.round(exposure.exposureRatio * 100)}% ${copy.values.exposure}`}
                  />
                ))}
              </div>
            </Section>
            <Section title={copy.sections.etaBoarding}>
              <div className="grid gap-2">
                {Object.entries(selection.etaByPudo).map(([pudoId, eta]) => (
                  <Metric
                    key={pudoId}
                    label={pudoId}
                    value={`${eta.vehicle_eta_min}m ${copy.values.eta} · ${eta.estimated_boarding_time_min}m ${copy.values.boarding}`}
                  />
                ))}
              </div>
            </Section>
            <Section title={copy.sections.weights}>
              <p className="m-0">
                {copy.sentences.weights
                  .replace(
                    "{rainExposure}",
                    String(rainModeDemoData.weights.rainExposure),
                  )
                  .replace("{shelter}", String(rainModeDemoData.weights.shelterScore))
                  .replace(
                    "{coveredWalk}",
                    String(rainModeDemoData.weights.coveredWalking),
                  )
                  .replace("{eta}", String(rainModeDemoData.weights.vehicleEta))}
              </p>
            </Section>
            <Section title={copy.sections.comfortScore}>
              <div className="grid gap-2">
                {selection.scores.map((score) => (
                  <Metric
                    key={score.pudoId}
                    label={score.pudoId}
                    value={`${score.rainComfortScore}/100 ${copy.values.comfort} · ${score.weightedScore} ${copy.values.weighted}`}
                  />
                ))}
              </div>
            </Section>
            <Section title={copy.sections.computed}>
              {copy.values.closest}: <strong>{selection.selections.closest}</strong>
              <br />
              {copy.values.sheltered}: <strong>{selection.selections.sheltered}</strong>
              <br />
              {copy.values.soonest}: <strong>{selection.selections.soonest}</strong>
              <br />
              {copy.values.recommended}:{" "}
              <strong>{selection.selections.recommended}</strong>
            </Section>
          </>
        ) : null}

        {stage === "pickupCoordination" ? (
          <>
            <Section title={copy.sections.input}>
              <div className="grid gap-2">
                <Metric
                  label={copy.labels.selectedPudo}
                  value={
                    selectedCandidate
                      ? formatPudoLabel(selectedCandidate, lang)
                      : coordination.selectedPudoId
                  }
                />
                <Metric label={copy.labels.vehicle} value={coordination.vehicleId} />
              </div>
            </Section>
            <Section title={copy.sections.method}>
              {copy.sentences.coordinationMethod}
            </Section>
            <Section title={copy.sections.parametersThresholds}>
              {copy.sentences.boardingBuffer}{" "}
              <strong>{rainModeDemoData.thresholds.boardingBufferMin} min</strong>
            </Section>
            <Section title={copy.sections.computed}>
              {copy.sentences.approachRoute}{" "}
              <strong>{coordination.approachDistanceM}m</strong>{" "}
              {copy.sentences.across}{" "}
              <strong>{coordination.approachPointCount}</strong>{" "}
              {copy.values.routePoints}
              <br />
              {copy.sentences.passengerInstruction}
              {coordination.operationNotice ? (
                <>
                  <br />
                  {copy.values.notice}:{" "}
                  <strong>
                    {lang === "zh"
                      ? coordination.operationNotice.title_zh
                      : coordination.operationNotice.title_en}
                  </strong>
                </>
              ) : null}
            </Section>
          </>
        ) : null}
      </div>
    </aside>
  );
}
