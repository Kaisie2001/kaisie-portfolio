'use client';

import { useEffect, useRef } from 'react';
import { identityDuration, identityRevealAt, playIdentity } from './identityMotion';
import styles from './identity.module.css';

export function ModularIntro({ onReveal, onComplete }: { onReveal: () => void; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const finishCurrent = useRef<() => void>(() => {});
  useEffect(() => {
    const element = root.current;
    const hero = element?.parentElement?.querySelector<HTMLElement>('[data-hero-version]');
    if (!element || !hero) { onReveal(); onComplete(); return; }
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, finishing = false, revealed = false;
    let controller: ReturnType<typeof playIdentity> | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    let fontTimer: ReturnType<typeof setTimeout> | undefined;
    let releaseFrame = 0, commitFrame = 0;
    const reveal = () => { if (!disposed && !revealed) { revealed = true; onReveal(); } };
    const finish = () => {
      if (disposed || finishing) return;
      finishing = true;
      clearTimeout(fontTimer); clearTimeout(revealTimer); clearTimeout(watchdog);
      reveal();
      // Keep the veil for two paint boundaries so Hero's original effect can
      // initialise before Skip/failure removes the overlay. Never remount Hero.
      releaseFrame = requestAnimationFrame(() => {
        commitFrame = requestAnimationFrame(() => {
          if (disposed) return;
          controller?.cancel(); onComplete();
        });
      });
    };
    finishCurrent.current = finish;
    const start = () => {
      if (disposed || finishing) return;
      if (media.matches || typeof element.animate !== 'function') { finish(); return; }
      try {
        controller = playIdentity(element, hero, finish);
        revealTimer = setTimeout(reveal, identityRevealAt);
        watchdog = setTimeout(finish, identityDuration + 300);
      } catch { finish(); }
    };
    if (media.matches || location.hash === '#gallery' || location.hash === '#work') finish();
    else {
      // Only reuse the Hero font. No imagery or resources belong to the intro.
      fontTimer = setTimeout(finish, 650);
      Promise.all([
        document.fonts.load('400 24px MiSans', 'CURIOUS'),
        document.fonts.load('900 24px MiSans', 'CURIOUS ACROSS DISCIPLINES. FOCUSED ON REAL PROBLEMS.'),
        document.fonts.load('700 22px MiSans', 'Cassy Wu'),
      ]).then(fonts => {
        clearTimeout(fontTimer);
        if (fonts.every(face => face.length > 0)) start(); else finish();
      }).catch(finish);
    }
    const reduce = () => { if (media.matches) finish(); };
    const pageShow = (event: PageTransitionEvent) => { if (event.persisted) finish(); };
    const exit = () => finish();
    const width = innerWidth, height = innerHeight;
    const resize = () => { if (Math.abs(innerWidth-width)>40 || Math.abs(innerHeight-height)>120) finish(); };
    const visibility = () => {
      if (document.hidden) {
        clearTimeout(revealTimer); clearTimeout(watchdog);
        controller?.animations.forEach(animation => animation.pause());
      } else finish(); // Return to the real, usable Hero; no stale assembly.
    };
    media.addEventListener('change', reduce);
    window.addEventListener('pageshow', pageShow);
    window.addEventListener('pagehide', exit);
    window.addEventListener('popstate', exit);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true;
      clearTimeout(fontTimer); clearTimeout(revealTimer); clearTimeout(watchdog);
      cancelAnimationFrame(releaseFrame); cancelAnimationFrame(commitFrame); controller?.cancel();
      media.removeEventListener('change', reduce);
      window.removeEventListener('pageshow', pageShow); window.removeEventListener('pagehide', exit);
      window.removeEventListener('popstate', exit); window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [onReveal, onComplete]);
  return <div ref={root} className={styles.overlay} data-identity-opening data-state="pending" aria-label="Portfolio opening animation">
    <div className={styles.veil} data-assembly-veil aria-hidden="true" />
    <div className={styles.modules} aria-hidden="true">
      {[0,1,2,3,4,5].map(index => <span key={index} className={styles.module} data-assembly-piece />)}
    </div>
    <button className={styles.skip} onClick={() => finishCurrent.current()}>Skip Intro</button>
  </div>;
}
