import type { GalleryFixture } from './galleryFixtures';

export const BASE_ORBIT_DURATION = 8;
export const EDGE_SPEED_MULTIPLIER = 3;
export const FLIP_CYCLE_DURATION = 3.6;
export const FLIP_ACTIVE_DURATION = .8;

/** Independent clocks. Orbit phase is seconds at the base rate, not a multiplier stack. */
export const galleryMotion = {
  orbit: { period: BASE_ORBIT_DURATION, radiusX: 440, radiusZ: 190, centerZ: -55, baselineY: 0, tilt: 0 },
  flip: { period: FLIP_CYCLE_DURATION, turnDuration: FLIP_ACTIVE_DURATION, backHold: .4, frontHold: 1.6, stagger: .43, periodSpread: .08, turnSpread: .02 },
} as const;

const TAU = Math.PI * 2;
const smootherstep = (v: number) => v * v * v * (v * (v * 6 - 15) + 10);

/** Preserve the X–Z orbit; all panels share a stable vertical baseline. */
export function orbitPose(project: GalleryFixture, seconds: number) {
  const o = galleryMotion.orbit;
  const initial = Math.atan2(project.x / o.radiusX, (project.z - o.centerZ) / o.radiusZ);
  const radius = Math.hypot(project.x / o.radiusX, (project.z - o.centerZ) / o.radiusZ);
  const angle = initial + seconds * TAU / o.period;
  return {
    x: o.radiusX * radius * Math.sin(angle),
    y: o.baselineY,
    z: o.centerZ + o.radiusZ * radius * Math.cos(angle),
  };
}

/** Independent staggered turns with dwell; full-cycle boundary is continuous. */
export function flipPose(project: GalleryFixture, index: number, seconds: number) {
  const base = galleryMotion.flip;
  const f = { ...base, period: base.period + index * base.periodSpread, turnDuration: base.turnDuration + index * base.turnSpread };
  // Delay each card's first turn rather than jumping into a partially completed turn.
  const elapsed = Math.max(0, seconds - index * f.stagger);
  const cycle = Math.floor(elapsed / f.period);
  const time = elapsed - cycle * f.period;
  let turn = 0;
  if (time >= f.frontHold + f.turnDuration + f.backHold + f.turnDuration) turn = 360;
  else if (time >= f.frontHold + f.turnDuration + f.backHold) {
    turn = 180 + 180 * smootherstep((time - f.frontHold - f.turnDuration - f.backHold) / f.turnDuration);
  } else if (time >= f.frontHold + f.turnDuration) turn = 180;
  else if (time >= f.frontHold) turn = 180 * smootherstep((time - f.frontHold) / f.turnDuration);
  return { yaw: project.yaw + cycle * 360 + turn, roll: project.roll };
}
