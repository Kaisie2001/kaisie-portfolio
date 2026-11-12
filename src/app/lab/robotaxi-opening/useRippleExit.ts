'use client';
import { useCallback,useEffect,useRef,useState,type RefObject,type PointerEvent as ReactPointerEvent,type MouseEvent as ReactMouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { beginCaseRipple,defaultCaseDestination,type RippleOrigin } from './rippleTransition';
const control=(target:EventTarget|null)=>target instanceof Element&&!!target.closest('button,a,input,select,textarea');
const interactive=(target:EventTarget|null)=>control(target)||(target instanceof Element&&!!target.closest('[data-opening-copy]'));
export function useRippleExit(ready:boolean,stage:RefObject<HTMLElement|null>,destination=defaultCaseDestination,readySelector='main h1'){
  const router=useRouter(),mounted=useRef(true),locked=useRef(false),canEnter=useRef(ready);
  const [leaving,setLeaving]=useState(false);
  const press=useRef<{x:number;y:number;moved:boolean;armed:boolean}|null>(null);
  const wheel=useRef({sum:0,last:0,armed:false,readyAt:0});
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  useEffect(()=>{canEnter.current=ready;wheel.current={sum:0,last:performance.now(),armed:false,readyAt:performance.now()};press.current=null;},[ready]);
  useEffect(()=>{router.prefetch(destination);},[router,destination]);
  const enter=useCallback((origin?:RippleOrigin)=>{
    if(!canEnter.current||locked.current||!stage.current)return;
    locked.current=true;setLeaving(true);
    void beginCaseRipple({stage:stage.current,destination,readySelector,origin,navigate:href=>router.push(href,{scroll:true})}).finally(()=>{locked.current=false;if(mounted.current)setLeaving(false);});
  },[destination,readySelector,router,stage]);
  useEffect(()=>{
    const element=stage.current;if(!element)return;
    let touch:{x:number;y:number;lastX:number;lastY:number;length:number;started:number}|null=null;
    const onWheel=(event:WheelEvent)=>{
      if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||control(event.target))return;
      const now=performance.now(),state=wheel.current,gap=now-state.last;state.last=now;
      if(!canEnter.current||locked.current||now-state.readyAt<500){state.sum=0;return;}
      if(gap>220)state.armed=true;
      if(event.deltaY<=0){state.sum=0;state.armed=false;return;}
      if(!state.armed)return;
      if(gap>180)state.sum=0;
      state.sum+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
      if(state.sum>=120){event.preventDefault();enter();state.sum=0;state.armed=false;}
    };
    const start=(event:TouchEvent)=>{touch=canEnter.current&&!control(event.target)&&event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY,lastX:event.touches[0].clientX,lastY:event.touches[0].clientY,length:0,started:performance.now()}:null;};
    const move=(event:TouchEvent)=>{const to=event.touches[0];if(!touch||!to)return;touch.length+=Math.hypot(to.clientX-touch.lastX,to.clientY-touch.lastY);touch.lastX=to.clientX;touch.lastY=to.clientY;};
    const end=(event:TouchEvent)=>{const from=touch;touch=null;const to=event.changedTouches[0];if(!from||!to||!canEnter.current||locked.current)return;const dy=from.y-to.clientY,dx=from.x-to.clientX;const length=from.length+Math.hypot(to.clientX-from.lastX,to.clientY-from.lastY),duration=performance.now()-from.started;if(dy>100&&dy>Math.abs(dx)*1.7&&dy/Math.max(1,length)>.86&&duration>=60&&duration<=700)enter();};
    const cancel=()=>{touch=null;};
    element.addEventListener('wheel',onWheel,{passive:false});element.addEventListener('touchstart',start,{passive:true});element.addEventListener('touchmove',move,{passive:true});element.addEventListener('touchend',end,{passive:true});element.addEventListener('touchcancel',cancel,{passive:true});
    return()=>{element.removeEventListener('wheel',onWheel);element.removeEventListener('touchstart',start);element.removeEventListener('touchmove',move);element.removeEventListener('touchend',end);element.removeEventListener('touchcancel',cancel);};
  },[enter,stage]);
  const onPointerDown=(event:ReactPointerEvent<HTMLElement>)=>{press.current={x:event.clientX,y:event.clientY,moved:false,armed:canEnter.current&&!interactive(event.target)};};
  const onPointerMove=(event:ReactPointerEvent<HTMLElement>)=>{const p=press.current;if(p&&Math.hypot(event.clientX-p.x,event.clientY-p.y)>8)p.moved=true;};
  const onPointerCancel=()=>{if(press.current)press.current.moved=true;};
  const onBackgroundClick=(event:ReactMouseEvent<HTMLElement>)=>{const p=press.current;press.current=null;if(interactive(event.target)||!p?.armed||p.moved||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;enter({x:event.clientX,y:event.clientY});};
  return {enter,onPointerDown,onPointerMove,onPointerCancel,onBackgroundClick,leaving,state:leaving?'TRANSITIONING':ready?'READY':'INTRO'};
}
