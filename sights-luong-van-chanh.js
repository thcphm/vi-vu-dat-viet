'use strict';
(()=>{
  const id='den-tho-luong-van-chanh',catalogId='osm-node-12856400201',raw=window.VietnamTourism.byId.get(catalogId);
  if(!raw)return;
  const A=window.CentralArch,yaw=.67800624,source='https://daklakvrtour.com/den-tho-luong-van-chanh.html';
  const tour='https://daklakvrtour.com/tour/93/index.html';
  // The OSM point sits in the eastern pond. The rectified aerial places the main
  // hall 85 m NW of it. +z follows the processional axis towards the village.
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=109.23695,13.09170&level=19
  // Tour 93, nodes 12/17 (root-wrapped shrine wall and main hall), 13/14 (old
  // enclosure), 16 (modern gate), 18 (aerial). Node 15 shows the SEPARATE grave.
  // Dimensions of the original masonry and enclosure reported in the field:
  // https://phuyen.baodaklak.vn/94/271866/ban-doanh-lang-phung-cac-ngu-dai-son-va-cac-mieu-tho-luong-van-chanh.html
  // https://www.vietnamplus.vn/phu-yen-cay-bo-de-200-tuoi-duoc-cong-nhan-la-cay-di-san-post277492.vnp
  const ochre=0xd9a04e,cream=0xd8c49b,tile=0xb45a39,hip=0xdbab72,red=0xa03924,wood=0x69392a;
  const coping=0xa39677,stone=0x89816b,blue=0x408da4;
  function ring(T,k,x,y,z,r,t,ink){
    const g=new T.TorusGeometry(r,t,6,32);k.stamp(g,ink,x,y,z);g.dispose();
  }
  function angleGrille(T,k,x){
    const r=.78,z=4.14;
    const g=new T.CircleGeometry(r,32);k.stamp(g,0x48372b,x,2.95,z);g.dispose();
    ring(T,k,x,2.95,z+.035,r,.067,ochre);
    for(let i=-2;i<=2;i++){
      const a=i*.24,l=2*Math.sqrt(r*r-a*a);
      k.box(wood,x+a,2.95,z+.060,.036,l,.045);k.box(wood,x,2.95+a,z+.060,l,.036,.045);
    }
  }
  function hall(T,k){
    k.box(0xb56547,0,.53,-.35,21.75,1.06,12.9);
    k.box(ochre,0,3.05,-1.19,20.75,4.12,10.6);
    for(const x of [-5.50,0,5.50]){
      k.box(0x452b21,x,2.70,4.15,3.88,3.34,.21);
      for(let i=0;i<4;i++){
        const dx=x+(i-1.5)*.91;
        k.box(i%2===0?wood:0x75422d,dx,2.68,4.27,.88,3.15,.12);
        for(const h of [1.40,2.22,3.95])k.box(0x503021,dx,h,4.34,.80,.045,.032);
        for(const h of [1.82,3.1])k.box(0x865239,dx,h,4.34,.65,h<2?.56:1.22,.036);
      }
      for(const s of [-1,1])k.box(red,x+s*2,2.75,4.26,.15,3.54,.22);
      k.box(red,x,4.49,4.26,4.12,.24,.24);
      k.box(x===0?0xe2b974:red,x,4.92,5.46,4.82,.68,.18);
    }
    k.sign('ĐỀN THỜ LƯƠNG VĂN CHÁNH',0,4.93,5.565,4.58,.49,true,'#833b24');
    for(const x of [-9.05,9.05])angleGrille(T,k,x);
    for(const x of [-10.15,-8.12,-2.73,2.73,8.12,10.15]){
      k.tapered(0x807971,x,1.21,5.75,.31,.28,.30,1,12);
      k.tapered(Math.abs(x)<3?0xd89039:0xc49a64,x,2.96,5.75,.19,.16,3.35,1,12);
      k.tapered(cream,x,4.61,5.75,.24,.30,.23,1,12);
      if(Math.abs(x)<3){
        const pts=Array.from({length:25},(_,i)=>new T.Vector3(x+.235*Math.sin(i*.59),1.43+i*.127,5.75+.235*Math.cos(i*.59)));
        const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts),26,.086,6,false);
        k.stamp(g,0xdb9e41,0,0,0);g.dispose();
      }
    }
    for(let i=0;i<6;i++){
      const top=.19+i*.168;
      k.box(0xae684c,0,top*.5,8.52-i*.39,21.75,top,.408);
      k.box(0xd29369,0,top+.01,8.70-i*.39,21.76,.035,.06);
    }
    A.curvedRoof(T,k,0,5.38,-.14,24.4,14.90,1.94,tile,hip,cream,.31);
    k.box(ochre,0,6.84,-.90,16.85,1.94,7.30);
    for(let i=-5;i<=5;i++)k.box(0x714332,i*1.42,7.25,2.77,1.12,.61,.08);
    A.curvedRoof(T,k,0,7.76,-.90,19.55,9.50,2.11,tile,hip,cream,.32,{dragons:true,goldColor:hip});
  }
  function annex(T,k,w,d,tint){
    k.box(0xab9b80,0,.22,0,w,.44,d);
    k.box(0xc5ab87,0,1.78,-.41,w-.6,2.95,d-1.28);
    for(let i=-1;i<=1;i++){
      k.box(wood,i*w*.31,1.57,d*.5-.99,1.3,2.47,.17);
      k.box(cream,i*w*.42,1.92,d*.49,.25,3.3,.24);
    }
    A.gabledRoof(T,k,0,3.48,0,w+.64,d+.8,2.35,tint,0xa77d69,{alongX:true,overhang:.42});
  }
  function arch(k,x,w,clear,h,top,d,tint){
    const r=clear/2,spring=h-r,p=[[-w/2,0],[-r,0],[-r,spring]];
    for(let i=0;i<=16;i++){const a=Math.PI-i*Math.PI/16;p.push([r*Math.cos(a),spring+r*Math.sin(a)]);}
    p.push([r,0],[w/2,0],[w/2,top],[-w/2,top]);k.outline(p,tint,x,0,-d/2,d);
  }
  function oldGate(T,k){
    arch(k,0,3.62,1.6,1.88,2.69,.82,stone);
    k.box(0x786f59,0,2.72,0,3.75,.22,.98);
    k.box(0x8f886e,0,3.10,0,3.55,.12,.83);
    for(let i=-4;i<=4;i++)k.box(coping,i*.387,2.94,0,.215,.34,.82);
    k.place(0,0,0,()=>{
      // Small daylight opening on the second storey, above the pierced rail.
      const w=2.78,r=.47,p=[[-w/2,0],[-r,0],[-r,.24]];
      for(let i=0;i<=12;i++){const a=Math.PI-i*Math.PI/12;p.push([r*Math.cos(a),.24+r*Math.sin(a)]);}
      p.push([r,0],[w/2,0],[w/2,1.02],[-w/2,1.02]);k.outline(p,0x837c62,0,3.16,-.43,.86);
    });
    A.curvedRoof(T,k,0,4.20,0,3.46,1.61,.32,0x75745a,coping,coping,.34);
    for(const side of [-1,1]){
      arch(k,side*5.90,2.41,1.33,1.55,1.97,.55,0x93866a);
      A.curvedRoof(T,k,side*5.90,1.99,0,2.85,.95,.19,0x837d60,coping,coping,.35);
      for(const [dx,w] of [[3.27,3.02],[8.00,1.82]]){
        k.box(0x8c866c,side*dx,.58,0,w,1.16,.60);
        k.box(coping,side*dx,1.19,0,w+.14,.12,.70);
      }
    }
    k.box(0x776e59,0,.93,-4.21,2.0,1.63,.90);
    k.box(0x9c9276,0,1.78,-4.21,2.10,.19,.98);
  }
  function processionalGate(T,k){
    for(const s of [-1,1])for(const [x,w,h] of [[2.97,.82,4.56],[6.45,.64,3.45]]){
      k.box(ochre,s*x,h/2,0,w,h,.81);k.box(cream,s*x,h*.48,.422,w*.64,h*.78,.042);
      k.box(0xc1ab81,s*x,.20,0,w+.14,.40,.97);k.box(cream,s*x,h-.14,0,w+.21,.27,.99);
    }
    k.box(ochre,0,4.44,0,6.6,.56,1.09);
    A.curvedRoof(T,k,0,4.75,0,8.96,3.66,1.02,tile,cream,cream,.32,{dragons:true,goldColor:hip});
    for(const s of [-1,1]){
      k.box(ochre,s*4.75,3.35,0,3.7,.44,.86);
      A.curvedRoof(T,k,s*4.95,3.61,0,4.34,2.81,.65,tile,cream,cream,.29);
      for(let i=0;i<8;i++){
        const x=s*(7.25+i*1.37);
        k.box(0xa99574,x,.52,0,1.39,1.04,.42);
        k.box(cream,x,1.62,0,1.39,.17,.45);
        for(const dx of [-.43,0,.43])k.box(cream,x+dx,1.32,0,.19,.55,.35);
        if(i%3===2){k.box(cream,x,1.03,0,.48,2.06,.55);k.tapered(tile,x,2.14,0,.45,.075,.25,1,4);}
      }
    }
    for(const [x,w] of [[0,5.05],[-4.78,2.65],[4.78,2.65]]){
      k.box(blue,x,.25,0,w,.4,.08);
      for(const y of [.52,1.48,1.79])k.box(blue,x,y,0,w,.055,.075);
      const count=Math.round(w/.205);
      for(let i=0;i<=count;i++)k.box(blue,x+w*(i/count-.5),1.03,0,.034,1.63,.06);
      for(const s of [-1,1])ring(T,k,x+s*w*.245,1.16,.053,w*.090,.03,blue);
    }
  }
  function fig(T,k){
    // Three passages in the earlier shrine wall remain visible below the
    // fused aerial roots. The small memorial plaque is beside the right stem.
    for(const x of [-1.93,0,1.93])arch(k,x,1.95,1.12,1.83,3.20,.68,0x86775d);
    const stems=[[-2.88,-.25,-2.15,.42],[-1.05,.03,-.50,-.35],[.98,.06,.12,.48],[2.85,-.1,2.10,-.43]];
    for(const [i,[foot,z,crown,lean]] of stems.entries()){
      const bark=A.carving(T,k,[0x756d53,0x70664f,0x81745a,0x746a51][i],0,0,0,1);
      bark.sweep([[foot,0,z,.67,.97],[foot*.98,.62,z,.43,.72],[foot,1.65,z+.09,.35,.62],
        [foot*.86,2.93,z+.05,.49,.68],[crown,4.33,z+lean,.70,.73],[crown*1.38,6.4,z+lean*2,.62,.55],
        [crown*2.05,9.3,z+lean*3,.38,.37],[crown*2.40,11.9,z+lean*3.4,.18,.21]],.072,14);
      for(let j=0;j<5;j++){
        const a=j*1.32+i*.65,du=Math.cos(a),dv=Math.sin(a);
        const rootZ=z+.52*dv;
        bark.sweep([[foot+du*.66,.06,z+dv*1.87,.27,.30],[foot+du*.40,.46,z+dv*.99,.20,.27],
          [foot+du*.28,1.35,rootZ,.10,.16],[foot+du*.24,2.22,rootZ+.13,.12,.15],
          [foot*.86+.28*du,2.98,rootZ,.18,.20],[crown+.40*du,4.56,z+lean+.43*dv,.27,.30],
          [crown*1.41+.25*du,6.45,z+lean*2,.17,.18]],.08,8);
      }
      bark.finish();
    }
    // Buttresses wander across the masonry, meeting in the upper trunk.
    // Leave daylight through the openings and stagger the root crossovers.
    const folded=A.carving(T,k,0x786f54,0,0,0,1);
    for(const [i,x] of [-1.93,0,1.93].entries()){
      const s=i===1?-1:1;
      folded.sweep([[x-s*.96,.09,1.03,.29,.19],[x-s*.81,.73,.58,.21,.15],
        [x-s*.82,1.52,.57,.15,.18],[x-s*.55,2.22,.49,.16,.19],
        [x+s*.09,2.66+i*.09,.55,.27,.21],[x+s*.59,3.39,.49,.33,.26],
        [x+s*.82,4.54,.46,.31,.31],[x+s*1.05,5.40,.27,.18,.19]],.105,12);
      folded.sweep([[x+s*.96,.08,.82,.22,.20],[x+s*.85,.63,.78,.17,.19],
        [x+s*.92,1.62,.61,.16,.14],[x+s*.72,2.40,.60,.14,.16],
        [x+s*.46,3.20,.61,.25,.22],[x+s*.20,3.71,.57,.19,.20],
        [x-s*.52,4.24,.28,.15,.15]],.12,10);
    }
    for(const side of [-1,1]){
      folded.sweep([[side*.82,1.8,0,.26,.38],[side*.65,3.5,.56,.39,.38],[side*.21,4.6,.51,.41,.47],
        [0,6.7,.35,.62,.66],[side*.37,8.5,.64,.50,.44],[side*2.3,10.6,1.01,.41,.37],[side*4.8,12,1.49,.19,.17]],.09,12);
    }
    folded.finish();
    k.box(0x54584c,3.50,.31,1.24,1.18,.62,.80);
    k.outline([[-.42,0],[.42,0],[.42,1.20],[.30,1.34],[.0,1.40],[-.30,1.34],[-.42,1.20]],
      0x44493e,3.50,.62,1.15,.18);
    k.sign('CÂY DI SẢN VIỆT NAM',3.50,1.36,1.345,.78,.18,true,'#d1af62');
    k.sign('Cây Bồ Đề',3.50,1.09,1.345,.60,.15,true,'#d1af62');
  }
  function build(T,k){
    k.palette({plaster:[ochre,cream],timber:[wood,red],stone:[stone,coping],tile});
    const f=createTempleFoundations(T,k);
    f.building(0,.95,0,21.8,15.7,()=>k.place(0,-.95,0,()=>hall(T,k)));
    f.building(3.4,-17.8,0,14.3,8.6,()=>annex(T,k,14.3,8.6,0xa45e4d));
    f.building(-25,92.9,Math.PI/2,18.3,11.2,()=>annex(T,k,18.3,11.2,0xb46a5f));
    f.building(46,35.5,-.28,21.6,10.3,()=>annex(T,k,21.6,10.3,0xb56354));
    f.building(.1,23,0,8.1,4.9,()=>fig(T,k));
    f.building(.8,44.6,0,17.7,1.05,()=>oldGate(T,k));
    f.building(1.4,108.3,0,35.7,1.12,()=>processionalGate(T,k));
    // The DEM samples both crowns and open ground. Level each terrace across
    // the axis and grade between terraces. Feather their shoulders into the DEM.
    function court(x,z,w,d,colour,tiled=true){
      const ns=Math.ceil(d/2.8),nw=Math.ceil(w/3.2),verts=[],tex=[],idx=[];
      for(let j=0;j<=ns;j++)for(let i=0;i<=nw;i++){
        const u=x+(i/nw-.5)*w,v=z+(j/ns-.5)*d;verts.push(u,0,v);tex.push(u,v);
        if(i&&j){const a=j*(nw+1)+i;idx.push(a-nw-2,a-1,a,a-nw-2,a,a-nw-1);}
      }
      const geo=new T.BufferGeometry(),pos=new T.Float32BufferAttribute(verts,3);
      geo.setAttribute('position',pos);geo.setAttribute('uv',new T.Float32BufferAttribute(tex,2));geo.setIndex(idx);
      geo.computeVertexNormals();
      const mat=new T.MeshStandardMaterial({color:colour,roughness:.95,side:T.DoubleSide});
      mat.onBeforeCompile=s=>{
        s.vertexShader='varying vec2 paving;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\npaving=uv;');
        s.fragmentShader='varying vec2 paving;\n'+s.fragmentShader.replace('#include <color_fragment>',tiled?`#include <color_fragment>
          {vec2 p=paving/.58;vec2 a=fwidth(p);vec2 f=min(fract(p),1.-fract(p));
          vec2 tileFace=smoothstep(vec2(.016)-a*.4,vec2(.016)+a*.4,f);
          float variation=fract(sin(dot(floor(p),vec2(31.44,73.4)))*8553.5);
          diffuseColor.rgb*=mix(.71,.94+.09*variation,tileFace.x*tileFace.y);}`:`#include <color_fragment>
          {float fleck=stoneNoise(paving*6.)*.25+stoneNoise(paving*.79)*.43+stoneNoise(paving*.13)*.32;
          diffuseColor.rgb*=mix(vec3(.48,.53,.44),vec3(1.18,1.12,.95),fleck);}`);
      };
      mat.customProgramCacheKey=()=>tiled?'luong-paving':'luong-lawn';
      const mesh=new T.Mesh(geo,mat);mesh.receiveShadow=true;mesh.userData.shoreCover=true;k.group.add(mesh);
      return ground=>{let changed=false;
        for(let i=0;i<pos.count;i++){const y=ground(pos.getX(i),pos.getZ(i))+(tiled?.11:.028);
          if(Math.abs(y-pos.getY(i))>.001){pos.setY(i,y);changed=true;}}
        if(changed||!geo.boundingSphere){pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();}
      };
    }
    const paving=[court(0,47.5,62,139,0x566747,false),court(0,20.6,31.3,24.4,0xb77e68),court(.8,53,3.4,40.4,0xa99a82),
      court(.8,82.45,3.4,18.5,0xad9e84),court(1.4,103.9,20.2,24.4,0xa79b87)];
    for(const x of [-8.45,10.28])f.building(x,81.2,0,15.25,16.1,()=>{
      k.deck(0x879478,0,.205,0,14.91,.11,15.76);
      for(const s of [-1,1]){
        k.box(0xa99b82,s*7.54,.30,0,.26,.58,16.09);k.box(0xa99b82,0,.30,s*7.93,15.29,.58,.24);
        for(let i=-1;i<=1;i+=2)k.box(0x9e937e,s*7.54,.48,i*7.93,.49,.92,.49);
      }
    });
    // The custom roots carry the individual crowns. Surrounding garden trees
    // use separate ground anchors at the observed borders and alongside the walk.
    for(const x of [-9.0,-2.45,2.45,9.0])f.building(x,9.3,0,.72,.72,()=>{
      k.tapered(0x8a735c,0,.32,0,.27,.43,.60,1,10);
      k.tapered(0xb38862,0,.63,0,.45,.44,.13,1,10);
    });
    const palms=[];
    for(const [x,z,h] of [[-6.6,53,11.3],[8.7,48,11.6],[13.4,61,10.3],[-12.8,68,13.3],[-18.8,85,9.9],[20.7,86,10.9]]){
      A.trees(T,k,[{x,z,h,width:h*.43,kind:'palm'}]);palms.push(k.group.children.at(-1));
    }
    const stems=[[-3.4,7.2,22.2,10.8,12.1,.8],[1.5,7.5,23.6,13.2,13.8,2.7],
      [4.35,6.4,22.5,10.1,11.3,4.8],[-.6,5.0,26.1,9.5,11.2,1.9],
      ...[-9,-2.45,2.45,9].map((x,i)=>[x,.63,9.3,1.15,1.45,i*1.8]),
      ...[[-14,33,8.4,10.6],[-12,46,8.6,12],[14,41,7.6,10],[18,53,8.1,11],[-17,64,8.9,11.8],
        [24,72,7.6,10.4],[-22,75,7.7,11.2],[22,94,6.2,8.4],[-18,4,8.7,12.4],
        [18,-11,8.3,11.4],[-10,-20,7.5,12],[28,37,7.6,10.2],
        [-6.6,46.2,3.1,1.8],[9,43.1,3,1.9],[-7.7,60.3,4.1,3.5],[10.4,64.7,4.4,3.7],
        [-12.8,68.6,5.6,3.9],[13.8,71.6,4.4,3.3]].map(([x,z,w,h],i)=>[x,0,z,w,h,i*1.8])];
    const first=k.group.children.length;createTreeModels(T).grove(k.group,stems);
    const groups=k.group.children.slice(first).map(m=>[m,m.instanceMatrix.array.slice()]);
    const fit=k.group.userData.fitGround;
    let treated=false;
    k.group.userData.fitGround=ground=>{
      if(!treated){
        const material=k.group.children.at(-1).material,previous=material.onBeforeCompile,cache=material.customProgramCacheKey();
        material.onBeforeCompile=function(shader,renderer){
          previous.call(this,shader,renderer);
          shader.fragmentShader=shader.fragmentShader.replace('#include <metalnessmap_fragment>',`#include <metalnessmap_fragment>
            if(abs(finishPoint.z-44.55)<1.1 && abs(finishPoint.x-.8)<9.1){
              float patina=stoneNoise(finishPoint.xy*1.7)*.60+stoneNoise(finishPoint.xy*5.5)*.40;
              diffuseColor.rgb*=mix(vec3(.38,.42,.31),vec3(1.09,1.04,.99),smoothstep(.32,.66,patina));
            }`);
        };
        material.customProgramCacheKey=()=>cache+'-luong-gate';material.needsUpdate=true;treated=true;
      }
      const tiers=[[-22,-22,0],[-7,0,12],[7,0,12],[29,27,15.8],[45,43,10],[66,66,6],[73,82,18.1],
        [89.5,82,18.1],[104,107,18.4],[110,107,18.4],[117,117,0]].map(([at,z,r])=>
        [at,Math.max(...[-1,0,1].flatMap(t=>[-2,0,2].map(d=>ground(t*r,z+d))))]);
      function surface(x,z){
        if(z<=tiers[0][0]||z>=tiers.at(-1)[0]||Math.abs(x)>=31)return ground(x,z);
        const i=tiers.findIndex(a=>a[0]>=z),[az,a]=tiers[i-1],[bz,b]=tiers[i],t=(z-az)/(bz-az);
        const flat=a+(b-a)*t,edge=Math.max(0,Math.min(1,(31-Math.abs(x))/12));
        return ground(x,z)+Math.max(0,flat-ground(x,z))*edge;
      }
      fit(surface);for(const grade of paving)grade(surface);
      for(const [m,rest] of groups){const a=m.instanceMatrix.array;for(let i=0;i<m.count;i++){
        const j=16*i+12;a[j+1]=rest[j+1]+(rest[j+1]>4?surface(.1,23):surface(rest[j],rest[j+2]));
      }m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();}
      for(const p of palms)p.position.y=surface(p.position.x,p.position.z);
    };
  }
  function shot(name,u,v,eyeU,eyeV,h,up,fov){
    const range=Math.hypot(eyeU-u,eyeV-v),c=Math.cos(yaw),s=Math.sin(yaw);
    return {name,offset:[u*c+v*s,-u*s+v*c],viewBase:'monument',height:h/.46,
      viewRadius:Math.hypot(range,up),viewAngle:yaw+Math.atan2(eyeU-u,eyeV-v),viewElevation:Math.atan2(up,range),viewFov:fov,photo:tour};
  }
  const boundary=[[-16,-25],[20,-24],[24,22],[60,23],[60,47],[25,56],[25,111],[-35,113],[-35,82],[-20,65]];
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Đền thờ Lương Văn Chánh',locality:'Long Phụng, Phú Hòa 2',
    lon:109.23665464,lat:13.09203725,yaw,width:31,depth:32,gardenRadius:46,boundary,
    reserve:(x,z,p=0)=>z>=-24-p&&z<=113+p&&x>=((z>80)?-35:-18)-p&&x<=((z>22&&z<48)?60:24)+p,
    solids:[[0,0,10.9,6.3],[3.4,-17.8,7.1,4.3]],source,photo:tour,map:'https://www.openstreetmap.org/node/12856400201',
    start:[109.2373975,13.0911589],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    arrivalNote:'Dừng xe trên đường làng phía đông nam, cách cổng ngoài khoảng 18 m. Đi bộ dọc lối giữa hai hồ rồi qua cổng cổ để vào sân đền.',
    description:'Tại thôn Long Phụng, rễ cây bồ đề ôm bức tường ba cửa của ngôi miếu cũ. Phía sau tán cây là chính điện thờ Lương Văn Chánh. Cảnh mô phỏng theo ảnh toàn cảnh 2024–2025, trước dự án chỉnh trang khởi công năm 2026. Kích thước mái, cành và vị trí dưới tán cây được ước lượng từ ảnh. Khu mộ cách đền khoảng 500 m.',
    views:[shot('Mặt tiền chính điện từ sân gạch',0,3,-10.9,26,4.75,1.4,55),
      shot('Ba cửa trong bộ rễ bồ đề',.4,23.2,4.7,32.9,4.17,.85,51),
      shot('Cổng cổ và bình phong',.8,44.55,3.45,59.9,3.95,.33,49),
      shot('Tam quan và đôi hồ nhìn từ ngoài',1.4,97.8,10.7,127,3.25,11.8,57)],build});
})();
