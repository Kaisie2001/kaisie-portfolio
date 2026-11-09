"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { portfolioCopy, type Lang } from '@/lib/portfolioCopy';
import { useGalleryMotion } from './useGalleryMotion';
import { GalleryStage } from './GalleryStage';
import { ProjectCard } from './ProjectCard';
import { workGalleryProjects } from './workGalleryProjects';
import styles from './gallery.module.css';

const fallbackQuery='(max-width: 760px), (pointer: coarse), (prefers-reduced-motion: reduce)';
const subscribe=(notify:()=>void)=>{
  const query=window.matchMedia(fallbackQuery);query.addEventListener('change',notify);
  return()=>query.removeEventListener('change',notify);
};
const readFallback=()=>window.matchMedia(fallbackQuery).matches;
const serverFallback=()=>true;

/** Portfolio shell only: the lab's controller, framing and perspective tree are reused. */
export function WorkGallerySection({lang}:{lang:Lang}) {
  const root=useRef<HTMLElement>(null);
  const [ambientIndex,setAmbientIndex]=useState<number|null>(null);
  const fallback=useSyncExternalStore(subscribe,readFallback,serverFallback);
  const onAmbientChange=useCallback((index:number|null)=>setAmbientIndex(index),[]);
  const work=portfolioCopy[lang].work,c=work.gallery,projects=workGalleryProjects(lang);
  const selected=ambientIndex===null?null:projects[ambientIndex];
  useGalleryMotion(root,{orbitEnabled:true,flipEnabled:true,paused:fallback,reducedMotion:fallback,
    debugEnabled:false,onAmbientChange});
  return <section ref={root} id="work" className={`${styles.lab} ${styles.workRoot}`}
    data-ambient-theme={fallback?undefined:selected?.theme} aria-labelledby="work-gallery-title">
    <div className={styles.focusBackdrop} aria-hidden="true" />
    <div className={styles.ambientVeil} aria-hidden="true" />
    <header className={styles.workHeader}><h2 id="work-gallery-title">{work.featuredTitle}</h2></header>
    <div className={styles.workSpatial}>
      <GalleryStage projects={projects} ambientIndex={ambientIndex} label={c.accessibleLabel}
        hintId="work-gallery-hint" linkCards cardLabels={{front:c.cardFront,back:c.cardBack}}>
        {projects.map((project,index)=><aside key={project.id} data-gallery-preview
          className={`${styles.projectPreview} ${styles.workPreview}`} data-active={ambientIndex===index}
          aria-hidden={ambientIndex!==index} inert={ambientIndex!==index}>
          <h3>{project.name}</h3><p>{project.preview.caption[0]}</p><p>{project.preview.caption[1]}</p>
        </aside>)}
      </GalleryStage>
      <p id="work-gallery-hint" className={styles.dragHint}>{c.hint}</p>
    </div>
    <nav className={styles.workList} aria-label={c.listLabel} onTouchStart={e=>e.stopPropagation()} onTouchEnd={e=>e.stopPropagation()}>
      {projects.map(project=><article key={project.id} className={styles.workListItem}>
        <div className={styles.listMaterial}><ProjectCard project={project} labels={{front:c.cardFront,back:c.cardBack}} href={project.preview.href} /></div>
        <h3>{project.name}</h3><p>{project.preview.caption[0]}</p><p>{project.preview.caption[1]}</p>
      </article>)}
    </nav>
  </section>;
}
