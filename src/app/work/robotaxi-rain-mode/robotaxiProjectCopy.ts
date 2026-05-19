import type { Lang } from "@/lib/portfolioCopy";

/** Main portfolio project title (case study hero, overview snapshot). */
export const ROBOTAXI_PROJECT_TITLE: Record<Lang, string> = {
  en: "Robotaxi Rain-aware Pickup Recommendation",
  zh: "Robotaxi 雨天感知上车点推荐",
};

/** Case-study subtitle under the main project title. */
export const ROBOTAXI_PROJECT_SUBTITLE: Record<Lang, string> = {
  en: "A PUDO selection prototype based on shelter exposure, walking cost, and vehicle ETA.",
  zh: "基于遮蔽暴露、步行成本与车辆 ETA 的 PUDO 选择原型。",
};

/** Browser metadata (English primary for SEO). */
export const ROBOTAXI_PROJECT_META = {
  title: "Robotaxi Rain-aware Pickup Recommendation",
  description:
    "An interactive prototype for rain-aware Robotaxi pickup recommendations across PUDO candidates, shelter exposure, walking cost, and vehicle ETA.",
} as const;

export const ROBOTAXI_PROJECT_EYEBROW: Record<Lang, string> = {
  en: "Product case · Robotaxi",
  zh: "产品案例 · Robotaxi",
};
