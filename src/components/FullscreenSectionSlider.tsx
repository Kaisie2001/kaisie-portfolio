"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const LOCK_MS = 900;
const TRANSITION_SEC = 0.82;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Ignore sub-pixel “scrollable” flex boxes so wheel can advance to the next slide. */
const MIN_SCROLL_OVERFLOW = 28;

function overflowAllowsScroll(el: HTMLElement): boolean {
  const y = window.getComputedStyle(el).overflowY;
  return y === "auto" || y === "scroll" || y === "overlay";
}

/**
 * Block deck page changes while the user is scrolling inside a region that
 * actually overflows (avoids trapping the wheel on tiny layout gaps).
 */
function wheelShouldChangeSlide(
  target: EventTarget | null,
  outer: HTMLElement,
  deltaY: number,
): boolean {
  const node = target as HTMLElement | null;
  if (!node || !outer.contains(node)) return false;
  let el: HTMLElement | null = node;
  while (el && outer.contains(el)) {
    const sh = el.scrollHeight;
    const ch = el.clientHeight;
    const overflow = overflowAllowsScroll(el);
    if (overflow && sh - ch > MIN_SCROLL_OVERFLOW) {
      const st = el.scrollTop;
      const top = st <= 2;
      const bottom = st + ch >= sh - 3;
      if (deltaY > 0 && !bottom) return false;
      if (deltaY < 0 && !top) return false;
    }
    if (el === outer) break;
    el = el.parentElement;
  }
  return true;
}

export type DeckSectionId = "home" | "work" | "about";

export type DeckSection = {
  id: DeckSectionId;
  label: string;
  content: ReactNode;
};

function parseHash(): DeckSectionId {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.slice(1).toLowerCase();
  if (h === "work") return "work";
  if (h === "about") return "about";
  return "home";
}

function idToIndex(sections: DeckSection[], id: DeckSectionId): number {
  const i = sections.findIndex((s) => s.id === id);
  return i < 0 ? 0 : i;
}

/**
 * Full-screen deck: one section at a time, wheel / keys / hash / touch.
 * Sections are not stacked as a long scrolling page.
 */
export function FullscreenSectionSlider({ sections }: { sections: DeckSection[] }) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const lockUntilRef = useRef(0);
  const activeIndexRef = useRef(0);
  const touchY0 = useRef<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const pushHashIfNeeded = useCallback((id: DeckSectionId) => {
    if (typeof window === "undefined") return;
    const next = `#${id}`;
    if (window.location.hash === next) return;
    window.location.hash = id;
  }, []);

  const navigateTo = useCallback(
    (targetIdx: number, dir: 1 | -1) => {
      const clamped = Math.max(0, Math.min(sections.length - 1, targetIdx));
      if (clamped === activeIndexRef.current) return false;
      const now = performance.now();
      if (now < lockUntilRef.current) return false;
      lockUntilRef.current = now + LOCK_MS;
      activeIndexRef.current = clamped;
      setDirection(dir);
      setActiveIndex(clamped);
      pushHashIfNeeded(sections[clamped]!.id);
      return true;
    },
    [pushHashIfNeeded, sections],
  );

  const goNext = useCallback(() => {
    navigateTo(activeIndexRef.current + 1, 1);
  }, [navigateTo]);

  const goPrev = useCallback(() => {
    navigateTo(activeIndexRef.current - 1, -1);
  }, [navigateTo]);

  useLayoutEffect(() => {
    const id = parseHash();
    const idx = idToIndex(sections, id);
    activeIndexRef.current = idx;
    setActiveIndex(idx);
  }, [sections]);

  useEffect(() => {
    const onHash = () => {
      const id = parseHash();
      const idx = idToIndex(sections, id);
      setActiveIndex((prev) => {
        if (idx === prev) return prev;
        setDirection(idx > prev ? 1 : -1);
        activeIndexRef.current = idx;
        return idx;
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [sections]);

  useEffect(() => {
    const onPop = () => {
      const id = parseHash();
      const idx = idToIndex(sections, id);
      setActiveIndex((prev) => {
        if (idx === prev) return prev;
        setDirection(idx > prev ? 1 : -1);
        activeIndexRef.current = idx;
        return idx;
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [sections]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable=true]")) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sc = scrollAreaRef.current;
    if (sc) sc.scrollTop = 0;
  }, [activeIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!el.contains(e.target as Node)) return;
      const now = performance.now();
      if (now < lockUntilRef.current) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < 12) return;
      if (!wheelShouldChangeSlide(e.target, el, e.deltaY)) return;
      e.preventDefault();
      if (e.deltaY > 0) goNext();
      else goPrev();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchY0.current = e.touches[0]?.clientY ?? null;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const y0 = touchY0.current;
      touchY0.current = null;
      if (y0 == null) return;
      const y1 = e.changedTouches[0]?.clientY ?? y0;
      const d = y0 - y1;
      if (d > 56) goNext();
      else if (d < -56) goPrev();
    },
    [goNext, goPrev],
  );

  const active = sections[activeIndex];

  const variants = useMemo(
    () => ({
      initial: (dir: 1 | -1) =>
        reduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: dir === 1 ? 40 : -40,
              filter: "blur(8px)",
            },
      animate: reduceMotion
        ? { opacity: 1 }
        : { opacity: 1, y: 0, filter: "blur(0px)" },
      exit: (dir: 1 | -1) =>
        reduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: dir === 1 ? -40 : 40,
              filter: "blur(8px)",
            },
    }),
    [reduceMotion],
  );

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-0 w-full flex-1 touch-pan-x flex-col overflow-hidden bg-[#f7f6f3]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={active?.id ?? "home"}
            role="region"
            aria-roledescription="slide"
            aria-label={active?.label}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: reduceMotion ? 0.2 : TRANSITION_SEC,
              ease: EASE,
            }}
            className="absolute inset-0 flex min-h-0 flex-col overflow-hidden"
          >
            <div
              ref={scrollAreaRef}
              className="mx-auto flex h-full w-full max-w-[1440px] min-h-0 flex-col overflow-y-auto overflow-x-hidden px-4 pb-24 pt-2 sm:px-6 sm:pb-28 sm:pt-3 lg:px-8 lg:pb-32"
            >
              {active?.content}
            </div>
          </motion.div>
        </AnimatePresence>

        <div
          className="pointer-events-none absolute bottom-3 right-4 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 sm:bottom-4 sm:right-6"
          aria-hidden
        >
          <span className="rounded border border-stone-200/80 bg-[#f7f6f3]/90 px-2 py-1">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(sections.length).padStart(2, "0")}
          </span>
        </div>
    </div>
  );
}
