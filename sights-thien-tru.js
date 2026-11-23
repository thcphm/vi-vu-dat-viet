'use strict';
(() => {
  // Site review 2026-11-22. OSM n2089305124, w768404450/453/454 (buildings),
  // w279360043 and w768404451/452/455 (approach and steps), © OpenStreetMap contributors.
  // Transverse front hall and axial return: Google Open Buildings v3, CC BY 4.0,
  // https://sites.research.google/gr/open-buildings/ . Dimensions are roof envelopes.
  // Photographic comparison: https://chuahuong.org.vn/chua-huong-xua-va-nay/
  // and https://chuahuong.org.vn/eureka-tim-lai-duoc-chua-huong/ (1996–2017 courtyard).
  // Hà Nội heritage inventory: https://hanoigo.hanoi.gov.vn/place/quan-the-huong-son-chua-huong-ctv-sa2nx5
  // Tam Bảo facade reference: Jack French, CC BY 2.0, Wikimedia Commons / Thiên Trù Pagoda.jpg.
  // Nam Thiên Môn is documented, but a survey of its individual footprint was not found.
  // The first camera therefore stands in the mapped approach between the two ranges.
  const A=window.CentralArch,sites=window.VietnamSights??=[];
  const catalogId='osm-node-2089305124',id='chua-thien-tru-huong-son';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Missing Thiên Trù catalog pin');
  const yaw=2.15,c=Math.cos(yaw),s=Math.sin(yaw);
  const wood=0x743f2e,paint=0x8c4a32,dark=0x4d382d,tile=0xb36b40,oldTile=0x8b5b43;
  const pale=0xcbc4a8,stone=0x939287,plaster=0xd1ad74,bronze=0x504e41;
  function round(k,color,x,y,z,r,h){k.stamp(k.round,color,x,y,z,r,h,r);}
  function column(k,x,z,y,h,r){
    round(k,stone,x,y+.105,z,1.46*r,.21);
    round(k,wood,x,y+.15+h/2,z,r,h);
  }
  function sculptedRoof(T,k,x,y,z,w,d,rise,ridge,lift,clay){
    // Tiled eaves sweep upwards and outwards at all four corners. Both the
    // soffit and the edge are visible from the open timber pavilion below.
    const pos=[],ring=t=>{
      const points=[];
      for(const [ax,az,bx,bz] of [[-1,-1,-1,1],[-1,1,1,1],[1,1,1,-1],[1,-1,-1,-1]]){
        for(let i=0;i<8;i++){
          const u=i/8,xx=ax+(bx-ax)*u,zz=az+(bz-az)*u,corner=Math.min(Math.abs(xx),Math.abs(zz))**4;
          points.push([x+xx*(w*.5*(1-t)+ridge*t),y+rise*(.24*t+.76*t*t)+lift*corner*(1-t),
            z+zz*d*.5*(1-t)]);
        }
      }
      return points;
    };
    function quad(a,b,c,d){pos.push(...a,...d,...b,...b,...d,...c);}
    const edge=ring(0);
    let prev=edge;
    for(const t of [.28,.56,.81,1]){
      const next=ring(t);
      for(let i=0;i<32;i++){const j=(i+1)%32;quad(prev[i],next[i],next[j],prev[j]);}
      prev=next;
    }
    for(let i=0;i<32;i++){
      const a=edge[i],b=edge[(i+1)%32],under=v=>[v[0],v[1]-.16,v[2]];
      const inner=v=>[x+(v[0]-x)*.70,y-.15,z+(v[2]-z)*.70];
      quad(a,b,under(b),under(a));quad(under(a),under(b),inner(b),inner(a));
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    g.computeVertexNormals();k.stamp(g,clay,0,0,0);g.dispose();
    for(const side of [-1,1])for(const end of [-1,1]){
      const pts=[];
      for(let j=0;j<6;j++){
        const t=j/5;
        pts.push(new T.Vector3(x+side*(w*.5*(1-t)+ridge*t),y+rise*(.24*t+.76*t*t)+lift*(1-t)+.07,
          z+end*d*.5*(1-t)));
      }
      const cap=new T.TubeGeometry(new T.CatmullRomCurve3(pts),7,.085,6,false);
      k.stamp(cap,pale,0,0,0);cap.dispose();
      k.outline([[-.42,-.21],[-.15,-.10],[.08,.14],[.22,.53],[.19,.72],[.04,.56],[-.06,.41],[-.11,.52],[-.21,.34],[-.14,.13],[-.45,-.04]],
        pale,x+side*w*.50,y+lift,z+end*d*.50,.105,side>0?0:Math.PI);
    }
    k.box(pale,x,y+rise+.06,z,Math.max(.32,2*ridge+.13),.15,.20);
  }
  function bellPavilion(T,k){
    k.box(stone,0,.12,0,10.2,.24,9.6);
    k.box(0xb6a491,0,.28,0,9.67,.18,9.12);
    const xs=[-3.77,-1.28,1.28,3.77],zs=[-3.53,-1.18,1.18,3.53];
    for(const x of xs)for(const z of zs){
      const height=Math.abs(x)<2&&Math.abs(z)<2?6.30:3.21;
      column(k,x,z,.36,height,.26);
    }
    for(const x of xs){
      k.box(wood,x,3.60,0,.24,.26,8.01);
      for(const e of [-1,1])A.strut(T,k,paint,x,3.15,e*3.45,x,3.51,e*4.10,.095);
    }
    for(const z of zs)k.box(wood,0,3.52,z,8.65,.27,.23);
    for(const [y,half] of [[4.61,2.68],[5.86,2.02]]){
      for(const e of [-1,1]){
        k.box(dark,0,y,e*half,half*2.07,.16,.17);
        k.box(dark,e*half,y,0,.17,.16,half*2.07);
      }
      for(const x of [-half,0,half])for(const z of [-half,half])round(k,wood,x,y+.36,z,.115,.72);
    }
    for(let j=0;j<8;j++){
      const a=j*Math.PI/4;
      A.strut(T,k,wood,0,4.37,0,Math.sin(a)*1.78,4.19,Math.cos(a)*1.78,.104);
    }
    round(k,pale,0,4.21,0,.32,.17);
    sculptedRoof(T,k,0,3.64,0,10.30,9.79,1.49,2.38,1.02,tile);
    sculptedRoof(T,k,0,5.06,0,7.38,7.05,1.28,1.72,.79,tile);
    sculptedRoof(T,k,0,6.36,0,5.92,5.52,1.24,1.24,.69,tile);
    // The paired small gables rising above the upper eave are visible in the
    // archive from both sides of the building.
    for(const e of [-1,1])for(const side of [-1,1]){
      k.place(side*.89,e*1.08,e>0?0:Math.PI,()=>{
        k.outline([[-.88,0],[0,.81],[.88,0]],plaster,0,6.94,.14,.28);
        k.outline([[-.54,.07],[0,.55],[.54,.07]],wood,0,6.95,.43,.05);
        A.gabledRoof(T,k,0,6.95,-.10,1.72,1.07,.83,tile,pale,{overhang:.06,thick:.09});
      });
    }
    for(const e of [-1,1])k.outline([[-.10,0],[.04,.23],[.10,.55],[.27,.70],[.33,.61],[.26,.32],[.19,.13],[.26,.02]],
      pale,e*1.24,7.60,0,.13,e>0?0:Math.PI);
  }
  function censer(T,k,x,z){
    const profile=[[.69,0],[.75,.10],[.62,.20],[.55,.35],[.99,.59],[1.02,.74],[.66,.68],[.49,.55]];
    const bowl=new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),24);
    k.stamp(bowl,0xac6d59,x,0,z);bowl.dispose();
    const petal=new T.SphereGeometry(1,8,7);
    for(let i=0;i<14;i++){
      const a=i*2*Math.PI/14;k.stamp(petal,0xbd816d,x+Math.sin(a)*.73,.53,z+Math.cos(a)*.73,.22,.35,.11,a,-.34);
    }
    petal.dispose();
    for(let i=0;i<3;i++){
      const w=1.74-i*.38,y=.71+i*.62;
      for(const side of [-1,1])for(const e of [-1,1])round(k,bronze,x+side*w*.21,y+.28,z+e*w*.21,.062,.57);
      const lid=new T.LatheGeometry([[.03,.33],[.20,.24],[.26,.14],[.43,.055],[.52,.09],[.51,.015],[.26,-.015],[.03,.10]]
        .map(([r,h])=>new T.Vector2(r*w,h)),12);
      k.stamp(lid,bronze,x,y+.50,z);lid.dispose();
    }
    round(k,bronze,x,2.72,z,.083,.55);
  }
  function tamBao(T,k){
    const w=24.1,d=10.65,base=.81,eave=3.55,upper=6.16;
    k.box(stone,0,base*.5,0,w,base,d);
    k.box(wood,0,(eave+base)/2,-d*.43,w-.47,eave-base,.28);
    for(const e of [-1,1])k.box(plaster,e*(w*.5-.34),(eave+base)/2,-.30,.40,eave-base,d-.80);
    for(let i=-3;i<=3;i++){
      const x=i*3.16;
      k.box(dark,x,base+1.32,d*.32,3.01,2.64,.16);
      for(let j=0;j<4;j++){
        const leaf=x+(j-1.5)*.74;
        k.box(wood,leaf,base+.88,d*.32+.09,.69,1.67,.08);
        for(const r of [-1,0,1])k.box(wood,leaf+r*.20,base+2.08,d*.32+.10,.051,.69,.10);
      }
    }
    for(let i=0;i<=7;i++)column(k,(i-3.5)*3.16,d*.448,base,2.71,.17);
    const carving=new T.SphereGeometry(1,12,9),sandstone=0xc1a077,shadow=0x7d6347;
    for(const side of [-1,1]){
      // The paired stone guardians sit side-on, facing the central lotus burner.
      k.place(side*7.65,4.82,-side*Math.PI/2,()=>{
        k.box(0x945d4e,0,base+.17,0,1.10,.34,1.61);
        k.box(pale,0,base+.39,0,1.16,.14,1.68);
        const ell=(x,y,z,w,h,d,color=sandstone)=>k.stamp(carving,color,x,base+y,z,w,h,d);
        ell(0,.84,-.24,.36,.42,.50);ell(0,1.02,.14,.34,.55,.31);
        for(const e of [-1,1]){
          ell(e*.22,.76,.27,.125,.35,.135);ell(e*.23,.53,.41,.15,.105,.21);
          ell(e*.25,.66,-.40,.21,.20,.29);ell(e*.20,1.65,.21,.12,.14,.10);
        }
        ell(0,1.44,.25,.37,.34,.36);
        for(let i=0;i<10;i++){
          const a=2*Math.PI*i/10;ell(Math.cos(a)*.30,1.42+Math.sin(a)*.27,.17,.115,.12,.105);
        }
        ell(0,1.37,.57,.25,.12,.19);ell(0,1.44,.65,.14,.072,.09,shadow);
        ell(0,1.21,.55,.20,.075,.14);
      });
    }
    carving.dispose();
    k.box(paint,0,eave,4.72,w-.55,.27,.26);
    sculptedRoof(T,k,0,eave+.12,0,25.1,11.77,2.41,8.40,.70,oldTile);
    const uw=13.25,uz=2.26;
    k.box(dark,0,5.57,0,uw,1.52,uz*2);
    for(const e of [-1,1]){
      for(let j=0;j<17;j++)k.box(wood,e*(2.17+j*.25),5.67,uz+.05,.083,.97,.1);
      k.box(paint,e*6.55,5.64,uz+.08,.21,1.20,.20);
    }
    A.plaque(T,k,'剎寶天香',0,5.70,uz+.13,4.02,1.05,{bg:'#d5a349',fg:'#4e3124',border:0x835339});
    sculptedRoof(T,k,0,upper,0,14.70,5.88,1.66,5.8,.68,oldTile);
  }
  function range(T,k,length,depth){
    k.box(stone,0,.15,0,length,.30,depth);
    k.box(plaster,0,1.62,-depth*.39,length-.4,2.70,.30);
    for(const e of [-1,1])k.box(plaster,e*(length*.5-.21),1.62,0,.33,2.70,depth*.80);
    const bays=Math.max(2,Math.round(length/3.1));
    for(let i=0;i<=bays;i++)column(k,(i/bays-.5)*(length-.55),depth*.38,.30,2.56,.135);
    k.box(wood,0,2.97,depth*.38,length-.4,.22,.21);
    A.curvedRoof(T,k,0,3.06,0,length,depth,1.73,tile,pale,pale,.34);
  }
  function guardianTower(T,k){
    k.box(stone,0,.17,0,8.05,.34,8.05);
    k.box(plaster,0,1.73,0,6.73,2.84,6.73);
    for(let i=0;i<3;i++){
      const y=3.12+i*2.21,w=8.48-i*.45,post=w*.344;
      k.box(stone,0,y-.10,0,w*.82,.23,w*.82);
      for(const e of [-1,1])for(const side of [-1,1])column(k,e*post,side*post,y,1.85,.16);
      for(const e of [-1,1]){
        k.box(pale,0,y+.64,e*post,post*2,.095,.105);k.box(pale,e*post,y+.64,0,.095,.095,post*2);
        for(let j=-3;j<=3;j++){
          k.box(pale,j*post/3,y+.32,e*post,.075,.55,.08);k.box(pale,e*post,y+.32,j*post/3,.08,.55,.075);
        }
      }
      sculptedRoof(T,k,0,y+1.65,0,w,w,1.36,.12,.63,tile);
    }
    for(let j=0;j<10;j++)round(k,bronze,0,10.53+j*.094,0,.19-j*.012,.073);
  }
  function build(T,k){
    const f=createTempleFoundations(T,k);
    const paving=0xad8167;
    k.palette({tile:[tile,oldTile],timber:[wood,paint,dark],stone:[stone,pale],brick:paving,plaster});
    // The terrain raster samples the wooded hillside across the courtyard.
    // All structures sharing a terrace use the same level; outside its surveyed
    // perimeter the stone retaining walls return to the original DEM.
    const datum=g=>g(0,0)-.48;
    function building(x,z,angle,w,d,level,draw){
      const anchor=f.building(x,z,angle,w,d,draw);
      anchor.elevation=g=>datum(g)+level;
      return anchor;
    }
    function court(x,z,w,d,level){
      building(x,z,0,w,d,level,()=>k.box(paving,0,.055,0,w,.12,d));
    }
    function steps(x,z,endZ,width,top,low,n){
      for(let i=0;i<n;i++){
        const a=i/n,b=(i+1)/n,tread=(endZ-z)/n,mid=z+.5*(a+b)*(endZ-z);
        const level=top+(low-top)*a;
        building(x,mid,0,width,tread,level,()=>k.box(stone,0,-.005,0,width,.14,tread+.012));
      }
    }
    building(7.48,11.13,.052,24.1,10.65,3.15,()=>tamBao(T,k));
    steps(7.86,16.1,22.9,23.6,3.94,1.44,12);
    building(5.66,.81,.052,11.60,9.70,3.15,()=>{
      k.box(plaster,0,2,0,10.53,4,9.4);
      k.place(0,0,Math.PI/2,()=>sculptedRoof(T,k,0,4,0,10.42,11.63,2.12,2.65,.34,oldTile));
    });
    f.fixture(g=>datum(g)+3.94,()=>censer(T,k,7.87,16.48));
    building(11.33,57.44,-.031,10.20,9.60,1.46,()=>bellPavilion(T,k));
    steps(11.21,62.19,64.24,9.15,1.80,1.43,3);
    steps(11.48,50.69,52.70,9.15,1.47,1.80,3);
    for(const [x,z,len,side] of [[26.99,78.02,11.5,1],[-5.03,78.39,9.9,-1]]){
      // The towers are set into the elbows of the two L-shaped surveyed ranges.
      building(x,z,0,8.05,8.05,.67,()=>guardianTower(T,k));
      building(x+side*(4.05+len*.5),z,0,len,9.66,.67,()=>range(T,k,len,9.66));
      building(x+.27,z+18.14,side<0?Math.PI/2:-Math.PI/2,28.0,10.76,.25,()=>range(T,k,28.0,10.76));
    }
    court(9.08,44.91,22.25,44.03,1.34);
    court(10.12,69.97,21.37,6.19,1.34);
    court(10.12,85.02,21.45,10.91,.13);
    court(10.35,103.16,21.12,14.38,-.83);
    // The steps crossing the longitudinal walkway are w768404452 and w768404455.
    steps(10.12,72.97,79.57,21.45,1.44,.24,9);
    steps(10.24,90.40,96.0,21.18,.24,-.72,8);
    const ball=new T.SphereGeometry(1,10,8);
    for(const side of [-1,1]){
      const x=10.70+side*8.97;
      f.fixture(g=>datum(g)+1.47,()=>{
        k.box(stone,x,.10,57.85,.28,.2,20.8);
        for(let i=0;i<=10;i++){
          const z=47.50+i*2.07;
          k.box(stone,x,.47,z,.27,.88,.29);k.stamp(ball,pale,x,.96,z,.15,.16,.15);
          if(i<10){
            k.box(pale,x,.73,z+1.035,.155,.17,2.07);
            for(let j=1;j<=4;j++)k.box(pale,x,.41,z+j*.414,.105,.52,.105);
          }
        }
      });
    }
    ball.dispose();
    // Tree rows and planted pots flank the two courts in the temple photographs.
    const trees=window.createTreeModels(T);
    for(const [x,z,height,spread,level] of [[-1.4,26.1,5.1,3.7,1.48],[18.6,26.5,5.8,3.8,1.48],
      [-1.3,39.6,5.4,4.2,1.48],[18.9,39.0,5.6,4.1,1.48],
      [-.56,66.1,5.95,3.85,1.48],[19.9,66.4,5.9,3.8,1.48],
      [1.4,87.9,4.7,3.6,.28],[18.7,87.7,4.6,3.7,.28]]){
      let mesh;
      f.fixture(g=>datum(g)+level,()=>{
        round(k,0x976b55,x,.27,z,.70,.54);
        trees.grove(k.group,[[x,.31,z,spread,height,(x+z)*.6]]);
        mesh=k.group.children.at(-1);
      },h=>{mesh.position.y=h;});
    }
  }
  function view(name,x,z,height,viewRadius,angle,viewElevation){
    return {name,offset:[c*x+s*z,-s*x+c*z],height,viewBase:'monument',viewRadius,viewAngle:yaw+angle,viewElevation};
  }
  sites.push({...pin,id,catalogId,name:'Chùa Thiên Trù – Hương Sơn',yaw,width:63,depth:118,
    source:'https://www.chuahuong.vn/chua-thien-tru_dmtt63_cttt36_vn.aspx',
    photo:'https://commons.wikimedia.org/wiki/File:Thi%C3%AAn_Tr%C3%B9_Pagoda.jpg',
    description:'Từ lối vào sân Thiên Trù, đi giữa hai dãy tả, hữu vu để đến gác chuông gỗ. Sau gác chuông là bậc đá lên tòa Tam Bảo, nơi treo hoành phi Hương Thiên Bảo Sát dưới tầng mái trên.',
    start:pin.start??[105.7877197,20.614076],arrivalNote:'Xe dừng cạnh bến xe Hương Sơn. Từ đây, du khách đi bộ hoặc đi xe điện ra Bến Yến, đi đò theo suối Yến đến bến Trò rồi đi bộ lên chùa Thiên Trù.',
    approachMeters:undefined,mappedEntrance:true,visitOnArrival:true,gardenRadius:23,
    boundary:[[-5.9,-4.9],[12.4,-5.8],[12.8,4.1],[20.4,3.8],[21.3,17.8],[17,22.9],[17.9,64.3],[43.4,71.7],[43.4,83.8],[33.6,84],[33.7,111.0],[-11.8,111.8],[-12.4,85.1],[-19.9,84.8],[-20.4,72.7],[3.7,68.4],[2.0,23.5],[-6.3,19.0]],
    reserve:(x,z,r)=>x>-5.7-r&&x<20.5+r&&z>-4.9-r&&z<71+r||x>-19.6-r&&x<43+r&&z>71-r&&z<111+r,
    modeledBuildings:['w768404450','w768404453','w768404454'],
    solids:[[7.4,10.8,11.6,4.75],[5.66,.81,5.13,4.47],[26.98,96.3,4.7,13.75],[-4.80,96.5,4.7,13.75]],
    views:[view('Lối vào sân giữa tả vu và hữu vu',10.4,76,8.5,38,.015,.21),
      view('Gác chuông trên sân Thiên Trù',11.33,57.44,10.25,17.6,-2.99,.13),
      view('Tam Bảo và hoành phi Hương Thiên Bảo Sát',7.48,11.13,13.05,23,.06,.09)],build});
})();
