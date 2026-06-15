import Link from "next/link";

const projects = [
  {
    code: "P1",
    name: "Local-life Planning Agent",
    capabilityEn:
      "Designed a goal-to-execution AI agent for local plans—parsed natural-language intent, matched POIs, assembled route-based itineraries, and simulated booking/order execution with fallback logic.",
    capabilityZh:
      "设计目标驱动的本地生活规划 Agent，将自然语言需求解析为可执行约束，完成 POI 匹配、路线方案组合，并模拟订位/下单与异常回退。",
    href: "/work/local-life-planning-agent",
    badge: "Completed · Prototype",
    badgeZh: "已完成 · 原型",
  },
  {
    code: "P2",
    name: "Robotaxi Journey Audit",
    capabilityEn:
      "Structured a cross-functional audit of robotaxi user journeys—diagnosed pickup, routing, disengagements, and operator handoff as product operations artifacts for fleet and navigation teams.",
    capabilityZh:
      "结构化 Robotaxi 用户旅程审计，诊断接单、路线、接管与运营交接，沉淀为车队与导航团队可用的产品运营产出。",
    href: "/work/robotaxi-rain-mode",
    badge: "Product analysis · Concept",
    badgeZh: "产品分析 · 概念",
  },
  {
    code: "P3",
    name: "Drone Mission Planning Workflow",
    capabilityEn:
      "Proposed an end-to-end mission workflow—coordinated airspace constraints, mission steps, telemetry expectations, and operational sign-off into a single product narrative for AI-powered operations.",
    capabilityZh:
      "提出端到端任务工作流，将空域约束、任务步骤、遥测预期与运营签批协同为统一的任务流程设计与 AI 运营提效叙事。",
    href: "/work/drone-mission-planning-workflow",
    badge: "Product analysis · Concept",
    badgeZh: "产品分析 · 概念",
  },
] as const;

export function FeaturedWork() {
  return (
    <section
      className="border-t border-stone-200/90 bg-white px-6 py-20 sm:py-28"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
              Featured
            </p>
            <h2
              id="featured-heading"
              className="mt-2 font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl"
            >
              Featured work
            </h2>
            <p className="copy-cn mt-2 text-stone-600">精选项目</p>
          </div>
          <Link
            href="/work"
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900 hover:decoration-stone-600"
          >
            Work index →
          </Link>
        </div>
        <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-stone-700 sm:text-base">
          Flagship threads in autonomous mobility product, product operations, and
          mission workflow design—two concept analyses flagged below.
        </p>
        <p className="copy-cn mt-2 max-w-2xl text-stone-600">
          智能移动产品、产品运营与任务流程设计的主线；其中两项为概念/产品分析占位。
        </p>

        <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
          <span className="inline-block w-10 sm:w-14">Code</span>
          <span className="text-stone-400">—</span>
          <span className="ml-2">Title</span>
        </div>

        <ul className="mt-3 divide-y divide-stone-200 border-t border-stone-200">
          {projects.map((project) => (
            <li key={project.code}>
              <Link
                href={project.href}
                className="group grid gap-4 py-8 transition sm:grid-cols-[minmax(0,4.5rem)_1fr] sm:gap-10 sm:py-10"
              >
                <span className="font-mono text-sm text-stone-500 transition group-hover:text-stone-800">
                  {project.code}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <p className="font-display text-xl font-medium text-stone-900 transition group-hover:text-stone-700 sm:text-2xl">
                      {project.name}
                    </p>
                    {project.badge ? (
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">
                          {project.badge}
                        </span>
                        {project.badgeZh ? (
                          <span className="copy-cn text-stone-600">
                            {project.badgeZh}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <p className="mt-3 max-w-prose text-[15px] leading-[1.65] text-stone-700">
                    <span className="text-stone-500">Outcome · </span>
                    {project.capabilityEn}
                  </p>
                  <p className="copy-cn mt-2 max-w-prose text-stone-600">
                    {project.capabilityZh}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
