'use strict';
const el = id => document.getElementById(id);
const clamp = (value,min,max) => Math.min(max,Math.max(min,value));
const keys = createDriveInput();
let course=courses[0], route=[], landmarks=[];
let leftSignal=false, damage=0, collisions=0;
const impactLog=[];
const stages = [...document.querySelectorAll('#stages li')];
let mode='ready', speed=0, distance=0, lateral=2, elapsed=0, steering=0;
let stage=0, rightSignal=false, green=false, wait=0, lastFrame=performance.now();
let quizPoints=0, parked=false, stopped=false, crossingTime=0;
const faults=new Set();
const decisions = [];
let continuous = false;
let routeQuestions = [];
function selectCourse(id){
  course=courses.find(item=>item.id===id) || courses[0];
  window.activeCourse=course;
  const {finish,crossing,limit,sign}=course;
  const works=course.id==='works';
  const actions=[
    works?'Phía trước là rào chắn ở làn phải. Quan sát xe bên trái trước khi nhập làn.':'Giữ xe trong làn bên phải và quan sát người hai bên đường.',
    works?'Bật xi nhan trái (Q), chuyển sang làn trong trước rào chắn ở mốc 42 m.':'Nhìn biển tốc độ bên phải. Từ biển này giữ tốc độ không vượt '+limit+' km/h.',
    'Dừng trước vạch. Chờ người đi bộ sang hết và đèn xanh mới đi.',
    works?'Đi hết đoạn thi công trong phần đường bên phải, giữ khoảng cách và không vượt tốc độ.':'Bật xi nhan phải (E), quan sát rồi phanh dừng sát lề ở đoạn '+(finish-15)+'–'+(finish+5)+' m.'
  ];
  const trigger=[0,Math.max(5,sign-12),crossing-24,finish-45];
  route=course.questions.map((questions,i)=>({at:trigger[i],questions,action:actions[i]}));
  landmarks=[[course.startX,.1,10,'Giữ làn'],works?[4.8,1,42,'Làn bị thu hẹp']:[7.8,2.4,sign,'Biển tốc độ'],[3.5,.05,crossing+1,'Vạch dừng'],[works?2:6.9,.1,finish-4,works?'Hết công trường':'Vùng dừng xe']];
  stages.forEach((node,i)=>{node.querySelector('b').textContent=course.titles[i];node.querySelector('small').textContent=course.tips[i];});
  el('courseSelect').querySelector('[value="'+course.id+'"]').checked=true;el('coverName').textContent=course.name;el('locationName').textContent=course.name.toLocaleUpperCase('vi');
  el('routeTitle').textContent=course.title;el('coverLength').textContent=finish+' mét';el('routeLength').textContent=finish;
  el('travel').max=finish;lastMapState='';mode='ready';speed=distance=elapsed=stage=damage=collisions=0;lateral=course.startX;
  wait=crossingTime=steering=0;green=rightSignal=leftSignal=stopped=parked=false;keys.clear();
  el('damage').hidden=el('incident').hidden=el('exitRun').hidden=el('askCoach').hidden=true;
  el('courseSelect').disabled=el('lessonMode').disabled=false;
  el('start').textContent='Bắt đầu lái →';el('hint').textContent='Sẵn sàng xuất phát';document.title='Vi vu đất Việt · '+course.name;
  window.resetDriveTyres?.();window.clearWindscreen?.();window.clearDriveImpact?.();window.setDriveCourse?.(course);refreshStages();drawMap();
}
function traffic(){return [...(window.getDriveObstacles?.() || []), ...(window.courseObstacles?.() || [])];}
const impactNames={person:'người đi bộ',bike:'xe máy',car:'ô tô',barrier:'rào chắn',curb:'bó vỉa'};
function crash(hit,previous){
  const {other,relative,fraction}=hit;
  const target=other.type==='bike'?{bike:true}:other.type==='car'?{kind:'sedan'}:other.type==='person'?{kind:'person'}:null;
  const normal=hit.nx===undefined?{nx:-Math.sign(lateral),nz:0,depth:0,kind:'curb'}:hit;
  const body={x:lateral,z:-distance,yaw:0};DriveBody.reset(body);
  body.vx=hit.vx??Math.sign(lateral)*relative/3.6;body.vz=hit.vz??-speed/3.6;
  const event=DriveBody.resolve(body,normal,other.velocityX||0,-(other.velocity||0),target);
  const force=event.strength;
  if(other.type==='bike'||other.type==='car')window.strikeStreetTraffic?.(other,normal,event,lateral,2.1-distance);
  const direction=Math.sign(other.x-lateral) || 1;
  // Stop at first contact rather than advancing through the obstacle.
  distance=previous.d+(distance-previous.d)*Math.max(0,fraction-.015);
  lateral=previous.x+(lateral-previous.x)*Math.max(0,fraction-.015);
  const loss=event.damage;
  damage=Math.min(100,damage+loss);collisions++;
  impactLog.push(Math.round(distance)+' m · '+(impactNames[other.type] || 'chướng ngại vật'));
  window.showDriveImpact?.({x:lateral+direction*.77,distance:distance-.28,intensity:force,type:other.type,direction});
  driveAudio.impact(force,other.type);
  speed=0;keys.clear();mode='incident';el('incident').hidden=false;
  const title='Va chạm với '+(impactNames[other.type] || 'chướng ngại vật');
  el('incidentTitle').textContent=title;
  el('incidentDetails').textContent='Mốc '+Math.round(distance)+' m · tốc độ tiếp xúc tương đối '+Math.round(relative)+' km/h. '+(other.type==='person'?'Hãy dừng trước lối sang đường và nhường người qua hết.':other.type==='curb'?'Giảm tốc và chỉnh lái sớm khi đến gần lề.':'Giảm tốc, quan sát khoảng trống trước khi đánh lái.');
  el('damage').hidden=false;el('damage').textContent='Va chạm '+collisions+' · hư hại '+damage+'%';
  el('incidentDetails').textContent+=' Năng lượng va chạm '+(event.energy/1000).toLocaleString('vi-VN',{maximumFractionDigits:1})+' kJ.';
  el('recover').textContent=damage>=100?'Sửa xe và tập tiếp':'Luyện tiếp từ vị trí an toàn';el('recover').focus({preventScroll:true});
}
function recover(){
  if(mode!=='incident')return;
  const objects=traffic();
  // Pick a free spot behind the incident, remaining on the correct side.
  let free;
  for(let back=4;back<70 && !free;back+=3){
    for(const x of [2,3,5.9]){
      const point={x,d:Math.max(0,distance-back)};
      if(!firstRoadContact(point,point,.05,objects)){free=point;break;}
    }
  }
  if(!free){selectCourse(course.id);return;}
  distance=free.d;lateral=free.x;speed=steering=0;keys.clear();mode='driving';
  if(distance<course.crossing){crossingTime=wait=0;stopped=green=false;}
  if(damage>=100){window.clearWindscreen?.();damage=0;el('damage').textContent='Đã sửa xe · '+collisions+' lần va chạm';}
  el('incident').hidden=true;el('exitRun').hidden=true;lastFrame=performance.now();
  toastText='Đã đặt xe vào vị trí an toàn · quan sát trước khi đi tiếp';toastUntil=elapsed+3;
}
let toastUntil = 0, toastText = '';
function noteFault(message) {
  if (faults.has(message)) return;
  faults.add(message);
  toastText = message;
  toastUntil = elapsed + 3;
}
function toggleSound() {
  const enabled = driveAudio.toggle();
  el('audio').setAttribute('aria-pressed', String(enabled));
  el('audio').textContent = enabled ? 'Âm thanh bật' : 'Âm thanh tắt';
}
function label(node,text){if(node.textContent!==text)node.textContent=text;}
function roadMarker(){
  const marker = el('target');
  const target = landmarks[stage-1];
  if (!target || !['question','driving'].includes(mode) || target[2]<distance+1) {
    marker.hidden = true;return;
  }
  const point = window.projectDriveTarget?.(...target.slice(0,3));
  marker.hidden = !point?.visible || point.x<.1 || point.x>.9 || point.y<.18 || point.y>.85;
  if (marker.hidden) return;
  marker.style.left=(point.x*100)+'%';marker.style.top=(point.y*100)+'%';
  label(marker.firstElementChild,target[3]+' · '+Math.round(target[2]-distance)+' m');
}
function records(){
  try{const list=JSON.parse(localStorage.getItem('taylai.drives'));return Array.isArray(list)?list.filter(Number.isFinite):[];}catch{return [];}
}
function report(title,body){
  el('reviewDrive').hidden=el('nextCourse').hidden=true;
  el('rt').textContent=title;el('rb').textContent=body;
  (document.fullscreenElement || document.body).append(el('report'));
  el('report').showModal();
}
function refreshStages(){
  stages.forEach((node,i)=>{node.classList.toggle('current',i===stage-1);node.classList.toggle('done',i<stage-1 || mode==='done');});
}
function pause(){
  keys.clear();
  if(mode!=='driving')return;
  mode='paused';el('exitRun').hidden=false;el('start').textContent='Tiếp tục lái';el('hint').textContent='Đang tạm dừng';
}
function checkpoint(){
  const task=route[stage++];
  refreshStages();
  const question=task.questions[records().length % task.questions.length];
  routeQuestions.push(question);
  if(continuous){
    el('askCoach').hidden=false;
    toastText=task.action;toastUntil=elapsed+3;
    return;
  }
  consult();
}
function consult(){
  const task=route[stage-1], question=routeQuestions[stage-1];
  if (!task || mode!=='driving') return;
  mode='question';keys.clear();
  el('hint').textContent='Quan sát · '+stages[stage-1].querySelector('b').textContent;
  el('askCoach').hidden=true;
  openRoadQuestion(question, task.action, correct=>{
    if(correct)quizPoints+=10;
    decisions.push({question,correct});
    toastText=task.action;toastUntil=elapsed+2.5;
    if (!document.fullscreenElement && matchMedia('(max-width:820px)').matches) el('road').scrollIntoView({block:'center'});
    mode='driving';lastFrame=performance.now();keys.clear();
  });
}
function start(){
  if(mode==='question'||mode==='incident')return;
  if(mode==='driving')return pause();
  if(!window.renderDrive || window.driveBank?.length!==600) {
    report('Chưa tải đủ dữ liệu','Hãy tải lại trang và kiểm tra WebGL trên trình duyệt.');return;
  }
  if(mode!=='paused'){
    stage=speed=distance=elapsed=wait=steering=quizPoints=crossingTime=0;
    continuous=document.querySelector('#lessonMode input:checked').value==='flow';
    el('lessonMode').disabled=el('courseSelect').disabled=true;collisions=damage=0;impactLog.length=0;el('damage').hidden=true;
    window.resetDriveTyres?.();window.clearWindscreen?.();window.clearDriveImpact?.();
    routeQuestions=[];decisions.length=0;toastUntil=0;rightSignal=leftSignal=green=parked=stopped=false;lateral=course.startX;faults.clear();
    el('blinkMobile').setAttribute('aria-pressed','false');el('blinkLeft').setAttribute('aria-pressed','false');
  }
  el('exitRun').hidden=true;mode='driving';el('start').textContent='Ⅱ  Tạm dừng';
  if(stage===0){el('road').scrollIntoView({block:'center'});checkpoint();}
}
function finish(){
  mode='done';speed=0;keys.clear();refreshStages();
  if(course.id!=='works' && !parked)faults.add('Bật xi nhan, dừng hẳn ở đoạn cuối và đưa bánh phải cách lề tối đa 0,25 m.');
  const practice=Math.max(0,60-faults.size*15-collisions*10);
  const score=continuous?Math.round(practice/60*100):quizPoints+practice;
  el('lessonMode').disabled=el('courseSelect').disabled=false;el('askCoach').hidden=true;
  const list=records();list.push(score);
  try{localStorage.setItem('taylai.drives',JSON.stringify(list.slice(-100)));}catch{}
  el('start').textContent='Lái lại tuyến';el('hint').textContent='Đã kết thúc · '+score+'/100';
  const answers=decisions.map(d=>(d.correct?'✓ ':'× ')+stages[routeQuestions.indexOf(d.question)].querySelector('b').textContent+' · câu '+d.question).join('\n');
  const theory=continuous?'Lái liên tục · chấm theo thao tác'+(answers?'\nĐã ôn trên đường\n'+answers:''):'Nhận diện tình huống · '+quizPoints+'/40\n'+answers;
  report('Kết quả · '+score+'/100',course.name+' · '+course.finish+' m\n'+theory+'\n\nThao tác lái · '+practice+'/60\n'+(faults.size?'Luyện lại\n'+[...faults].join('\n'):'Đã hoàn thành các thao tác của tuyến.')+(collisions?'\nVa chạm ('+collisions+')\n'+impactLog.join('\n'):''));
  el('reviewDrive').hidden=el('nextCourse').hidden=false;
}
function signal(side){
  if(mode!=='driving')return;
  if(side==='left'){leftSignal=!leftSignal;rightSignal=false;}
  else {rightSignal=!rightSignal;leftSignal=false;}
  el('blinkMobile').setAttribute('aria-pressed',String(rightSignal));
  el('blinkLeft').setAttribute('aria-pressed',String(leftSignal));
}
function drive(dt){
  const down=(...codes)=>codes.some(code=>keys.has(code));
  const brake=down('s','arrowdown',' '),gas=down('w','arrowup');
  speed=clamp(speed+dt*(brake?-22:gas?9-speed*.055:-1.9-speed*.02),0,68);
  const target=Number(down('d','arrowright'))-Number(down('a','arrowleft'));
  steering+=(target-steering)*Math.min(1,dt*7);
  const {limit,crossing,finish:end,sign}=course;
  const works=course.id==='works';
  const oldX=lateral;
  lateral+=steering*Math.min(speed*.14,2.9)*dt;
  const before=distance;distance+=speed/3.6*dt;
  const previous={x:oldX,d:before}, next={x:lateral,d:distance};
  const contact=firstRoadContact(previous,next,dt,traffic());
  if(contact){crash(contact,previous);return;}
  if(brake && speed>18)window.markDriveTyres?.(previous,next);
  if(Math.abs(lateral)>7.06){
    // A crawl into the kerb stops the wheels. A fast side strike triggers recovery.
    const sideSpeed=Math.abs(lateral-oldX)/dt*3.6;
    lateral=Math.sign(lateral)*7.06;
    if(sideSpeed>3.5){crash({other:{type:'curb',x:Math.sign(lateral)*8},relative:sideSpeed,fraction:1},previous);return;}
    speed=Math.min(speed,3);
  }
  if(lateral<.9)noteFault('Giữ toàn bộ xe bên phải vạch tim đường.');
  if(distance>=sign && speed>limit+.05)noteFault('Tuân thủ giới hạn '+limit+' km/h từ vị trí đặt biển.');
  if(oldX<=4 && lateral>4 && !rightSignal)noteFault('Bật tín hiệu trước khi chuyển sang làn phải.');
  if(oldX>=4 && lateral<4 && !leftSignal)noteFault('Bật tín hiệu trước khi chuyển sang làn trái.');
  if(works && distance>=42 && distance<=100 && lateral>4.05)noteFault('Qua công trường bằng làn trong còn mở.');
  if(distance>=crossing-14 && distance<crossing && speed<.1)stopped=true;
  if(stopped || distance>=crossing)wait+=dt;
  if(distance>=crossing-40)crossingTime+=dt;
  green=crossingTime>=14.5 || (wait>=3.5 && crossingTime>=10.6);
  if(before<crossing && distance>=crossing && !green)noteFault('Dừng trước vạch khi đèn đỏ và nhường người đi bộ.');
  if(stage<route.length && distance>=route[stage].at){checkpoint();return;}
  const curbGap=Math.max(0,8-lateral-.98);
  parked=distance>=end-15 && distance<=end+5 && speed===0 && rightSignal && curbGap<=.25;
  if((works && distance>=end) || (!works && (parked || distance>end+5))){finish();return;}
  const remain=Math.ceil(crossing-distance);
  let hint='Giữ làn bên phải · nhấn ↑ để tăng ga';
  if(stage>=2)hint=works && distance<100?'Làn phải bị chặn · báo trái (Q) và đi làn trong':'Biển giới hạn '+limit+' km/h · giữ đều ga';
  if(stage===3)hint=green?'Đèn xanh · quan sát trước khi qua vạch':stopped?'Giữ phanh · chờ đèn xanh':'Đèn đỏ · vạch dừng cách '+Math.max(0,remain)+' m';
  if(stage===4)hint=works?'Tiếp tục qua mốc hết công trường · còn '+Math.max(0,Math.ceil(end-distance))+' m':(rightSignal?'Xi nhan phải bật':'Bật xi nhan phải (E)')+' · cách lề '+curbGap.toFixed(2)+' m · '+(distance<end-15?'đến vùng dừng '+Math.ceil(end-15-distance)+' m':'phanh dừng sát lề');
  if(speed>limit+.05 && distance>=sign)hint='Quá '+limit+' km/h · nhả ga và giảm tốc';
  if(lateral<.9)hint='Xe đang lấn sang chiều ngược lại';
  label(el('hint'), toastUntil>elapsed ? toastText : hint);
}
const map=el('map').getContext('2d');
let lastMapState='';
function drawMap(){
  const position=Math.min(course.finish,Math.round(distance));
  const lane=Math.round(lateral);
  const state=course.id+'/'+position+'/'+lane+'/'+stage;
  if(state===lastMapState)return;
  lastMapState=state;
  map.fillStyle='#20332b';map.fillRect(0,0,132,90);
  map.fillStyle='#31453a';
  for(let x=4;x<125;x+=24){
    for(let y=3;y<86;y+=16)map.fillRect(x,y,19,11);
  }
  // Same northbound road, junction and right-hand parking bay as the 3D route.
  map.fillStyle='#58665d';map.fillRect(49,0,19,90);map.fillRect(0,82-course.crossing/course.finish*71,132,7);
  if(course.id==='works'){
    map.fillStyle='#e9a15b';
    for(let d=42;d<100;d+=9)map.fillRect(65,82-d/course.finish*71,3,2);
  }else{
    map.fillStyle='#899d86';map.fillRect(67,8,4,10);
  }
  map.strokeStyle='#c8e97a';map.lineWidth=2.5;
  map.beginPath();map.moveTo(course.id==='works'?65:61,82);map.lineTo(61,74);map.lineTo(61,26);map.lineTo(course.id==='works'?61:66,11);map.stroke();
  const x=58+lane, y=82-position/course.finish*71;
  map.fillStyle='#fff';map.beginPath();map.moveTo(x,y-6);map.lineTo(x+4.7,y+4.5);map.lineTo(x,y+2.5);map.lineTo(x-4.7,y+4.5);map.fill();
  window.refreshDriveMap?.();
  label(el('remaining'),(course.finish-position)+' m đến đích');
  el('travel').value=position;
  label(el('metres'),position+' / '+course.finish+' m');
}
function frame(now){
  const dt=clamp((now-lastFrame)/1000,0,.1);lastFrame=now;
  if(mode==='driving' || mode==='ready')elapsed+=dt;
  if(mode==='driving')drive(dt);
  if(document.body.dataset.mode!==mode){
    document.body.dataset.mode=mode;
    for(const id of ['theory','lesson','history','fullStart','start'])el(id).disabled=mode==='question'||mode==='incident';
    el('askCoach').disabled=mode!=='driving';
  }
  window.renderDrive?.(distance,lateral,elapsed,green,steering,speed,mode,now);
  roadMarker();
  el('turn').hidden=(!rightSignal && !leftSignal) || mode==='done';label(el('turn'),leftSignal?'⬅':'➜');
  label(el('speed'),String(Math.round(speed)).padStart(2,'0'));
  driveAudio.update({speed,throttle:keys.has('arrowup')||keys.has('w'),braking:keys.has('arrowdown')||keys.has('s')||keys.has(' '),signal:rightSignal||leftSignal,mode});
  label(el('fullStart'),el('start').textContent);
  drawMap();requestAnimationFrame(frame);
}
function camera(){if(window.toggleDriveCamera){const inside=toggleDriveCamera();el('camera').textContent=inside?'Góc tài xế':'Góc sau xe';el('impactGlass').hidden=!inside;}}
el('courseSelect').onchange=e=>selectCourse(e.target.value);
el('leaveCourse').onclick=el('exitRun').onclick=()=>selectCourse(course.id);
el('nextCourse').onclick=()=>{el('report').close();selectCourse(courses[(courses.indexOf(course)+1)%courses.length].id);};
el('recover').onclick=recover;
el('reviewDrive').onclick=()=>{el('report').close();openRouteReview(routeQuestions);};
el('askCoach').onclick=consult;
el('audio').textContent=driveAudio.enabled?'Âm thanh bật':'Âm thanh tắt';el('audio').setAttribute('aria-pressed',String(driveAudio.enabled));
el('camera').onclick=camera;el('audio').onclick=toggleSound;el('blinkMobile').onclick=()=>signal('right');el('blinkLeft').onclick=()=>signal('left');el('start').onclick=el('fullStart').onclick=el('mobileStart').onclick=start;
el('theory').onclick=el('lesson').onclick=()=>{pause();openQuiz();};
el('driveNav').onclick=()=>el('road').scrollIntoView({block:'center',behavior:'smooth'});
el('history').onclick=()=>{if(mode==='question')return;pause();const list=records();report('Thành tích bài lái',list.length?list.length+' lượt · Cao nhất '+Math.max(...list)+'/100 · Gần nhất '+list.at(-1)+'/100':'Hoàn thành tuyến phố để lưu điểm đầu tiên.');};
el('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await el('road').parentElement.requestFullscreen();}catch{el('hint').textContent='Trình duyệt chưa hỗ trợ chế độ toàn màn hình.';}};
addEventListener('blur',pause);
addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]'))return;
  const k=e.key.toLowerCase();
  if(!e.repeat){if(k==='p'&&['driving','paused'].includes(mode))start();if(k==='c')camera();if(k==='e')signal('right');if(k==='q')signal('left');}
  if(mode==='driving'&&['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' '].includes(k)){e.preventDefault();keys.add(k);}
});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
selectCourse('city');
requestAnimationFrame(frame);
