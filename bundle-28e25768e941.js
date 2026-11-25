'use strict';
// guardrail-clearance.js
'use strict';

// Road footprints are capsules. Test the whole proposed beam, including its
// ends, against each nearby carriageway (metres in the same local frame).
function guardrailFits(ax,az,bx,bz,roads,margin,own,atLevel){
  const dx=bx-ax,dz=bz-az,length2=dx*dx+dz*dz;
  for(const r of roads){
    if(r===own)continue;
    const au=(ax-r.ax)*r.fx+(az-r.az)*r.fz,av=(az-r.az)*r.fx-(ax-r.ax)*r.fz;
    const bu=au+dx*r.fx+dz*r.fz,bv=av+dz*r.fx-dx*r.fz;
    const limit=(r.w+margin)**2;
    // Only overlapping footprints need a height lookup. The callback receives
    // metres along the other road and a fraction along the proposed beam.
    if(av*bv<0){
      const t=av/(av-bv),u=au+(bu-au)*t;
      if(u>=0&&u<=r.len&&(!atLevel||atLevel(r,u,t)))return false;
    }
    const a=Math.max(0,Math.min(r.len,au)),b=Math.max(0,Math.min(r.len,bu));
    if((au-a)**2+av*av<limit&&(!atLevel||atLevel(r,a,0)))return false;
    if((bu-b)**2+bv*bv<limit&&(!atLevel||atLevel(r,b,1)))return false;
    function endOverlaps(x,z,u){
      const t=length2?Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/length2)):0;
      return (x-ax-dx*t)**2+(z-az-dz*t)**2<limit&&(!atLevel||atLevel(r,u,t));
    }
    if(endOverlaps(r.ax,r.az,0)||endOverlaps(r.bx,r.bz,r.len))return false;
  }
  return true;
}

