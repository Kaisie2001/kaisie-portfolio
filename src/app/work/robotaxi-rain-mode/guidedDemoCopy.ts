import type { Lang } from "@/lib/portfolioCopy";

export type GuidedDemoStep = {
  /** Short label on step tab */
  tabLabel: string;
  title: string;
  copy: string;
};

export const GUIDED_DEMO_SECTION_TITLE: Record<Lang, string> = {
  en: "Guided Interactive Demo",
  zh: "交互式流程演示",
};

export const GUIDED_DEMO_SECTION_EYEBROW: Record<Lang, string> = {
  en: "Guided demo",
  zh: "流程演示",
};

export const GUIDED_DEMO_SECTION_LEDE: Record<Lang, string> = {
  en: "Four steps above the prototype — tap a tab to read the intent (demo stays interactive).",
  zh: "原型上方四步说明 — 点击标签查看意图（手机演示仍可自由操作）。",
};

export const GUIDED_DEMO_STEPS: Record<Lang, GuidedDemoStep[]> = {
  en: [
    {
      tabLabel: "Set trip",
      title: "Set trip context",
      copy: "Set pickup and drop-off to start planning.",
    },
    {
      tabLabel: "Compare",
      title: "Compare pickup options",
      copy: "Compare valid pickup zones by walking distance, rain exposure, and vehicle ETA.",
    },
    {
      tabLabel: "Search",
      title: "Search nearby vehicles",
      copy: "Search nearby Robotaxis and estimate wait time.",
    },
    {
      tabLabel: "En route",
      title: "Vehicle on the way",
      copy: "Show vehicle approach and walking guidance.",
    },
  ],
  zh: [
    {
      tabLabel: "设行程",
      title: "设置出发与目的地",
      copy: "选择出发参考位置和目的地。",
    },
    {
      tabLabel: "比方案",
      title: "比较上车方案",
      copy: "根据步行距离、雨中暴露和车辆到达时间比较不同上车区域。",
    },
    {
      tabLabel: "搜车辆",
      title: "搜索附近车辆",
      copy: "搜索附近车辆并估算等待时间。",
    },
    {
      tabLabel: "前往中",
      title: "车辆前往中",
      copy: "展示车辆接近路线和步行指引。",
    },
  ],
};
