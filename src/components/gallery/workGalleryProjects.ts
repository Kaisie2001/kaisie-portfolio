import { portfolioCopy, type Lang } from '@/lib/portfolioCopy';
import { projectAvailability } from './projectAvailability';
import { galleryFixtures, type GalleryFixture } from './galleryFixtures';

/** Same five geometric fixtures; all editorial content comes from portfolioCopy. */
export function workGalleryProjects(lang: Lang): readonly GalleryFixture[] {
  const work=portfolioCopy[lang].work;
  const entries=[...work.featured,...work.additional];
  return galleryFixtures.map((fixture,index)=>{
    const entry=entries[index],caption=work.gallery.captions[index];
    const status='status' in entry?entry.status:!('href' in entry)?work.gallery.status:undefined;
    const release=projectAvailability[fixture.id];
    const coming=release?.type==='coming-soon';
    const unavailable=lang==='zh'?'项目案例尚未开放。':'Case study not yet available.';
    return {...fixture,release,name:entry.title,preview:{
      category:caption.descriptor,
      description:coming?unavailable:'description' in entry?entry.description:entry.line,
      caption:coming?['COMING SOON',unavailable]:[`${caption.descriptor}${status?` · ${status}`:''}`,caption.note],
      href:release?.href,
    }};
  });
}
