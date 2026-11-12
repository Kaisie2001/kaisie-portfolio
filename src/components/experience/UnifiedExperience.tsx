'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import { WorkGallerySection } from '@/components/gallery/WorkGallerySection';
import { workGalleryProjects } from '@/components/gallery/workGalleryProjects';
import type { Lang } from '@/lib/portfolioCopy';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './experience.module.css';

const DURATION = 780;

/** Keep native scrolling inside the Hero/list; only a gesture starting at an
 * actual boundary may change screens. Horizontal gestures always stay native. */
function atScrollBoundary(target: EventTarget | null, root: HTMLElement, delta: number) {
  let element = target instanceof Element ? target.closest<HTMLElement>('*') : null;
  while (element && root.contains(element)) {
    if (/auto|scroll|overlay/.test(getComputedStyle(element).overflowY) && element.scrollHeight - element.clientHeight > 28) {
      if (delta > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 3) return false;
      if (delta < 0 && element.scrollTop > 2) return false;
    }
    if (element === root) break;
    element = element.parentElement;
  }
  return true;
}

export function UnifiedExperience() {
  const root = useRef<HTMLDivElement>(null);
  const { setLang: setSiteLang } = useLanguage();
  const screen = useRef<0 | 1>(0), lockedUntil = useRef(0), timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<{ next: 0 | 1; until: number } | null>(null);
  const [current, setCurrent] = useState<0 | 1>(0), [switching, setSwitching] = useState(false);
  const [galleryMounted, setGalleryMounted] = useState(false), [lang, setLang] = useState<Lang>('en');
  const onLanguageChange = useCallback((next: Lang) => { setLang(next); setSiteLang(next); }, [setSiteLang]);
  const projects = useMemo(() => workGalleryProjects(lang), [lang]);

  const scheduleCompletion = useCallback(() => {
    const transition = pending.current;
    if (!transition) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSwitching(false); if (transition.next === 0) setGalleryMounted(false);
      pending.current = null; timer.current = null;
    }, Math.max(0, transition.until - performance.now()));
  }, []);

  const navigate = useCallback((next: 0 | 1, initial = false) => {
    if (next === screen.current || (!initial && performance.now() < lockedUntil.current)) return;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 180 : DURATION;
    lockedUntil.current = performance.now() + duration + 90;
    screen.current = next; setCurrent(next); setSwitching(true);
    if (next === 1) setGalleryMounted(true);
    // Preserve the correct screen when returning from a real project document.
    history.replaceState(history.state, '', `${location.pathname}${location.search}#${next ? 'gallery' : 'hero'}`);
    pending.current = { next, until: performance.now() + duration };
    scheduleCompletion();
  }, [scheduleCompletion]);

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    if ((location.hash === '#gallery' || location.hash === '#work')) navigate(1, true);
    // React development Strict Effects may cancel the first timer during its
    // cleanup/setup check. Resume that same transition instead of getting stuck.
    scheduleCompletion();
    let accumulation = 0, lastWheel = 0;
    let touch: { x: number; y: number; down: boolean; up: boolean } | null = null;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const now = performance.now();
      if (now < lockedUntil.current) { event.preventDefault(); accumulation = 0; return; }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? host.clientHeight : 1);
      if (!atScrollBoundary(event.target, host, delta)) { accumulation = 0; return; }
      if (now - lastWheel > 160 || Math.sign(accumulation) !== Math.sign(delta)) accumulation = 0;
      lastWheel = now; accumulation += delta;
      if (Math.abs(accumulation) < 45) return;
      event.preventDefault(); const next = delta > 0 ? 1 : 0;
      accumulation = 0; navigate(next);
    };
    const touchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) { touch = null; return; }
      const p = event.touches[0];
      touch = { x: p.clientX, y: p.clientY, down: atScrollBoundary(event.target, host, 1), up: atScrollBoundary(event.target, host, -1) };
    };
    const touchEnd = (event: TouchEvent) => {
      const start = touch; touch = null;
      const end = event.changedTouches[0]; if (!start || !end) return;
      const dy = start.y - end.clientY, dx = start.x - end.clientX;
      if (Math.abs(dy) < 72 || Math.abs(dy) < Math.abs(dx) * 1.3) return;
      if ((dy > 0 ? start.down : start.up) && atScrollBoundary(event.target, host, dy)) navigate(dy > 0 ? 1 : 0);
    };
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable=true]'))) return;
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) return;
      const down = event.key === 'ArrowDown' || event.key === 'PageDown';
      if (!atScrollBoundary(event.target, host, down ? 1 : -1)) return;
      event.preventDefault(); navigate(down ? 1 : 0);
    };
    const hash = () => navigate((location.hash === '#gallery' || location.hash === '#work') ? 1 : 0);
    host.addEventListener('wheel', wheel, { passive: false });
    host.addEventListener('touchstart', touchStart, { passive: true, capture: true });
    host.addEventListener('touchend', touchEnd, { passive: true, capture: true });
    window.addEventListener('keydown', key); window.addEventListener('hashchange', hash);
    return () => {
      host.removeEventListener('wheel', wheel); host.removeEventListener('touchstart', touchStart, true); host.removeEventListener('touchend', touchEnd, true);
      window.removeEventListener('keydown', key); window.removeEventListener('hashchange', hash);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [navigate, scheduleCompletion]);

  return <div ref={root} id="cassy-unified-experience" className={styles.experience} data-experience-screen={current ? 'gallery' : 'hero'} data-transitioning={switching}>
    <div className={styles.panel} data-screen="hero" data-active={current === 0} aria-hidden={current !== 0} inert={current !== 0 || switching}>
      <HeroSection active={current === 0 && !switching} onLanguageChange={onLanguageChange} />
    </div>
    <div className={styles.panel} data-screen="gallery" data-active={current === 1} aria-hidden={current !== 1} inert={current !== 1 || switching}>
      {galleryMounted && <WorkGallerySection lang={lang} active={current === 1 && !switching} dark projects={projects} heading={lang === 'zh' ? '精选作品' : 'Selected Works'} />}
    </div>
    <span className={styles.srOnly} aria-live="polite">{current ? lang === 'zh' ? '第二屏：精选作品' : 'Screen 2: Selected Works' : lang === 'zh' ? '第一屏：个人介绍' : 'Screen 1: Introduction'}</span>
  </div>;
}
