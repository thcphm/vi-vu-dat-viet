'use strict';
(()=>{
  // Map each slope onto courses of individual clay tiles. The last few tiles
  // rise towards each hip, while the middle of the eave stays nearly level.
  function tileRoof(T,k,x,y,z,width,depth,rise,palette,hip=true){
    const bands=palette.map(()=>[]),rows=Math.max(5,Math.round(depth*.83)),ridge=width/2-(hip?Math.min(depth*.34,width*.25):0);
    for(let side=0;side<4;side++){
      if(!hip&&(side%2))continue;
      const cols=Math.max(5,Math.ceil((side%2?depth:width)/.67));
      function point(u,v){
        const edge=width/2*(1-v)+ridge*v,span=depth/2*(1-v),a=u*2-1;
        const px=side===0?a*edge:side===1?edge:side===2?-a*edge:-edge;
        const pz=side===0?span:side===1?-a*span:side===2?-span:a*span;
        const corner=hip?Math.pow(Math.abs(a),5)*(1-v)**3*.6:0;
        return [px,rise*(.53*v+.47*v*v)+corner,pz];
      }
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
        const u=i/cols,w=(i+1)/cols,v=j/rows,t=(j+1)/rows;
        const a=point(u,v),b=point(w,v),c=point(w,t),d=point(u,t);
        const n=(i*17+j*31+side*11+i*j*7)%15;
        bands[n<7?0:n<12?1:2].push(...a,...b,...c,...a,...c,...d);
      }
    }
    bands.forEach((data,i)=>{
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(data,3));geo.computeVertexNormals();
      k.stamp(geo,palette[i],x,y,z);geo.dispose();
    });
    k.box(palette[2],x,y+rise+.10,z,ridge*2+.19,.22,.30);
    for(const f of [-1,1]){
      k.box(palette[2],x,y-.045,z+f*depth/2,width,.15,.14);
      if(!hip)k.outline([[-depth*.5,-.25],[0,rise],[depth*.5,-.25]],0xaca395,x+f*width/2-.09,y,z,.18,Math.PI/2);
      const tip=ridge*f;
      k.outline([[0,0],[f*.46,.08],[f*.92,.8],[f*.96,1.06],[f*.64,.87],[f*.52,.49],[f*.19,.31],[0,.3]],palette[2],x+tip,y+rise,z-.12,.24);
    }
  }
  const templeClay=[0xa45d45,0x965741,0x834e40],agedClay=[0x8d6754,0x785e50,0x68594d];
  function hall(T,k,x,z,w,d,floor,wallHeight,palette,bays,hip=true){
    const wood=0x574239,doorZ=z+d*.25;
    k.box(0x979289,x,floor-.21,z,w+.8,.42,d+.45);
    k.box(0xc0a784,x,floor+wallHeight/2,z-d*.12,w-.8,wallHeight,d*.70);
    k.box(wood,x,floor+wallHeight/2,doorZ,w-.9,wallHeight,.25);
    for(let i=0;i<bays;i++){
      const xx=x+((i+.5)/bays-.5)*(w-.9),bw=(w-.9)/bays;
      k.box(0x765141,xx,floor+wallHeight*.43,doorZ+.14,bw*.82,wallHeight*.76,.18);
      for(let j=-2;j<=2;j++)k.box(0x5c4035,xx+j*bw*.14,floor+wallHeight*.66,doorZ+.25,.056,wallHeight*.32,.05);
    }
    for(let i=0;i<=bays;i++){
      const xx=x+(i/bays-.5)*(w-.75),zz=z+d*.44;
      k.stamp(k.round,0xa19d90,xx,floor+.16,zz,.30,.32,.30);
      k.stamp(k.round,wood,xx,floor+wallHeight*.54,zz,.225,wallHeight,.225);
      k.box(wood,xx,floor+wallHeight-.15,zz,.32,.25,.95);
    }
    k.box(wood,x,floor+wallHeight,z+d*.44,w,.35,.33);
    tileRoof(T,k,x,floor+wallHeight+.13,z,w+1.8,d+1.35,d*.36,palette,hip);
  }
  function philang(T,k){
    const {box,stamp,round,random}=k;
    // Tam Bảo rises above the axial approach; the little gravel courts flank the stair.
    box(0xa59783,0,.31,-4,36,.62,29);
    box(0xbd947b,0,.69,-3,32,.18,25);
    for(let i=0;i<6;i++)box(i%2?0xb3a89a:0xa49d90,0,.12+i*.073,13.6-i*.49,8.5,.23+i*.143,.56);
    hall(T,k,0,-5,15.5,7,1.28,3.63,templeClay,5);
    hall(T,k,0,-12.7,12.7,7.6,1.46,4,templeClay,3);
    for(const side of [-1,1]){
      const x=side*13.1;
      hall(T,k,x,-6.7,8.1,6.7,.92,2.9,templeClay,3);
      box(0xd5d1c1,x,.85,3.5,8.7,.21,10.8);
      // Loops and stepping stones are visible from the roadside and the orbit camera.
      for(let j=0;j<6;j++){
        const xx=x+(j%2-.5)*3.6,zz=.4+Math.floor(j/2)*3;
        stamp(round,0xaba99b,xx,.97,zz,1.46,.055,1.2);
        stamp(round,0xe2dfd0,xx,1.005,zz,1.27,.04,1.03);
      }
      for(let j=0;j<9;j++)box(0x96968d,side*(8+.5*Math.sin(j*.8)),.85,j*1.02,1.25,.22,.68,j*.09);
    }
    const rock=new T.IcosahedronGeometry(1,1);
    for(const s of [-1,1]){
      const x=4.4*s,z=5.4;
      // Kneeling stone elephants, with a raised head, fan ears and a curled trunk.
      box(0x92928a,x,1,z,2.05,.35,2.65);
      stamp(rock,0xaea99c,x,1.72,z-.12,.74,.61,1.03);
      stamp(rock,0xbcb7aa,x,2.10,z+.61,.57,.51,.55);
      for(const a of [-1,1]){stamp(rock,0xaca79a,x+a*.47,2.04,z+.59,.17,.42,.39);stamp(rock,0xaaa699,x+a*.44,1.32,z+.21,.24,.28,.55);}
      stamp(rock,0xbab4a7,x,1.76,z+1.03,.17,.43,.18);
      stamp(rock,0xbab4a7,x,1.43,z+1.14,.18,.19,.24);
    }
    for(const [x,z] of [[-15,7],[15,7],[-17,-13],[17,-14],[-10,10],[9,9]]){
      stamp(round,0x6b5842,x,2.45,z,.20,3.35,.21);
      for(let i=0;i<11;i++){
        const a=i*2.4,r=1.3*random();stamp(rock,i%2?0x496146:0x637b4e,x+Math.cos(a)*r,3.48+i*.15,z+Math.sin(a)*r,1.56,.76,1.44,a);
      }
    }
    rock.dispose();
  }
  function baDanh(T,k){
    const {box,outline,stamp,round,arch}=k,limestone=0xaca99b,timber=0x746758;
    box(0x9e8e80,0,.06,1,26,.28,25);
    hall(T,k,0,-8.9,15.8,6.1,.49,2.83,agedClay,5,false);
    const gate=6;
    for(let j=0;j<5;j++)box(0xa6a498,0,.10+j*.106,gate+3.18-j*.43,11.3,.20+j*.212,.47);
    box(limestone,0,.60,gate,12.8,1.2,3.8);
    box(0x665e50,0,2.81,gate,12.3,3.2,3.7);
    for(const x of [-4,0,4]){
      box(timber,x,2.74,gate+1.88,3.43,3.00,.18);
      for(let i=-4;i<=4;i++)box(0x645848,x+i*.37,2.72,gate+1.983,.027,2.87,.04);
      stamp(round,0x9a453e,x,2.84,gate+2.015,.51,.055,.51,0,Math.PI/2);
      for(const shift of [-.26,0,.26])box(0x76524a,x+shift,2.85,gate+2.047,.038,.63,.02);
    }
    for(const x of [-6,-2,2,6]){
      box(limestone,x,2.86,gate+2,.36,3.38,.41);
      box(0xc0baaa,x,4.40,gate+2,.58,.33,.55);
    }
    tileRoof(T,k,0,4.53,gate,13.1,5.1,1.35,agedClay,false);
    box(0x50463d,0,5.88,gate,11.88,1.52,3.18);
    for(const side of [-1,1]){
      const z=gate+side*1.68;
      for(let j=0;j<27;j++)box(0x978574,-5.65+j*.435,5.91,z,.11,.72,.13);
      box(timber,0,6.31,z,11.9,.15,.18);
      for(const x of [-5.8,-1.97,1.97,5.8])box(timber,x,6.04,z,.27,1.26,.24);
    }
    tileRoof(T,k,0,6.61,gate,13.18,4.81,1.74,agedClay,false);
    const dragon=[[0,0],[.62,.16],[.98,.44],[1.40,.47],[1.83,.25],[2.20,.26],[2.58,.52],[2.85,.49],[3.04,.80],[3.27,.61],[3.08,.49],[3.31,.43],[3.53,.46],[3.29,.26],[3,.29],[2.78,.12],[2.48,.11],[2.10,-.06],[1.74,-.04],[1.38,.16],[1.04,.18],[.74,-.05],[.17,-.13]];
    for(const s of [-1,1]){
      outline(dragon.map(([x,y])=>[s*x,y]),0x817e70,-s*3.93,8.49,gate-.13,.26);
      const x=s*9;
      arch(0x9e9c8c,x,.18,gate,4,3.4);
      box(timber,x,1.39,gate+.07,2.68,2.46,.13);
      for(const xx of [-1.88,1.88]){
        box(limestone,x+xx,1.98,gate,.43,3.96,.71);
        box(0x98998a,x+xx,3.99,gate,.68,.25,.82);
      }
      tileRoof(T,k,x,3.69,gate,4.38,2.07,.61,agedClay,true);
    }
    stamp(round,0x967656,0,8.77,gate,.32,.18,.32,0,Math.PI/2);
  }
  (window.VietnamSights??=[]).push({
    id:'chua-dia-tang-phi-lai',name:'Chùa Địa Tạng Phi Lai',city:'Thanh Liêm',formerProvince:'Hà Nam',province:'Ninh Bình',region:'Bắc Bộ',
    description:'Từ lối vào Ninh Trung, nhìn lên chính điện tựa núi Phi Lai. Hai bên thềm có voi đá quỳ và những khoảng sân sỏi trắng xen lối đi bằng phiến đá.',
    lon:105.95182,lat:20.44505,start:[105.9524,20.445099],yaw:1.46,gardenRadius:90,width:38,depth:34,
    solids:[[0,-5,7.75,3.5],[0,-12.7,6.35,3.8],[-13.1,-6.7,4.05,3.35],[13.1,-6.7,4.05,3.35],[-4.4,5.4,1,1.32],[4.4,5.4,1,1.32]],
    photo:'https://vietnam.vnanet.vn/vietnamese/long-form/dia-tang-phi-lai-tu-diem-du-lich-van-hoa-tam-linh-297867.html',
    source:'https://vietnamtourism.gov.vn/post/47997',map:'https://www.openstreetmap.org/?mlat=20.44505&mlon=105.95182#map=19/20.44505/105.95182',build:philang
  },{
    id:'chua-ba-danh',name:'Chùa Bà Đanh',city:'Kim Bảng',formerProvince:'Hà Nam',province:'Ninh Bình',region:'Bắc Bộ',
    description:'Chùa Bà Đanh, tên chữ Bảo Sơn Tự, nằm bên sông Đáy. Tam quan có ba bộ cửa gỗ, gác chuông phía trên và đôi rồng chầu mặt nguyệt trên bờ nóc.',
    lon:105.85272,lat:20.56927,start:[105.85355,20.56868],yaw:-.74,gardenRadius:85,width:26,depth:28,
    solids:[[0,6,6.4,1.9],[-9,6,2.1,.48],[9,6,2.1,.48],[0,-8.9,7.9,3.05]],
    photo:'https://dantri.com.vn/doi-song/chua-ba-danh-ngoi-chua-menh-danh-de-nhat-vang-khach-2017111007051498.htm',
    source:'https://csdl.vietnamtourism.gov.vn/dest/?item=81',map:'https://www.openstreetmap.org/?mlat=20.56927&mlon=105.85272#map=19/20.56927/105.85272',build:baDanh
  });
})();
