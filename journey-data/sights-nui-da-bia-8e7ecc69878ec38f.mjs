const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const id='nui-da-bia-deo-ca',catalogId='osm-node-4510077892';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Thiếu ghim Núi Đá Bia');
  const source='https://phuyen.baodaklak.vn/89/196852/mua-xuan-len-dinh-thach-bi-son.html';
  const vr='https://daklakvrtour.com/tour/115/index.html';
  // Survey 2026-11-23. OSM n4510077892 denotes the mountain. The outcrop
  // below is independently registered on two overheads; uncertainty ~10–20 m.
  // Two located provincial panoramas constrain the outline especially well:
  // node2 [109.398732,12.897972] from S, node4 [109.397373,12.897679] from SW.
  // Source for the 76 m rock, ~706 m peak and mixed stone/concrete foot trail:
  // https://phuyen.baodaklak.vn/89/196852/mua-xuan-len-dinh-thach-bi-son.html
  // https://vietnamtourism.vn/index.php/tourism/items/1372
  // For the split face, base boulders, stairs and four geolocated walk markers:
  // https://www.vietnamcoracle.com/nui-da-bia-mountain-hike/
  // https://www.google.com/maps/d/viewer?mid=1MDwOXxsIJdkKvpZ6s4RTR0jZVny1mXE
  // The portal, parking and QL1 hairpin are ~1.65 km SSW as the crow flies.
  // Only the identifiable last flight is represented, not a guessed full trail.
  const tau=Math.PI*2,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const smooth=(x,a,b)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
  const random=n=>{const f=Math.sin(n*17.4431+94.17)*43758.5453;return f-Math.floor(f);};
  const delta=(x,y)=>Math.atan2(Math.sin(x-y),Math.cos(x-y));
  const localTrail=[[-100,56],[-84,51],[-75,44],[-68,43],[-62,38],[-58,33],[-49,31],[-43,30],[-39,25],[-37,23],[-34,19],[-31,17]];
  // Albedo only: seamless granite grain made here; no photographic pixels.
  let grain;
  function mineral(T){
    if(!grain){
      const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
      const ctx=canvas.getContext('2d'),im=ctx.createImageData(256,256);
      for(let i=0;i<256*256;i++){
        const x=i%256,y=i>>8,n=random(i),p=random((x>>1)+(y>>1)*128);
        const grey=clamp(235+43*(n-.5)+12*(p-.5)+(n>.94?29:n<.051?-34:0),110,255);
        im.data.set([grey,grey*.992,grey*.983,255],4*i);
      }
      ctx.putImageData(im,0,0);grain=new T.CanvasTexture(canvas);
      grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.anisotropy=4;grain.colorSpace=T.SRGBColorSpace;grain.userData.sightShared=true;
    }
    const m=new T.MeshStandardMaterial({map:grain,vertexColors:true,side:T.DoubleSide,roughness:1});
    // Pale feldspar and mica break up the dark vertical rain stains. Sample in
    // local metres so the grain is continuous around the fractured faces.
    m.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec3 biaRockPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbiaRockPoint=position;');
      shader.fragmentShader=`varying vec3 biaRockPoint;
        float biaHash(vec2 q){vec3 p=fract(vec3(q.xyx)*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
        float biaNoise(vec2 q){vec2 b=floor(q),f=fract(q);f=f*f*(3.-2.*f);
          return mix(mix(biaHash(b),biaHash(b+vec2(1,0)),f.x),mix(biaHash(b+vec2(0,1)),biaHash(b+vec2(1,1)),f.x),f.y);}
        float biaField(vec2 p){return .50*biaNoise(p)+.29*biaNoise(p*2.06+13.2)+.15*biaNoise(p*4.17-3.2)+.06*biaNoise(p*8.50);}
        `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec2 stoneUV=vec2(biaRockPoint.x*.89+biaRockPoint.z*.44,biaRockPoint.y);
          float flow=biaField(stoneUV*vec2(.40,.051)+vec2(.51,.16)*biaNoise(stoneUV*.141));
          float mottle=biaField(stoneUV*.72+.58*biaNoise(stoneUV*1.63));
          float coarse=biaField(stoneUV*vec2(.29,.16));
          float grainPatch=biaNoise(stoneUV*4.61+12.9*mottle);
          float pale=smoothstep(.40,.68,flow+.32*(mottle-.5))*.58+.42*smoothstep(.45,.67,mottle);
          float stains=smoothstep(.43,.66,coarse)*smoothstep(.44,.65,flow)*smoothstep(.26,.62,mottle);
          diffuseColor.rgb*=.81+.27*pale+.15*mottle-.38*stains;
          diffuseColor.rgb+=vec3(.064,.070,.057)*pale+vec3(.025,.029,.023)*smoothstep(.56,.78,grainPatch)*smoothstep(.48,.62,mottle);`);
    };
    return m;
  }
  function geom(T,group,material,coords,colors,uv,indices,name){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(coords,3));
    if(colors)g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    if(uv)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    g.setIndex(indices);g.computeVertexNormals();const m=new T.Mesh(g,material);
    m.name=name;m.castShadow=true;m.receiveShadow=true;group.add(m);return m;
  }
  // Cross-sections in metres in the east / south frame. The steep, comparatively
  // flat S–W wall turns into an irregular cleft crown and a long rounded back.
  // The southeast upper lip overhangs the foot as it does in both panoramas.
  const sections=[
    [-11,-2,-1,19.5,22.8],[-1,-2,-2,20.6,24.3],[6,-2,-2.5,21.6,24.7],
    [14,-1.8,-2.6,22.4,24.8],[24,-.1,-2.1,21.9,24.3],[38,1.3,-.9,21.0,21.2],
    [51,3.8,1.3,19.0,17.9],[60,6.2,3.0,17.1,15.8],[67,8.4,4.7,14.8,13.4],
    [71,9.5,5.3,13.5,11.2],[74,10.0,6.0,12.2,9.3],[75.2,10.3,6.0,10.4,7.0]
  ];
  function section(h){
    let i=1;
    while(i<sections.length-1&&h>sections[i][0])i++;
    const a=sections[i-1],b=sections[i],v=clamp((h-a[0])/(b[0]-a[0]),0,1);
    return a.map((d,j)=>d+(b[j]-d)*v);
  }
  function mainRock(T,k,mat){
    const pos=[],rgb=[],uv=[],indices=[],heights=[],segments=172,levels=88;
    const tint=new T.Color(),deep=new T.Color(0x918d87),pale=new T.Color(0xc6c6b7),wet=new T.Color(0x71736a);
    for(let j=0;j<=levels;j++)for(let i=0;i<=segments;i++){
      const a=(i%segments)*tau/segments,t=j/levels;
      const west=Math.max(0,-Math.sin(a)),north=Math.max(0,-Math.cos(a));
      const crownNotch=3.2*Math.exp(-((delta(a,-.92)/.23)**2));
      const crown=75.3-13.8*west**2-7.1*north**2-crownNotch+.51*Math.sin(a*5+.4);
      const h=-11+(crown+11)*t,altern=section(h);
      const [,cx,cz,w,d]=altern,ss=Math.sin(a),cc=Math.cos(a);
      const tx=Math.sign(ss)*Math.abs(ss)**.81,tz=Math.sign(cc)*Math.abs(cc)**(cc>0?.43:.74);
      const bevel=.45*Math.sin(3*a+.25)+.42*Math.cos(5*a-.43)+.20*Math.sin(8*a+.09*h);
      let grooves=0,scorch=0;
      // Deep, broken sheet joints seen on the S/SW face and a paired northern cleft.
      for(const [angle,depth,width,lo,hi,bend] of [[-.82,2.1,.034,3,69,.21],[-1.43,1.1,.039,7,52,-.13],
        [.37,1.05,.029,1,46,.10],[-.31,.69,.023,0,33,-.10],[2.32,2.5,.055,12,70,-.18],[2.89,1.76,.043,30,75,.13],
        [-2.37,1.81,.060,17,61,-.14],[.94,.65,.028,20,72,.11]]){
        const d=delta(a,angle+bend*(h/76-.5)+.026*Math.sin(h*.14+angle));
        const f=Math.exp(-((d/width)**2))*smooth(h,lo-4,lo+2)*(1-smooth(h,hi-2,hi+2));
        grooves+=depth*f;scorch+=.42*f;
      }
      const plateLine=60.5+15.8*Math.sin(a+.16),plateDelta=h-plateLine;
      const flake=Math.exp(-((plateDelta/.56)**2))*Math.max(cc,0)*smooth(h,44,63);
      grooves+=.72*flake;scorch+=.43*flake;
      const sag=1.65*Math.exp(-((delta(a,.015)/.48)**2))*Math.sin(Math.PI*clamp((h+2)/75,0,1));
      const x=cx+(w+bevel-grooves-sag)*tx,z=cz+(d+bevel*.62-grooves-sag)*tz;
      const col=.50+.17*Math.sin(a*3.8+h*.026)+.12*Math.cos(a*12.0-h*.041)
        +.085*Math.sin(a*27+Math.sin(h*.037+a*3))+.05*Math.cos(a*64-h*.039)+.046*Math.sin(h*.167+2*a);
      const runoff=.21*smooth(h,13,64)*Math.max(0,Math.sin(a*38+.45*Math.cos(h*.053)))**4;
      tint.copy(deep).lerp(pale,clamp(col+Math.max(cc,0)*.12,0,1)).lerp(wet,clamp(runoff+scorch,0,.68));
      pos.push(x,h,z);heights.push(h);rgb.push(tint.r,tint.g,tint.b);uv.push(i/segments*40,h*.36);
      if(j&&i){const b=j*(segments+1)+i;indices.push(b-1,b-segments-2,b-segments-1,b-1,b-segments-1,b);}
    }
    const cap=pos.length/3;pos.push(10.4,74.86,5.9);heights.push(74.86);tint.set(0xa29e8d);
    rgb.push(tint.r,tint.g,tint.b);uv.push(20,27);
    for(let i=0;i<segments;i++)indices.push(levels*(segments+1)+i+1,cap,levels*(segments+1)+i);
    const rock=geom(T,k.group,mat,pos,rgb,uv,indices,'Phiến granit Đá Bia');
    return ground=>{
      const g=rock.geometry,p=g.attributes.position;
      for(let i=0;i<p.count;i++){
        const h=heights[i];p.setY(i,h+ground(p.getX(i),p.getZ(i))*(1-smooth(h,-7,15)));
      }
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
    };
  }
  // One rounded but joint-bounded block on the top plus the separate apron blocks
  // visible below the tall face. Localization of the small fragments is approximate.
  function blocks(T,k,mat){
    const pos=[],col=[],uv=[],indices=[],groundPoints=[],tint=new T.Color(),lightBlock=new T.Color(0xb9baaa);
    function lump(x,z,rx,rz,h,y,angle,seed,grounded=true){
      const off=pos.length/3,na=26,ny=16,c=Math.cos(angle),s=Math.sin(angle);
      for(let j=0;j<=ny;j++)for(let i=0;i<=na;i++){
        const a=(i%na)*tau/na,v=j/ny,phi=(v-.50)*Math.PI;
        const rr=Math.cos(phi),ss=Math.sin(a),cc=Math.cos(a),vpos=Math.sin(phi);
        const fac=(1+.056*Math.sin(3*a+seed)+.032*Math.cos(5*a-seed+.9*v))*(1-.11*v);
        const u=Math.sign(ss)*Math.abs(ss)**.58*rr**.67*rx*fac,vv=Math.sign(cc)*Math.abs(cc)**.63*rr**.59*rz*fac;
        const cut=clamp(u/rx+.58*vv/rz,-1.10,.97),flatU=clamp((cut-.58*vv/rz)*rx,-.94*rx,.95*rx);
        const flatV=Math.min(vv,.87*rz+flatU*.13);const px=x+flatU*c+flatV*s,pz=z-flatU*s+flatV*c;
        const tilt=(.12+.14*Math.sin(seed))*flatU+(.04+.11*Math.cos(seed))*flatV;
        const py=y+h*(.385+.67*clamp(Math.sign(vpos)*Math.abs(vpos)**.67,-1,.94)) + tilt;
        pos.push(px,py,pz);groundPoints.push([x,z,py,grounded,1-smooth(v,.14,.49)]);uv.push(i/na*(rx+rz)*.61,py*.37);
        tint.set(0x9f968c).lerp(lightBlock,.25+.21*Math.sin(a*3+.09*py+seed)+.12*Math.cos(a*9+.06*py));
        tint.multiplyScalar(.94+.079*Math.sin(a*16+seed+v*.41));col.push(tint.r,tint.g,tint.b);
        if(i&&j){const b=off+j*(na+1)+i;indices.push(b-1,b-na-2,b-na-1,b-1,b-na-1,b);}
      }
    }
    // The loose crown cap is offset west of the upright upper lip (node2 face 0).
    lump(-2.0,1.3,9.4,8.6,10.25,65.5,-.33,11,false);
    for(const b of [[-17,8,6,7,19,0,-.4,8],[-20,17,5,6,7,0,-.67,73],[-14,26,5.9,3.5,5.2,0,-.75,16],
      [-4,27,3.8,5.7,11.0,-1,.25,74],[7,27.5,4.3,4.5,11.5,-1,.41,37],[18.8,16,7.2,7.1,24.6,-1,-.3,65],
      [24.2,8,5.8,7.2,13.7,-.5,.24,23],[27,-.7,6.2,8.2,12.2,-1,-.49,51],[30,11,5.5,7.5,9,-1,-.6,57],
      [33.4,23.2,4.6,6.2,6.8,-1,-.36,62],[-27,13,5.8,6.7,4.9,-.5,-.68,81],[-28.8,21.5,5.4,3.6,3.3,0,.44,92],
      [-34,24,4,4.6,2.6,-.5,-.21,82],[-22,31.2,2.8,4.9,5.1,0,.36,19],[-12.2,-18,10,7.4,16,-2,-.9,71],
      [-.8,-24,8,9,11.7,-1,.1,40],[4.7,-28,5,6,6.5,-.7,.52,55],[-37,13,4.2,4.8,2.5,0,.3,76],
      [-37,3,4.1,4.4,2.8,0,-.5,37],[-50,8,5.8,5.2,4.2,-.3,-.51,85],[18,-74,9.6,10.6,13.6,0,-.31,16],
      [16,-84,7.8,6.0,9.7,0,.14,43],[24,-86,6.7,8.5,10.6,-.3,-.4,64],[31,-86,5.9,6.0,7.9,-.6,.44,17],
      [5,-82,4.7,8.5,5.0,-.4,-.28,24],[-34,59,4.3,3.5,2,0,.27,32]])lump(...b);
    const mesh=geom(T,k.group,mat,pos,col,uv,indices,'Chóp đá và các khối vỡ quanh chân');
    return ground=>{
      const g=mesh.geometry,p=g.attributes.position,levels=new Map();
      for(let i=0;i<p.count;i++){const [x,z,h,grounded,foot]=groundPoints[i];if(!grounded)continue;
        const key=x*100+z;if(!levels.has(key))levels.set(key,ground(x,z));const centre=levels.get(key);
        p.setY(i,h+centre+foot*(ground(p.getX(i),p.getZ(i))-centre));}
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
    };
  }
  function trail(T,k,mat){
    const coords=[],rgb=[],uv=[],index=[],adjust=[];const color=new T.Color(),samples=[];
    for(let i=1;i<localTrail.length;i++){
      const [x,z]=localTrail[i-1],[ex,ez]=localTrail[i],d=Math.hypot(ex-x,ez-z);
      const count=Math.max(1,Math.round(d/.48));
      for(let j=0;j<count;j++)samples.push([x+(ex-x)*j/count,z+(ez-z)*j/count]);
    }
    samples.push(localTrail.at(-1));
    function face(points,col){
      color.set(col);const b=coords.length/3;
      for(const [x,h,z,ax,az] of points){
        coords.push(x,h,z);adjust.push([h,ax,az]);rgb.push(color.r,color.g,color.b);uv.push((x+z)*.51,h*.6+z*.11);
      }
      index.push(b,b+2,b+1,b,b+3,b+2);
    }
    for(let i=1;i<samples.length;i++){
      const [ax,az]=samples[i-1],[bx,bz]=samples[i],length=Math.hypot(bx-ax,bz-az);
      const sx=(bz-az)/length,sz=(ax-bx)/length,mx=(ax+bx)/2,mz=(az+bz)/2;
      const w=.71+.11*random(i+246),top=.15+.035*random(i+81);
      const point=(x,z,side,h)=>[x+sx*w*side,h,z+sz*w*side,mx,mz];
      const front=[point(ax,az,-1,top),point(ax,az,1,top)];
      const end=[point(bx,bz,1,top),point(bx,bz,-1,top)];
      face([...front,...end],i%6===2?0xaaa38b:i%7===1?0x8d8673:0x9e9984);
      face([front[0],point(ax,az,-1,-.48),point(ax,az,1,-.48),front[1]],0x897d6b);
      for(const side of [-1,1])face([point(ax,az,side,top),point(bx,bz,side,top),point(bx,bz,side,-.46),point(ax,az,side,-.46)],0x8b8472);
    }
    const stair=geom(T,k.group,mat,coords,rgb,uv,index,'Đoạn bậc cuối lên Thạch Bi Sơn');
    // Weathered concrete handrails have open spans and square sloping posts.
    const traces=[],posts=[],railMat=new T.MeshStandardMaterial({color:0x9e9c8b,roughness:.98});
    for(const side of [-1,1]){
      const pts=[];
      for(let i=15;i<samples.length-12;i+=5){
        const [x,z]=samples[i],[bx,bz]=samples[i+1],d=Math.hypot(bx-x,bz-z),sx=(bz-z)/d,sz=(x-bx)/d;
        pts.push([x+sx*side*.82,z+sz*side*.82,bx+sx*side*.82,bz+sz*side*.82]);
      }
      for(let i=0;i<pts.length;i++){const [x,z,ex,ez]=pts[i];posts.push([x,z,.05,ex,ez,.86,.115]);
        if(i){const [,,px,pz]=pts[i-1];traces.push([px,pz,.89,ex,ez,.89,.125]);}}
    }
    const bars=[...posts,...traces],beam=new T.InstancedMesh(new T.BoxGeometry(1,1,1),railMat,bars.length);
    beam.name='Lan can bê tông của đoạn bậc cuối';beam.castShadow=beam.receiveShadow=true;k.group.add(beam);
    const up=new T.Vector3(0,1,0),tmp=new T.Object3D(),va=new T.Vector3(),vb=new T.Vector3();
    return ground=>{
      const g=stair.geometry,p=g.attributes.position;
      for(let i=0;i<p.count;i++){const [y,x,z]=adjust[i];p.setY(i,ground(x,z)+y);}
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
      bars.forEach(([x,z,y,ex,ez,ey,w],i)=>{
        va.set(x,ground(x,z)+y,z);vb.set(ex,ground(ex,ez)+ey,ez);
        tmp.position.copy(va).add(vb).multiplyScalar(.5);const length=vb.distanceTo(va);
        tmp.quaternion.setFromUnitVectors(up,vb.sub(va).normalize());tmp.scale.set(w,length,w);tmp.updateMatrix();beam.setMatrixAt(i,tmp.matrix);
      });
      beam.instanceMatrix.needsUpdate=true;beam.computeBoundingSphere();
    };
  }
  function summitGrass(T,k){
    const points=[],cols=[],idx=[],anchors=[],tint=new T.Color(),leaf=new T.Color();
    const near=new T.Group(),lod=new T.LOD();lod.addLevel(near,0);lod.addLevel(new T.Group(),320);k.group.add(lod);
    function blades(x,z,n){
      const g=points.length/3;anchors.push([g,x,z]);
      const rise=.40+random(n+357)**2*1.17,dir=random(n+19)*tau,r=.31+.39*random(n+562);
      tint.set(0x748149).lerp(leaf.set(0x405f3e),random(n+449));leaf.set(0x9da34f);
      for(let b=0;b<7;b++){
        const a=dir+2.39996*b,dx=Math.sin(a),dz=Math.cos(a),h=rise*(.58+.42*random(n+b*24)),w=.062+h*.047;
        const spread=r*(.62+.47*random(n+b*53)),off=points.length/3;
        const shape=[[0,0,.08],[w*.45,h*.26,.22],[w,h*.56,.46],[0,h*.87,1.04],[-w*.78,h*.45,.42],[-w*.38,h*.18,.15]];
        for(let j=0;j<shape.length;j++){
          const [u,v,d]=shape[j];points.push(x+dx*spread*d+dz*u,v,z+dz*spread*d-dx*u);
          const c=tint.clone().lerp(leaf,.2+.22*v/h);cols.push(c.r,c.g,c.b);
        }
        idx.push(off,off+1,off+5,off+1,off+2,off+4,off+1,off+4,off+5,off+2,off+3,off+4);
      }
    }
    function trailDistance(x,z){
      let dist=Infinity;
      for(let i=1;i<localTrail.length;i++){
        const [a,b]=localTrail[i-1],[c,d]=localTrail[i],dx=c-a,dz=d-b,t=clamp(((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz),0,1);
        dist=Math.min(dist,Math.hypot(x-a-t*dx,z-b-t*dz));
      }
      return dist;
    }
    // The summit is an open cap covered in low brush and grass. Transition
    // from it to the taller tree line below the ridge on the native DEM.
    const coverPos=[],coverCol=[],coverUV=[],coverIdx=[],foot=[],grid=58,rows=65;
    const lo=new T.Color(0x60964e),hi=new T.Color(0xa5bd68);const spreadX=106,spreadZ=117;
    for(let j=0;j<=rows;j++)for(let i=0;i<=grid;i++){
      const x=(i/grid*2-1)*spreadX,z=(j/rows*2-1)*spreadZ-4;
      const nx=x/spreadX,nz=(z+4)/spreadZ,dist=Math.hypot(nx+.16*nz,nz);
      const mask=1-smooth(dist+.018*Math.sin(x*.11+z*.086),.75,1);
      const texture=.50+.17*Math.sin(x*.14+z*.12)+.12*Math.sin(x*.39-z*.233)+.10*Math.cos(z*.43+x*.1);
      const tint=lo.clone().lerp(hi,texture);coverPos.push(x,.096,z);coverCol.push(tint.r,tint.g,tint.b,mask);
      coverUV.push(x/5.7,z/5.7);foot.push([x,z]);
      if(i&&j){const b=j*(grid+1)+i;coverIdx.push(b-grid-2,b-1,b,b-grid-2,b,b-grid-1);}
    }
    const coverGeo=new T.BufferGeometry();coverGeo.setAttribute('position',new T.Float32BufferAttribute(coverPos,3));
    coverGeo.setAttribute('color',new T.Float32BufferAttribute(coverCol,4));coverGeo.setAttribute('uv',new T.Float32BufferAttribute(coverUV,2));
    coverGeo.setIndex(coverIdx);coverGeo.computeVertexNormals();
    const tex=new T.TextureLoader().load('streetscape/surfaces/meadow-color.webp');tex.wrapS=tex.wrapT=T.RepeatWrapping;
    tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
    const bed=new T.Mesh(coverGeo,new T.MeshStandardMaterial({map:tex,vertexColors:true,roughness:1,transparent:true,depthWrite:false,side:T.DoubleSide}));
    bed.name='Thảm cỏ bụi trên đỉnh Đá Bia';bed.receiveShadow=true;near.add(bed);
    for(let i=0;i<3700;i++){
      const x=(random(i+39)-.50)*158,z=(random(i+8091)-.50)*175;
      const ed=(x/79)**2+((z-2)/88)**2,space=trailDistance(x,z);
      if(ed>1||space<.99||(x/21)**2+(z/24)**2<.92)continue;
      blades(x,z,i);
    }
    for(let n=0;n<390;n++){
      const x=(random(n+6191)-.5)*145,z=(random(n+13622)-.5)*165;
      if((x/73)**2+(z/83)**2>.97||(x/23)**2+(z/27)**2<1||trailDistance(x,z)<2.3)continue;
      for(let j=0;j<8;j++){
        const a=tau*random(n*13+j+180),r=1.35*random(n*13+j+291);
        blades(x+r*Math.sin(a),z+r*Math.cos(a),11300+n*8+j);
      }
    }
    for(let i=0;i<850;i++){
      const j=Math.floor(random(i+932)* (localTrail.length-1)),[a,b]=localTrail[j],[c,d]=localTrail[j+1];
      const h=random(i+275),side=i%2?1:-1,spread=1.2+1.5*random(i+817),len=Math.hypot(c-a,d-b);
      blades(a+(c-a)*h+side*(d-b)*spread/len,b+(d-b)*h-side*(c-a)*spread/len,i+5010);
    }
    const m=geom(T,near,new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide}),points,cols,null,idx,'Cỏ bụi và lá dài dọc mỏm núi');m.castShadow=false;
    const g=m.geometry,p=g.attributes.position,raw=new Float32Array(p.array);
    return ground=>{
      const support=coverGeo.attributes.position;
      for(let i=0;i<foot.length;i++){const [x,z]=foot[i];support.setY(i,ground(x,z)+.096);}
      support.needsUpdate=true;coverGeo.computeVertexNormals();coverGeo.computeBoundingSphere();
      for(let j=0;j<anchors.length;j++){const [start,x,z]=anchors[j],end=j+1<anchors.length?anchors[j+1][0]:p.count,y=ground(x,z)-.02;
        for(let i=start;i<end;i++)p.setY(i,raw[3*i+1]+y);}
      p.needsUpdate=true;g.computeBoundingSphere();
    };
  }
  function build(T,k){
    const mat=mineral(T),fit=[mainRock(T,k,mat),blocks(T,k,mat),trail(T,k,mat),summitGrass(T,k)];
    k.group.userData.fitGround=ground=>{for(const f of fit)f(ground);};
  }
  function view(name,x,z,focus,eyeX,eyeZ,eyeY,fov){
    const dx=eyeX-x,dz=eyeZ-z,dy=eyeY-focus,run=Math.hypot(dx,dz);
    return {name,offset:[x,z],height:focus/.46,viewBase:'monument',viewRadius:Math.hypot(run,dy),
      viewAngle:Math.atan2(dx,dz),viewElevation:Math.atan2(dy,run),viewFov:fov};
  }
  (window.VietnamSights??=[]).push({...pin,id,catalogId,name:'Núi Đá Bia – Thạch Bi Sơn',kind:'Đỉnh núi',locality:'Đèo Cả',
    formerProvince:'Phú Yên',lon:109.39882,lat:12.89853,yaw:0,start:[109.3941124,12.8847007],
    mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,width:90,depth:148,viewDistance:3500,
    boundary:[[-100,54],[-33,12],[-26,-29],[5,-92],[38,-90],[40,30],[-31,32],[-89,58]],
    reserve:(x,z,r)=>x>-55-r&&x<39+r&&z>-91-r&&z<46+r,solids:[],source,photo:vr,map:'https://www.openstreetmap.org/node/4510077892',
    description:'Trên sườn bắc dãy Đèo Cả, đỉnh Thạch Bi Sơn cao khoảng 706 m. Phiến granit cao khoảng 76 m có mặt tây khá phẳng, các mặt còn lại uốn cong và có những khe nứt dọc. Một tảng nhỏ nằm trên chóp. Sườn núi phía đông nam đổ xuống vịnh Vũng Rô.',
    arrivalNote:'Xe dừng trên đường đèo Cả cạnh lối vào bãi. Từ bãi theo đường đi bộ khoảng 2,3 km qua rừng, cầu và những đoạn bậc đá để lên chân phiến Đá Bia.',
    views:[view('Mặt nam và tảng đá trên chóp',.5,.6,30.6,-9.6,63.0,40.1,93),
      view('Đoạn bậc cuối dưới mặt đá phía tây',-10,5.5,22.4,-68.1,42.9,-85,76),
      {...view('Vịnh Vũng Rô nhìn từ phía nam Đá Bia',204.4,351,-22,-9.6,63,40.1,48),description:'Từ vị trí máy ảnh 360° ở sườn nam, nhìn về phía đông nam qua sườn Đèo Cả tới cửa vịnh Vũng Rô.'}],build});
})();

export default window.VietnamSights;
