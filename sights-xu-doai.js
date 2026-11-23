'use strict';
(() => {
  const all=window.VietnamSights??=[],A=window.CentralArch;
  const atlas=window.VietnamTourism.byId||new Map(window.VietnamTourism.entries.map(p=>[p.id,p]));
  const sai='https://dsvh.gov.vn/di-tich-lich-su-va-kien-truc-nghe-thuat-chua-thay-va-khu-vuc-nui-da-sai-son-hoang-xa-phuong-cach-2991';
  const tay='https://dsvh.gov.vn/di-tich-kien-truc-nghe-thuat-chua-tay-phuong-1257';
  const cao='https://hanoigo.hanoi.gov.vn/place/chua-cao-inh-son-tu-ogs0e';
  const boi='https://sovhtt.hanoi.gov.vn/di-tich-chua-mot-mai-noi-luu-dau-chan-nguoi/';
  const oldTile=0x796155,redTile=0x9d583e,stone=0x949088,wood=0x604737,plaster=0xc1b9a2;
  const grey=0x817e70,clay=0xad694e,pale=0xd3c9ad,iron=0x56544a;
  const parking=[105.6435889,21.0197721]; // w550537571, the road beside the visitor car park (w1518755302).
  const parkNote='Xe dừng trên đường cạnh bãi đỗ xe Chùa Thầy. Từ đây, đi bộ men hồ Long Trì đến sân trước chùa.';
  function site(catalogId,id,name,source,description,origin,extent,views,draw,settings={}){
    const pin=atlas.get(catalogId);
    if(!pin)throw Error('Thiếu địa điểm Xứ Đoài '+catalogId);
    const [east,south,yaw]=origin,c=Math.cos(yaw),s=Math.sin(yaw);
    const originalPhoto=window.VietnamSightDetails?.[catalogId]?.photo;
    all.push({...pin,id,catalogId,name,source,photo:originalPhoto||source,description,
      lon:pin.lon+east/(111320*Math.cos(pin.lat*Math.PI/180)),lat:pin.lat-south/110900,
      yaw,width:extent[0],depth:extent[1],start:parking,approachMeters:undefined,
      arrivalNote:parkNote,visitOnArrival:true,mappedEntrance:true,solids:[],...settings,
      views:views.map(([name,x,z,height,viewRadius,angle,viewElevation])=>({
        name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius,viewAngle:yaw+angle,viewElevation})),
      build(T,k){k.palette({timber:wood,tile:[oldTile,redTile],stone:[stone,grey],brick:clay,plaster:[plaster,pale]});draw(T,k);}
    });
  }
  function cylinder(k,color,x,y,z,r,h){k.stamp(k.round,color,x,y,z,r,h,r);}
  function tree(T,k,f,x,z,h,spread,seed){
    let parts=[];
    f.fixture(ground=>ground(x,z),()=>{
      parts=k.place(x,z,0,()=>window.createTreeModels(T).grove(k.group,[[0,0,0,spread,h,seed]])).map(mesh=>[mesh,mesh.position.y]);
    },elevation=>{for(const [mesh,y] of parts)mesh.position.y=y+elevation;});
  }
  function post(k,x,z,bottom,h,r=.14){
    cylinder(k,stone,x,bottom+.09,z,r*1.48,.18);
    cylinder(k,wood,x,bottom+h/2,z,r,h);
  }
  function hip(T,k,x,y,z,w,d,h,tile=oldTile,ornament=false){
    A.curvedRoof(T,k,x,y,z,w,d,h,tile,grey,grey,.30,{dragons:ornament,goldColor:stone});
  }
  function timberDoor(k,x,y,z,w,h){
    k.box(0x372f28,x,y+h*.5,z,w,h,.10);
    for(let i=0;i<4;i++){
      const px=x+(i-1.5)*w*.24;
      k.box(wood,px,y+h*.31,z+.058,w*.226,h*.60,.07);
      for(const j of [-1,0,1])k.box(wood,px+j*w*.06,y+h*.75,z+.062,.043,h*.28,.07);
    }
    k.box(wood,x,y+h*.92,z+.07,w,.12,.11);
  }
  function hall(T,k,w,d,base,eave,rise,bays,opts={}){
    const front=d*.32,back=-d*.43,wall=opts.wall??plaster,open=opts.open??false;
    k.box(stone,0,base/2,0,w,base,d);
    if(opts.passage){
      const wing=(w-.23-opts.passage)/2;
      for(const s of [-1,1])k.box(wall,s*(wing+opts.passage)/2,base+eave/2,back,wing,eave,.29);
      k.box(wood,0,base+eave-.14,back,opts.passage,.27,.29);
    }else k.box(wall,0,base+eave/2,back,w-.23,eave,.29);
    for(const s of [-1,1])k.box(wall,s*(w/2-.22),base+eave/2,(front+back)/2,.32,eave,front-back);
    const pitch=(w-.83)/bays;
    for(let i=0;i<=bays;i++){
      const x=(i-bays*.5)*pitch;
      if(i<bays&&(!open||i===0||i===bays-1))timberDoor(k,x+pitch/2,base,front,pitch*.94,eave*.85);
      post(k,x,d*.448,base,eave,.137);
      k.box(wood,x,base+eave*.90,d*.388,.18,.21,d*.21);
    }
    for(const z of [back,d*.448])k.box(wood,0,base+eave-.06,z,w,.19,.19);
    if(opts.gable)A.gabledRoof(T,k,0,base+eave,0,w,d,rise,opts.tile??oldTile,grey,{alongX:true,overhang:.35});
    else hip(T,k,0,base+eave,0,w+.9,d+1.04,rise,opts.tile??oldTile,opts.ornament);
  }
  function coveredBridge(T,k,f,x,z,angle,length){
    // A separate level, open-span timber deck has no foundation skirt in the
    // water. The two sets of columns straddle the 2.7 m passage.
    const frame=f.fixture(ground=>(ground(x-length*.48,z)+ground(x+length*.48,z))*.50+.11,()=>{
      k.place(x,z,angle,()=>{
        const deck=.43,rise=2.28,bays=5;
        k.box(wood,0,deck-.15,0,length,.29,3.49);
        for(let i=0;i<Math.ceil(length/.38);i++){
          const count=Math.ceil(length/.38);
          k.box(0x847359,(i+.5)*length/count-length/2,deck+.025,0,length/count-.013,.08,3.30);
        }
        for(let i=0;i<=bays;i++){
          const px=(i/bays-.5)*(length-.42);
          for(const s of [-1,1]){
            if(i%2===0||i===bays)k.box(stone,px,-2.85,s*1.32,.48,6.57,.47);
            post(k,px,s*1.35,deck,rise,.12);
            if(i<bays){
              const mid=px+(length-.42)/(bays*2);
              k.box(wood,mid,deck+.75,s*1.34,(length-.42)/bays,.12,.12);
              k.box(wood,mid,deck+.34,s*1.35,(length-.42)/bays,.11,.33);
              for(let j=1;j<=4;j++)k.box(wood,px+j*(length-.42)/(bays*5),deck+.53,s*1.35,.055,.40,.064);
            }
          }
          k.box(wood,px,deck+rise-.18,0,.16,.20,3.65);
          A.strut(T,k,wood,px,deck+rise-.17,-1.7,px,deck+rise+.69,0,.074);
          A.strut(T,k,wood,px,deck+rise+.69,0,px,deck+rise-.17,1.7,.074);
        }
        hip(T,k,0,deck+rise,0,length+1.12,4.03,1.28,oldTile);
        for(const end of [-1,1])k.box(stone,end*(length/2+.32),-1.74,0,.83,4.31,3.73);
      });
    });
    for(const end of [-1,1]){
      const c=Math.cos(angle)*end,s=-Math.sin(angle)*end;
      f.stairs(frame,x+c*(length*.5+.72),z+s*(length*.5+.72),
        x+c*(length*.5+3.10),z+s*(length*.5+3.10),3.26,.48,6);
    }
  }
  // In the temple axes, +Z looks SSE across Long Trì. The three original
  // roof polygons are w1159531917, w1159531918 and w1159531916. The public
  // heritage inventory gives the dimensions below inside their overhangs.
  function thay(T,k){
    const f=createTempleFoundations(T,k);
    const front=f.building(0,15.15,0,20.0,7.3,()=>hall(T,k,20,6.65,1.01,2.39,2.76,5,{ornament:true,tile:redTile,passage:3.67}));
    f.stairs(front,0,18.65,0,22.32,10.4,1.01,6);
    f.building(0,8.17,0,4.5,8.10,()=>{
      k.box(stone,0,.57,0,4.62,1.14,8.14);
      for(const s of [-1,1])for(const z of [-2.06,2.06])post(k,s*1.78,z,1.15,2.26,.15);
      for(const side of [-1,1]){
        k.box(wood,side*1.78,1.87,0,.13,.14,6.88);
        for(let j=-10;j<=10;j++)k.box(wood,side*1.78,1.59,j*.322,.08,.51,.08);
      }
      A.gabledRoof(T,k,0,3.46,0,4.5,8.30,1.16,oldTile,grey);
    });
    f.building(0,-.3,0,20.0,9.5,()=>hall(T,k,20,9.5,1.50,2.6,2.82,5,{tile:redTile,open:true}));
    f.building(0,-15.6,0,17.1,12.1,()=>hall(T,k,16.12,11.7,2.24,2.64,2.85,3,{tile:redTile,ornament:true,wall:wood}));
    for(const side of [-1,1]){
      const x=side*14.45;
      f.building(x,-4.5,0,3.05,29.6,()=>{
        k.box(stone,0,.28,0,3.08,.56,29.68);
        k.box(plaster,side*1.39,1.55,0,.23,2.56,29.5);
        for(let j=0;j<=13;j++)post(k,-side*1.18,-14.35+j*28.7/13,.57,2.16,.106);
        A.gabledRoof(T,k,0,2.88,0,3.16,29.7,1.03,oldTile,grey);
      });
      f.building(x,-22.10,0,4.66,6.30,()=>{
        for(const sign of [-1,1])for(const z of [-2.36,2.36])post(k,sign*1.68,z,.2,4.89,.19);
        k.box(wood,0,3.04,0,4.29,.26,5.55);
        hip(T,k,0,3.18,0,4.78,6.06,1.03);
        hip(T,k,0,4.89,0,4.42,5.74,1.25);
        if(side<0)cylinder(k,0x78694a,0,3.90,0,.45,.76);
        else k.stamp(k.round,0x875e3f,0,3.88,0,.49,.91,.49,0,Math.PI/2);
      });
    }
    f.building(0,-32.2,0,31.5,4.7,()=>hall(T,k,31.5,4.7,.37,2.30,1.51,11,{gable:true}));
    // The apron is the solid indentation in the real lake ring w550537566.
    // Preserve the two side arms of water under the roofed bridges.
    const raw=[[-21.1,7.4],[-8.2,47.9],[6,51.8],[18.2,49.1],[28.8,44],[30.2,41.7],
      [30.6,39],[26.3,2.6],[17.7,5.8],[19.5,15.2],[1.4,19.9],[-1.4,9.8]];
    const apron=raw.map(([east,south])=>{
      const x=east-6,z=south+2.3;return [x*.9669-z*.2551,x*.2551+z*.9669];
    });
    f.fixture(g=>g(0,26.5),()=>{
      const shape=new T.Shape();apron.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
      const mesh=new T.ExtrudeGeometry(shape,{depth:2.9,bevelEnabled:false});mesh.rotateX(-Math.PI/2);
      k.groundStamp(mesh,0xad9279,0,-2.68,0);mesh.dispose();
      for(let i=1;i<6;i++){
        const [x,z]=apron[i],[ex,ez]=apron[i+1],n=Math.ceil(Math.hypot(ex-x,ez-z)/2.11);
        for(let j=0;j<n;j++){
          const u=j/n;k.box(stone,x+u*(ex-x),.63,z+u*(ez-z),.18,.84,.19);
        }
        A.strut(T,k,grey,x,.89,z,ex,.89,ez,.063);
      }
    });
    coveredBridge(T,k,f,-37.68,13.94,-.08,16.9);
    coveredBridge(T,k,f,26.45,21.76,-.045,12.25);
    f.fixture(g=>g(37.45,21.96),()=>{
      const g=new T.CylinderGeometry(1,1,1,14);
      k.groundStamp(g,0x7b7360,37.45,-1.29,21.96,5.17,3.23,5.59);g.dispose();
    });
    f.building(37.45,21.96,Math.PI/2,7.0,5.0,()=>hall(T,k,7,5,.38,2.48,1.57,3,{wall:0x86674d}));
    for(const [x,z,h,s,n] of [[-16.9,23.9,9.4,8.5,1.7],[13.2,18,9.1,6.4,2.7],[-25,-19,9.9,8,4.8],
      [20.4,-8.5,9.3,8.5,6.1],[42.4,17.9,7.0,6.3,3.8],[-8,-39,10.1,8.7,.24]])tree(T,k,f,x,z,h,s,n);
  }
  function fret(k,x,y,z,s){
    const thin=.104*s;
    for(const side of [-1,1]){
      k.box(pale,x+side*s*.49,y,z,thin,s*.96,.16);
      k.box(pale,x,y+side*s*.49,z,s,thin,.16);
      k.box(pale,x+side*s*.24,y+s*.24,z,.39*s,thin,.16);
      k.box(pale,x+side*s*.26,y+s*.09,z,thin,.32*s,.16);
      k.box(pale,x+side*s*.30,y-s*.17,z,.36*s,thin,.16);
      k.box(pale,x+side*s*.16,y-s*.29,z,thin,.29*s,.16);
    }
    k.box(pale,x,y+.04*s,z,.50*s,thin,.17);
    k.box(pale,x,y+.30*s,z,thin,.37*s,.17);
  }
  // A water-puppet stage has two raised storage wings and a flooded opening
  // across its middle. Its front faces the temple terrace on the north shore.
  function pavilion(T,k){
    for(const side of [-1,1]){
      const x=side*2.63;
      k.box(stone,x,-.74,0,1.91,2.41,4.47);
      k.box(grey,x,.49,0,1.96,.23,4.50);
      k.box(plaster,side*3.42,1.82,0,.34,2.68,4.26);
      for(const z of [-2.02,2.02]){
        for(const sign of [-1,1])k.box(plaster,x+sign*.71,1.93,z,.23,2.68,.28);
        k.box(plaster,x,.81,z,1.60,.53,.28);
        k.box(plaster,x,2.80,z,1.60,.74,.28);
        fret(k,x,1.76,z,1.25);
      }
    }
    for(const x of [-1.69,1.69])for(const z of [-1.66,1.66])post(k,x,z,-.39,3.60,.13);
    for(const z of [-1.89,1.89])k.box(wood,0,3.11,z,6.88,.25,.24);
    hip(T,k,0,3.21,0,7.78,5.23,1.60,oldTile);
    for(const x of [-1.61,1.61])for(const z of [-.64,.64])k.box(wood,x,4.85,z,.17,.91,.17);
    for(const z of [-.64,.64])k.box(wood,0,5.05,z,3.46,.21,.22);
    hip(T,k,0,5.21,0,5.30,3.65,1.51,oldTile);
    // Match the named lake's waterline estimate in the world renderer.
    // The surveyed shoreline is sampled from original way w550537566, in
    // east/south metres relative to the water theatre.
    const shore=[[-47,-81],[-44.7,-79.5],[-27.5,-25.1],[-13.3,-21.2],[9.5,-29],[11.3,-34],
      [7,-70.4],[14.5,-84.8],[38,-88.8],[45.3,-81],[54.6,74.3],[51.2,83.1],[46.4,85.2],[-8.8,93.8],
      [-16.7,89.9],[-17.6,78.7],[-15.1,59.5],[-23.2,42.2],[-29.2,32.1],[-54.9,-48.9],[-58.3,-57.3]];
    k.group.userData.fitGround=ground=>{
      const h=shore.map(([x,z])=>ground(x*Math.cos(-2.88)-z*Math.sin(-2.88),x*Math.sin(-2.88)+z*Math.cos(-2.88))).sort((a,b)=>a-b);
      k.group.children.at(-1).position.y=h[Math.floor(h.length*.16)]-.54;
    };
  }
  function roundWindow(T,k,width,height,back){
    // The open white ceramic surround and its pierced central motif occupy a
    // real hole in the exposed Bát Tràng brickwork.
    const rad=.58,cy=height*.60+.38,depth=.26;
    const rectangle=new T.Shape();rectangle.moveTo(-width/2,.38);rectangle.lineTo(width/2,.38);
    rectangle.lineTo(width/2,height+.38);rectangle.lineTo(-width/2,height+.38);rectangle.closePath();
    const hole=new T.Path();hole.absarc(0,cy,rad,0,Math.PI*2,true);rectangle.holes.push(hole);
    k.profile(rectangle,clay,0,0,back-depth,depth);
    const surround=new T.Shape();surround.absarc(0,0,rad+.133,0,Math.PI*2);
    const inner=new T.Path();inner.absarc(0,0,rad-.03,0,Math.PI*2,true);surround.holes.push(inner);
    k.profile(surround,0xd5cec0,0,cy,back-.03,.072);
    const disk=new T.TorusGeometry(rad*.65,.066,6,22);k.stamp(disk,pale,0,cy,back+.01);disk.dispose();
    for(const s of [-1,1]){
      k.box(pale,s*.077,cy+s*.185,back,.115,.33,.09);
      k.box(pale,s*.169,cy+s*.093,back,.226,.088,.09);
    }
  }
  function carvedEave(T,k,x,y,z,side,end){
    // Slender paired ceramic tail and dragon curling back toward the ridge.
    k.place(x,z,side===1?0:Math.PI,()=>{
      const tip=end*side*.09;
      k.outline([[0,.03],[.29,.14],[.56,.39],[.76,.80],[.76,1.0],[.60,.87],[.55,.58],[.31,.36],[.08,.26],
        [.23,.49],[.31,.54],[.34,.74],[.15,.69],[.02,.47],[-.12,.36],[-.18,.48],[-.32,.40],[-.19,.15]],grey,0,y,tip,.096);
    });
  }
  function terracottaHall(T,k,w,d,middle,front){
    const base=.38,h=2.70,lo=base+h,lowRise=1.48;
    const upperW=w-3.04,upperD=d-2.81,neck=middle?1.40:1.0;
    k.box(0x81725d,0,base/2,0,w,base,d);
    for(const side of [-1,1])k.place(side*(w/2-.296),0,side*Math.PI/2,()=>roundWindow(T,k,d-.76,h,0));
    k.box(clay,0,base+h/2,-d*.43,w-.48,h,.30);
    const doorW=front?3.22:2.44;
    for(const side of [-1,1]){
      const edge=w/2-.25,gap=1.5*doorW;
      k.box(clay,side*(edge+gap)/2,base+h*.5,d*.38,edge-gap,h,.24);
    }
    for(const j of [-1,0,1])timberDoor(k,j*doorW,base,d*.39,doorW-.06,h*.91);
    for(const x of [-1,1])for(const z of [-1,1])post(k,x*(w/2-.53),z*(d*.40),base,h,.152);
    k.box(pale,0,lo-.035,d*.39,w-.40,.12,.28);
    hip(T,k,0,lo,0,w+.81,d+.86,lowRise,redTile);
    const upperBase=lo+.89,upperEave=upperBase+neck+.34;
    k.box(wood,0,upperBase+neck*.5+.20,0,upperW-.70,neck+.83,upperD-.50);
    for(const sign of [-1,1])k.place(sign*(upperW*.50-.43),0,sign*Math.PI/2,()=>{
      const span=(upperD-.41)*.50;
      k.outline([[-span,0],[0,1.12],[span,0]],plaster,0,upperEave-.19,0,.18);
      k.outline([[-span*.69,.05],[0,.80],[span*.69,.05]],grey,0,upperEave-.17,.186,.06);
    });
    for(const side of [-1,1])for(let j=-3;j<=3;j++){
      k.box(0x78654d,j*(upperW-1.16)/7,upperBase+neck*.51,side*(upperD-.57)/2,.09,neck,.095);
    }
    // Both pitches and their gable infill have visible soffits: each range
    // keeps its two independent roofs and the clerestory between them.
    hip(T,k,0,upperEave,0,upperW+.47,upperD+.72,middle?2.15:1.94,redTile);
    for(const side of [-1,1])for(const end of [-1,1]){
      carvedEave(T,k,side*(w/2+.34),lo+.34,end*(d/2+.32),side,end);
      carvedEave(T,k,side*(upperW/2+.15),upperEave+.30,end*(upperD/2+.31),side,end);
    }
  }
  function tayPhuong(T,k){
    const f=createTempleFoundations(T,k);
    // Aerial survey of the three parallel roofs, oriented across the hillside.
    // The centre hall is narrower but its upper tier rises above the other two.
    for(const [z,w,d,middle,front] of [[9.82,18.92,8.05,false,true],[.06,14.33,7.85,true,false],[-9.70,19.12,8.13,false,false]]){
      f.building(0,z,0,w,d,()=>terracottaHall(T,k,w,d,middle,front));
    }
    // The upper, walkable passage around the gable ends is narrow and paved.
    f.walk(2.10,29,-10.70,0);
    tree(T,k,f,11.6,14.7,8.2,6.6,2.65);
    tree(T,k,f,-14.4,-15.6,8.8,7.7,5.17);
  }
  function bell(T,k,x,y,z,h){
    const profile=[[.025,0],[.37,.025],[.38,.08],[.31,.15],[.29,.50],[.24,.79],[.15,.89],[.06,.91]];
    const geo=new T.LatheGeometry(profile.map(([r,v])=>new T.Vector2(r*h,v*h)),32);
    k.stamp(geo,0x73664a,x,y,z);geo.dispose();
    for(const at of [.12,.46,.75])cylinder(k,0x9c835a,x,y+at*h,z,(.31-.08*at)*h,.03*h);
    const loop=new T.TorusGeometry(.082*h,.023*h,8,18);k.stamp(loop,0x8d7753,x,y+.991*h,z);loop.dispose();
  }
  function dinhSon(T,k){
    const f=createTempleFoundations(T,k);
    f.building(0,0,0,8.6,5.6,()=>hall(T,k,8.6,5.6,.55,2.40,1.42,3,{gable:true,wall:plaster,tile:redTile}));
    f.building(0,-4.73,0,4.14,5.15,()=>hall(T,k,4.14,5.15,.66,2.53,1.37,3,{gable:true,wall:wood}));
    const tower=f.building(.10,8.17,Math.PI,8.18,4.5,()=>{
      hall(T,k,8.18,4.50,.35,2.08,.85,3,{gable:true,tile:redTile,wall:0xc5ad75});
      k.box(wood,0,2.93,0,7.33,.24,3.72);
      for(const s of [-1,1])for(const z of [-1.19,1.19])post(k,s*3.36,z,3.0,1.33,.13);
      k.box(wood,0,4.26,0,7.55,.16,.22);
      bell(T,k,0,2.97,.17,1.21);
      A.gabledRoof(T,k,0,4.35,0,7.78,3.48,1.00,oldTile,grey,{alongX:true});
      for(const x of [-1,1]){
        k.box(0xaa977c,x*3.76,3.81,0,.18,1.48,3.30);
        k.outline([[-1.72,0],[0,1.16],[1.72,0]],plaster,x*3.78,4.32,-.03,.20,Math.PI/2);
      }
    });
    f.stairs(tower,-3.05,5.96,-5.41,3.57,2.06,.34,7);
  }
  function boiAm(T,k){
    const f=createTempleFoundations(T,k),red=0xa96853;
    // The Hà Nội inventory identifies the single-pitch former Nhà Tổ at the
    // right end of the five-bay Mẫu hall. Its back meets the limestone scarp.
    f.building(0,0,0,13.66,5.5,()=>hall(T,k,13.66,5.5,.49,2.54,1.67,5,{gable:true,tile:redTile,wall:0xa69e88}));
    f.building(-10.21,-.86,0,5.87,4.07,()=>{
      const h=2.90;
      k.box(stone,0,.23,0,5.86,.46,4.07);
      k.box(plaster,0,.46+h/2,-1.85,5.73,h,.30);
      for(const side of [-1,1])k.box(plaster,side*2.79,1.78,-.31,.27,2.64,3.18);
      for(const side of [-1,1])post(k,side*2.35,1.55,.46,2.23,.18);
      for(const side of [-1,1]){
        k.box(wood,side*1.69,1.47,1.05,.18,1.99,.17);
        k.box(plaster,side*2.28,1.42,.97,.98,1.90,.25);
        k.box(wood,side*1.55,1.42,.39,.14,1.94,1.08);
        for(const h of [.66,1.32,2.18])k.box(0x886c4c,side*1.47,h,.40,.075,.072,1.02);
        const leaf=new T.BoxGeometry(.55,.93,.06);
        k.stamp(leaf,0x795c48,side*2.19,1.50,1.12);leaf.dispose();
      }
      k.box(wood,0,.94,-1.02,2.19,.16,.66);
      for(const s of [-1,1])k.box(wood,s*.84,.69,-1.02,.14,.48,.44);
      k.box(wood,0,2.67,1.55,5.69,.26,.26);
      // One continuous slope descending from the rock to the public eave.
      k.outline([[-2.36,2.75],[2.36,4.29],[2.36,4.13],[-2.36,2.62]],red,-3.12,0,0,6.24,Math.PI/2);
      k.box(grey,0,4.23,-2.32,6.34,.14,.27);
      A.plaque(T,k,'NHÀ LƯU NIỆM CHỦ TỊCH HỒ CHÍ MINH',0,2.49,1.71,4.48,.41,{bg:'#6d5040',fg:'#e9cd9b',frame:false});
      // The rock descends to the two sides of the formerly sheltered room.
      const outcrop=new T.PlaneGeometry(11.2,6.53,32,16),p=outcrop.attributes.position;
      for(let i=0;i<p.count;i++){
        const x=p.getX(i),v=(p.getY(i)+3.265)/6.53,margin=1-Math.min(1,Math.abs(x)/5.6)**2;
        const crest=3.53+2.68*margin+.31*Math.cos(x*1.76)+.22*Math.sin(x*3.4);
        const z=-2.27-.43*v-.61*v*v+.22*Math.sin(x*.9+v*8)+.15*Math.cos(x*3-v*11);
        p.setXYZ(i,x,-.44+v*crest,z);
      }
      outcrop.computeVertexNormals();k.stamp(outcrop,grey,0,0,0);outcrop.dispose();
    });
    tree(T,k,f,-15.8,-4.42,6.48,5.52,1.52);
    tree(T,k,f,6.66,-4.26,7.69,6.54,3.22);
  }
  site('osm-way-550537567','chua-thay-sai-son','Chùa Thầy – Thiên Phúc tự',sai,
    'Ba nếp chùa nối từ sân hồ vào chân núi Sài Sơn. Cầu Nhật Tiên dẫn sang gò có đền Tam Phủ, cầu Nguyệt Tiên nối sân chùa với đường lên núi. Gác chuông và gác trống nằm ở hai đầu hành lang phía sau.',
    [6,-2.3,.258],[91,85],[['Thủy đình và ba nếp chùa nhìn từ hồ Long Trì',0,21,7.0,118,.16,.46],
      ['Nguyệt Tiên kiều và lối lên núi',-37.68,13.94,4.8,24,.79,.18],
      ['Nhật Tiên kiều tới đền Tam Phủ',31.0,21.85,5.3,26,-.59,.25],
      ['Ống muống giữa chùa Hạ và chùa Trung',0,8.17,6.6,10.3,1.49,.23],
      ['Hiên và cửa bức bàn chùa Hạ',0,16.44,6.72,24.3,.20,.13]],thay,
    {modeledBuildings:['w1159531916','w1159531917','w1159531918'],gardenRadius:31,
      solids:[[0,15.15,10,3.64],[0,-.3,10,4.75],[0,-15.6,8.55,6.05],[-14.45,-4.5,1.53,14.8],[14.45,-4.5,1.53,14.8],[37.45,21.96,2.5,3.5]]});
  site('osm-node-13860996059','thuy-dinh-ho-long-tri','Thủy đình chùa Thầy',sai,
    'Nhà rối đứng giữa hồ Long Trì, hai tầng tám mái. Các ô thoáng chữ thọ nằm trên hai cánh xây. Giữa hai cánh là khoảng nước thông suốt để nghệ nhân đưa con rối ra biểu diễn.',
    [0,0,-2.88],[8.1,5.65],[['Mặt sân khấu rối nhìn từ sân chùa',0,.15,5.53,15.9,.09,.12],
      ['Hai cánh xây và khoang nước',0,.65,4.36,8.9,-.30,.13],
      ['Thủy đình trên trục chùa Thầy',0,0,6.27,35.7,3.02,.17]],pavilion,{gardenRadius:5,solids:[[-2.63,0,.97,2.2],[2.63,0,.97,2.2]]});
  site('osm-node-5317498207','chua-cao-sai-son','Chùa Cao – Đỉnh Sơn tự',cao,
    'Ở lưng chừng núi Sài Sơn, chùa chính có tiền đường ba gian nối với thượng điện thành hình chữ Đinh. Qua khoảng sân nhỏ là gác chuông hai tầng, nơi treo quả chuông đúc năm Cảnh Thịnh thứ tư.',
    [7.38,-6.8,2.12],[14.3,23.4],[['Sân giữa chính điện và gác chuông',0,1.63,5.65,22.4,-1.09,.46],
      ['Tầng trên của gác chuông',.1,8.17,8.23,3.73,2.99,.032]],dinhSon,
    {arrivalNote:'Gửi xe tại bãi của khu di tích, qua cầu Nguyệt Tiên rồi theo lối bậc đá đi bộ lên núi.'});
  site('osm-node-5317498202','chua-mot-mai-boi-am','Chùa Một Mái – Bối Am tự',boi,
    'Ở sườn tây núi Sài, nhà Tổ chỉ có một dốc mái tựa vách núi. Gian này, cạnh đầu hồi điện Mẫu, là nơi Chủ tịch Hồ Chí Minh ở và làm việc đầu năm 1947, nay là nhà lưu niệm.',
    [1.3,-1.8,-1.91],[25.6,7.86],[['Điện Mẫu và gian nhà Tổ tựa núi',-3.17,0,5.31,24.7,.19,.24],
      ['Mái dốc của nhà lưu niệm',-10.21,-.86,4.02,10.10,-.27,.10]],boiAm,
    {start:[105.641107,21.023864],approachMeters:undefined,arrivalNote:'Xe dừng trên đường ở chân sườn tây núi Sài. Từ cổng Bối Am đi bộ vào sân chùa.'});
  site('osm-node-847878471','chua-tay-phuong-thach-xa','Chùa Tây Phương – Thạch Xá',tay,
    'Trên đỉnh Câu Lậu, ba tòa chùa xếp song song. Mỗi tòa có hai tầng mái ngói mũi hài, tường gạch Bát Tràng để mộc và cửa tròn. Tòa giữa hẹp hơn hai tòa ngoài nhưng có cổ diêm cao hơn.',
    [13.18,-15.3,.97],[22,30.5],[['Ba lớp điện trên đỉnh Câu Lậu',0,0,8.8,41.3,-.99,.52],
      ['Cửa tròn bên các đầu hồi',-8.8,3.4,3.77,13.7,-1.23,.13],
      ['Mái đao và cổ diêm của tòa giữa',-2.6,-.11,9.68,19.7,-.97,.31],
      ['Mặt tiền ba gian cửa gỗ',0,11.6,7.15,19.13,.14,.16]],tayPhuong,
    {start:[105.584577,21.024755],approachMeters:undefined,arrivalNote:'Từ đường làng dưới chân đồi Câu Lậu, đi bộ theo bậc đá ong lên khu chùa trên đỉnh.',
      gardenRadius:15,solids:[[0,9.82,9.46,4.03],[0,.06,7.17,3.93],[0,-9.7,9.56,4.07]]});
})();
