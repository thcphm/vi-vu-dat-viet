'use strict';
(()=>{
  const A=window.CentralArch,id='hoanh-son-quan',catalogId='osm-node-8250669293';
  const report='https://dantri.com.vn/du-lich/kham-pha-cong-troi-co-tu-thoi-vua-minh-mang-tren-dinh-deo-ngang-20230116104648765.htm';
  const photo=n=>'https://commons.wikimedia.org/?curid='+n;
  // OSM footway 887411294. The walkers' path turns twice before meeting the
  // old pass road. X points east, Z south, with the threshold as the origin.
  const trail=[[-.9,2.1],[-.9,-1.48],[-1.8,-17.5],[-4.7,-32.8],[-4,-39.7],[3.9,-41.7],[1.7,-50.9]];
  const width=4.42,height=4.05,depth=2.53,spring=1.74,radius=1.10,sill=.60;
  function camera(name,point,eye,fov,photo,photoCatalogId,description){
    const [x,y,z]=point,dx=eye[0]-x,dy=eye[1]-y,dz=eye[2]-z;
    return {name,offset:[x,z],height:y/.46,viewBase:'monument',viewAngle:Math.atan2(dx,dz),
      viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewRadius:Math.hypot(dx,dy,dz),viewFov:fov,photo,photoCatalogId,description};
  }
  const views=[
    camera('Mặt bắc và biển chữ Hán',[-.02,2.74,0],[-.93,-.08,-8.6],51,photo(93540483),catalogId,
      'Từ những bậc cuối phía Hà Tĩnh nhìn lên vòm. Biển tên nhỏ nằm giữa mặt tường sẫm màu. Trên diềm là ba cụm gạch giật cấp có lỗ thoáng.'),
    camera('Bậc đá đường thiên lý phía bắc',[-.55,1.4,-2.3],[-2.75,-6.2,-26.1],52,photo(93540484),'deo-ngang-bac-da-thien-ly',
      'Nhìn lên dọc lối bậc cũ qua sườn núi. Các bậc đá thấp, rộng và mấp mô, cỏ mọc trong khe. Cửa quan hiện ở đầu dốc.'),
    camera('Mặt nam nhìn xuyên qua vòm',[0,2.65,0],[1.72,3.68,8.3],52,photo(93540481),'deo-ngang-mat-nam-hoanh-son-quan',
      'Từ đường phía nam nhìn qua vòm về sườn bắc. Mặt tường có những mảng vữa sáng và vệt ẩm sẫm chạy xuống trên đỉnh vòm.'),
    camera('Chỗ rẽ ở chân bậc bên đường đèo',[-3,-9.2,-34.6],[2,-13.2,-52.1],62,report,'deo-ngang-loi-vao-duong-cu',
      'Ở phía đường đèo cũ, lối bộ rẽ sang phải rồi ngoặt lên sườn. Xe dừng ở đường nhựa bên dưới, người đi bộ theo bậc đá lên cửa quan.'),
  ];
  function portal(T){
    const g=new T.Shape(),half=width/2;
    g.moveTo(-half,0);g.lineTo(-radius,0);g.lineTo(-radius,spring);
    g.absarc(0,spring,radius,Math.PI,0,true);g.lineTo(radius,0);
    g.lineTo(half,0);g.lineTo(half,height);g.lineTo(-half,height);g.closePath();
    return g;
  }
  // Project the two CC BY-SA photographs back onto the flat masonry around
  // the open portal. Only the wall pixels are sampled. Each photograph stays
  // available in full with author, licence and original file link in the tour.
  function facade(T,k,face,sign,map,corners){
    const [bl,br,tr,tl]=corners;
    const material=new T.MeshStandardMaterial({map,roughness:1,side:T.DoubleSide});
    const geom=new T.ShapeGeometry(face,24),p=geom.attributes.position,idx=geom.index.array;
    const pos=[],uv=[],point=i=>[p.getX(i),p.getY(i)];
    function vertex([x,y]){
      const u=.5+sign*x/width,v=y/height;
      const pixel=(axis)=>(1-v)*((1-u)*bl[axis]+u*br[axis])+v*((1-u)*tl[axis]+u*tr[axis]);
      pos.push(x,y+sill,sign*(depth/2+.014));uv.push(pixel(0)/449,1-pixel(1)/800);
    }
    const middle=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
    for(let i=0;i<idx.length;i+=3){
      const a=point(idx[i]),b=point(idx[i+1]),c=point(idx[i+2]),ab=middle(a,b),bc=middle(b,c),ca=middle(c,a);
      for(const tri of [[a,ab,ca],[ab,b,bc],[bc,c,ca],[ab,bc,ca]])(sign<0?tri.reverse():tri).forEach(vertex);
    }
    geom.dispose();
    const surface=new T.BufferGeometry();
    surface.setAttribute('position',new T.Float32BufferAttribute(pos,3));surface.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    surface.computeVertexNormals();const mesh=new T.Mesh(surface,material);mesh.receiveShadow=true;k.group.add(mesh);
  }
  function stairs(T,k,map){
    const treads=[],colours=[],position=[],uv=[],grass=[],bladeColours=[];
    // Create level tops and separate risers. Each tread samples its own
    // station so it can be placed on the terrain streamed around the gate.
    for(let segment=1;segment<trail.length-1;segment++){
      const a=trail[segment],b=trail[segment+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
      const n=Math.ceil(len/.53),nx=-dz/len,nz=dx/len;
      for(let i=0;i<n;i++){
        const t=i/n,u=(i+1)/n,x=a[0]+t*dx,z=a[1]+t*dz,xx=a[0]+u*dx,zz=a[1]+u*dz;
        const width=segment>3?3.2:5.45,course=treads.length;
        const top=new T.Color([0xf2f0df,0xfaf6e8,0xecebdc,0xf5f1e2][course%4]);
        const start=position.length/3,grassStart=grass.length/3;
        // Vary the joints from course to course, as in the hand-laid flight.
        const joint=j=>(j/4-.5)*width+(j>0&&j<4?.27*Math.sin(course*1.8+j*2.6):0);
        for(let j=0;j<4;j++){
          const off=joint(j)+.022,end=joint(j+1)-.022;
          const corners=[[x+nx*off,z+nz*off],[x+nx*end,z+nz*end],[xx+nx*end,zz+nz*end],[xx+nx*off,zz+nz*off]];
          const lift=.025*Math.sin(course*2.1+j*4.3),crop=13+(course*23+j*51)%172;
          for(const [corner,y,u,v] of [[0,0,0,0],[1,0,1,0],[2,0,1,1],[0,0,0,0],[2,0,1,1],[3,0,0,1],
            [3,0,0,2],[2,0,1,2],[2,-.46,1,3],[3,0,0,2],[2,-.46,1,3],[3,-.46,0,3]]){
            const [px,pz]=corners[corner];position.push(px,y+lift,pz);
            uv.push((crop+u*184)/449,1-(v<2?702+v*49:601+(v-2)*37)/800);
            const f=.94+.024*((course+j)%4);colours.push(top.r*f,top.g*f,top.b*f);
          }
          if((course+j)%4===1||j===3){
            const cx=x+nx*end,cz=z+nz*end;
            for(let n=0;n<7;n++){
              const a=n*2.40+course,cos=Math.cos(a),sin=Math.sin(a),length=.10+(n%3)*.058;
              const bx=cx+cos*.08,bz=cz+sin*.08;
              grass.push(bx-sin*.024,.012,bz+cos*.024,bx+sin*.024,.012,bz-cos*.024,bx+cos*length,.09+length,bz+sin*length);
              bladeColours.push(.095,.14,.055,.095,.14,.055,.26,.30,.095);
            }
          }
        }
        treads.push({x,z,start,end:position.length/3,grassStart,grassEnd:grass.length/3});
      }
    }
    const g=new T.BufferGeometry(),p=new T.Float32BufferAttribute(position,3);
    g.setAttribute('position',p);g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    g.computeVertexNormals();
    const m=new T.Mesh(g,new T.MeshStandardMaterial({map,vertexColors:true,roughness:1,side:T.DoubleSide}));
    m.name='Hoành Sơn Quan stone flight';m.receiveShadow=true;k.group.add(m);
    const blades=new T.BufferGeometry(),bp=new T.Float32BufferAttribute(grass,3);
    blades.setAttribute('position',bp);blades.setAttribute('color',new T.Float32BufferAttribute(bladeColours,3));
    blades.computeVertexNormals();k.group.add(new T.Mesh(blades,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide})));
    return ground=>{
      for(const t of treads){
        const blend=Math.max(0,1-Math.max(0,-t.z-1.5)/6);
        const y=ground(t.x,t.z)+.17+blend*.80;
        for(let i=t.start;i<t.end;i++)p.setY(i,position[i*3+1]+y);
        for(let i=t.grassStart;i<t.grassEnd;i++)bp.setY(i,grass[i*3+1]+y);
      }
      p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();
      bp.needsUpdate=true;blades.computeBoundingBox();blades.computeBoundingSphere();
    };
  }
  function build(T,k){
    const grey=0x79796b,tan=0x9b9481,brick=0x765b50;
    const face=portal(T);k.palette({stone:[grey,tan,0x757765,0x827c69],brick});
    k.box(tan,0,-.43,0,width+.18,2.05,depth+.56);
    k.profile(face,grey,0,sill,-depth/2,depth);
    let northMap=null;
    if(typeof document!=='undefined'){
      const picture=file=>{
        const map=new T.TextureLoader().load('sight-photos/'+file+'.webp');map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
        return map;
      };
      northMap=picture(93540483);
      facade(T,k,face,-1,northMap,[[49,426],[413,417],[396,74],[75,137]]);
      facade(T,k,face,1,picture(93540481),[[8,591],[421,620],[430,160],[22,198]]);
    }
    for(const sign of [-1,1]){
      k.box(0x686759,0,sill+height+.025,sign*(depth/2-.12),width+.08,.105,.35);
      for(const x of [-1.37,0,1.37]){
        const z=sign*(depth/2-.17),y=sill+height+.08;
        for(const side of [-1,1])k.box(brick,x+side*.33,y+.12,z,.40,.24,.32);
        k.box(0x705a50,x,y+.31,z,.83,.16,.34);k.box(brick,x,y+.46,z,.49,.15,.32);
        k.box(0x765a4e,x,y+.58,z,.25,.10,.30);
      }
    }
    for(const sign of [-1,1])for(let i=0;i<11;i++){
      const x=sign*(2.63+i*1.03),z=.04*i;
      const h=.80-i*.042+.13*(i%3);
      k.box(i%3?0x757765:0x827c69,x,h/2-.54,z,1.06,h+1.08,.87+.09*(i%3));
    }
    const fitStairs=stairs(T,k,northMap),before=k.group.children.length;
    A.trees(T,k,[{x:-7.4,z:-2,h:6.2,width:5.7},{x:7.2,z:2.2,h:5.6,width:5.4},
      {x:-7.6,z:-16,h:6.4,width:5.5},{x:7.7,z:-11,h:4.7,width:4.5},{x:6.8,z:-22,h:6.1,width:5.2},
      {x:-11.2,z:-26,h:5.8,width:6},{x:-9.4,z:-34,h:7.4,width:5.6},{x:8.2,z:-35,h:4.8,width:5.8},
      {x:-7,z:9,h:5.1,width:4.5},{x:8.7,z:10,h:4.9,width:4.6}]);
    const trees=k.group.children.slice(before).map(o=>[o,o.position.y]);
    let wall;
    k.group.userData.fitGround=ground=>{
      fitStairs(ground);
      for(const [o,initial] of trees)o.position.y=initial+ground(o.position.x,o.position.z);
      const g=k.group.children.at(-1).geometry,p=g.attributes.position;
      // Each stone follows its section of the ridge. Keep the portal vertical.
      if(!wall){
        wall=[];
        for(let i=0;i<p.count;i++)if(Math.abs(p.getX(i))>width/2+.10)wall.push([i,p.getX(i),p.getY(i),p.getZ(i)]);
      }
      for(const [i,x,y,z] of wall)p.setY(i,y+ground(x,z));
      p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({id,catalogId,name:'Hoành Sơn Quan trên đỉnh Đèo Ngang',city:'Hoành Sơn',province:'Hà Tĩnh',
    locality:'Đèo Ngang, giáp Hà Tĩnh và Quảng Trị',region:'Trung Bộ',kind:'Di tích',lon:106.4696886,lat:17.9563451,
    start:[106.4697041,17.9568173],yaw:0,width,depth,gardenRadius:5,mappedEntrance:true,visitOnArrival:true,views,
    solids:[...A.archPiers(0,0,width,radius,depth),[-7.8,.19,5.5,.51],[7.8,.19,5.5,.51]],
    photo:photo(93540483),source:'https://vietnamtourism.vn/index.php/news/items/27340',map:'https://www.openstreetmap.org/node/8250669293',
    description:'Cửa quan xây năm 1833 thời Minh Mạng, trên dãy Hoành Sơn giữa Hà Tĩnh và Quảng Trị. Hai mặt tường dùng ảnh thực địa của Linhcandng (CC BY-SA 3.0), chiếu lên vòm theo tỷ lệ ước từ ảnh. Bậc đá theo tuyến đường bộ trên bản đồ, cao độ theo địa hình mô phỏng.',
    arrivalNote:'Xe dừng trên đường Đèo Ngang cũ tại lối đi bộ phía bắc. Từ đây, bậc đá dẫn lên cửa quan trên sườn núi.',build});
})();
