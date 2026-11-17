/** The SVG scene and the actual Hero aperture share this one shot clock. */
export const opticalTuning = {
  duration: 6000,
  heroWakeAt: 4100,
  revealAt: 4350,
  revealFade: 280,
  detachAt: 500,
  detachDuration: 800,
  profileAt: 1150,
  profileDuration: 1100,
  adjustAt: 2180,
  adjustDuration: 900,
  frontAt: 3050,
  frontDuration: 650,
  firstOpenAt: 3450,
  closeAt: 3860,
  finalOpenAt: 4240,
  dollyAt: 4500,
  dollyDuration: 1450,
  lineWidth: .9,
  bladeLineWidth: .65,
  sideTickCount: 100,
  frontTickCount: 150,
} as const;
export const opticalDuration=opticalTuning.duration;
export const opticalHeroWakeAt=opticalTuning.heroWakeAt*(opticalDuration/6000);
export const opticalSessionKey='cassy-optical-intro-v4-wire';
export const IRIS_Z=.815, IRIS_PIVOT=1.14, IRIS_EDGE=-.29;
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
const out=(v:number)=>1-Math.pow(1-clamp(v),3);
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;

export function opticalFrame(time:number){
  const t=opticalTuning;
  // A single duration edit scales the whole six-second score, including Hero wake.
  const elapsed=time/(t.duration/6000);
  const profile=smooth((elapsed-t.profileAt)/t.profileDuration);
  const closeUp=smooth((elapsed-2150)/500);
  const adjust=out((elapsed-t.adjustAt)/t.adjustDuration);
  const front=smooth((elapsed-t.frontAt)/t.frontDuration);
  const firstOpen=smooth((elapsed-t.firstOpenAt)/390);
  const contract=smooth((elapsed-t.closeAt)/340);
  const finalOpen=smooth((elapsed-t.finalOpenAt)/620);
  const pupil=mix(mix(mix(1.568/(8/Math.pow(2,adjust)),.65,firstOpen),.18,contract),.784,finalOpen);
  const fNumber=1.568/pupil;
  return {
    elapsed:time,
    detach:.58*out((elapsed-t.detachAt)/t.detachDuration),
    unlock:.17*smooth((elapsed-350)/190)*(1-smooth((elapsed-1020)/340)),
    bodyOpacity:1-smooth((elapsed-1220)/500),
    bodyRetreat:out((elapsed-1200)/600),
    x:mix(mix(-.45,-1.82,profile)+.48*closeUp,0,front),
    y:mix(mix(-.08,.04,profile),0,front),
    rx:mix(mix(-.12,.17,profile),0,front),
    ry:mix(mix(-.48,-1.08,profile)+.16*closeUp,0,front),
    rz:mix(mix(.04,-.09,profile),0,front),
    scale:mix(mix(.98,1.4,profile)+.12*closeUp,1,front),
    cameraZ:mix(mix(5.05,4.8,profile)-.15*closeUp,6.6,front),
    fNumber,pupil,ringAngle:.28*(2*Math.log2(fNumber/2)),
    bladeAngle:Math.acos((pupil-IRIS_EDGE)/IRIS_PIVOT),
    push:smooth((elapsed-t.dollyAt)/t.dollyDuration),
    reveal:smooth((elapsed-t.revealAt)/t.revealFade),
    caption:smooth(elapsed/700)*(1-smooth((elapsed-3920)/330)),
    structural:1-smooth((elapsed-3750)/700),
    ink:smooth(elapsed/500)*(1-smooth((elapsed-5800)/200)),
    phase:elapsed<1350?'detach':elapsed<2200?'profile':elapsed<3100?'adjust':elapsed<6000?'aperture':'complete',
  };
}
export type OpticalFrame=ReturnType<typeof opticalFrame>;
export type Point={x:number;y:number};
export function clipHalfPlane(points:Point[],normal:Point,offset:number,keepLess=true):Point[]{
  const result:Point[]=[];
  const value=(p:Point)=>(p.x*normal.x+p.y*normal.y-offset)*(keepLess?1:-1);
  for(let i=0;i<points.length;i++){
    const a=points[i],b=points[(i+1)%points.length],va=value(a),vb=value(b);
    if(va<=0)result.push(a);
    if((va<0&&vb>0)||(va>0&&vb<0)){
      const t=va/(va-vb);result.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
    }
  }
  return result;
}
