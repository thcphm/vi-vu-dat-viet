'use strict';
(()=>{
  const A=window.CentralArch,pi=Math.PI;
  const museum='bao-tang-tong-hop-quang-binh',museumNode='osm-node-10756203755',museumYaw=-1.387;
  const gate='cua-dong-thanh-dong-hoi',gateYaw=1.742;
  const frontReport='https://tuoitre.vn/dulichtphcm/xuyen-khong-ve-qua-khu-o-bao-tang-tong-hop-quang-binh-10760593.htm';
  const panorama='https://commons.wikimedia.org/?curid=89258755';
  const gateReport='https://vnexpress.net/dau-tich-thoi-vua-minh-mang-con-lai-o-thanh-dong-hoi-3295094.html';
  function camera(yaw,name,target,eye,fov,photo,photoCatalogId,description){
    const [x,h,z]=target,[ex,eh,ez]=eye,dx=ex-x,dz=ez-z,dy=eh-h,c=Math.cos(yaw),s=Math.sin(yaw);
    return {name,offset:[c*x+s*z,-s*x+c*z],height:h/.46,viewBase:'monument',viewAngle:yaw+Math.atan2(dx,dz),
      viewRadius:Math.hypot(dx,dy,dz),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,photo,photoCatalogId,description};
  }
  const museumViews=[
    camera(museumYaw,'Sân và bậc chính phía Hùng Vương',[0,9,12],[-4,2.4,65],57,frontReport,'dong-hoi-san-bao-tang',
      'Từ sân phía tây nhìn lên bậc cấp, cửa sảnh và vành tường vàng nhô ra phía trên hàng kính.'),
    camera(museumYaw,'Tầng mái ngói nhìn từ trên sân',[0,11,0],[9,28,79],51,frontReport,'dong-hoi-mai-bao-tang',
      'Góc cao cho thấy mái ngói giữa nhà và các chóp mái vuông ở góc. Xa hơn là hào thành và sông Nhật Lệ.'),
    camera(museumYaw,'Mặt bảo tàng phía hào thành',[23,6.8,-18],[72,3,-80],50,panorama,museumNode,
      'Từ đầu cầu Cửa Đông nhìn qua hào về dãy cửa sổ bảo tàng. Bên trái tòa nhà là gác trắng và mái ngói của cửa thành.'),
  ];
  const gateViews=[
    camera(gateYaw,'Nhìn qua cầu đá vào Cửa Đông',[0,5.1,0],[2.0,2.35,43],45,panorama,'dong-hoi-cua-dong',
      'Cầu đá đưa lối vào vòm gạch đỏ. Trên vòm là gác canh màu trắng và hai tầng mái ngói của cửa thành đã tôn tạo.'),
    camera(gateYaw,'Vòm cầu trên hào phía đông',[0,1.9,17],[24,3.1,39],54,gateReport,'dong-hoi-vom-cau-thanh',
      'Từ mép hào phía ngoài, nhìn xiên qua thành cầu đá xám để thấy vòm gạch bắc qua mặt nước.'),
    camera(gateYaw,'Cửa Đông nhìn từ sân trong thành',[1.6,5.4,-1.5],[2.4,1.8,-22.8],49,'https://commons.wikimedia.org/?curid=93540701','dong-hoi-san-trong-cua-dong',
      'Từ trong sân nhìn qua vòm ra cầu đá. Hai bên lối qua cổng là trụ gạch và tường cong che bậc lên gác.'),
    camera(gateYaw,'Bậc gạch lên gác và ô hoa tròn',[3.4,6.1,-1.5],[11.8,2.2,-11.4],56,'https://commons.wikimedia.org/?curid=23559025','dong-hoi-bac-gac-cua-dong',
      'Từ phía bắc sân trong nhìn dọc tường gạch cong lên gác. Những ô hoa tròn nằm hai bên cửa vòm của tầng dưới.'),
  ];
  function mesh(T,k,color,verts){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.computeVertexNormals();
    k.stamp(g,color,0,0,0);g.dispose();
  }
  function ring(T,k,color,x,z,y0,y1,w0,d0,w1,d1){
    const corners=(w,d,y)=>[[-w,-d],[-w,d],[w,d],[w,-d]].map(([a,b])=>[x+a/2,y,z+b/2]);
    const lo=corners(w0,d0,y0),hi=corners(w1,d1,y1),verts=[];
    for(let i=0;i<4;i++){const j=(i+1)%4;verts.push(...lo[i],...lo[j],...hi[i],...lo[j],...hi[j],...hi[i]);}
    verts.push(...hi[0],...hi[1],...hi[2],...hi[2],...hi[3],...hi[0]);mesh(T,k,color,verts);
  }
  function windows(k,x,y,z,w,h,side=false){
    const pane=0x59757b,mullion=0x696052;
    k.box(pane,x,y,z,side?.12:w,h,side?w:.12);
    for(let i=0,n=Math.max(1,Math.round(w/1.4));i<=n;i++){
      const at=(i/n-.5)*w;
      k.box(mullion,side?x:x+at,y,side?z+at:z,side?.16:.09,h+.08,side?.09:.16);
    }
    k.box(mullion,x,y+.05*h,z,side?.18:w,.10,side?w:.18);
  }
  function museumBuilding(T,k){
    const clay=0xb57d60,clayDark=0x996349,buff=0xeec683,ochre=0xc49b5f,tile=0xac6645,cream=0xf0d49b;
    k.box(0xb3a391,0,-.27,19,58,.57,62);
    k.box(0xbfa396,0,-.03,44,38,.14,35);
    k.box(0x9e8877,0,.95,2,48.8,1.92,43);
    k.box(clay,0,5.47,0,42.0,8.7,38.7);
    k.box(clayDark,0,2.10,20.6,47.1,.42,4.2);
    for(let i=0;i<10;i++)k.box(i%2?0xa58a7b:0xae9482,0,(i+1)*.105,27.1-i*.45,15,(i+1)*.21,.50);
    for(const side of [-1,1]){
      for(const z of [-19.47,19.47]){
        windows(k,side*11.2,4.75,z,8.1,4.05);windows(k,side*12.3,8.42,z,12.8,2.20);
      }
      windows(k,side*21.07,5.2,0,30,5.6,true);
      for(const z of [-12,-6,0,6,12])k.box(ochre,side*21.25,5.09,z,.51,6.5,.43);
      for(const z of [-20.2,20.2]){
        const x=side*21.1;
        k.box(clay,x,9.09,z,5.05,18.18,5.1);
        k.box(buff,x,17.83,z,6.17,.70,6.15);k.box(ochre,x,18.34,z,6.48,.36,6.46);
        ring(T,k,tile,x,z,18.52,20.35,6.75,6.72,.52,.52);
      }
    }
    // The square upper band flares out over the glazing. The central hipped roof
    // rises separately behind it, as seen in the elevated west-facing courtyard photograph.
    ring(T,k,buff,0,0,9.68,15.64,42.4,39.8,48.6,45.9);
    k.box(ochre,0,15.82,0,48.88,.38,46.18);k.box(cream,0,16.10,0,49.05,.18,46.35);
    const frieze=[];
    for(const sign of [-1,1]){
      for(let i=-20;i<=20;i++){
        const x=i*1.15,z=sign*23.105;
        const a=[x-.39,15.65,z],b=[x+.39,15.65,z],c=[x,16.00,z];
        frieze.push(...a,...(sign>0?b:c),...(sign>0?c:b));
      }
      for(let i=-19;i<=19;i++){
        const z=i*1.15,x=sign*24.45;
        const a=[x,15.65,z-.39],b=[x,15.65,z+.39],c=[x,16.00,z];
        frieze.push(...a,...(sign>0?c:b),...(sign>0?b:c));
      }
    }
    mesh(T,k,0xa6855d,frieze);
    k.box(clay,0,16.88,0,25.8,1.85,24.0);
    for(const z of [-12.04,12.04])windows(k,0,17.06,z,18.6,1.2);
    k.box(buff,0,17.94,0,26.6,.45,24.85);
    ring(T,k,tile,0,0,18.17,22.18,27.3,25.6,3.5,.19);
    for(const side of [-1,1]){
      // Lower edge of the upper band steps up towards the central entrance.
      for(const [distance,w,y] of [[16.1,6.8,9.25],[9.7,6.0,9.51]]){
        k.box(buff,side*distance,y,20.0,w,.58,1.18);k.box(ochre,side*distance,y-.29,20.02,w,.13,1.23);
      }
      for(const z of [-7,0,7])k.box(0x5a655e,side*22.76,12.10,z,.16,1.38,1.0);
    }
    for(const x of [-6.8,0,6.8])k.box(0x59665d,x,12.25,-21.46,1.08,1.49,.18);
    k.box(clayDark,0,4.9,19.48,13.45,5.9,.60);windows(k,0,4.20,19.83,6.7,3.90);
    A.plaque(T,k,'BẢO TÀNG QUẢNG BÌNH',0,6.85,19.84,11.8,1.2,{bg:'#9f694f',fg:'#f3d483',frame:false});
    for(const side of [-1,1]){
      k.box(ochre,side*15.7,2.37,23.11,13.5,.44,.52);
      k.box(cream,side*15.7,2.64,23.11,13.7,.12,.59);
      k.box(0xb6a792,side*19.5,.13,35.8,7.9,.26,9.3);k.box(0x738c59,side*19.5,.29,35.8,7.54,.09,8.95);
      k.box(0xb6a792,side*23.4,.11,48.1,5.2,.22,10.3);k.box(0x788862,side*23.4,.24,48.1,4.89,.08,10.0);
    }
    A.trees(T,k,[{x:-19.5,z:35.7,h:6.1,width:5.5},{x:19.5,z:35.8,h:6.5,width:5.7},
      {x:-23.4,z:48,h:8.2,width:7.4},{x:23.4,z:48.3,h:7.8,width:7.2},
      {x:-26.5,z:-18.1,h:7,width:6.2},{x:28.2,z:-10,h:6.8,width:5.8}]);
  }
  function gateHouse(T,k){
    const brick=0x985e46,red=0x88523e,white=0xe4dfce,edge=0xb9afa0,tile=0xbf8a51;
    k.palette({brick:[brick,red],stone:edge});
    A.vaultedBay(T,k,0,0,10.0,5.88,2.12,2.60,4.60,brick,0xc8b9a0,0xb5a58c);
    for(const side of [-1,1]){
      k.box(red,side*4.76,2.99,0,.83,5.99,5.05);
      k.box(brick,side*4.76,6.04,0,1.02,.18,5.19);
      for(const [xa,xb] of [[5.1,12.2],[12.2,23.4]]){
        const x=side*(xa+xb)/2,z=side*(-.19*x*side);
        k.box(brick,x,-.95,z,xb-xa+.18,10.66,2.2,.19);
        k.box(red,x,4.40,z,xb-xa+.25,.12,1.28,.19);
      }
    }
    k.box(0xab8269,0,5.99,0,8.58,.30,4.97);
    // Photographs from the inner yard show an arch on each face of the
    // lower lookout and flower-pattern ventilators in the upper storey.
    const rim=new T.TorusGeometry(1,.10,6,24),disc=new T.CircleGeometry(1,24);
    function storey(y,w,d,h,r,flowers){
      for(let side=0;side<4;side++){
        const angle=side*pi/2,c=Math.cos(angle),s=Math.sin(angle);
        const width=side%2?d:w,depth=side%2?w:d;
        const sh=new T.Shape(),spring=h-.4-r;
        sh.moveTo(-width/2,0);
        if(r){sh.lineTo(-r,0);sh.lineTo(-r,spring);sh.absarc(0,spring,r,pi,0,true);sh.lineTo(r,0);}
        sh.lineTo(width/2,0);sh.lineTo(width/2,h);sh.lineTo(-width/2,h);sh.closePath();
        const wall=new T.ExtrudeGeometry(sh,{depth:.24,bevelEnabled:false});
        wall.rotateY(angle);k.stamp(wall,white,s*depth/2,y,c*depth/2);wall.dispose();
        for(const f of flowers){
          const offset=f*width,rad=r?.36:.30;
          const x=c*offset+s*(depth/2+.255),z=-s*offset+c*(depth/2+.255),cy=y+h*.54;
          k.stamp(disc,0x777465,x,cy,z,rad,rad,rad,angle);
          k.stamp(rim,edge,x+s*.022,cy,z+c*.022,rad,rad,rad,angle);
          for(let petal=0;petal<6;petal++){
            const theta=petal*pi/3,dx=Math.sin(theta)*rad*.47,dy=Math.cos(theta)*rad*.47;
            k.stamp(rim,white,x+c*dx+s*.036,cy+dy,z-s*dx+c*.036,rad*.31,rad*.32,rad*.29,angle);
          }
        }
      }
    }
    storey(6.17,5.32,4.12,2.52,.68,[-.31,.31]);
    k.box(edge,0,8.69,0,5.93,.18,4.76);
    A.curvedRoof(T,k,0,8.79,0,6.88,5.48,1.0,tile,0x90785e,0xb19d7e,.24);
    storey(9.67,3.14,2.65,1.84,0,[0]);
    k.box(edge,0,11.52,0,3.73,.16,3.21);
    A.curvedRoof(T,k,0,11.60,0,4.48,3.79,.83,tile,0x90785e,0xb19d7e,.23);
    rim.dispose();disc.dispose();
    for(const sign of [-1,1]){
      k.box(brick,sign*3.12,1.70,-3.18,1.19,3.40,1.43);
      ring(T,k,0x9a8268,sign*3.12,-3.18,3.40,3.84,1.47,1.69,.42,.55);
      for(let i=0;i<25;i++){
        const y=.24+i*.233,x=sign*(12.86-i*.36);
        k.box(i%3?0x9b7057:0xa27960,x,y/2,-2.05,.37,y,1.41);
      }
      const p=new T.Shape();p.moveTo(sign*4.2,-.4);p.lineTo(sign*13.21,-.4);p.lineTo(sign*13.21,.58);
      p.quadraticCurveTo(sign*11.4,4.17,sign*7.2,5.69);p.quadraticCurveTo(sign*5.55,6.30,sign*4.2,6.28);p.closePath();
      k.profile(p,brick,0,0,-3.16,.45);
      const line=new T.CatmullRomCurve3([[13.21,.58],[11.78,2.72],[9.76,4.38],[7.2,5.69],[5.5,6.14],[4.20,6.28]].map(([x,y])=>new T.Vector3(sign*x,y,-2.95)));
      const cap=new T.TubeGeometry(line,22,.10,7);k.stamp(cap,0xa99b84,0,0,0);cap.dispose();
    }
    for(const side of [-1,1])k.box(0xb2a799,side*.90,5.46,2.36,1.10,.45,.09);
    const first=k.group.children.length;
    A.trees(T,k,[{x:26,z:-15,h:7.3,width:6.8},{x:33,z:-12,h:8.3,width:7.1},
      {x:-28,z:-14,h:6.6,width:6.1},{x:-33,z:-10,h:7.1,width:6.7}]);
    const trees=k.group.children.slice(first);
    k.group.userData.fitGround=g=>{for(const tree of trees)tree.position.y=g(tree.position.x,tree.position.z);};
  }
  const bridge='cau-da-cua-dong-dong-hoi',bridgeNode='osm-way-319395915',bridgeYaw=gateYaw-pi/2;
  const bridgeViews=[
    camera(bridgeYaw,'Vòm đá và diềm gạch nhìn từ bờ hào',[0,-.52,0],[17.2,-.44,-21.5],51,gateReport,'dong-hoi-vom-cau-thanh',
      'Thân cầu đá xám có một vòm cuốn. Nhìn qua vòm thấy mặt nước hào, phía đầu cầu bên kia là cửa thành đã tôn tạo.'),
    camera(bridgeYaw,'Từ thành cầu nhìn về gác Cửa Đông',[-19.5,4.9,0],[17.4,1.74,1.1],49,panorama,'dong-hoi-cua-dong',
      'Từ đầu cầu ngoài, nhìn dọc lan can qua mặt cầu về cổng gạch. Bảo tàng ở bên phải khi đi vào thành.'),
  ];
  function stoneBridge(T,k){
    const stone=0x9c9a92,mould=0xc4bfb2,joint=0x898780,trim=0xa9684e;
    const half=19.48,hw=3.50,arch=9.6;
    k.palette({stone:[stone,mould,joint],brick:trim});
    const underside=x=>-4.72+3.72*Math.sqrt(Math.max(0,1-(x/arch)**2));
    const sections=[-half,...Array.from({length:47},(_,i)=>(i-23)*.82),-arch,arch,half].sort((a,b)=>a-b);
    const verts=[];
    for(let i=1;i<sections.length;i++){
      const x0=sections[i-1],x1=sections[i],mid=(x0+x1)/2,w=x1-x0;
      const lower=x=>Math.abs(mid)<arch?underside(x):-5.65;
      const y0=lower(x0),y1=lower(x1);
      for(const side of [-1,1]){
        const z=side*hw,a=[x0,y0,z],b=[x1,y1,z],c=[x1,-.08,z],d=[x0,-.08,z];
        if(side>0)verts.push(...a,...b,...c,...a,...c,...d);
        else verts.push(...a,...c,...b,...a,...d,...c);
        k.box(stone,mid,-.04,z-side*.03,w+.012,.52,.39);
        k.box(mould,mid,.89,z-side*.03,w+.012,.19,.44);
      }
      verts.push(x0,y0,-hw,x1,y1,-hw,x1,y1,hw,x0,y0,-hw,x1,y1,hw,x0,y0,hw);
      // Closely spaced sections let the masonry and coping follow the routed
      // crown as closely as the individually placed balusters do.
      k.box(0xa7a394,mid,.116,0,w+.015,.12,hw*2-.30);
    }
    mesh(T,k,stone,verts);
    for(let i=-23;i<=23;i++){
      k.box(joint,i*.82,.18,0,.031,.010,hw*2-.30);
      for(let j=-2;j<=2;j++)k.box(joint,i*.82+.39,.18,j*1.24+(i%2?.31:-.31),.80,.010,.031);
    }
    for(const side of [-1,1]){
      const z=side*(hw+.03);
      for(let i=0;i<38;i++){
        const a=i*pi/38,b=(i+1)*pi/38-.006;
        const pt=(ang,r,hh)=>[r*Math.cos(ang),-4.72+hh*Math.sin(ang)];
        const tile=new T.Shape([pt(a,arch,3.72),pt(a,arch+.30,4.02),pt(b,arch+.30,4.02),pt(b,arch,3.72)].map(v=>new T.Vector2(...v)));
        k.profile(tile,i%4?trim:0xb37a59,0,0,z-.033,.066);
      }
      for(let i=0;i<=44;i++){
        const x=-half+i*half*2/44;
        k.box(mould,x,.49,z-side*.05,.37,.68,.31);
        k.box(stone,x,.19,z-side*.05,.53,.18,.34);
        k.box(stone,x,.77,z-side*.05,.53,.12,.34);
      }
      for(const x of [-half,half]){
        k.box(stone,x,.56,z,.59,1.48,.58);k.box(mould,x,1.29,z,.74,.14,.72);
        ring(T,k,mould,x,z,1.36,1.63,.76,.74,.11,.10);
      }
    }
    let original,previous;
    k.group.userData.fitGround=g=>{
      const heights=Array.from({length:13},(_,i)=>g(-half+2*half*i/12,0));
      if(previous&&heights.every((y,i)=>Math.abs(y-previous[i])<.01))return;
      previous=heights;const geometry=k.group.children.at(-1).geometry,p=geometry.attributes.position;
      original??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      for(let i=0;i<p.count;i++){
        const t=Math.max(0,Math.min(12,(p.getX(i)+half)*6/half)),j=Math.min(11,Math.floor(t));
        p.setY(i,original[i]+heights[j]+(heights[j+1]-heights[j])*(t-j));
      }
      p.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();
    };
  }
  const entries=window.VietnamSights??=[];
  entries.push({id:museum,catalogId:museumNode,name:'Bảo tàng Quảng Trị – cơ sở Đồng Hới (Bảo tàng Quảng Bình)',city:'Đồng Hới',province:'Quảng Trị',
    formerProvince:'Quảng Bình',region:'Trung Bộ',kind:'Bảo tàng',lon:106.623951,lat:17.468279,yaw:museumYaw,width:51.8,depth:50.7,
    start:[106.6232646,17.4681344],mappedEntrance:true,visitOnArrival:true,viewDistance:780,
    reserve:(x,z,p)=>Math.abs(x)<27.4+p&&z>-26-p&&z<59+p,solids:[[0,-.8,22.7,20.2]],views:museumViews,
    photo:panorama,source:'https://dulich.quangtri.gov.vn/vi/baotangtinhquangtri',map:'https://www.openstreetmap.org/way/334166893',
    description:'Bảo tàng Quảng Trị, cơ sở 1 ở Đồng Hới, nằm trong khu di tích thành cổ. Khối nhà vàng đất và nâu đỏ có mái ngói giữa nhà, bốn chóp góc và bậc chính hướng ra sân phía tây. Mặt bằng theo đường bao công trình, chiều cao ước theo ảnh.',
    arrivalNote:'Xe dừng bên đường lớn ở mép tây khuôn viên. Từ đây qua sân tới bậc chính của bảo tàng.',build:museumBuilding});
  const gateStart=[106.62487,17.46779],city={city:'Đồng Hới',province:'Quảng Trị',formerProvince:'Quảng Bình',region:'Trung Bộ',
    start:gateStart,mappedEntrance:true,visitOnArrival:true,gardenRadius:1,source:gateReport,photo:panorama,viewDistance:770};
  entries.push({...city,id:gate,catalogId:'dong-hoi-cua-dong',name:'Cửa Đông thành Đồng Hới',kind:'Di tích',
    lon:106.624457,lat:17.467728,yaw:gateYaw,width:47.2,depth:5.2,foundationOnBridge:true,
    map:'https://www.openstreetmap.org/way/940795265',views:gateViews,
    solids:[...A.archPiers(0,0,10,2.12,4.6),[-14,2.7,8.6,.65],[14,-2.7,8.6,.65]],
    description:'Cửa Đông mở từ thành Đồng Hới ra phía sông Nhật Lệ. Vòm gạch, gác canh màu trắng và hai tầng mái thể hiện diện mạo sau đợt tôn tạo. Từ đầu cầu có thể thấy bảo tàng bên trong khu thành.',
    arrivalNote:'Xe dừng ở đường Lâm Úy phía ngoài hào. Từ đó đi bộ qua cầu đá tới Cửa Đông.',build:gateHouse});
  entries.push({...city,id:bridge,catalogId:bridgeNode,name:'Cầu đá qua hào Cửa Đông thành Đồng Hới',kind:'Cầu',
    lon:106.6246531,lat:17.4677601,yaw:bridgeYaw,width:39,depth:7.4,views:bridgeViews,map:'https://www.openstreetmap.org/way/319395915',
    solids:[[0,-3.50,19.6,.20],[0,3.50,19.6,.20]],
    description:'Cây cầu trên lối vào Cửa Đông có lan can đá xám và một vòm cuốn viền gạch đỏ. Hai đầu cầu theo tim đường trên bản đồ. Khẩu độ vòm và hình lan can được ước theo ảnh chụp từ hào.',
    arrivalNote:'Xe dừng ở đầu đường Lâm Úy, phía ngoài thành. Đi bộ tới đầu cầu để nhìn dọc lan can hoặc ngắm vòm từ mép hào.',build:stoneBridge});
})();
