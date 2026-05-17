const pipelineEn =
  "User Journey → Pain Point Diagnosis → Data Analysis → Product Opportunity → Feature / Workflow Design → Requirement Documentation → Delivery & Iteration";

const pipelineZh =
  "用户旅程 → 痛点诊断 → 数据分析 → 产品机会 → 功能/流程设计 → 需求文档 → 落地迭代";

export function ApproachSection() {
  return (
    <section className="px-6 py-20 sm:py-28" aria-labelledby="approach-heading">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
          Process
        </p>
        <h2
          id="approach-heading"
          className="mt-2 font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl"
        >
          My product approach
        </h2>
        <p className="copy-cn mt-1 text-stone-600">我的产品方法</p>
        <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-stone-700 sm:text-base">
          A single execution spine from journey clarity to shipped iteration—
          optimized for route, mission, and fleet operations-heavy products where
          cross-functional execution and product requirement documentation must
          stay tightly coupled.
        </p>
        <p className="copy-cn mt-3 max-w-2xl text-stone-600">
          从用户旅程到落地迭代的执行主轴，适用于路线、任务与车队运营强耦合场景，强调跨团队协作与产品需求与文档能力。
        </p>

        <div className="mt-12 border border-stone-200/90 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
            Pipeline · EN
          </p>
          <p className="mt-4 text-[15px] font-medium leading-relaxed text-stone-900 sm:text-base">
            {pipelineEn}
          </p>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
            Pipeline · 中文
          </p>
          <p className="copy-cn mt-4 font-medium leading-relaxed text-stone-700">
            {pipelineZh}
          </p>
        </div>
      </div>
    </section>
  );
}
