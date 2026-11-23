'use strict';
(()=>{
  const id='cau-nhat-le',catalogId='osm-node-5323866724',lon=106.6272501,lat=17.4724347,yaw=.2690821;
  const source='https://nhandan.vn/quang-binh-thong-xe-cau-nhat-le-post470815.html';
  const current='https://dangcongsan.org.vn/boxaydung/tin-tuc-hoat-dong/quang-tri-dau-tu-200-ty-dong-mo-rong-cau-nhat-le-cai-thien-giao-thong-dong-hoi.html';
  // West to east along OSM way 979538328. The 2004 record gives the total
  // length, width and span count. Intermediate pier stations are estimates
  // from the oblique photograph, including the deeper central concrete spans.
  const length=635,half=length/2,cos=Math.cos(yaw),sin=Math.sin(yaw);
  const widths=[33.5,33.5,33.5,33.5,33.5,50,66,68,66,50,33.5,33.5,33.5,33.5,33.5];
  const stations=[-half];for(const width of widths)stations.push(stations.at(-1)+width);
  function camera(name,x,z,eyeX,eyeZ,h,eyeH,fov,photoCatalogId,photo,description){
    const dx=eyeX-x,dz=eyeZ-z,dy=eyeH-h;
    return {name,offset:[x*cos+z*sin,-x*sin+z*cos],height:h/.46,viewBase:'monument',viewAngle:yaw+Math.atan2(dx,dz),
      viewRadius:Math.hypot(dx,dz,dy),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,photoCatalogId,photo,description};
  }
  const views=[
    camera('Dầm và trụ cầu từ bờ Đồng Hới',-237,1,-325.4,54.3,-1.20,-2.75,48,catalogId,'https://commons.wikimedia.org/?curid=4279878',
      'Từ lối đi ven sông phía nam đầu cầu nhìn dọc hàng trụ. Dầm dưới mặt đường dày lên ở những trụ giữa dòng. Các cột đèn nhô khỏi lan can.'),
    camera('Cửa cầu nhìn từ phía Quách Xuân Kỳ',-116,0,-376,35.5,.3,10.1,55,'dong-hoi-toan-canh-cau-nhat-le','https://commons.wikimedia.org/?curid=148223058',
      'Từ vị trí cao bên đầu cầu phía tây nhìn qua vòng xuyến, lối đi bộ và mặt cầu về bán đảo Bảo Ninh. Góc nhìn đối chiếu ảnh của Tttrung.'),
    camera('Trên lề bộ hành hướng về Bảo Ninh',47,4.65,-93,4.88,1.06,1.69,61,'dong-hoi-le-bo-hanh-cau-nhat-le',current,
      'Từ lề phía nam, đường xe chạy nằm bên trái và sông ở bên phải. Cột đèn hai mép cầu dẫn mắt về bờ Bảo Ninh.'),
  ];
  function girder(T,k,lo,hi,deepLeft,deepRight){
    const coords=[],segments=10;
    function section(t){
      const x=lo+(hi-lo)*t;
      const depth=1.23+deepLeft*(1-t)**3+deepRight*t**3;
      return [[x,-.32,-4.21],[x,-.32,4.21],[x,-depth,2.61],[x,-depth,-2.61]];
    }
    for(let i=0;i<segments;i++){
      const a=section(i/segments),b=section((i+1)/segments);
      for(let j=1;j<4;j++){
        const m=(j+1)%4;coords.push(...a[j],...a[m],...b[j],...a[m],...b[m],...b[j]);
      }
    }
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(coords,3));geometry.computeVertexNormals();
    k.stamp(geometry,0x96968b,0,0,0);geometry.dispose();
  }
  function build(T,k){
    const concrete=0xa5a498,edge=0xa7a99d,metal=0x7d8986,walk=0xad8173;
    k.palette({stone:[concrete,edge],metal:[metal,0x9fa8a3],plaster:walk});
    const haunch=index=>index>=6&&index<=9?1.64:0;
    for(let i=0;i<widths.length;i++){
      const lo=stations[i],hi=stations[i+1],mid=(lo+hi)/2,w=hi-lo;
      girder(T,k,lo,hi,haunch(i),haunch(i+1));
      const steps=Math.ceil(w/7),piece=w/steps;
      for(let j=0;j<steps;j++){
        const x=lo+(j+.5)*piece;
        // Traffic and lane markings come from the routed deck. Fill the
        // shoulders up to the raised terracotta pedestrian strips on each side.
        // Leave the top face below the asphalt even where the first road
        // segment bends vertically into the approach grade.
        k.box(concrete,x,-.46,0,piece,.34,11.96);
        for(const side of [-1,1]){
          k.box(0x777670,x,-.015,side*3.70,piece,.05,1.03);
          k.box(concrete,x,-.245,side*5.08,piece,.50,1.77);
          k.box(edge,x,.057,side*5.08,piece,.16,1.78);
          k.box(walk,x,.147,side*5.08,piece,.035,1.61);
          k.box(metal,x,1.21,side*5.88,piece,.078,.077);
          k.box(metal,x,.73,side*5.88,piece,.055,.061);
        }
      }
      if(i>0){
        const deep=haunch(i),cap=-1.30-deep;
        k.box(0x98998e,lo,cap-.29,0,3.10,.65,7.0);
        k.box(0x98978b,lo,(cap-18)/2,0,2.35,18+cap,5.35);
        for(const z of [-2.67,2.67])k.stamp(k.round,0x98978b,lo,(cap-18)/2,z,1.17,18+cap,.40);
      }
      for(const side of [-1,1]){
        const posts=Math.round(w/2.3);
        for(let j=0;j<posts;j++)k.box(metal,lo+j*w/posts,.70,side*5.88,.086,1.08,.091);
      }
      k.box(0x7d7c72,lo,.169,5.08,.055,.015,1.57);k.box(0x7d7c72,lo,.169,-5.08,.055,.015,1.57);
      for(const side of [-1,1]){
        const x=mid+(side<0?-5:5),z=side*5.51;
        k.box(0x89908b,x,3.12,z,.13,5.96,.13);
        k.box(0x89908b,x,6.11,z-side*.37,.10,.10,.84);
        k.box(0x555b58,x,6.08,z-side*.86,.26,.12,.48);
      }
    }
    for(const x of [-half,half])k.box(edge,x,-2.95,0,2.35,5.33,12.09);
    // Palm crowns occupy the two riverside plots flanking the western
    // abutment, visible in the geotagged view over the junction.
    const firstPalm=k.group.children.length;
    window.CentralArch.trees(T,k,[[-330.9,-40.8,8.4],[-329.6,-30.4,7.3],[-327.6,-18.7,8.1],
      [-327.3,10.3,7.8],[-331.3,16.2,7.1],[-331.9,24.9,8.7],[-332.5,33.5,7.5]].map(([x,z,h])=>({x,z,h,width:5.0,kind:'palm'})));
    const palms=k.group.children.slice(firstPalm);
    // Road height is sampled by the driving renderer. Apply its profile to
    // both the rails and the underside, including at the approaches.
    let rest,previous;
    k.group.userData.fitGround=ground=>{
      const geometry=k.group.children.at(-1).geometry,p=geometry.attributes.position;
      const intervals=80,width=length/intervals;
      const levels=Array.from({length:intervals+1},(_,i)=>ground(-half+i*width,0));
      const north=ground(-344,-42),south=ground(-345,43);
      for(const palm of palms)palm.position.y=palm.position.z<0?north:south;
      if(previous&&levels.every((value,i)=>Math.abs(value-previous[i])<.01))return;
      previous=levels;rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      for(let i=0;i<p.count;i++){
        const fraction=Math.max(0,Math.min(intervals,(p.getX(i)+half)/width)),j=Math.min(intervals-1,Math.floor(fraction));
        p.setY(i,rest[i]+levels[j]+(levels[j+1]-levels[j])*(fraction-j));
      }
      p.needsUpdate=true;geometry.computeBoundingSphere();geometry.computeBoundingBox();
    };
  }
  (window.VietnamSights??=[]).push({id,catalogId,name:'Cầu Nhật Lệ 1',lon,lat,yaw,region:'Trung Bộ',city:'Đồng Hới',province:'Quảng Trị',formerProvince:'Quảng Bình',
    kind:'Cầu',width:length,depth:12,gardenRadius:1,viewDistance:1750,start:[106.6242889,17.4711827],mappedEntrance:true,visitOnArrival:true,
    solids:[[0,-5.91,half,.10],[0,5.91,half,.10]],source,map:'https://www.openstreetmap.org/way/979538328',photo:'https://commons.wikimedia.org/?curid=4279878',
    description:'Cầu Nhật Lệ 1 nối Đồng Hới với bán đảo Bảo Ninh. Khi thông xe năm 2004, cầu dài 635 m, rộng 12 m, có 15 nhịp. Cảnh thể hiện mặt cầu trước đợt mở rộng dự kiến năm 2027–2028. Khoảng cách giữa từng trụ và độ sâu dầm được ước lượng từ ảnh.',
    arrivalNote:'Xe dừng trên đường Quách Xuân Kỳ ở phía nam vòng xuyến đầu cầu. Từ lối đi bộ bên sông có thể nhìn qua gầm cầu về phía Bảo Ninh.',views,build});
})();
