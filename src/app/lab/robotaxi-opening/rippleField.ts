/** Shared propagation field: optics and reveal always follow the same front. */
export const rippleDuration=2200;
export function smoothRipple(value:number){const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);}
export function rippleGeometry(width:number,height:number,origin:{x:number;y:number},progress:number){
  const reach=Math.max(...[[0,0],[width,0],[0,height],[width,height]].map(([x,y])=>Math.hypot(x-origin.x,y-origin.y)));
  const band=Math.max(48,Math.min(width,height)*(.09+.065*progress));
  // Monotonic propagation with a gentle deceleration, no elastic return.
  const travel=1-Math.pow(1-Math.max(0,Math.min(1,progress)),1.35);
  return {radius:(reach+band*2)*travel,band};
}
export function rippleSample(dx:number,dy:number,radius:number,band:number,progress:number){
  const distance=Math.hypot(dx,dy),angle=Math.atan2(dy,dx);
  const front=radius*(1+.012*Math.sin(angle*3+1)+.005*Math.sin(angle*5-.4));
  const offset=(distance-front)/band;
  // One broad bipolar crest. No high-frequency train of sine waves.
  const wave=offset*Math.exp(-offset*offset*.8)*(1-.7*progress);
  const retained=1-(1-smoothRipple((offset+1.05)/2.1))*smoothRipple(progress/.12);
  return {distance,wave,retained};
}
