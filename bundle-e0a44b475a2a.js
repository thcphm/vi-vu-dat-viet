'use strict';
// sight-grounds.js
'use strict';
// Only unrecorded scenery uses these outlines. Paths, trees and buildings
// surveyed inside a memorial continue to use their normal rendering paths.
let memorialOutlines;
function memorialGroundsNear(graph,cx,cz){
  if(!graph)return ()=>false;
  memorialOutlines??=(window.MemorialGroundRings||[]).map(([, ,paths])=>{
    let west=Infinity,south=Infinity,east=-Infinity,north=-Infinity;
    const rings=paths.map(path=>{
      const ring=[];let x=0,y=0;
      for(let i=0;i<path.length;i+=2){
        x+=path[i];y+=path[i+1];const lon=x/1e7,lat=y/1e7;
        west=Math.min(west,lon);south=Math.min(south,lat);east=Math.max(east,lon);north=Math.max(north,lat);
        ring.push([lon,lat]);
      }
      return ring;
    });
    return {west,south,east,north,rings};
  });
  const [lon,lat]=graph.geo(cx,cz),dx=1000/graph.mx,dy=1000/graph.my;
  const nearby=memorialOutlines.filter(p=>p.east>=lon-dx&&p.west<=lon+dx&&p.north>=lat-dy&&p.south<=lat+dy)
    .map(p=>({nw:graph.point(p.west,p.north),se:graph.point(p.east,p.south),rings:p.rings.map(r=>r.map(v=>graph.point(...v)))}));
  return (x,z)=>nearby.some(({nw,se,rings})=>{
    if(x<nw.x||x>se.x||z<nw.z||z>se.z)return false;
    let inside=false;
    for(const ring of rings){
      let a=ring[ring.length-1];
      for(const b of ring){
        if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)inside=!inside;
        a=b;
      }
    }
    return inside;
  });
}
// Metre-scale ground finishes follow the mapped rings (including holes) and
// pedestrian ways. The relief mesh supplies their elevation and doesn't need
// another layer of nearly coplanar triangles.
function createSightGrounds(T,small,source){
  const canvas=document.createElement('canvas'),span=1120;
  canvas.width=canvas.height=small?768:1280;
  const pen=canvas.getContext('2d',{willReadFrequently:true});
  // Collision lookup and the shader can share the same top-to-bottom raster.
  const texture=new T.DataTexture(null,canvas.width,canvas.height);
  texture.magFilter=texture.minFilter=T.LinearFilter;
  const uniforms={visitorMap:{value:texture},visitorOrigin:{value:new T.Vector2()},visitorActive:{value:0}};
  const codes={sand:1,rock:2,lawn:3,orchard:3,tea:3,court:4,trail:5,walk:6,steps:6,drive:7};
  const surfaces={asphalt:1,concrete:2,'concrete:plates':2,gravel:3,wood:4,brick:5,
    sett:6,cobblestone:6,stone:6};
  const projections=source?.projections||new WeakMap();
  const datasets=source?.datasets||['sight-grounds/','sight-furniture/'].map(base=>({
    base,states:new WeakMap(),cache:new Map(),manifest:null
  }));
  const occupiedCells=new Map();
  let mask,fixtures=[],streetFurniture=[],originX=0,originZ=0;
  let memorialAt=()=>false;
  let fenceModels=[],wallModels=[],cityWallModels=[];
  async function loadLayer(layer,graph,x,z){
    const {base,states,cache}=layer;
    const [lon,lat]=graph.geo(x,z),reach=span*.5+180;
    const W=Math.floor((lon-reach/graph.mx)*32),E=Math.floor((lon+reach/graph.mx)*32);
    const S=Math.floor((lat-reach/graph.my)*32),N=Math.floor((lat+reach/graph.my)*32);
    const signature=[W,E,S,N].join('/'),prior=states.get(graph);
    if(prior?.signature===signature)return prior.job;
    const state={signature,rows:prior?.rows||[]};
    states.set(graph,state);
    state.job=(async()=>{
      try{
        layer.manifest??=fetch(base+'index.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();})
          .then(index=>new Set(index.bundles)).catch(e=>{layer.manifest=null;throw e;});
        const available=await layer.manifest,needed=new Set(),jobs=[];
        for(let i=W;i<=E;i++)for(let j=S;j<=N;j++){
          const key=Math.floor(i/8)+'_'+Math.floor(j/8);
          if(!available.has(key))continue;
          needed.add(key);
          if(!cache.has(key))cache.set(key,fetchMapTile(base+key+'.gz').catch(e=>{cache.delete(key);throw e;}));
          jobs.push(cache.get(key).then(bundle=>bundle[i+'_'+j]||[]));
        }
        const rows=(await Promise.all(jobs)).flat();
        if(states.get(graph)!==state)return false;
        state.rows=rows;state.job=false;
        for(const key of cache.keys())if(!needed.has(key))cache.delete(key);
        return true;
      }catch{if(states.get(graph)===state)states.delete(graph);return false;}
    })();
    return state.job;
  }
  async function load(graph,x,z){
    return (await Promise.all(datasets.map(layer=>loadLayer(layer,graph,x,z)))).some(Boolean);
  }
  // Index surveyed points before generating buildings or vegetation. All
  // coordinates in this index are relative to this district's render origin.
  function occupy(x,z,radius,kind){
    const key=Math.floor(x/20)+','+Math.floor(z/20);
    if(!occupiedCells.has(key))occupiedCells.set(key,[]);
    occupiedCells.get(key).push({x,z,radius,kind});
  }
  function nearFixture(x,z,radius,kind){
    const reach=radius+3;
    for(let i=Math.floor((x-reach)/20);i<=Math.floor((x+reach)/20);i++){
      for(let j=Math.floor((z-reach)/20);j<=Math.floor((z+reach)/20);j++){
        for(const p of occupiedCells.get(i+','+j)||[]){
          if((!kind||p.kind===kind)&&(x-p.x)**2+(z-p.z)**2<(radius+p.radius)**2)return true;
        }
      }
    }
    return false;
  }
  const displayed={visitorMap:{value:texture},visitorOrigin:{value:new T.Vector2()},visitorActive:{value:0}};
  function shade(shader){
    Object.assign(shader.uniforms,displayed);
    shader.fragmentShader='uniform sampler2D visitorMap; uniform vec2 visitorOrigin; uniform float visitorActive;\n'+
      shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
      vec2 vu=(groundMetres-visitorOrigin)/1120.+.5;
      if(visitorActive>.5 && all(greaterThan(vu,vec2(0.))) && all(lessThan(vu,vec2(1.)))){
        vec4 sampleGround=texture2D(visitorMap,vu);
        float type=floor(sampleGround.r*8.+.5);
        vec2 m=groundMetres;
        float grain=clamp(dot(diffuseColor.rgb,vec3(.23,.63,.14))*4.,.72,1.22);
        vec3 tint=vec3(.54,.41,.235);
        if(type==2.)tint=vec3(.26,.25,.218);
        if(type==3.)tint=vec3(.118,.214,.065);
        if(type==4.||type==6.){
          vec2 block=m/(type==4.?vec2(1.12,.61):vec2(.53,.28));
          block.x+=.5*mod(floor(block.y),2.);
          vec2 aa=max(fwidth(block),vec2(.004)),edge=min(fract(block),1.-fract(block));
          vec2 seam=smoothstep(vec2(.009)-aa*.45,vec2(.033)+aa*.45,edge);
          float fade=1.-smoothstep(.15,.85,max(aa.x,aa.y));
          float slab=fract(sin(dot(mod(floor(block),256.),vec2(27.1,18.9)))*4347.);
          tint=(type==4.?vec3(.36,.325,.282):vec3(.325,.274,.214))*(1.+fade*(.14*(slab-.5)-.34*(1.-seam.x*seam.y)));
        }
        if(type==5.)tint=vec3(.235,.16,.095);
        if(type==7.)tint=vec3(.23,.225,.21);
        float surface=floor(sampleGround.g*8.+.5);
        if(surface==1.)tint=vec3(.105,.108,.105);
        if(surface==2.)tint=vec3(.34,.33,.30);
        if(surface==3.)tint=vec3(.28,.23,.17);
        if(surface==4.)tint=vec3(.29,.19,.12);
        if(surface==5.)tint*=vec3(1.12,.65,.49);
        if(surface==6.)tint*=vec3(.87,.94,1.);
        // A narrow concrete path blended against grass must never decode as
        // asphalt or dirt where the two categorical IDs mix at a texel edge.
        if(sampleGround.b>=.501){
          float pathCoverage=smoothstep(.21,.78,(sampleGround.b*255.-128.)/127.);
          tint=mix(vec3(.118,.214,.065),vec3(.34,.33,.30),pathCoverage);
        }
        diffuseColor.rgb=mix(diffuseColor.rgb,tint*grain,sampleGround.a*(1.-bankWet)*.92);
      }`);
  }
  function* prepare(graph,cx,cz,landmarks){
    let work=0;
    originX=cx;originZ=cz;fixtures=[];mask=null;uniforms.visitorActive.value=0;
    memorialAt=memorialGroundsNear(graph,cx,cz);
    fenceModels=(landmarks?.active||[]).filter(site=>site.data.replacesFence);
    wallModels=(landmarks?.active||[]).filter(site=>site.data.replacesWall);
    cityWallModels=(landmarks?.active||[]).filter(site=>site.data.replacesCityWall);
    occupiedCells.clear();streetFurniture=[];
    for(const [kind,id,lon,lat,height,diameter,tags] of datasets[1].states.get(graph)?.rows||[]){
      if((++work & 127)===0)yield;
      const point=graph.point(lon/1e7,lat/1e7),x=point.x-cx,z=point.z-cz;
      if(Math.abs(x)>span/2||Math.abs(z)>span/2)continue;
      occupy(x,z,.4,kind);streetFurniture.push({kind,id,x,z,worldX:point.x,worldZ:point.z,height,diameter,tags});
    }
    if(!graph)return;
    const rows=datasets[0].states.get(graph)?.rows||[];
    const ratio=canvas.width/span,half=span/2;
    if(!projections.has(graph))projections.set(graph,new WeakMap());
    const projected=projections.get(graph);
    const layers=[];
    const survey=window.VanMieuSurvey,surveyOrigin=survey&&graph.point(...survey.origin);
    const treePositions=new Set();
    if(landmarks?.active?.some(site=>site.data.id==='lang-chu-tich-ho-chi-minh')){
      for(const position of window.BaDinhLandscape?.modeledTrees||[])treePositions.add(position);
    }
    if(surveyOrigin&&Math.hypot(surveyOrigin.x-cx,surveyOrigin.z-cz)<1050){
      for(const f of survey.features){
        if(!['tree','courtyard','grass'].includes(f.kind))continue;
        const rings=f.rings.map(r=>r.map(([lon,lat])=>{
          const p=graph.point(lon,lat);return [p.x-cx,p.z-cz];
        }));
        if(f.kind==='tree'){
          const [lon,lat]=f.rings[0][0],ring=rings[0];
          treePositions.add(Math.round(lon*1e6)+','+Math.round(lat*1e6));
          fixtures.push({kind:'tree',size:f.height,ring,rings,measuredPosition:true});
          occupy(...ring[0],3,'tree');
        }else{
          const kind=f.kind==='grass'?'lawn':'court';
          layers.push({kind,code:codes[kind],rings,finish:f.surface==='paving_stones'?'stone':f.surface});
        }
      }
    }
    const modeledSteps=new Set((landmarks?.active||[]).flatMap(site=>site.data.modeledStairWays||[]));
    for(const [kind,size,raw,finish='',detail=0,wayId] of rows){
      if((++work & 31)===0)yield;
      if(['tree','palm','pine'].includes(kind)&&treePositions.has(raw[0][0]+','+raw[0][1]))continue;
      let feature=projected.get(raw);
      if(!feature){
        let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
        const rings=raw.map((ring,index)=>{
          let lon=0,lat=0;
          const points=[];
          for(let i=0;i<ring.length;i+=2){
            lon+=ring[i];lat+=ring[i+1];
            const p=graph.point(lon/1e6,lat/1e6);
            points.push(p);
            if(!index){
              minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);
              minZ=Math.min(minZ,p.z);maxZ=Math.max(maxZ,p.z);
            }
          }
          return points;
        });
        feature={rings,minX,maxX,minZ,maxZ};projected.set(raw,feature);
      }
      if(feature.maxX<cx-half-12||feature.minX>cx+half+12||feature.maxZ<cz-half-12||feature.minZ>cz+half+12)continue;
      const rings=feature.rings.map(r=>r.map(p=>[p.x-cx,p.z-cz]));
      const ring=rings[0];
      if(ring.length===1)occupy(...ring[0],['tree','pine','palm'].includes(kind)?3:.8,kind);
      if(kind==='avenue')for(let i=1;i<ring.length;i++){
        const [x,z]=ring[i-1],[bx,bz]=ring[i],n=Math.ceil(Math.hypot(bx-x,bz-z)/8);
        for(let j=0;j<n;j++)occupy(x+(bx-x)*(j+.5)/n,z+(bz-z)*(j+.5)/n,3,'avenue');
      }
      const code=codes[kind];
      if(code)layers.push({kind,code,rings,size,finish});
      if((!code||['steps','orchard','tea'].includes(kind))&&!(kind==='steps'&&modeledSteps.has(wayId)))
        fixtures.push({kind,size,ring,rings,finish,detail});
    }
    window.BaDinhLandscape?.prepareGround(layers,graph,cx,cz);
    if(!layers.length)return;
    pen.setTransform(ratio,0,0,ratio,canvas.width/2,canvas.height/2);
    pen.clearRect(-half,-half,span,span);pen.lineCap=pen.lineJoin='round';
    layers.sort((a,b)=>a.code-b.code);
    function trace(points,closed){
      pen.moveTo(...points[0]);
      for(let i=1;i<points.length;i++)pen.lineTo(...points[i]);
      if(closed)pen.closePath();
    }
    function pigment(code,finish,coverageByte=0){
      return 'rgb('+Math.round(code*255/8)+' '+Math.round((surfaces[finish]||0)*255/8)+' '+coverageByte+')';
    }
    for(const {code,rings,finish,coverageByte} of layers){
      if((++work & 31)===0)yield;
      if(code>=4)continue;
      pen.beginPath();
      for(const ring of rings)trace(ring,true);
      pen.fillStyle=pigment(code,finish,coverageByte);pen.fill('evenodd');
    }
    // Detailed architectural models already include paving and landscaping.
    pen.globalCompositeOperation='destination-out';
    for(const {ring} of landmarks?.buildingAreas||[]){
      pen.beginPath();trace(ring.map(p=>[p.x-cx,p.y-cz]),true);pen.fill();
    }
    pen.globalCompositeOperation='source-over';
    // An approach can run through a modeled gate and into its courtyard.
    for(const {kind,code,rings,size,finish,coverageByte} of layers){
      if((++work & 31)===0)yield;
      if(code===4){
        pen.beginPath();
        for(const ring of rings)trace(ring,true);
        pen.fillStyle=pigment(code,finish);pen.fill('evenodd');
        continue;
      }
      if(code<5)continue;
      pen.beginPath();
      for(const ring of rings)trace(ring,false);
      pen.lineWidth=Math.min(14,size||(kind==='drive'?4:kind==='trail'?1.5:2.4));
      pen.strokeStyle=pigment(code,finish,coverageByte);pen.stroke();
    }
    mask=pen.getImageData(0,0,canvas.width,canvas.height).data;
    texture.image.data=new Uint8Array(mask.buffer,mask.byteOffset,mask.byteLength);
    uniforms.visitorOrigin.value.set(cx,cz);uniforms.visitorActive.value=1;texture.needsUpdate=true;
  }
  function groundCode(x,z){
    if(!mask)return 0;
    const i=Math.floor((.5+(x-originX)/span)*canvas.width),j=Math.floor((.5+(z-originZ)/span)*canvas.height);
    if(i<0||j<0||i>=canvas.width||j>=canvas.height)return 0;
    const pixel=(j*canvas.width+i)*4;
    return mask[pixel+3]>100?Math.round(mask[pixel]*8/255):0;
  }
  // Structural features share one vertex-coloured draw, with metre-space joints
  // on brickwork and end grain on timber. Keep the original path bearings.
  const grain=source?.grain||new T.TextureLoader().load('streetscape/surfaces/landmark-grain.webp');
  grain.wrapS=grain.wrapT=T.RepeatWrapping;
  const material=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.88});
  material.onBeforeCompile=shader=>{
    shader.uniforms.fixtureGrain={value:grain};
    const vary='varying vec2 groundsUV; varying float finishCode;\n';
    shader.vertexShader=vary+'attribute float finish;\n'+shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n groundsUV=uv; finishCode=finish;');
    shader.fragmentShader=vary+'uniform sampler2D fixtureGrain;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec3 relief=texture2D(fixtureGrain,groundsUV*.46).rgb-.5;
      if(abs(finishCode-1.)<.1 || abs(finishCode-3.)<.1){
        vec2 p=groundsUV/(finishCode<2.?vec2(.32,.115):vec2(.82,.36));p.x+=.5*mod(floor(p.y),2.);
        vec2 aa=max(fwidth(p),vec2(.002)),edge=min(fract(p),1.-fract(p));
        vec2 inside=smoothstep(vec2(.013)-aa*.5,vec2(.037)+aa*.5,edge);
        float shade=fract(sin(dot(mod(floor(p),256.),vec2(53.3,97.1)))*4817.);
        diffuseColor.rgb*=1.+relief.g*.43+(.13*(shade-.5)-(1.-inside.x*inside.y)*.36)*(1.-smoothstep(.12,.9,max(aa.x,aa.y)));
      }else if(abs(finishCode-2.)<.1){
        float fibre=sin(groundsUV.y*47.+1.7*sin(groundsUV.x*2.6));
        diffuseColor.rgb*=1.+relief.b*.45+.07*fibre*(1.-smoothstep(.012,.072,fwidth(groundsUV.y)));
      }else if(abs(finishCode-4.)<.1){
        float damp=(1.-smoothstep(.12,.88,groundsUV.y))*smoothstep(-.14,.13,relief.r);
        diffuseColor.rgb*=vec3(1.+.39*relief.r)*mix(vec3(1.),vec3(.73,.78,.66),damp*.74);
      }else if(abs(finishCode-5.)<.1){
        float leaf=texture2D(fixtureGrain,groundsUV*2.7).g-.5;
        diffuseColor.rgb*=1.+relief.r*.48+leaf*.82-.16*(1.-smoothstep(.05,.6,groundsUV.y));
      }`);
  };
  // Alpha-cut wire leaves gaps in the shadow map as well as in the colour pass.
  // Pots, masonry and rails still share the solid fixture draw call.
  const fenceMaterials=source?.fenceMaterials||new Map();
  function fenceMaterial(style){
    if(fenceMaterials.has(style))return fenceMaterials.get(style);
    const tile=document.createElement('canvas');tile.width=tile.height=64;
    const c=tile.getContext('2d');c.strokeStyle='#fff';c.lineCap='square';
    c.lineWidth=style==='mesh'?3:7;c.beginPath();
    if(style==='mesh'){
      for(const x of [-64,0,64]){c.moveTo(x,0);c.lineTo(x+64,64);c.moveTo(x+64,0);c.lineTo(x,64);}
    }else{c.moveTo(32,0);c.lineTo(32,64);}
    c.stroke();
    const map=new T.CanvasTexture(tile);map.wrapS=map.wrapT=T.RepeatWrapping;
    const mat=new T.MeshLambertMaterial({color:style==='mesh'?0x727b72:0x4d5554,map,alphaTest:.23,side:T.DoubleSide});
    fenceMaterials.set(style,mat);return mat;
  }
  function* build(group,ground,blocked,obstacle,water,plant,mappedBlocked=blocked){
    const pos=[],rgb=[],uv=[],finish=[],colour=new T.Color();
    const panels=new Map(),posts=new Set();
    function quad(a,b,c,d,tint,code=0){
      colour.setHex(tint);
      const w=Math.hypot(...b.map((v,i)=>v-a[i])),h=Math.hypot(...d.map((v,i)=>v-a[i]));
      const across=Math.hypot(b[0]-a[0],b[2]-a[2]);
      const u=across?(((a[0]+originX)*(b[0]-a[0])+(a[2]+originZ)*(b[2]-a[2]))/across)%2048:0;
      for(const p of [a,b,c,a,c,d]){pos.push(...p);rgb.push(colour.r,colour.g,colour.b);finish.push(code);}
      uv.push(u,0,u+w,0,u+w,h,u,0,u+w,h,u,h);
    }
    function slab(ax,az,bx,bz,half,loA,loB,hiA,hiB,tint,code=0){
      const length=Math.hypot(bx-ax,bz-az),nx=(az-bz)*half/length,nz=(bx-ax)*half/length;
      const a=[ax+nx,hiA,az+nz],b=[bx+nx,hiB,bz+nz],c=[bx-nx,hiB,bz-nz],d=[ax-nx,hiA,az-nz];
      const al=[a[0],loA,a[2]],bl=[b[0],loB,b[2]],cl=[c[0],loB,c[2]],dl=[d[0],loA,d[2]];
      quad(a,b,c,d,tint,code);quad(al,bl,b,a,tint,code);quad(cl,dl,d,c,tint,code);
      quad(dl,al,a,d,tint,code);quad(bl,cl,c,b,tint,code);
    }
    function upright(x,z,r,base,top,tint,finish=0){
      slab(x-r,z,x+r,z,r,base,base,top,top,tint,finish);
    }
    function screen(style,x,z,xx,zz,a,b,h){
      let panel=panels.get(style);
      if(!panel){panel={pos:[],uv:[]};panels.set(style,panel);}
      const lo=.11,top=h-.09;
      panel.pos.push(x,a+lo,z,xx,b+lo,zz,xx,b+top,zz,x,a+lo,z,xx,b+top,zz,x,a+top,z);
      const u=Math.hypot(xx-x,zz-z)/(style==='bars'?.16:.115),v=(top-lo)/(style==='bars'?1:.15);
      panel.uv.push(0,0,u,0,u,v,0,0,u,v,0,v);
    }
    const close=small?145:225,reach=small?230:350;
    function inside(x,z,ring){
      let hit=false;
      for(let i=0,j=ring.length-1;i<ring.length;j=i++){
        const [a,b]=ring[i],[c,d]=ring[j];
        if((b>z)!==(d>z)&&x<a+(z-b)*(c-a)/(d-b))hit=!hit;
      }
      return hit;
    }
    function rows(kind,rings){
      const ring=rings[0],[ox,oz]=ring[0];
      let length=0,fx=1,fz=0;
      for(let i=0;i<ring.length;i++){
        const [x,z]=ring[i],[a,b]=ring[(i+1)%ring.length],d=Math.hypot(a-x,b-z);
        if(d>length){length=d;fx=(a-x)/d;fz=(b-z)/d;}
      }
      const smallCrop=kind==='tea',along=smallCrop?1.65:7.3,across=smallCrop?3.6:8;
      const reach=smallCrop?(small?75:115):(small?130:190);
      const originU=-ox*fx-oz*fz,originV=ox*fz-oz*fx;
      let minU=Infinity,minV=Infinity,maxU=-Infinity,maxV=-Infinity;
      for(const [x,z] of ring){
        const u=(x-ox)*fx+(z-oz)*fz,v=(z-oz)*fx-(x-ox)*fz;
        minU=Math.min(minU,u);maxU=Math.max(maxU,u);minV=Math.min(minV,v);maxV=Math.max(maxV,v);
      }
      const holes=rings.slice(1);
      for(let j=Math.ceil(Math.max(minV,originV-reach)/across);j*across<=Math.min(maxV,originV+reach);j++){
        for(let i=Math.ceil(Math.max(minU,originU-reach)/along);i*along<=Math.min(maxU,originU+reach);i++){
          const x=ox+fx*i*along-fz*j*across,z=oz+fz*i*along+fx*j*across;
          if(x*x+z*z>reach*reach||!inside(x,z,ring)||holes.some(r=>inside(x,z,r))||blocked(x,z,.45))continue;
          const noise=Math.sin(i*17.31+j*24.71);
          if(smallCrop)plant('tea',x,z,.99+noise*.06,1.78,Math.atan2(fx,fz));
          else plant('tree',x,z,4.35+noise*.42,4.6+noise*.44,i+j);
        }
      }
    }
    let work=0;
    for(const {kind,ring,rings,size,finish:skin,detail,measuredPosition} of fixtures){
      if((++work & 7)===0)yield;
      if(kind==='orchard'||kind==='tea'){rows(kind,rings);continue;}
      if(ring.length===1){
        const [x,z]=ring[0],gate=kind==='gate_post'||kind==='gate_pier';
        if(Math.hypot(x,z)>close||(gate||measuredPosition?mappedBlocked:blocked)(x,z,gate?.1:.45))continue;
        const baseY=ground(x,z);
        if(gate){
          const stone=kind==='gate_pier',h=Math.min(5.5,size||(stone?1.95:1.6)),r=stone?.17:.062;
          upright(x,z,r,baseY-.19,baseY+h,stone?0xa6a094:0x596361,stone?4:0);
          upright(x,z,r+.025,baseY+h-.055,baseY+h+.04,stone?0x89877f:0x414943);
          obstacle({id:'grounds:'+kind+':'+Math.round(originX+x)+':'+Math.round(originZ+z),kind:'barrier',
            x,z,fx:1,fz:0,w:r+.025,d:r+.025,height:h+.04,parts:[]});
          continue;
        }
        if(['tree','pine','palm'].includes(kind)){
          const seed=Math.sin((x+originX)*.15+(z+originZ)*.41),height=Math.min(55,size||9+seed*2.2);
          plant(kind,x,z,height,height*(kind==='pine'?.47:kind==='palm'?.61:.86),seed*3);
          continue;
        }
        function box(dx,dz,w,d,y,h,c,code=0){slab(x+dx-w/2,z+dz,x+dx+w/2,z+dz,d/2,baseY+y,baseY+y,baseY+y+h,baseY+y+h,c,code);}
        if(kind==='bench'||kind==='picnic_table'){
          const table=kind==='picnic_table';
          for(const dx of [-.57,.57])box(dx,0,.12,table?1.28:.46,-.16,.59,0x6b685c);
          for(const dz of table?[-.68,.68]:[0])for(let j=-1;j<=1;j++)box(0,dz+j*.13,1.72,.12,.39,.065,0x926948,2);
          if(table)box(0,0,1.88,.67,.7,.09,0x9b7751,2);
          else{
            for(const dx of [-.57,.57])box(dx,-.21,.065,.065,.41,.43,0x605b4e);
            for(const y of [.61,.78])box(0,-.20,1.72,.065,y,.105,0x936e4e,2);
          }
        }else if(kind==='board'){
          for(const dx of [-.69,.69])box(dx,0,.10,.13,-.15,2.03,0x655746,2);
          box(0,0,1.56,.09,.86,1.04,0x675c48);
          box(0,.051,1.39,.012,.96,.83,0xc8c5ae);
          box(0,0,1.73,.37,1.9,.08,0x625a50);
        }else if(kind==='flagpole'){
          const h=Math.min(55,size||8);box(0,0,.65,.65,-.15,.37,0xb3afa3);box(0,0,.09,.09,.17,h,0xb9c2c4);
        }else{
          const h=Math.min(28,size||(kind==='obelisk'?4:1.65)),w=Math.min(3,h*.42);
          box(0,0,w*1.6,w*1.35,-.16,.4,0x9e9a8f);box(0,0,w*1.3,w*1.05,.24,.19,0xaaa698);
          if(kind==='obelisk'){
            const lower=w*.45,upper=w*.20,y=baseY+.42,top=baseY+h;
            const ring=(r,level)=>[[-r,-r],[r,-r],[r,r],[-r,r]].map(([dx,dz])=>[x+dx,level,z+dz]);
            const a=ring(lower,y),b=ring(upper,top);
            for(let i=0;i<4;i++){const j=(i+1)%4;quad(a[i],a[j],b[j],b[i],0xaaa698);quad(b[i],b[j],[x,top+upper*2,z],[x,top+upper*2,z],0xb1aca1);}
          }else box(0,0,w,w*.48,.41,h*.8,0x848175);
        }
        continue;
      }
      const fence=kind==='fence'||kind==='railing';
      const replacements=fence?fenceModels:kind==='wall'?wallModels:kind==='city_wall'?cityWallModels:null;
      const closedFence=['wall','brick','dry_stone','stone','concrete','concrete_block','sheet'].includes(skin);
      let along=0;
      for(let i=1;i<ring.length;i++){
        const [ax,az]=ring[i-1],[bx,bz]=ring[i],dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz);
        if(len<.12)continue;
        const start=along;along+=len;
        const nearest=Math.max(0,Math.min(1,-(ax*dx+az*dz)/(len*len)));
        if(Math.hypot(ax+nearest*dx,az+nearest*dz)>reach)continue;
        const taggedRun=kind==='steps'&&detail>=.12&&detail<=3?detail:0;
        const step=kind==='steps'?.40:kind==='pier'?2.5:kind==='avenue'?8:fence?2.7:3.6;
        const n=taggedRun?Math.max(1,Math.round(along/taggedRun)-Math.round(start/taggedRun)):Math.ceil(len/step);
        const fx=dx/len,fz=dz/len;
        for(let j=0;j<n;j++){
          const t=j/n,u=(j+1)/n,x=ax+dx*t,z=az+dz*t,xx=ax+dx*u,zz=az+dz*u,mx=(x+xx)/2,mz=(z+zz)/2;
          if(replacements?.some(site=>{
            const dx=mx+originX-site.x,dz=mz+originZ-site.z;
            const replaces=fence?site.data.replacesFence:kind==='city_wall'?site.data.replacesCityWall:site.data.replacesWall;
            return replaces(dx*site.c-dz*site.s,dx*site.s+dz*site.c);
          }))continue;
          if(Math.hypot(mx,mz)>reach||(kind==='avenue'?blocked:mappedBlocked)(mx,mz,.16,kind==='pier'||kind==='retaining_wall'))continue;
          const a=ground(x,z),b=ground(xx,zz);
          if(kind==='avenue'){
            const h=Math.min(40,size||8.5);
            plant('tree',mx,mz,h,h*.75,j*.83);
          }else if(kind==='steps'){
            const half=Math.min(8,size||2.4)/2,sx=-fz*half,sz=fx*half;
            const sides=[ground(x+sx,z+sz),ground(x-sx,z-sz),ground(xx+sx,zz+sz),ground(xx-sx,zz-sz)];
            const top=Math.max(a,b,...sides)+.035,bottom=Math.min(a,b,...sides)-.14;
            slab(x,z,xx,zz,half,bottom,bottom,top,top,skin==='brick'?0xaa7255:0xb4ae9e,4);
          }else if(kind==='pier'){
            const level=water(mx,mz)?.level,deck=Number.isFinite(level)?level+.96:Math.max(a,b)+.5;
            const half=Math.min(8,size||2)/2;
            slab(x,z,xx,zz,half,deck-.18,deck-.18,deck,deck,0x9b7c5d,2);
            for(const side of [-1,1]){
              const px=x-fz*half*.8*side,pz=z+fx*half*.8*side;
              slab(px-.09,pz,px+.09,pz,.09,deck-2.8,deck-2.8,deck-.16,deck-.16,0x766650,2);
            }
          }else{
            const hedge=kind==='hedge',fort=kind==='city_wall',retained=kind==='retaining_wall';
            const h=Math.min(15,size||(hedge?1.14:fort?3.8:retained?.92:fence?1.35:1.65));
            const half=Math.min(fence&&!closedFence?.13:4,detail?detail/2:hedge?.44:fort?1.15:fence&&!closedFence?.055:.15);
            if(fence&&!closedFence){
              const wood=skin==='timber',paint=wood?0x80715a:0x64706c;
              for(const [px,pz,y] of [[x,z,a],[xx,zz,b]]){
                const key=px.toFixed(2)+','+pz.toFixed(2);
                if(posts.has(key))continue;
                posts.add(key);upright(px,pz,half,y-.15,y+h+.04,paint,wood?2:0);
              }
              for(const level of [h*.18,h*.91])
                slab(x,z,xx,zz,wood?.048:.026,a+level,b+level,a+level+.07,b+level+.07,paint,wood?2:0);
              if(skin==='bars'||skin==='mesh'||kind==='railing')screen(skin==='mesh'?'mesh':'bars',x,z,xx,zz,a,b,h);
              else if(!wood)slab(x,z,xx,zz,.021,a+h*.54,b+h*.54,a+h*.54+.045,b+h*.54+.045,paint);
            }else{
              const sx=-fz*half,sz=fx*half;
              const loA=Math.min(a,ground(x+sx,z+sz),ground(x-sx,z-sz))-.22;
              const loB=Math.min(b,ground(xx+sx,zz+sz),ground(xx-sx,zz-sz))-.22;
              const masonry=hedge?5:skin==='brick'?1:fort||retained||skin==='stone'||skin==='dry_stone'?3:skin==='sheet'?0:4;
              const tint=hedge?0x597344:masonry===1?0xa07159:masonry===3?0x978978:skin==='sheet'?0x87918e:0xb2a99b;
              slab(x,z,xx,zz,half,loA,loB,a+h,b+h,tint,masonry);
              if(!hedge&&skin!=='sheet')slab(x,z,xx,zz,half+.045,a+h-.075,b+h-.075,a+h+.03,b+h+.03,0x989488);
            }
            obstacle({id:'grounds:'+kind+':'+Math.round(originX+mx)+':'+Math.round(originZ+mz),kind:'barrier',
              x:mx,z:mz,fx,fz,w:len/n/2,d:half,height:h,parts:[]});
          }
        }
      }
    }
    if(!pos.length)return;
    const geo=new T.BufferGeometry();
    for(const [name,array,size] of [['position',pos,3],['color',rgb,3],['uv',uv,2],['finish',finish,1]])
      geo.setAttribute(name,new T.Float32BufferAttribute(array,size));
    setFlatNormals(T,geo);
    const mesh=new T.Mesh(geo,material);mesh.name='Mapped visitor grounds';mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
    for(const [style,data] of panels){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(data.pos,3));
      g.setAttribute('uv',new T.Float32BufferAttribute(data.uv,2));setFlatNormals(T,g);
      const infill=new T.Mesh(g,fenceMaterial(style));infill.name='Mapped '+style+' fence';
      infill.castShadow=infill.receiveShadow=true;group.add(infill);
    }
  }
  return {load,prepare,shade,nearFixture,get memorialAt(){return memorialAt;},get streetFurniture(){return streetFurniture;},
    createView:()=>createSightGrounds(T,small,{datasets,projections,fenceMaterials,grain}),uniforms,
    display(view){displayed.visitorMap.value=view.uniforms.visitorMap.value;displayed.visitorOrigin.value.copy(view.uniforms.visitorOrigin.value);displayed.visitorActive.value=view.uniforms.visitorActive.value;},
    mapped:(x,z)=>groundCode(x,z)>0,accessLane:(x,z)=>groundCode(x,z)===codes.drive,build};
}

