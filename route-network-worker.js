'use strict';
importScripts('road-tile-codec.js','route-network-core.js');

class RouteError extends Error {
  constructor(code,message){super(message);this.code=code;}
}

async function readAsset(url,binary=false){
  const response=await fetch(binary?url+'?format=packed':url);
  if(!response.ok)throw new RouteError('network','Chưa tải được dữ liệu đường. Hãy thử lại.');
  const bytes=await RoadTileCodec.content(response);
  return binary ? RoadTileCodec.routeCosts(bytes) : RoadTileCodec.decode(bytes);
}

function cached(map,key,limit,load){
  if(map.has(key)){
    const hit=map.get(key);map.delete(key);map.set(key,hit);return hit;
  }
  if(map.size>=limit)map.delete(map.keys().next().value);
  const pending=load().catch(error=>{if(map.get(key)===pending)map.delete(key);throw error;});
  map.set(key,pending);return pending;
}

function boxes(index){
  const keys=[...index.tiles.filter(k=>!index.splits?.[k]),...(index.subtiles||[]),...(index.sightAccess?.only||[])];
  return keys.map(key=>{
    const [x,y,i=0,j=0]=key.split('_').map(Number),size=.25/(index.splits?.[x+'_'+y]||1);
    return {key,lon:x/4+i*size,lat:y/4+j*size,size};
  });
}

async function snap(point,regions,rows){
  const sx=111320*Math.cos(point[1]*Math.PI/180),max=2000;
  const candidates=[];
  for(const {key,lon,lat,size} of regions){
    const x=Math.max(lon-point[0],0,point[0]-lon-size)*sx;
    const y=Math.max(lat-point[1],0,point[1]-lat-size)*110900;
    const distance=x*x+y*y;
    if(distance<=max*max)candidates.push({key,distance});
  }
  let best=null;
  for(const c of candidates.sort((a,b)=>a.distance-b.distance)){
    if(best && c.distance>best.error)break;
    best=RouteNetwork.nearest(point,await rows(c.key),best);
  }
  if(!best || best.error>max*max)throw new RouteError('no-road','Chưa có đường ô tô trong vòng 2 km từ điểm đã chọn.');
  return best;
}

// An endpoint inside a crossing edge can leave towards either endpoint, even
// though those endpoints belong to different routing regions.
function endpointKeys(index,place,starting){
  const [x,y,xx,yy]=place.ends;
  const a=RouteNetwork.tileAt(index,x,y), b=RouteNetwork.tileAt(index,xx,yy);
  return [...new Set(place.oneway?[starting?b:a]:[a,b])];
}
function seeds(graph,place,starting){
  const result=[];
  for(const dir of [1,-1]){
    const n=graph.byId.get(dir*place.id);
    if(n===undefined)continue;
    const arc=graph.arcs[n];
    if((starting?arc.to:arc.from)!==graph.key)continue;
    const from=dir>0?place.fraction:1-place.fraction;
    result.push([n,arc.cost*(starting?1-from:from)]);
  }
  return result;
}
function finishLabel(graph,labels,goal){
  let best={cost:Infinity};
  for(const [end,lastCost] of seeds(graph,goal,false)){
    for(const prev of graph.arcs[end].prev){
      const cost=labels[prev]+lastCost;
      if(cost<best.cost)best={cost,prev,end};
    }
  }
  return best;
}
function pathTo(parents,n){
  const route=[];
  for(;n>=0;n=parents[n])route.push(n);
  return route.reverse();
}

