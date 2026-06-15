import type { Lang } from "@/lib/portfolioCopy";
import type { ExecutionActionId, ParsedIntent, PoiCategory } from "./types";

export const DEMO_COPY: Record<
  Lang,
  {
    eyebrow: string;
    title: string;
    disclaimer: string;
    goalLabel: string;
    goalPlaceholder: string;
    planButton: string;
    intentTitle: string;
    mainPlanTitle: string;
    timelineTitle: string;
    fallbacksTitle: string;
    executeTitle: string;
    executeNote: string;
    backLink: string;
    intentLabels: Record<keyof ParsedIntent, string>;
    categoryLabels: Record<PoiCategory, string>;
    executionActions: Record<ExecutionActionId, string>;
    simulated: string;
  }
> = {
  en: {
    eyebrow: "Interactive prototype · Mock data",
    title: "Local-life Planning Agent Demo",
    disclaimer:
      "Simulated Meituan-style planning flow. No real bookings or payments.",
    goalLabel: "Goal input",
    goalPlaceholder: "Describe your local-life outing in one sentence…",
    planButton: "Generate plan",
    intentTitle: "Intent summary",
    mainPlanTitle: "Main plan",
    timelineTitle: "Route timeline",
    fallbacksTitle: "Fallback plans",
    executeTitle: "Execution simulation",
    executeNote: "Preview booking, ordering, ticketing, and share actions.",
    backLink: "← Back to case study",
    intentLabels: {
      time: "Time",
      group: "Group",
      budget: "Budget",
      foodPreference: "Food",
      activityPreference: "Activity",
      mobility: "Mobility",
    },
    categoryLabels: {
      activity: "Activity",
      food: "Food",
      optional: "Optional",
    },
    executionActions: {
      reserve: "Reserve table",
      order: "Place group order",
      ticket: "Hold ticket",
      share: "Share plan",
    },
    simulated: "Simulated",
  },
  zh: {
    eyebrow: "交互原型 · 模拟数据",
    title: "本地生活规划 Agent Demo",
    disclaimer: "美团风格规划流程演示，不涉及真实订位或支付。",
    goalLabel: "目标输入",
    goalPlaceholder: "用一句话描述这次本地生活出行…",
    planButton: "生成方案",
    intentTitle: "意图摘要",
    mainPlanTitle: "主方案",
    timelineTitle: "路线时间轴",
    fallbacksTitle: "备选方案",
    executeTitle: "执行模拟",
    executeNote: "预览订位、下单、购票与分享动作。",
    backLink: "← 返回案例页",
    intentLabels: {
      time: "时间",
      group: "人群",
      budget: "预算",
      foodPreference: "饮食",
      activityPreference: "活动",
      mobility: "出行",
    },
    categoryLabels: {
      activity: "活动",
      food: "餐饮",
      optional: "可选",
    },
    executionActions: {
      reserve: "订位",
      order: "团购下单",
      ticket: "锁票",
      share: "分享方案",
    },
    simulated: "已模拟",
  },
};
