const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='chua-thanh-luong',catalogId='osm-node-6052212185',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(s=>s.id===catalogId);
  if(!raw)return;
  const lon=109.2957709,lat=13.1816944;
  const tour='https://daklakvrtour.com/tour/55/index.html',source='https://lyluanphebinh.vn/tin-tuc/nghien-cuu-trao-doi/2565/kien-truc-dieu-khac-doc-dao-cua-chua-thanh-luong-o-tuy-hoa-phu-yen';
  // East/south metres from the centre of the coral hall, OSM w903827683.
  // Its facade looks SW over Long Thủy. The smaller green-roofed shrine
  // (w903834500) faces SE toward the position of tour camera node2.
  // Pool outlines w903834501, w903834502. The survey article distinguishes
  // the wooden figure inside the shrine from the concrete bust in Long Ẩn.
  // Tour 55: node5 (drone, 2024-09-17), node13 (front of main hall), nodes
  // 4/9 (bust, right hand, stepping stones), node2 (shrine) and node12.
  const longThuy=[[-48.2,-9.9],[-46.4,-8.9],[-38.8,-.1],[-38,2.1],[-38.5,6.9],[-35.2,15.1],[-24.4,26.5],[-17.6,33.3],[-13.9,37.2],[-11.9,41.9],[-11.6,43.9],[-12,45.2],[-12.6,46.3],[-15.4,48.6],[-18.4,50],[-21.7,50.9],[-24.3,50],[-27.2,48.3],[-28.6,46.6],[-31.3,41.7],[-38.1,29.4],[-44.8,17.3],[-46.8,15.5],[-54.9,12.8],[-58,9.9],[-59.8,7.3],[-61.5,3.5],[-60.5,-1.1],[-57.1,-4.1],[-52.1,-8.4]];
  const longAn=[[-55.3,-13.1],[-65.1,-4.1],[-79.3,-15.1],[-71.3,-26.1]];
  const boundary=[[-82,-16],[-72,-29],[-53,-22],[-41,-32],[-27,-27],[-21,-17],[-1.9,-18.6],
    [18.6,-2.5],[3.9,18.2],[12,22.7],[-1,35],[-10,50],[-22,53],[-35,38],[-46,18],[-62,12],[-67,-2]];
  function reserved(x,z,pad=0){
    let inside=false;
    for(let i=0,j=boundary.length-1;i<boundary.length;j=i++){
      const [a,b]=boundary[i],[c,d]=boundary[j];
      if((b>z)!==(d>z)&&x<a+(c-a)*(z-b)/(d-b))inside=!inside;
      const dx=c-a,dz=d-b,t=Math.min(1,Math.max(0,((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz)));
      if((x-a-t*dx)**2+(z-b-t*dz)**2<pad*pad)return true;
    }
    return inside;
  }
  const hall=[0,0,-.662],shrine=[-36.85,-20.3,.935],figure=[-70.6,-17.4,.91];
  const warm=0x998674,shade=0x796b5f,cream=0xb8a58b,wood=0x65463b,door=0x47382f,gold=0xc39747;
  const patina=0x829398,pale=0x9aa9a8,deep=0x697d84;
  function relative([x,z,a],u,v){return [x+Math.cos(a)*u+Math.sin(a)*v,z-Math.sin(a)*u+Math.cos(a)*v];}
  function siteView(name,where,u,v,eyeX,eyeZ,focus,up,fov,photo){
    const at=relative(where,u,v),eye=relative(where,eyeX,eyeZ);
    return {name,offset:at,viewAngle:Math.atan2(eye[0]-at[0],eye[1]-at[1]),
      viewRadius:Math.hypot(eyeX-u,eyeZ-v,up),viewElevation:Math.atan2(up,Math.hypot(eyeX-u,eyeZ-v)),
      viewBase:'monument',height:focus/.46,viewFov:fov,photo:tour+'#node'+photo};
  }
  const views=[siteView('Quan Âm Nam Hải giữa hồ Long Ẩn',figure,0,-.2,2.4,15.6,2.75,1.00,54,4),
    siteView('Mái san hô nhìn từ sân chính điện',hall,0,1.5,7.4,40.5,4.2,2.60,56,13),
    siteView('Bên bậc điện Quan Âm Linh Ứng',shrine,0,.6,-3.9,25.2,4.35,1.70,58,2),
    siteView('Hồ Long Thủy và thủy tạ',[0,0,0],-27,22,-9,69,2.5,15.1,59,5)];
  function curve(T,k,points,colour,radius,res=10){
    const line=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const g=new T.TubeGeometry(line,res,radius,7,false);k.stamp(g,colour,0,0,0);g.dispose();
  }
  function slab(T,k,points,colour,base,thickness){
    const shape=new T.Shape(points.map(([x,z])=>new T.Vector2(x,-z)));
    const g=new T.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false});
    g.rotateX(-Math.PI/2);k.stamp(g,colour,0,base,0);g.dispose();
  }
  function ellipsoid(k,colour,x,y,z,w,h,d,rx=0,rz=0){
    k.stamp(k.ball,colour,x,y,z,w,h,d,0,rx,rz);
  }
  // Elliptical sections form an uninterrupted patinated surface inside the veil.
  function bust(T,k){
    const sphere=new T.SphereGeometry(.5,24,19);
    k={...k,ball:sphere};
    const rows=[[1.22,.12,.29],[1.38,.44,.55],[1.67,.70,.79],[2.08,.92,.92],[2.55,1.11,1.00],
      [2.96,1.22,1.05],[3.40,1.25,1.065],[3.87,1.23,1.07],[4.34,1.13,.99],[4.66,.89,.81],[4.85,.32,.34]];
    const v=[],idx=[],cols=48;
    for(const [y,rx,rz] of rows){
      for(let i=0;i<cols;i++){
        const a=i*2*Math.PI/cols;
        v.push(rx*Math.sin(a),y,rz*Math.cos(a));
      }
    }
    for(let j=0;j<rows.length-1;j++)for(let i=0;i<cols;i++){const a=j*cols+i,b=j*cols+(i+1)%cols;
      idx.push(a,b,a+cols,b,b+cols,a+cols);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();k.stamp(g,patina,0,0,0);g.dispose();
    ellipsoid(k,patina,0,.90,-.03,1.43,2.03,1.47);
    ellipsoid(k,patina,0,.01,-.16,5.65,1.76,2.63);
    // Gathered hair rises above the forehead. The veil folds back round the
    // crown, leaving its front open; its side panels fall to the shoulders.
    ellipsoid(k,deep,0,4.23,-.03,2.36,1.20,2.09);
    for(let i=-10;i<=10;i++){
      const t=i/10,x=t*1.12,z=.98*Math.sqrt(Math.max(.05,1-t*t));
      curve(T,k,[[x,4.06+.23*(1-t*t),z],[x*.91,4.53,z+.017],[x*.72,4.78,z*.73],[x*.50,4.93,z*.49]],patina,.048);
    }
    ellipsoid(k,deep,0,4.97,-.13,1.24,1.17,1.13);
    const veil=[],vi=[],steps=38;
    const shape=[[.14,2.88,1.16,-.31],[.58,2.10,1.05,-.37],[1.05,1.65,1.02,-.37],[1.88,1.42,.98,-.31],[3.12,1.35,1.14,-.19],
      [4.24,1.31,1.17,-.18],[4.84,1.13,.97,-.25],[5.32,.81,.72,-.32],[5.94,.61,.51,-.36],[6.53,.66,.53,-.35],[6.87,.54,.46,-.28]];
    for(let j=0;j<shape.length;j++){
      const [y,w,d,back]=shape[j];
      for(let i=0;i<=steps;i++){
        const a=.54+(2*Math.PI-1.08)*i/steps,fold=1+.035*Math.cos(a*9+j*.30);
        veil.push(w*Math.sin(a)*fold,y+(j===shape.length-1?.15*Math.cos(a):0),back+d*Math.cos(a)*fold);
      }
      if(j)for(let i=0;i<steps;i++){const a=(j-1)*(steps+1)+i;vi.push(a,a+1,a+steps+1,a+1,a+steps+2,a+steps+1);}
    }
    const cloth=new T.BufferGeometry();cloth.setAttribute('position',new T.Float32BufferAttribute(veil,3));cloth.setIndex(vi);cloth.computeVertexNormals();
    k.stamp(cloth,patina,0,0,0);k.stamp(cloth,pale,0,0,-.012,-.995,.998,.995);cloth.dispose();
    ellipsoid(k,patina,0,6.84,-.24,1.17,.34,1.03,-.19);
    ellipsoid(k,deep,0,5.22,.29,.50,.68,.21);
    ellipsoid(k,pale,0,5.36,.408,.20,.26,.11);
    ellipsoid(k,patina,0,5.12,.415,.34,.25,.13);
    for(const sign of [-1,1]){
      curve(T,k,shape.map(([y,w,d,b])=>[sign*w*Math.sin(.54),y,b+d*Math.cos(.54)]),pale,.075,24);
      for(let j=0;j<3;j++)curve(T,k,[[sign*(.66+j*.24),1.0,.68],[sign*(.78+j*.36),.51,.94],[sign*(1.08+j*.42),.15,1.13]],pale,.037);
    }
    for(let i=0;i<16;i++){const a=i*Math.PI/15;
      ellipsoid(k,pale,.83*Math.cos(a),.76-.26*Math.sin(a),.44+.40*Math.sin(a),.105,.11,.10);}
    // The exposed right hand is separate, palm toward the stepping stones.
    // Three upright fingers and thumb meeting the bent finger are visible in
    // node4. Joint spacing and individual widths are approximate.
    k.place(-3.77,2.88,.08,()=>{
      ellipsoid(k,patina,0,.54,0,1.14,1.53,.57);
      function finger(p,r){
        curve(T,k,p,patina,r,14);
        const [x,y,z]=p.at(-1);ellipsoid(k,patina,x,y,z,r*1.96,r*2,r*1.95);
      }
      finger([[-.40,.77,-.01],[-.46,1.33,-.026],[-.46,1.82,-.06],[-.47,2.18,-.04]],.128);
      finger([[.05,.99,-.06],[.03,1.56,-.05],[-.03,2.07,-.07],[-.07,2.44,-.08]],.142);
      finger([[.37,.91,-.07],[.34,1.49,-.09],[.29,2.03,-.11],[.24,2.34,-.13]],.13);
      finger([[-.20,.93,.12],[-.18,1.30,.15],[-.16,1.47,.22],[-.04,1.44,.27]],.144);
      finger([[.34,.31,.13],[.39,.68,.24],[.23,1.03,.37],[.07,1.27,.34],[-.04,1.41,.29]],.158);
      curve(T,k,[[-.46,.53,.22],[-.15,.65,.31],[.08,.83,.31]],deep,.017);
    });
    sphere.dispose();
  }
  function build(T,k){
    const A=window.CentralArch,fixtures=[];
    function zone(x,z,a,fn,groundRule){
      const first=k.vertexCount(),child=k.group.children.length;k.place(x,z,a,fn);
      const zone={x,z,first,end:k.vertexCount(),children:k.group.children.slice(child),groundRule};
      zone.rest=zone.children.map(o=>o.position.y);fixtures.push(zone);return zone;
    }
    function pond(poly){
      slab(T,k,poly,0x827e65,-.89,.88);
      const shape=new T.Shape(poly.map(([x,z])=>new T.Vector2(x,-z))),geo=new T.ShapeGeometry(shape);
      geo.rotateX(-Math.PI/2);
      const mirror=poly===longAn,material=new T.MeshPhongMaterial({color:mirror?0x607468:0x697b64,specular:0xaaa991,shininess:67,side:T.DoubleSide});
      material.onBeforeCompile=s=>{
        s.vertexShader='varying vec2 pondUv;varying vec3 pondEye;\n'+s.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\npondUv=position.xz;pondEye=cameraPosition-modelMatrix[3].xyz;');
        s.fragmentShader=`varying vec2 pondUv; varying vec3 pondEye;
          float reflectionShape(vec3 p,vec3 d,vec3 centre,vec3 radius){
            vec3 v=(p-centre)/radius;d/=radius;
            float t=max(0.,-dot(d,v)/dot(d,d));return 1.-smoothstep(.78,1.07,length(v+t*d));
          }\n`+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          float p=dot(pondUv,vec2(1.4,6.9))+sin(pondUv.x*1.23+pondUv.y*.43)*2.8;
          float w=sin(p+sin(p*.24+pondUv.x*.62))*sin(p*.43+pondUv.x*1.4);
          float q=sin(dot(pondUv,vec2(-4.6,1.38))+w);
          diffuseColor.rgb*=.94+.1*w*(1.-smoothstep(.4,2.,fwidth(p)));
        `+(mirror?`
          vec3 pos=vec3(pondUv.x,0.,pondUv.y),ray=reflect(normalize(pos-pondEye),normalize(vec3(.016*w,1.,.022*q)));
          float body=reflectionShape(pos,ray,vec3(-70.6,.29,-17.4),vec3(2.4,.87,2.13));
          body=max(body,reflectionShape(pos,ray,vec3(-70.6,2.63,-17.4),vec3(1.22,2.47,1.30)));
          body=max(body,reflectionShape(pos,ray,vec3(-70.78,5.29,-17.55),vec3(.74,1.67,.86)));
          body=max(body,reflectionShape(pos,ray,vec3(-70.65,1.23,-12.6),vec3(.51,1.2,.49)));
          diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.23,.295,.29),body*(.36+.1*w));
        `:''));
      };
      material.customProgramCacheKey=()=>mirror?'long-an-still-water':'long-thuy-still-water';
      const surface=new T.Mesh(geo,material);surface.position.y=.022;surface.receiveShadow=true;k.group.add(surface);
      for(let i=0;i<poly.length;i++){
        const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dz=b[1]-a[1];
        k.box(0x999889,(a[0]+b[0])/2,.06,(a[1]+b[1])/2,.24,.29,Math.hypot(dx,dz)+.074,Math.atan2(dx,dz));
      }
    }
    function waterLevel(poly,ground){
      return Math.max(...poly.map(([x,z])=>ground(x,z)))+.19;
    }
    const anLevel=g=>waterLevel(longAn,g),thuyLevel=g=>waterLevel(longThuy,g);
    zone(0,0,0,()=>pond(longThuy),thuyLevel);
    zone(0,0,0,()=>pond(longAn),anLevel);
    zone(...figure,()=>{
      bust(T,k);
      // Two branches of flat, irregular stepping stones lead to the place
      // from which the face is photographed. Leave open water between them.
      const stones=[[1.92,1],[2.14,2],[2.34,3.13],[2.21,4.30],[1.98,5.42],[1.47,6.44],[.61,7.12],[-.43,7.32],
        [-1.54,7.07],[-2.43,6.49],[-3.03,5.67],[-3.40,4.65],[-3.68,3.73],[-.60,8.32],[-.88,9.40]];
      stones.forEach(([x,z],i)=>{
        const pts=Array.from({length:7},(_,j)=>{const a=j*2*Math.PI/7+i*.33,r=.43+.06*Math.sin(i+j*4);return [x+1.22*r*Math.cos(a),z+r*Math.sin(a)];});
        slab(T,k,pts,i%3?0x82796d:0x948676,-.10,.24);
      });
    },anLevel);
    function steps(z,w,count,rise,run,colour){
      for(let i=0;i<count;i++)k.box(colour,0,rise*(i+1)/2,z-i*run,w,rise*(i+1),run+.055);
    }
    zone(...hall,()=>{
      // The original hall uses cut coral on the roof, random pieces with
      // pale mortar on the facade and dark shell inlay on the door leaves.
      k.palette({stone:[warm,shade,cream,0x918473]});
      k.box(shade,0,.48,0,22.95,.96,22.6);
      k.box(warm,0,2.89,-1.48,20.52,4.22,17.88);
      for(const px of [-7.6,0,7.6]){
        k.box(door,px,2.87,7.55,4.25,3.26,.18);
        for(let i=0;i<5;i++)k.box(wood,px-1.75+.875*i,2.88,7.66,.085,3.10,.12);
        for(const y of [1.81,2.98])k.box(wood,px,y,7.67,4.14,.12,.11);
      }
      for(const px of [-9.91,-5.02,0,5.02,9.91]){
        k.stamp(k.round,cream,px,2.88,10.43,.56,4.0,.56);
        k.box(shade,px,1.08,10.43,.77,.22,.77);k.box(warm,px,4.75,10.43,.86,.28,.86);
      }
      for(const side of [-1,1])k.place(side*5.70,0,0,()=>steps(13.55,6.35,6,.157,.40,warm));
      for(const px of [-7.6,-2.55,2.55,7.6]){
        k.stamp(k.round,0xb44931,px,4.42,10.66,.26,.56,.26);
        for(const y of [4.14,4.70])k.stamp(k.round,gold,px,y,10.66,.17,.062,.17);
        k.box(gold,px,4.00,10.66,.033,.20,.033);
      }
      const coralRoof=0x918473;
      A.curvedRoof(T,k,0,4.99,0,24.65,24.35,2.25,coralRoof,cream,shade,.335);
      k.box(shade,0,7.22,-.38,16.4,1.26,14.0);
      for(let x=-7.18;x<=7.19;x+=.89)k.box(cream,x,7.30,6.68,.44,.56,.092);
      A.curvedRoof(T,k,0,7.92,-.40,19.04,16.07,2.52,warm,cream,shade,.372);
      for(const [w,d,y] of [[24.65,24.35,5.06],[19.04,16.07,7.98]])for(const sx of [-1,1])for(const sz of [-1,1]){
        curve(T,k,[[sx*(w*.5-2.15),y+.25,sz*(d*.5-.25)],[sx*(w*.5-.55),y+.65,sz*d*.5],[sx*(w*.5+.18),y+1.21,sz*(d*.5+.15)],[sx*(w*.5+.48),y+1.77,sz*(d*.5+.19)]],cream,.145);
      }
      // The two stone lamp towers and ash censer are visible directly
      // between the side stairs in node13. Their proportions are estimated.
      for(const x of [-2.96,2.96]){
        k.tapered(cream,x,.92,13.33,.39,.27,1.64,1,8);
        for(let j=0;j<3;j++){k.tapered(cream,x,1.74+j*.55,13.33,.41-.055*j,.17,.24,1,8);
          k.tapered(shade,x,1.97+j*.55,13.33,.16,.14,.26,1,8);}
      }
      k.tapered(shade,0,.37,15.1,.54,.39,.69,1,12);
      k.tapered(cream,0,.99,15.1,.56,.88,.70,1,18);
      // A gilded pair faces the pearl in front of the censer in node13.
      const ball=new T.SphereGeometry(.5,16,13),gilded=0xcf9f36;
      const bulb=(x,y,z,w,h,d)=>k.stamp(ball,gilded,x,y,z,w,h,d);
      for(const side of [-1,1])k.place(side*1.17,17.00,side<0?0:Math.PI,()=>{
        bulb(-.07,.83,0,1.19,.63,.50);bulb(.41,1.10,0,.60,.90,.48);
        bulb(.59,1.48,0,.49,.46,.44);bulb(.83,1.40,0,.36,.20,.36);
        curve(T,k,[[-.57,.82,.02],[-.77,1.00,0],[-.79,1.23,-.04],[-.70,1.42,-.06],[-.83,1.53,-.07]],gilded,.082);
        for(const leg of [-.48,.36])for(const flank of [-1,1]){
          const paw=leg>.1&&flank<0;
          curve(T,k,[[leg,.76,.17*flank],[leg+(paw?.26:.05),.48,.19*flank],[leg+(paw?.43:.135),paw?.26:.08,.23*flank]],gilded,.071);
        }
        for(let j=0;j<4;j++)curve(T,k,[[.45,1.31+j*.073,.11],[.22,1.28+j*.117,.10],[-.09+j*.061,1.36+j*.14,.11]],gilded,.040);
      });
      k.stamp(ball,cream,0,.18,17,.36,.36,.36);ball.dispose();
    });
    zone(...shrine,()=>{
      const leaf=0x566951,lime=0x9ca97d,olive=0x768670;
      k.box(0x8a887b,0,.57,-.16,12.66,1.14,12.87);steps(8.02,5.21,6,.182,.33,0xa4a399);
      k.box(0x999783,0,2.48,-.85,10.70,3.10,9.55);
      for(const px of [-3.45,0,3.45])k.box(door,px,2.45,3.97,2.63,2.56,.16);
      for(const px of [-5.15,-1.76,1.76,5.15])k.stamp(k.round,wood,px,2.51,5.77,.34,3.44,.34);
      for(const [y,w,d,h] of [[4.36,14.18,13.57,1.35],[6.38,10.32,9.18,1.36],[8.24,6.6,5.63,1.23]]){
        A.curvedRoof(T,k,0,y,0,w,d,h,leaf,lime,olive,.28);
        if(y<8){
          k.box(lime,0,y+h+.29,-.17,w*.64,.73,d*.58);
          const zz=d*.29-.16;k.box(0x739c99,0,y+h+.31,zz,w*.60,.39,.045);
          for(let x=-w*.255;x<w*.27;x+=.74)k.stamp(k.round,lime,x,y+h+.31,zz+.029,.106,.038,.106,0,Math.PI/2);
        }
        for(const sx of [-1,1])for(const sz of [-1,1]){
          curve(T,k,[[sx*(w*.5-1.14),y+.26,sz*d*.5],[sx*(w*.5-.27),y+.59,sz*d*.5],
            [sx*(w*.5+.16),y+1.0,sz*(d*.5+.10)],[sx*(w*.5+.11),y+1.33,sz*(d*.5+.16)]],lime,.099);
        }
      }
    });
    zone(-17.9,39.7,-.63,()=>{
      const w=5.55,d=5.35;k.box(cream,0,.44,0,w,.81,d);
      for(const x of [-2.37,2.37])for(const z of [-2.21,2.21])k.stamp(k.round,0xa68465,x,2.32,z,.28,3.26,.28);
      for(const x of [-2.36,2.36])k.box(warm,x,1.15,0,.16,.75,d-.26);
      A.curvedRoof(T,k,0,4.12,0,w+1.75,d+1.7,1.46,0xb96e42,0xaa7457,cream,.25);
      k.box(cream,5.17,.50,-.05,5.25,.62,1.85);
      for(const z of [-.89,.79])k.box(warm,5.18,1.04,z,5.21,.56,.14);
      for(let i=0;i<3;i++)k.box(cream,7.98+i*.31,.33-i*.09,-.05,.34,.66-i*.18,1.85);
    },thuyLevel);
    const yard=[[-22.1,-6.8],[-10.2,3.7],[4.1,18.9],[10.9,23.0],[-4.4,33.4],[-13.7,32.6],[-33.1,15.5],[-37.0,5.2],[-35.1,-2.2]];
    zone(0,0,0,()=>{
      slab(T,k,yard,0x837c70,-.69,.70);
      const shape=new T.Shape(yard.map(([x,z])=>new T.Vector2(x,-z))),g=new T.ShapeGeometry(shape);
      g.rotateX(-Math.PI/2);
      const stone=new T.MeshLambertMaterial({color:0x82796d});
      stone.onBeforeCompile=s=>{
        s.vertexShader='varying vec2 courtP;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncourtP=position.xz;');
        s.fragmentShader='varying vec2 courtP;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec2 uv=mat2(.789,-.615,.615,.789)*courtP/vec2(.51,.39);
          uv.x+=.5*mod(floor(uv.y),2.);vec2 joint=min(fract(uv),1.-fract(uv));
          vec2 aa=min(fwidth(uv)*.47,vec2(.19));
          vec2 fill=smoothstep(-aa+.014,aa+.030,joint);
          float n=fract(sin(dot(floor(uv),vec2(2.85,7.92)))*32769.17);
          diffuseColor.rgb*=mix(.57,.86+.21*n,fill.x*fill.y);
        `);
      };
      const mesh=new T.Mesh(g,stone);mesh.position.y=.032;mesh.receiveShadow=true;k.group.add(mesh);
      // A pebble mosaic under camera node13, in front of the pair of kỳ lân.
      const medallion=document.createElement('canvas');medallion.width=medallion.height=224;
      const ctx=medallion.getContext('2d');ctx.translate(112,112);
      ctx.fillStyle='#4d4a42';ctx.beginPath();ctx.arc(0,0,110,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#c1b09a';ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(0,0,103,0,2*Math.PI);ctx.stroke();
      for(let j=0;j<3;j++){
        ctx.rotate(2*Math.PI/3);ctx.fillStyle='#c0a482';ctx.beginPath();ctx.moveTo(1,-5);
        ctx.bezierCurveTo(16,-42,46,-68,37,-81);ctx.bezierCurveTo(20,-96,-11,-75,-18,-46);ctx.bezierCurveTo(-23,-22,-15,-7,1,-5);ctx.fill();
        ctx.beginPath();ctx.arc(-1,-31,6,0,Math.PI*2);ctx.fillStyle='#605b4e';ctx.fill();
      }
      const map=new T.CanvasTexture(medallion);map.colorSpace=T.SRGBColorSpace;
      const m=new T.Mesh(new T.PlaneGeometry(5.05,5.05),new T.MeshLambertMaterial({map,transparent:true,depthWrite:false}));
      const [mx,mz]=relative(hall,0,23);m.position.set(mx,.054,mz);m.rotation.x=-Math.PI/2;m.renderOrder=1;k.group.add(m);
    });
    const trees=[[-75,-27,9,'palm'],[-80,-24,10,'palm'],[-83,-16,8,'banyan'],[-67,-30,7,'banyan'],
      [-58,-25,5,'banyan'],[-48,-11,7,'banyan'],[-34,4,8.6,'banyan'],[-47,19,7,'banyan'],[-12,49,6.1,'palm']];
    for(const [x,z,h,kind] of trees)zone(x,z,0,()=>A.trees(T,k,[{x:0,z:0,h,kind}]));
    let g,rest;
    k.group.userData.fitGround=ground=>{
      g??=k.group.children.find(o=>o.geometry?.hasAttribute('finishKind'))?.geometry;if(!g)return;
      const p=g.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      for(const f of fixtures){
        const level=f.groundRule?f.groundRule(ground):ground(f.x,f.z)+.055;
        for(let i=f.first;i<f.end;i++)p.setY(i,rest[i]+level);
        f.children.forEach((o,i)=>{o.position.y=f.rest[i]+level;});f.level=level;
      }
      const levels=[fixtures[2].level,fixtures[3].level,fixtures[4].level,fixtures[3].level];
      [2.75,4.2,4.35,2.5].forEach((h,i)=>{views[i].height=(levels[i]+h)/.46;});
      p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Chùa Thanh Lương',kind:'Chùa',lon,lat,
    start:[109.2956876,13.1809668],mappedEntrance:true,visitOnArrival:true,yaw:0,width:102,depth:83,
    solids:[[0,0,9.1,7.4],[-1.0,-10.5,5.8,3.1],[1,10.6,4.65,3.2],[-11.3,.9,2.15,2.15],[11.7,-1,2.1,2.1],
      [-36.85,-20.3,5.1,4.8],[-38,-26.1,2.2,1.2],[-35.5,-14.8,2.22,1.25],[-17.9,39.7,2.1,2.1]],
    boundary,reserve:reserved,gardenRadius:1,modeledBuildings:['w903827683','w903834500'],
    source,photo:tour+'#node4',map:'https://www.openstreetmap.org/way/903827683',
    description:'Ở chùa Thanh Lương, hồ Long Thủy nằm trước chính điện ốp đá san hô và gáo dừa. Qua điện Quan Âm Linh Ứng mới tới hồ Long Ẩn. Tại đây, tượng Quan Âm Nam Hải bằng bê tông cao khoảng 7 m nổi bán thân trên mặt nước, bàn tay phải nhô lên bên lối đá. Hướng các nhà và đường bờ hai hồ theo bản đồ. Vị trí từng viên đá và các nếp áo được ước lượng từ ảnh.',
    arrivalNote:'Xe theo đường làng Mỹ Quang Nam vào bãi đỗ phía nam khuôn viên. Từ bãi, đi bộ ra sân trước chính điện và men theo hồ Long Thủy tới điện Quan Âm.',
    views,build});
})();

export default window.VietnamSights;
