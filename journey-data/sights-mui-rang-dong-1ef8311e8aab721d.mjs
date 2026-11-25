const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const id='bia-mom-rang-dong', catalogId='phu-yen-bia-mom-rang-dong';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Thiếu ghim bia mỏm Rạng Đông');
  const source='https://daklakvrtour.com/mui-dien-bai-mon.html';
  const field='https://daklakvrtour.com/tour/46/index.html';
  // Survey 2026-11-23. WGS84, local x east / z south, metres. The two crowns at
  // [109.457656,12.895376] and [109.45742,12.89569], lower and upper shelter,
  // and the adjacent concrete apron register on Google satellite and Esri World
  // Imagery. w909061438 (building=yes, tourism=information) lies closer to the
  // stone marker than to the green lower roof. w909061433 records the footpath.
  // The ground tour node7 (2025-06-26) gives the inscription, flag, boundary
  // pillar, seating shelter and paving. Its Tuy Hoa GPS is a template value.
  // node11 identifies the upper shelter and the two distinct levels seen on
  // https://commons.wikimedia.org/wiki/File:Dien_Cape_3.jpg . Also checked the
  // 2026-01-01 ceremony at https://daklakvrtour.com/tour/332/index.html .
  // XY estimate ~3 m. Vertical dimensions, joints, masonry thickness, the
  // rail spans, and individual crevices in the rock are interpreted from images.
  // The coordinates inscribed on the marker refer to the cape historically.
  const rand=n=>{const q=Math.sin(n*23.417+1.361)*38314.23;return q-Math.floor(q);};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const apron=[[-7.5,2.35],[.06,2.88],[3.83,-1.25],[4.35,-5.2],[3.85,-9.7],[.6,-11.45],[-4.95,-10.68],[-5.85,-5.10]];
  const upper=[[-7.5,1.28],[-1.7,-2.42],[2.62,-5.73],[2.72,-9.53],[.55,-10.89],[-4.99,-10.07],[-5.35,-5.48]];
  const rail=[[-7.48,2.34],[.10,2.83],[3.81,-1.22],[4.29,-5.18],[3.81,-9.62],[.62,-11.36],[-4.91,-10.55]];
  const pale=0xe7dfd2,post=0xd38054,green=0x3d8e6a;
  function painter(T){
    const stash=new Map();
    function mat(c){
      if(typeof c!=='number')return c;
      if(!stash.has(c))stash.set(c,new T.MeshStandardMaterial({color:c,roughness:.84,side:T.DoubleSide}));
      return stash.get(c);
    }
    const cube=new T.BoxGeometry(1,1,1);
    function mesh(group,geo,c,x=0,y=0,z=0){
      const m=new T.Mesh(geo,mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;group.add(m);return m;
    }
    function box(g,c,x,y,z,w,h,d,angle=0){
      const m=mesh(g,cube,c,x,y,z);m.scale.set(w,h,d);m.rotation.y=angle;return m;
    }
    function rod(g,c,a,b,r,r2=r,sides=10){
      const v=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),h=v.length();
      const m=mesh(g,new T.CylinderGeometry(r2,r,h,sides),c,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);
      m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.divideScalar(h));return m;
    }
    function face(g,c,xyz,idx,uv){
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(xyz.flat(),3));geo.setIndex(idx);
      if(uv)geo.setAttribute('uv',new T.Float32BufferAttribute(uv.flat(),2));geo.computeVertexNormals();return mesh(g,geo,c);
    }
    function slab(g,p,y,base,top,wall){
      const idx=T.ShapeUtils.triangulateShape(p.map(([x,z])=>new T.Vector2(x,-z)),[]).flat();
      const m=face(g,top,p.map(([x,z])=>[x,y,z]),idx,p.map(([x,z])=>[x/2.4,-z/2.4]));
      for(let i=0;i<p.length;i++){
        const [x,z]=p[i],[a,b]=p[(i+1)%p.length];
        face(g,wall,[[x,base,z],[a,base,b],[a,y,b],[x,y,z]],[0,1,2,0,2,3]);
      }
      return m;
    }
    return {T,mat,mesh,box,rod,face,slab};
  }
  function texture(T,draw,w=512,h=512){
    const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);
    const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t;
  }
  function pavement(T,colour){
    const map=texture(T,(g,w,h)=>{
      g.fillStyle=colour?'#827f7a':'#959495';g.fillRect(0,0,w,h);
      for(let j=0;j<10;j++)for(let i=-1;i<10;i++){
        const v=Math.round((colour?161:132)+26*rand(733+j*14+i));
        g.fillStyle=colour?`rgb(${v+17},${v+10},${v})`:`rgb(${v},${v},${v+1})`;
        g.fillRect((i+(j%2)*.5)*w/8,j*h/10,w/8-1,h/10-1);
      }
      for(let i=0;i<14000;i++){g.fillStyle=i%2?'#0000000c':'#ffffff16';g.fillRect(rand(i+130)*w,rand(i+19500)*h,1.5,1.0);}
    });
    map.wrapS=map.wrapT=T.RepeatWrapping;
    return new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:.94});
  }
  function plaque(S,g){
    const {T,mesh,box}=S,m=new T.Group();m.rotation.y=-2.24;g.add(m);
    for(const shade of [0x3e3c37,0x474541,0x965943,0xb27960,0xb37659])S.mat(shade).emissive.setHex(shade===0x3e3c37||shade===0x474541?0x27251e:0x341e16);
    box(m,0x3c3d3c,0,.108,0,3.65,.216,1.98);
    box(m,0x62625d,0,.247,0,3.15,.092,1.55);
    box(m,0x464640,0,.385,0,2.45,.19,1.13);
    function panel(w,bottom,mid,wing,depth,z,c){
      const s=new T.Shape();s.moveTo(-w*.46,bottom);s.lineTo(w*.46,bottom);s.lineTo(w/2,wing);
      s.quadraticCurveTo(0,2*mid-wing,-w/2,wing);s.closePath();
      return mesh(m,new T.ExtrudeGeometry(s,{depth,curveSegments:20,bevelEnabled:true,bevelSize:.013,bevelThickness:.013,bevelSegments:2}),c,0,0,z);
    }
    panel(1.80,.48,2.44,2.68,.17,-.245,0x474541);panel(1.80,.48,2.44,2.68,.17,.065,0x3e3c37);
    panel(1.25,.51,2.11,2.23,.05,.235,0x965943);panel(1.25,.51,2.11,2.23,.05,-.302,0x965943);
    const sun=mesh(m,new T.CylinderGeometry(.391,.391,.62,48),0xb27960,0,2.534,0);sun.rotation.x=Math.PI/2;
    const disc=mesh(m,new T.CylinderGeometry(.342,.342,.006,48),0xb37659,0,2.534,.315);disc.rotation.x=Math.PI/2;
    const inscription=texture(T,(ctx,w,h)=>{
      ctx.clearRect(0,0,w,h);ctx.textAlign='center';ctx.fillStyle='#dec987';
      const lines=[['MŨI ĐIỆN',94,79],['(MŨI ĐẠI LÃNH)',157,53],['PHÚ YÊN - VIỆT NAM',219,43],
        ['NƠI ĐÓN ÁNH BÌNH MINH ĐẦU TIÊN',306,26],['TRÊN ĐẤT LIỀN VIỆT NAM',348,31],['MŨI ĐIỆN CAPE',454,48],['(ĐẠI LÃNH CAPE)',504,37],
        ['WHERE TO PICK THE FIRST SUNRISE',574,26],['ON LAND IN VIET NAM',614,32],['109°27′06″  E',716,39],['12°53′48″  N',766,39],['TỈNH PHÚ YÊN',878,35]];
      for(const [line,v,size] of lines){ctx.font='bold '+size+'px Georgia, serif';ctx.fillText(line,w/2,v,w*.97);}
    },640,930);
    const ink=new T.MeshBasicMaterial({map:inscription,transparent:true,depthWrite:false});
    for(const [z,turn] of [[.301,0],[-.320,Math.PI]]){
      const t=mesh(m,new T.PlaneGeometry(1.18,1.52),ink,0,1.328,z);t.rotation.y=turn;t.castShadow=false;
    }
  }
  function flagAndPillar(S,g){
    const {T,box,mesh,rod}=S,fx=-1.86,fz=-5.18;
    for(let i=0;i<4;i++)box(g,i%2?0x9b6554:0x89594a,fx,.43+i*.108,fz,2.85-i*.30,.11,2.85-i*.30,.23);
    rod(g,0xb2a390,[fx,.80,fz],[fx,1.16,fz],.45,.225,10);
    rod(g,0xa59a85,[fx,1.12,fz],[fx,2.73,fz],.138,.096,16);
    rod(g,0xc5c8c3,[fx,2.68,fz],[fx,9.46,fz],.087,.049,16);
    mesh(g,new T.SphereGeometry(.085,12,8),0xccc6b3,fx,9.49,fz);
    const map=texture(T,(c,w,h)=>{
      c.fillStyle='#d62424';c.fillRect(0,0,w,h);c.fillStyle='#ffdc36';c.beginPath();
      for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?h*.1146:h*.30;
        const x=w/2+r*Math.cos(a),y=h/2+r*Math.sin(a);if(i)c.lineTo(x,y);else c.moveTo(x,y);}
      c.closePath();c.fill();
    },384,256);
    const flag=new T.PlaneGeometry(1,1,24,6),v=flag.attributes.position;
    for(let i=0;i<v.count;i++){const u=.5+v.getX(i),t=.5-v.getY(i);
      v.setXYZ(i,fx-.05+u*.90,9.30-t*1.63-.21*u*u+.09*Math.sin(8*u+t*.50)*u,fz-2.27*u+Math.sin(11*u+2*t)*.20*u);}
    v.needsUpdate=true;flag.computeVertexNormals();mesh(g,flag,new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:.96}));
    // White tapered survey-style pillar behind flag base, as visible in node7.
    const px=1.60,pz=-9.78;
    for(const [w,h,base,c] of [[1.18,.18,.36,0x955f42],[1.00,.54,.54,0xb2915d],[.75,.53,1.08,0x8a9390]]){
      box(g,c,px,base+h/2,pz,w,h,w,.22);
    }
    rod(g,0xe4dfc7,[px,1.60,pz],[px,1.95,pz],.53,.43,4).rotation.y=.99;
    rod(g,0xb48a72,[px,1.95,pz],[px,2.24,pz],.43,.35,4).rotation.y=.99;
    rod(g,0xe9e2cc,[px,2.24,pz],[px,2.54,pz],.35,.23,4).rotation.y=.99;
  }
  function barrier(S,g,points,y=.03){
    const {rod,box}=S;
    for(let i=1;i<points.length;i++){
      const [x,z]=points[i-1],[a,b]=points[i],dx=a-x,dz=b-z,n=Math.ceil(Math.hypot(dx,dz)/2.15);
      for(let j=0;j<n;j++){const t=j/n;box(g,0xa9a69c,x+dx*t,y+.43,z+dz*t,.16,.9,.16);}
      if(i===points.length-1)box(g,0xa9a69c,a,y+.43,b,.16,.9,.16);
      for(const h of [.34,.78])rod(g,0xb5b2a9,[x,y+h,z],[a,y+h,b],.064,.064,8);
    }
  }
  function pavilion(S,parent,x,z,angle,size){
    const {T,mesh,box,rod,face}=S,g=new T.Group();parent.add(g);g.position.set(x,0,z);g.rotation.y=angle;
    const w=size,d=size*.91,hw=w/2,hd=d/2,landing=1.10,edge=3.36,peak=4.43;
    box(g,post,0,landing-.13,0,w,.25,d);box(g,0xd5bb9f,0,landing+.018,0,w,.045,d);
    const p=[[hw,-hd],[-hw,-hd],[-hw,hd],[hw,hd]];
    for(const [a,b] of p){
      box(g,post,a*.91,(edge-.58)/2,b*.91,.235,edge+.58,.235);
      box(g,0xbc714a,a*.91,edge-.1,b*.91,.34,.18,.34);
    }
    for(const [a,b,c,e] of [[-hw,-hd,hw,-hd],[-hw,-hd,-hw,hd],[hw,-hd,hw,hd],[-hw,hd,-.81,hd],[.81,hd,hw,hd]]){
      const dx=c-a,dz=e-b,n=Math.ceil(Math.hypot(dx,dz)/.30);
      for(let j=0;j<=n;j++){
        const t=j/n;box(g,pale,(a+t*dx)*.94,landing+.42,(b+t*dz)*.94,.10,.75,.105);
      }
      rod(g,post,[a*.94,landing+.83,b*.94],[c*.94,landing+.83,e*.94],.08,.08,8);
    }
    const ex=hw+.54,ez=hd+.55,s=.27;
    const crown=[[-ex,edge,-ez],[ex,edge,-ez],[ex,edge,ez],[-ex,edge,ez],[-s,peak,0],[s,peak,0]];
    face(g,green,crown,[0,4,5,0,5,1,1,5,2,2,5,4,2,4,3,3,4,0]);
    for(const [a,b] of [[0,1],[1,2],[2,3],[3,0],[0,4],[1,5],[2,5],[3,4],[4,5]]){
      rod(g,0x28694e,crown[a],crown[b],a<4&&b<4?.053:.037);
    }
    face(g,0xd5c4a2,[[-ex,edge-.022,-ez],[ex,edge-.022,-ez],[ex,edge-.022,ez],[-ex,edge-.022,ez]],[0,1,2,0,2,3]);
    for(let i=0;i<6;i++){const t=(6-i)/6;box(g,post,0,t*landing/2,hd+.14+i*.254,1.64,t*landing,.255);}
    for(const side of [-1,1]){
      for(let j=0;j<6;j++){const zz=hd+j*.265;box(g,pale,.79*side,landing*(1-j/6)+.30,zz,.09,.64,.09);}
      rod(g,post,[.79*side,landing+.69,hd],[.79*side,.77,hd+1.40],.064);
    }
    return g;
  }
  function courtyard(S,g){
    const {T,slab,mesh,box}=S,light=pavement(T,true),dark=pavement(T,false);
    slab(g,apron,.0,-1.28,light,0xb4aa95);
    const inner=[[-7.25,1.08],[-1.88,-2.66],[2.46,-5.89],[2.49,-9.40],[.50,-10.66],[-4.79,-9.86],[-5.14,-5.37]];
    slab(g,upper,.315,.02,0xd2a361,0xb4a48c);slab(g,inner,.331,.31,dark,0x767877);
    const disc=mesh(g,new T.CircleGeometry(1.37,48),0xd4a260,-4.11,.342,-4.10);disc.rotation.x=-Math.PI/2;
    for(let i=0;i<4;i++)box(g,0xb58d59,-4.11+(i-1.5)*.48,.348,-4.1,.012,.004,Math.sqrt(1.37**2-((i-1.5)*.48)**2)*2);
    barrier(S,g,rail);plaque(S,g);flagAndPillar(S,g);
    const skirt=[];
    for(let i=0;i<apron.length;i++){
      const [x,z]=apron[i],[a,b]=apron[(i+1)%apron.length];
      const wall=S.face(g,0xa09685,[[x,-1,z],[a,-1,b],[a,-.25,b],[x,-.25,z]],[0,1,2,0,2,3]);
      skirt.push([wall,x,z,a,b]);
    }
    return (ground,level)=>{for(const [wall,x,z,a,b] of skirt){
      const geo=wall.geometry,p=geo.attributes.position;p.setY(0,Math.min(-1,ground(x,z)-level-.32));p.setY(1,Math.min(-1,ground(a,b)-level-.32));
      p.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();
    }};
  }
  // Outline of exposed granite traced on the imagery, from the upper stair to
  // the fractured rock at the eastern shore. The interior is generated stone
  // relief and grain. Nothing from the satellite or the VR has been republished.
  const rockOutline=[[-49,-69],[-15,-71],[7,-62],[30,-72],[52,-71],[53,-52],[56,-45],[55,-31],[67,-29],[76,-25],[91,-29],[103,-26],[107,-18],[101,-7],[92,2],[90,12],[101,15],[112,23],[97,31],[100,41],[92,49],[78,59],[68,56],[56,63],[40,58],[34,61],[14,66],[-2,74],[-16,85],[-29,92],[-40,89],[-35,70],[-25,54],[-27,34],[-33,20],[-25,7],[-13,3],[-13,-9],[-21,-18],[-33,-19],[-35,-34],[-42,-49]];
  const trail=[[-62,-81],[-56,-75],[-48,-71],[-39,-68],[-31,-62],[-29,-54],[-25,-48],[-30,-40],[-34,-34],[-29,-27],[-23,-23],[-18,-19],[-15.7,-16.1],[-15,-9.2],[-11.2,-6.6],[-8.5,-5.5],[-6.78,-2.50]];
  const boulders=[
    [1.2,-15.9,5.5,3.0,4.5,-.37],[-3.3,-16.9,3,2.5,2.2,.24],[5.3,-13.6,2.0,1.4,1.4,-.77],
    [10,-16.4,4.5,2.5,3.1,-.78],[13.8,-19.1,5.1,3.4,4.3,.26],[11.8,-26.6,6.8,4.3,4.2,-.64],
    [18,-34.2,7.1,4.0,5.9,-.51],[11.7,-40.4,3.7,2.6,4.1,-.41],[8.3,-47.9,7.1,3.5,5.1,.2],
    [-18.7,-6.7,2.5,1.55,2.55,.41],[-17.3,-11.4,2.3,1.7,1.6,.41],[-21.5,-13.0,2.3,2.75,2.1,.49],
    [-24.3,-18.4,3.2,2.7,2.6,-.29],[-21.6,-28.2,2.0,2.1,2.3,-.21],[-30.5,-38.5,3.1,3.0,2.7,.42],
    [-27.0,-41.3,4.1,3.8,3.8,-.85],[-21.0,-43.1,3.5,2.7,3.2,-.62],[-25.2,-46.2,2.4,3.2,3.3,-.65],
    [18.1,8.8,4.1,3.4,4.4,.52],[29.4,13.3,5.8,3.0,6.0,.73],[38,27.4,7.1,4.4,5.3,.79],
    [47,35.8,7.3,5.8,6.5,-.7],[52,41.7,9.3,6.7,9.5,-.7],[66,38,7.9,5.1,6.4,-.48],
    [74.2,41.2,10.3,6.1,6.8,-.51],[82,43.3,7.4,5.5,7.7,-.57],[82.4,29.1,5.7,5.0,8.1,-.7],
    [69,15,6.8,4.8,7.8,-.4],[70.4,-3.5,8.7,6.1,7.6,-.48],[79.1,-7,9.2,6.3,8.5,-.54],[93,-16.2,8.5,5.8,9.1,-.63],
    [43,-31,5.4,4.3,6.2,-.41],[50,-40.8,7.3,5.6,5.2,-.35],[34,-48,6.8,5.5,5.1,-.43]
  ];
  function inPoly(x,z,p){
    let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){
      const [a,b]=p[i],[c,d]=p[j];if((b>z)!==(d>z)&&x<(c-a)*(z-b)/(d-b)+a)inside=!inside;
    }return inside;
  }
  function rockTexture(T){
    const map=texture(T,(g,w,h)=>{
      const pixels=g.createImageData(w,h);
      for(let i=0;i<w*h;i++){
        const x=i%w,y=i>>8,gr=rand(i),p=rand((x>>2)+(y>>2)*64);
        const v=clamp(211+48*(gr-.5)+19*(p-.5)+(gr<.052?-53:gr>.91?27:0),88,251);
        pixels.data.set([v,v*.995,v*.979,255],i*4);
      }
      g.putImageData(pixels,0,0);
    },256,256);map.wrapS=map.wrapT=T.RepeatWrapping;
    const m=new T.MeshStandardMaterial({map,vertexColors:true,roughness:.96,side:T.DoubleSide});
    m.onBeforeCompile=s=>{
      s.vertexShader='varying vec3 grLocal;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ngrLocal=position;');
      s.fragmentShader=`varying vec3 grLocal;
      float rdHash(vec2 p){return fract(sin(dot(p,vec2(41.3,65.9)))*35691.545);}
      float rdNoise(vec2 p){vec2 q=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(rdHash(q),rdHash(q+vec2(1,0)),f.x),mix(rdHash(q+vec2(0,1)),rdHash(q+1.),f.x),f.y);}
      `+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 rp=grLocal.xz+vec2(.42,-.31)*grLocal.y;
      float n=rdNoise(rp*.65)+.5*rdNoise(rp*2.5)+.26*rdNoise(rp*6.0);
      float dark=rdNoise(rp*vec2(.54,.29)+.48*rdNoise(rp*1.31));
      float crack=1.-smoothstep(.014,.075,abs(sin(1.6*rp.x+.74*rp.y+.8*rdNoise(rp*.55))));
      diffuseColor.rgb*=.63+.40*n-.26*crack*rdNoise(rp*.32)-.20*smoothstep(.63,.88,dark);
      diffuseColor.rgb+=vec3(.030,.023,.014)*smoothstep(.63,.82,rdNoise(rp*3.67));`);
    };return m;
  }
  function granite(S,g){
    const {T,mesh}=S,m=rockTexture(T),v=[],uv=[],colors=[],idx=[],anchors=[];
    const low=new T.Color(0x837d70),high=new T.Color(0xcdbaa0),c=new T.Color();
    function vertex(x,y,z,t,anchor){
      const i=v.length/3;v.push(x,y,z);uv.push((x+y*.42)/1.65,(z+y*.32)/1.65);
      c.copy(low).lerp(high,clamp(t,0,1));colors.push(c.r,c.g,c.b);anchors.push(anchor);return i;
    }
    const plateau=[[-73,-91],[-6,-91],[18,-82],[39,-84],[51,-79],[53,-66],...rockOutline.slice(4,32),[-42,84],[-56,66],[-59,32],[-70,4],[-72,-26]];
    const cols=101,rows=94,stride=cols+1;
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const x=-75+i*1.9,z=-92+j*2.05;
      const shade=.44+.25*Math.sin(x*.15+z*.091)+.13*Math.cos(z*.35-x*.28)+.16*(rand(i+129*j)-.5);
      vertex(x,.083,z,shade,null);
      if(!inPoly(x,z,rockOutline)){
        const n=colors.length-3;c.set(0x435a34).lerp(new T.Color(0x788443),.35+.26*Math.sin(x*.42+z*.15));
        colors[n]=c.r;colors[n+1]=c.g;colors[n+2]=c.b;
      }
      if(!i||!j||!inPoly(x-.94,z-1.02,plateau))continue;
      const n=j*stride+i;idx.push(n-stride-1,n-1,n,n-stride-1,n,n-stride);
    }
    for(const [b,params] of boulders.entries()){
      const [cx,cz,w,h,d,yaw]=params,start=v.length/3,a=.40+.21*rand(b),cos=Math.cos(yaw),sin=Math.sin(yaw),seq=14;
      for(const [j,[t,f]] of [[-2.0,.70],[.17,1],[.57,.93],[.87,.80],[1.01,.48],[1.04,.07]].entries()){
        for(let n=0;n<seq;n++){
          const angle=n/seq*Math.PI*2,xx=Math.cos(angle),zz=Math.sin(angle),fuzz=.91+.14*rand(n+b*59)+.045*Math.sin(n+j);
          const tx=Math.sign(xx)*Math.abs(xx)**a*w*f*fuzz,tz=Math.sign(zz)*Math.abs(zz)**a*d*f*fuzz;
          const x=cx+tx*cos+tz*sin,z=cz-tx*sin+tz*cos;
          const y=h*(t+.07*Math.sin(angle*3.2+b)+(.12+.12*Math.sin(b))*xx+(.02+.13*Math.cos(b+1))*zz);
          vertex(x,y,z,.44+.40*t+.08*Math.cos(2*angle),[cx,cz]);
          if(j){const cur=start+j*seq+n,nxt=start+j*seq+(n+1)%seq;idx.push(cur-seq,cur,nxt,cur-seq,nxt,nxt-seq);}
        }
      }
      for(let i=1;i<seq-1;i++)idx.push(start+5*seq,start+5*seq+i+1,start+5*seq+i);
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(idx);
    geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.computeVertexNormals();
    const r=mesh(g,geo,m);r.name='Dải granit nứt nẻ quanh mỏm Rạng Đông';
    // Vertical granite faces close the cut edge where the cliff meets the sea.
    const wallVertices=[],wallUv=[],wallColors=[],wallIndex=[],wallBases=[];
    for(let i=0;i<plateau.length;i++){
      const [ax,az]=plateau[i],[bx,bz]=plateau[(i+1)%plateau.length],run=Math.hypot(bx-ax,bz-az),n=Math.ceil(run/1.2);
      for(let j=0;j<=n;j++){
        const t=j/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t,start=wallBases.length;
        for(let row=0;row<2;row++){
          wallVertices.push(x,0,z);wallUv.push(t*run*.42,row*4.0);wallBases.push([x,z,row]);
          c.set(row?0xb9a98e:0x726e61).multiplyScalar(.85+.25*rand(start+13));wallColors.push(c.r,c.g,c.b);
        }
        if(j)wallIndex.push(start-2,start,start+1,start-2,start+1,start-1);
      }
    }
    const wall=new T.BufferGeometry();wall.setAttribute('position',new T.Float32BufferAttribute(wallVertices,3));wall.setAttribute('color',new T.Float32BufferAttribute(wallColors,3));
    wall.setAttribute('uv',new T.Float32BufferAttribute(wallUv,2));wall.setIndex(wallIndex);wall.computeVertexNormals();mesh(g,wall,m);
    return (ground,original)=>{const p=geo.attributes.position;
      for(let i=0;i<p.count;i++){const a=anchors[i];p.setY(i,v[i*3+1]+(a?ground(a[0],a[1]):ground(v[i*3],v[i*3+2])));}
      p.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();
      const side=wall.attributes.position;wallBases.forEach(([x,z,top],i)=>side.setY(i,top?ground(x,z)+.07:original(x,z)-1.5));
      side.needsUpdate=true;wall.computeVertexNormals();wall.computeBoundingSphere();
    };
  }
  // Independent sampled elevation, metres above sea level, every 15 m. AWS
  // Terrain Tiles z14, bilinear pixels, checked 2026-11-23. The regional game
  // raster gives only ~7 m at the sign and places much of the mapped promontory
  // under water; the independent grid gives ~33 m here.
  // https://registry.opendata.aws/terrain-tiles/
  const elevation=[
    [75,71,66,57,45,32,18,6,-1,-2,7,12,9],[71,68,62,53,42,32,21,10,1,-2,7,12,8],[68,64,58,50,40,32,23,13,4,0,7,11,8],
    [64,61,56,50,42,33,24,15,7,3,7,11,8],[59,56,53,49,42,33,23,15,9,4,7,10,7],[54,51,48,45,39,31,20,13,9,5,7,9,7],
    [50,46,42,38,33,25,16,10,6,3,6,9,6],[44,39,34,29,24,19,12,7,4,2,5,8,6],[39,32,26,20,17,14,11,7,4,2,5,7,5],
    [33,25,18,14,12,12,10,8,5,3,5,7,5],[28,19,13,10,10,10,10,8,5,3,5,6,4],[24,16,10,7,8,9,9,7,5,3,4,5,4],
    [23,15,9,6,5,7,7,6,5,3,4,5,3]
  ];
  function relief(x,z){
    const col=clamp((x+60)/15,0,11.999),row=clamp((z+90)/15,0,11.999),i=Math.floor(col),j=Math.floor(row),t=col-i,u=row-j;
    return (1-u)*(elevation[j][i]*(1-t)+elevation[j][i+1]*t)+u*(elevation[j+1][i]*(1-t)+elevation[j+1][i+1]*t);
  }
  function grass(S,g){
    const {T,mesh}=S,pos=[],col=[],idx=[],anchors=[];let v=0;
    for(let i=0;i<4000;i++){
      const x=rand(i+70)*83-54,z=rand(i+15000)*89-62,zone=Math.sin(x*.22+z*.26)+.68*Math.sin(x*.53-z*.36);
      if((x>-15&&x<5&&z>-13&&z<5)||x>14||((x>-22&&x<14)&&zone<.92)||zone<-.12)continue;
      if(trail.some(([a,b])=>Math.hypot(x-a,z-b)<1.8))continue;
      const start=v;for(let j=0;j<7;j++){
        const a=j*.89+5*rand(i+270),r=.34+.27*rand(6*i+j),dx=Math.sin(a),dz=Math.cos(a),h=.25+.45*rand(9*i+j),sx=dz*.047,sz=-dx*.047;
        pos.push(x+sx,0,z+sz,x-sx,0,z-sz,x+dx*r,h,z+dz*r);idx.push(v,v+1,v+2);v+=3;
        const c=new T.Color().setHSL(.214+.037*rand(4*i+j),.42,.22+.13*rand(3*i+j));
        for(const f of [.72,.82,1.51])col.push(c.r*f,c.g*f,c.b*f);
      }
      anchors.push([start,v,x,z]);
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('color',new T.Float32BufferAttribute(col,3));geo.setIndex(idx);geo.computeVertexNormals();
    const m=mesh(g,geo,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.99}));m.castShadow=false;
    return ground=>{const p=geo.attributes.position;
      for(const [start,end,x,z] of anchors){const y=ground(x,z)+.06;for(let i=start;i<end;i++)p.setY(i,y+pos[3*i+1]);}
      p.needsUpdate=true;geo.computeBoundingSphere();
    };
  }
  function trailSurface(S,g){
    const {T,face}=S,mat=pavement(T,true),items=[];
    for(let i=1;i<trail.length;i++){
      const [a,b]=trail[i-1],[c,d]=trail[i],len=Math.hypot(c-a,d-b),count=Math.ceil(len/.47);
      const nx=(d-b)/len*.75,nz=(a-c)/len*.75;
      for(let j=0;j<count;j++){
        const t=j/count,u=(j+1)/count,x=a+(c-a)*t,z=b+(d-b)*t,endX=a+(c-a)*u,endZ=b+(d-b)*u;
        const m=face(g,mat,[[x+nx,0,z+nz],[x-nx,0,z-nz],[endX-nx,0,endZ-nz],[endX+nx,0,endZ+nz]],[0,1,2,0,2,3],[[0,0],[.65,0],[.65,.20],[0,.20]]);
        const riser=face(g,0xa29982,[[endX-nx,0,endZ-nz],[endX+nx,0,endZ+nz],[endX+nx,-.52,endZ+nz],[endX-nx,-.52,endZ-nz]],[0,1,2,0,2,3]);
        items.push([m,riser,x,z,endX,endZ]);
      }
    }
    return ground=>{for(const [m,r,x,z,a,b] of items){m.position.y=r.position.y=Math.max(ground(x,z),ground(a,b))+.14;}};
  }
  const view=(name,tx,tz,focus,ex,ez,eye,fov)=>{
    const dx=ex-tx,dz=ez-tz,dy=eye-focus,r=Math.hypot(dx,dz);
    return {name,offset:[tx,tz],height:focus/.46,viewBase:'monument',viewRadius:Math.hypot(r,dy),viewAngle:Math.atan2(dx,dz),viewElevation:Math.atan2(dy,r),viewFov:fov};
  };
  const views=[
    {...view('Bia đón bình minh trên mỏm Rạng Đông',-.46,-.79,1.63,-4.92,-3.17,2.12,66),description:'Từ sân lát đá nhìn về phía biển, vầng mặt trời tròn nhô khỏi hai mép bia uốn cong.'},
    {...view('Sân chào cờ nhìn từ lối xuống',-3.80,-2.60,3.65,-14.10,-8.30,4.8,69),description:'Lối đi bộ xuống giữa các khối granit. Chòi mái xanh, sân chào cờ và bia nằm thấp hơn ở phía biển.'},
    {...view('Từ chòi mái xanh nhìn qua bia ra biển',.5,-2.7,1.22,-10.52,-.85,1.81,66),description:'Từ chòi ở đầu sân, nhìn qua cột cờ, bệ bia và lan can ra mặt biển phía đông.'}
  ];
  function build(T,k){
    const S=painter(T),yard=new T.Group();k.group.add(yard);const retaining=courtyard(S,yard);
    const roof=pavilion(S,k.group,-10.94,.05,2.20,4.35);
    const upperRoof=pavilion(S,k.group,-36.6,-34.7,2.26,4.70);
    const stone=granite(S,k.group),path=trailSurface(S,k.group),cover=grass(S,k.group);
    k.group.userData.fitGround=ground=>{
      // The world waterplane is at zero; offshore raster samples are seabed.
      const sea=-k.group.position.y,level=sea+32.72;
      const local=(x,z)=>{
        const native=ground(x,z),west=-71+Math.max(0,z+25)*.23;
        const fade=clamp(Math.min((x-west)/21,(z+87)/20),0,1);
        const approach=clamp((Math.hypot((x+4.8)*.82,(z+4)*.90)-6.3)/6.8,0,1);
        const shelf=sea+relief(x,z)+(Math.sin(.21*x+.18*z)*.22+Math.cos(.56*z-.27*x)*.13);
        return Math.max(native,native+(Math.min(level-.12,shelf)*(1-approach)+shelf*approach-native)*fade);
      };
      stone(local,ground);path(local);cover(local);
      yard.position.y=level;retaining(local,level);roof.position.y=level-.79;upperRoof.position.y=local(-36.6,-34.7);
      const sourceEyes=[[-4.92,-3.17,2.12,-.46,-.79,1.63,66],[-14.10,-8.30,1.78,-3.80,-2.60,3.65,69],[-10.52,-.85,1.50,.50,-2.70,1.22,66]];
      for(let i=0;i<3;i++){const [x,z,y,tx,tz,focus,fov]=sourceEyes[i],eye=i===1?local(x,z)+y:i===2?roof.position.y+1.1+y:level+y;
        Object.assign(views[i],view(views[i].name,tx,tz,level+focus,x,z,eye,fov));}
    };
  }
  (window.VietnamSights??=[]).push({...pin,id,catalogId,name:'Bia đón bình minh trên mỏm Rạng Đông',kind:'Điểm ngắm cảnh',
    locality:'Mũi Điện',formerProvince:'Phú Yên',lon:109.457759,lat:12.895377,start:[109.4491036,12.8939039],yaw:0,
    mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,width:23,depth:28,viewDistance:1450,
    boundary:[[-18,-9],[-10,-23],[10,-21],[8,3],[-12,5]],reserve:(x,z,r)=>x>-17-r&&x<8+r&&z>-17-r&&z<5+r,
    modeledBuildings:['w909061438'],solids:[[0,0,1.1,1.6],[-1.86,-5.18,1.1,1.1]],source,photo:field,
    map:'https://www.openstreetmap.org/?mlat=12.895377&mlon=109.457759#map=19/12.895377/109.457759',
    description:'Lối bậc từ khu hải đăng xuống mỏm Rạng Đông dẫn đến sân chào cờ trên nền granit. Bia đá có mặt trời tròn, hai mặt ghi tên Mũi Điện và Mũi Đại Lãnh. Từ chòi sát sân nhìn qua bia là Biển Đông.',
    arrivalNote:'Xe dừng ở khu vé Bãi Môn. Qua cầu rồi đi bộ theo lối bậc lên núi. Tại ngã rẽ gần hải đăng, theo nhánh xuống mỏm Rạng Đông.',views,build});
})();

export default window.VietnamSights;
