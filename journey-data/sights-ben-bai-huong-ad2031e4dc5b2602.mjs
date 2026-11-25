const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='ben-bai-huong-vung-ro',catalogId='phu-yen-loi-xuong-bai-huong';
  const raw=window.VietnamTourism.byId?.get(catalogId)??window.VietnamTourism.entries.find(e=>e.id===catalogId);
  if(!raw)return;
  const lon=109.4291764,lat=12.8811792;
  const source='https://csdl.vietnamtourism.gov.vn/dest/?item=616';
  const photo='https://daklakreview.vn/topAZ/be-noi-vung-ro';
  // Bãi Hương is a cluster of floating businesses. The visitor's picture of
  // the Hiền Viên approach shows timber boards, a low red rail and, at the
  // landward end, a short corrugated canopy with yellow framing and chimes.
  // https://static.daklakreview.vn/files/10-be-noi-vung-ro-hai-san-tuoi-ngam-bien-dep-1785661927348.jpg
  // The two outlined roof sections, open pen frames and the bend in the
  // gangway follow one WorldView-3 image, 2025-03-26, 0.31 m imagery.
  // WorldView-2 (2023-07-12) shows the same landfall, with a straighter
  // floating section. Esri reports 5 m horizontal accuracy for both images.
  // https://www.arcgis.com/home/item.html?id=83b1b21c156f4c62a6dc0d90b088879c
  // https://www.arcgis.com/home/item.html?id=356472a9dc3942a28c6c0ad2294d0751
  // The operator's reception pin is on land, about 17 m from the gangway.
  // https://www.benoivungro.com/
  // Provincial transport officials distinguish the existing floating units
  // from proposed public passenger piers around Vũng Rô (August 2026).
  // https://tuoitre.vn/dak-lak-dau-tu-ben-thuy-noi-dia-phuc-vu-khach-tham-quan-tour-dao-100260823110224913.htm
  const tint={deck:0xb49973,board:0xab8c69,frame:0x786347,rail:0xad5143,
    float:0x416174,metal:0x8b9698,gold:0xd0a444,post:0xc2c5b7,roof:0xa45f4d};
  // East/south metres from the landfall. The pens are open water between
  // narrow members; their contents, hull numbers and moorings are unknown.
  const path=[[0,-1],[.40,17.0],[1.4,40.6],[2.5,63.5],[4.1,73.9],[7.6,85.5],[11.45,99.5],[12.19,103.57]];
  const house={x:15.95,z:115.1,angle:.17,w:15.8,d:24.3};
  const views=[
    {name:'Cầu dẫn và bè nhìn từ mặt vịnh',offset:[10,80],viewAngle:.69,viewRadius:119,viewElevation:.36,height:3.8,viewFov:55,viewBase:'monument'},
    {name:'Qua mái che đầu cầu dẫn',offset:[.4,13.8],viewAngle:-3.10,viewRadius:21.0,viewElevation:.082,height:3.25,viewFov:59,viewBase:'monument'}
  ];
  // The coarse coastal water mask interprets several adjacent raft roofs as
  // a single island. The WV02 and WV03 images both show water around this
  // footprint, about 100 m beyond shore. Use the game's water shader there.
  function underRaft(T,k){
    const lake=createDrivingWater(T,false),geo=new T.PlaneGeometry(114,75,38,25);
    geo.rotateX(-Math.PI/2);geo.translate(32,0,115);
    const p=geo.attributes.position,profiles=new Float32Array(p.count*3);
    for(let i=0;i<p.count;i++)profiles[i*3+2]=20;
    geo.setAttribute('riverProfile',new T.Float32BufferAttribute(profiles,3));
    const compile=lake.material.onBeforeCompile;
    lake.material.onBeforeCompile=shader=>{
      compile(shader);
      shader.fragmentShader=shader.fragmentShader.replace('#include <alphamap_fragment>',`
        #include <alphamap_fragment>
        vec2 edgeDepth=vec2(57.,37.5)-abs(localWater-vec2(32.,115.));
        diffuseColor.a*=smoothstep(.4,15.,min(edgeDepth.x,edgeDepth.y));
        if(diffuseColor.a<.003)discard;`);
    };
    lake.material.customProgramCacheKey=()=>'bai-huong-water';
    const mesh=new T.Mesh(geo,lake.material);
    mesh.receiveShadow=true;mesh.name='Mặt vịnh quanh sàn bè';
    mesh.onBeforeRender=()=>lake.update(performance.now()*.001,0);
    k.group.add(mesh);
    return (water,top)=>{
      for(let i=0;i<p.count;i++){
        const x=p.getX(i),z=p.getZ(i);
        const t=Math.max(0,Math.min(1,(57-Math.abs(x-32))/13,(37.5-Math.abs(z-115))/13));
        p.setY(i,water-.15+(top-water+.15)*t*t*(3-2*t));
      }
      p.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();
    };
  }
  function build(T,k){
    const fitWater=underRaft(T,k);
    k.palette({timber:[tint.deck,tint.frame,tint.board],metal:[tint.metal,tint.roof,tint.rail]});
    // A narrow box between endpoints also works in the rotated raft frame.
    function member(colour,a,b,width,height=width){
      const delta=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),len=delta.length();
      const rot=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),delta.normalize());
      const r=new T.Euler().setFromQuaternion(rot,'YXZ');
      k.box(colour,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,width,height,len+.012,r.y,r.x,r.z);
    }
    const deck=.53,planks=[0xab8d69,0xb69a75,0xb99e7e,0xa98b68,0xb49671];
    function walk(a,b,i){
      const dx=b[0]-a[0],dz=b[1]-a[1],d=Math.hypot(dx,dz),angle=Math.atan2(dx,dz);
      k.place((a[0]+b[0])/2,(a[1]+b[1])/2,angle,()=>{
        const segments=Math.ceil(d/.29),bayCount=Math.ceil(d/2.7);
        k.box(tint.frame,0,deck-.123,0,1.85,.15,d+.035);
        for(let j=0;j<segments;j++)
          k.box(planks[(j*11+i*3)%5],0,deck-.036,-d/2+(j+.5)*d/segments,1.96,.072,d/segments-.014);
        for(const side of [-1,1]){
          const x=side*.93;
          for(let j=0;j<bayCount;j++){
            const z=-d/2+j*d/bayCount;
            k.box(tint.frame,x,deck+.45,z,.066,.92,.066);
          }
          k.box(tint.rail,x,deck+.91,0,.078,.072,d+.025);
          k.box(0x968773,x,deck+.41,0,.031,.030,d+.025);
        }
        if(i>0)for(let j=0;j<Math.floor(d/5.7);j++)
          k.box(tint.float,0,.035,-d/2+(j+.5)*5.7,2.09,.39,.82);
      });
    }
    path.slice(1).forEach((b,i)=>walk(path[i],b,i));
    function gable(x,z,w,d,eave,rise,angle,roof,frame){
      // Two sloping corrugated sheets, with open gable ends and paired uprights.
      k.place(x,z,angle,()=>{
        const half=w/2,len=Math.hypot(half,rise),slope=Math.atan2(rise,half);
        for(const side of [-1,1]){
          k.box(roof,side*half/2,eave+rise/2,0,len,.088,d,0,0,-side*slope);
          const n=Math.round(half/.26);
          for(let i=0;i<=n;i++){
            const xx=half*i/n;
            k.box(roof,side*xx,eave+rise*(1-xx/half)+.060,0,.046,.060,d,0,0,-side*slope);
          }
          k.box(frame,side*(half-.12),eave-.075,0,.13,.18,d-.06);
        }
        const bays=Math.max(1,Math.ceil(d/4));
        for(let j=0;j<=bays;j++){
          const zz=-d/2+.20+(d-.40)*j/bays;
          for(const side of [-1,1]){
            k.box(d<7?tint.post:frame,side*(half-.27),(eave+deck)/2,zz,.12,eave-deck,.13);
            member(frame,[side*(half-.13),eave,zz],[0,eave+rise,zz],.12,.12);
          }
          k.box(frame,0,eave-.08,zz,w-.28,.14,.13);
        }
      });
    }
    gable(.10,2.7,2.65,5.8,2.75,.74,.022,tint.metal,tint.gold);
    const pipes=[0xae4d43,0x4c797f,0x92904a,0xc68d3b,0x4e6981];
    for(const side of [-1,1])for(let i=0;i<8;i++){
      const x=side*1.11,z=.28+i*.66,length=.31+(i%3)*.087;
      k.box(0x888878,x,2.47,z,.011,.42,.011);
      k.tapered(pipes[(i+(side+1))%5],x,2.26-length/2,z,.048,.048,length,1,7);
    }
    const {x,z,angle,w,d}=house;
    k.place(x,z,angle,()=>{
      k.box(tint.frame,0,deck-.22,0,w+.92,.34,d+.90);
      k.box(tint.deck,0,deck-.056,0,w+.84,.12,d+.82);
      for(let j=0;j<d;j+=.43)k.box(tint.board,0,deck+.008,j-d/2,w+.75,.012,.016);
      // The eastern edge projects past the main roof; the southern grid is
      // water open to the sky, with a narrow walkway around its outside.
      for(const zz of [-9,-4.5,0,4.5,9,13.4,17.7])
        k.box(tint.deck,w*.5+2.1,deck-.058,zz,4.5,.122,.42);
      for(const xx of [w*.5+.15,w*.5+4.28])
        k.box(tint.frame,xx,deck-.08,4.35,.35,.22,27.15);
      for(const xx of [-6.7,-3.1,.55,4.2,8.05])
        k.box(tint.board,xx,deck-.08,15.1,.32,.20,6.9);
      for(const zz of [14.9,18.5])k.box(tint.frame,.6,deck-.10,zz,15.1,.23,.33);
      for(let i=0;i<8;i++)for(const side of [-1,1])
        k.box(tint.float,side*(w/2+.27),.04,-d/2+1.45+3.13*i,.64,.53,1.26);
    });
    gable(x,z,w,d,3.50,1.44,angle,tint.roof,tint.frame);
    // Smaller light-coloured roof at the NE corner in both aerial images.
    k.place(x,z,angle,()=>gable(w*.5+1.42,-d*.35,4.0,6.8,2.96,.65,0,0xb4b2a2,tint.frame));
    let geometry,rest,previous;
    k.group.userData.fitGround=ground=>{
      geometry??=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;
      if(!geometry)return;
      const p=geometry.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      const pin=roads.point(lon,lat),base=k.group.position.y;
      const water=(x,z)=>{const wet=gfx.waterAt?.(pin.x+x,pin.z+z);return wet&&Number.isFinite(wet.level)?wet.level-base:null;};
      const sea=water(0,160)??ground(0,160)-.59;
      const level=Math.max(sea+.12,ground(x,z)+.11);
      const bank=Math.max(sea,ground(0,-1)+.055-deck);
      // The renderer grades coastal water up to the DEM at the strand. Sample
      // that narrow transition so a single water cell cannot drown the bridge.
      const profile=[[-1,bank],[1.5,bank],...[5,9,13,18,23,28,35,45,60,72].map(z=>{
        const u=z*.05;return [z,water(u,z)??Math.max(sea,ground(u,z)-deck+.045)];
      }),[98,level]];
      const key=JSON.stringify(profile);
      if(key===previous)return;
      previous=key;
      fitWater(sea,level);
      function height(z){
        for(let i=1;i<profile.length;i++)if(z<profile[i][0]){
          const [a,low]=profile[i-1],[b,high]=profile[i];
          return low+(high-low)*Math.max(0,(z-a)/(b-a));
        }
        return level;
      }
      for(let i=0;i<p.count;i++){
        p.setY(i,rest[i]+height(p.getZ(i)));
      }
      p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();
      views[0].height=(level+1.75)/.46;views[1].height=(height(13.8)+1.55)/.46;
    };
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Lối xuống bè ở Bãi Hương',kind:'Bến tàu',
    lon,lat,yaw:0,start:raw.start,mappedEntrance:true,visitOnArrival:true,foundationAt:[16,115],
    width:36,depth:131,solids:[],gardenRadius:0,reserve:(x,z)=>z>-3&&z<130&&Math.abs(x-.12*z)<(z>98?15:2),
    source,photo,map:'https://livingatlas.arcgis.com/wayback/#mapCenter=109.42924%2C12.88071%2C18',
    arrivalNote:'Xe dừng trên Quốc lộ 29 ở Bãi Hương. Từ đường xuống mép vịnh khoảng 65 m. Hộ đón khách sẽ chỉ lối ra bè và ca nô đi Hòn Nưa.',
    description:'Ở Bãi Hương, khách đi Hòn Nưa có thể xuống ca nô từ các bè ven bờ Vũng Rô. Tại lối này, sau mái che ngắn là cầu ván hẹp đi ra vịnh rồi chếch về phía đông. Hình cầu và bè theo ảnh vệ tinh tháng 3 năm 2025. Vị trí bè thay đổi theo chỗ neo. Vị trí mái che dọc cầu và chiều cao tay vịn được ước lượng từ ảnh mặt đất.',
    views,build});
})();

export default window.VietnamSights;
