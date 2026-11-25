const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='hon-nua-phu-yen',catalogId='osm-way-50540459';
  const lon=109.3937833,lat=12.8303358,mx=111320*Math.cos(lat*Math.PI/180);
  const local=(longitude,latitude)=>[(longitude-lon)*mx,(lat-latitude)*111320];
  const [east,south]=local(109.3942,12.82962);
  const field='https://daklakvrtour.com/tour/171/index.html',source='https://csdl.vietnamtourism.gov.vn/dest/?item=616';
  // Current landscape (figures 2–3), Thiên Phúc's 2018 topographic survey:
  // https://quyhoach.xaydung.gov.vn/Images/editor/files/Thuy%E1%BA%BFt%20minh%20t%E1%BB%95ng%20h%E1%BB%A3p.pdf
  // The two hills and the lighthouse already exist in the district. Only the
  // strand, exposed rock and a few boats are modelled here. The permanent
  // pier in the planning proposal is absent from the April 2025 photographs.
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=109.3942,12.82962&level=18
  // https://www.openstreetmap.org/way/481006392
  // https://www.openstreetmap.org/way/481006394
  // South from the survey reference, wet strand, vegetation edge (metres).
  // OSM's thin western strip lies inland of the photographed waterline in
  // the middle of the cove. Esri and node 9 resolve its wider sandy centre.
  const shore=[
    [-67,-246,-237],[-43,-265,-250],[-20,-281,-263],[1,-296,-281],[24,-311,-294],
    [44,-322,-302],[66,-335,-313],[87,-345,-316],[107,-350,-318],
    [126,-350,-313],[145,-344,-306],[161,-334,-297],[180,-321,-285],
    [200,-303,-274],[219,-286,-266],[239,-274,-254],[259,-263,-245],[278,-258,-239],[295,-258,-241]
  ];
  const cliff=[[213,-348],[238,-343],[253,-315],[324,-284],[329,-229],[297,-210],[276,-212],[233,-231],[202,-273]];
  const southRock=[[-251,276],[-238,278],[-219,296],[-218,319],[-202,331],[-184,349],
    [-198,381],[-213,404],[-214,433],[-227,452],[-248,463],[-264,452],[-260,438],
    [-249,413],[-245,392],[-237,368],[-243,342],[-253,326],[-263,311],[-265,293]];
  const woodland=[[-66,-464],[80,-413],[175,-346],[202,-273],[204,-218],[136,-193],[76,-184],
    [96,-112],[107,-17],[7,-6],[-24,71],[-59,112],[-40,170],[-54,213],[-90,226],[-131,257],
    [-153,238],[-189,305],[-230,265],[-248,188],[-229,59],[-270,49],[-269,-1],[-248,-42],
    [-207,-107],[-139,-346],[-124,-451]];
  const clamp=(n,lo=0,hi=1)=>Math.min(hi,Math.max(lo,n));
  const soften=n=>{const t=clamp(n);return t*t*(3-2*t);};
  const mix=(a,b,t)=>a+(b-a)*t;
  function strandAt(z,i){
    let j=1;while(j<shore.length-1&&shore[j][0]<z)j++;
    const a=shore[j-1],b=shore[j];return mix(a[i],b[i],clamp((z-a[0])/(b[0]-a[0])));
  }
  function material(T,stone){
    const m=window.createSightStoneMaterial(T);m.vertexColors=true;m.side=T.DoubleSide;
    m.customProgramCacheKey=()=>stone?'hon-nua-granite':'hon-nua-sand';
    m.onBeforeCompile=s=>{
      const varying='varying vec3 nuaPoint; varying vec3 nuaNormal;\n';
      s.vertexShader=varying+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nnuaPoint=position; nuaNormal=normal;');
      s.fragmentShader=varying+s.fragmentShader.replace('#include <map_fragment>',stone?`
        vec3 n=abs(normalize(nuaNormal)); n=n*n*n; n/=max(.001,n.x+n.y+n.z);
        vec3 p=nuaPoint;
        float mineral=texture2D(map,p.zy*.20).r*n.x+texture2D(map,p.xz*.20).r*n.y+texture2D(map,p.xy*.20).r*n.z;
        vec2 axis=vec2(.85*p.x+.48*p.z,p.y-.27*p.x);
        float seam=abs(fract(axis.x*.39+.10*axis.y+.11*sin(p.z*.42))-.5);
        float aa=fwidth(axis.x*.39);
        float patina=texture2D(map,vec2(.053*p.z+.032*p.x,.042*p.y)).r;
        diffuseColor.rgb*=vec3(.78,.71,.64)*(.59+clamp(4.9*mineral+1.7*patina,0.,.87));
        diffuseColor.rgb*=1.-.25*(1.-smoothstep(.009,.034+aa*.34,seam))*(1.-smoothstep(.13,.5,aa));
        `:`
        vec2 p=nuaPoint.xz;
        float coarse=texture2D(map,p*.067+vec2(.39,.16)).r;
        float fine=texture2D(map,p*.76).r;
        float ripple=sin(.94*p.y+.45*p.x+.91*sin(p.x*.53+p.y*.35));
        diffuseColor.rgb*=.905+clamp(coarse*1.0+fine*.55,0.,.255)+.015*ripple;
        `);
    };
    return m;
  }
  function bench(T,k,mat,positions,colors,index,fitters,name){
    const g=new T.BufferGeometry(),p=new T.Float32BufferAttribute(positions,3);
    g.setAttribute('position',p);g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(index);g.computeVertexNormals();
    const mesh=new T.Mesh(g,mat);mesh.name=name;mesh.position.set(east,0,south);mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);
    return (surface,water)=>{
      for(let i=0;i<fitters.length;i++)p.setY(i,fitters[i](surface,water));
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  function beach(T,k){
    const pos=[],col=[],idx=[],fns=[],dry=new T.Color(0xe1c5a2),wet=new T.Color(0x9f8d78),ochre=new T.Color(0xae7e52),verge=new T.Color(0x727555),c=new T.Color();
    const cols=28,rows=122;
    for(let j=0;j<=rows;j++){
      const z=mix(-67,295,j/rows),shoreline=strandAt(z,1),back=strandAt(z,2);
      for(let i=0;i<=cols;i++){
        const u=i/cols,x=mix(shoreline-12,back+4,u),d=x-shoreline;
        const fraction=clamp(d/(back-shoreline)),tidal=soften((d+1.7)/8.5);
        const waver=.35*Math.sin(z*.11)+.28*Math.cos(z*.33);
        pos.push(x,0,z);c.copy(wet).lerp(dry,tidal).lerp(ochre,(1-soften((z+29)/55))*(1-tidal)*.82);
        c.lerp(verge,soften((x-back+4.4+1.9*Math.cos(z*.25))/8.5)*.91);
        c.multiplyScalar(.98+.022*Math.sin(z*.72+x*.48));col.push(c.r,c.g,c.b);
        fns.push((surface,water)=>{
          const bed=surface(x,z);
          // The open-water datum is smooth along the bay. Individual inlet
          // polygons have different water levels near their mapped limits.
          const sea=water(shoreline-40,z);
          const bank=Math.max(sea+1.18,surface(back,z)),endFade=soften(Math.min(z+67,295-z)/7.5);
          const strand=d<0?sea-.15+.19*(d+waver):sea-.15+(bank+.15-sea)*fraction**.9;
          const raised=Math.max(strand,bed+.16);
          const blend=soften((back+4-x)/5)*endFade;
          return mix(Math.min(bed-.14,strand),raised,blend);
        });
        if(j<rows&&i<cols){const a=j*(cols+1)+i,b=a+cols+1;idx.push(a,b,a+1,a+1,b,b+1);}
      }
    }
    return bench(T,k,material(T,false),pos,col,idx,fns,'Bãi cát phía tây Hòn Nưa');
  }
  function shallows(T,k){
    // Node 9 looks through a few metres of shallow water onto pale sand.
    // Use the rendered inlet's triangles. An independent interpolated sheet
    // crosses the varying water level and produces angular gaps on the bay.
    const m=new T.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,
      polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:T.DoubleSide});
    const mesh=new T.Mesh(new T.BufferGeometry(),m);mesh.name='Vùng nước nông ngoài bãi cát';
    mesh.position.set(east,0,south);mesh.renderOrder=2;k.group.add(mesh);
    return scene=>{
      const native=scene.getObjectByName('Mapped water');if(!native?.geometry.index)return;
      mesh.updateWorldMatrix(true,false);native.updateWorldMatrix(true,false);
      const toMesh=mesh.matrixWorld.clone().invert().multiply(native.matrixWorld);
      const p=native.geometry.attributes.position,index=native.geometry.index,v=new T.Vector3();
      const positions=[],colors=[],remap=new Map(),tri=[];
      for(let i=0;i<p.count;i++){
        v.fromBufferAttribute(p,i).applyMatrix4(toMesh);
        if(v.x< -415||v.x> -197||v.z< -92||v.z>330)continue;
        const d=v.x-strandAt(v.z,1);
        if(d< -65||d>28)continue;
        const a=soften((d+36)/20)*soften((2-d)/5)*soften(Math.min(v.z+62,295-v.z)/15);
        remap.set(i,positions.length/3);positions.push(v.x,v.y+.012,v.z);colors.push(.105,.337,.301,.34*a);
      }
      for(let i=0;i<index.count;i+=3){
        const a=remap.get(index.getX(i)),b=remap.get(index.getX(i+1)),c=remap.get(index.getX(i+2));
        if(a!==undefined&&b!==undefined&&c!==undefined)tri.push(a,b,c);
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
      g.setAttribute('color',new T.Float32BufferAttribute(colors,4));g.setIndex(tri);g.computeBoundingSphere();
      mesh.geometry.dispose();mesh.geometry=g;
    };
  }
  function rocks(T,k){
    const pos=[],color=[],idx=[],fit=[],c=new T.Color();let seed=67911;
    const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    // Subdivide each measured outline towards its centre. The skirt remains
    // buried in the district coast. Elevation comes from the ground beneath
    // each vertex, so these local outcrops cannot raise the lighthouse hill.
    function slab(outline,height,tint,twisted=false){
      const cx=outline.reduce((s,v)=>s+v[0],0)/outline.length,cz=outline.reduce((s,v)=>s+v[1],0)/outline.length;
      const edges=outline.map(([x,z])=>({x,z,a:Math.atan2(z-cz,x-cx)})).sort((p,q)=>p.a-q.a);
      const broad=outline===southRock||outline===cliff;
      const sides=broad?6:height>5?3:height>2?2:1,n=edges.length*sides,rows=broad?10:height>5?6:height>2?4:3,o=pos.length/3;
      for(let j=0;j<=rows;j++)for(let i=0;i<=n;i++){
        const r=j/rows,s=i===n?0:i/sides,e=Math.floor(s),f=s-e,a=edges[e],b=edges[(e+1)%edges.length];
        const tipX=cx+(twisted?height*.21:0),tipZ=cz-(twisted?height*.16:0);
        const u=Math.min(r/.985,1),x=mix(mix(a.x,b.x,f),tipX,u),z=mix(mix(a.z,b.z,f),tipZ,u);
        const wave=.63+.17*Math.sin(x*.074+z*.098)+.14*Math.cos(x*.18-z*.086);
        const profile=twisted&&height>5?(1-(1-u)**1.85)**.85:(1-(1-u)**2.85)**.46;
        const h=height*profile*wave-.38*(1-u);
        pos.push(x,0,z);fit.push((surface,water)=>{
          const bed=surface(x,z),level=water(x,z);
          return Math.max(bed,level-.57)+h;
        });
        c.setHex(tint).multiplyScalar(.86+.12*wave+.08*Math.cos(x*.52-z*.21));color.push(c.r,c.g,c.b);
        if(j<rows&&i<n){const a=o+j*(n+1)+i,b=a+n+1;idx.push(a,b,a+1,a+1,b,b+1);}
      }
    }
    function block(x,z,w,d,h,angle,tone){
      const ring=[];
      for(let j=0;j<8;j++){
        const a=j*Math.PI/4+.095*(rnd()-.5),v=.65+.36*rnd(),dx=w*Math.cos(a)*v,dz=d*Math.sin(a)*v;
        ring.push([x+dx*Math.cos(angle)+dz*Math.sin(angle),z-dx*Math.sin(angle)+dz*Math.cos(angle)]);
      }
      slab(ring,h,tone,true);
    }
    // Large bare-rock lobe on the NE coast and the tapering southern tongue.
    slab(cliff,4.1,0x938377);slab(southRock,3.1,0x968a7b);
    // Projecting shoulders and gullies visible from the high camera (node 7).
    for(const [x,z,w,d,h,a] of [[224,-319,10,24,10,-.32],[240,-304,8,21,15,-.23],
      [246,-281,10,20,19,-.27],[252,-273,7,19,23,-.25],[260,-266,10,21,17,-.16],
      [277,-260,10,24,20,-.28],[286,-259,8,23,16,-.26],[296,-247,9,24,12,-.28],
      [307,-247,10,18,14,-.21],[317,-243,9,17,9,-.22]])block(x,z,w,d,h,a,0x84796b);
    // Three parallel, fractured rock ribs are visible at the southern end.
    for(const [x,z,w,d,h,a] of [[-238,331,8,26,4,.16],[-226,346,9,28,6,.12],[-220,374,9,33,6,.17],
      [-231,392,8,32,6,.10],[-243,412,7,24,4,.16],[-246,432,9,18,4,.20],[-255,447,7,12,4,.14]])
      block(x,z,w,d,h,a,0xa49c90);
    // Scattered blocks below the outcrop at the end of the beach, as seen
    // looking back from node 3. Smaller fragments continue into the water.
    for(let i=0;i<88;i++){
      const z=277+54*rnd(),x=strandAt(z,1)-9+24*rnd(),r=.45+2.75*rnd()**1.8;
      block(x,z,r,r*(.76+.63*rnd()),r*(.58+.66*rnd()),rnd()*3, i%4===0?0x8e8574:0xb0a697);
    }
    for(let i=0;i<30;i++){
      const z=-65+83*rnd(),x=strandAt(z,1)-7+14*rnd(),r=1+2.2*rnd();
      block(x,z,r*1.7,r,r*.36,-.63,0xa98460);
    }
    return bench(T,k,material(T,true),pos,color,idx,fit,'Ghềnh đông bắc và doi đá phía nam');
  }
  function vegetation(T,k){
    // Dense, low evergreen scrub shown in node 6 and in OSM w481006393.
    // Keep the lighthouse, its footpath and the beach management clearing.
    const inside=(x,z)=>{
      let hit=false;
      for(let i=0,j=woodland.length-1;i<woodland.length;j=i++){
        const a=woodland[j],b=woodland[i];
        if((a[1]>z)!==(b[1]>z)&&x<a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]))hit=!hit;
      }
      const pathZ=143+14*Math.cos((x+155)*.038);
      return hit&&Math.hypot(x+94,z-180)>20&&(x< -245||x>-89||Math.abs(z-pathZ)>8);
    };
    let seed=792911;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    const pos=[],index=[],levels=[],cols=81,rows=130,step=6.15;
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const x=-279+i*step+(random()-.5)*2.1,z=-472+j*step+(random()-.5)*2.1;
      pos.push(x,0,z);levels.push(1.05+random()*2.70+.86*Math.sin(.16*x+.15*z));
      if(i<cols&&j<rows&&inside(x+step*.5,z+step*.5)){
        const a=j*(cols+1)+i,b=a+cols+1;index.push(a,b,a+1,a+1,b,b+1);
      }
    }
    const geo=new T.BufferGeometry(),attr=new T.Float32BufferAttribute(pos,3);
    geo.setAttribute('position',attr);geo.setIndex(index);geo.computeVertexNormals();
    const grass=new T.TextureLoader().load('streetscape/surfaces/grass-color.webp');grass.colorSpace=T.SRGBColorSpace;
    grass.wrapS=grass.wrapT=T.RepeatWrapping;grass.anisotropy=2;
    const mat=new T.MeshStandardMaterial({roughness:1,map:grass,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec3 nuaBrush;\n'+s.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nnuaBrush=position;');
      s.fragmentShader='varying vec3 nuaBrush;\n'+s.fragmentShader.replace('#include <map_fragment>',`
        vec3 p=nuaBrush;
        vec2 q=p.xz+vec2(1.42*sin(p.x*.13+p.z*.27),.96*sin(p.z*.11-p.x*.28));
        vec3 broad=texture2D(map,q*.023).rgb;
        vec3 fine=texture2D(map,q*.097+vec2(.17,.52)).rgb;
        float patch=smoothstep(.055,.28,broad.g*.64+fine.g*.36);
        float speck=sin(q.x*.71+q.y*.38)*cos(q.x*.39-q.y*.63);
        diffuseColor.rgb*=mix(vec3(.032,.054,.025),vec3(.114,.141,.058),patch)
          *(.80+.55*clamp(fine.g*2.2,0.,1.)+.115*speck);`);
    };
    const shrub=new T.Mesh(geo,mat),pose=new T.Object3D();
    shrub.name='Thảm cây bụi trên hai sườn đảo';shrub.position.set(east,0,south);shrub.receiveShadow=true;k.group.add(shrub);
    const trees=createTreeModels(T),pines=[];
    for(let z=19;z<281;z+=4.9){
      if((z>68&&z<87)||random()<.19)continue;
      pines.push([strandAt(z,2)+3+13*random(),z+2.7*random(),3.2+random()*2.6,6+random()*4,random()*6]);
    }
    const line=new T.InstancedMesh(trees.geometry('pine',true,1),trees.material,pines.length);
    line.position.set(east,0,south);line.receiveShadow=line.castShadow=true;k.group.add(line);
    const activeVertices=new Set(index);
    return (surface,water,exact)=>{
      for(const i of activeVertices)attr.setY(i,exact(pos[3*i],pos[3*i+2])+levels[i]);
      attr.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();
      for(let i=0;i<pines.length;i++){
        const [x,z,r,h,a]=pines[i];pose.position.set(x,surface(x,z),z);pose.rotation.set(0,a,0);
        pose.scale.set(r,h,r);pose.updateMatrix();line.setMatrixAt(i,pose.matrix);
      }
      line.instanceMatrix.needsUpdate=true;line.computeBoundingSphere();
    };
  }
  function boats(T,k){
    const data=[],scratch=new T.Group();
    // The blue-hulled passenger boat in node 3 has a light canopy. The SUPs
    // in node 9 have a single low deck. These mobile objects illustrate the
    // photographs; their precise moorings vary.
    function hull(x,z,yaw,board){
      const g=new T.Group(),length=board?3.24:7.7,width=board?.81:2.18;
      const p=[],indices=[],c=[],t=new T.Color(),rows=14;
      const cross=[[-1,.57],[-.94,.22],[-.64,0],[0,-.08],[.64,0],[.94,.22],[1,.57],[.82,.71],[-.82,.71]];
      for(let j=0;j<=rows;j++){
        const v=j/rows*2-1,span=(1-Math.abs(v)**(board?2.9:2.5))**.55+.023;
        for(let i=0;i<cross.length;i++){
          const [a,b]=cross[i];p.push(a*width*.5*span,(b-.29)*(board?.18:.95)+.13*Math.abs(v)**3,v*length*.5);
          t.setHex(board?(i>5?board:0xf3efda):i>5?0xd8d9cd:i===0||i===5?0x478eab:0x366c87);c.push(t.r,t.g,t.b);
          if(j<rows){const n=cross.length,A=j*n+i,B=j*n+(i+1)%n;indices.push(A,B,A+n,B,B+n,A+n);}
        }
      }
      const geo=new T.BufferGeometry();geo.setIndex(indices);geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('color',new T.Float32BufferAttribute(c,3));geo.computeVertexNormals();
      const deck=new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.8}));g.add(deck);
      if(!board){
        const steel=new T.MeshStandardMaterial({color:0x738486,roughness:.8});
        for(const a of [-.80,.80])for(const b of [-1.65,1.50]){
          const post=new T.Mesh(new T.CylinderGeometry(.032,.032,1.66,7),steel);post.position.set(a,1.03,b);g.add(post);
        }
        const roof=new T.Mesh(new T.BoxGeometry(1.90,.105,3.76),new T.MeshStandardMaterial({color:0xdce4db,roughness:.83}));roof.position.set(0,1.85,-.07);g.add(roof);
      }
      g.position.set(x,0,z);g.rotation.y=yaw;scratch.add(g);data.push([g,x,z,board]);
    }
    hull(-296,222,1.72,0);hull(-330.7,172,.58,0xe6ab3b);hull(-325.5,181,1.67,0x639daf);
    scratch.position.set(east,0,south);k.group.add(scratch);
    return (surface,water)=>{for(const [g,x,z,board] of data)g.position.y=Math.max(water(x,z)+.065,surface(x,z)+(board?.03:.14));};
  }
  function build(T,k){
    const fit=[beach(T,k),rocks(T,k),boats(T,k),vegetation(T,k)],tintShallows=shallows(T,k);let pending=false;
    function settle(surface,water){
      const cache=new Map(),cell=(x,z)=>{const key=x+','+z;
        if(!cache.has(key))cache.set(key,surface(x*3,z*3));return cache.get(key);};
      const sample=(x,z)=>{
        const u=x/3,v=z/3,i=Math.floor(u),j=Math.floor(v);
        return mix(mix(cell(i,j),cell(i+1,j),u-i),mix(cell(i,j+1),cell(i+1,j+1),u-i),v-j);
      };
      for(const f of fit)f(sample,water,surface);
    }
    k.group.userData.fitGround=ground=>{
      const survey=(x,z)=>ground(east+x,south+z),fallback=survey(-395,165);
      settle(survey,()=>fallback);pending=true;
    };
    k.group.children[0].onBeforeRender=(renderer,scene)=>{
      if(!pending||typeof gfx==='undefined'||typeof roads==='undefined')return;
      const a=roads.point(109.3942,12.82962),datum=k.group.position.y,off=gfx.waterAt(a.x-405,a.z+160);
      if(!Number.isFinite(off?.level))return;
      const levels=new Map(),water=(x,z)=>{
        const u=Math.round(x/6)*6,v=Math.round(z/6)*6,key=u+','+v;
        if(!levels.has(key))levels.set(key,(gfx.waterAt(a.x+u,a.z+v)?.level??off.level)-datum);
        return levels.get(key);
      };
      settle((x,z)=>gfx.ground(a.x+x,a.z+z)-datum,water);tintShallows(scene);pending=false;
    };
  }
  function view(name,camera,eyeY,point,h,fov,description){
    const [x,z]=local(...camera),[tx,tz]=local(...point),dx=x-tx,dz=z-tz,dy=eyeY-h;
    return {name,offset:[tx,tz],height:h/.46,viewBase:'monument',viewFov:fov,viewRadius:Math.hypot(dx,dy,dz),
      viewAngle:Math.atan2(dx,dz),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),description};
  }
  const stop=window.VietnamTourism.byId.get(catalogId);
  (window.VietnamSights??=[]).push({...stop,id,catalogId,lon,lat,yaw:0,name:'Hòn Nưa',kind:'Đảo',locality:'Vũng Rô',
    start:[109.4291998,12.8817480],visitOnArrival:true,mappedEntrance:true,width:700,depth:970,gardenRadius:0,
    reserve:()=>false,solids:[],foundationAt:[east-339,south+113],source,photo:'https://daklakvrtour.com/hon-nua.html',
    map:'https://www.openstreetmap.org/way/50540459',
    description:'Hòn Nưa án ngữ cửa vịnh Vũng Rô. Bãi cát thoải nằm ở phía tây, giữa dải đá triều phía bắc và doi đá dài phía nam. Mặt bãi và các mỏm đá được dựng theo bản đồ, ảnh vệ tinh và ảnh 360°. Mực nước, các khe nứt nhỏ và vị trí thuyền là phần mô phỏng.',
    arrivalNote:'Xe dừng trên Quốc lộ 29 ở Bãi Hương. Từ đường xuống mép nước khoảng 50 m. Ca nô chở khách từ vịnh Vũng Rô tới bãi phía tây Hòn Nưa, cách khoảng 7,3 km đường chim bay.',
    views:[
      view('Bãi chính và hai đỉnh đảo nhìn từ phía tây',[109.390661,12.827451],93.1,[109.39278,12.82839],16,78,
        'Từ trên mặt nước phía tây, bãi cát trắng uốn một vòng dưới chân hai ngọn đồi. Ngọn hải đăng đứng trên sườn đồi phía nam.'),
      {...view('Đi dọc mép bãi chính',[109.391120,12.828126],3.1,[109.391811,12.826833],3.2,63,
        'Nhìn về đầu nam của bãi, dải cát ướt thu hẹp dần giữa sườn cây và làn nước. Ca nô thường đón trả khách ngay ở mép cát.'),title:'Bãi chính Hòn Nưa'},
      view('Nhìn lại bãi từ mỏm đá phía nam',[109.391803,12.826790],12.4,[109.39146,12.82835],4.7,59,
        'Góc nhìn theo ảnh chụp trên các khối đá lớn ở đầu nam bãi. Từ đây có thể nhìn lại đoạn bờ cát cong và nơi thuyền cập đảo.'),
      {...view('Ghềnh đông bắc nhìn từ trên đảo',[109.393588,12.828689],253.2,[109.39662,12.8320521],15,20,
        'Từ trên cao nhìn về góc đông bắc, sườn cây chuyển thành dải đá trần có những gờ nhọn nhô ra biển. Đường viền ghềnh dựa trên vùng đá lộ thiên trong bản đồ.'),title:'Ghềnh đông bắc Hòn Nưa'}
    ],scan:field+'#node7',build});
})();

export default window.VietnamSights;
