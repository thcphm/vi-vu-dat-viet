'use strict';
(() => {
  const sites=window.VietnamSights??=[];
  const umber=0x87503c, red=0xa76042, orange=0xb57450, dark=0x7d4d3b, lichen=0x998d78;
  const hoaSource='https://dsvh.gov.vn/di-tich-kien-truc-nghe-thuat-va-khao-co-thap-hoa-lai-2994';
  const hoaPhotos='https://vtcnews.vn/net-dac-biet-thap-cham-khien-khanh-hoa-kien-nghi-nan-duong-sat-toc-do-cao-bao-ve-ar1021621.html';
  const periodSource='https://baotanglichsuquocgia.vn/vi/Articles/3091/5417/bao-djong-tu-su-xuong-cap-cua-thap-phu-loc-thu-thien.html';

  // Footprints of the Hòa Lai towers are from OSM. Masonry spans are from the
  // heritage inventory. For node-only sites, compare eastings and northings
  // with the Esri World Imagery basemap and the linked field photographs.
  // Door azimuths use local +Z for the front. Heights below are in metres.
  function register(id,ref,name,province,city,lon,lat,start,yaw,width,depth,details,build){
    sites.push({id,catalogId:'osm-'+ref.replace('/','-'),name,province,city,lon,lat,start,yaw,width,depth,
      kind:'Di tích',region:'Trung Bộ',visitOnArrival:true,map:'https://www.openstreetmap.org/'+ref,
      gardenRadius:Math.min(16,width*.75),...details,build});
  }
  function view(name,height,viewRadius,viewAngle,viewElevation,offset=[0,0],viewFov=53){
    return {name,height,viewRadius,viewAngle,viewElevation,offset,viewFov};
  }
  function local(yaw,x,z){return [x*Math.cos(yaw)+z*Math.sin(yaw),z*Math.cos(yaw)-x*Math.sin(yaw)];}
  function materials(k){k.palette({brick:[umber,red,orange,dark,0xb07753,0x9b6048,0x935d47,0x916247],stone:[lichen,0xb4a58a]});}
  // A chamber behind a real opening. The back wall is visible in the doorway.
  // The arch is a pair of corbelled jambs with the upper courses spanning them.
  function doorway(T,k,width,height,opening,spring,rise,z,depth,color,bottom=0){
    const half=opening/2,w=width/2,s=new T.Shape();
    s.moveTo(-w,0);s.lineTo(-half,0);s.lineTo(-half,spring);
    s.quadraticCurveTo(-half*.98,spring+rise*.35,0,spring+rise);
    s.quadraticCurveTo(half*.98,spring+rise*.35,half,spring);
    s.lineTo(half,0);s.lineTo(w,0);s.lineTo(w,height);s.lineTo(-w,height);s.closePath();
    k.profile(s,color,0,bottom,z,depth);
  }
  function chamber(T,k,w,h,opening,spring,rise,color,bottom=.25,inside=w*.48){
    const t=(w-inside)/2;
    k.box(color,0,bottom+h/2,-(w-t)/2,w,h,t);
    for(const side of [-1,1])k.box(color,side*(w-t)/2,bottom+h/2,0,t,h,inside);
    doorway(T,k,w,h,opening,spring,rise,w/2-t,t,color,bottom);
    // Recesses remain in shadow in the game even on devices that disable
    // directional shadow maps. These inner wall faces retain the chamber depth.
    const shade=0x49392e;
    k.box(shade,0,bottom+h*.48,-inside/2+.035,inside,h*.96,.07);
    for(const side of [-1,1])k.box(0x634735,side*(inside/2-.028),bottom+h*.46,0,.056,h*.92,inside);
    k.box(0x71513c,0,bottom+.017,0,inside,.08,inside);
    k.box(dark,0,bottom-.02,w*.30,opening,.10,w*.42);
  }
  function plinth(k,w,d,h,color=umber){
    k.box(color,0,h*.33,0,w,h*.66,d);
    k.box(red,0,h*.81,0,w-.24,h*.38,d-.24);
  }
  // Extrude an actual pointed or rounded gable, including its opening.
  function portal(T,k,w,spring,rise,opening,innerRise,z,depth,color,open){
    const p=new T.Shape(),r=w/2,o=opening/2;
    p.moveTo(-r,0);p.lineTo(-r,spring);
    p.bezierCurveTo(-r,spring+rise*.32,-r*.39,spring+rise*.85,0,spring+rise);
    p.bezierCurveTo(r*.39,spring+rise*.85,r,spring+rise*.32,r,spring);p.lineTo(r,0);
    if(open){
      p.lineTo(o,0);p.lineTo(o,spring*.91);p.quadraticCurveTo(o*.86,spring+innerRise*.53,0,spring+innerRise);
      p.quadraticCurveTo(-o*.86,spring+innerRise*.53,-o,spring*.91);p.lineTo(-o,0);
    }
    p.closePath();k.profile(p,color,0,0,z,depth);
  }
  function stairs(k,z,count,width,height,run=.31){
    for(let i=0;i<count;i++){
      const h=height*(count-i)/count;k.box(red,0,h/2,z+(i+.5)*run,width,h,run+.018);
    }
  }
  // Low irregular masonry at broken crowns and excavated wall edges.
  function brokenCourse(k,w,d,y,scale,color=red){
    const cols=Math.max(2,Math.round(w/scale)),rows=Math.max(2,Math.round(d/scale));
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
      const x=(i+.5-cols/2)*w/cols,z=(j+.5-rows/2)*d/rows,n=(i*17+j*23+i*j*5)%19;
      if((i===0||j===0||i===cols-1||j===rows-1)&&n<5)continue;
      const h=.11+scale*(.07+n*.026);
      k.box(n%5===2?umber:n%5===3?0x916247:color,x,y+h/2,z,w/cols-.025,h,d/rows-.020);
    }
  }
  function ledge(k,w,d,y,color=red){
    k.box(umber,0,y,0,w+.20,.16,d+.20);
    k.box(color,0,y+.16,0,w+.37,.15,d+.37);
  }
  function wallFaces(k,w,draw){
    for(let side=0;side<4;side++)k.place(0,0,side*Math.PI/2,()=>draw(side,w/2));
  }
  function leaf(k,x,y,z,size,tint,turn=1){
    const sx=u=>u*size*turn;
    k.outline([[sx(-.42),0],[sx(-.23),size*.14],[sx(.04),size*.36],[sx(.17),size*.62],
      [sx(.43),size*.79],[sx(.40),size*.53],[sx(.28),size*.31],[sx(.05),size*.12],[sx(-.25),-size*.05]],
      tint,x,y,z,.068);
  }
  function lotus(k,x,y,z,size){
    const g=k.round;
    for(let j=0;j<8;j++){
      const a=j*Math.PI/4;
      k.stamp(g,orange,x+Math.sin(a)*size*.40,y+Math.cos(a)*size*.40,z,size*.19,.048,size*.19,0,Math.PI/2);
    }
    k.stamp(g,red,x,y,z+.033,size*.21,.061,size*.21,0,Math.PI/2);
  }
  function hoaFacade(T,k,w,h,north,side){
    const z=w/2,main=side===0;
    for(const s of [-1,1])for(const pos of [.29,.447]){
      const x=s*w*pos,strip=w*.085;
      k.box(orange,x,h*.51,z+.10,strip,h-.48,.25);
      k.box(0x9b6048,x,h*.54,z+.24,strip*.48,h-.94,.10);
      k.box(red,x,.98,z+.22,strip*1.45,1.61,.50);
      if(north){
        for(let j=0;j<7;j++)leaf(k,x,1.76+j*(h-2.53)/7,z+.31,.63,orange,j%2?s:-s);
        lotus(k,x,1.81,z+.49,.43);
      } else {
        k.outline([[-.43,0],[-.39,.82],[-.15,1.17],[0,1.53],[.18,1.15],[.38,.78],[.42,0]],
          0xb07753,x,1.08,z+.38,.17);
      }
      k.box(umber,x,h-.42,z+.20,strip*1.23,.23,.39);
    }
    if(main){
      // The eastern porch has its own roof and a continuous passage.
      const nose=north?2.32:2.81,span=north?3.84:4.16;
      k.box(umber,0,.205,z+nose*.5,span+.12,.41,nose+.55);
      portal(T,k,span,2.91,2.79,1.70,1.81,z-.06,nose,red,true);
      portal(T,k,span*.85,2.84,2.57,1.62,1.81,z+nose-.12,.38,orange,true);
      for(const s of [-1,1]){
        k.box(umber,s*span*.37,1.44,z+nose+.24,.27,2.87,.32);
        k.box(orange,s*span*.37,2.73,z+nose+.27,.39,.22,.37);
        k.box(orange,s*span*.37,.29,z+nose+.28,.48,.58,.54);
      }
      // The masonry above the actual doorway is tiered separately from the
      // main sanctuary. Its moulded cheeks step back towards the wall.
      k.box(umber,0,5.44,z+nose*.26,span*.91,.25,nose*.78);
      k.box(orange,0,5.70,z+nose*.23,span*.77,.31,nose*.76);
      k.box(red,0,5.98,z+nose*.18,span*.62,.31,nose*.65);
      stairs(k,z+nose+.25,3,2.60,.36);
    }else{
      for(const [width,sp,rise,dz,color] of [[w*.48,2.44,north?3.33:2.95,.22,umber],
        [w*.38,2.28,north?3.07:2.54,.56,red],[w*.24,2.14,north?2.29:1.89,.83,orange]]){
        portal(T,k,width,sp,rise,0,0,z+dz,.34,color,false);
      }
      if(north){
        for(const s of [-1,1])for(let t=0;t<4;t++)leaf(k,s*(1.35-.22*t),3+.42*t,z+.94,.49,orange,-s);
        lotus(k,0,4.08,z+1.19,.39);
      }
    }
  }
  function hoaTower(T,k,north){
    materials(k);
    const w=north?8.4:9.2,h=north?6.57:6.18;
    plinth(k,w+.88,w+.88,.46);
    chamber(T,k,w,h,1.82,2.86,1.96,north?0x935d47:red,.38,north?4.74:3.78);
    wallFaces(k,w,(side)=>hoaFacade(T,k,w,h,north,side));
    ledge(k,w+.18,w+.18,h+.33);
    const levels=north?[[7.4,3.13],[5.25,2.33],[3.45,1.65]]:[[7.68,2.70],[5.64,1.95],[3.85,1.33]];
    let y=h+.56;
    for(const [span,high] of levels){
      k.box(north?0x935d47:red,0,y+high/2,0,span,high,span);
      wallFaces(k,span,(side,z)=>{
        for(const s of [-1,1])k.box(orange,s*span*.39,y+high*.48,z+.065,span*.105,high*.86,.23);
        k.outline([[-span*.17,0],[-span*.15,high*.27],[0,high*.69],[span*.16,high*.26],[span*.17,0]],
          north?umber:orange,0,y+.18,z+.10,.16);
        if(north&&span>4)for(const x of [-.36,.36])leaf(k,x,y+high*.26,z+.28,.44,orange,x>0?1:-1);
      });
      ledge(k,span,span,y+high-.16,north?0x9b6048:orange);y+=high+.06;
    }
    if(north){
      brokenCourse(k,3.55,3.55,y,.47);
      k.tapered(umber,0,y+.40,0,1.49,1.08,.53,1,8);
      k.tapered(0xb07753,0,y+.70,0,1.08,.95,.13,1,8);
    }else{
      for(let i=0;i<5;i++)k.box(i%2?red:0xb07753,0,y+.085+i*.122,0,3.65-i*.48,.18,3.65-i*.48);
    }
  }
  const northYaw=1.13,southYaw=1.19;
  register('thap-bac-hoa-lai','way/301020996','Tháp Bắc Hòa Lai','Khánh Hòa','Thuận Bắc',109.036135,11.676751,
    [109.036937,11.676658],northYaw,9.8,15.3,{source:hoaSource,photo:hoaPhotos,
      boundary:[[-4.65,-4.65],[4.65,-4.65],[4.65,4.65],[2.12,4.65],[2.12,7.68],[-2.12,7.68],[-2.12,4.65],[-4.65,4.65]],
      solids:[[0,0,4.20,4.20],[0,5.4,1.95,1.22]],
      description:'Thân tháp rộng 8,4 m mỗi cạnh. Những dải lá móc trên cột ốp và hoa tám cánh ở chân cột là phần chạm gạch đặc trưng của tháp Bắc.',
      views:[view('Cửa đông và tầng mái',15.6,32,northYaw+.48,.11),
        view('Dải lá móc ở cột ốp',7.5,6.15,northYaw+.22,.03,local(northYaw,-2.85,4.25),49)]},
    (T,k)=>hoaTower(T,k,true));
  register('thap-nam-hoa-lai','way/295329274','Tháp Nam Hòa Lai','Khánh Hòa','Thuận Bắc',109.035965,11.676127,
    [109.036861,11.676023],southYaw,10.3,17.0,{source:hoaSource,photo:hoaPhotos,
      boundary:[[-5,-5],[5,-5],[5,5],[2.29,5],[2.29,8.33],[-2.29,8.33],[-2.29,5],[-5,5]],
      solids:[[0,0,4.60,4.60],[0,6.0,2.08,1.48]],
      description:'Thân tháp vuông cạnh 9,2 m, có tiền sảnh hướng đông. Một số khối gạch ở chân cột vẫn còn dáng phác, khác những ô khám đã chạm trên tầng mái.',
      views:[view('Tiền sảnh và thân tháp vuông',14.4,30.5,southYaw-.44,.14),
        view('Bậc cửa đông và khối ốp chân cột',6.8,8.2,southYaw+.40,.07,local(southYaw,.9,5.7),56)]},
    (T,k)=>hoaTower(T,k,false));
  function hoaFooting(T,k){
    materials(k);
    // Excavation exposed a square base, its central cavity and the east porch.
    // Show the low exposed masonry and earth, without reconstructing its tower.
    const profile=[[.03,.56],[7.6,.56],[8.8,.54],[10.0,.35],[12,-.16],[13.1,-1.1]];
    const positions=[],indices=[],steps=29;
    for(const [ring,[radius,y]] of profile.entries())for(let j=0;j<=steps;j++){
      const a=j*Math.PI*2/steps,outer=ring/(profile.length-1);
      const r=radius+outer*(Math.sin(a*3+.51)*.6+Math.cos(a*7)*.35);
      positions.push(Math.sin(a)*r,y+outer*Math.sin(5*a)*.07,Math.cos(a)*r*.98);
      if(ring+1<profile.length&&j<steps){
        const i=ring*(steps+1)+j,next=i+steps+1;
        indices.push(i,next,i+1,i+1,next,next+1);
      }
    }
    const mound=new T.BufferGeometry();
    mound.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    mound.setIndex(indices);mound.computeVertexNormals();k.stamp(mound,0x7b7053,0,0,0);
    for(let level=0;level<3;level++){
      const w=12.03-level*.28;
      for(let side=0;side<4;side++)k.place(0,0,Math.PI/2*side,()=>{
        for(let j=0;j<24;j++){
          const n=(j*7+side*11+level*3)%19;
          if((side===0&&j>=10&&j<=13)||n<level*2||(side===3&&j>15&&level))continue;
          const x=(j-11.5)*w/24,z=w/2-.25-.05*(n%4);
          k.box(n%3===0?red:umber,x,.61+level*.077,z,w/24-.013,.08,.39+(n%3)*.055);
        }
      });
    }
    for(const s of [-1,1]){
      for(let i=0;i<19;i++){
        const z=-2.9+i*.32;
        if((i+3*s)%6!==0)k.box(umber,s*3.03,.62,z,.35,.12,.31);
      }
    }
    for(const side of [-1,1])for(let i=0;i<9;i++){
      const z=5.94+i*.32;
      k.box(i%4?umber:red,side*1.46,.54-i*.029,z,.58,.25,.31);
    }
  }
  register('thap-hoa-lai','node/2990412626','Tháp Hòa Lai – nền tháp Giữa','Khánh Hòa','Thuận Bắc',109.036047,11.676446,
    [109.036895,11.676306],1.16,12.4,17.7,{source:'https://baotanglichsu.vn/VI/Articles/3127/4461/khai-quat-di-tich-djen-thap-hoa-lai.html',
      photo:hoaPhotos,solids:[[0,0,6.04,6.04]],
      description:'Giữa hai ngôi tháp đứng là nền vuông khoảng 12 m mỗi cạnh. Khai quật phát hiện hai lớp kiến trúc và dấu tiền sảnh ở phía đông.',
      views:[view('Tháp Bắc, nền Giữa và tháp Nam',12.0,80,1.19,.37,[0,0],55),
        view('Dấu nền và tiền sảnh',1.6,16,1.54,.44,[0,0],54)]},hoaFooting);

  function thuThien(T,k){
    materials(k);
    const w=8.5,wall=8.72;
    plinth(k,9.34,9.34,.49);
    chamber(T,k,w,wall,1.87,3.42,2.18,red,.41,3.26);
    wallFaces(k,w,(side,z)=>{
      for(const s of [-1,1])for(const f of [.43,.27]){
        const x=s*w*f;
        k.box(orange,x,4.57,z+.13,.65,8.10,.30);
        for(const off of [-.24,.24])k.box(umber,x+off,4.70,z+.30,.061,7.82,.06);
        k.box(red,x,.68,z+.24,.79,.57,.49);
      }
      if(side===0){
        // The tall eastern aperture retains a stone lintel under the brick vault.
        for(const s of [-1,1]){
          k.box(umber,s*1.34,1.96,z+.43,.70,3.20,.85);
          k.box(orange,s*1.30,.61,z+.51,.83,.81,1.03);
        }
        k.box(lichen,0,3.65,z+.39,2.81,.34,.91);
        portal(T,k,3.47,3.55,2.66,1.76,1.95,z+.11,.51,red,true);
      }else{
        const west=side===2;
        for(const [ww,sp,rt,ext] of [[3.58,3.77,3.60,.12],[2.70,3.19,3.12,.39],[1.77,2.87,2.31,.64]]){
          portal(T,k,ww,sp,rt,0,0,z+ext,.31,west?orange:red,false);
        }
        k.box(umber,0,1.58,z+.98,.61,2.90,.12);
      }
      k.box(orange,0,8.05,z+.22,w+.01,.22,.53);
      k.box(umber,0,8.45,z+.22,w+.15,.14,.56);
    });
    ledge(k,8.92,8.92,9.08,orange);
    let y=9.35;
    for(const [width,h] of [[6.95,2.49],[4.85,1.95],[2.87,1.28]]){
      k.box(red,0,y+h/2,0,width,h,width);
      wallFaces(k,width,(side,z)=>{
        for(const x of [-width*.40,width*.40])
          k.box(orange,x,y+h*.50,z+.10,.33,h-.10,.21);
        k.outline([[-.77,0],[-.70,h*.39],[0,h*.95],[.67,h*.42],[.74,0]],umber,0,y,z+.12,.24);
      });
      ledge(k,width,width,y+h-.19);
      for(const x of [-1,1])for(const z of [-1,1]){
        const xx=x*width*.45,zz=z*width*.45;
        k.box(umber,xx,y+h*.39,zz,width*.16,h*.61,width*.16);
        k.box(orange,xx,y+h*.76,zz,width*.12,h*.20,width*.12);
      }
      y+=h+.03;
    }
    brokenCourse(k,2.01,2.01,y,.49);
  }
  register('thap-thu-thien','node/4524518294','Tháp Thủ Thiện','Gia Lai','Tây Sơn',108.991288,13.899027,
    [108.991097,13.899038],1.53,9.6,10.6,{source:'https://bvhttdl.gov.vn/binh-dinh-tu-bo-thap-thu-thien-bao-ve-di-san-gan-voi-phuc-vu-du-lich-20250317095243745.htm',
      photo:'https://baodaklak.vn/channel/9803/201811/ve-tham-thu-thien-thap-xua-5607173/',
      description:'Thủ Thiện đứng trên đất bằng ở bờ nam sông Kôn. Thân tháp rộng 8,5 m mỗi cạnh. Nhìn từ mặt tây có thể thấy các lớp cửa giả hình mũi lao giữa những cột ốp để trơn.',
      views:[view('Cửa giả phía tây',15.0,31,-1.09,.12),view('Lanh tô đá của cửa đông',8.1,10.4,1.70,.07,[4,.1])]},thuThien);

  function phuLoc(T,k){
    materials(k);
    const w=9.7,stone=0xb4a58a;
    // The lost front vestibule exposes the broad east opening. Leave its
    // aperture dark right up to the corbel and keep the taller blind doors west.
    chamber(T,k,w,8.66,2.56,3.69,2.08,0x935d47,.16,4.20);
    wallFaces(k,w,(side,z)=>{
      for(const s of [-1,1])for(const f of [.435,.264]){
        const x=s*w*f;
        k.box(umber,x,4.40,z+.115,.84,8.30,.31);
        k.box(0x916247,x,4.7,z+.27,.58,7.59,.10);
        k.box(lichen,x,.45,z+.26,.90,.75,.65);
      }
      if(side===0){
        for(const s of [-1,1]){
          // Ragged vestiges of the two cheeks of the vanished porch.
          k.outline([[-.53,0],[-.52,1.22],[-.28,1.72],[.18,2.10],[.45,1.42],[.57,.22],[.57,0]],
            umber,s*1.96,.08,z+.08,.90);
          k.box(red,s*1.73,.22,z+1.04,.85,.42,1.08);
        }
      }else{
        for(const [span,sp,rise,dz,tint] of [[4.22,2.95,4.10,.12,umber],[3.28,2.82,3.50,.48,0x916247],[2.14,2.64,2.71,.91,red]]){
          portal(T,k,span,sp,rise,0,0,z+dz,.42,tint,false);
        }
        k.box(umber,0,1.44,z+1.37,1.18,2.76,.12);
      }
    });
    const lower=8.81;
    for(let i=0;i<4;i++)k.box(i===1?stone:umber,0,lower+i*.16,0,9.77+i*.14,.17,9.77+i*.14);
    // Interrupted stone bands and the eroded upper stages visible on the hill.
    let y=9.39;
    for(const [width,high] of [[7.65,2.03],[5.57,1.65],[3.53,1.06]]){
      k.box(0x916247,0,y+high*.50,0,width,high,width);
      wallFaces(k,width,(side,z)=>{
        for(let j=-3;j<=3;j++){
          if((j+side+6)%5===1)continue;
          k.box((j+side)%2?lichen:stone,j*width*.137,y+high-.12,z+.06,width*.126,.20,.33);
        }
        const p=width*.25;
        k.outline([[-p*.56,0],[-p*.56,high*.43],[-p*.21,high*.86],[0,high],[p*.31,high*.82],[p*.56,high*.36],[p*.56,0]],
          lichen,0,y+.10,z+.23,.41);
      });
      brokenCourse(k,width,width,y+high-.02,.56,0x916247);
      y+=high+.10;
    }
    brokenCourse(k,2.6,2.7,y,.43,lichen);
  }
  const phuYaw=1.52;
  register('thap-phu-loc','node/4524565893','Tháp Phú Lốc','Gia Lai','An Nhơn',109.089551,13.954624,
    [109.089890,13.953160],phuYaw,10.5,12,{source:periodSource,
      photo:'https://thanhnien.vn/gia-lai-xay-dung-de-an-trung-tu-ngoi-thap-co-gan-900-nam-tuoi-185250829193919151.htm',
      description:'Trên đồi Phú Lốc, cửa đông mở cao vào lòng tháp do phần tiền sảnh đã sụp. Các gờ gạch dọc đưa mắt lên những đoạn diềm đá còn lại trên mái.',
      views:[view('Cửa đông trên đồi Phú Lốc',15,30.3,phuYaw-.32,.06),
        view('Diềm đá và tầng mái đã khuyết',23.6,16.8,-1.12,.13)]},phuLoc);

  function poDam(T,k){
    materials(k);
    const ground=createTempleFoundations(T,k);
    // Only the southwest shrine has the small offset tiered cap. The shrine
    // beside it and the larger northern shrine have low triangular brick roofs.
    function smallShrine(x,z,w,h,cap){
      k.place(x,z,0,()=>{
        plinth(k,w+.57,w+.63,.35);
        chamber(T,k,w,h,1.02,h*.46,h*.33,red,.31,w*.54);
        wallFaces(k,w,(side,face)=>{
          for(const s of [-1,1])k.box(orange,s*w*.412,h*.53,face+.07,.29,h*.92,.21);
          if(side===0){
            portal(T,k,w*.77,h*.48,h*.46,1.03,h*.32,face-.06,.72,orange,true);
            for(const s of [-1,1])k.box(red,s*.69,h*.29,face+.68,.26,h*.57,.23);
          }else{
            k.box(umber,0,h*.49,face+.10,w*.48,h*.70,.18);
            k.box(red,0,h*.49,face+.20,w*.36,h*.60,.08);
          }
        });
        ledge(k,w,w,h+.30,orange);
        if(cap){
          for(const [dy,span,high,offset] of [[.46,w*.80,.60,0],[1.06,w*.63,.49,-.035],[1.54,w*.42,.59,-.13],[2.12,w*.34,.25,-.17]]){
            k.box(red,offset,h+dy+high/2,0,span,high,span);
            k.box(umber,offset,h+dy+high,0,span+.14,.13,span+.14);
          }
        }else{
          const count=12;
          for(let i=0;i<count;i++){
            const span=w*(1-i/count);
            k.box(i%4===0?0xb07753:orange,0,h+.51+i*.103,0,span,.134,span);
          }
        }
      });
    }
    ground.building(-.60,2.59,0,7.99,5,()=>{
      smallShrine(-1.82,.01,3.37,3.92,true);
      smallShrine(1.84,-.01,3.43,3.73,false);
    });
    ground.building(-.46,-2.02,0,3.7,3.48,()=>{
      plinth(k,3.64,3.46,.24);
      for(const s of [-1,1]){
        k.box(umber,s*1.31,1.13,-.15,.68,2.01,2.73);
        k.box(red,0,1.21,-1.31,2.88,2.19,.64);
      }
      for(let i=0;i<5;i++)k.box(red,0,2.32+i*.11,-.32,3.00-i*.37,.14,2.61-i*.34);
    });
    ground.building(2.26,-15.75,0,6.35,7.33,()=>{
      const w=5.78,h=5.02;
      plinth(k,6.18,6.28,.46);
      chamber(T,k,w,h,1.23,2.53,1.30,0x9b6048,.42,2.65);
      wallFaces(k,w,(side,z)=>{
        for(const s of [-1,1]){
          k.box(red,s*w*.382,h*.55,z+.09,.53,h*.84,.25);
          k.box(orange,s*w*.382,.81,z+.18,.69,.74,.42);
        }
        portal(T,k,w*.54,2.58,1.36,1.23,1.02,z+.06,side===0?1.05:.61,red,side===0);
        if(side)k.box(umber,0,1.34,z+.71,.92,2.54,.14);
        for(const s of [-1,1])leaf(k,s*.73,3.12,z+.70,.65,orange,-s);
      });
      ledge(k,w,w,h+.37,orange);
      for(let i=0;i<18;i++){
        const span=w*(1-i/18);
        k.box(i%4?orange:0xb07753,0,h+.63+i*.124,0,span,.14,span);
      }
    });
  }
  register('thap-po-dam','node/357476290','Nhóm tháp Pô Đam','Lâm Đồng','Tuy Phong',108.692121,11.266590,
    [108.694920,11.263051],-.23,13.3,27,{
      source:'https://baotanglichsuquocgia.vn/vi/Articles/3127/17241/gia-tri-khao-co-djac-biet-tai-thap-po-dam.html',
      photo:'https://www.traveloka.com/vi-vn/explore/destination/gns-thap-po-dam/272761',
      solids:[[-2.42,2.6,1.97,2.24],[1.24,2.58,2.01,2.27],[-.46,-2.02,1.85,1.74],[2.26,-15.75,3.18,3.66]],
      description:'Hai đền tháp nhỏ phía nam đứng sát nhau nhưng có dáng mái khác nhau. Xa hơn trên thềm núi Ông Xiêm là tháp trung tâm. Các cửa ở trục này nhìn về nam, hơi chếch tây.',
      views:[view('Hai cửa của nhóm phía nam',7,17.5,-.26,.12,local(-.23,-.48,2.95),51),
        view('Tháp trung tâm sau khi tu bổ',7.8,14.1,.92,.17,local(-.23,2.26,-15.75)),
        view('Các nếp tháp trên thềm núi',9.5,28.5,1.44,.34,local(-.23,0,-6.0))]},poDam);
})();
