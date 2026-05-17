import Link from "next/link";
import { Fragment } from "react";

const ctas = [
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
] as const;

export function ResumeContactCTA() {
  return (
    <section className="px-6 pb-24 pt-4 sm:pb-32" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-4xl border border-stone-200/90 bg-white px-8 py-14 shadow-sm sm:px-12 sm:py-16">
        <h2
          id="cta-heading"
          className="font-display text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl"
        >
          Let&apos;s connect
        </h2>
        <p className="copy-cn mt-2 text-stone-600">联系 / 简历</p>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-stone-700 sm:text-base">
          Open to product management and product operations roles across
          autonomous mobility, robotaxi, autonomous driving strategy, map and
          navigation, drone operations, mobility platforms, and AI-enabled
          operations.
        </p>
        <p className="copy-cn mt-3 max-w-2xl text-stone-600">
          寻求智能移动产品、出行产品策略、产品运营与 AI
          运营提效相关岗位，覆盖 Robotaxi、自动驾驶、地图导航、无人机运营、出行平台与 AI 赋能运营。
        </p>
        <nav
          className="mt-10 flex flex-wrap items-center gap-x-0 font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500"
          aria-label="Contact actions"
        >
          {ctas.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 ? (
                <span className="mx-3 text-stone-400" aria-hidden>
                  |
                </span>
              ) : null}
              <Link
                href={item.href}
                className="transition hover:text-stone-900"
              >
                {item.label}
              </Link>
            </Fragment>
          ))}
        </nav>
      </div>
    </section>
  );
}
