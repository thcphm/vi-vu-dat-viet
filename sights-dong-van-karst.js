'use strict';
(() => {
  const sights=window.VietnamSights??=[],A=window.CentralArch,K=window.VietnamKarst;
  const atlas=window.VietnamTourism.byId||new Map(window.VietnamTourism.entries.map(p=>[p.id,p]));
  const twinSource='https://quanba.tuyenquang.gov.vn/vi/tin-bai/nui-doi-co-tien-tuyet-tac-cua-su-kien-tao-noi-cao-nguyen-da-dong-van?id=179302&type=NEWS';
  const deckSource='https://www.tuyenquang.gov.vn/vi/post/bi-thu-tinh-uy-hau-a-lenh-khao-sat-quy-hoach-du-lich-tai-xa-quan-ba-va-thuan-hoa?id=217757&type=NEWS';
  const marketSource='https://lungcu.tuyenquang.gov.vn/vi/tin-bai/cho-huyen-dong-van-sac-mau-van-hoa-vung-cao?id=152845&type=NEWS';
  const cafeSource='https://baotuyenquang.com.vn/van-hoa/202309/ca-phe-pho-co-dong-van-diem-nhan-khong-gian-van-hoa-65339fe/';
  const stoneSource='https://dongvan.tuyenquang.gov.vn/vi/tin-bai/ban-do-khoanh-vung-bao-ve-14-cum-di-san-dia-chat-tren-dia-ban-huyen-dong-van?id=196483&type=NEWS';
  const caveSource='https://baotuyenquang.com.vn/van-hoa/du-lich/201512/khai-truong-dong-lung-khuy-quan-ba-du-khach-bat-ngo-truoc-ve-dep-cua-hang-dong-dep-nhat-cao-nguyen-da-684618/';
  const timber=0x664b38,tile=0x6b675e,stone=0x99968b,brick=0x987253,ochre=0xb39264;
  const tau=Math.PI*2;
  let grass;
  function meadow(T,group,batch){
    if(!grass){
      grass=new T.TextureLoader().load('streetscape/surfaces/meadow-color.webp');
      grass.colorSpace=T.SRGBColorSpace;grass.wrapS=grass.wrapT=T.RepeatWrapping;
      grass.anisotropy=4;grass.userData.sightShared=true;
    }
    batch.add(group,new T.MeshStandardMaterial({vertexColors:true,map:grass,roughness:1}));
    const g=group.children.at(-1).geometry,p=g.attributes.position,uv=[];
    for(let i=0;i<p.count;i++)uv.push((p.getX(i)+p.getY(i)*.45)/11,p.getZ(i)/11);
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));return g;
  }
  function register(catalogId,id,name,source,description,origin,size,views,build,details={}){
    const pin=atlas.get(catalogId);
    if(!pin)throw Error('Thiếu điểm Cao nguyên đá '+catalogId);
    const [east,south,yaw]=origin,c=Math.cos(yaw),s=Math.sin(yaw);
    sights.push({...pin,id,catalogId,name,source,photo:source,description,
      lon:pin.lon+east/(111320*Math.cos(pin.lat*Math.PI/180)),lat:pin.lat-south/110900,
      yaw,width:size[0],depth:size[1],solids:[],visitOnArrival:true,...details,
      views:views.map(([name,x,z,height,viewRadius,angle,viewElevation])=>({
        name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius,viewAngle:yaw+angle,viewElevation})),build});
  }
  // The public Quản Bạ visitor centre car park is w306034505. The footpath
  // w306034507 ends at n3108058417, SW of the dolomite hills across the fields.
  const deckParking=[104.99653,23.05827];
  function railing(T,k,points,y,color,closed,omit=-1){
    const n=closed?points.length:points.length-1;
    for(let i=0;i<n;i++){
      if(i===omit)continue;
      const [x,z]=points[i],[ex,ez]=points[(i+1)%points.length];
      const cuts=Math.max(1,Math.ceil(Math.hypot(ex-x,ez-z)/2.0));
      for(let j=0;j<=cuts;j++){
        const f=j/cuts;k.box(color,x+(ex-x)*f,y+.53,z+(ez-z)*f,.095,1.08,.095);
      }
      for(const h of [.46,1.04])A.strut(T,k,color,x,y+h,z,ex,y+h,ez,.050);
    }
  }
  function belvedere(T,k){
    const f=createTempleFoundations(T,k),rail=0x686c65,concrete=0xb9b6a8,red=0xa26958;
    k.palette({stone:[stone,concrete],metal:rail});
    const shape=Array.from({length:8},(_,i)=>[4.45*Math.sin((i+.5)*tau/8),4.45*Math.cos((i+.5)*tau/8)]);
    const anchor=f.building(0,0,0,9.8,9.5,()=>{
      k.box(stone,0,.20,0,10.0,.36,9.6);
      k.box(red,0,.42,0,9.83,.14,9.43);
      for(const [x,z] of shape)k.box(concrete,x*.90,1.78,z*.90,.36,2.65,.36);
      const oct=new T.CylinderGeometry(4.69,4.69,.33,8);oct.rotateY(tau/16);
      k.stamp(oct,concrete,0,3.13,0);oct.dispose();
      railing(T,k,shape,3.30,rail,true,7);
      railing(T,k,[[-4.77,4.56],[-4.77,-4.56],[4.77,-4.56],[4.77,4.56],[1.35,4.56]],.50,rail,false);
      k.box(stone,0,.20,10.29,2.45,.40,1.25);
      for(let i=0;i<15;i++){
        const y=.50+i*.194,z=10.0-i*.42;
        k.box(concrete,0,y-.105,z,1.44,.21,.45);
        if(i%4===2)k.box(stone,0,(y-.21)*.5,z,.76,y-.21,.34);
      }
      for(const x of [-.71,.71])A.strut(T,k,rail,x,1.53,10.0,x,4.23,4.12,.057);
    });
    f.stairs(anchor,2.48,4.75,2.48,8.70,1.96,.49,9);
  }
  // Rounded dolomite bosses at Nà Khoang. Aerial outlines separate the
  // two lobes. Terrarium elevation samples (AWS Open Data, z14) place their
  // crests ~124 m apart, 30–33 m above the surrounding cultivated land.
  function twinHills(T,k){
    const profile=K.batch(T),peaks=[[-44,-44,80,66,31.5],[44,44,78,70,32.0]];
    for(const [x,z,rx,rz,h] of peaks){
      profile.grid(76,26,(u,v)=>{
        const a=u*tau,spread=v*(1+.040*Math.cos(a*3)+.028*Math.sin(a*5+.38));
        const px=x+rx*Math.cos(a)*spread,pz=z+rz*Math.sin(a)*spread;
        const y=h*Math.max(0,Math.cos(v*Math.PI/2))**1.12;
        const variation=.96+.045*Math.cos(px*.21+Math.sin(pz*.15))+.032*Math.sin(px*.45+pz*.51);
        return [px,y,pz,v>.87?0x8ace87:0x78c898,variation];
      });
    }
    const g=meadow(T,k.group,profile),p=g.attributes.position;
    const rest=Float32Array.from({length:p.count},(_,i)=>p.getY(i)),stride=77*27;
    // Narrow crop plots bordering the SW foot of the first dome, following
    // the curves of the field bunds visible in the aerial view of Nà Khoang.
    const fields=K.batch(T);
    for(let i=0;i<7;i++){
      const edge=18+i*10;
      fields.grid(23,3,(u,v)=>{
        const x=-142+u*(104+i*2.1),z=edge+v*9.7+.0024*(x+74)**2+8*Math.sin(u*3+i*.08);
        return [x,.072,z,(i%3===0?0xa4b673:i%3===1?0xc6b980:0x83c46b),.98+.04*Math.cos(u*34)];
      });
    }
    const fieldGeometry=meadow(T,k.group,fields),fp=fieldGeometry.attributes.position;
    k.group.userData.fitGround=ground=>{
      let changed=false;
      const sampled=new Map();
      function grid(x,z){
        const key=x+','+z;
        if(!sampled.has(key))sampled.set(key,ground(x*8,z*8));return sampled.get(key);
      }
      function bed(x,z){
        x/=8;z/=8;const ix=Math.floor(x),iz=Math.floor(z),u=x-ix,v=z-iz;
        return (grid(ix,iz)*(1-u)+grid(ix+1,iz)*u)*(1-v)+(grid(ix,iz+1)*(1-u)+grid(ix+1,iz+1)*u)*v;
      }
      const bases=peaks.map(([x,z,rx,rz])=>{
        const samples=Array.from({length:12},(_,i)=>bed(x+rx*Math.cos(i*tau/12),z+rz*Math.sin(i*tau/12))).sort((a,b)=>a-b);
        return (samples[2]+samples[3])*.5;
      });
      for(let i=0;i<p.count;i++){
        const j=Math.floor(i/stride),local=bed(p.getX(i),p.getZ(i)),rise=rest[i];
        const y=Math.max(local+.055,bases[j]+rise);
        if(Math.abs(y-p.getY(i))>.002){p.setY(i,y);changed=true;}
      }
      if(changed){p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();g.computeBoundingBox();}
      let fieldsChanged=false;
      for(let i=0;i<fp.count;i++){
        const y=.27+bed(fp.getX(i),fp.getZ(i));
        if(Math.abs(y-fp.getY(i))>.002){fp.setY(i,y);fieldsChanged=true;}
      }
      if(fieldsChanged){fp.needsUpdate=true;fieldGeometry.computeVertexNormals();fieldGeometry.computeBoundingSphere();fieldGeometry.computeBoundingBox();}
    };
  }
  // Represent an entrance segment, not an inferred survey of the full cave.
  // w455517036 ends on the SE side of the rock face. Visitor photographs show
  // a square metal doorway, narrow threshold, flowstone and a raised walkway.
  function cavePoint(x,z){
    if(z>=-1.5)return [x,z];
    const d=-z-1.5,angle=Math.min(d/7,1.08),tail=Math.max(0,d-7*1.08);
    const c=Math.cos(angle),s=Math.sin(angle);
    return [-7*(1-c)-tail*s+x*c,-1.5-7*s-tail*c-x*s];
  }
  function lungKhuy(T,k){
    const b=K.batch(T),iron=0x61746b,limestone=0x929182;
    K.grotto(b,[[0,0,1.47,3.18,.12],[2,0,1.45,3.50,.12],[6,-.45,2.7,5.4,.10],
      [10,-.60,4.1,6.4,.05],[16,.35,4.8,7.2,0],[21,1.40,3.4,5.7,0],[25,2.20,2.1,3.9,.1]],8.5,7.2,1.9);
    k.palette({metal:iron,stone:limestone});
    for(const side of [-1,1]){
      k.box(limestone,side*1.48,1.67,.45,1.11,3.33,.62);
      k.box(iron,side*.95,1.46,.80,.117,2.90,.12);
      for(let row=0;row<11;row++)for(let j=0;j<3;j++){
        const w=.37,h=.294,x=side*(1.105+j*w),y=.19+row*.29+.028*Math.sin(j+row*2);
        const color=[0x9d9a88,0x888a80,0x9e9c90,0x909182][(row*3+j)%4];
        k.outline([[-w*.46,-h*.48],[w*.41,-h*.47],[w*.50,h*.20],[w*.26,h*.47],[-w*.46,h*.39]],
          color,x,y,.758,.046);
      }
    }
    k.box(limestone,0,3.13,.45,3.96,.67,.65);
    for(let y=2.58;y<2.91;y+=.09)k.box(iron,0,y,.81,1.92,.045,.10);
    A.plaque(T,k,'Lũng Khúy',0,3.36,.81,1.65,.36,{bg:'#68695f',fg:'#f7d06d',frame:false});
    A.plaque(T,k,'CAO NGUYÊN ĐỆ NHẤT ĐỘNG',0,3.05,.81,2.48,.23,{bg:'#68695f',fg:'#f7d06d',frame:false});
    for(const sign of [-1,1]){
      k.box(stone,sign*2.34,.48,1.60,.59,.16,1.46);
      for(const z of [1.15,2.05])k.box(stone,sign*2.34,.24,z,.36,.48,.21);
    }
    K.walkway(T,k,[[0,.62],[0,-4.5],[-1.25,-9.0],[-1.42,-13.2],[.25,-18.4],[1.1,-21]],1.16,.25,iron);
    for(let j=0;j<45;j++){
      const z=7+(j*.618034%1)*12.0,side=j%2?1:-1;
      const x=side*(2.2+1.0*Math.sin(j*1.9)**2),pendant=j%4!==0;
      const h=(pendant?1.15:.66)+2.15*(.25+.75*Math.sin(j*3.73)**2);
      const half=z<10?3.6:z<17?4.6:4.1;
      const ceiling=(z<12?6.4:6.9)*Math.sqrt(Math.max(.05,1-(x/half)**2));
      const radius=.18+.52*(.5+.5*Math.cos(j*5.23));
      b.grid(14,9,(u,v)=>{
        const a=u*tau,flute=1+.19*Math.cos(a*7+.3*j)+.075*Math.sin(a*3);
        const rad=radius*(.055+.945*(1-v)**1.32)*flute;
        return [x+rad*Math.cos(a)+v*.09*Math.sin(j),pendant?ceiling+.26-v*h:.05+v*h,
          -z+rad*.74*Math.sin(a),j%3?0xd0b383:0xbca57d,.88+.15*Math.sin(a+.6)];
      });
    }
    // Parallel pleats of flowstone descend from the wall on one side of
    // the interior bridge. The ceiling stays open over the visitors' path.
    for(let j=0;j<8;j++)b.grid(22,12,(u,v)=>{
      const z=-10.4-u*5.5-j*.13,wave=.20*Math.sin(u*19+j*.42)+.07*Math.cos(u*34);
      const x=2.48+j*.12+wave*(1-v*.45)+.53*v;
      const y=4.95+u*.56-v*(1.19+1.37*Math.sin(u*2.70+.51)**2+.29*Math.sin(u*25+j*.4));
      return [x,y,z,0xcfb48b,.68+.26*(.5+.5*Math.cos(u*19+j*.42))];
    });
    // Behind the threshold the short gallery turns across the contour. This
    // keeps the visitor-scale floor accessible on the rendered mountainside.
    K.finish(T,k,b,(ground,x,z)=>{
      const native=ground(x,z);
      if(z>-.9&&z<2.8&&Math.abs(x)<3.2)return Math.max(ground(-2.2,.5),ground(2.2,.5));
      return native;
    });
    const fit=k.group.userData.fitGround;
    let bent=false;
    k.group.userData.fitGround=ground=>{
      if(!bent){
        for(const part of k.group.children){
          if(part.isInstancedMesh){
            const m=part.instanceMatrix;
            for(let i=0;i<part.count;i++){
              const j=i*16+12,[x,z]=cavePoint(m.array[j],m.array[j+2]);
              m.array[j]=x;m.array[j+2]=z;
            }
            m.needsUpdate=true;continue;
          }
          const g=part.geometry,p=g?.attributes.position;
          if(!p||part.position.lengthSq()>0)continue;
          for(let i=0;i<p.count;i++){
            const [x,z]=cavePoint(p.getX(i),p.getZ(i));p.setX(i,x);p.setZ(i,z);
          }
          p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
        }
        bent=true;
      }
      fit(ground);
    };
  }
  // The protected Lũng Táo stone forest is mapped as cluster 18 by Đồng Văn.
  // Its karren are splintered fins with flutes and joints, separated by soil.
  function stoneForest(T,k){
    const b=K.batch(T);let seed=234157;
    const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    for(let i=0;i<52;i++){
      const x=(random()-.50)*35,z=(random()-.5)*33;
      if(Math.abs(x-3*Math.sin(z*.20))<2.5)continue;
      const angle=.26+(random()-.5)*1.14,rx=.65+random()*1.36,rz=1.12+random()*1.65,h=.88+random()*3.43;
      const blades=2+Math.floor(random()*3);
      for(let j=0;j<blades;j++){
        const phase=random()*tau,lean=(random()-.5)*1.52,side=(j-(blades-1)/2)*rx*.86;
        const height=h*(.46+.88*random()),ribs=5+Math.floor(random()*5),tip=.27+.4*random();
        b.grid(23,10,(u,v)=>{
          const a=u*tau,cut=.85+.12*Math.cos(a*ribs+phase+.46*v)+.14*Math.cos(3*a+phase);
          const r=(1-v*.99)**tip*cut;
          const px=side+.72*rx*r*Math.cos(a)+lean*v,pz=rz*r*Math.sin(a)+.40*v*v;
          const crown=.54*Math.sin(a*2+phase)+.28*Math.sin(a*4-phase);
          const y=-.35+height*v+v**3*crown*height*.22;
          const tint=v<.18+.11*Math.cos(a+phase)?0x74765e:0x999e9b;
          return [x+px*Math.cos(angle)+pz*Math.sin(angle),y,z-px*Math.sin(angle)+pz*Math.cos(angle),tint,.69+.25*cut+.13*v];
        });
      }
    }
    const earth=K.batch(T);
    earth.grid(50,36,(u,v)=>{
      const x=(u-.5)*35.7,z=(v-.5)*34.3,tread=Math.abs(x-3*Math.sin(z*.2));
      const margin=Math.min(u,v,1-u,1-v)*35+.68*Math.sin(x*.6+z*.33)+.32*Math.cos(z*.82);
      return [x,Math.min(.075,margin-1.52),z,tread<1.3?0xb89b72:0xa0a77b,.89+.09*Math.sin(x*3+.8*Math.sin(z))];
    });
    meadow(T,k.group,earth);
    for(let i=0;i<105;i++){
      const x=(random()-.50)*34,z=(random()-.50)*32;
      if(Math.abs(x-3*Math.sin(z*.20))>1.9)b.ferns.push([x,.04,z,random()*.40+.25,random()*tau]);
    }
    K.finish(T,k,b);
  }
  function lantern(T,k,x,y,z,r){
    const sphere=new T.SphereGeometry(1,12,8);
    k.stamp(sphere,0xb94137,x,y,z,r,r*.93,r);sphere.dispose();
    k.box(0xc7a05d,x,y+r,z,r*.46,.095,r*.46);
    k.box(0xc7a05d,x,y-r*.97,z,r*.37,.095,r*.37);
    k.box(0xa43e32,x,y-r*1.42,z,.035,r*.80,.035);
  }
  // Café Phố Cổ, mapped n4332478151, is on the north side of Nguyễn Trãi,
  // ~65 m SE of the atlas quarter pin. The open gallery surrounds its patio.
  function oldStreet(T,k){
    const f=createTempleFoundations(T,k),red=0x9a5946,sand=0xbca175;
    k.palette({timber,stone,brick:[brick,red],plaster:[ochre,sand],tile});
    const main=f.building(0,0,0,15.3,15.6,()=>{
      const left=-7.5,right=7.5,front=7.55;
      k.box(0x8e8172,0,.12,0,15.2,.24,15.5);
      for(const x of [-4.75,0,4.75]){
        A.vaultedBay(T,k,x,front-.22,4.77,3.47,x===0?1.65:1.42,1.5,.60,sand,brick,red);
        k.box(red,x-2.29,3.17,front+.12,.31,6.34,.39);
        k.box(red,x+2.29,3.17,front+.12,.31,6.34,.39);
        k.box(timber,x,3.58,front-.92,4.49,.20,2.30);
        for(let j=-4;j<=4;j++)k.box(timber,x+j*.45,4.10,front+.05,.075,.90,.10);
        k.box(timber,x,4.55,front+.05,4.55,.12,.14);
        k.box(ochre,x,4.91,front-1.95,4.85,2.88,.23);
        k.box(timber,x,4.78,front-1.78,1.88,2.20,.14);
        for(const dx of [-1.32,1.32])lantern(T,k,x+dx,5.89,front-.38,.24);
      }
      k.box(timber,0,6.42,front,15.32,.25,.33);
      A.gabledRoof(T,k,0,6.46,front-1.62,15.28,3.58,1.13,tile,0x777269,{alongX:true});
      A.plaque(T,k,'Cà phê Phố Cổ',0,3.58,front+.19,3.22,.52,{bg:'#866842',fg:'#e6c483',frame:false});
      for(const x of [left+1.44,right-1.44]){
        k.box(ochre,x+Math.sign(x)*1.44,3.07,-1.1,.28,6.08,12.62);
        k.box(timber,x,3.19,-1.10,3.00,.24,12.54);
        const gallery=x-Math.sign(x)*1.39;
        for(let j=0;j<6;j++){
          const z=-6.62+j*2.28;
          k.box(timber,gallery,3.05,z,.155,5.95,.155);
          lantern(T,k,gallery,5.37,z,.245);
        }
        k.box(timber,gallery,4.13,-1.15,.12,.13,12.55);
        for(let j=0;j<28;j++)k.box(timber,gallery,3.68,-7.13+j*.44,.071,.85,.071);
        A.gabledRoof(T,k,x,6.10,-1.12,3.21,12.7,1.24,tile,0x767269);
      }
      k.box(ochre,0,2.89,-7.58,9.2,5.72,.32);
      for(const x of [-3.28,-1.65,0,1.65,3.28]){
        k.box(timber,x,1.50,-7.37,1.23,2.65,.15);
        k.box(0x7e664c,x,4.57,-7.37,1.13,1.72,.15);
        for(let j=-2;j<=2;j++)k.box(timber,x+j*.20,4.62,-7.27,.061,1.47,.07);
      }
      k.box(timber,0,3.21,-6.15,9.30,.22,2.90);
      for(let i=-2;i<=2;i++)k.box(timber,i*2.12,3.0,-4.87,.16,5.88,.16);
      k.box(timber,0,4.10,-4.87,9.18,.14,.13);
      for(let i=-10;i<=10;i++)k.box(timber,i*.42,3.68,-4.87,.065,.84,.08);
      A.gabledRoof(T,k,0,5.92,-6.24,9.20,3.27,1.08,tile,0x777269,{alongX:true});
      for(const [x,z] of [[-2.55,-2.77],[2.4,-2.7],[-2.59,.18],[2.50,.24]]){
        k.box(timber,x,1.00,z,.93,.095,.68);
        for(const s of [-1,1]){
          k.box(timber,x+s*.35,.59,z,.09,.79,.45);
          k.box(0x9f7b53,x,.52,z+s*.72,.73,.095,.38);
          for(const dx of [-.26,.26])k.box(timber,x+dx,.36,z+s*.72,.08,.31,.29);
        }
      }
    });
    // The front arcade opens on the street at grade. The steep hillside at
    // the rear must not elevate the arcade above its public entrance.
    main.elevation=ground=>Math.max(ground(-6,4.2),ground(6,4.2),ground(-4.7,-5.0),ground(4.7,-5.0));
    f.stairs(main,0,7.75,0,11.29,3.12,.22,9);
    // The lower, joined shop fronts continue along the same public street.
    for(const [x,w,wall,eave] of [[-11.2,6.4,0xad9371,4.0],[11.4,7.2,0xc0a579,4.35],[18.9,7.6,0xb5986d,3.87]]){
      f.building(x,1.45,0,w,11.8,()=>{
        k.box(wall,0,eave*.5,0,w,eave,11.5);
        for(let i=-1;i<=1;i++){
          k.box(timber,i*w*.26,eave*.39,5.80,w*.22,eave*.68,.17);
          k.box(0x81633e,i*w*.26,eave*.75,5.90,w*.22,.20,.15);
        }
        A.gabledRoof(T,k,0,eave,0,w,11.55,2.12,tile,0x716e61,{alongX:true,overhang:.25});
      });
    }
  }
  // Actual market buildings, not the bounding polygon w854829776: the two
  // aisles are interrupted by passages. The transverse hall closes the north.
  const halls=[[-9.24,18.88,8.4,15.7], [15.39,18.01,8.4,14.7],
    [-9.76,-3.09,7.7,21.5],[14.76,-3.30,8.6,21.5],[2.95,-23.55,9.9,34.3]];
  function stoneMarket(T,k){
    const f=createTempleFoundations(T,k),column=0x8d8475,trim=0xaf9676;
    k.palette({stone:[stone,column],brick:[brick,trim],timber,tile});
    for(const [i,[x,z,w,d]] of halls.entries()){
      const yaw=i===4?Math.PI/2:0;
      f.building(x,z,yaw,w,d,()=>{
        k.box(stone,0,.22,0,w+.26,.44,d+.28);
        const eave=3.90,bays=d>28?7:d>17?5:3;
        for(let j=0;j<=bays;j++)for(const side of [-1,1]){
          const px=side*(w/2-.38),pz=-d/2+.34+(d-.68)*j/bays;
          k.box(column,px,1.97,pz,.72,3.10,.72);
          k.box(stone,px,.56,pz,.91,.30,.91);
          k.box(trim,px,3.57,pz,.92,.30,.91);
          for(let h=.83;h<3.26;h+=.53)k.box(0x786f62,px,h,pz,.728,.029,.728);
        }
        for(const side of [-1,1]){
          k.box(timber,side*(w/2-.38),3.82,0,.34,.31,d);
          // The end gables have a broad central arch flush with the stone piers.
          A.vaultedBay(T,k,0,side*(d/2-.29),w,3.84,w*.291,1.52,.52,brick,trim,column);
          k.outline([[-w/2,0],[w/2,0],[0,2.08]],brick,0,3.82,side*(d/2-.29)-.24,.48);
          k.box(timber,0,3.89,side*(d/2-.29),w,.23,.64);
        }
        A.gabledRoof(T,k,0,eave,0,w,d,2.06,tile,0x70685b,{overhang:.38});
        const run=d/bays;
        for(let j=1;j<bays;j++){
          const pz=(j-bays*.5)*run;
          k.box(timber,0,3.66,pz,w-.63,.21,.18);
          for(const side of [-1,1])A.strut(T,k,timber,side*(w*.5-.44),3.81,pz,0,5.68,pz,.095);
        }
      });
    }
    // Lay the flagstones on the open court's local relief independently of
    // the five level market buildings, including its cross-passages.
    const paving=K.batch(T);
    const length=52,depth=1.04,width=1.63,x0=-4.25,x1=9.25;
    for(let j=0;j<length/depth;j++){
      const z=-25.3+j*depth;
      for(let left=x0-(j%2)*width*.5;left<x1;left+=width){
        const a=Math.max(x0,left),end=Math.min(x1,left+width);
        if(end-a<.08)continue;
        const tint=[0x96958b,0x99958b,0x918e83,0x99988d][(Math.abs(Math.floor((left-x0)/width))*3+j)%4];
        paving.grid(1,1,(u,v)=>[a+.012+u*(end-a-.024),.15,z+.012+v*(depth-.024),tint]);
      }
    }
    paving.add(k.group,new T.MeshStandardMaterial({vertexColors:true,roughness:1}));
    const g=k.group.children.at(-1).geometry,p=g.attributes.position,fit=k.group.userData.fitGround;
    k.group.userData.fitGround=ground=>{
      fit(ground);let changed=false;
      for(let i=0;i<p.count;i++){
        const y=ground(p.getX(i),p.getZ(i))+.17;
        if(Math.abs(p.getY(i)-y)>.002){p.setY(i,y);changed=true;}
      }
      if(changed){p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();g.computeBoundingBox();}
    };
  }
  const townStart=[105.36137,23.27813]; // junction on Đường 19 Tháng 8
  register('osm-node-3108058417','dai-ngam-nui-doi-quan-ba','Đài ngắm Núi Đôi Quản Bạ',deckSource,
    'Từ Trạm thông tin du lịch, lối bậc dẫn lên đài ngắm phía trên thung lũng Tam Sơn. Đứng trên sàn cao có thể nhìn qua ruộng về hai chóp núi Đôlômit ở Nà Khoang.',
    [0,0,-1.12],[12,17],[['Hai tầng sàn nhìn từ lối lên',0,0,4.6,19,.53,.24],
      ['Phóng tầm mắt về hai gò Nà Khoang',-389,-622,28,738,.56,.167]],belvedere,
    {start:deckParking,approachMeters:undefined,arrivalNote:'Xe dừng tại bãi của Trạm thông tin. Đi bộ theo lối bậc đến đài ngắm.'});
  register('osm-node-4427121492','nui-doi-quan-ba','Núi Đôi Quản Bạ',twinSource,
    'Hai chóp Đôlômit phủ cây nhô lên khỏi ruộng ở Nà Khoang. Từ đài trên sườn núi phía tây nam, có thể thấy rõ khoảng lõm giữa hai đỉnh và con đường chạy sát chân gò phía bắc.',
    [36,-43,0],[274,245],[['Hai ngọn nhìn từ phía đài ngắm',0,0,34,288,-.76,.21],
      ['Khoảnh ruộng bên chân núi',-15,8,41,260,-.66,.49]],twinHills,
    {start:deckParking,approachMeters:undefined,viewDistance:1500,gardenRadius:80,arrivalNote:'Xe dừng ở Trạm thông tin Quản Bạ. Đài ngắm trên đường bộ dẫn lên từ bãi xe nhìn được cả hai ngọn.'});
  register('osm-node-4518601444','dong-lung-khuy','Động Lùng Khúy',caveSource,
    'Qua cánh cửa hẹp trên sườn núi, lối có tay vịn đưa khách vào khoang đá mở rộng. Cảnh trong động tái hiện một đoạn lối tham quan với những dải nhũ buông xuống sát sàn cầu.',
    [0,0,.76],[18,35],[['Cửa động cuối đường bậc',0,0,4.1,10.0,.17,.12],
      ['Nhũ đá bên lối đi trong khoang',...cavePoint(-.42,-17),5.65,4.9,1.10,.075]],lungKhuy,
    {start:[105.02173,23.07772],approachMeters:undefined,arrivalNote:'Xe dừng ở bãi trên đường vào thôn Lùng Khúy. Theo đường bộ, rồi leo bậc qua nhà vé tới cửa động.'});
  register('osm-node-7975480069','rung-da-lung-tao','Rừng đá Lũng Táo',stoneSource,
    'Giữa những khoảnh đất canh tác là các cụm đá vôi xám. Mưa khoét mặt đá thành rãnh chạy từ mũi nhọn xuống chân, để lại những sống đá tai mèo dựng ngay bên nhau.',
    [0,0,.22],[36,34],[['Những sống đá bên nương',0,0,4.2,34,.77,.22],
      ['Theo rãnh xẻ trên đá tai mèo',-5,-2,4.0,10,-.47,.11]],stoneForest,
    {arrivalNote:'Điểm đến ở sườn nương. Xe dừng trên đường qua Lũng Táo để xem các cụm đá bên đường.'});
  register('osm-node-7961606192','pho-co-dong-van','Phố cổ Đồng Văn',cafeSource,
    'Dọc phố Nguyễn Trãi dưới chân núi là các nhà mái ngói, cửa gỗ. Ngôi nhà hai tầng của Cà phê Phố Cổ có ba vòm ở mặt tiền, hành lang gỗ và một sân trời nằm giữa các dãy nhà.',
    [55.0,33.7,.034],[38,16],[['Mặt nhà cổ trên phố Nguyễn Trãi',0,4.75,7.4,16,-.24,.15],
      ['Hành lang và sân trời',-.3,-3.0,5.8,7.8,.15,.13]],oldStreet,
    {solids:[[0,0,7.6,7.8],[-11.2,1.45,3.2,5.9],[11.4,1.45,3.6,5.9],[18.9,1.45,3.8,5.9]],gardenRadius:9,start:townStart,
      approachMeters:undefined,arrivalNote:'Xe dừng phía đường 19 Tháng 8. Từ sân chợ đi bộ lên phố Nguyễn Trãi.'});
  register('osm-way-854829776','cho-co-dong-van','Chợ cổ Đồng Văn',marketSource,
    'Hai dãy chợ dọc có lối cắt ngang, nối thị giác với nếp nhà ngang ở đầu phía bắc thành mặt bằng chữ U. Các cột đá ghép khối đỡ kết cấu gỗ, mái sẫm và những vòm gạch mở ra sân.',
    [-5.8,-24.3,.23],[38,63],[['Mặt bằng chữ U mở ra sân',2.4,-1,7.0,62,.08,.42],
      ['Hàng cột ghép đá và cửa vòm',-8,13.1,4.7,14.5,.54,.15]],stoneMarket,
    {modeledBuildings:['w853584098','w853584099','w853584100','w853584101','w853584102'],
      solids:halls.map(([x,z,w,d],i)=>[x,z,(i===4?d:w)*.50,(i===4?w:d)*.50]),
      gardenRadius:14,start:townStart,approachMeters:undefined,arrivalNote:'Từ đường 19 Tháng 8, đi bộ vào sân chợ cổ. Gian ngang nằm ở đầu sân phía phố Nguyễn Trãi.'});
})();
