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