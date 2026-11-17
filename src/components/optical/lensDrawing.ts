import glyphData from './opticalGlyphs.json';
import { clipHalfPlane, IRIS_Z, opticalTuning, type OpticalFrame, type Point } from './opticalMotion';

type V3={x:number;y:number;z:number};
type Glyph={advance:number;ops:(string|number)[][]};
const glyphs=glyphData as Record<string,Glyph>,TAU=Math.PI*2;
const point=(x:number,y:number,z:number):V3=>({x,y,z});
const rotateZ=(p:V3,a:number):V3=>({x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a),z:p.z});
const ringPoint=(a:number,r:number,z:number)=>point(Math.sin(a)*r,Math.cos(a)*r,z);
const disk=Array.from({length:72},(_,i)=>({x:Math.cos(i/72*TAU)*.988,y:Math.sin(i/72*TAU)*.988}));
const pathFrom=(points:Point[],closed=false)=>points.length?`M${points.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join('L')}${closed?'Z':''}`:'';

/** Real perspective projection, without a GPU/model/material dependency. */
export function lensProjector(frame:OpticalFrame,width:number,height:number){
  const mobile=width<700,scale=frame.scale*(mobile?.78:1),fov=(mobile?51:44)*Math.PI/180;
  const focal=height/(2*Math.tan(fov*.5));
  const irisZ=(frame.detach+IRIS_Z)*scale;
  const endGap=frame.pupil*scale/(Math.tan(fov*.5)*Math.hypot(width/height,1))*.79;
  const gap=1/((1-frame.push)/(6.6-irisZ)+frame.push/endGap);
  const camera=frame.push>0?irisZ+gap:frame.cameraZ;
  const rotate=(p:V3)=>{
    const a={x:p.x,y:p.y*Math.cos(frame.rx)-p.z*Math.sin(frame.rx),z:p.y*Math.sin(frame.rx)+p.z*Math.cos(frame.rx)};
    const b={x:a.x*Math.cos(frame.ry)+a.z*Math.sin(frame.ry),y:a.y,z:-a.x*Math.sin(frame.ry)+a.z*Math.cos(frame.ry)};
    return rotateZ(b,frame.rz);
  };
  const world=(p:V3,part:'lens'|'body'='lens')=>{
    let q=p;
    if(part==='lens')q=rotateZ(q,frame.unlock);
    else q=point(q.x-frame.bodyRetreat*3.5,q.y,q.z-frame.bodyRetreat*.3);
    q=rotate(point(q.x*scale,q.y*scale,(q.z+(part==='lens'?frame.detach:0))*scale));
    return point(q.x+frame.x*(mobile?.46:1),q.y+frame.y,q.z);
  };
  const project=(p:V3,part:'lens'|'body'='lens'):Point=>{
    const q=world(p,part),depth=Math.max(.025,camera-q.z);
    return {x:width*.5+q.x*focal/depth,y:height*.5-q.y*focal/depth};
  };
  const facing=(a:number,r:number,z:number)=>{
    const p=world(ringPoint(a,r,z));
    const n=rotate(rotateZ(point(Math.sin(a),Math.cos(a),0),frame.unlock));
    return -p.x*n.x-p.y*n.y+(camera-p.z)*n.z>0;
  };
  return {project,facing};
}

/** Cache font contours once. Curves are sampled before wrapping onto the ring. */
const contours=new Map<string,Point[][]>();
function glyphContours(char:string){
  const existing=contours.get(char);if(existing)return existing;
  const result:Point[][]=[];let current:Point[]=[];let last={x:0,y:0};
  const add=(p:Point)=>{current.push(p);last=p;};
  for(const op of glyphs[char]?.ops??[]){
    const n=op.slice(1) as number[];
    if(op[0]==='M'){if(current.length)result.push(current);current=[];add({x:n[0],y:n[1]});}
    if(op[0]==='L')add({x:n[0],y:n[1]});
    if(op[0]==='Q'){
      const start=last;for(let i=1;i<=5;i++){const t=i/5,s=1-t;add({x:s*s*start.x+2*s*t*n[0]+t*t*n[2],y:s*s*start.y+2*s*t*n[1]+t*t*n[3]});}
    }
    if(op[0]==='C'){
      const start=last;for(let i=1;i<=6;i++){const t=i/6,s=1-t;add({x:s*s*s*start.x+3*s*s*t*n[0]+3*s*t*t*n[2]+t*t*t*n[4],y:s*s*s*start.y+3*s*s*t*n[1]+3*s*t*t*n[3]+t*t*t*n[5]});}
    }
    if(op[0]==='Z'&&current.length){result.push(current);current=[];}
  }
  if(current.length)result.push(current);contours.set(char,result);return result;
}
function lettering(text:string,size:number,map:(x:number,y:number)=>Point){
  const advance=[...text].reduce((sum,c)=>sum+(glyphs[c]?.advance??.4)*size,0);
  let cursor=-advance*.5,d='';
  for(const char of text){
    for(const contour of glyphContours(char))d+=pathFrom(contour.map(p=>map(cursor+p.x*size,p.y*size)),true);
    cursor+=(glyphs[char]?.advance??.4)*size;
  }
  return d;
}

