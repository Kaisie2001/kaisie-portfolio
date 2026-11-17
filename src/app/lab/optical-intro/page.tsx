import type { Metadata, Viewport } from 'next';
import { OpticalExperience } from '@/components/optical/OpticalExperience';

export const metadata: Metadata = {
  title: 'Cassy Wu — Optical Line Study',
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: '#050505' };

export default function OpticalIntroPage() {
  return <OpticalExperience previewControls />;
}
