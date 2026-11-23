'use strict';
(()=>{
  const sites=window.VietnamSights??=[],catalog=new Map(VietnamTourism.entries.map(site=>[site.id,site]));
  // Road junction on Hoàng Diệu leading to the public gate (OSM n6539666886).
  const visitorArrival={start:[105.8390715,21.0336681],approachMeters:null,mappedEntrance:true};
  function register(id,way,details,build){
    const catalogId='osm-way-'+way,map='https://www.openstreetmap.org/way/'+way;
    sites.push({province:'Hà Nội',city:'Hà Nội',locality:'Hà Nội',region:'Bắc Bộ',kind:'Di tích',
      ...catalog.get(catalogId),id,catalogId,map,...details,build});
  }
  function cord(T,stamp,tint,points,r,n=10,sides=6){
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const geometry=new T.TubeGeometry(curve,n,r,sides,false);
    stamp(geometry,tint,0,0,0);geometry.dispose();
  }
  function link(T,stamp,tint,a,b,r,top=r,sides=8){
    const start=new T.Vector3(...a),end=new T.Vector3(...b),axis=end.clone().sub(start);
    const shape=new T.CylinderGeometry(top,r,axis.length(),sides);
    shape.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),axis.normalize()));
    const m=end.lerp(start,.5);stamp(shape,tint,m.x,m.y,m.z);shape.dispose();
  }
  function ellipse(T,stamp,tint,x,y,z,w,h,d,ry=0,rx=0){
    const geometry=new T.SphereGeometry(1,12,8);
    stamp(geometry,tint,x,y,z,w,h,d,ry,rx);geometry.dispose();
  }
  // Four gently hollow roof planes meet on raised hips. Rows are baked per face so
  // terracotta remains visible across the small curved margins as well as the ridge.
  function* tiledRoof(T,{stamp},x,z,halfX,halfZ,eaves,rise,colour,trim,ridgeHalf){
    const ridge=ridgeHalf??Math.max(.16,halfX-halfZ+.23),lift=Math.min(.64,halfZ*.16),colourFace=new T.Color(colour);
    const edges=[[[-halfX,-halfZ],[halfX,-halfZ],[-ridge,0],[ridge,0]],
      [[halfX,-halfZ],[halfX,halfZ],[ridge,0],[ridge,0]],
      [[halfX,halfZ],[-halfX,halfZ],[ridge,0],[-ridge,0]],
      [[-halfX,halfZ],[-halfX,-halfZ],[-ridge,0],[-ridge,0]]];
    function at(edge,u,v){
      const [a,b,c,d]=edge,lerp=(i,j,t)=>i+(j-i)*t;
      return [x+lerp(lerp(c[0],d[0],u),lerp(a[0],b[0],u),v),
        eaves+rise*(1-v)**1.68+lift*Math.abs(2*u-1)**5*v**2.7,
        z+lerp(lerp(c[1],d[1],u),lerp(a[1],b[1],u),v)];
    }
    for(const edge of edges){
      yield;
      const cols=Math.max(8,Math.ceil(Math.hypot(edge[1][0]-edge[0][0],edge[1][1]-edge[0][1])/.29)),rows=7;
      const groups=[[],[],[],[]],underside=[],fascia=[],lower=p=>[p[0],p[1]-.11,p[2]];
      const column=i=>Array.from({length:rows+1},(_,j)=>at(edge,i/cols,j/rows));
      let left=column(0);
      for(let i=0;i<cols;i++){
        const right=column(i+1);
        for(let j=0;j<rows;j++){
          const a=left[j],b=right[j],c=right[j+1],d=left[j+1];
          groups[(i*13+j*3+Math.floor(i/4))%4].push(...a,...b,...c,...a,...c,...d);
          const la=lower(a),lb=lower(b),lc=lower(c),ld=lower(d);
          underside.push(...la,...lc,...lb,...la,...ld,...lc);
          if(j===rows-1)fascia.push(...d,...c,...lc,...d,...lc,...ld);
        }
        left=right;
      }
      for(let k=0;k<4;k++){
        yield;
        const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(groups[k],3));geom.computeVertexNormals();
        stamp(geom,colourFace.clone().multiplyScalar([.89,1,.93,1.04][k]).getHex(),0,0,0);geom.dispose();
      }
      for(const [vertices,tint] of [[underside,0x78533e],[fascia,trim]]){
        yield;
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.computeVertexNormals();
        stamp(g,tint,0,0,0);g.dispose();
      }
      cord(T,stamp,trim,Array.from({length:11},(_,i)=>at(edge,i/10,1)),.066,14);
      let hip=Array.from({length:7},(_,i)=>at(edge,0,i/6));
      cord(T,stamp,trim,hip,.075,12);
      const end=hip.at(-1),sx=Math.sign(end[0]-x),sz=Math.sign(end[2]-z);
      cord(T,stamp,trim,[end,[end[0]+.18*sx,end[1]+.12,end[2]+.18*sz],[end[0]+.29*sx,end[1]+.38,end[2]+.28*sz]],.066,7);
    }
    link(T,stamp,trim,[x-ridge,eaves+rise+.05,z],[x+ridge,eaves+rise+.05,z],.105,.105);
  }
  function reliefArch(T,{profile},x,z,w,spring,rise,depth,tint){
    const r=w/2,margin=.23,s=new T.Shape();
    s.moveTo(-r-margin,0);s.lineTo(-r-margin,spring);s.absellipse(0,spring,r+margin,rise+margin,Math.PI,0,true);
    s.lineTo(r+margin,0);s.lineTo(r,0);s.lineTo(r,spring);s.absellipse(0,spring,r,rise,0,Math.PI,false);
    s.lineTo(-r,0);s.closePath();profile(s,tint,x,0,z,depth);
  }
  const treeAssets=new WeakMap();
  function tree(T,{group},x,z,h,spread,y=0){
    let models=treeAssets.get(group);
    if(!models){models=createTreeModels(T);treeAssets.set(group,models);}
    const mesh=new T.Mesh(models.geometry('tree',false,models.variantAt(x,z)),models.material);
    mesh.position.set(x,y,z);mesh.scale.set(spread*2,h,spread*2);mesh.rotation.y=x*.83+z*.65;
    mesh.castShadow=mesh.receiveShadow=true;
    group.add(mesh);
  }
  const gateBays=[[-16,2.95,1.50,1.40],[-6.6,2.85,2.16,1.30],[0,4.00,2.56,1.74],[6.6,2.85,2.16,1.30],[16,2.95,1.50,1.40]];
  function* doanMon(T,kit){
    const {box,profile,sign,stamp,round,wavingFlag,random}=kit;
    const stone=0x938b77,brick=0x968671,dark=0x716e61,coping=0xac9b7f,plaster=0xe5bc72,edge=0xd0ae78;
    box(0xb0a393,0,-.05,16,52,.12,8.8);
    let left=-23.25;
    // Each bay spans the full width of its wall section. The arched void also
    // continues through the rearward returns of the U-shaped base.
    for(let i=0;i<gateBays.length;i++){
      yield;
      const [x,w,spring,rise]=gateBays[i],r=w/2,right=i<4?(x+gateBays[i+1][0])/2:23.25;
      const outer=i===0||i===4,z0=outer?-14.4:-.8,z1=outer?11.8:13.2,h=outer?6.7:7.55;
      const s=new T.Shape();s.moveTo(left,0);s.lineTo(x-r,0);s.lineTo(x-r,spring);
      s.absellipse(x,spring,r,rise,Math.PI,0,true);s.lineTo(x+r,0);s.lineTo(right,0);s.lineTo(right,h);s.lineTo(left,h);s.closePath();
      profile(s,outer?brick:stone,0,0,z0,z1-z0);
      reliefArch(T,kit,x,z1-.01,w,spring,rise,.23,0xb5ac96);
      reliefArch(T,kit,x,z0-.15,w,spring,rise,.15,0xa49a87);
      for(let row=0;row<Math.floor((h-.25)/.48);row++){
        const y=.22+row*.48;
        for(let j=0;j<Math.ceil((right-left)/1.25);j++){
          const px=left+.55+(row%2)*.35+j*1.25,half=.48;
          if(px+half>right||Math.abs(px-x)<r+.35&&y-.20<spring+rise*Math.sqrt(Math.max(0,1-(Math.max(0,Math.abs(px-x)-half)/(r+.35))**2))+.22)continue;
          box([0x8b8575,0x99917c,0xa09883,0x9d8d79][Math.floor(random()*4)],px,y,z1+.012,.98,.37,.035);
        }
      }
      const width=right-left;
      for(const [y,h2,d] of [[h+.07,.14,.3],[h+.42,.57,.04],[h+.83,.19,.23]]){
        box(coping,(left+right)/2,y,z1,width,h2,.52+d);
      }
      box(0xb5a68e,(left+right)/2,h+.032,(z1+z0)/2,width,.07,z1-z0);
      if(outer){
        for(const sx of [left,right])box(coping,sx,h+.34,(z1+z0)/2,.49,.65,z1-z0);
        box(coping,(left+right)/2,h+.34,z0,width,.65,.49);
      }
      left=right;
    }
    box(0xaeaa96,0,5.51,13.44,1.98,.92,.23);sign('端 門',0,5.54,13.57,1.51,.52,true);
    for(const side of [-1,1]){
      for(let i=0;i<32;i++){
        const x=side*(23.24+(31-i)*.402),h=(i+1)*.20;
        box(stone,x,h/2,10.33,.42,h,3.57);
      }
      for(const z of [8.31,12.35])link(T,stamp,coping,[side*36.04,.64,z],[side*23.0,7.04,z],.20,.20,7);
    }
    // Yellow pavilion standing on its own upper terrace, as seen from the south.
    box(plaster,0,9.02,6.1,12.6,2.94,7.45);
    for(const x of [-5.75,-3.3,0,3.3,5.75]){
      box(edge,x,9.05,9.88,.32,2.79,.25);
      if(Math.abs(x)<4)box(0x97886b,x,8.92,9.86,1.52,1.98,.07);
    }
    box(edge,0,10.56,6.1,13.0,.25,7.86);
    for(const z of [2.3,9.92]){
      box(edge,0,11.39,z,12.84,.18,.34);
      for(let x=-6.1;x<=6.11;x+=.60)box(0xc4b096,x,10.99,z,.19,.64,.23);
    }
    for(const x of [-6.23,6.23]){
      box(edge,x,11.39,6.1,.28,.18,7.7);
      for(let z=2.7;z<9.8;z+=.58)box(0xc4b096,x,10.99,z,.22,.64,.2);
    }
    const loft=new T.Shape();loft.moveTo(-3.75,0);loft.lineTo(-1.17,0);loft.lineTo(-1.17,1.03);
    loft.absarc(0,1.03,1.17,Math.PI,0,true);loft.lineTo(1.17,0);loft.lineTo(3.75,0);loft.lineTo(3.75,2.8);loft.lineTo(-3.75,2.8);loft.closePath();
    for(const z of [3.28,8.63])profile(loft,plaster,0,10.7,z,.32);
    for(const x of [-3.62,3.62])box(plaster,x,12.08,6.13,.32,2.77,5.55);
    yield* tiledRoof(T,kit,0,6.12,4.72,3.66,13.41,1.36,0x8d634c,0x665b51);
    box(plaster,0,14.65,6.12,4.92,.48,3.35);
    yield* tiledRoof(T,kit,0,6.12,3.58,2.63,14.82,1.47,0x99715a,0x655b51);
    stamp(round,0x9d9681,0,18,6.12,.055,3.65,.055);wavingFlag(1.72,1.04,0,19.8,6.12);
    for(const side of [-1,1])tree(T,kit,side*26,-13,10.4,4.6);
  }
  register('doan-mon-thang-long',696389268,{...visitorArrival,yaw:-.111,width:75,depth:30,
    source:'https://hoangthanhthanglong.vn/doan-mon/',photo:'https://hoangthanhthanglong.vn/wp-content/uploads/2019/04/doan-mon-02.jpg',
    boundary:[[-23,-15],[-9.2,-15],[-9.2,-.8],[11.4,-.8],[11.4,-15],[25,-15],[25,8.5],[38.3,8.5],[38.3,13],[24.9,13],[-23.2,13.4],[-36.2,12.6],[-36.2,8.4],[-23.2,8.4]],
    reserve:(x,z,p)=>Math.abs(x)<38+p&&z> -16-p&&z<30+p,
    solids:[[-20.4,-1.2,2.84,13.25],[-11.3,-1.2,3.14,13.25],[-3.35,6.3,1.31,7.05],[3.35,6.3,1.31,7.05],[11.3,-1.2,3.14,13.25],[20.4,-1.2,2.84,13.25],[-29.6,10.3,6.4,2],[29.6,10.3,6.4,2]],
    views:[{name:'Năm cửa vòm phía nam',offset:[-.62,6.2],height:15.2,viewRadius:43,viewElevation:.12,viewAngle:.10},{name:'Lầu trên cửa Đoan Môn',offset:[-.67,6.0],height:23.5,viewRadius:26,viewElevation:.20,viewAngle:.50}],
    description:'Năm vòm xuyên qua chân thành hình chữ U. Cửa chính giữa rộng nhất, bên trên đặt tấm biển đá khắc hai chữ Đoan Môn. Hai cầu thang hai bên dẫn lên sân lầu.'},doanMon);
  // Coordinates below are relative to the foot of a carved rail. Positive z faces
  // the viewer and the head, and negative z follows the back up the stone steps.
  function* carvedDragon(T,kit,x,z,length,rise,orientation=1,scale=1){
    const {stamp}=kit,col=0xa8a59a,highlight=0xbdb8a7,shade=0x8d8d82,extent=length;
    const map=([u,y,along])=>[x+u*scale,y*scale,z+along*orientation*scale];
    const line=(p,r,c=col,n=13)=>cord(T,stamp,c,p.map(map),r*scale,n);
    const oval=(u,y,v,w,h,d,c=col,rx=0)=>{
      const q=map([u,y,v]);ellipse(T,stamp,c,...q,w*scale,h*scale,d*scale,0,rx*orientation);
    };
    // Broad carved cloud underneath the neck, open mouth, projecting snout and a stone pearl.
    oval(0,.23,-.28,.25,.23,.68,shade);oval(0,.55,-.28,.263,.36,.61,col,.23);
    oval(0,.83,-.07,.29,.52,.46,col,.26);
    oval(0,1.08,.23,.30,.32,.46);oval(0,1.04,.58,.245,.19,.35,col,-.15);
    oval(0,.85,.62,.201,.065,.29,shade,-.04);oval(0,.74,.49,.23,.093,.39);
    oval(0,.81,.75,.121,.12,.12,highlight);
    for(const hand of [-1,1]){
      yield;
      oval(hand*.218,1.26,.30,.099,.095,.121,highlight);
      oval(hand*.277,1.26,.334,.032,.052,.062,shade);
      oval(hand*.162,1.15,.76,.075,.052,.086,shade);
      line([[hand*.20,1.30,.32],[hand*.25,1.35,.16],[hand*.24,1.32,-.03]],.055,highlight);
      line([[hand*.11,1.30,.04],[hand*.19,1.53,-.18],[hand*.16,1.58,-.39],[hand*.21,1.72,-.52]],.046);
      line([[hand*.17,1.51,-.18],[hand*.28,1.59,-.19],[hand*.31,1.66,-.22]],.028);
      for(let j=0;j<4;j++){
        const h=1.23-j*.13;
        line([[hand*.20,h,.16],[hand*.31,h+.03,-.07],[hand*.33,h+.11,-.29],
          [hand*.28,h+.15,-.47-j*.08],[hand*.21,h+.25,-.59-j*.10]],.05-j*.003,highlight,11);
      }
      line([[hand*.205,1.00,.57],[hand*.31,.96,.34],[hand*.33,.91,.03],[hand*.285,.83,-.20]],.035,highlight);
    }
    const ringCount=61,sides=10,pos=[],idx=[];
    for(let i=0;i<ringCount;i++){
      const t=i/(ringCount-1),a=t*Math.PI*7,along=-.38-(extent-.42)*t;
      const cy=.71+rise*t+.14*Math.cos(a)*(1-t*.64),radius=.255*(1-.76*t);
      for(let j=0;j<sides;j++){
        const angle=j*Math.PI*2/sides;
        pos.push(...map([Math.cos(angle)*radius,cy+Math.sin(angle)*radius,along]));
        if(i) {
          const k=(i-1)*sides+j,l=(i-1)*sides+(j+1)%sides;
          if(orientation===1)idx.push(k,k+sides,l,l,k+sides,l+sides);
          else idx.push(k,l,k+sides,l,l+sides,k+sides);
        }
      }
    }
    const g=new T.BufferGeometry();g.setIndex(idx);g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();
    stamp(g,col,0,0,0);g.dispose();
    for(let j=0;j<4;j++){
      yield;
      const t=.15+.192*j,py=.64+rise*t,pz=-.38-(extent-.42)*t,hand=j%2?1:-1;
      line([[hand*.10,py+.12,pz],[hand*.26,py-.08,pz+.16],[hand*.28,py-.24,pz+.04],[hand*.31,py-.31,pz+.25]],.060);
      for(let k=0;k<5;k++)line([[hand*.29,py-.25,pz+.14],[hand*(.30+k*.019),py-.30,pz+.20+k*.035],[hand*(.32+k*.023),py-.35,pz+.26+k*.04]],.020,highlight,6);
    }
  }
  function* terrace(T,kit){
    const {box,outline,stamp,random}=kit,h=2.32,topZ=9.82,baseZ=14.95,run=baseZ-topZ;
    const grey=[0xada99a,0xa4a194,0xbab5a6,0xaba99f],riser=[0x908e84,0xa09b8d,0x97978e,0xaaa497];
    const stone=0x9c9787,plinth=0x9b8d76;
    box(0xb3aa95,0,-.095,20.6,35,.20,15);
    // Registered remains outline (OSM w1497572243), with surfaced south landing.
    box(plinth,-.15,h/2,-2.57,52.2,h,19.94);
    box(plinth,-1.55,h/2,-12.7,36.1,h,3.0);
    box(0xb09b7d,-.15,h-.024,-2.58,52.03,.08,19.8);
    for(let side of [-1,1]){
      for(let y=0;y<6;y++){
        const low=6.74,span=19.35;
        for(let i=0;i<15;i++){
          const w=span/15,px=side*(low+i*w+w/2);
          box([0x9e937f,0xa39681,0x9e8d77,0x938b77][Math.floor(random()*4)],px,.195+y*.383,7.43,w-.022,.36,.15);
        }
      }
      box(0xbeb19a,side*16.35,h+.005,7.37,19.35,.13,.45);
    }
    box(stone,0,h*.5,8.55,13.59,h,2.55);
    for(let i=0;i<9;i++){
      const y=(i+1)*h/9,z=baseZ-(i+.5)*run/9;
      box(riser[i%4],0,y/2,z,13.55,y,run/9+.01);
      for(let bay=0;bay<3;bay++){
        const centre=[-4.53,0,4.53][bay],span=bay===1?4.3:4.67;
        for(let slab=0;slab<2;slab++){
          box(grey[(i+bay+slab)%4],centre+(slab-.5)*span/2,y-.026,z+.020,span/2-.018,.07,run/9+.015);
        }
      }
    }
    for(const hand of [-1,1]){
      const x=hand*6.52,points=[[0,0],[0,.35],[.18,.54],[.43,.60],[.60,.52],[1.35,.87],[2,1.08],
        [2.8,1.48],[3.5,1.77],[4.10,2.14],[4.70,2.46],[5.25,2.89],[5.25,0]];
      // A thin slab carved in relief, in contrast to the two freestanding central heads.
      outline(points,0xa29e90,x-.20,0,baseZ+.08,.40,Math.PI/2);
      for(const side of [-1,1]){
        const px=x+side*.205;
        for(let i=0;i<7;i++){
          const t=.14+i*.62,y=.24+t*.41;
          const stem=Array.from({length:9},(_,k)=>{const a=k*.59;return [px,y+.096*Math.sin(a),baseZ-t-.10*Math.cos(a)];});
          cord(T,stamp,0xb9b3a2,stem,.026,10);
          cord(T,stamp,0xafaa99,[[px,y-.10,baseZ-t+.17],[px,y+.015,baseZ-t+.04],[px,y+.03,baseZ-t-.15],[px,y+.15,baseZ-t-.30]],.027,8);
        }
      }
      const cx=hand*2.13;
      outline([[0,0],[0,.36],[.36,.57],[.78,.51],[1.25,.78],[2,1.11],[3,1.60],[4,1.98],[5.20,2.53],[5.20,0]],0x9f9b8c,cx-.18,0,baseZ+.02,.36,Math.PI/2);
      for(let j=0;j<7;j++){
        const t=(j+.65)/7,along=4.66*t;
        ellipse(T,stamp,0xa29f90,cx,.43+t*1.99,baseZ-.38-along,.17,.23,.43,0,.26);
        for(const side of [-1,1]){
          const xx=cx+side*.17,y=.34+t*1.98,zz=baseZ-.30-along;
          cord(T,stamp,0xb2ae9f,[[xx,y-.12,zz+.19],[xx,y+.05,zz+.11],[xx,y+.12,zz-.06],[xx,y+.03,zz-.18],[xx,y-.02,zz-.08]],.034,9);
        }
      }
      yield* carvedDragon(T,kit,cx,baseZ+.05,5.14,2.04);
    }
    // Northern Lê Trung Hưng stair is a smaller separate seven-step flight on the west.
    const rx=-14.1,rz=-14.17;
    for(let i=0;i<7;i++){
      const y=(7-i)*h/7;
      box(grey[i%4],rx,y*.5,rz-(i+.5)*.54,3.55,y,.545);
    }
    for(const side of [-1,1])yield* carvedDragon(T,kit,rx+side*1.60,rz-3.85,4.36,2.49,-1,.80);
    for(const [x,z,ht,r] of [[-9,-4,13,7.2],[10.3,-6,13.7,7.7],[-22,2,10.1,5.6],[24,1.5,11.3,6.1]])tree(T,kit,x,z,ht,r,h);
  }
  register('dien-kinh-thien',1497572243,{...visitorArrival,visitOnArrival:true,yaw:-.09,width:53,depth:34,
    source:'https://trungbayonline.hoangthanhthanglong.vn/BaoVatQuocGia/detailBacKinhThien',photo:'https://trungbayonline.hoangthanhthanglong.vn/Content/BaoVatQuocGia/assets/img/backinhthien/bo-bac/PL08_2.jpg',
    boundary:[[-26.3,7.5],[-6.9,7.5],[-6.9,15.6],[6.9,15.6],[6.9,7.5],[26,7.5],[26,-12.1],[16.6,-12.1],[16.6,-14.2],[-19.5,-14.2],[-19.5,-12.6],[-26.3,-12.6]],
    reserve:(x,z,p)=>Math.abs(x)<28+p&&z> -19-p&&z<27+p,
    solids:[[0,-2.55,26.1,9.96],[0,11.2,6.8,3.8],[-1.5,-12.8,18.05,1.50],[-14.1,-16.0,1.85,2.0]],
    views:[{name:'Thềm rồng thời Lê sơ',offset:[-1.20,13.30],height:3.15,viewRadius:11.6,viewElevation:.13,viewAngle:.28},
      {name:'Đầu rồng đá năm 1467',offset:[.83,14.76],height:2.1,viewRadius:4.2,viewElevation:.11,viewAngle:1.08},
      {name:'Nền điện và hai thềm đá',offset:[0,0],height:5.6,viewRadius:42,viewElevation:.48,viewAngle:.62}],
    description:'Từ cổng 19C Hoàng Diệu, qua Đoan Môn tới thềm rồng. Hai thành rồng đá và hai thành mây hóa rồng từ năm 1467 chia thềm nam thành ba lối. Thềm nhỏ thời Lê Trung hưng nằm ở góc tây bắc nền điện.'},terrace);
  function* pavilion(T,kit){
    const {box,stamp,profile,sign}=kit,grey=0xd7d3c6,trim=0xbdb9aa,red=0x9f4934,wood=0x884332,lacquer=0xb35c40;
    kit.palette({timber: wood});
    for(const [w,y,h] of [[6.55,.105,.21],[6.18,.32,.22],[5.84,.51,.16]])box(0x9f9283,0,y,0,w,h,w);
    box(0xaf7260,0,.59,0,5.76,.12,5.76);
    for(const side of [-1,1])for(let i=0;i<3;i++){
      const h=(3-i)*.17;box(trim,0,h/2,side*(3.27+i*.24),2.63,h,.27);
    }
    for(const x of [-2.18,2.18])for(const z of [-2.18,2.18]){
      box(trim,x,.75,z,1.16,.23,1.16);box(grey,x,2.34,z,.97,3.03,.97);
      box(trim,x,3.86,z,1.05,.24,1.05);box(grey,x,4.03,z,1.17,.15,1.17);
      for(const face of [-1,1]){
        const front=z+face*.495;
        for(const dx of [-.35,.35])box(trim,x+dx,2.37,front,.035,2.40,.026);
        for(const y of [1.18,3.57])box(trim,x,y,front,.71,.038,.026);
        const carving=Array.from({length:18},(_,i)=>{
          const t=i/17;return [x+Math.sin(t*Math.PI*3)*(.11+.06*Math.sin(t*Math.PI)),1.39+t*1.93,front+face*.018];
        });
        cord(T,stamp,0xc3c0b3,carving,.021,21);
      }
    }
    box(0x763c2d,0,4.16,0,5.60,.25,5.60);box(lacquer,0,4.30,0,5.72,.13,5.72);
    const w=3.86,windowR=.91,cy=5.51;
    for(let side=0;side<4;side++){
      const a=side*Math.PI/2,cs=Math.cos(a),sn=Math.sin(a),point=(u,y,v)=>[u*cs+v*sn,y,-u*sn+v*cs];
      const panel=new T.Shape();panel.moveTo(-w/2,-1.17);panel.lineTo(w/2,-1.17);
      panel.lineTo(w/2,1.17);panel.lineTo(-w/2,1.17);panel.closePath();
      const hole=new T.Path();hole.absarc(0,0,windowR,0,2*Math.PI,true);panel.holes.push(hole);
      profile(panel,red,...point(0,cy,1.81),.13,a);
      const rim=Array.from({length:33},(_,i)=>point(windowR*Math.cos(i*Math.PI/16),cy+windowR*Math.sin(i*Math.PI/16),1.972));
      cord(T,stamp,0xc78c55,rim,.044,36);
      for(const sx of [-1,1])for(const sy of [-1,1]){
        const k=Math.SQRT1_2;
        link(T,stamp,0xc88c58,point(sx*windowR*k,cy+sy*windowR*k,1.97),point(sx*1.12,cy+sy*1.13,1.97),.055);
      }
      for(const sx of [-1,1]){
        box(lacquer,...point(sx*1.63,cy,1.98),.16,2.28,.14,a);
        box(0xcb9a63,...point(sx*1.52,cy,1.975),.032,1.96,.055,a);
      }
      for(const y of [4.51,4.86,4.93])box(wood,...point(0,y,2.72),5.54,.080,.12,a);
      for(let i=-12;i<=12;i++){
        const u=i*.212;
        if(Math.abs(u)<1.04)continue;
        link(T,stamp,lacquer,point(u,4.51,2.71),point(u,4.87,2.71),.037,.034);
        ellipse(T,stamp,lacquer,...point(u,4.62,2.71),.045,.073,.045);
      }
      for(const sx of [-1,1])link(T,stamp,wood,point(sx*1.73,6.13,1.80),point(sx*2.66,6.63,2.60),.094);
    }
    for(const x of [-1.90,1.90])for(const z of [-1.90,1.90])box(lacquer,x,5.52,z,.22,2.46,.22);
    box(wood,0,6.69,0,4.39,.18,4.39);
    yield* tiledRoof(T,kit,0,0,3.32,3.15,6.71,1.04,0xa8694d,0x8f6c5c,1.91);
    box(0x805444,0,7.51,0,3.87,.53,2.56);
    yield* tiledRoof(T,kit,0,0,2.66,1.99,7.71,1.00,0xaf7457,0x957565,1.74);
    const carved=0xb8a18b;
    for(const sx of [-1,1])for(const sz of [-1,1]){
      cord(T,stamp,carved,[[sx*3.04,7.07,sz*2.88],[sx*3.38,7.24,sz*3.22],[sx*3.42,7.52,sz*3.34],[sx*3.30,7.65,sz*3.25],[sx*3.25,7.49,sz*3.16]],.060,12);
      cord(T,stamp,carved,[[sx*2.50,7.99,sz*1.85],[sx*2.83,8.17,sz*2.08],[sx*2.88,8.44,sz*2.14],[sx*2.72,8.48,sz*2.08]],.051,9);
    }
    ellipse(T,stamp,carved,0,9.04,0,.18,.20,.13);
    sign('奎 文 閣',0,6.55,2.036,1.55,.27,true);
    // The precinct layer supplies surveyed trees and walls w702241341/342.
  }
  register('khue-van-cac',702185155,{name:'Khuê Văn Các',lon:105.835890,lat:21.028583,start:[105.8353754,21.0273187],approachMeters:null,
    visitOnArrival:true,arrivalNote:'Xe dừng trên phố Quốc Tử Giám, trước cổng chính Văn Miếu. Khuê Văn Các nằm bên trong, qua Đại Trung Môn.',
    yaw:-.353,width:6.6,depth:6.55,source:'https://www.vanmieu.gov.vn/vi/visit/architecture/khue-van-pavilion',photo:'https://www.vanmieu.gov.vn/vi/visit/architecture/khue-van-pavilion',
    boundary:[[-3.4,-3.4],[3.4,-3.4],[3.4,3.4],[-3.4,3.4]],reserve:(x,z,p)=>Math.abs(x)<8+p&&Math.abs(z)<14+p,
    solids:[[-2.18,-2.18,.52,.52],[-2.18,2.18,.52,.52],[2.18,-2.18,.52,.52],[2.18,2.18,.52,.52]],
    views:[{name:'Gác Khuê Văn',height:9.0,viewRadius:13,viewAngle:-.11,viewElevation:.075},{name:'Cửa sổ sao Khuê',height:12.0,viewRadius:7.5,viewAngle:-.17,viewElevation:.07}],
    description:'Bốn trụ gạch đỡ gác gỗ hai tầng mái giữa Văn Miếu. Bốn cửa sổ tròn có các thanh gỗ tỏa như tia sáng của sao Khuê. Gác được dựng năm 1805.'},pavilion);

  function* onePillar(T,kit){
    const {box,stamp,round,random}=kit,stone=0xb5b3a1,light=0xc4bcab,wood=0x624733,dark=0x493b2c;
    kit.palette({stone, timber: wood});
    // Linh Chiểu pond (w697326497) and the mapped south-west flight (w697326492).
    box(0x54796d,0,.059,0,16.44,.12,17.48);
    const tile=0xb4ad94;
    for(const side of [-1,1]){
      box(tile,side*8.46,.19,0,.45,.38,18.08);box(0xaaa393,side*8.46,.43,0,.55,.12,18.08);
      box(tile,0,.19,side*8.77,17.02,.38,.44);box(0xaaa393,0,.43,side*8.77,17.1,.12,.55);
      // Low screen with openings along the pond, leaving the stair approach clear.
      for(let i=-4;i<4;i++){
        const u=(i+.5)*2.05;
        for(const alongX of [false,true]){
          if(alongX&&side===1&&Math.abs(u)<1.80)continue;
          const px=alongX?u:side*8.46,pz=alongX?side*8.77:u;
          box(light,px,.96,pz,alongX?2.05:.19,.18,alongX?.19:2.05);
          for(let j=-2;j<=2;j++){
            box(stone,alongX?px+j*.37:px,.69,alongX?pz:pz+j*.37,alongX?.12:.16,.42,alongX?.16:.12);
          }
        }
      }
    }
    for(let i=0;i<20;i++){
      const x=(random()-.5)*14.4,z=(random()-.5)*15.4;if(Math.abs(x)<2.8&&z> -3)continue;
      const r=.14+random()*.26;stamp(round,i%3?0x67845f:0x83945e,x,.135,z,r,.014,r*.76,random()*3);
    }
    stamp(round,0x9a9a8b,0,1.18,0,.595,2.31,.595);
    for(const y of [.23,1.09,1.95])stamp(round,stone,0,y,0,.61,.045,.61);
    for(const sx of [-1,1])for(const sz of [-1,1]){
      link(T,stamp,wood,[sx*.23,1.28,sz*.23],[sx*1.89,2.58,sz*1.90],.15,.15,8);
      link(T,stamp,0x7b6048,[sx*.30,1.77,sz*.32],[sx*1.25,2.63,sz*1.24],.12,.11,8);
    }
    for(const x of [-1.61,1.61])box(dark,x,2.58,0,.24,.28,4.57);
    box(wood,0,2.76,0,4.78,.19,4.78);
    for(const x of [-1.75,1.75])for(const z of [-1.75,1.75])stamp(round,wood,x,3.94,z,.14,2.34,.14);
    box(0x5f4c38,0,4.03,-1.34,3.33,2.28,.43);
    for(const x of [-1.53,1.53]){
      box(dark,x,3.86,-.16,.18,1.98,2.08);
      for(let j=0;j<11;j++)box(0x7b6049,x+Math.sign(x)*.10,3.91,-1.14+j*.18,.042,1.86,.05);
    }
    for(const sx of [-1,1]){
      box(wood,sx*1.09,3.88,1.45,1.12,2.13,.14);
      for(let j=0;j<8;j++)box(0x86684c,sx*(.62+j*.129),4.0,1.54,.045,1.77,.039);
      for(const z of [-2.23,2.23]){
        const xx=z>0?sx*1.59:sx*1.11,span=z>0?1.25:2.22;
        box(wood,xx,3.35,z,span,.11,.12);
        for(let j=0;j<Math.ceil(span/.235);j++)box(0x75614a,xx-span/2+.13+j*.231,3.11,z,.067,.42,.084);
      }
      box(wood,sx*2.23,3.35,0,.12,.11,4.50);
      for(let j=0;j<18;j++)box(0x75614a,sx*2.23,3.11,-2.10+j*.247,.081,.42,.073);
    }
    box(0xbb8762,0,3.53,-1.06,1.24,.35,.54);ellipse(T,stamp,0xb99b53,0,4.06,-.92,.22,.34,.19);
    for(const x of [-1.80,1.80])box(dark,x,5.09,0,.22,.22,4.22);
    for(const z of [-1.83,1.83])box(wood,0,5.10,z,4.23,.25,.22);
    yield* tiledRoof(T,kit,0,0,2.76,2.72,5.20,1.58,0x956f58,0x8d8b78,1.08);
    for(const sx of [-1,1]){
      cord(T,stamp,0xabaa96,[[sx*.17,6.94,0],[sx*.38,7.14,0],[sx*.57,7.23,0],[sx*.70,6.96,0],[sx*.92,6.91,0],[sx*1.14,7.13,0]],.055);
      for(const sz of [-1,1]){
        cord(T,stamp,0xa4a18e,[[sx*2.05,5.69,sz*1.92],[sx*2.50,5.68,sz*2.41],[sx*2.89,5.86,sz*2.84],[sx*2.92,6.14,sz*2.91]],.072,12);
      }
    }
    ellipse(T,stamp,0xbeac84,0,7.11,0,.124,.18,.075);
    const n=13,z0=2.42,z1=9.76,slope=(z1-z0)/n;
    for(let i=0;i<n;i++){
      const h=.40+(n-i)*2.40/n;box(i%3?0xb2a899:0xbaafa0,0,h/2,z0+(i+.5)*slope,1.74,h,slope+.012);
    }
    for(const sx of [-1,1]){
      const x=sx*1.02;
      const rail=[[0,0],[0,3.43],[.34,3.47],[.67,3.18],[6.62,1.12],[6.96,1.25],[7.36,1.04],[7.36,0]];
      // A pair of whitewashed stone cheeks with capped ends at the pool edge.
      kit.outline(rail,stone,x+.15,0,z0,.30,-Math.PI/2);
      link(T,stamp,light,[x,3.46,z0+.17],[x,1.11,z1-.37],.107,.107);
      for(const [y,z] of [[3.29,z0+.15],[1.09,z1-.17]]){box(light,x,y,z,.40,.33,.42);ellipse(T,stamp,0xa7a38f,x,y+.29,z,.16,.21,.16);}
    }
    tree(T,kit,-9.5,-7,9.2,3.5);tree(T,kit,10.3,-5.4,9.7,3.9);
  }
  register('chua-mot-cot',697326496,{yaw:-.405,width:17.3,depth:19.6,source:'https://csdl.vietnamtourism.gov.vn/dest/?item=54',
    photo:'https://commons.wikimedia.org/wiki/File:Hanoi%2C_Vietnam_(12041825854).jpg',
    boundary:[[-3.3,-3.3],[3.3,-3.3],[3.3,3.3],[1.3,3.3],[1.3,9.85],[-1.3,9.85],[-1.3,3.3],[-3.3,3.3]],
    reserve:(x,z,p)=>Math.abs(x)<9+p&&z> -9.1-p&&z<12+p,solids:[[0,0,.60,.60],[0,6.2,1.17,3.8],[-8.48,0,.22,8.9],[8.48,0,.22,8.9],[0,-8.77,8.45,.22],[-4.83,8.77,3.40,.22],[4.83,8.77,3.40,.22]],
    views:[{name:'Liên Hoa Đài và hồ Linh Chiểu',height:6.8,viewRadius:14.7,viewAngle:.49,viewElevation:.13},
      {name:'Cột đá và hệ đỡ gỗ',height:4.5,viewRadius:8.5,viewAngle:1.85,viewElevation:.075}],
    description:'Liên Hoa Đài bằng gỗ vươn trên một cột đá giữa hồ Linh Chiểu. Các thanh chống chéo tỏa từ cột lên sàn. Một cầu thang hẹp nối tòa sen với bờ hồ.'},onePillar);
})();
