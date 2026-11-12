'use client';

import { useEffect,useRef } from 'react';
import { useRouter } from 'next/navigation';
import { openingHref,prewarmOpening,resetGalleryTransition,startGalleryTransition } from '@/app/lab/robotaxi-opening/galleryTransition';
import type { GalleryFixture } from './galleryFixtures';
import { RainGlassCard } from './RainGlassCard';
import styles from './gallery.module.css';

/** Both faces are explicit; no mirrored front-face text on the back. */
export function ProjectCard({ project, labels, href }: { project: GalleryFixture; labels?: { front: string; back: string }; href?: string }) {
  const router=useRouter();
  const cardType=project.release?.type;
  const coming=cardType==='coming-soon';
  const target=coming?undefined:href;
  const robotaxi=!!target&&project.release?.transition==='robotaxi-opening';
  useEffect(()=>{if(robotaxi){resetGalleryTransition();prewarmOpening(url=>router.prefetch(url));}},[robotaxi,router]);
  const press=useRef<{id:number;x:number;y:number;moved:boolean}|null>(null);
  const faces=(<>
      <div className={`${styles.face} ${styles.front} ${styles[project.kind]}`}>
        {cardType==='featured' && <RainGlassCard/>}
        <div className={styles.cardMeta}><span>{labels?.front ?? 'EXPERIMENT'} {project.number}</span><span>2026</span></div>
        <div className={styles.art} aria-hidden="true">
          {!cardType || cardType==='available' ? <>
          <i className={styles.fluidOne} />
          <i className={styles.fluidTwo} />
          <i className={styles.fluidThree} />
          <span className={styles.materialIndex}>{project.number}</span>
          </> : coming ? <span className={styles.comingLabel}>COMING SOON</span> : null}
        </div>
        <div className={styles.cardFoot}><span>{project.name}</span>{!coming && <span>↗</span>}</div>
      </div>
      <div className={`${styles.face} ${styles.back} ${styles[project.kind]}`} aria-hidden="true">
        <span className={styles.backLabel}>{coming?'COMING SOON':labels?.back ?? 'SPATIAL STUDIES / REVERSE'}</span>
        {!coming && <span className={styles.backNumber}>{project.number}</span>}
        {!coming && <span className={styles.backMark}>+</span>}
        <span className={styles.backFoot}>{project.name}</span>
      </div>
  </>);
  // Native document navigation preserves hash-based deck history on return.
  // One link contains both visible faces. Pointer capture preserves its
  // click target even if Orbit/Flip/Snap moves the panel between down and up.
  // A real swipe cancels activation; keyboard and modified clicks stay native.
  return target ? <a data-card-type={cardType} href={robotaxi?openingHref:target} aria-label={project.name} data-gallery-card data-gallery-project-link
    className={`${styles.card} ${styles.cardLink}`} draggable={false}
    onPointerDown={e=>{
      if(!e.isPrimary||e.button!==0)return;
      press.current={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
      e.currentTarget.setPointerCapture(e.pointerId);
    }}
    onPointerMove={e=>{
      if(robotaxi){const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--glass-x',`${(e.clientX-r.left)/r.width*100}%`);e.currentTarget.style.setProperty('--glass-y',`${(e.clientY-r.top)/r.height*100}%`);}
      const p=press.current;if(p?.id===e.pointerId&&Math.hypot(e.clientX-p.x,e.clientY-p.y)>7)p.moved=true;
    }}
    onPointerCancel={()=>{if(press.current)press.current.moved=true;}}
    onClick={e=>{
      if(e.detail>0&&press.current?.moved)e.preventDefault();
      press.current=null;
      if(robotaxi&&!e.defaultPrevented&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();startGalleryTransition(e.currentTarget,url=>router.push(url));}
    }}>{faces}</a> : <div data-gallery-card data-card-type={cardType} role={coming?'group':undefined} aria-label={coming?`${project.name} — COMING SOON`:undefined} className={styles.card}>{faces}</div>;
}
