'use strict';
(()=>{
  // Six route endpoints in eastern Đồng Nai. Every local frame has +Z as the
  // principal face; positions and footprints follow the OSM ways named per entry.
  const sights=window.VietnamSights??=[];
  const common={province:'Đồng Nai',region:'Nam Bộ'};

  // Plain hipped roof in coloured courses (no upswept eaves).
  function hipRoof(T,k,tints,x,y,z,width,depth,rise,ridge){
    const bands=tints.map(()=>[]),rows=Math.max(4,Math.round(depth*.45));
    for(let side=0;side<4;side++){
      const cols=Math.max(4,Math.ceil((side%2?depth:width)/1.2));
      const point=(u,v)=>{
        const edge=width/2*(1-v)+ridge*v,span=depth/2*(1-v),a=u*2-1;
        const px=side===0?a*edge:side===1?edge:side===2?-a*edge:-edge;
        const pz=side===0?span:side===1?-a*span:side===2?-span:a*span;
        return [px,rise*v,pz];
      };
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
        const u=i/cols,w=(i+1)/cols,v=j/rows,t=(j+1)/rows;
        const a=point(u,v),b=point(w,v),c=point(w,t),d=point(u,t),n=(i*17+j*31+side*11+i*j*7)%15;
        bands[n<7?0:n<12?1:2].push(...a,...b,...c,...a,...c,...d);
      }
    }
    bands.forEach((data,i)=>{
      if(!data.length)return;
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(data,3));geo.computeVertexNormals();
      k.stamp(geo,tints[i],x,y,z);geo.dispose();
    });
    k.box(tints[2],x,y+rise+.06,z,ridge*2+.3,.2,.34);
    for(const f of [-1,1]){
      k.box(tints[2],x,y-.04,z+f*depth/2,width,.14,.14);
      k.box(tints[2],x+f*width/2,y-.04,z,.14,.14,depth);
    }
  }

  // Weathered granite lump: a unit icosphere pushed out of round, faceted.
  function boulder(T,detail){
    const geo=new T.IcosahedronGeometry(1,detail),p=geo.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
      const n=1+.10*Math.sin(x*5.1+y*3.3)+.07*Math.cos(z*6.2-y*4.4)+.05*Math.sin((x+z)*9.1);
      p.setXYZ(i,x*n,y*n,z*n);
    }
    geo.computeVertexNormals();
    return geo;
  }
  function dice(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}

  // ───────────────────────── 1. Nhà thờ Chính tòa Xuân Lộc ─────────────────────────
  // OSM way 659038392: a 55 m nave running WNW–ESE with a round apse at the
  // north-west end. Published size 55 × 18 × 17 m and one 44 m bell tower.
  // Photo: pink walls, salmon piers, orange tile, tower on the façade axis.
  sights.push({...common,
    id:'nha-tho-xuan-loc',name:'Nhà thờ Chính tòa Xuân Lộc',city:'Long Khánh',
    lon:107.243221,lat:10.9318333,start:[107.243339,10.9320558],width:30,depth:84,yaw:1.137,
    map:'https://www.openstreetmap.org/way/659038392',
    source:'https://vi.wikipedia.org/wiki/Nh%C3%A0_th%E1%BB%9D_ch%C3%ADnh_t%C3%B2a_Xu%C3%A2n_L%E1%BB%99c',
    description:'Nhà thờ Chính tòa Chúa Kitô Vua của Giáo phận Xuân Lộc ở Long Khánh, khởi công ngày 2 tháng 2 năm 1963. Thánh đường sơn hồng, mái ngói cam, dài 55 m, rộng 18 m, với một tháp chuông cao 44 m dựng ngay giữa mặt tiền.',
    solids:[[0,0,10,28.5],[0,30.5,4,3]],
    build(T,k){
      const {box,stamp,outline,round,tapered,palette}=k;
      const pink=0xf2c9b8,salmon=0xdc8f68,cream=0xf7e6da,white=0xf6f0e8,base=0xcfa392,tile=0xc9733f,tileDark=0xb2622f,
        terrace=0xb5553f,glass=0x3b4a52,door=0x4a342a,blue=0x2c5d9a,louvre=0xe6d6cb;
      palette({plaster:[pink,salmon,cream,white,louvre],stone:[base,terrace],tile:[tile,tileDark],glass:[glass,blue],timber:[door]});
      const lancet=(x,y,z,w,h,tint,angle=0,t=.1)=>
        outline([[-w/2,0],[w/2,0],[w/2,h*.62],[w*.34,h*.81],[0,h],[-w*.34,h*.81],[-w/2,h*.62]],tint,x,y,z,t,angle);
      const gablet=(x,y,z,w,h,tint,angle=0,t=.25)=>outline([[-w/2,0],[w/2,0],[0,h]],tint,x,y,z,t,angle);
      const floor=.7,eave=11.7;

      // Plinth, tall nave with lean-to aisles, round apse.
      box(base,0,floor/2,0,21.5,floor,58);
      box(pink,0,floor+5.5,4.25,10.4,11,46.5);
      outline([[-6.1,0],[6.1,0],[0,5.6]],tile,0,eave,-19.3,47.0);
      box(tileDark,0,eave+5.65,4.2,.3,.24,47.2);
      gablet(0,eave,-19.5,11,5.3,pink,0,.3);
      stamp(round,pink,0,floor+5,-19,8.5,10,8.5);
      stamp(round,salmon,0,floor+10.1,-19,8.75,.3,8.75);
      tapered(tile,0,floor+10.2+2.7,-19,9.0,.25,5.4,1,16);
      for(let i=-2;i<=2;i++){
        const a=Math.PI+i*.5;
        box(glass,Math.sin(a)*8.5,floor+5,-19+Math.cos(a)*8.5,1.1,3.2,.12,a);
      }
      for(const f of [-1,1]){
        box(pink,f*11.2,floor+3.2,-14.5,4.6,6.4,8);
        box(tile,f*11.4,floor+7.1,-14.5,5.4,.3,8.6,0,0,-f*.32);
        box(glass,f*13.53,floor+3.4,-14.5,.1,2.0,1.2);
        // Aisle, its tile lean-to and the clerestory above.
        box(pink,f*7.1,floor+2.6,4.25,3.8,5.2,46.5);
        box(tile,f*7.35,7.05,4.25,4.7,.25,46.9,0,0,-f*.42);
        box(white,f*9.03,floor+5.05,4.25,.14,.3,46.7);
        for(let i=0;i<9;i++){
          const z=-18.4+i*5.7;
          box(salmon,f*9.1,floor+2.6,z,.42,5.2,.7);
          if(i<8)for(const dz of [1.9,3.8]){
            box(white,f*9.02,floor+3.0,z+dz,.08,2.5,1.25);
            box(glass,f*9.05,floor+3.0,z+dz,.08,2.2,.95);
          }
          if(i<8)for(const dz of [1.5,2.85,4.2])box(glass,f*5.22,9.9,z+dz,.08,1.3,.8);
        }
      }
      // Screen façade: one big gable with raking copings and corner turrets.
      outline([[-9.2,0],[9.2,0],[9.2,7],[0,17.3],[-9.2,7]],pink,0,floor,27.5,.5);
      for(const f of [-1,1]){
        box(salmon,f*4.6,floor+12.2,28.05,13.9,.5,.3,0,0,-f*.842);
        box(salmon,f*9.0,floor+4.4,28.0,1.1,8.8,1.1);
        tapered(pink,f*9.0,floor+9.7,28.0,.8,.08,1.8);
        box(white,f*5.6,floor+1.7,28.02,2.2,3.4,.08);box(door,f*5.6,floor+1.55,28.06,1.7,3.1,.08);
        gablet(f*5.6,floor+3.5,28.0,3.4,1.7,pink,0,1.0);
        for(const dx of [-1.5,1.5])box(salmon,f*5.6+dx,floor+1.75,28.85,.3,3.5,.3);
        box(glass,f*5.6,floor+7.0,28.02,1.0,2.0,.08);
      }
      // Bell tower in three diminishing stages, gablets, spire and cross to 44 m.
      const tz=28.7;
      const stage=(y0,y1,w,pier,tint)=>{
        box(tint,0,(y0+y1)/2,tz,w,y1-y0,w);
        for(const fx of [-1,1])for(const fz of [-1,1])box(salmon,fx*w/2,(y0+y1)/2,tz+fz*w/2,pier,y1-y0,pier);
        box(salmon,0,y1+.2,tz,w+pier+.5,.4,w+pier+.5);
      };
      stage(floor,17,5.2,1.3,pink);stage(17.4,22,4.6,1.1,pink);stage(22.4,30.3,3.8,.9,cream);
      box(white,0,floor+1.9,tz+2.62,2.3,3.8,.08);box(door,0,floor+1.7,tz+2.66,1.8,3.4,.08);
      gablet(0,floor+3.9,tz+2.6,3.9,2.0,pink,0,1.2);
      box(white,0,8.6,tz+2.64,3.9,.55,.08);
      stamp(round,white,0,10.7,tz+2.62,1.05,.1,1.05,0,Math.PI/2);
      stamp(round,blue,0,10.7,tz+2.68,.88,.1,.88,0,Math.PI/2);
      for(const [a,dx,dz] of [[0,0,1],[Math.PI,0,-1],[Math.PI/2,1,0],[-Math.PI/2,-1,0]]){
        const side=dx!==0;
        lancet(dx*2.6,12.6,tz+dz*2.6,1.3,3.4,louvre,a);
        box(louvre,dx*2.31,19.6,tz+dz*2.31,side?.08:1.2,2.6,side?1.2:.08);
        box(louvre,dx*1.91,26.3,tz+dz*1.91,side?.08:1.7,6.6,side?1.7:.08);
        for(const y of [24.2,26.3,28.4])box(salmon,dx*1.95,y,tz+dz*1.95,side?.08:1.7,.14,side?1.7:.08);
        gablet(dx*1.9,30.7,tz+dz*1.9,3.2,2.3,pink,a);
      }
      tapered(pink,0,30.7+6.2,tz,2.3,.1,12.4,1,8);
      box(white,0,43.8,tz,.16,1.9,.16);box(white,0,44.05,tz,.95,.16,.16);
      // Raised red-tiled forecourt and steps towards Hùng Vương.
      box(terrace,0,.35,34.5,24,.7,11);
      for(let i=0;i<3;i++)box(i%2?base:terrace,0,.7*(2.5-i)/3/2+.01,40.2+i*.42,24.6+i*.8,.7*(2.5-i)/3,.46);
    }
  });

  // ───────────────────────── 2. Suối Tre ─────────────────────────
  // OSM ways 728860493 (26.5 × 15.6 m) and 728860492 (10.9 × 24.9 m) on the
  // service loop east of the arrival point. Photos show yellow houses with
  // low red-brown tile roofs; the large one stands on pilotis with dark-red
  // fins carrying a thin canopy over the balcony.
  const vWall=0xe8c44f,vTrim=0xf0e6c8,vStone=0xa39c8e,vRed=0x8e2f2c,vVoid=0x2e2b28,
    vTile=[0x8a4a3a,0x7a4335,0x6b4a3c],vPath=0xb9ae97;
  function stiltVilla(T,k,{w,d}){
    const {box,tapered}=k,lift=3.0,fh=3.3,deck=lift+.3,top=deck+fh,bx=-w*.19,bw=w*.62,set=2.6;
    box(vStone,0,.1,0,w+1,.2,d+1);
    // Pilotis, with one enclosed room under the house.
    for(let i=0;i<=5;i++)for(const z of [-d/2+.3,0,d/2-.3]){
      const x=(i/5-.5)*(w-.6);
      box(z>0&&i%2?vRed:vWall,x,lift/2,z,.45,lift,.45);
    }
    box(vWall,w*.2,lift/2,-d*.2,w*.42,lift,d*.5);
    box(vVoid,w*.2,lift*.55,d*.05+.03,2.4,1.5,.06);
    box(vTrim,0,lift+.15,0,w+.5,.3,d+.5);
    // Upper floor: recessed behind the balcony on the left, full depth on the right.
    box(vWall,bx,deck+fh/2,-set/2,bw,fh,d-set);
    box(vWall,w/2-(w-bw)/2,deck+fh/2,0,w-bw,fh,d);
    box(vRed,bx,deck+.45,d/2-.12,bw,.9,.24);
    for(const x of [-w/2+1.2,bx,bx+bw/2-1.2])tapered(vRed,x,deck+.9+(fh-.9)/2,d/2-.2,.22,.42,fh-.9,2.2);
    box(vTrim,bx,top+.12,d/2-set/2+.5,bw+.6,.14,set+1.6,0,-.07);
    for(const x of [bx-bw/4,bx+bw/4])box(vVoid,x,deck+1.75,d/2-set+.03,2.2,2.3,.06);
    for(const x of [w/2-(w-bw)*.7,w/2-(w-bw)*.28]){
      box(vTrim,x,deck+1.95,d/2+.03,2.5,1.75,.06);box(vVoid,x,deck+1.95,d/2+.06,2.2,1.45,.06);
      box(vTrim,x,deck+3.0,d/2+.4,2.8,.1,.8);
    }
    for(const f of [-1,1])for(const z of [-d/4,d/5]){
      box(vTrim,f*(w/2+.03),deck+1.95,z,.06,1.75,2.3);box(vVoid,f*(w/2+.06),deck+1.95,z,.06,1.45,2.0);
    }
    for(let i=0;i<5;i++)box(vVoid,(i/4-.5)*(w-5),deck+1.95,-d/2-.04,2.0,1.45,.06);
    hipRoof(T,k,vTile,0,top+.05,-set/2+.3,w+1.8,d-set+2.0,2.3,(w-d+set)/2+1);
    // Open concrete stair to the balcony.
    for(let i=0;i<10;i++)box(vStone,-w/2+3.4,deck*(i+1)/10/2,d/2+.5+(9-i)*.36,1.4,deck*(i+1)/10,.36);
  }
  function yellowHouse(T,k,{w,d}){
    const {box}=k,base=.5,wall=3.4,top=base+wall;
    box(vStone,0,base/2,0,w+.8,base,d+.8);
    box(vWall,0,base+wall/2,0,w,wall,d);
    box(vTrim,0,top-.12,0,w+.2,.24,d+.2);
    const bays=2*Math.round(w/8)+1;
    for(let i=0;i<bays;i++){
      const x=((i+.5)/bays-.5)*(w-1.4),mid=i===(bays-1)/2;
      for(const f of [-1,1]){
        if(mid&&f>0){box(vTrim,x,base+1.3,d/2+.03,1.7,2.6,.06);box(vVoid,x,base+1.2,d/2+.06,1.3,2.4,.06);continue;}
        box(vTrim,x,base+1.9,f*(d/2+.03),2.0,1.6,.06);box(vVoid,x,base+1.9,f*(d/2+.06),1.7,1.3,.06);
      }
    }
    hipRoof(T,k,vTile,0,top,0,w+1.8,d+1.8,2.6,Math.max(1,(w-d)/2));
    for(let i=0;i<2;i++)box(vStone,0,base*(1.5-i)/2/2+.01,d/2+.6+i*.36,2.6,base*(1.5-i)/2,.4);
  }
  sights.push({...common,
    id:'suoi-tre',name:'Khu văn hóa Suối Tre',city:'Long Khánh',
    lon:107.2150675,lat:10.9468419,start:[107.2131354,10.9469507],width:50,depth:32,yaw:-.4703,
    map:'https://www.openstreetmap.org/way/728860493',
    source:'https://mia.vn/cam-nang-du-lich/khu-du-lich-suoi-tre-20183',
    description:'Khu văn hóa Suối Tre nằm giữa rừng cao su Long Khánh, vốn là khu nghỉ dưỡng của chủ đồn điền người Pháp. Dưới tán cổ thụ còn những biệt thự tường vàng, mái ngói nâu đỏ đã bỏ hoang, nay do ngành cao su Đồng Nai quản lý.',
    modeledBuildings:['w728860492'],
    solids:[[-9,0,13.6,8.2],[16.8,1.6,5.9,12.8]],
    build(T,k){
      const {box,place,palette}=k;
      palette({plaster:[vWall,vTrim,vRed],stone:[vStone,vPath],glass:[vVoid],tile:vTile});
      place(-9,0,0,()=>stiltVilla(T,k,{w:26.5,d:15.6}));
      place(16.8,1.6,-Math.PI/2,()=>yellowHouse(T,k,{w:24.9,d:10.9}));
      box(vPath,-.4,.05,13.6,19.6,.1,1.6);
      box(vPath,9.6,.05,7.6,1.6,.1,11.6);
    }
  });

  // ───────────────────────── 3. Bến xe Trị An ─────────────────────────
  // OSM bus-station area 974866200 and its three mapped buildings. Photos of
  // the ĐT 767 entrance: two white capped pillars under a blue banner board,
  // white red-roofed houses on the north side, a grey-roofed kiosk row south.
  sights.push({...common,
    id:'ben-xe-tri-an',name:'Bến xe Trị An',city:'Vĩnh An',
    lon:107.033182,lat:11.0851724,start:[107.032944,11.0854166],width:40,depth:44,yaw:-.0734,
    map:'https://www.openstreetmap.org/way/986094110',
    source:'https://vexere.com/vi-VN/ben-xe-tri-an/hinh-anh',
    description:'Bến xe khách của Vĩnh An nằm sát đường tỉnh 767 trên lối ra hồ và thủy điện Trị An. Cổng bến là hai trụ trắng dưới tấm biển xanh, bên trong là dãy nhà tường trắng mái đỏ quanh sân đỗ xe.',
    modeledBuildings:['w986094111','w986094112'],
    solids:[[-4.2,-14,7.9,5.6],[9.25,-14.6,2.6,5.5],[6.4,13.8,4.7,7.5],[12.4,-6.2,.5,.5],[12.4,2.8,.5,.5]],
    build(T,k){
      const {box,stamp,round,place,sign,tapered,palette}=k;
      const wall=0xf1efe8,slab=0xa9a59b,yard=0x7f7d78,red=[0xa5493b,0x98433a,0x8a3d35],grey=0x4b4f52,frame=0x5c6166,
        glass=0x35505c,door=0x3f4a50,lilac=0xb9a6c9,blue=0x1d6fc0,pole=0x2b62a8,stall=0xd9d2c0;
      palette({plaster:[wall,stall,lilac],stone:[slab,yard],tile:red,metal:[grey,frame,blue,pole],glass:[glass,door]});
      box(yard,0,.05,.5,38,.1,41);

      // Main house behind the gate lodge.
      place(-4.2,-14,0,()=>{
        const w=15.7,d=11.1;
        box(slab,0,.15,0,w+1,.3,d+1);
        box(wall,0,.3+1.9,0,w,3.8,d);
        hipRoof(T,k,red,0,4.1,0,w+1.4,d+1.4,2.4,2.6);
        box(door,0,.3+1.2,d/2+.05,1.6,2.4,.08);
        for(const x of [-5.6,-2.8,2.8,5.6]){box(frame,x,.3+2.0,d/2+.04,1.7,1.5,.08);box(glass,x,.3+2.0,d/2+.08,1.5,1.3,.08);}
        for(const x of [-5.6,-1.9,1.9,5.6]){box(frame,x,.3+2.2,-d/2-.04,1.9,1.3,.08);box(glass,x,.3+2.2,-d/2-.08,1.7,1.1,.08);}
        for(const f of [-1,1])box(glass,f*(w/2+.05),.3+2.2,0,.08,1.1,2.4);
      });
      // Gate lodge beside the north pillar.
      place(9.25,-14.6,0,()=>{
        box(slab,0,.15,0,5.8,.3,11.6);
        box(wall,0,.3+1.8,0,5.2,3.6,11);
        hipRoof(T,k,red,0,3.9,0,6.4,12.2,1.7,.3);
        box(glass,.4,.3+2.0,5.54,1.6,1.3,.08);box(lilac,-1.6,.3+1.6,5.54,1.2,1.6,.08);
        box(grey,.2,3.0,6.1,3.6,.08,1.3,0,.2);
        for(const z of [-3.2,0,3.2])box(glass,2.64,.3+2.0,z,.08,1.2,1.5);
      });
      // Kiosk row under a low grey sheet roof, open to the entrance.
      place(6.4,13.8,0,()=>{
        box(slab,0,.15,0,9.9,.3,15.6);
        box(stall,-2.6,.3+1.3,0,4.1,2.6,15);
        box(grey,0,3.05,0,10.6,.1,16.2,0,0,-.06);
        for(const z of [-7.2,-2.4,2.4,7.2])stamp(round,frame,4.4,.3+1.25,z,.06,2.5,.06);
        for(const z of [-4.8,0,4.8])box(stall,2.2,.3+.5,z,1.0,1.0,3.2);
      });
      // Entrance from ĐT 767: pillars, poles and the banner board.
      place(12.4,-1.7,Math.PI/2,()=>{
        for(const f of [-1,1]){
          box(wall,f*4.5,1.6,0,.8,3.2,.8);box(wall,f*4.5,3.28,0,1.0,.16,1.0);
          tapered(wall,f*4.5,3.61,0,.6,.06,.5);
          stamp(round,pole,f*4.9,3.2,-.5,.07,6.4,.07);
        }
        box(blue,0,5.65,-.5,11.2,1.45,.08);
        sign('BẾN XE TRỊ AN',0,5.6,-.44,9.6,1.05,true);
      });
    }
  });

  // ───────────────────────── 4. Cầu Chiến khu D ─────────────────────────
  // OSM way 110872256 (bridge:name "Cầu Chiến khu D", ĐT 767, 251 m). A 2013
  // photo of the approach shows the name on a small blue plate under a round
  // load-limit sign on a red-and-white post, with marker posts along the verge.
  sights.push({...common,
    id:'cau-chien-khu-d',name:'Cầu Chiến khu D',city:'Trị An',
    lon:107.0414384,lat:11.1118625,start:[107.041075,11.1119475],width:4,depth:28,yaw:-1.6084,
    map:'https://www.openstreetmap.org/way/110872256',
    source:'https://vi.wikipedia.org/wiki/V%C4%A9nh_C%E1%BB%ADu_(huy%E1%BB%87n)',
    description:'Cầu trên đường tỉnh 767 dài khoảng 250 m, vượt một nhánh hồ Trị An để đưa xe từ Vĩnh An sang vùng rừng Mã Đà của Chiến khu Đ năm xưa. Tên cầu ghi trên tấm biển xanh nhỏ dưới biển hạn chế tải trọng ở đầu cầu.',
    solids:[[0,0,.3,.3]],
    build(T,k){
      const {box,stamp,round,place,sign,palette}=k;
      const white=0xf1f2ef,red=0xc8322c,blue=0x1f4f93,steel=0x8a8f93,concrete=0xb4b0a6;
      palette({stone:[concrete],metal:[white,red,blue,steel]});
      // Striped post, round sign and name plate, readable from both directions.
      for(let i=0;i<6;i++)stamp(round,i%2?white:red,0,.25+i*.5,0,.05,.5,.05);
      stamp(round,steel,0,3.3,0,.04,.6,.04);
      stamp(round,red,0,3.1,0,.45,.05,.45,0,Math.PI/2);
      box(steel,0,2.3,0,.82,.52,.03);
      for(const f of [1,-1])place(0,0,f>0?0:Math.PI,()=>{
        stamp(round,white,0,3.1,.03,.36,.02,.36,0,Math.PI/2);
        sign('25t',0,3.1,.05,.6,.32,true,'#1c1c1c');
        box(blue,0,2.3,.02,.8,.5,.02);
        sign('CẦU CHIẾN KHU D',0,2.36,.04,.74,.2,true);
      });
      // Verge marker posts with red heads.
      for(let i=-3;i<=3;i++){
        if(!i)continue;
        box(concrete,-1.2,.35,i*4,.16,.7,.16);box(red,-1.2,.78,i*4,.17,.16,.17);
      }
    }
  });


  // ───────────────────────── 6. Suối Mơ ─────────────────────────
  // Park way 1195398460, lake way 486419739. Photos: a wide curtain fall over
  // a dark rock ledge, and a round dark-rimmed pool set in a pale sandy
  // shallow with a small red, white and teal lighthouse beside it.
  sights.push({...common,
    id:'suoi-mo',name:'Công viên Suối Mơ',city:'Tân Phú',
    lon:107.442861,lat:11.2295965,start:[107.44309,11.22928],width:52,depth:58,yaw:0,
    map:'https://www.openstreetmap.org/way/1195398460',
    source:'https://mia.vn/cam-nang-du-lich/mot-ngay-tai-suoi-mo-dong-nai-co-gi-dac-sac-12157',
    description:'Khu du lịch sinh thái ở Trà Cổ rộng khoảng 30 ha với mặt hồ hơn 15 ha, nước từ mạch ngầm trong khe đá núi lửa. Dòng suối đổ thành màn nước qua bậc đá đen xuống bãi tắm cát nông, giữa bãi là hồ tròn viền đá sẫm bên ngọn hải đăng nhỏ.',
    solids:[[0,-19.5,22,6],[14.5,2,1.2,1.2]],
    build(T,k){
      const {box,stamp,round,tapered,palette}=k;
      const rock=[0x4f4d49,0x5d5a54,0x45433f,0x69655c],moss=0x56704a,water=0x4f9d92,shallow=0x9fd0bb,foam=0xe6f1f0,sand=0xdccfa3,
        ring=0x39474a,lRed=0xc93a34,lWhite=0xf3f1ea,lTeal=0x3aa7a0;
      palette({stone:[...rock,moss,sand,ring],glass:[water,shallow,foam],plaster:[lRed,lWhite,lTeal]});
      const big=boulder(T,2),small=boulder(T,1),r=dice(4471);
      // Sandy shallow in front of the fall.
      stamp(round,sand,0,.06,6,21,.12,21);
      stamp(round,shallow,0,.12,5.4,19.6,.2,19.6);
      // Rock ledge with its garden bank behind.
      box(rock[2],0,2.5,-19,43,5,8.4);
      stamp(big,rock[0],-12,0,-22,12,6.6,5.2,.1);
      stamp(big,rock[1],11,0,-22.2,13,6.8,5,-.1);
      stamp(big,moss,0,2,-23.4,20,5.4,3.4,.05);
      box(water,0,5.06,-17.6,41,.1,5.2);
      // The curtain: nine sheets of white water between the lip rocks.
      for(let i=0;i<10;i++){
        const x=-20.2+i*4.5,s=1.1+r()*.6;
        stamp(small,rock[i%4],x,4.9,-15.2,s,s*.8,s*1.1,r()*6);
        stamp(small,rock[(i+2)%4],x+(r()-.5),.5,-13.6,s*1.3,s*.9,s*1.2,r()*6);
        if(i<9){
          box(foam,x+2.25,2.55,-14.5,3.3+r()*.5,4.9,.2,0,.1);
          box(foam,x+2.25,.26,-13.2,3.6,.06,1.6);
        }
      }
      // Round pool: dark tiled rim, deeper water inside.
      stamp(round,ring,0,.28,8,12.4,.5,12.4);
      stamp(round,water,0,.33,8,10.5,.5,10.5);
      // Lighthouse on the rocks at the pool's edge.
      for(let i=0;i<5;i++)stamp(small,rock[i%4],14.5+Math.sin(i*1.3)*1.9,.35,2+Math.cos(i*1.3)*1.9,1.2,.8,1.1,i);
      tapered(lRed,14.5,.6+1.3,2,1.0,.78,2.6,1,12);
      stamp(round,lWhite,14.5,3.45,2,.8,.5,.8);
      tapered(lTeal,14.5,3.7+.9,2,.72,.56,1.8,1,12);
      stamp(round,lWhite,14.5,5.56,2,.85,.12,.85);
      stamp(round,lRed,14.5,6.0,2,.42,.8,.42);
      tapered(lRed,14.5,6.4+.35,2,.6,.04,.7,1,12);
      // Shore rocks round the shallow.
      for(let i=0;i<14;i++){
        const a=.75+i*.36,s=.8+r()*.9;
        stamp(small,rock[i%4],Math.sin(a)*20.4,.25,5.6+Math.cos(a)*20.4,s*1.3,s*.75,s,r()*6);
      }
      big.dispose();small.dispose();
    }
  });
})();
