'use strict';
(()=>{
  const id='vuon-quoc-gia-u-minh-ha',catalogId='osm-relation-15805643',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  const source='https://bvhttdl.gov.vn/ca-mau-vuc-day-du-lich-u-minh-ha-20230724154050978.htm';
  const photo='https://doanhnghieptiepthi.vn/ve-rung-quoc-gia-u-minh-ha-de-cung-hoa-minh-voi-thien-nhien-161220506092524799.htm';
  // East/south metres from the centroid of OSM w1228794103 (5.54 × 5.07 m).
  // The park entrance n7902288686 sits on w782143152, 13 m outside the customers' gate n11395564380.
  // The crossing, outbuildings and approach are corroborated by the oblique aerial photograph:
  // https://nangluongsachvietnam.vn/d6/vi-VN/news/Phe-duyet-De-an-du-lich-sinh-thai-nghi-duong-giai-tri-vuon-quoc-gia-U-Minh-Ha-6-38-21447
  // Upper landing, rails, hipped cap, bridge and canal vegetation:
  // https://baophapluat.vn/kham-pha-dat-rung-u-minh-post460535.html
  // Visitor tower height (about 24 m) and the continuous peat-swamp canopy:
  // https://nhandan.vn/nho-rung-u-minh-ha-post726773.html
  const road=[[-455,-17.1],[-149,-9.46],[-69.5,-8.88],[-57.6,-5.47],[-39.12,2.87],[-19.06,14.43],[-6.53,23.77],[8.88,28.32],[33.73,30.59],[53.24,31.08],[90.9,27.66],[110.4,21.1],[145,3.2],[170.6,-2.5],[187.8,-2.43],[395,3.47],[640,7]];
  const canal=[[-640,-24.3],[-378,-20.27],[-225.4,-14.74],[-58.2,-16.29],[38.51,-15],[100.9,-12.31],[217,-10.98],[353,-9.22],[640,-6]];
  const branch=x=>38.51+(x+15)*.041;
  function at(rows,z){
    let j=1;while(j<rows.length-1&&z>rows[j][0])j++;
    const [a,x]=rows[j-1],[b,xx]=rows[j],t=Math.max(0,Math.min(1,(z-a)/(b-a)));return x+(xx-x)*t;
  }
  function clear(x,z,pad=0){
    return z>-31-pad&&z<29+pad&&x>-9-pad&&x<Math.max(8,at(road,z))+pad ||
      z>51-pad&&z<124+pad&&x>-10-pad&&x<17+pad;
  }
  function wet(x,z,pad=0){
    return Math.abs(x-at(canal,z))<6.5+pad||Math.abs(z-branch(x))<5.9+pad;
  }
  function seed(i){const n=Math.sin(i*37.732+1.386)*25832.18;return n-Math.floor(n);}
  const seafoam=0x9bd3ce,edge=0x78b5b3,tread=0xc4c5ab,rail=0xb9bcb1;
  function beam(T,k,color,a,b,w,h=w){
    const dir=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),length=dir.length();
    const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),dir.normalize());
    const r=new T.Euler().setFromQuaternion(q,'YXZ');
    k.box(color,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,w,h,length,r.y,r.x,r.z);
  }
  function railing(T,k,a,b){
    const [x,y,z]=a,dx=b[0]-x,dy=b[1]-y,dz=b[2]-z,len=Math.hypot(dx,dz),posts=Math.ceil(len/1.35);
    for(let i=0;i<=posts;i++){
      const t=i/posts;k.box(rail,x+dx*t,y+dy*t+.48,z+dz*t,.044,.96,.044);
    }
    for(const h of [.24,.46,.68,.95])beam(T,k,rail,[x,y+h,z],[b[0],b[1]+h,b[2]],h===.95?.047:.028);
  }
  function staircase(T,k,a,b,width){
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dz),ang=Math.atan2(dx,dz);
    const nx=dz/len,nz=-dx/len,count=Math.ceil(dy/.18);
    beam(T,k,seafoam,[a[0],a[1]-.13,a[2]],[b[0],b[1]-.13,b[2]],width,.22);
    for(let j=0;j<count;j++){
      const t=(j+.5)/count;
      k.box(tread,a[0]+dx*t,a[1]+dy*(j+1)/count-.073,a[2]+dz*t,width,.146,len/count+.025,ang);
    }
    for(const side of [-1,1]){
      const s=side*(width/2-.045);
      railing(T,k,[a[0]+nx*s,a[1],a[2]+nz*s],[b[0]+nx*s,b[1],b[2]+nz*s]);
    }
  }
  function watchtower(T,k){
    // The measured base and reported height constrain the silhouette. The taper,
    // landing intervals, tread count and railing heights are scaled from photographs.
    const base=.45,deck=21.25,rise=(deck-base)/16,stairs=1.03;
    const half=(y,side)=>(side?2.27:2.51)-Math.min(1,y/deck)*(side?.48:.61);
    const signs=[[1,1],[-1,1],[-1,-1],[1,-1]];
    for(let i=0;i<3;i++)k.box(i===2?0xc5c5ad:0xabafa1,0,.075+i*.15,0,6.86-i*.31,.15,6.31-i*.31);
    for(const [sx,sz] of signs){
      const a=[sx*half(0,0),base,sz*half(0,1)],b=[sx*half(deck,0),deck,sz*half(deck,1)];
      beam(T,k,seafoam,a,b,.32,.32);k.box(seafoam,b[0],22.47,b[2],.27,2.45,.27);
    }
    for(let i=0;i<16;i++){
      const y=base+rise*i,yy=y+rise,[sx,sz]=signs[i%4],[tx,tz]=signs[(i+1)%4];
      const c=[sx*(half(y,0)-stairs*.52),sz*(half(y,1)-stairs*.52)];
      const d=[tx*(half(yy,0)-stairs*.52),tz*(half(yy,1)-stairs*.52)];
      const ux=(tx-sx)*.5,uz=(tz-sz)*.5;
      k.box(seafoam,c[0],y-.115,c[1],stairs+.055,.23,stairs+.055);
      const r=stairs*.46;
      railing(T,k,[c[0]+sx*r,y,c[1]-sz*r],[c[0]+sx*r,y,c[1]+sz*r]);
      railing(T,k,[c[0]-sx*r,y,c[1]+sz*r],[c[0]+sx*r,y,c[1]+sz*r]);
      staircase(T,k,[c[0]+ux*stairs*.49,y,c[1]+uz*stairs*.49],[d[0]-ux*stairs*.49,yy,d[1]-uz*stairs*.49],stairs);
      if(i%2===0){
        const rx=half(y,0),rz=half(y,1);
        for(const side of [-1,1]){
          k.box(seafoam,0,y-.12,side*rz,2*rx,.24,.21);
          k.box(seafoam,side*rx,y-.12,0,.21,.24,2*rz);
        }
      }
    }
    // The upper floor surrounds the top flight. Keep the stair opening clear.
    k.box(seafoam,0,deck-.11,-.62,4.10,.23,2.62);
    k.box(seafoam,-.62,deck-.11,1.32,2.85,.23,1.27);
    k.box(seafoam,1.52,deck-.11,1.34,1.06,.23,1.23);
    for(const side of [-1,1]){
      railing(T,k,[-1.97,deck,side*1.84],[1.97,deck,side*1.84]);
      railing(T,k,[side*1.97,deck,-1.84],[side*1.97,deck,1.84]);
    }
    k.box(edge,0,23.63,0,5.38,.22,5.03);k.box(0xb5c8a9,0,23.77,0,5.25,.08,4.89);
    k.tapered(0xaaa89a,0,24.01,0,3.27,.15,.49,.94,4);
  }
  function canals(T,k){
    const p=[],uv=[],indices=[],rowCentres=[];
    function strip(from,to,n,point){
      const first=p.length/3,cols=10;
      for(let i=0;i<=n;i++)for(let j=0;j<=cols;j++){
        const t=i/n,v=j/cols,[x,z]=point(from+(to-from)*t,v);
        if(j===0)rowCentres.push(point(from+(to-from)*t,.5));
        p.push(x,.16,z);uv.push((x+.29*z)/39,(z-.29*x)/39);
        const ix=first+i*(cols+1)+j;
        if(i&&j)indices.push(ix-cols-2,ix-1,ix,ix-cols-2,ix,ix-cols-1);
      }
    }
    strip(-635,635,180,(z,v)=>[at(canal,z)+(v-.5)*12.7,z]);
    for(const [a,b] of [[-420,-21.2],[-8.6,510]])strip(a,b,68,(x,v)=>[x,branch(x)+(v-.5)*11.5]);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
    const canvas=document.createElement('canvas');canvas.width=canvas.height=384;
    const pen=canvas.getContext('2d'),pixels=pen.createImageData(384,384);
    for(let y=0;y<384;y++)for(let x=0;x<384;x++){
      const a=x*Math.PI/192,b=y*Math.PI/192,i=y*384+x;
      const raft=Math.sin(3*a+.57*Math.sin(2*b))+.68*Math.cos(3*b-.81*Math.sin(a))+.47*Math.sin(a+b)
        +.32*Math.cos(6*a-3*b+Math.sin(7*b))+.19*Math.sin(13*a+4*b)+.11*Math.cos(19*b-15*a);
      const edge=seed(i+99),grain=14*(edge-.5)+5*Math.cos(7*a+9*b),light=1+Math.max(-1,Math.min(1,raft))*.15;
      pixels.data.set([(86+grain)*light,(128+grain)*light,(47+grain)*light,raft<-.84+.22*edge?0:255],i*4);
    }
    pen.putImageData(pixels,0,0);const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
    map.wrapS=map.wrapT=T.RepeatWrapping;map.anisotropy=4;
    const m=new T.MeshLambertMaterial({map,alphaTest:.49,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1});
    const mesh=new T.Mesh(g,m);mesh.receiveShadow=true;k.group.add(mesh);
    // The district cuts the mapped water channels after the landmark foundations
    // have been fitted. Set floating vegetation on those water levels after activation.
    let needsWater=true;
    mesh.onBeforeRender=()=>{
      if(!needsWater||typeof gfx==='undefined'||!gfx||typeof roads==='undefined'||!roads)return;
      const origin=roads.point(104.9590397,9.2243148),base=k.group.position.y,pos=g.attributes.position;
      needsWater=false;
      let found=false;
      for(let j=0;j<rowCentres.length;j++){
        const [x,z]=rowCentres[j],water=gfx.waterAt(origin.x+x,origin.z+z);
        if(!water)continue;
        for(let n=0;n<11;n++)pos.setY(j*11+n,water.level-base+.075);
        found=true;
      }
      if(found){pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();}
    };
    return {geometry:g,refit:()=>{needsWater=true;}};
  }
  function undergrowth(T,k){
    // Ground-layer foliage under the taller trunks. Breaks in the canopy to the
    // east and the denser banks to the west follow the park's aerial photographs.
    const trees=createTreeModels(T),rows=[[],[],[],[]],pose=new T.Object3D();
    for(let iz=-94;iz<=94;iz++)for(let ix=-58;ix<=58;ix++){
      const i=(iz+100)*131+ix+60,x=(ix+seed(i+681)-.5)*5.2,z=(iz+seed(i+1709)-.5)*5.2;
      if(wet(x,z,.6)||clear(x,z,.8)||Math.abs(x-at(road,z))<3.15)continue;
      const patch=.5+.5*Math.sin(x*.048+1.1*Math.cos(z*.052))*Math.cos(z*.071-.8*Math.sin(x*.066));
      const nearBank=Math.min(Math.abs(x-at(canal,z))-6.5,Math.abs(z-branch(x))-5.9)<7;
      const bank=nearBank?.69:1,open=x>39&&z<30;
      const h=bank*(1.2+seed(i-883)*1.6+patch*(open?2.6:4.7));
      const w=3.8+seed(i+83)*3.6+patch*(open?1.4:2.5);
      rows[i%4].push([x,z,h,w,seed(i-47)*6.28,.58+patch*.26]);
    }
    const start=k.group.children.length;
    for(let v=0;v<rows.length;v++){
      const group=rows[v],mesh=new T.InstancedMesh(trees.distantGeometry('tea',v),trees.billboardMaterial(),group.length);
      group.forEach(([x,z,h,w,a,shade],i)=>{
        pose.position.set(x,0,z);pose.rotation.y=a;pose.scale.set(w,h,w);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
        mesh.setColorAt(i,new T.Color(.75*shade,shade,.59*shade));
      });k.group.add(mesh);
    }
    return k.group.children.slice(start);
  }
  function vegetation(T,k){
    const trees=createTreeModels(T),stems=[],crowns=[],trunks=[],far=[[],[],[],[]],pose=new T.Object3D();
    for(let ix=-40;ix<=40;ix++)for(let iz=-51;iz<=51;iz++){
      const i=(ix+42)*111+iz+51,x=(ix+seed(i)-.5)*8,z=(iz+seed(i+8000)-.5)*8,d=Math.hypot(x,z);
      if(clear(x,z,2)||wet(x,z,2.1)||Math.abs(x-at(road,z))<5.0)continue;
      const grove=.5+.5*Math.sin(x*.039+Math.sin(z*.077))*Math.cos(z*.038+x*.014);
      if(x>37&&z<35&&seed(i+35)<.44*grove)continue;
      const h=3.4+grove*5+seed(i+39)*4.5,r=h*(.22+seed(i-3)*.12);
      if(d<96){
        const a=seed(i+17)*Math.PI*2,dx=Math.sin(a)*h*.07,dz=Math.cos(a)*h*.07;
        trunks.push([[x,-.25,z],[x+dx,h*.87,z+dz],h*.016,0xc8bfaa]);
        for(let j=0;j<3;j++){
          const dir=a+j*2.28,px=x+dx+Math.sin(dir)*r*.47,pz=z+dz+Math.cos(dir)*r*.47,py=h*(j===0?.88:.71);
          if(j)trunks.push([[x+dx*.59,h*.46,z+dz*.59],[px,py,pz],h*.010,0xcfc4ac]);
          crowns.push([px,py,pz,r*.81,h*(.19+.04*seed(i+j)),r*.86,dir]);
        }
      }else far[i%4].push([x,0,z,r*3.1,h,i*2.399]);
    }
    const up=new T.Vector3(0,1,0),trunk=new T.InstancedMesh(new T.CylinderGeometry(.70,1,1,6),new T.MeshLambertMaterial({color:0xffffff}),trunks.length);
    trunks.forEach(([a,b,r,tint],i)=>{
      const v=new T.Vector3(...a),q=new T.Vector3(...b),dir=q.clone().sub(v);
      pose.position.copy(v).lerp(q,.5);pose.quaternion.setFromUnitVectors(up,dir.clone().normalize());pose.scale.set(r,dir.length(),r);pose.updateMatrix();
      trunk.setMatrixAt(i,pose.matrix);trunk.setColorAt(i,new T.Color(tint));
    });
    const begin=k.group.children.length;k.group.add(trunk);window.VietnamForestGiants.crowns(T,k,crowns);
    for(let j=0;j<far.length;j++){
      const rows=far[j],mesh=new T.InstancedMesh(trees.distantGeometry('tree',j),trees.billboardMaterial(),rows.length);
      rows.forEach(([x,y,z,w,h,a],i)=>{
        pose.position.set(x,y,z);pose.rotation.set(0,a,0);pose.scale.set(w,h,w);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
        mesh.setColorAt(i,new T.Color(.78,.90,.75));
      });k.group.add(mesh);
    }
    stems.push(...k.group.children.slice(begin));return stems;
  }
  function build(T,k){
    k.palette({plaster:[seafoam,edge],metal:rail});watchtower(T,k);
    // Single-storey corrugated shelter north of the tower, OSM w1228794104.
    // The other mapped waterfront buildings and the road bridge remain in the district layer.
    const start=k.vertexCount();k.place(5.22,-15.36,-.099,()=>{
      k.box(0xb9c1ab,0,1.05,0,4.50,2.10,9.92);
      for(const z of [-3,0,3])k.box(0x60726a,2.27,1.28,z,.05,.75,1.06);
      const g=[[-2.48,0],[0,.58],[2.48,0],[2.48,-.09],[0,.46],[-2.48,-.09]];
      k.outline(g,0x9faeaa,0,2.12,-5.16,10.32);
    });
    const end=k.vertexCount(),water=canals(T,k),stems=[...vegetation(T,k),...undergrowth(T,k)],baseline=new WeakMap();
    k.group.userData.fitGround=ground=>{
      const g=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;
      if(g){
        const p=g.attributes.position;if(!baseline.has(p))baseline.set(p,p.array.slice());const rest=baseline.get(p),h=ground(5.22,-15.36);
        for(let i=start;i<end;i++)p.setY(i,rest[3*i+1]+h);p.needsUpdate=true;g.computeBoundingSphere();
      }
      const p=water.geometry.attributes.position;
      for(let i=0;i<p.count;i++)p.setY(i,ground(p.getX(i),p.getZ(i))+.20);
      p.needsUpdate=true;water.geometry.computeVertexNormals();water.geometry.computeBoundingSphere();water.refit();
      for(const m of stems){
        if(!baseline.has(m))baseline.set(m,m.instanceMatrix.array.slice());const a=baseline.get(m),b=m.instanceMatrix.array;
        for(let i=12;i<a.length;i+=16)b[i+1]=a[i+1]+ground(a[i],a[i+2]);
        m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
      }
    };
  }
  const shot=(name,x,z,height,viewRadius,viewAngle,viewElevation)=>({name,offset:[x,z],height,viewRadius,viewAngle,viewElevation,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Vườn quốc gia U Minh Hạ – Đài quan sát Vồ Dơi',kind:'Khu bảo tồn',
    // The park-wide Commons photograph shows a banana plant. At the tower
    // use its own photograph at the publisher until there is a local image of this structure.
    lat:9.2243148,lon:104.9590397,start:[104.9594476,9.1976786],source,photo,photoCatalogId:'osm-way-1228794103',
    map:'https://www.openstreetmap.org/way/1228794103',
    // From the entrance POI to the tower: 2,976 m along the surveyed road, then about 24 m on foot.
    yaw:0,width:14,depth:19,gardenRadius:32,foundationAt:[0,0],approachMeters:3000,visitOnArrival:true,mappedEntrance:true,
    modeledBuildings:['w1228794104'],
    solids:[[-2.5,-2.26,.16,.16],[-2.5,2.26,.16,.16],[2.5,-2.26,.16,.16],[2.5,2.26,.16,.16]],
    reserve:(x,z,p)=>clear(x,z,p)&&z<28||wet(x,z,p)&&Math.abs(x)<320&&Math.abs(z)<405,
    description:'Ở Vồ Dơi, đài quan sát cao khoảng 24 m đứng cạnh ngã tư kênh. Những vế thang hở đổi hướng quanh bốn trụ xanh nhạt. Trên sàn cao, khách nhìn dọc kênh qua những mảng thực vật nổi, trảng thấp và rừng tràm trên đất than bùn. Độ thu của trụ, các bậc thang và tán cây được ước dựng theo ảnh thực địa.',
    arrivalNote:'Xe dừng trước cổng Vồ Dơi, trên lối vào từ ĐT985C. Từ cổng, theo tuyến tham quan của Vườn khoảng 3 km về phía bắc tới đài quan sát.',
    views:[shot('Đài quan sát cạnh ngã tư kênh',0,1,26,39,1.99,.24),
      shot('Bốn trụ và những vế thang',0,0,24,26,.55,-.30),
      shot('Từ sàn đài nhìn dọc kênh',-14,-66,31.3,66.65,.215,.131)],build});
})();
