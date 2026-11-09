'use client';

import { useRef, useState, useCallback, useSyncExternalStore } from 'react';
import { useGalleryMotion } from './useGalleryMotion';
import { galleryFixtures } from './galleryFixtures';
import { ProjectPreview } from './ProjectPreview';
import { GalleryStage } from './GalleryStage';
import styles from './gallery.module.css';

const subscribeMotionPreference=(notify:()=>void)=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change',notify);
  return()=>media.removeEventListener('change',notify);
};
const readMotionPreference=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverMotionPreference=()=>true;
const debugAvailable=process.env.NODE_ENV==='development'||process.env.NEXT_PUBLIC_GALLERY_DEBUG==='1';
/** One Orbit controller; pointer intent gates automatic ambient focus. */
export function GalleryScene() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<'both' | 'orbit' | 'flip'>('both');
  const [paused, setPaused] = useState(false);
  const [ambientIndex,setAmbientIndex]=useState<number|null>(null);
  const reducedMotion=useSyncExternalStore(subscribeMotionPreference,readMotionPreference,serverMotionPreference);
  const ambientChange=useCallback((index:number|null)=>setAmbientIndex(index),[]);
  const selected=ambientIndex===null?null:galleryFixtures[ambientIndex];
  useGalleryMotion(root,{orbitEnabled:mode==='both'||mode==='orbit',flipEnabled:mode==='both'||mode==='flip',paused,reducedMotion,debugEnabled:debugAvailable,onAmbientChange:ambientChange});
  return (
    <section ref={root} className={styles.lab} data-ambient-theme={selected?.theme} aria-labelledby="gallery-lab-title">
      <div className={styles.focusBackdrop} aria-hidden="true" />
      <div className={styles.ambientVeil} aria-hidden="true" />
      <header className={styles.header}>
        <p className={styles.eyebrow}>DESIGN LAB / 004</p>
        <div className={styles.headingRow}>
          <h1 id="gallery-lab-title">Spatial studies<span className={styles.period}>.</span></h1>
          <p>Five surfaces. One shared space.<br />Quiet motion in three dimensions.</p>
        </div>
      </header>
      <GalleryStage projects={galleryFixtures} ambientIndex={ambientIndex}
        label="Material gallery. Hover edges or use left and right arrow keys to explore. Escape dismisses focus."
        hintId="gallery-move-hint" />
      {debugAvailable && <details className={styles.motionDebug}>
        <summary>Motion diagnostics · 4.9</summary>
        <output data-motion-debug-output aria-label="Live gallery motion diagnostics" />
      </details>}
      {galleryFixtures.map((project,index)=><ProjectPreview key={project.id} project={project} active={ambientIndex===index} />)}
      <p id="gallery-move-hint" className={styles.dragHint}>Hover edges to explore</p>
      <div className={styles.motionControls} role="group" aria-label="Motion debug modes">
        {([['both', 'Orbit + Flip'], ['orbit', 'Orbit only'], ['flip', 'Flip only']] as const).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={mode === value} disabled={reducedMotion === true} onClick={() => setMode(value)}>{label}</button>
        ))}
        <button type="button" aria-label={paused ? 'Resume gallery motion' : 'Pause gallery motion'} aria-pressed={paused} disabled={reducedMotion === true} onClick={() => setPaused(value => !value)}>{paused ? 'Resume' : 'Pause'}</button>
        {reducedMotion && <span>Reduced motion · static view</span>}
      </div>
      <footer className={styles.legend}>
        <span><i />MATERIALS IN ORBIT</span>
        <span>05 TEST CARDS <b>/</b> CSS 3D</span>
        <span>PHASE 04 <b>—</b> EXPLORE</span>
      </footer>
    </section>
  );
}
