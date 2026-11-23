'use strict';
(() => {
  const A = window.CentralArch;
  const tile=0x735649, ridge=0x9a9788, timber=0x584034, plaster=0xc0b599, stone=0x7c8177;
  const shortStone=0x92958a, bronze=0x6b5940;
  function finish(kit){
    kit.palette({stone:[stone,shortStone],timber,tile,plaster});
  }
  function hip(T,k,x,y,z,w,d,h,color=tile){
    A.curvedRoof(T,k,x,y,z,w,d,h,color,ridge,ridge,.31);
  }
  function post(k,x,z,base,height,r,color){
    k.stamp(k.round,shortStone,x,base+.09,z,r*1.4,.18,r*1.4);
    k.stamp(k.round,color,x,base+height/2,z,r,height,r);
  }
  function tube(T,k,points,r,color){
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const g=new T.TubeGeometry(curve,Math.max(10,points.length*2),r,6,false);
    k.stamp(g,color,0,0,0);g.dispose();
  }
  // A low five-bay worship hall. The shallow veranda leaves the door leaves,
  // columns, beams and stone thresholds readable from the dragon court.
  function hall(T,k,z,w,d,height,{columns=timber,base=.48,bays=5,color=tile}={}){
    k.box(stone,0,base/2,z,w+.18,base,d+.18);
    k.box(plaster,0,base+height/2,z-d*.10,w-.62,height,d*.66);
    const door=z+d*.236,front=z+d*.39,step=(w-.9)/bays;
    for(let i=0;i<=bays;i++){
      const x=(i-bays/2)*step;
      post(k,x,front,base,height,.15,columns);
      if(i===bays)continue;
      const middle=x+step*.5;
      k.box(0x342b23,middle,base+height*.46,door,step*.88,height*.90,.15);
      for(let leaf=0;leaf<4;leaf++){
        const u=middle+(leaf-1.5)*step*.20;
        k.box(timber,u,base+height*.36,door+.10,step*.17,height*.63,.07);
        for(const split of [-.045,.045])k.box(timber,u+split*step,base+height*.77,door+.10,.035,height*.20,.06);
      }
      k.box(timber,middle,base+height-.12,front,step,.22,.22);
    }
    hip(T,k,0,base+height,z,w+.85,d+.95,Math.min(2.45,d*.27),color);
  }
  function canopy(T,k,w,d,h,color,posts=timber){
    for(const x of [-1,1])for(const z of [-1,1])post(k,x*w*.36,z*d*.36,.24,h,.18,posts);
    for(const z of [-1,1])k.box(timber,0,h+.1,z*d*.36,w*.76,.33,.26);
    hip(T,k,0,h+.2,0,w,d,1.08,color);
    for(const x of [-1,1])for(const z of [-1,1])k.box(timber,x*w*.23,h+1.52,z*d*.22,.24,1.16,.24);
    hip(T,k,0,h+1.91,0,w*.79,d*.79,1.13,color);
  }
  function bell(T,k,h){
    const profile=[[.42,0],[.48,.11],[.41,.19],[.35,.77],[.28,.90],[.10,.98]];
    const cast=new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y)),20);
    k.stamp(cast,bronze,0,h-1.1,0);cast.dispose();
    for(const y of [h-.96,h-.50,h-.28])k.tapered(bronze,0,y,0,y<h-.8?.45:.39,y<h-.8?.45:.39,.045,1,20);
    k.box(timber,0,h+.16,0,2.7,.26,.3);k.box(bronze,0,h-.04,0,.11,.35,.11);
  }
  function stoneBed(T,k,z,dinh){
    k.box(stone,0,.19,z,1.96,.38,2.38);
    k.box(shortStone,0,.44,z,2.15,.18,2.58);
    if(!dinh)return;
    // Winding relief on the slab and two raised saddle-backed dragons.
    for(const sign of [-1,1]){
      const x=sign*1.22;
      tube(T,k,[[x,.43,z-.96],[x,.72,z-.81],[x,.56,z-.37],[x,.42,z+.18],[x,.66,z+.78],[x,.8,z+.94]],.115,stone);
      k.outline([[-.19,0],[.18,.04],[.23,.24],[.04,.19],[-.08,.33],[-.15,.19]],shortStone,x-.07,.7,z+.82,.16,Math.PI/2);
    }
    const coiled=Array.from({length:22},(_,i)=>{
      const a=i*.38,rad=.77-i*.018;return [Math.cos(a)*rad,.542,z+Math.sin(a)*rad*1.16];
    });
    tube(T,k,coiled,.047,stone);
  }
  // The H-shaped Đinh sanctuary and the more compact Lê temple face their
  // respective east courts. Width, depth and orientation follow OSM ways
  // 772041809 and 772041801. Roof heights and carving profiles are reconstructed.
  function royalTemple(T,k,dinh){
    finish(k);
    const w=dinh?14:18.3,front=dinh?6:5.95;
    k.box(0xa09b84,0,.05,15.1,w+1,.18,10.2);
    hall(T,k,front,w,dinh?8.1:7.95,dinh?2.85:2.48);
    k.place(0,.25,Math.PI/2,()=>hall(T,k,0,6.0,7.9,2.59,{bays:3}));
    hall(T,k,-5.65,w,8.35,2.88);
    stoneBed(T,k,14.9,dinh);
    for(const s of [-1,1])for(let j=0;j<5;j++){
      k.tapered(stone,s*(w*.42),.21,12+j*1.42,.20,.16,.42,1,8);
    }
  }
  function thaiVi(T,k){
    finish(k);
    const f=createTempleFoundations(T,k);
    f.building(0,0,0,12.6,15.7,()=>{
      hall(T,k,4.19,12.4,7.2,2.83,{columns:stone,base:1.18});
      k.box(plaster,0,2.35,-1.15,7.88,3.05,3.5);
      k.place(0,-1.15,Math.PI/2,()=>hip(T,k,0,3.90,0,4.5,8.48,.87));
      hall(T,k,-5.32,12.65,4.98,3.07,{columns:stone,base:.83});
      A.steps(k,0,8.40,5.3,.78,6,.19,.39,shortStone);
    });
    // Square pavilion on the visitor's right, OSM w772057034.
    f.building(12.60,26.45,0,5.97,5.17,()=>{
      k.box(stone,0,.26,0,5.96,.52,5.16);
      canopy(T,k,6.4,5.8,3.3,tile);bell(T,k,3.2);
    });
  }
  function bichGate(T,k){
    // A single central arch surmounted by an open gallery. The narrow
    // flanking passages have independent roofs and masonry finials.
    const shell=0xaca99b,edge=0x817e72,oldTile=0x66675a;
    A.vaultedBay(T,k,0,0,3.8,3.55,1.12,1.83,1.65,shell,edge,stone);
    for(const s of [-1,1]){
      A.vaultedBay(T,k,s*2.92,0,2.15,2.67,.59,1.51,1.43,shell,edge,stone);
      hip(T,k,s*2.92,2.67,0,2.68,2.18,.65,oldTile);
    }
    // The open arcade is above the taller arch, leaving the central passage clear.
    hip(T,k,0,3.55,0,4.59,2.38,.58,oldTile);
    for(const x of [-1.06,0,1.06])for(const z of [-.40,.14])k.arch(shell,x,4.02,z,1.08,1.20);
    k.box(shell,0,5.23,0,3.50,.3,1.10);
    hip(T,k,0,5.37,0,4.08,2.14,.62,oldTile);
    k.box(shell,0,6.23,0,2.91,.72,.99);hip(T,k,0,6.58,0,3.68,1.73,.55,oldTile);
  }
  function bichDong(T,k){
    finish(k);
    const f=createTempleFoundations(T,k);
    // Front gate n14331564640 and stone bridge w1124351581; the temple
    // camera can then travel from the lotus pond to the mapped mountainside.
    f.building(0,0,Math.PI,8.42,2.2,()=>bichGate(T,k));
    f.fixture(h=>h(0,0),()=>{
      k.place(.77,-8.6,-.062,()=>{
        for(let i=0;i<18;i++){
          const z=(i-8.5)*.79,y=.20+.28*Math.sin(Math.PI*i/17);
          k.deck(i%4===0?stone:shortStone,0,y,z,2.47,.31,.79);
          if(i%4===1)k.box(stone,0,y-.63,z,1.72,1.2,.42);
        }
      });
    });
    f.building(-58.3,73.0,Math.PI-.025,14.95,9.89,()=>hall(T,k,0,14.63,9.62,3.7,{columns:stone}));
    // The middle sanctuary sits in a rock shelter reached from the lower court.
    f.building(-27.9,70.9,-1.68,7.85,4.1,()=>{
      hall(T,k,0,7.46,3.86,2.3,{bays:3,columns:stone});
    });
    f.building(15.2,115.6,-2.57,5.93,3.92,()=>hall(T,k,0,5.66,3.83,2.31,{bays:1,columns:stone}));
  }
  function nhatTru(T,k){
    finish(k);
    const f=createTempleFoundations(T,k);
    f.building(0,0,0,5.8,5.35,()=>{
      k.box(shortStone,0,.15,0,5.8,.3,5.35);
      canopy(T,k,6.55,6.17,4.55,0x9d6045);
      // Six fitted stone components. Historical text is not reconstructed.
      k.box(stone,0,.46,0,1.42,.32,1.42);
      k.tapered(shortStone,0,.73,0,.65,.50,.22,1,24);
      k.tapered(stone,0,2.025,0,.31,.34,2.37,1,8);
      k.tapered(shortStone,0,3.37,0,.47,.54,.32,1,8);
      k.tapered(stone,0,3.63,0,.53,.40,.20,1,8);
      const bud=new T.LatheGeometry([[.18,0],[.29,.17],[.26,.36],[.18,.52],[0,.75]].map(([r,y])=>new T.Vector2(r,y)),12);
      k.stamp(bud,shortStone,0,3.73,0);bud.dispose();
      for(const s of [-1,1])for(let i=-1;i<=1;i++)k.box(timber,i*.85,.66,s*1.64,.09,.7,.09);
      for(const s of [-1,1])k.box(timber,0,.98,s*1.64,2.65,.10,.11);
    });
    f.building(7.8,4.0,0,8.48,2.30,()=>A.tamQuan(T,k,{wCenter:3.2,wSide:2.45,depth:1.6,
      hCenter:3.55,hSide:2.61,pillars:false,wall:0xc3beb0,trim:shortStone,tile:0x93654e,ridge:ridge,eave:ridge}));
  }
  function noiLam(T,k){
    finish(k);
    k.box(stone,0,.19,0,7.7,.38,6.4);
    k.box(plaster,0,1.21,-1.67,6.9,1.93,2.69);
    hip(T,k,0,2.28,-1.66,7.56,3.43,.94);
    k.box(0x463c32,0,1.19,.38,6.75,1.65,.32);
    // Precast barrel over the stone soffit and two rows of blue-stone piers.
    const vault=[[-1.63,0],[-1.50,.26],[-1.03,.57],[-.51,.72],[0,.76],[.51,.72],[1.03,.57],[1.50,.26],[1.63,0]];
    k.outline([...vault,...vault.slice().reverse().map(([u,v])=>[u,v-.17])],0x888579,-3.57,1.95,1.76,7.14,Math.PI/2);
    for(const z of [1,2.95])for(let j=0;j<4;j++){
      const x=(j-1.5)*1.54;k.box(stone,x,1.185,z,.20,1.47,.16);
      k.box(shortStone,x,.42,z,.41,.19,.40);k.box(shortStone,x,1.94,z,.42,.15,.38);
      if(z>2){
        const points=Array.from({length:15},(_,i)=>[x+Math.sin(i*.55)*.066,.59+i*.080,z+.094]);
        tube(T,k,points,.029,shortStone);
      }
    }
    for(const z of [1,2.94])k.box(stone,0,2.00,z,7.09,.19,.38);
    A.steps(k,0,3.61,3.36,.60,3,.12,.32,stone);
  }
  let cliffMaps;
  function phuKhong(T,k){
    finish(k);
    // The front wall of the escarpment recedes behind the altar and then
    // returns above the tiles. Break the lip into vertical limestone joints.
    const rockLayers=[[-.43,-3.0],[1.8,-2.96],[4.48,-2.72],[5.63,-1.21],[6.42,1.24],[8.6,.84],[9.65,-3.88]];
    const slices=45,rows=(rockLayers.length-1)*3,positions=[],uv=[],colors=[],indices=[];
    for(let j=0;j<=rows;j++)for(let i=0;i<=slices;i++){
      const x=(i/slices-.5)*19,edge=Math.abs(x/9.5),q=Math.min(rockLayers.length-2,Math.floor(j/3)),t=j/3-q;
      const [ya,za]=rockLayers[q],[yb,zb]=rockLayers[q+1];
      const y=ya+(yb-ya)*t,z=za+(zb-za)*t,lip=1-edge**4;
      const crack=Math.max(0,Math.cos(x*3.17-.11*y))**7;
      positions.push(x+.12*Math.sin(y+i*.91),(y+.48*Math.sin(.61*x)+.16*Math.sin(i*.9-j))*(1-.68*edge**4),
        -4.1+(z+4.1)*lip-.64*crack+.25*Math.sin(1.35*x+y*.61)+.13*Math.cos(i+j*1.32));
      uv.push(x*.29,(y-.42*z)*.29);
      const light=.92-.19*crack-.13*(1-Math.abs(y-5.4)/6);
      colors.push(light*.61,light*.83,light);
      if(i<slices&&j<rows){
        const a=j*(slices+1)+i,b=a+1,c=b+slices+1,d=c-1;
        indices.push(a,b,c,a,c,d);
      }
    }
    if(!cliffMaps)cliffMaps=['color','normal'].map(channel=>{
      const map=new T.TextureLoader().load('streetscape/surfaces/cut-rock-'+channel+'.webp');
      map.wrapS=map.wrapT=T.RepeatWrapping;map.userData.sightShared=true;
      if(channel==='color')map.colorSpace=T.SRGBColorSpace;
      return map;
    });
    const g=new T.BufferGeometry();
    for(const [name,array,size] of [['position',positions,3],['color',colors,3],['uv',uv,2]])
      g.setAttribute(name,new T.Float32BufferAttribute(array,size));
    g.setIndex(indices);g.computeVertexNormals();
    const cliff=new T.Mesh(g,new T.MeshStandardMaterial({map:cliffMaps[0],normalMap:cliffMaps[1],
      normalScale:new T.Vector2(.78,.78),vertexColors:true,roughness:.96,side:T.DoubleSide}));
    cliff.castShadow=cliff.receiveShadow=true;k.group.add(cliff);
    k.box(shortStone,0,.16,0,8.3,.32,4.89);
    k.box(0x655b49,0,1.77,-1.92,7.23,3.02,.39);
    for(const s of [-1,1])k.box(plaster,s*3.55,1.76,-.13,.38,2.95,3.82);
    for(const x of [-3.48,-1.19,1.19,3.48]){
      k.box(shortStone,x,1.67,1.65,.38,2.66,.38);
      for(const y of [.49,2.88])k.box(plaster,x,y,1.65,.53,.18,.53);
    }
    k.box(timber,0,3.00,1.65,7.3,.27,.28);
    A.gabledRoof(T,k,0,3.19,0,8.28,4.8,1.56,0xa4664c,shortStone,{alongX:true,overhang:.15});
    for(const side of [-1,1]){
      k.box(plaster,side*3.95,4.73,0,.23,.55,.26);
      k.tapered(shortStone,side*3.95,5.07,0,.22,.07,.23,1,4);
    }
    const vase=new T.LatheGeometry([[.24,0],[.30,.13],[.18,.5],[.36,1.00],[.28,1.24],[.14,1.37],[.23,1.46]].map(([r,y])=>new T.Vector2(r,y)),16);
    for(const x of [-2.9,2.9]){
      k.stamp(vase,0xd9d6c4,x,.33,2.0);
      for(const [y,r] of [[.48,.29],[1.26,.35],[1.50,.31],[1.75,.20]])k.tapered(0x667889,x,y,2,r,r,.055,1,16);
    }
    vase.dispose();
    k.box(0x614c35,0,.83,-1.35,2.26,1,.79);
    // Exposed roots of the tree beside the shrine run across limestone.
    for(let i=0;i<9;i++){
      const a=(i/8-.5)*Math.PI*1.65,x=-4.7,z=-.45;
      tube(T,k,[[x,.99,z],[x+Math.cos(a)*.52,.47,z+Math.sin(a)*.52],
        [x+Math.cos(a)*1.27,.27,z+Math.sin(a)*1.27],[x+Math.cos(a)*2.42,.06,z+Math.sin(a)*2.42]],.10+(i%3)*.03,timber);
    }
    createTreeModels(T).grove(k.group,[[-4.7,-.22,-.45,10.6,11.8,.45]],false);
  }
  function vuLam(T,k){
    finish(k);
    k.deck(stone,0,.03,0,6.46,.85,6.48);
    for(const z of [-2.94,2.94])post(k,0,z,.36,3.06,.185,timber);
    canopy(T,k,8.1,8.2,3.37,0x525653);
    for(const s of [-1,1]){
      k.box(timber,s*2.83,.89,0,.14,.13,5.65);
      k.box(timber,0,.89,s*2.83,5.66,.13,.14);
      for(let j=-2;j<=2;j++){
        k.box(timber,s*2.83,.66,j,.065,.46,.065);
        k.box(timber,j,.66,s*2.83,.065,.46,.065);
        k.box(timber,j*.72,4.89,s*1.9,.12,.83,.13);
      }
    }
  }
  function vanLam(T,k){
    finish(k);
    // Riveted, open rowing boats moored bow-in around the curve of the quay.
    const hull=new T.SphereGeometry(1,18,6,0,Math.PI*2,Math.PI/2,Math.PI/2);
    const inner=hull.clone(),idx=inner.index.array;
    for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
    inner.computeVertexNormals();
    for(let i=0;i<17;i++){
      const a=(i-8)*.048,x=Math.sin(a)*30,z=Math.cos(a)*30-30;
      k.place(x,z,a,()=>{
        k.stamp(hull,0x5a706a,0,.15,0,.77,.56,2.75);
        k.stamp(inner,0x8c9994,0,.15,0,.72,.52,2.65);
        for(const v of [-1.13,0,1.15])k.box(0x977b5b,0,.10,v,1.14,.09,.25);
        k.box(0x907552,-.26,.2,.21,.061,.061,2.55,.21);
        k.box(0xc66f3c,.22,.18,-.87,.38,.12,.61,.10);
      });
    }
    inner.dispose();hull.dispose();
  }
  // Georeferencing: OpenStreetMap contributors (ODbL). Local metres use +Z
  // towards the façade. View offsets are converted to world east and south.
  function add(id,ref,name,lon,lat,start,yaw,width,depth,options,build){
    const views=options.views.map(([name,x,z,height,viewRadius,angle,elevation])=>({
      name,offset:[x*Math.cos(yaw)+z*Math.sin(yaw),z*Math.cos(yaw)-x*Math.sin(yaw)],
      height,viewRadius,viewAngle:yaw+angle,viewElevation:elevation
    }));
    (window.VietnamSights??=[]).push({id,catalogId:'osm-'+ref.replace('/','-'),name,lon,lat,start,yaw,width,depth,
      city:'Hoa Lư',province:'Ninh Bình',region:'Bắc Bộ',kind:'Di tích',visitOnArrival:true,
      map:'https://www.openstreetmap.org/'+ref,photo:options.source,...options,views,build});
  }
  const royal='https://vhtt.ninhbinh.gov.vn/vi/tuyen-truyen-phat-trien-du-lich/gia-tri-van-hoa-lich-su-den-vua-dinh-den-vua-le-2138.html';
  add('den-vua-dinh-tien-hoang','way/772041809','Đền vua Đinh Tiên Hoàng',105.905137,20.284612,[105.90633,20.28466],1.20,14.3,20.3,{
    source:royal,solids:[[0,6,7,3.9],[0,-5.6,7,4.3],[0,0,4,1.8],[0,14.9,1.33,1.32]],
    description:'Qua sân rồng là bái đường năm gian và dãy mái nối tới chính cung. Đôi rồng đá chầu hai bên long sàng trước thềm.',
    views:[['Ba tòa điện',0,2,5,34,.38,.43],['Long sàng trước bái đường',0,14.9,1.52,5.3,.47,.30]]
  },(T,k)=>royalTemple(T,k,true));
  add('den-vua-le-dai-hanh','way/772041801','Đền vua Lê Đại Hành',105.905724,20.286169,[105.906704,20.286083],1.30,18.5,20.8,{
    source:royal,solids:[[0,0,9.12,10.23],[0,14.9,1.12,1.29]],
    description:'Mái bái đường thấp che hàng cửa gỗ phía sân rồng. Nếp thiêu hương nối gian giữa với chính cung ở cuối trục thờ.',
    views:[['Từ sân rồng',0,5,5.5,24,.20,.18],['Trục bái đường và chính cung',0,0,4.5,31,1.05,.58]]
  },(T,k)=>royalTemple(T,k,false));
  add('den-thai-vi','way/772057039','Đền Thái Vi',105.929928,20.224229,[105.93014,20.22405],-.315,13.1,16.2,{
    source:'https://dulichninhbinh.com.vn/item/3019',modeledBuildings:['w772057034'],solids:[[0,0,6.1,7.8],[12.60,26.45,2.45,2.2]],
    description:'Sáu cột đá xanh chia mặt trước thành năm gian. Gác chuông tám mái nằm bên phải sân khi từ nghi môn bước vào.',
    views:[['Ngũ đại môn',0,4,5,20,.22,.19],['Gác chuông',12.60,26.45,5.8,12,-.41,.23]]
  },thaiVi);
  add('chua-bich-dong','node/1540779110','Chùa Bích Động',105.9162531,20.2179158,[105.91629,20.21836],0,8.6,4.2,{
    source:'https://dulichninhbinh.com.vn/item/2843',modeledBuildings:['w1204188515','w1204188517'],
    solids:[[-3.92,0,.25,.84],[-1.66,0,.43,.84],[1.66,0,.43,.84],[3.92,0,.25,.84],[-58.3,73,7.4,4.8],[-27.9,70.9,1.86,3.75],[15.2,115.6,2.65,1.67]],
    description:'Qua cầu đá trên hồ sen là tam quan. Chùa Hạ nằm dưới chân núi, chùa Trung tựa vào hang đá và chùa Thượng ở cao hơn trên sườn núi.',
    views:[['Cầu đá và tam quan',0,-1.0,6.0,21.5,3.03,.16],['Chùa Hạ',-58.3,73,5.8,21,2.92,.24],
      ['Chùa Trung',-27.9,70.9,4.7,12,-1.8,.20],['Chùa Thượng',15.2,115.6,4.2,11.2,-2.61,.23]]
  },bichDong);
  add('chua-nhat-tru-hoa-lu','node/4424766405','Chùa Nhất Trụ',105.907538,20.287919,[105.90742,20.28785],-Math.PI/2,6.1,5.65,{
    source:'https://vhtt.ninhbinh.gov.vn/vi/di-san-van-hoa/chua-nhat-tru-1112.html',solids:[[0,0,.73,.73],[9.37,4,.39,.8],[6.23,4,.39,.8]],
    description:'Sau tam quan hướng tây có lầu tám mái che cột kinh Phật. Thân cột đá bát giác cao 2,37 m, trên đỉnh là khối đá hình búp sen.',
    views:[['Lầu che cột kinh',0,0,6,12,-.32,.18],['Cột kinh bát giác',0,0,4.4,3.0,.32,.12],['Tam quan',7.8,4,5.7,12,.12,.19]]
  },nhatTru);
  add('den-tran-noi-lam','node/4738232630','Đền Trần (Đền Nội Lâm)',105.898585,20.255215,[105.911682,20.262417],2.76,7.9,7.5,{
    source:'https://sodulich.ninhbinh.gov.vn/vi/tai-nguyen-du-lich-van-hoa/den-tran-113.html',solids:[[0,-.76,3.48,2.31]],
    description:'Trước hai tòa đền xếp song song là bốn cột đá xanh chạm nổi. Mái cuốn vòm của tiền bái phủ lên hàng cột thấp.',
    views:[['Tiền bái và hậu cung',0,0,3.6,12,.29,.23],['Hàng cột đá',0,2.83,2.55,4.3,.20,.10]]
  },noiLam);
  add('phu-khong-trang-an','node/13388919549','Phủ Khống',105.90449,20.268143,[105.90966,20.26743],-.52,9.0,5.3,{
    source:'https://vietnamtourism.vn/index.php/tourism/items/2567/',solids:[[0,-.27,3.61,1.94],[-4.7,-.45,.55,.60]],
    description:'Mái ngói thấp của phủ nằm bên cây thị cổ thụ. Rễ cây nổi trên nền đá ngay cạnh hàng cột hiên.',
    views:[['Hiên phủ và cây thị',-1.17,0,6.2,15,.36,.18],['Bộ rễ trên đá',-4.7,-.45,2.8,5.7,-.37,.22]]
  },phuKhong);
  add('hanh-cung-vu-lam','way/1424042953','Hành cung Vũ Lâm',105.913411,20.247191,[105.91906,20.24456],-.35,8.7,8.2,{
    source:'https://baoquangngai.vn/media/emagazine/202502/emagazine-du-ngoan-mien-co-tich-ninh-binh-a3d1866/',solids:[],
    description:'Thủy đình nằm riêng giữa mặt nước trước cụm thờ tự. Có thể nhìn xuyên qua hàng cột dưới hai lớp mái cong từ phía thuyền chèo.',
    views:[['Thủy đình giữa dòng',0,0,6.1,17,.31,.14],['Hai tầng mái và hàng cột',0,0,6.5,10.5,-.54,.21]]
  },vuLam);
  add('ben-thuyen-tam-coc','node/4567308091','Bến thuyền Tam Cốc (bến Văn Lâm)',105.937335,20.21637,[105.937727,20.216519],-1.15,29,8.5,{
    source:'https://dulichninhbinh.com.vn/item/1115',kind:'Bến thuyền',solids:[],
    description:'Dãy thuyền chèo neo ở mép bến Văn Lâm. Từ bến, dòng Ngô Đồng dẫn vào những cánh đồng và ba hang của Tam Cốc.',
    views:[['Thuyền ven bến Văn Lâm',0,0,1.5,24,2.82,.46],['Mũi thuyền và mái chèo',0,0,1.0,6.0,-.64,.32]]
  },vanLam);
})();
