export type Lang = "en" | "zh";

export const portfolioCopy = {
  en: {
    home: {
      title: "Autonomous Mobility Product & AI-powered Operations",
      subtitle: "Route · Mission · Fleet · Product Iteration",
      oneLiner:
        "I turn real-world mobility scenarios into product opportunities through user journey analysis, spatial data, and AI-assisted workflows.",
      capabilityTags: [
        "Route Experience",
        "Product Operations",
        "Data-driven Iteration",
        "AI Workflow Automation",
      ],
      focusLine:
        "Focused on robotaxi, map/navigation, drone operations, and mobility platforms.",
      splashMono:
        "Autonomous mobility product · AI-powered operations",
    },
    work: {
      featuredTitle: "Featured Work",
      slideIntro:
        "Case studies across mapping, autonomous mobility, and operations — composed as a single editorial spread.",
      additionalTitle: "Additional Work",
      featured: [
        {
          title: "Local-life Planning Agent",
          description:
            "Goal-to-execution agent for local plans, POI matching, route assembly, and booking/order simulation.",
          keywords: ["AI Agent", "POI Matching", "Route Planning", "Execution Flow"],
          completed: true,
          href: "/work/local-life-planning-agent",
        },
        {
          title: "Robotaxi Rain-aware Pickup Recommendation",
          description:
            "Interactive prototype for recommending more suitable Robotaxi pickup points under rainy conditions.",
          keywords: [
            "PUDO Recommendation",
            "Rain-aware Routing",
            "Interactive Prototype",
            "ETA Logic",
          ],
          completed: true,
          href: "/work/robotaxi-rain-mode",
        },
        {
          title: "Drone Mission Workflow",
          description:
            "Mission planning and operations workflow for drone-based services.",
          keywords: [
            "Mission Flow",
            "Risk Check",
            "Operations",
            "AI Reporting",
          ],
          status: "Concept / In progress",
        },
      ],
      additional: [
        {
          title: "RePeak",
          line: "AI valuation and trust workflow for second-hand outdoor gear.",
        },
        {
          title: "TraceWall-HK",
          line:
            "Digital material passport workflow for circular commercial interiors.",
        },
      ],
    },
    about: {
      sectionLabel: "Background",
      backgroundChips: [
        "Digital Urban Management",
        "Urban Planning",
        "GIS",
        "Product Exploration",
      ],
      paragraph:
        "I bring a spatial and systems perspective to product roles, especially in mobility, navigation, autonomous systems, and AI-enabled operations.",
      capabilityStackTitle: "Capability Stack",
      capabilityBlocks: [
        {
          label: "Product & Operations",
          items: [
            "User Journey Diagnosis",
            "Product Iteration",
            "Growth Funnel",
            "Feedback Loop",
            "PRD/BRD",
            "Product Optimization Plan",
          ],
        },
        {
          label: "Mobility Systems",
          items: [
            "Robotaxi Journey",
            "Route Experience",
            "Navigation Scenario",
            "Pick-up / Drop-off Flow",
            "Road Test Feedback",
            "Drone Mission Workflow",
          ],
        },
        {
          label: "Data & Analysis",
          items: [
            "GIS",
            "Spatial Analysis",
            "Route Analysis",
            "User Feedback Analysis",
            "Operational Metrics",
            "Python",
            "SQL",
          ],
        },
        {
          label: "AI Workflow",
          items: [
            "AI-assisted Research",
            "Prompt Workflow",
            "Agent Task Decomposition",
            "Automated Reporting",
            "Document Drafting",
            "Feedback Classification",
          ],
        },
        {
          label: "Prototyping & Delivery",
          items: [
            "Figma",
            "Wireframe",
            "Product Flow",
            "Requirement Documentation",
            "Cross-functional Communication",
            "Testing Support",
          ],
        },
      ],
      toolsExploring: {
        toolsLabel: "Tools",
        toolsItems: [
          "ChatGPT",
          "Cursor",
          "Gemini",
          "Figma",
          "GitHub",
          "VS Code",
          "Python",
          "SQL",
          "GIS",
        ],
        exploringLabel: "Exploring",
        exploringItems: [
          "Claude Code",
          "Codex",
          "GitHub",
          "Copilot",
          "Manus",
        ],
      },
      contactCardTitle: "Resume & Contact",
      resumeColumnLabel: "Resume",
      contactColumnLabel: "Contact",
    },
    contact: {
      resumeEn: "Resume · EN",
      resumeZh: "Resume · 中文",
      email: "Email",
      wechat: "WeChat",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
  },
  zh: {
    home: {
      title: "智能移动产品策略与 AI 运营提效",
      subtitle: "路线 · 任务 · 车队 · 产品迭代",
      oneLiner:
        "我关注真实移动场景中的用户旅程、空间数据与运营反馈，并用 AI 工具支持产品优化与效率提升。",
      capabilityTags: [
        "路线体验",
        "产品运营",
        "数据驱动迭代",
        "AI 工作流自动化",
      ],
      focusLine:
        "关注 Robotaxi、地图导航、无人机运营与出行平台。",
      splashMono: "智能移动产品策略与 AI 运营提效",
    },
    work: {
      featuredTitle: "精选作品",
      slideIntro:
        "围绕地图与路线、自动驾驶出行与运营流程的案例整理，以一整面编辑式版式呈现。",
      additionalTitle: "其他工作",
      featured: [
        {
          title: "本地生活规划 Agent",
          description:
            "面向本地出行与消费的目标驱动 Agent，完成 POI 匹配、路线方案组合与订位/下单执行模拟。",
          keywords: ["AI Agent", "POI 匹配", "路线规划", "执行流程"],
          completed: true,
          href: "/work/local-life-planning-agent",
        },
        {
          title: "Robotaxi 雨天感知上车点推荐",
          description:
            "面向雨天场景的 Robotaxi 上车点推荐交互原型，展示 PUDO 筛选、遮蔽暴露与 ETA 判断逻辑。",
          keywords: ["PUDO 推荐", "雨天感知路径", "交互原型", "ETA 逻辑"],
          completed: true,
          href: "/work/robotaxi-rain-mode",
        },
        {
          title: "无人机任务工作流",
          description: "面向无人机场景的任务规划与运营流程设计。",
          keywords: ["任务流程", "风险检查", "运营协同", "AI 报告"],
          status: "概念 / 进行中",
        },
      ],
      additional: [
        {
          title: "RePeak",
          line: "面向二手户外装备的 AI 估值与信任机制设计。",
        },
        {
          title: "TraceWall-HK",
          line: "面向商业室内空间的数字材料护照平台流程设计。",
        },
      ],
    },
    about: {
      sectionLabel: "背景",
      backgroundChips: [
        "数字城市管理",
        "城乡规划",
        "GIS",
        "产品探索",
      ],
      paragraph:
        "我希望将空间分析、系统理解和产品思维结合起来，进入出行、导航、自动驾驶、无人机与 AI 运营提效相关岗位。",
      capabilityStackTitle: "能力栈",
      capabilityBlocks: [
        {
          label: "产品与运营",
          items: [
            "用户旅程诊断",
            "产品迭代",
            "增长漏斗",
            "反馈闭环",
            "PRD/BRD",
            "产品优化方案",
          ],
        },
        {
          label: "智能移动系统",
          items: [
            "Robotaxi 用户链路",
            "路线体验",
            "导航场景",
            "上下车点流程",
            "路测反馈",
            "无人机任务流程",
          ],
        },
        {
          label: "数据与分析",
          items: [
            "GIS",
            "空间分析",
            "路线分析",
            "用户反馈分析",
            "运营指标",
            "Python",
            "SQL",
          ],
        },
        {
          label: "AI 工作流",
          items: [
            "AI 辅助研究",
            "Prompt 工作流",
            "Agent 任务拆解",
            "自动化报告",
            "文档撰写",
            "反馈分类",
          ],
        },
        {
          label: "原型与落地",
          items: [
            "Figma",
            "线框图",
            "产品流程",
            "需求文档",
            "跨团队沟通",
            "测试支持",
          ],
        },
      ],
      toolsExploring: {
        toolsLabel: "工具",
        toolsItems: [
          "ChatGPT",
          "Cursor",
          "Gemini",
          "Figma",
          "GitHub",
          "VS Code",
          "Python",
          "SQL",
          "GIS",
        ],
        exploringLabel: "持续探索",
        exploringItems: [
          "Claude Code",
          "Codex",
          "GitHub",
          "Copilot",
          "Manus",
        ],
      },
      contactCardTitle: "简历与联系",
      resumeColumnLabel: "简历",
      contactColumnLabel: "联系",
    },
    contact: {
      resumeEn: "简历 · 英文 PDF",
      resumeZh: "简历 · 中文 PDF",
      email: "邮箱",
      wechat: "微信",
      linkedin: "领英",
      github: "GitHub",
    },
  },
} as const;
