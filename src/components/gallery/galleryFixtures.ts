/** Static fixtures only. Position, focus and local rotation have separate owners. */
export type GalleryFixture = {
  id: string;
  number: string;
  name: string;
  kind: 'signal' | 'type' | 'terrain' | 'form' | 'grid';
  x: number;
  y: number;
  z: number;
  yaw: number;
  roll: number;
  theme: 'light' | 'dark';
  preview: { category: string; description: string; caption: readonly [string, string]; href?: string };
};

export const galleryFixtures: readonly GalleryFixture[] = [
  { id: 'signal', number: '01', name: 'Signal / Study', kind: 'signal', theme: 'light', preview: { category: 'Material / Warm coral mist', caption: ['Muted surface, warm opacity', 'A slow form in shared space'], description: 'A study of softened colour and translucent surfaces. Warm pigment sits beneath a quiet, frosted layer.' }, x: -390, y: -8, z: -90, yaw: 28, roll: -7 },
  { id: 'type', number: '02', name: 'Type / Study', kind: 'type', theme: 'light', preview: { category: 'Material / Pale sage', caption: ['Pale sage material sample', 'Soft edges in diffused light'], description: 'A pale sage sample exploring soft edges and diffused light. A shared visual language, with a cooler material temperature.' }, x: -176, y: -69, z: -255, yaw: -66, roll: 5 },
  { id: 'terrain', number: '03', name: 'Terrain / Study', kind: 'terrain', theme: 'dark', preview: { category: 'Material / Smoky blue', caption: ['Smoke blue, suspended layers', 'Depth held in a quiet surface'], description: 'A smoky blue sample with layered, organic colour. This experiment explores how a translucent surface reads in a three-dimensional composition.' }, x: 14, y: 40, z: 120, yaw: -14, roll: 4 },
  { id: 'form', number: '04', name: 'Form / Study', kind: 'form', theme: 'light', preview: { category: 'Material / Stone beige', caption: ['Warm stone, softened light', 'A gentle trace of inner form'], description: 'A warm neutral sample balancing soft internal forms with a restrained surface. Fine grain and edge highlights suggest frosted acrylic.' }, x: 222, y: -57, z: -180, yaw: 42, roll: -5 },
  { id: 'grid', number: '05', name: 'Grid / Study', kind: 'grid', theme: 'dark', preview: { category: 'Material / Charcoal olive', caption: ['Olive tones, quiet opacity', 'A shadow slowly taking shape'], description: 'A muted olive sample exploring depth through restrained tonal variation. Its quiet surface belongs to the same family of five material studies.' }, x: 415, y: 22, z: -30, yaw: -31, roll: 7 },
];
