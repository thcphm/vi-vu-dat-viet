'use strict';
(() => {
  const sites=window.VietnamSights??=[];
  const nomination='https://whc.unesco.org/uploads/nominations/949.pdf';
  const inventory='https://dsvh.gov.vn/di-tich-kien-truc-nghe-thuat-khu-den-thap-my-son-2943';
  const restored='https://vietnamtourism.gov.vn/en/post/18147';
  const after='https://vnexpress.net/ba-nhom-thap-o-thanh-dia-my-son-sau-trung-tu-4550512.html';
  const worksite='https://cttdt.danangportal.gov.vn/vi/web/dng/w/da-nang-dong-hanh-cung-chuyen-gia-an-do-tiep-tuc-hoi-sinh-nhom-thap-e-f-tai-my-son';
  const surveyPhoto='https://baovanhoa.vn/van-hoa/hien-trang-nhom-thap-ef-my-son-truoc-ngay-trien-khai-du-an-bao-ton-123637.html';
  const jica='https://openjicareport.jica.go.jp/pdf/11774809.pdf';
  const groupG='https://whc.unesco.org/en/news/1046/';
  const brick=0xa56c4d,red=0x945d46,old=0x765647,orange=0xb77d57,dark=0x6f543f;
  const stone=0x9b9482,edge=0xb0a389,blackStone=0x757365,soil=0xa99470;
  const parking=[108.10911,15.77344],half=Math.PI/2;
  function view(name,x,z,height,viewRadius,viewAngle,viewElevation=.22){
    return {name,offset:[x,z],height,viewRadius,viewAngle,viewElevation,viewFov:55};
  }
  function register(letter,osm,name,lon,lat,w,d,details,build){
    const [type,num]=osm.split('/');
    sites.push({id:letter.length===1?'my-son-nhom-'+letter:letter,name,catalogId:'osm-'+type+'-'+num,lon,lat,
      city:'Mỹ Sơn',province:'Đà Nẵng',region:'Trung Bộ',kind:'Khảo cổ',start:parking,yaw:0,width:w,depth:d,
      solids:[],gardenRadius:14,visitOnArrival:true,mappedEntrance:true,map:'https://www.openstreetmap.org/'+osm,
      arrivalNote:'Xe dừng ở khu đón khách. Các nhóm tháp được tham quan theo đường đi bộ trong thung lũng.',
      ...details,build});
  }
  function materials(k){
    k.palette({brick:[brick,red,old,orange,dark],stone:[stone,edge,blackStone,soil]});
  }
  // Keep individual ruins level, even when two pins share a terrain pixel.
  // Extending only a footing beneath the measured outline avoids inventing a
  // large rectangular platform around an excavated chamber.
  function sitesOnGround(T,k){
    materials(k);const f=createTempleFoundations(T,k);
    const fit=k.group.userData.fitGround;let finished=false;
    k.group.userData.fitGround=ground=>{
      if(!finished&&k.group.name!=='bao-tang-my-son'){
        // Use the existing scan at two scales. The metre UVs put humid stains
        // across successive courses and keep the carved sandstone clean.
        const skin=k.group.children[k.group.children.length-1].material,scan=skin.onBeforeCompile;
        skin.customProgramCacheKey=()=>'my-son-weathered-brick-v1';
        skin.onBeforeCompile=shader=>{
          scan.call(skin,shader);
          shader.fragmentShader=shader.fragmentShader.replace('diffuseColor.rgb *= 1.+patina;',`
            diffuseColor.rgb *= 1.+patina;
            if (kind == 7.) {
              float stains=texture2D(map,m*.089+vec2(.19,.63)).g*.64+
                texture2D(map,m*.27+vec2(.81,.14)).r*.36;
              float darkPatch=smoothstep(.45,.64,stains);
              diffuseColor.rgb*=1.07-.54*darkPatch;
              diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.11,.103,.061),darkPatch*.28);
            }`);
        };
        skin.needsUpdate=true;
      }
      finished=true;fit(ground);
    };
    return (x,z,yaw,draw)=>f.fixture(g=>g(x,z),()=>k.place(x,z,yaw,draw));
  }
  function block(k,c,x,base,z,w,h,d){k.box(c,x,base+h/2,z,w,h,d);}
  function tread(k,end,base,span,count,run){
    for(let i=0;i<count;i++)block(k,i%3?brick:orange,end*(i+.5)*run/count,0,0,run/count+.02,
      Math.max(.10,base*(1-i/count)),span);
  }
  function mould(k,w,d,y,h=.18,c=brick){
    block(k,c,0,y,0,w,h,d);
  }
  // Step the fractured wall head along courses and leave exposed cores at
  // the break. Numbers describe the observed silhouette, not a former roof.
  function wall(k,w,d,heights,c=red,base=0){
    const points=[[-w/2,0],[w/2,0]];
    const n=Math.ceil(w/.38),run=w/n;
    for(let i=n-1;i>=0;i--){
      const x=-w/2+(i+.5)*run,u=(i+.5)*(heights.length-1)/n,j=Math.floor(u);
      const h=Math.max(.10,Math.round((heights[j]+(heights[j+1]-heights[j])*(u-j)+.09*Math.sin(i*9.3+w))/.105)*.105);
      points.push([x+run/2,h],[x-run/2,h]);
      if(i%5===1)block(k,i%2?old:brick,x,base+h-.014,.04*Math.sin(i),run*.83,.089,d*.72);
    }
    k.outline(points,c,0,base,-d/2,d);
  }
  function sandstoneDoor(k,x,y,z,span,h,angle){
    k.place(x,z,angle,()=>{
      for(const s of [-1,1]){
        block(k,blackStone,s*(span/2+.16),y,0,.34,.25,.51);
        block(k,stone,s*(span/2+.16),y+.25,0,.30,h-.25,.40);
        block(k,edge,s*(span/2+.16),y+h-.21,0,.40,.18,.49);
      }
      block(k,blackStone,0,y+h,0,span+.92,.32,.54);
    });
  }
  function lingam(k,x,y,z,size){
    k.place(x,z,0,()=>{
      const d=size;
      for(const [w,h,b,c] of [[1,.15,0,blackStone],[.85,.34,.15,stone],[.70,.20,.49,blackStone],
        [.91,.12,.69,edge],[.99,.14,.81,stone]])block(k,c,0,b*d+y,0,w*d,h*d,w*d);
      block(k,stone,0,.85*d+y,-.54*d,.18*d,.095*d,.26*d);
      k.tapered(stone,0,1.06*d+y,0,d*.109,d*.111,d*.23,1,16);
      k.tapered(edge,0,1.185*d+y,0,d*.11,d*.074,d*.07,1,16);
    });
  }
  function rubble(k,x,z,w,d,count){
    for(let i=0;i<count;i++){
      const a=(k.random()-.5)*w,b=(k.random()-.5)*d,span=.24+k.random()*.56;
      k.box(i%5?i%2?red:brick:stone,x+a,.11+k.random()*.077,z+b,span,.18+k.random()*.20,span*(.66+k.random()*.51),k.random()*3);
    }
  }
  function cell(k,w,d,h,gate=1){
    mould(k,w+.48,d+.45,-.35,.55,red);mould(k,w+.24,d+.20,.19,.23,brick);
    const thick=Math.min(.83,d*.18),side=w/2-thick/2;
    for(const s of [-1,1])k.place(0,s*(d-thick)/2,0,()=>wall(k,w,thick,[h*.75,h*.90,h*.71,h,h*.86,h*.90],s<0?old:brick,.39));
    if(gate)k.place(-gate*side,0,half,()=>wall(k,d-thick,thick,[h*.94,h,h*.82,h*.67],red,.39));
    for(const end of gate?[gate]:[-1,1])for(const s of [-1,1])block(k,brick,end*side,.39,s*d*.313,thick,h*.65,d*.30);
  }
  function ring(k,cx,cz,w,d,h=.32,opening=4){
    for(const s of [-1,1])block(k,brick,cx,0,cz+s*d/2,w,h,.65);
    block(k,red,cx+w/2,0,cz,.65,h,d);
    for(const s of [-1,1])block(k,red,cx-w/2,0,cz+s*(d+opening)/4,.65,h,(d-opening)/2);
  }
  // Six subsidiary sanctuaries sit directly against A1. The protection
  // nomination shows their actual relationship (A1–A7 ground plan, p.81).
  // The A11 pin lies east of its exposed plinth. Register the masonry to the
  // southwest corner on the plan and the 2022 post-conservation aerial.
  const aBoundary=[[-31.3,17.2],[-29.9,-5.7],[-28.4,-30.6],[-6.1,-29.3],[20.8,-27.7],[17.9,20.1],[-31.3,17.2]];
  function nearBoundary(points,x,z){
    return points.slice(1).some(([b,d],i)=>{
      const [a,c]=points[i],dx=b-a,dz=d-c,t=Math.max(0,Math.min(1,((x-a)*dx+(z-c)*dz)/(dx*dx+dz*dz)));
      return Math.hypot(x-a-t*dx,z-c-t*dz)<2.6;
    });
  }
  function enclosure(put,k,points,breaks){
    for(let i=1;i<points.length;i++){
      const [a,c]=points[i-1],[b,d]=points[i],span=Math.hypot(b-a,d-c);
      for(const [u,v] of breaks[i]??[[0,1]]){
        const t=(u+v)/2;
        put(a+(b-a)*t,c+(d-c)*t,Math.atan2(c-d,b-a),()=>block(k,old,0,-.19,0,span*(v-u),.46,.65));
      }
    }
  }
  register('a','node/1037737181','Nhóm tháp A · Mỹ Sơn',108.125145,15.762591,58,59,{
    source:restored,photo:after,modeledBuildings:['w198804448','w198804451'],gardenRadius:34,
    replacesWall:(x,z)=>nearBoundary(aBoundary,x,z),
    description:'Đế tháp A1 còn giữ trục hai cửa đông – tây và dấu sáu điện nhỏ quanh thân. Ở A10, đài thờ sa thạch nằm lộ thiên giữa các đoạn tường gạch. Cảnh dựa theo mặt bằng và ảnh chụp sau đợt bảo tồn kết thúc năm 2022.',
    views:[view('Chân tháp A1 và sáu điện nhỏ',-1,0,4.5,32,-1.64,.49),
      {...view('Đài thờ Mỹ Sơn A10',-2,-15.4,5.2,17,-1.28,.38),title:'Đài thờ tháp A10 – Mỹ Sơn'},
      {...view('Nền A11 ở góc tây nam',-29.6,17.2,2.8,13,-.93,.38),title:'Nền tháp A11 – Mỹ Sơn'}]
  },(T,k)=>{
    const put=sitesOnGround(T,k),yaw=-.13;
    put(-1.4,-.3,yaw,()=>{
      mould(k,15.7,12.5,-.37,.75,red);mould(k,13.2,14.8,.31,.35,brick);
      cell(k,9.4,8.1,.96,0);
      for(const s of [-1,1]){
        for(const x of [-4.5,0,4.5])k.place(x,s*6.5,0,()=>cell(k,2.25,2.14,.39,s));
        k.place(s*6.4,0,0,()=>tread(k,s,1.16,2.55,6,2.72));
        k.place(0,s*3.5,0,()=>wall(k,8.5,.87,[.72,1.15,1.66,1.37,.88,.59],red,1.06));
      }
      rubble(k,-3.5,-4.5,2.7,3.4,14);
    });
    put(-1.7,-15.5,yaw,()=>{
      mould(k,13.8,7.35,-.3,.75,red);mould(k,11.8,7.9,.43,.42,brick);
      block(k,brick,.83,.81,0,6.45,.46,6.04);
      for(const s of [-1,1])k.place(.68,s*2.72,0,()=>wall(k,6.72,1.04,s<0?[2.4,2.9,2.66,2.2,2.4,2.17,1.99]:
        [1.84,2.20,2.54,2.33,2.59,2.32,2.45],s<0?red:brick,1.16));
      k.place(3.75,0,half,()=>wall(k,5.64,.94,[2.0,2.55,2.75,2.57,2.4],red,1.16));
      for(const s of [-1,1])k.place(-3.39,s*1.96,0,()=>wall(k,2.76,.87,[1.84,2.33,2.72,2.34],brick,.85));
      sandstoneDoor(k,-4.36,.89,.01,1.66,2.86,-half);
      k.place(-4.25,0,0,()=>tread(k,-1,.92,2.40,6,2.60));
      // Published dimensions of the five courses and the monolithic linga-yoni.
      lingam(k,1.05,1.23,0,2.24);
    });
    put(-29.9,17.2,yaw,()=>{cell(k,5.7,5.85,.91);rubble(k,1.4,0,2.15,2.7,12);});
    put(-33.0,-6.9,yaw,()=>{mould(k,4.24,4.13,-.28,.64);for(const s of [-1,1])block(k,red,0,.35,s*1.32,2.9,.91,1.02);});
    enclosure(put,k,aBoundary,{1:[[.14,1]],2:[[0,.05],[.22,1]],6:[[0,.93]]});
  });

  // B, C and D overlap in a single archaeological precinct. Draw each
  // foundation once. Relative placements without a surveyed polygon use the
  // B/C/D plan in the UNESCO nomination, registered to B3, B5, C1, D1 & D2.
  const axis=-.31;
  function pilaster(k,x,z,w,base,h){
    block(k,red,x,base,z,w,h,.28);
    for(const s of [-1,1])block(k,orange,x+s*w*.29,base+.15,z+.14,.10,h-.29,.074);
    block(k,orange,x,base+h-.22,z+.03,w*1.28,.22,.40);
    block(k,brick,x,base,z+.04,w*1.30,.28,.42);
    block(k,red,x,base+h-.42,z+.09,w*1.16,.09,.37);
  }
  function pointed(k,x,y,z,w,h,c){
    const a=w/2;
    k.outline([[-a,0],[-a,h*.37],[-a*.78,h*.64],[-a*.41,h*.80],[0,h],[a*.44,h*.79],
      [a*.77,h*.62],[a,h*.37],[a,0]],c,x,y,z,.18);
  }
  function baluster(k,x,y,z,h){
    for(const [w,b,r] of [[.17,0,.12],[.095,.12,.20],[.16,.32,.15],[.073,.47,.24],[.133,.71,.16],[.16,.87,.13]])
      k.tapered(stone,x,y+h*(b+r/2),z,w,w*.91,h*r,1,8);
  }
  // A tile-like curved cap would misrepresent these solid corbelled brick
  // roofs. Loft their inverted saddle profile between raised end gables.
  function saddle(T,k,length,depth,y,rise,endLift,weathered){
    const sections=19,rows=10,v=[],ix=[];
    for(let side=0;side<2;side++)for(let j=0;j<=rows;j++)for(let i=0;i<=sections;i++){
      const u=i/sections,t=j/rows,n=2*u-1,sg=side?1:-1;
      const worn=weathered*(.18+.19*Math.sin(9*u)**2+.18*Math.sin(23*u)**2)*t;
      const lift=rise*t+endLift*n**4*t-worn;
      v.push(n*length*(.5-.017*t),y+lift,sg*depth*.5*(1-.88*t**.82));
      if(i&&j){const q=v.length/3-1,p=q-sections-2;ix.push(p,p+1,q-1,p+1,q,q-1);}
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(ix);geo.computeVertexNormals();
    // A second winding is needed for the outward face of both sloping sides.
    k.stamp(geo,red,0,0,0);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];
    geo.setIndex(ix);geo.computeVertexNormals();k.stamp(geo,brick,0,0,0);geo.dispose();
    for(const s of [-1,1])k.place(s*length*.481,0,s*half,()=>{
      k.outline([[-depth*.50,0],[-depth*.36,rise*.52],[-depth*.13,rise+endLift*.82],
        [0,rise+endLift],[depth*.13,rise+endLift*.82],[depth*.36,rise*.52],[depth*.5,0]],old,0,y,0,.16);
      pointed(k,0,y+.03,.13,depth*.72,rise*.90+endLift*.7,brick);
      pointed(k,0,y+.05,.29,depth*.51,rise*.70+endLift*.33,red);
      pointed(k,0,y+.06,.43,depth*.26,rise*.49,old);
    });
    for(let i=0;i<sections;i++){
      const u=(i+.5)/sections,n=2*u-1,cap=y+rise+endLift*n**4-weathered*(.18+.19*Math.sin(9*u)**2+.18*Math.sin(23*u)**2);
      block(k,i%5?red:old,n*length*.484,cap-.16,0,length*.98/sections+.02,.22,depth*.139);
    }
  }
  function treasury(T,k,w,d,body,roofRise,root){
    const base=.85,trim=base+body;
    mould(k,w+.76,d+.66,-.31,.57,old);mould(k,w+.47,d+.46,.24,.30);mould(k,w+.13,d+.14,.53,.32,orange);
    for(const s of [-1,1])k.place(s*(w/2-.19),0,s*half,()=>{
      block(k,red,0,base,0,d,.57,.43);
      for(const side of [-1,1])block(k,brick,side*(d*.25+.45),base+.55,0,d*.5-.89,body-.55,.53);
      block(k,brick,0,base+2.22,0,d,Math.max(.20,body-2.22),.47);
      for(const x of [-.55,0,.55])baluster(k,x,base+.56,.07,1.66);
      for(const x of [-d*.43,d*.43])pilaster(k,x,.16,.46,base,body-.10);
    });
    block(k,red,0,base,d/2-.18,w,body,.44);
    for(const s of [-1,1]){
      block(k,brick,s*(w*.25+.56),base,-d/2+.13,w*.5-1.12,body,.51);
      for(let j=0;j<3;j++){
        const x=s*(1.46+j*(w*.5-1.8)/2);
        k.place(x,-d/2-.14,Math.PI,()=>pilaster(k,0,0,.45,base,body));
        pilaster(k,x,d/2-.02,.45,base,body);
      }
    }
    block(k,old,0,base+body*.72,-d/2+.05,2.45,body*.28,.82);
    sandstoneDoor(k,0,base,-d/2-.12,1.87,body*.67,Math.PI);
    for(let i=0;i<3;i++)mould(k,w+.36+i*.19,d+.40+i*.18,trim+i*.16,.18,i%2?orange:old);
    saddle(T,k,w+.69,d+.69,trim+.46,roofRise,root,1);
    // Small flame niches survive between the engaged pilasters of B5.
    for(const s of [-1,1])for(const x of s<0?[-w*.32,w*.32]:[-w*.32,0,w*.32])k.place(x,s*(d/2+.19),s<0?Math.PI:0,()=>{
      pointed(k,0,base+.61,0,.78,1.76,orange);pointed(k,0,base+.72,.185,.53,1.30,old);
      pointed(k,0,base+.80,.34,.31,.62,brick);
      k.tapered(brick,0,base+1.55,.45,.11,.104,.19,.76,7);
    });
  }
  function bGroup(T,k){
    const put=sitesOnGround(T,k);
    put(-5.84,-.33,axis,()=>{
      // B1 is visible as courses of stone, a cruciform plinth and chamber.
      const tiers=[[14.9,12.4,-.32,.64],[13.9,11.5,.30,.36],[12.9,10.8,.65,.37]];
      for(const [w,d,y,h] of tiers){
        for(const s of [-1,1]){block(k,blackStone,0,y,s*(d/2-.95),w*.69,h,1.90);block(k,stone,s*(w/2-.89),y,0,1.78,h,d*.66);}
      }
      for(const s of [-1,1]){
        for(let i=0;i<6;i++){const x=-4.5+i*1.72;block(k,i%3?stone:edge,x,1.01,s*3.20,1.65,.38+((i+s+3)%4)*.096,1.07);}
        block(k,stone,-5.31,1.0,s*1.11,1.29,.61,2.10);
        block(k,blackStone,5.8,.48,s*1.64,4.6,.50,.85);
      }
      lingam(k,-.08,.02,0,1.58);
    });
    put(-18.49,9.36,-.25,()=>{
      // B3, 9.5 m, was recorded leaning southwest. Offset the upper tiers
      // westwards and leave the stepped summit broken where the bricks stop.
      mould(k,5.16,4.81,-.36,.83,old);mould(k,4.86,4.52,.42,.57,brick);
      for(const s of [-1,1]){
        block(k,old,-.10,.92,s*1.68,4.42,4.60,.70);
        k.place(-.10,s*1.97,s<0?Math.PI:0,()=>{
          for(const x of [-1.74,1.74])pilaster(k,x,0,.54,.77,4.95);
          pointed(k,0,1.16,.07,2.28,3.88,brick);pointed(k,0,1.36,.25,1.52,2.91,old);
        });
      }
      block(k,old,-2.01,1.0,0,.58,4.6,3.56);sandstoneDoor(k,1.91,.91,0,1.14,2.61,half);
      const heights=[1.04,.94,.87,.80,.71,.61,.53,.43,.31];
      for(let i=0;i<heights.length;i++){
        const w=4.75*heights[i],x=-.16-i*.032,z=.04+i*.027;
        block(k,i%3===1?brick:old,x,5.38+i*.42,z,w,.49,w*.94);
        if(i%2===0)for(const s of [-1,1])k.box(red,x+s*w*.31,5.68+i*.42,z+w*.37,.25,.32,.24);
      }
      rubble(k,-.4,0,1.4,1.2,8);
    });
    put(.93,14.88,-.356,()=>treasury(T,k,10.24,5.81,4.43,1.86,.99));
    put(10.59,-4.33,axis,()=>{
      cell(k,4.69,3.49,1.69);
      k.place(-1.42,1.58,0,()=>wall(k,2.13,.82,[3.4,3.9,4.14,3.87,3.3],old,.43));
      sandstoneDoor(k,.15,.44,1.72,1.14,2.71,0);
    });
    put(11.77,5.39,axis,()=>cell(k,4.24,3.64,1.69,0));
    put(-9.37,10.91,axis,()=>cell(k,4.08,3.19,1.24));
  }
  register('b','node/1037737163','Nhóm tháp B · Mỹ Sơn',108.124022,15.763050,49,47,{
    source:inventory,photo:'https://commons.wikimedia.org/wiki/Category:My_Son_B5',
    modeledBuildings:['w627379348','w1360680181'],
    description:'Cụm B nhìn từ nền đá sa thạch B1 tới tháp kho B5. B5 có mặt bằng dài, cửa mở về bắc và hai đầu mái vút lên. Về phía tây nam là tháp B3 với những tầng gạch trên đã sứt vỡ.',
    views:[view('Mái yên ngựa và cửa bắc tháp B5',1,14.8,8,20,-2.61,.19),
      view('Đế đá và lòng điện B1',-5.8,0,3.65,23,-2.43,.58),view('Thân tháp B3',-18.4,9.3,9.8,19,-.68,.14)]
  },bGroup);

  register('c','node/1037737395','Nhóm tháp C · Mỹ Sơn',108.124123,15.763277,41,35,{
    source:nomination,photo:'https://seaarts.sac.or.th/artwork/461?lang=en',modeledBuildings:['w1360680182'],
    description:'Điện chính C1 có tiền sảnh nối liền gian thờ phía tây. Hai khối mái gạch còn giữ dáng thuôn dài, các mặt bên có cửa giả nhô ra. Dọc mép bắc sân là nền của những điện nhỏ.',
    views:[view('Tiền sảnh và gian thờ C1',-8.5,2.6,8.4,21,1.02,.19),view('Dãy nền điện ở phía bắc',-5.6,-6.6,4.3,21,-2.45,.48)]
  },(T,k)=>{
    const put=sitesOnGround(T,k);
    put(-8.46,1.81,-.21,()=>{
      const w=6.32,d=5.65,h=4.62;
      k.place(-1.19,0,0,()=>{
        mould(k,w+.90,d+.71,-.30,.72,old);mould(k,w+.59,d+.57,.36,.45,brick);
        block(k,old,-w/2+.30,.77,0,.64,h,d);
        for(const s of [-1,1])k.place(0,s*(d/2-.19),s<0?Math.PI:0,()=>{
          block(k,red,0,.77,0,w,h,.58);
          for(const x of [-2.65,-1.68,1.68,2.65])pilaster(k,x,.16,.52,.73,h-.13);
          block(k,red,0,.73,.37,1.84,2.03,.52);
          pointed(k,0,1.41,.63,2.20,2.9,brick);pointed(k,0,1.55,.82,1.49,2.09,old);
          pointed(k,0,1.71,1.02,.75,1.03,red);
        });
        for(let i=0;i<4;i++)mould(k,w+.12+Math.sin(i)*.25,d+.20+Math.sin(i)*.25,5.22+i*.15,.18,i%2?old:brick);
        saddle(T,k,6.32,5.62,5.81,1.62,.43,1);
      });
      k.place(3.55,0,0,()=>{
        mould(k,5.23,3.71,-.32,.83,red);
        for(const s of [-1,1])k.place(0,s*1.36,s<0?Math.PI:0,()=>{
          block(k,old,0,.49,0,5,3.24,.51);
          for(let j=0;j<5;j++)pilaster(k,-1.99+j*1.0,.16,.38,.56,3.02);
        });
        sandstoneDoor(k,2.28,.51,.05,1.32,2.62,half);
        mould(k,5.18,3.82,3.65,.34,old);saddle(T,k,5.06,3.75,3.96,1.07,.46,1.6);
      });
    });
    for(const [x,z,w,d,h] of [[9.39,-5.24,4.16,3.36,1.65],[-.72,-7.89,3.35,3.44,1.30],
      [-5.62,-10.51,4.66,3.18,1.18],[-12.60,-12.70,4.72,3.43,1.61],[2.10,14.0,5.13,3.69,1.96]]){
      put(x,z,axis,()=>cell(k,w,d,h));
    }
    put(3.62,5.5,axis,()=>cell(k,4.1,3.31,1.37,0));
  });

  function displayHall(T,k,w,d,main){
    const roof=0x83685a,metal=0x6d6c62,base=.55,top=3.96;
    k.palette({metal:[roof,metal]});mould(k,w+.63,d+.53,-.35,.64,old);mould(k,w+.32,d+.25,.26,.29,red);
    for(const s of [-1,1])k.place(0,s*(d/2-.17),s<0?Math.PI:0,()=>{
      block(k,old,0,base,0,w,1.10,.49);
      block(k,red,0,3.03,0,w,top-3.03,.49);
      const bays=main?3:2,step=w/bays;
      for(let j=0;j<bays;j++){
        const cx=(j-(bays-1)/2)*step,window=1.12;
        for(const sign of [-1,1])block(k,old,cx+sign*(step+window)/4,1.63,0,(step-window)/2+.015,1.43,.49);
        for(const t of [-1,0,1])baluster(k,cx+t*.35,1.58,.02,1.43);
        for(const t of [-1,1])pilaster(k,cx+t*step*.40,.23,.41,.50,3.36);
      }
    });
    for(const s of [-1,1])k.place(s*(w/2-.17),0,s*half,()=>{
      for(const side of [-1,1])block(k,red,side*(d+1.62)/4,base,0,(d-1.62)/2+.04,3.38,.46);
      sandstoneDoor(k,0,base,0,1.48,2.58,0);block(k,old,0,3.35,0,2.06,.64,.49);
      k.outline([[-d/2,0],[0,1.12],[d/2,0]],old,0,3.84,-.12,.43);
    });
    // The conservation roofs documented by the Management Board are sheet
    // metal on steel trusses. Do not reconstruct the ancient corbelled vault.
    const run=d*.5+.21,rise=1.25,slope=Math.atan2(rise,run);
    for(const s of [-1,1]){
      k.box(roof,0,top+rise*.5,s*run*.5,w+.50,.11,Math.hypot(run,rise),0,s*slope);
      for(let j=0;j<=12;j++){
        const x=(j/12-.5)*(w+.42);
        CentralArch.strut(T,k,metal,x,top+rise+.062,0,x,top+.068,s*run,.019);
      }
    }
    block(k,metal,0,top+rise-.012,0,w+.56,.12,.17);
    for(let i=0;i<3;i++){
      const x=(i-1)*w*.244;
      const z=(i%2?1:-1)*d*.24;
      block(k,blackStone,x,.55,z,1.48,.52,.86);
      k.tapered(stone,x,1.39,z,.38,.20,.68,1,8);
    }
  }
  register('d','node/2088919736','Nhóm nhà dài D · Mỹ Sơn',108.124300,15.763065,45,43,{
    source:'https://disanvanhoamyson.vn/tin-tuc/quan-ly-van-hanh-kho-bao-quan-hien-vat-chat-lieu-da-trong-moi-truong-kho-mo-tai-di-tich-my-son.html',
    photo:'https://disanvanhoamyson.vn/tin-tuc/quan-ly-van-hanh-kho-bao-quan-hien-vat-chat-lieu-da-trong-moi-truong-kho-mo-tai-di-tich-my-son.html',
    modeledBuildings:['w198804453','w198804455'],
    description:'D1 và D2 là hai nhà dài trước các điện B1 và C1. Cửa ở hai đầu hồi, giữa các trụ gạch có cửa sổ con tiện đá. Khung sắt và mái tôn được thêm khi trùng tu để bảo vệ hiện vật.',
    views:[view('Hai nhà dài trên trục nghi lễ',1,.8,7,38,1.29,.52),view('Cửa sổ con tiện của D1',-.49,10.7,5.1,14,.38,.13),
      view('Đầu hồi nhà D2',4.55,-10.2,5.5,20,1.78,.13)]
  },(T,k)=>{
    const put=sitesOnGround(T,k);
    put(-.49,11.12,-.30,()=>displayHall(T,k,15.65,7.84,true));
    put(4.54,-10.23,-.36,()=>displayHall(T,k,14.71,7.67,false));
  });

  register('e','node/1037736905','Nhóm tháp E · Mỹ Sơn',108.125185,15.764466,53,47,{
    source:inventory,photo:surveyPhoto,modeledBuildings:['w627379365'],
    description:'Ở góc đông nam khu E, tháp kho E7 mở cửa về bắc và có mái cong dọc theo trục đông – tây. Màu gạch trên phần đã tu bổ khác với chân tháp cũ. Cảnh tập trung vào E7 sau đợt bảo tồn 2011–2013.',
    views:[view('Cửa bắc của tháp kho E7',10,10.6,7.4,22,2.86,.22),view('Đầu hồi và tầng mái E7',10.1,10.5,8.3,20,1.22,.23)]
  },(T,k)=>{
    const put=sitesOnGround(T,k);
    put(10.08,10.65,-.13,()=>{
      mould(k,9.49,5.97,-.29,.81,old);mould(k,9.11,5.61,.52,.48,dark);mould(k,8.89,5.43,1.0,.36,old);
      const w=8.54,d=4.98;
      block(k,orange,0,1.34,d/2-.23,w,3.55,.52);
      for(const s of [-1,1]){
        k.place(s*(w/2-.28),0,s*half,()=>{
          block(k,brick,0,1.34,0,d,3.56,.59);
          for(const x of [-1.91,1.91])pilaster(k,x,.19,.63,1.34,3.41);
          pointed(k,0,1.49,.33,2.72,3.11,orange);pointed(k,0,1.66,.53,2.0,2.53,old);
          pointed(k,0,1.84,.72,1.16,1.85,red);
        });
        block(k,orange,s*2.64,1.34,-2.24,3.30,3.54,.56);
        k.place(s*2.59,-2.47,Math.PI,()=>{for(const x of [-.92,.92])pilaster(k,x,.1,.42,1.35,3.42);});
      }
      sandstoneDoor(k,0,1.34,-2.63,1.55,2.62,Math.PI);
      k.place(0,-2.98,-half,()=>tread(k,-1,1.31,2.29,6,2.52));
      for(let i=0;i<4;i++)mould(k,w+.13*i,d+.13*i,4.78+i*.15,.17,i%2?orange:brick);
      // The narrow high roof sits on its own drum above the broad cornice.
      block(k,old,0,5.39,0,7.12,1.03,3.24);mould(k,7.46,3.54,6.34,.23,brick);
      saddle(T,k,7.28,3.47,6.54,1.28,.48,0);
    });
  });

  // Brick and earth have banked up against the ruined F1 chamber. Leave
  // its hollow centre and western access open beneath the protective roof.
  function f1Debris(T,k){
    const v=[],ix=[],n=32,rings=5;
    for(let j=0;j<=rings;j++)for(let i=0;i<=n;i++){
      const vj=j/rings,a=2*Math.PI*(i%n)/n,c=Math.cos(a),s=Math.sin(a);
      const irregular=.13*Math.cos(3*a)+.065*Math.sin(7*a+vj*3)+.04*Math.sin(i*2.3+j);
      const r=.64+vj*(.60+irregular);
      const x=5.57*Math.sign(c)*Math.abs(c)**.82*r,z=5.06*Math.sign(s)*Math.abs(s)**.82*r;
      const access=Math.max(.10,Math.min(1,(1+c)*3+.5*Math.abs(s)));
      const head=(2.7+1.35*c-.69*s+.49*Math.sin(a*3))*access;
      const y=.07+head*(1-vj)**1.22+.13*Math.sin(i*2.6+j)*Math.sin(vj*Math.PI);
      v.push(x,y,z);
      if(i&&j){const q=v.length/3-1,p=q-n-2;ix.push(p,p+1,q-1,p+1,q,q-1);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));
    g.setIndex(ix);g.computeVertexNormals();k.stamp(g,red,0,0,0);g.dispose();
    for(let i=0;i<36;i++){
      const a=2*Math.PI*k.random(),c=Math.cos(a),s=Math.sin(a),r=.79+.45*k.random();
      const h=Math.max(0,(1-(r-.64)/.60))**1.22*(2.7+1.35*c-.69*s+.49*Math.sin(a*3))*Math.max(.1,Math.min(1,(1+c)*3+.5*Math.abs(s)));
      k.box(i%4===0?old:brick,5.57*Math.sign(c)*Math.abs(c)**.82*r,h+.08,5.06*Math.sign(s)*Math.abs(s)**.82*r,
        .34+k.random()*.27,.15,.23,k.random()*2,.19*Math.sin(a),.21*c);
    }
  }
  register('f','node/1037737215','Nhóm tháp F · Mỹ Sơn',108.125257,15.764872,39,43,{
    source:worksite,photo:surveyPhoto,modeledBuildings:['w1360680180'],
    description:'Đền F1 nằm dưới nhà che bảo vệ. Mô hình ghi lại phần tường gạch và khung đỡ theo ảnh khảo sát trước đợt trùng tu 2025–2029. Hình dạng phế tích ngoài thực địa có thể thay đổi khi công tác bảo tồn tiếp diễn.',
    views:[view('Nhà che bảo tồn F1',0,-11.7,8.2,29,-1.05,.16),view('Lớp gạch và thanh chống F1',-.2,-11.7,5.0,12,-.84,.10)]
  },(T,k)=>{
    const put=sitesOnGround(T,k);put(-.24,-11.58,-.16,()=>{
      const zinc=0x73574c,iron=0x777568;
      k.palette({metal:[zinc,iron]});mould(k,12.0,11.38,-.23,.46,old);
      for(const s of [-1,1]){
        k.place(0,s*3.26,0,()=>wall(k,9.18,1.54,s<0?[2.10,3.17,4.38,5.28,5.96,6.74,6.33,5.12,4.38]:
          [1.24,1.85,2.72,3.51,4.23,5.58,5.89,4.86,4.2],old,.20));
        k.place(s*4.01,0,half,()=>wall(k,6.35,1.23,s<0?[1.1,1.4,2.5,2.7,2.1]:[4.8,5.5,6.2,6.5,5.5],red,.20));
      }
      f1Debris(T,k);
      rubble(k,-1,.3,12.4,10,60);
      // The broad lightweight canopy is a modern intervention, visible both
      // in ground photographs and on the mapped outline at F1.
      const width=19.15,depth=19.3,eave=8.37,rise=1.48,slope=Math.atan2(rise,depth/2);
      for(const s of [-1,1]){
        k.box(zinc,0,eave+rise*.5,s*depth*.25,width+.52,.10,Math.hypot(depth/2,rise),0,s*slope);
        for(const x of [-9.0,-4.5,0,4.5,9.0]){
          block(k,iron,x,0,s*9.13,.11,eave,.11);
          CentralArch.strut(T,k,iron,x,eave,s*9.13,x,eave+rise,0,.052);
          CentralArch.strut(T,k,iron,x,eave,s*9.13,x,eave,0,.045);
        }
        for(const x of [-7.4,7.4])CentralArch.strut(T,k,iron,x,.19,s*6.8,x*.50,4.45,s*3.88,.065);
      }
    });
  });

  function kala(k,x,y,z){
    k.place(x,z,0,()=>{
      pointed(k,0,y,.01,.72,.64,orange);
      for(const s of [-1,1]){
        k.box(old,s*.134,y+.29,.20,.16,.092,.10,0,0,s*.22);
        k.outline([[0,0],[-.108,.16],[.06,.13]],orange,s*.18,y+.018,.14,.09);
      }
      block(k,red,0,y+.12,.18,.12,.21,.09);
    });
  }
  const surveyG='https://isprs-archives.copernicus.org/articles/XL-5-W1/99/2013/isprsarchives-XL-5-W1-99-2013.pdf';
  const gBoundary=[[-20.9,-12.3],[-22,-3.7],[-22.7,1.7],[-24.5,16.2],[5.1,20],[8.8,-8.6],[-20.9,-12.3]];
  register('g','node/1037737078','Nhóm tháp G · Mỹ Sơn',108.125371,15.763350,49,36,{
    source:surveyG,photo:groupG,modeledBuildings:['w198804459','w198804461','w198804463','w198804465'],
    replacesWall:(x,z)=>nearBoundary(gBoundary,x,z),
    description:'Trên đồi thấp, G1 quay cửa về phía tây, thẳng trục với cổng G2 và nhà dài G3. Những mặt Kala bằng đất nung nằm dọc chân điện. Cảnh thể hiện phần còn lại sau bảo tồn, để hở buồng thờ và các nền phụ.',
    views:[view('Cửa tây của điện G1',-11.3,2.2,6.8,24,-1.19,.24),view('Chân đế có mặt Kala',-10.8,4.0,3.8,11,.34,.17),
      view('Các nền trên đồi nhóm G',-18.5,1.9,4.0,52,1.12,.61)]
  },(T,k)=>{
    const put=sitesOnGround(T,k),a=-.14;
    put(-11.11,2.08,a,()=>{
      mould(k,11.7,7.88,-.31,.67,red);mould(k,9.93,8.02,.33,.56,old);
      for(const s of [-1,1]){
        k.place(.85,s*2.86,0,()=>wall(k,6.9,1.19,s<0?[2.07,3.0,3.7,4.46,4.05,3.53,2.98,1.98]:
          [1.1,1.64,2.29,2.83,3.38,3.28,2.51,2.32],red,.85));
        k.place(-3.21,s*1.54,0,()=>wall(k,3.29,.83,[1.35,1.69,2.18,2.59,2.77],brick,.77));
        for(let i=0;i<4;i++)k.place(-2.02+i*1.58,s*3.91,s<0?Math.PI:0,()=>kala(k,0,.34,0));
      }
      k.place(3.75,.04,half,()=>wall(k,5.97,1.16,[1.96,2.35,2.91,3.47,3.98,3.04],old,.85));
      k.place(-4.68,0,0,()=>tread(k,-1,.95,2.40,6,2.28));rubble(k,-1.45,0,2.06,2.72,12);
    });
    put(-23.34,-1.26,a,()=>cell(k,3.93,4.42,1.34,0));
    put(-32.51,-3.74,a,()=>cell(k,10.96,6.39,.50,0));
    put(1.21,13.75,a,()=>{
      cell(k,7.17,4.63,.89);k.place(0,-1.91,0,()=>wall(k,5.68,.77,[.88,1.25,2.09,2.67,2.26,1.64],old,.61));
    });
    put(-24.02,-10.69,a,()=>cell(k,3.41,3.65,.37));
    // OSM 627379362 traces the sanctuary enclosure. The processional axis
    // passes through the western gap between G3 and G1, via the G2 gate.
    enclosure(put,k,gBoundary,{2:[]});
  });

  register('h','node/1037737131','Nhóm tháp H · Mỹ Sơn',108.122910,15.764688,39,37,{
    source:restored,photo:after,modeledBuildings:['w1252183181'],
    description:'Trong vòng tường gạch nhóm H, mảng tường cao ở một đầu điện H1 nổi lên trên các bậc và nền H2, H4. Bậc cửa, lòng điện và lối lát gạch dựa theo hình chụp sau bảo tồn.',
    views:[view('Mảng tường còn đứng của H1',-4.6,-.68,6.2,19,1.02,.24),
      view('Sân và nền H2, H4',3.1,3.7,4.4,37,-.74,.60)]
  },(T,k)=>{
    const put=sitesOnGround(T,k),a=-.16;
    put(-4.65,-.37,a,()=>{
      mould(k,10.69,6.18,-.31,.73,red);mould(k,8.65,6.99,.36,.51,orange);
      for(const s of [-1,1])block(k,brick,0,.86,s*2.30,7.01,.58,.74);
      k.place(-3.43,0,half,()=>wall(k,4.67,1.23,[3.61,4.90,5.67,5.92,5.80,5.02,3.97],red,.87));
      k.place(-3.43,0,-half,()=>{
        for(const x of [-1.78,1.78])pilaster(k,x,.56,.48,.83,4.0);
        pointed(k,0,1.25,.65,1.98,3.62,brick);pointed(k,0,1.41,.84,1.38,2.67,old);
      });
      k.place(3.37,0,0,()=>tread(k,1,1.05,2.45,6,2.57));
    });
    put(9.52,1.42,a,()=>{
      cell(k,9.65,5.32,.44,0);
      for(const s of [-1,1])k.place(s*4.84,0,0,()=>tread(k,s,.45,2.36,3,1.47));
    });
    put(8.31,11.19,a,()=>{
      cell(k,6.24,4.38,.69,-1);k.place(-3.2,0,0,()=>tread(k,-1,.54,1.8,3,1.21));
    });
    put(1.80,.86,a,()=>ring(k,0,0,30.8,26.8,.28,4.62));
  });

  // The old Group K point marks the excavated approach southeast of the
  // gate. The two standing walls are about 80 m northwest, identifiable on
  // orthophotography at the northwest end of the uncovered brick causeway.
  const gateResearch='https://disanvanhoamyson.vn/tin-tuc/hoi-thao-bao-cao-so-bo-ket-qua-khai-quat-phia-dong-nam-thap-cong-k-khu-den-thap-my-son.html';
  register('my-son-thap-cong-k','node/2088919737','Tháp cổng K · Mỹ Sơn',108.121072,15.767737,54,56,{
    source:gateResearch,photo:after,
    description:'Hai mảng tường đứng đối diện, giữa là bậc qua tháp cổng K. Sau đợt bảo tồn 2017–2018, hai dải tường thấp hai bên lối dẫn tiếp tục cho thấy trục đi qua cổng. Mô hình đặt ngay chỗ còn hai mảng tường.',
    views:[view('Qua hai trụ tường cổng K',.8,1.2,6.5,20,.82,.14),
      view('Hai dải tường của lối dẫn',12.2,16.0,4.3,40,-1.18,.54)]
  },(T,k)=>{
    const put=sitesOnGround(T,k),a=-.90,c=Math.cos(a),s=Math.sin(a);
    put(0,0,a,()=>{
      mould(k,7.98,6.84,-.33,.65,red);
      for(const side of [-1,1]){
        k.place(0,side*2.03,0,()=>{
          mould(k,4.76,1.79,.28,.51,orange);mould(k,4.48,1.62,.76,.47);
          wall(k,3.83,1.05,side>0?[3.62,4.82,5.30,5.52,5.22,4.29,3.38]:
            [3.13,4.47,4.91,5.19,5.39,4.80,3.82],red,1.21);
          block(k,old,side*.52,1.22,-side*.66,.64,3.69,.24);
          for(const x of [-1.38,1.38])block(k,orange,x,1.22,side*.49,.47,2.79,.22);
        });
        k.place(side*2.6,0,0,()=>tread(k,side,.76,2.68,5,2.14));
      }
    });
    // Upper edges follow the excavated grade in short pieces. Published
    // surviving wall segments each measure about 28 by 0.6 by 0.8 metres.
    for(const side of [-1,1])for(let i=0;i<8;i++){
      const along=6.08+i*3.48,z=side*3.54;
      put(along*c+z*s,z*c-along*s,a,()=>block(k,i%3?brick:red,0,-.28,0,3.52,.78,.61));
    }
  });

  // JICA basic design, drawings 2–4 (PDF pp.47–49): two enclosed wings
  // flank an open entrance lobby. The long east elevation is a real pierced
  // brick screen. The metal roof carries four strips of top lighting.
  register('bao-tang-my-son','way/627379326','Bảo tàng Mỹ Sơn',108.109240,15.772469,48,78,{
    kind:'Bảo tàng',source:jica,photo:'https://disanvanhoamyson.vn/bao-ton-va-phat-huy/bao-tang.html',gardenRadius:28,
    description:'Hai khối phòng gạch chạy dọc theo bờ suối, giữa là sảnh mở ra khoảng sân lát ô cỏ. Mái rộng và bốn dải lấy sáng che nhà trưng bày được hoàn thành năm 2005.',
    views:[view('Sảnh mở giữa hai khối trưng bày',2,0,5.7,30,1.44,.17),
      view('Mái che và sân ô cỏ',3.2,1,6.9,74,.62,.43),view('Màn gạch thông gió',-3.0,-13.8,4.6,19,1.87,.12)]
  },(T,k)=>{
    const put=sitesOnGround(T,k),a=-1.244;
    put(0,0,a,()=>{
      const cream=0xc1bcb0,steel=0xa5ab9f,glass=0x798d92;
      k.palette({stone:cream,metal:steel,glass});
      // Local X runs along the length, local -Z is the east public facade.
      mould(k,60.1,13.4,-.57,1.33,cream);
      for(const side of [-1,1]){
        const mid=side*17.23,w=23.45;
        block(k,cream,mid,.74,.5,w,4.48,11.9);
        block(k,glass,mid,1.02,-5.54,w-.34,3.79,.14);
        for(let j=0;j<15;j++){
          const pitch=.65,depth=.28,offset=(j%2)*pitch*.5,start=-w*.5;
          for(let i=-1;i<37;i++){
            const left=Math.max(start,start+i*pitch+offset),right=Math.min(w*.5,start+i*pitch+offset+.45);
            if(right>left+.045)block(k,j%3?brick:orange,mid+(left+right)/2,.76+j*.238,-5.92,right-left,.166,depth);
          }
        }
        for(const z of [-3.42,3.42])block(k,glass,mid,5.65,z,17.85,.11,1.09);
      }
      for(const x of [-28.0,-19.2,-12.03,-5.03,5.03,12.03,19.2,28])for(const z of [-5.4,5.4]){
        block(k,cream,x,.69,z,.24,4.18,.24);
      }
      // Profile of the continuous shallow metal roof and raised skylights.
      for(const s of [-1,1])k.box(steel,0,5.07,s*4.62,64.28,.14,9.35,0,s*.048);
      for(const side of [-1,1])for(const z of [-3.4,3.4]){
        const mid=side*17.23;block(k,glass,mid,5.27,z,17.89,.36,.77);
        block(k,steel,mid,5.62,z,17.97,.076,1.06);
      }
      block(k,0x837461,-2.98,.75,.75,2.4,.93,1.13);
      for(let i=0;i<4;i++)block(k,cream,0,-.22,-7.3-i*.42,8.78,.96-i*.18,.48);
      k.place(0,-5.47,Math.PI,()=>k.sign('BẢO TÀNG MỸ SƠN',0,3.76,0,3.98,.53,false));
    });
    // The public court extends east of the screen. Each square is a stone
    // paver separated from its neighbours by a narrow grass strip.
    for(let j=0;j<4;j++)for(let i=0;i<19;i++){
      const x=(i-9)*2.80,z=-9.5-j*2.73;
      put(x*Math.cos(a)+z*Math.sin(a),z*Math.cos(a)-x*Math.sin(a),a,()=>block(k,stone,0,-.10,0,2.40,.17,2.40));
    }
  });
})();
