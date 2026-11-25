const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const karst=window.VietnamKarst,A=window.CentralArch,atlas=window.VietnamTourism;
  const id='chua-giai-oan-huong-son',catalogId='osm-node-2835735216';
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  const source='https://chuahuong.org.vn/chua-giai-oan/',yaw=-1.49,c=Math.cos(yaw),s=Math.sin(yaw);
  const ochre=0xd99945,gold=0xe8b450,red=0x99482e,wood=0x533629,clay=0xa76849;
  const pale=0xb1b2a5,stone=0x93948b,iron=0x554e42;
  // Tùng Lâm Hương Tích's courtyard photograph and the frontal detail show the
  // same three arched bays, the four-character panel and the stepped two-level
  // front. The canopy obscures the roof on aerial imagery. The frame is
  // inferred from the long upper return of OSM footway w279360041 and the
  // valley to its west. Dimensions here are photographic estimates in metres.
  // https://chuahuong.org.vn/wp-content/uploads/2021/05/chua-huong-2018jpg_Page119_Image2.jpg
  // https://www.kynghidongduong.vn/userfiles/images/Vietnam/Chua%20Huong/chua-giai-oan-chua-huong-dong-huong-tich-tour-du-lich-tam-linh-kynghidongduong.vn.jpg
  // The upper return of the footway runs 10 m east of the OSM place pin.
  // Keep the visitor pin fixed and put the walkable strip of court on the path.
  const shift=-11.2;
  const world=(x,z)=>[c*x+s*(z+shift),-s*x+c*(z+shift)];
  function lipRoof(T,k,x,y,z,width,depth){
    // The roof appears as a narrow, swept cap when viewed from the court.
    const g=new T.BufferGeometry(),pos=[];
    const at=(u,v)=>{
      const end=Math.abs(2*u-1)**5,edge=Math.abs(2*v-1);
      return [x+(u-.5)*width,y+.44*(1-edge)+.42*end*edge,z+(v-.5)*depth];
    };
    const quad=(a,b,c,d)=>pos.push(...a,...d,...b,...b,...d,...c);
    for(let i=0;i<28;i++)for(let j=0;j<2;j++){
      const a=at(i/28,j/2),b=at((i+1)/28,j/2),c=at((i+1)/28,(j+1)/2),d=at(i/28,(j+1)/2);
      quad(a,b,c,d);
      if(j===1)quad(d,c,[c[0],c[1]-.14,c[2]],[d[0],d[1]-.14,d[2]]);
    }
    g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();k.stamp(g,0x696d5d,0,0,0);g.dispose();
    const ball=new T.SphereGeometry(1,8,6);
    for(let i=0;i<Math.ceil(width/.16);i++){
      const xx=(i+.5)/Math.ceil(width/.16),[px,py,pz]=at(xx,1);
      k.stamp(ball,0x797d6b,px,py-.07,pz+.04,.073,.082,.102);
    }
    ball.dispose();
    for(const side of [-1,1]){
      const start=x+side*width/2;
      k.outline([[-.56,0],[-.27,.12],[-.34,.36],[-.13,.25],[.01,.33],[-.07,.55],[.12,.47],[.27,.62],[.23,.32],[.32,.45],[.25,.11],[.10,-.05],[-.22,-.09]],
        0x858775,start,y+.31,z+depth*.5,.11,side===1?0:Math.PI);
    }
  }
  function front(T,k){
    k.palette({plaster:[ochre,gold,red],timber:wood,stone:[stone,pale],tile:clay,metal:iron});
    const floor=.77,wallTop=3.98,mid=5.63;
    k.box(ochre,0,floor+1.67,-2.99,10.83,3.34,.35);
    for(const side of [-1,1])k.box(ochre,side*5.27,floor+1.54,-1.61,.29,3.08,3.0);
    k.box(0x443b2f,0,2.75,-2.64,10.44,3.99,.18);
    k.box(0x705d49,0,3.73,-1.47,10.55,.21,2.72);
    // Recess each door behind a real arch; the carved double doors close the
    // middle bay, while the two side openings remain dark beneath the fanlights.
    for(const [x,w,door] of [[-3.73,3.33,1.77],[0,4.13,2.14],[3.73,3.33,1.77]]){
      const r=door/2,spring=1.81,sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(-r,0);sh.lineTo(-r,spring);
      sh.quadraticCurveTo(-r,spring+.36,0,spring+.57);sh.quadraticCurveTo(r,spring+.36,r,spring);
      sh.lineTo(r,0);sh.lineTo(w/2,0);sh.lineTo(w/2,wallTop-floor);sh.lineTo(-w/2,wallTop-floor);sh.closePath();
      k.profile(sh,ochre,x,floor,-.24,.45);
      k.box(wood,x,floor+spring-.01,-.04,door+.01,.11,.18);
      if(x!==0)k.box(0x34332e,x,floor+1.23,-.72,door+.29,2.47,.14);
      for(const side of [-1,1])k.box(wood,x+side*(r-.045),floor+.88,-.04,.083,1.79,.17);
      for(let j=-2;j<=2;j++){
        const xx=j*r*.30,h=.46*(1-(xx/r)**2);
        A.strut(T,k,wood,x+xx*.3,floor+spring+.02,-.035,x+xx,floor+spring+h,-.035,.026);
      }
      if(x===0)for(const side of [-1,1]){
        const dx=side*.505;k.box(wood,dx,floor+.89,-.084,.98,1.79,.105);
        for(const y of [.36,1.12,1.48])k.box(0x634834,dx,floor+y,-.021,.80,.046,.034);
        for(const xx of [-.34,.34])k.box(0x694d39,dx+xx,floor+.92,-.018,.045,1.65,.042);
        for(let j=0;j<4;j++)for(let l=0;l<3;l++){
          const rx=dx-.216+.142*j,ry=floor+1.09+.12*l;
          k.box(0x795b42,rx,ry,.005,.063,.098,.031,0,0,side*.56);
        }
      }
    }
    for(const x of [-5.30,-2.10,2.10,5.30]){
      k.box(red,x,2.40,.20,.36,3.27,.19);
      k.box(0xd8d0ac,x,2.16,.307,.22,2.70,.032);
      k.box(red,x,3.65,.245,.53,.14,.22);
    }
    k.box(red,0,3.83,.135,10.78,.26,.32);
    lipRoof(T,k,0,4.04,-.33,11.47,1.42);
    const colours=[0xa85645,0xc29849,0x668775,0x68748b];
    for(const [i,x] of [-5.10,-4.26,-2.49,-1.54,.07,1.61,2.62,4.29,5.06].entries()){
      for(let j=0;j<3;j++){
        const h=.36+.24*Math.abs(Math.cos(i+j*1.7));
        k.box(colours[(i+j)%4],x+j*.055,3.84-h/2,.41+j*.006,.052,h,.022,0,0,.14*Math.sin(i+j));
      }
    }
    k.box(ochre,0,4.87,-.71,5.47,1.64,1.99);
    k.box(red,0,4.93,.307,5.08,1.18,.17);
    k.box(gold,0,4.935,.408,3.40,.89,.047);
    for(const side of [-1,1]){
      k.box(ochre,side*2.10,4.934,.413,.67,.90,.055);
      for(const [xx,yy,d] of [[-.13,-.12,.24],[.055,-.19,.20],[.15,.02,.24],[.045,.20,.18],[-.12,.11,.16]])
        k.tapered(d>.20?0x647565:0x997c52,side*(2.10+xx),4.93+yy,.465,d*.47,d*.64,.09,1,7);
    }
    // Written right-to-left in the source photograph: 解冤溪寺.
    k.sign('寺 溪 冤 解',0,4.93,.446,3.21,.76,true,'#27231b');
    lipRoof(T,k,0,5.65,-.58,5.95,2.50);
    for(let i=0;i<4;i++)k.box(clay,0,.11+i*.095,1.21-i*.28,10.94-i*.07,.22+i*.19,.58);
    k.box(clay,0,.70,-.60,10.73,.15,1.39);
    k.box(wood,.23,.81,2.01,1.75,.10,.68);
    for(const x of [-.51,.97])for(const z of [1.76,2.26])k.box(wood,x,.40,z,.10,.79,.10);
    k.tapered(iron,.26,1.06,2.01,.20,.25,.38,1,24);k.tapered(iron,.26,1.27,2.01,.27,.25,.055,1,24);
    for(const side of [-1,1])k.tapered(clay,side*2.94,.91,.97,.18,.27,.31,1,18);
  }
  function cliff(T,k,rock){
    function wall(u,v){
      const x=(2*u-1)*21,edge=1-Math.abs(2*u-1)**2;
      const crag=.75*Math.sin(x*.42)+.62*Math.cos(v*19+x*.38)+.47*Math.cos(v*31-.23*x);
      const z=-5.8-2.26*v-1.25*Math.cos(.25*x+3*v)-1.95*Math.sin(Math.PI*v)+crag;
      const y=-1.6+v*(7.6+14.6*edge+2.4*Math.sin(.38*x)+1.8*Math.cos(.14*x));
      return [x,y,z+shift];
    }
    rock.grid(72,31,(u,v)=>{
      const [x,y,z]=wall(u,v),crack=Math.cos(.41*y-.39*x),green=.41*Math.sin(.71*x+y*.33)+.42*Math.cos(.42*x-.78*y);
      return [x,y,z,green>.20?0x657451:crack>.35?0xa2a295:0x818574,.74+.17*Math.cos(.31*y+.43*x)];
    });
    rock.grid(64,18,(u,v)=>{
      const [x,y,z]=wall(u,1);
      return [x,y+2.75*Math.sin(Math.PI*v)-v*v*(y+.45),z-19*v,0x738160,.76+.16*Math.cos(x*.31-v*12)];
    });
    for(let i=0;i<36;i++){
      const u=(i*.61803)%1,[x,y,z]=wall(u,1);
      rock.trees.push([x,y-.29,z-.4-(i*.522%1)*4,3.6+(i*.238%1)*3.4,5.3+(i*.396%1)*3.7,i*2.49]);
      const p=wall(u,.44+(i*.382%1)*.55);
      rock.ferns.push([p[0],p[1],p[2]+.36,.66+(i*.234%1)*.81,i*2.14]);
    }
    for(let i=0;i<86;i++){
      const u=(.17+i*.61803)%1,v=.24+.76*((.58+i*.38278)%1),[x,y,z]=wall(u,v);
      if(v<.69&&Math.abs(x)<7)continue;
      const size=.36+.71*(i*.32865%1);
      rock.ferns.push([x,y-.18,z+.18,size*1.43,i*1.96]);
      rock.grid(10,4,(uu,vv)=>{
        const a=uu*Math.PI*2,r=Math.cos(vv*1.55)*size*(1+.17*Math.sin(3*a+i));
        return [x+r*Math.cos(a),y-.43+1.02*size*Math.sin(vv*1.55),z+.27+r*.61*Math.sin(a),
          i%3===1?0x687d4c:0x5a7250,.74+.16*vv+.086*Math.cos(a*4+i)];
      });
    }
  }
  function build(T,k){
    const rock=karst.batch(T),pave=0xb9886e,face=-2.8+shift;
    cliff(T,k,rock);k.place(0,face,0,()=>front(T,k));
    // The archive view from the valley shows a stone carrying wall and an
    // open parapet along the outside edge of the brick-paved terrace.
    const width=29,depth=7.8,edge=face+depth;
    function slope(x,z){
      return -2.5-Math.max(0,z-5)*.61+.43*Math.sin(.41*x+.35*z)+.39*Math.cos(.39*z-.19*x);
    }
    rock.grid(54,29,(u,v)=>{
      const x=(u-.5)*41,z=4.76+v*18.6;
      return [x,slope(x,z),z+shift,Math.sin(.64*x+.21*z)>.35?0x7e8663:0x738267,
        .82+.13*Math.sin(.6*x+.59*z)+.059*Math.cos(.44*x-.81*z)];
    });
    for(let i=0;i<48;i++){
      const x=(i*.61803%1-.5)*36,z=5.2+(i*.38631%1)*12,y=slope(x,z);
      rock.ferns.push([x,y-.08,z+shift,.62+(i*.2843%1)*.89,i*2.31]);
      if(i%5===1)karst.boulder(rock,x,y-.15,z+shift,1.43,.93,1.04,i,true);
    }
    k.box(stone,0,-9.93,face+depth/2,width,20,depth);
    k.box(pave,0,.104,face+depth/2,width,.136,depth);
    for(let row=0;row<12;row++){
      const y=-.20-row*.45;
      for(let j=0;j<13;j++){
        const x=-width/2+(j+(row%2?.5:0))*2.29;
        if(x>=width/2)continue;
        const w=Math.min(2.27,width/2-x);
        k.box(row%3===1?0x818679:0x8b9081,x+w/2,y,edge+.025,w,.43,.11);
      }
    }
    for(let n=-14;n<=14;n++){
      k.box(0x997967,n,.176,face+depth/2,.016,.011,depth);
    }
    for(let j=0;j<11;j++)k.box(0x997967,0,.176,face+.57+j*.69,width,.011,.015);
    for(let n=0;n<13;n++){
      const x=-width/2+n*width/12;k.box(stone,x,.62,edge-.16,.25,.91,.31);
      k.box(pale,x,1.13,edge-.16,.32,.15,.36);
      if(n===12)continue;
      const middle=x+width/24;
      k.box(pale,middle,.96,edge-.16,width/12,.13,.18);
      k.box(stone,middle,.33,edge-.16,width/12,.13,.21);
      for(let j=1;j<=5;j++)k.box(pale,x+j*width/72,.65,edge-.16,.11,.56,.13);
    }
    // Leave the mapped return at the north end of the terrace open. The
    // mature trees along the approach appear in both the monastic and valley photos.
    for(const [x,z,w,h] of [[-12,-.5,4.8,7.2],[10.5,-1.1,6.3,8.4],[-17,4.2,4.7,7.1],[16,2.5,5.3,7.6],
      [-12.9,9.1,5.2,7.7],[12.3,10.5,5.1,8.0],[-20,12.1,5.2,7.5],[20,13.7,6.1,9.0]]){
      rock.trees.push([x,z>5?slope(x,z):.05,z+shift,w,h,x]);
    }
    for(const [x,z,h] of [[-8.7,12,5.4],[7.3,8.7,4.8],[15.1,12.5,6.5],[-16,7.6,5.8]]){
      rock.trees.push([x,slope(x,z),z+shift,h*.75,h,x*1.9]);
    }
    const cable=x=>6.47+.011*x*x-.026*x,cableZ=x=>face+1.16+.12*x,cloth=[0xac5949,0xe3ba58,0x73825c,0x627d99];
    for(let i=0;i<16;i++){
      const x=-10.7+i*1.33,xx=x+1.33;
      A.strut(T,k,0x665c44,x,cable(x),cableZ(x),xx,cable(xx),cableZ(xx),.012);
      k.outline([[0,0],[.35,0],[.29,-.39],[.09,-.32]],cloth[i%4],x+.30,cable(x+.30),cableZ(x+.30),.016,-.13);
    }
    // Outer stone path, from the northern bend to the level court. Give its
    // far end the DEM height and interpolate the ascent back to the terrace.
    const walkway=[[-31.1,-8.1],[-20.9,-10.6],[-14.4,-10.5]],pathY=-4.7;
    const l0=Math.hypot(10.2,2.5),total=l0+Math.hypot(6.5,.1);
    function pathAt(t,side){
      const len=t*total,seg=len<l0?0:1,a=walkway[seg],b=walkway[seg+1],dx=b[0]-a[0],dz=b[1]-a[1],d=Math.hypot(dx,dz);
      const f=(len-(seg?l0:0))/d;
      return [a[0]+f*dx-side*dz/d,a[1]+f*dz+side*dx/d];
    }
    for(let i=0;i<35;i++){
      const t=i/35,tt=(i+1)/35,y=.17+pathY*(1-tt);
      rock.grid(3,1,(u,v)=>{
        const [x,z]=pathAt(t+(tt-t)*v,(u-.5)*2.04);return [x,y,z,0xaaa393,.94];
      });
      rock.grid(3,1,(u,v)=>{
        const [x,z]=pathAt(t,(u-.5)*2.04);return [x,y-.17*(1-v),z,0x8d8a7d,.86];
      });
      for(const side of [-1,1])rock.grid(1,1,(u,v)=>{
        const [x,z]=pathAt(t+(tt-t)*u,side*1.02);return [x,y-8*v,z,0x838579,.84];
      });
    }
    karst.finish(T,k,rock,(ground,x,z)=>{
      const localZ=z-shift;
      if(x<-17.3&&x>=-33&&z>-13.9&&z<-5){
        const t=Math.min(1,(-17.3-x)/13.8);
        return Math.max(0,t)*(ground(...walkway[0])-pathY);
      }
      if(Math.abs(x)<=18&&localZ>=-8&&localZ<=8)return 0;
      const outer=Math.max(0,Math.min(1,(Math.abs(x)-18)/7));
      const behind=Math.max(0,Math.min(1,(-localZ-8)/14)),valley=Math.max(0,Math.min(1,(localZ-8)/14));
      return Math.max(outer,behind,valley)*(ground(x,z)-(localZ>5?slope(x,localZ):0));
    });
  }
  const view=(name,x,z,height,r,angle,e)=>({name,offset:world(x,z),height,viewRadius:r,viewAngle:yaw+angle,viewElevation:e,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Chùa Giải Oan – Hương Sơn',locality:'Hương Sơn',
    lon:105.7413146,lat:20.615969,source,photo:source,map:'https://www.openstreetmap.org/node/2835735216',
    start:raw.start,approachMeters:undefined,mappedEntrance:true,visitOnArrival:true,
    arrivalNote:'Xe dừng cạnh Bến xe Hương Sơn ở chợ Đục Khê. Đi bộ hoặc đi xe điện đến Bến Yến, đi đò đến bến Trò rồi theo lối núi từ Thiên Trù tới chùa Giải Oan.',
    description:'Sân chùa mở về phía thung lũng trên sườn núi Long Tuyền. Ba cửa vòm nằm dưới bốn chữ Giải Oan Khê Tự. Trong chùa có giếng thiên nhiên Thanh Trì. Mặt đứng và dải sân được dựng theo ảnh, với kích thước ước lượng.',
    yaw,width:65,depth:60,gardenRadius:16,foundationAt:[.7,shift-7.4],solids:[[0,shift-4.8,5.4,2.05]],
    views:[view('Ba cửa vòm trên sân gạch',-.16,-2.7,7.45,15.6,-.35,.115),
      view('Bốn chữ Giải Oan Khê Tự',0,-2.52,9.14,9.25,.10,.105),
      view('Sân chùa tựa vách Long Tuyền',-.55,-3.12,12.4,30,.15,.16)],build});
})();

export default window.VietnamSights;
