import type { Metadata, Viewport } from 'next';
import { UnifiedExperience } from '@/components/experience/UnifiedExperience';

export const metadata: Metadata = { title: 'Cassy Wu — Unified Dark Experience — Phase 6', robots: { index: false, follow: false } };
export const viewport: Viewport = { themeColor: '#050505' };
export default function ExperienceLab() { return <UnifiedExperience />; }
