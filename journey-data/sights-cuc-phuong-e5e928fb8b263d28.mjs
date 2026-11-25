const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const sights=window.VietnamSights??=[],atlas=globalThis.VietnamTourism,K=globalThis.VietnamKarst,A=globalThis.CentralArch;
  const park='https://dulichcucphuong.com.vn/',bongSource=park+'khu-trung-tam-rung-trung-tam-bong/';
  const bong=[105.5980213,20.3482787]; // Service lane inside the mapped surface car park, w201095360.
  const caveRoad=[105.6669006,20.2930152]; // Junction of the forest road and w160491127.
  const tau=2*Math.PI;
  function stop(id,d,build){
    const s=atlas.byId?.get(id)??atlas.entries.find(e=>e.id===id),{shots,...data}=d;
    const c=Math.cos(d.yaw),a=Math.sin(d.yaw);
    const views=shots.map(([name,u,v,height,viewRadius,angle,viewElevation,groundView])=>({
      name,height,viewRadius,viewAngle:d.yaw+angle,viewElevation,offset:[u*c+v*a,-u*a+v*c],
      ...(groundView?{caveOpening:null}:{})}));
    sights.push({province:'Ninh Bình',city:'Cúc Phương',locality:'Vườn quốc gia Cúc Phương',region:'Bắc Bộ',
      ...s,...data,id,catalogId:id,views,build,photo:d.photo??d.source,solids:d.solids??[],
      visitOnArrival:true,mappedEntrance:true,approachMeters:undefined,map:'https://www.openstreetmap.org/'+id.slice(4).replace('-','/')});
  }
  function gable(T,kit,x,y,z,w,d,h,cladding,roof,ridge,along=false){
    const p=[[-w/2,0],[w/2,0],[0,h]];
    const build=()=>{
      kit.outline(p,cladding,0,y,-d*.5,d);
      A.gabledRoof(T,kit,0,y+.03,0,w,d,h,roof,ridge,{overhang:.34,thick:.13});
    };
    kit.place(x,z,along?Math.PI/2:0,build);
  }
  function steps(kit,x,z,w,h,n,run,tint){
    for(let i=0;i<n;i++){
      const v=h*(n-i)/n;kit.box(tint,x,v*.5,z+(i+.5)*run/n,w,v,run/n+.015);
    }
  }
  function clipping(T,kit,x,z,h,r){
    const green=[0x4d6b35,0x59783a,0x648344],cut=new T.SphereGeometry(1,16,7,0,tau,0,Math.PI*.67);
    kit.stamp(kit.round,0x685b46,x,h*.28,z,.11,h*.56,.11);
    for(let i=0;i<3;i++)kit.stamp(cut,green[i],x,h*(.28+i*.22),z,r*(1-i*.23),h*(.28-i*.051),r*(1-i*.23));
    cut.dispose();
  }
  stop('osm-way-481782794',{name:'Trung tâm Du khách Cúc Phương',kind:'Tham quan',lon:105.71523485,lat:20.250134,yaw:.312,
    width:31.2,depth:23.2,solids:[[0,-1.3,14.9,8.3]],start:[105.7151857,20.249829],source:park+'khu-khu-cong-vuon/',
    description:'Mái xám dài ôm lấy mái sảnh nhô ra giữa nhà. Trên mặt hồi xanh có tên Trung tâm Du khách và hình tán rừng. Hai bên bậc vào là vườn cây cắt tỉa.',
    arrivalNote:'Xe dừng trên đường vào cổng Vườn. Lối vào Trung tâm Du khách ở phía bắc đường.',
    shots:[['Mái sảnh xanh ở cổng Vườn',0,5,11.9,26,.18,.13],['Hàng cột dưới mặt hồi',0,9,8.4,13,-.44,.09]]},
  (T,kit)=>{
    const {box}=kit,wall=0xdad9be,roof=0x898f92,trim=0x777e78,green=0x4b765c,warm=0x8f907c;
    kit.palette({stone:[warm,trim],plaster:[wall,green]});
    box(warm,0,.45,0,29.9,.9,20.5);
    box(wall,0,3.06,-1.35,29.3,4.36,16.9);
    gable(T,kit,0,5.18,-1.20,18.6,29.9,3.69,wall,roof,trim,true);
    for(const x of [-11,-7.2,7.2,11]){box(0x657777,x,3.04,7.16,2.45,2.38,.10);box(wall,x,3.04,7.23,.11,2.4,.12);}
    box(0x444c46,0,2.49,7.18,4.40,3.50,.14);
    box(trim,0,1.01,8.58,14.2,.22,5.14);
    for(const x of [-6.48,6.48])for(const z of [6.9,10.72]){
      box(wall,x,2.98,z,.30,4.02,.30);box(trim,x,1.13,z,.51,.35,.51);
    }
    gable(T,kit,0,5.42,6.83,14.2,8.05,3.49,green,roof,trim);
    kit.sign('TRUNG TÂM DU KHÁCH',0,7.27,10.89,7.2,.67,true);
    kit.sign('VISITOR CENTRE',0,6.82,10.90,3.85,.33,true);
    const treeline=[[-6.9,0],[6.9,0],[6.44,.48],[5.91,.44],[5.6,.64],[5.12,.63],[4.54,.86],[4.17,.72],[3.75,.87],[3.32,.82],[2.88,1.04],[2.52,1.10],[2.03,.86],[1.72,1.01],[1.17,.85],[.75,.94],[.25,.64],[-.05,.73],[-.44,.58],[-.79,.65],[-1.27,.48],[-1.88,.57],[-2.29,.42],[-2.74,.52],[-3.20,.37],[-3.5,.41],[-4.26,.32],[-4.60,.43],[-5.25,.26],[-6.10,.31]];
    kit.outline(treeline,0x729773,0,5.45,10.89,.018);
    steps(kit,0,11.12,5.55,1.07,7,2.48,warm);
    for(const x of [-12.3,-8.4,-5.7,5.7,8.7,12])clipping(T,kit,x,13.85,Math.abs(x)>11?2.65:1.98,1.05);
    for(const x of [-3.99,3.99])clipping(T,kit,x,11.81,2.32,.91);
  });

  const macOutline=[[-50,69],[-68,58],[-96,34],[-113,9],[-145,-53],[-176,-115],[-175,-119],[-165,-126],[-149,-133],[-135,-127],[-111,-107],[-71,-68],[-48,-41],[-26,-33],[-13,-30],[-3,-26],[3,-26],[24,-28],[33,-26],[45,-37],[55,-43],[66,-39],[81,-27],[82,-19],[70,-17],[67,-6],[67,7],[72,15],[76,24],[80,34],[87,42],[90,51],[77,55],[66,57],[52,60],[41,55],[31,53],[18,54],[8,56],[2,60],[-4,68],[-9,68],[-28,69]];
  const macRoads=[
    [[-145,-143],[-105,-113],[-69,-72],[-49,-51],[-25,-39],[-2,-37],[17,-39],[31,-48],[43,-52],[68,-45],[87,-26],[95,-5],[105,22],[114,52],[95,57],[68,66],[45,72],[30,75],[16,78],[-2,83],[-13,86],[-15,89],[-18,96],[-19,120]],
    [[116,242],[66,200],[-19,120],[-79,74],[-130,29],[-196,-120],[-229,-180]]];
  function segmentDistanceSq(x,z,[ax,az],[bx,bz]){
    const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
    return (x-ax-t*dx)**2+(z-az-t*dz)**2;
  }
  function inLake(x,z,padding){
    if(x<-177-padding||x>91+padding||z<-134-padding||z>70+padding)return false;
    let inside=false;
    for(let i=0,j=macOutline.length-1;i<macOutline.length;j=i++){
      const [ax,az]=macOutline[j],[bx,bz]=macOutline[i],dx=bx-ax,dz=bz-az;
      if((az>z)!==(bz>z)&&x<ax+dx*(z-az)/dz)inside=!inside;
      if(segmentDistanceSq(x,z,macOutline[j],macOutline[i])<padding*padding)return true;
    }
    return inside;
  }
  function lakesideGround(kit){
    const parts=[],groves=[];
    function place(x,z,yaw,build){
      const first=kit.vertexCount();kit.place(x,z,yaw,build);parts.push([x,z,first,kit.vertexCount()]);
    }
    function plant(T,rows){
      const first=kit.group.children.length;globalThis.createTreeModels(T).grove(kit.group,rows);
      for(const mesh of kit.group.children.slice(first))groves.push([mesh,mesh.instanceMatrix.array.slice()]);
    }
    let rest;
    kit.group.userData.fitGround=ground=>{
      const g=kit.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;if(!g)return;
      const p=g.attributes.position;rest??=p.array.slice();
      for(const [x,z,from,to] of parts){
        const bed=ground(x,z);
        for(let i=from;i<to;i++){
          const y=rest[i*3+1];p.setY(i,y<.012?Math.min(bed+y,ground(rest[i*3],rest[i*3+2])-.12):bed+y);
        }
      }
      p.needsUpdate=true;g.computeBoundingSphere();g.computeBoundingBox();
      for(const [m,poses] of groves){
        for(let k=12;k<poses.length;k+=16)m.instanceMatrix.array[k+1]=poses[k+1]+ground(poses[k],poses[k+2]);
        m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
      }
    };
    return {place,plant};
  }
  // The engine already draws Hồ Mạc from its water tile. Keep its reflections
  // and real shore level, then place the photographed timber hall on w1190294378.
  stop('osm-way-201095352',{name:'Hồ Mạc',kind:'Hồ',lon:105.7087,lat:20.2574,yaw:0,width:267,depth:204,
    boundary:macOutline,modeledBuildings:['w1190294378'],reserve:inLake,gardenRadius:28,foundationAt:[55,103],
    start:[105.708681,20.2566519],source:park+'khu-ho-mac/',solids:[[55,104,7.45,11.5]],
    description:'Mặt hồ uốn từ bờ nhà sàn lên một nhánh hẹp giữa hai sườn rừng. Phía nam có đường ven hồ và khu nhà nghỉ mái ngói của Vườn.',
    arrivalNote:'Xe dừng trên đường ven hồ phía nam, gần lối vào khu dịch vụ Hồ Mạc.',
    shots:[['Nhà sàn và bờ nam',38,67,12,86,-2.61,.12],['Nhà sàn nhìn qua hàng hiên',54.8,95.3,11.7,32,-2.59,.16],
      ['Nhánh hồ giữa hai sườn rừng',-46,-22,20,137,.85,.35]]},
  (T,kit)=>{
    const {box}=kit,wood=0x70533f,stone=0x968d76,tile=0xb37657;
    kit.palette({timber:[wood,0x815a42],stone,tile});
    const shore=lakesideGround(kit);
    shore.place(55,103.8,-.335,()=>{
      box(wood,0,2.84,0,14.6,.34,22.45);
      for(const x of [-6.7,6.7])for(const z of [-10.4,-5.2,0,5.2,10.4]){
        box(wood,x,3.85,z,.41,7.7,.41);box(stone,x,.20,z,.6,.4,.6);
      }
      for(const z of [-10.45,10.45])for(const x of [-2.24,2.24])box(wood,x,3.83,z,.41,7.67,.41);
      box(wood,0,4.55,2.2,11.2,3.18,12.9);
      for(const side of [-1,1]){
        for(const y of [3.29,4.14])box(wood,side*7.11,y,0,.12,.13,22.42);
        for(let j=0;j<48;j++)box(0x815a42,side*7.11,3.72,-10.83+j*.46,.067,.79,.067);
        for(const y of [3.29,4.14])box(wood,side*4.34,y,-10.91,5.57,.13,.12);
      }
      const hip=[
        [[-8.15,-12.08],[8.15,-12.08],[0,-4.10]],
        [[8.15,-12.08],[8.15,12.08],[0,4.10],[0,-4.10]],
        [[8.15,12.08],[-8.15,12.08],[0,4.10]],
        [[-8.15,12.08],[-8.15,-12.08],[0,-4.10],[0,4.10]]];
      for(const side of hip){
        const v=side.flatMap(([x,z],i)=>[x,i<2?7.16:11.15,z]),g=new T.BufferGeometry();
        g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(side.length===3?[0,2,1]:[0,2,1,0,3,2]);g.computeVertexNormals();
        if(g.attributes.normal.getY(0)<0){const a=g.index.array;for(let j=0;j<a.length;j+=3)[a[j+1],a[j+2]]=[a[j+2],a[j+1]];g.computeVertexNormals();}
        kit.stamp(g,tile,0,0,0);g.dispose();
      }
      box(0xa16c51,0,11.20,0,.20,.16,8.49);
      for(let j=0;j<16;j++)box(wood,0,.27+j*.17,-15.45+j*.275,2.01,.14,.32);
    });
    // The small red roofs lie under the trees in the park's lakeside photographs
    // and in the aerial image, on the landward side of its shore road.
    for(const [x,z,a] of [[36,79,-2.71],[74,75,-2.67],[19,106,-2.40]])shore.place(x,z,a,()=>{
      for(const u of [-2.81,2.81])for(const v of [-3.1,2])box(stone,u,.45,v,.38,.93,.38);
      box(0xd7cdb5,0,2.34,-.70,6.24,2.99,5.86);box(stone,0,.88,.15,6.63,.24,8.42);
      box(0x5f5241,.23,1.96,2.28,1.35,2.11,.10);
      for(const u of [-2.84,2.84])box(0xcabfa9,u,2.60,3.67,.27,3.62,.27);
      gable(T,kit,0,3.93,0,6.64,8.87,2.3,0xe1d8c0,0xa15f48,0xb68a70);
      steps(kit,0,4.28,2.12,1.0,5,1.32,stone);
    });
    const trees=[];
    for(let i=0;i<550;i++){
      const x=-201+((i+.37)*.75487767%1)*404,z=-167+((i+.62)*.56984029%1)*336;
      if(inLake(x,z,3)||z>47&&z<138&&x>-44&&x<97)continue;
      if(macRoads.some(line=>line.some((p,j)=>j&&segmentDistanceSq(x,z,line[j-1],p)<6.6**2)))continue;
      const h=8.5+(i*.3137%1)*9.6;trees.push([x,-.25,z,5.1+(i*.817%1)*5.9,h,i*2.4]);
    }
    for(const [x,z] of [[18,88],[80,90],[4,106],[71,101],[29,118],[87,69]])trees.push([x,-.2,z,5.5,10.9,x]);
    shore.plant(T,trees);
  });

  function trail(kit,points,w,color,step=false){
    for(let j=1;j<points.length;j++){
      const [ax,az]=points[j-1],[bx,bz]=points[j],dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz),n=Math.max(1,Math.ceil(len/(step?.43:2.0)));
      for(let i=0;i<n;i++){
        const t=(i+.5)/n,angle=Math.atan2(dx,dz);
        kit.box(step&&i%6===2?0x948b75:color,ax+dx*t,step?.125:.04,az+dz*t,w+(step?.08*Math.sin(j+i):0),step?.36:.10,len/n+.018,angle);
      }
    }
  }
  function woodland(r,points){
    for(const [x,z,w,h,a] of points)r.trees.push([x,-.08,z,w,h,a]);
  }
  function understory(rock,n,rx,rz,clear){
    for(let i=0;i<n;i++){
      const x=(.12+((i*.618034+.37)%1)*.88)*rx*Math.cos(i*2.39996),z=(.13+((i*.41421+.17)%1)*.87)*rz*Math.sin(i*2.39996);
      if(clear(x,z))continue;
      rock.ferns.push([x,.05,z,.57+(i*.811%1)*1.24,i*2.40]);
    }
  }
  function bridge(T,kit,points){
    const stone=0xaea38d,cap=0xb8ad97;kit.palette({stone:[stone,cap]});
    for(let j=1;j<points.length;j++){
      const [x,z]=points[j-1],[bx,bz]=points[j],dx=bx-x,dz=bz-z,l=Math.hypot(dx,dz),n=Math.ceil(l/2.30),a=Math.atan2(dx,dz);
      for(let i=0;i<n;i++){
        const t=(i+.5)/n,px=x+t*dx,pz=z+t*dz;
        kit.box(stone,px,1.43,pz,1.97,.32,l/n+.02,a);
        for(const side of [-1,1]){
          const xx=px+side*.92*dz/l,zz=pz-side*.92*dx/l;
          kit.box(cap,xx,2.49,zz,.13,.12,l/n+.03,a);kit.box(stone,xx,1.99,zz,.09,.11,l/n+.03,a);
          if(j===1||i)kit.box(stone,xx,2.02,zz,.13,1.07,.13,a);
          if(i%3===0)kit.box(stone,xx,.27,zz,.35,2.19,.39,a);
        }
      }
    }
  }
  const stairNguoi=[[18.9,35.2],[22.9,7.8],[17.3,-5.1],[2.8,.6],[0,1.1]];
  const bridgeNguoi=[[-52.5,114.3],[-35.4,65],[.2,56.6],[17.2,45.3],[18.9,35.2]];
  const nguoiSections=[[0,0,5.1,7.55,.54],[4,.2,6.50,7.1,.62],[10,.8,5.2,5.30,.65],[15,1,1.95,3.01,.36],[21,2.1,3.11,3.52,.32],[27,3,2.31,2.54,.35]];
  const palaceSections=[[0,0,4.1,5.8,.7],[6,-.4,5.6,8.3,.7],[12,-.74,6.45,12.8,.65],[19,-1.15,6.6,11.4,.64],[27,-1.65,5.9,7.5,.6],[31,-1.87,4.23,5.4,.7]];
  function caveGrade(sections){
    return (ground,x,z)=>{
      const d=-z,last=sections.at(-1),j=sections.findIndex(q=>q[0]>=d);
      const a=j<0?last:sections[Math.max(0,j-1)],b=j<0?last:sections[j];
      const t=b===a?0:Math.max(0,Math.min(1,(d-a[0])/(b[0]-a[0]))),cx=a[1]+t*(b[1]-a[1]),w=a[2]+t*(b[2]-a[2]);
      const edge=Math.max(0,Math.abs(x-cx)-w-1.6,(z-.65)*1.85,d-last[0]),mix=Math.min(1,edge/8.3);
      return ground(x,z)*mix*mix*(3-2*mix);
    };
  }
  function caveFloor(rock,sections){
    // The terrain cut is fractionally wider than the arch. Carry compacted
    // earth underneath both jambs and out to the grade of the final steps.
    for(let i=1;i<sections.length;i++){
      const a=sections[i-1],b=sections[i];
      rock.grid(18,4,(u,v)=>{
        const x=a[1]+(b[1]-a[1])*v+(u*2-1)*((a[2]+(b[2]-a[2])*v)*1.18+.61);
        return [x,a[4]+(b[4]-a[4])*v-.19,-a[0]-(b[0]-a[0])*v,0x897f67,.51+.12*Math.cos(x*.7)];
      });
    }
    const [,,width,,level]=sections[0];
    rock.grid(23,13,(u,v)=>{
      const across=u*2-1,x=across*(width*1.17+.75+v*.45),
        z=-.1+v*(4.77+.46*Math.sin(u*11)+.63*Math.cos(u*7));
      const skirt=.77*v**2+.47*Math.max(0,(Math.abs(across)-.89)/.11);
      return [x,level*(1-v)**1.4-.06-skirt+.048*Math.sin(x*1.6+v*7),z,0x948872,.78+.13*Math.sin(x*1.3-v*9)];
    });
  }
  stop('osm-node-1725481657',{name:'Động Người Xưa (hang Đắng)',kind:'Hang động',yaw:-.79,width:45,depth:50,start:caveRoad,
    caveOpening:{sections:nguoiSections,approach:2.1},
    source:'https://vhtt.ninhbinh.gov.vn/vi/tuyen-truyen-phat-trien-du-lich/dong-nguoi-xua-dam-dau-an-thoi-tien-su-2162.html',
    description:'Lối qua cầu bê tông bẻ góc ở chân núi rồi lên các bậc đá. Cửa động quay về tây nam, ngăn trước đón ánh sáng. Sau đoạn thắt là các vách tối có nhũ đá. Đây là di chỉ cư trú và mộ táng của người tiền sử.',
    arrivalNote:'Xe dừng ở đầu đường đi bộ trên tuyến đường rừng. Hai góc tiếp cận theo cầu và bậc thang đã được lập bản đồ.',
    shots:[['Cửa hang trên vách đá vôi',0,.1,10.7,24,.08,.13],['Lối cầu dưới chân núi',-19.2,60.1,7.4,35,-1.12,.20,true],['Ngăn sáng dưới vòm cửa',.4,-1.5,7.2,7.7,-.25,.09]]},
  (T,kit)=>{
    const rock=K.batch(T);
    K.grotto(rock,nguoiSections,19.3,19.9,1.21);caveFloor(rock,nguoiSections);
    for(let j=0;j<12;j++){
      const a=.32+j*.51;K.boulder(rock,Math.cos(a)*8.15,.08,2.4+Math.sin(a)*4.0,1.05+j%3*.52,.77+j%4*.32,.89+j%2*.60,a,j%3!==1);
    }
    trail(kit,stairNguoi,1.54,0xaca18c,true);bridge(T,kit,bridgeNguoi);
    woodland(rock,[[-11,12,6,15,3],[15,19,5,15,4],[-20,41,7,19,2],[7,83,6,18,0],[17,61,6.4,19,2],[-35,83,6,21,1],[-46,48,7,18,0]]);
    understory(rock,110,31,41,(x,z)=>Math.abs(x)<7&&z<10);
    K.finish(T,kit,rock,caveGrade(nguoiSections));
  });
  const palaceSteps=[[-94.8,-70.8],[-83.1,-62.4],[-78.8,-34],[-40.2,-24.2],[-26.1,-9.7],[-19,22.7],[.1,35.7],[0,1.1]];
  // Loft an actual opening through both layers of the chamber roof. Its uneven
  // rim admits daylight into the front hall pictured by the park.
  function palaceChamber(rock){
    function opening(t){
      const width=t>.19&&t<.61?.121*Math.sin(Math.PI*(t-.19)/.42)**.59:0;
      const mid=.49+.032*Math.sin(t*12);return [mid-width,mid+width];
    }
    function shell(u,t,outer){
      const a=u*Math.PI,d=t*31,span=4.1+2.44*Math.sin(t*Math.PI)**.77+.33*Math.sin(t*17),
        high=5.1+3.57*Math.sin(t*Math.PI)**.74+.47*Math.sin(6.1*t),
        curve=.14*Math.sin(a*8+t*7)+.215*Math.sin(a*5.6-t*8.3);
      return [-1.87*t+(span+(outer?1.52:0))*Math.cos(a),
        .70+(high+curve+(outer?2.15+.65*Math.sin(t*8):0))*Math.sin(a)**.72,
        -d+.27*Math.sin(a*6.1+t*17)];
    }
    for(const outer of [false,true])for(const side of [0,1])rock.grid(35,46,(u,t)=>{
      const [a,b]=opening(t),w=side?b+u*(1-b):a*u,p=shell(w,t,outer);
      const recess=Math.min(1,Math.max(0,1-t*3.3)),light=.35+.46*recess+.22*Math.sin(t*Math.PI);
      return [...p,outer?0x848171:0xa69a80,outer?.91:light+.087*Math.sin(p[0]*3.2+p[1]*1.6)];
    });
    for(const side of [0,1])rock.grid(31,5,(u,v)=>{
      const t=.19+u*.42,w=opening(t)[side],lo=shell(w,t,false),hi=shell(w,t,true);
      return [...lo.map((n,k)=>n+v*(hi[k]-n)),0xa99f87,.67+.28*v];
    });
    rock.grid(44,7,(u,v)=>{
      const a=shell(u,0,false),b=shell(u,0,true),flute=Math.sin(u*23+v*.6);
      return [a[0]+v*(b[0]-a[0]),a[1]+v*(b[1]-a[1]),
        a[2]+.37*Math.sin(Math.PI*v)+.11*flute,0xa69d8b,.80+.10*flute];
    });
    rock.grid(26,35,(u,t)=>{
      const l=shell(1,t,false),r=shell(0,t,false),beam=Math.exp(-((t-.36)**2/.012+(u-.56)**2/.043));
      return [l[0]+u*(r[0]-l[0]),.67+.18*Math.sin(u*8+t*7),-t*31,0xab997b,.38+.48*beam+.13*(1-t)];
    });
    rock.grid(34,7,(u,v)=>{const [x,y,z]=shell(u,1,false);return [x,.58+(y-.58)*v,z,0x524d42,.52];});
    function wing(side,u,t){
      const angle=.22+.026*Math.sin(t*8+side),lip=shell(side<0?1-angle:angle,t,true);
      const edge=12.2+3.1*Math.sin(t*7+side),mass=.73*Math.sin(u*9+t*19+side)*Math.sin(u*Math.PI);
      return [lip[0]+side*(u*edge-.43),-.26+(lip[1]+.45)*(1-u)**.80+mass,lip[2]+.15];
    }
    for(const side of [-1,1])rock.grid(23,39,(u,v)=>[...wing(side,u,v),0x858974,.80+.12*v]);
    for(let j=0;j<23;j++){
      const side=j%2?1:-1,[x,y,z]=wing(side,.18+(j*.414%1)*.62,j*.619%1);
      rock.trees.push([x,y-.09,z,4.3,5.9+(j*.731%1)*3.9,j]);
    }
    for(let j=0;j<28;j++)rock.ferns.push([(j%2?1:-1)*(6.9+(j*.614%1)*4.1),1.03+(j*.63%1)*2,-(j*.382%1)*27,1.01,j*2.11]);
  }
  stop('osm-node-1995508763',{name:'Động Sơn Cung',kind:'Hang động',yaw:1.09,width:49,depth:61,start:bong,source:bongSource,
    caveOpening:{sections:palaceSections,approach:2},
    description:'Trên vòng đường mòn cây chò ngàn năm, một nhánh bậc đá dẫn lên động Sơn Cung. Khoảng sáng trên vòm dọi xuống nền đá lổn nhổn, bên cạnh những dải nhũ rủ trong bóng tối.',
    arrivalNote:'Xe ở bãi Bống. Từ đường mòn cây chò, nhánh bậc đi bộ vòng lên cửa động.',
    shots:[['Giếng sáng trên vòm Sơn Cung',-.5,-11.2,15.2,7.55,-.11,-.23],['Rèm nhũ bên ngăn đầu',-3.44,-8.3,9.1,6.8,.48,-.085],['Những bậc cuối trước cửa động',.2,8,8.8,17,.29,.20,true]]},
  (T,kit)=>{
    const rock=K.batch(T);palaceChamber(rock);caveFloor(rock,palaceSections);
    for(let j=0;j<3;j++)rock.grid(62,19,(u,v)=>{
      const z=-5.69-3.32*j-u*3.67,fold=Math.sin(u*30+j*2.1),ribs=.26*Math.sin(u*75+v*.42);
      const fringe=2.19+.52*fold+.37*Math.cos(u*21+j)+.52*j;
      const x=-4.31-.30*j+.45*Math.sin(u*4+j)+v*.32+.25*fold+ribs*(.68+.32*v);
      return [x,fringe+(7.28-fringe)*v,z,0xb7a68c,.67+.20*v+.10*fold+.06*Math.cos(u*75)];
    });
    for(let j=0;j<18;j++){
      const x=-4.6+(j%6)*.32,z=-2.7-Math.floor(j/6)*1.45-.39*Math.sin(j),tip=2.32+(j*.57%1)*1.79;
      rock.grid(12,7,(u,v)=>{const a=u*tau,r=(.12+.10*(j%3))*(.06+.94*v)**.73*(1+.14*Math.sin(a*5));return [x+r*Math.cos(a),tip+v*(6.86-tip),z+r*Math.sin(a),0xaea189,.66+.20*v];});
    }
    for(let i=0;i<10;i++)K.boulder(rock,-3+Math.cos(i*2.41)*3.2,.61,-3.3-Math.sin(i*1.35)*2.6,.57+i%2*.45,.6+i%3*.35,.62,i+.51);
    trail(kit,palaceSteps,1.19,0xa09781,true);
    woodland(rock,[[-12,18,7.1,17,2],[12,25,6.1,20,1],[-16,4,7.8,17,0],[15,9,6.4,13,3]]);
    understory(rock,100,30,37,(x,z)=>z<8&&Math.abs(x)<6);K.finish(T,kit,rock,caveGrade(palaceSections));
  });

  // The forest giants have different bark, buttresses, branching and crowns.
  // The dead chò keeps the open, broken ends recorded in Hữu Nghị's photographs.
  const {bark,limb,buttress,crowns}=globalThis.VietnamForestGiants;
  function nearForest(rock,live){
    for(let i=0;i<40;i++){
      const a=i*2.399963,r=14.2+(i*.414213%1)*25;
      const x=Math.cos(a)*r,z=Math.sin(a)*r;
      if(live?(z>2&&Math.abs(x)<12):(z<0&&Math.abs(x)<14))continue;
      const h=14.3+(i*.19237%1)*13.5;rock.trees.push([x,-.10,z,4.4+(i*.183%1)*4.3,h,a]);
    }
  }
  stop('osm-node-1995508761',{name:'Cây Chò ngàn năm',kind:'Tham quan',lon:105.598695,lat:20.3602081,yaw:0,width:28,depth:27,start:bong,source:bongSource,
    photo:'https://dantri.com.vn/thoi-su/cay-cho-nghin-nam-tuoi-chet-kho-van-sung-sung-giua-rung-cuc-phuong-20230715025417064.htm',
    description:'Cây chò xanh đã chết khô nhưng hai thân lớn còn đứng trên một gốc bạnh rộng. Nhiều chạc phía trên đã gãy, lòng gỗ rỗng mở ra giữa các tán rừng còn xanh.',
    arrivalNote:'Xe ở bãi Bống. Đường vòng cây chò ngàn năm dẫn khách đi bộ qua rừng đến phía bắc gốc cây.',
    shots:[['Hai thân chò giữa rừng già',0,.10,51.5,49,3.02,.16],['Bạnh gốc bên đường mòn',-.6,0,9.6,13,-2.72,.085],['Các đầu thân rỗng đã gãy',1,-.2,64,23,-2.32,.30]]},
  (T,kit)=>{
    const rock=K.batch(T),wood=K.batch(T);
    limb(T,wood,[[-2,-.45,0,2.26],[-2.49,4,-.15,1.87],[-2.88,11,.35,1.66],[-2.03,18,.78,1.43],[-2.53,26,.82,1.18],[-3.80,33.8,1.11,.97]],.52,true,true);
    limb(T,wood,[[2.1,-.42,.35,1.85],[2.65,4,-.28,1.61],[3.16,11,-.44,1.27],[4.03,18.9,-1.12,.99],[4.48,26.7,-1.86,.80]],1.64,true,true);
    limb(T,wood,[[-1.79,14.6,1.0,.99],[-.20,21.0,1.79,.86],[.82,27.4,3.64,.69],[1.13,35.0,4.20,.48],[2.55,40.6,4.88,.24]],2.81,true,true);
    limb(T,wood,[[1.22,32.6,4.16,.42],[3.74,35.1,3.60,.33],[5.16,38.0,4.13,.22],[5.75,39.3,4.8,.12]],5.70,true);
    for(let i=0;i<11;i++){
      const a=i*tau/11+.17,west=Math.cos(a)<0;buttress(wood,west?-2.2:2.2,.2,a,3.3+(i*1.61)%3.0,3.4+(i*.91)%3.0,.44,i*1.91,true);
    }
    wood.add(kit.group,bark(T));
    const path=[[19,-12.7],[5.2,-10.9],[-6.5,-8.3],[-15.5,-4.6],[-32,6.6]];trail(kit,path,1.08,0x928367);
    for(let i=0;i<14;i++){
      const a=(i/14)*tau,b=(i+1)/14*tau,x=Math.cos(a)*8.8,z=Math.sin(a)*6.72,nx=Math.cos(b)*8.8,nz=Math.sin(b)*6.72;
      kit.stamp(kit.round,0x71634d,x,.50,z,.073,1.12,.073);A.strut(T,kit,0x827861,x,.81,z,nx,.81,nz,.014);
    }
    for(let j=0;j<4;j++)K.boulder(rock,-5.6+j*3.9,.03,-3.4-.62*j,1.02,.43,.76,j+.82,true);
    nearForest(rock,false);understory(rock,240,36,33,(x,z)=>Math.hypot(x*.83,z)<3||z>-12&&z<-8&&Math.abs(x)<14);K.finish(T,kit,rock);
  });
  stop('osm-node-10768945036',{name:'Cây Sấu cổ thụ Cúc Phương',kind:'Tham quan',lon:105.5914095,lat:20.3492874,yaw:0,width:39,depth:39,start:bong,source:bongSource,
    description:'Cây sấu còn tán xanh cao trên tầng rừng. Các bạnh gốc vươn thành những vách mỏng, dài như cánh, tạo ra các hốc hẹp quanh thân.',
    arrivalNote:'Xe dừng ở bãi Bống. Tuyến đi bộ cây sấu đi qua rừng và có nhiều điểm quan sát chim.',
    shots:[['Các bạnh vè của cây sấu',0,0,15.2,19,.24,.12],['Tán sấu cao trên tầng lá',0,-1,47.7,41,.35,.22],['Khoảng trống giữa hai bạnh rễ',.29,.77,7.0,8.8,-.55,.10]]},
  (T,kit)=>{
    const rock=K.batch(T),wood=K.batch(T),leaves=[];
    limb(T,wood,[[0,-.41,0,2.38],[.2,4.0,0,1.69],[.49,10,.22,1.37],[-.02,19,.60,1.08],[.78,27,.42,.83],[2.20,34.8,1.1,.58],[3.1,40.8,.9,.25]],1.22);
    for(let i=0;i<8;i++){
      const a=[.18,.89,1.76,2.53,3.18,3.91,4.82,5.62][i],len=[12.7,10,7.7,16.3,9.6,7.2,11.9,8.6][i];
      buttress(wood,0,0,a,len,6.7+(i*.71)%2.4,.44+(i%2)*.16,i*.86,false);
      const dx=Math.cos(a),dz=Math.sin(a),span=5.9+(i%3)*1.63,y=23+(i%4)*2.7;
      limb(T,wood,[[.5,y,.4,.67],[dx*2.8,y+3.3,dz*2.8,.48],[dx*span*.80,y+6.03,dz*span*.8,.34],[dx*span,y+9,dz*span,.16]],i*1.72);
      leaves.push([dx*span,y+10,dz*span,4.18+(i%3)*.49,3.64,4.41,i*.81],
        [dx*span*.65,y+12,dz*span*.65,4.40,3.27,4.70,i*2.48]);
    }
    leaves.push([2.9,41.8,.91,5.2,3.83,4.97,1.12]);crowns(T,kit,leaves);
    wood.add(kit.group,bark(T));
    for(let i=0;i<9;i++)K.boulder(rock,Math.cos(i)*11.9,.02,Math.sin(i*2.1)*10,1.21,.65,.95,i+.8,true);
    nearForest(rock,true);understory(rock,200,38,36,(x,z)=>Math.hypot(x,z)<8.8||z>0&&Math.abs(x)<3.3);K.finish(T,kit,rock);
  });

  // This attraction node lies alongside ways 46654391 and 1157952708.
  // Elevation data places the trail here below the published 648 m summit.
  stop('osm-node-5294733035',{name:'Đường mòn lên đỉnh Mây Bạc',kind:'Tham quan',yaw:0,width:30,depth:36,start:bong,
    source:bongSource,photo:'https://dantri.com.vn/du-lich/xuyen-rung-gia-cuc-phuong-chinh-phuc-noc-nha-may-bac-20260323100021942.htm',
    description:'Ở ghim này, hai nhánh đường mòn gặp nhau trên sườn đá vôi giữa rừng. Tuyến của Vườn dẫn lên Mây Bạc, đỉnh núi cao khoảng 648 m.',
    arrivalNote:'Xe ở bãi Bống. Tuyến lên Mây Bạc là tuyến đi bộ cùng hướng dẫn viên của Vườn.',
    shots:[['Lối mòn trên sườn đá',0,2,9.9,22,-.32,.19],['Nhìn ra các dải rừng phía nam',.6,5.5,16,10.3,3.06,-.016]]},
  (T,kit)=>{
    const rock=K.batch(T);
    for(let i=0;i<19;i++){
      const theta=i*2.39996,r=Math.sqrt(i)*1.72,cx=r*Math.cos(theta),cz=r*Math.sin(theta);
      const a=.81+.35*Math.sin(i*3.1),long=2.2+(i*.41421%1)*2.2,wide=.60+(i*.618%1)*.90,h=.64+(i*.731%1)*1.12;
      rock.grid(19,8,(u,v)=>{
        const q=(u*2-1),end=Math.max(0,1-q*q)**.65,cross=2*v-1,ridge=Math.max(0,1-Math.abs(cross+.11*Math.sin(7*u+i)))**.74;
        const along=q*long,dis=cross*wide*end,crack=Math.cos(u*19+v*1.7+i);
        return [cx+along*Math.cos(a)-dis*Math.sin(a),-.17+h*end*ridge*(.84+.12*Math.sin(u*21+i)+.05*crack),
          cz+along*Math.sin(a)+dis*Math.cos(a),crack>.66?0x767663:ridge>.63?0xb5b4a3:0x939383,.88+.12*ridge];
      });
    }
    trail(kit,[[-22.5,24.1],[-8.4,16.3],[-1.6,11.5],[6.7,7.1],[8.7,6.6],[8.9,.6],[9.7,-12.6],[11.4,-30.5]],.88,0x8f8063);
    for(let i=0;i<162;i++){
      const a=i*2.39996,r=13+(i*.41421%1)**1.23*260,x=r*Math.cos(a),z=r*Math.sin(a);
      if(r<38&&x>-.58*z&&z>0)continue;
      const h=6.2+(i*.21341%1)*9.3;rock.trees.push([x,-.10,z,4.17+(i*.347%1)*6.6,h,a]);
    }
    understory(rock,132,29,30,(x,z)=>Math.hypot(x,z)<5||Math.abs(x-8)<1.9);K.finish(T,kit,rock);
  });
})();

export default window.VietnamSights;
