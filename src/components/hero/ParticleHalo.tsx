'use client';
import { useEffect, useRef } from 'react';
import styles from './ParticleHalo.module.css';
import { useHeroActivity } from './HeroActivity';

type PortraitPhase = 'DRAWING' | 'EXPANDING' | 'REVEALED' | 'COLLAPSING';
type Dust = {
  layer: 'fine' | 'floating' | 'glow'; age: number; life: number;
  x: number; startY: number; speed: number; drift: number;
  phase: number; radius: number; opacity: number; fade: number; generation: number;
};
const random = (a: number, b: number) => a + Math.random() * (b - a);
const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const strength = (phase: PortraitPhase) => phase === 'REVEALED' || phase === 'EXPANDING' ? 1 : .4;

/** One local clock, no React frame updates; portrait transitions only set the target strength. */
export function ParticleHalo({ phase }: { phase: PortraitPhase }) {
  const pageActive = useHeroActivity();
  const pageActivity = useRef(pageActive);
  const syncActivity = useRef<(() => void) | null>(null);
  useEffect(() => { pageActivity.current = pageActive; syncActivity.current?.(); }, [pageActive]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const redrawStatic = useRef<(() => void) | null>(null);
  useEffect(() => { phaseRef.current = phase; redrawStatic.current?.(); }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 700px)');
    const device = navigator as Navigator & { deviceMemory?: number };
    const constrained = (device.hardwareConcurrency || 8) <= 2 || (device.deviceMemory || 8) <= 2;
    let width = 0, height = 0, dpr = 0, particles: Dust[] = [];
    let frame = 0, previous = 0, visible = true, disposed = false;
    let intensity = strength(phaseRef.current), elapsed = 0, respawns = 0;
    let sampleTime = 0, frames = 0, drawTotal = 0, drawMax = 0;
    const drawTimes: number[] = [];

    // Cached, irregular soft texture: several unequal elliptical lobes, not a blurred ball.
    const mist = document.createElement('canvas');
    mist.width = 192; mist.height = 256;
    const mistContext = mist.getContext('2d');
    if (mistContext) {
      for (const [x, y, sx, sy, alpha] of [[91, 124, 70, 105, .3], [65, 166, 48, 71, .21], [119, 85, 42, 61, .19]]) {
        mistContext.save(); mistContext.translate(x, y); mistContext.scale(sx, sy);
        const gradient = mistContext.createRadialGradient(0, 0, 0, 0, 0, 1);
        gradient.addColorStop(0, `rgba(134,134,134,${alpha})`);
        gradient.addColorStop(.45, `rgba(95,95,95,${alpha * .36})`);
        gradient.addColorStop(1, 'rgba(60,60,60,0)');
        mistContext.fillStyle = gradient; mistContext.fillRect(-1, -1, 2, 2); mistContext.restore();
      }
    }
    function spawn(layer: Dust['layer'], generation = 0): Dust {
      const glow = layer === 'glow', fine = layer === 'fine';
      // Triangular clusters create more dust in the middle without a uniform grid.
      // Side-biased clusters stay visible around the silhouette rather than hiding under the PNG.
      const cluster = Math.random();
      const center = cluster < .46 ? .16 : cluster < .92 ? .84 : .5;
      return {
        layer, age: 0, life: random(glow || fine ? 12 : 8, 16),
        x: center + (Math.random() + Math.random() - 1) * (glow ? .18 : .19),
        // A full local ascent must be perceptible within one life, even in the tall desktop box.
        startY: random(.73, .9), speed: random(glow ? 7 : fine ? 10 : 16, glow ? 12 : fine ? 16 : 24) * Math.min(1.5, Math.max(1, height / 350)),
        drift: random(4, 12), phase: random(0, Math.PI * 2),
        radius: random(glow ? .13 : fine ? .35 : .65, glow ? .24 : fine ? .6 : 1.1),
        opacity: random(glow ? .12 : fine ? .2 : .35, glow ? .23 : fine ? .38 : .65),
        fade: random(.45, .67), generation,
      };
    }
    function initialize() {
      const total = mobile.matches ? constrained ? 56 : 72 : constrained ? 152 : 196;
      const floating = Math.round(total * .24);
      particles = Array.from({ length: total + (mobile.matches ? 4 : 6) }, (_, i) => {
        const particle = spawn(i >= total ? 'glow' : i < total - floating ? 'fine' : 'floating');
        particle.age = Math.random() * particle.life; // Warm start: independent lifetimes, no first-frame burst.
        return particle;
      });
      canvas!.dataset.particleCount = String(total);
      canvas!.dataset.glowCount = mobile.matches ? '4' : '6';
    }
    function paint(dt: number) {
      const started = performance.now();
      elapsed += dt;
      intensity += (strength(phaseRef.current) - intensity) * (1 - Math.exp(-dt / .48));
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          p = particles[i] = spawn(p.layer, p.generation + 1); respawns++;
        }
        const t = p.age / p.life;
        const x = p.x * width + Math.sin(p.phase + t * 3.4) * p.drift + Math.sin(p.phase * .7 + t * 2) * p.drift * .25;
        const y = p.startY * height - p.age * p.speed;
        const nx = (x / width - .51) / .49, ny = (y / height - .5) / .58;
        const edge = Math.pow(Math.max(0, 1 - nx * nx - ny * ny), .35);
        const envelope = smooth(0, .16, t) * (1 - smooth(p.fade, 1, t));
        // Extra stars emerge through an opacity ramp, never by adding/removing a burst of DOM nodes.
        const density = p.layer === 'fine' && i % 3 === 0 ? .3 + .7 * smooth(.4, .85, intensity) : 1;
        const alpha = p.opacity * envelope * edge * intensity * density;
        if (alpha < .001) continue;
        ctx!.globalAlpha = alpha;
        if (p.layer === 'glow') {
          const w = p.radius * width * (1 + t * .7);
          ctx!.save(); ctx!.translate(x, y); ctx!.rotate(Math.sin(p.phase) * .35);
          ctx!.drawImage(mist, -w / 2, -w * .8, w, w * 1.6); ctx!.restore();
        } else {
          ctx!.fillStyle = p.layer === 'fine' ? '#c6c6c6' : '#dfdfdf';
          ctx!.beginPath(); ctx!.arc(x, y, p.radius, 0, Math.PI * 2); ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;
      const cost = performance.now() - started;
      drawTotal += cost; drawMax = Math.max(drawMax, cost); drawTimes.push(cost);
      if (drawTimes.length > 180) drawTimes.shift();
      frames++;
    }
    function report(now: number) {
      if (!sampleTime) sampleTime = now;
      const seconds = (now - sampleTime) / 1000;
      if (seconds < 1) return;
      const sorted = [...drawTimes].sort((a, b) => a - b);
      // Low-frequency diagnostics for QA; no per-frame React renders or visible debug UI.
      canvas!.dataset.particleMetrics = JSON.stringify({
        fps: +(frames / seconds).toFixed(1), drawMeanMs: +(drawTotal / frames).toFixed(3),
        drawP95Ms: +(sorted[Math.floor(sorted.length * .95)] || 0).toFixed(3), drawMaxMs: +drawMax.toFixed(3),
        intensity: +intensity.toFixed(3), elapsed: +elapsed.toFixed(2), respawns,
        width: +width.toFixed(1), height: +height.toFixed(1), dpr,
        sample: particles.slice(0, 4).map(p => ({ age: +p.age.toFixed(2), life: +p.life.toFixed(2), speed: +p.speed.toFixed(2), y: +(p.startY * height - p.age * p.speed).toFixed(2), generation: p.generation })),
      });
      frames = 0; drawTotal = 0; drawMax = 0; sampleTime = now;
    }
    function tick(now: number) {
      frame = 0;
      if (disposed || document.hidden || !pageActivity.current || !visible || media.matches) return;
      const dt = previous ? Math.min((now - previous) / 1000, .05) : 0;
      previous = now;
      paint(dt); report(now);
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      frames = 0; drawTotal = 0; drawMax = 0; sampleTime = 0;
      const running = !disposed && !document.hidden && pageActivity.current && visible && !media.matches;
      if (document.hidden) canvas!.dataset.visibilityPauses = String(Number(canvas!.dataset.visibilityPauses || 0) + 1);
      if (!visible) canvas!.dataset.offscreenPauses = String(Number(canvas!.dataset.offscreenPauses || 0) + 1);
      canvas!.dataset.particleStatus = running ? 'running' : media.matches ? 'static' : 'paused';
      if (media.matches) { intensity = strength(phaseRef.current); paint(0); }
      else if (running && width && height) frame = requestAnimationFrame(tick);
    }
    function fit() {
      // CSS pixels from the local box, not screen coordinates (transformed QA iframes included).
      const nextWidth = canvas!.clientWidth, nextHeight = canvas!.clientHeight;
      const nextDpr = Math.min(window.devicePixelRatio || 1, constrained ? 1.25 : 1.75);
      if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;
      width = nextWidth; height = nextHeight; dpr = nextDpr;
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!particles.length) initialize();
      paint(0); sync();
    }
    syncActivity.current = sync;
    const resize = new ResizeObserver(fit);
    resize.observe(canvas);
    const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync(); }, { threshold: 0 });
    intersection.observe(canvas);
    const deviceChange = () => { initialize(); fit(); sync(); };
    redrawStatic.current = () => { if (media.matches) { intensity = strength(phaseRef.current); paint(0); } };
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', fit);
    media.addEventListener('change', sync);
    mobile.addEventListener('change', deviceChange);
    fit();
    return () => {
      disposed = true; cancelAnimationFrame(frame); redrawStatic.current = null;
      syncActivity.current = null;
      resize.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', fit);
      media.removeEventListener('change', sync);
      mobile.removeEventListener('change', deviceChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true"
    data-particle-halo="3" data-portrait-state={phase} />;
}
