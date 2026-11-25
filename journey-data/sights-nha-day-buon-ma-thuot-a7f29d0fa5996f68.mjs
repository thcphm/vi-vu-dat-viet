const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='nha-day-buon-ma-thuot',catalogId='osm-node-1730268393',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  const source='https://daklakmuseum.vn/tin-tuc-su-kien/bai-viet/nha-day-buon-ma-thuot';
  const photo='https://vr360.com.vn/projects/ban-do-so-du-lich-daklak/#node146';
  // The datum is the intersection of the surveyed walks, n2500508761.
  // OSM w240212833 is the precinct, w242608877–891 the surveyed roofs.
  // Compare the museum's public site plan photographed by VOV in June 2024,
  // the 2026 oblique aerial by Khả Hưng, and nodes 2/23/38/5 of the on-site
  // tour https://daklakvrtour.com/nha-day-buon-ma-thuot.html . Heights
  // other than the museum's documented perimeter section are estimated.
  const yaw=.129,c=Math.cos(yaw),s=Math.sin(yaw),pi=Math.PI,tau=2*pi;
  const wall=0xd7ae59,ochre=0xd1a346,gold=0xd6aa4a,wood=0x724f37,door=0x436047,trim=0x5b7560,
    red=0x733e33,brown=0x845044,tile=0x865447,tileWarm=0x946252,gray=0x999a89,pale=0xc3c2b3,
    curb=0xaaa28e,iron=0x4e5752,shade=0x363b34,concrete=0xb3a894;
  const boundary=[[-64.44,-70.6],[60.89,-70.36],[64.58,59.64],[-1.76,58.84],[-63.5,58.1]];
  const seed=n=>{const a=Math.sin(n*23.537+.52)*39942.78;return a-Math.floor(a);};
  function roof(T,k,w,d,y,rise,hip=false,c1=tileWarm,c2=tile){
    // Width is across the ridge. A hip length of zero leaves the gable end
    // open for its painted timber infill.
    const rw=w*.5+.32,rd=d*.5+.36,hr=hip?Math.min(rd-.24,rw*.86):0;
    const v=[[-rw,y,-rd],[rw,y,-rd],[rw,y,rd],[-rw,y,rd],[0,y+rise,-rd+hr],[0,y+rise,rd-hr]];
    function face(indices,tint){
      const p=[],soffit=[];
      for(let i=1;i<indices.length-1;i++){
        for(const n of [indices[0],indices[i+1],indices[i]])p.push(...v[n]);
        for(const n of [indices[0],indices[i],indices[i+1]])soffit.push(v[n][0],v[n][1]-.085,v[n][2]);
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();
      k.stamp(g,tint,0,0,0);g.dispose();
      const underside=new T.BufferGeometry();underside.setAttribute('position',new T.Float32BufferAttribute(soffit,3));
      underside.computeVertexNormals();k.stamp(underside,0x554639,0,0,0);underside.dispose();
    }
    face([0,4,5,3],c1);face([1,2,5,4],c2);
    if(hip){face([0,1,4],c2);face([3,5,2],c1);}
    k.box(c2,0,y+rise,0,.14,.12,2*(rd-hr)+.07);
    for(const e of [-1,1])k.box(0x827b6a,e*rw,y-.03,0,.10,.13,d+.74);
  }
  function gable(T,k,width,z,y,rise,face){
    const shape=new T.Shape();shape.moveTo(-width/2,0);shape.lineTo(width/2,0);shape.lineTo(0,rise);shape.closePath();
    k.profile(shape,face,0,y,z,.13);
    const len=Math.hypot(width*.5,rise);
    for(const e of [-1,1])k.box(0xb1ae99,e*width*.25,y+rise*.5,z+.07,len,.096,.14,0,0,-e*Math.atan2(rise,width*.5));
    const n=Math.ceil(width/.26);
    for(let i=1;i<n;i++){
      const x=width*i/n-width/2,h=rise*(1-2*Math.abs(x)/width);
      if(h>.17)k.box(0x516958,x,y+h*.48,z+.139,.028,h*.94,.026);
    }
  }
  function doorLeaf(k,x,y,z,w,h,angle=0){
    k.place(x,z,angle,()=>{
      k.box(0x494a3b,0,y+h*.50,0,w+.12,h+.09,.07);
      k.box(door,0,y+h*.50,.048,w,h,.068);
      k.box(trim,0,y+h*.58,.090,w-.10,.052,.025);
      if(w>1.2)k.box(shade,0,y+h*.50,.090,.025,h-.06,.024);
      k.box(iron,w*.27,y+h*.46,.106,.055,.068,.03);
    });
  }
  function transom(k,x,y,z,w,h,angle=0){
    k.place(x,z,angle,()=>{
      k.box(trim,0,y,0,w+.10,h+.10,.10);k.box(0x42473a,0,y,.054,w,h,.038);
      const n=Math.max(3,Math.round(w/.19));
      for(let i=1;i<n;i++)k.box(iron,w*(i/n-.5),y,.082,.028,h,.023);
      k.box(iron,0,y,.084,w,.027,.023);
    });
  }
  function block(T,k,w,d,{h=3.46,rise=1.46,hip=false,pitched=true,c1=tileWarm,c2=tile,longDoors=2,endDoors=true}={}){
    const floor=.24;
    k.box(gray,0,.12,0,w,.24,d);k.box(wall,0,floor+h*.5,0,w,h,d);
    k.box(red,0,.34,0,w+.035,.19,d+.035);
    const eave=h+.28;
    if(!hip&&pitched)for(const e of [-1,1])gable(T,k,w+.18,e*d*.5-(e<0?.14:0),eave-.05,rise,trim);
    roof(T,k,w,d,eave,rise,hip,c1,c2);
    const n=Math.max(2,Math.round(d/2.65)),width=d/n*0.71;
    for(const side of [-1,1]){
      for(let i=0;i<n;i++){
        const z=d*((i+.5)/n-.5);
        transom(k,side*(w*.5+.034),eave-.63,z,width,.60,side*pi*.5);
      }
      for(let j=1;j<=longDoors;j++){
        const z=d*(j/(longDoors+1)-.5);
        doorLeaf(k,side*(w*.5+.035),floor,z,.94,2.0,side*pi*.5);
        k.box(gray,side*(w*.5+.20),.13,z,.53,.25,1.16);
        k.box(curb,side*(w*.5+.46),.066,z,.28,.13,1.20);
      }
      k.box(0xc1b393,side*(w*.5+.078),eave-.975,0,.15,.092,d-.13);
      for(let j=0;j<Math.max(1,Math.floor(d/9.5));j++){
        const z=d*((j+.27)/Math.max(1,Math.floor(d/9.5))-.5);
        k.box(0x8d816c,side*(w*.5+.072),h*.5+.09,z,.08,h-.10,.08);
      }
      if(endDoors){
        doorLeaf(k,0,floor,side*(d*.5+.036),1.51,2.37,side===1?0:pi);
        transom(k,0,eave-.53,side*(d*.5+.035),w*.62,.50,side===1?0:pi);
      }
    }
  }
  function arch(T,k,w,wOpen,spring,h,y,z,d,tint){
    const r=wOpen*.5,shape=new T.Shape();
    shape.moveTo(-w*.5,0);shape.lineTo(-r,0);shape.lineTo(-r,spring);
    shape.absarc(0,spring,r,pi,0,true);shape.lineTo(r,0);shape.lineTo(w*.5,0);
    shape.lineTo(w*.5,h);shape.lineTo(-w*.5,h);shape.closePath();
    k.profile(shape,tint,0,y,z,d);
  }
  function gate(T,k){
    // The original south doorway is again the public approach. The open
    // arch, recessed upper opening and side pilasters are visible on both
    // faces in the 2026 photo report and the entrance panorama.
    const w=5.75,d=4.3,h=7.95;
    for(const z of [-d*.5,d*.5-.47]){
      arch(T,k,w,3.37,2.48,5.18,0,z,.46,gold);
      for(const sign of [-1,1]){
        k.box(ochre,sign*(w*.5-.43),h*.5,z+.21,.77,h,.61);
        k.box(red,sign*(w*.5-.43),.13,z+.21,.84,.26,.72);
      }
      k.box(pale,0,5.12,z+.28,4.51,.093,.53);
      for(let i=0;i<20;i++){
        const a=pi*(i+.5)/20,r=1.82;
        k.box(0xdcca8c,r*Math.cos(a),2.48+r*Math.sin(a),z+.48,.29,.060,.038,0,0,a-pi*.5);
      }
    }
    for(const side of [-1,1])k.box(ochre,side*(w*.5-.20),h*.5,0,.41,h,d-.12);
    k.box(wood,0,7.79,0,w-.13,.16,d);k.box(shade,0,6.51,-.25,w-1.1,2.42,.27);
    roof(T,k,w+.30,d+.62,7.94,1.15,true,0x815747,0x674b40);
    for(const side of [-1,1]){
      k.box(door,side*1.63,1.38,-.19,.14,2.76,2.49);
      k.box(0x795340,side*1.63,1.37,-.20,.17,.09,2.49);
    }
  }
  function entranceWing(T,k,w,d,left){
    k.box(ochre,0,1.89,0,w,3.78,d);k.box(red,0,.13,0,w+.035,.26,d+.035);
    k.place(0,0,pi/2,()=>{
      for(const side of [-1,1])gable(T,k,d,side*w*.5-(side<0?.14:0),3.76,.86,ochre);
      roof(T,k,d,w,3.80,.84,false,0x765347,0x664a3e);
    });
    if(left)doorLeaf(k,0,.10,d*.5+.035,.73,2.10);
  }
  function north(T,k){
    // The long north roof covers Lao 3 and Lao 4. Its central projecting
    // arch with a white fanlight is visible at the end of the axial walk.
    k.place(0,0,pi/2,()=>block(T,k,7.80,64.3,{hip:true,h:3.54,rise:1.65,longDoors:5,endDoors:false}));
    k.box(wall,0,2.32,4.18,5.10,4.64,.86);
    k.box(ochre,0,2.28,4.69,4.22,4.52,.18);k.box(0x443f31,0,1.21,4.80,1.91,2.42,.05);
    const fan=new T.Shape();fan.moveTo(-.965,0);fan.absarc(0,0,.965,pi,0,true);fan.closePath();
    k.profile(fan,shade,0,2.42,4.845,.05);
    for(let i=-2;i<=2;i++){
      const x=i*.32,h=Math.sqrt(.965**2-x*x);k.box(pale,x,2.42+h*.5,4.91,.057,h,.042);
    }
    k.box(pale,0,2.43,4.91,1.96,.094,.044);k.box(pale,0,2.85,4.91,1.71,.061,.044);
    const g=new T.Shape();g.moveTo(-2.7,0);g.quadraticCurveTo(-1.68,.22,-1.44,.72);g.quadraticCurveTo(-.79,.62,0,1.14);
    g.quadraticCurveTo(.79,.62,1.44,.72);g.quadraticCurveTo(1.68,.22,2.7,0);g.closePath();
    k.profile(g,wall,0,4.50,4.53,.30);k.box(ochre,0,4.55,4.70,5.47,.12,.39);
    for(let i=0;i<3;i++)k.box(concrete,0,(3-i)*.067,4.96+i*.28,2.66,(3-i)*.135,.41);
  }
  function shrine(T,k){
    // West-facing gallery under the large tree, east of the north walk.
    // The two service roofs immediately south of it are separate. The four
    // bays in the dedication scroll, Dharma wheel and three front openings
    // follow Dominic Nelson's Commons photograph, page 148107073.
    const w=4.38,d=6.3;
    k.box(red,0,.10,0,w,.2,d);k.box(gold,0,1.29,-.66,w,2.57,d-1.34);
    for(const sign of [-1,1]){
      k.box(ochre,sign*(w*.5-.17),1.43,d*.5-.22,.35,2.86,.37);
      k.box(wall,sign*.78,1.43,d*.5-.22,.31,2.86,.37);
      doorLeaf(k,sign*.54,.03,1.84,.92,2.19,0);
    }
    k.box(wall,0,2.65,2.71,w,.62,.64);roof(T,k,w,d,2.99,1.19,true,0x74786c,0x666b61);
    const banner=new T.Shape();banner.moveTo(-1.98,0);banner.lineTo(-1.98,.72);banner.quadraticCurveTo(-1.4,.49,-.94,.59);
    banner.quadraticCurveTo(0,1.10,.94,.59);banner.quadraticCurveTo(1.4,.49,1.98,.72);banner.lineTo(1.98,0);
    banner.quadraticCurveTo(1.38,-.19,.74,.04);banner.quadraticCurveTo(0,.27,-.74,.04);banner.quadraticCurveTo(-1.38,-.19,-1.98,0);
    k.profile(banner,gold,0,3.02,2.66,.17);
    const wheel=new T.TorusGeometry(.31,.032,6,24);k.stamp(wheel,pale,0,4.12,2.73);wheel.dispose();
    for(let i=0;i<8;i++){const a=i*pi*.25;k.box(pale,.17*Math.sin(a),4.12+.17*Math.cos(a),2.73,.029,.34,.037,0,0,-a);}
    window.CentralArch.plaque(T,k,'QUỐC THÁI DÂN AN',0,2.74,3.05,1.52,.22,{bg:'#d6ae67',fg:'#714337',border:0xb69754});
  }
  function chapel(T,k){
    const w=4.61,d=7.62;block(T,k,w,d,{h:2.87,rise:1.14,c1:0xa3a59b,c2:0x999b90,longDoors:0,endDoors:false});
    doorLeaf(k,0,.25,d*.5+.04,1.36,2.18);
    k.box(pale,0,4.52,3.1,.085,.69,.092);k.box(pale,0,4.64,3.1,.36,.082,.092);
  }
  function yard(){
    return [[-41.0,20.4,0,7.69,30.2],[-41.6,-20.4,0,7.57,30.35],[41.1,19.8,0,7.69,30.78],[40.5,-20.7,0,7.32,30.47]];
  }
  function gardenHouse(k){
    // Small flat-roofed pavilion abutting the western block in the south
    // garden. Its open upper terrace is visible in the north aerial.
    k.box(0xe0d7bc,0,1.48,0,14.1,2.96,8.4);
    k.box(0xbbb7a7,0,3.04,0,14.5,.21,8.8);
    k.box(0xdbd7c1,-.30,4.46,1.18,5.4,2.72,5.90);
    k.box(pale,-.30,5.85,1.18,5.70,.23,6.25);
    for(const x of [-6.8,-2.83,2.25,6.8])k.box(0xe2dcc4,x,3.56,-4.16,.22,.94,.24);
    k.box(pale,0,3.97,-4.16,13.9,.14,.17);
    for(let i=0;i<23;i++)k.box(0xe0d9bd,-6.60+i*.60,3.53,-4.16,.075,.74,.11);
    for(const x of [-4.98,.15,4.95])doorLeaf(k,x,.18,-4.22,1.75,2.46,pi);
    doorLeaf(k,-.33,3.17,-1.80,1.55,2.33,pi);
  }
  function terrainMesh(T,k,name,p,indices,material){
    const geom=new T.BufferGeometry(),pos=new T.Float32BufferAttribute(p,3);
    geom.setAttribute('position',pos);geom.setIndex(indices);geom.computeVertexNormals();
    const mesh=new T.Mesh(geom,material);mesh.name=name;mesh.receiveShadow=true;k.group.add(mesh);
    return {mesh,fit(g){
      for(let i=0;i<pos.count;i++)pos.setY(i,p[i*3+1]+g(p[i*3],p[i*3+2]));
      pos.needsUpdate=true;geom.computeVertexNormals();geom.computeBoundingSphere();
    }};
  }
  function perimeterWall(T,k){
    const p=[],indices=[],uv=[];
    function strip(x1,z1,x2,z2){
      const dx=x2-x1,dz=z2-z1,d=Math.hypot(dx,dz),sx=.2*dz/d,sz=-.2*dx/d,n=Math.ceil(d/2.5);
      for(let j=0;j<=n;j++){
        const x=x1+j*dx/n,z=z1+j*dz/n,base=p.length/3;
        for(const [mult,h] of [[-1,-.18],[-1,4],[1,4],[1,-.18]]){
          p.push(x+mult*sx,h,z+mult*sz);uv.push(j*d/n,h);
        }
        if(j)for(let u=0;u<3;u++)indices.push(base-4+u,base+u,base-3+u,base-3+u,base+u,base+1+u);
      }
    }
    const [nw,ne,se,gate,sw]=boundary;
    strip(...nw,...ne);strip(...ne,...se);strip(...se,gate[0]+2.82,58.87);
    strip(gate[0]-2.82,58.81,...sw);strip(...sw,-63.92,3.14);strip(-63.96,-2.28,...nw);
    const mat=new T.MeshLambertMaterial({color:0xc6c4ae,side:T.DoubleSide});
    mat.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec2 wallUV;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nwallUV=uv;');
      sh.fragmentShader='varying vec2 wallUV;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float stain=.5+.23*sin(wallUV.x*.71+sin(wallUV.y*2.7))+.17*sin(wallUV.x*1.53-wallUV.y*1.72);
        float grain=fract(sin(dot(floor(wallUV*28.),vec2(12.79,83.13)))*44521.14);
        diffuseColor.rgb*=(.76+.20*stain+.07*grain)*mix(.53,1.,smoothstep(-.2,.81+stain*.9,wallUV.y));`);
    };
    const out=terrainMesh(T,k,'Tường bao di tích',p,indices,mat);
    out.mesh.geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));out.mesh.castShadow=true;return out.fit;
  }
  function court(T,k){
    const p=[],idx=[],cols=57,rows=62;
    for(let j=0;j<=rows;j++){
      const t=j/rows,xw=-64.44+t*.94,xe=60.89+t*3.69;
      for(let i=0;i<=cols;i++){
        const u=i/cols,zn=-70.6+u*.24,zs=58.1+u*1.54;
        const n=p.length/3;p.push(xw+u*(xe-xw),.09,zn+t*(zs-zn));
        if(i&&j)idx.push(n-cols-2,n-1,n,n-cols-2,n,n-cols-1);
      }
    }
    const turf=new T.TextureLoader().load('streetscape/surfaces/grass-color.webp');
    turf.wrapS=turf.wrapT=T.RepeatWrapping;turf.colorSpace=T.SRGBColorSpace;turf.anisotropy=4;
    const pads=[...yard().map(([x,z,,w,d])=>[x,z,w+3.1,d+3.7]),[-.8,-57,70,11.2],[-23.6,46.8,44.7,10.6],
      [20.3,46.4,28.9,10.8],[55.0,4.4,11.5,65],[-25.7,29,18.6,12],[-21.5,-32.9,6.2,9.8],
      [-19.5,-21.4,7.4,6.4],[-18.8,-9.1,8.3,12.0],[7.9,-33,14.6,8.9],[22.7,-32.8,16,8.4]];
    const rect=([x,z,w,d])=>'paved=max(paved,slab(q,vec2('+x.toFixed(3)+','+z.toFixed(3)+'),vec2('+(w/2).toFixed(3)+','+(d/2).toFixed(3)+')));';
    const mat=new T.MeshLambertMaterial({color:0xffffff});
    mat.onBeforeCompile=sh=>{
      sh.uniforms.museumGrass={value:turf};
      sh.vertexShader='varying vec2 gardenXY;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ngardenXY=position.xz;');
      sh.fragmentShader=`varying vec2 gardenXY;
        uniform sampler2D museumGrass;
        float slab(vec2 q,vec2 c,vec2 halfSize){
          vec2 m=abs(q-c)-halfSize;return 1.-smoothstep(-.045,.045,max(m.x,m.y));
        }\n`+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 q=gardenXY;
        float paved=slab(q,vec2(-.68,-.15),vec2(2.14,59.02));
        paved=max(paved,slab(q,vec2(-3.,-.04),vec2(58.,2.30)));
        paved=max(paved,slab(q,vec2(-29.3,17.),vec2(.84,15.4)));
        paved=max(paved,slab(q,vec2(-.7,-3.0),vec2(4.4,1.)));
        paved=max(paved,slab(q,vec2(-.7,2.75),vec2(4.4,1.)));
        paved=max(paved,slab(q,vec2(-.8,-51.),vec2(39.2,1.11)));
        ${pads.map(rect).join('\n')}
        float brick=slab(q,vec2(18.,-44.),vec2(15.6,5.3));
        vec2 cell=fract(q*.66),edge=min(cell,1.-cell);
        float joint=smoothstep(.004,.017,min(edge.x,edge.y));
        float blades=dot(texture2D(museumGrass,q*.41).rgb,vec3(.24,.64,.12));
        float variation=.5+.5*sin(q.x*.23+sin(q.y*.31));
        vec3 grass=vec3(.155,.305,.043)*(.71+.88*blades+.10*variation);
        float grain=fract(sin(dot(floor(q*21.),vec2(12.31,72.72)))*47815.);
        vec3 cement=vec3(.55,.512,.425)*(.77+.17*joint+.08*grain);
        diffuseColor.rgb=mix(grass,cement,paved);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.396,.204,.149)*(.83+.12*grain+.06*joint),brick);`);
    };
    return terrainMesh(T,k,'Hai lối dạo cắt nhau giữa sân',p,idx,mat).fit;
  }
  function planting(T,k){
    const pose=new T.Object3D(),groups=[];
    function grow(name,geo,mat,items){
      if(!items.length)return;
      const mesh=new T.InstancedMesh(geo,mat,items.length);
      mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);groups.push([mesh,items]);
    }
    const hedge=[],clipped=[];
    for(const side of [-1,1]){
      for(let z=-46;z<=41;z+=3.05)if(Math.abs(z)>4.7)hedge.push([-.64+side*3.46,z,1.66,.98]);
      for(let x=-35;x<=35;x+=3.10)if(Math.abs(x+.64)>4.5)hedge.push([x,side*3.73,1.56,.93]);
      for(let x=-30;x<33;x+=3.18)if(Math.abs(x+.64)>5)hedge.push([x,side===1?40.0:-49.0,1.11,.77]);
    }
    for(let z=6;z<26;z+=3.2)hedge.push([-31.1,z,1.08,.74]);
    const profile=[[.79,.02],[.91,.17],[.90,.38],[.76,.81],[.56,1.16],[.34,1.45],[.08,1.63]];
    const vertices=[],colors=[],index=[],count=17;
    profile.forEach(([rad,y],j)=>{
      for(let i=0;i<count;i++){
        const a=tau*i/count,r=rad*(.98+.045*seed(i+j*93)),v=.86+.18*seed(i*9+j);
        vertices.push(r*Math.cos(a),y+.04*seed(81*i+j),r*Math.sin(a));colors.push(.14*v,.245*v,.039*v);
        if(j){const t=j*count+i,n=j*count+(i+1)%count;index.push(t-count,t,n-count,n-count,t,n);}
      }
    });
    const apex=vertices.length/3;vertices.push(0,1.66,0);colors.push(.14,.245,.039);
    for(let i=0;i<count;i++)index.push(apex-count+i,apex,apex-count+(i+1)%count);
    const leaves=new T.BufferGeometry();leaves.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
    leaves.setAttribute('color',new T.Float32BufferAttribute(colors,3));leaves.setIndex(index);leaves.computeVertexNormals();
    const shrub=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide});
    shrub.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec3 hedgePos;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nhedgePos=position;');
      sh.fragmentShader='varying vec3 hedgePos;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec3 q=hedgePos*30.;
        float coarse=sin(q.x*1.7+sin(q.z*1.11))*cos(q.y*1.45+q.z);
        float fine=fract(sin(dot(floor(q*2.),vec3(13.5,42.7,7.9)))*14365.);
        float detail=1.-smoothstep(.25,1.4,fwidth(q.x)+fwidth(q.y)+fwidth(q.z));
        diffuseColor.rgb*=1.+detail*(.18*coarse+.28*(fine-.5));`);
    };
    grow('Hai hàng cây cắt tỉa',leaves,shrub,
      hedge.map(([x,z,h,r],i)=>[x,z,.07,r,h/1.66,r,tau*seed(i)]));
    // In the published north aerial the two lines of living letters in
    // the south-west lawn face north. Sample the two glyph masks once and
    // combine each run into one strip of clipped foliage.
    const canvas=document.createElement('canvas');canvas.width=180;canvas.height=59;
    const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.textAlign='center';
    ctx.font='bold 22px Arial';ctx.fillText('DITICH',90,24);ctx.fillText('NHADAY◇BMT',90,50,163);
    const alpha=ctx.getImageData(0,0,180,59).data;
    for(let row=0;row<59;row+=2){
      let start=-1;
      for(let col=0;col<=180;col++){
        const on=col<180&&alpha[(row*180+col)*4+3]>110;
        if(on&&start<0)start=col;
        if(!on&&start>=0){
          const w=col-start;clipped.push([-17.0-(start+w*.5-90)*.105,13.0-(row-29)*.112,.33,w*.105,.48,.225,0]);start=-1;
        }
      }
    }
    grow('Chữ cắt tỉa bằng cây',new T.BoxGeometry(),new T.MeshLambertMaterial({color:0x8c9b47}),clipped);
    // Crown positions read from the vertical aerial. The high, spreading
    // tree in the north-east shades the sheltered memorial, not the walk.
    const trees=createTreeModels(T),points=[
      [30,-49,15,21],[37,-42,11.7,13],[-24,-48,6,5],[8,-49,7,8],[-12,-30,7.2,6],
      [-11,-17,7.3,6],[-58,-36,10,12],[-51,-42,10,9],[-57,-23,11,12],[-52,13,10.8,13],
      [-57,23,8.4,10],[-53,34,12.4,13],[-46,48,11.8,10],[-38,54,10.8,13],[-24,54,9.8,10],
      [-10,55,6.5,9],[57,41,10.8,12],[43,47,11.8,13],[30,55,8.5,8],[31,28,8.6,8],
      [29,18,8.0,6.9],[26,14,5.4,4.3],[17,8,3.8,4.1],[13,25,4.6,4],
      [8,32,5.2,4.4],[17,-10,6.2,6],[23,-9,5.6,5.4],[11,-27,4.4,3.8],[-10,15,7,6.8],
      [-11,26,7.0,5.7],[47,-58,10.5,14],[-60,-56,8,8],[-46,-60,6.1,6.8],[56,-39,9,8.2]];
    for(let i=0;i<3;i++)grow('Tán cây trong khuôn viên',trees.geometry('tree',true,i),trees.material,
      points.filter((_,j)=>j%3===i).map(([x,z,h,w],j)=>[x,z,.05,w,h,w,tau*seed(j*13+i)]));
    return g=>{
      for(const [mesh,items] of groups){
        items.forEach(([x,z,y,w,h,d,a],i)=>{
          pose.position.set(x,g(x,z)+y,z);pose.rotation.set(0,a,0);pose.scale.set(w,h,d);
          pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
        });
        mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
      }
    };
  }
  function build(T,k){
    const f=createTempleFoundations(T,k);
    k.palette({plaster:[wall,gold,ochre],stone:[gray,pale,curb,concrete],tile:[tile,tileWarm,brown],timber:[wood,door,trim],metal:iron});
    function hall(x,z,a,w,d,builder){return f.building(x,z,a,w,d,builder);}
    for(const [x,z,a,w,d] of yard())hall(x,z,a,w,d,()=>block(T,k,w-.45,d-.6));
    hall(-.8,-57,0,64.8,8.4,()=>north(T,k));
    hall(55.5,4.4,0,7.4,61.5,()=>{
      for(let i=0;i<3;i++)k.place(0,(i-1)*20.3,0,()=>block(T,k,7.02,19.93,{h:3.34,rise:1.32,hip:i!==1,longDoors:4}));
    });
    hall(-23.6,46.8,pi/2,7.87,41.7,()=>block(T,k,7.58,41.3,{hip:true,h:3.15,rise:1.37,longDoors:3}));
    hall(20.3,46.4,pi/2,7.9,26.1,()=>block(T,k,7.50,25.9,{h:3.15,rise:1.37,longDoors:3}));
    for(const [x,z,w,d,a,h,rc] of [[-19.5,-21.4,4.0,5.6,pi/2,2.40,0x916656],[-18.8,-9.1,5.93,9.12,0,2.58,tile],
      [22.7,-32.8,6.1,14.1,pi/2,2.71,tile],[-56.0,.2,5.5,10.7,0,2.85,tile]]){
      hall(x,z,a,w,d,()=>block(T,k,w,d,{h,rise:.92,c1:rc,c2:rc,longDoors:1}));
    }
    hall(-21.8,-32.9,0,4.9,8,()=>chapel(T,k));
    hall(7.9,-33,pi/2,6.6,12.2,()=>block(T,k,6.36,12.0,{h:2.53,rise:.85,c1:0xb5b7ab,c2:0x9eaaa1,longDoors:1}));
    hall(29,-42,-pi/2,4.6,6.4,()=>shrine(T,k));
    hall(-25.7,29,0,14.5,8.8,()=>gardenHouse(k));
    hall(-1.76,58.65,0,5.8,4.3,()=>gate(T,k));
    hall(3.75,58.35,0,5.30,3.75,()=>entranceWing(T,k,5.25,3.69,false));
    hall(-5.80,58.35,0,2.53,3.75,()=>entranceWing(T,k,2.50,3.69,true));
    const fitGround=gardens(T,k);
    const fit=k.group.userData.fitGround;
    k.group.userData.fitGround=g=>{fit(g);fitGround(g);};
  }
  function gardens(T,k){
    const perimeter=perimeterWall(T,k),ground=court(T,k),plants=planting(T,k);
    return g=>{perimeter(g);ground(g);plants(g);};
  }
  function view(name,x,z,height,r,a,e,f=51){
    return {name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius:r,viewAngle:yaw+a,viewElevation:e,viewFov:f,viewBase:'monument'};
  }
  const named=[877,878,879,880,882,883,884,885,886,887,888,889,890,891].map(n=>'w242608'+n);
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Nhà đày Buôn Ma Thuột',kind:'Di tích',
    lon:108.0471622,lat:12.6767829,yaw,width:129,depth:130,source,photo,map:'https://www.openstreetmap.org/way/240212833',
    start:raw?.start??[108.0473086,12.6757888],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    boundary,modeledBuildings:named,solids:[],reserve:(x,z,r)=>Math.abs(x)<65+r&&z>-71-r&&z<61+r,
    description:'Nhà đày được xây dựng năm 1930–1931. Từ cổng phía nam, hai hàng cây xén dẫn tới giao lộ giữa sân. Sáu lao tập thể nằm theo hình chữ U ở phía tây, bắc và đông. Bảo tàng Đắk Lắk ghi nhận tường bao cao 4 m và dày 40 cm. Mái, cửa và màu tường được ước dựng từ ảnh di tích ngày nay.',
    arrivalNote:'Xe dừng trên đường Phạm Hồng Thái, ngay đầu lối vào số 27. Từ đây đi bộ khoảng 52 m đến cổng vòm phía nam. Bảo tàng đón khách theo lối này từ ngày 5/12/2022.',
    views:[view('Cổng vòm phía Phạm Hồng Thái',-1.76,58.65,7.7,15.8,-.047,-.075,51),
      view('Sáu lao tập thể quanh sân chữ U',0,-1,5.6,149,-2.99,.66,55),
      view('Hàng cửa xanh trên dãy lao phía tây',-39.0,15,4.1,14.8,2.28,.055),
      view('Theo hàng cây về dãy lao phía bắc',-.6,-43,5.4,29,-.21,.074)],build});
})();

export default window.VietnamSights;
