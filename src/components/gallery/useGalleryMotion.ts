'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { galleryFixtures } from './galleryFixtures';
import { flipPose, galleryMotion, orbitPose } from './galleryMotion';
import { galleryFraming, fitGalleryScale } from './galleryFraming';
import { advanceEdge, centeredOrbit, hoverCandidateAllowed, snapEase, damp, getTargetOrbitSpeed, galleryRegion, type PointerZone, type GalleryRegion, galleryInteraction as config } from './galleryInteraction';

type Options={orbitEnabled:boolean;flipEnabled:boolean;paused:boolean;reducedMotion:boolean|null;debugEnabled:boolean;onAmbientChange:(index:number|null)=>void};
type Snap={index:number;from:number;to:number;elapsed:number;started:number;samples:{elapsed:number;phase:number}[]};
export function useGalleryMotion(root:RefObject<HTMLElement|null>,options:Options){
  const controller=useRef({orbit:0,target:0,velocity:0,settleTarget:null as number|null,ambient:-1,dismissed:false,snap:null as Snap|null,frontCorrection:0,
    flips:galleryFixtures.map(()=>0),lift:galleryFixtures.map(()=>0),correction:galleryFixtures.map(()=>0)});
  const {orbitEnabled,flipEnabled,paused,reducedMotion,debugEnabled,onAmbientChange}=options;
  useEffect(()=>{
    const host=root.current,viewport=host?.querySelector<HTMLElement>('[data-gallery-viewport]');
    if(!host||!viewport)return;
    const items=Array.from(host.querySelectorAll<HTMLElement>('[data-orbit-item]'));
    const flips=Array.from(host.querySelectorAll<HTMLElement>('[data-flip-layer]'));
    const lifts=Array.from(host.querySelectorAll<HTMLElement>('[data-focus-transform]'));
    const s=controller.current;
    // Experiment-only isolation switch; reload ?autofocus=off to remove every
    // candidate/snap/focus path without touching either animation clock.
    const focusEnabled=new URLSearchParams(window.location.search).get('autofocus')!=='off';
    host.setAttribute('data-motion-version','orbit-policy-20261109');
    host.setAttribute('data-auto-focus-enabled',String(focusEnabled));
    const fit=()=>{
      const b=viewport.getBoundingClientRect();
      const scale=fitGalleryScale(b.width,b.height);
      viewport.style.setProperty('--gallery-scale',String(scale));
      viewport.style.setProperty('--gallery-perspective',`${galleryFraming.perspective}px`);
      host.setAttribute('data-frame-scale',String(scale));
    };
    const resize=new ResizeObserver(fit);resize.observe(viewport);fit();
    let frame=0,previous:number|null=null,inside=false,hasPosition=false,x=0,y=0,normalized=.5;
    let region:GalleryRegion='CENTER_SELECT',candidate=-1,candidateSince=0;
    let intent:{index:number;lastMove:number;expires:number}|null=null,anchorX=NaN,anchorY=NaN,debugAt=-Infinity;
    const audit={samples:0,minClearance:Infinity,clipped:0,autoTravelDegrees:0,autoSeconds:0,flipTravel:galleryFixtures.map(()=>0)};
    /** Read real projected card bounds and pick the closest visible surface.
     * This function runs ONLY on meaningful pointer movement, never from RAF:
     * a card passing beneath an idle cursor cannot initiate a selection. */
    const candidateAtPointer=(preferred=-1)=>{
      const underPointer=document.elementFromPoint(x,y)?.closest('[data-orbit-item]');
      const topmost=items.findIndex(el=>el===underPointer);
      const b=viewport.getBoundingClientRect();
      const relativeX=x-b.left,relativeY=y-b.top;
      let best=-1,bestScore=Infinity;
      galleryFixtures.forEach((project,index)=>{
        const box=flips[index].getBoundingClientRect();
        const projection={index,left:box.left-b.left,right:box.right-b.left,
          facing:Math.cos((flipPose(project,index,s.flips[index]).yaw+s.correction[index])*Math.PI/180)};
        if(!hoverCandidateAllowed(s.orbit,index,projection,b.width))return;
        // Distance to the *rectangle*, not just its center. At the boundary,
        // a generous magnetic reach makes targeting a fast card much easier.
        const dx=Math.max(projection.left-relativeX,0,relativeX-projection.right);
        const dy=Math.max(box.top-b.top-relativeY,0,relativeY-(box.bottom-b.top));
        const distance=Math.hypot(dx,dy);
        const reach=index===preferred?config.magneticRetainPx:config.magneticReachPx;
        if(distance>reach)return;
        const depth=orbitPose(project,s.orbit).z;
        const score=distance-depth*.035
          -(index===preferred?config.magneticStickyBonus:0)
          -(index===topmost?12:0);
        if(score<bestScore){bestScore=score;best=index;}
      });
      return best;
    };
    let touch:{id:number;x:number;y:number;lastX:number;active:boolean;vertical:boolean}|null=null;
    const blocked=()=>paused||reducedMotion!==false||document.hidden;
    const ambient=(index:number)=>{
      if(s.ambient===index)return;
      s.ambient=index;candidate=-1;
      if(index>=0){s.velocity=0;s.settleTarget=null;}
      onAmbientChange(index<0?null:index);
    };
    const reportSnap=(status:'completed'|'cancelled')=>{
      if(!s.snap)return;
      host.setAttribute('data-last-snap-report',JSON.stringify({cardId:galleryFixtures[s.snap.index].id,from:s.snap.from,to:s.snap.to,elapsed:s.snap.elapsed,configuredDuration:config.snapDuration,status,samples:s.snap.samples}));
    };
    const cancelSnap=()=>{if(s.snap){reportSnap('cancelled');s.snap=null;s.target=s.orbit;}};
    const releaseTouch=()=>{
      if(!touch)return;const old=touch;touch=null;
      if(viewport.hasPointerCapture(old.id))viewport.releasePointerCapture(old.id);
      inside=false;hasPosition=false;
    };
    const tick=(now:number)=>{
      // Visibility restarts reset `previous`, so the real elapsed time needs no
      // per-frame cap that would slow the clock on a lower-frame-rate device.
      const dt=previous===null?0:Math.max(0,(now-previous)/1000);previous=now;
      const phaseBefore=s.orbit,flipsBefore=[...s.flips];
      region=galleryRegion(normalized,region);
      const central=inside&&hasPosition&&region==='CENTER_SELECT';
      const edgeActive=inside&&hasPosition&&region!=='CENTER_SELECT';
      const pointerZone:PointerZone=!inside||!hasPosition?'outside':region==='EDGE_LEFT'?'left':region==='EDGE_RIGHT'?'right':'center';
      if(!focusEnabled||!central||touch?.active||blocked()){
        ambient(-1);cancelSnap();candidate=-1;intent=null;if(!central)s.dismissed=false;
      }
      // All navigation branches converge here. No hover/intent/idle override
      // is allowed to turn AUTO into a zero-speed state.
      const targetSpeed=getTargetOrbitSpeed(pointerZone,s.ambient>=0,paused);
      const drive=targetSpeed*galleryMotion.orbit.period/(2*Math.PI);
      if(s.snap&&!blocked()){
        const snap=s.snap;snap.elapsed=Math.min(config.snapDuration,snap.elapsed+dt);
        s.orbit=snap.from+(snap.to-snap.from)*snapEase(snap.elapsed/config.snapDuration);
        if(snap.samples.length<50)snap.samples.push({elapsed:snap.elapsed,phase:s.orbit});
        if(snap.elapsed>=config.snapDuration){
          s.orbit=snap.to;reportSnap('completed');s.snap=null;ambient(snap.index);
        }
      }else if(orbitEnabled&&!touch?.active)advanceEdge(s,drive,dt,blocked()||s.ambient>=0);
      else if(!orbitEnabled){s.target=s.orbit;s.velocity=0;s.settleTarget=null;}
      else if(!blocked()){s.orbit=damp(s.orbit,s.target,config.followResponse,dt);s.velocity=0;s.settleTarget=null;}
      let hovered=-1;
      if(focusEnabled&&!blocked()&&central&&!touch?.active&&s.ambient<0&&!s.snap&&!s.dismissed&&intent){
        // Revalidate the armed target only. Do not adopt a card that moves
        // under a stationary cursor after an earlier blank-space movement.
        // The central projected hit was already validated on real input.
        // Keep that ID during dwell: Orbit must not move it out of eligibility
        // merely because its projected rectangle has left the stationary cursor.
        const index=intent.index,pos=orbitPose(galleryFixtures[index],s.orbit);
        const yaw=flipPose(galleryFixtures[index],index,s.flips[index]).yaw+s.correction[index];
        // A card can advance several degrees during a short dwell. Do not
        // reject an explicitly armed target merely for moving a little.
        const valid=pos.z>galleryMotion.orbit.centerZ-galleryMotion.orbit.radiusZ*.05&&Math.abs(Math.cos(yaw*Math.PI/180))>.08;
        if(!valid){host.setAttribute('data-last-selection-outcome','left-foreground');intent=null;candidate=-1;}
        else {
          hovered=candidate=intent.index;
          // Requiring the mouse to stop here previously made moving cards
          // nearly impossible to catch. Deliberate movement is already
          // guaranteed by updateMouse; a short dwell alone is enough.
          if(now-candidateSince>=config.hoverDwellMs){
            const to=centeredOrbit(hovered,s.orbit);
            if(orbitEnabled||Math.abs(to-s.orbit)<.001){
              const yaw=flipPose(galleryFixtures[hovered],hovered,s.flips[hovered]).yaw+s.correction[hovered];
              s.frontCorrection=s.correction[hovered]+Math.round(yaw/360)*360-yaw;
              host.setAttribute('data-last-selection-outcome','committed');
              s.snap={index:hovered,from:s.orbit,to,elapsed:0,started:now,samples:[{elapsed:0,phase:s.orbit}]};
              s.velocity=0;s.settleTarget=null;candidate=-1;intent=null;
            }
          }else if(now>intent.expires){host.setAttribute('data-last-selection-outcome','expired-unstable-input');intent=null;candidate=-1;}
        }
      }else if(!intent)candidate=-1;
      const target=s.snap?.index??s.ambient;
      host.setAttribute('data-active-card-id',target>=0?galleryFixtures[target].id:hovered>=0?galleryFixtures[hovered].id:'');
      host.setAttribute('data-selected-card-id',target>=0?galleryFixtures[target].id:'');
      host.setAttribute('data-snap-progress',s.snap?String(s.snap.elapsed/config.snapDuration):'');
      galleryFixtures.forEach((p,i)=>{
        if(!blocked()){
          if(flipEnabled&&s.ambient<0&&i!==target&&i!==candidate&&!touch?.active)s.flips[i]+=dt;
          s.lift[i]=damp(s.lift[i],i===s.ambient?1:0,config.hoverResponse,dt);
          s.correction[i]=damp(s.correction[i],i===target?s.frontCorrection:0,config.hoverResponse,dt);
        }
        const pos=orbitPose(p,s.orbit),rotation=flipPose(p,i,s.flips[i]);
        items[i].style.transform=`translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;
        const magnetArmed=i===candidate&&s.ambient<0&&!s.snap;
        if(items[i].getAttribute('data-hovered')!==String(magnetArmed))items[i].setAttribute('data-hovered',String(magnetArmed));
        flips[i].style.transform=`rotateZ(${rotation.roll}deg) rotateY(${rotation.yaw+s.correction[i]}deg)`;
        lifts[i].style.transform=`translateZ(${config.hoverDepth*s.lift[i]}px) scale(${1+(config.hoverScale-1)*s.lift[i]})`;
      });
      const reasons=[...(paused?['MANUAL_PAUSE']:[]),...(reducedMotion!==false?['REDUCED_MOTION']:[]),...(document.hidden?['DOCUMENT_HIDDEN']:[]),...(!orbitEnabled?['ORBIT_DEBUG_DISABLED']:[]),...(s.ambient>=0?['AMBIENT_FOCUS']:[]),...(s.snap?['SNAPPING']:[]),...(touch?.active?['TOUCH_CONTROL']:[])];
      const state=paused?'MANUAL_PAUSE':reducedMotion!==false?'REDUCED_MOTION':document.hidden?'DOCUMENT_HIDDEN':s.ambient>=0?'AMBIENT_FOCUS':s.snap?'SNAPPING':edgeActive?region:'AUTO';
      const angularVelocity=dt>0?(s.orbit-phaseBefore)*360/galleryMotion.orbit.period/dt:0;
      const targetAngularVelocity=reasons.length?0:targetSpeed*180/Math.PI;
      const selectedCardId=target>=0?galleryFixtures[target].id:null;
      const flipState=blocked()?'PAUSED':!flipEnabled?'DEBUG_DISABLED':s.ambient>=0?'FOCUS_PAUSED':target>=0||candidate>=0?'TARGET_HELD_OTHERS_RUNNING':'RUNNING';
      host.setAttribute('data-exploration-mode',state);
      host.setAttribute('data-orbit-sample',JSON.stringify({interactionState:state,pointerZone,focusedCardId:s.ambient>=0?galleryFixtures[s.ambient].id:null,actualOrbitSpeed:angularVelocity*Math.PI/180,targetOrbitSpeed:targetAngularVelocity*Math.PI/180,orbitAngle:s.orbit*2*Math.PI/galleryMotion.orbit.period,autoFocusEnabled:focusEnabled,phase:s.orbit,angle:s.orbit*360/galleryMotion.orbit.period,angularVelocity,targetAngularVelocity,velocity:s.velocity,time:now,drive,state,flipState,flipTimes:s.flips,selectedCardId,pauseReasons:reasons}));
      if(debugEnabled){
        if(state==='AUTO'&&!blocked()){audit.autoTravelDegrees+=Math.abs(s.orbit-phaseBefore)*360/galleryMotion.orbit.period;audit.autoSeconds+=dt;}
        s.flips.forEach((time,i)=>audit.flipTravel[i]+=time-flipsBefore[i]);
        if(now-debugAt>=100){
          debugAt=now;const b=viewport.getBoundingClientRect();
          const clearance=Math.min(...flips.map(el=>{const c=el.getBoundingClientRect();return Math.min(c.left-b.left,b.right-c.right,c.top-b.top,b.bottom-c.bottom);}));
          audit.samples++;audit.minClearance=Math.min(audit.minClearance,clearance);if(clearance<0)audit.clipped++;
          host.setAttribute('data-motion-audit',JSON.stringify(audit));
          const output=host.querySelector<HTMLElement>('[data-motion-debug-output]');
          if(output)output.textContent=`interactionState: ${state}\npointerZone: ${pointerZone}\nAuto Focus: ${focusEnabled?'on':'OFF (isolation)'}\nOrbit angle: ${(((s.orbit*360/galleryMotion.orbit.period)%360+360)%360).toFixed(1)}°\nactualOrbitSpeed: ${angularVelocity.toFixed(2)}°/s\ntargetOrbitSpeed: ${targetAngularVelocity.toFixed(2)}°/s\nLocal Flip: ${flipState}\nfocusedCardId: ${s.ambient>=0?galleryFixtures[s.ambient].id:'—'}\nPause reasons: ${reasons.join(', ')||'none'}`;
        }
      }
      if(!blocked())frame=requestAnimationFrame(tick);
    };
    const restart=()=>{
      cancelAnimationFrame(frame);previous=null;
      if(blocked()){releaseTouch();intent=null;candidate=-1;s.velocity=0;s.settleTarget=null;}
      // Publish one truthful paused frame as well, instead of stale diagnostics.
      tick(performance.now());
    };
    const updateMouse=(e:PointerEvent,armSelection=true)=>{
      inside=true;hasPosition=true;x=e.clientX;y=e.clientY;const b=viewport.getBoundingClientRect();normalized=(x-b.left)/Math.max(1,b.width);
      if(!armSelection)return;
      const moved=!Number.isFinite(anchorX)||Math.hypot(x-anchorX,y-anchorY)>=config.intentDistance;
      if(!moved)return;anchorX=x;anchorY=y;
      region=galleryRegion(normalized,region);
      if(!focusEnabled||region!=='CENTER_SELECT'||blocked()||s.snap||s.ambient>=0){intent=null;candidate=-1;return;}
      s.dismissed=false;
      const hit=candidateAtPointer(intent?.index??-1),now=performance.now();
      if(hit<0){intent=null;candidate=-1;return;}
      if(intent?.index!==hit){candidateSince=now;intent={index:hit,lastMove:now,expires:now+500};}
      else {intent.lastMove=now;intent.expires=now+500;}
      host.setAttribute('data-last-pointer-intent',JSON.stringify({hit,intent,phase:s.orbit,candidateSince,magnetic:true}));
      candidate=hit;
    };
    const enter=(e:PointerEvent)=>{if(e.pointerType==='mouse')updateMouse(e,false);};
    const move=(e:PointerEvent)=>{
      if(inFocusControls(e.target))return;
      if(e.pointerType==='mouse'){updateMouse(e);return;}
      if(!touch||touch.id!==e.pointerId||touch.vertical||blocked())return;
      const dx=e.clientX-touch.x,dy=e.clientY-touch.y;
      if(!touch.active){if(Math.hypot(dx,dy)<config.touchThreshold)return;if(Math.abs(dy)>Math.abs(dx)){touch.vertical=true;return;}touch.active=true;ambient(-1);cancelSnap();s.target=s.orbit;viewport.setPointerCapture(e.pointerId);}
      if(e.cancelable)e.preventDefault();
      if(orbitEnabled)s.target-=(e.clientX-touch.lastX)*galleryMotion.orbit.period*config.turnsPerViewport/Math.max(1,viewport.clientWidth);
      touch.lastX=e.clientX;
    };
    const down=(e:PointerEvent)=>{if(e.pointerType==='touch'&&e.isPrimary&&!touch&&!blocked()){touch={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,active:false,vertical:false};ambient(-1);cancelSnap();}};
    const up=(e:PointerEvent)=>{if(e.pointerId===touch?.id)releaseTouch();};
    const inFocusControls=(target:EventTarget|null)=>s.ambient>=0&&target instanceof Element&&host.contains(target)&&!!target.closest('[data-gallery-focus-controls]');
    const leave=(e:PointerEvent)=>{if(inFocusControls(e.relatedTarget))return;if(e.pointerType==='mouse'){inside=false;hasPosition=false;intent=null;candidate=-1;anchorX=NaN;anchorY=NaN;ambient(-1);cancelSnap();s.dismissed=false;}else if(touch&&!touch.active)releaseTouch();};
    // Reconcile position at the window boundary as well. A missed/retargeted
    // viewport pointerleave must never retain a stale central candidate/focus.
    const trackMouse=(e:PointerEvent)=>{
      if(e.pointerType!=='mouse'||inFocusControls(e.target))return;
      const b=viewport.getBoundingClientRect();
      if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom||!viewport.contains(e.target as Node)){leave(e);return;}
      updateMouse(e);
    };
    const out=(e:PointerEvent)=>{if(e.relatedTarget===null)leave(e);};
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape'&&(s.ambient>=0||s.snap)){e.preventDefault();s.dismissed=true;intent=null;candidate=-1;ambient(-1);cancelSnap();}
      if(e.target instanceof Element&&viewport.contains(e.target)&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){
        e.preventDefault();inside=true;hasPosition=true;normalized=e.key==='ArrowLeft'?0:1;s.dismissed=false;
      }
    };
    const keyUp=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight')normalized=.5;};
    const blur=()=>{inside=false;hasPosition=false;intent=null;candidate=-1;releaseTouch();ambient(-1);cancelSnap();s.settleTarget=null;previous=null;};
    viewport.addEventListener('pointerenter',enter);viewport.addEventListener('pointermove',move,{passive:false});viewport.addEventListener('pointerleave',leave);viewport.addEventListener('pointerdown',down);viewport.addEventListener('lostpointercapture',up);
    window.addEventListener('pointermove',trackMouse,{capture:true,passive:true});window.addEventListener('pointerout',out);
    window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('blur',blur);window.addEventListener('keydown',key);window.addEventListener('keyup',keyUp);document.addEventListener('visibilitychange',restart);restart();
    return()=>{
      cancelAnimationFrame(frame);resize.disconnect();releaseTouch();
      viewport.removeEventListener('pointerenter',enter);viewport.removeEventListener('pointermove',move);viewport.removeEventListener('pointerleave',leave);viewport.removeEventListener('pointerdown',down);viewport.removeEventListener('lostpointercapture',up);
      window.removeEventListener('pointermove',trackMouse,true);window.removeEventListener('pointerout',out);
      window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('blur',blur);window.removeEventListener('keydown',key);window.removeEventListener('keyup',keyUp);document.removeEventListener('visibilitychange',restart);
    };
  },[root,orbitEnabled,flipEnabled,paused,reducedMotion,debugEnabled,onAmbientChange]);
}
