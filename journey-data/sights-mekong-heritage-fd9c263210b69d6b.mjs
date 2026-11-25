const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const A=window.CentralArch,stops=window.VietnamSights??=[];
  const atlas=window.VietnamTourism.byId||new Map(window.VietnamTourism.entries.map(site=>[site.id,site]));
  const clay=0xa86142,ochre=0xe2ba64,stone=0xa49c88,ivory=0xe5dcc4,red=0x95483b;
  const wood=0x654536,green=0x518574,gold=0xd4a14b,dark=0x453b33;
  const guide='https://media.angiang.gov.vn/SoVHTTDL-Portal/File-Dinh-Kem/thong_tin_du_lich_an_giang.pdf';
  // Architectural measurements and public elevations: An Giang Department of
  // Culture and Tourism, pp. 49–64; Cần Thơ Tourism pages cited per building.
  // Parts use metres east and south from the catalogue pin. A footprint can
  // cover a whole monastery: its individual halls keep separate terrain beds.
  function add(catalogId,id,name,source,description,parts,views,start){
    const original=atlas.get(catalogId),[cx,cz,yaw,width,depth]=parts[0];
    const mx=111320*Math.cos(original.lat*Math.PI/180),s=Math.sin(yaw),c=Math.cos(yaw);
    const rows=parts.map(([east,south,angle,w,d,draw,ref])=>{
      const e=east-cx,n=south-cz;
      return {x:e*c-n*s,z:e*s+n*c,angle:angle-yaw,w,d,draw,ref};
    });
    const solids=rows.map(({x,z,angle,w,d})=>{
      const ca=Math.abs(Math.cos(angle)),sa=Math.abs(Math.sin(angle));
      return [x,z,(ca*w+sa*d)*.44,(sa*w+ca*d)*.44];
    });
    const cameras=views.map(([name,e,n,height,viewRadius,viewAngle,viewElevation,platform])=>
      ({name,offset:[e-cx,n-cz],height,viewRadius,viewAngle,viewElevation,...(platform!=null?{viewBase:'monument'}:{})}));
    stops.push({...original,id,catalogId,name,yaw,width,depth,source,photo:source,description,
      lon:original.lon+cx/mx,lat:original.lat-cz/110900,start:start||original.start,approachMeters:undefined,
      visitOnArrival:true,modeledBuildings:rows.map(p=>p.ref).filter(Boolean),solids,
      views:cameras,
      build(T,k){
        k.palette({tile:clay,stone,plaster:ivory,timber:wood,glazedTile:green,brick:red});
        const bed=createTempleFoundations(T,k);
        const platforms=rows.map(p=>bed.building(p.x,p.z,p.angle,p.w,p.d,()=>p.draw(T,k,p.w,p.d)));
        if(views.some(v=>v[7]!=null)){
          const fit=k.group.userData.fitGround;
          k.group.userData.fitGround=ground=>{
            fit(ground);
            views.forEach((v,i)=>{if(v[7]!=null)cameras[i].height=v[3]+platforms[v[7]].height/.46;});
          };
        }
      }});
  }
  function ellipsoid(T,k,tint,x,y,z,sx,sy,sz,rz=0){
    const g=new T.SphereGeometry(1,16,10);
    k.stamp(g,tint,x,y,z,sx,sy,sz,0,0,rz);g.dispose();
  }
  function curve(T,k,color,points,radius){
    const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const g=new T.TubeGeometry(path,Math.max(6,points.length*3),radius,6,false);
    k.stamp(g,color,0,0,0);g.dispose();
  }
  function turned(T,k,color,x,y,z,profile){
    const g=new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),24);
    k.stamp(g,color,x,y,z);g.dispose();
  }
  function col(k,x,z,base,h,r,color){
    k.stamp(k.round,color,x,base+h/2,z,r,h,r);
    for(const y of [base+.12,base+h-.12])k.stamp(k.round,ochre,x,y,z,1.35*r,.24,1.35*r);
  }
  function hip(T,k,x,y,z,w,d,h,color=clay){
    A.curvedRoof(T,k,x,y,z,w,d,h,color,ochre,wood,.27);
  }
  function flight(k,x,z,w,num,step=.17,run=.33,tint=stone){
    for(let i=0;i<num;i++){
      const h=(num-i)*step;
      k.box(tint,x,h/2,z+i*run,w,h,run+.02);
    }
  }
  function hall(T,k,w,d,opts={}){
    const {color=clay,wall=ivory,pillars=wood,base=.64,h=4.0}=opts;
    k.box(stone,0,base/2,0,w*.97,base,d*.97);
    k.box(wall,0,base+h/2,-d*.05,w*.84,h,d*.63);
    for(let i=-2;i<=2;i++){
      const x=i*w*.166,z=d*.269;
      k.box(dark,x,base+h*.43,z,w*.135,h*.85,.13);
      for(const side of [-1,1])k.box(pillars,x+side*w*.032,base+h*.41,z+.09,w*.057,h*.75,.08);
    }
    for(let i=0;i<=5;i++)col(k,(i/5-.5)*w*.87,d*.40,base,h,.21,pillars);
    hip(T,k,0,base+h,0,w,d,Math.min(3.7,d*.22),color);
  }
  function elephant(T,k,tint,tusks){
    ellipsoid(T,k,tint,0,1.4,-.30,1.08,.86,1.56);
    ellipsoid(T,k,tint,0,1.70,1.00,.70,.78,.72);
    for(const s of [-1,1]){
      for(const z of [-1.03,.51])k.tapered(tint,s*.66,.61,z,.24,.31,1.22,1,10);
      ellipsoid(T,k,tint,s*.65,1.66,.83,.35,.64,.18);
      ellipsoid(T,k,dark,s*.42,1.87,1.52,.065,.06,.055);
      for(let i=0;i<tusks/2;i++)curve(T,k,ivory,[[s*(.39+i*.08),1.49,1.53],[s*(.48+i*.09),1.22+i*.12,1.86],[s*(.50+i*.11),1.25+i*.13,2.09]],.055);
    }
    curve(T,k,tint,[[0,1.72,1.52],[0,1.02,1.76],[.03,.44,1.69],[.19,.37,1.42]],.18);
  }
  function tayAn(T,k,w,d){
    const rose=0xcf947f,lime=0x81ae9a;
    hall(T,k,w,d,{wall:rose,pillars:red,base:1.03,h:4.7});
    for(const [x,r,up] of [[0,3.46,1.8],[-7.08,2.28,0],[7.08,2.28,0]]){
      const z=12.3+(up?2.1:0),h=5.98+up;
      for(const s of [-1,1])for(const t of [-1,1])col(k,x+s*r*.84,z+t*r*.83,1.0,h-1,r*.105,rose);
      k.box(ochre,x,h,z,r*2.1,.55,r*2.1);k.box(lime,x,h+.36,z,r*2.3,.18,r*2.3);
      turned(T,k,rose,x,h+.42,z,[[r*.90,0],[r*1.03,.34],[r*1.03,.65],[r*.85,r*.42],[r*.52,r*.68],[r*.46,r*.82]]);
      for(let j=0;j<8;j++){
        const a=j*Math.PI/4;
        col(k,x+Math.cos(a)*r*.56,z+Math.sin(a)*r*.56,h+r*.80,r*.67,r*.058,rose);
      }
      turned(T,k,lime,x,h+r*1.44,z,[[r*.85,0],[r*.90,.24],[r*.61,r*.21],[r*.26,r*.52],[0,r*.67]]);
      k.tapered(gold,x,h+r*2.29,z,.17,.025,.85,1,12);
      k.place(x,z+r*.85,0,()=>{
        const a=r*.64,sy=h-r*.57;
        const edge=[[-a,1.13],[-a,sy-.53],[-a*.86,sy-.44],[-a*.84,sy-.03],[-a*.64,sy+.02],
          [-a*.55,sy+.39],[-a*.30,sy+.41],[0,sy+.88],[a*.30,sy+.41],[a*.55,sy+.39],
          [a*.64,sy+.02],[a*.84,sy-.03],[a*.86,sy-.44],[a,sy-.53],[a,1.13]];
        k.outline([[-r,1.13],...edge,[r,1.13],[r,h-.05],[-r,h-.05]],rose,0,0,-.07,.27);
        curve(T,k,ivory,edge.map(([px,py])=>[px,py,.24]),.12);
        for(const side of [-1,1])for(let j=0;j<6;j++){
          const a=j*.87;ellipsoid(T,k,ochre,side*r*.86+r*.09*Math.sin(a),1.75+j*.63,.18*Math.cos(a),.15,.22,.13);
        }
        for(let j=0;j<9;j++)k.box(ochre,(j-4)*r*.21,h+.16,.19,.21,.12,.20);
      });
    }
    for(const s of [-1,1])k.place(s*5.7,17.75,0,()=>elephant(T,k,s<0?0x585653:ivory,s<0?2:6));
    flight(k,0,16.48,7.7,7,.15);
  }
  function ladyShrine(T,k,w,d){
    const white=0xe3d6ae,teal=0x4c8d78;
    hall(T,k,w,d,{color:teal,wall:white,pillars:0xae463d,base:1.02,h:5.1});
    for(const [h,r,rise] of [[8.2,.73,3.75],[11.15,.46,3.29]]){
      k.box(white,0,h-.17,0,w*r*.82,1.61,d*r*.81);
      for(const side of [-1,1])for(let i=-2;i<=2;i++)k.box(red,i*w*r*.145,h,side*d*r*.407,w*r*.105,.65,.12);
      hip(T,k,0,h+.56,0,w*r,d*r,rise,teal);
    }
    flight(k,0,d*.49,9,7,.15);
    for(const side of [-1,1]){
      col(k,side*5.4,d*.43,1.0,4.93,.50,red);
      for(let i=0;i<5;i++)ellipsoid(T,k,ochre,side*5.4+.4*Math.sin(i*1.4),1.7+i*.74,d*.43+.42*Math.cos(i*1.4),.22,.21,.22);
    }
  }
  function tombCourt(T,k,w,d){
    k.box(0xbbab89,0,.36,0,w,.72,d);
    for(const s of [-1,1]){
      k.box(ivory,s*(w/2-.32),1.53,0,.62,1.75,d);
      k.box(stone,s*(w/2-.32),2.47,0,.81,.17,d);
    }
    for(const x of [-6.15,0,6.15]){
      const z=x===0?0:1.12;
      k.box(ivory,x,1.02,z,3.65,.61,6.12);
      k.box(stone,x,1.39,z,3.05,.18,5.47);k.box(ivory,x,1.70,z,2.61,.56,4.88);
      k.box(ivory,x,2.18,z-2.59,2.76,2.57,.48);
      k.box(dark,x,2.25,z-2.32,1.41,1.34,.09);
      k.outline([[-1.6,0],[-1.22,.30],[-.81,.31],[0,.78],[.81,.31],[1.22,.30],[1.6,0]],stone,x,3.35,z-2.86,.57);
    }
    for(const side of [-1,1])k.place(side*6.9,d*.475,0,()=>{
      A.vaultedBay(T,k,0,0,5.65,4.40,1.06,1.91,.80,ivory,stone,dark);
      k.box(ivory,0,4.43,0,5.85,.28,.96);
      k.outline([[-2.9,0],[-1.83,.23],[-.95,.55],[0,.68],[.95,.55],[1.83,.23],[2.9,0]],ivory,0,4.55,-.45,.90);
      for(const s of [-1,1])for(let j=0;j<4;j++)k.box(dark,s*1.85,1.30+j*.48,.44,.16,.17,.08);
    });
    flight(k,0,d/2+.14,17,9,.13,.33,0x91816c);
  }
  function summit(T,k,w,d){
    k.box(stone,0,.17,0,w,.34,d);
    const altarZ=.49;
    for(const s of [-1,1])for(const z of [-6.9,-1.7,5.20])col(k,s*3.30,z,.32,3.66,.16,red);
    hip(T,k,0,4.05,-.74,w,d*.86,1.32,clay);
    // The socket in the sandstone is square and open at the top.
    const slate=0x56615c;
    for(const side of [-1,1]){
      k.box(slate,side*.505,.57,altarZ,.67,.47,1.45);
      k.box(slate,0,.57,altarZ+side*.45,.34,.47,.56);
    }
    k.box(dark,0,.35,altarZ,.35,.035,.35);
    k.box(0xa45d48,0,.84,altarZ-1.21,2.68,1.02,.67);
    k.box(slate,0,1.59,altarZ-1.44,1.29,.89,.17);
  }
  function caveHall(T,k,w,d){
    hall(T,k,w,d,{wall:0xd8be8f,pillars:0x794539,h:4.2,base:.90});
    hip(T,k,0,7.05,0,w*.65,d*.70,2.60,clay);
    flight(k,0,d*.49,5.72,9,.15,.39);
  }
  function grotto(T,k,w,d){
    const r=w*.31,rock=0x867969;
    k.outline([[-w*.50,0],[-2.35,0],[-2.38,1.11],[-2.03,2.27],[-1.50,2.86],[-.69,3.04],
      [-.08,2.87],[.65,3.17],[1.62,2.81],[2.11,2.01],[2.29,.93],[2.32,0],[w*.50,0],
      [w*.49,2.35],[w*.42,3.84],[1.63,4.39],[.69,4.12],[-.95,4.48],[-2.91,3.91],[-w*.50,2.74]],rock,0,0,-1.03,2.10);
    const outcrop=new T.DodecahedronGeometry(1,0);
    for(const [x,y,z,a,b,c] of [[-2.98,1.0,.89,1.12,1.12,.55],[-2.44,2.61,.87,.79,.72,.51],
      [2.77,1.09,.94,.83,1.13,.49],[1.96,3.11,.91,.90,.71,.58],[.33,3.72,.81,1.35,.64,.41]]){
      k.stamp(outcrop,0x918473,x,y,z,a,b,c,.32,.14,-.09);
    }
    outcrop.dispose();
    k.box(dark,0,1.59,-d*.28,r*2.30,3.20,.18);
    k.box(red,0,.65,-d*.02,1.93,1.22,.64);
    for(const side of [-1,1]){
      const color=side<0?0x629174:ivory;
      curve(T,k,color,[[side*2.16,.27,1.55],[side*1.30,.34,1.33],[side*1.64,.78,1.06],[side*1.43,1.38,.89]],.15);
      ellipsoid(T,k,color,side*1.43,1.23,.90,.23,.36,.13);
      ellipsoid(T,k,color,side*1.43,1.50,1.02,.20,.16,.25);
      ellipsoid(T,k,dark,side*1.51,1.52,1.24,.034,.034,.023);
    }
  }
  add('osm-way-1159104301','mieu-ba-chua-xu-nui-sam','Miếu Bà Chúa Xứ núi Sam',guide+'#page=59',
    'Mái ngói xanh xếp ba tầng trên chánh điện. Từ sân phía đường Phạm Văn Bạch có thể nhìn rõ từng lớp mái thu nhỏ dần lên đỉnh.',
    [[0,0,-.48,25.8,28.1,ladyShrine,'w1159104301'],[12.4,-22.2,-.49,23,23.2,(T,k,w,d)=>hall(T,k,w,d,{color:green,pillars:red}),'w1159104300']],
    [['Sân trước miếu Bà',0,0,12.8,43,-.69,.19],['Ba tầng ngói xanh',0,0,19,40,-.25,.41]]);
  add('osm-node-1814474832','chua-tay-an-nui-sam','Tây An cổ tự',guide+'#page=64',
    'Phía trước chánh điện, lầu chuông và lầu trống đứng hai bên tòa giữa. Qua đôi voi đá, ngẩng lên sẽ thấy vòm củ hành trên hàng cột.',
    [[.2,14.7,2.29,20.6,35.4,tayAn,'w1159104318']],
    [['Đôi voi trước chánh điện',7,8,12,37,2.30,.18],['Ba lầu mặt tiền',3,12,14,43,2.77,.27]]);
  add('osm-way-1159104315','lang-thoai-ngoc-hau','Lăng Thoại Ngọc Hầu',guide+'#page=62',
    'Sau hai cửa vòm là mộ Thoại Ngọc Hầu ở giữa và mộ hai phu nhân hai bên. Xa hơn về phía sườn núi là đền thờ.',
    [[19,-26,2.56,24.5,22,tombCourt],[0,0,2.56,16.4,21.9,(T,k,w,d)=>hall(T,k,w,d,{wall:ochre}),'w1159104315']],
    [['Hai cửa lăng',19,-26,5.3,39,2.66,.31],['Ba ngôi mộ',19,-26,4.7,23,2.02,.45]]);
  add('osm-way-1189409894','chua-hang-phuoc-dien','Chùa Hang – Phước Điền tự',guide+'#page=66',
    'Nếp chùa lợp ngói tựa sườn tây núi Sam. Trong hang thờ cạnh chùa có hình thanh xà và bạch xà gắn với tích Bà Thợ.',
    [[-32.9,10.9,-1.20,16.5,34.8,caveHall,'w696698294'],[-10.8,-.7,-1.24,9.4,15.1,(T,k,w,d)=>hall(T,k,w,d,{base:.66}),'w696698295'],[-17.2,18.9,-1.20,7.6,4.2,grotto]],
    [['Chùa trên sườn núi',-32.9,10.9,8.2,39,-1.58,.31],['Hai tượng rắn trong hang',-17.2,18.9,3.3,8,-1.28,.12]]);
  add('osm-node-4293357289','be-da-ba-ngu-nui-sam','Đỉnh núi Sam – Bệ đá Bà ngự',guide+'#page=58',
    'Trên đỉnh núi Sam, tảng sa thạch xanh đen có một lỗ vuông ở giữa. Lễ rước tượng Bà về miếu dưới chân núi bắt đầu từ đây.',
    [[-11,9.1,2.36,8.5,21.3,summit,'w1189393345']],
    [['Nơi thờ trên đỉnh núi',-11,9.1,5.8,23,2.80,.28],['Lỗ vuông trên bệ đá',-10.7,9.0,1.95,3.2,2.48,.34]]);

  function khmerGable(T,k,y,w,d,h,color){
    A.gabledRoof(T,k,0,y,0,w,d,h,color,gold);
    for(const side of [-1,1])k.place(0,side*(d/2+.28),side===1?0:Math.PI,()=>{
      k.outline([[-w*.47,0],[0,h-.02],[w*.47,0]],red,0,y,-.19,.21);
      for(const sign of [-1,1]){
        A.strut(T,k,gold,0,y+h,.09,sign*w*.50,y,.09,.14);
        k.outline([[0,0],[sign*.44,.26],[sign*.78,.82],[sign*.84,1.46],[sign*.37,.92]],gold,sign*w*.5,y-.12,0,.18);
        for(let j=1;j<=7;j++){
          const t=j/8,x=sign*w*.49*t,cy=y+h*(1-t);
          k.outline([[0,0],[sign*.09,.50],[sign*.30,.78],[sign*.28,.19]],gold,x,cy,.085,.10);
        }
      }
      for(let j=0;j<4;j++){
        const r=w*.052*(1-j*.16);
        k.stamp(k.round,j%2?red:gold,0,y+h*.34,.10+j*.03,r,.12,r,0,Math.PI/2);
      }
      for(const sign of [-1,1])for(let n=1;n<5;n++){
        const t=n/6,x=sign*w*.42*t;
        curve(T,k,ochre,[[x-.29,y+.15,.15],[x-.29,y+h*(1-t)*.42,.15],[x,y+h*(1-t)*.59,.15],[x+.30,y+h*(1-t)*.43,.15]],.055);
      }
    });
  }
  function khmerHall(T,k,w,d){
    k.box(ochre,0,.54,0,w*.95,1.08,d*.95);
    k.box(0xc49365,0,3.44,0,w*.65,4.72,d*.72);
    for(const s of [-1,1])for(let j=0;j<=5;j++){
      const x=s*w*.429,z=(j/5-.5)*d*.82;
      // The actual capitals carry both Keynor and Krud sculptures. Leave
      // their figures out until the individual carvings can be identified.
      col(k,x,z,1.07,4.33,.27,red);
    }
    for(const s of [-1,1]){
      for(const x of [-2.46,2.46]){
        k.box(gold,x,2.78,s*d*.363,2.19,3.43,.17);
        k.box(wood,x,2.74,s*d*.370,1.87,3.2,.16);
      }
      for(const x of [-1,1])for(let j=1;j<=4;j++){
        k.box(ochre,x*w*.332,3.3,(j/5-.5)*d*.73,.16,2.68,1.86);
        k.box(dark,x*w*.340,3.3,(j/5-.5)*d*.73,.14,2.23,1.45);
      }
    }
    for(const [a,b,y,h] of [[1,1,5.6,4.0],[.84,.79,7.05,3.84],[.64,.64,8.78,3.45]])khmerGable(T,k,y,w*a,d*b,h,clay);
    flight(k,0,d*.48,6.6,7,.17);
  }
  function nagaStandard(T,k){
    k.box(stone,0,.24,0,3.8,.48,3.8);
    k.stamp(k.round,ivory,0,4.2,0,.095,7.8,.095);
    for(let i=0;i<4;i++)k.place(0,0,i*Math.PI/2,()=>{
      curve(T,k,ochre,[[0,.46,.35],[0,.76,.72],[0,.94,1.13],[0,1.18,1.49]],.17);
      for(let n=-2;n<=2;n++){
        const a=n*.35,yy=1.50+(2-Math.abs(n))*.12;
        curve(T,k,gold,[[0,1.11,1.45],[a*.6,1.36,1.54],[a,yy,1.65]],.11);
      }
    });
  }
  function stupa(T,k,w){
    const grey=0xa5a59d,trim=0xc7c4ad;
    for(let i=0;i<4;i++){
      const side=w-i*.52;
      k.box(i%2?trim:grey,0,(i+1)*.19,0,side,(i+1)*.38,side);
    }
    for(let i=0;i<4;i++)k.place(0,0,i*Math.PI/2,()=>{
      for(const side of [-1,1])k.box(grey,side*2.28,4.13,3.14,2.24,5.24,.52);
      k.box(grey,0,6.30,3.14,2.32,.90,.52);
      for(const s of [-1,1])col(k,s*1.58,3.79,1.65,4.39,.24,trim);
      k.outline([[-2.06,0],[-1.50,.28],[-.88,1.10],[0,2.36],[.88,1.10],[1.50,.28],[2.06,0]],trim,0,5.87,3.38,.57);
      for(const s of [-1,1])k.tapered(trim,s*3.27,7.94,3.27,.73,.08,3.70,1,8);
    });
    // All four entrances look into a single shrine. The gilded Buddha
    // faces east and sits in meditation on the central plinth.
    k.tapered(ochre,0,2.12,0,1.12,.98,1.20,1,12);
    A.lotusSeat(T,k,0,2.72,0,.83,.23,gold,ochre);
    k.place(0,0,Math.PI/2-1.27,()=>A.statueFigure(T,k,gold,0,1.98,0,3.06,{seated:true,
      leftArm:[[.132,.620,.030],[.047,.480,.143],[.003,.465,.152]],
      rightArm:[[-.130,.610,.036],[-.042,.474,.151],[.015,.467,.158]]}));
    for(let i=0;i<5;i++)k.tapered(i%2?grey:trim,0,7.45+i*1.07,0,4.50-i*.52,3.99-i*.51,1.12,1,4);
    turned(T,k,grey,0,12.0,0,[[1.56,0],[1.76,.31],[1.43,.77],[1.15,2.65],[.86,3.66],[.81,4.15]]);
    for(let i=0;i<9;i++)k.tapered(i%2?grey:trim,0,16.38+i*.57,0,.94-i*.076,.82-i*.076,.64,1,12);
    k.tapered(trim,0,22.65,0,.35,.025,3.4,1,12);
  }
  function reclining(T,k,w,d){
    k.box(0xa49b91,0,3.10,0,w,6.2,d);
    k.box(ochre,0,6.33,0,w+.22,.29,d+.22);
    for(const side of [-1,1])for(let i=-7;i<=7;i++){
      const x=i*w*.061;
      k.box(dark,x,2.81,side*d*.503,2.30,3.44,.17);
      for(const s of [-1,1])k.box(ivory,x+s*1.29,2.86,side*d*.513,.19,3.81,.19);
      k.outline([[-1.48,0],[0,.94],[1.48,0]],ivory,x,4.55,side*d*.509,.16);
      k.box(ivory,x,5.74,side*d*.514,2.85,.16,.14);
    }
    for(let i=-13;i<=13;i++)ellipsoid(T,k,gold,i*2.28,6.68,d*.47,.43,.37,.15);
    // Huynhdat1909's front elevation, 27 May 2023. The two hands,
    // elbow, gold bolster and stacked feet have separate depth profiles.
    // Coordinates refer to a 900-pixel-wide copy before the texture crop.
    const figure=A.photoCarving(T,k,{photo:'sight-photos/som-rong-tuong-nam.webp',width:900,height:675,
      crop:[40,140,820,249],origin:[450,384],scale:63/809,position:[0,6.51,0],tint:0xc5d1d8,
      forms:[
        // Robed torso, including the high left shoulder and cloth over the hips.
        {z:-.44,rows:[[221,317,325,.29],[224,305,337,.89],[231,296,352,1.53],[243,271,378,2.39],
          [252,255,399,2.91],[260,248,420,3.24],[267,242,459,3.67],[271,237,506,3.84],
          [276,231,551,4.04],[285,218,563,4.23],[292,204,583,4.33],[300,151,614,4.37],
          [318,130,681,4.37],[335,115,738,4.13],[346,106,785,3.92],[357,94,803,3.62],
          [369,83,802,3.45],[378,73,803,3.05],[384,69,804,2.62]]},
        // The bare shoulder beneath the inclined neck.
        {z:.19,rows:[[288,153,162,.43],[290,150,173,.70],[295,144,201,1.05],[300,140,213,1.37],
          [310,132,220,1.59],[329,119,242,1.69],[354,101,247,1.58],[377,74,231,1.25],[384,70,215,1.02]]},
        // Cloth around both legs. Separate terminal sections preserve the
        // distinct feet when viewed from the end of the platform.
        {z:-.66,rows:[[289,548,560,.36],[296,543,590,1.03],[302,539,619,1.47],[311,532,651,1.89],
          [320,524,690,2.26],[328,515,718,2.49],[336,509,744,2.68],[343,498,768,2.80],
          [350,493,795,2.77],[359,500,820,2.60],[370,507,821,2.25],[380,521,823,1.86],[384,533,825,1.58]]},
        {z:-.60,rows:[[337,830,844,.38],[340,817,849,.78],[344,803,852,1.22],[348,775,853,1.51],
          [353,759,853,1.68],[358,745,852,1.59],[363,741,850,1.26],[369,754,845,.78],[372,773,837,.42]]},
        {z:1.09,rows:[[366,769,845,.41],[369,757,851,.76],[373,755,853,1.01],
          [378,765,852,.98],[382,771,850,.76],[384,775,844,.54]]},
        // Left hand visible over the robe at the thigh.
        {z:.35,rows:[[279,555,562,.18],[281,555,572,.25],[285,555,581,.38],[289,555,590,.46],
          [293,577,602,.37],[297,593,613,.25],[300,608,619,.11]]},
        // The head inclines onto the right palm; the dark curls stop at the hairline.
        {z:-.04,rows:[[146,125,126,.05],[153,129,135,.15],[162,134,145,.34],[167,137,160,.73],
          [171,136,181,1.19],[177,132,193,1.76],[187,131,199,2.17],[197,129,206,2.45],
          [208,131,213,2.65],[218,136,219,2.75],[231,143,226,2.73],[241,151,230,2.58],
          [251,161,231,2.29],[262,178,232,1.94],[273,189,227,1.48],[283,198,222,1.13],
          [291,197,215,.75],[296,198,210,.45]]},
        // Elongated ear at the far edge of the face.
        {z:-.39,rows:[[225,223,225,.10],[232,225,230,.22],[241,227,236,.27],[247,232,240,.18],[251,237,240,.07]]},
        // Right upper arm and the palm along the hair, ahead of the torso.
        {z:.38,rows:[[193,122,125,.09],[205,121,132,.29],[218,124,141,.43],[232,129,148,.53],
          [243,136,153,.61],[248,141,152,.54],[255,138,148,.52],[268,130,143,.61],
          [281,121,138,.73],[297,107,132,.86],[311,94,124,1.00],[328,78,112,1.11],
          [345,63,101,1.21],[359,53,90,1.22],[372,48,82,1.06],[381,49,73,.73],[384,52,68,.53]]},
        // The carved gold bolster runs underneath the elbow, ending under the chest.
        {z:2.86,rows:[[329,181,191,.28],[334,174,200,.59],[343,151,207,.83],[353,130,216,1.06],
          [363,107,225,1.15],[374,85,238,1.17],[384,75,248,1.03]]}
      ]});
    figure.scale.y=22.5/((384-146)*63/809);
  }
  function clayTemple(T,k,w,d){
    const yellow=0xe5bd5b;
    k.box(stone,0,.23,0,w,.46,d);
    k.box(yellow,0,2.6,-d*.46,w,4.3,.57);
    for(const s of [-1,1])k.box(yellow,s*w*.48,2.6,0,.46,4.3,d*.92);
    for(let i=0;i<4;i++)for(let j=0;j<6;j++){
      const x=(i/3-.5)*w*.88,z=(j/5-.5)*d*.90;
      col(k,x,z,.46,4.25,.30,red);
      const helix=[];for(let p=0;p<=12;p++){const a=p*Math.PI/3;helix.push([x+.30*Math.cos(a),.63+p*.31,z+.30*Math.sin(a)]);}
      curve(T,k,ochre,helix,.072);
    }
    k.outline([[-w/2,0],[0,1.55],[w/2,0]],yellow,0,4.67,d*.46,.4);
    A.gabledRoof(T,k,0,4.74,0,w,d,1.63,clay,ochre);
    for(const s of [-1,1]){
      const x=s*w*.284;
      k.box(yellow,x,2.58,d*.45,w*.18,4.28,.40);
      curve(T,k,green,[[x-1.8,5.09,d*.48],[x-1.05,5.59,d*.48],[x-.43,5.36,d*.48],[x+.48,5.64,d*.48],[x+1.52,5.25,d*.48]],.11);
    }
    k.box(ochre,0,4.39,d*.459,w*.41,.43,.45);
    // The thirteen eaves of Đa Bảo diminish around a real model of the
    // clay tower. Visitors can see it from the aisle beside the front doors.
    for(let i=0;i<13;i++){
      const radius=.92-i*.048,y=.66+i*.304;
      k.tapered(0xc98153,-3.8,y,2.65,radius*.79,radius*.75,.23,1,8);
      k.tapered(ochre,-3.8,y+.17,2.65,radius,radius*.70,.14,1,8);
      for(let j=0;j<8;j++){
        const a=(j+.5)*Math.PI/4;
        for(const u of [-.15,.15]){
          const x=-3.8+radius*(.73*Math.sin(a)+u*Math.cos(a)),z=2.65+radius*(.73*Math.cos(a)-u*Math.sin(a));
          k.box(dark,x,y,z,radius*.13,.13,.018,a);
        }
      }
    }
    k.tapered(gold,-3.8,4.59,2.65,.19,.01,.44,1,8);
    for(const x of [1.0,3.3,5.60])for(const z of [-1.5,1.1]){
      k.stamp(k.round,red,x,.62,z,.39,.31,.39);
      k.stamp(k.round,0xc44640,x,2.04,z,.29,2.60,.29);
      k.stamp(k.round,dark,x,3.37,z,.030,.10,.030);
    }
  }
  function langCa(T,k,w,d){
    const w2=w*.88;
    k.box(ochre,0,2.0,0,w2,4,d*.86);
    k.box(ivory,0,4.06,0,w,.25,d*.94);
    k.box(ochre,0,6.02,-d*.09,w*.77,3.69,d*.57);
    for(let j=-2;j<=2;j++){
      k.box(wood,j*w*.146,5.71,d*.199,w*.103,2.95,.15);
      col(k,j*w*.177,d*.345,4.19,3.86,.25,wood);
    }
    hip(T,k,0,8.09,0,w,d,3.29,0xb98b4a);
    hip(T,k,0,10.40,-d*.05,w*.68,d*.72,2.42,0xb98b4a);
    for(let j=0;j<18;j++){
      const h=(18-j)*.222;
      k.box(stone,0,h/2,d*.462+j*.29,4.92,h,.32);
    }
  }
  function langGate(T,k,w,d){
    for(const s of [-1,1]){
      k.box(ivory,s*w*.24,2.26,0,.79,4.52,d*.43);
      k.box(ivory,s*w*.46,1.55,0,.54,3.10,d*.34);
      hip(T,k,s*w*.36,3.27,0,w*.32,d*.70,.92);
    }
    k.box(ivory,0,4.37,0,w*.58,1.36,d*.48);
    A.plaque(T,k,'LĂNG CA CỔ TỰ',0,4.45,d*.258,w*.44,.66,{bg:'#e7ddc8',fg:'#724c36',border:0x9a8165});
    hip(T,k,0,5.12,0,w*.65,d,1.12);
  }
  add('osm-way-225364168','chua-khleang-soc-trang','Chùa Kh’leang','https://canthotourism.vn/vi/chuakhmersoctrang',
    'Chim thần Krud đỡ mái trên đầu cột hành lang. Bốn rắn Naga năm đầu quay ra bốn hướng quanh chân cột cờ phía trước chánh điện.',
    [[-9.8,20.8,1.66,15.8,26.2,khmerHall,'w668449632'],[13.4,18.5,1.66,4,4,nagaStandard]],
    [['Chánh điện Kh’leang',-9.8,20.8,9.2,37,1.23,.19],['Cột cờ Naga',13.4,18.5,4.9,11,1.29,.23],['Krud đỡ mái',-8.6,24.6,8.8,14,.20,.15]]);
  add('osm-way-668640550','chua-dat-set-soc-trang','Chùa Đất Sét – Bửu Sơn tự','https://csdl.vietnamtourism.gov.vn/dest/?item=248',
    'Sau hàng cột đắp rồng là tháp Đa Bảo mười ba tầng do ông Ngô Kim Tòng nặn bằng đất sét. Nến lớn đặt trong các gian thờ.',
    [[-7.7,2.3,1.22,21.5,29.6,clayTemple,'w668640552']],
    [['Hiên chùa và cột rồng',-1,4,6.8,29,1.56,.17],['Tháp Đa Bảo',-6.47,6.8,4.25,4.65,1.35,.13],['Những cây nến lớn',-6.92,-1,3.8,4.87,1.48,.12]]);
  add('osm-way-668640522','lang-ca-co-tu-soc-trang','Lăng Ca cổ tự','https://canthotourism.vn/vi/chualangca',
    'Cổng tam quan mở từ đường Tôn Đức Thắng. Qua sân chùa, cầu thang dẫn lên tầng trên của chánh điện, nơi bốn góc mái ngói vàng uốn cong.',
    [[4,-4.1,-1.86,24.1,24.3,langCa,'w668640524'],[-46,-20,-1.91,8.9,4.1,langGate]],
    [['Từ sân chùa Lăng Ca',4,-4.1,8.7,39,-1.59,.18],['Cổng trên đường Tôn Đức Thắng',-46,-20,5.2,16,-1.78,.16]],
    [105.982002,9.6193029]);
  add('osm-way-668649240','chua-som-rong','Chùa Som Rông','https://canthotourism.vn/vi/chuabotum',
    'Trong sân phía tây là tượng Phật nằm dài 63 m. Gần chánh điện, bảo tháp màu xám có bốn lối và khám thờ Phật quay về hướng đông.',
    [[-60,19.8,1.33,17.7,26,khmerHall,'w668649248'],[-36.4,-14.0,1.27,11,11,stupa],
      [-172.5,-47.4,1.12,64,11.6,reclining]],
    [['Tượng Phật nhập Niết bàn',-172.5,-47.4,14.8,65,1.12,.025],['Bảo tháp bốn hướng',-36.4,-14,10.6,38,1.54,.075],['Sân chánh điện',-60,19.8,9.3,38,1.00,.23]]);

  const earth=0x977e61, brick=0x9d6951, paleBrick=0xb48060, fieldstone=0x9a9787;
  function residue(k,ax,az,bx,bz,width,rise,stony=false){
    const span=Math.hypot(bx-ax,bz-az),count=Math.ceil(span/1.35),yaw=Math.atan2(bx-ax,bz-az);
    k.box(stony?fieldstone:brick,(ax+bx)/2,.21,(az+bz)/2,width,.38,span,yaw);
    for(let i=0;i<count;i++){
      const ratio=(i+.5)/count,odd=Math.sin(i*27.1+ax*.4+bz*.72);
      const h=rise*(.80+.20*odd),color=stony&&i%3!==0?fieldstone:i%3===0?paleBrick:brick;
      k.box(color,ax+(bx-ax)*ratio,.28+h/2,az+(bz-az)*ratio,width*(.98-.09*odd),h,span/count-.034,yaw);
    }
  }
  function rectangle(k,x,z,w,d,thick,h,stoneMix=false){
    for(const s of [-1,1]){
      residue(k,x-w/2,z+s*d/2,x+w/2,z+s*d/2,thick,h,stoneMix);
      residue(k,x+s*w/2,z-d/2,x+s*w/2,z+d/2,thick,h,stoneMix);
    }
  }
  function shelter(T,k,w,d,color,isHipped){
    const y=5.45;
    for(const s of [-1,1])for(let i=0;i<4;i++){
      const x=s*(w/2-.61),z=(i/3-.5)*(d-1.85);
      k.box(0x8b9188,x,y*.5,z,.23,y,.23);
      A.strut(T,k,0x858c85,x,y-1.09,z,x-s*1.65,y,z,.075);
      if(s===1){
        A.strut(T,k,0x858c85,-x,y,z,x,y,z,.087);
        const top=y+(isHipped?1.74:2.02)*(1-.70*Math.abs(z/d));
        A.strut(T,k,0x858c85,-x,y,z,0,top,z,.085);
        A.strut(T,k,0x858c85,0,top,z,x,y,z,.085);
        A.strut(T,k,0x858c85,0,y,z,0,top,z,.065);
      }
    }
    if(isHipped){
      hip(T,k,0,y,0,w+.37,d+.37,2.53,color);
      const ring=t=>[[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1]].map(([a,b])=>
        [a*w*(.50*(1-t)+.27*t),y+2.53*t*t+Math.abs(a*b)*.48*(1-t)-.10,b*d*.50*(1-t)]);
      const vertices=[];let outer=ring(0);
      for(const t of [.33,.67,1]){
        const inner=ring(t);
        for(let i=0;i<outer.length;i++){
          const j=(i+1)%outer.length;vertices.push(...outer[i],...inner[i],...outer[j],...outer[j],...inner[i],...inner[j]);
        }
        outer=inner;
      }
      const lining=new T.BufferGeometry();lining.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
      lining.computeVertexNormals();k.stamp(lining,0x9f806b,0,0,0);lining.dispose();
    }
    else A.gabledRoof(T,k,0,y,0,w,d,2.12,color,fieldstone);
  }
  function templeRemains(T,k,w,d){
    k.box(earth,0,.12,0,w-.7,.24,d-.7);
    // Gò Cây Thị A: the four rectangular cells of the sanctuary, and the
    // eastern antechamber shown in the excavators' 22 × 24.54 metre plan.
    rectangle(k,0,-3.23,17.7,13.4,1.13,.65);
    residue(k,-8.8,-3.23,8.8,-3.23,1.02,.64);
    residue(k,0,-9.91,0,3.5,1.08,.59);
    for(const side of [-1,1]){
      residue(k,side*10.55,-10.98,side*10.55,5.4,.79,.43,true);
      residue(k,side*10.55,5.4,side*6.20,5.4,.72,.43);
      residue(k,side*6.20,5.4,side*6.2,10.55,.76,.50);
      residue(k,side*6.20,10.55,side*2.16,10.55,.73,.46);
    }
    k.box(paleBrick,0,.31,7.22,9.8,.24,4.65);
    shelter(T,k,w,d,clay,true);
  }
  function northernChamber(T,k,w,d){
    k.box(earth,0,.11,0,w-.5,.22,d-.5);
    rectangle(k,0,0,11.65,16.70,.86,.66,true);
    rectangle(k,-.22,.17,6.67,9.24,.82,.49);
    k.box(0x75614d,-.15,.19,.24,5.61,.17,6.81);
    shelter(T,k,w,d,0xaeb4a5,false);
  }
  function drainSite(T,k,w,d){
    k.box(earth,0,.14,0,w-.6,.28,d-.6);
    rectangle(k,0,0,17.5,22.5,.64,.63,true);
    for(const [x,z,ww,dd] of [[-4.2,-5.5,6.4,7.8],[4.7,-4.4,5.5,9.1],[-3.59,4.78,7.8,6.62],[4.80,6.46,5.1,5.23]]){
      k.box(paleBrick,x,.26,z,ww-.15,.25,dd-.15);
      rectangle(k,x,z,ww,dd,.57,.42,true);
    }
    for(const s of [-1,1])residue(k,.70+s*.45,-9.80,.70+s*.45,9.06,.39,.71);
    k.box(0x68655a,.70,.29,-.50,.43,.04,18.90);
    shelter(T,k,w,d,clay,true);
  }
  function linhSon(T,k,w,d){
    const base=.58,h=4.52,wall=0xd5bd8d;
    k.box(stone,0,base/2,0,w,base,d);
    k.box(wall,0,h/2+base,-d*.43,w,h,.53);
    for(const s of [-1,1])k.box(wall,s*w*.47,h/2+base,-d*.11,.45,h,d*.69);
    for(let i=0;i<4;i++)col(k,(i/3-.5)*w*.88,d*.36,base,h,.20,wood);
    hip(T,k,0,base+h,0,w,d,2.42,clay);
    const y=.63,z=-1.18,gilt=0xdca644,flesh=0xecbd8e;
    k.box(0xd8dacf,0,y+.28,z,3.02,.56,2.17);
    k.box(0x453d3b,0,y+.61,z,1.79,.10,1.21);
    // The painted image at Ba Thê has crossed legs, four distinct hands, a
    // high gold crown and a seven-headed cobra canopy behind it.
    const seat=y+.66;
    const clayBody=A.carving(T,k,flesh,0,seat,z,1);
    const cloth=A.carving(T,k,gilt,0,seat,z,1);
    clayBody.sweep([[0,.29,0,.24,.17],[0,.55,0,.235,.17],[0,.80,-.01,.28,.165],
      [0,.99,-.02,.35,.145],[0,1.04,-.02,.28,.13],[0,1.08,0,.113,.093]]);
    cloth.sweep([[0,.015,-.016,.53,.32],[0,.09,-.009,.56,.34],[0,.19,-.01,.54,.31],
      [0,.28,-.02,.45,.28],[0,.42,-.025,.32,.23],[0,.56,-.03,.26,.19],
      [0,.65,-.02,.24,.17]],.034,32);
    for(const side of [-1,1]){
      cloth.sweep([[side*.16,.15,.01,.18,.17],[side*.39,.16,.08,.166,.19],
        [side*.46,.13,.18,.128,.16],[side*.31,.15,.27,.099,.111],
        [side*.05,.19,.31,.084,.079],[-side*.15,.21,.26,.061,.061],
        [-side*.19,.216,.22,.022,.026]],.036,22);
      // The outer pair rises beside the crown. The left wrist at the ear
      // points inwards, while the right hand holds the dark circular beads.
      const highX=side<0?-.52:.210,highY=side<0?1.28:1.36;
      clayBody.sweep([[side*.27,.94,-.080,.111,.091],[side*.39,.84,-.12,.092,.085],
        [side*.54,.91,-.13,.089,.082],[side*.60,1.01,-.11,.077,.079],
        [side*.61,1.10,-.09,.073,.074],[highX,highY-.085,-.07,.058,.056],
        [highX,highY,-.047,.049,.046]],0,20);
      cloth.sweep([[highX,highY-.095,-.067,.061,.059],[highX,highY-.054,-.062,.061,.058]]);
      clayBody.sweep([[highX,highY-.01,-.05,.049,.045],[highX+side*.006,highY+.045,-.045,.061,.048],
        [highX+side*.016,highY+.079,-.028,.043,.038],[highX-side*.016,highY+.095,-.008,.018,.025]],0,16);
      for(let digit=0;digit<4;digit++){
        const dx=digit*.014;
        clayBody.sweep([[highX-side*dx,highY+.067,-.012,.014,.017],
          [highX-side*(.019+dx),highY+.085,.005,.013,.015],
          [highX-side*(.031+dx),highY+.065,.015,.011,.011]],0,12);
      }
      // Lower hands turn up in the lap, each holding a small red attribute.
      const cx=side*.25;
      const arm=side<0?clayBody:cloth;
      arm.sweep([[side*.275,.991,.003,.103,.097],[side*.347,.91,.037,.110,.106],
        [side*.374,.78,.066,.085,.088],[side*.382,.62,.11,.075,.079],
        [side*.362,.529,.154,.077,.083],[cx,.492,.252,.064,.062]],side>0?.035:0,20);
      cloth.sweep([[cx+side*.017,.498,.229,.067,.060],[cx-side*.014,.484,.269,.063,.062]]);
      clayBody.sweep([[cx,.48,.256,.054,.056],[cx-side*.021,.475,.303,.070,.062],
        [cx-side*.042,.49,.35,.063,.043],[cx-side*.047,.525,.363,.035,.032]],0,16);
      for(let digit=0;digit<4;digit++){
        const edge=cx-side*.042+(digit-1.5)*.022;
        clayBody.sweep([[edge,.49,.336,.016,.016],[edge,.506,.369,.017,.015],
          [edge,.536,.371,.014,.013],[edge,.548,.351,.009,.012]],0,12);
      }
      ellipsoid(T,k,0x9c3933,cx-side*.052,seat+.522,z+.317,.046,.041,.057);
      cloth.sweep([[side*.360,.893,.035,.095,.09],[side*.352,.918,.032,.107,.101],
        [side*.338,.973,.018,.103,.093],[side*.308,1.011,.002,.080,.076],
        [side*.287,1.032,-.011,.039,.045]],.025,24);
    }
    const beads=Array.from({length:15},(_,i)=>{const a=i*Math.PI/7;
      return [-.515+.051*Math.cos(a),seat+1.342+.055*Math.sin(a),z-.007];});
    curve(T,k,0x4d3731,beads,.014);
    // The broad fold crosses from the bare right side to the covered left shoulder.
    cloth.sweep([[-.18,.54,.102,.065,.042],[-.07,.59,.161,.112,.042],[.086,.70,.165,.102,.045],
      [.18,.83,.123,.111,.051],[.223,.977,.059,.115,.069],[.242,1.036,-.016,.098,.088]],.045,24);
    cloth.sweep([[.12,.20,-.016,.26,.24],[.165,.37,-.01,.188,.203],[.17,.59,.01,.166,.18],
      [.206,.77,.02,.144,.144],[.24,.94,.003,.126,.13],[.265,1.00,-.015,.095,.103]],.075,28);
    for(let n=0;n<3;n++)cloth.sweep([[.209+n*.022,.961,.114,.005,.007],[.174+n*.021,.81,.172,.01,.013],
      [.095+n*.021,.694,.203,.008,.013],[-.080+n*.022,.576,.201,.005,.008]],0,12);
    clayBody.sweep([[0,1.012,0,.106,.094],[0,1.10,.017,.103,.090],[0,1.175,.017,.108,.095]]);
    clayBody.finish();cloth.finish();
    // The licensed 2007 photograph is oblique. Keep its eye, mouth and
    // ear on the photographed side, registered to the actual crown profile.
    k.place(0,z,1.12,()=>A.photoCarving(T,k,{photo:'sight-photos/linh-son-mu-va-chan-dung.webp',
      width:487,height:740,crop:[184,245,66,125],origin:[215,366],scale:.00555,position:[0,seat+1.052,.021],
      tint:flesh,forms:[{rows:[[253,220,222,.021],[256,207,229,.074],[260,204,233,.103],
        [268,205,238,.129],[278,206,243,.144],[287,202,246,.151],[296,201,244,.152],
        [304,197,244,.150],[311,196,243,.148],[318,194,243,.146],[325,192,243,.142],
        [331,191,242,.139],[335,190,241,.134],[341,192,240,.126],[346,192,239,.120],
        [351,192,239,.115],[355,194,238,.103],[359,199,232,.089],[366,200,221,.078]]}]}));
    // Seven flaring hoods rise behind the shoulders from the same coiled support.
    const canopy=A.carving(T,k,0x9a9d89,0,seat,z,1),heads=A.carving(T,k,0xa63a36,0,seat,z,1);
    canopy.sweep([[0,.55,-.315,.38,.11],[0,.90,-.32,.49,.12],[0,1.18,-.30,.565,.13],
      [0,1.40,-.279,.569,.125],[0,1.55,-.254,.51,.12],[0,1.69,-.235,.348,.10],
      [0,1.77,-.199,.187,.066],[0,1.798,-.172,.063,.051]],.018,32);
    canopy.sweep([[0,.01,-.21,.42,.19],[0,.17,-.25,.49,.22],[0,.33,-.26,.46,.206],
      [0,.43,-.27,.39,.19],[0,.54,-.27,.46,.21],[0,.68,-.28,.48,.20],[0,.77,-.28,.40,.19]],.025,26);
    for(let i=-3;i<=3;i++){
      const x=i*.17,h=1.82-Math.abs(i)*Math.abs(i)*.042;
      canopy.sweep([[x*.60,.51,-.255,.16,.14],[x*.79,.76,-.26,.17,.13],
        [x*1.04,1.07,-.23,.16,.12],[x*1.11,h-.19,-.20,.132,.105],
        [x*1.03,h-.07,-.16,.103,.087],[x,h-.012,-.12,.061,.067]],0,18);
      heads.sweep([[x*1.06,h-.074,-.151,.099,.054],[x,h-.037,-.111,.102,.057],
        [x*.97,h-.015,-.062,.077,.044],[x*.95,h-.015,-.011,.046,.027],
        [x*.94,h-.025,.020,.016,.015]],0,20);
    }
    canopy.finish();heads.finish();
    for(const side of [-1,1]){
      k.box(0x555b55,side*2.02,y+.87,z+.08,.90,1.65,.24);
      k.outline([[-.45,0],[-.43,.22],[-.26,.30],[.20,.29],[.40,.20],[.45,0]],0x555b55,side*2.02,y+1.68,z-.04,.24);
    }
  }
  add('osm-way-1182462616','go-cay-thi-oc-eo','Di tích Gò Cây Thị',guide+'#page=53',
    'Dưới mái bảo tồn ở gò A, bốn ô chữ nhật còn chia nền chính điện, trước mặt là tiền điện phía đông. Cách đó về phía bắc là nền gò B.',
    [[-.4,12.6,1.24,28.7,32.5,templeRemains],[12.1,-12.6,1.24,18.9,22.4,northernChamber]],
    [['Bốn ô nền ở gò A',-.4,12.6,3.5,13.5,.87,.19],['Hai nhà bảo tồn',4,1,12.5,63,.60,.46],['Móng gạch đá gò B',12.1,-12.6,3.6,9.7,1.10,.20]]);
  add('osm-way-1182462620','nam-linh-son-oc-eo','Di chỉ Nam Linh Sơn tự',guide+'#page=52',
    'Ở phía nam chùa Linh Sơn, các vách móng đá và gạch chia ra sân, nền và hành lang. Giữa hai hàng gạch hẹp còn thấy rãnh thoát nước.',
    [[0,0,1.22,26.4,29.7,drainSite]],
    [['Dưới mái bảo tồn',0,0,4.7,13.8,.79,.20],['Rãnh thoát nước',.40,0,2.95,5.3,1.22,.30]]);
  add('osm-way-1182462619','linh-son-co-tu-ba-the','Linh Sơn cổ tự – Chùa Phật Bốn Tay',guide+'#page=50',
    'Chùa trên sườn Ba Thê lưu giữ tượng bốn tay và hai bia đá cổ. Từ hiên, nhìn vào trong có thể thấy các bia sẫm màu cạnh bệ thờ.',
    [[-16.0,-1.2,1.15,15.6,18.7,linhSon]],
    [['Hiên chùa dưới tán cây',-16,-1.2,7.2,26,1.57,.21],['Tượng bốn tay và bia đá',-17.1,-1.7,4.96,3.4,1.68,.025,0]]);
})();

export default window.VietnamSights;
