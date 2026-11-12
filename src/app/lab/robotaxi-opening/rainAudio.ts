'use client';
export type RainAudioState={enabled:boolean;loading:boolean;failed:boolean};
let snapshot:RainAudioState={enabled:false,loading:false,failed:false};
const listeners=new Set<()=>void>();
let player:HTMLAudioElement|null=null,fade=0,version=0,owners=0,releaseTimer:ReturnType<typeof setTimeout>|undefined;
let transfer=false;
const preference='cassy-rain-muted';
function publish(value:Partial<RainAudioState>){snapshot={...snapshot,...value};listeners.forEach(fn=>fn());}
export const rainAudioSnapshot=()=>snapshot;
const serverState:RainAudioState={enabled:false,loading:false,failed:false};
export const rainAudioServerSnapshot=()=>serverState;
export function subscribeRainAudio(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn);};}
function muted(){try{return localStorage.getItem(preference)==='1';}catch{return false;}}
function remember(mute:boolean){try{localStorage.setItem(preference,mute?'1':'0');}catch{}}
function ensure(){
  if(player)return player;
  player=new Audio('/robotaxi-opening/rain-recording-loop.wav');player.loop=true;player.preload='auto';player.volume=0;
  player.addEventListener('error',()=>{stopRain();publish({failed:true});});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRain();});
  window.addEventListener('pagehide',stopRain);
  return player;
}
function ramp(target:number,duration:number,stop=false){
  cancelAnimationFrame(fade);if(!player)return;
  const source=player.volume,start=performance.now(),p=player;
  const tick=(now:number)=>{const t=Math.min(1,(now-start)/duration);p.volume=source+(target-source)*t*t*(3-2*t);if(t<1)fade=requestAnimationFrame(tick);else if(stop&&!snapshot.enabled)p.pause();};
  fade=requestAnimationFrame(tick);
}
export function stopRain(){version++;cancelAnimationFrame(fade);if(player){player.volume=0;player.pause();}publish({enabled:false,loading:false});}
export async function enableRain(explicit=true){
  if(!explicit&&muted())return;
  if(snapshot.loading||snapshot.enabled)return;
  if(explicit)remember(false);
  const p=ensure(),request=++version;
  cancelAnimationFrame(fade);publish({loading:true,failed:false});
  const timeout=setTimeout(()=>{if(request===version){stopRain();publish({failed:true});}},12000);
  try{
    // Called before the first await: retains the Gallery click's user activation.
    await p.play();
    if(request!==version){if(!snapshot.enabled&&!snapshot.loading)p.pause();return;}
    if(document.hidden){stopRain();return;}
    publish({enabled:!p.paused,loading:false});ramp(.15,650);
  }catch{if(request===version){p.pause();publish({enabled:false,loading:false,failed:true});}}
  finally{clearTimeout(timeout);}
}
export function toggleRain(){
  if(snapshot.enabled||snapshot.loading){remember(true);version++;publish({enabled:false,loading:false});ramp(0,220,true);}
  else void enableRain(true);
}
export function preloadRain(){if(!muted())ensure().load();}
export function beginRainTransfer(){transfer=true;void enableRain(false);}
export function attachRainScene(){
  owners++;transfer=false;if(releaseTimer)clearTimeout(releaseTimer);
  let released=false;
  return()=>{if(released)return;released=true;owners=Math.max(0,owners-1);releaseTimer=setTimeout(()=>{if(!owners&&!transfer)stopRain();},40);};
}
export function abortRainTransfer(){transfer=false;if(!owners)stopRain();}

// A short lease spans Opening unmount while its optical bridge stays visible.
let caseVolume=0;
export function beginCaseAudioFade(){transfer=true;version++;cancelAnimationFrame(fade);caseVolume=player?.volume??0;publish({loading:false});}
export function setCaseAudioFade(progress:number){if(!player)return;const t=Math.max(0,Math.min(1,progress));player.volume=caseVolume*(1-t);}
export function finishCaseAudioFade(){transfer=false;stopRain();}
