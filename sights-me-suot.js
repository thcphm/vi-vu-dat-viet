'use strict';
(()=>{
  const A=window.CentralArch,id='tuong-dai-me-suot',catalogId='osm-node-8716478190';
  const lon=106.6270915,lat=17.4654799,yaw=.431;
  const source='https://svhttdl.quangtri.gov.vn/chi-tiet/-/view-article/1/1647938258475/1786420807291';
  // The public survey pin is within six metres of the dark rectangular dais.
  // The podium, circular planting beds and river railing follow imagery and the 2026 street photograph.
  const c=Math.cos(yaw),s=Math.sin(yaw);
  function camera(name,x,z,ex,ez,h,eye,fov,photoCatalogId,description){
    const dx=ex-x,dz=ez-z,dy=eye-h;
    return {name,offset:[c*x+s*z,-s*x+c*z],height:h/.46,viewBase:'monument',viewAngle:yaw+Math.atan2(dx,dz),
      viewRadius:Math.hypot(dx,dz,dy),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,photoCatalogId,description};
  }
  const views=[
    camera('Mẹ Suốt nhìn từ sân ven sông',0,0,.65,13.5,3.32,1.66,43,catalogId,
      'Từ mép sân phía nam nhìn lên mái chèo dựng đứng, thân tượng và bệ đá đen. Sông Nhật Lệ nằm bên phải người xem.'),
    camera('Phù điêu trên mũi thuyền',-.22,.09,-3.6,4.8,2.69,2.44,36,'dong-hoi-phu-dieu-me-suot',
      'Ở phía đường Quách Xuân Kỳ có các gương mặt trên mũi thuyền. Qua bên kia thân tượng, các nếp đá chuyển thành hình sóng nước.'),
    camera('Qua hàng cau nhìn ra Nhật Lệ',0,0,-14.4,9.6,3.02,1.84,54,'dong-hoi-hang-cau-me-suot',
      'Từ lối lát ven phố nhìn qua hàng cau tới tượng. Sau bệ đá là lan can bờ kè, lòng sông và bờ Bảo Ninh.'),
  ];
  const heights=views.map(v=>v.height);
  function sculpture(T,kit){
    const stone=0xb9b7ac,plinth=0x393736;
    kit.palette({stone:[stone,plinth,0xd1ccba,0x929181]});
    kit.box(0x666664,0,.15,0,7.6,.30,10.6);
    kit.box(0xc7c5bd,0,.32,0,7.42,.06,10.42);
    kit.box(plinth,0,.44,-.32,3.98,.20,3.62);
    kit.box(0x43423e,0,1.17,-.34,3.61,1.40,3.22);
    A.plaque(T,kit,'MẸ SUỐT ANH HÙNG',0,1.54,1.284,1.83,.34,{bg:'#49463e',fg:'#d3c6a1',frame:false});
    // Traced in two field photographs by Linhcandng. The people on the bow face
    // the street, at an angle to the standing figure. Only the photographed sides carry portraits.
    kit.place(-.07,-.13,-.63,()=>A.photoCarving(T,kit,{
      photo:'sight-imagery/me-suot-mui-thuyen.webp',width:256,height:172,
      origin:[138,169],scale:.0123,position:[0,1.86,0],tint:stone,forms:[
        {z:0,rows:[[52,187,209,0.39],[56,156,236,0.55],[61,127,243,0.69],[68,91,245,0.79],
          [78,63,246,0.83],[92,56,243,0.82],[109,58,239,0.74],[118,52,237,0.7],[134,38,238,0.75],[151,34,244,0.8],[168,10,250,0.88]]},
        {z:.60,rows:[[10,159,163,0.04],[16,137,166,0.12],[24,108,168,0.2],[30,90,172,0.26],
          [40,84,175,0.32],[55,82,180,0.36],[70,81,177,0.33,-.08],[77,78,165,0.29,-.15],
          [83,75,152,0.24,-.25],[90,81,143,0.18,-.39],[96,89,138,0.07,-.48]]}
      ]
    }));
    // The camera image records the raised chin, squared shoulders, wide trousers
    // and both hands on one oar. Depth and the trailing cloth follow the side view.
    A.photoCarving(T,kit,{
      photo:'sight-imagery/me-suot-nguoi.webp',width:98,height:213,
      origin:[42,207],scale:.0197,position:[0,3.02,-.12],tint:stone,forms:[
        {z:0,rows:[[4,37,42,0.046],[5,33,46,0.13],[8,31,50,0.2],[14,29,52,0.235],[22,29,53,0.237],[29,31,52,0.214],[33,33,50,0.16],[41,31,50,0.15],
          [44,19,57,0.24],[49,12,66,0.3],[54,9,69,0.33],[61,8,71,0.34],[69,12,73,0.32],[84,18,76,0.29],[92,19,77,0.3],[101,11,77,0.34],
          [112,7,74,0.36],[120,5,70,0.36],[130,9,70,0.34],[143,9,70,0.34],[157,5,71,0.36],[174,2,72,0.38],[190,3,72,0.36],[205,19,69,0.27]]},
        {z:.27,rows:[[46,21,52,0.035],[50,11,57,0.075],[53,9,60,0.12],[59,8,61,0.14],[64,9,60,0.11],[68,13,54,0.055]]},
        {z:.28,rows:[[53,51,57,0.04],[64,50,60,0.08],[85,51,60,0.075],[96,50,60,0.07],[101,46,71,0.12],[107,52,71,0.13],[113,56,68,0.08],[128,57,66,0.065],[160,59,69,0.075],[194,62,69,0.065]]},
        {z:-.15,rows:[[145,91,94,0.04],[151,70,94,0.09],[157,67,93,0.14],[167,65,92,0.18],[175,66,89,0.16],[183,63,79,0.13],[189,63,72,0.06]]}
      ]
    });
    const marble=0xb7a899;
    kit.box(0x66544c,0,.42,2.87,1.13,.14,.88);
    for(const x of [-.31,.31])kit.box(marble,x,.57,2.87,.21,.19,.52);
    kit.box(marble,0,.84,2.87,.85,.47,.63);kit.box(0xa69584,0,1.085,2.87,.88,.06,.67);
    kit.box(0x51493e,0,1.12,2.87,.72,.02,.50);
    const rim=new T.TorusGeometry(.115,.012,5,18);kit.stamp(rim,0x8c7d6a,0,.85,3.193);rim.dispose();
    for(const x of [-.18,-.075,.025,.12,.20])kit.box(0x9d493a,x,1.19,2.87,.012,.19,.012);
  }
  function grounds(T,kit){
    const paving=0xbcbdb6,kerb=0xa9aca2,rail=0xc3c6c0;
    kit.box(paving,-1.7,-.12,0,22,.34,56);
    for(const x of [-11.1,-8.5,-5.9,-3.3,-.7,1.9,4.5,7.1])kit.box(0xa5a79f,x,.057,0,.028,.012,55.9);
    for(let z=-26;z<=26;z+=2.6)kit.box(0xa5a79f,-1.7,.056,z,21.95,.012,.032);
    const palms=[];
    for(const z of [-20,-5,10,23]){
      kit.box(kerb,-10.9,.12,z,2.45,.19,10.1);kit.box(0x53644d,-10.9,.23,z,2.28,.07,9.94);
      palms.push({x:-10.9,z:z-.9,h:8.35+(z+20)*.021,width:4.8,kind:'palm'});
    }
    const shrub=new T.LatheGeometry([[0,0],[.48,.10],[.81,.21],[.88,.36],[.77,.61],[.59,.79],[.34,.94],[.13,1],[0,1.01]].map(([r,y])=>new T.Vector2(r,y)),16);
    const round=new T.CylinderGeometry(1,1,1,28);
    kit.stamp(round,kerb,.4,.12,-12.7,2.33,.17,2.33);kit.stamp(round,0x70805c,.4,.22,-12.7,2.19,.07,2.19);
    kit.stamp(round,0x96988f,-.7,.068,13.1,3.8,.022,3.8);kit.stamp(round,paving,-.7,.085,13.1,3.55,.015,3.55);
    for(const z of [-20,-10,-3,6,15,23])kit.stamp(shrub,0x53644b,6.9,.06,z,.82,1.35,.82);
    round.dispose();shrub.dispose();
    for(let z=-27;z<=27;z+=3)kit.box(rail,9.02,.51,z,.12,.98,.13);
    for(const y of [.35,.68,1.0])kit.box(rail,9.02,y,0,.064,.066,54);
    A.trees(T,kit,[...palms,{x:.4,z:-12.7,h:4.6,width:6.1},{x:-5.1,z:-22,h:5.8,width:6.4}]);
  }
  function build(T,kit){
    grounds(T,kit);sculpture(T,kit);
    let rest;
    kit.group.userData.fitGround=ground=>{
      const level=Math.max(0,ground(-5,0),ground(0,0),ground(0,5));
      rest??=kit.group.children.map(o=>o.position.y);kit.group.children.forEach((o,i)=>{o.position.y=rest[i]+level;});
      views.forEach((v,i)=>{v.height=heights[i]+level/.46;});
    };
  }
  (window.VietnamSights??=[]).push({id,catalogId,name:'Tượng đài Mẹ Suốt',lon,lat,yaw,region:'Trung Bộ',city:'Đồng Hới',province:'Quảng Trị',formerProvince:'Quảng Bình',
    kind:'Đài tưởng niệm',width:8,depth:11,gardenRadius:10,viewDistance:710,start:[106.6269387,17.4654104],mappedEntrance:true,visitOnArrival:true,
    reserve:(x,z,p)=>x> -12.8-p&&x<9.4+p&&Math.abs(z)<28+p,solids:[[0,-.34,1.8,1.61]],
    source,map:'https://www.openstreetmap.org/node/8716478190',photo:'https://commons.wikimedia.org/?curid=93541902',
    description:'Tượng đá Mẹ Suốt của nhà điêu khắc Phan Đình Tiến cao khoảng 7 m kể cả bệ. Công trình khánh thành năm 2003 trên bờ Nhật Lệ, gần bến đò xưa. Mẹ ngẩng đầu, hai tay giữ mái chèo. Nhóm người trên mũi thuyền hướng ra phía đường. Dáng tượng và mảng phù điêu được dựng theo ảnh chụp từ sân và từ bên đường.',
    arrivalNote:'Xe dừng trên đường Quách Xuân Kỳ phía công viên. Từ lối đi bộ sát hàng cau có thể vòng ra trước bệ đá để nhìn dọc bờ sông.',views,build});
})();
