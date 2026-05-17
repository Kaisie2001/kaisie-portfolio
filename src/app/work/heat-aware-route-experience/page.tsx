import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heat-aware Route Experience",
  description:
    "Route experience under environmental constraints—data-driven product iteration for mobility platforms.",
};

export default function HeatAwareRoutePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
        Featured · P1
      </p>
      <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
        Heat-aware Route Experience
      </h1>
      <p className="copy-cn mt-2 text-stone-600">热感知路线体验</p>
      <p className="mt-6 text-[15px] leading-relaxed text-stone-800 sm:text-base">
        I analyzed how route experience products should incorporate environmental
        stress—beyond shortest time or distance—so teams can prioritize
        user journey optimization, rider comfort, and operational feedback in
        one coherent framework for data-driven product iteration.
      </p>
      <p className="copy-cn mt-4 text-stone-600">
        我分析路线体验产品如何纳入环境压力（不仅是时间或距离最短），使用户旅程优化、乘客舒适度与运营反馈可在同一框架内被优先级化与迭代。
      </p>
      <p className="mt-6 text-[15px] leading-relaxed text-stone-700 sm:text-base">
        Structured spatial layers and product requirements for mobility
        platforms where digital routing intersects heat exposure and safety
        trade-offs—positioned for cross-functional execution across maps,
        operations, and policy stakeholders.
      </p>
      <p className="copy-cn mt-4 text-stone-600">
        梳理空间图层与产品需求，服务数字路线与现实世界热暴露及安全取舍交汇的出行平台场景，并支持地图、运营与政策相关方的跨团队执行。
      </p>
      <Link
        href="/work"
        className="mt-12 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900 hover:decoration-stone-500"
      >
        ← Work index · 返回作品索引
      </Link>
    </div>
  );
}