;
// leaderboard.js
'use strict';
function formatRaceTime(ms){
  return Math.floor(ms/60000)+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+'.'+String(ms%1000).padStart(3,'0');
}
function createLeaderboard(routeId,title,serverTimed=false){
  const world=routeId==='xuyen-viet',dialog=document.createElement('dialog');
  dialog.className='scoreBoard';dialog.setAttribute('aria-labelledby','boardTitle-'+routeId);
  dialog.innerHTML='<div class="boardHead"><h2>Bảng xếp hạng online</h2><button type="button" aria-label="Đóng bảng xếp hạng">✕</button></div><p class="boardMode"></p><p role="status"></p><ol></ol><form hidden><p class="submitNotice">Khi bạn gửi, biệt danh và thành tích có thể xuất hiện trên bảng xếp hạng công khai. <a href="privacy.html" target="_blank" rel="noopener">Quyền riêng tư</a></p><label>Biệt danh <input name="alias" required minlength="1" maxlength="24" autocomplete="off"></label><button class="hot">Gửi thành tích</button></form><button class="reloadBoard">Tải lại bảng</button>';
  dialog.querySelector('h2').id='boardTitle-'+routeId;document.body.append(dialog);
  dialog.querySelector('.boardMode').textContent=title+' · '+(world?'Quãng đường trong một lượt':serverTimed?'Thời gian hoàn thành tuyến':'Thời gian gồm giây phạt');
  const status=dialog.querySelector('[role=status]'),list=dialog.querySelector('ol'),form=dialog.querySelector('form');
  const name=form.elements.alias,submit=form.querySelector('button'),reload=dialog.querySelector('.reloadBoard');
  const format=world?m=>m.toLocaleString('vi-VN')+' m':formatRaceTime;
  let run=null,arrival=null,pending=null,lastSent=0,displayVersion=0,sending=false;
  try{name.value=localStorage.getItem('taylai.alias')||'';}catch{}
  async function api(path,data){
    const opts={signal:AbortSignal.timeout(12000),cache:'no-store'};
    if(data)Object.assign(opts,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const res=await fetch('/api/leaderboard'+path,opts);
    if(!res.ok){const body=await res.json().catch(()=>null);throw new Error(body?.error||'Chưa kết nối được bảng online.');}
    return res.json();
  }
  function start(vehicleChoice){
    pending=null;arrival=null;lastSent=0;
    run=api('/start',{route:routeId,...vehicleChoice}).then(v=>v.runId).catch(()=>null);
  }
  function arrive(){
    const current=run;
    if(!arrival)arrival=Promise.resolve(current).then(id=>id?api('/arrive',{runId:id}):null)
      .then(result=>result?.timeMs??null).catch(()=>{
        if(current===run)arrival=null;
        return null;
      });
    return arrival;
  }
  function rows(entries){
    list.replaceChildren();
    for(const item of entries){
      const row=document.createElement('li'),alias=document.createElement('span'),score=document.createElement('b');
      alias.textContent=item.name;score.textContent=format(world?item.distanceM:item.timeMs);
      row.append(alias,score);list.append(row);
    }
  }
  async function load(){
    const version=++displayVersion;status.textContent='Đang tải bảng xếp hạng…';reload.disabled=true;
    try{
      const data=await api('?route='+encodeURIComponent(routeId));
      if(version!==displayVersion)return;
      rows(data.entries);status.textContent=data.personal?'Kỷ lục của bạn: '+format(world?data.personal.distanceM:data.personal.timeMs)+' · Hạng '+data.rank:data.entries.length?'Top '+data.entries.length:'Chưa có thành tích được gửi.';
    }catch{if(version===displayVersion)status.textContent='Chưa kết nối được bảng online.';}
    finally{if(version===displayVersion)reload.disabled=false;}
  }
  async function open(score){
    if(serverTimed && Number.isFinite(score)){
      form.hidden=true;
      if(!dialog.open)dialog.showModal();
      status.textContent='Đang xác nhận thời gian về đích…';
      const official=await arrive();
      if(!dialog.open)return;
      if(official===null){
        await load();
        status.textContent+=' · Chưa xác nhận được thời gian online của lượt này.';
        return;
      }
      score=official;
    }
    pending=Number.isFinite(score)?Math.round(score):null;
    form.hidden=!pending||pending<=lastSent;
    submit.textContent=pending?'Gửi '+format(pending):'Gửi thành tích';
    if(!dialog.open)dialog.showModal();
    load();
    if(!form.hidden&&!await run){form.hidden=true;status.textContent='Lượt này chưa kết nối với bảng online từ lúc xuất phát.';++displayVersion;reload.disabled=false;}
  }
  form.onsubmit=async e=>{
    e.preventDefault();const alias=name.value.trim();if(sending||!pending||!alias){name.focus();return;}
    const score=pending;const id=await run;if(!id)return;
    ++displayVersion;sending=true;submit.disabled=true;reload.disabled=true;
    try{
      const data=await api('/finish',{runId:id,name:alias,[world?'distanceM':'timeMs']:score});
      lastSent=score;rows(data.entries);form.hidden=true;status.textContent='Đã gửi · Hạng '+data.rank;
      try{localStorage.setItem('taylai.alias',alias);}catch{}
    }catch(err){status.textContent=err instanceof TypeError||err.name==='TimeoutError'?'Chưa gửi được thành tích. Hãy kiểm tra kết nối và thử lại.':err.message;}
    finally{sending=false;submit.disabled=false;reload.disabled=false;}
  };
  reload.onclick=load;dialog.querySelector('.boardHead button').onclick=()=>dialog.close();
  return {start,arrive,open};
}

;
// driving-weather.js
'use strict';
// Current model conditions for the car's position. Coordinates come from the game map.
function createDrivingWeather(THREE,scene,sun,pavement,reference=''){
  const interval=15*60000,maxAge=2*3600000,labels=document.querySelectorAll('[data-weather]');
  const fields=['temperature_2m','weather_code','is_day','precipitation','cloud_cover'];
  const base={light:sun.intensity,fog:scene.fog.density,color:scene.fog.color.clone(),road:pavement.color.clone(),rough:pavement.roughness};
  const fogColor=new THREE.Color(),stormColor=new THREE.Color();
  const cacheKey='taylai.weather.v1';
  let cache=[];
  try{const data=JSON.parse(localStorage.getItem(cacheKey));if(Array.isArray(data))cache=data.slice(-20);}catch{}
  let point=null,due=0,request=null,current=null,lastFrame=0,opacity=0;
  const fresh=c=>c&&Number.isFinite(c.time)&&Date.now()-c.time*1000<maxAge&&c.time*1000<Date.now()+interval&&fields.every(f=>Number.isFinite(c[f]));
  function describe(c){
    const code=c.weather_code;
    if(code>=95)return 'Dông';if([71,73,75,77,85,86].includes(code))return 'Tuyết';
    if(code>=80)return 'Mưa rào';if(code>=61)return 'Mưa';if(code>=51)return 'Mưa phùn';
    if(code>=45)return 'Sương mù';if(code===3)return 'U ám';if(code>0)return 'Có mây';
    return c.is_day?'Trời quang':'Đêm quang';
  }
  const formatter=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hour12:false});
  function display(c,source){
    current=c;
    const text=c?describe(c)+' · '+Math.round(c.temperature_2m)+' °C · '+(source==='cache'?'Bản lưu ':'')+formatter.format(c.time*1000):source;
    for(const el of labels){el.textContent=(reference?reference+' · ':'')+text;el.title='Thời tiết Open-Meteo · Giờ Việt Nam';}
  }
  async function locate(lon,lat){
    const now=Date.now(),moved=!point||Math.hypot((point.lon-lon)*Math.cos(lat*Math.PI/180),point.lat-lat)>.04;
    if(!moved&&now<due)return;
    if(request)request.abort();
    point={lon,lat};due=now+interval;
    const id=Math.round(lat*25)+','+Math.round(lon*25);
    const record=cache.find(entry=>entry?.id===id&&fresh(entry.c));
    if(record&&moved&&now-record.saved<interval){display(record.c,'cache');due=record.saved+interval;request=null;return;}
    if(moved||!current||!fresh(current))display(record?.c||null,record?'cache':'Đang lấy thời tiết…');
    const controller=new AbortController();request=controller;
    const timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const params=new URLSearchParams({latitude:lat.toFixed(4),longitude:lon.toFixed(4),current:fields.join(','),timeformat:'unixtime',forecast_days:'1'});
      const res=await fetch('https://api.open-meteo.com/v1/forecast?'+params,{signal:controller.signal});
      if(!res.ok)throw Error();
      const c=(await res.json()).current;if(!fresh(c))throw Error();
      if(request!==controller)return;
      cache=cache.filter(v=>v?.id!==id&&fresh(v?.c)).slice(-19);cache.push({id,c,saved:Date.now()});
      try{localStorage.setItem(cacheKey,JSON.stringify(cache));}catch{}
      display(c,Date.now()-c.time*1000>2*interval?'cache':'live');
    }catch{
      if(request!==controller)return;
      const fallback=fresh(record?.c)?record.c:(!moved&&fresh(current)?current:null);
      display(fallback,fallback?'cache':'Chưa có dữ liệu thời tiết');
      due=Date.now()+60000;
    }finally{clearTimeout(timeout);if(request===controller)request=null;}
  }
  const count=matchMedia('(pointer:coarse)').matches?220:460;
  const vertices=new Float32Array(count*6),seeds=Float32Array.from({length:count*3},()=>Math.random());
  const geom=new THREE.BufferGeometry(),positions=new THREE.BufferAttribute(vertices,3);
  positions.setUsage(THREE.DynamicDrawUsage);geom.setAttribute('position',positions);
  const mat=new THREE.LineBasicMaterial({color:0xc4d5df,transparent:true,depthWrite:false});
  const drops=new THREE.LineSegments(geom,mat);drops.frustumCulled=false;drops.visible=false;scene.add(drops);
  const dawnHaze=new THREE.Color(0xe6c9a4);
  function render(camera,now,dawn=0,worldLighting,sheltered=false){
    const mix=1-Math.exp(-Math.min(.2,(now-lastFrame)/1000)*2);lastFrame=now;
    const c=current,code=c?.weather_code||0,night=c&&c.is_day===0;
    const wet=c?(1-dawn)*Math.min(1,Math.max(c.precipitation*1.8,code>=51?.24:0)):0;
    const cloud=(c?.cloud_cover||0)/100*(1-dawn),fog=(code===45||code===48)?1-dawn:0;
    if(worldLighting){
      worldLighting(dawn,cloud,wet,fog,mix);
    }else{
      sun.intensity+=(base.light*(night?.13+.87*dawn:1-.65*cloud)-sun.intensity)*mix;
      scene.backgroundIntensity+=((night?.09+.91*dawn:1-.46*cloud)-scene.backgroundIntensity)*mix;
      scene.fog.density+=(Math.max(base.fog+dawn*.00036,.012*fog,wet*.004+cloud*.0005)-scene.fog.density)*mix;
      fogColor.copy(base.color).lerp(stormColor.setHex(night?0x374650:0xa0acb1),night?.95:Math.max(cloud,wet,fog)).lerp(dawnHaze,dawn);scene.fog.color.lerp(fogColor,mix);
      pavement.roughness+=(base.rough*(1-.58*wet)-pavement.roughness)*mix;
      pavement.color.lerp(fogColor.copy(base.road).multiplyScalar(1-.36*wet),mix);
    }
    opacity+=(wet-opacity)*mix;drops.visible=!sheltered&&opacity>.015;if(!drops.visible)return;
    const n=Math.ceil(count*opacity),snow=[71,73,75,77,85,86].includes(code);
    geom.setDrawRange(0,n*2);mat.opacity=.22+opacity*.42;drops.position.copy(camera.position);
    const wrap=(v,size)=>v-size*Math.floor(v/size);
    const t=now*.001;
    for(let i=0;i<n;i++){
      const k=i*3,j=i*6,x=wrap(seeds[k]*42+t-camera.position.x,42)-21;
      const y=wrap(seeds[k+1]*19-t*(snow?2:15)-camera.position.y,19)-8;
      const z=wrap(seeds[k+2]*42-camera.position.z,42)-21;
      vertices[j]=x;vertices[j+1]=y;vertices[j+2]=z;
      vertices[j+3]=x+.025;vertices[j+4]=y-(snow?.05:.6);vertices[j+5]=z;
    }
    positions.needsUpdate=true;
  }
  return {locate,render,get rainfall(){return opacity;}};
}

