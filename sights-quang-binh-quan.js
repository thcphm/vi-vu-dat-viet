'use strict';
(()=>{
  const id='quang-binh-quan',catalogId='osm-node-8706712863';
  const atlas=window.VietnamTourism,raw=atlas?.byId?.get(catalogId)??atlas?.entries?.find(s=>s.id===catalogId);
  const lon=106.6240516,lat=17.4633364,yaw=-1.230,pi=Math.PI;
  const source='https://baoquangtri.vn/dat-va-nguoi-quang-binh/201912/quang-binh-quan-cong-trinh-van-hoa-lich-su-tieu-bieu-2172445/';
  const commons='https://commons.wikimedia.org/wiki/File:';
  const frontPhoto=commons+'Qu%E1%BA%A3ng_B%C3%ACnh_quan,_%C4%90%E1%BB%93ng_H%E1%BB%9Bi,_Qu%E1%BA%A3ng_B%C3%ACnh.jpeg';
  // w940004472 measures ~31.4 by 13.7 m. The southwest facade faces the
  // small garden opening onto Lê Lợi; the opposite side overlooks Quang
  // Trung. The nineteenth-century citadel walls and sign are farther north.
  const island=[[-32.5,-4.2],[-31.3,-.1],[-6.2,25],[-2,28.4],[3,28.9],[7.4,26.8],
    [33.8,1.1],[36.3,-1.7],[36.3,-4.2],[33.7,-6.1],[-26.5,-8.7],[-30.9,-7.3]];
  const heights=[5.62,5.49,7.47];
  function view(name,x,z,ex,ez,h,up,fov,photo,photoCatalogId){
    const c=Math.cos(yaw),s=Math.sin(yaw);
    return {name,offset:[c*x+s*z,-s*x+c*z],viewAngle:yaw+Math.atan2(ex-x,ez-z),
      height:h/.46,viewRadius:Math.hypot(ex-x,ez-z,up),viewElevation:Math.atan2(up,Math.hypot(ex-x,ez-z)),
      viewBase:'monument',viewFov:fov,photo,...(photoCatalogId?{photoCatalogId}:{})};
  }
  const views=[view('Vòm gạch nhìn từ phía đường Lê Lợi',0,1,-3.2,35.1,heights[0],-2.35,53,frontPhoto),
    view('Bậc lên gác phía đường Quang Trung',0,-.55,5.7,-23.8,heights[1],-2.25,64,commons+'QuangBinhGate.jpg','quang-binh-quan-mat-quang-trung'),
    view('Hai tầng mái nhìn từ vườn phía tây',-.20,.36,-10.4,15.9,heights[2],-4.85,52,commons+'Qu%E1%BA%A3ng_B%C3%ACnh_quan.jpg','quang-binh-quan-vuon-le-loi')];
  const brick=0x9f5e47,archBrick=0x946249,earth=0x806654,wall=0xa29a85,mould=0xa89d83,
    dark=0x756f60,pale=0xc2b39a,tower=0xd1ad65,ochre=0xb79863,roof=0xaf8a56,ridge=0x6f6554;
  function ribbon(T,k,tint,points,r){
    const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));
    const g=new T.TubeGeometry(curve,Math.max(6,points.length*2),r,7);k.stamp(g,tint,0,0,0);g.dispose();
  }
  function outline(T,k,poly,tint,z,d){
    const shape=new T.Shape(poly.map(([x,y])=>new T.Vector2(x,y)));
    k.profile(shape,tint,0,0,z,d);
  }
  function apron(T,k,poly,tint,y,thick){
    const shape=new T.Shape(poly.map(([x,z])=>new T.Vector2(x,-z)));
    const g=new T.ExtrudeGeometry(shape,{depth:thick,bevelEnabled:false});
    g.rotateX(-pi/2);k.stamp(g,tint,0,y-thick,0);g.dispose();
  }
  function breakArch(T,k){
    const front=4.72,rear=-3.94,half=4.20,spring=2.83,r=1.80,cap=6.51;
    const body=new T.Shape();body.moveTo(-half,-.55);body.lineTo(-r,-.55);body.lineTo(-r,spring);
    body.absarc(0,spring,r,pi,0,true);body.lineTo(r,-.55);body.lineTo(half,-.55);
    body.lineTo(half,cap);body.lineTo(-half,cap);body.closePath();
    k.profile(body,brick,0,0,rear,front-rear);
    for(const [face,z] of [[1,front],[-1,rear]]){
      const depth=.19,out=z+(face>0?.006:-depth);
      const thickness=face===1?.246:.31;
      for(let i=0;i<31;i++){
        const a=i*pi/31,b=(i+1)*pi/31-.005;
        const point=(ang,rad)=>[Math.cos(ang)*rad,spring+Math.sin(ang)*rad];
        outline(T,k,[point(a,r),point(a,r+thickness),point(b,r+thickness),point(b,r)],i%4?archBrick:earth,out,depth);
      }
      for(const side of [-1,1])k.box(archBrick,side*(r+thickness*.5),spring*.47,out+depth*.5,thickness,spring*1.06,depth);
    }
    // The Lê Lợi side has tall brick piers and a horizontal, stepped band.
    // The Quang Trung side has low outer piers and a shallow bowed parapet.
    for(const s of [-1,1]){
      k.box(brick,s*3.92,3.13,front+.035,.75,7.14,.55);
      k.box(archBrick,s*3.91,3.30,front+.331,.52,5.62,.049);
      k.box(brick,s*3.91,3.34,front+.363,.36,5.56,.028);
      k.box(archBrick,s*3.90,.20,front+.18,.82,.39,.59);
      k.box(brick,s*3.92,5.98,front+.17,.89,.24,.61);
      k.box(archBrick,s*3.92,6.27,front+.18,1.04,.25,.62);
      k.box(dark,s*3.92,6.53,front+.16,1.17,.23,.79);
      k.box(ochre,s*3.92,6.65,front+.17,1.23,.10,.87);
      k.box(brick,s*3.63,2.30,rear-.10,.62,5.37,.52);
      k.box(mould,s*3.63,4.78,rear-.18,.97,.27,.67);
    }
    k.box(mould,0,6.13,front+.055,7.34,.25,.31);
    k.box(archBrick,0,5.97,front+.083,7.32,.08,.39);
    k.box(dark,0,6.37,front+.052,8.55,.16,.42);
    k.box(wall,0,6.84,front+.035,8.31,.86,.43);
    k.box(pale,0,7.26,front+.055,8.59,.17,.55);
    k.box(dark,0,7.36,front+.057,8.72,.10,.64);
    k.box(mould,0,6.54,front+.321,2.43,.44,.052);
    k.box(0x898270,0,6.54,front+.354,2.14,.29,.026);
    for(const side of [-1,1]){
      ribbon(T,k,mould,[[side*1.17,6.35,front+.33],[side*1.26,6.37,front+.33],
        [side*1.42,6.50,front+.33],[side*1.55,6.45,front+.33]],.058);
    }
    const parapet=new T.Shape();parapet.moveTo(-4.18,6.30);parapet.lineTo(4.18,6.30);
    parapet.lineTo(4.18,6.88);parapet.quadraticCurveTo(0,7.39,-4.18,6.88);parapet.closePath();
    k.profile(parapet,wall,0,0,rear-.27,.39);
    ribbon(T,k,mould,[[-4.2,6.92,rear-.24],[-2.1,7.11,rear-.24],[0,7.17,rear-.24],[2.1,7.11,rear-.24],[4.2,6.92,rear-.24]],.095);
    for(const s of [-1,1]){
      k.box(wall,s*4.04,6.78,.29,.32,.60,8.41);
      k.box(mould,s*4.04,7.106,.29,.43,.102,8.48);
    }
    k.box(0xb1a187,0,6.528,.22,7.75,.055,7.66);
    for(const z of [front,rear])for(const x of [-4.01,4.01]){
      k.box(wall,x,7.15,z,.46,.91,.47);k.box(dark,x,7.55,z,.63,.12,.65);
      k.tapered(dark,x,7.69,z,.42,.19,.22,1,4);
    }
  }
  function wings(T,k){
    for(const sign of [-1,1]){
      const poly=coords=>coords.map(([x,y])=>[sign*x,y]);
      // West: lime-plastered screen with a molded scroll where it rises to
      // the brick doorway. East: open stair along each flank to the terrace.
      const w=new T.Shape();w.moveTo(sign*4.13,-.48);w.lineTo(sign*15.64,-.48);
      w.lineTo(sign*15.64,3.83);w.lineTo(sign*7.08,3.83);w.quadraticCurveTo(sign*6.06,5.45,sign*4.13,5.72);w.closePath();
      k.profile(w,wall,0,0,2.09,.61);
      k.box(dark,sign*11.3,.19,2.40,8.47,.39,.70);
      k.box(mould,sign*11.35,3.855,2.40,8.62,.105,.75);
      ribbon(T,k,mould,[[sign*7.12,3.88,2.44],[sign*6.66,4.60,2.44],[sign*5.72,5.29,2.44],[sign*4.12,5.76,2.44]],.075);
      const spiral=[];for(let i=0;i<=24;i++){
        const t=i/24,a=t*1.68*pi,rad=.39*(1-t)+.063;
        spiral.push([sign*(5.42+Math.sin(a)*rad),4.73+Math.cos(a)*rad,2.732]);
      }
      ribbon(T,k,pale,spiral,.050);
      // Behind the tall screen the upper face is visibly inclined. A flat
      // landing separates the east entry to the steps from the upper run.
      const core=poly([[4.12,-.48],[15.55,-.48],[15.55,2.04],[13.4,2.04],[4.12,6.46]]);
      outline(T,k,core,wall,-2.18,4.31);
      outline(T,k,poly([[4.13,6.17],[13.59,1.72],[13.59,1.88],[4.13,6.36]]),mould,-2.21,.14);
      const start=14.88,end=4.05,count=26,walkZ=-3.32;
      for(let i=0;i<count;i++){
        const width=(start-end)/count,top=2.05+(i+1)*4.43/count,x=sign*(start-(i+.5)*width);
        k.box(i%4?0x9a8f78:0xa3947f,x,top*.5-.04,walkZ,width+.012,top+.08,2.28);
      }
      k.box(wall,sign*15.00,1.02,-3.32,1.42,2.05,2.29);
      for(let i=0;i<10;i++){
        const top=2.05-i*.194;
        k.box(i%3?0x9a8f78:dark,sign*14.55,top*.5,-4.54-i*.259,2.09,top,.28);
      }
      // Low returned wall and capped posts as seen in the Quang Trung photo.
      k.box(wall,sign*9.34,1.10,-4.64,8.39,2.50,.36);
      k.box(mould,sign*9.34,2.37,-4.64,8.51,.14,.46);
      for(const xx of [5.16,13.46,15.65]){
        const h=xx===5.16?3.06:2.63,zz=xx===15.65?-3.53:-4.64;
        k.box(xx===5.16?brick:wall,sign*xx,h*.5-.05,zz,.58,h+.10,.66);
        k.box(mould,sign*xx,h+.06,zz,.71,.16,.81);
        k.tapered(dark,sign*xx,h+.20,zz,.48,.19,.20,1,4);
      }
    }
  }
  function roofTier(T,k,y,w,d,rise){
    const corners=[[-1,-1],[-1,1],[1,1],[1,-1]],faces=[],soffits=[];
    function xyz(side,t,v){
      const a=corners[side],b=corners[(side+1)%4],x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;
      const c=Math.min(Math.abs(x),Math.abs(z));
      return [x*(w*.5*(1-v)+.33*v),y+rise*(.43*v+.57*v*v)+.38*c**4*(1-v),z*(d*.5*(1-v)+.27*v)];
    }
    function quad(list,a,b,c,d){list.push(...a,...d,...b,...b,...d,...c);}
    for(let s=0;s<4;s++){
      for(let i=0;i<16;i++){
        const t=i/16,t2=(i+1)/16,a=xyz(s,t,0),b=xyz(s,t2,0),down=p=>[p[0],p[1]-.10,p[2]];
        quad(soffits,down(a),down(b),b,a);
        quad(soffits,down(b),down(a),[a[0]*.62,y-.10,a[2]*.62],[b[0]*.62,y-.10,b[2]*.62]);
        for(let j=0;j<4;j++)quad(faces,xyz(s,t,j/4),xyz(s,t,(j+1)/4),xyz(s,t2,(j+1)/4),xyz(s,t2,j/4));
        const row=[];for(let j=0;j<5;j++){const p=xyz(s,t,j/4);p[1]+=.023;row.push(p);}
        ribbon(T,k,i%3?0x9b805a:ochre,row,.040);
      }
      const tip=xyz(s,0,0),sx=Math.sign(tip[0]),sz=Math.sign(tip[2]);
      ribbon(T,k,ridge,[[tip[0]*.70,tip[1]-.22,tip[2]*.70],tip,[tip[0]+sx*.10,tip[1]+.18,tip[2]+sz*.10],
        [tip[0]+sx*.11,tip[1]+.38,tip[2]+sz*.12]],.075);
      const hip=[];for(let j=0;j<6;j++){const p=xyz(s,0,j/5);p[1]+=.07;hip.push(p);}ribbon(T,k,ridge,hip,.070);
    }
    for(const [list,tint] of [[faces,roof],[soffits,ridge]]){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(list,3));g.computeVertexNormals();
      k.stamp(g,tint,0,0,0);g.dispose();
    }
  }
  function upperRoom(T,k){
    const base=6.57,top=9.52,w=3.07,d=3.12,lip=.19;
    k.box(ochre,0,base+.15,0,w+.17,.30,d+.15);
    for(const side of [-1,1]){
      k.box(tower,side*(w-lip)*.5,(base+top)*.5,0,lip,top-base,d);
      k.box(ochre,side*(w*.5+.018),top-.18,0,.10,.19,d+.09);
    }
    const front=new T.Shape();front.moveTo(-w/2,base);front.lineTo(-.48,base);front.lineTo(-.48,7.98);
    front.absarc(0,7.98,.48,pi,0,true);front.lineTo(.48,base);front.lineTo(w/2,base);
    front.lineTo(w/2,top);front.lineTo(-w/2,top);front.closePath();
    k.profile(front,tower,0,0,d/2-lip,lip);
    const back=new T.Shape();back.moveTo(-w/2,base);back.lineTo(w/2,base);back.lineTo(w/2,top);back.lineTo(-w/2,top);back.closePath();
    const hole=new T.Path();hole.absarc(0,8.11,.424,0,2*pi,true);back.holes.push(hole);
    k.profile(back,tower,0,0,-d/2,lip);
    k.box(0x746b54,0,8.09,-.65,2.83,2.47,.13);
    const ring=new T.TorusGeometry(.43,.062,7,30);k.stamp(ring,ochre,0,8.11,-d*.5-.035);ring.dispose();
    for(let i=0;i<8;i++){
      const a=i*pi/4;k.box(ochre,.21*Math.sin(a),8.11+.21*Math.cos(a),-d*.5-.03,.06,.39,.065,0,0,-a);
    }
    k.box(ochre,0,top-.075,0,w+.13,.16,d+.13);
    roofTier(T,k,9.66,4.02,4.11,.81);
    k.box(ochre,0,10.97,0,2.12,1.29,2.13);
    for(const side of [-1,1]){
      for(let i=-1;i<=1;i++){
        const x=i*.41;k.box(dark,x,10.98,side*1.078,.28,.76,.043);
        for(let j=-1;j<=1;j++)k.box(mould,x+j*.074,10.97,side*1.103,.029,.70,.022);
      }
      k.box(mould,side*1.077,10.98,0,.043,.80,1.17);
      for(let j=-2;j<=2;j++)k.box(dark,side*1.107,10.98,j*.17,.023,.67,.080);
    }
    k.box(mould,0,11.59,0,2.26,.15,2.27);roofTier(T,k,11.73,3.06,3.09,.76);
    k.tapered(ridge,0,12.62,0,.21,.12,.25,1,8);
    k.tapered(ridge,0,12.90,0,.08,.016,.40,1,8);
  }
  function gardens(T,k){
    // World Imagery resolves the three corners of the pedestrian island,
    // its axial paving and the large southern tree. Individual plantings
    // change between the 2009, 2016 and 2024 Commons photographs.
    apron(T,k,island,0xb2917b,.08,.58);
    const north=[[-28.7,-2.7],[-25.7,-5.2],[-16.5,-5.7],[-16.2,2.9],[-3.01,3.19],[-2.37,24.6],[-4.34,24.0],[-15.2,13.1]];
    const south=[[2.65,3.25],[15.95,3.12],[16.12,-4.22],[30.5,-3.85],[32.4,-2.23],[31.2,-.49],[7.8,23.1],[3.36,25.2]];
    for(const poly of [north,south]){
      apron(T,k,poly,0x817961,.158,.18);
      const x=poly.reduce((sum,p)=>sum+p[0],0)/poly.length,z=poly.reduce((sum,p)=>sum+p[1],0)/poly.length;
      apron(T,k,poly.map(([u,v])=>[x+(u-x)*.976,z+(v-z)*.977]),0x7e8c52,.178,.22);
    }
    k.box(0xad9d8c,0,.117,13.02,3.56,.13,28.62);
    const low=new T.IcosahedronGeometry(1,1);
    for(const [x,z,w,d] of [[-7.5,6.34,6.25,1.0],[-4.10,12.1,1.02,8.5],[5.0,14.6,2.52,3.82],[6.11,6.17,4.18,1.01],[-12.69,9.09,3.15,1.41]]){
      k.stamp(low,0x6d7548,x,.319,z,w*.62,.245,d*.62);
      for(let i=0;i<13;i++){
        const t=2*pi*i/13,xx=x+.50*w*Math.cos(t),zz=z+.50*d*Math.sin(t);
        k.stamp(low,i%3?0x597740:0x718246,xx,.405,zz,.41,.24,.41,i*.81);
      }
      k.stamp(low,0x729147,x,.43,z,w*.5,.34,d*.5);
    }
    low.dispose();
    for(const [x,z] of [[-9.34,7.67],[12.1,4.51]]){
      k.tapered(0x42514a,x,.34,z,.198,.136,.54,1,8);
      k.tapered(0x3e4b44,x,1.91,z,.075,.053,2.81,1,9);
      k.tapered(dark,x,3.46,z,.085,.22,.32,1,6);k.tapered(0xc0bba3,x,3.71,z,.23,.164,.35,1,6);
      k.tapered(0x3d4944,x,3.95,z,.256,.047,.16,1,6);
      k.tapered(dark,x,4.09,z,.050,.012,.18,1,7);
    }
    window.CentralArch.trees(T,k,[{x:10.3,z:4.13,y:.12,h:10.2,width:9.85,kind:'banyan'},
      {x:12.65,z:4.90,y:.12,h:9.48,width:8.30,kind:'banyan'},
      {x:16.4,z:3.62,y:.12,h:7.44,width:6.23,kind:'banyan'}]);
  }
  function weatheredFacades(mesh){
    const m=mesh.material,prev=m.onBeforeCompile,key=m.customProgramCacheKey();
    m.customProgramCacheKey=()=>key+'-quang-binh-quan-facades';
    m.onBeforeCompile=function(shader,...args){
      prev.call(this,shader,...args);
      shader.vertexShader='varying vec3 gateP;varying vec3 gateN;\n'+shader.vertexShader.replace(
        '#include <begin_vertex>','#include <begin_vertex>\n gateP=position;gateN=normal;');
      shader.fragmentShader=`varying vec3 gateP;varying vec3 gateN;
        float gateHash(vec2 x){return fract(sin(dot(x,vec2(15.88,74.24)))*43637.153);}
        float gateNoise(vec2 x){vec2 i=floor(x),u=fract(x);u=u*u*(3.-2.*u);
          return mix(mix(gateHash(i),gateHash(i+vec2(1,0)),u.x),mix(gateHash(i+vec2(0,1)),gateHash(i+1.),u.x),u.y);}
      `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        if(abs(gateN.y)<.85&&(abs(surfaceKind-1.)<.3||abs(surfaceKind-7.)<.3)){
          vec2 uv=vec2(abs(gateN.x)>abs(gateN.z)?gateP.z:gateP.x,gateP.y);
          float marks=.51*gateNoise(uv*.53)+.29*gateNoise(uv*2.2)+.20*gateNoise(uv*7.4);
          float runoff=gateNoise(uv*vec2(4.4,.45));float specks=gateNoise(uv*25.);
          if(surfaceKind<1.5){
            float exposed=smoothstep(.43,.70,marks*.8+runoff*.23);
            diffuseColor.rgb*=.82+.42*marks;
            diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.18,.15,.115),exposed*.57);
            diffuseColor.rgb+=vec3(.22,.20,.15)*smoothstep(.63,.77,marks*.73+specks*.34);
          }else diffuseColor.rgb*=.76+.41*marks+.16*runoff;
        }
      `);
    };
    m.needsUpdate=true;
  }
  function build(T,k){
    k.palette({plaster:[wall,mould,pale,tower,ochre],brick:[brick,archBrick,earth],stone:[dark,0x9a8f78,0xa3947f],tile:roof});
    const groundFirst=k.vertexCount();gardens(T,k);const groundEnd=k.vertexCount();
    breakArch(T,k);wings(T,k);upperRoom(T,k);
    let merged,rest,children,childHeights;
    k.group.userData.fitGround=ground=>{
      if(!merged){
        merged=k.group.children.find(o=>o.geometry?.hasAttribute('finishKind'));if(!merged)return;
        weatheredFacades(merged);
        children=k.group.children.filter(o=>o!==merged);childHeights=children.map(o=>o.position.y);
      }
      const g=merged.geometry,p=g.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      const level=Math.max(ground(-12,-3),ground(12,-3),ground(-10,4),ground(10,4),ground(0,0))+.15;
      const blend=(x,z)=>{
        const t=Math.min(1,Math.max(0,Math.max((Math.abs(x)-15.2)/9,(z-5.0)/13,(-z-6.8)/4)));
        return level*(1-t)+(ground(x,z)+.24)*t;
      };
      for(let i=0;i<p.count;i++)p.setY(i,rest[i]+(i>=groundFirst&&i<groundEnd?blend(p.getX(i),p.getZ(i)):level));
      children.forEach((o,i)=>o.position.y=childHeights[i]+blend(o.position.x,o.position.z));
      heights.forEach((h,i)=>views[i].height=(level+h)/.46);
      p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  function reserve(x,z,pad=0){
    let inside=false;
    for(let i=0,j=island.length-1;i<island.length;j=i++){
      const [ax,az]=island[j],[bx,bz]=island[i];
      if((az>z)!==(bz>z)&&x<ax+(bx-ax)*(z-az)/(bz-az))inside=!inside;
      const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
      if((x-ax-dx*t)**2+(z-az-dz*t)**2<pad*pad)return true;
    }
    return inside;
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,lon,lat,yaw,name:'Quảng Bình Quan',kind:'Di tích lịch sử',
    city:'Đồng Hới',province:'Quảng Trị',formerProvince:'Quảng Bình',region:'Trung Bộ',start:[106.6246407,17.4632662],visitOnArrival:true,mappedEntrance:true,
    width:32,depth:14,modeledBuildings:['w940004472'],gardenRadius:1,boundary:island,reserve,
    solids:[[-10,0,5.7,2.48],[10,0,5.7,2.48],[-3.11,.37,1.25,4.46],[3.11,.37,1.25,4.46]],
    source,photo:frontPhoto,map:'https://www.openstreetmap.org/way/940004472',
    description:'Quảng Bình Quan là cửa của hệ thống Lũy Thầy trên đường thiên lý. Cổng phục dựng đứng giữa đường Lê Lợi và đường Quang Trung. Qua một vòm gạch là sân phía bậc thang dẫn lên gác hai tầng mái. Dấu chân cổng theo bản đồ, chiều cao và hoa văn được ước dựng theo ảnh thực địa.',
    arrivalNote:'Xe dừng trên phố Mẹ Suốt cạnh công viên đối diện. Vòm gạch phía vườn quay về đường Lê Lợi.',
    views,build});
})();
