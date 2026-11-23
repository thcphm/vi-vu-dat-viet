'use strict';
(()=>{
  const id='nha-tho-tam-toa',catalogId='osm-way-343077412',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(e=>e.id===catalogId);
  if(!raw)return;
  const lon=106.6233497,lat=17.4749776,yaw=-1.587,pi=Math.PI,tx=-2.10;
  const source='https://myquangbinh.vn/vi/nhathotamtoa';
  const face='https://commons.wikimedia.org/wiki/File:Nhathocoquangbinh.jpg';
  const side='https://commons.wikimedia.org/wiki/File:Tam_Toa_Church,_Dong_Hoi.jpg';
  // w343077412 measures 10.65 × 5.17 m on the ground, including the
  // surviving southern bay. Front faces Nguyễn Du; the nave ran east to
  // the river. Dimensions above ground are proportional to field photos:
  // the bell stage has three round-headed apertures, a ribbed domed cap
  // and a short finial. The side and rear photos also show one broken pier.
  // https://commons.wikimedia.org/wiki/File:TamToa.jpg
  // https://quangbinhtourism.vn/trai-nghiem/danh-lam-thang-canh/thap-chuong-nha-tho-tam-toa.html
  // https://congbao.quangbinh.gov.vn/tmp/docga_7491_page28.pdf
  // https://en.vietnamplus.vn/restoration-of-central-war-relic-completed-post12387.vnp
  const heights=[7.10,5.95,4.55],c=Math.cos(yaw),s=Math.sin(yaw);
  function view(name,tx,tz,x,z,height,rise,fov,photo){
    const dx=c*(x-tx)+s*(z-tz),dz=-s*(x-tx)+c*(z-tz);
    return {name,offset:[c*tx+s*tz,-s*tx+c*tz],height:height/.46,viewBase:'monument',viewFov:fov,
      viewAngle:Math.atan2(dx,dz),viewElevation:Math.atan2(rise,Math.hypot(dx,dz)),viewRadius:Math.hypot(dx,dz,rise),photo};
  }
  const views=[{...view('Mặt tháp nhìn từ đường Nguyễn Du',-.14,0,1.10,18.5,heights[0],-3.90,57,face),photoCatalogId:'quang-binh-mat-tay-tam-toa'},
    {...view('Trụ gạch trên nền nhà thờ cũ',0,-6.8,17.2,9.6,heights[1],-2.05,61,side),photoCatalogId:'quang-binh-nen-nha-tho-tam-toa'},
    view('Các lớp vòm cửa phía tây',tx,2.13,.44,10.8,heights[2],-2.08,65,face)];
  function masonry(T,k){
    const xyz=[],normal=[],type=[],index=[],point=new T.Vector3(),n=new T.Vector3();
    function add(geo,finish,x=0,y=0,z=0,angle=0){
      const offset=xyz.length/3,cs=Math.cos(angle),sn=Math.sin(angle),a=geo.attributes.position,b=geo.attributes.normal;
      for(let i=0;i<a.count;i++){
        point.fromBufferAttribute(a,i);n.fromBufferAttribute(b,i);
        xyz.push(x+cs*point.x+sn*point.z,y+point.y,z-sn*point.x+cs*point.z);
        normal.push(cs*n.x+sn*n.z,n.y,-sn*n.x+cs*n.z);type.push(finish);
      }
      for(let i=0;i<(geo.index?.count??a.count);i++)index.push(offset+(geo.index?geo.index.getX(i):i));
      geo.dispose();
    }
    function shape(points){return new T.Shape(points.map(([x,y])=>new T.Vector2(x,y)));}
    function arch(path,x,base,rad,spring){
      path.moveTo(x-rad,base);path.lineTo(x-rad,spring);
      path.absarc(x,spring,rad,pi,0,true);path.lineTo(x+rad,base);path.closePath();return path;
    }
    function wall(points,holes,finish,x,z,depth,angle=0){
      const sh=shape(points);
      for(const [cx,lo,r,spring] of holes)sh.holes.push(arch(new T.Path(),cx,lo,r,spring));
      add(new T.ExtrudeGeometry(sh,{depth,bevelEnabled:false,curveSegments:10}),finish,x,0,z,angle);
    }
    function box(finish,x,y,z,w,h,d){add(new T.BoxGeometry(w,h,d),finish,x,y,z);}
    function molding(x,z,base,spring,rad,width,depth,finish,angle=0){
      const sh=new T.Shape();sh.moveTo(-rad-width,base);sh.lineTo(-rad-width,spring);
      sh.absarc(0,spring,rad+width,pi,0,true);sh.lineTo(rad+width,base);
      sh.lineTo(rad,base);sh.lineTo(rad,spring);sh.absarc(0,spring,rad,0,pi,false);
      sh.lineTo(-rad,base);sh.closePath();
      add(new T.ExtrudeGeometry(sh,{depth,bevelEnabled:false,curveSegments:14}),finish,x,0,z,angle);
    }
    function finish(){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(xyz,3));
      g.setAttribute('normal',new T.Float32BufferAttribute(normal,3));g.setAttribute('masonryKind',new T.Float32BufferAttribute(type,1));
      g.setIndex(index);g.computeBoundingSphere();
      const mat=new T.MeshLambertMaterial({color:0xffffff,side:T.DoubleSide});
      // Local metre coordinates keep mortar joints aligned across reveals.
      // Scattered exposed brick sits under larger areas of weathered render.
      mat.onBeforeCompile=shader=>{
        shader.vertexShader='attribute float masonryKind; varying float ruinType; varying vec3 ruinP; varying vec3 ruinN;\n'+
          shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nruinP=position;ruinN=normal;ruinType=masonryKind;');
        shader.fragmentShader=`varying float ruinType;varying vec3 ruinP;varying vec3 ruinN;
          float ruinHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float ruinNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
            return mix(mix(ruinHash(i),ruinHash(i+vec2(1,0)),f.x),mix(ruinHash(i+vec2(0,1)),ruinHash(i+1.),f.x),f.y);}
        `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec3 nn=abs(ruinN);vec2 q=nn.y>max(nn.x,nn.z)?ruinP.xz:nn.z>nn.x?ruinP.xy:ruinP.zy;
          vec2 loc=q+vec2(.33*ruinP.z+.18*ruinP.x,0.);
          float soft=ruinNoise(loc*1.14)*.48+ruinNoise(loc*3.2)*.29+ruinNoise(loc*8.35)*.16+ruinNoise(loc*19.5)*.07;
          float drips=ruinNoise(vec2(loc.x*4.2,loc.y*.32));
          float rain=smoothstep(.45,.82,drips)*(.45+.55*ruinNoise(loc*.62));
          vec3 render=mix(vec3(.40,.312,.218),vec3(.62,.485,.348),smoothstep(.30,.72,soft));
          render*=1.-.32*rain;float row=floor(q.y/.092);vec2 brick=vec2(q.x/.224+.5*mod(row,2.),q.y/.092);
          vec2 joints=min(fract(brick),1.-fract(brick));float mortar=1.-smoothstep(.014,.080,min(joints.x,joints.y));
          float band=ruinHash(floor(brick));vec3 fired=mix(vec3(.32,.142,.086),vec3(.53,.266,.158),band);
          fired=mix(fired,vec3(.33,.251,.162),mortar*.76);fired*=.77+.28*soft;
          float exposed=smoothstep(.65,.745,soft+.09*sin(loc.y*.75+loc.x*.51));
          exposed=mix(exposed,.94,step(.5,ruinType)*step(ruinType,1.5));
          vec3 crust=mix(render,fired,exposed);
          if(ruinType>1.5&&ruinType<2.5)crust=mix(vec3(.36,.278,.174),vec3(.66,.494,.293),soft)*(1.-.22*rain);
          if(ruinType>2.5)crust=mix(vec3(.16,.145,.120),vec3(.33,.284,.216),soft)*(1.-.22*rain);
          diffuseColor.rgb=crust;
        `).replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=diffuseColor.rgb*.14;');
      };
      const mesh=new T.Mesh(g,mat);mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);return mesh;
    }
    return {add,wall,box,molding,finish};
  }
  function tower(T,k,m){
    const front=2.20,back=-2.57,stone=0,brick=1,trim=2,cap=3;
    const rect=(l,b,r,t)=>[[l,b],[r,b],[r,t],[l,t]];
    // The principal portal and the adjacent open bay occupy one surviving
    // elevation. Every arch is a hole through the masonry, including the back.
    const baseOutline=[[-3.18,.10],[3.15,.10],[3.13,4.01],[2.88,5.61],[2.63,5.97],
      [-2.64,5.97],[-2.81,5.59],[-3.12,4.17]];
    for(const z of [front,back]){
      const riverSide=z===back;
      m.wall(baseOutline,[[0,.13,riverSide?1.64:1.19,riverSide?2.16:2.56]],riverSide?brick:stone,tx,z,.39);
      const aperture=riverSide?[0,5.99,1.51,7.20]:[0,6.25,1.12,8.67];
      m.wall(rect(-2.58,5.88,2.58,10.28),[aperture],riverSide?brick:stone,tx,z,.36);
      m.wall(rect(-2.48,10.16,2.48,13.05),[-1.17,0,1.17].map(x=>[x,10.65,.397,11.95]),stone,tx,z,.31);
    }
    for(const side of [-1,1]){
      const x=tx+side*2.47,rot=side*pi/2;
      m.wall([[-2.38,.14],[2.46,.14],[2.46,5.70],[2.08,6.02],[-2.32,6.02]],
        [[-.12,.17,.96,2.53]],side===1?brick:stone,x+.07*side,-.02,.30,rot);
      m.wall(rect(-2.36,5.88,2.37,10.27),[[0,6.41,1.05,8.66]],stone,x,-.02,.32,rot);
      m.wall(rect(-2.36,10.17,2.38,13.04),[-1.10,0,1.10].map(o=>[o,10.64,.36,11.94]),stone,x-.09*side,-.02,.30,rot);
      // Buttresses taper in section above their weathered plinths.
      const p=[[2.43,.15],[3.17,.15],[3.15,3.80],[2.93,5.59],[2.62,6.12],[2.48,9.94],[2.35,9.94]];
      m.wall(p.map(([x,y])=>[side*x,y]),[],stone,tx,front-.05,.61);
    }
    // A compressed porch pediment, concentric archivolts and radial fanlight.
    m.wall([[-2.58,3.60],[0,5.62],[2.58,3.60],[1.58,3.60],[0,4.78],[-1.58,3.60]],[],stone,tx,2.50,.51);
    m.wall([[-2.60,3.59],[0,5.66],[2.60,3.59],[2.58,3.39],[0,5.43],[-2.58,3.39]],[],cap,tx,2.93,.18);
    for(const sign of [-1,1]){
      m.box(stone,tx+sign*2.16,1.93,2.75,.61,3.43,.62);
      m.box(trim,tx+sign*2.16,.37,2.79,.77,.43,.67);
      m.box(trim,tx+sign*2.16,3.54,2.80,.83,.19,.70);
    }
    for(const [r,w,z] of [[1.16,.13,2.67],[1.32,.13,2.82],[1.49,.15,2.96]])
      m.molding(tx,z,.19,2.49,r,w,.15,trim);
    m.box(trim,tx,2.77,2.59,2.21,.13,.29);
    for(let i=0;i<=4;i++){
      const a=.28+i*.65,length=.94,stick=new T.BoxGeometry(.062,length,.089);
      stick.rotateZ(a-pi/2);m.add(stick,trim,tx+Math.cos(a)*length*.5,2.79+Math.sin(a)*length*.5,2.60);
    }
    m.molding(tx,2.47,6.21,8.67,1.12,.17,.23,trim);
    m.box(stone,tx,7.80,2.35,.27,3.12,.38);m.box(stone,tx,8.63,2.34,2.12,.28,.38);
    // On the stripped inner face the former nave roof left a sloping scar
    // above a broader, undivided opening (VNPT field photograph tamtoa04).
    m.wall([[-2.62,7.64],[0,9.12],[2.62,7.64],[2.62,7.38],[0,8.79],[-2.62,7.38]],[],stone,tx,-2.78,.17);
    m.molding(tx,-2.72,5.99,7.20,1.51,.16,.16,stone);
    m.molding(tx,-2.72,.19,2.16,1.64,.13,.16,stone);
    for(const y of [5.94,10.19,13.0]){
      const half=y<6?2.95:y<12?2.69:2.59,depth=y<6?2.68:2.56;
      for(const sign of [-1,1]){
        m.box(cap,tx,y,sign*depth,2*half,.17,.29);m.box(stone,tx,y+.14,sign*depth,2*half-.13,.082,.26);
        m.box(cap,tx+sign*half,y,0,.26,.17,2*depth);m.box(stone,tx+sign*half,y+.14,0,.20,.082,2*depth);
      }
    }
    // South of the tower a single lower bay retains its arched side door
    // and the outline of a smaller blocked upper opening.
    const flank=[[.86,.10],[5.30,.10],[5.33,6.07],[5.08,6.18],[4.93,7.47],[4.58,7.98],
      [4.11,8.22],[3.24,8.23],[2.77,8.19],[1.98,8.26],[1.17,8.44],[.85,8.22]];
    m.wall(flank,[[3.39,.15,.82,2.33]],stone,0,2.09,.48);
    // The river side of this wall exposes its brick core at a ragged return.
    m.wall([[1.18,.13],[5.29,.12],[5.26,3.45],[5.05,4.15],[4.91,5.86],[4.63,6.17],
      [4.72,7.42],[4.44,7.71],[3.82,7.98],[2.37,8.0],[1.18,8.16]],
      [[3.40,.15,.84,2.30]],brick,0,1.76,.34);
    m.molding(3.39,2.56,.18,2.33,.82,.11,.095,trim);
    m.molding(3.35,2.57,6.11,7.12,.53,.115,.061,trim);
    m.box(cap,3.17,5.98,2.40,4.35,.19,.67);
    m.wall([[-1.53,.13],[2.29,.13],[2.3,6.07],[1.71,5.97],[1.24,5.26],[.51,4.53],[.19,4.62],
      [-.09,3.72],[-.47,3.50],[-.59,2.33],[-1.04,2.18],[-1.09,1.18],[-1.53,1.09]].map(([u,y])=>[-u,y]),[],brick,5.00,0,.35,pi/2);
    // Segmented shallow cap: a rounded square at its spring, narrowing to a finial.
    const dome=[],segments=32,levels=8;
    function domePoint(i,j){
      const a=i*2*pi/segments,u=j/levels,co=Math.cos(a),si=Math.sin(a),v=Math.sin(u*pi/2);
      const h=13.15+1.86*v,r=2.42*Math.cos(u*pi/2)/Math.pow(Math.pow(Math.abs(co),3.4)+Math.pow(Math.abs(si),3.4),1/3.4);
      return [tx+co*r,h,si*r*.98];
    }
    for(let i=0;i<segments;i++)for(let j=0;j<levels;j++){
      const a=domePoint(i,j),b=domePoint(i+1,j),c=domePoint(i+1,j+1),d=domePoint(i,j+1);dome.push(...a,...d,...b,...b,...d,...c);
    }
    const dg=new T.BufferGeometry();dg.setAttribute('position',new T.Float32BufferAttribute(dome,3));dg.computeVertexNormals();m.add(dg,cap);
    for(let i=0;i<segments;i+=4){
      const curve=new T.CatmullRomCurve3(Array.from({length:levels+1},(_,j)=>new T.Vector3(...domePoint(i,j))));
      m.add(new T.TubeGeometry(curve,12,.061,6,false),trim);
    }
    m.add(new T.CylinderGeometry(.029,.135,.35,9),cap,tx,15.15,0);
  }
  function grounds(T,k,m){
    const curb=0xada99a,lawn=0x7d805a,earth=0x95846b,paver=0xb38f7f,iron=0x414c46;
    // The current park path and the extended former nave are different
    // features. Keep the public path outside the fence level with the city.
    for(let i=0;i<20;i++)k.box(lawn,0,-.77,10.68-i*3.14,20.8,1.92,3.16);
    for(let j=0;j<9;j++){
      const z=-4.68-j*3.78;
      k.box(earth,0,.215,z,12.4,.13,3.80);
      for(const x of [-6.26,6.26])k.box(curb,x,.265,z,.21,.27,3.86);
    }
    k.box(curb,0,.245,-36.95,12.54,.26,.22);
    for(let j=0;j<14;j++)k.box((j%2)?paver:0xb89b86,tx,.23,3.01+j*.92,3.78,.18,.94);
    for(const x of [-7.37,4.03]){
      k.tapered(curb,x,.44,10.01,.33,.33,.62,1,10);
      k.tapered(0x54665c,x,2.68,10.01,.104,.066,4.2,1,10);
      k.tapered(0x5b6154,x,4.86,10.01,.31,.12,.18,1,12);
    }
    // On the unroofed nave a freestanding remnant appears in both river-side
    // and side photographs. Position estimated against the aerial ground mark.
    const px=2.52,pz=-23.1;
    m.wall([[-.63,.17],[.68,.17],[.63,2.31],[.48,2.42],[.57,3.07],[.48,4.22],[.27,4.64],
      [.34,5.27],[.25,5.29],[.22,6.33],[-.07,6.39],[-.13,6.24],[-.41,6.36],[-.50,4.58],[-.63,3.97]],
      [],1,px,pz-.43,.89);
    m.box(1,px,.47,pz,1.59,.50,1.26);
    // Pale masonry gateposts and dark open ironwork documented in the
    // 2013/2020 photos. A historic marker flanks the paved entrance.
    const bounds=[[-10.0,-50.1],[-10.0,12.05],[-3.82,12.05]],other=[[.02,12.05],[10.0,12.05],[10.0,-50.1],[-10.0,-50.1]];
    function fence(chain){
      for(let i=1;i<chain.length;i++){
        const [x,z]=chain[i-1],[bx,bz]=chain[i],dx=bx-x,dz=bz-z,len=Math.hypot(dx,dz),count=Math.ceil(len/3.38);
        const angle=Math.atan2(-dz,dx),w=len/count;
        for(let j=0;j<=count;j++){
          const px=x+dx*j/count,pz=z+dz*j/count;k.box(curb,px,.76,pz,.27,1.42,.27);
          k.tapered(0xbcb59f,px,1.51,pz,.225,.12,.19,1,4);
          if(j===count)break;
          const mx=px+dx/(2*count),mz=pz+dz/(2*count);
          for(const y of [.42,1.25])k.box(iron,mx,y,mz,w,.053,.057,angle);
          for(let n=1;n<8;n++)k.box(iron,px+dx*n/(count*8),.85,pz+dz*n/(count*8),.038,.93,.038);
        }
      }
    }
    fence(bounds);fence(other);
    const board=0x3b4d44;
    k.box(board,2.53,1.03,12.23,2.45,1.32,.11);
    for(const x of [1.28,3.78]){k.box(curb,x,.92,12.22,.076,1.72,.11);}
    k.sign('CHỨNG TÍCH CHIẾN TRANH',2.53,1.35,12.30,2.28,.24,true,'#c9bc84');
    k.sign('THÁP CHUÔNG NHÀ THỜ TAM TÒA',2.53,1.09,12.30,2.26,.18,true,'#d5d5c3');
    if(window.CentralArch)window.CentralArch.trees(T,k,[{x:-7.5,z:3.2,y:.2,h:4.45,width:2.6,kind:'palm'},
      {x:7.8,z:8.1,y:.2,h:3.45,width:2.3},{x:-8.15,z:-27.2,y:.2,h:3.7,width:2.65}]);
  }
  function build(T,k){
    const m=masonry(T,k);grounds(T,k,m);tower(T,k,m);const ruin=m.finish();
    const rp=ruin.geometry.attributes.position,detached=[];
    for(let i=0;i<rp.count;i++)if(rp.getZ(i)<-20)detached.push([i,rp.getY(i)]);
    const attached=k.group.children.slice(),restY=attached.map(o=>o.position.y);let merged,original;
    k.group.userData.fitGround=ground=>{
      merged??=k.group.children.find(o=>o.geometry?.hasAttribute('finishKind'))?.geometry;if(!merged)return;
      const a=merged.attributes.position;
      original??=Float32Array.from({length:a.count},(_,i)=>a.getY(i));
      const base=Math.max(ground(-5,1),ground(5,1),ground(0,-2.5),ground(0,8),ground(0,-23),ground(0,-41))+.07;
      const level=(x,z)=>{
        const d=Math.abs(x)>8.2?Math.max(0,Math.abs(x)-7.2):0;
        const blend=Math.min(1,Math.max(d/5,(Math.abs(z)-4)/11,0));
        return base*(1-blend)+ground(x,z)*blend;
      };
      const pierShift=level(2.52,-23.1)-base;
      for(const [i,y] of detached)rp.setY(i,y+pierShift);
      rp.needsUpdate=true;ruin.geometry.computeBoundingBox();ruin.geometry.computeBoundingSphere();
      for(let i=0;i<a.count;i++){const y=original[i],x=a.getX(i),z=a.getZ(i),top=level(x,z);
        a.setY(i,y<-.65?Math.min(y+top,ground(x,z)-.14):y+top);}
      attached.forEach((o,i)=>o.position.y=restY[i]+(o.geometry?.hasAttribute('masonryKind')?base:level(o.position.x,o.position.z)));
      heights.forEach((h,i)=>views[i].height=(h+base)/.46);
      a.needsUpdate=true;merged.computeBoundingBox();merged.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Chứng tích tháp chuông nhà thờ Tam Tòa',kind:'Di tích lịch sử',
    lon,lat,yaw,start:[106.6230958,17.4750631],visitOnArrival:true,mappedEntrance:true,width:21.5,depth:64,gardenRadius:1,
    boundary:[[-10.6,-50.6],[10.6,-50.6],[10.6,12.30],[-10.6,12.30]],
    reserve:(x,z,pad)=>Math.abs(x)<10.7+pad&&z> -50.7-pad&&z<12.4+pad,modeledBuildings:['w343077412'],
    solids:[[tx,0,2.90,2.55],[3.15,2.27,2.16,.48],[2.52,-23.1,.68,.52]],
    description:'Bên sông Nhật Lệ, tháp chuông, một mảng mặt đứng và trụ gạch còn đánh dấu nền nhà thờ Tam Tòa cũ. Từ đường Nguyễn Du có thể nhìn xuyên qua cửa vòm tới khoảng nền phía sau. Tỉnh Quảng Bình xếp hạng chứng tích năm 1997. Dấu chân tháp theo bản đồ; chiều cao, phần gạch vỡ và vị trí trụ phía sau được ước lượng từ ảnh.',
    arrivalNote:'Xe dừng trên làn Nguyễn Du phía công viên Đồng Mỹ. Theo lối đi bộ ven hàng rào để quan sát tháp và khoảng nền hướng ra sông Nhật Lệ.',
    source,photo:face,map:'https://www.openstreetmap.org/way/343077412',views,build});
})();
