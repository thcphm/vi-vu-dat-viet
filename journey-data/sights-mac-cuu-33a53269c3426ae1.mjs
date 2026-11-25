const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Site review 2026-11-22. The hill monument n2326969109 is a precinct label;
  // it falls 22 m south-east of the shrine, beside its forecourt. The ancestor's
  // burial enclosure is separately identified as tomb 1 on the Bình San register.
  // It has no independently surveyed coordinates in the sources reviewed here.
  // Source: https://vietnamtourism.vn/index.php/tourism/items/2756/2
  // National Museum of History: https://baotanglichsu.vn/VI/Articles/3098/13667/ve-mot-dong-ho-khai-khan-djat-ha-tien.html
  // Local inventory: https://apc.angiang.gov.vn/m/187/1505/CHUONG-TRINH-THAM-QUAN-HA-TIEN.html
  // Register, architectural history, Võ Ca and Bái Đình photos:
  // https://trunghochatienxua.wordpress.com/2019/03/01/lang-ong-mac-cuu-ha-tien-qua-cac-giai-doan-thoi-gian-tran-van-manh/
  // Present portal, paired guardians, fence, green ceramic and pantile details:
  // https://congdankhuyenhoc.vn/toan-canh-di-tich-nui-binh-san-lang-mo-mac-cuu-va-khu-mo-co-o-ha-tien-179231109132604492.htm
  // Building footprints: Google Open Buildings v3, CC BY 4.0,
  // https://sites.research.google/gr/open-buildings/ . The 122 m² sanctuary and
  // 85 m² Võ Ca roofs establish the procession axis. The street gate sits at
  // the intersection of this axis with the footway beside OSM w1118496307.
  const sites=window.VietnamSights??=[],A=window.CentralArch,catalogId='osm-node-2326969109';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Missing Hà Tiên shrine pin');
  const id='den-tho-ho-mac-ha-tien',yaw=1.467,c=Math.cos(yaw),s=Math.sin(yaw);
  const bone=0xc5bd9f,lime=0xc7ad76,white=0xd4cbb1,dado=0x8b8778,wood=0x5d4132;
  const clay=0xa5583f,jade=0x426d5b,ink=0x53554b,brick=0xa76751,red=0x975447;
  const source='https://vietnamtourism.vn/index.php/tourism/items/2756/2';
  const photo='https://commons.wikimedia.org/wiki/File:L%C4%83ng_T%E1%BB%95ng_Tr%E1%BA%A5n_H%C3%A0_Ti%C3%AAn_-_M%E1%BA%A1c_C%E1%BB%ADu_(52352815996).jpg';
  function tube(T,k,color,pts,r){
    const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p))),Math.max(5,pts.length*2),r,6,false);
    k.stamp(g,color,0,0,0);g.dispose();
  }
  function inscription(T,k,title,x,y,z,w,h,vertical=false){
    const cv=document.createElement('canvas');cv.width=vertical?96:540;cv.height=vertical?600:140;
    const g=cv.getContext('2d'),letters=Array.from(title);
    g.fillStyle=vertical?'#a66c5d':'#8b6759';g.fillRect(0,0,cv.width,cv.height);
    g.fillStyle='#3d342e';g.textAlign='center';g.textBaseline='middle';
    if(vertical){g.font='bold 71px serif';letters.forEach((ch,i)=>g.fillText(ch,48,(i+.5)*600/letters.length,84));}
    else{g.font='bold 90px serif';g.fillText(title,270,73,490);}
    const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;
    const text=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.96}));
    text.position.set(x,y,z);k.group.add(text);
  }
  function scrolls(T,k,x,y,z,w){
    const r=Math.min(.067,w*.020);
    for(const side of [-1,1]){
      const q=(u,v,d=0)=>[x+side*u*w,y+v*w,z+d*w];
      tube(T,k,jade,[q(.04,.14),q(.105,.21),q(.19,.18),q(.24,.07),q(.33,.065),q(.38,.17),q(.43,.205),q(.48,.17)],r);
      tube(T,k,bone,[q(.19,.17),q(.21,.26),q(.255,.28)],r*.66);
      tube(T,k,jade,[q(.08,.19),q(.104,.27),q(.16,.28)],r*.66);
      tube(T,k,jade,[q(.18,-.061),q(.211,.026),q(.273,.073)],r*1.12);
      tube(T,k,jade,[q(.38,-.025),q(.35,.037),q(.315,.065)],r);
      const outline=[[.018,.105],[.044,.150],[.025,.194],[.070,.188],[.073,.221],
        [.102,.216],[.158,.180],[.139,.143],[.104,.149],[.072,.118],[.028,.116]];
      k.outline(outline.map(([u,v])=>[side*u*w,v*w]),ink,x,y,z-.040,.09);
      for(let j=0;j<4;j++)tube(T,k,paleGreen,[q(.245+j*.030,.074),q(.256+j*.030,.118+j*.009)],r*.52);
    }
    k.stamp(k.round,bone,x,y+.055*w,z,.031*w,.162*w,.031*w);
    const disk=new T.SphereGeometry(1,10,7);k.stamp(disk,paleGreen,x,y+.153*w,z,.054*w,.060*w,.05*w);disk.dispose();
  }
  const paleGreen=0x96a18b;
  function roof(T,k,y,z,w,d,rise,hip=.72,ornament=false){
    const hx=w/2,hz=d/2,rr=Math.max(.28,hx-hip);
    const corners=[[-hx,y,-hz],[hx,y,-hz],[hx,y,hz],[-hx,y,hz]].map(([x,yy,zz])=>[x,yy,z+zz]);
    const ridgeL=[-rr,y+rise,z],ridgeR=[rr,y+rise,z],tri=[];
    const face=(a,b,c)=>tri.push(...a,...b,...c);
    face(corners[3],corners[2],ridgeL);face(corners[2],ridgeR,ridgeL);
    face(corners[1],corners[0],ridgeR);face(corners[0],ridgeL,ridgeR);
    face(corners[0],corners[3],ridgeL);face(corners[2],corners[1],ridgeR);
    // The exposed cut edge and the wooden underside are separate surfaces.
    for(let i=0;i<4;i++){
      const a=corners[i],b=corners[(i+1)%4],low=v=>[v[0],y-.14,v[2]];
      face(a,low(b),b);face(a,low(a),low(b));
    }
    const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(tri,3));geom.computeVertexNormals();
    k.stamp(geom,clay,0,0,0);geom.dispose();
    k.box(wood,0,y-.14,z,w-.07,.15,d-.06);
    // Alternating half-round pan and cover tiles have the distinctive glazed
    // green round faces in the photographs. Ribs terminate at the hip line.
    const cap=new T.CylinderGeometry(1,1,1,8),pitch=.24,count=Math.floor(w/pitch);
    for(const end of [-1,1])for(let i=0;i<count;i++){
      const x=(i+.5-count/2)*pitch,t=Math.min(1,(hx-Math.abs(x))/Math.max(.001,hip));
      const dz=hz*t,dy=rise*t,len=Math.hypot(dy,dz);
      k.stamp(cap,clay,x,y+dy/2+.035,z+end*(hz-dz/2),.082,len,.082,0,-end*Math.atan2(dz,dy));
      k.stamp(cap,jade,x,y+.007,z+end*(hz+.032),.102,.077,.102,0,Math.PI/2);
    }
    cap.dispose();
    for(const side of [-1,1])for(const end of [-1,1]){
      A.strut(T,k,bone,side*hx,y+.07,z+end*hz,side*rr,y+rise+.09,z,.077);
    }
    k.box(bone,0,y+rise+.15,z,rr*2+.19,.27,.23);
    if(ornament){
      const mid=Math.min(2.5,rr*1.2);scrolls(T,k,0,y+rise+.27,z,mid);
      for(const sign of [-1,1])tube(T,k,bone,[[sign*(rr-.26),y+rise+.17,z],
        [sign*(rr+.06),y+rise+.24,z],[sign*(rr+.28),y+rise+.55,z]],.092);
    }
  }
  function tracery(T,k,x,y,z){
    const ring=new T.TorusGeometry(.208,.053,6,14);k.stamp(ring,jade,x,y,z);ring.dispose();
    const leaf=new T.SphereGeometry(1,8,6);
    for(let j=0;j<4;j++){
      const a=j*Math.PI/2;k.stamp(leaf,jade,x+.145*Math.cos(a),y+.145*Math.sin(a),z,.104,.066,.057,0,0,a);
    }
    leaf.dispose();
  }
  function piercedWall(T,k,x,z,w,base=0){
    const n=Math.max(2,Math.round(w/.78)),cell=w/n;
    k.box(bone,x,base+.28,z,w,.56,.25);k.box(bone,x,base+1.05,z,w,.14,.28);
    for(let i=0;i<=n;i++)k.box(white,x+(i/n-.5)*w,base+.77,z,.14,.48,.24);
    for(let j=0;j<n;j++)tracery(T,k,x+((j+.5)/n-.5)*w,base+.77,z+.015);
  }
  function portal(T,k,central=false){
    if(central){
      // The single arched opening in the outer wall bears the Mạc Công Miếu
      // inscription. It is a different gate from the three inner passages.
      const w=4.52,r=.91,shape=new T.Shape(),spring=1.79;
      shape.moveTo(-w/2,0);shape.lineTo(-r,0);shape.lineTo(-r,spring);
      shape.absarc(0,spring,r,Math.PI,0,true);shape.lineTo(r,0);shape.lineTo(w/2,0);
      shape.lineTo(w/2,2.98);shape.lineTo(1.05,2.98);shape.lineTo(1.03,3.50);
      shape.bezierCurveTo(.60,3.50,.70,3.85,0,3.85);shape.bezierCurveTo(-.67,3.85,-.68,3.52,-1.04,3.50);
      shape.lineTo(-1.05,2.98);shape.lineTo(-w/2,2.98);shape.closePath();k.profile(shape,bone,0,0,-.29,.58);
      for(const e of [-1,1]){
        k.box(dado,e*1.65,2.97,0,1.23,.18,.69);
        k.box(bone,e*1.65,3.13,0,.85,.15,.55);
        k.box(ink,e*1.65,3.26,0,.60,.13,.39);
        const lion=new T.SphereGeometry(1,9,6);
        k.stamp(lion,ink,e*1.64,3.40,0,.261,.140,.139);
        k.stamp(lion,ink,e*1.50,3.54,.024,.140,.149,.122);
        k.stamp(lion,ink,e*1.41,3.51,.040,.086,.070,.103);
        k.stamp(lion,ink,e*1.78,3.48,-.025,.104,.101,.13);lion.dispose();
        inscription(T,k,e<0?'七葉藩翰國寵榮':'一門忠義家聲重',e*1.70,1.47,.305,.32,1.82,true);
      }
      inscription(T,k,'廟公鄚',0,3.13,.30,1.42,.47);scrolls(T,k,0,3.77,0,1.78);
      return;
    }
    // Rectangular passage with clipped top corners, unlike the outer arch.
    const p=new T.Shape();p.moveTo(-1.13,0);p.lineTo(-.64,0);p.lineTo(-.64,1.82);
    p.lineTo(-.41,2.05);p.lineTo(.41,2.05);p.lineTo(.64,1.82);p.lineTo(.64,0);p.lineTo(1.13,0);
    p.lineTo(1.13,3.08);p.lineTo(.82,3.08);p.quadraticCurveTo(.46,2.91,0,3.20);
    p.quadraticCurveTo(-.47,2.92,-.82,3.06);p.lineTo(-1.13,3.08);p.closePath();
    k.profile(p,bone,0,0,-.26,.52);k.box(red,0,2.44,.274,1.20,.25,.057);
    for(const e of [-1,1]){k.box(red,e*.89,1.16,.274,.20,1.78,.058);k.box(ink,e*.94,3.10,0,.36,.14,.44);}
  }
  function guardian(T,k,x,z){
    k.box(dado,x,.16,z,.61,.32,.77);
    const g=new T.SphereGeometry(1,11,8);
    const make=(cx,cy,cz,w,h,d,col=white)=>k.stamp(g,col,x+cx,cy,z+cz,w,h,d);
    make(0,.59,-.06,.226,.27,.30);make(0,.78,.083,.22,.31,.24);
    make(0,1.00,.14,.26,.26,.23);make(0,.92,.309,.19,.070,.10,dado);
    make(0,.897,.30,.173,.045,.107);make(0,.965,.331,.190,.058,.130);
    make(0,1.005,.409,.085,.053,.067,dado);make(0,.785,.09,.235,.058,.214,red);
    for(const e of [-1,1]){
      make(e*.155,.54,.18,.087,.19,.09);make(e*.155,.395,.26,.096,.064,.14);
      make(e*.17,.53,-.16,.127,.156,.13);make(e*.21,.405,-.17,.090,.071,.14);
      for(const j of [-1,0,1])make(e*.155+j*.050,.383,.375,.027,.040,.044);
      make(e*.205,1.167,.126,.081,.094,.07);
      make(e*.105,1.063,.340,.082,.055,.042);make(e*.110,1.053,.368,.040,.029,.022,dado);
      make(e*.108,1.089,.350,.087,.033,.039);
      make(e*.124,.922,.374,.026,.053,.020);
    }
    const curl=new T.TorusGeometry(.047,.021,6,9);
    for(let j=0;j<15;j++){
      const a=j*Math.PI*2/15,cx=Math.sin(a)*.235,cy=1+Math.cos(a)*.21;
      make(cx,cy,.14,.071,.071,.078);k.stamp(curl,bone,x+cx,cy,z+.209,1,1,1);
    }
    curl.dispose();g.dispose();
  }
  function mainGate(T,k,at){
    const xSpan=10.8,z=17.3;
    for(const e of [-1,1]){
      at(e*xSpan*.72,z,0,2.26,.52,.16,()=>portal(T,k));
      for(const [mid,span] of [[3.11,2.20],[5.30,2.20],[9.96,2.07]])
        at(e*mid,z,0,span,.29,.15,()=>piercedWall(T,k,0,0,span));
      for(const edge of [2.14,6.46,9.03])
        at(e*edge,z,0,.32,.35,.16,()=>k.box(bone,0,.77,0,.32,1.55,.35));
    }
    at(0,z,0,4.15,2.20,.21,()=>{
      for(const e of [-1,1]){
        k.box(lime,e*1.52,1.37,0,.36,2.72,1.17);
        k.box(red,e*1.52,1.28,.61,.20,1.80,.055);
        guardian(T,k,e*1.70,1.2);
      }
      k.box(wood,0,2.71,0,3.39,.19,1.23);
      roof(T,k,2.80,0,4.08,2.16,.74,.19,true);
      inscription(T,k,'祠義忠',0,2.42,.627,1.48,.36);
    });
  }
  function voCa(T,k){
    k.box(brick,0,.105,0,9.30,.21,8.17);
    for(const x of [-3.78,-1.48,1.48,3.78])for(const z of [-3.38,3.38]){
      // The centre aisle stays clear on both the city and shrine sides.
      k.box(lime,x,1.49,z,.38,2.77,.37);k.box(red,x,1.42,z+.20,.26,2.03,.04);
    }
    // VNA field photograph 215012, looking outward from the sanctuary.
    k.place(0,-3.38,Math.PI,()=>{
      inscription(T,k,'里閭仍舊處仁風',-1.48,1.56,.20,.26,1.79,true);
      inscription(T,k,'廟貌重新追念德',1.48,1.56,.20,.26,1.79,true);
    });
    for(const x of [-3.78,3.78]){
      k.box(lime,x,1.50,0,.37,2.80,.36);
      k.place(x,0,Math.PI/2,()=>piercedWall(T,k,0,0,6.36,.21));
    }
    for(const e of [-1,1]){
      k.box(wood,0,2.79,e*3.36,8.16,.25,.23);
      for(const x of [-2.83,2.83])piercedWall(T,k,x,e*3.37,1.68,.20);
    }
    roof(T,k,2.92,0,9.89,8.58,1.27,.93,true);
    k.box(wood,0,4.06,0,5.06,.63,4.04);
    for(const side of [-1,1])for(let j=-7;j<=7;j++)k.box(jade,j*.32,4.21,side*2.04,.085,.34,.07);
    roof(T,k,4.48,0,6.18,5.02,1.07,.39,true);
    k.box(bone,0,5.73,0,4.80,.29,.25);
    for(const e of [-1,1]){
      k.box(bone,e*2.49,5.75,0,.24,.60,.28);
      scrolls(T,k,e*1.61,5.89,0,1.25);
    }
  }
  function hall(T,k,w,d,central=false){
    k.box(dado,0,.18,0,w-.55,.36,d-.61);
    k.box(lime,0,1.60,-d*.416,w-.74,2.61,.33);
    for(const e of [-1,1])k.box(lime,e*(w*.5-.44),1.60,0,.33,2.61,d-.81);
    const bays=central?3:4;
    for(let i=0;i<=bays;i++){
      const x=(i/bays-.5)*(w-.96);k.box(wood,x,1.64,d*.39,.25,2.70,.22);
      if(i<bays)k.box(wood,x+(w-.96)/(2*bays),1.49,d*.277,(w-.96)/bays-.07,2.25,.14);
    }
    roof(T,k,3.03,0,w,d,central?1.63:1.15,.19,central);
    if(central)inscription(T,k,'國柱鎮開',0,2.75,d*.392,2.35,.38);
  }
  function build(T,k){
    const f=createTempleFoundations(T,k),pads=[];
    k.palette({tile:clay,stone:[dado,bone],plaster:[lime,white,red],brick,timber:wood});
    function at(x,z,angle,w,d,level,draw){
      const a=f.building(x,z,angle,w,d,draw),ground=a.elevation;
      a.elevation=g=>ground(g)+level;
      pads.push({x,z,w,d,c:Math.cos(angle),s:Math.sin(angle),anchor:a});return a;
    }
    const front=at(0,41.11,0,4.52,.60,.06,()=>portal(T,k,true));
    f.stairs(front,0,41.40,0,42.75,2.27,.08,3);
    for(const e of [-1,1]){
      for(let i=0;i<3;i++)at(e*(3.87+3.22*i),41.11,0,3.22,.38,.06,()=>{
        k.box(dado,0,.69,0,3.23,1.38,.37);k.box(bone,0,1.61,0,3.23,.14,.40);
        for(let j=0;j<5;j++)k.box(bone,(j-2)*.65,1.47,0,.30,.22,.38);
      });
    }
    at(0,25.50,0,9.60,8.36,.10,()=>voCa(T,k));
    mainGate(T,k,at);
    // The covered Bái Đình lies between the three doorways and the sanctuary.
    // Its open axis is visible behind the incense burner in VNA image 215011.
    at(0,10.13,0,6.36,6.01,.22,()=>{
      k.box(brick,0,.14,0,6.4,.28,6.04);
      for(const x of [-2.84,2.84])for(const z of [-2.51,2.51])k.box(wood,x,1.48,z,.24,2.66,.24);
      roof(T,k,2.83,0,6.70,6.28,1.02,.36);
      const vessel=new T.LatheGeometry([[.22,0],[.28,.09],[.17,.17],[.21,.33],[.38,.42],[.45,.58],[.43,.68],[.32,.61]]
        .map(([r,h])=>new T.Vector2(r,h)),24);
      k.stamp(vessel,0x655b46,0,.29,2.19);vessel.dispose();
    });
    at(0,0,0,9.98,11.66,.38,()=>hall(T,k,10.27,11.88,true));
    at(9.61,-3.10,Math.PI/2,13.81,7.13,.32,()=>hall(T,k,13.84,7.10));
    at(-8.25,10.34,-Math.PI/2,8.64,6.61,.24,()=>hall(T,k,8.64,6.61));
    at(7.02,10.45,Math.PI/2,7.68,5.39,.24,()=>hall(T,k,7.68,5.39));
    // Topiary in red ceramic pots, behind the open aisle of the Võ Ca.
    const plants=window.createTreeModels(T);
    for(const [x,z] of [[-3.92,31.5],[4.04,31.2],[-4.92,18.6],[5.10,18.4]]){
      const crowns=[];
      f.fixture(g=>g(x,z)+.20,()=>{
        const pot=new T.CylinderGeometry(.56,.40,.53,10);k.stamp(pot,red,x,.27,z);pot.dispose();
        k.stamp(k.round,wood,x,1.20,z,.068,1.72,.068);
        for(const [j,ox] of [[0,-.06],[1,.13],[2,-.08]]){
          const size=.69-j*.16,y=.79+j*.47;
          const shrub=new T.Mesh(plants.geometry('tea',true,j),plants.material);
          shrub.position.set(x+ox,y,z);shrub.scale.set(size*1.69,.45-j*.04,size*1.56);
          shrub.rotation.y=x+j*.69;shrub.castShadow=shrub.receiveShadow=true;k.group.add(shrub);
          crowns.push([shrub,y]);
        }
      },h=>{for(const [shrub,y] of crowns)shrub.position.y=y+h;});
    }
    // The 2023 field photographs show Norfolk-type conifers either side of the
    // road arch, smaller palms along the approach and trees behind the shrine.
    for(const [x,z,h,width,kind] of [[-7.6,38.7,10.2,5.3,'pine'],[7.8,38.8,10.9,5.8,'pine'],
      [-5.6,35.2,5.6,4.25,'palm'],[5.7,35.3,6.1,4.30,'palm'],
      [-8.8,28.4,5.9,4.8,'palm'],[9.1,29.0,6.4,4.4,'palm'],
      [-12.7,-1.9,7.9,6.4,'banyan'],[14.8,-3.1,8.1,6.6,'banyan']]){
      let tree;
      f.fixture(g=>g(x,z)+.17,()=>{
        A.trees(T,k,[{x,z,h,width,kind}]);tree=k.group.children.at(-1);
      },level=>{tree.position.y=level;});
    }
    // The slow diagonal DEM grade continues up from the street. A fine grid
    // of brick paving meets each threshold and the public sidewalk. It does
    // not put the entire compound onto a retaining wall at the road edge.
    const nx=22,nz=40,points=new Float32Array((nx+1)*(nz+1)*3),uv=[],indices=[];
    for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){
      const n=j*(nx+1)+i,x=(i/nx-.5)*23.22,z=-4.2+j/nz*45.54;
      points[n*3]=x;points[n*3+2]=z;uv.push(x,z);
      if(i<nx&&j<nz)indices.push(n,n+nx+1,n+1,n+1,n+nx+1,n+nx+2);
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(points,3));
    geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);
    const mat=new T.MeshStandardMaterial({color:brick,roughness:.96});
    mat.onBeforeCompile=q=>{
      q.vertexShader='varying vec2 courtTile;\n'+q.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncourtTile=uv;');
      q.fragmentShader='varying vec2 courtTile;\n'+q.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=courtTile/.36,e=min(fract(p),1.-fract(p));
        vec2 g=smoothstep(vec2(.012)-fwidth(p)*.45,vec2(.012)+fwidth(p)*.45,e);
        float variation=fract(sin(dot(floor(p),vec2(37.71,14.43)))*2819.);
        diffuseColor.rgb*=mix(.55,.91+.15*variation,g.x*g.y);`);
    };
    const surface=new T.Mesh(geo,mat);surface.receiveShadow=true;k.group.add(surface);
    const fit=k.group.userData.fitGround;
    k.group.userData.fitGround=g=>{
      fit(g);
      for(let i=0;i<points.length;i+=3){
        const x=points[i],z=points[i+2],ground=g(x,z);
        let y=ground+.12;
        for(const p of pads){
          const dx=x-p.x,dz=z-p.z;
          const distance=Math.max(0,Math.abs(dx*p.c-dz*p.s)-p.w*.5,Math.abs(dx*p.s+dz*p.c)-p.d*.5);
          if(distance<1.80)y=Math.max(y,ground+.12+(p.anchor.height-ground-.10)*(1-distance/1.80));
        }
        points[i+1]=y;
      }
      geo.attributes.position.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();
    };
  }
  function view(name,x,z,height,viewRadius,angle,viewElevation){
    return {name,offset:[c*x+s*z,-s*x+c*z],height,viewRadius,viewAngle:yaw+angle,viewElevation};
  }
  sites.push({...pin,catalogId,id,name:'Đền thờ họ Mạc (Trung Nghĩa Từ)',source,photo,
    lon:104.483112,lat:10.385444,yaw,width:32,depth:55,build,
    description:'Dưới chân núi Bình San, cổng Mạc Công Miếu nhìn ra đường Mạc Cửu và ao sen. Qua nhà Võ Ca có hai tầng mái ngói âm dương là ba lối vào khu chánh điện. Lối bộ bên phải đền dẫn lên khu mộ họ Mạc trên núi.',
    start:[104.4835338,10.3854001],visitOnArrival:true,mappedEntrance:true,approachMeters:undefined,
    arrivalNote:'Xe dừng trên đường Mạc Cửu, bên ao sen. Từ đây du khách đi bộ qua cổng Mạc Công Miếu vào sân đền.',
    boundary:[[-10.3,-6.4],[13.8,-10.7],[14.0,20.5],[12.0,41.6],[-12.0,41.6],[-14.5,14.5],[-11.0,4.2]],
    gardenRadius:19,reserve:(x,z,r)=>Math.abs(x)<13.7+r&&z>-9-r&&z<41.7+r,
    solids:[[0,0,4.60,4.88],[9.61,-3.1,3.15,6.5],[-8.25,10.34,2.9,3.95],[7.02,10.45,2.31,3.46]],
    views:[view('Cổng Mạc Công Miếu nhìn từ đường Mạc Cửu',0,40.9,4.55,9.72,.08,.11),
      view('Nhà Võ Ca và lối giữa sân gạch',0,25.50,7.15,12.0,.04,.075),
      {...view('Cổng Trung Nghĩa Từ và đôi sư tử đá',0,17.30,4.83,4.40,-.18,.030),viewFov:75}]});
})();

export default window.VietnamSights;
