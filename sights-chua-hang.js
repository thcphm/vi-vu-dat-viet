'use strict';
(()=>{
  const id='chua-hang-tra-vinh',catalogId='osm-way-1352279406',raw=window.VietnamTourism.byId.get(catalogId);
  const A=window.CentralArch,pi=Math.PI,yaw=1.76528,lon=106.3450733,lat=9.8871507;
  const start=[106.3439176,9.8880711],photo=n=>'https://commons.wikimedia.org/?curid='+n;
  const source='https://vinhlong.gov.vn/du-khach-old/diadanh_test';
  const aerial='https://thanhnien.vn/can-canh-chua-hang-hang-tram-tuoi-giua-rung-cay-co-thu-o-vinh-long-185250717132218388.htm';
  const ivory=0xeee5ca,gold=0xd3b776,white=0xeee9da,dark=0x604a41,stone=0xaa9585;
  const red=0xa64d55,mint=0x9abfa9,blue=0x53687d,green=0x88a47a,tile=0xe5d690;
  const gateX=123.49,gateZ=-94.49,gateYaw=3.0282;
  function gatePoint(x,y,z){
    const c=Math.cos(gateYaw),s=Math.sin(gateYaw);
    return [gateX+c*x+s*z,y,gateZ-s*x+c*z];
  }
  const gatePath=[[gateX,gateZ],[123.0,-90.5],[121,-83],[111,-76],[92,-66],[74,-55],[54,-42],[34,-32],[20,-22]];
  function onGatePath(x,z,margin){
    for(let i=1;i<gatePath.length;i++){
      const [ax,az]=gatePath[i-1],[bx,bz]=gatePath[i],dx=bx-ax,dz=bz-az;
      const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
      if(Math.hypot(x-ax-t*dx,z-az-t*dz)<margin)return true;
    }
    return false;
  }
  function view(name,target,eye,fov,ref,photoCatalogId,description){
    const [x,y,z]=target,[ex,ey,ez]=eye,dx=ex-x,dz=ez-z,dy=ey-y;
    return {name,description,photo:ref,photoCatalogId,height:y/.46,viewFov:fov,viewBase:'monument',
      offset:[x*Math.cos(yaw)+z*Math.sin(yaw),-x*Math.sin(yaw)+z*Math.cos(yaw)],viewAngle:yaw+Math.atan2(dx,dz),
      viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewRadius:Math.hypot(dx,dy,dz)};
  }
  const views=[
    view('Chánh điện trên nền đỏ',[0,7.2,1.3],[-26,3.7,32],47,photo(25299321),catalogId,
      'Từ sân nhìn chéo lên chánh điện, qua nền màu đỏ và hàng cột trắng bao quanh hành lang. Hai cửa phía đông mở ra cầu thang dẫn xuống sân.'),
    view('Mái ngói màu và tháp nóc',[0,13.85,-.35],[-17,17.1,21],39,aerial,'chua-hang-mai-ngoi',
      'Ngói xanh, vàng và đỏ xếp thành các dải viền trên từng mặt mái. Hai đầu hồi dọc nhà và hai đầu hồi ngang gặp nhau dưới tháp nhọn ở giữa.'),
    view('Cột chim và nhà trưng bày',[9.1,5.6,-51],[.5,2.7,-21.1],52,photo(25299317),'chua-hang-nha-trung-bay',
      'Bên kia sân phía tây là ngôi nhà hai tầng có hàng hiên màu vàng. Giữa những chậu kiểng, thân cột màu đỏ uốn xoắn vươn lên tới hình chim ở đỉnh.'),
    view('Rừng cây quanh khu chánh điện',[-15,7.0,13],[-69,86,94],54,aerial,'chua-hang-rung-cay',
      'Tán cây sao và dầu bao quanh các khoảng sân. Nhiều loài cò, diệc về trú trong khuôn viên chùa. Cây và chim trong cảnh mô phỏng sinh cảnh này.'),
    view('Ba cửa vòm nhìn từ Quốc lộ 54',gatePoint(0,3.65,3.65),gatePoint(1.4,2.24,18.9),44,photo(25299316),'chua-hang-cong-tay',
      'Cổng phụ phía tây quay ra Quốc lộ 54. Hai cửa nhỏ nằm hai bên vòm lớn, bên trên có biển chữ Khmer và các tháp nhỏ. Dáng cổng này đã cho ngôi chùa tên gọi Chùa Hang.'),
    view('Dưới lòng vòm giữa',gatePoint(-1.12,1.58,-2.25),gatePoint(.78,1.56,3.45),63,photo(25299316),'chua-hang-long-vom',
      'Đường qua cổng dài khoảng 8 m. Dưới vòm lớn, nhìn sang trái có thể thấy các cửa cuốn nhỏ thông sang lối bên cạnh. Đi hết vòm là lối cây dẫn vào sân.'),
  ];
  function turned(T,k,c,x,y,z,profile,sides=16){
    const g=new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),sides);
    k.stamp(g,c,x,y,z);g.dispose();
  }
  function finial(k,x,y,z,sign,size,angle=0){
    k.outline([[0,0],[.25,.15],[.48,.46],[.56,.9],[.50,1.16],[.43,.78],[.19,.49],[-.06,.38]]
      .map(([a,b])=>[sign*a*size,b*size]),gold,x,y,z,.105,angle);
  }
  // Rectangular bands of glazed tiles turn with each trapezoidal roof face.
  function roof(T,k){
    const panels=new Map();
    function polygon(c,points){
      if(!panels.has(c))panels.set(c,[]);
      const a=panels.get(c);
      for(const t of [[0,1,2],[0,2,3]]){
        const p=t.map(i=>points[i]);
        if((p[1][2]-p[0][2])*(p[2][0]-p[0][0])-(p[1][0]-p[0][0])*(p[2][2]-p[0][2])<0)p.reverse();
        a.push(...p.flat());
      }
    }
    const mix=(a,b,t)=>a.map((n,i)=>n+(b[i]-n)*t);
    function painted(p,q,r,s){
      const at=(u,v)=>mix(mix(p,q,u),mix(s,r,u),v);
      let outer=[p,q,r,s];
      for(const [u,v,c] of [[.031,.083,blue],[.060,.15,tile],[.080,.215,green],[.102,.268,ivory],[.123,.315,red]]){
        const inner=[at(u,v),at(1-u,v),at(1-u,1-v),at(u,1-v)];
        for(let i=0;i<4;i++)polygon(c,[outer[i],outer[(i+1)%4],inner[(i+1)%4],inner[i]]);
        outer=inner;
      }
      polygon(tile,outer);
    }
    function ring(w,d,y){return [[-w,y,-d],[w,y,-d],[w,y,d],[-w,y,d]];}
    function hip(w,d,y,iw,idd,iy){
      const a=ring(w,d,y),b=ring(iw,idd,iy);
      for(let i=0;i<4;i++){
        const j=(i+1)%4;painted(a[i],a[j],b[j],b[i]);
        A.strut(T,k,gold,...a[i],...b[i],.09);A.strut(T,k,ivory,...a[i],...a[j],.18);
      }
    }
    hip(9.05,15.63,8.58,6.08,12.05,10.16);
    hip(6.35,12.36,10.14,4.29,10.36,11.40);
    function gableFace(w,h,x,y,z,direction){
      k.place(x,z,direction,()=>{
        k.outline([[-w,0],[w,0],[0,h]],ivory,0,y,-.068,.145);
        for(const side of [-1,1]){
          A.strut(T,k,gold,side*w,y+.035,.096,0,y+h+.035,.096,.115);
          A.strut(T,k,white,side*(w-.43),y+.18,.102,0,y+h-.52,.102,.055);
          finial(k,side*w,y,.02,side,.90);
          for(let j=1;j<10;j++){
            const t=j/10;k.outline([[0,0],[side*.10,.10],[side*.12,.29],[side*.035,.21],[-side*.025,.07]],gold,
              side*w*t,y+h*(1-t),.04,.12);
          }
        }
        const relief=0xccbea0;
        for(let row=0;row<5;row++){
          const yy=y+.25+row*h*.15,n=4-row,cell=w*.182;
          for(let j=-n;j<=n;j++){
            const xx=j*cell,s=cell*.90;
            k.outline([[0,.04],[-.20,.22],[-.28,.46],[-.13,.37],[0,.54],[.13,.37],[.28,.46],[.20,.22]]
              .map(([u,v])=>[u*s,v*s]),relief,xx,yy,.090,.057);
            for(const side of [-1,1]){
              const shape=[[0,.01],[.14,.065],[.34,.12],[.45,.31],[.39,.45],[.31,.47],[.28,.36],[.34,.38],
                [.35,.32],[.26,.25],[.10,.20]].map(([u,v])=>[u*s*side,v*s]);
              k.outline(shape,relief,xx,yy,.084,.048);
            }
          }
        }
      });
    }
    for(const side of [-1,1]){
      for(const [z0,z1] of [[-10.63,-3.33],[3.33,10.63]]){
        painted([side*4.40,11.35,z0],[side*4.40,11.35,z1],[0,15.85,z1],[0,15.85,z0]);
      }
      painted([side*4.40,11.35,-3.33],[side*4.40,11.35,3.33],[0,15.85,3.33],[0,15.85,-3.33]);
      for(const s of [-1,1]){
        painted([0,11.51,s*3.48],[side*5.32,11.51,s*3.48],[side*5.32,16.30,0],[0,16.30,0]);
      }
      gableFace(4.40,4.50,0,11.35,side*10.63,side>0?0:pi);
      gableFace(3.48,4.79,side*5.32,11.51,0,side*pi/2);
      for(const end of [-1,1])finial(k,side*9.01,8.57,end*15.61,side,1.02);
    }
    for(const [c,p] of panels){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();
      k.stamp(g,c,0,0,0);g.dispose();
    }
    k.box(gold,0,15.84,0,.14,.16,21.32);k.box(gold,0,16.28,0,10.65,.17,.14);
    const spire=0xb6aa90,edge=0x99948b;
    turned(T,k,gold,0,15.8,0,[[1.06,0],[1.13,.17],[.94,.35],[.82,.94],[.71,1.18],[.84,1.33],[.76,1.48]],16);
    turned(T,k,spire,0,17.26,0,[[.76,0],[.60,.14],[.57,.45],[.66,.58],[.55,.74],[.40,.88],[.31,1.23],[.23,1.40],
      [.16,1.74],[.11,2.02],[.075,2.42],[0,3.42]],20);
    for(const [y,r] of [[17.31,.78],[17.84,.68],[18.16,.50],[18.48,.36],[18.72,.29],[18.95,.22],[19.18,.17]]){
      turned(T,k,edge,0,y,0,[[r*.83,0],[r,.045],[r,.09],[r*.75,.15]],16);
    }
    for(let j=0;j<8;j++){
      const a=j*pi/4;k.place(.575*Math.sin(a),.575*Math.cos(a),a,()=>{
        k.arch(ivory,0,17.42,-.09,.36,.46);k.box(dark,0,17.58,-.035,.17,.31,.056);
      });
    }
  }
  function terrace(T,k){
    for(const [w,d,y,h,c] of [[25.1,39.6,-.15,.88,stone],[24.7,39.2,.55,.76,red],[24.9,39.4,.95,.16,ivory],
      [22.4,36.0,1.13,.34,stone],[20.3,33.1,1.54,.55,red],[20.6,33.4,1.86,.14,white],
      [17.5,30.3,2.17,.55,red],[17.8,30.6,2.49,.16,ivory]]){
      k.box(c,0,y,0,w,h,d);
    }
    for(const s of [-1,1]){
      for(let j=0;j<13;j++){
        const h=.17+(12-j)*.18;k.box(stone,0,h/2,s*(15.36+j*.37),4.0,h,.39);
      }
      for(const side of [-1,1]){
        A.strut(T,k,mint,side*2.15,2.97,s*15.46,side*2.15,.75,s*20.20,.19);
        finial(k,side*2.15,.62,s*20.20,side,.69);
      }
    }
    function rail(x1,z1,x2,z2,n){
      const dx=x2-x1,dz=z2-z1;
      A.strut(T,k,stone,x1,1.19,z1,x2,1.19,z2,.16);A.strut(T,k,ivory,x1,2.04,z1,x2,2.04,z2,.14);
      for(let i=0;i<=n;i++){
        const x=x1+dx*i/n,z=z1+dz*i/n,post=i%8===0;
        if(post){
          k.box(white,x,1.65,z,.32,1.12,.32);k.tapered(gold,x,2.26,z,.25,.08,.18,1,4);
        }else{
          k.tapered(red,x,1.40,z,.085,.145,.34,1,8);k.tapered(red,x,1.76,z,.145,.075,.38,1,8);
        }
      }
    }
    for(const s of [-1,1]){
      rail(s*12.12,-19.12,s*12.12,19.12,72);
      for(const side of [-1,1])rail(side*2.40,s*19.12,side*12.12,s*19.12,16);
    }
  }
  function hall(T,k){
    terrace(T,k);k.box(ivory,0,5.56,0,12.84,6.06,24.90);
    for(const s of [-1,1]){
      k.box(mint,0,2.96,s*12.47,12.85,.24,.07);
      for(const x of [-3.3,3.3]){
        k.box(gold,x,4.69,s*12.50,1.92,4.17,.085);k.box(dark,x,4.66,s*12.56,1.63,3.91,.12);
      }
      for(let i=0;i<8;i++){
        const z=-11.00+i*22/7,x=s*6.48;
        k.box(gold,x,5.18,z,.13,2.72,1.15);k.box(0x834e4e,x+s*.083,5.18,z,.075,2.50,.94);
        k.place(x,z,s*pi/2,()=>k.outline([[-.66,0],[-.43,.15],[-.28,.50],[0,.93],[.28,.50],[.43,.15],[.66,0]],gold,0,6.50,0,.105));
      }
      k.box(mint,s*6.44,2.96,0,.09,.24,24.91);
    }
    function pillar(x,z){
      k.stamp(k.round,white,x,5.52,z,.34,5.96,.34);
      turned(T,k,ivory,x,2.56,z,[[.42,0],[.43,.15],[.37,.23],[.32,.41]]);
      turned(T,k,gold,x,7.93,z,[[.33,0],[.38,.14],[.44,.28],[.51,.40],[.52,.52]]);
      for(const s of [-1,1])A.strut(T,k,gold,x,7.93,z,x+s*.56,8.42,z,.08);
    }
    for(const s of [-1,1]){
      for(let i=0;i<9;i++)pillar(s*8.15,-14.88+i*3.72);
      for(const x of [-4.08,0,4.08])pillar(x,s*14.88);
    }
    for(const [y,w,d,h,c] of [[8.44,17.76,30.53,.24,ivory],[8.61,18.0,30.84,.11,gold]]){
      k.box(c,0,y,0,w,h,d);
    }
    roof(T,k);
  }
  function gardenHall(T,k){
    const saffron=0xe1ac63,teal=0x8cbbaf;
    k.box(stone,10,-.02,-62.1,36,.54,18.3);
    k.box(saffron,10,4.04,-65.2,34.8,7.72,10.5);
    const pos=[],uv=[];
    function strip(x,y,z,w,h,top,bottom){
      const points=[[x-w/2,y,z],[x+w/2,y,z],[x+w/2,y+h,z],[x-w/2,y+h,z]];
      const p=top===61?258/512:1;
      for(const i of [0,1,2,0,2,3]){
        pos.push(...points[i]);uv.push(i===1||i===2?p:0,1-(i<2?bottom:top)/155);
      }
    }
    for(const [x,width,front] of [[-.7,13.4,-54.68],[10,8,-52.68],[20.7,13.4,-54.68]]){
      const back=-69.92,depth=front-back;
      for(const y of [.40,4.18,8.13])k.box(ivory,x,y,(front+back)/2,width+.25,.21,depth+.20);
      k.box(teal,x,8.50,front,width+.26,.65,.23);
      const bays=width>9?3:2;
      for(let j=0;j<=bays;j++){
        const xx=x-width/2+width*j/bays;
        k.box(saffron,xx,4.22,front-.26,.31,7.79,.31);
        for(const y of [.58,4.33]){
          k.box(gold,xx,y,front-.26,.49,.22,.49);
          for(const sign of [-1,1])A.strut(T,k,teal,xx,y+3.00,front-.26,xx+sign*.38,y+3.49,front-.26,.073);
        }
      }
      for(let j=0;j<bays;j++){
        const widthBay=width/bays,xx=x-width/2+(j+.5)*widthBay;
        for(const y of [1.69,5.54]){
          k.box(gold,xx,y+.12,-59.92,1.52,2.44,.14);
          k.box(0x557e79,xx,y+.12,-59.82,1.23,2.20,.07);
        }
        k.box(teal,xx,4.79,front,widthBay-.20,.89,.155);
        strip(xx,4.37,front+.082,widthBay-.23,.81,106,155);
        strip(xx,8.21,front+.122,widthBay,.58,0,60);
      }
      if(x===10){
        k.box(dark,x,7.36,front+.02,3.38,.62,.16);strip(x,7.087,front+.106,3.23,.53,61,104);
        for(let j=0;j<4;j++)k.box(stone,x,.11+(3-j)*.115,front+.27+j*.33,5.47,.22+(3-j)*.23,.35);
      }
    }
    for(let i=0;i<48;i++){
      const p=(a,y)=>[9.1+1.99*Math.cos(a),y,-33.7+1.99*Math.sin(a)];
      const a=i*pi/24,b=(i+1)*pi/24,points=[p(a,.48),p(b,.48),p(b,.94),p(a,.94)];
      for(const j of [0,1,2,0,2,3]){
        const u=((i%2)+(j===1||j===2?1:0))/2;
        pos.push(...points[j]);uv.push((261+u*245)/512,1-(j<2?103:62)/155);
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();
    const map=new T.TextureLoader().load('sight-imagery/chua-hang-nha-trung-bay.webp');map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const mesh=new T.Mesh(g,new T.MeshStandardMaterial({map,roughness:.8,side:T.DoubleSide}));mesh.name='Hoa văn nhà trưng bày và chân cột chim';k.group.add(mesh);
  }
  function bird(T,k,x,y,z,s,c){
    const egg=new T.SphereGeometry(1,12,8);
    k.stamp(egg,c,x,y,z,.19*s,.17*s,.43*s);
    k.stamp(egg,c,x,y+.22*s,z+.34*s,.13*s,.13*s,.16*s);
    k.stamp(egg,c,x,y+.23*s,z+.52*s,.062*s,.055*s,.17*s);
    for(const d of [-1,1]){
      k.stamp(egg,c,x+d*.20*s,y+.10*s,z-.06*s,.12*s,.12*s,.42*s,0,-.26,d*.32);
      A.strut(T,k,gold,x+d*.075*s,y-.09*s,z-.02*s,x+d*.10*s,y-.31*s,z-.015*s,.026*s);
    }
    k.stamp(egg,c,x,y+.075*s,z-.54*s,.15*s,.065*s,.35*s,0,.20);
    egg.dispose();
  }
  function court(T,k){
    const rand=n=>{const v=Math.sin(n*31.16+8)*4115.13;return v-Math.floor(v);};
    const foliage=[],uv=[];
    k.box(0xcbbba3,1.7,-.17,-9.7,46,.48,84);
    k.box(0xc9bea9,8.2,-.16,-40.5,47,.49,26);
    k.box(0xbca98f,34.4,-.19,-24.3,20,.48,68);
    k.box(0xc5b79f,0,-.15,36.6,12.80,.46,17.0);
    for(let i=-4;i<=4;i++){
      k.box(0xc0b19b,i*4.95,.077,-10,.027,.009,84);
    }
    for(let i=-8;i<=5;i++){
      k.box(0xc0b19b,1.7,.078,i*5.88,45.96,.009,.026);
    }
    function bonsai(x,z,s,type=0){
      const pot=type===2?0xbb9c89:type===1?0xb18b77:0xb57a65;
      turned(T,k,pot,x,.06,z,[[.52*s,0],[.47*s,.16*s],[.70*s,.58*s],[.75*s,.65*s],[.77*s,.75*s],[.61*s,.77*s]]);
      A.strut(T,k,dark,x,.63*s,z,x+.09*s,1.49*s,z,.08*s);
      const w=(type===2?1.0:.67)*s,h=(type===1?2.52:type===2?1.55:1.87)*s,base=.93*s;
      for(let j=0;j<3;j++){
        const a=j*pi/3+rand(x+z)*pi,dx=w*Math.cos(a),dz=w*Math.sin(a);
        const p=[[x-dx,base,z-dz],[x+dx,base,z+dz],[x+dx,base+h,z+dz],[x-dx,base+h,z-dz]];
        for(const i of [0,1,2,0,2,3]){
          foliage.push(...p[i]);uv.push((type+(i===1||i===2?.996:.004))/3,i<2?.005:.995);
        }
      }
    }
    for(const s of [-1,1]){
      for(let i=0;i<6;i++)bonsai(s*14.1,-15+i*5.8,.81+.34*rand(i+s),i%3===1?1:0);
      for(const x of [-6.4,6.4])bonsai(x,s*22.3,1.12,1);
      for(let i=0;i<6;i++)bonsai(10+(i-2.5)*4.9,-48.1+s*2.65,.86+.25*rand(i+13),(i+(s>0?0:1))%3);
    }
    for(const [x,z,s,t] of [[14,-33,1.45,2],[4.7,-37,1.07,0],[-1,-40,1.18,2],[1,-31,1.16,1],[19,-37,1.37,1],[-6,-42,1.32,0]])bonsai(x,z,s,t);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(foliage,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();
    const map=new T.TextureLoader().load('sight-imagery/chua-hang-cay-kieng.webp');map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const shrubs=new T.Mesh(g,new T.MeshLambertMaterial({map,side:T.DoubleSide,alphaTest:.39,emissive:0x161a12}));
    shrubs.name='Cây kiểng và hoa giấy trong sân';k.group.add(shrubs);
    const globe=new T.SphereGeometry(1,12,9);
    for(const [x,z] of [[-1.4,-40.6],[21.6,-38.8]]){
      turned(T,k,0x78816e,x,.09,z,[[.20,0],[.24,.13],[.12,.24],[.082,2.67],[.16,2.74]]);
      for(const sign of [-1,0,1]){
        const dx=sign*.56,h=sign?3.43:3.86;A.strut(T,k,gold,x,2.70,z,x+dx,h-.26,z,.049);
        k.stamp(globe,ivory,x+dx,h,z,.185,.215,.185);
      }
    }
    globe.dispose();
    const x=9.1,z=-33.7,rose=0x9a575d;
    k.box(0xb39f87,x,.14,z,5.44,.45,5.44);
    turned(T,k,gold,x,.27,z,[[1.94,0],[2.11,.10],[2.10,.19],[1.96,.26],[1.96,.67],[2.04,.70],[2.05,.77],[1.83,.85]]);
    turned(T,k,red,x,1.11,z,[[.83,0],[.73,.12],[.54,.21],[.45,.35]]);
    turned(T,k,rose,x,.88,z,[[.52,0],[.65,.22],[.46,.39],[.32,.60],[.30,6.18],[.44,6.42],[.33,6.58]]);
    const pts=[];for(let i=0;i<=134;i++){
      const a=i*pi/8;pts.push(new T.Vector3(x+.325*Math.cos(a),1.44+i*5.76/134,z+.325*Math.sin(a)));
    }
    const coil=new T.TubeGeometry(new T.CatmullRomCurve3(pts),140,.095,6,false);k.stamp(coil,0xbb7e7b,0,0,0);coil.dispose();
    for(const s of [-1,1])k.outline([[0,0],[s*.35,.15],[s*.53,.53],[s*.59,.83],[s*.39,.67],[s*.18,.55],[0,.52]],rose,x,7.06,z-.065,.13);
    bird(T,k,x,7.92,z,1.06,rose);
    for(const s of [-1,1])for(const row of [-1,1])for(const n of [0,1]){
      const xx=s*(n?11.75:6.45),zz=row*(n?17.6:23.20);
      turned(T,k,red,xx,.09,zz,[[.56,0],[.60,.22],[.42,.40],[.35,.66],[.23,.78],[.20,4.57],[.33,4.72],[.29,4.90],[.36,5.03]]);
      for(const h of [.44,.71,1.2,4.37,4.70])k.tapered(gold,xx,.09+h,zz,h<1?.45:.24,h<1?.44:.24,.09,1,12);
      bird(T,k,xx,5.37,zz,.97,gold);
    }
  }
  function barrelGate(T,k){
    const masonry=0xb9b7a8,rim=0xcac7b8,shadow=0x8c8979,scale=.01875;
    const u=x=>(x-320)*scale,h=y=>(460-y)*scale;
    const arches=[[95,37,336,305],[321,113,359,275],[544,37,337,304]];
    const pos=[],uv=[];
    function mapped(points,pixels){
      for(const i of [0,1,2,0,2,3]){pos.push(...points[i]);uv.push(pixels[i][0]/640,1-pixels[i][1]/460);}
    }
    function endWall(){
      const s=new T.Shape(),line=(x,y)=>s.lineTo(u(x),h(y));s.moveTo(u(1),h(460));
      for(const [cx,rx,spring,top] of arches){
        line(cx-rx,460);line(cx-rx,spring);
        for(let i=0;i<=32;i++){const a=pi*(1-i/32);line(cx+rx*Math.cos(a),spring-(spring-top)*Math.sin(a));}
        line(cx+rx,460);
      }
      for(const p of [[639,460],[639,192],[600,192],[598,197],[491,197],[491,194],[451,194],[450,201],
        [414,201],[408,190],[235,190],[224,201],[195,201],[190,194],[151,194],[149,197],[48,197],[46,193],[1,193]])line(...p);
      s.closePath();
      for(const [l,r] of [[50,150],[493,596]]){
        const slot=new T.Path();slot.moveTo(u(l),h(207));slot.lineTo(u(r),h(207));slot.lineTo(u(r),h(231));slot.lineTo(u(l),h(231));slot.closePath();
        s.holes.push(slot);
      }
      return s;
    }
    const shape=endWall();
    k.profile(shape,masonry,0,0,3.64,.36);k.profile(shape,masonry,0,0,-4,.36);
    const face=new T.ShapeGeometry(shape,28).toNonIndexed(),points=face.attributes.position;
    for(let i=0;i<points.count;i++){
      const x=points.getX(i),y=points.getY(i);pos.push(x,y,4.008);uv.push((x/scale+320)/640,y/(460*scale));
    }
    face.dispose();
    for(const sign of [-1,1]){
      const z=sign*3.82;
      for(const [l,r] of [[50,150],[493,596]]){
        for(let j=0;j<10;j++){
          const x=u(l+(j+.5)*(r-l)/10);
          turned(T,k,rim,x,h(231),z,[[.065,0],[.072,.06],[.041,.12],[.067,.22],[.047,.33],[.072,.40],[.066,.45]],8);
        }
      }
      for(const x of [-5.52,5.52]){
        turned(T,k,masonry,x,4.94,z,[[.37,0],[.42,.10],[.36,.18],[.26,.26],[.19,.49],[.23,.56],[.15,.63],[.09,.78],[0,.93]]);
      }
    }
    for(const x of [-5.46,5.46]){
      k.box(masonry,x,2.36,0,1.04,4.75,7.66);
      k.box(rim,x,4.74,0,1.12,.15,7.82);
    }
    k.box(masonry,0,4.61,0,11.88,.27,7.65);
    k.box(0xb4a99a,0,-.10,0,11.99,.30,8.18);
    for(const [cx,rx,sy,ty] of arches){
      const x=u(cx),r=rx*scale,spring=h(sy),rise=(sy-ty)*scale;
      for(let j=0;j<32;j++){
        const a=pi*j/32,b=pi*(j+1)/32,at=(th,z)=>[x+r*Math.cos(th),spring+rise*Math.sin(th),z];
        mapped([at(b,-3.70),at(a,-3.70),at(a,3.70),at(b,3.70)],[[475+155*(j+1)/32,97],[475+155*j/32,97],
          [475+155*j/32,19],[475+155*(j+1)/32,19]]);
        // Two narrow mouldings follow the outer lip of each masonry arch.
        for(const z of [-4.018,4.018]){
          const curve=th=>[x+(r+.054)*Math.cos(th),spring+(rise+.054)*Math.sin(th),z];
          A.strut(T,k,z>0?rim:shadow,...curve(a),...curve(b),.044);
        }
      }
    }
    // Three transverse openings on each side connect the central passage to
    // its smaller neighbours. They can be seen through the front archway.
    for(const x of [-2.80,2.78])k.place(x,0,pi/2,()=>{
      const side=new T.Shape();side.moveTo(-3.82,0);
      for(const cx of [-2.54,0,2.54]){
        const r=.76,spring=.90;side.lineTo(cx-r,0);side.lineTo(cx-r,spring);
        side.absellipse(cx,spring,r,1.23,pi,0,true);side.lineTo(cx+r,0);
      }
      side.lineTo(3.82,0);side.lineTo(3.82,4.57);side.lineTo(-3.82,4.57);side.closePath();
      k.profile(side,0xb7b1a0,0,0,-.56,1.12);
    });
    // Front crest. Each pair of surveyed image rows forms a band of a
    // stepped, tapering masonry volume with its own photographed front face.
    const bands=[[230,412,199],[232,411,190],[240,403,186],[240,402,177],[246,397,174],[246,395,165],
      [255,389,161],[266,380,155],[276,368,142],[287,361,124],[294,355,105],[299,351,91],[306,347,86],
      [310,344,84],[308,346,78],[313,340,73],[310,342,66],[314,338,60],[317,335,57],[318,335,52],
      [322,331,46],[322,330,39],[325,328,35]];
    function section([l,r,y]){
      const depth=(r-l)*scale*.41,front=2.56+depth,back=2.56-depth;
      return [[u(l),h(y),front],[u(r),h(y),front],[u(r),h(y),back],[u(l),h(y),back]];
    }
    for(let j=1;j<bands.length;j++){
      const p=bands[j-1],q=bands[j],low=section(p),high=section(q);
      mapped([low[0],low[1],high[1],high[0]],[[p[0],p[2]],[p[1],p[2]],[q[1],q[2]],[q[0],q[2]]]);
      const edges=[];
      for(let i=1;i<4;i++){const n=(i+1)%4;for(const point of [low[i],low[n],high[n],low[i],high[n],high[i]])edges.push(...point);}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(edges,3));g.computeVertexNormals();
      k.stamp(g,j%4===2?rim:masonry,0,0,0);g.dispose();
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();
    const tex=new T.TextureLoader().load('sight-imagery/chua-hang-cong-vom.webp');tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
    const panels=new T.Mesh(g,new T.MeshStandardMaterial({map:tex,side:T.DoubleSide,alphaTest:.33,roughness:.98,emissive:0x0b0b09}));
    panels.name='Mặt cổng và ba lòng vòm chùa Hang';k.group.add(panels);
    for(const [x,y,z,s] of [[.11,7.92,2.56,.67],[-5.52,5.84,3.82,.53],[5.52,5.84,3.82,.53]]){
      k.box(dark,x,y+s*.49,z,.025,s,.025);
      const colours=[0x4b7fb4,0xe7c955,0xc96155,0xe4e2d3,0xd78c4c];
      for(let i=0;i<5;i++)k.box(colours[i],x+s*(.035+i*.08),y+s*.78,z+.028*Math.sin(i*.9),s*.09,s*.43,.016,0,0,.07);
    }
  }
  function outbuildings(T,k){
    // The western exhibit building joins a red-roofed hall. The south and
    // west wings are visible from above, beyond the visitor courtyard.
    function wing(x,z,w,d,h,c,angle=0){
      k.place(x,z,angle,()=>{
        k.box(ivory,0,h/2-.12,0,w,h+.45,d);
        A.gabledRoof(T,k,0,h,0,w,d,Math.min(w,d)*.22,c,gold,{alongX:w>d,thick:.14});
        const along=w>d,n=Math.max(2,Math.floor(Math.max(w,d)/4.1));
        for(let i=0;i<n;i++)for(const s of [-1,1]){
          const t=(i+.5)/n-.5;
          k.box(dark,along?t*w:s*(w*.5+.031),h*.52,along?s*(d*.5+.031):t*d,along?1.18:.075,1.51,along?.075:1.18);
        }
      });
    }
    wing(38.5,-59.8,14.3,30.9,5.8,0xb85d54);wing(55.4,-64.2,24.9,15.4,5.3,0xb85d54);
    wing(15.8,-82,86,9.7,4.2,0xa6afb0);
    wing(-39.5,-9.9,9.7,33,4.7,0xb95f58);wing(-48,-49,12.8,27,4.43,0xad685b);
    // The dated aerial survey shows walls and a column grid north of the
    // sanctuary. Only the shell visible in that survey is represented.
    k.box(stone,58,0,-8.6,25.8,.62,46.1);
    for(const side of [-1,1]){
      for(let j=0;j<10;j++){
        const z=-29.7+j*4.68;k.box(0xb7afa3,58+side*11.66,3.05,z,.53,6.13,.53);
      }
      k.box(0xa6a098,58+side*11.66,6.07,-8.64,.54,.39,42.68);
      k.box(0xb28c7a,58+side*11.64,1.08,-8.64,.43,1.86,42.42);
      k.box(0xa6a098,58,6.07,-8.64+side*21.06,23.81,.39,.48);
    }
    for(let j=0;j<7;j++){
      k.box(0xa29e98,58,5.99,-27.73+j*6.12,23.51,.27,.27);
    }
  }
  function gateApproach(T,k){
    const first=k.vertexCount();
    for(let i=2;i<gatePath.length;i++){
      const [ax,az]=gatePath[i-1],[bx,bz]=gatePath[i],dx=bx-ax,dz=bz-az,length=Math.hypot(dx,dz);
      const n=Math.ceil(length/2.8),angle=Math.atan2(dx,dz);
      for(let j=0;j<n;j++){
        const t=(j+.5)/n;k.box(0xc1ad92,ax+dx*t,-.15,az+dz*t,3.60,.37,length/n+.035,angle);
      }
    }
    const afterPath=k.vertexCount(),c=Math.cos(gateYaw),s=Math.sin(gateYaw);
    k.place(gateX,gateZ,gateYaw,()=>{
      const jade=0x8dac8e,edge=0xabc0a0;
      const screen=new T.Shape();screen.moveTo(-1.25,.38);screen.lineTo(1.25,.38);screen.lineTo(1.25,1.29);screen.lineTo(-1.25,1.29);screen.closePath();
      for(let i=0;i<6;i++){
        const xx=-1.015+i*.407;
        for(let j=0;j<4;j++){
          const a=j*pi/2,p=new T.Path();
          p.absellipse(xx+.104*Math.cos(a),.84+.15*Math.sin(a),.102,.079,0,pi*2,false,a);screen.holes.push(p);
        }
      }
      const grille=new T.ExtrudeGeometry(screen,{depth:.24,bevelEnabled:false,curveSegments:4});
      for(const side of [-1,1])for(let i=0;i<10;i++){
        const x=side*(6.07+1.30+i*2.67),z=3.78;
        k.box(jade,x,.20,z,2.68,.50,.32);k.box(edge,x,1.39,z,2.68,.19,.29);
        k.stamp(grille,jade,x,0,z-.12);
        const xp=x+side*1.29;k.box(jade,xp,.77,z,.30,1.57,.35);
        turned(T,k,i%2?gold:0xc693a4,xp,1.50,z,[[.15,0],[.16,.12],[.13,.22],[.10,.28],[0,.44]],8);
      }
      grille.dispose();
    });
    const afterFence=k.vertexCount(),firstChild=k.group.children.length;
    k.place(gateX,gateZ,gateYaw,()=>barrelGate(T,k));
    const end=k.vertexCount(),photoMeshes=k.group.children.slice(firstChild),front=gatePoint(0,0,4);
    let geom,rest;
    return ground=>{
      geom??=k.group.children.find(o=>o.geometry?.hasAttribute('finishKind'))?.geometry;if(!geom)return;
      const a=geom.attributes.position;rest??=Float32Array.from({length:end-first},(_,i)=>a.getY(i+first));
      const stage=ground(front[0],front[2]),fence=[];
      for(let x=-36;x<=36;x+=2){const [u,,v]=gatePoint(x,0,3.78);fence.push(ground(u,v));}
      for(let i=first;i<end;i++){
        const u=a.getX(i),v=a.getZ(i);
        let rise=stage;
        if(i<afterPath){
          const w=Math.min(1,Math.hypot(u-gateX,v-gateZ)/12);
          rise=stage+(ground(u,v)-stage)*w;
        }else if(i<afterFence){
          const xx=(u-gateX)*c-(v-gateZ)*s,p=Math.min(35.99,Math.max(0,(xx+36)/2)),j=Math.floor(p);
          const w=Math.min(1,Math.max(0,(Math.abs(xx)-6)/5));
          rise=stage+(fence[j]+(fence[j+1]-fence[j])*(p-j)-stage)*w;
        }
        a.setY(i,rest[i-first]+rise);
      }
      for(const mesh of photoMeshes)mesh.position.y=stage;
      views[4].height=(3.65+stage)/.46;views[5].height=(1.58+stage)/.46;
      a.needsUpdate=true;geom.computeBoundingBox();geom.computeBoundingSphere();
    };
  }
  const boundary=[[-118,-109],[-128,-21],[-135,56],[-122,108],[-24,124],[86,137],[159,-91],[-9,-108]];
  function within(x,z){
    let inside=false;
    for(let i=0,j=boundary.length-1;i<boundary.length;j=i++){
      const [xi,zi]=boundary[i],[xj,zj]=boundary[j];
      if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)inside=!inside;
    }
    return inside;
  }
  function grove(T,k){
    const tree=createTreeModels(T),batches=[],rows=[[],[],[],[]],pose=new T.Object3D();
    const rand=n=>{const f=Math.sin(n*47.511+23.60)*8301.05;return f-Math.floor(f);};
    for(let i=0;i<700;i++){
      const x=-132+rand(i+0.01)*287,z=-106+rand(i+204.3)*239;
      if(!within(x-8,z-7)||!within(x+8,z+7)||!within(x+8,z-7)||!within(x-8,z+7))continue;
      if(x>-27&&x<89&&z>-92&&z<34||x>-12&&x<13&&z>26&&z<64||Math.hypot(x+24,z-29)<22||onGatePath(x,z,8.6))continue;
      const h=13+rand(i+17.13)*16,w=13+rand(i+31.18)*11;rows[i%4].push([x,z,h,w,rand(i+84)*6.28]);
    }
    for(let v=0;v<4;v++){
      const near=[],far=[];
      for(const r of rows[v])(Math.hypot(r[0],r[1])<43?near:far).push(r);
      for(const [set,scan] of [[near,true],[far,false]]){
        if(!set.length)continue;
        const mesh=new T.InstancedMesh(scan?tree.geometry('tree',true,v):tree.distantGeometry('tree',v),scan?tree.material:tree.billboardMaterial(),set.length);
        mesh.receiveShadow=true;mesh.castShadow=scan;k.group.add(mesh);batches.push([mesh,set]);
      }
    }
    // Drape the photographed overhead silhouette across the upper branches.
    // The same alpha-cut leaves outline the crowns from the court and the air.
    const grid=globalThis.matchMedia?.('(pointer: coarse)').matches?4:8;
    for(let v=0;v<4;v++){
      const points=[],uv=[],indices=[],slot=[1,2,0,1][v];
      for(let j=0;j<=grid;j++)for(let i=0;i<=grid;i++){
        const u=i/grid,t=j/grid,xx=u-.5,zz=t-.5,r=Math.min(1,Math.hypot(xx*2,zz*2));
        const top=.96-.36*r*r+.035*Math.sin(u*11.2+t*15.2+v);
        points.push(xx*1.09,top,zz*1.09);uv.push((slot+(2+124*u)/128)/4,(1+(2+124*t)/128)/4);
        if(i<grid&&j<grid){const a=j*(grid+1)+i;indices.push(a,a+grid+1,a+1,a+1,a+grid+1,a+grid+2);}
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));
      g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
      const mesh=new T.InstancedMesh(g,tree.billboardMaterial(),rows[v].length);k.group.add(mesh);batches.push([mesh,rows[v]]);
    }
    const trees=rows.flat();
    const egrets=[];
    trees.forEach(([x,z,h,w,a],i)=>{
      if(x< -27&&z>15&&z<86&&i%3===0){
        for(let j=0;j<2+i%4;j++){
          const b=a+j*2.28,r=w*(.11+.043*j);egrets.push([x+r*Math.cos(b),z+r*Math.sin(b),h*(.90+.028*j),b]);
        }
      }
    });
    const bodies=new T.InstancedMesh(new T.SphereGeometry(1,8,5),new T.MeshStandardMaterial({color:0xf4eee1,roughness:1}),egrets.length*3);
    k.group.add(bodies);
    return ground=>{
      for(const row of trees)row[5]=ground(row[0],row[1]);
      for(const [mesh,set] of batches){
        set.forEach(([x,z,h,w,a,y],i)=>{pose.position.set(x,y,z);pose.scale.set(w,h,w);pose.rotation.y=a;pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);});
        mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
      }
      egrets.forEach(([x,z,h,a],i)=>{
        const y=ground(x,z)+h;
        for(const [j,along,up,w,t,d] of [[0,0,0,.15,.16,.32],[1,.18,.15,.079,.19,.076],[2,.25,.31,.072,.072,.16]]){
          pose.position.set(x+along*Math.sin(a),y+up,z+along*Math.cos(a));pose.rotation.set(0,a,0);pose.scale.set(w,t,d);
          pose.updateMatrix();bodies.setMatrixAt(i*3+j,pose.matrix);
        }
      });
      bodies.instanceMatrix.needsUpdate=true;bodies.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,lon,lat,yaw,start,name:'Chùa Hang – Kompông Chrây',city:'Châu Thành',
    locality:'Trà Vinh',province:'Vĩnh Long',formerProvince:'Trà Vinh',region:'Nam Bộ',kind:'Chùa',source,photo:photo(25299321),
    width:25.1,depth:39.6,views,visitOnArrival:true,mappedEntrance:true,gardenRadius:1,solids:[[0,0,12.84,24.90]],
    boundary,reserve:(x,z,r)=>within(x,z)||Math.hypot(x-gateX,z-gateZ)<12+r,
    description:'Chùa Kompông Chrây ở xã Châu Thành ra đời năm 1637, được tỉnh Trà Vinh xếp hạng di tích lịch sử năm 2025. Mô hình dựa trên mặt bằng, ảnh thực địa và ảnh nhìn từ trên cao. Chiều cao các công trình là ước lượng.',
    arrivalNote:'Xe dừng trên đường 2 Tháng 9 (Quốc lộ 54), trước cổng phụ phía tây. Tuyến tham quan đi qua cổng vòm, vào sân chánh điện rồi đến bìa rừng.',
    build(T,k){k.palette({plaster:[ivory,white],glazedTile:[tile,blue,green],stone});hall(T,k);gardenHall(T,k);court(T,k);outbuildings(T,k);
      const entrance=gateApproach(T,k),trees=grove(T,k);k.group.userData.fitGround=ground=>{entrance(ground);trees(ground);};}});
})();
