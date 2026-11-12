'use client';

import { useEffect, useRef } from 'react';
import styles from './gallery.module.css';

/** A small optical study, deliberately independent of the Opening simulation. */
export function RainGlassCard() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext('2d');
    if(!canvas||!ctx)return;
    const image=new Image();
    const media=matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    let frame=0,last=0,time=0,visible=false,disposed=false;
    let seed=49;
    const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const beads=Array.from({length:64},()=>({x:random()*224,y:random()*296,r:.65+random()**2*3.1,stretch:1+random()*.5}));
    const movers=Array.from({length:3},(_,i)=>({x:36+i*65,y:random()*296,speed:3+random()*5,phase:random()*6}));
    function draw(){
      if(!ctx||!canvas)return;
      ctx.clearRect(0,0,224,296);
      const drop=(x:number,y:number,r:number,stretch:number)=>{
        ctx.save();ctx.beginPath();ctx.ellipse(x,y,r,r*stretch,.13,0,Math.PI*2);ctx.clip();
        if(image.complete&&image.naturalWidth){
          // Match the scene's cover crop, then locally magnify it inside water.
          const scale=296/image.naturalHeight;
          const crop=(image.naturalWidth*scale-224)*.72;
          ctx.translate(x,y);ctx.scale(1.12,1.12);ctx.translate(-x,-y);
          ctx.drawImage(image,-crop,0,image.naturalWidth*scale,296);
        }
        const lens=ctx.createLinearGradient(x-r,y-r,x+r,y+r*stretch);
        lens.addColorStop(0,'rgba(195,220,235,.38)');lens.addColorStop(.25,'rgba(10,17,21,.13)');lens.addColorStop(.72,'rgba(4,8,12,.25)');lens.addColorStop(1,'rgba(214,230,237,.2)');
        ctx.fillStyle=lens;ctx.fillRect(x-r*2,y-r*2,r*4,r*stretch*4);ctx.restore();
      };
      beads.forEach(b=>drop(b.x,b.y,b.r,b.stretch));
      movers.forEach(m=>{
        const y=(m.y+time*m.speed)%320-12;
        const x=m.x+Math.sin(y*.027+m.phase)*3.5;
        // A few overlapping translucent lenses taper into a short curved wake.
        for(let j=7;j>0;j--)drop(m.x+Math.sin((y-j*2)*.027+m.phase)*3.5,y-j*2,.38+(8-j)*.1,1.8);
        drop(x,y,2.1,1.6);
      });
    }
    function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
    function tick(now:number){
      frame=0;
      if(disposed||!visible||document.hidden||media.matches)return;
      if(!last||now-last>=50){time+=last?Math.min((now-last)/1000,.1):0;last=now;
        if(!canvas?.closest('[data-gallery-active="false"]'))draw();
      }
      frame=requestAnimationFrame(tick);
    }
    function sync(){stop();draw();if(visible&&!document.hidden&&!media.matches&&!canvas?.closest('[data-gallery-active="false"]'))frame=requestAnimationFrame(tick);}
    const host=canvas.closest('[data-gallery-active]');
    const activation=new MutationObserver(sync);
    if(host)activation.observe(host,{attributes:true,attributeFilter:['data-gallery-active']});
    const observer=new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>.15;sync();},{threshold:[0,.15]});
    observer.observe(canvas);
    image.onload=()=>{if(!disposed)draw();};image.src='/robotaxi-opening/street.png';
    document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);draw();
    return()=>{disposed=true;stop();observer.disconnect();activation.disconnect();image.onload=null;document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync);};
  },[]);
  return <div className={styles.rainGlass} aria-hidden="true"><div className={styles.rainScene}/><canvas ref={canvasRef} width={224} height={296}/><div className={styles.rainReflection}/></div>;
}
