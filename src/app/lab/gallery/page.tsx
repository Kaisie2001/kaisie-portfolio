import type { Metadata } from 'next';
import { GalleryScene } from '@/components/gallery/GalleryScene';

export const metadata: Metadata = {
  title: 'Spatial studies — Gallery Lab',
  robots: { index: false, follow: false },
};

export default function GalleryLabPage() {
  return <GalleryScene />;
}