;
// cockpit-settings.js
'use strict';

// Apply the same player preferences before either arcade mode starts rendering.
(() => {
  const storageKey = 'taylai.cockpit.v1';
  const groups = [
    {key:'graphics', title:'Chất lượng đồ họa', options:[['auto','Tự động'], ['low','Thấp'], ['medium','Vừa'], ['high','Cao']], initial:'auto'},
    {key:'mapSize', title:'Cỡ bản đồ nhỏ', options:[['small','Gọn'], ['standard','Chuẩn'], ['large','Rộng']], initial:'standard'},
    {key:'mapSide', title:'Vị trí bản đồ', device:'keyboard', options:[['left','Bên trái'], ['right','Bên phải']], initial:'left'},
    {key:'steering', title:'Tay đánh lái', device:'touch', options:[['left','Tay trái'], ['right','Tay phải']], initial:'left'},
    {key:'buttonSize', title:'Cỡ nút cảm ứng', device:'touch', options:[['standard','Chuẩn'], ['large','Lớn']], initial:'standard'}
  ];
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
  const settings = {};
  for (const group of groups) {
    const selected = group.options.some(([value]) => value === saved?.[group.key]) ? saved[group.key] : group.initial;
    settings[group.key] = document.body.dataset[group.key] = selected;
  }
  // The exam hall can change this preference while a lesson is open in its iframe.
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    let next;
    try { next = JSON.parse(event.newValue); } catch { return; }
    for (const group of groups) {
      const value = group.options.some(([id]) => id === next?.[group.key]) ? next[group.key] : group.initial;
      settings[group.key] = document.body.dataset[group.key] = value;
      const radio = document.querySelector('#cockpitSettings input[name="' + group.key + '"][value="' + value + '"]');
      if (radio) radio.checked = true;
    }
  });
  const buttons = document.querySelectorAll('[data-cockpit-settings]');
  if (!buttons.length) return;
  const dialog = document.createElement('dialog');
  dialog.id = 'cockpitSettings';
  dialog.setAttribute('aria-labelledby', 'cockpitTitle');
  dialog.innerHTML = '<form method="dialog"><h2 id="cockpitTitle">Bố trí buồng lái</h2><button class="settingsDone" value="close">Xong</button></form>';
  const form = dialog.firstElementChild;
  for (const group of groups) {
    const field = document.createElement('fieldset');
    if (group.device) field.dataset.device = group.device;
    const legend = document.createElement('legend');
    legend.textContent = group.title;
    field.append(legend);
    for (const [value, text] of group.options) {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = group.key;
      radio.value = value;
      radio.checked = value === settings[group.key];
      label.append(radio, text);
      field.append(label);
    }
    form.insertBefore(field, form.lastElementChild);
  }
  form.addEventListener('change', ({target}) => {
    if (target.type !== 'radio') return;
    settings[target.name] = document.body.dataset[target.name] = target.value;
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch {}
  });
  document.body.append(dialog);
  for (const button of buttons) {
    button.addEventListener('click', () => dialog.showModal());
  }
})();

;
// vehicle-look.js
'use strict';

function createVehicleLook(button, canvas, canLook) {
  const view = {yaw:0, pitch:0};
  let pointer = null, armed = false, idle = 0, usedCanvas = false;
  const arrows = new Set();
  function arm(value) {
    armed = value;
    button.setAttribute('aria-pressed', String(value));
    canvas.classList.toggle('looking', value);
    idle = 5;
  }
  function end() {
    const contact = pointer;
    pointer = null;
    if (contact?.surface.hasPointerCapture(contact.id)) contact.surface.releasePointerCapture(contact.id);
    arrows.clear();
    if (armed) arm(false);
  }
  for (const surface of [button, canvas]) {
    surface.addEventListener('pointerdown', e => {
      if (surface === canvas) usedCanvas = armed;
      if (!canLook() || pointer || e.button !== 0 || (surface === canvas && !armed)) return;
      e.preventDefault();
      surface.setPointerCapture(e.pointerId);
      pointer = {id:e.pointerId, surface, x:e.clientX, y:e.clientY, yaw:view.yaw, pitch:view.pitch, moved:false, wasArmed:armed};
      arm(true);
    });
    surface.addEventListener('pointermove', e => {
      if (pointer?.id !== e.pointerId) return;
      const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
      if (!pointer.moved && Math.hypot(dx, dy) < 4) return;
      pointer.moved = true;
      view.yaw = Math.max(-Math.PI, Math.min(Math.PI, pointer.yaw + dx * Math.PI / Math.min(240, canvas.clientWidth * .27)));
      view.pitch = Math.max(-.75, Math.min(1.25, pointer.pitch - dy * 1.25 / Math.min(140, canvas.clientHeight * .27)));
    });
    surface.addEventListener('pointerup', e => {
      if (pointer?.id !== e.pointerId) return;
      const tapToArm = surface === button && !pointer.moved && !pointer.wasArmed;
      end();
      if (tapToArm) arm(true);
    });
    for (const type of ['pointercancel', 'lostpointercapture']) {
      surface.addEventListener(type, e => { if (pointer?.id === e.pointerId) end(); });
    }
  }
  canvas.addEventListener('click', e => {
    if (usedCanvas) { usedCanvas = false; e.stopImmediatePropagation(); }
  }, true);
  button.addEventListener('click', e => {
    if (e.detail === 0 && canLook()) arm(!armed); // Keyboard or assistive technology.
  });
  button.addEventListener('keydown', e => {
    if (!canLook()) return;
    if (e.key.startsWith('Arrow')) {
      e.preventDefault(); e.stopPropagation(); arrows.add(e.key); arm(true);
    } else if (e.key === 'Escape') end();
    else if (e.key === ' ') e.stopPropagation();
  });
  button.addEventListener('keyup', e => {
    if (arrows.delete(e.key) && !arrows.size) end();
  });
  button.addEventListener('blur', end);
  button.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('blur', end);
  document.addEventListener('visibilitychange', () => { if (document.hidden) end(); });
  return {
    view,
    update(dt) {
      if (!canLook()) { end(); view.yaw = view.pitch = 0; return; }
      if (arrows.size) {
        const horizontal = Number(arrows.has('ArrowRight')) - Number(arrows.has('ArrowLeft'));
        const vertical = Number(arrows.has('ArrowUp')) - Number(arrows.has('ArrowDown'));
        view.yaw = Math.max(-Math.PI, Math.min(Math.PI, view.yaw + dt * 2.3 * horizontal));
        view.pitch = Math.max(-.75, Math.min(1.25, view.pitch + dt * 1.6 * vertical));
      } else if (!pointer) {
        if (armed && (idle -= dt) <= 0) end();
        const decay = Math.exp(-dt * 9);
        view.yaw = Math.abs(view.yaw) < .001 ? 0 : view.yaw * decay;
        view.pitch = Math.abs(view.pitch) < .001 ? 0 : view.pitch * decay;
      }
    }
  };
}

