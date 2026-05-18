import type { Lang } from "@/lib/portfolioCopy";

export type GuidedWalkthroughStep = {
  tabLabel: string;
  title: string;
  copy: string;
  imageSrc: string;
  imageAlt: Record<Lang, string>;
};

export const GUIDED_DEMO_SECTION_TITLE: Record<Lang, string> = {
  en: "Guided Demo",
  zh: "流程演示",
};

export const GUIDED_DEMO_SECTION_SUBTITLE: Record<Lang, string> = {
  en: "A quick visual walkthrough of how Rain Mode supports rainy-day Robotaxi pickup decisions.",
  zh: "通过几个关键界面，快速展示 Rain Mode 如何辅助雨天 Robotaxi 上车决策。",
};

export const PROTOTYPE_SECTION_TITLE: Record<Lang, string> = {
  en: "Try the Interactive Prototype",
  zh: "体验可交互原型",
};

export const PROTOTYPE_SECTION_COPY: Record<Lang, string> = {
  en: "This coded prototype uses interactive map layers and simulated Robotaxi scenario data. It is included as a technical proof-of-work rather than the main storytelling layer.",
  zh: "这个 coded prototype 使用交互式地图图层和模拟 Robotaxi 场景数据。它主要作为技术实现展示，而不是页面叙事的唯一入口。",
};

export const PROTOTYPE_SECTION_DISCLAIMER: Record<Lang, string> = {
  en: "Simulated demo only. Pickup zones, shelter exposure, and vehicle availability are generated for portfolio demonstration.",
  zh: "该 demo 为模拟演示。上车区域、遮蔽暴露和车辆状态均为作品集展示用途。",
};

const STEP_IMAGES = {
  trip: "/design-reference/screen-1-set-trip.png",
  pickup: "/design-reference/screen-3-choose-pickup.png",
  search: "/design-reference/screen-2-service-status.png",
  enRoute: "/design-reference/screen-4-on-the-way.png",
} as const;

export const GUIDED_WALKTHROUGH_STEPS: Record<Lang, GuidedWalkthroughStep[]> = {
  en: [
    {
      tabLabel: "01 · Trip",
      title: "Set trip context",
      copy: "The user sets pickup and drop-off to start planning.",
      imageSrc: STEP_IMAGES.trip,
      imageAlt: {
        en: "Trip setup screen with pickup and drop-off fields",
        zh: "Trip setup screen with pickup and drop-off fields",
      },
    },
    {
      tabLabel: "02 · Compare",
      title: "Compare pickup options",
      copy: "The app compares valid pickup zones by walking distance, rain exposure, and vehicle ETA.",
      imageSrc: STEP_IMAGES.pickup,
      imageAlt: {
        en: "Pickup zone comparison screen with three options",
        zh: "Pickup zone comparison screen with three options",
      },
    },
    {
      tabLabel: "03 · Search",
      title: "Search nearby vehicles",
      copy: "After confirmation, the system searches nearby Robotaxis and estimates wait time.",
      imageSrc: STEP_IMAGES.search,
      imageAlt: {
        en: "Dispatch search screen while matching a nearby vehicle",
        zh: "Dispatch search screen while matching a nearby vehicle",
      },
    },
    {
      tabLabel: "04 · En route",
      title: "Vehicle on the way",
      copy: "The final screen shows vehicle approach, walking guidance, and remaining rain exposure.",
      imageSrc: STEP_IMAGES.enRoute,
      imageAlt: {
        en: "En-route screen with vehicle approach and walking guidance",
        zh: "En-route screen with vehicle approach and walking guidance",
      },
    },
  ],
  zh: [
    {
      tabLabel: "01 · 行程",
      title: "设置行程",
      copy: "用户选择出发参考位置和目的地。",
      imageSrc: STEP_IMAGES.trip,
      imageAlt: {
        en: "设置行程界面",
        zh: "设置行程界面",
      },
    },
    {
      tabLabel: "02 · 方案",
      title: "比较上车方案",
      copy: "系统根据步行距离、雨中暴露和车辆到达时间比较不同上车区域。",
      imageSrc: STEP_IMAGES.pickup,
      imageAlt: {
        en: "比较上车区域界面",
        zh: "比较上车区域界面",
      },
    },
    {
      tabLabel: "03 · 搜索",
      title: "搜索附近车辆",
      copy: "用户确认上车区域后，系统搜索附近车辆并估算等待时间。",
      imageSrc: STEP_IMAGES.search,
      imageAlt: {
        en: "搜索附近车辆界面",
        zh: "搜索附近车辆界面",
      },
    },
    {
      tabLabel: "04 · 前往",
      title: "车辆前往中",
      copy: "最终页面展示车辆接近路线、步行指引和剩余雨中暴露距离。",
      imageSrc: STEP_IMAGES.enRoute,
      imageAlt: {
        en: "车辆前往中界面",
        zh: "车辆前往中界面",
      },
    },
  ],
};
