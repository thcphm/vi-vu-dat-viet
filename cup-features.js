'use strict';

const cupRamp=route.id==='river'?
  {entry:1970,start:2016,lip:2028,exit:2160,offset:-7.6,halfWidth:1.85,rise:1.65}:null;
const cupBreads=cupRamp?[
  {d:245,offset:-3.9},{d:955,offset:3.9},{d:1515,offset:-3.9}
]:[];

function cupSpurWidth(d){
  if(!cupRamp||d<=cupRamp.entry||d>=cupRamp.exit)return 0;
  return 4.3*smooth(cupRamp.entry,cupRamp.start-8,d)*(1-smooth(cupRamp.exit-58,cupRamp.exit,d));
}

function cupRampHeight(d,offset){
  if(!cupRamp||d<cupRamp.start||d>cupRamp.lip+3)return 0;
  const r=cupRamp;
  const side=clamp((r.halfWidth-Math.abs(offset-r.offset))/.35,0,1);
  return r.rise*side*Math.min((d-r.start)/(r.lip-r.start),(r.lip+3-d)/3);
}

function cupRewardLine(car){
  if(!cupRamp)return null;
  for(const bread of cupBreads){
    const gap=bread.d-car.d;
    if(gap>=0&&gap<58&&car.charge<80&&!car.collected.has(bread))return bread.offset;
  }
  if(car.d>=cupRamp.entry-75&&car.d<cupRamp.exit-28&&(car.takesRamp||car.offset < -roadHalfWidth)){
    return Math.max(cupRamp.offset,-roadHalfWidth-cupSpurWidth(car.d+12)+1.15);
  }
  return null;
}

function updateCupFeatures(car,previousD,previousLane,dt){
  if(!cupRamp)return;
  const player=car===state;
  for(const bread of cupBreads){
    if(previousD>=bread.d||car.d<bread.d||car.collected.has(bread))continue;
    const lane=previousLane+(car.offset-previousLane)*(bread.d-previousD)/(car.d-previousD);
    if(Math.abs(lane-bread.offset)>1.6)continue;
    car.collected.add(bread);
    const gain=Math.min(30,100-car.charge);
    car.charge+=gain;
    if(player){
      bread.mesh.visible=false;driveAudio.cue(true);
      tellRace(gain>=1?'Nhặt bánh mì · +'+Math.round(gain)+' nitro':'Nhặt bánh mì · bình nitro đầy');
    }
  }
  const r=cupRamp,deck=cupRampHeight(car.d,car.offset);
  if(!car.airborne){
    car.lift=deck;
    car.jumpPitch=deck ? Math.atan((cupRampHeight(car.d+.08,car.offset)-cupRampHeight(car.d-.08,car.offset))/.16) : 0;
    if(previousD>=r.lip||car.d<r.lip||car.v<15)return;
    const fraction=(r.lip-previousD)/(car.d-previousD);
    const lipLane=previousLane+(car.offset-previousLane)*fraction;
    const lipHeight=cupRampHeight(r.lip,lipLane);
    if(lipHeight<r.rise*.8)return;
    car.lift=lipHeight;
    car.verticalV=(car.d-previousD)/dt*lipHeight/(r.lip-r.start);
    car.airborne=true;
    dt*=1-fraction;
  }
  car.lift+=car.verticalV*dt-4.905*dt*dt;
  car.verticalV-=9.81*dt;
  car.jumpPitch=Math.atan2(car.verticalV,Math.max(1,car.v));
  if(car.lift>deck||car.verticalV>0)return;
  car.airborne=false;car.lift=deck;car.jumpPitch=0;
  const yawError=player?car.h-heading(car.d):car.yawOffset;
  if(!car.landingBonus&&Math.cos(yawError)>.985&&Math.abs(car.offset-r.offset)<2){
    car.landingBonus=true;
    car.charge=Math.min(100,car.charge+25);
    if(player)tellRace('Tiếp đất thẳng · thưởng nitro!');
  }
}

if(cupRamp)buildCupCourseArt(cupBreads,cupRamp);
