'use strict';

const cupSetups={

  supercar:{power:8.1,top:46},
  gt:{power:8.3,top:44},
  'muscle-car':{power:7.6,top:45},
  rally:{power:8.5,top:40}
};

for(const c of globalThis.DuongVietFleet||[])if(!worldGarage[c.id].worldOnly)cupSetups[c.id]=worldGarage[c.id];

function inSlipstream(car,leader){
  const gap=leader.d-car.d;
  return car!==leader&&!leader.finished&&car.v>12&&leader.v>12&&gap>4&&gap<26&&
    Math.abs(car.offset-leader.offset)<1.5;
}

function nitroCharge(charge,using,held,drafting,dt){
  return clamp(charge+(using?-27:held?0:drafting?18:7)*dt,0,100);
}

// Sample braking distances in metres. A driver can still accelerate now if
// there is enough road to brake for a slower corner further ahead.
function readCupBends(r){
  let speed=Infinity,apex=0;
  for(let ahead=0;ahead<=96;ahead+=12){
    const station=r.d+ahead;
    const curvature=(heading(station+10)-heading(station-2))/12;
    speed=Math.min(speed,Math.sqrt(r.cornerGrip/Math.max(.001,Math.abs(curvature))+
      2*13*Math.max(0,ahead-7)));
    if(ahead===12)apex=clamp(curvature*95,-1,1);
  }
  return {speed,apex};
}

function nearbyCupTraffic(r,racers,traffic){
  const nearby=[];
  function observe(car,lane){
    const gap=car.d-r.d;
    if(car===r||car.d<0||car.d>route.finish||gap < -30||gap>125)return;
    const closing=r.v-car.v;
    const horizon=clamp(gap/(closing||.01),0,2.8);
    const futureLane=car.targetLane===undefined?lane:
      lane+clamp(car.targetLane-lane,-2.8*horizon,2.8*horizon);
    nearby.push({gap,closing,lane,futureLane,speed:car.v,width:car.bike?1.55:2.15});
  }
  for(const car of racers)observe(car,car.offset);
  for(const car of traffic)observe(car,car.lane);
  return nearby;
}

function laneCost(r,lane,preferred,nearby){
  let cost=.8*Math.abs(lane-preferred)+.18*Math.abs(lane-r.offset)+.25*Math.abs(lane-r.targetLane);
  for(const car of nearby){
    const {gap,closing,width}=car;
    // A lane change sweeps through the intervening lanes. Give cars already
    // alongside, including a faster car coming from behind, room to finish.
    const pathMin=Math.min(lane,r.offset),pathMax=Math.max(lane,r.offset);
    const crosses=car.lane>=pathMin-width&&car.lane<=pathMax+width;
    const nearSide=Math.abs(gap)<5.2||gap<0&&closing<0&&gap/closing<1.25;
    if(crosses&&nearSide&&Math.abs(lane-car.lane)<Math.abs(r.offset-car.lane))cost+=65;
    if(gap < -4)continue;
    const separation=Math.min(Math.abs(lane-car.lane),Math.abs(lane-car.futureLane));
    const clearance=clamp((width+.5-separation)/.85,0,1);
    const oncoming=car.speed<0;
    const range=9+Math.max(0,closing)*(oncoming?3:2.15)+r.v*.32;
    cost+=clearance*clamp(1-Math.max(0,gap-4)/range,0,1)*(oncoming?100:30);
    if(closing>1&&gap>3){
      // Check the passing manoeuvre at the catch point, before giving
      // credit for a lane that this car cannot yet physically reach.
      const meet=(gap-3)/closing;
      if(meet<2.8){
        const reach=4.2*Math.max(0,meet-.22);
        const predicted=r.offset+clamp(lane-r.offset,-reach,reach);
        const margin=Math.abs(predicted-car.lane);
        cost+=Math.max(0,width+.4-margin)*(oncoming?26:11);
      }
    }
  }
  return cost;
}

