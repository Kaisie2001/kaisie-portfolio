/**
 * Visible deck copy for AeroRoute 3D (rendered UI only).
 * Editorial source: aeroroute-3d/website-copy.md
 */

import type { Lang } from "@/lib/portfolioCopy";

export type AeroRouteSlideCard = {
  title: string;
  body: string;
};

export type AeroRouteSlide = {
  id: string;
  number: string;
  label: string;
  layout: string;
  title: string;
  body: string;
  cards?: AeroRouteSlideCard[];
  tags?: string[];
  note?: string;
  sourceNote?: string;
};

const slidesEn: AeroRouteSlide[] = [
  {
    id: "hero",
    number: "00",
    label: "00 Hero",
    layout: "hero",
    title: "AeroRoute 3D",
    body: "A 3D route-readiness sandbox for dense-city drone delivery.",
    tags: [
      "Dense-city Drone Delivery",
      "Route Readiness",
      "3D Airspace Sandbox",
      "Pre-operation Assessment",
    ],
    sourceNote: "Pre-operation route assessment — not real-time flight control.",
  },
  {
    id: "industry-shift",
    number: "01",
    label: "01 Industry Shift",
    layout: "context",
    title: "From flight capability to route operations",
    body: "Routes must launch, run, and adjust in complex cities—not only prove a single flight works.",
    cards: [
      {
        title: "System operation",
        body: "Aircraft, stations, dispatch, and monitoring work as one system.",
      },
      {
        title: "Route launch",
        body: "Each corridor needs local feasibility checks before pilot operation.",
      },
      {
        title: "Operational reliability",
        body: "Can this route run repeatedly and explainably?",
      },
    ],
  },
  {
    id: "route-launch-challenges",
    number: "02",
    label: "02 Challenges",
    layout: "problem",
    title: "A launchable route is not the shortest path",
    body: "Candidate corridors must pass spatial, regulatory, device, weather, and operational checks before going live.",
    cards: [
      {
        title: "3D urban space",
        body: "Buildings, clearance, and restricted zones shape flyable corridors.",
      },
      {
        title: "Spec ≠ readiness",
        body: "Controlled-condition specs do not equal real-city operation.",
      },
      {
        title: "Weather strategy",
        body: "Extreme weather drives continue, reroute, pause, or validate—not only stop/fly.",
      },
    ],
  },
  {
    id: "target-users",
    number: "03",
    label: "03 Target Users",
    layout: "personas",
    title: "Route launch & operations strategy teams",
    body: "Teams decide launch, reroute, pause, node changes, or field validation—not individual pilots.",
    cards: [
      {
        title: "Route Launch Manager",
        body: "Is this corridor ready for pilot operation?",
      },
      {
        title: "Operations Strategy PM",
        body: "Compare baseline, safer, and balanced route options.",
      },
      {
        title: "Solution Consultant",
        body: "Explain feasibility to partners and internal stakeholders.",
      },
    ],
  },
  {
    id: "workflow-pain",
    number: "04",
    label: "04 Workflow Pain",
    layout: "pains",
    title: "The pain is decision fragmentation",
    body: "Maps, rules, weather, and site knowledge still need one route-level decision workflow.",
    cards: [
      {
        title: "Fragmented checks",
        body: "Buildings, zones, nodes, and weather are reviewed separately.",
      },
      {
        title: "Weak comparison",
        body: "Alternative corridors lack one consistent comparison logic.",
      },
      {
        title: "Unclear next step",
        body: "Teams need approve, reroute, pause, adjust, or validate guidance.",
      },
    ],
  },
  {
    id: "product-opportunity",
    number: "05",
    label: "05 Product Opportunity",
    layout: "opportunity",
    title: "Route readiness before launch",
    body: "A pre-operation assessment layer before live execution, monitoring, or enterprise dispatch.",
    cards: [
      {
        title: "Before execution",
        body: "Check feasibility before live operation.",
      },
      {
        title: "Before field validation",
        body: "Prioritize which corridors deserve site visits.",
      },
      {
        title: "Before risk escalation",
        body: "Prepare fallback routes for extreme scenarios.",
      },
    ],
  },
  {
    id: "candidate-landing-node-database",
    number: "06",
    label: "06 Candidate Nodes",
    layout: "data",
    title: "From landing points to a reusable node database",
    body: "The MVP structures candidate landing points as a filterable database, so route evaluation can scale from one corridor to multiple origin–destination pairs.",
    cards: [
      {
        title: "Structured nodes",
        body: "Each node stores type, altitude, area, clearance, access, and readiness fields.",
      },
      {
        title: "Batch evaluation",
        body: "Node pairs can be combined to screen multiple candidate corridors.",
      },
      {
        title: "PoC boundary",
        body: "Synthetic nodes are used to test the product logic, not to claim real vertiport access.",
      },
    ],
    sourceNote: "Synthetic candidate nodes support PoC route-pair evaluation.",
  },
  {
    id: "route-readiness-workflow",
    number: "07",
    label: "07 Workflow",
    layout: "opportunity",
    title: "From candidate nodes to recommendation",
    body: "Node selection, scenario testing, and route comparison in one workflow.",
    cards: [
      {
        title: "1. Select nodes",
        body: "Choose origin and destination from the node database.",
      },
      {
        title: "2. Generate routes",
        body: "Compare baseline, safety-first, and balanced corridors.",
      },
      {
        title: "3. Decide action",
        body: "Approve, reroute, pause, adjust node, or request field validation.",
      },
    ],
  },
  {
    id: "data-strategy",
    number: "08",
    label: "08 Data Strategy",
    layout: "data",
    title: "Real constraints · synthetic inputs",
    body: "Evidence-based spatial layers plus simulated PoC inputs—without claiming enterprise operations data.",
    cards: [
      {
        title: "Real constraints",
        body: "3D buildings, restricted zones, and base maps set hard limits.",
      },
      {
        title: "Thermal proxy",
        body: "Historical LST supports heat-scenario screening—not live updraft detection.",
      },
      {
        title: "Synthetic nodes",
        body: "Generated candidates support PoC evaluation—not live vertiports.",
      },
    ],
    sourceNote:
      "No real commercial vertiports, live telemetry, or real-time thermal updraft sensing.",
  },
  {
    id: "mvp-scope",
    number: "09",
    label: "09 MVP Scope",
    layout: "scope",
    title: "Pre-operation assessment only",
    body: "Evaluates candidate routes in a Hong Kong district—not flight control, dispatch, or regulatory approval.",
    cards: [
      {
        title: "Included",
        body: "3D sandbox · node database · zone screening · scenario testing · route comparison",
      },
      {
        title: "Excluded",
        body: "Live flight control · real-time updraft detection · CFD · enterprise dispatch · real vertiports",
      },
    ],
  },
  {
    id: "product-preview",
    number: "10",
    label: "10 Product Preview",
    layout: "preview",
    title: "Compare corridors before pilot operation",
    body: "Explore nodes, screen constraints, compare routes, and output a route-readiness recommendation.",
    cards: [
      {
        title: "3D sandbox",
        body: "View urban geometry and route alternatives.",
      },
      {
        title: "Node explorer",
        body: "Filter nodes by readiness and suitability.",
      },
      {
        title: "Route comparison",
        body: "Compare baseline, safer, and balanced corridors.",
      },
      {
        title: "Decision output",
        body: "Approve, reroute, pause, adjust node, or request validation.",
      },
    ],
    sourceNote: "Product preview — not live drone dispatch.",
  },
];

