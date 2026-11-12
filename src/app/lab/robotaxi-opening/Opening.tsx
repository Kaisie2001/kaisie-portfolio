'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './opening.module.css';
import RainAtmosphere from './RainAtmosphere';
import Link from 'next/link';
import { finishOpeningTransition } from './galleryTransition';
import { introTimeline } from './introTimeline';
import { useRippleExit } from './useRippleExit';
import { defaultCaseDestination } from './rippleTransition';
import type { WaterFlowCallback } from './rainSimulation';

const scene = '/robotaxi-opening/street.png';
const ease = (v: number) => { const t = Math.max(0, Math.min(1, v)); return t*t*(3-2*t); };
export default function Opening({condensationOnly=false,flowOnly=false,initialMask=false,destination=defaultCaseDestination,caseReadySelector='main h1'}:{condensationOnly?:boolean;flowOnly?:boolean;initialMask?:boolean;destination?:string;caseReadySelector?:string}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const host = useRef<HTMLElement>(null);
  const opticalGate=useRef<HTMLCanvasElement>(null);
  const scrollHost=useRef<HTMLDivElement>(null);
  const skipRequested=useRef(false),manualWipe=useRef<(x:number,y:number,reset?:boolean)=>void>(()=>{});
  const [introDone,setIntroDone]=useState(false),[sceneActive,setSceneActive]=useState(true);
  const sceneVisible=useRef(true);sceneVisible.current=sceneActive;
  const debug=condensationOnly||flowOnly||initialMask;
  const exit=useRippleExit(introDone&&!debug,host,destination,caseReadySelector);
  const waterFlow=useRef<WaterFlowCallback>(()=>{});
  const receiveFlow=useCallback<WaterFlowCallback>((...args)=>waterFlow.current(...args),[]);
  const [maskVisible,setMaskVisible]=useState(initialMask);
  const showMask=useRef(initialMask);showMask.current=maskVisible;
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el=canvas.current!, root=host.current!, ctx=el.getContext('2d', {alpha:true})!;
    const gate=opticalGate.current!,g=gate.getContext('2d')!;
    gate.style.background='#050505';
    root.style.setProperty('--scene-light',debug?'1':'0');
    root.style.setProperty('--entry-rain',debug?'1':'0');
    let raf=0, stopped=false, started=0, previous=0, hiddenAt=0, finished=false, lastMistFrame=0;
    for(const property of ['--title','--sub','--intro','--depth'])root.style.setProperty(property,'0');
    skipRequested.current=run===0&&history.state?.__robotaxiIntroReady===true;
    const image=new Image();
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const low=(navigator.hardwareConcurrency || 8)<=4;
    let w=0,h=0;
    const fog=document.createElement('canvas'), mask=document.createElement('canvas');
    const film=document.createElement('canvas'),density=document.createElement('canvas'),skin=document.createElement('canvas');
    const skinContext=skin.getContext('2d')!;
    const flowMask=document.createElement('canvas'),combined=document.createElement('canvas');
    const water=flowMask.getContext('2d')!,alpha=combined.getContext('2d')!;
    let lastFlowFade=0;
    const filmContext=film.getContext('2d')!,densityContext=density.getContext('2d')!;
    let densityPixels:ImageData;
    const f=fog.getContext('2d')!, m=mask.getContext('2d')!;
    let seed=7321;
    const random=()=> {seed=(seed*1664525+1013904223)>>>0; return seed/4294967296;};
    function paintGlass() {
      seed=7321;
      const scale=Math.min(devicePixelRatio,low?1:1.4);
      w=Math.round(innerWidth*scale);h=Math.round(innerHeight*scale);
      for(const c of [el,fog,mask,film,flowMask,combined,gate]) {c.width=w;c.height=h;}
      const ratio=Math.max(w/image.width,h/image.height);
      const iw=image.width*ratio,ih=image.height*ratio;
      // Match the street exposure; scattering replaces sharp detail, not a gray fill.
      f.filter=`blur(${Math.max(23,w*.02)}px) brightness(.75) saturate(.74)`;
      f.drawImage(image,(w-iw)*.5,(h-ih)*.5,iw,ih);f.filter='none';
      for(let i=0;i<w*h/48;i++){
        const x=random()*w,y=random()*h;
        f.fillStyle=`rgba(208,221,225,${.015+random()*.035})`;
        f.fillRect(x,y,.5+random()*1.3,.5+random()*1.3);
      }
      density.width=128;density.height=Math.max(64,Math.round(128*h/w));
      skin.width=density.width;skin.height=density.height;
      densityPixels=densityContext.createImageData(density.width,density.height);
      m.clearRect(0,0,w,h); previous=0;started=0;finished=false;lastMistFrame=0;lastFlowFade=0;
    }
    // Rain flow writes into a distinct persistent erasure mask, in CSS->canvas coordinates.
    waterFlow.current=(x,y,nx,ny,r)=>{
      if(stopped||!w||r<3.7)return;
      const scale=w/innerWidth;
      const width=r*(.92+.16*Math.sin(ny*.11+r))*scale;
      water.save();water.lineCap='round';water.lineJoin='round';
      water.globalCompositeOperation='source-over';water.strokeStyle='rgba(255,255,255,.98)';
      water.shadowColor='rgba(255,255,255,.5)';water.shadowBlur=width*.6;water.lineWidth=width;
      water.beginPath();water.moveTo(x*scale,y*scale);
      water.quadraticCurveTo((x+(nx-x)*.45)*scale,(y+(ny-y)*.55)*scale,nx*scale,ny*scale);water.stroke();water.restore();
    };
    // A ragged, broad swath, never a circular reveal. Six curved, overlapping
    // sweeps accumulate in a persistent alpha mask; edges retain wet striations.
    function dab(x:number,y:number,angle:number,pressure:number) {
      const mobile=w/h<.8, radius=h*(mobile?.072:.09)*pressure;
      m.save();m.translate(x*w,y*h);m.rotate(angle);
      m.beginPath();
      for(let i=0;i<=36;i++) {
        const a=i/36*Math.PI*2;
        const rough=1+.095*Math.sin(a*5+x*9)+.055*Math.sin(a*11+y*13);
        const px=Math.cos(a)*radius*.78*rough,py=Math.sin(a)*radius*rough;
        if(i===0)m.moveTo(px,py);else m.lineTo(px,py);
      }
      m.closePath();m.shadowColor='rgba(255,255,255,.35)';m.shadowBlur=h*.012;
      const softness=m.createRadialGradient(0,0,radius*.48,0,0,radius*1.12);
      softness.addColorStop(0,'rgba(255,255,255,.96)');softness.addColorStop(.7,'rgba(255,255,255,.5)');softness.addColorStop(1,'rgba(255,255,255,.08)');
      m.fillStyle=softness;m.fill();
      m.shadowBlur=0;
      // Thin translucent streaks left by moisture at the trailing edge.
      m.globalCompositeOperation='destination-out';m.strokeStyle='rgba(0,0,0,.045)';m.lineWidth=.6;
      for(let i=0;i<3;i++){m.beginPath();m.moveTo(-radius*.65,-radius*.6+i*radius*.42);m.quadraticCurveTo(0,-radius*.45+i*radius*.42,radius*.6,-radius*.5+i*radius*.42);m.stroke();}
      m.restore();
    }
    let lastPointer:{x:number;y:number}|null=null;
    manualWipe.current=(x,y,reset=false)=>{
      if(reset||flowOnly){lastPointer=null;return;}
      if(!w||x<0||x>1||y<0||y>1)return;
      const from=lastPointer??{x,y},distance=Math.hypot((x-from.x)*w,(y-from.y)*h);
      const steps=Math.min(120,Math.max(1,Math.ceil(distance/8)));
      for(let i=1;i<=steps;i++){const t=i/steps;dab(from.x+(x-from.x)*t,from.y+(y-from.y)*t,Math.atan2(y-from.y,x-from.x),.48);}
      lastPointer={x,y};
    };
    function reveal(progress:number,time=0) {
      // Unequal, intersecting cubic gestures, not evenly spaced scan lines.
      const gestures = [
        [.29,.39,.32,.16,.66,.22,.73,.37],
        [.73,.37,.87,.49,.51,.31,.25,.49],
        [.25,.49,.22,.62,.58,.38,.76,.53],
        [.76,.53,.73,.74,.39,.62,.30,.55],
        [.30,.55,.16,.38,.54,.38,.69,.50],
        [.69,.50,.82,.65,.49,.73,.37,.61],
      ];
      for(let p=previous+.0013;p<=progress;p+=.0013) {
        const q=p*6,pass=Math.min(5,Math.floor(q)),u=ease(q-pass),v=1-u;
        const g=gestures[pass];
        let x=v*v*v*g[0]+3*v*v*u*g[2]+3*v*u*u*g[4]+u*u*u*g[6];
        const y=v*v*v*g[1]+3*v*v*u*g[3]+3*v*u*u*g[5]+u*u*u*g[7];
        if(w/h<.8)x=.5+(x-.5)*1.27;
        const dx=3*v*v*(g[2]-g[0])+6*v*u*(g[4]-g[2])+3*u*u*(g[6]-g[4]);
        const dy=3*v*v*(g[3]-g[1])+6*v*u*(g[5]-g[3])+3*u*u*(g[7]-g[5]);
        const pressure=.88+.16*Math.sin(u*Math.PI)+.08*Math.sin(u*8+pass*1.7);
        dab(x,y,Math.atan2(dy*h,dx*w)+Math.PI/2,pressure);
      }
      previous=progress;
      // Low-resolution optical-density field: local variation without a white veil.
      // >=90% diffused scene suppresses sharp detail outside the wiped region.
      const drift=time*.00007;
      for(let y=0;y<density.height;y++)for(let x=0;x<density.width;x++){
        const u=x/density.width,v=y/density.height;
        const alpha=Math.max(.9,Math.min(.995,.95
          +.025*Math.sin(u*9+v*4)+.02*Math.cos(v*11-u*3)
          +.015*Math.sin(u*6-v*8+drift)*Math.cos(v*7+drift*.6)));
        const index=(y*density.width+x)*4;
        densityPixels.data[index]=densityPixels.data[index+1]=densityPixels.data[index+2]=255;
        densityPixels.data[index+3]=Math.round(alpha*255);
      }
      densityContext.putImageData(densityPixels,0,0);
      // Slow 45-second time constant: tracks persist, rather than immediately frosting.
      const elapsed=lastFlowFade?Math.max(0,(time-lastFlowFade)/1000):0;lastFlowFade=time;
      water.globalCompositeOperation='destination-out';water.fillStyle=`rgba(0,0,0,${1-Math.exp(-elapsed/45)})`;water.fillRect(0,0,w,h);water.globalCompositeOperation='source-over';
      // Both masks remove density; neither overwrites the other's persistent state.
      alpha.clearRect(0,0,w,h);alpha.globalCompositeOperation='source-over';alpha.drawImage(density,0,0,w,h);
      alpha.globalCompositeOperation='destination-out';alpha.drawImage(mask,0,0);alpha.drawImage(flowMask,0,0);alpha.globalCompositeOperation='source-over';
      filmContext.clearRect(0,0,w,h);filmContext.globalCompositeOperation='source-over';filmContext.drawImage(fog,0,0);
      filmContext.globalCompositeOperation='destination-in';filmContext.drawImage(combined,0,0);filmContext.globalCompositeOperation='source-over';
      ctx.clearRect(0,0,w,h);
      skinContext.clearRect(0,0,skin.width,skin.height);skinContext.globalCompositeOperation='source-over';skinContext.drawImage(combined,0,0,skin.width,skin.height);
      skinContext.globalCompositeOperation='source-in';skinContext.fillStyle='#1c2831';skinContext.fillRect(0,0,skin.width,skin.height);skinContext.globalCompositeOperation='source-over';
      if(showMask.current){ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);ctx.drawImage(combined,0,0);}
      else ctx.drawImage(film,0,0);
    }

    // A single light gate covers the clear street, exterior rain and fully
    // prepared fog together. The foreground drops and copy stay above it.
    function paintGate(optics:ReturnType<typeof introTimeline>){
      root.style.setProperty('--scene-light',String(optics.light));
      root.style.setProperty('--entry-rain',String(optics.rain));
      root.dataset.optics=optics.phase;
      g.clearRect(0,0,w,h);g.globalAlpha=1-optics.light;g.fillStyle='#050505';g.fillRect(0,0,w,h);
      // Existing density field scatters a little ambient light before any city is visible.
      g.globalAlpha=optics.mist*(1-optics.light)*.34;g.drawImage(skin,0,0,w,h);g.globalAlpha=1;
      gate.style.background='transparent';
    }
    function frame(now:number) {
      if(stopped)return;
      if(document.hidden){hiddenAt=now;return;}
      if(!sceneVisible.current){raf=requestAnimationFrame(frame);return;}
      if(!started)started=now;
      const elapsed=now-started;
      const optics=introTimeline(elapsed,reduced||skipRequested.current,debug);
      const time=optics.time;
      const p=flowOnly?0:reduced?1:Math.min(1,Math.max(0,(time-350)/4650));
      if(finished){
        if(!reduced&&now-lastMistFrame>120){reveal(flowOnly?0:1,elapsed);paintGate(optics);lastMistFrame=now;}
        if(!reduced)raf=requestAnimationFrame(frame);
        return;
      }
      reveal(p,elapsed);paintGate(optics);
      const title=reduced?1:ease((time-5300)/1300);
      root.style.setProperty('--depth',String(reduced?1:ease((time-5100)/1500)));
      root.style.setProperty('--title',String(title));
      root.style.setProperty('--sub',String(reduced?1:ease((time-5850)/1200)));
      root.style.setProperty('--intro',String(reduced?1:ease((time-6350)/1200)));
      root.dataset.phase=time<350?'fog':time<5000?'wiping':time<7550?'revealing':'complete';
      if(!reduced&&time<7600)raf=requestAnimationFrame(frame);
      else {root.dataset.phase='complete';finished=true;setIntroDone(true);if(!reduced)raf=requestAnimationFrame(frame);}
    }
    function resize(){
      if(!image.naturalWidth)return;
      const complete=finished;cancelAnimationFrame(raf);paintGlass();if(complete)skipRequested.current=true;
      // Draw fog and opaque gate synchronously, before React removes Loading.
      const optics=introTimeline(0,reduced||skipRequested.current,debug);
      reveal(flowOnly?0:reduced||skipRequested.current?1:0,0);paintGate(optics);
      raf=requestAnimationFrame(frame);
    }
    image.onload=()=>{if(stopped)return;resize();setReady(true);finishOpeningTransition();};
    image.onerror=()=>{if(stopped)return;root.dataset.phase='asset-error';for(const key of ['--title','--sub','--intro'])root.style.setProperty(key,'1');setReady(true);setIntroDone(true);finished=true;finishOpeningTransition();};
    image.src=scene;
    const visibility=()=>{if(document.hidden){hiddenAt=performance.now();cancelAnimationFrame(raf);}else if(image.complete&&image.naturalWidth){if(started&&hiddenAt)started+=performance.now()-hiddenAt;hiddenAt=0;raf=requestAnimationFrame(frame);}};
    document.addEventListener('visibilitychange',visibility);
    window.addEventListener('resize',resize);
    return()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);waterFlow.current=()=>{};manualWipe.current=()=>{};};
  },[run,flowOnly,debug]);
  const wipePointer=(event:React.PointerEvent<HTMLElement>)=>{
    if(exit.leaving)return;
    if(event.pointerType!=='mouse'&&event.buttons!==1)return;
    if((event.target as Element).closest('button,a,input'))return;
    const rect=event.currentTarget.getBoundingClientRect();
    manualWipe.current((event.clientX-rect.left)/rect.width,(event.clientY-rect.top)/rect.height);
  };
  return <div ref={scrollHost} className={styles.portalScroll} onScroll={event=>setSceneActive(event.currentTarget.scrollTop<innerHeight*.85)}>
  <section ref={host} className={`${styles.window} ${styles.openingStage}`} onPointerDown={event=>{exit.onPointerDown(event);wipePointer(event);}} onPointerMove={event=>{exit.onPointerMove(event);wipePointer(event);}} onClick={exit.onBackgroundClick} onPointerLeave={()=>manualWipe.current(0,0,true)} onPointerCancel={()=>{exit.onPointerCancel();manualWipe.current(0,0,true);}} aria-label="Rain-aware Robotaxi project opening" data-opening-stage data-exit-state={exit.state} data-ready={ready}>
    <link rel="stylesheet" href="/fonts/hero/misans.css" precedence="default" />
    <div className={styles.street} />
    {!condensationOnly&&!flowOnly&&<div className={styles.depth} aria-hidden="true" />}
    <div className={styles.shade} aria-hidden="true" />
    {!condensationOnly&&!flowOnly&&<div className={styles.copy} data-opening-copy>
      <p className={styles.label}>CASE STUDY <span>/</span> ROBOTAXI</p>
      <h1>WHERE SHOULD<br/>I WAIT?</h1>
      <p className={styles.subtitle}>Rain-aware Robotaxi Pickup</p>
      <p className={styles.intro}>Helping passengers make clearer pickup<br className={styles.desktopBreak}/> decisions in the rain.</p>
    </div>}
    <canvas ref={canvas} className={styles.glass} aria-hidden="true" />
    <canvas ref={opticalGate} className={styles.opticalGate} aria-hidden="true"/>
    {!condensationOnly&&<RainAtmosphere onWaterFlow={receiveFlow} rainMode={flowOnly?'flow':'full'} hiddenVisuals={maskVisible} active={sceneActive}/>}
    {(flowOnly||initialMask)&&<button className={styles.maskToggle} aria-pressed={maskVisible} onClick={()=>setMaskVisible(v=>!v)}>Condensation mask: {maskVisible?'on':'off'}</button>}
    {!ready&&<div className={styles.loading} aria-label="Loading rainy street"/>}
    <button className={styles.replay} onClick={()=>{skipRequested.current=false;setIntroDone(false);setReady(false);setRun(n=>n+1);}} aria-label="Replay rain window opening">↺ <span>Replay</span></button>
    {!debug&&<>
      <Link className={styles.backGallery} href="/#gallery">← Gallery</Link>
      {!introDone&&<button className={styles.skip} onClick={()=>{skipRequested.current=true;}}>Skip intro</button>}
      <button className={styles.explore} disabled={!introDone||exit.leaving} onClick={()=>exit.enter()} onKeyDown={event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();exit.enter();}}} style={{opacity:introDone ? .75 : 0,pointerEvents:introDone?'auto':'none'}} aria-label="Explore project">CLICK OR SCROLL TO EXPLORE <span aria-hidden="true">↓</span></button>
    </>}
  </section>
  </div>;
}
