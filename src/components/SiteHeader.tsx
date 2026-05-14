"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { dispatchSplashReplay } from "@/components/SplashIntro";
import { useLanguage } from "@/contexts/LanguageContext";

type NavId = "home" | "work" | "about";

const mainNav = [
  { id: "home" as const, href: "/#home", label: "Home" },
  { id: "work" as const, href: "/#work", label: "Work" },
  { id: "about" as const, href: "/#about", label: "About" },
];

function navLinkClass(active: boolean) {
  return active
    ? "text-stone-900 underline decoration-stone-400 underline-offset-4"
    : "text-stone-500 transition hover:text-stone-900";
}

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const [hashSlide, setHashSlide] = useState<NavId>("home");

  useEffect(() => {
    if (pathname !== "/") return;
    const sync = () => {
      const h = window.location.hash;
      setHashSlide(
        h === "#work" ? "work" : h === "#about" ? "about" : "home",
      );
    };
    window.addEventListener("hashchange", sync);
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const navActive: NavId = pathname === "/" ? hashSlide : "home";
  const slideIdx =
    navActive === "work" ? 1 : navActive === "about" ? 2 : 0;
  const progressPct = ((slideIdx + 1) / 3) * 100;

  const onCassyClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    e.preventDefault();
    const h = window.location.hash;
    const atHome = h === "#home" || h === "" || h === "#";
    if (atHome) {
      dispatchSplashReplay();
    } else {
      window.location.hash = "home";
    }
  };

  const onDeckNavClick = (id: NavId) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    e.preventDefault();
    window.location.hash = id;
  };

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-stone-200/90 bg-[#f7f6f3]/95 backdrop-blur-md">
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-stone-200/80"
        aria-hidden
      >
        <div
          className="h-full bg-stone-900/70 transition-[width] duration-500 ease-out"
          style={{ width: pathname === "/" ? `${progressPct}%` : "0%" }}
        />
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/#home"
            onClick={onCassyClick}
            className="font-display text-xl font-medium tracking-tight text-stone-900 transition hover:text-stone-700"
          >
            Cassy
          </Link>
          <nav
            className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500"
            aria-label="Primary"
          >
            {mainNav.map((item, i) => (
              <span key={item.id} className="flex items-center gap-x-2">
                {i > 0 ? (
                  <span className="text-stone-300" aria-hidden>
                    /
                  </span>
                ) : null}
                <Link
                  href={item.href}
                  onClick={onDeckNavClick(item.id)}
                  className={navLinkClass(
                    pathname === "/" && navActive === item.id,
                  )}
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {pathname === "/" ? (
            <p
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400"
              aria-live="polite"
            >
              {String(slideIdx + 1).padStart(2, "0")} / 03
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em]">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={
                lang === "en"
                  ? "text-stone-900"
                  : "text-stone-500 transition hover:text-stone-800"
              }
            >
              EN
            </button>
            <span className="text-stone-300" aria-hidden>
              |
            </span>
            <button
              type="button"
              onClick={() => setLang("zh")}
              className={
                lang === "zh"
                  ? "text-stone-900"
                  : "text-stone-500 transition hover:text-stone-800"
              }
            >
              中文
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
