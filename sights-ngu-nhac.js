'use strict';
(()=>{
  const id='den-trinh-ngu-nhac-huong-son',catalogId='osm-node-2669659389';
  const stop=window.VietnamTourism.byId.get(catalogId),A=window.CentralArch;
  const source='https://dev-huongson.myhanoi.vn/tin-tuc/du-lich-van-hoa--lich-su/den-trinh-ngu-nhac-linh-tu--5300.html';
  const photo='https://files-api.myhanoi.vn/prod-kiosk-be/public/cms/1/2026/01/353439dc546e4a4aa5a6a188d75fb3ba27012026131654600165.jpg';
  // The GPS node is in the outer court, 54 m NE of the worship halls. The
  // local frame is centred on the first hall. Its east-facing transverse
  // ridge and the quay corner were checked on two independent aerial images.
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=105.77356,20.60496&level=18
  // https://www.google.com/maps/@20.60496,105.77356,208m/data=!3m1!1e3
  // The management board documents the 1/2/3-tier sequence; the outer bays,
  // grey end walls and stone elephants also appear in Sơn Nam's 1997 photo.
  // https://chuahuong.org.vn/wp-content/uploads/2021/05/chua-huong-xua-va-nayjpg_Page98_Image1.jpg
  // https://afamily.vn/van-canh-chua-huong-2015012302004073.chn
  // Heights and spacing under the tree canopy are photographic estimates.
  const yaw=100*Math.PI/180,cos=Math.cos(yaw),sin=Math.sin(yaw);
  const clay=0x9e5941,ridge=0x806b5d,lime=0xd2c6ac,wood=0x6d3b2c,red=0x80382c;
  const stone=0xa6a69a,base=.86;
  function frontHall(T,k){
    const w=18.3,d=7.0,wall=3.53;
    k.box(0x9a9388,0,base/2,0,w,base,d);
    k.box(lime,0,base+wall/2,-3.13,w-.14,wall,.43);
    k.box(0x3c3028,0,base+1.51,.68,w-.68,3.02,.18);
    // Three pairs of open leaves, red lacquer jambs and the ventilation grille
    // above them remain visible from the stone offering table.
    for(const x of [-5.05,0,5.05]){
      k.box(0x4a2d22,x,base+2.98,2.47,4.79,.19,.23);
      for(const side of [-1,1]){
        const dx=x+side*1.97;
        k.box(red,dx,base+1.42,2.08,.52,2.83,.22);
        for(const y of [.31,1.01,1.70,2.41]){
          k.box(0xb5804b,dx,y+base,2.202,.44,.040,.025);
        }
        k.place(x+side*1.66,1.63,side*.92,()=>{
          k.box(0x793c29,0,base+1.32,0,.76,2.64,.095);
          for(const y of [.43,1.16,2.03]){
            k.box(0xb1814f,0,base+y,.057,.57,.047,.018);
            k.box(0x915333,0,base+y+.17,.055,.46,.22,.018);
          }
        });
      }
      for(let i=0;i<16;i++)k.box(wood,x+(i-7.5)*.28,base+3.25,2.48,.074,.43,.15);
    }
    for(const x of [-8.48,-7.54,-2.54,2.54,7.54,8.48]){
      k.box(wood,x,base+1.75,2.68,.30,3.5,.35);
    }
    for(const side of [-1,1]){
      const x=side*(w/2-.19);
      k.box(lime,x,base+wall/2,-.11,.38,wall,d-.24);
      k.outline([[-3.45,0],[0,2.23],[3.45,0]],lime,x-.19,base+wall,-.10,.38,Math.PI/2);
      k.box(lime,side*8.64,base+1.63,2.51,.91,3.25,.28);
    }
    const h=2.22;
    A.gabledRoof(T,k,0,base+wall,0,w,d,h,clay,ridge,{alongX:true,overhang:.43,thick:.15});
    for(const side of [-1,1]){
      const x=side*(w/2+.22);
      A.strut(T,k,ridge,x,base+wall+.09,-3.82,x,base+wall+h+.07,0,.115);
      A.strut(T,k,ridge,x,base+wall+h+.07,0,x,base+wall+.09,3.82,.115);
      k.outline([[-.21,0],[.02,.10],[.23,.45],[.24,.66],[.37,.49],[.40,.28],[.28,.04],[.08,-.09]],ridge,
        x,base+wall+h+.05,-.07,.16,side>0?0:Math.PI);
    }
    k.box(red,0,base+3.04,2.92,3.42,1.04,.12);
    k.sign('NGŨ NHẠC LINH TỪ',0,base+3.21,2.985,3.25,.48,true,'#ebc86b');
    k.sign('ĐỀN TRÌNH CHÙA HƯƠNG',0,base+2.80,2.985,2.98,.30,true,'#efd992');
    for(let i=0;i<4;i++)k.box(0x8e8b81,0,.19+.085*i,4.78-.34*i,17.6,.30+.17*i,.43);
    for(const x of [-.98,.98])for(const z of [5.73,6.31])k.tapered(stone,x,.50,z,.17,.14,.70,.95,8);
    k.box(stone,0,.92,6.02,2.66,.24,1.15);
    k.box(0x898d83,0,.73,6.02,2.26,.18,.86);
    k.tapered(0x5c635b,0,1.25,6.01,.27,.34,.39,.90,16);
  }
  function innerHalls(T,k){
    // Photos show tile aprons with upturned hips, a timber grille between
    // the middle tiers, and pale square walls around the innermost lantern.
    k.box(lime,0,2.03,-7.08,13.9,3.54,5.44);
    A.curvedRoof(T,k,0,3.44,-7.08,16.1,7.15,1.67,clay,ridge,ridge,.34);
    k.box(0x44392c,0,4.55,-7.08,11.8,2.48,3.93);
    for(const side of [-1,1])for(let i=0;i<31;i++)
      k.box(0xa78b65,(i-15)*.37,5.27,-7.08+side*2,.095,.81,.11);
    for(const side of [-1,1])for(let i=-5;i<=5;i++)
      k.box(0xa78b65,side*5.92,5.20,-7.08+i*.35,.10,.96,.096);
    A.curvedRoof(T,k,0,5.72,-7.08,13.7,5.5,1.72,clay,ridge,ridge,.34);
    const z=-14.25;
    k.box(lime,0,2.07,z,6.64,3.78,6.66);
    for(const [y,w,roofRise,wallRise,ink] of [[3.84,9.15,1.63,1.45,clay],[6.32,7.51,1.44,1.62,0x8c6856],[8.87,6.22,1.70,0,0x8d8170]]){
      A.curvedRoof(T,k,0,y,z,w,w,roofRise,ink,ridge,0xb8ac92,.19);
      if(wallRise){
        const side=w*.69;
        const top=y+roofRise+wallRise*.74;
        k.box(lime,0,(y+top)/2,z,side,top-y,side);
        for(const x of [-1,1])for(const f of [-1,1])
          k.box(0xac9b87,x*(side/2-.095),y+roofRise+wallRise*.24,z+f*(side/2-.095),.19,wallRise,.19);
      }
    }
    // Four-character panel identified by the monument inventory.
    k.box(0xaaa28d,0,8.30,z+2.62,3.68,.91,.11);
    k.sign('祠 靈 嶽 五',0,8.30,z+2.69,3.53,.68,true,'#4a4539');
  }
  function elephant(T,k,x){
    const ball=new T.SphereGeometry(1,10,7),tint=0xaaa99d;
    const at=(t,dx,y,z,w,h,d,ry=0)=>k.stamp(ball,t,x+dx,y,z,w,h,d,ry);
    k.box(0x99998c,x,.33,8.7,1.24,.32,2.13);
    at(tint,0,1.39,8.53,.48,.51,.83);
    for(const side of [-1,1]){
      for(const z of [8.06,8.93])at(0x96988c,side*.30,.87,z,.18,.47,.19);
      at(0xa4a498,side*.34,1.59,9.03,.14,.35,.29,side*.33);
    }
    at(tint,0,1.62,9.11,.34,.37,.39);
    at(0x9c9f92,0,1.27,9.42,.12,.36,.13);
    at(0x9c9f92,0,.99,9.50,.115,.118,.17);
    for(const side of [-1,1])at(0xc0bdad,side*.17,1.32,9.47,.048,.06,.16);
    ball.dispose();
  }
  function festivalFlag(T,k,x,z){
    for(const [y,w,h] of [[.35,2.54,.43],[.67,1.84,.28],[.88,1.07,.22]])
      k.box(stone,x,y,z,w,h,w);
    k.tapered(0x736959,x,6.05,z,.082,.047,10.3,1,10);
    const w=2.75,h=3.1;
    const cloth=(u,v)=>[x+u*w,10.90-v*h-.24*u,z+.4*Math.sin(u*5.1-v*.57)*u];
    const p=[],cols=[];
    for(let i=0;i<17;i++)for(let j=0;j<17;j++){
      const band=Math.min(i,j,16-i,16-j),t=[0x95422c,0xdaab35,0x567144,0x34746e,0xe1ba49][band]??0xa63f32;
      const c=new T.Color(t);
      for(const [a,b] of [[i,j],[i,j+1],[i+1,j],[i+1,j],[i,j+1],[i+1,j+1]]){
        p.push(...cloth(a/17,b/17));cols.push(c.r,c.g,c.b);
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(cols,3));
    g.computeVertexNormals();const m=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.94});
    const flag=new T.Mesh(g,m);k.group.add(flag);
  }
  // The DEM rises inland within a single footprint. A separate level slab
  // here would leave a wall between the elephants and the offering table.
  // Grade the entire forecourt from the hall floor down to the mapped quay,
  // using the same surface to seat its statuary and flagpole.
  function forecourt(T,k){
    const x0=-13.2,x1=13.2,z0=7.01,z1=39.6,n=20;
    const points=[],uv=[],floor=[],order=[];
    function quad(corners){
      const i=points.length/3;
      for(const [x,z,low=false] of corners){
        points.push(x,0,z);uv.push(x,z);floor.push(low);
      }
      order.push(i,i+1,i+2,i,i+2,i+3);
    }
    const edge=(ax,az,bx,bz)=>quad([[ax,az],[bx,bz],[bx,bz,true],[ax,az,true]]);
    for(let i=0;i<n;i++){
      const a=z0+(z1-z0)*i/n,b=z0+(z1-z0)*(i+1)/n;
      quad([[x0,a],[x0,b],[x1,b],[x1,a]]);
      edge(x0,b,x0,a);edge(x1,a,x1,b);
    }
    edge(x0,z1,x1,z1);
    const g=new T.BufferGeometry();
    const pos=new T.Float32BufferAttribute(points,3);
    g.setAttribute('position',pos);g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(order);
    const mat=new T.MeshStandardMaterial({color:0xc79c82,roughness:.97,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 pavingXZ;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\npavingXZ=uv;');
      s.fragmentShader='varying vec2 pavingXZ;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=pavingXZ/vec2(.72,.53);p.x+=mod(floor(p.y),2.)*.5;
        float grain=fract(sin(dot(floor(p),vec2(14.21,85.37)))*26413.91);
        vec2 seam=min(fract(p),1.-fract(p));vec2 aa=max(fwidth(p),vec2(.001));
        vec2 fill=smoothstep(vec2(.014)-aa*.45,vec2(.014)+aa*.45,seam);
        diffuseColor.rgb*=mix(.72,.91+.13*grain,fill.x*fill.y);
        diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.99,1.08,1.16),step(31.,pavingXZ.y));`);
    };
    const mesh=new T.Mesh(g,mat);mesh.receiveShadow=true;mesh.userData.shoreCover=true;k.group.add(mesh);
    function elevation(ground,start,z){
      const t=Math.max(0,Math.min(1,(z-z0)/(z1-z0)));
      return start+(ground(0,z1)+.12-start)*t;
    }
    let previous=[];
    function fit(ground,start){
      const sample=[start,ground(0,z1),ground(x0,z0),ground(x1,z0),ground(x0,z1),ground(x1,z1)];
      if(sample.every((h,i)=>Math.abs(h-previous[i])<.001))return;
      previous=sample;
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i),z=pos.getZ(i),y=elevation(ground,start,z);
        pos.setY(i,floor[i]?Math.min(y-.10,ground(x,z)-.17):y);
      }
      pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    }
    return {elevation,fit};
  }
  function build(T,k){
    k.palette({tile:clay,plaster:[lime],timber:[wood,red],stone:[stone,0x9a9388,0x8e8b81]});
    const f=createTempleFoundations(T,k);
    const hall=f.building(0,-6.35,0,21.3,26.8,()=>k.place(0,6.35,0,()=>{
      frontHall(T,k);innerHalls(T,k);
    }));
    const court=forecourt(T,k),groundFit=k.group.userData.fitGround;
    f.fixture(g=>court.elevation(g,hall.height+.061,8.7)-.16,()=>{
      for(const side of [-1,1])elephant(T,k,side*5.55);
    });
    let flag;
    f.fixture(g=>court.elevation(g,hall.height+.061,28.6)-.12,()=>{
      festivalFlag(T,k,1.5,28.6);flag=k.group.children[k.group.children.length-1];
    },y=>{flag.position.y=y;});
    const before=k.group.children.length;
    createTreeModels(T).grove(k.group,[
      [-12.7,0,13,5.6,8.1,.5],[16.2,0,9.8,5.5,7.3,2.9],
      [-16.5,0,-10.7,7.7,10.2,1],[-13.3,0,-23.9,6.9,9.2,2.2],[-3.5,0,-27.1,8.4,10.5,3],
      [9.9,0,-26.1,7.4,9.7,.4],[18.7,0,-18.4,6.3,8.5,4]
    ]);
    const groves=k.group.children.slice(before);
    k.group.userData.fitGround=ground=>{
      groundFit(ground);court.fit(ground,hall.height+.061);
      for(const tree of groves){
        const m=tree.instanceMatrix;
        for(let i=0;i<tree.count;i++){
          const ix=16*i+12,x=m.array[ix],z=m.array[ix+2];
          m.array[ix+1]=z>=7&&Math.abs(x)<=13.2?court.elevation(ground,hall.height+.061,z):ground(x,z);
        }
        m.needsUpdate=true;tree.computeBoundingSphere();
      }
    };
  }
  const view=(name,x,z,height,viewRadius,a,viewElevation)=>({name,height,viewRadius,viewAngle:yaw+a,
    viewElevation,viewBase:'monument',offset:[x*cos+z*sin,-x*sin+z*cos]});
  (window.VietnamSights??=[]).push({...stop,id,catalogId,name:'Đền Trình Ngũ Nhạc',locality:'Hương Sơn',lon:105.77356,lat:20.60496,
    source,photo,map:'https://www.openstreetmap.org/node/2669659389',start:stop.start??[105.7877197,20.614076],
    mappedEntrance:true,approachMeters:undefined,visitOnArrival:true,
    arrivalNote:'Gửi xe cạnh Bến xe Hương Sơn ở chợ Đục Khê, đi bộ hoặc đi xe điện tới Bến Yến rồi xuống đò. Đền ở bờ phải suối Yến theo chiều đi vào chùa Hương.',
    description:'Người Yến Vỹ gọi đền là Ngũ Nhạc Linh Từ. Từ sân bến đò, ba tòa lần lượt có một, hai và ba tầng mái. Đền được dựng lại từ năm 1992 đến 1997. Cảnh mô phỏng theo ảnh và mô tả của Ban quản lý, với kích thước và khoảng cách giữa các mái ước lượng.',
    yaw,width:32,depth:62,gardenRadius:29,solids:[[0,0,8.9,3.4],[0,-7.08,7,2.85],[0,-14.25,3.35,3.4]],
    views:[view('Ba lớp mái từ bến đò',0,-1.9,13.4,35,.54,.33),
      view('Biển đền và bàn lễ đá',0,2.75,13.1,17.6,.095,.10),
      view('Cửa chấn song và mái hậu cung',0,-9.15,16.3,26.1,.96,.26)],build});
})();