export function drawLens(frame:OpticalFrame,width:number,height:number){
  const {project,facing}=lensProjector(frame,width,height);
  const line=(points:V3[],part:'lens'|'body'='lens')=>pathFrom(points.map(p=>project(p,part)));
  const circle=(r:number,z:number,part:'lens'|'body'='lens',start=0,end=TAU)=>line(Array.from({length:97},(_,i)=>ringPoint(start+(end-start)*i/96,r,z)),part);
  const bodyOutline=line([point(-2.65,-1.28,-1),point(1.2,-1.28,-1),point(1.35,-1.13,-1),point(1.35,1.13,-1),point(1.2,1.28,-1),point(-2.65,1.28,-1)],'body');
  let mount=circle(.97,-.82,'body')+circle(.87,-.79,'body');
  for(let i=0;i<3;i++)mount+=circle(1.04,-.77,'body',i*TAU/3+.1,i*TAU/3+.37);
  let barrel=circle(1.01,-.76)+circle(1.11,-.52)+circle(1.114,-.18)+circle(1.18,.26)+circle(1.21,.64);
  for(const a of [0,Math.PI*.5,Math.PI,Math.PI*1.5])barrel+=line([ringPoint(a,1.01,-.76),ringPoint(a,1.11,-.52),ringPoint(a,1.11,-.18),ringPoint(a,1.18,.26),ringPoint(a,1.21,.64)]);
  const face=circle(1.225,.798)+circle(.997,.801);
  let sideTicks='',faceTicks='',sideLabels='',faceLabels='';
  for(let i=0;i<opticalTuning.frontTickCount;i++){
    const a=i*.028,r=i%10===0?1.107:i%5===0?1.13:1.156;
    faceTicks+=line([rotateZ(ringPoint(a,r,.806),frame.ringAngle),rotateZ(ringPoint(a,1.196,.806),frame.ringAngle)]);
  }
  for(let i=0;i<opticalTuning.sideTickCount;i++){
    const a=1.15+i*.028,z=i%10===0?-.35:i%5===0?-.32:-.29;
    if(facing(a-frame.ringAngle,1.12,-.28))sideTicks+=line([rotateZ(ringPoint(a,1.12,-.24),frame.ringAngle),rotateZ(ringPoint(a,1.12,z),frame.ringAngle)]);
  }
  for(const [i,value] of ['2','2.8','4','5.6','8','11'].entries()){
    const a=i*.28;
    faceLabels+=lettering(value,.074,(x,y)=>project(rotateZ(ringPoint(a+x/1.055,1.055+y,.808),frame.ringAngle)));
    const b=1.15+a;
    if(facing(b-frame.ringAngle,1.12,-.45))sideLabels+=lettering(value,.086,(x,y)=>project(rotateZ(ringPoint(b+x/1.12,1.12,-.47+y),frame.ringAngle)));
  }
  const frontPointer=pathFrom([point(-.024,1.24,.814),point(.024,1.24,.814),point(0,1.20,.814)].map(p=>project(p)),true);
  const sidePointer=pathFrom([[-.026,-.16],[.026,-.16],[0,-.214]].map(([a,z])=>project(ringPoint(1.15+a,1.165,z))),true);
  const blades=Array.from({length:8},(_,i)=>{
    const a=i/8*TAU+frame.bladeAngle;
    const polygon=clipHalfPlane(disk,{x:Math.cos(a),y:Math.sin(a)},frame.pupil,false);
    return pathFrom(polygon.map(p=>project(point(p.x,p.y,IRIS_Z+i*.001))),true);
  });
  let pupil:Point[]=[{x:-32,y:-32},{x:width+32,y:-32},{x:width+32,y:height+32},{x:-32,y:height+32}];
  for(let i=0;i<8;i++){
    const a=i/8*TAU+frame.bladeAngle,n={x:Math.cos(a),y:Math.sin(a)},t={x:-n.y,y:n.x},z=IRIS_Z+i*.001;
    const p=project(point(n.x*frame.pupil+t.x*2,n.y*frame.pupil+t.y*2,z));
    const q=project(point(n.x*frame.pupil-t.x*2,n.y*frame.pupil-t.y*2,z));
    const center=project(point(0,0,z)),normal={x:q.y-p.y,y:p.x-q.x},offset=normal.x*p.x+normal.y*p.y;
    pupil=clipHalfPlane(pupil,normal,offset,normal.x*center.x+normal.y*center.y<=offset);
  }
  return {bodyOutline,mount,barrel,face,sideTicks,faceTicks,sideLabels,faceLabels,frontPointer,sidePointer,blades,pupil,pupilPath:pathFrom(pupil,true)};
}
export type LensDrawing=ReturnType<typeof drawLens>;
