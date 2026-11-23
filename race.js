'use strict';
// Extend the tarmac behind the starting line for the chase camera.
const apron=new T.Mesh(new T.PlaneGeometry(roadHalfWidth*2,36),new T.MeshLambertMaterial({map:asphalt,color:0xb4b8b8}));
apron.rotation.x=-Math.PI/2;apron.position.set(0,height(0),18);scene.add(apron);
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;
const brush=shadowCanvas.getContext('2d'),shade=brush.createRadialGradient(32,32,10,32,32,32);
shade.addColorStop(0,'rgba(10,10,14,.72)');shade.addColorStop(1,'rgba(10,10,14,0)');brush.fillStyle=shade;brush.fillRect(0,0,64,64);
const shadowMaterial=new T.MeshBasicMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false});
function addShadow(parent){
 const mesh=new T.Mesh(new T.PlaneGeometry(3.1,5.6),shadowMaterial);mesh.rotation.x=-Math.PI/2;mesh.position.y=.075;parent.add(mesh);
 return mesh;
}
const playerShadow=addShadow(rig);
let chosenCar='supercar';
try{const saved=localStorage.getItem('taylai.garage');if(Object.hasOwn(cupSetups,saved))chosenCar=saved;}catch{}
const carMenu=document.getElementById('garage');fillEditionGarage(carMenu,false);
carMenu.value=chosenCar;
cabin.setVehicle(chosenCar,worldGarage[chosenCar],worldGarage[chosenCar].seatLift||0);
carMenu.onchange=()=>{try{localStorage.setItem('taylai.garage',carMenu.value);}catch{} location.reload();};
const coupeAssets=new Map();
const animatedCars=[];
const cupFx=createDrivingFX(T,scene,renderer);
async function fitCoupe(parent,paint,isPlayer,kind,driver){
 const name=worldGarage[kind].asset;
 if(!coupeAssets.has(name))coupeAssets.set(name,TrafficModels.load.loadAsync(name));
 const {scene:template}=await coupeAssets.get(name),model=template.clone(true);
 const finish=new Map();
 model.traverse(part=>{
   if(!part.isMesh)return;
   part.castShadow=true;part.receiveShadow=true;
   const src=part.material;
   if(!['paint','paint_body','light_rear'].includes(src.name))return;
   if(!finish.has(src)){
     const m=src.clone();
     if(src.name!=='light_rear'){m.color.set(paint);m.envMapIntensity=1.35;m.clearcoat=1;m.clearcoatRoughness=.11;}
     else{m.emissive.set(0xff1604);m.emissiveIntensity=.6;}
     finish.set(src,m);
   }
   part.material=finish.get(src);passSky?.registerFinish(part.material);
 });
 model.rotation.y=Math.PI;
 parent.add(model);
 if(isPlayer)cupFx.mountExhaust(model,chosenCar);
 animatedCars.push({model,isPlayer,driver,wheels:['FL','FR','RL','RR'].map(id=>model.getObjectByName('wheel_'+id)),front:['FL','FR'].map(id=>model.getObjectByName('steer_'+id)),rear:[...finish.values()].find(m=>m.name==='light_rear')});
}
fitCoupe(outer,worldGarage[chosenCar].paint,true,chosenCar,null).then(()=>outer.remove(fallback)).catch(()=>loadSedan().catch(()=>{}));
const cupBody={model:chosenCar,spec:worldGarage[chosenCar]};
const cupEnergy=DuongVietEnergy.meta(chosenCar,cupBody.spec),cupTank=DuongVietEnergy.tank(cupEnergy);
function drawCupEnergy(){const b=document.getElementById('cupEnergy');const label=cupEnergy.verb+' · '+DuongVietEnergy.pct(cupEnergy,cupTank.level)+'%';if(b.textContent!==label)b.textContent=label;}
drawCupEnergy();window.addEventListener('pagehide',()=>cupTank.flush());
document.getElementById('cupEnergy').onclick=()=>{
 if(!['drive','grid','paused'].includes(state.mode))return;
 const old=state.mode;if(old==='drive'){setMode('service');keys.clear();}
 cupTank.flush();DuongVietEnergy.panel(cupEnergy,{atGarage:true,onChanged:()=>{cupTank.reload();drawCupEnergy();},exit:()=>{cupTank.reload();if(old==='drive'){setMode('drive');keys.clear();}drawCupEnergy();}});
};
let crashTime=0,crashKind='';
const rivals = [
  {name:'Bảy Bánh Mì',lane:-3.4,grid:16,pace:.99,cornerGrip:12,model:'gt',takesRamp:true,color:0xcaa14c},
  {name:'Út Giao Hàng',lane:.3,grid:10,pace:1,cornerGrip:14,model:'rally',color:0xf1efdb},
  {name:'Tèo Hết Xăng',lane:3.4,grid:7,pace:.985,cornerGrip:11,model:'supercar',color:0x347696}
];
for(const rival of rivals){
  rival.lane*=roadHalfWidth/6;
  Object.assign(rival,{d:rival.grid,offset:rival.lane,v:0,targetLane:rival.lane,lateralV:0,
    thinkIn:0,yawOffset:0,charge:100,collected:new Set(),reverseDelay:0});
  rival.car=new T.Group();scene.add(rival.car);rival.shadow=addShadow(rival.car);
  const shell=new T.Mesh(new T.BoxGeometry(1.78,1.12,3.9),new T.MeshLambertMaterial({color:rival.color}));
  shell.position.y=.7;rival.car.add(shell);
  fitCoupe(rival.car,rival.color,false,rival.model,rival).then(()=>rival.car.remove(shell)).catch(()=>{});
  const label=document.createElement('canvas');label.width=320;label.height=64;
  const ctx=label.getContext('2d');ctx.fillStyle='#202127';ctx.fillRect(0,0,320,64);
  ctx.fillStyle='#ffe079';ctx.font='bold 32px Arial';ctx.textAlign='center';ctx.fillText(rival.name,160,42);
  const tex=new T.CanvasTexture(label);tex.colorSpace=T.SRGBColorSpace;
  const tag=new T.Sprite(new T.SpriteMaterial({map:tex,opacity:.82,transparent:true}));tag.scale.set(1.75,.35,1);tag.position.y=2.35;rival.car.add(tag);
}
const roadTraffic=[];
const civilianAssets=new Map();
for(let i=0;i<12;i++){
 const oncoming=i%3===1,kind=['city-taxi','kei-van','hatchback','motor-scooter'][i%4];
 const path=kind==='city-taxi'?'streetscape/city-taxi.glb':'traffic/'+kind+'.glb';
 if(!civilianAssets.has(path))civilianAssets.set(path,TrafficModels.load.loadAsync(path));
 const cruise=oncoming?-13:9+i%4;
 const npc={bike:kind==='motor-scooter',d:95+i*174,lane:(oncoming?-3.65:(i%2?3.8:2.45))*roadHalfWidth/6,v:cruise,cruise,model:null};roadTraffic.push(npc);
 civilianAssets.get(path).then(({scene:base})=>{
   const mesh=base.clone(true),bounds=new T.Box3().setFromObject(mesh);
   const scale=(kind==='motor-scooter'?1.9:kind==='city-taxi'?4.7:3.95)/(bounds.max.z-bounds.min.z);
   mesh.scale.setScalar(scale);mesh.traverse(n=>{if(n.isMesh)n.castShadow=true;});
   npc.model=mesh;scene.add(mesh);placeCivilian(npc);
 }).catch(()=>{});
}
function placeCivilian(n){
 if(!n.model)return;
 const p=at(n.d,n.lane),r=n.recoil,angle=p.h+(r?.angle||0);
 const x=p.x+(r?.x||0),z=p.z+(r?.z||0);
 const ground=r?.fallen?height(roadCoordinates(x,z,n.d).d):p.y;
 n.model.position.set(x,ground+(r?.y||0)+(r?.fallen ? .25*Math.abs(Math.sin(r.roll)) : 0),z);
 n.model.rotation.set(-(r?.pitch||0),-angle+(n.cruise>0?Math.PI:0),-(r?.roll||0),'YXZ');
 updateBodywork(T,n.model,n.dent,angle+(n.cruise<0?Math.PI:0));
 n.model.visible=n.d>0&&n.d<route.finish&&Math.abs(n.d-(state?.d||0))<340;
}
let vitality=100,grace=0,countdown=3,penalty=0,repairs=0,drafting=false;
let racers;
let lastRank=4,resumePhase='drive',checkpoint=0;
const held=(...codes)=>codes.some(code=>keys.has(code));
const clockText=seconds=>Math.floor(seconds/60)+':'+(seconds%60).toFixed(1).padStart(4,'0');
const rank=()=>1+rivals.filter(r=>state.finishTime!==undefined?r.finishTime<=state.finishTime:r.d>state.d||r.finished).length;
function tellRace(text){message=text;feedbackUntil=state.time+2.4;}
function setMode(mode){state.mode=mode;document.body.dataset.phase=mode;}
function parkCup(){
 const p=at(state.d,state.offset);
 Object.assign(state,{airborne:false,lift:cupRampHeight(state.d,state.offset),jumpPitch:0,verticalV:0});
 Object.assign(cupBody,{x:p.x,z:p.z,yaw:p.h});DriveBody.reset(cupBody);syncCup();
}
function syncCup(){
 const b=cupBody;
 Object.assign(state,roadCoordinates(b.x,b.z,state.d),{x:b.x,z:b.z,h:b.yaw,v:b.speed,steer:b.steer});
}
function placeRivals(){
 for(const r of rivals){
   const p=at(r.d,r.offset),k=r.recoil;
   r.car.position.set(p.x+(k?.x||0),p.y+(r.lift||0),p.z+(k?.z||0));
   r.car.rotation.set((r.jumpPitch||0)+(k?.pitch||0),-p.h-r.yawOffset-(k?.angle||0),k?.roll||0,'YXZ');
   r.shadow.visible=!r.airborne;
 }
}
function beginRace(){
 const p=at(0,1.6);
 state={mode:'grid',d:0,x:p.x,z:p.z,h:p.h,offset:1.6,v:0,steer:0,time:0,signal:0,charge:100,collected:new Set()};
 racers=[state,...rivals];
 if(scenicPasses.has(route.id)){
   $('raceIntro').textContent=scenicPasses.get(route.id).description;
   $('passAtlas').href='cung-duong.html#'+route.id;
 }
 if(cupRamp)$('raceIntro').textContent='Nhặt bánh mì để nạp nitro. Gần đích, rẽ vào nhánh trái để thử dốc bay.';
 inside=DriveView.current()==='cockpit';
 updateDriveViewButton($('camera'),inside);
 parkCup();cupFx.reset();placeRivals();$('routeName').textContent=route.name;$('progress').max=route.finish;
 const choices=Object.keys(routes);$('next').href='?route='+choices[(choices.indexOf(route.id)+1)%choices.length];
 if(route.stage){
   const link=$('freePass'),light=scenicHour()===null?'':'&light='+query.get('light');
   link.href='./?pass='+route.id+light;link.textContent='Lái tự do tại '+route.name;
 }
 requestAnimationFrame(render);
}
const cupBoard=createLeaderboard(route.id,route.name);
$('showBoard').onclick=()=>cupBoard.open();
$('scoreBoard').onclick=()=>cupBoard.open((state.time+penalty)*1000);
function startCountdown(){
 cupBoard.start();
 $('grid').hidden=true;$('hud').hidden=false;$('touch').hidden=false;$('pause').hidden=false;
 setMode('countdown');keys.clear();$('count').textContent='3';driveAudio.cue(false);
}
function openPit(kind){
 setMode('pit');state.v=0;keys.clear();repairs++;
 showCupQuestion(kind);
}
const showCupQuestion=createPitQuiz($('pit'),()=>{penalty+=3;return 'Chưa ổn! Chú Tư cộng 3 giây tiền công. Thử lại nhé.';},repair);
function repair(){
 if(state.mode!=='pit')return;
 vitality=100;state.offset=clamp(state.offset,-roadHalfWidth+.95,roadHalfWidth-.95);parkCup();
 grace=2;keys.clear();setMode('drive');tellRace('Máy lại giòn. Đi kiếm ổ bánh mì thôi!');
}
function collision(kind,hit,vx=0,vz=0,target=null){
 const event=DriveBody.resolve(cupBody,hit,vx,vz,target);syncCup();
 if(grace>0||event.closing<.8)return event;
 DriveBody.recordDent(cupBody,hit,event.delta,cupBody.yaw);
 vitality=Math.max(0,vitality-event.damage);
 const reach=Math.abs(hit.nx*Math.sin(state.h)-hit.nz*Math.cos(state.h))>.65?1.9:.91;
 cupFx.impact(state.x-hit.nx*reach,state.z-hit.nz*reach,hit.nx,hit.nz,event.strength,kind,height(state.d));
 grace=.35;driveAudio.impact(event.strength,target?'vehicle':'curb');
 document.body.classList.add('hit');setTimeout(()=>document.body.classList.remove('hit'),270);
 if(!vitality){crashTime=1.2;crashKind=kind;setMode('crash');keys.clear();}
 else tellRace('Va chạm · '+(event.energy/1000).toLocaleString('vi-VN',{maximumFractionDigits:1})+' kJ · thân xe '+vitality+'%.');
 return event;
}
function advanceRacerRecoil(actor,lane,dt){
 const landing=DriveBody.advanceRecoil(actor,dt);
 if(landing<160&&!actor.recoil?.scrape)return;
 const r=actor.recoil,p=at(actor.d,lane),x=p.x+r.x,z=p.z+r.z;
 if(Math.hypot(state.x-x,state.z-z)>70)return;
 const ground=height(roadCoordinates(x,z,actor.d).d);
 if(r.scrape)cupFx.scrape(x,ground,z,r.vx,r.vz);
 if(landing<160)return;
 const level=Math.min(.77,Math.sqrt(landing)/100);
 cupFx.impact(x,z,-r.vx,-r.vz,level,'scrape',ground,.12);
 driveAudio.impact(level*.55,'vehicle');
}
function trafficContact(actor,lane,dt){
 const {d,v,bike}=actor;
 advanceRacerRecoil(actor,lane,dt);
 const r=actor.recoil;
 if((!r?.fallen&&Math.abs(d-state.d)>11)||Math.abs((actor.lift||0)+(r?.y||0)-state.lift)>1.35)return;
 const p=at(d,lane),heading=p.h+(actor.cruise<0?Math.PI:0)+(actor.yawOffset||0)+(r?.angle||0);
 const other={x:p.x+(r?.x||0),z:p.z+(r?.z||0),yaw:heading};
 const hit=DriveBody.contact(cupBody,other,bike?.4:.9,bike?1:2.1);
 if(!hit)return;
 const motion=p.h+(actor.yawOffset||0);
 const vx=v*Math.sin(motion)+(r?.vx||0),vz=-v*Math.cos(motion)+(r?.vz||0);
 const event=collision(bike?'scooter':'car',hit,vx,vz,actor);
 DriveBody.strikeTraffic(actor,hit,event,heading,state.x,state.z,other.x,other.z);
 if(actor.recoil?.fallen)actor.v=0;
}
function finishRace(){
 setMode('done');keys.clear();state.v=0;$('pause').hidden=true;$('touch').hidden=true;
 const pos=rank(),total=state.time+penalty,key='taylai.cup.best.'+route.id;
 let best=total;try{const old=Number(localStorage.getItem(key));best=old>0?Math.min(old,total):total;localStorage.setItem(key,String(best));}catch{}
 $('podium').textContent=pos===1?'Quán quân thêm chả!':'Về hạng '+pos+'/4';
 $('result').textContent=route.name+' · '+clockText(total)+' · Kỷ lục '+clockText(best)+' · '+repairs+' lượt vào gara'+(penalty?' · gồm '+penalty+' giây phạt':'')+'.';
 $('finish').showModal();
}
function raceUpdate(dt){
 if(state.mode==='crash'){
   for(const n of roadTraffic){advanceRacerRecoil(n,n.lane,dt);placeCivilian(n);}
   for(const r of rivals)DriveBody.advanceRecoil(r,dt);placeRivals();
   DriveBody.settle(cupBody,dt);syncCup();crashTime-=dt;if(crashTime<=0)openPit(crashKind);return;}
 if(state.mode==='countdown'){
   const before=Math.ceil(countdown);countdown-=dt;
   if(Math.ceil(countdown)!==before)driveAudio.cue(countdown<=0);$('count').textContent=countdown>0?Math.ceil(countdown):'';
   if(countdown<=0){setMode('drive');tellRace('Bánh nóng ra lò!');}return;
 }
 if(state.mode!=='drive')return;
 const s=state,previousD=s.d,previousLane=s.offset;s.time+=dt;grace=Math.max(0,grace-dt);
 const hasEnergy=cupTank.level>.0001,gas=hasEnergy&&held('w','arrowup'),brake=held('s','arrowdown',' ');
 const nitro=hasEnergy&&held('shift')&&s.charge>1&&!brake&&!s.airborne,setup=cupSetups[chosenCar];
 drafting=!s.airborne&&rivals.some(r=>inSlipstream(s,r));
 const steer=Number(held('d','arrowright'))-Number(held('a','arrowleft'));
 if(route.stage)cupBody.offroad=Math.abs(s.offset)>roadHalfWidth;
 if(s.airborne){
   cupBody.x+=cupBody.vx*dt;cupBody.z+=cupBody.vz*dt;
   cupBody.boost=false;cupBody.brake=false;cupBody.slip=0;
 }else{
   s.charge=nitroCharge(s.charge,nitro,held('shift'),drafting,dt);
   DriveBody.step(cupBody,{grade:roadGrade(s.d,cupBody.yaw),gas,brake:held(' '),reverse:hasEnergy&&held('s','arrowdown'),steer,boost:nitro,power:setup.power+(drafting?1.6:0),top:setup.top},dt);
 }
 syncCup();cupTank.consume(Math.abs(s.d-previousD));drawCupEnergy();
 updateCupFeatures(s,previousD,previousLane,dt);
 const angle=at(s.d).h;
 const rail=route.stage&&mountainRails.get(Math.sign(s.offset))?.find(span=>s.d>=span.start&&s.d<=span.end);
 const boundary=route.stage?roadHalfWidth+(rail?railSetback(s.d,rail.start,rail.end)-.95:1.45):
   roadHalfWidth-.65+(s.offset<0?cupSpurWidth(s.d):0);
 const edge=Math.abs(s.offset)-boundary;
 if(edge>0){
   const side=-Math.sign(s.offset);
   collision('shoulder',{nx:side*Math.cos(angle),nz:side*Math.sin(angle),depth:edge});
 }
 if(s.d===0){
   const start=at(0),nx=Math.sin(start.h),nz=-Math.cos(start.h);
   const behind=-((s.x-start.x)*nx+(s.z-start.z)*nz)-8;
   if(behind>0)collision('shoulder',{nx,nz,depth:behind});
 }
 if(s.mode!=='drive')return;
 for(const n of roadTraffic){
   if(n.yieldTime>0)n.yieldTime-=dt;
   const target=n.recoil?.fallen||n.recoil?.braking||n.yieldTime>0?0:n.cruise,step=(n.recoil?.braking?10:2)*dt;
   n.v+=clamp(target-n.v,-step,step);
   n.d+=n.v*dt;
   if(n.d>0&&n.d<route.finish)trafficContact(n,n.lane,dt);
   placeCivilian(n);if(s.mode!=='drive')return;
 }
 for(const r of rivals){
   advanceCupDriver(r,racers,roadTraffic,dt);
   trafficContact(r,r.offset,dt);
   if(s.mode!=='drive')break;
 }
 placeRivals();if(s.mode!=='drive')return;
 if(s.d>=route.finish){
   s.finishTime=s.time-dt+dt*clamp((route.finish-previousD)/Math.max(.0001,s.d-previousD),0,1);
   s.time=s.finishTime;finishRace();return;
 }
 if(!checkpoint&&s.d>route.finish/2){checkpoint=1;tellRace('Nửa chặng! Pâté vẫn còn nóng.');}
 else if(rank()<lastRank)tellRace('Vượt đẹp! Lên hạng '+rank()+'/4.');
 else if(rank()>lastRank)tellRace('Bị vượt · còn hạng '+rank()+'/4.');
 lastRank=rank();
}
function raceHud(){
 $('speed').textContent=Math.round(Math.abs(state.v)*3.6);$('hp').value=vitality;$('nitro').value=state.charge;
 $('rank').textContent=rank()+'/4';$('time').textContent=clockText(state.time+penalty);
 $('distance').textContent=Math.round(state.d)+' m';$('progress').value=state.d;
 $('callout').textContent=state.mode==='drive'?(state.time<feedbackUntil?message:drafting?'Núp gió · nạp nitro':''):'';
}
// Frame a bend from the uphill side so the road and the valley read together.
function passPanorama(){
 let best=null,score=-Infinity;
 for(let d=120;d<route.finish-100;d+=80){
   const road=at(d);
   for(const side of [-1,1]){
     const valley=at(d,side*450),eye=at(d-52,-side*80);
     const drop=road.y-renderedGround(valley.x,valley.z);
     const bend=Math.min(1,Math.abs(heading(d+48)-heading(d-48)));
     if(drop+80*bend<=score)continue;
     score=drop+80*bend;
     const target=at(d+38,side*32);
     best={eye:new T.Vector3(eye.x,Math.max(renderedGround(eye.x,eye.z)+26,road.y+43),eye.z),
       target:new T.Vector3(target.x,road.y+7,target.z)};
   }
 }
 return best;
}
const scenicView=featuredPass?passPanorama():null;
function raceCamera(dt,now){
 const driving=state.mode==='drive',braking=held('s','arrowdown',' ');
 playerShadow.visible=!state.airborne;
 for(const bread of cupBreads){
   bread.mesh.position.y=bread.baseY+.16*Math.sin(3*state.time+bread.d);
   bread.mesh.rotation.y=state.time*1.25+bread.d;
 }
 for(const c of animatedCars){
   const v=c.isPlayer?state.v:c.driver.v,steer=c.isPlayer?state.steer:c.driver.yawOffset;
   if(driving)c.wheels.forEach((wheel,i)=>wheel?.rotateX((i%2?-1:1)*v*dt/.344));
   c.front.forEach(joint=>{if(joint)joint.rotation.y=-steer*.36;});
   if(c.rear)c.rear.emissiveIntensity=(c.isPlayer?braking:c.driver.brake)?4:.68;
   updateBodywork(T,c.model,c.isPlayer?cupBody.dent:c.driver.dent,c.isPlayer?cupBody.yaw:at(c.driver.d).h+(c.driver.recoil?.angle||0));
   c.model.rotation.z=c.isPlayer?-cupBody.roll:0;
   const station=c.isPlayer?state.d:c.driver.d;
   c.model.rotation.x=c.isPlayer?-cupBody.pitch:Math.atan(roadGrade(station,at(station).h));
 }
 if(state.mode==='grid'&&scenicView){
   camera.position.copy(scenicView.eye);camera.lookAt(scenicView.target);
 }else if(state.mode==='grid'){
   const portrait=camera.aspect<.85;
   eye.set(portrait?-5.5:-4.0,portrait?1.85:1.42,portrait?8.4:5.18).applyQuaternion(yawQ).add(rig.position);
   look.set(portrait?0:-1.28,.77,-.35).applyQuaternion(yawQ).add(rig.position);
   camera.position.copy(eye);camera.lookAt(look);
 }else if(!inside){
   eye.set(-state.steer*.38,1.85+state.v*.009,6.1+state.v*.021).applyQuaternion(yawQ).add(rig.position);
   look.set(0,.84,-10).applyQuaternion(yawQ).add(rig.position);
   camera.position.copy(eye);camera.lookAt(look);
 }

 const desired=(inside?64:state.mode==='grid'?47:57+Math.abs(state.v)*.29)+cupFx.boostFov(driving&&cupBody.boost,inside);
 if(Math.abs(camera.fov-desired)>.05){camera.fov+=(desired-camera.fov)*(1-Math.exp(-dt*5));camera.updateProjectionMatrix();}
 cupBody.y=height(state.d)+state.lift;cupBody.driving=driving&&!state.airborne;
 cupFx.update(cupBody,state.mode==='paused'?0:dt,0,0,inside,camera,courseWeather.rainfall);
}
function pauseRace(){
 if(!['drive','countdown'].includes(state.mode))return;
 resumePhase=state.mode;keys.clear();setMode('paused');$('rest').showModal();
}
$('launch').onclick=startCountdown;$('pause').onclick=pauseRace;
$('resume').onclick=()=>{$('rest').close();keys.clear();setMode(resumePhase);};
$('again').onclick=()=>location.reload();
$('camera').onclick=()=>{
 if(state.mode==='grid')return;
 inside=!inside;
 DriveView.select(inside?'cockpit':'chase');
 updateDriveViewButton($('camera'),inside);
};
function updateSoundButton(){
 $('sound').textContent=sound?'Tắt âm':'Bật âm';
 $('sound').dataset.muted=String(!sound);
 $('sound').title=$('sound').textContent;
}
updateSoundButton();
$('sound').onclick=()=>{sound=driveAudio.toggle();updateSoundButton();};
for(const dialog of document.querySelectorAll('#rest,#finish,#pit'))dialog.oncancel=e=>{e.preventDefault();if(dialog.id==='rest')$('resume').click();};
window.addEventListener('keydown',e=>{
 if($('cockpitSettings').open)return;
 const key=e.key.toLowerCase();
 if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,textarea,select,[contenteditable=true],dialog'))return;
 if(key==='p'&&!e.repeat){if(state.mode==='paused')$('resume').click();else pauseRace();return;}
 if(!['drive','countdown'].includes(state.mode))return;
 if(key==='c'&&!e.repeat){$('camera').click();e.preventDefault();}
 if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','shift',' '].includes(key)){keys.add(key);e.preventDefault();}
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',pauseRace);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseRace();});
beginRace();
