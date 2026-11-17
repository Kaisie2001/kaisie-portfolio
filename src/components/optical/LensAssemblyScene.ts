import { drawLens } from './lensDrawing';
import { opticalTuning, type OpticalFrame } from './opticalMotion';

const ns='http://www.w3.org/2000/svg';
/** A fixed set of SVG paths, updated in place for a bounded sequence. */
export function mountLensAssembly(host:HTMLElement){
  const svg=document.createElementNS(ns,'svg');
  svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.setAttribute('aria-hidden','true');
  svg.setAttribute('fill','none');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
  const group=()=>{const g=document.createElementNS(ns,'g');svg.append(g);return g;};
  const body=group(),structure=group(),leaf=group(),front=group();
  const add=(parent:SVGGElement,stroke:string,width:number=opticalTuning.lineWidth,fill='none')=>{
    const node=document.createElementNS(ns,'path');node.setAttribute('stroke',stroke);node.setAttribute('stroke-width',String(width));node.setAttribute('fill',fill);node.setAttribute('fill-rule','evenodd');node.setAttribute('vector-effect','non-scaling-stroke');parent.append(node);return node;
  };
  const nodes={
    bodyOutline:add(body,'#9da6ad'),mount:add(body,'#d3d8dc'),
    barrel:add(structure,'#67727b'),sideTicks:add(structure,'#c8cdd1',.72),
    sideLabels:add(structure,'none',0,'#dce0e3'),sidePointer:add(structure,'none',0,'#e1e5e8'),
    face:add(front,'#e4e5e3'),faceTicks:add(front,'#bec5cb',.75),
    faceLabels:add(front,'none',0,'#e2e3e1'),frontPointer:add(front,'none',0,'#edece7'),
  };
  const leaves=Array.from({length:8},()=>add(leaf,'#b8bfc4',opticalTuning.bladeLineWidth,'#050505'));
  host.append(svg);
  return {
    draw(frame:OpticalFrame,width:number,height:number){
      const drawing=drawLens(frame,width,height);
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      for(const key of Object.keys(nodes) as (keyof typeof nodes)[])nodes[key].setAttribute('d',drawing[key]);
      leaves.forEach((node,i)=>node.setAttribute('d',drawing.blades[i]));
      body.setAttribute('opacity',String(frame.bodyOpacity*frame.structural));
      structure.setAttribute('opacity',String(frame.structural));
      svg.style.opacity=String(frame.ink);
      return drawing.pupil;
    },
    dispose(){svg.remove();},
  };
}
