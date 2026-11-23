'use strict';
(()=>{
  const catalogue=new Map(VietnamTourism.entries.map(site=>[site.id,site]));
  function register(id,catalogId,details,build){
    const site=catalogue.get(catalogId);
    (window.VietnamSights??=[]).push({...site,id,catalogId,approachMeters:undefined,...details,build});
  }

  // A round-headed opening with its own projecting archivolt. The back is recessed
  // a few centimetres behind the moulding, so oblique sunlight throws a reveal.
  function doorway(T,profile,x,y,z,width,spring,rise,edge,trim,back,angle=0){
    const opening=new T.Shape(),r=width/2;
    opening.moveTo(-r,0);opening.lineTo(r,0);opening.lineTo(r,spring);
    opening.absellipse(0,spring,r,rise,0,Math.PI,false);opening.closePath();
    profile(opening,back,x,y,z,.06,angle);
    const surround=new T.Shape();
    surround.moveTo(-r-edge,0);surround.lineTo(-r-edge,spring);
    surround.absellipse(0,spring,r+edge,rise+edge,Math.PI,0,true);
    surround.lineTo(r+edge,0);surround.lineTo(r,0);surround.lineTo(r,spring);
    surround.absellipse(0,spring,r,rise,0,Math.PI,false);
    surround.lineTo(-r,0);surround.closePath();
    profile(surround,trim,x,y,z,.22,angle);
  }

  function postOffice(T,{palette, box,stamp,profile,outline,round,sign}){
    const yellow=0xe6bc60,ochre=0xc49a50,ivory=0xf2e4cd,base=0xab7653;
    const shutter=0x285648,slat=0x356b59,iron=0x5c7069,tile=0xa9664e;
    palette({plaster: ochre, timber: shutter, metal: iron, tile});
    function wing(x,z,w,d,h){
      box(base,x,.74,z,w,1.55,d);
      box(yellow,x,(h+1.5)/2,z,w,h-1.5,d);
      box(ivory,x,1.53,z,w+.26,.26,d+.26);
      box(ochre,x,h-.35,z,w+.34,.35,d+.34);
      box(ivory,x,h-.04,z,w+.72,.29,d+.72);
    }
    function hipRoof(x,z,w,d,eaves,rise,colour){
      const halfX=w/2,halfZ=d/2,longX=w>=d;
      const ridge=Math.abs(halfX-halfZ),a=[x-halfX,eaves,z-halfZ],b=[x+halfX,eaves,z-halfZ];
      const c=[x+halfX,eaves,z+halfZ],f=[x-halfX,eaves,z+halfZ];
      const left=[x-(longX?ridge:0),eaves+rise,z-(longX?0:ridge)];
      const right=[x+(longX?ridge:0),eaves+rise,z+(longX?0:ridge)];
      const triangles=longX?[a,left,b,b,left,right,b,right,c,c,right,f,f,right,left,f,left,a]:
        [a,left,b,b,left,c,c,left,right,c,right,f,f,right,a,a,right,left];
      const geo=new T.BufferGeometry();
      geo.setAttribute('position',new T.Float32BufferAttribute(triangles.flat(),3));geo.computeVertexNormals();
      stamp(geo,colour,0,0,0);geo.dispose();
    }
    // The Paris Square elevation is 69.4 m long. Its centre projects 1 m
    // from the two wings; the postal hall extends a further 42 m to the rear.
    wing(0,14.5,69.4,15.5,10.3);hipRoof(0,14.5,69.8,16.2,10.32,2.8,tile);
    wing(.5,-8.6,37.1,30.8,8.6);hipRoof(.5,-8.6,37.1,31,8.64,3.45,0x9c6454);
    wing(.85,-29.5,43.7,11.5,8.5);hipRoof(.85,-29.5,43.9,12.1,8.55,2.1,tile);
    // Long glazed ridge over the service hall, flanked by the lower tiled roofs.
    const barrel=new T.CylinderGeometry(4.75,4.75,35.5,24,1,true,0,Math.PI);
    barrel.rotateZ(Math.PI/2);barrel.rotateY(Math.PI/2);
    stamp(barrel,0xb1b4a6,.4,8.85,-7.4,1,.76,1);barrel.dispose();
    for(const side of [-1,1]){
      for(let i=0;i<8;i++){
        const z=-20+i*3.55;
        box(shutter,.5+side*18.59,4.8,z,.12,4.7,1.58);
        box(ivory,.5+side*18.67,2.5,z,.28,.20,1.95);
      }
    }
    for(const y of [2.1,5.03,5.29,9.88,10.36]){
      box(y===5.03?ochre:ivory,0,y,22.32,69.8,y===10.36?.31:.14,.43);
    }
    // Alternating recessed shuttered bays and sculpted keystones on both wings.
    for(const side of [-1,1])for(let i=0;i<7;i++){
      const x=side*(10.65+i*3.64),z=22.29;
      doorway(T,profile,x,5.54,z,2.08,2.2,1.14,.18,ivory,shutter);
      box(iron,x,6.97,z+.12,.082,2.65,.07);
      box(ivory,x,5.5,z+.13,2.68,.20,.4);
      doorway(T,profile,x,2.23,z,1.73,1.72,.33,.13,ochre,shutter);
      for(let j=0;j<7;j++)box(slat,x,2.44+j*.22,z+.083,1.55,.055,.06);
      const pier=x+side*1.81;
      box(ivory,pier,7.46,z+.1,.31,3.62,.3);
      box(ivory,pier,8.98,z+.15,.63,.23,.37);
      for(let k=0;k<3;k++)box(ivory,pier,4.72-k*.16,z+.16,.88-k*.17,.16,.38-k*.05);
      for(let k=0;k<3;k++)box(0xd3aa61,pier,2.56+k*.53,z+.09,.74,.045,.13);
      box(0xe6d3af,x,9.07,z+.14,.36,.51,.24);
    }
    wing(0,15.1,17.25,16.1,13.58);hipRoof(0,15.1,17.5,16.4,13.62,1.45,tile);
    for(const y of [9.96,10.22,13.05,13.55])box(ivory,0,y,23.29,17.67,.22,.57);
    for(let i=-20;i<=20;i++)box(ivory,i*.42,13.28,23.54,.19,.23,.31);
    for(let i=-3;i<=3;i++){
      const x=i*2.26;
      box(shutter,x,11.77,23.23,1.41,1.73,.12);
      box(ochre,x,11.77,23.33,.08,1.79,.09);
      for(const side of [-1,1]){
        box(ivory,x+side*.82,11.76,23.30,.18,2.12,.23);
        box(ivory,x+side*.82,12.83,23.31,.35,.20,.30);
      }
      box(ivory,x,10.71,23.34,1.9,.14,.38);
    }
    for(const side of [-1,1]){
      const x=side*6.48;
      box(ochre,x,7.58,23.22,2.03,3.7,.18);
      box(shutter,x,7.61,23.33,1.57,3.18,.12);
      for(let j=0;j<12;j++)box(slat,x,6.18+j*.25,23.43,1.45,.055,.07);
      for(const px of [side*4.96,side*8.35])for(const [y,w,h] of [[7.66,.39,4.4],[9.79,.73,.29],[5.48,.73,.21]]){
        box(ivory,px,y,23.32,w,h,.34);
      }
      box(ivory,x,5.72,23.37,2.41,.23,.48);
      box(ivory,x,9.39,23.36,2.53,.24,.45);
    }
    doorway(T,profile,0,.65,23.27,7.17,5.09,3.45,.31,ivory,0x233835);
    // Stucco spandrels carry clusters of leaves on either side of the clock arch.
    for(const side of [-1,1]){
      for(let j=0;j<8;j++){
        const x=side*(2.12+j*.30),y=9.64-j*.05;
        outline([[0,0],[side*.22,-.025],[side*.32,.08],[side*.29,.19],[side*.10,.14]],
          ivory,x,y,23.43,.12);
        const low=5.78+3.82*Math.sqrt(Math.max(0,1-(x/3.95)**2));
        if(low<y-.25)box(0xead6ac,x,(low+y)/2,23.40,.11,y-low,.14,0,0,side*.18);
      }
      outline([[-.2,0],[.2,0],[.37,.19],[.21,.42],[0,.59],[-.21,.42],[-.37,.19]],
        ivory,side*.30,9.39,23.52,.17);
    }
    // The real clock hangs inside the wrought-iron fanlight above the doors.
    for(let i=-8;i<=8;i++){
      const x=i*.39,high=3.31*Math.sqrt(Math.max(0,1-(x/3.58)**2));
      box(iron,x,5.79+high*.5,23.45,.075,Math.max(.06,high),.08);
    }
    for(const x of [-2.38,-.77,.77,2.38])box(0x27342e,x,2.94,23.46,.16,4.5,.18);
    box(ivory,0,5.15,23.85,7.61,.22,1.08);box(iron,0,5.04,24.36,7.50,.12,.13);
    const face=new T.CylinderGeometry(1,1,.12,40);face.rotateX(Math.PI/2);
    stamp(face,0x303e3b,0,6.76,23.56,1.09,1.09,1);stamp(face,0xe6e1cf,0,6.76,23.64,.975,.975,1);face.dispose();
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      box(0x35413d,.82*Math.sin(a),6.76+.82*Math.cos(a),23.72,.059,i%3?.12:.21,.034,0,0,-a);
    }
    box(0x273530,-.17,6.91,23.74,.084,.53,.047,0,0,.84);
    box(0x273530,.28,6.98,23.75,.067,.76,.047,0,0,-.91);
    sign('BƯU ĐIỆN',0,8.23,23.67,3.70,.68,true);
    for(let i=0;i<5;i++)box(0x8c8178,0,.085*(5-i),23.58+i*.34,16.5,.17*(5-i),.39);
    // Short square gateposts and cast-iron lanterns along the actual forecourt.
    for(const side of [-1,1]){
      const x=side*9.8,z=27;
      box(yellow,x,.82,z,.82,1.64,.82);box(ivory,x,1.66,z,.95,.16,.95);
      stamp(round,0x3d4941,x,2.71,z,.07,2.0,.07);
      stamp(round,0xb5ab81,x,3.9,z,.23,.42,.23);
      stamp(round,iron,x,3.67,z,.25,.07,.25);
      stamp(round,iron,x,4.15,z,.26,.09,.26);
    }
  }
  register('buu-dien-sai-gon','osm-way-39514793',{
    city:'TP. Hồ Chí Minh',width:70,depth:59,yaw:-.749,viewAngle:-.72,viewElevation:.13,
    solids:[[0,14.6,34.7,7.8],[.5,-8.5,18.55,15.35],[.85,-29.45,21.85,5.75]],
    boundary:[[-34.8,6.7],[-18,6.7],[-18,-23.7],[-21,-23.7],[-21,-35.2],[22.8,-35.2],[22.8,-23.7],[19.1,-23.7],[19.1,6.7],[34.8,6.7],[34.8,22.3],[8.7,22.3],[8.7,23.4],[-8.6,23.4],[-8.6,22.3],[-34.8,22.3]],
    views:[{name:'Công trường Công xã Paris',offset:[-12,13],height:13.6,viewRadius:74},
      {name:'Đồng hồ và vòm cửa',offset:[-15.65,16.85],height:13.6,viewRadius:21,viewAngle:-.61,viewElevation:.045}],
    photo:'https://hello.hochiminhcity.gov.vn/vi/discover/buu-dien-thanh-pho',
    source:'https://vnpost.vn/vi/guong-dien-hinh-hoc-va-lam-theo-bac/buu-dien-tp-ho-chi-minh-lot-top-buu-dien-dep-nhat-the-gioi',
    description:'Đồng hồ nằm trong vòm sắt phía trên cửa chính. Hai cánh nhà màu vàng chạy dọc Công trường Công xã Paris, với những dãy cửa chớp xanh và gờ phào sáng màu.'
  },postOffice);

  function flagTower(T,{palette, group,box,stamp,profile,tapered,round,wavingFlag}){
    const brick=0xb47c59,dark=0x694639,coping=0xe5d8c0,tiles=0xbc7d5b;
    const brickwork=new T.MeshStandardMaterial({color:brick,roughness:.95});
    palette({brick});
    brickwork.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec3 brickMetres; varying vec3 brickAxis;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\n brickMetres=position;brickAxis=normal;');
      shader.fragmentShader='varying vec3 brickMetres; varying vec3 brickAxis;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 course=abs(brickAxis.y)>.75?brickMetres.xz:vec2(abs(brickAxis.x)>.707?brickMetres.z:brickMetres.x,brickMetres.y);
        course/=vec2(.36,.125);
        course.x+=.5*mod(floor(course.y),2.);
        vec2 edge=min(fract(course),1.-fract(course));
        vec2 aa=max(fwidth(course),vec2(.001));
        vec2 joint=smoothstep(vec2(.012)-aa*.33,vec2(.039)+aa*.33,edge);
        float detail=1.-smoothstep(.19,.78,max(aa.x,aa.y));
        float fired=fract(sin(dot(floor(course),vec2(21.2,7.49)))*43758.54);
        diffuseColor.rgb*=1.+detail*((fired-.5)*.17+(1.-joint.x*joint.y)*.17);
      `);
    };
    function brickTier(baseRad,topRad,height,y,sides){
      const indexed=new T.CylinderGeometry(topRad,baseRad,height,sides);
      const g=indexed.toNonIndexed();indexed.dispose();g.computeVertexNormals();
      if(sides===4)g.rotateY(Math.PI/4);
      // Bake world metres into the geometry so joint width stays consistent.
      g.translate(0,y,0);
      const m=new T.Mesh(g,brickwork);m.castShadow=m.receiveShadow=true;group.add(m);
    }
    const paving=new T.MeshStandardMaterial({color:tiles,roughness:.94,side:T.DoubleSide});
    paving.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 courtMetres;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\n courtMetres=position.xz;');
      shader.fragmentShader='varying vec2 courtMetres;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=courtMetres/.42,aa=max(fwidth(p),vec2(.002));
        vec2 seam=min(fract(p),1.-fract(p));
        vec2 tile=smoothstep(vec2(.006)-aa*.32,vec2(.024)+aa*.32,seam);
        float variation=fract(sin(dot(floor(p),vec2(8.23,12.537)))*43758.5);
        diffuseColor.rgb*=1.+(1.-smoothstep(.2,.79,max(aa.x,aa.y)))*(.10*(variation-.5)-.16*(1.-tile.x*tile.y));
      `);
    };
    // Circular forecourt and the two broad fan-shaped flights opening eastward.
    const court=new T.CylinderGeometry(56,56,.28,96);
    stamp(court,coping,0,.01,0);court.scale(.987,1,.987);court.translate(0,.1,0);
    const disk=new T.Mesh(court,paving);disk.receiveShadow=true;group.add(disk);
    function apron(inner,outer,halfAngle,level){
      const vertices=[],colours=[],shade=new T.Color();
      for(let row=0;row<5;row++)for(let i=0;i<48;i++){
        const r=inner+(outer-inner)*row/5,s=inner+(outer-inner)*(row+1)/5;
        const a=(i/24-1)*halfAngle,b=((i+1)/24-1)*halfAngle;
        const pt=(rad,angle)=>[Math.sin(angle)*rad,level,Math.cos(angle)*rad];
        const a1=pt(r,a),a2=pt(r,b),b1=pt(s,a),b2=pt(s,b);
        shade.setHex(row===4?0xd0b198:i%5===0?0xb57b59:0xc18765);
        for(const p of [a1,b1,a2,a2,b1,b2]){vertices.push(...p);colours.push(shade.r,shade.g,shade.b);}
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
      g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.computeVertexNormals();
      const m=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.93,side:T.DoubleSide}));
      m.receiveShadow=true;group.add(m);
    }
    apron(54,80,.62,.12);apron(79,105,.405,.06);
    // Each terrace is a slightly battered square, with a pale band and parapet.
    let floor=.27;
    for(const [size,height,count] of [[45,4.35,3],[30.8,4.0,2],[18.2,3.62,1]]){
      const top=size-1.35;
      brickTier(size/Math.SQRT2,top/Math.SQRT2,height,floor+height/2,4);
      for(const face of [0,Math.PI/2,Math.PI,-Math.PI/2]){
        const sin=Math.sin(face),cos=Math.cos(face);
        const place=(u,v)=>[u*cos+v*sin,-u*sin+v*cos];
        const [x,z]=place(0,size/2+.025);
        doorway(T,profile,x,floor+.05,z,2.02,1.63,.97,.38,coping,dark,face);
        for(const side of [-1,1])for(let n=1;n<=count;n++){
          const [px,pz]=place(side*(3.4+n*(size*.37-3.4)/count),size/2-.19);
          box(dark,px,floor+1.42,pz,.62,1.56,.10,face);
        }
        for(const [h,w,d] of [[height-.01,.34,.25],[height+.39,.5,.23]]){
          const [px,pz]=place(0,top*.5);
          box(coping,px,floor+h,pz,top+w,d,.44,face);
        }
        const [px,pz]=place(0,top*.5-.01);
        box(brick,px,floor+height+.22,pz,top,.29,.34,face);
      }
      box(tiles,0,floor+height,0,top,.18,top);
      floor+=height+.16;
    }
    const shaftH=18.72,shaftBase=3.58,shaftTop=2.53;
    tapered(dark,0,floor+.24,0,3.77,3.67,.48,1,8);
    brickTier(shaftBase,shaftTop,shaftH,floor+.48+shaftH/2,8);
    const port=new T.CylinderGeometry(1,1,.12,12);port.rotateX(Math.PI/2);
    for(let face=0;face<8;face++){
      const a=(face+.5)*Math.PI/4,s=Math.sin(a),c=Math.cos(a);
      for(let j=0;j<6;j++){
        const f=.095+j*.157,rad=(shaftBase+(shaftTop-shaftBase)*f)*Math.cos(Math.PI/8);
        const y=floor+.48+shaftH*f;
        stamp(port,coping,s*(rad+.02),y,c*(rad+.02),.44,.44,1,a);
        stamp(port,dark,s*(rad+.095),y,c*(rad+.095),.31,.31,.62,a);
        for(let k=0;k<4;k++){
          const t=k*Math.PI*.5;
          box(coping,s*(rad+.14)+c*.16*Math.sin(t),y+.16*Math.cos(t),c*(rad+.14)-s*.16*Math.sin(t),.055,.32,.05,a,0,-t);
        }
      }
    }
    port.dispose();
    const summit=floor+.48+shaftH;
    tapered(dark,0,summit+.22,0,2.58,3.1,.46,1,8);
    tapered(brick,0,summit+.60,0,3.13,3.13,.31,1,8);
    const balconyBase=summit+.76;
    tapered(0x514035,0,balconyBase+1.18,0,2.62,2.62,2.36,1,8);
    for(let k=0;k<8;k++){
      const a=k*Math.PI/4;
      box(brick,Math.sin(a)*2.94,balconyBase+1.22,Math.cos(a)*2.94,.68,2.48,.64,a);
    }
    tapered(brick,0,balconyBase+2.56,0,3.13,3.16,.30,1,8);
    tapered(dark,0,balconyBase+2.85,0,3.32,3.21,.33,1,8);
    tapered(0xa7664a,0,balconyBase+3.38,0,3.25,.36,.8,1,8);
    const poleFoot=balconyBase+3.76,poleTop=45;
    stamp(round,0xb9b6a7,0,(poleFoot+poleTop)/2,0,.083,poleTop-poleFoot,.083);
    wavingFlag(4,2.67,.07,poleTop-.08,0);
  }
  register('cot-co-mui-ca-mau','osm-way-1228650506',{
    city:'Đất Mũi',yaw:1.426,width:50,depth:50,viewAngle:1.14,viewElevation:.22,
    reserve:(x,z,pad)=>Math.hypot(x,z)<56+pad||z>41-pad&&z<105+pad&&Math.abs(x)<45+pad,
    solids:[[0,0,22.5,22.5]],gardenRadius:58,
    photo:'https://muicamau.camau.gov.vn/du-lich/bieu-tuong-cot-co-ha-noi-tai-mui-ca-mau/',
    source:'https://baotintuc.vn/du-lich/ngam-bieu-tuong-cot-co-ha-noi-tai-cuc-nam-cua-to-quoc-20191028231802623.htm',
    description:'Ba tầng đế vuông giật cấp mở ra sân gạch hình quạt giữa rừng đước. Các ô hoa thị chạy dọc thân tháp bát giác, bên dưới vọng lâu và lá cờ.'
  },flagTower);

  // North bank of Bàu Ông, measured along OSM way 141722681. Metres east
  // and south of the observation point; water is on the +Z side.
  const shore=[[-264,-111],[-232,-113],[-159,-115],[-145,-71],[-90,-42],[-42,-11],[-38,17],[-4,67],[70,75],[135,87],[254,90],[264,92]];
  function bankZ(x){
    for(let i=1;i<shore.length;i++){
      const a=shore[i-1],b=shore[i];
      if(x<=b[0])return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);
    }
    return shore[shore.length-1][1];
  }
  // Terrarium elevations (metres ASL), 48 m E-W by 44 m N-S spacing.
  // https://registry.opendata.aws/terrain-tiles/ — attribution in streetscape/CREDITS.txt.
  const elevations=[
    [56,55,56,71,79,76,77,78,75,73,72,73],
    [52,53,57,75,77,72,74,72,69,71,70,67],
    [48,49,55,71,69,70,73,67,65,70,67,66],
    [45,45,51,65,64,71,72,64,64,65,63,66],
    [45,48,48,56,60,69,66,59,60,58,59,63],
    [42,44,46,50,57,63,63,56,57,58,58,60],
    [40,42,44,46,47,58,58,52,54,58,59,59],
    [40,41,42,44,45,51,46,46,46,50,53,53],
    [41,41,41,41,42,43,44,45,46,47,47,47]
  ];
  function measuredHeight(x,z){
    const u=Math.max(0,Math.min(11,(x+264)/48)),v=Math.max(0,Math.min(8,(z+260)/44));
    const i=Math.min(10,Math.floor(u)),j=Math.min(7,Math.floor(v));
    const lerp=(a,b,t)=>a+(b-a)*t;
    return lerp(lerp(elevations[j][i],elevations[j][i+1],u-i),
                lerp(elevations[j+1][i],elevations[j+1][i+1],u-i),v-j);
  }
  function dunes(T,{group,random}){
    const pos=[],rgb=[],indices=[],weights=[],tint=new T.Color(),cols=89,rows=46;
    const toe=new T.Color(0xc4ad82),sand=new T.Color(0xf3dcac),sun=new T.Color(0xf6e5bf);
    function sample(x,v){
      const shoreZ=bankZ(x),z=shoreZ+(-260-shoreZ)*v;
      const trend=measuredHeight(x,z)-measuredHeight(x,shoreZ);
      const fade=T.MathUtils.smoothstep(Math.min(x+264,264-x,z+260),0,37);
      const edge=T.MathUtils.smoothstep(Math.min(x+264,264-x,z+260),0,10);
      // Wind-blown sand adds fine lee faces between the source elevation samples.
      const crest=-.54*x-86+13*Math.sin(x*.017);
      const offset=z-crest,slip=Math.exp(-Math.abs(offset)/(offset>0?14:32));
      const undulation=Math.sin(x*.031+z*.015)*Math.cos(z*.039)*.83;
      return {z,shoreZ,fade,edge,rise:Math.max(0,trend+(2.7*slip+undulation)*Math.min(1,v*7))};
    }
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const x=528*(i/cols-.5),v=j/rows,p=sample(x,v),k=pos.length/3;
      pos.push(x,p.rise,p.z);weights.push(p.shoreZ,p.fade,p.edge);
      tint.copy(toe).lerp(sand,Math.min(1,v*13)).lerp(sun,.36+.3*Math.sin(x*.022+p.z*.018));
      const variation=.96+.035*Math.sin(x*.077+p.z*.11)+random()*.035;
      rgb.push(tint.r*variation,tint.g*variation,tint.b*variation);
      if(i&&j)indices.push(k-cols-2,k-cols-1,k-1,k-1,k-cols-1,k);
    }
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(rgb,3));
    g.setIndex(indices);g.computeVertexNormals();
    const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.98});
    material.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 sandMetres;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n sandMetres=position.xz;');
      shader.fragmentShader='varying vec2 sandMetres;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float wind=dot(sandMetres,vec2(.77,.64));
        float crosswind=dot(sandMetres,vec2(.64,-.77));
        float phase=wind*19.+1.8*sin(crosswind*.96+wind*.23)+.7*sin(crosswind*2.5);
        float visible=1.-smoothstep(.45,3.,fwidth(phase));
        diffuseColor.rgb*=1.+visible*(.038*sin(phase)-.021*cos(2.*phase));
      `);
    };
    const hill=new T.Mesh(g,material);hill.name='Bờ cát Bàu Ông';hill.castShadow=hill.receiveShadow=true;group.add(hill);
    const leaves=[],grassRGB=[],roots=[];
    for(let clump=0;clump<125;clump++){
      const x=(random()-.5)*510,v=.018+random()**2*.17;
      if(Math.sin(x*.044+v*19)<-.35)continue;
      const p=sample(x,v),start=leaves.length/3;
      for(let blade=0;blade<13;blade++){
        const a=random()*Math.PI*2,r=random()*.81,bx=x+r*Math.cos(a),bz=p.z+r*Math.sin(a);
        const len=.23+random()*.55,dx=Math.cos(a)*len,dz=Math.sin(a)*len;
        const w=.05+random()*.05,wx=w*Math.cos(a+1.57),wz=w*Math.sin(a+1.57),h=.26+random()*.59;
        leaves.push(bx-wx,0,bz-wz,bx+wx,0,bz+wz,bx+dx,h,bz+dz);
        tint.setHex(blade%4?0x9c9a5c:0xb7ae73);
        for(let n=0;n<3;n++)grassRGB.push(tint.r,tint.g,tint.b);
      }
      roots.push({x,...p,start,end:leaves.length/3});
    }
    const grass=new T.BufferGeometry();grass.setAttribute('position',new T.Float32BufferAttribute(leaves,3));
    grass.setAttribute('color',new T.Float32BufferAttribute(grassRGB,3));grass.computeVertexNormals();
    const tufts=new T.Mesh(grass,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.94}));
    tufts.name='Cỏ sát bờ cát';group.add(tufts);
    const vertex=g.attributes.position,stalk=grass.attributes.position;
    group.userData.fitGround=height=>{
      function anchored(x,z,rise,shoreZ,fade,edge){
        const ground=height(x,z),survey=height(x,shoreZ)+rise;
        // A lowered rim feathers into the driving terrain. Inland, dune relief
        // is referenced to the actual shore datum rather than to the car's road.
        return ground+Math.max(0,survey-ground)*fade+edge*.20-(1-edge)*.24;
      }
      for(let i=0;i<vertex.count;i++){
        const k=i*3;
        vertex.setY(i,anchored(pos[k],pos[k+2],pos[k+1],weights[k],weights[k+1],weights[k+2]));
      }
      for(const root of roots){
        const y=anchored(root.x,root.z,root.rise,root.shoreZ,root.fade,root.edge);
        for(let i=root.start;i<root.end;i++)stalk.setY(i,leaves[i*3+1]+y);
      }
      vertex.needsUpdate=stalk.needsUpdate=true;
      g.computeVertexNormals();g.computeBoundingSphere();grass.computeBoundingSphere();
    };
  }
  register('bau-trang','osm-way-141722681',{
    city:'Hòa Thắng',formerProvince:'Bình Thuận',lon:108.40005,lat:11.08025,start:[108.39840,11.076822],
    yaw:0,width:528,depth:352,viewAngle:.37,viewElevation:.25,solids:[],
    boundary:[[-264,-260],[264,-260],...shore.slice().reverse()],
    reserve:(x,z,pad)=>Math.abs(x)<=264+pad&&z>=-260-pad&&z<=bankZ(x)+pad,
    views:[{name:'Bờ bắc Bàu Ông',height:32,viewRadius:321,viewAngle:.43,viewElevation:.22},
      {name:'Sườn cát sát mặt hồ',offset:[-41,-16],height:18,viewRadius:117,viewAngle:1.13,viewElevation:.15}],
    photo:'https://scov.gov.vn/dat-nuoc-con-nguoi/dat-nuoc-viet-nam/ho-nuoc-hung-vi-giua-doi-cat-o-binh-thuan.html',
    source:'https://www.openstreetmap.org/way/141722681',
    description:'Góc ngắm hướng qua Bàu Ông về bờ cát phía bắc. Dải cát nhạt màu đổi độ dốc quanh mép hồ, với những vân nhỏ do gió và các bụi cỏ thưa ở chân cồn.'
  },dunes);
})();
