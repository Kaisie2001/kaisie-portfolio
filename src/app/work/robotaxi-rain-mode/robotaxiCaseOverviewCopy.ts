import type { Lang } from "@/lib/portfolioCopy";
import {
  ROBOTAXI_PROJECT_SUBTITLE,
  ROBOTAXI_PROJECT_TITLE,
} from "./robotaxiProjectCopy";

export type CaseOverviewTabId = "snapshot" | "problem" | "logic";

type FlowCard = {
  title: string;
  description: string;
};

type CaseOverviewTab = {
  id: CaseOverviewTabId;
  tabLabel: string;
  eyebrow: string;
  title: string | string[];
  oneLiner: string;
  keywords?: string[];
  flowCards?: FlowCard[];
};

export const CASE_OVERVIEW_TABS: Record<Lang, CaseOverviewTab[]> = {
  en: [
    {
      id: "snapshot",
      tabLabel: "Snapshot",
      eyebrow: "Project Snapshot",
      title: ROBOTAXI_PROJECT_TITLE.en,
      oneLiner: ROBOTAXI_PROJECT_SUBTITLE.en,
      keywords: ["Valid pickup zones", "Rain exposure", "Vehicle ETA"],
    },
    {
      id: "problem",
      tabLabel: "Problem & Insight",
      eyebrow: "Problem & Insight",
      title: ["Curbside Constraint vs.", "Rainy-Day Comfort"],
      oneLiner:
        "Robotaxis need valid roadside zones, while passengers want less rain exposure.",
      keywords: ["Roadside boarding", "Shelter proximity", "Less exposed walk"],
    },
    {
      id: "logic",
      tabLabel: "Product Logic",
      eyebrow: "Product Logic",
      title: "From starting place to pickup decision",
      oneLiner:
        "The system turns a user's starting place into a valid, rain-aware pickup choice.",
      flowCards: [
        { title: "Anchor", description: "Where the user wants to start" },
        {
          title: "Roadside Candidates",
          description: "Valid curbside pickup zones nearby",
        },
        {
          title: "Rain-aware Scoring",
          description: "Walk distance · exposure · ETA",
        },
        {
          title: "Dispatch",
          description: "Send the vehicle to the selected zone",
        },
      ],
    },
  ],
  zh: [
    {
      id: "snapshot",
      tabLabel: "项目概览",
      eyebrow: "项目概览",
      title: ROBOTAXI_PROJECT_TITLE.zh,
      oneLiner: ROBOTAXI_PROJECT_SUBTITLE.zh,
      keywords: ["合法上车区域", "雨中暴露", "车辆到达时间"],
    },
    {
      id: "problem",
      tabLabel: "问题与洞察",
      eyebrow: "问题与洞察",
      title: "路侧停靠约束 vs. 雨天上车体验",
      oneLiner: "Robotaxi 需要合法路侧停靠，用户则希望减少雨中暴露。",
      keywords: ["路侧上车", "邻近遮蔽", "少淋雨步行"],
    },
    {
      id: "logic",
      tabLabel: "产品逻辑",
      eyebrow: "产品逻辑",
      title: "从出发位置到上车决策",
      oneLiner: "系统将用户的出发位置转化为合法、雨天友好的上车选择。",
      flowCards: [
        { title: "出发位置", description: "用户希望从哪里出发" },
        { title: "路侧候选区", description: "附近可用的合法上车区域" },
        { title: "雨天评分", description: "步行距离 · 雨中暴露 · ETA" },
        { title: "调度车辆", description: "将车辆派往选定上车区域" },
      ],
    },
  ],
};
