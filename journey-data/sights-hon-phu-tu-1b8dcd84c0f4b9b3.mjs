const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='hon-phu-tu-kien-luong',catalogId='osm-way-1223400935';
  const lon=104.638706,lat=10.135298,stop=window.VietnamTourism.byId.get(catalogId);
  const survey='https://tuoitre.vn/gan-20-nam-gap-su-co-gay-do-den-nay-hon-phu-tu-ra-sao-100260629165618354.htm';
  const commons=n=>'https://commons.wikimedia.org/?curid='+n,pi=Math.PI,tau=2*pi;
  const clamp=v=>Math.min(1,Math.max(0,v)),mix=(a,b,t)=>a+(b-a)*t;
  function smooth(v){const t=clamp(v);return t*t*(3-2*t);}
  // Shoreline vertices from OSM ways 1223400936 and 1223400937. X east, Z south.
  const ba=[[-138.6,-103],[-150.6,-106.2],[-159.5,-96.9],[-159.5,-88.2],[-153.7,-63.8],[-160.3,-44.6],
    [-162.8,-25.3],[-158.8,-11.9],[-153.3,-4.8],[-145.7,-1.1],[-137,-.7],[-107.4,-13.1],[-88.2,-26.6],
    [-76.9,-31.2],[-67.7,-32.6],[-58.9,-32],[-41.8,-26.4],[-35.8,-29.3],[-35,-33.8],[-37,-40.3],
    [-36.6,-54.2],[-38.3,-61.6],[-41.7,-66.2],[-47.4,-68.7],[-58.8,-67.2],[-69.1,-68.9],[-82.7,-78.7],
    [-89.7,-89.5],[-99.6,-94.3],[-111.8,-92],[-121.8,-92.6],[-131.1,-96.4]];
  const ong=[[-422.1,-8.5],[-430.9,-1.4],[-436.7,8.6],[-439.4,20.4],[-438.6,32.5],[-434,56.3],[-425.1,89.7],
    [-418.1,104.1],[-409.8,110.1],[-402.8,110.9],[-393,106.8],[-384.5,95.2],[-377.1,77.1],[-372.5,61.8],
    [-371.9,49.8],[-372.7,43.9],[-376.6,32.5],[-384.2,20.2],[-394.9,2.8],[-403.4,-6.2],[-415.1,-9.4]];
  function sight(name,eye,target,viewFov,photo,photoCatalogId,description){
    const dx=eye[0]-target[0],dz=eye[2]-target[2],dy=eye[1]-target[1];
    return {name,offset:[target[0],target[2]],height:target[1]/.46,viewBase:'monument',viewFov,
      viewRadius:Math.hypot(dx,dy,dz),viewAngle:Math.atan2(dx,dz),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),photo,photoCatalogId,description};
  }
  const views=[
    sight('Từ Bãi Dương nhìn ra hòn Phụ Tử',[-236,4.0,-739],[-20,14,-3],13.6,commons(32748961),catalogId,
      'Từ Bãi Dương nhìn về phía đông nam, cột đá hòn Tử còn đứng ở đầu dãy đá thấp. Bên phải là hòn Bà phủ cây, ngăn cách với hòn Tử bởi một khoảng nước.'),
    sight('Vách nghiêng của hòn Tử',[16,6.2,-80],[0,14.1,0],34,commons(32749318),'hon-phu-tu-cot-da',
      'Từ phía bắc nhìn gần cột đá vôi cao khoảng 30 m. Chân cột thắt lại ở mép nước, còn những bụi cây nhỏ bám vào khe dọc vách và trên chóp.'),
    sight('Bệ đá sau khi hòn Phụ gãy',[105,59,52],[17,9,-13],50,survey,'hon-phu-tu-be-da',
      'Nhìn từ phía biển vào lưng hòn Tử. Dãy khối đá thấp trải dài về đông bắc. Hòn Phụ gãy đổ ngày 9/8/2006. Ảnh thực địa tháng 6/2026 ghi nhận hòn Tử vẫn đứng một mình.'),
    sight('Vách đá và tán cây hòn Bà',[-146,8,-186],[-99,16,-55],43,commons(32748961),'osm-way-1223400936',
      'Hòn Bà nằm về phía tây bắc hòn Tử. Mặt đá xám lộ giữa các vạt cây. Phía đông của đảo thu hẹp lại thành một mỏm vách dốc trên mặt biển.'),
    sight('Hòn Ông ở phía ngoài khơi',[-225,40,107],[-405,18,51],42,survey,'osm-way-1223400937',
      'Từ phía hòn Bà nhìn ra hòn Ông ở xa hơn về phía tây. Đảo kéo dài từ bắc xuống nam, có vách đá sát nước và cây phủ trên sống núi.'),
  ];
  const viewHeights=views.map(v=>v.height);
  function build(T,k){
    const p=[],detail=[],indices=[],uv=[],coarse=globalThis.matchMedia?.('(pointer: coarse)').matches;
    const shrubs=[],occupied=new Set();
    const varied=(x,z)=>{const n=Math.sin(x*38.33+z*17.12)*43758.5453;return n-Math.floor(n);};
    function vertex(x,y,z,cover,front=0,u=.25,v=.5){p.push(x,y,z);detail.push(cover,front);uv.push(u,v);}
    function connect(first,w,h,reverse=false){
      for(let j=0;j<h;j++)for(let i=0;i<w;i++){
        const a=first+j*(w+1)+i,b=a+1,c=a+w+1,d=c+1;
        if(reverse)indices.push(a,c,b,b,c,d);else indices.push(a,b,c,b,d,c);
      }
    }
    // Heights and lateral silhouettes in a rectified crop of the May 2014
    // north-side photograph. The surviving stack has a notch at the waterline.
    const sections=[[574,111,195,.66],[565,83,239,.72],[551,52,271,.95],[536,48,273,1],[500,40,261,1],
      [450,45,249,1],[380,32,231,.97],[332,46,224,1],[280,48,210,1],[244,53,206,.98],
      [185,46,190,1],[133,33,170,.97],[101,30,159,.98],[84,42,156,1],[71,77,152,.90],
      [42,91,140,.85],[34,103,125,.65],[32,113,115,.5]];
    const sides=coarse?32:56,pxPerM=17.74;
    for(const [py,left,right,depth] of sections){
      for(let i=0;i<=sides;i++){
        const a=tau*i/sides,c=Math.cos(a),s=Math.sin(a),y=(564-py)/pxPerM;
        const radius=(right-left)*.5/pxPerM,edge=1+.048*Math.sin(7*a+y*.046)+.027*Math.cos(13*a-y*.078);
        const across=((left+right)*.5-154)/pxPerM+radius*c*edge,near=radius*.71*depth*s*edge;
        const x=-.956*across-.292*near,z=.292*across-.956*near;
        vertex(x,y,z,clamp((y-25)/14+.10*Math.sin(4*a)),smooth((s+.12)/.78),
          clamp((154+across*pxPerM)/300)*.248,1-clamp(py/575));
      }
    }
    connect(0,sides,sections.length-1,true);
    // Detached blocks within the mapped rock group, traced on the overhead
    // view and checked against the east-facing side of the June 2026 survey.
    const blocks=[[-10,38,7,7,5.4,.4],[-15,45,4.8,4.7,2.1,1.6],[-13,26,9,9,7.8,1.3],
      [-4,27,9.5,11.6,7.3,2.6],[8,30,10.3,9.3,8.0,.9],[13,19,8,8.1,4.5,2.3],[-4,13,10,10,9.0,2.6],
      [7,5,8.5,10.2,9.1,1.6],[9,-6,7.1,10.7,8.6,.2],[16,-11,7.4,7.5,6.2,1.8],
      [22,-17,7.3,7.2,10.2,.65],[30,-23,6.8,6.7,5.2,1.1],[36,-29,7.4,9.5,6.7,.5],
      [42,-40,8.3,10.3,7.3,2.1],[44,-49,7.2,7.5,10.6,1.1],[53,-48,4.8,5.0,2.35,.8],
      [51,-36,3.3,5.4,1.52,2.1],[26,-9,3.1,4.9,1.75,.8],[-25,27,4.4,4.0,1.9,1.2]];
    for(const [x,z,rx,rz,h,seed] of blocks){
      const first=p.length/3,w=coarse?14:24,rows=8;
      for(let j=0;j<=rows;j++)for(let i=0;i<=w;i++){
        const a=tau*i/w,t=j/rows;
        // Intersect radial rays with tilted, roughly rectangular joint faces.
        // The narrower basal course models the wave-cut notch above the water.
        const facet=1/Math.max(.79*Math.abs(Math.cos(a-seed)),.95*Math.abs(Math.sin(a-seed)),.83);
        const r=[.77,.82,1.02,.98,.89,.88,.80,.67,.025][j]*facet*(1+.082*Math.sin(3*a+seed)+.047*Math.cos(7*a-seed+t*.8));
        const xx=x+rx*r*Math.cos(a)+t*1.7*Math.sin(seed),zz=z+rz*r*Math.sin(a)+t*1.4*Math.cos(seed);
        const y=-1.7+(h+1.7)*[0,.19,.28,.45,.57,.74,.89,.98,1][j]+t*(.24*(xx-x)*Math.sin(seed)+.27*(zz-z)*Math.cos(seed));
        const photoX=-.956*xx+.292*zz,near=-.292*Math.cos(a)-.956*Math.sin(a);
        vertex(xx,y,zz,clamp((t-.67)*1.9)*clamp(Math.cos(xx*.31+zz*.25+seed)*.90+.48),
          smooth((near+.04)/.73)*smooth((-photoX-2)/5),.502+.495*clamp((photoX+64)/61),
          .012+.475*clamp((y+.7)/13.9));
      }
      connect(first,w,rows,true);
    }
    function island(outline,cx,cz,isBa){
      const perimeter=[];
      for(let i=0;i<outline.length;i++){
        const [x,z]=outline[i],[ex,ez]=outline[(i+1)%outline.length],n=Math.ceil(Math.hypot(ex-x,ez-z)/(coarse?4:2.25));
        for(let j=0;j<n;j++)perimeter.push([mix(x,ex,j/n),mix(z,ez,j/n)]);
      }
      perimeter.push(perimeter[0]);const first=p.length/3,w=perimeter.length-1,rows=coarse?16:27;
      for(let j=0;j<=rows;j++)for(const [bx,bz] of perimeter){
        const t=j/rows,radial=1-t,x=mix(bx,cx,t),z=mix(bz,cz,t);
        const corrugation=(Math.sin(x*.81+z*.26)+.51*Math.cos(z*.57-x*.22))*(1.1-.6*t);
        const crest=isBa?24+16*Math.exp(-((x+119)**2/400+(z+63)**2/410))+8*Math.exp(-((x+49)**2/125+(z+53)**2/170)):
          29+15*Math.exp(-((x+407)**2/260+(z-35)**2/600))+6*Math.exp(-((z-75)**2/220));
        const run=clamp(t/(isBa&&bx>-65?.40:.59)),shoulder=1-(1-run)**3.2;
        const y=-2.7+(crest+2.7)*shoulder+smooth(t/.105)*(2.5*Math.sin(x*.23-z*.102)+1.6*Math.cos(z*.52+x*.21)+.67*corrugation);
        const undercut=.93*Math.exp(-((y-.9)**2)/1.9),angle=Math.atan2(bz-cz,bx-cx);
        const jitter=radial*Math.min(1,(y+3)/4)*(corrugation-undercut);
        const cover=clamp(.41+.39*smooth((y-3)/22)+.26*Math.sin(z*.17+.39*Math.cos(x*.19))+.23*Math.cos(x*.26-z*.09)
          -(isBa?.41*smooth((x+66)/22):.24*smooth((x+400)/23))-.27*(1-shoulder));
        const xx=x+Math.cos(angle)*jitter,zz=z+Math.sin(angle)*jitter;
        const near=-.30*Math.cos(angle)-.954*Math.sin(angle);
        vertex(xx,y,zz,cover,isBa?smooth((near+.13)/.80):0,
          .502+.495*clamp((-.954*xx+.30*zz-14)/135),.514+.473*clamp(y/44));
        if(t>.10&&t<.93&&y>3&&cover>.43&&varied(xx,zz)>.70){
          const cell=Math.floor(xx/4)+','+Math.floor(zz/4);
          if(!occupied.has(cell)){
            occupied.add(cell);const size=1.3+3.0*varied(zz,xx);
            shrubs.push([xx,y-.25,zz,size,1.2+varied(xx,zz+7)*2.65]);
          }
        }
      }
      connect(first,w,rows);
    }
    island(ba,-111,-56,true);island(ong,-407,45,false);
    const geo=new T.BufferGeometry();geo.setIndex(indices);geo.setAttribute('position',new T.Float32BufferAttribute(p,3));
    geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setAttribute('weather',new T.Float32BufferAttribute(detail,2));geo.computeVertexNormals();
    const map=new T.TextureLoader().load('sight-imagery/hon-phu-tu-da-voi.webp');map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const mat=new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:.95});
    mat.onBeforeCompile=sh=>{
      const coords='varying vec2 field;varying vec3 localRock;varying vec3 rockNormal;\n';
      sh.vertexShader='attribute vec2 weather;'+coords+sh.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nfield=weather;localRock=position;rockNormal=normal;');
      sh.fragmentShader=coords+sh.fragmentShader.replace('#include <map_fragment>',`
        {
        vec3 p=localRock;
        vec2 slope=vec2(.72*p.x+.64*p.z+.13*p.y,p.y+.21*p.x-.14*p.z);
        vec2 tileSize=vec2(.247,.494);
        vec3 normalRock=normalize(rockNormal),weights=pow(abs(normalRock),vec3(3.));
        weights/=max(dot(weights,vec3(1.)),.001);
        vec2 originTile=vec2(.251,.502);
        vec3 bed=weights.x*texture2D(map,originTile+tileSize*fract(p.zy*vec2(.108,.094))).rgb
          +weights.y*texture2D(map,originTile+tileSize*fract(p.xz*.104)).rgb
          +weights.z*texture2D(map,originTile+tileSize*fract(vec2(p.x*.115,p.y*.092+.017*p.x))).rgb;
        vec3 fleck=texture2D(map,vec2(.251,.502)+tileSize*fract(slope*.32+vec2(.21,.08))).rgb;
        vec2 leafTile=vec2(.251,.002);
        vec3 foliage=weights.x*texture2D(map,leafTile+tileSize*fract(p.zy*.097+bed.rg*.31)).rgb
          +weights.y*texture2D(map,leafTile+tileSize*fract(p.xz*.123+bed.gb*.31)).rgb
          +weights.z*texture2D(map,leafTile+tileSize*fract(p.xy*.114+bed.br*.31)).rgb;
        float luma=dot(bed,vec3(.25,.59,.16)),grain=dot(fleck,vec3(.25,.59,.16));
        vec3 grey=mix(vec3(.18,.18,.179),vec3(.61,.61,.59),clamp(luma*1.65+.23*grain,0.,1.));
        float groove=abs(fract(.30*p.x+.44*p.z+.032*p.y+.17*sin(.46*p.z+.19*p.y))-.5);
        grey*=.78+.22*smoothstep(.0,.13,groove);
        grey*=mix(.66,1.,smoothstep(.55,2.7,p.y+.28*sin(p.x)));
        float leaves=smoothstep(.22,.61,field.x+.39*(grain-.32)+.16*sin(.67*p.x+.21*p.z));
        float leafLight=dot(foliage,vec3(.26,.59,.15));
        vec3 shrub=mix(vec3(.038,.065,.022),vec3(.195,.255,.087),smoothstep(.025,.60,leafLight));
        vec3 surface=mix(grey,shrub,leaves);
        vec4 photographed=texture2D(map,vMapUv);
        float facing=smoothstep(-.05,.61,dot(normalRock,vec3(-.292,0.,-.956)));
        diffuseColor.rgb*=mix(surface,pow(photographed.rgb,vec3(.80)),field.y*facing*photographed.a);
        }
      `);
    };
    mat.customProgramCacheKey=()=>'hon-phu-tu-limestone';
    const mesh=new T.Mesh(geo,mat);mesh.name='Hòn Tử, bệ đá gãy, hòn Bà và hòn Ông';
    const islands=new T.Group();mesh.castShadow=true;mesh.receiveShadow=true;islands.add(mesh);k.group.add(islands);
    const tree=createTreeModels(T),canopy=new T.InstancedMesh(tree.distantGeometry('tea',0),tree.billboardMaterial(),shrubs.length);
    const pose=new T.Object3D();
    shrubs.forEach(([x,y,z,w,h],i)=>{
      pose.position.set(x,y,z);pose.scale.set(w,h,w);pose.rotation.y=varied(x,z)*tau;
      pose.updateMatrix();canopy.setMatrixAt(i,pose.matrix);
    });
    canopy.instanceMatrix.needsUpdate=true;canopy.computeBoundingSphere();islands.add(canopy);
    let pending=false;
    function settle(stage){islands.position.y=stage;views.forEach((v,i)=>v.height=viewHeights[i]+stage/.46);}
    k.group.userData.fitGround=ground=>{settle(ground(31,-93));pending=true;};
    mesh.onBeforeRender=()=>{
      if(!pending||typeof roads==='undefined'||typeof gfx==='undefined')return;
      const origin=roads.point(lon,lat);
      for(const [u,v] of [[31,-93],[63,-70],[-41,40],[98,-3]]){
        const sea=gfx.waterAt(origin.x+u,origin.z+v);
        if(Number.isFinite(sea?.level)){settle(sea.level-k.group.position.y);pending=false;break;}
      }
    };
  }
  (window.VietnamSights??=[]).push({...stop,id,catalogId,lon,lat,yaw:0,name:'Hòn Phụ Tử',kind:'Danh thắng',
    width:120,depth:125,viewDistance:1450,solids:[],gardenRadius:0,
    reserve:(x,z,r=0)=>(x> -22-r&&x<59+r&&z> -60-r&&z<52+r)||(x> -165-r&&x< -33+r&&z> -109-r&&z<2+r)||(x> -442-r&&x< -369+r&&z> -12-r&&z<114+r),
    photo:commons(32748961),views,
    description:'Trong cụm danh thắng Chùa Hang – Hòn Phụ Tử ở Kiên Lương, hòn Tử là cột đá còn đứng sau vụ gãy đổ năm 2006. Đường bờ của ba hòn đá vôi dựa trên bản đồ và ảnh từ trên cao. Hình dáng các vách được ước lượng từ ảnh chụp hai phía.',
    arrivalNote:'Xe dừng ở cuối nhánh đường bên khu tham quan trên đất liền. Từ bờ, các góc ngắm đưa bạn ra hòn Tử, qua bệ đá rồi sang hòn Bà và hòn Ông.',build});
})();

export default window.VietnamSights;
