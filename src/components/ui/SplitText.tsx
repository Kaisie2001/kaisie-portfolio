"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type FC,
} from "react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type SplitTextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: SplitTextTag;
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  /**
   * When true, animate as soon as text is split (no ScrollTrigger).
   * Use for above-the-fold hero copy — default ScrollTrigger start can miss
   * elements that are already in view at page load.
   */
  immediate?: boolean;
  /**
   * Wait for the full-screen home intro to finish (`data-home-intro-done` on
   * `<html>`) before splitting/animating. Prevents the stagger from running
   * while the page is still `opacity-0` under the intro overlay.
   */
  syncWithHomeIntro?: boolean;
}

type ElWithSplit = HTMLElement & {
  _rbsplitInstance?: GSAPSplitText;
};

function useHomeIntroDoneSync(enabled: boolean): boolean {
  const [ready, setReady] = useState(() => {
    if (!enabled || typeof document === "undefined") return true;
    return document.documentElement.dataset.homeIntroDone === "true";
  });

  useEffect(() => {
    if (!enabled) {
      setReady(true);
      return;
    }
    const read = () => {
      setReady(document.documentElement.dataset.homeIntroDone === "true");
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-home-intro-done"],
    });
    return () => mo.disconnect();
  }, [enabled]);

  return ready;
}

const SplitText: FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
  immediate = false,
  syncWithHomeIntro = false,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const homeIntroDone = useHomeIntroDoneSync(
    Boolean(immediate && syncWithHomeIntro),
  );

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      void document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      if (!ref.current || !text || !fontsLoaded || !homeIntroDone) return;
      if (animationCompletedRef.current) return;

      const el = ref.current as ElWithSplit;

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch {
          /* ignore */
        }
        el._rbsplitInstance = undefined;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets: Element[] = [];
      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes("chars") && self.chars?.length) {
          targets = self.chars;
        }
        if (!targets.length && splitType.includes("words") && self.words.length) {
          targets = self.words;
        }
        if (!targets.length && splitType.includes("lines") && self.lines.length) {
          targets = self.lines;
        }
        if (!targets.length) {
          targets = self.chars || self.words || self.lines;
        }
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self: GSAPSplitText) => {
          assignTargets(self);
          const tweenVars: gsap.TweenVars = {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            onComplete: () => {
              animationCompletedRef.current = true;
              onCompleteRef.current?.();
            },
            willChange: "transform, opacity",
            force3D: true,
          };
          if (!immediate) {
            tweenVars.scrollTrigger = {
              trigger: el,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4,
            };
          }
          return gsap.fromTo(targets, { ...from }, tweenVars);
        },
      });
      el._rbsplitInstance = splitInstance;

      return () => {
        animationCompletedRef.current = false;
        if (!immediate) {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger === el) st.kill();
          });
        }
        try {
          splitInstance.revert();
        } catch {
          /* ignore */
        }
        el._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        immediate,
        homeIntroDone,
      ],
      scope: ref,
    },
  );

  const style: CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };

  const layoutClass = tag === "span" ? "inline-block" : "block w-full min-w-0";
  const classes = `split-parent overflow-hidden ${layoutClass} whitespace-normal ${className}`;
  const Tag = tag as ElementType;

  return (
    <Tag ref={ref as never} style={style} className={classes}>
      {text}
    </Tag>
  );
};

export default SplitText;
