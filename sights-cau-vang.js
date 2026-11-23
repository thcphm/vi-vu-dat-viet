'use strict';
(()=>{
  const catalogId='osm-way-683416736',site=VietnamTourism.entries.find(place=>place.id===catalogId);
  if(!site)return;
  // OSM 683416736 v6, east/south metres from the catalogue pin. The first
  // point continues the mapped path to the east doorway of the circular station.
  const centerline=[[29.42,38.90],[37.36,37.29],[41.66,30.72],[46.26,19.85],[45.10,5.27],
    [36.21,-8.46],[18.71,-19.04],[-5.69,-28.47],[-31.53,-36.47],[-46.16,-37.35]];
  const source='https://sunworld.vn/vi/banahills/an-choi/kham-pha-cau-ban-tay-ba-na-hills-dia-diem-check-in-cuc-hot-1957';
  const photo='https://danangfantasticity.com/en/cau-vang-thuong-hieu-moi-cua-du-lich-da-nang';
  const rail=2.52,round=Math.PI*2;
  const views=[
    {name:'Hai bàn tay nâng cầu',offset:[7,-20],viewAngle:-1.06,viewElevation:.55,viewRadius:58,height:20},
    {name:'Trên lối đi lát gỗ',offset:[22,-17],viewAngle:1.15,viewElevation:.025,viewRadius:14,height:25},
    {name:'Toàn cảnh từ sườn núi',offset:[4,-5],viewAngle:1.98,viewElevation:.42,viewRadius:113,height:16}
  ];
  function centerFrame(T){
    const curve=new T.CatmullRomCurve3(centerline.map(([x,z])=>new T.Vector3(x,0,z)),false,'centripetal');
    function frame(t){
      const p=curve.getPointAt(t),a=curve.getTangentAt(t);
      return {x:p.x,z:p.z,dx:a.x,dz:a.z,nx:-a.z,nz:a.x};
    }
    return {frame,length:curve.getLength()};
  }
  const boundary=[];
  for(const side of [1,-1]){
    const line=side===1?centerline:[...centerline].reverse();
    line.forEach(([x,z],i)=>{
      const p=line[Math.max(0,i-1)],q=line[Math.min(line.length-1,i+1)],dx=q[0]-p[0],dz=q[1]-p[1],l=Math.hypot(dx,dz);
      boundary.push([x-dz/l*3.35,z+dx/l*3.35]);
    });
  }
  const stop={...site,catalogId,id:'cau-vang-ba-na',name:'Cầu Vàng Bà Nà',city:'Đà Nẵng',yaw:0,width:98,depth:82,
    boundary,solids:[],photo,source,views,departureView:{angle:1.25,radius:112,eye:45,focus:12},
    viewAngle:views[0].viewAngle,viewElevation:views[0].viewElevation,viewRadius:views[0].viewRadius,
    description:'Từ ga Marseille, lối đi lát gỗ uốn quanh sườn Bà Nà qua hai bàn tay khổng lồ. Bảy trụ thép đỡ tám nhịp cầu, hai hàng hoa nằm dưới lan can màu vàng.',
    reserve(x,z,pad=0){
      if(Math.hypot(x-14.97,z-35.06)<14.0+pad)return true;
      for(let i=1;i<centerline.length;i++){
        const [a,b]=centerline[i-1],[c,d]=centerline[i],dx=c-a,dz=d-b,
          t=Math.max(0,Math.min(1,((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz)));
        if(Math.hypot(x-a-t*dx,z-b-t*dz)<6.8+pad)return true;
      }
      return false;
    },build};
  (window.VietnamSights??=[]).push(stop);
  function surface(T,group,positions,indices,mat,uv){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    if(uv)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
    const m=new T.Mesh(g,mat);m.castShadow=m.receiveShadow=true;group.add(m);return m;
  }
  function material(T,tint,roughness=.82,metalness=0){
    return new T.MeshStandardMaterial({color:tint,roughness,metalness,side:T.DoubleSide});
  }
  // Different radii at each phalanx and a smoothly blended thumb mound give
  // one continuous sculpted skin. The webbing ends below the gaps between fingers.
  function handGeometry(T,step){
    const minimum=[-6.7,-11.8,-13.4],maximum=[6.8,9.1,9.3],
      dims=minimum.map((v,i)=>Math.ceil((maximum[i]-v)/step)+1),[sx,sy,sz]=dims,n=sx*sy*sz;
    const field=new Float32Array(n).fill(3),idx=(i,j,k)=>i+sx*(j+sy*k);
    function blend(a,b,k){const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;}
    function primitive(lo,hi,measure,soft){
      const low=lo.map((v,i)=>Math.max(0,Math.floor((v-minimum[i]-1.12)/step))),
        high=hi.map((v,i)=>Math.min(dims[i]-1,Math.ceil((v-minimum[i]+1.12)/step)));
      for(let k=low[2];k<=high[2];k++)for(let j=low[1];j<=high[1];j++)for(let i=low[0];i<=high[0];i++){
        const index=idx(i,j,k),d=measure(minimum[0]+i*step,minimum[1]+j*step,minimum[2]+k*step);
        field[index]=blend(field[index],d,soft);
      }
    }
    function ellipsoid(x,y,z,rx,ry,rz,tilt,soft){
      const c=Math.cos(tilt),s=Math.sin(tilt),ey=Math.hypot(ry*c,rz*s),ez=Math.hypot(ry*s,rz*c);
      primitive([x-rx,y-ey,z-ez],[x+rx,y+ey,z+ez],(xx,yy,zz)=>{
        const a=(xx-x)/rx,b=((yy-y)*c-(zz-z)*s)/ry,d=((yy-y)*s+(zz-z)*c)/rz;
        return (Math.sqrt(a*a+b*b+d*d)-1)*Math.min(rx,ry,rz);
      },soft);
    }
    function segment(a,b,soft=.32){
      const [x,y,z,r]=a,dx=b[0]-x,dy=b[1]-y,dz=b[2]-z,r1=b[3],d2=dx*dx+dy*dy+dz*dz;
      const lo=[x,y,z].map((v,i)=>Math.min(v-r,b[i]-r1)),hi=[x,y,z].map((v,i)=>Math.max(v+r,b[i]+r1));
      primitive(lo,hi,(xx,yy,zz)=>{
        const X=xx-x,Y=yy-y,Z=zz-z,t=Math.max(0,Math.min(1,(X*dx+Y*dy+Z*dz)/d2));
        return Math.hypot(X-t*dx,Y-t*dy,Z-t*dz)-r-(r1-r)*t;
      },soft);
    }
    function digit(points){
      // Use overlapping rounded joints; the reduction in radius above each knuckle remains visible.
      for(let i=1;i<points.length;i++)segment(points[i-1],points[i],i===1?.66:.17);
    }
    ellipsoid(-.2,-7.30,-7.60,3.35,2.64,5.48,.37,1.08);
    ellipsoid(-.08,-4.75,-2.20,4.81,2.03,5.74,.22,1.04);
    ellipsoid(-.25,-3.64,.72,4.89,1.68,3.67,.23,.81);
    ellipsoid(2.63,-3.60,-3.21,2.12,2.36,3.72,.32,.88);
    const fingers=[
      [3.36,4.23,5.90,6.60,1.29],[1.10,1.47,6.49,7.55,1.34],
      [-1.18,-1.52,5.93,6.63,1.23],[-3.24,-4.18,4.99,4.96,1.02]
    ];
    for(const [base,tip,z,h,r] of fingers){
      digit([[base*.89,-3.33,.96,r*1.19],[base,-1.93,3.17,r*1.17],[base*.40+tip*.60,.13,z-.87,r*1.10],
        [tip*.98,h*.40,z-.11,r*1.02],[tip,h*.64,z+.12,r*1.02],[tip+.03,h*.77,z+.06,r*.92],
        [tip-.07,h-.9,z-.08,r*.94],[tip-.15,h-.22,z-.20,r*.74]]);
    }
    digit([[2.40,-4.52,-4.78,1.99],[3.13,-2.20,-4.57,1.83],[3.46,.03,-4.49,1.53],
      [3.36,1.86,-4.10,1.36],[3.16,3.43,-3.82,1.18],[2.80,4.50,-3.65,.91]]);
    const pos=[],indices=[],vert=new Map();
    function cut(a,b){
      const lo=Math.min(a,b),hi=Math.max(a,b),key=lo*n+hi;
      if(vert.has(key))return vert.get(key);
      const t=field[a]/(field[a]-field[b]),x0=a%sx,x1=b%sx,y0=Math.floor(a/sx)%sy,y1=Math.floor(b/sx)%sy,
        z0=Math.floor(a/(sx*sy)),z1=Math.floor(b/(sx*sy));
      pos.push(minimum[0]+(x0+(x1-x0)*t)*step,minimum[1]+(y0+(y1-y0)*t)*step,minimum[2]+(z0+(z1-z0)*t)*step);
      const id=pos.length/3-1;vert.set(key,id);return id;
    }
    function tri(a,b,c,outside){
      const ax=pos[3*a],ay=pos[3*a+1],az=pos[3*a+2],bx=pos[3*b]-ax,by=pos[3*b+1]-ay,bz=pos[3*b+2]-az,
        cx=pos[3*c]-ax,cy=pos[3*c+1]-ay,cz=pos[3*c+2]-az;
      const ox=minimum[0]+outside%sx*step-ax,oy=minimum[1]+(Math.floor(outside/sx)%sy)*step-ay,
        oz=minimum[2]+Math.floor(outside/(sx*sy))*step-az;
      if((by*cz-bz*cy)*ox+(bz*cx-bx*cz)*oy+(bx*cy-by*cx)*oz>=0)indices.push(a,b,c);else indices.push(a,c,b);
    }
    const tets=[[0,1,3,7],[0,3,2,7],[0,2,6,7],[0,6,4,7],[0,4,5,7],[0,5,1,7]];
    for(let k=0;k<sz-1;k++)for(let j=0;j<sy-1;j++)for(let i=0;i<sx-1;i++){
      const q=idx(i,j,k),p=[q,q+1,q+sx,q+sx+1,q+sx*sy,q+sx*sy+1,q+sx*sy+sx,q+sx*sy+sx+1];
      if(p.every(v=>field[v]>=0)||p.every(v=>field[v]<0))continue;
      for(const face of tets){
        const a=[],b=[];for(const corner of face)(field[p[corner]]<0?a:b).push(p[corner]);
        if(!a.length||!b.length)continue;
        if(a.length===2){
          const v0=cut(a[0],b[0]),v1=cut(a[0],b[1]),v2=cut(a[1],b[1]),v3=cut(a[1],b[0]);
          tri(v0,v1,v2,b[0]);tri(v0,v2,v3,b[0]);
        }else{
          const single=a.length===1?a[0]:b[0],other=a.length===1?b:a;
          tri(cut(single,other[0]),cut(single,other[1]),cut(single,other[2]),b[0]);
        }
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(indices);g.computeVertexNormals();return g;
  }
  function stoneMaterial(T){
    const m=material(T,0xcacac0,.96);m.customProgramCacheKey=()=>'ba-na-sculpted-stone-v1';
    m.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec3 handP; varying vec3 handNormal;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n handP=position;handNormal=normal;');
      shader.fragmentShader=`varying vec3 handP; varying vec3 handNormal;
      float handHash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
      float noiseHand(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(mix(handHash(i),handHash(i+vec3(1,0,0)),f.x),mix(handHash(i+vec3(0,0,1)),handHash(i+vec3(1,0,1)),f.x),f.z),
          mix(mix(handHash(i+vec3(0,1,0)),handHash(i+vec3(1,1,0)),f.x),mix(handHash(i+vec3(0,1,1)),handHash(i+vec3(1,1,1)),f.x),f.z),f.y);}
      `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec3 p=handP, n=normalize(handNormal);float grain=noiseHand(p*15.);
      float coarse=noiseHand(p*.47)*.48+noiseHand(p*1.25)*.27+noiseHand(p*3.7)*.17+grain*.08;
      float damp=smoothstep(.48,.62,coarse+.035*sin(p.y*.78));
      float moss=smoothstep(.51,.64,coarse+.018*n.y+.042*noiseHand(p*.22));
      vec3 shell=vec3(.63,.65,.62)*(.72+.45*coarse+.13*grain);
      shell=mix(shell,vec3(.19,.22,.208),damp*.85);shell=mix(shell,mix(vec3(.16,.18,.10),vec3(.24,.26,.12),grain),moss*.76);
      float joint=abs(fract(p.y*.39+noiseHand(p*.72)*.23+p.x*.043)-.52);
      float crease=(1.-smoothstep(.012,.043,joint))*smoothstep(-.4,2.,p.y)*(1.-abs(n.y));
      float fissure=abs(fract(noiseHand(p*.26+p.y*.041)*3.7+noiseHand(p*1.2)*.20)-.5);
      diffuseColor.rgb=shell*(1.-crease*.32-(1.-smoothstep(.004,.019,fissure))*.21);
      `);
    };return m;
  }
  function build(T,{group}){
    const {frame,length}=centerFrame(T),deck=new T.Group();deck.name='Cầu và nhà đón';group.add(deck);
    const gold=material(T,0xc69a49,.40,.33),polished=material(T,0xe7c57a,.28,.46),
      underside=material(T,0x9e782f,.52,.33),steel=material(T,0x38584a,.70,.16),
      brown=material(T,0xd4cebb,.91),glass=material(T,0x648080,.36,.22);
    const up=new T.Vector3(0,1,0),work=new T.Object3D(),direction=new T.Vector3();
    const timber=[],bars=[],posts=[],plants=[],stoneFeet=[],leafCards=[];
    let seed=6821;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    function point(f,across,y,along=0){
      return [f.x+f.nx*across+f.dx*along,y,f.z+f.nz*across+f.dz*along];
    }
    function item(list,x,y,z,w,h,d,angle=0,tint=null){
      work.position.set(x,y,z);work.rotation.set(0,angle,0);work.scale.set(w,h,d);work.updateMatrix();
      list.push([work.matrix.clone(),tint]);
    }
    function rod(list,a,b,r,tint=null){
      direction.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const length=direction.length();if(length<.0001)return;
      work.position.set((a[0]+b[0])*.5,(a[1]+b[1])*.5,(a[2]+b[2])*.5);
      work.quaternion.setFromUnitVectors(up,direction.multiplyScalar(1/length));work.scale.set(r,length,r);work.updateMatrix();
      list.push([work.matrix.clone(),tint]);
    }
    function instances(list,geom,mat,parent=deck,hideBeyond=0){
      if(!list.length)return;
      const inst=new T.InstancedMesh(geom,mat,list.length),c=new T.Color();
      list.forEach(([mx,tint],i)=>{inst.setMatrixAt(i,mx);if(tint!==null)inst.setColorAt(i,c.setHex(tint));});
      inst.castShadow=inst.receiveShadow=true;
      if(hideBeyond){
        const lod=new T.LOD();lod.addLevel(inst,0);lod.addLevel(new T.Group(),hideBeyond,.12);parent.add(lod);
      }else parent.add(inst);
      return inst;
    }
    function skin(cross,mat){
      const coords=[],indices=[],uv=[],N=170;
      for(let i=0;i<=N;i++){
        const f=frame(i/N);
        for(let k=0;k<cross.length;k++){
          const [x,y]=cross[k];coords.push(...point(f,x,y));uv.push(i/N*length,y*.66+x);
          if(!i||!k)continue;const q=i*cross.length+k;
          indices.push(q-cross.length-1,q-1,q,q-cross.length-1,q,q-cross.length);
        }
      }
      return surface(T,deck,coords,indices,mat,uv);
    }
    skin([[-rail,.015],[-rail-.05,-.39],[-rail+.06,-.77],[-1.74,-1.00],[0,-1.14],[1.74,-1.00],[rail-.06,-.77],[rail+.05,-.39],[rail,.015]],gold);
    skin([[-2.2,-.72],[-1.65,-1.06],[0,-1.18],[1.65,-1.06],[2.2,-.72]],underside);
    for(const side of [-1,1]){
      skin([[side*1.54,.02],[side*1.54,.17],[side*1.62,.17],[side*1.62,.08],[side*rail,.08]],underside);
      skin([[side*1.60,.095],[side*2.45,.095]],material(T,0x4d5135,.96));
    }
    const nBoards=Math.ceil(length/.183),wood=[0xa67f64,0x9d745b,0xaa8064,0x96705a,0xb28b70,0x9a765f];
    for(let i=0;i<nBoards;i++){
      const f=frame((i+.5)/nBoards);
      item(timber,f.x,.018,f.z,length/nBoards-.010,.082,3.10,Math.atan2(-f.dz,f.dx),wood[Math.floor(rand()*wood.length)]);
    }
    const cube=new T.BoxGeometry(),bar=new T.CylinderGeometry(1,1,1,6,1,true);
    const woodFinish=material(T,0xffffff,.83);
    woodFinish.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 boardGrain;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nboardGrain=vec2(position.x*.182,position.z*3.10)+instanceMatrix[3].xz;');
      shader.fragmentShader='varying vec2 boardGrain;\n'+shader.fragmentShader.replace('#include <color_fragment>',
        '#include <color_fragment>\nfloat grain=boardGrain.x*172.+1.85*sin(boardGrain.y*1.7+boardGrain.x*13.)+.78*sin(boardGrain.y*4.03); float fade=1.-smoothstep(.40,2.5,fwidth(grain));diffuseColor.rgb*=1.+fade*(.061*sin(grain)+.035*sin(2.17*grain));');
    };
    instances(timber,cube,woodFinish);
    const nPanels=Math.ceil(length/1.44);
    for(const side of [-1,1]){
      for(let j=0;j<nPanels;j++){
        const t=j/nPanels,t1=(j+1)/nPanels,a=frame(t),b=frame(t1);
        for(const [offset,h,r] of [[rail+.01,1.23,.054],[rail+.015,.81,.032],[rail-.04,.20,.033]]){
          rod(bars,point(a,side*offset,h),point(b,side*offset,h),r);
        }
        for(let k=0;k<5;k++){
          const c=frame(t+(t1-t)*k/5);
          rod(bars,point(c,side*(rail-.05),.085,-.115),point(c,side*(rail+.02),.81,.10),.021);
        }
        rod(bars,point(a,side*(rail-.065),.06),point(a,side*(rail+.035),1.215,.16),.042);
        rod(bars,point(a,side*(rail+.015),.81,.07),point(b,side*(rail+.01),1.21,-.07),.023);
      }
      for(let i=0;i<Math.ceil(length/.36);i++){
        const f=frame((i+.5)/Math.ceil(length/.36)),p=point(f,side*(1.92+rand()*.23),.22);
        item(plants,p[0],.150,p[2],.42+rand()*.16,.07+rand()*.05,.36+rand()*.10,rand()*3,
          [0x52653d,0x687d44,0x758a4d,0x495e39][Math.floor(rand()*4)]);
        const spin=rand()*Math.PI;
        for(let k=0;k<2;k++)item(leafCards,p[0],.275,p[2],.69+rand()*.16,.37+rand()*.11,1,spin+k*Math.PI/2,0xf3eedb);
      }
    }
    instances(bars,bar,polished,deck,355);instances(plants,new T.IcosahedronGeometry(1,0),material(T,0xffffff,.94),deck,215);
    function foliageTexture(flowers){
      const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const pen=canvas.getContext('2d');
      for(let i=0;i<19;i++){
        const x=7+i*6.1,h=23+rand()*48,lean=(rand()-.5)*26;
        pen.beginPath();pen.moveTo(x,127);pen.quadraticCurveTo(x+lean*.13,105,x+lean,127-h);pen.strokeStyle='#596844';pen.lineWidth=2;pen.stroke();
        for(let n=0;n<6;n++){
          const t=(n+.25)/6,cx=x+lean*t,cy=127-t*h,bend=n%2?1:-1;
          pen.save();pen.translate(cx,cy);pen.rotate(bend*(.47+rand()*.43));
          pen.fillStyle='hsl('+(81+rand()*23)+' 29% '+(21+rand()*24)+'%)';
          pen.beginPath();pen.ellipse(0,-5,2.6+rand()*2.6,6+rand()*5,0,0,round);pen.fill();pen.restore();
        }
        if(flowers){
          const fx=x+lean,fy=127-h,rad=3+rand()*1.5;
          for(let k=0;k<7;k++){const a=k*round/7;pen.beginPath();pen.ellipse(fx+rad*Math.sin(a),fy+rad*Math.cos(a),2.0,2.9,-a,0,round);pen.fillStyle=i%3?'#b99ab7':'#ddbd70';pen.fill();}
          pen.fillStyle='#e5c46b';pen.beginPath();pen.arc(fx,fy,1.9,0,round);pen.fill();
        }
      }
      const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;return tex;
    }
    const leaves=new T.MeshLambertMaterial({map:foliageTexture(true),alphaTest:.30,side:T.DoubleSide,emissive:0x172011});
    instances(leafCards,new T.PlaneGeometry(),leaves,deck,205);
    const forks=[];
    for(let i=1;i<=7;i++){
      const f=frame(i/8),shaft=new T.Mesh(new T.CylinderGeometry(.75,.89,1,16),steel);
      shaft.castShadow=shaft.receiveShadow=true;group.add(shaft);posts.push({f,shaft});
      for(const [a,b] of [[-1.55,-2.10],[1.55,-2.10],[-1.55,2.10],[1.55,2.10]])
        rod(forks,point(f,a*.16,-3.98,b*.16),point(f,a,-.84,b),.17);
      rod(forks,point(f,0,-4.63),point(f,0,-3.98),.91);
      rod(forks,point(f,0,-4.78),point(f,0,-4.63),.84);
    }
    instances(forks,bar,underside);
    const hand=handGeometry(T,.37),farHand=handGeometry(T,.96),stone=stoneMaterial(T);
    for(const [t,mirror,scale] of [[.345,-1,1],[.725,1,.95]]){
      const f=frame(t),mesh=new T.LOD();mesh.name=mirror<0?'Bàn tay phía ga':'Bàn tay phía vườn hoa';
      [hand,farHand].forEach((g,i)=>{const cast=new T.Mesh(g,stone);cast.castShadow=cast.receiveShadow=true;mesh.addLevel(cast,i?310:0,.12);});
      mesh.position.set(f.x,0,f.z);mesh.scale.set(scale*mirror,scale,scale);mesh.rotation.y=Math.atan2(-f.dz,f.dx);
      mesh.castShadow=mesh.receiveShadow=true;deck.add(mesh);
      // The cracked brown rock at each wrist descends to the measured hillside.
      const base=point(f,-9.9*scale,-8.15*scale);
      const rockGroup=new T.Group();rockGroup.position.set(base[0],0,base[2]);rockGroup.rotation.y=mesh.rotation.y;
      group.add(rockGroup);
      for(let k=0;k<22;k++){
        const a=k*2.39996,radius=Math.sqrt(k/22),x=Math.sin(a)*radius*4.4,z=Math.cos(a)*radius*3.2,
          b=new T.Mesh(new T.DodecahedronGeometry(1,0),material(T,[0x847d69,0x908676,0x797965,0x9a8f79][k%4],.97));
        b.position.set(x,.37+rand()*.39,z);b.rotation.set(rand()*.69,rand()*3,rand()*.72);
        b.scale.set(1.8+rand()*1.8,.60+rand()*.53,1.8+rand()*1.3);
        b.castShadow=b.receiveShadow=true;rockGroup.add(b);
      }
      stoneFeet.push({group:rockGroup,pos:base});
    }
    // The circular striped canopy joins the south-east bridge abutment. Its
    // drum follows OSM 1109970061 and leaves the adjoining halls to the map.
    const roof=new T.Group();roof.position.set(14.97,0,35.06);deck.add(roof);
    const radius=14.5,top=11.8,eave=3.85,goreCount=16,ribs=[],painted=[
      material(T,0xb67468,.65),material(T,0xe2dccc,.68)];
    for(let j=0;j<goreCount;j++){
      const a=j*round/goreCount,b=(j+1)*round/goreCount,coords=[],idx=[],N=14,W=4;
      for(let k=0;k<=N;k++)for(let u=0;u<=W;u++){
        const phi=k/N*(Math.PI/2-.024),theta=a+(b-a)*u/W,rr=radius*Math.cos(phi)*(1+.006*Math.sin(Math.PI*u/W));
        coords.push(Math.sin(theta)*rr,eave+(top-eave)*Math.sin(phi),Math.cos(theta)*rr);
        if(k&&u){const q=k*(W+1)+u;idx.push(q-W-2,q-1,q,q-W-2,q,q-W-1);}
      }
      surface(T,roof,coords,idx,painted[j%2]);const ca=Math.sin(a),cb=Math.cos(a),da=Math.sin(b),db=Math.cos(b);
      rod(ribs,[ca*radius,.04,cb*radius],[ca*radius,eave,cb*radius],.09);
      rod(ribs,[ca*radius,eave,cb*radius],[da*radius,eave,db*radius],.13);
      if(Math.abs(a-Math.PI*.50)<.43)continue;
      surface(T,roof,[ca*radius,0,cb*radius,da*radius,0,db*radius,da*radius,eave-.12,db*radius,ca*radius,eave-.12,cb*radius],
        [0,1,2,0,2,3],glass);
      rod(ribs,[ca*radius,.95,cb*radius],[da*radius,.95,db*radius],.046);
    }
    instances(ribs,bar,brown,roof);
    const plinth=new T.Mesh(new T.CylinderGeometry(radius+.16,radius+.16,.20,48),brown);
    plinth.position.y=-.08;plinth.receiveShadow=true;roof.add(plinth);
    const foundations=[];
    function abutment(ring,deckOffset){
      const positions=[],indices=[];
      for(let j=0;j<ring.length;j++){
        const [x,z]=ring[j];positions.push(x,0,z,x,deckOffset,z);
        const a=j*2,b=((j+1)%ring.length)*2;indices.push(a,b,b+1,a,b+1,a+1);
      }
      const wall=material(T,0xa59d86,.94);
      wall.onBeforeCompile=s=>{
        s.vertexShader='varying vec3 retainingP;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nretainingP=position;');
        s.fragmentShader='varying vec3 retainingP;\n'+s.fragmentShader.replace('#include <color_fragment>',
          '#include <color_fragment>\nvec3 p=retainingP;float row=floor(p.y/.48);float sl=fract((p.x*.64+p.z*.77)/.83+.5*mod(row,2.));float joint=min(min(sl,1.-sl),min(fract(p.y/.48),1.-fract(p.y/.48)));diffuseColor.rgb*=.75+.21*smoothstep(.013,.058,joint)+.041*sin(floor(sl)*33.+row*71.);');
      };
      const m=surface(T,group,positions,indices,wall);foundations.push({ring,m,deckOffset});
    }
    abutment(Array.from({length:48},(_,k)=>[roof.position.x+(radius+.03)*Math.sin(k*round/48),roof.position.z+(radius+.03)*Math.cos(k*round/48)]),-.14);
    const endFrame=frame(1);abutment([[-2.53,-1.9],[2.53,-1.9],[2.53,.47],[-2.53,.47]].map(([v,u])=>{
      const p=point(endFrame,v,0,u);return [p[0],p[2]];
    }),-.83);
    // A planted belt follows the outside of the bend. Open space immediately below
    // the hand sculptures remains visible from the lower garden.
    const soilMap=new T.TextureLoader().load('streetscape/verge-earth.webp');
    soilMap.wrapS=soilMap.wrapT=T.RepeatWrapping;soilMap.colorSpace=T.SRGBColorSpace;
    const bedMat=new T.MeshStandardMaterial({map:soilMap,color:0x737957,roughness:1,side:T.DoubleSide,
      alphaTest:.44,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
    bedMat.onBeforeCompile=s=>{
      s.vertexShader='attribute vec2 gardenUV; varying vec2 gardenEdge;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ngardenEdge=gardenUV;');
      s.fragmentShader='varying vec2 gardenEdge;\n'+s.fragmentShader.replace('#include <alphatest_fragment>',
        'vec2 edge=min(gardenEdge,1.-gardenEdge);float dist=min(edge.x*28.,edge.y*10.);float blades=fract(sin(dot(floor(vMapUv*43.),vec2(36.19,15.43)))*23743.1);diffuseColor.a*=smoothstep(.04,.70,dist+blades*.37);\n#include <alphatest_fragment>');
    };
    const bedPos=[],bedUv=[],fadeUv=[],bedIdx=[],bedRows=52,bedCols=12;
    // Keep the east forecourt and the approach to its parking space clear.
    const inForecourt=(x,z)=>x>43&&z>24;
    for(let j=0;j<=bedRows;j++){
      const t=j/bedRows,f=frame(.03+t*.945);
      for(let i=0;i<=bedCols;i++){
        const u=i/bedCols,across=-7.2+u*(22.3+1.9*Math.sin(11*t)+2.0*Math.cos(18*t));
        const p=point(f,across,0);bedPos.push(...p);bedUv.push(p[0]*.24,p[2]*.24);fadeUv.push(t,u);
        if(j&&i&&!inForecourt(p[0],p[2])){const q=j*(bedCols+1)+i;bedIdx.push(q-bedCols-2,q-1,q,q-bedCols-2,q,q-bedCols-1);}
      }
    }
    const garden=surface(T,group,bedPos,bedIdx,bedMat,bedUv);garden.castShadow=false;
    garden.geometry.setAttribute('gardenUV',new T.Float32BufferAttribute(fadeUv,2));
    const shrubs=[],vegetation=[];
    for(let i=0;i<205;i++){
      const t=.018+rand()*.962,f=frame(t),u=5.8+rand()*17.9,nearHand=Math.abs(t-.345)<.055||Math.abs(t-.725)<.055;
      if(nearHand&&u<12.8)continue;
      const [x,,z]=point(f,u,0),h=1.25+rand()*2.95,w=h*(.80+rand()*.60),angle=rand()*Math.PI,offset=shrubs.length;
      if(inForecourt(x,z))continue;
      for(let k=0;k<2;k++)item(shrubs,x,0,z,w,h,1,angle+k*Math.PI/2,rand()>.5?0xabb793:0xc0cba5);
      vegetation.push({x,z,h,offset});
    }
    const fern=new T.TextureLoader().load('streetscape/surfaces/bank-fern.webp');fern.colorSpace=T.SRGBColorSpace;
    const understory=instances(shrubs,new T.PlaneGeometry(),new T.MeshLambertMaterial({map:fern,alphaTest:.42,side:T.DoubleSide,emissive:0x1a2115}),group);
    const models=createTreeModels(T),treeRows=[[],[],[],[]],groves=[];
    for(let i=0;i<94;i++){
      const t=.05+rand()*.90,f=frame(t),k=rand(),u=k<.4?-5.5+rand()*8:7+rand()*17;
      const near=Math.abs(t-.345)<.048||Math.abs(t-.725)<.048;
      if(near&&u<13)continue;
      const [x,,z]=point(f,u,0),height=(k<.4?2.6:3.5)+rand()*4.1,spin=rand()*Math.PI;
      if(inForecourt(x,z))continue;
      const variant=models.variantAt(x,z),rows=treeRows[variant],index=rows.length,w=height*(.80+rand()*.22);
      item(rows,x,0,z,w,height,w,spin);
      groves.push({x,z,height,variant,index});
    }
    const groveMeshes=treeRows.map((rows,i)=>instances(rows,models.geometry('tree',false,i),models.material,group));
    const samples=Array.from({length:25},(_,i)=>frame(i/24)),eye=frame(.59),look=frame(.685);
    views[1].offset=[look.x,look.z];views[1].viewAngle=Math.atan2(eye.x-look.x,eye.z-look.z);
    views[1].viewRadius=Math.hypot(eye.x-look.x,eye.z-look.z);
    let prior=[];
    function fit(sample){
      if(prior.length&&prior.every(([x,z,y])=>Math.abs(sample(x,z)-y)<.008))return;
      prior=[];
      function h(x,z){const y=sample(x,z);prior.push([x,z,y]);return y;}
      const g0=h(samples[0].x,samples[0].z),g1=h(samples.at(-1).x,samples.at(-1).z),
        highest=Math.max(...samples.map(p=>h(p.x,p.z))),middle=samples[12];
      const level=Math.max(highest+.45,(g0+g1)*.5+.60,h(middle.x,middle.z)+8.6);
      deck.position.y=level;
      for(const {f,shaft} of posts){
        const topY=level-4.06,foot=Math.min(h(f.x,f.z)-.55,topY-.30);
        shaft.scale.y=topY-foot;shaft.position.set(f.x,(topY+foot)/2,f.z);
      }
      for(const base of stoneFeet){
        const crown=level+base.pos[1],earth=h(base.pos[0],base.pos[2])-.32;
        const bottom=Math.min(earth,crown-1.25);
        base.group.position.y=bottom;base.group.scale.y=Math.max(1,crown-bottom);
      }
      for(const {ring,m,deckOffset} of foundations){
        const pos=m.geometry.attributes.position;
        ring.forEach(([x,z],i)=>{pos.setY(i*2,Math.min(h(x,z)-.4,level+deckOffset-.12));pos.setY(i*2+1,level+deckOffset);});
        pos.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();m.geometry.computeBoundingBox();
      }
      const gardenVertices=garden.geometry.attributes.position;
      for(let i=0;i<gardenVertices.count;i++)gardenVertices.setY(i,h(bedPos[i*3],bedPos[i*3+2])+.085);
      gardenVertices.needsUpdate=true;garden.geometry.computeVertexNormals();garden.geometry.computeBoundingSphere();garden.geometry.computeBoundingBox();
      for(const {x,z,h:height,offset} of vegetation){
        const y=h(x,z)+height*.47;
        for(let j=offset;j<offset+2;j++){shrubs[j][0].elements[13]=y;understory.setMatrixAt(j,shrubs[j][0]);}
      }
      understory.instanceMatrix.needsUpdate=true;understory.computeBoundingSphere();
      for(const {x,z,height,variant,index} of groves){
        const earth=h(x,z),matrix=treeRows[variant][index][0];
        matrix.elements[5]=Math.max(.7,Math.min(height,level-earth-1.0));matrix.elements[13]=earth;
        groveMeshes[variant].setMatrixAt(index,matrix);
      }
      for(const grove of groveMeshes)if(grove){grove.instanceMatrix.needsUpdate=true;grove.computeBoundingSphere();}
      const targetHeights=[level+1.0,level+1.46,level+1.0];
      views.forEach((v,i)=>{const [x,z]=v.offset;v.height=(targetHeights[i]-h(x,z))/.46;});
      group.userData.height=level+top;
    }
    fit(()=>0);group.userData.fitGround=fit;
  }
})();
