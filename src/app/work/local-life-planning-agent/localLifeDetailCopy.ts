import type { Lang } from "@/lib/portfolioCopy";

type DemoStep = {
  title: string;
  description: string;
};

export const LOCAL_LIFE_DEMO_TITLE: Record<Lang, string> = {
  en: "What to try in the demo",
  zh: "Demo 中可以体验什么",
};

export const LOCAL_LIFE_INTERACTIVE_DEMO_TITLE: Record<Lang, string> = {
  en: "Interactive Demo Preview",
  zh: "交互 Demo 预览",
};

export const LOCAL_LIFE_INTERACTIVE_DEMO_COPY: Record<Lang, string> = {
  en: "Try the planning flow directly — enter a goal, review the generated route, and explore fallback plans. Open the full prototype for execution simulation.",
  zh: "可直接体验规划流程：输入目标、查看生成路线并浏览备选方案。打开完整原型可体验执行模拟。",
};

export const LOCAL_LIFE_INTERACTIVE_DEMO_CTA: Record<Lang, string> = {
  en: "Open full prototype",
  zh: "打开完整原型",
};

export const LOCAL_LIFE_DEMO_STEPS: Record<Lang, DemoStep[]> = {
  en: [
    {
      title: "Choose a planning scenario",
      description:
        "Start from a local-life goal such as a friend gathering, family outing, casual date, or work session.",
    },
    {
      title: "Review the generated route",
      description:
        "See how the agent turns the goal into a sequence of activity, food, and optional follow-up stops.",
    },
    {
      title: "Open POI details",
      description:
        "Click recommended places on the map or cards to understand why each stop was selected.",
    },
    {
      title: "Compare fallback plans",
      description:
        "Switch to alternatives when booking fails, queues rise, or the route becomes less efficient.",
    },
    {
      title: "Simulate execution",
      description:
        "Preview reservation, ordering, ticketing, and sharing actions inside the plan flow.",
    },
  ],
  zh: [
    {
      title: "选择规划场景",
      description: "从朋友聚会、家庭亲子、轻松约会或工作学习等本地生活目标开始。",
    },
    {
      title: "查看生成路线",
      description: "观察 Agent 如何将目标转化为活动、餐饮和可选后续地点的顺序方案。",
    },
    {
      title: "打开 POI 详情",
      description: "点击地图点位或推荐卡片，查看每个地点为什么被选中。",
    },
    {
      title: "对比备选方案",
      description: "当订位失败、排队过久或路线效率下降时，切换查看替代方案。",
    },
    {
      title: "模拟执行动作",
      description: "在方案内预览订位、下单、购票和分享等执行流程。",
    },
  ],
};
