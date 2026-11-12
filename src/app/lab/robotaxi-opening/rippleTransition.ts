'use client';
import { rippleDuration,rippleGeometry,rippleSample } from './rippleField';
import { beginCaseAudioFade,finishCaseAudioFade,setCaseAudioFade } from './rainAudio';
export const defaultCaseDestination='/work/robotaxi-rain-mode';
export type RippleOrigin={x:number;y:number};
export type RippleOptions={stage:HTMLElement;destination:string;readySelector?:string;origin?:RippleOrigin;navigate:(href:string)=>void};
let active=false;
const ease=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
function snapshot(stage:HTMLElement){
  const copy=stage.cloneNode(true) as HTMLElement;
  const from=[stage,...Array.from(stage.querySelectorAll<HTMLElement>('*'))];
  const to=[copy,...Array.from(copy.querySelectorAll<HTMLElement>('*'))];
  from.forEach((node,i)=>{
    const style=getComputedStyle(node);
    for(const property of Array.from(style))to[i].style.setProperty(property,style.getPropertyValue(property));
    to[i].removeAttribute('id');
    if(node instanceof HTMLCanvasElement){const canvas=to[i] as HTMLCanvasElement;canvas.width=node.width;canvas.height=node.height;canvas.getContext('2d')?.drawImage(node,0,0);}
  });
  copy.querySelectorAll('button,a,input,select,textarea').forEach(node=>node.remove());
  copy.setAttribute('aria-hidden','true');copy.setAttribute('inert','');
  // Exclude the frozen copy from target readiness / Opening queries.
  copy.removeAttribute('data-opening-stage');copy.removeAttribute('data-phase');
  const rect=stage.getBoundingClientRect();
  Object.assign(copy.style,{position:'absolute',inset:'auto',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,margin:'0',transform:'none',zIndex:'0',overflow:'hidden'});
  const frame=document.createElement('div');frame.setAttribute('aria-hidden','true');frame.setAttribute('inert','');
  Object.assign(frame.style,{position:'absolute',inset:'0',background:'#050505',overflow:'hidden'});frame.append(copy);return frame;
}
export function beginCaseRipple(options:RippleOptions):Promise<boolean>{
  if(active)return Promise.resolve(false);
  const destination=new URL(options.destination,location.href);
  if(destination.origin!==location.origin)return Promise.resolve(false);
  if(destination.pathname===location.pathname&&(options.readySelector??'main h1')==='main h1')return Promise.resolve(false);
  const wasInert=options.stage.inert;
  active=true;
  return new Promise<boolean>(resolve=>{
    const sourceURL=location.href,w=innerWidth,h=innerHeight;
    history.replaceState({...history.state,__robotaxiIntroReady:true},'',sourceURL);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const simple=reduced||(navigator.hardwareConcurrency||8)<=4||typeof CSS==='undefined'||!CSS.supports('filter','url("#ripple")');
    const origin=options.origin??{x:w*.5,y:h*.48};
    const layer=document.createElement('div');layer.dataset.caseRipple='active';
    Object.assign(layer.style,{position:'fixed',inset:'0',zIndex:'20000',overflow:'hidden',background:'#050505'});
    let frozen:HTMLElement;
    try{frozen=snapshot(options.stage);}catch{active=false;resolve(false);return;}
    layer.append(frozen);document.body.append(layer);options.stage.inert=true;options.stage.setAttribute('inert','');
    const copy=frozen.querySelector<HTMLElement>('[data-opening-copy]');
    let start=performance.now(),readyAt:number|null=null,raf=0,done=false,navigated=false,preparing=false,pausedAt=0,failed=false;
    let watchdog:ReturnType<typeof setTimeout>;
    let imageNode:SVGFEImageElement|null=null,displacement:SVGFEDisplacementMapElement|null=null;
    const map=document.createElement('canvas');map.width=w<600?144:224;map.height=Math.max(96,Math.round(map.width*h/w));
    const context=map.getContext('2d')!,pixels=context.createImageData(map.width,map.height);
    if(!simple){
      const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
      Object.assign(svg.style,{position:'absolute',width:'0',height:'0'});svg.setAttribute('aria-hidden','true');
      const defs=document.createElementNS(ns,'defs'),filter=document.createElementNS(ns,'filter');
      const id=`opening-ripple-${Math.round(start*1000)}`;filter.id=id;filter.setAttribute('filterUnits','userSpaceOnUse');filter.setAttribute('x','-32');filter.setAttribute('y','-32');filter.setAttribute('width',String(w+64));filter.setAttribute('height',String(h+64));filter.setAttribute('color-interpolation-filters','sRGB');
      imageNode=document.createElementNS(ns,'feImage');imageNode.setAttribute('result','water-normal');imageNode.setAttribute('x','0');imageNode.setAttribute('y','0');imageNode.setAttribute('width',String(w));imageNode.setAttribute('height',String(h));imageNode.setAttribute('preserveAspectRatio','none');
      displacement=document.createElementNS(ns,'feDisplacementMap');displacement.setAttribute('in','SourceGraphic');displacement.setAttribute('in2','water-normal');displacement.setAttribute('xChannelSelector','R');displacement.setAttribute('yChannelSelector','G');displacement.setAttribute('scale','0');
      filter.append(imageNode,displacement);defs.append(filter);svg.append(defs);layer.append(svg);frozen.style.filter=`url(#${id})`;
    }
    const reveal=document.createElement('canvas');reveal.width=map.width;reveal.height=map.height;
    const revealContext=reveal.getContext('2d')!,revealPixels=revealContext.createImageData(reveal.width,reveal.height);
    frozen.style.maskSize='100% 100%';frozen.style.maskRepeat='no-repeat';
    function warp(progress:number){
      const {radius,band}=rippleGeometry(w,h,origin,progress);
      for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
        const dx=(x+.5)/map.width*w-origin.x,dy=(y+.5)/map.height*h-origin.y;
        const {distance,wave,retained}=rippleSample(dx,dy,radius,band,progress);
        const index=(y*map.width+x)*4;
        pixels.data[index]=Math.round(128+100*(distance?dx/distance:0)*wave);
        pixels.data[index+1]=Math.round(128+100*(distance?dy/distance:0)*wave);
        pixels.data[index+2]=128;pixels.data[index+3]=255;
        revealPixels.data[index]=255;revealPixels.data[index+1]=255;revealPixels.data[index+2]=255;
        revealPixels.data[index+3]=Math.round(255*retained);
      }
      if(imageNode&&displacement){
        context.putImageData(pixels,0,0);imageNode.setAttribute('href',map.toDataURL('image/png'));
        displacement.setAttribute('scale',String(18*(1-.55*progress)));
      }
      revealContext.putImageData(revealPixels,0,0);
      frozen.style.maskImage=`url("${reveal.toDataURL('image/png')}")`;
    }
    function finish(success:boolean){
      if(done)return;done=true;cancelAnimationFrame(raf);clearTimeout(watchdog);observer.disconnect();
      window.removeEventListener('popstate',back);window.removeEventListener('pagehide',hidePage);window.removeEventListener('keydown',keyLock,true);document.removeEventListener('visibilitychange',visibility);
      layer.remove();if(!wasInert){options.stage.inert=false;options.stage.removeAttribute('inert');}finishCaseAudioFade();active=false;resolve(success);
    }
    function keyLock(event:KeyboardEvent){if(!failed&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&['Enter',' ','Tab'].includes(event.key)){event.preventDefault();event.stopPropagation();}}
    function back(){finish(false);}
    function hidePage(){finish(false);}
    function fail(){
      if(done||failed)return;failed=true;cancelAnimationFrame(raf);observer.disconnect();finishCaseAudioFade();
      const box=document.createElement('div');Object.assign(box.style,{position:'absolute',bottom:'30px',left:'50%',transform:'translateX(-50%)',zIndex:'2',color:'#d4dcda',font:'13px MiSans,Arial,sans-serif',textAlign:'center'});
      const text=document.createElement('p');text.textContent='Project could not be loaded.';
      const button=document.createElement('button');button.textContent='Return to opening';Object.assign(button.style,{background:'#101719',border:'1px solid #92a09c',color:'inherit',padding:'10px 16px',marginTop:'12px',cursor:'pointer'});
      button.onclick=()=>{if(location.href!==sourceURL)history.back();else finish(false);};box.append(text,button);layer.append(box);button.focus();
    }
    function armWatchdog(){clearTimeout(watchdog);watchdog=setTimeout(fail,20000);}
    async function inspectDestination(){
      if(done||failed||preparing||!navigated||readyAt!==null)return;
      if(location.pathname!==destination.pathname)return;
      // App Router may retain a hidden prior page; inspect the visible target,
      // rather than requiring every Opening node to have been removed.
      const target=Array.from(document.querySelectorAll<HTMLElement>(options.readySelector??'main h1')).find(node=>{
        const rect=node.getBoundingClientRect();
        return node.isConnected&&rect.width>0&&rect.height>0&&(destination.pathname!==defaultCaseDestination||!!node.textContent?.includes('Robotaxi'));
      });
      if(!target)return;
      preparing=true;
      try{
        await document.fonts.ready;
        if(done||failed)return;
        const images=Array.from(document.querySelectorAll<HTMLImageElement>('main img')).filter(image=>{const r=image.getBoundingClientRect();return r.width>0&&r.top<h&&r.bottom>0;});
        await Promise.all(images.map(image=>image.decode()));
        // Commit/layout, not a guessed network delay.
        await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));
        if(!done&&!failed&&target.isConnected&&location.pathname===destination.pathname){readyAt=performance.now();layer.style.background='transparent';}
      }catch{if(!done)fail();}finally{preparing=false;}
    }
    const observer=new MutationObserver(()=>{void inspectDestination();});observer.observe(document.body,{childList:true,subtree:true});
    let lastWarp=-100;
    function frame(now:number){
      if(done||failed||document.hidden)return;
      const elapsed=now-start;
      // Hold the rain scene intact until the destination has committed and decoded.
      // Slow loads hold at the touch phase; the reveal never outruns readiness.
      const revealElapsed=readyAt===null?0:now-Math.max(readyAt,start+180);
      const progress=Math.max(0,Math.min(1,revealElapsed/rippleDuration));
      if(!reduced&&readyAt!==null&&now-lastWarp>1000/30){try{warp(progress);}catch{frozen.style.filter='none';imageNode=null;displacement=null;frozen.style.opacity=String(1-ease(progress));}lastWarp=now;}
      else if(!reduced&&readyAt===null&&displacement){displacement.setAttribute('scale',String(3*Math.sin(Math.PI*Math.min(elapsed/250,1))));}
      if(copy)copy.style.opacity=String(1-ease((elapsed-80)/(reduced?100:600)));
      if(!navigated&&elapsed>=(reduced?0:120)){
        navigated=true;
        try{options.navigate(options.destination);}catch{fail();return;}
      }
      void inspectDestination();
      const dissolve=readyAt===null?0:reduced?ease((now-readyAt)/180):progress;
      if(reduced)frozen.style.opacity=String(1-dissolve);
      setCaseAudioFade(.15*ease(elapsed/700)+.85*ease(dissolve));
      if(dissolve===1){finish(true);return;}
      raf=requestAnimationFrame(frame);
    }
    function visibility(){
      if(document.hidden){pausedAt=performance.now();cancelAnimationFrame(raf);clearTimeout(watchdog);}
      else{if(failed||done)return;const pause=pausedAt?performance.now()-pausedAt:0;start+=pause;if(readyAt!==null)readyAt+=pause;pausedAt=0;armWatchdog();raf=requestAnimationFrame(frame);}
    }
    beginCaseAudioFade();window.addEventListener('popstate',back);window.addEventListener('pagehide',hidePage);window.addEventListener('keydown',keyLock,true);document.addEventListener('visibilitychange',visibility);armWatchdog();raf=requestAnimationFrame(frame);
  }).catch(()=>{document.querySelectorAll('[data-case-ripple]').forEach(layer=>layer.remove());if(!wasInert){options.stage.inert=false;options.stage.removeAttribute('inert');}finishCaseAudioFade();active=false;return false;});
}
