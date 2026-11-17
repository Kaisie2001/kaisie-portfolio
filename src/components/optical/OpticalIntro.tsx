'use client';

import { useEffect, useId, useRef } from 'react';
import { opticalDuration, opticalFrame, opticalHeroWakeAt, opticalSessionKey } from './opticalMotion';
import { mountLensAssembly } from './LensAssemblyScene';
import styles from './optical.module.css';

export function OpticalIntro({forceReplay=false,onReveal,onComplete}:{forceReplay?:boolean;onReveal:()=>void;onComplete:()=>void}){
  const root=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null);
  const veil=useRef<SVGSVGElement>(null),pupil=useRef<SVGPathElement>(null),caption=useRef<HTMLSpanElement>(null);
  const skipCurrent=useRef<()=>void>(()=>{});
  const id=`precision-pupil-${useId().replace(/:/g,'')}`;
  useEffect(()=>{
    const element=root.current,host=stage.current,curtain=veil.current,hole=pupil.current;
    if(!element||!host||!curtain||!hole){onReveal();onComplete();return;}
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    let disposed=false,completed=false,exiting=false,revealed=false;
    let frame=0,releaseFrame=0,commitFrame=0,start=0,lastPaint=-100;
    let engine:ReturnType<typeof mountLensAssembly>|undefined;
    let fade:Animation|undefined,watchdog:ReturnType<typeof setTimeout>|undefined;
    const reveal=()=>{if(!disposed&&!revealed){revealed=true;onReveal();}};
    const finish=()=>{
      if(disposed||completed)return;completed=true;cancelAnimationFrame(frame);clearTimeout(watchdog);reveal();
      try{sessionStorage.setItem(opticalSessionKey,'1');}catch{}
      onComplete();
    };
    const skip=()=>{
      if(disposed||completed||exiting)return;exiting=true;cancelAnimationFrame(frame);clearTimeout(watchdog);reveal();
      // Keep the current pupil geometry while fading; never close it again.
      releaseFrame=requestAnimationFrame(()=>{commitFrame=requestAnimationFrame(()=>{
        if(disposed)return;
        try{fade=element.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-out',fill:'forwards'});fade.finished.then(finish).catch(()=>{if(!disposed)finish();});}
        catch{finish();}
      });});
    };
    skipCurrent.current=skip;
    function tick(now:number){
      if(disposed||completed||exiting||!engine)return;
      if(!start)start=now;
      const elapsed=now-start;
      if(elapsed>=opticalHeroWakeAt)reveal();
      if(now-lastPaint>=1000/30||elapsed>=opticalDuration){
        const state=opticalFrame(elapsed),width=innerWidth,height=innerHeight;
        try{
          const points=engine.draw(state,width,height);
          curtain!.setAttribute('viewBox',`0 0 ${width} ${height}`);
          hole!.setAttribute('d',points.length?`M${points.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join('L')}Z`:'M0,0Z');
          hole!.setAttribute('fill-opacity',String(state.reveal));
          element!.style.setProperty('--caption',String(state.caption));
          host!.style.opacity='1';
          element!.dataset.phase=state.phase;
          const labels:Record<string,string>={detach:'01 / DETACH',profile:'02 / PROFILE',adjust:'03 / ADJUST',aperture:'04 / APERTURE',complete:''};
          if(caption.current)caption.current.textContent=labels[state.phase];
          lastPaint=now;
        }catch{skip();return;}
      }
      if(elapsed>=opticalDuration){finish();return;}
      frame=requestAnimationFrame(tick);
    }
    let seen=false;try{seen=sessionStorage.getItem(opticalSessionKey)==='1';}catch{}
    if(getComputedStyle(element).visibility==='hidden'){finish();return;}
    element.dataset.state='running';
    if(media.matches||(!forceReplay&&seen)||location.hash==='#gallery'||location.hash==='#work')skip();
    else{
      try{
        engine=mountLensAssembly(host);element.dataset.renderer='svg';
        frame=requestAnimationFrame(tick);watchdog=setTimeout(skip,opticalDuration+400);
      }catch{element.dataset.renderer='unavailable';skip();}
    }
    const motion=()=>{if(media.matches)skip();};
    const visibility=()=>{if(document.hidden)finish();};
    const leave=()=>finish();
    const pageShow=(event:PageTransitionEvent)=>{if(event.persisted)skip();};
    media.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);
    window.addEventListener('pagehide',leave);window.addEventListener('popstate',leave);window.addEventListener('pageshow',pageShow);
    return()=>{
      disposed=true;cancelAnimationFrame(frame);cancelAnimationFrame(releaseFrame);cancelAnimationFrame(commitFrame);
      clearTimeout(watchdog);fade?.cancel();
      engine?.dispose();
      media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);
      window.removeEventListener('pagehide',leave);window.removeEventListener('popstate',leave);window.removeEventListener('pageshow',pageShow);
    };
  },[forceReplay,onReveal,onComplete]);
  return <div ref={root} className={styles.overlay} data-optical-intro data-state="pending" data-phase="detach" aria-label="Optical line opening animation">
    <svg ref={veil} className={styles.curtain} width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id={`${id}-edge`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".65" /></filter>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style={{maskType:'luminance'}}>
          <rect width="100%" height="100%" fill="white" />
          <path ref={pupil} d="M0,0Z" fill="black" fillOpacity="0" filter={`url(#${id}-edge)`}/>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="#050505" mask={`url(#${id})`} />
    </svg>
    <div ref={stage} className={styles.scene} aria-hidden="true" />
    <div className={styles.editorial} aria-hidden="true">
      <div className={styles.byline}><span>CASSY WU</span><span>OPTICAL STUDY</span></div>
      <span ref={caption} className={styles.caption}>01 / DETACH</span>
      <span className={styles.specification}>35 mm · f/2</span>
    </div>
    <button className={styles.skip} onClick={()=>skipCurrent.current()}>Skip</button>
  </div>;
}
