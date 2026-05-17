import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Robotaxi Journey Audit",
  description:
    "Concept: robotaxi journey audit — product operations and cross-functional execution.",
};

export default function RobotaxiJourneyAuditPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
        Placeholder · Product analysis · Concept
      </p>
      <p className="copy-cn text-stone-600">占位 · 产品分析 · 概念</p>
      <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
        Robotaxi Journey Audit
      </h1>
      <p className="copy-cn mt-2 text-stone-600">Robotaxi 旅程审计</p>
      <p className="mt-6 text-[15px] leading-relaxed text-stone-800 sm:text-base">
        Concept project placeholder. I designed this thread to audit robotaxi
        user journeys end-to-end—pickup, routing, disengagements, remote
        assistance, and operator handoff—so product operations teams can
        coordinate repeatable reviews with map and navigation and safety
        partners.
      </p>
      <p className="copy-cn mt-4 text-stone-600">
        概念项目占位。该方向旨在端到端审计 Robotaxi
        用户旅程（接单、路线、接管、远程协助与运营交接），使产品运营团队可与地图导航及安全伙伴协同开展可重复的评审机制。
      </p>
      <p className="mt-6 text-[15px] leading-relaxed text-stone-700 sm:text-base">
        Case study artifacts, audit templates, and metrics definitions will be
        published here when finalized.
      </p>
      <p className="copy-cn mt-3 text-stone-600">
        案例材料、审计模板与指标定义将在定稿后补充。
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
