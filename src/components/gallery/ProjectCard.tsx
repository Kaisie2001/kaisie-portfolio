'use client';

import { useRef } from 'react';
import type { GalleryFixture } from './galleryFixtures';
import styles from './gallery.module.css';

/** Both faces are explicit; no mirrored front-face text on the back. */
export function ProjectCard({ project, labels, href }: { project: GalleryFixture; labels?: { front: string; back: string }; href?: string }) {
  const press=useRef<{id:number;x:number;y:number;moved:boolean}|null>(null);
  const faces=(<>
      <div className={`${styles.face} ${styles.front} ${styles[project.kind]}`}>
        <div className={styles.cardMeta}><span>{labels?.front ?? 'EXPERIMENT'} {project.number}</span><span>2026</span></div>
        <div className={styles.art} aria-hidden="true">
          <i className={styles.fluidOne} />
          <i className={styles.fluidTwo} />
          <i className={styles.fluidThree} />
          <span className={styles.materialIndex}>{project.number}</span>
        </div>
        <div className={styles.cardFoot}><span>{project.name}</span><span>↗</span></div>
      </div>
      <div className={`${styles.face} ${styles.back} ${styles[project.kind]}`} aria-hidden="true">
        <span className={styles.backLabel}>{labels?.back ?? 'SPATIAL STUDIES / REVERSE'}</span>
        <span className={styles.backNumber}>{project.number}</span>
        <span className={styles.backMark}>+</span>
        <span className={styles.backFoot}>{project.name}</span>
      </div>
  </>);
  // Native document navigation preserves hash-based deck history on return.
  // One link contains both visible faces. Pointer capture preserves its
  // click target even if Orbit/Flip/Snap moves the panel between down and up.
  // A real swipe cancels activation; keyboard and modified clicks stay native.
  return href ? <a href={href} aria-label={project.name} data-gallery-card data-gallery-project-link
    className={`${styles.card} ${styles.cardLink}`} draggable={false}
    onPointerDown={e=>{
      if(!e.isPrimary||e.button!==0)return;
      press.current={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
      e.currentTarget.setPointerCapture(e.pointerId);
    }}
    onPointerMove={e=>{
      const p=press.current;if(p?.id===e.pointerId&&Math.hypot(e.clientX-p.x,e.clientY-p.y)>7)p.moved=true;
    }}
    onPointerCancel={()=>{if(press.current)press.current.moved=true;}}
    onClick={e=>{
      if(e.detail>0&&press.current?.moved)e.preventDefault();
      press.current=null;
    }}>{faces}</a> : <div data-gallery-card className={styles.card}>{faces}</div>;
}
