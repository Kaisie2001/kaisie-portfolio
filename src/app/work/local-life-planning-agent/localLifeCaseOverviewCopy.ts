import type { Lang } from "@/lib/portfolioCopy";

export type LocalLifeCaseOverviewTabId = "snapshot" | "productFlow" | "agentLogic";

export type LocalLifeCaseOverviewTab = {
  id: LocalLifeCaseOverviewTabId;
  tabLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: readonly [string, string, string, string];
};

export const LOCAL_LIFE_CASE_OVERVIEW_LABEL: Record<Lang, string> = {
  en: "Case Overview",
  zh: "案例概览",
};

export const LOCAL_LIFE_CASE_OVERVIEW_TABS: Record<
  Lang,
  LocalLifeCaseOverviewTab[]
> = {
  en: [
    {
      id: "snapshot",
      tabLabel: "Snapshot",
      eyebrow: "Snapshot",
      title: "From search to executable local plans",
      subtitle:
        "A Meituan-inspired planning agent that converts one local-life goal into a route-based plan with POI choices, fallback options, and booking-ready actions.",
      items: [
        "Scenario · Short local-life planning",
        "Input · One natural-language goal",
        "Output · Main plan + fallback plans",
        "Execution · Booking / ordering / sharing simulation",
      ],
    },
    {
      id: "productFlow",
      tabLabel: "Product Flow",
      eyebrow: "Product Flow",
      title: "How the product experience works",
      subtitle:
        "The interface turns a vague request into a structured plan users can review, adjust, and execute.",
      items: [
        "Goal input",
        "Intent summary",
        "Route timeline",
        "Confirm & execute",
      ],
    },
    {
      id: "agentLogic",
      tabLabel: "Agent Logic",
      eyebrow: "Agent Logic",
      title: "How the agent builds the plan",
      subtitle:
        "The agent uses a tool chain to parse constraints, score POIs, assemble a route, and prepare fallback actions.",
      items: [
        "Parse intent",
        "Score POIs",
        "Assemble route",
        "Simulate execution",
      ],
    },
  ],
  zh: [
    {
      id: "snapshot",
      tabLabel: "概览",
      eyebrow: "项目概览",
      title: "从搜索推荐到可执行方案",
      subtitle:
        "一个美团本地生活规划 Agent，将一句模糊目标转化为路线、POI 组合、备选方案和可执行动作。",
      items: [
        "场景 · 短时本地生活规划",
        "输入 · 一句自然语言目标",
        "输出 · 主方案 + 备选方案",
        "执行 · 订位 / 下单 / 分享模拟",
      ],
    },
    {
      id: "productFlow",
      tabLabel: "产品流程",
      eyebrow: "产品流程",
      title: "产品体验如何运转",
      subtitle: "界面将模糊需求转化为用户可以查看、调整并确认执行的结构化方案。",
      items: ["输入目标", "意图摘要", "路线时间轴", "确认并执行"],
    },
    {
      id: "agentLogic",
      tabLabel: "Agent 逻辑",
      eyebrow: "Agent 逻辑",
      title: "Agent 如何生成方案",
      subtitle:
        "Agent 通过工具链解析约束、匹配 POI、组合路线，并准备执行与备选动作。",
      items: ["解析意图", "POI 打分", "组合路线", "模拟执行"],
    },
  ],
};
