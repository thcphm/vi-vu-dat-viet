'use strict';
(()=>{
  const id='tuong-dai-ben-tau-khong-so-vung-ro',catalogId='osm-node-4292019089',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  const source='https://baotintuc.vn/ve-tham-vung-ro-post548975.html',photo='https://daklakvrtour.com/tour/116/index.html#node8';
  // The Atlas pin marks the main precinct. Its monument occupies the NE
  // end of the ceremonial walk. The separate waterside memorial further
  // east is OSM n12382639867. RIARP/Phú Yên GIS inventory PY.747 identifies
  // the precinct; the plan below is measured on the visible aerial outlines.
  // TTXVN (2021), Tiền Phong's front and starboard photographs
  // https://tienphong.vn/post-1586951.tpo and node8 of the 27 Nov 2024
  // tour identify the perforated prow, wheel, flame and folded reliefs.
  // Verticals, clipped landscaping and sculptural details are estimates.
  const yaw=-.67,c=Math.cos(yaw),s=Math.sin(yaw),pi=Math.PI;
  const chalk=0xd8e0dc,white=0xe7e9e1,pink=0xe9adb7,rose=0xdd97a0,gold=0xd8ab49,brass=0xc19b4f,
    granite=0x956d65,trim=0xb08a7b,black=0x545654,edge=0x737675,rock=0x81746a,apron=0xb6a183;
  const court=[[-19.8,9.8],[-15.4,2.8],[-18.7,-3.3],[-17.3,-7],[-11.4,-10],[-7.6,-11.6],[-3,-12.2],[2.4,-12.9],
    [7.1,-11.9],[12.5,-9.8],[15.5,-7.8],[14.6,-4.4],[20.3,1.5],[21.0,7.8],[16.6,12.2],[12.3,11.8],
    [8.7,16.0],[5.8,17.8],[-7.8,17.5],[-11.2,14.6],[-14.4,12.7],[-16.5,9.6]];
  const deck=[[-12.6,-3.9],[-8.7,-4.3],[-8.5,-6.5],[-3.2,-8.6],[4.9,-8.45],[10.5,-5.9],
    [10.0,-3.1],[9.8,-.98],[5.9,-.7],[4.1,2.3],[-2.8,2.3],[-5.9,-.65],[-9.7,-.98],[-9.9,-3.15]];
  function slab(T,k,path,bottom,top,colour){
    const shape=new T.Shape(path.map(([x,z])=>new T.Vector2(x,-z)));
    const geo=new T.ExtrudeGeometry(shape,{depth:top-bottom,bevelEnabled:false});
    geo.rotateX(-pi/2);k.stamp(geo,colour,0,bottom,0);geo.dispose();
  }
  function bow(T,k){
    // An open bent architectural screen. Each circular opening is punched
    // through the masonry, with an applied anchor below it on that face.
    const start=1.34,run=10.5;
    function faceAt(sign,u){
      const t=u/run,x=sign*(7.12*t+.51*t*(1-t)),z=7.82-7.82*t-.55*t*(1-t);
      const dx=sign*(7.12+.51*(1-2*t)),dz=-7.82-.55*(1-2*t),length=Math.hypot(dx,dz);
      return {x,z,nx:sign*-dz/length,nz:Math.abs(dx)/length};
    }
    const floorLine=[];
    for(let i=0;i<=32;i++){
      const a=pi*i/32;floorLine.push([.38-7.84*Math.cos(a),-.18+8.57*Math.sin(a)]);
    }
    floorLine.push([8.22,-2.0],[-7.46,-2.0]);
    slab(T,k,floorLine,.916,1.30,rock);slab(T,k,floorLine,1.30,start,trim);
    for(const sign of [-1,1]){
      const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(run,0);sh.lineTo(run,2.28);
      sh.quadraticCurveTo(run*.46,3.67,0,4.13);sh.closePath();
      const hole=new T.Path();hole.absarc(2.28,2.54,.45,0,2*pi,true);sh.holes.push(hole);
      const geo=new T.ExtrudeGeometry(sh,{depth:.30,bevelEnabled:false,curveSegments:18}),pos=geo.attributes.position;
      for(let i=0;i<pos.count;i++){
        const q=faceAt(sign,pos.getX(i)),d=pos.getZ(i)-.30,py=pos.getY(i);
        pos.setXYZ(i,q.x+q.nx*d,py+start,q.z+q.nz*d);
      }
      // Unindexed extrusion faces of the mirrored half need reversed winding.
      if(sign<0)for(let i=0;i<pos.count;i+=3){
        const ax=pos.getX(i),ay=pos.getY(i),az=pos.getZ(i);
        pos.setXYZ(i,pos.getX(i+2),pos.getY(i+2),pos.getZ(i+2));pos.setXYZ(i+2,ax,ay,az);
      }
      geo.computeVertexNormals();k.stamp(geo,chalk,0,0,0);geo.dispose();
      const p=faceAt(sign,2.28);
      k.place(p.x+.022*p.nx,p.z+.022*p.nz,Math.atan2(p.nx,p.nz),()=>{
        const a=new T.Shape();
        a.moveTo(-.105,1.15);a.lineTo(-.105,.11);a.quadraticCurveTo(-.51,.19,-.64,.51);
        a.lineTo(-.48,.52);a.lineTo(-.85,.83);a.lineTo(-.98,.32);a.lineTo(-.79,.42);
        a.quadraticCurveTo(-.63,-.04,-.18,-.15);a.lineTo(0,-.36);a.lineTo(.18,-.15);
        a.quadraticCurveTo(.63,-.04,.79,.42);a.lineTo(.98,.32);a.lineTo(.85,.83);a.lineTo(.48,.52);
        a.lineTo(.64,.51);a.quadraticCurveTo(.51,.19,.105,.11);a.lineTo(.105,1.15);a.closePath();
        k.profile(a,brass,0,2.34,.01,.12);
        const ring=new T.TorusGeometry(.167,.074,8,26);k.stamp(ring,gold,0,3.46,.108);ring.dispose();
      });
    }
  }
  function flame(T,k){
    const x=.65,z=-4.0;
    k.place(x,z,0,()=>{
      k.box(granite,0,3.14,0,2.8,2.15,2.65);k.box(trim,0,4.30,0,2.9,.23,2.74);
      k.tapered(granite,0,4.62,0,2.1,2.77,.48,.93,4);
      k.tapered(trim,0,5.10,0,2.77,1.63,.50,.93,4);
      k.tapered(white,0,5.62,0,1.19,.93,.55,.85,4);
      k.box(0x515754,0,5.60,.77,.71,.39,.034);
      // The paired blades are set one behind the other. The smaller curl
      // joins below the larger one and leaves daylight around the wheel.
      const mast=new T.Shape();mast.moveTo(-.39,0);mast.lineTo(-.36,6.95);mast.quadraticCurveTo(-.34,7.50,-.24,7.62);
      mast.lineTo(-.04,7.51);mast.lineTo(.00,7.93);mast.quadraticCurveTo(.07,8.35,.19,8.45);
      mast.lineTo(.30,8.49);mast.lineTo(.30,.18);mast.closePath();
      k.profile(mast,white,0,5.80,-.20,.32);
      const l=new T.Shape();l.moveTo(-.94,.05);l.bezierCurveTo(-1.97,.32,-2.72,1.14,-2.62,2.24);
      l.bezierCurveTo(-2.52,3.18,-1.87,3.85,-1.34,4.45);l.bezierCurveTo(-.57,5.39,-.63,6.20,-.92,6.66);
      l.bezierCurveTo(-.18,5.96,.12,5.15,-.23,4.30);l.bezierCurveTo(-.59,3.35,-1.12,2.71,-1.07,2.14);
      l.bezierCurveTo(-.97,1.68,-.42,1.36,.20,1.47);l.quadraticCurveTo(.15,.95,-.36,.83);l.quadraticCurveTo(-.72,.60,-.94,.05);
      k.profile(l,pink,0,5.77,.08,.36);
      const r=new T.Shape();r.moveTo(.87,.05);r.bezierCurveTo(1.91,.27,2.49,1.29,2.43,2.35);
      r.bezierCurveTo(2.38,3.22,1.73,3.73,1.20,4.17);r.quadraticCurveTo(.73,4.66,.87,5.02);
      r.bezierCurveTo(.23,4.58,.36,4.12,.77,3.55);r.bezierCurveTo(1.60,2.30,1.14,1.61,.23,1.30);
      r.quadraticCurveTo(-.22,1.10,.08,.76);r.bezierCurveTo(.44,.68,.67,.72,.87,.05);
      k.profile(r,rose,0,5.81,-.02,.36);
      const wheel=new T.TorusGeometry(.65,.082,9,40);k.stamp(wheel,gold,0,8.33,.47);wheel.dispose();
      const hub=new T.CylinderGeometry(.13,.13,.19,20);k.stamp(hub,gold,0,8.33,.47,1,1,1,0,pi/2);hub.dispose();
      for(let i=0;i<8;i++){
        const a=pi*i/4;k.box(gold,.41*Math.sin(a),8.33+.41*Math.cos(a),.47,.062,.80,.094,0,0,-a);
        k.box(brass,.82*Math.sin(a),8.33+.82*Math.cos(a),.47,.096,.13,.12,0,0,-a);
      }
      const star=new T.Shape();
      for(let i=0;i<10;i++){const a=pi/2+i*pi/5,r=i%2?.091:.20;star[i?'lineTo':'moveTo'](r*Math.cos(a),r*Math.sin(a));}
      star.closePath();k.profile(star,gold,0,11.50,.13,.055);
    });
  }
  function reliefTexture(T,side){
    // Original, schematic relief strokes. The photographed panels show a
    // ship on waves at one end and people working together on shore.
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=200;
    const ctx=canvas.getContext('2d'),bg=ctx.createLinearGradient(0,0,0,200);
    bg.addColorStop(0,'#e6c077');bg.addColorStop(.52,'#dab15f');bg.addColorStop(1,'#bd9652');
    ctx.fillStyle=bg;ctx.fillRect(0,0,1024,200);ctx.lineJoin=ctx.lineCap='round';
    function embossed(draw,w){
      for(const [d,tint] of [[2.4,'#8e6a37'],[-1.3,'#e9cb7f'],[0,'#c9a15a']]){
        ctx.save();ctx.translate(d*.5,d);ctx.strokeStyle=tint;ctx.lineWidth=w;ctx.beginPath();draw(ctx);ctx.stroke();ctx.restore();
      }
    }
    for(let y=140;y<=193;y+=11)embossed(p=>{
      p.moveTo(0,y);for(let x=0;x<1024;x+=38)p.bezierCurveTo(x+12,y-12,x+24,y-12,x+38,y);
    },2.4);
    {
      const x=side<0?75:746;
      embossed(p=>{p.moveTo(x,102);p.quadraticCurveTo(x+45,116,x+151,107);p.lineTo(x+127,143);
        p.quadraticCurveTo(x+48,152,x+23,132);p.lineTo(x,102);p.moveTo(x+56,112);p.lineTo(x+59,80);
        p.lineTo(x+103,79);p.lineTo(x+112,112);p.moveTo(x+74,76);p.lineTo(x+74,45);},4.8);
    }
    for(let j=0;j<13;j++){
      const x=(side<0?244:55)+j*37,y=62+Math.sin(j*1.81+side)*13,tilt=Math.sin(j*1.3+side)*7;
      embossed(p=>{p.moveTo(x+6,y);p.arc(x,y,6,0,2*pi);p.moveTo(x-1,y+9);
        p.lineTo(x-7+tilt,y+42);p.lineTo(x+10+tilt,y+44);p.lineTo(x+7,y+9);p.lineTo(x-1,y+9);
        p.moveTo(x+2,y+17);p.lineTo(x+17,y+26);p.lineTo(x+26,y+16);
        p.moveTo(x-2+tilt,y+43);p.lineTo(x-10,y+73);p.lineTo(x-16,y+84);
        p.moveTo(x+6+tilt,y+45);p.lineTo(x+15,y+76);p.lineTo(x+21,y+83);},3.7);
    }
    for(let j=0;j<3;j++){
      const x=(side<0?769:578)+j*35,y=134-(j%2)*23;
      embossed(p=>{p.moveTo(x,y);p.lineTo(x+30,y);p.lineTo(x+30,y-20);p.lineTo(x,y-20);
        p.closePath();p.moveTo(x+4,y-4);p.lineTo(x+25,y-17);},3.9);
    }
    for(let j=0;j<9;j++){
      const x=19+j*119,y=25+12*Math.cos(j*1.7);embossed(p=>{p.moveTo(x,y+8);
        p.bezierCurveTo(x+7,y-1,x+16,y-2,x+25,y+1);p.bezierCurveTo(x+51,y-11,x+64,y+1,x+77,y+5);},2.6);
    }
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;return map;
  }
  function wings(T,k){
    for(const side of [-1,1]){
      const tex=reliefTexture(T,side),mat=new T.MeshStandardMaterial({map:tex,bumpMap:tex,bumpScale:.055,roughness:.73,metalness:.13});
      const points=side<0?[[-14.5,-4.30],[-9.1,-6.72],[-3.2,-8.55]]:[[3.3,-8.42],[9.1,-6.80],[14.4,-4.08]];
      for(let i=1;i<points.length;i++){
        const [x1,z1]=points[i-1],[x2,z2]=points[i],dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx);
        k.place((x1+x2)/2,(z1+z2)/2,angle,()=>{
          k.box(white,0,2.10,0,len+.035,2.36,.31);k.box(rose,0,3.32,.01,len+.05,.083,.34);
          const geo=new T.PlaneGeometry(len-.035,1.46),uv=geo.attributes.uv;
          for(let j=0;j<uv.count;j++)uv.setX(j,((i-1)+uv.getX(j))*.5);
          const panel=new T.Mesh(geo,mat);panel.position.set(0,2.56,.164);panel.receiveShadow=true;k.group.add(panel);
        });
      }
    }
  }
  function stairs(T,k){
    // The broad red risers connect the axial walk to the apron.
    for(let i=0;i<6;i++){
      const h=(6-i)*.154,z=17.08+i*.445;
      k.box(granite,-.83,h*.5,z,10.90,h,.51);
      for(const sign of [-1,1])k.box(black,-.83+sign*6.25,h*.5,z,1.61,h,.51);
    }
    slab(T,k,deck,.91,2.14,black);
    for(const sign of [-1,1]){
      // Front and outside share their descending treads, as seen from
      // the relief end of each stair. Keep the landings open on top.
      for(let i=0;i<7;i++){
        const top=2.14-i*.174,outer=10.0+i*.48,z=-.62+i*.57,inner=4.91-.07*i,back=-3.54;
        const w=outer-inner;k.box(black,sign*(inner+w*.5),(.91+top)*.5,(back+z)*.5,w,top-.91,z-back);
        k.box(edge,sign*(inner+w*.5),top-.021,z+.015,w,.043,.043);
        k.box(edge,sign*(outer+.012),top-.021,(back+z)*.5,.043,.043,z-back);
      }
    }
  }
  function plaza(T,k){
    slab(T,k,court,-.58,.916,apron);
    // Thin scored squares avoid an unscaled single surface around the monument.
    const shape=new T.Shape(court.map(([x,z])=>new T.Vector2(x,-z))),pavement=new T.ShapeGeometry(shape);
    pavement.rotateX(-pi/2);const material=new T.MeshStandardMaterial({color:0xc0a98b,roughness:.90});
    material.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec2 tiles;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntiles=position.xz;');
      sh.fragmentShader='varying vec2 tiles;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 q=tiles*1.4,gap=min(fract(q),1.-fract(q));
        float pavingFace=smoothstep(.007,.007+max(fwidth(q.x),fwidth(q.y))*.46,min(gap.x,gap.y));
        float grain=fract(sin(dot(floor(q*32.),vec2(11.17,83.41)))*45261.);
        diffuseColor.rgb*=mix(.83,.95+.06*grain,pavingFace);`);
    };
    const paving=new T.Mesh(pavement,material);paving.receiveShadow=true;paving.position.y=.926;k.group.add(paving);
    stairs(T,k);bow(T,k);flame(T,k);wings(T,k);
  }
  function approach(T,k){
    const p=[],uv=[],indices=[],rows=41,cols=9;
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const t=j/rows,z=18.55+t*56,mid=-.85-t*.95,w=14.3+t*2.0,x=mid+(i/cols-.5)*w;
      const n=p.length/3;p.push(x,0,z);uv.push(x,z);
      if(i&&j)indices.push(n-cols-2,n-1,n,n-cols-2,n,n-cols-1);
    }
    const g=new T.BufferGeometry(),pos=new T.Float32BufferAttribute(p,3);
    g.setAttribute('position',pos);g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
    const mat=new T.MeshLambertMaterial({color:0xb89983});
    mat.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec2 streetUV;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nstreetUV=uv;');
      sh.fragmentShader='varying vec2 streetUV;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 q=streetUV*1.57,j=min(fract(q),1.-fract(q));
        float tooth=smoothstep(.008,.019+max(fwidth(q.x),fwidth(q.y))*.5,min(j.x,j.y));
        float grain=fract(sin(dot(floor(q*24.),vec2(37.11,8.43)))*15583.);
        diffuseColor.rgb*=mix(.68,.93+.09*grain,tooth);`);
    };
    const mesh=new T.Mesh(g,mat);mesh.name='Đường dạo Bãi Chùa';mesh.receiveShadow=true;k.group.add(mesh);
    return (land,level)=>{
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i),z=pos.getZ(i),t=Math.max(0,Math.min(1,(z-19.62)/25)),h=land(x,z);
        pos.setY(i,Math.max(h+.066,level+.066+(h-level)*t*t*(3-2*t)));
      }
      pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
    };
  }
  function plantedBank(T,k){
    // The real forecourt was cut out of a wooded slope. A coarse relief
    // tile instead falls away steeply below the front steps. Tie both the
    // outer paving and the axial walk into the adjoining planted ground.
    const p=[],idx=[],weights=[],cols=49,rows=67;
    const ease=v=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
    function distance(x,z){
      let near=Infinity,inside=false;
      for(let i=0;i<court.length;i++){
        const [ax,az]=court[i],[bx,bz]=court[(i+1)%court.length],dx=bx-ax,dz=bz-az;
        const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
        near=Math.min(near,Math.hypot(x-ax-t*dx,z-az-t*dz));
        if((az>z)!==(bz>z)&&x<ax+(z-az)*dx/dz)inside=!inside;
      }
      return inside?0:near;
    }
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const z=-27+105*j/rows,x=-36+72*i/cols,n=p.length/3;
      const d=distance(x,z),front=ease((z-14.8)/4.4)*(1-ease((Math.abs(x+.83)-6.3)/3.5));
      const courtFill=1-ease(d/13.7),walkFill=(1-ease((Math.abs(x+1.0)-7.7)/11.0))
        *ease((z-14.5)/4.5)*(1-ease((z-70.5)/5.0));
      weights.push([courtFill,front,walkFill,1-ease((z-19.62)/25)]);
      p.push(x,0,z);if(i&&j)idx.push(n-cols-2,n-1,n,n-cols-2,n,n-cols-1);
    }
    const geo=new T.BufferGeometry(),pos=new T.Float32BufferAttribute(p,3);
    geo.setAttribute('position',pos);geo.setIndex(idx);geo.computeVertexNormals();
    const mat=new T.MeshLambertMaterial({color:0x68804b});
    mat.onBeforeCompile=sh=>{
      sh.vertexShader='varying vec2 bankUV;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbankUV=position.xz;');
      sh.fragmentShader='varying vec2 bankUV;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float growth=sin(bankUV.x*.66+cos(bankUV.y*.47))*sin(bankUV.y*.36+bankUV.x*.13);
        float litter=fract(sin(dot(floor(bankUV*8.),vec2(23.72,56.81)))*31978.);
        diffuseColor.rgb*=.92+.12*growth+.13*litter;`);
    };
    const mesh=new T.Mesh(geo,mat);mesh.receiveShadow=true;mesh.name='Sườn đất tiếp giáp sân lễ';k.group.add(mesh);
    return (land,level)=>{
      for(let i=0;i<pos.count;i++){
        const [wc,front,wp,wz]=weights[i],x=pos.getX(i),z=pos.getZ(i),g=land(x,z);
        const slope=Math.max(wc*(level+.78*(1-front)-g),wp*wz*(level-g));
        pos.setY(i,g+Math.max(0,slope)-.055);
      }
      pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();
    };
  }
  function treesAt(T,k){
    const trees=createTreeModels(T),rows=[[],[],[]],pose=new T.Object3D();
    const rand=n=>{const q=Math.sin(n*721.23+.71)*43324.9;return q-Math.floor(q);};
    // North and east rise into the wooded spur. Do not plant the cleared
    // ceremonial walk or the road which passes west of the terrace.
    for(let j=0;j<13;j++)for(let i=0;i<22;i++){
      const n=j*22+i,x=(i-10.8)*5.1+2.8*rand(n),z=-16.0-j*5.8-3.8*rand(n+251);
      if(x< -31&&z>-35)continue;
      const h=4.9+5.0*rand(n+321),w=h*(.96+.40*rand(n+181));
      rows[n%3].push([x,z,h,w,rand(n+719)*6.28]);
    }
    for(const [x,z,h,w] of [[-19,1,6,6.7],[-18,8,4.8,5.4],[-24,14,6,7.7],[-24,22,5.7,6.7],[-23,33,8,9.1],
      [-16,35,5.9,7.1],[-17,44,7,8],[-20,51,8.6,10],[-23,57,7.2,9],[20,8,7.7,8.5],
      [22,13,6.2,7],[25,15,8.2,8.5],[29,3,6.2,7.4],[31,20,8,8.9],[32,27,9.1,10],[34,37,9,10.2],
      [29,35,6.4,6.6],[22,35,7.4,8],[25,45,8.1,8.7],[17,44,7.6,9],[20,53,5.5,6.3],[27,56,6.2,7]]){
      const n=Math.round(x*17+z*7);rows[Math.abs(n)%3].push([x,z,h,w,rand(n)*6.28]);
    }
    const sets=rows.map((points,i)=>{
      const m=new T.InstancedMesh(trees.geometry('tree',true,i),trees.material,points.length);
      m.name='Sườn rừng sau tượng đài';m.castShadow=m.receiveShadow=true;k.group.add(m);return m;
    });
    return ground=>{
      rows.forEach((points,i)=>{
        points.forEach(([x,z,h,w,a],j)=>{
          pose.position.set(x,ground(x,z),z);pose.rotation.set(0,a,0);pose.scale.set(w,h,w);pose.updateMatrix();sets[i].setMatrixAt(j,pose.matrix);
        });
        sets[i].instanceMatrix.needsUpdate=true;sets[i].computeBoundingSphere();
      });
    };
  }
  function build(T,k){
    k.palette({plaster:[chalk,white,pink,rose],stone:[granite,trim,black,edge,rock,apron],metal:[brass,gold]});
    const fixed=k.place(0,0,0,()=>plaza(T,k)).map(m=>[m,m.position.y]);
    const fitPath=approach(T,k),fitLand=plantedBank(T,k),fitTrees=treesAt(T,k);
    // Give the platform its level finish against the coarse hillside DEM.
    // Its front steps meet the lower graded approach. All sculptural and
    // relief meshes use the single, shared platform elevation.
    let baked;
    k.group.userData.fitGround=land=>{
      if(!baked)baked=k.group.children.find(o=>o.geometry?.hasAttribute('finishKind'));
      const level=Math.max(land(0,0)+.035,...court.map(([x,z])=>land(x,z)-.82),land(-7.8,19.7),land(6.2,19.7));
      baked.position.y=level;
      for(const [part,y] of fixed)part.position.y=y+level;
      fitPath(land,level);fitLand(land,level);fitTrees(land);
    };
  }
  function view(name,x,z,height,radius,angle,elevation,fov=48){
    return {name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius:radius,viewAngle:yaw+angle,viewElevation:elevation,viewFov:fov,viewBase:'monument'};
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Đài tưởng niệm Bến tàu Không số Vũng Rô',kind:'Di tích',
    lon:109.4199423,lat:12.8778290,yaw,width:39,depth:36,source,photo,map:'https://www.openstreetmap.org/node/4292019089',
    start:raw?.start??[109.4191949,12.8776377],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    solids:[],reserve:(x,z,r)=>(Math.abs(x)<21+r&&z>-14-r&&z<20+r)||(Math.abs(x+1)<9+r&&z>=19-r&&z<75+r),
    description:'Ở cuối sân lễ Bãi Chùa, hai mỏ neo vàng gắn lên mũi tàu trắng. Biểu tượng ngọn lửa ôm lấy bánh lái trên bệ đá đỏ. Bậc đá sẫm dẫn lên hai dải phù điêu kể chuyện người trên bờ và những chuyến tàu. Chiều cao và các nét phù điêu được ước dựng theo ảnh thực địa.',
    arrivalNote:'Xe dừng trên Quốc lộ 29, cạnh lối vào khu di tích. Từ cổng, đi bộ khoảng 110 m theo lối lát qua sân để đến đài tưởng niệm. Nhà tưởng niệm liệt sĩ nằm xa hơn về phía đông, sát bờ vịnh.',
    views:[view('Hai mỏ neo ở đầu mũi tàu',.16,.35,13.7,28.3,-.027,-.025),
      view('Bậc đá và bánh lái trên bệ đỏ',.25,-2.45,11.3,25.8,1.02,.12),
      view('Trục sân lễ nhìn về sườn rừng Bãi Chùa',-.25,6.9,10.6,56.0,-.40,.47,50)],build});
})();
