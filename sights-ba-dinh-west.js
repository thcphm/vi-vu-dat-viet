'use strict';
(()=>{
  const sites=window.VietnamSights??=[],atlas=globalThis.VietnamTourism;
  function register(way,details,build){
    const id='osm-way-'+way,entry=atlas.byId?.get?.(id)??atlas.entries.find(s=>s.id===id);
    sites.push({...entry,id,catalogId:id,map:'https://www.openstreetmap.org/way/'+way,mappedEntrance:true,...details,build});
  }
  function view(name,yaw,x,z,height,viewRadius,angle,viewElevation){
    const c=Math.cos(yaw),s=Math.sin(yaw);
    return {name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius,viewAngle:yaw+angle,viewElevation};
  }
  function beam(T,kit,tint,a,b,r){
    globalThis.CentralArch.strut(T,kit,tint,...a,...b,r);
  }
  // Sections run around the same footprint at two heights. The centre is
  // used only to orient each face; the corners can have independent heights.
  function shell(T,kit,lower,upper,side,roof,soffit){
    const ring=upper.length,centre=upper.reduce((sum,p)=>sum.map((v,i)=>v+p[i]/ring),[0,0,0]);
    const vertices=new Map();
    function tri(a,b,c,tint,n){
      const u=new T.Vector3().fromArray(a),v=new T.Vector3().fromArray(b),w=new T.Vector3().fromArray(c);
      const forward=v.sub(u).cross(w.sub(u)).dot(n)>0;
      if(!vertices.has(tint))vertices.set(tint,[]);
      vertices.get(tint).push(...a,...(forward?b:c),...(forward?c:b));
    }
    for(let i=0;i<ring;i++){
      const j=(i+1)%ring,a=lower[i],b=lower[j],c=upper[j],d=upper[i];
      const outward=new T.Vector3((d[0]+c[0])*.5-centre[0],0,(d[2]+c[2])*.5-centre[2]);
      tri(a,b,c,side,outward);tri(a,c,d,side,outward);
      if(i>0&&i<ring-1){
        tri(upper[0],d,c,roof,new T.Vector3(0,1,0));
        tri(lower[0],a,b,soffit,new T.Vector3(0,-1,0));
      }
    }
    for(const [tint,position] of vertices){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(position,3));g.computeVertexNormals();
      kit.stamp(g,tint,0,0,0);g.dispose();
    }
  }
  const houseYaw=.455;
  register(207178342,{lon:105.833152,lat:21.0381713,yaw:houseYaw,width:11.4,depth:5.4,
    source:'https://nhasanbacho.vn/bai-viet/di-tich-nha-san-304/',
    photo:'https://nvsk.vnanet.vn/print/longform-nha-san-bac-ho-bieu-tuong-phong-cach-ho-chi-minh-146254.vna',
    arrivalNote:'Xe dừng trên phố Ngọc Hà, cách Nhà sàn khoảng 230 m theo đường thẳng. Góc ngắm ở bên trong khu di tích.',
    boundary:[[-5.7,-2.7],[5.7,-2.7],[5.7,2.7],[-5.7,2.7]],
    reserve:(x,z,p)=>Math.abs(x)<6.15+p&&Math.abs(z)<3.05+p||x>3.98-p&&x<11+p&&Math.abs(z+.55)<1+p,
    solids:[[-4.95,0,.13,2.26],[4.95,0,.13,2.26],[0,-2.2,4.95,.13],[7.7,-.55,2.72,.84]],
    views:[view('Mặt nhà nhìn ra ao cá',houseYaw,0,.25,6.0,18.5,.25,.09),
      view('Cầu thang và hàng hiên',houseYaw,3.0,-.10,5.6,13.0,.98,.075)],
    description:'Ngôi nhà sàn bằng gỗ dổi của kiến trúc sư Nguyễn Văn Ninh quay ra ao cá. Tầng dưới để thoáng, quanh chỗ ngồi có bệ gỗ. Hàng hiên và mành che chạy bên ngoài hai căn phòng nhỏ ở tầng trên.'},
  (T,kit)=>{
    const {box,place}=kit,wood=0x81573e,dark=0x584135,deck=0x98704d,shade=0x424f48,
      bamboo=0x606957,tile=0xa7755d,edge=0x8e705b;
    kit.palette({timber:[wood,dark,deck],tile});
    box(0xaaa493,0,.055,0,11.38,.11,5.36);
    box(wood,0,2.49,0,11.43,.27,5.39);
    for(let i=0;i<35;i++)box(i%3?deck:wood,-5.52+i*.325,2.64,0,.318,.045,5.35);
    for(const x of [-5.05,-2.52,0,2.52,5.05]){
      for(const z of [-2.2,2.2]){
        box(0x9d9786,x,.15,z,.37,.30,.37);
        box(wood,x,2.73,z,.21,5.28,.21);
      }
      box(dark,x,2.37,0,.19,.23,5.25);
    }
    for(const z of [-2.16,2.16]){
      box(dark,0,2.31,z,11.24,.24,.18);
      box(wood,0,5.19,z,11.08,.19,.18);
      for(const y of [2.91,3.07,3.23,3.4,3.58])box(wood,0,y,z,10.91,.048,.062);
      for(const x of [-3.77,-1.24,1.24,3.77])box(wood,x,3.10,z,.065,.91,.075);
    }
    for(const x of [-5.25,5.25]){
      for(const z of (x<0?[0]:[1.50,-2.13])){
        const d=x<0?4.28:z>0?1.32:.39;
        for(const y of [2.91,3.07,3.23,3.40,3.58])box(wood,x,y,z,.068,.048,d);
      }
    }
    // Two enclosed rooms leave a continuous shaded front gallery.
    box(dark,0,3.91,-.45,8.02,2.53,2.66);
    for(let i=0;i<45;i++)box(i%4?wood:dark,-3.94+i*.18,3.9,.895,.165,2.43,.06);
    for(const x of [-2.08,2.08]){
      box(dark,x,4.05,.94,1.78,1.48,.07);
      box(0x45473c,x,4.08,.985,1.59,1.28,.04);
      for(const u of [-.78,0,.78])box(wood,x+u,4.06,1.015,.067,1.37,.05);
      for(const u of [-.44,.44])box(wood,x+u,4.08,1.022,.76,.057,.06);
    }
    // Woven blinds in the archive photographs are green-grey. Their thin
    // horizontal slats remain visible on the partly lowered end panels.
    function blind(x,z,w,h){
      box(shade,x,5.12-h/2,z,w,h,.062);
      for(let i=1;i<h/.094;i++)box(bamboo,x,5.12-i*.094,z+.045,w,.017,.024);
      box(dark,x,5.12-h,z+.035,w+.07,.046,.08);
    }
    for(const x of [-4.29,4.29])blind(x,2.29,1.56,2.31);
    for(const x of [-2.31,0,2.31])blind(x,2.29,2.22,.46);
    for(const x of [-5.32,5.32])place(x,0,x>0?Math.PI/2:-Math.PI/2,()=>blind(0,0,4.41,1.83));
    for(const z of [-2.38,2.38]){
      box(0xa59d89,0,.245,z,9.8,.35,.43);
      box(deck,0,.45,z,9.96,.09,.49);
    }
    box(deck,0,.85,0,3.32,.13,1.06);
    for(const x of [-1.31,1.31])for(const z of [-.38,.38])box(wood,x,.46,z,.11,.70,.11);
    for(const x of [-1.17,0,1.17])for(const side of [-1,1]){
      const z=side*.90;
      box(wood,x,.54,z,.47,.09,.46);box(wood,x,.80,z+side*.20,.46,.47,.06);
      for(const d of [-.15,.15])box(dark,x+d,.29,z,.069,.49,.34);
    }
    const rafter=5.18,peak=6.61;
    for(const side of [-1,1]){
      const lower=[[-6.12,rafter,side*3.10],[6.12,rafter,side*3.10],[5.31,peak,0],[-5.31,peak,0]];
      shell(T,kit,lower,lower.map(([x,y,z])=>[x,y+.09,z]),edge,tile,wood);
      beam(T,kit,edge,lower[0],lower[1],.05);
      const x=side;
      // Hipped ends stop below the ridge, leaving the small triangular vent.
      const e=[[x*6.12,rafter,-3.10],[x*6.12,rafter,3.10],[x*5.49,6.22,.86],[x*5.49,6.22,-.86]];
      shell(T,kit,e,e.map(([u,y,z])=>[u,y+.077,z]),edge,tile,wood);
      for(const v of [-1,1])beam(T,kit,wood,[x*5.49,6.2,v*.89],[x*5.31,peak,0],.052);
      box(dark,x*5.43,6.21,0,.11,.095,1.82);
    }
    beam(T,kit,edge,[-5.37,peak+.115,0],[5.37,peak+.115,0],.068);
    const x0=5.52,n=15,step=.29,stairZ=-.55;
    box(wood,x0,2.56,stairZ,1.03,.18,1.72);
    for(let i=0;i<n;i++)box(deck,x0+.5+(i+.5)*step,2.58-(i+1)*.164,stairZ,step+.022,.10,1.68);
    for(const side of [-1,1]){
      const z=stairZ+side*.80;
      beam(T,kit,wood,[5.92,2.44,z],[10.37,-.02,z],.095);
      beam(T,kit,wood,[5.89,3.48,z],[10.33,1.00,z],.063);
      for(let i=0;i<=n;i+=3)box(wood,x0+.47+i*step,2.97-i*.164,z,.081,.98,.081);
    }
  });

  // Axes align with the main entrance and its mapped flight of stairs
  // (w1304976285). Four short faces and four diagonal faces form the outline.
  const museumYaw=1.37467;
  const footprint=[[-6.5,46.4],[6.7,46.2],[6.6,44.3],[43.9,7.1],[46.8,7.1],[46.7,-6.4],[43.7,-6.4],
    [6.8,-43.3],[6.8,-46.2],[-6.8,-46.3],[-6.8,-43.3],[-43.8,-6],[-46.8,-6],[-46.6,7.2],[-43.7,7.2],[-6.5,44.0]];
  register(37629143,{yaw:museumYaw,width:93.6,depth:93.4,boundary:footprint,
    // The local building tile splits the parent into five residual shells.
    // Match its full feature IDs as well as the separate OSM part geometries.
    modeledBuildings:['r17910844:part',...Array.from({length:5},(_,i)=>'w37629143:shell:'+i),
      ...Array.from({length:17},(_,i)=>['w'+(1305814741+i),'w'+(1305814741+i)+':part']).flat()],
    reserve:(x,z,p)=>Math.abs(x)+Math.abs(z)<52+p&&Math.max(Math.abs(x),Math.abs(z))<47+p||z>42-p&&z<62+p&&Math.abs(x)<14+p,
    solids:Array.from({length:9},(_,i)=>{const x=(i-4)*8;return [x,0,4,Math.min(36.1,43-Math.abs(x))];}),
    source:'https://baotanghochiminh.vn/gioi-thieu-chung-ve-trung-bay-thuong-xuyen-cua-bao-tang-ho-chi-minh.htm',
    arrivalNote:'Xe dừng trên phố Ngọc Hà, cách tâm bảo tàng khoảng 130 m theo đường thẳng. Góc ngắm chính ở phía bậc thang trước sảnh.',
    views:[view('Khối sen trắng từ sân trước',museumYaw,0,19.5,28.2,68,-.09,-.07),
      view('Phù điêu trên tiền sảnh',museumYaw,0,40.7,25.0,23,.13,.08)],
    description:'Bốn cánh bê tông trắng vươn khỏi tầng kính phía dưới. Từ sân trước, bậc đá dẫn vào sảnh dưới khối phù điêu nổi hình cờ, sao và búa liềm.'},
  (T,kit)=>{
    const {box,place}=kit,ivory=0xe3e0d0,pale=0xd4d1c4,bright=0xf0ecdc,shadow=0xaaa99d,
      roof=0x777773,glass=0x4d5552,stone=0x9b8a7e,granite=0x745d57,metal=0x797363;
    kit.palette({plaster:[ivory,pale,bright,shadow],stone:[stone,granite],metal});
    const section=(pts,y)=>pts.map(([x,z])=>[x,y,z]);
    function slab(pts,bottom,top,tint,cap=tint){
      shell(T,kit,section(pts,bottom),section(pts,top),tint,cap,tint);
    }
    const ledge=[[6.6,41],[41,6.6],[41,-6.6],[6.6,-41],[-6.6,-41],[-41,-6.6],[-41,6.6],[-6.6,41]];
    const main=[[6.4,33.9],[33.9,6.4],[33.9,-6.4],[6.4,-33.9],[-6.4,-33.9],[-33.9,-6.4],[-33.9,6.4],[-6.4,33.9]];
    slab(ledge,0,1.85,stone);slab(main,1.83,10.4,glass);
    slab(main.map(([x,z])=>[x*.98,z*.98]),10.39,14.9,pale,roof);
    const lantern=[[6.0,11.3],[10.8,6.6],[10.9,-6.2],[6,-11],[-6.5,-11],[-11.3,-6.3],[-11.4,6.5],[-6.5,11.3]];
    slab(lantern,10.3,19.96,pale,roof);
    // The mapped four 16 m overhangs, four 18 m inner wings and four
    // 19 m central panels retain their setbacks around the 20 m roof.
    for(let i=0;i<4;i++)place(0,0,i*Math.PI/2,()=>{
      const upper=[[6.55,44.12],[43.80,7.13],[36.55,7.09],[6.54,33.72]];
      const lower=[[6.55,40.31],[40.10,7.13],[35.0,7.09],[6.54,32.13]];
      shell(T,kit,section(lower,10.0),section(upper,16),ivory,roof,pale);
      const wing=[[6.55,33.72],[36.55,7.09],[26.5,7.09],[6.5,27.33]];
      shell(T,kit,section(wing,9.95),section(wing,18),pale,roof,shadow);
      const base=[[-6.52,39.88],[6.57,39.88],[6.45,20.1],[-6.54,20.1]];
      const top=[[-6.52,46.28],[6.57,46.28],[6.45,20.1],[-6.54,20.1]];
      shell(T,kit,section(base,9.92),section(top,19),pale,roof,ivory);
      // Patterned screens stand in front of the glazing on the diagonals.
      place(19.8,19.8,Math.PI/4,()=>{
        box(pale,0,2.62,.74,38.4,.23,.29);box(ivory,0,8.85,.74,38.4,.25,.29);
        for(let j=0;j<12;j++){
          const x=(j-5.5)*3.18;
          box(ivory,x-1.48,5.70,.75,.14,6.05,.20);
          for(const [sx,sy,w,h] of [[0,3.65,2.75,.12],[0,7.75,2.75,.12],
            [-.69,5.67,.13,4.05],[.68,5.67,.13,4.05],[0,5.66,1.43,.13]]){
            box(pale,x+sx,sy,.79,w,h,.19);
          }
        }
        box(pale,0,9.99,2.84,43.3,.24,.4);
      });
      for(const x of [-5.98,5.98]){
        box(granite,x,5.89,34.5,1.06,8.12,1.17);box(granite,x,5.89,32.5,1.04,8.12,1.14);
      }
      for(const x of [-3.35,0,3.35]){
        box(metal,x,5.91,33.99,.095,7.87,.15);box(granite,x,3.12,34.09,2.99,2.51,.14);
      }
      for(const y of [4.46,6.23,8.05])box(metal,0,y,34.035,11.84,.095,.13);
    });
    // The relief is vertical on the projecting front plaque. Narrow black
    // meanders in recessed panels flank the white-on-white emblems.
    const face=46.43;
    box(pale,0,14.48,43.23,12.99,9.05,6.42);
    box(bright,0,14.49,face,9.44,9.01,.24);
    for(const s of [-1,1]){
      box(0x615e57,s*5.56,14.61,face-.02,1.47,5.95,.16);
      for(const [dx,cy,w,h] of [[.55,14.61,.14,5.64],[.04,17.38,1.16,.14],[.04,11.83,1.16,.14],
        [-.44,14.72,.13,4.39],[.03,16.84,.97,.13],[.16,14.47,.13,3.24],[.04,12.89,.41,.12]])
        box(pale,s*(5.58+dx),cy,face+.08,w,h,.13);
    }
    const relief=0xe2ddc8,rf=face+.133;
    function emblem(path,x,y){kit.outline(path,relief,x,y,rf,.15);}
    const star=Array.from({length:10},(_,i)=>{const a=Math.PI/2+i*Math.PI/5,r=i%2?.31:.83;return [r*Math.cos(a),r*Math.sin(a)];});
    emblem(star,-.99,14.97);
    emblem([[-.60,.83],[-.18,1.16],[.66,.35],[.32,-.01],[.09,.20],[-.70,-.76],[-.95,-.51],[-.13,.46]],-.27,14.62);
    const curve=new T.Shape();curve.moveTo(-.48,1.14);curve.bezierCurveTo(2.27,.81,2.08,-1.82,-.31,-1.90);
    curve.quadraticCurveTo(-1.20,-1.90,-1.53,-1.39);curve.lineTo(-1.36,-1.23);
    curve.bezierCurveTo(.65,-2.16,1.89,-.24,-.48,1.14);curve.closePath();
    kit.profile(curve,relief,.23,15.12,rf,.15);
    for(const [x,y,w] of [[-1.20,17.07,1.35],[.84,17.46,1.71],[2.24,16.71,1.16],[-2.35,16.47,.73],[-1.42,12.37,1.04],[.63,12.12,1.22]]){
      const flag=new T.Shape();flag.moveTo(-w,0);flag.quadraticCurveTo(-.56*w,.36,-.12*w,.13);
      flag.quadraticCurveTo(.35*w,-.16,w,.29);flag.quadraticCurveTo(.46*w,-.44,-.12*w,-.18);
      flag.quadraticCurveTo(-.58*w,.09,-w,0);kit.profile(flag,relief,x,y,rf,.11);
    }
    box(0xa48c61,0,4.5,34.37,4.2,1.01,.17);kit.sign('HỒ CHÍ MINH',0,4.54,34.50,3.66,.68,true);
    for(const side of [-1,1])for(const x of [11.1,21.4]){
      const z=50.7-x;
      const bottom=[[side*x-.56,1.85,z-.65],[side*x+.56,1.85,z-.65],[side*x+.56,1.85,z+.65],[side*x-.56,1.85,z+.65]];
      const tip=bottom.map(([u,y,v])=>[side*x+(u-side*x)*.15,12.65+(u-side*x)*.75,z+(v-z)*.15]);
      shell(T,kit,bottom,tip,ivory,bright,ivory);
    }
    box(stone,0,.93,45.92,27.1,1.86,20.8);
    for(let i=0;i<12;i++){
      const h=(12-i)*.154;
      box(i%3?stone:0xa68f82,0,h/2,56.51+i*.45,15.2,h,.465);
    }
    for(const x of [-10.5,10.5]){
      box(0x9c8c81,x,.49,57.55,4.65,.98,5.67);
      box(0xa6a08c,x,1.03,57.55,4.72,.14,5.72);
      box(0x77845e,x,1.14,57.55,4.21,.11,5.18);
    }
    // The terrain raster picks up the roof of the museum. Seat the rigid
    // building at its centre and carry the actual steps down to the forecourt.
    // Real slab undersides also extend down to the sampled ground at each corner.
    let originals;
    kit.group.userData.fitGround=ground=>{
      const mesh=kit.group.children.find(child=>child.geometry?.hasAttribute('finishKind'));
      if(!mesh)return;
      const geo=mesh.geometry,p=geo.attributes.position;
      originals??=p.array.slice();
      const foot=ground(0,61.7);
      for(let i=0;i<p.count;i++){
        const x=originals[i*3],y=originals[i*3+1],z=originals[i*3+2];
        if(y>2.01)continue;
        const t=Math.max(0,Math.min(1,(z-42)/19.7)),ramp=t*t*(3-2*t);
        const level=y+foot*ramp;
        p.setY(i,y<=.002?Math.min(level,ground(x,z)-.06):level);
      }
      p.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();
    };
  });
})();
