const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const id='hai-dang-ganh-den',catalogId='osm-way-1272966043';
  const pin=window.VietnamTourism?.entries.find(p=>p.id===catalogId);
  const lon=109.2939207,lat=13.3639753,vr='https://daklakvrtour.com/tour/43/index.html';
  const source='https://vov.vn/du-lich/nhung-con-mat-cua-bien-728528.vov';
  // Survey 2026-11-23. F3156, focal plane 22.5 m, hexagonal tower 10 m,
  // https://www.ibiblio.org/lighthouse/vnmsc.htm . OSM w1272966043 gives
  // 3.00 m across flats. The keeper describes the 2002 rebuilding at VOV.
  // Provincial tour 43 nodes 32 and 33 show the unroofed gallery, PV, door,
  // concrete footbridge and stairs. Node 32 is airborne at 109.293730,
  // 13.363808; node 33 has no surveyed GPS. No photo pixels are reproduced.
  // Plan compared with Google satellite and Esri World Imagery. Local x east,
  // z south. OSM w1241373880 stops before the final turn; that turn and the
  // seaward rocks are interpreted from imagery. Granite geology and photos:
  // https://diamoitruong.com/2015/11/21/gioi-thieu-dia-di-san-bo-bien-ganh-da-dia-tuy-an-phu-yen/
  // The shoreline, split ridge axes and exposed heads constrain the relief.
  // Individual joint faces, heights away from the beacon and rail spans are estimates.
  const shore=[[-170,-71],[-148,-64],[-132,-45],[-116,-29],[-104,-18],[-98,-13],[-90,-10],[-82,-9],[-75,-9],[-69,-14],[-61,-16],[-53,-22],[-45,-25],[-40,-31],[-38,-37],[-32,-39],[-34,-48],[-36,-57],[-33,-61],[-28,-55],[-24,-49],[-21,-50],[-19,-58],[-15,-58],[-9,-52],[-4,-49],[6,-39],[9,-36],[11,-40],[17,-35],[24,-24],[29,-14],[35,-6],[40,3],[45,10],[48,17],[46,26],[45,32],[43,34],[38,31],[38,37],[31,39],[23,34],[27,43],[32,48],[28,49],[22,47],[17,43],[20,54],[29,61],[32,66],[42,70],[48,81],[49,87],[44,89],[37,84],[31,73],[25,70],[20,66],[15,65],[19,77],[28,89],[23,91],[12,81],[6,77],[0,73],[-2,77],[9,96],[18,108],[26,116]];
  const island=[[24,-78],[28,-74],[30,-68],[34,-63],[40,-58],[45,-52],[45,-45],[40,-44],[34,-48],[33,-47],[29,-53],[26,-57],[23,-62],[21,-67],[21,-74]];
  const land=[...shore,[-23,145],[-170,145]];
  // Surveyed approach from the end of the public road and the final dogleg
  // digitised at higher resolution; rail extent follows the ground panorama.
  const walk=[[-91.4,122.1,8.5],[-83.2,90.2,8.7],[-84.5,82.6,9],[-79.6,70.6,9.1],[-73.2,49.1,8.9],[-69.6,44.4,8.7],[-51.2,43,8.7],[-37.5,40.3,9],[-35.3,32.3,9.1],[-30.9,32,9.4],[-25.3,35.1,9.6],[-19.8,24.2,9.6],[-17.1,19.1,9.8],[-13.1,17.1,10.1],[-8.0,13.7,10.35],[-3.15,8.9,10.65],[-2.95,2.0,12.44],[-1.43,.76,12.85]];
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function smooth(a,b,v){const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);}
  function noise(i,j){
    let n=Math.imul(i,374761393)+Math.imul(j,668265263);n=Math.imul(n^(n>>>13),1274126177);
    return ((n^(n>>>16))>>>0)/4294967296;
  }
  function inside(r,x,z){
    let yes=false;for(let i=0,j=r.length-1;i<r.length;j=i++){
      const [a,b]=r[i],[c,d]=r[j];if((b>z)!==(d>z)&&x<(c-a)*(z-b)/(d-b)+a)yes=!yes;
    }return yes;
  }
  const segments=new WeakMap();
  function nearest(line,x,z){
    let parts=segments.get(line);if(!parts){
      parts=line.slice(1).map((b,i)=>{
        const a=line[i],dx=b[0]-a[0],dz=b[1]-a[1];return [a[0],a[1],dx,dz,1/(dx*dx+dz*dz||1),a[2]||0,(b[2]||0)-(a[2]||0)];
      });segments.set(line,parts);
    }
    let d=Infinity,y=0;
    for(let i=0;i<parts.length;i++){
      const s=parts[i],vx=x-s[0],vz=z-s[1],f=(vx*s[2]+vz*s[3])*s[4],u=f<0?0:f>1?1:f;
      const dx=vx-u*s[2],dz=vz-u*s[3],ds=dx*dx+dz*dz;
      if(ds<d){d=ds;y=s[5]+u*s[6];}
    }return [Math.sqrt(d),y];
  }
  function top(x,z,d=nearest(shore,x,z)[0],foot=nearest(walk,x,z)){
    const inland=smooth(6,41,d);
    const h=1.75+.41*Math.min(d,17)+1.6*inland+1.19*Math.sin(.19*x-.093*z)+.67*Math.cos(.18*z+.14*x)
      +1.15*Math.sin(.112*x+.173*z)+1.3*Math.exp(-((x-4)**2+(z+2)**2)/270);
    const bridge=smooth(17,15,z)*smooth(4.5,7,z),near=1-smooth(.82,3.45,foot[0]);
    const surround=h+(foot[1]-.14-bridge*(1.5+.4*Math.sin(x))-h)*near;
    return surround+(12.29-surround)*(1-smooth(1.5,3.05,Math.hypot(x,z)));
  }
  function fitWeight(x,z,raster){
    // The raster reports seabed even under dry land halfway from the
    // station (-5.3 m). Blend only surveyed dry ground back to the road.
    return Math.max(1-smooth(6,24,Math.hypot(x+91.4,z-122.1)),smooth(.3,6,raster));
  }
  function buffer(T,g,p,c,idx,mat,name){
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));
    if(c)geo.setAttribute('color',new T.Float32BufferAttribute(c,3));geo.setIndex(idx);geo.computeVertexNormals();
    const m=new T.Mesh(geo,mat);m.receiveShadow=true;m.name=name;g.add(m);return m;
  }
  function* headland(T,g){
    const pts=[],rgb=[],idx=[],weights=[],step=2.15,cols=117,rows=99,sx=-174,sz=-73;
    const a=new T.Color(0x79604e),b=new T.Color(0xb58c67),c=new T.Color(),herb=new T.Color(0x7f805c);
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      if(i===0&&j%8===0)yield;
      const x=sx+i*step,z=sz+j*step,d=nearest(shore,x,z)[0],foot=nearest(walk,x,z),near=foot[0];
      const fade=smooth(-30,-70,x)+smooth(55,115,z)*.65;
      let y=top(x,z,d,foot)-1.2+smooth(27,80,-x)*.98;
      if(x<-33&&near<3.7)y+=.9*(1-smooth(.8,3.7,near));
      if(!inside(land,x,z))y=-1;else y=-.65+(y+.65)*smooth(0,3.7,d);
      pts.push(x,y,z);weights.push(Math.max(smooth(24,77,-x),smooth(53,110,z))*smooth(6,23,d));
      c.copy(a).lerp(b,.17+.61*noise(i,j)).lerp(herb,clamp(fade*(.3+.7*noise(i>>1,j>>1)),0,1));rgb.push(c.r,c.g,c.b);
      if(j&&i&&inside(land,x-step*.5,z-step*.5)){const n=j*(cols+1)+i;idx.push(n-cols-2,n-1,n,n-cols-2,n,n-cols-1);}
    }
    const m=buffer(T,g,pts,rgb,idx,window.createSightStoneMaterial(T),'Nền đá và đất phong hóa ven trạm');m.castShadow=false;
    const pos=m.geometry.attributes.position;
    return ground=>{
      for(let i=0;i<weights.length;i++)if(weights[i]){
        const x=pts[i*3],y=pts[i*3+1],z=pts[i*3+2],native=ground(x,z);
        const outer=Math.max(smooth(137,166,-x),smooth(111,138,z));
        pos.setY(i,y+(native-.14-y)*weights[i]*Math.max(outer,fitWeight(x,z,native)));
      }
      pos.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();
    };
  }
  // A directional, jittered Voronoi tessellation describes the connected
  // fractured rock surface. Neighbouring cells share joint axes. Tailward
  // slabs are elongated along NW–SE fractures visible on both imagery layers.
  function* rock(T,g){
    const p=[],col=[],idx=[],cells=[],su=3.6,sv=5.7,ca=.86,sa=.5103,rows=49,cols=41;
    const project=(u,v)=>[u*ca+v*sa,v*ca-u*sa];
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
      const u=(i-20+.72*(noise(i,j)-.5))*su,v=(j-20+.75*(noise(i+52,j)-.5))*sv;
      const [x,z]=project(u,v);cells.push({u,v,x,z});
    }
    const pale=new T.Color(0xd5ad87),pink=new T.Color(0xbe927c),rust=new T.Color(0xa16b47),wet=new T.Color(0x787268),c=new T.Color();
    const islandEdge=[...island,island[0]];
    for(let j=2;j<rows-2;j++)for(let i=2;i<cols-2;i++){
      if(i===2&&j%3===0)yield;
      const me=cells[j*cols+i],{u,v,x,z}=me,onIslet=inside(island,x,z),edge=nearest(shore,x,z)[0];
      if(!inside(land,x,z)&&!onIslet)continue;
      if((x<-43||z>65)&&!onIslet&&(edge>18||x<-110||z>111))continue;
      let poly=[[-8,-8],[8,-8],[8,8],[-8,8]];
      for(let jj=-2;jj<=2;jj++)for(let ii=-2;ii<=2;ii++){
        if(!ii&&!jj)continue;
        const a=cells[(j+jj)*cols+i+ii],nx=(a.u-u)/su,ny=(a.v-v)/sv,mid=(nx*nx+ny*ny)/2,out=[];
        for(let t=0;t<poly.length;t++){
          const A=poly[t],B=poly[(t+1)%poly.length],ad=A[0]*nx+A[1]*ny-mid,bd=B[0]*nx+B[1]*ny-mid;
          if(ad<=0)out.push(A);
          if((ad<=0)!==(bd<=0)){const q=ad/(ad-bd);out.push([A[0]+q*(B[0]-A[0]),A[1]+q*(B[1]-A[1])]);}
        }poly=out;
      }
      const a=onIslet?nearest(islandEdge,x,z)[0]:edge;
      const natural=onIslet?0:top(x,z,edge),plane=onIslet?.3+Math.min(4.1,a*.66):natural*smooth(-1,4.2,edge);
      const shade=noise(i+14,j+5),low=.55+2.1*noise(i+70,j),slope=(noise(i+33,j)-.5)*.75;
      const start=p.length/3,n=poly.length;
      c.copy(pink).lerp(pale,.17+.69*noise(i+36,j)).lerp(rust,.44*shade).lerp(wet,1-smooth(.9,5.4,plane));
      const crown=(noise(i+18,j)-.45)*1.13,bevel=.36+.68*noise(i,j+82);
      function vert(X,Y,Z,l){
        if(Math.hypot(x,z)<5.1)Y=Math.min(Y,12.16);
        p.push(X,Y,Z);col.push(c.r*l,c.g*l,c.b*l);
      }
      for(const [scale,sink] of [[1.016,low+1.3],[.974,bevel],[.83,.24],[.52,.055]]){
        for(const [du,dv] of poly){
          const [dx,dz]=project(du*su*scale,dv*sv*scale),X=x+dx,Z=z+dz;
          let Y=plane+crown+slope*dx+.14*dz-sink;
          if(!onIslet){
            const foot=nearest(walk,X,Z),surface=top(X,Z,nearest(shore,X,Z)[0],foot);Y+=.55*(surface-natural);Y=Math.min(Y,surface+1.05);
            const [pathD,pathY]=foot;if(pathD<2.5)Y=Math.min(Y,pathY-.25+1.1*smooth(.82,2.5,pathD));
          }
          vert(X,Y,Z,.66+(1-scale)*.60+.17*noise(i+Math.round(du*10),j+Math.round(dv*10)));
        }
      }
      vert(x,plane+crown+.11,z,.98);
      for(let q=0;q<n;q++){
        const a=start+q,b=start+(q+1)%n;
        for(let layer=0;layer<3;layer++){
          const k=layer*n;idx.push(a+k,b+k+n,b+k,a+k,a+k+n,b+k+n);
        }idx.push(a+3*n,start+4*n,b+3*n);
      }
    }
    const mesh=buffer(T,g,p,col,idx,window.createSightStoneMaterial(T),'Các khối granit nứt tách trên mũi và hòn đá ngoài khơi');mesh.castShadow=true;
    // Higher castellated blocks flank the tower. The two adjacent heads to
    // its east stand out in both panoramas; deep partings continue downhill.
    let n=0;const granite=window.createSightGranite(T,g,()=>noise(991,++n)),heads=[
      [4.45,2.60,2.30,3.40,2.48,14.92,-.36,.60,0xd7a070],
      [7.41,4.45,1.22,2.98,3.18,14.11,-.35,.47,0xc69062],
      [7.55,-.24,3.52,2.15,3.05,13.39,.66,-.63,0xd5a17d],
      [11.12,1.86,2.24,2.42,3.47,12.55,-.39,.71,0xc79a76],
      [11.92,7.51,3.53,2.15,2.45,11.76,-.52,.61,0xd7a17a],
      [16.12,5.60,1.79,2.49,3.56,11.58,-.44,.64,0xc38d63],
      [13.52,12.85,3.46,2.42,2.89,11.19,-.34,-.81,0xc79673],
      [4.51,-5.76,3.47,1.75,2.60,12.73,-.44,-.30,0xd6a884],
      [-4.15,-4.08,2.73,1.81,2.06,12.76,-.23,.32,0xd6ab82],
      [-8.78,7.03,2.03,2.64,2.44,11.42,.10,-.55,0xc68b5d],
      [-6.75,8.31,1.04,1.99,1.68,11.12,-.13,-.28,0xc99a72],
      [-8.08,19.11,1.99,2.13,3.34,11.17,-.23,.71,0xb77f5c],
      [-10.23,22.38,2.07,1.59,1.84,10.83,-.17,.38,0xd69b6d],
      [2.03,13.41,1.56,2.20,2.72,11.53,-.34,.46,0xc68e6d],
      [2.66,19.91,2.56,2.43,3.42,10.85,-.27,.55,0xcc9b71],
      [-22.43,12.25,2.55,1.81,2.41,10.48,.78,-.27,0xbb8762],
      [-27.40,-46.60,2.25,2.65,3.78,6.05,-.13,-.55,0xcb9a74],
      [-30.65,-48.10,1.81,2.52,2.76,5.87,-.23,-.46,0xcaa388],
      [26.10,-68.35,2.81,1.85,3.80,4.80,-.38,.34,0xad957d]
    ];
    for(const [x,z,rx,ry,rz,y,angle,lean,tint] of heads)granite.stone(x,y-ry,z,rx,ry,rz,tint,angle,lean,false,.19);
    granite.finish();
  }
  // Concrete / metal members are batched, including the rail uprights.
  function fittings(T,g){
    const cube=new T.BoxGeometry(1,1,1),geos=new Map(),batch=new Map();
    const one=new T.Object3D(),up=new T.Vector3(0,1,0);
    function item(geo,color,x,y,z,w,h,d,q){
      let shapes=batch.get(geo);if(!shapes)batch.set(geo,shapes=new Map());let group=shapes.get(color);if(!group)shapes.set(color,group=[]);
      one.position.set(x,y,z);one.scale.set(w,h,d);q?one.quaternion.copy(q):one.rotation.set(0,0,0);one.updateMatrix();group.push(one.matrix.clone());
    }
    function quat(ax,ay,az){return new T.Quaternion().setFromEuler(new T.Euler(ax,ay,az,'YXZ'));}
    function box(c,x,y,z,w,h,d,ay=0,ax=0){item(cube,c,x,y,z,w,h,d,quat(ax,ay,0));}
    function cylinder(c,x,y,z,r1,r2,h,n=10){
      const key=[n,r1/r2].join('/');if(!geos.has(key))geos.set(key,new T.CylinderGeometry(r1/r2,1,1,n,1,false));
      item(geos.get(key),c,x,y,z,r2,h,r2);
    }
    function bar(c,A,B,r){
      const [ax,ay,az]=A,[bx,by,bz]=B,v=new T.Vector3(bx-ax,by-ay,bz-az),h=v.length();
      const key='rod';if(!geos.has(key))geos.set(key,new T.CylinderGeometry(1,1,1,8));
      item(geos.get(key),c,(ax+bx)/2,(ay+by)/2,(az+bz)/2,r,h,r,new T.Quaternion().setFromUnitVectors(up,v.divideScalar(h)));
    }
    function finish(){
      for(const [geo,groups] of batch)for(const [color,matrices] of groups){
        const metal=[0xaeb6b8,0x61747a].includes(color);
        const m=new T.InstancedMesh(geo,new T.MeshStandardMaterial({color,roughness:metal?.46:.81,metalness:metal?.57:.06,flatShading:geo.parameters?.radialSegments===6}),matrices.length);
        matrices.forEach((a,i)=>m.setMatrixAt(i,a));m.castShadow=m.receiveShadow=true;g.add(m);
      }
    }
    return {box,cylinder,bar,finish};
  }
  function approach(T,g,h){
    const pavement=0xb4ada0,side=0xafa798,steel=0xaeb6b8;
    const out=[],width=1.23,p=[],idx=[],heights=[];
    for(let i=0;i<walk.length;i++){
      const a=walk[Math.max(0,i-1)],b=walk[Math.min(i+1,walk.length-1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);
      out.push([dz/l,-dx/l]);
    }
    for(let i=1;i<walk.length;i++){
      const [x,z,y]=walk[i-1],[xx,zz,yy]=walk[i],dx=xx-x,dz=zz-z,dy=yy-y,l=Math.hypot(dx,dz),yaw=Math.atan2(dx,dz),stairs=i>=16;
      if(stairs){
        h.box(side,(x+xx)/2,(y+yy)/2-.32,(z+zz)/2,width+.12,.47,Math.hypot(dx,dy,dz)+.06,yaw,-Math.atan2(dy,l));
        const count=Math.ceil(Math.abs(dy)/.175);for(let j=0;j<count;j++){
          const t=(j+.5)/count,level=y+dy*(j+1)/count,depth=.24+.50*Math.abs(dy)/count;
          h.box(pavement,x+dx*t,level-depth/2,z+dz*t,width+.15,depth,l/count+.04,yaw);
        }
      }else if(i<12){
        // The inland path follows the loaded DEM all the way to the public
        // road; both edges merge into the rocky bench nearer the tip.
        const count=Math.ceil(l/2);
        for(let j=0;j<=count;j++){
          const t=j/count,b=p.length/3;
          for(const s of [-1,1]){
            const X=x+dx*t+s*width*.5*((1-t)*out[i-1][0]+t*out[i][0]),Z=z+dz*t+s*width*.5*((1-t)*out[i-1][1]+t*out[i][1]);
            p.push(X,y+dy*t,Z);heights.push(y+dy*t);
          }
          if(j)idx.push(b-2,b,b-1,b-1,b,b+1);
        }
      }else h.box(pavement,(x+xx)/2,(y+yy)/2-.105,(z+zz)/2,width,.21,Math.hypot(dx,dy,dz)+.08,yaw,-Math.atan2(dy,l));
      if(i<12)continue;
      const count=Math.ceil(l/1.62),line=(s,t)=>[x+dx*t+s*width*.49*((1-t)*out[i-1][0]+t*out[i][0]),y+dy*t,z+dz*t+s*width*.49*((1-t)*out[i-1][1]+t*out[i][1])];
      for(const s of [-1,1]){
        const A=line(s,0),B=line(s,1);
        for(const dy of [.34,.65,.98])h.bar(steel,[A[0],A[1]+dy,A[2]],[B[0],B[1]+dy,B[2]],dy>.9?.028:.015);
        for(let k=0;k<=count;k++){
          if(k===count&&i!==walk.length-1)continue;
          const [a,y,b]=line(s,k/count);h.bar(steel,[a,y-.055,b],[a,y+.98,b],.026);
        }
      }
      if(i===14||i===15)for(const t of [0,.72])h.box(side,x+dx*t,y+dy*t-.64,z+dz*t,1.00,1.06,.22,yaw);
    }
    const path=buffer(T,g,p,null,idx,new T.MeshStandardMaterial({color:0xb6a38a,roughness:.99,side:T.DoubleSide}),'Đường bộ từ trạm tới mũi đá');
    const pos=path.geometry.attributes.position;
    return ground=>{
      for(let i=0;i<heights.length;i++){
        const x=p[i*3],z=p[i*3+2],w=Math.max(smooth(24,77,-x),smooth(53,110,z))*smooth(6,23,nearest(shore,x,z)[0]);
        const native=ground(x,z);pos.setY(i,heights[i]+w*fitWeight(x,z,native)*(native+.045-heights[i]));
      }
      pos.needsUpdate=true;path.geometry.computeVertexNormals();path.geometry.computeBoundingSphere();
    };
  }
  function tower(h){
    const concrete=0xa79f95,white=0xeeeae3,red=0xd5282f,blue=0x358cb9,steel=0xaeb6b8;
    for(const [r,level] of [[2.26,12.38],[2.09,12.56],[1.92,12.74]])h.cylinder(concrete,0,level,0,r,r,.22,6);
    const bottom=12.84,band=2.10;
    for(let i=0;i<4;i++)h.cylinder(i%2?red:white,0,bottom+band*(i+.5),0,1.729,1.729,band,6);
    const angle=-Math.PI/6,px=1.509*Math.sin(angle),pz=1.509*Math.cos(angle);
    h.box(0x859296,px,13.88,pz,.90,2.04,.071,angle);h.box(blue,px*1.025,13.89,pz*1.025,.77,1.95,.052,angle);
    h.box(blue,px*1.018,18.81,pz*1.018,.43,.73,.055,angle);
    for(let i=0;i<4;i++)h.box(0x4388a4,px*1.042,18.61+.10*i,pz*1.042,.30,.024,.024,angle);
    h.cylinder(0xd3cec0,0,21.28,0,1.91,1.77,.17,6);h.cylinder(white,0,21.40,0,1.92,1.92,.15,6);
    for(let i=0;i<6;i++){
      const point=t=>[Math.sin(t)*1.78,Math.cos(t)*1.78],a=point(i*Math.PI/3),b=point((i+1)*Math.PI/3);
      for(const ph of [0,.5]){const x=a[0]*(1-ph)+b[0]*ph,z=a[1]*(1-ph)+b[1]*ph;h.bar(steel,[x,21.45,z],[x,22.39,z],.023);}
      for(const y of [21.72,22.02,22.39])h.bar(steel,[a[0],y,a[1]],[b[0],y,b[1]],.022);
    }
    h.cylinder(0x767e78,-.28,21.91,-.07,.21,.31,.88,12);h.cylinder(0xb7d5cc,-.28,22.48,-.07,.184,.21,.52,18);
    for(const y of [22.25,22.35,22.45,22.55,22.66])h.cylinder(0xb9c8bf,-.28,y,-.07,.20,.20,.028,18);
    h.cylinder(0xd5d3c4,-.28,22.78,-.07,.09,.22,.17,16);
    for(const z of [-.72,.72]){h.bar(steel,[.52,21.45,z],[.58,22.66,z],.035);h.bar(steel,[1.35,21.46,z],[1.65,22.34,z],.028);}
    const pvx=1.17,pvy=22.52,pvz=.01;
    const sun=(x,y,z,w,hh,d,c)=>h.box(c,pvx+x*Math.cos(.29)+y*Math.sin(.29),pvy-x*Math.sin(.29)+y*Math.cos(.29),pvz+z,d,hh,w,Math.PI/2,.29);
    sun(0,0,0,1.50,.079,2.14,0xb9b7ac);
    for(let j=0;j<6;j++)for(let i=0;i<4;i++)sun((i-1.5)*.343,.047,(j-2.5)*.332,.325,.014,.315,0x4b6470);
    h.bar(steel,[-1.13,21.47,-.58],[-1.13,24.17,-.58],.012);
  }
  function water(T,g){
    const sea=[...shore,[1500,500],[1500,-1550],[-335,-1550],[-335,-240]];
    const xy=r=>r.map(([x,z])=>new T.Vector2(x,-z)),points=[...sea,...island];
    const indices=T.ShapeUtils.triangulateShape(xy(sea),[xy(island)]).flat();
    const mat=new T.MeshStandardMaterial({color:0x669397,roughness:.38,metalness:.13,transparent:true,depthWrite:false,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 denWater;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ndenWater=position.xz;');
      s.fragmentShader='varying vec2 denWater;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float n=sin(dot(denWater,vec2(.077,.105)))+.68*sin(dot(denWater,vec2(.146,-.081)));
        float variation=sin(denWater.x*.34-denWater.y*.23+1.12*sin(denWater.y*.17))+sin(denWater.y*.293+denWater.x*.22);
        float ripple=sin(denWater.y*2.33+sin(denWater.x*.76)+n+2.5*variation)+.63*sin(dot(denWater,vec2(.42,3.62))+n*2.-variation);
        float close=1.-smoothstep(80.,370.,length(denWater));
        diffuseColor.rgb*=.96+.041*n+close*.055*ripple;
        diffuseColor.rgb+=vec3(.08,.10,.11)*pow(max(0.,ripple*.65),7.)*close*(.18+.82*smoothstep(-.75,.85,variation));
        diffuseColor.a=.95*(1.-smoothstep(190.,650.,length(denWater)));`);
    };
    buffer(T,g,points.flatMap(([x,z])=>[x,.012,z]),null,indices,mat,'Mặt biển ở mũi Gành Đèn');
    const p=[],idx=[],c=[];
    for(const line of [shore,[...island,island[0]]])for(let i=1;i<line.length;i++){
      const [x,z]=line[i-1],[X,Z]=line[i],dx=X-x,dz=Z-z,length=Math.hypot(dx,dz),samples=Math.ceil(length/.62);
      const see=(a,b)=>!inside(land,a,b)&&!inside(island,a,b);
      const sign=see((x+X)/2-dz/length,(z+Z)/2+dx/length)?1:-1,nx=-sign*dz/length,nz=sign*dx/length;
      for(let j=0;j<samples;j++){
        const t=(j+.5)/samples,a=x+dx*t,b=z+dz*t;
        const crest=.58*Math.sin(a*.63+b*.52)+.43*Math.sin(a*1.34-b*.88);
        if(crest<.03)continue;
        const offset=.8+.24*Math.sin(a*.71+b*.81),w=.04+.10*crest,start=p.length/3;
        for(const k of [j/samples,(j+1)/samples])for(const side of [-1,0,1]){
          const gap=offset+side*w;p.push(x+dx*k+nx*gap,.024,z+dz*k+nz*gap);
          c.push(.69,.83,.80,side===0?.34*crest:0);
        }idx.push(start,start+3,start+4,start,start+4,start+1,start+1,start+4,start+5,start+1,start+5,start+2);
      }
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));
    geo.setAttribute('color',new T.Float32BufferAttribute(c,4));geo.setIndex(idx);
    const foam=new T.Mesh(geo,new T.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,side:T.DoubleSide}));foam.renderOrder=2;g.add(foam);
  }
  function view(name,x,z,focus,ex,ez,eye,fov,description){
    const dx=ex-x,dz=ez-z,dy=eye-focus;
    return {name,offset:[x,z],height:focus/.46,focusAltitude:focus,viewBase:'monument',viewAngle:Math.atan2(dx,dz),
      viewRadius:Math.hypot(dx,dz,dy),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,description};
  }
  function* build(T,k){
    const g=new T.Group();k.group.add(g);const fitBank=yield* headland(T,g);yield* rock(T,g);yield;
    water(T,g);const h=fittings(T,g),fitPath=approach(T,g,h);tower(h);h.finish();
    k.group.userData.fitGround=ground=>{
      const base=k.group.position.y;g.position.y=-base;
      const absolute=(x,z)=>ground(x,z)+base;fitBank(absolute);fitPath(absolute);
    };
  }
  (window.VietnamSights??=[]).push({...pin,id,catalogId,name:'Hải đăng Gành Đèn',lon,lat,yaw:0,kind:'Hải đăng',modelType:'lighthouse',locality:'An Ninh Đông',
    city:'Tuy An',formerProvince:'Phú Yên',start:[109.2930776,13.3628725],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    source,photo:vr,map:'https://www.openstreetmap.org/way/1272966043',structureHeight:10,focalHeight:22.5,
    width:3.00,depth:3.45,gardenRadius:26,viewDistance:1360,modeledBuildings:['w1272966043'],
    boundary:[[1.50,-.86],[0,-1.72],[-1.50,-.86],[-1.50,.86],[0,1.72],[1.50,.86]],solids:[[0,0,1.50,1.72]],
    reserve:(x,z,r)=>Math.hypot(x,z)<36+r,
    description:'Tháp đèn lục giác cao 10 m nằm trên mỏm granit ở cửa vịnh. Hai khoang đỏ xen hai khoang trắng. Trên sân thượng có quang đăng và tấm pin mặt trời. Tâm đèn cao 22,5 m so với mực nước biển.',
    arrivalNote:'Xe dừng cuối đường dân cư ở khu trạm. Theo lối bộ men ghềnh khoảng 180 m tới bậc tháp. Từ bãi xe khách Gành Đá Đĩa cũng có thể đi bộ về phía bắc theo đường ven bờ.',
    views:[
      view('Cầu bộ giữa các khối granit',-2.6,1.2,13.43,-14.25,17.5,11.66,59,'Đứng trên lối có lan can nhìn qua khe đá. Đầu cầu rẽ lên các bậc dẫn đến cửa tháp.'),
      view('Toàn mũi đá từ phía tây nam',.1,-2.5,13.9,-20.66,18.52,21.55,68,'Góc máy trên cao tại điểm chụp của tỉnh. Phía sau tháp là mũi đá sáng màu và các hòn đá tách bờ.'),
      view('Cửa tháp và sân đèn',.02,-.04,16.95,-5.28,10.99,12.15,60,'Từ chỗ ngoặt lên bậc, nhìn theo mặt lục giác tới lan can sân đèn. Tấm pin nghiêng nhô về một phía.')
    ],build});
})();

export default window.VietnamSights;
