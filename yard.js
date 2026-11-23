'use strict';
// Horizontal positions use x (east) and y (north); world Z is -y.
const Y = THREE, $ = id => document.getElementById(id);
const opts = new URLSearchParams(location.search);
const exam = opts.get('mode') === 'exam';
const clamp=(n,l,h)=>Math.min(h,Math.max(l,n)), rad=Math.PI/180;
const lessons=[
 ['Xuất phát','Thắt dây an toàn (B), bật xi nhan trái (Q), đi qua vạch rồi tắt xi nhan.'],
 ['Nhường đường cho người đi bộ','Phanh dừng cách vạch vàng tối đa 0,5 m. Khi đã nhường xong, tiếp tục đi.'],
 ['Dừng và khởi hành ngang dốc','Dừng sát trước vạch trên dốc, giữ phanh. Nhả phanh và tăng ga để lên đỉnh.'],
 ['Vệt bánh xe và đường vuông góc','Cho hai bánh bên phải đi giữa hai dải vàng. Đánh lái theo hai góc vuông của hành lang.'],
 ['Ngã tư có tín hiệu','Quan sát đèn, dừng trước vạch khi đèn đỏ. Đi thẳng qua giao lộ khi được phép.'],
 ['Đường vòng quanh co','Đi chậm theo đường chữ S, giữ bốn bánh trong hai vạch biên.'],
 ['Ghép xe dọc','Tiến qua miệng ô bên phải, dừng, vào số R và lùi vuông góc vào ô. Dừng gọn trong khung, về số 1 rồi ra đường.'],
 ['Ghép xe ngang','Tiến qua ô đỗ bên phải, vào số R và lùi xe song song với lề. Dừng gọn trong khung rồi ra đường.'],
 ['Dừng trước đường sắt','Dừng cách vạch trước đường ray tối đa 0,5 m, sau đó vượt qua đường sắt.'],
 ['Thay đổi số trên đường bằng','Trong 25 m đầu lên số 2 (G) và vượt 24 km/h. Trong 25 m sau giảm xuống dưới 24 km/h và về số 1.'],
 ['Kết thúc','Bật xi nhan phải (E), đi theo đường cong đến cổng đích và qua vạch kết thúc.']
];
const pick=$('pick');
lessons.forEach(([name],i)=>pick.add(new Option(String(i+1).padStart(2,'0')+' · '+name,i)));
pick.disabled=exam;
$('modeLabel').textContent=exam?'Thi liên hoàn · 11 bài · 18 phút · đạt 80/100':'Luyện riêng từng bài · chọn bài để chuyển vị trí';
const route=[{x:0,y:0,h:0,s:0}], zones=[];
function extend(length,turn=0){
 const n=Math.ceil(length/.6),ds=length/n,dh=turn*rad/n;
 for(let j=0;j<n;j++){
  const p=route.at(-1);
  route.push({x:p.x+Math.sin(p.h+dh/2)*ds,y:p.y+Math.cos(p.h+dh/2)*ds,h:p.h+dh,s:p.s+ds});
 }
}
function zone(draw,width=6.8){
 const from=route.at(-1).s;draw();zones.push({from,to:route.at(-1).s,width});
}
zone(()=>extend(17));zone(()=>extend(24));zone(()=>extend(46));
zone(()=>{extend(13);extend(12,90);extend(13);extend(12,90);extend(6);},5.9);
zone(()=>extend(27));
zone(()=>{extend(13,-60);extend(23,110);extend(13,-50);extend(8);},6.6);
zone(()=>extend(29));zone(()=>extend(29));zone(()=>extend(25));
zone(()=>extend(50));zone(()=>{extend(14,-80);extend(14);});
const total=route.at(-1).s;
function point(s,side=0){
 s=clamp(s,0,total);
 let lo=0,hi=route.length-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(route[mid].s<=s)lo=mid;else hi=mid;}
 const a=route[lo],b=route[hi],t=(s-a.s)/(b.s-a.s),h=a.h+(b.h-a.h)*t;
 return {x:a.x+(b.x-a.x)*t+Math.cos(h)*side,y:a.y+(b.y-a.y)*t-Math.sin(h)*side,h,s};
}
function altitude(s){
 const d=s-zones[2].from;
 return Math.max(0,Math.min(d*.105,1.89,(43-d)*.105));
}
function nearest(x,y,station){
 let best,err=Infinity;
 // Restrict the search to the active part of the itinerary.
 for(let i=1;i<route.length;i++){
  const b=route[i],a=route[i-1];if(Math.abs(b.s-station)>14)continue;
  const dx=b.x-a.x,dy=b.y-a.y;
  const t=clamp(((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy),0,1);
  const nx=x-a.x-t*dx,ny=y-a.y-t*dy,e=nx*nx+ny*ny;
  if(e<err){err=e;best={s:a.s+(b.s-a.s)*t,side:nx*Math.cos(a.h)-ny*Math.sin(a.h),h:a.h};}
 }
 return best;
}
function parkBox(i){
 const s=zones[i].from+12;
 return {s,side:i===6?6:4.5,width:i===6?6.2:2.9,length:i===6?3.15:7.4,angle:point(s).h+(i===6?-Math.PI/2:0)};
}
const scene=new Y.Scene();scene.background=new Y.Color(0xa9c6d6);scene.fog=new Y.FogExp2(0xc2cfce,.0055);
const renderer=DrivingRenderer.get($('world'));
const camera=new Y.PerspectiveCamera(54,1,.1,550);
const graphics=createDrivingGraphics(renderer,camera);
new Y.TextureLoader().load('streetscape/sky.jpg',texture=>{
 texture.mapping=Y.EquirectangularReflectionMapping;texture.colorSpace=Y.SRGBColorSpace;
 scene.background=texture;scene.environment=texture;
});
scene.add(new Y.HemisphereLight(0xfff0d2,0x9ab6ac,1.8));
const sun=new Y.DirectionalLight(0xffdfad,2.2);sun.position.set(-35,55,15);scene.add(sun);
const cube=new Y.BoxGeometry(1,1,1), materials=new Map(), batches=new Map();
function mat(color){if(!materials.has(color))materials.set(color,new Y.MeshLambertMaterial({color}));return materials.get(color);}
function block(x,z,alt,w,h,d,color,angle=0,parent=null){
 const m=new Y.Mesh(cube,mat(color));m.position.set(x,alt,-z);m.scale.set(w,h,d);m.rotation.y=-angle;
 if(parent)parent.add(m);else{m.updateMatrix();if(!batches.has(color))batches.set(color,[]);batches.get(color).push(m.matrix);}
 return m;
}
function localBlock(st,side,up,w,h,d,color){
 const p=point(st,side);
 return block(p.x,p.y,altitude(st)+up,w,h,d,color,p.h);
}
block(35,-20,-.35,800,.6,800,0x839e65);
const asphalt=new Y.TextureLoader().load('streetscape/asphalt.jpg');
asphalt.colorSpace=Y.SRGBColorSpace;asphalt.wrapS=asphalt.wrapT=Y.RepeatWrapping;
const roadMat=new Y.MeshLambertMaterial({map:asphalt,color:0xabb4b1,side:Y.DoubleSide});
function ribbon(path,width,offset,height,material){
 const vertices=[],indices=[],uv=[];
 path.forEach((p,i)=>{
  for(const lateral of [offset-width/2,offset+width/2]){
   vertices.push(p.x+lateral*Math.cos(p.h),altitude(p.s)+height,-p.y+lateral*Math.sin(p.h));
   uv.push(lateral/5,p.s/5);
  }
  if(i){const v=2*i;indices.push(v-2,v-1,v,v,v-1,v+1);}
 });
 const g=new Y.BufferGeometry();g.setAttribute('position',new Y.Float32BufferAttribute(vertices,3));
 g.setAttribute('uv',new Y.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
 scene.add(new Y.Mesh(g,material));
}
const signPlate=new Y.PlaneGeometry(4.3,1.26);
function sign(st,offset,text,color='#215f54'){
 const p=point(st,offset),ground=altitude(st);
 localBlock(st,offset,1.45,.09,2.9,.09,0x676d69);
 const c=document.createElement('canvas');c.width=512;c.height=150;
 const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,512,150);
 ctx.strokeStyle='white';ctx.lineWidth=5;ctx.strokeRect(6,6,500,138);
 ctx.font='bold 48px Arial';ctx.fillStyle='white';ctx.textAlign='center';ctx.fillText(text,256,92,477);
 const tex=new Y.CanvasTexture(c);tex.colorSpace=Y.SRGBColorSpace;
 const board=new Y.Mesh(signPlate,new Y.MeshBasicMaterial({map:tex}));
 const back=new Y.Mesh(signPlate,mat(0x898e89));
 back.rotation.y=Math.PI;back.position.z=-.03;board.add(back);
 board.position.set(p.x,ground+2.65,-p.y);board.rotation.y=-p.h;board.translateZ(.085);scene.add(board);
}
const yellow=mat(0xffd14d), white=mat(0xf2f1df);
yellow.side=white.side=Y.DoubleSide;
zones.forEach((z,i)=>{
 const strip=route.filter(p=>p.s>=z.from-.00001&&p.s<=z.to+.00001);
 ribbon(strip,z.width,0,.025,roadMat);
 for(const signSide of [-1,1])ribbon(strip,.12,signSide*(z.width/2-.10),.044,white);
 sign(z.from+3,-z.width/2-1.65,(i+1)+' · '+['XUẤT PHÁT','NHƯỜNG ĐƯỜNG','DỐC','GÓC VUÔNG','NGÃ TƯ','ĐƯỜNG CHỮ S','GHÉP DỌC','GHÉP NGANG','ĐƯỜNG SẮT','ĐỔI SỐ','KẾT THÚC'][i]);
 for(let s=z.from+2;s<z.to;s+=5){
  for(const edge of [-1,1])if(!(i===6||i===7)||edge===-1){
   localBlock(s,edge*(z.width/2+.32),.14,.38,.28,1.5,Math.floor(s/5)%2?0xe4e0cc:0xb15543);
  }
 }
});
for(const i of [6,7]){
 const b=parkBox(i),z=zones[i];
 const strip=route.filter(p=>p.s>=z.from+2&&p.s<=z.to-2);
 ribbon(strip,8,5,.032,roadMat);
 for(const dir of [-1,1]){
  localBlock(b.s+b.length/2*dir,b.side,.06,b.width,.045,.12,0xffde67);
  localBlock(b.s,b.side+b.width/2*dir,.06,.12,.045,b.length,0xffde67);
 }
}
const stopAt=i=>zones[i].from+({1:13,2:17,4:10,8:12}[i]||0);
for(const i of [1,2,4,8])localBlock(stopAt(i),0,.059,zones[i].width-.3,.05,.18,0xffda60);
for(let j=-2.6;j<3;j+=.83)localBlock(stopAt(1)+2,j,.064,.42,.035,2.3,0xf3f0df);
for(const dir of [-1,1])localBlock(stopAt(8)+3+dir*.72,0,.084,19,.06,.14,0x604f40);
for(let j=-9;j<9;j+=.6)localBlock(stopAt(8)+3,j,.052,.23,.045,2.2,0x8a6d4c);
const junction=point(stopAt(4)+5);block(junction.x,junction.y,-.025,32,.08,6,0x616562,junction.h);
const signalAt=stopAt(4)+2,lightPoint=point(signalAt,3.9);
localBlock(signalAt,3.9,2.1,.13,4.2,.13,0x666d66);
localBlock(signalAt,3.9,3.8,.63,1.55,.46,0x26302c);
const lamp=new Y.Mesh(new Y.SphereGeometry(.25,12,10),new Y.MeshBasicMaterial({color:0xff3c26}));
lamp.position.set(lightPoint.x-.28*Math.sin(lightPoint.h),4.13,-lightPoint.y+.28*Math.cos(lightPoint.h));scene.add(lamp);
for(const edge of [-1,1])localBlock(zones[3].from+6,.72+edge*.24,.056,.09,.055,8,0xffd444);
for(const s of [zones[9].from+.8,zones[9].from+25,zones[9].to-1])localBlock(s,0,.055,6.3,.05,.2,0xf0d65b);
sign(zones[9].from+5,4.5,'SỐ 2   >24','#28578c');sign(zones[9].from+30,4.5,'SỐ 1   <24','#28578c');
for(const st of [4,total-3]){
 localBlock(st,-3.9,2.7,.22,5.4,.22,0x566859);localBlock(st,3.9,2.7,.22,5.4,.22,0x566859);
 localBlock(st,0,5.42,8.1,.34,.32,0x54664f);
 for(let c=-3;c<3;c+=.5)localBlock(st,c,.058,.5,.04,.55,Math.round(c*2)%2?0xf4f0df:0x252d2a);
}
const pts=route.map(p=>[p.x,p.y]);
const left=Math.min(...pts.map(p=>p[0]))-12,right=Math.max(...pts.map(p=>p[0]))+12;
const bottom=Math.min(...pts.map(p=>p[1]))-12,topY=Math.max(...pts.map(p=>p[1]))+12;
const yardTrees=[];
for(let x=left-20;x<right+30;x+=13){
 for(const y of [bottom-10,topY+14]){
  const angle=x*.47+y*.71,h=6.8+1.2*Math.sin(angle);
  yardTrees.push([x,0,-y,h*.84,h,angle]);
 }
}
createTreeModels(Y).grove(scene,yardTrees,false);
// Bring the control building and fence close to the pavement.
for(const boundary of [left,right]){
 for(let y=bottom;y<=topY;y+=6){
  block(boundary,y,1,.12,2,.14,0x6b7469);
  block(boundary,y+2.9,1.45,.09,.07,5.8,0xb4b9ab);
  block(boundary,y+2.9,.46,.09,.07,5.8,0xb4b9ab);
 }
}
const controlX=left-3,controlY=point(zones[4].from).y;
block(controlX,controlY,2.5,9,5,16,0xcdbb9e);block(controlX,controlY,5.13,9.7,.3,16.7,0x8f6050);
for(let row=0;row<2;row++)for(let m=0;m<4;m++)block(controlX+4.53,controlY-6+m*4,1.45+row*2.3,.08,1.35,2.6,0x50707a);
for(let x=left-15;x<right+20;x+=18){
 const h=7+Math.abs(Math.sin(x))*7;
 block(x,topY+35,h/2,14,h,8,0xc0b7a5);
 for(let f=2;f<h;f+=2.8)block(x,topY+30.95,f,11,.85,.12,0x59757a);
}
for(const [color,list] of batches){
 const batch=new Y.InstancedMesh(cube,mat(color),list.length);
 list.forEach((matrix,i)=>batch.setMatrixAt(i,matrix));scene.add(batch);
}
const vehicle=new Y.Group();scene.add(vehicle);
const body=new Y.Group();vehicle.add(body);
let cabin;
const seat=new Y.Vector3(),ahead=new Y.Vector3();
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;
const sc=shadowCanvas.getContext('2d'),shade=sc.createRadialGradient(32,32,6,32,32,32);
shade.addColorStop(0,'rgba(32,28,19,.70)');shade.addColorStop(1,'rgba(32,28,19,0)');sc.fillStyle=shade;sc.fillRect(0,0,64,64);
const shadow=new Y.Mesh(new Y.PlaneGeometry(2.8,5.1), new Y.MeshBasicMaterial({map:new Y.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));
shadow.rotation.x=-Math.PI/2;shadow.position.y=.014;vehicle.add(shadow);
const fallback=new Y.Group();body.add(fallback);
block(0,0,.57,1.8,.66,4.18,0xcca45c,0,fallback);block(0,-.12,1.09,1.5,.5,1.95,0x4a6165,0,fallback);
async function loadSedan(){
 const response=await fetch('streetscape/sedan.json.gz');if(!response.ok)return;
 const buf=new Uint8Array(await response.arrayBuffer());
 const json=buf[0]===31?await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).json():JSON.parse(new TextDecoder().decode(buf));
 const model=new Y.ObjectLoader().parse(json),bounds=new Y.Box3().setFromObject(model);
 const scale=4.18/(bounds.max.z-bounds.min.z);model.scale.setScalar(scale);
 model.position.y=-bounds.min.y*scale;model.rotation.y=Math.PI;body.add(model);body.remove(fallback);
}
loadSedan().catch(()=>{});
const car={x:0,y:0,h:0,v:0,steer:0,gear:1,signal:'',belt:false,hazard:false};
const input=createDriveInput(),penalties=[],mapCtx=$('map').getContext('2d');
let index=0,s=0,oldS=0,mode='ready',score=100,wallStart=0,time=0,stageStart=0,view=DriveView.current();
let done=new Set(),flags={},emergency=null,emergencyIndex=6,emergencyOnly=false,lastTime=performance.now();
let note='',noteUntil=0,lastHud=-Infinity;
pick.add(new Option('Tình huống nguy hiểm bất ngờ',11));
function resetFlags(){flags={stop:false,hold:0,roll:0,park:false,reverse:0,fast:false,slow:false,track:false,off:false,wrong:false,overspeed:0,overTime:0,stageTime:0};stageStart=time;}
function tell(msg,seconds=3){note=msg;noteUntil=time+seconds;}
function syncButtons(){
 document.querySelectorAll('[data-act]').forEach(b=>{
  const key=b.dataset.act;
  b.classList.toggle('active',key==='belt'?car.belt:key==='hazard'?car.hazard:key==='reverse'?car.gear<0:key==='shift'?car.gear===2:key===car.signal);
 });
}
function action(which){
 if(mode==='ended')return;
 if(which==='belt')car.belt=!car.belt;
 if(which==='left'||which==='right')car.signal=car.signal===which?'':which;
 if(which==='hazard')car.hazard=!car.hazard;
 if(which==='reverse'){
  if(Math.abs(car.v)>.3)tell('Dừng hẳn trước khi đổi chiều.');
  else {car.gear=car.gear===-1?1:-1;car.v=0;}
 }
 if(which==='shift'){if(car.gear<0&&Math.abs(car.v)>.3)tell('Dừng hẳn trước khi ra khỏi số lùi.');else car.gear=car.gear===1?2:1;}
 syncButtons();hud();
}
function scenario(requested){
 emergencyOnly=!exam&&requested===11;index=emergencyOnly?6:requested;
 pick.value=emergencyOnly?11:index;
 s=zones[index].from+.9;oldS=s;const p=point(s);
 Object.assign(car,{x:p.x,y:p.y,h:p.h,v:0,steer:0,gear:1,signal:'',belt:index!==0,hazard:false});
 mode='ready';time=0;score=100;penalties.length=0;input.clear();done.clear();
 resetFlags();emergency=null;emergencyIndex=[4,6,8][Math.floor(Math.random()*3)];
 note='';noteUntil=0;lastHud=-Infinity;$('go').disabled=false;$('go').textContent=exam?'Bắt đầu thi':'Bắt đầu lái';
 $('name').textContent=emergencyOnly?'Tình huống nguy hiểm':lessons[index][0];
 $('guide').textContent=emergencyOnly?'Khi nhận tín hiệu, phanh ngay, bật đèn cảnh báo H. Chờ hết báo động rồi tắt H.':lessons[index][1];
 syncButtons();hud();
}
function end(passed,why){
 if(mode==='ended')return;
 mode='ended';if(exam&&parent!==window)$('again').hidden=true;car.v=0;input.clear();
 $('go').textContent='Đã kết thúc';$('go').disabled=true;
 $('cue').textContent=why+' · '+score+'/100'+(penalties.length?' · '+penalties.slice(-2).join(' / '):'');
 if(exam&&parent!==window)parent.postMessage({type:'drive-exam-result',part:'yard',passed,score},location.origin);
}
function fine(key,text,points=5){
 if(done.has(key))return;done.add(key);score=Math.max(0,score-points);
 penalties.push(text+' (−'+points+')');tell(penalties.at(-1),4);
 if(exam&&score<80)end(false,'Dưới 80 điểm');
}
function start(){
 if(mode!=='ready')return;
 mode='running';wallStart=Date.now();$('go').disabled=true;$('go').textContent='Đang lái';
 if(index===0&&!car.belt)tell('Thắt dây an toàn và bật xi nhan trái trước khi qua vạch.');
}
function transition(){
 if(mode!=='running')return;
 if(!exam||index===10)return end(score>=80,exam?'Hoàn tất 11 bài':'Hoàn tất lượt luyện');
 index++;pick.value=index;resetFlags();$('name').textContent=lessons[index][0];$('guide').textContent=lessons[index][1];
 tell('Vào bài '+(index+1)+' · '+lessons[index][0]);
 if(index===emergencyIndex)emergency={start:time,stopped:false,on:false,clear:false};
}
function emergencyStep(){
 const age=time-emergency.start;
 if(Math.abs(car.v)<.08 && age<=3)emergency.stopped=true;
 if(car.hazard && age<=5)emergency.on=true;
 if(age>3&&!emergency.stopped)fine('hazard-stop','Phanh dừng muộn',10);
 if(age>5&&!emergency.on)fine('hazard-on','Bật cảnh báo muộn',10);
 if(age>=6){
  if(!emergency.clear){emergency.clear=true;tell('Hết báo động. Tắt đèn cảnh báo trước khi đi.',5);}
  if(!car.hazard && Math.abs(car.v)<.2){emergency=null;if(emergencyOnly)end(score>=80,'Hoàn tất xử lý nguy hiểm');}
  else if(Math.abs(car.v)>.6)fine('hazard-off','Xe đi tiếp khi còn cảnh báo',10);
 }
}
function lightGreen(){return (time-stageStart)%13>=5;}
function withinBay(){
 const bay=parkBox(index),axis=point(bay.s,bay.side),dx=car.x-axis.x,dy=car.y-axis.y;
 const lateral=dx*Math.cos(axis.h)-dy*Math.sin(axis.h),longitudinal=dx*Math.sin(axis.h)+dy*Math.cos(axis.h);
 const delta=car.h-axis.h;
 const across=Math.abs(Math.sin(delta))*2.09+Math.abs(Math.cos(delta))*.91;
 const along=Math.abs(Math.cos(delta))*2.09+Math.abs(Math.sin(delta))*.91;
 return Math.abs(lateral)+across<=bay.width/2 && Math.abs(longitudinal)+along<=bay.length/2 && Math.cos(car.h-bay.angle)>.96;
}
function allowBay(px,py){
 if(index!==6&&index!==7)return false;
 const axis=point(zones[index].from),dx=px-axis.x,dy=py-axis.y;
 const x=dx*Math.cos(axis.h)-dy*Math.sin(axis.h),y=dx*Math.sin(axis.h)+dy*Math.cos(axis.h);
 return x>=-3.3&&x<=9&&y>=2&&y<=zones[index].to-zones[index].from-2;
}
function assess(dt,near){
 const z=zones[index],d=s-z.from,front=s+2.09*Math.cos(car.h-near.h);
 const speed=Math.abs(car.v)*3.6;
 if(index!==9 && speed>24){flags.overspeed+=dt;if(flags.overspeed>=3){flags.overspeed-=3;fine('speed'+Math.floor(time),'Quá 24 km/h',1);}}
 const maxHalf=z.width/2;
 const tires=[];
 for(const offset of [-.78,.78])for(const axle of [-1.31,1.31]){
  const dx=Math.sin(car.h)*axle+Math.cos(car.h)*offset,dy=Math.cos(car.h)*axle-Math.sin(car.h)*offset;
  const lateral=near.side+dx*Math.cos(near.h)-dy*Math.sin(near.h);
  tires.push({lateral,outer:Math.abs(lateral)>maxHalf&&!allowBay(car.x+dx,car.y+dy)});
 }
 const outside=tires.filter(w=>w.outer).length;
 if(outside&&!flags.off){flags.off=true;fine('border'+index+'-'+Math.floor(time),'Bánh xe chạm biên');}
 if(!outside)flags.off=false;
 if(outside===4 && Math.abs(near.side)>maxHalf+1.4){
  if(exam){end(false,'Xe ra ngoài đường thi');return;}
  const p=point(Math.max(z.from+.9,s-2));Object.assign(car,{x:p.x,y:p.y,h:p.h,v:0});s=p.s;tell('Ra khỏi đường tập · xe được đặt lại trong làn.');
 }
 if(emergency){emergencyStep();return;}
 if(emergencyOnly){if(d>2)emergency={start:time,stopped:false,on:false,clear:false};return;}
 if(index===0&&d>=4){
  if(!car.belt)fine('belt','Chưa thắt dây an toàn');if(car.signal!=='left'&&!flags.startChecked)fine('start-blink','Thiếu xi nhan trái lúc xuất phát');
  flags.startChecked=true;if(d>12&&car.signal==='left')fine('cancel-blink','Chưa tắt xi nhan sau khi xuất phát');
 }
 if([1,2,8].includes(index)){
  const gap=stopAt(index)-front;
  if(!flags.stop && speed<.3 && gap>=-.015 && gap<=.5){flags.stop=true;flags.hillS=s;tell('Đúng vị trí · có thể tiếp tục.');}
  if(!flags.stop&&gap<-.05){
   if(index===2&&exam){end(false,'Quá vạch dừng trên dốc');return;}
   fine('stop-'+index,'Dừng chưa đúng vạch');flags.missed=true;
  }
  if(index===2&&flags.stop){
   flags.roll=Math.max(flags.roll,flags.hillS-s);
   if(flags.roll>.5){if(exam){end(false,'Tụt dốc quá 0,5 m');return;}fine('rollback','Xe tụt dốc quá 0,5 m');}
  }
 }
 if(index===3 && d>=3&&d<=10){
  if(Math.abs(tires[2].lateral-.72)>.24||Math.abs(tires[3].lateral-.72)>.24)fine('tracks','Bánh phải ra khỏi vệt');
 }
 if(index===4&&front>stopAt(4)&&!flags.passedLight){
  flags.passedLight=true;if(!lightGreen())fine('light','Qua giao lộ khi đèn đỏ',10);
 }
 if(index===6||index===7){
  if(car.v<0 && allowBay(car.x,car.y))flags.reverse-=car.v*dt;
  if(!flags.park && flags.reverse>1 && withinBay() && speed<.3){flags.park=true;tell('Đã ghép xe · về số 1, đưa xe trở lại làn.',5);}
  if(s>z.to-3&&!flags.park){
   if(exam){end(false,'Chưa ghép xe đúng ô');return;}
   tell('Cần lùi và dừng trọn xe trong ô vàng. Chọn Làm lại để tập lại.',1);
  }
 }
 if(index===9){if(d<25&&car.gear===2&&speed>24)flags.fast=true;if(d>25&&flags.fast&&car.gear===1&&speed<24)flags.slow=true;}
 if(index===10&&front>=z.to-3&&!flags.finished){flags.finished=true;if(car.signal!=='right')fine('finish-signal','Thiếu xi nhan phải khi kết thúc');}
 if(s>=z.to-(index===10?1:.35)){
  if(index===9 && !(flags.fast&&flags.slow))fine('gear','Chưa hoàn thành chuỗi tăng, giảm số và tốc độ');
  if((index===6||index===7)&&!flags.park)return;
  transition();
 }
}
function drive(dt){
 if(mode!=='running')return;
 time=(Date.now()-wallStart)/1000;
 if(exam&&time>1080)fine('extra-'+Math.floor((time-1080)/3),'Quá thời gian quy định',1);
 if(index===0&&exam&&!flags.startChecked&&time>30){end(false,'Quá thời gian xuất phát');return;}
 const left=input.has('arrowleft')||input.has('a'), right=input.has('arrowright')||input.has('d');
 const brake=input.has('arrowdown')||input.has('s')||input.has(' ');
 const gas=input.has('arrowup')||input.has('w');
 car.steer+=(Number(right)-Number(left)-car.steer)*Math.min(1,dt*7);
 const grade=(altitude(s+.2)-altitude(s-.2))/.4;
 car.v+=((gas?(car.gear<0?-1.9:2.85):0)-grade*5.1*Math.cos(car.h-point(s).h))*dt;
 const drag=(brake?6.8:.35+car.v*car.v*.009)*dt;
 car.v=Math.sign(car.v)*Math.max(0,Math.abs(car.v)-drag);
 car.v=clamp(car.v,-2.2,car.gear===2?10.5:6.2);
 car.h+=car.v*Math.tan(car.steer*.60)/2.62*dt;
 car.x+=Math.sin(car.h)*car.v*dt;car.y+=Math.cos(car.h)*car.v*dt;
 oldS=s;const near=nearest(car.x,car.y,s);s=near.s;assess(dt,near);
}
function hud(){
 const kmh=Math.round(Math.abs(car.v)*3.6),z=zones[index];
 $('points').textContent=score+' điểm';$('speed').textContent=kmh;$('gear').textContent=car.gear<0?'R':car.gear;
 const seconds=exam?Math.max(0,1080-Math.floor(time)):Math.floor(time);
 $('clock').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
 $('badge').textContent=emergencyOnly?'Xử lý nguy hiểm':'Bài '+(index+1)+' / 11';
 if(mode==='ended')return;
 let cue='';
 if(mode==='ready')cue='Chọn Bắt đầu, giữ ↑ để nhấn ga.';
 else if(emergency)cue=emergency.clear?'Hết báo động · dừng và tắt H.':'⚠ NGUY HIỂM · phanh dừng ngay và bật H!';
 else if(time<noteUntil)cue=note;
 else if([1,2,8].includes(index)&&!flags.stop&&!flags.missed)cue='Cản trước cách vạch '+(stopAt(index)-s-2.09*Math.cos(car.h-point(s).h)).toFixed(2)+' m';
 else if(index===4)cue=lightGreen()?'Đèn xanh · quan sát và qua giao lộ.':'Đèn đỏ · dừng trước vạch.';
 else if(index===6||index===7)cue=flags.park?'Đã vào ô · đưa xe trở lại đường.':'Ô vàng ở bên phải · đổi góc nhìn để xem toàn sân.';
 else cue='Còn '+Math.max(0,Math.ceil(z.to-s))+' m trong bài.';
 $('cue').textContent=cue;
}
const mapScale=Math.min((190-18)/(right-left),(138-12)/(topY-bottom));
const px=x=>95+(x-(right+left)/2)*mapScale,py=y=>69-(y-(topY+bottom)/2)*mapScale;
const mapZones=zones.map(z=>{
 const path=new Path2D();let begun=false;
 for(const p of route){
  if(p.s<z.from||p.s>z.to)continue;
  if(begun)path.lineTo(px(p.x),py(p.y));else path.moveTo(px(p.x),py(p.y));
  begun=true;
 }
 return path;
});
function miniMap(){
 const ctx=mapCtx;
 ctx.fillStyle='#1b2c27';ctx.fillRect(0,0,190,138);
 mapZones.forEach((path,i)=>{
  ctx.strokeStyle=i===index?'#dfeb88':'#819387';ctx.lineWidth=i===index?3:1.5;ctx.stroke(path);
 });
 ctx.save();ctx.translate(px(car.x),py(car.y));ctx.rotate(car.h);ctx.fillStyle='white';ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(3.6,4);ctx.lineTo(-3.6,4);ctx.closePath();ctx.fill();ctx.restore();
 cabin?.refreshMap();
}
function frame(now){
 const dt=clamp((now-lastTime)/1000,0,.08);lastTime=now;drive(dt);
 graphics.frame(now,mode==='running');
 const height=altitude(s);vehicle.position.set(car.x,height+.05,-car.y);vehicle.rotation.order='YXZ';vehicle.rotation.y=-car.h;vehicle.rotation.x=Math.atan((altitude(s+1)-altitude(s-1))/2)*Math.cos(car.h-point(s).h);
 const seated=view==='cockpit';body.visible=!seated;
 if(seated){
   cabin??=buildDriverCabin(Y,vehicle,$('map'));
   cabin.driverEye(seat,ahead,camera.aspect);
   camera.position.copy(vehicle.localToWorld(seat));camera.lookAt(vehicle.localToWorld(ahead));
 }else{
   const overhead=view==='overhead',back=overhead?5.5:7.8,up=overhead?17:4.6,look=overhead?0:3.5;
   camera.position.set(car.x-Math.sin(car.h)*back,height+up,-car.y+Math.cos(car.h)*back);
   camera.lookAt(car.x+Math.sin(car.h)*look,height+.3,-car.y-Math.cos(car.h)*look);
 }
 cabin?.update(seated,car.v*3.6,car.steer,undefined,undefined,car.gear<0?'R':String(car.gear));
 if(seated)cabin.reflectMounted(renderer,scene,graphics.profile.mirrorMs);
 lamp.material.color.setHex(index===4&&lightGreen()?0x36e865:0xff3f25);
 renderer.render(scene,camera);
 if(now-lastHud>=100){hud();miniMap();lastHud=now;}
 requestAnimationFrame(frame);
}
const controls={q:'left',e:'right',b:'belt',h:'hazard',g:'shift',r:'reverse'};
const nextView={chase:'cockpit',cockpit:'overhead',overhead:'chase'};
const viewName={chase:'Sau xe',cockpit:'Trong xe',overhead:'Toàn cảnh'};
function showCamera(){
 const button=$('camera'),next=nextView[view];
 button.textContent=viewName[next];button.dataset.view=view;button.dataset.nextView=next;
 button.title='Đang xem: '+viewName[view]+'. Chuyển sang '+viewName[next]+' (C)';
 button.setAttribute('aria-label',button.title);button.setAttribute('aria-keyshortcuts','C');
}
function changeCamera(){view=nextView[view];if(view!=='overhead')DriveView.select(view);showCamera();}
showCamera();
addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,textarea,select,[contenteditable=true],dialog'))return;
 const key=e.key.toLowerCase();
 if(['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d'].includes(key)){e.preventDefault();input.add(key);}
 if(!e.repeat&&controls[key])action(controls[key]);if(!e.repeat&&key==='c')changeCamera();
});
addEventListener('keyup',e=>input.delete(e.key.toLowerCase()));addEventListener('blur',()=>input.clear());
for(const b of document.querySelectorAll('[data-act]'))b.onclick=()=>action(b.dataset.act);
$('go').onclick=start;$('again').onclick=()=>scenario(exam?0:Number(pick.value));
pick.onchange=()=>scenario(Number(pick.value));$('camera').onclick=changeCamera;
const requested=Number(opts.get('lesson'));
scenario(exam||!Number.isInteger(requested)?0:clamp(requested,0,11));requestAnimationFrame(frame);
