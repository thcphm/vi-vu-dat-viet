'use strict';
(()=>{
  const id='dai-tuong-niem-nui-nhan',catalogId='osm-node-4518976294',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(e=>e.id===catalogId);
  if(!raw)return;
  const lon=109.3003639,lat=13.0803446,yaw=1.958,c=Math.cos(yaw),s=Math.sin(yaw);
  const tour='https://daklakvrtour.com/tour/42/index.html';
  const source='https://www.tapchikientruc.com.vn/chuyen-muc/kientruc-xahoi/nhung-cau-chuyen-kien-truc-dang-de-suy-ngam.html';
  // Lê Hiệp's own description (third essay): the final memorial turns to
  // face the old Cham tower; the birds are expressed in the elevation.
  // The earlier three-figure sculpture did not enter the built scheme.
  // Opening-day reporting gives 30 m height and ca. 500 m² floor area.
  // https://phuyen.baodaklak.vn/93/12475/khanh-thanh-dai-tuong-niem-nui-nhan.html
  // Axes/dimensions are estimates from the Esri roof outline, the architect
  // association's side photographs, and provincial 360s. In particular the
  // site has no OSM building polygon or published dimensioned section.
  // https://ktspy.blogspot.com/2012/04/kts-le-hiep-va-ai-tuong-niem-nui-nhan.html
  // https://khoakientruc.muce.edu.vn/include/details.asp?id=1366
  // The field photographs show 38 local and four other rolls of honour.
  // https://www.noichinh.vn/tin-hoat-dong/202504/dong-chi-truong-ban-noi-chinh-trung-uong-tri-an-cac-anh-hung-liet-si-tai-nui-nhan-trong-ngay-lich-su-cua-phu-yen-314641/
  const front=12.7,back=-14.8,half=8.9,floor=.59,ceiling=4.63;
  const white=0xe2dfd0,light=0xeee9d8,shadow=0xc5c4b9,granite=0x8b8d83,
    red=0x8c5244,bronze=0x594e40,gold=0xc7aa6a,glass=0x737e7b;
  const point=(x,z)=>[c*x+s*z,-s*x+c*z];
  function view(name,tx,tz,eyeX,eyeZ,height,raise,fov,pano){
    const t=point(tx,tz),e=point(eyeX,eyeZ),dx=e[0]-t[0],dz=e[1]-t[1];
    return {name,offset:t,viewAngle:Math.atan2(dx,dz),viewRadius:Math.hypot(dx,dz,raise),
      viewElevation:Math.atan2(raise,Math.hypot(dx,dz)),height:height/.46,viewFov:fov,viewBase:'monument',photo:tour+'#node'+pano};
  }
  const viewHeights=[13.9,13.6,2.28,2.69];
  const views=[view('Từ sân ngôi sao nhìn lên tháp đài',0,4.8,-6.2,53,viewHeights[0],-3.3,55,2),
    view('Những lớp cánh nhạn bên sườn núi',0,1.4,25,45.2,viewHeights[1],-4.5,55,2),
    view('Lối giữa các trụ ghi danh',0,-8.9,.05,6.65,2.28,.08,65,3),
    view('Bàn thờ trong nhà bia',0,-13.53,.02,-9.98,2.69,.04,46,3)];
  function plaque(T,k,lines,x,y,z,w,h,bg,fg){
    const canvas=document.createElement('canvas');canvas.width=768;canvas.height=216;
    const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,768,216);
    ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='bold 47px "Times New Roman",serif';
    lines.forEach((l,i)=>ctx.fillText(l,384,58+i*89,727));
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
    const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshLambertMaterial({map}));
    mesh.position.set(x,y,z);k.group.add(mesh);
  }
  function slopedProfile(T,k,points,x,thickness,tint){
    // Profile in longitudinal z / elevation. Both flat faces and the narrow
    // rim are visible between successive white concrete fins.
    const shape=new T.Shape(points.map(([z,y])=>new T.Vector2(-z,y)));
    const g=new T.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false});
    g.rotateY(Math.PI/2);k.stamp(g,tint,x-thickness/2,0,0);g.dispose();
  }
  function elevation(T,k,poly,colour,z,depth){
    const shape=new T.Shape(poly.map(([x,y])=>new T.Vector2(x,y)));
    k.profile(shape,colour,0,0,z,depth);
  }
  function star(T,k,r,inner,x,y,z,h,tint){
    const points=[];
    for(let i=0;i<10;i++){const a=Math.PI+i*Math.PI/5,rad=i%2?inner:r;points.push([Math.sin(a)*rad,Math.cos(a)*rad]);}
    const shape=new T.Shape(points.map(([x,z])=>new T.Vector2(x,-z)));
    const g=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);k.stamp(g,tint,x,y,z);g.dispose();
  }
  function build(T,k){
    k.palette({stone:[granite,red],metal:[bronze]});
    const ranges=[];
    function part(fn){
      const begin=k.vertexCount(),child=k.group.children.length;fn();
      const children=k.group.children.slice(child);
      ranges.push({begin,end:k.vertexCount(),children,rests:children.map(o=>o.position.y)});
    }
    // A paved landing outside the front wall. The far end follows the
    // mapped approach w1228660018; only the terrace needs a retaining face.
    part(()=>{
      k.box(0x909084,0,-1.50,11.7,24.3,3.00,42.2);
      k.box(0xb4966e,0,.005,19.5,21.7,.080,24.2);
      for(let i=-10;i<=10;i++)k.box(0xa88d6b,i*.98,.047,19.5,.020,.009,24.1);
      for(let i=0;i<24;i++)k.box(0xa88d6b,0,.047,8.3+i*.98,21.7,.009,.023);
      for(const x of [-11.69,11.69]){
        k.box(granite,x,.19,21.2,.69,.37,18.0);k.box(white,x,.43,21.2,.73,.12,18.03);
      }
      k.box(granite,0,-1.05,-1.05,18.6,3.14,29.25);
      k.box(0xafae9f,0,floor-.072,-1.05,18.5,.15,29.22);
      for(let i=0;i<4;i++)k.box(granite,0,.075*(i+1),14.4-i*.40,6.8,.15*(i+1),.425);
      for(const x of [-6.0,6.0]){
        k.box(0x887564,x,.45,13.5,4.76,.84,1.9);k.box(0x5f714b,x,1.09,13.57,4.58,.72,1.71);
      }
      // An engraved red slab stands behind the low granite star and bowl.
      k.box(0xaca695,0,.14,21.35,6.90,.25,5.75);star(T,k,2.67,1.11,0,.267,21.45,.41,red);
      k.tapered(0x654f45,0,.69,21.45,.41,.38,.12,1,24);k.tapered(0x9f4032,0,.77,21.45,.26,.13,.12,1,10);
      k.box(red,0,.74,18.87,4.84,1.18,.43);
      plaque(T,k,['ĐỜI ĐỜI NHỚ ƠN','CÁC ANH HÙNG LIỆT SĨ'],0,.77,19.092,4.53,1.03,'#865749','#eed498');
      k.tapered(bronze,0,.85,16.67,.55,.39,.60,1,22);k.tapered(bronze,0,1.40,16.67,.37,.87,.62,1,22);
      k.tapered(bronze,0,1.73,16.67,.90,.90,.09,1,28);
      const loop=new T.TorusGeometry(.255,.062,7,20);
      for(const side of [-1,1])k.stamp(loop,bronze,side*.81,1.69,16.66,1,1,1,Math.PI/2);loop.dispose();
    });
    part(()=>{
      k.box(white,0,2.66,back,17.8,4.40,.42);
      // Small pointed windows leave alternating open and solid bays in
      // both long side walls, below the continuous upswept parapet.
      for(const side of [-1,1]){
        const x=side*half;
        k.box(white,x,.91,-1.07,.43,.66,27.49);
        k.box(white,x,4.08,-1.07,.43,1.08,27.49);
        for(let j=0;j<=8;j++)k.box(white,x,2.54,back+j*3.43,.45,3.98,1.47);
        for(let j=0;j<8;j++){
          const z=back+1.715+j*3.43;
          k.box(bronze,x,2.34,z,.11,2.13,.99);
          for(const off of [-.39,0,.39])k.box(0xb0ada0,x+side*.077,2.32,z+off,.053,1.95,.04);
          slopedProfile(T,k,[[z-.99,3.10],[z,3.96],[z+.99,3.10]],x,.62,light);
        }
        slopedProfile(T,k,[[back,4.07],[back,6.71],[back+1.4,6.29],[-8.8,5.88],[-2.8,5.81],[5.3,6.0],
          [front-.6,6.40],[front,6.83],[front,4.07]],x,.46,white);
        k.box(white,side*6.48,3.18,front-1.67,4.89,5.17,.49);
        // Round ventilation grille on each shoulder of the main facade.
        const disk=new T.CircleGeometry(.60,36),ring=new T.TorusGeometry(.62,.065,8,28);
        k.stamp(disk,0x747a71,side*6.57,3.07,front-1.408);k.stamp(ring,light,side*6.57,3.07,front-1.362);
        for(let j=0;j<6;j++){const a=2*Math.PI*j/6;
          k.stamp(ring,light,side*6.57+.31*Math.cos(a),3.07+.31*Math.sin(a),front-1.35,.348,.348,.59);}
        disk.dispose();ring.dispose();
      }
      // The taper and spacing were checked against the frontal panorama
      // and the two opposing oblique photographs; the top reaches 30 m.
      const heights=[29.67,27.42,24.20,20.30,16.40,12.25];
      for(const sign of [-1,1])heights.forEach((h,i)=>{
        const x=sign*(.27+i*.80),f=front-.31-i*.97,b=f-(14.3+i*.42);
        const points=[[f,4.17],[f,h-.02],[f-.32,h+.22],[f-.97,h-.61],[f-2.57,h-1.07],[f-4.03,h-.93],
          [f-6.16,h-.39],[f-8.10,h+.13],[f-9.7,h+.33],[b+2.38,h-.37],[b-.64,h-1.72],[b-1.12,h-1.82],
          [b+.21,h-2.48],[b+1.36,h-4.27],[b+1.66,4.65+(h-4.65)*.49],[b+.67,4.65+(h-4.65)*.25],
          [b-1.76,5.27],[b-3.35,4.86],[b-3.35,4.17]];
        slopedProfile(T,k,points.map(([z,y])=>[z,Math.max(4.89,y)]),x,.40+(i===5?.09:0),i%2?0xd5d4c8:light);
      });
      // Stepped reveals around the glazed opening at the front. The door
      // stays open visually from the inside; the glass sits above its lintel.
      const portalY=y=>y<=4.1?y:4.1+(y-4.1)*1.18;
      const rim=[[2.04,3.40],[2.04,7.56],[1.70,7.56],[1.70,9.17],[1.40,9.17],[1.40,10.64],
        [1.05,10.64],[1.05,12.05],[.68,12.05],[.68,12.98],[.31,12.98],[.31,14.02],[0,14.02]];
      for(const sign of [-1,1]){
        const sideWall=[[1.1,floor],[4.47,floor],[4.47,9.03],[4.15,9.03],[4.15,11.1],[3.70,11.1],[3.70,13.0],
          [3.30,13.0],[3.30,14.76],[2.86,14.76],[2.86,16.15],[2.40,16.15],[2.40,17.64],[1.97,17.64],
          [1.97,18.91],[1.51,18.91],[1.51,20.17],[1.03,20.17],[1.03,21.10],[.64,21.10],[.64,21.96],
          [.20,21.96],[.20,22.37],[0,22.37],[0,14.06],[.31,14.06],[.31,13.00],[.69,13.00],[.69,12.07],
          [1.06,12.07],[1.06,10.66],[1.40,10.66],[1.40,9.19],[1.71,9.19],[1.71,7.57],[2.03,7.57],[2.03,3.35],[1.1,3.35]];
        elevation(T,k,sideWall.map(([x,y])=>[sign*x,portalY(y)]),white,front-.69,.60);
        for(const [inset,offset,depth,tint] of [[0,.12,.27,shadow],[.12,.37,.22,light]]){
          const strip=rim.map(([x,y])=>[sign*(x+inset),portalY(y+inset*1.3)]);
          strip.push(...rim.slice().reverse().map(([x,y])=>[sign*(x+offset),portalY(y+offset*1.3)]));
          elevation(T,k,strip,tint,front-.22,depth);
        }
        // Vertical stepped jambs stand proud of the front elevation. Their
        // narrow side faces mark each successive return in the front panorama.
        for(const [x,top,d] of [[3.70,12.38,.28],[3.29,14.38,.46],[2.90,15.83,.64],[2.49,17.21,.79]]){
          const ridge=[[x-.14,floor],[x+.11,floor],[x+.11,portalY(top)],[x-.17,portalY(top)]];
          elevation(T,k,ridge.map(([x,y])=>[sign*x,y]),light,front-.14,d);
          elevation(T,k,[[sign*(x+.11),floor],[sign*(x+.17),floor],[sign*(x+.17),portalY(top)-.03],
            [sign*(x+.11),portalY(top)]],shadow,front-.10,d-.04);
        }
        k.box(red,sign*1.53,2.52,front-.13,.54,3.84,.18);
      }
      const opening=[[-2.025,4.17],[2.025,4.17],[2.025,7.56],[1.70,7.56],[1.70,9.17],[1.40,9.17],
        [1.4,10.62],[1.05,10.62],[1.05,12.04],[.68,12.04],[.68,12.96],[.31,12.96],[.31,14.02],[-.31,14.02],
        [-.31,12.96],[-.68,12.96],[-.68,12.04],[-1.05,12.04],[-1.05,10.62],[-1.4,10.62],[-1.4,9.17],[-1.7,9.17],[-1.7,7.56],[-2.025,7.56]];
      elevation(T,k,opening.map(([x,y])=>[x,portalY(y)]),glass,front-.34,.08);
      for(const [x,h] of [[0,13.98],[.58,12.91],[-.58,12.91],[1.21,10.58],[-1.21,10.58],[1.86,7.51],[-1.86,7.51]])
        k.box(bronze,x,(4.15+portalY(h))/2,front-.25,.082,portalY(h)-4.15,.10);
      for(let j=0;j<8;j++){const y=4.52+j*1.2;const halfWidth=y<7.53?2.02:y<9.15?1.69:y<10.6?1.38:y<12.0?1.04:.66;
        k.box(bronze,0,portalY(y),front-.25,2*halfWidth,.075,.10);}
      elevation(T,k,[[-1.80,4.08],[0,5.98],[1.80,4.08],[1.30,4.08],[0,5.34],[-1.30,4.08]],red,front-.15,.31);
      for(const sign of [-1,1]){
        k.box(bronze,sign*.71,2.42,front-.22,1.38,3.52,.12);
        const leaf=new T.TorusGeometry(.28,.025,7,20);
        for(const rowY of [1.85,2.52,3.18])for(const offset of [.38,.98])
          k.stamp(leaf,0x997757,sign*offset,rowY,front-.139,.72,1.10,1);
        leaf.dispose();
        for(let j=0;j<3;j++)k.box(0x9a7e5a,sign*(.18+j*.50),2.42,front-.14,.037,3.35,.054);
        for(const h of [1.23,2.93,3.82])k.box(0x9a7e5a,sign*.7,h,front-.14,1.27,.041,.06);
      }
      // Small central relief below the twin crest, visible in node2. Its
      // inscriptions are too distant to transcribe from the virtual tour.
      k.box(0x817460,0,23.74,front-.15,1.00,1.33,.36);
      for(const a of [-1,1])k.box(0xac926d,a*.45,23.69,front+.032,.09,1.32,.049);
      k.box(gold,0,24.07,front+.042,.68,.22,.050);
      k.box(0x948065,0,23.54,front+.05,.71,.068,.05);
      k.box(white,0,ceiling+.17,-1.17,17.86,.35,27.44);
    });
    part(()=>{
      k.box(0x9d9d90,0,floor+.03,-1.08,17.50,.075,27.12);
      k.box(0x85594d,0,floor+.08,-1.17,1.68,.035,26.83);
      const soffit=new T.Mesh(new T.PlaneGeometry(17.38,26.95),new T.MeshBasicMaterial({color:0xd6d6cb,side:T.DoubleSide}));
      soffit.rotation.x=Math.PI/2;soffit.position.set(0,ceiling-.053,-1.12);k.group.add(soffit);
      // Light granite pillars with black inset rolls of honour. Fine gold
      // ruling represents the inscriptions; no personal names are fabricated.
      const skin=new T.MeshLambertMaterial({color:0xffffff});
      skin.onBeforeCompile=s=>{
        s.vertexShader='varying vec2 stoneUV;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nstoneUV=uv;');
        s.fragmentShader='varying vec2 stoneUV;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec2 u=stoneUV;vec2 edge=min(u,1.-u);
          float field=step(.085,edge.x)*step(.133,edge.y);
          float rows=step(.65,fract(u.y*56.))*step(.155,u.y)*step(u.y,.831);
          float col=fract(u.x*2.);float seed=fract(sin(floor(u.y*50.)*54.77+floor(u.x*2.))*6261.);
          rows*=step(.14,col)*step(col,.65+.20*seed);
          float rule=step(abs(u.x-.50),.003)+step(abs(u.y-.849),.005);
          vec2 crest=vec2(abs(u.x-.5),abs(abs(u.y-.5)-.434)*3.92);
          float petal=step(length((crest-vec2(.18,.02))*vec2(.92,2.5)),.185)+step(length(crest*vec2(1.88,.92)),.128);
          vec3 stone=mix(vec3(.62,.59,.52),vec3(.45,.32,.18),min(1.,petal));
          diffuseColor.rgb=mix(stone,vec3(.033,.037,.038)+vec3(.40,.306,.169)*min(1.,rows+rule),field);
        `);
      };
      const pillarHeight=ceiling-floor,pillarY=(ceiling+floor)/2;
      const panel=new T.PlaneGeometry(1.029,pillarHeight-.04),matrices=[],matrix=new T.Matrix4(),turn=new T.Matrix4();
      for(const sign of [-1,1])for(let column=0;column<3;column++)for(let row=0;row<7;row++){
        const x=sign*(2.31+2.27*column),z=-10.8+row*3.23;
        k.box(0xbab9aa,x,pillarY,z,1.04,pillarHeight,1.04);
        for(let face=0;face<4;face++){
          const a=face*Math.PI/2;
          matrix.makeTranslation(x+.524*Math.sin(a),pillarY,z+.524*Math.cos(a));turn.makeRotationY(a);
          matrices.push(matrix.clone().multiply(turn));
        }
      }
      const plaques=new T.InstancedMesh(panel,skin,matrices.length);
      matrices.forEach((m,i)=>plaques.setMatrixAt(i,m));plaques.receiveShadow=true;k.group.add(plaques);
      for(const x of [-1.84,1.84])k.box(white,x,ceiling-.11,-1.12,.26,.28,27.05);
      for(const z of [-10,-2,6])k.box(white,0,ceiling-.145,z,3.87,.30,.41);
      for(const x of [-4.05,0,4.05])for(const z of [-8.4,-.34,7.64]){
        k.box(0x9c9e8e,x,ceiling-.073,z,.58,.030,.70);
        for(const dz of [-.20,-.07,.07,.20])k.box(0xe7e5d8,x,ceiling-.095,z+dz,.50,.025,.054);
      }
      for(let i=0;i<3;i++)k.box(granite,0,floor+.08+i*.135,-12.28-i*.35,3.95-i*.22,.16+i*.24,.78);
      elevation(T,k,[[-1.22,1.25],[1.22,1.25],[1.22,3.14],[.90,3.33],[.51,3.39],[0,3.63],[-.51,3.39],[-.90,3.33],[-1.22,3.14]],red,-14.16,.21);
      k.box(bronze,0,1.56,-13.1,2.18,.63,.79);k.box(0x845d49,0,1.94,-13.11,2.43,.14,.94);
      const emblem=[];
      for(let i=0;i<10;i++){
        const radius=i%2?.070:.175,angle=Math.PI*i/5;
        emblem.push([radius*Math.sin(angle),radius*Math.cos(angle)]);
      }
      k.outline(emblem,gold,0,3.30,-13.91,.05);
      // Local reporting records the 0.83 × 0.73 m bronze bust installed in 2009.
      // https://phuyen.baodaklak.vn/76/43006/dat-tuong-dong-bac-ho-tai-dai-tuong-niem-nui-nhan.html
      const bust=window.CentralArch.carving(T,k,0x997343,0,2.13,-13.65,1);
      // The province's panorama shows the buttoned coat and narrow, tapering beard.
      bust.sweep([[0,.02,0,.264,.108],[0,.070,0,.331,.123],[0,.15,-.005,.365,.135],
        [0,.25,-.012,.342,.13],[0,.32,-.014,.281,.113],[0,.37,-.011,.173,.091],
        [0,.405,-.002,.096,.078],[0,.494,-.003,.076,.067]],.035,26);
      bust.sweep([[0,.461,.005,.047,.048],[0,.495,.015,.077,.071],[0,.544,.008,.101,.086],
        [0,.604,0,.117,.098],[0,.666,-.001,.121,.100],[0,.733,-.005,.116,.096],
        [0,.780,-.010,.099,.085],[0,.811,-.016,.065,.061],[0,.83,-.020,.018,.018]],0,30);
      bust.sweep([[0,.405,.062,.018,.018],[0,.448,.074,.042,.026],
        [0,.485,.078,.057,.031],[0,.507,.073,.063,.029]],.025,18);
      for(const side of [-1,1])
        bust.sweep([[side*.08,.43,.047,.019,.024],[side*.103,.383,.058,.027,.032],
          [side*.052,.336,.093,.020,.021]],.018,14);
      bust.finish();
      k.box(0x75513e,0,2.115,-13.67,.53,.095,.32);
      for(const x of [-.62,.62]){k.tapered(gold,x,2.19,-13.10,.080,.096,.41,1,12);k.box(0xc5ab70,x,2.46,-13.10,.045,.19,.045);}
    });
    let geom,rest;
    k.group.userData.fitGround=ground=>{
      geom??=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;if(!geom)return;
      const p=geom.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      // The summit slopes away on both sides of the rectilinear terrace.
      // Keep the interior on one level, carry the entrance datum across the
      // forecourt, and extend the retaining face to the local hillside.
      const base=Math.max(0,ground(0,-11),ground(0,7),ground(0,13),ground(0,22),
        ground(-7.8,0),ground(7.8,0),ground(-7.8,-10),ground(7.8,-10),
        ...[-11.8,-7,0,11.8].flatMap(x=>[12.5,19,25.8,30.5,32.8].map(z=>ground(x,z))))+.12;
      for(const r of ranges){
        for(let i=r.begin;i<r.end;i++){
          const y=rest[i],x=p.getX(i),z=p.getZ(i);
          p.setY(i,y<-.69?Math.min(y+base,ground(x,z)-.22):y+base);
        }
        r.children.forEach((o,i)=>{o.position.y=r.rests[i]+base;});
      }
      viewHeights.forEach((h,i)=>{views[i].height=(base+h)/.46;});
      p.needsUpdate=true;geom.computeBoundingBox();geom.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Đài tưởng niệm Núi Nhạn',kind:'Đài tưởng niệm',lon,lat,yaw,
    start:[109.2999132,13.0828095],mappedEntrance:true,visitOnArrival:true,width:24.4,depth:49,gardenRadius:1,
    boundary:[[-12.2,-15.9],[12.2,-15.9],[12.2,32.9],[-12.2,32.9]],
    reserve:(x,z,pad)=>Math.abs(x)<12.2+pad&&z> -15.9-pad&&z<32.9+pad,solids:[[0,-.85,8.9,13.9]],
    description:'Ngày 18 tháng 5 năm 2007, Phú Yên khánh thành tháp đài cao 30 m trên Núi Nhạn. Kiến trúc sư Lê Hiệp xoay mặt chính về phía tháp Chăm và tạo hình đàn nhạn trên mặt đứng. Nhà bia bên dưới có 42 trụ ghi danh liệt sĩ. Đường cong của cánh và khoảng cách giữa các trụ trong mô hình được ước lượng từ ảnh thực địa.',
    arrivalNote:'Xe dừng ở lối vào Núi Nhạn trên đường Lê Trung Kiên. Từ quầy vé, theo đường bộ hoặc xe điện nội khu lên núi và rẽ vào sân đài tưởng niệm.',
    source,photo:tour+'#node2',map:'https://www.openstreetmap.org/node/4518976294',views,build});
})();
