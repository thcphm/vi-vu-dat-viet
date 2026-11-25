const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Survey 2026-11-23. n5439114923 is the unsigned OSM "Buddhist Temple"
  // point in the southern court. The main hall roof is about 48 m north.
  // Tam quan faces WSW across w497318640; w835647569 reaches the separate
  // southern wooden gate. Satellite eaves were registered to the ground
  // beside the street (the tall tower has appreciable aerial parallax).
  const id='chua-buu-minh-bien-ho',catalogId='osm-node-5439114923';
  const raw=window.VietnamTourism.entries.find(r=>r.id===catalogId);
  if(!raw)throw Error('Missing Bửu Minh Pagoda catalog entry');
  const source='https://chuabuuminh.vn/hinh-anh/nhiep-anh/7A5419_chua_buu_minh_tam_huyet_mot_doi_tu_.aspx';
  const photo='https://vovworld.vn/vi-VN/media/kien-truc-doc-dao-cua-ngoi-chua-nam-giua-bat-ngan-che-xanh-o-gia-lai-2425651.vov5';
  // The abbot's illustrated account distinguishes the three square tower
  // roofs behind the transverse ridge from the single broad pair of main
  // roof planes. Ground to finial 47.25 m; hall envelope about 23 x 27 m.
  // Figures, finishes, subsidiary heights, roofs, gardens, wheel gallery
  // and portals approximated from VOV/VTC field photographs 1–13 (2026).
  // https://bienho.gialai.gov.vn/thong-bao-van-ban-moi/gioi-thieu-diem-van-hoa-du-lich-tren-dia-ban-xa-bien-ho.html
  // https://www.openstreetmap.org/node/5439114923
  const yaw=-1.256,c=Math.cos(yaw),s=Math.sin(yaw),both=[-1,1],tau=2*Math.PI,A=window.CentralArch;
  const charcoal=0x514d49,blue=0x48535b,bronze=0x947445,vermilion=0xb76c49,red=0xaf5744;
  const cream=0xe4c8a1,ochre=0xd1a263,pink=0xc9a597,gold=0xd5a748,umber=0x593a30,dark=0x443431;
  const white=0xd6d5c6,stone=0x8a8476,pave=0xa98d72,teal=0x557575,dullGold=0xc4a266;
  function tube(T,k,col,pts,r,steps=pts.length*2){
    const path=new T.CatmullRomCurve3(pts.map(v=>new T.Vector3(...v)));
    const g=new T.TubeGeometry(path,Math.max(3,steps),r,6,false);k.stamp(g,col,0,0,0);g.dispose();
  }
  function ball(T,k,col,x,y,z,w,h,d){
    const g=new T.SphereGeometry(1,10,7);k.stamp(g,col,x,y,z,w,h,d);g.dispose();
  }
  function drum(T,k,col,x,y,z,lo,hi,h,n=16){
    const g=new T.CylinderGeometry(hi,lo,h,n);k.stamp(g,col,x,y,z);g.dispose();
  }
  function surface(T,k,top,under,colour,bottom){
    function band(tris,col){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(tris,3));g.computeVertexNormals();k.stamp(g,col,0,0,0);g.dispose();
    }
    band(top,colour);band(under,bottom);
  }
  function sign(T,k,x,y,z,w,h,draw,angle=0){
    const cv=document.createElement('canvas');cv.width=512;cv.height=240;draw(cv.getContext('2d'),512,240);
    const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;const plane=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.88}));
    plane.position.set(x,y,z);plane.rotation.y=angle;plane.receiveShadow=true;k.group.add(plane);
  }
  function tip(T,k,x,y,z,ang,sz,col=blue){
    // The local heads curve out of the hip, paired with a smaller fish tail.
    k.place(x,z,ang,()=>{
      const p=(u,v,w=0)=>[u*sz,y+v*sz,w*sz];
      tube(T,k,col,[p(-.70,0),p(-.24,.05),p(.17,.16),p(.49,.41),p(.58,.69),p(.48,.78),p(.39,.71)],sz*.099);
      k.outline([[.44,.58],[.44,.75],[.31,.82],[.46,.82],[.42,.94],[.55,.90],[.65,.98],[.67,.82],[.81,.81],[.83,.76],[.69,.72],[.64,.61]].map(([x,v])=>[x*sz,v*sz]),col,0,y,-.06*sz,.12*sz);
      tube(T,k,col,[p(-.15,.09),p(.02,.30),p(-.07,.43),p(-.16,.44)],sz*.049);
      for(let i=0;i<3;i++)tube(T,k,col,[p(.1+i*.15,.15+i*.13),p(.08+i*.15,.33+i*.13),p(.00+i*.15,.38+i*.13)],sz*.035);
    });
  }
  function hips(T,k,w,d,base,top,tint,rim,plate=.30,sw=.60){
    const upper=[],soffit=[],ring=(t)=>{
      const pts=[];
      for(const [xa,za,xb,zb] of [[-1,-1,-1,1],[-1,1,1,1],[1,1,1,-1],[1,-1,-1,-1]])for(let i=0;i<10;i++){
        const a=i/10,x=xa+(xb-xa)*a,z=za+(zb-za)*a;
        pts.push([x*w*.5*(1-t+t*plate),base+(top-base)*(t*.46+t*t*.54)+sw*(1-t)**2*Math.min(Math.abs(x),Math.abs(z))**5,z*d*.5*(1-t+t*plate)]);
      }
      return pts;
    },quad=(p,a,b,c,d)=>p.push(...a,...b,...d,...b,...c,...d);
    let prev=ring(0);const outer=prev;
    for(const t of [.25,.50,.75,1]){const next=ring(t);for(let i=0;i<prev.length;i++){const j=(i+1)%prev.length;quad(upper,prev[i],prev[j],next[j],next[i]);}prev=next;}
    for(let i=0;i<outer.length;i++){
      const a=outer[i],b=outer[(i+1)%outer.length],low=q=>[q[0],q[1]-.19,q[2]],inner=q=>[q[0]*.66,base+.13,q[2]*.66];
      quad(soffit,a,low(a),low(b),b);quad(soffit,low(a),inner(a),inner(b),low(b));
    }
    surface(T,k,upper,soffit,tint,vermilion);
    for(const x of both)for(const z of both){
      const pts=[];for(const t of [0,.25,.50,.75,1])pts.push([x*w/2*(1-t+t*plate),base+(top-base)*(t*.46+t*t*.54)+sw*(1-t)**2+.08,z*d/2*(1-t+t*plate)]);
      tube(T,k,rim,pts,.105);tip(T,k,x*w*.49,base+sw-.10,z*d*.49,Math.atan2(-z,x),Math.min(1.55,w*.099),rim);
    }
  }
  function cornice(k,x,y,z,w,d,tint){
    k.box(tint,x,y,z,w,.23,d);k.box(umber,x,y-.19,z,w-.17,.135,d-.17);
  }
  function balcony(k,x,y,z,w,d,col,span=1.18){
    k.place(x,z,0,()=>{for(const [len,deep,ang] of [[w,d,0],[d,w,Math.PI/2]])for(const e of both)k.place(0,0,ang,()=>{
      for(const dy of [.12,.54,.82])k.box(col,0,y+dy,e*deep/2,len,.087,.105);
      const n=Math.ceil(len/span);for(let i=0;i<=n;i++)k.box(col,len*(i/n-.5),y+.43,e*deep/2,.105,.87,.117);
    });});
  }
  function tower(T,k){
    const w=6.75,d=6.85;
    k.box(pink,0,11.4,0,w,22.7,d);
    for(const [y0,y1,w0,roofW,roofBase,roofTop] of [[18.2,23.50,w,11.9,23.26,24.56],[24.1,27.91,6.30,11.25,27.46,28.82],[28.4,32.96,5.93,11.2,31.82,37.39]]){
      k.box(cream,0,(y0+y1)/2,0,w0,y1-y0,w0);
      for(const e of both){
        for(const yaw of [0,Math.PI/2])k.place(0,0,yaw,()=>{
          for(let i=-3;i<=3;i++)k.box(vermilion,i*w0*.148,(y0+y1)/2,e*(w0/2+.05),.095,y1-y0,.13);
          for(const t of [.05,.22,.77,.98])k.box(vermilion,0,y0+(y1-y0)*t,e*(w0/2+.05),w0,.10,.14);
          for(const x of [-w0*.31,0,w0*.31])ball(T,k,dullGold,x,y1-.43,e*(w0/2+.10),.33,.30,.07);
        });
      }
      cornice(k,0,y0+.035,0,w0+1.85,w0+1.85,vermilion);
      balcony(k,0,y0+.16,0,w0+1.61,w0+1.61,bronze,.9);
      hips(T,k,roofW,roofW,roofBase,roofTop,red,blue,roofTop>35?.25:.63,roofTop>35?.90:.59);
    }
    k.box(ochre,0,37.91,0,2.92,1.06,2.92);k.box(umber,0,38.55,0,3.09,.23,3.09);
    for(const e of both)for(let j=-1;j<=1;j++){
      k.box(bronze,e*1.47,38.57,j*.94,.11,.65,.12);k.box(bronze,j*.94,38.57,e*1.47,.10,.65,.11);
    }
    drum(T,k,bronze,0,39.04,0,1.17,.45,.86);
    drum(T,k,bronze,0,42.45,0,.17,.097,6.21);
    for(let i=0;i<7;i++)drum(T,k,dullGold,0,39.89+i*.42,0,.59-i*.026,.56-i*.026,.125);
    drum(T,k,bronze,0,45.84,0,.088,.037,1.96);ball(T,k,gold,0,46.70,0,.17,.19,.17);
    drum(T,k,bronze,0,47.01,0,.047,.009,.48);
  }
  function hallRoof(T,k){
    // Unlike a pyramidal roof the two great surfaces meet along one long
    // transverse ridge. White patterned gables are visible from the flanks.
    const half=12.6,depth=9.35,base=10.45,peak=20.12,zc=1.4,upper=[],under=[];
    const q=(x,u,side)=>[x,base+(peak-base)*(.62*u+.38*u*u)+.46*(Math.abs(x)/half)**7*(1-u),zc+side*depth*(1-u)];
    for(const side of both)for(let j=0;j<6;j++)for(let i=0;i<16;i++){
      const x1=half*(-1+i/8),x2=half*(-1+(i+1)/8),a=q(x1,j/6,side),b=q(x2,j/6,side),c=q(x2,(j+1)/6,side),d=q(x1,(j+1)/6,side);
      const pts=side>0?[a,b,c,a,c,d]:[a,c,b,a,d,c];upper.push(...pts.flat());
      for(let n=pts.length-1;n>=0;n--){const [x,y,z]=pts[n];under.push(x,y-.21,z);}
    }
    surface(T,k,upper,under,charcoal,umber);
    const ribs=[],band=.020;
    for(const e of both)for(let i=0;i<117;i++){
      const x=-half+.10+i*(half*2-.2)/116;
      const corner=(t,dx)=>{const p=q(x+dx,t,e);p[1]+=.025+(dx===0?.023:0);return p;};
      for(let j=0;j<5;j++)for(const [l,r] of [[-band,0],[0,band]]){
        const a=corner(j/5,l),b=corner(j/5,r),c=corner((j+1)/5,r),d=corner((j+1)/5,l);
        const pts=e>0?[a,b,c,a,c,d]:[a,c,b,a,d,c];ribs.push(...pts.flat());
      }
    }
    const tiles=new T.BufferGeometry();tiles.setAttribute('position',new T.Float32BufferAttribute(ribs,3));tiles.computeVertexNormals();k.stamp(tiles,0x615b50,0,0,0);tiles.dispose();
    for(const e of both){
      // A recessed pale triangle, lattice below and scrolling tracery above.
      k.place(e*(half-.37),zc,e*Math.PI/2,()=>{
        k.outline([[-depth+.23,0],[depth-.23,0],[0,9.28]],white,0,base-.04,-.12,.18);
        for(let i=-10;i<=10;i++){const x=i*.78,hh=Math.max(.10,8.92-Math.abs(x)*1.04);k.box(0xa6a89a,x,base+hh/2,.055,.13,hh,.11);}
        for(let j=1;j<11;j++){const y=j*.72,hw=(8.92-y)*.98;if(hw>0)k.box(0xa3a596,0,base+y,.058,2*hw,.115,.11);}
        const tor=new T.TorusGeometry(.82,.088,6,24);k.stamp(tor,white,0,base+6.49,.14);tor.dispose();
        for(let n=0;n<6;n++){const a=n*tau/6;tube(T,k,white,[[0,base+6.49,.15],[.37*Math.cos(a+.24),base+6.49+.37*Math.sin(a+.24),.15],[.79*Math.cos(a),base+6.49+.79*Math.sin(a),.15]],.077);}
        for(const f of both){
          tube(T,k,white,[[f*.54,base+6.30,.22],[f*.97,base+5.73,.22],[f*1.48,base+5.91,.22],[f*1.46,base+6.23,.22],[f*1.27,base+6.26,.22]],.099);
          tube(T,k,white,[[f*.14,base+5.98,.22],[f*.72,base+5.12,.22],[f*1.47,base+4.80,.22],[f*2.44,base+4.95,.22]],.085);
          tube(T,k,washed,[[0,peak-.12,.16],[f*3.36,peak-3.39,.16],[f*6.71,base+2.11,.16],[f*depth,base+.59,.16]],.18);
          tube(T,k,white,[[f*.81,base+6.36,.175],[f*1.54,base+5.47,.175],[f*2.51,base+5.22,.175],[f*2.91,base+5.68,.175]],.095);
        }
      });
      tube(T,k,blue,[[e*half,base+.66,zc+depth],[e*half,base+2.23,zc+depth*.72],[e*half,base+5.17,zc+depth*.40],[e*half,peak+.12,zc],[e*half,base+5.17,zc-depth*.40],[e*half,base+2.23,zc-depth*.72],[e*half,base+.66,zc-depth]],.18);
      for(const f of both)tip(T,k,e*half,base+.42,zc+f*depth,Math.atan2(-f,e),1.65);
      tip(T,k,e*half,peak+.04,zc,e<0?Math.PI:0,1.27);
    }
    k.box(blue,0,peak+.12,zc,half*2+.28,.24,.29);
  }
  const washed=0xc5c4af;
  function stairDragon(T,k,side){
    // Terracotta body runs up the eight-metre stairs, from an open-mouthed,
    // gilded head at the foot to a sweeping tail beside the portico.
    const x=side*4.56,points=[[x,1.13,11.6],[x,1.61,12.9],[x,1.32,14.31],[x,.89,15.12],[x,1.84,16.40],[x,2.12,17.80],[x,1.72,18.42]];
    k.box(0x974b37,x,.22,15.18,.97,.45,7.59);k.box(umber,x,.48,15.18,1.01,.105,7.63);
    tube(T,k,0x9c573d,points,.34,32);
    for(let i=0;i<14;i++){const u=i/13,y=.46*Math.sin(u*9.2)+1.44,z=11.70+6.03*u;
      tube(T,k,gold,[[x,y+.22,z],[x,y+.46,z-.11],[x,y+.52,z-.25]],.083);}
    const y=2.03,z=18.11;
    ball(T,k,0x99523b,x,y,z,.42,.43,.46);ball(T,k,gold,x,y+.08,z+.39,.31,.15,.39);
    ball(T,k,umber,x,y-.09,z+.43,.29,.073,.30);ball(T,k,0xb67945,x,y-.22,z+.38,.33,.095,.34);
    for(const e of both){
      ball(T,k,gold,x+e*.33,y+.20,z+.16,.092,.107,.12);ball(T,k,umber,x+e*.402,y+.21,z+.19,.029,.052,.044);
      tube(T,k,gold,[[x+e*.24,y+.38,z+.03],[x+e*.31,y+.62,z-.14],[x+e*.26,y+.80,z-.28]],.081);
      tube(T,k,gold,[[x+e*.25,y-.17,z+.43],[x+e*.48,y-.22,z+.56],[x+e*.62,y-.05,z+.68]],.038);
      for(let i=0;i<4;i++)tube(T,k,0xb77748,[[x+e*.33,y+.19-i*.10,z-.10],[x+e*.49,y+.39-i*.10,z-.45],[x+e*.43,y+.44-i*.12,z-.80]],.059);
    }
  }
  function hall(T,k){
    k.box(stone,0,.66,.46,24.22,1.31,22.74);k.box(0xb78266,0,1.38,.46,24.3,.16,22.8);
    k.box(cream,0,4.59,-1.21,20.64,6.43,16.86);
    for(const side of both){
      for(const z of [-7.8,-2.5,2.80,7.85]){
        drum(T,k,vermilion,side*11.41,3.83,z,.26,.25,4.68);
        k.box(ochre,side*11.41,1.57,z,.69,.23,.68);
        k.box(umber,side*10.40,3.45,z,.12,3.41,1.34);
        for(let j=0;j<4;j++)k.box(ochre,side*10.48,4.10,z-.55+j*.37,.10,1.73,.055);
      }
      for(let x=0;x<3;x++){k.box(umber,side*(2.0+3.30*x),3.36,7.28,2.64,3.78,.13);
        for(let j=0;j<6;j++)k.box(0xad8254,side*(.91+3.30*x+j*.414),4.60,7.37,.067,1.18,.04);}
      for(const x of [3.1,7.16,11.41])drum(T,k,vermilion,side*x,3.92,10.63,.26,.26,4.82);
      stairDragon(T,k,side);
    }
    for(let n=0;n<8;n++){const z=18.62-n*.92,hh=.18+n*.16;k.box(0xb9997e,0,hh/2-.45,z,8.12,hh+.90,.99);}
    // The dark shallow eaves skirt the lower storey on all four sides.
    hips(T,k,27.2,24.3,5.88,8.12,charcoal,blue,.745,.53);
    k.box(pink,0,9.21,1.4,24.21,2.58,17.55);
    for(const a of [0,Math.PI,Math.PI/2,-Math.PI/2]){
      const end=Math.abs(Math.cos(a))>.5,w=end?23.8:17.3,z0=end?8.84:12.13;
      k.place(0,1.40,a,()=>{
        k.box(ochre,0,9.74,z0,w,1.17,.11);
        for(let i=0;i<=Math.floor(w/.42);i++)k.box(cream,-w/2+i*.42,8.68,z0,.131,.52,.095);
        for(let i=0;i<Math.round(w/2.55);i++){
          const x=-w/2+(i+.5)*w/Math.round(w/2.55);
          k.box(0xa06d4e,x,9.72,z0+.062,1.53,.78,.065);ball(T,k,dullGold,x,9.74,z0+.11,.25,.25,.048);
        }
      });
    }
    cornice(k,0,8.22,1.4,24.42,17.84,vermilion);hallRoof(T,k);
    k.place(0,-5.96,0,()=>tower(T,k));
    // Covered forecourt strip in the 2026 aerial views follows the street
    // side of the front steps, rather than extending over the whole court.
    for(const x of [-8.4,0,8.4])for(const f of both)k.box(0x7c695a,x,2.68,20.1+f*1.66,.115,5.34,.115);
    for(const f of both)k.box(0xa25c48,0,5.09,20.1+f*.96,17.45,.13,2.17,0,f*.38);
  }
  function wheel(T,k,x,y,z,r,tint){
    const tor=new T.TorusGeometry(r,r*.074,6,28);k.stamp(tor,tint,x,y,z);tor.dispose();
    for(let i=0;i<8;i++){const a=i*tau/8;
      tube(T,k,tint,[[x,y,z],[x+Math.cos(a)*r*.53,y+Math.sin(a)*r*.53,z],[x+Math.cos(a)*r*.93,y+Math.sin(a)*r*.93,z]],r*.040,3);
    }ball(T,k,tint,x,y,z,r*.13,r*.13,r*.074);
  }
  function lintel(T,k,x,y,z,w,h,mirror=false){
    // Original gold-on-dark vegetal relief over the gate openings.
    k.place(x,z,mirror?Math.PI:0,()=>sign(T,k,0,y,0,w,h,(g,a,b)=>{
      g.fillStyle='#795837';g.fillRect(0,0,a,b);g.strokeStyle='#d7b465';g.lineWidth=6;g.strokeRect(5,5,a-10,b-10);g.lineCap='round';
      for(let i=0;i<7;i++){const x=(i+.5)*a/7,yy=b*.51;
        g.beginPath();g.moveTo(x-24,yy+9);g.bezierCurveTo(x-16,yy-38,x+21,yy-34,x+20,yy);g.bezierCurveTo(x+17,yy+28,x-13,yy+22,x-8,yy+6);g.stroke();
        for(const s of both){g.beginPath();g.ellipse(x+s*20,yy+s*24,13,5,s*.7,0,tau);g.fillStyle='#d3a858';g.fill();}
      }
    }));
  }
  function entrance(T,k,major){
    if(!major){
      const openings=[[-4.41,3.22,3.25],[0,4.24,4.02],[4.41,3.22,3.25]];
      for(const [x,w,h] of openings){
        k.place(x,0,0,()=>{
          for(const s of both){drum(T,k,umber,s*w*.46,h*.48,0,.21,.195,h*.98);k.box(dark,s*w*.46,.18,0,.50,.35,.47);}
          k.box(umber,0,h+.23,0,w+.43,.49,1.12);k.box(umber,0,h*.50,-.14,w-.51,h-.24,.23);
          for(let j=0;j<4;j++){
            const xx=w*.68*(j/3-.5);k.box(0x765345,xx,h*.48,.006,.036,h-.51,.032);
            for(const q of [.31,.67])k.box(0x503729,xx,h*q,.023,w*.150,h*.15,.026);
          }
          k.place(0,0,0,()=>A.curvedRoof(T,k,0,h+.49,0,w+1.25,2.84,.66,0x79634d,blue,blue,.32));
        });
      }
      A.plaque(T,k,'BỬU MINH CỔ TỰ',0,3.79,.38,3.16,.45,{bg:'#42362d',fg:'#d8ba69',border:umber});
      for(const x of [-5.96,-2.19,2.19,5.96])elephant(T,k,x,1.05);
      return;
    }
    const bays=[[-4.04,3.33,.90,2.63],[0,4.77,1.46,3.48],[4.04,3.33,.90,2.63]];
    for(const [x,w,r,h] of bays){
      const y=h-r+.66;const sh=new T.Shape();sh.moveTo(-w/2,.64);sh.lineTo(-r,.64);sh.lineTo(-r,y);sh.absarc(0,y,r,Math.PI,0,true);sh.lineTo(r,.64);sh.lineTo(w/2,.64);sh.lineTo(w/2,h+1.42);sh.lineTo(-w/2,h+1.42);sh.closePath();k.profile(sh,ochre,x,0,-.65,1.3);
      for(const face of both){
        const z=face*.695;
        for(const dir of both)k.box(umber,x+dir*(r+.08),(y+.62)/2,z,.156,y-.63,.085);
        const curve=[];for(let n=0;n<=18;n++){const a=n*Math.PI/18;curve.push([x+(r+.045)*Math.cos(a),y+(r+.045)*Math.sin(a),z]);}tube(T,k,umber,curve,.092,18);
        lintel(T,k,x,h+1.01,z+face*.05,w-.14,.50,face<0);
      }
      for(const side of both){
        const ww=r*.94;
        k.place(x+side*r,-.33,side>0?1.39:Math.PI-1.39,()=>{
          for(const v of [.82,1.34,y+.13])k.box(door,ww/2,v,0,ww,.105,.10);
          for(let j=0;j<8;j++)k.box(door,ww*j/7,(.73+y)/2,0,.032,y-.72,.055);
        });
      }
    }
    for(const e of both){
      k.box(ochre,e*6.31,1.98,0,2.40,3.07,1.34);
      k.box(umber,e*6.35,2.12,.71,1.61,1.64,.15);
      k.box(0xaa874b,e*6.35,2.12,.792,1.40,1.44,.075);
      wheel(T,k,e*6.35,2.12,.85,.59,gold);
      k.place(e*5.13,0,0,()=>A.curvedRoof(T,k,0,3.62,0,5.46,3.13,.78,red,blue,blue,.31));
    }
    for(const e of both)for(const side of both){
      const x=e*(side>0?4.05:.73),w=side>0?1.28:1.36,dx=side>0?0:.15*e,tilt=side>0?.05*e:.68*e;
      k.place(x+dx,-.28,tilt,()=>{
        k.box(door,0,1.60,0,w,1.85,.15);
        for(let j=0;j<6;j++)k.box(0x8e6244,(j-2.5)*w/6,2.50,0,.036,.91,.13);
        for(const y of [1.05,1.74])k.box(umber,0,y,.089,w*.84,.62,.047);
        wheel(T,k,0,2.20,.11,w*.34,dullGold);
      });
    }
    k.box(umber,0,4.89,0,8.39,1.67,1.54);
    for(const e of both)for(const x of [-2.77,2.77])lintel(T,k,x,4.86,e*.84,2.09,.89,e<0);
    A.curvedRoof(T,k,0,5.58,0,9.36,3.48,.93,red,blue,blue,.35);
    k.box(ochre,0,6.86,0,4.47,1.37,1.74);
    for(const e of both){
      k.box(ochre,0,5.02,e*.88,2.18,.62,.10);k.box(umber,0,5.05,e*.945,1.72,.30,.042);
      for(let i=-2;i<=2;i++)ball(T,k,dullGold,i*.26,5.04,e*.976,.071,.086,.027);
    }
    for(const e of both)for(let j=-4;j<=4;j++)k.box(umber,j*.49,6.89,e*.91,.107,1.44,.12);
    balcony(k,0,6.28,0,5.03,2.21,umber,.59);A.curvedRoof(T,k,0,7.52,0,5.94,2.96,.89,red,blue,blue,.33);
    wheel(T,k,0,8.69,0,.28,gold);
    for(const e of both){tip(T,k,e*2.02,8.37,0,e===1?0:Math.PI,.76);tip(T,k,e*4.05,6.29,0,e===1?0:Math.PI,.65);}
    for(let i=0;i<5;i++)k.box(stone,0,-.40+i*.079,2.10-i*.30,15.05,.96+i*.16,.36);
    k.box(stone,0,.29,0,15.24,.59,2.17);
    for(const x of [-7.42,-2.31,2.31,7.42]){
      const path=[[x,.38,2.48],[x,.53,2.03],[x,.75,1.51],[x,.93,1.01]];tube(T,k,grey,path,.18);
      ball(T,k,grey,x,.55,2.08,.23,.245,.32);
    }
  }
  const door=0x714636,grey=0x656e68;
  function elephant(T,k,x,z){
    k.box(dark,x,.47,z,.92,.93,.94);k.box(dullGold,x,.79,z,.94,.12,.95);
    ball(T,k,gold,x,1.46,z,.35,.39,.45);ball(T,k,gold,x,1.57,z+.38,.286,.294,.25);
    for(const s of both){
      ball(T,k,dullGold,x+s*.25,1.55,z+.28,.12,.22,.14);
      for(const f of both)drum(T,k,gold,x+s*.205,1.12,z+f*.245,.092,.119,.40,9);
      ball(T,k,dark,x+s*.162,1.62,z+.56,.024,.023,.022);
      tube(T,k,cream,[[x+s*.145,1.46,z+.52],[x+s*.177,1.37,z+.63],[x+s*.203,1.40,z+.74]],.03);
      tube(T,k,dark,[[x+s*.31,1.70,z+.06],[x+s*.16,1.81,z+.04],[x,1.835,z+.045]],.020);
    }
    tube(T,k,gold,[[x,1.53,z+.53],[x+.02,1.32,z+.68],[x-.02,1.03,z+.69],[x-.12,.99,z+.64]],.075);
  }
  function prayerGallery(T,k){
    for(let i=0;i<11;i++){
      const z=-12+i*2.45;
      for(const x of [-1.95,1.95])k.box(0x9c4e39,x,1.77,z,.15,3.51,.16);
    }
    for(const side of both){k.box(0x8c483b,side*1.05,3.76,.24,2.43,.107,26.01,0,0,-side*.38);
      k.box(vermilion,side*1.07,.75,.30,.13,.09,24.86);k.box(umber,side*1.08,2.81,.30,.14,.10,24.86);
      for(let i=0;i<25;i++){const z=-11.75+i*.998;drum(T,k,grey,side*1.08,1.75,z,.071,.071,2.0,8);
        drum(T,k,bronze,side*1.08,1.77,z,.378,.378,.94,16);
        for(const yy of [1.35,1.60,1.94,2.19])drum(T,k,dullGold,side*1.08,yy,z,.39,.39,.047,16);
      }
    }
  }
  function statue(T,k){
    const marble=0xdcd8c4;
    for(const [y,low,high,h] of [[.39,2.66,2.62,.78],[1.24,2.54,2.06,1.07],[2.06,2.22,1.63,.86],[2.81,1.79,1.39,.72],[3.31,1.38,1.19,.46]])drum(T,k,teal,0,y,0,low,high,h,24);
    for(let j=0;j<3;j++)for(let i=0;i<12;i++){
      const a=(i+j*.50)*tau/12,r=[2.35,2.00,1.6][j],y=.83+j*.77;
      const p=(u,v)=>[r*Math.sin(a+u),y+v,r*Math.cos(a+u)];
      tube(T,k,dullGold,[p(-.20,.01),p(-.17,.35),p(0,.62),p(.17,.36),p(.20,0)],.042);
    }
    A.lotusSeat(T,k,0,3.18,0,1.24,.55,white,washed);
    A.statueFigure(T,k,marble,0,3.74,0,3.4,{robe:true,openHand:true,
      rightArm:[[-.136,.66,.041],[-.11,.75,.105],[-.10,.81,.112]],leftArm:[[.13,.62,.02],[.055,.57,.090],[.03,.54,.110]]});
  }
  function annex(T,k){
    const w=15.3,d=12.2,base=9.61,wall=0xb9b5ac;
    k.box(wall,0,4.88,0,w,9.73,d);const each=w/5;
    for(let i=0;i<5;i++)for(let j=0;j<3;j++){
      const x=(i-2)*each,y=1.68+j*3.0;
      k.box(0x68777e,x,y,6.13,2.19,1.88,.12);k.box(0xc6bda5,x,y,6.21,.06,1.88,.045);
      k.box(umber,x-each*.48,y,6.65,.17,2.83,.21);
      if(j>0)k.box(washed,x,y-.27,6.62,each-.11,.100,.08);
    }
    for(const y of [.35,3.45,6.47,9.45])k.box(0x987765,0,y,6.44,w+.63,.27,1.02);
    // Red subsidiary roof and the small, open pyramidal lookout above.
    hips(T,k,17,14.0,base,12.87,red,umber,.31,.12);
    for(const x of [-1.75,1.75])for(const z of [-1.32,1.32])k.box(umber,x,13.56,z,.14,1.50,.14);
    hips(T,k,4.86,4.30,14.18,16.03,0x994e41,umber,.02,.055);
  }
  function courtyard(T,k,anchors){
    const pos=[],uv=[],ix=[];
    const nx=37,nz=36;
    for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){
      const x=-17.0+73.30*i/nx,z=-39.1+69.8*j/nz+Math.max(x,0)*.048*j/nz,n=j*(nx+1)+i;
      pos.push(x,0,z);uv.push(x,z);
      if(i&&j)ix.push(n-nx-2,n-1,n,n-nx-2,n,n-nx-1);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();
    const mat=new T.MeshStandardMaterial({color:pave,roughness:.97,side:T.DoubleSide});mat.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 courtUV;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncourtUV=uv;');
      shader.fragmentShader='varying vec2 courtUV;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 coord=courtUV/vec2(.498,.468),ed=min(fract(coord),1.-fract(coord)),aa=clamp(.5*fwidth(coord),.001,.12);
        vec2 marks=smoothstep(vec2(.014)-aa,vec2(.014)+aa,ed);
        float v=fract(sin(dot(floor(coord),vec2(19.81,28.29)))*22781.);
        diffuseColor.rgb*=mix(.74,.86+.20*v,marks.x*marks.y);`);
    };
    const mesh=new T.Mesh(g,mat);mesh.receiveShadow=true;k.group.add(mesh);
    const fit=k.group.userData.fitGround;
    k.group.userData.fitGround=ground=>{
      fit(ground);const points=g.attributes.position;
      for(let i=0;i<points.count;i++){
        const x=points.getX(i),z=points.getZ(i),natural=ground(x,z);let y=natural+.14;
        for(const a of anchors){const d=Math.max(0,Math.abs(x-a.x)-a.w/2,Math.abs(z-a.z)-a.d/2);
          if(d<2.2)y=Math.max(y,natural+.14+(a.anchor.height-natural)*(1-d/2.2));}
        points.setY(i,y);
      }
      points.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
    };
  }
  function field(T,k){
    // Neighbouring cultivation is visible on the two registered overheads.
    // These bounded beds north and east of the walls follow diagonal furrows.
    const tris=[],col=[],ix=[],edges=[];const stride=1.52,dirX=.49,dirZ=.872;
    function rows(x0,x1,z0,z1,offset){
      for(let n=-100;n<90;n++){
        const perp=n*stride+offset,px=perp*dirZ,pz=-perp*dirX;
        const ta=Math.max((x0-px)/dirX,(z0-pz)/dirZ),tb=Math.min((x1-px)/dirX,(z1-pz)/dirZ);
        if(tb-ta<.85)continue;
        const steps=Math.ceil((tb-ta)/3.10),base=tris.length/3;
        for(let j=0;j<=steps;j++){
          const q=ta+(tb-ta)*j/steps,x=px+q*dirX,z=pz+q*dirZ;
          for(const [a,h] of [[-.65,.08],[-.56,.56],[0,.72],[.56,.54],[.65,.08]]){
            const tx=x+dirZ*a,tz=z-dirX*a,n=tris.length/3;
            const tint=new T.Color(h<.20?0x577447:h<.60?0x638545:0x799249);
            tris.push(tx,h,tz);edges.push(h);col.push(tint.r,tint.g,tint.b);
            if(j&&n%5!==base%5)ix.push(n-6,n,n-1,n-6,n-5,n);
          }
        }
      }
    }
    rows(-52,-18.4,-43,28,0);rows(-17.4,54,-68,-42,.30);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(tris,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(ix);g.computeVertexNormals();
    const mesh=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide}));mesh.receiveShadow=true;k.group.add(mesh);
    return ground=>{const pos=g.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,ground(pos.getX(i),pos.getZ(i))+edges[i]);pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();};
  }
  function build(T,k){
    k.palette({tile:[charcoal,red,0x79634d,0x994e41],timber:[umber,door,dark],plaster:[cream,ochre,pink],stone:[stone,washed]});
    const f=createTempleFoundations(T,k),anchors=[];
    function pad(x,z,w,d,fn){const anchor=f.building(x,z,0,w,d,fn);anchors.push({x,z,w,d,anchor});}
    pad(0,0,23,22.5,()=>hall(T,k));pad(.10,30.17,14.9,2.1,()=>entrance(T,k,true));
    pad(45.88,31.71,13.33,2.2,()=>entrance(T,k,false));pad(32.63,16.85,4.30,25.20,()=>prayerGallery(T,k));
    pad(20.30,5.26,4.76,4.80,()=>statue(T,k));pad(1.9,-29.2,15.32,12.42,()=>annex(T,k));
    function auxiliary(x,z,w,d,h,col){
      pad(x,z,w,d,()=>{k.box(cream,0,h/2,0,w,h,d);
        for(let j=0;j<Math.max(2,w/2.8);j++){const x=w*((j+.5)/Math.ceil(w/2.8)-.5);k.box(0x716459,x,h*.58,d/2+.035,.86,h*.48,.075);}
        A.curvedRoof(T,k,0,h+.12,0,w+1.30,d+1.20,Math.min(2.7,d/3),col,umber,umber,.31);
      });
    }
    auxiliary(-12.2,-30.3,9.20,14.2,5.65,0x936555);auxiliary(21.8,-28.6,14.6,14.3,4.00,0x90644d);
    auxiliary(39.6,-19.7,18,12.8,3.07,0x74877c);
    pad(50.5,14.7,6.08,5.62,()=>{drum(T,k,ochre,0,1.35,0,2.90,2.90,2.70,8);
      const rf=new T.ConeGeometry(3.65,2.38,8);k.stamp(rf,red,0,3.87,0);rf.dispose();});
    for(const [x,z,h] of [[17.8,17.4,2.40],[22.1,23.7,2.98],[24.8,15.9,2.78],[26.3,9.1,2.18],[-11.0,24.2,2.64],[-13.3,18.3,2.44],[9.2,22.7,2.90],[-10.7,-14.6,3.02]]){
      const w=h*.48;let meshes=[];
      f.fixture(g=>g(x,z),()=>{meshes=k.place(x,z,0,()=>{drum(T,k,0xa55a45,0,.38,0,w*.54,w*.89,.72,12);A.trees(T,k,[{x:0,z:0,h,width:w,kind:'banyan'}]);});},y=>{for(const m of meshes)m.position.y=y;});
    }
    for(const [x,z,h,w] of [[-14.6,12.3,8.4,2.72],[-14.3,3.8,9.32,2.55],[-14.3,-2.9,8.98,2.87],[-13.9,-9.03,9.4,2.81],[-10.1,20.2,8.8,2.8],[-7.7,24.5,8.45,2.63],[-5.9,27.8,8.97,2.69],[13.1,18.5,5.61,3.0],[18.7,20.28,5.5,4.01],[25.47,1.55,7.0,4.0],[49.1,19.2,6.77,4.01]]){
      let child;
      f.fixture(g=>g(x,z),()=>{A.trees(T,k,[{x,z,h,width:w,kind:h>8?'palm':'banyan'}]);child=k.group.children.at(-1);},y=>{child.position.y=y;});
    }
    function fence(x1,z1,x2,z2){
      const d=Math.hypot(x2-x1,z2-z1),cx=(x1+x2)/2,cz=(z1+z2)/2;
      f.fixture(g=>g(cx,cz),()=>k.place(cx,cz,-Math.atan2(z2-z1,x2-x1),()=>{
        k.box(0xa18f78,0,.44,0,d,.85,.22);const bays=Math.max(1,Math.round(d/2.33));
        for(let j=0;j<=bays;j++){const x=d*(j/bays-.5);k.box(ochre,x,.84,0,.28,1.68,.29);k.box(dullGold,x,1.71,0,.34,.12,.35);}
        for(let j=0;j<bays*7;j++)k.box(grey,d*((j+.50)/(bays*7)-.5),1.16,0,.035,.80,.04);
        k.box(grey,0,1.39,0,d,.042,.07);
      }));
    }
    fence(-17,29.72,-7.72,30.12);fence(7.98,30.39,39.18,31.61);fence(52.74,31.91,56.2,32.21);fence(-17,29.72,-17,-36.3);
    courtyard(T,k,anchors);const fit=k.group.userData.fitGround,fields=field(T,k);k.group.userData.fitGround=g=>{fit(g);fields(g);};
  }
  const shot=(name,x,z,height,r,angle,elev,fov)=>({name,offset:[x*c+z*s,-x*s+z*c],viewBase:'monument',height,viewRadius:r,viewAngle:yaw+angle,viewElevation:elev,viewFov:fov});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Chùa Bửu Minh – Biển Hồ Trà',kind:'Công trình tín ngưỡng',province:'Gia Lai',city:'Biển Hồ',
    lon:108.01331744,lat:14.06617701,start:[108.0130060,14.0660780],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    yaw,width:74,depth:75,build,source,photo,map:'https://www.openstreetmap.org/node/5439114923',
    reserve:(x,z,r)=>x>-52-r&&x<56+r&&z>-62-r&&z<32+r,boundary:[[-17,29.72],[56.2,33.39],[56.2,-39.1],[-17,-39.1]],
    solids:[[0,.46,11.6,11.0],[20.30,5.26,2.33,2.30],[1.9,-29.2,7.66,6.22]],
    description:'Chánh điện nhìn về hướng tây, chếch nam, giữa những luống chè ở Nghĩa Hưng. Mái ngói sẫm có một đòn dông, hai mặt mái dốc gợi dáng nhà rông. Sau đòn dông là tháp vuông ba mái đỏ. Đỉnh tháp cao 47,25 m tính từ mặt đất. Cổng tam quan tường vàng hướng thẳng về chánh điện. Xa hơn về phía nam là cổng gỗ có tượng voi.',
    arrivalNote:'Từ cuối đường thông, theo đường địa phương khoảng 160 m tới tam quan. Xe dừng trên đường trước cổng. Từ đó đi bộ vào sân chùa.',
    views:[shot('Mái chánh điện và tháp ba tầng nhìn từ vườn chè',-.8,-.4,42.8,57,-1.06,-.19,60),
      shot('Tam quan ngói đỏ nhìn từ đường vào chùa',.20,30.0,10.10,14.81,.28,-.115,67),
      shot('Cổng gỗ Bửu Minh Cổ Tự và đôi hàng voi',45.88,31.58,6.75,11.84,.13,-.074,65)]});
})();

export default window.VietnamSights;
