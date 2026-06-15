import type { Lang } from "@/lib/portfolioCopy";

type WorkflowStep = {
  title: string;
  description: string;
};

type Highlight = {
  title: string;
  description: string;
};

export const LOCAL_LIFE_AGENT_WORKFLOW_TITLE: Record<Lang, string> = {
  en: "Agent Workflow",
  zh: "Agent 工作流",
};

export const LOCAL_LIFE_AGENT_WORKFLOW_SUBTITLE: Record<Lang, string> = {
  en: "How the agent reasons from intent to an executable route plan.",
  zh: "Agent 如何从意图解析推进到可执行的路线方案。",
};

export const LOCAL_LIFE_AGENT_WORKFLOW_STEPS: Record<Lang, WorkflowStep[]> = {
  en: [
    {
      title: "Parse Intent",
      description:
        "Extract time, budget, group type, food preference, activity needs, and mobility constraints from natural language.",
    },
    {
      title: "Candidate Retrieval",
      description:
        "Pull restaurants, activities, and venues that fit the scenario and geographic context.",
    },
    {
      title: "POI Scoring",
      description:
        "Rank candidates by scenario fit, distance, rating, availability, and route compatibility.",
    },
    {
      title: "Constraint Checking",
      description:
        "Validate time windows, budget limits, opening hours, and travel-time thresholds.",
    },
    {
      title: "Route Assembly",
      description:
        "Build an executable timeline combining activities, meals, travel legs, and buffer time.",
    },
    {
      title: "Execution Simulation",
      description:
        "Simulate booking tickets, reserving tables, placing orders, and generating share text.",
    },
  ],
  zh: [
    {
      title: "意图解析",
      description:
        "从自然语言中提取时间、预算、人数、餐饮偏好、活动需求与出行约束。",
    },
    {
      title: "候选检索",
      description: "按场景与地理上下文检索餐厅、活动与场所候选。",
    },
    {
      title: "POI 评分",
      description: "按场景契合度、距离、评分、可用性与路线兼容性排序。",
    },
    {
      title: "约束校验",
      description: "校验时间窗、预算、营业时间与行程耗时阈值。",
    },
    {
      title: "路线组装",
      description: "组合活动、用餐、出行段与缓冲，生成可执行时间线。",
    },
    {
      title: "执行模拟",
      description: "模拟订票、订位、下单与分享文案等关键执行动作。",
    },
  ],
};

export const LOCAL_LIFE_HIGHLIGHTS_TITLE: Record<Lang, string> = {
  en: "Product Highlights",
  zh: "产品亮点",
};

export const LOCAL_LIFE_HIGHLIGHTS_SUBTITLE: Record<Lang, string> = {
  en: "Key interaction and agent surfaces that make planning feel executable.",
  zh: "让规划从推荐走向可执行的关键交互与 Agent 能力。",
};

export const LOCAL_LIFE_HIGHLIGHTS: Record<Lang, Highlight[]> = {
  en: [
    {
      title: "POI Matching",
      description:
        "Scenario-aware scoring surfaces why each venue fits the user's goal—not just popularity.",
    },
    {
      title: "Route Timeline",
      description:
        "A single itinerary view orders stops, travel time, and buffers into one readable plan.",
    },
    {
      title: "Fallback Handling",
      description:
        "When booking fails or queues spike, the agent proposes ready-to-switch alternatives.",
    },
    {
      title: "Execution Panel",
      description:
        "Booking, ordering, and share actions live beside the plan so users can act immediately.",
    },
    {
      title: "Agent Trace",
      description:
        "Reasoning steps and tool calls are visible so users trust why a plan was assembled.",
    },
  ],
  zh: [
    {
      title: "POI 匹配",
      description: "场景化评分说明每个场所为何契合目标，而非仅按热度排序。",
    },
    {
      title: "路线时间线",
      description: "单一行程视图将站点、出行耗时与缓冲整合为可读计划。",
    },
    {
      title: "异常回退",
      description: "订位失败或排队过长时，Agent 提供可切换的备选方案。",
    },
    {
      title: "执行面板",
      description: "订位、下单与分享与方案并列，便于用户立即行动。",
    },
    {
      title: "Agent 轨迹",
      description: "推理步骤与工具调用可见，帮助用户理解方案如何生成。",
    },
  ],
};

export const LOCAL_LIFE_ROLE_TITLE: Record<Lang, string> = {
  en: "My Role",
  zh: "我的角色",
};

export const LOCAL_LIFE_ROLE_COPY: Record<Lang, string> = {
  en: "I led product definition, interaction design, agent logic structuring, and prototype delivery—translating a hackathon concept into a portfolio-ready case study for goal-to-execution local-life planning.",
  zh: "我负责产品定义、交互设计、Agent 逻辑梳理与原型交付，将黑客松概念沉淀为可展示的目标驱动本地生活规划案例。",
};
