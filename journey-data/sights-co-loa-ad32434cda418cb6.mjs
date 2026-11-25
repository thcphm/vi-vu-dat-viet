const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const sites=window.VietnamSights??=[],atlas=globalThis.VietnamTourism,A=globalThis.CentralArch;
  const heritage='https://thanhcoloa.vn/',timber=0x695040,door=0x76513e,stone=0xa5a193,
    darkStone=0x858579,brick=0x9e7560,plaster=0xd3c9ac,ridge=0x887e69;
  const templeRoad=[105.871627,21.1120475],villageRoad=[105.8737987,21.1135947];
  function sight(way,d,build){
    const id='osm-way-'+way,record=atlas.byId?.get(id)??atlas.entries.find(s=>s.id===id),{shots,page,...details}=d;
    const c=Math.cos(d.yaw),s=Math.sin(d.yaw);
    const views=shots.map(([name,u,v,height,viewRadius,angle,viewElevation])=>({
      name,height,viewRadius,viewAngle:d.yaw+angle,viewElevation,offset:[u*c+v*s,-u*s+v*c]}));
    sites.push({...record,...details,id,catalogId:id,views,build,visitOnArrival:true,mappedEntrance:true,approachMeters:undefined,
      map:'https://www.openstreetmap.org/way/'+way,source:heritage+page,photo:heritage+page});
  }
  function setup(kit){kit.palette({timber:[timber,door],stone:[stone,darkStone],brick,plaster});}
  function tube(T,kit,tint,pts,radius,n=18){
    const line=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));
    const g=new T.TubeGeometry(line,n,radius,6,false);kit.stamp(g,tint,0,0,0);g.dispose();
  }
  function oval(T,kit,tint,x,y,z,w,h,d){
    const g=new T.SphereGeometry(1,12,8);kit.stamp(g,tint,x,y,z,w,h,d);g.dispose();
  }
  function column(kit,x,z,h,r,y=0,tint=timber){
    kit.stamp(kit.round,stone,x,y+.12,z,r*1.55,.24,r*1.55);
    kit.stamp(kit.round,tint,x,y+.20+h/2,z,r,h,r);
  }
  function steps(kit,x,z,w,h,n,run){
    for(let i=0;i<n;i++){
      const y=h*(n-i)/n;kit.box(i%3?stone:darkStone,x,y/2,z+(i+.5)*run/n,w,y,run/n+.015);
    }
  }
  function screen(kit,cx,y,z,w,h,open=false){
    // A bức bàn leaf has a solid lower panel and an open lattice above.
    const n=4,l=w/n;
    for(let i=0;i<n;i++){
      if(open&&(i===1||i===2))continue;
      const x=cx+(i-1.5)*l;
      kit.box(door,x,y+h*.255,z,l-.038,h*.51,.12);
      for(const dx of [-.42,.42])kit.box(timber,x+dx*l,y+h*.50,z+.045,.063,h,.115);
      for(const h2 of [.51,.95])kit.box(door,x,y+h*h2,z+.066,l,.080,.105);
      for(let k=0;k<4;k++)kit.box(door,x+(k-1.5)*l*.19,y+h*.735,z+.059,.042,h*.41,.085);
    }
  }
  // The ogee follows the hip around the corner only. Along most of a hall's
  // eave its edge stays low and level, as in the monument photographs.
  function roof(T,kit,x,z,w,d,y,h,tile,hip=true){
    const hw=w/2,hd=d/2,hr=hip?Math.max(.15,hw-hd*.71):hw,cap=0x9a8c74;
    kit.palette({tile},true);
    const edge=[[[-hw,-hd],[hw,-hd],[-hr,0],[hr,0]],[[hw,-hd],[hw,hd],[hr,0],[hr,0]],
      [[hw,hd],[-hw,hd],[hr,0],[-hr,0]],[[-hw,hd],[-hw,-hd],[-hr,0],[-hr,0]]];
    for(const [index,[a,b,c,e]] of edge.entries()){
      if(!hip&&index%2)continue;
      const pos=[],ind=[],nx=Math.max(5,Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/.82)),ny=8;
      function point(u,v){
        const corner=hip?Math.abs(2*u-1)**6*Math.min(.49,hd*.12)*v**3:0;
        return [x+((c[0]*(1-u)+e[0]*u)*(1-v)+(a[0]*(1-u)+b[0]*u)*v),
          y+h*(1-v)**1.46+corner,z+((c[1]*(1-u)+e[1]*u)*(1-v)+(a[1]*(1-u)+b[1]*u)*v)];
      }
      for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
        pos.push(...point(i/nx,j/ny));
        if(i&&j){
          const k=j*(nx+1)+i,l=k-nx-2;ind.push(l,k-1,l+1,l+1,k-1,k);
        }
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(ind);g.computeVertexNormals();
      // Face culling and the underside are intentional so the tile roof is
      // visible both above and from under its overhanging edges.
      if(g.attributes.normal.getY(Math.floor(ind[3]))<0){for(let j=0;j<ind.length;j+=3)[ind[j+1],ind[j+2]]=[ind[j+2],ind[j+1]];
        g.setIndex(ind);g.computeVertexNormals();}
      kit.stamp(g,tile,0,0,0);
      const underside=ind.slice();for(let j=0;j<underside.length;j+=3)[underside[j+1],underside[j+2]]=[underside[j+2],underside[j+1]];
      g.setIndex(underside);g.computeVertexNormals();kit.stamp(g,timber,0,-.105,0);g.dispose();
      tube(T,kit,cap,Array.from({length:9},(_,i)=>point(i/8,1)),.077);
      if(hip){
        const hipLine=Array.from({length:8},(_,i)=>point(0,i/7));
        const tip=hipLine.at(-1);hipLine.push([tip[0]+Math.sign(tip[0]-x)*.31,tip[1]+.37,tip[2]+Math.sign(tip[2]-z)*.29]);
        tube(T,kit,ridge,hipLine,.103);
      }
    }
    kit.box(ridge,x,y+h+.08,z,hr*2+.20,.16,.26);
  }
  function hall(T,kit,w,d,postH,n,settings={}){
    const {box}=kit,base=settings.base??.54,tile=settings.tile??0x976957,hip=settings.hip!==false;
    const rise=settings.rise??d*.26,depth=d*.43,bay=(w-2.1)/n;
    box(darkStone,0,base*.5,0,w+.27,base,d+.34);
    box(stone,0,base-.055,0,w+.49,.16,d+.52);
    box(0x55483b,0,base+postH*.41,-d*.22,w-1,postH*.82,d*.40);
    for(let i=0;i<=n;i++){
      const x=(i-n*.5)*bay;
      for(const side of [-1,1]){
        column(kit,x,side*depth-.04,postH,settings.r??.18,base);
        box(timber,x,base+postH-.16,side*depth-.04,.39,.24,.39);
        A.strut(T,kit,timber,x,base+postH-.38,side*(depth-.25),x,base+postH+.28,side*(depth+.62),.10);
      }
      if(i<n)screen(kit,x+bay/2,base+.14,depth-.79,bay-.19,postH-.24,settings.open&&i===Math.floor(n/2));
    }
    for(const side of [-1,1])box(timber,0,base+postH+.03,side*depth,w-.15,.23,.27);
    if(!hip){
      for(const side of [-1,1]){
        const shape=[[-d*.5,0],[d*.5,0],[d*.5,postH+.24],[0,postH+rise+.36],[-d*.5,postH+.24]];
        kit.outline(shape,settings.wall??plaster,side*w*.5,base,0,.19,Math.PI/2);
      }
    }
    roof(T,kit,0,0,w+1.15,d+1.68,base+postH+.20,rise,tile,hip);
    if(settings.steps!==false)steps(kit,0,d*.5+.19,w*.50,base,4,1.07);
  }
  function tiles(kit,x,z,w,d){
    kit.box(0xac816b,x,.055,z,w,.11,d);
    const count=Math.floor(d/.72);
    for(let i=0;i<count;i++)kit.box(0x997963,x,.113,z-d*.5+.48+i*.72,w,.013,.021);
  }
  // The temple's north and south yards sit on different levels. Fit paving
  // to the land, and keep every gate, stair and timber building level.
  function courtyardPlacement(kit){
    const sections=[];
    function place(x,z,a,build,paving=false){
      const first=kit.vertexCount(),children=kit.place(x,z,a,build);
      sections.push({x,z,paving,first,end:kit.vertexCount(),children,initial:children.map(m=>m.position.y)});
    }
    let rest;
    kit.group.userData.fitGround=ground=>{
      const g=kit.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;
      if(!g)return;
      const p=g.attributes.position;rest??=p.array.slice();
      for(const {x,z,paving,first,end,children,initial} of sections){
        const level=ground(x,z);
        const samples=new Map();
        function bed(px,pz){
          const key=px+','+pz;
          if(!samples.has(key))samples.set(key,ground(px,pz));
          return samples.get(key);
        }
        for(let i=first;i<end;i++){
          const px=rest[i*3],y=rest[i*3+1],pz=rest[i*3+2];
          const h=paving?bed(px,pz):level;
          p.setY(i,y<.015?Math.min(h+y,bed(px,pz)-.12):h+y);
        }
        children.forEach((child,i)=>{child.position.y=initial[i]+level;});
      }
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    };
    return place;
  }
  function basin(kit,x,z,r){
    kit.stamp(kit.round,stone,x,.16,z,r,.31,r);
    kit.stamp(kit.round,0x536e5b,x,.323,z,r-.20,.032,r-.20);
  }
  function archedBay(T,kit,x,z,w,h,depth,tint,doorTint){
    const r=w*.36,spring=h*.49,a=new T.Shape();
    a.moveTo(-w/2,0);a.lineTo(-r,0);a.lineTo(-r,spring);a.absarc(0,spring,r,Math.PI,0,true);
    a.lineTo(r,0);a.lineTo(w/2,0);a.lineTo(w/2,h);a.lineTo(-w/2,h);a.closePath();kit.profile(a,tint,x,0,z-depth/2,depth);
    if(doorTint){
      const leaf=new T.Shape();leaf.moveTo(-r,0);leaf.lineTo(r,0);leaf.lineTo(r,spring);
      leaf.absarc(0,spring,r,0,Math.PI,false);leaf.closePath();kit.profile(leaf,doorTint,x,0,z-.13,.16);
      for(const dx of [-.46,0,.46])kit.box(timber,x+dx*r,spring*.54,z+.055,.04,spring,.045);
    }
    for(let i=0;i<15;i++){
      const u=Math.PI*i/15,v=Math.PI*(i+1)/15-.011,R=r+.135;
      const arc=(r,a)=>[r*Math.cos(a),spring+r*Math.sin(a)];
      kit.outline([arc(r,u),arc(R,u),arc(R,v),arc(r,v)],i%2?stone:darkStone,x,0,z+depth/2-.015,.09);
    }
  }
  function dragon(T,kit,x,z){
    // The stone animals run down the sides of the principal stair with raised
    // heads, branching horns and coils carved out of the stair cheek (1732).
    const {box}=kit,carved=0xaaa79a;
    kit.outline([[0,0],[3.38,0],[3.38,.57],[2.60,.70],[1.36,1.02],[0,1.40]],darkStone,x+.235,.06,z,.46,-Math.PI/2);
    const spine=[[x,1.39,z+.10],[x,1.61,z+.57],[x,1.10,z+1.08],[x,1.34,z+1.51],[x,.88,z+1.92],[x,1.08,z+2.32],[x,.92,z+2.66]];
    tube(T,kit,carved,spine,.205,27);
    oval(T,kit,carved,x,1.03,z+2.82,.315,.32,.40);oval(T,kit,carved,x,.94,z+3.16,.26,.16,.28);
    box(stone,x,.78,z+3.11,.43,.10,.48);
    for(const side of [-1,1]){
      oval(T,kit,stone,x+side*.247,1.18,z+2.93,.092,.090,.11);
      tube(T,kit,stone,[[x+side*.15,1.25,z+2.72],[x+side*.25,1.46,z+2.57],[x+side*.25,1.50,z+2.40]],.059,7);
      tube(T,kit,stone,[[x+side*.17,1.11,z+2.91],[x+side*.36,1.08,z+2.63],[x+side*.31,1.25,z+2.44]],.068,8);
      for(let i=0;i<7;i++)oval(T,kit,stone,x+side*.165,spine[Math.min(6,i)][1]-.02,z+.17+i*.365,.055,.095,.124);
    }
  }
  const templeYaw=-.128;
  sight(776438252,{name:'Đền Thượng – Đền thờ An Dương Vương',page:'den-thuong-den-tho-vua-an-duong-vuong',yaw:templeYaw,
    width:57,depth:90,start:templeRoad,modeledBuildings:Array.from({length:8},(_,i)=>'w'+(1556531240+i)),
    boundary:[[-25,-43],[25,-43],[25,48],[-25,48]],
    solids:[[0,-13,8.3,15.6],[-14,12,3,8.3],[10,12,3.4,8.3],[-2,44.7,5.4,2.4],[-2,23.4,5.1,2.9]],
    arrivalNote:'Xe dừng trên đường ven hồ Giếng Ngọc. Góc tham quan theo trục nghi môn và hai sân rồng của đền.',
    shots:[['Nghi môn ngoại và bậc rồng',-1.8,44,13.1,20.2,.23,.10],['Đôi rồng đá năm 1732',-2.1,48.5,3.45,5.1,-.59,.17],
      ['Trục đền từ phía Giếng Ngọc',-1,8,25,94,.37,.64],['Sân rồng hạ và hai mắt rồng',-2,27,12,20,-.61,.29]],
    description:'Giữa hồ và chính điện là hai nghi môn và hai sân rồng. Ba vòm của nghi môn ngoại mở dưới vọng lâu, bậc giữa có đôi rồng đá tạo tác năm 1732. Hai giếng nhỏ trong sân được gọi là mắt rồng.'},
  (T,kit)=>{
    const {box}=kit,place=courtyardPlacement(kit);setup(kit);
    place(0,0,0,()=>{
      tiles(kit,-1,14.5,43,62);tiles(kit,-1.5,-10,33,22);
      box(stone,-1.5,.123,18.3,3.75,.095,56.7);
    },true);
    place(-11.9,37.2,0,()=>basin(kit,0,0,2));place(10.7,37.4,0,()=>basin(kit,0,0,2.13));
    // Take the gate datum at the foot of the stairs to meet the lakeside road.
    place(-1.92,50.4,0,()=>kit.place(0,-5.5,0,()=>{
      const wall=0x998e74,centre=0x89816d;
      const base=.97;box(stone,0,base*.5,0,12.61,base,4.96);
      for(const [x,w,h] of [[-4.33,3.43,4.20],[0,5.0,5.20],[4.33,3.43,4.20]]){
        // Individual arch profiles leave three genuine openings in the gate.
        // Lift each bay on the continuously raised, historic stone platform.
        const r=w*.36,spring=h*.48,a=new T.Shape();a.moveTo(-w/2,0);a.lineTo(-r,0);
        a.lineTo(-r,spring);a.absarc(0,spring,r,Math.PI,0,true);a.lineTo(r,0);a.lineTo(w/2,0);a.lineTo(w/2,h);a.lineTo(-w/2,h);a.closePath();
        kit.profile(a,wall,x,base,-1.5,3.0);
        const leaf=new T.Shape();leaf.moveTo(-r,0);leaf.lineTo(r,0);leaf.lineTo(r,spring);leaf.absarc(0,spring,r,0,Math.PI,false);leaf.closePath();
        kit.profile(leaf,0x834d39,x,base,-.32,.19);
        for(const side of [-1,1]){
          box(centre,x+side*(w*.5-.18),base+h*.5,1.48,.27,h+.17,.35);
          box(door,x+side*r*.45,base+spring*.53,-.09,r*.79,spring*.68,.09);
        }
        for(const [yy,hh] of [[h-.11,.16],[h+.12,.17],[h+.27,.092]])box(darkStone,x,base+yy,.02,w+.18,hh,3.46);
        box(0xb9aa87,x,base+h-.47,1.56,w*.63,.32,.12);
        for(let i=0;i<15;i++){
          const u=Math.PI*i/15,v=Math.PI*(i+1)/15-.011,R=r+.14;
          const pt=(r,a)=>[r*Math.cos(a),spring+r*Math.sin(a)];
          kit.outline([pt(r,u),pt(R,u),pt(R,v),pt(r,v)],i%3?darkStone:stone,x,base,1.48,.12);
        }
      }
      box(0xc8bea5,0,6.95,0,3.70,1.52,2.52);
      for(const z of [-1.28,1.28])for(const x of [-1.16,0,1.16])box(0x544b3b,x,6.94,z,.52,.76,.08);
      roof(T,kit,0,0,4.60,3.45,7.64,1.10,0x897968);
      box(plaster,0,8.85,0,2.10,.81,1.52);roof(T,kit,0,0,2.84,2.14,9.23,.73,0x8a7b67);
      for(const side of [-1,1]){
        box(wall,side*9.5,1.46,-.18,7.3,2.89,.68);box(darkStone,side*9.5,2.99,-.18,7.45,.18,.80);
        for(const x of [side*2.55,side*6.12,side*13.12]){
          const y=Math.abs(x)>7?3.57:Math.abs(x)>3?5.50:6.48;
          box(wall,x,y*.5,0,.47,y,.54);kit.tapered(darkStone,x,y+.24,0,.37,.05,.46,1,4);
        }
        dragon(T,kit,side*1.63,2.12);
      }
      steps(kit,0,2.05,3.26,1.04,6,3.46);
    }));
    // Gatehouse, main halls and side galleries follow the eight mapped buildings.
    place(-2,23.7,0,()=>hall(T,kit,10.9,5.9,3.0,3,{hip:false,base:1.14,tile:0x947b68,open:true}));
    for(const [x,z] of [[-14.9,12.9],[10.4,13.8]])place(x,z,Math.PI/2,()=>hall(T,kit,16.1,5.3,2.7,5,{hip:false,steps:false,tile:0x94715d}));
    for(const [x,z,w,d] of [[-.7,-2.6,15.5,7.0],[-.6,-10.3,15.5,6.5],[-15.8,-5.0,12.1,7.1],[12.0,-1.8,12.1,7.1]])
      place(x,z,0,()=>hall(T,kit,w,d,3.05,5,{open:true,tile:0x94654e}));
    place(-.75,-20,Math.PI/2,()=>hall(T,kit,14.2,8.9,3.00,3,{steps:false,tile:0x926b55}));
    place(-21,-17,Math.PI/2,()=>{
      box(stone,0,.38,0,5.5,.76,5.5);
      for(const x of [-1.78,1.78])for(const z of [-1.78,1.78])column(kit,x,z,3.15,.17,.75);
      roof(T,kit,0,0,5.6,5.5,3.76,1.49,0x847565);
      box(timber,0,5.15,0,2.59,.73,2.59);roof(T,kit,0,0,3.9,3.84,5.49,1.28,0x81725e);
      kit.outline([[-.64,0],[.64,0],[.64,1.29],[.42,1.57],[0,1.73],[-.42,1.57],[-.64,1.29]],darkStone,0,.74,-.16,.32);
    });
    const trees=globalThis.createTreeModels(T);
    for(const [x,z,h,w] of [[-23,27,9,6],[19,39,8.7,6.1],[22,-9,9.4,5.8],[-25,-27,8.8,6.4]])
      place(x,z,0,()=>trees.grove(kit.group,[[0,-.07,0,w,h,x]]));
  });

  const lake=[[47.3,-20.2],[32.8,57.5],[18.6,61.9],[-2.5,57.5],[-22,44.4],[-45.7,17.9],
    [-55.2,2.4],[-54.6,-18.2],[-45.1,-32.7],[-32.1,-42.4],[-13.1,-44.1],[5.8,-39.9],
    [23.1,-34.1],[37.6,-34.1],[44.3,-29.3],[46.8,-24.3]];
  const island=[[10.6,-13.6],[15.4,-7],[16.5,1],[13.8,8.6],[7.9,14.1],[.1,16.2],[-7.8,14.5],
    [-14,9.2],[-17,1.8],[-16.2,-6.3],[-11.8,-13],[-4.7,-16.9],[3.4,-17.1]];
  const well=[[7.9,-9.2],[11.4,-4.4],[12.3,1.4],[10.3,7],[5.9,11.1],[.2,12.6],[-5.6,11.3],
    [-10.1,7.5],[-12.3,2],[-11.8,-3.9],[-8.5,-8.9],[-3.3,-11.7],[2.6,-11.9]];
  function onLake(x,z,padding=0){
    if(x<-56-padding||x>48+padding||z<-45-padding||z>62+padding)return false;
    let inside=false;
    for(let i=0,j=lake.length-1;i<lake.length;j=i++){
      const [ax,az]=lake[j],[bx,bz]=lake[i],dx=bx-ax,dz=bz-az;
      if((az>z)!==(bz>z)&&x<ax+dx*(z-az)/dz)inside=!inside;
      const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
      if((x-ax-t*dx)**2+(z-az-t*dz)**2<=padding*padding)return true;
    }
    return inside;
  }
  sight(497328755,{name:'Hồ Giếng Ngọc (Giếng Trọng Thủy)',lon:105.871205,lat:21.11163,yaw:0,
    page:'phong-chong-tai-nan-duoi-nuoc-tai-di-tich-ho-gieng-ngoc',start:templeRoad,width:104,depth:108,
    boundary:lake,solids:[],gardenRadius:13,reserve:onLake,
    arrivalNote:'Xe dừng trên đường ven hồ phía nghi môn ngoại. Những góc ngắm quanh hồ hướng vào vành giếng ở giữa.',
    shots:[['Giếng giữa hồ trước đền Thượng',0,-.4,9.9,49,-.17,.13],
      ['Vành đá ong và thảm cỏ',4,5,5.8,24,.83,.15]],
    description:'Ở giữa hồ cong trước đền Thượng có một vành đất hẹp ôm lấy giếng Ngọc. Bờ trong kè đá ong, trên gờ ngoài trồng cỏ và những bụi cây nhỏ. Dân gian gắn giếng với câu chuyện Mỵ Châu – Trọng Thủy.'},
  (T,kit)=>{
    setup(kit);
    function face(ring,holes){
      const path=new T.Shape(ring.map(([x,z])=>new T.Vector2(x,-z)));
      for(const h of holes)path.holes.push(new T.Path(h.map(([x,z])=>new T.Vector2(x,-z))));
      const g=new T.ShapeGeometry(path);g.rotateX(-Math.PI/2);return g;
    }
    const water=new T.MeshPhongMaterial({color:0x587969,specular:0x657866,shininess:43,transparent:true,opacity:.79,depthWrite:false,side:T.DoubleSide});
    for(const [outer,holes] of [[lake,[island]],[well,[]]]){
      const m=new T.Mesh(face(outer,holes),water);m.position.y=.08;m.receiveShadow=true;kit.group.add(m);
    }
    const terrace=face(island,[well]);kit.stamp(terrace,0x7f964f,0,.62,0);terrace.dispose();
    function retaining(points,h,tint,step){
      // OSM uses straight segments for the circular shores. Arc interpolation
      // smooths the laterite curb while preserving its surveyed diameter.
      const loop=new T.CatmullRomCurve3(points.map(([x,z])=>new T.Vector3(x,0,z)),true);
      const n=Math.round(loop.getLength()/step);
      for(let i=0;i<n;i++){
        const a=loop.getPointAt(i/n),b=loop.getPointAt((i+1)/n),dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz);
        const yaw=Math.atan2(dx,dz),x=(a.x+b.x)/2,z=(a.z+b.z)/2;
        kit.box(tint,x,(h-1.40)*.5,z,.38,h+1.40,l+.035,yaw);
        kit.box(i%3?0xa38b65:0x907958,x,h-.055,z,.45,.14,l+.03,yaw);
        if(h>.7)kit.box(i%4?0x927054:0xa08160,x,h*.49,z,.40,.27,l-.046,yaw);
      }
    }
    retaining(island,.60,0x857b5b,.93);retaining(well,1.16,0x9b7354,.85);
    for(let i=0;i<11;i++){
      const a=i*2*Math.PI/11+.21,x=14.7*Math.cos(a)-.22,z=14.4*Math.sin(a)-.32;
      kit.stamp(kit.round,0x625641,x,1.23,z,.15,1.36,.15);
      for(let k=0;k<6;k++){const f=k*2.4;
        oval(T,kit,[0x587735,0x698641,0x5e803d][k%3],x+Math.cos(f)*.45,1.76+.25*Math.cos(k),z+Math.sin(f)*.45,.66,1.07,.67);}
    }
  });

  sight(776437158,{name:'Đình Cổ Loa (Ngự Triều Di Quy)',page:'dinh-co-loa-dinh-ngu-trieu-di-quy',
    yaw:-.049,width:39.1,depth:30.2,start:villageRoad,modeledBuildings:['w1556531238'],
    boundary:[[-19.6,-6.7],[-7,-6.7],[-7,-15.1],[7,-15.1],[7,-6.7],[19.6,-6.7],[19.6,15],[-19.6,15]],
    solids:[[0,4.1,15,7],[0,-8.9,4.8,4.2],[14.3,28.3,3.1,5.6]],
    arrivalNote:'Xe dừng ở lối vào phía đông sân đình. Các góc phục dựng thể hiện kiến trúc theo ảnh và hồ sơ của Ban Quản lý Cổ Loa.',
    shots:[['Đại đình qua sân gạch',0,4.2,12.8,36,.21,.105],['Kết cấu gỗ lim ở hàng hiên',0,8.8,7.4,8.8,-.42,.075],
      ['Đình, am Mỵ Châu và chùa Bảo Sơn',-2,-3,17.5,57,.53,.57]],
    description:'Đại đình dài 30 m, có năm gian, hai chái và sáu hàng cột gỗ lim. Mái ngói mũi hài vươn ra trên hàng hiên thấp. Hậu cung nối vuông góc phía sau, trước đình là sân gạch Bát Tràng.'},
  (T,kit)=>{
    setup(kit);const {box,place}=kit;
    tiles(kit,.3,27.1,35.4,25.0);
    place(0,4.15,0,()=>{
      box(darkStone,0,.39,0,30.55,.78,14.02);box(stone,0,.80,0,30.70,.12,14.20);
      const stations=[-10.25,-6.15,-2.05,2.05,6.15,10.25];
      for(const x of stations){
        for(const side of [-1,1])for(const [z,h,r] of [[6.21,3.04,.15],[4.28,4.0,.19],[1.84,5.5,.25]]){
          column(kit,x,side*z,h,r,.85);
          if(z>6)A.strut(T,kit,timber,x,3.63,side*5.94,x,4.57,side*7.03,.15);
        }
        box(timber,x,5.03,0,.28,.37,9);box(timber,x,6.32,0,.31,.38,3.94);
        for(const side of [-1,1]){
          const z=side*6.05;
          oval(T,kit,timber,x,4.30,z,.21,.14,.34);
          tube(T,kit,door,[[x,4.17,z],[x,4.28,z+side*.23],[x,4.51,z+side*.42]],.076,8);
        }
      }
      for(const z of [-5.80,5.80]){
        box(timber,0,4.10,z,29.7,.19,.26);
        for(let i=0;i<5;i++)screen(kit,(i-2)*4.10,.91,z,3.92,2.89,true);
        for(const x of [-12.40,12.40])screen(kit,x,.91,z,3.66,2.86);
      }
      for(const side of [-1,1])box(door,side*14.54,2.27,0,.19,2.83,11.55);
      roof(T,kit,0,0,38.2,19.75,3.98,4.92,0xa86a52);
      steps(kit,0,7.04,22,.84,4,1.20);
    });
    place(0,-8.9,Math.PI/2,()=>hall(T,kit,9.50,8.50,3.12,3,{hip:false,tile:0x966952,steps:false}));
    place(14.2,28.5,Math.PI/2,()=>hall(T,kit,10.9,5.7,2.68,3,{hip:false,tile:0x9b7055}));
    for(const x of [-12.8,-6.5,6.5,12.8]){
      kit.tapered(stone,x,.45,16.6,.58,.73,.78,1,12);oval(T,kit,0x557640,x,1.48,16.6,.74,.74,.74);
    }
  });

  sight(1556531233,{name:'Am Mỵ Châu',page:'am-my-chau',yaw:.023,width:6.4,depth:12.2,start:villageRoad,
    boundary:[[-3,-6.2],[3,-6.2],[3,3],[-3,3]],solids:[[0,0,2.57,2.63],[0,-4.7,1.54,1.84],[-1.1,7.4,.27,.57],[1.1,7.4,.27,.57]],
    arrivalNote:'Từ đầu đường phía đông, lối qua sân đình dẫn đến am ở bên tây đại đình.',
    shots:[['Vòm gạch dẫn vào am',0,4.8,5.3,10.5,.06,.065],['Ba gian tiền tế',0,1.23,6.75,6.55,-.62,.10]],
    description:'Phía tây đình Cổ Loa, lối gạch xuyên qua vòm cũ dẫn đến am Bà Chúa. Tiền tế có ba gian gỗ, hai đầu tường hồi xây kín. Hậu cung nối dọc phía sau.'},
  (T,kit)=>{
    setup(kit);const {box}=kit;
    tiles(kit,0,6.35,2.69,8.57);
    hall(T,kit,5.14,5.30,2.61,3,{hip:false,r:.115,base:.31,tile:0x94705e,open:true});
    kit.place(0,-4.38,Math.PI/2,()=>hall(T,kit,3.90,3.05,2.35,3,{hip:false,r:.11,base:.29,tile:0x8f6f5b,steps:false}));
    archedBay(T,kit,0,7.4,2.81,3.22,.96,0x896c54);
    for(const side of [-1,1]){
      box(stone,side*1.63,.21,6.28,.39,.42,5.53);
      const vine=[];
      for(let j=0;j<12;j++)vine.push([side*(1.22+.11*Math.sin(j*.65)),.09+j*.287,7.90+.041*Math.sin(j*.79)]);
      vine.push([side*.83,3.24,7.93],[side*.27,3.23,7.89]);
      tube(T,kit,0x6c614b,vine,.055,28);
      for(let j=0;j<33;j++){
        const y=.68+2.43*(j%12)/11+.11*Math.sin(j*3.1);
        const x=side*(1.22+.14*Math.sin(j*2.43)+.09*Math.cos(j*.86));
        oval(T,kit,[0x687b46,0x778b4e,0x526c3e][j%3],x,y,7.91+.068*Math.sin(j*1.14),.13,.097,.067);
      }
    }
    for(let j=0;j<14;j++)oval(T,kit,j%3?0x6c8048:0x5f7144,-1.25+j*.19,3.23+.07*Math.cos(j*1.43),7.90,.169,.11,.095);
    globalThis.createTreeModels(T).grove(kit.group,[[-4.3,-.07,8.25,4.36,7.6,.59]]);
  });

  sight(776437157,{name:'Chùa Cổ Loa (Bảo Sơn tự)',page:'chua-bao-son',yaw:-.026,width:17,depth:27,start:[105.8737975,21.1139537],
    modeledBuildings:['w1556531234'],boundary:[[-8,-12],[8,-12],[8,12],[-8,12]],
    solids:[[0,7.55,7.6,3.5],[0,-8.55,7.7,3.2],[-6.72,-.55,1.15,5.15],[6.7,-.55,1.15,5.15],[0,-29.8,3.1,2.45]],
    arrivalNote:'Xe dừng ở ngõ phía đông của chùa. Ban Quản lý ghi nhận chùa quay hướng nam, gác chuông ở phía sau quay hướng bắc.',
    shots:[['Các lớp mái Bảo Sơn tự',0,-.5,15.5,27,1.43,.45],['Tiền đường và đại tự trên nóc',0,8.0,8.8,14.7,-.51,.12],
      ['Gác chuông phía bắc',0,-29.8,7.9,12.7,Math.PI-.38,.135]],
    description:'Chùa ở ngay sau hậu cung đình. Tiền đường năm gian, hai dĩ nối với thượng điện thành hình chữ Đinh. Hai hành lang sáu gian dẫn về nhà Tổ, qua sân sau là gác chuông hai tầng.'},
  (T,kit)=>{
    setup(kit);const {box,place}=kit;
    place(0,7.53,0,()=>hall(T,kit,15.02,6.25,2.72,5,{hip:false,base:.43,tile:0x916c5c,open:true}));
    place(0,1.22,Math.PI/2,()=>hall(T,kit,7.22,5.61,2.63,3,{hip:false,base:.40,tile:0x886855,steps:false}));
    place(0,-8.55,Math.PI,()=>hall(T,kit,15.14,6.20,2.70,5,{hip:false,base:.43,tile:0x8c6658,open:true}));
    for(const side of [-1,1])place(side*6.50,-.73,-side*Math.PI/2,()=>hall(T,kit,9.85,2.70,2.18,6,{hip:false,r:.105,steps:false,base:.25,tile:0x8b6858}));
    const plaque=[[-1.71,0],[1.71,0],[1.65,.22],[1.29,.26],[1.24,.49],[.70,.53],[.65,.76],[-.65,.76],[-.70,.53],[-1.24,.49],[-1.29,.26],[-1.65,.22]];
    kit.outline(plaque,plaster,0,5.03,7.43,.26);kit.sign('寶 山 寺',0,5.39,7.73,1.77,.39,true);
    place(.29,-29.84,Math.PI,()=>{
      box(stone,0,.26,0,6.14,.52,4.73);
      for(const x of [-2.11,2.11])for(const z of [-1.62,1.62])column(kit,x,z,3.92,.19,.50);
      for(const side of [-1,1])box(plaster,side*2.69,2.01,0,.27,3.09,4.44);
      box(timber,0,2.60,0,5.6,.23,4.5);
      for(const side of [-1,1])roof(T,kit,0,side*1.67,6.03,1.63,2.72,.53,0x906c57,false);
      roof(T,kit,0,0,6.57,5.66,4.28,1.70,0x876953,false);
      for(const side of [-1,1])box(timber,0,3.14,side*1.77,4.71,.12,.14);
      const bell=new T.LatheGeometry([[.03,0],[.58,0],[.61,.10],[.47,.20],[.40,1.12],[.24,1.30],[.05,1.36]]
        .map(([r,y])=>new T.Vector2(r,y)),22);kit.stamp(bell,0x907c4c,0,2.75,0);bell.dispose();
    });
  });
})();

export default window.VietnamSights;
