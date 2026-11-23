'use strict';
(()=>{
  const id='nghinh',catalogId='osm-node-11055944805',lon=109.307256,lat=13.1163162;
  const source='https://vietnamtourism.gov.vn/en/printer/19357?type=1',tour='https://daklakvrtour.com/tour/40/index.html';
  // The OSM square w1272649341 is the landward chord and the curved seafront,
  // not the footprint of the two towers. +z points towards Nguyễn Hữu Thọ.
  // Centreline, staged apron and column spacing: straight-down photograph,
  // Trung Thi, 19 Jan 2024. Anchor the rail and the landward chord before
  // measuring the columns to avoid displacing the upper ends of the shafts.
  // https://dantri.com.vn/du-lich/can-canh-thap-nghinh-phong-o-phu-yen-dat-2-giai-thuong-quoc-te-20240119155536423.htm
  // https://www.huniarchitectes.com/portfolio/nghinh-phong-square/
  // https://eawer.daklak.gov.vn/thap-nghinh-phong-phu-yen-1820.html
  // Field tour 40: survey nodes 21 (seaward drone), 30 (landward drone), 22
  // (steps), 27 (flank), 31/32 (carved walls). The July 2025 nodes all reuse
  // an unrelated GPS position; bearings here come from the square, not GPS.
  const yaw=-.93296841,axis=2.25,clear=1.62,r=1.04,top=1.48;
  const shore=[[-68.43,44.89],[-67.56,27.74],[-62.34,11.73],[-52.27,-1.31],[-40.23,-10.82],
    [-23.4,-21.46],[-9.86,-25.28],[2.88,-26.36],[17.52,-24.05],[30.72,-18.67],
    [42.43,-11.88],[51.7,-4],[60.2,7.99],[65.48,19.26],[69.61,31.54],[72.93,44.89]];
  // Each transverse row runs from the wind passage outwards. Successive rows
  // are staggered. The highest shaft sits near the sea, with low tails towards
  // the city. The fifty places on each side follow the aerial lattice; the
  // intermediate rises interpolate the photographic profile.
  const rows=[[5.3,2.6,.46],[10.40,5.4,2.5,.45],[20.2,10.2,5.7,2.7,.45],
    [23.8,15.3,8.2,5.1,2.5,.43],[35,17.4,10.6,6.2,2.9,.40],
    [14.3,10.2,6.8,4.1,.54],[10.4,7.7,4.8,2.8,.43],[8.1,5.6,3.35,.67],
    [6.45,4.25,1.68],[5.15,3.24,.91],[3.85,1.88],[2.68,.79],[1.43],[.48]];
  function cut(poly,signed){
    const result=[];
    for(let i=0;i<poly.length;i++){
      const a=poly[i],b=poly[(i+1)%poly.length],da=signed(...a),db=signed(...b);
      if(da>=0)result.push(a);
      if((da>=0)!==(db>=0)){const f=da/(da-db);result.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]);}
    }
    return result;
  }
  function pavingMaterial(T,pattern,night){
    const mat=new T.MeshStandardMaterial({color:pattern?0xa6a4a0:0xaaa8a3,roughness:.9});
    mat.customProgramCacheKey=()=>pattern?'nghinh-upper-plaza':'nghinh-lower-plaza';
    mat.onBeforeCompile=s=>{
      s.uniforms.nghinhNight=night;
      s.vertexShader='varying vec2 tilePosNP;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntilePosNP=position.xz;');
      s.fragmentShader='varying vec2 tilePosNP;uniform float nghinhNight;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float insetLightNP=0.;
        {vec2 p=tilePosNP;vec2 size=vec2(1.73205,3.)*1.04;
        vec2 a=mod(p,size)-size*.5,b=mod(p+size*.5,size)-size*.5;
        vec2 cell=dot(a,a)<dot(b,b)?a:b;
        float d=max(abs(cell.x),abs(cell.y)*.866025+abs(cell.x)*.5);
        vec2 centre=floor((p-cell)*9.+.5);
        float h=fract(sin(dot(centre,vec2(17.29,37.73)))*9603.14);
        float aa=max(.008,fwidth(d));float joint=smoothstep(.866*1.04-.02-aa,.866*1.04-.02+aa,d);
        ${pattern?`float dark=1.-smoothstep(.43-aa,.43+aa,d);
          float sector=step(cell.x+cell.y*.57,0.)*.045+step(cell.y,0.)*.048;
          diffuseColor.rgb*=mix(.85+.13*h-sector,.39+.20*h,dark);
          float lamp=step(.91,h)*(1.-smoothstep(.101-aa,.101+aa,length(cell)));
          diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.34,.53,.54),lamp*.78);
          insetLightNP=lamp;`:
          'diffuseColor.rgb*=.80+.16*h;'}
        diffuseColor.rgb*=1.-.13*joint;}`).replace('#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(3.8,2.25,1.53)*insetLightNP*nghinhNight;');
    };
    return mat;
  }
  function floorPlate(T,k,ring,y,mat){
    const outline=new T.Shape(ring.map(([x,z])=>new T.Vector2(x,-z)));
    const geo=new T.ShapeGeometry(outline);geo.rotateX(-Math.PI/2);geo.translate(0,y,0);
    const mesh=new T.Mesh(geo,mat);mesh.receiveShadow=true;mesh.userData.shoreCover=true;k.group.add(mesh);
  }
  function segment(k,ink,x,z,ex,ez,high,h,d){
    const dx=ex-x,dz=ez-z;k.box(ink,(x+ex)/2,high,(z+ez)/2,d,h,Math.hypot(dx,dz)+.023,Math.atan2(dx,dz));
  }
  function coast(T,k,night){
    const arc=new T.CatmullRomCurve3(shore.map(([x,z])=>new T.Vector3(x,0,z))).getPoints(112).map(p=>[p.x,p.z]);
    const lower=pavingMaterial(T,false,night),upper=pavingMaterial(T,true,night);
    floorPlate(T,k,arc,.055,lower);
    // Seven shallow landward steps follow the two sloping sides of the inset
    // hexagonal terrace. Each tread extends from the curved seaward rail.
    for(let i=0;i<7;i++){
      const front=19.62-i*.54,level=.22+i*.21;
      const edge=cut(cut(arc,(x,z)=>front-(x-axis)*.445-z),(x,z)=>front+(x-axis)*.445-z);
      for(let j=0;j<edge.length;j++){
        const a=edge[j],b=edge[(j+1)%edge.length];
        if(Math.abs(front-Math.abs((a[0]+b[0])/2-axis)*.445-(a[1]+b[1])/2)<.18){
          segment(k,0x8f8f89,...a,...b,level-.105,.21,.11);
        }
      }
      floorPlate(T,k,edge,level, i===6?upper:lower);
    }
    // The waterfront edge overhangs a recessed gallery. Thin balusters run
    // between square posts. The secondary lower lip appears in the seaward UAV.
    for(let i=1;i<arc.length;i++){
      const [x,z]=arc[i-1],[ex,ez]=arc[i];
      const y=.055+Math.min(1,Math.max(0,(19.62-Math.abs((x+ex)/2-axis)*.445-(z+ez)/2)/3.24))*(top-.055);
      const ux=x-axis,uz=z-44.89,len=Math.hypot(ux,uz),nx=ux/len,nz=uz/len;
      segment(k,0xc2b8a5,x,z,ex,ez,y-.25,.50,.55);
      segment(k,0x645d52,x-nx*1.45,z-nz*1.45,ex-nx*1.45,ez-nz*1.45,y-1.78,2.85,.60);
      segment(k,0xafa18e,x+nx*.60,z+nz*.60,ex+nx*.60,ez+nz*.60,y-2.86,.26,2.5);
      segment(k,0x776c5c,x,z,ex,ez,y+1.08,.055,.066);
      segment(k,0x796e5d,x,z,ex,ez,y+.16,.045,.052);
      if(i%4===1){k.box(0x766c60,x,y+.52,z,.28,1.04,.32);k.box(0xa49b8c,x,y-1.67,z,.34,2.98,.42);}
      for(let j=0;j<5;j++)k.box(0x8b8273,x+(ex-x)*j/5,y+.605,z+(ez-z)*j/5,.032,.89,.034);
    }
  }
  function shafts(T,k,night){
    const p=[],idx=[],col=[],norm=[],wash=[];
    function face(vertices,ink,lit){
      const start=p.length/3,n=new T.Triangle(...vertices.slice(0,3).map(v=>new T.Vector3(...v))).getNormal(new T.Vector3());
      for(const v of vertices){p.push(...v);col.push(ink.r,ink.g,ink.b);norm.push(n.x,n.y,n.z);wash.push(...lit);}
      for(let j=1;j<vertices.length-1;j++)idx.push(start,start+j,start+j+1);
    }
    for(const side of [-1,1])for(const [i,heights] of rows.entries())for(const [j,rise] of heights.entries()){
      const dz=-15.85+i*1.5*r,h=rise*(side<0?1:30/35),bottom=top-.012;
      const setback=(j+(i%2?.5:0))*Math.sqrt(3)*r;
      let hex=Array.from({length:6},(_,n)=>[setback+(r-.006)*Math.sin(n*Math.PI/3),dz+(r-.006)*Math.cos(n*Math.PI/3)]);
      hex=cut(hex,(u)=>u);
      const clean=hex.filter((a,n)=>Math.hypot(a[0]-hex[(n+1)%hex.length][0],a[1]-hex[(n+1)%hex.length][1])>.001);
      const world=clean.map(([u,v])=>[axis+side*(clear/2+u),v]);
      if(side<0)world.reverse();
      const swatch=[0xaaa9a2,0xa5a49e,0xafada6,0xa3a39e,0xb1afa7][(i*3+j)%5],tint=new T.Color(swatch);
      const lit=[(i*3+j)%7,h];
      for(let n=0;n<world.length;n++){
        const [x,z]=world[n],[ex,ez]=world[(n+1)%world.length];
        if(Math.hypot(ex-x,ez-z)<.001)continue;
        face([[x,bottom,z],[ex,bottom,ez],[ex,bottom+h,ez],[x,bottom+h,z]],tint,lit);
      }
      face(world.map(([x,z])=>[x,bottom+h,z]),new T.Color(swatch).multiplyScalar(.91),lit);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(norm,3));
    g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setAttribute('facadeLamp',new T.Float32BufferAttribute(wash,2));g.setIndex(idx);
    const m=new T.MeshStandardMaterial({vertexColors:true,roughness:.76,side:T.DoubleSide});
    m.onBeforeCompile=s=>{
      s.uniforms.nghinhNight=night;
      s.vertexShader='attribute vec2 facadeLamp;varying vec2 washNP;varying vec3 shaftPoint;varying vec3 shaftNormal;\n'+s.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nshaftPoint=position;shaftNormal=normal;washNP=facadeLamp;');
      s.fragmentShader='uniform float nghinhNight;varying vec2 washNP;varying vec3 shaftPoint;varying vec3 shaftNormal;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        {vec2 xy=vec2(dot(shaftPoint.xz,vec2(.76,.65)),shaftPoint.y-1.48);
        float ring=xy.y/.64,aa=max(.004,fwidth(ring));float seam=min(fract(ring),1.-fract(ring));
        float joint=(1.-smoothstep(.014-aa*.3,.014+aa*.3,seam))*(1.-smoothstep(.06,.26,aa));
        float grain=fract(sin(dot(floor(xy*162.),vec2(62.41,73.41)))*15474.7);
        float slab=fract(sin(dot(vec2(floor(ring),floor(xy.x*.9)),vec2(32.64,57.82)))*7353.6);
        diffuseColor.rgb*=(.94+.08*grain)*(1.-(1.-abs(shaftNormal.y))*(joint*.42+.07*slab));}`)
        .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
        {float band=washNP.x;
        vec3 lamp=band<2.?vec3(.15,.56,1.):band<4.?vec3(1.,.24,.55):band<5.?vec3(.24,.91,.76):vec3(1.,.73,.21);
        float h=max(0.,shaftPoint.y-1.48),below=clamp(washNP.y*.53,0.,9.);
        float flood=exp(-abs(h-below)/max(1.,below*.56));
        totalEmissiveRadiance+=lamp*nghinhNight*(.10+.92*flood)*(1.-abs(shaftNormal.y)*.80);}`);
    };
    const mesh=new T.Mesh(g,m);mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);
  }
  // The passage elevations are shallow, cut into the ashlar. Model a small
  // interpreted section on each facing wall after tour 40's photographed
  // folds, wave scrolls, trees and raised arms; the frieze is not a facsimile.
  function carvedWall(T,k,side){
    const tint=0xb3b1a5,shadow=0x99998e,edge=axis+side*(clear*.5-.030);
    function stroke(points,radius=.027,depth=.055){
      const curve=new T.CatmullRomCurve3(points.map(([z,y])=>new T.Vector3(edge-side*depth,y+top,z)));
      const geo=new T.TubeGeometry(curve,Math.max(8,points.length*3),radius,5,false);k.stamp(geo,tint,0,0,0);geo.dispose();
    }
    function bas(points,colour=tint){
      const s=new T.Shape(points.map(([z,y])=>new T.Vector2(side*z,y)));
      const geo=new T.ExtrudeGeometry(s,{depth:.075,bevelEnabled:true,bevelThickness:.018,bevelSize:.024,bevelSegments:1});
      k.stamp(geo,colour,edge-side*.012,top,0,1,1,1,-side*Math.PI/2);geo.dispose();
    }
    const z0=-13.8,z1=-2.0;
    k.box(shadow,edge+side*.040,top+1.75,(z0+z1)/2,.096,3.50,z1-z0);
    for(let row=0;row<5;row++)for(let j=0;j<8;j++){
      const dz=(z1-z0)/8,z=z0+(j+.5)*dz,y=top+.33+row*.65;
      k.box([0xa6a59b,0xaaa89f,0xa2a198][(row+j)%3],edge-side*.010,y,z,.016,.638,dz-.015);
    }
    for(let i=0;i<7;i++){
      const z=z0+.89+i*1.64;
      k.box(0xb4b2a7,edge-side*.013,top+3.38,z,.054,.28,1.58);
      for(let j=-1;j<=1;j++)k.box(0x9f9d93,edge-side*.052,top+3.39,z+j*.38,.030,.079,.24);
    }
    if(side>0){
      bas([[-10.1,.18],[-9.72,1.15],[-9.24,2.31],[-9.43,2.80],[-9.27,3.05],[-9.0,3.13],[-8.8,2.97],
        [-8.82,2.73],[-8.98,2.54],[-8.70,2.36],[-8.51,1.82],[-8.07,1.44],[-7.76,.43],[-8.47,.19],[-9.07,.42]]);
      stroke([[-9.43,2.35],[-9.21,2.04],[-8.89,1.72],[-8.38,1.59]],.052);
      for(let j=0;j<3;j++)stroke([[-9.28+j*.13,1.93],[-9.38+j*.22,1.34],[-9.56+j*.39,.52]]);
      for(let j=0;j<5;j++){
        const z=-13.34+j*2.25;
        stroke([[z,.40],[z+.50,.48],[z+.82,.74],[z+.99,.68],[z+1.0,.50],[z+.89,.55],[z+.86,.64]]);
        stroke([[z,.33],[z+.45,.20],[z+1.06,.27],[z+1.68,.46]]);
      }
    }else{
      for(const [x,h] of [[-12.9,2.92],[-8.2,2.98],[-3.1,2.63]]){
        stroke([[x,.35],[x+.10,1.27],[x-.06,1.95],[x+.08,h]],.065);
        for(const sign of [-1,1]){
          stroke([[x+.06,1.39],[x+sign*.37,1.98],[x+sign*.76,2.47],[x+sign*.89,h-.10]],.038);
          bas([[x+sign*.37,1.98],[x+sign*.75,2.11],[x+sign*.94,2.31],[x+sign*.63,2.27]]);
          bas([[x+sign*.68,2.41],[x+sign*.72,2.72],[x+sign*.64,2.91],[x+sign*.55,2.65]]);
        }
      }
      for(const [z,lean] of [[-10.84,.22],[-6.54,-.16]]){
        bas([[z-.32,.22],[z-.20,.58],[z-.17,.97],[z-.18,1.44],[z-.12,1.56],[z+.10,1.72],[z+.29,1.63],
          [z+.37,1.33],[z+.30,1.08],[z+.42,.60],[z+.52,.19],[z+.16,.24],[z-.10,.20]]);
        const head=z+.06+lean;
        bas([[head-.17,2.00],[head-.17,2.11],[head-.07,2.17],[head+.08,2.15],[head+.16,2.06],
          [head+.16,1.95],[head+.13,1.83],[head+.05,1.78],[head-.05,1.79],[head-.11,1.68],[head-.20,1.77],[head-.13,1.85]]);
        bas([[head-.19,2.08],[head-.14,2.24],[head+.03,2.34],[head+.12,2.28],[head+.23,2.13],[head+.16,2.08],
          [head+.03,2.15],[head-.11,2.13]],0xb4b0a2);
        stroke([[z+.13,1.56],[z+.45,1.85],[z+.51,1.95],[z+.73,2.39],[z+.82,2.58]],.069);
        bas([[z+.75,2.53],[z+.78,2.66],[z+.83,2.75],[z+.88,2.88],[z+.91,2.87],[z+.89,2.73],
          [z+.96,2.84],[z+.99,2.82],[z+.94,2.69],[z+1.01,2.75],[z+1.02,2.72],[z+.97,2.58],[z+.86,2.51]]);
        stroke([[z,1.51],[z-.38,1.79],[z-.48,2.17]],.059);
        stroke([[z-.13,1.50],[z+.05,1.28],[z+.20,1.22],[z+.31,1.30]],.025,.112);
        for(let j=0;j<3;j++)stroke([[z+.01+j*.05,1.04],[z+j*.075,.64],[z-.02+j*.12,.27]],.019,.111);
      }
    }
  }
  function build(T,k){
    k.palette({stone:[0xb3b1a5,0x99998e,0xa6a59b,0xaaa89f,0xa2a198,0xb4b0a2]});
    const night={value:0};coast(T,k,night);shafts(T,k,night);carvedWall(T,k,-1);carvedWall(T,k,1);
    // The field photos record floodlights at the column feet and circular
    // lights among the hexagons. Follow the game's daylight at this location.
    let sky;
    const daylight=(renderer,scene)=>{
      sky??=scene.children.find(m=>m.isHemisphereLight);
      if(sky)night.value=1-T.MathUtils.smoothstep(sky.intensity,.34,.79);
    };
    for(const mesh of k.group.children)mesh.onBeforeRender=daylight;
    let parts;
    k.group.userData.fitGround=ground=>{
      if(!parts)parts=k.group.children.map(m=>({m,y:m.position.y}));
      // Seat the square at its street entrance. The game's shore DEM falls
      // away under the gallery, as does the sand in the seaward photograph.
      const h=Math.max(ground(axis,44.65),ground(axis,-10),ground(-22,22),ground(25,22))+.12;
      for(const {m,y} of parts)m.position.y=y+h;
    };
  }
  const view=(name,u,v,eyeU,eyeV,focus,up,fov,description)=>{
    const c=Math.cos(yaw),s=Math.sin(yaw),d=Math.hypot(eyeU-u,eyeV-v);
    return {name,offset:[u*c+v*s,-u*s+v*c],height:focus/.46,viewRadius:Math.hypot(d,up),
      viewAngle:yaw+Math.atan2(eyeU-u,eyeV-v),viewElevation:Math.atan2(up,d),viewFov:fov,viewBase:'monument',description};
  };
  (window.VietnamSights??=[]).push({id,catalogId,name:'Tháp Nghinh Phong',city:'Tuy Hòa',locality:'Quảng trường Nghinh Phong',
    lon,lat,yaw,width:24,depth:26,gardenRadius:52,boundary:shore,reserve:(x,z,p=0)=>z<=44.89+p&&Math.hypot(x-axis,z-44.89)<71.6+p,
    solids:[[-3.10,-9.0,4.45,6.8],[7.56,-9.0,4.45,6.8]],start:[109.3065001,13.1165356],mappedEntrance:true,visitOnArrival:true,
    source,map:'https://www.openstreetmap.org/node/11055944805',photo:tour,scan:tour,
    arrivalNote:'Từ đường Độc Lập phía biển, dừng cạnh lối bãi xe hình cung ở đầu tây bắc quảng trường. Đi bộ khoảng 90 m đến khe giữa hai tháp.',
    description:'Nhìn từ đường Nguyễn Hữu Thọ ra biển, dãy bên trái cao 35 m, dãy bên phải cao 30 m. Mỗi bên có 50 cột lấy cảm hứng từ Gành Đá Đĩa và truyền thuyết trăm trứng. Khe hẹp thông ra biển, hai mặt tường khắc phù điêu. Mặt bằng mô phỏng theo ảnh từ trên cao; cao độ các cột thấp và nét chạm được giản lược.',
    views:[view('Hai ngọn tháp từ quảng trường',axis,-8,17.8,44,16.8,4.4,54,'Từ phía thành phố, hai đỉnh tách nhau bởi một dải trời hẹp. Dãy bậc thấp kéo dài về phía sân.'),
      view('Phù điêu trong khe đón gió',axis-.74,-10.25,axis+.53,-8.66,4.06,0,71,'Từ trong khe, nhìn ra biển dọc các mạch đá. Hai bên là nét chạm chìm và nổi mô phỏng từ ảnh chụp tại chỗ.'),
      view('Mặt bên và các hàng lục giác',axis,-7.6,-43,16,16.7,8.1,59,'Từ phía tây bắc, có thể nhìn dọc những hàng cột tăng dần về hai đỉnh.'),
      view('Quảng trường từ phía biển',axis,-1.4,axis+14,-83,9.9,33.6,58,'Từ ngoài bãi nhìn vào, lan can chạy dọc mép cong, bên dưới là hành lang. Tháp nằm trên trục nhìn vào đường Nguyễn Hữu Thọ.')],build});
})();
