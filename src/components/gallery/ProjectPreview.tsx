import type { GalleryFixture } from './galleryFixtures';
import styles from './gallery.module.css';

/** Three-line caption, always outside the perspective tree. */
export function ProjectPreview({ project, active }: { project: GalleryFixture; active: boolean }) {
  return <aside data-gallery-preview className={styles.projectPreview} data-active={active} aria-hidden={!active}>
    <h2>{project.name}</h2>
    <p>{project.preview.caption[0]}</p>
    <p>{project.preview.caption[1]}</p>
  </aside>;
}
