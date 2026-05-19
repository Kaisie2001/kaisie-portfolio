import type { Lang } from "@/lib/portfolioCopy";

export type GuidedDemoStepId = 1 | 2 | 3 | 4;

export type GuidedWalkthroughStep = {
  id: GuidedDemoStepId;
  tabLabel: string;
  title: string;
  copy: string;
};

export const GUIDED_DEMO_SECTION_TITLE: Record<Lang, string> = {
  en: "Guided Demo",
  zh: "流程演示",
};

export const GUIDED_DEMO_SECTION_SUBTITLE: Record<Lang, string> = {
  en: "A quick visual walkthrough of how rain-aware pickup recommendations work across key screens.",
  zh: "通过几个关键界面，快速展示雨天条件下 Robotaxi 上车点推荐如何运作。",
};

export const PROTOTYPE_SECTION_TITLE: Record<Lang, string> = {
  en: "Try the Interactive Prototype",
  zh: "体验可交互原型",
};

export const PROTOTYPE_SECTION_COPY: Record<Lang, string> = {
  en: "This section combines an interactive demo with technical explanation, showing how Robotaxi generates, filters, and recommends more suitable pickup points under rainy conditions.",
  zh: "这一部分将交互演示与技术说明结合起来，展示雨天条件下 Robotaxi 如何生成、筛选并推荐更合理的上车点。",
};

export const PROTOTYPE_SECTION_DISCLAIMER: Record<Lang, string> = {
  en: "Note: This prototype uses structured simulated data for portfolio demonstration. Pickup zones, shelter exposure, routes, and vehicle states are used to illustrate the system logic rather than represent real Robotaxi operations.",
  zh: "注：本原型使用结构化模拟数据进行作品集展示。上车点、遮蔽暴露、路线和车辆状态用于说明系统逻辑，不代表真实 Robotaxi 运营数据。",
};

export const GUIDED_WALKTHROUGH_STEPS: Record<Lang, GuidedWalkthroughStep[]> = {
  en: [
    {
      id: 1,
      tabLabel: "01 Set trip",
      title: "Set trip context",
      copy: "The user sets pickup and drop-off to start planning.",
    },
    {
      id: 2,
      tabLabel: "02 Compare",
      title: "Compare pickup options",
      copy: "The app compares valid pickup zones by walking distance, rain exposure, and vehicle ETA.",
    },
    {
      id: 3,
      tabLabel: "03 Search",
      title: "Search nearby vehicles",
      copy: "After confirmation, the system searches nearby Robotaxis and estimates wait time.",
    },
    {
      id: 4,
      tabLabel: "04 On the way",
      title: "Vehicle on the way",
      copy: "The final screen shows vehicle approach, walking guidance, and remaining rain exposure.",
    },
  ],
  zh: [
    {
      id: 1,
      tabLabel: "01 设置行程",
      title: "设置行程",
      copy: "用户选择出发参考位置和目的地。",
    },
    {
      id: 2,
      tabLabel: "02 比较方案",
      title: "比较上车方案",
      copy: "系统根据步行距离、雨中暴露和车辆到达时间比较不同上车区域。",
    },
    {
      id: 3,
      tabLabel: "03 搜索车辆",
      title: "搜索附近车辆",
      copy: "用户确认上车区域后，系统搜索附近车辆并估算等待时间。",
    },
    {
      id: 4,
      tabLabel: "04 车辆前往",
      title: "车辆前往中",
      copy: "最终页面展示车辆接近路线、步行指引和剩余雨中暴露距离。",
    },
  ],
};
