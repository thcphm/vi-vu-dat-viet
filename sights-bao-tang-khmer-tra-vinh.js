'use strict';
(()=>{
  const id='bao-tang-khmer-tra-vinh',catalogId='osm-node-4793310552',A=window.CentralArch;
  const raw=window.VietnamTourism.byId.get(catalogId),yaw=-1.572,photo=n=>'https://commons.wikimedia.org/?curid='+n;
  const cream=0xe2d8bd,trim=0xe7c679,gold=0xd9ae52,red=0x9e5542,dark=0x514c48,wood=0x6b4837;
  const floor=4.35,pi=Math.PI;
  function view(name,target,eye,fov,file,photoCatalogId,description){
    const [x,y,z]=target,[ex,ey,ez]=eye,dx=ex-x,dz=ez-z,dy=ey-y;
    return {name,description,photo:photo(file),photoCatalogId,height:y/.46,viewFov:fov,viewBase:'monument',
      offset:[x*Math.cos(yaw)+z*Math.sin(yaw),-x*Math.sin(yaw)+z*Math.cos(yaw)],
      viewAngle:yaw+Math.atan2(dx,dz),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewRadius:Math.hypot(dx,dy,dz)};
  }
  const views=[
    view('Nhà trưng bày nhìn qua sân cây',[0,6.8,6],[-10,2.3,39],49,25223209,catalogId,
      'Hai tầng nhà trưng bày nằm giữa những thân cây cao. Qua hàng cột trước sảnh có thể thấy mảng phù điêu thứ hai ở sâu bên trong.'),
    view('Cổng bảo tàng đối diện khu chùa Âng',[0,3.35,45],[2,2.35,76],52,25331929,'bao-tang-khmer-cong-vao',
      'Từ đường chung giữa bảo tàng và chùa Âng, nhìn qua hai cánh cổng vào sân. Bên phải lối vào có một nhà trực nhỏ lợp ngói.'),
    view('Ô kính tam giác và phù điêu mặt tiền',[0,8.85,13.63],[-3.1,5.6,26.4],47,25223209,catalogId,
      'Những ô kính sáng tối ghép thành đầu hồi dưới diềm mái vàng. Phù điêu trên mặt đứng được lấy từ ảnh chụp tháng 3 năm 2013.'),
    view('Hai vòng cồng trong dàn nhạc ngũ âm',[0,floor+.83,-2.6],[2.05,floor+2.15,.23],63,42774900,'bao-tang-khmer-dan-ngu-am',
      'Các lá cồng có núm được buộc thành hàng trên khung gỗ cong, chừa một lối cho người chơi ngồi vào giữa. Phía sau là trống và đàn gỗ trên bục đỏ.'),
  ];
  function turned(T,k,color,x,y,z,profile,sides=20,rx=0){
    const shape=new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),sides);
    k.stamp(shape,color,x,y,z,1,1,1,0,rx);shape.dispose();
  }
  function spire(T,k,x,y,z,scale){
    const profile=[[.50,0],[.54,.13],[.37,.25],[.40,.40],[.26,.55],[.30,.72],[.19,.90],[.19,1.02],[.105,1.23],[.09,1.49],[0,1.94]];
    turned(T,k,gold,x,y,z,profile.map(([r,h])=>[r*scale,h*scale]));
  }
  function finial(k,x,y,z,sign,scale){
    const curve=[[-.08,0],[.17,.10],[.35,.41],[.42,.84],[.41,1.31],[.47,1.66],[.29,1.51],[.19,1.21],[.20,.84],[.09,.57],[-.11,.29]];
    k.outline(curve.map(([a,b])=>[sign*a*scale,b*scale]),gold,x,y,z-.07,.14);
  }
  function gable(T,k,x,z,w,depth,eave,h,glazed){
    A.gabledRoof(T,k,x,eave,z-depth/2,w,depth,h,red,trim,{thick:.22,overhang:.17});
    const base=eave-.1,half=w/2;
    k.outline([[-half,0],[half,0],[0,h]],cream,x,base,z-.16,.3);
    if(glazed){
      // Each row tapers by one upright pane. The inverted panes fill the gaps.
      const n=4,cell=(w-1.18)/n,row=(h-.88)/n;
      for(let j=0;j<n;j++){
        const count=n-j;
        for(let i=0;i<count;i++){
          const cx=x+(i-(count-1)/2)*cell,by=base+.26+row*j;
          k.outline([[-cell*.45,0],[cell*.45,0],[0,row*.88]],(i+j)%2?0x667378:0x465b61,cx,by,z+.16,.04);
          if(i<count-1)k.outline([[-cell*.45,row*.93],[cell*.45,row*.93],[0,.08]],0xc0c4bb,cx+cell/2,by,z+.16,.04);
        }
      }
    }
    for(const s of [-1,1]){
      A.strut(T,k,gold,x,base+h+.07,z+.21,x+s*half,base+.02,z+.21,.125);
      finial(k,x+s*half,base-.04,z+.21,s,.66);
    }
    finial(k,x,base+h,z+.13,1,.75);
  }
  function reliefs(T,k){
    const pos=[],uv=[];
    for(const [z,y,w,h,v0,v1] of [[13.27,6.53,6.15,2.65,0,190],[9.33,2.35,5.76,2.75,190,416]]){
      const quad=[[-w/2,y-h/2,z],[w/2,y-h/2,z],[w/2,y+h/2,z],[-w/2,y+h/2,z]];
      for(const i of [0,1,2,0,2,3]){
        pos.push(...quad[i]);uv.push(i===0||i===3?0:1,1-(i<2?v1:v0)/416);
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();
    const map=new T.TextureLoader().load('sight-imagery/bao-tang-khmer-phu-dieu.webp');map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const mesh=new T.Mesh(g,new T.MeshStandardMaterial({map,roughness:.88}));mesh.name='Hai phù điêu trên mặt tiền';k.group.add(mesh);
  }
  function hall(T,k){
    k.box(0xbda58c,0,-.20,-.25,35,1.00,29.6);
    k.box(cream,0,floor-.21,0,34,.42,27);
    k.box(cream,0,6.53,-12.94,34,4.47,.33);
    k.box(cream,0,2.08,-12.9,33.6,3.95,.36);
    for(const side of [-1,1]){
      k.box(cream,side*16.82,6.56,-1,.36,4.5,24.1);
      for(const z of [-10,-3.35,3.35,10]){
        k.box(cream,side*16.58,2.1,z,.43,4.20,.48);
        k.box(0x738083,side*17.025,6.36,z,.06,1.87,3.6);
        k.box(cream,side*17.07,6.34,z,.09,1.97,.08);
      }
      for(const x of [4.48,10.8,15.8]){
        const front=x===4.48?13.66:10.73;
        k.box(dark,side*x,4.50,front,.46,8.70,.47);
        k.box(cream,side*x,.43,front,.67,.58,.69);
      }
      k.box(cream,side*10.78,6.50,10.48,12.42,4.25,.53);
      k.box(cream,side*10.78,2.05,6.57,12.42,3.63,.37);
      for(const x of [6.6,10.6,14.6]){
        k.box(0x546266,side*x,2.00,6.85,2.65,2.68,.21);
        k.box(cream,side*x,2.0,6.99,.09,2.67,.055);
      }
      k.box(trim,side*12.1,8.66,10.84,11.7,.33,.42);
      for(const x of [6.1,7.95,9.80,11.65,13.5,15.35]){
        k.box(0xc5bda8,side*x,6.51,10.751,.018,3.78,.018);
      }
      for(const y of [5.52,6.55,7.58])k.box(0xc5bda8,side*10.78,y,10.752,12.36,.018,.018);
    }
    const script=new T.TextureLoader().load('sight-imagery/bao-tang-khmer-chu-noi.webp');script.colorSpace=T.SRGBColorSpace;
    const lettering=new T.Mesh(new T.PlaneGeometry(3.90,2.17),new T.MeshBasicMaterial({map:script,transparent:true,depthWrite:false}));
    lettering.position.set(8.07,6.52,10.78);k.group.add(lettering);
    const cv=document.createElement('canvas');cv.width=512;cv.height=192;
    const ctx=cv.getContext('2d');ctx.textAlign='center';ctx.font='bold 35px Arial';ctx.fillStyle='#87652c';
    for(const [line,y] of [['BẢO TÀNG',40],['VĂN HÓA DÂN TỘC KHMER',100],['TRÀ VINH',160]])ctx.fillText(line,256,y,492);
    const words=new T.CanvasTexture(cv);words.colorSpace=T.SRGBColorSpace;
    const name=new T.Mesh(new T.PlaneGeometry(6.13,2.23),new T.MeshBasicMaterial({map:words,transparent:true,depthWrite:false}));
    name.position.set(-9.70,6.52,10.78);k.group.add(name);
    k.box(cream,0,6.6,13.0,9.17,4.5,.48);k.box(cream,0,2.36,9.14,6.10,2.98,.35);
    k.box(0xa98a73,0,.35,14.57,28,.36,1.20);k.box(0xb89b82,0,.15,15.5,28.8,.30,.68);
    A.gabledRoof(T,k,0,8.63,-1,35,21,4,red,gold,{alongX:true,thick:.20});
    gable(T,k,0,13.50,9.88,15.2,8.77,5.95,true);
    for(const side of [-1,1])gable(T,k,side*12.00,10.51,7.15,12.3,8.70,3.90,true);
    gable(T,k,0,8.6,10.4,15.5,9.50,5.80,false);
    spire(T,k,0,15.23,6.2,1.53);reliefs(T,k);
  }
  function gateway(T,k){
    const z=61.4;
    for(const s of [-1,1]){
      k.box(cream,s*15.14,.98,z,22.32,2.4,.40);k.box(0xece2c8,s*15.14,2.20,z,22.5,.13,.49);
      k.box(cream,s*3.68,1.35,z,.72,2.70,.76);
      const x=s*1.64;k.box(0x8e948c,x,.37,z,3.23,.54,.14);k.box(0x8e948c,x,2.03,z,3.23,.20,.14);
      for(let j=0;j<8;j++)k.box(0x90958c,s*(.19+j*.412),1.20,z,.047,1.59,.09);
      k.outline([[0,0],[s*1.35,0],[s*.31,1.49],[0,1.52]],0x8c9086,0,.54,z-.10,.17);
      k.box(0xaaa6a0,s*3.63,3.13,z,.095,2.33,.095);
    }
    k.box(0xa29b90,0,4.28,z,7.31,.09,.09);
    k.box(cream,7.03,1.30,z-.68,4.32,2.88,3.44);
    k.box(dark,6.99,1.59,z+1.065,1.21,1.36,.06);
    k.box(cream,7.0,1.58,z+1.106,.057,1.34,.06);
    k.box(trim,7.02,.30,z+1.17,3.65,.29,.49);
    k.box(cream,7.03,2.79,z-.68,5.10,.27,4.22);
    k.tapered(red,7.03,3.53,z-.68,3.60,.14,1.46,.84,4);spire(T,k,7.03,4.23,z-.68,.56);
  }
  function curvedRail(T,k,x,z,R,y){
    const pts=[];
    for(let i=0;i<=32;i++){
      const a=-2.37+5.04*i/32;pts.push(new T.Vector3(x+R*Math.sin(a),y,z+R*Math.cos(a)));
    }
    const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts),34,.027,6,false);
    k.stamp(g,wood,0,0,0);g.dispose();
  }
  function gongSet(T,k,x,z,r,rotation,faces){
    k.place(x,z,rotation,()=>{
      const base=floor+.40;
      for(const R of [r-.17,r+.17]){
        curvedRail(T,k,0,0,R,base+.06);curvedRail(T,k,0,0,R,base+.49);
        for(let j=0;j<17;j++){
          const a=-2.37+5.04*j/16;
          turned(T,k,wood,R*Math.sin(a),base+.07,R*Math.cos(a),[[.025,0],[.045,.07],[.027,.15],[.042,.22],[.022,.28],[.036,.34],[.025,.40]],8);
        }
      }
      for(let j=0;j<16;j++){
        const a=-2.24+4.76*j/15,px=r*Math.sin(a),pz=r*Math.cos(a),rad=(.202-.0043*j)*r;
        const py=base+.46;
        turned(T,k,j%3===0?0x756c54:0x827962,px,py,pz,[[rad*.99,-.034],[rad,.001],[rad*.89,.027],[rad*.41,.043],[rad*.30,.07],[rad*.21,.095],[0,.099]],20);
        const rings=[[.89,.028],[.41,.044],[.30,.071],[.21,.096],[0,.10]],n=20;
        const vertex=(ring,i)=>{
          const u=ring[0]*Math.cos(i*2*pi/n),v=ring[0]*Math.sin(i*2*pi/n);
          const lx=px+rad*u,lz=pz+rad*v;
          faces.pos.push(x+lx*Math.cos(rotation)+lz*Math.sin(rotation),py+ring[1]+.002,z-lx*Math.sin(rotation)+lz*Math.cos(rotation));
          faces.uv.push(.5+u*.45,.50-v*.46);
        };
        for(let t=1;t<rings.length;t++)for(let i=0;i<n;i++){
          vertex(rings[t-1],i);vertex(rings[t],i);vertex(rings[t-1],i+1);
          if(rings[t][0]){vertex(rings[t],i);vertex(rings[t],i+1);vertex(rings[t-1],i+1);}
        }
        for(const s of [-1,1])A.strut(T,k,0xc6ad81,px+s*rad*.68*Math.cos(a),base+.49,pz-s*rad*.68*Math.sin(a),
          (r+.17)*Math.sin(a+s*.047),base+.50,(r+.17)*Math.cos(a+s*.047),.009);
      }
    });
  }
  function display(T,k){
    k.tapered(0x9d7057,0,floor+.17,-3.52,3.98,3.98,.34,.87,64);
    k.tapered(0xc15446,0,floor+.36,-3.52,3.99,3.99,.055,.87,64);
    const faces={pos:[],uv:[]};
    gongSet(T,k,.30,-1.68,1.02,1.77,faces);gongSet(T,k,-1.52,-3.49,.82,1.33,faces);
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(faces.pos,3));
    geometry.setAttribute('uv',new T.Float32BufferAttribute(faces.uv,2));geometry.computeVertexNormals();
    const gongMap=new T.TextureLoader().load('sight-imagery/bao-tang-khmer-mat-cong.webp');gongMap.colorSpace=T.SRGBColorSpace;
    k.group.add(new T.Mesh(geometry,new T.MeshLambertMaterial({map:gongMap,side:T.DoubleSide})));
    for(const [x,z,r] of [[.07,-5.33,.56],[1.15,-5.34,.54]]){
      k.box(wood,x,floor+.56,z,.62,.30,.61);
      turned(T,k,0x59443b,x,floor+.50,z,[[.32,0],[r,.32],[r*1.08,.70],[r,1.04]],24,.39);
      const skin=new T.CylinderGeometry(r*.97,r*.97,.035,28);
      k.stamp(skin,0xd1bb90,x,floor+1.48,z+.399,1,1,1,0,.39);skin.dispose();
    }
    k.box(wood,-.35,floor+.61,-4.37,.75,.48,.67);
    turned(T,k,0xad8354,-.35,floor+1.03,-4.77,[[.30,0],[.41,.23],[.43,.49],[.35,.79]],24,pi/2);
    for(let j=0;j<26;j++){const a=2*pi*j/26,c=Math.cos(a),s=Math.sin(a);
      A.strut(T,k,0xd7be91,-.35+.32*c,floor+1.03+.32*s,-4.75,-.35+.36*c,floor+1.03+.36*s,-4.02,.011);}
    k.stamp(k.round,0xc1a077,-.35,floor+1.03,-3.973,.35,.025,.35,0,pi/2);
    for(const side of [-1,1]){
      const x=side*2.57,z=-4.22;
      k.box(wood,x,floor+.56,z,.63,.34,1.52);
      for(let j=0;j<16;j++){const t=j/15-.5;
        k.box(j%3===0?0xb18d69:0x947455,x,floor+.98+.90*t*t,z+t*1.84,.52+.18*t,.067,.103,0,-.56*t);}
      for(const s of [-1,1])k.place(x+s*.325,z,pi/2,()=>k.outline([[-1,.96],[-.73,.73],[.67,.73],[1,.98],[.80,.50],[.44,.40],[-.43,.40],[-.77,.53]],wood,0,floor+.38,0,.07));
    }
    // The patterned skirting and the wooden doors behind the instruments
    // give the camera the same scale and orientation as the exhibit photo.
    k.box(0xe7ddbb,0,floor+2.01,-7.35,13,4.08,.20);
    k.box(trim,0,floor+.20,-7.22,12.96,.28,.075);
    for(let i=-21;i<=21;i++){
      k.box(0xb86743,i*.30,floor+.20,-7.173,.16,.16,.025,0,0,pi/4);
      k.box(gold,i*.30,floor+.20,-7.152,.10,.10,.017,0,0,pi/4);
    }
    k.box(cream,0,floor+3.79,-3.50,13,.19,8.20);
    for(const s of [-1,1]){
      k.box(0xe4dbc4,s*6.42,floor+1.92,-3.49,.18,3.82,7.95);
      k.box(trim,s*6.31,floor+.20,-3.49,.07,.28,7.95);
    }
    k.box(0xc0b799,0,floor+.022,-3.52,12.6,.042,8.80);
    for(let i=-7;i<=7;i++)k.box(0x978f7d,i*.84,floor+.046,-3.52,.013,.007,8.77);
    for(let i=-5;i<=5;i++)k.box(0x978f7d,0,floor+.047,-3.52+i*.84,12.58,.007,.013);
    // A small transparent case rests between the drums and the front rail.
    k.box(0xa64638,1.87,floor+.65,-3.75,.94,.54,.65);
    for(const side of [-1,1]){
      for(const back of [-1,1])k.box(0xa3a9a2,1.87+side*.46,floor+1.07,-3.75+back*.31,.014,.33,.014);
      k.box(0xa3a9a2,1.87+side*.46,floor+1.24,-3.75,.014,.014,.64);
      k.box(0xa3a9a2,1.87,floor+1.24,-3.75+side*.31,.94,.014,.014);
      k.box(wood,1.87+side*.13,floor+.94,-3.76,.043,.041,.41);
    }
    const lid=new T.Mesh(new T.BoxGeometry(.94,.32,.64),new T.MeshBasicMaterial({color:0xc7e3e6,transparent:true,opacity:.12,depthWrite:false}));
    lid.position.set(1.87,floor+1.08,-3.75);k.group.add(lid);
    for(const x of [-2.85,-1.90]){k.box(wood,x,floor+1.23,-7.20,.91,2.45,.14);
      k.box(0x99a59d,x,floor+1.62,-7.117,.70,1.18,.045);}
    for(const x of [-4.84,4.84])k.box(cream,x,floor+.57,-4.7,1.1,1.14,2.8);
  }
  function courtyard(T,k){
    // Follow the local grade in short spans so the sandy courtyard never
    // cuts diagonally through the vegetation surface.
    const first=k.vertexCount();
    for(let i=0;i<9;i++)k.box(0xbda88a,0,-.32,17.85+i*5.2,35,.78,5.23);
    // Fallen leaves and the benches are visible in the entrance photograph.
    const leaf=new T.CircleGeometry(1,5);
    const random=n=>{const f=Math.sin(n*74.32+.35)*39407.31;return f-Math.floor(f);};
    for(let i=0;i<310;i++){
      const x=(random(i+7)-.5)*34.4,z=15.4+random(i+370)*46.60;
      k.stamp(leaf,i%4===0?0x987d4a:0xaa9062,x,.092,z,.06+.032*random(i+700),.026,1,random(i+1000)*pi,-pi/2);
    }
    leaf.dispose();
    const last=k.vertexCount();
    for(const [x,z] of [[12.82,25.90],[14.12,33.28],[-14.60,41.20]]){
      k.place(x,z,x<0?pi/2:-pi/2,()=>{
        for(const s of [-1,1])k.box(0x8d7458,s*.81,.26,0,.15,.52,.42);
        k.box(wood,0,.56,0,2.10,.14,.50);k.box(wood,0,.91,-.22,2.08,.39,.10,0,-.13);
      });
    }
    for(const [x,z] of [[-14,19],[14.7,21],[-16.3,31],[16.2,38],[-19,46],[17,53],[-21,56],[-22,5],[23,6],[-24,-11],[23,-11]]){
      A.trees(T,k,[{x,z,h:16+Math.abs(x+z)%7,width:7.7+Math.abs(z)%4}]);
    }
    let geo,rest;
    k.group.userData.fitGround=ground=>{
      geo??=k.group.children.find(o=>o.geometry?.hasAttribute('finishKind'))?.geometry;
      if(!geo)return;
      const a=geo.attributes.position;rest??=Float32Array.from({length:last-first},(_,i)=>a.getY(first+i));
      for(let i=first;i<last;i++)a.setY(i,ground(a.getX(i),a.getZ(i))+rest[i-first]+.12);
      a.needsUpdate=true;geo.computeBoundingBox();geo.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,yaw,name:'Bảo tàng Văn hóa dân tộc Khmer Trà Vinh',
    lon:106.3049965,lat:9.9161553,start:[106.3043554,9.9161497],kind:'Bảo tàng',city:'Nguyệt Hóa',province:'Vĩnh Long',formerProvince:'Trà Vinh',
    width:35,depth:30,gardenRadius:1,views,photo:photo(25223209),mappedEntrance:true,visitOnArrival:true,
    boundary:[[-18,-15],[18,-15],[18,61],[-18,61]],reserve:(x,z,r)=>Math.abs(x)<19+r&&z> -16-r&&z<62+r,solids:[[0,0,16,12]],
    description:'Bảo tàng ở phường Nguyệt Hóa, đối diện chùa Âng, trong cụm danh thắng Ao Bà Om. Nhà hai tầng giới thiệu đời sống, nghề thủ công và nghệ thuật của người Khmer Nam Bộ. Mặt tiền và dàn ngũ âm được phục dựng từ ảnh tư liệu. Kích thước, vị trí cổng và cách đặt nhạc cụ trong phòng là ước lượng.',
    arrivalNote:'Xe dừng trên đường giữa chùa Âng và bảo tàng. Từ cổng, các góc đi bộ dẫn qua sân tới mặt tiền và vào phòng trưng bày nhạc cụ.',
    build(T,k){k.palette({plaster:cream,tile:red,timber:wood});hall(T,k);gateway(T,k);display(T,k);courtyard(T,k);}});
})();