const slidesZh: AeroRouteSlide[] = [
  {
    id: "hero",
    number: "00",
    label: "00 开篇",
    layout: "hero",
    title: "AeroRoute 3D",
    body: "面向高密度城市无人机配送的航线可运营性评估沙盘。",
    tags: ["高密度城市配送", "航线可运营性", "三维低空沙盘", "开线前评估"],
    sourceNote: "开线前航线评估——非实时飞控。",
  },
  {
    id: "industry-shift",
    number: "01",
    label: "01 行业变化",
    layout: "context",
    title: "从能飞到能运营",
    body: "关键问题变成航线能否在城市里开通、运行与调整——而不只是单次飞行是否成功。",
    cards: [
      { title: "系统运营", body: "飞行器、站点、调度与监控构成完整系统。" },
      { title: "航线开通", body: "每条走廊开线前都要做本地可行性判断。" },
      { title: "运营可靠性", body: "这条航线能否稳定、可解释地重复运行？" },
    ],
  },
  {
    id: "route-launch-challenges",
    number: "02",
    label: "02 开线挑战",
    layout: "problem",
    title: "可开通的航线不是最短路",
    body: "候选走廊上线前，必须通过空间、监管、设备、天气与运营五类检查。",
    cards: [
      { title: "三维城市空间", body: "建筑、净空与禁飞区共同塑造可飞走廊。" },
      { title: "参数≠可运营", body: "实验室指标不能直接代表真实城市运营。" },
      { title: "天气策略", body: "极端天气对应继续、绕行、暂停或现场验证。" },
    ],
  },
  {
    id: "target-users",
    number: "03",
    label: "03 目标用户",
    layout: "personas",
    title: "城市开线与运营策略团队",
    body: "决定开通、绕行、暂停、调整起降点或现场验证——不是飞手个人。",
    cards: [
      { title: "开线负责人", body: "这条走廊能否进入试点运营？" },
      { title: "运营策略 PM", body: "比较基础、安全优先与平衡航线。" },
      { title: "方案顾问", body: "向合作方与内部解释可行性。" },
    ],
  },
  {
    id: "workflow-pain",
    number: "04",
    label: "04 流程痛点",
    layout: "pains",
    title: "痛点是决策割裂",
    body: "地图、规则、天气与现场经验需要汇成一条清晰的航线级判断。",
    cards: [
      { title: "信息割裂", body: "建筑、禁飞区、节点与天气分开核对。" },
      { title: "对比困难", body: "候选走廊缺少统一的比较逻辑。" },
      { title: "动作不清", body: "需要开通、绕行、暂停、调整或验证建议。" },
    ],
  },
  {
    id: "product-opportunity",
    number: "05",
    label: "05 产品机会",
    layout: "opportunity",
    title: "开线前的航线可运营性",
    body: "在正式执行、监控与企业调度之前，增加一层开线前评估。",
    cards: [
      { title: "上线前", body: "在正式运营前验证可行性。" },
      { title: "踏勘前", body: "优先安排值得现场核查的走廊。" },
      { title: "风险升级前", body: "为极端情景准备替代走廊。" },
    ],
  },
  {
    id: "candidate-landing-node-database",
    number: "06",
    label: "06 候选起降点库",
    layout: "data",
    title: "从单次点位设定，到可复用的候选起降点数据库",
    body: "MVP 将候选起降点整理为可筛选、可评分、可组合的数据层，使航线评估可以从单条路线扩展到多组 O-D 组合。",
    cards: [
      {
        title: "结构化节点",
        body: "每个节点包含类型、高度、面积、净空、可达性和 readiness 等字段。",
      },
      {
        title: "批量评估",
        body: "节点之间可以组合生成多组 O-D 航线，用于候选航线筛查。",
      },
      {
        title: "PoC 边界",
        body: "模拟节点用于验证产品逻辑，不代表真实商业起降点数据。",
      },
    ],
    sourceNote: "候选起降点数据库用于 PoC 航线组合评估，不代表真实商业部署数据。",
  },
  {
    id: "route-readiness-workflow",
    number: "07",
    label: "07 评估流程",
    layout: "opportunity",
    title: "从候选节点到运营建议",
    body: "选点、情景测试与航线对比合为一条决策流程。",
    cards: [
      { title: "1. 选择节点", body: "从候选起降点库选择起终点。" },
      { title: "2. 生成航线", body: "对比基础、安全优先与平衡走廊。" },
      { title: "3. 输出建议", body: "建议开通、绕行、暂停、调整或现场验证。" },
    ],
  },
  {
    id: "data-strategy",
    number: "08",
    label: "08 数据策略",
    layout: "data",
    title: "真实约束 · 模拟输入",
    body: "空间证据层与 PoC 模拟输入分离——不声称拥有企业级运营数据。",
    cards: [
      { title: "真实图层", body: "三维建筑、禁飞区与底图划定硬约束。" },
      { title: "热感性代理", body: "历史 LST 支持高温情景筛查——非实时热气流检测。" },
      { title: "合成节点", body: "生成候选点支持 PoC——非真实 vertiport。" },
    ],
    sourceNote: "无真实商业 vertiport、实时遥测或实时热气流感知。",
  },
  {
    id: "mvp-scope",
    number: "09",
    label: "09 MVP 范围",
    layout: "scope",
    title: "仅做开线前评估",
    body: "评估香港样本区候选航线——不替代飞控、调度或监管审批系统。",
    cards: [
      {
        title: "纳入",
        body: "3D 沙盘 · 起降点库 · 禁飞筛查 · 情景测试 · 航线对比",
      },
      {
        title: "不纳入",
        body: "实时飞控 · 实时热气流探测 · CFD · 企业调度 · 真实 vertiport",
      },
    ],
  },
  {
    id: "product-preview",
    number: "10",
    label: "10 产品预览",
    layout: "preview",
    title: "试点运营前的走廊比较",
    body: "探索节点、筛查约束、对比航线并输出可运营性建议。",
    cards: [
      { title: "3D 沙盘", body: "查看城市空间与航线方案。" },
      { title: "节点浏览", body: "按 readiness 与适配度筛选候选点。" },
      { title: "航线对比", body: "比较基础、安全优先与平衡走廊。" },
      { title: "运营建议", body: "开通、绕行、暂停、调整或建议验证。" },
    ],
    sourceNote: "产品预览——非实时无人机调度。",
  },
];

export const aeroRouteSlidesByLang: Record<Lang, AeroRouteSlide[]> = {
  en: slidesEn,
  zh: slidesZh,
};

export function getAeroRouteSlides(lang: Lang): AeroRouteSlide[] {
  return aeroRouteSlidesByLang[lang];
}

/** Default export for EN deck generation scripts */
export const aeroRouteSlides: AeroRouteSlide[] = slidesEn;
