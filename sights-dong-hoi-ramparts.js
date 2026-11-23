'use strict';
(()=>{
  const A=window.CentralArch,report='https://vnexpress.net/dau-tich-thoi-vua-minh-mang-con-lai-o-thanh-dong-hoi-3295094.html';
  const north='mui-thanh-dong-bac-dong-hoi',board='bia-thanh-dong-hoi',northPhoto='https://commons.wikimedia.org/?curid=148222144';
  // Near the two visitor stops the mapped line follows the outer edge of the
  // embankment. The brick walk and, by the southern bridge, the surviving
  // upper wall stand on the landward side of that edge.
  const northEdge=[[11.0,90],[7.1,7.1],[6,3.7],[4,1.3],[0,0],[-3.5,.7],[-100.5,44],[-113.7,50]];
  const southEdge=[[-109.2,14.5],[-101.7,31.1],[-46.1,32.7],[8.8,.7],[8.5,-4]];
  const southWall=[[-96,25.5],[-48.4,26.5],[-.9,-.55],[6.7,-4.8],[6.3,-8.1]];
  function corridor(path,x,z,pad){
    return path.some(([ax,az],i)=>{
      if(!i)return false;
      const [bx,bz]=path[i-1],dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
      return (x-ax-t*dx)**2+(z-az-t*dz)**2<pad*pad;
    });
  }
  function camera(name,target,eye,fov,photo,photoCatalogId,description){
    const [x,h,z]=target,[ex,eh,ez]=eye,dx=ex-x,dz=ez-z,dy=eh-h;
    return {name,offset:[x,z],height:h/.46,viewBase:'monument',viewAngle:Math.atan2(dx,dz),viewRadius:Math.hypot(dx,dz,dy),
      viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,photo,photoCatalogId,description};
  }
  const northViews=[
    camera('Mũi thành và hào từ phía Quách Xuân Kỳ',[13,5.4,30],[1.7,14.3,-56.7],61,northPhoto,'dong-hoi-mui-thanh-dong-bac',
      'Từ vị trí chụp ảnh ở phía bắc, nhìn về phía nam. Sông Nhật Lệ nằm bên trái đường ven sông. Hào nước ở bên phải, ôm lấy góc nhọn của thành.'),
    camera('Theo lối gạch quanh góc thành',[1.3,1.0,3.4],[-35,2.25,19.4],58,northPhoto,'dong-hoi-loi-gach-mui-thanh',
      'Từ lối lát đỏ phía trong bờ kè, nhìn về chỗ hai cạnh thành gặp nhau. Bên kia hào là phố Quách Xuân Kỳ.'),
  ];
  const boardViews=[
    camera('Bia giới thiệu bên cầu Nam Thành',[0,1.49,0],[-3.25,1.80,4.1],48,report,'osm-node-6346469056',
      'Bia đá có khung xám, mặt chữ sẫm và viền vàng. Bên cạnh là đầu đoạn tường gạch, gần vỉa hè phía tây đường lớn.'),
    camera('Mặt gạch cũ cạnh bia thành',[-8,1.85,3.5],[-14,2.3,13],58,report,'dong-hoi-tuong-gach-cau-nam',
      'Lối đi gạch đỏ men theo hào. Nhìn về đầu tường cạnh cầu Nam Thành có thể thấy các mảng gạch đỏ lộ ra giữa những phần vữa sẫm màu.'),
  ];
  // Mitered stations keep the red walk, narrow grass verge and stone facing
  // continuous through the sharp bends in the two surveyed OSM lines.
  function stations(path,inside){
    const directions=path.slice(1).map(([x,z],i)=>{const dx=x-path[i][0],dz=z-path[i][1],l=Math.hypot(dx,dz);return [inside*dz/l,-inside*dx/l];});
    const rows=path.map(([x,z],i)=>{
      const a=directions[Math.max(0,i-1)],b=directions[Math.min(directions.length-1,i)],nx=a[0]+b[0],nz=a[1]+b[1];
      const scale=Math.max(.82,nx*b[0]+nz*b[1]);return [x,z,nx/scale,nz/scale];
    });
    const dense=[rows[0]];
    for(let i=1;i<rows.length;i++){
      const a=rows[i-1],b=rows[i],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3.2);
      for(let j=1;j<=steps;j++)dense.push(a.map((v,k)=>v+(b[k]-v)*j/steps));
    }
    return dense;
  }
  function strip(T,k,rows,outer,inner,low,high,tint){
    const vertices=[];
    const face=(a,b,c,d)=>vertices.push(...a,...b,...c,...a,...c,...d);
    function point(row,off,y){return [row[0]+row[2]*off,y,row[1]+row[3]*off];}
    for(let i=1;i<rows.length;i++){
      const a=rows[i-1],b=rows[i];
      const v=[point(a,outer,high),point(a,inner,high),point(b,inner,high),point(b,outer,high)];
      const signed=(v[1][0]-v[0][0])*(v[2][2]-v[0][2])-(v[1][2]-v[0][2])*(v[2][0]-v[0][0]);
      if(signed>0)face(v[3],v[2],v[1],v[0]);else face(...v);
      for(let j=0;j<4;j++){
        if(j===0&&i>1||j===2&&i<rows.length-1)continue;
        const a=v[j],b=v[(j+1)%4],l=signed>0?b:a,r=signed>0?a:b;
        face([l[0],low,l[2]],[r[0],low,r[2]],r,l);
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.computeVertexNormals();
    k.stamp(g,tint,0,0,0);g.dispose();
  }
  function alignGround(k){
    const objects=k.group.children.slice(),restY=objects.map(o=>o.position.y);
    let original;
    k.group.userData.fitGround=g=>{
      const geom=k.group.children.at(-1).geometry,p=geom.attributes.position;
      original??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      const cells=new Map();
      for(let i=0;i<p.count;i++){
        const x=p.getX(i),z=p.getZ(i),key=Math.round(x*2)+','+Math.round(z*2);
        if(!cells.has(key))cells.set(key,g(x,z));p.setY(i,original[i]+cells.get(key));
      }
      p.needsUpdate=true;geom.computeBoundingBox();geom.computeBoundingSphere();
      objects.forEach((o,i)=>{o.position.y=restY[i]+g(o.position.x,o.position.z);});
    };
  }
  const northRows=stations(northEdge,1),southRows=stations(southEdge,1),upper=stations(southWall,1);
  const upperSolids=upper.slice(1).map(([x,z,nx,nz],i)=>{
    const [ax,az,anx,anz]=upper[i];
    return [(x+ax+nx+anx)/2,(z+az+nz+anz)/2,Math.abs(x-ax)/2+.81,Math.abs(z-az)/2+.81];
  });
  function bank(T,k,rows){
    strip(T,k,rows,-.62,.22,-2.3,.21,0x786f5c);
    strip(T,k,rows,-.71,.38,.18,.35,0xb2aba0);
    strip(T,k,rows,.37,2.35,-.25,.27,0x798657);
    strip(T,k,rows,2.34,5.30,-.24,.31,0xae7258);
    strip(T,k,rows,5.28,6.15,-.28,.28,0x7b8959);
  }
  function northGround(T,k){
    k.palette({stone:[0x786f5c,0xb2aba0],brick:0xae7258});
    bank(T,k,northRows);
    strip(T,k,northRows,6.13,11.6,-.24,.29,0x758452);
    const trees=[],shrub=new T.SphereGeometry(1,9,6);
    for(let i=3;i<northRows.length;i+=3){
      const [x,z,nx,nz]=northRows[i];
      k.stamp(shrub,i%2?0x526744:0x5c714d,x+nx*7.25,.70,z+nz*7.25,.73,.53,.76);
      if(i%9===3){
        const lx=x+nx*6.55,lz=z+nz*6.55;
        k.box(0x666663,lx,1.75,lz,.11,3.16,.11);
        k.stamp(shrub,0xe9e4cf,lx,3.46,lz,.23,.24,.23);
      }
    }
    // The geotagged 2024 view also shows beds and a tall palm immediately
    // below the photographer, on the opposite bank from the red promenade.
    const lawn=[[-14,-51],[16,-49],[21,-40],[14,-34],[-4,-35],[-16,-42]];
    const shape=new T.Shape(lawn.map(([x,z])=>new T.Vector2(x,-z)));
    const grass=new T.ExtrudeGeometry(shape,{depth:.15,bevelEnabled:false});
    grass.rotateX(-Math.PI/2);k.stamp(grass,0x788957,0,.02,0);grass.dispose();
    const bed=stations([[-3,-40],[6,-37],[13,-43],[2,-49],[-3,-40]],1);
    for(let i=0;i<bed.length-1;i++){
      const [x,z]=bed[i],[xx,zz]=bed[i+1],steps=Math.ceil(Math.hypot(xx-x,zz-z)/.9);
      for(let j=0;j<steps;j++)k.stamp(shrub,i%2?0x576c44:0x5b7148,x+(xx-x)*j/steps,.52,z+(zz-z)*j/steps,.65,.48,.61);
    }
    for(const [x,z] of [[2,-43],[5,-42],[8,-43],[5,-45]])k.stamp(shrub,0x677b48,x,.59,z,.49,.63,.49);
    shrub.dispose();
    trees.push({x:16,z:-42,h:9.8,width:6.8,kind:'palm'},{x:-13,z:-44,h:5.9,width:7.3},
      {x:-22,z:20,h:5.6,width:6.7},{x:-38,z:30,h:6.7,width:7.4},{x:-4,z:39,h:6.0,width:6.1},
      {x:-3,z:62,h:7,width:7.4},{x:0,z:78,h:6.4,width:6.8},{x:-25,z:49,h:6.2,width:6.8});
    A.trees(T,k,trees);alignGround(k);
  }
  function tablet(T,k){
    const angle=-.51,c=Math.cos(angle),s=Math.sin(angle),granite=0x9a9b91;
    function part(tint,x,y,z,w,h,d){k.box(tint,x*c+z*s,y,-x*s+z*c,w,h,d,angle);}
    part(0x86877d,0,.17,0,1.85,.34,1.09);part(granite,0,.43,0,1.62,.25,.89);
    part(0xb4b3a7,0,.64,0,1.43,.17,.70);
    part(granite,0,1.52,0,1.30,1.68,.38);part(0xac995e,0,1.52,.204,1.08,1.48,.031);
    part(0x434440,0,1.52,.222,.96,1.34,.030);
    const crown=new T.Shape();crown.moveTo(-.68,0);crown.lineTo(.68,0);crown.lineTo(.64,.17);
    crown.quadraticCurveTo(.38,.15,.26,.32);crown.quadraticCurveTo(0,.62,-.26,.32);
    crown.quadraticCurveTo(-.44,.16,-.65,.19);crown.closePath();
    k.profile(crown,granite,-.19*s,2.35,-.19*c,.38,angle);
    A.plaque(T,k,'THÀNH ĐỒNG HỚI',.244*s,2.00,.244*c,.80,.16,{ry:angle,bg:'#454640',fg:'#d0b96e',frame:false});
    const textColor=0xbbab71;
    for(let row=0;row<11;row++){
      const y=1.83-row*.078;
      for(let j=0;j<4;j++){
        const w=.100+((row*3+j*5)%7)*.008;
        part(textColor,-.31+j*.172+w*.5,y,.242,w,.015,.012);
      }
    }
  }
  function southGround(T,k){
    k.palette({stone:[0x786f5c,0xb2aba0],brick:[0xae7258,0x945f4d,0x876353]});
    // The OSM line curves round the outside of the southern corner. The
    // surviving brickwork stands behind the walk by the western pavement.
    bank(T,k,southRows);
    strip(T,k,upper,-.13,1.95,-.35,3.22,0x945f4d);
    strip(T,k,upper,-.22,2.02,3.19,3.36,0x876353);
    for(let i=1;i<upper.length-1;i+=2){
      const [x,z,nx,nz]=upper[i],[xx,zz]=upper[i+1],v=[];
      const profile=[[0,.15],[.52,.04],[.96,.26],[.86,.52],[1,.84],[.69,.83],[.57,.98],[.18,.90],[.24,.57],[.05,.46]];
      const y=.36+(i%4)*.18,h=1.45+(i%3)*.29;
      const contour=profile.map(([t,r])=>[x+(xx-x)*t-nx*.157,y+r*h,z+(zz-z)*t-nz*.157]);
      const mid=[(x+xx)/2-nx*.157,y+h*.51,(z+zz)/2-nz*.157];
      for(let j=0;j<contour.length;j++)v.push(...mid,...contour[j],...contour[(j+1)%contour.length]);
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.computeVertexNormals();
      k.stamp(g,i%3?0x787768:0x847d69,0,0,0);g.dispose();
    }
    k.box(0xa98b73,0,-.07,1.13,4.16,.29,3.98);
    tablet(T,k);
    A.trees(T,k,[{x:5.3,z:-10.6,h:7.5,width:6.5},{x:4.4,z:-19.6,h:6.7,width:6.0},
      {x:-11,z:-7,h:8.2,width:5.1,kind:'palm'},{x:-21,z:1.0,h:6.8,width:6.0}]);
    alignGround(k);
  }
  const common={region:'Trung Bộ',city:'Đồng Hới',province:'Quảng Trị',formerProvince:'Quảng Bình',
    kind:'Di tích',yaw:0,gardenRadius:1,viewDistance:820,mappedEntrance:true,visitOnArrival:true,source:report};
  (window.VietnamSights??=[]).push(
    {...common,id:north,catalogId:'dong-hoi-mui-thanh-dong-bac',name:'Mũi thành đông bắc Đồng Hới và lối đi ven hào',lon:106.623923,lat:17.470658,
      start:[106.6238226,17.4710593],width:10,depth:9,solids:[],photo:northPhoto,map:'https://www.openstreetmap.org/way/940795265',views:northViews,
      replacesCityWall:(x,z)=>corridor(northEdge,x,z,2.6),reserve:(x,z,p)=>corridor(northEdge,x,z,6+p),
      description:'Ở góc đông bắc thành Đồng Hới, lối gạch đỏ theo bờ kè thấp, giữa dải cỏ và hào nước. Góc toàn cảnh dựa vào vị trí và hướng chụp của Tttrung. Cây xanh, đèn và cao độ góc nhìn được ước theo ảnh.',
      arrivalNote:'Xe dừng trên phố Đoàn Thị Điểm, phía bắc hào. Từ đây có thể ngắm mũi thành và đường Quách Xuân Kỳ sát sông Nhật Lệ.',build:northGround},
    {...common,id:board,catalogId:'osm-node-6346469056',name:'Bia thành Đồng Hới và đoạn tường bên cầu Nam Thành',lon:106.6233244,lat:17.4663521,
      start:[106.6234532,17.465947],width:3.5,depth:3.2,solids:[[0,0,.75,.54],...upperSolids],photo:report,map:'https://www.openstreetmap.org/node/6346469056',views:boardViews,
      replacesCityWall:(x,z)=>corridor(southEdge,x,z,2.8),reserve:(x,z,p)=>Math.hypot(x,z)<3.1+p,
      description:'Bia giới thiệu di tích đứng bên đầu đoạn tường gạch, trên bờ tây đường qua cầu Nam Thành. Thành được xây lại bằng gạch năm 1824. Khung bia và các bậc đá theo ảnh thực địa, chữ nhỏ trên mặt bia được giản lược.',
      arrivalNote:'Xe dừng trên đường Nguyễn Trãi, gần đầu nam cầu Nam Thành. Theo vỉa hè phía tây qua cầu để tới bia.',build:southGround});
})();
