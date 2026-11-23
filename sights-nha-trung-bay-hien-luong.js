'use strict';
(()=>{
  const id='nha-trung-bay-hien-luong',catalogId='osm-node-1016631101';
  const pin=window.VietnamTourism.byId.get(catalogId);
  if(!pin)return;
  const lon=107.0514136,lat=17.0060521,yaw=-1.29;
  const photo='https://commons.wikimedia.org/wiki/File:Nh%C3%A0_b%E1%BA%A3o_t%C3%A0ng_Hi%E1%BB%81n_L%C6%B0%C6%A1ng_-_panoramio.jpg';
  // The 21.6 × 21.1 m red hip roof lies immediately east of OSM w87429774.
  // The old outline now covers the approach paving in World Imagery. The
  // original photograph looks east across the road and the white fence.
  const cream=0xe4c18e,band=0xc69d6e,trim=0xf0d4a3,stone=0xad9d8b,
    tile=0x995541,ridge=0xb16a52,paving=0xa27765,frame=0x806b55,glass=0x454b45;
  const c=Math.cos(yaw),s=Math.sin(yaw);
  function camera(name,tx,tz,ex,ez,h,eye,fov,description){
    const dx=c*(ex-tx)+s*(ez-tz),dz=-s*(ex-tx)+c*(ez-tz),dy=eye-h;
    return {name,offset:[c*tx+s*tz,-s*tx+c*tz],height:h/.46,viewBase:'monument',
      viewAngle:Math.atan2(dx,dz),viewRadius:Math.hypot(dx,dz,dy),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),
      viewFov:fov,description};
  }
  const views=[
    camera('Mặt nhà trưng bày nhìn từ cổng',0,4,0,47,3.8,2.7,49,
      'Qua cổng hàng rào trắng, lối gạch đỏ dẫn tới bậc thềm. Hai dãy ô cửa cao nằm dưới mái ngói bốn phía.'),
    camera('Hai loa nón và bậc thềm',0,10,-12,25,2.1,3.05,59,
      'Hai loa nón đặt hai bên cầu thang trong ảnh tư liệu của nhà trưng bày. Từ chân thềm nhìn lên thấy những hàng gạch ngang quanh cửa chính.'),
    camera('Nhìn qua quốc lộ từ phía Kỳ đài',0,0,2.3,118.9,3.3,12.5,22,
      'Vị trí ghi trên ảnh của ChieuTimViet ở phía Kỳ đài, bên kia đường. Từ trên cao thấy mái ngói, hai dải sân hai bên bậc và cổng trắng ở sát đường.')
  ];
  const cameraHeights=views.map(view=>view.height);
  function horn(T,k,x){
    const pole=0x797768,alloy=0xa5a698,inside=0x6a6e65;
    k.box(stone,x,.13,16.2,1.45,.26,1.12);
    k.box(pole,x,.90,16.2,.18,1.6,.18);
    const profile=[[.13,0],[.21,.34],[.44,.75],[.73,1.04],[.78,1.08],[.78,1.11],[.73,1.12],[.42,.81],[.16,.38]];
    const cone=new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y)),24);
    k.stamp(cone,alloy,x,1.52,15.81,1,1,1,0,1.27);cone.dispose();
    const cap=new T.SphereGeometry(.19,10,6);k.stamp(cap,inside,x,1.60,16.10);cap.dispose();
  }
  function build(T,k){
    k.palette({plaster:[cream,trim,band],tile:[tile,ridge],stone:[stone,paving],timber:frame,glass});
    k.box(stone,0,.52,0,20.5,1.23,19.9);
    k.box(cream,0,3.48,-.86,19.9,4.86,17.3);
    for(const sign of [-1,1]){
      k.box(cream,sign*6.16,3.48,8.69,7.57,4.86,1.95);
      k.box(band,sign*6.16,1.38,9.68,7.57,.37,.16);
      k.box(trim,sign*6.16,2.47,9.69,7.56,.16,.14);
      for(let i=0;i<5;i++){
        const x=sign*(4.41+1.12*i);
        k.box(frame,x,4.94,9.70,.72,.94,.11);
        k.box(glass,x,4.95,9.77,.55,.75,.048);
        k.box(band,x,4.94,9.82,.047,.77,.035);
      }
      for(let i=0;i<3;i++){
        k.box(frame,sign*3.97,2.52+i*.64,9.77,.64,.57,.11);
        k.box(band,sign*3.97,2.53+i*.64,9.84,.44,.37,.055);
      }
      for(const y of [2.30,2.82,3.36,3.90])k.box(band,sign*3.15,y,9.73,1.54,.05,.095);
      for(let i=0;i<6;i++){
        k.box(frame,sign*9.98,4.29,-7.3+i*2.61,.10,.93,.88);
        k.box(glass,sign*10.05,4.29,-7.3+i*2.61,.044,.75,.70);
      }
      horn(T,k,sign*7.75);
    }
    k.box(frame,0,2.46,7.92,4.65,2.94,.14);
    for(const sign of [-1,1])k.box(glass,sign*.95,2.43,8.01,1.80,2.62,.048);
    k.box(cream,0,4.88,8.72,5.0,1.99,1.92);
    k.box(trim,0,5.86,0,20.6,.24,20.1);
    k.box(band,0,6.12,0,21.65,.30,21.03);
    k.tapered(tile,0,7.32,0,15.31,.39,2.21,.972,4);
    k.box(ridge,0,8.46,0,.56,.10,.54);
    for(let i=0;i<8;i++)k.box(paving,0,.072*(8-i),9.64+(i+.5)*.36,9.30,.144*(8-i),.37);
    k.box(paving,0,.065,23.9,6.0,.13,23.0);
    for(const sign of [-1,1]){
      k.box(stone,sign*11.40,.033,5.2,2.1,.09,25.6);
      k.box(0x7d855f,sign*7.52,.11,23.05,6.55,.20,12.45);
      k.box(0xe2dbbf,sign*8.93,.46,35.3,11.6,.17,.26);
      k.box(0xe2dbbf,sign*8.93,.90,35.3,11.6,.15,.26);
      for(let i=0;i<21;i++)k.box(0xe2dbbf,sign*(3.23+i*.56),.64,35.30,.19,1.24,.23);
    }
    const trees=[[-12.6,20.2,3.7],[12.9,21.9,4.6],[-13.7,-7.8,6.5],[14,-10.3,7.5],[14.7,2.5,5.6],
      [-17,-15,6.9],[-10,-19,7.7],[-4,-20.4,8.1],[2,-19.9,7.3],[9.7,-18.4,8.5],[16.5,-15.7,7.6],
      [-18.3,-22.5,7.8],[-12,-25.2,8.7],[-5.6,-27.3,8.0],[2,-26.1,9.1],[11.3,-25.4,8.6],[17.8,-23.1,7.4]];
    window.CentralArch.trees(T,k,trees.map(([x,z,h])=>({x,z,h})));
    let original;
    k.group.userData.fitGround=ground=>{
      const level=Math.max(0,...[-10,0,10].flatMap(x=>[-10,0,10].map(z=>ground(x,z))),ground(0,16));
      original??=k.group.children.map(child=>child.position.y);
      k.group.children.forEach((child,i)=>{child.position.y=original[i]+level;});
      views.forEach((v,i)=>{v.height=cameraHeights[i]+level/.46;});
    };
  }
  (window.VietnamSights??=[]).push({...pin,id,catalogId,name:'Nhà trưng bày Vĩ tuyến 17 và khát vọng thống nhất',
    lon,lat,yaw,city:'Vĩnh Linh',locality:'Bờ bắc Hiền Lương',kind:'Bảo tàng',width:22,depth:21,
    start:[107.0502153,17.0062013],approachMeters:130,mappedEntrance:true,visitOnArrival:true,viewDistance:700,
    modeledBuildings:['w87429774'],solids:[[0,0,10.25,9.95]],reserve:(x,z,pad)=>Math.abs(x)<13+pad&&z> -11-pad&&z<35.5+pad,
    map:'https://www.openstreetmap.org/node/1016631101',photo,source:'https://dsvh.gov.vn/di-tich-lich-su-doi-bo-hien-luong-ben-hai-2974',
    description:'Nhà trưng bày ở phía đông Quốc lộ 1, đối diện khu Kỳ đài Hiền Lương. Tư liệu và hiện vật kể lại đời sống hai bờ Bến Hải trong những năm đất nước chia cắt. Dấu mái lấy theo ảnh vệ tinh. Cao độ, các ô cửa và loa trước thềm theo tỷ lệ ảnh mặt đứng.',
    arrivalNote:'Xe dừng ở đường nhánh ven sân Kỳ đài. Nhà trưng bày nằm bên kia Quốc lộ 1, lối vào qua cổng hàng rào trắng.',views,build});
})();
