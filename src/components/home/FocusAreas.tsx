const areas = [
  {
    code: "F1",
    titleEn: "Route, Mission & Fleet Experience",
    titleZh: "路线、任务与车队体验",
    bodyEn:
      "Structured ownership of route experience, mission workflow, and fleet operations—translating navigation surfaces, mission states, and operator tooling into coherent product requirements and cross-functional execution plans.",
    bodyZh:
      "围绕路线体验优化、任务流程设计与车队/运力运营，将导航界面、任务状态与运营工具沉淀为可执行的产品需求，并推进跨团队协作与执行。",
  },
  {
    code: "F2",
    titleEn: "Data-driven Product Iteration",
    titleZh: "数据驱动产品迭代",
    bodyEn:
      "Diagnosed bottlenecks from telemetry, trip logs, incident signals, and qualitative feedback; prioritized hypotheses; evaluated impact; iterated with engineering on measurable route, mission, and platform outcomes.",
    bodyZh:
      "基于遥测、行程日志、事件信号与定性反馈进行诊断与拆解，识别关键假设并评估影响，协同工程团队围绕可度量的路线、任务与平台结果持续迭代。",
  },
  {
    code: "F3",
    titleEn: "Product Operations & Delivery",
    titleZh: "产品运营与落地推进",
    bodyEn:
      "Coordinated roadmap trade-offs, launch readiness, and operational playbooks—translating product opportunity into scoped delivery, requirement documentation, and post-launch monitoring for AI-powered operations.",
    bodyZh:
      "协同路线图取舍、上线准备与运营手册，将产品机会转化为可交付范围、需求文档与上线后监控，支撑 AI 运营提效与稳定交付。",
  },
  {
    code: "F4",
    titleEn: "AI Workflow Automation",
    titleZh: "AI 工作流自动化",
    bodyEn:
      "Designed and automated research synthesis, requirement drafting, and ops-facing workflows where AI accelerates structured output—always with human review on safety-critical and compliance-heavy decisions.",
    bodyZh:
      "在研究与需求沉淀、运营侧文档等场景设计 AI 工作流自动化，在结构化产出上提效；对安全与合规敏感决策保留人工复核与评估。",
  },
] as const;

export function FocusAreas() {
  return (
    <section className="px-6 py-20 sm:py-28" aria-labelledby="focus-heading">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="focus-heading"
            className="font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl"
          >
            Focus areas
          </h2>
          <p className="max-w-sm font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
            EN / 中文
          </p>
        </div>
        <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-stone-700 sm:text-base">
          Mobility product strategy across autonomous driving, robotaxi product
          operations, map and navigation, drone operations, and AI-enabled
          mobility platforms.
        </p>
        <p className="copy-cn mt-3 max-w-2xl text-stone-600">
          聚焦智能移动产品、出行产品策略、产品运营与 AI 运营提效，覆盖自动驾驶、Robotaxi、地图导航、无人机与 AI
          赋能出行平台。
        </p>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {areas.map((area) => (
            <li
              key={area.code}
              className="flex flex-col border border-stone-200/90 bg-white p-6 shadow-sm sm:p-7"
            >
              <span className="font-mono text-xs text-stone-500">{area.code}</span>
              <h3 className="mt-3 font-display text-lg font-medium text-stone-900 sm:text-xl">
                {area.titleEn}
              </h3>
              <p className="copy-cn mt-1 font-medium text-stone-600">
                {area.titleZh}
              </p>
              <p className="mt-3 flex-1 text-[15px] leading-[1.65] text-stone-700">
                {area.bodyEn}
              </p>
              <p className="copy-cn mt-3 text-stone-600">{area.bodyZh}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
