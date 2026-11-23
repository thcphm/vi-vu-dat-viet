'use strict';
(() => {
  const circle = Math.PI * 2;
  const atlas = new Map(window.VietnamTourism.entries.map(site => [site.id, site]));
  function register(catalogId, details) {
    (window.VietnamSights ??= []).push({...atlas.get(catalogId), catalogId, ...details});
  }

  // Use one geometry for many differently coloured panels, with metre-based UVs.
  function panels(T) {
    const positions = [], colours = [], uvs = [], colour = new T.Color();
    function face(a, b, c, d, tint, project) {
      for (const point of [a,b,c, c,d,a]) {
        colour.setHex(typeof tint==='function'?tint(point):tint);
        positions.push(...point);
        colours.push(colour.r, colour.g, colour.b);
        uvs.push(...project(point));
      }
    }
    function finish(group, material, smooth=false) {
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new T.Float32BufferAttribute(colours, 3));
      geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
      geometry.computeVertexNormals();
      if (smooth) {
        const normal=geometry.attributes.normal, shared=new Map(), keys=[];
        for(let i=0;i<normal.count;i++){
          const key=positions.slice(3*i,3*i+3).map(v=>Math.round(v*500)).join('/');
          keys.push(key);
          if(!shared.has(key))shared.set(key,new T.Vector3());
          const n=shared.get(key); n.x+=normal.getX(i);n.y+=normal.getY(i);n.z+=normal.getZ(i);
        }
        for(const n of shared.values())n.normalize();
        keys.forEach((key,i)=>{const v=shared.get(key);normal.setXYZ(i,v.x,v.y,v.z);});
      }
      const mesh = new T.Mesh(geometry, material);
      mesh.castShadow = mesh.receiveShadow = true;
      group.add(mesh);
    }
    return {face, finish};
  }
  const planUV = ([x,,z]) => [x * .28, z * .28];
  const sharedMaps = new Map();
  function texture(T, file, colour) {
    if (!sharedMaps.has(file)) {
      const map = new T.TextureLoader().load('streetscape/' + file);
      if (colour) map.colorSpace = T.SRGBColorSpace;
      map.wrapS = map.wrapT = T.RepeatWrapping;
      map.userData.sightShared = true;
      sharedMaps.set(file, map);
    }
    return sharedMaps.get(file);
  }

  // Surveyed circular shell, OSM w640290239. The principal access faces
  // Võ Nguyên Giáp. The projecting lattice is continuous across the glazing.
  function victoryMuseum(T, {palette, group, box, tapered, sign}) {
    const stone = 0xd0c9b6, metal = 0xdddcca, glass = 0x405860;
    const shell = panels(T), lawn = panels(T), paving = panels(T);
    const polar = (r, y, a) => [Math.sin(a)*r, y, Math.cos(a)*r];
    palette({stone, metal, glass});
    function strut(a,b, thickness, tint) {
      const dx=b[0]-a[0], dy=b[1]-a[1], dz=b[2]-a[2];
      box(tint,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,
        thickness,thickness,Math.hypot(dx,dy,dz),Math.atan2(dx,dz),-Math.atan2(dy,Math.hypot(dx,dz)));
    }
    const subdivisions = 48;
    const radii = [27.0,26.1,25.1,23.9,22.7], levels = [3.4,5.95,8.5,11.05,13.6];
    tapered(stone,0,.13,0,29.1,29.1,.5,1,72);
    tapered(0x5d6664,0,1.92,0,25.6,25.6,3.28,1,72);
    tapered(stone,0,3.28,0,27.47,27.55,.28,1,72);
    tapered(glass,0,8.5,0,26.96,22.65,10.2,1,96);
    for (let i=0;i<subdivisions;i++) {
      const angle = i*circle/subdivisions;
      const x=Math.sin(angle), z=Math.cos(angle);
      if (Math.abs(Math.sin(angle))>.19 || z<0) {
        box(0xbdb9ae,x*25.7,1.85,z*25.7,.19,3.05,.4,angle);
        box(0x829091,x*25.72,1.3,z*25.72,2.9,.085,.1,angle);
      }
      // Two interlaced sets of ribs rise across four staggered courses.
      for (let j=0;j<levels.length-1;j++) {
        const offset = j%2*.5;
        const a = (i+offset)*circle/subdivisions;
        for (const direction of [-1,1]) {
          strut(polar(radii[j]+.12,levels[j],a),
            polar(radii[j+1]+.12,levels[j+1],a+direction*Math.PI/subdivisions),.21,metal);
        }
      }
      const next=angle+circle/subdivisions;
      shell.face(polar(1.4,14.62,angle),polar(22.87,13.68,angle),
        polar(22.87,13.68,next),polar(1.4,14.62,next),
        [0x879b98,0xbac6c0,0x788e90,0xa1b6b1][i%4],planUV);
      if(i%2===0)strut(polar(1.4,14.66,angle),polar(22.9,13.74,angle),.17,metal);
    }
    tapered(metal,0,13.63,0,23.05,23.03,.29,1,96);
    tapered(0x819395,0,14.65,0,1.5,1.2,.24,1,32);
    // Opening, ticket lobby and shaded steps underneath the raised skirt.
    for(const s of [-1,1]) {
      box(stone,s*4.7,1.73,25.75,.7,3.15,1.25);
      for(let i=0;i<3;i++) box(0x263f45,s*(.8+i*1.5),1.7,25.65,1.36,2.5,.18);
      box(stone,s*4.6,.34,30.1,.56,.52,8.6);
    }
    for (let i=0;i<5;i++)box(0xbab6ad,0,.33-i*.075,30-i*.78,8.7,.35,.81);
    // Lawn segments follow the aerial image, split at radial footpaths.
    const rays = [0,.27,.92,1.71,2.47,3.14,3.9,4.7,5.34,6.01,circle];
    const edge=t=>Math.min(55,47/Math.max(.2,Math.abs(Math.sin(t))));
    for(let i=0;i<96;i++) {
      const a=i*circle/96,b=(i+1)*circle/96;
      paving.face(polar(28.7,.08,a),polar(edge(a)+2,.08,a),polar(edge(b)+2,.08,b),polar(28.7,.08,b),stone,planUV);
    }
    for (let j=1;j<rays.length;j++) {
      const a=rays[j-1]+.023,b=rays[j]-.023;
      for(let k=0;k<9;k++){
        const p=a+(b-a)*k/9,q=a+(b-a)*(k+1)/9;
        lawn.face(polar(29.4,1.28,p),polar(edge(p),.14,p),polar(edge(q),.14,q),polar(29.4,1.28,q),0xc4d38f,planUV);
      }
    }
    box(0xbdb9ad,0,.035,42.5,8,.14,27.4);
    box(0x2e494b,0,2.97,25.95,9.2,.74,.2);
    sign('BẢO TÀNG CHIẾN THẮNG ĐIỆN BIÊN PHỦ',0,2.99,26.07,8.66,.6,true);
    shell.finish(group,new T.MeshStandardMaterial({vertexColors:true,metalness:.32,roughness:.44,side:T.DoubleSide}));
    paving.finish(group,new T.MeshStandardMaterial({vertexColors:true,roughness:.93,side:T.DoubleSide}));
    lawn.finish(group,new T.MeshStandardMaterial({vertexColors:true,map:texture(T,'surfaces/grass-color.webp',true),roughness:1,side:T.DoubleSide}));
  }

  // Tile caps are broader than the channels. Dye the individual aged tiles
  // before mipmapping so oblique views of a whole courtyard stay legible.
  function roofTiles(T, random) {
    const canvas=document.createElement('canvas');
    canvas.width=canvas.height=256;
    const ctx=canvas.getContext('2d'), pixels=ctx.createImageData(256,256);
    const shades=Array.from({length:64},()=>random()*24-12);
    for(let y=0;y<256;y++)for(let x=0;x<256;x++) {
      const col=Math.floor(x/32), row=(Math.floor((y+(col%2)*14)/32))%8;
      const u=(x%32)/32, v=((y+(col%2)*14)%32)/32;
      const rib=14*Math.cos((u-.3)*circle), lip=v>.92?-15:v<.09?12:0;
      const grey=135+shades[row*8+col]+rib+lip+random()*13;
      pixels.data.set([grey+2,grey,grey-8,255],(y*256+x)*4);
    }
    ctx.putImageData(pixels,0,0);
    const map=new T.CanvasTexture(canvas);
    map.wrapS=map.wrapT=T.RepeatWrapping;
    map.colorSpace=T.SRGBColorSpace;
    return map;
  }

  const palaceHalls = [
    // Transverse halls and the wings enclosing each of the three mapped voids.
    [0,22.2,20.6,4.4,0,.24],[0,9.5,20.6,5.4,0,.57],
    [0,-5.2,20.6,5.8,0,.96],[0,-21.1,20.1,6.4,0,1.24],
    ...[-1,1].flatMap(side=>[[7.1*side,16.2,9.2,5.9,Math.PI/2,.37],
      [7*side,2.05,9.5,5.95,Math.PI/2,.7],[7.1*side,-13,10,6.05,Math.PI/2,1.04]]),
  ];
  function vuongResidence(T, {palette, group, box, round, stamp, tapered, random}) {
    const slate=0x9c9a8d,timber=0x594637,stone=0x978e7a;
    const roofs=panels(T);
    palette({timber, stone});
    function hall(cx,cz,length,depth,yaw,base,single=false) {
      const sin=Math.sin(yaw),cos=Math.cos(yaw);
      const local=(x,y,z)=>[cx+cos*x+sin*z,y,cz-sin*x+cos*z];
      const beam=(t,x,y,z,w,h,d)=>box(t,...local(x,y,z),w,h,d,yaw);
      const columns=Math.max(2,Math.round(length/3.6)), upper=base+(single?2.85:5.38);
      beam(stone,0,base*.5,0,length,base+.22,depth);
      const passage=!single && !yaw;
      if(passage) {
        const gap=2.1,segment=(length-.45-gap)/2;
        for(const f of [-1,1])beam(0x756451,f*(gap+segment)/2,base+1.32,0,segment,2.64,depth-1.45);
        beam(0x7e6854,0,(upper+base+2.64)/2,0,length-.45,upper-base-2.64,depth-1.45);
      }else beam(0x796652,0,(upper+base)/2,0,length-.45,upper-base,depth-1.45);
      for (let i=0;i<=columns;i++)for (const f of [-1,1]) {
        const x=(i/columns-.5)*(length-.5), z=f*(depth*.5-.13);
        const [px,,pz]=local(x,0,z);
        tapered(0xb1aa96,px,base+.18,pz,.26,.27,.36,1,8);
        tapered(0x928c7d,px,base+.47,pz,.23,.29,.22,1,8);
        stamp(round,timber,px,(upper+base+.53)*.5,pz,.135,upper-base-.53,.135);
        if(i<columns) {
          const centre=x+(length-.5)/columns/2;
          for(const level of single?[base+.94]:[base+.96,base+3.78]){
            if(passage&&Math.abs(centre)<1.7&&level<base+2) continue;
            beam(0x2b2c27,centre,level+.29,f*(depth/2-.69),1.29,1.52,.11);
            for(const off of [-.46,-.23,0,.23,.46])beam(timber,centre+off,level+.29,f*(depth/2-.60),.046,1.54,.075);
            for(const v of [-.47,-.23,.01,.25,.49])beam(0x756451,centre,level+.29+v,f*(depth/2-.59),1.34,.043,.08);
          }
          // Narrow vertical planks meet at the timber frame between windows.
          for(const off of [-1.27,-.98,.98,1.27]) {
            if(passage && Math.abs(centre+off)<1.06)continue;
            beam(i%2?0x655343:0x6f5e4e,centre+off,base+1.4,f*(depth/2-.715),.031,2.4,.06);
          }
        }
      }
      function roof(eave,rise,halfSpan,left,right,shed) {
        const ridgeInset=shed?.06:.55;
        for(const s of (shed?[shed]:[-1,1])){
          function corner(x,t){
            const end=Math.abs(x)/(length*.5);
            const z=s*(shed?depth*.5-.53+t*halfSpan:halfSpan*t);
            return local(x,eave+rise*(1-t)*(1-.22*t)+Math.max(0,end-.74)**2*1.1,z);
          }
          for(let j=0;j<5;j++){
            const a=j/5,b=(j+1)/5;
            const p=left+(1-a)*ridgeInset,q=right-(1-a)*ridgeInset;
            const l=left+(1-b)*ridgeInset,r=right-(1-b)*ridgeInset;
            const uv=([X,Y,Z])=>[((X-cx)*cos-(Z-cz)*sin)*.70,(Y*.6+((X-cx)*sin+(Z-cz)*cos)*s)*.45];
            roofs.face(corner(p,a),corner(q,a),corner(r,b),corner(l,b),slate,uv);
          }
          beam(0x6e6d61,0,eave-.045,s*(shed?depth*.5-.53+halfSpan:halfSpan),length+1,.14,.18);
        }
        if(!shed)beam(0x9c998d,0,eave+rise+.07,0,length+.14,.19,.27);
      }
      roof(upper,.37*depth,depth*.5+.87,-length/2-.6,length/2+.6,0);
      if(!single)for(const f of [-1,1]){
        beam(0x846d54,0,base+2.79,f*(depth/2-.1),length,.24,1.15);
        roof(base+2.51,.7,1.4,-length/2-.27,length/2+.27,f);
      }
    }
    for(const spec of palaceHalls)hall(...spec);
    // Auxiliary buildings sit outside the long northern core. OSM relation
    // 11719571 supplies the three courts and the orientation of the compound.
    hall(-19.8,8.6,10.9,10.6,0,.23,true);
    hall(17.7,-7.4,12.7,8.38,0,.6,true);
    hall(16.6,-16.4,10.9,5,0,.96,true);
    for(const side of [-1,1]){
      const x=side*11.45;
      box(0xa6987d,x,4.86,-21.7,3.1,9.72,3.26);
      tapered(0x655e50,x,10.36,-21.7,2.85,.52,1.39,1,4);
      for(const h of [6.36,8.1])for(const dx of [-.82,0,.82])box(0x423e33,x+dx,h,-20.04,.14,.47,.08);
    }
    for (const [z,level] of [[16,.24],[2,.55],[-13,.92]]) {
      box(0x817b6b,0,level-.09,z,7.2,.2,8.6);
      for(let j=0;j<9;j++)for(let k=0;k<5;k++){
        const width=7.2/5;
        box([0xb1a998,0xa69f8a,0xa9a490,0xb6b1a1][(j*3+k)%4],-3.6+(k+.5)*width,level+.018,z-4.3+(j+.5)*.955,width-.034,.044,.916);
      }
      for(let i=0;i<3;i++)box(0xa59e90,0,level+.07+i*.11,z-1.35-i*.37,2.35,.17,.4);
    }
    for(const side of [-1,1]){
      box(stone,side*25.5,1.14,0,1.0,2.28,53);
      box(stone,side*13.4,1.13,26.4,24.5,2.26,.9);
    }
    box(stone,0,1.2,-26.0,51,2.4,1);
    // Irregular horizontal courses along the public face of the stone enclosure.
    for(const s of [-1,1])for(let row=0;row<6;row++){
      let edge=1.24;
      while(edge<25.55){
        const w=Math.min(25.55-edge,.64+random()*.84);
        box([0x8f8a78,0xaaa38f,0x9f9b89,0xb2ab94][Math.floor(random()*4)],
          s*(edge+w/2),.23+row*.36,26.89,w-.026,.335,.10+random()*.055);
        edge+=w;
      }
    }
    const trees=[[-20,.02,18.8,6.3,9.1,.3],[20,.02,18,6.5,9.6,.81],[-16,.01,25.4,4.3,7.7,.66],
      [16,.02,25.3,4.5,8.1,.22],[-22,.1,-13.3,5.8,8.6,.16],[22.1,.05,6.2,5.2,7.7,.64],
      [-18.2,.1,-22.2,6.8,9.3,.24],[20.5,.15,-23,6.8,9.2,1.34]];
    createTreeModels(T).grove(group,trees);
    for(let i=0;i<6;i++)box(0xa09985,0,.49-i*.09,26.9+i*.4,3.8,.2,.45);
    roofs.finish(group,new T.MeshStandardMaterial({vertexColors:true,map:roofTiles(T,random),roughness:.91,side:T.DoubleSide}));
  }

  function fernCards(T,group,stems) {
    const cards=panels(T);
    for(const [x,y,z,w,h,a] of stems)for(let i=0;i<2;i++){
      const angle=a+i*Math.PI/2,dx=Math.cos(angle)*w/2,dz=Math.sin(angle)*w/2;
      const uv=([X,Y,Z])=>[((X-x)*Math.cos(angle)+(Z-z)*Math.sin(angle))/w+.5,(Y-y)/h];
      cards.face([x-dx,y,z-dz],[x+dx,y,z+dz],[x+dx,y+h,z+dz],[x-dx,y+h,z-dz],0xbfc4a8,uv);
    }
    cards.finish(group,new T.MeshLambertMaterial({map:texture(T,'surfaces/bank-fern.webp',true),vertexColors:true,alphaTest:.47,side:T.DoubleSide}));
  }
  function cocBoCave(T,{group,stamp,box,outline,random}) {
    const crag=panels(T),trees=[],ferns=[];
    const lip=x=>Math.max(0,1-Math.abs((x-.22)/(x<.22?1.37:.88)));
    // A sheet of jointed limestone drops right to the landing at either
    // side. The asymmetric triangular notch opens under it, into a recess.
    function cliff(x,t){
      const opening=lip(x),foot=Math.min(1.83,Math.max(.1,2.6-Math.abs(x)*.32));
      const height=6.5+1.4*Math.sin(.44*x+1)+1.8*Math.cos(.2*x-.6);
      const y=foot+opening**.65*2.05+(height-opening*1.7)*t;
      const seam=Math.abs(Math.sin(x*1.51+y*.17))**.54;
      const seam2=Math.sin(y*2.5+x*.29);
      const z=.62*Math.sin(.62*x)-.15*Math.abs(x)+.58*seam+.19*seam2+.12*Math.sin(x*6+y*2)-2.4*t*t;
      return [x+.17*Math.sin(y*.72+x*.73)*t,y,z];
    }
    const uv=([x,y,z])=>[(x+.27*z)*.54,(y-.57*z)*.56];
    for(let k=0;k<96;k++){
      const x=(k-48)/3,next=x+1/3;
      for(let j=0;j<17;j++){
        const t=j/17,u=(j+1)/17;
        const a=cliff(x,t),b=cliff(next,t),c=cliff(next,u),d=cliff(x,u);
        const moss=Math.sin(x*.61+t*2.6)*Math.sin(x*.24-t*5)>.35;
        crag.face(a,b,c,d,([X,Y,Z])=>{
          const dark=Math.max(0,Math.min(1,.62*Math.sin(X*.82+Y*.43)+.38*Math.cos(X*.41-Y*.9)+.12*Math.sin(Z*3)));
          return (Math.round(195-50*dark)<<16)+(Math.round(192-38*dark)<<8)+Math.round(179-53*dark);
        },uv);
        if(j>5&&random()<(moss?.092:.016)) ferns.push([a[0],a[1]-.16,a[2]+.3,1.05+random()*.8,.73+random()*.58,random()*3]);
      }
      const a=cliff(x,1),b=cliff(next,1);
      const rear=p=>[p[0],p[1]-.9-1.1*Math.sin(p[0]*.42),p[2]-5];
      const back=p=>[p[0],.2,p[2]-8];
      crag.face(a,b,rear(b),rear(a),0x92987d,uv);
      crag.face(rear(a),rear(b),back(rear(b)),back(rear(a)),0x82906b,uv);
      if(k%3===1) {
        const h=3.5+random()*4;trees.push([a[0],a[1]-.34,a[2]-random()*3,h*.95,h,random()*3]);
      }
      if(Math.abs(x)<1.5){
        const entry=cliff(x,0),other=cliff(next,0);
        const inside=p=>[p[0]*.8+.25,p[1]-.05,p[2]-2.66];
        crag.face(entry,other,inside(other),inside(entry),0x737467,uv);
        const end=p=>[p[0]+.8,p[1]-.12,p[2]-3.04];
        crag.face(inside(entry),inside(other),end(inside(other)),end(inside(entry)),0x404338,uv);
      }
    }
    const rock=new T.MeshStandardMaterial({vertexColors:true,map:texture(T,'surfaces/cut-rock-color.webp',true),
      normalMap:texture(T,'surfaces/cut-rock-normal.webp',false),normalScale:new T.Vector2(.84,.84),roughness:.97,side:T.DoubleSide});
    rock.onBeforeCompile=s=>{
      s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',
        'vec3 strata=texture2D(map,vMapUv).rgb; diffuseColor.rgb*=clamp(.52+2.9*dot(strata,vec3(.21,.72,.07)),.54,1.19);');
    };
    crag.finish(group,rock,true);
    box(0x2e332b,1.14,2.92,-6.6,2.7,2.65,.43);
    // Stone landing reaches the opening. Each step has a slightly different
    // nose and width, following the bending path up through the outcrop.
    box(0x817d6e,0,.95,-1.32,3.8,1.9,4.7);
    for(let i=0;i<13;i++){
      const height=1.87-i*.145;
      box([0x969483,0x888779,0xa29d8b][i%3],.12+Math.pow(i/12,1.53)*2,height/2,1.22+i*.43,2.21+random()*.19,height,.59,-i*.013);
    }
    const stone=new T.IcosahedronGeometry(1,1);
    const surface=stone.attributes.position;
    for(let i=0;i<surface.count;i++){
      const x=surface.getX(i),y=surface.getY(i),z=surface.getZ(i);
      const n=1+.19*Math.sin(x*7+z*9)*Math.cos(y*6-z*3);
      surface.setXYZ(i,x*n,(y+.25*x)*n,z*n);
    }
    stone.computeVertexNormals();
    for(const s of [-1,1])for(let i=0;i<34;i++){
      const x=s*(1.9+random()*13),z=-7+random()*11;
      if(z<.8&&Math.abs(x)<9 || Math.abs(x)<3.8&&z>0)continue;
      const r=.36+random()*1.55;
      stamp(stone,[0x827f67,0x9e9f86,0x858b68][i%3],x,.15+r*.27,z,r*1.5,r,r*1.2,random()*4,random()*.4);
      if(i%3===0)ferns.push([x,r*.63,z,1.4,1.1,random()*3]);
    }
    // Exposed stone slab under the marker and the path up to the entrance.
    stamp(stone,0x888877,-1.9,.49,1.68,2.1,1.57,1.78,.51,-.06,.14);
    for(const s of [-1,1])for(let k=0;k<8;k++){
      const x=s*(.9+k*.94);
      stamp(stone,[0x8b8979,0x999783,0x788166][k%3],x,.27,-.72,1.3,1.6-.1*k,1.52,k*.27);
    }
    stone.dispose();
    for(const anchor of [-10.8,-5.1,-2.9,3.4,8.7]){
      const count=2+Math.floor(random()*3);
      for(let i=0;i<count;i++){
        const run=.35+random()*.53,drift=(random()-.48)*2.8,phase=random()*5.2;
        const pts=Array.from({length:10},(_,j)=>{
          const t=j/9,pt=cliff(anchor+t*drift+t*Math.sin(t*7+phase)*.75,1-t*run);
          pt[2]+=.11+Math.sin(Math.PI*t)*.19;return new T.Vector3(...pt);
        });
        const curve=new T.CatmullRomCurve3(pts);
        const root=new T.TubeGeometry(curve,14,.022+random()*.038,5,false);
        stamp(root,i%2?0x5c5140:0x71654c,0,0,0);root.dispose();
      }
    }
    // A pale stone plaque is mounted on a vertical spike crowned by a star.
    box(0x6d7161,-1.67,1.85,1.9,1.15,.54,.64);
    outline([[-.22,0],[.22,0],[.22,1.84],[-.21,1.57]],0xa8a89c,-1.67,2.05,1.74,.24);
    box(0xaaad9d,-1.67,2.82,1.93,1.33,.93,.29);
    box(0x986f54,-1.67,2.82,2.084,1.14,.75,.035);
    box(0xe3decb,-1.67,2.82,2.109,1.1,.705,.031);
    const marker=document.createElement('canvas');marker.width=384;marker.height=512;
    const pen=marker.getContext('2d');pen.fillStyle='#866732';pen.textAlign='center';
    for(const [line,y,size] of [['HANG PÁC BÓ',80,44],['CHỦ TỊCH',176,37],['HỒ CHÍ MINH',241,39],['ĐÃ Ở VÀ LÀM VIỆC',303,33],['TỪ 8-2-1941',374,35],['ĐẾN CUỐI THÁNG 3-1941',449,30]]) {
      pen.font='bold '+size+'px "Times New Roman", "Noto Serif", serif';pen.fillText(line,192,y,365);
    }
    const map=new T.CanvasTexture(marker);map.colorSpace=T.SRGBColorSpace;
    const letters=new T.Mesh(new T.PlaneGeometry(1.02,.65),new T.MeshStandardMaterial({map,transparent:true,alphaTest:.25,roughness:1}));
    letters.position.set(-1.67,2.82,2.129);group.add(letters);
    const star=Array.from({length:10},(_,i)=>{
      const a=Math.PI/2+i*Math.PI/5,r=i%2?.061:.14;
      return [Math.cos(a)*r,Math.sin(a)*r];
    });
    outline(star,0xbc9554,-1.67,3.46,1.986,.03);
    createTreeModels(T).grove(group,trees);
    fernCards(T,group,ferns);
  }

  register('osm-node-3294335517',{
    id:'bao-tang-chien-thang-dien-bien-phu',name:'Bảo tàng Chiến thắng Điện Biên Phủ',city:'Điện Biên Phủ',
    lon:103.015185,lat:21.380754,yaw:1.58,width:78,depth:87,viewAngle:1.72,viewElevation:.31,
    start:[103.016023,21.380772],approachMeters:87,map:'https://www.openstreetmap.org/way/640290239',
    solids:[[-22,0,4,8],[22,0,4,8],[0,0,17,20],[0,0,9,25],[-17,0,4,14],[17,0,4,14]],
    photo:'https://vov.gov.vn/doi-a1-va-bao-tang-chien-thang-lich-su-dien-bien-phu-diem-den-kho-quen-dtnew-775595',
    source:'https://media.chinhphu.vn/an-tuong-tranh-panorama-tai-hien-chien-thang-dien-bien-102220506095448722.htm',
    description:'Nhìn từ đường Võ Nguyên Giáp, lớp nan hình quả trám ôm quanh khối nhà tròn như tấm lưới trên mũ bộ đội. Các lối đi xẻ qua thảm cỏ dẫn tới cửa dưới vành mái.',build:victoryMuseum
  });
  register('osm-node-7975480201',{
    id:'dinh-thu-ho-vuong',name:'Dinh thự họ Vương',city:'Sà Phìn',lon:105.262128,lat:23.256347,
    yaw:0,width:52,depth:55,start:[105.262141,23.255263],approachMeters:120,
    map:'https://www.openstreetmap.org/relation/11719571',photo:'https://vienkientrucquocgia.gov.vn/nhung-vien-ngoc-kien-truc-tren-con-duong-to-lua-ha-giang/',
    source:'https://vietnamtourism.vn/index.php/tourism/items/2947',
    solids:[...palaceHalls.flatMap(([x,z,w,d,r])=>{
      if(r)return [[x,z,d/2,w/2]];
      const side=(w-2.1)/4;
      return [[x-1.05-side,z,side,d/2],[x+1.05+side,z,side,d/2]];
    }),
      [-19.8,8.6,5.45,5.3],[17.7,-7.4,6.35,4.19],[16.6,-16.4,5.45,2.5],[-25.5,0,.5,26.5],[25.5,0,.5,26.5],[-13.4,26.4,12.25,.45],[13.4,26.4,12.25,.45],[0,-26,25.5,.5]],
    views:[{name:'Toàn cảnh dinh',viewAngle:.45,viewElevation:.56,viewRadius:76},
      {name:'Sân tiền dinh',offset:[0,15],height:5.8,viewRadius:4.7,viewAngle:.14,viewElevation:.16}],
    description:'Ba sân trong nối nhau dọc dinh họ Vương. Từ sân tiền dinh có thể nhìn rõ các lớp ngói máng, vì gỗ và chân tảng đá đỡ cột hiên.',build:vuongResidence
  });
  register('osm-node-1490422835',{
    id:'hang-coc-bo',name:'Hang Cốc Bó (Pác Bó)',city:'Cao Bằng',yaw:-.42,width:34,depth:27,
    solids:[[-6,-4,4.9,3.8],[6,-4,5.0,4.0],[0,-8,6,1.7]],
    photo:'https://vov2.vov.vn/van-hoa-giai-tri/ve-noi-dau-nguon-pac-bo-27106.vov2',
    source:'https://dsvh.gov.vn/di-tich-lich-su-pac-bo-2950',
    views:[{name:'Cửa hang',height:6,viewAngle:-.22,viewElevation:.16,viewRadius:13},
      {name:'Sườn đá vôi',height:10,viewAngle:-.68,viewElevation:.38,viewRadius:35}],
    description:'Cửa hang chỉ đủ rộng cho một người đi qua. Bậc đá dẫn tới khe tối giữa vách đá vôi, bên cạnh tấm bia ghi thời gian Chủ tịch Hồ Chí Minh ở và làm việc tại đây.',build:cocBoCave
  });
})();
