'use strict';
const T=THREE, $=id=>document.getElementById(id), clamp=T.MathUtils.clamp;
const query=new URLSearchParams(location.search);
const arcade=document.body.classList.contains('arcade');
const exam=query.get('mode')==='exam';
const routes={
  river:{id:'river',name:'Tuyến ven sông',finish:2240,crossing:820,bridge:[665,825],near:'Cầu Bến Lau',turn:'Ngã ba bến chợ',junction:1450,sign:1,
    headings:[[0,0],[140,0],[300,42],[420,54],[650,14],[880,12],[1030,-32],[1230,-47],[1415,-43],[1485,32],[1640,42],[1840,10],[2020,0],[2240,0]]},
  pass:{id:'pass',name:'Đèo trà',finish:2480,crossing:645,bridge:[440,552],near:'Cầu Suối Trà',turn:'Ngã ba nông trường',junction:1030,sign:-1,
    headings:[[0,0],[100,0],[270,-46],[425,-74],[560,-65],[690,-15],[805,42],[995,51],[1065,-31],[1145,-40],[1330,-77],[1450,-54],[1600,22],[1740,61],[1900,35],[2050,-32],[2210,-6],[2350,10],[2480,10]]}
};
if(arcade){
 const group=document.createElement('optgroup');group.label='Đường đèo Việt Nam';
 for(const stage of mountainStages){
   const finish=stage.angles.length*stage.step;
   routes[stage.id]={id:stage.id,name:stage.name,stage,finish,crossing:finish*.55,
     bridge:[Math.round(finish*.27/4)*4,Math.round(finish*.27/4)*4+80],junction:finish*.7,sign:1,near:'Cầu trên chặng',turn:'Ngã rẽ'};
   group.append(new Option(stage.name+' · '+(finish/1000).toLocaleString('vi-VN')+' km',stage.id));
 }
 $('route').append(group);
}
function sampleStage(values,station,spacing){
 const pos=clamp(station/spacing,0,values.length-1),i=Math.floor(pos);
 return values[i]+((values[i+1]??values[i])-values[i])*(pos-i);
}
const route=(Object.hasOwn(routes,query.get('route')) && routes[query.get('route')]) || (exam&&crypto.getRandomValues(new Uint8Array(1))[0]%2?routes.pass:routes.river);
$('route').value=route.id;$('route').disabled=exam;$('routeName').textContent=route.name;
$('route').onchange=e=>{const u=new URL(location.href);u.searchParams.set('route',e.target.value);location.href=u.href;};
const roadHalfWidth=route.stage?4.15:6;
const featuredPass=scenicPasses.has(route.id);
const step=4,points=[];
const carriagewayHeights=smoothRoadProfile(route.stage);
function heading(d){
  if(route.stage)return sampleStage(route.stage.angles,d-route.stage.step/2,route.stage.step)*Math.PI/180;
  const pairs=route.headings;let i=1;while(i<pairs.length-1&&pairs[i][0]<d)i++;
  const [a,b]=[pairs[i-1],pairs[i]], t=clamp((d-a[0])/(b[0]-a[0]),0,1);
  return (a[1]+(b[1]-a[1])*t*t*(3-2*t))*Math.PI/180;
}
function height(d){
  if(route.stage){
    // A cubic vertical curve gives neighbouring segments a common tangent.
    const h=carriagewayHeights,last=h.length-1,spacing=route.stage.step;
    const s=clamp(d/spacing,0,last),i=Math.min(last-1,Math.floor(s)),t=s-i;
    const delta=h[i+1]-h[i],a=i?(h[i+1]-h[i-1])*.5:delta;
    const b=i+2<=last?(h[i+2]-h[i])*.5:delta;
    return h[i]+t*(a+t*(3*delta-2*a-b+t*(a+b-2*delta)));
  }
  const [a,b]=route.bridge;
  const ramp=Math.max(0,Math.min(1,(d-a+64)/64,(b+64-d)/64));
  const bridge=ramp*ramp*(3-2*ramp)*2.6;
  if(route.id!=='pass')return .7*Math.sin(d/140)+bridge;
  // Sustained ascent, level bridge deck, summit, then a descent into the valley.
  const stops=passProfile;
  for(let i=1;i<stops.length;i++)if(d<=stops[i][0]){
    const [x,y]=stops[i-1],[end,top]=stops[i],t=clamp((d-x)/(end-x),0,1);
    return .72*(y+(top-y)*t*t*(3-2*t))+bridge;
  }
  return .72*stops.at(-1)[1]+bridge;
}
function roadGrade(d,yaw){return (height(d+2)-height(d-2))*.25*Math.cos(yaw-heading(d));}
const passProfile=[[0,0],[80,0],[420,24],[560,24],[1120,68],[1370,73],[2060,19],[2480,7]];
let px=0,pz=0;
for(let d=0;d<=route.finish+80;d+=step){
  const h=heading(d);points.push({x:px,z:pz,y:height(d),h});
  const mid=heading(d+step/2);px+=Math.sin(mid)*step;pz-=Math.cos(mid)*step;
}
function at(d,l=0){
  d=clamp(d,0,(points.length-1)*step-.001);
  const i=Math.floor(d/step),f=d/step-i,a=points[i],b=points[i+1],h=a.h+(b.h-a.h)*f;
  return {x:a.x+(b.x-a.x)*f+l*Math.cos(h),z:a.z+(b.z-a.z)*f+l*Math.sin(h),y:a.y+(b.y-a.y)*f,h};
}
function roadCoordinates(x,z,near){
  const base=Math.floor(near/step);let best=Infinity,d=near,offset=0;
  for(let i=Math.max(0,base-5);i<=Math.min(points.length-2,base+5);i++){
    const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z;
    const f=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1);
    const ox=x-a.x-f*dx,oz=z-a.z-f*dz,dd=ox*ox+oz*oz;
    if(dd<best){best=dd;d=(i+f)*step;offset=(ox*(-dz)+oz*dx)/step;}
  }
  return {d,offset};
}
const scene=new T.Scene(), renderer=DrivingRenderer.get($('world'));
scene.background=new T.Color(0xbcd7de);scene.fog=new T.FogExp2(0xc8dbd4,.00205);
if(!featuredPass)new T.TextureLoader().load('streetscape/sky.jpg',tex=>{tex.mapping=T.EquirectangularReflectionMapping;tex.colorSpace=T.SRGBColorSpace;scene.background=tex;if(!scene.environment)scene.environment=tex;});
if(arcade)new T.TextureLoader().load('streetscape/'+(route.stage?'pass':route.id)+'-reflection.jpg',tex=>{
 tex.mapping=T.EquirectangularReflectionMapping;tex.colorSpace=T.SRGBColorSpace;scene.environment=tex;
});
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
scene.fog=new T.FogExp2(0xb4c6c5,.00135);
if(!featuredPass)scene.add(new T.HemisphereLight(0xcde4ff,0x887d64,1.05));
const sun=new T.DirectionalLight(0xffdfaf,2.8);sun.castShadow=true;sun.position.set(-38,45,22);scene.add(sun,sun.target);
const passSky=featuredPass?createWorldAtmosphere(T,scene,sun,new T.TextureLoader(),route.stage.bearing*Math.PI/180,.00016):null;
const passSurface=featuredPass?createPassSurface(T):null;
if(passSky){passSky.setLocation(...route.stage.start);passSky.setHour(scenicHour());passSurface.select(route.id);}
renderer.shadowMap.autoUpdate=false;
Object.assign(sun.shadow.camera,{left:-43,right:43,top:43,bottom:-43,near:1,far:170});sun.shadow.camera.updateProjectionMatrix();
sun.shadow.normalBias=.025;sun.shadow.bias=-.00022;
const camera=new T.PerspectiveCamera(62,1,.08,3300);
const graphics=createDrivingGraphics(renderer,camera,sun);
const geom={box:new T.BoxGeometry(1,1,1),leaf:new T.PlaneGeometry(1,1),houseRoof:new T.ConeGeometry(Math.SQRT1_2,1,4).rotateY(Math.PI/4),pole:new T.CylinderGeometry(.5,.5,1,8)};
const batches=new Map(),temp=new T.Object3D();
function scatter(kind,color,x,y,z,w,h,l,angle=0,pitch=0,cell=''){
  const key=kind+color+cell;let batch=batches.get(key);
  if(!batch){batch={kind,color,matrices:[]};batches.set(key,batch);}
  temp.position.set(x,y,z);temp.rotation.set(pitch,angle,0,'YXZ');temp.scale.set(w,h,l);temp.updateMatrix();batch.matrices.push(temp.matrix.clone());
}
function beside(d,l,kind,color,w,h,depth,base=0,angle=0){
  const p=at(d,l);scatter(kind,color,p.x,p.y+base+h/2,p.z,w,h,depth,-p.h+angle,h<.65&&angle===0?Math.atan(roadGrade(d,p.h)):0);
}
let seed=Array.from(route.id).reduce((hash,c)=>Math.imul(hash,31)+c.charCodeAt(0)|0,351);
function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
function ribbon(left,right,color,raise,roadMaterial,dashed=false){
  const verts=[],uv=[],indices=[];
  for(let i=0;i<points.length;i++){
    for(const [edge,u] of [[left,0],[right,1]]){const p=at(i*step,edge);verts.push(p.x,p.y+raise,p.z);uv.push(u,i*step/9);}
    const branchOpening=!route.stage&&Math.abs(right-left)<.12&&Math.sign(left)===-route.sign&&Math.abs((i-.5)*step-route.junction)<7;
    if(i&&!branchOpening&&(!dashed||i%3===1)){const n=i*2;indices.push(n-2,n-1,n,n-1,n+1,n);}
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
  const material=roadMaterial||new T.MeshLambertMaterial({color,side:T.DoubleSide});
  if(roadMaterial)material.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec2 roadUv;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n roadUv=uv;');
    shader.fragmentShader='varying vec2 roadUv;\n'+shader.fragmentShader.replace('#include <map_fragment>',`
      #include <map_fragment>
      float drift=sin(roadUv.y*.24)*.019;
      float lane=fract(roadUv.x*2.+drift);
      vec2 tracks=(vec2(lane)-vec2(.28,.72))*9.;
      float tires=exp(-tracks.x*tracks.x)+exp(-tracks.y*tracks.y);
      float mottle=texture2D(map,vMapUv*.124+vec2(.41,.13)).r;
      diffuseColor.rgb*=clamp(.9+mottle*.36,.88,1.10)*(1.-tires*(.13+.05*sin(roadUv.y*.7)));
    `);
    if(passSky){
      shader.uniforms.wetPavement=passSky.wetness;
      shader.fragmentShader='uniform float wetPavement;\n'+shader.fragmentShader
        .replace('#include <color_fragment>','#include <color_fragment>\n diffuseColor.rgb*=1.-.35*wetPavement;')
        .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n roughnessFactor=mix(roughnessFactor,.17,wetPavement*(.5+.5*mottle));');
    }
  };
  const surface=new T.Mesh(geo,material);surface.receiveShadow=true;scene.add(surface);
}
const surfaces=createRoadSurfaces(T,renderer),roadSurface=surfaces.scanned('asphalt',0xaeb2b3,.41);
roadSurface.side=T.DoubleSide;surfaces.transform(roadSurface,3,2.25);
// Race.js also uses the road texture for the starting apron.
const asphalt=roadSurface.map;
if(route.id==='river')ribbon(-roadHalfWidth-.7,roadHalfWidth+.7,0x8a856e,-.06);
ribbon(-roadHalfWidth,roadHalfWidth,0xb4b8b8,0,roadSurface);
for(const side of [-1,1])ribbon(side*roadHalfWidth-.22*side-.055,side*roadHalfWidth-.22*side+.055,0xc8c6ad,.012);
ribbon(-.068,.068,0xc8a75b,.014,null,true);
const river=route.id==='river', [bridgeStart,bridgeEnd]=route.bridge;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
function nearest(x,z){
  let best=Infinity,index=0;
  function test(i){const p=points[i],v=(p.x-x)**2+(p.z-z)**2;if(v<best){best=v;index=i;}}
  for(let i=0;i<points.length;i+=10)test(i);
  const coarse=index;
  for(let i=Math.max(0,coarse-10);i<=Math.min(points.length-1,coarse+10);i++)test(i);
  // Project to the closest segment instead of a 4 m station. This avoids tiny
  // stair steps along shoulders when the road climbs around a switchback.
  let answer;
  for(let i=Math.max(0,index-1);i<=Math.min(index,points.length-2);i++){
    const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z;
    const t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1),cx=a.x+t*dx,cz=a.z+t*dz;
    const dist=Math.hypot(x-cx,z-cz);
    if(!answer||dist<answer.dist)answer={d:(i+t)*step,side:((x-cx)*(-dz)+(z-cz)*dx)/step,
      dist,y:a.y+(b.y-a.y)*t,cx,cz};
  }
  return answer;
}
function courseRelief(raw){
  if(!raw||river)return null;
  // The race profile has gentler grades than the surveyed land surface. Bring
  // the entire valley into the same local vertical datum, interpolating offsets
  // from multiple stretches of the road at hairpins and on adjacent switchbacks.
  const controls=points.filter((p,i)=>i%8===0).map(p=>({x:p.x,z:p.z,bias:p.y-raw.ground(p.x,p.z)}));
  const spacing=56,cache=new Map();
  function offset(i,j){
    const key=i+','+j;if(cache.has(key))return cache.get(key);
    const x=i*spacing,z=j*spacing;let weighted=0,weights=0,nearest=Infinity;
    for(const p of controls){
      const dx=x-p.x,dz=z-p.z,d2=dx*dx+dz*dz;if(d2>1300*1300)continue;
      nearest=Math.min(nearest,d2);
      const w=1/(d2+2400)**2;weighted+=w*p.bias;weights+=w;
    }
    const value=weights?weighted/weights*(1-smooth(450,1250,Math.sqrt(nearest))):0;
    cache.set(key,value);return value;
  }
  const depth=(x,z)=>Math.max(0,raw.seaLevel-raw.ground(x,z));
  return {id:raw.id,seaLevel:raw.seaLevel,depth,ground(x,z){
    const u=x/spacing,v=z/spacing,i=Math.floor(u),j=Math.floor(v),fx=u-i,fz=v-j;
    const a=offset(i,j),b=offset(i+1,j),c=offset(i,j+1),d=offset(i+1,j+1);
    const land=raw.ground(x,z),correction=(a+(b-a)*fx)*(1-fz)+(c+(d-c)*fx)*fz;
    return Math.max(raw.seaLevel-9,land)+correction*smooth(0,15,land-raw.seaLevel);
  }};
}
const mountainField=courseRelief(window.stageRelief);
if(mountainField){
  scene.fog.density=.00019;camera.far=22000;camera.updateProjectionMatrix();
}
// The two fictional training routes use explicitly named reference cities.
const weatherOrigin=route.stage?.start||(river?[105.785,10.034]:[107.808,11.547]);
const weatherBearing=(route.stage?.bearing||0)*Math.PI/180;
const courseWeather=createDrivingWeather(T,scene,sun,roadSurface,route.stage?'':river?'Cần Thơ':'Bảo Lộc');
let nextWeatherCheck=0;
const waterLevel=river?-3:height((bridgeStart+bridgeEnd)/2)-8;
function naturalSurface(x,z,n){
  const a=n.dist,d=n.d;
  let y;
  if(mountainField){
    const natural=mountainField.ground(x,z);
    if(a>68)return natural;
    const cross=natural-mountainField.ground(n.cx,n.cz);
    // Horizontal bench at the asphalt, a steep exposed uphill cut, a shallower
    // downhill fill, then the sampled relief at its measured lateral distance.
    const slope=cross/Math.max(4,a),ridge=.75+.25*Math.sin(d*.019+Math.sin(d*.031));
    const cut=Math.max(0,Math.min(.65,slope))*7*ridge;
    const fill=Math.max(0,Math.min(.8,-slope))*2.8;
    const shaped=n.y-.32+cross*smooth(9,48,a)
      +cut*smooth(12,23,a)*(1-smooth(26,68,a))-fill*smooth(11,23,a)*(1-smooth(35,80,a));
    y=T.MathUtils.lerp(shaped,natural,smooth(17,68,a));
  }else{
    const rolling=1.1*Math.sin(x/19+z/44)+1.6*Math.cos(z/37)+Math.sin(x/11-z/29)*.35;
    const high=(river?10:45)+(river?7:27)*Math.sin(x/65+z/117)+(river?5:13)*Math.cos(z/53);
    y=n.y-.45+smooth(9,50,a)*rolling+smooth(31,155,a)*high;
  }
  const center=(bridgeStart+bridgeEnd)/2+clamp(n.side,-90,90)*.15;
  const channel=1-smooth((bridgeEnd-bridgeStart)*.30,(bridgeEnd-bridgeStart)*.52,Math.abs(d-center));
  const stream=river?smooth(12,23,-n.side)*(1-smooth(64,81,-n.side))*(1-smooth(bridgeEnd,bridgeEnd+76,d)):0;
  const waterBlend=route.stage?0:mountainField?channel*(1-smooth(65,155,a)):Math.max(channel,stream);
  return T.MathUtils.lerp(y,waterLevel-2,waterBlend);
}
function besideWater(d){return !route.stage&&(river||Math.abs(d-(bridgeStart+bridgeEnd)*.5)<(bridgeEnd-bridgeStart)*.8);}
const junction=at(route.junction),branchSide=-route.sign,branchLength=64;
function localPoint(p,l,d){
  const c=Math.cos(p.h),s=Math.sin(p.h);
  return {x:p.x+l*c+d*s,z:p.z+l*s-d*c};
}
function branchCurve(u){return u*(.27+.002*u);}
function branchPosition(u,offset=0){return localPoint(junction,u*branchSide,branchCurve(u)+offset);}
function branchCoords(x,z){
  const dx=x-junction.x,dz=z-junction.z,c=Math.cos(junction.h),s=Math.sin(junction.h);
  const u=(c*dx+s*dz)*branchSide;
  return {u,v:s*dx-c*dz-branchCurve(u)};
}
function onBranch(x,z,margin){
  if(route.stage)return false;
  const {u,v}=branchCoords(x,z);
  return u>=0&&u<branchLength+margin&&Math.abs(v)<5+margin;
}
const branchHeights=[junction.y];
if(!route.stage)for(let u=4;u<=branchLength;u+=4){
  const p=branchPosition(u),n=nearest(p.x,p.z),last=branchHeights.at(-1);
  branchHeights.push(u<12?junction.y:clamp(naturalSurface(p.x,p.z,n),last-.36,last+.36));
}
function surface(x,z,n){
  const natural=naturalSurface(x,z,n);
  if(!onBranch(x,z,36))return natural;
  const {u,v}=branchCoords(x,z),grade=sampleStage(branchHeights,u,4)-.12;
  // Keep a complete terrain cell of graded shoulder around the lane and turning head.
  // Otherwise coarse terrain triangles pull the road back into the uncut hillside.
  const weight=smooth(4,11,u)*(1-smooth(13,36,Math.abs(v)))*(1-smooth(branchLength+10,branchLength+36,u));
  return T.MathUtils.lerp(natural,grade,weight);
}
function ground(x,z){return surface(x,z,nearest(x,z));}
const box=new T.Box3().setFromPoints(points.map(p=>new T.Vector3(p.x,0,p.z)));
function groundMap(path){
  const map=new T.TextureLoader().load('streetscape/'+path);map.colorSpace=T.SRGBColorSpace;
  map.wrapS=map.wrapT=T.RepeatWrapping;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return map;
}
const meadow=groundMap('verge-grass.webp'),earth=groundMap('verge-earth.webp');
const courseWater=createDrivingWater(T,false);
let nearTerrain=null;
function renderedGround(x,z){
  if(!nearTerrain)return ground(x,z);
  const {grid,x0,z0,nx,nz,data}=nearTerrain,u=(x-x0)/grid,v=(z-z0)/grid;
  if(u<-.0001||v<-.0001||u>nx-1+.0001||v>nz-1+.0001)return ground(x,z);
  const i=clamp(Math.floor(u),0,nx-2),j=clamp(Math.floor(v),0,nz-2);
  const f=u-i,g=v-j,a=i+j*nx,b=a+1,c=a+nx,d=c+1;
  return f+g<=1?data[a]+f*(data[b]-data[a])+g*(data[c]-data[a]):
    data[d]+(1-f)*(data[c]-data[d])+(1-g)*(data[b]-data[d]);
}
function addCourseWater(waterVerts,profiles,indices,name){
  const waterIndices=[];
  // Clip at the intersection with each rendered land triangle. This gives the
  // renderer an actual shoreline instead of overlapping full squares of water.
  for(let i=0;i<indices.length;i+=3){
    const a=indices[i],b=indices[i+1],c=indices[i+2];
    if(Math.max(profiles[a*3+2],profiles[b*3+2],profiles[c*3+2])<=0)continue;
    if(Math.min(profiles[a*3+2],profiles[b*3+2],profiles[c*3+2])>=0){waterIndices.push(a,b,c);continue;}
    const ring=[];let p=c;
    for(const q of [a,b,c]){
      const dp=profiles[3*p+2],dq=profiles[3*q+2];
      if((dp>0)!==(dq>0)){
        const t=dp/(dp-dq);ring.push(waterVerts.length/3);
        for(let k=0;k<3;k++)waterVerts.push(waterVerts[3*p+k]+t*(waterVerts[3*q+k]-waterVerts[3*p+k]));
        for(let k=0;k<2;k++)profiles.push(profiles[3*p+k]+t*(profiles[3*q+k]-profiles[3*p+k]));
        profiles.push(0);
      }
      if(dq>0)ring.push(q);p=q;
    }
    for(let k=2;k<ring.length;k++)waterIndices.push(ring[0],ring[k-1],ring[k]);
  }
  if(waterIndices.length){
    const waterGeometry=new T.BufferGeometry();
    waterGeometry.setAttribute('position',new T.Float32BufferAttribute(waterVerts,3));
    waterGeometry.setAttribute('riverProfile',new T.Float32BufferAttribute(profiles,3));
    waterGeometry.setIndex(waterIndices);waterGeometry.computeVertexNormals();
    const water=new T.Mesh(waterGeometry,courseWater.material);water.name=name;water.receiveShadow=true;scene.add(water);
  }
}
function terrain(){
  const grid=6,margin=235,nx=Math.ceil((box.max.x-box.min.x+2*margin)/grid)+1,nz=Math.ceil((box.max.z-box.min.z+2*margin)/grid)+1;
  const verts=[],colors=[],uv=[],soil=[],indices=[],base=new T.Color(),tea=new T.Color(0xcbd3b0),sand=new T.Color(0xe5d6bb);
  const waterVerts=[],profiles=[],cutWeights=[],seaWeights=[],data=new Float32Array(nx*nz);
  nearTerrain={grid,x0:box.min.x-margin,z0:box.min.z-margin,nx,nz,data};
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){
    const x=box.min.x-margin+i*grid,z=box.min.z-margin+j*grid,n=nearest(x,z),y=surface(x,z,n);
    data[j*nx+i]=y;
    const marine=route.stage&&mountainField;
    const level=marine?mountainField.seaLevel:besideWater(n.d)&&(!mountainField||n.dist<145)?waterLevel:-1e4;
    const actualDepth=marine&&!mountainField.depth(x,z)?Math.min(-.02,level-y):level-y;
    const heading=points[Math.min(points.length-1,Math.round(n.d/step))].h;
    const crossChannel=Math.abs(n.d-(bridgeStart+bridgeEnd)*.5)<(bridgeEnd-bridgeStart)*.55;
    const angle=heading+(crossChannel?Math.PI/2:0),current=marine?.16:river?.6:.93;
    waterVerts.push(x,marine?level:waterLevel,z);profiles.push(Math.sin(angle)*current,-Math.cos(angle)*current,actualDepth*2.6);
    const cut=mountainField?Math.min(1,Math.max(0,(y-n.y+.3)/Math.max(4,n.dist)) * 4)
      *smooth(9,17,n.dist)*(1-smooth(35,75,n.dist)):0;
    cutWeights.push(cut);seaWeights.push(mountainField?mountainField.depth(x,z):0);
    const patch=.45+.21*Math.sin(x/33+z/75)+.22*Math.cos(x/85-z/24);
    base.set(river?0xa4b89b:0x94aca0).lerp(tea,patch).lerp(sand,1-smooth(level,level+1.8,y));
    uv.push(x/3.6,z/3.6);soil.push(Math.max(1-smooth(6,11,n.dist),1-smooth(level+.5,level+2.3,y)));
    if(mountainField){
      base.set(0xaabf9e).lerp(tea,patch*.31);
      const wood=smooth(45,230,n.dist)*(.84+.16*Math.sin(x*.023+z*.011));
      base.r*=1-.55*wood;base.g*=1-.24*wood;base.b*=1+.14*wood;
    }
    base.multiplyScalar(.96+.03*Math.sin(x*.67+z*.22));verts.push(x,y,z);colors.push(base.r,base.g,base.b);
    if(j&&i){const k=j*nx+i;indices.push(k-nx-1,k-1,k-nx,k-1,k,k-nx);}
  }
  addCourseWater(waterVerts,profiles,indices,'Course waterline');
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('soil',new T.Float32BufferAttribute(soil,1));g.setAttribute('cut',new T.Float32BufferAttribute(cutWeights,1));g.setAttribute('marine',new T.Float32BufferAttribute(seaWeights,1));
  const land=new T.MeshLambertMaterial({vertexColors:true,map:meadow});
  const rock=mountainField?groundMap('surfaces/cut-rock-color.webp'):null;
  const rockNormal=mountainField?groundMap('surfaces/cut-rock-normal.webp'):null;
  if(rockNormal)rockNormal.colorSpace=T.NoColorSpace;
  land.onBeforeCompile=shader=>{
    shader.uniforms.earthMap={value:earth};
    const vars='varying float soilWeight; varying float exposed; varying float seaDepth; varying vec3 hillside; varying vec3 hillsideNormal;\n';
    shader.vertexShader='attribute float soil; attribute float cut; attribute float marine;\n'+vars+shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n soilWeight=soil; exposed=cut; seaDepth=marine; hillside=position; hillsideNormal=normal;');
    let colour='vec4 sediment=texture2D(earthMap,vMapUv*1.6); float wetness=smoothstep(.25,.93,soilWeight+(sediment.g-.18)*.32); diffuseColor *= mix(texture2D(map,vMapUv),sediment,wetness);';
    if(mountainField){
      shader.uniforms.cutStone={value:rock};shader.uniforms.cutNormal={value:rockNormal};
      colour+=`
        vec3 hn=normalize(hillsideNormal);
        vec2 side=abs(hn.xz);float west=side.x/(side.x+side.y+.001);
        vec2 u=hillside.zy/3.3, v=hillside.xy/3.3;
        vec2 warp=.24*vec2(sin(hillside.y*.077+hillside.z*.033),sin(hillside.x*.069+hillside.y*.081));
        u+=warp;v-=warp;
        float seam=sin(hillside.x*.31+hillside.z*.23)*sin(hillside.y*.49-hillside.z*.17);
        float amount=smoothstep(.27,.85,exposed*.83+max(0.,.79-hn.y)*1.75+seam*.23);
        vec3 rockColour=mix(texture2D(cutStone,v).rgb,texture2D(cutStone,u).rgb,west);
        vec3 veins=texture2D(cutStone,(u+v)*.21+vec2(.27,.76)).rgb;
        rockColour=mix(vec3(dot(rockColour,vec3(.27,.57,.16))),rockColour,.48)*
          (1.16+dot(veins,vec3(.3,.5,.2))*.8)+vec3(.014,.018,.021);
        vec3 rockyNormal=mix(texture2D(cutNormal,v).xyz,texture2D(cutNormal,u).xyz,west)*2.-1.;
        float weather=.89+.06*sin(dot(hillside,vec3(.088,.33,-.069)))+.05*sin(hillside.y*.09);
        diffuseColor.rgb=mix(diffuseColor.rgb,rockColour*weather*(1.+rockyNormal.x*.12-rockyNormal.y*.16),amount);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.12,.115,.083),smoothstep(.1,1.7,seaDepth));`;
    }
    shader.fragmentShader=vars+'uniform sampler2D earthMap; uniform sampler2D cutStone; uniform sampler2D cutNormal;\n'
      +shader.fragmentShader.replace('#include <map_fragment>',colour);
    passSurface?.shade(shader,'hillside.xz','(.32+.56*smoothstep(22.,190.,length(vViewPosition)))*(1.-exposed)*(1.-soilWeight)');
  };
  const field=new T.Mesh(g,land);field.receiveShadow=true;scene.add(field);
}
terrain();
const hills=mountainField?mountainHorizon(nearTerrain,mountainField):distantHills();
const foliage={};
const courseTrees=createTreeModels(T);
const distantTrees=new Map();
function scatterTree(kind,x,y,z,w,h,angle,compact=false){
 const variant=courseTrees.variantAt(x,z),key=kind+variant+(compact?'Grove':'');
 if(!geom[key]){
   geom[key]=courseTrees.geometry(kind,compact,variant);
   foliage[key]=kind==='palm'?courseTrees.palmMaterial:courseTrees.material;
   if(!compact)distantTrees.set(key,courseTrees.geometry(kind,true,variant));
 }
 const cell=':'+Math.floor(x/220)+','+Math.floor(z/220);
 scatter(key,0xffffff,x,y,z,w,h,w,angle,0,cell);
}
function tree(d,l){
 const p=at(d,l),n=nearest(p.x,p.z),y=renderedGround(p.x,p.z);
 if(n.dist<10||besideWater(n.d)&&y<waterLevel+.6||onBranch(p.x,p.z,4))return;
 const palm=river&&random()<.42,kind=palm?'palm':'tree';
 const h=(palm?8:6.8)+random()*(palm?7:5.8),w=h*(palm?.588:.923)*(.9+random()*.2);
 const angle=random()*Math.PI;
 scatterTree(kind,p.x,y,p.z,w,h,angle);
}
function teaRows(d0,end,side){
  const verts=[],indices=[],colors=[],uv=[],col=new T.Color();
  for(let row=0;row<13;row++){
    let prev=-1;
    for(let d=d0;d<=end;d+=1.25){
      const hedge=side*(14+row*2.2+.4*Math.sin(d*.019+row*.17));
      const p=at(d,hedge),n=nearest(p.x,p.z),y=renderedGround(p.x,p.z);
      if(n.dist<12||besideWater(n.d)&&y<waterLevel+2||onBranch(p.x,p.z,2)){prev=-1;continue;}
      const k=verts.length/3,scale=.94+.08*Math.sin(d*1.71+row*2.2)+.05*Math.cos(d*.42-row);
      const tint=.83+.13*Math.sin(d*.27+row)+.09*Math.sin(d*2.3+row);
      for(const [delta,raise,tone] of [[-.76,.04,0x536749],[-.52,.54,0x8b9f69],
                                        [0,.73,0x9daa78],[.49,.60,0x8d9b66],[.74,.04,0x637747]]){
        const q=at(d,hedge+delta*scale);
        verts.push(q.x,renderedGround(q.x,q.z)+raise*scale,q.z);uv.push(d/1.1,(delta+.76)*.6);
        col.set(tone).multiplyScalar(tint);colors.push(col.r,col.g,col.b);
      }
      if(prev>=0)for(let t=0;t<4;t++)indices.push(prev+t,prev+t+1,k+t,prev+t+1,k+t+1,k+t);
      prev=k;
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));
  g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
  const rows=new T.Mesh(g,new T.MeshLambertMaterial({vertexColors:true,map:meadow,side:T.DoubleSide}));
  rows.receiveShadow=true;scene.add(rows);
}
if(route.id==='pass')for(const [d,end,side] of [[8,230,-1],[60,395,1],[580,950,-1],[1150,1450,1],[1580,1890,-1],[2010,2380,1]])teaRows(d,end,side);
if(!route.stage)for(let d=bridgeStart;d<=bridgeEnd;d+=4){
  beside(d,0,'box',0x857e6d,roadHalfWidth*2+1.5,.6,4.2,-.62);
  for(const side of [-1,1]){
    beside(d,side*(roadHalfWidth+.28),'box',0x97988d,.35,.26,4.15);
    beside(d,side*(roadHalfWidth+.42),'box',0xc4c9b8,.18,.16,4.18,1.04);
    beside(d,side*(roadHalfWidth+.42),'pole',0x88948c,.13,.9,.13,.24);
    beside(d,side*(roadHalfWidth+.42),'box',0x87928c,.08,.08,4.18,.6);
  }
}
function footing(p,width,depth){
  const samples=[renderedGround(p.x,p.z)];
  for(const across of [-width/2,0,width/2])for(const along of [-depth/2,depth/2]){
    const q=localPoint(p,across,along);samples.push(renderedGround(q.x,q.z));
  }
  return {low:Math.min(...samples),high:Math.max(...samples)};
}
if(!route.stage){
  for(const d of [bridgeStart,bridgeEnd]){
    const p=at(d),width=roadHalfWidth*2+1.3,top=p.y-.47;
    const bottom=Math.min(top-.35,footing(p,width,2.4).low-.45);
    scatter('box',0x8d8979,p.x,(top+bottom)/2,p.z,width,top-bottom,2.4,-p.h);
  }
  const spans=Math.ceil((bridgeEnd-bridgeStart)/25);
  for(let i=1;i<spans;i++){
    const d=bridgeStart+(bridgeEnd-bridgeStart)*i/spans,p=at(d),cap=p.y-.62;
    scatter('box',0x878375,p.x,cap-.24,p.z,roadHalfWidth*2-.8,.50,1.85,-p.h);
    for(const side of [-1,1]){
      const q=at(d,side*(roadHalfWidth-2)),top=cap-.45,bottom=Math.min(top-.25,footing(q,1.2,1.2).low-.4);
      scatter('pole',0x827e71,q.x,(bottom+top)/2,q.z,1.2,top-bottom,1.2);
    }
  }
}
for(let d=15;d<route.finish+50;d+=13){
  if(!route.stage&&d>bridgeStart-10&&d<bridgeEnd+10)continue;
  for(const side of [-1,1]){
    const deep=river&&side<0?75:river?12:33;
    if(random()>.2)tree(d+random()*6,side*(deep+random()*15));
    if(random()>.35)tree(d+random()*10,side*(deep+18+random()*24));
  }
  if(!route.stage&&d%65<14&&d>70&&Math.abs(d-route.junction)>65){
    const side=river?1:(random()>.45?1:-1),l=side*(river?20+random()*7:49+random()*8),h=3.5+random()*2,w=5+random()*4;
    const p=at(d,l),pad=footing(p,w+.2,8.2),y=pad.high+.06,bottom=pad.low-.24;
    if(y-bottom>2.4||besideWater(d)&&pad.low<waterLevel+.4||onBranch(p.x,p.z,6))continue;
    scatter('box',0x817d6e,p.x,(y+bottom)/2,p.z,w+.2,y-bottom,8.2,-p.h);
    scatter('box',random()>.5?0xc6b699:0xa4ae99,p.x,y+h/2,p.z,w,h,8,-p.h);
    // Rotate the square cone in its own frame so rectangular roof eaves follow the walls.
    scatter('houseRoof',0x955e45,p.x,y+h+1,p.z,w+.7,2,8.7,-p.h);
    const door=localPoint(p,-side*(w/2+.04),0);
    scatter('box',0x414e4b,door.x,y+1.15,door.z,.08,2.3,1.2,-p.h);
    for(const dz of [-2.5,2.5]){
      const q=localPoint(p,-side*(w/2+.045),dz);
      scatter('box',0x648185,q.x,y+2.075,q.z,.09,1.15,1.3,-p.h);
    }
  }
}
if(!route.stage){
  const pos=[],uv=[],indices=[],cols=7;
  for(let u=roadHalfWidth-1;u<=branchLength;u++){
    const half=3.1+2.7*(1-smooth(5,15,u))+1.2*smooth(49,59,u);
    for(let col=0;col<cols;col++){
      const t=col/(cols-1),p=branchPosition(u,(2*t-1)*half),n=nearest(p.x,p.z);
      const groundY=renderedGround(p.x,p.z),y=T.MathUtils.lerp(n.y,groundY,smooth(roadHalfWidth-.8,roadHalfWidth+5,n.dist));
      pos.push(p.x,y+.025,p.z);uv.push(u/8,t);
      const i=pos.length/3-1;
      if(col&&i>=cols)indices.push(i-cols-1,i-1,i,i-cols-1,i,i-cols);
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
  const road=new T.Mesh(g,new T.MeshLambertMaterial({color:0x97968d,map:asphalt,side:T.DoubleSide}));
  road.name='Side road';road.receiveShadow=true;scene.add(road);
  // A loading shed gives the short local road a destination and a turnaround.
  const end=branchPosition(branchLength),next=branchPosition(branchLength+1);
  const yard={...end,h:Math.atan2(next.x-end.x,end.z-next.z)};
  const shed={...localPoint(yard,0,3.4),h:yard.h},pad=footing(shed,7.4,6.6);
  const floor=pad.high+.04,bottom=pad.low-.24;
  scatter('box',0x837b69,shed.x,(floor+bottom)/2,shed.z,7.4,floor-bottom,6.6,-yard.h);
  scatter('box',0xb3a68b,shed.x,floor+1.8,shed.z,7.2,3.6,6.4,-yard.h);
  scatter('houseRoof',0x836655,shed.x,floor+4.3,shed.z,7.9,1.4,7.1,-yard.h);
  const shutter=localPoint(shed,0,-3.24);
  scatter('box',0x627779,shutter.x,floor+1.43,shutter.z,4.3,2.86,.12,-yard.h);
  for(let i=1;i<=8;i++)scatter('box',0x768887,shutter.x,floor+i*.31,shutter.z,4.32,.032,.15,-yard.h);
}
const signMetal=new T.MeshLambertMaterial({color:0x898e89});
function board(d,l,text,bg='#235642',w=5,mount=3){
  const p=at(d,l),c=document.createElement('canvas');c.width=768;c.height=192;const g=c.getContext('2d');
  g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);g.strokeStyle='#fff5cb';g.lineWidth=7;g.strokeRect(7,7,754,178);
  g.fillStyle='#fff';g.font='bold 76px Arial';g.textAlign='center';g.fillText(text,384,124,725);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;
  const base=mount===3?renderedGround(p.x,p.z):p.y;
  const face=new T.Mesh(new T.PlaneGeometry(w,w/4),new T.MeshBasicMaterial({map:tex}));
  const back=new T.Mesh(face.geometry,signMetal);
  back.rotation.y=Math.PI;back.position.z=-.03;face.add(back);
  face.position.set(p.x,base+mount,p.z);face.rotation.y=-p.h;face.translateZ(.10);scene.add(face);
  if(mount===3)scatter('pole',0x797c74,p.x,base+1.48,p.z,.12,3.04,.12);
}
board(36,7,route.name.toLocaleUpperCase('vi'));if(!route.stage)board(route.bridge[0]-17,7.9,route.near);if(!route.stage)board(route.junction-42,8,route.sign>0?'BẾN CHỢ  →':'←  NÔNG TRƯỜNG');
if(arcade){
 if(!route.stage)for(let d=3;d<route.finish;d+=3){
   if(Math.abs(heading(d+10)-heading(d))<.027 && d>65 && d<route.finish-36)continue;
   const paint=Math.floor(d/3)%2?0xf5dfbe:0xd94e30;
   for(const side of [-1,1])if(side!==branchSide||Math.abs(d-route.junction)>8)beside(d,side*5.94,'box',paint,.48,.075,3.04);
 }
 for(const [d,label] of [[36,'XUẤT PHÁT'],[route.finish/2,'NỬA CHẶNG'],[route.finish,'VỀ ĐÍCH']]){
   if(route.stage&&d===route.finish/2)continue;
   for(const side of [-1,1])beside(d,side*(roadHalfWidth+.5),'box',0x8e6649,.5,6,.6);
   beside(d,0,'box',0x252a36,roadHalfWidth*2+1.4,1.15,.65,5.45);
   board(d-.4,0,label,'#bc381c',5.1,6);
   for(let n=0;n<14;n++)for(let row=0;row<2;row++)beside(d+row*.73,(n-6.5)*roadHalfWidth/7,'box',(n+row)%2?0x252630:0xf0efdc,roadHalfWidth/7,.025,.73,.018);
 }
}else{board(route.finish-35,8,'ĐIỂM DỪNG XE','#365c70');board(115,7,'TỐI ĐA 50 km/h','#625b46');}
buildRoadside();
if(!river)buildMountainVerges();
for(const b of batches.values()){
 const m=new T.InstancedMesh(geom[b.kind],foliage[b.kind]||new T.MeshLambertMaterial({color:b.color}),b.matrices.length);
 b.matrices.forEach((mat,i)=>m.setMatrixAt(i,mat));
 m.castShadow=m.receiveShadow=b.kind!=='undergrowth';
 const distant=distantTrees.get(b.kind);
 if(distant){
   // A whole grove switches detail together. Its bounding radius keeps any
   // tree beside the driver in the detailed level, even at the cell edge.
   m.computeBoundingSphere();
   const lod=new T.LOD(),far=new T.InstancedMesh(distant,m.material,m.count);
   lod.position.copy(m.boundingSphere.center);m.position.copy(lod.position).negate();
   far.position.copy(m.position);far.instanceMatrix=m.instanceMatrix;
   far.castShadow=far.receiveShadow=true;
   lod.addLevel(m,0);lod.addLevel(far,85+m.boundingSphere.radius,.08);scene.add(lod);
 }else scene.add(m);
}
const rig=new T.Group();scene.add(rig);
const passHeadlights=featuredPass?new T.SpotLight(0xffe8c1,0,85,.5,.55,2):null;
if(passHeadlights){
  passHeadlights.position.set(0,.76,-2.2);passHeadlights.target.position.set(0,.09,-24);
  rig.add(passHeadlights,passHeadlights.target);
}
const cabin=buildDriverCabin(T,rig,$('map')), outer=new T.Group();rig.add(outer);
const fallback=new T.Mesh(new T.BoxGeometry(1.8,1.1,4),new T.MeshStandardMaterial({color:0xcda05e}));fallback.position.y=.75;outer.add(fallback);
async function loadSedan(){
 let model;
 try{
   const loaded=await TrafficModels.load.loadAsync('traffic/hatchback.glb');
   model=loaded.scene.clone(true);
 }catch{
   const res=await fetch('streetscape/sedan.json.gz');if(!res.ok)throw Error('Sedan asset unavailable');
   const bytes=new Uint8Array(await res.arrayBuffer());
   const json=bytes[0]===31?await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json():JSON.parse(new TextDecoder().decode(bytes));
   model=new T.ObjectLoader().parse(json);
 }
 const bounds=new T.Box3().setFromObject(model),scale=4.18/(bounds.max.z-bounds.min.z);
 model.scale.setScalar(scale);model.rotation.y=Math.PI;model.position.y=-bounds.min.y*scale;model.traverse(n=>{if(n.isMesh)n.castShadow=true;});outer.clear();outer.add(model);
}
if(!arcade)loadSedan().catch(()=>{});
const traffic=[];
for(const [name,first,velocity] of arcade?[]:[['hatchback',140,-8],['kei-van',350,-7],['motor-scooter',570,-5]]){
 TrafficModels.load.loadAsync('traffic/'+name+'.glb').then(({scene:model})=>{
   const bounds=new T.Box3().setFromObject(model);model.scale.setScalar((name==='motor-scooter'?1.85:3.8)/(bounds.max.z-bounds.min.z));
   scene.add(model);traffic.push({model,first,velocity,d:first});
 }).catch(()=>{});
}
const keys=createDriveInput(),gearCaps=[0,25,42,62,80,96];
let state,inside=DriveView.current('cockpit')==='cockpit',sound=driveAudio.enabled,lastFrame=performance.now(),message='',feedbackUntil=0;
function reset(){
 const p=at(0,3.7);
 state={x:p.x,z:p.z,h:p.h,d:0,offset:3.7,v:0,steer:0,gear:0,signal:0,hand:true,belt:false,
   mode:'ready',time:0,score:100,errors:[],seen:new Set(),command:null,nextCommand:0,leftLane:false,wrongGear:0,overSpeed:0,rpmHigh:false,posted:false};
 message='Trước khi nhận lệnh, hãy thắt dây và chuẩn bị số 1.';feedbackUntil=99;
 $('route').disabled=exam;$('start').textContent='Nhận lệnh xuất phát';$('start').disabled=false;$('result').close();$('submit').hidden=true;hud();
}
const changes=[{at:230,up:true},{at:566,up:false},{at:route.junction+150,up:true},{at:route.finish-310,up:false}];
function feedback(line){message=line;feedbackUntil=state.time+5;}
function announce(line){
 if(!sound)return;
 const speech=window.speechSynthesis;
 const voice=speech?.getVoices().find(v=>v.lang.toLowerCase().startsWith('vi'));
 if(!voice){driveAudio.cue(true);return;}
 speech.cancel();
 const cue=new SpeechSynthesisUtterance(line);cue.voice=voice;cue.lang='vi-VN';cue.rate=1.06;speech.speak(cue);
}
function fail(reason){
 state.score=Math.min(79,state.score);state.errors.push(reason);finish(false);
}
function fault(key,line,penalty){
 if(state.seen.has(key))return;
 state.seen.add(key);state.score=Math.max(0,state.score-penalty);state.errors.push(line+' (−'+penalty+')');feedback(line+' · −'+penalty+' điểm');
 if(state.score<80&&exam)finish(false);
}
function finish(passed){
 if(state.mode==='done')return;
 state.mode='done';state.v=0;keys.clear();$('start').disabled=true;$('submit').hidden=true;
 $('resultTitle').textContent=(passed?'Đạt':'Chưa đạt')+' · '+state.score+'/100';
 $('resultText').textContent=route.name+' · '+Math.round(state.d)+' m\n'+(state.errors.join('\n')||'Đã hoàn thành các hiệu lệnh.');
 if(exam&&parent!==window)$('again').hidden=true;
 $('result').showModal();
 if(!state.posted&&exam){state.posted=true;parent.postMessage({type:'drive-exam-result',part:'road',passed,score:state.score},location.origin);}
}
function action(name){
 if(state.mode==='done'||state.mode==='paused')return;
 if(name==='belt')state.belt=!state.belt;
 if(name==='hand'){if(state.v>1){feedback('Dừng xe trước khi kéo phanh tay.');return;}state.hand=!state.hand;}
 if(name==='leftSignal')state.signal=state.signal===-1?0:-1;
 if(name==='rightSignal')state.signal=state.signal===1?0:1;
 if(name==='upGear'||name==='downGear'){
   state.gear=clamp(state.gear+(name==='upGear'?1:-1),0,5);
   if(state.mode==='drive'&&state.v>1&&state.offset<.92)return fail('Chuyển số khi xe lấn sang làn ngược chiều.');
 }
 hud();
}
function start(){
 if(state.mode==='done')return;
 state.mode=state.mode==='drive'?'paused':'drive';keys.clear();$('route').disabled=true;
 $('start').textContent=state.mode==='drive'?'Tạm dừng':'Tiếp tục';
 if(!state.time){announce('Bắt đầu bài sát hạch. Xuất phát.');feedback('Xuất phát. Báo trái, nhả phanh tay và lên số 3 trong 15 m.');feedbackUntil=10;}
}
function submit(){
 if(state.mode!=='drive'||state.d<route.finish||state.v>.01)return;
 if(state.offset<4.7||state.offset>5.3)fault('curb','Dừng xe chưa sát lề phải',5);
 if(state.mode==='done')return;
 if(state.gear!==0)fault('neutral','Chưa về số N sau khi dừng',5);
 if(state.mode==='done')return;
 if(!state.hand)fault('handEnd','Chưa kéo phanh tay sau khi dừng',5);
 if(state.mode!=='done')finish(state.score>=80);
}
function update(dt){
 if(state.mode!=='drive')return;
 const s=state,prev=s.d; s.time+=dt;
 const gas=keys.has('arrowup')||keys.has('w'),brake=keys.has('arrowdown')||keys.has('s')||keys.has(' ');
 const target=Number(keys.has('arrowright')||keys.has('d'))-Number(keys.has('arrowleft')||keys.has('a'));
 s.steer+=(target-s.steer)*(1-Math.exp(-dt*8));
 if(s.hand&&gas&&s.gear>0)fault('handStart','Đạp ga khi còn phanh tay',5);
 if(s.mode!=='drive')return;
 const accel=gas&&s.gear>0&&s.v*3.6<gearCaps[s.gear]?2.7:0;
 s.v=s.hand?0:clamp(s.v+dt*(accel-9.81*roadGrade(s.d,s.h)-.22-s.v*.014-(brake?5.3:0)),0,22);
 const turnLimit=.36/(1+s.v*.13);
 s.h+=s.v/2.65*Math.tan(s.steer*turnLimit)*dt;
 s.x+=Math.sin(s.h)*s.v*dt;s.z-=Math.cos(s.h)*s.v*dt;
 Object.assign(s,roadCoordinates(s.x,s.z,s.d));
 if(s.d<.8&&s.time>30)return fail('Quá 30 giây sau lệnh xuất phát.');
 if(s.d>.8&&!s.seen.has('depart')){s.seen.add('depart');if(!s.belt)fault('belt','Khởi hành khi chưa thắt dây',5);if(s.signal!==-1)fault('left','Thiếu xi nhan trái khi khởi hành',5);}
 if(prev<15&&s.d>=15&&s.gear<3)fault('gear3','Chưa lên số 3 trong 15 m đầu',5);
 if(s.d>25&&s.d<35&&s.signal===-1)s.signal=0;
 if(Math.abs(s.offset)>6.65)return fail('Xe ra ngoài nền đường.');
 if(s.offset<.91&&!s.leftLane){fault('lane'+s.time,'Lấn làn ngược chiều',10);s.leftLane=true;}
 if(s.offset>1.05)s.leftLane=false;
 if(s.mode!=='drive')return;
 for(const car of traffic){
   const span=route.finish+38;
   car.d=((car.first+car.velocity*s.time)%span+span)%span;
   if(Math.abs(s.d-car.d)<3.7&&Math.abs(s.offset+2.8)<1.75)return fail('Xảy ra va chạm với xe ngược chiều.');
 }
 if(s.gear>=3&&s.v*3.6<20&&s.v>.02){s.wrongGear+=dt;if(s.wrongGear>=3){fault('gear'+s.time,'Số cao khi tốc độ dưới 20 km/h',2);s.wrongGear=0;}}else s.wrongGear=0;
 if(s.v*3.6>50.5){s.overSpeed+=dt;if(s.overSpeed>=2){fault('limit','Vượt biển tốc độ 50 km/h',10);}}else s.overSpeed=0;
 if(s.mode!=='drive')return;
 const task=changes[s.nextCommand];
 if(task&&!s.command&&s.d>=task.at){
    s.command={...task,baseGear:s.gear,baseSpeed:s.v*3.6,complete:false};
    announce(task.up?'Tăng một số, tăng tốc độ.':'Giảm một số, giảm tốc độ.');
 }
 const c=s.command;
 if(c){
   const direction=c.up?1:-1;
   if(direction*(s.gear-c.baseGear)>=1&&direction*(s.v*3.6-c.baseSpeed)>=5&&!c.complete){c.complete=true;feedback('Đạt hiệu lệnh đổi số và tốc độ.');}
   if(s.d>=c.at+100){
     if(!c.complete)fault('shift'+s.nextCommand,'Thiếu thao tác '+(c.up?'tăng':'giảm')+' số hoặc tốc độ trong 100 m',5);
     s.command=null;s.nextCommand++;
   }
 }
 if(prev<route.junction-70&&s.d>=route.junction-70)announce(route.sign>0?'Chuẩn bị rẽ phải tại ngã ba.':'Chuẩn bị rẽ trái tại ngã ba.');
 if(prev<route.finish-35&&s.d>=route.finish-35)announce('Kết thúc. Báo phải, tấp sát lề và dừng xe.');
 if(prev<route.junction&&s.d>=route.junction&&s.signal!==route.sign)fault('turn','Thiếu tín hiệu khi chuyển hướng ở ngã ba',10);
 if(s.d>route.junction+45&&s.d<route.junction+60)s.signal=0;
 if(s.d>=route.finish-35&&s.signal===1&&s.d<=route.finish-30)s.seen.add('finishSignal');
 if(s.d>=route.finish-30&&!s.seen.has('finishSignal'))fault('right','Chậm hoặc thiếu xi nhan phải khi có lệnh kết thúc',5);
 if(s.d>route.finish+34)return fail('Đi quá điểm kết thúc khi chưa dừng xe.');
 $('submit').hidden=!(s.d>=route.finish&&s.v<.01&&s.mode==='drive');
}
function instruction(){
 const s=state;if(s.mode==='done')return 'Kết thúc lượt sát hạch';
 if(s.mode==='ready')return 'Chuẩn bị xe tại mép đường bên phải.';
 if(s.d<15)return 'Báo trái, khởi hành từ số 1 và lên số 3 trong 15 m.';
 if(s.d>=route.finish-35)return 'Báo phải, dừng tại lề phải từ mốc '+route.finish+' m, về N rồi kéo phanh tay.';
 if(s.d>route.finish-115)return 'Chuẩn bị kết thúc · còn '+Math.ceil(route.finish-35-s.d)+' m đến lệnh báo phải.';
 if(s.command&&!s.command.complete){const c=s.command,sign=c.up?1:-1;return (c.up?'Tăng':'Giảm')+' đến số '+clamp(c.baseGear+sign,0,5)+', đạt '+Math.max(0,Math.round(c.baseSpeed+sign*5))+' km/h · còn '+Math.ceil(c.at+100-s.d)+' m.';}
 if(Math.abs(s.d-route.junction)<75)return (route.sign>0?'Báo phải, rẽ phải':'Báo trái, rẽ trái')+' theo tuyến tại '+route.turn.toLowerCase()+'.';
 const upcoming=changes[s.nextCommand];if(upcoming&&!s.command&&upcoming.at-s.d<65)return 'Chuẩn bị nhận lệnh '+(upcoming.up?'tăng':'giảm')+' số và tốc độ.';
 return 'Đi đúng làn, theo đường trên bản đồ · giới hạn 50 km/h.';
}
function hud(){
 const s=state;$('command').textContent=instruction();$('stage').textContent=(exam?'THI THỬ':'LUYỆN TẬP')+' · '+(s.mode==='paused'?'ĐANG TẠM DỪNG':'HIỆU LỆNH');
 $('distance').textContent=Math.round(s.d)+' / '+route.finish+' m';$('progress').max=route.finish;$('progress').value=s.d;
 $('speed').textContent=Math.round(s.v*3.6);$('gear').textContent=s.gear||'N';$('signals').textContent=s.signal<0?'◀':s.signal>0?'▶':'';
 $('score').textContent=s.score+' điểm';$('feedback').textContent=s.time<feedbackUntil?message:'';
 for(const [name,on] of [['belt',s.belt],['hand',s.hand],['leftSignal',s.signal<0],['rightSignal',s.signal>0]])document.querySelector('[data-action='+name+']').setAttribute('aria-pressed',on);
}
const map=$('map').getContext('2d');
const xs=points.map(p=>p.x),zs=points.map(p=>p.z);
const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),mapScale=Math.min(153/(maxX-minX||1),101/(maxZ-minZ||1));
function mapPoint(x,z){return [87+(x-(minX+maxX)/2)*mapScale,60+(z-(minZ+maxZ)/2)*mapScale];}
const mapRoute=new Path2D();
for(let i=0;i<points.length;i+=4){
 const [x,y]=mapPoint(points[i].x,points[i].z);
 if(i)mapRoute.lineTo(x,y);else mapRoute.moveTo(x,y);
}
function mapDraw(){
 map.clearRect(0,0,175,121);map.lineWidth=3;map.strokeStyle='#acc58c';map.stroke(mapRoute);
 if(arcade){
   map.fillStyle='#ff7959';
   for(const r of rivals){const [x,y]=mapPoint(r.car.position.x,r.car.position.z);map.beginPath();map.arc(x,y,2.5,0,Math.PI*2);map.fill();}
 }
 const [x,y]=mapPoint(state.x,state.z);map.fillStyle='#ffcc65';map.beginPath();map.arc(x,y,4,0,Math.PI*2);map.fill();
 cabin.refreshMap();
}
const yawQ=new T.Quaternion(),axisY=new T.Vector3(0,1,0),eye=new T.Vector3(),look=new T.Vector3();
let lastHud=0,lastShadow=-1000;
function render(now){
 const elapsed=now-lastFrame,dt=clamp(elapsed/1000,0,.1);lastFrame=now;
 graphics.frame(now,state.mode==='drive');
 if(arcade){const steps=Math.max(1,Math.ceil(dt*90));for(let i=0;i<steps;i++)raceUpdate(dt/steps);}else update(dt);
 const s=state,ground=at(s.d);
 rig.position.set(s.x,ground.y+(arcade?s.lift:0),s.z);
 rig.rotation.set(Math.atan(roadGrade(s.d,s.h))+(arcade?s.jumpPitch:0),-s.h,0,'YXZ');yawQ.copy(rig.quaternion);
 if(!mountainField)hills.position.set(s.x,0,s.z);
 const focus=at(s.d+20);sun.target.position.set(Math.round(focus.x),Math.round(focus.y),Math.round(focus.z));sun.position.copy(sun.target.position);sun.position.x-=38;sun.position.y+=45;sun.position.z+=22;
 if(now-lastShadow>(s.mode==='drive'?graphics.profile.shadowMs:300)){renderer.shadowMap.needsUpdate=true;lastShadow=now;}
 const seated=inside&&(!arcade||s.mode!=='grid');
 outer.visible=!seated;
 const energy=seated&&arcade?DuongVietEnergy.pct(cupEnergy,cupTank.level):undefined;
 cabin.update(seated,s.v*3.6,s.steer,s.d,route,arcade?undefined:(s.gear||'N'),energy);
 if(seated)cabin.driverEye(eye,look,camera.aspect,.02);
 else{eye.set(0,3.4,7.6);look.set(0,.6,-6);}
 eye.applyQuaternion(yawQ).add(rig.position);look.applyQuaternion(yawQ).add(rig.position);
 camera.position.copy(eye);camera.lookAt(look);
 if(arcade)raceCamera(dt,now);
 for(const c of traffic){const p=at(c.d,-2.8);c.model.position.set(p.x,p.y,p.z);c.model.rotation.set(Math.atan(roadGrade(c.d,p.h)),-p.h,0,'YXZ');}
 if(now>=nextWeatherCheck&&!document.hidden){
   nextWeatherCheck=now+2000;
   const east=s.x*Math.cos(weatherBearing)-s.z*Math.sin(weatherBearing);
   const north=-s.x*Math.sin(weatherBearing)-s.z*Math.cos(weatherBearing);
   courseWeather.locate(weatherOrigin[0]+east/(111320*Math.cos(weatherOrigin[1]*Math.PI/180)),weatherOrigin[1]+north/111320);
 }
 courseWeather.render(camera,now,0,passSky?.update);
 if(passHeadlights)passHeadlights.intensity=passSky.lamps.value*2600;
 courseWater.update(now*.001,courseWeather.rainfall);
 if(s.mode==='ready'||s.mode==='grid')cabin.prepare(renderer,scene,camera);
 if(seated)cabin.reflectMounted(renderer,scene,graphics.profile.mirrorMs);
 if(!route.stage)courseWater.reflect(renderer,scene,camera,waterLevel,now,Math.abs(s.d-(bridgeStart+bridgeEnd)*.5)<220||(river&&s.d<bridgeEnd+150),graphics.profile);
 renderer.render(scene,camera);
 driveAudio.update({electric:arcade&&cupBody.spec.electric,boost:arcade&&cupBody.driving&&cupBody.boost,slip:arcade?cupBody.slip:0,speed:Math.abs(s.v)*3.6,throttle:keys.has('arrowup')||keys.has('w'),braking:keys.has('arrowdown')||keys.has('s'),signal:!!s.signal,mode:s.mode==='drive'?'driving':arcade&&['grid','countdown'].includes(s.mode)?'idling':'ready'});
 if(now-lastHud>90){if(arcade)raceHud();else hud();mapDraw();lastHud=now;}requestAnimationFrame(render);
}
$('sound').textContent=sound?'Tắt âm':'Bật âm';
if(!arcade){
$('start').onclick=start;$('again').onclick=reset;$('submit').onclick=submit;
updateDriveViewButton($('camera'),inside);
$('camera').onclick=()=>{
 inside=!inside;DriveView.select(inside?'cockpit':'chase');updateDriveViewButton($('camera'),inside);
};
$('sound').onclick=()=>{sound=driveAudio.toggle();if(!sound)window.speechSynthesis?.cancel();$('sound').textContent=sound?'Tắt âm':'Bật âm';};
const actions={b:'belt',h:'hand',q:'leftSignal',e:'rightSignal',z:'downGear',x:'upGear'};
window.addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,textarea,select,[contenteditable=true],dialog')||$('result').open)return;
 if(k==='c'&&!e.repeat){$('camera').click();e.preventDefault();}
 if(k in actions&&!e.repeat){action(actions[k]);e.preventDefault();}
 if(['arrowleft','arrowright','arrowdown','arrowup',' ','w','a','s','d'].includes(k)){keys.add(k);e.preventDefault();}
 if(k==='p'&&!e.repeat&&state.mode!=='ready')start();
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{keys.clear();if(state.mode==='drive')start();});
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));
reset();requestAnimationFrame(render);
}
