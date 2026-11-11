import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero/HeroSection';
export const metadata: Metadata = { title: 'Hero V3 — Phase 2 — Cassy Wu', robots: { index: false, follow: false } };
export default function HeroLab() { return <HeroSection />; }