function planCupDriver(r,racers,traffic){
  const bends=readCupBends(r),edge=roadHalfWidth-1.15;
  let preferred=clamp(r.lane*.50+bends.apex*edge*.72,-edge,edge);
  const lead=racers.find(car=>inSlipstream(r,car));
  if(lead&&lead.d-r.d>16&&lead.v>=r.v-1.5)preferred=lead.offset;
  const itemLane=cupRewardLine(r);
  if(itemLane!==null)preferred=itemLane;
  const nearby=nearbyCupTraffic(r,racers,traffic);
  let best=Infinity,bestLane=r.targetLane;
  for(const lane of [r.targetLane,preferred,-edge,-edge*.5,0,edge*.5,edge]){
    if(lane < -edge && itemLane!==lane)continue;
    const cost=laneCost(r,lane,preferred,nearby);
    if(cost<best){best=cost;bestLane=lane;}
  }
  r.targetLane=bestLane;
  let clearSpeed=bends.speed;
  for(const car of nearby){
    if(car.gap<0||Math.abs(car.lane-r.offset)>car.width)continue;
    const space=Math.max(0,car.gap-5);
    // A driver who has picked a clear exit can creep around a stopped
    // bumper. Requiring forward clearance first would deadlock both cars.
    const pullingOut=Math.abs(r.targetLane-car.lane)>car.width+.2;
    const follow=Math.max(pullingOut?2:0,car.speed)+space/1.05;
    clearSpeed=Math.min(clearSpeed,follow);
  }
  const setup=cupSetups[r.model];
  const contest=racers.some(car=>car!==r&&!car.finished&&car.d-r.d>-15&&car.d-r.d<48);
  const reserve=contest||route.finish-r.d<190?20:52;
  const boostRoom=clearSpeed>Math.max(r.v+2,setup.top*.9);
  r.useNitro=boostRoom&&r.v>13&&(r.useNitro?r.charge>4:r.charge>reserve);
  r.targetSpeed=Math.min(clearSpeed,(setup.top+(r.useNitro?9:0))*r.pace);
}

// The player has oriented chassis contacts in race.js. For the cars moving
// in track coordinates, clip a closing move on the first touching axis.
function keepCupClearance(r,previousD,previousLane,other,lane){
  if(other===r||other.d<0||other.d>route.finish||Math.abs(other.d-r.d)>4.2||
     Math.abs((other.lift||0)-(r.lift||0))>1.35)return;
  const width=other.bike?1.42:1.94;
  if(Math.abs(r.offset-lane)>=width)return;
  const oldGap=other.d-previousD,sideGap=previousLane-lane;
  if(Math.abs(sideGap)>=width-.06||Math.abs(oldGap)<3.8){
    const side=Math.sign(sideGap)||Math.sign(r.lane-lane)||1;
    r.offset=lane+side*width;
    if(r.lateralV*side<0)r.lateralV=0;
  }else if(oldGap>0){
    r.d=other.d-4.2;
    const pullingOut=Math.abs(r.targetLane-lane)>width+.2;
    r.v=Math.min(r.v,Math.max(pullingOut?2:0,other.v));
    if(other.cruise<0){other.v=0;other.yieldTime=.65;}
  }
}

function advanceCupDriver(r,racers,traffic,dt){
  if(r.finished){
    r.v=Math.max(0,r.v-16*dt);
    r.d=Math.min(route.finish+65,r.d+r.v*dt);
    return;
  }
  r.thinkIn-=dt;
  if(r.thinkIn<=0){
    planCupDriver(r,racers,traffic);
    r.thinkIn+=.14;
  }
  const draft=racers.some(car=>inSlipstream(r,car));
  const braking=!!r.recoil?.braking||r.v>r.targetSpeed+1.2;
  const nitro=r.useNitro&&r.charge>1&&!braking&&!r.airborne;
  const setup=cupSetups[r.model],h=heading(r.d),previousD=r.d,previousLane=r.offset;
  if(!r.airborne){
    r.v=DriveBody.forwardSpeed(r,{gas:r.v<r.targetSpeed&&!braking,brake:braking,
      boost:nitro,grade:roadGrade(r.d,h),power:setup.power+(draft?1.6:0),top:setup.top},dt,r.v);
    r.v=Math.max(0,r.v);
    r.charge=nitroCharge(r.charge,nitro,false,draft,dt);
    const lateralLimit=Math.min(4.2,r.v*(r.v<4?.6:.23));
    const desired=clamp((r.targetLane-r.offset)*1.8,-lateralLimit,lateralLimit);
    r.lateralV+=clamp(desired-r.lateralV,-7*dt,7*dt);
  }
  // An inside line is shorter than an outside line. Lateral speed comes
  // from the car's available road speed, including when it changes lanes.
  const curvature=(heading(r.d+2)-heading(r.d-2))*.25;
  r.offset+=r.lateralV*dt;
  const forward=Math.sqrt(Math.max(0,r.v*r.v-r.lateralV*r.lateralV));
  r.d+=forward*dt/clamp(1-curvature*r.offset,.65,1.35);
  for(const car of racers)if(car!==state)keepCupClearance(r,previousD,previousLane,car,car.offset);
  for(const car of traffic)keepCupClearance(r,previousD,previousLane,car,car.lane);
  r.offset=clamp(r.offset,-roadHalfWidth-cupSpurWidth(r.d)+.85,roadHalfWidth-.85);
  r.yawOffset=Math.atan2(r.lateralV,Math.max(1,forward));
  updateCupFeatures(r,previousD,previousLane,dt);
  if(r.d>=route.finish){
    r.finished=true;
    r.finishTime=state.time-dt+dt*(route.finish-previousD)/(r.d-previousD);
  }
}
