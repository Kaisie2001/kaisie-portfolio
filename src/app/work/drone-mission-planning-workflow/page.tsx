import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Drone Mission Planning Workflow",
  description:
    "Concept: drone mission planning workflow — mission workflow and AI-powered operations.",
};

export default function DroneMissionPlanningPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
        Placeholder · Product analysis · Concept
      </p>
      <p className="copy-cn text-stone-600">占位 · 产品分析 · 概念</p>
      <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
        Drone Mission Planning Workflow
      </h1>
      <p className="copy-cn mt-2 text-stone-600">无人机任务规划工作流</p>
      <p className="mt-6 text-[15px] leading-relaxed text-stone-800 sm:text-base">
        Concept project placeholder. This workflow defines mission planning,
        validation, and logging where airspace constraints, mission steps, and
        telemetry expectations must align with field operations and product
        requirement documentation for AI-powered operations.
      </p>
      <p className="copy-cn mt-4 text-stone-600">
        概念项目占位。该工作流定义任务规划、校验与日志机制，使空域约束、任务步骤与遥测预期与现场运营及产品需求文档在
        AI 运营提效场景下保持一致。
      </p>
      <p className="mt-6 text-[15px] leading-relaxed text-stone-700 sm:text-base">
        UI flows, compliance notes, and operator playbooks will be documented
        here when available.
      </p>
      <p className="copy-cn mt-3 text-stone-600">
        界面流程、合规说明与运营手册将在材料齐备后补充。
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
