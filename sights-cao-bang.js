'use strict';
(()=>{
  const sites=window.VietnamSights??=[],atlas=globalThis.VietnamTourism,K=globalThis.VietnamKarst,A=globalThis.CentralArch;
  const pacBo='https://dsvh.gov.vn/di-tich-lich-su-pac-bo-2950';
  const pacBoRoad=[106.0484118,22.9837683]; // End of w135762925, start of the pedestrian way.
  function stop(id,data,build){
    const original=atlas.byId?.get(id)??atlas.entries.find(s=>s.id===id);
    const {shots,...site}=data,yaw=site.yaw??0,c=Math.cos(yaw),s=Math.sin(yaw);
    const views=shots.map(([name,x,z,height,viewRadius,angle,viewElevation])=>({name,height,viewRadius,viewAngle:yaw+angle,viewElevation,offset:[x*c+z*s,-x*s+z*c]}));
    sites.push({city:'Cao Bằng',province:'Cao Bằng',region:'Bắc Bộ',...original,...site,
      id,catalogId:id,yaw,views,build,visitOnArrival:true,mappedEntrance:true,approachMeters:undefined,
      map:'https://www.openstreetmap.org/'+id.slice(4).replace('-','/')});
  }
  function star(n,r,inner){return Array.from({length:n*2},(_,i)=>{
    const a=Math.PI/2+i*Math.PI/n;return [(i%2?inner:r)*Math.cos(a),(i%2?inner:r)*Math.sin(a)];
  });}
  // An individual floor remains level, even when the raster includes its roof.
  // Steps meet the surveyed ground at their foot, and a short bank ties the
  // platform into the hillside. Separate buildings may sit at different levels.
  function terraces(T,kit){
    const parts=[];
    function place(x,z,a,w,d,stepsAt,foot,build){
      const first=kit.vertexCount(),c=Math.cos(a),s=Math.sin(a),children=kit.place(x,z,a,build);
      const project=(u,v)=>[x+u*c+v*s,z-u*s+v*c];
      const strip=[],colors=[],indices=[],ref=[];
      const bounds=[[-w,-d],[w,-d],[w,stepsAt],[-w,stepsAt]];
      for(let j=0;j<4;j++){
        const [ax,az]=bounds[j],[bx,bz]=bounds[(j+1)%4],n=Math.ceil(Math.hypot(bx-ax,bz-az)/2.4);
        const from=strip.length/3;
        for(let k=0;k<=n;k++)for(const lateral of [0,1]){
          const u=ax+(bx-ax)*k/n,v=az+(bz-az)*k/n;
          const [px,pz]=project(u*(1+lateral*3.5/w),v*(1+lateral*3.5/Math.max(d,stepsAt)));
          strip.push(px,0,pz);ref.push([px,pz,lateral]);
          const col=new T.Color(lateral?0x697654:0x879073).multiplyScalar(.97+.07*Math.sin(u+v));
          colors.push(col.r,col.g,col.b);
          if(k&&lateral){const i=from+k*2;indices.push(i-2,i-1,i,i,i-1,i+1);}
        }
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(strip,3));
      g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();
      const land=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide}));land.receiveShadow=true;
      kit.group.add(land);
      parts.push({first,end:kit.vertexCount(),x,z,c,s,w,d,stepsAt,foot,children,land,ref,project,rest:children.map(m=>m.position.y)});
    }
    let original;
    kit.group.userData.fitGround=ground=>{
      const baked=kit.group.children.find(m=>m.geometry?.hasAttribute('finishKind'));
      if(!baked)return;
      const g=baked.geometry,p=g.attributes.position;
      original??=p.array.slice();
      for(const b of parts){
        const corner=[[-.72,.62],[.72,.62],[0,-.28]].map(([u,v])=>ground(...b.project(u*b.w,v*b.d)));
        const level=(ground(b.x,b.z)+Math.min(...corner))*.5;
        const bottom=ground(...b.project(0,b.foot)),delta=bottom-level;
        for(let i=b.first;i<b.end;i++){
          const x=original[i*3],y=original[i*3+1],z=original[i*3+2],v=(x-b.x)*b.s+(z-b.z)*b.c;
          const t=Math.max(0,Math.min(1,(v-b.stepsAt)/(b.foot-b.stepsAt))),step=delta*t*t*(3-2*t);
          const h=level+y+step;p.setY(i,y<.025?Math.min(h,ground(x,z)-.15):h);
        }
        b.children.forEach((m,i)=>{m.position.y=b.rest[i]+level;});
        const geom=b.land.geometry,pos=geom.attributes.position;
        b.ref.forEach(([x,z,outer],i)=>pos.setY(i,outer?ground(x,z)-.06:level+.035));
        pos.needsUpdate=true;geom.computeVertexNormals();geom.computeBoundingSphere();
      }
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    };
    return place;
  }
  const monumentSource='https://thoibaotaichinhvietnam.vn/dau-tu-3250-ty-dong-nang-cap-duong-ho-chi-minh-doan-pac-bo-cao-bang-202840.html';
  stop('osm-node-5418467363',{name:'Biểu tượng Km 0 đường Hồ Chí Minh',locality:'Trường Hà',kind:'Di tích',
    lon:106.051847,lat:22.97722,yaw:-1.73,width:17,depth:26,start:[106.0514418,22.977326],
    source:monumentSource,photo:monumentSource,solids:[[0,0,2.1,2.1],[0,4.5,5.1,5.1]],
    arrivalNote:'Xe dừng tại điểm đầu đường Hồ Chí Minh. Bậc đá dẫn từ sân lên chân biểu tượng.',
    shots:[['Trụ Km 0 ở Pác Bó',0,0,15,25,.14,.12],['Phù điêu và tên đường',0,0,14,12,.03,.07]],
    description:'Giữa khoảng sân bậc cấp là trụ đá xám bốn mặt. Trên thân trụ có hoa văn, huy hiệu tròn và biển nổi ghi tên đường Hồ Chí Minh.'},
  (T,kit)=>{
    const {box,place}=kit,granite=0x969891,pale=0xc0bfb2,band=0x77796e,trim=0xa4a69b;
    kit.palette({stone:[granite,pale,band,trim]});
    box(granite,0,.13,1.4,12,.26,10.6);box(trim,0,.43,.12,7.4,.34,7);
    for(let i=0;i<6;i++)box(i%2?granite:trim,0,.13+(5-i)*.05,5.1+i*.48,7.6,.26+(5-i)*.10,.50);
    for(const [y,w,d,h] of [[.78,4.5,4.5,.32],[1.04,3.45,3.45,.21],[2.03,2.43,2.43,1.86],[3.45,2.84,2.84,1.06],[4.08,2.61,2.61,.18]])box(granite,0,y,0,w,h,d);
    kit.tapered(pale,0,8.04,0,1.70,1.22,7.92,1,4);
    for(let face=0;face<4;face++)place(0,0,face*Math.PI/2,()=>{
      box(band,0,3.43,1.44,2.50,.91,.11);
      if(!face){kit.sign('ĐƯỜNG HỒ CHÍ MINH',0,3.65,1.51,2.27,.27,true);kit.sign('KM 0',0,3.25,1.51,1.35,.39,true);}
      for(let i=0;i<12;i++){
        const y=4.5+i*.42,z=1.21-(y-4.1)*.044;
        for(const side of [-1,1]){
          A.strut(T,kit,trim,side*.48,y,z,side*.16,y+.32,z-.015,.037);
          A.strut(T,kit,trim,side*.16,y+.32,z-.015,side*.48,y+.52,z-.021,.037);
        }
      }
      const seal=new T.CylinderGeometry(.60,.60,.11,28);seal.rotateX(Math.PI/2);kit.stamp(seal,granite,0,10.52,.97);seal.dispose();
      kit.outline(star(5,.35,.15),pale,0,10.52,1.035,.04);
    });
    kit.tapered(granite,0,12.20,0,1.23,.94,.41,1,4);box(trim,0,12.48,0,1.35,.17,1.35);
  });

  stop('osm-node-1490413978',{name:'Nhà trưng bày Khu di tích Pác Bó',yaw:-.213,width:49,depth:35,
    source:'https://baotanghochiminh.vn/khu-di-tich-quoc-gia-dac-biet-pac-bo-cao-bang.htm',
    modeledBuildings:['w1376476290','w1376476292'],start:[106.0513689,22.9770227],
    boundary:[[-22,-16],[8,-16],[8,-41],[27,-41],[27,-12],[22,-12],[22,10],[7,10],[7,16],[-7,16],[-7,10],[-22,10]],
    solids:[[0,-2,21,13],[17,-23,9,14],[0,12,6.8,4]],
    arrivalNote:'Từ đường trong khu di tích, khách đi bộ qua sân cỏ tới nhà trưng bày.',
    shots:[['Mặt tiền nhà trưng bày',0,3,14.8,46,.10,.10],['Mái đón và cầu thang chính',0,11.2,11.8,17,-.21,.08]],
    description:'Nhà trưng bày hai tầng nhìn ra sân cỏ. Mái ngói đỏ phủ hai cánh hành lang, chính giữa là mái đón nhô ra trên hàng cột đá và bậc thềm.'},
  (T,kit)=>{
    const {box,place}=kit,walls=0xe2e0d3,wood=0x915b44,stone=0x9d9d91,tile=0xae5946,ridge=0xdbd6c7;
    kit.palette({tile,stone,timber:wood,plaster:walls});
    terraces(T,kit)(0,0,0,22.5,14.9,14.3,21.7,()=>{
    box(stone,0,.36,-2,43.8,.72,25.8);box(walls,0,4.62,-4.5,42.5,7.8,19.8);
    for(const x of [-18,-12,-6,6,12,18]){
      for(const y of [2.5,6.55]){
        box(wood,x,y,5.53,2.18,2.80,.20);box(0x555953,x,y+.04,5.70,1.81,2.55,.13);
        box(wood,x,y,5.81,.095,2.56,.09);
      }
      box(wood,x,4.68,9.39,.37,8.05,.37);
      box(walls,x,1.05,9.39,.69,.79,.69);
    }
    box(stone,0,4.56,7.54,43.33,.38,4.95);
    for(const side of [-1,1]){
      box(ridge,side*14.75,5.51,9.76,14.77,.11,.12);
      for(let i=0;i<35;i++)box(stone,side*(7.50+i*.423),5.10,9.76,.081,.76,.1);
    }
    A.curvedRoof(T,kit,0,8.85,-2.0,45.3,26.3,3.76,tile,ridge,wood,.33);
    // Rear wing and its ridge turn at right angles on w1376476292.
    place(18,-26,Math.PI/2,()=>{
      box(walls,0,4.02,0,25.4,8.04,16.5);A.curvedRoof(T,kit,0,8.12,0,26.3,17.7,2.92,tile,ridge,wood,.30);
    });
    box(stone,0,2.22,11.43,13.8,4.44,7.90);
    for(const x of [-6.35,-2.2,2.2,6.35])box(stone,x,6.95,14.62,.54,5.04,.54);
    kit.outline([[-8.15,0],[0,3.14],[8.15,0]],walls,0,9.43,15.27,.12);
    A.gabledRoof(T,kit,0,9.57,10.16,16.7,13.26,3.15,tile,ridge,{overhang:.4});
    box(wood,0,9.30,15.69,16.61,.34,.26);
    for(let i=0;i<19;i++){const h=(19-i)*.233;box(stone,0,h/2,15.45+i*.33,11.22,h,.34);}
    for(const side of [-1,1])A.strut(T,kit,ridge,side*5.80,5.04,15.28,side*5.80,.80,21.70,.12);
    });
  });

  // Cross sections of the two banks of OSM water polygon w1430562102.
  // The attraction is anchored on the headwater reach of named w1376476251.
  const banks=[[[30.7,-64.2],[59.0,-51.2]],[[27.3,-39.0],[40.0,-32.4]],[[22.1,-29.5],[36.3,-21.1]],
    [[-15.3,.4],[-8.5,11.8]],[[-38.1,15.7],[-31.5,27.3]],[[-52.5,24.2],[-55.5,38.3]],
    [[-103.3,39.2],[-100.7,47.8]],[[-118.1,43.5],[-125,67.8]],[[-154.4,69.4],[-128.3,71.6]],
    [[-168.4,104.4],[-157.7,115.9]],[[-182.3,122.5],[-168.8,120.3]]];
  function bankPoint(t,u){
    const s=Math.min(banks.length-1.000001,Math.max(0,t)*(banks.length-1)),i=Math.floor(s),q=s-i;
    return [0,1].map(k=>(1-q)*((1-u)*banks[i][0][k]+u*banks[i][1][k])+q*((1-u)*banks[i+1][0][k]+u*banks[i+1][1][k]));
  }
  stop('osm-way-1376476251',{name:'Suối Lê Nin',lon:106.049385,lat:22.987784,locality:'Trường Hà',kind:'Suối',
    width:25,depth:35,source:pacBo,start:pacBoRoad,solids:[],gardenRadius:18,
    arrivalNote:'Xe dừng cuối đường vào Hang Cốc Bó. Từ đây lối đi bộ men theo bờ suối.',
    shots:[['Bờ đá bên suối xanh',4,-7,6.4,26,-1.34,.13],['Nhìn lên đầu nguồn',39,-45,8.0,23,-1.99,.17]],
    description:'Dưới chân núi Các Mác, nước đầu nguồn đi qua những vũng xanh trong, vòng qua bãi đá và rễ cây. Hai bờ trong cảnh chạy theo đoạn đầu suối trên bản đồ.'},
  (T,kit)=>{
    const r=K.batch(T),w=K.batch(T),shallow=new T.Color(0x8c9473),deep=new T.Color(0x396f62),waterTint=new T.Color();
    function onViewingPath(x,z){
      return [[-21.2,-1,4,-7],[18,-54,39,-45]].some(([ax,az,bx,bz])=>{
        const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
        return Math.hypot(x-ax-t*dx,z-az-t*dz)<6.1;
      });
    }
    w.grid(28,135,(u,t)=>{
      const bias=(1-Math.sin(Math.PI*u))*(.014*Math.sin(81*t)+.009*Math.cos(173*t));
      const [x,z]=bankPoint(t,u+bias),shore=Math.sin(Math.PI*u)**.58,glint=Math.sin(2.9*x+.24*z)*Math.cos(z*1.22);
      waterTint.copy(shallow).lerp(deep,Math.max(0,Math.min(1,shore+.075*Math.sin(x*.28+z*.41))));
      return [x,.14+.011*glint,z,waterTint.getHex(),.94+.075*Math.sin(x*.18+z*.29)+.036*glint];
    });
    w.add(kit.group,new T.MeshPhongMaterial({vertexColors:true,specular:0x364d42,shininess:31,transparent:true,opacity:.91,depthWrite:false}));
    for(let n=0;n<156;n++){
      const t=kit.random(),side=n%2,u=side?1.06+kit.random()*.14:-.06-kit.random()*.14,[x,z]=bankPoint(t,u);
      const sz=.24+kit.random()**2*1.62;K.boulder(r,x,-.12,z,sz,sz*(.50+kit.random()*.38),sz*.83,n,true);
      if(n%5===0)r.ferns.push([x,.22,z,1.28,n*.72]);
      if(n%4===0){const [tx,tz]=bankPoint(t,side?1.4:-.4);
        if(!onViewingPath(tx,tz))r.trees.push([tx,-.08,tz,4.4,6.5+n%3,n*1.3]);
      }
    }
    K.finish(T,kit,r);
  });

  const quaySon='https://baocaobang.vn/Ban-Gioc-thac-nuoc-tu-nhien-lon-nhat-Dong-Nam-A-39728.html';
  stop('osm-way-1372358286',{name:'Thác phụ Bản Giốc',locality:'Đàm Thủy',kind:'Thác nước',
    lon:106.723311,lat:22.854041,yaw:Math.PI/2,width:79,depth:36,start:[106.726523,22.850071],source:quaySon,
    solids:[],gardenRadius:18,arrivalNote:'Xe dừng bên lối vào bãi đỗ Bản Giốc phía Việt Nam. Từ bờ sông Quây Sơn có thể nhìn toàn dải thác phụ.',
    shots:[['Rèm thác phụ từ bờ Việt Nam',0,2,29,71,-.15,.10],['Những dây nước trên gờ đá',6,1,33,37,.27,.09]],
    description:'Ở phía nam nhánh thác chính, dòng nước chia thành nhiều dải mảnh rơi gần thẳng đứng xuống sông Quây Sơn. Mép đá trong cảnh chạy theo vách thác được vẽ riêng trên bản đồ.'},
  (T,kit)=>{
    const rock=K.batch(T),water=K.batch(T),foam=K.batch(T);
    // The mapped face runs north–south. Positive z is east, downstream.
    const lip=[[-39,2.7],[-32.2,-.1],[-23.5,-2.9],[-15.6,-2.5],[-8.1,-2.3],[20.6,.3],[25.7,.4],[32.6,.6],[39.4,4.2]];
    function edge(x){
      const j=Math.max(1,lip.findIndex(b=>b[0]>=x)),i=x>39.4?lip.length-2:j-1;
      const [a,p]=lip[i],[b,q]=lip[i+1];return p+(q-p)*(x-a)/(b-a);
    }
    function top(x){return 26.7+1.34*Math.sin(x*.055)+.73*Math.cos(.19*x);}
    rock.grid(108,31,(u,v)=>{
      const x=(u-.5)*78,z=edge(x)+1.3*(1-v)+.54*Math.sin(x*.78+v*.85)+.28*Math.cos(v*33+x*.37);
      return [x,-.22+v*top(x),z,0x887e68,.79+.17*Math.sin(x*.67)+.12*Math.sin(v*45+x*.11)];
    });
    rock.grid(90,12,(u,v)=>{
      const x=(u-.5)*78;return [x,top(x)+.18*v+.26*Math.sin(x*.8+v*12),edge(x)-v*12,
        .43+Math.sin(x*.18)>.84?0x7b8264:0x91917a,.88+.08*Math.sin(x+6*v)];
    });
    let index=0;
    for(let x=-35.9;x<37;){
      const w=1.25+2.1*kit.random(),start=x;index++;
      water.grid(10,40,(u,v)=>{
        const fx=start+w*u+.24*Math.sin(v*5.7+index)+(v**2)*.29*Math.sin(5*u+index);
        const drift=.7*Math.sin(Math.PI*v*.82)+2.5*v**1.3;
        return [fx,.25+top(fx)*(1-v),edge(fx)+.78+drift+.14*Math.sin(u*20+index),
          0xdcebe5,.79+.18*Math.sin(u*24+index)+.033*Math.cos(42*v+u*11)];
      });
      foam.grid(11,5,(u,v)=>{
        const fx=start+u*w*1.31,reach=(.56+.83*Math.sin(Math.PI*u))*(1.6+1.45*Math.sin(index)**2);
        return [fx,.27+.012*Math.cos(9*u+4*v),edge(fx)+2.3+v*reach,0xc4e2d2,.81+.18*Math.sin(u*16+index)];
      });
      x+=w+(index%6===0?3.0:.25+kit.random()*.8);
    }
    const falling=new T.MeshPhongMaterial({vertexColors:true,transparent:true,opacity:.88,depthWrite:false,shininess:55,specular:0xaebeb5});
    const flow={value:0},reduced=matchMedia('(prefers-reduced-motion: reduce)');
    falling.customProgramCacheKey=()=>'quay-son-falling-sheets';
    falling.onBeforeRender=()=>{flow.value=reduced.matches?0:(performance.now()%120000)/1000;};
    falling.onBeforeCompile=shader=>{
      shader.uniforms.quaySonTime=flow;
      shader.vertexShader='varying vec3 fallPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfallPoint=position;');
      shader.fragmentShader='varying vec3 fallPoint;uniform float quaySonTime;\n'+shader.fragmentShader.replace('#include <color_fragment>',
        '#include <color_fragment>\nfloat stream=sin(fallPoint.x*13.7+.24*sin((fallPoint.y+quaySonTime*8.)*1.8)); diffuseColor.rgb*=.91+.10*stream; diffuseColor.a*=.86+.14*sin(fallPoint.x*27.1+stream);');
    };
    water.add(kit.group,falling);foam.add(kit.group,new T.MeshPhongMaterial({vertexColors:true,shininess:36}));
    for(let i=0;i<40;i++){
      const x=(kit.random()-.5)*78,y=top(x);
      if(i%3===0)rock.trees.push([x,y-.32,edge(x)-6.2-kit.random()*3.5,3.4,4.6+i%4,i]);
      K.boulder(rock,x,.07,edge(x)+2.04,1.1,.80,1.4,i,true);
    }
    K.finish(T,kit,rock);
  });

  const villageSource='https://dantoc.vietnamtourism.gov.vn/lang-da-khuoi-ky-nguoi-tay-o-cao-bang-ve-dep-binh-yen-noi-bien-gioi/';
  // Roof centres and bearings fitted to Esri World Imagery at the OSM village
  // marker. These houses occupy different sides of the mapped village lanes.
  const houses=[[0,-17.2,17.5,18.1,1.58],[-28.1,-5.0,14.1,11.8,1.78],[-22.0,12.2,12.8,10.9,1.78],[-24.2,34.4,12.5,10.8,1.75]];
  stop('osm-node-13378657667',{name:'Làng đá Khuổi Ky',lon:106.701246,lat:22.854465,locality:'Đàm Thủy',kind:'Làng nghề',
    width:19,depth:18,source:villageSource,photo:villageSource,start:[106.7014015,22.8542209],gardenRadius:10,
    solids:houses.map(([x,z,w,d])=>[x,z,d*.45,w*.45]),
    arrivalNote:'Xe dừng ở lối vào làng. Đường nhỏ chạy giữa các cụm nhà đá và con suối Khuổi Ky.',
    shots:[['Nhà sàn đá bên lối làng',0,-17,11.5,27,1.70,.12],['Qua những mái ngói âm dương',-13,1,19,51,1.08,.35]],
    description:'Nhà sàn của người Tày ở Khuổi Ky có tường đá, tầng dưới mở giữa các cột và mái ngói âm dương. Từ đầu hồi nhìn rõ cầu thang đá bên hông, hàng hiên và lan can chạy trước gian ở.'},
  (T,kit)=>{
    const {box,place}=kit,wood=0x71523f,granite=0xaaa797,mortar=0x8e8c7b,trim=0xb5b09b;
    const slate=[0x8e8977,0xa7a28e,0xaaa892,0xb5b09a,0x929384];
    kit.palette({timber:wood,stone:[mortar,granite,trim,...slate]});
    function facade(w,h,d,primary){
      const y0=2.46,top=y0+h,wallZ=d*.5;
      for(const x of [-w*.44,0,w*.44])for(const z of [-d*.44,0,d*.44])box(granite,x,1.28,z,.62,2.55,.62);
      box(granite,0,2.46,0,w+.34,.34,d+.36);box(mortar,0,y0+h/2,-.60,w-.47,h,d-1.48);
      // Shallow, irregular blocks retain mortar joints at the jambs as well.
      function face(length,windows){
        for(let j=0;j<Math.ceil(h/.39);j++){
          const y=y0+.21+j*.39;
          for(let x=-length*.5;x<length*.5-.05;){
            const span=Math.min(length*.5-x,.55+kit.random()*.91),mid=x+span*.5;
            if(!windows.some(cx=>Math.abs(mid-cx)<.72&&y>y0+.75&&y<y0+2.43))
              box(slate[Math.floor(kit.random()*slate.length)],mid,y,.04,Math.max(.04,span-.048),.338,.10);
            x+=span;
          }
        }
        for(const cx of windows){
          box(wood,cx,y0+1.68,.104,1.46,1.76,.14);box(0x46493d,cx,y0+1.70,.201,1.23,1.56,.063);
          for(let j=0;j<5;j++)box(wood,cx-.52+j*.26,y0+1.70,.247,.064,1.55,.055);
          box(trim,cx,y0+.78,.16,1.66,.15,.24);
        }
      }
      place(0,wallZ-1.32,0,()=>face(w-.47,[-w*.32,0,w*.32]));
      for(const side of [-1,1])place(side*(w/2-.22),-.60,side*Math.PI/2,()=>face(d-1.48,[-d*.22,d*.22]));
      const darkRoof=primary?0x716856:0x816a53;
      A.gabledRoof(T,kit,0,top+.35,-.12,w+1.4,d+1.7,w*.255,darkRoof,0x665f51,{overhang:.35,thick:.21});
      for(const side of [-1,1]){
        const z=side*(d/2+.74)-.12;
        for(let k=-3;k<=3;k++){const x=k*w*.115,post=(1-Math.abs(x)/(w*.53))*w*.235;
          box(wood,x,top+.35+post*.5,z,.13,post,.13);}
        box(wood,0,top+.36,z,w+.84,.19,.18);
      }
      box(granite,0,2.50,wallZ,w+.87,.30,2.84);
      for(const y of [2.79,3.56])box(trim,-.52,y,wallZ+1.26,w-.47,.12,.22);
      for(let i=0;i<Math.floor(w/.37)-2;i++)box(granite,-w*.5+.26+i*.37,3.17,wallZ+1.26,.10,.68,.13);
      const x=w*.5-.15;
      for(let i=0;i<12;i++){const step=(12-i)*.216;box(granite,x,step/2,wallZ+1.13+i*.34,1.72,step,.35);}
    }
    const seat=terraces(T,kit);
    for(const [i,[x,z,w,d,a]] of houses.entries())seat(x,z,a,w*.50,d*.51,d*.49,d*.50+5.0,()=>facade(w,i?2.87:3.74,d,!i));
  });

  const pagodaYaw=-2.453;
  stop('osm-way-1415191977',{name:'Chùa Phật Tích Trúc Lâm Bản Giốc',lon:106.72326,lat:22.85072,locality:'Đàm Thủy',kind:'Đền chùa',
    width:35,depth:16,yaw:pagodaYaw,start:[106.7227267,22.851119],source:'https://csdl.vietnamtourism.gov.vn/dest/?item=880',
    modeledBuildings:['w1415191974','w1415191976','w1415191977'],
    solids:[[0,0,15.8,5.55],[-22.8,12.9,5.1,11.2],[.9,17.7,5.9,4.35]],
    arrivalNote:'Xe dừng trên đường lên chùa. Các bậc đi bộ nối lối vào với sân chùa trên sườn Phia Nhằm.',
    shots:[['Các mái chùa trên sườn Phia Nhằm',-3,2.1,20,53,-.52,.32],['Hàng cửa gỗ tòa Tam Bảo',0,4.8,10.8,12.4,-.42,.105],
      ['Từ sườn núi nhìn về thác',-154,184,40,162,.28,.31]],
    description:'Tòa Tam Bảo quay ra thung lũng sông Quây Sơn. Mái ngói đỏ uốn lên ở bốn góc, bên dưới là hàng cột và cửa bức bàn bằng gỗ. Từ sân chùa có thể nhìn xuống khu thác Bản Giốc.'},
  (T,kit)=>{
    const {box,place}=kit,wood=0x70452e,tile=0xa7543c,ridge=0xb5ae93,stone=0xa49d88;
    // Three roof footprints (w1415191974, w1415191976, w1415191977).
    // Keep the public terrace and the mountain-facing side open.
    function hall(w,d,h,bays,roofRise){
      box(stone,0,.62,0,w+1.08,1.24,d+.95);box(0xd4c7a1,0,1.34,0,w+.95,.23,d+.8);
      box(wood,0,1.43+h*.47,-d*.12,w-1.1,h*.94,d*.65);
      const dz=d*.235,step=w/(bays+.23);
      for(let i=0;i<bays;i++){
        const middle=(i-(bays-1)/2)*step;
        for(let j=0;j<4;j++){
          const x=middle+step*(j-1.5)/4;
          box(0x533a2c,x,1.42+h*.43,dz,step*.222,h*.83,.14);
          box(wood,x,1.39+h*.20,dz+.11,step*.184,h*.33,.10);
          for(let k=0;k<4;k++)box(wood,x+(k-1.5)*step*.039,1.42+h*.64,dz+.13,.069,h*.34,.08);
        }
      }
      for(let i=0;i<=bays;i++){
        const x=-bays*step/2+i*step;
        for(const side of [-1,1]){
          kit.stamp(kit.round,stone,x,1.55,side*d*.42,.35,.24,.35);
          kit.stamp(kit.round,wood,x,1.56+h/2,side*d*.42,.228,h,.228);
          box(wood,x,1.43+h,side*d*.42,.38,.28,.39);
        }
      }
      for(const side of [-1,1])box(wood,0,1.36+h,side*d*.42,w,.28,.25);
      A.curvedRoof(T,kit,0,1.5+h,0,w+1.2,d+1.47,roofRise,tile,ridge,wood,.32);
      for(let i=0;i<6;i++){const h2=(6-i)*.23;box(stone,0,h2/2,d*.5+.5+i*.34,w*.42,h2,.35);}
    }
    kit.palette({timber:wood,stone,plaster:0xd4c7a1});
    const seat=terraces(T,kit);
    seat(0,0,0,16.3,6.1,5.85,7.85,()=>hall(31.2,10.9,4.06,7,3.65));
    seat(-22.8,12.9,Math.PI/2,11.65,5.4,5.2,7.05,()=>hall(21.8,9.6,3.29,5,2.95));
    seat(.9,17.7,0,7.1,4.8,4.74,6.51,()=>hall(12.8,8.6,2.91,3,2.51));
  });
  stop('osm-node-13005765528',{name:'Núi Các Mác',yaw:-2.49,width:60,depth:37,start:pacBoRoad,source:pacBo,solids:[],gardenRadius:14,
    arrivalNote:'Xe dừng ở đầu đường đi bộ. Từ bờ suối Lê Nin có thể ngước nhìn sườn núi.',
    shots:[['Vách núi nhìn từ phía suối',0,1,24,56,.15,.18],['Gờ đá vôi dưới tán rừng',-8,0,11.5,19,-.33,.10]],
    description:'Sườn núi đá vôi phủ rừng nằm sát suối Lê Nin. Trên nền địa hình của thung lũng Pác Bó, các khe đứng chia mặt đá thành từng dải lộ ra giữa tán cây.'},
  (T,kit)=>{
    const r=K.batch(T);
    r.grid(95,20,(u,v)=>{
      const x=(u-.5)*57,t=Math.sin(Math.PI*u)**.70,crest=t*(13+4.3*Math.sin(8*u)+2.4*Math.cos(23*u));
      const flute=1.2*Math.sin(x*1.14+v*.92)+.37*Math.sin(x*3.2+v*2.2);
      return [x,-.46+v*crest,6-9*v+3.2*Math.sin(u*8)+flute*t,0xa5a899,.80+.16*Math.cos(x*1.14+v*.92)+.09*Math.sin(x*.41+v*14)];
    });
    for(let i=0;i<89;i++){
      const x=(kit.random()-.5)*55,z=7.5+kit.random()*5.8,h=.33+kit.random()**2*1.48;
      K.boulder(r,x,-.095,z,h*1.66,h,h*1.10,i,true);
      if(i%3===0)r.ferns.push([x,.08,z,1.3+kit.random()*.7,i]);
    }
    for(let i=0;i<25;i++){
      const u=(i+.5)/25,t=Math.sin(Math.PI*u)**.70,y=t*(13+4.3*Math.sin(8*u)+2.4*Math.cos(23*u))-.52;
      r.trees.push([(u-.5)*57,y,-3.4+3.2*Math.sin(u*8),4.2+kit.random()*2,5.1+kit.random()*3,i*1.8]);
    }
    K.finish(T,kit,r);
  });

  stop('osm-node-4527762070',{name:'Động Ngườm Ngao',yaw:1.95,width:43,depth:38,start:[106.7056284,22.8466923],
    source:'https://csdl.vietnamtourism.gov.vn/dest/?item=564',solids:[],
    arrivalNote:'Xe dừng ở đường nối bãi đỗ Ngườm Ngao. Góc tham quan đưa bạn vào khoang đá.',
    shots:[['Đài sen úp ngược',-2.8,-14.3,14.2,8.3,.14,-.025],['Bậc canxi trên nền động',2.5,-10.3,4.8,6.7,.72,.13]],
    description:'Đài sen úp ngược và cột đá đứng bên cạnh là hai hình nhũ đặc trưng của Ngườm Ngao. Dưới chân chúng, các bờ canxi nhỏ chia nền hang thành những ô tựa ruộng bậc thang. Cảnh tái hiện các hình nhũ tiêu biểu trong hang.'},
  (T,kit)=>{
    const r=K.batch(T);K.grotto(r,[[0,0,5.6,7.1,.10],[6,-.75,9.3,11.6,.10],[16,0,11.2,15.2,.04],[25,-1.7,8.9,11.3,.08],[33,-4.5,5.1,6.5,.08]],20,18.8,.92);
    // The documented formation is a broad fringe of overlapping lobes on
    // a ledge, each with several split tips. The wall continues below it.
    // https://muctim.tuoitre.vn/di-tim-doa-sen-up-nguoc-trong-dong-nguom-ngao-58336.htm
    r.grid(62,22,(u,v)=>{
      const x=-8.7+10.2*u,y=.11+8.38*v+.18*Math.sin(u*11)*v;
      return [x,y,-16.0+.43*Math.sin(u*9)+.20*Math.cos(v*28+u*20),0x99846c,.70+.15*Math.cos(27*v+u*6)];
    });
    for(let i=0;i<8;i++){
      const cx=-7.72+i*1.11,drop=2.72+1.19*Math.sin((i+1)*.8)**2,top=8.42+.31*Math.sin(i*1.19),width=.97+.19*Math.sin(i*.71);
      r.grid(28,21,(u,v)=>{
        const side=2*u-1,base=Math.sqrt(Math.max(0,1-side*side)),groove=.83+.17*Math.cos(20*u+i*.47);
        const spread=width*(.77+.30*Math.sin(v*Math.PI)-.42*v**2.4);
        const x=cx+side*spread+.19*Math.sin(v*Math.PI),y=top-drop*v*(.51+.49*base*groove);
        const z=-15.76+.25*Math.sin(i*.7)+(.43+1.30*Math.sin(Math.PI*v*.83))*base+.16*Math.cos(20*u+i*.47)*v;
        return [x,y,z,0xd1ad7b,.85+.12*Math.sin(14*u+i*.53)+.06*Math.cos(49*u+v*.66)];
      });
    }
    r.grid(46,26,(u,v)=>{
      const a=u*2*Math.PI,radius=(.75+.81*(2*v-1)**4)*(1+.17*Math.sin(11*a+v*1.3)+.10*Math.sin(3*a));
      return [3.2+Math.cos(a)*radius+.17*v,.18+13.72*v,-16.4+1.24*Math.sin(a)*radius,0xc1a98c,.85+.15*Math.cos(11*a+v*1.3)];
    });
    for(let n=0;n<11;n++){
      const z=-5.45-n*.86,y=.19+n*.105;
      r.grid(44,5,(u,v)=>{
        const x=.42+u*7.23,line=z+.55*Math.sin(u*9+n*.42)+.22*Math.cos(u*18-.22*n);
        return [x,y-.14+Math.sin(Math.PI*v)*.18,line+(v-.45)*.27,0xc9b296,.86+.12*Math.sin(v*Math.PI)];
      });
      r.grid(36,4,(u,v)=>{
        const x=.42+u*7.23,line=z+.55*Math.sin(u*9+n*.42)+.22*Math.cos(u*18-.22*n);
        return [x,y-.105,line-v*.90,0x9c8e76,.85+.09*Math.sin(x*.66+v)];
      });
    }
    K.finish(T,kit,r);
  });
})();
