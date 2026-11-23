'use strict';
(() => {
  const K=globalThis.VietnamKarst,A=globalThis.CentralArch,sites=window.VietnamSights??=[];
  const heritage='https://dsvh.gov.vn/danh-lam-thang-canh-ho-ba-be-2967';
  const database='https://csdl.vietnamtourism.gov.vn/dest/?item=';
  // OSM w591309599 (Gia Mải). Offsets in metres from the island pin.
  const shore=[[-14,-29],[-23,-24],[-28,-18],[-38,-11],[-32,-9],[-31,1],[-23,7],[-10,12],[2,9],[8,13],
    [17,22],[24,26],[26,19],[34,17],[35,8],[29,5],[22,10],[16,1],[5,-7],[-5,-23]];
  function widowIslet(T,k){
    const rock=K.batch(T);
    function section(x){
      const hits=[];
      for(let i=0;i<shore.length;i++){
        const [ax,az]=shore[i],[bx,bz]=shore[(i+1)%shore.length];
        if((ax<=x&&bx>x)||(bx<=x&&ax>x))hits.push(az+(bz-az)*(x-ax)/(bx-ax));
      }
      return [Math.min(...hits),Math.max(...hits)];
    }
    function land(x,t){
      const [lo,hi]=section(x),cross=Math.sin(t*Math.PI);
      return [x,-.24+Math.min(9.0,(hi-lo)*.34)*Math.pow(cross,.49)*(.63+.36*Math.exp(-((x+17)**2)/240)),lo+t*(hi-lo)];
    }
    rock.grid(73,26,(u,v)=>{
      const x=-37.96+72.92*u,p=land(x,1-v);
      return [...p,p[1]>1.9?0x747352:0x99998a,.88+.12*Math.sin(x*.54+v*11)];
    });
    for(let i=0;i<70;i++){
      const x=-35+k.random()*67,t=i%2?.035+k.random()*.12:.84+k.random()*.12,[,y,z]=land(x,t);
      K.boulder(rock,x,y-.5,z,.7+k.random()*1.6,.60+k.random()*1.5,.9+k.random()*1.45,i*.73,true);
    }
    for(let i=0;i<67;i++){
      const x=-34+k.random()*65,t=.13+.74*k.random(),[,y,z]=land(x,t);
      const h=(x<0?5.8:3.4)+k.random()*4.4;
      rock.trees.push([x,y-.48,z,h*.87,h,k.random()*6.28]);
    }
    K.finish(T,k,rock,()=>0);
  }
  const gia=window.VietnamTourism.byId.get('osm-way-591309599');
  sites.push({...gia,id:'dao-ba-goa-ba-be',catalogId:'osm-way-591309599',name:'Đảo Bà Góa – Pò Giả Mải',
    width:74,depth:55,yaw:0,solids:[],foundationAt:[-42,-11],gardenRadius:49,visitOnArrival:true,
    description:'Giữa hồ Ba Bể, dải đá nhỏ kéo từ khối cây cao phía tây bắc tới một đuôi đảo thấp. Người Tày gọi đảo là Pò Giả Mải.',
    source:database+'752',photo:database+'752',views:[
      {name:'Dáng đảo giữa mặt hồ',offset:[-2,0],height:12,viewRadius:95,viewAngle:-.26,viewElevation:.22},
      {name:'Bờ đá và tán cây',offset:[-15,4],height:6,viewRadius:35,viewAngle:.11,viewElevation:.10}
    ],build:widowIslet});
  // The northwest portal coincides with the end of underground river way
  // 482808255. Its other end lies 332 m southeast. Model the visitor's mouth
  // and its opening stretch using that bearing and the published scale.
  const puongSections=[[0,0,15,26,-.52],[6,.65,15.7,30,-.55],[17,.7,14.2,29.4,-.58],[34,-1.65,14.4,27.6,-.58],[52,-1.5,13.4,25.9,-.62]];
  K.register(sites,1888768316,{caveOpening:{sections:puongSections,approach:31},name:'Động Puông',yaw:-2.24,width:88,depth:88,mappedEntrance:true,
    source:'https://dantoc.vietnamtourism.gov.vn/en/exploring-puong-cave-in-bac-kan-province/',
    description:'Sông Năng xuyên qua núi đá vôi Lũng Nham. Từ phía hạ lưu có thể nhìn dọc theo mặt nước dưới vòm cửa tây bắc.',
    shots:[['Vòm đá bên sông Năng',0,-2,25,68,.06,.095],['Dọc dòng nước dưới vòm',1,-10,12,32,-.25,.07]]},
    (T,k)=>{
      const r=K.batch(T);
      K.grotto(r,puongSections,42,26.2,1.77);
      K.river(T,k.group,[-52,38],z=>z<0?1.3*Math.sin(-z*.09):z*.03,z=>z>0?13.5+z*.045:12.8,false,38);
      for(let i=0;i<28;i++){
        const z=-42+65*k.random(),side=i%2?-1:1;
        K.boulder(r,side*(14.0+4*k.random()),.47,z,1.4+2.5*k.random(),1.4+3.1*k.random(),1.2+2*k.random(),i*.55);
      }
      for(let i=0;i<41;i++){
        const x=(k.random()-.5)*23,z=-2-k.random()*30;
        const roof=26*Math.sqrt(Math.max(.1,1-(x/15.4)**2));
        const radius=.14+1.05*k.random(),length=1.5+5.6*k.random();
        r.grid(8,5,(u,v)=>[x+Math.cos(u*Math.PI*2)*radius*(1-v+.04),roof-v*length,z+Math.sin(u*Math.PI*2)*radius*(1-v+.04),0xb3a995,.71+.15*Math.cos(u*12)]);
      }
      K.finish(T,k,r,(ground,x,z)=>Math.min(1.9,Math.max(-1.9,ground(x*.24,z*.12))));
    });
  const huaMaSections=[[0,0,1.52,5.0,.12],[3,.17,2.25,6.4,.12],[8,1.1,5.4,10.2,.08],[17,1.9,7.3,13.4,.11],[30,.77,8.65,14.8,.13]];
  K.register(sites,4879886024,{caveOpening:{sections:huaMaSections,approach:5},name:'Động Hua Mạ',source:database+'758',yaw:2.71,width:31,depth:40,mappedEntrance:true,
    description:'Lối bậc trên núi Cô Đơn đưa khách tới cửa hẹp. Qua cửa, lòng động mở rộng dần, có các rèm và cột thạch nhũ.',
    shots:[['Những bậc cuối trước cửa động',0,.7,5.7,13,.12,.12],['Rèm nhũ phía trong',3.9,-15.5,20.8,6.4,-.95,-.08]]},
    (T,k)=>{
      const r=K.batch(T);
      K.grotto(r,huaMaSections,14,13.8,.84);
      // The rock shelf reaches the mapped stairway on the hillside. Give the
      // threshold a landing so the top step meets the chamber floor.
      r.grid(24,12,(u,v)=>{
        const x=(u-.5)*7.4,z=-.4+6*v,edge=Math.abs(2*u-1);
        return [x,.08-Math.max(0,z-.72)*.35-edge**3*.37,z,0x928a76,.83+.07*Math.cos(x*5+z*2)];
      });
      // A thin sheet of calcite folds back on itself. Mineral bands and the
      // scalloped lower edge follow the same folds on both sides.
      for(let i=0;i<2;i++){
        r.grid(108,14,(u,v)=>{
          const z=-9.7-u*11.8,fold=Math.sin(u*45+.27*Math.sin(u*17)),top=12.6+3.0*u;
          const edge=7.0+1.05*Math.cos(5.1*u+i)+.83*Math.sin(u*21+.6*i)+.42*Math.cos(u*45);
          const x=2.34+i*1.05+u*3.05+.73*fold*(.70+.30*v)+.23*Math.sin(18*u+1.8*v);
          const band=Math.cos(u*44+.62*v),tint=band>.60?0xd7b98d:band<-.52?0xb28b63:0xcbb18b;
          return [x,top+(edge-top)*v,z+.16*fold,tint,.72+.23*(.5+.5*Math.cos(u*45+.45))];
        });
      }
      for(let i=0;i<7;i++)k.box(0x929185,0,-.18-i*.135,1.1+i*.37,2.55,.32,.43);
      K.finish(T,k,r,(h,x,z)=>Math.max(-.9,Math.min(2.4,h(x*.55,z*.31))));
    });
  // Way 482791222 runs from NE to SW through the mapped waterfall node.
  // Reconstruct the cascade of rock bars next to the end of footpath 504578166.
  K.register(sites,4755846850,{name:'Thác Đầu Đẳng',source:heritage,yaw:-.985,width:56,depth:110,
    description:'Sông Năng dồn qua những khối đá lớn ở Đầu Đẳng. Các luồng nước trắng tách ra giữa những mỏm đá rồi nhập lại ở hạ lưu.',
    shots:[['Từ phía đường mòn trên bờ',0,-2,12.5,58,-2.08,.41],['Các lạch nước qua bãi đá',-1,13,7.5,41,.65,.22]]},
    (T,k)=>{
      const r=K.batch(T),water=K.batch(T);
      const boulders=[];
      for(let i=0;i<64;i++){
        const x=(k.random()-.5)*42,z=(k.random()-.5)*95;
        if(Math.abs(x+4*Math.sin(z*.12))<5.3&&i%4!==0)continue;
        const w=1.15+3.6*k.random(),d=1.8+4.75*k.random(),h=1.2+2.7*k.random();
        boulders.push([x,z,w,d]);K.boulder(r,x,1.28-z*.043,z,w,h,d,i*1.77,Math.abs(x)>14);
      }
      water.grid(38,92,(u,v)=>{
        const z=-50+100*v,x=(u-.5)*(40.2+4.2*Math.sin(z*.08));
        let wake=0;
        for(const [bx,bz,w,d] of boulders){
          if(z<bz||z>bz+d+5||Math.abs(x-bx)>w+2)continue;
          wake=Math.max(wake,Math.max(0,1-Math.abs(Math.hypot((x-bx)/(w+.4),(z-bz)/(d+3))-.99)*3.5));
        }
        const wave=Math.sin(z*2.52+x*.75)*.074+Math.sin(z*.68-x*.64)*.083;
        return [x,1.29-.043*z+wave+wake*.22,z,wake>.67?0xd3ddd1:wake>.2?0x9eb6ac:0x5e8276,.86+.10*Math.sin(x*.5-z*.83)];
      });
      water.add(k.group,new T.MeshPhongMaterial({vertexColors:true,shininess:39,specular:0x829f98,side:T.DoubleSide}));
      K.finish(T,k,r,(h,x,z)=>Math.max(-1,Math.min(1,h(x*.28,z*.18))));
    });
  const temple=window.VietnamTourism.byId.get('osm-node-4757530337');
  const templeSource='https://thainguyen.gov.vn/di-tich-danh-lam-thang-canh/den-an-ma-292481';
  sites.push({...temple,id:'den-an-ma-ba-be',catalogId:temple.id,name:'Đền An Mạ',width:15.2,depth:11,yaw:1.34,
    visitOnArrival:true,solids:[[0,-1.0,6.57,3.55]],source:templeSource,
    photo:'https://baothainguyen.vn/van-hoa/202603/co-kinh-den-an-ma-3a977c7/',
    description:'Ngôi đền trên đảo An Mạ có mái ngói thấp và hiên gỗ mở ra sân. Hội đền là một phần sinh hoạt tín ngưỡng của cư dân vùng hồ.',
    views:[{name:'Hiên gỗ giữa đảo',offset:[0,0],height:5.8,viewAngle:1.51,viewElevation:.12,viewRadius:24},
      {name:'Dưới mái ngói',offset:[2.6,.8],height:4.38,viewAngle:.94,viewElevation:.07,viewRadius:14}],
    build(T,k){
      const f=createTempleFoundations(T,k),wood=0x774d38,tile=0x9c5b41,stone=0xa69a83,door=0x614332;
      k.palette({timber:[wood,door],tile,stone});
      const pad=f.building(0,0,0,13.9,9.9,()=>{
        k.box(stone,0,.30,0,13.9,.60,9.9);
        k.box(0x4a342a,0,2.37,-4.75,13.15,3.56,.38);
        for(const side of [-1,1])k.box(wood,side*6.40,2.37,-1.26,.34,3.56,7.28);
        k.box(0x704032,0,1.10,-3.55,2.94,.94,.85);
        k.box(0xba8b4b,0,1.64,-3.55,3.17,.14,.96);
        for(const x of [-5.8,-1.95,1.95,5.8]){
          k.stamp(k.round,stone,x,.76,4.47,.64,.32,.64);
          k.stamp(k.round,wood,x,2.52,4.47,.44,3.71,.44);
          k.box(wood,x,4.24,4.34,.84,.24,.72);
          k.stamp(k.round,0xb64330,x,3.56,4.76,.46,.45,.46);
          k.box(0xcb9959,x,3.25,4.76,.045,.20,.045);
        }
        for(const x of [-3.89,0,3.89]){
          for(const side of [-1,1]){
            k.box(door,x+side*1.38,2.36,2.62,.62,3.18,.16);
            for(let i=0;i<4;i++)k.box(wood,x+side*1.38+(i-1.5)*.13,2.99,2.71,.05,1.08,.045);
          }
        }
        k.box(wood,0,4.24,4.47,13.75,.39,.42);
        A.gabledRoof(T,k,0,4.5,0,15.2,11,2.2,tile,0x98654c,{alongX:true});
        for(let i=1;i<16;i++){
          const z=i*.36,y=6.70-z*(2.2/5.85);
          for(const side of [-1,1])k.box(i%3===0?0x99624a:0xa16a50,0,y,side*z,15.68,.045,.12);
        }
      });
      f.stairs(pad,0,4.95,0,9.1,10.7,.59,10);
    }
  });
})();
