"use client";
import { useEffect, useRef, useState, useId } from 'react';
import styles from './LineArtPortrait.module.css';
import { ParticleHalo } from './ParticleHalo';
import { useHeroActivity } from './HeroActivity';

const portraitPaths = [
  { part: 'main-outline', d: `M 569 220       C 588 204 611 193 637 193       C 689 187 751 219 796 265       C 829 299 850 345 849 387       C 849 424 831 454 798 472       C 792 475 788 478 788 486       C 788 502 804 516 812 526       C 821 540 799 545 783 554       C 776 559 782 570 775 576       C 767 580 770 587 769 592       C 768 598 756 597 753 603       C 750 619 745 635 730 641       C 709 652 671 641 634 631       C 625 649 621 669 626 685       C 632 713 660 730 691 739       C 729 751 779 750 820 757       C 861 764 896 782 921 815       C 946 849 943 883 918 912       C 900 934 875 947 852 954       C 811 963 765 967 732 972       C 689 979 646 993 624 1018       C 612 1031 617 1047 634 1060       C 660 1075 705 1067 733 1059       C 784 1044 824 1011 845 977       C 862 950 858 924 844 906       C 823 880 787 876 753 881       C 700 887 635 917 577 939       C 527 958 487 971 446 966       C 402 962 360 938 338 910       C 310 877 303 840 315 811       C 330 773 354 749 394 731       C 414 722 444 717 457 711       C 489 698 511 665 512 628       C 502 628 489 615 481 599       C 455 611 425 603 403 579       C 420 581 437 573 445 562       C 449 554 433 540 427 520       C 410 501 395 466 390 443       C 384 419 393 382 408 354       C 435 293 474 249 524 232       C 546 228 556 231 569 220` },
  { part: 'ear-jaw', d: `M 549 569       C 530 547 518 524 521 498       C 523 470 546 435 573 434       C 593 432 607 451 607 466       C 610 488 598 505 578 504       C 562 502 554 516 553 531       C 552 545 555 557 558 565       C 574 590 604 617 634 631` },
  { part: 'fringe-outer', d: `M 727 316       C 751 335 778 370 792 402       C 804 429 800 450 791 472` },
  { part: 'fringe-inner', d: `M 757 352       C 765 381 757 413 739 439       C 718 469 680 484 646 482` }
] as const;

type PortraitState = 'DRAWING' | 'EXPANDING' | 'REVEALED' | 'COLLAPSING';
const photoSource = '/images/hero/cassy-portrait.png';
const ease = 'cubic-bezier(.22,.61,.36,1)';

