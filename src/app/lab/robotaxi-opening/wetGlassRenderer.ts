import { createRainSimulation, type GlassDrop, type WaterFlowCallback } from './rainSimulation';
/** Local scene sampling, not white outlines. A lens approximation, not a fluid solver. */
export function startWetGlass(foreground:HTMLCanvasElement,background:HTMLCanvasElement,enhanced=true,mode:'impact'|'flow'|'full'='full',onWaterFlow?:WaterFlowCallback){
  const ctx=foreground.getContext('2d')!,sky=background.getContext('2d')!;
  const entryStage=foreground.closest<HTMLElement>('[data-opening-stage]');
  const plate=document.createElement('canvas'),source=document.createElement('canvas');
  const p=plate.getContext('2d')!,s=source.getContext('2d')!;
  const image=new Image(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const low=(navigator.hardwareConcurrency||8)<=4;
  let width=0,height=0,raf=0,last=0,dead=false,ready=false;
  let renderedAt=0;
  let pixels:Uint8ClampedArray<ArrayBufferLike>=new Uint8ClampedArray(0);
  let sim=createRainSimulation(1,1,low,true,enhanced);
  function shape(d:GlassDrop,r:number){
    ctx.beginPath();
    const contact=Math.max(0,Math.min(1,(d.age-.018)/.075));
    const release=Math.max(0,1-Math.max(0,d.age-.093)/.19);
    const spread=d.age<.283&&!d.satellite?Math.sin(contact*Math.PI/2)*release:0;
    const stretch=1+Math.min(1.2,d.vy*.025)+Math.max(0,d.r-2)*.04;
    const asymmetry=Math.min(1,Math.max(0,d.r-1)/3);
    for(let i=0;i<=40;i++){
      const a=i/40*Math.PI*2;
      const lobe=Math.pow(Math.max(0,Math.cos(a*3+d.phase)),5)*(.5+.3*Math.sin(a*2-d.phase));
      const edge=1+asymmetry*d.roughness*Math.sin(a*3+d.phase)+asymmetry*.06*Math.sin(a*7-d.phase)+spread*(.12*Math.sin(a*5+d.phase)+lobe*.6);
      const down=Math.sin(a),neck=1-asymmetry*.18*Math.max(0,-down);
      const x=d.x+Math.cos(a)*r*edge*neck*(1+spread*.7)+down*r*d.skew*.3;
      const y=d.y+down*r*stretch*edge*(1-spread*.42)+Math.max(0,down)*r*asymmetry*.12;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }ctx.closePath();
  }
  function lens(d:GlassDrop){
    const impact=Math.min(1,d.age/.055),settle=Math.exp(-d.age*13)*Math.sin(d.age*42);
    const r=d.r*(.42+.58*impact)*(1+settle*.2);
    if(r<.3)return;
    const contact=Math.max(0,Math.min(1,(d.age-.018)/.075));
    const release=Math.max(0,1-Math.max(0,d.age-.093)/.19);
    const spread=d.age<.283&&!d.satellite?Math.sin(contact*Math.PI/2)*release:0;
    const boundX=r*(1.35+spread*1.2+Math.abs(d.skew)*.3);
    const extent=r*(1.55+Math.min(1.4,d.vy*.03)+Math.max(0,d.r-2)*.04);
    ctx.save();shape(d,r);ctx.clip();
    ctx.globalAlpha=Math.min(1,(d.life-d.age)*2);
    // Each strip samples a different local offset: lens slope bends the scene.
    const top=d.y-extent,bottom=d.y+extent,step=Math.max(.85,extent/(low?3:4));
    for(let y=top;y<bottom;y+=step){
      const v=(y-d.y)/extent,bulge=Math.sqrt(Math.max(0,1-v*v));
      const zoom=1.12+bulge*.32,dx=Math.sin(d.phase)*r*.17,dy=v*r*.65;
      const sw=2*boundX/zoom,sh=step/zoom;
      const sx=Math.max(0,Math.min(width-sw,d.x-sw/2+dx));
      const sy=Math.max(0,Math.min(height-sh,y+dy));
      ctx.drawImage(source,sx,sy,sw,sh,d.x-boundX,y,2*boundX,step+.25);
    }
    // Fresnel-like dark rim and translucent thickness; no stroked white circle.
    const thickness=ctx.createRadialGradient(d.x-r*.24,d.y-r*.3,r*.1,d.x,d.y,extent);
    thickness.addColorStop(0,'rgba(220,232,235,.025)');thickness.addColorStop(.63,'rgba(6,15,21,.015)');thickness.addColorStop(.88,'rgba(3,9,14,.1)');thickness.addColorStop(1,'rgba(2,6,10,.18)');
    ctx.fillStyle=thickness;ctx.fillRect(d.x-boundX,top,boundX*2,extent*2);
    // Scene-derived color/brightness, concentrated into a tiny soft reflection.
    const index=(Math.max(0,Math.min(height-1,Math.round(d.y)))*width+Math.max(0,Math.min(width-1,Math.round(d.x))))*4;
    const light=pixels.subarray(index,index+4);
    const glow=ctx.createRadialGradient(d.x-r*.32,d.y-r*.42,0,d.x-r*.32,d.y-r*.42,r*.54);
    glow.addColorStop(0,`rgba(${Math.min(255,light[0]+70)},${Math.min(255,light[1]+70)},${Math.min(255,light[2]+70)},.48)`);glow.addColorStop(1,'rgba(220,230,233,0)');
    ctx.fillStyle=glow;ctx.fillRect(d.x-boundX,top,boundX*2,extent*2);ctx.restore();
  }
  function ribbon(d:GlassDrop){
    if(d.path.length<3)return;
    const points=d.path,edges:{x:number;y:number}[][]=[[],[]];
    const now=sim.stats().time;
    for(let i=0;i<points.length;i++){
      const point=points[i],before=points[Math.max(0,i-1)],after=points[Math.min(points.length-1,i+1)];
      const dx=after.x-before.x,dy=after.y-before.y,length=Math.max(.001,Math.hypot(dx,dy));
      const taper=Math.min(1,(i+1)/6)*Math.max(0,1-(now-point.time)/2.4);
      const half=point.width*taper;
      edges[0].push({x:point.x-dy/length*half,y:point.y+dx/length*half});
      edges[1].push({x:point.x+dy/length*half,y:point.y-dx/length*half});
    }
    const outline=[...edges[0],...edges[1].reverse()];
    ctx.save();ctx.beginPath();ctx.moveTo(outline[0].x,outline[0].y);
    for(let i=1;i<outline.length;i++){
      const a=outline[i],b=outline[(i+1)%outline.length];ctx.quadraticCurveTo(a.x,a.y,(a.x+b.x)/2,(a.y+b.y)/2);
    }
    ctx.closePath();ctx.clip();
    const xs=outline.map(p=>p.x),ys=outline.map(p=>p.y);
    const x=Math.max(0,Math.floor(Math.min(...xs))),y=Math.max(0,Math.floor(Math.min(...ys)));
    const rw=Math.min(width-x,Math.ceil(Math.max(...xs)-x)+1),rh=Math.min(height-y,Math.ceil(Math.max(...ys)-y)+1);
    if(rw>0&&rh>0){ctx.globalAlpha=.42*Math.min(1,Math.max(0,(d.life-d.age)/1.5));ctx.drawImage(source,Math.min(width-rw,x+1.4),y,rw,rh,x,y,rw,rh);ctx.globalAlpha=1;}
    ctx.restore();
  }
  function draw(dt:number){
    sky.clearRect(0,0,width,height);
    if(!reduced.matches)sim.update(dt,onWaterFlow);
    if(mode==='full')for(const rain of sim.streaks){sky.beginPath();sky.moveTo(rain.x,rain.y);sky.lineTo(rain.x+rain.length*rain.drift,rain.y+rain.length);sky.strokeStyle=`rgba(194,210,217,${rain.alpha*.5})`;sky.lineWidth=.6;sky.stroke();}
    s.clearRect(0,0,width,height);s.fillStyle='#050505';s.fillRect(0,0,width,height);
    s.globalAlpha=entryStage?Number(entryStage.style.getPropertyValue('--scene-light')||'0'):1;
    s.drawImage(plate,0,0);s.drawImage(background,0,0,width,height);s.globalAlpha=1;
    ctx.clearRect(0,0,width,height);
    if(mode!=='impact')for(const d of sim.drops)ribbon(d);
    for(const d of sim.drops){
      if(mode==='impact'&&d.age>(d.satellite?.5:.32))continue;
      if(mode==='flow'&&d.age<.32)continue;
      lens(d);
    }
  }
  function frame(now:number){if(dead||document.hidden)return;if(!reduced.matches&&now-renderedAt<(low?1000/24:1000/30)){raf=requestAnimationFrame(frame);return;}const dt=last?Math.min(.25,(now-last)/1000):0;last=now;renderedAt=now;draw(dt);if(!reduced.matches)raf=requestAnimationFrame(frame);}
  function resume(){cancelAnimationFrame(raf);last=0;if(ready&&!document.hidden)raf=requestAnimationFrame(frame);}
  function resize(){
    if(!ready||dead)return;
    width=innerWidth;height=innerHeight;
    // Native CSS pixel resolution bounds sampling cost on high-DPR phones.
    for(const c of [foreground,background,plate,source]){c.width=width;c.height=height;}
    const scale=Math.max(width/image.width,height/image.height),iw=image.width*scale,ih=image.height*scale;
    p.filter='brightness(.75) saturate(.74)';p.drawImage(image,(width-iw)/2,(height-ih)/2,iw,ih);p.filter='none';pixels=p.getImageData(0,0,width,height).data;
    sim=createRainSimulation(width,height,low,true,enhanced);resume();
  }
  image.onload=()=>{if(dead)return;ready=true;resize();};image.src='/robotaxi-opening/street.png';
  window.addEventListener('resize',resize);document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);
  return()=>{dead=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume);};
}
