const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const atlas=window.VietnamTourism,find=id=>atlas.byId?.get(id)??atlas.entries.find(e=>e.id===id);
  const tour='https://daklakvrtour.com/tour/116/index.html',source='https://tienphong.vn/post-1586951.tpo';
  const pi=Math.PI,ivory=0xe4e0ce,pale=0xd2d1c7,stone=0x989b95,grey=0x727b78,dark=0x484c49,
    sand=0xa59a87,peach=0xc7855f,cream=0xe6bd70,tile=0xad634a,roofLight=0xb96f50,blue=0x708f97,
    wood=0x603f2d,gold=0xcba449,clay=0xb7795d;
  const seed=n=>{const v=Math.sin(.184+n*22.715)*44874.3;return v-Math.floor(v);};
  function bake(T,k,positions,colour){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    g.computeVertexNormals();k.stamp(g,colour,0,0,0);g.dispose();
  }
  function tube(T,k,colour,pts,r){
    const curve=new T.CatmullRomCurve3(pts.map(a=>new T.Vector3(...a)));
    const g=new T.TubeGeometry(curve,Math.max(6,pts.length*2),r,7);k.stamp(g,colour,0,0,0);g.dispose();
  }
  function text(T,k,lines,x,y,z,w,h,fg,bg=null){
    const cn=document.createElement('canvas');cn.width=1024;cn.height=lines.length*111;
    const p=cn.getContext('2d');if(bg){p.fillStyle=bg;p.fillRect(0,0,cn.width,cn.height);}
    p.fillStyle=fg;p.font='bold 85px Arial';p.textAlign='center';p.textBaseline='middle';
    lines.forEach((line,i)=>p.fillText(line,512,111*(i+.5),988));
    const map=new T.CanvasTexture(cn);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const plate=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshLambertMaterial({map,transparent:!bg,alphaTest:bg?0:.18}));
    plate.position.set(x,y,z);k.group.add(plate);
  }
  function windowFrame(k,x,y,z,w,h){
    k.box(0x6c6455,x,y,z,w+.095,h+.09,.07);k.box(0x586765,x,y,z+.045,w,h,.038);
    k.box(0x81918a,x,y,z+.073,.034,h,.024);k.box(dark,x,y+h*.22,z+.073,w,.055,.026);
  }
  function hallRoof(T,k){
    const half=9.47,deep=11.03,y=4.61,rise=2.85;
    const a=[-half,y,-deep],b=[half,y,-deep],c=[half,y,deep],d=[-half,y,deep],e=[0,y+rise,-deep],f=[0,y+rise,deep];
    function face(a,b,c,d,tint){
      bake(T,k,[...a,...b,...c,...a,...c,...d],tint);
      bake(T,k,[...c,...b,...a,...d,...c,...a],peach);
    }
    face(d,f,e,a,tile);face(e,f,c,b,roofLight);
    k.box(roofLight,0,y+rise+.03,0,.16,.135,2*deep+.09);
    for(const z of [-deep,deep-.19]){
      const g=new T.Shape();g.moveTo(-half,0);g.lineTo(0,rise);g.lineTo(half,0);g.closePath();
      k.profile(g,cream,0,y-.018,z,.18);k.box(peach,0,y-.05,z+.076,half*2,.22,.31);
      for(const side of [-1,1])k.box(peach,side*half*.5,y+rise*.5,z+.103,Math.hypot(half,rise)+.09,.21,.34,0,0,-side*Math.atan2(rise,half));
    }
    for(const side of [-1,1])k.box(peach,side*half,y-.08,0,.19,.22,deep*2+.20);
    text(T,k,['NHÀ TRƯNG BÀY','DI TÍCH LỊCH SỬ VŨNG RÔ'],0,5.56,deep+.020,8.30,1.04,'#863322');
  }
  function gallery(T,k){
    const floor=.68,w=15.3,rear=-10.39,front=6.40,wallTop=4.49;
    k.box(grey,0,.31, -.02,18.37,.62,21.37);
    k.box(ivory,0,.652,-.02,18.39,.08,21.39);
    // Six square piers and the stepped scallops between them are visible
    // in the exterior panorama (node5). The yellow gable faces north-west.
    const bays=[-8.66,-4.81,-2.14,2.14,4.81,8.66],porch=9.99;
    for(const x of bays){
      k.box(ivory,x,2.68,porch,.53,3.99,.53);
      k.box(pale,x,.84,porch,.69,.31,.69);k.box(peach,x,1.09,porch+.283,.34,.30,.036);
      k.box(ivory,x,1.38,porch,.62,.16,.64);k.box(peach,x,2.72,porch+.278,.32,2.40,.026);
      k.box(peach,x+.276,2.72,porch,.026,2.40,.32);k.box(peach,x-.276,2.72,porch,.026,2.40,.32);
      k.box(ivory,x,4.15,porch,.68,.30,.67);k.box(pale,x,4.34,porch,.83,.15,.71);
    }
    for(let i=1;i<bays.length;i++){
      const span=bays[i]-bays[i-1]-.54,h=.48,m=(bays[i]+bays[i-1])/2;
      const shape=new T.Shape();shape.moveTo(-span/2,0);shape.lineTo(-span*.37,0);shape.lineTo(-span*.37,.08);
      shape.lineTo(-span*.30,.08);shape.lineTo(-span*.30,.14);shape.quadraticCurveTo(0,h*.86,span*.30,.14);
      shape.lineTo(span*.30,.08);shape.lineTo(span*.37,.08);shape.lineTo(span*.37,0);
      shape.lineTo(span*.5,0);shape.lineTo(span*.5,h);shape.lineTo(-span*.5,h);shape.closePath();
      k.profile(shape,peach,m,4.00,porch-.17,.33);
    }
    for(const sign of [-1,1]){
      k.box(cream,sign*w*.5,(floor+wallTop)/2,(front+rear)*.5,.25,wallTop-floor,front-rear);
      k.box(pale,sign*w*.5,.91,(front+rear)*.5,.27,.46,front-rear);
    }
    k.box(cream,0,(floor+wallTop)/2,rear,w,wallTop-floor,.26);
    k.box(cream,0,3.98,front,w,.94,.32);
    // Three glazed entrances under high transoms. Keep the porch and door
    // recesses open; the detailed collection is in the actual tour (node4).
    const entries=[[-3.90,1.59],[0,2.27],[3.90,1.59]],segments=[];
    let left=-w*.5;
    for(const [x,span] of entries){
      segments.push([left,x-span*.5]);left=x+span*.5;
      k.box(dark,x,3.20,front,span,.55,.18);k.box(0x74837a,x,3.20,front+.098,span-.10,.40,.031);
      for(const sign of [-1,1])k.box(dark,x+sign*span*.5,1.85,front,.09,2.35,.19);
      if(x!==0){
        k.box(dark,x+Math.sign(x)*span*.46,1.81,front+.48,.09,2.26,.96);
        k.box(0x77847a,x+Math.sign(x)*span*.46,1.81,front+.48,.106,2.06,.79);
      }else for(const sign of [-1,1]){
        k.box(dark,sign*(span*.5-.18),1.83,front,.32,2.32,.12);
        k.box(0x71827d,sign*(span*.5-.18),1.83,front+.07,.23,2.18,.035);
      }
    }
    segments.push([left,w*.5]);
    for(const [a,b] of segments)k.box(cream,(a+b)/2,2.10,front,b-a,2.83,.32);
    for(const x of [-6.27,6.27])windowFrame(k,x,2.49,front+.18,1.54,1.87);
    k.box(0xb3a594,0,2.29,.65,w-.38,3.15,.23);k.box(0xb4ac98,0,3.94,3.35,w-.26,.10,5.67);
    k.box(0x9d9c91,0,.700,3.55,w-.27,.035,5.82);
    k.box(wood,0,2.39,.80,1.25,1.47,.048);
    k.box(0x867e70,0,2.39,.832,1.07,1.27,.018);
    for(let i=0;i<4;i++){
      const h=.68-i*.165,z=10.71+i*.38;
      k.box(grey,0,h*.5,z,11.65,h,.43);k.box(0x996b56,0,h-.018,z,4.3,.045,.43);
    }
    for(const side of [-1,1]){
      const cheek=new T.Shape();cheek.moveTo(0,0);cheek.lineTo(2.28,0);cheek.lineTo(2.28,.64);
      cheek.lineTo(1.91,.65);cheek.lineTo(.42,1.13);cheek.lineTo(0,1.16);cheek.closePath();
      k.profile(cheek,blue,side*5.93,0,10.01,.24,-pi/2);
      k.box(ivory,side*5.97,.62,12.30,.68,1.24,.68);k.box(peach,side*5.97,.65,12.65,.43,.78,.025);
      k.box(pale,side*5.97,1.23,12.30,.81,.11,.81);
    }
    hallRoof(T,k);
  }
  function sweptRoof(T,k,w,d,innerW,innerD,eave,rise,upper){
    const corners=[[-1,-1],[-1,1],[1,1],[1,-1]],tileFaces=[],underside=[],lip=[];
    const quad=(arr,a,b,c,d)=>arr.push(...a,...d,...b,...b,...d,...c);
    function point(side,u,v){
      const a=corners[side],b=corners[(side+1)%4],px=a[0]+(b[0]-a[0])*u,pz=a[1]+(b[1]-a[1])*u;
      return [px*(w+(innerW-w)*v)*.5,eave+rise*(.72*v+.28*v*v)+(.21+.08*upper)*Math.min(Math.abs(px),Math.abs(pz))**6*(1-v),
        pz*(d+(innerD-d)*v)*.5];
    }
    for(let side=0;side<4;side++){
      const count=Math.ceil((side%2===0?d:w)/.25);
      for(let j=0;j<count;j++){
        const u=j/count,uu=(j+1)/count;
        for(let i=0;i<4;i++)quad(tileFaces,point(side,u,i/4),point(side,u,(i+1)/4),point(side,uu,(i+1)/4),point(side,uu,i/4));
        const a=point(side,u,0),b=point(side,uu,0),down=x=>[x[0],x[1]-.09,x[2]];
        quad(lip,a,b,down(b),down(a));quad(underside,down(a),down(b),[b[0]*.74,eave+.12,b[2]*.7],[a[0]*.74,eave+.12,a[2]*.7]);
        const track=[];for(let i=0;i<5;i++){const v=point(side,u,i/4);v[1]+=.036;track.push(v);}
        tube(T,k,upper?0xb97550:0xb37050,track,.051);
      }
      const hip=[];for(let i=0;i<=5;i++){const v=point(side,0,i/5);v[1]+=.06;hip.push(v);}
      tube(T,k,ivory,hip,.082);
      const [x,y,z]=hip[0],sx=Math.sign(x),sz=Math.sign(z);
      tube(T,k,ivory,[[x-sx*.22,y-.10,z-sz*.19],[x,y+.03,z],[x+sx*.15,y+.26,z+sz*.08],
        [x+sx*.16,y+.43,z+sz*.10],[x+sx*.25,y+.47,z+sz*.12]],.073);
    }
    bake(T,k,tileFaces,upper?roofLight:tile);bake(T,k,underside,ivory);bake(T,k,lip,peach);
    if(upper)k.box(ivory,0,eave+rise+.075,0,innerW+.13,.15,.23);
  }
  function guardian(T,k,side,x,y,z){
    // The two dark carved animals silhouette the tops of the side pillars
    // in the 2023 field photograph. The small carving is simplified.
    k.place(x,z,side*.34,()=>{
      const geo=new T.SphereGeometry(1,11,7),ash=0x70746e;
      const oval=(x,h,z,w,ht,d)=>k.stamp(geo,ash,x,y+h,z,w,ht,d);
      oval(0,.11,0,.21,.105,.25);oval(0,.22,-.06,.16,.17,.18);
      oval(0,.33,.11,.13,.14,.13);oval(0,.30,.205,.097,.062,.08);
      for(const a of [-1,1]){oval(a*.087,.424,.11,.056,.046,.049);oval(a*.108,.070,.16,.070,.046,.105);}
      tube(T,k,ash,[[0,y+.13,-.18],[.04,y+.24,-.26],[.02,y+.37,-.20]],.047);geo.dispose();
    });
  }
  function memorial(T,k){
    const floor=.55,w=5.35,front=1.45,rear=-2.09;
    k.box(grey,0,.25,.44,7.18,.50,5.36);k.box(clay,0,.527,.44,7.18,.057,5.36);
    for(const sign of [-1,1]){
      k.box(pale,sign*(w*.5-.14),2.00,(front+rear)/2,.28,2.9,front-rear);
      k.box(ivory,sign*1.97,2.00,front,1.40,2.9,.27);
      for(const dx of [-.34,.34]){
        const x=sign*1.97+dx;
        k.box(pale,x,1.99,2.16,.44,2.82,.44);k.box(stone,x,2.10,2.39,.212,2.12,.018);
        k.box(ivory,x,.93,2.17,.60,.14,.55);k.box(ivory,x,3.35,2.17,.57,.17,.54);
      }
      k.box(wood,sign*1.36,1.62,front+.42,.15,2.15,.95);
      for(let i=0;i<6;i++)k.box(0x886342,sign*1.36,2.08,front+.15+i*.13,.17,.66,.034);
    }
    k.box(pale,0,2.0,rear,w,2.90,.26);k.box(ivory,0,3.40,front,w,.38,.40);
    k.box(ivory,0,3.34,-.02,5.24,.14,4.36);
    k.box(pale,0,3.99,-.14,4.41,.71,2.96);
    for(const side of [-1,1])k.box(ivory,side*1.48,4.03,1.356,.69,.34,.043);
    text(T,k,['NHÀ TƯỞNG NIỆM'],0,4.03,1.374,1.92,.29,'#ffe4af','#9a4935');
    sweptRoof(T,k,6.52,4.72,4.40,2.9,3.32,.48,0);
    sweptRoof(T,k,4.99,3.46,2.63,.15,4.37,.74,1);
    // Only the fixed stone altar and the bronze incense vessel visible
    // through the open front are represented. Node6 records the interior.
    k.box(grey,0,1.00,-1.32,1.88,.90,.72);k.box(stone,0,1.47,-1.32,1.99,.13,.78);
    k.box(0x9baaa0,0,2.20,rear+.147,2.39,1.62,.025);
    k.box(0xa2927e,0,1.87,rear+.195,.49,.69,.075);
    k.box(0xa2927e,0,2.22,rear+.195,.61,.105,.075);
    k.box(0x8b4e3b,0,3.02,rear+.155,2.67,.15,.039);
    const urn=new T.LatheGeometry([[.12,0],[.14,.07],[.25,.23],[.20,.38],[.25,.41],[.23,.46]].map(([x,y])=>new T.Vector2(x,y)),20);
    k.stamp(urn,gold,0,.73,-.52);urn.dispose();
    for(const sign of [-1,1]){
      tube(T,k,gold,[[sign*.13,.96,-.53],[sign*.29,1.00,-.54],[sign*.31,1.13,-.54],[sign*.22,1.16,-.54]],.034);
      k.box(gold,sign*.10,.65,-.52,.052,.20,.060,0,0,-sign*.15);
    }
    for(let i=0;i<3;i++)k.box(grey,0,(3-i)*.092,3.22+i*.36,7.38,(3-i)*.184,.39);
    for(const side of [-1,1]){
      const x=side*3.78;
      k.box(stone,x,.29,3.43,.30,.54,1.47);
      k.box(ivory,x,.56,3.40,.33,.11,1.50,0,.32);
      k.box(pale,side*3.73,.36,1.18,.94,.71,.90);k.box(ivory,side*3.73,.79,1.18,1.00,.16,.95);
      k.box(pale,side*3.73,1.72,1.18,.70,1.80,.71);k.box(stone,side*3.73,1.87,1.55,.39,1.18,.025);
      k.box(ivory,side*3.73,2.68,1.18,.83,.26,.84);k.box(pale,side*3.73,2.89,1.18,.74,.19,.76);
      k.box(ivory,side*3.73,3.05,1.18,.89,.14,.87);guardian(T,k,side,side*3.73,3.10,1.18);
    }
  }
  function lowWalls(k){
    // The enclosure on each side of the brick forecourt has perforated
    // terracotta infill between short white masonry posts.
    for(const side of [-1,1]){
      const x=side*5.25;
      k.box(pale,x,.13,4.15,.28,.26,7.39);k.box(ivory,x,.59,4.15,.33,.13,7.39);
      for(let i=0;i<4;i++){
        const z=.49+i*2.45;k.box(pale,x,.34,z,.39,.67,.39);
        k.tapered(ivory,x,.72,z,.30,.15,.13,1,4);
        if(i===3)continue;
        for(let j=0;j<13;j++){
          const pz=z+.26+j*.161;
          k.box(clay,x,.391,pz,.12,.26,.047,.0,-.49);
          k.box(clay,x,.391,pz+.075,.12,.26,.047,0,.49);
        }
      }
    }
  }
  function paving(T,k,small){
    const paths=small?[[-5.31,-2.50],[5.34,-2.50],[5.34,6.70],[4.68,8.43],[-5.68,8.43],[-5.45,6.34]]:
      [[-10.15,-10.64],[10.15,-10.64],[10.15,9.94],[12.60,9.94],[12.61,20.06],[7.64,20.12],
        [7.64,16.63],[-5.98,16.63],[-5.98,25.92],[-11.10,25.92],[-11.06,12.30],[-10.15,11.70]];
    const shape=new T.Shape(paths.map(([x,z])=>new T.Vector2(x,-z))),geo=new T.ShapeGeometry(shape);
    geo.rotateX(-pi/2);
    const mat=new T.MeshLambertMaterial({color:small?0xb77c62:0xbdac9c});
    mat.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec2 brickXY;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbrickXY=position.xz;');
      sh.fragmentShader='varying vec2 brickXY;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 q=brickXY/vec2(${small?'.36,.57':'.46,.78'});
        q.x+=.5*mod(floor(q.y),2.);vec2 border=min(fract(q),1.-fract(q));
        float grout=smoothstep(.013,.013+max(fwidth(q.x),fwidth(q.y))*.52,min(border.x,border.y));
        float grain=fract(sin(dot(floor(q),vec2(13.71,45.19)))*33348.);
        diffuseColor.rgb*=mix(.76,.92+.13*grain,grout);`);
    };
    const m=new T.Mesh(geo,mat);m.receiveShadow=true;k.group.add(m);
    return paths;
  }
  function fringe(T,k,small,outline){
    const p=[],idx=[],rings=[0,.9,2.1,3.8,6.1],ringHeights=[],centerZ=small?2.0:3.65,bound=[];
    // Interpolate every segment before spreading the planted bank down
    // to the actual surrounding grade. Both masonry thresholds stay level.
    for(let i=0;i<outline.length;i++){
      const [x,z]=outline[i],[a,b]=outline[(i+1)%outline.length];
      const n=Math.max(1,Math.ceil(Math.hypot(a-x,b-z)/1.4));
      for(let j=0;j<n;j++)bound.push([x+(a-x)*j/n,z+(b-z)*j/n]);
    }
    for(let j=0;j<rings.length;j++){
      for(let i=0;i<bound.length;i++){
        const [x,z]=bound[i],len=Math.max(.1,Math.hypot(x,z-centerZ)),r=rings[j],n=p.length/3;
        p.push(x+x*r/len,0,z+(z-centerZ)*r/len);ringHeights.push(r/6.1);
        if(j){const prev=j*bound.length+(i+bound.length-1)%bound.length;idx.push(prev-bound.length,prev,n,prev-bound.length,n,n-bound.length);}
      }
    }
    const g=new T.BufferGeometry(),pos=new T.Float32BufferAttribute(p,3);
    g.setAttribute('position',pos);g.setIndex(idx);g.computeVertexNormals();
    const material=new T.MeshLambertMaterial({color:small?0x788462:0x818e6d,side:T.DoubleSide});
    const mesh=new T.Mesh(g,material);mesh.receiveShadow=true;k.group.add(mesh);
    return (ground,y)=>{
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i),z=pos.getZ(i),t=ringHeights[i],g=ground(x,z);
        pos.setY(i,Math.max(g-.06,(y-.04)+(g-y-.045)*t*t*(3-2*t)));
      }
      pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
    };
  }
  function forest(T,k,small){
    const entries=small?[
      [-6,-4,6.3,8],[-4,-5.4,5.5,5.8],[.8,-6.7,7.2,7.3],[5.3,-5,6.8,6.6],
      [6.2,-2,6.4,6.1],[-7,1.6,6.3,6.4],[7,4.9,5.7,5.7],[-7.8,6,5.4,5.1],
      [-10,9,4.7,4.8],[8.2,9.1,5.5,5.2],[10.1,12.3,4.7,5.4],[-8.0,12.7,5.2,5.7]]:
      [[-9.1,-13,6.5,6.4],[-5,-13.3,6.2,6.1],[1.8,-13.7,5.5,5.2],[6.1,-13.2,6.2,6.4],
        [9.8,-11.5,5.9,6],[-11,-4.3,6.2,6.0],[11.5,-4.5,5.0,4.3],
      [-25.9,-4.9,8.5,9.5],[-10.9,27.5,7.4,8.3],[-17.3,18,5.4,6.5]];
    if(small)for(let j=0;j<6;j++)for(let i=0;i<10;i++){
      const n=10*j+i,w=5.1+3.9*seed(n+21);
      entries.push([(i-4.6)*4.5+1.7*seed(n),-9-j*4.3-2*seed(n+51),w,w*(.91+.21*seed(n+79))]);
    }
    const models=createTreeModels(T),sets=[],o=new T.Object3D();
    for(let v=0;v<3;v++){
      const points=entries.filter((_,i)=>i%3===v);
      const mesh=new T.InstancedMesh(models.geometry('tree',true,v),models.material,points.length);
      mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);sets.push([mesh,points]);
    }
    return g=>{
      for(const [m,points] of sets){
        points.forEach(([x,z,h,w],i)=>{
          o.position.set(x,g(x,z),z);o.scale.set(w,h,w);o.rotation.set(0,seed(x*19+z)*pi*2,0);o.updateMatrix();m.setMatrixAt(i,o.matrix);
        });
        m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
      }
    };
  }
  function assemble(T,k,small){
    k.palette({stone:[stone,grey,dark,sand],plaster:[ivory,pale,peach,cream,blue],tile:[tile,roofLight],timber:wood,metal:gold});
    let outline;
    const fixed=k.place(0,0,0,()=>{
      outline=paving(T,k,small);
      if(small){memorial(T,k);lowWalls(k);}else gallery(T,k);
    }).map(mesh=>[mesh,mesh.position.y]);
    const fitBank=fringe(T,k,small,outline),fitTrees=forest(T,k,small);
    let body;
    k.group.userData.fitGround=g=>{
      body??=k.group.children.find(mesh=>mesh.geometry?.hasAttribute('finishKind'));
      const samples=small?[[-3,-2],[3,-2],[-3,3.6],[3,3.6],[-4.6,7.9],[4.6,7.9]]:
        [[-9.4,-10],[9.4,-10],[-9.4,9.9],[9.4,9.9],[-7.6,15.8],[7.7,15.8]];
      const level=Math.max(g(0,0),...samples.map(([x,z])=>g(x,z)))+.12;
      body.position.y=level;
      for(const [mesh,y] of fixed)mesh.position.y=level+y;
      fitBank(g,level);fitTrees(g);
    };
  }
  function register(id,catalogId,name,lon,lat,yaw,small){
    const raw=find(catalogId),c=Math.cos(yaw),s=Math.sin(yaw);
    function view(name,x,z,height,radius,angle,elevation,fov=48){
      return {name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius:radius,viewAngle:yaw+angle,viewElevation:elevation,viewFov:fov,viewBase:'monument'};
    }
    const marker=small?'node7':'node5';
    (window.VietnamSights??=[]).push({...raw,id,catalogId,name,kind:small?'Di tích':'Bảo tàng',lon,lat,yaw,
      width:small?11:21,depth:small?12:24,source,photo:tour+'#'+marker,map:small?'https://www.openstreetmap.org/node/12382639867':'https://www.openstreetmap.org/node/4292019089',
      start:raw?.start??[109.4191949,12.8776377],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,solids:[],
      reserve:(x,z,r)=>small?(Math.abs(x)<5.4+r&&z>-2.8-r&&z<8.8+r):(Math.abs(x)<10.3+r&&z>-11-r&&z<17+r),
      description:small?'Nhà tưởng niệm quay ra phía vịnh. Từ sân gạch, ba bậc đá lên cửa thờ, phía trên có hai tầng mái ngói cong. Hai trụ bên bậc đặt linh vật đá. Chiều cao và hoa văn được ước dựng theo ảnh.':
        'Nhà trưng bày di tích lịch sử Vũng Rô nằm cạnh bờ vịnh. Trên hồi mái hướng tây bắc có hàng chữ đỏ ghi tên nhà. Sáu cột vuông đỡ hiên trước ba lối cửa kính. Kích thước mái và cao độ hiên được ước theo ảnh từ trên cao và ảnh mặt tiền.',
      arrivalNote:small?'Xe dừng trên Quốc lộ 29 ở cổng khu di tích Bãi Chùa. Đi bộ qua khu trưng bày rồi theo lối ven sườn rừng về phía đông để tới nhà tưởng niệm.':
        'Xe dừng trên Quốc lộ 29 ở cổng khu di tích Bãi Chùa. Đi bộ khoảng 100 m theo lối lát vào sân trước nhà trưng bày.',
      views:small?[view('Hai tầng mái nhìn từ sân gạch',0,.40,7.2,11.5,.055,.048),
        view('Trụ đá và ba bậc trước cửa thờ',.20,.72,8.0,13.1,.49,.065)]:
        [view('Hiên sáu cột trước nhà trưng bày',0,5.3,8.7,19.2,.23,.095,59),
          view('Hồi mái và lối lên hiên',-1.1,7.4,8.1,24.6,-.64,.15)],
      build:(T,k)=>assemble(T,k,small)});
  }
  // Red-roofed gallery c.19 x 22 m including eaves, ridge NW–SE. Its
  // node5 camera lies on the entrance apron; node4 is inside the gallery.
  register('nha-trung-bay-ben-vung-ro','phu-yen-nha-trung-bay-vung-ro','Nhà trưng bày di tích lịch sử Vũng Rô',
    109.4198678,12.8769989,-2.285,false);
  // The small double roof c.6.5 x 4.7 m lies above the shore at the far
  // end of the wooded path. The photographed front faces the south court.
  register('nha-tuong-niem-ben-vung-ro','osm-node-12382639867','Nhà tưởng niệm liệt sĩ Bến Vũng Rô',
    109.4220505,12.8767903,-.09,true);
})();

export default window.VietnamSights;
