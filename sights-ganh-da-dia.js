'use strict';
(() => {
  const id='ganh-da-dia',catalogId='osm-way-1229067977',lon=109.29363,lat=13.35419;
  const pin=window.VietnamTourism?.entries.find(p=>p.id===catalogId);
  const source='https://dsvh.gov.vn/ganh-da-dia-tinh-phu-yen-3307',vr='https://daklakvrtour.com/tour/43/index.html';
  // Survey 2026-11-23. OSM w1229067977 maps the bare basalt, w1229067979
  // maps the south steps and w1229067980 the landward path. The north and
  // south faces were cross-checked against the province's nodes 16, 21, 11,
  // 12 and 6, plus the drone at [109.294522,13.354379], altitude 94.1 m.
  // The ground panoramas lack GPS; their viewpoints are identified by shore
  // and skyline. Photographic cross-check: Prince Roy, 2016-04-17, CC BY 2.0:
  // https://commons.wikimedia.org/wiki/File:Basalt_rocks_at_G%C3%A0nh_%C4%90%C3%A1_%C4%90%C4%A9a.jpg
  // Compare the site survey and field photographs: https://diamoitruong.com/2015/11/21/gioi-thieu-dia-di-san-bo-bien-ganh-da-dia-tuy-an-phu-yen/
  // Heritage dossier dimensions: ~43 cm mean cross section, 25–30 cm
  // transverse joints, southern steps 0.5–1 m / +3.5 m / +2 m. Individual
  // prisms, tidal stage, small fractures and plants are interpreted.
  const rock=[
    [9.99,8.88],[10.67,7.79],[14.32,7.27],[16.15,10.64],[17.19,13.11],[21.49,14.93],[26.18,18.42],
    [29.85,19.46],[32.06,19.59],[33.89,24.13],[36.23,25.94],[38.45,24.51],[39.36,20.63],[37.93,16.74],
    [36.75,12.84],[38.71,10.64],[41.06,8.44],[41.97,1.69],[38.19,-10.5],[31.28,-14.52],[25.53,-15.68],
    [21.62,-16.97],[19.93,-20.99],[21.23,-25.14],[23.84,-28.28],[21.53,-29.65],[16.41,-31.11],[13.13,-30.14],
    [11.79,-25.42],[9.11,-20.83],[10.21,-19.5],[13.25,-19.73],[13.74,-15.01],[16.17,-12.48],[16.17,-7.52],
    [13.37,-7.64],[10.21,-9.93],[8.02,-10.3],[7.29,-8.72],[5.22,-5.46],[0.54,-4.41],[-0.46,-1.76],
    [-2.91,4.44],[-3.29,7.62],[-4.57,9.9],[-6.49,12.06],[-10.96,11.05],[-14.79,9.15],[-17.34,7.24],
    [-20.92,5.58],[-25.01,3.81],[-27.18,3.3],[-26.8,1.52],[-25.77,-1.02],[-27.31,-2.67],[-33.69,-6.1],
    [-35.87,-5.21],[-40.59,-7.24],[-41.13,-5.07],[-35.99,-2.08],[-33.41,3.83],[-30.63,6.6],[-29.45,10.34],
    [-27.06,13.7],[-26.26,17.45],[-24.87,20.8],[-22.49,22.19],[-19.32,20.6],[-17.14,17.85],[-15.16,18.24],
    [-12.18,22.78],[-8.2,23.17],[-4.24,20.02],[-1.06,21.0],[-0.27,24.76],[3.71,26.93],[7.67,31.39],
    [13.28,31.91],[16.28,30.09],[16.15,25.55],[13.8,22.19],[10.67,18.29],[8.59,13.63],[8.72,10.91]
  ];
  const southern=rock.slice(56,84).concat(rock.slice(0,2));
  const northern=rock.slice(0,26);
  const southBack=[[-32,1],[-28,-1],[-23,-1.5],[-18,-.5],[-13,2],[-8,2.9],[-4,1.4],[1,-2.3],[5,-4.6],[10,-5.4],[13,-3.1],[12.5,2.7],[9,7.9],[7.8,12.5],[3.7,16.3],[-9,17],[-20,11],[-31,6]];
  const tidePool=[[27.25,3.35],[28.67,3.02],[30.25,3.45],[31.35,4.18],[31.43,5.45],[32.16,6.50],[31.51,7.67],[29.84,8.29],[28.74,8.21],[27.58,7.40],[27.11,6.34],[26.19,5.82],[26.57,4.42]];
  const steps=[[-32.21,-27.67],[-30.68,-23.26],[-27.09,-13.1],[-24.2,-4.96],[-23.52,2.66]];
  const unpaved=[[16.82,-66.39],[14.24,-57.35],[6.88,-47.27],[-9.86,-22.10],[-15.22,-14.21],[-32.21,-27.67]];
  const coast=window.VietnamSightCoasts?.find(c=>Math.abs(c.lon-lon)<.0001);
  const project=ring=>ring.map(([a,b])=>[(a-lon)*108335,(lat-b)*110720]);
  const seaRing=coast&&project(coast.ring),seaHoles=coast?coast.holes.map(project):[];
  const tau=2*Math.PI,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function smooth(a,b,n){const t=clamp((n-a)/(b-a),0,1);return t*t*(3-2*t);}
  function noise(i,j){
    let n=Math.imul(i,374761393)+Math.imul(j,668265263);n=Math.imul(n^(n>>>13),1274126177);
    return ((n^(n>>>16))>>>0)/4294967296;
  }
  const inside=(p,x,z)=>{
    let hit=false;for(let i=0,j=p.length-1;i<p.length;j=i++){
      const [a,b]=p[i],[c,d]=p[j];if((b>z)!==(d>z)&&x<(c-a)*(z-b)/(d-b)+a)hit=!hit;
    }return hit;
  };
  function distance(p,x,z,closed=false){
    let near=Infinity;
    for(let i=closed?0:1;i<p.length;i++){
      const [a,b]=p[(i+p.length-1)%p.length],[c,d]=p[i],u=c-a,v=d-b;
      const t=clamp(((x-a)*u+(z-b)*v)/(u*u+v*v||1),0,1),dx=x-a-u*t,dz=z-b-v*t;
      near=Math.min(near,dx*dx+dz*dz);
    }return Math.sqrt(near);
  }
  // The southern exposures point SSE; the adjacent north tongue actually
  // projects ESE. Heights follow shoreline setbacks, not artificial rings.
  function surface(x,z){
    const north=x>9.6+Math.max(0,z-9)*.59||(z< -4&&x> -2),d=distance(north?northern:southern,x,z);
    const warp=.54*Math.sin(.57*x+.34*z)+.48*Math.cos(.63*z-.19*x)+.43*Math.sin(.91*x-.13*z);
    if(north)return .28+1.43*smooth(-.2,8.1,d+warp)+.52*smooth(4.9,10.9,d)+.17*Math.sin(x*.26+z*.13);
    const r=d+warp+.64*Math.sin(.24*x+.11*z);
    return .40+Math.min(1.35,d*.112)+3.04*smooth(5.1,9.75,r)+1.82*smooth(10.1,15.32,r)+.20*Math.sin(.39*x+.23*z);
  }
  function material(T){
    const m=window.createSightStoneMaterial(T,true),base=m.onBeforeCompile;
    m.customProgramCacheKey=()=>'ganh-da-dia-weathered-basalt';
    m.onBeforeCompile=s=>{base(s);
      s.fragmentShader='float ganhGrain(vec2 p){vec3 q=fract(p.xyx*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z); }\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 pitUV=rockPoint.xz*43.+rockPoint.y*vec2(9.,4.);vec2 cell=floor(pitUV),jitter=vec2(ganhGrain(cell),ganhGrain(cell+14.));
        float pit=1.-smoothstep(.05,.22+min(.2,length(fwidth(pitUV))),length(fract(pitUV)-(.3+.4*jitter)));
        diffuseColor.rgb*=1.-.38*pit*(1.-smoothstep(.3,1.6,length(fwidth(pitUV))));
        float mineralPatch=sin(rockPoint.x*.63+rockPoint.z*.29+2.*sin(rockPoint.z*.37));diffuseColor.rgb*=.95+.06*mineralPatch;`);};
    return m;
  }
  function buffer(T,group,mat,pos,col,shi,idx,name){
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    if(col)geo.setAttribute('color',new T.Float32BufferAttribute(col,3));
    if(shi)geo.setAttribute('shaft',new T.Float32BufferAttribute(shi,1));geo.setIndex(idx);geo.computeVertexNormals();
    const mesh=new T.Mesh(geo,mat);mesh.castShadow=mesh.receiveShadow=true;mesh.name=name;group.add(mesh);return mesh;
  }
  // Voronoi half-planes give genuinely shared, irregular joints. Only the
  // exposed length of a shaft is modelled. Deep internal faces are omitted.
  function* basalt(T,group){
    const h=.435,dz=h*.8660254,cols=229,rows=186,ox=-49,oz=-34,cells=new Array(rows*cols),pos=[],col=[],shafts=[],idx=[];
    const low=new T.Color(0x5c5c56),high=new T.Color(0xa69f8b),tint=new T.Color(),sideCol=new T.Color(),dark=new T.Color(0x565a52);
    const basaltMat=material(T);
    function vertex(x,y,z,c,shade,axis){
      const k=pos.length/3;pos.push(x,y,z);col.push(c.r*shade,c.g*shade,c.b*shade);shafts.push(axis);return k;
    }
    for(let j=0;j<rows;j++){
      if(!(j%6))yield;
      for(let i=0;i<cols;i++){
        const x=ox+h*(i+(j&1)*.5+.49*(noise(i,j)-.5)),z=oz+dz*(j+.46*(noise(j,i+631)-.5));
        const shore=inside(rock,x,z),back=inside(southBack,x,z),pool=inside(tidePool,x,z);
        const wet=!shore&&!back&&!pool&&seaRing&&inside(seaRing,x,z);
        const underDist=wet?distance(x>9.6+Math.max(0,z-9)*.59?northern:southern,x,z):Infinity;
        const under=underDist<3.2+.75*Math.sin(z*.43)&&noise(i+52,j)>.24*smooth(.64,3.7,underDist);
        let top=shore||back?surface(x,z):null;
        if(under)top=-.23-.35*underDist+.12*Math.sin(z*.7+x*.25);
        if(pool)top=null;
        if(top!=null){
          const small=.105*(noise(i+5,j)-.5)+.067*Math.sin(x*.92-z*.32);
          top=Math.round((top+small)/.18)*.18+.065*noise(i,j+185);
        }
        cells[j*cols+i]={x,z,top};
      }
    }
    for(let j=2;j<rows-2;j++){
      if(!(j%5))yield;
      for(let i=2;i<cols-2;i++){
        const a=cells[j*cols+i];if(a.top==null)continue;
        const {x,z,top}=a,phase=noise(i,j+27)*1.6,neighbors=[];
        let ring=[[-h,-h],[-h,h],[h,h],[h,-h]];
        for(let v=-2;v<=2;v++)for(let u=-2;u<=2;u++){
          if(!v&&!u)continue;
          const b=cells[(j+v)*cols+i+u],dx=b.x-x,ds=b.z-z,l=(dx*dx+ds*ds)/2;
          if(l>1.0*h*h)continue;
          neighbors.push([dx,ds,l,b]);const clip=[];
          for(let k=0;k<ring.length;k++){const p=ring[k],q=ring[(k+1)%ring.length];
            const fp=p[0]*dx+p[1]*ds-l,fq=q[0]*dx+q[1]*ds-l;
            if(fp<=0)clip.push(p);
            if((fp<0)!==(fq<0)){const t=fp/(fp-fq);clip.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);}
          }ring=clip;
        }
        if(ring.length<3)continue;
        const f=noise(i+632,j),salt=.35+.22*Math.sin(x*.21+z*.34)+.18*Math.sin(.71*z-.31*x)+.19*f;
        tint.copy(low).lerp(high,clamp(salt,0,1)).lerp(dark,.27*(1-smooth(.0,2,top)));
        sideCol.copy(tint).multiplyScalar(.82+.11*f);
        const mid=vertex(x,top+.010+.010*f,z,tint,1+.05*f,phase),caps=[],rims=[];
        const slope=.12*Math.sin(x*.38+z*.32),tip=.12*Math.cos(.22*x-.64*z);
        for(const [u,v] of ring){
          const y=top+u*slope+v*tip,round=.835+.10*f;
          caps.push(vertex(x+round*u,y,z+round*v,tint,.96+.06*f,phase));
          rims.push(vertex(x+.978*u,y-.034-.022*f,z+.978*v,sideCol,.90+.07*f,phase-.05));
        }
        for(let k=0;k<ring.length;k++){
          const l=(k+1)%ring.length;idx.push(mid,caps[k],caps[l],caps[k],rims[k],rims[l],caps[k],rims[l],caps[l]);
          const [u,v]=ring[k],[u2,v2]=ring[l],mx=(u+u2)/2,mz=(v+v2)/2;
          let side=null,err=Infinity;
          for(const [px,pz,limit,b] of neighbors){const e=Math.abs(px*mx+pz*mz-limit);if(e<err){side=b;err=e;}}
          const depth=Math.max(.063,top-(side?.top??(top<0?-1.75:Math.min(-.52,top-.70)))+.032);
          // A roughly level neighbour already hides the shaft; the bevel itself
          // carries the visible joint and is sufficient on the flat benches.
          if(side?.top!=null&&depth<.092)continue;
          const bottom=top-depth,lean=.055*(1+.3*Math.sin(z*.3))*Math.min(depth,2);
          const b0=vertex(x+.99*u-lean,bottom,z+.99*v,sideCol,.65+.14*f,phase-depth);
          const b1=vertex(x+.99*u2-lean,bottom,z+.99*v2,sideCol,.65+.14*f,phase-depth);
          idx.push(rims[k],b0,b1,rims[k],b1,rims[l]);
        }
      }
    }
    buffer(T,group,basaltMat,pos,col,shafts,idx,'Các trụ đứng và các bậc của mũi nam');
  }
  function folded(T,group){
    const mat=material(T),pos=[],cols=[],shafts=[],idx=[],tint=new T.Color(),lo=new T.Color(0x6b6c67),hi=new T.Color(0xb2a392);
    // XZ curve digitised along the dark crown under the upper tongue and the
    // rocky notch at its northern end. Normal points onto the lower bench.
    const spine=[[11.9,-24.6],[14.4,-20.2],[17.6,-16.2],[19.7,-13.4],[21.2,-10.4],[20.1,-6.1],[18.6,-3.0],[17.3,-.4],[17.2,1.5]];
    const runs=[];let length=0;
    for(let i=1;i<spine.length;i++){const [a,b]=spine[i-1],[c,d]=spine[i],len=Math.hypot(c-a,d-b);runs.push({a,b,c,d,len,start:length});length+=len;}
    function station(u){
      const r=runs.find(v=>u<=v.len+v.start)||runs.at(-1),t=clamp((u-r.start)/r.len,0,1);
      const tx=(r.c-r.a)/r.len,tz=(r.d-r.b)/r.len;
      return [r.a+(r.c-r.a)*t,r.b+(r.d-r.b)*t,tx,tz,tz,-tx];
    }
    function vert(a,c,f,dist){const n=pos.length/3;pos.push(...a);cols.push(c.r*f,c.g*f,c.b*f);shafts.push(dist);return n;}
    const span=.442;
    for(let j=0;j<13;j++)for(let i=0;i<Math.floor(length/span);i++){
      const u=(i+(j%2)*.5+.11*(noise(i+231,j)-.5))*span,frac=u/length,[x,z,tx,tz,nx,nz]=station(u),r=noise(i,j+314);
      const crest=(1-((frac-.51)/.58)**2)*(9.3+1.75*Math.sin(u*.52))+1.30*Math.sin(u*.84+.26);
      if(j>crest||j<1&&frac<.07)continue;
      const y=1.02+j*.385+.57*Math.sin(frac*Math.PI)+.12*Math.cos(u*.61)+.045*(noise(i+43,j)-.5),f=j/Math.max(1,crest);
      const run=2.34+.46*r,slide=.45*Math.sin(frac*Math.PI)+2.15*(1-f)**.68+.31*Math.sin(u*.54+f*.82)+.17*r;
      tint.copy(lo).lerp(hi,.24+.37*r+.18*f);
      const rings=[],capAngle=.12+.56*(1-f),ph=.3*r;
      // Five cross-sections follow the curve between the near-vertical root
      // and the horizontal, seaward-facing column end on the upper tier.
      for(let q=0;q<=4;q++){
        const t=q/4,a=capAngle+.63*(1-t)**1.8,cs=Math.cos(a),sn=Math.sin(a);
        const along=slide+(t-1)*run,drop=(1-t)*run*(.12+.42*(1-t));
        const center=[x+nx*along,y-drop,z+nz*along],ring=[];
        for(let k=0;k<6;k++){
          const ang=(k/6)*tau+.18*(noise(i+765,j+9)-.5),irregular=.96+.11*noise(i*7+k,j+91),px=.246*Math.cos(ang)*irregular,py=.236*Math.sin(ang)*irregular;
          ring.push(vert([center[0]+tx*px-nx*sn*py,center[1]+cs*py,center[2]+tz*px-nz*sn*py],tint,.80+.10*Math.sin(ang)+.07*t,ph+t*run));
        }
        if(q)for(let k=0;k<6;k++){const a=rings.at(-1)[k],b=rings.at(-1)[(k+1)%6],c=ring[k],d=ring[(k+1)%6];idx.push(a,b,c,b,d,c);}
        rings.push(ring);
      }
      const ring=rings.at(-1),cap=[],edge=[],cx=x+nx*slide,cz=z+nz*slide;
      for(let k=0;k<6;k++){const a=ring[k]*3,lx=pos[a],ly=pos[a+1],lz=pos[a+2];
        edge.push(vert([lx,ly,lz],tint,.78,ph+run));cap.push(vert([cx+(lx-cx)*.90+nx*.019,y+(ly-y)*.90,cz+(lz-cz)*.90+nz*.019],tint,1.07,ph+run));}
      for(let k=0;k<6;k++){const l=(k+1)%6;idx.push(edge[k],edge[l],cap[k],edge[l],cap[l],cap[k]);}
      for(let k=1;k<5;k++)idx.push(cap[0],cap[k+1],cap[k]);
    }
    mat.side=T.DoubleSide;mat.flatShading=true;buffer(T,group,mat,pos,cols,shafts,idx,'Dải trụ bazan uốn cong và các đầu trụ nằm ngang ở mũi bắc');
    // The joints emerge from a weathered rocky crown, visible behind the
    // fan in node21 and above it in node16. This remains connected to the
    // landward end of the shafts even where the cliff turns a corner.
    const surfacePos=[],surfaceCols=[],surfaceIdx=[],sides=[-7.1,-5.4,-4.2,-3.1,-2.1,-1.15],samples=71;
    const soil=new T.Color(0x88765b),fresh=new T.Color(0x665e4c);
    for(let i=0;i<=samples;i++){
      const u=length*i/samples,frac=i/samples,[x,z,tx,tz,nx,nz]=station(u);
      const crest=(1-((frac-.51)/.58)**2)*(9.3+1.75*Math.sin(u*.52))+1.30*Math.sin(u*.84+.26);
      const peak=1.02+Math.max(1,crest)*.385+.57*Math.sin(frac*Math.PI);
      for(let j=0;j<sides.length;j++){
        const d=sides[j],px=x+nx*d,pz=z+nz*d,low=bench(px,pz)-.28;
        const shape=[0,.53,.91,1.0,.86,.52][j]*smooth(0,.13,frac)*smooth(0,.13,1-frac);
        const rugged=.23*Math.sin(u*1.42+j*.4)+.13*Math.sin(u*2.55-j*.77)+.18*noise(i,j+66);
        const y=low+shape*(Math.max(low,peak+.12+rugged)-low);
        surfacePos.push(px,y,pz);const color=fresh.clone().lerp(soil,.27+.65*noise(i,j+30));surfaceCols.push(color.r,color.g,color.b);
        if(i&&j){const n=i*sides.length+j;surfaceIdx.push(n-1,n,n-sides.length-1,n-sides.length-1,n,n-sides.length);}
      }
    }
    const dome=buffer(T,group,material(T),surfacePos,surfaceCols,surfacePos.filter((_,i)=>i%3===1),surfaceIdx,'Đỉnh trụ phong hóa phía bắc');dome.material.side=T.DoubleSide;
    const blocks=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({roughness:.97}),95);
    const temp=new T.Object3D(),c=new T.Color();
    for(let i=0;i<95;i++){
      const row=5+Math.floor(noise(i,476)*(samples-10)),j=1+Math.floor(noise(76,i)*4),n=(row*sides.length+j)*3,r=.13+noise(i,233)*.44;
      temp.position.set(surfacePos[n],surfacePos[n+1]-.055,surfacePos[n+2]);temp.rotation.set(noise(i,254),i*1.73,noise(i,916));
      temp.scale.set(r*1.16,r*(.42+.62*noise(i,29)),r*.85);temp.updateMatrix();blocks.setMatrixAt(i,temp.matrix);
      c.setHex(0x817665).lerp(new T.Color(0xa88c67),noise(i+6,44));blocks.setColorAt(i,c);
    }
    blocks.instanceMatrix.needsUpdate=true;blocks.computeBoundingSphere();blocks.castShadow=true;group.add(blocks);

  }
  function planGeometry(T,perimeter,holes=[]){
    const shape=p=>p.slice(0,p.at(-1)[0]===p[0][0]&&p.at(-1)[1]===p[0][1]?-1:undefined);
    const outline=shape(perimeter),cutouts=holes.map(shape),flat=[...outline,...cutouts.flat()];
    const xy=p=>p.map(([x,z])=>new T.Vector2(x,-z));
    const indices=T.ShapeUtils.triangulateShape(xy(outline),cutouts.map(xy)).flat(),geo=new T.BufferGeometry();
    geo.setAttribute('position',new T.Float32BufferAttribute(flat.flatMap(([x,z])=>[x,0,z]),3));geo.setIndex(indices);geo.computeVertexNormals();return geo;
  }
  function water(T,g,pool=false){
    if(!pool&&!seaRing)return;
    const mat=new T.MeshStandardMaterial({color:pool?0x425e55:0x749f9c,metalness:.08,roughness:.34,transparent:true,opacity:pool?.95:1,depthWrite:false,side:T.DoubleSide});
    mat.customProgramCacheKey=()=>pool?'basalt-pool':'ganh-intertidal-sea';
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 seaXZ;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nseaXZ=position.xz;');
      s.fragmentShader=`varying vec2 seaXZ;
      float ganhHash(vec2 p){vec3 q=fract(p.xyx*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
      float ganhNoise(vec2 p){vec2 q=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(ganhHash(q),ganhHash(q+vec2(1,0)),f.x),mix(ganhHash(q+vec2(0,1)),ganhHash(q+1.),f.x),f.y);}`+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float wave=sin(dot(seaXZ,vec2(.86,2.3))+ganhNoise(seaXZ*.42)*3.)+.6*sin(dot(seaXZ,vec2(-.77,3.8))+1.9*ganhNoise(seaXZ*.94));
        float close=1.-smoothstep(45.,285.,length(seaXZ));float n=ganhNoise(seaXZ*.56);
        diffuseColor.rgb*=(.94+.075*n+.062*wave*close);
        ${pool?'diffuseColor.a=.88;':`float band=ganhNoise(seaXZ*.080);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.088,.292,.270),(.26+.26*band)*close);
        diffuseColor.rgb+=vec3(.090,.110,.094)*pow(max(0.,wave*.65),7.)*close;
        diffuseColor.a=(.94-.12*close)*(1.-smoothstep(220.,660.,length(seaXZ)));`}`);
    };
    const mesh=new T.Mesh(planGeometry(T,pool?tidePool:seaRing,pool?[]:seaHoles),mat);mesh.position.y=pool?.84:0;
    mesh.name=pool?'Vũng nước trong mũi đá phía bắc':'Mặt biển và các rãnh giữa hai mũi bazan';mesh.receiveShadow=true;g.add(mesh);
  }
  function breakers(T,g){
    if(!seaRing)return;
    const p=[],c=[],idx=[];
    for(const outline of [northern,southern]){
      let s=0;
      for(let i=1;i<outline.length;i++){
        const [ax,az]=outline[i-1],[bx,bz]=outline[i],dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz),count=Math.max(2,Math.ceil(len/.44));
        const sign=inside(seaRing,(ax+bx)/2-dz/len*.90,(az+bz)/2+dx/len*.90)?1:-1,nx=-sign*dz/len,nz=sign*dx/len;
        for(let band=0;band<3;band++)for(let j=0;j<count;j++){
          const at=s+len*j/count,bt=s+len*(j+1)/count,roll=Math.sin(at*.74+2.1*band)+.52*Math.sin(at*2.17-band*.82);
          if(roll<-.40+band*.22)continue;
          const base=p.length/3;
          for(const [u,phase] of [[j/count,at],[(j+1)/count,bt]]){
            const offset=.37+band*.97+.23*Math.sin(phase*.49+band)+.12*Math.sin(phase*1.67);
            const w=.028+.088*(1.0+Math.sin(phase*1.07-band));const x=ax+dx*u,z=az+dz*u;
            for(const rim of [-1,0,1]){p.push(x+nx*(offset+rim*w),.017+.007*band,z+nz*(offset+rim*w));
              c.push(.70,.85,.80,rim===0?(.18+.14*Math.max(0,roll))*smooth(-.40+band*.22,.58,roll)*(1.-band*.17):0);}
          }idx.push(base,base+3,base+4,base,base+4,base+1,base+1,base+4,base+5,base+1,base+5,base+2);
        }s+=len;
      }
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));
    geo.setAttribute('color',new T.Float32BufferAttribute(c,4));geo.setIndex(idx);
    const mesh=new T.Mesh(geo,new T.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,side:T.DoubleSide}));
    mesh.name='Sóng nhỏ dọc các bậc đá';mesh.renderOrder=2;g.add(mesh);
  }
  // Dry land behind the columns, with the true peninsula outline. Positions
  // within the field use the heritage dossier's surveyed 4–10 m upper terrace.
  // The regional raster is submarine at the landmark (-8.6 m in the game).
  function bench(x,z){
    const cap=inside(rock,x,z),back=inside(southBack,x,z);
    if(inside(tidePool,x,z))return .28;
    if(cap||back){
      const inlandDistance=Math.min(distance(rock.slice(25,58),x,z),back?distance(southBack,x,z,true):12);
      return surface(x,z)-.14-.96*smooth(.2,3.1,inlandDistance);
    }
    const near=Math.min(distance(rock,x,z,true),distance(southBack,x,z,true));
    const inland=5.35+2.65*smooth(4,31,-z)+.62*Math.sin(x*.075-z*.07)+.27*Math.cos(z*.22+x*.17);
    const head=surface(x,z)-.12,t=smooth(0,9.4,near);
    return head+(inland-head)*t;

  }
  function terrain(T,g){
    const p=[],rgb=[],alpha=[],idx=[],anchors=[],lo=new T.Color(),hi=new T.Color(),c=new T.Color();
    const grid=1.30,cols=166,rows=105,sx=-110,sz=-98,mask=[];
    const isLand=(x,z)=>!seaRing||!inside(seaRing,x,z)||inside(rock,x,z);
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const x=sx+i*grid,z=sz+j*grid,inRock=inside(rock,x,z)||inside(southBack,x,z),grass=smooth(3,30,-z)*(.6+.30*Math.sin(x*.19+z*.12))*(x<27?1:.32);
      const y=bench(x,z),n=.35+.28*Math.sin(.31*x+.22*z)+.20*noise(i,j+51);
      if(inRock){lo.setHex(0x777468);hi.setHex(0x9e9681);}else{
        lo.setHex(0x9c896e).lerp(new T.Color(0x526543),grass);hi.setHex(0xc5ab82).lerp(new T.Color(0x778253),grass);}
      c.copy(lo).lerp(hi,n);p.push(x,y,z);rgb.push(c.r,c.g,c.b);
      const band=Math.min(x-sx,sz+grid*rows-z,z-sz,sx+grid*cols-x);alpha.push(smooth(1.5,27,band));anchors.push([x,z,y]);
      mask.push(isLand(x,z));
    }
    const crossing=new Map();
    function intersection(a,b){
      // Use endpoint identifiers as a stable key while new vertices are added.
      const tag=Math.min(a,b)+','+Math.max(a,b);if(crossing.has(tag))return crossing.get(tag);
      let left=0,right=1;const A=anchors[a],B=anchors[b],vx=B[0]-A[0],vz=B[1]-A[1];
      for(let j=0;j<8;j++){
        const t=(left+right)*.5;if(isLand(A[0]+vx*t,A[1]+vz*t)===mask[a])left=t;else right=t;
      }
      const t=(left+right)*.5,x=A[0]+vx*t,z=A[1]+vz*t,y=bench(x,z),n=anchors.length;
      anchors.push([x,z,y]);p.push(x,y,z);for(let k=0;k<3;k++)rgb.push(rgb[3*a+k]*(1-t)+rgb[3*b+k]*t);
      alpha.push(alpha[a]*(1-t)+alpha[b]*t);crossing.set(tag,n);return n;
    }
    for(let j=1;j<=rows;j++)for(let i=1;i<=cols;i++){
      const b=j*(cols+1)+i;for(const tri of [[b-cols-2,b-1,b],[b-cols-2,b,b-cols-1]]){
        const out=[];for(let t=0;t<3;t++){const a=tri[t],next=tri[(t+1)%3];if(mask[a])out.push(a);
          if(mask[a]!==mask[next])out.push(intersection(a,next));}
        for(let k=1;k+1<out.length;k++)idx.push(out[0],out[k],out[k+1]);
      }
    }
    const scan=new T.TextureLoader().load('streetscape/surfaces/cut-rock-color.webp');scan.colorSpace=T.SRGBColorSpace;scan.wrapS=scan.wrapT=T.RepeatWrapping;scan.anisotropy=4;
    const mat=new T.MeshStandardMaterial({map:scan,vertexColors:true,roughness:.99,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
      float reliefTone=dot(texture2D(map,vMapUv).rgb,vec3(.22,.71,.07));diffuseColor.rgb*=.73+clamp(reliefTone*2.5,0.,.65);
      #endif`);};
    const core=[],fringe=[];for(let i=0;i<idx.length;i+=3){
      const a=idx[i],b=idx[i+1],d=idx[i+2],bucket=Math.min(alpha[a],alpha[b],alpha[d])>.999?core:fringe;bucket.push(a,b,d);
    }
    const mesh=buffer(T,g,mat,p,rgb,null,core,'Thềm ven bờ và đất phong hóa');mesh.castShadow=false;
    const colors=[];for(let i=0;i<alpha.length;i++)colors.push(rgb[i*3],rgb[i*3+1],rgb[i*3+2],alpha[i]);
    mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,4));
    mesh.geometry.setAttribute('uv',new T.Float32BufferAttribute(anchors.flatMap(([x,z])=>[x*.5,z*.5]),2));
    const edgeMat=mat.clone();edgeMat.onBeforeCompile=mat.onBeforeCompile;edgeMat.transparent=true;edgeMat.depthWrite=false;
    const edgeGeo=new T.BufferGeometry();for(const [name,a] of Object.entries(mesh.geometry.attributes))if(name!=='normal')edgeGeo.setAttribute(name,a);
    edgeGeo.setIndex(fringe);edgeGeo.computeVertexNormals();const edgeMesh=new T.Mesh(edgeGeo,edgeMat);edgeMesh.receiveShadow=true;edgeMesh.renderOrder=-2;g.add(edgeMesh);
    return ground=>{
      const v=mesh.geometry.attributes.position;
      for(let i=0;i<v.count;i++){const [x,z,y]=anchors[i],edge=Math.min(x-sx,sz+grid*rows-z,z-sz,sx+grid*cols-x);
        const original=ground(x,z),d=seaRing?distance(seaRing,x,z,true):20;
        const coastHeight=inside(rock,x,z)||inside(southBack,x,z)?y : -.44+(y+.44)*smooth(0,6.0,d);
        v.setY(i,original+(coastHeight-original)*smooth(0,28,edge));}
      v.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();edgeGeo.computeVertexNormals();edgeGeo.computeBoundingSphere();
    };
  }
  function pathAndRailing(T,g){
    const vertices=[],rgb=[],idx=[],c=new T.Color(),posts=[],rails=[];
    function strip(poly,w,stair,railing){
      let run=0,nextPost=0,prev=null;
      for(let n=1;n<poly.length;n++){
        const [ax,az]=poly[n-1],[bx,bz]=poly[n],dx=bx-ax,d= bz-az,len=Math.hypot(dx,d),u=dx/len,v=d/len,nx=-v*w/2,nz=u*w/2;
        const count=Math.ceil(len/(stair?.42:1.1));
        for(let j=0;j<count;j++){
          const t=j/count,end=(j+1)/count,x=ax+dx*t,z=az+d*t,a=ax+dx*end,b=az+d*end;
          const y=bench(x,z)+.14,Y=bench(a,b)+.14,h=stair?Math.max(y,Y):y,k=vertices.length/3;
          vertices.push(x+nx,h,z+nz,x-nx,h,z-nz,a-nx,stair?h:Y,b-nz,a+nx,stair?h:Y,b+nz);
          c.set(stair?0x8e806a:0xa0896a).multiplyScalar(.88+.18*noise(j,n+54));for(let k=0;k<4;k++)rgb.push(c.r,c.g,c.b);
          idx.push(k,k+1,k+2,k,k+2,k+3);
          if(stair){const low=vertices.length/3;vertices.push(a+nx,Y-.29,b+nz,a-nx,Y-.29,b-nz);rgb.push(c.r*.70,c.g*.70,c.b*.70,c.r*.70,c.g*.70,c.b*.70);idx.push(k+3,k+2,low+1,k+3,low+1,low);}
        }
        if(railing){
          for(;nextPost<=run+len;nextPost+=1.55){
            const t=(nextPost-run)/len,x=ax+dx*t+nx,z=az+d*t+nz,y=bench(x,z)+.18,P=[x,y,z];
            posts.push(P);if(prev)rails.push([prev,P]);prev=P;
          }
        }run+=len;
      }
    }
    strip(steps,1.42,true,true);strip(unpaved,1.10,false,false);
    const mat=new T.MeshStandardMaterial({vertexColors:true,roughness:.97,side:T.DoubleSide});
    buffer(T,g,mat,vertices,rgb,null,idx,'Bậc xuống gành phía nam và lối đi thực');
    function rods(lines,r,color){
      const material=new T.MeshStandardMaterial({color,roughness:.78}),m=new T.InstancedMesh(new T.CylinderGeometry(r,r,1,8),material,lines.length),temp=new T.Object3D(),up=new T.Vector3(0,1,0);
      lines.forEach(([A,B],i)=>{const a=new T.Vector3(...A),b=new T.Vector3(...B),d=b.clone().sub(a);temp.position.copy(a).addScaledVector(d,.5);temp.scale.set(1,d.length(),1);temp.quaternion.setFromUnitVectors(up,d.normalize());temp.updateMatrix();m.setMatrixAt(i,temp.matrix);});
      m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();m.castShadow=true;g.add(m);
    }
    const lift=([x,y,z],h)=>[x,y+h,z];
    rods(posts.map(q=>[q,lift(q,.86)]),.040,0x969c8c);
    rods(rails.map(([a,b])=>[lift(a,.82),lift(b,.82)]),.050,0x97683e);
    rods(rails.map(([a,b])=>[lift(a,.38),lift(b,.38)]),.022,0xadad9d);
    // A low rope separates the conserved folded face at pano 16 from the path.
    const perimeter=[[11.9,-20.1],[14.1,-17.3],[15.3,-14.3],[16.70,-10.8],[16.12,-8.1]];
    const pr=perimeter.map(([x,z])=>[x,bench(x,z)+.1,z]);
    rods(pr.map(a=>[a,lift(a,.60)]),.029,0x887661);
    const lines=[];for(let i=1;i<pr.length;i++){
      const a=lift(pr[i-1],.56),b=lift(pr[i],.56),c=a.map((v,j)=>(v+b[j])/2-(j===1?.080:0));lines.push([a,c],[c,b]);}
    rods(lines,.013,0xc0ac86);
  }
  // Tree crowns are placed on identifiable patches in the overhead. Their
  // small branch structure and sizes are estimates from the south stairs and
  // central panoramas. The two column faces are open to the sea.
  function trees(T,g){
    const stems=[[-32,-10.7,4.3,3.0],[-31,-21.5,5.6,3.1],[-40,-18,5.4,3.2],[-38,-34,4.4,3.0],[-28.5,-34,4.9,2.9],
      [-22,-36,5.1,3.2],[-18,-32.9,4.8,3.7],[-13.7,-37.7,5.5,3.0],[-1,-40,5.2,3.7],[5.7,-36,4.6,3.0],
      [8.7,-33.4,5.4,3.7],[10.2,-27.8,3.5,2.5],[7.9,-18.4,4.0,2.7],[8.3,-15.2,3.1,2.4],[2.6,-8.2,3.0,2.8],
      [-1.2,-11.6,3.6,2.4],[-5,-16.5,3.9,2.7],[-6.7,-26.9,4.6,3.1],[-40.5,-6.5,3.8,3.5],[-53,-15,4.7,3.6],[-72,-22.2,5.6,4.0],
      [35,-35,3.7,3.0],[45,-48,3.9,3.1],[52,-46,3.5,2.9],[62,-56,3.6,2.8]];
    window.CentralArch.trees(T,{group:g},stems.map(([x,z,h,r])=>({x,z,y:bench(x,z)-.06,h,width:r*1.78,kind:'banyan'})));

  }
  function rubble(T,g){
    const dry=[],brush=[];
    for(let i=0;i<5600;i++){
      const x=-51+noise(i,100)*103,z=-41+noise(i,111)*69,rocky=inside(rock,x,z)||inside(southBack,x,z);
      if(rocky||!seaRing||inside(seaRing,x,z)||distance(steps,x,z)<1.05||distance(unpaved,x,z)<.83)continue;
      const rim=Math.min(distance(rock,x,z,true),distance(southBack,x,z,true)),n=noise(i,32);
      if(rim<8.7&&n>.27)dry.push([x,bench(x,z)-.025,z,.08+noise(i,19)**2*.36,i]);
      else if(z<2.0&&rim>2&&n>.60&&Math.sin(x*.27+z*.09)+.6*Math.sin(z*.44)>-.15)brush.push([x,bench(x,z)-.07,z,.20+.48*noise(i,277),i]);
    }
    const temp=new T.Object3D(),tint=new T.Color();
    function stones(data,green){
      const m=new T.InstancedMesh(new T.IcosahedronGeometry(1,green?1:0),new T.MeshStandardMaterial({roughness:.96}),data.length);
      data.forEach(([x,y,z,r,i],j)=>{temp.position.set(x,y,z);temp.rotation.set(green?0:noise(i,444)*.61,i*1.27,green?0:noise(i,64)*.48);
        temp.scale.set(r*(1+.38*noise(i,711)),r*(green?.65:.63),r*.88);temp.updateMatrix();m.setMatrixAt(j,temp.matrix);
        tint.setHex(green?0x5b713b:0x6f6b5a).lerp(new T.Color(green?0x8b874a:0xa18f76),noise(i,18));m.setColorAt(j,tint);});
      m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();m.castShadow=true;g.add(m);
    }
    stones(dry,false);stones(brush,true);
  }
  function coarse(T,group){
    const p=[],c=[],f=[],idx=[],tint=new T.Color();const lod=1.35,cols=67,rows=48,sx=-43,sz=-32;
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const x=sx+i*lod,z=sz+j*lod,h=surface(x,z),n=clamp(.53+.15*Math.sin(x*.39)+.21*noise(i,j),0,1);
      tint.setHex(0x817f72).lerp(new T.Color(0xa59e89),n);p.push(x,h,z);c.push(tint.r,tint.g,tint.b);f.push(h);
      if(!i||!j||!inside(rock,x-lod/2,z-lod/2))continue;
      const a=j*(cols+1)+i;idx.push(a-cols-2,a-1,a,a-cols-2,a,a-cols-1);
    }
    buffer(T,group,material(T),p,c,f,idx,'Hai mũi bazan nhìn từ xa');
  }
  function view(name,x,z,focus,ex,ez,eye,fov,description){
    const dx=ex-x,dz=ez-z,dy=eye-focus;
    return {name,offset:[x,z],height:Math.max(2,focus/.46),focusAltitude:focus,viewBase:'monument',viewAngle:Math.atan2(dx,dz),
      viewRadius:Math.hypot(dx,dz,dy),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,description};
  }
  function* build(T,k){
    const coastSite=new T.Group();k.group.add(coastSite);
    const detail=new T.Group(),far=new T.Group(),lod=new T.LOD();coastSite.add(lod);
    yield* basalt(T,detail);folded(T,detail);coarse(T,far);lod.addLevel(detail,0);lod.addLevel(far,170);
    water(T,coastSite);water(T,coastSite,true);breakers(T,coastSite);const fit=terrain(T,coastSite);pathAndRailing(T,coastSite);trees(T,coastSite);rubble(T,coastSite);
    k.group.userData.fitGround=ground=>{
      // Sea stage is one horizontal plane. Sampling the open-water raster
      // here would use the seabed (down to about -22 m).
      const base=k.group.position.y;coastSite.position.y=-base;fit((x,z)=>ground(x,z)+base);
    };
  }
  (window.VietnamSights??=[]).push({...pin,id,catalogId,name:'Gành Đá Đĩa',city:'Tuy An',locality:'An Ninh Đông',formerProvince:'Phú Yên',kind:'Danh thắng địa chất',
    lon,lat,start:[109.2932594,13.3572872],yaw:0,width:84,depth:63,gardenRadius:65,viewDistance:1550,
    mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,source,photo:vr,map:'https://www.openstreetmap.org/way/1229067977',
    boundary:rock,reserve:(x,z,r)=>x>-48-r&&x<48+r&&z>-40-r&&z<38+r,solids:[],
    description:'Hai mũi đá nhỏ nhô ra bờ biển Phú Hạnh. Mũi phía nam có ba bậc cột bazan gần thẳng đứng. Ở mũi phía bắc, các cột chuyển từ đứng sang nghiêng và uốn gần nằm ngang. Vết nứt ngang chia thân cột thành những đĩa đá.',
    arrivalNote:'Xe dừng trên đường công cộng ngay lối vào bãi xe phía bắc khu tham quan. Qua cổng, đi bộ theo trục chính rồi xuống gành bằng lối bậc.',
    views:[
      view('Những bậc cột đá ở mũi phía nam',-1.35,20.6,2.50,12.75,28.6,2.74,63,'Từ bậc thấp sát biển nhìn ngược vào sườn gành, thấy mặt cắt đa giác và các thân cột đứng thành nhiều bậc.'),
      view('Đầu cột uốn cong ở mũi phía bắc',19.0,-12.0,3.50,29.0,-8.9,3.50,63,'Từ thềm đá phía biển nhìn vào dải cột uốn cong. Các đầu cột ở phần trên hướng ra ngoài, để lộ những mặt đa giác của cả bó.'),
      view('Lối bậc phía nam nhìn qua vũng biển',-19,15,2.6,-25.8,-9,8.45,62,'Bậc đá có tay vịn đi xuống từ thềm có cây. Phía dưới là mũi đá thấp bên vũng nước.'),
      view('Hai mũi đá từ phía biển',4.2,1,3.4,96.6,-20.95,94.1,54,'Góc máy trên cao của tỉnh ở phía đông bắc. Khe nước nhỏ phân cách hai mũi bazan, bên trong là thềm có lối đi bộ.')
    ],build});
})();
