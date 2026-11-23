'use strict';
(()=>{
  const id='bao-tang-phu-yen',catalogId='osm-way-232410041',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  if(!raw)return;
  const lon=109.3024012,lat=13.0948991,yaw=-2.455,pi=Math.PI;
  const source='https://phuyen.baodaklak.vn/kinh-te/202505/kien-truc-doc-dao-cua-bao-tang-phu-yen-8121581/';
  const tour='https://daklakvrtour.com/tour/51/index.html';
  // w232410041 outlines the entire 3 ha museum precinct. Distinct roof:
  // 77.7 × 31 m on Esri imagery, front NW. The aerial at node12 and the
  // architect's frontal photograph show a higher central fan, two tiled
  // wings, and a lower section behind. Heights and profiles are estimates.
  // https://dsvh.gov.vn/khanh-thanh-bao-tang-phu-yen-va-may-nhiem-vu-can-tiep-tuc-giai-quyet-403
  // https://commons.wikimedia.org/wiki/File:Phu_Yen_Museum.JPG
  // The merged museum's second premises are explicitly listed at 151 Trần Phú.
  // https://vpubnd.daklak.gov.vn/CMS/Content/VanBan/2026/11.2026/3709_Q%C4%90_UBND.pdf
  const white=0xe8e5d8,concrete=0xd2d2c9,sill=0xaaa999,black=0x263135,
    brass=0xc39b4e,copper=0xa47848,stone=0xb0a398,blue=0x37575b,
    pane=0x526b67,tile=0xbf7557,cream=0xe6daa5,wood=0x8e6654;
  const height=[8.85,10.4,3.55],c=Math.cos(yaw),s=Math.sin(yaw);
  function view(name,tx,tz,ex,ez,h,up,fov,pano){
    const dx=(ex-tx)*c+(ez-tz)*s,dz=-(ex-tx)*s+(ez-tz)*c;
    return {name,offset:[c*tx+s*tz,-s*tx+c*tz],viewAngle:Math.atan2(dx,dz),
      viewElevation:Math.atan2(up,Math.hypot(dx,dz)),viewRadius:Math.hypot(dx,dz,up),
      height:h/.46,viewFov:fov,viewBase:'monument',photo:tour+'#node'+pano};
  }
  const views=[view('Mặt đứng hình mũ vua Hùng',0,5,2.2,79,height[0],-3.5,54,15),
    {...view('Cánh nhà phía tây nam',2.0,1.4,45.5,57,height[1],5.2,54,12),photoCatalogId:'phu-yen-canh-nha-bao-tang'},
    view('Từ sảnh trống đồng nhìn về cửa',0,13.7,-3.15,1.0,height[2],-.95,79,18)];
  function polygon(T,k,points,colour,z,depth){
    const shape=new T.Shape(points.map(([x,y])=>new T.Vector2(x,y)));k.profile(shape,colour,0,0,z,depth);
  }
  function solid(T,k,front,back,colour){
    // The two loops run around the same cross section. Faces are double
    // sided so thin roof edges and the shaded soffits are both visible.
    const coords=[],push=(a,b,c)=>coords.push(...a,...b,...c,...c,...b,...a);
    for(let i=1;i<front.length-1;i++){push(front[0],front[i],front[i+1]);push(back[0],back[i+1],back[i]);}
    for(let i=0;i<front.length;i++){const j=(i+1)%front.length;push(front[i],back[i],front[j]);push(front[j],back[i],back[j]);}
    const mesh=new T.BufferGeometry();mesh.setAttribute('position',new T.Float32BufferAttribute(coords,3));
    mesh.computeVertexNormals();k.stamp(mesh,colour,0,0,0);mesh.dispose();
  }
  function strip(T,k,points,r,colour){
    const line=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const mesh=new T.TubeGeometry(line,Math.max(12,points.length*3),r,8,false);
    k.stamp(mesh,colour,0,0,0);mesh.dispose();
  }
  function materialPanel(T,k,x,y,z,w,h,painter){
    const cv=document.createElement('canvas');cv.width=1024;cv.height=240;
    const g=cv.getContext('2d');painter(g,cv.width,cv.height);
    const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshLambertMaterial({map,transparent:true,alphaTest:.16}));
    m.position.set(x,y,z);k.group.add(m);
  }
  function windows(k,side,xList,y,z,w,h){
    for(const x of xList){
      k.box(sill,side*x,y,z,w+.23,h+.22,.16);
      k.box(blue,side*x,y,z+.093,w,h,.06);
      k.box(white,side*x,y,z+.14,.055,h,.035);
      k.box(white,side*x,y+.32*h,z+.14,w,.071,.035);
    }
  }
  function meander(g,w,h){
    g.fillStyle='#d2aa43';g.fillRect(0,0,w,h);g.fillStyle='#e8ddbd';
    for(const top of [.10,.86])g.fillRect(0,top*h,w,.035*h);
    for(let i=0;i<10;i++){
      const dx=i*w/10;g.save();g.translate(dx,0);g.beginPath();
      g.moveTo(7,h*.64);g.lineTo(26,h*.54);g.lineTo(42,h*.32);g.lineTo(38,h*.54);g.lineTo(54,h*.58);
      g.lineTo(83,h*.35);g.lineTo(96,h*.31);g.lineTo(80,h*.43);g.lineTo(62,h*.65);
      g.lineTo(39,h*.64);g.lineTo(21,h*.72);g.closePath();g.fill();g.restore();
    }
  }
  function entry(T,k){
    // Black stone surround and curving bronze negative drum from pano 15.
    const arch=new T.Shape();arch.moveTo(-9.75,.40);arch.lineTo(-4.7,.40);
    arch.bezierCurveTo(-4.9,1.55,-4.76,2.2,-4.05,3.05);
    arch.bezierCurveTo(-5.03,3.82,-5.15,4.77,-4.25,5.85);
    arch.lineTo(4.25,5.85);arch.bezierCurveTo(5.15,4.77,5.03,3.82,4.05,3.05);
    arch.bezierCurveTo(4.76,2.20,4.90,1.55,4.70,.40);
    arch.lineTo(9.75,.40);arch.lineTo(9.75,7.99);arch.lineTo(-9.75,7.99);arch.closePath();
    k.profile(arch,black,0,0,16.52,.73);
    k.box(black,0,7.84,15.45,19.5,.36,3.72);
    for(const sign of [-1,1]){
      k.box(black,sign*9.42,4.15,15.5,.66,7.61,3.5);
      for(let i=0;i<7;i++)k.box(sill,sign*7.15,.86+i*.91,17.257,4.56,.028,.02);
      strip(T,k,[[sign*4.68,.44,17.32],[sign*4.70,1.51,17.32],[sign*4.45,2.47,17.32],
        [sign*4.05,3.05,17.32],[sign*4.72,3.96,17.32],[sign*4.76,4.77,17.32],[sign*4.25,5.82,17.32]],.12,brass);
      for(let j=0;j<6;j++){
        const x=sign*(8.22+(.12*(j%2))),y=1.22+j*.90;
        k.box(white,x,y,17.28,.10,.88,.05);k.box(white,sign*8.01,y+.38,17.28,.51,.10,.05);
      }
      k.box(copper,sign*3.72,2.80,14.32,.30,4.75,.35);
      k.box(0x5a453b,sign*2.71,2.47,14.45,1.60,3.66,.10);
      for(let j=0;j<7;j++)k.box(copper,sign*(2.04+j*.219),2.48,14.51,.051,3.54,.053);
      k.box(copper,sign*1.83,2.55,14.42,.11,3.91,.14);
      k.box(0x384745,sign*1.225,2.40,14.14,.99,3.78,.087,sign*.48);
    }
    k.box(brass,0,5.86,17.32,8.57,.20,.14);k.box(wood,0,4.70,14.23,7.26,.64,.26);
    materialPanel(T,k,0,8.54,17.38,19.4,1.70,(g,w,h)=>{
      g.textAlign='center';g.textBaseline='middle';g.font='bold 155px Arial';g.fillStyle='#dba850';
      g.fillText('BẢO TÀNG PHÚ YÊN',w/2,h*.53,w-4);
    });
  }
  function crown(T,k){
    // The central concrete fan has a flaring upper edge, curved glazing
    // and a solid, gold-medallioned centre. The ribs continue over the roof.
    const y0=9.14,top=u=>21.35-4.10*u*u;
    const pos=(u,t,side,zdir)=>[side*u*(10.1+9.0*t*t),y0+(top(u)-y0)*t,
      zdir*(14.57+2.38*t)-.15];
    const stages=[0,.22,.44,.65,.83,1];
    for(const side of [-1,1]){
      for(let i=1;i<stages.length;i++){
        const t=stages[i-1],v=stages[i];
        for(const [a,b,material] of [[0,.32,white],[.32,.955,blue],[.955,1,white]]){
          if(material===blue&&i===stages.length-1){
            const f=[pos(a,t,side,1),pos(b,t,side,1),pos(b,.932,side,1),pos(a,.932,side,1)];
            solid(T,k,f,f.map(([x,y,z])=>[x,y,z-.35]),material);continue;
          }
          const f=[pos(a,t,side,1),pos(b,t,side,1),pos(b,v,side,1),pos(a,v,side,1)];
          solid(T,k,f,f.map(([x,y,z])=>[x,y,z-.35]),material);
        }
        for(const u of [.32,.48,.65,.81,.976]){
          const f=[pos(u-.018,t,side,1),pos(u+.018,t,side,1),pos(u+.018,v,side,1),pos(u-.018,v,side,1)];
          solid(T,k,f.map(([x,y,z])=>[x,y,z+.20]),f.map(([x,y,z])=>[x,y,z-.09]),white);
        }
        if(i<stages.length-1){
          const f=[pos(.34,v,side,1),pos(.97,v,side,1),pos(.97,v+.007,side,1),pos(.34,v+.007,side,1)];
          solid(T,k,f.map(([x,y,z])=>[x,y,z+.04]),f,black);
        }
      }
      for(const u of [.32,.48,.65,.81,.977]){
        const w=u===.977?.76:.57,y=top(u),x=side*u*19.1;
        const front=[[-w/2+x,y-.18,16.80],[w/2+x,y-.18,16.80],[w/2+x,y+.34,16.80],[-w/2+x,y+.34,16.80]];
        solid(T,k,front,front.map(([x,y])=>[x,y+.24,-15.9]),white);
      }
    }
    k.box(concrete,0,20.98,0,11.5,.42,33.6);
    // Dark recessed glazing is visible through the transverse white ribs.
    for(const side of [-1,1]){
      solid(T,k,[[side*5.65,20.18,15.96],[side*18.95,16.55,15.96],[side*18.95,16.40,15.96],[side*5.65,20.0,15.96]],
        [[side*5.65,20.18,-15.60],[side*18.95,16.55,-15.60],[side*18.95,16.40,-15.60],[side*5.65,20.0,-15.60]],pane);
      for(const z of [-14.9,-8,0,8.35,15.2])k.box(concrete,side*12.18,18.49,z,13.61,.26,.39,0,0,-side*.260);
    }
    polygon(T,k,[[-5.98,21.18],[5.98,21.18],[5.71,21.77],[0,21.92],[-5.71,21.77]],white,16.18,.85);
    // The inset panel carries a gold drumhead on a patterned pale field.
    // Map the drawing onto the flared surface so it remains legible obliquely.
    const cv=document.createElement('canvas');cv.width=512;cv.height=700;
    const g=cv.getContext('2d');g.fillStyle='#e2dfcd';g.fillRect(0,0,512,700);
    g.strokeStyle='#c4c5b1';g.lineWidth=1.8;
    for(let y=11;y<700;y+=19)for(let x=(y%38===11?4:13);x<511;x+=19){g.beginPath();g.arc(x,y,4.2,0,pi*2);g.stroke();}
    g.lineWidth=7;g.strokeStyle='#9b967f';g.strokeRect(5,5,502,690);
    g.fillStyle='#d3a74a';g.beginPath();g.arc(256,202,85,0,2*pi);g.fill();
    for(const r of [82,75,63]){g.strokeStyle='#98743b';g.lineWidth=3;g.beginPath();g.arc(256,202,r,0,2*pi);g.stroke();}
    g.beginPath();for(let n=0;n<28;n++){const a=n*pi/14,r=n%2?24:65,x=256+r*Math.cos(a),y=202+r*Math.sin(a);
      if(n)g.lineTo(x,y);else g.moveTo(x,y);}g.closePath();g.fillStyle='#efd378';g.fill();g.strokeStyle='#997333';g.lineWidth=2;g.stroke();
    const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const vertices=[],uv=[],indices=[];
    for(let j=0;j<=8;j++){const t=.04+j*.114;
      for(const sign of [-1,1]){const [x,y,z]=pos(.27,t,sign,1);vertices.push(x,y,z+.09);uv.push(sign===-1?0:1,j/8);}
      if(j>0){const n=2*j;indices.push(n-2,n-1,n,n-1,n+1,n);}
    }
    const field=new T.BufferGeometry();field.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
    field.setAttribute('uv',new T.Float32BufferAttribute(uv,2));field.setIndex(indices);field.computeVertexNormals();
    k.group.add(new T.Mesh(field,new T.MeshBasicMaterial({map,side:T.DoubleSide})));
  }
  function outerWings(T,k){
    for(const sign of [-1,1]){
      // A broad upper storey overhangs the colonnade like a boat's hull.
      const outer=[[18,6.35],[34,6.35],[38.9,14.60],[18,14.40]];
      polygon(T,k,outer.map(([x,y])=>[sign*x,y]),white,-15.35,30.75);
      k.box(white,sign*17.40,7.72,14.88,16.76,2.71,1.04);
      k.box(white,sign*17.39,11.92,14.9,14.75,5.0,.99);
      for(const z of [-13.20,-5.25,3.4,11.7])k.tapered(white,sign*33.65,3.48,z,.63,.75,6.14,1,18);
      k.box(concrete,sign*25.65,3.49,-1.22,15.19,6.24,24.5);
      k.box(white,sign*16.83,3.47,9.21,14.08,6.18,5.99);
      windows(k,sign,[11.72,14.67,17.62,20.57,23.52,26.47,29.42],3.27,12.27,2.30,3.55);
      windows(k,sign,[12.25,14.84,17.43,20.02,22.61,25.20],10.40,15.48,2.04,1.68);
      for(let j=0;j<4;j++){
        const z=-11.55+j*7.44;
        k.box(tile,sign*28.62,14.37,z,19.55,.37,6.74,0,-.035,0);
        k.box(white,sign*28.61,14.60,z+3.55,20.16,.41,.43);
      }
      k.box(white,sign*38.35,14.62,-.02,.62,.57,30.58);
      materialPanel(T,k,sign*32.22,11.10,15.49,10.71,3.09,meander);
    }
    // A low rear roof and a rounded middle bay are visible on the orthophoto.
    k.box(concrete,0,2.56,-25.5,61.1,5.11,7.4);k.box(tile,0,5.19,-25.5,61.62,.35,7.93);
    k.tapered(white,0,2.79,-23.1,5.53,5.53,5.12,1,40);
    k.tapered(tile,0,5.37,-23.1,5.71,5.71,.24,1,40);
    k.box(white,0,6.64,-14.8,66.6,12.15,.94);
  }
  function hall(T,k){
    // Only the photographed reception atrium is reconstructed. Exhibitions
    // at nodes 14 and 19–24 are documented by the linked virtual tour.
    const stoneFloor=.55;
    k.box(0xaca190,0,stoneFloor-.04,4.30,24.2,.09,20.80);
    k.box(cream,0,5.03,-5.73,24.0,9.07,.42);
    for(const sign of [-1,1]){
      k.box(cream,sign*12.07,5.03,4.55,.44,9.07,20.42);
      k.box(cream,sign*8.37,4.04,13.76,7.45,7.0,.32);
      for(const z of [-3.20,9.20])k.tapered(cream,sign*6.21,4.94,z,.46,.50,8.74,1,24);
      k.box(wood,sign*9.65,.79,4.52,4.57,.44,18.52);
      for(const z of [-2.3,3.4,9.0]){
        k.box(0x795e48,sign*9.37,1.1,z,.39,.53,2.32);
        k.box(wood,sign*9.37,1.47,z,.68,.18,2.56);
      }
      const rail=[];
      for(let n=0;n<=26;n++){
        const z=-5.55+n*.758,x=sign*(5.06+1.04*Math.cos((z-.5)*.34));
        rail.push([x,9.15,z]);
        k.box(copper,x,8.87,z,.073,.55,.073);
        k.box(cream,sign*(12.11+Math.abs(x))*.5,8.50,z,12.11-Math.abs(x),.34,.79);
      }
      strip(T,k,rail,.077,brass);
      for(const z of [-5.95,14.53])k.box(cream,sign*3.2,8.67,z,6.4,.34,.62);
      k.box(black,sign*4.52,3.65,13.81,1.38,6.15,.33);
      k.box(wood,sign*3.76,2.50,13.63,.16,3.87,.34);
      k.box(0x667579,sign*7.90,1.55,11.93,1.33,1.54,.71);
      k.box(wood,sign*7.90,2.38,11.93,1.54,.12,.85);
    }
    for(const z of [-3.2,9.2])k.box(cream,0,11.71,z,12.95,.38,.64);
    k.box(black,0,6.32,13.77,9.51,1.04,.39);
    k.box(cream,0,12.45,4.28,24.36,.54,20.82);
    k.box(cream,0,10.7,14.72,24.2,3.15,.29);
    const lid=new T.Mesh(new T.PlaneGeometry(24,20.1),new T.MeshBasicMaterial({color:0xe5ddbb,side:T.DoubleSide}));
    lid.position.set(0,12.16,4.28);lid.rotation.x=pi/2;k.group.add(lid);
    const lamp=new T.CircleGeometry(1,48);
    k.stamp(lamp,0xceb878,0,12.133,4.8,3.8,3.8,1,0,pi/2);lamp.dispose();
    const disc=new T.CircleGeometry(5.25,72);k.stamp(disc,0xa88262,0,stoneFloor+.026,4.8,1,1,1,0,-pi/2);disc.dispose();
    for(let n=0;n<14;n++){
      const a=n*2*pi/14,b=a+pi/14,theta=a+.73*pi/14,R=5.06;
      const points=[[0,4.8],[R*Math.cos(a),4.8+R*Math.sin(a)],[2.59*Math.cos(b),4.8+2.59*Math.sin(b)]];
      const tri=new T.Shape(points.map(([x,z])=>new T.Vector2(x,-z)));
      const g=new T.ShapeGeometry(tri);g.rotateX(-pi/2);k.stamp(g,0x975c47,0,stoneFloor+.037,0);g.dispose();
      const small=new T.Shape([[R*Math.cos(theta),-(4.8+R*Math.sin(theta))],[R*Math.cos(b+.13),-(4.8+R*Math.sin(b+.13))],
        [3.06*Math.cos(b+.07),-(4.8+3.06*Math.sin(b+.07))]].map(v=>new T.Vector2(...v)));
      const sg=new T.ShapeGeometry(small);sg.rotateX(-pi/2);k.stamp(sg,0x50544f,0,stoneFloor+.037,0);sg.dispose();
    }
    k.tapered(0xc4ab76,0,stoneFloor+.045,4.80,1.04,1.04,.028,1,48);
  }
  function build(T,k){
    k.palette({stone:[stone,black],tile:[tile],metal:[brass,copper]});
    k.box(stone,0,-1.25,-3.9,69.4,3.45,39.55);
    // A planted strip separates the gallery frontage from the drive-through
    // loop w232410039. Keep its OSM carriageway and the parking aisles visible.
    const yardStart=k.vertexCount(),trees=[];
    for(let j=0;j<12;j++){
      const z=17.73+j*1.71,w=8.17+j*.38;
      k.box(stone,0,-.75,z,w,2.35,1.74);
      k.box(0xa89887,0,.432,z+.74,w,.027,.071);
      if(j<9)for(const sign of [-1,1]){
        const outer=28.25-j*.24,half=w/2+.16;
        k.box(0xbdb4a0,sign*(outer+half)*.5,-.93,z,outer-half,2.34,1.75);
        k.box(0x859062,sign*(outer+half)*.5,.28,z,outer-half-.23,.10,1.73);
      }
    }
    // The two round trees flanking the portico appear in the Commons
    // exteriors and the November 2024 panorama. Their sizes are approximate.
    if(window.CentralArch){const first=k.group.children.length;
      window.CentralArch.trees(T,k,[{x:-11.35,z:23.8,y:.32,h:8.2,width:10.7},{x:12.2,z:25.2,y:.32,h:8.6,width:11.3},
        {x:-24,z:20.6,y:.32,h:4.15,width:3.1,kind:'palm'},{x:24.6,z:19.7,y:.32,h:4.2,width:3.3,kind:'palm'}]);
      trees.push(...k.group.children.slice(first));
    }
    const yardEnd=k.vertexCount();
    // The main walk meets a red-paved forecourt at the mapped loop.
    // This is surface scenery only; the vehicle start remains on Trần Phú.
    for(let j=0;j<11;j++){
      const z=38.24+j*1.93,half=10.5+Math.min(3.7,j*.72);
      for(let i=-3;i<3;i++)k.box((i+j)%2===0?0xb59084:0xba9589,(i+.5)*half/3,.10,z,half/3+.025,.11,1.95);
    }
    const apronEnd=k.vertexCount();
    outerWings(T,k);crown(T,k);entry(T,k);hall(T,k);
    const movable=k.group.children.slice(),starts=movable.map(o=>o.position.y);
    let geom,rest;
    k.group.userData.fitGround=ground=>{
      geom??=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;if(!geom)return;
      const a=geom.attributes.position;rest??=Float32Array.from({length:a.count},(_,i)=>a.getY(i));
      const base=Math.max(0,...[-34,0,34].flatMap(x=>[-17,0,17].map(z=>ground(x,z))),
        ground(0,35),ground(-18,30),ground(18,30))+.07;
      const yardShift=(x,z)=>{const t=Math.max(0,Math.min(1,(z-17.2)/20.2));return base*(1-t)+(ground(x,z)-.31)*t;};
      for(let i=0;i<a.count;i++){
        const x=a.getX(i),z=a.getZ(i),y=rest[i],shift=i>=yardStart&&i<yardEnd?yardShift(x,z):base;
        if(i>=yardEnd&&i<apronEnd)a.setY(i,ground(x,z)+y-.09);
        else a.setY(i,y<-.79?Math.min(y+shift,ground(x,z)-.16):y+shift);
      }
      movable.forEach((m,i)=>m.position.y=starts[i]+(trees.includes(m)?yardShift(m.position.x,m.position.z):base));
      views.forEach((v,i)=>v.height=(base+height[i])/.46);
      a.needsUpdate=true;geom.computeBoundingBox();geom.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Bảo tàng Phú Yên',kind:'Bảo tàng',lon,lat,yaw,
    start:[109.3018625,13.0956090],visitOnArrival:true,mappedEntrance:true,width:79,depth:66,gardenRadius:1,
    boundary:[[-39,-16],[-31,-16],[-31,-30],[31,-30],[31,-16],[39,-16],[39,18],[30,18],[30,32],[-30,32],[-30,18],[-39,18]],
    reserve:(x,z,pad)=>Math.abs(x)<40+pad&&z> -30.5-pad&&z<34+pad,
    solids:[[0,0,37,15],[0,-25.5,30.7,4.1]],
    description:'Nhà trưng bày ba tầng trên đường Trần Phú khánh thành năm 2012. Hai cánh nhà gợi hình chiếc thuyền. Ở giữa, mặt đứng lấy ý từ mũ vua Hùng, còn khung cửa tạo hình âm bản của trống đồng. Sau khi hai bảo tàng hợp nhất năm 2026, nơi đây là cơ sở 2 của Bảo tàng Đắk Lắk. Kích thước mái lấy từ ảnh vệ tinh. Chiều cao và hoa văn sảnh được ước lượng từ ảnh chụp.',
    arrivalNote:'Xe đến cổng số 151 Trần Phú, phường Tuy Hòa. Từ sân trước, theo lối lát đá giữa hai thảm cỏ vào sảnh nhà trưng bày.',
    map:'https://www.openstreetmap.org/way/232410041',photo:tour+'#node15',source,views,build});
})();
