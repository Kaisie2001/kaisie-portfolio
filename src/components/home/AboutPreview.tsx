import Link from "next/link";

export function AboutPreview() {
  return (
    <section
      className="border-t border-stone-200/90 px-6 py-20 sm:py-28"
      aria-labelledby="about-preview-heading"
    >
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
          Background
        </p>
        <h2
          id="about-preview-heading"
          className="mt-2 font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl"
        >
          About
        </h2>
        <p className="copy-cn mt-1 text-stone-600">关于</p>
        <p className="mt-10 max-w-2xl text-[15px] leading-[1.75] text-stone-800 sm:text-lg">
          I structured my training across Digital Urban Management, GIS, and
          spatial analysis—then translated that systems lens into autonomous
          mobility product, product operations, and AI-powered operations
          workflows. I prototype, document, and coordinate delivery where map,
          navigation, robotaxi, and drone mission products intersect the real
          world.
        </p>
        <p className="copy-cn mt-6 max-w-2xl text-stone-600">
          我的训练横跨数字城市管理、GIS
          与空间分析，并将其系统视角转化为智能移动产品、产品运营与 AI
          运营提效工作流。我在地图导航、Robotaxi、无人机任务等产品与真实世界交汇之处，推进原型验证、需求沉淀与跨团队交付协同。
        </p>
        <Link
          href="/about"
          className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900 hover:decoration-stone-600"
        >
          Continue reading · 继续阅读
        </Link>
      </div>
    </section>
  );
}
