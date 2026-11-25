const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const atlas=window.VietnamTourism,catalogId='osm-way-1244769154',id='mo-cu-pho-bang-nguyen-sinh-sac';
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  const source='https://dsvh.gov.vn/mo-cu-pho-bang-nguyen-sinh-sac-22297';
  const photo='https://thanhnien.vn/ve-cao-lanh-tham-mo-cu-pho-bang-nguyen-sinh-sac-18526022816105194.htm';
  // DSVH gives the canopy height, grave dimensions, diameter of the star and
  // height of the lotus. The fan profile, step outlines and ribs are estimates
  // from the 2026 frontal photograph and official 360° ground/aerial panoramas:
  // https://dongthap.hochiminh.vn/ (Nơi an nghỉ, panoramas 72–77)
  // https://vr3d.com.vn/dongthap/nguyensinhsac/ (aerial scene kdtnss-canh-2-30m).
  // The centre of the grave is n1805807506. The ENE grave–pond axis and
  // spacing between centres were measured on the aerial, independent of the
  // pin representing the entire memorial complex.
  const yaw=1.963,cs=Math.cos(yaw),sn=Math.sin(yaw),poolZ=40;
  const white=0xf0f0e8,edge=0xe2e3dd,marble=0xc2c4be,granite=0x62696a,bronze=0x746347;
  const seed=n=>{const a=Math.sin(n*38.243+2.5)*40923.62;return a-Math.floor(a);};
  function slab(T,k,polygon,bottom,top,colour){
    const shape=new T.Shape(polygon.map(([x,z])=>new T.Vector2(x,-z)));
    const g=new T.ExtrudeGeometry(shape,{depth:top-bottom,bevelEnabled:false});g.rotateX(-Math.PI/2);
    k.stamp(g,colour,0,bottom,0);g.dispose();
  }
  function beam(T,k,colour,a,b,width,depth=width){
    const dir=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),len=dir.length();
    const orient=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),dir.normalize());
    const r=new T.Euler().setFromQuaternion(orient,'YXZ');
    k.box(colour,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,width,depth,len+.035,r.y,r.x,r.z);
  }
  function head(T,k,x,y,z,angle){
    // Each rib terminates in a white dragon head. The stepped jaw, cheeks and
    // brow are sculptural details of the concrete end itself, all the same finish.
    k.place(x,z,angle,()=>{
      for(const [yy,zz,w,h,d] of [[.035,.08,.47,.39,.70],[.20,.31,.55,.32,.64],[.33,.61,.59,.18,.54],
        [.09,.64,.46,.13,.41],[.49,.47,.45,.12,.37]])k.box(white,0,y+yy,zz,w,h,d);
      for(const s of [-1,1]){
        k.stamp(k.ball,edge,s*.223,y+.37,.48,.168,.11,.20);
        k.stamp(k.ball,white,s*.19,y+.43,.73,.10,.095,.115);
        k.stamp(k.ball,white,s*.24,y+.41,.28,.11,.22,.20);
        for(let i=0;i<3;i++)k.box(edge,s*.249,y+.03,.29+i*.115,.057,.28,.062,0,-.23,0);
      }
    });
  }
  function shell(T,k){
    // Each row stores central z and height, half-span, setback and fall at the
    // outer rib. The underside is open right up to the two columns; only the
    // back of the fan rolls down to meet the floor behind the altar.
    const rows=[[-6.57,.96,2.75,0,0],[-6.62,2.20,3.30,.17,.04],[-5.70,4.86,5.95,.54,.65],
      [-3.67,7.56,7.76,.84,1.34],[-.50,9.88,8.81,1.38,1.93],[2.52,8.97,8.87,2.37,1.63],[6.10,7.23,8.64,3.57,1.22]];
    function pt(i,u,bottom=false){
      const [z,y,w,setback,drop]=rows[i],a=u*u;
      return [w*u,y-drop*a-(bottom?.22:0),z-setback*a];
    }
    const pos=[],tri=(a,b,c)=>pos.push(...a,...b,...c),quad=(a,b,c,d)=>{tri(a,b,c);tri(a,c,d);};
    for(let i=0;i<rows.length-1;i++)for(let j=0;j<16;j++){
      const l=j/8-1,r=(j+1)/8-1;
      quad(pt(i,l),pt(i+1,l),pt(i+1,r),pt(i,r));
      quad(pt(i,l,true),pt(i,r,true),pt(i+1,r,true),pt(i+1,l,true));
      if(j===0)quad(pt(i,l),pt(i,l,true),pt(i+1,l,true),pt(i+1,l));
      if(j===15)quad(pt(i,r),pt(i+1,r),pt(i+1,r,true),pt(i,r,true));
      if(i===rows.length-2)quad(pt(i+1,l),pt(i+1,l,true),pt(i+1,r,true),pt(i+1,r));
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.computeVertexNormals();
    k.stamp(geo,white,0,0,0);geo.dispose();
    for(let j=-4;j<=4;j++){
      const u=j/4;
      for(let i=1;i<rows.length-1;i++){
        const a=pt(i,u,true),b=pt(i+1,u,true);
        if(i===1){a[0]+=(b[0]-a[0])*.48;a[1]+=(b[1]-a[1])*.48;a[2]+=(b[2]-a[2])*.48;}
        a[1]-=.075;b[1]-=.075;a[2]+=.13*(1-i/6);b[2]+=.13*(1-(i+1)/6);
        beam(T,k,edge,a,b,.35+.19*i/5,.30);
        if(i>=4)beam(T,k,white,pt(i,u),pt(i+1,u),.24,.14);
      }
      const [x,y,z]=pt(6,u,true);head(T,k,x,y,z,Math.atan(u*.65));
    }
    for(let j=-4;j<4;j++){
      const a=pt(5,j/4,true),b=pt(5,(j+1)/4,true);a[1]-=.11;b[1]-=.11;
      beam(T,k,edge,a,b,.27,.26);
    }
    for(const s of [-1,1])k.box(edge,s*5.30,4.35,2.64,.53,7.02,.61);
  }
  function section(T,k){
    const top=.91,hex=[[-3.76,-7.65],[3.76,-7.65],[10.33,1.52],[6.60,9.45],[-6.60,9.45],[-10.33,1.52]];
    for(let i=0;i<5;i++){
      const scale=1-i*.0285;slab(T,k,hex.map(([x,z])=>[x*scale,z*scale]),.08+i*.166,.25+i*.166,i===4?0xafb2af:edge);
    }
    const stone=0x69706e,dark=0x424a48;
    k.box(stone,0,top+.125,0,1.34,.25,2.38);k.box(dark,0,top+.29,0,1.09,.09,2.09);
    k.box(granite,0,top+.55,0,1,.49,2);k.box(stone,0,top+.843,0,1.045,.114,2.047);
    k.outline([[-.23,0],[.23,0],[.23,.62],[.154,.70],[-.154,.70],[-.23,.62]],dark,0,top,1.25,.138);
    k.sign('NGUYỄN SINH SẮC',0,top+.48,1.391,.355,.072,true,'#c4b182');
    for(const z of [-1,1])for(const s of [-1,1])k.box(0xd8dad2,s*.65,top+.002,z,5.15,.007,.012);
    const altarZ=-4.04;k.box(marble,0,top+.44,altarZ,5.20,.88,.93);k.box(edge,0,top+.955,altarZ,5.55,.16,1.09);
    const frame=0x563a32;k.box(frame,0,top+1.56,altarZ-.09,.82,1.11,.16);k.box(0xddd4b6,0,top+1.56,altarZ+.003,.67,.93,.040);
    const tex=new T.TextureLoader().load('data:image/webp;base64,'+portrait);tex.colorSpace=T.SRGBColorSpace;
    const picture=new T.Mesh(new T.PlaneGeometry(.56,.72),new T.MeshBasicMaterial({map:tex}));
    picture.position.set(0,top+1.57,altarZ+.026);k.group.add(picture);
    k.tapered(bronze,0,top+.066,1.88,.17,.185,.123,1,18);
    for(const a of [0,2.094,4.189])beam(T,k,bronze,[Math.sin(a)*.123,top+.13,1.88+Math.cos(a)*.123],
      [Math.sin(a)*.158,top+.28,1.88+Math.cos(a)*.158],.056);
    k.tapered(bronze,0,top+.336,1.88,.16,.225,.20,1,24);k.tapered(0x9b8963,0,top+.446,1.88,.229,.236,.035,1,24);
    const ring=new T.TorusGeometry(.085,.02,6,12);
    for(const s of [-1,1])k.stamp(ring,bronze,s*.20,top+.40,1.88,1,1.14,1);ring.dispose();
    for(let i=0;i<9;i++)k.box(0xc2a45f,.10*Math.sin(i*3.3),top+.55,1.88+.08*Math.cos(i*3.3),.009,.21,.009,0,.07*Math.cos(i),.07*Math.sin(i));
    for(const s of [-1,1]){
      const x=s*.66;k.tapered(bronze,x,top+1.075,altarZ+.19,.080,.09,.07,1,12);
      k.tapered(bronze,x,top+1.205,altarZ+.19,.05,.032,.20,1,12);k.tapered(0x9c5244,x,top+1.42,altarZ+.19,.035,.035,.29,1,12);
      k.tapered(bronze,s*1.45,top+1.27,altarZ,.09,.16,.43,1,16);
      for(let j=0;j<6;j++)k.stamp(k.ball,j%3===0?0xd9ae54:0x78904c,s*1.45+.12*Math.sin(j*2.63),top+1.62+.049*Math.cos(j),altarZ+.08*Math.cos(j*2.63),.10,.15,.10);
    }
  }
  function pool(T,k){
    const star=rad=>Array.from({length:10},(_,i)=>{const a=i*Math.PI/5,r=i%2?rad*.413:rad;return [Math.sin(a)*r,poolZ+Math.cos(a)*r];});
    slab(T,k,star(15),.01,.63,0x777d7f);slab(T,k,star(14.95),.63,.683,0xb6b8b5);slab(T,k,star(14.08),.683,.693,0x768e84);
    // The five lawns lie in the open sectors between the star arms and the
    // circular walk. Both radial walks reach the rim of the star pool.
    for(const j of [0,1,3,4]){
      const a=(j*2+1)*Math.PI/5;
      const pts=[[Math.sin(a)*7.65,poolZ+Math.cos(a)*7.65]];
      for(let i=0;i<=14;i++){const t=a-.547+1.094*i/14;pts.push([Math.sin(t)*15.45,poolZ+Math.cos(t)*15.45]);}
      slab(T,k,pts,.04,.109,0x687e47);
    }
    const verts=[];
    for(let j=0;j<10;j++){
      function rim(n){const a=.13+n*.60;return [Math.sin(a),.11+.047*Math.cos(3*a),Math.cos(a)];}
      verts.push(0,-.12,0,...rim(j),...rim(j+1));
    }
    const leaf=new T.BufferGeometry();leaf.setAttribute('position',new T.Float32BufferAttribute(verts,3));leaf.computeVertexNormals();
    for(let i=0,accepted=0;i<5500&&accepted<1050;i++){
      const x=(seed(3*i)-.5)*28,z=(seed(3*i+1)-.5)*28;
      const a=(Math.atan2(x,z)+Math.PI*2)%(Math.PI*2),t=a%(Math.PI*2/5),v=Math.min(t,Math.PI*2/5-t);
      const r=1/(Math.cos(v)/13.75+(1/(13.75*.413)-Math.cos(Math.PI/5)/13.75)*Math.sin(v)/Math.sin(Math.PI/5));
      if(Math.hypot(x,z)>r-.25||Math.hypot(x,z)<1.58)continue;
      const f=seed(i+800),y=.76+f*.27;accepted++;
      k.stamp(leaf,[0x48654c,0x6d815a,0x537258,0x7b8e67][i%4],x,y,poolZ+z,.18+f*.24,.36,.17+f*.26,f*6.2,.18*Math.cos(i),.34*Math.sin(i));
      if(i%127===0)k.stamp(k.ball,0xc99089,x,y+.12,poolZ+z,.11,.14,.11);
    }
    leaf.dispose();
    const z=poolZ;
    k.tapered(marble,0,.94,z,1.30,1.26,.55,1,8);k.tapered(0xa3a8a8,0,1.48,z,1.14,1.02,.60,1,8);
    // Sculpture: faceted upright granite petals surrounding a pointed central
    // bud, with their lower ends gathered above the octagonal pedestal.
    function petal(a,rad,h,w){
      const pos=[],tri=(p,q,r)=>pos.push(...p,...q,...r);
      function p(x,y,d){return [x*Math.cos(a)+d*Math.sin(a),y,z-x*Math.sin(a)+d*Math.cos(a)];}
      const root=p(0,1.68,.34),left=p(-w,2.33,rad),right=p(w,2.33,rad),spine=p(0,2.19,rad+.14);
      const lt=p(-w,h-.46,rad),rt=p(w,h-.46,rad),tip=p(0,h,rad-.06),crest=p(0,h-.39,rad+.15);
      tri(root,spine,left);tri(root,right,spine);tri(left,spine,crest);tri(left,crest,lt);tri(spine,right,rt);tri(spine,rt,crest);
      tri(lt,crest,tip);tri(crest,rt,tip);
      const rear=p(0,h-.66,rad-.39);tri(lt,tip,rear);tri(tip,rt,rear);tri(rt,right,rear);tri(rear,left,lt);
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();
      const m=new T.Mesh(g,new T.MeshLambertMaterial({color:0xc7cace,side:T.DoubleSide,flatShading:true}));m.castShadow=true;k.group.add(m);
    }
    for(let j=0;j<5;j++)petal(j*Math.PI*2/5,.82,5.12+.18*Math.cos(j*2),.55);
    k.tapered(0xbfc2c6,0,4.08,z,.58,.60,3.70,1,5);k.tapered(0xd1d2d2,0,6.215,z,.60,0,.57,1,5);
  }
  function grounds(T,k){
    const halfCourt=[[-9,5.9],[.65,12.15],[9.75,13.0],[22.9,12.7],[27,13.2],[31,15.75],[37,17.1],[41,17.30],[45,16.7],[50,14.6],[54,11.35],[56.3,7.2],[68,7.2]];
    const plaza=[...halfCourt.map(([z,x])=>[x,z]),...halfCourt.slice().reverse().map(([z,x])=>[-x,z])];
    slab(T,k,plaza,-.96,.077,0x8b8986);
    for(let z=-6;z<66;z+=2.45){
      const i=halfCourt.findIndex(([row])=>row>z),[a,ax]=halfCourt[i-1],[b,bx]=halfCourt[i];
      const half=ax+(bx-ax)*(z-a)/(b-a)-.10;
      k.box(0x9a9a97,0,.081,z,2*half,.006,.027);
    }
    // Round granite offering bowl on the central approach, in both the overhead
    // survey and the front elevation. The perforated stone hood is open below.
    const bowl=0x929b99,bz=13.4;
    for(const [y,rb,rt,h] of [[.15,1.15,1.15,.16],[.30,.77,.77,.14],[.45,.49,.42,.16],[.89,.34,.30,.77],[1.46,.30,.67,.43],[1.73,.67,.72,.12]])
      k.tapered(bowl,0,y,bz,rb,rt,h,1,24);
    const dome=new T.SphereGeometry(.52,24,10,0,Math.PI*2,0,Math.PI*.50);
    k.stamp(dome,marble,0,1.76,bz,1,.91,1);dome.dispose();
    for(let j=0;j<4;j++){
      const a=j*Math.PI/2;k.stamp(k.ball,0x64706f,.50*Math.sin(a),1.79,bz+.50*Math.cos(a),.13,.085,.067,a);
    }
    const stems=[];
    for(const [x,z,h] of [[-9.3,8.8,2.70],[9.3,8.8,2.60],[-11.4,4.1,2.67],[11.4,4.1,2.75],[-14.7,18.2,2.72],[14.7,18.2,2.67],
        [-16.1,29,2.48],[16.1,29,2.54],[-16.45,49,2.63],[16.45,49,2.55]]){
      k.tapered(edge,x,.23,z,.58,.40,.30,1,24);k.tapered(0xcac8b8,x,.56,z,.40,.80,.44,1,24);
      k.tapered(edge,x,.81,z,.81,.83,.08,1,24);k.tapered(0x786b53,x,.87,z,.68,.68,.04,1,24);
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3;k.stamp(k.ball,0xaa925b,x+.664*Math.sin(a),.622,z+.664*Math.cos(a),.19,.13,.055,a);
      }
      k.stamp(k.round,0x675a45,x,1.10,z,.19,.47,.19);
      for(const [hh,rad] of [[.28,.83],[.50,.66],[.72,.43]]){
        for(let j=0;j<6;j++){
          const a=j*Math.PI/3+hh*5,f=.85+.25*seed(x+j+hh);
          k.stamp(k.ball,j%3?0x597044:0x677c4a,x+rad*.42*Math.sin(a),.89+hh*h+.07*Math.cos(j+z),z+rad*.42*Math.cos(a),rad*.75*f,.52*rad,rad*.72);
        }
      }
    }
    for(const [x,z,w,h] of [[-8.2,-8.8,5.8,12.5],[.6,-12,6.4,15],[9.4,-9.8,6.8,13.1],[-15.2,-5,7,13.6],[16,-4.5,6.5,12.2],
      [-18,4.2,5.6,11.7],[19,4.8,6.7,13.7],[-19.6,15.3,6.2,13.5],[20.8,20,7.1,13.3],[-22,32,6.3,12],[22.2,36,7.5,13.1],
      [-22.6,51,7.8,14.6],[21.4,55.9,5.9,11.7],[-8.2,-17.2,8,13.9],[9.7,-17.2,8.8,15.2],[-19.1,-12.1,7.3,14],[21.4,-14.5,8.2,13.1]])
      stems.push([x,0,z,w*1.95,h,seed(x+z)*6.28]);
    window.createTreeModels(T).grove(k.group,stems);
  }
  function build(T,kit){
    const ball=new T.SphereGeometry(1,12,8),k={...kit,ball};
    k.palette({plaster:[white,edge],stone:[marble,granite,0x8b8986,0x777d7f],metal:bronze});
    grounds(T,k);pool(T,k);section(T,k);shell(T,k);ball.dispose();
    const base=new WeakMap();
    k.group.userData.fitGround=ground=>{
      // The rectified aerial and ground panoramas show a single level court.
      // Coarse DEM ridges in town must not break through the star or cellar.
      let lift=0;for(const x of [-17,-8,0,8,17])for(const z of [-8,0,9,18,29,40,50,61])lift=Math.max(lift,ground(x,z));
      for(const child of k.group.children){
        if(!base.has(child))base.set(child,child.position.y);
        child.position.y=base.get(child)+lift;
      }
    };
  }
  const view=(name,x,z,height,viewRadius,a,viewElevation)=>({name,offset:[cs*x+sn*z,-sn*x+cs*z],height,viewRadius,viewAngle:yaw+a,viewElevation,viewBase:'monument'});
  // Front crop of the 20 Nov 1923 French Indochina public-domain photograph.
  // Print conserved at the Thừa Thiên Huế Library, supplied by Hội Khoa học Lịch sử Đồng Tháp.
  // https://commons.wikimedia.org/wiki/File:Portrait_of_Nguy%E1%BB%85n_Sinh_Huy,_father_of_H%E1%BB%93_Ch%C3%AD_Minh.jpg
  const portrait='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';
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Mộ cụ Phó bảng Nguyễn Sinh Sắc',kind:'Di tích lịch sử',
    lon:105.6310305,lat:10.4466867,source,photo,map:'https://www.openstreetmap.org/node/1805807506',start:raw.start,approachMeters:310,
    visitOnArrival:true,mappedEntrance:true,yaw,width:30,depth:24,gardenRadius:12,foundationAt:[0,0],solids:[],
    reserve:(x,z,p)=>Math.abs(x)<18+p&&z> -9-p&&z<62+p,
    description:'Vòm trắng hình cánh sen cao 10 m xòe ra trên mộ đá hoa cương. Chín đầu rồng hướng về phía hồ hình ngôi sao, nơi có đài sen đá cao 6,5 m. Biên dạng vòm và khoảng cách trong sân được ước dựng theo ảnh mặt đất và ảnh trên cao.',
    arrivalNote:'Xe dừng ở cổng đường Lê Văn Giáo, cạnh lối vào điểm giữ xe. Từ đây đi bộ khoảng 310 m qua cổng sân lăng, vòng hồ sao rồi theo trục chính tới mộ.',
    views:[{...view('Vòm cánh sen và chín đầu rồng',0,.20,8.9,32,.195,.026),viewFov:38},
      view('Hồ sao và đài sen trên trục sân lăng',0,32.3,3.9,46,-.48,.57),
      view('Mộ đá và bàn thờ dưới những gân vòm',0,-1.5,4.7,7.8,.38,.16)],build});
})();

export default window.VietnamSights;
