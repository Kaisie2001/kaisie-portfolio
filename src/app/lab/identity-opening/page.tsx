import type { Metadata, Viewport } from 'next';
import { IdentityOpening } from '@/components/identity/IdentityOpening';

export const metadata: Metadata = {
  title: 'Cassy Wu — Opening to Existing Hero',
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: '#050505' };

export default function IdentityOpeningPage() {
  return <IdentityOpening />;
}
