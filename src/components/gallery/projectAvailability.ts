/** Release state is independent of card geometry and translated editorial copy. */
export type GalleryRelease = {
  type: 'featured' | 'available' | 'coming-soon';
  href?: string;
  detailPath?: string;
  transition?: 'robotaxi-opening';
};
export const projectAvailability: Readonly<Record<string, GalleryRelease>> = {
  signal: { type: 'available', href: '/work/local-life-planning-agent' },
  type: { type: 'featured', href: '/lab/robotaxi-opening', detailPath: '/work/robotaxi-rain-mode', transition: 'robotaxi-opening' },
  // The drone route explicitly contains placeholder content; it is not released.
  terrain: { type: 'coming-soon', detailPath: '/work/drone-mission-planning-workflow' },
  form: { type: 'coming-soon' },
  grid: { type: 'coming-soon' },
};
