'use strict';
(()=>{
  const id='bo-dong-nam-ho-lak',catalogId='osm-node-1765142229';
  const stop=window.VietnamTourism.byId.get(catalogId);
  const {lon,lat}=stop.lookout;
  const mx=111320*Math.cos(lat*Math.PI/180);
  const at=(longitude,latitude)=>[(longitude-lon)*mx,(lat-latitude)*111320];
  // Google z20 resolves the two ends, the strip of open ground at the head,
  // and the canopy immediately east of it. Esri z18 confirms the alignment.
  // https://www.google.com/maps/@12.41247,108.18204,153m/data=!3m1!1e3
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=108.18205,12.41247&level=18
  // The operator identifies the lakeside restaurant but its facade and the
  // landing's substructure cannot be measured in these views.
  // https://daklaktourist.com.vn/lak-resort/
  const head=at(108.1820633,12.4125030),tip=at(108.1820203,12.4124048);
  const length=Math.hypot(tip[0]-head[0],tip[1]-head[1]);
  const dx=(tip[0]-head[0])/length,dz=(tip[1]-head[1])/length;
  function build(T,k){
    // A single continuous grey-brown surface. Neither board spacing nor the
    // support material is legible. Only the short blend at the head is inland.
    const inset=1.20;
    const deck=new T.BoxGeometry(1.76,.14,length+inset,1,1,11);
    deck.translate(0,-.08,(length-inset)/2);
    deck.rotateY(Math.atan2(dx,dz));deck.translate(head[0],0,head[1]);
    const deckSurface=new T.MeshStandardMaterial({color:0x847c6c,roughness:.96});
    deckSurface.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 landingPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nlandingPoint=position.xz;');
      shader.fragmentShader='varying vec2 landingPoint;\n'+shader.fragmentShader.replace('#include <color_fragment>',
        `#include <color_fragment>
        float wash=sin(dot(landingPoint,vec2(2.7,1.9))+.6*cos(landingPoint.y*4.2));
        diffuseColor.rgb*=.95+.035*wash+.015*cos(dot(landingPoint,vec2(11.2,8.7)));`);
    };
    const landing=new T.Mesh(deck,deckSurface);
    landing.name='Mặt cầu tàu Lắk Resort';landing.castShadow=landing.receiveShadow=true;
    k.group.add(landing);
    const treesBegin=k.group.children.length;
    createTreeModels(T).grove(k.group,[[8.9,0,2.7,6.6,7.4,.34],[12.4,0,-5.2,7.2,8.4,1.9],
      [7.1,0,-11.4,5.8,7.1,-1.1],[-8.8,0,-23.1,7.6,8.3,.81]]);
    const trees=k.group.children.slice(treesBegin);
    const pos=deck.attributes.position,rest=Array.from({length:pos.count},(_,i)=>pos.getY(i));
    // The game's shore mesh starts with a shallow bank, then drops more
    // quickly towards the lake. Keep the short landward end in contact.
    const shoulder=1.18;
    function setDeck(a,join,b){
      for(let i=0;i<pos.count;i++){
        const along=(pos.getX(i)-head[0])*dx+(pos.getZ(i)-head[1])*dz;
        const bankPart=Math.min(1,Math.max(0,(along+inset)/(shoulder+inset)));
        const lakePart=Math.max(0,(along-shoulder)/(length-shoulder));
        pos.setY(i,rest[i]+a+(join-a)*bankPart+(b-join)*lakePart);
      }
      pos.needsUpdate=true;deck.computeVertexNormals();deck.computeBoundingBox();deck.computeBoundingSphere();
    }
    let fitWater=false;
    k.group.userData.fitGround=ground=>{
      setDeck(ground(head[0]-dx*inset,head[1]-dz*inset)+.05,
        ground(head[0]+dx*shoulder,head[1]+dz*shoulder)+.11,ground(tip[0],tip[1])+.33);
      // The patch for the newly streamed district is active at first draw.
      // Read its water height beside the tip to match the visible waterline.
      fitWater=true;
      for(const tree of trees){
        const poses=tree.instanceMatrix;
        for(let i=0;i<tree.count;i++){
          const j=i*16+12;
          poses.array[j+1]=ground(poses.array[j],poses.array[j+2])-.04;
        }
        poses.needsUpdate=true;tree.computeBoundingSphere();
      }
    };
    landing.onBeforeRender=()=>{
      if(!fitWater)return;
      const anchor=typeof roads!=='undefined'&&roads?.point?roads.point(lon,lat):null;
      const water=anchor&&typeof gfx!=='undefined'&&gfx?.waterAt?.(anchor.x+tip[0],anchor.z+tip[1]);
      if(water&&Number.isFinite(water.level)){
        const bankTop=(s,w)=>gfx.ground(anchor.x+head[0]+dx*s+dz*w,anchor.z+head[1]+dz*s-dx*w)-k.group.position.y;
        setDeck(bankTop(-inset,0)+.05,Math.max(bankTop(shoulder,-.88),bankTop(shoulder,.88))+.11,
          water.level-k.group.position.y+.50);
      }
      fitWater=false;
    };
  }
  (window.VietnamSights??=[]).push({...stop,id,catalogId,lon,lat,yaw:0,
    kind:'Điểm ngắm cảnh',locality:'Liên Sơn',width:15,depth:18,gardenRadius:5,reserve:()=>false,solids:[],
    source:'https://daklaktourist.com.vn/lak-resort/',
    map:'https://www.openstreetmap.org/?mlat=12.4125030&mlon=108.1820633#map=19/12.4125030/108.1820633',
    description:'Từ khoảng sân bên hồ của Lắk Resort, cầu tàu vươn gần 12 m về hướng nam tây nam. Bề rộng khoảng 1,7 m và hướng của mặt cầu được ước theo ảnh vệ tinh. Độ dốc trong cảnh thay đổi theo địa hình và mực nước mô phỏng.',
    arrivalNote:'Xe dừng trên đường Âu Cơ ở đầu lối vào Lắk Resort. Từ đây, khoảng cách đường chim bay đến cầu tàu là 93 m.',
    views:[...stop.views,{name:'Mặt cầu tàu bên vũng nước',offset:[(head[0]+tip[0])/2,(head[1]+tip[1])/2],
      viewRadius:15,viewAngle:-2.04,viewElevation:.43,height:-1.3,
      description:'Nhìn chéo qua mặt cầu hẹp ra vũng hồ. Hai đầu mặt cầu được đặt theo ảnh vệ tinh. Màu bề mặt và cao độ so với nước là phần mô phỏng.'}],build});
})();
