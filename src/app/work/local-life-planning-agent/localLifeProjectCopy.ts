import type { Lang } from "@/lib/portfolioCopy";

export const LOCAL_LIFE_PROJECT_TITLE: Record<Lang, string> = {
  en: "Local-life Planning Agent",
  zh: "本地生活规划 Agent",
};

export const LOCAL_LIFE_PROJECT_SUBTITLE: Record<Lang, string> = {
  en: "A Meituan-inspired goal-to-execution agent that turns a natural-language local-life goal into route-based plans with POI matching, fallback handling, and booking simulation.",
  zh: "美团风格的目标驱动 Agent：将自然语言本地生活需求转化为含 POI 匹配、异常回退与订位/下单模拟的可执行路线方案。",
};

export const LOCAL_LIFE_PROJECT_META = {
  title: "Local-life Planning Agent",
  description:
    "A Meituan-inspired AI agent prototype for short local-life activity planning—from intent parsing and POI matching to route assembly and execution simulation.",
} as const;

export const LOCAL_LIFE_PROJECT_EYEBROW: Record<Lang, string> = {
  en: "Product case · AI Agent",
  zh: "产品案例 · AI Agent",
};
