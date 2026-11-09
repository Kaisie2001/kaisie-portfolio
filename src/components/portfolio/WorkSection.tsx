"use client";

import type { Lang } from '@/lib/portfolioCopy';
import { WorkGallerySection } from '@/components/gallery/WorkGallerySection';

/** Keep the Work entry point while sharing the verified gallery experience. */
export function WorkSection({lang}:{lang:Lang}) {
  return <WorkGallerySection lang={lang} />;
}
