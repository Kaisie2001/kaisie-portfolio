import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Product approach: user journey through delivery and iteration. 用户旅程至落地迭代的产品方法。",
};

const steps: {
  titleEn: string;
  titleZh: string;
  detailEn: string;
  detailZh: string;
}[] = [
  {
    titleEn: "User Journey",
    titleZh: "用户旅程",
    detailEn:
      "Mapped actors, goals, and touchpoints end-to-end—including failure paths, remote assistance, and fleet operations handoffs.",
    detailZh:
      "梳理角色、目标与端到端触点，覆盖异常路径、远程协助与车队/运营交接。",
  },
  {
    titleEn: "Pain Point Diagnosis",
    titleZh: "痛点诊断",
    detailEn:
      "Diagnosed root causes across UX, reliability, policy, and ops—prioritized what blocks user journey optimization versus noise.",
    detailZh:
      "从体验、可靠性、政策与运营侧诊断根因，识别阻碍用户旅程优化的关键问题并拆解优先级。",
  },
  {
    titleEn: "Data Analysis",
    titleZh: "数据分析",
    detailEn:
      "Analyzed telemetry, qualitative research, and operational feedback—structured hypotheses and evaluation criteria for iteration.",
    detailZh:
      "分析遥测、定性研究与运营反馈，提出可验证假设与评估标准以支持迭代。",
  },
  {
    titleEn: "Product Opportunity",
    titleZh: "产品机会",
    detailEn:
      "Defined the smallest valuable product opportunity with clear user and ops value—translated into roadmap-ready bets.",
    detailZh:
      "定义最小有价值的产品机会，明确用户与运营侧价值，并转化为路线图可承接的命题。",
  },
  {
    titleEn: "Feature / Workflow Design",
    titleZh: "功能/流程设计",
    detailEn:
      "Designed workflows and features where route, mission, and fleet experience meet engineering and safety constraints.",
    detailZh:
      "设计功能与流程，使路线、任务与车队体验与工程实现及安全约束对齐。",
  },
  {
    titleEn: "Requirement Documentation",
    titleZh: "需求文档",
    detailEn:
      "Documented requirements, acceptance criteria, risks, and rollout plans—optimized for cross-functional execution.",
    detailZh:
      "沉淀需求、验收标准、风险与上线计划，面向跨团队协作与执行效率优化。",
  },
  {
    titleEn: "Delivery & Iteration",
    titleZh: "落地迭代",
    detailEn:
      "Coordinated delivery, monitored launch metrics, and iterated—closed the loop with product operations and AI workflow automation where appropriate.",
    detailZh:
      "协同交付、监控上线指标并持续迭代；在合适场景结合产品运营与 AI 工作流自动化闭环。",
  },
];

export default function ApproachPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
        Approach
      </p>
      <h1 className="mt-3 font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl">
        My product approach
      </h1>
      <p className="copy-cn mt-2 text-stone-600">我的产品方法</p>
      <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-stone-700 sm:text-base">
        Execution model for autonomous mobility product and AI-powered
        operations—from journey mapping through requirement documentation and
        product delivery.
      </p>
      <p className="copy-cn mt-3 max-w-2xl text-stone-600">
        面向智能移动产品与 AI 运营提效的执行模型：从用户旅程梳理到需求文档与产品落地推进。
      </p>

      <div className="mt-12 border border-stone-200/90 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
          Pipeline · EN
        </p>
        <p className="mt-3 text-[15px] font-medium leading-relaxed text-stone-900 sm:text-base">
          User Journey → Pain Point Diagnosis → Data Analysis → Product
          Opportunity → Feature / Workflow Design → Requirement Documentation →
          Delivery &amp; Iteration
        </p>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
          Pipeline · 中文
        </p>
        <p className="copy-cn mt-3 font-medium leading-relaxed text-stone-700">
          用户旅程 → 痛点诊断 → 数据分析 → 产品机会 → 功能/流程设计 → 需求文档 →
          落地迭代
        </p>
      </div>

      <ol className="mt-16 list-none divide-y divide-stone-200 border-y border-stone-200 p-0">
        {steps.map((item, index) => (
          <li
            key={item.titleEn}
            className="grid gap-6 py-12 sm:grid-cols-[minmax(0,4.5rem)_1fr] sm:gap-10 sm:py-14"
          >
            <span className="font-mono text-sm text-stone-500" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-xl text-stone-900 sm:text-2xl">
                {item.titleEn}
              </h2>
              <p className="copy-cn mt-1 font-medium text-stone-600">
                {item.titleZh}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-stone-800 sm:text-base">
                {item.detailEn}
              </p>
              <p className="copy-cn mt-3 text-stone-600">
                {item.detailZh}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
