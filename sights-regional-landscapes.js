'use strict';
(()=>{
  const atlas=new Map(VietnamTourism.entries.map(site=>[site.id,site]));
  const stops=window.VietnamSights??=[];
  function register(catalogId,options,build){
    const entry=atlas.get(catalogId);
    if(entry)stops.push({...entry,...options,catalogId,approachMeters:undefined,solids:[],build});
  }

  // All meshes use local metres. The plant beds and water margins follow the
  // same relief as the car, including when higher-resolution tiles arrive.
  function surface(T){
    const positions=[],colors=[],uv=[],indices=[],color=new T.Color();
    function vertex(x,y,z,tint,light=1,u=x,v=z){
      positions.push(x,y,z);color.setHex(tint);colors.push(color.r*light,color.g*light,color.b*light);
      uv.push(u,v);return positions.length/3-1;
    }
    function quad(a,b,c,d){indices.push(a,b,d,b,c,d);}
    function mesh(group,material,shadows=true){
      const g=new T.BufferGeometry();
      g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
      g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
      g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
      const m=new T.Mesh(g,material);m.castShadow=shadows;m.receiveShadow=true;group.add(m);return m;
    }
    return {vertex,quad,mesh,indices};
  }
  function matte(T,options={}){
    return new T.MeshStandardMaterial({roughness:.92,vertexColors:true,side:T.DoubleSide,...options});
  }
  function earthMaterial(T){
    const m=matte(T);
    m.customProgramCacheKey=()=>'cultivated-earth';
    m.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 earthMetres;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nearthMetres=position.xz;');
      s.fragmentShader=`varying vec2 earthMetres;
        float earthHash(vec2 p){vec3 q=fract(p.xyx*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
        float earthNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(earthHash(i),earthHash(i+vec2(1,0)),f.x),mix(earthHash(i+vec2(0,1)),earthHash(i+1.),f.x),f.y);}
      `+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=earthMetres;float clod=earthNoise(p*3.4)*.48+earthNoise(p*11.)*.28+earthNoise(p*29.)*.24;
        diffuseColor.rgb*=.63+clod*.68;
        diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.71,.93,.59),smoothstep(.48,.77,earthNoise(p*.58))*.76);
        float grit=smoothstep(.67,.83,earthNoise(p*14.))*smoothstep(.42,.71,earthNoise(p*2.9));
        diffuseColor.rgb+=vec3(.048,.039,.022)*grit;`);
    };return m;
  }
  function conform(group,meshes,instances=[]){
    const layers=meshes.map(mesh=>({g:mesh.geometry,rest:mesh.geometry.attributes.position.array.slice()}));
    let previous=new Map();
    group.userData.fitGround=height=>{
      const samples=new Map();
      let changed=false;
      for(const [key,old] of previous){
        const value=height(2*(Math.floor(key/4096)-2048),2*((key%4096)-2048));
        samples.set(key,value);if(Math.abs(old-value)>.008)changed=true;
      }
      if(previous.size&&!changed)return;
      function h(ix,iz){
        const key=(ix+2048)*4096+iz+2048;
        if(!samples.has(key))samples.set(key,height(ix*2,iz*2));
        return samples.get(key);
      }
      function lift(x,z){
        const ix=Math.floor(x/2),iz=Math.floor(z/2),u=x/2-ix,v=z/2-iz;
        return (h(ix,iz)*(1-u)+h(ix+1,iz)*u)*(1-v)+(h(ix,iz+1)*(1-u)+h(ix+1,iz+1)*u)*v;
      }
      for(const {g,rest} of layers){
        const p=g.attributes.position;
        for(let i=0;i<p.count;i++){
          const x=rest[i*3],z=rest[i*3+2];
          p.setY(i,rest[i*3+1]+lift(x,z));
        }
        p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();g.computeBoundingBox();
      }
      instances.forEach(place=>place(lift));previous=samples;
    };
  }
  function noise(){
    let state=13279457;
    return ()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
  }
  // Painted leaf sprays have transparent sky between the leaves; the surrounding
  // crowns stay open even where several branches overlap at driving distance.
  const maps=new Map();
  function leafMap(T,kind){
    if(maps.has(kind))return maps.get(kind);
    const rng=noise(),tea=kind==='tea',paperbark=kind==='paperbark';
    const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
    const pen=canvas.getContext('2d');
    if(tea){pen.fillStyle='#425337';pen.fillRect(0,0,256,256);}
    function blade(x,y,angle,length,width){
      pen.save();pen.translate(x,y);pen.rotate(angle);
      const hue=paperbark?92+rng()*20:tea?83+rng()*25:94+rng()*27,light=24+rng()*28;
      pen.beginPath();pen.moveTo(0,0);pen.quadraticCurveTo(width,-length*.33,0,-length);
      pen.quadraticCurveTo(-width*.74,-length*.44,0,0);
      const sheen=pen.createLinearGradient(-width,0,width,0);
      sheen.addColorStop(0,'hsl('+hue+' 26% '+light+'%)');
      sheen.addColorStop(.52,'hsl('+hue+' 33% '+(light+9)+'%)');
      sheen.addColorStop(.57,'hsl('+hue+' 35% '+(light-4)+'%)');
      sheen.addColorStop(1,'hsl('+hue+' 30% '+light+'%)');
      pen.fillStyle=sheen;pen.fill();pen.restore();
    }
    if(tea){
      for(let i=0;i<1750;i++){
        const x=rng()*256,y=rng()*256,a=rng()*Math.PI*2,len=7+rng()*11,w=len*.32;
        for(const dx of (x<20?[0,256]:x>236?[0,-256]:[0]))for(const dy of (y<20?[0,256]:y>236?[0,-256]:[0]))blade(x+dx,y+dy,a,len,w);
      }
    }else{
      for(let i=0;i<19;i++){
        const a=(rng()-.5)*2.95,reach=59+rng()*61,endX=126+Math.sin(a)*reach,endY=174-Math.cos(a)*reach;
        pen.beginPath();pen.moveTo(125,211);pen.quadraticCurveTo(126,150,endX,endY);pen.strokeStyle='#716e4a';pen.lineWidth=1.9;pen.stroke();
        for(let j=0;j<13;j++){
          const t=.15+.78*j/12,side=j%2?1:-1;
          const x=126+(endX-126)*t,y=194+(endY-194)*t;
          const dir=paperbark?side*(1.5+rng()*.78):a+side*(.63+rng()*.68);
          const len=(paperbark?22:16)+rng()*16;blade(x,y,dir,len,len*(paperbark?.16:.30));
        }
      }
    }
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
    if(tea)map.wrapS=map.wrapT=T.RepeatWrapping;
    map.anisotropy=4;map.userData.sightShared=true;maps.set(kind,map);return map;
  }
  // A tapered branch between arbitrary endpoints; bark colour varies along
  // individual facets rather than between randomly tinted whole trees.
  function branch(batch,a,b,r0,r1,bark,facets=7){
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],d=Math.hypot(dx,dy,dz);
    if(d<.001)return;
    const nx=dx/d,ny=dy/d,nz=dz/d,flat=Math.hypot(ny,nx)||1;
    const u=[ny/flat,-nx/flat,0],v=[nz*nx/flat,nz*ny/flat,-flat];
    const rings=[[],[]];
    for(let i=0;i<facets;i++){
      const angle=i*2*Math.PI/facets,c=Math.cos(angle),s=Math.sin(angle);
      const off=u.map((n,k)=>n*c+v[k]*s);
      for(const [j,p,r] of [[0,a,r0],[1,b,r1]])rings[j].push(batch.vertex(p[0]+off[0]*r,p[1]+off[1]*r,p[2]+off[2]*r,bark,.79+.19*Math.cos(i*1.5)));
    }
    for(let i=0;i<facets;i++){const k=(i+1)%facets;batch.quad(rings[0][i],rings[1][i],rings[1][k],rings[0][k]);}
  }
  function spray(batch,x,y,z,width,height,angle,tilt,light){
    const dx=Math.cos(angle)*width/2,dz=Math.sin(angle)*width/2;
    const leanX=-Math.sin(angle)*tilt,leanZ=Math.cos(angle)*tilt;
    const base=batch.vertex(x-dx,y-height/2,z-dz,0xffffff,light*.69,0,0);
    batch.vertex(x+dx,y-height/2,z+dz,0xffffff,light*.69,1,0);
    batch.vertex(x+dx+leanX,y+height/2,z+dz+leanZ,0xffffff,light,1,1);
    batch.vertex(x-dx+leanX,y+height/2,z-dz+leanZ,0xffffff,light,0,1);
    batch.quad(base,base+1,base+2,base+3);
  }
  function leafMaterial(T,kind){
    return matte(T,{map:leafMap(T,kind),alphaTest:.40,roughness:.85});
  }

  function teaGarden(T,{group,random}){
    const soil=surface(T),hedges=surface(T),shoots=surface(T);
    // Adjoining cultivated plots southwest of Đường Tân Cương. The break
    // between lower and upper rows preserves the footpath through the fields.
    const plots=[
      {x:-11,z:-9,length:50,depth:23,turn:-.37,bow:3.4,rise:2.35},
      {x:1,z:13,length:59,depth:15,turn:-.43,bow:2.8,rise:1.23},
      {x:23,z:-15,length:13,depth:14,turn:-.37,bow:1.1,rise:.68}
    ];
    for(const plot of plots){
      const c=Math.cos(plot.turn),s=Math.sin(plot.turn);
      function point(along,across){
        const u=along*2/plot.length,v=across*2/plot.depth;
        const bend=plot.bow*(1-u*u)+1.6*Math.sin(u*2.4+v*.63);
        const run=along*(1-.14*v*v)+.84*v+.71*v*v;
        const rise=plot.rise*(1-Math.min(1,u*u))*(1-Math.min(1,v*v));
        return [plot.x+c*run-s*(across+bend),plot.z+s*run+c*(across+bend),rise];
      }
      const rows=Math.floor(plot.depth/1.65),segments=Math.ceil(plot.length/1.25);
      const bed=[];
      for(let j=0;j<=rows;j++){
        const alongRow=[];
        for(let i=0;i<=segments;i++){
          const [x,z,h]=point((i/segments-.5)*(plot.length+.4),(j/rows-.5)*plot.depth);
          alongRow.push(soil.vertex(x,h+.12,z,0x766444,.89+random()*.18));
          if(i&&j)soil.quad(bed[j-1][i-1],alongRow[i-1],alongRow[i],bed[j-1][i]);
        }
        bed.push(alongRow);
      }
      for(let row=0;row<rows;row++){
        const offset=(row+.5-rows/2)*1.65;
        let previous;
        for(let i=0;i<=segments;i++){
          const x=(i/segments-.5)*plot.length,tip=Math.min(1,.4+Math.min(i,segments-i)*.7);
          const top=(.97+.07*Math.sin(x*1.63+row)+.07*random())*tip;
          const ring=[];
          for(const [run,h,shade] of [[-.66,.20,.46],[-.63,.69,.68],[-.44,.93,.96],[-.10,1.0,1.14],[.29,.98,1.07],[.60,.81,.83],[.67,.31,.50]]){
            const [px,pz,ground]=point(x,offset+run*tip);
            ring.push(hedges.vertex(px,ground+top*h,pz,0xf7ffd1,1.13*shade*(.94+.08*random()),x*.85,(row*.86+run)*1.3));
          }
          if(previous)for(let k=1;k<ring.length;k++)hedges.quad(previous[k-1],previous[k],ring[k],ring[k-1]);
          previous=ring;
          if(i%2)continue;
          for(let k=0;k<5;k++){
            const [px,pz,ground]=point(x+random()*.5,offset+(random()-.5)*.85),h=ground+top*(.96+random()*.13),l=.045+random()*.07,a=random()*6.28;
            const vx=l*Math.cos(a),vz=l*Math.sin(a),t=shoots.vertex(px,h,pz,0x729a3b);
            shoots.vertex(px+vx*.52-vz*.22,h+l*.66,pz+vz*.52+vx*.22,0xacc867);
            shoots.vertex(px+vx,h+l*.97,pz+vz,0xb3ca70);
            shoots.vertex(px+vx*.47+vz*.18,h+l*.46,pz+vz*.47-vx*.18,0x668c40);
            shoots.quad(t,t+1,t+2,t+3);
          }
        }
      }
    }
    conform(group,[soil.mesh(group,earthMaterial(T),false),hedges.mesh(group,matte(T,{map:leafMap(T,'tea')})),shoots.mesh(group,matte(T),false)]);
  }
  register('osm-node-5630745722',{id:'doi-che-tan-cuong',lon:105.75977,lat:21.54382,name:'Đồi chè Tân Cương',
    width:85,depth:54,yaw:0,viewAngle:1.12,viewElevation:.25,viewRadius:41,
    views:[{name:'Các thửa chè',height:3.7},{name:'Luống chè trên đồi',height:2.25,offset:[-4,-8],viewAngle:1.67,viewElevation:.13,viewRadius:12}],
    photo:'https://thainguyen.gov.vn/di-tich-danh-lam-thang-canh/diem-du-lich-cong-dong-xa-tan-cuong-296597',
    description:'Những luống chè thấp uốn theo triền đồi phía tây đường Tân Cương. Các lối đất nhỏ chia vạt chè thành từng thửa.'},teaGarden);

  function fruitCluster(T,group,fruits){
    // A mandarin is oblate, with a recessed stem end and a short green calyx.
    const batch=surface(T);
    const rings=[],sides=7;
    for(const [level,radius,shade] of [[-.83,.14,.68],[-.40,.89,.89],[.18,.98,1.0],[.76,.38,1.07]]){
      const ring=[];
      for(let i=0;i<sides;i++){
        const a=i*2*Math.PI/sides;ring.push(batch.vertex(radius*Math.cos(a),level,radius*Math.sin(a),0xffffff,shade));
      }
      if(rings.length){const prev=rings[rings.length-1];for(let i=0;i<sides;i++)batch.quad(prev[i],ring[i],ring[(i+1)%sides],prev[(i+1)%sides]);}
      rings.push(ring);
    }
    const top=batch.vertex(0,.88,0,0x817b40);
    for(let i=0;i<sides;i++)batch.indices.push(top,rings[3][(i+1)%sides],rings[3][i]);
    const prototype=batch.mesh(group,matte(T,{roughness:.59}));group.remove(prototype);
    const fruit=new T.InstancedMesh(prototype.geometry,prototype.material,fruits.length),matrix=new T.Matrix4(),color=new T.Color();
    fruit.castShadow=fruit.receiveShadow=true;group.add(fruit);
    prototype.geometry.addEventListener('dispose',()=>fruit.dispose());
    fruits.forEach((p,i)=>fruit.setColorAt(i,color.setHex(p[4])));
    function place(lift){
      fruits.forEach(([x,y,z,r],i)=>fruit.setMatrixAt(i,matrix.makeScale(r,r,r).setPosition(x,y+lift(x,z),z)));
      fruit.instanceMatrix.needsUpdate=true;fruit.computeBoundingSphere();fruit.computeBoundingBox();
    }
    place(()=>0);return place;
  }
  function citrusRows(T,{group,random}){
    const bark=surface(T),foliage=surface(T),mandarins=[],earth=surface(T),water=surface(T);
    const palette=[0xd89532,0xe9a443,0xe38c2a,0xcb862c,0xe89a32,0xcdb152],treeSpace=3.7;
    // Liếp run NW–SE. Drainage water sits between each pair of planted rows.
    for(let bed=-2;bed<=2;bed++){
      const mid=bed*8.6,base=[];
      for(let j=0;j<=13;j++){
        const z=(j-6.5)*treeSpace,strip=[];
        for(const [u,h] of [[-3.84,.12],[-3.47,.47],[0,.49],[3.50,.45],[3.84,.12]]){
          strip.push(earth.vertex(mid+u,h,z,Math.abs(u)>3.5?0x806c47:0x7f7a4f,.91+random()*.16));
        }
        if(j)for(let i=1;i<strip.length;i++)earth.quad(base[j-1][i-1],strip[i-1],strip[i],base[j-1][i]);
        base.push(strip);
        if(bed<2&&j<13){
          const a=water.vertex(mid+3.81,.14,z,0x435f53),b=water.vertex(mid+3.81,.14,z+treeSpace,0x586a54);
          const c=water.vertex(mid+4.83,.14,z+treeSpace,0x65725c),d=water.vertex(mid+4.83,.14,z,0x556f59);water.quad(a,b,c,d);
        }
      }
      for(const side of [-1,1])for(let j=-6;j<=6;j++){
        const x=mid+side*2.25+(random()-.5)*.24,z=j*treeSpace+(side>0?.9:0)+(random()-.5)*.5;
        const h=2.45+random()*.67,a0=random()*6.28,root=[x,.36,z],fork=[x+.09,h*.36,z-.03];
        branch(bark,root,fork,.095,.072,0x705e49);
        const close=bed===0&&Math.abs(j)<=4;
        for(let k=0;k<(close?7:5);k++){
          const a=k*2.4+a0,dist=.53+random()*.63,end=[x+Math.cos(a)*dist,h*(.72+random()*.21),z+Math.sin(a)*dist];
          const elbow=[x+Math.cos(a)*dist*.63,h*.56,z+Math.sin(a)*dist*.62];
          branch(bark,fork,elbow,.063,.036,0x73634f,5);branch(bark,elbow,end,.040,.014,0x7f7258,5);
          for(let m=0;m<(close?9:7);m++){
            const p=a+m*2.4,r=.21+random()*.44,px=end[0]+Math.cos(p)*r,pz=end[2]+Math.sin(p)*r;
            const width=1.14+random()*.63,height=1.05+random()*.59,py=end[1]+(random()-.50)*.54;
            spray(foliage,px,py,pz,width,height,p+.8,.28,1+random()*.23);
          }
          for(let m=0;m<(close?3:2);m++){
            const p=a+(random()-.5)*.8,d=dist+.14+random()*.24;
            const px=x+Math.cos(p)*d,pz=z+Math.sin(p)*d,py=end[1]-.13-random()*.17;
            branch(bark,end,[px,py+.04,pz],.011,.005,0x7f7350,3);
            mandarins.push([px,py,pz,.044+random()*.015,palette[Math.floor(random()*palette.length)]]);
          }
        }
        // Fruit-bearing twigs droop into the aisle; several fruits hang from
        // one spur at different heights, just below the glossy leaves.
        for(let spur=0;spur<(close?3:1);spur++){
          const dir=-side,reach=1.27+random()*.28,tipX=x+dir*reach,tipZ=z+(spur-1)*.62+(random()-.5)*.35,tipY=h*(.60+random()*.19);
          const fork=[x+dir*(reach-.62),tipY+.24,tipZ+.18],tip=[tipX,tipY,tipZ];
          branch(bark,[x+dir*.32,h*.56,z],fork,.036,.019,0x746449,5);
          branch(bark,fork,tip,.021,.012,0x85714e,4);
          spray(foliage,tipX,tipY+.17,tipZ,.58,.47,random()*6.28,.10,1.14);
          for(let n=0;n<4;n++){
            const a=n*2.4+random()*.45,r=.052+random()*.014;
            const px=tipX+Math.cos(a)*.10,pz=tipZ+Math.sin(a)*.10,py=tipY-.12-random()*.12;
            branch(bark,tip,[px,py+r*.78,pz],.007,.003,0x72694c,3);
            mandarins.push([px,py,pz,r,palette[(spur+j+11+n)%5]]);
          }
        }
      }
    }
    conform(group,[bark.mesh(group,matte(T)),earth.mesh(group,earthMaterial(T),false),water.mesh(group,matte(T,{roughness:.25}),false),
      foliage.mesh(group,leafMaterial(T,'citrus'))],[fruitCluster(T,group,mandarins)]);
  }
  register('osm-way-1430586858',{id:'quyt-hong-lai-vung',width:43,depth:53,yaw:1.18,viewAngle:2.03,viewElevation:.17,viewRadius:35,
    views:[{name:'Dọc liếp quýt',viewAngle:1.18,viewRadius:9,viewElevation:.09,height:3},{name:'Vườn quýt vào vụ',height:3.8}],
    photo:'https://dulich.dongthap.gov.vn/vi/detailnews/?id=news_619&t=lai-vung-them-mot-diem-tham-quan-vuon-quyt-hong-di-vao-hoat-dong',
    description:'Quýt chín ngả cam bên các mương tưới của nhà vườn Lai Vung. Tán cây thấp che những chùm trái ở đầu cành.'},citrusRows);

  function flowing(T,mode,clock){
    const falling=mode==='fall';
    const m=matte(T,{roughness:falling?.29:.24,transparent:falling,depthWrite:!falling});
    m.customProgramCacheKey=()=>mode;
    m.onBeforeCompile=s=>{
      s.uniforms.sightTime=clock;
      s.vertexShader='varying vec2 waterMetres;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nwaterMetres=uv;');
      s.fragmentShader='varying vec2 waterMetres;uniform float sightTime;\n'+s.fragmentShader.replace('#include <color_fragment>',falling?`#include <color_fragment>
        float strand=sin(waterMetres.x*53.+sin(waterMetres.y*1.74+sightTime*4.)*.8);
        float broken=sin(waterMetres.y*3.4+sightTime*8.+strand+waterMetres.x*23.)+.47*sin(waterMetres.y*8.+sightTime*18.+waterMetres.x*21.);
        float white=smoothstep(-1.15,1.2,broken+strand*.66);
        diffuseColor.rgb*=.83+.36*white;diffuseColor.a=.61+white*.38;`:`#include <color_fragment>
        vec2 p=waterMetres;float t=sightTime;
        float ripple=sin(p.x*1.7+p.y*3.8+t*1.3+.66*sin(p.x*.77-p.y*.91+t*.4));
        float glint=smoothstep(.84,1.,ripple)*(.5+.5*sin(p.x*.9+p.y*1.9-t*.6));
        diffuseColor.rgb*=.98+.036*ripple;diffuseColor.rgb+=vec3(.0025,.004,.003)*glint;`);
    };return m;
  }
  function animation(mesh,clock){
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    mesh.onBeforeRender=()=>{clock.value=motion.matches?0:performance.now()*.001%2048;};
  }
  function basaltMaterial(T){
    const m=matte(T);
    m.customProgramCacheKey=()=>'vuc-hom-volcanic-joints';
    m.onBeforeCompile=s=>{
      s.vertexShader='varying vec3 basaltPoint;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbasaltPoint=position;');
      s.fragmentShader=`varying vec3 basaltPoint;
        float vRockHash(vec2 p){vec3 q=fract(p.xyx*vec3(.1031,.1137,.1277));q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
        float vRockNoise(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);return mix(mix(vRockHash(i),vRockHash(i+vec2(1,0)),f.x),mix(vRockHash(i+vec2(0,1)),vRockHash(i+1.),f.x),f.y);}
      `+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=vec2(basaltPoint.x+basaltPoint.z*.61,basaltPoint.y);
        float strata=vRockNoise(p*vec2(3.5,1.3)),fleck=vRockNoise(p*6.4),v=vRockNoise(p*vec2(1.3,.18));
        float cracks=fract(p.y*(.74+.12*sin(p.x))+.18*strata+vRockNoise(p*vec2(.58,.24)));
        float fissure=(1.-smoothstep(.015,.07+fwidth(cracks)*.4,cracks))*(1.-smoothstep(.18,.65,fwidth(cracks)));
        diffuseColor.rgb*=.68+.40*strata+.24*fleck-.34*fissure;
        diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.71,.83,.63),smoothstep(.47,.76,v)*.70);
        diffuseColor.rgb*=mix(.72,1.,smoothstep(.3,4.,p.y));`);
    };return m;
  }
  function vucHom(T,{group,random}){
    const basalt=surface(T),bank=surface(T),cascade=surface(T),water=surface(T),foam=surface(T),rim=surface(T);
    const scene=new T.Group();group.add(scene);
    const clock={value:0},rock=[0x767369,0x877b6d,0x6e706b,0x807e73,0x867e71];
    // A slightly concave flank: the front row breaks off early in scattered
    // clusters. Each column has weathering along the joints and a fractured cap.
    function lipZ(x){return -7.4+12*(x/25)**2+1.8*Math.sin(x*.22);}
    function lipY(x){return 16.2+Math.min(1,Math.abs(x*.077))*(8.1+1.9*Math.sin(x*.17))+1.4*Math.sin(x*.23)+.91*Math.cos(x*.45);}
    const radius=.70,dx=Math.sqrt(3)*radius;
    for(let j=-2;j<=5;j++)for(let i=-24;i<=24;i++){
      const x=(i+(j&1)*.5)*dx,heel=lipZ(x),z=heel+j*radius*1.51;
      const top=lipY(x),fracture=.5+.5*Math.sin(x*.47+j*.85);
      let height=top+random()*.55;
      if(j>0&&Math.abs(x)<5.5)continue;
      if(j>0)height=Math.max(.17,top*(1-j*.205+fracture*.21)-random()*3);
      const tint=rock[Math.floor(random()*rock.length)],rot=Math.PI/2;
      const leanX=(x<0?-1:1)*(.45+Math.abs(x)*.10),leanZ=x<-8?-1.8:1.1;
      const base=-2.3,ring=[];
      for(let f=0;f<6;f++){
        const a=rot+f*Math.PI/3,rad=radius*(.93+random()*.08);
        ring.push([rad*Math.cos(a),rad*Math.sin(a),random()*.25,random()]);
      }
      const slip=random()*.13,split=.3+slip,layer=.60+slip;
      const layers=[[0,.93,.44],[.12,1,.67],[split,.88,.66],[split+.016,1.11,.83],[layer,.93,.91],[layer+.021,1,.85],[.975,1,.99],[1,.84,1.09]];
      for(let f=0;f<6;f++){
        const pair=[ring[f],ring[(f+1)%6]],shade=.78+ring[f][3]*.24;
        let prev;
        for(const [t,r,v] of layers){
          const line=pair.map(([u,w,crack])=>basalt.vertex(x+u*r+leanX*t,base+(height-base+crack)*t,z+w*r-leanZ*t,tint,v*shade));
          if(prev)basalt.quad(prev[0],line[0],line[1],prev[1]);prev=line;
        }
        const cap=basalt.vertex(x+leanX,height+.10,z-leanZ,0x918b7d,1.02);
        basalt.indices.push(cap,prev[1],prev[0]);
      }
      if(j===-2||j===-1&&random()>.85){
        const h=1.7+random()*2.1;
        for(let n=0;n<3;n++)spray(rim,x,height+h*.4,z-2,h*2.0,h*1.3,random()*Math.PI,h*.23,.76+random()*.23);
      }
    }
    // The broken face continues into a vegetated slope behind the rim. Side
    // buttresses descend to the banks so the column wall has no cut-off ends.
    const back=surface(T);
    let prevBank;
    for(let i=-20;i<=20;i++){
      const x=i*2,core=Math.max(-28,Math.min(28,x)),taper=Math.min(1,(40-Math.abs(x))/12);
      const front=lipZ(core)-2.0,crest=lipY(core)*taper;
      const row=[];
      for(let j=0;j<=10;j++){
        const t=j/10,z=front-1-t*(21+9*Math.cos(core*.12)),y=crest*(1-t**1.55)-2*t+.9*Math.sin(i*.8+j)*taper*t*(1-t);
        row.push(back.vertex(x,y,z,t<.2?0x65684c:0x556747,.77+random()*.30));
        if(i>-20&&j)back.quad(prevBank[j-1],row[j-1],row[j],prevBank[j]);
        if(t>.05&&t<.9&&taper>.12){
          const h=1.4+random()*2.8;
          spray(rim,x,y+h*.46,z,h*2,h*1.25,random()*6.28,h*.33,.80+random()*.32);
          spray(rim,x,y+h*.55,z,h*1.93,h*1.13,random()*6.28,h*.31,.85+random()*.32);
        }
      }
      prevBank=row;
    }
    let previous;
    const centerZ=8;
    for(let j=0;j<=9;j++){
      const ring=[],t=j/9;
      for(let k=0;k<=100;k++){
        const a=k/100*Math.PI*2,outline=1+.056*Math.sin(a*5+.2)+.03*Math.cos(a*9);
        const x=Math.cos(a)*19.9*outline*t,z=centerZ+Math.sin(a)*17.9*outline*t;
        ring.push(water.vertex(x,.34,z,t>.86?0x567560:t>.55?0x32675f:0x245d59,.97+.06*Math.cos(a*3)*t));
        if(j&&k)water.quad(previous[k-1],previous[k],ring[k],ring[k-1]);
      }
      previous=ring;
    }
    // Pebble beach tapers to the outlet. A low sloping bank closes the pool
    // edge, including the downhill side where the underlying DEM is coarser.
    for(let k=0;k<100;k++){
      function edge(i,dist,h){
        const a=i/100*Math.PI*2,b=1+.056*Math.sin(a*5+.2)+.03*Math.cos(a*9);
        return bank.vertex(Math.cos(a)*(19.9+dist)*b,h,centerZ+Math.sin(a)*(17.9+dist)*b,dist>0?0x777358:0x727b62);
      }
      bank.quad(edge(k,-.4,.29),edge(k,1.1,.56),edge(k+1,1.1,.56),edge(k+1,-.4,.29));
      bank.quad(edge(k,1.1,.56),edge(k,3.4,-2.9),edge(k+1,3.4,-2.9),edge(k+1,1.1,.56));
    }
    for(let i=0;i<175;i++){
      const a=random()*Math.PI*2,d=.95+random()*.17,r=.10+random()**2*.68;
      const x=Math.cos(a)*20.3*d,z=centerZ+Math.sin(a)*18.6*d;
      const top=bank.vertex(x+.17*r,.35+r*.61,z+.1*r,0x908c80);
      let old;
      for(let f=0;f<=7;f++){
        const b=f/7*Math.PI*2,k=bank.vertex(x+Math.cos(b)*r,.22,z+Math.sin(b)*r*.76,0x827967,.88+random()*.24);
        if(f)bank.indices.push(top,k,old);old=k;
      }
    }
    for(const [left,right] of [[-4.54,-3.76],[-3.63,-3.11],[-2.96,-2.7],[.65,2.85],[3.01,3.25],[3.46,3.60]]){
      const columns=Math.ceil((right-left)/.23),segments=24;
      let prev;
      for(let j=0;j<=segments;j++){
        const t=j/segments,line=[];
        for(let i=0;i<=columns;i++){
          const x=left+(right-left)*i/columns,run=2.3*(1-Math.exp(-t*7));
          const z=lipZ(x)+.65+run+1.35*t+.13*Math.sin(x*13+t*8),height=.43+(lipY(x)-.24)*(1-t*t);
          line.push(cascade.vertex(x+.33*Math.sin(t*3.3)+Math.sin(x*8)*t*.16,height,z,0xe4eee6,.99,x,height));
          if(j&&i)cascade.quad(prev[i-1],line[i-1],line[i],prev[i]);
        }
        prev=line;
      }
      for(let n=0;n<95;n++){
        const x=left+(right-left)*random(),z=lipZ(x)+4.2+random()*2.96,r=.045+random()*.19;
        const p=foam.vertex(x-r,.36,z,0x9db7ac,.86),q=foam.vertex(x,.371,z-r*.61,0xe2ebe1);
        const s=foam.vertex(x+r,.36,z,0xc6d6c9),u=foam.vertex(x,.36,z+r*.61,0x9bb9ae);foam.quad(p,q,s,u);
      }
    }
    basalt.mesh(scene,basaltMaterial(T));bank.mesh(scene,matte(T));back.mesh(scene,matte(T));
    rim.mesh(scene,leafMaterial(T,'paperbark'));
    const pool=water.mesh(scene,flowing(T,'basin',clock),false);animation(pool,clock);
    cascade.mesh(scene,flowing(T,'fall',clock),false);foam.mesh(scene,matte(T,{roughness:.4}),false);
    group.userData.fitGround=height=>{
      // Use one level for both the receiving pool and the feet of the ribbons.
      let level=height(0,centerZ);
      for(let i=0;i<16;i++){const a=i*Math.PI/8;level=Math.max(level,height(20*Math.cos(a),centerZ+18*Math.sin(a)));}
      scene.position.y=level;
    };
  }
  register('osm-node-10745380079',{id:'thac-vuc-hom',name:'Thác Vực Hòm',city:'Tuy An',width:62,depth:41,
    formerProvince:'Phú Yên',yaw:-2.70,viewAngle:-2.85,viewElevation:.07,viewRadius:42,
    photo:'https://kinhtedothi.vn/kham-pha-thac-vuc-hom-tuyet-tinh-coc-tho-mong-cua-phu-yen.html',
    description:'Nước suối đổ qua các khe giữa vách bazan dạng cột xuống vũng nước ở chân thác. Những đầu cột gãy tạo thành các bậc đá hai bên dòng chảy.'},vucHom);

  function melaleucaForest(T,{group,random}){
    const trunks=surface(T),peels=surface(T),leaves=surface(T),plants=surface(T),pool=surface(T),peat=surface(T),clock={value:0};
    // Local offsets along mapped waterway 913062313 in the peat forest. +Z is
    // south. Tràm clusters and floating plants grow back from this centreline.
    const channel=[[-42,-61],[-32,-56],[-25,-48],[-22,-37],[-17,-18],[-10,-3],[-3,3],[10,8],[38,13],[63,13]];
    const distance=(x,z)=>{
      let near=Infinity;
      for(let i=1;i<channel.length;i++){
        const [ax,az]=channel[i-1],[bx,bz]=channel[i],dx=bx-ax,dz=bz-az;
        const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
        near=Math.min(near,Math.hypot(x-ax-t*dx,z-az-t*dz));
      }
      return near;
    };
    let old;
    for(let i=0;i<channel.length;i++){
      const [x,z]=channel[i],[ax,az]=channel[Math.max(0,i-1)],[bx,bz]=channel[Math.min(channel.length-1,i+1)];
      const d=Math.hypot(bx-ax,bz-az),nx=(az-bz)/d,nz=(bx-ax)/d,w=2.52+.49*Math.sin(i*1.7);
      const pair=[-1,1].map(side=>[x+nx*w*side,z+nz*w*side]);
      if(old)for(let side=0;side<2;side++){
        const a=old[side],b=pair[side],c=pair[1-side],d=old[1-side];
        if(side===0)pool.quad(...[a,b,c,d].map(([u,v])=>pool.vertex(u,.135,v,0x304a3b)));
        const sign=side?1:-1;
        peat.quad(peat.vertex(a[0],.13,a[1],0x312f20),peat.vertex(b[0],.13,b[1],0x3e4229),
          peat.vertex(b[0]+nx*.98*sign,.29,b[1]+nz*.98*sign,0x676844),peat.vertex(a[0]+nx*.98*sign,.28,a[1]+nz*.98*sign,0x565838));
      }
      old=pair;
    }
    for(let i=0;i<330;i++){
      const x=(random()-.5)*103,z=(random()-.5)*80,fromWater=distance(x,z);
      // A small clearing opens a sightline along the bend in the channel.
      if(fromWater<3.7||Math.abs(x*.89+z*.45)<6&&z>2&&z<23)continue;
      const height=4.6+random()*5.8,r=.125+random()*.15,leanX=(random()-.5)*1.8,leanZ=(random()-.5)*1.8;
      const knee=[x+leanX*.39,height*.43,z+leanZ*.34],crown=[x+leanX,height*.85,z+leanZ];
      const bark=[0xc2bba0,0xd1c7aa,0xb9b5a1,0xc9b9a2][i%4];
      branch(trunks,[x,-.1,z],knee,r*1.22,r*.77,bark);branch(trunks,knee,crown,r*.77,r*.25,bark);
      for(let j=0;j<13;j++){
        const a=random()*6.28,v=random()*.52,w=.04+random()*.09,h=.23+random()*.82;
        const px=x+leanX*v*.89+Math.cos(a)*r*(1.20-v*.80),pz=z+leanZ*v*.8+Math.sin(a)*r*(1.20-v*.80),py=height*v;
        const p=peels.vertex(px,py,pz,0x8c8069),q=peels.vertex(px+w*Math.sin(a),py+.06,pz-w*Math.cos(a),0xb1a38a);
        const u=peels.vertex(px+w*.62*Math.sin(a)+Math.cos(a)*w*.27,py+h,pz-w*.62*Math.cos(a)+Math.sin(a)*w*.27,0xded4b6);
        peels.indices.push(p,q,u);
      }
      for(let k=0;k<5;k++){
        const a=i+k*2.4,reach=.76+random()*1.43;
        const tip=[crown[0]+Math.cos(a)*reach,height*(.80+random()*.21),crown[2]+Math.sin(a)*reach];
        const start=[knee[0]+(crown[0]-knee[0])*.34,height*.57,knee[2]+(crown[2]-knee[2])*.34];
        branch(trunks,start,tip,r*.42,.018,bark,5);
        for(let k=0;k<7;k++){
          const angle=random()*6.28,offset=random()*.85,w=1.9+random()*1.45;
          spray(leaves,tip[0]+Math.cos(angle)*offset,tip[1]+random()*.71,tip[2]+Math.sin(angle)*offset,w,w*1.12,angle,w*.22,1.14+random()*.24);
        }
      }
    }
    // Reeds, sedges and scrub fill the wet understorey. Their bases stay on
    // the peat bank, leaving the centre of the watercourse readable at eye level.
    for(let n=0;n<1600;n++){
      const x=(random()-.5)*100,z=(random()-.5)*74,d=distance(x,z);
      if(d<2.75||d>21||Math.sin(x*.34+z*.18)+Math.cos(x*.11-z*.16)<-.78)continue;
      const h=.48+random()*.89;
      for(let j=0;j<12;j++){
        const a=random()*6.28,l=h*(.64+random()*.53),dx=Math.cos(a),dz=Math.sin(a);
        const px=x+(random()-.5)*.41,pz=z+(random()-.5)*.41;
        const p=plants.vertex(px,.095,pz,0x626d3f),q=plants.vertex(px+dx*l*.2-dz*.035,l*.58,pz+dz*l*.2+dx*.035,0x93a366);
        const tip=plants.vertex(px+dx*l*.42,l,pz+dz*l*.42,0xaeb17d),r=plants.vertex(px+dx*l*.20+dz*.028,l*.56,pz+dz*l*.2-dx*.028,0x798d58);
        plants.quad(p,q,tip,r);
      }
    }
    for(let n=0;n<1900;n++){
      const x=(random()-.5)*100,z=(random()-.5)*77,d=distance(x,z);
      if(d<1.35||d>3.45)continue;
      for(let j=0;j<12;j++){
        const px=x+(random()-.5)*.85,pz=z+(random()-.5)*.85,rad=.09+random()*.17;
        for(let f=0;f<6;f++){
          const a=f*Math.PI/3+random()*.32,vx=rad*Math.cos(a),vz=rad*Math.sin(a),h=.18+random()*.10;
          const p=plants.vertex(px,.15,pz,0x567641),q=plants.vertex(px+vx*.58-vz*.27,h,pz+vz*.58+vx*.27,0x76a04a);
          const r=plants.vertex(px+vx,h+.035,pz+vz,0x93af5f),s=plants.vertex(px+vx*.57+vz*.28,h*.94,pz+vz*.57-vx*.28,0x70954c);plants.quad(p,q,r,s);
        }
      }
    }
    const water=pool.mesh(group,flowing(T,'peat-water',clock),false);animation(water,clock);
    conform(group,[water,peat.mesh(group,earthMaterial(T),false),plants.mesh(group,matte(T),false),trunks.mesh(group,matte(T)),
      peels.mesh(group,matte(T)),leaves.mesh(group,leafMaterial(T,'paperbark'))]);
  }
  register('osm-relation-7138178',{id:'rung-tram-u-minh-thuong',name:'Vườn quốc gia U Minh Thượng',city:'U Minh Thượng',
    lon:105.09270,lat:9.601695,width:104,depth:88,yaw:0,viewRadius:20,viewAngle:1.18,viewElevation:.12,
    views:[{name:'Khúc nước trong rừng',height:3,offset:[-2,1],viewAngle:1.18,viewElevation:.13,viewRadius:15.5},
      {name:'Tán rừng tràm',height:9.7,viewAngle:.64,viewElevation:.36,viewRadius:51}],
    photo:'https://sdl.angiang.gov.vn/vung-u-minh-thuong-diem-du-lich-sinh-thai-hap-dan',
    description:'Bên con rạch trong vùng đất than bùn là những thân tràm vỏ sáng màu bong thành lớp mỏng. Các đám cây thủy sinh tụ sát hai mép nước.'},melaleucaForest);
})();
