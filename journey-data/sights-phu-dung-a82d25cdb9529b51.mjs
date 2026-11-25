const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Site review 2026-11-22. OSM n2326969092 is in the present precinct on the
  // northern side of Bình San. The street outside is w223820327. The earlier
  // Phù Cừ site on the south-western side and the separate n5382283922 tower
  // are outside this model. Roof footprints: Google Open Buildings v3, CC BY
  // 4.0, https://sites.research.google/gr/open-buildings/ .
  // Temple inventory and photographs: https://chuaphudung.com/gioi-thieu/kien-truc/
  // Both halls and their relative position in a photographed street view:
  // https://www.traveloka.com/vi-vn/explore/destination/gns-3-ngoi-chua-o-ha-tien-noi-tieng/196264
  // Kien Mike's 2022 photographs, Commons page IDs 125662463 and 125662464,
  // Public Domain Mark 1.0: openwork brown screen and rows of woven lanterns with conical
  // shades. Other dates show round lanterns on the same pergola.
  const A=window.CentralArch,sites=window.VietnamSights??=[],catalogId='osm-node-2326969092';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Missing Phù Dung pagoda');
  const id='chua-phu-dung-ha-tien',yaw=2.687,c=Math.cos(yaw),s=Math.sin(yaw);
  const ochre=0xc4a166,sun=0xd0aa69,wood=0x634738,dark=0x483930,rust=0x9f674b;
  const stone=0x97948a,slate=0x777971,white=0xd5d2c1,red=0x925b4c;
  const clay=0xb66b45,pale=0xc3b89f,metal=0x594f42;
  const source='https://chuaphudung.com/gioi-thieu/kien-truc/';
  function round(k,color,x,y,z,r,h){k.stamp(k.round,color,x,y,z,r,h,r);}
  function sweep(T,k,color,pts,r){
    const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(v=>new T.Vector3(...v))),Math.max(5,pts.length*2),r,6,false);
    k.stamp(g,color,0,0,0);g.dispose();
  }
  function roof(T,k,y,z,w,d,h,tint=clay,ornaments=false){
    A.curvedRoof(T,k,0,y,z,w,d,h,tint,pale,pale,.37);
    if(!ornaments)return;
    for(const side of [-1,1]){
      const tip=w*.29,sz=Math.min(1.12,w*.067);
      const pts=[[0,0],[.20,.21],[.38,.59],[.70,.61],[.87,.49],[.93,.26],[1.12,.27],[1.32,.47]];
      sweep(T,k,pale,pts.map(([x,v])=>[side*(tip-x*sz),y+h+.17+v*sz,z]),.083);
      for(const end of [-1,1]){
        const x=side*w*.506;
        k.outline([[-.27,-.13],[.03,0],[.23,.32],[.27,.59],[.40,.66],[.48,.58],[.31,.48],[.37,.25],[.22,.05],[.04,-.09]],
          pale,x,y+.40,z+end*(d*.49),.135,side>0?0:Math.PI);
      }
    }
    const orb=new T.SphereGeometry(1,10,7);k.stamp(orb,pale,0,y+h+.35,z,.21,.24,.18);orb.dispose();
  }
  function woodenDoors(k,w,d){
    k.box(dark,0,1.70,d,w,2.78,.17);
    for(let j=0;j<4;j++){
      const x=(j-1.5)*w*.24;
      k.box(wood,x,.96,d+.083,w*.231,1.36,.07);
      for(const s of [-1,0,1])k.box(wood,x+s*w*.058,2.16,d+.09,.050,.85,.08);
    }
  }
  function oldHall(T,k){
    // The 384 m² footprint encloses the older sanctuary and its rear range.
    // The western building is separate from the long lantern facade next door.
    k.box(stone,0,.24,0,13.25,.48,27.75);
    for(const [z,d,h] of [[6.56,13.76,3.01],[-7.12,13.53,2.94]]){
      k.box(ochre,0,1.98,z-d*.422,12.49,3.0,.29);
      for(const side of [-1,1])k.box(ochre,side*6.12,1.98,z,.34,3.0,d-.66);
      if(z<0){
        k.box(sun,0,1.93,z+d*.42,12.45,2.89,.28);
      }else{
        const face=z+d*.35;
        for(const i of [-1,0,1])k.place(i*2.75,0,0,()=>woodenDoors(k,2.48,face));
        for(const e of [-1,1]){
          k.box(ochre,e*5.02,2.00,face,2.0,3.04,.29);
          k.box(sun,e*4.0,2.00,z+d*.44,.34,3.03,.35);
          k.box(red,e*4.0,1.93,z+d*.44+.181,.145,2.14,.037);
        }
        for(const e of [-1,1])k.box(sun,e*1.37,2.00,z+d*.44,.30,3.03,.32);
        k.box(ochre,0,3.45,z+d*.44,12.69,.30,.38);
        A.plaque(T,k,'PHÙ DUNG CỔ TỰ',0,3.17,z+d*.44+.21,2.93,.44,
          {bg:'#514539',fg:'#d1ac61',border:0x85724f});
      }
      roof(T,k,3.58,z,13.41,d,h,rust,z>0);
    }
  }
  function quanAm(T,k){
    k.box(slate,0,.33,0,1.81,.66,1.66);k.box(white,0,.72,0,1.88,.16,1.76);
    A.statueFigure(T,k,white,0,.79,0,3.65,{robe:true,openHand:true,
      rightArm:[[-.151,.615,.010],[-.136,.685,.096],[-.139,.720,.096]],
      leftArm:[[.137,.651,.020],[.063,.592,.116],[.043,.577,.118]]});
    const mantle=A.carving(T,k,white,0,.79,0,3.65);
    for(const e of [-1,1])mantle.sweep([[e*.017,1.054,-.019,.032,.026],[e*.051,.997,-.024,.020,.041],
      [e*.064,.924,-.024,.018,.045],[e*.083,.842,-.030,.028,.041],[e*.110,.765,-.018,.037,.040],
      [e*.124,.671,.003,.024,.038]],.032,16);
    mantle.sweep([[0,.980,-.012,.042,.043],[0,1.024,-.012,.045,.043],[0,1.066,-.010,.025,.024],[0,1.079,-.010,.011,.015]],.02,20);
    for(const e of [-1,1])mantle.sweep([[e*.124,.694,.009,.012,.013],[e*.108,.555,.054,.013,.013],
      [e*.060,.478,.086,.011,.010],[e*.027,.439,.084,.006,.008]],0,10);
    mantle.finish();
  }
  function lanternRows(T,k){
    const count=34*6,shade=new T.ConeGeometry(.185,.155,12,1,false);
    const lamp=new T.InstancedMesh(shade,new T.MeshStandardMaterial({color:0xc79848,roughness:.91}),count);
    const slats=[];
    function rod(a,b,r){
      const v=new T.Vector3(...b).sub(new T.Vector3(...a)).normalize();
      const side=new T.Vector3().crossVectors(v,Math.abs(v.y)<.9?new T.Vector3(0,1,0):new T.Vector3(1,0,0)).normalize();
      const normal=new T.Vector3().crossVectors(v,side);
      for(let i=0;i<4;i++){
        const make=(p,j)=>{const t=j*Math.PI/2;return p.map((x,k)=>x+r*(side.toArray()[k]*Math.cos(t)+normal.toArray()[k]*Math.sin(t)));};
        const x=make(a,i),y=make(b,i),z=make(a,i+1),w=make(b,i+1);slats.push(...x,...z,...y,...y,...z,...w);
      }
    }
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4,b=(i+1)*Math.PI/4,p=(v,y,r)=>[r*Math.cos(v),y,r*Math.sin(v)];
      rod(p(a,-.058,.103),p(a,-.284,.079),.009);
      for(const [y,r] of [[-.061,.104],[-.128,.098],[-.202,.089],[-.283,.080]])
        rod(p(a,y,r),p(b,y,r),.008);
    }
    rod([0,.073,0],[0,.218,0],.009);
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(slats,3));
    geometry.computeVertexNormals();
    const basket=new T.InstancedMesh(geometry,new T.MeshStandardMaterial({color:0x956e40,roughness:.98,side:T.DoubleSide}),count);
    const pose=new T.Object3D();
    for(let j=0,n=0;j<6;j++){
      const z=-2.95+j*1.12;
      k.box(metal,0,4.18,z,28.36,.059,.059);
      for(let i=0;i<34;i++,n++){
        const x=(i-16.5)*.825,y=3.96+(i%3)*.020+(j%2)*.029;
        pose.position.set(x,y,z);pose.rotation.y=(i*3+j)*.30;pose.updateMatrix();
        lamp.setMatrixAt(n,pose.matrix);basket.setMatrixAt(n,pose.matrix);
      }
    }
    lamp.castShadow=true;basket.receiveShadow=true;k.group.add(lamp,basket);
  }
  function fret(T,k,x,y,z,width,height){
    k.box(wood,x-width*.50,y,z,.10,height,.11);k.box(wood,x+width*.50,y,z,.10,height,.11);
    for(const e of [-1,1])k.box(wood,x,y+e*height*.49,z,width,.10,.11);
    const bottom=y-height/2+.49,top=y+height/2-.05,w=width-.06,h=top-bottom;
    k.box(wood,x,bottom-.22,z,w,.46,.14);
    for(const sign of [-1,1])for(let intercept=-h;intercept<w;intercept+=.31){
      const lo=Math.max(0,intercept),hi=Math.min(w,intercept+h);
      if(hi-lo<.045)continue;
      const xx=(lo+hi)*.50,yy=xx-intercept;
      k.box(wood,x+sign*(xx-w/2),bottom+yy,z,Math.SQRT2*(hi-lo),.042,.075,0,0,sign*Math.PI/4);
    }
  }
  function lanternVeranda(T,k){
    k.box(slate,0,.18,0,28.8,.36,7.75);
    const front=3.38,bays=5,pitch=4.72;
    for(let j=0;j<=bays;j++){
      const x=(j-bays*.5)*pitch;
      k.box(wood,x,.44,front,.48,.18,.52);k.box(wood,x,2.10,front,.34,3.20,.34);
      k.box(wood,x,3.91,front,.29,.67,.31);
      k.box(wood,x,2.02,-3.49,.32,3.23,.31);
      k.box(metal,x,4.21,0,.075,.09,7.61);
    }
    k.box(wood,0,3.56,front,28.64,.29,.32);
    for(let j=0;j<bays;j++){
      const mid=(j-2)*pitch;
      for(const e of [-1,1]){
        const xx=mid+e*(pitch/2-.15);
        k.outline([[0,0],[.67,0],[.79,-.12],[.55,-.20],[.30,-.18],[.32,-.36],[.20,-.43],[.10,-.36],[.12,-.55],[0,-.62]],
          wood,xx,3.44,front-.09,.14,e<0?0:Math.PI);
        tubeScroll(T,k,xx,3.37,front+.08,e<0?1:-1);
      }
    }
    for(const e of [-1,1])fret(T,k,e*13.07,2.03,front,2.02,3.03);
    lanternRows(T,k);
  }
  function tubeScroll(T,k,x,y,z,s){
    sweep(T,k,wood,[[x,y,z],[x+s*.35,y-.11,z],[x+s*.76,y-.07,z],[x+s*.94,y-.17,z],[x+s*1.16,y-.08,z]],.052);
  }
  function pot(T,k,x,z){
    const g=new T.LatheGeometry([[.36,0],[.47,.07],[.36,.19],[.49,.34],[.55,.72],[.50,.75],[.43,.69]]
      .map(([r,h])=>new T.Vector2(r,h)),8);
    k.stamp(g,red,x,0,z);g.dispose();
    const plants=window.createTreeModels(T),shrub=new T.Mesh(plants.geometry('tea',true,1),plants.material);
    shrub.scale.set(1.22,.94,1.28);shrub.position.set(x,.66,z);shrub.castShadow=true;k.group.add(shrub);
  }
  function rearTemple(T,k){
    const bone=0xb7aa8c,earth=0x89634a,inner=0x392f29;
    k.box(slate,0,.25,0,9.76,.50,10.97);
    k.box(inner,0,2.01,-4.44,8.75,3.05,.36);
    k.box(inner,0,1.94,2.43,3.94,3.12,.18);
    for(const e of [-1,1]){
      k.box(wood,e*4.26,2.01,-.91,.23,3.05,7.35);
      k.box(wood,e*3.08,2.02,2.73,2.45,3.03,.21);
      k.box(inner,e*3.08,2.01,2.85,2.09,2.72,.10);
    }
    k.box(earth,0,3.32,4.35,8.49,.35,.37);
    const silk=new T.SphereGeometry(1,12,8);
    for(const x of [-4.11,-1.37,1.37,4.11]){
      round(k,wood,x,1.94,4.36,.15,3.05);
      round(k,bone,x,3.27,4.61,.045,.28);
      k.stamp(silk,0xb07953,x,3.00,4.61,.14,.145,.14);
      round(k,red,x,2.80,4.61,.031,.17);
    }
    silk.dispose();
    const baluster=new T.LatheGeometry([[.084,0],[.093,.055],[.060,.11],[.048,.17],
      [.083,.25],[.113,.32],[.105,.40],[.068,.49],[.061,.56],[.10,.60]].map(([r,y])=>new T.Vector2(r,y)),10);
    for(const e of [-1,1]){
      k.box(bone,e*3.15,.69,4.53,3.08,.31,.24);
      for(let j=0;j<7;j++)k.stamp(baluster,bone,e*(1.82+j*.416),.84,4.53,1,1,1);
      k.box(pale,e*3.15,1.50,4.53,3.03,.15,.28);
      for(const x of [1.63,4.60]){
        k.box(bone,e*x,1.02,4.53,.30,1.17,.32);
        k.box(pale,e*x,1.63,4.53,.36,.12,.38);
      }
    }
    roof(T,k,3.49,0,10.48,11.94,1.83,earth);
    k.box(ochre,0,5.61,-3.13,5.76,2.96,.28);
    for(const e of [-1,1]){
      k.box(ochre,e*2.76,5.61,-.38,.24,2.96,5.5);
      k.box(earth,e*2.05,5.94,2.26,.24,2.28,.28);
      k.box(wood,e*1.60,5.93,.97,1.32,2.11,.15);
    }
    k.box(inner,0,5.77,1.78,4.43,2.21,.17);
    k.box(ochre,0,6.82,2.28,5.53,.64,.32);
    A.plaque(T,k,'殿寶皇玉',0,6.82,2.46,1.83,.41,{bg:'#493b30',fg:'#d3c3a1',border:0x8d7560});
    k.box(pale,0,4.86,3.09,6.38,.18,1.34);
    for(let j=-8;j<=8;j++)k.stamp(baluster,bone,j*.34,4.95,3.58,.83,1.16,.83);
    for(const x of [-3,-1,1,3])k.box(bone,x,5.34,3.58,.16,.84,.19);
    k.box(pale,0,5.72,3.58,6.08,.13,.20);
    roof(T,k,7.14,-.38,6.65,6.24,1.44,earth,true);
    baluster.dispose();
  }
  function build(T,k){
    const f=createTempleFoundations(T,k);
    k.palette({stone:[stone,slate,white],plaster:[ochre,sun],timber:[wood,dark],tile:[clay,rust]});
    const old=f.building(3.16,-3.46,0,13.25,27.75,()=>oldHall(T,k));
    old.elevation=g=>g(3.16,17.37)+1.17;
    const oldFront=f.building(3.16,12.23,0,13.21,4.17,()=>{
      k.box(stone,0,.17,0,13.20,.34,4.19);
      k.place(0,.31,0,()=>quanAm(T,k));
      for(const e of [-1,1])pot(T,k,e*4.98,.40);
    });
    oldFront.elevation=g=>old.elevation(g)-.10;
    f.stairs(oldFront,3.16,14.32,3.16,17.37,12.7,.35,7);
    // Broad main roof and the independently resolved dark pergola strips are
    // separate components on the northern front, parallel to the ridge.
    const newer=f.building(-20.45,-11.1,0,24.65,14.11,()=>{
      k.box(stone,0,.18,0,24.67,.36,14.13);
      k.box(dark,0,2.45,-.66,23.59,4.18,11.67);
      for(let i=0;i<5;i++)k.place((i-2)*4.26,0,0,()=>woodenDoors(k,3.75,5.21));
      roof(T,k,4.68,0,24.99,14.55,3.49,clay);
    });
    newer.elevation=g=>Math.max(g(-20.45,-4.2)+.23,g(-20.45,16.55)+1.24);
    const verandah=f.building(-19.60,3.99,0,28.8,7.75,()=>lanternVeranda(T,k));
    verandah.elevation=g=>Math.max(g(-19.60,3.99)+.39,g(-20,16.55)+1.25);
    const cover=f.building(-20.08,-2.00,0,25.5,4.40,()=>{
      k.box(slate,0,.18,0,25.51,.36,4.41);
      k.box(rust,0,3.93,0,25.60,.18,4.65,0,-.115);
    });
    cover.elevation=verandah.elevation;
    const patio=f.building(-20.0,10.25,0,28.92,4.80,()=>{
      k.box(stone,0,.12,0,28.92,.24,4.82);
      for(const x of [-11.1,-4.25,4.25,11.1])pot(T,k,x,.32);
      const g=new T.IcosahedronGeometry(1,0);
      for(const side of [-1,1])for(let j=0;j<5;j++)for(let i=0;i<12;i++){
        const x=side*7.45+(i-5.5)*.142+(j%2)*.052,z=.93+j*.118;
        k.stamp(g,(i+j)%3?0xb5ab92:0xbbb8a9,x,.255,z,.089,.048,.075,(i+j)*1.34);
      }
      g.dispose();
    });
    patio.elevation=g=>verandah.elevation(g)-.28;
    f.stairs(patio,-20,12.66,-20,16.55,27.24,.24,8);
    const rear=f.building(3.78,-31.26,-.065,9.76,10.97,()=>rearTemple(T,k));
    rear.elevation=g=>Math.max(g(3.60,-26.1)+.35,g(3.16,-19.32)+1.45);
    f.stairs(rear,3.55,-25.75,3.16,-19.32,4.41,.51,11);
    for(const [x,z,h,w] of [[12.22,8.20,8.2,4.6],[12.01,-16.7,8.0,5.6],
      [-2.45,-32.3,8.7,6.5],[10.04,-32.7,8.3,6.0]]){
      let tree;f.fixture(g=>g(x,z),()=>{
        A.trees(T,k,[{x,z,h,width:w,kind:z>0?'pine':'banyan'}]);tree=k.group.children.at(-1);
      },height=>{tree.position.y=height;});
    }
  }
  function view(name,x,z,height,viewRadius,angle,viewElevation){
    return {name,offset:[c*x+s*z,-s*x+c*z],height,viewRadius,viewAngle:yaw+angle,viewElevation};
  }
  sites.push({...pin,id,catalogId,name:'Phù Dung cổ tự',kind:'Chùa',lat:10.388533,lon:104.4827743,yaw,width:56,depth:63,
    source,photo:'https://commons.wikimedia.org/wiki/File:Ph%C3%B9_Dung_C%E1%BB%95_T%E1%BB%B1_-_H%C3%A0_Ti%C3%AAn_(52352816716).jpg',
    start:[104.482885,10.388893],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    arrivalNote:'Xe dừng trên đường Phù Dung ở chân núi Bình San. Từ đường đi bộ vào sân và lên các bậc đá trước điện.',
    description:'Chánh điện cũ có tượng Quan Thế Âm trắng trước sân. Bên cạnh là chánh điện mới với hiên gỗ dài. Giàn hiên được dựng theo ảnh năm 2022 khi treo đèn lồng nan tre, chóp nón lá. Ngọc Hoàng Bửu Điện nằm phía sau chánh điện cũ, cao hơn trên sườn núi.',
    boundary:[[10.7,10.9],[10.6,-18.2],[7,-23.5],[10,-24.7],[10,-37.8],[-1.4,-38.2],[-2.4,-24.7],[.1,-23.7],
      [-3.4,-18.4],[-33.6,-19.4],[-34.2,-2.2],[-36,9.9],[-34.2,16.8],[-5.6,17],[10.1,17.5]],
    gardenRadius:18,reserve:(x,z,r)=>x>-35-r&&x<11+r&&z>-18.5-r&&z<17.5+r||Math.abs(x-3.78)<5.4+r&&z>-38-r&&z<-18+r,
    solids:[[3.16,-3.46,6.1,13.3],[-20.45,-11.1,11.8,6.1],[3.78,-31.26,4.35,4.7]],
    views:[view('Hiên gỗ và giàn đèn nón lá năm 2022',-19.5,4.8,7.30,18.5,.69,.035),
      view('Quan Thế Âm trước chánh điện cũ',3.16,9.51,6.6,17.7,.20,.13),
      {...view('Dưới giàn đèn nhìn ra sân',-20.05,6.12,6.75,5.85,-2.40,-.11),viewBase:'monument'},
      view('Ngọc Hoàng Bửu Điện',3.78,-31.26,8.4,15.9,.055,-.16)],build});
})();

export default window.VietnamSights;