;
// drive-input.js
'use strict';
// The trip setup and all driving modes share the last camera the driver chose.
globalThis.DriveView = (() => {
  const key = 'vivudatviet.driverView';
  const valid = view => view === 'cockpit' || view === 'chase';
  let last;
  function current(fallback = 'chase') {
    const requested = new URLSearchParams(globalThis.location?.search).get('camera');
    if (valid(requested)) return requested;
    try { last = localStorage.getItem(key) || last; } catch {}
    return valid(last) ? last : fallback;
  }
  function select(view) {
    if (!valid(view)) return;
    last = view;
    try { localStorage.setItem(key, view); } catch {}
    const url = new URL(location.href);
    if (url.searchParams.has('camera') && url.searchParams.get('camera') !== view) {
      url.searchParams.set('camera', view);
      history.replaceState(history.state, '', url);
    }
  }
  return {current, select};
})();

function updateDriveViewButton(button, inside) {
  button.dataset.nextView = inside ? 'chase' : 'cockpit';
  button.textContent = inside ? 'Sau xe' : 'Trong xe';
  button.dataset.view = inside ? 'cockpit' : 'chase';
  button.title = inside ? 'Chuyển sang góc nhìn sau xe (C)' : 'Chuyển sang góc nhìn người lái (C)';
  button.setAttribute('aria-keyshortcuts', 'C');
  button.setAttribute('aria-label', button.title);
}

// Keyboard and individual contacts own their input independently on hybrid devices.
function createDriveInput() {
  const keyboard = new Set(), contacts = new Map(), active = new Set();
  function setContact(id, button) {
    const previous = contacts.get(id);
    if (previous === button) return;
    if (button) contacts.set(id, button);
    else contacts.delete(id);
    const pressed = new Set(contacts.values());
    if (previous && !pressed.has(previous)) previous.classList.remove('active');
    if (button) button.classList.add('active');
    active.clear();
    for (const control of pressed) {
      for (const key of control.dataset.key.split(' ')) active.add(key);
    }
  }
  function clear() {
    keyboard.clear();
    for (const id of contacts.keys()) setContact(id);
  }
  for (const button of document.querySelectorAll('[data-key]')) {
    button.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      setContact(event.pointerId, button);
    });
    if (button.hasAttribute('data-slide-pedal')) {
      button.addEventListener('pointermove', event => {
        if (!contacts.has(event.pointerId)) return;
        // Capture keeps the release reliable. Hit-test the thumb as it crosses pedals.
        const pedal = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-slide-pedal]');
        if (pedal) setContact(event.pointerId, pedal);
      });
    }
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(type, event => setContact(event.pointerId));
    }
    button.addEventListener('contextmenu', event => event.preventDefault());
  }
  window.addEventListener('blur', clear);
  window.addEventListener('pagehide', clear);
  matchMedia('(orientation: landscape)').addEventListener('change', clear);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  return {has: key => keyboard.has(key) || active.has(key), add: key => keyboard.add(key), delete: key => keyboard.delete(key), clear};
}

;
// driving-renderer.js
'use strict';

