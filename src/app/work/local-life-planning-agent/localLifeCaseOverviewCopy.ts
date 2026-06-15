import type { Lang } from "@/lib/portfolioCopy";
import {
  LOCAL_LIFE_PROJECT_SUBTITLE,
  LOCAL_LIFE_PROJECT_TITLE,
} from "./localLifeProjectCopy";

export type LocalLifeCaseOverviewTabId = "snapshot" | "problem" | "flow";

type FlowCard = {
  title: string;
  description: string;
};

type CaseOverviewTab = {
  id: LocalLifeCaseOverviewTabId;
  tabLabel: string;
  eyebrow: string;
  title: string | string[];
  oneLiner: string;
  keywords?: string[];
  flowCards?: FlowCard[];
};

export const LOCAL_LIFE_CASE_OVERVIEW_TABS: Record<Lang, CaseOverviewTab[]> = {
  en: [
    {
      id: "snapshot",
      tabLabel: "Snapshot",
      eyebrow: "Project Overview",
      title: LOCAL_LIFE_PROJECT_TITLE.en,
      oneLiner: LOCAL_LIFE_PROJECT_SUBTITLE.en,
      keywords: ["AI Agent", "POI Matching", "Route Planning", "Execution Flow"],
    },
    {
      id: "problem",
      tabLabel: "Problem & Goal",
      eyebrow: "Problem & Product Goal",
      title: ["From recommendation lists", "to executable plans"],
      oneLiner:
        "Local-life platforms surface separate restaurant and activity lists, but users need one plan—where to go, in what order, within a time window, with booking or ordering ready to execute.",
      keywords: ["Recommendation gap", "Time window", "Goal-to-execution"],
    },
    {
      id: "flow",
      tabLabel: "User Flow",
      eyebrow: "User Flow",
      title: "Input to confirm and execute",
      oneLiner:
        "The user states a goal, clarifies constraints, reviews a main plan and fallbacks, then confirms execution actions.",
      flowCards: [
        { title: "Input", description: "Natural-language goal and context" },
        {
          title: "Clarification",
          description: "Budget, time, group, and preference constraints",
        },
        { title: "Main Plan", description: "Route-based itinerary with POIs" },
        {
          title: "Fallback Plans",
          description: "Alternatives when booking or timing fails",
        },
        {
          title: "Confirm & Execute",
          description: "Book, order, share, or adjust the plan",
        },
      ],
    },
  ],
  zh: [
    {
      id: "snapshot",
      tabLabel: "项目概览",
      eyebrow: "项目概览",
      title: LOCAL_LIFE_PROJECT_TITLE.zh,
      oneLiner: LOCAL_LIFE_PROJECT_SUBTITLE.zh,
      keywords: ["AI Agent", "POI 匹配", "路线规划", "执行流程"],
    },
    {
      id: "problem",
      tabLabel: "问题与目标",
      eyebrow: "问题与产品目标",
      title: "从推荐列表到可执行方案",
      oneLiner:
        "本地生活平台通常分别推荐餐厅与活动，但用户需要的是完整计划：去哪、顺序如何、是否落在时间窗内，以及订位/下单能否立即执行。",
      keywords: ["推荐缺口", "时间窗口", "目标到执行"],
    },
    {
      id: "flow",
      tabLabel: "用户流程",
      eyebrow: "用户流程",
      title: "从输入到确认执行",
      oneLiner:
        "用户输入目标、澄清约束、查看主方案与备选，再确认订位/下单等执行动作。",
      flowCards: [
        { title: "输入", description: "自然语言目标与场景上下文" },
        { title: "澄清", description: "预算、时间、人数与偏好约束" },
        { title: "主方案", description: "含 POI 的路线化行程" },
        { title: "备选方案", description: "订位失败或超时的替代选项" },
        { title: "确认执行", description: "订位、下单、分享或调整方案" },
      ],
    },
  ],
};
