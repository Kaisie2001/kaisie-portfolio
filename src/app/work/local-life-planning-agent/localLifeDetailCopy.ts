import type { Lang } from "@/lib/portfolioCopy";

type DemoStep = {
  title: string;
  description: string;
};

export const LOCAL_LIFE_DEMO_TITLE: Record<Lang, string> = {
  en: "Demo Walkthrough",
  zh: "Demo 流程",
};

export const LOCAL_LIFE_DEMO_STEPS: Record<Lang, DemoStep[]> = {
  en: [
    {
      title: "Goal input",
      description: "User enters a local-life request",
    },
    {
      title: "Intent summary",
      description:
        "System extracts time, group, budget, food preference, and mobility constraints",
    },
    {
      title: "Main plan",
      description:
        "Activity, food, and optional second stop are arranged as a route timeline",
    },
    {
      title: "Fallbacks",
      description:
        "Alternatives appear for booking failure, queue risk, or route conflict",
    },
    {
      title: "Execute",
      description:
        "User confirms booking, ordering, ticketing, and sharing simulation",
    },
  ],
  zh: [
    {
      title: "输入目标",
      description: "用户输入一句本地生活需求",
    },
    {
      title: "意图摘要",
      description: "系统提取时间、人群、预算、饮食偏好和通勤约束",
    },
    {
      title: "主方案",
      description: "将活动、餐饮和可选第二站组合成路线时间轴",
    },
    {
      title: "备选方案",
      description: "当订位失败、排队过久或路线冲突时提供替代选择",
    },
    {
      title: "确认执行",
      description: "模拟订位、下单、购票和分享动作",
    },
  ],
};