/** Native SVG + Web Animations. Only state boundaries render React; no RAF is added. */
export function LineArtPortrait({ label, language = 'en' }: { label: string; language?: 'en' | 'zh' }) {
  const pageActive = useHeroActivity();
  const pageActivity = useRef(pageActive);
  const syncActivity = useRef<(() => void) | null>(null);
  useEffect(() => { pageActivity.current = pageActive; syncActivity.current?.(); }, [pageActive]);
  const rootRef = useRef<HTMLButtonElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const photoLayerRef = useRef<HTMLSpanElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const active = useRef(new Set<Animation>());
  const mounted = useRef(false);
  const locked = useRef(false);
  const reduced = useRef(false);
  const transition = useRef(0);
  const phase = useRef<PortraitState>('DRAWING');
  const [state, setState] = useState<PortraitState>('DRAWING');
  const [photoError, setPhotoError] = useState(false);
  const photoId = useId();
  const glowId = useId().replace(/:/g, '');
  const paths = () => Array.from(rootRef.current?.querySelectorAll<SVGPathElement>('path[data-part]') ?? []);
  const setPhase = (next: PortraitState) => { phase.current = next; setState(next); };
  const cancelAnimations = () => { active.current.forEach(a => a.cancel()); active.current.clear(); };
  const stillCurrent = (id: number) => mounted.current && transition.current === id;

  function animate(element: Element | null, frames: Keyframe[], duration: number) {
    if (!element) return Promise.resolve();
    const animation = element.animate(frames, { duration, easing: ease, fill: 'forwards' });
    active.current.add(animation);
    if (document.hidden || !pageActivity.current) animation.pause();
    return animation.finished.then(() => undefined, () => undefined);
  }
  function resetPhoto() {
    const el = photoLayerRef.current;
    if (el) Object.assign(el.style, { opacity: '0', transform: 'scale(.86)', filter: 'blur(8px)', clipPath: 'ellipse(19% 24% at 50% 44%)' });
  }
  function restartInk() {
    // Restart exactly once, at the beginning of collapse; DRAWING does not restart it again.
    if (rootRef.current) rootRef.current.dataset.inkRunning = 'false';
    paths().forEach(p => { p.style.animation = 'none'; p.style.strokeDashoffset = '1000'; });
    if (rootRef.current) void rootRef.current.offsetWidth;
    paths().forEach(p => { p.style.removeProperty('animation'); p.style.removeProperty('stroke-dashoffset'); });
    if (rootRef.current) rootRef.current.dataset.inkRunning = 'true';
  }
  function finishRevealed() {
    if (rootRef.current) rootRef.current.dataset.inkRunning = 'false';
    paths().forEach(p => { p.style.animation = 'none'; p.style.strokeDashoffset = '0'; });
    if (inkRef.current) Object.assign(inkRef.current.style, { opacity: '0', transform: 'scale(1.12)', filter: 'blur(3px)' });
    if (photoLayerRef.current) Object.assign(photoLayerRef.current.style, { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)', clipPath: 'ellipse(75% 80% at 50% 44%)' });
    cancelAnimations();
    locked.current = false;
    setPhase('REVEALED');
  }
  function finishDrawing(restart = false) {
    resetPhoto();
    if (inkRef.current) Object.assign(inkRef.current.style, { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' });
    cancelAnimations();
    if (restart) restartInk();
    locked.current = false;
    setPhase('DRAWING');
  }

  useEffect(() => {
    mounted.current = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced.current = media.matches;
    const syncVisibility = () => {
      const paused = document.hidden || !pageActivity.current;
      if (rootRef.current) rootRef.current.dataset.paused = String(paused);
      active.current.forEach(a => {
        if (paused && a.playState === 'running') a.pause();
        else if (!paused && a.playState === 'paused') a.play();
      });
    };
    syncActivity.current = syncVisibility;
    const syncMotion = () => {
      reduced.current = media.matches;
      if (media.matches) {
        transition.current += 1;
        if (phase.current === 'EXPANDING') finishRevealed();
        else if (phase.current === 'COLLAPSING') finishDrawing(true);
      } else if (phase.current === 'DRAWING') restartInk();
    };
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    media.addEventListener('change', syncMotion);
    return () => {
      mounted.current = false;
      syncActivity.current = null;
      transition.current += 1;
      cancelAnimations();
      document.removeEventListener('visibilitychange', syncVisibility);
      media.removeEventListener('change', syncMotion);
    };
    // Helpers operate on stable refs. This subscription is installed once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function expand() {
    if (locked.current || phase.current !== 'DRAWING') return;
    locked.current = true;
    setPhotoError(false);
    const id = ++transition.current;
    const inkPaths = paths();
    const offsets = inkPaths.map(p => getComputedStyle(p).strokeDashoffset);
    // Freeze the exact current ink phase before changing state: no reset or flash.
    inkPaths.forEach((p, i) => { p.style.animation = 'none'; p.style.strokeDashoffset = offsets[i]; });
    if (rootRef.current) rootRef.current.dataset.inkRunning = 'false';
    setPhase('EXPANDING');
    try {
      const image = photoRef.current;
      if (!image) throw new Error('Portrait is missing');
      if (!image.complete || image.naturalWidth === 0) await image.decode();
      if (!stillCurrent(id)) return;
      if (!image.naturalWidth) throw new Error('Portrait failed to load');
      if (reduced.current) { finishRevealed(); return; }
      await Promise.all([
        ...inkPaths.map((p, i) => animate(p, [{ strokeDashoffset: offsets[i] }, { strokeDashoffset: '0' }], 220)),
        animate(inkRef.current, [{ transform: 'scale(1)', filter: 'brightness(1) blur(0px)' }, { transform: 'scale(1.035)', filter: 'brightness(1.1) blur(0px)' }], 220),
      ]);
      if (!stillCurrent(id)) return;
      await Promise.all([
        animate(inkRef.current, [
          { opacity: 1, transform: 'scale(1.035)', filter: 'brightness(1.1) blur(0px)' },
          { opacity: .5, offset: .48 },
          { opacity: 0, transform: 'scale(1.12)', filter: 'brightness(1.1) blur(3px)' },
        ], 780),
        animate(photoLayerRef.current, [
          { opacity: 0, transform: 'scale(.86)', filter: 'blur(8px)', clipPath: 'ellipse(19% 24% at 50% 44%)' },
          { opacity: .42, offset: .3, filter: 'blur(4px)' },
          { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)', clipPath: 'ellipse(75% 80% at 50% 44%)' },
        ], 780),
      ]);
      if (stillCurrent(id)) finishRevealed();
    } catch {
      if (!stillCurrent(id)) return;
      setPhotoError(true);
      finishDrawing(true);
    }
  }
  async function collapse() {
    if (locked.current || phase.current !== 'REVEALED') return;
    locked.current = true;
    const id = ++transition.current;
    setPhase('COLLAPSING');
    restartInk();
    if (reduced.current) { finishDrawing(); return; }
    await Promise.all([
      animate(photoLayerRef.current, [
        { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)', clipPath: 'ellipse(75% 80% at 50% 44%)' },
        { opacity: .35, offset: .55 },
        { opacity: 0, transform: 'scale(.86)', filter: 'blur(8px)', clipPath: 'ellipse(19% 24% at 50% 44%)' },
      ], 850),
      animate(inkRef.current, [
        { opacity: 0, transform: 'scale(.96)', filter: 'blur(2px)' },
        { opacity: .35, offset: .2 },
        { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
      ], 850),
    ]);
    if (stillCurrent(id)) finishDrawing();
  }
  const busy = state === 'EXPANDING' || state === 'COLLAPSING';
  const expanded = state === 'REVEALED' || state === 'EXPANDING';
  const actionLabel = language === 'zh'
    ? expanded ? '收起真实肖像，恢复线稿绘制' : '展开 Cassy Wu 的真实艺术肖像'
    : expanded ? 'Collapse portrait and resume drawing' : 'Reveal Cassy Wu’s art portrait';

  return <>
    <button ref={rootRef} type="button" className={styles.root}
      data-portrait-phase="2" data-state={state} data-photo-error={photoError}
      aria-label={actionLabel} aria-expanded={expanded} aria-controls={photoId}
      aria-busy={busy} aria-disabled={busy}
      onClick={() => { if (!locked.current) void (phase.current === 'DRAWING' ? expand() : collapse()); }}>
      <ParticleHalo phase={state} />
      <span className={styles.halo} aria-hidden="true" />
      <span className={styles.surface}>
        <span ref={photoLayerRef} id={photoId} className={styles.photoLayer} aria-hidden={state !== 'REVEALED'}>
          <img ref={photoRef} className={styles.photo} src={photoSource}
            width={1254} height={1254} loading="eager" decoding="async"
            alt={language === 'zh' ? 'Cassy Wu 的原始黑白艺术肖像，保留头部、肩膀及上半身' : 'Original black-and-white Cassy Wu portrait, showing head, shoulders and upper body'} />
        </span>
        <span ref={inkRef} className={styles.inkLayer} aria-hidden={state === 'REVEALED'}>
          <svg className={styles.drawing} viewBox="263.0 145.0 721.0 971.0" role="img" aria-label={label}>
            <defs>
              <filter id={glowId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            {/* All three copies mount together and share the same dash animation.
                paths() includes them all when freezing/completing/restarting ink. */}
            {(['outer', 'inner', 'original'] as const).map(layer => <g key={layer}
              data-ink-layer={layer} aria-hidden={layer !== 'original' ? true : undefined}
              className={layer === 'outer' ? styles.outerGlow : layer === 'inner' ? styles.innerGlow : styles.original}
              filter={layer === 'outer' ? `url(#${glowId})` : undefined}>
              {portraitPaths.map(({ part, d }) => <path key={part} data-part={part}
                className={`${styles.stroke} ${part !== 'main-outline' ? styles.detail : ''}`}
                pathLength={1000} d={d} />)}
            </g>)}
          </svg>
        </span>
      </span>
    </button>
    {photoError && <span role="status" className={styles.srOnly}>{language === 'zh' ? '真实肖像暂时无法加载，已保留线稿。' : 'Portrait could not load. The line drawing is still available.'}</span>}
  </>;
}
