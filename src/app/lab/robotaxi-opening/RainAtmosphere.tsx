'use client';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import styles from './opening.module.css';
import { attachRainScene,rainAudioSnapshot,rainAudioServerSnapshot,subscribeRainAudio,toggleRain } from './rainAudio';
import { startWetGlass } from './wetGlassRenderer';
import { createRainSimulation, type WaterFlowCallback } from './rainSimulation';

export default function RainAtmosphere({wet=true,enhanced=true,rainMode='full',onWaterFlow,hiddenVisuals=false,active=true}:{wet?:boolean;enhanced?:boolean;rainMode?:'impact'|'flow'|'full';onWaterFlow?:WaterFlowCallback;hiddenVisuals?:boolean;active?:boolean}) {
  const outside=useRef<HTMLCanvasElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  const {enabled:sound,loading:busy,failed}=useSyncExternalStore(subscribeRainAudio,rainAudioSnapshot,rainAudioServerSnapshot);
  useEffect(()=>{if(active)return attachRainScene();},[active]);
  useEffect(()=>{
    if(!active)return;
    if(wet)return startWetGlass(canvas.current!,outside.current!,enhanced,rainMode,onWaterFlow);
    const el=canvas.current!,ctx=el.getContext('2d')!,back=outside.current!,sky=back.getContext('2d')!;
    const beads=document.createElement('canvas'),trails=document.createElement('canvas');
    const b=beads.getContext('2d')!,t=trails.getContext('2d')!;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const low=(navigator.hardwareConcurrency||8)<=4;
    let width=0,height=0,raf=0,last=0,time=0;
    let simulation=createRainSimulation(1,1,low);
    let seed=98127;
    const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    function bead(c:CanvasRenderingContext2D,x:number,y:number,r:number,stretch:number){
      c.beginPath();c.ellipse(x,y,r,r*stretch,0,0,Math.PI*2);c.fillStyle='rgba(9,20,25,.29)';c.fill();
      c.lineWidth=.45;c.strokeStyle='rgba(218,232,232,.21)';c.beginPath();c.ellipse(x-r*.16,y-r*.2,r*.68,r*stretch*.72,0,Math.PI,Math.PI*1.75);c.stroke();
      c.fillStyle='rgba(241,245,238,.26)';c.beginPath();c.ellipse(x-r*.25,y-r*.45,Math.max(.3,r*.17),Math.max(.4,r*.22),0,0,Math.PI*2);c.fill();
    }
    function resize(){
      const ratio=Math.min(devicePixelRatio,low?1:1.25);width=innerWidth;height=innerHeight;
      for(const c of [el,beads,trails,back]){c.width=Math.round(width*ratio);c.height=Math.round(height*ratio);c.getContext('2d')!.setTransform(ratio,0,0,ratio,0,0);}
      seed=98127;
      const count=low?360:Math.min(1250,Math.max(420,width*height/1000));
      for(let i=0;i<count;i++){
        const x=random()*width,y=random()*height;
        // Broad patches avoid a uniform wallpaper distribution.
        if(random()>.58+.25*Math.sin(x/width*9+y/height*4))continue;
        const r=.45+Math.pow(random(),2)*2.1;bead(b,x,y,r,1+random()*.8);
      }
      simulation=createRainSimulation(width,height,low);last=0;draw(0);
    }
    function draw(dt:number){
      time+=dt;
      t.globalCompositeOperation='destination-out';t.fillStyle=`rgba(0,0,0,${1-Math.exp(-dt*.56)})`;t.fillRect(0,0,width,height);t.globalCompositeOperation='source-over';
      if(!reduced.matches)simulation.update(dt,(x,y,nx,ny,r)=>{
        t.beginPath();t.moveTo(x,y);t.lineTo(nx,ny);t.lineWidth=r*.48;t.strokeStyle='rgba(193,214,215,.16)';t.stroke();
      });
      ctx.clearRect(0,0,width,height);ctx.drawImage(beads,0,0,width,height);ctx.drawImage(trails,0,0,width,height);
      for(const d of simulation.drops){
        // An impact briefly flattens and settles into one bead: no ripple ring.
        const impact=reduced.matches?0:Math.max(0,1-d.age/.24);
        const fade=Math.min(1,(d.life-d.age)/2);
        ctx.globalAlpha=Math.max(0,fade)*(.86+.1*Math.sin(time*.7+d.phase));
        ctx.save();ctx.translate(d.x,d.y);ctx.scale(1+impact*.3,1-impact*.23);
        bead(ctx,Math.sin(time+d.phase)*.09,0,d.r,1.12+Math.min(.7,d.vy*.025));ctx.restore();
      }
      ctx.globalAlpha=1;
      sky.clearRect(0,0,width,height);sky.lineWidth=.7;
      for(const s of simulation.streaks){
        sky.beginPath();sky.moveTo(s.x,s.y);sky.lineTo(s.x+s.length*s.drift,s.y+s.length);sky.strokeStyle=`rgba(201,215,223,${s.alpha})`;sky.stroke();
      }
    }

    function frame(now:number){const dt=last?Math.min((now-last)/1000,.25):0;last=now;draw(dt);if(!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame);}
    function restart(){cancelAnimationFrame(raf);last=0;if(!document.hidden){draw(0);if(!reduced.matches)raf=requestAnimationFrame(frame);}}
    function onResize(){resize();restart();}
    window.addEventListener('resize',onResize);document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',restart);
    resize();restart();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',onResize);document.removeEventListener('visibilitychange',restart);reduced.removeEventListener('change',restart);};
  },[wet,enhanced,rainMode,onWaterFlow,active]);
  return <>
    <canvas ref={outside} className={styles.outsideRain} style={{visibility:hiddenVisuals?'hidden':undefined}} aria-hidden="true"/>
    <canvas ref={canvas} className={styles.rain} style={{visibility:hiddenVisuals?'hidden':undefined}} aria-hidden="true"/>
    {rainMode==='full'&&<>
    <button type="button" className={styles.sound} onClick={toggleRain} aria-busy={busy} aria-pressed={sound} aria-label={sound?'Mute rain ambience':'Enable rain ambience'}>
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/>{sound?<path d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>:<path d="m16 9 5 6m0-6-5 6"/>}</svg>
      <span>{busy?'Loading…':failed?'Retry sound':sound?'Sound on':'Enable sound'}</span>
    </button>
    <span className={styles.audioStatus} role="status">{failed?'Rain sound unavailable. The visual opening remains available.':''}</span>
    </>}
  </>;
}
