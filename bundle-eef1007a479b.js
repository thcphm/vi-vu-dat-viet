'use strict';
// answer-feedback.js
'use strict';
function markQuizAnswer(button,correct){
  if(button.hasAttribute('data-answer-result'))return;
  button.dataset.answerResult=correct?'correct':'wrong';
  const label=document.createElement('small');
  label.className='answer-mark';
  label.textContent=correct?'✓ Đáp án đúng':'✗ Bạn đã chọn sai';
  (button.querySelector('span')||button).append(label);
}

;
// pit-quiz.js
'use strict';
window.createPitQuiz=function(dialog,onWrong,onReady){
  const $=selector=>dialog.querySelector(selector);
  let deck=[],last;
  function draw(){
    if(!deck.length){
      deck=[...window.driveBank];
      for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
      if(deck.at(-1).id===last)deck.reverse();
    }
    const q=deck.pop();last=q.id;return q;
  }
  $('#repair').onclick=()=>{dialog.close();onReady();};
  dialog.oncancel=e=>e.preventDefault();
  return async function show(kind){
    $('#remark').textContent=kind==='water'?'Chú Tư kéo xe lên bờ rồi!':kind==='car'?'Cản sau đâu phải nút bấm còi!':kind==='curve'?'Cua trái, cản trước đi thẳng.':kind==='downhill'?'Đổ đèo, đừng đổ phụ tùng!':'Lề đường vừa xin chữ ký.';
    const choices=$('#choices'),img=$('#pitImage');
    choices.replaceChildren();img.hidden=true;$('#repair').hidden=true;
    $('#reply').textContent='';$('#prompt').textContent='Đang tải câu hỏi…';
    if(!dialog.open)dialog.showModal();
    if(!window.driveBank){
      try{await import('./bank.js');}
      catch{
        $('#prompt').textContent='Chưa tải được câu hỏi. Hãy kiểm tra kết nối rồi thử lại.';
        const retry=document.createElement('button');retry.textContent='Thử tải lại';
        retry.onclick=()=>show(kind);choices.append(retry);return;
      }
    }
    const q=draw();
    $('#prompt').textContent=q.prompt;img.hidden=!q.image;
    img.alt=q.imageAlt||'';
    if(q.image)img.src=q.image;else img.removeAttribute('src');
    $('#reply').textContent='Chú Tư đang mở nắp ca-pô. Trả lời câu này để chú ráp xe.';
    q.choices.forEach((text,i)=>{
      const b=document.createElement('button');b.textContent=String.fromCharCode(65+i)+'. '+text;b.onclick=()=>{
        markQuizAnswer(choices.children[q.correct],true);
        if(i!==q.correct){
          markQuizAnswer(b,false);b.disabled=true;
          $('#reply').textContent=onWrong()+' Đáp án đúng là '+String.fromCharCode(65+q.correct)+'.';
          choices.children[q.correct].focus();return;
        }
        for(const item of choices.children)item.disabled=true;
        $('#reply').textContent='Chuẩn bài! Cản trước đã về với chính chủ.';$('#repair').hidden=false;$('#repair').focus();
      };choices.append(b);
    });
  };
};

