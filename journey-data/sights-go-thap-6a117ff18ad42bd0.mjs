const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Survey 2026-11-22. The archaeological precinct pin n8459780109 lies east
  // of the excavation. Vietnam Institute of Archaeology locates the mound at
  // 10°36′14″N,105°49′40″E and reports a 17.3 m excavated east-west extent.
  // https://khaocohoc.vass.gov.vn/tap-chi/go-thap-khu-do-thi-co-cua-vuong-quoc-phu-nam-583242
  // https://vanhoanghethuat.vn/di-san-van-hoa-go-thap-gia-tri-va-tiem-nang-77747663.html
  // https://dsvh.gov.vn/di-tich-khao-co-va-kien-truc-nghe-thuat-go-thap-2966
  // Commons photos 68367921 (Sgnpkd) and 60704851 (trungydang) place the rail
  // and shelter in this same cluster. No footprint is mapped under the canopy.
  // The eaves and rail returns are estimated from the 2023 MobiFone ground
  // panorama, its two gables, and the published 17.3 × 12 m partial excavation.
  // https://smarttravel-vr.mobifone.vn/vr-tour/khu-di-tich-go-thap/64c7810b3ac0811fa5dbb038
  // Remaining courses and finds, also shown in Đặng Văn Thắng et al., fig. 9:
  // https://sci-cult.net/index.php/cult/article/download/2230/3616/21460
  // The mound, foundations and low modern fragment are distinct. The original
  // statues are in the Đồng Tháp Museum; the scene shows the horizontal displays.
  const A=window.CentralArch,sites=window.VietnamSights??=[],catalogId='osm-node-8459780109';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Missing Gò Tháp archaeological site');
  const id='vishnu-go-thap-muoi',yaw=-1.45,cs=Math.cos(yaw),sn=Math.sin(yaw);
  const source='https://dsvh.gov.vn/di-tich-khao-co-va-kien-truc-nghe-thuat-go-thap-2966';
  const earth=0x8b7660,soil=0x706047,walk=0xb0a68f,washed=0xbbad92,steel=0xabae9d,dark=0x667365;
  const tin=0x548474,underside=0xb5b6a8,concrete=0xa79e87,clay=0x955f44;
  function noise(i,j,k=0){const n=Math.sin(i*127.1+j*311.7+k*63.87)*43758.5453;return n-Math.floor(n);}
  function beam(T,k,color,x0,y0,z0,x1,y1,z1,r,wide=1){
    const from=new T.Vector3(x0,y0,z0),delta=new T.Vector3(x1,y1,z1).sub(from),length=delta.length();
    const g=new T.CylinderGeometry(r*wide,r*wide,length,6);
    g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.divideScalar(length)));
    k.stamp(g,color,x0+(x1-x0)/2,y0+(y1-y0)/2,z0+(z1-z0)/2);g.dispose();
  }
  function inside(pts,x,z){
    let within=false;
    for(let i=0,j=pts.length-1;i<pts.length;j=i++){
      const [a,b]=pts[i],[c,d]=pts[j];
      if(((b>z)!==(d>z))&&x<(c-a)*(z-b)/(d-b)+a)within=!within;
    }
    return within;
  }
  function weathered(T,kind){
    const cv=document.createElement('canvas');cv.width=cv.height=192;
    const ctx=cv.getContext('2d'),pixels=ctx.createImageData(192,192),out=pixels.data;
    const p=kind==='wall'?[158,150,129]:kind==='floor'?[132,111,85]:[181,170,149];
    for(let j=0;j<192;j++)for(let i=0;i<192;i++){
      const phase=i/192*Math.PI*2,q=j/192*Math.PI*2,fine=noise(i,j,3);
      const patches=.51+.085*Math.sin(phase*4+Math.sin(q*3))+.072*Math.cos(q*5+Math.sin(phase*3));
      const moss=kind==='wall'?Math.min(1,(j/175)**2)*Math.max(0,(patches+.53*fine-.52)*1.77):0;
      const grain=(fine-.50)*(kind==='concrete'?57:45)+(patches-.5)*28;
      const k=(j*192+i)*4;
      for(let c=0;c<3;c++)out[k+c]=p[c]+grain-moss*[78,61,72][c];
      out[k+3]=255;
    }
    ctx.putImageData(pixels,0,0);const map=new T.CanvasTexture(cv);
    map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;
    if(kind!=='wall')map.repeat.set(.67,.67);
    return new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:.99});
  }
  function ring(T,k,points,lo,hi){
    const data=[],uv=[];
    for(let i=0;i<points.length;i++){
      const [ax,az]=points[i],[bx,bz]=points[(i+1)%points.length];
      data.push(ax,lo,az,bx,lo,bz,bx,hi,bz,ax,lo,az,bx,hi,bz,ax,hi,az);
      const u=Math.hypot(bx-ax,bz-az)*.64;uv.push(0,0,u,0,u,1,0,0,u,1,0,1);
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(data,3));geo.computeVertexNormals();
    // Faces on both sides are useful at the inside corner of the excavation.
    geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    const m=new T.Mesh(geo,weathered(T,'wall'));
    m.receiveShadow=true;k.group.add(m);
  }
  function slab(T,k,poly,bottom,height,color,finish,holes=[]){
    // The +Y top comes from extruding an XY profile then rotating it into XZ.
    const shape=new T.Shape();poly.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
    for(const pts of holes){
      const hole=new T.Path();pts.forEach(([x,z],i)=>i?hole.lineTo(x,-z):hole.moveTo(x,-z));hole.closePath();shape.holes.push(hole);
    }
    const g=new T.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false});g.rotateX(-Math.PI/2);
    if(finish){const m=new T.Mesh(g,weathered(T,finish));m.position.y=bottom;m.castShadow=m.receiveShadow=true;k.group.add(m);}
    else{k.stamp(g,color,0,bottom,0);g.dispose();}
  }
  function rail(T,k,x0,z0,x1,z1,y,r=.034){
    const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/2.20);
    for(let i=0;i<=n;i++){
      const t=i/n,x=x0+(x1-x0)*t,z=z0+(z1-z0)*t;
      k.stamp(k.round,steel,x,y+.49,z,r,.99,r);k.box(dark,x,y+.025,z,.11,.05,.11);
    }
    for(const dy of [.24,.49,.73,1.00])beam(T,k,steel,x0,y+dy,z0,x1,y+dy,z1,dy===1?r:.020);
  }
  function corrodedBrick(T){
    const corners=[[-.44,-.50],[.39,-.50],[.5,-.37],[.5,.40],[.38,.50],[-.43,.49],[-.50,.35],[-.50,-.32]];
    const bottom=corners.map(([x,z])=>[x,-.5,z]),top=corners.map(([x,z],i)=>[x*.97,.5-(i%3)*.027,z*.97]);
    const p=[],v=[],uv=[];
    function tri(a,b,c,col,face){
      for(const q of [a,b,c]){p.push(...q);v.push(...col);uv.push(q[0]+.5,face?q[2]+.5:q[1]+.5);}
    }
    for(let i=0;i<8;i++){
      const j=(i+1)%8,side=[.86,.66,.53];tri(bottom[i],top[j],bottom[j],side);
      tri(bottom[i],top[i],top[j],side);tri([0,.5,0],top[j],top[i],[.91,.91,.80],true);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));
    g.setAttribute('color',new T.Float32BufferAttribute(v,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
  }
  const patches=[
    // Broad pavement by the far gable. Its edge against the soil is broken.
    {height:.44,outline:[[-4.8,8.4],[-1.7,8.1],[-1.35,8.63],[1.50,8.53],[1.45,6.68],[3.62,6.60],[3.47,2.35],
      [2.50,2.27],[2.3,.10],[-1.95,-.19],[-2.80,.40],[-2.97,2.14],[-5.9,2.36],[-6.3,3.6],[-5.0,4.26],[-4.77,5.68]]},
    // Stepped, taller wall intersecting the pavement and the modern remnant.
    {height:1.18,outline:[[-5.78,-.52],[-5.96,-2.87],[-5.70,-4.11],[-4.63,-4.24],[-4.63,-5.64],
      [-2.94,-5.84],[-2.44,-7.73],[-1.25,-7.72],[-1.24,-4.64],[.08,-4.41],[.03,-2.91],
      [-.86,-2.48],[-.86,-.69],[-1.92,-.42],[-1.95,.65],[-4.44,.69],[-4.48,-.48]]},
    // Detached section opposite the stair with exposed parallel courses.
    {height:.67,outline:[[-7.32,2.78],[-7.12,1.81],[-7.28,.49],[-6.32,.05],[-5.75,.14],[-5.56,1.07],
      [-4.87,1.39],[-4.95,2.32],[-5.83,3.54],[-6.74,3.82]]},
    {height:.78,outline:[[.73,-4.33],[3.31,-4.86],[3.56,-2.04],[2.78,-1.48],[2.38,-.45],
      [1.21,-.42],[1.08,-2.04],[.34,-2.57]]},
    {height:.70,outline:[[-6.09,-7.94],[-3.20,-8.28],[-2.19,-7.98],[-2.51,-7.18],[-4.01,-6.98],
      [-4.19,-6.33],[-5.11,-6.34],[-5.17,-5.91],[-6.12,-5.95]]}
  ];
  function remains(T,k){
    const retained=[],cores=[],level=.103;
    for(const [sector,p] of patches.entries()){
      for(let row=-34;row<=36;row++)for(let col=-21;col<=13;col++){
        const x=col*.393+(row%2)*.177,z=row*.247;
        if(!inside(p.outline,x,z))continue;
        const wear=noise(col,row,sector),edge=[[.26,0],[-.26,0],[0,.23],[0,-.23]].some(([u,v])=>!inside(p.outline,x+u,z+v));
        const base=.15,above=base+p.height+.046*Math.sin(x*1.6+z*.76)
          +.048*Math.cos(x*.9-z*.68)+(wear-.52)*.045-(edge?.09+wear*.12:0);
        const course=Math.max(1,Math.ceil((above-base)/level));
        if(wear>.976&&edge)continue;
        // Continuous backing is visible in the open joints and at a change of
        // level between adjacent courses, especially under an eroded cap.
        cores.push([x,(above+.10)/2-.03,z,.329,above-.10-.06,.197]);
        // Include buried courses at uneven field edges so the tops, shoulders
        // and deep breaks continue in the same fired brick as the platform.
        const exposed=edge||[[.53,0],[-.53,0],[0,.47],[0,-.47]].some(([u,v])=>!inside(p.outline,x+u,z+v));
        for(let j=exposed?0:Math.max(0,course-2);j<course-1;j++){
          retained.push([x+(j%2-.5)*.014,base+(j+.5)*level,z,.399,level*.98,.247,(wear-.5)*.033,
            j%3?0xa88a69:0x987958]);
        }
        const moss=.49+.25*Math.sin(x*.75+z*.19)+.23*Math.cos(z*.76-x*.25)+(wear-.5)*.19;
        const shade=moss>.78?0x929573:moss>.53?0xa09b7c:moss>.34?0xaf9d7c:0xb59b7b;
        retained.push([x+(wear-.5)*.009,above-level*.5,z,.401-(edge?.020:0),level*.99,.251,(wear-.5)*(edge?.10:.025),shade]);
      }
    }
    const grain=document.createElement('canvas');grain.width=grain.height=64;const ctx=grain.getContext('2d'),dots=ctx.createImageData(64,64);
    for(let y=0;y<64;y++)for(let x=0;x<64;x++){
      const n=noise(x,y,53),c=(n<.09?159:215)+n*40,i=(y*64+x)*4;
      dots.data.set([c,c*.99,c*.96,255],i);
    }
    ctx.putImageData(dots,0,0);const map=new T.CanvasTexture(grain);map.colorSpace=T.SRGBColorSpace;
    const geometry=corrodedBrick(T),mat=new T.MeshStandardMaterial({map,vertexColors:true,roughness:.98});
    const mesh=new T.InstancedMesh(geometry,mat,retained.length),pose=new T.Object3D(),color=new T.Color();
    retained.forEach(([x,y,z,w,h,d,rot,tint],i)=>{
      pose.position.set(x,y,z);pose.scale.set(w,h,d);pose.rotation.y=rot;pose.updateMatrix();
      mesh.setMatrixAt(i,pose.matrix);mesh.setColorAt(i,color.setHex(tint));
    });
    mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();k.group.add(mesh);
    const fill=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:0x725b45,roughness:1}),cores.length);
    pose.rotation.set(0,0,0);
    cores.forEach(([x,y,z,w,h,d],i)=>{pose.position.set(x,y,z);pose.scale.set(w,h,d);pose.updateMatrix();fill.setMatrixAt(i,pose.matrix);});
    fill.castShadow=true;fill.receiveShadow=true;fill.computeBoundingSphere();k.group.add(fill);
    const overlay=[[-2.33,-6.84],[3.10,-7.09],[4.18,-6.82],[4.26,-3.89],[3.99,-3.14],[1.75,-2.68],[-.19,-2.53],[-2.24,-3.17]];
    const fractured=[];
    for(let j=0;j<overlay.length;j++){
      const a=overlay[j],b=overlay[(j+1)%overlay.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(len/.37);
      for(let i=0;i<n;i++){const t=i/n,shift=(noise(j,i)-.5)*.13;
        fractured.push([a[0]*(1-t)+b[0]*t+shift,a[1]*(1-t)+b[1]*t-shift*.70]);}
    }
    slab(T,k,fractured,.35,1.06,concrete,'concrete');
    const g=new T.IcosahedronGeometry(1,0);
    for(let i=0;i<172;i++){
      const x=-2.25+noise(i,1)*6.40,z=-7.05+noise(i,2)*4.49;
      if(!inside(overlay,x,z))continue;
      const v=noise(i,7);k.stamp(g,v>.55?0x9a907b:0xbdaf93,x,1.409+v*.009,z,.019+v*.038,.007+v*.023,.018+v*.041,v*4);
    }
    g.dispose();
  }
  function displayFigure(T,k,x,z,angle,length,bar){
    // The two horizontal, grey displays in the excavated find spots, seen in
    // the 2023 panorama hotspots and Đặng Văn Thắng's field photograph.
    k.place(x,z,angle,()=>{
      const stone=bar?0x979483:0x898675,S=length,geo=new T.SphereGeometry(1,12,8);
      const zBody=v=>(bar?v*.64-.18:v)*S,yBase=.090;
      function form(u,v,y,rx,rz,ry){
        k.stamp(geo,stone,u*S,yBase+y*S,zBody(v),rx*S,ry*S,rz*S*(bar?.64:1));
      }
      function limb(a,b,rad){
        beam(T,k,stone,a[0]*S,yBase+a[2]*S,zBody(a[1]),b[0]*S,yBase+b[2]*S,zBody(b[1]),rad*S);
      }
      const shape=[[-.327,.017],[-.307,.051],[-.281,.095],[-.258,.102],[-.172,.086],[-.088,.059],[-.032,.065],
        [.015,.086],[.091,.094],[.258,.084],[.344,.065]];
      const pts=[],n=14;
      const at=(j,i)=>{const [z,r]=shape[j],a=i/n*Math.PI*2;return [Math.cos(a)*r*S,yBase+(.038+.048*Math.sin(a))*S,zBody(z)];};
      for(let j=0;j<shape.length-1;j++)for(let i=0;i<n;i++)for(const [l,t] of [[j,i],[j,i+1],[j+1,i+1],[j,i],[j+1,i+1],[j+1,i]])pts.push(...at(l,t));
      const body=new T.BufferGeometry();body.setAttribute('position',new T.Float32BufferAttribute(pts,3));body.computeVertexNormals();k.stamp(body,stone,0,0,0);body.dispose();
      k.box(soil,0,.077,0,.46*S,.019,1.12*S);
      form(0,-.356,.065,.049,.056,.041);
      // High straight-sided kirita crown and the low ridge of the wrap.
      k.stamp(k.round,stone,0,yBase+.049*S,zBody(-.435),.047*S,.112*S*(bar?.64:1),.043*S,0,Math.PI/2);
      limb([-.019,.002,.087],[-.010,.361,.063],.009);
      for(const e of [-1,1]){
        limb([e*.038,.175,.048],[e*.040,.463,.042],.034);
        form(e*.046,.458,.04,.032,.040,.027);
        limb([e*.079,-.264,.057],[e*.118,-.154,.046],.029);
        limb([e*.118,-.154,.046],[e*.112,-.056,.073],.021);
        form(e*.111,-.048,.081,.019,.036,.022);
        if(!bar||e<0){
          limb([e*.094,-.241,.036],[e*.154,-.317,.036],.022);
          limb([e*.154,-.317,.036],[e*.109,-.433,.045],.020);
        }
        if(bar)limb([e*.108,-.047,.045],[e*.14,.478,.038],.018);
      }
      if(bar){
        k.box(stone,0,yBase+.032*S,.141*S,.33*S,.063*S,.069*S);
        slab(T,k,[[-.074*S,.17*S],[.074*S,.17*S],[.045*S,.44*S],[.022*S,.50*S],[-.025*S,.50*S],[-.044*S,.44*S]],yBase,.055*S,stone);
      }
      geo.dispose();
    });
  }
  const pit=[[-8.82,-8.53],[8.21,-8.53],[8.21,-.46],[4.25,-.46],[4.25,8.91],[-8.82,8.91]];
  const figures=[[4.12,-1.68,-1.40,1.47,true],[3.52,-.67,.28,.73,false]];
  function walkway(T,k){
    const findSpots=figures.map(([x,z,a,h])=>[[-.26,-.60],[.26,-.60],[.26,.60],[-.26,.60]].map(([u,v])=>
      [x+h*(u*Math.cos(a)+v*Math.sin(a)),z+h*(-u*Math.sin(a)+v*Math.cos(a))]));
    slab(T,k,pit,.06,.055,earth,'floor',findSpots);
    ring(T,k,pit.map(([x,z])=>[x*.9985,z*.9985]),.12,1.83);
    const apron=[[[-10.48,-10.3],[10.12,-10.3],[10.12,-8.53],[-10.48,-8.53]],
      [[-10.48,-8.53],[-8.82,-8.53],[-8.82,8.91],[-10.48,8.91]],
      [[-10.48,8.91],[10.12,8.91],[10.12,10.32],[-10.48,10.32]],
      [[8.21,-8.53],[10.12,-8.53],[10.12,8.91],[4.25,8.91],[4.25,-.46],[8.21,-.46]]];
    for(const p of apron)slab(T,k,p,.121,1.71,washed);
    for(let i=0;i<pit.length;i++){
      const a=pit[i],b=pit[(i+1)%pit.length];
      if(i===5){rail(T,k,a[0],a[1],a[0],-1.10,1.83);rail(T,k,a[0],-2.38,b[0],b[1],1.83);}
      else rail(T,k,a[0],a[1],b[0],b[1],1.83);
    }
    // Short flight along the wall into the excavated area, perpendicular to
    // the main visitor walkway. Both railings follow the descending treads.
    const count=9;
    for(let j=0;j<count;j++){
      const x=-8.69+j*.296,h=1.77-j*.182;
      k.box(walk,x,h*.5+.10,-1.74,.31,h,1.16);
    }
    for(const z of [-2.30,-1.18]){
      for(const dy of [.30,.60,.94])beam(T,k,steel,-8.84,1.84+dy,z,-6.13,.30+dy,z,.022);
      for(let j=0;j<3;j++){const x=-8.78+j*1.27,y=1.83-j*.72;k.stamp(k.round,steel,x,y+.47,z,.026,.94,.026);}
    }
  }
  function shelter(T,k){
    const left=-11.62,right=10.14,mid=(left+right)/2,z0=-10.93,z1=10.74;
    const eave=4.39,peak=6.50,half=(right-left)/2,run=z1-z0;
    const metalMat=new T.MeshStandardMaterial({color:tin,roughness:.87,metalness:.13});
    const backMat=new T.MeshStandardMaterial({color:underside,emissive:0x262920,roughness:.93,metalness:.10,side:T.DoubleSide});
    const verts=[],back=[];
    for(const dir of [-1,1]){
      const columns=112;
      for(let i=0;i<columns;i++)for(let wave=0;wave<4;wave++){
        const a=(i+wave/4)/columns,b=(i+(wave+1)/4)/columns;
        const at=(t,v,q)=>[mid+dir*half*t,peak+(eave-peak)*t+q,z0+run*v];
        const q0=wave===1||wave===2?.023:0,q1=wave===0||wave===1?.023:0;
        const p=[at(0,a,q0),at(1,a,q0),at(1,b,q1),at(0,b,q1)];
        const order=dir>0?[0,2,1,0,3,2]:[0,1,2,0,2,3];
        for(const ix of order){const [x,y,z]=p[ix];verts.push(x,y,z);back.push(x,y-.048,z);}
      }
      for(let j=1;j<9;j++){
        const a=j/9;k.box(dark,mid+dir*half*a,peak+(eave-peak)*a-.09,(z0+z1)/2,.09,.085,run);
      }
    }
    for(const [p,material] of [[verts,metalMat],[back,backMat]]){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();
      const mesh=new T.Mesh(g,material);mesh.castShadow=true;mesh.receiveShadow=true;k.group.add(mesh);
    }
    k.box(tin,mid,peak+.034,(z0+z1)/2,.24,.085,run+.12);
    for(const z of [z0,z1])k.outline([[left,eave],[mid,peak-.03],[right,eave]],underside,0,0,z,.052);
    for(let frame=0;frame<5;frame++){
      const z=z0+.12+(run-.24)*frame/4;
      for(const e of [-1,1]){
        const near=mid+e*(half-.37);
        k.box(concrete,near,1.82,z,.30,.32,.31);
        k.box(dark,near,3.05,z,.085,2.45,.085);
        beam(T,k,steel,near,eave-.15,z,mid,peak-.14,z,.055);
        beam(T,k,steel,near,eave-.26,z,mid,eave+.11,z,.050);
        for(let j=0;j<5;j++){
          const t=j/5,u=(j+1)/5,ax=near+(mid-near)*t,bx=near+(mid-near)*u;
          const low=eave-.25+.36*t,top=eave-.15+(peak-eave)*u;
          beam(T,k,steel,ax,low,z,bx,top,z,.029);
          if(j>0)beam(T,k,steel,ax,low,z,ax,eave-.15+(peak-eave)*t,z,.028);
        }
      }
    }
  }
  function slopingSides(T,k,foundation,terrainFit){
    const inner=[[-10.5,-10.3],[10.15,-10.3],[10.15,10.34],[-10.5,10.34]];
    const outer=[[-16.9,-16.0],[17.4,-16.5],[17.8,17.25],[-17.4,16.4]];
    const ps=[],shade=[],edgeVertices=[];
    for(let side=0;side<4;side++)for(let j=0;j<10;j++){
      const a=side,b=(side+1)%4,t0=j/10,t1=(j+1)/10;
      const at=(ring,t)=>[ring[a][0]+t*(ring[b][0]-ring[a][0]),ring[a][1]+t*(ring[b][1]-ring[a][1])];
      const location=(t,m)=>{
        const s=at(inner,t),o=at(outer,t),delta=Math.sin(t*4*Math.PI+side)*Math.sin(t*Math.PI)*.08;
        return [s[0]+(o[0]-s[0])*m*(1+delta),s[1]+(o[1]-s[1])*m*(1+delta)];
      };
      for(const [lo,hi] of [[0,.43],[.43,.75],[.75,1]]){
        const row=[location(t0,lo),location(t1,lo),location(t1,hi),location(t0,hi)];
        for(const i of [0,2,1,0,3,2]){
          const [x,z]=row[i],f=i>=2?hi:lo,index=ps.length/3;
          ps.push(x,0,z);edgeVertices.push([index,x,z,f]);
          const c=new T.Color(0x948367).lerp(new T.Color(0x65744b),f*.74);
          c.multiplyScalar(.87+.10*noise(side,j));shade.push(c.r,c.g,c.b,Math.min(1,(1-f)*2.8));
        }
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(ps,3));
    g.setAttribute('color',new T.Float32BufferAttribute(shade,4));g.computeVertexNormals();
    const m=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,transparent:true,side:T.DoubleSide,roughness:1}));
    m.receiveShadow=true;k.group.add(m);
    k.group.userData.fitGround=ground=>{
      terrainFit(ground);const p=g.getAttribute('position');
      for(const [i,x,z,f] of edgeVertices)p.setY(i,(1-f)*(foundation.height+1.815)+f*(ground(x,z)+.022));
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
    };
  }
  function heritageTree(T,k){
    // The local tourism office records approximately 25 m height and >8 m
    // basal girth. The flared trunk and small marker are visible in the pano's
    // “Cây Trôm Cổ Thụ” hotspot.
    // https://dulich.dongthap.gov.vn/vi/detailnews/?id=news_1351
    const bark=0x766d59,y=1.48;
    const p=[[-.66,1.15,.90],[.0,1.03,.95],[.41,.96,.76],[1.03,.90,.52],[1.73,.85,.35],[2.45,.79,.24],
      [3.60,.69,.17],[4.9,.60,.12],[6.15,.53,.10],[7.30,.42,.04],[8.40,.28,.03]];
    const vertices=[],colors=[],n=72,light=new T.Color(0x897f70),deep=new T.Color(0x504d42);
    function point(i,j){
      const t=(i%n)/n*Math.PI*2,[h,r,flare]=p[j],a=t+.035*h;
      const fold=.5+.5*Math.cos(7*a+.49*Math.sin(t*3)+.3*Math.cos(t));
      const radius=r+flare*fold**3+.12*Math.sin(3*t)+.043*Math.cos(13*t+.21*h);
      vertices.push(Math.cos(t)*radius+.05*h,y+h,Math.sin(t)*radius-.022*h);
      const col=deep.clone().lerp(light,.45+.33*fold+.13*Math.sin(t*14+.16*h));colors.push(col.r,col.g,col.b);
    }
    for(let j=0;j<p.length-1;j++)for(let i=0;i<n;i++)for(const [v,t] of [[i,j],[i,j+1],[i+1,j+1],[i,j],[i+1,j+1],[i+1,j]])point(v,t);
    const trunk=new T.BufferGeometry();trunk.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
    trunk.setAttribute('color',new T.Float32BufferAttribute(colors,3));trunk.computeVertexNormals();
    const tree=new T.Mesh(trunk,new T.MeshStandardMaterial({vertexColors:true,roughness:1}));tree.castShadow=tree.receiveShadow=true;k.group.add(tree);
    for(const [x,z,dx,dz] of [[-.32,.13,-1.80,.27],[.22,.22,1.36,.91],[.14,-.31,.35,-1.35]]){
      beam(T,k,bark,x,y+5.4,z,dx,y+9.35,dz,.33);
    }
    k.box(0x79624d,1.48,y+.14,.13,.94,.23,.52);
    k.box(0x726954,1.48,y+.35,.13,.85,.24,.42);
    k.outline([[-.37,0],[.37,0],[.37,.73],[.31,.83],[.14,.94],[-.04,.98],[-.24,.91],[-.37,.79]],
      0x786f57,1.48,y+.45,.10,.14);
    k.box(0x626653,1.48,y+.88,.254,.54,.60,.025);
    k.box(0xa09562,1.48,y+1.10,.28,.38,.035,.024);
  }
  function view(name,x,z,height,viewRadius,angle,viewElevation){
    return {name,offset:[x*cs+z*sn,-x*sn+z*cs],height,viewRadius,viewAngle:yaw+angle,viewElevation,viewBase:'monument'};
  }
  sites.push({...pin,id,catalogId,name:'Nền đền Vishnu Gò Tháp Mười (Khu di tích Gò Tháp)',lon:105.827793,lat:10.603877,yaw,
    start:pin.start,mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,width:24,depth:24,source,
    photo:'https://commons.wikimedia.org/?curid=68367921',kind:'Khảo cổ',
    description:'Dưới mái tôn bảo vệ còn những hàng gạch Óc Eo, mặt nền đứt đoạn và khối bê tông thuộc giai đoạn muộn. Phần nền đã khai quật dài khoảng 17,3 m theo hướng đông–tây. Hình dáng mái che và cao độ từng lớp gạch được ước theo ảnh tại chỗ.',
    arrivalNote:'Xe dừng trên đường D2 cạnh khu di tích. Từ đó đi bộ dưới tán cây tới lối quan sát quanh hố khai quật.',
    boundary:[[-12,-11.5],[10.8,-11.5],[10.8,11.2],[-12,11.2]],reserve:(x,z,r)=>Math.abs(x+.45)<15.35+r&&Math.abs(z)<15+r,
    solids:[],views:[view('Mái che bên cây trôm cổ thụ',-.45,-.1,8.6,26,-2.12,.09),
      view('Từ lan can nhìn xuống nền gạch',-1.25,-.45,5.45,10.9,-.60,.225),
      {...view('Hai vị trí phát hiện tượng Vishnu',3.84,-1.34,2.28,3.90,2.65,.64),
        description:'Hai vị trí tìm thấy tượng được minh họa ngay bên các lớp gạch. Hai pho tượng Vishnu phát hiện tại Gò Tháp Mười năm 1998 được bảo quản tại Bảo tàng Đồng Tháp.',arrivalNote:''}],
    build(T,k){
      k.palette({plaster:[washed,concrete],stone:[walk],metal:[steel,dark],brick:[clay]});
      const f=createTempleFoundations(T,k),foundation=f.building(0,0,0,20.58,20.64,()=>{
        walkway(T,k);remains(T,k);
        for(const args of figures)displayFigure(T,k,...args);
        shelter(T,k);k.place(-12.96,9.65,0,()=>heritageTree(T,k));
      });
      foundation.elevation=g=>Math.max(g(0,0),g(-8.6,-8.4),g(8.1,-8.4),g(4.2,8.81),g(-8.6,8.81))+.06;
      const marked=[[-12.96,9.65,25,16.8],[-.3,-12.8,17.8,12.1],[-15.1,-2.8,12.5,9.2],[12.5,-10.73,12.8,9.6],
        [14.5,13.6,12.1,8.4],[-11.5,-17.6,13.7,10.6],[16.9,2.4,11.5,8.01]];
      for(const [x,z,h,width] of marked){
        let tree;f.fixture(g=>h===25?foundation.elevation(g)+1.48:g(x,z),()=>{A.trees(T,k,[{x,z,h,width,kind:'banyan'}]);tree=k.group.children.at(-1);},h=>{tree.position.y=h;});
      }
      slopingSides(T,k,foundation,k.group.userData.fitGround);
    }});
})();

export default window.VietnamSights;
