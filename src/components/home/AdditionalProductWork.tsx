import Link from "next/link";

const items = [
  {
    name: "RePeak",
    blurbEn:
      "Analyzed temporal demand peaks—structured metrics and narratives for capacity, staffing, and infrastructure timing in mobility platforms.",
    blurbZh:
      "分析需求峰值时空分布，沉淀指标与叙事，支撑运力、排班与基础设施节奏决策。",
    href: "/work#repeak",
  },
  {
    name: "TraceWall-HK",
    blurbEn:
      "Evaluated aggregated movement traces in dense urban fabric—translated flow and separation patterns into product and policy-facing insights.",
    blurbZh:
      "评估高密度城市中的出行轨迹聚合，将流动与分隔模式转化为产品与政策侧可沟通的发现。",
    href: "/work#tracewall-hk",
  },
] as const;

export function AdditionalProductWork() {
  return (
    <section
      className="border-t border-stone-200/90 px-6 py-16 sm:py-20"
      aria-labelledby="additional-work-heading"
    >
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
          More work
        </p>
        <h2
          id="additional-work-heading"
          className="mt-2 font-display text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl"
        >
          Additional product work
        </h2>
        <p className="copy-cn mt-1 text-stone-600">更多产品相关工作</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="group block border border-stone-200/90 bg-white p-5 shadow-sm transition hover:border-stone-300"
              >
                <h3 className="font-display text-lg font-medium text-stone-900 group-hover:text-stone-800">
                  {item.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-700 sm:text-sm">
                  {item.blurbEn}
                </p>
                <p className="copy-cn mt-2 text-stone-600">{item.blurbZh}</p>
                <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-800">
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
