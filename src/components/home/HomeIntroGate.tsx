"use client";

/**
 * Full-screen home intro — runs on every visit to `/`.
 * Stays visible until you click the overlay, press Enter/Space (after a short
 * unlock), or press Skip. No session skip and no auto-dismiss.
 * Keyframes: `src/app/globals.css` (`.home-intro__*`).
 */

import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Phase = "intro" | "exiting" | "done";

export function HomeIntroGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const canDismiss = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  const goExiting = useCallback(() => {
    setPhase((current) => (current === "intro" ? "exiting" : current));
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;
    if (reduceMotion) {
      canDismiss.current = true;
      return;
    }
    const unlock = window.setTimeout(() => {
      canDismiss.current = true;
    }, 1200);
    return () => window.clearTimeout(unlock);
  }, [phase, reduceMotion]);

  const tryDismiss = useCallback(() => {
    if (!canDismiss.current || phase !== "intro") return;
    goExiting();
  }, [phase, goExiting]);

  const skipIntro = useCallback(() => {
    if (phase !== "intro") return;
    goExiting();
  }, [phase, goExiting]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
    }, 900);
    return () => window.clearTimeout(doneTimer);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "intro") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (reduceMotion || canDismiss.current) goExiting();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, goExiting, reduceMotion]);

  useLayoutEffect(() => {
    if (phase !== "intro") return;
    skipRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const onOverlayClick = useCallback(() => {
    tryDismiss();
  }, [tryDismiss]);

  if (phase === "done") {
    return <>{children}</>;
  }

  const contentHidden = phase === "intro";

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site introduction"
      data-reduced-motion={reduceMotion ? "true" : undefined}
      className={`home-intro-overlay fixed inset-0 z-[9999] flex cursor-pointer flex-col items-center justify-center bg-[#f4f3f0] px-8 outline-none ${
        phase === "exiting" ? "home-intro__overlay--exit" : ""
      } ${reduceMotion ? "home-intro--static" : ""}`}
      onClick={onOverlayClick}
    >
      <button
        ref={skipRef}
        type="button"
        aria-label="Skip introduction"
        onClick={(e) => {
          e.stopPropagation();
          skipIntro();
        }}
        className="pointer-events-auto absolute left-5 top-5 z-[10000] border border-stone-300 bg-white/95 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur-sm transition hover:border-stone-400 hover:text-stone-900 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-stone-400"
      >
        Skip
      </button>
      <div className="pointer-events-none flex max-w-2xl flex-col items-center text-center">
        <p
          className="home-intro__ghost font-display text-[clamp(2.5rem,10vw,5rem)] leading-none text-stone-400/60"
          aria-hidden
        >
          Cassy
        </p>
        <p className="home-intro__title font-display text-[clamp(2.75rem,11vw,5.5rem)] font-medium leading-[0.95] text-stone-900">
          Cassy
        </p>
        <div className="home-intro__rule mt-8 h-px w-24 bg-stone-400/70" />
        <p className="home-intro__meta mt-8 max-w-lg font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-stone-600 sm:text-[11px]">
          Autonomous mobility product · AI-powered operations
        </p>
        <p className="home-intro__meta copy-cn mt-3 max-w-md leading-relaxed text-stone-600">
          智能移动产品策略与 AI 运营提效
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-0 right-0 px-6 text-center">
        <p className="home-intro__hint font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-stone-500 sm:tracking-[0.35em]">
          Stays open — click when ready · Enter / Space · Skip
        </p>
        <p className="copy-cn mt-3 text-stone-500">
          保持展示直至你点击进入 · 每次打开首页都会播放
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={
          contentHidden
            ? "pointer-events-none select-none opacity-0 blur-[3px] transition-[opacity,filter] duration-700 ease-out"
            : "opacity-100 blur-0 transition-[opacity,filter] delay-200 duration-[900ms] ease-out"
        }
        inert={contentHidden ? true : undefined}
        aria-hidden={contentHidden ? true : undefined}
      >
        {children}
      </div>

      {portalRoot ? createPortal(overlay, portalRoot) : overlay}
    </>
  );
}
