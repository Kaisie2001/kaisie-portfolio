import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume — autonomous mobility product & AI-powered operations.",
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
        Resume
      </p>
      <h1 className="mt-3 font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl">
        Resume
      </h1>
      <p className="copy-cn mt-2 text-stone-600">简历</p>
      <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-stone-700 sm:text-base">
        Add a PDF to{" "}
        <code className="border border-stone-200 bg-stone-100 px-2 py-0.5 font-mono text-xs text-stone-700">
          public/resume.pdf
        </code>{" "}
        to enable download, or host externally and link from this page.
      </p>
      <p className="copy-cn mt-3 max-w-2xl text-stone-600">
        将 PDF 放入上述路径以启用下载，或改为外链托管简历。
      </p>
      <nav
        className="mt-10 flex flex-wrap items-center font-mono text-[11px] uppercase tracking-[0.22em] text-stone-600"
        aria-label="Resume actions"
      >
        <a href="/resume.pdf" className="transition hover:text-stone-900">
          Download PDF
        </a>
        <span className="mx-3 text-stone-600" aria-hidden>
          |
        </span>
        <Link href="/contact" className="transition hover:text-stone-900">
          Contact
        </Link>
      </nav>
      <section className="mt-16 border border-stone-200 p-8 sm:p-10">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
          Snapshot · 要点
        </h2>
        <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-stone-800">
          <li className="border-l border-stone-200 pl-4">
            Autonomous mobility product · Mobility product strategy · Product
            operations · AI-powered operations
          </li>
          <li className="copy-cn border-l border-stone-200 pl-4 text-stone-600">
            智能移动产品 · 出行产品策略 · 产品运营 · AI 运营提效
          </li>
          <li className="border-l border-stone-200 pl-4">
            Route experience · Mission workflow · Fleet operations · User journey
            optimization · Workflow automation
          </li>
          <li className="copy-cn border-l border-stone-200 pl-4 text-stone-600">
            路线体验优化 · 任务流程设计 · 车队/运力运营 · 用户旅程优化 · AI
            工作流自动化
          </li>
          <li className="border-l border-stone-200 pl-4">
            Product requirement &amp; documentation · Cross-functional execution ·
            GIS / spatial analysis foundation
          </li>
          <li className="copy-cn border-l border-stone-200 pl-4 text-stone-600">
            产品需求与文档能力 · 跨团队协作与执行 · GIS / 空间分析基础
          </li>
        </ul>
      </section>
    </div>
  );
}