async function plan({index,start,finish},progress){
  if(!index || ![start,finish].every(p=>Array.isArray(p) && p.length===2 && p.every(Number.isFinite))){
    throw new RouteError('invalid','Hãy chọn điểm đi và điểm đến trên bản đồ.');
  }
  // In some embedded browsers the main scene can start before the optional
  // traffic index arrives. Routing needs its restrictions for all tile searches.
  let traffic=index.trafficTiles;
  if(!Array.isArray(traffic)){
    const extra=await readAsset('vn-traffic/index.json');
    if(extra.graphSourceSha256!==index.sourceSha256 || extra.osmTimestamp!==index.osmTimestamp)
      throw new RouteError('version','Dữ liệu đường vừa thay đổi. Hãy tải lại trang.');
    traffic=extra.tiles;
  }
  const activeTraffic=new Set(traffic),local=new Set(index.localTiles||[]);
  const raw=new Map(),graphs=new Map();
  const readRows=RoadTileCodec.roadRows(index);
  const rows=key=>cached(raw,key,3,()=>{
    const base=index.tileBase&&!local.has(key)?index.tileBase:'vn-roads/';
    return readRows(key,base,readAsset);
  });
  const tile=key=>cached(graphs,key,3,async()=>{
    const [data,details]=await Promise.all([rows(key),activeTraffic.has(key)?readAsset('vn-traffic/'+key+'.gz'):{}]);
    raw.delete(key);
    return new RouteNetwork.Tile(index,key,data,details);
  });
  const regions=boxes(index);
  progress('Đang tìm đường ô tô gần hai điểm…');
  const [origin,goal]=await Promise.all([snap(start,regions,rows),snap(finish,regions,rows)]);
  const sourceKeys=endpointKeys(index,origin,true),targetKeys=endpointKeys(index,goal,false);
  const result={type:'route',start:origin.point,finish:goal.point,startFraction:origin.fraction,
    finishFraction:goal.fraction,edges:[],lengths:[],tiles:[]};
  function append(graph,indices){
    if(!result.tiles.includes(graph.key))result.tiles.push(graph.key);
    for(const n of indices){
      const arc=graph.arcs[n];result.edges.push(arc.id);result.lengths.push(arc.length);
    }
  }
  if(origin.id===goal.id){
    const dir=goal.fraction>=origin.fraction?1:-1;
    if(dir===1 || !origin.oneway){
      const graph=await tile(sourceKeys[0]),n=graph.byId.get(dir*origin.id);
      if(n!==undefined){
        if(Math.abs(goal.fraction-origin.fraction)*graph.arcs[n].length<15)
          throw new RouteError('too-close','Hai điểm nằm quá gần nhau trên cùng một đường.');
        append(graph,[n]);return result;
      }
    }
  }
  const first=new Map(),last=new Map(),prefix=new Map(),portalRegions=new Map();
  let best={cost:Infinity};
  for(const key of sourceKeys){
    const graph=await tile(key),labels=graph.search(seeds(graph,origin,true),false,true);
    for(const n of graph.outputs){
      const arc=graph.arcs[n],cost=labels.costs[n];
      if(cost<(first.get(arc.id)?.cost??Infinity))first.set(arc.id,{cost,key});
    }
    if(targetKeys.includes(key)){
      const end=finishLabel(graph,labels.costs,goal);
      if(end.cost<best.cost)best={cost:end.cost,key,indices:[...pathTo(labels.parents,end.prev),end.end]};
    }
  }
  // A short complete path inside one tile is already suitable. A long trip
  // also compares other tile crossings with the in-tile alternative.
  if(best.cost<12000){append(await tile(best.key),best.indices);return result;}
  for(const key of targetKeys){
    const graph=await tile(key),suffix=graph.search(seeds(graph,goal,false),true);
    for(const n of graph.inputs){
      const arc=graph.arcs[n], cost=suffix.costs[n]-arc.cost;
      if(Number.isFinite(cost))last.set(arc.id,{cost,key});
    }
  }
  progress('Đang nối các vùng đường trên bản đồ Việt Nam…');
  if(first.size && last.size){
    raw.clear();graphs.clear();
    const overlay=await readAsset('route-network/portals.gz');
    if(overlay.version!==1 || overlay.source!==index.sourceSha256 || overlay.timestamp!==index.osmTimestamp || overlay.sightAccess!==index.sightAccess?.revision)
      throw new RouteError('version','Dữ liệu đường vừa thay đổi. Hãy tải lại trang.');
    const entries=new Map();
    const matrices=new Map(), regionByKey=new Map(regions.map(r=>[r.key,r]));
    const hints=new Map(), lonScale=100000*Math.cos(Math.max(Math.abs(goal.point[1]),24)*Math.PI/180);
    for(const [key,[inputs,outputs,offset]] of Object.entries(overlay.tiles)){
      const box=regionByKey.get(key);
      const dx=Math.max(box.lon-goal.point[0],0,goal.point[0]-box.lon-box.size)*lonScale;
      const dy=Math.max(box.lat-goal.point[1],0,goal.point[1]-box.lat-box.size)*100000;
      hints.set(key,Math.hypot(dx,dy)*.8);
      const part={outputs,offset,band:Math.floor(Number(key.split('_')[1])/4)};
      inputs.forEach((id,i)=>{entries.set(id,{part,i});portalRegions.set(id,key);});
    }
    function estimate(id){return hints.get(portalRegions.get(id))||0;}
    const heap=new RouteNetwork.Heap(), distances=new Map();
    for(const [id,{cost}] of first){distances.set(id,cost);heap.push(id,cost+estimate(id));}
    while(heap.keys.length){
      const id=heap.pop(), d=distances.get(id);
      if(heap.value>=best.cost)break;
      if(d+estimate(id)!==heap.value)continue;
      const target=last.get(id);
      if(target && d+target.cost<best.cost)best={cost:d+target.cost,gate:id,key:target.key};
      const entry=entries.get(id);
      if(!entry)continue;
      const {part,i}=entry, offset=part.offset+i*part.outputs.length;
      if(!matrices.has(part.band))matrices.set(part.band,await readAsset('route-network/costs-'+part.band+'.gz',true));
      const costs=matrices.get(part.band);
      for(let j=0;j<part.outputs.length;j++){
        const step=costs[offset+j],next=part.outputs[j],cost=d+step;
        if(step<0 || cost>=best.cost || cost>=(distances.get(next)??Infinity))continue;
        distances.set(next,cost);prefix.set(next,id);heap.push(next,cost+estimate(next));
      }
    }
  }
  if(!Number.isFinite(best.cost))throw new RouteError('no-route','Không có tuyến ô tô nối hai điểm này trên mạng đường của game.');
  if(best.indices){append(await tile(best.key),best.indices);return result;}
  const gates=[];
  for(let id=best.gate;id!==undefined;id=prefix.get(id))gates.push(id);
  gates.reverse();
  const sections=[];
  let key=first.get(gates[0]).key,entry=null;
  // Discover tile ownership from each directed boundary edge's actual endpoints.
  for(const exit of gates){
    sections.push({key,entry,exit});
    key=portalRegions.get(exit);entry=exit;
  }
  sections.push({key:best.key,entry,exit:null});
  const ahead=new Map();
  for(let i=0;i<sections.length;i++){
    for(let j=i;j<Math.min(i+2,sections.length);j++)if(!ahead.has(j)){
      // Convert rejected prefetches to values until their section is reached.
      ahead.set(j,tile(sections[j].key).then(graph=>({graph}),error=>({error})));
    }
    const {graph,error}=await ahead.get(i);ahead.delete(i);if(error)throw error;
    const s=sections[i];
    const initial=s.entry===null?seeds(graph,origin,true):[[graph.byId.get(s.entry),0]];
    const end=s.exit===null?-1:graph.byId.get(s.exit);
    if(initial.some(([n])=>n===undefined) || end===undefined)throw stale();
    const labels=graph.search(initial,false,true,end);
    let indices;
    if(end>=0 && Number.isFinite(labels.costs[end]))indices=pathTo(labels.parents,end);
    else if(end===-1){
      const finish=finishLabel(graph,labels.costs,goal);
      if(Number.isFinite(finish.cost))indices=[...pathTo(labels.parents,finish.prev),finish.end];
    }
    if(!indices)throw stale();
    if(s.entry!==null)indices.shift();
    append(graph,indices);
    if(i%4===0)progress('Đang ghép các đoạn đường… '+(i+1)+' / '+sections.length);
  }
  return result;

  function stale(){return new RouteError('version','Dữ liệu tuyến chưa đồng bộ. Hãy tải lại trang và thử lại.');}
}

self.onmessage=async event=>{
  try{
    const result=await plan(event.data,message=>self.postMessage({type:'progress',message}));
    self.postMessage(result);
  }catch(error){
    self.postMessage({type:'error',code:error.code||'network',message:error instanceof RouteError?error.message:'Chưa tải được lộ trình. Hãy kiểm tra kết nối và thử lại.'});
  }
};
