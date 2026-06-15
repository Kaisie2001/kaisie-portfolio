import type { Lang } from "@/lib/portfolioCopy";

export const LOCAL_LIFE_PROJECT_TITLE: Record<Lang, string> = {
  en: "Meituan Local-life Planning Agent",
  zh: "美团本地生活规划 Agent",
};

export const LOCAL_LIFE_PROJECT_SUBTITLE: Record<Lang, string> = {
  en: "One local-life sentence in—a route, POI lineup, and booking-ready half-day plan out.",
  zh: "一句话说明想要什么，输出路线、点位组合和可直接预订的半日安排。",
};

export const LOCAL_LIFE_PROJECT_META = {
  title: "Meituan Local-life Planning Agent",
  description:
    "Meituan-inspired hackathon prototype: turn one sentence into a Saturday route—photogenic spots, dinner, fallbacks, and simulated booking.",
} as const;

export const LOCAL_LIFE_PROJECT_EYEBROW: Record<Lang, string> = {
  en: "Hackathon prototype · Meituan local-life",
  zh: "黑客松原型 · 美团本地生活",
};

export const LOCAL_LIFE_EXAMPLE_GOAL: Record<Lang, string> = {
  en: "Plan a Saturday afternoon with friends: photogenic, not too expensive, dinner included.",
  zh: "周六下午和朋友出门，想拍照、别太贵，还要吃晚饭。",
};