const DrivingRenderer = (() => {
  let renderer;

  function unavailable(networkError=false) {
    if (document.getElementById('graphicsUnavailable')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'graphicsUnavailable';
    dialog.setAttribute('aria-labelledby', 'graphicsTitle');
    dialog.setAttribute('aria-describedby', 'graphicsHelp');
    const title = document.createElement('h2');
    title.id = 'graphicsTitle';
    title.textContent = networkError ? 'Chưa tải đủ trò chơi' : 'Chưa mở được cảnh lái 3D';
    const help = document.createElement('p');
    help.id = 'graphicsHelp';
    help.textContent = networkError ? 'Hãy kiểm tra kết nối rồi tải lại trang để bắt đầu lái.' :
      'Trình duyệt chưa tạo được cảnh WebGL. Bạn có thể ôn lý thuyết ngay, hoặc bật tăng tốc đồ họa trong trình duyệt rồi tải lại trang.';
    const theory = document.createElement('a');
    theory.href = 'theory-exam.html';
    theory.target = '_top';
    theory.textContent = 'Ôn lý thuyết';
    const retry = document.createElement('button');
    retry.textContent = 'Tải lại trang';
    retry.onclick = () => location.reload();
    const home = document.createElement('a');
    home.href = 'hall.html';
    home.target = '_top';
    home.textContent = 'Về sân tập';
    dialog.append(title, help, theory, retry, home);
    document.body.append(dialog);
    // Closing this notice would expose controls without a renderer.
    dialog.oncancel = event => event.preventDefault();
    dialog.showModal();
    theory.focus();
  }

  function get(canvas, options) {
    if (!renderer) {
      try {
        const antialias = !matchMedia('(pointer: coarse)').matches || document.body.dataset.graphics === 'high';
        renderer = new THREE.WebGLRenderer({canvas, antialias, ...options});
      } catch {
        unavailable();
        return null;
      }
    }
    return renderer;
  }

  return {get, unavailable};
})();

// The race extends the road simulator through several ordered classic scripts.
// Start them together only after the real game canvas has a working renderer.
{
  const entry = document.getElementById('drivingScripts');
  if (entry && DrivingRenderer.get(document.getElementById(entry.dataset.canvas), {
    powerPreference: entry.dataset.power || 'default'
  })) {
    const scripts = [...entry.content.querySelectorAll('script[src]')];
    const buttons = [...document.querySelectorAll('#launch, #start, #go, #fullStart')];
    buttons.forEach(button => { button.disabled = true; });
    for (const source of scripts) {
      const script = document.createElement('script');
      script.async = false;
      script.src = source.src;
      script.onerror = () => DrivingRenderer.unavailable(true);
      if (source === scripts.at(-1)) script.onload = () => {
        for (const button of buttons) button.disabled = false;
      };
      document.body.append(script);
    }
  }
}

;
// driving-graphics.js
'use strict';

// Rendering budgets are independent of the simulation clock and CSS layout.
function createDrivingGraphics(renderer, camera, sun) {
  const touch = matchMedia('(pointer: coarse)').matches;
  const profiles = [
    {id:'low', dpr:.9, pixels:900000, shadow:512, shadowMs:180, mirrorMs:170, waterWidth:0, waterMs:0, districtRadius:420, scenery:270, cars:2, treeDetail:25, treeCanopy:85},
    {id:'medium', dpr:1.25, pixels:1800000, shadow:1024, shadowMs:100, mirrorMs:120, waterWidth:256, waterMs:260, districtRadius:540, scenery:440, cars:3, treeDetail:55, treeCanopy:150},
    {id:'high', dpr:1.65, pixels:3600000, shadow:2048, shadowMs:60, mirrorMs:90, waterWidth:480, waterMs:130, districtRadius:650, scenery:620, cars:5, treeDetail:90, treeCanopy:240}
  ];
  if (touch) Object.assign(profiles[0], {pixels:520000, districtRadius:360, scenery:220, treeDetail:18, treeCanopy:65});
  const cores = navigator.hardwareConcurrency, memory = navigator.deviceMemory;
  // Mobile core counts include efficiency cores and do not predict GPU throughput.
  const initial = touch || cores <= 4 || memory <= 4 ? 0 : cores >= 8 && memory >= 8 ? 2 : 1;
  const autoCeiling = touch ? 1 : profiles.length - 1;
  const touchDensity = [.9, 1.25, 1.5];
  let level = initial, preference, previous = null, duration = 0, frames = 0, slow = 0, fast = 0, recoverAfter;
  let density = 0, smooth = 0, onTime = 0, sharpenAfter = 2;
  let width = 0, height = 0, ratio = 0;
  let verySlow = 0, reduced = false;
  const shadows = renderer.shadowMap.enabled;
  const canvas = renderer.domElement;

  function resetSamples() {
    previous = null;
    duration = frames = slow = fast = verySlow = smooth = onTime = 0;
  }
  function choose() {
    const selected = document.body.dataset.graphics || 'auto';
    if (preference === selected) return;
    preference = selected;
    const fixed = profiles.findIndex(profile => profile.id === selected);
    level = fixed < 0 ? initial : fixed;
    reduced = false;
    density = 0;
    sharpenAfter = 2;
    recoverAfter = touch ? 30 : 12;
    resetSamples();
  }
  function lowerQuality() {
    if (level > 0) level--;
    else if (touch && preference === 'auto' && density > 0) density--;
    else reduced = true;
    sharpenAfter = 12;
    recoverAfter = 45;
    resetSamples();
  }
  function sample(now, playing) {
    if (!playing || document.hidden || (preference !== 'auto' && preference !== 'low')) {
      if (previous !== null) resetSamples();
      return;
    }
    const delta = previous === null ? 0 : now - previous;
    previous = now;
    if (delta <= 0) return;
    // Several very late frames warrant a quick reduction even on a CPU-rich device.
    verySlow = delta > 55 ? verySlow + 1 : 0;
    if (verySlow >= 5 && !reduced) {
      lowerQuality();
      return;
    }
    // Bound the influence of a single tile load or shader compilation.
    duration += Math.min(delta, 100);
    frames++;
    if (delta <= 25) onTime++;
    if (duration < 1000) return;
    const average = duration / frames;
    const mobileAuto = touch && preference === 'auto';
    const slowLimit = level > 0 ? 23 : density > 0 ? 32 : 34;
    slow = average > slowLimit ? slow + 1 : 0;
    // Streaming may miss an individual frame even when most draws have headroom.
    const steady = onTime >= frames * .7 && average < (density === 0 ? 28 : 24);
    smooth = steady ? smooth + 1 : 0;
    fast = average < 18.5 ? fast + 1 : 0;
    duration = frames = onTime = 0;
    if (slow >= 2 && !reduced) {
      lowerQuality();
    } else if (mobileAuto && smooth >= (reduced ? 2 : sharpenAfter) && (reduced || density < touchDensity.length - 1)) {
      // Spend spare frame time on road markings first. Shadows, reflections
      // and the streamed district retain their own, slower recovery threshold.
      if (reduced) {
        reduced = false;
      } else {
        density++;
        sharpenAfter = 4;
      }
      smooth = 0;
    } else if (fast >= recoverAfter && (reduced || preference === 'auto' && level < autoCeiling)) {
      if (reduced) reduced = false;
      else level++;
      resetSamples();
    }
  }
  function resize() {
    const profile = profiles[level], w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const mobileAuto = touch && preference === 'auto';
    const dpr = mobileAuto ? touchDensity[density] : profile.dpr;
    const pixels = mobileAuto ? Math.min(1200000, profiles[0].pixels * (dpr / touchDensity[0]) ** 2) : profile.pixels;
    const scale = Math.min(window.devicePixelRatio || 1, dpr, Math.sqrt(pixels / (w * h))) * (reduced ? .64 : 1);
    const shadowMap = shadows && level > 0;
    if (renderer.shadowMap.enabled !== shadowMap) {
      renderer.shadowMap.enabled = shadowMap;
      renderer.shadowMap.needsUpdate = true;
    }
    if (w !== width || h !== height || scale !== ratio) {
      renderer.setDrawingBufferSize(w, h, scale);
      if (w !== width || h !== height) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      width = w; height = h; ratio = scale;
    }
    if (sun && sun.shadow.mapSize.x !== profile.shadow) {
      sun.shadow.mapSize.setScalar(profile.shadow);
      sun.shadow.map?.setSize(profile.shadow, profile.shadow);
      renderer.shadowMap.needsUpdate = true;
    }
  }
  function frame(now, playing) {
    choose();
    sample(now, playing);
    resize();
  }
  choose();
  document.addEventListener('visibilitychange', resetSamples);
  return {frame, resize, get profile() { return profiles[level]; }};
}

;
// surface-materials.js
'use strict';
// Streamed surfaces have independent vertices per triangle. Compute their
// flat normal once per face, including when positions and normals are interleaved.
function writeFlatNormals(positions,normals,stride=3,offset=0){
  for(let a=0;a<positions.length;a+=stride*3){
    const b=a+stride,c=b+stride;
    const ux=positions[b]-positions[a],uy=positions[b+1]-positions[a+1],uz=positions[b+2]-positions[a+2];
    const vx=positions[c]-positions[a],vy=positions[c+1]-positions[a+1],vz=positions[c+2]-positions[a+2];
    const x=uy*vz-uz*vy,y=uz*vx-ux*vz,z=ux*vy-uy*vx;
    const length=Math.sqrt(x*x+y*y+z*z)||1;
    const nx=x/length,ny=y/length,nz=z/length;
    for(let i=a+offset;i<=c+offset;i+=stride){
      normals[i]=nx;normals[i+1]=ny;normals[i+2]=nz;
    }
  }
}
function setFlatNormals(T,geometry){
  const positions=geometry.attributes.position.array,normals=new Float32Array(positions.length);
  writeFlatNormals(positions,normals);
  geometry.setAttribute('normal',new T.BufferAttribute(normals,3));
}

// Scanned material channels share a UV transform, including after an origin rebase.
function createRoadSurfaces(T,renderer){
  const loader=new T.TextureLoader(),anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  function scanned(name,tint,strength){
    function channel(kind){
      const tex=loader.load('streetscape/surfaces/'+name+'-'+kind+'.webp');
      tex.name=name+' '+kind;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.anisotropy=anisotropy;
      if(kind==='color')tex.colorSpace=T.SRGBColorSpace;
      return tex;
    }
    return new T.MeshStandardMaterial({name:'Scanned '+name,color:tint,map:channel('color'),roughnessMap:channel('rough'),
      normalMap:channel('normal'),normalScale:new T.Vector2(strength,strength),metalness:0,roughness:.94,envMapIntensity:.36});
  }
  function transform(material,repeatX,repeatY,offsetX=0,offsetY=0){
    for(const tex of [material.map,material.normalMap,material.roughnessMap]){
      tex.repeat.set(repeatX,repeatY);tex.offset.set(offsetX,offsetY);
    }
  }
  function weatheredAsphalt(mat,wetness,origin,reflection){
    mat.envMapIntensity=.67;
    mat.onBeforeCompile=shader=>{
      shader.uniforms.roadWetness=wetness;
      shader.uniforms.roadOrigin={value:origin};
      Object.assign(shader.uniforms,reflection);
      const varyings='varying vec4 roadSample; varying vec4 roadMirrorUV; varying float roadHeight;\n';
      shader.vertexShader=varyings+'attribute vec2 carriageway; uniform vec2 roadOrigin; uniform mat4 mirrorMatrix;\n'+
        shader.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\n roadSample=vec4(position.xz+roadOrigin,carriageway); vec4 roadWorld=modelMatrix*vec4(position,1.); roadHeight=roadWorld.y; roadMirrorUV=mirrorMatrix*roadWorld;');
      shader.fragmentShader=varyings+`
        uniform float roadWetness, mirrorStrength, mirrorLevel;
        uniform sampler2D mirrorMap;
        float roadHash(vec2 p){
          vec3 h=fract(p.xyx*vec3(.1031,.11369,.13787));
          h+=dot(h,h.yzx+19.19);return fract((h.x+h.y)*h.z);
        }
        float depressions(vec2 p){
          vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
          return mix(mix(roadHash(i),roadHash(i+vec2(1.,0.)),f.x),
                     mix(roadHash(i+vec2(0.,1.)),roadHash(i+1.),f.x),f.y);
        }\n`+
        shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
          // Sample a larger patch of the same scan to break up the four-metre repeat.
          vec2 metres=roadSample.xy;
          vec2 patchUV=mat2(.8,.6,-.6,.8)*metres/32.;
          float variation=smoothstep(.13,.35,texture2D(map,patchUV).g);
          float halfWidth=roadSample.w, lateral=abs(roadSample.z);
          float laneWidth=halfWidth>6.7 ? halfWidth*.5 : halfWidth;
          float centre=halfWidth<4.2 ? 0. : laneWidth*.5;
          float offset=abs(mod(lateral-centre+laneWidth*.5,max(laneWidth,.1))-laneWidth*.5);
          float tracks=(1.-smoothstep(.14,.50,abs(offset-.82)))*step(.01,halfWidth);
          float edge=smoothstep(halfWidth-.85,halfWidth,lateral)*step(.01,halfWidth);
          float film=0.;
          if(roadWetness>.004){
            float basin=.72*depressions(metres*.32)+.28*variation+.10*edge-.08*tracks;
            film=roadWetness*(.21+.79*smoothstep(.32,.69,basin));
          }
          diffuseColor.rgb*=mix(.83,1.18,variation)*(1.-.16*tracks);
          diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.17,.122,.084),edge*.26);
          diffuseColor.rgb*=1.-.53*film-.13*roadWetness;`)
        .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
          roughnessFactor=mix(clamp(roughnessFactor-.07*tracks,.52,.97),.085,film);`)
        .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
          normal=normalize(mix(normal,nonPerturbedNormal,.84*film));`)
        .replace('#include <opaque_fragment>',`
          if(film>.08 && mirrorStrength>.5 && roadMirrorUV.w>0.){
            vec2 uv=roadMirrorUV.xy/roadMirrorUV.w*.5+.5;
            float border=min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y));
            float levelFit=1.-smoothstep(.12,1.5,abs(roadHeight-mirrorLevel));
            float grazing=1.-max(0.,dot(normal,normalize(vViewPosition)));
            float reflectance=(.04+.71*pow(grazing,3.))*film*film*levelFit*smoothstep(0.,.045,border);
            vec2 ripple=(normal.xy-nonPerturbedNormal.xy)*.038;
            vec2 blur=vec2(.002,.004)*(1.5-film);
            uv=clamp(uv+ripple,blur,1.-blur);
            vec3 reflected=texture2D(mirrorMap,uv).rgb*.5+
              .25*(texture2D(mirrorMap,uv+blur).rgb+texture2D(mirrorMap,uv-blur).rgb);
            outgoingLight=mix(outgoingLight,reflected,reflectance);
          }
          #include <opaque_fragment>`);
    };
  }
  return {scanned,transform,weatheredAsphalt};
}

