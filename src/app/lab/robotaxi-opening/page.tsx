import type { Metadata,Viewport } from 'next';
import Opening from './Opening';
import WetGlassDebug from './WetGlassDebug';
export const viewport:Viewport={themeColor:'#050505'};
export const metadata: Metadata = { title: 'Rain Window — Robotaxi Opening', robots: { index: false, follow: false } };
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const params=await searchParams;
  if(params.mode==='clear-trail'||params.mode==='mask')return <Opening flowOnly initialMask={params.mode==='mask'}/>;
  if(params.mode==='impact'||params.mode==='flow')return <WetGlassDebug wet mode={params.mode}/>;
  if(params.mode==='condensation')return <Opening condensationOnly/>;
  return params['wet-glass'] ? <WetGlassDebug wet={params['wet-glass']!=='legacy'} enhanced={params['wet-glass']!=='before'}/> : <Opening />;
}
