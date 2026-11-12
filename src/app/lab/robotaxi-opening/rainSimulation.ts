export type WaterFlowCallback=(x:number,y:number,nx:number,ny:number,r:number)=>void;
export type FlowPoint = {x:number;y:number;width:number;time:number};
export type GlassDrop = { x:number;y:number;r:number;age:number;life:number;phase:number;speed:number;moving:boolean;vx:number;vy:number;pinUntil:number;switchAt:number;skew:number;roughness:number;nextShed:number;mergedAt:number;satellite?:boolean;path:FlowPoint[] };
export type RainStreak = {x:number;y:number;speed:number;length:number;alpha:number;drift:number};
/** Persistent bounded simulation. No relationship to the one-shot opening clock. */
export function createRainSimulation(width:number,height:number,low=false,wet=false,enhanced=false){
  let seed=98127,time=0,births=0,merges=0;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const cap=enhanced?(low?220:width<600?360:680):(low?85:width<600?125:205);
  const rate=enhanced?(low?16:width<600?34:62):(low?6:width<600?11:19);
  const interval=()=>-Math.log(Math.max(.00001,1-random()))/(rate*(enhanced?1+.22*Math.sin(time*.47)+.12*Math.sin(time*1.3):1));
  let nextImpact=interval();
  const drops:GlassDrop[]=[];
  const streaks:RainStreak[]=Array.from({length:enhanced?(low?45:width<600?70:115):(low?45:width<600?80:150)},()=>({x:random()*width,y:random()*height,speed:65+random()*115,length:7+random()*18,alpha:.09+random()*.12,drift:-.025-random()*.06}));
  function spawn(initial=false){
    // Independent broad rain patches, not a regular grid or uniform scan.
    const patch=random()<.6;
    const x=patch?width*(.5+.48*Math.sin(random()*Math.PI*2)):random()*width;
    const r=enhanced?.65+Math.pow(random(),3.6)*4.6:.65+Math.pow(random(),1.7)*2.55;
    if(drops.length>=cap){const oldest=drops.reduce((a,d,i)=>d.age>drops[a].age?i:a,0);drops.splice(oldest,1);}
    drops.push({x,y:random()*height,r,age:initial?1+random()*5:0,life:6+random()*7,phase:random()*7,speed:(enhanced?16:12)+random()*(enhanced?34:27),moving:false,vx:0,vy:0,pinUntil:0,switchAt:time+.6+random()*2.8,skew:(random()-.5)*.7,roughness:.06+random()*.12,nextShed:time+1+random()*4,mergedAt:-10,path:[]});
    if(!initial){
      births++;
      if(wet&&r>1.7&&random()<.65){
        const parent=drops[drops.length-1];
        for(let j=0,n=2+Math.floor(random()*3);j<n&&drops.length<cap;j++){
          const angle=random()*Math.PI*2;
          drops.push({...parent,x:parent.x+Math.cos(angle)*r*.65,y:parent.y+Math.sin(angle)*r*.65,r:.55+random()*.75,life:1.5+random()*2.2,satellite:true,path:[],phase:random()*7,vx:Math.cos(angle)*(30+random()*60),vy:Math.sin(angle)*(22+random()*45),moving:false});
        }
      }
    }
  }
  for(let i=0;i<cap*(enhanced?.66:.48);i++)spawn(true);
  function update(dt:number,trail?:(x:number,y:number,nx:number,ny:number,r:number)=>void){
    time+=dt;
    while(time>=nextImpact){spawn();nextImpact+=interval();}
    const shed:GlassDrop[]=[];
    const flowLimit=low?3:width<600?5:9;
    let flowCount=drops.filter(d=>d.moving).length;
    for(let i=drops.length-1;i>=0;i--){
      const d=drops[i];d.age+=dt;
      if(d.age>d.life||d.y>height+15){drops.splice(i,1);continue;}
      if(wet&&d.age<.22){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vx*=Math.exp(-dt*12);d.vy*=Math.exp(-dt*12);}
      if(d.satellite&&d.age>=.22&&!d.moving){d.vx=0;d.vy=0;}
      // Surface adhesion pins small drops; weight releases larger drops.
      if(!d.moving&&!d.satellite&&d.age>.9+d.phase*.2&&d.r>3.7&&flowCount<flowLimit){d.moving=true;flowCount++;}
      d.path=d.path.filter(point=>time-point.time<2.4);
      if(d.moving){
        const ox=d.x,oy=d.y;
        if(time>d.switchAt){
          if(random()<.3)d.pinUntil=time+.18+random()*1.1;
          d.switchAt=time+.6+random()*3.2;
          d.skew=Math.max(-.7,Math.min(.7,d.skew+(random()-.5)*.35));
        }
        const pinned=time<d.pinUntil;
        const slip=.2+.8*Math.pow(Math.max(0,Math.sin(time*(.27+d.phase*.09)+d.phase)),2);
        const weight=Math.pow(d.r/2.6,1.18);
        const target=pinned?0:Math.min(95,d.speed*weight*slip);
        const inertia=1-Math.exp(-dt*(pinned?10:2.2+d.r*.35));
        d.vy+=(target-d.vy)*inertia;
        const drift=Math.sin(d.y*.032+d.phase)*11+Math.sin(d.y*.079-d.phase)*3.5+d.skew*5;
        d.vx+=((pinned?0:drift)-d.vx)*(1-Math.exp(-dt*4));
        d.x+=d.vx*dt;d.y+=d.vy*dt;
        if(d.y>oy+.01){
          trail?.(ox,oy,d.x,d.y,d.r);
          const previous=d.path[d.path.length-1];
          if(!previous||Math.hypot(d.x-previous.x,d.y-previous.y)>.8){
            const width=Math.max(.5,d.r*.48*(.8+.2*Math.sin(d.y*.11+d.phase))*(1-.22*Math.min(1,d.vy/95)));
            d.path.push({x:d.x,y:d.y,width,time});
          }
          while(d.path.length>1&&Math.hypot(d.x-d.path[0].x,d.y-d.path[0].y)>72)d.path.shift();
        }
        if(wet&&d.r>4&&d.vy>12&&time>d.nextShed&&drops.length+shed.length<cap){
          d.nextShed=time+.8+random()*3;
          const side=random()<.5?-1:1;
          const radius=.6+random()*.6;
          shed.push({...d,x:d.x+side*d.r*.7,y:d.y-d.r*1.3,r:radius,age:.35,life:2+random()*3,moving:false,vx:side*2,vy:0,satellite:true,path:[]});
          d.r=Math.sqrt(Math.max(1,d.r*d.r-radius*radius));
        }
      }
    }
    drops.push(...shed);
    // Spatial buckets keep merging local as the visible population grows.
    const cell=16,buckets=new Map<string,GlassDrop[]>(),removed=new Set<GlassDrop>();
    for(const d of drops){const key=`${Math.floor(d.x/cell)},${Math.floor(d.y/cell)}`;const list=buckets.get(key)||[];list.push(d);buckets.set(key,list);}
    for(const a of drops){
      if(removed.has(a)||a.age<.28)continue;
      const cx=Math.floor(a.x/cell),cy=Math.floor(a.y/cell);
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const b of buckets.get(`${cx+dx},${cy+dy}`)||[]){
        if(a===b||removed.has(b)||removed.has(a)||b.age<.28)continue;
        if((a.moving||b.moving||a.r+b.r>5)&&Math.hypot(a.x-b.x,a.y-b.y)<(a.r+b.r)*.85){
          a.r=Math.min(enhanced?7:5.8,Math.sqrt(a.r*a.r+b.r*b.r));if(!a.moving&&flowCount<flowLimit&&a.r>3.7){a.moving=true;flowCount++;}a.mergedAt=time;a.pinUntil=0;a.skew=Math.max(-.8,Math.min(.8,a.skew+(b.x-a.x)*.035));a.speed=Math.min(enhanced?54:46,Math.max(a.speed,b.speed)+2);a.life=Math.max(a.life,a.age+5);removed.add(b);merges++;
        }
      }
    }
    for(let i=drops.length-1;i>=0;i--)if(removed.has(drops[i]))drops.splice(i,1);
    for(const s of streaks){s.y+=s.speed*dt;s.x+=s.speed*s.drift*dt;if(s.y>height+30){s.y=-30;s.x=random()*width;}if(s.x< -5)s.x=width+5;}
  }
  return {drops,streaks,update,stats:()=>({time,births,merges,count:drops.length,cap})};
}
