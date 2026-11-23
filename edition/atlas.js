import {$,selectedCar,prefs} from './core.js';
import {startTrip} from './launch.js';
let map,provinces,communes,provinceLayer,wardLayer,marker,stationLayer,nearRoads,overview,pin,initializing,restyle,refreshStations;
const cache=new Map();
const loadJson=path=>fetch(new URL(path,import.meta.url)).then(r=>{if(!r.ok)throw Error(path);return r.json();});
function polygonContains(ring,x,y){
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}
  return inside;
}
function inside(f,lng,lat){
  const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
  return polys.some(r=>polygonContains(r[0],lng,lat)&&!r.slice(1).some(h=>polygonContains(h,lng,lat)));
}
function choose(p,label,zoom=false){
  const lat=Number(p.lat),lon=Number(p.lon);pin={id:'atlas-pin',lat,lon,name:label||p.fullName||p.name};
  $('#pin-title').textContent=pin.name;$('#pin-coords').textContent=lat.toFixed(5)+'° B · '+lon.toFixed(5)+'° Đ';$('#pin-drive').disabled=false;
  marker.setLatLng([lat,lon]).addTo(map);if(zoom)map.setView([lat,lon],12);restyle?.();
}
function pointAt(lat,lon,label){
  const ward=communes.features.find(f=>inside(f,lon,lat)),pr=ward?provinces.features.find(f=>f.properties.code==='75'):provinces.features.find(f=>inside(f,lon,lat));
  if(!pr&&!label){$('#atlas-tip').textContent='Chọn điểm thuộc địa giới Việt Nam hoặc chọn tỉnh, thành phố trong danh sách.';return;}
  $('#province').value=pr?.properties.code||'';$('#commune-field').hidden=pr?.properties.code!=='75';$('#commune').value=ward?.properties.code||'';
  choose({lat,lon},label||ward?.properties.fullName||pr?.properties.fullName||'Điểm trên bản đồ');
  $('#atlas-tip').textContent='Xe sẽ xuất phát trên đoạn đường ô tô gần tọa độ đã chọn.';
}
function fit(f){map.fitBounds(L.geoJSON(f).getBounds(),{padding:[15,15],maxZoom:12,animate:false});}
function useProvince(code){
  const f=provinces.features.find(x=>x.properties.code===code);if(!f)return;
  $('#province').value=code;$('#commune-field').hidden=code!=='75';$('#commune').value='';
  choose(f.properties);fit(f);
}
function tipText(name){const n=document.createElement('span');n.textContent=name;return n;}
async function setup(){
  const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('vendor/leaflet.css',import.meta.url);document.head.append(css);
  await Promise.all([import('./vendor/leaflet.js'),import('../road-tile-codec.js')]);
  [provinces,communes]=await Promise.all([loadJson('assets/map/vietnam-provinces.geojson'),loadJson('assets/map/dongnai-communes.geojson')]);
  map=L.map('map-pane',{preferCanvas:true,minZoom:4,maxZoom:17,zoomSnap:.25,zoomControl:true,scrollWheelZoom:true});
  map.attributionControl.setPrefix(false);map.attributionControl.addAttribution('<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a> · <a href="assets/map/sources.txt" target="_blank">Địa giới</a>');
  L.control.scale({imperial:false}).addTo(map);
  map.createPane('roads');map.getPane('roads').style.zIndex=430;map.getPane('roads').style.pointerEvents='none';
  const current=$('#province'),ward=$('#commune');
  for(const f of [...provinces.features].sort((a,b)=>a.properties.name.localeCompare(b.properties.name,'vi')))current.append(new Option(f.properties.fullName,f.properties.code));
  current.options[0].remove();current.disabled=false;
  for(const f of [...communes.features].sort((a,b)=>a.properties.name.localeCompare(b.properties.name,'vi')))ward.append(new Option(f.properties.fullName,f.properties.code));
  ward.disabled=false;
  function styleProvince(f){const selected=f.properties.code===current.value;return {color:selected?'#d7f75e':'#90a696',weight:selected?2.3:1,fillColor:selected?'#586d49':'#354d40',fillOpacity:.92};}
  function styleWard(f){const selected=f.properties.code===ward.value;return {color:selected?'#f0ff8c':'#9caf83',weight:selected?2.6:.9,fillColor:selected?'#788750':'#436044',fillOpacity:selected?.88:.70};}
  provinceLayer=L.geoJSON(provinces,{style:styleProvince,onEachFeature:(f,l)=>{l.bindTooltip(tipText(f.properties.fullName));l.on('click',e=>{L.DomEvent.stopPropagation(e);pointAt(e.latlng.lat,e.latlng.lng);});}}).addTo(map);
  wardLayer=L.geoJSON(communes,{style:styleWard,onEachFeature:(f,l)=>{l.bindTooltip(tipText(f.properties.fullName));l.on('click',e=>{L.DomEvent.stopPropagation(e);pointAt(e.latlng.lat,e.latlng.lng);});}});
  marker=L.marker([11.12226,107.04004],{icon:L.divIcon({className:'map-dot',iconSize:[18,18],iconAnchor:[9,9]}),interactive:false});
  restyle=()=>{provinceLayer.setStyle(styleProvince);wardLayer.setStyle(styleWard);};
  current.onchange=()=>useProvince(current.value);
  ward.onchange=()=>{const f=communes.features.find(x=>x.properties.code===ward.value);if(f){choose(f.properties);fit(f);}else useProvince('75');};
  $('#back-dong-nai').onclick=()=>useProvince('75');
  $('#atlas-country').onclick=()=>map.fitBounds([[8.32,102.1],[23.42,109.75]],{padding:[8,9],animate:false});
  $('#pin-drive').onclick=()=>{if(pin)startTrip(pin,selectedCar(),prefs.mode,prefs.sound);};
  map.on('click',e=>pointAt(e.latlng.lat,e.latlng.lng));
  stationLayer=L.layerGroup().addTo(map);nearRoads=L.layerGroup().addTo(map);
  let stationVer=0,roadVer=0;
  refreshStations=async()=>{
    const ver=++stationVer;stationLayer.clearLayers();
    if(!$('#map-stations').checked||map.getZoom()<9)return;
    const ev=selectedCar().electric;let list;try{list=await DuongVietEnergy.stations(ev);}catch{return;}if(ver!==stationVer)return;
    const bounds=map.getBounds(),center=map.getCenter();
    const nearby=list.filter(p=>bounds.contains([p.lat,p.lon])).sort((a,b)=>((a.lat-center.lat)**2+(a.lon-center.lng)**2)-((b.lat-center.lat)**2+(b.lon-center.lng)**2)).slice(0,160);
    for(const p of nearby){const dot=L.circleMarker([p.lat,p.lon],{radius:5,weight:1.5,color:'#162116',fillColor:ev?'#d3fa45':'#ffa944',fillOpacity:1,bubblingMouseEvents:false});dot.bindTooltip(tipText((ev?'Sạc điện · ':'Nhiên liệu · ')+p.name));dot.on('click',()=>pointAt(p.lat,p.lon,p.name));dot.addTo(stationLayer);}
  };
  $('#map-stations').onchange=refreshStations;
  const roadIndex=loadJson('../vn-roads/index.json');
  async function detailedRoads(){
    const ver=++roadVer;nearRoads.clearLayers();if(map.getZoom()<10.75)return;
    let idx;try{idx=await roadIndex;}catch{return;}if(ver!==roadVer)return;
    const bounds=map.getBounds().pad(.08),center=map.getCenter(),zoom=map.getZoom(),available=new Set(idx.tiles),sub=new Set(idx.subtiles),needed=[];
    for(let x=Math.floor(4*bounds.getWest());x<=Math.floor(4*bounds.getEast());x++)for(let y=Math.floor(4*bounds.getSouth());y<=Math.floor(4*bounds.getNorth());y++){
      const base=x+'_'+y;if(!available.has(base))continue;const count=idx.splits[base]||1;
      for(let i=0;i<count;i++)for(let j=0;j<count;j++){
        const tile=count===1?base:base+'_'+i+'_'+j;if(count>1&&!sub.has(tile))continue;
        const west=(x+i/count)/4,south=(y+j/count)/4,size=.25/count;
        if(!bounds.intersects([[south,west],[south+size,west+size]]))continue;
        needed.push({tile,d:(south+size/2-center.lat)**2+(west+size/2-center.lng)**2});
      }
    }
    await Promise.all(needed.sort((a,b)=>a.d-b.d).slice(0,12).map(async({tile})=>{
      try{
        if(!cache.has(tile)){if(cache.size>=28)cache.delete(cache.keys().next().value);cache.set(tile,fetch(new URL('../vn-roads/'+tile+'.gz',import.meta.url)).then(async r=>{if(!r.ok)throw Error(tile);return RoadTileCodec.decode(await RoadTileCodec.content(r));}).catch(e=>{cache.delete(tile);throw e;}));}
        const rows=await cache.get(tile);if(ver!==roadVer)return;
        const group=[[],[]];for(const row of rows){
          const major=/^(motorway|trunk|primary|secondary|tertiary)/.test(row[4]);if(!major&&zoom<12)continue;
          const coords=row[6];if(!coords?.length)continue;
          const points=[];for(let i=0;i<coords.length;i+=2)points.push([coords[i+1]/1e5,coords[i]/1e5]);
          group[major?1:0].push(points);
        }
        group.forEach((lines,i)=>{if(lines.length)L.polyline(lines,{pane:'roads',color:i?'#edd294':'#a7b5ad',weight:i?2:1,opacity:i?.90:.65,interactive:false,smoothFactor:1.8}).addTo(nearRoads);});
      }catch{}
    }));
  }
  const redraw=()=>{if(map.getZoom()>=7&&map.getBounds().intersects([[10.45,106.3],[12.35,107.65]]))wardLayer.addTo(map);else wardLayer.remove();detailedRoads();refreshStations();};
  map.on('moveend',redraw);
  useProvince('75');pointAt(11.12226,107.04004,'Hồ Trị An · Đồng Nai');redraw();
  loadJson('assets/map/roads.json').then(data=>{overview=L.layerGroup();Object.entries(data).forEach(([k,lines])=>L.polyline(lines,{pane:'roads',color:k==='motorway'?'#e5c788':'#c5bd91',weight:k==='motorway'?1.8:1.1,opacity:.72,interactive:false,smoothFactor:1.4}).addTo(overview));overview.addTo(map);}).catch(()=>{});
}
export async function openAtlas(){
  if(!initializing)initializing=setup().catch(e=>{initializing=null;throw e;});
  await initializing;map.invalidateSize();refreshStations();
}
