'use client';
import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { useHeroActivity } from './HeroActivity';

type Glyph = {
  ink: HTMLElement; set: (value: string) => void;
  x: number; y: number; rowHeight: number;
  offset: number; velocity: number;
};
type Ripple = { x: number; y: number; direction: number; strength: number; born: number };

// One controller/ticker for both language layers. Character positions are always
// read from the original inline anchors; transforms only touch their visual copies.
export function useKineticTypography(root: RefObject<HTMLHeadingElement | null>) {
  const pageActive = useHeroActivity(), pageActivity = useRef(pageActive);
  const stopActivity = useRef<(() => void) | null>(null);
  useEffect(() => { pageActivity.current = pageActive; if (!pageActive) stopActivity.current?.(); }, [pageActive]);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const host: HTMLHeadingElement = node, hero = host.closest('section');
    if (!hero) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let glyphs: Glyph[] = [], ripples: Ripple[] = [];
    let bounds = host.getBoundingClientRect();
    let running = false, disposed = false, inView = true;
    let last = { x: 0, y: 0, at: 0 }, lastEmission = 0, lastInput = 0;
    let direction = 1, frames = 0, cpu = 0, peak = 0;
    const allowed = () => pageActivity.current && !reduce.matches && fine.matches && !document.hidden && inView;
    const state = (value: string) => { if (host.dataset.kineticState !== value) host.dataset.kineticState = value; };

    function stop(reset = false) {
      gsap.ticker.remove(tick); running = false;
      if (reset) glyphs.forEach(glyph => {
        glyph.offset = glyph.velocity = 0; glyph.ink.style.removeProperty('--kinetic-transform');
      });
      ripples = []; last.at = 0;
      host.dataset.kineticFrames = String(frames);
      host.dataset.kineticCpuMs = (cpu / Math.max(1, frames)).toFixed(3);
      host.dataset.kineticPeakPx = peak.toFixed(3);
      state(reduce.matches ? 'reduced' : 'rest');
    }
    stopActivity.current = () => stop(true);

    function measure() {
      bounds = host.getBoundingClientRect();
      const next: Glyph[] = [];
      host.querySelectorAll<HTMLElement>('[data-lens-phrase], [data-chinese-row]').forEach(row => {
        const box = row.getBoundingClientRect();
        const source = row.querySelector<HTMLElement>('[data-kinetic-source]');
        if (!source) return;
        const anchors = source.querySelectorAll<HTMLElement>('[data-kinetic-anchor]');
        const slots = row.querySelectorAll<HTMLElement>('[data-kinetic-slot]');
        // Chinese retains its original single text run for identical font fitting
        // and tracking. Subranges locate each glyph without splitting that run.
        let offset = 0;
        Array.from(source.textContent ?? '').forEach((characterText, index) => {
          const range = document.createRange();
          if (anchors.length) range.selectNodeContents(anchors[index]);
          else if (source.firstChild) {
            range.setStart(source.firstChild, offset);
            range.setEnd(source.firstChild, offset + characterText.length);
          }
          offset += characterText.length;
          const character = range.getBoundingClientRect(), slot = slots[index];
          const ink = slot?.firstElementChild as HTMLElement | null;
          if (!ink) return;
          slot.style.left = `${character.left - box.left}px`;
          slot.style.width = `${character.width}px`;
          slot.style.height = `${box.height}px`;
          next.push({ ink, set: gsap.quickSetter(ink, '--kinetic-transform') as (value: string) => void,
            x: character.left - bounds.left + character.width / 2,
            y: box.top - bounds.top + box.height / 2, rowHeight: box.height, offset: 0, velocity: 0 });
        });
        row.dataset.kineticReady = 'true';
      });
      stop(true); glyphs = next;
      host.dataset.kineticGlyphs = String(glyphs.length);
    }

    function tick(_time: number, deltaMs: number) {
      const started = performance.now(), now = started / 1000;
      if (!allowed()) { stop(true); return; }
      const dt = Math.min(Math.max(deltaMs / 1000, .001), .032);
      ripples = ripples.filter(ripple => now - ripple.born < .62);
      // A stopped cursor must settle, rather than sustaining a hover oscillator.
      const quiet = Math.exp(-Math.max(0, now - lastInput - .075) / .105);
      let moving = false;
      for (const glyph of glyphs) {
        let force = 0;
        for (const ripple of ripples) {
          const dx = glyph.x - ripple.x, dy = Math.abs(glyph.y - ripple.y);
          const distance = Math.abs(dx), radius = 150;
          if (distance >= radius || dy > glyph.rowHeight * .64) continue;
          // Retarded wave time: adjacent ~20px glyphs respond ~22ms apart.
          const age = now - ripple.born - distance / 900;
          if (age < 0) continue;
          const spatial = (1 - distance / radius) ** 2 * Math.max(0, 1 - dy / (glyph.rowHeight * .64));
          const directional = dx * ripple.direction >= 0 ? 1 : .58;
          const envelope = (1 - Math.exp(-age / .025)) * Math.exp(-age / .145);
          force += Math.sin(age * 20 - dx * ripple.direction * .012) * spatial * envelope * ripple.strength * directional;
        }
        const target = Math.max(-3.8, Math.min(3.8, force * 11.5 * quiet));
        // Damped spring, subdivided for stable 30/60/120Hz behavior.
        const steps = Math.ceil(dt / (1 / 120)), step = dt / steps;
        for (let i = 0; i < steps; i++) {
          glyph.velocity += ((target - glyph.offset) * 210 - glyph.velocity * 25) * step;
          glyph.offset += glyph.velocity * step;
        }
        const y = Math.max(-3.8, Math.min(3.8, glyph.offset));
        peak = Math.max(peak, Math.abs(y));
        const rotation = y * .23, stretch = y * .0038;
        glyph.set(`translate3d(${(y * .14).toFixed(3)}px,${y.toFixed(3)}px,0) rotate(${rotation.toFixed(3)}deg) scale(${(1 + stretch).toFixed(5)},${(1 - stretch).toFixed(5)})`);
        if (Math.abs(y) > .008 || Math.abs(glyph.velocity) > .03) moving = true;
      }
      frames++; cpu += performance.now() - started;
      if (now - lastInput > .1) state('settling');
      if (!moving && (!ripples.length || quiet < .005)) stop(true);
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !allowed()) return;
      const now = performance.now() / 1000;
      const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      // Narrow per-row activation; empty Hero/portrait/body never keep the wave alive.
      const near = glyphs.some(glyph => Math.abs(glyph.y - y) < glyph.rowHeight * .6 && Math.abs(glyph.x - x) < 72);
      if (!near) { leave(); return; }
      const elapsed = last.at ? now - last.at : 0;
      const dx = x - last.x, dy = y - last.y;
      const travel = Math.hypot(dx, dy);
      const speed = elapsed > 0 ? Math.min(1800, travel / Math.max(.008, elapsed)) : 250;
      if (last.at && travel < .35) return;
      if (last.at && Math.abs(dx) > 1.5) direction = dx > 0 ? 1 : -1;
      lastInput = now;
      if (now - lastEmission >= .018) {
        ripples.push({ x, y, direction, strength: .55 + speed / 1800 * .85, born: now });
        if (ripples.length > 24) ripples.shift();
        lastEmission = now;
      }
      last = { x, y, at: now }; state('active');
      if (!running) {
        frames = cpu = peak = 0; running = true; gsap.ticker.add(tick);
      }
    }
    function leave() {
      // Stop excitation, let the spring finish. This never touches Lens tracking.
      ripples = []; last.at = 0;
      if (running) state('settling');
    }
    function preference() { if (!allowed()) stop(true); else state('rest'); }
    function scroll() { bounds = host.getBoundingClientRect(); leave(); }
    const resize = new ResizeObserver(measure); resize.observe(host);
    const intersection = new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false; if (!inView) stop(true);
    }); intersection.observe(host);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    document.fonts.addEventListener('loadingdone', measure);
    host.addEventListener('hero:typography-layout', measure);
    hero.addEventListener('pointermove', move as EventListener, { passive: true });
    hero.addEventListener('pointerleave', leave);
    hero.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', preference);
    reduce.addEventListener('change', preference); fine.addEventListener('change', preference);
    measure(); preference();
    return () => {
      disposed = true; stopActivity.current = null; stop(true); resize.disconnect(); intersection.disconnect();
      document.fonts.removeEventListener('loadingdone', measure);
      host.removeEventListener('hero:typography-layout', measure);
      hero.removeEventListener('pointermove', move as EventListener);
      hero.removeEventListener('pointerleave', leave); hero.removeEventListener('scroll', scroll);
      document.removeEventListener('visibilitychange', preference);
      reduce.removeEventListener('change', preference); fine.removeEventListener('change', preference);
    };
  }, [root]);
}
