const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // January 2026 field views: node39 looks across the court, 41 through the
  // main gate, 35 under the porch, 36 at the altar and 134 down at the block.
  // The photographed gate faces Điện Biên Phủ. 67 Phan Bội Châu is the
  // compound address, with a separate entrance near the north-west corner.
  const tour='https://vr360.com.vn/projects/ban-do-so-du-lich-daklak/#node39';
  const source='https://daklak.gov.vn/dia-danh-di-tich-thang-canh/-/asset_publisher/bDngMUmMrWIw/content/-inh-lac-giao';
  // Management-board interview about the three halls and the street entrance:
  // https://vhnt.daklak.gov.vn/ngoi-dinh-co-giua-long-pho-tren-tay-nguyen-1782.html
  // https://csdl.vietnamtourism.gov.vn/dest/?item=1061 (100 m² main hall).
  // Survey 2026-11-22. The three roof outlines and orientations are estimated
  // from satellite imagery, checked against the overhead view and ground
  // photographs. OSM n10314905409 is the address pin on the northern street.
  // https://www.openstreetmap.org/node/10314905409
  // Heights, tile and scroll profiles, banyan and altar details are scaled
  // from photographs. Textures are original drawings.
  const id='dinh-lac-giao-buon-ma-thuot',catalogId='osm-node-10314905409';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Missing Đình Lạc Giao catalog entry');
  const A=window.CentralArch,yaw=-Math.PI/2,sides=[-1,1],tau=Math.PI*2;
  const plaster=0xe9cea0,white=0xc9c2aa,washed=0xb4b3a2,stone=0x878c87,grey=0x69716f;
  const wood=0x50372d,door=0x684737,tile=0x785d50,brick=0xb0765e;
  const gold=0xbe8f47,red=0xa44e33,bark=0x82775f;
  function ball(T,k,col,x,y,z,a,b,c){
    const g=new T.SphereGeometry(1,9,6);k.stamp(g,col,x,y,z,a,b,c);g.dispose();
  }
  function tube(T,k,col,pts,r,sections=5){
    const path=new T.CatmullRomCurve3(pts.map(v=>new T.Vector3(...v)));
    const g=new T.TubeGeometry(path,Math.max(4,pts.length*2),r,sections,false);k.stamp(g,col,0,0,0);g.dispose();
  }
  function cylinder(T,k,col,x,y,z,top,bottom,h,sides=12){
    const g=new T.CylinderGeometry(top,bottom,h,sides);k.stamp(g,col,x,y,z);g.dispose();
  }
  function panel(T,k,x,y,z,w,h,paint,wpx=384,hpx=300){
    const c=document.createElement('canvas');c.width=wpx;c.height=hpx;paint(c.getContext('2d'),wpx,hpx);
    const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;
    const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.91}));
    mesh.position.set(x,y,z);mesh.receiveShadow=true;k.group.add(mesh);
  }
  function ridgeDragon(T,k,x,y,z,d,s){
    const pt=(u,v)=>[x+d*u*s,y+v*s,z];
    tube(T,k,stone,[pt(-.79,.26),pt(-.59,.36),pt(-.35,.30),pt(-.15,.15),pt(.11,.19),pt(.32,.50),pt(.44,.49)],.086*s);
    const head=[[.28,.44],[.29,.59],[.20,.65],[.34,.64],[.36,.78],[.42,.68],[.50,.77],[.52,.64],[.72,.62],[.76,.54],[.59,.50],[.52,.42],[.40,.44]];
    k.outline(head.map(([u,v])=>[d*u*s,v*s]),stone,x,y,z-.065*s,.13*s);
    for(const [u,v] of [[-.72,.29],[-.56,.36],[-.39,.33],[-.17,.22],[.16,.30]])tube(T,k,washed,[pt(u-.16,v+.18),pt(u-.06,v+.12),pt(u,v-.02)],.040*s);
    tube(T,k,stone,[pt(.17,.29),pt(.36,.12),pt(.57,.16)],.054*s);
    tube(T,k,stone,[pt(-.56,.36),pt(-.75,.47),pt(-.85,.59)],.043*s);
  }
  function roof(T,k,z,y,w,d,h,main=false){
    const ridge=.32;
    A.curvedRoof(T,k,0,y,z,w,d,h,main?tile:0x796452,washed,washed,ridge);
    for(const s of sides){
      ridgeDragon(T,k,s*w*ridge,y+h+.06,z,-s,main?1.22:.65);
      for(const q of sides)ridgeDragon(T,k,s*(w/2-.34),y+.30,z+q*(d/2-.15),-s,.70);
    }
    if(main){
      for(const s of sides)tube(T,k,washed,[[s*.82,y+h+.10,z],[s*.43,y+h+.19,z],[s*.31,y+h+.42,z],[s*.36,y+h+.70,z],[s*.20,y+h+.57,z]],.067);
      ball(T,k,grey,0,y+h+.52,z,.24,.25,.11);ball(T,k,red,0,y+h+.53,z+.065,.139,.145,.10);
      for(let i=0;i<7;i++){const a=i*Math.PI/6;tube(T,k,grey,[[.23*Math.cos(a),y+h+.52+.23*Math.sin(a),z],[.32*Math.cos(a),y+h+.54+.31*Math.sin(a),z],[.35*Math.cos(a)-.035,y+h+.56+.38*Math.sin(a),z]],.035);}
    }
  }
  function frontColumn(T,k,x){
    cylinder(T,k,white,x,1.97,4.93,.245,.263,2.84,20);
    for(const [y,t,b,h] of [[.54,.34,.34,.11],[.64,.29,.34,.12],[3.35,.32,.25,.16],[3.51,.385,.35,.15]])cylinder(T,k,washed,x,y,4.93,t,b,h,18);
    const cv=document.createElement('canvas');cv.width=304;cv.height=540;const g=cv.getContext('2d');
    g.fillStyle='#d4c8a4';g.fillRect(0,0,304,540);
    const line=(color,width,points)=>{g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(...points[0]);for(const p of points.slice(1))g.lineTo(...p);g.stroke();};
    for(const shift of [-608,-304,0,304,608,912]){
      const body=[];
      for(let i=0;i<=55;i++){
        const y=i/55*485+21,x=shift+35+1.62*y+13*Math.sin(y*.029);
        body.push([x,y]);
      }
      line('#646967',26,body);line('#7a8180',16,body);
      for(let i=1;i<body.length-1;i++){
        const [x,y]=body[i];
        line('#656966',3.1,[[x-4,y-9],[x-2,y-4],[x+3,y-3],[x+4,y-8]]);
        line('#90958a',2.0,[[x+1,y-4],[x+5,y-1],[x+7,y-5]]);
        if(i%2===0)line('#636966',3.8,[[x+8,y-9],[x+8,y-18],[x+3,y-28],[x+13,y-22],[x+18,y-11]]);
        if(i%11===2){
          line('#666d6a',7,[[x-5,y+5],[x-20,y+10],[x-37,y+8],[x-43,y+17]]);
          for(let t=0;t<3;t++)line('#6d7470',2.7,[[x-39,y+13],[x-45-t*2,y+22+t*2],[x-51-t*2,y+21+t*3]]);
        }
      }
    }
    // The raised spiral casts a narrow edge while the claw, scale and cloud
    // patterns remain legible around the full circumference of each shaft.
    const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;map.wrapS=T.RepeatWrapping;
    const surface=new T.Mesh(new T.CylinderGeometry(.249,.267,2.74,24,1,true),new T.MeshStandardMaterial({map,roughness:.85}));
    surface.position.set(x,2.00,4.93);surface.receiveShadow=true;k.group.add(surface);
    const curve=[];for(let i=0;i<=38;i++){const a=i/38*2.55*tau;curve.push([x+Math.cos(a)*.261,.77+i*.064,4.93+Math.sin(a)*.261]);}
    tube(T,k,0x909386,curve,.034,5);
  }
  function rail(k,x,z,w){
    for(const y of [.63,.83,1.02])k.box(door,x,y,z,w,.068,.10);
    for(let i=0;i<=9;i++)k.box(wood,x+w*(i/9-.5),.82,z,.059,.39,.066);
  }
  function burner(T,k,x,y,z,s){
    const base=(u,v,w)=>[x+u*s,y+v*s,z+w*s];
    for(let i=0;i<3;i++){const a=tau*i/3+.6;
      tube(T,k,gold,[base(.30*Math.cos(a),.52,.30*Math.sin(a)),base(.30*Math.cos(a),.25,.30*Math.sin(a)),base(.38*Math.cos(a),.065,.38*Math.sin(a))],.061*s);}
    ball(T,k,gold,x,y+.63*s,z,.49*s,.275*s,.375*s);
    for(const [v,r,h] of [[.48,.40,.065],[.78,.46,.077],[.82,.43,.042]])cylinder(T,k,gold,x,y+v*s,z,r*s,r*s,h*s,20);
    cylinder(T,k,0x6d6155,x,y+.847*s,z,.35*s,.35*s,.016*s);
    for(const side of sides)tube(T,k,red,[base(side*.39,.53,0),base(side*.52,.64,0),base(side*.53,.88,0),base(side*.48,.96,0)],.045*s);
  }
  function hall(T,k){
    k.box(stone,0,.26,-.10,10.22,.50,11.34);k.box(brick,0,.526,-.10,10.23,.070,11.34);
    for(let i=0;i<3;i++){k.box(brick,0,-.407+i*.07,6.62-i*.34,5.72,1.19+i*.14,.44);}
    k.box(plaster,0,1.88,-5.50,9.78,2.68,.24);
    for(const s of sides){
      k.box(plaster,s*4.77,1.95,-.28,.27,2.82,10.73);
      k.box(plaster,s*4.62,2.01,4.88,.46,2.93,.48);
      k.box(wood,s*4.56,3.36,.56,.21,.29,8.72);
      rail(k,s*3.47,4.97,1.75);
      for(const z of [-3.33,.69])cylinder(T,k,wood,s*2.33,1.99,z,.154,.187,2.83,15);
    }
    k.box(wood,0,3.46,4.96,10.58,.25,.31);
    k.box(wood,0,3.66,1.48,10.40,.091,6.99);
    for(let i=-11;i<=11;i++)k.box(door,i*.43,3.57,3.48,.085,.13,4.45);
    for(const x of [-2.35,2.35])frontColumn(T,k,x);
    for(const s of sides){
      k.box(door,s*3.53,1.9,-1.34,2.40,2.67,.18);
      k.box(wood,s*2.23,1.99,-1.32,.22,2.85,.25);
      for(let i=0;i<5;i++)k.box(wood,s*(2.6+i*.42),2.5,-1.217,.042,.95,.05);
    }
    k.box(wood,0,3.16,-1.30,9.63,.36,.25);
    // Main offering table seen from the porch, including the small brass
    // vessels and the central shrine behind it in node36.
    k.box(0xa38c6b,0,1.89,-5.32,4.6,2.64,.08);
    for(const s of sides){
      k.box(wood,s*3.52,1.88,-2.35,2.36,2.63,2.06);
      k.box(door,s*2.34,1.91,-2.35,.12,2.55,1.91);
    }
    for(const s of sides){
      k.box(0x647b61,s*2.18,1.88,-5.22,.12,2.54,.05);
      k.box(0xa85546,s*1.98,1.87,-5.18,.21,2.36,.052);
    }
    k.box(door,0,1.08,-4.65,3.10,.99,.94);k.box(wood,0,1.63,-4.65,3.28,.12,1.01);
    for(const s of sides){
      k.box(wood,s*1.34,2.2,-4.64,.15,1.18,.19);
      k.box(gold,s*.99,1.84,-4.49,.10,.34,.11);
      ball(T,k,gold,s*.98,2.01,-4.49,.14,.11,.12);
      k.box(0xddab59,s*.98,2.14,-4.49,.032,.2,.032);
    }
    k.box(wood,0,2.78,-4.61,3.05,.22,.32);
    for(const s of sides){
      k.box(door,s*.89,1.13,-4.16,1.28,.69,.045);
      k.box(0xb66b46,s*.86,1.13,-4.12,.85,.42,.036);
      for(let i=0;i<4;i++)k.box(door,s*(.51+i*.22),1.13,-4.09,.026,.41,.022);
      for(const z of [-4.44,-4.85])cylinder(T,k,gold,s*1.08,1.84,z,.09,.13,.22,9);
    }
    ball(T,k,gold,0,2.31,-4.95,.34,.42,.07);
    k.box(0xbe924c,0,.85,-3.19,1.69,.58,.65);burner(T,k,0,1.15,-3.19,.58);
    roof(T,k,-3.92,3.23,11.28,5.04,1.52);
    roof(T,k,2.10,3.59,11.62,8.16,1.39,true);
    k.box(wood,0,3.17,3.78,2.51,.43,.14);
    // Visible field-photo order, left to right: 郊 樂 亭.
    panel(T,k,0,3.18,3.866,2.20,.355,(g,w,h)=>{g.fillStyle='#422c23';g.fillRect(0,0,w,h);g.fillStyle='#c39745';g.textAlign='center';g.textBaseline='middle';g.font='bold 102px "Microsoft JhengHei",serif';g.fillText('郊 樂 亭',w/2,h*.50,w*.92);},520,124);
  }
  function wing(T,k){
    k.box(stone,0,.21,0,13.0,.41,5.51);k.box(brick,0,.441,0,13.0,.065,5.51);
    k.box(plaster,0,1.84,-2.47,12.6,2.77,.21);
    for(const s of sides)k.box(plaster,s*6.17,1.79,-.08,.21,2.67,4.84);
    k.box(plaster,0,1.85,1.25,12.42,2.78,.21);
    for(const x of [-4.04,-1.07,1.04,4.16]){
      k.box(wood,x,1.54,1.37,.99,2.13,.059);
      for(let j=0;j<5;j++)k.box(0x362f28,x+(j-2)*.15,2.17,1.413,.029,.61,.021);
    }
    for(const x of [-5.95,-2.0,2.0,5.95])k.box(plaster,x,1.81,2.37,.28,2.68,.32);
    k.box(wood,0,3.12,2.44,13.29,.17,.22);
    for(let i=0;i<2;i++)k.box(brick,0,-.371+i*.09,3.25-i*.29,9.81,1.062+i*.18,.38);
    roof(T,k,-.04,3.17,13.83,6.90,1.29);
  }
  function seal(T,k,x,y,z,r,frame){
    // Pierced, rectilinear longevity emblem observed on both sides of the screen.
    const stroke=(pts,width)=>tube(T,k,frame,pts.map(([u,v])=>[x+r*u,y+r*v,z]),width*r,6);
    const ring=new T.TorusGeometry(r,.065*r,6,32);k.stamp(ring,frame,x,y,z);ring.dispose();
    for(const s of sides){
      for(const [a,b] of [[.34,.86],[.61,.65]])stroke([[-b,s*a],[b,s*a]],.045);
      stroke([[s*.44,.82],[s*.44,.60],[s*.67,.60]],.040);
      stroke([[s*.56,.32],[s*.56,.11],[s*.87,.11]],.045);
      stroke([[s*.86,-.12],[s*.54,-.12],[s*.54,-.34]],.045);
      stroke([[s*.40,-.39],[s*.40,-.66],[s*.61,-.66]],.042);
    }
    for(const yy of [-.13,.113])stroke([[-.4,yy],[.4,yy]],.044);
    stroke([[0,.88],[0,.37]],.046);stroke([[.19,.10],[.19,-.20],[-.14,-.20],[-.14,-.38]],.043);stroke([[0,-.62],[0,-.88]],.044);
  }
  function screen(T,k){
    const w=1.75;
    for(const z of [-.02,.025]){
      k.box(stone,0,.23,z,3.67,.43,.53);
      k.box(washed,0,.51,z,3.52,.12,.41);
    }
    // Shape with a circular opening. Profile follows the curved crest of
    // the stone scroll. The iron bars of the gate are visible through it.
    const sh=new T.Shape();sh.moveTo(-w,.52);sh.lineTo(w,.52);sh.lineTo(w,1.90);sh.quadraticCurveTo(1.15,2.20,.58,2.37);sh.quadraticCurveTo(0,2.58,-.58,2.37);sh.quadraticCurveTo(-1.18,2.16,-w,1.90);sh.closePath();
    const hole=new T.Path();hole.absarc(0,1.58,.611,0,tau,true);sh.holes.push(hole);
    k.profile(sh,stone,0,0,-.14,.28);
    for(const s of sides){
      k.box(washed,s*1.66,1.25,.012,.13,1.57,.37);
      tube(T,k,washed,[[s*1.75,1.91,0],[s*1.5,2.12,0],[s*.74,2.38,0],[s*.19,2.48,0],[0,2.50,0]],.085);
      tube(T,k,grey,[[s*1.53,.65,.17],[s*1.22,.74,.17],[s*.83,.93,.17],[s*.66,1.03,.17]],.044);
    }
    seal(T,k,0,1.58,0,.607,washed);
    k.place(0,0,0,()=>panel(T,k,0,.49,.294,.81,.21,(g,w,h)=>{
      g.fillStyle='#93968b';g.fillRect(0,0,w,h);g.fillStyle='#454844';g.textAlign='center';g.textBaseline='middle';g.font='bold 74px Georgia';g.fillText('2005',w/2,h/2,w*.88);
    },300,95));
    cylinder(T,k,red,0,3.35,-.56,.027,.035,6.6,7);
    const data=[0,6.58,-.56, .58,6.51,-.46, .05,5.99,-.54, .58,6.51,-.46, .70,5.97,-.50, .05,5.99,-.54];
    const flag=new T.BufferGeometry();flag.setAttribute('position',new T.Float32BufferAttribute(data,3));flag.computeVertexNormals();
    const fm=new T.Mesh(flag,new T.MeshStandardMaterial({color:0xb7513f,side:T.DoubleSide,roughness:.93}));k.group.add(fm);
    burner(T,k,0,.02,-1.46,1.37);
    for(const s of sides){
      const x=s*1.45,z=-1.44;
      k.box(stone,x,.084,z,.66,.156,.48);
      ball(T,k,gold,x,.24,z,.28,.14,.177);ball(T,k,gold,x-s*.26,.24,z,.115,.068,.062);
      for(const q of sides)tube(T,k,red,[[x+q*.09,.34,z],[x+q*.12,.74,z],[x+q*.09,1.01,z]],.035);
      ball(T,k,gold,x,1.08,z,.25,.155,.13);
      tube(T,k,red,[[x-s*.11,1.13,z],[x-s*.20,1.30,z],[x-s*.15,1.58,z],[x+s*.01,1.80,z],[x+s*.02,1.94,z],[x-s*.07,2.02,z]],.054);
      tube(T,k,gold,[[x-s*.09,2.01,z],[x-s*.24,1.98,z],[x-s*.33,1.93,z]],.027);
      for(let j=0;j<3;j++)tube(T,k,red,[[x+s*.10,1.10,z+j*.018],[x+s*.23,1.06,z],[x+s*(.37+j*.04),.88-j*.06,z]],.029);
    }
  }
  function gateLeaf(k,w,h){
    const iron=0x9b9f96;
    for(const y of [.30,h*.55,h-.01])k.box(iron,w/2,y,0,w,.045,.05);
    for(let i=0;i<=7;i++)k.box(iron,w*i/7,h/2+.08,0,.029,h-.13,.042);
    for(const y of [.62,.73,.84,.95])k.box(iron,w/2,y,.015,w*.75,.027,.055);
  }
  function guardian(T,k,x,y,z,s){
    ball(T,k,washed,x,y+.145*s,z,.23*s,.216*s,.20*s);
    ball(T,k,washed,x-.02*s,y+.39*s,z+.074*s,.15*s,.15*s,.14*s);
    ball(T,k,washed,x,y+.348*s,z+.164*s,.097*s,.079*s,.09*s);
    for(const q of sides){ball(T,k,stone,x+q*.083*s,y+.47*s,z+.049*s,.05*s,.07*s,.05*s);ball(T,k,washed,x+q*.13*s,y+.065*s,z+.12*s,.076*s,.066*s,.12*s);}
    tube(T,k,washed,[[x+.12*s,y+.13*s,z-.08*s],[x+.225*s,y+.25*s,z-.16*s],[x+.20*s,y+.34*s,z-.18*s]],.043*s);
  }
  function gate(T,k){
    for(const s of sides)for(const inner of [true,false]){
      const x=s*(inner?1.65:3.69),h=inner?4.17:3.04,w=inner?.61:.45;
      k.box(grey,x,h*.49,0,w,h*.97,w);
      for(const [frac,size,hh] of [[.036,1.30,.22],[.17,1.24,.111],[.205,1.12,.078],[.64,1.18,.11],[.669,1.15,.060],[.924,1.20,.091],[.96,1.34,.113],[.99,1.14,.085],[1.035,1.27,.097]])k.box(washed,x,h*frac,0,w*size,hh,w*size);
      for(const face of sides)for(const [cy,ch] of [[.435,.38],[.79,.16]]){
        k.box(white,x,h*cy,face*(w/2+.012),w*.64,h*ch,.033);
        k.box(grey,x,h*cy,face*(w/2+.036),w*.49,h*ch-.086,.025);
      }
      guardian(T,k,x,h*1.035+.065,0,inner?1.0:.76);
    }
    for(const s of sides){
      k.place(s*1.37,-.13,s>0?Math.PI/2+.16:Math.PI/2-.16,()=>gateLeaf(k,1.32,2.57));
      k.place(s*3.43,0,s>0?Math.PI:0,()=>gateLeaf(k,1.43,1.94));
    }
    for(let j=0;j<3;j++)k.box(0xaaa398,0,.05+j*.043,1.46-j*.34,4.03,.10+j*.086,.40);
  }
  function enclosure(T,k,x1,z1,x2,z2){
    const l=Math.hypot(x2-x1,z2-z1),ang=-Math.atan2(z2-z1,x2-x1);
    k.place((x1+x2)/2,(z1+z2)/2,ang,()=>{
      const count=Math.max(1,Math.round(l/2.6)),bay=l/count;
      k.box(plaster,0,.35,0,l,.72,.235);k.box(plaster,0,1.32,0,l,.23,.235);k.box(washed,0,1.48,0,l,.10,.33);
      for(let i=0;i<count;i++){
        const xx=-l/2+bay*(i+.5),opening=bay*.60;
        for(const s of sides)k.box(plaster,xx+s*(opening+bay)/4,.99,0,(bay-opening)/2,.56,.235);
        for(let j=0;j<=6;j++)k.box(white,xx+opening*(j/6-.5),.99,0,.045,.55,.13);
        for(const y of [.83,1.12])k.box(white,xx,y,0,opening,.052,.13);
        k.box(plaster,xx-bay/2,.76,0,.20,1.52,.31);
      }
    });
  }
  function tablet(T,k){
    k.box(0x9a5d4e,0,.21,0,1.47,.42,.58);k.box(0x835148,0,.49,0,1.31,.16,.48);
    k.box(0x956761,0,1.11,0,1.13,1.27,.28);
    panel(T,k,0,1.15,.148,1.03,1.14,(g,w,h)=>{
      g.fillStyle='#84615d';g.fillRect(0,0,w,h);g.textAlign='center';g.textBaseline='middle';g.fillStyle='#242827';
      const lines=['DI TÍCH','LỊCH SỬ - VĂN HÓA','CẤP QUỐC GIA','ĐÌNH','LẠC GIAO'];
      for(let i=0;i<lines.length;i++){g.font='bold '+(i<3?31:43)+'px Georgia';g.fillText(lines[i],w*.5,h*(.13+i*.18),w*.94);}
    });
  }
  function banyan(T,k){
    // Main buttressed trunk and the lateral arch over the court seen in node39.
    const verts=[],uv=[],indices=[];
    let seed=32193;function rand(){seed=1664525*seed+1013904223>>>0;return seed/4294967296;}
    // Small, pointed ficus leaves clustered on spreading woody boughs.
    const c=document.createElement('canvas');c.width=c.height=256;
    const g=c.getContext('2d'),leafColours=['#4b683e','#758a4a','#8e9c56','#566d3f','#68834a','#859450'];
    for(let j=0;j<20;j++){
      const a=rand()*tau,reach=40+rand()*83,ex=125+Math.cos(a)*reach,ey=130+Math.sin(a)*reach;
      g.strokeStyle='#81754e';g.lineWidth=1.35;g.beginPath();g.moveTo(125,130);g.quadraticCurveTo((125+ex)/2+11,(130+ey)/2-7,ex,ey);g.stroke();
      for(let i=0;i<34;i++){const t=Math.sqrt(rand()),dist=(rand()-.50)*42;
        const x=125+(ex-125)*t+Math.cos(a+Math.PI/2)*dist,y=130+(ey-130)*t+Math.sin(a+Math.PI/2)*dist;
        g.save();g.translate(x,y);g.rotate(a+(rand()-.50)*2.1);g.scale(.65+rand()*.7,.65+rand()*.7);
        g.fillStyle=leafColours[(j+i)%6];g.beginPath();g.moveTo(-4,0);g.quadraticCurveTo(-1,-3.5,5.6,0);g.quadraticCurveTo(0,3,-4,0);g.fill();g.restore();
      }
    }
    const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    function foliage(x,y,z,size,angle,tilt){
      const right=[Math.cos(angle)*size,0,Math.sin(angle)*size],up=[-Math.sin(angle)*Math.cos(tilt)*size,Math.sin(tilt)*size,Math.cos(angle)*Math.cos(tilt)*size];
      const b=verts.length/3;
      for(const [u,v] of [[-1,-1],[1,-1],[1,1],[-1,1]]){verts.push(x+right[0]*u+up[0]*v,y+up[1]*v,z+right[2]*u+up[2]*v);uv.push((u+1)/2,(v+1)/2);}
      indices.push(b,b+1,b+2,b,b+2,b+3);
    }
    function bough(a,b,r1,r2){
      const v=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),len=v.length();
      const geo=new T.CylinderGeometry(r2,r1,len,10);geo.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.multiplyScalar(1/len)));
      k.stamp(geo,bark,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);geo.dispose();
    }
    const rim=new T.TorusGeometry(2.20,.12,5,34);k.stamp(rim,washed,0,.13,0,1,1,.77,0,Math.PI/2);rim.dispose();
    const soil=new T.CylinderGeometry(2.16,2.16,.145,34);k.stamp(soil,0x81684f,0,.11,0);soil.dispose();
    for(let i=0;i<13;i++){
      const a=i*tau/13,r=1.34+rand()*.67,px=Math.cos(a),pz=Math.sin(a),bend=rand()*.34;
      tube(T,k,bark,[[px*r,.16,pz*r],[px*(r-.42),.30,pz*(r-.42)],[px*.66+bend,.85,pz*.66],[px*.47,2.0,pz*.55],[px*.31,3.23,pz*.37]],.14+rand()*.065,7);
    }
    bough([0,.21,0],[-.10,3.66,.22],.69,.68);
    for(let i=0;i<8;i++){
      const a=tau*i/8+.23,px=Math.cos(a),pz=Math.sin(a),l=3.9+rand()*2.63,h=5.8+rand()*2.51;
      const joint=[px*(l*.40),h*.76,pz*(l*.40)],tip=[px*l,h,pz*l];
      bough([-.10,2.60+i*.095,.13],joint,.48,.26);bough(joint,tip,.28,.073);
      for(let j=0;j<3;j++){
        const angle=a+(j-1)*.56,branch=[tip[0]+Math.cos(angle)*(1.35+rand()),h+1.1+rand()*1.5,tip[2]+Math.sin(angle)*(1.35+rand())];
        bough([tip[0]*.76,h-.32,tip[2]*.76],branch,.123,.040);
        for(let t=0;t<3;t++){
          const a1=angle+(t-1)*.85,mid=[branch[0]+Math.cos(a1)*.52,branch[1]+.30,branch[2]+Math.sin(a1)*.52];
          bough(branch,mid,.042,.026);
          const end=[mid[0]+Math.cos(a1)*.73,mid[1]+.46,mid[2]+Math.sin(a1)*.73];
          bough(mid,end,.030,.008);
          foliage(end[0],end[1],end[2],1.10,rand()*tau,.25+rand());
          foliage(tip[0]+Math.cos(a1)*.43,tip[1]+.70,tip[2]+Math.sin(a1)*.51,1.27,rand()*tau,.60+rand()*.48);
        }
        for(let n=0;n<12;n++){
          const x=branch[0]+(rand()-.5)*2.65,z=branch[2]+(rand()-.5)*2.81,y=branch[1]+(rand()-.5)*1.30;
          foliage(x,y,z,1.05+rand()*.98,rand()*tau,.16+rand()*1.18);
        }
      }
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
    const crown=new T.Mesh(geo,new T.MeshLambertMaterial({map,side:T.DoubleSide,alphaTest:.28}));
    crown.castShadow=crown.receiveShadow=true;k.group.add(crown);
  }
  function courtyard(T,k,anchors){
    const nx=25,nz=34,p=[],uv=[],tri=[];
    for(let j=0;j<=nz;j++){
      const z=-6.2+j*38.3/nz;
      // Chamfer towards the side entrance on Phan Bội Châu.
      const xmin=-17.7+Math.max(0,z-22.6)*.52;
      for(let i=0;i<=nx;i++){
        const x=xmin+(13.9-xmin)*i/nx,idx=j*(nx+1)+i;p.push(x,0,z);uv.push(x,z);
        if(i<nx&&j<nz)tri.push(idx,idx+nx+1,idx+1,idx+1,idx+nx+1,idx+nx+2);
      }
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(tri);
    const mat=new T.MeshStandardMaterial({color:brick,roughness:.96,side:T.DoubleSide});
    mat.onBeforeCompile=q=>{
      q.vertexShader='varying vec2 tileUV;\n'+q.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntileUV=uv;');
      q.fragmentShader='varying vec2 tileUV;\n'+q.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 tile=tileUV/.435;
        vec2 inset=min(fract(tile),1.-fract(tile));
        vec2 aa=clamp(fwidth(tile)*.4,.001,.15);
        vec2 jointMask=smoothstep(vec2(.024)-aa,vec2(.024)+aa,inset);
        float grain=fract(sin(dot(floor(tile),vec2(34.74,71.53)))*13618.);
        diffuseColor.rgb=mix(vec3(.317,.262,.201),diffuseColor.rgb*(.78+.29*grain),jointMask.x*jointMask.y);`);
    };
    const mesh=new T.Mesh(geo,mat);mesh.receiveShadow=true;k.group.add(mesh);
    const fit=k.group.userData.fitGround;
    k.group.userData.fitGround=ground=>{
      fit(ground);const pos=geo.attributes.position;
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i),z=pos.getZ(i),base=ground(x,z);
        let top=base+.115;
        for(const a of anchors){
          const distance=Math.max(0,Math.abs(x-a.x)-a.hw,Math.abs(z-a.z)-a.hd);
          if(distance<3.40)top=Math.max(top,base+.115+(a.anchor.height-base)*(1-distance/3.40));
        }
        pos.setY(i,top);
      }
      pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();
    };
  }
  function build(T,k){
    k.palette({plaster:[plaster],stone:[stone,grey,washed],tile:[tile,0x796452],timber:[door,wood]});
    const f=createTempleFoundations(T,k),anchors=[];
    function building(x,z,angle,w,d,fn){
      const a=f.building(x,z,angle,w,d,fn);const trans=Math.abs(Math.sin(angle))>.7;
      anchors.push({anchor:a,x,z,hw:(trans?d:w)/2,hd:(trans?w:d)/2});return a;
    }
    building(0,0,0,9.84,10.94,()=>hall(T,k));
    for(const s of sides)building(s*11.10,11.82,-s*Math.PI/2,12.87,5.37,()=>wing(T,k));
    building(0,26.29,0,3.56,1.68,()=>screen(T,k));
    building(0,32.0,0,7.85,1.40,()=>gate(T,k));
    building(-5.21,32.12,0,1.48,.63,()=>tablet(T,k));
    building(6.50,26.40,0,3.74,3.71,()=>banyan(T,k));
    for(const s of sides){
      for(const z of [6.65,18.35]){
        let parts=[];const x=s*8.18;
        f.fixture(g=>g(x,z),()=>{parts=k.place(x,z,0,()=>{cylinder(T,k,red,0,.32,0,.47,.34,.54);A.trees(T,k,[{x:0,z:0,h:2.50,width:1.53,kind:'banyan'}]);});},y=>{for(const m of parts)m.position.y=y;});
      }
    }
    const wall=(a,b)=>{const x=(a[0]+b[0])/2,z=(a[1]+b[1])/2;f.fixture(g=>g(x,z),()=>enclosure(T,k,...a,...b));};
    wall([3.95,32],[13.70,32]);wall([-12.82,32],[-3.95,32]);wall([-12.82,32],[-14.96,27.65]);
    wall([-16.30,24.77],[-17.70,22]);wall([-17.70,22],[-17.70,-6.2]);wall([13.70,32],[13.70,-6.2]);
    courtyard(T,k,anchors);
  }
  const view=(name,x,z,height,viewRadius,delta,viewElevation,viewFov=63)=>({
    name,offset:[-z,x],height,viewRadius,viewAngle:yaw+delta,viewElevation,viewFov,viewBase:'monument'
  });
  (window.VietnamSights??=[]).push({...pin,id,catalogId,name:'Đình Lạc Giao',kind:'Đình',city:'Buôn Ma Thuột',province:'Đắk Lắk',
    lon:108.0424945,lat:12.6821826,yaw,width:31,depth:39,build,source,photo:tour,map:'https://www.openstreetmap.org/node/10314905409',
    start:[108.0421400,12.6821865],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    description:'Hai nhà tả, hữu quay mặt vào sân gạch. Trước chính điện là đôi cột chạm rồng dưới bộ mái ngói đắp lưỡng long chầu nguyệt. Phía cổng, hai con hạc đứng trên lưng rùa hai bên lư hương và bức bình phong đá. Tán đa tỏa trên lối vào từ đường Điện Biên Phủ.',
    arrivalNote:'Xe dừng trên đường Điện Biên Phủ trước cổng bốn trụ. Đi bộ qua bình phong và sân gạch để tới chính điện. Địa chỉ của đình là 67 Phan Bội Châu.',
    reserve:(x,z,r)=>x>-17.8-r&&x<14+r&&z>-6.7-r&&z<32.5+r,
    boundary:[[-17.7,-6.4],[13.9,-6.4],[13.9,32.0],[-12.82,32.0],[-17.7,22.0]],solids:[[0,-.1,4.90,5.4],[-11.10,11.82,2.53,6.45],[11.1,11.82,2.53,6.45]],
    views:[view('Sân gạch và hai cột rồng trước chính điện',0,3.84,6.8,12.68,.033,.065),
      view('Lư hương, đôi hạc và bình phong dưới tán đa',.65,26.2,6.6,11.67,Math.PI-.045,.082),
      view('Bốn trụ tam quan nhìn từ đường Điện Biên Phủ',-.28,31.42,6.36,9.75,-.13,.085)]});
})();

export default window.VietnamSights;
