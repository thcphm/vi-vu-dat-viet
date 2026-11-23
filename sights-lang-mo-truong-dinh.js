'use strict';
(() => {
  // Reconciled 2026-11-22. Separate urban shrine at 1 Phan Đình Phùng,
  // Google place ChIJq_UnDCtOdTERBUDkTYdKEfo. The road junction with the
  // bronze monument (OSM n10608268024) is about 120 m from the grave itself.
  // The wedge between Nguyễn Huệ and OSM w303896246 contains an east-facing
  // hall and rectangular open-air burial enclosure. Eaves and court alignment
  // checked against overhead imagery and the photographer's axis in:
  // https://dongthap.gov.vn/web/cong-thong-tin-dtp/tin-tuc/chi-tiet?id=10570971
  // https://dongthap.gov.vn/web/cong-thong-tin-dtp/tin-tuc/chi-tiet?id=10553121
  // Official inventory gives 16.5 x 13.2 x 10 m for the 1973 hall, describes the
  // two sheltered stelae and the 1930–31 enclosure. Earlier Wikimedia photo
  // https://commons.wikimedia.org/?curid=5945033 shows an earlier paint scheme.
  // Channel profile of the mound, incised foliage and lotus bowl:
  // https://www.traveloka.com/vi-vn/explore/destination/gns-du-lich-go-cong-1-ngay/304088
  // Gate couplet transcription: https://baocantho.com.vn/ve-go-cong-vieng-anh-linh-truong-dinh-a20937.html
  // Street gate and the separate statue are seen at 1:34 and 1:29 respectively:
  // https://www.voatiengviet.com/a/ve-go-cong-vieng-lang-truong-dinh/7260511.html
  // Locations of individual monuments/camera targets are approximate. All
  // meshwork, lettering and foliage below are drawn independently.
  const id='lang-mo-truong-dinh-go-cong',catalogId='dong-thap-lang-mo-truong-dinh';
  const pin=window.VietnamTourism.entries.find(s=>s.id===catalogId);
  if(!pin)throw Error('Missing Trương Định tomb catalog entry');
  const source='https://dsvh.gov.vn/di-tich-khoi-nghia-truong-dinh-tinh-tien-giang-22181';
  const photo='https://dongthap.gov.vn/web/cong-thong-tin-dtp/tin-tuc/chi-tiet?id=10570971';
  const yaw=1.8343,cs=Math.cos(yaw),sn=Math.sin(yaw),sides=[-1,1],A=window.CentralArch;
  const ivory=0xe3c792,cream=0xefe0b6,clay=0xc66f53,cap=0xb09774,shadow=0x514942;
  const basalt=0x777b74,stone=0x969b94,edge=0xaeb1a8,charcoal=0x515655,marble=0xc7c6b7;
  const green=0x588347,trunk=0x776d58,scarlet=0x993b2d;
  function line(T,k,col,points,r,n=6){
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const geo=new T.TubeGeometry(curve,Math.max(points.length*2,4),r,n,false);
    k.stamp(geo,col,0,0,0);geo.dispose();
  }
  function cyl(k,col,x,y,z,r,h){k.stamp(k.round,col,x,y,z,r,h,r);}
  function panel(T,k,x,y,z,w,h,paint,wpx=600,hpx=180){
    const canvas=document.createElement('canvas');canvas.width=wpx;canvas.height=hpx;
    paint(canvas.getContext('2d'),wpx,hpx);
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
    const material=new T.MeshStandardMaterial({map,transparent:true,alphaTest:.24,roughness:.92});
    const mesh=new T.Mesh(new T.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);k.group.add(mesh);
  }
  function board(T,k,x,y,z,w,h,rows){
    panel(T,k,x,y,z,w,h,(g,W,H)=>{
      g.fillStyle='#563c36';g.fillRect(0,0,W,H);g.strokeStyle='#c9a867';g.lineWidth=5;g.strokeRect(4,4,W-8,H-8);
      g.textAlign='center';g.textBaseline='middle';g.fillStyle='#eed08d';
      rows.forEach(([label,size],i)=>{g.font='bold '+Math.round(size*H)+'px Georgia,serif';g.fillText(label,W/2,H*(i+.53)/rows.length,W*.93);});
    },768,rows.length===2?132:100);
  }
  function rafters(T,k,w,d,base,rise,upperW,upperD,top){
    // Shallow clay skirt and, above the clerestory, a separate four-pitch cap.
    const hw=w/2,hd=d/2,uw=upperW/2,ud=upperD/2,geoPts=[];
    const lerp=(a,b,t)=>a+(b-a)*t;
    function at(s,x,z,a){
      const xx=lerp(hw,uw,a)*x,zz=lerp(hd,ud,a)*z;
      const lip=.12*(1-a)*Math.pow(Math.min(Math.abs(x),Math.abs(z)),6);
      return [xx,base+rise*(.84*a+.16*a*a)+lip+s,zz];
    }
    function quad(a,b,c,d){geoPts.push(...a,...b,...c,...a,...c,...d);}
    const corners=[[-1,1],[1,1],[1,-1],[-1,-1]];
    const material=[clay,0xbd674e,0xcd7c5c];
    const rib=new T.CylinderGeometry(1,1,1,5),unit=new T.Vector3(0,1,0);
    function ribbing(a,b,tint,r){
      const v=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),len=v.length();
      if(len<.075)return;
      const e=new T.Euler().setFromQuaternion(new T.Quaternion().setFromUnitVectors(unit,v.multiplyScalar(1/len)),'YXZ');
      k.stamp(rib,tint,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,r,len,r,e.y,e.x,e.z);
    }
    for(let j=0;j<4;j++){
      const a=corners[j],b=corners[(j+1)%4],count=Math.ceil((j%2?d:w)/.25);
      for(let i=0;i<count;i++){
        const u=i/count,v=(i+1)/count,ua=lerp(a[0],b[0],u),va=lerp(a[1],b[1],u),ub=lerp(a[0],b[0],v),vb=lerp(a[1],b[1],v);
        const ao=at(0,ua,va,0),bo=at(0,ub,vb,0),ai=at(0,ua,va,1),bi=at(0,ub,vb,1);
        quad(ao,bo,bi,ai);quad(bo,ao,at(-.12,ua,va,0),at(-.12,ub,vb,0));
        ribbing(at(.017,ua,va,0),at(.017,ua,va,1),material[(i+2*j)%3],.043);
      }
      ribbing(at(.04,a[0],a[1],0),at(.04,a[0],a[1],1),cap,.090);
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(geoPts,3));geo.computeVertexNormals();k.stamp(geo,clay,0,0,0);geo.dispose();rib.dispose();
    if(top)k.box(cap,0,base+rise+.055,0,.17,.14,upperD+.13);
  }
  function longevity(T,k,x,z){
    panel(T,k,x,2.26,z,2.03,2.03,(g,W)=>{
      const c=W/2,r=c*.98;g.fillStyle='#f4e8c4';g.beginPath();g.arc(c,c,r,0,Math.PI*2);g.fill();
      g.strokeStyle='#8d775c';g.lineWidth=6;g.stroke();g.save();g.beginPath();g.arc(c,c,r*.84,0,Math.PI*2);g.clip();g.fillStyle='#393b35';g.fillRect(0,0,W,W);
      g.strokeStyle='#f1e8d5';g.lineWidth=14;g.lineJoin='miter';g.lineCap='square';
      for(const [x0,y0,x1,y1] of [[.04,.47,.96,.47],[.22,.40,.22,.10],[.22,.30,.39,.30],[.39,.30,.39,.09],[.51,.06,.51,.26],[.51,.26,.75,.26],[.75,.26,.75,.07],[.64,.36,.88,.36],[.34,.53,.34,.73],[.17,.66,.34,.66],[.69,.52,.69,.89],[.48,.58,.89,.58],[.48,.58,.48,.86],[.18,.79,.47,.79],[.80,.68,.91,.68]]){
        g.beginPath();g.moveTo(x0*W,y0*W);g.lineTo(x1*W,y1*W);g.stroke();
      }g.restore();
    },256,256);
  }
  function hall(T,k){
    k.box(0xad9a80,0,.18,0,13.25,.33,16.54);
    k.box(ivory,0,2.11,-.38,13.18,3.82,15.75);
    const z=7.55;
    for(const side of sides){
      k.box(cream,side*5.77,2.11,z+.025,1.55,3.82,.13);longevity(T,k,side*5.40,z+.105);
      for(const zz of [-6.9,-3.55,0,3.45,6.90]){
        k.box(cream,side*6.61,2.19,zz,.13,4.02,.26);
        k.box(cream,side*6.64,3.83,zz,.20,.23,.41);
      }
    }
    for(const [x,w] of [[-2.84,.98],[0,3.04],[2.84,.98]]){
      k.box(cream,x,1.71,z+.085,w+.12,2.89,.14);k.box(shadow,x,1.69,z+.164,w,2.78,.055);
      for(let j=0;j<(x===0?4:2);j++){
        const n=x===0?4:2,x1=x+(j+.5-n*.5)*w/n;
        k.box(0x584a41,x1,1.23,z+.201,w/n-.042,.94,.032);k.box(0x564a42,x1,2.33,z+.201,w/n-.042,.95,.032);
      }
    }
    k.box(cream,0,3.62,z+.11,8.54,.91,.20);
    board(T,k,0,3.63,z+.225,8.33,.73,[['DI TÍCH QUỐC GIA ĐẶC BIỆT',.38],['DI TÍCH LỊCH SỬ CÁC ĐỊA ĐIỂM KHỞI NGHĨA TRƯƠNG ĐỊNH',.23]]);
    k.box(cream,0,4.08,0,14.47,.17,17.1);
    rafters(T,k,14.91,17.61,4.19,1.67,9.11,11.7,false);
    k.box(ivory,0,6.46,0,9.13,1.34,11.72);
    for(const side of sides){
      k.box(cream,0,6.99,side*5.88,9.14,.13,.14);
      k.box(shadow,0,6.40,side*5.88,7.26,.32,.018);
      k.box(cream,0,6.40,side*5.904,7.26,.054,.025);
      for(const x of [-3.58,-1.80,0,1.80,3.58])k.box(cream,x,6.4,side*5.907,.105,.34,.03);
      k.box(shadow,side*4.574,6.40,0,.016,.27,9.45);
      for(let i=-3;i<=3;i++)k.box(cream,side*4.60,6.40,i*1.49,.04,.31,.12);
    }
    rafters(T,k,11.82,14.18,7.17,2.43,.02,3.55,true);
  }
  function ashlar(k,x,z,len,side){
    k.place(x,z,side?Math.PI/2:0,()=>{
      k.box(basalt,0,.55,0,len,.72,.36);
      for(let j=0;j<2;j++)for(let i=0;i<Math.ceil(len/.60)+1;i++){
        const lo=Math.max(-len/2,-len/2+(i-j*.43)*.60),hi=Math.min(len/2,-len/2+(i+1-j*.43)*.60);
        if(hi-lo<.06)continue;
        k.box([0x85877e,0x8d8e83,0x7b7e74][(i*5+j)%3],(hi+lo)/2,.34+j*.34,0,hi-lo-.016,.315,.379);
      }
      k.box(edge,0,.91,0,len+.06,.11,.47);
    });
  }
  function coping(k,x,z){
    k.box(basalt,x,.64,z,.62,1.0,.62);
    for(const [w,h,y,col] of [[.70,.10,1.06,edge],[.82,.19,1.20,stone],[.68,.11,1.35,basalt],[.46,.11,1.43,edge]])k.box(col,x,y,z,w,h,w);
    const shape=[[-.39,0],[-.27,.16],[.27,.16],[.39,0]];k.outline(shape,stone,x,1.23,z-.35,.70);
  }
  function inscription(T,k,z,back){
    panel(T,k,0,1.23,z,.46,1.13,(g,W,H)=>{
      g.fillStyle=back?'#a8aaa0':'#c7c4b0';g.fillRect(0,0,W,H);
      g.strokeStyle='#9c9b8c';g.lineWidth=6;g.strokeRect(7,7,W-14,H-14);g.save();
      const str=back?'忠義':'張公定之墓';g.fillStyle='#46473e';g.textAlign='center';g.textBaseline='middle';g.font='bold '+(back?'80':'46')+'px serif';
      [...str].forEach((c,j)=>g.fillText(c,W*.49,H*(.17+(j+.5)*.66/str.length)));g.restore();
    },144,320);
  }
  function stele(T,k,z,reverse){
    k.place(0,z,reverse?Math.PI:0,()=>{
      for(const [w,h,d,y] of [[1.93,.15,1.16,.31],[1.70,.18,.92,.46],[1.44,.11,.79,.58]])k.box(stone,0,y,0,w,h,d);
      k.box(basalt,0,1.15,0,.89,1.30,.43);k.box(edge,0,1.26,.233,.65,1.30,.075);
      inscription(T,k,.277,reverse);
      for(const t of sides){
        k.box(stone,t*.61,1.21,.045,.25,1.34,.48);k.box(edge,t*.61,1.83,.045,.32,.14,.54);
        k.outline([[0,0],[.29,.01],[.42,.18],[.40,.42],[.31,.47],[.22,.33],[.15,.31],[0,.40]],stone,t*.73,.48,-.27,.52,t>0?0:Math.PI);
      }
      k.box(edge,0,1.96,0,1.72,.17,1.02);
      // Closely spaced half-round grey stone tile ends cap each inscription.
      k.outline([[-.58,0],[0,.30],[.58,0]],stone,-1.03,2.05,0,2.06,Math.PI/2);
      for(let j=-11;j<=11;j++)for(const t of sides)line(T,k,j%2?edge:stone,[[j*.089,2.36,0],[j*.089,2.25,t*.23],[j*.089,2.06,t*.59]],.040,5);
      k.box(edge,0,2.37,0,1.87,.10,.12);
      for(const t of sides)line(T,k,basalt,[[t*.16,2.41,0],[t*.44,2.51,0],[t*.73,2.46,0],[t*.92,2.58,0]],.05);
    });
  }
  function mound(T,k){
    // Raised, recumbent back of the marker slopes to its narrower head wall.
    const ring=[[-1.63,.44,.70],[-1.48,.58,.64],[-1.12,.59,.63],[-.76,.57,.75],[-.31,.62,1.00],[.20,.68,1.16],[.61,.66,1.17],[1.00,.57,1.00],[1.30,.40,.69],[1.41,.10,.29]];
    const profile=new T.CatmullRomCurve3(ring.map(q=>new T.Vector3(...q))),points=[],indices=[];
    const sections=24,longitudinal=44;
    function surface(z,angle,out=0){
      let low=0,high=1;
      for(let step=0;step<12;step++){
        const t=(low+high)/2;
        if(profile.getPoint(t).x<z)low=t;else high=t;
      }
      const pt=profile.getPoint((low+high)/2);
      return [(pt.y+out)*Math.cos(angle),.32+(pt.z+out)*Math.sin(angle),z];
    }
    for(let j=0;j<=longitudinal;j++){
      const z=ring[0][0]+(ring.at(-1)[0]-ring[0][0])*j/longitudinal;
      for(let i=0;i<=sections;i++){
        points.push(...surface(z,Math.PI*i/sections));
        if(j===longitudinal||i===sections)continue;
        const n=j*(sections+1)+i;indices.push(n,n+1,n+sections+1,n+1,n+sections+2,n+sections+1);
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setIndex(indices);g.computeVertexNormals();
    k.stamp(g,stone,0,0,0);g.dispose();
    // Curled clouds along the lower margin and long pointed leaves sweeping
    // over the back are taken from the side of the recumbent marker.
    const motifs=[
      [[-1.56,.91],[-1.17,.84],[-.79,.91],[-.45,1.10],[-.12,1.48],[.30,1.69],[.79,1.42],[1.12,1.02]],
      [[-1.51,.81],[-1.12,.69],[-.79,.60],[-.49,.63],[-.24,.90],[.01,1.27],[.36,1.52],[.81,1.31],[1.17,.89]],
      [[-1.48,.74],[-1.16,.59],[-.83,.47],[-.59,.40],[-.43,.42],[-.23,.63],[-.01,.94],[.26,1.25],[.56,1.32]],
      [[.00,1.06],[.15,1.03],[.31,.87],[.35,.68],[.25,.59],[.11,.65],[.08,.77],[.16,.81]],
      [[.40,1.19],[.49,1.08],[.64,.99],[.77,.93],[.87,1.00]],
      [[.75,1.12],[.92,.97],[1.02,.77],[.96,.66],[.86,.71],[.83,.82]],
      [[-1.53,.55],[-1.32,.54],[-1.23,.40],[-1.31,.33],[-1.40,.39],[-1.37,.45]],
      [[-1.50,.14],[-1.26,.18],[-1.17,.27],[-.99,.29],[-.86,.21],[-.80,.15],[-.66,.25],[-.49,.29],[-.35,.21],[-.27,.16],[-.13,.25],[.07,.29],[.22,.21],[.31,.17],[.46,.29],[.64,.31],[.87,.23],[1.02,.25],[1.16,.41]],
      [[-1.52,.07],[-.70,.06],[.07,.08],[.58,.10],[1.05,.16],[1.26,.42]]
    ];
    for(const side of sides)for(const [j,motif] of motifs.entries()){
      const curve=new T.SplineCurve(motif.map(p=>new T.Vector2(...p))),ribbon=[],N=motif.length*5;
      function vertex(t,offset){const p=curve.getPoint(t),a=p.y+offset;return surface(p.x,side>0?a:Math.PI-a,.013);}
      for(let i=0;i<N;i++){
        const t=i/N,end=(i+1)/N,w=(.014+.012*Math.sin(Math.PI*t))*(j>6?.69:1),w2=(.014+.012*Math.sin(Math.PI*end))*(j>6?.69:1);
        const a=vertex(t,-w),b=vertex(t,w),c=vertex(end,-w2),d=vertex(end,w2);
        if(side>0)ribbon.push(...a,...b,...c,...b,...d,...c);else ribbon.push(...a,...c,...b,...b,...c,...d);
      }
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(ribbon,3));geo.computeVertexNormals();k.stamp(geo,j<7?0x879088:0x879086,0,0,0);geo.dispose();
    }
  }
  function tomb(T,k){
    k.box(0x949388,0,.13,0,6.55,.19,10.22);
    for(const side of sides){
      ashlar(k,side*3.13,0,9.87,true);
      for(const z of [-4.94,4.94])coping(k,side*3.13,z);
      ashlar(k,side*2.18,4.94,1.79,false);coping(k,side*1.14,4.94);
    }
    ashlar(k,0,-4.94,6.03,false);
    k.box(charcoal,0,.237,-.37,2.37,.14,4.64);k.box(edge,0,.317,-.37,2.30,.10,4.50);
    k.place(0,-.23,0,()=>mound(T,k));
    stele(T,k,1.56,false);stele(T,k,-2.22,true);
    const bud=new T.SphereGeometry(1,10,7),point=new T.ConeGeometry(.20,.30,8);
    for(const s of sides){
      k.box(stone,s*1.08,.96,2.53,.42,1.33,.45);k.box(edge,s*1.08,1.57,2.53,.59,.11,.58);
      k.stamp(bud,0xa1a59d,s*1.08,1.80,2.53,.23,.29,.23);
      k.stamp(point,edge,s*1.08,2.00,2.53);
    }bud.dispose();point.dispose();
  }
  function streetGate(T,k){
    for(const s of sides){
      k.box(ivory,s*1.72,1.74,0,.44,3.44,.53);k.box(cream,s*1.72,.19,0,.54,.28,.61);
      k.box(scarlet,s*1.72,1.91,.276,.28,2.73,.034);
      const words=(s<0?'Trái chúa thuận lòng dân sự nghiệp sáng choang cờ đại soái':'Quên thân trừ giặc nước cơ đồ hồng thắm chí Trương công').toLocaleUpperCase('vi').split(' ');
      panel(T,k,s*1.72,1.91,.302,.27,2.70,(g,W,H)=>{
        g.fillStyle='#9b3e32';g.fillRect(0,0,W,H);g.fillStyle='#dcb65d';g.font='bold 31px Georgia,serif';g.textAlign='center';g.textBaseline='middle';
        words.forEach((w,j)=>g.fillText(w,W*.5,H*(j+.5)/words.length,W*.90));
      },94,610);
    }
    k.box(ivory,0,3.37,0,4.0,.59,.54);
    board(T,k,0,3.34,.284,3.59,.35,[['MỘ ANH HÙNG TRƯƠNG ĐỊNH',.55]]);
    k.outline([[-.70,0],[0,.44],[.70,0]],clay,-2.31,3.67,0,4.62,Math.PI/2);
    for(let j=-13;j<=13;j++)for(const s of sides)line(T,k,j%3===0?0xad6551:clay,[[j*.17,4.11,0],[j*.17,3.89,s*.34],[j*.17,3.67,s*.72]],.061,5);
    k.box(cream,0,4.12,0,4.46,.11,.14);
    for(const s of sides){
      line(T,k,0x67867c,[[s*.31,4.17,0],[s*.53,4.39,0],[s*.77,4.36,0],[s*1.04,4.18,0],[s*1.43,4.24,0],[s*1.59,4.54,0]],.073);
      line(T,k,cap,[[s*1.32,4.33,0],[s*1.48,4.53,0],[s*1.65,4.52,0],[s*1.76,4.67,0]],.045);
    }
    const orb=new T.SphereGeometry(1,10,8);
    cyl(k,cap,0,4.23,0,.14,.15);k.stamp(orb,0x9aa284,0,4.44,0,.14,.21,.14);orb.dispose();
    for(const s of sides){
      k.outline([[-.23,-.08],[-.11,.04],[-.14,.13],[-.04,.10],[.03,.19],[.08,.14],[.17,.14],[.25,.20],[.27,.13],[.22,.07],[.14,.04],[.07,-.05],[-.04,-.09]],0x738773,s*1.57,4.45,-.067,.134,s>0?0:Math.PI);
      for(let j=0;j<4;j++)k.outline([[0,0],[.05,.11],[.09,.12],[.13,0]],cap,s*(.61+j*.15),4.36-j*.041,-.048,.09);
    }
  }
  function fence(k,len){
    k.box(ivory,0,.35,0,len,.55,.24);k.box(cream,0,1.66,0,len,.14,.33);
    const n=Math.round(len/.30),posts=Math.ceil(len/3.25);
    for(let i=1;i<n;i++)k.box(0xdad8c7,(i/n-.5)*len,1.10,0,.09,1.05,.11);
    for(let i=0;i<=posts;i++){
      const x=(i/posts-.5)*len;k.box(ivory,x,.91,0,.32,1.66,.33);k.box(cream,x,1.78,0,.38,.12,.40);
    }
  }
  // Plumeria in the two tree beds has a thick forked trunk, open crown,
  // leaves clustered at twig tips and white flowers with a yellow centre.
  function frangipani(T,k,mirror){
    const foliage=[],bloom=[],gold=[],two=Math.PI*2,random=(a,b)=>{const v=Math.sin(a*53.31+b*318.9)*39481;return v-Math.floor(v);};
    const leaves=[0x63814a,0x76924d,0x8c9f5f],colors=[];
    function leaf(store,center,length,width,angle,tilt,col){
      const [x,y,z]=center,c=Math.cos(angle),s=Math.sin(angle),rx=-s*width,rz=c*width;
      const tip=[x+c*length,y+tilt,z+s*length],mid=[x+.53*c*length,y+tilt*.52+.028,z+.53*s*length];
      const left=[mid[0]+rx,mid[1]-.02,mid[2]+rz],right=[mid[0]-rx,mid[1]-.02,mid[2]-rz];
      const points=[center,left,mid,left,tip,mid,tip,right,mid,right,center,mid];
      for(const v of points)store.push(...v);
      if(col!==undefined){const c3=new T.Color(col);for(let i=0;i<points.length;i++)colors.push(c3.r,c3.g,c3.b);}
    }
    line(T,k,trunk,[[0,0,0],[.12*mirror,1.32,.07],[.31*mirror,2.44,.19],[.18*mirror,3.17,.11]],.23,7);
    const f=mirror>0?.17:1.1;
    for(let i=0;i<6;i++){
      const a=i*two/6+f,l=1.25+random(i,2)*.6,x=Math.cos(a)*l,z=Math.sin(a)*l,h=3.47+random(i,4)*.80;
      line(T,k,trunk,[[.16*mirror,1.47+(i%3)*.31,.1],[x*.50,h*.67,z*.44],[x,h,z]],.115,7);
      for(let j=0;j<4;j++){
        const b=a+(j-1.5)*.71,xx=x+Math.cos(b)*.84,zz=z+Math.sin(b)*.84,hh=h+.65+random(i,j);
        line(T,k,0x8a816b,[[x*.86,h-.14,z*.87],[x*.55+xx*.45,hh-.41,z*.55+zz*.45],[xx,hh,zz]],.061,6);
        for(let t=0;t<4;t++){
          const dd=b+(t-1.5)*1.01,px=xx+.42*Math.cos(dd),pz=zz+.42*Math.sin(dd),py=hh+.18+random(j,t)*.39;
          line(T,k,0x9a9279,[[xx,hh,zz],[px,py,pz]],.027,5);
          for(let n=0;n<11;n++){
            const a0=n*two/11+dd,nn=random(i*13+j,n+t);
            leaf(foliage,[px,py,pz],.32+nn*.16,.072+nn*.020,a0,-.12+nn*.34,leaves[(i+t+n)%3]);
          }
          if((t+i+j)%3===1)for(let n=0;n<5;n++)leaf(bloom,[px+.06,py+.045,pz],.068,.027,n*two/5+b,.023);
          if((t+i+j)%3===1)leaf(gold,[px+.05,py+.057,pz],.033,.018,b,.007);
        }
      }
    }
    for(const [pos,col] of [[foliage,null],[bloom,0xe7dfbf],[gold,0xd7b363]]){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();
      if(col===null)g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
      const mesh=new T.Mesh(g,new T.MeshLambertMaterial({color:col??0xffffff,vertexColors:col===null,side:T.DoubleSide}));mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);
    }
  }
  function lotusPond(T,k){
    const bowl=new T.CylinderGeometry(1.14,.96,.52,32),top=new T.TorusGeometry(1.10,.065,7,32);
    k.stamp(bowl,0x95866c,0,.30,0);k.stamp(top,edge,0,.57,0,1,1,1,0,Math.PI/2);
    cyl(k,0x586953,0,.56,0,1.045,.022);bowl.dispose();top.dispose();
    const leaf=new T.CylinderGeometry(1,1,1,10,1,false,.07,5.85);
    for(let i=0;i<18;i++){
      const a=2.39996*i,r=.89*Math.sqrt((i+.5)/18),x=Math.cos(a)*r,z=Math.sin(a)*r,h=.67+Math.sin(2.21*i)*.26+.24;
      line(T,k,green,[[x*.72,.55,z*.72],[x,h,z]],.012,4);
      k.stamp(leaf,i%3?0x739246:0x5f8443,x,h,z,.15+i%4*.029,.018,.15+i%3*.029,a,i%4*.07);
    }leaf.dispose();
  }
  function build(T,k){
    const f=createTempleFoundations(T,k);
    k.palette({stone:[stone,edge,basalt,charcoal,marble],plaster:[ivory,cream],tile:[clay]});
    const building=f.building(0,0,0,13.25,16.54,()=>hall(T,k));
    f.stairs(building,-.3,8.26,-.3,8.81,6.27,.35,2);
    f.building(-1.12,17.65,0,6.55,10.22,()=>tomb(T,k));
    f.walk(17.22,22.44,.21,19.70);
    f.building(9.62,28.06,Math.PI/2,4.04,.58,()=>streetGate(T,k));
    const fenceStart=-9.4,fenceEnd=26.07;
    f.building(9.62,(fenceStart+fenceEnd)/2,Math.PI/2,fenceEnd-fenceStart,.34,()=>fence(k,fenceEnd-fenceStart));
    f.building(9.62,30.89,Math.PI/2,1.74,.34,()=>fence(k,1.74));
    f.building(-.06,31.59,Math.PI/2,.23,19.09,()=>k.box(ivory,0,1.06,0,.23,2.03,19.09));
    f.building(-7.79,18.36,0,.24,20.80,()=>k.box(ivory,0,1.10,0,.24,2.11,20.80));
    for(const side of sides){
      f.building(-1.12+side*3.39,22.85,0,2.53,2.65,()=>{
        k.box(0x86837b,0,.14,0,2.53,.15,2.65);k.box(0x68734d,0,.23,0,2.41,.045,2.54);frangipani(T,k,side);
      });
    }
    f.building(-1.12,27.39,0,2.21,2.21,()=>lotusPond(T,k));
    f.building(-.89,10.45,0,.40,.40,()=>{
      cyl(k,0xaca998,0,4.49,0,.034,8.90);
      const flag=new T.BufferGeometry(),pos=[],idx=[],uv=[];
      for(let j=0;j<=4;j++)for(let i=0;i<=10;i++){
        const u=i/10,v=j/4;pos.push(u*1.70,8.83-.12*u-v*1.11+.065*Math.sin(u*4+v),-.22*u+u*.14*Math.sin(u*10-v*1.60));
        uv.push(u,1-v);
        if(j<4&&i<10){const n=j*11+i;idx.push(n,n+11,n+1,n+1,n+11,n+12);}
      }
      flag.setIndex(idx);flag.setAttribute('position',new T.Float32BufferAttribute(pos,3));flag.setAttribute('uv',new T.Float32BufferAttribute(uv,2));flag.computeVertexNormals();
      const cv=document.createElement('canvas');cv.width=192;cv.height=128;const g=cv.getContext('2d');g.fillStyle='#bf3431';g.fillRect(0,0,192,128);g.fillStyle='#e6bd4d';g.beginPath();
      for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?12.15:32;const x=96+r*Math.cos(a),y=64+r*Math.sin(a);if(i)g.lineTo(x,y);else g.moveTo(x,y);}g.closePath();g.fill();
      const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;k.group.add(new T.Mesh(flag,new T.MeshLambertMaterial({map,side:T.DoubleSide})));
    });
  }
  function shot(name,x,z,height,viewRadius,a,viewElevation){
    return {name,offset:[cs*x+sn*z,-sn*x+cs*z],height,viewRadius,viewAngle:yaw+a,viewElevation,viewBase:'monument'};
  }
  const sites=window.VietnamSights??=[];
  sites.push({...pin,id,catalogId,name:'Lăng mộ và đền thờ Trương Định',kind:'Di tích lịch sử',province:'Đồng Tháp',city:'Gò Công',
    lon:106.6739148,lat:10.3596474,start:[106.6741120,10.3598779],yaw,width:20,depth:42.0,
    mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,source,photo,
    map:'https://www.google.com/maps?cid=18019265529073909765',
    description:'Sau cổng số 1 Phan Đình Phùng, một vòng tường đá bao quanh nấm mộ dáng voi phục. Hai tấm bia có mái che đặt ở hai đầu mộ. Phía tây là ngôi đền xây năm 1973, nhận ra qua hai tầng mái ngói và hai ô cửa tròn. Tỷ lệ hoa văn và khoảng cách trong sân được ước theo ảnh tại di tích.',
    arrivalNote:'Xe dừng trên đường Phan Đình Phùng, cạnh cổng khu di tích. Đi bộ qua cổng vào sân bên khu mộ.',
    boundary:[[-7.90,-8.50],[9.96,-9.52],[9.97,31.89],[-7.98,31.43]],reserve:(x,z,r)=>x>=-7.98-r&&x<=9.97+r&&z>=-9.52-r&&z<=31.89+r,
    solids:[[0,0,6.60,8.25],[-1.12,17.65,3.14,5.10]],
    views:[shot('Hai bia mộ trước đền thờ Trương Định',-1.06,14.55,5.15,13.60,.005,.11),
      shot('Nấm mộ dáng voi phục giữa hai bia đá',-1.12,17.35,2.53,4.09,-1.34,.48),
      shot('Cổng số 1 đường Phan Đình Phùng',9.62,28.06,4.72,7.74,Math.PI/2+.12,.05)],build});
})();
