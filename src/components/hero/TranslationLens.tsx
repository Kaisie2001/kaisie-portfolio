'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './TranslationLens.module.css';
import { KineticText } from './KineticText';
import { useKineticTypography } from './useKineticTypography';
import { useHeroActivity } from './HeroActivity';

const translations = ['始终保持对未知的好奇', '让探索跨越学科与领域的边界', '始终将目光聚焦于', '真实生活中值得解决的问题'];
const english = ['CURIOUS', 'ACROSS DISCIPLINES.', 'FOCUSED ON', 'REAL PROBLEMS.'];

export function TranslationLens({ children, className }: { children: ReactNode; className: string }) {
  const pageActive = useHeroActivity();
  const root = useRef<HTMLHeadingElement>(null);
  useKineticTypography(root);
  const englishLayer = useRef<HTMLSpanElement>(null);
  const frame = useRef(0), previous = useRef(0);
  const position = useRef({ x: 90, y: 90, tx: 90, ty: 90, initialized: false });
  const reduced = useRef(false), touching = useRef(false), openRef = useRef(false);
  const focusedPhrase = useRef(-1);
  const mouseInHero = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const [visible, setVisible] = useState(false);
  const descriptionId = useId();
  function open() { if (!openRef.current) { openRef.current = true; setVisible(true); } }
  function close() { openRef.current = false; setVisible(false); touching.current = false; focusedPhrase.current = -1; }
  useEffect(() => {
    if (!pageActive) {
      cancelAnimationFrame(frame.current); frame.current = 0; previous.current = 0;
      mouseInHero.current = false; lastPointer.current = null;
      position.current.initialized = false; close();
    }
  }, [pageActive]);
  function tick(now: number) {
    frame.current = 0;
    const p = position.current, el = root.current;
    if (!el) return;
    const dt = previous.current ? Math.min((now - previous.current) / 1000, .05) : 1 / 60;
    previous.current = now;
    const ease = reduced.current ? 1 : 1 - Math.exp(-dt / .065);
    p.x += (p.tx - p.x) * ease; p.y += (p.ty - p.y) * ease;
    el.style.setProperty('--lens-x', `${p.x}px`); el.style.setProperty('--lens-y', `${p.y}px`);
    if (Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > .06) frame.current = requestAnimationFrame(tick);
    else previous.current = 0;
  }
  function aim(clientX: number, clientY: number) {
    const el = root.current;
    if (!el) return;
    const box = el.getBoundingClientRect(), p = position.current;
    const diameter = Math.min(window.innerWidth <= 700 ? 124 : 184, box.height * .94, box.width * .82);
    el.style.setProperty('--lens-diameter', `${diameter}px`);
    const heroBox = el.closest('section')?.getBoundingClientRect();
    // Hero-local pointer minus the title's Hero-local origin. Negative / out-of-box
    // coordinates are intentional: only the circle/text intersection is visible.
    const heroX = clientX - (heroBox?.left ?? 0), heroY = clientY - (heroBox?.top ?? 0);
    p.tx = heroX - (box.left - (heroBox?.left ?? 0));
    p.ty = heroY - (box.top - (heroBox?.top ?? 0));
    if (!p.initialized) {
      p.x = p.tx; p.y = p.ty; p.initialized = true;
      // Set the first coordinate before enabling the masks; no one-frame flash at a default point.
      el.style.setProperty('--lens-x', `${p.x}px`); el.style.setProperty('--lens-y', `${p.y}px`);
    }
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  }
  function focusPhrase(index: number) {
    const el = englishLayer.current?.querySelector<HTMLElement>(`[data-lens-phrase="${index}"]`);
    if (!el) return;
    const b = el.getBoundingClientRect();
    aim(b.left + Math.min(b.width * .2, 180), b.top + b.height / 2);
    focusedPhrase.current = index; open();
  }
  useEffect(() => {
    if (!pageActive) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = root.current?.closest('section');
    const motion = () => { reduced.current = media.matches; };
    const outside = (event: PointerEvent) => { if (event.pointerType !== 'mouse' && !root.current?.contains(event.target as Node)) close(); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      mouseInHero.current = true; touching.current = false;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      aim(event.clientX, event.clientY); open();
    };
    const leaveHero = () => {
      mouseInHero.current = false; lastPointer.current = null;
      cancelAnimationFrame(frame.current); frame.current = 0; previous.current = 0; close();
    };
    const scroll = () => {
      const p = lastPointer.current;
      if (mouseInHero.current && p) aim(p.x, p.y);
    };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame.current); frame.current = 0; previous.current = 0; close(); } };
    // Copy only row geometry, never cursor coordinates, into the stationary Chinese layer.
    const fitRows = () => {
      const host = root.current;
      if (!host) return;
      const box = host.getBoundingClientRect();
      englishLayer.current?.querySelectorAll<HTMLElement>('[data-lens-phrase]').forEach((line, index) => {
        const row = line.getBoundingClientRect(), style = getComputedStyle(line);
        host.style.setProperty(`--row-${index}-top`, `${row.top - box.top}px`);
        host.style.setProperty(`--row-${index}-height`, `${row.height}px`);
        host.style.setProperty(`--row-${index}-leading`, style.lineHeight);
        const chinese = host.querySelector<HTMLElement>(`[data-chinese-row="${index}"]`);
        if (!chinese) return;
        // Measure text, not the full-width block line. Ranges retain the title's
        // reserved geometry even while its original typing animation is running.
        const range = document.createRange();
        range.selectNodeContents(line.querySelector('[data-kinetic-source]') ?? line);
        const englishWidth = range.getBoundingClientRect().width;
        const target = englishWidth * .98;
        const reference = parseFloat(style.fontSize);
        const maximum = Math.min(reference, row.height * .88);
        const spacingEm = .015;
        chinese.style.fontSize = `${reference}px`;
        chinese.style.letterSpacing = `${spacingEm}em`;
        range.selectNodeContents(chinese.querySelector('[data-kinetic-source]') ?? chinese);
        const naturalWidth = range.getBoundingClientRect().width;
        if (!naturalWidth || !target) return;
        let fontSize = Math.min(maximum, reference * target / naturalWidth);
        chinese.style.fontSize = `${fontSize}px`;
        // One measured correction absorbs browser subpixel/font rounding. No
        // transforms, horizontal stretching, or repeated characters are used.
        const measured = range.getBoundingClientRect().width;
        if (measured) {
          fontSize = Math.min(maximum, fontSize * target / measured);
          chinese.style.fontSize = `${fontSize}px`;
        }
        const fitted = range.getBoundingClientRect().width;
        if (fitted < englishWidth * .95) {
          // Only a small tracking adjustment if the vertical font-size cap binds.
          const extra = Math.min(fontSize * .08, (target - fitted) / translations[index].length + fontSize * spacingEm);
          chinese.style.letterSpacing = `${extra}px`;
        }
        chinese.dataset.englishTextWidth = englishWidth.toFixed(3);
        chinese.dataset.chineseTextWidth = range.getBoundingClientRect().width.toFixed(3);
      });
      host.dispatchEvent(new Event('hero:typography-layout'));
    };
    const resize = new ResizeObserver(fitRows);
    if (root.current) resize.observe(root.current);
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) fitRows(); });
    document.fonts.addEventListener('loadingdone', fitRows);
    motion(); fitRows(); media.addEventListener('change', motion);
    hero?.addEventListener('pointermove', move, { passive: true });
    hero?.addEventListener('pointerleave', leaveHero);
    hero?.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('pointerdown', outside); document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true; resize.disconnect(); cancelAnimationFrame(frame.current);
      document.fonts.removeEventListener('loadingdone', fitRows);
      hero?.removeEventListener('pointermove', move); hero?.removeEventListener('pointerleave', leaveHero); hero?.removeEventListener('scroll', scroll);
      media.removeEventListener('change', motion); document.removeEventListener('pointerdown', outside); document.removeEventListener('visibilitychange', visibility);
    };
  }, [pageActive]);

  return <h1 ref={root} className={`${className} ${styles.root}`} data-translation-lens="4" data-lens-version="seamless-hero-tracking-4.2" data-lens-open={visible}
    aria-label={english.join(' ')}
    onBlur={event => { if (!mouseInHero.current && !event.currentTarget.contains(event.relatedTarget)) close(); }}
    onPointerDown={event => { touching.current = event.pointerType === 'touch' || event.pointerType === 'pen'; }}
    onClick={event => {
      if (!touching.current) return;
      const phrase = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-lens-phrase]') : null;
      const index = Number(phrase?.dataset.lensPhrase ?? -1);
      if (openRef.current && focusedPhrase.current === index) close();
      else { aim(event.clientX, event.clientY); focusedPhrase.current = index; open(); }
    }}
    onKeyDown={event => {
      if (event.key === 'Escape') close();
      if (event.key.startsWith('Arrow')) {
        event.preventDefault(); const p = position.current, b = event.currentTarget.getBoundingClientRect();
        aim(b.left + p.tx + (event.key === 'ArrowRight' ? 36 : event.key === 'ArrowLeft' ? -36 : 0), b.top + p.ty + (event.key === 'ArrowDown' ? 36 : event.key === 'ArrowUp' ? -36 : 0)); open();
      }
    }}>
    {/* All four Chinese rows always exist here, anchored to the original English row boxes. */}
    <span className={styles.chinese} data-chinese-layer="true" aria-hidden="true" lang="zh-CN">
      {translations.map((text, index) => <span key={text} data-chinese-row={index}
        className={`${styles.chineseLine} ${index > 1 ? styles.red : ''}`}
        style={{ top: `var(--row-${index}-top, 0px)`, height: `var(--row-${index}-height, 1.015em)`, lineHeight: `var(--row-${index}-leading, 1.015)` }}><KineticText text={text} continuous /></span>)}
    </span>
    <span ref={englishLayer} className={styles.english} data-english-layer="true">{children}</span>
    <span className={styles.focusControls}>
      {english.map((text, index) => <button key={text} type="button" className={styles.focusControl}
        aria-label={`${text} — ${translations[index]}`} aria-describedby={descriptionId}
        onFocus={() => { if (!touching.current) focusPhrase(index); }}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (openRef.current && focusedPhrase.current === index) close(); else focusPhrase(index); } }}
        style={{ top: `${index * 25}%` }} />)}
    </span>
    <span id={descriptionId} className={styles.srOnly}>Tab to a phrase. Use arrow keys to move the reveal mask. Escape closes it.</span>
  </h1>;
}