;
// cave-openings.js
'use strict';
// Elevation tiles describe the top of the mountain, including the terrain above
// underground rivers. Cut only the passage occupied by an authored cave.
function createCaveOpenings(T){
  const maximum=6;
  const uniforms={
    caveOrigin:{value:new T.Vector3()},caveBearing:{value:new T.Vector2()},
    caveCount:{value:0},caveApproach:{value:0},
    caveSections:{value:Array.from({length:maximum},()=>new T.Vector4())}
  };
  let previous=null;
  function update(monument,originX,originZ){
    const profile=monument?.data.caveOpening;
    if(!profile||!Number.isFinite(monument.base)){uniforms.caveCount.value=0;previous=null;return;}
    uniforms.caveOrigin.value.set(monument.x-originX,monument.base,monument.z-originZ);
    if(profile===previous)return;
    previous=profile;
    uniforms.caveBearing.value.set(Math.cos(monument.data.yaw),Math.sin(monument.data.yaw));
    uniforms.caveCount.value=profile.sections.length;
    uniforms.caveApproach.value=profile.approach;
    profile.sections.forEach(([d,x,w,h],i)=>uniforms.caveSections.value[i].set(d,x,w,h));
  }
  function shade(shader){
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader='varying vec3 cavePosition;\n'+shader.vertexShader.replace('#include <project_vertex>',
      '#include <project_vertex>\n cavePosition=(modelMatrix*vec4(transformed,1.)).xyz;');
    shader.fragmentShader=`varying vec3 cavePosition;
      uniform vec3 caveOrigin; uniform vec2 caveBearing;
      uniform int caveCount; uniform float caveApproach; uniform vec4 caveSections[${maximum}];
      bool insideCave(){
        if(caveCount==0)return false;
        vec3 delta=cavePosition-caveOrigin;
        float d=-dot(delta.xz,caveBearing.yx);
        if(d < -caveApproach || delta.y < -3. || (d<0. && delta.y<d*.32-.15))return false;
        float lateral=dot(delta.xz,vec2(caveBearing.x,-caveBearing.y));
        vec4 a=caveSections[0];
        for(int i=1;i<${maximum};i++){
          if(i>=caveCount)break;
          vec4 b=caveSections[i];
          if(d<=b.x){
            vec3 section=mix(a.yzw,b.yzw,clamp((d-a.x)/(b.x-a.x),0.,1.));
            float x=abs(lateral-section.x)/(section.y*1.11+.30);
            return x<1. && delta.y<section.z*1.19*pow(max(0.,1.-x*x),.34)+1.2;
          }
          a=b;
        }
        return false;
      }\n`+shader.fragmentShader.replace('#include <clipping_planes_fragment>',
        '#include <clipping_planes_fragment>\n if(insideCave())discard;');
  }
  function floorAt(x,z){
    if(!previous)return null;
    const origin=uniforms.caveOrigin.value,bearing=uniforms.caveBearing.value;
    const dx=x-origin.x,dz=z-origin.z,d=-dx*bearing.y-dz*bearing.x;
    const side=dx*bearing.x-dz*bearing.y;
    if(d < -previous.approach)return null;
    let a=previous.sections[0];
    for(let i=1;i<previous.sections.length;i++){
      const b=previous.sections[i];
      if(d<=b[0]){
        const t=Math.max(0,(d-a[0])/(b[0]-a[0])),centre=a[1]+t*(b[1]-a[1]),width=a[2]+t*(b[2]-a[2]);
        return Math.abs(side-centre)<width?origin.y+a[4]+t*(b[4]-a[4]):null;
      }
      a=b;
    }
    return null;
  }
  return {update,shade,floorAt};
}

