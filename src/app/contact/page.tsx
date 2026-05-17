import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Cassy — autonomous mobility product & product operations.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
        Contact
      </p>
      <h1 className="mt-3 font-display text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl">
        Get in touch
      </h1>
      <p className="copy-cn mt-2 text-stone-600">联系</p>
      <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-stone-700 sm:text-base">
        Open to product management and product operations roles across{" "}
        <strong className="font-medium text-stone-900">robotaxi</strong>,{" "}
        <strong className="font-medium text-stone-900">autonomous driving</strong>
        , <strong className="font-medium text-stone-900">drone operations</strong>,{" "}
        <strong className="font-medium text-stone-900">
          map and navigation
        </strong>
        , <strong className="font-medium text-stone-900">mobility platforms</strong>
        , and{" "}
        <strong className="font-medium text-stone-900">
          AI-enabled operations
        </strong>
        . Replace placeholders with your preferred channels.
      </p>
      <p className="copy-cn mt-3 max-w-2xl text-stone-600">
        寻求{" "}
        <strong className="font-medium text-stone-900">智能移动产品</strong>与
        <strong className="font-medium text-stone-900">产品运营</strong>
        相关机会，覆盖 Robotaxi、自动驾驶、无人机运营、地图导航、出行平台与 AI
        赋能运营。请将下方占位替换为你的联系方式。
      </p>
      <ul className="mt-14 space-y-10 border-t border-stone-200 pt-14">
        <li>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600">
            Email
          </p>
          <a
            href="mailto:you@example.com"
            className="mt-2 inline-block font-display text-xl text-stone-900 underline decoration-stone-300 underline-offset-[6px] transition hover:decoration-stone-600"
          >
            you@example.com
          </a>
        </li>
        <li>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600">
            LinkedIn
          </p>
          <a
            href="https://www.linkedin.com/"
            className="mt-2 inline-block font-display text-xl text-stone-900 underline decoration-stone-300 underline-offset-[6px] transition hover:decoration-stone-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Your LinkedIn profile
          </a>
        </li>
      </ul>
      <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600">
        <Link
          href="/resume"
          className="text-stone-600 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-900 hover:decoration-stone-500"
        >
          Resume
        </Link>
        <span className="mx-2 text-stone-700" aria-hidden>
          |
        </span>
        <span className="text-stone-600">Resume first · 先看简历</span>
      </p>
    </div>
  );
}
