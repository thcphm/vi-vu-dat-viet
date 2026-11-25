const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Surveyed 2026-11-23. The names follow the 861/QĐ-TTg heritage inventory.
  // https://dsvh.gov.vn/di-tich-lich-su-thanh-co-quang-tri-va-nhung-dia-diem-luu-niem-su-kien-81-ngay-dem-nam-1972-2975
  // The two OSM points are separated by 374 m. The long profiles below are
  // measured from Esri World Imagery and checked against views from the river.
  // South: closed timber hall, lower colonnade, transverse stair canopy and
  // the crescent walks. The public road between the hall and square is Ngô Quyền.
  const southSource='https://dulich.quangtri.gov.vn/vi/benthahoabonamthachhan';
  const southPhoto='https://cand.com.vn/Phong-su-tu-lieu/dat-thieng-thanh-co-i691543/';
  // South aerial in Thanh Bình's CAND feature. North: the river photograph
  // in Trần Thành's Báo Văn Hóa report and Hồ Cầu / VNA's reverse aerial
  // establish the two lateral flights, octagon, temple and circular precinct.
  // Southern timber panels, carved stone balustrades and lower censer were
  // checked against Phương Huy's field series (Tết 2018), CC BY-SA 4.0:
  // https://commons.wikimedia.org/?curid=102973338 and ?curid=102974143 .
  const northPhoto='https://baovanhoa.vn/van-hoa/bao-ton-phat-huy-gia-tri-di-tich-quoc-gia-dac-biet-thanh-co-quang-tri-130234.html';
  // The sculptor's illustrated catalogue specifies stone and 21 m. The 29.7 m
  // figure in the 2010 groundbreaking announcement described the early design.
  const northSource='https://tapchimythuat.vn/nha-dieu-khac-nguyen-quoc-thang-di-den-va-cham-hinh-khoi-ky-uc-chien-tranh/';
  // The stone figures are modelled in low relief from the front photograph.
  // Hidden faces, stair risers and water height are interpreted. All geometry
  // is authored; no pixels from the reference photographers are distributed.
  const A=window.CentralArch,sites=window.VietnamSights??=[],tau=2*Math.PI;
  const slab=0x969895,edge=0xb5b7ad,paving=0xa7a598,basalt=0x676d6c,shadow=0x5a605c;
  const wood=0x69483c,frame=0x533b31,doors=0x805c43,tile=0xa45d4d,ridge=0xb6b6a7;
  const brick=0xb37768,leaf=0x60814b,grass=0x73844c,granite=0xd2d0bf,polished=0xbebbaa;
  function pipe(T,k,c,path,r){
    const g=new T.TubeGeometry(new T.CatmullRomCurve3(path.map(a=>new T.Vector3(...a))),Math.max(3,path.length*2),r,5,false);
    k.stamp(g,c,0,0,0);g.dispose();
  }
  function post(k,c,x,y,z,r,h){k.stamp(k.round,c,x,y+h/2,z,r,h,r);}
  function disc(T,k,c,x,y,z,r0,r1,h,n=64,rot=0){
    const g=new T.CylinderGeometry(r1,r0,h,n);k.stamp(g,c,x,y+h/2,z,1,1,1,rot);g.dispose();
  }
  function panel(T,k,col,verts){
    const p=[];for(let i=1;i<verts.length-1;i++)p.push(...verts[0],...verts[i],...verts[i+1],...verts[0],...verts[i+1],...verts[i]);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();k.stamp(g,col,0,0,0);g.dispose();
  }
  function band(k,tint,x,y,z,w,h,d){k.box(tint,x,y+h/2,z,w,h,d);}
  function rail(k,x0,z0,x1,z1,y,h=.75){
    const dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz),a=Math.atan2(dx,dz),n=Math.max(1,Math.round(l/2.15));
    for(let i=0;i<=n;i++){
      const x=x0+i*dx/n,z=z0+i*dz/n;k.box(edge,x,y+h*.51,z,.24,h,.24);k.box(slab,x,y+h+.04,z,.32,.09,.32);
    }
    for(const level of [.36,.84])k.box(slab,(x0+x1)/2,y+h*level,(z0+z1)/2,.14,.10,l,a);
  }
  function upturned(T,k,x,y,z,w,d,h,clay=tile){
    A.curvedRoof(T,k,x,y,z,w,d,h,clay,ridge,ridge,.36);
    for(const sx of [-1,1]){
      const q=w*.37;pipe(T,k,ridge,[[x+sx*(q-.33),y+h+.08,z],[x+sx*q,y+h+.14,z],[x+sx*(q+.34),y+h+.39,z],[x+sx*(q+.53),y+h+.68,z]],.084);
      for(const sz of [-1,1]){
        const x1=x+sx*w*.5,z1=z+sz*d*.49;
        pipe(T,k,ridge,[[x1-sx*.70,y+.26,z1-sz*.06],[x1-sx*.22,y+.46,z1],[x1,y+.76,z1+sz*.12]],.087);
      }
    }
  }
  function hall(T,k,w,d,north){
    const z=0,base=.48,postH=north?2.93:2.63,upper=base+postH+1.16;
    band(k,edge,0,0,z,w+.55,base,d+.55);
    for(const end of [-1,1]){
      const X=end*(w/2-.58);
      for(const Z of [-d*.37,d*.37])post(k,wood,X,base,Z,.18,postH);
    }
    for(let i=0;i<5;i++)for(const end of [-1,1]){
      const X=(i-2)*(w-2.15)/4;
      post(k,frame,X,base,end*d*.385,.15,postH);
      band(k,wood,X,base+postH-.26,end*d*.385,.53,.23,.23);
    }
    for(const side of [-1,1])band(k,wood,0,base+postH-.28,side*d*.38,w-.65,.3,.22);
    if(!north){
      const W=w-.94,D=d-1.3;band(k,wood,0,base+.05,0,W,postH-.13,D);
      for(const side of [-1,1])for(let i=-2;i<=2;i++){
        const bx=i*(W-.55)/5,bw=(W-.55)/5;
        band(k,i===0?frame:doors,bx,base+.12,side*(D/2+.019),bw-.16,postH-.45,.09);
        if(i!==0){
          for(const h of [.48,1.42])band(k,wood,bx,base+h,side*(D/2+.075),bw*.76,.074,.065);
          for(const u of [-.36,0,.36])band(k,wood,bx+bw*u,base+.16,side*(D/2+.08),.052,postH-.60,.058);
          for(let j=-3;j<=3;j++)band(k,frame,bx+j*bw*.098,base+postH-.59,side*(D/2+.083),.052,.34,.065);
        }
      }
    }else{
      band(k,wood,0,base+.08,0,w*.49,postH-.12,1.0);band(k,frame,0,base+.65,.54,w*.31,.55,.61);
    }
    upturned(T,k,0,base+postH,z,w+1.65,d+1.0,1.02,north?0xac7350:tile);
    band(k,wood,0,base+postH+.76,z,w*.73,.81,d*.58);
    for(const side of [-1,1])for(let i=-6;i<=6;i++)band(k,frame,i*w*.053,base+postH+.87,side*(d*.29+.035),.07,.42,.07);
    upturned(T,k,0,upper+.38,z,w*.86,d*.74,1.42,north?0xac7350:tile);
    band(k,frame,0,base+postH+.96,d*.296,w*.32,.51,.075);
    if(!north)A.plaque(T,k,'NHÀ HÀNH LỄ - BẾN THẢ HOA',0,base+postH+1.28,-d*.302,w*.34,.47,{ry:Math.PI,bg:'#754532',fg:'#e3c588',frame:false});
  }
  function gallery(T,k,x,z,w,d,level=.37,trim=true){
    band(k,slab,x,0,z,w,.49,d);
    const n=Math.max(1,Math.round(w/3.15));
    for(let i=0;i<=n;i++)for(const sz of [-1,1]){
      const xx=x+(i/n-.5)*(w-.56),zz=z+sz*d*.37;post(k,frame,xx,level,zz,.13,2.15);
      band(k,wood,xx,level+1.91,zz,.49,.24,.22);
    }
    for(const sz of [-1,1])band(k,wood,x,level+2.11,z+sz*d*.38,w-.34,.23,.19);
    upturned(T,k,x,level+2.31,z,w+.48,d+.68,.87);
    if(trim&&w>9)for(const i of [-.34,.34])upturned(T,k,x+i*w,level+2.62,z,3.26,d+.78,.99);
  }
  function centralCanopy(T,k){
    for(const x of [-1.38,1.38])for(const z of [-.94,1.06])post(k,wood,x,.04,z,.115,2.2);
    upturned(T,k,0,2.18,0,3.9,2.9,.92);
  }
  function crescent(T,k,x0,sign){
    const n=25;
    for(let i=0;i<n;i++){
      const a=i/n,b=(i+1)/n,inner=t=>[x0+sign*t*35.2,.1,3.2+2.4*Math.sin(Math.PI*t)],outer=t=>[x0+sign*t*35.2,.1,3.2+7.3*Math.sin(Math.PI*t)];
      const A=inner(a),B=inner(b),C=outer(b),D=outer(a);
      panel(T,k,brick,[A,B,C,D]);panel(T,k,slab,[D,C,[C[0],-2.8,C[2]],[D[0],-2.8,D[2]]]);
      if(i%3===0)post(k,edge,D[0],.1,D[2],.14,.69);
      const q=(a+b)*.5,Q=outer(q);pipe(T,k,edge,[[D[0],.76,D[2]],[Q[0],.76,Q[2]],[C[0],.76,C[2]]],.052);
    }
  }
  // The front photograph resolves the open arch under the carved corbels, the
  // void higher up, the compact capital and its pointed crown. Four planes
  // carry simplified figures so the group remains readable around the mound.
  function sculpture(T,k){
    const axis=.07,base=3.53;
    function stoneProfile(contour,tint,depth,z,rot=0){
      const shape=new T.Shape();contour.forEach(([x,y],i)=>i?shape.lineTo(x,y+base):shape.moveTo(x,y+base));shape.closePath();
      const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:1,bevelThickness:.048,bevelSize:.055,curveSegments:5});
      g.translate(0,0,-depth/2+z);k.stamp(g,tint,0,0,0,1,1,1,rot);g.dispose();
    }
    function ringAt(y,low,high,h,n=8){disc(T,k,granite,0,base+y,0,low,high,h,n,axis);}
    function leg(sx,sz){
      const sections=[[0,1.65,1.02],[.25,1.60,1.00],[.88,1.31,.80],[2.1,1.25,.68],[2.85,1.24,.63],
        [3.40,1.19,.76],[4.15,1.15,.88],[7.12,1.02,.58],[8.15,1.01,.50],[11.9,.89,.43],[14.88,.84,.46]];
      const ring=([y,off,w])=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([dx,dz])=>[sx*off+dx*w,base+y,sz*off+dz*w]);
      for(let i=1;i<sections.length;i++){
        const a=ring(sections[i-1]),b=ring(sections[i]);
        for(let j=0;j<4;j++)panel(T,k,granite,[a[j],a[(j+1)%4],b[(j+1)%4],b[j]]);
      }
    }
    k.place(0,0,axis,()=>{for(const sx of [-1,1])for(const sz of [-1,1])leg(sx,sz);});
    const ell=new T.SphereGeometry(1,9,7);
    for(let i=0;i<4;i++){
      const q=axis+i*Math.PI/2;
      k.place(0,0,q,()=>{
        for(let level=0;level<8;level++){
          const r=.39+.099*level,offset=1.15+.018*level,y=base+2.62+level*.335;
          for(const side of [-1,1])disc(T,k,level%3?granite:polished,side*offset,y,1.33+level*.045,r*.85,r,.18,10);
        }
        for(const [y,w,v]of [[5.51,1.78,1.39],[6.15,1.48,1.54],[6.81,1.14,1.54]]){
          const wing=[[.72,y-.25],[w+.45,y-.26],[w+.91,y+.03],[w+.98,y+.25],[.77,y+.18]];
          for(const side of [-1,1])stoneProfile(wing.map(([X,Y])=>[X*side,Y]),polished,.72,v,0);
        }
        const xf=i%2?.60:-.55;
        k.stamp(ell,granite,xf+.02,base+6.86,1.55,.45,.85,.38,.21,-.09,.16);
        k.stamp(ell,granite,xf+.10,base+7.81,1.53,.27,.38,.25);
        k.stamp(ell,polished,xf+.10,base+8.02,1.52,.31,.18,.28);
        for(const side of [-1,1]){
          pipe(T,k,granite,[[xf+side*.32,base+7.36,1.6],[xf+side*.50,base+6.79,1.87],[xf+side*.15,base+6.55,1.92]],.15);
          pipe(T,k,granite,[[xf+side*.21,base+6.23,1.53],[xf+side*.25,base+5.50,1.72],[xf+side*.33,base+5.00,1.75]],.18);
        }
        stoneProfile([[-.94,3.83],[-.62,2.86],[-.53,3.05],[-.33,3.23],[0,3.34],[.33,3.23],[.53,3.05],[.62,2.86],[.94,3.83],[.93,4.4],[-.93,4.4]],granite,.57,1.10);
        stoneProfile([[-1.12,11.80],[-.75,11.68],[-.3,11.82],[-.26,12.29],[0,12.55],[.26,12.29],[.30,11.82],[.75,11.68],[1.12,11.8],[1.08,14.87],[-1.08,14.87]],granite,.68,.90);
      });
    }
    ell.dispose();
    ringAt(14.77,1.48,1.32,2.64,4);ringAt(17.37,1.32,.88,.39,4);ringAt(17.76,.84,.88,.33);
    ringAt(18.09,1.09,1.14,.41);ringAt(18.50,.86,1.10,.20);ringAt(18.70,.86,.63,.49);
    for(let i=0;i<5;i++){const a=i*tau/5;stoneProfile([[-.28,18.94],[-.49,19.05],[-.46,19.55],[0,19.26],[.36,19.62],[.47,19.14],[.29,18.94]],granite,.31,.45,a);}
    ringAt(19.18,.44,.055,1.69,5);ringAt(20.87,.075,.008,.14,5);
  }
  function plaza(T,k){
    disc(T,k,slab,0,-.48,0,34.5,34.5,.56);disc(T,k,edge,0,.08,0,33.3,33.1,.19);
    disc(T,k,grass,0,.25,0,32.8,21.1,2.38);disc(T,k,slab,0,2.6,0,21.2,21.2,.13);
    for(let i=0;i<5;i++)disc(T,k,i%2?edge:slab,0,2.71+i*.163,0,10.4-i*.37,10.4-i*.37,.17);
    for(const a of [.02,2.10,4.19]){
      k.place(0,0,a,()=>{
        for(let i=0;i<14;i++)band(k,i%3?slab:edge,0,.07,32.48-i*.80,4.30,.14+i*.174,.87);
      });
    }
    sculpture(T,k);
    for(let i=0;i<7;i++){
      const a=i*tau/7,r=18.5,x=r*Math.sin(a),z=r*Math.cos(a);
      post(k,shadow,x,2.73,z,.075,2.06);
      for(const side of [-1,1])k.box(0x505957,x+side*.185,4.76,z,.30,.28,.17,a);
    }
  }
  function flight(k,cx,z0,z1,w0,w1,y0,y1,n){
    // Treads widen down the southern bank. Substantial risers bury the
    // relief mesh underneath without levelling the public road behind it.
    for(let i=0;i<n;i++){
      const t=i/n,b=(i+1)/n,z=z0+(z1-z0)*(t+b)/2,top=y0+(y1-y0)*t,w=w0+(w1-w0)*t;
      k.box(i%4===0?edge:slab,cx,top-.81,z,w,1.62,(z1-z0)/n+.028);
    }
  }
  function stele(T,k,x,y,z){
    band(k,basalt,x,y,z,2.02,.23,1.15);band(k,slab,x,y+.23,z,1.65,.27,.89);
    const shape=[[-.75,0],[-.75,1.18],[-.58,1.19],[-.51,1.34],[-.30,1.42],[-.14,1.53],[0,1.57],[.14,1.53],[.30,1.42],[.51,1.34],[.58,1.19],[.75,1.18],[.75,0]];
    k.outline(shape,edge,x,y+.48,z-.18,.37);band(k,basalt,x,y+.66,z+.20,1.05,.85,.07);
    for(let j=0;j<4;j++)band(k,0xb8aa7e,x,y+.80+j*.135,z+.252,.73-j*.027,.032,.014);
  }
  function incense(T,k,x,y,z){
    band(k,basalt,x,y,z,1.20,.26,.90);
    for(const side of [-1,1])for(const f of [-1,1])post(k,slab,x+side*.40,y+.25,z+f*.28,.103,.28);
    const bowl=new T.LatheGeometry([[.39,.45],[.55,.52],[.68,.73],[.69,.88],[.57,.98],[.58,1.08],[.71,1.11],[.72,1.18],[.54,1.18],[.54,1.10]]
      .map(([a,b])=>new T.Vector2(a,b)),24);k.stamp(bowl,edge,x,y,z,1,1,.74);bowl.dispose();
    disc(T,k,0x665a4e,x,y+1.096,z,.53,.53,.015,22);
    for(const side of [-1,1])pipe(T,k,slab,[[x+side*.50,y+.65,z],[x+side*.80,y+.78,z],[x+side*.86,y+1.02,z],[x+side*.75,y+1.14,z]],.079);
    for(let i=0;i<8;i++)post(k,i%3?0x996653:0xb29a71,x+.27*Math.sin(i*6.9),y+1.11,z+.16*Math.cos(i*2.3),.012,.36+.15*(i%3));
  }
  function stairScroll(T,k,x,y,z,side){
    // The dragon-shaped end of an actual stone handrail, seen from the
    // southern steps. The relief is simplified at the scale of the scene.
    const silhouette=[[-.82,0],[-.84,.28],[-.66,.46],[-.37,.52],[-.19,.75],[-.26,.91],[-.14,.89],[-.07,1.02],[.06,.89],[.18,.99],[.22,.82],[.53,.78],[.71,.64],[.36,.62],[.58,.47],[.38,.41],[.21,.44],[.08,.31],[.26,.20],[.68,.12],[.76,0]];
    k.outline(silhouette,slab,x-.11,y,z,.22,side*Math.PI/2);
    for(let row=0;row<3;row++)pipe(T,k,edge,[[x+side*.13,y+.22+row*.12,z-.58],[x+side*.13,y+.32+row*.12,z-.35],[x+side*.13,y+.26+row*.12,z-.16]],.028);
  }
  function squareApron(T,k){
    const cross=[[-27,-3,15],[-32,-5,21],[-40,-9,27],[-52,-12,29],[-74,-13,29],[-88,-13.5,24],[-103,-14,16.5],[-127,-14,16.5]];
    const p=[],idx=[],uv=[];
    for(let j=1;j<cross.length;j++){
      const [z0,a,b]=cross[j-1],[z1,c,d]=cross[j],n=Math.ceil((z0-z1)/4);
      for(let m=0;m<n;m++)for(let i=0;i<6;i++){
        const first=p.length/3;
        for(const [v,u] of [[m/n,i/6],[m/n,(i+1)/6],[(m+1)/n,(i+1)/6],[(m+1)/n,i/6]]){
          const z=z0+(z1-z0)*v,lo=a+(c-a)*v,hi=b+(d-b)*v,x=lo+(hi-lo)*u;p.push(x,0,z);uv.push(x,z);
        }idx.push(first,first+1,first+2,first,first+2,first+3);
      }
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    geo.setIndex(idx);geo.computeVertexNormals();const mat=new T.MeshStandardMaterial({color:0xb1aaa1,roughness:.97,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{s.vertexShader='varying vec2 squareMetres;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nsquareMetres=position.xz;');
      s.fragmentShader='varying vec2 squareMetres;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 a=fract(squareMetres/vec2(1.75,1.30));vec2 seam=min(a,1.-a);
        diffuseColor.rgb*=.9+.10*smoothstep(.012,.032,min(seam.x,seam.y));`);};
    const m=new T.Mesh(geo,mat);m.name='Mặt lát Quảng trường Giải phóng';m.receiveShadow=true;k.group.add(m);
    return g=>{const pos=geo.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,g(pos.getX(i),pos.getZ(i))+.18);pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();};
  }
  // In this coordinate system +Z faces the river on both banks. Photo
  // station positions in the views are rotated back to undistorted E/S metres.
  function camera(yaw,name,x,z,h,ex,ez,ey,fov,stage,description){
    const c=Math.cos(yaw),s=Math.sin(yaw),dx=ex-x,dz=ez-z,dy=ey-h;
    return {name,offset:[c*x+s*z,-s*x+c*z],height:Math.max(1,h/.46),viewRadius:Math.hypot(dx,dz,dy),
      viewAngle:yaw+Math.atan2(dx,dz),viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,viewBase:'monument',stage,stageHeight:h,description};
  }
  function foundation(T,k,views,stageFor){
    const ranges=[];
    function piece(stage,build){
      const first=k.vertexCount(),n=k.group.children.length;build();
      const children=k.group.children.slice(n).map(o=>[o,o.position.y]);
      ranges.push([stage,first,k.vertexCount(),children]);
    }
    let mesh,rest;
    k.group.userData.fitGround=g=>{
      mesh??=k.group.children.find(o=>o.geometry?.hasAttribute('finishKind'));
      if(!mesh)return;const pos=mesh.geometry.attributes.position;
      rest??=Float32Array.from({length:pos.count},(_,i)=>pos.getY(i));
      const elevations=stageFor(g),get=s=>typeof s==='function'?s(g):elevations[s];
      for(const [stage,i0,i1,children] of ranges){
        const h=get(stage);for(let i=i0;i<i1;i++)pos.setY(i,rest[i]+h);
        for(const [o,start] of children)o.position.y=start+h;
      }
      pos.needsUpdate=true;mesh.geometry.computeBoundingSphere();mesh.geometry.computeBoundingBox();
      views.forEach(v=>{v.focusAltitude=k.group.position.y+elevations[v.stage]+v.stageHeight;});
    };
    return piece;
  }
  function buildSouth(T,k,views){
    const piece=foundation(T,k,views,g=>({land:Math.max(g(0,-16.9),g(-12,-16),g(12,-16))+.09}));
    k.palette({stone:[slab,edge,paving,basalt],timber:[wood,doors,frame],tile:[tile],brick:[brick]});
    piece('land',()=>{
      // A bank-top promenade and the wide gray flight span different widths.
      band(k,paving,1.5,-1.7,-4.25,49.5,1.77,14.78);
      band(k,slab,1.2,-.49,-12,36.8,.56,9.0);
      k.place(1.5,-10.9,0,()=>hall(T,k,13.0,5.6,false));
      for(const sign of [-1,1])k.place(1.5+sign*11.85,-10.88,0,()=>gallery(T,k,0,0,9.8,4.7,0,false));
      k.place(1.6,-.45,0,()=>gallery(T,k,0,0,44.0,2.7,.36));
      flight(k,1.6,1.3,14.4,45.8,51.1,.18,-3.89,21);
      for(const sign of [-1,1]){
        const a=[1.6+sign*22.95,.39,1.34],b=[1.6+sign*25.62,-3.58,14.42];
        pipe(T,k,basalt,[a,b],.14);
      }
      k.place(1.55,5.18,0,()=>centralCanopy(T,k));
      flight(k,1.55,5.7,17.1,2.40,2.8,-.90,-3.95,17);
      for(const side of [-1,1]){
        const X=1.55+side*1.42;
        for(let j=0;j<6;j++){
          const z=6.4+j*1.75,y=-.94-j*.48;
          panel(T,k,basalt,[[X-.15,y-.34,z],[X-.15,y+.43,z],[X-.15,y+.02,z+1.77],[X-.15,y-.76,z+1.77]]);
          panel(T,k,slab,[[X-.15,y+.43,z],[X+.15,y+.43,z],[X+.15,y+.02,z+1.77],[X-.15,y+.02,z+1.77]]);
        }
        stairScroll(T,k,X,-1.24,8.33,side);
      }
      band(k,edge,1.55,-4.45,17.36,2.9,.70,1.35);
      incense(T,k,1.55,-3.75,17.48);
      for(const sign of [-1,1])for(let j=0;j<2;j++)crescent(T,k,1.5+sign*(27.8+j*35.2),sign);
    });
    for(const [x,z,h,w]of [[-25,-8,8.0,9],[-21,-12,8.3,9],[21,-9,8.1,8],[27,-13,7.4,8],[-37,-12,8.5,9],[39,-12,8,8],[-28,-21,9,9],[32,-21,8,8]]){
      piece(g=>g(x,z),()=>A.trees(T,k,[{x,z,h,width:w}]));
    }
    for(const side of [-1,1])for(let j=0;j<7;j++){
      const x=side<0?-18-j%2*1.7:35-j%2*1.5,z=-34-13.1*j;
      piece(g=>g(x,z),()=>A.trees(T,k,[{x,z,h:6.5+j%3*.65,width:6.45+j%2}]));
    }
    const fit=k.group.userData.fitGround,fitSquare=squareApron(T,k);
    k.group.userData.fitGround=g=>{fit(g);fitSquare(g);};
  }
  function buildNorth(T,k,views){
    const piece=foundation(T,k,views,g=>({plaza:g(0,0)+.12,land:Math.max(g(-9,79),g(8,79),g(0,77))+.09}));
    k.palette({stone:[slab,edge,polished,granite,paving,basalt],tile:[tile],timber:[wood,frame],brick:[brick]});
    piece('plaza',()=>plaza(T,k));
    piece('land',()=>{
      // Gate and court on the east of the circular road, separated from the
      // planted mound by the drivable roundabout w718100361.
      band(k,paving,-2,-.92,72,32,.99,32);
      for(const x of [-15,-7,3,11]){
        band(k,slab,x,.07,56.1,1.06,.49,1.06);band(k,edge,x,.56,56.1,.49,2.48,.49);
        band(k,slab,x,3.04,56.1,.69,.18,.69);
      }
      band(k,slab,-2,-2.62,92.45,32.3,2.70,16.35);k.place(-2,95,0,()=>hall(T,k,17.3,8.9,true));
      for(let j=0;j<5;j++)for(let i=-9;i<9;i++){
        const xx=-2+i*1.10+(j%2)*.55;
        k.box(j%3?0x90938f:0x9da09b,xx,-2.24+j*.44,100.647,1.06,.41,.065);
      }
      // Upper court in front of the hall is reached from independent flights
      // on either side. A narrow neck continues to the submerged octagon.
      for(const side of [-1,1]){
        const xx=-2+side*12.4;
        flight(k,xx,96.5,107.4,6.1,6.9,.50,-2.11,16);
        rail(k,-2+side*17.0,102.95,-2+side*17.0,107.9,-2.18,.75);
        const inner=-2+side*16.3,outer=-2+side*36.2;
        panel(T,k,brick,[[inner,.04,91.1],[outer,.04,91.4],[outer,-3.66,109.4],[inner,-3.66,108.7]]);
        panel(T,k,basalt,[[inner,-3.66,108.7],[outer,-3.66,109.4],[outer,-5.5,109.4],[inner,-5.5,108.7]]);
        panel(T,k,slab,[[outer,.04,91.4],[outer,-3.66,109.4],[outer,-5.5,109.4],[outer,-5.5,91.4]]);
        rail(k,inner,91.0,outer,91.0,.08,.62);
      }
      band(k,slab,-2,-3.95,104.65,33.85,1.88,6.7);rail(k,-18.9,108.05,-5.2,108.05,-2.05);rail(k,1.2,108.05,15.0,108.05,-2.05);
      band(k,slab,-2,-4.26,110.87,3.95,2.05,7.75);
      for(const side of [-1,1])rail(k,-2+side*1.93,107.85,-2+side*1.93,114.35,-2.19,.66);
      disc(T,k,basalt,-2,-6.0,117.0,10.14,10.14,1.70,8,Math.PI/8);
      for(let i=0;i<8;i++)disc(T,k,i%3===0?edge:slab,-2,-4.35+i*.22,117.0,10.15-i*.54,10.15-i*.54,.24,8,Math.PI/8);
      stele(T,k,-2,-2.56,116.45);
    });
    // OSM maps eleven trees inside the roundabout. The two gaps face the
    // paths which cross the grass. The bank row is visible in Hồ Cầu's aerial.
    const yaw=1.244,c=Math.cos(yaw),s=Math.sin(yaw);
    const planted=[[-22.2,-20],[-10.7,-27.2],[4.3,-29.4],[17.7,-25.1],[32.1,-.6],[31,12.4],[21.5,26.1],[-.3,33.8],[-15.3,29.6],[-25.3,19.7],[-31,5.6]];
    planted.forEach(([X,Z],i)=>{
      const x=c*X-s*Z,z=s*X+c*Z;
      piece('plaza',()=>A.trees(T,k,[{x,y:.58,z,h:2.35+i%3*.26,width:2.8+i%2*.3}]));
    });
    for(const [x,z,h,w]of [[-28,79,8.6,9],[-22,84,8.5,8],[-36,88,8.2,9],[20,80,8.3,8],[25,84,8,7],[37,86,8.6,9],[-23,67,7,9],[24,63,7,8]]){
      piece(g=>g(x,z),()=>A.trees(T,k,[{x,z,h,width:w}]));
    }
  }
  const southYaw=-1.875,northYaw=1.244;
  const defs=[
    {id:'ben-tha-hoa-bo-nam-thach-han',catalogId:'osm-node-14309236352',name:'Nhà hành lễ và bến thả hoa bờ Nam sông Thạch Hãn',lon:107.185118,lat:16.754817,
      yaw:southYaw,width:52,depth:34,gardenRadius:27,kind:'Di tích',start:[107.185303,16.754760],source:southSource,photo:southPhoto,
      reserve:(x,z,r)=>Math.abs(x-1.5)<52+r&&z>-17-r&&z<19+r||x>-20-r&&x<35+r&&z>-127-r&&z< -28+r,solids:[[1.5,-10.9,6.2,2.7]],
      description:'Nhà hành lễ nằm giữa Quảng trường Giải phóng và sông Thạch Hãn. Dãy hành lang ngói mở về phía thang đá để người dân xuống thả hoa tưởng niệm.',
      arrivalNote:'Xe dừng trên đường Ngô Quyền cạnh quảng trường. Từ đây đi bộ qua nhà hành lễ, theo dãy hành lang xuống bến.',
      views:[{...camera(southYaw,'Mặt nhà hành lễ từ Ngô Quyền',1.5,-10.9,2.6,5.8,-30,2.25,61,'land','Mặt gỗ và biển nhà hành lễ hướng về quảng trường. Hai cánh nhà thấp hơn nối tiếp gian giữa.'),
          photoCatalogId:'osm-node-14309236352',photo:'https://commons.wikimedia.org/?curid=102973338'},
        {...camera(southYaw,'Hành lang và thang đá nhìn từ sông',1.5,-2.1,1.42,6.8,44.5,8.85,61,'land','Từ phía sông có thể thấy hai dải thang rộng và mái che giữa bến. Nhà hành lễ đứng phía sau hành lang.'),
          photoCatalogId:'quang-tri-hanh-lang-ben-nam',photo:'https://commons.wikimedia.org/?curid=102973635'},
        {...camera(southYaw,'Từ lư hương nhìn sang An Đôn',1.55,45,-6.30,2.35,11.8,-.48,62,'land','Lư hương đá đặt ở đầu lối thang giữa. Nhìn qua lư hương và lòng sông là bến tưởng niệm bên An Đôn.'),
          photoCatalogId:'quang-tri-tu-ben-nam-nhin-an-don',photo:'https://commons.wikimedia.org/?curid=102974348'}],make:buildSouth},
    {id:'tuong-dai-bo-bac-thach-han',catalogId:'osm-node-10605991202',name:'Tượng đài và bến thả hoa bờ Bắc sông Thạch Hãn',lon:107.181798,lat:16.755899,
      yaw:northYaw,width:70,depth:130,gardenRadius:33,kind:'Đài tưởng niệm',start:[107.1823027,16.7562374],source:northSource,photo:northPhoto,
      reserve:(x,z,r)=>Math.hypot(x,z)<35+r||Math.abs(x+2)<39+r&&z>54-r&&z<128+r,solids:[[0,0,2.9,2.9]],
      description:'Tác phẩm đá cao 21 m của Nguyễn Quốc Thắng đứng trên gò tròn ở An Đôn. Từ tượng đài đi về phía sông sẽ gặp đền tưởng niệm và bến đá tám cạnh.',
      arrivalNote:'Xe dừng trên nhánh đường dân cư phía đông bắc vòng xuyến. Từ đây đi bộ tới sân tượng, hoặc theo lối ven bờ xuống bến thả hoa.',
      views:[{...camera(northYaw,'Tượng đá trên gò tròn',0,0,12.1,-2.2,-38,3.65,49,'plaza','Phần chân có vòm xuyên sáng, phía trên là các nhóm hình người và những lớp gờ đá đỡ thân tháp.'),
          photoCatalogId:'osm-node-10605991202',photo:northSource},
        {...camera(northYaw,'Đền tưởng niệm và bến tám cạnh',-2,98,.75,20,153,9.2,57,'land','Từ phía sông nhìn thấy hai thang xuống sân dưới và lối hẹp dẫn ra bến tám cạnh. Tượng đài nằm sau đền.'),
          photoCatalogId:'quang-tri-den-ben-bac',photo:'https://commons.wikimedia.org/?curid=102974023'},
        {...camera(northYaw,'Bia đá và bậc xuống nước',-2,116.9,-1.55,5.4,131.0,-.16,62,'land','Những cấp đá xếp thành tám cạnh quanh tấm bia trước bến. Phía sau là sân thấp và đền mái ngói.'),
          photoCatalogId:'quang-tri-bia-ben-bac',photo:northPhoto}],make:buildNorth}
  ];
  for(const def of defs){
    const {make,...data}=def,pin=window.VietnamTourism?.entries?.find(p=>p.id===data.catalogId);
    sites.push({...pin,...data,city:'Quảng Trị',province:'Quảng Trị',mappedEntrance:true,visitOnArrival:true,viewDistance:870,
      approachMeters:undefined,map:'https://www.openstreetmap.org/node/'+data.catalogId.slice(9),build(T,k){make(T,k,data.views);}});
  }
})();

export default window.VietnamSights;
