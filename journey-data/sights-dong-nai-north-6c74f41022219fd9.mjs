const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  // Six landmarks in the former Bình Phước area. In every model local +Z is the
  // principal face; footprints and axes follow the OpenStreetMap ways named in
  // each entry's `map`, measured in metres.
  const white=0xf1f1ec,lampPole=0x6f7477,globe=0xf6f3e6,leaf=0x4f7d3a,trunk=0x8a7a63;

  // Tile courses with the eave lifting towards each hip (set lift to 0 for a plain hip roof).
  function tileRoof(T,k,tints,trim,x,y,z,width,depth,rise,lift=.75){
    const bands=tints.map(()=>[]),rows=Math.max(5,Math.round(depth*.6)),ridge=width/2-Math.min(depth*.34,width*.25);
    for(let side=0;side<4;side++){
      const cols=Math.max(5,Math.ceil((side%2?depth:width)/.9));
      const point=(u,v)=>{
        const edge=width/2*(1-v)+ridge*v,span=depth/2*(1-v),a=u*2-1;
        const px=side===0?a*edge:side===1?edge:side===2?-a*edge:-edge;
        const pz=side===0?span:side===1?-a*span:side===2?-span:a*span;
        return [px,rise*(.53*v+.47*v*v)+Math.pow(Math.abs(a),5)*(1-v)**3*lift,pz];
      };
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
        const u=i/cols,w=(i+1)/cols,v=j/rows,t=(j+1)/rows;
        const a=point(u,v),b=point(w,v),c=point(w,t),d=point(u,t),n=(i*17+j*31+side*11+i*j*7)%15;
        bands[n<7?0:n<12?1:2].push(...a,...b,...c,...a,...c,...d);
      }
    }
    bands.forEach((data,i)=>{
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(data,3));geo.computeVertexNormals();
      k.stamp(geo,tints[i],x,y,z);geo.dispose();
    });
    k.box(trim,x,y+rise+.14,z,ridge*2+.3,.34,.42);
    for(const f of [-1,1]){
      k.box(tints[2],x,y-.05,z+f*depth/2,width,.16,.16);
      k.box(tints[2],x+f*width/2,y-.05,z,.16,.16,depth);
      if(lift)k.outline([[0,0],[f*.5,.1],[f*1.0,.9],[f*1.05,1.2],[f*.7,1.0],[f*.56,.56],[f*.2,.36],[0,.34]],trim,x+ridge*f,y+rise+.14,z-.14,.28);
    }
  }
  function lamp(k,x,z,h=4.2,globes=1){
    k.stamp(k.round,lampPole,x,h/2,z,.07,h,.07);
    if(globes===1)k.stamp(k.round,globe,x,h+.2,z,.24,.42,.24);
    else for(let i=0;i<globes;i++){
      const a=i*Math.PI*2/globes;
      k.stamp(k.round,globe,x+Math.cos(a)*.42,h-.1,z+Math.sin(a)*.42,.2,.36,.2);
    }
  }
  function bench(k,x,z,ry=0,tint=white){
    k.box(tint,x,.45,z,1.8,.1,.5,ry);k.box(tint,x,.22,z,1.5,.44,.3,ry);
  }
  function flagpole(k,x,z,h,tint){
    k.stamp(k.round,0xcfd2d2,x,h/2,z,.05,h,.05);
    if(tint!==undefined)k.box(tint,x+.5,h-.4,z,.95,.62,.03);
  }

  // Many trees baked into two stamps: `list` holds [x,z,height,crownRadius].
  // Broadleaf crowns are tall double cones; palm crowns are flat and wide.
  function trees(T,k,list,crownTint,palmCrown=false){
    const crown=[],stem=[];
    list.forEach(([x,z,h,r],n)=>{
      const top=h+(palmCrown?r*.45:r*1.5),mid=palmCrown?h+r*.12:h+r*.35,low=palmCrown?h-r*.25:h-r*.9,turn=n*.7;
      for(let i=0;i<6;i++){
        const a=turn+i*Math.PI/3,b=a+Math.PI/3;
        const p=[x+Math.cos(a)*r,mid,z+Math.sin(a)*r],q=[x+Math.cos(b)*r,mid,z+Math.sin(b)*r];
        crown.push(...p,x,top,z,...q,...p,...q,x,low,z);
      }
      for(let i=0;i<4;i++){
        const a=turn+i*Math.PI/2,b=a+Math.PI/2,t=palmCrown?.2:.26;
        const p=[x+Math.cos(a)*t,z+Math.sin(a)*t],q=[x+Math.cos(b)*t,z+Math.sin(b)*t];
        stem.push(p[0],-1.5,p[1],p[0],mid,p[1],q[0],-1.5,q[1],q[0],-1.5,q[1],p[0],mid,p[1],q[0],mid,q[1]);
      }
    });
    for(const [data,tint] of [[crown,crownTint],[stem,trunk]]){
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(data,3));geo.computeVertexNormals();
      k.stamp(geo,tint,0,0,0);geo.dispose();
    }
  }

  const sights=[];

  // 1. Chợ Đồng Xoài — main hall, OSM way 308426605 (51.5 m × 22.6 m).
  sights.push({
    id:'cho-dong-xoai',name:'Chợ Đồng Xoài',city:'Đồng Xoài',province:'Đồng Nai',region:'Nam Bộ',formerProvince:'Bình Phước',
    lon:106.897524,lat:11.5356356,start:[106.8976974,11.5357848],width:54,depth:31,yaw:2.234,
    map:'https://www.openstreetmap.org/way/308426605',
    source:'https://baodongnai.com.vn/xa-hoi/202609/cho-dong-xoai-ra-mat-mo-hinh-cho-kieu-mau-dat-chuan-an-toan-ve-phong-chay-chua-chay-84503b3/',
    description:'Chợ truyền thống lớn nhất khu vực Đồng Xoài, xây dựng từ năm 1994 và được cải tạo năm 2021, hiện có hơn 560 lô sạp. Nhà lồng chính mang dải biển đỏ “Chợ Đồng Xoài” phía trên hàng mái che của các sạp hàng.',
    solids:[[0,0,25.75,11.3]],
    build(T,k){
      const {box,sign,palette}=k;
      const W=51.5,D=22.6,wall=0xe6e7e3,band=0xc4453a,glass=0x8fa3ad,canopy=0xbfc3c2,roof=0xdfe2e0,leanTo=0xa9cdb8,rust=0x8a5a48,shade=0x5a534b,
        post=0xd4d4cd,paving=0xb9b6ad,tarp=0xa3a9ab,blue=0x3f6fae,stripe=0xe9edf1;
      palette({plaster:[wall,post],stone:[paving,canopy],metal:[roof,leanTo,rust],glass:[glass]});
      box(paving,0,.08,0,W+2.5,.16,D+8.4);
      // Open ground floor: perimeter posts around the stall core.
      box(shade,0,2.0,0,W-1.6,3.7,D-1.6);
      for(let i=0;i<=10;i++)for(const f of [-1,1])box(post,(i/10-.5)*(W-.6),1.95,f*(D/2-.3),.55,3.9,.55);
      for(const f of [-1,1])for(const z of [-5.6,0,5.6])box(post,f*(W/2-.3),1.95,z,.55,3.9,.55);
      // Upper storey, canopy slab and the clerestory under a low metal roof.
      box(canopy,0,4.0,0,W+2.6,.36,D+2.6);
      box(wall,0,6.4,0,W,4.5,D);
      box(glass,0,9.05,0,W-1.2,.9,D-1.2);
      box(wall,0,9.62,0,W,.26,D);
      box(roof,0,9.85,0,W-2.4,.2,D-2.4);
      for(const f of [-1,1]){
        box(glass,f*18.6,7.7,D/2+.03,11.5,1.0,.06);
        box(glass,f*18.6,7.7,-D/2-.03,11.5,1.0,.06);
        box(glass,f*(W/2+.03),7.7,0,.06,1.0,D-4);
      }
      // Sign frame with the red name band.
      box(wall,0,6.7,D/2+.22,25,5.3,.44);
      box(band,0,6.7,D/2+.47,22.6,2.7,.08);
      sign('CHỢ ĐỒNG XOÀI',0,6.7,D/2+.56,19.5,2.2,true);
      box(band,0,6.6,-D/2-.05,14,1.8,.08);
      // Stall awnings on the sign side; pale green and rust lean-to roofs behind, as seen from the air.
      const goods=[0xc8553d,0x3f7fa6,0xd9b24a,0x5c8f4e,0xb7b0a2,0x8c4f7a];
      for(let i=0;i<6;i++){
        const x=(i-2.5)*8.4;
        box(i%3===0?blue:i%3===1?tarp:stripe,x,3.15,D/2+2.5,8.1,.08,4.3,0,.3);
        box(i<2?rust:leanTo,x,3.15,-D/2-2.5,8.1,.08,4.3,0,-.3);
        box(goods[i],x,.75,D/2+1.5,5.6,1.1,1.6);
        box(goods[5-i],x,.75,-D/2-1.5,5.6,1.1,1.6);
      }
    }
  });

  // 2. Di tích Phú Riềng Đỏ — the 10 m memorial of 1985 at OSM node 11118059523,
  //    inside park way 1198519190. Aerial imagery shows a wedge-shaped compound
  //    south of the plantation road: gate at the western tip, paved yard, the
  //    monument facing west, and a tiled stele pavilion in the garden behind
  //    (OSM way 1198519188). +Z is west, +X south; the monument stands at z = 7.
  sights.push({
    id:'di-tich-phu-rieng-do',name:'Di tích Phú Riềng Đỏ',city:'Thuận Lợi',province:'Đồng Nai',region:'Nam Bộ',formerProvince:'Bình Phước',
    lon:106.8744583,lat:11.5692676,start:[106.87455,11.56915],width:38,depth:116,yaw:-1.5708,
    map:'https://www.openstreetmap.org/way/1198519190',
    source:'https://congdoancaosu.vn/thieng-lieng-tuong-dai-chi-bo-phu-rieng-do/',
    description:'Nơi thành lập Chi bộ Đông Dương Cộng sản Đảng Phú Riềng đêm 28-10-1929 giữa đồn điền cao su, di tích lịch sử quốc gia từ năm 1999. Đài tưởng niệm cao 10 m dựng năm 1985, trên đỉnh có biểu tượng búa liềm, phía sau là nhà bia tưởng niệm liệt sĩ.',
    modeledBuildings:['w1198519188'],
    solids:[[0,7,5.8,4.8],[-4,-48.6,4,4]],
    build(T,k){
      const {box,stamp,round,tapered,outline,wavingFlag,palette}=k;
      const tile=0xd9c7b4,maroon=0x8a3b32,maroon2=0x9c4a3d,deck=0xcfcdc5,pale=0xe3e9ec,panel=0xc3cfd6,gold=0xd8a531,
        board=0x7a4a2c,pot=0x8f3f33,red=0xc0282a,roofRed=0xa5553f,granite=0x8e8b84;
      palette({stone:[tile,deck,pale,panel,granite],brick:[maroon,maroon2,pot],metal:[gold],plaster:[white],tile:[roofRed]});
      const mz=7;
      // Paved yard narrowing towards the gate, and the walk to the pavilion court.
      box(tile,2.75,.08,11.5,25.5,.16,21);
      box(tile,6.25,.08,31,18.5,.16,18);
      box(tile,8.5,.08,46,11,.16,12);
      box(tile,4.5,.06,-20,2.5,.12,44);
      box(tile,-4,.07,-48.6,16,.14,16);
      // Stepped plinth.
      for(let i=0;i<4;i++)box(i%2?maroon2:maroon,0,.16+.1+i*.2,mz,11.6-i*.9,.2,9.6-i*.9);
      box(deck,0,.98,mz,8.6,.08,6.6);
      for(const fx of [-1,1])for(const fz of [-1,1])box(maroon,fx*5.5,.55,mz+fz*4.5,1.1,.8,1.1);
      // Pedestal (3.4 m × 1.7 m) and tapering shaft.
      box(pale,0,1.6,mz,3.4,1.2,1.7);
      tapered(pale,0,6.0,mz,1.95,1.1,7.6,.62);
      box(pale,0,9.9,mz,1.75,.2,1.15);
      box(panel,0,7.4,mz+.6,1.3,1.6,.06);
      box(panel,0,3.3,mz+.82,1.9,1.5,.06);
      // Hammer and sickle, kept as a simple gilt silhouette.
      stamp(round,gold,0,10.15,mz,.06,.3,.06);
      const arc=[];
      for(let i=0;i<=10;i++){const a=(-70+i*25)*Math.PI/180;arc.push([Math.cos(a)*.55,Math.sin(a)*.55]);}
      for(let i=10;i>=0;i--){const a=(-70+i*25)*Math.PI/180;arc.push([Math.cos(a)*.4+.04,Math.sin(a)*.4+.05]);}
      outline(arc,gold,0,10.85,mz-.04,.08);
      box(gold,-.05,10.8,mz,.1,.95,.08,0,0,-.75);
      box(gold,.26,11.12,mz,.4,.2,.1,0,0,-.75);
      // Urn, potted plants and the brown site board.
      stamp(round,0xd8d2c4,0,1.4,mz+2.4,.42,.75,.42);
      for(const [x,z] of [[-6.6,5.8],[6.6,5.8],[-4.3,5.0],[4.3,5.0]]){
        stamp(round,pot,x,.5,mz+z,.5,.7,.5);tapered(leaf,x,1.6,mz+z,.95,.2,1.6,1,8);
      }
      box(board,-3.8,1.75,mz+5.4,1.5,1.0,.1);
      for(const f of [-1,1])box(board,-3.8+f*.6,.7,mz+5.4,.08,1.1,.08);
      // Flags beside and behind the monument.
      flagpole(k,-7.4,mz+1,8);wavingFlag(1.8,1.2,-7.35,7.9,mz+1);
      flagpole(k,-8.4,mz-.2,8,red);
      for(let i=0;i<5;i++)flagpole(k,-9+i*4.5,mz-7.5,4.2,red);
      // Low white fence along the plantation road, running out to the gate.
      box(white,-7.7,.3,25,.22,.6,58.8,.406);
      for(let i=0;i<=12;i++)box(white,3.9-i*1.933,.55,52-i*4.5,.42,1.1,.42);
      // Gate at the western tip.
      for(const x of [4.6,11.4])box(white,x,2.1,54.5,.9,4.2,.9);
      box(roofRed,8,4.45,54.5,9,.5,1.8);
      // Small white shelter behind the monument.
      for(const fx of [-1,1])for(const fz of [-1,1])box(white,8.5+fx*1.3,1.3,-5+fz*1.3,.22,2.6,.22);
      tapered(roofRed,8.5,3.0,-5,2.6,.2,.9);
      // Stele pavilion for the commune's fallen, under a tiled hip roof.
      box(granite,-4,.3,-48.6,9,.5,9);
      for(const fx of [-1,1])for(const fz of [-1,1])box(white,-4+fx*3.6,2.2,-48.6+fz*3.6,.4,3.4,.4);
      box(white,-4,3.95,-48.6,8.4,.3,8.4);
      tapered(roofRed,-4,5.2,-48.6,7.2,.3,2.2);
      box(granite,-4,1.6,-49.6,2.2,2.1,.35);
      // Rubber and garden trees round the compound.
      const list=[];
      for(let z=48;z>=-54;z-=6.5)list.push([17.5,z,3.6+(z&1)*.6,2.6]);
      for(let z=-14;z>=-56;z-=7)list.push([-13-(-14-z)*.2,z,3.8,2.7]);
      for(const [x,z] of [[10,-34],[-10,-26],[12,-52],[-13,-40],[9,-14]])list.push([x,z,3.4,2.4]);
      trees(T,k,list,0x3f7a3a);
    }
  });

  // 3. Hồ Long Thủy — the lakeside terrace with its two tiled pavilions. A drone
  //    photo puts it on the west shore of lake way 689473021, beside Đường Hồ Long
  //    Thủy; it is kept to the strip between that road and the mapped water.
  //    +Z faces the road (west), +X runs south, the lake is at -Z.
  sights.push({
    id:'ho-long-thuy',name:'Hồ Long Thủy',city:'Phước Long',province:'Đồng Nai',region:'Nam Bộ',formerProvince:'Bình Phước',
    lon:106.9929337,lat:11.8456531,start:[106.99383,11.84625],width:31,depth:7,yaw:-1.4767,
    map:'https://www.openstreetmap.org/way/689473021',
    source:'https://baodongnai.com.vn/giai-tri/202512/nhung-diem-check-in-an-tuong-trong-mua-giai-viet-da-chinh-phuc-dinh-cao-ba-ra-lan-thu-31-73e2083/',
    description:'Hồ rộng hơn 6 ha giữa trung tâm Phước Long, được kè bờ và cải tạo đồng bộ từ năm 2021–2023 với lối đi bộ và không gian sinh hoạt cộng đồng. Bên bờ tây có sân kè lan can trắng cùng những nhà chòi mái ngói đỏ nhìn ra mặt nước in bóng núi Bà Rá.',
    solids:[[5,-.2,4,2.1],[-4,-.2,2.3,2.3]],
    build(T,k){
      const {box,stamp,round,tapered,palette}=k;
      const paving=0xcfc4b0,wallStone=0x8f8d84,col=0xb98f7e,beam=0x8c5a48,tile=[0xc2553a,0xb24a33,0xa3422e],steel=0xb23a3a;
      palette({stone:[paving,wallStone],tile,plaster:[white,col],timber:[beam],metal:[steel,lampPole]});
      // Terrace on its retaining wall.
      box(paving,0,.2,0,30,.4,6);
      box(wallStone,0,-.9,-3.1,30.6,2.6,.4);
      for(const f of [-1,1])box(wallStone,f*15.1,-.9,0,.4,2.6,6.4);
      // White balustrade on the water side and both ends.
      for(const y of [.85,1.3]){
        box(white,0,y,-2.8,30,.08,.1);
        for(const f of [-1,1])box(white,f*14.8,y,-.4,.1,.08,4.8);
      }
      for(let x=-15;x<=15;x+=2.5)box(white,x,.85,-2.8,.16,.95,.16);
      for(const f of [-1,1])for(const z of [-1.2,.4,2.0])box(white,f*14.8,.85,z,.16,.95,.16);
      // Two open pavilions with red tiled hip roofs.
      const pavilion=(x,z,w,d)=>{
        for(const fz of [-1,1])for(let i=0;i<4;i++)box(col,x+(i/3-.5)*(w-.5),2.0,z+fz*(d/2-.25),.3,3.2,.3);
        box(beam,x,3.7,z,w,.22,d);
        const r=(w+1.2)/Math.SQRT2,ratio=(d+1.2)/(w+1.2);
        tapered(tile[0],x,4.6,z,r,r*.3,1.6,ratio);
        tapered(tile[1],x,5.65,z,r*.3,.05,.5,ratio);
        box(tile[2],x,3.84,z,w+1.3,.1,d+1.3);
      };
      pavilion(5,-.2,7.6,3.8);
      pavilion(-4,-.2,4.2,4.2);
      // Red steel pergola with branching posts.
      for(const x of [-13,-11,-9]){
        stamp(round,steel,x,1.9,.4,.1,3.0,.1);
        for(const f of [-1,1])box(steel,x+f*.5,3.5,.4,.1,1.3,.1,0,0,-f*.75);
      }
      box(steel,-11,4.0,.4,6,.1,.1);
      for(let x=-13.5;x<=-8.5;x+=1.25)box(steel,x,4.08,.4,.08,.08,2.4);
      // Globe lamps and benches.
      for(const [x,z] of [[-14.2,-2.2],[.6,2.4],[10.5,2.4],[14.2,-2.2]])lamp(k,x,z,4.4,3);
      for(const x of [-7.2,.6])bench(k,x,-2.1,0,0xb9b3a4);
    }
  });

  // 4. Quảng trường 6 tháng 1 — park way 689652500 (about 221 m × 122 m) between
  //    the administrative centre and ĐT.741. +Z faces ĐT.741, +X runs north-east.
  //    Layout traced from aerial imagery: a bare ceremonial ground on the
  //    administrative side, two kidney-shaped ponds splayed either side of the
  //    axis, a causeway between them and a flower bed towards ĐT.741.
  sights.push({
    id:'quang-truong-6-thang-1',name:'Quảng trường 6 tháng 1',city:'Phước Long',province:'Đồng Nai',region:'Nam Bộ',formerProvince:'Bình Phước',
    lon:106.962324,lat:11.8231146,start:[106.961879,11.8236211],width:216,depth:118,yaw:.674,
    map:'https://www.openstreetmap.org/way/689652500',
    source:'https://baodongnai.com.vn/giai-tri/202512/nhung-diem-check-in-an-tuong-trong-mua-giai-viet-da-chinh-phuc-dinh-cao-ba-ra-lan-thu-31-73e2083/',
    description:'Quảng trường mang tên ngày giải phóng Phước Long 6-1-1975, nằm trước trung tâm hành chính Phước Bình bên đường ĐT.741. Sân lễ rộng nối ra bồn hoa lớn qua lối đi giữa hai hồ điều hòa, nơi đôi sư tử phun nước và đèn màu rực lên khi đêm xuống.',
    solids:[[0,38.5,3.8,.6],[-35,5,26,13],[35,5,26,13]],
    build(T,k){
      const {box,stamp,round,sign,palette}=k;
      const ground=0xc9bda8,paving=0xc6bfb2,paving2=0xb5ada0,kerb=0xd8d3c6,grass=0x5f9146,bloom=[0xd9b23a,0xc8453d,0x7fae4a],redStone=0xa8322c,
        water=0x4f8087,stone=0x9c9a92,statue=0xe9e7e0,mast=0x7b8083,spray=0xcfe3e6;
      palette({stone:[ground,paving,paving2,kerb,stone,redStone,statue],glass:[water],metal:[mast,lampPole],plaster:[white]});
      // Ceremonial ground, the causeway between the ponds and the pavement along ĐT.741.
      box(ground,0,.06,-36,60,.12,46);
      box(paving,0,.06,24,12,.12,74);
      box(paving2,0,.05,57,120,.1,7);
      // Flower bed and the red name stone behind it.
      stamp(round,kerb,0,.25,47,11,.5,6);
      stamp(round,grass,0,.52,47,10.4,.3,5.4);
      for(let i=0;i<5;i++)stamp(round,bloom[i%3],(i-2)*3.8,.74,47+(i%2?.9:-.9),1.6,.26,1.3);
      box(stone,0,.3,38.5,7.6,.6,1.2);
      box(redStone,0,1.5,38.5,7,1.8,.5);
      sign('QUẢNG TRƯỜNG 6/1',0,1.5,38.77,6.2,1.1,true);
      for(const f of [-1,1]){
        // Pond: an ellipse 64 m × 32 m turned so its inner end meets the causeway.
        const cx=f*35,cz=5,turn=f*.594,c=Math.cos(turn),s=Math.sin(turn);
        const at=(px,pz)=>[cx+px*c+pz*s,cz-px*s+pz*c];
        stamp(round,kerb,cx,.2,cz,32.6,.4,16.4,turn);
        stamp(round,water,cx,.23,cz,31.4,.4,15.2,turn);
        // White railing round the rim.
        const rim=[];
        for(let i=0;i<16;i++){const t=i*Math.PI/8;rim.push(at(Math.cos(t)*32.3,Math.sin(t)*16.1));}
        rim.forEach(([x,z],i)=>{
          const [nx,nz]=rim[(i+1)%16],dx=nx-x,dz=nz-z;
          box(white,x,.85,z,.18,.9,.18);
          box(white,(x+nx)/2,1.2,(z+nz)/2,Math.hypot(dx,dz),.08,.1,Math.atan2(-dz,dx));
        });
        // Fountain in the middle, viewing terrace on the outer side.
        stamp(round,stone,cx,.55,cz,2.2,.3,2.2);
        stamp(round,spray,cx,1.7,cz,.12,2.2,.12);
        for(const g of [-1,1])stamp(round,spray,cx+g*1.3,1.2,cz,.08,1.2,.08);
        stamp(round,paving,f*58,.08,20,10,.16,10);
        box(paving2,f*85,.05,37,64,.1,3,-f*.562);
        // Water-spouting lion on a pedestal at the pond's inner tip.
        const lx=f*12,lz=19;
        box(kerb,lx,.9,lz,2.6,1.4,1.6);
        box(statue,lx,2.15,lz,2.0,1.1,1.0);
        stamp(round,statue,lx+f*.9,2.95,lz,.62,.9,.62);
        box(statue,lx+f*1.55,2.85,lz,.6,.5,.5);
        box(spray,lx+f*2.9,2.0,lz,2.4,.08,.14,0,0,-f*.55);
        // Round planting beds in the side gardens.
        for(const [bx,bz] of [[95,22],[79,46]]){
          stamp(round,kerb,f*bx,.2,bz,4.2,.4,4.2);
          stamp(round,grass,f*bx,.45,bz,3.8,.2,3.8);
          stamp(round,bloom[(bx+f+1)%3|0],f*bx,.6,bz,2,.2,2);
        }
        // Floodlight mast and lamps.
        stamp(round,mast,f*16,10,31,.16,20,.16);box(mast,f*16,20.2,31,2.2,.5,.7);
        for(const x of [30,60,90])lamp(k,f*x,54.6,5,1);
      }
      // Palm groves flanking the ceremonial ground and palms by the flower bed.
      const palms=[];
      for(const f of [-1,1]){
        for(let i=0;i<3;i++)for(let j=0;j<3;j++)palms.push([f*(36+i*6),-54+j*6,7.5+(i+j)%2*.8,2.4]);
        for(let i=0;i<4;i++)palms.push([f*(15+i*6.5),43,8,2.4]);
      }
      trees(T,k,palms,0x4f8a3f,true);
    }
  });

  // 5. Công viên Chơn Thành — park way 796474958 (about 261 m × 99 m), ringed by
  //    streets on all four sides. +Z faces Đường Lê Thị Hồng Gấm, -X is the
  //    Nguyễn Văn Linh end. Layout read from aerial imagery: a planted grove in
  //    rows with an open parade ground at the north-east end.
  sights.push({
    id:'cong-vien-chon-thanh',name:'Công viên Chơn Thành',city:'Chơn Thành',province:'Đồng Nai',region:'Nam Bộ',formerProvince:'Bình Phước',
    lon:106.6340969,lat:11.4278305,start:[106.6338657,11.4281968],width:250,depth:84,yaw:-2.597,
    map:'https://www.openstreetmap.org/way/796474958',
    source:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
    description:'Quảng trường – công viên trung tâm của Chơn Thành, một ô đất dài chừng 260 m giữa các đường Lê Thị Hồng Gấm, Nguyễn Văn Linh, Cống Quỳnh và Trần Huy Liệu. Phần lớn công viên là rừng cây trồng thẳng hàng rợp bóng, đầu phía đường Nguyễn Văn Linh là sân quảng trường rộng để tổ chức sự kiện.',
    solids:[[-122,0,.4,.4]],
    build(T,k){
      const {box,stamp,round,palette}=k;
      const gravel=0xc8bfae,kerb=0xd6d1c4,path=0xb7ae9f,canopy=0x3f7a3a;
      palette({stone:[gravel,kerb,path]});
      // Open parade ground (about 71 m × 41 m) with its kerb.
      box(gravel,-76,.06,0,71,.12,41);
      for(const f of [-1,1]){
        box(kerb,-76,.1,f*20.7,71.8,.2,.4);box(kerb,-76+f*35.7,.1,0,.4,.2,41);
      }
      // Small paved court inside the grove and the two walks in from Đường Cống Quỳnh.
      stamp(round,path,38,.06,2,10.5,.12,7);
      box(path,39,.05,-24,3,.1,40);
      box(path,0,.05,-37,3,.1,14);
      // The grove: rows nine metres apart, a belt around the parade ground.
      const list=[];
      const plant=(x,z)=>{
        const n=Math.abs(Math.round(x*7+z*13));
        list.push([x+(n%5-2)*.4,z+(n%3-1)*.5,3.4+n%4*.5,2.5+n%3*.45]);
      };
      for(let x=-30;x<=122;x+=9.5)for(let z=-38;z<=38;z+=9.5){
        if(Math.hypot((x-38)/13,(z-2)/9.5)<1)continue;
        if(Math.abs(x-39)<3&&z<0||Math.abs(x)<3&&z<-28)continue;
        plant(x,z);
      }
      for(let x=-116;x<=-36;x+=8)for(const z of [-37,-28,28,37])plant(x,z);
      for(let z=-19;z<=19;z+=9.5)plant(-120,z);
      trees(T,k,list,canopy);
    }
  });

  // 6. Di tích Chốt chặn Tàu Ô — memorial precinct way 1257321872 beside Quốc lộ 13.
  //    +Z faces the highway (west), +X runs south towards the side road. Layout
  //    from aerial imagery: paved forecourt with two octagonal pavilions, the
  //    monument on a round stepped mound at the origin, the memorial house
  //    directly behind it.
  sights.push({
    id:'di-tich-tau-o',name:'Di tích Chốt chặn Tàu Ô',city:'Tân Khai',province:'Đồng Nai',region:'Nam Bộ',formerProvince:'Bình Phước',
    lon:106.6156833,lat:11.5191712,start:[106.6156191,11.5188185],width:54,depth:118,yaw:-1.7235,
    map:'https://www.openstreetmap.org/way/1257321872',
    source:'https://baodongnai.com.vn/dong-nai-cuoi-tuan/202605/chot-chan-tau-o-va-ky-uc-150-ngay-dem-tren-vung-dat-lua-tan-khai-2f232fd/',
    description:'Nơi Sư đoàn 7 cùng quân dân địa phương chốt chặn Quốc lộ 13 suốt 150 ngày đêm trong chiến dịch Nguyễn Huệ năm 1972, di tích lịch sử quốc gia từ năm 2012. Tượng đài cao 15,5 m ốp đá hoa cương có hai mảng phù điêu, phía sau là nhà tưởng niệm ba gian hai chái mái ngói đỏ khắc tên gần một nghìn liệt sĩ.',
    boundary:[[-27,-36],[27,-36],[27,59],[-27,59]],
    reserve:(x,z,r)=>Math.abs(x)<27+r&&z>-36-r&&z<59+r,
    solids:[[0,-1,2.4,1.8],[0,3,8.6,6],[0,-24,11.5,5.5],[20,25,2.6,2.6],[-20,25,2.6,2.6],[-17,51.5,2.6,1.6]],
    build(T,k){
      const {box,stamp,round,tapered,outline,place,palette}=k;
      const paving=0xc9b8a4,stone=0xb1ada2,grass=0x64923f,granite=0x3c4046,granite2=0x4d5258,slot=0x1d1f22,clay=0xc49a6c,clay2=0xb5855a,
        plaster=0xf0ede4,frame=0x7a2f2a,tile=[0xc2553a,0xb24a33,0xa3422e],gilt=0xd9b24a,red=0xc0282a,yellow=0xe3bf3a;
      palette({stone:[paving,stone,granite,granite2,clay,clay2],tile,plaster:[plaster],timber:[frame],metal:[gilt]});
      // Forecourt from the highway gate to the mound, with the guard house.
      box(paving,0,.05,34,50,.1,43);
      for(const f of [-1,1]){
        box(granite2,f*4.6,2.4,57,1.2,4.8,1.2);box(stone,f*4.6,4.95,57,1.5,.3,1.5);
        box(stone,f*15,.6,57,19.6,1.2,.4);
      }
      box(plaster,-17,1.6,51.5,5,3.2,3);box(tile[1],-17,3.3,51.5,5.8,.2,3.8);
      // Round grassed mound with granite steps and a paved top.
      tapered(grass,0,.6,1,13.6,12.4,1.2,1,24);
      stamp(round,paving,0,1.25,1,12,.1,12);
      for(let i=0;i<6;i++)box(i%2?paving:stone,0,.1+i*.1,15.7-i*.42,9,.2+i*.2,.44);
      // Granite pillar carrying the figure group (15.5 m overall).
      box(granite,0,6.5,-1,4.2,10.4,2.8);
      box(granite2,0,6.5,.42,.5,10.4,.06);
      for(const f of [-1,1])box(granite2,f*1.5,6.5,.42,.12,10.4,.05);
      box(clay2,0,11.95,-1,3.6,.5,2.5);
      for(const [x,h] of [[-1.0,2.5],[0,3.0],[1.0,2.4]]){
        tapered(clay,x,12.2+h/2,-1+(x?-.2:.3),.62,.36,h,1,6);
        stamp(round,clay,x,12.2+h+.28,-1+(x?-.2:.3),.26,.5,.26);
      }
      box(clay,-.45,16.0,-.7,.2,2.0,.2,0,0,.55);
      box(clay2,-.95,16.75,-.7,.1,1.5,.1,0,0,.55);
      // Wedge-shaped base: two sloping granite walls meeting at a bunker-like prow,
      // each faced with a relief panel.
      box(granite,0,3.1,9,1.7,3.6,1.7);
      box(slot,0,2.7,9.87,.5,2.3,.05);
      const wallShape=[[0,0],[13,0],[13,1.5],[0,3.4]];
      for(const f of [-1,1]){
        const a=f>0?.96:Math.PI-.96,dx=Math.cos(a),dz=-Math.sin(a),nx=Math.sin(a),nz=Math.cos(a);
        const sx=f*.6,sz=8.6;
        outline(wallShape,granite,sx,1.3,sz,.8,a);
        const off=f>0?.86:-.06;
        box(clay,sx+dx*5.4+nx*off,2.45,sz+dz*5.4+nz*off,9,1.3,.12,a);
        box(clay2,sx+dx*5.4+nx*off,1.62,sz+dz*5.4+nz*off,9.4,.24,.14,a);
      }
      stamp(round,clay,0,1.8,11.7,.55,1.0,.55);
      // Flagpoles between the monument and the memorial house.
      for(let i=0;i<6;i++)flagpole(k,-10+i*4,-13.7,9,i%2?yellow:red);
      // Memorial house: three bays and two lean-tos, veranda on twelve square posts.
      place(0,-24,0,()=>{
        const w=22,d=10,floor=.7,h=4.0;
        box(stone,0,floor/2,0,w+4.6,floor,d+4.6);
        for(let i=0;i<4;i++)box(i%2?paving:stone,0,floor*(3.5-i)/4/2+.01,d/2+2.5+i*.36,9,floor*(3.5-i)/4,.4);
        box(plaster,0,floor+h/2,-.4,w-1,h,d-1.6);
        for(let i=0;i<6;i++)box(plaster,(i/5-.5)*(w+2.6),floor+h/2,d/2+1.4,.42,h,.42);
        for(const f of [-1,1])for(const z of [-3,0,3])box(plaster,f*(w/2+1.3),floor+h/2,z-1,.42,h,.42);
        box(frame,0,floor+1.5,d/2-1.17,4.4,3.0,.1);
        for(const x of [-1.1,0,1.1])box(plaster,x,floor+1.5,d/2-1.1,.06,2.8,.04);
        for(const f of [-1,1]){
          for(const x of [4.6,8.2])box(frame,f*x,floor+2.1,d/2-1.17,2.0,1.7,.1);
          box(frame,f*(w/2-.48),floor+2.1,-.4,.1,1.7,2.4);
        }
        box(frame,0,floor+h-.1,d/2+1.4,w+3,.3,.3);
        tileRoof(T,k,tile,plaster,0,floor+h+.12,0,w+5.4,d+5.6,3.4);
        stamp(round,gilt,0,floor+h+4.3,0,.5,.1,.5,0,Math.PI/2);
      });
      // Two octagonal rest pavilions flanking the forecourt.
      for(const f of [-1,1]){
        for(let i=0;i<8;i++){
          const a=i*Math.PI/4+Math.PI/8;
          box(plaster,f*20+Math.cos(a)*2.6,1.5,25+Math.sin(a)*2.6,.22,2.8,.22);
        }
        stamp(round,stone,f*20,.1,25,3.4,.2,3.4);
        tapered(tile[0],f*20,3.6,25,3.9,.15,1.6,1,8);
        stamp(round,tile[2],f*20,2.86,25,3.95,.1,3.95);
      }
    }
  });

  (window.VietnamSights??=[]).push(...sights);
})();

export default window.VietnamSights;
