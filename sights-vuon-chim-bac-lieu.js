'use strict';
(()=>{
  const id='vuon-chim-bac-lieu',catalogId='osm-relation-17189464',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  const source='https://nbca.gov.vn/khu-bao-ton-loai-va-sinh-canh-vuon-chim-bac-lieu-bac-lieu/';
  const photo='https://tuoitre.vn/vuon-chim-quy-tram-nam-o-bac-lieu-hoang-tan-20260319061356637.htm';
  // The roofless steel tower at the public exhibition clearing is visible in both
  // the ground photograph and DJI0214, flown 11 March 2026. The photographer's
  // WGS84 EXIF is 105.7176314 E, 9.2411008 N. Match the eastward avenue, round
  // clearing north of it, polygonal exhibit roof, and ponds to the orthophoto.
  // The tower base is estimated to 5–8 m; the footprint and stair sizes are
  // scaled from the photographs. The roofed lookout deeper in the woods and
  // the round concrete water tank beside the path are separate structures.
  // https://cdn2.tuoitre.vn/471584752817336320/2026/3/18/dji0214-17738749574341979361169.jpg
  // https://vnexpress.net/canh-hoang-phe-o-vuon-chim-bac-lieu-5052570.html
  // https://vtv.vn/nhieu-hang-muc-tai-vuon-chim-bac-lieu-xuong-cap-100260330063807784.htm
  // Access: OSM w484331811 ends at the front gate, beside paths w837930945/946.
  // Beyond it w1035601774 follows the internal patrol road beside the exhibit.
  // https://files-vnportalcmu.camau.gov.vn/cmu-chinhquyen/2696/FileVanBanChiDao/637%20q%C4%91.639087278016848706.pdf
  const avenue=x=>-13.55-.472*x;
  const ponds=[
    [[37,1],[40,-15],[52,-23],[62,-32],[73,-7],[74,.5],[63,1.8],[51,.8]],
    [[26,52],[30,46],[46,40],[56,39],[64,43],[68,68],[77,97],[81,109],[73,119],[49,124],[36,117],[30,98],[25,78]],
    [[52,210],[49,194],[49,162],[48,135],[58,132],[72,131],[87,124],[96,128],[100,157],[113,193],[108,201],[86,207]],
    [[85,-39],[86,-50],[98,-53],[120,-58],[131,-57],[131,-34],[118,-26],[103,-26],[93,-29]]
  ];
  function inside(x,z,p){
    let hit=false;
    for(let i=0,j=p.length-1;i<p.length;j=i++){
      const [a,b]=p[i],[c,d]=p[j];
      if((b>z)!==(d>z)&&x<(c-a)*(z-b)/(d-b)+a)hit=!hit;
    }
    return hit;
  }
  function clearing(x,z){
    return x>-12&&x<36&&z>avenue(x)-1&&z<13.5+.06*x;
  }
  function rand(i){const v=Math.sin(i*32.193+1.42)*23947.621;return v-Math.floor(v);}
  function beam(T,k,tint,a,b,w,h=w){
    const v=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),len=v.length();
    const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),v.normalize());
    const e=new T.Euler().setFromQuaternion(q,'YXZ');
    k.box(tint,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,w,h,len,e.y,e.x,e.z);
  }
  function lookout(T,k){
    // Lean four posts from concrete pads up to the square open deck. Each bay
    // has a cross brace and a landing returning the stairs to the opposite side.
    const steel=0x546c72,face=0x739093,rails=0x667d7d,rust=0x795e4d;
    const base=.22,deck=11.55,rise=(deck-base)/5,half=y=>1.53-.31*y/deck;
    const edge=(side,along,y)=>side%2?[side===1?half(y):-half(y),y,along*half(y)]:[along*half(y),y,side===0?-half(y):half(y)];
    for(const x of [-1,1])for(const z of [-1,1]){
      k.box(0x948d7b,x*1.53,.1,z*1.53,.58,.22,.58);
      beam(T,k,steel,[x*1.53,.18,z*1.53],[x*1.22,deck,z*1.22],.107);
      beam(T,k,face,[x*1.22,deck,z*1.22],[x*1.22,deck+1.12,z*1.22],.073);
    }
    for(let f=0;f<5;f++){
      const y=base+f*rise,top=y+rise,h=half(y),end=half(top),direction=f%2?-1:1;
      for(let side=0;side<4;side++){
        beam(T,k,steel,edge(side,-1,y),edge(side,1,y),.079,.095);
        beam(T,k,face,edge(side,-1,y+.11),edge(side,1,top-.06),.048,.052);
        beam(T,k,steel,edge(side,1,y+.11),edge(side,-1,top-.06),.048,.052);
        for(const s of [-1,1]){
          const [x,yy,z]=edge(side,s,top-.02);
          k.box(steel,x,yy,z,side%2?.14:.24,.25,side%2?.24:.14);
        }
      }
      const x=direction*.49;
      // Keep a turning landing at the end of each open flight. Grating covers
      // each tread individually, leaving daylight visible through the tower.
      k.box(rust,0,y-.042,-direction*(h-.26),2*h-.16,.085,.53);
      for(const dx of [-.39,.39]){
        const a=[x+dx,y,-direction*(h-.51)],b=[x+dx,top,direction*(end-.46)];
        beam(T,k,steel,a,b,.052,.115);
        beam(T,k,rails,[a[0],a[1]+.71,a[2]],[b[0],b[1]+.71,b[2]],.029,.036);
      }
      for(let s=0;s<12;s++){
        const t=(s+.5)/12,zz=direction*(-h+.51+(h+end-.97)*t);
        k.box(s%4===1?rust:steel,x,y+rise*(s+1)/12-.033,zz,.83,.066,(h+end-.97)/12+.046);
      }
    }
    k.box(rust,0,deck-.083,0,2.55,.155,2.55);
    for(let side=0;side<4;side++){
      const rot=side*Math.PI/2;
      k.place(0,0,rot,()=>{
        k.box(face,0,deck+.06,1.235,2.52,.115,.095);
        k.box(steel,0,deck+1.16,1.235,2.54,.075,.075);
        for(const x of [-.8,-.4,0,.4,.8])k.box(steel,x,deck+.98,1.235,.040,.34,.048);
        k.box(rails,0,deck+.8,1.235,2.5,.042,.048);
        for(const x of [-.81,0,.81]){
          beam(T,k,face,[x-.39,deck+.14,1.235],[x+.39,deck+.78,1.235],.042,.044);
          beam(T,k,steel,[x+.39,deck+.14,1.235],[x-.39,deck+.78,1.235],.042,.044);
        }
      });
    }
  }
  const gallery=[18.5,4.1];
  function exhibit(T,k){
    const stone=0xa3a597,washed=0xa7c1ac,green=0x739685;
    const band=1.03,side=8,rv=6.2,r=Math.cos(Math.PI/8)*rv,span=2*rv*Math.sin(Math.PI/8);
    k.tapered(stone,0,band*.5,0,6.32,6.32,band,1,side);
    k.tapered(0xc4c0ab,0,band+.06,0,6.61,6.61,.12,1,side);
    // Octagonal hipped roof with broad eaves and the gallery of framed bird
    // drawings visible in ground photographs, over the raised concrete plinth.
    k.tapered(0x8e7967,0,4.34,0,7.22,.12,1.5,1,side);
    k.tapered(0x806c5e,0,3.58,0,7.22,7.22,.10,1,side);
    // The interior photograph shows a forked, tree-shaped centre column,
    // benches facing it, and narrow exhibit cases just inside the windows.
    k.tapered(0x877669,0,2.17,0,.51,.34,2.16,.93,9);
    for(const a of [.2,2.65,4.75]){
      beam(T,k,0x877669,[0,2.66,0],[.51*Math.sin(a),4.37,.51*Math.cos(a)],.37,.39);
    }
    for(const a of [1.35,3.21,4.91])k.place(Math.sin(a)*2.38,Math.cos(a)*2.38,a,()=>{
      k.box(0x806c56,0,1.61,0,1.82,.065,.34);
      for(const x of [-.62,.62])k.box(0x807b69,x,1.37,0,.08,.44,.20);
    });
    for(let i=0;i<side;i++){
      const a=i*Math.PI/4,x=rv*Math.sin(a),z=rv*Math.cos(a);
      k.box(washed,x,2.29,z,.15,2.46,.15);
      beam(T,k,0x817564,[x*.72,3.70,z*.72],[x*1.12,3.57,z*1.12],.095,.13);
      beam(T,k,0x927e6d,[.09*Math.sin(a),5.097,.09*Math.cos(a)],[x*1.16,3.61,z*1.16],.037,.045);
      const rot=a+Math.PI/8,dx=Math.sin(rot)*r,dz=Math.cos(rot)*r;
      k.place(dx,dz,rot,()=>{
        k.box(green,0,3.39,-.70,span-.25,.48,.06);
        for(let n=0;n<20;n++)k.box(0xc5ceaf,(n-9.5)*span/21,3.39,-.65,.051,.45,.035);
        for(const sx of [-1.30,0,1.30]){
          k.box(0x9d8b61,sx,3.39,-.60,.64,.54,.062);
          k.box(0xd7d1b5,sx,3.39,-.56,.58,.48,.018);
          k.outline([[-.18,.035],[-.06,.073],[.035,.035],[.11,.13],[.18,.10],[.095,.066],[.059,-.018],[-.045,-.055],[-.14,-.082],[-.079,-.022]],0x676d60,sx,3.38,-.548,.01);
        }
        for(const sx of [-span*.47,span*.47])k.box(green,sx,2.32,-.70,.073,2.27,.085);
        if(i%3===0){
          k.box(0xa0a99a,0,1.32,-1.23,2.84,.33,.42);
          k.box(0x9daaa2,0,1.49,-1.23,2.85,.09,.47);
          for(const sx of [-1.34,1.34])k.box(0x76877c,sx,1.65,-1.23,.035,.29,.32);
        }
        const gap=i===4;
        for(const sx of [-span*.47,...(gap?[-.82,.82]:[0]),span*.47])k.box(washed,sx,1.51,.17,.153,.87,.15);
        for(const [lo,hi] of (gap?[[-span*.46,-.82],[.82,span*.46]]:[[-span*.46,span*.46]])){
          k.box(green,(lo+hi)/2,1.86,.17,hi-lo,.079,.065);
          for(let t=lo+.17;t<hi;t+=.32)k.box(green,t,1.5,.17,.035,.64,.037,0,0,.22);
        }
        if(gap)for(let s=0;s<6;s++)k.box(stone,0,(s+1)*.086,1.44-s*.24,1.61,(s+1)*.172,.25);
      });
    }
  }
  function geometry(T,positions,colors,indices){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    if(colors)g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    if(indices)g.setIndex(indices);g.computeVertexNormals();return g;
  }
  function groundSurfaces(T,k){
    const list=[];
    function polygon(outline,tint,kind){
      const v=outline.map(p=>new T.Vector2(...p)),ps=outline.flatMap(([x,z])=>[x,0,z]);
      const g=geometry(T,ps,null,T.ShapeUtils.triangulateShape(v,[]).flat());
      let material=new T.MeshLambertMaterial({color:tint,side:T.DoubleSide});
      if(kind==='water'){
        const x0=Math.min(...outline.map(p=>p[0])),z0=Math.min(...outline.map(p=>p[1]));
        const w=Math.max(...outline.map(p=>p[0]))-x0,h=Math.max(...outline.map(p=>p[1]))-z0;
        const side=160,pixels=new Uint8Array(side*side*4);
        for(let iy=0;iy<side;iy++)for(let ix=0;ix<side;ix++){
          const x=x0+w*ix/(side-1),z=z0+h*iy/(side-1);
          let bank=Infinity;
          for(let j=0;j<outline.length;j++){
            const [ax,az]=outline[j],[bx,bz]=outline[(j+1)%outline.length],dx=bx-ax,dz=bz-az;
            const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
            bank=Math.min(bank,Math.hypot(x-ax-t*dx,z-az-t*dz));
          }
          // The canopy shades the still water at the margin. A small broken
          // reflection of the sky opens toward the middle of each pool.
          const sky=Math.min(1,bank/(5.3+1.5*Math.sin(x*.55+z*.31)));
          const ripple=Math.sin(z*2.31+.78*Math.sin(x*.54))+.56*Math.sin(z*4.9-x*.59);
          const light=sky*(Math.max(0,ripple-.58)*8.5+2.1*Math.sin(x*.21+z*.14));
          const i=(iy*side+ix)*4;pixels[i]=47+sky*41+light;pixels[i+1]=63+sky*45+light;
          pixels[i+2]=41+sky*51+light;pixels[i+3]=255;
        }
        const map=new T.DataTexture(pixels,side,side);map.colorSpace=T.SRGBColorSpace;
        map.minFilter=T.LinearFilter;map.magFilter=T.LinearFilter;map.needsUpdate=true;
        g.setAttribute('uv',new T.Float32BufferAttribute(outline.flatMap(([x,z])=>[(x-x0)/w,(z-z0)/h]),2));
        material.dispose();material=new T.MeshPhongMaterial({map,side:T.DoubleSide,shininess:17,specular:0x465541});
      }
      const m=new T.Mesh(g,material);
      m.receiveShadow=true;k.group.add(m);list.push({g,kind,outline});
    }
    for(const p of ponds){
      const cx=p.reduce((a,b)=>a+b[0],0)/p.length,cz=p.reduce((a,b)=>a+b[1],0)/p.length;
      polygon(p.map(([x,z])=>[cx+(x-cx)*1.035,cz+(z-cz)*1.035]),0x556442,'bank');
      polygon(p,0x526b51,'water');
    }
    // The internal concrete patrol road is six metres wide in the first
    // 250 m from the gate, then three metres wide, without a separate sidewalk.
    // https://baoxaydung.vn/ca-mau-dau-tu-gan-20-ty-dong-nang-cap-duong-vao-vuon-chim-bac-lieu-192260317183220202.htm
    const path=[],faces=[],shades=[];
    for(let x=-292;x<=252;x+=4){
      const i=path.length/3,z=avenue(x),half=1.66*(1+Math.max(0,Math.min(1,(x-20)/10)));
      path.push(x,0,z-half,x,0,z+half);
      for(let j=0;j<2;j++){
        const c=new T.Color(0xc0b9a6).multiplyScalar(.85+.13*rand(i*5+j));
        shades.push(c.r,c.g,c.b);
      }
      if(i)faces.push(i-2,i-1,i,i,i-1,i+1);
    }
    const trail=geometry(T,path,shades,faces),mesh=new T.Mesh(trail,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}));
    mesh.receiveShadow=true;k.group.add(mesh);list.push({g:trail,kind:'trail',outline:[]});
    return list;
  }
  function vegetation(T,k){
    const tree=createTreeModels(T),rows=[[],[],[],[]],shrubs=[[],[],[],[]],palms=[[],[],[],[]],near=[];
    const inWater=(x,z)=>ponds.some(p=>inside(x,z,p));
    for(let iz=-46;iz<=46;iz++)for(let ix=-45;ix<=45;ix++){
      const i=(iz+46)*97+ix+46,x=(ix+rand(i)-.5)*6.3,z=(iz+rand(i+7951)-.5)*6.3;
      if(clearing(x,z)||inWater(x,z)||Math.abs(z-avenue(x))<3.8)continue;
      const d=Math.hypot(x,z),patch=.5+.5*Math.sin(x*.030+Math.sin(z*.052))*Math.cos(z*.037+x*.010);
      const h=4.6+patch*4.4+rand(i+87)*3.2,w=h*(.82+.38*rand(i+190)),a=rand(i+70)*6.28;
      const v=i%4;
      if(d<58&&rand(i+345)<.5)near.push([x,0,z,w,h,a]);
      else rows[v].push([x,z,w,h,a,.73+.23*patch]);
      if(d<88&&rand(i+130)<.42){
        for(let p=0;p<2;p++)palms[v].push([x+p*1.1,z-.7*p,4.9+rand(i+p+7)*2.5,2.8+rand(i+p+61)*2.9,a-p,.9]);
      }
      shrubs[v].push([x,z,w*.91,1.7+3.9*rand(i-57),a+.7,.77+.12*patch]);
    }
    // In the ground photographs the clearing is returning to scrub. Keep the
    // foot of the tower, exhibit stair and lane clear, with low green margins.
    for(let i=0;i<104;i++){
      const x=-12+46*rand(i+2450),z=-24+45*rand(i+3578);
      if(!clearing(x,z)||Math.abs(z-avenue(x))<3.3||Math.hypot(x,z)<2.8||Math.hypot(x-gallery[0],z-gallery[1])<7.1)continue;
      const v=i%4,h=.48+1.2*rand(i-11);shrubs[v].push([x,z,h*(1.9+rand(i-65)),h,i*2.399,.75+.23*rand(i+53)]);
    }
    const start=k.group.children.length,pose=new T.Object3D();tree.grove(k.group,near);
    for(let v=0;v<4;v++)for(const [batch,g,m] of [
      [rows[v],tree.distantGeometry('tree',v),tree.billboardMaterial()],
      [shrubs[v],tree.distantGeometry('tea',v),tree.billboardMaterial()],
      [palms[v],tree.geometry('palm',true,v),tree.palmMaterial]
    ]){
      const mesh=new T.InstancedMesh(g,m,batch.length);
      batch.forEach(([x,z,w,h,a,tone],j)=>{
        pose.position.set(x,0,z);pose.scale.set(w,h,w);pose.rotation.y=a;pose.updateMatrix();
        mesh.setMatrixAt(j,pose.matrix);mesh.setColorAt(j,new T.Color(.76*tone,tone,.67*tone));
      });k.group.add(mesh);
    }
    return k.group.children.slice(start);
  }
  function flight(T,k){
    // A passing flock over the public clearing. Its motion illustrates the
    // habitat; no roost or nesting coordinates are encoded.
    const vertices=[],colors=[],triangles=[],birds=[],wing=[];
    const quiet=matchMedia('(prefers-reduced-motion: reduce)');
    function tri(a,b,c,tint,part=0){
      const start=vertices.length/3,col=new T.Color(tint);
      for(const p of [a,b,c]){vertices.push(...p);colors.push(col.r,col.g,col.b);wing.push(part);}
      triangles.push(start,start+1,start+2);
    }
    for(let j=0;j<18;j++){
      const first=vertices.length/3,shade=j%4?0xe8e4d0:0xd8dbc9;
      const head=[0,.065,.265],back=[0,.105,.026],keel=[0,-.085,-.025],tail=[0,-.018,-.43];
      for(const s of [-1,1]){
        const shoulder=[s*.088,.035,.10],hip=[s*.069,-.032,-.19],neck=[s*.047,.03,.267];
        tri(shoulder,hip,back,shade);tri(hip,tail,back,shade);tri(keel,shoulder,neck,shade);
        tri(keel,hip,shoulder,shade);tri(back,shoulder,head,shade);tri(shoulder,neck,head,shade);
        tri(head,neck,[0,.012,.48],0xb59a59);tri(hip,[s*.025,-.042,-.39],[s*.040,-.054,-.63],0x544f40);
        const arm=[s*.42,.12,.09],tip=[s*.76,.018,-.065],elbow=[s*.49,.04,-.14];
        tri(shoulder,arm,elbow,shade,s);tri(shoulder,elbow,hip,shade,s);
        tri(arm,tip,elbow,shade,s);
        for(let n=0;n<4;n++)tri([s*(.45+n*.052),.05,-.07],[s*(.54+n*.068),.015,-.23+n*.034],[s*(.53+n*.055),.055,-.04],shade,s);
      }
      birds.push({first,last:vertices.length/3,j});
    }
    const g=geometry(T,vertices,colors,triangles),m=new T.Mesh(g,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}));
    m.frustumCulled=false;k.group.add(m);const p=g.attributes.position;let last=-1;
    function draw(){
      const now=quiet.matches?0:Math.floor(performance.now()/65);
      if(now===last)return;last=now;
      const t=now*.065;
      for(const {first,last:end,j} of birds){
        const group=Math.floor(j/6),phase=t*.060+group*2.094+(j%6)*.071;
        const side=group===1?-1:1,range=49+group*4;
        const cx=27+Math.sin(phase)*range+Math.cos(j*4.21)*4;
        const cz=49+group*8+side*Math.cos(phase)*17+Math.sin(j*1.92)*4;
        const cy=13.8+group*.72+Math.sin(j*.97)*1.5+Math.sin(phase*2+j)*.46;
        const a=Math.atan2(Math.cos(phase)*range,-side*Math.sin(phase)*17),sn=Math.sin(a),cs=Math.cos(a);
        const flap=Math.sin(t*3.8+j*2.23)*.48+.045;
        for(let i=first;i<end;i++){
          const x=vertices[i*3],y=vertices[i*3+1],z=vertices[i*3+2];
          const dx=wing[i]?x*Math.cos(flap):x,dy=wing[i]?y+Math.abs(x)*Math.sin(flap):y;
          p.setXYZ(i,cx+dx*cs+z*sn,cy+dy,cz-dx*sn+z*cs);
        }
      }
      p.needsUpdate=true;g.computeVertexNormals();
    }
    draw();m.onBeforeRender=draw;
  }
  function build(T,k){
    k.palette({metal:[0x546c72,0x739093,0x667d7d],plaster:[0xa7c1ac,0xc4c0ab],stone:0xa3a597,tile:0x8e7967,timber:[0x806c56,0x877669]});
    k.place(0,0,-.41,()=>lookout(T,k));
    const lo=k.vertexCount();k.place(...gallery,.14,()=>exhibit(T,k));const hi=k.vertexCount();
    const surfaces=groundSurfaces(T,k),groves=vegetation(T,k);flight(T,k);
    const baseline=new WeakMap();
    const rest=a=>{if(!baseline.has(a))baseline.set(a,a.array.slice());return baseline.get(a);};
    k.group.userData.fitGround=ground=>{
      const shell=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;
      if(shell){
        const p=shell.attributes.position,a=rest(p),dy=ground(...gallery);
        for(let i=lo;i<hi;i++)p.setY(i,a[3*i+1]+dy);p.needsUpdate=true;shell.computeBoundingSphere();
      }
      for(const {g,kind,outline} of surfaces){
        const p=g.attributes.position,level=Math.max(...outline.map(([x,z])=>ground(x,z)));
        for(let i=0;i<p.count;i++)p.setY(i,kind==='trail'?ground(p.getX(i),p.getZ(i))+.12:level+(kind==='water'?.19:.095));
        p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
      }
      for(const m of groves){
        const a=rest(m.instanceMatrix),b=m.instanceMatrix.array;
        for(let i=12;i<a.length;i+=16)b[i+1]=a[i+1]+ground(a[i],a[i+2]);
        m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
      }
    };
  }
  const shot=(name,x,z,height,viewRadius,viewAngle,viewElevation)=>({name,offset:[x,z],height,viewRadius,viewAngle,viewElevation,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Vườn chim Bạc Liêu – lối ngắm chim',kind:'Khu bảo tồn',
    lon:105.71845,lat:9.24143,start:[105.7207283,9.2426326],source,photo,map:'https://www.openstreetmap.org/relation/17189464',
    width:29,depth:20,yaw:0,foundationAt:[0,0],gardenRadius:23,solids:[],visitOnArrival:true,mappedEntrance:true,approachMeters:290,
    reserve:(x,z,p)=>x>-15-p&&x<37+p&&z>avenue(x)-2-p&&z<15+p,
    description:'Đài khung thép đứng bên lối đi, cạnh nhà trưng bày đa giác. Phía nam lối là những khoảng nước giữa rừng chà là và cây lá rộng. Đàn chim bay qua tán là minh họa cho sinh cảnh. Vị trí chân đài và kích thước khung được ước dựng theo ảnh mặt đất và ảnh bay tháng 3/2026.',
    arrivalNote:'Xe dừng trước cổng ở cuối đường Hứa Hoà Hưng. Từ cổng đến khu trưng bày khoảng 290 m theo lối nội bộ. Tháng 3/2026, đài và một số lối tham quan đã xuống cấp. Góc nhìn trên cao được mô phỏng.',
    views:[shot('Khung đài và nhà trưng bày bên lối đi',5,1,14.5,24,-1.26,.21),
      shot('Góc cao mô phỏng nhìn qua hồ và tán rừng',34,61,19.0,60,-2.57,.14)],build});
})();
