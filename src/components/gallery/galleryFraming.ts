import { galleryFixtures } from './galleryFixtures';
import { galleryMotion, orbitPose } from './galleryMotion';
import { galleryInteraction } from './galleryInteraction';

export const galleryFraming = { perspective: 1350, margin: 22, originY: .48, maxScale: 1 } as const;

/** Corner envelope for the unchanged orbit, both faces, all flip angles and
 * the maximum existing focus lift. Sample error is covered by the 22px guard.
 * This only frames the 3D scene; typography, controls and page size stay intact.
 */
const envelope = galleryFixtures.flatMap(project => {
  const points: {x:number;y:number;z:number}[] = [];
  const roll=project.roll*Math.PI/180;
  for(let angle=0;angle<360;angle+=5){
    const pos=orbitPose(project,angle/360*galleryMotion.orbit.period);
    for(let yaw=0;yaw<360;yaw+=15){
      const c=Math.cos(yaw*Math.PI/180),n=Math.sin(yaw*Math.PI/180);
      for(const lift of [0,1])for(const x of [-112,112])for(const y of [-148,148]){
        const scale=1+(galleryInteraction.hoverScale-1)*lift;
        points.push({x:pos.x+(x*c*Math.cos(roll)-y*Math.sin(roll))*scale,
          y:pos.y+(x*c*Math.sin(roll)+y*Math.cos(roll))*scale,
          z:pos.z-x*n*scale+galleryInteraction.hoverDepth*lift+.2});
      }
    }
  }
  return points;
});

export function fitGalleryScale(width:number,height:number){
  if(width<=0||height<=0)return .1;
  const {perspective:p,margin,originY,maxScale}=galleryFraming;
  const horizontal=Math.max(1,width/2-margin),top=Math.max(1,height*originY-margin),bottom=Math.max(1,height*(1-originY)-margin);
  let scale:number=maxScale;
  // Solve each perspective-projected corner against the actual viewport.
  // s*coordinate*p/(p-s*z) <= available -> s <= available*p/(coordinate*p+available*z).
  for(const point of envelope){
    for(const [extent,available] of [[Math.abs(point.x),horizontal],[Math.abs(point.y),point.y<0?top:bottom]]){
      const denominator=extent*p+available*point.z;
      if(denominator>0)scale=Math.min(scale,available*p/denominator);
    }
  }
  return Math.max(.01,scale*.99);
}
