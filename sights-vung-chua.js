'use strict';
(()=>{
  const id='vung-chua-dao-yen',catalogId='osm-node-11563767582',lon=106.4881227,lat=17.9222823;
  const mx=111320*Math.cos(lat*Math.PI/180),local=(x,y)=>[(x-lon)*mx,(lat-y)*110900];
  const report='https://quangbinhtourism.vn/diem-du-lich/khac/vung-chua-dao-yen.html';
  const photo=n=>'https://commons.wikimedia.org/?curid='+n;
  // Cross sections (east, landward edge, seaward edge) of beach w884243619.
  // The photograph station is on the south-facing beach, west of Mũi Rồng.
  const beach=[[-240,-89,-37],[-215,-78,-38],[-190,-71,-39],[-165,-72,-40],[-140,-67,-35],[-115,-59,-27],
    [-90,-51,-19],[-65,-43,-11],[-40,-35,-1],[-15,-27,10],[10,-18,20],[35,-9,31],[60,0,42],[85,6,46],
    [110,8,49],[135,10,53],[160,8,48],[185,-1,43],[210,-11,38],[235,-25,28],[260,-40,16],[285,-52,4],
    [310,-50,-8],[335,-49,-8],[360,-47,-8],[385,-45,-8],[410,-44,-8],[435,-46,-8],[460,-53,-8],
    [485,-60,-8],[510,-71,-8],[535,-83,-11],[560,-95,-27],[585,-107,-43],[610,-119,-59],[635,-116,-65]];
  // OSM w61973139 relative to peak n10303616063. The 36 m grid stores elevation
  // and colour from the original Copernicus DEM and Sentinel-2 landscape page.
  const islandCentre=local(106.4956151,17.911567);
  const islandRing=[[0.7,508.7],[79.7,488.9],[149.8,446.4],[180.0,418.2],[250.9,297.6],[238.6,273.6],[227.7,279.1],[213.8,286.0],[208.6,276.8],[228.8,259.4],[224.1,247.2],[201.9,248.5],[184.5,249.6],[106.8,247.5],[101.3,232.0],[110.4,217.8],[124.8,189.3],[150.6,179.3],[171.4,150.0],[177.1,122.3],[132.7,119.5],[116.1,103.0],[130.1,73.9],[157.4,49.9],[142.9,36.5],[165.7,8.6],[142.9,-61.3],[94.2,-139.3],[42.5,-211.2],[-18.7,-344.0],[-75.7,-362.0],[-152.0,-354.6],[-204.2,-312.3],[-268.3,-221.7],[-300.1,-128.3],[-313.7,-102.2],[-336.0,-107.6],[-317.5,-42.9],[-258.3,0.7],[-230.0,29.4],[-173.2,44.1],[-169.8,104.4],[-131.4,158.7],[-117.2,173.1],[-60.5,202.2],[-46.4,216.5],[-17.3,238.8],[15.1,275.8],[19.6,311.4],[-31.2,392.5],[-48.0,416.4],[-48.7,502.1],[-34.5,516.5]];
  const islandPalette=[0x90a292,0x869788,0x7f9081,0x778d7b,0x798978,0x758876,0x758574,0x6f8872,0x6f8574,0x6e8176,0x688073,0x63807a,0x647f74,0x687d75,0x647d76,0x617d75];
  const packedIsland=
    'AAsACwALAAsADAAJAAUACQAIAAkACQAJAAsACwALAAsACwALAAsACwALAAsACwAMAAoAAwEEAwIBBQACAAEACwALAAsACwALAAsACwALAAsACwALAAkB'+
    'AgUBCwEQAgYBAQAAAwADAAsACwALAAsACwALAAsACwALAA0BAwcAEwMgBicBDwEEBgABAAEACwAPAA8ACwALAAsACwALAAkACQcCFQMiBSsGMgIcBAoF'+
    'AwAAAwANAAsACwALAAsADgALAAkAAwECFAMjBSwFMQc0By4GFwYIAQICAAMACQAJAA0ADgAOAAkACAAAAwAXAyYHLAUvBzEHNAomBhMCBwABAgAJAAkA'+
    'DQAOAA4ACAADAAEGARsHKQcrByoHKwczCjMHJAYTBAYBAAIACQAJAAkADQACAAECAggHHAcnBygHJQcoBzMHOAcyBiEDDgECAwAJAAkACQANAAIAAAQC'+
    'CwocByMHIgchCigHMwc5BzoGLQQYBQYBAAEACQAJAA0ACAEBBAIMBRcHGgwZChsMIQowBzcGPQY5BigGEgMAAQACAAkADQAKAAgBAAMABwEJBwoHDwoc'+
    'CjQKPAZCBkQEPQYmBAEBAAEACQANAAwADQANAAoBBQMABwARBR8GNAY6Bj4GQQY/BisCAQEAAgAJAA0ADgANAA0ADQAJAQkIABYEJQYyBjIGNAY5BjwB'+
    'LgAEAQAFAAkACQALAA4ADQANAAkACQkBFwQiBikGJwYpBi8EMwInAQcCAAQACQAJAAsADgAOAA4ADQAKBAYNABMEGQQYBhwGIgQoAiABBQEAAAAFAAkA'+
    'CwAPAA4ADgANAA0ACgAEAgEGAAoJDQUTBBQCDQADAQACAAUACQALAA8ADgAOAA4ADQANAAgAAQMABgYIBAoECgEGAAMBAQIABQAKAAsACwALAA8ADgAO'+
    'AA0ACQAGAAEDAAYEBwQFAQUABwMGBAEFAAkACwALAAsADwAOAA4ADgAJAAgABQACBQAHAgoBEQIYBBICBAEAAwALAAsACwALAA8ADwAOAAwACQAGAAQD'+
    'AAoCEgQbBiIFFwIAAQABAAsACwALAAsADwAPAA8ADAAKAAYBBAcCEQQdBiYEJgMTAgABAAIADAAPAA8ADwAPAA8ADwAMAAoBCgoEFgAjBi0GLAMVAwAA'+
    'AAAABQAMAA8ADwAPAA8ADwAPAAwACQUIEgEfBikGKgUeBQcCAAAAAQAIAAwADAAMAAwADAAMAAwADAAKBwUUBh4GHgQWAwoBAAAAAgAFAAgADAAMAAwA'+
    'DAAMAAwADAAMAAgGAw8FDwIHAQQAAQAAAwAIAAoACgAMAAwADAAMAAwADAAMAAwADQMJBAACAQABAAMACQAJAAoACgAKAA8ADwAPAA8ADwAPAA8ADwAP'+
    'AA8ACQANAA0ACQANAAwADwAMAAw=';
  function bank(x){
    const n=Math.max(0,Math.min(beach.length-2,Math.floor((x-beach[0][0])/25)));
    const a=beach[n],b=beach[n+1],t=Math.max(0,Math.min(1,(x-a[0])/(b[0]-a[0])));
    return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  }
  function camera(name,station,altitude,subject,h,fov,photo,photoCatalogId,description){
    const [x,z]=local(...subject),[ex,ez]=local(...station),dx=ex-x,dz=ez-z,dy=altitude-h;
    return {name,offset:[x,z],height:h/.46,viewBase:'monument',viewAngle:Math.atan2(dx,dz),
      viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewRadius:Math.hypot(dx,dy,dz),viewFov:fov,photo,photoCatalogId,description};
  }
  const views=[
    camera('Đảo Yến qua hàng phi lao',[106.488406,17.922399],3.1,[106.495438,17.91178],24,35,photo(93540011),catalogId,
      'Từ bờ Vũng Chùa nhìn qua những thân phi lao thưa về Hòn Nồm, còn gọi là Đảo Yến. Sườn cây cao hơn ở phía bắc đảo.'),
    camera('Mép nước và bãi cát Vũng Chùa',[106.4881227,17.9222823],2.6,[106.48992,17.91411],5,68,photo(30735829),'osm-node-6841107787',
      'Đứng bên mép nước nhìn chếch về phía biển rộng. Đảo Yến nằm về bên trái tầm nhìn, trước mặt là bãi cát thoải và nước nông.'),
    camera('Đảo Yến từ sườn đồi Thọ Sơn',[106.4946445,17.924499],26,[106.495415,17.91156],25,51,photo(30735831),'vung-chua-tu-doi-tho-son',
      'Từ sườn đồi nhìn xuống bãi cây và mặt biển. Đảo Yến đứng riêng ngoài khơi, đối diện dải bờ nơi có khu tưởng niệm.'),
    camera('Bờ cát tây và mũi đá của Đảo Yến',[106.48818,17.91255],287,[106.49508,17.91099],26,64,report,'osm-way-61973139',
      'Góc cao nhìn từ biển phía tây. Bãi cát ôm sườn tây đảo, phía đông và mũi nam là bờ đá. Đường bờ theo bản đồ và địa hình theo dữ liệu độ cao.'),
  ];
  function strand(T,k){
    const pos=[],col=[],idx=[],stations=[],sand=new T.Color(0xdebd8f),wet=new T.Color(0xac987e),grass=new T.Color(0x879067);
    const rows=175,cols=12,c=new T.Color();
    for(let j=0;j<=rows;j++){
      const x=-240+j*5,[back,edge]=bank(x);
      for(let i=0;i<=cols;i++){
        const t=i/cols,z=back-4+(edge-back+8)*t,noise=Math.sin(x*.18+z*.35)*.014;
        pos.push(x,0,z);c.copy(sand).lerp(wet,Math.max(0,(t-.56)/.44)).lerp(grass,Math.max(0,1-t*9));
        c.multiplyScalar(1+noise);col.push(c.r,c.g,c.b);stations.push(t);
        if(j<rows&&i<cols){const a=j*(cols+1)+i,b=a+cols+1;idx.push(a,a+1,b,b,a+1,b+1);}
      }
    }
    const g=new T.BufferGeometry(),p=new T.Float32BufferAttribute(pos,3);g.setAttribute('position',p);
    g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.96});
    material.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 vcShore;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvcShore=position.xz;');
      shader.fragmentShader='varying vec2 vcShore;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float fine=fract(sin(dot(floor(vcShore*18.),vec2(12.9898,78.233)))*43758.5453);
        float aa=1.-smoothstep(.012,.15,max(fwidth(vcShore.x),fwidth(vcShore.y)));
        diffuseColor.rgb*=1.+.12*(fine-.5)*aa+.017*sin(1.28*vcShore.y+.62*vcShore.x+.83*sin(.16*vcShore.x));
      `);
    };
    const mesh=new T.Mesh(g,material);mesh.name='Bãi cát Vũng Chùa';mesh.receiveShadow=true;k.group.add(mesh);
    return ground=>{
      for(let j=0;j<=rows;j++){
        const x=-240+j*5,[back,edge]=bank(x),wetLevel=ground(x,edge+12),dryLevel=Math.max(wetLevel+.86,ground(x,back));
        for(let i=0;i<=cols;i++){
          const n=j*(cols+1)+i,t=stations[n],z=pos[n*3+2];
          const slope=dryLevel+(wetLevel-.20-dryLevel)*t;
          p.setY(n,Math.max(ground(x,z)+.10*(1-t),slope)+.045*Math.sin(x*.19+z*.14));
        }
      }
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  // Two young trees photographed on this shore by Linhcandng (CC BY-SA 3.0).
  // The small transparent atlas keeps the delicate sprays visible on a phone.
  function casuarinas(T,k){
    const seeds=[[43,-1,7.7],[33.8,1,4.3],[31.9,6,5.2],[-36,-45,5.3],[-13,-32,5.0]];
    for(let i=0;i<59;i++){
      const x=-227+i*14.2,edge=bank(x)[0];
      if(x>-45&&x<72)continue;
      seeds.push([x,edge-3-5*(1+Math.sin(i*4.65)),3.9+2.9*(.5+.5*Math.sin(i*2.9))]);
    }
    const meshes=[],pose=new T.Object3D(),right={value:new T.Vector2(1,0)};
    const tex=new T.TextureLoader().load('sight-imagery/vung-chua-phi-lao.webp');tex.colorSpace=T.SRGBColorSpace;
    const mat=new T.MeshLambertMaterial({map:tex,alphaTest:.07,transparent:true,depthWrite:false,side:T.DoubleSide,emissive:0x12160d});
    mat.onBeforeCompile=shader=>{
      shader.uniforms.shoreTreeRight=right;
      shader.vertexShader='uniform vec2 shoreTreeRight;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\ntransformed.xz=shoreTreeRight*position.x;');
    };
    for(let variant=0;variant<2;variant++){
      const geom=new T.PlaneGeometry(variant?.73:.65,1);geom.translate(0,.5,0);
      const uv=geom.attributes.uv,p=geom.attributes.normal;
      for(let i=0;i<uv.count;i++){
        uv.setXY(i,(variant*100+.5+uv.getX(i)*(variant?98:90))/200,1-(1-uv.getY(i))*(variant?130:144)/150);
        p.setXYZ(i,0,1,0);
      }
      const trees=seeds.filter((_,i)=>i%2===variant),mesh=new T.InstancedMesh(geom,mat,trees.length);
      mesh.name='Phi lao ven biển';mesh.onBeforeRender=(renderer,scene,camera)=>{
        const e=camera.matrixWorld.elements;right.value.set(e[0],e[2]).normalize();
      };
      k.group.add(mesh);meshes.push([mesh,trees]);
    }
    return ground=>{
      for(const [mesh,trees] of meshes){
        trees.forEach(([x,z,h],i)=>{pose.position.set(x,ground(x,z)-.09,z);pose.scale.setScalar(h);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);});
        mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
      }
    };
  }
  function offshoreIsland(T,k){
    // The road district ends before the island. Sample the original survey at
    // the island itself so the sea cannot show through the distant relief.
    const grid=Uint8Array.from(atob(packedIsland),c=>c.charCodeAt(0)),palette=islandPalette.map(c=>new T.Color(c));
    const pos=[],col=[],idx=[],heights=[],cache=new Map(),origin=islandCentre;
    const sand=new T.Color(0xd1bc91),rocks=new T.Color(0x6d6861),wood=new T.Color(0x4b6345),work=new T.Color();
    const orientation=Math.sign(islandRing.reduce((s,a,i)=>{const b=islandRing[(i+1)%islandRing.length];return s+a[0]*b[1]-a[1]*b[0];},0));
    function coast(x,z){
      let d=Infinity,facing=0;
      for(let i=0;i<islandRing.length;i++){
        const [a,b]=islandRing[i],[c,e]=islandRing[(i+1)%islandRing.length],dx=c-a,dz=e-b,l=dx*dx+dz*dz;
        if(!l)continue;
        const t=Math.max(0,Math.min(1,((x-a)*dx+(z-b)*dz)/l)),dd=(x-a-t*dx)**2+(z-b-t*dz)**2;
        if(dd<d){d=dd;facing=orientation*dz/Math.sqrt(l);}
      }
      return [Math.sqrt(d),facing];
    }
    function vertex(a){
      const [x,z]=a,key=Math.round(x*100)+','+Math.round(z*100);
      if(cache.has(key))return cache.get(key);
      const u=(x+360)/36,v=(z+396)/36,i=Math.min(17,Math.max(0,Math.floor(u))),j=Math.min(26,Math.max(0,Math.floor(v)));
      const fx=Math.max(0,Math.min(1,u-i)),fy=Math.max(0,Math.min(1,v-j)),n=(j*19+i)*2;
      let h=0;work.setRGB(0,0,0);
      for(const [ofs,w] of [[0,(1-fx)*(1-fy)],[2,fx*(1-fy)],[38,(1-fx)*fy],[40,fx*fy]]){
        const tint=palette[grid[n+ofs+1]];h+=w*grid[n+ofs];
        work.r+=tint.r*w;work.g+=tint.g*w;work.b+=tint.b*w;
      }
      const [d,facing]=coast(x,z),west=facing<-.35;
      const waveCut=Math.min(1,d/(west?18:11)),y=Math.min(h,d*(west?.73:1.62))+(waveCut-.5)*.95;
      work.lerp(wood,Math.min(.71,h/110+.27));work.lerp(west?sand:rocks,1-Math.min(1,d/(west?27:19)));
      const nudge=Math.sin(x*.12+z*.045)*.025;work.multiplyScalar(.99+nudge);
      const index=heights.length;cache.set(key,index);pos.push(x,y,z);col.push(work.r,work.g,work.b);heights.push(y);
      return index;
    }
    // Triangulate the concave coastline first. Splitting long edges preserves
    // the coves and supplies interior samples for both ridges and the saddle.
    function triangle(a,b,c){
      const side=(p,q)=>(p[0]-q[0])**2+(p[1]-q[1])**2;
      const ab=side(a,b),bc=side(b,c),ca=side(c,a),longest=Math.max(ab,bc,ca);
      if(longest>27**2){
        if(longest===bc)[a,b,c]=[b,c,a];else if(longest===ca)[a,b,c]=[c,a,b];
        const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];triangle(a,m,c);triangle(m,b,c);
      }else{
        const counter=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])>0;
        idx.push(vertex(a),vertex(counter?c:b),vertex(counter?b:c));
      }
    }
    for(const indices of T.ShapeUtils.triangulateShape(islandRing.map(([x,z])=>new T.Vector2(x,z)),[]))
      triangle(...indices.map(i=>islandRing[i]));
    const g=new T.BufferGeometry(),p=new T.Float32BufferAttribute(pos,3);g.setAttribute('position',p);
    g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    const mat=new T.MeshLambertMaterial({vertexColors:true});
    // Match the haze of the terrain horizon. The ordinary road-object fog
    // would turn one face of the island white against the adjacent ridge.
    mat.onBeforeCompile=shader=>{
      shader.fragmentShader=shader.fragmentShader.replace('#include <fog_fragment>',`
        #if defined(USE_FOG) && defined(FOG_EXP2)
          float ridgeHaze=.17+.79*(1.-exp(-max(vFogDepth,0.)*.00009));
          float mist=1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
          gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,mix(ridgeHaze,max(ridgeHaze,mist),smoothstep(.0011,.0025,fogDensity)));
        #endif`);
    };
    const mesh=new T.Mesh(g,mat);mesh.position.set(origin[0],0,origin[1]);
    mesh.name='Đảo Yến – bờ và sườn đảo';mesh.receiveShadow=true;k.group.add(mesh);
    return ground=>{
      const water=ground(origin[0]-385,origin[1]-100);
      for(let i=0;i<p.count;i++){
        const land=heights[i],surface=ground(origin[0]+p.getX(i),origin[1]+p.getZ(i));
        p.setY(i,land<1?water+land:Math.max(water+land,surface+.48));
      }
      p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  function build(T,k){
    const fitStrand=strand(T,k),fitTrees=casuarinas(T,k),fitIsland=offshoreIsland(T,k);
    k.group.userData.fitGround=g=>{fitStrand(g);fitTrees(g);fitIsland(g);};
  }
  (window.VietnamSights??=[]).push({id,catalogId,name:'Vũng Chùa – Đảo Yến',kind:'Vịnh',city:'Phú Trạch',locality:'Thọ Sơn, Quảng Đông',
    province:'Quảng Trị',formerProvince:'Quảng Bình',region:'Trung Bộ',lon,lat,start:[106.4881775,17.9226739],yaw:0,
    width:9,depth:7,gardenRadius:0,viewDistance:3200,solids:[],reserve:()=>false,mappedEntrance:true,visitOnArrival:true,views,
    source:report,photo:photo(93540011),map:'https://www.openstreetmap.org/way/884243619',
    description:'Ở Thọ Sơn, phía nam Đèo Ngang, bãi cát Vũng Chùa nhìn ra Hòn Nồm (Đảo Yến). Bờ tây đảo có dải cát, bờ đông có đá lộ. Vị trí cây và góc nhìn từ sườn đồi được ước theo ảnh thực địa.',
    arrivalNote:'Xe dừng trên đường ven biển ở phía tây Mũi Rồng. Các góc ngắm đưa từ bờ cát và hàng phi lao ra phía đảo.',build});
})();
