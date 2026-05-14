"use client";

/**
 * Opening splash: “Hi,” + optional Chinese subtitle, then DecryptedText on
 * “welcome to my world” (always shown). Overlay exits after decrypt + meta beat.
 */

import DecryptedText from "@/components/DecryptedText";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { portfolioCopy } from "@/lib/portfolioCopy";

const EASE = [0.22, 1, 0.36, 1] as const;

const SPLASH_REPLAY_EVENT = "portfolio:splash-replay";

export function dispatchSplashReplay() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SPLASH_REPLAY_EVENT));
}

const EXIT_OVERLAY_S = 0.85;
const ENTER_MAIN_S = 0.85;
const KEY_UNLOCK_MS = 500;

const WELCOME_LINE_EN = "welcome to my world";

export function SplashIntro({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const reduce = Boolean(reduceMotion);

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [session, setSession] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [mainReady, setMainReady] = useState(false);
  const [hashSkipped, setHashSkipped] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  const canKeyboardDismiss = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const exitTimerRef = useRef<number | undefined>(undefined);
  const requestExitRef = useRef<() => void>(() => {});

  const enHome = portfolioCopy.en.home;
  const zhHome = portfolioCopy.zh.home;
  const skipLabel = lang === "zh" ? "跳过" : "Skip";

  const requestExit = useCallback(() => {
    if (exitTimerRef.current !== undefined) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = undefined;
    }
    setShowOverlay(false);
  }, []);

  useEffect(() => {
    requestExitRef.current = requestExit;
  }, [requestExit]);

  useLayoutEffect(() => {
    setPortalEl(document.body);
  }, []);

  useLayoutEffect(() => {
    if (!showOverlay) return;
    skipRef.current?.focus({ preventScroll: true });
  }, [showOverlay, session]);

  useLayoutEffect(() => {
    const h = window.location.hash;
    if (h === "#work" || h === "#about") {
      setHashSkipped(true);
      setShowOverlay(false);
      setMainReady(true);
    }
  }, []);

  useEffect(() => {
    if (mainReady) {
      document.documentElement.dataset.homeIntroDone = "true";
      document.body.style.overflow = "";
    } else {
      delete document.documentElement.dataset.homeIntroDone;
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mainReady]);

  useEffect(() => {
    if (!showOverlay || mainReady) {
      canKeyboardDismiss.current = false;
      return;
    }
    canKeyboardDismiss.current = reduce;
    let unlockTimer: number | undefined;
    if (!reduce) {
      unlockTimer = window.setTimeout(() => {
        canKeyboardDismiss.current = true;
      }, KEY_UNLOCK_MS);
    }
    return () => {
      if (unlockTimer !== undefined) window.clearTimeout(unlockTimer);
    };
  }, [showOverlay, mainReady, reduce, session]);

  useEffect(() => {
    const onReplay = () => {
      if (exitTimerRef.current !== undefined) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = undefined;
      }
      setSession((n) => n + 1);
      setMainReady(false);
      setShowMeta(false);
      setShowOverlay(true);
    };
    window.addEventListener(SPLASH_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(SPLASH_REPLAY_EVENT, onReplay);
  }, []);

  useEffect(() => {
    if (!showOverlay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (!canKeyboardDismiss.current && !reduce) return;
      e.preventDefault();
      requestExitRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showOverlay, reduce]);

  /** Reduced motion: short hold then exit (no decrypt scramble). */
  useEffect(() => {
    if (!showOverlay || mainReady || hashSkipped || !reduce) return;
    setShowMeta(true);
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = undefined;
      requestExitRef.current();
    }, 1600);
    return () => {
      if (exitTimerRef.current !== undefined) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = undefined;
      }
    };
  }, [showOverlay, mainReady, hashSkipped, reduce, session, requestExit]);

  const onOverlayExitComplete = useCallback(() => {
    setMainReady(true);
  }, []);

  const scheduleExitAfterMeta = useCallback(() => {
    if (exitTimerRef.current !== undefined) window.clearTimeout(exitTimerRef.current);
    setShowMeta(true);
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = undefined;
      requestExitRef.current();
    }, 1650);
  }, []);

  const onDecryptComplete = useCallback(() => {
    if (reduce) return;
    scheduleExitAfterMeta();
  }, [reduce, scheduleExitAfterMeta]);

  const onSkipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exitTimerRef.current !== undefined) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = undefined;
    }
    requestExit();
  };

  const overlay = (
    <AnimatePresence onExitComplete={onOverlayExitComplete}>
      {showOverlay ? (
        <motion.div
          key={session}
          role="dialog"
          aria-modal="true"
          aria-label={lang === "zh" ? "开场" : "Opening"}
          initial={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: reduce ? 0 : -16,
            transition: { duration: reduce ? 0.22 : EXIT_OVERLAY_S, ease: EASE },
          }}
          className="fixed inset-0 z-[9999] flex cursor-default flex-col bg-[#f4f3f0]"
        >
          <button
            ref={skipRef}
            type="button"
            aria-label={lang === "zh" ? "跳过开场" : "Skip introduction"}
            onClick={onSkipClick}
            className={`pointer-events-auto absolute left-5 top-5 z-[10000] border border-stone-300/90 bg-white/90 px-3 py-2 font-mono text-[10px] text-stone-600 shadow-sm backdrop-blur-sm transition hover:border-stone-400 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 ${
              lang === "zh" ? "tracking-wide" : "uppercase tracking-[0.22em]"
            }`}
          >
            {skipLabel}
          </button>

          <div className="pointer-events-auto absolute right-5 top-5 z-[10000] flex flex-wrap items-center justify-end gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em]">
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

          <div className="pointer-events-none flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-10 sm:px-12 sm:py-12">
            <div className="relative mx-auto w-full max-w-5xl">
              <motion.p
                id="splash-hi"
                initial={{ opacity: 0, y: 12 }}
                animate={
                  showOverlay && !hashSkipped
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 12 }
                }
                transition={{ duration: reduce ? 0.15 : 0.5, ease: EASE }}
                className="font-display text-[clamp(1.85rem,4vw,2.85rem)] font-medium leading-[1.08] tracking-[-0.032em] text-stone-900"
              >
                Hi,
              </motion.p>

              {lang === "zh" ? (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    showOverlay && !hashSkipped
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 12 }
                  }
                  transition={{ duration: reduce ? 0.15 : 0.45, delay: reduce ? 0 : 0.12, ease: EASE }}
                  className="copy-cn mt-2 max-w-xl text-stone-500"
                >
                  欢迎来到我的世界。
                </motion.p>
              ) : null}

              <div className="pointer-events-auto relative mt-5 w-full max-w-[min(100%,46rem)] sm:mt-6">
                {reduce ? (
                  <p className="font-display text-[clamp(1.55rem,3.5vw,2.45rem)] font-medium leading-[1.12] tracking-[-0.028em] text-stone-900 sm:whitespace-nowrap">
                    {WELCOME_LINE_EN}
                  </p>
                ) : (
                  <DecryptedText
                    key={`decrypt-${session}`}
                    text={WELCOME_LINE_EN}
                    animateOn="view"
                    sequential
                    revealDirection="start"
                    speed={78}
                    useOriginalCharsOnly={false}
                    characters="ABCDEFGHJKLMNPQRSTUVWXYZ23456789!?#%&*"
                    onDecryptComplete={onDecryptComplete}
                    parentClassName="font-display text-[clamp(1.55rem,3.5vw,2.45rem)] font-medium leading-[1.12] tracking-[-0.028em] sm:whitespace-nowrap"
                    className="text-stone-900"
                    encryptedClassName="font-mono text-[0.82em] font-medium tracking-[0.14em] text-stone-400 sm:text-[0.88em]"
                  />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={
                  showMeta && showOverlay && !hashSkipped
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                transition={{ duration: reduce ? 0.12 : 0.55, ease: EASE }}
                className="mt-10 max-w-xl border-t border-stone-300/40 pt-7 sm:mt-12 sm:pt-9"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-stone-500 sm:text-[11px]">
                    {enHome.splashMono}
                  </p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone-600 sm:text-[15px]">
                    {enHome.focusLine}
                  </p>
                </div>
                <div className="mt-6 border-t border-stone-200/60 pt-6">
                  <p className="font-mono text-[10px] leading-relaxed tracking-[0.18em] text-stone-500 normal-case sm:text-[11px]">
                    {zhHome.splashMono}
                  </p>
                  <p className="copy-cn mt-2 text-stone-600">{zhHome.focusLine}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        className="flex h-full min-h-0 w-full flex-1 flex-col"
        initial={false}
        animate={
          mainReady
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : {
                opacity: 0,
                y: reduce ? 0 : 18,
                filter: reduce ? "blur(0px)" : "blur(3px)",
              }
        }
        transition={{
          duration: mainReady ? (reduce ? 0.2 : ENTER_MAIN_S) : 0,
          ease: EASE,
        }}
        inert={!mainReady}
        aria-hidden={!mainReady}
        style={{ pointerEvents: mainReady ? "auto" : "none" }}
      >
        {children}
      </motion.div>

      {portalEl ? createPortal(overlay, portalEl) : null}
    </>
  );
}
