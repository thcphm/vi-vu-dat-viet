const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const A = window.CentralArch;
  const atlas=window.VietnamTourism.byId || new Map(window.VietnamTourism.entries.map(s=>[s.id,s]));
  const heritage='https://disanyentu.vn/vi/danh-thang/';
  const stone=0x918d80, ash=0xb4ad9a, brick=0x9e6a50, tile=0x895541, timber=0x624132;
  const light=0xd7c6a4, brass=0x8f7960;
  const stops=window.VietnamSights??=[];

  function roof(T,k,y,w,d,rise,tint=tile,lift=.3){
    A.curvedRoof(T,k,0,y,0,w,d,rise,tint,stone,stone,lift);
  }
  function column(k,x,z,y,h,r,tint){
    k.stamp(k.round,ash,x,y+.08,z,r*1.45,.16,r*1.45);
    k.stamp(k.round,tint,x,y+h/2,z,r,h,r);
  }
  // Small auxiliary halls have a sheltered veranda. Their footprint includes
  // the eaves, so projecting the roof twice would overrun the surveyed plan.
  function hall(T,k,w,d,options={}){
    const base=options.base??.45,h=options.h??Math.min(4.1,2.2+d*.12),n=options.bays??5;
    k.box(stone,0,base/2,0,w*.98,base,d*.97);
    k.box(options.wall??light,0,base+h*.5,-d*.10,w*.86,h,d*.62);
    for(let j=0;j<=n;j++){
      const x=(j/n-.5)*w*.86;
      column(k,x,d*.36,base,h,options.r??.16,timber);
      if(j===n)continue;
      const bx=x+w*.43/n,dw=w*.76/n,face=d*.215;
      k.box(0x302c26,bx,base+h*.47,face,dw,h*.91,.19);
      for(let leaf=0;leaf<4;leaf++){
        const u=bx+(leaf-1.5)*dw*.236;
        k.box(timber,u,base+h*.38,face+.12,dw*.20,h*.67,.10);
        k.box(timber,u,base+h*.78,face+.12,.058,h*.24,.09);
      }
    }
    k.box(timber,0,base+h-.11,d*.36,w*.88,.22,.19);
    roof(T,k,base+h,w+.46,d+.3,Math.min(2.5,d*.25),options.tile??tile);
  }
  function openPosts(k,w,d,h,tint=timber){
    for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])column(k,x,z,.22,h,.16,tint);
    for(const z of [-d/2,d/2])k.box(tint,0,h+.13,z,w+.43,.27,.26);
  }
  function tower(T,k,w,h,levels,tint=stone){
    const base=h*.18,step=h*.67/levels;
    for(let j=0;j<3;j++)k.box(tint,0,(j+.5)*base/3,0,w*(1-j*.055),base/3,w*(1-j*.055));
    for(let j=0;j<levels;j++){
      const width=w*(.79-.14*j/levels),y=base+j*step;
      k.box(tint,0,y+step*.48,0,width*.78,step*.96,width*.78);
      for(const a of [0,Math.PI/2,Math.PI,3*Math.PI/2])k.box(0x504e42,Math.sin(a)*width*.40,y+step*.46,Math.cos(a)*width*.40,width*.19,step*.40,.024,a);
      k.tapered(tint,0,y+step*.91,0,width*.78,width*.47,step*.23,1,4);
    }
    k.tapered(tint,0,h*.91,0,w*.16,w*.08,h*.11,1,10);
    k.tapered(tint,0,h*.98,0,w*.10,.013,h*.11,1,10);
  }
  function stele(T,k,h=1.35){
    // No invented characters on the weathered field. The domed tablet,
    // carved border and turtle plinth remain visible from the visitor path.
    const orb=new T.SphereGeometry(1,16,8);
    k.stamp(orb,stone,0,.24,0,.60,.21,.82);k.stamp(orb,stone,0,.22,.84,.15,.10,.21);
    for(const s of [-1,1])for(const z of [-.42,.42])k.stamp(orb,stone,s*.49,.10,z,.19,.09,.13);
    orb.dispose();
    const shape=new T.Shape();shape.moveTo(-.45,0);shape.lineTo(-.45,h*.83);
    shape.quadraticCurveTo(0,h*1.19,.45,h*.83);shape.lineTo(.45,0);shape.closePath();
    k.profile(shape,stone,0,.37,-.105,.21);
    for(const s of [-1,1])k.box(ash,s*.41,.37+h*.43,.115,.035,h*.83,.02);
  }
  function sphere(T,k,color,x,y,z,rx,ry,rz,segments=16){
    const g=new T.SphereGeometry(1,segments,Math.max(5,segments/2));
    k.stamp(g,color,x,y,z,rx,ry,rz);g.dispose();
  }
  // Field monuments are built on independent level pads. The local survey
  // coordinates for all fixtures are east/south offsets from the camera pin.
  function connectedHalls(T,k,w,d){
    k.place(0,d*.25,0,()=>hall(T,k,w,d*.48));
    k.place(0,-d*.28,0,()=>hall(T,k,w*.63,d*.49,{bays:3}));
    k.box(timber,0,2.09,-.3,w*.43,3.4,d*.29);
  }
  function hoaYen(T,k,w,d){
    connectedHalls(T,k,w,d);
    A.steps(k,0,d*.53,4,.82,3,.15,.38,stone);
  }
  function dong(T,k){
    const metal=0x79755e,edge=0x938c73;
    k.palette({metal:[metal,edge]});
    for(let i=0;i<27;i++){
      const a=i*2.4,r=2.5+(i%3)*.9;const x=Math.cos(a)*r,z=Math.sin(a)*r;
      sphere(T,k,i%2?0x8c8979:0x98917d,x,-.14,z,1.0+(i%3)*.22,.44+(i%4)*.12,1.02,8);
    }
    k.box(stone,0,.19,0,6.77,.42,5.9);k.box(metal,0,.47,0,4.72,.19,3.66);
    k.box(metal,0,1.35,-.38,3.51,1.68,1.88);
    for(const x of [-1.65,-.54,.54,1.65])column(k,x,1.10,.54,1.73,.10,metal);
    for(const x of [-1.13,0,1.13]){
      k.box(0x383c34,x,1.32,.578,.90,1.36,.08);
      for(const u of [-.30,-.10,.10,.30])k.box(edge,x+u,1.45,.641,.03,1.19,.045);
    }
    A.curvedRoof(T,k,0,2.23,0,4.60,3.60,1.04,metal,edge,edge,.30);
  }
  function bellPavilion(T,k,w,d){
    k.box(stone,0,.15,0,w,.30,d);
    openPosts(k,w*.72,d*.68,3.45);
    // Open, floored upper storey allows the bell to be seen across the court.
    k.box(timber,0,3.39,0,w*.74,.31,d*.70);
    roof(T,k,3.44,w,d,1.45);
    for(const x of [-w*.23,w*.23])for(const z of [-d*.20,d*.20])column(k,x,z,4.42,1.51,.16,timber);
    const g=new T.LatheGeometry([[.46,0],[.50,.09],[.38,.70],[.32,1.09],[.16,1.22]].map(([x,y])=>new T.Vector2(x,y)),16);
    k.stamp(g,brass,0,4.51,0);g.dispose();
    roof(T,k,6.00,w*.76,d*.69,1.66);
  }
  function lotusHall(T,k,w,d){
    k.box(stone,0,.23,0,w,.46,d);openPosts(k,w*.85,d*.81,4.1);
    for(const s of [-1,1])for(const t of [-1,1])column(k,2.04*s,2.04*t,.40,8.93,.25,timber);
    roof(T,k,4.24,w,d,2.20);roof(T,k,6.69,10.1,9.5,1.80);
    roof(T,k,8.97,6.65,6.5,1.46);
    const lacquer=0x8b3e2e,gold=0xc59d50;
    k.tapered(timber,0,3.91,0,.25,.25,7.0,1,12);
    for(let j=0;j<9;j++){
      const rad=1.54-j*.073,base=.57+j*.75;
      k.tapered(gold,0,base+.12,0,rad*.82,rad,.23,1,8);
      k.tapered(lacquer,0,base+.47,0,rad*.71,rad*.67,.51,1,8);
      for(let petal=0;petal<8;petal++){
        const a=petal*Math.PI/4;
        k.tapered(gold,Math.sin(a)*rad*.85,base+.23,Math.cos(a)*rad*.85,.155,.056,.22,1,8);
      }
    }
  }
  function kiepGate(T,k,w,d){
    // Three parallel vaulted passages below a broad gatehouse, overlooking
    // the Lục Đầu river. Steps and pedestals sit to either side of the axis.
    for(let i=-1;i<=1;i++){
      const cx=i*w*.30,r=i===0?1.75:1.19,base=i===0?5.1:4.20;
      A.vaultedBay(T,k,cx,0,w*.302,base,r,i===0?2.48:2.03,d,0xcbbd9c,ash,stone);
      A.curvedRoof(T,k,cx,base+.1,0,w*.337,d+1.0,1.02,tile,stone,stone,.30);
      k.box(light,cx,base+1.38,0,w*.233,1.03,d*.64);
      for(const u of [-.20,0,.20])k.box(timber,cx+u*w*.32,base+1.37,d*.33,w*.043,.66,.08);
      A.curvedRoof(T,k,cx,base+1.94,0,w*.31,d*.91,1.03,tile,stone,stone,.29);
    }
  }
  function thaiMieu(T,k,w,d){
    for(const z of [d*.33,0,-d*.34])k.place(0,z,0,()=>hall(T,k,w*(z===0?.72:.98),d*.30,{h:3.85}));
    k.place(0,0,Math.PI/2,()=>roof(T,k,3.65,d*.73,5.3,1.04));
    A.steps(k,0,d*.55,7.0,.92,5,.17,.38,stone);
  }
  function stakeYard(T,k,w,d){
    // The conservation pool follows w1567975869. Only worn tips visible
    // at the water surface are depicted; individual positions are illustrative.
    const wood=[0x4b4539,0x625745,0x554e40];k.palette({timber:wood});
    const rim=[[-9.40,9.60],[-10.20,-7.40],[-7.30,-9.80],[5.10,-9.30],[5.10,-3.60],
      [6.20,-.10],[8.80,1.60],[10.30,7.70],[-.90,9.20],[-4,10.30]];
    const shape=new T.Shape();
    for(const [i,[x,z]] of rim.entries()){
      const [bx,bz]=rim[(i+1)%rim.length],dx=bx-x,dz=bz-z;
      k.box(ash,(x+bx)/2,.26,(z+bz)/2,.34,.78,Math.hypot(dx,dz),Math.atan2(dx,dz));
      if(i)shape.lineTo(x,-z);else shape.moveTo(x,-z);
    }
    shape.closePath();
    const water=new T.ShapeGeometry(shape);water.rotateX(-Math.PI/2);
    k.stamp(water,0x596956,0,.08,0);water.dispose();
    for(let i=0;i<19;i++){
      const z=(k.random()-.5)*(d-3.8),x=-7.1+k.random()*(z<0?10.5:13.1),height=.11+k.random()*.50;
      const g=new T.CylinderGeometry(.10+k.random()*.06,.16+k.random()*.06,height,7);
      k.stamp(g,wood[i%3],x,.09+height*.40,z,1,1,1,i*.83,(k.random()-.5)*.34);g.dispose();
    }
  }
  let rockMaps;
  function grotto(T,k,w,depth,double=true){
    // Kính Chủ's south wall opens into two adjacent mouths. Recessed
    // vaults have inner surfaces, a floor, side walls and a continuous roof.
    const pos=[],uv=[],colors=[],indices=[];
    function vertex(x,y,z,c){
      pos.push(x,y,z);uv.push((x+.22*z)*.24,(y+.40*z)*.24);colors.push(c*.73,c*.87,c);
      return pos.length/3-1;
    }
    const n=double?2:1;
    for(let mouth=0;mouth<n;mouth++){
      const edge=w/n,r=edge*.49,mid=(mouth+.5)*edge-w*.5,archH=double?(mouth?6.95:7.9):4.0;
      const sides=24,rows=5;const surface=[];
      for(let j=0;j<=rows;j++){
        const ring=[];
        for(let i=0;i<=sides;i++){
          const a=Math.PI*i/sides,t=j/rows,wrinkle=.19*Math.sin(i*1.21+j*.39)+.15*Math.cos(i*.91-j);
          ring.push(vertex(mid+Math.cos(a)*(r*(1-.17*t)+wrinkle),.18+Math.sin(a)*(archH*(1-.22*t)+wrinkle),
            depth*(.5-t)+.22*Math.sin(i*.85+j*.45),1.0-t*.55));
        }
        surface.push(ring);
      }
      for(let j=0;j<rows;j++)for(let i=0;i<sides;i++){
        const a=surface[j][i],b=surface[j][i+1],c=surface[j+1][i+1],d=surface[j+1][i];
        indices.push(a,b,c,a,c,d);
      }
      const back=vertex(mid,.08,-depth*.53,.35);
      for(let i=0;i<sides;i++)indices.push(back,surface[rows][i],surface[rows][i+1]);
      const face=[];
      for(let i=0;i<=sides;i++){
        const a=Math.PI*i/sides,px=mid+Math.cos(a)*(r+.58);
        const outer=Math.abs(px)/(w*.5);
        const crest=archH+2.6-2.4*outer**3+1.09*Math.sin(px*.57)+.23*Math.cos(i*1.2);
        face.push(vertex(px,Math.max(archH*Math.sin(a)+.82,crest),depth*.5+.56*Math.cos(i*.64),1.0));
      }
      for(let i=0;i<sides;i++)indices.push(surface[0][i],face[i],face[i+1],surface[0][i],face[i+1],surface[0][i+1]);
      // Extend the lips into the slope so the profiles are solid in orbit view.
      const rear=face.map((v,i)=>vertex(pos[v*3],pos[v*3+1]-.5+Math.sin(i)*.18,-depth*.65, .75));
      for(let i=0;i<sides;i++)indices.push(face[i],rear[i],rear[i+1],face[i],rear[i+1],face[i+1]);
    }
    if(!rockMaps)rockMaps=['color','normal'].map(c=>{
      const map=new T.TextureLoader().load('streetscape/surfaces/cut-rock-'+c+'.webp');
      map.wrapS=map.wrapT=T.RepeatWrapping;map.userData.sightShared=true;if(c==='color')map.colorSpace=T.SRGBColorSpace;
      return map;
    });
    const geo=new T.BufferGeometry();geo.setIndex(indices);
    for(const [name,array,n] of [['position',pos,3],['uv',uv,2],['color',colors,3]])geo.setAttribute(name,new T.Float32BufferAttribute(array,n));
    geo.computeVertexNormals();
    const m=new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,map:rockMaps[0],normalMap:rockMaps[1],side:T.DoubleSide,roughness:.99}));
    m.castShadow=m.receiveShadow=true;k.group.add(m);
    k.box(stone,0,.03,0,w,.14,depth);
  }
  function kinhChu(T,k,w,d){
    grotto(T,k,w,d);
    k.box(stone,-3.60,.46,-1.9,3.2,.86,1.26);k.box(brick,-3.60,1.06,-2.1,2.60,.35,.96);
    k.box(ash,-3.60,1.42,-2.36,2.1,.40,.62);
  }
  function thanhMai(T,k){
    tower(T,k,2.77,5.0,3);steleAt(T,k,2.70,1.3,1.31);
  }
  function steleAt(T,k,x,z,h){
    k.place(x,z,0,()=>stele(T,k,h));
  }
  function summitPath(T,k,w,d){
    const earth=0x8a8470;
    for(let i=0;i<20;i++){
      const t=i/19,side=i%2?-1:1;
      sphere(T,k,i%3?stone:earth,(k.random()-.5)*w*.70,0,d*(t-.5),.78+k.random(),.36+k.random()*.49,1.13,8);
      if(i%3===0)k.box(shortSlab,side*w*.38,.12,d*(t-.5),1.12,.19,1.16,.22*t);
    }
  }
  const shortSlab=0xa29d88;
  function lantern(T,k,x,z){
    k.tapered(stone,x,.68,z,.22,.14,1.36,1,8);
    k.box(ash,x,1.50,z,.46,.39,.46);k.tapered(stone,x,1.79,z,.41,.11,.24,1,4);
  }
  function courtyardLan(T,k){
    k.box(stone,0,.14,0,6.5,.28,5.3);
    k.tapered(0xaf746f,0,.48,0,1.34,1.13,.48,1,32);
    k.tapered(0xbf8a81,0,.83,0,1.18,.82,.24,1,32);
    sphere(T,k,0x9d5149,0,1.75,0,.94,.94,.94,32);
    for(const x of [-2.60,2.60])lantern(T,k,x,1.38);
  }
  function amNgoaVan(T,k,w,d){
    const masonry=0x999d90;
    A.vaultedBay(T,k,0,0,w,2.96,1.06,1.39,d,masonry,ash,stone);
    k.box(0x5d6056,0,1.16,-d*.43,w*.74,2.29,.19);
    k.box(stone,0,.52,-.63,2.42,.48,1.22);
    k.box(masonry,0,3.02,0,w+.42,.32,d+.30);
    k.outline([[-w*.55,0],[0,.66],[w*.55,0]],masonry,0,3.14,-d*.52,d*1.04);
  }
  function earthWalk(T,k,w,d){
    const clay=[0x9e7151,0x997158,0xa77957,0xae8062];k.palette({plaster:clay});
    for(const s of [-1,1]){
      for(let j=0;j<9;j++){
        const top=1.84+j*.045+(s+1)*.10,z=(j-4)*d/9;
        k.box(clay[(j+(s+1))%4],s*w*.46,top/2,z,.54,top,d/9+.016);
        for(let r=0;r<3;r++)k.box(r%2?tile:stone,s*w*.46+(r-1)*.17,top+.053,z,.25,.10,d/9+.02,0,0,(1-r)*.26);
      }
    }
  }
  function towerGarden(T,k){
    for(let row=0;row<4;row++)for(let j=0;j<6;j++){
      const x=(j-2.5)*3.11+.26*(row%2),z=(row-1.5)*3.12;
      const tint=(row+j)%4?0xab7051:0x999383;
      k.place(x,z,0,()=>tower(T,k,1.42+(j%3)*.11,2.55+((row+j)%3)*.45,2+((row+j)%2),tint));
    }
  }
  function oldTree(T,k,w){
    createTreeModels(T).grove(k.group,[[0,0,0,w,w*.86,.41]],false);
  }
  // Rectangles use measured long axes where mapped. Other buildings are
  // reconstructed against the aerial roofline and monument descriptions.
  // The original road arrival (WGS84) remains distinct from every shrine.
  function add(catalogId,id,name,source,description,siteYaw,anchor,parts,views,options={}){
    const original=atlas.get(catalogId),[cx,cz]=anchor;
    const c=Math.cos(siteYaw),s=Math.sin(siteYaw),mx=111320*Math.cos(original.lat*Math.PI/180);
    function local(east,south,bearing){
      return {x:east*c-south*s,z:east*s+south*c,angle:bearing-siteYaw};
    }
    const main=parts[0],solids=[],modeledBuildings=[];
    for(const [x,z,yaw,w,d,draw,ref] of parts){
      if(ref)modeledBuildings.push(ref);
      if([oldTree,summitPath,earthWalk,towerGarden,kinhChu,stakeYard].includes(draw))continue;
      const p=local(x,z,yaw);
      const cw=Math.abs(Math.cos(p.angle)),sw=Math.abs(Math.sin(p.angle));
      solids.push([p.x,p.z,.39*(cw*w+sw*d),.39*(sw*w+cw*d)]);
    }
    const visitViews=views.map(([name,east,south,height,viewRadius,viewAngle,viewElevation])=>
      ({name,offset:[east,south],height,viewRadius,viewAngle,viewElevation}));
    const lon=original.lon+cx/mx,lat=original.lat-cz/110900;
    const width=main[3],depth=main[4];
    stops.push({...original,catalogId,id,name,lon,lat,approachMeters:undefined,width,depth,yaw:siteYaw,
      photo:source,source,description,views:visitViews,solids,modeledBuildings,visitOnArrival:true,...options,
      build(T,k){
        k.palette({stone:[stone,ash],timber,tile,brick,plaster:light});
        if(main[5]===stakeYard){stakeYard(T,k,width,depth);return;}
        const foundations=createTempleFoundations(T,k);
        for(const [e,n,yaw,w,d,draw] of parts){
          const {x,z,angle}=local(e,n,yaw);
          if(draw===oldTree||draw===summitPath){
            let children=[];
            foundations.fixture(h=>h(x,z),()=>{children=k.place(x,z,angle,()=>draw(T,k,w,d));},
              height=>{for(const mesh of children)mesh.position.y=height;});
          }else{
            const base=foundations.building(x,z,angle,w,d,()=>draw(T,k,w,d));
            if(draw===kinhChu)foundations.stairs(base,-1.4,3.6,-1.4,30.6,2.95,.13,71);
          }
        }
        // Stepped approach w1020461295 turns with the slope below Giải Oan.
        if(id==='chua-giai-oan'){
          const trail=[[7.8,10.6],[9.9,13.9],[10.4,18],[10,22],[6.1,27],[1.3,30.1],[-6.1,32.6]];
          for(let i=0;i<trail.length-1;i++){
            const a=local(...trail[i],0),b=local(...trail[i+1],0);
            const ledge=foundations.fixture(h=>h(a.x,a.z),()=>{});
            foundations.stairs(ledge,a.x,a.z,b.x,b.z,2.27,.12,Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.43));
          }
        }
      }
    });
  }
  const quietHall=(T,k,w,d)=>hall(T,k,w,d,{bays:3});
  const sideHall=(T,k,w,d)=>hall(T,k,w,d,{bays:3,h:2.4});
  const summitArrival={start:[106.7202204,21.1403184],arrivalNote:'Xe dừng ở đường vào khu Giải Oan dưới chân núi. Từ đây, góc ngắm đưa bạn tới điểm hành hương trên núi Yên Tử.'};
  add('osm-way-1579506026','chua-hoa-yen','Chùa Hoa Yên',heritage+'chua-hoa-yen',
    'Chính điện và hậu cung nép trên nền hẹp ngang sườn núi. Hai dãy hành lang có mái nối sân trước với nếp nhà phía sau.',.23,[6.8,4],[
    [0,0,.23,13.1,11.9,hoaYen,'w1579506025'],[4.1,-10,.21,32.1,4.2,sideHall,'w1579506028'],
    [-11.8,2.5,1.80,10.7,3.3,sideHall,'w1579506034'],[10.4,-1.8,1.80,11.1,3,sideHall,'w1579506035'],
    [-21.2,-4.9,2.80,8.6,4.4,sideHall,'w1579506027']],
    [['Sân chùa Hoa Yên',0,1,6,24,.25,.18],['Hành lang lưng núi',-5,-3,5.2,31,-.69,.53]],summitArrival);
  add('osm-node-4886986961','chua-dong-yen-tu','Núi Yên Tử – Chùa Đồng',heritage+'chua-dong',
    'Mái, cột và vách của chùa Đồng đều đúc bằng đồng. Ngôi chùa nhỏ ngồi trên mỏm đá ở đỉnh Yên Tử.',.62,[-3.4,-3.7],
    [[0,0,.62,6.8,5.9,dong,'w1020461299'],[4.8,6.5,.35,5.5,11,summitPath]],
    [['Chùa Đồng trên đỉnh núi',0,0,3.7,10,.86,.17],['Mỏm đá Yên Tử',2.0,2.8,4.0,20,-.39,.37]],summitArrival);
  add('osm-way-1567975861','chua-vinh-nghiem-duc-la','Chùa Vĩnh Nghiêm (Đức La)','https://dsvh.gov.vn/di-tich-lich-su-va-kien-truc-nghe-thuat-chua-vinh-nghiem-1312',
    'Qua chùa Phật và nhà Tổ, gác chuông dựng trên trục sân. Quả chuông lớn treo giữa tầng sàn gỗ mở ra phía mái.',-.15,[1,27],
    [[0,0,-.15,23,15,connectedHalls],[0,-22,-.15,17.8,10.8,connectedHalls],[-2.3,-37,-.15,8.5,8.9,bellPavilion],[-4.7,-59,-.15,19.4,6.4,quietHall]],
    [['Trục sân Đức La',0,-8,7,48,.55,.49],['Gác chuông',-2.3,-37,7.6,12,.18,.23]]);
  add('osm-way-1567975857','chua-con-son','Chùa Côn Sơn','https://consonkiepbac.org.vn/ton-tao-toa-cuu-pham-lien-hoa-chua-con-son/',
    'Nhà Phẩm giữa thượng điện và nhà Tổ có ba tầng, mười hai mái. Bên trong, chín tầng đài sen xếp quanh trụ gỗ giữa bốn cột cái.',.63,[-12.2,-13.9],
    [[0,0,.62,28.8,27.6,connectedHalls,'w1567975856'],[-21.7,-31.5,.65,22.1,14.3,lotusHall,'w1567975858'],
    [-34.9,-46.7,.66,16.1,12.6,connectedHalls,'w1567975860'],[-43.5,-59.7,.62,26.4,7.4,quietHall,'w1567975859']],
    [['Từ sân chùa',0,0,7,44,.48,.27],['Ba tầng nhà Phẩm',-21.7,-31.5,10,26,1.17,.27],['Đài sen chín tầng',-21.7,-31.5,8.0,4.75,.48,.11]]);
  add('osm-way-1549018362','den-kiep-bac','Đền Kiếp Bạc','https://dsvh.gov.vn/di-tich-lich-su-va-kien-truc-nghe-thuat-con-son-kiep-bac-2954',
    'Đền quay về phía sông Lục Đầu. Qua nghi môn, sân hành lễ mở ra giữa hai nhà giải vũ, phía trong là các nếp điện trên cùng một trục.',-.76,[3.7,-16.1],
    [[0,0,-.76,23.3,42.4,connectedHalls,'w1549018361'],[-50.8,16.7,.79,48.4,5.8,sideHall,'w1549018360'],
    [-14.4,52.8,.81,39.7,5.8,sideHall,'w1549018359'],[-59.3,39.9,2.29,9.1,7,quietHall,'w1549018357'],
    [-38.2,63,.75,8.2,7,quietHall,'w1549018358'],[-63,65,-.76,18.0,4.3,kiepGate]],
    [['Sân đền nhìn từ phía sông',-17,21,7.5,73,-.76,.43],['Nghi môn',-63,65,8.7,25,-.91,.21]]);
  add('osm-way-1549018367','thai-mieu-nha-tran','Thái miếu nhà Trần',heritage+'thai-mieu-nha-tran',
    'Thái miếu hiện nay nằm trên đồi Đình. Các nếp điện và mái nối giữa các tòa nhắc lại mặt bằng chữ Vương được ghi nhận trong khai quật.',-.68,[14.9,-48.9],
    [[0,0,-.68,22.9,24.6,thaiMieu,'w1549018375'],[-10.7,-15.7,.90,9.8,6.4,quietHall,'w1549018374'],[-4.7,-24.7,.89,9.1,4.3,sideHall,'w1549018373']],
    [['Ba lớp điện',0,0,7,39,-.40,.48],['Bậc vào Thái miếu',-6.3,8.1,5.3,17,-.85,.18]]);
  add('osm-way-1567975868','bai-coc-yen-giang','Bãi cọc Yên Giang',heritage+'bai-coc-yen-giang',
    'Trong ô bảo tồn có kè bao, những đầu cọc gỗ sẫm màu nhô khỏi mặt nước. Vị trí từng đầu cọc trong cảnh được mô phỏng.',.01,[3.4,-1.8],
    [[0,0,.01,20.2,19.8,stakeYard]],
    [['Ô bảo tồn Yên Giang',0,0,1.5,27,.13,.49],['Mặt nước và các đầu cọc',0,0,1.1,11,-.37,.12]]);
  add('osm-way-1567975866','dong-kinh-chu','Động Kính Chủ','https://dsvh.gov.vn/di-tich-lich-su-danh-lam-thang-canh-an-phu-kinh-chu-nham-duong-tinh-hai-duong-3218',
    'Hai cửa động mở về phía nam. Dưới vòm đá có ban thờ, còn trên vách núi lưu lại những văn bia ma nhai qua nhiều thế kỷ.',0,[0,0],
    [[0,0,0,18.6,7,kinhChu]],[['Hai cửa động',0,1,8.2,26,.10,.14],['Dưới vòm đá',-3.6,-.48,5.6,6.1,.11,.08]]);
  add('osm-way-1567975863','chua-thanh-mai','Chùa Thanh Mai','https://www.haiphong.gov.vn/thong-tin-gioi-thieu/chua-thanh-mai-gia-tri-lich-su-va-van-hoa-839767',
    'Sau nếp nhà Tổ là Viên Thông bảo tháp của thiền sư Pháp Loa. Tấm bia năm 1362 ghi lại hành trạng của vị Tổ thứ hai của Thiền phái Trúc Lâm.',.16,[0,0],
    [[0,0,.16,16,10,connectedHalls],[-1.7,-15,.16,11.6,5.2,quietHall],[-4.6,-26.4,.16,7.0,5.2,thanhMai]],
    [['Sân chùa trên núi',0,0,5.8,26,.41,.23],['Tháp Viên Thông và bia đá',-4.6,-26.4,5.3,11,.48,.20]]);
  add('osm-way-1567975865','chua-nham-duong','Chùa Nhẫm Dương','https://haiphong.gov.vn/di-tich-danh-thang/khu-di-tich-an-phu-kinh-chu-nham-duong-839832',
    'Chùa nằm tựa vào núi Nhẫm Dương. Phía sau khu thờ là động Thánh Hóa, nơi tìm thấy nhiều hóa thạch động vật.',-.13,[14.3,-7.7],
    [[0,0,-.13,27,11.2,quietHall],[-22.5,10.9,-.16,13.4,7.4,sideHall],[-15.8,-12.6,-.15,7,5.7,(T,k,w,d)=>grotto(T,k,w,d,false)]],
    [['Phật điện dưới chân núi',0,0,7,40,.22,.25],['Động Thánh Hóa',-15.8,-12.6,4.3,11,-.18,.15]]);
  add('osm-way-1020461321','chua-giai-oan','Chùa Giải Oan',heritage+'chua-giai-oan',
    'Nếp chùa nằm phía trên đường hành hương từ suối Giải Oan. Mái ngói thấp và tán cây phủ bóng xuống sân trước.',.28,[0,0],
    [[0,0,.28,10.5,10.9,connectedHalls,'w1020461321'],[-6.7,8.2,0,8.8,8.5,oldTree]],
    [['Từ sân chùa',0,0,5.4,18,.46,.18],['Tán cây bên hiên',-3.5,4.2,6.5,17,-.46,.32]]);
  add('osm-way-1020716548','chua-bao-sai','Chùa Bảo Sái',heritage+'chua-bao-sai',
    'Nếp chùa mái thấp bám sườn Yên Tử. Sau chùa là vách đá của am Ngộ Ngữ Viện, nơi gắn với việc biên tập kinh văn Trúc Lâm.',.39,[0,0],
    [[0,0,.39,12.2,8.1,quietHall,'w1020716548'],[-2.8,-7.5,.36,6.7,3.4,(T,k,w,d)=>grotto(T,k,w,d,false)]],
    [['Chùa trên sườn Yên Tử',0,0,5,19,.86,.18],['Am đá sau chùa',-2.8,-7.5,3.8,8,.93,.16]],summitArrival);
  add('osm-way-1567975867','chua-lan-yen-tu','Chùa Lân – Thiền viện Trúc Lâm Yên Tử','https://dulichso.quangninh.gov.vn/article/kham-pha-quan-the-khu-di-tich-yen-tu-voi-lich-su-lau-doi-344',
    'Trước Đại Hùng Bảo Điện là quả cầu Như Ý đặt trên bệ đá. Nhìn từ sân, các nếp mái nối dài theo trục của thiền viện.',-.97,[7,-13],
    [[0,0,-.97,24.5,14.2,(T,k,w,d)=>hall(T,k,w,d,{base:1.05,h:4.9,tile:0xa76343})],[-12.8,8.5,-.97,6.5,5.3,courtyardLan]],
    [['Đại Hùng Bảo Điện',0,0,8.3,35,-1.08,.24],['Quả cầu Như Ý',-12.8,8.5,2.7,6.5,-.76,.17]]);
  add('osm-way-1567975864','am-chua-ngoa-van','Am – chùa Ngọa Vân',heritage+'am-chua-ngoa-van',
    'Ở tầng chùa trên, am Ngọa Vân nằm cao hơn sân. Tháp Phật Hoàng có hai tầng thân trên bệ vuông, đỉnh tháp thu lại như quả hồ lô.',-.33,[47,-4],
    [[0,0,-.33,4.8,4.0,amNgoaVan],[5.7,5.2,-.33,2.2,2.2,(T,k)=>tower(T,k,2.15,4.6,2)], [11,3,-.33,2.0,2,(T,k)=>tower(T,k,1.9,4.25,2)]],
    [['Am trên sườn Bảo Đài',2.1,1.1,4.8,17,-.26,.24],['Tháp Phật Hoàng',5.7,5.2,4.5,8,.15,.17]]);
  add('osm-way-1567975862','chua-bo-da','Chùa Bổ Đà','https://dulichbacninh.gov.vn/kham-pha/di-tich-lich-su-van-hoa/chua-bo-da-di-tich-lich-su-van-hoa-tieu-bieu-mot-trong-nhung-trung-tam-phat-giao-lon-cua-phai-truc-lam-tam-to-902.html',
    'Lối hẹp giữa hai bờ tường đất dẫn vào khu nội tự. Ngoài nếp chùa là vườn tháp mộ, với những tháp gạch và đá xếp thành hàng.',-.94,[0,0],
    [[0,0,-.94,15.4,7.8,quietHall],[7.6,-7.3,-.94,15.9,7.5,quietHall],[-13.0,9.4,-.97,4.5,15.5,earthWalk],
    [-21.8,-38.2,-.61,21.0,14.8,towerGarden]],
    [['Lối tường đất',-13,9.4,2.7,13,-1.05,.15],['Nội tự Bổ Đà',-.3,0,6,29,-.73,.37],['Vườn tháp',-21.8,-38.2,4.5,25,-.43,.36]]);
})();

export default window.VietnamSights;
