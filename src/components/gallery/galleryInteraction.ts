import { galleryFixtures } from './galleryFixtures';
import { BASE_ORBIT_DURATION, EDGE_SPEED_MULTIPLIER, galleryMotion, orbitPose } from './galleryMotion';

export const galleryInteraction = {
  edgeWidth: .35, // 30% central magnet zone; 35% controls on each side.
  boundaryBuffer: .006,
  baseOrbitSpeed: 360 / BASE_ORBIT_DURATION, // Final 45 degrees/second.
  edgeSpeedMultiplier: EDGE_SPEED_MULTIPLIER, // Final 135 degrees/second.
  speedResponse: 16,
  turnsPerViewport: .70, // Touch fallback only.
  followResponse: 10,
  // The pointer only needs to approach a card, not precisely hit its face.
  hoverDwellMs: 110,
  intentDistance: 5,
  magneticReachPx: 86,
  magneticRetainPx: 122,
  magneticStickyBonus: 22,
  hoverResponse: 9,
  hoverScale: 1.09,
  hoverDepth: 24,
  touchThreshold: 7,
  snapDuration: .42,
  candidateMaxDegrees: 68,
  centerEnterDegrees: 42,
  centerExitDegrees: 50,
  centerProjectedX: 300,
  centerRetainProjectedX: 350,
} as const;
export type ExplorationMode = 'IDLE' | 'EDGE_LEFT' | 'EDGE_RIGHT' | 'SETTLING' | 'CARD_HOVER' | 'FOCUS';
export const damp = (value: number, target: number, response: number, dt: number) => target + (value-target)*Math.exp(-response*dt);
export type GalleryRegion = 'EDGE_LEFT' | 'CENTER_SELECT' | 'EDGE_RIGHT';
export function galleryRegion(position:number,previous:GalleryRegion='CENTER_SELECT'):GalleryRegion {
  const edge=galleryInteraction.edgeWidth,buffer=galleryInteraction.boundaryBuffer;
  if(previous==='EDGE_LEFT'&&position<edge+buffer)return 'EDGE_LEFT';
  if(previous==='EDGE_RIGHT'&&position>1-edge-buffer)return 'EDGE_RIGHT';
  if(position<edge-buffer)return 'EDGE_LEFT';
  if(position>1-edge+buffer)return 'EDGE_RIGHT';
  return 'CENTER_SELECT';
}
/** One conversion between public degrees/second and the existing orbit clock. */
export const orbitClockSpeed = (degrees:number) => degrees*galleryMotion.orbit.period/360;
export function edgeVelocity(_position:number,region:GalleryRegion=galleryRegion(_position)) {
  const c=galleryInteraction;
  return orbitClockSpeed(c.baseOrbitSpeed)*(region==='EDGE_LEFT'?-c.edgeSpeedMultiplier:region==='EDGE_RIGHT'?c.edgeSpeedMultiplier:1);
}
export type PointerZone = 'outside' | 'center' | 'left' | 'right';
export const BASE_ORBIT_SPEED = 2*Math.PI/BASE_ORBIT_DURATION;
/** Sole final navigation policy, in rad/s. Pending hover is NOT a pause. */
export function getTargetOrbitSpeed(zone:PointerZone,isFocused:boolean,isManuallyPaused:boolean){
  if(isFocused||isManuallyPaused)return 0;
  return BASE_ORBIT_SPEED*(zone==='left'?-EDGE_SPEED_MULTIPLIER:zone==='right'?EDGE_SPEED_MULTIPLIER:1);
}
export function centeredOrbit(index:number,current:number) {
  const p=galleryFixtures[index],o=galleryMotion.orbit;
  const phase=Math.atan2(p.x/o.radiusX,(p.z-o.centerZ)/o.radiusZ);
  const base=-phase*o.period/(2*Math.PI);
  return base+Math.round((current-base)/o.period)*o.period;
}
/** Critically damped spring profile, normalized to finish exactly; no overshoot. */
export function snapEase(progress:number){
  const t=Math.max(0,Math.min(1,progress));
  return (1-(1+7*t)*Math.exp(-7*t))/(1-8*Math.exp(-7));
}
export type EdgeState={orbit:number;velocity:number;settleTarget:number|null};
/** Exact integration of one exponentially-smoothed target speed. No hidden
 * clamp, recycling, positional snap or secondary transform writer. */
export function advanceEdge(s:EdgeState, drive:number, dt:number, blocked:boolean){
  s.settleTarget=null;
  if(blocked){s.velocity=0;return;}
  const response=galleryInteraction.speedResponse,old=s.velocity,decay=Math.exp(-response*dt);
  s.velocity=damp(old,drive,response,dt);
  s.orbit+=drive*dt+(old-drive)*(1-decay)/response;
}

export type CardProjection = { index:number; left:number; right:number; facing:number };
/** One foreground candidate from actual projected bounds, with score hysteresis. */
export function centerCardIndex(orbit:number, previous=-1, projections?:CardProjection[], viewportWidth=1200) {
  const o=galleryMotion.orbit,c=galleryInteraction;
  const poses=galleryFixtures.map((p,index)=>{
    const pos=orbitPose(p,orbit),projection=projections?.find(v=>v.index===index);
    const angle=Math.abs(Math.atan2(pos.x/o.radiusX,(pos.z-o.centerZ)/o.radiusZ))*180/Math.PI;
    const x=pos.x*1350/(1350-pos.z);
    const left=projection?.left ?? viewportWidth/2+x-112;
    const right=projection?.right ?? viewportWidth/2+x+112;
    const overlap=Math.min(right,viewportWidth*(1-c.edgeWidth))-Math.max(left,viewportWidth*c.edgeWidth);
    const facing=projection?.facing ?? 1;
    const score=Math.abs((left+right)/2-viewportWidth/2)/viewportWidth-(pos.z-o.centerZ)/o.radiusZ*.12;
    return {index,angle,score,eligible:pos.z>o.centerZ+o.radiusZ*.25 && overlap>24 && right-left>40 && facing>.18};
  });
  const candidates=poses.filter(p=>p.eligible&&p.angle<=c.centerEnterDegrees).sort((a,b)=>a.score-b.score);
  const old=poses[previous],best=candidates[0];
  if(old?.eligible&&old.angle<=c.centerExitDegrees&&(!best||old.score<=best.score+.08))return previous;
  return best?.index??-1;
}

export function hoverCandidateAllowed(orbit:number,index:number,projection:CardProjection,viewportWidth:number){
  const p=galleryFixtures[index];if(!p)return false;
  const o=galleryMotion.orbit,pos=orbitPose(p,orbit);
  const degrees=Math.abs(Math.atan2(pos.x/o.radiusX,(pos.z-o.centerZ)/o.radiusZ))*180/Math.PI;
  // A magnetically expanded card may cross the narrow pointer-selection zone.
  const reach=galleryInteraction.magneticReachPx;
  const overlap=Math.min(projection.right+reach,viewportWidth*(1-galleryInteraction.edgeWidth))-Math.max(projection.left-reach,viewportWidth*galleryInteraction.edgeWidth);
  // Both sides of these double-faced cards are interactive; reject only
  // nearly edge-on panels and panels on the rear half of the orbit.
  return degrees<=galleryInteraction.candidateMaxDegrees && pos.z>o.centerZ+o.radiusZ*.10 && Math.abs(projection.facing)>.14 && projection.right-projection.left>22 && overlap>0;
}
