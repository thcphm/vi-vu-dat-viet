const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(window.VietnamSights??=[]).push({
  id:'lung-cu',name:'Cột cờ Lũng Cú',city:'Lũng Cú',lon:105.316333,lat:23.363457,start:[105.31619,23.36254],
  width:19,depth:19,yaw:-.14,map:'https://www.openstreetmap.org/way/504649258',
  photo:'https://tgroup.vn/tours/tour-ha-giang-kham-pha-quan-ba-dong-van-lung-cu-ngoi-thuyen-tren-song-nho-que-chiem-nguong-hem-vuc-tu-san',
  source:'https://worldmatetravel.com/travel-guide/lung-cu-flag-tower-vietnam%E2%80%99s-northernmost-symbol-of-national-pride',
  build(T,{stamp,box,round,tapered,wavingFlag}){
    const grey=0xb0ac9e,slate=0x746f67,bronze=0x8a6751;
    for(let i=0;i<4;i++)tapered(i%2?grey:slate,0,.26+i*.35,0,10.6-i*.48,10.6-i*.48,.36,1,8);
    tapered(slate,0,2.05,0,8.65,8.15,1.5,1,8);
    tapered(bronze,0,4.65,0,8.12,4.89,3.8,1,8);
    tapered(0x84766b,0,7.28,0,4.96,4.3,1.55,1,8);
    tapered(grey,0,14.88,0,3.48,3.25,13.8,1,8);
    for(const [y,r,h] of [[8.05,3.72,.35],[21.89,3.6,.55],[22.45,4.13,.55],[22.88,4.38,.35]])tapered(slate,0,y,0,r,r,h,1,8);
    for(let side=0;side<8;side++){
      const a=(side+.5)*Math.PI/4,s=Math.sin(a),c=Math.cos(a);
      box(0x706f69,s*3.08,14.9,c*3.08,.65,11.83,.15,a);
      const medallion=new T.TorusGeometry(.75,.092,6,24);
      stamp(medallion,0xc6a98b,s*6.52,4.53,c*6.52,1,1,1,a,-.64);medallion.dispose();
      for(let i=-1;i<=1;i++){
        const t=i*1.04;
        box(grey,s*3.96+c*t,23.42,c*3.96-s*t,.12,1.13,.13,a);
      }
      box(slate,s*3.96,23.98,c*3.96,3.3,.13,.13,a);
    }
    stamp(round,0xa7a498,0,28.4,0,.17,11,.17);
    wavingFlag(9,6,.16,33.84,0);
  }
},{
  id:'thap-doi',name:'Tháp Đôi',city:'Quy Nhơn',lon:109.211083,lat:13.786253,start:[109.210773,13.786349],width:24,depth:13,yaw:Math.PI/2,
  map:'https://www.openstreetmap.org/node/1534828632',photo:'https://benthanhtourist.com/tour/du-lich-quy-nhon-ky-co-eo-gio-bao-tang-quang-trung',
  source:'https://dulichquynhon.binhdinh.gov.vn/en/thapdoiquynhon',
  solids:[[-6.3,0,4.35,4.65],[6,0,4.75,5]],
  build(T,{box,outline,tapered,random}){
    function tower(x,w,h,aged){
      const clay=aged?0x9a5c43:0xa65a3c,trim=0x964a31,dark=0x694635;
      for(let j=0;j<4;j++)box(j%2?trim:clay,x,j*.24+.12,0,w+1.2-j*.24,.25,w+1.3-j*.24);
      box(clay,x,h*.335,0,w,h*.59,w);
      for(let face=0;face<4;face++){
        const a=face*Math.PI/2,s=Math.sin(a),c=Math.cos(a);
        for(const t of [-.43,-.33,.33,.43])box(trim,x+c*w*t+s*w*.5,h*.34,-s*w*t+c*w*.5,w*.065,h*.54,.42,a);
        const z=w*.51,door=w*.23,base=1.02,high=h*.32;
        outline([[-door*.83,0],[-door*.83,high*.77],[0,high*1.39],[door*.83,high*.77],[door*.83,0]],trim,x+s*z,base,c*z,.32,a);
        outline([[-door*.54,0],[-door*.54,high*.68],[0,high*1.07],[door*.54,high*.68],[door*.54,0]],face?dark:0x342d28,x+s*(z+.36),base,c*(z+.36),.09,a);
      }
      for(let tier=0;tier<8;tier++){
        const level=h*(.63+tier*.043),size=w*(1.08-tier*.068);
        box(tier%2?clay:trim,x,level,0,size,h*.046,size);
        for(let j=0;j<5;j++){
          const off=(j-2)*size*.18;
          for(const side of [-1,1]){
            box(j%2===0?dark:clay,x+off,level+h*.017,side*size*.5,size*.095,h*.028,.25);
            box(clay,x+side*size*.5,level+h*.009,off,.26,h*.036,size*.11);
          }
        }
        if(tier===0||tier===2)for(const dx of [-1,1])for(const dz of [-1,1]){
          tapered(0x8e8071,x+dx*size*.48,level+.52,dz*size*.48,.5,.14,1.12,1,6);
          for(const wing of [-1,1])box(0x9a8973,x+dx*size*.48+wing*.34,level+.61,dz*size*.49,.68,.16,.35,0,0,wing*.5);
        }
      }
      for(let i=0;i<34;i++){const ox=(random()-.5)*w*.52,oz=(random()-.5)*w*.52;box(i%3?0x836344:0x646437,x+ox,h*.964+random()*.15,oz,.4+random()*.58,.2+random()*.3,.6,random());}
      for(let j=0;j<7;j++)box(trim,x,.09*(7-j),w*.53+j*.32,w*.26,.18*(7-j),.38);
    }
    tower(-6.3,8.7,18,true);tower(6,9.45,20,false);
  }
},{
  id:'tam-quan-rach-gia',name:'Cổng Tam Quan',city:'Rạch Giá',lon:105.091878,lat:9.997803,start:[105.09217,9.99742],width:21.6,depth:3.1,yaw:.645,
  map:'https://www.openstreetmap.org/node/5563291701',photo:'https://mia.vn/cam-nang-du-lich/du-lich-rach-gia-12808',
  source:'https://dulich.petrotimes.vn/cong-lang-tam-quan-doc-dao-nhat-viet-nam-561919.html',
  solids:[[-10.27,0,.46,1.06],[-4.45,0,.60,1.12],[4.45,0,.60,1.12],[10.27,0,.46,1.06]],
  build(T,{box,profile,outline}){
    function span(x,w,spring,rise,depth){
      const half=w*.40,shape=new T.Shape();
      shape.moveTo(-w/2,0);shape.lineTo(-half,0);shape.lineTo(-half,spring);shape.absellipse(0,spring,half,rise,Math.PI,0,true,0);
      shape.lineTo(half,0);shape.lineTo(w/2,0);shape.lineTo(w/2,spring+.35);
      shape.bezierCurveTo(w/2,spring+rise+.92,w*.29,spring+rise+1.6,0,spring+rise+1.6);
      shape.bezierCurveTo(-w*.29,spring+rise+1.6,-w/2,spring+rise+.92,-w/2,spring+.35);shape.closePath();
      profile(shape,0xd89681,x,0,-depth/2,depth);
      for(const side of [-1,1]){
        const trim=new T.Shape(),a=spring,rad=half+.26;
        trim.moveTo(-rad,0);trim.lineTo(-rad,a);trim.absellipse(0,a,rad,rise+.24,Math.PI,0,true,0);
        trim.lineTo(rad,0);trim.lineTo(half,0);trim.lineTo(half,a);
        trim.absellipse(0,a,half,rise,0,Math.PI,false,0);trim.lineTo(-half,0);trim.closePath();
        profile(trim,0xb75e4e,x,0,side*(depth/2+.015),.035);
      }
      const y=spring+rise+1.32;
      for(let tier=0;tier<2;tier++){
        const roof=w*(.80-tier*.13),d=depth+1.15-tier*.35,level=y+tier*.88;
        box(0xd78f75,x,level+.31,0,roof*.84,.66,d*.73);
        for(const side of [-1,1]){
          box(0xab5340,x,level+.58,side*d*.27,roof,.17,d*.56,0,side*.32);
          for(let i=0;i<Math.round(roof*3);i++)box(0xc17a53,x-roof*.49+i*.33,level+.67,side*d*.27,.072,.095,d*.55,0,side*.32);
          for(const end of [-1,1])outline([[0,0],[end*.51,.11],[end*.74,.58],[end*.61,.03],[end*.22,-.12]],0xa55942,x+end*roof*.48,level+.47,side*d*.46,.11);
        }
        box(0x99523d,x,level+.88,0,roof*.94,.15,.24);
      }
    }
    span(0,9.9,2.25,3.55,2.05);span(-7.52,6.05,1.95,2.1,1.65);span(7.52,6.05,1.95,2.1,1.65);
  }
},{
  id:'duc-ba-hoa-binh-sai-gon',catalogId:'osm-node-2410639584',name:'Tượng Đức Bà Hòa Bình',
  city:'Thành phố Hồ Chí Minh',province:'Hồ Chí Minh',region:'Nam Bộ',kind:'Di tích',
  lon:106.699627,lat:10.779255,start:[106.699792,10.77943],yaw:.786,width:1.74,depth:1.74,
  solids:[[0,0,.82,.82]],gardenRadius:2,visitOnArrival:true,
  map:'https://www.openstreetmap.org/node/2410639584',
  source:'https://tgpsaigon.net/bai-viet/ky-niem-50-nam-cung-hien-vuong-cung-thanh-duong-chanh-toa-duc-ba-sai-gon-43841',
  photo:'https://thanhnien.vn/nha-tho-duc-ba-sai-gon-duoc-dat-ten-tu-buc-tuong-duc-me-hoa-binh-185230409113206155.htm',
  description:'Tượng bằng cẩm thạch trắng cao 4,6 mét, do G. Ciocchetti tạc. Đức Mẹ ngước nhìn lên, hai tay nâng quả địa cầu có thánh giá. Bệ trụ bằng đá hoa cương đỏ nằm trên trục chính của nhà thờ.',
  views:[{name:'Tượng và mặt tiền nhà thờ',height:8.7,viewAngle:.818,viewRadius:12.6,viewElevation:-.070,viewFov:48},
    {name:'Đôi tay nâng quả địa cầu',height:13.95,viewAngle:1.28,viewRadius:3.55,viewElevation:-.08,viewFov:46},
    {name:'Bảng đồng trên trụ đá đỏ',height:3.27,viewAngle:.79,viewRadius:2.37,viewElevation:.025,viewFov:46}],
  build(T,k){
    const marble=0xe2dfd4,granite=0x8e5f53,rim=0x986c5c,bronze=0x667565;
    const pedestal=2.74,sphere=new T.SphereGeometry(1,22,16);
    k.palette({stone:[granite,rim],metal:bronze});
    // The column, bronze collar and little projecting cornice can be seen
    // clearly in the frontal photograph. All figure heights are above the cornice.
    const column=[[.015,.85],[.13,.85],[.19,.80],[.37,.79],[.41,.72],[.50,.69],
      [1.98,.65],[2.06,.69],[2.14,.68],[2.40,.68],[2.45,.73],[2.53,.76],[2.62,.76],[2.69,.65],[pedestal,.62]];
    for(let i=1;i<column.length;i++){
      const [a,r0]=column[i-1],[b,r1]=column[i];
      k.tapered(i===9?bronze:i%3?granite:rim,0,(a+b)/2,0,r0,r1,b-a,1,40);
    }
    for(let i=0;i<32;i++){
      const a=i*Math.PI/16,x=Math.sin(a)*.672,z=Math.cos(a)*.672;
      k.stamp(sphere,0x7b8779,x,2.27,z,.048,.102,.041,a,0,(i%2?1:-1)*.52);
    }
    // The inscription follows the cylindrical granite. Its lettering and four
    // corner fasteners come from Ign christian's photograph of this plaque.
    const plate=new T.PlaneGeometry(.87,.52,24,1),p=plate.attributes.position;
    for(let i=0;i<p.count;i++){
      const a=p.getX(i)/.684;
      p.setXYZ(i,.684*Math.sin(a),p.getY(i)+1.57,.684*Math.cos(a));
    }
    plate.computeVertexNormals();
    const inscription=new T.TextureLoader().load('sight-imagery/duc-ba-minh-van.webp');
    inscription.colorSpace=T.SRGBColorSpace;
    k.group.add(new T.Mesh(plate,new T.MeshStandardMaterial({map:inscription,roughness:.80})));

    // Front and back are different photographs of the same Carrara sculpture.
    // The field outlines use a 480-pixel-wide reference. The archdiocese gives
    // the marble itself, including the carved base under the feet, as 4.6 m.
    const carving={width:480,height:640,origin:[164,543],scale:4.6/376,
      position:[0,pedestal,0],tint:marble};
    CentralArch.photoCarving(T,k,{...carving,photo:'sight-imagery/duc-ba-cam-thach.webp',
      backPhoto:'sight-imagery/duc-ba-khan-choang.webp',crop:[100,160,124,388],forms:[
        {rows:[[167,160,169,.060],[169,155,175,.102],[174,151,179,.157],[183,149,183,.185],
          [198,147,184,.204],[210,144,186,.216],[216,141,189,.235],[222,132,197,.267],
          [230,121,204,.288],[241,117,207,.306],[251,114,212,.328],[263,111,216,.34],
          [273,110,217,.35],[292,111,216,.345],[328,112,215,.33],[378,114,212,.31],
          [425,115,211,.32],[463,117,210,.345],[490,117,210,.38],[502,115,211,.44],
          [514,109,216,.515],[526,108,218,.556],[537,108,218,.57],[543,110,217,.56]]}
      ]});
    // The oblique Delso photograph resolves the space behind the globe and
    // how the hands curve around it. Each sleeve returns to the torso below.
    CentralArch.photoCarving(T,k,{...carving,photo:'sight-imagery/duc-ba-dia-cau.webp',
      crop:[108,199,111,84],forms:[
        {z:.40,rows:[[214,156,162,.046],[217,148,168,.120],[223,143,173,.172],
          [231,140,176,.204],[238,142,174,.178],[245,148,170,.124],[249,154,164,.057]]},
        {z:.41,rows:[[223,144,150,.034,.09],[228,133,153,.075,.10],[234,128,154,.099,.085],
          [241,124,153,.113,.060],[247,122,144,.129,.032],[253,119,138,.14,-.038],
          [260,117,135,.14,-.10],[268,117,131,.13,-.18],[273,119,125,.07,-.19]]},
        {z:.41,rows:[[224,164,170,.036,.09],[228,161,178,.077,.10],[234,160,183,.104,.085],
          [241,163,188,.116,.060],[248,174,190,.135,.032],[254,180,196,.14,-.038],
          [261,183,201,.15,-.10],[269,188,203,.13,-.18],[275,195,199,.07,-.19]]}
      ]});
    const crossX=(157.5-164)*carving.scale,crossBase=pedestal+(543-215)*carving.scale;
    k.box(marble,crossX,crossBase+.068,.409,.038,.14,.042);
    k.box(marble,crossX,crossBase+.083,.409,.123,.034,.042);
    sphere.dispose();
  }
});

export default window.VietnamSights;
