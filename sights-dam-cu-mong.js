'use strict';
(()=>{
  const catalogId='osm-node-4472649089',stop=window.VietnamTourism.byId.get(catalogId);
  const id='long-be-bac-dam-cu-mong';
  // Surveyed rectangles from the overhead view at the Atlas pin. Centre east
  // and south in metres, long/short side, clockwise axis, approximate bays.
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=109.2149,13.625206&level=18
  // The provincial panorama shows the changing pattern of floating cages.
  // https://daklakvrtour.com/tour/162/index.html
  const pens=[
    [54.6,-.9,63.5,26.7,36,12,5],[24.1,5.5,23.3,8.7,125,5,2],
    [56,40,49.6,10.4,125,9,2],[34.2,54.3,15.8,9.3,28,3,2],
    [70.2,-96.3,50.6,33.1,127,9,6],[42.9,-117.5,36.5,8.7,-57,8,2],
    [50.5,-102.4,15.5,12.8,34,2,2],[-27.3,-146.3,36.7,16.3,125,7,3],
    [-23.2,-121.3,31.4,8.7,39,7,2],[196.7,-43.2,36.4,36.6,61,7,7],
    [201.1,-12.5,18.9,8.7,-130,4,2],[-166.9,-13.3,26.8,8.7,-66,6,2],
    [-146.8,10.2,35.7,15.7,32,7,3],[-131.2,13.3,16.4,8.7,135,4,2],
    [121.9,29.3,41.1,13.3,-54,9,3],[101.6,25,34.1,8.1,-55,8,2],
    [6.4,64.1,21,19.7,39,4,4],[17.7,91.4,22.4,13.9,-53,5,3],
    [99.8,85.9,33.2,13.9,-36,7,3],[166,144.5,62.1,18,123,14,4],
    [67,102.1,24.2,21.5,46,5,4],[-27,63.3,17.1,15.1,-55,3,3],
    [100.7,140.2,29.4,11.6,-105,5,2]
  ];
  // Only the light roofs identifiable from overhead have shelters.
  const roofs=[[48,-94,3.2,3.7,35],[-37,-135,3.5,4.2,35],[186,-32,3.3,4.3,-29],
    [-165,-1,3.3,4.4,31],[4,68,3.6,3.8,39],[127,27,3,4.1,36]];
  function build(T,k){
    const placements=[],cube=new T.BoxGeometry(1,1,1),pose=new T.Object3D();
    const netPoints=[],netColors=[],netIndex=[];
    function part(x,y,z,length,height,width,angle,color){
      pose.position.set(x,y,z);pose.rotation.set(0,-angle,0);pose.scale.set(length,height,width);
      pose.updateMatrix();placements.push([pose.matrix.clone(),color]);
    }
    for(const [x,z,length,width,degrees,nx,nz] of pens){
      const angle=degrees*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
      // The dark squares visible from above are net pens. Keep the openings
      // translucent so the ripples and reflections remain visible.
      const netStart=netPoints.length/3,netColor=new T.Color(width>18?0x4f4b49:0x365b58);
      for(const [u,v] of [[-length/2,-width/2],[-length/2,width/2],[length/2,width/2],[length/2,-width/2]]){
        netPoints.push(x+c*u-s*v,.105,z+s*u+c*v);
        netColors.push(netColor.r,netColor.g,netColor.b);
      }
      netIndex.push(netStart,netStart+1,netStart+2,netStart,netStart+2,netStart+3);
      for(let i=0;i<=nz;i++){
        const v=width*(i/nz-.5),edge=i===0||i===nz;
        part(x-s*v,.36,z+c*v,length,.19,edge?.63:.40,angle,edge?0x967e68:0xa19079);
      }
      for(let i=0;i<=nx;i++){
        const u=length*(i/nx-.5),edge=i===0||i===nx;
        part(x+c*u,.38,z+s*u,edge?.57:.32,.17,width,angle,edge?0x947964:0xa6947c);
        for(const v of [-width/2,width/2]){
          part(x+c*u-s*v,.04,z+s*u+c*v,1.14,.48,.68,angle,0x354b50);
        }
      }
    }
    for(const [x,z,w,d,degrees] of roofs){
      const a=degrees*Math.PI/180;
      part(x,1.29,z,w,1.82,d,a,0x827e73);
      part(x,2.24,z,w+.48,.16,d+.55,a,0xb7bbb4);
    }
    const frames=new T.InstancedMesh(cube,new T.MeshStandardMaterial({roughness:.93}),placements.length);
    const tint=new T.Color();
    placements.forEach(([matrix,color],i)=>{frames.setMatrixAt(i,matrix);frames.setColorAt(i,tint.setHex(color));});
    frames.name='Khung ô lồng và mái chòi đầm Cù Mông';frames.computeBoundingSphere();k.group.add(frames);
    const netGeo=new T.BufferGeometry();
    netGeo.setAttribute('position',new T.Float32BufferAttribute(netPoints,3));
    netGeo.setAttribute('color',new T.Float32BufferAttribute(netColors,3));netGeo.setIndex(netIndex);
    const nets=new T.Mesh(netGeo,new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.43,depthWrite:false}));
    nets.name='Mặt lồng lưới';nets.renderOrder=3;k.group.add(nets);
    // Wait for the actual streamed water patch and fit every connected raft
    // to one water level. Drawing directly on the seabed submerges the frames.
    let fit=true;
    k.group.userData.fitGround=()=>{fit=true;};
    frames.onBeforeRender=()=>{
      if(!fit||typeof gfx==='undefined'||typeof roads==='undefined'||!roads?.point)return;
      const center=roads.point(stop.lon,stop.lat),water=gfx?.waterAt?.(center.x,center.z);
      if(!Number.isFinite(water?.level))return;
      frames.position.y=nets.position.y=water.level-k.group.position.y;
      frames.updateMatrixWorld();nets.updateMatrixWorld();fit=false;
    };
  }
  const view=(name,offset,height,viewRadius,viewAngle,viewElevation)=>(
    {name,offset,height,viewRadius,viewAngle,viewElevation,viewFov:57,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...stop,id,catalogId,yaw:0,width:400,depth:330,gardenRadius:0,reserve:()=>false,solids:[],
    description:'Ở đầu bắc đầm Cù Mông, những cụm bè có ô lồng vuông xen các lối nước dành cho thuyền. Cảnh dựng lại một phần vùng nuôi theo ảnh vệ tinh. Số bè và vị trí neo thay đổi theo vụ.',
    views:[view('Nhìn dọc vùng bè phía bắc',[44,2],2.0,122,-2.50,.54),
      view('Ô lồng và lối nước giữa hai bè',[50,4],1.0,53,.77,.17),
      view('Chòi canh bên cụm bè có hai nhánh',[51,-96],2.1,72,-.69,.30)],build});
})();