;
// road-tile-codec.js
'use strict';
// Packed files are gzip streams, just like the original JSON tiles. After
// decompression this signature distinguishes the columnar road graph from
// JSON, including when the HTTP layer already removed the gzip envelope.
globalThis.RoadTileCodec=(()=>{
  const utf8=new TextDecoder();
  const labelUTF8=new TextDecoder('utf-8',{ignoreBOM:true});
  function packed(bytes){
    return bytes[0]===86&&bytes[1]===82&&bytes[2]===68&&bytes[3]===49; // VRD1
  }
  function decode(bytes){
    if(bytes instanceof ArrayBuffer)bytes=new Uint8Array(bytes);
    if(!packed(bytes))return JSON.parse(utf8.decode(bytes));
    let at=4;
    function uint(){
      let n=0,scale=1;
      while(at<bytes.length){
        const b=bytes[at++];n+=(b&127)*scale;
        if(!Number.isSafeInteger(n))throw Error('Invalid road tile integer.');
        if(b<128)return n;
        scale*=128;
      }
      throw Error('Incomplete road tile.');
    }
    function signed(){const v=uint();return v%2===1?-(v+1)/2:v/2;}
    function count(){
      const n=uint();
      if(n>bytes.length-at)throw Error('Invalid road tile count.');
      return n;
    }
    function strings(){
      const n=count(),out=new Array(n);
      for(let i=0;i<n;i++){
        const len=count();out[i]=labelUTF8.decode(bytes.subarray(at,at+len));at+=len;
      }
      return out;
    }
    const edges=count(),nodes=count(),names=strings(),kinds=strings();
    const ids=new Float64Array(nodes),xs=new Int32Array(nodes),ys=new Int32Array(nodes);
    for(const column of [ids,xs,ys]){
      let previous=0;
      for(let i=0;i<nodes;i++){previous+=signed();column[i]=previous;}
    }
    const rows=new Array(edges),starts=new Int32Array(edges),ends=new Int32Array(edges);
    let edgeId=0;
    for(let i=0;i<edges;i++){edgeId+=signed();rows[i]=[edgeId,0,0,'','',0,null];}
    for(let i=0;i<edges;i++)starts[i]=signed();
    let previousEnd=0;
    for(let i=0;i<edges;i++){
      const a=starts[i]+previousEnd,b=a+signed();previousEnd=b;
      if(a<0||b<0||a>=nodes||b>=nodes)throw Error('Unknown road tile node.');
      starts[i]=a;ends[i]=b;rows[i][1]=ids[a];rows[i][2]=ids[b];
    }
    for(const [field,dict] of [[3,names],[4,kinds]]){
      for(let i=0;i<edges;i++){
        const k=uint();if(k>=dict.length)throw Error('Unknown road tile label.');
        rows[i][field]=dict[k];
      }
    }
    for(let i=0;i<edges;i++){
      const shape=uint(),inner=Math.floor(shape/2);
      if(inner>bytes.length-at)throw Error('Invalid road tile shape.');
      const coords=new Array(4+2*inner),a=starts[i],b=ends[i];
      coords[0]=xs[a];coords[1]=ys[a];coords[coords.length-2]=xs[b];coords[coords.length-1]=ys[b];
      rows[i][5]=shape%2;rows[i][6]=coords;
    }
    for(let axis=0;axis<2;axis++)for(const row of rows){
      const c=row[6];
      for(let j=axis+2;j<c.length-2;j+=2)c[j]=c[j-2]+signed();
    }
    if(at!==bytes.length)throw Error('Unexpected road tile trailing data.');
    return rows;
  }
  async function content(response){
    const bytes=new Uint8Array(await response.arrayBuffer());
    if(bytes[0]!==31||bytes[1]!==139)return bytes;
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  function tileURL(base,key){
    return base+key+'.gz'+(base==='vn-roads/'?'?format=packed':'');
  }
  function roadRows(index){
    const extra=new Set(index.sightAccess?.tiles),only=new Set(index.sightAccess?.only);
    return async(key,base,read)=>{
      if(!extra.has(key))return read(tileURL(base,key));
      const [roads,access]=await Promise.all([only.has(key)?[]:read(tileURL(base,key)),read('vn-access/'+key+'.gz')]);
      return roads.concat(access);
    };
  }
  function routeCosts(bytes){
    if(bytes.length%4===0)return new Int32Array(bytes.buffer,bytes.byteOffset,bytes.length/4);
    if(bytes.length%4!==1||bytes[0]!==86||bytes[1]!==82||bytes[2]!==67||bytes[3]!==49||bytes[4]!==0)
      throw Error('Invalid route cost matrix.');
    const count=(bytes.length-5)/4,values=new Int32Array(count);
    let value=0;
    for(let i=0;i<count;i++){
      const p=5+i;
      const delta=bytes[p]|(bytes[p+count]<<8)|(bytes[p+2*count]<<16)|(bytes[p+3*count]<<24);
      value=(value+delta)|0;
      values[i]=value;
    }
    return values;
  }
  return {packed,decode,content,tileURL,roadRows,routeCosts};
})();

;
// bridge-profiles.js
'use strict';

// Relative heights in metres. OSM layer specifies the order of decks. Surveyed
// deck elevations are generally unavailable in the national extract.
function buildBridgeProfiles(graph,details={}){
  const profiles=new Map(),levels=new Map(),grade=.095;
  const spans=[...graph.edges.values()].filter(edge=>edge.traffic?.bridge);
  // Layer 3 often marks a single flyover above a surface street. Count the
  // bridge decks actually crossing below each span, including stacked ramps.
  const layer=edge=>details[edge.id]?.layer??1,remaining=new Set(spans),chains=[];
  for(const first of spans){
    if(!remaining.delete(first))continue;
    const chain=[first];
    for(let i=0;i<chain.length;i++)for(const node of [chain[i].start,chain[i].end]){
      for(const next of graph.nodes.get(node)||[])if(layer(next)===layer(first)&&remaining.delete(next))chain.push(next);
    }
    chains.push(chain);
  }
  const grid=new Map();
  function crossingTier(chain){
    let tier=1;
    const sections=[];
    for(const edge of chain)for(let i=1;i<edge.points.length;i++){
      const a=edge.points[i-1],b=edge.points[i],dx=b.x-a.x,dz=b.z-a.z;
      const cells=new Set(),steps=Math.ceil(Math.hypot(dx,dz)/64);
      let px=Math.floor(a.x/64),pz=Math.floor(a.z/64);
      for(let k=1;k<=steps;k++){
        const x=Math.floor((a.x+dx*k/steps)/64),z=Math.floor((a.z+dz*k/steps)/64);
        for(let c=Math.min(px,x);c<=Math.max(px,x);c++)for(let r=Math.min(pz,z);r<=Math.max(pz,z);r++)cells.add(c+','+r);
        px=x;pz=z;
      }
      for(const cell of cells)for(const line of grid.get(cell)||[]){
        if(layer(line.edge)>=layer(edge)||line.edge.start===edge.start||line.edge.end===edge.end||
          line.edge.start===edge.end||line.edge.end===edge.start)continue;
        const det=dx*line.dz-dz*line.dx;
        if(Math.abs(det)<1e-5)continue;
        const x=line.a.x-a.x,z=line.a.z-a.z,t=(x*line.dz-z*line.dx)/det,u=(x*dz-z*dx)/det;
        if(t>=0&&t<=1&&u>=0&&u<=1)tier=Math.max(tier,line.tier+1);
      }
      sections.push({a,dx,dz,edge,cells});
    }
    for(const line of sections){
      line.tier=tier;
      for(const cell of line.cells){
        if(!grid.has(cell))grid.set(cell,[]);
        grid.get(cell).push(line);
      }
    }
    return tier;
  }
  function record(edge){
    let profile=profiles.get(edge.id);
    if(!profile){profile={bridge:false,layer:0,ranges:[]};profiles.set(edge.id,profile);}
    return profile;
  }
  function pinned(node){
    const links=graph.nodes.get(node)||[];
    return links.some(e=>e.traffic?.tunnel&&!e.traffic.bridge)||links.length!==2&&links.some(e=>!e.traffic?.bridge);
  }
  // A span may consist of many short ways or routing edges. Estimate the
  // clearance for the crossing as a whole and preserve explicitly stacked decks.
  for(const chain of chains.sort((a,b)=>layer(a[0])-layer(b[0]))){
    const tier=crossingTier(chain);
    let length=0,major=false,navigation=0;
    for(const edge of chain){
      length+=edge.length;
      const mid=graph.sample({edge,s:edge.length/2,dir:1});
      navigation=Math.max(navigation,window.VietnamBridgeSignatures?.clearance?.(graph,mid.x,mid.z)||0);
      major||=/^(?:motorway|trunk|primary)/.test(edge.kind)||/cầu vượt/i.test(edge.name);
    }
    const clearance=major?6.8:Math.min(6.8,1+length*.085);
    for(const edge of chain){
      const info=record(edge),extra=details[edge.id]||{};
      Object.assign(info,extra,{bridge:true,layer:extra.layer??1,ranges:[[0,edge.length]]});
      const terrainLift=Number.isFinite(extra.terrainLift)?extra.terrainLift:clearance;
      info.top=info.structure==='low_water_crossing'||info.structure==='floating'?.55:
        Math.max(.8,navigation,terrainLift+(tier-1)*6.8);
      for(const node of [edge.start,edge.end]){
        if(!pinned(node))levels.set(node,Math.max(levels.get(node)||0,info.top));
      }
    }
  }
  return solveRoadGrades(graph,profiles,levels,grade,pinned,e=>!e.traffic?.tunnel,record);
}

// Shared by elevated decks and descending tunnel approaches. All displacements
// are magnitudes here; the caller places them above or below the natural surface.
function solveRoadGrades(graph,profiles,levels,grade,pinned,eligible,record){
  const spans=new Set(profiles.keys());
  // Carry approaches along the connected carriageway only. A surface junction
  // pins the road back to grade. A geometric crossing is never a graph node.
  const queue=[...levels.keys()];
  for(let i=0;i<queue.length;i++){
    const node=queue[i],h=levels.get(node);
    for(const edge of graph.nodes.get(node)||[]){
      if(spans.has(edge.id)||!eligible(edge))continue;
      record(edge,node);
      const other=node===edge.start?edge.end:edge.start,next=h-(profiles.get(edge.id).grade??grade)*edge.length;
      if(next>(levels.get(other)||0)+1e-6&&!pinned(other)){
        levels.set(other,next);queue.push(other);
      }
    }
  }
  // Bound grades through consecutive short edges, including transitions
  // between two signed OSM layers at a motorway interchange.
  const relax=[];
  function limit(node,h){
    if(h+1e-6<(levels.get(node)||0)){levels.set(node,h);relax.push(node);}
  }
  for(const id of profiles.keys()){
    const e=graph.edges.get(id),rise=e.length*(profiles.get(id).grade??grade);
    limit(e.start,(levels.get(e.end)||0)+rise);
    limit(e.end,(levels.get(e.start)||0)+rise);
  }
  for(let i=0;i<relax.length;i++){
    const node=relax[i];
    for(const e of graph.nodes.get(node)||[])if(profiles.has(e.id))
      limit(node===e.start?e.end:e.start,levels.get(node)+(profiles.get(e.id).grade??grade)*e.length);
  }
  for(const [id,p] of profiles){
    const e=graph.edges.get(id);
    p.start=levels.get(e.start)||0;p.end=levels.get(e.end)||0;
    if(spans.has(id))continue;
    const slope=p.grade??grade,a=Math.min(e.length,p.start/slope),b=Math.max(0,e.length-p.end/slope);
    if(a>=b)p.ranges=[[0,e.length]];
    else{
      if(a>0)p.ranges.push([0,a]);
      if(b<e.length)p.ranges.push([b,e.length]);
    }
    if(!p.ranges.length)profiles.delete(id);
  }
  function lift(edge,s){
    const p=profiles.get(edge.id);
    if(!p)return 0;
    const a=Math.max(0,Math.min(edge.length,s)),b=edge.length-a;
    if(a===0)return p.start;
    if(b===0)return p.end;
    const slope=p.grade??grade,approach=Math.max(0,p.start-slope*a,p.end-slope*b);
    return spans.has(edge.id)?Math.max(approach,Math.min(p.top,p.start+slope*a,p.end+slope*b)):approach;
  }
  return {profiles,lift};
}

// The ordinary terrain road builder still owns the portion of a long approach
// beyond the ramp. Its endpoints agree with the mesh and physics profiles.
function bridgeGroundEdges(graph,edges){
  const result=[];
  for(const edge of edges){
    const profile=graph.bridges?.profiles.get(edge.id)||graph.tunnels?.info(edge);
    if(!profile){result.push(edge);continue;}
    let from=0;
    for(const [lo,hi] of [...profile.ranges,[edge.length,edge.length]]){
      if(lo-from>.01){
        const points=[graph.sample({edge,s:from,dir:1})];
        for(let i=1;i<edge.dist.length-1;i++)if(edge.dist[i]>from&&edge.dist[i]<lo)points.push(edge.points[i]);
        points.push(graph.sample({edge,s:lo,dir:1}));
        result.push({...edge,points,controls:edge.controls?.filter(point=>point.s>=from&&point.s<=lo),
          sourceEdge:edge});
      }
      from=hi;
    }
  }
  return result;
}

// Lengths of the scenery meshes already authored for these individual bridges.
// Only their occupied deck footprint suppresses the standard rail and pier kit.
const modeledBridgeLengths={'cau-rong':636,'cau-truong-tien':402,'cau-nhat-le':635,'cau-da-cua-dong-dong-hoi':39,
  'cau-song-han':260,'cau-tran-thi-ly':320,'cau-thuan-phuoc':360,'cau-treo-kon-klor':215,
  'cau-cua-hoi':360,'cau-ben-thuy':230,'cau-yen-xuan':230,'cau-ham-rong':164};

function createBridgeDistrict(graph,edges,cx,cz,ground){
  const info=edge=>graph.bridges.profiles.get(edge.id);
  const raised=edges.filter(info),origins=new Map();
  function height(edge,s){
    const p=graph.sample({edge,s,dir:1}),profile=info(edge);
    if(!profile?.bridge)return ground(p.x,p.z)+graph.bridges.lift(edge,s);
    if(!origins.has(edge.id)){
      const a=edge.points[0],b=edge.points.at(-1);
      origins.set(edge.id,[ground(a.x,a.z),ground(b.x,b.z)]);
    }
    const [a,b]=origins.get(edge.id);
    return a+(b-a)*s/edge.length+graph.bridges.lift(edge,s);
  }
  function at(x,z,edge){
    if(!edge||!info(edge))return null;
    const cursor=graph.nearest(x,z,[edge]);
    if(!cursor||cursor.error>(worldRoadHalfWidth(edge)+.65)**2)return null;
    if(!info(edge).bridge&&graph.bridges.lift(edge,cursor.s)<=.001)return null;
    return height(edge,cursor.s);
  }
  const models=[];
  for(const data of window.VietnamLandmarks?.entries||[]){
    const length=modeledBridgeLengths[data.id];
    if(!length||!data.build)continue;
    const p=graph.point(data.lon,data.lat);
    if(Math.hypot(p.x-cx,p.z-cz)>2200)continue;
    models.push({...p,data,length,cos:Math.cos(data.yaw),sin:Math.sin(data.yaw)});
  }
  function authoredAt(edge,s){
    if(!models.length||!info(edge)?.bridge)return false;
    const p=graph.sample({edge,s,dir:1});
    return models.some(m=>{
      const dx=p.x-m.x,dz=p.z-m.z;
      return Math.abs(dx*m.cos-dz*m.sin)<m.length/2&&Math.abs(dx*m.sin+dz*m.cos)<m.data.depth/2+2;
    });
  }
  function signatureHeight(x,z,ux,uz){
    let best=null;
    for(const e of graph.nearby(x,z,50)){
      if(!info(e)?.bridge)continue;
      const c=graph.nearest(x,z,[e]);
      if(!c||c.error>=(worldRoadHalfWidth(e)+30)**2||best&&c.error>=best.error)continue;
      if(ux!==undefined){
        const {yaw}=graph.sample(c);
        if(Math.abs(Math.sin(yaw)*ux-Math.cos(yaw)*uz)<.82)continue;
      }
      best=c;
    }
    return best?height(best.edge,best.s):null;
  }
  const footbridges=[],seen=new Set(),[west,north]=graph.geo(cx-900,cz-900),[east,south]=graph.geo(cx+900,cz+900);
  for(let i=Math.floor(west*4);i<=Math.floor(east*4);i++)for(let j=Math.floor(south*4);j<=Math.floor(north*4);j++){
    for(const [id,kind,layer,width,coords] of graph.footbridgeTiles[i+'_'+j]||[]){
      if(seen.has(id))continue;
      seen.add(id);
      const points=[];
      for(let n=0;n<coords.length;n+=2)points.push(graph.point(coords[n]/1e5,coords[n+1]/1e5));
      footbridges.push({id,kind,layer,width,points});
    }
  }
  return {edges:raised,bridgeInfo:info,height,at,authoredAt,signatureHeight,footbridges};
}

;
// tunnel-profiles.js
'use strict';

function buildTunnelProfiles(graph,data){
  const profiles=new Map(),levels=new Map(),inside=data?.inside||{};
  const passages=new Set(data?.passages||[]),immersedNodes=new Set(),grade=.075;
  const isBore=e=>e.traffic?.tunnel&&!e.traffic.bridge;
  function portal(node){
    if(data)return !Object.hasOwn(inside,node);
    const links=graph.nodes.get(node)||[];
    return links.length===1||links.some(e=>!isBore(e));
  }
  function pinned(node){
    const links=graph.nodes.get(node)||[];
    return links.some(e=>passages.has(e.id)||graph.bridges.profiles.has(e.id))||
      links.length!==2&&links.some(e=>!isBore(e));
  }
  function approach(e,from){
    if(!profiles.has(e.id))profiles.set(e.id,{bore:false,ranges:[]});
    if(immersedNodes.has(from)){
      profiles.get(e.id).grade=.04;
      immersedNodes.add(from===e.start?e.end:e.start);
    }
  }
  for(const e of graph.edges.values())if(isBore(e)){
    const passage=passages.has(e.id),clearance=data?.clearance?.[e.id];
    const immersed=/sông sài gòn|thủ thiêm/i.test(e.name||'');
    // The Sài Gòn immersed crossing has 185 m and 215 m open approaches and a
    // maximum longitudinal grade of 4%. Its floor datum is approximate.
    const entrance=passage?0:immersed?7.6:(clearance??5.4)+1.4,top=immersed?24:entrance;
    profiles.set(e.id,{bore:true,passage,clearance,top,grade:immersed?.04:grade,ranges:[[0,e.length]]});
    for(const node of [e.start,e.end]){
      if(immersed)immersedNodes.add(node);
      if(!pinned(node))levels.set(node,Math.max(levels.get(node)||0,portal(node)?entrance:top));
    }
  }
  const {lift}=solveRoadGrades(graph,profiles,levels,grade,pinned,e=>!graph.bridges.profiles.has(e.id),approach);
  return {profiles,info:e=>profiles.get(e.id),portal,lift:(edge,s)=>0-lift(edge,s),inside};
}

function createTunnelDistrict(graph,edges,ground){
  const profiles=graph.tunnels,heights=new Map(),sections=new Map();
  // Use elevations at the real entrances. The internal OSM nodes of a
  // mountain bore are below the DEM surface, even when a tile ends there.
  function base(node,p){
    if(heights.has(node))return heights.get(node);
    const a=profiles.inside[node];
    let h;
    if(a){
      const p=graph.point(a[0]/1e5,a[1]/1e5);
      h=ground(p.x,p.z);
      if(a.length===6){
        const q=graph.point(a[3]/1e5,a[4]/1e5),f=a[2]/(a[2]+a[5]||1);
        h+=(ground(q.x,q.z)-h)*f;
      }
    }else h=ground(p.x,p.z);
    heights.set(node,h);return h;
  }
  function height(edge,s){
    const info=profiles.info(edge);
    if(info?.bore&&!info.passage){
      const a=base(edge.start,edge.points[0]),b=base(edge.end,edge.points.at(-1));
      return a+(b-a)*s/edge.length+profiles.lift(edge,s);
    }
    const p=graph.sample({edge,s,dir:1});
    return ground(p.x,p.z)+profiles.lift(edge,s);
  }
  function section(e){
    if(!sections.has(e.id))sections.set(e.id,tunnelSection(e,graph));
    return sections.get(e.id);
  }
  function at(x,z,e,margin=.6){
    const info=e&&profiles.info(e);
    if(!info)return null;
    const c=graph.nearest(x,z,[e]);
    if(!c||c.error>(section(e).innerHalfWidth+margin)**2||
       !info.bore&&profiles.lift(e,c.s)>-.001)return null;
    return height(e,c.s);
  }
  return {edges:edges.filter(e=>profiles.info(e)),at,height,section};
}

// Cut only fragments of terrain or water that intersect the road's vertical
// clearance. A hillside, river surface or street above the crown stays intact.
function createTunnelCut(T){
  const size=768,metres=2,canvas=document.createElement('canvas');
  canvas.width=canvas.height=size;
  const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.generateMipmaps=false;
  texture.minFilter=texture.magFilter=T.NearestFilter;
  const box={value:new T.Vector4(0,0,0,0)},map={value:texture},ctx=canvas.getContext('2d');
  function update(graph,zone,cx,cz){
    box.value.w=0;
    if(!zone?.edges.length)return;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,size,size);
    const span=size*metres,left=Math.floor(cx/metres)*metres-span/2,top=Math.floor(cz/metres)*metres-span/2;
    ctx.setTransform(1/metres,0,0,1/metres,-left/metres,-top/metres);
    ctx.lineCap='butt';
    for(const e of zone.edges){
      const info=graph.tunnels.info(e),section=zone.section(e);
      ctx.lineWidth=2*section.innerHalfWidth;
      for(const [lo,hi] of info.ranges)for(let j=1;j<e.dist.length;j++){
        const start=Math.max(lo,e.dist[j-1]),end=Math.min(hi,e.dist[j]);
        if(end<=start)continue;
        const a=e.points[j-1],b=e.points[j];
        if(Math.max(a.x,b.x)<left-25||Math.min(a.x,b.x)>left+span+25||
           Math.max(a.z,b.z)<top-25||Math.min(a.z,b.z)>top+span+25)continue;
        const n=Math.ceil((end-start)/8);
        let p=graph.sample({edge:e,dir:1,s:start});
        for(let k=1;k<=n;k++){
          const s=start+k*(end-start)/n,q=graph.sample({edge:e,dir:1,s});
          const h=zone.height(e,s-.5*(end-start)/n);
          const v=Math.max(0,Math.min(65535,Math.round(h*8)+32768));
          const cap=Math.min(255,Math.ceil(8*(info.bore?section.crown+.12:28)));
          ctx.strokeStyle='rgb('+(v>>8)+','+(v&255)+','+cap+')';
          ctx.beginPath();ctx.moveTo(p.x,p.z);ctx.lineTo(q.x,q.z);ctx.stroke();p=q;
        }
      }
    }
    box.value.set(left,top,1/span,1);texture.needsUpdate=true;
  }
  function shade(shader,xz){
    shader.uniforms.tunnelCutBox=box;shader.uniforms.tunnelCutMap=map;
    shader.vertexShader='varying float tunnelSceneY;\n'+shader.vertexShader.replace('#include <project_vertex>',
      'tunnelSceneY=(modelMatrix*vec4(transformed,1.)).y;\n#include <project_vertex>');
    shader.fragmentShader='varying float tunnelSceneY;uniform sampler2D tunnelCutMap;uniform vec4 tunnelCutBox;\n'+
      shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
      if(tunnelCutBox.w>0.){
        vec2 uv=(${xz}-tunnelCutBox.xy)*tunnelCutBox.z;
        if(all(greaterThanEqual(uv,vec2(0.)))&&all(lessThanEqual(uv,vec2(1.)))){
          vec4 cut=texture2D(tunnelCutMap,uv);
          float floorY=(dot(floor(cut.rg*255.+.5),vec2(256.,1.))-32768.)*.125;
          if(cut.a>.45&&tunnelSceneY>floorY-.8&&tunnelSceneY<floorY+cut.b*31.875)discard;
        }
      }`);
  }
  return {update,shade};
}

;
// bridge-signatures.js
'use strict';
(() => {
  // The two points are on the median between the mapped carriageways. They locate
  // the first and last main pylons (arch springings for Đông Trù and Bình Lợi).
  // Ba Son's second point sets the direction towards Thủ Thiêm.
  const bridges = [
    // IHI / JSCE, Nhật Tân, 150 + 4 × 300 + 150 m: www.jsce.or.jp/committee/concrete/e/newsletter/newsletter43/Newsletter43_files/Tanaka%20award/1.pdf
    {name:'Nhật Tân', a:[105.819069,21.089183], b:[105.823701,21.099096], form:'diamond',
      towers:5, outer:150, halfWidth:18, height:78, stays:11},
    // TEDI's drawings give twin decks and the 20 / 30 / 20 m parabolas: tedi.vn/wp-content/uploads/2018/05/4.pdf
    {name:'Đông Trù', a:[105.878845,21.070094], b:[105.877360,21.072202], form:'arch',
      spans:[80,120,80], rises:[20,30,20], halfWidth:26, paint:0xe6e7e2},
    // Shimizu, single central plane: www.shimz-global.com/vn/en/works/detail/index.html?id=277
    // 50 m navigation clearance: dulich.quangninh.gov.vn/Trang/ChiTietTinTuc.aspx?Page=4&nid=807
    {name:'Bãi Cháy', a:[107.064007,20.960834], b:[107.067882,20.959353], form:'median',
      towers:2, outer:205, halfWidth:12.7, height:90, stays:14, clearance:50},
    // Upper deck, twin 90 m spans and a parabolic transverse pylon. The 150 m roundabout below is a separate OSM road.
    // TEDI design and sections: tedi.vn/wp-content/uploads/2016/12/6-1.pdf
    {name:'Cầu vượt Ngã ba Huế', a:[108.178826,16.062036], b:[108.179626,16.062646], form:'parabolic',
      halfWidth:9.9, height:48, outer:90},
    // Road bridge on Phạm Văn Đồng, two parallel Nielsen arches: baochinhphu.vn/lap-vom-thep-thu-2-tren-cau-binh-loi-102115203.htm
    {name:'Bình Lợi', a:[106.708901,10.824488], b:[106.710225,10.824842], form:'arch',
      spans:[150], rises:[35], halfWidth:28, paint:0xc7432f, inclinedHangers:true},
    // WSP / Freyssinet, 200 + 115 m, pylon curves toward Thủ Thiêm: www.wsp.com/en-us/projects/thu-thiem-2-cable-stayed-bridge
    {name:'Ba Son', a:[106.710125,10.779562], b:[106.710925,10.779125], form:'curved',
      halfWidth:13.5, height:91, clearance:10},
    // Main span 380 m; H-frame towers. www.norway-steel.no/project/phu-my-bridge
    {name:'Phú Mỹ', a:[106.742693,10.744060], b:[106.745812,10.745571], form:'portal',
      towers:2, outer:162.5, halfWidth:14, height:94, stays:18, crossbar:.36, clearance:45},
    // The original QL1 bridge, 350 m between H towers, 128 stays. www.concrete.org/publications/internationalconcreteabstractsportal.aspx?id=11400
    {name:'Mỹ Thuận', a:[105.910603,10.275936], b:[105.909492,10.278895], form:'portal',
      towers:2, outer:155, halfWidth:12.7, height:80, stays:16, crossbar:.82, clearance:37.5},
    // DFAT, 150 + 350 + 150 m, H towers and two semi-fan planes: www.dfat.gov.au/sites/default/files/cao-lanh-inception-report-pd.pdf
    {name:'Cao Lãnh', a:[105.651708,10.410903], b:[105.651973,10.414048], form:'portal',
      towers:2, outer:150, halfWidth:13, height:80, stays:16, crossbar:.66, clearance:37.5},
    // Actual tower and cable geometry take precedence over the suspension tag on some OSM ways.
    // JICA, table 12.7 and fig. 12.44: openjicareport.jica.go.jp/pdf/12384244_02.pdf
    {name:'Cần Thơ', a:[105.810730,10.033292], b:[105.814622,10.036423], form:'invertedY',
      towers:2, outer:257, halfWidth:13.8, height:119, stays:27, cable:0xc45337, clearance:39}
  ];

  const projections = new WeakMap();
  function projected(graph) {
    if (projections.has(graph)) return projections.get(graph);
    const shapes = bridges.map(bridge => {
      const a = graph.point(...bridge.a), b = graph.point(...bridge.b);
      const length = Math.hypot(b.x-a.x,b.z-a.z);
      const ux = (b.x-a.x)/length, uz = (b.z-a.z)/length;
      const start = bridge.form === 'curved' ? -200 : -(bridge.outer || 0);
      const end = bridge.form === 'curved' ? 115 : bridge.form === 'parabolic' ? bridge.outer : length + (bridge.outer || 0);
      return {bridge,a,length,ux,uz,start,end};
    });
    projections.set(graph,shapes);
    return shapes;
  }
  function within(shape,x,z,margin) {
    const {a,ux,uz,start,end,bridge} = shape, dx=x-a.x, dz=z-a.z;
    const along=dx*ux+dz*uz, across=dz*ux-dx*uz;
    return along>=start-margin && along<=end+margin && Math.abs(across)<=bridge.halfWidth+margin;
  }
  function covers(graph,x,z) {
    return projected(graph).some(shape=>within(shape,x,z,2));
  }
  // Main-channel navigation clearance in metres. The road profile builds its approaches independently.
  // DFAT: www.dfat.gov.au/sites/default/files/my_thuan_monitoring_report.pdf
  // Cần Thơ: baochinhphu.vn/niem-vui-lon-tu-doi-bo-song-hau-10233044.htm
  // Phú Mỹ: bmt-group.vn/en/phu-my-bridge-pj1
  // Ba Son: WSP, Integration of FEM Analysis and Construction Geometry Management, 31. Dresdner Brückenbausymposium.
  function clearance(graph,x,z) {
    return projected(graph).find(shape=>shape.bridge.clearance && within(shape,x,z,2))?.bridge.clearance ?? null;
  }

  const concrete=0xc3c3b9, cableSteel=0xd0d5d2, sockets=0x82867e;
  // Relative stations and offsets in metres. Elevation follows the simulated deck
  // at each station, including the rise on the two sides of the river.
  function draw({graph,x,z,radius,deckHeight,groundHeight,beam}) {
    for (const shape of projected(graph)) {
      if (!within(shape,x,z,radius)) continue;
      const {bridge,a,length,ux,uz} = shape;
      const heights=new Map();
      function point(station,side,rise) {
        const cx=a.x+ux*station, cz=a.z+uz*station;
        if (!heights.has(station)) heights.set(station,deckHeight(cx,cz,ux,uz));
        const h=heights.get(station);
        if (!Number.isFinite(h)) return null;
        return {x:cx-uz*side, y:h+rise, z:cz+ux*side};
      }
      function bar(from,to,width,depth,color) {
        if (from && to) beam(from,to,width,depth,color);
      }
      // OSM draws one line per direction even on a single physical deck.
      // Carry its slab beneath both asphalt ribbons, the median and shoulders.
      // The two parallel arch structures keep their individual decks.
      if(bridge.form!=='arch'&&bridge.form!=='parabolic'){
        const {start,end}=shape,count=Math.ceil((end-start)/12);
        let prev=point(start,0,-.78);
        for(let i=1;i<=count;i++){
          const next=point(start+(end-start)*i/count,0,-.78);
          bar(prev,next,bridge.halfWidth*2,1.25,0xabaea7);
          prev=next;
        }
      }
      // Broad footings sit at the actual main piers, clear of river traffic
      // and the lower circular carriageway of the Đà Nẵng interchange.
      function pier(station,topSide,footSide,width,depth) {
        const top=point(station,topSide,-1.5), foot=point(station,footSide,-1.5);
        if (!top || !foot) return;
        const ground=groundHeight?.(foot.x,foot.z);
        foot.y=Number.isFinite(ground)?Math.min(top.y-2,ground-4.5):top.y-32;
        bar(foot,top,width,depth,concrete);
      }
      if (bridge.form==='arch') drawArches(bridge,length,point,bar,pier);
      else if (bridge.form==='curved' || bridge.form==='parabolic') drawSinglePylon(bridge,point,bar,pier);
      else drawTowers(bridge,length,point,bar,pier);
    }
  }

  function drawTowers(bridge,length,point,bar,pier) {
    const {form,height,halfWidth,outer,stays,towers}=bridge, spacing=length/(towers-1);
    const tint=bridge.cable||cableSteel;
    for (let i=0;i<towers;i++) {
      const station=i*spacing;
      const level=(side,h)=>point(station,side,h);
      bar(level(-halfWidth,-1.6),level(halfWidth,-1.6),6.8,2.2,concrete);
      if (form==='median') pier(station,0,0,8,8);
      else for (const side of [-1,1]) pier(station,side*halfWidth,side*halfWidth*(form==='portal' ? .94 : .61),4.4,6.2);
      if (form==='median') {
        bar(level(0,-1.4),level(0,height),3.5,5,concrete);
      } else if (form==='portal') {
        for (const side of [-1,1]) bar(level(side*halfWidth,-2),level(side*halfWidth,height),2.8,4,concrete);
        bar(level(-halfWidth,height*bridge.crossbar),level(halfWidth,height*bridge.crossbar),3,3.4,concrete);
      } else {
        const joint = form==='invertedY' ? .45 : .79;
        for (const side of [-1,1]) bar(level(side*halfWidth,-1.8),level(0,height*joint),3,4.6,concrete);
        bar(level(0,height*joint),level(0,height),3.6,4.6,concrete);
        if (form==='diamond') bar(level(0,height*.95),level(0,height+.5),3.7,4.7,0xbf4935);
      }
      for (const forward of [-1,1]) {
        const reach=(i===0 && forward<0 || i===towers-1 && forward>0) ? outer : spacing/2;
        const sides=form==='median' ? [0] : [-1,1];
        for (const side of sides) {
          for (let j=1;j<=stays;j++) {
            const t=j/stays, d=reach*(.09+.88*t);
            const h=form==='diamond' ? height*(.67+.24*t) : height*(.48+.49*t);
            const head=form==='portal' ? side*halfWidth : form==='diamond' ? side*halfWidth*Math.max(0,1-h/(height*.79)) : 0;
            const foot=point(station+forward*d,side*halfWidth,.4);
            bar(level(head,h),foot,.18,.18,tint);
            bar(foot,point(station+forward*d,side*halfWidth,1.0),.45,.56,sockets);
          }
        }
      }
    }
    if (form==='diamond') {
      // Nhật Tân's red outer girders also mark the main spans from the riverbank.
      const start=-outer, end=length+outer, segments=Math.ceil((end-start)/30);
      for (let i=0;i<segments;i++) for (const side of [-1,1]) {
        const d0=start+(end-start)*i/segments, d1=start+(end-start)*(i+1)/segments;
        bar(point(d0,side*halfWidth,-.9),point(d1,side*halfWidth,-.9),.48,1.55,0xb54b37);
      }
    }
  }

  function drawArches(bridge,length,point,bar,pier) {
    const {spans,rises,halfWidth,paint,inclinedHangers}=bridge;
    const total=spans.reduce((sum,span)=>sum+span,0);
    let start=0;
    function support(station) {
      bar(point(station,-halfWidth,-1.5),point(station,halfWidth,-1.5),3.8,1.6,concrete);
      for (const side of [-1,1]) pier(station,side*halfWidth*.52,side*halfWidth*.52,5.2,4.3);
    }
    support(start);
    for (let n=0;n<spans.length;n++) {
      const span=spans[n]*length/total, rise=rises[n], count=Math.ceil(span/6);
      for (const side of [-1,1]) {
        // Two independent arch bridges, one on either side of the median.
        const outer=side*(halfWidth-1), inner=side*1.45;
        const rib=(k,offset,dy=0)=> {
          const t=k/count;
          return point(start+span*t,offset,.42+4*t*(1-t)*rise+dy);
        };
        for (let k=1;k<=count;k++) {
          for (const offset of [inner,outer]) {
            bar(rib(k-1,offset),rib(k,offset),1.0,inclinedHangers?1.55:1.15,paint);
            if (!inclinedHangers) bar(rib(k-1,offset,-1.55),rib(k,offset,-1.55),.85,1.1,paint);
            if (k===count) continue;
            const shift=inclinedHangers ? (k%2===0?1:-1)*.9 : 0;
            bar(rib(k,offset),point(start+span*(k+shift)/count,offset,.5),.12,.12,cableSteel);
          }
          if (k%3===0 && k/count>.12 && k/count<.88) {
            bar(rib(k,inner),rib(k,outer),.58,.58,paint);
            if (!inclinedHangers) bar(rib(k-2,inner),rib(k,outer),.3,.3,paint);
          }
        }
      }
      start+=span;
      support(start);
    }
  }

  function drawSinglePylon({form,height,halfWidth},point,bar,pier) {
    const flyover=form==='parabolic', count=flyover?11:14;
    for (const side of [-1,1]) {
      const foot=side*(halfWidth+(flyover?7:1));
      // Ba Son's A frame leans east along the bridge; at Ngã ba Huế the
      // transverse parabola and golden stays frame the upper road.
      const spine=t=>point(flyover?0:28*t*t,foot*(flyover?Math.sqrt(1-t):1-t),height*t);
      pier(0,foot,foot*(flyover?1.14:1.05),flyover?3:4,flyover?4:6);
      for (let i=1;i<=16;i++) {
        const t=i/16;
        bar(spine((i-1)/16),spine(t),flyover?2.5:3.6-1.8*t,flyover?3.8:7-3*t,concrete);
      }
      for (let i=1;i<=count;i++) {
        const t=i/count, h=(flyover ? .40 : .24)+(flyover ? .56 : .72)*t;
        for (const direction of [-1,1]) {
          const d=flyover ? 12+(i-1)*7.2 : direction<0 ? 200*(.08+.91*t) : 115*(.34+.65*t);
          bar(spine(h),point(direction*d,side*(halfWidth-.7),.55),.2,.2,flyover?0xeeb349:cableSteel);
        }
      }
    }
  }

  window.VietnamBridgeSignatures={draw,covers,clearance};
})();

;
// world-roads.js
'use strict';
// Pine avenue at Biển Hồ Chè (w741701067). The paved road is about 6.8 m
// wide between the two earth shoulders. Use OSM junctions across tile splits.
(globalThis.VietnamRoadWidths??=new Map()).set('6943315929:7799883179',3.4);
// The lane outside Bửu Minh is about 5.1 m across at both gates, with earth
// shoulders. Its tertiary classification alone would produce a much wider road.
globalThis.VietnamRoadWidths.set('7650858866:7650873693',2.55);
async function fetchMapTile(url){
 const response=await fetch(url);
 if(!response.ok)throw Error('Không tải được vùng bản đồ.');
 return RoadTileCodec.decode(await RoadTileCodec.content(response));
}
// Keep only the tiles around the current drive. OSM node IDs, rather than coordinates,
// connect edges so an overpass does not accidentally become a turn.
class VietnamRoads {
 constructor(index,lon,lat){
   this.readRows=RoadTileCodec.roadRows(index);
   this.available=new Set([...index.tiles,...(index.sightAccess?.addedParents||[])]);
   this.splits=index.splits||{};this.subtiles=new Set([...(index.subtiles||[]),...(index.sightAccess?.addedSubtiles||[])]);
   this.visitorEdges=new Set(Object.values(index.sightAccess?.stops||{}).map(stop=>stop[0]));
   this.remote=index.tileBase;this.local=new Set(index.localTiles||[]);this.lon=lon;this.lat=lat;
   this.trafficTiles=new Set(index.trafficTiles||[]);
   this.bridgeDetails=index.bridgeDetails||{};
   this.footbridgeTiles=index.footbridgeTiles||{};
   this.tunnelData=index.tunnelData;
   this.mx=111320*Math.cos(lat*Math.PI/180);this.my=110900;
   this.cache=new Map();this.edges=new Map();this.nodes=new Map();this.buckets=new Map();
   this.turnOptions=new Map();this.edgeCells=new WeakMap();this.stamp=0;
 }
 point(lon,lat){return {x:(lon-this.lon)*this.mx,z:(this.lat-lat)*this.my};}
 geo(x,z){return [this.lon+x/this.mx,this.lat-z/this.my];}
 decodeEdge([id,start,end,name,kind,oneway,coords]){
   const points=[],dist=[];let length=0,minX=Infinity,minZ=Infinity,maxX=-Infinity,maxZ=-Infinity;
   for(let i=0;i<coords.length;i+=2){
     const p=this.point(coords[i]/100000,coords[i+1]/100000),last=points.at(-1);
     if(last){const d=Math.hypot(last.x-p.x,last.z-p.z);if(d<.1)continue;length+=d;}
     points.push(p);dist.push(length);
     minX=Math.min(minX,p.x);minZ=Math.min(minZ,p.z);maxX=Math.max(maxX,p.x);maxZ=Math.max(maxZ,p.z);
   }
   if(length<.5)return null;
   const edge={id,start,end,name,kind,oneway:Boolean(oneway),points,dist,length,minX,minZ,maxX,maxZ,visitorRoad:this.visitorEdges.has(id)};
   if(kind==='service'||kind==='residential'||kind==='tertiary')edge.authoredHalfWidth=globalThis.VietnamRoadWidths.get(Math.min(start,end)+':'+Math.max(start,end));
   return edge;
 }
 async tile(key){
   if(!this.cache.has(key)){
     const pending=(async()=>{
       const base=this.remote&&!this.local.has(key)?this.remote:'vn-roads/';
       const [rows,details]=await Promise.all([this.readRows(key,base,fetchMapTile),this.trafficTiles.has(key)
         ?fetchMapTile('vn-traffic/'+key+'.gz').catch(()=>null):undefined]);
       if(details===null)this.cache.delete(key);
       return {rows,details};
     })().catch(e=>{this.cache.delete(key);throw e;});
     this.cache.set(key,pending);
   }return this.cache.get(key);
 }
 async load(x,z,wide=false){
   const [lon,lat]=this.geo(x,z),r=wide?.13:.022,keys=[];
   for(let a=Math.floor((lon-r)*4);a<=Math.floor((lon+r)*4);a++)
     for(let b=Math.floor((lat-r)*4);b<=Math.floor((lat+r)*4);b++){
       const key=a+'_'+b;if(!this.available.has(key))continue;
       const split=this.splits[key];
       if(!split){keys.push(key);continue;}
       for(let i=Math.max(0,Math.floor(((lon-r)*4-a)*split));i<=Math.min(split-1,Math.floor(((lon+r)*4-a)*split));i++)
         for(let j=Math.max(0,Math.floor(((lat-r)*4-b)*split));j<=Math.min(split-1,Math.floor(((lat+r)*4-b)*split));j++){
           const part=key+'_'+i+'_'+j;if(this.subtiles.has(part))keys.push(part);
         }
     }
   const signature=keys.join(','),stamp=++this.stamp;if(this.signature===signature)return;
   const tiles=await Promise.all(keys.map(k=>this.tile(k)));
   if(stamp!==this.stamp)return;
   const fresh=new Map(),nodes=new Map(),buckets=new Map(),updatedTags=[];
   const streaming=this.edges.size>0;
   let rowsSeen=0,deadline=performance.now()+3;
   const trafficById=new Map();
   for(const {details} of tiles)if(details)for(const [id,tags] of Object.entries(details))trafficById.set(Number(id),tags);
   for(const {rows} of tiles)for(const row of rows){
     if(streaming&&(++rowsSeen&63)===0&&performance.now()>=deadline){
       if(globalThis.scheduler?.yield)await scheduler.yield();
       else await new Promise(resolve=>setTimeout(resolve,0));
       if(stamp!==this.stamp)return;
       deadline=performance.now()+3;
     }
     const [id,start,end]=row;if(fresh.has(id))continue;
     let edge=this.edges.get(id);
     if(!edge){
       edge=this.decodeEdge(row);if(!edge)continue;
     }
     if(!edge.traffic&&trafficById.has(id)){
       const traffic=trafficById.get(id);
       const controls=(traffic.controls||[]).map(([node,lon,lat,flags,direction])=>{
         const p=this.point(lon/1e5,lat/1e5);
         const s=node===start?0:node===end?edge.length:this.nearest(p.x,p.z,[edge]).s;
         return {node,s,flags,direction};
       });
       if(this.edges.has(id))updatedTags.push({edge,traffic,controls});
       else Object.assign(edge,{traffic,controls});
     }
     fresh.set(id,edge);
     for(const n of new Set([start,end])){if(!nodes.has(n))nodes.set(n,[]);nodes.get(n).push(edge);}
     // Sample a long straight segment too, so the spatial index covers its middle.
     let cells=this.edgeCells.get(edge);
     if(!cells){
       cells=new Set();
       for(let i=1;i<edge.points.length;i++){
         const a=edge.points[i-1],b=edge.points[i],count=Math.ceil((edge.dist[i]-edge.dist[i-1])/120);
         for(let j=0;j<=count;j++){const f=j/count;cells.add(Math.floor((a.x+(b.x-a.x)*f)/300)+','+Math.floor((a.z+(b.z-a.z)*f)/300));}
       }
       this.edgeCells.set(edge,cells);
     }
     for(const k of cells){if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(edge);}
   }
   // Existing cursors can still be using these edges while a replacement is being built.
   for(const {edge,traffic,controls} of updatedTags)Object.assign(edge,{traffic,controls});
   this.edges=fresh;this.nodes=nodes;this.buckets=buckets;
   this.turnOptions.clear();this.lastNearby=null;
   this.bridges=buildBridgeProfiles(this,this.bridgeDetails);
   this.tunnels=buildTunnelProfiles(this,this.tunnelData);
   this.signature=tiles.some(tile=>tile.details===null)?null:signature;
   for(const k of this.cache.keys())if(!keys.includes(k))this.cache.delete(k);
 }
 nearby(x,z,r){
   const left=Math.floor((x-r)/300),right=Math.floor((x+r)/300),top=Math.floor((z-r)/300),bottom=Math.floor((z+r)/300);
   if(left===right&&top===bottom)return this.buckets.get(left+','+top)||[];
   const last=this.lastNearby;
   if(last&&last.left===left&&last.right===right&&last.top===top&&last.bottom===bottom)return last.edges;
   const unique=new Set();
   for(let a=left;a<=right;a++)
     for(let b=top;b<=bottom;b++)
       for(const e of this.buckets.get(a+','+b)||[])unique.add(e);
   const edges=[...unique];
   this.lastNearby={left,right,top,bottom,edges};return edges;
 }
 roadLevel(edge,s){
   return this.tunnels?.info(edge)?this.tunnels.lift(edge,s):this.bridges.lift(edge,s);
 }
 nearest(x,z,candidates=this.edges.values(),level=null){
   let best=null,bestScore=Infinity;
   for(const edge of candidates){
     const dx=Math.max(0,edge.minX-x,x-edge.maxX),dz=Math.max(0,edge.minZ-z,z-edge.maxZ);
     if(dx*dx+dz*dz>=bestScore)continue;
     for(let i=1;i<edge.points.length;i++){
       const a=edge.points[i-1],b=edge.points[i],vx=b.x-a.x,vz=b.z-a.z;
       const f=Math.max(0,Math.min(1,((x-a.x)*vx+(z-a.z)*vz)/(vx*vx+vz*vz)));
       const error=(a.x+vx*f-x)**2+(a.z+vz*f-z)**2;
       if(error>=bestScore)continue;
       const s=edge.dist[i-1]+f*(edge.dist[i]-edge.dist[i-1]);
       const vertical=level===null?0:this.roadLevel(edge,s)-level;
       if(level!==null&&Math.abs(vertical)>2.5)continue;
       const score=error+vertical*vertical*4;
       if(score<bestScore){bestScore=score;best={edge,s,dir:1,error};}
     }
   }return best;
 }
 sample(c,lane=0){
   const {edge,s,dir}=c,d=Math.max(0,Math.min(s,edge.length));
   let lo=0,hi=edge.dist.length-1;
   while(hi-lo>1){const m=(hi+lo)>>1;if(edge.dist[m]<=d)lo=m;else hi=m;}
   const a=edge.points[lo],b=edge.points[hi],f=(d-edge.dist[lo])/(edge.dist[hi]-edge.dist[lo]);
   const yaw=Math.atan2((b.x-a.x)*dir,(a.z-b.z)*dir);
   return {x:a.x+(b.x-a.x)*f+Math.cos(yaw)*lane,z:a.z+(b.z-a.z)*f+Math.sin(yaw)*lane,yaw};
 }
 allows(c,node,edge,dir){
   const rules=c.edge.traffic?.turns;
   if(!rules)return true;
   const mode=c.kind==='scooter'?2:1;
   let mandatory=false,allowed=false;
   for(const [,via,target,type,mask] of rules){
     if(via!==node||!(mask&mode))continue;
     let matches=edge.traffic?.way===target;
     if(matches&&target===c.edge.traffic.way&&type.endsWith('_u_turn'))matches=edge.id===c.edge.id&&dir===-c.dir;
     if(type.startsWith('only_')){mandatory=true;allowed||=matches;}
     else if(matches)return false;
   }
   return !mandatory||allowed;
 }
 options(c){
   // Heading and turn restrictions depend on the incoming edge, direction and vehicle class.
   const key=c.edge.id+':'+c.dir+(c.kind==='scooter'?':bike':'');
   const cached=this.turnOptions.get(key);
   if(cached)return cached;
   const node=c.dir>0?c.edge.end:c.edge.start,base=this.sample({...c,s:c.dir>0?c.edge.length:0}).yaw,list=[];
   for(const edge of this.nodes.get(node)||[])for(const dir of [1,-1]){
     if(dir<0&&edge.oneway||edge.id===c.edge.id&&dir===-c.dir)continue;
     if((dir>0?edge.start:edge.end)!==node)continue;
     if(!this.allows(c,node,edge,dir))continue;
     const next={edge,dir,s:dir>0?0:edge.length};
     const turn=this.sample(next).yaw-base;
     list.push({...next,angle:Math.atan2(Math.sin(turn),Math.cos(turn))});
   }
   list.sort((a,b)=>Math.abs(a.angle)-Math.abs(b.angle));
   this.turnOptions.set(key,list);return list;
 }
 advance(c,meters,choose){
   let moved=0;
   while(meters>0){
     const left=c.dir>0?c.edge.length-c.s:c.s;
     const step=Math.min(meters,Math.max(0,left));c.s+=c.dir*step;meters-=step;moved+=step;
     if(meters<=.00001)break;
     const options=this.options(c);
     let next=options.length?choose(options):null;
     const node=c.dir>0?c.edge.end:c.edge.start;
     if(!next&&!c.edge.oneway&&this.allows(c,node,c.edge,-c.dir))next={edge:c.edge,s:c.s,dir:-c.dir};
     if(!next)break;
     Object.assign(c,{edge:next.edge,dir:next.dir,s:next.s});
   }return moved;
 }
}
class VietnamWater {
 constructor(index,roads){this.tiles=new Set(index.tiles);this.cache=new Map();this.roads=roads;this.features=[];this.request=0;}
 async load(x,z){
   const request=++this.request,[lon,lat]=this.roads.geo(x,z),keys=[];
   const dx=1850/this.roads.mx,dy=1850/this.roads.my;
   for(let a=Math.floor((lon-dx)*4);a<=Math.floor((lon+dx)*4);a++)
     for(let b=Math.floor((lat-dy)*4);b<=Math.floor((lat+dy)*4);b++){const k=a+'_'+b;if(this.tiles.has(k))keys.push(k);}
   const sig=keys.join('/');if(this.signature===sig)return false;
   const rows=await Promise.all(keys.map(k=>{
     if(!this.cache.has(k))this.cache.set(k,fetchMapTile('vn-water/'+k+'.gz').catch(e=>{this.cache.delete(k);throw e;}));
     return this.cache.get(k);
   }));
   if(request!==this.request)return false;
   const features=[],seen=new Set();
   for(const tile of rows)for(const [kind,name,coords,mappedWidth] of tile){
     const key=kind+'|'+name+'|'+(mappedWidth||0)+'|'+coords.join(',');
     if(seen.has(key))continue;seen.add(key);
     const points=[];let x0=Infinity,z0=Infinity,x1=-Infinity,z1=-Infinity;
     for(let i=0;i<coords.length;i+=2){const p=this.roads.point(coords[i]/1e5,coords[i+1]/1e5);points.push(p);x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);z0=Math.min(z0,p.z);z1=Math.max(z1,p.z);}
     const width=mappedWidth||(kind==='stream'?4:kind==='canal'?8:kind==='drain'?2.5:
       kind==='river'?(/suối/i.test(name)?8:23):0);
     features.push({kind,name,width,points,x0,z0,x1,z1});
   }
   this.features=features;this.signature=sig;
   for(const k of this.cache.keys())if(!keys.includes(k))this.cache.delete(k);
   return true;
 }
 nearby(x,z){return this.features.filter(f=>f.x1>x-720&&f.x0<x+720&&f.z1>z-720&&f.z0<z+720);}
}

;
// world-road-traffic.js
'use strict';

function roadSpeedLimit(cursor){
  const speed=cursor.edge.traffic?.speed;
  return Array.isArray(speed)?speed[cursor.dir>0?0:1]:speed;
}

function roadSurfaceClass(edge){
  const tag=edge.traffic?.surface;
  if(!tag)return 'asphalt';
  if(tag==='concrete:plates')return 'roadSlabs';
  if(/^(concrete(?::lanes)?|cement|bê_tông)$/.test(tag))return 'roadConcrete';
  if(/^(unpaved|gravel|fine_gravel|compacted|dirt|earth|ground|sand|mud|soil|clay|rock|grass|pebblestone)$/.test(tag))return 'earth';
  if(/^(paving_stones|sett|cobblestone|unhewn_cobblestone|grass_paver)$/.test(tag))return 'pavers';
  if(tag==='wood')return 'roadWood';
  if(tag==='metal'||tag==='steel')return 'roadMetal';
  return 'asphalt';
}

function roadLaneLayout(edge,halfWidth){
  const mapped=edge.traffic?.lanes;
  const lanes=mapped??(edge.oneway?Math.max(1,Math.round(halfWidth/1.75)):halfWidth<2.7?1:halfWidth>=6.75?4:2);
  // With an odd two-way count and no directional split the middle lane's use
  // is unknown. Keep traffic in the known outer lanes and omit ambiguous paint.
  const forward=edge.oneway?lanes:edge.traffic?.forward??Math.floor(lanes/2);
  const divider=edge.oneway?0:lanes===1||lanes%2&&!edge.traffic?.forward?null:lanes-forward;
  const surface=roadSurfaceClass(edge);
  const markEdges=(surface==='asphalt'||surface==='roadConcrete'||surface==='roadSlabs')&&Boolean(mapped||halfWidth>=4.2||edge.graded);
  return {lanes,divider,forward,markEdges};
}

function roadLaneOffset(cursor,scooter=false){
  const {edge,dir}=cursor,half=worldRoadHalfWidth(edge);
  const {lanes,forward,divider}=roadLaneLayout(edge,half);
  if(lanes===1)return edge.oneway?0:half*.43;
  const count=dir>0||divider===null?forward:lanes-forward;
  return half-2*half/lanes*(scooter ? .5 : Math.min(count,2)-.5);
}

function signalStopLineOffset(control){return control.flags&2?2.5:1.4;}

// Emit paint clipped to this piece of the original OSM edge. A dash or a
// crossing that spans two polyline segments keeps its phase through the bend.
function roadPaint(edge,layout,half,from,to,emit,{lines=true,controls=true}={}){
  function band(start,end,left,right,color){
    const lo=Math.max(from,start),hi=Math.min(to,end);
    if(hi>lo&&right>left)emit(lo,hi,left,right,color);
  }
  if(lines&&layout.markEdges){
    for(const side of [-1,1]){
      const offset=side*(half-.23);
      band(from,to,offset-.055,offset+.055,'white');
    }
    for(let lane=1;lane<layout.lanes;lane++){
      if(layout.divider===null&&(lane===layout.forward||lane===layout.forward+1))continue;
      const offset=half*(2*lane/layout.lanes-1);
      const color=lane===layout.divider?'yellow':'white';
      for(let s=Math.floor(from/10)*10;s<to;s+=10)band(s,s+3.8,offset-.07,offset+.07,color);
    }
  }
  if(!controls)return;
  for(const point of edge.controls||[]){
    if(point.s<from-3||point.s>to+3)continue;
    if(point.flags&2){
      for(let offset=-half+.3;offset<half-.3;offset+=.85){
        band(point.s-1.65,point.s+1.65,offset,Math.min(half-.2,offset+.43),'white');
      }
    }
    if(!(point.flags&4))continue;
    const dividingOffset=layout.divider===null?0:half*(2*layout.divider/layout.lanes-1);
    for(const dir of edge.oneway?[1]:[1,-1]){
      if(!signalApplies(point,edge,dir))continue;
      const stop=point.s-dir*signalStopLineOffset(point);
      const left=edge.oneway||dir<0?-half:dividingOffset, right=dir>0?half:dividingOffset;
      band(stop-.17,stop+.17,left+.13,right-.13,'white');
    }
  }
}

// Perpendicular approaches alternate, opposite approaches share a phase.
// The clock is simulated and shared by the lenses, the HUD and the vehicles.
function roadSignalPhase(yaw,seconds){
  // Resolve exactly diagonal axes consistently for both travel directions.
  const axis=Math.cos(2*yaw);
  const first=Math.abs(axis)<1e-9?Math.sin(2*yaw)>0:axis>0;
  const phase=(seconds+(first?0:28))%56;
  return phase<23?'green':phase<26?'amber':'red';
}

function signalApplies(control,edge,dir){
  return (control.flags&4)&&(!control.direction||control.direction===dir)
    &&(dir>0?control.s:edge.length-control.s)>.05;
}

function roadControlAhead(graph,cursor,seconds,signalsOnly=false){
  let c=cursor,travelled=0;
  const visited=new Set();
  while(travelled<65&&!visited.has(c.edge.id)){
    visited.add(c.edge.id);
    let best=null;
    for(const point of c.edge.controls||[]){
      const distance=travelled+(point.s-c.s)*c.dir;
      if(distance<-.05||distance>65||(best&&best.distance<=distance))continue;
      const signal=signalApplies(point,c.edge,c.dir);
      if(!signal&&(signalsOnly||!(point.flags&1)))continue;
      const yaw=graph.sample({edge:c.edge,dir:c.dir,s:point.s}).yaw;
      best={distance,phase:signal?roadSignalPhase(yaw,seconds):null,stopLineOffset:signal?signalStopLineOffset(point):0};
    }
    if(best)return best;
    travelled+=c.dir>0?c.edge.length-c.s:c.s;
    if(travelled>=65)break;
    const options=graph.options(c);
    if(options.length!==1)break;
    c={...options[0],kind:cursor.kind};
  }
  return null;
}

function createMappedTrafficLights(T,scene,small){
  const capacity=small?48:96;
  const material=new T.MeshLambertMaterial({color:0x353b3b});
  const poles=new T.InstancedMesh(new T.CylinderGeometry(.075,.095,1,7),material,capacity);
  const heads=new T.InstancedMesh(new T.BoxGeometry(.48,1.28,.34),material,capacity);
  const bulbs=new T.InstancedMesh(new T.SphereGeometry(.156,small?6:10,small?4:8),new T.MeshBasicMaterial(),capacity*3);
  const pose=new T.Object3D(),color=new T.Color();
  const objects=[poles,heads,bulbs],phases=['red','amber','green'];
  const lit=[0xff312a,0xffb825,0x2afb70],dim=[0x482221,0x45371f,0x183d2b];
  for(const mesh of objects){mesh.count=0;mesh.frustumCulled=false;scene.add(mesh);}
  let active=[],lastTick=-1;
  function update(seconds){
    const tick=Math.floor(seconds);
    if(lastTick===tick)return;
    lastTick=tick;
    active.forEach(({yaw},i)=>{
      const phase=roadSignalPhase(yaw,seconds);
      phases.forEach((name,j)=>bulbs.setColorAt(3*i+j,color.setHex(name===phase?lit[j]:dim[j])));
    });
    if(bulbs.instanceColor)bulbs.instanceColor.needsUpdate=true;
  }
  function place(mesh,i,x,y,z,height,yaw){
    pose.position.set(x,y,z);pose.scale.set(1,height,1);pose.rotation.set(0,-yaw,0);
    pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
  }
  function rebuild(graph,edges,cx,cz,ground,roadsAt,siteClear){
    const candidates=[];
    for(const edge of edges)for(const point of edge.controls||[]){
      for(const dir of edge.oneway?[1]:[1,-1]){
        if(!signalApplies(point,edge,dir))continue;
        const p=graph.sample({edge,dir,s:point.s},worldRoadHalfWidth(edge)+.65);
        const x=p.x-cx,z=p.z-cz,distance=Math.hypot(x,z);
        if(distance<450)candidates.push({yaw:p.yaw,distance,node:point.node,edge,dir,s:point.s});
      }
    }
    function roadside(p){
      const half=worldRoadHalfWidth(p.edge);
      // Prefer the far right corner so the signal stays visible from the stop line.
      // A mapped approach often ends at the centre; project its last tangent across the junction.
      for(const extra of [0,2,5])for(const lead of [0,3,6,10,15,22,32,-3,-6,-10,-15,-22,-32]){
        const station=p.s+lead*p.dir,s=Math.max(0,Math.min(p.edge.length,station));
        if(lead<0&&s!==station)continue;
        const at=graph.sample({edge:p.edge,dir:p.dir,s},half+.75+extra);
        const beyond=(station-s)*p.dir;
        at.x+=Math.sin(at.yaw)*beyond;at.z-=Math.cos(at.yaw)*beyond;
        const x=at.x-cx,z=at.z-cz,y=ground(at.x,at.z,p.edge,s);
        const overlaps=roadsAt(x,z).some(road=>{
          const along=Math.max(0,Math.min(road.len,(x-road.ax)*road.fx+(z-road.az)*road.fz));
          if(Math.hypot(x-road.ax-road.fx*along,z-road.az-road.fz*along)>=road.w+.45)return false;
          const roadY=ground(at.x,at.z,road.source,road.station+along);
          return Math.abs(y-roadY)<4.5;
        });
        if(!overlaps&&siteClear(at.x,at.z,y,p.edge))return {x,y,z,yaw:at.yaw};
      }
    }
    active=[];
    for(const p of candidates.sort((a,b)=>a.distance-b.distance)){
      if(active.length===capacity)break;
      if(active.some(q=>p.node===q.node&&Math.cos(p.yaw-q.yaw)>.86))continue;
      const site=roadside(p);
      if(!site)continue;
      const {x,y,z,yaw}=site,i=active.length;
      active.push(p);place(poles,i,x,y+1.65,z,3.3,yaw);place(heads,i,x,y+3.65,z,1,yaw);
      for(let j=0;j<3;j++)place(bulbs,3*i+j,x-.19*Math.sin(yaw),y+4.03-j*.38,z+.19*Math.cos(yaw),1,yaw);
    }
    poles.count=heads.count=active.length;bulbs.count=3*active.length;
    for(const mesh of objects)mesh.instanceMatrix.needsUpdate=true;
    lastTick=-1;update(performance.now()/1000);
  }
  return {rebuild,update};
}

;
// world-duel.js
'use strict';
// Two racers share a rolling itinerary. Distance along it distinguishes overlapping
// roads and successive visits to the same junction.
class RollingDuel {
 constructor(graph,start){
   this.graph=graph;this.path=[];this.visits=new Map();this.length=0;this.player=0;this.opponent=8;
   this.speed=0;this.gate=1200;this.wins=0;this.round=1;
   this.actor={id:'pace-rival',kind:'rival',speed:0,x:0,z:0,yaw:0};
   this.append(start);this.ensure(125);this.pose();
 }
 append(cursor){
   const length=cursor.dir>0?cursor.edge.length-cursor.s:cursor.s;
   const segment={...cursor,from:this.length,to:this.length+Math.max(0,length)};
   this.path.push(segment);this.length=segment.to;
   this.visits.set(cursor.edge.id,this.length);
   if(this.visits.size>220)this.visits.delete(this.visits.keys().next().value);
 }
 ensure(until){
   for(let i=0;this.length<until&&i<600;i++){
     const last=this.path.at(-1),options=this.graph.options(last);
     if(!options.length){
       if(last.edge.oneway)break;
       this.append({edge:last.edge,s:last.dir>0?last.edge.length:0,dir:-last.dir});continue;
     }
     // Prefer a through road, but avoid recently visited loops and one-way cul-de-sacs.
     const cost=o=>{
       const seen=this.visits.get(o.edge.id);
       return Math.abs(o.angle)+(seen!==undefined?Math.max(0,4-(this.length-seen)/220):0)+
         (o.edge.oneway&&!this.graph.options(o).length?8:0)+(last.edge.name&&last.edge.name===o.edge.name?-.2:0);
     };
     let pick=options[0],best=cost(pick);for(const item of options.slice(1)){const n=cost(item);if(n<best){pick=item;best=n;}}
     this.append(pick);
   }
 }
 at(m){
   let lo=0,hi=this.path.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(this.path[mid].to<m)lo=mid+1;else hi=mid;}
   const entry=this.path[lo];return {edge:entry.edge,dir:entry.dir,s:entry.s+entry.dir*Math.max(0,Math.min(entry.to,m)-entry.from)};
 }
 pose(){
   const c=this.at(this.opponent),lane=Math.min(worldRoadHalfWidth(c.edge)*.48,2.2);
   Object.assign(this.actor,this.graph.sample(c,lane),{edge:c.edge,deckLift:this.graph.roadLevel(c.edge,c.s),speed:this.speed});
 }
 move(cursor,traveled,dt,traffic){
   this.ensure(Math.max(this.player,this.opponent)+150);
   const start=this.player;
   let nearest=null;
   for(const entry of this.path){
     if(entry.edge.id!==cursor.edge.id||cursor.error>(worldRoadHalfWidth(entry.edge)+1)**2)continue;
     const progress=entry.from+(cursor.s-entry.s)*entry.dir;
     if(progress<entry.from-.2||progress>entry.to+.2||Math.abs(progress-start)>35)continue;
     if(nearest===null||Math.abs(progress-start)<Math.abs(nearest-start))nearest=progress;
   }
   this.offCourse=nearest===null;
   if(nearest!==null)this.player=Math.max(0,start+clamp(nearest-start,-traveled*1.3,traveled*1.3));
   const current=this.at(this.opponent),a=this.graph.sample(current),b=this.graph.sample(this.at(this.opponent+18));
   const bend=Math.abs(Math.atan2(Math.sin(b.yaw-a.yaw),Math.cos(b.yaw-a.yaw)));
   const gap=this.opponent-this.player;let target=clamp(21-gap*.075,13,29)*Math.max(.43,1-bend*.39);
   const fx=Math.sin(this.actor.yaw),fz=-Math.cos(this.actor.yaw);
   for(const n of traffic){
     if(Math.abs(n.deckLift-this.actor.deckLift)>2.5)continue;
     const x=n.x-this.actor.x,z=n.z-this.actor.z,front=x*fx+z*fz;
     if(front>0&&front<12&&Math.abs(x*fz-z*fx)<1.7)target=Math.min(target,Math.max(2,n.speed+(front-6)*.6));
   }
   if(this.actor.recoil?.braking)target=0;
   this.speed+=clamp(target-this.speed,-11*dt,5.8*dt);
   if(this.opponent-this.player>125)this.speed=Math.max(0,this.speed-14*dt);
   this.opponent=Math.min(this.length,this.opponent+this.speed*dt);this.pose();DriveBody.advanceRecoil(this.actor,dt);
   const kick=this.actor.recoil;if(kick){this.actor.x+=kick.x;this.actor.z+=kick.z;this.actor.yaw+=kick.angle;}
   while(this.path.length>2&&this.path[0].to<Math.min(this.player,this.opponent)-40)this.path.shift();
   return this.player-start;
 }
 nextAt(node){
   return this.path.find((entry,i)=>i>0&&entry.from>=this.player-.01&&(entry.dir>0?entry.edge.start:entry.edge.end)===node);
 }
}

;