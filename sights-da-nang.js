'use strict';
(() => {

  // Alignment from the two OSM carriageways. Distances along +X run west
  // to east. The three exposed steel spans emerge separately above the deck.
  function cauRong(T, {palette, group, stamp, box, deck, profile, round}) {
    const yellow = 0xf4bf19, sunlit = 0xffcf35, ochre = 0xc2941e;
    const pier = 0xc8c7ba, coping = 0xd9d4c5, iron = 0x64736e;
    const west = -315, east = 321;
    const tubes = [[0,1.47],[-1.48,.55],[1.48,.55],[-1.05,-.99],[1.05,-.99]];
    palette({plaster: ochre, metal: iron});
    function pipe(points,radius,tint,steps) {
      const curve = new T.CatmullRomCurve3(points.map(([x,y,z])=>new T.Vector3(x,y,z)));
      const geo = new T.TubeGeometry(curve,steps,radius,9,false);
      stamp(geo,tint,0,0,0);
      geo.dispose();
    }
    function bar(a,b,w,h,tint) {
      const [dx,dy,dz]=b.map((v,i)=>v-a[i]);
      box(tint,(a[0]+b[0])*.5,(a[1]+b[1])*.5,(a[2]+b[2])*.5,
        w,h,Math.hypot(dx,dy,dz),Math.atan2(dx,dz),-Math.atan2(dy,Math.hypot(dx,dz)));
    }
    function plate(shape,tint,x,y,z,d) {
      profile(shape,tint,x,y,z,d);
    }
    const sections=Math.ceil((east-west)/8);
    const step=(east-west)/sections;
    // Keep the national road renderer's asphalt, markings and terrain profile.
    // The dressed sidewalks and the brick median have their own narrow strips.
    for(let i=0;i<sections;i++) {
      const x=west+(i+.5)*step;
      box(0x93897f,x,-.78,0,step,1.0,37.5);
      deck(0xb27157,x,.065,0,step-.016,.20,5.25);
      for(const s of [-1,1]){
        deck(0xc29983,x,.075,s*16.10,step-.018,.24,5.1);
        box(coping,x,.245,s*13.58,step,.34,.27);
        box(pier,x,.30,s*18.37,step,.60,.46);
        box(iron,x,1.02,s*18.39,step,.085,.10);
        box(iron,x,.78,s*18.39,step,.056,.072);
        for(const off of [-step*.25,step*.25])box(iron,x+off,.81,s*18.39,.075,.60,.08);
      }
    }
    for(const x of [-230,-96,100,223]){
      box(pier,x,-1.5,0,6.3,2.25,35);
      for(const z of [-10.4,10.4])stamp(round,0xb3b3a9,x,-5.25,z,2.9,8.6,3.8);
    }
    for(let x=west+14;x<east-4;x+=29)for(const s of [-1,1]){
      stamp(round,iron,x,3.9,s*17.96,.105,7.5,.105);
      bar([x,7.6,s*17.96],[x+.48,8.02,s*15.87],.094,.095,iron);
      box(0xc5c6b7,x+.48,7.99,s*15.67,.32,.13,.69);
    }

    const fin = new T.Shape();
    fin.moveTo(-2.1,0);fin.quadraticCurveTo(-.83,.93,1.57,1.03);
    fin.lineTo(2.14,.65);fin.quadraticCurveTo(.62,.52,.25,0);fin.closePath();
    for (const [start,end,rise] of [[-211,-118,15.0],[-77,82,27.5],[120,210,15.0]]) {
      const width=end-start;
      const yAt=t=>.42+4*t*(1-t)*rise;
      for(const [z,dy] of tubes){
        const points=Array.from({length:19},(_,i)=>{
          const t=i/18;
          return [start+width*t,yAt(t)+dy,z];
        });
        pipe(points,.60,dy<0?0xe6aa12:yellow,Math.ceil(width/1.9));
      }
      for(const endX of [start,end])box(coping,endX,.49,0,6.6,.94,5.3);
      const bays=Math.round(width/8);
      for(let i=1;i<bays;i++) {
        const t=i/bays,x=start+width*t,y=yAt(t),slope=4*rise*(1-2*t)/width;
        const rot=Math.atan(slope);
        // Bolt plates bridge the five individual tubes at the frame stations.
        for(let j=0;j<5;j++){
          const [z,dy]=tubes[j],[nz,ny]=tubes[[1,3,0,4,2][j]];
          bar([x,y+dy,z],[x,y+ny,nz],.29,.34,ochre);
        }
        if(y>3.6) {
          bar([x,1.0,0],[x,y-1.5,0],.15,.15,iron);
          box(0x495956,x,1.14,0,.36,.53,.34);
        }
        const geom=new T.ExtrudeGeometry(fin,{depth:.2,bevelEnabled:false,curveSegments:7});
        stamp(geom,sunlit,x,y+1.83,-.1,1,1,1,0,0,rot);
        geom.dispose();
      }
    }

    // Rolled tubes carry the head. Its mane and jaws are a set of parallel
    // cut-steel plates, leaving an actual opening between the raised lips.
    for(const [z,dy] of tubes) {
      pipe([[241,.53,z],[244,4.4+.72*dy,z],[249.5,9.2+dy,z],[254.2,10.5+dy,z]],
        .60,yellow,18);
    }
    box(coping,241.1,.46,0,6.3,.92,5.2);
    const cheek=new T.Shape();
    cheek.moveTo(-6.4,1.35);
    cheek.bezierCurveTo(-7.1,2.2,-5.95,3.15,-5.16,2.76);
    cheek.bezierCurveTo(-3.84,2.17,-2.55,2.42,-1.80,2.57);
    cheek.quadraticCurveTo(-2.8,2.85,-3.91,3.46);
    cheek.quadraticCurveTo(-2.09,4.18,-.48,3.48);
    cheek.bezierCurveTo(1.19,4.53,2.77,4.03,3.21,3.17);
    cheek.quadraticCurveTo(3.89,3.47,4.63,4.27);
    cheek.quadraticCurveTo(4.35,3.43,4.32,3.13);
    cheek.bezierCurveTo(5.32,2.65,5.88,3.74,6.62,3.78);
    cheek.bezierCurveTo(7.58,4.31,8.14,3.18,7.93,2.43);
    cheek.quadraticCurveTo(8.5,1.93,8.11,1.34);
    cheek.quadraticCurveTo(7.57,.99,7.25,1.67);
    cheek.bezierCurveTo(6.68,2.52,5.27,1.87,5.03,1.06);
    cheek.bezierCurveTo(4.8,.28,6.24,-.07,6.87,.21);
    cheek.quadraticCurveTo(7.63,.67,8.18,.42);
    cheek.lineTo(8.62,.02);cheek.lineTo(8.08,-.02);cheek.lineTo(8.36,-.52);
    for(const [x,y] of [[7.77,-.35],[7.38,-1.17],[7.07,-.73],[6.30,-1.70],[5.94,-1.15],
      [5.09,-2.18],[4.77,-1.49],[3.92,-2.38],[3.62,-1.38],[2.6,-2.48],[2.29,-1.17]])cheek.lineTo(x,y);
    cheek.quadraticCurveTo(.94,-1.99,-1.67,-2.92);
    cheek.quadraticCurveTo(-.60,-2.03,-.22,-1.43);
    cheek.quadraticCurveTo(-3.38,-2.67,-5.66,-2.33);
    cheek.quadraticCurveTo(-3.89,-1.94,-2.64,-.53);
    cheek.quadraticCurveTo(-5.55,-1.0,-7.11,-.32);
    cheek.quadraticCurveTo(-4.98,.07,-3.42,.85);
    cheek.quadraticCurveTo(-5.35,.60,-6.4,1.35);cheek.closePath();
    const lowerJaw=new T.Shape();
    lowerJaw.moveTo(-3,.32);lowerJaw.quadraticCurveTo(2.05,-1.29,7.89,.08);
    lowerJaw.quadraticCurveTo(7.75,-.68,7,-1.37);lowerJaw.lineTo(6.97,-.79);
    lowerJaw.quadraticCurveTo(5.95,-2.59,5.02,-3.01);lowerJaw.lineTo(5.07,-1.63);
    lowerJaw.quadraticCurveTo(3.76,-3.36,2.55,-3.57);lowerJaw.lineTo(2.81,-1.99);
    lowerJaw.quadraticCurveTo(1.18,-3.36,-.25,-3.38);lowerJaw.lineTo(.54,-1.82);
    lowerJaw.quadraticCurveTo(-1.64,-2.75,-3.49,-2.25);lowerJaw.quadraticCurveTo(-1.88,-1.59,-.92,-.72);lowerJaw.closePath();
    const headX=257.4,headY=10.8;
    for(const z of [-1.90,-1.06,-.22,.62,1.46]) {
      plate(lowerJaw,ochre,headX,headY-.32,z+.13,.34);
      plate(cheek,z<-1.2||z>1.2?sunlit:yellow,headX,headY,z,.43);
    }
    // Rolled upper snout bridges the cheek plates; keep the mouth open below.
    for(const [x,y,rx,ry] of [[6.62,3.16,.67,.58],[7.36,2.97,.65,.56],[7.76,2.48,.54,.45]]){
      stamp(round,yellow,headX+x,headY+y,0,rx,3.75,ry,0,Math.PI/2);
    }
    const pupil=new T.SphereGeometry(1,18,12);
    for(const side of [-1,1]) {
      const z=side*1.93;
      stamp(pupil,ochre,headX+3.03,headY+2.28,z,.88,.76,.21,0,0,.12);
      stamp(pupil,0x5d8390,headX+3.12,headY+2.38,z+side*.12,.56,.47,.17);
      for(const [x,y] of [[2.05,3.19],[1.48,2.77],[1.12,2.12],[.95,1.40],[1.03,.65],
        [1.40,-.02],[2.26,-.58],[3.28,-.83],[4.32,-.69],[5.28,-.51],[6.18,-.32],[7.22,2.99]]) {
        stamp(pupil,yellow,headX+x,headY+y,z+.06*side,.25,.23,.11);
      }
    }
    pupil.dispose();
    // The western lotus tail rises independently from a short cluster of tubes.
    for (const [z,dy] of tubes) {
      pipe([[-241,.47,z],[-245,4.06+dy*.5,z],[-251,7+dy,z],[-258,8.24+dy,z]],.6,yellow,19);
    }
    const petal=new T.Shape();petal.moveTo(0,-1.17);
    petal.bezierCurveTo(-3.5,-1.2,-6.8,.88,-8.92,4.3);
    petal.bezierCurveTo(-6.1,3.48,-3.17,3.47,-1.1,2.13);
    petal.quadraticCurveTo(.6,1.24,1.0,.15);petal.closePath();
    for(let i=-2;i<=2;i++) {
      plate(petal,i%2?yellow:sunlit,-257.1+i*i*.63,8.65-Math.abs(i)*.4,i*.72-.18,.36);
    }
    box(coping,-241,.46,0,6.3,.92,5.2);

    // The bridge occupies many terrain cells. On a district rebase refit the
    // original geometry against the same relief datum as the two road ribbons.
    let baseHeights, previousProfile;
    group.userData.fitGround=ground=>{
      const mesh=group.children.find(child=>child.geometry?.attributes.color);
      if(!mesh)return;
      const positions=mesh.geometry.attributes.position;
      if(!baseHeights)baseHeights=Float32Array.from({length:positions.count},(_,i)=>positions.getY(i));
      const stride=8,count=Math.ceil((east-west)/stride)+2;
      const height=Array.from({length:count},(_,i)=>ground(west+i*stride,0));
      if(previousProfile && height.every((h,i)=>Math.abs(h-previousProfile[i])<.006))return;
      previousProfile=height;
      for(let i=0;i<positions.count;i++){
        const t=Math.max(0,Math.min(count-1.001,(positions.getX(i)-west)/stride)),j=Math.floor(t);
        positions.setY(i,baseHeights[i]+height[j]+(height[j+1]-height[j])*(t-j));
      }
      positions.needsUpdate=true;mesh.geometry.computeBoundingSphere();
    };
  }

  // 2. Hải Vân Quan (Đỉnh Đèo Hải Vân – Thiên Hạ Đệ Nhất Hùng Quan)
  function haiVanQuan(T, kit) {
    const {box, profile, outline, sign} = kit;
    const brick = [0x8e5642, 0x9b624b, 0x7d4c3b, 0x845542];
    const stone = 0x7a766d, mortar = 0xb7ae9c, dark = 0x4b463f, moss = 0x677052;
    kit.palette({stone});

    // Deep mountain-pass stone foundation plinth so it seats solidly on ridge slopes
    box(stone, 0, -1.6, 0, 26.5, 3.6, 22.5);
    box(0x9a9384, 0, 0.28, 0, 25.4, 0.42, 21.6);

    function citadelGate(z, title, reverse = false) {
      const shape = new T.Shape();
      shape.moveTo(-6.6, 0); shape.lineTo(-2.15, 0); shape.lineTo(-2.15, 2.35);
      shape.absarc(0, 2.35, 2.15, Math.PI, 0, true);
      shape.lineTo(2.15, 0); shape.lineTo(6.6, 0); shape.lineTo(6.2, 5.25); shape.lineTo(-6.2, 5.25); shape.closePath();
      profile(shape, brick[0], 0, 0.45, z - 2.35, 4.7);
      // Weathered stone/brick blocks & arch voussoirs
      for (const face of [-1, 1]) {
        const fz = z + face * 2.38;
        for (let i = 0; i < 11; i++) {
          const a = i * Math.PI / 11, b = (i + 1) * Math.PI / 11 - 0.014, pt = (q, t) => [q * Math.cos(t), q * Math.sin(t)];
          outline([pt(2.15, a), pt(2.48, a), pt(2.48, b), pt(2.15, b)], i % 2 ? mortar : stone, 0, 2.8, fz - 0.05, 0.12);
        }
        for (let row = 0; row < 5; row++) {
          for (const s of [-1, 1]) {
            box(brick[(row + (s > 0 ? 1 : 0)) % 4], s * 4.3, 1.0 + row * 0.92, fz, 3.6, 0.82, 0.1);
          }
        }
      }
      // Upper parapet deck & battlements (lỗ châu mai)
      box(mortar, 0, 5.82, z, 12.9, 0.28, 5.1);
      for (const f of [-1, 1]) {
        box(brick[1], 0, 6.24, z + f * 2.32, 12.6, 0.56, 0.42);
        for (let i = -4; i <= 4; i++) box(i % 3 === 0 ? moss : brick[2], i * 1.44, 6.82, z + f * 2.32, 0.82, 0.68, 0.42);
      }
      // Stone inscribed plaque above the arch
      const faceZ = z + (reverse ? -2.44 : 2.44);
      box(mortar, 0, 5.25, faceZ, 4.1, 0.78, 0.14);
      sign(title, 0, 5.25, z + (reverse ? -2.53 : 2.53), 3.85, 0.56);
      if (reverse && kit.group.children.length) kit.group.children.at(-1).rotation.y = Math.PI;
    }

    // Front gate ("HẢI VÂN QUAN") & Rear gate ("THIÊN HẠ ĐỆ NHẤT HÙNG QUAN")
    citadelGate(6.8, 'HẢI VÂN QUAN', false);
    citadelGate(-6.8, 'ĐỆ NHẤT HÙNG QUAN', true);

    // Connecting thick stone-and-brick fortress side walls & stepped stairs up to battlements
    for (const s of [-1, 1]) {
      box(stone, s * 6.85, 2.45, 0, 1.85, 4.0, 11.4);
      box(mortar, s * 6.85, 4.55, 0, 2.05, 0.22, 11.6);
      for (let i = -3; i <= 3; i++) box(brick[Math.abs(i) % 4], s * 7.55, 5.1, i * 1.55, 0.48, 0.88, 0.86);
      // Outer mountain wing ramparts extending sideways
      box(stone, s * 10.2, 1.95, 2.5, 5.4, 3.1, 1.85, -s * 0.28);
      for (let j = 0; j < 4; j++) box(moss, s * (8.4 + j * 1.25), 3.85, 2.5 + j * 0.35, 0.72, 0.72, 0.55, -s * 0.28);
    }
    // Inner stone staircases leading to top of front gatehouse
    for (let st = 0; st < 11; st++) {
      box(stone, -4.6, 0.7 + st * 0.44, 3.8 - st * 0.46, 1.55, 0.44, 0.52);
    }
    // Historic watch bastion & cannon mount inside courtyard
    box(dark, 3.6, 1.05, 0.5, 3.2, 1.2, 2.6);
    box(0x3a3b39, 3.6, 1.88, 0.8, 0.36, 0.36, 2.45, 0, -0.15);
  }

  // 3. Chùa Linh Ứng Bãi Bụt – Bán đảo Sơn Trà (Đà Nẵng)
  function chuaLinhUng(T, kit) {
    const {box,stamp,round,tapered}=kit,A=window.CentralArch;
    const {building,stairs}=createTempleFoundations(T,kit);
    const marble=0xebe8e0,pureWhite=0xf4f2ec,lotusPink=0xe4c7bf,stone=0x918d86,jade=0x486e62;
    const grey=0x7b8388,slate=0x626f72,ivory=0xe7e4d7;
    kit.palette({stone:[marble,stone,grey],glazedTile:jade,tile:slate});
    building(0,0,-.52,37,37,()=>{
      const gx=0,gz=0;
      box(marble,0,.31,0,37,.62,37);
      tapered(marble,gx,2.15,gz,16.45,15.6,3.0,1,40);
      tapered(pureWhite,gx,5.12,gz,15.35,14.8,2.95,1,40);
      for(let i=0;i<12;i++){
        const angle=i*Math.PI/6,x=gx+Math.sin(angle)*15.93,z=gz+Math.cos(angle)*15.93;
        box(marble,x,2.1,z,2.14,2.98,.33,angle);
        box(0x67615c,x+.18*Math.sin(angle),1.9,z+.18*Math.cos(angle),1.53,2.37,.12,angle);
      }
      kit.palette({stone:[marble,pureWhite,lotusPink]});
      CentralArch.lotusSeat(T,kit,gx,5.96,gz,16.43,3.62,pureWhite,lotusPink);
      // Phương Huy's frontal photograph records the crown, the raised right
      // hand, the vessel and the floor-length folds together at this viewpoint.
      const metres=56.8/(417-41);
      A.photoCarving(T,kit,{photo:'sight-imagery/son-tra-quan-am.webp',width:500,height:610,
        crop:[116,0,270,437],origin:[255,417],scale:metres,position:[gx,10.2,gz],tint:pureWhite,
        forms:[
          {z:-.33,rows:[[41,251,254,.20],[44,244,261,.80],[50,242,264,1.36],[55,241,266,1.54],
            [60,238,270,1.79],[69,234,274,2.30],[81,232,277,2.60],[92,230,278,2.71],
            [101,231,278,2.61],[109,232,279,2.46],[117,235,281,2.35],[123,240,282,2.17]]},
          {z:-.62,rows:[[107,236,278,2.45],[113,231,284,2.74],[118,226,294,3.13],[126,220,302,3.46],
            [136,211,308,3.82],[149,203,316,4.27],[159,196,323,4.61],[177,186,332,4.78],
            [190,182,333,4.86],[201,184,329,4.71],[220,189,327,4.56],[235,183,328,4.48],
            [244,183,339,4.44],[253,186,337,4.32],[267,191,328,4.23],[289,190,328,4.37],
            [312,188,329,4.59],[339,184,333,4.90],[351,183,336,5.11],[365,181,340,5.27],
            [377,175,347,5.54],[385,171,359,5.68],[392,179,357,5.77],[403,182,352,5.79],
            [411,181,351,5.70],[415,190,347,5.53],[417,198,343,5.40]]},
          {z:2.50,rows:[[101,227,229,.13],[107,226,229,.20],[109,225,230,.27],[115,223,232,.43],
            [122,217,233,.69],[132,214,235,1.05],[141,213,231,.94],[148,210,225,.83],[154,210,223,.73]]},
          {z:2.84,rows:[[103,220,222,.15],[108,219,222,.20],[114,217,223,.26],[123,216,225,.39],[131,215,226,.45]]},
          {z:3.14,rows:[[141,249,253,.25],[146,247,255,.43],[152,245,258,.62],[157,242,260,.77],
            [161,235,273,1.09],[166,225,279,1.29],[172,234,279,1.46],[177,244,277,1.26],[182,250,271,.96]]}
        ]});
    });

    // The tam quan is a two-storey open stone arcade opposite the main hall.
    building(60,5,-.36,15.2,5.3,()=>{
      box(stone,0,.10,0,15.2,.20,5.3);
      function arcade(x,y,w,h,d){
        const span=w*.33,spring=h*.35,shape=new T.Shape();
        shape.moveTo(-w/2,0);shape.lineTo(-span,0);shape.lineTo(-span,spring);
        shape.absarc(0,spring,span,Math.PI,0,true);shape.lineTo(span,0);
        shape.lineTo(w/2,0);shape.lineTo(w/2,h);shape.lineTo(-w/2,h);shape.closePath();
        kit.profile(shape,grey,x,y,-d/2,d);
        for(const face of [-1,1])for(const side of [-1,1]){
          box(ivory,x+side*w*.419,y+h*.47,face*(d/2+.02),w*.094,h*.81,.055);
          box(slate,x+side*w*.419,y+h*.47,face*(d/2+.062),w*.048,h*.77,.030);
        }
        A.curvedRoof(T,kit,x,y+h,0,w+.52,d+.92,.72,jade,ivory,slate,.31);
      }
      arcade(0,.20,6.34,4.60,4.25);arcade(0,5.41,5.54,3.58,3.35);
      for(const side of [-1,1]){
        arcade(side*5.07,.20,3.84,3.58,3.68);
        arcade(side*4.90,4.40,3.23,2.67,2.85);
      }
    });
    building(90,-70,-.36,28,25.8,()=>{
      A.vietnameseHall(T,kit,{w:25.6,d:23.2,bays:5,doubleTier:true,baseH:1.2,colH:5.7,
        wood:0x873e2e,tile:jade,eave:0xc2b66e,ridge:ivory,wall:0xe0d2aa,atticColor:0x834332,incense:false});
    });
    building(98,-92,-.36,26.4,20.1,()=>{
      A.vietnameseHall(T,kit,{w:24,d:17.5,bays:5,baseH:.92,colH:4.0,wood:0x794638,
        tile:jade,eave:0xb8a576,ridge:ivory,wall:0xdbd2b7,incense:false});
    });

    // Each of the eighteen arhats has its own posture, features and
    // attributes. Leave the courtyard open until each sculpture can be
    // identified at its surveyed plinth.

    // The separate eastern sanctuary carries nine hexagonal, grey stone roofs.
    const stupa=building(328,-23,-.71,18,18,()=>{
      box(stone,0,.21,0,18,.42,18);tapered(grey,0,1.05,0,8.45,7.98,1.26,1,6);
      const medallion=new T.CircleGeometry(1,16);
      let y=1.68;
      for(let i=0;i<9;i++){
        const r=6.83-i*.40,h=3.40-i*.105;
        tapered(0xa0a4a1,0,y+h*.48,0,r,r*.955,h*.96,1,6);
        const vertices=[],indices=[];
        for(let face=0;face<6;face++){
          const a=face*Math.PI/3,b=a+Math.PI/3,mid=(a+b)/2,offset=r*.85;
          for(const [radius,tint,extra] of [[.66,ivory,.04],[.53,0x4b5654,.07],[.29,0xabb0a8,.10]]){
            stamp(medallion,tint,Math.sin(mid)*(offset+extra),y+h*.48+(extra===.10?-.105:0),Math.cos(mid)*(offset+extra),radius,radius,1,mid);
          }
          const first=vertices.length/3;
          for(const [scale,height,upturn] of [[.86,1.01,.12],[1.02,.87,.26],[1.21,.80,.83],[1.21,.74,.83],[.90,.74,.02]]){
            for(let u=0;u<=8;u++){
              const t=u/8,edge=Math.pow(Math.abs(t*2-1),3);
              vertices.push(r*scale*((1-t)*Math.sin(a)+t*Math.sin(b)),y+h*height+edge*upturn,
                r*scale*((1-t)*Math.cos(a)+t*Math.cos(b)));
            }
          }
          for(let j=0;j<4;j++)for(let k=0;k<8;k++){
            const n=first+j*9+k;indices.push(n,n+9,n+1,n+1,n+9,n+10);
          }
        }
        const roof=new T.BufferGeometry();roof.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
        roof.setIndex(indices);roof.computeVertexNormals();stamp(roof,slate,0,0,0);roof.dispose();
        y+=h;
      }
      medallion.dispose();tapered(grey,0,y+.66,0,3.04,.54,1.32,1,6);
      tapered(ivory,0,y+2.08,0,.53,.05,1.70,1,8);
    });
    stairs(stupa,321.6,-18.8,315,-14,4.1,.43,13);
  }

  // 4. Hội quán Phúc Kiến – Hội An (Đà Nẵng / Quảng Nam cũ)
  function hoiQuanPhucKien(T, kit) {
    const {box, stamp, outline, profile, round, sign} = kit;
    const coral = 0xd67c6a, rose = 0xc25f52, cream = 0xefe3c8, crimson = 0x8f2822;
    const jadeTile = 0x3b6e58, gold = 0xd9b04a, stone = 0x9b9589;
    kit.palette({plaster: cream, glazedTile: jadeTile, stone});

    // Ancient Hoi An stone threshold & approach steps
    box(stone, 0, 0.16, 0, 18.8, 0.32, 6.2);
    for (let s = 0; s < 2; s++) box(0xb4ad9f, 0, 0.09 + s * 0.09, 3.4 - s * 0.35, 8.2, 0.12, 0.42);

    function archedSpan(cx, w, h, r, sy, d) {
      const sh = new T.Shape();
      sh.moveTo(-w / 2, 0); sh.lineTo(-r, 0); sh.lineTo(-r, sy);
      sh.absarc(0, sy, r, Math.PI, 0, true);
      sh.lineTo(r, 0); sh.lineTo(w / 2, 0); sh.lineTo(w / 2, h); sh.lineTo(-w / 2, h); sh.closePath();
      profile(sh, coral, cx, 0.32, -d / 2, d);
      for (const f of [-1, 1]) {
        const fz = f * (d / 2 + 0.03);
        for (let i = 0; i < 11; i++) {
          const a = i * Math.PI / 11, b = (i + 1) * Math.PI / 11 - 0.012, pt = (q, t) => [q * Math.cos(t), q * Math.sin(t)];
          outline([pt(r, a), pt(r + 0.2, a), pt(r + 0.2, b), pt(r, b)], i % 2 ? cream : rose, cx, 0.32 + sy, fz - 0.04, 0.09);
        }
      }
    }

    // Triple coral-pink arches
    archedSpan(0, 5.4, 5.25, 1.72, 2.65, 2.8);
    for (const s of [-1, 1]) {
      archedSpan(s * 5.2, 4.9, 4.1, 1.15, 1.95, 2.2);
      // Ornate circular lattice window medallion above side arches
      stamp(round, cream, s * 5.2, 3.65, 1.14, 0.62, 0.1, 0.62, 0, Math.PI / 2);
      stamp(round, jadeTile, s * 5.2, 3.65, 1.18, 0.44, 0.1, 0.44, 0, Math.PI / 2);
      // Side gate double curved jade-green roofs
      window.CentralArch.curvedRoof(T, kit, s * 5.2, 4.42, 0, 5.6, 3.4, 0.92, jadeTile, cream, gold, 0.3);
      // Crimson wooden doors slightly open
      box(crimson, s * 1.48, 1.72, 0.1, 0.14, 2.75, 1.05, s * 0.26);
      // Hanging glowing red Hoi An lanterns
      const lantern = new T.SphereGeometry(0.32, 10, 8);
      stamp(lantern, 0xd83226, s * 2.9, 3.45, 1.65, 0.88, 1.22, 0.88);
      stamp(lantern, 0xd83226, s * 7.2, 2.85, 1.42, 0.78, 1.12, 0.78);
      lantern.dispose();
    }

    // Center upper 2nd & 3rd ornate tiers with crimson-and-gold plaque
    box(cream, 0, 5.62, 0, 5.8, 0.26, 3.2);
    box(crimson, 0, 4.88, 1.46, 3.6, 0.78, 0.14);
    sign('HỘI QUÁN PHÚC KIẾN', 0, 4.88, 1.55, 3.35, 0.54);
    window.CentralArch.curvedRoof(T, kit, 0, 5.75, 0, 7.2, 4.4, 1.12, jadeTile, cream, gold, 0.34);

    // Upper pavilion attic with ornate pink/gold relief panels
    box(rose, 0, 7.25, 0, 4.4, 1.45, 2.45);
    for (const dx of [-1.4, 0, 1.4]) box(gold, dx, 7.25, 1.26, 0.65, 0.95, 0.08);
    window.CentralArch.curvedRoof(T, kit, 0, 7.95, 0, 5.8, 3.6, 1.18, jadeTile, cream, gold, 0.3);

    // Ornate roof crest (Lưỡng long tranh châu)
    for (const s of [-1, 1]) {
      outline([[-0.85, 0], [-0.45, 0.28], [-0.1, 0.2], [0.1, 0.62], [0.32, 0.44], [0.44, 0.15], [0.05, 0]],
        gold, s * 0.92, 9.2, -0.09, 0.18, s > 0 ? Math.PI : 0);
    }
    const orb = new T.SphereGeometry(0.28, 10, 8);
    stamp(orb, gold, 0, 9.75, 0, 1, 1, 0.5);
    orb.dispose();
  }

  (window.VietnamSights ??= []).push({
    id: 'cau-rong', name: 'Cầu Rồng', city: 'Đà Nẵng', province: 'Đà Nẵng', region: 'Trung Bộ',
    catalogId: 'osm-way-694831926', lon: 108.227128, lat: 16.061147, yaw: .033,
    start: [108.22456,16.060987], width: 636, depth: 37.5, viewDistance: 1650, plasterStain: .018,
    solids: [[3,0,318,2.6],[3,-18.38,318,.24],[3,18.38,318,.24]],
    views: [
      {name:'Toàn cảnh từ sông Hàn',height:30,viewAngle:.73,viewElevation:.22,viewRadius:470},
      {name:'Đầu rồng',offset:[255,-8.4],height:15,viewAngle:.69,viewElevation:.14,viewRadius:29},
      {name:'Đuôi rồng',offset:[-254,8.4],height:12,viewAngle:-.57,viewElevation:.16,viewRadius:33}
    ],
    description: 'Ba nhịp vòm thép vàng nổi lên giữa hai chiều xe chạy. Năm ống thép tạo dáng thân rồng, từ chiếc đuôi phía Hải Châu đến đầu rồng ghép bằng nhiều lớp thép hướng ra biển.',
    photo: 'https://cttdt.danangportal.gov.vn/vi/web/dng/w/toan-canh-cau-rong-tu-tren-cao-i',
    source: 'https://baochinhphu.vn/dang-ky-ky-luc-guinness-cho-cau-rong-da-nang-102134027.htm',
    map: 'https://www.openstreetmap.org/way/694831926',
    build: cauRong
  }, {
    id: 'hai-van-quan', name: 'Hải Vân Quan', city: 'Đèo Hải Vân', province: 'Đà Nẵng', region: 'Trung Bộ',
    lon: 108.13060, lat: 16.18820, start: [108.130946, 16.188057], yaw: 1.166, width: 28, depth: 24,
    solids: [[-4.5, 6.8, 2.2, 2.4], [4.5, 6.8, 2.2, 2.4], [-4.5, -6.8, 2.2, 2.4], [4.5, -6.8, 2.2, 2.4], [-6.85, 0, 1.0, 5.7], [6.85, 0, 1.0, 5.7]],
    description: 'Cụm pháo đài cửa ải xây năm 1826 trên đỉnh đèo Hải Vân với hai cổng vòm gạch đá mang biển Hải Vân Quan và Thiên hạ đệ nhất hùng quan.',
    photo: 'https://vnexpress.net/hai-van-quan-sau-gan-3-nam-trung-tu-4775142.html',
    source: 'https://vi.wikipedia.org/wiki/H%E1%BA%A3i_V%C3%A2n_Quan',
    map: 'https://www.openstreetmap.org/?mlat=16.1882&mlon=108.1306#map=18/16.1882/108.1306',
    build: haiVanQuan
  }, {
    id: 'chua-linh-ung-son-tra', name: 'Chùa Linh Ứng Bãi Bụt', city: 'Sơn Trà', province: 'Đà Nẵng', region: 'Trung Bộ',
    lon:108.277016,lat:16.099686,start:[108.277460,16.098590],yaw:0,width:37,depth:37,viewElevation:.22,
    modeledStairWays:[1205397097],
    solids:[[0,0,14.5,14.5],[90,-70,12,11],[98,-92,11,8],[328,-23,6.7,6.7],
      [53.4,2.5,.6,.6],[57.0,3.9,.6,.6],[63.0,6.1,.6,.6],[66.6,7.5,.6,.6]],
    views:[{name:'Quan Âm hướng vịnh Đà Nẵng',offset:[0,0],height:67,viewRadius:112,viewAngle:-.61},
      {name:'Sân chùa và chánh điện',offset:[75,-32],height:13,viewRadius:83,viewAngle:-.48,viewElevation:.34},
      {name:'Tháp Xá Lợi',offset:[328,-23],height:32,viewRadius:59,viewAngle:-.66},
      {name:'Toàn cảnh từ Quan Âm tới tháp Xá Lợi',offset:[144,-27],height:27,viewRadius:368,viewAngle:-.15,viewElevation:.42}],
    description:'Trên sườn núi Sơn Trà, tượng Quan Âm hướng ra vịnh. Mặt trước được dựng từ ảnh chụp tại chùa. Ngoài thực địa có 18 tượng La Hán giữa tam quan và chánh điện. Các tượng này đang ẩn trong mô hình.',
    photo:'https://danangfantasticity.com/en/kham-pha/chua-linh-ung-bai-but-da-nang',
    source:'https://csdl.vietnamtourism.gov.vn/dest/?item=954',
    map: 'https://www.openstreetmap.org/way/420947244',
    build: chuaLinhUng
  }, {
    id: 'hoi-quan-phuc-kien', name: 'Hội quán Phúc Kiến', city: 'Hội An', province: 'Đà Nẵng', region: 'Trung Bộ', formerProvince: 'Quảng Nam',
    // Inner tam quan on footway 485160139. Start projects its Trần Phú junction (node 4779272265) onto the driving graph.
    // Local +Z faces the street, 23° west of south per the survey:
    // https://hoianheritage.net/vi/trao-doi-chuyen-nganh/chuyen-de-nghien-cuu-trao-doi/kien-truc-co-cac-hoi-quan-cua-nguoi-hoa-o-hoi-an-quang-nam-735.html
    lon: 108.3307004, lat: 15.8777681, start: [108.330591, 15.877387], yaw: -23 * Math.PI / 180, width: 20, depth: 10,
    catalogId: 'osm-way-320722329',
    solids: [[-7.2, 0, 1.4, 1.5], [-3.4, 0, 0.7, 1.8], [3.4, 0, 0.7, 1.8], [7.2, 0, 1.4, 1.5]],
    description: 'Cổng tam quan hồng son ba tầng mái ngói ống men xanh, đèn lồng đỏ và lưỡng long tranh châu nổi bật giữa phố cổ Hội An.',
    photo: 'https://vinwonders.com/vi/wonderpedia/news/hoi-quan-phuc-kien-hoi-an/',
    source: 'https://hoianheritage.net/uploads/download/hoi-quan-phuc-kien.pdf',
    map: 'https://www.openstreetmap.org/node/4779272267',
    build: hoiQuanPhucKien
  });
})();
