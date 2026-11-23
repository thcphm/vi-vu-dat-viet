'use strict';
(() => {
  const A = window.CentralArch;
  const sites = window.VietnamSights ??= [];
  const timber=0x574337, ebony=0x3e3430, patina=0x858174, clay=0x976b53;
  const yellow=0xcda65b, white=0xd3c9ad, granite=0x999589, red=0x9f4837;
  const heritage='https://www.hoianworldheritage.org.vn/vi/news/';
  const museumSource='https://hoianheritage.net/vi/baotang/Gioi-thieu/TONG-QUAN-VE-CAC-BAO-TANG-O-HOI-AN-29.html';

  // The catalog IDs are old town pins. An OSM building enclosing each node
  // sets its actual orientation and dimensions. Keep the adjoining houses in
  // these continuous shopfronts. Heights and woodwork are visual estimates.
  function register(id,ref,way,name,lon,lat,start,yaw,width,depth,details,build){
    const map='https://www.openstreetmap.org/'+ref, halfX=width/2, halfZ=depth/2;
    sites.push({id,catalogId:'osm-'+ref.replace('/','-'),name,lon,lat,start,yaw,width,depth,map,
      city:'Hội An',province:'Đà Nẵng',region:'Trung Bộ',kind:'Di tích',visitOnArrival:true,
      modeledBuildings:['w'+way],boundary:[[-halfX,-halfZ],[halfX,-halfZ],[halfX,halfZ],[-halfX,halfZ]],
      gardenRadius:Math.min(12,halfX+.5),...details,build});
  }
  function camera(name,yaw,x,z,height,r,angle=.04,elevation=.10,fov=61){
    return {name,height,viewAngle:yaw+angle,viewRadius:r,viewElevation:elevation,viewFov:fov,
      offset:[x*Math.cos(yaw)+z*Math.sin(yaw),z*Math.cos(yaw)-x*Math.sin(yaw)]};
  }
  function lantern(T,k,x,y,z,tint=0xa83f2c,size=.28) {
    const shape=[[.054,-.27],[.16,-.20],[.24,-.05],[.24,.09],[.14,.23],[.05,.27]];
    const g=new T.LatheGeometry(shape.map(([r,y])=>new T.Vector2(r,y)),12),s=size/.24;
    k.stamp(g,tint,x,y,z,s,s,s);g.dispose();
    k.box(0xc3934d,x,y-.33*s,z,.041,.17*s,.041);
  }
  function doorEyes(k,x,y,z,gap=.63) {
    for(const s of [-1,1]){
      k.stamp(k.round,0x976846,x+s*gap,y,z,.117,.085,.117,0,Math.PI/2);
      k.stamp(k.round,ebony,x+s*gap,y,z+.05,.061,.05,.061,0,Math.PI/2);
      k.box(red,x+s*gap,y-.145,z+.02,.082,.22,.06,0,0,-s*.13);
    }
  }
  function latticedDoor(k,x,y,z,w,h,wood,open=false){
    k.box(0x342e28,x,y+h/2,z-.12,w,h,.08);
    const count=open?2:4;
    for(let i=0;i<count;i++){
      const bx=x+(open?(i-.5)*w*.87:(i-1.5)*w*.24),bw=w*(open?.095:.231);
      k.box(wood,bx,y+h*.27,z,bw,h*.52,.09);
      for(const side of [-1,1])k.box(wood,bx+side*bw*.44,y+h*.75,z,bw*.11,h*.49,.09);
      for(let j=0;j<5;j++)k.box(wood,bx+(j-2)*bw*.18,y+h*.73,z,.028,h*.40,.057);
      k.box(wood,bx,y+h*.975,z,bw,h*.055,.09);
    }
  }
  function palette(k){k.palette({timber:[ebony,timber],plaster:[yellow,white],tile:[clay,patina],
    brick:0xa27558,stone:granite});}
  function roof(T,k,w,d,h,rise,material=clay,wall=white) {
    const halfDepth=d/2-.13;
    const end=[[-halfDepth,0],[0,rise-.15],[halfDepth,0]];
    for(const x of [-w/2+.09,w/2-.22])k.outline(end,wall,x,h-.06,0,.13,Math.PI/2);
    A.gabledRoof(T,k,0,h,0,w-.22,d-.22,rise,material,patina,{alongX:true,overhang:.12,thick:.17});
  }
  function shopBody(T,k,{w,d,h=3.15,wall=white,wood=ebony,base=.18,roofY=h+.23,roofRise=1.6,tiles=clay}){
    const {box}=k;
    palette(k);k.palette({plaster:wall,timber:wood,tile:tiles},true);
    box(granite,0,base/2,0,w-.08,base,d-.06);
    box(wall,0,(roofY+base)/2,-d*.095,w-.22,roofY-base,d*.77);
    for(const s of [-1,1])box(wall,s*(w/2-.12),(base+roofY)/2,0,.22,roofY-base,d-.12);
    roof(T,k,w,d,roofY,roofRise,tiles,wall);
  }
  function plankShop(T,k,{w,d,wall,roofRise,tiles,sign,timberTone=ebony,blind=false}) {
    const h=3.05,front=d/2-.55,span=w-.65,pitch=span/3;
    shopBody(T,k,{w,d,wall,wood:timberTone,roofY:h+.56,roofRise,tiles});
    k.box(ebony,0,h*.55,front-.47,span,h,.12);
    for(let i=-1;i<=1;i++){
      const x=i*pitch;
      if(i){
        for(let j=0;j<6;j++)k.box(j%2?timberTone:timber,x,.35+j*.29,front-.20,pitch-.10,.274,.095);
        if(!blind)for(let j=0;j<6;j++)k.box(timberTone,x+(j-2.5)*pitch/6,2.45,front-.22,.046,.77,.085);
      } else latticedDoor(k,0,.19,front-.12,pitch-.14,2.45,timberTone,true);
    }
    for(let i=0;i<=3;i++)k.box(timberTone,(i-1.5)*pitch,h*.53,front,.13,h+.04,.16);
    // A separately pitched street awning below the roof, with a ventilated
    // band set back in the shadow between the two clay-tiled eaves.
    k.box(tiles,0,h+.015,front-.28,w-.04,.15,1.75,0,.19);
    k.box(timberTone,0,h+.37,d/2-1.43,w-.42,.51,.14);
    A.plaque(T,k,sign,0,2.70,front+.06,Math.min(1.38,pitch*.90),.30,
      {bg:'#40362d',fg:'#d8b575',border:timberTone});
    doorEyes(k,0,2.42,front-.02,pitch*.30);
  }
  function balconyShop(T,k,{w,d,wood=timber,wall=white,panels=false,stairs=false,roofKind='gable',shopSign}){
    const h=6.25,front=d/2-.28,back=front-1.22,span=w-.53,pitch=span/3;
    shopBody(T,k,{w,d,wall,wood,roofY:h,roofRise:1.47,tiles:0x71604f});
    k.box(wood,0,3.12,front-.50,span,.20,1.36);
    k.box(wood,0,4.10,front,span,.105,.12);
    k.box(wood,0,3.32,front,span,.12,.12);
    k.box(wood,0,5.89,front,w-.26,.24,.24);
    for(let bay=0;bay<3;bay++){
      const bx=(bay-1)*pitch;
      latticedDoor(k,bx,.20,back-.02,pitch-.21,2.52,wood,bay===1);
      latticedDoor(k,bx,3.27,back-.03,pitch-.20,2.39,wood);
      if(panels){
        k.box(wood,bx,3.70,front,pitch-.15,.67,.11);
        k.box(0x786555,bx,3.71,front+.06,pitch-.37,.44,.055);
        k.box(wood,bx,3.71,front+.10,pitch-.53,.32,.05);
      }else for(let j=0;j<7;j++)k.box(wood,bx+(j-3)*pitch*.132,3.70,front,.062,.76,.085);
      lantern(T,k,bx,5.54,front-.05,panels?0x893c33:0xb74632,panels?.19:.22);
    }
    for(let i=0;i<=3;i++){
      const x=(i-1.5)*pitch;
      k.box(wood,x,3.04,front,.17,5.90,.19);
      if(panels){
        // Carved carp-shaped supports below the balcony beam of Phùng Hưng.
        k.outline([[-.35,.23],[.18,.23],[.34,.10],[.29,-.06],[.10,-.10],[-.17,-.05],
          [-.31,-.24],[-.29,-.04],[-.45,.01]],0x786450,x,2.92,front-.05,.13,Math.PI/2);
      }
    }
    if(roofKind==='hip')k.place(0,-d*.14,0,()=>A.curvedRoof(T,k,0,6.55,0,w*.96,d*.58,1.41,0x756451,patina,patina,.22));
    if(stairs)k.box(granite,0,.11,front+.39,span-.26,.22,.55);
    if(shopSign)A.plaque(T,k,shopSign,0,2.82,front+.02,Math.min(3,span*.65),.38,
      {bg:'#453c31',fg:'#d8c09a',border:wood});
  }
  const refPhung=heritage+'Diem-di-tich/Nha-co-Phung-Hung-12.hwh';
  register('nha-co-phung-hung','node/4279640089',631751517,'Nhà cổ Phùng Hưng',
    108.3257541,15.8772592,[108.32597,15.87723],-.130,14.4,16.8,{
      source:refPhung,photo:refPhung,description:'Mặt nhà hai tầng mở ra phố Nguyễn Thị Minh Khai. Lan can gỗ chia ô chạy dọc tầng trên, dưới hiên có các con đỡ chạm hình cá.',
      views:[camera('Ban công phố Nguyễn Thị Minh Khai',-.130,0,8.0,7.6,11.1,.24,.11,68),
        camera('Ô lan can và con đỡ',-.130,-2.0,8.0,7.6,4.7,-.20,.06,59)]},
    (T,k)=>balconyShop(T,k,{w:14.4,d:16.8,wood:0x54453b,panels:true,roofKind:'hip'}));
  const quanYaw=-2.945;
  register('nha-co-quan-thang','node/2076855954',631775875,'Nhà cổ Quân Thắng',
    108.3292924,15.8770746,[108.329276,15.877159],quanYaw,6.6,9.6,{
      source:heritage+'Diem-di-tich/Nha-co-Quan-Thang-651.hwh',
      photo:'https://www.vietfuntravel.com.vn/blog/nha-co-quan-thang.html',
      description:'Nếp nhà ngoài phố có một tầng, hai đầu hồi quét vôi sáng. Bên dưới mái ngói sẫm là bộ cửa gỗ và biển Quân Thắng ở gian giữa.',
      views:[camera('Mặt nhà 77 Trần Phú',quanYaw,0,4.5,4.2,6.9,.18,.09),camera('Biển gỗ dưới mái hiên',quanYaw,0,4.3,5.1,3.6,-.11,.08)]},
    (T,k)=>{plankShop(T,k,{w:6.6,d:9.6,wall:white,roofRise:1.25,tiles:0x806750,sign:'QUÂN THẮNG'});
      for(const x of [-2.16,2.16])lantern(T,k,x,2.38,4.10,0xb84530,.21);});
  const ducYaw=-3.110;
  register('nha-co-duc-an','node/2076855866',632030545,'Nhà cổ Đức An',
    108.3273727,15.8770025,[108.32676,15.87708],ducYaw,5.4,15.8,{
      source:'https://hoianheritage.net/uploads/download/files/ban-tin-1-2020.pdf',
      photo:'https://hoiancreativecity.com/vi/nha-co-duc-an-di-tich-cach-mang-noi-tieng-tai-pho-co',
      description:'Cửa giữa mở vào nhà từng bán sách trên phố Trần Phú. Hai bên cửa là ván xáng, từng tấm gỗ nằm ngang có thể tháo ra để mở hàng.',
      views:[camera('Ba cửa nhà Đức An',ducYaw,0,7.4,4.6,6.6,.13,.12),camera('Mắt cửa và ván xáng',ducYaw,-.53,7.5,4.9,3.75,-.16,.08)]},
    (T,k)=>plankShop(T,k,{w:5.4,d:15.8,wall:yellow,tiles:0x796953,roofRise:1.30,sign:'ĐỨC AN',timberTone:0x725b50,blind:true}));

  const ceramicsYaw=.076;
  register('bao-tang-gom-su-mau-dich','node/2076856032',565297282,'Bảo tàng Gốm sứ Mậu dịch',
    108.3295438,15.8773123,[108.329559,15.877212],ceramicsYaw,6.5,13.9,{
      kind:'Bảo tàng',source:'https://hoianheritage.net/vi/trao-doi-chuyen-nganh/chuyen-de-nghien-cuu-trao-doi/bao-tang-gom-su-mau-dich-hoi-an-883.html',
      photo:'https://hoianheritage.net/vi/trao-doi-chuyen-nganh/chuyen-de-nghien-cuu-trao-doi/bao-tang-gom-su-mau-dich-hoi-an-883.html',
      description:'Ở số 80 Trần Phú, mặt tiền gỗ hai tầng quay về nam. Hàng con song mảnh ở ban công nhìn xuống các bộ cửa gỗ tầng dưới.',
      views:[camera('Nhà 80 Trần Phú',ceramicsYaw,0,6.6,7.0,7.9,-.17,.08,66),camera('Ban công nhà gỗ',ceramicsYaw,0,6.7,8.5,4.3,.20,.06)]},
    (T,k)=>balconyShop(T,k,{w:6.5,d:13.9,wood:0x4f4033,stairs:true}));
  const saYaw=3.080;
  function saHuynh(T,k){
    const w=7.1,d=12.3,front=d*.5-.16,cream=0xd3b77c,shutter=0x41584f;
    shopBody(T,k,{w,d,wall:yellow,roofY:7.1,roofRise:.9,tiles:patina});
    for(const y of [3.47,6.54]){
      k.box(cream,0,y,front-.94,w-.10,.23,1.98);
      k.box(white,0,y+.14,front-.94,w-.04,.095,2.02);
    }
    for(let i=0;i<3;i++){
      const x=(i-1)*2.20;
      latticedDoor(k,x,.20,front-1.35,1.9,2.90,ebony,i===1);
      k.box(shutter,x,4.99,front-1.37,1.59,2.23,.15);
      for(let j=0;j<12;j++)k.box(0x597063,x,4.05+j*.161,front-1.27,1.49,.055,.09,0,-.30);
      for(const side of [-1,1])k.box(white,x+side*.84,5.09,front-1.26,.12,2.46,.12);
    }
    for(let col=0;col<=3;col++){
      const x=(col-1.5)*2.20;
      k.box(cream,x,1.89,front,.25,3.16,.32);
      k.box(white,x,3.25,front,.46,.24,.44);
      k.box(cream,x,3.98,front,.32,.82,.32);
    }
    for(let j=-13;j<=13;j++){
      k.tapered(cream,j*.245,3.84,front,.072,.109,.39,1,9);
      k.tapered(cream,j*.245,4.14,front,.109,.063,.21,1,9);
    }
    k.box(white,0,4.34,front,6.92,.13,.30);
    A.plaque(T,k,'VĂN HÓA SA HUỲNH',0,2.96,front-1.12,2.00,.38,{bg:'#494035',fg:'#d1b88f',border:ebony});
  }
  register('bao-tang-sa-huynh','node/3189923484',631753553,'Bảo tàng Văn hóa Sa Huỳnh',
    108.3264126,15.8769958,[108.32612,15.87711],saYaw,7.1,12.3,{
      kind:'Bảo tàng',source:heritage+'Bao-tang/Bao-tang-van-hoa-Sa-Huynh-229.hwh',
      photo:'https://hoianit.com/tham-quan-bao-tang-van-hoa-sa-huynh-hoi-an/',
      description:'Ngôi nhà hai tầng ở 149 Trần Phú có mặt hiên xây vữa và ban công con tiện. Bên trong trưng bày những di vật khảo cổ của cư dân Sa Huỳnh.',
      views:[camera('Mặt hiên 149 Trần Phú',saYaw,0,5.9,8.0,8.4,-.17,.13,65),camera('Lan can con tiện',saYaw,0,5.9,9.4,4.9,.20,.09)]},saHuynh);

  // w631074714 has two recessed light wells. Build the front and rear houses,
  // their roofed galleries and the broader middle ranges to the surveyed outline.
  const folkYaw=.082,folkBoundary=[
    [-8.6,-24.9],[-8.6,-11.4],[-2.7,-11.4],[-2.7,-4.8],[-8.6,-4.8],[-8.6,9.8],[-.9,9.8],[-.9,13.4],
    [-8.2,13.4],[-8.2,24.9],[1.0,24.9],[1.1,11.0],[8.6,11.0],[8.6,-1.5],[.9,-1.5],[.9,-24.9]];
  function folkHouse(T,k){
    k.place(-3.85,-18.15,Math.PI,()=>balconyShop(T,k,{w:9.5,d:13.5,wood:0x494133,shopSign:'BẢO TÀNG VĂN HÓA DÂN GIAN'}));
    k.place(-3.55,19.15,0,()=>balconyShop(T,k,{w:9.3,d:11.5,wood:0x58473b,wall:yellow}));
    for(const [x,z,w,d,h] of [[-3.85,2.5,9.5,14.6,6.4],[4.75,4.75,7.7,12.5,6.1],
      [-.9,-8.1,3.6,6.6,4.0],[.1,11.6,2.0,3.6,3.7]]){
      k.place(x,z,0,()=>shopBody(T,k,{w,d,h,roofY:h,roofRise:Math.min(1.35,w*.22),wall:0xbda071}));
    }
  }
  register('bao-tang-van-hoa-dan-gian-hoi-an','way/631074714',631074714,'Bảo tàng Văn hóa Dân gian Hội An',
    108.3299088,15.8763687,[108.329946,15.876017],folkYaw,17.2,49.9,{
      kind:'Bảo tàng',boundary:folkBoundary,solids:[[-3.85,-18.15,4.75,6.75],[-3.55,19.15,4.65,5.75],
        [-3.85,2.5,4.75,7.3],[4.75,4.75,3.85,6.25],[-.9,-8.1,1.8,3.3],[.1,11.6,1.,1.8]],
      source:museumSource,photo:'https://www.customvietnamtravel.com/hoi-an-attractions/hoi-an-museum-of-folk-culture',
      description:'Dãy nhà gỗ của bảo tàng nối phố Nguyễn Thái Học với phố Bạch Đằng. Hai mặt nhà đều có ban công; giữa các nếp mái là những khoảng sân lấy sáng.',
      views:[camera('Hiên phố Nguyễn Thái Học',folkYaw,-3.85,-24.35,7.3,5.5,Math.PI+.08,.13,78),
        camera('Mặt nhà phía Bạch Đằng',folkYaw,-3.55,24.5,7.5,12,.21,.13)]},folkHouse);

  function ancestralPorch(T,k,{w,d,base=.34,eave=3.69,wall=yellow,col=timber,roofTone=patina,closed=true,gable=true,masonryPiers=false}){
    const front=d/2-.38,face=front-1.06,pitch=w*.236;
    palette(k);k.palette({timber:col,plaster:wall,tile:roofTone},true);
    k.box(granite,0,base/2,0,w-.18,base,d-.24);
    k.box(wall,0,(base+eave)*.5,-.72,w-.36,eave-base,d-1.98);
    for(const s of [-1,1]){
      k.box(wall,s*(w/2-.21),(base+eave)/2,-.18,.34,eave-base,d-.42);
      k.box(white,s*(w/2-.21),eave-.08,-.17,.41,.23,d-.32);
    }
    for(let i=-1;i<=1;i++)
      latticedDoor(k,i*pitch,base+.04,face+.13,pitch-.17,eave-base-.48,col,!closed||i!==0);
    for(let i=0;i<=3;i++){
      const x=(i-1.5)*pitch;
      if(masonryPiers){
        k.box(granite,x,base+.15,front,.54,.30,.54);
        k.box(wall,x,(base+eave)*.5,front,.39,eave-base,.39);
        k.box(white,x,eave-.36,front,.49,.18,.49);
        k.box(white,x,eave-.17,front,.61,.22,.61);
      } else {
        k.stamp(k.round,granite,x,base+.13,front,.245,.26,.245);
        k.stamp(k.round,col,x,(base+eave)*.5,front,.152,eave-base,.152);
      }
    }
    k.box(col,0,eave-.23,front,w*.85,.36,.27);
    if(gable)roof(T,k,w,d,eave,Math.min(1.95,d*.22),roofTone,wall);
  }
  function tranChapel(T,k){
    ancestralPorch(T,k,{w:16.3,d:7.2,base:.52,eave:3.73,wall:0xd2b16c,col:0x5b4130});
    const stepZ=3.9;
    for(let i=0;i<3;i++)k.box(granite,0,.085+(2-i)*.075,stepZ+i*.30,11.4,.17+(2-i)*.15,.31);
    // Round and floral ventilation motifs at the two side entrances.
    for(const s of [-1,1]){
      const x=s*6.65,z=2.1;
      k.box(0x5f543d,x,2.14,z,1.08,1.08,.10);
      const ring=new T.TorusGeometry(.38,.061,6,20);
      k.stamp(ring,white,x,2.14,z+.073);ring.dispose();
      const petals=s>0?5:4;
      for(let i=0;i<petals;i++){
        const angle=i*Math.PI*2/petals;
        k.stamp(k.round,0xc29f62,x+.145*Math.cos(angle),2.14+.145*Math.sin(angle),z+.11,.087,.042,.087,0,Math.PI/2);
      }
    }
    for(const x of [-4.3,4.3])lantern(T,k,x,3.01,3.00,0xb58859,.25);
  }
  const tranYaw=.029,nguyenYaw=-.317;
  register('nha-tho-toc-tran-hoi-an','node/4582592213',636067247,'Nhà thờ tộc Trần',
    108.3287606,15.8786781,[108.32864,15.87868],tranYaw,16.3,7.2,{
      source:heritage+'Diem-di-tich/Nha-tho-co-toc-Tran-14.hwh',
      photo:heritage+'Du-lich-Hoi-An/ngoi-nha-co-dac-biet-hon-200-nam-tuoi-o-hoi-an-2374.hwh',
      description:'Nhà thờ tộc Trần nằm trong khu vườn ở phố Lê Lợi. Cửa chính giữa dành cho dịp lễ. Hai lối phụ có gạch thông gió với hoa văn khác nhau.',
      views:[camera('Mặt hiên nhà thờ tộc Trần',tranYaw,0,2.7,5.4,15,.12,.18),camera('Ngưỡng cửa nhà thờ',tranYaw,0,2.7,3.5,5.6,-.39,.09)]},tranChapel);
  register('nha-tho-toc-nguyen-tuong','way/210966819',210966819,'Nhà thờ tộc Nguyễn Tường',
    108.3257071,15.8775797,[108.326002,15.877553],nguyenYaw,13.3,14.6,{
      source:'https://hoianheritage.net/uploads/download/nha-tho-toc-nguyen-tuong-cam-pho.pdf',
      photo:'https://redsvn.net/chum-anh-tham-nha-tho-toc-nguyen-tuong-o-hoi-an/',
      description:'Từ sân nhỏ nhìn lên nền đá cao khoảng một mét của Nguyễn Tường từ đường. Dưới mái hiên, ba bộ cửa có phần trên chấn song, phần dưới ghép ván.',
      views:[camera('Ba gian nhìn ra sân',nguyenYaw,0,6.9,6.2,9.1,.20,.14,70),camera('Bậc đá và cửa song',nguyenYaw,-1,6.6,4.3,4.4,-.20,.07)]},
    (T,k)=>{
      ancestralPorch(T,k,{w:13.3,d:14.6,base:1.0,eave:4.44,wall:yellow,col:0x644b35,masonryPiers:true});
      for(let i=0;i<4;i++)k.box(granite,0,(4-i)*.12,7.21+i*.29,6.20,(4-i)*.24,.32);
      for(const x of [-2.22,2.22])lantern(T,k,x,3.56,6.86,0x9f4637,.25);
      A.plaque(T,k,'阮祥堂',0,4.02,5.97,1.68,.43,{bg:'#344948',fg:'#dfbd76',border:timber});
    });
  const quanCongYaw=.068;
  function quanCong(T,k){
    const w=13,d=6.3,front=2.78,gold=0xd7b95f,green=0x466956,cream=0xe2cf9a;
    ancestralPorch(T,k,{w,d,eave:3.88,wall:yellow,col:0x842d25,roofTone:0x788377,gable:false});
    for(const s of [-1,1]){
      const x=s*4.55;
      k.box(0x795942,x,1.83,front,2.62,3.17,.24);
      k.box(cream,x,2.23,front+.13,2.16,1.98,.05);
      k.stamp(k.round,green,x,2.29,front+.17,.88,.14,.88,0,Math.PI/2);
      k.stamp(k.round,0x262f2b,x,2.29,front+.25,.78,.06,.78,0,Math.PI/2);
      for(let j=-3;j<=3;j++){
        const offset=j*.18;
        k.box(green,x+offset,2.29,front+.33,.039,2*Math.sqrt(.73**2-offset**2),.055);
      }
      k.box(gold,x,1.12,front+.18,2.18,.09,.10);
      for(let j=0;j<3;j++){
        const xx=x+(j-1)*.66;
        k.box(cream,xx,.72,front+.18,.58,.63,.07);
        k.box(0x52757d,xx,.72,front+.23,.25,.41,.055,0,0,.48);
      }
      k.stamp(k.round,granite,s*2.42,.48,front,.23,.53,.23);
      k.stamp(k.round,red,s*2.42,2.02,front,.18,2.95,.18);
      lantern(T,k,s*2.80,3.01,2.3,0x91372e,.27);
    }
    doorEyes(k,0,2.99,1.77,.60);
    A.curvedRoof(T,k,0,3.99,0,13,6.3,1.45,0x808a7a,0xc3bc99,white,.36,{dragons:true,goldColor:green});
    const torus=new T.TorusGeometry(.36,.094,7,16);
    k.stamp(torus,white,0,5.86,0);torus.dispose();
    A.plaque(T,k,'關公廟',0,3.39,front+.06,1.96,.46,{bg:'#5d342b',fg:'#d4ba78',border:ebony});
  }
  register('quan-cong-mieu-hoi-an','way/631064893',631064893,'Quan Công Miếu',108.3313895,15.8775404,
    [108.3314,15.877477],quanCongYaw,13,6.3,{
      source:'https://hoianheritage.net/uploads/download/m-01-quan-cong-mieu.pdf',photo:heritage+'Diem-di-tich/Chua-Ong-Hoi-An-96.hwh',
      description:'Trên phố Trần Phú, hai cửa tròn chấn song nhìn ra từ hai bên nếp tiền đường. Hàng cột đỏ nằm dưới mái miếu có bờ nóc trang trí hình rồng.',
      views:[camera('Tiền đường Chùa Ông',quanCongYaw,0,2.6,5.7,9.0,.19,.11,72),camera('Cửa tròn bên hiên',quanCongYaw,4.45,2.7,4.8,4.4,-.26,.07)]},quanCong);
  const camYaw=-.262,camBoundary=[[-12.3,11.5],[-12.3,-11.5],[12.3,-11.5],[12.3,11.2],
    [6.3,11.2],[6.3,2.1],[2.5,2.1],[2.5,7.9],[-2.4,7.9],[-2.4,2.1],[-5.6,2.1],[-5.6,11.5]];
  function camPho(T,k){
    k.place(0,-4.7,0,()=>ancestralPorch(T,k,{w:24.6,d:13.6,eave:4.05,wall:0xcdae64,col:0x704734}));
    for(const [x,w,d] of [[-8.95,6.7,9.4],[9.3,6,9.1]]){
      k.place(x,2.1+d/2,-Math.sign(x)*Math.PI/2,()=>ancestralPorch(T,k,{w:d,d:w,eave:2.83,
        roofTone:0x8d6a53,wall:0xb79b67,closed:false}));
    }
    const z=4.95;
    k.box(granite,0,.23,z,4.95,.46,5.8);
    for(const x of [-1.96,1.96])for(const dz of [-2.1,2.1])
      k.stamp(k.round,0x684d3a,x,1.96,z+dz,.19,3.18,.19);
    A.curvedRoof(T,k,0,3.58,z,5.5,6.18,1.29,0x80694f,white,patina,.19,{dragons:true,goldColor:white});
    k.box(0x6e745d,0,4.64,z,3.24,.75,3.52);
    A.curvedRoof(T,k,0,5.05,z,4.08,4.30,.98,0x787356,white,patina,.18,{dragons:true,goldColor:white});
  }
  register('dinh-cam-pho','way/565186618',565186618,'Đình Cẩm Phô',108.3241832,15.8782924,
    [108.324186,15.878521],camYaw,24.6,23.1,{
      boundary:camBoundary,solids:[[0,-4.7,12.3,6.8],[-8.95,6.8,3.35,4.7],[9.3,6.65,3,4.55]],
      source:'https://hoianheritage.net/vi/trao-doi-chuyen-nganh/chuyen-de-nghien-cuu-trao-doi/tong-quan-ve-dinh-lang-o-hoi-an-589.html',
      photo:'https://bazantravel.com/dinh-cam-pho-dinh-lang-co-giua-long-do-thi-hoi-an/',
      description:'Giữa hai nhà bên sân là phương đình bốn mái có cổ diêm. Sau phương đình mới đến hàng hiên của chính điện.',
      views:[camera('Hai nhà bên sân và phương đình',camYaw,0,3,8.2,23,.17,.28),camera('Mái phương đình',camYaw,0,4.9,9.1,8.0,-.40,.15)]},camPho);
  const tuyYaw=.235;
  register('tuy-tien-duong-minh-huong','node/2092582318',631775132,'Tụy Tiên Đường Minh Hương',108.3316882,15.8778212,
    [108.331738,15.877529],tuyYaw,25.4,25.1,{
      modeledBuildings:['w631775132','w631060899','w631740247','w631775125','w631775133'],
      boundary:[[-12.25,-8.92],[12.78,-8.92],[12.78,16.26],[-12.25,16.26]],
      solids:[[0,0,5.8,4.5],[.12,11.37,5.35,4.65],[.14,-6.92,5.8,2],[-9.08,1.73,2.6,10.45],[9.42,5.08,3.2,8.1]],
      source:'https://hoianheritage.net/uploads/download/tuy-tien-duong-minh-huong.pdf',
      photo:heritage+'Diem-di-tich/Tuy-Tien-Duong-Minh-Huong-227.hwh',
      description:'Trước hiên đình Minh Hương, tấm hoành phi nền sẫm nổi trên bộ khung gỗ. Hai bên sân còn các nếp nhà quay mặt vào trục thờ.',
      views:[camera('Tiền sảnh nhìn từ sân trước',tuyYaw,.12,15.52,5.7,10.2,.14,.12,70),camera('Hoành phi Tụy Tiên Đường',tuyYaw,.12,15.31,7.0,5,.19,.07)]},
    (T,k)=>{
      ancestralPorch(T,k,{w:11.6,d:9.0,wall:white,col:0x613d30,eave:4.12});
      k.place(.14,-6.92,.007,()=>ancestralPorch(T,k,{w:11.6,d:4,eave:3.34,roofTone:0x88735c}));
      for(const [x,z,yaw,w,d] of [[-9.08,1.73,1.52,20.9,5.2],[9.42,5.08,-1.62,16.2,6.4]]){
        k.place(x,z,yaw,()=>ancestralPorch(T,k,{w,d,eave:3.0,wall:0xc9b483,closed:false,roofTone:0x8e765e}));
      }
      k.place(.12,11.37,-.037,()=>{
        ancestralPorch(T,k,{w:10.7,d:9.3,wall:white,col:0x613d30,eave:4.12,closed:false,gable:false});
        for(const x of [-3.8,-1.4,1.4,3.8])lantern(T,k,x,3.42,3.35,0xcb9866,.19);
        A.plaque(T,k,'明鄉萃先堂',0,3.52,3.54,2.95,.58,{bg:'#513829',fg:'#e2c17a',border:timber});
        A.curvedRoof(T,k,0,4.15,0,10.7,9.3,1.58,0x9b7b5b,white,patina,.34,{dragons:true,goldColor:white});
      });
    });
})();
