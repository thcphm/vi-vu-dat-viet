const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Hồ Lắk / Liên Sơn, 2026-11-22. The OSM footprint is 19.6 x 22.1 m.
  // The adjacent OSM service road w52755113 ends at the north-east side of
  // the apron. The included public driving graph reaches its junction with
  // Âu Cơ (n4735572208). https://www.openstreetmap.org/way/52823719
  // Registration: Hữu Tú's 2024 overhead front, flank and rear photographs
  // match the low projecting box, patched tiles, side driveway and lakeward
  // apron in World Imagery and satellite photography. The high glazed end
  // faces WNW, bearing about 299 degrees. The regional museum gives SE in
  // its lake overview; the terrace and high end in the photos face away
  // from the low roof and towards the water north-west of the hill.
  // https://thanhnien.vn/chiem-nguong-biet-dien-bao-dai-o-ho-lak-185241110224321855.htm
  // https://www.daklakmuseum.vn/tin-tuc-su-kien/bai-viet/di-tich-thang-canh-quoc-gia-ho-lak
  // Photographer Hà Thành documents the two side-by-side notched wooden
  // stairs, the lateral concrete stair and the corner glazing/sitting area.
  // https://vnexpress.net/biet-dien-bao-dai-ben-ho-lak-4393734.html
  // https://heritagevietnamairlines.com/en/royal-echoes-in-the-highlands/
  // Profiles, roof pitch, furniture, tree heights and finishes are estimated
  // from photographs. No reference-photo pixels are used in the scene.
  const catalogId='osm-way-52823719',id='biet-dien-bao-dai-ho-lak';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Missing Hồ Lắk villa catalog entry');
  const source='https://daklak.gov.vn/vi/dia-danh-di-tich-thang-canh/-/asset_publisher/bDngMUmMrWIw/content/di-tich-danh-lam-thang-canh-ho-lak';
  const photo='https://thanhnien.vn/chiem-nguong-biet-dien-bao-dai-o-ho-lak-185241110224321855.htm';
  const yaw=-2.078,cs=Math.cos(yaw),sn=Math.sin(yaw),sides=[-1,1];
  const pink=0xd8a69f,ivory=0xe2cfc0,post=0x453a36,brown=0x654836,umber=0x905336;
  const timber=0x866245,wood=0xc39157,straw=0xd0ad75,metal=0x565859,brick=0xa15e48;
  const stone=0x8a897a,grout=0x777970,chrome=0xaca799,red=0xa65945;
  const W=9.45,Z=9.83,level=3.02,second=6.08,pitch=.316;
  const yroof=z=>6.72+pitch*z;
  function pipe(T,k,tint,p,q,r,sides=7){
    const delta=new T.Vector3(q[0]-p[0],q[1]-p[1],q[2]-p[2]),len=delta.length();
    const geo=new T.CylinderGeometry(r,r,len,sides);
    geo.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.multiplyScalar(1/len)));
    k.stamp(geo,tint,(p[0]+q[0])/2,(p[1]+q[1])/2,(p[2]+q[2])/2);geo.dispose();
  }
  function tri(T,k,points,col){
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points,3));geo.computeVertexNormals();k.stamp(geo,col,0,0,0);geo.dispose();
  }
  function plate(T,k,material,vertices,uv){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices.flat(),3));
    if(uv)g.setAttribute('uv',new T.Float32BufferAttribute(uv.flat(),2));
    g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();const m=new T.Mesh(g,material);m.receiveShadow=true;k.group.add(m);return m;
  }
  function texture(T,w,h,draw){
    const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
    const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;return map;
  }
  function roof(T,k){
    // A single continuous pitch falls towards the rear service block. The
    // two side strips return before the flat rectangular roof at the back.
    const tint=texture(T,864,862,(g,w,h)=>{
      let seed=34912;function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
      function patch(x,y){
        const px=x/w,py=y/h,noise=.15*Math.sin(px*70+py*61)+.10*Math.sin(px*133-py*68);
        return ((px-.82)**2/.025+(py-.79)**2/.021<.82+noise&&!(px<.82&&py>.77)&&!(px>.89&&py<.80))||
          (py<.052+.011*Math.sin(px*42)&&px>.09&&px<.90)||(px>.70&&px<.87&&py<.12+.016*Math.sin(px*56));
      }
      g.fillStyle='#714e43';g.fillRect(0,0,w,h);
      for(let j=0;j<75;j++)for(let i=-1;i<72;i++){
        const x=i*12.3+(j%2)*.7,y=j*11.6,r=random(),fresh=patch(x,y);
        const t=fresh?[177,86,65]:[103,78,66],delta=Math.round((r-.45)*(fresh?20:29));
        g.fillStyle='rgb('+t.map(c=>c+delta).join(',')+')';g.fillRect(x+.25,y+.21,12.12,11.52);
        g.fillStyle=fresh?'#b56b53':'#877366';g.globalAlpha=.48;g.fillRect(x+1,y,1.5,11.3);
        g.fillStyle='#302723';g.globalAlpha=.30;g.fillRect(x+10,y,.95,11.3);g.fillRect(x,y+10.97,12.25,1);g.globalAlpha=1;
      }
    });
    const tile=new T.MeshStandardMaterial({map:tint,roughness:.94,side:T.DoubleSide});
    function panel(x0,z0,x1,z1){
      const a=[[x0,yroof(z0),z0],[x0,yroof(z1),z1],[x1,yroof(z1),z1],[x1,yroof(z0),z0]];
      plate(T,k,tile,a,a.map(([x,y,z])=>[(x+10.19)/20.38,1-(z+11.13)/22.2]));
    }
    panel(-10.17,-5.81,10.17,11.05);
    panel(-9.21,-11.12,-2.46,-5.81);panel(2.46,-11.12,9.21,-5.81);
    k.box(pink,0,2.97,-8.37,4.86,5.37,5.50);k.box(grout,0,5.69,-8.37,5.0,.18,5.68);
    for(const side of sides)k.box(0xa2968c,side*2.42,5.85,-8.37,.14,.34,5.66);
    k.box(0xa2968c,0,5.85,-11.14,4.98,.34,.16);
    k.box(post,0,yroof(11.05)-.11,11.05,20.48,.24,.20);
    for(const e of sides){
      const slope=Math.atan(pitch),length=16.86*Math.sqrt(1+pitch*pitch);
      k.box(post,e*10.12,yroof(2.62)-.11,2.62,.16,.21,length,0,-slope);
      k.box(post,e*9.18,yroof(-8.48)-.11,-8.48,.17,.19,5.59,0,-slope);
    }
    k.box(umber,0,yroof(10.42)-.16,10.38,20.33,.13,1.36,0,-Math.atan(pitch));
    for(let i=0;i<=6;i++)k.box(post,-W+i*W/3,yroof(10.41)-.23,10.44,.26,.32,1.55,0,-Math.atan(pitch));
    for(let i=-2;i<=2;i++)k.stamp(k.round,0xcbba90,i*3.15,yroof(10.46)-.235,10.49,.094,.027,.094);
  }
  function glazing(T,k,glass,width,y0,y1,z,panes=3,curtains=false){
    const height=y1-y0,y=(y0+y1)/2;
    plate(T,k,glass,[[-width/2,y0,z],[width/2,y0,z],[width/2,y1,z],[-width/2,y1,z]]);
    for(let i=0;i<=panes;i++)k.box(metal,width*(i/panes-.5),y,z+.018,.045,height+.055,.065);
    for(const dy of [y0,y1])k.box(metal,0,dy,z+.018,width,.058,.065);
    if(y0>.9)for(const dy of [.26,.47,.69])k.box(post,0,y0+dy,z+.079,width,.030,.045);
    if(curtains)for(const side of sides){
      const n=6,w=width*.24;
      for(let i=0;i<n;i++){
        const x=side*(width/2-(i+.5)*w/n-.045);
        k.box([0xddd2bc,0xe9dfcd,0xcfc2ad][i%3],x,y,z-.105+i%2*.032,w/n+.009,height-.10,.049);
      }
    }
  }
  function bayFront(T,k,glass,i){
    const dx=W/3-.23,x=(i-2.5)*W/3;
    k.place(x,0,0,()=>{
      if(i===3){
        k.box(ivory,0,level+1.24,Z,dx,2.52,.17);
        k.box(brown,0,level+1.15,Z+.11,1.52,2.25,.09);
        k.box(0x493e37,0,level+1.21,Z+.164,1.32,2.01,.04);
      }else{
        glazing(T,k,glass,dx,level+.30,second-.78,Z,3,i===0||i===5);
        if(i>3)k.box(ivory,0,level+.16,Z,dx,.29,.24);
      }
      if(i===2||i===3){
        k.box(pink,0,second+1.31,Z,dx,2.68,.24);
        for(const j of [-1,0,1])k.box(metal,j*.84,second+1.95,Z+.13,.47,.44,.025);
      }else glazing(T,k,glass,dx,second+.15,8.14,Z,3,true);
      k.box(pink,0,2.64,Z,dx,.80,.24);k.box(pink,0,5.63,Z,dx,.85,.24);
      k.box(pink,0,8.97,Z,dx,1.53,.24);k.box(post,0,9.24,Z+.14,.38,.38,.07);
      if(i===3){k.box(pink,0,1.26,Z,dx,2.03,.28);k.box(post,.51,1.04,Z+.18,.79,1.55,.07);}
      else glazing(T,k,glass,dx,.30,2.24,Z,3,i>=2);
      k.box(post,0,8.55,Z+.51,dx+.02,.13,1.15,0,.15);
      k.box(brick,0,8.66,Z+.49,dx+.04,.12,1.18,0,.15);
      for(const s of sides)pipe(T,k,brown,[s*dx*.36,8.01,Z],[s*dx*.36,8.47,Z+.80],.036);
    });
  }
  function flank(T,k,glass,side){
    // Side in both drone and pavement photos: tall glazed bay, broad pink
    // bay with square vents, another glazed bay, then a low timber screen.
    k.place(side*W,0,side*Math.PI/2,()=>{
      const section=(z0,z1,y,h,col)=>k.box(col,-side*(z0+z1)/2,y,0,z1-z0,h,.23);
      const windowAt=(z0,z1,y0,y1,pleats)=>k.place(-side*(z0+z1)/2,0,0,()=>glazing(T,k,glass,z1-z0,y0,y1,.037,3,pleats));
      for(const [lo,hi] of [[5.75,9.70],[1.50,5.75],[-2.72,1.50],[-6.05,-2.72]]){
        const mid=(lo+hi)/2,ex=-side*mid;
        const max=Math.max(lo,hi),half=(hi-lo)/2;
        if(lo>=5){
          section(lo,hi,1.53,2.97,pink);windowAt(lo+.10,hi-.10,level+.34,5.26,true);
          section(lo,hi,5.67,.81,pink);windowAt(lo+.10,hi-.10,second+.14,8.13,true);
        }else if(lo>1){section(lo,hi,2.76,5.42,pink);for(const s of sides)k.box(metal,ex+s*.47,.97,.127,.42,.41,.035);}
        else if(lo>-3){windowAt(lo+.11,hi-.11,.30,2.21,true);section(lo,hi,2.63,.81,pink);windowAt(lo+.10,hi-.10,level+.22,5.04,true);}
        else{section(lo,hi,1.49,2.91,0x705748);for(let i=0;i<21;i++)k.box(post,ex+(i-10)*(hi-lo)/22,1.53,.14,.052,2.84,.07);}
        const y0=lo>=5?8.13:lo>1?5.46:lo>-3?5.05:2.90;
        const zz=.11,a=[-side*lo,y0,zz],b=[-side*hi,y0,zz],c=[-side*hi,yroof(hi)-.12,zz],d=[-side*lo,yroof(lo)-.12,zz];
        if(side===1)tri(T,k,[...a,...d,...b,...b,...d,...c],pink);else tri(T,k,[...a,...b,...d,...b,...c,...d],pink);
        k.box(post,-side*max,(yroof(max)-.08)/2,.11,.25,yroof(max)-.12,.25);
        if(lo>-3){k.box(post,ex,5.64,.38,2*half,.12,.76,0,.14);k.box(brick,ex,5.71,.37,2*half,.09,.76,0,.14);}
      }
    });
  }
  function portico(T,k){
    const x=1.56,z=11.55,front=12.86,ridge=8.20,low=6.38,dx=2.82,dz=1.85;
    k.box(post,x,level-.015,z,3.45,.31,2.80);
    for(const s of sides)k.box(post,x+s*1.52,3.19,front,.31,6.22,.32);
    for(const s of sides){
      const side=x+s*dx;
      tri(T,k,[x,ridge,z+dz,side,low,z+dz,side,low,z-dz,x,ridge,z+dz,side,low,z-dz,x,ridge,z-dz,
               x,ridge,z-dz,side,low,z-dz,side,low,z+dz,x,ridge,z-dz,side,low,z+dz,x,ridge,z+dz],0x9c6250);
      for(let j=0;j<12;j++){
        const xx=x+s*(j+.4)*dx/12,h=ridge-(j+.4)*(ridge-low)/12;
        k.box(j%3===1?umber:brick,xx,h+.033,z,.14,.056,2*dz,0,0,-s*.58);
      }
      for(const d of sides)pipe(T,k,post,[x,ridge,z+d*dz],[side,low,z+d*dz],.135,4);
      for(const off of [-1,0,1])pipe(T,k,brown,[x,ridge-.17,z+off*1.08],[side,low-.17,z+off*1.08],.064,4);
      pipe(T,k,post,[x,6.43,front],[x+s*1.15,7.53,front],.061,4);
      pipe(T,k,post,[x+s*1.52,5.93,front],[x+s*2.07,6.83,front],.073,4);
    }
    k.box(post,x,6.42,front,4.1,.16,.19);k.box(post,x,7.28,front,.12,1.69,.17);
    k.place(x,front+.13,0,()=>{
      k.outline([[-.86,-.02],[-.83,-.29],[-.45,-.31],[-.12,-.25],[.21,-.35],[.60,-.26],[.82,-.15],[.75,.03],[.81,.18],[.48,.31],[.18,.29],[-.03,.37],[-.37,.26],[-.64,.28],[-.87,.15]],umber,0,5.92,-.06,.13);
      const m=new T.MeshStandardMaterial({map:texture(T,384,134,(g,w,h)=>{
        g.fillStyle='#e0b25e';g.font='italic bold 41px Georgia,serif';g.textAlign='center';g.fillText('Bảo Đại',w*.45,h*.42);
        g.font='italic bold 59px Georgia,serif';g.fillText('Villa',w*.61,h*.88);
      }),roughness:.9,transparent:true,alphaTest:.20});
      plate(T,k,m,[[-.69,5.65,.09],[.69,5.65,.09],[.69,6.17,.09],[-.69,6.17,.09]],[[0,0],[1,0],[1,1],[0,1]]);
    });
    // The wide concrete flight climbs laterally to the entrance landing.
    const stairStart=x-7.23,stairEnd=x-1.45,stairDepth=stairEnd-stairStart,n=17;
    for(let i=0;i<n;i++){
      const rise=.16+(level-.16)*(i+1)/n,xx=stairStart+stairDepth*(i+.5)/n;
      k.box(0xbfae91,xx,rise-.10,11.39,stairDepth/n+.015,.22,1.48);
      k.box(0xd1c8b1,xx,rise+.008,11.39,stairDepth/n+.021,.043,1.51);
    }
    for(const s of sides){
      const zz=11.39+s*.67;
      pipe(T,k,post,[stairStart,.20,zz],[stairEnd,level-.04,zz],.11,4);
      pipe(T,k,brown,[stairStart,.92,zz],[stairEnd,level+.87,zz],.066,6);
      for(let i=0;i<=11;i++){const t=i/11;const hh=.17+t*(level-.17);k.box(metal,stairStart+t*stairDepth,hh+.43,zz,.039,.85,.047);}
    }
    const bottom=15.07,top=front+.05;
    for(const s of sides){
      const xx=x+s*.69,profile=[],count=8,run=bottom-top;
      // Broad carved timbers have alternating flat treads and recessed
      // risers. Each one is a complete notched stair rather than a handrail.
      profile.push([bottom,.14]);
      for(let i=0;i<count;i++){
        const zz=bottom-run*i/count,hh=.16+level*(i+1)/count;
        profile.push([zz,hh],[zz-run/count,hh]);
      }
      profile.push([top-.35,3.98],[top-.52,3.96],[top-.30,2.67],[bottom-.05,.11]);
      k.outline(profile.map(([zz,hh])=>[-zz,hh]),wood,xx-.245,0,0,.49,Math.PI/2);
      for(let i=0;i<count;i++){
        const zz=bottom-run*(i+.50)/count,hh=.16+level*(i+1)/count;
        k.box(straw,xx,hh+.013,zz,.48,.041,run/count*.92);
        k.box(umber,xx,hh-.075,zz+run/count*.50+.006,.46,.098,.034);
      }
      const med=new T.SphereGeometry(1,8,6);k.stamp(med,umber,xx,3.52,13.04,.077,.093,.062);med.dispose();
    }
    for(let i=1;i<8;i++){const t=i/8;k.box(umber,x,.16+level*t,bottom-(bottom-top)*t,1.27,.055,.15);}
  }
  function clothMaterial(T){
    const map=texture(T,256,256,(g,w,h)=>{
      g.fillStyle='#bc7850';g.fillRect(0,0,w,h);g.fillStyle='#d8a167';g.fillRect(0,0,w,41);g.fillRect(0,215,w,41);
      g.strokeStyle='#98563b';g.lineWidth=3;
      for(const [cy,scale] of [[22,.64],[127,1],[233,.64]])for(let i=-1;i<=4;i++){
        const x=i*71+(cy%2)*.27;g.save();g.translate(x,cy);g.scale(scale,scale);
        for(let j=0;j<4;j++){g.rotate(Math.PI/2);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(4,-13,13,-21);g.quadraticCurveTo(19,-4,0,0);g.stroke();}g.restore();
      }
    });map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(2,2);
    return new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:.97});
  }
  function cornerRoom(T,k){
    // Only the photographed sitting corner is furnished. The walls with
    // glazing are openings in the main shell; the lake is the living world.
    const x0=3.28,x1=9.33,z0=4.85,z1=9.73,fl=level+.14;
    k.box(0x9b684c,(x0+x1)/2,fl-.055,(z0+z1)/2,x1-x0,.11,z1-z0);
    for(let i=0;i<19;i++)k.box(i%4===0?0x8d5940:0xa67150,x0+(i+.5)*(x1-x0)/19,fl+.013,(z0+z1)/2,(x1-x0)/19-.015,.028,z1-z0);
    k.box(ivory,(x0+x1)/2,4.67,z0,x1-x0,2.99,.13);k.box(ivory,x0,4.67,(z0+z1)/2,.13,2.99,z1-z0);
    k.box(0x9d7659,(x0+x1)/2,6.05,(z0+z1)/2,x1-x0,.15,z1-z0);
    for(const xx of [x0+1.30,x0+3.48,x0+5.66])k.box(brown,xx,5.93,(z0+z1)/2,.106,.19,z1-z0);
    const map=texture(T,128,256,(g,w,h)=>{
      g.fillStyle='#d6ae90';g.fillRect(0,0,w,h);
      for(let i=0;i<16;i++){g.fillStyle=i%2?'#c38271':'#e3b7a0';g.fillRect(i*8,0,4+(i%3),h);}
      g.fillStyle='#a96760';for(const y of [36,195])for(let i=0;i<11;i++){g.beginPath();g.ellipse(i*13,y+i%3*3.5,2.0,5.1,-.46,0,Math.PI*2);g.fill();}
    });
    const drape=new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:.95});
    function hang(x,z,width,a){
      k.place(x,z,a,()=>{
        for(let j=0;j<6;j++){
          const a0=j/6,a1=(j+1)/6,q0=(j%2)*.075,q1=((j+1)%2)*.075;
          plate(T,k,drape,[[(a0-.5)*width,3.29,q0],[(a1-.5)*width,3.29,q1],[(a1-.5)*width,5.32,q1],[(a0-.5)*width,5.32,q0]],[[a0,0],[a1,0],[a1,1],[a0,1]]);
        }
      });
    }
    hang(8.71,9.66,.81,0);hang(3.71,9.66,.59,0);hang(9.23,9.26,.67,Math.PI/2);hang(9.23,6.22,.55,Math.PI/2);
    const tx=7.24,tz=8.10;
    k.box(brown,tx,3.88,tz,1.49,.12,.86);for(const s of sides)for(const v of sides)k.box(brown,tx+s*.57,3.49,tz+v*.28,.079,.68,.079);
    const cloth=clothMaterial(T),wx=.86,wz=.51,yy=3.97;
    plate(T,k,cloth,[[tx-wx,yy,tz-wz],[tx-wx,yy,tz+wz],[tx+wx,yy,tz+wz],[tx+wx,yy,tz-wz]],[[0,0],[0,1],[1,1],[1,0]]);
    for(const s of sides){
      const z=tz+s*wz;plate(T,k,cloth,[[tx-wx,yy-.32,z+s*.035],[tx+wx,yy-.32,z+s*.035],[tx+wx,yy,z],[tx-wx,yy,z]],[[0,0],[1,0],[1,.4],[0,.4]]);
    }
    for(const [xx,zz,r,h] of [[-.30,.07,.145,.24],[.04,.018,.115,.135],[.31,-.053,.09,.32]]){
      const v=[new T.Vector2(.52*r,0),new T.Vector2(.95*r,.17*h),new T.Vector2(r,.53*h),new T.Vector2(.55*r,.80*h),new T.Vector2(.57*r,h)];
      const g=new T.LatheGeometry(v,15);k.stamp(g,0xb17e45,tx+xx,yy+.015,tz+zz);g.dispose();
      k.stamp(k.round,0x634a37,tx+xx,yy+h+.012,tz+zz,r*.46,.006,r*.46);
      if(xx<0){const handle=new T.TorusGeometry(r*.65,r*.15,5,12);k.stamp(handle,0xb17e45,tx+xx-r*.83,yy+h*.58,tz+zz);handle.dispose();}
    }
    for(const [xx,zz,w,a] of [[7.31,9.17,1.88,0],[5.98,7.85,.82,-Math.PI/2]]){
      k.place(xx,zz,a,()=>{
        for(const s of sides)for(const v of sides)k.box(brown,s*(w/2-.08),3.43,v*.29,.085,.51,.083);
        k.box(0xcfb998,0,3.63,0,w,.18,.71);k.box(0xd6c0a3,0,3.95,.31,w,.59,.14,0,-.11);
        for(const s of sides)k.box(brown,s*(w/2+.012),3.92,.02,.082,.09,.77);
      });
    }
  }
  function shell(T,k){
    const glass=new T.MeshPhongMaterial({color:0x95a8a1,specular:0xc4c7ac,shininess:66,transparent:true,opacity:.115,depthWrite:false,side:T.DoubleSide});
    k.box(grout,0,.16,0,18.92,.29,19.74);
    for(const y of [level,second])k.box(brown,0,y-.07,3.35,18.80,.15,13.0);
    k.box(0xc7b9a3,0,2.27,-9.37,17.52,4.35,.25);
    for(const s of sides)k.box(0x846a55,s*8.79,2.07,-7.84,.26,3.94,3.3);
    for(let i=0;i<6;i++)bayFront(T,k,glass,i);
    for(let i=0;i<=6;i++){const xx=(i-3)*W/3;k.stamp(k.round,post,xx,4.94,Z+.13,.202,9.71,.202);}
    for(const s of sides)flank(T,k,glass,s);
    k.box(ivory,0,4.52,2.53,18.39,2.91,.23);
    k.box(0xac9e8e,0,1.51,4.26,18.38,2.65,.22);
    k.box(pink,0,6.84,3.47,18.1,1.46,.24);
    roof(T,k);portico(T,k);cornerRoom(T,k);
    const profile=[new T.Vector2(.29,0),new T.Vector2(.41,.10),new T.Vector2(.49,.34),new T.Vector2(.51,.45),new T.Vector2(.46,.46)];
    const pot=new T.LatheGeometry(profile,14),leaf=new T.SphereGeometry(1,7,5);
    for(const [x,z,sz] of [[-.24,14.66,.84],[3.31,14.71,.88],[-4.92,11.93,1.05],[-8.52,10.49,.65],[8.15,10.33,.81],[3.70,12.41,.62]]){
      k.stamp(pot,0xa45d42,x,.16,z,sz,sz,sz);k.stamp(k.round,0x605744,x,.16+.40*sz,z,.45*sz,.036,.45*sz);
      const thin=x===-.24||x===3.31;
      for(let j=0;j<(thin?9:15);j++){const a=j*2.40,h=(thin?.38:.08)*sz;
        k.stamp(leaf,j%3===1?0x759245:0x617b40,x+Math.sin(a)*.18*sz,.16+sz*.57+h+j%4*.070,z+Math.cos(a)*.18*sz,.077*sz,(thin?.30:.23)*sz,.083*sz,a,thin?.40:.95);
      }
    }pot.dispose();leaf.dispose();
  }
  const apron=[[-15.1,-10.8],[-11.7,-14.5],[12.4,-14.3],[14.6,-10.6],[15.0,9.20],[13.6,16.65],[9.8,19.5],[4.1,20.8],[-6.9,20.2],[-12.6,17.15],[-16.5,10.2],[-16.0,3.3]];
  function paving(T,k,basis){
    const map=texture(T,320,320,(g,w,h)=>{
      // A seamless field of irregular flagstones, as on the summit apron.
      const n=8,cell=w/n,seeds=[],colors=[];
      for(let j=0;j<n;j++)for(let i=0;i<n;i++){
        const f=k=>{const u=Math.sin(i*47.86+j*197.13+k*14.37)*3391;return u-Math.floor(u);};
        seeds.push([(i+.15+.70*f(1))*cell,(j+.15+.69*f(2))*cell]);const v=Math.round(145+33*f(3));colors.push([v+5,v+2,v-12]);
      }
      const data=g.createImageData(w,h);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const ix=Math.floor(x/cell),iy=Math.floor(y/cell);let nearest=0,first=1e9,second=1e9;
        for(let j=iy-1;j<=iy+1;j++)for(let i=ix-1;i<=ix+1;i++){
          const n0=((j+n)%n)*n+((i+n)%n),pt=seeds[n0];
          const dx=pt[0]+Math.floor(i/n)*w-x,dy=pt[1]+Math.floor(j/n)*h-y,d=dx*dx+dy*dy;
          if(d<first){second=first;first=d;nearest=n0;}else if(d<second)second=d;
        }
        const dist=Math.sqrt(second)-Math.sqrt(first),grain=3*Math.sin(382*x+194*y);
        for(let c=0;c<3;c++)data.data[4*(y*w+x)+c]=(dist<1.4?colors[nearest][c]*.60:colors[nearest][c])+grain;
        data.data[4*(y*w+x)+3]=255;
      }g.putImageData(data,0,0);
    });map.wrapS=map.wrapT=T.RepeatWrapping;
    const meshData=[],uv=[],idx=[],edge=[],ring=[];
    for(let i=0;i<apron.length;i++){
      const [ax,az]=apron[i],[bx,bz]=apron[(i+1)%apron.length],n=Math.ceil(Math.hypot(bx-ax,bz-az)/1.60);
      for(let j=0;j<n;j++)edge.push([ax+(bx-ax)*j/n,az+(bz-az)*j/n]);
    }
    const count=edge.length,levels=10;
    meshData.push(0,0,0);uv.push(0,0);
    for(let j=1;j<=levels;j++)for(let i=0;i<count;i++){
      const [xx,zz]=edge[i],x=xx*j/levels,z=zz*j/levels,n=1+(j-1)*count+i,next=1+(j-1)*count+(i+1)%count;
      meshData.push(x,0,z);uv.push(x/3.50,z/3.50);
      if(j===1)idx.push(0,next,n);else idx.push(n-count,next,n,next-count,next,n-count);
    }
    const top=new T.BufferGeometry();top.setAttribute('position',new T.Float32BufferAttribute(meshData,3));top.setAttribute('uv',new T.Float32BufferAttribute(uv,2));top.setIndex(idx);
    const mesh=new T.Mesh(top,new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:.98}));mesh.receiveShadow=true;k.group.add(mesh);
    for(let i=0;i<count;i++){
      const a=edge[i],b=edge[(i+1)%count];ring.push([...a,1],[...b,1],[...a,0],[...b,1],[...b,0],[...a,0]);
    }
    const skirt=new T.BufferGeometry();skirt.setAttribute('position',new T.BufferAttribute(new Float32Array(ring.length*3),3));
    const m=new T.Mesh(skirt,new T.MeshStandardMaterial({color:0x867e68,side:T.DoubleSide,roughness:.94}));m.receiveShadow=true;k.group.add(m);
    const verge=new T.BufferGeometry(),strip=[],colors=[];
    for(let i=0;i<count;i++){
      const a=edge[i],b=edge[(i+1)%count],shade=(i%4)*.002;
      for(const [v,t] of [[a,0],[b,0],[a,1],[b,0],[b,1],[a,1]]){
        const r=Math.hypot(v[0],v[1]);strip.push([v[0]+v[0]/r*t*4,v[1]+v[1]/r*t*4,t]);
        const color=new T.Color(t?0x3e513a:0x536943);colors.push(color.r+shade,color.g+shade,color.b);
      }
    }
    verge.setAttribute('position',new T.BufferAttribute(new Float32Array(strip.length*3),3));verge.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    const bank=new T.Mesh(verge,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:1}));bank.receiveShadow=true;k.group.add(bank);
    return ground=>{
      const pos=top.attributes.position,wall=skirt.attributes.position;
      function levelAt(x,z){const fringe=Math.min(1,Math.max(0,(Math.max((Math.abs(x)-10.30)/6,(z-14.60)/6,(-z-10.3)/4))));return basis.height+.12+fringe*Math.max(-1.1,Math.min(.30,ground(x,z)-basis.height));}
      for(let i=0;i<pos.count;i++)pos.setY(i,levelAt(pos.getX(i),pos.getZ(i)));
      for(let i=0;i<ring.length;i++){const [x,z,h]=ring[i],topY=levelAt(x,z);wall.setXYZ(i,x,h?topY:Math.min(topY-.12,ground(x,z)-.27),z);}
      for(let i=0;i<strip.length;i++){const [x,z,t]=strip[i];verge.attributes.position.setXYZ(i,x,t?ground(x,z)-.09:Math.max(ground(x,z),levelAt(x,z)-.28),z);}
      for(const geo of [top,skirt,verge]){geo.attributes.position.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();}
    };
  }
  function build(T,k){
    k.palette({plaster:[pink,ivory],timber:[timber,wood,post,brown,umber,straw],stone:[stone,grout],tile:[brick]});
    const f=createTempleFoundations(T,k);
    const foundation=f.building(0,0,0,18.92,19.74,()=>shell(T,k));
    for(const [x,z,h,width,kind] of [[-17.6,11.7,8.2,5.3,'banyan'],[-16.2,-5.4,5.5,3.6,'palm'],[-12.7,-16.0,5.7,3.5,'palm'],[-9.9,-16.3,5.8,3.1,'palm'],
      [12.7,18.9,6.8,5.4,'banyan'],[15.6,10.5,6.25,4.23,'banyan'],[17.5,-6.6,7.9,5.4,'banyan'],[10.5,-16.0,6.4,4.5,'banyan'],[-19.8,13.35,10.3,6.6,'banyan'],[-20.8,-14.7,9.2,6.3,'banyan'],
      [17.6,20.0,7.8,5.1,'banyan'],[16.2,-17.8,9.2,6.1,'banyan'],[-8.6,-21.0,8.8,6.2,'banyan'],[4.9,-20.4,8.0,4.5,'banyan']]){
      let parts=[];
      f.fixture(g=>g(x,z),()=>{parts=k.place(x,z,0,()=>window.CentralArch.trees(T,k,[{x:0,z:0,h,width,kind}]));},y=>{for(const m of parts)m.position.y=y;});
    }
    const fit=k.group.userData.fitGround,fitApron=paving(T,k,foundation);
    k.group.userData.fitGround=ground=>{fit(ground);fitApron(ground);};
  }
  function shot(name,x,z,height,viewRadius,angle,viewElevation){
    return {name,offset:[x*cs+z*sn,-x*sn+z*cs],height,viewRadius,viewAngle:yaw+angle,viewElevation,viewBase:'monument'};
  }
  const sites=window.VietnamSights??=[];
  sites.push({...pin,id,catalogId,name:'Biệt điện Bảo Đại bên hồ Lắk',kind:'Biệt điện',province:'Đắk Lắk',city:'Liên Sơn',
    lon:108.176927,lat:12.414525,start:[108.1783988,12.4129976],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    yaw,width:20.35,depth:26.15,source,photo,map:'https://www.openstreetmap.org/way/52823719',
    description:'Trên đỉnh đồi ven hồ, mái ngói dốc liền một phía từ khối ba tầng nhiều cửa kính xuống dãy nhà thấp ở sau. Cầu thang bê tông chạy ngang mặt nhà. Hai thang gỗ đục bậc hướng thẳng ra sân đá. Các phòng ở góc mở cửa kính sang cả hai phía để nhìn xuống hồ.',
    arrivalNote:'Xe dừng tại ngã rẽ từ đường Âu Cơ vào đường Nguyễn Huệ. Theo đường vòng sườn đồi lên sân biệt điện.',
    boundary:apron,reserve:(x,z,r)=>x>-16.5-r&&x<15.0+r&&z>-14.6-r&&z<20.9+r,solids:[[0,0,W,Z]],
    views:[shot('Mặt kính ba tầng và đôi thang gỗ',.49,8.04,11.85,21.7,.23,.105),
      shot('Mái dốc trải từ sảnh cao về khối nhà thấp',1.05,-.80,13.20,30.5,1.37,.34),
      {...shot('Nhìn ra hồ từ hai ô kính phòng góc',10.8,13.26,14.08,8.58,-2.56,.035),viewFov:70}],build});
})();

export default window.VietnamSights;
