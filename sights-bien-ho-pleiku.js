'use strict';
(()=>{
  const id='mui-ngam-bien-ho-pleiku',catalogId='osm-node-13105118510',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(row=>row.id===catalogId);
  const source='https://giacngo.vn/khanh-thanh-bao-tuong-quan-the-am-tai-bien-ho-pleiku-post45483.html';
  const photo='https://vnexpress.net/bien-ho-pleiku-4071746.html';
  // Statue, courtyard and access steps are n13105118510, w1425726230 and
  // w1425726231. Comparing Esri World Imagery with the more oblique Google
  // satellite view puts the FOOT of the statue about 9–11 m west of the OSM
  // point. Align the ensemble at that foot, rather than at the statue's head.
  // The separate lookout n3600339699 is down a side path off the approach.
  // The commune confirms the statue restored on the former viewpoint site:
  // https://bienho.gialai.gov.vn/thong-bao-van-ban-moi/gioi-thieu-diem-van-hoa-du-lich-tren-dia-ban-xa-bien-ho.html
  const yaw=-.399,c=Math.cos(yaw),s=Math.sin(yaw),tau=2*Math.PI;
  const terrace=[[-.43,46.88],[2.91,46.11],[6.88,45.21],[7.81,33.25],[4.18,13.07],[5.88,-6.40],
    [4.47,-10.48],[1.76,-11.68],[-1.60,-11.83],[-4.49,-10.45],[-6.12,-7.26],[-6.12,6.17],
    [-9.05,22.71],[-6.99,37.30]];
  const paving=0xad9f88,edge=0xa9aaa2,stone=0x969b99,pale=0xc0c3bd,light=0xe7e7de,marble=0xe9eae4;
  const seed=n=>{const v=Math.sin(n*41.625+.41)*41783.1;return v-Math.floor(v);};
  function line(T,k,colour,pts,r,segs=18){
    const path=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)),false,'centripetal');
    const g=new T.TubeGeometry(path,segs,r,6,false);k.stamp(g,colour,0,0,0);g.dispose();
  }
  function stem(T,k,colour,profile,x=0,y=0,z=0,segments=32){
    const g=new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),segments);
    k.stamp(g,colour,x,y,z);g.dispose();
  }
  function drum(T,k,colour,r1,r2,y1,y2,sides=32){
    const g=new T.CylinderGeometry(r2,r1,y2-y1,sides);
    k.stamp(g,colour,0,(y1+y2)*.5,0,1,1,1,Math.PI/sides);g.dispose();
  }
  function statue(T,k){
    // Figures recorded at the inauguration, 30 November 2018: 5 m octagonal
    // pedestal, 3 m lotus seat, 7 m white-marble standing figure. The front
    // photograph by Kiều Dương resolves its pose, cloud band and lotus petals.
    drum(T,k,pale,1.76,1.70,0,.17,8);drum(T,k,light,1.65,1.59,.17,4.92,8);
    drum(T,k,marble,1.60,1.47,4.92,5.02,8);
    stem(T,k,light,[[1.45,5],[1.48,5.12],[1.40,5.21],[1.41,5.37],[1.38,6.43],[1.34,6.86],[1.30,7.14],[1.32,7.26]]);
    for(let j=0;j<3;j++)for(let i=0;i<8;i++){
      const a=i*tau/8+j*.47,rad=1.415-j*.027,base=5.39+.53*j;
      const pts=[];
      for(let n=0;n<=20;n++){
        const t=n/20,ax=a+(t-.5)*.79,py=base+.16*Math.sin(t*tau+.4)+.075*Math.sin(t*tau*2-.7);
        pts.push([rad*Math.sin(ax),py,rad*Math.cos(ax)]);
      }
      line(T,k,marble,pts,.046,17);
    }
    stem(T,k,light,[[1.31,7.03],[1.41,7.14],[1.44,7.23],[1.39,7.40],[1.29,7.62],[1.03,7.83],[.87,8.0]]);
    for(let j=0;j<2;j++)for(let i=0;i<14;i++){
      const a=(i+.52*j)*tau/14,r=1.29-.15*j;
      k.stamp(k.ball,marble,r*Math.sin(a),7.31+j*.27,r*Math.cos(a),.32,.33,.17,a,.13);
    }
    drum(T,k,marble,.91,.84,7.91,8.09);
    const h=7/1.073,A=window.CentralArch;
    A.statueFigure(T,k,marble,0,7.97,0,h,{robe:true,openHand:true,
      rightArm:[[-.137,.662,.035],[-.093,.768,.108],[-.094,.814,.109]],
      leftArm:[[.14,.63,.012],[.068,.548,.106],[.034,.526,.118]]});
    const robe=A.carving(T,k,marble,0,7.99,0,h);
    for(const side of [-1,1]){
      robe.sweep([[side*.016,1.034,-.020,.029,.036],[side*.049,.995,-.024,.022,.043],
        [side*.060,.932,-.023,.017,.045],[side*.069,.866,-.028,.022,.044],
        [side*.11,.781,-.020,.035,.041],[side*.127,.689,.001,.022,.041]],.024,16);
      robe.sweep([[side*.115,.71,.021,.017,.032],[side*.123,.59,.038,.021,.046],
        [side*.113,.41,.053,.020,.039],[side*.121,.18,.071,.022,.037],[side*.147,.080,.073,.012,.035]],.033,14);
    }
    robe.sweep([[0,.987,-.019,.036,.037],[0,1.025,-.018,.050,.052],
      [0,1.054,-.012,.033,.030],[0,1.073,-.012,.009,.010]],.08,24);robe.finish();
    for(let i=0;i<5;i++){
      const y=8.48+.61*i,w=.66-i*.044,z=.58-i*.018;
      line(T,k,light,[[-w,y+.57,z*.80],[-w*.62,y+.21,z],[w*.1,y+.08,z*1.08],[w*.58,y+.18,z],[w,y+.41,z*.82]],.031,19);
    }
    // Stone relief tilted towards the approach, with low planting in front.
    k.box(stone,0,.38,3.05,2.88,.76,1.04);k.box(edge,0,.75,3.14,2.87,1.35,.15,0,-.75);
    for(let j=0;j<3;j++)for(let i=0;i<7;i++){
      const x=-1.13+i*.37,z=3.62-.22*j,y=.48+j*.27;
      line(T,k,pale,[[x-.13,y,z],[x-.04,y+.08,z-.04],[x+.09,y+.15,z-.10],[x+.15,y+.04,z-.02]],.044,9);
    }
  }
  function slab(T,k,ring,top,base,colour){
    const shape=new T.Shape();ring.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
    const g=new T.ExtrudeGeometry(shape,{depth:top-base,bevelEnabled:false});g.rotateX(-Math.PI/2);
    k.stamp(g,colour,0,base,0);g.dispose();
    const face=new T.ShapeGeometry(shape);face.rotateX(-Math.PI/2);
    const mat=new T.MeshLambertMaterial({color:colour});
    mat.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec2 tilePoint;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntilePoint=position.xz;');
      sh.fragmentShader='varying vec2 tilePoint;\n'+sh.fragmentShader.replace('#include <color_fragment>',`
        #include <color_fragment>
        vec2 tiles=tilePoint/vec2(.69,.69);
        vec2 sides=min(fract(tiles),1.-fract(tiles)),aa=max(vec2(.002),fwidth(tiles));
        vec2 seam=smoothstep(vec2(.008)-aa*.5,vec2(.014)+aa*.5,sides);
        vec2 cell=mod(floor(tiles),512.);
        float fleck=fract(sin(dot(cell,vec2(29.1,63.7)))*4382.);
        diffuseColor.rgb*=1.+(1.-smoothstep(.13,.65,max(aa.x,aa.y)))*((fleck-.5)*.10-(1.-seam.x*seam.y)*.27);
      `);
    };
    const deck=new T.Mesh(face,mat);deck.userData.floorTop=top+.016;deck.receiveShadow=true;k.group.add(deck);
  }
  function lamp(T,k,x,y,z){
    const iron=0x424743,glass=0xe4e4d8;
    stem(T,k,iron,[[.19,0],[.19,.12],[.14,.18],[.10,.37],[.11,.46],[.067,.53],[.053,3.02],[.086,3.12],[.07,3.36]],x,y,z,12);
    for(let i=0;i<4;i++){
      const a=i*tau/4+.37,dx=.40*Math.cos(a),dz=.40*Math.sin(a);
      line(T,k,iron,[[x,y+2.86,z],[x+dx*.38,y+2.85,z+dz*.38],[x+dx*.94,y+3.02,z+dz*.94],[x+dx,y+3.16,z+dz]],.032,10);
      k.stamp(k.ball,glass,x+dx,y+3.31,z+dz,.155,.20,.155);
    }
    k.stamp(k.ball,glass,x,y+3.54,z,.17,.23,.17);
  }
  function court(T,k){
    slab(T,k,terrace,.0,-.48,paving);
    const high=[[-6.12,4.7],[4.91,4.7],...terrace.slice(5,11)];slab(T,k,high,.45,-.02,paving);
    for(let i=0;i<3;i++)k.box(edge,-.61,(3-i)*.075,4.84+i*.30,10.97,(3-i)*.15,.34);
    const rail=new T.LatheGeometry([[.113,0],[.115,.07],[.073,.10],[.069,.16],[.116,.24],
      [.117,.28],[.074,.36],[.061,.46],[.080,.52],[.117,.57],[.110,.62]].map(p=>new T.Vector2(...p)),10);
    function railing(a,b,lift){
      const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),angle=Math.atan2(dx,dz),spans=Math.ceil(len/2.85);
      const x=(a[0]+b[0])*.5,z=(a[1]+b[1])*.5;
      k.box(stone,x,lift+.13,z,.29,.26,len+.05,angle);k.box(edge,x,lift+.96,z,.23,.16,len+.035,angle);
      for(let j=0;j<spans;j++){
        const t=j/spans,px=a[0]+t*dx,pz=a[1]+t*dz;
        k.box(stone,px,lift+.55,pz,.30,1.10,.30,angle);k.tapered(edge,px,lift+1.15,pz,.215,.045,.16,1,4);
        const n=Math.max(2,Math.round(len/spans/.36));
        for(let l=1;l<n;l++){const u=(j+l/n)/spans;k.stamp(rail,pale,a[0]+u*dx,lift+.26,a[1]+u*dz);}
      }
    }
    for(let i=2;i<terrace.length;i++){
      const a=terrace[i],b=terrace[(i+1)%terrace.length];
      if((a[1]-4.7)*(b[1]-4.7)<0){
        const t=(4.7-a[1])/(b[1]-a[1]),q=[a[0]+t*(b[0]-a[0]),4.7];
        railing(a,q,a[1]<4.7?.45:0);railing(q,b,b[1]<4.7?.45:0);
      }else railing(a,b,a[1]<4.7?.45:0);
    }
    rail.dispose();
    const raised={...k,stamp:(g,t,x,y,z,...args)=>k.stamp(g,t,x,y+.45,z,...args),box:(t,x,y,z,...args)=>k.box(t,x,y+.45,z,...args)};
    statue(T,raised);
    for(const [x,z] of [[-5,4.1],[4.56,4.0],[-5,-7.4],[4.7,-6.6],[-6.5,18],[4.1,18.6]])lamp(T,k,x,z<4.7?.45:0,z);
    k.box(0x737b68,0,.11,7.82,2.83,.22,3.74);
    for(let i=0;i<8;i++)for(let j=0;j<6;j++){
      const border=i===0||i===7||j===0||j===5,x=(j-2.5)*.44,z=6.30+i*.43;
      k.stamp(k.ball,border?0x5b703a:0x69803c,x,border?.29:.246,z,.34,border?.22:.12,.31);
      if(!border)for(let l=0;l<3;l++)k.stamp(k.ball,l%2?0xbf7a37:0xb59037,x+(seed(l+23*i)-.5)*.36,.355,z+(seed(31*j+l)-.5)*.34,.056,.040,.051);
    }
    const steps=18,z0=46.04,z1=62.15;
    for(let i=0;i<steps;i++){
      const t=(i+.5)/steps;k.box(i%2?paving:edge,2.9+2.72*t,-.34-i*.155,z0+t*(z1-z0),6.75,.65,(z1-z0)/steps+.07,-.163);
    }
  }
  // Edge of the lower promenade traced in the orthophoto; positive Z goes
  // towards the gate. Together, VNE's aerial and Báo Gia Lai's shoreline
  // photograph resolve the lower parapet, pale walking surface and bank of
  // weathered basalt above it. The seasonal waterline varies outside the curb.
  const shore=[ [13,155],[8,132],[3,110],[-2,93],[-6,79],[-12,63],[-19,51],[-25,40],[-28,30],
    [-28.2,20],[-26.5,10],[-24.3,-1],[-21.3,-11],[-17,-20],[-11.8,-28],[-5.5,-35],[.7,-40],
    [6.7,-43.5],[12.4,-44.4],[17.1,-43.3],[21.5,-40.4],[25,-35],[27.6,-28],[29.2,-19],
    [30,-7],[30.4,4],[31.5,15],[32.3,27],[32.1,40],[32.6,54],[33.6,70],[36.1,86],
    [39.5,100],[43.4,115],[48.3,131],[54,154] ];
  // Wooded margins on the two facing shores, OSM w1425730072/73. Refer
  // trees to the native DEM. Their relative heights and spacing are estimated.
  const woods=[
    [[815,-67],[839,-71],[841,-92],[867,-113],[825,-137],[776,-227],[735,-242],[527,-262],[418,-318],[380,-349],
      [249,-537],[215,-633],[207,-716],[269,-1069],[79,-1498],[2,-1607],[-90,-1696],[-62,-1591],[44,-1449],
      [89,-1326],[127,-1275],[159,-1154],[154,-1077],[102,-1006],[100,-921],[57,-852],[46,-803],[-18,-742],
      [-28,-704],[-12,-679],[68,-630],[134,-495],[132,-433],[174,-219],[160,-172],[223,-151],[345,-150],
      [437,-111],[691,-153],[755,-133]],
    [[-742,-562],[-668,-603],[-648,-571],[-731,-465],[-857,-363],[-882,-324],[-889,-250],[-932,-192],
      [-923,-153],[-936,-110],[-878,-89],[-884,-17],[-848,77],[-853,109],[-824,149],[-720,202],[-698,194],
      [-652,251],[-551,290],[-503,276],[-452,334],[-363,360],[-386,428],[-352,547],[-361,566],[-404,547],
      [-457,447],[-489,450],[-526,488],[-568,482],[-606,427],[-760,371],[-862,272],[-887,265],[-963,102],
      [-1090,-283],[-1173,-314],[-1216,-361],[-1106,-461],[-1031,-400],[-929,-546],[-842,-512]] ];
  function woodland(T,k,trees){
    const sets=[[],[],[]],pose=new T.Object3D();
    function inside(x,z,ring){
      let yes=false;
      for(let i=0,j=ring.length-1;i<ring.length;j=i++){
        const [a,b]=ring[i],[d,e]=ring[j];if((b>z)!==(e>z)&&x<a+(d-a)*(z-b)/(e-b))yes=!yes;
      }
      return yes;
    }
    for(let j=0;j<142;j++)for(let i=0;i<170;i++){
      const n=i+j*171,x=-1160+(i+seed(n+3)*.90)*12.3,z=-1100+(j+seed(n+1202)*.90)*12.1;
      if(x*x+z*z>1110**2||!woods.some(r=>inside(x,z,r)))continue;
      const h=7.0+seed(n+94)*7.2,w=h*(.94+.34*seed(n-14));sets[n%3].push({x,z,h,w,a:seed(n+843)*tau});
    }
    const meshes=sets.map((points,v)=>{
      const m=new T.InstancedMesh(trees.distantGeometry('tree',v),trees.billboardMaterial(),points.length);
      k.group.add(m);return m;
    });
    return ground=>sets.forEach((points,v)=>{
      const m=meshes[v];
      points.forEach(({x,z,h,w,a},j)=>{
        const y=ground(x,z);
        pose.position.set(x,y-.16,z);pose.rotation.set(0,a,0);pose.scale.set(w,h,w);
        pose.updateMatrix();m.setMatrixAt(j,pose.matrix);m.setColorAt(j,new T.Color(.73+seed(j+30)*.11,.79+seed(j+28)*.11,.68));
      });
      m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
    });
  }
  function bank(T,k){
    const curve=new T.CatmullRomCurve3(shore.map(([x,z])=>new T.Vector3(x,0,z)),false,'centripetal');
    const p=[],uv=[],colors=[],idx=[],rows=[],tint=new T.Color(),count=210;
    // Start at the basalt foot, then cross the lower curb, the path, its
    // retaining wall and the planted slope to the shoulder of the headland.
    const cuts=[[-5.9,-1.6,0x665a49],[-3.2,-.36,0x82725a],[-.4,-.10,0xa79275],
      [0,.04,0xb3a387],[.23,.075,0xb9ad98],[2.55,.07,0xb7aa94],[2.81,.08,0xa29880],
      [2.90,.66,0x9f896c],[3.19,.74,0xaa977a],[.28,0,0x977856],[.54,0,0x89704e],
      [.81,0,0x727647],[1,0,0x737f4e]];
    for(let i=0;i<=count;i++){
      const q=curve.getPointAt(i/count),t=curve.getTangentAt(i/count),nx=-t.z,nz=t.x;
      const width=(12.9+7.7*Math.max(0,nz))*(.98+.036*Math.cos(i*.067));
      const row={x:q.x,z:q.z,nx,nz,width};rows.push(row);
      for(let j=0;j<cuts.length;j++){
        const [a,dy,colour]=cuts[j],d=j<9?a:3.19+(width-3.19)*a;
        const x=q.x+nx*d,z=q.z+nz*d;
        p.push(x,dy,z);uv.push(x*.25,z*.25+dy*.16);
        tint.setHex(colour);tint.multiplyScalar(.91+seed(i*19+j)*.11);colors.push(tint.r,tint.g,tint.b);
        if(i&&j){const h=i*cuts.length+j;idx.push(h-cuts.length-1,h-1,h,h-cuts.length-1,h,h-cuts.length);}
      }
    }
    const g=new T.BufferGeometry();g.setIndex(idx);g.setAttribute('position',new T.Float32BufferAttribute(p,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    const surface=new T.MeshStandardMaterial({vertexColors:true,roughness:.98,side:T.DoubleSide});
    surface.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec2 slopeUV;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nslopeUV=position.xz;');
      sh.fragmentShader='varying vec2 slopeUV;\n'+sh.fragmentShader.replace('#include <color_fragment>',`
        #include <color_fragment>
        vec2 u=slopeUV*4.27;float d=sin(u.x+1.7*sin(u.y*.74))*cos(u.y*1.28+.46*u.x);
        diffuseColor.rgb*=1.+d*.10*(1.-smoothstep(.28,1.4,length(fwidth(slopeUV))));
      `);
    };
    const mesh=new T.Mesh(g,surface);mesh.receiveShadow=true;k.group.add(mesh);
    // Close the top between the opposite brows. Clip the slope against the
    // real shoreline sampled by the renderer at display time.
    const rim=rows.map(v=>[v.x+v.nx*v.width,v.z+v.nz*v.width]);
    const shape=new T.Shape(rim.map(([x,z])=>new T.Vector2(x,-z)));
    const boundary=new T.ShapeGeometry(shape);boundary.rotateX(-Math.PI/2);
    const cap=new T.BufferGeometry(),cp=[],ci=[],cg=[],cu=[],baseRing=boundary.attributes.position;
    // Subdivide the triangulated top so that it can follow changes in the
    // DEM outside the flat stone court without hiding the court below grass.
    for(let f=0;f<boundary.index.count;f+=3){
      const tri=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(baseRing,boundary.index.getX(f+j)));
      const n=8,rows=[];
      for(let j=0;j<=n;j++){
        const here=[];rows.push(here);
        for(let i=0;i<=n-j;i++){
          const u=i/n,v=j/n,x=tri[0].x*(1-u-v)+tri[1].x*u+tri[2].x*v,z=tri[0].z*(1-u-v)+tri[1].z*u+tri[2].z*v;
          here.push(cp.length/3);cp.push(x,0,z);cu.push(x*.22,z*.22);tint.setHex(0x75814c).multiplyScalar(.96+.07*Math.sin(.21*x+.081*z));cg.push(tint.r,tint.g,tint.b);
          if(j&&i){const prev=rows[j-1];ci.push(here[i-1],prev[i],here[i],here[i-1],prev[i-1],prev[i]);}
        }
        if(j){const prev=rows[j-1];ci.push(here.at(-1),prev.at(-2),prev.at(-1));}
      }
    }
    boundary.dispose();cap.setAttribute('position',new T.Float32BufferAttribute(cp,3));cap.setAttribute('color',new T.Float32BufferAttribute(cg,3));cap.setAttribute('uv',new T.Float32BufferAttribute(cu,2));cap.setIndex(ci);
    const turf=new T.TextureLoader().load('streetscape/surfaces/grass-color.webp');
    turf.colorSpace=T.SRGBColorSpace;turf.wrapS=turf.wrapT=T.RepeatWrapping;turf.anisotropy=3;
    const grassMaterial=new T.MeshLambertMaterial({map:turf,vertexColors:true,side:T.DoubleSide});
    grassMaterial.onBeforeCompile=sh=>{
      sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>',
        'vec3 cutGrass=texture2D(map,vMapUv).rgb;diffuseColor.rgb*=clamp(.61+3.55*dot(cutGrass,vec3(.27,.61,.12)),.59,1.64);');
    };
    const capMesh=new T.Mesh(cap,grassMaterial);capMesh.receiveShadow=true;k.group.add(capMesh);
    const trees=createTreeModels(T),fitWoods=woodland(T,k,trees),spots=[];
    // Individually visible tree crowns flank the upper plaza; pines form
    // two rows farther down the access ridge. Keep the stone plaza open.
    for(const t of [[-9.4,7.5,6.2,3.1],[8.1,14.3,6.4,5.1],[10.2,25.4,8.2,6.5],[-10.7,29.2,5.0,4.4],
      [-9.1,-6.5,5.1,3.9],[11.4,-5,4.7,4.2],[7.3,-16.2,4.3,3.8],[14.5,-19,3.6,4.2]])
      spots.push([...t,'tree',null]);
    for(let i=0;i<rows.length;i++){
      const row=rows[i],gap=row.z<-16?.47:.72;
      if(seed(i+102)>gap)continue;
      const u=.42+.50*seed(i+98),d=3.19+(row.width-3.19)*u;
      const x=row.x+row.nx*d,z=row.z+row.nz*d;
      if(z<56&&x>-10.9&&x<9.0&&z>-12)continue;
      const h=1.0+seed(i+67)*2.9+(z>45?1.6:0);
      spots.push([x,z,h,h*(.94+seed(i+119)*.46),'tea',[i,u]]);
    }
    for(let i=0;i<21;i++)for(const side of [-1,1]){
      const z=55+i*4.72,mid=3.5+(z-46)*.245,x=mid+side*(6+3*seed(i*3+side));
      const h=6.5+seed(i+64)*4.2;
      spots.push([x,z,h,h*(.51+.16*seed(112*i+side)),'pine',null]);
    }
    const groves=[];
    for(const kind of ['tree','tea','pine'])for(let v=0;v<3;v++){
      const points=spots.filter(([x,,h,,type])=>type===kind&&Math.abs(Math.round(x+17*h))%3===v);
      if(!points.length)continue;
      const m=new T.InstancedMesh(trees.geometry(kind,true,v),trees.material,points.length);
      k.group.add(m);m.castShadow=m.receiveShadow=true;groves.push({m,points});
    }
    const pos=g.attributes.position,p0=p.slice(),upper=cap.attributes.position,pose=new T.Object3D();
    const lowerRows=rows.filter(q=>q.z<124);
    const rails=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshLambertMaterial({color:0xb2a89a}),lowerRows.length*3);
    k.group.add(rails);rails.receiveShadow=true;
    return (ground,level)=>{
      fitWoods(ground);
      const crest=(x,z)=>level-.27-Math.max(0,Math.min(1,(z-40)/24))*3.16+
        Math.max(0,Math.min(1,(z-97)/57))*(ground(x,z)+.14-level+3.43);
      function bankHeight(row,blend){
        const low=row.low+.74,high=crest(row.x+row.nx*row.width,row.z+row.nz*row.width);
        return low+(high-low)*(blend*(1.36-.36*blend));
      }
      rows.forEach((row,i)=>{
        const {x,z,nx,nz}=row;
        row.low=Math.max(-8.1,ground(x,z)+.18,ground(x+2.8*nx,z+2.8*nz)+.12);
        for(let j=0;j<cuts.length;j++){
          const at=i*cuts.length+j,px=p0[3*at],pz=p0[3*at+2],natural=ground(px,pz);
          const y=j<9?row.low+cuts[j][1]:bankHeight(row,cuts[j][0]);
          const taper=Math.max(0,Math.min(1,(pz-122)/30)),cover=Math.max(y,natural+(j<3?.07:.21));
          pos.setY(at,cover+(natural-.16-cover)*taper*taper*(3-2*taper));
        }
      });
      pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
      let index=0;
      function railPart(x,y,z,dx,dy,dz,angle,grade=0){
        pose.position.set(x,y,z);pose.rotation.set(-grade,angle,0,'YXZ');pose.scale.set(dx,dy,dz);
        pose.updateMatrix();rails.setMatrixAt(index++,pose.matrix);
      }
      for(const [i,row] of lowerRows.entries()){
        const x=row.x+.19*row.nx,z=row.z+.19*row.nz,base=row.low+.075;
        railPart(x,base+.46,z,.14,.92,.14,0);
        if(i+1>=lowerRows.length)continue;
        const q=lowerRows[i+1],dx=q.x+.19*q.nx-x,dz=q.z+.19*q.nz-z,dh=q.low-row.low,run=Math.hypot(dx,dz);
        for(const h of [.44,.85])railPart(x+dx*.5,base+h+dh*.5,z+dz*.5,.13,.105,Math.hypot(run,dh),Math.atan2(dx,dz),Math.atan2(dh,run));
      }
      rails.count=index;rails.instanceMatrix.needsUpdate=true;rails.computeBoundingSphere();
      for(let i=0;i<upper.count;i++){
        const x=upper.getX(i),z=upper.getZ(i);
        upper.setY(i,Math.max(ground(x,z)+.26,crest(x,z)));
      }
      upper.needsUpdate=true;cap.computeVertexNormals();cap.computeBoundingSphere();
      for(const {m,points} of groves){
        points.forEach(([x,z,h,w,kind,onSlope],i)=>{
          const y=onSlope?bankHeight(rows[onSlope[0]],onSlope[1]):crest(x,z);
          pose.position.set(x,y-.05,z);pose.rotation.set(0,seed(i*28+x)*tau,0);pose.scale.set(w,h,w);
          pose.updateMatrix();m.setMatrixAt(i,pose.matrix);
        });
        m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
      }
    };
  }
  function build(T,kit){
    const ball=new T.SphereGeometry(1,14,8),k={...kit,ball};
    k.palette({stone:[edge,stone,pale,light,marble],metal:0x424743});
    court(T,k);ball.dispose();const decks=k.group.children.filter(m=>m.userData.floorTop!==undefined);
    const fit=bank(T,k);
    k.group.userData.fitGround=ground=>{
      let level=Math.max(0,...terrace.map(([x,z])=>ground(x,z)));
      for(const z of [0,14,29,44])for(const x of [-7,4,13,18])level=Math.max(level,ground(x,z));
      level+=.52;
      const merged=k.group.children.find(mesh=>mesh.geometry?.hasAttribute('finishKind'));
      if(merged)merged.position.y=level;
      for(const mesh of decks)mesh.position.y=level+mesh.userData.floorTop;
      fit(ground,level);
    };
  }
  const view=(name,x,z,height,r,a,e,f=51)=>({name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius:r,viewAngle:yaw+a,viewElevation:e,viewFov:f,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Mũi Đầu Rùa ở Biển Hồ',kind:'Điểm ngắm cảnh',
    lon:107.999790,lat:14.040096,yaw,start:raw?.start??[107.9993443,14.0342026],mappedEntrance:true,visitOnArrival:true,
    source,photo,map:'https://www.openstreetmap.org/node/13105118510',width:15,depth:51,approachMeters:undefined,
    modeledBuildings:['w1425726230'],solids:[],reserve:(x,z,p)=>x>-32-p&&x<58+p&&z>-47-p&&z<155+p,
    description:'Mũi Đầu Rùa nhô vào lòng hồ Tơ Nưng. Bậc đá dẫn lên sân có lan can chạm con tiện. Tượng Quán Thế Âm bằng cẩm thạch trắng cao 7 m, trên đài sen cao 3 m và bệ bát giác cao 5 m. Bên dưới là đường dạo men chân kè. Cao độ đường dạo và hoa văn được ước dựng theo ảnh.',
    arrivalNote:'Xe dừng cạnh bãi trước cổng trên đường dẫn từ Tôn Đức Thắng. Theo đường thông và bậc đá khoảng 680 m để đến mũi ngắm hồ.',
    views:[view('Tượng Quán Thế Âm trên đài sen',0,0,19.1,23.8,.13,.07),
      view('Mũi Đầu Rùa giữa hồ Tơ Nưng',0,19,8,128,-2.21,.34,55),
      view('Nhìn qua lan can xuống hồ',-18,-17,5,23,1.31,.17,60)],build});
})();
