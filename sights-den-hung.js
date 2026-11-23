'use strict';
(() => {
  const A=window.CentralArch,stops=window.VietnamSights??=[];
  const atlas=window.VietnamTourism.byId||new Map(window.VietnamTourism.entries.map(s=>[s.id,s]));
  const heritage='https://dsvh.gov.vn/di-tich-lich-su-den-hung-2939';
  const festival='https://www.dulichvn.org.vn/index.php/item/418';
  const local='https://dulichphutho.vr360tht.com.vn/diem-den/du-lich-van-hoa-lich-su/quan-the-khu-di-tich-lich-su-quoc-gia-dac-biet-den-hung.html';
  const red=0xa44c3e,tile=0x986247,timber=0x694738,ash=0xa5a29a,stone=0x888a81;
  const ivory=0xdad3bd,ink=0x46433a,gold=0xc9a367;
  // Public car park w770225632 and its mapped aisle w770225627.
  const parking=[105.3144624,21.3629913];
  const parkingNote='Xe dừng ở bãi đỗ của Trung tâm lễ hội. Từ đây du khách đi bộ hoặc dùng xe điện của khu di tích đến chân núi rồi theo lối tham quan.';
  function register(catalogId,id,name,source,summary,origin,size,views,draw,settings={}){
    const pin=atlas.get(catalogId);
    if(!pin)throw Error('Missing Hùng temple atlas pin '+catalogId);
    const [east,south,yaw]=origin,c=Math.cos(yaw),s=Math.sin(yaw);
    const [width,depth]=size;
    stops.push({...pin,catalogId,id,name,source,photo:source,description:summary,yaw,width,depth,
      lon:pin.lon+east/(111320*Math.cos(pin.lat*Math.PI/180)),lat:pin.lat-south/110900,
      start:parking,arrivalNote:parkingNote,approachMeters:undefined,visitOnArrival:true,
      solids:[[0,0,width*.45,depth*.45]],...settings,
      views:views.map(([name,x,z,height,viewRadius,angle,viewElevation])=>({
        name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius,viewAngle:yaw+angle,viewElevation})),
      build(T,k){k.palette({stone:[ash,stone],tile,timber,plaster:[ivory,red]});draw(T,k,createTempleFoundations(T,k));}
    });
  }
  function round(k,color,x,y,z,r,h){k.stamp(k.round,color,x,y,z,r,h,r);}
  function roof(T,k,y,z,w,d,h,ornate=false){
    A.curvedRoof(T,k,0,y,z,w,d,h,tile,ash,timber,.30,{dragons:ornate,goldColor:ivory});
  }
  function figureHead(T,k,color,x,y,z,sz){
    const g=new T.SphereGeometry(1,10,7);
    k.stamp(g,color,x,y,z,sz,sz,sz);g.dispose();
  }
  function column(k,x,z,h,r,color,base=.24){
    round(k,stone,x,base+.09,z,r*1.42,.18);
    round(k,color,x,base+h/2,z,r,h);
  }
  function medallions(T,k,chars,x,y,z,w,h){
    const cv=document.createElement('canvas');cv.width=512;cv.height=128;
    const g=cv.getContext('2d'),step=cv.width/chars.length;
    g.textAlign='center';g.textBaseline='middle';g.font='bold 86px serif';
    for(const [i,ch] of Array.from(chars).entries()){
      const cx=(i+.5)*step;g.fillStyle='#e5ddc3';g.beginPath();g.arc(cx,62,54,0,2*Math.PI);g.fill();
      g.fillStyle='#3c3b34';g.fillText(ch,cx,66);
    }
    const tex=new T.CanvasTexture(cv);tex.colorSpace=T.SRGBColorSpace;
    const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,transparent:true,alphaTest:.3}));
    mesh.position.set(x,y,z);k.group.add(mesh);
  }
  function phoenix(T,k,x,y,z,sz){
    for(let i=0;i<4;i++)k.place(x,z,i*Math.PI/2,()=>{
      k.outline([[0,0],[sz*.46,.19*sz],[sz*.88,sz*.94],[sz*.87,sz*1.18],[sz*.48,sz*.62],[sz*.16,sz*.47]],ash,0,y,-.10,.20);
    });
    figureHead(T,k,stone,x,y+1.04*sz,z,sz*.17);
  }
  function guardian(T,k,x,z,h){
    k.box(ash,x,h*.50,z,.60,h,.59);
    k.box(ink,x,h+.10,z,.83,.21,.73);
    k.box(red,x,h+.45,z,.59,.53,.56);
    k.box(ash,x,h+.76,z,.78,.18,.71);
    const g=new T.DodecahedronGeometry(1,0);
    k.stamp(g,ivory,x,h+.97,z,.28,.35,.23);
    k.stamp(g,ivory,x+.12,h+1.25,z+.03,.18,.20,.18);g.dispose();
  }
  function warriorRelief(T,k,gate,side,x,y,z,height){
    const old=gate==='cong-cu', left=side<0;
    const photoHeight=height*(old?.69:1);
    const width=photoHeight*(old?(left?158/229:166/233):(left?171/365:186/375));
    // At the old gate the incense burner obscures the boots and lower coat.
    // Continue the photographed belt with a shallow green tunic and split hem.
    if(old){
      const shape=(points,color,depth)=>k.outline(points.map(([a,b])=>[a*height,b*height]),color,x,y,z+depth,.035);
      for(const s of [-1,1]){
        shape([[s*.035,.035],[s*.035,.23],[s*.091,.28],[s*.115,.06],[s*.09,.034]],0x593627,.016);
        shape([[s*.035,.015],[s*.141,.015],[s*.146,.035],[s*.11,.060],[s*.039,.053]],0x442f28,.026);
      }
      shape([[-.108,.58],[.112,.58],[.15,.23],[.101,.15],[.052,.17],[0,.25],[-.065,.13],[-.148,.18]],0x3d713e,.038);
      shape([[-.071,.56],[.085,.56],[.064,.24],[.008,.17],[-.050,.23]],0x9a7133,.049);
      shape([[-.063,.55],[.077,.55],[.056,.25],[.009,.196],[-.044,.237]],0x693b2d,.053);
    }
    const geometry=new T.PlaneGeometry(width,photoHeight,8,12);
    const vertices=geometry.attributes.position;
    for(let i=0;i<vertices.count;i++){
      const nx=vertices.getX(i)*2/width, ny=vertices.getY(i)*2/photoHeight;
      vertices.setZ(i,.075*(1-nx*nx)*(1-ny*ny));
    }
    geometry.computeVertexNormals();
    const file='sight-imagery/den-hung-'+gate+'-'+(left?'trai':'phai')+'.webp';
    const map=new T.TextureLoader().load(file);
    map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const mesh=new T.Mesh(geometry,new T.MeshBasicMaterial({map,alphaTest:.45}));
    mesh.position.set(x,y+height-photoHeight*.5,z+(old?.096:.012));
    k.group.add(mesh);
  }
  function oldGate(T,k,f){
    const base=f.building(0,0,0,7.55,2.48,()=>{
      A.vaultedBay(T,k,0,0,4.5,5.44,1.50,2.48,1.54,red,0x994e43,0xa95849);
      k.box(ink,0,5.53,0,4.92,.22,1.91);
      medallions(T,k,'行景山高',0,4.84,.95,3.43,.63);
      roof(T,k,5.53,0,4.94,2.04,.18);
      const upper=new T.Shape();
      upper.moveTo(-2.12,0);
      for(const x of [-1.21,0,1.21]){
        upper.lineTo(x-.38,0);upper.lineTo(x-.38,.44);upper.absarc(x,.44,.38,Math.PI,0,true);upper.lineTo(x+.38,0);
      }
      upper.lineTo(2.12,0);upper.lineTo(2.12,1.18);upper.lineTo(-2.12,1.18);upper.closePath();
      k.profile(upper,red,0,5.60,-.65,1.30);
      roof(T,k,6.83,0,4.88,2.01,.75,true);
      figureHead(T,k,gold,0,7.94,0,.24);
      for(const side of [-1,1]){
        k.box(ivory,side*1.99,2.65,.817,.29,4.76,.07);
        k.box(red,side*2.89,1.46,0,1.22,2.9,.49);
        k.box(ivory,side*2.89,1.44,.27,1.18,2.58,.05);
        warriorRelief(T,k,'cong-cu',side,side*2.89,.18,.302,2.34);
        guardian(T,k,side*3.63,0,3.56);
      }
    });
    const portalTerrain=base.elevation;
    base.elevation=sample=>Math.max(portalTerrain(sample),sample(0,7.7)+1.69);
    f.stairs(base,0,1.22,0,7.7,7.6,.13,14);
  }
  function festivalGate(T,k,f){
    for(const [x,w,d,h,r,sy,center] of [[0,17.4,9,13.5,3.75,3.75,true],[-19,10,6.3,8.3,2.5,3.50,false],[19,10,6.3,8.3,2.5,3.50,false]]){
      f.building(x,0,0,w,d,()=>{
        A.vaultedBay(T,k,0,0,w,h,r,sy,d,ash,stone,stone);
        for(let y=.72;y<h-.38;y+=.79){
          const cut=y<sy?r:y<sy+r?Math.sqrt(Math.max(0,r*r-(y-sy)**2)):0;
          for(const sign of [-1,1])k.box(stone,sign*(w*.5+cut)/2,y,d*.50+.012,w*.50-cut,.027,.024);
        }
        k.box(stone,0,h+.08,0,w+.42,.22,d+.40);
        const upperW=w*.78,upperD=d*.77,upperH=center?2.6:2.11;
        k.box(ash,0,h+upperH*.5,0,upperW,upperH,upperD);
        for(const side of [-1,1])for(let i=-1;i<=1;i++){
          const xx=i*upperW*.30;k.box(ink,xx,h+upperH*.44,side*(upperD*.5+.01),.90,upperH*.53,.12);
        }
        roof(T,k,h+upperH,0,upperW+1.10,upperD+1.19,center?2.31:1.86);
        if(center){
          k.box(ash,0,18.44,0,8.51,1.83,4.43);
          roof(T,k,19.44,0,9.74,5.17,2.11);
          A.plaque(T,k,'ĐỀN HÙNG',0,9.68,d/2+.12,4.63,.81,{bg:'#6f6e62',fg:'#e5c676',border:0x9b9785});
        }
      });
    }
    for(const s of [-1,1])f.building(s*11.5,0,0,1.69,1.85,()=>{
      k.box(ash,0,7.09,0,1.28,14.18,1.32);
      k.box(stone,0,1.08,0,1.72,2.16,1.74);
      k.box(stone,0,14.45,0,1.70,.56,1.72);
      k.box(ash,0,15.43,0,1.58,1.52,1.60);
      k.tapered(stone,0,16.44,0,1.29,.92,.50,1,4);
      phoenix(T,k,0,16.65,0,1.15);
    });
  }
  function beamHall(T,k,w,d,opts={}){
    const {h=2.87,base=.37,bays=3,closed=true,curved=false,title}=opts;
    k.box(stone,0,base*.5,0,w-.15,base,d-.1);
    const x=w*.445,front=d*.32,back=-d*.41,zSide=(back+front)/2;
    if(closed)k.box(ivory,0,base+h/2,back,w*.89,h,.27);
    for(const side of [-1,1])k.box(ivory,side*x,base+h/2,zSide,.26,h,front-back);
    for(let j=0;j<=bays;j++){
      const px=(j/bays-.5)*w*.85;
      column(k,px,d*.40,h,.16,timber,base);
      if(j===bays||!closed)continue;
      const spacing=w*.85/bays,middle=px+spacing/2;
      k.box(ink,middle,base+h*.46,front-.16,spacing*.91,h*.91,.16);
      for(let leaf=0;leaf<4;leaf++){
        const at=middle+(leaf-1.5)*spacing*.205;
        k.box(timber,at,base+h*.38,front-.045,spacing*.19,h*.72,.10);
        for(const s of [-1,1])k.box(timber,at+s*.055,base+h*.78,front-.04,.042,h*.20,.07);
      }
    }
    k.box(timber,0,base+h-.16,d*.402,w*.91,.31,.22);
    if(curved)roof(T,k,base+h,0,w,d,Math.min(2.45,d*.29),true);
    else{
      A.gabledRoof(T,k,0,base+h,0,w-.5,d-.28,Math.min(2.26,d*.34),tile,stone,{alongX:true,overhang:.19});
      for(const side of [-1,1]){
        const dz=d*.47,hh=Math.min(2.26,d*.34);
        k.outline([[-dz,-.13],[0,hh+.09],[dz,-.13]],ivory,side*(w*.5-.21),base+h,0,.17,Math.PI/2);
      }
    }
    if(title)A.plaque(T,k,title,0,base+h-.46,d*.42,Math.min(w*.39,3.8),.48,{bg:'#73372b',fg:'#e4c88e',border:0x896747});
  }
  function lowerTemple(T,k,f){
    const a=f.building(0,0,0,12.4,12.9,()=>{
      k.place(0,2.89,0,()=>beamHall(T,k,12.4,5.37,{h:2.78}));
      k.place(0,-3.53,0,()=>beamHall(T,k,11.7,4.41,{h:2.77}));
      for(const side of [-1,1])k.box(ivory,side*5.60,1.43,-.50,.24,2.63,2.10);
      for(const side of [-1,1])k.place(side*5.86,-.52,side*Math.PI/2,()=>{
        const body=new T.SphereGeometry(1,12,7);
        k.stamp(body,stone,-.04,1.72,.04,.56,.29,.08);
        k.stamp(body,stone,.47,side<0?1.77:2.02,.055,.25,.24,.075);
        for(const x of [-.37,-.20,.18,.33])k.box(stone,x,1.33,.056,.115,.48,.09);
        if(side<0)A.strut(T,k,stone,.61,1.69,.07,.67,1.29,.07,.063);
        else A.strut(T,k,stone,.28,1.83,.07,.44,2.12,.07,.12);
        body.dispose();
      });
    });
    f.stairs(a,0,6.1,0,8.0,5.24,.32,5);
    f.building(-9.61,6.80,0,3.39,3.39,()=>{
      k.tapered(stone,0,.19,0,1.83,1.83,.38,1,6);
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3;column(k,1.38*Math.sin(a),1.38*Math.cos(a),2.46,.12,ash,.38);
      }
      k.box(stone,0,1.23,0,.91,1.70,.24);
      k.outline([[-.46,0],[-.37,.19],[0,.30],[.37,.19],[.46,0]],stone,0,2.08,-.12,.24);
      k.tapered(tile,0,3.39,0,2.09,.14,1.13,1,6);round(k,ash,0,3.99,0,.14,.15);
    });
  }
  function middleTemple(T,k,f){
    f.building(0,0,0,12.7,14.0,()=>{
      k.place(0,3.63,0,()=>beamHall(T,k,10.25,4.49,{h:2.64}));
      k.place(0,-3.71,0,()=>beamHall(T,k,9.28,4.61,{h:2.74}));
      k.box(0xac886b,0,.17,0,10.65,.33,2.83);
    });
    f.building(0,10.4,0,5.18,5.18,()=>{
      round(k,0xacaa96,0,.09,0,2.48,.18);
      const curb=new T.LatheGeometry([[2.21,.17],[2.21,.37],[2.48,.37],[2.48,.16]].map(([r,h])=>new T.Vector2(r,h)),36);
      k.stamp(curb,ash,0,0,0);curb.dispose();
      const rock=new T.DodecahedronGeometry(1,0);
      for(const [x,z,w,angle] of [[-.96,-.63,.60,.5],[.38,-1.08,.66,.23],[1.23,-.24,.51,.32],
        [.39,.76,.76,.65],[-1.12,.63,.59,.10],[-.13,-.11,.43,.84]])k.stamp(rock,0x888a76,x,.26,z,w,.28,w*.72,angle);
      rock.dispose();
    });
  }
  function upperGate(T,k){
    for(const [x,w,r,h] of [[0,4.46,1.18,4.12],[-3.85,3.00,.73,3.10],[3.85,3.00,.73,3.10]]){
      A.vaultedBay(T,k,x,0,w,h,r,1.47,.76,ivory,stone,ash);
      k.box(ash,x,h+.14,0,w+.23,.23,.89);
    }
    for(const x of [-5.56,-2.27,2.27,5.56]){
      const inner=Math.abs(x)<3,h=inner?5.26:3.88;
      k.box(ash,x,h*.5,0,.49,h,.54);k.box(ivory,x,h+.27,0,.77,.53,.69);
      phoenix(T,k,x,h+.65,0,inner?.56:.39);
    }
    for(const side of [-1,1]){
      k.box(ash,side*1.80,1.67,.47,1.23,2.71,.19);
      k.box(ivory,side*1.80,1.67,.59,1.15,2.52,.11);
      warriorRelief(T,k,'den-thuong',side,side*1.80,.48,.65,2.32);
      for(let j=0;j<4;j++)k.box(stone,side*2.27,.89+j*.85,.321,.22,.24,.08);
    }
    A.plaque(T,k,'南 越 肇 祖',0,3.55,.477,2.48,.44,{bg:'#c5bc9c',fg:'#594e3e',border:0x928c73});
    figureHead(T,k,ochre,0,4.79,0,.19);
    for(const s of [-1,1])A.strut(T,k,ash,s*1.91,4.29,0,s*.43,4.67,0,.10);
  }
  const ochre=0xc6a571;
  function upperTemple(T,k,f){
    f.building(0,-2.88,0,17.4,15.62,()=>{
      k.place(0,4.91,0,()=>beamHall(T,k,16.9,5.53,{h:3.25}));
      k.place(0,-1.18,0,()=>beamHall(T,k,12.0,4.08,{h:3.54}));
      k.place(0,-6.14,0,()=>beamHall(T,k,9.06,3.41,{h:3.46}));
      for(const z of [1.97,-3.77])k.place(0,z,0,()=>beamHall(T,k,3.70,2.8,{h:2.90,closed:false}));
    });
    const gate=f.building(0,10.14,0,11.88,1.41,()=>upperGate(T,k));
    f.stairs(gate,0,10.8,0,14.37,7.16,.20,7);
    f.building(-7.49,7.21,0,2.02,2.02,()=>{
      k.box(stone,0,.20,0,1.99,.4,1.99);
      k.box(ash,0,.47,0,1.62,.17,1.62);
      k.tapered(0x9d7567,0,1.82,0,.40,.30,2.56,1,8);
    });
  }
  function wellTemple(T,k,f){
    f.building(0,0,0,11.7,14.4,()=>{
      k.place(0,4.76,0,()=>beamHall(T,k,11.7,4.52,{h:3.02,closed:false}));
      k.place(0,-4.10,0,()=>beamHall(T,k,10.77,5.71,{h:3.14,closed:false}));
      k.box(ivory,0,1.67,-6.73,10.3,2.65,.34);
      k.box(0xb88e6e,0,.23,-.16,6.20,.45,5.32);
      for(const s of [-1,1]){
        for(const z of [-2.22,2.02])column(k,s*2.06,z,3.39,.17,red,.40);
        k.box(timber,s*2.06,3.70,-.10,.20,.19,4.74);
      }
      roof(T,k,3.79,-.1,5.4,5.21,1.17);
      // Open circular well in front of the princesses' altar. Keep the
      // inside wall visible all the way down to the water.
      const z=-2.73;
      const ring=new T.LatheGeometry([[.60,.39],[.68,.42],[.68,1.18],[.72,1.20],[.72,1.31],[.55,1.31],[.54,.51]].map(([r,h])=>new T.Vector2(r,h)),40);
      k.stamp(ring,0x998d73,0,0,z);ring.dispose();
      round(k,0x5c827b,0,.54,z,.544,.026);
      for(const s of [-1,1]){
        const x=s*1.40;
        k.box(red,x,1.44,-5.30,2.28,.76,1.18);
        k.box(gold,x,1.89,-5.30,2.44,.12,1.25);
        for(const side of [-1,1]){
          k.box(red,x+side*.91,.89,-4.83,.21,.83,.22);
          k.box(gold,x+side*.91,1.55,-4.66,.14,.44,.08);
          k.box(ochre,x+side*.48,1.42,-4.66,.63,.35,.07);
          k.box(red,x+side*.48,1.43,-4.60,.54,.23,.06);
        }
        round(k,gold,x,2.10,-5.02,.32,.30);round(k,gold,x,2.29,-5.02,.38,.10);
        k.box(red,x,2.30,-5.64,.67,.66,.42);
        k.box(gold,x,2.82,-5.78,.45,.70,.10);
      }
    });
    f.building(0,11.45,0,5.72,1.73,()=>{
      A.vaultedBay(T,k,0,0,4.13,3.23,1.03,1.41,1.05,red,ash,ivory);
      k.box(red,0,3.90,0,3.56,1.03,.96);
      for(const s of [-1,1])guardian(T,k,s*2.50,0,2.91);
      roof(T,k,3.25,0,4.52,1.95,.69);roof(T,k,4.39,0,3.99,1.74,.69);
      A.plaque(T,k,'中 山 小 室',0,2.86,.56,1.93,.34,{bg:'#984d41',fg:'#e7dcba',border:0xa77e5a});
    });
  }
  function auCo(T,k,f){
    const a=f.building(0,0,0,14.6,12.4,()=>{
      k.place(0,2.49,0,()=>beamHall(T,k,14.6,7.55,{h:3.81,base:.86,bays:5,curved:true}));
      k.place(0,-3.62,Math.PI/2,()=>beamHall(T,k,6.96,5.80,{h:3.78,base:.86,curved:true}));
      for(const s of [-1,1]){
        const edge=s*6.87;
        k.stamp(k.round,ivory,edge,2.16,5.96,.59,.15,.59,0,Math.PI/2);
        k.stamp(k.round,ash,edge,2.16,6.07,.39,.10,.39,0,Math.PI/2);
      }
    });
    f.stairs(a,0,6.12,0,11.45,9.91,.84,12);
    for(const s of [-1,1])f.building(s*11.46,11.32,Math.PI/2,12.29,4.81,()=>{
      beamHall(T,k,12.29,4.81,{h:2.62,curved:true});
    });
  }
  function bronzeDrum(T,k){
    const bronze=0x97845d;
    const cast=new T.LatheGeometry([[1.32,0],[1.49,.12],[1.24,.38],[.84,.78],[.81,1.23],[1.30,1.83],[1.60,1.98],[1.63,2.11],[1.61,2.16],[0,2.16]].map(([r,h])=>new T.Vector2(r,h)),48);
    k.stamp(cast,bronze,0,.32,0);cast.dispose();
    for(const r of [.67,.84,1.37,1.52]){
      const hoop=new T.TorusGeometry(r,.018,6,48);
      k.stamp(hoop,0xb4a274,0,2.496,0,1,1,1,0,Math.PI/2);hoop.dispose();
    }
    const star=new T.Shape();
    for(let i=0;i<28;i++){
      const a=i*Math.PI/14,r=i%2?.31:.62,p=[Math.cos(a)*r,Math.sin(a)*r];
      if(i)star.lineTo(...p);else star.moveTo(...p);
    }
    star.closePath();
    const disk=new T.ShapeGeometry(star);k.stamp(disk,0xb7a775,0,2.502,0,1,1,1,0,-Math.PI/2);disk.dispose();
    for(let j=0;j<18;j++){
      const a=j*Math.PI/9,p=[Math.cos(a)*1.11,2.498,Math.sin(a)*1.11];
      k.place(p[0],p[2],Math.PI/2-a,()=>{
        A.strut(T,k,0xb4a274,0,p[1],-.11,0,p[1]+.045,.11,.026);
        A.strut(T,k,0xb4a274,0,p[1]+.04,.03,.09,p[1]+.07,-.09,.024);
      });
    }
  }
  function museum(T,k,f){
    f.building(0,0,0,29.5,30.6,()=>{
      const white=0xe3dece,glass=0x61716c;
      k.box(ash,0,.16,0,29.4,.32,30.5);
      for(const s of [-1,1]){
        k.box(white,s*13.63,4.38,0,1.76,8.16,28.42);
        k.box(white,s*9.77,2.58,-4.24,6.35,4.53,17.06);
        for(const z of [-11.5,-4.10,3.62,11.73])k.box(ash,s*11.65,2.62,z,.89,4.61,.91);
      }
      k.box(white,0,2.66,-13.88,27.64,4.69,1.11);
      k.box(white,0,6.48,0,28.4,3.44,28.50);
      k.box(ash,0,8.38,0,29.36,.34,29.30);
      k.box(white,0,9.24,0,28.72,1.39,28.84);
      for(const side of [-1,1])for(let j=-4;j<=4;j++){
        const x=j*2.94;k.box(glass,x,9.16,side*14.46,2.62,.69,.12);
      }
      for(const x of [-10.52,10.52])k.box(glass,x,6.78,14.31,2.12,1.2,.14);
      A.plaque(T,k,'BẢO TÀNG HÙNG VƯƠNG',0,6.72,14.32,12.13,.96,{bg:'#d9d6c9',fg:'#4e4b42',frame:false});
      k.box(white,0,2.31,8.94,8.39,4.13,.40);
      k.box(glass,0,2.12,9.19,4.24,3.50,.11);
      k.box(ash,0,2.08,9.28,.12,3.52,.10);
      for(let i=0;i<5;i++)k.box(ash,0,(5-i)*.085,9.72+i*.39,7.82,(5-i)*.17,.42);
      for(const side of [-1,1]){
        k.tapered(stone,side*6.2,.79,12.79,.53,.86,.90,1,12);
        const shrub=new T.IcosahedronGeometry(1,1);k.stamp(shrub,0x6f845b,side*6.2,1.51,12.79,.85,.62,.79);shrub.dispose();
      }
      roof(T,k,10.05,0,30.4,30.5,2.06);
      k.box(0xa5aaa6,0,12.02,0,9.9,.32,10.2);
      bronzeDrum(T,k);
    });
  }
  const gatePiers=[...A.archPiers(0,0,17.4,3.75,9),...A.archPiers(-19,0,10,2.5,6.3),...A.archPiers(19,0,10,2.5,6.3),
    [-11.5,0,.88,.94],[11.5,0,.88,.94]];
  register('osm-node-11395354269','cong-trung-tam-le-hoi-den-hung','Cổng Trung tâm lễ hội Đền Hùng',festival,
    'Từ quảng trường nhìn lên có ba tòa cổng ốp đá. Tòa chính cao 22 m với hai tầng mái, hai tòa nhỏ đứng cách riêng ở hai bên.',
    [-1.6,-16.6,-.96],[48.0,9],[['Ba tòa cổng nhìn từ quảng trường',0,0,16.3,70,.22,.15],['Vòm đá của tòa chính',0,0,17.2,30,-.19,.12]],
    festivalGate,{solids:gatePiers,modeledBuildings:['w770225633']});
  register('osm-node-11395352269','cong-cu-den-hung','Cổng Đền Hùng dưới chân núi Nghĩa Lĩnh',local,
    'Cổng son xây năm 1917 ở đầu lối bậc đá. Qua vòm cửa độc đạo, nhìn lên thấy bốn chữ “Cao sơn cảnh hành”, hai bên là đôi trụ có nghê chầu.',
    [-13.1,-14.3,-1.10],[7.55,2.48],[['Từ chân bậc đá',0,0,7.15,16,.12,.13],['Bức đại tự của cổng cũ',0,0,9.51,8.60,-.15,.12]],
    oldGate,{solids:[...A.archPiers(0,0,4.5,1.50,1.54),[-3.15,0,.86,.43],[3.15,0,.86,.43]],
      photoCreditUrl:'landmark-scans/CREDITS.txt',photoCredit:'Phù điêu võ sĩ từ ảnh của Bùi Thụy Đào Nguyên · CC BY-SA 3.0'});
  register('osm-node-11395352270','den-ha-nghia-linh','Đền Hạ núi Nghĩa Lĩnh',local,
    'Hai tòa ba gian đứng song song, cách nhau khoảng sân hẹp. Ở bậc lên đền có nhà bia sáu mái.',
    [-1,-9.7,-.87],[12.4,12.9],[['Hai nếp nhà Đền Hạ',0,0,6.4,23,-.42,.25],['Nhà bia sáu mái',-9.61,6.80,3.95,9.3,-.26,.17]],
    lowerTemple,{modeledBuildings:['w1456907362']});
  register('osm-way-1504768248','den-trung-nghia-linh','Đền Trung – Hùng Vương Tổ miếu',local,
    'Ngôi đền quay về nam trên lưng núi Nghĩa Lĩnh. Sau đợt tu bổ năm 2009, gian tiền bái và hậu cung nằm trong hai nếp mái.',
    [0,0,-.02],[12.7,14.0],[['Sân trước Tổ miếu',0,4.2,5.5,24,.20,.18],['Hai nếp mái đền Trung',0,0,7.0,28,-.93,.40]],
    middleTemple,{modeledBuildings:['w1504768248']});
  register('osm-node-11395352271','den-thuong-nghia-linh','Đền Thượng – Kính Thiên Lĩnh Điện',local,
    'Nghi môn ba vòm mở vào các nếp thờ trên đỉnh Nghĩa Lĩnh. Bức đại tự “Nam Việt Triệu Tổ” nằm trên cửa giữa, còn cột đá thề ở bên sân.',
    [3.9,-4.9,-.02],[18.0,19.1],[['Nghi môn đền Thượng',0,10.14,6.3,12.7,.04,.08],['Các lớp điện trên đỉnh núi',0,0,10,35,-.65,.43],['Cột đá thề',-7.49,7.21,3.85,8.6,-.56,.20]],
    upperTemple,{modeledBuildings:['w1504768247'],photoCreditUrl:'landmark-scans/CREDITS.txt',
      photoCredit:'Phù điêu nghi môn từ ảnh do Khương Việt Hà hiến tặng vào phạm vi công cộng'});
  register('osm-node-11395352369','den-gieng-ngoc-tinh','Đền Giếng – Ngọc Tỉnh',heritage,
    'Đền hướng đông nam. Qua tiền bái và phương đình là giếng tròn nằm ngay trước ban thờ hai công chúa Tiên Dung, Ngọc Hoa.',
    [-17.3,2.4,.39],[11.7,14.4],[['Cửa núi vào đền Giếng',0,6,6.2,23,.22,.16],['Giếng Ngọc trước ban thờ',0,-2.73,2.90,3.90,-.13,.32]],
    wellTemple,{modeledBuildings:['w1504768251']});
  register('osm-node-11395352469','den-to-mau-au-co-nui-van','Đền Tổ Mẫu Âu Cơ trên núi Vặn',heritage,
    'Vượt lối bậc đá lên đỉnh núi Vặn, sân đền mở ra giữa hai dãy tả vu, hữu vu. Phía sau nếp tiền đường là hậu cung của ngôi đền chữ Đinh.',
    [6,20.1,-.69],[14.6,12.4],[['Từ sân đền trên núi Vặn',0,4,8,35,.06,.16],['Chính điện và hai dãy nhà bên',0,7,9,38,-.57,.40]],
    auCo,{start:[105.32206,21.37697],arrivalNote:'Xe dừng ở đường chân núi Vặn. Từ đây lối bậc đá dẫn lên sân đền Tổ Mẫu Âu Cơ.'});
  register('osm-node-7189828683','bao-tang-hung-vuong-cong-quan','Bảo tàng Hùng Vương trên đồi Công Quán','https://denhung.vn/tin-tuc/bao-tang-hung-vuong',
    'Tòa nhà hình vuông nằm trên đồi Công Quán gần cổng chân núi. Dưới sảnh tầng một có trống đồng mô phỏng hoa văn Đông Sơn.',
    [.4,.7,-2.93],[29.5,30.6],[['Mặt tiền trên đồi Công Quán',0,0,12.6,46,.20,.15],['Mặt trống đồng trong sảnh',0,0,3.79,5.27,.19,.32]],
    museum,{modeledBuildings:['w1037319926']});
})();
