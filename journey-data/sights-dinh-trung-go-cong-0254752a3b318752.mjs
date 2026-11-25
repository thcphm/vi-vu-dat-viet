const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Site survey 2026-11-22. OSM w907749065 is the rectangular building,
  // 19.6 × 44.5 m. Its short north-northwest face overlooks Phan Chu Trinh.
  // The four surrounding streets leave no separate gateway or temple garden.
  // https://www.openstreetmap.org/way/907749065
  // Lê Hồng Quân describes the three connected halls, side entrances, five
  // screens and the colours/species of tiles and ridge ornaments.
  const source='https://baodongthap.vn/dinh-lang-thanh-pho-a53386.html';
  // The interviews with Phương Châu and Phan Thanh Sắc identify the current
  // 1930–32 building and distinguish the glazed figures from the cement crests.
  // https://mientay.giadinhonline.vn/tien-giang-dinh-trung-va-le-hoi-ky-yen-d11078.html
  // Reference photography only: north grille, two window panels, internal
  // square piers, stone floor, wooden screens and painted door leaf panels.
  // https://www.amazingvietnam.vn/2025/05/tho-than-o-inh-trung-go-cong.html
  // https://phuot3mien.com/dinh-trung-go-cong.html
  // Minh Thành's 2024 overhead photo and Esri World Imagery L18 distinguish
  // the two raised end halls and the intermediate roof with its plain ridge:
  // https://baodongthap.vn/net-dac-trung-trong-long-thanh-pho-a69797.html
  // Slope heights, carving profiles and internal bay depths are estimated
  // from these views. All painted and patterned surfaces are drawn here.
  const id='dinh-trung-go-cong',catalogId='osm-way-907749065';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Missing Đình Trung Gò Công catalog entry');
  const yaw=-2.712,cs=Math.cos(yaw),sn=Math.sin(yaw);
  const lime=0xe0bf82,ochre=0xc9aa76,oxblood=0x974e3a,grille=0x9a5e4d,timber=0x634639,ebony=0x463e35;
  const clay=0xb87951,under=0x654a3e,jade=0x507c75,patina=0x596d5f,stone=0x897967,dado=0x886353;
  const darkRed=0x924335,red=0xb54d3b,pale=0xd8c89d,sides=[-1,1];
  const A=window.CentralArch,TWO_PI=Math.PI*2;
  const view=(name,x,z,height,viewRadius,angle,viewElevation)=>({name,offset:[x*cs+z*sn,-x*sn+z*cs],height,viewRadius,viewAngle:yaw+angle,viewElevation,viewBase:'monument'});

  function tube(T,k,color,pts,r){
    const path=new T.CatmullRomCurve3(pts.map(a=>new T.Vector3(...a)));
    const g=new T.TubeGeometry(path,pts.length*2,r,5,false);
    k.stamp(g,color,0,0,0);g.dispose();
  }
  function tiles(T,k,corners,color,thickness){
    const p=[],face=(a,b,c)=>p.push(...a,...b,...c),down=([x,y,z])=>[x,y-thickness,z];
    const [a,b,c,d]=corners;face(a,b,c);face(a,c,d);face(down(c),down(b),down(a));face(down(d),down(c),down(a));
    for(let i=0;i<4;i++){const q=corners[i],r=corners[(i+1)%4];face(q,down(q),down(r));face(q,down(r),r);}
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.computeVertexNormals();
    k.stamp(geo,color,0,0,0);geo.dispose();
  }
  function pattern(T,w,h,draw){
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;
    const ctx=cv.getContext('2d');draw(ctx,w,h);
    const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;
    return new T.MeshStandardMaterial({map,roughness:.92,transparent:true,alphaTest:.15,side:T.DoubleSide});
  }
  function panel(T,k,mat,x,y,z,w,h){
    const mesh=new T.Mesh(new T.PlaneGeometry(w,h),mat);mesh.position.set(x,y,z);
    mesh.receiveShadow=true;k.group.add(mesh);
  }
  function surfacePatterns(T){
    const brickwork=pattern(T,104,104,(p,w,h)=>{
      p.fillStyle='#444f4a';p.fillRect(0,0,w,h);p.lineWidth=4;p.strokeStyle='#a7ab8f';p.strokeRect(2,2,100,100);
      p.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4;const x=52+25*Math.cos(a),y=52+25*Math.sin(a);p.moveTo(x+16,y);p.arc(x,y,16,0,TWO_PI);}p.stroke();
      p.fillStyle='#647f78';p.beginPath();p.arc(52,52,9,0,TWO_PI);p.fill();
      p.strokeStyle='#afae91';for(const [x,y] of [[7,7],[97,7],[7,97],[97,97]]){p.beginPath();p.arc(x,y,8,0,TWO_PI);p.stroke();}
    });
    brickwork.map.wrapS=brickwork.map.wrapT=T.RepeatWrapping;brickwork.map.repeat.set(4,6);
    const birds=Array.from({length:4},(_,variant)=>pattern(T,160,230,(p,w,h)=>{
      p.fillStyle='#d8d3ac';p.fillRect(0,0,w,h);p.lineJoin='round';p.lineCap='round';
      if(variant%2){p.translate(w,0);p.scale(-1,1);}
      function stroke(col,width,pts){p.strokeStyle=col;p.lineWidth=width;p.beginPath();p.moveTo(...pts[0]);for(const q of pts.slice(1))p.quadraticCurveTo(...q);p.stroke();}
      for(const [x,y] of [[25,35],[117,24],[102,165],[34,185]]){
        stroke('#809e94',2.5,[[x-14,y+9],[x-6,y-8,x+1,y],[x+14,y-15,x+18,y],[x+32,y+8,x+12,y+8],[x+3,y+18,x-9,y+12]]);
      }
      for(let i=0;i<7;i++){
        stroke(i%2?'#688878':'#3c7365',3,[[77,102],[73+i*4,131+variant*3,35+i*5,158],[12+i*2,170,15+i*4,192-i*4]]);
        stroke('#59867c',2.5,[[83,106],[113+i*4,99-variant*4,127+i*3,73-i*5-variant*10]]);
        stroke(i%2?'#84966d':'#619280',2,[[62,118],[43-i*3,112,30-i,95-i*4]]);
      }
      p.fillStyle='#54796a';p.beginPath();p.ellipse(83,104,14,24,-.77,0,TWO_PI);p.fill();
      stroke('#a34d39',7,[[90,98],[114,84,103,66],[92,56,104,48]]);p.fillStyle='#ab563c';p.beginPath();p.arc(104,49,6,0,TWO_PI);p.fill();
      stroke('#ab563c',3,[[109,47],[115,43,125,44]]);stroke('#88664b',2.7,[[80,121],[82,138,70,141]]);
      stroke('#88664b',3.1,[[23,186],[64,176,124,183]]);p.strokeStyle='#9c997e';p.strokeRect(4,4,w-8,h-8);
    }));
    const gable=pattern(T,530,180,p=>{
      p.lineCap='round';p.lineJoin='round';
      function path(c,w,pts){p.strokeStyle=c;p.lineWidth=w;p.beginPath();p.moveTo(...pts[0]);for(const seg of pts.slice(1))p.quadraticCurveTo(...seg);p.stroke();}
      function silhouette(c,pts){
        p.fillStyle=c;p.beginPath();p.moveTo(...pts[0]);for(const v of pts.slice(1))p.lineTo(...v);p.closePath();p.fill();
      }
      function oval(c,x,y,a,b,ang=0){p.fillStyle=c;p.beginPath();p.ellipse(x,y,a,b,ang,0,TWO_PI);p.fill();}
      for(let i=0;i<2;i++){
        p.save();if(i){p.translate(530,0);p.scale(-1,1);}
        for(const [x,y,s] of [[55,144,.61],[104,129,.65],[166,108,.84],[218,98,.62],[109,147,.46],[205,145,.48]]){
          p.save();p.translate(x,y);p.scale(s,s);
          path('#558991',4,[[0,10],[-12,4,-5,-2],[0,-10,7,-2],[20,-10,24,0],[39,-3,35,8],[30,14,14,13],[7,23,0,15]]);
          p.restore();
        }
        path('#867354',5,[[164,133],[191,135,199,115],[205,103,192,97],[180,94,190,84],[201,75,211,79]]);
        path('#967642',7,[[233,128],[218,121,232,114],[248,113,240,105]]);
        p.restore();
      }
      for(let i=0;i<12;i++){
        const x=203+i*11;silhouette(i%2?'#81908b':'#69808b',[[x-13,158],[x-9,143],[x-4,150],[x,138-i%3*3],[x+8,138],[x+11,145],[x+16,158]]);
        path('#9caa9e',2,[[x-12,157],[x-5,145,x,145],[x+7,137,x+9,144]]);
      }
      // The central relief of the high gable depicts a dragon meeting a
      // tiger over the blue cloud/wave field. These are original drawings.
      path('#96894c',10,[[206,115],[224,119,233,113],[250,105,235,97],[214,87,220,77],[227,68,237,76],[243,82,250,73]]);
      path('#c0a46a',2.8,[[204,112],[227,116,236,109],[244,104,230,97],[213,84,223,79],[228,74,235,78]]);
      for(const [x,y] of [[216,117],[224,115],[233,111],[235,100],[225,94],[217,85],[221,76]]){
        silhouette('#71877b',[[x-3,y-2],[x-5,y-8],[x+2,y-4],[x+5,y-7],[x+4,y]]);
      }
      silhouette('#ac9452',[[242,77],[246,69],[241,64],[251,67],[256,63],[264,66],[273,65],[275,69],[269,72],[260,73],[254,80],[247,78]]);
      path('#728779',2.5,[[249,68],[246,60,240,58],[243,58,247,60]]);
      path('#728779',2.5,[[254,66],[252,57,255,53],[257,57,255,61]]);
      oval('#544f3b',260,67,1.8,1.5);
      path('#8f855a',2.4,[[266,72],[278,72,280,78],[283,82,289,76]]);
      for(const [x,y,dir] of [[227,90,-1],[238,104,1]]){
        path('#ac9556',3.4,[[x,y],[x+dir*7,y+5,x+dir*10,y+12],[x+dir*13,y+15,x+dir*18,y+10]]);
        for(let j=0;j<3;j++)path('#817b58',1.4,[[x+dir*14,y+13],[x+dir*(17+j),y+10+j*2,x+dir*(19+j),y+9+j*2]]);
      }
      const fur='#b5985b',shade='#856e4a';
      path(fur,5,[[308,102],[325,110,333,98],[338,90,330,83],[323,77,326,73]]);
      oval(fur,294,104,18,8,.13);oval(fur,307,107,9,10,.36);oval(fur,280,100,9,8,-.36);
      for(const [x,y,k] of [[282,107,-1],[286,109,1],[308,113,1],[304,114,-1]]){
        path(fur,4.8,[[x,y],[x+k*3,y+8,x+k*6,y+11],[x+k*10,y+15,x+k*12,y+11]]);
        oval(shade,x+k*10,y+13,3.2,1.1);
      }
      oval(fur,274,96,7.2,6.6);oval(shade,276,90,2.2,2.8);oval(fur,272,90,2.0,2.6);
      oval('#d0ba84',269,98,4.5,2.7);oval('#625d49',268,97,1.7,1.2);oval('#514d3c',272,94,1.1,.9);
      for(let i=0;i<6;i++)path(shade,1.8,[[281+i*4.7,98+i*.55],[283+i*4.7,103+i*.48,281.2+i*4.7,106+i*.45]]);
      for(let i=0;i<3;i++)path(shade,1.6,[[274+i,92+i*1.7],[276+i,93+i,277+i,92+i]]);
    });
    const title=pattern(T,500,165,(g,w,h)=>{
      g.fillStyle='#a34a35';g.fillRect(0,0,w,h);g.fillStyle='#ebc269';g.strokeStyle='#bb8d4e';g.lineWidth=4;g.strokeRect(4,4,w-8,h-8);
      g.textAlign='center';g.textBaseline='middle';g.font='bold 64px Georgia, serif';g.fillText('ĐÌNH TRUNG',w/2,47,468);
      g.font='bold 52px Georgia, serif';g.fillText('GÒ CÔNG',w/2,117,403);
    });
    const board=pattern(T,512,100,(g,w,h)=>{
      g.fillStyle='#964334';g.fillRect(0,0,w,h);g.fillStyle='#d8ae62';g.font='bold 67px serif';g.textAlign='center';g.textBaseline='middle';
      for(const [i,ch] of Array.from('佑庇恩神').entries())g.fillText(ch,(i+.5)*w/4,h*.52);
    });
    return {brickwork,birds,gable,title,board};
  }

  // Physical round covers punctuate the scalloped green ceramic drip tiles.
  function dripEdge(T,k,length,y,z){
    const cap=new T.CylinderGeometry(1,1,1,10),fin=new T.Shape();
    fin.moveTo(-.12,.03);fin.lineTo(.12,.03);fin.quadraticCurveTo(.11,-.09,0,-.127);
    fin.quadraticCurveTo(-.11,-.09,-.12,.03);fin.closePath();
    const flake=new T.ExtrudeGeometry(fin,{depth:.055,bevelEnabled:false,curveSegments:3}),n=Math.floor(length/.275);
    for(let i=0;i<n;i++){
      const x=(i+.5-n/2)*length/n;
      k.stamp(cap,jade,x,y,z,.095,.095,.095,0,Math.PI/2);
      k.stamp(flake,0x73948b,x+length/(2*n),y-.020,z-.016);
    }
    cap.dispose();flake.dispose();
  }
  function crest(T,k,x,y,z,scale,flip){
    const p=(u,v,d=0)=>[x+flip*u*scale,y+v*scale,z+d*scale];
    tube(T,k,patina,[p(-.70,.12),p(-.58,.40),p(-.45,.49),p(-.29,.42),p(-.12,.19),p(.10,.12),p(.29,.31),p(.32,.49)],.066*scale);
    const head=[[-.55,.38],[-.61,.48],[-.77,.49],[-.81,.56],[-.70,.60],[-.75,.71],[-.62,.66],[-.57,.74],[-.53,.61],[-.42,.52]];
    k.outline(head.map(([u,v])=>[flip*u*scale,v*scale]),patina,x,y,z-.054*scale,.109*scale);
    for(let j=0;j<4;j++){
      const u=-.38+.13*j,v=.50-.09*j;
      tube(T,k,jade,[p(u,v-.03),p(u+.04,v+.105),p(u+.079,v+.14)],.034*scale);
    }
    tube(T,k,patina,[p(-.35,.38),p(-.30,.16),p(-.44,.07)],.045*scale);
    tube(T,k,jade,[p(.24,.23),p(.39,.10),p(.49,.13)],.046*scale);
  }
  function roof(T,k,mats,z,depth,high){
    const W=9.78,D=depth/2,w=high?6.50:6.42,d=D-2.25;
    const e=4.47,shoulder=5.41,ledge=high?6.26:5.43,peak=high?8.13:7.28;
    const barrel=new T.CylinderGeometry(1,1,1,6),unitY=new T.Vector3(0,1,0);
    function rib(x1,y1,z1,x2,y2,z2,tint){
      const v=new T.Vector3(x2-x1,y2-y1,z2-z1),len=v.length();
      if(len<.13)return;
      const rot=new T.Euler().setFromQuaternion(new T.Quaternion().setFromUnitVectors(unitY,v.divideScalar(len)),'YXZ');
      k.stamp(barrel,tint,(x1+x2)/2,(y1+y2)/2+.020,(z1+z2)/2,.051,len,.051,rot.y,rot.x,rot.z);
    }
    const ring=(x,y,zz)=>[[-x,y,z+zz],[x,y,z+zz],[x,y,z-zz],[-x,y,z-zz]];
    const low=ring(W,e,D),top=ring(w,shoulder,d);
    for(let i=0;i<4;i++){const j=(i+1)%4;tiles(T,k,[low[i],low[j],top[j],top[i]],clay,.14);}
    for(const f of sides){
      k.place(0,z+f*D,f===1?0:Math.PI,()=>dripEdge(T,k,W*2,e,0));
      k.place(f*W,z,f*Math.PI/2,()=>dripEdge(T,k,D*2,e,0));
      if(high){
        k.box(timber,0,shoulder+.01,z+f*d,w*2,.17,.17);
        k.box(timber,0,ledge-.12,z+f*d,w*2,.17,.18);
        k.box(ebony,0,(shoulder+ledge)/2,z+f*(d-.13),w*2,ledge-shoulder,.08);
        for(let i=0;i<=36;i++)k.box(oxblood,(i/36-.5)*w*2,(shoulder+ledge)/2,z+f*d,.10,ledge-shoulder,.12);
        k.box(oxblood,0,shoulder+.47*(ledge-shoulder),z+f*d,w*2,.082,.13);
      }
      const ridgeZ=z+f*(d+.33),x=w+.38;
      tiles(T,k,[[-f*x,ledge,ridgeZ],[f*x,ledge,ridgeZ],[f*x,peak,z],[-f*x,peak,z]],clay,.13);
      const hues=[0xb47954,0xac6d48,0xb67c58,0xb0714c],count=Math.floor(W*2/.275);
      for(let i=0;i<count;i++){
        const px=(i+.5-count/2)*(2*W/count),t=Math.min(1,(W-Math.abs(px))/(W-w));
        rib(px,e,z+f*D,px,e+t*(shoulder-e),z+f*(D-t*(D-d)),hues[i%hues.length]);
      }
      const wing=Math.floor(D*2/.275);
      for(let i=0;i<wing;i++){
        const pz=(i+.5-wing/2)*(2*D/wing),t=Math.min(1,(D-Math.abs(pz))/(D-d));
        rib(f*W,e,z+pz,f*(W-t*(W-w)),e+t*(shoulder-e),z+pz,hues[(i+1)%hues.length]);
      }
      const upper=Math.floor(x*2/.275);
      for(let i=0;i<upper;i++){
        const px=(i+.5-upper/2)*(2*x/upper);
        rib(px,ledge,ridgeZ,px,peak,z,hues[(i+2)%hues.length]);
      }
      k.place(0,ridgeZ,f===1?0:Math.PI,()=>dripEdge(T,k,x*2,ledge,0));
      for(let i=0;i<=11;i++){const px=(i/11-.5)*(w*2-.2);
        A.strut(T,k,under,px,ledge-.12,ridgeZ,px,peak-.13,z,.063);}
      k.place(f*(w+.40),z,f*Math.PI/2,()=>{
        const crown=new T.Shape();crown.moveTo(-d-.28,shoulder);crown.lineTo(-d-.28,ledge+.26);
        crown.lineTo(-1.26,peak+.08);
        if(high){crown.quadraticCurveTo(-.96,peak+.13,-.85,peak+.52);crown.quadraticCurveTo(0,peak+1.12,.85,peak+.52);
          crown.quadraticCurveTo(.96,peak+.13,1.26,peak+.08);}else crown.lineTo(0,peak+.50);
        crown.lineTo(d+.28,ledge+.26);crown.lineTo(d+.28,shoulder);crown.closePath();k.profile(crown,pale,0,0,-.15,.22);
        for(const end of sides){
          A.strut(T,k,pale,end*.85,peak+.28,.10,end*(d+.28),ledge+.27,.10,.077);
          if(high)tube(T,k,pale,[[end*.15,peak+.68,.10],[end*.43,peak+.65,.10],[end*.77,peak+.48,.10],[end*.93,peak+.22,.10]],.10);
        }
        if(high)panel(T,k,mats.gable,0,(ledge+peak+.53)/2,.095,2*d,(peak-ledge)+.83);
      });
      for(const end of sides)A.strut(T,k,ochre,f*W,e+.043,z+end*D,f*w,shoulder+.06,z+end*d,.061);
    }
    k.box(ochre,0,peak+.19,z,w*2+.63,.40,.26);
    k.box(0x9c8a6c,0,peak+.43,z,w*2+.72,.11,.31);
    if(high){
      for(const sign of sides){
        crest(T,k,sign*1.75,peak+.48,z,1.24,sign);
        crest(T,k,sign*(w-.22),peak+.48,z,.86,-sign);
        for(const q of [3.4,4.2]){
          k.outline([[-.29,0],[-.29,.19],[-.11,.25],[-.08,.39],[.05,.37],[.12,.25],[.29,.17],[.29,0]],patina,sign*q,peak+.47,z-.09,.17);
        }
      }
      k.stamp(k.round,patina,0,peak+.69,z,.095,.37,.095);
      const disk=new T.SphereGeometry(1,10,7);k.stamp(disk,jade,0,peak+.94,z,.23,.23,.12);disk.dispose();
    }
    barrel.dispose();
  }

  // Geometric longevity roundels on the real front and side woodwork.
  function grilleBay(T,k,x,width,base,top,open=false){
    const w=width-.09,h=top-base,y=base+h*.52;
    const beam=(px,py,ww,hh)=>k.box(grille,x+px,py,0,ww,hh,.098);
    for(const sign of sides)beam(sign*w*.476,base+h/2,.082,h);
    beam(0,top-.04,w,.105);beam(0,top-.21,w*.84,.074);beam(0,top-.40,w*.66,.073);
    if(open){
      for(const s of sides){beam(s*w*.417,base+h*.47,.063,h*.74);beam(s*w*.368,base+h*.47,.054,h*.70);}
      return;
    }
    beam(0,base+.05,w,.095);beam(0,base+.25,w,.071);beam(0,base+.47,w,.075);
    for(const s of sides){
      for(const n of [.34,.43])beam(s*w*n,base+h*.48,.064,h*.74);
      beam(s*w*.30,base+h*.49,.076,h*.60);
      beam(s*w*.39,base+h*.50,w*.16,.07);
    }
    const r=Math.min(w*.275,h*.36),geo=new T.TorusGeometry(r,.061,5,44);
    k.stamp(geo,grille,x,y,0,1,1.09,1);geo.dispose();
    for(const s of sides){
      beam(s*r*.23,y+r*.34,.077,r*1.16);beam(s*r*.24,y-r*.49,.079,r*.78);
      beam(s*r*.60,y+r*.43,r*.52,.080);beam(s*r*.64,y-r*.32,r*.47,.080);
    }
    beam(0,y+.02,r*1.91,.15);beam(0,y+r*.16,r*1.58,.077);beam(0,y-r*.66,r*.61,.078);
  }
  function pier(T,k,x){
    k.box(lime,x,2.22,0,.36,4.38,.38);k.box(dado,x,.24,0,.40,.34,.41);
    k.box(oxblood,x,2.16,.204,.205,3.05,.035);k.box(dado,x,3.97,.004,.39,.095,.39);
    k.box(oxblood,x,4.18,.009,.44,.21,.45);
    for(let n=0;n<3;n++)k.box(timber,x,4.18+n*.105,.10+n*.09,.19+(2-n)*.032,.095,.54+n*.18);
  }
  function windowWall(T,k,mats,x,w){
    k.box(lime,x,2.20,-.016,w,4.28,.24);
    k.box(ochre,x,2.35,.112,1.56,2.00,.11);
    panel(T,k,mats.brickwork,x,2.35,.174,1.36,1.79);
    k.box(oxblood,x,3.78,.117,w*.75,.12,.12);
  }
  function facade(T,k,mats){
    const line=[-9.05,-5.75,-1.93,1.93,5.75,9.05];
    k.place(0,21.68,0,()=>{
      for(const x of line)pier(T,k,x);
      for(const s of sides)windowWall(T,k,mats,s*7.4,3.30);
      for(const x of [-3.84,0,3.84])grilleBay(T,k,x,3.54,.20,3.72,x<0);
      k.box(oxblood,0,3.71,0,11.43,.24,.28);
      panel(T,k,mats.title,0,4.06,.189,2.22,.71);
      const leaf=new T.IcosahedronGeometry(1,1);
      for(const [x,scale] of [[-1.96,.68],[1.91,.85]]){
        k.tapered(ochre,x,.24,.58,.32,.40,.39,1,16);k.stamp(k.round,stone,x,.43,.58,.39,.055,.39);
        k.stamp(k.round,timber,x,.54,.58,.06,.24,.06);
        for(let n=0;n<16;n++){
          const a=n*2.40,r=.36*Math.sqrt((n+.2)/16),h=.67+.38*(1-r/.40);
          k.stamp(leaf,[0x5e774c,0x57734b,0x697e50,0x637c4e][n%4],x+Math.cos(a)*r*scale,h*scale+.18,.59+Math.sin(a)*r*scale,.29*scale,.26*scale,.23*scale,a);
        }
      }
      leaf.dispose();
    });
    for(const s of sides)k.place(s*9.06,0,s*Math.PI/2,()=>{
      // Mirrored street bays measured from the front hall toward the south.
      const knots=[21.67,18.65,15.50,12.34,9.19,6.02,2.84,-.33,-3.50,-6.67,-9.84,-13.01,-16.18,-19.35,-21.70];
      for(const z of knots)pier(T,k,-s*z);
      for(let n=0;n<knots.length-1;n++){
        const zz=(knots[n]+knots[n+1])/2,x=-s*zz,w=knots[n]-knots[n+1];
        if(n===0||n===4||n===12){windowWall(T,k,mats,x,w);continue;}
        if(n===6){
          k.box(oxblood,x,3.72,.02,w-.12,.26,.30);k.box(lime,x,4.12,0,w-.18,.52,.24);
          k.box(oxblood,x,3.48,.05,w-.23,.24,.17);
          k.sign('亭村庯城',x,3.47,.148,w-.34,.23,true,'#d8bd79');continue;
        }
        if(n>7){
          k.box(lime,x,2.20,-.02,w,4.3,.24);k.box(oxblood,x,2.29,.14,w*.66,1.88,.10);
          for(let u=0;u<9;u++)k.box(grille,x,1.54+u*.182,.20,w*.62,.038,.04);
        }else{
          k.box(lime,x,.68,0,w,1.26,.24);k.box(oxblood,x,.70,.125,w*.75,.50,.06);
          grilleBay(T,k,x,w-.24,1.30,3.76);
        }
      }
    });
    k.place(0,-21.70,Math.PI,()=>{
      for(const x of line)pier(T,k,x);
      for(let j=0;j<5;j++){
        const x=(line[j]+line[j+1])/2,w=line[j+1]-line[j];
        k.box(lime,x,2.15,0,w,4.28,.25);
        const door=j===1||j===3;k.box(oxblood,x,door?1.60:2.16,.147,w*.57,door?2.62:1.86,.10);
        for(let u=0;u<10;u++)k.box(grille,x,(door?.68:1.46)+u*.166,.211,w*.53,.050,.04);
      }
    });
  }
  function stoneFloor(T,k,z,d,h){
    k.box(stone,0,h-.085,z,18.08,.17,d);
    const tint=[0xa39582,0x9c9082,0xa19382,0x9e917e,0x978977,0xa59987,0x9b8e7b],n=Math.ceil(d/1.15),wy=d/n;
    for(let row=0;row<n;row++)for(let col=0;col<14;col++)
      k.box(tint[(row*7+col*5+row*col*3)%tint.length],(col-6.5)*1.287,h+.01,z+(row+.5-n/2)*wy,1.275,.018,wy-.014);
  }
  function interior(T,k,mats){
    stoneFloor(T,k,14.02,15.41,.20);stoneFloor(T,k,-8.06,27.25,.55);
    for(let i=0;i<3;i++)k.box(stone,0,.20+i*.064,6.15-i*.22,17.94,.12+i*.13,.24);
    for(const z of [18.52,9.20,5.53,-1.12,-6.96,-14.30]){
      for(const x of [-5.75,-1.93,1.93,5.75]){
        if(z===5.53){
          k.box(lime,x,2.42,z,.39,4.42,.40);k.box(oxblood,x,.65,z,.43,.29,.43);k.box(oxblood,x,3.85,z,.45,.17,.46);
        }else{
          k.stamp(k.round,ebony,x,2.58,z,.167,4.40,.167);
          k.stamp(k.round,stone,x,.53,z,.232,.32,.232);k.stamp(k.round,timber,x,4.77,z,.21,.18,.21);
        }
      }
      k.box(timber,0,4.65,z,15.28,.20,.23);
    }
    // The rear wall of the võ ca backstage and its two traditional entrances.
    k.box(ochre,0,2.20,15.50,6.07,3.93,.20);
    for(const s of sides){
      k.box(lime,s*7.23,2.20,15.5,3.55,3.93,.20);
      k.box(timber,s*4.24,3.50,15.5,2.45,.27,.26);
      for(const u of [-1,1])k.box(timber,s*4.24+u*1.12,1.86,15.5,.15,3.26,.25);
    }
    k.box(timber,0,.56,12.23,14.3,.55,6.11);
    k.box(ochre,0,.90,12.23,14.3,.13,6.11);
    // Five sets of red upper bars over painted lower panels face the võ quy.
    const line=[-9.02,-5.75,-1.93,1.93,5.75,9.02],z=-6.90;
    k.box(lime,0,2.57,z-.29,18.05,4.02,.21);
    for(let i=0;i<5;i++){
      const cx=(line[i]+line[i+1])/2,w=line[i+1]-line[i]-.29,sp=w/4;
      k.box(darkRed,cx,2.05,z,w,3.00,.13);
      for(let j=0;j<4;j++){
        const x=cx+(j-1.5)*sp;
        k.box(red,x,1.28,z+.08,sp-.055,1.30,.029);panel(T,k,mats.birds[(i+j)%4],x,1.27,z+.103,sp*.72,1.01);
        k.box(ebony,x,2.45,z+.077,sp*.78,.90,.035);
        for(let sl=0;sl<4;sl++)k.box(red,x+(sl-1.5)*sp*.18,2.45,z+.101,.057,.90,.045);
        k.box(red,x,3.13,z+.085,sp-.056,.30,.040);
      }
      k.box(darkRed,cx,3.80,z,w,.49,.20);k.box(red,cx,4.12,z,w,.13,.23);
      if(i===2)panel(T,k,mats.board,cx,3.81,z+.115,w*.95,.48);
    }
    const g=new T.Shape();
    g.moveTo(-.82,0);g.bezierCurveTo(-.61,-.18,-.52,.14,-.35,-.04);g.bezierCurveTo(-.18,-.23,.05,.07,.23,-.01);
    g.bezierCurveTo(.38,-.12,.60,.16,.82,.02);g.lineTo(.82,.13);g.lineTo(-.82,.13);g.closePath();
    for(const cx of [-7.35,-3.83,0,3.83,7.35]){
      k.box(darkRed,cx,3.88,5.54,3.26,.44,.20);
      for(const q of [-1,0,1])k.profile(g,grille,cx+q*.89,3.79,5.65,.061);
    }
    for(const side of sides)k.place(side*7.7,1.35,side*Math.PI/2,()=>{
      k.box(stone,0,.98,0,2.4,.12,.42);for(const s of sides)k.box(ochre,s*.83,.78,0,.18,.37,.34);
    });
  }
  const sites=window.VietnamSights??=[];
  sites.push({...pin,id,catalogId,lon:106.67500595,lat:10.36040063,yaw,width:19.56,depth:44.49,
    name:'Đình Trung Gò Công',kind:'Đình làng',start:pin.start,mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,source,photo:source,
    description:'Ba nếp nhà nối tiếp nhau giữa bốn mặt phố. Mặt võ ca quay về chợ Gò Công, có ba cửa song chạm chữ thọ giữa hai ô cửa hoa. Từ cửa bên võ quy có thể nhìn đến năm bộ cửa sơn son trước chánh điện. Độ dốc mái và tỷ lệ hoa văn được ước theo ảnh tại đình.',
    arrivalNote:'Xe dừng trên phố Rạch Gầm, cạnh lối vào bên hông võ quy. Đi bộ theo phố ra Phan Chu Trinh để nhìn mặt trước võ ca.',
    boundary:[[-9.78,-22.25],[9.78,-22.25],[9.78,22.25],[-9.78,22.25]],reserve:(x,z,r)=>Math.abs(x)<10.0+r&&Math.abs(z)<22.45+r,
    solids:[[0,0,9.09,21.70]],views:[
      view('Mặt võ ca nhìn ra phố Phan Chu Trinh',.3,16.45,9.50,20.5,.61,.018),
      view('Mái ngói và đầu hồi trên phố Rạch Gầm',5.0,12.65,13.1,14.8,1.28,.17),
      {...view('Chấn song và ô tranh chim trước chánh điện',.20,-6.63,5.55,7.60,.04,.015),photo:'https://phuot3mien.com/dinh-trung-go-cong.html',
        description:'Phía trên mỗi cánh cửa là chấn song thông gió. Phía dưới là các ô ván, có những ô vẽ chim trên nền sáng. Hàng cửa này phân cách võ quy với chánh điện.',arrivalNote:''}
    ],build(T,k){
      k.palette({plaster:[lime,ochre],timber:[timber,ebony,grille],stone:[stone,dado],tile:[clay],glazedTile:[jade]});
      const f=createTempleFoundations(T,k),mats=surfacePatterns(T);
      const base=f.building(0,0,0,18.15,43.49,()=>{
        interior(T,k,mats);facade(T,k,mats);
        for(const [lo,hi,high] of [[5.57,22.25,true],[-7.28,5.57,false],[-22.25,-7.28,true]])roof(T,k,mats,(lo+hi)/2,hi-lo,high);
      });
      f.stairs(base,9.14,1.23,9.62,1.23,2.72,.56,3);f.stairs(base,-9.14,1.23,-9.62,1.23,2.72,.56,3);
      f.walk(19.45,3.95,0,23.67);
      for(const s of sides)f.walk(.82,43.42,s*9.47,0);
    }});
})();

export default window.VietnamSights;