;
// vietnam-relief.js
'use strict';
// The baked imagery and elevation share the bounds of Web Mercator z8 tiles
// x=200..206, y=110..122. Heights are metres above sea level.
const vietnamReliefStep=32;
function createVietnamRelief(T,scene,compact,landscapes,tunnelCut,landWidth,caveOpenings){
  const urls='streetscape/surfaces/vietnam-',imagery=new T.TextureLoader().load(urls+'landcover.webp');
  imagery.colorSpace=T.SRGBColorSpace;
  const nearCentre={value:new T.Vector2()},eye={value:new T.Vector2()},anchor={value:new T.Vector2()};
  const datum={value:0};
  const passSurface=createPassSurface(T);
  const mat=new T.MeshLambertMaterial({name:'Vietnam relief',map:imagery,side:T.DoubleSide,color:0xc9d5bc});
  mat.onBeforeCompile=shader=>{
    shader.uniforms.terrainEye=eye;shader.uniforms.terrainAnchor=anchor;shader.uniforms.nearCentre=nearCentre;shader.uniforms.terrainDatum=datum;
    shader.vertexShader='uniform vec2 terrainEye,terrainAnchor;uniform float terrainDatum;varying float horizonDistance,altitude;varying vec2 canopy;\n'+shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\n canopy=terrainAnchor+position.xz; horizonDistance=distance(terrainEye,position.xz);altitude=position.y+.17+terrainDatum;');
    shader.fragmentShader=`uniform vec2 nearCentre;varying float horizonDistance,altitude;
      varying vec2 canopy;
      float standHash(vec2 i){vec3 p=fract(vec3(i.xyx)*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
      float standNoise(vec2 x){
        vec2 cell=floor(x),f=fract(x);f=f*f*(3.-2.*f);
        return mix(mix(standHash(cell),standHash(cell+vec2(1,0)),f.x),mix(standHash(cell+vec2(0,1)),standHash(cell+vec2(1,1)),f.x),f.y);
      }\n`+shader.fragmentShader.replace('#include <map_fragment>',
      `#include <map_fragment>\n vec2 local=abs(canopy-nearCentre);if(max(local.x,local.y)<${(landWidth/2).toFixed(1)}) discard; float mottling=(standNoise(canopy*.028)-.5)*.46+(standNoise(canopy*.083)-.5)*.23; diffuseColor.rgb*=1.+mottling*(1.-smoothstep(3500.,11000.,horizonDistance));`)
      .replace('#include <fog_fragment>',
      `#ifdef USE_FOG
        float haze=.17+.79*(1.-exp(-horizonDistance*.00009));
        #ifdef FOG_EXP2
          if(altitude<5. || sightMappedWater>0.){
            // The same water continues beyond the near mesh at both sea level
            // and upland lakes. Only the fallback ocean estimate uses altitude.
            float ocean=(1.-smoothstep(.5,5.,altitude))*(1.-smoothstep(.018,.070,dot(sampledDiffuseColor.rgb,vec3(.2126,.7152,.0722))));
            float water=mix(ocean,sightMappedWater,sightCoverage);
            gl_FragColor.rgb=mix(gl_FragColor.rgb,${sightOpenWaterColour},water);
            float waterHaze=1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
            haze=mix(haze,max(haze,waterHaze),water);
          }
        #endif
        gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,haze);
      #endif`);
    landscapes.shade(shader,'canopy','1.');
    passSurface.shade(shader,'canopy','.86');
    tunnelCut?.shade(shader,'canopy');
    caveOpenings?.shade(shader);
  };
  const texels=Float32Array.from({length:256},(_,v)=>3500*(v/255)**1.6);
  // Fixed geographic lattice: shared ridgelines retain exactly the same vertices
  // when the streaming window moves by one cell.
  const cells=compact?128:160,spacing=512,stride=cells+1;
  const axis=new Float32Array(stride);
  for(let i=1;i<=cells/2;i++){
    const tail=(i-40)/(cells/2-40),size=i<=40?vietnamReliefStep:tail<=.25?64:tail<=.50?128:tail<=.75?384:1024;
    axis[cells/2+i]=axis[cells/2+i-1]+size;axis[cells/2-i]=-axis[cells/2+i];
  }
  const count=stride*stride,indices=[];
  for(let j=0;j<cells;j++)for(let k=0;k<cells;k++){
    const a=j*stride+k,b=a+stride;indices.push(a,b,a+1,a+1,b,b+1);
  }
  const triangles=new T.Uint16BufferAttribute(indices,1);
  function horizonGeometry(){
    const geometry=new T.BufferGeometry();
    for(const [name,size] of [['position',3],['normal',3],['uv',2]]){
      geometry.setAttribute(name,new T.BufferAttribute(new Float32Array(count*size),size).setUsage(T.DynamicDrawUsage));
    }
    geometry.setIndex(triangles);return geometry;
  }
  const mesh=new T.Mesh(horizonGeometry(),mat);mesh.name='Vietnam terrain horizon';mesh.visible=false;mesh.frustumCulled=false;scene.add(mesh);
  let spare,building=null,displayedTerrain;
  let graph=null,originX=0,originZ=0,anchorX=NaN,anchorZ=NaN,pixels=null,width=0,height=0;
  function uvAt(x,z,g=graph){
    const [lon,lat]=g.geo(x,z),r=lat*Math.PI/180;
    return [((lon+180)/360*256-200)/7,((1-Math.asinh(Math.tan(r))/Math.PI)*128-110)/13];
  }
  function elevation(u,v){
    const px=Math.max(0,Math.min(width-1,u*width-.5)),py=Math.max(0,Math.min(height-1,v*height-.5));
    const x=Math.floor(px),y=Math.floor(py),right=Math.min(x+1,width-1),down=Math.min(y+1,height-1),fx=px-x,fy=py-y;
    const a=texels[pixels[y*width+x]],b=texels[pixels[y*width+right]],c=texels[pixels[down*width+x]],d=texels[pixels[down*width+right]];
    return (a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy;
  }
  let finishLoad;const ready=new Promise(resolve=>{finishLoad=resolve;});
  const heights=new Image();heights.onerror=()=>finishLoad();heights.onload=()=>{
    width=heights.naturalWidth;height=heights.naturalHeight;
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(heights,0,0);
    const rgba=ctx.getImageData(0,0,width,height).data;pixels=new Uint8Array(width*height);
    for(let i=0;i<pixels.length;i++)pixels[i]=rgba[i*4];
    canvas.width=canvas.height=1;heights.onload=null;heights.removeAttribute('src');finishLoad();
  };heights.src=urls+'elevation.png';
  // Meshes, tyres and landmark foundations share these triangles and vertical datum.
  const step=vietnamReliefStep,cacheSide=128,cacheMask=cacheSide-1;
  function sampleTerrain(graph,activePass,landscapes){
  const nodes=new Float64Array(cacheSide*cacheSide),nodeX=new Int32Array(nodes.length),nodeZ=new Int32Array(nodes.length);
  nodes.fill(NaN);
  const base=graph&&pixels?elevation(...uvAt(0,0,graph)):0;
  const hoanKiem=graph?.point?.(105.8521,21.02865);
  const plaza=graph?.point?.(105.83560,21.03695);
  const ao=graph?.point?.(106.30403,9.91766);
  const ang=graph?.point?.(106.30346,9.91596);
  const museum=graph?.point?.(106.30479,9.9161553);
  const hang=graph?.point?.(106.3450733,9.8871507);
  const hangGate=graph?.point?.(106.3440102,9.8880786);
  const haiSon=graph?.point?.(104.6401674,10.1397666);
  let haiSonStage;
  let pondStage,pondEdges;
  let hangStage,hangRoadStage,hangEdges;
  function localDatum(x,z,surface){
    if(!hoanKiem)return surface-base;
    if(Math.abs(x-haiSon.x)<112&&Math.abs(z-haiSon.z)<112){
      // Use the open ground northwest of the elevated Hải Sơn terrace. The
      // DSM starts climbing its rear columns well before the actual hillside.
      const u=x-haiSon.x,v=z-haiSon.z;
      const across=-.7638*u+.64545*v,along=-.64545*u-.7638*v;
      const terrace=Math.max(-18-across,across-25,-17-along,along-28);
      // The adjoining hall occupies the same saddle below the western hill.
      const hu=(across-47.6)*-.9685-(along+5.7)*.2489,hv=(across-47.6)*.2489+(along+5.7)*-.9685;
      const edge=Math.min(terrace,Math.max(Math.abs(hu)-7,Math.abs(hv)-17));
      if(edge<40){
        if(haiSonStage===undefined){
          const open=[[-5,46],[-10,58],[0,70]].map(([a,b])=>{
            const px=haiSon.x-.7638*a-.64545*b,pz=haiSon.z+.64545*a-.7638*b;
            return landscapes.elevation(px,pz)??elevation(...uvAt(px,pz,graph));
          });
          haiSonStage=open.sort((a,b)=>a-b)[1];
        }
        surface=haiSonStage+(surface-haiSonStage)*T.MathUtils.smoothstep(edge,16,40);
      }
    }
    if(Math.abs(x-hang.x)<210&&Math.abs(z-hang.z)<210){
      // The canopy and roofs are high DSM returns. The overhead view shows
      // one continuous courtyard, open steps and a grove on the same low plain.
      if(!hangEdges){
        const ring=[[106.3443035,9.8859167],[106.3458163,9.8860541],[106.3462508,9.8862602],
          [106.3461488,9.8881522],[106.3439816,9.8883953]].map(p=>graph.point(...p));
        hangEdges=ring.map((p,i)=>{
          const q=ring[(i+1)%ring.length],dx=q.x-p.x,dz=q.z-p.z,d=Math.hypot(dx,dz);
          return {x:p.x,z:p.z,nx:-dz/d,nz:dx/d};
        });
        const open=[[106.3447702,9.8873013],[106.3453120,9.8871005],[106.3448238,9.8874070],
          [106.3439333,9.8880359],[106.3463151,9.8871216],[106.3462991,9.8876026],[106.3441104,9.8863606]];
        const levels=open.map(ll=>{const p=graph.point(...ll);return landscapes.elevation(p.x,p.z)??elevation(...uvAt(p.x,p.z,graph));});
        hangRoadStage=levels[3]; // Open carriageway beside the western entrance.
        hangStage=levels.sort((a,b)=>a-b)[3];
      }
      const edge=Math.max(...hangEdges.map(e=>(x-e.x)*e.nx+(z-e.z)*e.nz));
      if(edge<3){
        const formation=hangStage+T.MathUtils.clamp((surface-hangStage)*.013,-.13,.21);
        surface=formation+(surface-formation)*T.MathUtils.smoothstep(edge,-26,3);
      }
      // The eight-metre passage opens at road level at both ends. Flatten the
      // contributing 32 m grid vertices and blend into the approach and grove.
      const gateDistance=Math.hypot(x-hangGate.x,z-hangGate.z);
      if(gateDistance<82)surface=hangRoadStage+(surface-hangRoadStage)*T.MathUtils.smoothstep(gateDistance,48,82);
    }
    if(Math.abs(x-ao.x)<250&&z-ao.z>-215&&z-ao.z<320){
      // Copernicus measures the crowns around Ao Bà Om. Estimate the pond
      // stage from five open-water pixels, then grade the surrounding sandy rise.
      if(!pondEdges){
        const ring=[[106.3030638,9.9168116],[106.3029297,9.9182309],[106.3050078,9.9186073],[106.3051231,9.9171035]].map(p=>graph.point(...p));
        pondEdges=ring.map((a,i)=>{const b=ring[(i+1)%4],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
          return {x:a.x,z:a.z,nx:dz/length,nz:-dx/length};});
        const levels=[[-37,13],[0,0],[36,9],[-18,-18],[18,22]].map(([u,v])=>
          landscapes.elevation(ao.x+u,ao.z+v)??elevation(...uvAt(ao.x+u,ao.z+v,graph)));
        pondStage=levels.sort((a,b)=>a-b)[2];
      }
      const edge=Math.max(...pondEdges.map(e=>(x-e.x)*e.nx+(z-e.z)*e.nz));
      if(edge<80){
        const formation=pondStage+1.5*T.MathUtils.smoothstep(edge,15,43);
        surface=formation+(surface-formation)*T.MathUtils.smoothstep(edge,43,80);
      }
      // The hall and moat sit on the same sandy rise. Keep roof and canopy
      // returns out of the terrace, and meet the original grade beyond the moat.
      const u=x-ang.x,v=z-ang.z;
      const court=Math.max(Math.abs(.982*u-.189*v)-56,Math.abs(.189*u+.982*v)-46);
      if(court<35){
        const formation=pondStage+1.65+T.MathUtils.clamp((surface-pondStage)*.025,0,.35);
        surface=formation+(surface-formation)*T.MathUtils.smoothstep(court,1,35);
      }
      // The museum courtyard and shared approach occupy the same low ground.
      // Remove the canopy return under the building and the path to its gate.
      const museumEdge=Math.max(Math.abs(x-museum.x)-55,Math.abs(z-museum.z)-23);
      if(museumEdge<29){
        const formation=pondStage+1.81+T.MathUtils.clamp((surface-pondStage)*.012,0,.18);
        surface=formation+(surface-formation)*T.MathUtils.smoothstep(museumEdge,0,29);
      }
      return surface-base;
    }
    // The 1:500 public square plan (1086/QĐ-TTg, p. 10) records existing
    // lawns at 7.80–8.15 m. A surface raster includes the adjacent rooftops.
    const dx=x-plaza.x,dz=z-plaza.z;
    if(Math.abs(dx)<235&&Math.abs(dz)<335){
      const edge=Math.max(Math.abs(.196*dx-.981*dz)-219,Math.abs(.981*dx+.196*dz)-100);
      if(edge<70){
        const formation=T.MathUtils.clamp(8+(surface-8)*.035,7.80,8.15);
        const blend=1-T.MathUtils.smoothstep(edge,0,70);
        return surface+(formation-surface)*blend-base;
      }
    }
    const east=(x-hoanKiem.x)/340,south=(z-hoanKiem.z)/525;
    if(Math.abs(east)>=1.55||Math.abs(south)>=1.55)return surface-base;
    // Hanoi H1-1B, decision 1360/QĐ-UBND §4.5.2.2: ground formation 8.4–11.5 m.
    // Roofs and trees in the DSM otherwise create a 10% descent into Hồ Gươm.
    // Keep small changes in the street grade. The mapped shoreline supplies the bank and bed.
    const formation=T.MathUtils.clamp(8.4+(surface-8.4)*.10,8.4,11.5);
    const blend=1-T.MathUtils.smoothstep(Math.hypot(east,south),.85,1.55);
    return surface+(formation-surface)*blend-base;
  }
  function height(x,z,u,v){
    let regional=elevation(u,v);
    if(activePass){
      const p=activePass,east=(x-p.x)*p.eastScale,south=z-p.z;
      const tx=east*p.cos+south*p.sin,tz=-east*p.sin+south*p.cos;
      const weight=1-T.MathUtils.smoothstep(Math.max(Math.abs(tx),Math.abs(tz)),11200,15200);
      if(weight)regional+=(p.grid.elevation(tx,tz)-regional)*weight;
    }
    const centre=landscapes.elevation(x,z);
    if(centre===null)return localDatum(x,z,regional);
    // A surface model can include a roof or a tree crown. Remove isolated spikes
    // over one survey pixel while retaining the full rise between valley and ridge.
    const west=landscapes.elevation(x-32,z)??centre,east=landscapes.elevation(x+32,z)??centre;
    const north=landscapes.elevation(x,z-32)??centre,south=landscapes.elevation(x,z+32)??centre;
    const average=(north+south+east+west)*.25;
    const cleaned=.75*Math.min(centre,Math.max(west,east,north,south)+2)+.25*average;
    const weight=landscapes.elevationWeight(x,z);
    return localDatum(x,z,regional+(cleaned-regional)*weight);
  }
  function node(i,j){
    const key=(j&cacheMask)*cacheSide+(i&cacheMask);
    if(nodeX[key]===i&&nodeZ[key]===j&&!Number.isNaN(nodes[key]))return nodes[key];
    const x=i*step,z=j*step,value=height(x,z,...uvAt(x,z,graph));
    nodeX[key]=i;nodeZ[key]=j;nodes[key]=value;return value;
  }
  function ground(x,z){
    if(!pixels||!graph)return 0;
    const i=Math.floor(x/step),j=Math.floor(z/step),u=x/step-i,v=z/step-j;
    const b=node(i+1,j),c=node(i,j+1);
    if(u+v<=1){const a=node(i,j);return a+(b-a)*u+(c-a)*v;}
    const d=node(i+1,j+1);return d+(c-d)*(1-u)+(b-d)*(1-v);
  }
  function grade(x,z,yaw){
    const dx=2*Math.sin(yaw),dz=-2*Math.cos(yaw);
    return (ground(x+dx,z+dz)-ground(x-dx,z-dz))/4;
  }
  return {graph,pass:activePass,landscapes,base,ground,grade,height,step,revision:Symbol(),
    altitude:(x,z)=>graph&&pixels?base+ground(x,z):0};
  }
  const byGraph=new WeakMap(),requested=new WeakMap(),passCache=new Map();
  let activePass=null;
  async function loadLocal(g,x,z){
    const current=byGraph.get(g);
    let closest=null,range=12000;
    for(const stage of [...(window.mountainStages||[]),...(window.landmarkTerrain||[])]){
      const p=g.point(...stage.start),dist=Math.hypot(p.x-x,p.z-z);
      if(dist<range){range=dist;closest={...p,stage};}
    }
    requested.set(g,closest?.stage.id);
    if(!closest){byGraph.delete(g);return !!current;}
    if(current?.stage.id===closest.stage.id)return false;
    const {stage}=closest;
    if(!passCache.has(stage.id)){
      const promise=fetch('stage-terrain/'+stage.id+'.js').then(async response=>{
        if(!response.ok)throw Error(response.status);
        const match=/^window\.loadStageRelief\("([A-Za-z0-9+/=]+)"\);?\s*$/.exec(await response.text());
        if(!match)throw Error('Invalid elevation tile');
        return window.decodePassTerrain(match[1],stage.id);
      }).catch(()=>{passCache.delete(stage.id);return null;});
      passCache.set(stage.id,promise);
      if(passCache.size>3)passCache.delete(passCache.keys().next().value);
    }
    const grid=await passCache.get(stage.id);
    if(!grid||requested.get(g)!==stage.id||byGraph.get(g)?.stage.id===stage.id)return false;
    const bearing=stage.bearing*Math.PI/180;
    // Convert world X back to east metres at the raster centre latitude.
    byGraph.set(g,{...closest,grid,sin:Math.sin(bearing),cos:Math.cos(bearing),
      eastScale:Math.cos(stage.start[1]*Math.PI/180)/Math.cos(g.lat*Math.PI/180)});
    return true;
  }
  let terrain=sampleTerrain(null,null,null);
  function prepare(g,view){
    const pass=g?byGraph.get(g):null;
    if(terrain.graph===g&&terrain.pass===pass&&terrain.landscapes===view)return terrain;
    return sampleTerrain(g,pass,view);
  }
  function activate(next,x,z){
    datum.value=next.base;
    if(next!==terrain){
      terrain=next;graph=next.graph;activePass=next.pass;
      building=null;
      passSurface.select(activePass?.stage.id,activePass?.x,activePass?.z,activePass?.cos,activePass?.sin,activePass?.eastScale);
    }
    originX=x;originZ=z;nearCentre.value.set(Math.round(x/step)*step,Math.round(z/step)*step);
  }
  const ground=(x,z)=>terrain.ground(x,z);
  function* buildHorizon(ax,az){
    const target=spare??=horizonGeometry(),attrs=target.attributes;
    const pos=attrs.position.array,uv=attrs.uv.array;
    const us=Float64Array.from(axis,dx=>uvAt(ax+dx,az)[0]);
    for(let j=0,i=0;j<=cells;j++){
      const dz=axis[j],v=uvAt(ax,az+dz)[1];
      for(let k=0;k<=cells;k++,i++){
        const dx=axis[k],u=us[k];
        pos[i*3]=dx;pos[i*3+1]=terrain.height(ax+dx,az+dz,u,v)-.17;pos[i*3+2]=dz;
        uv[i*2]=u;uv[i*2+1]=1-v;
      }
      if((j&3)===3)yield;
    }
    yield* updateTerrainNormals(T,target);
    for(const attr of Object.values(attrs))attr.needsUpdate=true;
    target.boundingSphere=null;
    spare=mesh.geometry;mesh.geometry=target;anchorX=ax;anchorZ=az;anchor.value.set(ax,az);displayedTerrain=terrain;
  }
  function update(x,z){
    if(!graph||!pixels)return;
    const [u,v]=uvAt(x,z);mesh.visible=u>=0&&u<1&&v>=0&&v<1;if(!mesh.visible)return;
    const ax=Math.round(x/spacing)*spacing,az=Math.round(z/spacing)*spacing;
    if(!building&&(ax!==anchorX||az!==anchorZ||displayedTerrain!==terrain))building=buildHorizon(ax,az);
    if(building){
      const deadline=displayedTerrain?.graph===graph?performance.now()+1.5:Infinity;
      do{if(building.next().done){building=null;break;}}while(performance.now()<deadline);
    }
    mesh.position.set(anchorX-originX,0,anchorZ-originZ);eye.value.set(x-anchorX,z-anchorZ);
  }
  return {prepare,activate,update,loadLocal,ready,ground,step,passSurface};
}

;
// pedestrian-models.js
'use strict';

const pedestrianWardrobe = [
  ['hust-tee', 'hust-jacket'],
  ['fox-cosplayer', 'witch-cosplayer']
];

// One draw per pedestrian. Each row occupies a tenth of [0, 1); the remaining share is ordinary walkers.
function choosePedestrianModel(roll, ordinary) {
  const slot = roll * 10;
  const group = Math.floor(slot);
  const styles = pedestrianWardrobe[group];
  return styles ? styles[Math.floor((slot - group) * styles.length)] : ordinary;
}

function pathPedestrianModel(seed, station) {
  // Mix independently of the density roll that decided whether this path is occupied.
  let bits = seed ^ Math.imul(station + 1, 0x9e3779b1);
  bits = Math.imul(bits ^ (bits >>> 16), 0x85ebca6b);
  bits = Math.imul(bits ^ (bits >>> 13), 0xc2b2ae35);
  bits = (bits ^ (bits >>> 16)) >>> 0;
  return choosePedestrianModel(bits / 4294967296, bits % 3 === 1 ? 'hiker' : 'casual-walker');
}

;
// bodywork.js
'use strict';
// Only damaged body panels get private vertex buffers. Shared showroom assets stay reusable.
function updateBodywork(T,root,mark,heading) {
  if(!root||root.userData.impactMark===mark)return;
  root.userData.impactMark=mark;
  const world=new T.Vector3(),center=new T.Vector3(),delta=new T.Vector3(),inverse=new T.Matrix4();
  root.updateWorldMatrix(true,true);root.getWorldPosition(center);
  const sin=Math.sin(heading),cos=Math.cos(heading);
  root.traverse(panel=>{
    if(!panel.isMesh||!panel.geometry?.attributes.position)return;
    const original=panel.userData.undamaged;
    if(original){panel.geometry.dispose();panel.geometry=original;delete panel.userData.undamaged;}
    if(!mark||!/^(?:paint(?:_|$)|.*_body\d*$|bumper|bonnet|hood)/i.test(panel.material?.name||''))return;
    const geometry=panel.geometry,points=geometry.attributes.position;
    const nX=mark.side*cos+mark.front*sin,nZ=mark.side*sin-mark.front*cos;
    const reach=Math.min(.86/Math.max(.01,Math.abs(mark.side)),1.89/Math.max(.01,Math.abs(mark.front)));
    const px=center.x+nX*reach,pz=center.z+nZ*reach;
    inverse.copy(panel.matrixWorld).invert();
    let modified;
    for(let i=0;i<points.count;i++){
      world.fromBufferAttribute(points,i).applyMatrix4(panel.matrixWorld);
      const radius=((world.x-px)**2+(world.z-pz)**2)/1.14+(world.y-center.y-.59)**2/.51;
      if(radius>=1)continue;
      modified??=geometry.clone();
      const depth=(1-radius)**2*(.09+mark.strength*.24);
      delta.set(world.x-nX*depth,world.y-depth*.13,world.z-nZ*depth).applyMatrix4(inverse);
      modified.attributes.position.setXYZ(i,delta.x,delta.y,delta.z);
    }
    if(modified){modified.computeVertexNormals();modified.computeBoundingSphere();panel.userData.undamaged=geometry;panel.geometry=modified;}
  });
}

;
// drivetrain.js
'use strict';
// The chassis moves in world metres. Navigation may measure its pose, but never supplies a steering angle.
window.DriveBody={
 recordDent(body,hit,speed,heading){
   if(speed<=4)return;
   body.dent={side:-hit.nx*Math.cos(heading)-hit.nz*Math.sin(heading),
     front:-hit.nx*Math.sin(heading)+hit.nz*Math.cos(heading),strength:Math.min(1,speed/22)};
 },
 // kg, dimensionless normal restitution. Vehicle masses include a nominal occupant.
 mass(body){
   if(body?.spec?.mass)return body.spec.mass;
   if(body?.mass)return body.mass;
   return body?.bike||body?.kind==='scooter'?205:({rally:1260,gt:1570,supercar:1480,van:1900,taxi:1420,rival:1460,person:75,bus:11500,truck:7800,suv:1950,minivan:1850,mini:950}[body?.model||body?.kind]||1450);
 },
 strikeTraffic(actor,hit,event,yaw,attackerX,attackerZ,targetX,targetZ){
   if(event.closing<.8)return;
   const bike=actor.bike||actor.kind==='scooter',s=Math.sin(yaw),c=Math.cos(yaw);
   const side=-hit.nx*c-hit.nz*s,front=-hit.nx*s+hit.nz*c;
   const dx=attackerX-targetX,dz=attackerZ-targetZ,lever=dx*s-dz*c,lateral=dx*c+dz*s;
   const a=actor.recoil??={x:0,z:0,y:0,vy:0,angle:0,vx:0,vz:0,spin:0,pitch:0,roll:0,age:0};
   const delta=event.impulse/event.targetMass;
   // A struck two-wheeler can pivot up over the bumper. Budget lift from the
   // available normal energy, leaving the rest for slip, rotation and damage.
   if(bike&&event.energy>event.targetMass*9.81*.38){
     if(!a.fallen){
       a.vx=event.otherVX;a.vz=event.otherVZ;
       a.fallen=true;a.sideSign=Math.sign(side)||Math.sign(lateral)||1;
       a.rollSpeed=0;a.pitchSpeed=0;
     }
     const liftEnergy=Math.max(0,event.energy-4500)*(.052+.055*Math.abs(front));
     const lift=Math.min(9,Math.sqrt(2*liftEnergy/event.targetMass),delta*.47);
     a.vy+=lift;
     const horizontal=Math.sqrt(Math.max(0,delta*delta-lift*lift));
     a.vx-=hit.nx*horizontal;a.vz-=hit.nz*horizontal;
     a.rollSpeed+=a.sideSign*Math.min(8,.9+delta*.17);
     a.pitchSpeed+=front*Math.min(5,delta*.15);
   }else{a.vx-=hit.nx*delta;a.vz-=hit.nz*delta;}
   a.spin+=Math.max(-5,Math.min(5,(lever*side-lateral*front)*delta*.17));
   a.age=0;a.side=side;a.front=front;a.force=event.strength;a.braking=.45+a.force*1.5;
   this.recordDent(actor,{nx:-hit.nx,nz:-hit.nz},delta,yaw);
 },
 advanceRecoil(actor,dt){
   const a=actor.recoil;if(!a)return 0;
   a.braking=Math.max(0,a.braking-dt);a.age+=dt;
   if(a.fallen){
     let landing=0;a.scrape=false;
     if(a.y>0||a.vy>0){
       a.y+=a.vy*dt-.5*9.81*dt*dt;a.vy-=9.81*dt;
       a.roll+=a.rollSpeed*dt;a.pitch+=a.pitchSpeed*dt;
       if(a.y<=0){
         landing=.5*this.mass(actor)*a.vy*a.vy;
         const tangent=Math.hypot(a.vx,a.vz);
         const friction=tangent?Math.max(0,1-.48*Math.abs(a.vy)/tangent):0;
         a.vx*=friction;a.vz*=friction;
         a.y=0;a.vy=Math.abs(a.vy)>2.5?-a.vy*.23:0;
         a.rollSpeed*=-.25;a.pitchSpeed*=-.22;
       }
     }
     if(!a.y&&!a.vy){
       const v=Math.hypot(a.vx,a.vz),ratio=v?Math.max(0,1-6.8*dt/v):0;
       a.vx*=ratio;a.vz*=ratio;a.spin*=Math.exp(-dt*3);
       if(v>3){
         a.scrapeDistance=(a.scrapeDistance||0)+v*dt;
         if(a.scrapeDistance>=1.4){a.scrape=true;a.scrapeDistance%=1.4;}
       }
       const rest=a.sideSign*1.36,wrap=r=>Math.atan2(Math.sin(r),Math.cos(r));
       a.roll+=wrap(rest-a.roll)*(1-Math.exp(-dt*8));a.pitch+=wrap(-a.pitch)*(1-Math.exp(-dt*8));
     }
     a.x+=a.vx*dt;a.z+=a.vz*dt;a.angle+=a.spin*dt;
     return landing;
   }
   for(const [p,v] of [['x','vx'],['z','vz'],['angle','spin']]){
     a[v]+=(a.braking?0:-a[p]*3.2)*dt;a[v]*=Math.exp(-dt*(a.braking?3.8:3.2));a[p]+=a[v]*dt;
   }
   const wave=Math.sin(a.age*12)*Math.exp(-a.age*3.3)*a.force;
   a.roll=a.side*wave*((actor.bike||actor.kind==='scooter') ? .65 : .21);a.pitch=a.front*wave*.14;
   if(a.age>7)delete actor.recoil;
   return 0;
 },
 reset(c){
   delete c.dent;
   c.vx=0;c.vz=0;c.speed=0;c.steer=0;c.spin=0;c.slip=0;c.pitch=0;c.roll=0;c.boost=false;c.brake=false;c.offroad=false;c.reverseDelay=0;
 },
 settle(c,dt){
   const drag=Math.exp(-dt*8);
   c.vx*=drag;c.vz*=drag;c.spin*=drag;
   c.x+=c.vx*dt;c.z+=c.vz*dt;c.yaw+=c.spin*dt;
   c.speed=c.vx*Math.sin(c.yaw)-c.vz*Math.cos(c.yaw);
 },
 forwardSpeed(c,input,dt,forward){
   const limit=input.top+(input.boost?9:0);
   let drive=input.gas?input.power:0;
   if(input.boost&&forward>=-.3)drive+=13;
   c.reverseDelay=input.reverse&&forward<=.35?c.reverseDelay+dt:0;
   // Keep the brake engaged through the direction change on a downhill start.
   c.brake=input.brake||input.reverse&&(forward>.35||!input.gas&&c.reverseDelay<=.28&&forward>=0);
   c.boost=input.boost&&!c.brake&&forward>=-.3;
   if(input.reverse&&c.reverseDelay>.28&&!input.gas&&forward>-5)drive=-4.4;
   if(forward>=limit&&drive>0)drive=0;
   const drag=(c.offroad?1.65:.48)+(c.offroad?.013:.0031)*forward*forward+(c.brake?(c.spec?.braking??17):0);
   const grade=input.grade||0,gravity=9.81*grade/Math.hypot(1,grade);
   const rolling=forward+(drive-gravity)*dt;
   const next=rolling-Math.sign(rolling)*Math.min(Math.abs(rolling),drag*dt);
   return c.spec?.speedGovernor?Math.min(next,input.top):next;
 },
 step(c,input,dt){
   if(!(dt>0))return;
   const sx=Math.sin(c.yaw),cz=Math.cos(c.yaw),forward=c.vx*sx-c.vz*cz,side=c.vx*cz+c.vz*sx;
   const grip=c.offroad?4.2:c.model==='rally'?9:7.2;
   c.steer+=(input.steer-c.steer)*(1-Math.exp(-dt*8));
   const next=this.forwardSpeed(c,input,dt,forward);
   const wheel=c.steer*(c.spec?.steerLock??.52)/(1+Math.abs(next)*.056);
   const yawRate=Math.max(-1.8,Math.min(1.8,next*Math.tan(wheel)/(c.spec?.wheelbase??2.68)));
   const settle=1-Math.exp(-dt*5);
   c.pitch+=(Math.max(-.065,Math.min(.045,(next-forward)/dt*.003))-c.pitch)*settle;
   c.roll+=(Math.max(-.072,Math.min(.072,yawRate*next*.004))-c.roll)*settle;
   c.spin*=Math.exp(-dt*3.6);c.yaw+=(yawRate+c.spin)*dt;
   const sin=Math.sin(c.yaw),cos=Math.cos(c.yaw);
   // Tyres gain grip progressively. Hard braking in a turn lets the tail step out.
   const lateral=(side-Math.sin(yawRate*dt)*forward)*Math.exp(-dt*grip*(c.brake?.65:1));
   c.vx=sin*next+cos*lateral;c.vz=-cos*next+sin*lateral;c.speed=next;
   c.x+=c.vx*dt;c.z+=c.vz*dt;
   // Scrub follows sideways tyre motion. Braking already reduces grip above.
   c.slip=Math.min(1,Math.abs(lateral)*.19);
 },
 // Separating-axis contact between two oriented car footprints.
 contact(c,other,halfWidth=.91,halfLength=1.98){
   const dx=c.x-other.x,dz=c.z-other.z;
   if(Math.abs(dx)>5.5||Math.abs(dz)>5.5)return null;
   const side=[Math.cos(c.yaw),Math.sin(c.yaw)],front=[side[1],-side[0]];
   const bodyWidth=c.spec?.width?c.spec.width/2:.91,bodyLength=c.spec?.width?c.spec.length/2:1.98;
   const os=[Math.cos(other.yaw),Math.sin(other.yaw)],of=[os[1],-os[0]];
   const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];let hit;
   for(const a of [side,front,os,of]){
     const center=dx*a[0]+dz*a[1],depth=bodyWidth*Math.abs(dot(side,a))+bodyLength*Math.abs(dot(front,a))+halfWidth*Math.abs(dot(os,a))+halfLength*Math.abs(dot(of,a))-Math.abs(center);
     if(depth<=0)return null;
     if(!hit||depth<hit.depth){const s=center<0?-1:1;hit={nx:a[0]*s,nz:a[1]*s,depth};}
   }
   hit.axle=Math.max(-1.8,Math.min(1.8,-dx*front[0]-dz*front[1]));
   return hit;
 },
 resolve(c,hit,otherVX=0,otherVZ=0,target=null){
   const {nx,nz,depth}=hit,closing=Math.max(0,-((c.vx-otherVX)*nx+(c.vz-otherVZ)*nz));
   const right=nx*Math.cos(c.yaw)+nz*Math.sin(c.yaw),ahead=nx*Math.sin(c.yaw)-nz*Math.cos(c.yaw);
   c.x+=nx*(depth+.015);c.z+=nz*(depth+.015);
   const mass=this.mass(c),targetMass=target?this.mass(target):Infinity;
   const reduced=1/(1/mass+1/targetMass),e=target ? .16 : ({tree:.12,pole:.21,water:0,building:.09}[hit.kind]??.14);
   const impulse=(1+e)*reduced*closing,delta=impulse/mass;
   const energy=.5*reduced*closing*closing,dissipated=energy*(1-e*e);
   c.vx+=nx*delta;c.vz+=nz*delta;
   const lever=hit.axle??0;
   c.spin+=Math.max(-1.4,Math.min(1.4,right*lever*delta*.075));
   c.pitch=Math.max(-.1,Math.min(.09,c.pitch+ahead*delta*.004));
   c.roll=Math.max(-.11,Math.min(.11,c.roll-right*delta*.004));
   c.speed=c.vx*Math.sin(c.yaw)-c.vz*Math.cos(c.yaw);
   const absorbed=dissipated*(target?targetMass/(targetMass+mass):hit.kind==='water'?.28:.87);
   return {closing,energy,dissipated,impulse,targetMass,otherVX,otherVZ,delta,
     strength:1-Math.exp(-Math.sqrt(dissipated)/190),damage:Math.min(100,Math.round(100*absorbed/260000))};
 }
};

;