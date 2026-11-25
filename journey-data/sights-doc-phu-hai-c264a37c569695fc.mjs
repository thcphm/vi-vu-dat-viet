const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='nha-doc-phu-hai-go-cong',catalogId='osm-way-1272644423';
  const raw=window.VietnamTourism.byId.get(catalogId);
  const source='https://dulich.dongthap.gov.vn/vi/nhadocphuhai';
  const gallery='https://mediadulich.dongthap.gov.vn/resources/portal/Images/TGG/superadminportal1.tgg/public/diadiem/docphuhai/';
  // w1272644423 traces the roofs, including the three projecting parts of the
  // northern façade. It encloses an open court between the house and granary.
  // n8317492909 is where access w894804253 meets Hai Bà Trưng (w303899242).
  // https://www.openstreetmap.org/way/1272644423
  // https://www.openstreetmap.org/way/894804253
  // https://www.google.com/maps/@10.36172,106.67515,190m/data=!3m1!1e3
  // https://dongthap.gov.vn/web/sgddt/tin-tuc/chi-tiet?id=3628791
  // Provincial photographs document the pediments, recessed arcades, timber
  // shutters, wrought-iron fence and inner court. Elevations are estimates.
  const yaw=-160*Math.PI/180,cs=Math.cos(yaw),sn=Math.sin(yaw),A=window.CentralArch;
  const yellow=0xdca24d,sun=0xefbd66,pale=0xe1daca,aged=0xb6ac98,shadow=0x807668;
  const tile=0x805346,timber=0x594137,ebony=0x45392e,stone=0xa09b8f,iron=0x514e45;
  const sides=[-1,1],axis=4.65,front=24.15;
  function roof(T,k,x,z,w,d,eave,rise,tint,alongX=true){
    const long=alongX?w:d,short=alongX?d:w,r=Math.max(.12,(long-short*.89)*.5);
    const a=[-long*.5,eave,-short*.5],b=[long*.5,eave,-short*.5],c=[long*.5,eave,short*.5],j=[-long*.5,eave,short*.5];
    const l=[-r,eave+rise,0],h=[r,eave+rise,0],p=[];
    const tri=(a,b,c)=>p.push(...a,...b,...c);
    tri(a,l,h);tri(a,h,b);tri(b,h,c);tri(j,c,h);tri(j,h,l);tri(j,l,a);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();
    k.place(x,z,alongX?0:Math.PI/2,()=>{
      k.stamp(g,tint,0,0,0);
      for(const [u,v] of [[a,l],[b,h],[c,h],[j,l],[l,h]])A.strut(T,k,ridgeColour(tint),...u,...v,.096);
      k.box(0x534238,0,eave-.10,0,long,.20,short);
    });g.dispose();
  }
  function ridgeColour(tint){return tint===tile?0x725045:0x97705a;}
  function shutter(k,x,z,w,h,y=.53){
    k.box(ebony,x,y+h/2,z,w,h,.16);
    for(const s of sides){
      const dx=x+s*w*.24;
      k.box(timber,dx,y+h/2,z+.10,w*.455,h-.10,.081);
      for(let i=0;i<12;i++)k.box(0x503e33,dx,y+h*(.48+i*.04),z+.155,w*.38,.033,.048,0,-.19);
      k.box(0x624c3b,dx,y+h*.26,z+.154,w*.33,h*.30,.035);
    }
  }
  // The archivolts have a moulded band and a small foliate keystone. Use
  // actual holes in the masonry so the covered gallery reads from the side.
  function arch(T,k,x,z,w,wallTop,rise,spring,depth,tint=yellow,trim=pale){
    const r=w*.41,sh=new T.Shape();
    sh.moveTo(-w/2,0);sh.lineTo(-r,0);sh.lineTo(-r,spring);
    sh.absellipse(0,spring,r,rise,Math.PI,0,true);sh.lineTo(r,0);
    sh.lineTo(w/2,0);sh.lineTo(w/2,wallTop);sh.lineTo(-w/2,wallTop);sh.closePath();
    k.profile(sh,tint,x,0,z-depth,depth);
    const ring=(dr,dy,th,col)=>{
      const pts=[];
      for(let i=0;i<=16;i++){const a=i*Math.PI/16;pts.push([(r+dr)*Math.cos(a),spring+(rise+dy)*Math.sin(a)]);}
      for(let i=16;i>=0;i--){const a=i*Math.PI/16;pts.push([(r+dr-th)*Math.cos(a),spring+(rise+dy-th)*Math.sin(a)]);}
      k.outline(pts,col,x,0,z+.014,.065);
    };
    ring(.095,.095,.083,trim);ring(.205,.20,.050,aged);
    for(const s of sides){
      const u=x+s*(r+(w/2-r)/2);
      k.box(trim,u,spring,z+.015,w/2-r+.096,.105,depth+.15);
    }
    k.outline([[-.12,-.015],[-.18,.16],[-.11,.27],[0,.23],[.11,.27],[.18,.16],[.12,-.015],[0,-.105]],
      trim,x,spring+rise+.12,z+.091,.072);
  }
  function balusters(T,k,x,z,length,y,h,tint=pale){
    const geo=new T.LatheGeometry([[.072,0],[.087,.08],[.044,.29],[.081,.48],[.041,.76],[.078,.91],[.083,1]]
      .map(([r,v])=>new T.Vector2(r,h*v)),6);
    const count=Math.max(2,Math.floor(length/.245));
    for(let i=0;i<count;i++)k.stamp(geo,tint,x+((i+.5)/count-.5)*length,y,z);
    geo.dispose();
    k.box(sun,x,y-.065,z,length,.13,.28);k.box(pale,x,y+h+.04,z,length,.08,.27);
  }
  function bead(T,k,x,y,z,scale){
    const ball=new T.SphereGeometry(1,8,5);
    k.stamp(ball,aged,x,y,z,scale*.52,scale*.62,scale*.18);
    k.stamp(ball,pale,x,y+.025*scale,z+.08*scale,scale*.39,scale*.49,scale*.15);
    for(let j=0;j<8;j++){
      const a=Math.PI*j/4;
      k.stamp(ball,j%2?pale:aged,x+Math.sin(a)*scale*.59,y+Math.cos(a)*scale*.63,z,
        scale*.19,scale*.28,scale*.14,0,0,-a);
    }
    ball.dispose();
  }
  function pediment(T,k,x,z,w,large){
    const bottom=large?5.28:5.03,top=bottom+(large?1.75:1.05),half=w/2;
    const rise=top-bottom,curve=u=>large?bottom+rise*(1-u*u):top-rise*Math.abs(u);
    const band=[];
    for(let i=0;i<=20;i++){const u=i/10-1;band.push([u*half,curve(u)]);}
    k.outline([[-half,bottom-.08],[half,bottom-.08],...band.slice().reverse()],sun,x,0,z-.27,.32);
    for(const [drop,tint] of [[0,shadow],[.085,pale],[.18,aged]]){
      const pts=band.map(([a,b])=>[a,b-drop]);pts.push(...band.slice().reverse().map(([a,b])=>[a,b-drop-.068]));
      k.outline(pts,tint,x,0,z+.066,.075);
    }
    for(const y of [bottom-.095,bottom+.035])k.box(pale,x,y,z+.03,w+.15,.083,.36);
    if(large){
      // A curved broken-up coronation around a central cartouche and floral
      // frieze is visible in the province's close photograph (ndph5).
      for(const s of sides){
        const dx=x+s*(half-.12);
        k.box(yellow,dx,bottom+.48,z,.43,1.26,.57);
        for(const [v,h,t] of [[bottom+.91,.12,aged],[bottom+1.04,.13,pale],[bottom+1.14,.08,sun]])
          k.box(t,dx,v,z,.54,h,.64);
        k.outline([[-.94,-.05],[-.90,.22],[-.75,.39],[-.51,.44],[-.31,.37],[-.16,.56],[.01,.57],
          [.11,.42],[.31,.46],[.45,.36],[.58,.31],[.72,.18],[.91,.16],[.96,-.05]],pale,
          x+s*(half*.43),bottom+.14,z+.13,.085,s===1?0:Math.PI);
        for(const [j,dy,sc] of [[.31,.40,.27],[.53,.32,.21],[.70,.22,.19]])
          bead(T,k,x+s*j*half,bottom+dy,z+.22,sc);
      }
      // The pale centre links the blossom frieze below to the shell at the
      // crest, leaving ochre recesses either side of its scrolls.
      const stem=new T.Shape();
      stem.moveTo(-.17,bottom+.37);stem.quadraticCurveTo(.01,bottom+.93,-.47,bottom+1.08);
      stem.quadraticCurveTo(-.70,bottom+1.19,-.84,bottom+.97);
      stem.quadraticCurveTo(-.85,bottom+1.40,-.53,bottom+1.39);
      stem.quadraticCurveTo(-.15,bottom+1.40,-.08,top+.02);
      stem.lineTo(.08,top+.02);stem.quadraticCurveTo(.15,bottom+1.40,.53,bottom+1.39);
      stem.quadraticCurveTo(.85,bottom+1.40,.84,bottom+.97);
      stem.quadraticCurveTo(.70,bottom+1.19,.47,bottom+1.08);
      stem.quadraticCurveTo(-.01,bottom+.93,.17,bottom+.37);stem.closePath();
      k.profile(stem,pale,x,0,z+.12,.085);
      bead(T,k,x,bottom+.45,z+.20,.40);
      for(const s of sides)k.outline([[-.10,-.05],[.05,.22],[.24,.36],[.36,.30],[.25,.14],[.48,.03],[.70,.15],[.58,-.06],[.30,-.15]],aged,
        x,top+.09,z+.17,.07,s===1?0:Math.PI);
      k.outline([[-.17,-.04],[-.20,.12],[-.11,.32],[0,.53],[.06,.34],[.18,.24],[.20,.10],[.14,-.04]],pale,x,top+.07,z+.20,.11);
    }else bead(T,k,x,bottom+.42,z+.10,.16);
  }
  function facade(T,k){
    const span=23.1,half=span/2,doorX=9.64,centre=4.26,zC=2.86,zD=1.63;
    k.box(stone,0,.21,-2.42,span,.42,5.10);
    k.box(yellow,0,2.40,-3.41,span,3.98,.32);
    shutter(k,0,-3.18,2.38,3.05,.52);
    for(const x of [-8.85,-4.83,4.83,8.85])shutter(k,x,-3.17,1.44,2.71);
    const gallery=(w,z,len)=>{
      for(let i=0;i<len;i++)arch(T,k,(i-(len-1)/2)*w/len,z,w/len,4.63,.62,2.53,.34);
      k.box(aged,0,4.35,z,w,.19,.44);k.box(pale,0,4.53,z,w,.11,.47);
      balusters(T,k,0,z,w,4.71,.42);balusters(T,k,0,z,w,.48,.55);
    };
    for(const s of sides){
      const end=doorX-1.89,begin=centre/2,w=end-begin;
      k.place(s*(begin+w/2),0,0,()=>gallery(w,0,4));
      k.place(s*begin,zC/2,s*Math.PI/2,()=>gallery(zC,.01,2));
      k.place(s*end,zD/2,-s*Math.PI/2,()=>gallery(zD,0,1));
      const x=s*doorX,wD=3.82;
      k.box(yellow,x,2.54,-1.08,wD,4.7,5.43);
      shutter(k,x,zD+.045,1.54,2.89);
      for(const side of sides){
        k.box(pale,x+side*.87,2.01,zD+.13,.13,3.12,.16);
        k.box(sun,x+side*1.71,2.56,zD+.04,.24,4.76,.19);
      }
      k.box(pale,x,3.55,zD+.14,1.94,.14,.18);
      k.box(pale,x,4.34,zD+.13,1.48,.42,.13);bead(T,k,x,4.34,zD+.22,.30);
      pediment(T,k,x,zD,wD,false);
      for(let j=0;j<3;j++)k.box(stone,x,.095+.071*j,zD+1.04-.27*j,1.93,.19+.142*j,.35);
    }
    arch(T,k,0,zC,centre,5.29,1.48,2.65,.53,sun);
    for(const s of sides){
      const x=s*(centre/2-.24);
      k.box(sun,x,2.58,zC+.075,.31,4.83,.20);
      for(const y of [.37,1.02,4.79,5.19])k.box(pale,x,y,zC+.12,.48,.13,.31);
      bead(T,k,x,4.56,zC+.20,.21);
    }
    k.box(stone,0,.245,zC/2,centre,.49,zC);
    for(let j=0;j<3;j++)k.box(stone,0,.10+.075*j,zC+.83-.263*j,centre-.19,.20+.15*j,.36);
    pediment(T,k,0,zC,centre,true);bead(T,k,0,4.37,zC+.17,.29);
    // The bright parapet hides the outer veranda's low roof.
    k.box(0x514637,0,4.15,-1.65,span-.18,.22,3.43);
    k.box(0x514637,0,4.74,1.34,centre-.28,.17,2.93);
    for(const s of sides)k.box(yellow,s*(half-.16),2.50,-4.68,.32,4.60,6.3);
  }
  function courtWing(T,k,x,z,w,d,frontWidth,dir){
    k.box(yellow,x,1.93,z,w-.40,3.64,d-.38);
    k.place(x,z,dir,()=>{
      const face=(dir===0||Math.abs(dir)===Math.PI?d:w)/2;
      k.box(ebony,0,1.73,face-.16,frontWidth-.35,3.05,.12);
      for(let i=-1;i<=1;i++)arch(T,k,i*frontWidth/3,face+.14,frontWidth/3,3.83,.70,2.43,.37);
      for(let i=-1;i<=1;i++)shutter(k,i*frontWidth/3,face-.065,frontWidth*.18,2.38,.42);
      k.box(pale,0,3.85,face+.10,frontWidth,.14,.50);
      k.box(stone,0,.19,face+.46,frontWidth+.20,.37,.80);
    });
    roof(T,k,x,z,w+.23,d+.22,3.92,1.82,tile,w>=d);
  }
  function court(T,k){
    // Two tiled side houses turn their arcades toward one another. The long
    // rice store closes the southern end of the complex.
    courtWing(T,k,18.68,-2.28,9.55,8.46,8.45,-Math.PI/2);
    courtWing(T,k,-12.28,-2.73,9.31,9.47,9.45,Math.PI/2);
    const x=3.12,z=-14.89,w=39.78,d=13.68;
    k.box(yellow,x,2.07,z,w-.36,3.83,d-.35);
    k.box(0x594336,axis,1.82,z+d/2-.06,16.2,3.01,.16);
    for(let i=-2;i<=2;i++){
      arch(T,k,axis+3.09*i,-7.72,3.09,3.86,.83,2.19,.45);
      shutter(k,axis+3.09*i,-7.99,1.88,2.36,.35);
    }
    k.box(pale,axis,3.92,-7.75,15.56,.14,.53);
    roof(T,k,x,z,w,d,4.02,2.67,0xa8755b);
    k.deck(0x9a9183,5.36,.068,-2.9,17.23,.13,9.95);
  }
  function gate(T,k){
    // Iron leaves and low spear railings are visible in the province's street
    // photograph h09. The local fence is about 6 metres back from the
    // Hai Bà Trưng centreline at the mapped entrance.
    function fenceRun(cx,length){
      k.box(0x8a7860,cx,.27,0,length,.54,.32);
      const bays=Math.round(length/3.75),step=length/bays;
      for(let i=0;i<=bays;i++){
        const x=cx-length/2+step*i;
        k.box(yellow,x,1.33,0,.39,2.65,.40);k.box(pale,x,2.52,0,.51,.15,.52);
        k.tapered(aged,x,2.70,0,.31,.07,.22,1,4);
        if(i===bays)continue;
        for(const y of [.73,1.70,1.99])k.box(iron,x+step*.5,y,0,step,.046,.055);
        for(let v=1;v<=14;v++)k.tapered(iron,x+v*step/15,1.39,0,.019,.011,1.75,1,4);
      }
    }
    fenceRun(-11.08,17.74);fenceRun(13.36,22.30);
    for(const s of sides){
      k.box(aged,s*2.10,1.81,0,.54,3.62,.61);
      for(const y of [.47,1.71,2.92,3.44])k.box(pale,s*2.10,y,0,.65,.14,.73);
    }
    for(let i=-15;i<=15;i++){
      const x=i*.12,h=2.17+.58*(1-(i/15)**2);
      k.tapered(iron,x,.24+h/2,-.01,.021,.014,h,1,6);
    }
    k.box(iron,0,.30,0,3.82,.48,.14);
    for(const y of [.57,1.84])k.box(iron,0,y,0,3.84,.082,.10);
    k.outline([[-1.88,0],[-1.50,.18],[-.87,.44],[-.32,.54],[0,.68],[.32,.54],[.87,.44],[1.50,.18],[1.88,0],[1.88,-.10],[.90,.32],[0,.50],[-.90,.32],[-1.88,-.10]],iron,
      0,2.55,0,.11);
  }
  function pottedShrubs(T,k){
    const sphere=new T.IcosahedronGeometry(1,1);
    for(const [x,z,h] of [[1.69,29.05,1.49],[7.63,29.05,1.80],[-3.32,26.15,1.22],[13.08,26.10,1.20]]){
      k.tapered(0x8c7460,x,.33,z,.31,.49,.60,1,16);
      k.tapered(timber,x,.85,z,.066,.045,.78,1,7);
      for(const [i,w] of [[0,.59],[1,.43],[2,.27]])
        k.stamp(sphere,i%2?0x697246:0x5a6844,x+.11*Math.sin(1.7*i),h*(.66+.21*i),z,w,.20,w*.85,i);
    }
    sphere.dispose();
  }
  const view=(name,x,z,height,viewRadius,a,viewElevation)=>({name,height,viewRadius,viewAngle:yaw+a,
    viewElevation,viewBase:'monument',offset:[x*cs+z*sn,-x*sn+z*cs]});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Nhà Đốc phủ Hải',kind:'Nhà cổ',locality:'Gò Công',
    lon:106.675151,lat:10.361693,map:'https://www.openstreetmap.org/way/1272644423',source,photo:source,
    start:[106.6749700,10.3621709],mappedEntrance:true,approachMeters:undefined,visitOnArrival:true,
    arrivalNote:'Xe dừng trên đường Hai Bà Trưng, sát lối vào số 49. Từ cổng sắt đi qua sân trước để đến tiền sảnh.',
    description:'Ngôi nhà của gia đình bà Trần Thị Sanh được mở rộng qua nhiều thế hệ. Đốc phủ Nguyễn Văn Hải cho dựng tiền sảnh kiểu phương Tây trước nếp nhà gỗ Nam Bộ. Hai nhà bên và lẫm lúa bao quanh khoảng sân sau. Mặt bằng theo dấu mái trên bản đồ, chiều cao và hoa văn được ước dựng theo ảnh di tích.',
    yaw,width:41,depth:52,gardenRadius:20,foundationAt:[axis,17],
    // Real outer parcel bounded by the two side streets and the north fence.
    boundary:[[-17.0,-22.7],[23.4,-20.6],[24.0,2.3],[29.4,51.1],[-15.6,47.1],[-17.6,2.1]],
    reserve:(x,z,pad)=>z>=-22.5-pad&&z<=48.55+.089*x+pad&&x>=-17.5-pad&&x<=23.9+.11*Math.max(0,z)+pad,
    solids:[[axis,12.6,10.4,9.9],[18.68,-2.28,4.52,4.0],[-12.28,-2.73,4.4,4.5],[3.12,-14.89,19.5,6.47]],
    views:[{...view('Tiền sảnh nhìn từ sân trước',axis,24.35,7.5,25.5,.48,.095),photo:gallery+'h013_636797072522233315.jpg'},
      {...view('Phù điêu và lan can con tiện',axis,26.22,10.67,10.8,-.32,-.055),photo:source},
      {...view('Hàng hiên nhìn từ sân sau',5.22,.37,5.4,7.15,2.22,.03),photo:gallery+'hinh7_636791073238245223.jpg'}],
    build(T,k){
      k.palette({plaster:[yellow,sun,pale,aged],tile:[tile,0xa8755b],stone:[stone],timber:[ebony,timber],metal:iron});
      const f=createTempleFoundations(T,k);
      const base=f.fixture(g=>g(axis,17),()=>{
        court(T,k);
        k.box(yellow,axis,2.29,12.15,21.7,4.05,17.00);
        k.deck(0x978f80,axis,.16,23.24,23.10,.31,7.49);
        k.place(axis,front,0,()=>facade(T,k));
        roof(T,k,axis,11.35,22.38,18.33,4.48,3.02,tile);
        roof(T,k,axis,19.46,22.38,8.30,4.54,1.63,tile);
        k.place(axis,2.24,Math.PI,()=>{
          k.box(yellow,0,1.98,-1.64,20.6,3.92,.23);
          for(const x of [-8,-4,0,4,8])shutter(k,x,-1.48,2.15,2.76,.42);
          arch(T,k,0,0,5.48,4.22,.55,2.77,.42);
          k.box(stone,0,.18,.42,5.43,.34,1.00);
          for(const s of sides){
            for(let i=0;i<3;i++)arch(T,k,s*(3.96+2.44*i),0,2.44,4.22,.67,2.37,.38);
            balusters(T,k,s*6.4,0,7.26,.42,.57,0x759486);
          }
          k.box(pale,0,4.20,0,20.4,.16,.48);
          for(const x of [-3.48,3.48]){
            k.tapered(0x8e8271,x,.40,.64,.36,.55,.64,1,8);
            k.tapered(0x5f724c,x,.96,.64,.43,.19,.67,1,9);
          }
        });
        k.deck(0xad9f8a,axis,.053,36.41,24.3,.10,21.35);
        pottedShrubs(T,k);
        k.place(4.48,49.0,-.089,()=>gate(T,k));
      });
      f.skirt(axis,12.15,21.7,17,.32,base,0);
      for(const [x,z,w,d] of [[18.68,-2.28,9.3,8.2],[-12.28,-2.73,9.0,9.2],[3.12,-14.89,39.4,13.3]])
        f.skirt(x,z,w,d,.18,base,0);
      for(const [x,z,w,h,kind] of [[-13.1,37.5,4.5,5.1,'banyan'],[20.3,38.5,4.8,5.9,'banyan'],
        [-8.7,44.7,2.3,7.8,'palm'],[11.3,46.1,2.6,8.7,'palm']]){
        let tree;
        f.fixture(g=>g(x,z),()=>{A.trees(T,k,[{x,z,h,width:w,kind}]);tree=k.group.children.at(-1);},y=>{tree.position.y=y;});
      }
    }
  });
})();

export default window.VietnamSights;