;
// landmark-terrain.js
'use strict';
window.landmarkTerrain=[
  {"id":"kim-bang","start":[105.822,20.566],"bearing":0},
  {"id":"phi-lai","start":[105.950,20.447],"bearing":0}
];

;
// sight-landscapes.js
'use strict';
// Each cell covers 1/32 degree. Page slots run west to east, then north to south.
function sightRasterPages(base,grid,extensions){
  const pages=new Map(),byGraph=new WeakMap();
  let index;
  function page(name){
    if(!pages.has(name)){
      const read=ext=>new Promise((resolve,reject)=>{
        const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=base+name+ext;
      });
      pages.set(name,Promise.all(extensions.map(read)).catch(e=>{pages.delete(name);throw e;}));
    }
    return pages.get(name);
  }
  async function load(graph,x,z){
    const [lon,lat]=graph.geo(x,z),west=Math.floor(lon*grid)-1,north=Math.floor(lat*grid)+2;
    const last=byGraph.get(graph);
    if(last?.west===west&&last.north===north)return false;
    const next={west,north,cells:[],ready:false,previous:last?.ready?last:last?.previous};
    byGraph.set(graph,next);
    try{
      index??=fetch(base+'index.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(book=>{
        const cells=new Map();
        for(const [tag,slots] of Object.entries(book)){
          const x=Number(tag.slice(4))*grid,y=Number(tag.slice(1,3))*grid;
          slots.forEach(([i,j],n)=>cells.set((x+i)+','+(y+j),{name:tag+'-'+Math.floor(n/32),slot:n%32}));
        }
        return cells;
      }).catch(e=>{index=null;throw e;});
      const book=await index,needed=new Set();
      for(let j=0;j<3;j++)for(let i=0;i<3;i++){
        const tile=book.get((west+i)+','+(north-1-j));if(!tile)continue;
        needed.add(tile.name);
        next.cells.push({...tile,i,j});
      }
      await Promise.all(next.cells.map(async tile=>{tile.images=await page(tile.name);}));
      if(byGraph.get(graph)!==next)return false;
      next.ready=true;delete next.previous;
      for(const key of pages.keys())if(!needed.has(key))pages.delete(key);
      return true;
    }catch{if(byGraph.get(graph)===next){if(next.previous)byGraph.set(graph,next.previous);else byGraph.delete(graph);}return false;}
  }
  return {load,current(graph){
    const found=graph&&byGraph.get(graph);
    return found?.ready?found:found?.previous||null;
  }};
}
// In the output colour space, distant open water takes its light from the sky.
const sightOpenWaterColour='fogColor*vec3(.36,.54,.59)';
function createSightLandscapes(T){
  const grid=32,size=96,side=3*size;
  const coarse=sightRasterPages('sight-landscapes/',grid,['.webp','.surface.webp','-water.webp']);
  const fine=sightRasterPages('sight-imagery/',grid*4,['.webp']);
  const supplement=sightRasterPages('sight-elevation/',grid,['.png']),extraSize=80;
  let front,spare;
  function createView(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=side;
  const colour=canvas.getContext('2d');
  const mask=canvas.cloneNode(),surface=mask.getContext('2d',{willReadFrequently:true});
  canvas.width=canvas.height=side*4;
  const water=document.createElement('canvas');water.width=water.height=side*4;
  const waterPen=water.getContext('2d',{willReadFrequently:true});
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
  const waterTexture=new T.CanvasTexture(water);
  const uniforms={sightImage:{value:texture},sightWater:{value:waterTexture},sightBounds:{value:new T.Vector4(0,0,1,1)},sightEnabled:{value:0}};
  let active=null,activeFine=null,activeExtra=null,pixels=null;
  const heights=new Float32Array(side*side),distance=new Float32Array(side*side);
  const extraCanvas=document.createElement('canvas');extraCanvas.width=extraCanvas.height=3*extraSize;
  const extraPen=extraCanvas.getContext('2d',{willReadFrequently:true});
  function composeHeights(area,extra,graph){
    const n=extraCanvas.width;
    let extraPixels;
    if(extra?.cells.length){
      extraPen.clearRect(0,0,n,n);
      for(const {slot,i,j,images} of extra.cells){
        extraPen.drawImage(images[0],slot%8*extraSize,Math.floor(slot/8)*extraSize,extraSize,extraSize,
          (i+extra.west-area.west)*extraSize,(j+area.north-extra.north)*extraSize,extraSize,extraSize);
      }
      extraPixels=extraPen.getImageData(0,0,n,n).data;
    }
    function extraHeight(i,j){
      if(!extraPixels)return NaN;
      const u=(i+.5)*extraSize/size-.5,v=(j+.5)*extraSize/size-.5;
      const left=Math.floor(u),top=Math.floor(v),fx=u-left,fy=v-top;
      let sum=0,weight=0;
      for(let y=0;y<2;y++)for(let x=0;x<2;x++){
        const k=(Math.min(n-1,Math.max(0,top+y))*n+Math.min(n-1,Math.max(0,left+x)))*4;
        const h=extraPixels[k]*256+extraPixels[k+1];
        if(!h)continue;
        const f=(x?fx:1-fx)*(y?fy:1-fy);
        sum+=f*(h-129);weight+=f;
      }
      return weight>.49?sum/weight:NaN;
    }
    const dx=graph.mx/(grid*size),dz=graph.my/(grid*size),diagonal=Math.hypot(dx,dz);
    for(let j=0,k=0;j<side;j++)for(let i=0;i<side;i++,k++){
      const p=k*4;
      heights[k]=pixels?.[p+2]?pixels[p]*256+pixels[p+1]-128:extraHeight(i,j);
      distance[k]=Number.isFinite(heights[k])?Math.min(240,i*dx,(side-1-i)*dx,j*dz,(side-1-j)*dz):0;
    }
    // Two chamfer sweeps include internal holes and the streamed window edge.
    // A shared confidence field prevents seams where the two DEMs meet.
    for(let j=1;j<side-1;j++)for(let i=1;i<side-1;i++){
      const k=j*side+i;
      distance[k]=Math.min(distance[k],distance[k-1]+dx,distance[k-side]+dz,
        distance[k-side-1]+diagonal,distance[k-side+1]+diagonal);
    }
    for(let j=side-2;j>0;j--)for(let i=side-2;i>0;i--){
      const k=j*side+i;
      distance[k]=Math.min(distance[k],distance[k+1]+dx,distance[k+side]+dz,
        distance[k+side+1]+diagonal,distance[k+side-1]+diagonal);
    }
  }
  function setOrigin(graph){
    const next=coarse.current(graph),detail=fine.current(graph),extra=supplement.current(graph);
    if(active===next&&activeFine===detail&&activeExtra===extra)return;
    active=next;activeFine=detail;activeExtra=extra;pixels=null;uniforms.sightEnabled.value=0;
    if(!next?.cells.length&&!extra?.cells.length){heights.fill(NaN);distance.fill(0);return;}
    const area=next?.cells.length?next:extra;
    colour.clearRect(0,0,canvas.width,canvas.height);surface.clearRect(0,0,side,side);waterPen.clearRect(0,0,water.width,water.height);
    for(const {slot,i,j,images} of next?.cells||[]){
      const rect=[slot%8*size,Math.floor(slot/8)*size,size,size,i*size,j*size,size,size];
      colour.drawImage(images[0],...rect.slice(0,4),...rect.slice(4).map(n=>n*4));surface.drawImage(images[1],...rect);
      waterPen.drawImage(images[2],...rect.map(n=>n*4));
    }
    if(detail)for(const {slot,i,j,images} of detail.cells){
      const x=(detail.west-area.west*4+i)*size,y=(area.north*4-detail.north+j)*size;
      colour.drawImage(images[0],slot%8*size,Math.floor(slot/8)*size,size,size,x,y,size,size);
    }
    const origin=graph.point(area.west/grid,area.north/grid);
    uniforms.sightBounds.value.set(origin.x,origin.z,grid/(3*graph.mx),grid/(3*graph.my));
    if(next?.cells.length)pixels=surface.getImageData(0,0,side,side).data;
    composeHeights(area,extra,graph);
    texture.needsUpdate=waterTexture.needsUpdate=true;uniforms.sightEnabled.value=pixels?1:0;
  }
  function sample(x,z,field){
    if(!active&&!activeExtra)return null;
    const b=uniforms.sightBounds.value,u=(x-b.x)*b.z*side-.5,v=(z-b.y)*b.w*side-.5;
    const i=Math.floor(u),j=Math.floor(v);
    if(i<0||j<0||i>=side-1||j>=side-1)return null;
    const k=j*side+i;
    if(!field)return pixels?.[k*4+2]||null;
    const fx=u-i,fy=v-j;
    const low=field[k]*(1-fx)+field[k+1]*fx,high=field[k+side]*(1-fx)+field[k+side+1]*fx;
    const value=low*(1-fy)+high*fy;
    return Number.isFinite(value)?value:null;
  }
  function paintWater(ctx,cx,cz){
    if(!pixels)return;
    const b=uniforms.sightBounds.value;
    ctx.save();ctx.globalCompositeOperation='destination-over';
    ctx.drawImage(water,b.x-cx,b.y-cz,1/b.z,1/b.w);ctx.restore();
  }
  return {uniforms,setOrigin,matches:graph=>active===coarse.current(graph)&&activeFine===fine.current(graph)&&activeExtra===supplement.current(graph),
    paintWater,cover:(x,z)=>sample(x,z,null),elevation:(x,z)=>sample(x,z,heights),
    elevationWeight(x,z){const t=(sample(x,z,distance)||0)/240;return t*t*(3-2*t);},get visible(){return !!pixels;}};
  }
  front=createView();
  const uniforms=Object.fromEntries(Object.entries(front.uniforms).map(([key,u])=>[key,{value:u.value}]));
  const waterDistrict={value:new T.Vector3()};
  async function load(graph,x,z){
    return (await Promise.all([coarse.load(graph,x,z),fine.load(graph,x,z),supplement.load(graph,x,z)])).some(Boolean);
  }
  function shade(shader,position='groundMetres',exposure='1.-bankWet'){
    Object.assign(shader.uniforms,uniforms);
    shader.fragmentShader='uniform sampler2D sightImage; uniform sampler2D sightWater; uniform vec4 sightBounds; uniform float sightEnabled;\n'+
      shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 sightUV=(${position}-sightBounds.xy)*sightBounds.zw;
      float sightCoverage=0.,sightMappedWater=0.;
      if(sightEnabled>.5 && all(greaterThan(sightUV,vec2(0.))) && all(lessThan(sightUV,vec2(1.)))){
        vec4 observed=texture2D(sightImage,vec2(sightUV.x,1.-sightUV.y));
        float fineGrain=clamp(dot(diffuseColor.rgb,vec3(.21,.72,.07))*3.8,.60,1.34);
        diffuseColor.rgb=mix(diffuseColor.rgb,observed.rgb*fineGrain,.86*observed.a*(${exposure}));
        sightCoverage=observed.a;
        sightMappedWater=texture2D(sightWater,vec2(sightUV.x,1.-sightUV.y)).a;
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.049,.13,.145)+observed.rgb*.10,.91*sightMappedWater*(${exposure}));
      }`);
  }
  function prepare(graph){
    if(front.matches(graph))return front;
    spare??=createView();spare.setOrigin(graph);return spare;
  }
  // A lake can extend beyond the generated water mesh. Use the surveyed mask
  // on both sides of that boundary, and keep waves and reflections in the foreground.
  function shadeWaterBoundary(shader,surface){
    shader.uniforms.waterDistrict=waterDistrict;
    const position=surface?'waterMetres':'groundMetres';
    let declarations='uniform vec3 waterDistrict;\n';
    if(surface){
      for(const id of ['sightWater','sightBounds','sightEnabled'])shader.uniforms[id]=uniforms[id];
      declarations+='uniform sampler2D sightWater; uniform vec4 sightBounds; uniform float sightEnabled;\n';
    }
    shader.fragmentShader=declarations+shader.fragmentShader.replace('#include <fog_fragment>',`
      #ifdef USE_FOG
        float districtRange=length(${position}-waterDistrict.xy)*waterDistrict.z;
        float edgeBlend=smoothstep(.58,.96,districtRange);
        if(edgeBlend>0.){
          ${surface?`vec2 uv=(waterMetres-sightBounds.xy)*sightBounds.zw;
          float sightMappedWater=0.;
          if(sightEnabled>.5 && all(greaterThanEqual(uv,vec2(0.))) && all(lessThanEqual(uv,vec2(1.))))
            sightMappedWater=texture2D(sightWater,vec2(uv.x,1.-uv.y)).a;`:''}
          gl_FragColor.rgb=mix(gl_FragColor.rgb,${sightOpenWaterColour},edgeBlend*sightMappedWater);
        }
      #endif
      #include <fog_fragment>`);
  }
  function activate(view){
    if(front===view)return;
    spare=front;front=view;
    for(const key of Object.keys(uniforms))uniforms[key].value=view.uniforms[key].value;
  }
  return {load,shade,shadeWaterBoundary,prepare,activate,setWaterDistrict(x,z,radius){waterDistrict.value.set(x,z,1/radius);}};
}

;