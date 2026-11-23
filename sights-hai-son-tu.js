'use strict';
(()=>{
  const id='chua-hang-hai-son-kien-luong',catalogId='osm-node-4374995102';
  const raw=window.VietnamTourism.byId.get(catalogId),A=window.CentralArch;
  const lon=104.6401674,lat=10.1397666,yaw=-2.44,c=Math.cos(yaw),s=Math.sin(yaw);
  const current='https://phatsuonline.vn/an-giang-trang-nghiem-khoa-tu-quan-am-dinh-ky-va-dem-hoa-dang-ky-niem-ngay-duc-bo-tat-quan-the-am-xuat-gia-tai-chua-hai-son-87';
  const works='https://phatsuonline.vn/an-giang-cap-nhat-tien-do-dap-y-phun-son-ton-tuong-quan-the-am-bo-tat-cao-33-met-tai-chua-hang-hai-son-tu-19';
  const pi=Math.PI,tau=2*pi,deck=4.16;
  const stone=0xd9d6cd,ivory=0xeeeae1,pale=0xe4e0d5,shade=0xc6c3b8,grey=0xaaa79c;
  const brass=0xb78a42,gilt=0xd6ad5e,bronze=0x806035,iron=0x55493b;
  // Local +Z follows the tiled terrace towards the open forecourt. Surveyed
  // on the overhead image and checked against the builders' aerial photographs.
  const ring=[[-16.9,27.3],[20.5,25.8],[24.1,-15.8],[-8.7,-14.3]];
  function view(name,target,eye,fov,photo,photoCatalogId,description){
    const [x,y,z]=target,dx=eye[0]-x,dz=eye[2]-z,dy=eye[1]-y;
    return {name,description,photo,photoCatalogId,height:y/.46,viewFov:fov,viewBase:'monument',
      offset:[x*c+z*s,-x*s+z*c],viewAngle:yaw+Math.atan2(dx,dz),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewRadius:Math.hypot(dx,dy,dz)};
  }
  const views=[
    view('Tượng Quan Thế Âm nhìn từ sân chùa',[0,20.1,0],[-6,7.8,50],47,current,catalogId,
      'Tượng Quan Thế Âm cao 33 m đứng trên đài sen giữa núi đá vôi. Từ phía sân nhìn lên, tay phải cầm cành dương liễu và tay trái nâng bình.'),
    view('Ba lớp cánh sen và đôi tháp đồng',[0,8.2,2.2],[14.2,6.5,20],45,current,'hai-son-dai-sen',
      'Nhìn chéo qua đôi tháp màu đồng và chiếc lư giữa sân. Phía sau là dải tranh màu dưới bệ cùng những cánh sen trắng xếp gối lên nhau.'),
    view('Nếp áo, cành liễu và bình nước',[0,28.2,.85],[-8.8,24,17.6],49,current,'hai-son-phap-y',
      'Từ bên phải pho tượng có thể nhìn rõ nhành lá nhỏ bên những ngón tay dựng đứng. Các nếp áo rủ thành vòng trước ngực, hai tay áo buông thấp và vạt ngoài hất ra ở một bên.'),
    view('Cầu thang và sàn sân chùa',[3.2,8.5,10.1],[44,25,55],46,works,'hai-son-san-cao',
      'Hai cạnh trước của sân gặp nhau ở thềm cao. Cầu thang dẫn từ đất lên sàn lát gạch đỏ. Bên dưới sàn là khoảng trống giữa những hàng cột bê tông.'),
  ];
  function lathe(T,k,tint,x,y,z,profile,sides=28,rx=0,rz=0){
    const g=new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),sides);
    k.stamp(g,tint,x,y,z,1,1,1,0,rx,rz);g.dispose();
  }
  function cord(T,k,tint,points,r,steps=14){
    const line=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal');
    const g=new T.TubeGeometry(line,steps,r,6,false);k.stamp(g,tint,0,0,0);g.dispose();
  }
  // Original sculpted surfaces. Fine curves are baked into the same draw
  // as the main figure, in both the mobile and the desktop geometry.
  function surface(T,rows,cols,point,reverse=false){
    const p=[],ix=[];
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      p.push(...point(i/cols,j/rows));
      if(j&&i){const d=j*(cols+1)+i,a=d-cols-2,b=a+1,v=d-1;
        if(reverse)ix.push(a,v,b,b,v,d);else ix.push(a,b,v,b,d,v);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g;
  }
  function statue(T,k){
    const y=deck+6.10,h=(33-6.10)/1.071;
    const body=(a,b,d)=>[a*h,y+b*h,d*h];
    A.statueFigure(T,k,ivory,0,y,0,h,{robe:true,openHand:true,
      rightArm:[[-.145,.656,.025],[-.134,.751,.124],[-.134,.804,.145]],
      leftArm:[[.154,.674,.025],[.101,.711,.124],[.054,.718,.151]]});
    const sculpt=A.carving(T,k,pale,0,y,0,h);
    // The long veil and crown frame the head above the short shoulder cape.
    for(const side of [-1,1]){
      sculpt.sweep([[side*.016,1.037,-.017,.027,.029],[side*.047,.997,-.015,.023,.036],
        [side*.057,.937,-.025,.024,.043],[side*.064,.86,-.027,.018,.041],[side*.095,.795,-.018,.028,.053]],.045,18);
    }
    sculpt.sweep([[0,.977,-.010,.045,.045],[0,1.010,-.010,.048,.046],[0,1.034,-.011,.038,.034],
      [0,1.056,-.013,.024,.026],[0,1.071,-.014,.006,.007]],.09,26);sculpt.finish();
    const coarse=globalThis.matchMedia?.('(pointer: coarse)').matches,segments=coarse?42:68;
    function drape(colour,levels,panels){
      const g=surface(T,levels,segments,(u,v)=>{
        const angle=tau*(u-.5),front=Math.max(0,Math.cos(angle)),side=Math.sin(angle);
        const [w,d,up,shift,ripple]=panels(angle,front,side,v);
        const fold=1+ripple*(Math.cos(9*angle+.75*v)+.4*Math.sin(15*angle-v));
        return [shift+w*side*fold,up,d*Math.cos(angle)*fold];
      });
      k.stamp(g,colour,0,y,0,h,h,h);g.dispose();
    }
    drape(ivory,12,(a,f,side,v)=>[.167-.055*v,.103-.025*v,-.005+.51*v,-.009*(1-v),.057]);
    drape(pale,16,(a,f,side,v)=>{
      const tail=Math.pow(Math.max(0,side),5)*(1-v)**2,hem=.152+.076*side+.047*(1-f)+.075*tail;
      return [.171-.054*v+.052*tail,.105-.025*v,hem+( .738-hem)*v,.005+.037*tail,.032];
    });
    drape(ivory,12,(a,f,side,v)=>{
      const hem=.458+.059*f+.036*side-.066*Math.sin(a*2)**2;
      return [.139-.022*v,.096-.017*v,hem+(.800-hem)*v,0,.018];
    });
    drape(pale,9,(a,f,side,v)=>{
      const hem=.713+.017*f+.018*Math.cos(a*7);
      return [.158-.106*v,.100-.057*v,hem+(.858-hem)*v,0,.017];
    });
    // Horseshoe-shaped robe folds follow the visible overlap at the knees
    // and reappear in two smaller panels on either side of the medallion.
    function fold(cx,base,width,rise,depth,thickness){
      const g=surface(T,6,coarse?14:24,(u,v)=>{
        const t=2*u-1,xx=cx+t*width,dip=base+rise*t*t,fade=1-.75*t**4;
        const radius=dip>.445?.138:.17-.035*dip;
        const front=depth*Math.sqrt(Math.max(.055,1-(xx/radius)**2));
        const lip=thickness*fade*(2.6*Math.sin(pi*Math.min(1,v*1.38))-.95);
        return body(xx,dip+(v-.22)*(.030+.021*fade),front+lip);
      });
      k.stamp(g,ivory,0,0,0);g.dispose();
    }
    for(const [base,w,rise,depth] of [[.187,.123,.115,.111],[.248,.114,.129,.109],[.317,.103,.137,.104],
      [.390,.094,.119,.102],[.457,.085,.116,.099],[.036,.112,.111,.105],[.080,.090,.096,.102]])fold(-.008,base,w,rise,depth,.0042);
    for(const side of [-1,1])for(let j=0;j<3;j++)fold(.065*side,.499+.063*j,.061,.080,.106-j*.002,.0041);
    // Wide hanging sleeves fall back below the wrists with a visible opening.
    for(const side of [-1,1]){
      const cuff=A.carving(T,k,ivory,0,y,0,h);
      cuff.sweep([[side*.132,.487,-.011,.011,.021],[side*.148,.544,.004,.028,.047],[side*.152,.633,.018,.037,.056],
        [side*.144,.697,.053,.039,.064],[side*(side<0?.130:.112),side<0?.773:.721,.110,.027,.038]],.085,22);cuff.finish();
      for(let j=0;j<3;j++){
        cord(T,k,pale,[[side*(.113+j*.008),.727,.111-j*.009],[side*(.136+j*.009),.669,.092-j*.013],
          [side*(.145+j*.007),.607,.062-j*.013],[side*(.141+j*.007),.536,.019-j*.009]].map(p=>body(...p)),h*.0036);
      }
    }
    const loop=new T.TorusGeometry(.032*h,.0038*h,6,28);k.stamp(loop,pale,...body(0,.77,.083));loop.dispose();
    for(let j=0;j<8;j++){const a=j*tau/8;k.stamp(k.ball,pale,...body(.024*Math.sin(a),.77+.024*Math.cos(a),.084),h*.006,h*.011,h*.004,0,0,-a);}
    for(let j=-3;j<=3;j++){
      const a=j*.36,sz=1-Math.abs(j)*.13;
      k.stamp(k.ball,ivory,...body(.043*Math.sin(a),1.012+.007*sz,.040*Math.cos(a)-.006),h*.007,h*.018*sz,h*.006,0,0,-a*.34);
    }
    // A small tilted vase rests in the left palm. The leafy twig is held in
    // the raised right hand, its narrow stem visible between the fingers.
    lathe(T,k,pale,...body(.059,.716,.156),[[.11,0],[.24,.06],[.30,.24],[.28,.44],[.135,.63],[.095,.81],[.18,.86],[.18,.91],[.10,.92]],20,0,-.78);
    const twig=[[-.128,.829,.148],[-.125,.851,.145],[-.118,.870,.143],[-.107,.885,.148]];
    cord(T,k,bronze,twig.map(p=>body(...p)),.035,12);
    for(let j=0;j<9;j++){
      const t=j/9,side=j%2?-1:1;
      k.stamp(k.ball,0x788258,...body(-.120+.012*t+side*.005,.860+.026*t,.145),.047,.15,.047,0,.08,-side*.77);
    }
  }
  function lotus(T,k){
    // The low, painted drum has a framed blue-and-green landscape. The
    // landscape relief here is an original interpretation of that colour band.
    lathe(T,k,grey,0,deck,0,[[0,.02],[6.05,.02],[6.20,.15],[6.18,.32],[5.95,.38],[5.95,1.62],[6.20,1.67],[6.16,1.82]],48);
    lathe(T,k,0x6eb8cc,0,deck,0,[[5.98,.31],[5.98,1.64]],72);
    for(const [r,lo,hi,tint] of [[6.0,.32,1.06,0x7f9da8],[6.02,.31,.76,0x629079],[6.04,.31,.53,0x5e8264]]){
      const g=surface(T,1,112,(u,v)=>{const a=u*tau,h=lo+(hi-lo)*(.67+.23*Math.sin(11*a)+.10*Math.cos(29*a));
        return [r*Math.sin(a),v?h:lo,r*Math.cos(a)];});
      k.stamp(g,tint,0,deck+.02,0);g.dispose();
    }
    for(let i=0;i<16;i++){
      const a=tau*i/16;k.box(brass,6.07*Math.sin(a),deck+.97,6.07*Math.cos(a),.085,1.27,.07,a);
    }
    lathe(T,k,pale,0,deck,0,[[5.92,1.68],[6.35,1.9],[6.52,2.27],[6.05,2.78],[5.22,2.90],
      [6.45,3.21],[6.64,3.84],[6.10,4.65],[5.1,5.42],[4.13,5.92],[3.65,6.13],[0,6.13]],52);
    const coarse=globalThis.matchMedia?.('(pointer: coarse)').matches,rows=coarse?5:8,cols=coarse?9:14;
    for(const [row,count,rad,up,wide,tall] of [[0,18,6.42,2.26,1.32,1.04],[1,16,6.65,2.82,1.65,1.85],[2,15,6.52,3.66,1.58,1.67],[3,14,5.72,4.58,1.45,1.40]]){
      const g=surface(T,rows,cols,(u,v)=>{
        const t=2*u-1,flare=.23+.77*Math.sin(v*pi*.56);
        const rim=t*t*.39+.075*Math.cos(t*pi*2);
        const height=row===0?tall*(1-v):tall*v;
        return [t*wide*flare,height-v*v*rim,(-.48+1.10*v+.30*Math.sin(pi*v))*(1-.44*t*t)-.48*t*t];
      });
      // A rounded lip follows the actual scallop of each cup.
      const pts=[];for(let i=0;i<=cols;i++){const at=rows*(cols+1)+i,attr=g.attributes.position;pts.push(new T.Vector3(attr.getX(at),attr.getY(at),attr.getZ(at)));}
      const lip=new T.TubeGeometry(new T.CatmullRomCurve3(pts),cols,.044,coarse?4:6,false);
      const inner=g.clone();inner.scale(.98,1,.84);const ii=inner.index.array;
      for(let i=0;i<ii.length;i+=3){const a=ii[i];ii[i]=ii[i+1];ii[i+1]=a;}inner.computeVertexNormals();
      for(let i=0;i<count;i++){
        const a=(i+.49*(row%2))*tau/count,x=rad*Math.sin(a),z=rad*Math.cos(a);
        k.stamp(g,row%2?ivory:pale,x,deck+up,z,1,1,1,a);
        k.stamp(inner,pale,x,deck+up,z,1,1,1,a);
        k.stamp(lip,ivory,x,deck+up,z,1,1,1,a);
      }
      inner.dispose();lip.dispose();g.dispose();
    }
  }
  function fittings(T,k){
    for(const x of [-7.9,7.9]){
      const z=7.5;
      k.box(bronze,x,deck+.19,z,2.0,.38,2.0);k.box(brass,x,deck+.55,z,1.81,.46,1.81);
      lathe(T,k,brass,x,deck,z,[[.87,.76],[.91,.88],[.65,.99],[.71,1.09],[.96,1.32],[1.03,1.72],
        [.96,2.03],[.65,2.24],[.59,2.38],[.73,2.49]],24);
      for(const h of [2.46,4.57]){
        k.box(gilt,x,deck+h,z,1.47,.14,1.47);
        // Flared pagoda eaves with four upturned corner ridges.
        const g=surface(T,5,24,(u,v)=>{
          const a=u*tau,si=Math.sin(a),co=Math.cos(a),ray=1/Math.max(Math.abs(si),Math.abs(co));
          const r=(1.25-.75*v)*ray;
          return [r*si,.13+.16*(1-v)**2*Math.pow(Math.abs(Math.sin(2*a)),9)+.49*v*v,r*co];
        });
        k.stamp(g,gilt,x,deck+h,z);g.dispose();
        for(let i=0;i<4;i++){
          const a=(i+.5)*pi/2,dx=Math.sin(a),dz=Math.cos(a);
          cord(T,k,gilt,[[x+dx*.64,deck+h+.66,z+dz*.64],[x+dx*1.22,deck+h+.26,z+dz*1.22],
            [x+dx*1.67,deck+h+.30,z+dz*1.67],[x+dx*1.83,deck+h+.48,z+dz*1.83]],.067,9);
        }
      }
      k.box(brass,x,deck+3.91,z,1.15,1.75,1.15);
      for(let face=0;face<4;face++){
        const a=face*pi/2;
        for(let i=-1;i<=1;i++)for(let j=0;j<3;j++){
          const off=i*.28,dx=off*Math.cos(a)+.584*Math.sin(a),dz=-off*Math.sin(a)+.584*Math.cos(a);
          k.box(iron,x+dx,deck+3.48+j*.28,z+dz,.135,.18,.021,a);
        }
      }
      lathe(T,k,brass,x,deck+5.11,z,[[.31,0],[.22,.18],[.15,.23],[.18,.31],[.10,.41],[.14,.48],[.065,.64],[.03,.84]],14);
    }
    const z=8.64;
    for(const x of [-1.05,1.05])for(const dz of [-.46,.46])k.box(bronze,x,deck+.29,z+dz,.25,.55,.25);
    k.stamp(k.ball,brass,0,deck+.92,z,1.65,.73,.79);
    k.box(bronze,0,deck+1.49,z,3.15,.14,1.36);k.box(iron,0,deck+1.565,z,2.78,.026,1.07);
    for(const sign of [-1,1]){
      cord(T,k,gilt,[[1.36*sign,deck+.94,z],[1.76*sign,deck+1.06,z],[1.91*sign,deck+1.56,z],
        [1.79*sign,deck+1.87,z],[1.60*sign,deck+1.77,z]],.095);
    }
    for(let j=-1;j<=1;j++){
      const medallion=new T.TorusGeometry(.28,.051,5,16);
      k.stamp(medallion,gilt,j*.75,deck+.92,z+.74-.08*Math.abs(j));medallion.dispose();
    }
    k.box(0x905544,0,deck+.96,6.77,8.1,.20,1.24);
    for(const x of [-3.63,-1.4,1.4,3.63])k.box(0x794939,x,deck+.45,6.77,.27,.90,.68);
  }
  function court(T,k){
    const shape=new T.Shape();ring.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
    const slab=new T.ExtrudeGeometry(shape,{depth:.34,bevelEnabled:false});slab.rotateX(-pi/2);
    k.stamp(slab,grey,0,deck-.34,0);slab.dispose();
    const top=new T.ShapeGeometry(shape);top.rotateX(-pi/2);
    const mat=new T.MeshLambertMaterial({color:0xb7715a});
    mat.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec2 terraceXY;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nterraceXY=position.xz;');
      sh.fragmentShader='varying vec2 terraceXY;\n'+sh.fragmentShader.replace('#include <color_fragment>',`
        #include <color_fragment>
        vec2 tile=terraceXY/.49, cell=floor(tile), width=max(fwidth(tile),vec2(.002));
        vec2 line=1.-smoothstep(vec2(.009)-width*.5,vec2(.013)+width*.5,abs(fract(tile+.5)-.5));
        float randTile=fract(sin(dot(mod(cell,512.),vec2(34.61,71.83)))*4738.);
        float visible=1.-smoothstep(.18,.85,max(width.x,width.y));
        diffuseColor.rgb*=1.+(randTile-.5)*.13*visible;
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.64,.50,.40),max(line.x,line.y)*visible*.63);
      `);
    };
    mat.customProgramCacheKey=()=>'hai-son-terrace-tile';
    const floor=new T.Mesh(top,mat);floor.position.y=deck+.016;floor.receiveShadow=true;k.group.add(floor);
    for(let row=0;row<=5;row++){
      const v=row/5,lx=ring[0][0]*(1-v)+ring[3][0]*v,rx=ring[1][0]*(1-v)+ring[2][0]*v;
      const lz=ring[0][1]*(1-v)+ring[3][1]*v,rz=ring[1][1]*(1-v)+ring[2][1]*v;
      const dx=rx-lx,dz=rz-lz,len=Math.hypot(dx,dz),angle=Math.atan2(dx,dz);
      k.box(grey,(rx+lx)*.5,deck-.48,(rz+lz)*.5,.34,.50,len,angle);
      for(let col=0;col<=5;col++){const u=.009+.982*col/5;k.box(grey,lx+u*dx,(deck-.44)*.5-.11,lz+u*dz,.38,deck-.22,.38);}
    }
    // The stair in the construction aerial runs along the edge of the
    // platform, descending towards the northwest forecourt.
    const n=24,x=21.95,z=14.8,run=.37,rise=deck/n;
    for(let i=0;i<n;i++){
      const y=deck-i*rise;
      k.box(stone,x,y-.14,z+i*run,2.95,.28,run+.02);
    }
    for(const side of [-1,1]){
      const xx=x+side*1.48;
      cord(T,k,grey,[[xx,deck-.38,z-.19],[xx,-.20,z+n*run]],.12,6);
      for(let i=0;i<=n;i+=4)k.box(grey,xx,deck+.45-i*rise,z+i*run,.07,.92,.07);
      cord(T,k,grey,[[xx,deck+.91,z],[xx,.91,z+n*run]],.045,6);
    }
  }
  function hillsides(T,k){
    // Two wooded outcrops flank the open court. Keep their saddle and the
    // white-roofed hall below it clear, as in the 2025 aerial of the site.
    const woods=[
      [[-10,-17],[-26,-5],[-34,15],[-79,25],[-137,6],[-204,-9],[-140,-146],
        [-7,-170],[113,-69],[108,-12],[86,-5],[58,-27],[41,-29],[18,-20]],
      [[64,146],[108,166],[152,146],[159,94],[148,48],[130,0],[92,-10],[67,3],[58,21],[55,51],[60,88]],
    ];
    const inside=(x,z,ring)=>{
      let hit=false;
      for(let i=0,j=ring.length-1;i<ring.length;j=i++){
        const a=ring[i],b=ring[j];
        if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])hit=!hit;
      }
      return hit;
    };
    const rand=n=>{const f=Math.sin(n*65.317+41.3)*43871.9;return f-Math.floor(f);};
    const plants=[[],[],[]],blocks=[],poses=new T.Object3D(),trees=createTreeModels(T);
    for(let i=0;i<1930;i++){
      const x=-201+rand(i+.63)*367,z=-171+rand(i+17.42)*340;
      if(!woods.some(ring=>inside(x,z,ring)))continue;
      const w=8+rand(i+36.1)*6,h=6+rand(i+88.9)*6;
      plants[i%3].push([x,z,w,h,w*.92,rand(i+18)*tau]);
    }
    // Narrow fins of grey limestone break the canopy at the cliff toe and
    // along the two ridges. Vary each joint and taper towards the crest.
    for(const [ax,az,length,angle,lift] of [[-29,-10,34,-.85,11],[-61,2,42,-.56,15],[-61,-51,32,.87,12],
      [-99,-60,39,-.76,13],[63,22,23,.47,8],[77,58,26,.36,10],[91,5,20,-.74,9]]){
      for(let i=0;i<12;i++){
        const t=(i/11-.5)*length,r=rand(i+ax);
        blocks.push([ax+t*Math.cos(angle)+r*4,az+t*Math.sin(angle),3.9+r*3.1,lift*(.38+.56*rand(i+az+.4)),3+r*2.4,angle+r*.86]);
      }
    }
    const rock=surface(T,12,24,(u,v)=>{
      const a=u*tau,step=1-.14*Math.sin(pi*v)**2-.22*Math.max(0,(v-.59)/.41)-.50*v**9;
      const r=step*(.84+.11*Math.cos(5*a+v*.22)+.11*Math.sin(8*a-.57*v)+.055*Math.cos(13*a+v));
      const crest=.78+.12*Math.cos(a+.57)+.069*Math.sin(4*a)+.04*Math.cos(7*a);
      return [r*Math.sin(a)+.21*v,v*crest,r*Math.cos(a)-.30*v];
    });
    const uv=[];for(let j=0;j<=12;j++)for(let i=0;i<=24;i++)uv.push(i/24,j/12);
    rock.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    const map=new T.TextureLoader().load('sight-imagery/hon-phu-tu-da-voi.webp');map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const mat=new T.MeshLambertMaterial({map});
    mat.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec3 cliffPoint;\n'+sh.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\ncliffPoint=(instanceMatrix*vec4(position,1.)).xyz;');
      sh.fragmentShader='varying vec3 cliffPoint;\n'+sh.fragmentShader.replace('#include <map_fragment>',`
        vec2 p=vec2(cliffPoint.x*.83+cliffPoint.z*.47,cliffPoint.y+.18*cliffPoint.x);
        vec2 rockUV=vec2(.251,.502)+vec2(.247,.494)*fract(p*vec2(.133,.086));
        vec3 rockPhoto=texture2D(map,rockUV).rgb;
        float grain=dot(rockPhoto,vec3(.26,.59,.15));
        float flutes=abs(sin(p.x*2.31+.15*p.y+.37*sin(.53*p.y)));
        vec3 limestone=mix(vec3(.21,.21,.196),vec3(.67,.665,.64),clamp(grain*1.50,0.,1.))*(.81+.19*flutes);
        vec3 leafPhoto=texture2D(map,rockUV-vec2(0.,.50)).rgb;
        float cover=smoothstep(.28,.67,.30*sin(p.x*1.06+p.y*.40)+.26*cos(p.y*.6-p.x*.37)+.58*grain+.60*vMapUv.y*vMapUv.y);
        diffuseColor.rgb*=mix(limestone,mix(vec3(.043,.073,.024),vec3(.19,.29,.105),clamp(leafPhoto.g*1.9,0.,1.)),cover);
      `);
    };
    mat.customProgramCacheKey=()=>'hai-son-karst-joints';
    const batches=plants.map((set,i)=>[new T.InstancedMesh(trees.distantGeometry(i===2?'tea':'tree',i),trees.billboardMaterial(),set.length),set]);
    batches.push([new T.InstancedMesh(rock,mat,blocks.length),blocks]);
    for(const [mesh] of batches){mesh.receiveShadow=true;k.group.add(mesh);}
    // The long roof directly southwest of the platform is visible behind
    // the lantern in the side view. Its long axis turns away from the steps.
    k.place(47.6,-5.7,2.89,()=>{
      const cream=0xd2b69c,roof=0xd8dcd8;
      k.box(cream,0,2.05,0,12.2,4.1,31);
      for(const side of [-1,1]){
        k.outline([[-6.1,0],[0,2.19],[6.1,0]],cream,0,4.1,side*15.5,.10);
        for(let i=0;i<5;i++)k.box(0x72736c,side*6.13,2.12,i*5.8-11.6,.06,2.50,3.2);
      }
      k.outline([[-6.6,0],[0,2.33],[6.6,0],[6.6,-.13],[0,2.20],[-6.6,-.13]],roof,0,4.18,-16.1,32.2);
    });
    return ground=>{
      for(const [mesh,set] of batches){
        set.forEach(([x,z,w,h,d,a],i)=>{
          poses.position.set(x,ground(x,z)-(set===blocks?.40:.12),z);
          poses.rotation.set(0,a,0);poses.scale.set(w,h,d);poses.updateMatrix();mesh.setMatrixAt(i,poses.matrix);
        });
        mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
      }
    };
  }
  const reserve=(x,z,r=0)=>(x>=-17-r&&x<=25+r&&z>=-16-r&&z<=28+r)||(x>30-r&&x<61+r&&z> -26-r&&z<15+r);
  (window.VietnamSights??=[]).push({...raw,id,catalogId,lon,lat,yaw,name:'Chùa Hang – Hải Sơn Tự',width:37,depth:43,
    viewDistance:680,solids:[],gardenRadius:0,reserve,plasterStain:.045,source:raw.source,photo:current,views,
    description:'Chùa Hang, tên chữ Hải Sơn Tự, nằm trong cụm Chùa Hang – Hòn Phụ Tử ở Kiên Lương. Tuyến này đi qua sân đặt tượng Quan Thế Âm cao 33 m. Mặt sân dựa trên ảnh từ trên cao. Tỷ lệ các lớp sen, hoa văn và nếp áo được ước dựng từ ảnh tại chùa năm 2025 và 2026.',
    arrivalNote:'Xe dừng ở cuối nhánh đường vào khu tham quan. Từ đây đi bộ qua khoảng sân đất liền tới thềm tượng Quan Âm.',
    *build(T,kit){
      const ball=new T.SphereGeometry(1,14,8),k={...kit,ball};
      k.palette({stone:[stone,grey],plaster:[ivory,pale,shade],metal:[brass,gilt,bronze,iron]});
      court(T,k);yield;lotus(T,k);yield;statue(T,k);yield;fittings(T,k);ball.dispose();
      k.group.userData.fitGround=hillsides(T,k);
    }});
})();
