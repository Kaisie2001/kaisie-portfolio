/** Visibility only: the fog blur and erasure materials never animate from sharp. */
const ease=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
export function introTimeline(elapsed:number,instant=false,debug=false){
  const immediate=instant||debug;
  const light=immediate?1:ease((elapsed-1250)/2300);
  const rain=immediate?1:ease((elapsed-80)/500);
  const mist=immediate?1:ease((elapsed-550)/700);
  const time=instant?7600:debug?elapsed:Math.max(0,elapsed-3550);
  const phase=immediate?'ready':elapsed<550?'black-rain':elapsed<1250?'condensation':elapsed<3550?'foggy-reveal':elapsed<3900?'foggy-hold':'wipe';
  return {light,rain,mist,time,phase};
}
