const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='hien-luong',lon=107.05172136,lat=17.00438490,yaw=.6369754;
  const source='https://dsvh.gov.vn/di-tich-lich-su-doi-bo-hien-luong-ben-hai-2974';
  const photo='https://artsandculture.google.com/story/nAXR1KkQXWeQLQ?hl=vi';
  // Local +z runs from the northern to the southern abutment. w87429694 is
  // the wooden pedestrian bridge; w87429756 is the separate road crossing.
  // Register the seven spans, north gateway and round flag terrace to their
  // visible endpoints/footprints rather than the offset OSM monument pins.
  // https://www.google.com/maps/@17.004385,107.051721,485m/data=!3m1!1e3
  // https://csdl.vietnamtourism.gov.vn/dest/?item=272
  // https://nhandan.vn/anh-di-doc-doi-bo-hien-luong-ben-hai-70-nam-sau-hiep-dinh-geneva-post822694.html
  // https://baotintuc.vn/van-hoa/hoan-thanh-tu-bo-ton-tao-di-tich-doi-bo-hien-luong-ben-hai-truoc-tet-binh-ngo-20260123122410181.htm
  const length=183.65,half=length/2,flag=[-36.86,-209.66],fig=[1.37,288.36];
  const platform=[[2.93,274.24],[26.56,298.47],[12.03,320.04],[-2.37,328.93],[-37.46,315.4]];
  const pond=[[-86.42,269.23],[42.89,201.51],[52.58,199.45],[61.23,210.82],
    [59.97,228.36],[49.06,253.67],[35.44,275.92],[23.23,287.13],[2.65,265.51],
    [-33.15,301.89],[-43.09,300.93],[-63.55,291.12],[-78.24,280.26]];
  const northBlue=0x76bacc,southYellow=0xe3b747,stone=0xa4a498,granite=0x828981,red=0xa6443c;
  function build(T,k){
    const spans=[-half,-70.1,-42.1,-14.05,14.05,42.1,70.1,half];
    const wood=[0x948071,0x968576,0x907f72,0x98887d,0x8b7c71,0x9a8a7b],cream=0xeee6ca;
    const sections=[],extras=[],sphere=new T.SphereGeometry(1,12,8),unit=new T.CylinderGeometry(1,1,1,6);
    const rotation=new T.Euler(0,0,0,'YXZ'),v=new T.Vector3(),q=new T.Quaternion(),axis=new T.Vector3(0,1,0);
    k.palette({stone:[stone,granite,0x9d9d93],timber:wood});
    function section(name,draw){
      const first=k.vertexCount(),start=k.group.children.length;draw();
      sections.push({first,last:k.vertexCount(),name});
      for(const mesh of k.group.children.slice(start))extras.push({mesh,name,y:mesh.position.y});
    }
    function beam(tint,a,b,width,depth=width,rounded=false){
      v.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const h=v.length();if(!h)return;
      q.setFromUnitVectors(axis,v.multiplyScalar(1/h));rotation.setFromQuaternion(q,'YXZ');
      const p=[tint,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,width,h,depth,rotation.y,rotation.x,rotation.z];
      if(rounded)k.stamp(unit,...p);else k.box(...p);
    }
    function disc(tint,x,y,z,r,h,sides=48){
      const g=new T.CylinderGeometry(r,r,h,sides);k.stamp(g,tint,x,y,z);g.dispose();
    }
    function polygon(tint,points,y,h){
      const shape=new T.Shape();points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
      const g=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);k.stamp(g,tint,0,y,0);g.dispose();
    }
    section('bridge',()=>{
      // The white stripe crosses 3.20 metres of timber between the two
      // foot curbs. The restored deck has 450 transverse planks to the
      // north of the stripe and 444 to its south.
      k.box(0x4a4541,0,-.19,0,3.57,.31,length);
      for(const [dir,count,paint] of [[-1,450,northBlue],[1,444,southYellow]]){
        const pitch=half/count;
        for(let i=0;i<count;i++){
          k.box(wood[Math.floor(k.random()*wood.length)],0,-.024,dir*(i+.5)*pitch,3.45,.05,pitch-.005);
        }
        for(const side of [-1,1]){
          k.box(0x796a56,side*1.69,.095,dir*half/2,.18,.20,half-.012);
          k.box(paint,side*2.15,-.22,dir*half/2,1.16,.11,half-.012);
        }
      }
      k.box(0xf4efdf,0,.006,0,3.2,.009,.010);
      for(let j=1;j<spans.length;j++){
        const a=spans[j-1],b=spans[j],num=j===1||j===7?7:9;
        for(let i=0;i<num;i++){
          const beg=a+(b-a)*i/num,end=a+(b-a)*(i+1)/num,mid=(beg+end)/2;
          for(const [z0,z1] of (beg<0&&end>0?[[beg,0],[0,end]]:[[beg,end]])){
            const color=z0+z1<0?northBlue:southYellow,l=z1-z0,m=(z0+z1)/2;
            for(const side of [-1,1]){
              const inner=side*1.96,outer=side*2.62;
              for(const x of [inner,outer]){
                k.box(color,x,.97,m,.105,.12,l-.012);
                k.box(color,x,-.39,m,.115,.17,l-.012);
                k.box(color,x,.285,z0+.058,.096,1.38,.10);
                beam(color,[x,-.30,z0+.08],[x,.92,m],.098,.10);
                beam(color,[x,.92,m],[x,-.30,z1-.08],.098,.10);
                beam(color,[x,.91,z0+.08],[x,-.28,m],.08,.09);
                beam(color,[x,-.28,m],[x,.91,z1-.08],.08,.09);
              }
              k.box(color,side*2.29,.98,z0+.055,.74,.085,.10);
              beam(color,[inner,.985,z0],[outer,.985,m],.068,.060);
              beam(color,[outer,.985,m],[inner,.985,z1],.068,.060);
            }
          }
          k.box(mid<0?northBlue:southYellow,0,-.46,beg+.09,5.32,.15,.19);
        }
      }
      for(const z of spans.slice(1,-1)){
        // Open rectangular pile frames are visible through the gaps between
        // the beams; a continuous concrete wall would mask the river.
        k.box(0x99988c,0,-.69,z,6.0,.54,1.5);
        for(const x of [-2.32,-.78,.78,2.32])k.box(0x8a8779,x,-5.27,z,.57,8.8,.82);
        k.box(0x7e8278,0,-4.53,z,5.15,.28,1.08);
      }
      for(const z of [-half,half])k.box(stone,0,-3.03,z,6.75,5.9,2.25);
    });
    section('landing',()=>{
      k.box(0xa49a8c,0,-.16,-99.2,5.1,.24,14.9);
      k.box(0xb1a698,0,-.17,105.5,5.30,.26,27.9);
    });
    section('gate',()=>{
      // A single clear arch, with its coffered piers and stepped red coping.
      // The river-facing inscription differs from the road-facing one.
      const z=-103.85;
      k.arch(cream,.29,.0,z-.31,8.45,5.74);k.arch(cream,.29,.0,z+.35,8.45,5.74);
      for(const side of [-1,1]){
        const x=.29+side*3.49;
        k.box(cream,x,2.40,z,1.03,4.80,.97);
        k.box(0x66625a,x,.18,z,1.36,.36,1.25);
        for(const dx of [-.36,.36])k.stamp(k.round,cream,x+dx,2.57,z+.03,.18,4.75,.61);
        k.box(red,x,4.94,z,1.30,.14,1.06);
        k.box(cream,x+side*.82,1.77,z,.75,3.54,.81);
        k.box(red,x+side*.82,3.59,z,.87,.15,.97);
      }
      for(const [y,w,h,col] of [[5.70,8.68,.16,red],[6.09,8.39,.67,cream],[6.48,8.67,.15,red],[6.67,3.31,.22,cream]])
        k.box(col,.29,y,z,w,h,1.05);
      k.stamp(k.round,0xdab651,.29,7.18,z,.49,.16,.49,0,Math.PI/2);
      k.stamp(k.round,0xac3630,.29,7.21,z+.02,.40,.166,.40,0,Math.PI/2);
      const star=[];
      for(let i=0;i<10;i++){
        const a=Math.PI*.5+i*Math.PI/5,r=i%2?.098:.227;star.push([r*Math.cos(a),r*Math.sin(a)]);
      }
      k.outline(star,0xe6bd54,.29,7.23,z+.103,.035);
      k.sign('VIỆT NAM HÒA BÌNH THỐNG NHẤT',.29,6.23,z+.54,5.81,.22,true,'#803e32');
      k.sign('ĐỘC LẬP DÂN CHỦ VÀ GIÀU MẠNH',.29,5.96,z+.54,5.81,.22,true,'#803e32');
      k.place(.29,z,Math.PI,()=>k.sign('HỒ CHÍ MINH MUÔN NĂM',0,6.09,.54,5.33,.39,true,'#803e32'));
    });
    section('flag',()=>{
      k.place(...flag,1.14,()=>{
        disc(0x9e9c90,0,-.12,0,29.9,.32,64);
        disc(0x73815b,0,.06,0,28.45,.14,64);
        disc(0x9a9990,0,.15,0,15.01,.15);
        disc(0xb06552,0,1.96,0,12.05,3.56);
        disc(0xddd0af,0,3.64,0,12.22,.22);
        disc(0xad534c,0,3.83,0,12.23,.15);
        disc(0xa7a59e,0,3.95,0,12.02,.12);
        // An original painted band evokes the palette, procession of people
        // and ceramic joints around the drum; individual panels are simplified.
        const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=128;
        const brush=canvas.getContext('2d');
        brush.fillStyle='#c4ae82';brush.fillRect(0,0,1536,128);
        const poly=(color,points)=>{
          brush.beginPath();points.forEach(([x,y],i)=>i?brush.lineTo(x,y):brush.moveTo(x,y));brush.closePath();
          brush.fillStyle=color;brush.fill();brush.strokeStyle='#695e47';brush.lineWidth=1;brush.stroke();
        };
        for(let i=0;i<24;i++){
          const x=i*64;poly(['#b79352','#b7c2ac','#cfb578','#9caea0'][i%4],[[x,0],[x+66,0],[x+66,96],[x+10,111],[x,76]]);
          for(let j=0;j<3;j++){
            brush.beginPath();brush.moveTo(x-5,31+j*6);brush.bezierCurveTo(x+4,4+j*7,x+35,46+j*6,x+61,16+j*9);
            brush.strokeStyle=j%2?'#eee0b4':'#859b98';brush.lineWidth=2.6;brush.stroke();
          }
          poly(i%3?'#87926c':'#c78647',[[x,98],[x+31,73],[x+68,86],[x+67,128],[x,128]]);
        }
        const coats=['#455b62','#818550','#c6b482','#5f745c','#ac6f46','#556670'];
        for(let i=0;i<85;i++){
          const x=i*18+7*k.random(),y=52+26*k.random(),coat=coats[i%coats.length];
          poly(coat,[[x-7,y+7],[x+3,y+4],[x+10,y+17],[x+6,y+32],[x+9,y+57],[x-8,y+53],[x-4,y+33],[x-12,y+23]]);
          brush.fillStyle='#4f4c40';brush.beginPath();brush.ellipse(x-1,y+2,5,7,-.15,0,Math.PI*2);brush.fill();
          brush.fillStyle='#caab82';brush.beginPath();brush.ellipse(x+.3,y+3,3.7,5.3,-.15,0,Math.PI*2);brush.fill();
          brush.beginPath();brush.moveTo(x-6,y+12);brush.lineTo(x-15,y+5);brush.lineTo(x-20,y-5);
          brush.strokeStyle=coat;brush.lineWidth=3.5;brush.stroke();
        }
        brush.strokeStyle='rgba(255,239,200,.24)';brush.lineWidth=.7;
        for(let x=0;x<1536;x+=7){brush.beginPath();brush.moveTo(x,0);brush.lineTo(x-2,128);brush.stroke();}
        for(let y=0;y<128;y+=7){brush.beginPath();brush.moveTo(0,y);brush.lineTo(1536,y);brush.stroke();}
        const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
        const band=new T.Mesh(new T.CylinderGeometry(12.065,12.065,2.80,80,1,true),new T.MeshStandardMaterial({map,roughness:.92}));
        band.position.y=1.99;k.group.add(band);
        for(let j=0;j<23;j++)k.box(0xc1bdb1,0,.13+(j+1)*.159/2,19.3-j*.37,6.34,(j+1)*.159,.41);
        for(const x of [-3.42,3.42])beam(granite,[x,.4,19.7],[x,4.08,11.1],.34,.48);
        k.box(granite,0,3.05,-19.4,2.8,2.0,16.4);
        k.tapered(0x9d9d93,0,5.27,0,6.73,4.92,2.54,1,4);
        k.box(0xc4c2bc,0,6.62,0,7.46,.22,7.46);
        for(let j=0;j<4;j++)k.place(0,0,j*Math.PI/2,()=>{
          for(const x of [-2.63,-1.32,0,1.32,2.63]){
            k.box(0xd1c8ac,x,5.1,4.03,.58,.50,.11,0,-.24);
            k.box(0x685f50,x,5.10,4.096,.37,.30,.06,0,-.24);
          }
        });
        disc(0xe2dfcb,0,6.97,0,2.30,.52);
        k.tapered(0xe2dfcb,0,7.51,0,1.94,1.40,.71,1,32);
        const y=7.90;
        for(let j=0;j<6;j++){
          k.tapered(0x464d48,0,y+(j+.5)*28/6,0,.29-j*.031,.26-j*.031,28/6,1,14);
          disc(0x565d54,0,y+j*28/6+.10,0,.34-j*.031,.16,14);
        }
        disc(0x404543,0,y+20.4,0,.87,.12,12);
        for(let j=0;j<8;j++){
          const a=j*Math.PI/4,b=(j+1)*Math.PI/4;
          beam(0x414943,[.78*Math.sin(a),y+20.44,.78*Math.cos(a)],[.78*Math.sin(a),y+21.36,.78*Math.cos(a)],.039,.039);
          beam(0x414943,[.78*Math.sin(a),y+21.36,.78*Math.cos(a)],[.78*Math.sin(b),y+21.36,.78*Math.cos(b)],.047,.047);
        }
        for(const a of [.56,2.62,4.77]){
          for(const h of [14.1,19.9])beam(0x747971,[0,y+h,0],[19.7*Math.sin(a),.29,19.7*Math.cos(a)],.025,.025);
        }
        k.wavingFlag(10.95,7.3,.20,y+27.63,0);
      });
    });
    section('pool',()=>{
      const shape=new T.Shape();pond.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
      const g=new T.ShapeGeometry(shape);g.rotateX(-Math.PI/2);
      const profile=new Float32Array(g.attributes.position.count*3);
      for(let j=2;j<profile.length;j+=3)profile[j]=8;
      g.setAttribute('riverProfile',new T.Float32BufferAttribute(profile,3));
      const water=createDrivingWater(T,false),pondMesh=new T.Mesh(g,water.material);
      pondMesh.name='Hồ trước tượng đài';pondMesh.onBeforeRender=()=>water.update(performance.now()*.001,0);
      k.group.add(pondMesh);
    });
    section('memorial',()=>{
      polygon(granite,platform,-1.70,3.10);
      polygon(0x898e6c,platform,1.39,.15);
      for(let j=0;j<platform.length;j++){
        const [ax,az]=platform[j],[bx,bz]=platform[(j+1)%platform.length];
        beam(stone,[ax,1.53,az],[bx,1.53,bz],.31,.38);
      }
      // Six pierced coconut fronds stand in a fan. The central pair rises
      // above the mother and child; the outer pairs recede and step down.
      function frond(x,z,h,w){
        const y=1.54;
        k.outline([[-w*.21,0],[w*.21,0],[w*.19,h*.38],[w*.09,h*.77],[0,h],
          [-w*.09,h*.77],[-w*.19,h*.38]],stone,x,y,z-.35,.70);
        const n=13;
        for(const side of [-1,1])for(let i=0;i<n;i++){
          const t=i/n,width=w*(.48-.33*t*t),low=h*(.14+.727*t),high=low+.047*h;
          const pts=[[0,low],[side*width,low+h*(.071+.013*t)],
            [side*width*.96,high+h*(.071+.013*t)],[0,high]];
          k.outline(pts,side>0?0xc2c3b9:0xacb1a6,x,y,z-.34,.67);
        }
        k.outline([[-w*.17,.88*h],[0,h],[w*.17,.88*h],[0,.83*h]],stone,x,y,z-.34,.67);
      }
      frond(-8.17,288.76,19.4,4.28);frond(5.28,292.67,19.4,4.28);
      frond(-11.95,294.84,13.6,2.98);frond(9.36,296.76,13.6,2.98);
      frond(-14.42,301.54,8.8,2.03);frond(13.21,300.67,8.8,2.03);
      const dark=0x979e96,cloth=0xb6b9ae,light=0xc5c5bb;
      function oval(c,x,y,z,rx,ry,rz,rot=0){k.stamp(sphere,c,x,y,z,rx,ry,rz,0,0,rot);}
      function carved(x,z,h,child){
        k.place(x,z,Math.PI,()=>{
          const yy=t=>1.76+t*h;
          const torso=new T.LatheGeometry([[.104,.411],[.134,.418],[.123,.502],[.111,.573],
            [.146,.69],[.157,.762],[.122,.786],[.069,.804]].map(([r,y])=>new T.Vector2(r*h,y*h)),10);
          k.stamp(torso,cloth,0,yy(0),0,1,1,.74);torso.dispose();
          for(const side of [-1,1]){
            const leg=new T.LatheGeometry([[.051,0],[.059,.018],[.067,.24],[.060,.29],[.068,.45]]
              .map(([r,y])=>new T.Vector2(r*h,y*h)),9);
            k.stamp(leg,cloth,side*.067*h,yy(.005),0,1,1,1.02);leg.dispose();
            oval(dark,side*.067*h,yy(.018),.028*h,.056*h,.026*h,.069*h);
          }
          oval(dark,0,yy(.896),-.022*h,.078*h,.104*h,.068*h);
          oval(light,0,yy(.887),.019*h,.058*h,.077*h,.057*h);
          k.box(dark,0,yy(.587),.088*h,.008*h,.24*h,.006*h);
          for(const side of [-1,1]){
            const elbow=[side*.141*h,yy(.609),.072*h];
            beam(cloth,[side*.125*h,yy(.745),.012*h],elbow,.055*h,.053*h,true);
            const wrist=[side*(child?.004:.027)*h,yy(child?.556:side<0?.704:.615),.123*h];
            beam(light,elbow,wrist,.043*h,.036*h,true);oval(light,...wrist,.032*h,.033*h,.028*h);
          }
          if(!child){
            for(const side of [-1,1])oval(dark,side*.065*h,yy(.847),-.012*h,.018*h,.104*h,.049*h,side*.06);
          }
        });
      }
      k.box(stone,fig[0],1.65,fig[1],4.3,.22,2.40);
      carved(fig[0]-.34,fig[1]+.13,7.7,false);carved(fig[0]+1.06,fig[1]-.28,5.5,true);
      for(const side of [-1,1])for(let j=0;j<3;j++){
        k.outline([[0,0],[side*.76,-.13],[side*2.15,-.15],[side*3.26,.22],
          [side*1.92,.14],[side*.94,.48],[0,.36]],dark,fig[0],3.85+j*.72,fig[1]+.78,.26);
      }
    });
    sphere.dispose();unit.dispose();
    // The coarse game DEM falls into the channel. Keep the superstructure
    // level at the north approach and seat the distinct precincts on their
    // own banks. Only the south landing slopes down to its footpath.
    let geo,rest,previous;
    k.group.userData.fitGround=ground=>{
      geo??=k.group.children.at(-1).geometry;const p=geo.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      const deck=ground(0,-103.85)+.13,south=ground(0,119.4),pole=ground(...flag)+.08,statue=ground(...fig)+.10;
      let pool=-Infinity;for(const [x,z] of pond)pool=Math.max(pool,ground(x,z));
      pool=Math.max(pool,ground(-27,251),ground(11,246))+.11;
      const key=[deck,south,pole,statue,pool];if(previous&&key.every((h,i)=>Math.abs(h-previous[i])<.01))return;previous=key;
      function lift(name,z){
        if(name==='flag')return pole;if(name==='memorial')return Math.max(statue,pool-.10);if(name==='pool')return pool;
        if(name==='landing'&&z>half)return deck+(south-deck)*Math.min(1,(z-half)/27.8);
        return deck;
      }
      for(const {name,first,last} of sections)for(let i=first;i<last;i++)p.setY(i,rest[i]+lift(name,p.getZ(i)));
      for(const part of extras)part.mesh.position.y=part.y+lift(part.name,part.mesh.position.z);
      p.needsUpdate=true;geo.computeBoundingSphere();geo.computeBoundingBox();
    };
  }
  function view(name,x,z,ex,ez,height,up,fov,description,monument=true,photoCatalogId){
    const c=Math.cos(yaw),s=Math.sin(yaw),r=Math.hypot(ex-x,ez-z);
    return {name,offset:[c*x+s*z,-s*x+c*z],height:height/.46,viewRadius:Math.hypot(r,up),
      viewAngle:yaw+Math.atan2(ex-x,ez-z),viewElevation:Math.atan2(up,r),viewFov:fov,
      ...(monument?{viewBase:'monument'}:{}),photoCatalogId,description};
  }
  (window.VietnamSights??=[]).push({id,catalogId:'osm-node-11663933869',name:'Đôi bờ Hiền Lương – Bến Hải',
    city:'Vĩnh Linh',province:'Quảng Trị',region:'Trung Bộ',kind:'Di tích',lon,lat,yaw,
    width:125,depth:590,gardenRadius:24,solids:[],foundationAt:[0,-103.85],source,photo,
    map:'https://www.openstreetmap.org/way/87429694',start:[107.0502153,17.0062013],mappedEntrance:true,visitOnArrival:true,
    reserve:(x,z,p=0)=>Math.abs(x)<4.8+p&&Math.abs(z)<111+p||
      Math.hypot(x-flag[0],z-flag[1])<32+p||Math.hypot(x-fig[0],z-fig[1])<40+p,
    arrivalNote:'Xe dừng trên đường nhánh phía bắc sân Kỳ đài, nơi xe khách tiếp cận khu di tích. Từ đây đi bộ ra hai đầu cầu. Xe qua sông theo cầu bê tông của Quốc lộ 1 ở phía tây.',
    description:'Cầu Hiền Lương phục dựng dài 183,65 m, thành thép xanh ở nửa bắc và vàng ở nửa nam. Sau đợt tu bổ 2025–2026, mặt cầu gỗ lim gồm 450 tấm phía bắc và 444 tấm phía nam. Vị trí các nhịp theo ảnh trên cao. Phù điêu, gương mặt và họa tiết trên bệ cờ được thể hiện giản lược.',
    views:[view('Hai màu cầu trên sông Bến Hải',0,37,-68.9,94,1.05,8.2,52,'Từ lề phía đông cầu Quốc lộ 1 nhìn dọc bảy nhịp cầu gỗ. Nửa vàng ở gần bờ nam, nửa xanh nối với cổng vòm bờ bắc.'),
      view('Vạch trắng giữa hai nửa mặt cầu',0,-3.0,.64,8.9,.87,1.02,57,'Từ nửa cầu phía nam nhìn qua vạch sơn trắng sang giàn thép xanh. Ván gỗ lim chạy ngang lối đi. Cổng chào nằm thẳng phía đầu cầu bờ bắc.',true,'quang-tri-vach-son-cau-hien-luong'),
      view('Kỳ đài trên bờ Bắc',flag[0],flag[1],-4,-182,15.7,-11.0,58,'Từ sân nhìn lên bệ tròn có tranh gốm, đế đá và sáu đoạn ống thép của cột cờ. Những dây néo tỏa từ thân cột xuống quanh đài.',false,'osm-node-1016631030'),
      view('Khát vọng thống nhất bên hồ bờ Nam',0,292,-1.4,221.9,9.0,-6.0,34,'Qua mặt hồ, tượng người mẹ cao 7,7 m và người con cao 5,5 m cùng hướng về bờ bắc. Sáu lá dừa bằng đá xếp thành ba cặp phía sau.',false,'osm-node-4411036589')],build});
})();

export default window.VietnamSights;
