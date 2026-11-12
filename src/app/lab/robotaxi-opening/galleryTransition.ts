'use client';
import { abortRainTransfer,beginRainTransfer,preloadRain } from './rainAudio';
export const openingHref='/lab/robotaxi-opening';
let overlay:HTMLDivElement|null=null,ghost:HTMLElement|null=null,locked=false;
let deadline:ReturnType<typeof setTimeout>|undefined,navigation:ReturnType<typeof setTimeout>|undefined;
let warmed=false;
let popListener:(()=>void)|undefined;
function releasePopListener(){if(popListener){window.removeEventListener('popstate',popListener);popListener=undefined;}}
export function prewarmOpening(prefetch:(href:string)=>void){
  if(warmed)return;warmed=true;prefetch(openingHref);
  const image=new Image();image.src='/robotaxi-opening/street.png';preloadRain();
}
function clearTransition(){
  releasePopListener();
  if(deadline)clearTimeout(deadline);if(navigation)clearTimeout(navigation);
  overlay?.remove();ghost?.remove();overlay=null;ghost=null;locked=false;
}
export function finishOpeningTransition(){
  releasePopListener();
  if(deadline)clearTimeout(deadline);
  const layer=overlay;ghost?.remove();ghost=null;locked=false;overlay=null;
  if(layer){const anim=layer.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'});anim.finished.catch(()=>{}).finally(()=>layer.remove());}
}
export function resetGalleryTransition(){clearTransition();abortRainTransfer();}
export function startGalleryTransition(card:HTMLElement,push:(href:string)=>void){
  if(locked)return;locked=true;
  beginRainTransfer();
  popListener=()=>{clearTransition();abortRainTransfer();};window.addEventListener('popstate',popListener,{once:true});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rect=card.getBoundingClientRect();
  overlay=document.createElement('div');overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{position:'fixed',inset:'0',background:'#050505',zIndex:'10000',opacity:'0'});document.body.append(overlay);
  if(!reduced)try{
    ghost=card.cloneNode(true) as HTMLElement;
    const sources=[card,...Array.from(card.querySelectorAll<HTMLElement>('*'))];
    const targets=[ghost,...Array.from(ghost.querySelectorAll<HTMLElement>('*'))];
    sources.forEach((source,i)=>{const style=getComputedStyle(source);for(const property of Array.from(style))targets[i].style.setProperty(property,style.getPropertyValue(property));});
    ghost.removeAttribute('href');ghost.setAttribute('aria-hidden','true');ghost.setAttribute('inert','');
    Object.assign(ghost.style,{position:'fixed',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,margin:'0',transform:'none',pointerEvents:'none',zIndex:'10001'});document.body.append(ghost);
    ghost.animate([{transform:'translateY(0) scale(1)',opacity:1},{transform:'translateY(-12px) scale(1.16)',opacity:0}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
  }catch{ghost?.remove();ghost=null;}
  overlay.animate([{opacity:0},{opacity:1}],{duration:reduced?80:240,fill:'forwards'});
  navigation=setTimeout(()=>{try{push(openingHref);}catch{clearTransition();abortRainTransfer();}},reduced?80:240);
  // Failure escape: restore Gallery instead of trapping input behind black.
  deadline=setTimeout(()=>{clearTransition();abortRainTransfer();},20000);
}
