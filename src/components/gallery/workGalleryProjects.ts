import { portfolioCopy, type Lang } from '@/lib/portfolioCopy';
import { galleryFixtures, type GalleryFixture } from './galleryFixtures';

/** Same five geometric fixtures; all editorial content comes from portfolioCopy. */
export function workGalleryProjects(lang: Lang): readonly GalleryFixture[] {
  const work=portfolioCopy[lang].work;
  const entries=[...work.featured,...work.additional];
  return galleryFixtures.map((fixture,index)=>{
    const entry=entries[index],caption=work.gallery.captions[index];
    const status='status' in entry?entry.status:!('href' in entry)?work.gallery.status:undefined;
    return {...fixture,name:entry.title,preview:{
      category:caption.descriptor,
      description:'description' in entry?entry.description:entry.line,
      caption:[`${caption.descriptor}${status?` · ${status}`:''}`,caption.note],
      href:'href' in entry?entry.href:undefined,
    }};
  });
}
