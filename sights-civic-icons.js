'use strict';
(() => {
  const sites=window.VietnamTourism.byId;

  // The wall mesh keeps masonry joints in metre coordinates even on end walls.
  function masonry(T,group,granite){
    const positions=[],colours=[],uv=[],ink=new T.Color();
    function face(a,b,c,d,colour){
      ink.setHex(colour);
      for(const v of [a,b,d,b,c,d]){
        positions.push(...v);colours.push(ink.r,ink.g,ink.b);uv.push(0,0);
      }
    }
    function block(colour,x,y,z,w,h,d){
      const l=x-w/2,r=x+w/2,b=y-h/2,t=y+h/2,f=z+d/2,k=z-d/2;
      face([l,b,f],[r,b,f],[r,t,f],[l,t,f],colour);
      face([r,b,k],[l,b,k],[l,t,k],[r,t,k],colour);
      face([l,b,k],[l,b,f],[l,t,f],[l,t,k],colour);
      face([r,b,f],[r,b,k],[r,t,k],[r,t,f],colour);
      face([l,t,f],[r,t,f],[r,t,k],[l,t,k],colour);
    }
    function finish(){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
      g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();
      const m=new T.MeshStandardMaterial({vertexColors:true,roughness:granite?.69:.92,side:T.DoubleSide});
      m.customProgramCacheKey=()=>granite?'ba-dinh-granite':'sai-gon-red-brick';
      m.onBeforeCompile=s=>{
        const varying='varying vec3 civicP; varying vec3 civicN;\n';
        s.vertexShader=varying+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n civicP=position; civicN=normal;');
        const graniteNoise=granite?`float civicMineral(vec2 p){
          vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
          vec4 h=fract(sin(dot(i,vec2(17.7,93.7))+vec4(0.,17.7,93.7,111.4))*43758.54);
          return mix(mix(h.x,h.y,f.x),mix(h.z,h.w,f.x),f.y);
        }\n`:'';
        s.fragmentShader=varying+graniteNoise+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec2 plane=abs(civicN.y)>.6?civicP.xz:vec2(abs(civicN.x)>.63?civicP.z:civicP.x,civicP.y);
          vec2 unit=plane/vec2(${granite?'1.87,1.06':'.266,.085'});
          unit.x+=.5*mod(floor(unit.y),2.);
          vec2 aa=max(fwidth(unit),vec2(.001)),edge=min(fract(unit),1.-fract(unit));
          vec2 joint=smoothstep(vec2(${granite?'.008':'.036'})-aa*.45,vec2(${granite?'.018':'.077'})+aa*.45,edge);
          float fade=1.-smoothstep(.25,.88,max(aa.x,aa.y));
          float grain=fract(sin(dot(floor(unit),vec2(17.7,93.7)))*43758.54)-.5;
          diffuseColor.rgb*=1.+grain*${granite?'.12':'.21'}*fade;
          ${granite?`vec2 slab=plane+grain*11.;
            float dark=civicMineral(slab*vec2(2.3,1.7));
            float mineral=civicMineral(slab*8.+dark*2.6);
            float streak=civicMineral(slab*vec2(8.2,.72));
            vec2 flake=slab*83.;float distant=smoothstep(.15,1.1,max(fwidth(flake).x,fwidth(flake).y));
            float mica=fract(sin(dot(floor(flake),vec2(53.7,29.2)))*15378.31);
            diffuseColor.rgb*=1.+fade*(.21*(dark-.5)+.20*(mineral-.5)+.14*(streak-.5)+(mica-.5)*.32*(1.-distant));`:''}
          diffuseColor.rgb=mix(diffuseColor.rgb,${granite?'diffuseColor.rgb*.63':'vec3(.39,.23,.145)'},(1.-joint.x*joint.y)*fade*.78);`);
      };
      const mesh=new T.Mesh(g,m);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
    }
    return {face,block,finish};
  }

  // Public garden details visible in the NKSTTSSHNVN photograph (Oct 2022)
  // and the Government News flag ceremony photographs (2 September 2026).
  // The rail represents the photographed stretch along the outer lawn.
  const lawnRail={x:2,z:177.6,bays:24,pitch:2.65};
  const flagGarden={x:2,z:73.5,halfWidth:6.3,halfDepth:4.9};

  function gardenRail(T,group){
    const {x,z,bays,pitch}=lawnRail;
    const iron=0x29382e,edge=0x455447;
    const bars=[],cube=new T.BoxGeometry(),pose=new T.Object3D();
    const bar=(x,y,w,h,d,colour=iron)=>bars.push([x,y,w,h,d,colour]);
    for(let bay=0;bay<bays;bay++){
      const mid=x+(bay+.5-bays/2)*pitch;
      for(const h of [.16,.92])bar(mid,h,pitch,.047,.064);
      bar(mid,.54,.044,.76,.056);
      for(const direction of [-1,1]){
        const motif=[[.40,.92],[.40,.80],[.99,.80],[.99,.30],[.36,.30],[.36,.63],[.78,.63],[.78,.44],[.58,.44]];
        for(let j=1;j<motif.length;j++){
          const [a,b]=motif[j-1],[c,d]=motif[j];
          bar(mid+direction*(a+c)/2,(b+d)/2,Math.abs(c-a)+.037,Math.abs(d-b)+.037,.048);
        }
      }
    }
    for(let bay=0;bay<=bays;bay++){
      const px=x+(bay-bays/2)*pitch;
      bar(px,.50,.15,1,.15);
      bar(px,.095,.228,.19,.228,edge);
      bar(px,.965,.215,.063,.215);bar(px,1.025,.175,.060,.175);
      bar(px,1.083,.245,.066,.245,edge);
    }
    const mesh=new T.InstancedMesh(cube,new T.MeshStandardMaterial({roughness:.62,metalness:.26}),bars.length);
    mesh.name='ba-dinh-lawn-ironwork';mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
    const colour=new T.Color();
    bars.forEach((v,i)=>mesh.setColorAt(i,colour.setHex(v[5])));
    function followGround(ground){
      // Hold each post plumb. The horizontal bars follow the slope of their bay.
      for(const [i,[px,py,w,h,d]] of bars.entries()){
        const floor=ground(px,z),slope=w>.3?(ground(px+w/2,z)-ground(px-w/2,z))/w:0;
        pose.position.set(px,py+floor,z);pose.rotation.z=Math.atan(slope);
        pose.scale.set(w*Math.hypot(1,slope),h,d);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
      }
      mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
    }
    followGround(()=>0);return followGround;
  }

  function flowerBed(T){
    const {halfWidth:w,halfDepth:d}=flagGarden;
    // UVs track the horizontal planting plan, including the sloping outer faces.
    const rings=[[w-.34,d-.34,.13],[w-.34,d-.34,.32],[w-.94,d-.94,.55],[w-1.26,d-1.26,.55],
      [w-1.75,d-1.75,.77],[w-2.65,d-2.65,.82]];
    const pos=[],uv=[],indices=[];
    for(const [a,b,h] of rings){for(const [x,z] of [[-a,b],[a,b],[a,-b],[-a,-b]]){
      pos.push(x,h,z);uv.push(.5+x/(2*w),.5-z/(2*d));
    }}
    for(let i=1;i<rings.length;i++)for(let j=0;j<4;j++){
      const a=(i-1)*4+j,b=(i-1)*4+(j+1)%4;indices.push(a,b,b+4,a,b+4,a+4);
    }
    const top=(rings.length-1)*4;indices.push(top,top+1,top+2,top,top+2,top+3);
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
    const canvas=document.createElement('canvas');canvas.width=768;canvas.height=600;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#384e32';ctx.fillRect(0,0,768,600);
    let seed=16452;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const purple=['#8055a0','#a879bc','#9867b2','#b383c6'],yellow=['#e5ae13','#f4c429','#edba15','#f5cb35'];
    const red=['#982437','#bc2847','#d43c52','#a42339'];
    for(let j=0;j<24500;j++){
      const x=random()*768,y=random()*600,margin=Math.min(w*(1-Math.abs(x/384-1)),d*(1-Math.abs(y/300-1)));
      const palette=margin<.81||margin>1.71&&margin<2.22?purple:margin>2.68?red:yellow;
      const r=1.4+random()*2.5;
      ctx.fillStyle=palette[Math.floor(random()*palette.length)];ctx.beginPath();ctx.ellipse(x,y,r*1.13,r,random()*3,0,Math.PI*2);ctx.fill();
    }
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({map,roughness:.94,side:T.DoubleSide}));
    mesh.name='ba-dinh-flower-terraces';mesh.receiveShadow=true;return mesh;
  }

  function flagFlowerGarden(T,group){
    const garden=new T.Group(),{x,z,halfWidth:w,halfDepth:d}=flagGarden;
    garden.name='ba-dinh-flag-garden';garden.position.set(x,0,z);group.add(garden);garden.add(flowerBed(T));
    const stone=new T.MeshStandardMaterial({color:0xa6906f,roughness:.9}),posts=[];
    const corners=[[-w,-d],[w,-d],[w,d],[-w,d]];
    corners.forEach(([x0,z0],i)=>{
      const [x1,z1]=corners[(i+1)%4],n=i%2?4:5;
      for(let j=0;j<n;j++)posts.push([x0+(x1-x0)*j/n,z0+(z1-z0)*j/n]);
    });
    const pose=new T.Object3D(),post=new T.InstancedMesh(new T.BoxGeometry(),stone,posts.length*3);
    const linksPerSpan=24,link=new T.InstancedMesh(new T.TorusGeometry(1,.17,4,8),
      new T.MeshStandardMaterial({color:0x685d46,roughness:.54,metalness:.43}),posts.length*linksPerSpan);
    posts.forEach(([px,pz],i)=>{
      [[.32,.64,.15],[.65,.06,.13],[.72,.08,.165]].forEach(([y,h,s],k)=>{
        pose.position.set(px,y,pz);pose.rotation.set(0,0,0);pose.scale.set(s,h,s);pose.updateMatrix();post.setMatrixAt(i*3+k,pose.matrix);
      });
      const [nx,nz]=posts[(i+1)%posts.length],dx=nx-px,dz=nz-pz,span=Math.hypot(dx,dz);
      for(let k=0;k<linksPerSpan;k++){
        const t=(k+.5)/linksPerSpan,slope=.88*(2*t-1)/span;
        pose.position.set(px+dx*t,.62-.88*t*(1-t),pz+dz*t);
        pose.rotation.set(0,-Math.atan2(dz,dx),Math.atan(slope),'YXZ');pose.rotateX(k%2?1.04:.12);
        pose.scale.set(span/linksPerSpan*.64,.036,.032);pose.updateMatrix();link.setMatrixAt(i*linksPerSpan+k,pose.matrix);
      }
    });
    for(const mesh of [post,link]){mesh.castShadow=mesh.receiveShadow=true;garden.add(mesh);}
    return garden;
  }

  function mausoleum(T,{group,box,tapered,stamp,wavingFlag}){
    const stone=masonry(T,group,true),b=stone.block;
    // OSM w37625751 and mapped parts w1092549150–54 and w1092944261–81.
    // The podium has a projecting front bar, distinct from the square colonnade.
    b(0x8a8e8b,1.85,3.82,-4.65,33.0,7.64,28.7);
    for(const side of [-1,1]){
      b(0x969995,1.8+side*12.04,3.83,13.41,17.11,7.66,7.94);
      b(0x8c908d,1.8+side*11.80,7.72,13.39,17.42,.22,8.01);
    }
    b(0x9da29e,1.8,6.27,13.42,7.00,2.90,7.94);
    b(0x797e7a,1.8,2.40,11.01,6.99,4.8,1.24);
    b(0x80665e,1.8,2.29,11.69,4.60,4.56,.18);
    b(0x674e4a,1.8,1.99,11.83,3.10,3.96,.19);
    box(0x96633f,1.8,1.89,11.96,2.71,3.74,.10);
    box(0x2f2928,1.8,1.84,12.02,2.48,3.60,.045);
    for(const side of [-1,1])box(0x79503b,1.8+side*1.12,1.84,12.08,.15,3.58,.35,side*.26);
    // The upper hall stands above a double setback and behind twenty piers.
    b(0x929794,1.43,8.55,-3.05,27.2,1.7,25.8);
    b(0x8a908d,1.63,9.89,-3.15,23.1,1,22.5);
    b(0xa87768,1.5,14.32,-2.95,14.75,7.85,14.75);
    const pier=0xb2b3ac;
    for(let i=0;i<6;i++){
      const x=-7.58+i*3.60;
      for(const z of [-11.94,6.08])b(pier,x,14.32,z,1.40,7.86,1.45);
      if(i>0&&i<5)for(const outer of [-7.56,10.43])b(pier,outer,14.32,-11.94+3.61*i,1.42,7.86,1.44);
    }
    b(0x747974,1.46,18.34,-2.95,20.03,.26,20.06);
    b(0xaeb0a8,1.46,18.95,-2.95,20.35,.99,20.40);
    b(0xb8b9b1,1.46,19.99,-2.95,20.82,1.10,20.8);
    b(0x90958e,1.52,20.66,-2.98,16.62,.38,16.45);
    b(0x9a9d93,1.38,21.19,-3.04,12.75,.88,12.90);
    stone.finish();
    const plate=document.createElement('canvas');plate.width=1536;plate.height=256;
    const ctx=plate.getContext('2d');ctx.fillStyle='#5f3741';ctx.textAlign='center';ctx.textBaseline='middle';
    for(const [line,font,y,width] of [['CHỦ TỊCH',78,58,498],['HỒ - CHÍ - MINH',117,179,1370]]){
      ctx.font='bold '+font+'px Arial';ctx.setTransform(width/ctx.measureText(line).width,0,0,1,768,0);ctx.fillText(line,0,y);
    }
    const lettering=new T.CanvasTexture(plate);lettering.colorSpace=T.SRGBColorSpace;lettering.anisotropy=4;
    const text=new T.Mesh(new T.PlaneGeometry(10.7,1.90),new T.MeshStandardMaterial({map:lettering,transparent:true,alphaTest:.02,roughness:.78}));
    text.position.set(1.46,19.60,7.50);group.add(text);
    const apron=new T.Mesh(new T.BoxGeometry(40.3,.52,8.29),new T.MeshStandardMaterial({color:0x9b968c,roughness:.90}));
    apron.position.set(1.8,.26,14.97);apron.receiveShadow=true;group.add(apron);
    for(let j=0;j<5;j++)box(0x96948c,1.8,.07+j*.049,21.04-j*.50,40.9-j*.15,.14+j*.098,.72);
    // Stone planters and clipped trees at the public forecourt.
    const leaves=new T.IcosahedronGeometry(1,1);
    for(const side of [-1,1])for(const [offset,z,scale] of [[8.8,21.2,.68],[15.4,22.3,.91]]){
      const x=1.7+side*offset;
      box(0xbdb6a6,x,.57,z,2.25*scale,.52,2.06*scale);
      tapered(0xcfc6b2,x,.99,z,1.32*scale,1.12*scale,.60,.85,4);
      box(0x675d4c,x,1.81,z,.15,1.66,.15);
      for(let j=0;j<3;j++)stamp(leaves,[0x5d744a,0x647c4d,0x839556][j],x+side*.32*Math.sin(j*2),1.79+j*.57*scale,z,
        (1.57-j*.25)*scale,(.66-j*.04)*scale,(1.2-j*.20)*scale,.47*j);
    }
    leaves.dispose();
    const fitPlanting=window.BaDinhLandscape?.addPlanting(T,{group,stamp,tapered,box});
    const fitRail=gardenRail(T,group),garden=flagFlowerGarden(T,group);
    const mast=new T.Mesh(new T.CylinderGeometry(.073,.15,25,12),new T.MeshStandardMaterial({color:0xb2b5af,metalness:.48,roughness:.46}));
    mast.position.y=12.50;garden.add(mast);
    // The cloth and the mast share the flower bed's ground datum on the square.
    wavingFlag(6.5,4.33,0,24.72,0);garden.add(group.children[group.children.length-1]);
    const feet=apron.geometry.attributes.position,rest=feet.array.slice();
    group.userData.fitGround=ground=>{
      fitPlanting?.(ground);
      const heights=new Map();
      fitRail((x,z)=>{if(!heights.has(x))heights.set(x,ground(x,z));return heights.get(x);});
      garden.position.y=ground(flagGarden.x,flagGarden.z);
      for(let i=0;i<feet.count;i++)if(rest[3*i+1]<0){
        const floor=ground(apron.position.x+rest[3*i],apron.position.z+rest[3*i+2]);
        feet.setY(i,Math.min(rest[3*i+1],floor-apron.position.y-.22));
      }
      feet.needsUpdate=true;apron.geometry.computeBoundingSphere();
    };
  }

  function cathedral(T,{palette, group,box,stamp,tapered,outline}){
    const brick=masonry(T,group,false),b=brick.block;
    const red=0xb66b4b,redShadow=0x99583e,sand=0xc6a485,pale=0xd9c1a4,glass=0x524c43,roof=0xa15c46;
    const front=38.70,tx=[-8.0,10.40],mid=1.20;
    palette({glass});
    function lid(x,z,width,depth,eave,ridge,colour=roof){
      const w=width/2,d=depth/2;
      brick.face([x-w,eave,z+d],[x,eave+ridge,z+d],[x,eave+ridge,z-d],[x-w,eave,z-d],colour);
      brick.face([x,eave+ridge,z+d],[x+w,eave,z+d],[x+w,eave,z-d],[x,eave+ridge,z-d],colour);
      for(const side of [-1,1])outline([[-w,0],[w,0],[0,ridge]],red,x,eave,z+side*d,.13);
      box(0x8a6659,x,eave+ridge+.10,z,.28,.22,depth+.3);
    }
    // The northwestern apse has a semicircular ambulatory and three radial
    // chapels, visible from the far end of Công xã Paris.
    const drum=new T.CylinderGeometry(1,1,1,28);
    for(const [x,z,r,wall,dome] of [[-.9,-32.0,10.2,14.4,5.3],[-9.2,-36.0,6.3,8.0,3.7],[-2,-43.7,6.0,8.1,3.6],[6.6,-36.4,5.7,8.05,3.75]]){
      stamp(drum,red,x,wall*.50,z,r,wall,r);
      tapered(roof,x,wall+dome*.50,z,r+.34,.37,dome,1,24);
    }
    drum.dispose();
    b(red,-.1,8.60,-3.5,15.9,17.20,64.1);lid(-.1,-3.5,16.55,65.0,17.05,5.80);
    for(const side of [-1,1]){
      b(redShadow,side*10.3,4.93,-2.95,7.29,9.86,65.4);
      const x0=side*7.6,x1=side*14.16;
      brick.face([x0,14.1,29.92],[x1,9.91,29.92],[x1,9.91,-35.75],[x0,14.1,-35.75],roof);
      box(sand,side*13.95,9.81,-3,.28,.24,65.8);
    }
    b(red,-.57,7.20,-10.21,33.75,14.4,12.5);
    for(const side of [-1,1])outline([[-6.37,0],[6.37,0],[0,5.26]],red,side*17.15-.58,14.3,-10.2,.19,side*Math.PI/2);
    for(const side of [-1,1])brick.face([-17.79,14.32,-10.2+side*6.4],[16.56,14.32,-10.2+side*6.4],[16.56,19.58,-10.2],[-17.79,19.58,-10.2],roof);
    const templates=new Map();
    function archGeo(w,h,rim){
      const k=[w,h,rim].join('/');
      if(templates.has(k))return templates.get(k);
      const r=w/2,s=h-r,shape=new T.Shape();
      shape.moveTo(-r,0);shape.lineTo(-r,s);shape.absarc(0,s,r,Math.PI,0,true);shape.lineTo(r,0);
      if(rim){shape.lineTo(r-rim,0);shape.lineTo(r-rim,s);shape.absarc(0,s,r-rim,0,Math.PI,false);shape.lineTo(-r+rim,0);}
      shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:1,bevelEnabled:false,curveSegments:10});
      templates.set(k,geo);return geo;
    }
    function arched(x,z,y,w,h,angle,mode){
      const sx=Math.sin(angle),cz=Math.cos(angle),outside=(g,c,d,t)=>stamp(g,c,x+sx*d,y,z+cz*d,1,1,t,angle);
      outside(archGeo(w,h,0),mode==='door'?0x46372e:glass,0,.07);
      outside(archGeo(w,h,mode==='door'?.29:.21),pale,.085,.21);
      outside(archGeo(w+.34,h+.18,.115),sand,.04,.19);
      const spring=h-w*.5;
      if(mode==='door'||w>2.4){
        for(let j=1;j<12;j++){
          const a=j*Math.PI/12,px=Math.cos(a)*(w*.5+.035),py=Math.sin(a)*(w*.5+.035);
          const cut=0xb7977c;
          box(cut,x+Math.cos(angle)*px+sx*.295,y+spring+py,z-Math.sin(angle)*px+cz*.295,.054,.265,.066,angle,0,a-Math.PI/2);
        }
      }
      if(mode==='louvre'){
        for(let j=.35;j<h-.20;j+=.38){
          const half=j<=spring?w*.5:Math.sqrt(Math.max(0,(w*.5)**2-(j-spring)**2));
          if(half>.31)box(0x777267,x+sx*.15,y+j,z+cz*.15,2*half-.46,.104,.12,angle);
        }
      }else if(mode==='window'){
        box(0xa2957e,x+sx*.115,y+h*.42,z+cz*.115,.065,h*.77,.10,angle);
        box(0x9e907b,x+sx*.12,y+spring*.57,z+cz*.12,w-.37,.07,.11,angle);
      }else{
        for(let j=-2;j<=2;j++)box(0x775d45,x+j*w*.135,y+spring*.45,z+.17,.065,spring*.9,.13);
      }
    }
    const disk=new T.CylinderGeometry(1,1,1,48);
    function circle(x,y,z,r,c,thick=.13){
      stamp(disk,c,x,y,z,r,thick,r,0,Math.PI/2);
    }
    function band(x,y,z,w,d){
      box(sand,x,y,z,w+.18,.36,d+.18);
      box(pale,x,y+.24,z,w+.42,.16,d+.42);
      box(redShadow,x,y-.30,z,w+.31,.22,d+.31);
    }
    // The central pediment contains a clock above the eight-petalled rose.
    b(red,mid,9.55,32.30,11.10,19.10,12.30);
    b(red,mid,20.92,33.38,11.08,3.65,9.98);
    outline([[-5.61,0],[5.61,0],[0,5.36]],red,mid,22.65,38.25,.39);
    for(const side of [-1,1]){
      const slope=Math.atan2(5.36,5.61);
      box(sand,mid+side*2.8,25.37,38.65,7.82,.32,.46,0,0,-side*slope);
    }
    box(pale,mid,28.72,38.43,.23,1.75,.24);box(pale,mid,28.91,38.43,.98,.22,.26);
    arched(mid,38.52,.38,6.64,7.85,0,'door');
    for(let i=-1;i<=1;i++)arched(mid+i*2.08,38.55,9.00,1.86,3.17,0,'window');
    circle(mid,17.19,38.53,4.26,sand);circle(mid,17.19,38.65,3.93,pale);
    circle(mid,17.19,38.73,3.60,0x8e7864);circle(mid,17.19,38.81,3.42,pale);
    for(let j=0;j<8;j++){
      const a=j*Math.PI*.25+Math.PI/8,x=mid+Math.cos(a)*2.37,y=17.19+Math.sin(a)*2.37;
      circle(x,y,38.91,.86,0xaa8d71);circle(x,y,39.01,.66,0x666961);
    }
    circle(mid,17.19,38.90,1.17,sand);circle(mid,17.19,39.00,.87,0x596561);
    circle(mid,24.00,38.70,1.26,pale);circle(mid,24.00,38.80,1.04,0x788d8c);circle(mid,24.00,38.89,.92,0xb3c5bf);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;box(0x455957,mid+Math.sin(a)*.75,24+Math.cos(a)*.75,39.00,.064,.18,.054,0,0,-a);
    }
    box(0x374746,mid+.145,24.22,39.04,.09,.55,.055,0,0,-.53);box(0x374746,mid-.24,24.12,39.05,.57,.07,.055,0,0,-.44);
    for(const x of tx){
      const z=33.81,towerW=8.30,towerD=9.56;
      b(redShadow,x,3.92,z-1.05,towerW,7.84,7.45);
      for(const side of [-1,1])b(red,x+side*3.67,3.98,z+.23,.96,7.96,9.12);
      b(red,x,7.86,z,8.31,2.1,towerD);
      arched(x,front-.38,.38,5.91,7.77,0,'door');
      b(red,x,16.35,z,towerW,15.22,towerD);
      b(redShadow,x,29.89,z,7.99,12.02,9.36);
      for(const y of [8.61,13.12,23.80,35.95])band(x,y,z,towerW,towerD);
      for(const side of [-1,1]){
        b(0xaa6246,x+side*3.93,15.79,front-.28,.54,13.76,.71);
        b(0xad795c,x+side*3.82,29.75,front-.45,.53,10.40,.52);
      }
      for(const dx of [-1.06,1.06]){
        arched(x+dx,front-.02,9.15,1.79,3.26,0,'window');
        arched(x+dx,front-.02,14.07,1.78,4.85,0,'louvre');
        arched(x+dx,front-.12,25.73,1.86,7.22,0,'louvre');
      }
      stamp(archGeo(5.45,8.04,.25),sand,x,13.73,front-.055,1,1,.24);
      circle(x,19.47,front+.09,.94,pale);circle(x,19.47,front+.19,.67,glass);
      for(const side of [-1,1])for(const dz of [-1.08,1.08]){
        arched(x+side*4.03,z+dz,25.7,1.87,7.24,side*Math.PI/2,'louvre');
      }
      // Slender four-sided metal belfry caps above the original masonry towers.
      box(0xb1b2a7,x,36.63,z,8.68,.45,9.82);
      tapered(0xaab0aa,x,46.89,z,5.95,.17,20.2,1.10,4);
      for(const angle of [0,Math.PI*.5,Math.PI,-Math.PI*.5]){
        const sx=Math.sin(angle),cz=Math.cos(angle),reach=Math.abs(cz)>.5?4.70:4.23;
        const xx=x+sx*reach,zz=z+cz*reach;
        outline([[-1.53,0],[1.53,0],[0,4.79]],0xd3d2c7,xx,36.70,zz,.33,angle);
        outline([[-.84,0],[.84,0],[0,2.88]],0x66716d,xx+sx*.35,37.01,zz+cz*.35,.12,angle);
        box(0xa8b1a6,xx+sx*.51,38.07,zz+cz*.51,.095,1.99,.12,angle);
        for(const side of [-1,1]){
          const eave=1.48*side;
          const inner=[xx+Math.cos(angle)*eave,36.86,zz-Math.sin(angle)*eave];
          const back=[x+sx*2.70,40.70,z+cz*2.70],tip=[xx,41.51,zz];
          brick.face(inner,tip,back,[inner[0]-sx*2.3,36.86,inner[2]-cz*2.3],0xaeb5b0);
        }
      }
      for(const side of [-1,1])for(const dz of [-4.34,4.34])tapered(0xc7c9bf,x+side*3.89,37.92,z+dz,.39,.025,2.32,1,4);
      box(0x666d61,x,58.53,z,.165,3.16,.155);box(0x62695e,x,58.88,z,1.55,.16,.16);
    }
    // Arched aisle windows, high clerestory, standing buttresses and transept.
    for(const side of [-1,1]){
      const angle=side*Math.PI*.5;
      for(const z of [-29.1,-22.55,-.2,6.40,13.0,19.60,26.2]){
        arched(side*14.05,z,2.63,2.55,5.64,angle,'window');
        arched(side*7.91-.1,z,14.01,1.95,2.81,angle,'window');
        b(redShadow,side*14.15,4.54,z-2.64,.68,8.97,.83);
        box(sand,side*14.16,9.03,z-2.64,.81,.30,1.0);
      }
      for(const dz of [-2.65,0,2.65])arched(side*16.9-.57,-10.2+dz,3.1,2.00,7.45,angle,'window');
      box(sand,side*17.12-.57,13.72,-10.2,.48,.34,13.02);
    }
    for(const [x,z,r,angles] of [[-9.2,-36.0,6.3,[-1.77,-2.42,-2.99]],[-2,-43.7,6.0,[-2.42,Math.PI,2.42]],[6.6,-36.4,5.7,[1.77,2.42,2.99]]]){
      for(const a of angles){
        const sx=Math.sin(a),cz=Math.cos(a);
        arched(x+sx*(r-.035),z+cz*(r-.035),2.36,1.55,4.83,a,'window');
      }
    }
    band(mid,8.64,36.99,11.21,3.39);
    for(let j=0;j<3;j++)box(0xb8a99a,mid,.07+j*.13,40.39-j*.44,26.85-j*.21,.17+j*.26,.48);
    disk.dispose();for(const g of templates.values())g.dispose();brick.finish();
  }

  const mausId='osm-way-37625751',churchId='osm-way-801950766';
  const publicGardenSolids=[[flagGarden.x,flagGarden.z,flagGarden.halfWidth+.083,flagGarden.halfDepth+.083],
    [lawnRail.x,lawnRail.z,lawnRail.bays*lawnRail.pitch/2+.123,.123]];
  // Boundary points are the actual OSM building rings, in metres in each
  // site's façade frame. Adjacent mapped buildings keep their own meshes.
  (window.VietnamSights??=[]).push({
    ...sites.get(mausId),id:'lang-chu-tich-ho-chi-minh',catalogId:mausId,yaw:1.373,width:42,depth:38,
    memorialVisit:true,modeledBuildings:['w1213801282','w697161892','w697161893','w1092549155:part','w1092549156:part','w1092549157:part','w1092549158:part'],
    boundary:[[18.4,9],[22.4,9],[22.4,17.4],[-18.8,17.4],[-18.8,9.6],[-14.5,9.5],[-14.6,-19],[18.4,-19]],
    solids:[[1.9,-4.7,16.5,14.3],[1.8,13.4,20.6,4.0],...publicGardenSolids],
    replacesFence:(x,z)=>Math.abs(x-lawnRail.x)<=lawnRail.bays*lawnRail.pitch/2&&Math.abs(z-lawnRail.z)<1.5,
    reserve:(x,z,p=0)=>Math.abs(x-1.9)<21+p&&z> -20-p&&z<22+p||
      publicGardenSolids.some(([cx,cz,w,d])=>Math.abs(x-cx)<w+p&&Math.abs(z-cz)<d+p),
    viewAngle:1.56,viewElevation:-.114,viewRadius:141,viewFov:34,
    views:[{name:'Bồn hoa cột cờ và mặt chính Lăng',height:29,viewAngle:1.56,viewElevation:-.114,viewRadius:141},
      {id:'hang-rao-tham-co',name:'Qua hàng rào thảm cỏ Ba Đình',height:20,viewAngle:1.49,viewElevation:-.068,viewRadius:193,viewFov:23},
      {name:'Bậc thềm và hàng cột đá',height:22,viewAngle:1.57,viewElevation:-.105,viewRadius:61,viewFov:36}],
    description:'Từ Quảng trường Ba Đình, có thể nhìn qua hàng rào sắt hoa văn ô vuông ở mép thảm cỏ về phía Lăng. Quanh chân cột cờ là bồn hoa viền dây xích. Phía sau hai cây đại, hai mươi cột vuông bao quanh khối đá hồng. Dòng chữ đá ngọc màu mận chín nằm trên diềm mái mặt chính.',
    source:'https://btllang.mod.gov.vn/tin-tuc/tin-tu-bo-tu-lenh-lang/4161-qua-trinh-xay-dung-lang-chu-tich-ho-chi-minh-cong-trinh-dac-biet-co-y-nghia-chinh-tri-van-hoa.html',
    photo:window.VietnamSightDetails?.[mausId]?.photo??'https://commons.wikimedia.org/wiki/File:L%C4%83ng_B%C3%A1c_-_NKS.jpg',build:mausoleum
  },{
    ...sites.get(churchId),id:'nha-tho-duc-ba-sai-gon',catalogId:churchId,start:[106.6993333,10.7791309],yaw:.786,width:35,depth:91,
    boundary:[[14.9,38.8],[-12.4,38.8],[-13.7,-3.1],[-17.5,-3],[-17.8,-16.5],[-15.8,-16.5],[-16.1,-35],[-12.5,-40.8],[-9.6,-43.1],[-6.1,-43],[-6.4,-47],[-3.7,-50.1],[0,-50.2],[3.3,-43.3],[7.5,-43.8],[10.5,-37.6],[12.8,-34.6],[13.3,-16.3],[16.2,-16.4],[16.6,-4.8],[13.1,-4.6],[14.9,29.4]],
    solids:[[.2,-2.8,13.9,32.5],[1.2,33.9,13.7,4.9],[-.56,-10.2,17.2,6.25],[-1.7,-39,10.8,4.5],[-1.9,-46,5.0,4.1]],
    viewAngle:1.02,viewElevation:.16,viewRadius:95,
    views:[{name:'Mặt tiền Công xã Paris',offset:[22.7,22.7],height:57.6,viewAngle:.98,viewElevation:.12,viewRadius:88},
      {name:'Gian ngang và cung thánh',offset:[-7,-7],height:46,viewAngle:-1.55,viewElevation:.29,viewRadius:109}],
    description:'Mặt tiền gạch trần hướng về Công xã Paris. Ô cửa hoa hồng và đồng hồ nằm giữa hai tháp chuông chóp kim loại. Mô hình thể hiện ngoại thất trước đợt trùng tu.',
    source:'https://tgpsaigon.net/bai-viet/vuong-cung-thanh-duong-duc-ba-sai-gon-37259',
    photo:window.VietnamSightDetails?.[churchId]?.photo??'https://tgpsaigon.net/bai-viet/vuong-cung-thanh-duong-duc-ba-sai-gon-37259',build:cathedral
  });
})();
