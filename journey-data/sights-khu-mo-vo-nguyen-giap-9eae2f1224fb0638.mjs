const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const A=window.CentralArch,id='khu-mo-vo-nguyen-giap',catalogId='osm-node-2495002567';
  const source='https://vietnamtourism.vn/index.php/tourism/items/2924';
  const winter='https://vov.vn/xa-hoi/hang-nghin-nguoi-dang-huong-tai-mo-dai-tuong-vo-nguyen-giap-dau-nam-moi-2026-post1258583.vov';
  const summer='https://vov.vn/chinh-tri/dang-huong-tuong-nho-dai-tuong-vo-nguyen-giap-tai-vung-chua-dao-yen-post1327197.vov';
  const towerPhoto='https://commons.wikimedia.org/?curid=93540695';
  const lon=106.4949861,lat=17.9247684,start=[106.4939762,17.9238382];
  const local=(x,y)=>[(x-lon)*111320*Math.cos(lat*Math.PI/180),(lat-y)*110900];
  const tower=local(106.49474245,17.9246246),arrival=local(...start);
  // The centreline of the visitor path, w841553891, from the parking to the graves.
  const path=[[106.4939767,17.9238372],[106.4940256,17.9245824],[106.494106,17.924721],
    [106.494218,17.9247657],[106.4949862,17.9247159]].map(p=>local(...p));
  const parking=[[106.4940469,17.9241539],[106.4940296,17.923891],[106.4946025,17.9238569],
    [106.4946159,17.9240605],[106.4946198,17.9241199],[106.4945225,17.9241257]].map(p=>local(...p));
  function reserve(x,z,r){
    return x>-113-r&&x<-34+r&&z>-5-r&&z<107+r||
      x>-38-r&&x<13+r&&z>-13-r&&z<34+r;
  }
  function view(name,subject,eye,height,eyeLevel,fov,photo,photoCatalogId,description){
    const [x,z]=subject,dx=eye[0]-x,dz=eye[1]-z,dy=eyeLevel-height;
    return {name,offset:[x,z],height:height/.46,viewRadius:Math.hypot(dx,dz,dy),viewAngle:Math.atan2(dx,dz),
      viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,photo,photoCatalogId,description};
  }
  const views=[
    view('Sân viếng và hai phần mộ trên núi Thọ',[-2,.35],[-6.85,7.5],1.2,1.83,62,winter,catalogId,
      'Nhìn từ lối viếng về hai phần mộ phủ cỏ, sau lưng là đồi cây. Phó Giáo sư Đặng Bích Hà an nghỉ bên cạnh Đại tướng từ tháng 9 năm 2024.'),
    view('Từ bãi xe nhìn lên tháp chuông',tower,[arrival[0]-10,arrival[1]+5],3.75,-9.8,39,towerPhoto,'vung-chua-bai-xe-khu-mo',
      'Từ lối vào nhìn qua sân đỗ xe lên sườn đồi. Nhà đăng ký mái tranh và hai tầng mái đỏ của tháp chuông được dựng theo ảnh ngày 27/8/2016.'),
    view('Khúc rẽ của lối bộ lên sân viếng',[-84,1.9],[-102,30],1.12,-.5,58,winter,'vung-chua-loi-bo-khu-mo',
      'Từ bãi xe, lối lát đá đi về phía bắc rồi rẽ phải men sườn đồi. Đoạn cuối dẫn tới sân viếng phía trên tháp chuông.'),
    view('Vũng Chùa Hồng Chung dưới hai tầng mái',tower,[tower[0]-9.3,tower[1]+11.4],3.85,2.05,54,source,'osm-way-885335615',
      'Nhìn chéo vào lòng tháp từ phía dưới sườn. Quả chuông đồng mang tên Vũng Chùa Hồng Chung treo trong gian mở dưới hai tầng mái.'),
    view('Lư hương ở phía trước phần mộ',[.1,2.85],[1.72,6.65],.88,2.1,48,summer,'vung-chua-san-dang-huong',
      'Nhìn từ lối viếng vào chiếc lư ba chân và bàn gỗ trước phần mộ. Hình dáng lư được đối chiếu với ảnh lễ dâng hương tháng 8 năm 2026.'),
  ];
  function lathe(T,k,colour,x,y,z,profile,segments=24){
    const g=new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),segments);
    k.stamp(g,colour,x,y,z);g.dispose();
  }
  function bellTower(T,k,photoMaterial){
    const stone=0xa39a84,wood=0x69442c,tile=0xa34629,gold=0xdab576;
    k.box(stone,0,-1.38,0,7.35,3.46,8.25);
    for(const x of [-2.12,2.12])for(const z of [-2.30,2.30]){
      k.box(0xc3b697,x,.50,z,.60,.35,.60);
      k.box(wood,x,2.59,z,.34,3.88,.34);
    }
    for(const z of [-2.3,2.3]){
      k.box(wood,0,4.2,z,4.8,.49,.30);
      for(const x of [-2,2])A.strut(T,k,gold,x,3.73,z,x*.67,4.09,z,.065);
    }
    for(const x of [-2.12,2.12])k.box(wood,x,4.25,0,.31,.49,4.91);
    lathe(T,k,0x786b48,0,1.17,0,[[.93,0],[.94,.12],[.79,.23],[.72,.78],[.62,1.32],[.55,1.45],[.34,1.56],[.11,1.60]],32);
    for(const [y,r] of [[1.34,.83],[2.04,.72],[2.46,.65]]){
      const ring=new T.TorusGeometry(r,.032,6,28);k.stamp(ring,0x9d8960,0,y,0,1,1,1,0,Math.PI/2);ring.dispose();
    }
    A.strut(T,k,0x564b38,0,2.72,0,0,4.33,0,.075);
    function roof(y,w,d,h){
      k.box(0x543b2b,0,y+.035,0,w-.42,.12,d-.42);
      A.curvedRoof(T,k,0,y,0,w,d,h,tile,gold,0x66412f,.035,{});
      // The photographed eaves end in small, rising scrolls with open centres.
      for(const sx of [-1,1])for(const sz of [-1,1]){
        const pts=[[0,.37],[.22,.58],[.36,.73],[.23,.81],[.14,.69],[.25,.59],[.53,.71]];
        const curve=new T.CatmullRomCurve3(pts.map(([l,r])=>new T.Vector3(sx*(w/2+l*.63),y+r,sz*(d/2+l*.63))));
        const trim=new T.TubeGeometry(curve,12,.074,5,false);k.stamp(trim,gold,0,0,0);trim.dispose();
      }
    }
    roof(4.55,7.45,7.7,1.34);
    k.box(wood,0,5.71,0,4.38,1.52,4.56);
    for(const side of [-1,1]){
      for(const y of [5.32,6.14]){
        k.box(gold,0,y,side*2.29,4.48,.10,.12);k.box(gold,side*2.21,y,0,.12,.10,4.62);
      }
    }
    const panels=[],uv=[],idx=[];
    for(const [y,h,w,d] of [[5.73,.67,4.39,4.58],[4.2,.42,4.55,4.93]]){
      const ring=[[-w/2,d/2],[w/2,d/2],[w/2,-d/2],[-w/2,-d/2]];
      for(let i=0;i<4;i++){
        const [x1,z1]=ring[i],[x2,z2]=ring[(i+1)%4],a=panels.length/3;
        panels.push(x1,y-h/2,z1,x2,y-h/2,z2,x2,y+h/2,z2,x1,y+h/2,z1);
        uv.push(.001,.002,.998,.002,.998,31/416,.001,31/416);idx.push(a,a+1,a+2,a,a+2,a+3);
      }
    }
    const panelGeometry=new T.BufferGeometry();panelGeometry.setAttribute('position',new T.Float32BufferAttribute(panels,3));
    panelGeometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));panelGeometry.setIndex(idx);panelGeometry.computeVertexNormals();
    k.group.add(new T.Mesh(panelGeometry,photoMaterial));
    roof(6.49,7.21,7.39,1.39);
    k.tapered(gold,0,8.12,0,.18,.035,.53,1,12);
    for(const x of [-3.28,3.28]){
      for(const z of [-3.65,-1.82,0,1.82,3.65])k.box(0xbbbaa8,x,.86,z,.15,1.02,.15);
      for(const y of [.61,1.13])k.box(0xc7c6b3,x,y,0,.12,.11,7.4);
    }
  }
  function shrine(T,k){
    const wood=0x68452f,bronze=0x737363;
    function table(x,z,w,d,h){
      k.box(wood,x,h,z,w,.11,d);
      for(const sx of [-1,1])for(const sz of [-1,1])k.box(wood,x+sx*(w/2-.09),h/2,z+sz*(d/2-.09),.10,h,.10);
    }
    table(-1.24,2.98,1.67,.58,.60);table(-4.74,3.42,1.38,.62,.69);
    lathe(T,k,0xa7a084,-4.74,.75,3.42,[[.13,0],[.19,.04],[.22,.23],[.20,.29],[.19,.31]],20);
    const x=.10,z=2.78;
    lathe(T,k,0x737363,x,0,z,[[.56,-.10],[.63,-.015],[.63,.05],[.59,.075],[.001,.075]],32);
    for(let i=0;i<3;i++){
      const a=i*Math.PI*2/3;
      A.strut(T,k,bronze,x+Math.sin(a)*.40,.12,z+Math.cos(a)*.40,x+Math.sin(a)*.29,.49,z+Math.cos(a)*.29,.11);
      k.tapered(0x525b52,x+Math.sin(a)*.40,.095,z+Math.cos(a)*.40,.135,.109,.10,1,8);
    }
    lathe(T,k,bronze,x,.42,z,[[.15,0],[.39,.08],[.55,.21],[.55,.34],[.45,.46],[.46,.52],[.51,.56],[.50,.61],[.41,.61]],32);
    const rim=new T.TorusGeometry(.485,.023,6,40);
    for(const y of [.53,.88,.95])k.stamp(rim,0x58615b,x,y,z,1,1,1,0,Math.PI/2);
    rim.dispose();
    // Low scroll relief around the belly of the incense burner.
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6,pts=[];
      for(let j=0;j<=14;j++){
        const v=j/14,phase=v*Math.PI*1.83,theta=a+.165*Math.cos(phase)*(1-v*.40);
        pts.push(new T.Vector3(x+.553*Math.sin(theta),.705+.093*Math.sin(phase)*(1-v*.49),z+.553*Math.cos(theta)));
      }
      const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts),14,.023,5,false);
      k.stamp(g,0x58615b,0,0,0);g.dispose();
    }
    for(const s of [-1,1]){
      const pts=[[.42,.87],[.65,.98],[.69,1.20],[.61,1.38],[.49,1.38],[.47,1.27],[.56,1.22]];
      const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(([a,y])=>new T.Vector3(x+s*a,y,z))),16,.066,6,false);
      k.stamp(g,bronze,0,0,0);g.dispose();
    }
    for(let i=0;i<5;i++)A.strut(T,k,0x9a422a,x+(i-2)*.04,1,z,x+(i-2)*.065,1.33+.06*(i%3),z,.009);
    for(const side of [-1,1])for(const zz of [2.8,4.6,6.4]){
      const xx=side<0?-7.65:2.65;
      k.box(wood,xx,.48,zz,.11,.98,.11);
      k.tapered(wood,xx,1.025,zz,.10,.04,.12,1,10);
      if(zz<6)for(const h of [.32,.81])k.box(wood,xx,h,zz+.9,.083,.08,1.82);
    }
  }
  function mound(T,k,x,rx,rz,h,turf){
    // The banks are covered in grass. Leave a slightly uneven, continuous foot.
    const pos=[],uv=[],col=[],idx=[],c=new T.Color(),green=new T.Color(0xa4b47f),shade=new T.Color(0xbbcda0);
    for(let j=0;j<=12;j++)for(let i=0;i<=48;i++){
      const t=j/12,a=i*Math.PI/24,form=1+.037*Math.sin(3*a+x)+.024*Math.cos(5*a);
      const dx=rx*t*Math.cos(a)*form,dz=rz*t*Math.sin(a)*form;
      const fraction=.5+.25*Math.sin(5.3*dx+7.1*dz)+.2*Math.sin(7.7*dx-4.1*dz);
      pos.push(x+dx,-.06+h*(1-3*t*t+2*t*t*t)+.038*fraction*t,dz);
      uv.push((x+dx)/2.6,dz/2.6);
      c.copy(green).lerp(shade,fraction*.75);col.push(c.r,c.g,c.b);
      if(i<48&&j<12){const n=j*49+i;idx.push(n,n+1,n+49,n+1,n+50,n+49);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const mesh=new T.Mesh(g,new T.MeshStandardMaterial({map:turf,vertexColors:true,roughness:1}));
    mesh.name='Phần mộ phủ cỏ';mesh.receiveShadow=mesh.castShadow=true;k.group.add(mesh);
    return mesh;
  }
  // Subdivide surfaces in metre space so the visitor yard meets the sampled
  // hillside along every side, even when the driving district rebases.
  function groundPatch(T,k,name,ring,texture,tint,repeat,level,fadeEdge=false){
    const positions=[],uv=[],alpha=[],idx=[],centre=ring.reduce(([x,z],p)=>[x+p[0]/ring.length,z+p[1]/ring.length],[0,0]);
    const outer=[];
    for(let i=0;i<ring.length;i++){
      const a=ring[i],b=ring[(i+1)%ring.length],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2);
      for(let j=0;j<n;j++)outer.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);
    }
    const steps=Math.ceil(Math.max(...outer.map(([x,z])=>Math.hypot(x-centre[0],z-centre[1])))/2);
    for(let j=0;j<=steps;j++)for(let i=0;i<outer.length;i++){
      const t=j/steps,x=centre[0]+(outer[i][0]-centre[0])*t,z=centre[1]+(outer[i][1]-centre[1])*t;
      positions.push(x,0,z);uv.push(x/repeat,z/repeat);
      if(fadeEdge)alpha.push(Math.max(0,Math.min(1,(1-t)*5)));
      if(j===steps)continue;
      const a=j*outer.length+i,b=j*outer.length+(i+1)%outer.length;
      idx.push(a,b,a+outer.length,b,b+outer.length,a+outer.length);
    }
    const g=new T.BufferGeometry(),p=new T.Float32BufferAttribute(positions,3);
    g.setAttribute('position',p);g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);
    const m=new T.MeshStandardMaterial({map:texture,color:tint,roughness:1,side:T.DoubleSide});
    if(fadeEdge){
      g.setAttribute('turfAlpha',new T.Float32BufferAttribute(alpha,1));m.transparent=true;m.depthWrite=false;
      m.onBeforeCompile=s=>{
        s.vertexShader='attribute float turfAlpha;varying float lawnAlpha;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nlawnAlpha=turfAlpha;');
        s.fragmentShader='varying float lawnAlpha;\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a*=lawnAlpha;');
      };
    }
    const mesh=new T.Mesh(g,m);mesh.name=name;mesh.receiveShadow=true;k.group.add(mesh);
    return ground=>{
      for(let i=0;i<p.count;i++)p.setY(i,level(ground,p.getX(i),p.getZ(i)));
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  function terrace(ground,x,z){
    const radius=Math.hypot((x+2)/15,(z-1)/14),t=Math.max(0,Math.min(1,(1-radius)/.47));
    const native=ground(x,z),flat=ground(0,0)+.24-z*.018;
    return native+.04+t*t*(3-2*t)*Math.max(0,flat-native);
  }
  function walkway(T,k){
    const pos=[],uv=[],idx=[];let length=0;
    for(let i=0;i<path.length-1;i++){
      const [x,z]=path[i],[x1,z1]=path[i+1],dx=x1-x,dz=z1-z,d=Math.hypot(dx,dz),steps=Math.ceil(d/2);
      // The mapped centreline meets the road centre. Paving starts at the curb.
      const first=pos.length/3,startFraction=i===0?4.1/d:0;
      for(let j=0;j<=steps;j++){
        const t=startFraction+(1-startFraction)*j/steps;
        for(const side of [-2,2]){
          pos.push(x+t*dx-side*dz/d,0,z+t*dz+side*dx/d);
          uv.push(side,length+t*d);
        }
        if(j<steps){const a=first+j*2;idx.push(a,a+1,a+2,a+2,a+1,a+3);}
      }
      length+=d;
    }
    const g=new T.BufferGeometry(),p=new T.Float32BufferAttribute(pos,3);
    g.setAttribute('position',p);g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new T.MeshStandardMaterial({color:0x7d7873,roughness:.98,side:T.DoubleSide});
    m.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 walkUv;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nwalkUv=uv;');
      s.fragmentShader='varying vec2 walkUv;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 cell=walkUv/vec2(.42,.30);cell.x+=.5*mod(floor(cell.y),2.);
        vec2 edges=.5-abs(fract(cell)-.5);float joint=1.-smoothstep(.015,.067,min(edges.x,edges.y));
        float fade=1.-smoothstep(.15,.8,max(fwidth(cell.x),fwidth(cell.y)));
        float tint=fract(sin(dot(floor(cell),vec2(21.35,47.62)))*43758.54);
        diffuseColor.rgb*=1.+fade*(.13*(tint-.5)-.32*joint);`);
    };
    const mesh=new T.Mesh(g,m);mesh.name='Lối lát đá lên sân viếng';mesh.receiveShadow=true;k.group.add(mesh);
    return ground=>{for(let i=0;i<p.count;i++){
        const x=p.getX(i),z=p.getZ(i);p.setY(i,terrace(ground,x,z)+.095);
      }
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();};
  }
  // The roof, façade and bamboo siding are rectified from Linhcandng's 2016
  // photograph of the registration hut, CC BY-SA 3.0 (credits in the tour).
  function thatchedShelter(T,k,material,w,d,eave,pitch,enclosed){
    const pos=[],uv=[],idx=[];
    function face(corners,top,bottom){
      const n=pos.length/3;
      for(const p of corners)pos.push(...p);
      uv.push(.003,1-bottom/416,.997,1-bottom/416,.997,1-top/416,.003,1-top/416);
      idx.push(n,n+1,n+2,n,n+2,n+3);
    }
    const a=w/2+.36,b=d/2+.42;
    face([[-a,eave,b],[a,eave,b],[a,eave+pitch,0],[-a,eave+pitch,0]],1,143);
    face([[a,eave,-b],[-a,eave,-b],[-a,eave+pitch,0],[a,eave+pitch,0]],1,143);
    if(enclosed){
      const x=w/2,z=d/2;
      face([[-x,-.32,z],[x,-.32,z],[x,eave,z],[-x,eave,z]],145,318);
      face([[x,-.32,-z],[-x,-.32,-z],[-x,eave,-z],[x,eave,-z]],321,383);
      for(const side of [-1,1]){
        face([[side*x,-.32,side*z],[side*x,-.32,-side*z],[side*x,eave,-side*z],[side*x,eave,side*z]],320,383);
        face([[side*x,eave,side*z],[side*x,eave,-side*z],[side*x,eave+pitch,0],[side*x,eave+pitch,0]],320,383);
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const o=new T.Mesh(g,material);o.castShadow=o.receiveShadow=true;k.group.add(o);
  }
  function build(T,k){
    const ranges=[],objects=[];
    const loader=new T.TextureLoader();
    function surface(file){
      const tex=loader.load('streetscape/surfaces/'+file+'-color.webp');
      tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.anisotropy=4;return tex;
    }
    const turf=surface('meadow'),asphalt=surface('asphalt'),lawn=[];
    for(let i=0;i<32;i++){const a=2*Math.PI*i/32;lawn.push([-2+16.5*Math.cos(a),1+15.5*Math.sin(a)]);}
    const fitLawn=groundPatch(T,k,'Thềm cỏ khu mộ',lawn,turf,0xadc398,2.6,terrace,true);
    const fitParking=groundPatch(T,k,'Bãi đỗ xe khu mộ',parking,asphalt,0xc6bfb2,5.2,(ground,x,z)=>ground(x,z)+.12);
    const roofMap=loader.load('sight-imagery/vung-chua-mai-tranh.webp');roofMap.colorSpace=T.SRGBColorSpace;roofMap.anisotropy=4;
    const thatch=new T.MeshStandardMaterial({map:roofMap,side:T.DoubleSide,roughness:1});
    k.palette({timber:[0x68452f,0x69442c,0x68472e,0x785539],stone:[0xa39a84,0xc3b697,0x737363,0x58615b,0x525b52]});
    function fixed(x,z,yaw,fn){
      const first=k.vertexCount(),children=k.place(x,z,yaw,fn);
      ranges.push([first,k.vertexCount(),x,z]);for(const o of children)objects.push([o,x,z,o.position.y]);
    }
    fixed(tower[0],tower[1],-.088,()=>bellTower(T,k,thatch));
    fixed(0,0,0,()=>shrine(T,k));
    for(const [x,rx,rz,h] of [[0,2.15,2.8,1.60],[-4.75,1.99,2.7,1.42]]){
      const o=mound(T,k,x,rx,rz,h,turf);objects.push([o,x,0,0]);
    }
    // Small pitched shelters appear in the visitor photographs. Their size and
    // placement are estimated from the photographed columns and the path.
    fixed(-1.2,8.4,-.09,()=>{
      for(const x of [-1.5,1.5])for(const z of [-1.2,1.2])k.stamp(k.round,0x785539,x,1.22,z,.12,2.45,.12);
      thatchedShelter(T,k,thatch,3.8,3.2,2.43,1.04,false);
    });
    fixed(-96.8,73.8,-.11,()=>thatchedShelter(T,k,thatch,6.5,4.0,2.68,1.65,true));
    // The same compact car already used by road traffic, parked on the
    // photographed side of the lot. The outer groups own terrain placement.
    if(window.TrafficModels){
      const slots=[[-46,80,.35],[-52,82,.18]].map(([x,z,a])=>{
        const holder=new T.Group();holder.position.set(x,0,z);holder.rotation.y=a;
        k.group.add(holder);objects.push([holder,x,z,.14]);return holder;
      });
      window.TrafficModels.load.loadAsync('traffic/hatchback.glb').then(({scene})=>{
        const box=new T.Box3().setFromObject(scene,true),mid=box.getCenter(new T.Vector3()),scale=3.95/(box.max.z-box.min.z);
        for(const holder of slots){
          const car=scene.clone(true);car.scale.setScalar(scale);car.position.set(-mid.x*scale,-box.min.y*scale,-mid.z*scale);
          car.traverse(o=>{if(o.isMesh)o.castShadow=true;});holder.add(car);
        }
      }).catch(()=>{});
    }
    fixed(7.6,-9.8,.12,()=>{
      const wood=0x68472e;
      k.box(0x94877a,0,.12,0,6.2,.35,4.6);k.box(wood,0,1.52,-.6,4.55,2.68,2.84);
      for(const x of [-2.3,2.3])k.stamp(k.round,wood,x,1.55,1.72,.14,2.96,.14);
      A.curvedRoof(T,k,0,3.04,0,6.6,4.8,1.43,0xa34a31,0x776958,wood,.24,{});
    });
    const fitPath=walkway(T,k),stems=[];
    for(let i=0;i<26;i++){
      const x=-99+i*3.75;
      stems.push([x,-9.4-3*Math.sin(i*1.7),5.0+(i%4)*.64,7.9+(i%5)*.61]);
      if(i<18)stems.push([x,9+3*Math.sin(i*2.1),3.65+(i%3),6.3+(i%4)*.6]);
    }
    for(let i=0;i<16;i++)stems.push([-112-3.4*Math.sin(i),22+i*4.9,4.1+i%3,7.6+i%4]);
    for(const [x,z] of [[8,4],[11,-3],[4,-7],[-7,-5],[-11,-9],[2,-13],[13,10]])stems.push([x,z,5.3,8.3]);
    for(let i=0;i<52;i++){
      const x=-93+i%8*7.3,z=21+Math.floor(i/8)*6.8;
      stems.push([x+.76*Math.sin(i*3.7),z+Math.sin(i),1.15+i%3*.19,1.6+i%4*.22]);
    }
    const models=createTreeModels(T),trees=[],pose=new T.Object3D();
    for(let v=0;v<4;v++){
      const rows=stems.filter(([x,z,w,h])=>{
        if(models.variantAt(x,z)!==v)return false;
        // Keep the close tower camera and the photographed sightline clear.
        if(h>3&&Math.hypot(x-tower[0]+7,z-tower[1]-8)<16+w*.4)return false;
        return !path.some(([ax,az],i)=>{
          if(!i)return false;
          const [bx,bz]=path[i-1],dx=bx-ax,dz=bz-az;
          const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
          return Math.hypot(x-ax-t*dx,z-az-t*dz)<2.15;
        });
      });
      if(!rows.length)continue;
      const mesh=new T.InstancedMesh(models.geometry(v%2?'pine':'tree',true,v),models.material,rows.length);
      mesh.receiveShadow=mesh.castShadow=true;k.group.add(mesh);trees.push([mesh,rows]);
    }
    let rest;
    k.group.userData.fitGround=ground=>{
      const g=k.group.children.at(-1).geometry,p=g.attributes.position;
      rest??=p.clone();
      for(const [first,last,x,z] of ranges){
        const level=x===0&&z===0?terrace(ground,0,3):ground(x,z);
        for(let i=first;i<last;i++)p.setY(i,level+rest.getY(i));
      }
      p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();
      for(const [o,x,z,y] of objects)o.position.y=(o.name==='Phần mộ phủ cỏ'?terrace(ground,x,z):ground(x,z))+y;
      fitPath(ground);fitParking(ground);fitLawn(ground);
      for(const [mesh,rows] of trees){
        rows.forEach(([x,z,w,h],i)=>{pose.position.set(x,ground(x,z),z);pose.rotation.y=x*.78+z*.58;
          pose.scale.set(w,h,w);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);});
        mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
      }
    };
  }
  (window.VietnamSights??=[]).push({id,catalogId,name:'Khu mộ Đại tướng Võ Nguyên Giáp và phu nhân Đặng Bích Hà',
    city:'Phú Trạch',province:'Quảng Trị',formerProvince:'Quảng Bình',locality:'Vũng Chùa, Thọ Sơn, Quảng Đông',region:'Trung Bộ',kind:'Di tích',
    lon,lat,start,yaw:0,width:12,depth:12,gardenRadius:5,viewDistance:720,modeledBuildings:['w885335615'],
    solids:[[tower[0],tower[1],3.85,4.25],[-2.3,0,4.75,2.7]],reserve,mappedEntrance:true,visitOnArrival:true,views,source,photo:winter,
    map:'https://www.openstreetmap.org/node/2495002567',
    description:'Trên sườn núi Thọ ở Vũng Chùa, Đại tướng Võ Nguyên Giáp và Phó Giáo sư Đặng Bích Hà an nghỉ bên nhau, hướng về biển. Lối bộ và vị trí tháp chuông theo bản đồ. Sân viếng, mái che và phần mộ được dựng ước lệ theo ảnh tư liệu.',
    arrivalNote:'Xe dừng ở đường ven biển cạnh bãi đỗ. Lối đi bộ vòng theo sườn đồi lên sân viếng, qua phía trên tháp chuông.',build});
})();

export default window.VietnamSights;
