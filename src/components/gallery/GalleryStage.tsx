import type { CSSProperties, ReactNode } from 'react';
import type { GalleryFixture } from './galleryFixtures';
import { ProjectCard } from './ProjectCard';
import { orbitPose } from './galleryMotion';
import styles from './gallery.module.css';

/** Shared perspective tree. Only useGalleryMotion owns these transforms. */
export function GalleryStage({projects, ambientIndex, label, hintId, cardLabels, linkCards=false, children}: {
  projects: readonly GalleryFixture[]; ambientIndex: number|null; label: string; hintId: string;
  cardLabels?: { front: string; back: string }; linkCards?: boolean; children?: ReactNode;
}) {
  return <div data-gallery-viewport tabIndex={0} className={styles.viewport} aria-label={label} aria-describedby={hintId}>
    <div className={styles.scene}>
      <div className={styles.orbitLayer} role="list" aria-label={label}>
        {projects.map((project,index)=><div key={project.id} role="listitem" aria-label={`${project.number}: ${project.name}`}
          data-orbit-item data-ambient-state={ambientIndex===null?'explore':ambientIndex===index?'selected':'subdued'} className={styles.orbitItem}
          style={{'--x':`${project.x}px`,'--y':`${orbitPose(project,0).y}px`,'--z':`${project.z}px`,'--yaw':`${project.yaw}deg`,'--roll':`${project.roll}deg`} as CSSProperties}>
          <div data-focus-transform className={styles.focusTransform}><div data-flip-layer className={styles.cardFlipLayer}>
            <ProjectCard project={project} labels={cardLabels} href={linkCards?project.preview.href:undefined} />
          </div></div>
        </div>)}
      </div>
    </div>
    {children}
  </div>;
}
