/** Overlay only. Read the accepted Hero's geometry; never move or clone its DOM. */
export const identityDuration = 3800;
export const identityRevealAt = 2350;
const precise = 'cubic-bezier(.65,0,.25,1)';
const glide = 'cubic-bezier(.22,.61,.36,1)';

type Box = { x: number; y: number; width: number; height: number };
export function fragmentOrigins(width: number, height: number): Box[] {
  const u = Math.min(width <= 700 ? 34 : 58, width * .08);
  const cx = width * .5, cy = height * .45;
  return [
    { x: cx - 2.4*u, y: cy - 1.6*u, width: .65*u, height: 2 },
    { x: cx - 1.4*u, y: cy - .15*u, width: 1.3*u, height: 1.05*u },
    { x: cx + 1.15*u, y: cy - 1.1*u, width: 2, height: .85*u },
    { x: cx + .45*u, y: cy + .5*u, width: .9*u, height: .25*u },
    { x: cx - 2.25*u, y: cy + 1.15*u, width: .8*u, height: .4*u },
    { x: cx + 2*u, y: cy + 1.4*u, width: 5, height: 5 },
  ];
}

export function heroTargets(hero: HTMLElement, viewport: DOMRect): Box[] {
  const rows = Array.from(hero.querySelectorAll<HTMLElement>('[data-english-layer] [data-lens-phrase]'));
  const nodes = [hero.querySelector<HTMLElement>('header > span'), hero.querySelector<HTMLElement>('[data-portrait-phase]'), ...rows];
  if (nodes.length !== 6 || nodes.some(node => !node)) throw new Error('Accepted Hero geometry is not ready');
  return nodes.map(node => {
    const box = node!.getBoundingClientRect();
    return { x: box.left - viewport.left, y: box.top - viewport.top, width: box.width, height: box.height };
  });
}

export function playIdentity(overlay: HTMLElement, hero: HTMLElement, onFinish: () => void) {
  const viewport = overlay.getBoundingClientRect();
  const targets = heroTargets(hero, viewport);
  const origins = fragmentOrigins(viewport.width, viewport.height);
  const pieces = Array.from(overlay.querySelectorAll<HTMLElement>('[data-assembly-piece]'));
  const veil = overlay.querySelector<HTMLElement>('[data-assembly-veil]');
  if (pieces.length !== targets.length || !veil) throw new Error('Assembly layer is incomplete');
  const animations: Animation[] = [];
  let cancelled = false;
  const cancel = () => { cancelled = true; animations.forEach(animation => animation.cancel()); };
  try {
    overlay.dataset.state = 'playing';
    pieces.forEach((piece, index) => {
      const target = targets[index], source = origins[index];
      // These boxes are in the overlay, not wrappers around the Hero elements.
      Object.assign(piece.style, { left: `${target.x}px`, top: `${target.y}px`, width: `${target.width}px`, height: `${target.height}px` });
      const start = `translate(${source.x-target.x}px,${source.y-target.y}px) scale(${source.width/Math.max(1,target.width)},${source.height/Math.max(1,target.height)})`;
      const laneX = viewport.width * (index === 1 ? .19 : .48);
      const laneY = viewport.height * (.24 + index * .075);
      const lane = `translate(${laneX-target.x}px,${laneY-target.y}px) scale(${Math.min(.48,source.width*2.2/Math.max(1,target.width))},${Math.min(.72,source.height*1.4/Math.max(1,target.height))})`;
      const delay = [70,260,450,670,880,1080][index];
      animations.push(piece.animate([
        { opacity: 0, transform: start, offset: 0 },
        { opacity: .9, transform: start, offset: .12, easing: precise },
        { opacity: .85, transform: lane, offset: .43 },
        { opacity: .85, transform: lane, offset: .53, easing: precise },
        { opacity: .56, transform: 'translate(0,0) scale(1,1)', offset: .84, easing: glide },
        { opacity: .32, transform: 'translate(0,0) scale(1,1)', offset: 1 },
      ], { delay, duration: 2620-delay, fill: 'both', easing: 'linear' }));
      // The assembled outlines recede while the same Hero shows through them.
      animations.push(piece.animate([
        { opacity: .32, transform: 'translate(0,0) scale(1,1)' },
        { opacity: 0, transform: 'translate(0,-8px) scale(.99,.99)' },
      ], { delay: 2620, duration: 850+index*40, fill: 'forwards', easing: glide }));
    });
    animations.push(veil.animate([
      { opacity: 1, offset: 0 },
      { opacity: 1, offset: .67 },
      { opacity: .78, offset: .78 },
      { opacity: 0, offset: 1 },
    ], { duration: identityDuration, easing: 'linear', fill: 'both' }));
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (!cancelled) onFinish();
    }).catch(() => { /* Expected when skipped, resized, or unmounted. */ });
  } catch (error) { cancel(); throw error; }
  return { cancel, animations };
}
