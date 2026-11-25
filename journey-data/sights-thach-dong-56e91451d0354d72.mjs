const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const K=window.VietnamKarst,A=window.CentralArch,atlas=window.VietnamTourism;
  const id='thach-dong-ha-tien',catalogId='osm-node-2327003316',raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  const source='https://diamoitruong.com/2016/01/11/dia-di-san-thach-dong/';
  const yaw=2.20,c=Math.cos(yaw),s=Math.sin(yaw),tau=2*Math.PI,floor=9.05;
  const local=(east,south)=>[c*east-s*south,s*east+c*south];
  const world=(x,z)=>[c*x+s*z,-s*x+c*z];
  // Hà Quang Hải et al., Fig. 7: public chamber plan and A–B section.
  // Image coordinates below have north up; the scale bar is 5 m / 72 px.
  // The main doorway is the origin. Wall relief and the vertical sizes of
  // the individual windows are interpreted from photographs.
  const metres=5/72;
  const plan=(x,y)=>local((x-355)*metres,(y-160)*metres);
  const drawing=[[349,151],[337,159],[298,146],[273,156],[252,174],[247,199],[234,197],[194,137],[198,106],
    [217,86],[228,77],[206,58],[191,75],[184,89],[176,78],[161,71],[159,59],[143,55],[105,55],[80,59],[57,66],
    [65,90],[85,80],[103,79],[117,92],[139,125],[142,136],[117,154],[74,188],[50,216],[51,229],[39,280],[52,323],
    [48,342],[62,351],[78,335],[138,296],[149,295],[170,299],[255,345],[273,345],[283,339],[302,281],[329,269],
    [353,237],[355,173],[362,158]];
  const outline=drawing.map(p=>plan(...p));
  // The survey shows the opening at map scale. Form its first metre at the
  // clear width of the photographed masonry doorway, behind the stone jambs.
  outline[0]=[1.04,-.78];outline[1]=[1.12,-1.26];
  outline[45]=[-1.12,-1.26];outline[46]=[-1.04,-.78];
  const centre=[-10.8,1.4],axis=40*Math.PI/180;
  const ports=[{i:46,w:4.5,h:14.2,inner:8.0},{i:10,w:2.0,h:5.0,inner:3.78},
    {i:20,w:2.20,h:5.4,inner:3.60},{i:33,w:2.52,h:5.0,inner:3.75}];
  for(const p of ports){
    const a=drawing[p.i],b=drawing[(p.i+1)%drawing.length],east=((a[0]+b[0])/2-355)*metres,south=((a[1]+b[1])/2-160)*metres;
    const [aheadE,aheadS]=p.i===46?world(0,7):[0,0];
    p.bearing=Math.atan2(south+aheadS-centre[1],east+aheadE-centre[0]);
    p.width=p.w/17;p.ends=[outline[p.i],outline[(p.i+1)%outline.length]];
    if(p.i===46)p.ends=[[-2.65,-.54],[2.65,-.54]];
    // Order the endpoints in the same angular direction as the outer shell.
    const dot=([x,z])=>{const [e,n]=world(x,z);return -e*Math.sin(p.bearing)+n*Math.cos(p.bearing);};
    p.ends.sort((a,b)=>dot(a)-dot(b));
  }
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  const delta=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
  function opening(angle){
    for(const p of ports){
      const t=delta(angle,p.bearing)/p.width;
      if(Math.abs(t)<=1)return p.h*(1-Math.abs(t)**1.48)**.80;
    }
    return 0;
  }
  // 41 m along azimuth 040° and about 1,000 m² at the foot. The 91 m in
  // the field report is elevation above sea level. An Giang Tourism describes
  // about 50 m of exposed rock. The sandstone hill to the north is separate.
  const top=a=>49.7+2.60*Math.sin(2*a+.7)+1.13*Math.cos(5*a-.2);
  function shell(a,y){
    const e=Math.cos(a),n=Math.sin(a),major=e*Math.sin(axis)-n*Math.cos(axis),minor=e*Math.cos(axis)+n*Math.sin(axis);
    const radius=1/Math.hypot(major/20.5,minor/15.53),v=Math.max(0,Math.min(1,y/top(a)));
    const taper=1-.085*Math.sin(v*Math.PI*2.6)-.19*smooth((v-.63)/.37)-.16*smooth((v-.86)/.14);
    const fissure=1.21*Math.cos(6*a+.069*y)+.73*Math.sin(14*a-.091*y)+.44*Math.cos(23*a+.132*y);
    const strata=.79*Math.sin(y*.39+1.54*Math.cos(a-.6))+.46*(1-Math.abs(Math.sin(.53*y+2*a)))**2;
    const notch=1.85*smooth((v-.17)/.08)*(1-smooth((v-.34)/.10))*Math.max(0,Math.cos(a+1.1));
    const r=radius*taper+(fissure+strata)*(.32+.68*Math.sin(v*Math.PI)**.45)-notch;
    return local(centre[0]+r*e-.94*v,centre[1]+r*n+.58*v);
  }
  function skycap(rock){
    const origin=local(...centre);
    rock.grid(128,12,(u,v)=>{
      const a=u*tau,[x,z]=shell(a,top(a)),r=Math.cos(v*Math.PI/2),h=top(a)*(1-v)+51.7*v+1.75*Math.sin(v*Math.PI);
      return [origin[0]+(x-origin[0])*r,h,origin[1]+(z-origin[1])*r,0x747f58,.85+.13*Math.sin(7*a+3*v)];
    });
  }
  function tower(rock){
    function skin(a,y){
      const [x,z]=shell(a,y),joint=Math.cos(12*a+.08*y)+.55*Math.sin(25*a-.10*y);
      const moss=.55*Math.sin(7*a+.14*y)+.38*Math.cos(12*a-.17*y)+.21*Math.sin(22*a+.31*y);
      const shade=.81+.15*Math.cos(4*a+.05*y)+.088*Math.cos(.69*y+.31*x);
      return [x,y,z,y<5.4?(joint>.38?0x9b8c70:0x74725e):moss>.59&&y>14?0x788459:joint>.52?0xc0bc9f:joint<-.47?0x75796f:0xa4a598,shade];
    }
    // Split at every actual portal jamb so the aperture and the short reveal
    // share their endpoints, even when sampling a steep, narrow fissure.
    const angles=Array.from({length:161},(_,i)=>i*tau/160);
    for(const p of ports)for(let j=0;j<=22;j++)angles.push((p.bearing+p.width*(2*j/22-1)+tau)%tau);
    angles.sort((a,b)=>a-b);
    for(let i=1;i<angles.length;i++){
      const a=angles[i-1],b=angles[i];if(b-a<1e-6)continue;
      rock.grid(1,7,(u,v)=>skin(a+(b-a)*u,-2.55+(floor+2.55)*v));
      rock.grid(1,39,(u,v)=>{
        const ang=a+(b-a)*u,lip=floor+opening(ang);
        return skin(ang,lip+(top(ang)-lip)*v);
      });
    }
    skycap(rock);
    for(const p of ports){
      rock.grid(22,7,(u,v)=>{
        const shape=(1-Math.abs(2*u-1)**1.48)**.80,angle=p.bearing+p.width*(2*u-1),h=floor+p.h*shape;
        const [x,z]=shell(angle,h),[a,b]=p.ends,xx=a[0]+(b[0]-a[0])*u,zz=a[1]+(b[1]-a[1])*u;
        return [x+(xx-x)*v,floor+(p.h+(p.inner-p.h)*v)*shape,z+(zz-z)*v,0x99988a,.86-.36*v];
      });
      rock.grid(22,5,(u,v)=>{
        const [x,z]=shell(p.bearing+p.width*(2*u-1),floor),[a,b]=p.ends;
        return [x+(a[0]+(b[0]-a[0])*u-x)*v,floor+.017,z+(a[1]+(b[1]-a[1])*u-z)*v,0x97978a,.76-.23*v];
      });
    }
    for(let i=0;i<112;i++){
      const a=(i*.618034%1)*tau,y=12+(i*.3897%1)*37;
      if(opening(a)>0&&y<floor+opening(a)+2.2)continue;
      const [x,z]=shell(a,y),h=.55+(i*.897%1)*1.3;
      rock.ferns.push([x,y-.10,z,h,i*2.31]);
      if(i%3===1&&y>24)rock.trees.push([x,y-.22,z,h*1.5,h*2.1,a]);
    }
    for(let i=0;i<21;i++){
      const a=(i*.618034%1)*tau,r=.30+.55*(i*.3762%1),[x,z]=shell(a,top(a)),o=local(...centre);
      const h=1.8+(i*.387%1)*2.1;
      rock.trees.push([o[0]+(x-o[0])*r,51.25,z*r+o[1]*(1-r),h*.94,h,i*2.1]);
    }
  }
  function canopy(T,k){
    const stems=[],origin=local(...centre);
    // Broad clumps cling to ledges and cap the summit; leave the pale vertical
    // jointing below the east face exposed as in the geological field photos.
    function crown(x,y,z,rise,width,phase){
      stems.push([x,y-.40,z,width*2.06,rise*1.71,phase]);
    }
    for(let i=0;i<690;i++){
      const a=(i*.618034%1)*tau,v=(i*.414214%1),y=5+v*(top(a)-5);
      const growth=Math.sin(3*a+y*.16)+.61*Math.cos(7*a-y*.21)+.26*Math.sin(13*a+y*.43);
      const bareMain=Math.abs(delta(a,ports[0].bearing))<.64&&y<31;
      if(bareMain||growth<(v>.74?-.85:v<.18?.63:-.16)||opening(a)&&y<floor+opening(a)+1.1)continue;
      const [x,z]=shell(a,y),h=.69+(i*.7361%1)*1.61;
      crown(x,y,z,h,h*(1.29+.49*(i*.3378%1)),i,a);
    }
    for(let i=0;i<130;i++){
      const a=(i*.618034%1)*tau,r=Math.sqrt(i/130),[x,z]=shell(a,top(a));
      const y=top(a)*r+51.7*(1-r)+1.02*Math.sin((1-r)*Math.PI);
      const w=1.44+1.15*(i*.485%1);crown(origin[0]+r*(x-origin[0]),y-.4,origin[1]+r*(z-origin[1]),w*.72,w,i,a);
    }
    const trees=createTreeModels(T),mesh=new T.InstancedMesh(trees.geometry('tea',true,0),trees.material,stems.length),p=new T.Object3D();
    for(const [i,[x,y,z,w,h,a]] of stems.entries()){
      p.position.set(x,y,z);p.rotation.y=a;p.scale.set(w,h,w*.80);p.updateMatrix();mesh.setMatrixAt(i,p.matrix);
      mesh.setColorAt(i,new T.Color(i%3?0xc8d4ac:0xacbd9f));
    }
    mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);
  }
  function stoneFacing(T){
    const size=512,n=8,canvas=document.createElement('canvas');canvas.width=canvas.height=size;
    const g=canvas.getContext('2d'),wrap=i=>(i%n+n)%n,hash=(i,j,t)=>{
      const v=Math.sin(wrap(i)*62.31+wrap(j)*31.37+t*44.19)*7354.523;return v-Math.floor(v);
    },site=(i,j)=>[i+.17+.66*hash(i,j,2),j+.17+.66*hash(i,j,5)],side=size/n;
    g.fillStyle='#c2b7a3';g.fillRect(0,0,size,size);
    for(let j=-1;j<=n;j++)for(let i=-1;i<=n;i++){
      const [x,y]=site(i,j);let poly=[[x-2,y-2],[x+2,y-2],[x+2,y+2],[x-2,y+2]];
      for(let m=j-1;m<=j+1;m++)for(let l=i-1;l<=i+1;l++){
        if(l===i&&m===j)continue;
        const [xx,yy]=site(l,m),dx=xx-x,dy=yy-y,limit=(xx*xx+yy*yy-x*x-y*y)/2,out=[];
        for(let h=0;h<poly.length;h++){
          const a=poly[h],b=poly[(h+1)%poly.length],da=a[0]*dx+a[1]*dy-limit,db=b[0]*dx+b[1]*dy-limit;
          if(da<=0)out.push(a);
          if((da<0)!==(db<0)){const t=da/(da-db);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
        }
        poly=out;
      }
      const value=Math.round(103+53*hash(i,j,7));
      g.fillStyle='rgb('+value+','+(value-1)+','+(value-10)+')';g.strokeStyle='#bfb6a8';g.lineWidth=2.2;g.lineJoin='round';
      g.beginPath();poly.forEach(([x,y],j)=>j?g.lineTo(x*side,y*side):g.moveTo(x*side,y*side));g.closePath();g.fill();g.stroke();
    }
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(.41,.41);map.anisotropy=4;
    return map;
  }
  function room(T,k,rock,paving){
    const edges=new Set(ports.map(p=>p.i));
    // Chamber walls end at the four mapped openings; no passage to the sea
    // is drawn. The shrines and altar follow the polygons in the field plan.
    for(let i=0;i<outline.length;i++){
      if(edges.has(i))continue;
      const a=outline[i],b=outline[(i+1)%outline.length],l=Math.hypot(a[0]-b[0],a[1]-b[1]);
      rock.grid(Math.max(2,Math.ceil(l*2)),7,(u,v)=>{
        const x=a[0]+(b[0]-a[0])*u,z=a[1]+(b[1]-a[1])*u,crease=.13*Math.sin(v*11+x*.5)*Math.sin(Math.PI*u);
        return [x+crease,floor-.02+6.29*v,z-.5*crease,0x86877b,.51+.12*Math.cos(v*9+x*.44)];
      });
    }
    function shape(points){
      return new T.Shape(points.map(([x,z])=>new T.Vector2(x,-z)));
    }
    const flags=new T.ShapeGeometry(shape(outline));flags.rotateX(-Math.PI/2);
    const floorMesh=new T.Mesh(flags,new T.MeshStandardMaterial({map:paving,color:0x89887c,roughness:.91}));
    floorMesh.position.y=floor+.16;floorMesh.receiveShadow=true;k.group.add(floorMesh);
    const roof=shape(outline),hole=plan(182,153),ellipse=[];
    for(let j=0;j<24;j++){
      const a=j*tau/24;ellipse.push([hole[0]+.52*Math.cos(a)+.13*Math.sin(a*3),hole[1]+1.30*Math.sin(a)]);
    }
    roof.holes.push(new T.Path(ellipse.map(([x,z])=>new T.Vector2(x,-z))));
    const ceiling=new T.ShapeGeometry(roof);ceiling.rotateX(Math.PI/2);
    // Reverse winding without mirroring the projected chamber.
    ceiling.scale(1,1,-1);const idx=ceiling.index;
    for(let i=0;i<idx.count;i+=3){const b=idx.getX(i+1);idx.setX(i+1,idx.getX(i+2));idx.setX(i+2,b);}
    ceiling.computeVertexNormals();k.stamp(ceiling,0x63675a,0,floor+6.19,0);ceiling.dispose();
    rock.grid(24,11,(u,v)=>{
      const a=u*tau,x=hole[0]+(.52-.24*v)*Math.cos(a)+.13*Math.sin(3*a)+v*.48,z=hole[1]+(1.30-.52*v)*Math.sin(a);
      return [x,floor+6.13+13*v,z,0xa7a794,.50+v*.45];
    });
    const shrine=[[67,216],[158,138],[225,232],[155,287]].map(p=>plan(...p)),mid=[0,1].map(i=>shrine.reduce((n,p)=>n+p[i],0)/4);
    const width=Math.hypot(shrine[1][0]-shrine[0][0],shrine[1][1]-shrine[0][1]),depth=Math.hypot(shrine[2][0]-shrine[1][0],shrine[2][1]-shrine[1][1]);
    const a=Math.atan2(shrine[1][0]-shrine[0][0],shrine[1][1]-shrine[0][1])-Math.PI/2,wood=0x694637;
    k.place(mid[0],mid[1],a,()=>{
      k.box(0x968d7a,0,floor+.14,0,width,.22,depth);
      for(const x of [-.43*width,0,.43*width])for(const z of [-.40*depth,.40*depth])k.stamp(k.round,wood,x,floor+1.68,z,.18,3.00,.18);
      for(const z of [-.40*depth,.40*depth])k.box(wood,0,floor+3.15,z,width,.25,.21);
      A.gabledRoof(T,k,0,floor+3.20,0,width,depth,1.25,0x8e5942,0x766e5e,{overhang:.09,thick:.12});
      k.box(0x624130,0,floor+1.36,-depth*.28,width*.67,2.4,.19);
    });
    const altar=plan(242,267),bronze=0xb99a55,crimson=0x84442d;
    k.place(altar[0],altar[1],.13,()=>{
      k.box(0x735342,0,floor+.62,0,2.16,1.13,.91);
      k.box(0x695040,0,floor+.18,0,2.27,.14,.98);
      for(const x of [-.64,0,.64]){
        k.box(0x5f4232,x,floor+.69,.465,.56,.69,.046);
        k.box(0x805b41,x,floor+.69,.495,.47,.60,.020);
      }
      k.box(0x9e7850,0,floor+1.23,0,2.31,.16,1.01);
      k.box(crimson,0,floor+2.12,-.47,2.09,1.88,.17);
      k.box(0x5f4432,0,floor+2.16,-.36,1.56,1.56,.06);
      for(const side of [-1,1]){
        k.box(bronze,side*.98,floor+2.12,-.36,.12,1.91,.12);
        k.tapered(0xc8aa66,side*.865,floor+2.14,-.31,.065,.075,1.69,1,14);
        for(const y of [1.38,1.56,2.75,2.93])k.tapered(bronze,side*.865,floor+y,-.31,.085,.097,.085,1,14);
        k.tapered(0xad986c,side*.61,floor+1.47,.05,.075,.12,.20,1,16);
      }
      k.box(bronze,0,floor+3.11,-.41,2.22,.17,.29);
      k.box(crimson,0,floor+3.24,-.41,2.35,.12,.35);
      for(let j=0;j<8;j++)k.box(0xcbb372,-.83+j*.237,floor+3.05,-.245,.13,.108,.038,0,0,.40);
      // The survey labels this freestanding altar "Bàn thờ". The images of
      // the Quan Âm and principal shrines do not identify a statue here.
    });
    // The photographs look past stone-faced piers and a black timber
    // transom towards the gilded shrine. The bell hangs in the bay at left.
    const black=0x3f3830,clad=0x777469;
    for(const side of [-1,1]){
      for(const z of [-2.65,-5.74,-8.65]){
        const x=-.51+side*1.91+z*.082;
        k.box(clad,x,floor+1.53,z,.34,2.77,.38);
        k.box(black,x,floor+2.93,z,.45,.18,.48);
      }
      k.box(clad,-.97+side*1.92,floor+.25,-5.67,.23,.47,6.52,.067);
      k.box(black,-.97+side*1.92,floor+3.01,-5.67,.25,.23,6.59,.067);
    }
    k.box(0x493f32,-.98,floor+3.46,-6.04,4.24,.19,7.31,.074);
    k.box(black,-.74,floor+2.83,-2.72,4.08,.55,.18,.07);
    const bell=new T.LatheGeometry([new T.Vector2(.27,0),new T.Vector2(.33,.065),new T.Vector2(.30,.13),
      new T.Vector2(.225,.69),new T.Vector2(.18,.81),new T.Vector2(.071,.87)],24);
    k.stamp(bell,0x8b795b,-3.71,floor+.44,-8.45);bell.dispose();
    for(const x of [-4.2,-3.23])k.box(black,x,floor+.91,-8.46,.09,1.56,.12);
    k.box(black,-3.71,floor+1.68,-8.46,1.16,.13,.15);
    A.strut(T,k,black,-3.71,floor+1.26,-8.46,-3.71,floor+1.65,-8.46,.037);
  }
  function inscription(T,k,text,x,y,w,h,vertical){
    const canvas=document.createElement('canvas');canvas.width=vertical?100:432;canvas.height=vertical?600:150;
    const g=canvas.getContext('2d'),chars=[...text];
    g.fillStyle='#a43e32';g.fillRect(0,0,canvas.width,canvas.height);
    g.fillStyle='#ecc069';g.font=(vertical?'70':'108')+'px KaiTi, "Microsoft JhengHei", serif';
    g.textAlign='center';g.textBaseline='middle';
    chars.forEach((ch,i)=>g.fillText(ch,vertical?50:(i+.50)*canvas.width/chars.length,vertical?(i+.53)*canvas.height/chars.length:82));
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const plate=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.85}));plate.position.set(x,y,.45);k.group.add(plate);
  }
  function door(T,k,paving){
    const grey=0xa09d92,dark=0x51443a,red=0x943c34,metal=0x464944,w=4.15,r=.91,spring=1.52;
    k.palette({stone:[grey,0xb8b3a5,0x928f83],timber:dark,metal});
    const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(-r,0);sh.lineTo(-r,spring);
    sh.absarc(0,spring,r,Math.PI,0,true);sh.lineTo(r,0);sh.lineTo(w/2,0);sh.lineTo(w/2,3.62);sh.lineTo(-w/2,3.62);sh.closePath();
    k.profile(sh,grey,0,floor,-.39,.68);
    const cladding=new T.Mesh(new T.ShapeGeometry(sh),new T.MeshStandardMaterial({map:paving,color:0xe8e3d8,roughness:.90}));
    cladding.position.set(0,floor,.293);cladding.receiveShadow=true;k.group.add(cladding);
    for(const side of [-1,1]){
      k.box(0xb8b3a5,side*1.04,floor+.71,.29,.23,1.47,.11);
      k.box(dark,side*1.51,floor+1.23,.33,.40,1.99,.12);
      k.box(red,side*1.51,floor+1.23,.405,.33,1.90,.045);
      inscription(T,k,side<0?'洞中淨地隱金仙':'石上靈磯流玉液',side*1.51,floor+1.23,.30,1.81,true);
    }
    for(let j=0;j<15;j++){
      const a=j*Math.PI/15,b=(j+1)*Math.PI/15-.01;
      const arc=(a,r)=>[r*Math.cos(a),spring+r*Math.sin(a)];
      k.outline([arc(a,.915),arc(a,1.14),arc(b,1.14),arc(b,.915)],j%3===1?0xaaa99a:0xb9b6a8,0,floor,.293,.083);
    }
    k.box(dark,0,floor+2.99,.32,1.89,.83,.13);
    k.box(red,0,floor+2.99,.402,1.76,.69,.05);
    inscription(T,k,'洞山仙',0,floor+2.99,1.69,.63,false);
    // The field photograph shows a timber balcony above the recessed gate.
    k.box(0x705240,0,floor+3.74,-.02,4.3,.19,1.27);
    for(let i=0;i<8;i++)k.box(dark,-1.98+i*.565,floor+4.29,.54,.073,.98,.08);
    k.box(dark,0,floor+4.78,.54,4.1,.10,.10);
  }
  const landings=[[0,0,floor],[.05,7.8,floor],[.64,12.5,6.76],[1.66,14.2,6.76],
    [3.6,18.3,4.27],[4.87,19.5,4.27],[4.54,23.2,2.31],[5.2,24.8,2.31],[5.64,29.5,.28]];
  function approach(T,k,rock){
    const rail=0x76614d;
    for(let j=1;j<landings.length;j++){
      const [ax,az,ay]=landings[j-1],[bx,bz,by]=landings[j],dx=bx-ax,dz=bz-az,l=Math.hypot(dx,dz),nx=dz/l,nz=-dx/l;
      const count=Math.max(1,Math.round(Math.abs(ay-by)/.17)),width=j>5?3.09:2.35;
      for(let i=0;i<count;i++){
        const t=i/count,tt=(i+1)/count,y=ay+(by-ay)*t;
        rock.grid(5,1,(u,v)=>[ax+dx*(t+(tt-t)*v)+nx*(u-.5)*width,y+.054,az+dz*(t+(tt-t)*v)+nz*(u-.5)*width,0xb5ad98,.90]);
        rock.grid(5,1,(u,v)=>[ax+dx*tt+nx*(u-.5)*width,y+.055+v*(by-ay)/count,az+dz*tt+nz*(u-.5)*width,0x948d7e,.85]);
        for(const side of [-1,1])rock.grid(1,3,(u,v)=>[ax+dx*(t+(tt-t)*u)+side*nx*width/2,y+.04-v*(y+2.72),
          az+dz*(t+(tt-t)*u)+side*nz*width/2,0x948b77,.76+.16*(1-v)]);
      }
      for(const side of [-1,1]){
        const x=side*nx*(width*.5-.08),z=side*nz*(width*.5-.08),spans=Math.ceil(l/1.85);
        for(let i=0;i<=spans;i++){
          const t=i/spans;k.box(rail,ax+dx*t+x,ay+(by-ay)*t+.54,az+dz*t+z,.107,1.02,.107);
        }
        for(const h of [.47,1.04])A.strut(T,k,rail,ax+x,ay+h,az+z,bx+x,by+h,bz+z,.065);
      }
    }
  }
  function build(T,k){
    const rock=K.batch(T),paving=stoneFacing(T);
    tower(rock);canopy(T,k);room(T,k,rock,paving);door(T,k,paving);approach(T,k,rock);
    // The exposed limestone stands on an older sandstone rise. Encircle its
    // entire foot and blend the outside edge of the apron to the same DEM.
    const o=local(...centre),range=(x,z)=>Math.hypot(x-o[0],z-o[1]);
    function bank(x,z){
      const d=range(x,z),grain=.31*Math.sin(.34*x+.37*z)+.18*Math.cos(.69*x-.27*z);
      return -.55+8.6*Math.exp(-Math.max(0,d-11)/8)+grain;
    }
    const apron=K.batch(T);
    apron.grid(127,32,(u,v)=>{
      const a=u*tau,[x,z]=shell(a,0),r0=range(x,z),r=r0-2.7+v*(44-r0);
      const xx=o[0]+(x-o[0])*r/r0,zz=o[1]+(z-o[1])*r/r0;
      return [xx,bank(xx,zz),zz,Math.sin(.32*xx+.18*zz)>.49&&v<.40?0x948e76:v>.63?0x566e53:0x6e805f,.84+.13*Math.cos(.44*xx+.33*zz)];
    });
    const soil=createSightStoneMaterial(T),compile=soil.onBeforeCompile;
    soil.customProgramCacheKey=()=>'thach-dong-sandstone-foot';
    soil.onBeforeCompile=shader=>{
      compile(shader);
      const centre='vec2('+o[0].toFixed(3)+','+o[1].toFixed(3)+')';
      shader.fragmentShader=shader.fragmentShader.replace('#include <alphatest_fragment>','#include <alphatest_fragment>\n'+
        'float radius=length(rockPoint.xz-'+centre+');float edge=smoothstep(29.,41.,radius);'+
        'vec2 cell=floor(rockPoint.xz*3.3);if(fract(sin(dot(cell,vec2(13.17,74.39)))*43578.3)<edge)discard;');
    };
    apron.add(k.group,soil);
    for(const [x,z,h] of [[-8.4,13.4,5.6],[10.3,10.8,6.2],[-7.1,23.1,7.2],[12.7,24.5,6.8],[-14.2,17.7,6.7],[15.3,7.5,5.2],[-12.4,31,5.2]]){
      rock.trees.push([x,bank(x,z),z,h*.80,h,x]);
    }
    for(let i=0;i<41;i++){
      const a=(i*.618034%1)*tau,[x,z]=shell(a,0),r=1.21+.64*(i*.38196%1);
      const xx=o[0]+(x-o[0])*r,zz=o[1]+(z-o[1])*r,h=3.8+(i*.6394%1)*3.6;
      if(zz>0&&Math.abs(xx-2.5)<7.8)continue;
      rock.trees.push([xx,bank(xx,zz),zz,h*.72,h,i*2.3]);
    }
    K.finish(T,k,rock,(ground,x,z)=>{
      const outer=smooth((range(x,z)-21)/15);
      return outer*(ground(x,z)-bank(x,z));
    });
  }
  const sections=[[0,0,2.45,14.7,floor],[4,-.15,4.00,15.4,floor],[10,1.8,7.60,16.7,floor],
    [15,3.6,8.7,16.8,floor],[20,4.8,6.1,15.7,floor],[25,5,2.7,14.8,floor]];
  const view=(name,x,z,height,r,angle,e)=>({name,offset:world(x,z),height,viewRadius:r,viewAngle:yaw+angle,viewElevation:e,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Thạch Động thôn vân – Hà Tiên',kind:'Hang động',
    // OSM n2327003316 lies on the wooded hill. The mapped temple POI and
    // isolated tower on imagery agree southwest of it. The OSM ID stays an alias.
    // https://linhdia.vn/sites/chua-tien-son (10.4108219, 104.475072)
    lon:104.475072,lat:10.4108219,source,photo:'https://commons.wikimedia.org/wiki/File:Thach_Dong_pagoda.jpg',
    map:'https://www.openstreetmap.org/?mlat=10.4108219&mlon=104.475072#map=19/10.4108219/104.475072',
    yaw,width:66,depth:88,foundationAt:[5.60,29.5],caveOpening:{sections,approach:5},solids:[],
    start:raw.start,approachMeters:undefined,mappedEntrance:true,visitOnArrival:true,
    arrivalNote:'Xe dừng trên lối vào từ Quốc lộ 80. Từ chân núi, khách theo bậc đá có lan can lên cửa chùa Tiên Sơn.',
    // CSDL Du lịch places Điện Bà in the southwest and the daylight opening
    // to the east: https://csdl.vietnamtourism.gov.vn/dest/?item=474
    description:'Tháp đá vôi Thạch Động nhô cao ở mép đồng bằng Hà Tiên. Trong lòng tháp là chùa Tiên Sơn. Điện Bà Chúa Xứ ở phía cửa tây nam, phía đông có khe thông thiên. Bình đồ khảo sát ghi nhận bốn cửa mở. Hình dáng vách và bậc lên chùa được ước dựng theo ảnh.',
    views:[view('Tháp đá nhìn từ phía đông nam',3.6,-11,56,89,-1.34,-.25),
      view('Bậc đá dưới khe cửa chùa',.36,1.25,25,23,.06,.065),
      view('Cổng Tiên Sơn động',0,.10,23.2,5.6,-.035,.088),
      view('Từ lối vào nhìn về bàn thờ',-1.33,-10.1,23.1,6.3,.16,.043)],build});
})();

export default window.VietnamSights;
