'use strict';
(() => {
  const stops=window.VietnamSights??=[];
  const atlas=window.VietnamTourism.byId||new Map(window.VietnamTourism.entries.map(v=>[v.id,v]));
  const yellow=0xdca644, ochre=0xbb8534, moulding=0xf0c567, shadow=0x986d39;
  const glazing=0x475854, sash=0x685e44, tile=0x98563c;

  function rod(T,k,tint,a,b,radius){
    const from=new T.Vector3(...a),to=new T.Vector3(...b),axis=to.clone().sub(from);
    const tube=new T.CylinderGeometry(radius,radius,axis.length(),6);
    tube.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),axis.normalize()));
    const mid=from.lerp(to,.5);k.stamp(tube,tint,mid.x,mid.y,mid.z);tube.dispose();
  }
  function hip(T,k,x,y,w,d,h){
    const a=w/2,b=d/2,r=Math.max(0,(w-d)/2),s=Math.max(0,(d-w)/2);
    const corners=[[-a,0,b],[a,0,b],[a,0,-b],[-a,0,-b]];
    const ridge=r>0?[[-r,h,0],[r,h,0],[r,h,0],[-r,h,0]]:[[0,h,s],[0,h,s],[0,h,-s],[0,h,-s]];
    const points=[];
    for(let i=0;i<4;i++){
      const j=(i+1)%4;
      points.push(...corners[i],...corners[j],...ridge[i]);
      if(ridge[i][0]!==ridge[j][0]||ridge[i][2]!==ridge[j][2])points.push(...corners[j],...ridge[j],...ridge[i]);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.computeVertexNormals();
    k.stamp(g,tile,x,y,0);g.dispose();
  }
  function glazedArch(T,k,x,y,z,w,h){
    const r=w/2,sy=h-r;
    function opening(rad,base){
      const shape=new T.Shape();shape.moveTo(-rad,base);shape.lineTo(rad,base);
      shape.lineTo(rad,sy);shape.absarc(0,sy,rad,0,Math.PI,false);shape.closePath();return shape;
    }
    k.profile(opening(r+.17,-.12),moulding,x,y,z,.15);
    k.profile(opening(r,0),sash,x,y,z+.15,.045);
    k.profile(opening(r-.10,.10),glazing,x,y,z+.20,.035);
    const front=z+.26;
    k.box(sash,x,y+sy/2,front,.09,sy,.05);
    for(const dy of [.18,sy*.53,sy])k.box(sash,x,y+dy,front,w,.08,.05);
    for(let n=1;n<=3;n++){
      const a=n*Math.PI/4;
      rod(T,k,sash,[x,y+sy,front],[x+(r-.1)*Math.cos(a),y+sy+(r-.1)*Math.sin(a),front],.036);
    }
    k.box(moulding,x,y-.12,z+.16,w+.54,.17,.38);
    k.box(moulding,x,y+h+.08,z+.13,.34,.30,.28);
  }
  function balustrade(k,x,y,z,width){
    k.box(ochre,x,y+.09,z,width,.18,.38);
    k.box(moulding,x,y+.94,z,width+.24,.17,.45);
    const count=Math.ceil(width/.62);
    for(let i=0;i<=count;i++){
      const px=x-width/2+.16+(width-.32)*i/count;
      k.stamp(k.round,ochre,px,y+.47,z,.12,.68,.12);
      k.stamp(k.round,moulding,px,y+.43,z,.17,.31,.17);
    }
  }
  function palace(T,k){
    k.palette({plaster:[yellow,ochre,moulding,shadow],tile,timber:sash});
    const body=(x,w,d,upper)=>{
      k.box(yellow,x,upper/2,0,w,upper,d);
      k.box(ochre,x,1.25,0,w+.28,2.5,d+.28);
      for(const h of [.44,2.55,8.12,14.55,upper-.48,upper]){
        k.box(ochre,x,h+.04,0,w+.28,.26,d+.28);
        k.box(moulding,x,h+.21,0,w+.65,.16,d+.65);
      }
      hip(T,k,x,upper+.36,w+.72,d+.72,2.85);
    };
    body(0,22.0,20.6,16.3);
    for(let i=-2;i<=2;i++){
      const x=i*4.1;
      glazedArch(T,k,x,3.09,10.35,2.65,4.02);
      glazedArch(T,k,x,9.0,10.35,2.55,4.38);
    }
    balustrade(k,0,14.82,10.45,20.3);
    k.box(moulding,0,15.83,10.52,3.3,.43,.55);
    k.stamp(k.round,0xb14834,0,15.88,10.86,.56,.17,.56,0,Math.PI/2);
    k.stamp(k.round,ochre,0,17.98,10.40,.072,5.4,.072);
    k.wavingFlag(1.8,1.12,0,20.42,10.42);
    for(const side of [-1,1]){
      const x=side*15.95;body(x,11.0,33.05,18.5);
      for(const end of [-1,1]){
        const z=end*16.55;
        k.place(x,z,end===1?0:Math.PI,()=>{
          glazedArch(T,k,0,3.0,.025,2.72,4.25);
          glazedArch(T,k,0,9.26,.025,2.90,4.18);
          for(const sign of [-1,1]){
            k.box(moulding,sign*3.85,9.25,.11,.40,12.7,.23);
            k.box(ochre,sign*3.85,2.8,.17,.70,.34,.34);
            k.box(moulding,sign*3.85,15.41,.17,.77,.35,.35);
          }
          balustrade(k,0,8.09,.29,4.55);
          k.box(ochre,0,14.48,.19,4.7,.29,.50);
          k.outline([[-2.25,0],[0,.93],[2.25,0]],moulding,0,14.61,.06,.36);
          // The attic panels on the projecting bays contain a round cartouche.
          k.box(ochre,0,16.68,.05,3.5,1.86,.14);
          k.box(yellow,0,16.68,.14,3.2,1.62,.09);
          k.stamp(k.round,moulding,0,16.73,.25,.56,.15,.56,0,Math.PI/2);
          k.stamp(k.round,ochre,0,16.73,.36,.41,.07,.41,0,Math.PI/2);
          for(const sign of [-1,1])for(let row=0;row<19;row++){
            k.box(ochre,sign*5.06,2.97+row*.70,.09,.76,.13,.16);
          }
          for(let i=0;i<19;i++)k.box(moulding,(i-9)*.55,18.08,.17,.18,.23,.23);
        });
      }
      k.place(side*21.48,0,side*Math.PI/2,()=>{
        for(const px of [-11.7,-6.0,0,6.0,11.7]){
          glazedArch(T,k,px,3.16,0,2.30,3.80);
          k.box(moulding,px,10.86,.12,2.47,4.42,.23);
          k.box(glazing,px,10.86,.28,2.10,4.06,.12);
          k.box(sash,px,10.86,.37,.11,4.12,.08);
          k.box(moulding,px,13.17,.21,2.83,.21,.46);
          k.box(ochre,px,16.34,.05,1.55,1.73,.16);
          k.box(glazing,px,16.34,.16,1.16,1.37,.06);
          if(Math.abs(px)===6){
            k.box(ochre,px,8.60,.40,3.12,.23,.82);
            balustrade(k,px,8.68,.75,2.9);
            for(const sign of [-1,1])k.outline([[-.14,0],[.14,0],[0,-.57]],moulding,px+sign*1.10,8.54,.20,.47);
            k.outline([[-1.39,0],[0,.56],[1.39,0]],moulding,px,13.25,.12,.28);
          }
        }
      });
    }
    for(let i=0;i<12;i++)k.box(ochre,0,(12-i)*.101,10.59+i*.37,9.7,(12-i)*.202,.39);
  }

  const marble=0xf0ece0,edge=0xdad6c9,gilt=0xd7a435,gold=0xefc367,bronze=0xa77828;
  // Each ivory face ends at the silhouette of a swept roof. Its gilded
  // reveals converge on an open arch; the same treatment returns on all sides.
  function niche(T,k){
    const half=3.55;
    const mouth=[[2.79,1.4],[2.79,2.05],[2.07,2.05],[2.07,5.23],
      [2.57,5.72],[2.98,6.36],[3.06,6.89],[2.63,6.77],[2.01,7.09],
      [1.61,7.40],[1.40,8.52],[1.57,8.86]];
    const aperture=[[1.54,1.4],[1.54,2.05],[1.46,2.05],[1.46,5.23],
      [1.39,5.33],[1.30,5.39],[1.22,5.45],[1.13,5.53],[.95,5.61],
      [.79,5.68],[.62,5.72],[.49,5.76]];
    const mirror=points=>[...points,...points.slice().reverse().map(([x,y])=>[-x,y])];
    const outer=mirror(mouth),inner=mirror(aperture),z=3.55,back=2.01;
    k.outline([[half,1.4],...outer,[-half,1.4],[-half,11.89],[half,11.89]],marble,0,0,z-.25,.25);
    for(let y=2.38;y<11.85;y+=.96){
      // Stop each stone joint at the cut edge of the roof silhouette.
      const cuts=[];
      for(let i=1;i<mouth.length;i++){
        const [ax,ay]=mouth[i-1],[bx,by]=mouth[i];
        if(y>=Math.min(ay,by)&&y<Math.max(ay,by))cuts.push(ax+(bx-ax)*(y-ay)/(by-ay));
      }
      const start=cuts.length?Math.max(...cuts):0;
      for(const sign of [-1,1])k.box(edge,sign*(half+start)/2,y,z+.009,half-start,.025,.017);
    }
    const triangles=[];
    for(let i=0;i<outer.length-1;i++){
      const a=[...outer[i],z-.005],b=[...outer[i+1],z-.005],c=[...inner[i+1],back],d=[...inner[i],back];
      triangles.push(...a,...b,...c,...a,...c,...d);
      if(i%2===0)rod(T,k,gold,a,d,.035);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(triangles,3));g.computeVertexNormals();k.stamp(g,gilt,0,0,0);g.dispose();
    const arch=new T.Shape();arch.moveTo(-2.05,1.4);arch.lineTo(-1.46,1.4);arch.lineTo(-1.46,5.20);
    arch.quadraticCurveTo(0,6.22,1.46,5.20);arch.lineTo(1.46,1.4);
    arch.lineTo(2.05,1.4);arch.lineTo(2.05,6.13);arch.lineTo(-2.05,6.13);arch.closePath();
    k.profile(arch,bronze,0,0,back-.38,.38);
    for(let s of [-1,1])k.box(gold,s*1.505,3.39,back,.092,3.78,.09);
    for(let i=0;i<=8;i++){
      const x=(i-4)*.31,y=5.77-.26*(x/1.46)**2;
      k.stamp(k.round,gold,x,y,back+.05,.10,.065,.10,0,Math.PI/2);
    }
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6,c=Math.cos(a),s=Math.sin(a);
      rod(T,k,gold,[c*.18,6.60+s*.17,2.47+s*.085],[c*.48,6.60+s*.41,2.47+s*.205],.035);
    }
    k.stamp(k.round,gold,0,6.60,2.47,.19,.07,.19,0,Math.PI/2+.42);
  }
  function memorial(T,k){
    k.palette({stone:[marble,edge,0x655b54,0x777169]});
    const base=1.4;
    for(let i=0;i<7;i++){
      const w=21.1-i*.74;
      k.box(i%2?0x777169:0x655b54,0,(i+1)*.10,0,w,(i+1)*.20,w);
    }
    k.box(edge,0,base-.08,0,10.1,.16,10.1);
    for(const end of [-1,1])k.place(0,0,end===1?0:Math.PI,()=>{
      for(const side of [-1,1]){
        for(let i=0;i<9;i++)k.box(marble,side*10.13,.28+i*.056,10.17-i*.41,.65,.56+i*.112,.47);
        for(const [x,z,h] of [[10.13,10.2,2.05],[10.13,6.65,1.94],[7.27,5.75,1.70]]){
          k.box(edge,side*x,h/2,z,.94,h,.94);
          k.box(marble,side*x,h-.06,z,1.02,.13,1.02);
          k.box(0xf4e7b9,side*x,h+.20,z,.53,.49,.53);
          for(const dx of [-.26,.26])for(const dz of [-.26,.26])k.box(gilt,side*x+dx,h+.20,z+dz,.045,.49,.045);
          k.box(gilt,side*x,h+.46,z,.65,.10,.65);
        }
      }
    });
    for(let i=0;i<4;i++)k.place(0,0,i*Math.PI/2,()=>niche(T,k));
    k.box(marble,0,12.19,0,6.49,.82,6.49);
    k.box(edge,0,11.69,0,7.10,.41,7.10);
    for(const x of [-3.38,3.38])for(const z of [-3.38,3.38])k.box(edge,x,6.34,z,.33,9.88,.33);
    const bowl=new T.SphereGeometry(1,12,6,0,Math.PI*2,-.04,Math.PI*.92);
    k.stamp(k.round,bronze,0,1.54,0,.56,.23,.56);
    k.stamp(k.round,bronze,0,1.93,0,.28,.64,.28);
    k.stamp(bowl,gilt,0,2.26,0,.69,.44,.69);bowl.dispose();
    k.stamp(k.round,gold,0,2.62,0,.71,.13,.71);
    for(const side of [-1,1]){
      const loop=new T.TorusGeometry(.28,.064,6,10,1.72*Math.PI);
      k.stamp(loop,gilt,side*.67,2.7,0,1,1,1,0,0,.29*side);loop.dispose();
    }
  }

  const palaceSource='https://baochinhphu.vn/kiet-tac-di-san-kien-truc-dong-duong-102149609.htm';
  // Public elevations: gallery photo 10591341 (palace), and Đoàn Đức's
  // photograph in the National Institute of Architecture article below.
  const memorialPhoto='https://vienkientrucquocgia.gov.vn/nhin-lai-hinh-thuc-kien-truc-ha-noi-nhung-chang-duong-sang-tac/';
  const renovation='https://nguyentandung.chinhphu.vn/Home/Cai-tao-nang-cap-Dai-tuong-niem-cac-Anh-hung-liet-sy-tai-duong-Bac-Son/20133/18213.vgp';
  function add(catalogId,id,name,width,depth,yaw,source,photo,description,ref,views,draw){
    const original=atlas.get(catalogId);
    stops.push({...original,id,catalogId,name,width,depth,yaw,source,photo,description,
      approachMeters:undefined,modeledBuildings:[ref],solids:[[0,0,width*.48,depth*.48]],visitOnArrival:true,
      views:views.map(([name,offset,height,viewRadius,viewAngle,viewElevation])=>({name,offset,height,viewRadius,viewAngle,viewElevation})),
      build(T,k){createTempleFoundations(T,k).building(0,0,0,width,depth,()=>draw(T,k));}});
  }
  add('osm-way-37629570','phu-chu-tich-ha-noi','Phủ Chủ tịch',43,33.05,1.39,palaceSource,palaceSource,
    'Hai khối nhà nhô ra hai đầu mặt tiền sơn vàng. Ở giữa là hai tầng cửa vòm, hàng con tiện và cột cờ trên mái.', 'w37629570',
    [['Mặt tiền nhìn từ sân', [0,0],16.8,64,.76,.16],['Hai tầng cửa vòm',[9,1.7],19.5,48,1.43,.10]],palace);
  add('osm-relation-17877970','dai-tuong-niem-bac-son','Đài tưởng niệm các Anh hùng liệt sĩ đường Bắc Sơn',21.1,21.1,1.39,renovation,memorialPhoto,
    'Bốn mặt đá trắng ngà đều khoét lõm theo dáng mái đình. Những mặt đồng mạ vàng trong hốc mái nghiêng sâu vào khoảng trống ở giữa đài.', 'w1582902357',
    [['Từ sân đường Bắc Sơn',[0,0],10.0,34,1.37,.09],['Lòng mái đình mạ vàng',[0,0],11.5,22,1.13,.10]],memorial);
})();
