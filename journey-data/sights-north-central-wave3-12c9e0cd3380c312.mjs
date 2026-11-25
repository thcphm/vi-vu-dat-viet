const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const A = window.CentralArch;

  // 206 Trường Thi. Local X and Z follow east and south in the surveyed
  // compound. The two galleries link back to the exhibition hall by passages.
  function baoTangThanhHoa(T, kit) {
    const {box, stamp, round} = kit;
    const ochre=0xe3c386, cream=0xecdfbb, trim=0xb79762, glass=0x405055;
    const stone=0xaaa697, tile=0x8b6f59, timber=0x58483d;
    kit.palette({plaster:[ochre,cream,trim],glass,stone,tile,timber});
    const cx=-3.75, front=1.78, width=46.5;
    box(stone,cx,.095,9.7,48,.19,17);
    box(ochre,cx,5.9,-4.2,width,11.8,11.96);
    for(const x of [-25.45,18.15]) box(ochre,x,5.9,-12.4,3,11.8,5.5);
    for(const [y,h,c,overhang] of [[.26,.32,stone,.12],[3.34,.16,trim,.10],[3.54,.18,cream,.18],
      [11.59,.16,trim,.12],[11.83,.20,cream,.24],[12.06,.16,ochre,.16]]) {
      box(c,cx,y,-4.2,width+overhang*2,h,11.96+overhang*2);
    }
    // Recessed triplets of narrow upper windows, set behind the vertical fins.
    for(const face of [-1,1]) {
      const z=face>0?front:-10.18;
      for(let i=-6;i<=6;i++) {
        if(i===0&&face===1)continue;
        const x=cx+i*3.45;
        for(const [y,h,pane] of [[1.72,2.22,.96],[5.62,2.78,.61],[9.65,2.70,.61]]) {
          const cols=y<2?2:3;
          for(let k=0;k<cols;k++) {
            const wx=x+(k-(cols-1)*.5)*(pane+.20);
            box(timber,wx,y,z+face*.02,pane+.10,h+.08,.075);
            box(glass,wx,y+.02,z+face*.065,pane-.055,h-.12,.038);
            box(cream,wx,y-.04,z+face*.092,.042,h,.05);
          }
          box(cream,x,y-h*.5-.05,z+face*.13,2.63,.11,.32);
        }
        box(ochre,x+1.51,7.46,z+face*.105,.18,7.85,.25);
      }
    }
    // The openwork parapet runs below a continuous coping at both roof edges.
    for(const z of [front,-10.18]) {
      box(ochre,cx,12.27,z,width,.35,.39);
      box(cream,cx,12.89,z,width+.18,.17,.45);
      for(let i=0;i<=110;i++)box(ochre,cx-width/2+i*width/110,12.59,z,i%11?.16:.36,.57,.34);
    }
    // Raised entrance reached by mirrored flights across the facade.
    box(ochre,cx,6.52,2.70,5.5,13.04,1.84);
    box(cream,cx,12.98,2.70,5.84,.32,2.20);
    box(timber,cx,4.77,3.66,2.10,2.73,.15);
    box(glass,cx,4.73,3.76,1.68,2.48,.10);
    box(cream,cx,9.23,3.66,3.15,4.66,.18);
    stamp(round,0xab7952,cx,10.02,3.80,1.08,.12,1.08,0,Math.PI/2);
    const ring=new T.TorusGeometry(.80,.039,6,32);
    stamp(ring,cream,cx,10.02,3.88);
    ring.dispose();
    A.plaque(T,kit,'BẢO TÀNG THANH HÓA',cx,8.15,3.80,3.05,.46,{bg:'#e1d7c5',fg:'#4d4438',frame:false});
    box(ochre,cx,1.78,4.71,2.84,3.56,2.48);
    for(const side of [-1,1]) {
      for(let i=0;i<17;i++) {
        const h=(i+1)*.20,x=cx+side*(7.18-i*.345);
        box(stone,x,h/2,4.77,.35,h,2.14);
        box(ochre,x,h+.22,5.88,.35,.44,.36);
        if(i%2===0)box(ochre,x,h+.53,5.88,.17,.65,.31);
      }
      box(ochre,cx+side*4.34,2.60,5.88,6.84,.21,.37,0,0,-side*.52);
    }
    // Respect both surveyed wing footprints and the intervening openings.
    for(const [x,z,w,d] of [[-46.83,-11.10,22.6,14.3],[49.26,-12.05,15.8,10.4]]) {
      box(cream,x,3.63,z-.82,w,7.26,d-1.64);
      box(stone,x,.24,z,w+.44,.48,d+.32);
      for(const y of [3.44,7.15])box(cream,x,y,z,w+.34,.24,d+.26);
      const count=Math.round(w/3.3),bay=w/count;
      for(let i=0;i<count;i++){
        const wx=x-w/2+(i+.5)*bay;
        for(const y of [.46,3.65]){
          box(timber,wx,y+1.20,z+d/2-1.61,1.34,2.22,.08);
          kit.arch(cream,wx,y,z+d/2-.28,bay,3.22);
        }
      }
      A.gabledRoof(T,kit,x,7.30,z,w+.48,d+.70,1.83,tile,cream,{alongX:true});
    }
    for(const [x,w] of [[-31.25,8.5],[30.52,21.75]]){
      box(cream,x,3.19,-8.55,w,.23,2.62);
      for(let j=0;j<Math.ceil(w/3.5);j++)box(ochre,x-w/2+.3+j*3.5,1.60,-7.53,.34,3.2,.34);
    }
    A.trees(T,kit,[{x:-18,z:11,h:14,kind:'banyan'},{x:18,z:13,h:13,kind:'banyan'},
      {x:-13.4,z:4.3,h:6.9,kind:'palm'},{x:7.3,z:4.65,h:6.5,kind:'palm'}]);
  }

  // 2. Đền Sòng Sơn (Bỉm Sơn, Thanh Hóa) — "Đền Sòng thiêng nhất xứ Thanh" with clear Suối Cá stream & stone bridge
  function denSongSon(T, kit) {
    const { box, stamp, round } = kit;
    const ochre = 0xe3c888, crimson = 0x86241b, tile = 0x943f2b, gold = 0xdcb045, stone = 0x948d81, stream = 0x2f7d86;
    kit.palette({plaster: ochre, tile, stone});

    // Brick-paved sacred courtyard bisected by the iconic clear emerald stream (Suối Cá Đền Sòng)
    box(0x9b5a44, 0, 0.14, 1.0, 28, 0.28, 26);
    box(stream, 0, 0.20, 5.2, 27.6, 0.24, 3.2);
    for (const sz of [3.55, 6.85]) box(stone, 0, 0.34, sz, 27.6, 0.36, 0.35);
    // Arched stone footbridge spanning the sacred stream to the main hall
    box(stone, 0, 0.52, 5.2, 4.6, 0.34, 4.2);
    for (const s of [-1, 1]) {
      box(0xb9b09e, s * 2.15, 1.05, 5.2, 0.28, 0.78, 4.2);
    }

    // Ornate front 3-bay Mother Goddess Tam Quan gate at z = +10.6
    const gz = 10.6;
    A.vaultedBay(T, kit, 0, gz, 5.0, 4.6, 1.54, 2.3, 2.3, ochre, 0xb89652, 0x5c3e2a);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 4.3, gz, 3.6, 3.3, 0.96, 1.65, 1.85, ochre, 0xb89652, 0x5c3e2a);
      A.curvedRoof(T, kit, s * 4.3, 3.35, gz, 4.4, 2.7, 0.82, tile, 0xded0b0, gold, 0.26);
    }
    A.curvedRoof(T, kit, 0, 4.65, gz, 6.2, 3.3, 0.98, tile, 0xded0b0, gold, 0.30, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'ĐỀN SÒNG SƠN', 0, 4.05, gz + 1.24, 4.0, 0.66, { bg: '#7b1f18', fg: '#f8dc76' });

    // Double-tier sanctuary dedicated to Thánh Mẫu Liễu Hạnh behind the stream
    const hz = -4.2;
    box(stone, 0, 0.58, hz, 17.6, 1.16, 10.6);
    A.steps(kit, 0, hz + 5.8, 5.8, 1.4, 4, 0.28, 0.38, 0x827c71);
    box(ochre, 0, 3.0, hz - 0.3, 15.0, 3.7, 8.2);
    for (let i = -3; i <= 3; i++) {
      stamp(round, crimson, i * 2.3, 3.0, hz + 4.15, 0.20, 3.7, 0.20);
    }
    A.curvedRoof(T, kit, 0, 4.88, hz, 18.0, 10.8, 1.65, tile, 0xded0b0, gold, 0.32);
    box(crimson, 0, 7.05, hz, 11.4, 1.65, 6.4);
    A.curvedRoof(T, kit, 0, 7.9, hz, 13.4, 8.4, 1.9, tile, 0xded0b0, gold, 0.30, { dragons: true, goldColor: gold });

    A.trees(T, kit, [
      { x: -12.0, z: -7.2, h: 9.2, kind: 'banyan' },
      { x: 12.0, z: -7.2, h: 9.2, kind: 'banyan' },
      { x: -11.4, z: 9.4, h: 7.0, kind: 'banyan' }
    ]);
  }

  // The upper stone platform and the well sit on separate grades. Their
  // relative positions follow the visible remains on the Đốn Sơn hillside.
  function danTeNamGiaoTayDo(T, kit) {
    const stone=[0x9b9b8a,0xa7a594,0x888f80,0xa4a28e],turf=0x818c5e;
    const {fixture,building,walk,stairs}=createTempleFoundations(T,kit);
    const {box,stamp,round}=kit;
    kit.palette({stone});
    // The battered terrace edges leave a break for the processional axis.
    for(const [z,half,h] of [[63,46,.48],[21,46,.63],[-18,41,.72],[-48,32,.85]]){
      const count=Math.ceil((half-3.3)/2.3),length=(half-3.3)/count;
      for(const side of [-1,1])for(let i=0;i<count;i++){
        const x=side*(3.3+(i+.5)*length);
        fixture(ground=>ground(x,z),()=>box(stone[i%4],x,h/2-.16,z,length-.025,h+.3,.75));
      }
    }
    walk(5.2,141,0,11);
    const altar=building(2.5,-64.6,0,19.1,18.65,()=>{
      box(turf,0,.25,0,18.9,.5,18.45);
      for(const side of [-1,1]){
        box(stone[2],side*9.35,.40,0,.4,.8,18.65);
        box(stone[1],0,.40,side*9.12,18.65,.8,.41);
      }
      stamp(round,stone[1],0,.70,0,2.375,.4,2.375);
    });
    stairs(altar,2.5,-55.3,2.5,-50,3.4,.5,6);
    const wx=45,wz=36.3;
    fixture(ground=>Math.max(...[-6.5,6.5].flatMap(dx=>[-6.5,6.5].map(dz=>ground(wx+dx,wz+dz)))),()=>{
      // From the square outer curb, three ledges descend into the round shaft.
      for(let tier=0;tier<3;tier++){
        const half=6.5-tier*.80,run=.81,top=1.38-tier*.43;
        for(const side of [-1,1]){
          box(stone[tier],wx+side*(half-run/2),top/2-.04,wz,run,top+.08,half*2);
          box(stone[(tier+1)%4],wx,top/2-.04,wz+side*(half-run/2),half*2-2*run,top+.08,run);
        }
      }
      const edge=a=>4.12/Math.max(Math.abs(Math.sin(a)),Math.abs(Math.cos(a)));
      const point=(a,r)=>new T.Vector2(Math.sin(a)*r,-Math.cos(a)*r);
      for(let k=0;k<40;k++){
        const a=k*Math.PI/20,b=(k+1)*Math.PI/20;
        const shape=new T.Shape([point(a,3.25),point(a,edge(a)),point(b,edge(b)),point(b,3.25)]);
        const block=new T.ExtrudeGeometry(shape,{depth:.34,bevelEnabled:false});
        block.rotateX(-Math.PI/2);stamp(block,stone[k%4],wx,-.03,wz);block.dispose();
      }
      stamp(round,0x34554b,wx,.025,wz,3.25,.045,3.25);
    });
  }

  // 4. Nhà thờ Chính tòa Thanh Hóa (1926) — Historic ochre-and-stone Gothic cathedral with soaring central bell spire
  function nhaThoThanhHoa(T, kit) {
    A.gothicChurch(T, kit, {
      wall: 0xdccaa4,
      trim: 0xb69f78,
      roof: 0x8a3d2b,
      glass: 0x284359,
      w: 14.6,
      d: 26.5,
      naveH: 9.8,
      towerH: 25.5,
      twinTowers: false,
      title: 'NHÀ THỜ CHÍNH TÒA THANH HÓA'
    });
    A.trees(T, kit, [
      { x: -11.4, z: 8.6, h: 8.2, kind: 'banyan' },
      { x: 11.4, z: 8.6, h: 8.2, kind: 'banyan' }
    ]);
  }

  // 5. Chùa Cầm Sơn (Thiên Cầm, Cẩm Xuyên, Hà Tĩnh) — Cliffside coastal temple overlooking Thiên Cầm Bay
  function chuaCamSon(T, kit) {
    const { box, stamp, round } = kit;
    const ochre = 0xe2c88d, tile = 0x8f3f2c, gold = 0xdba844, stone = 0x8f8a80, crimson = 0x7b231a;
    kit.palette({plaster: ochre, tile, stone});

    // Terraced stone mountain cliff platform
    box(stone, 0, 0.45, 0.5, 28, 0.9, 25);
    A.steps(kit, 0, 13.6, 6.2, 1.8, 4, 0.22, 0.40, 0x7c786e);

    // Coastal Tam Quan gate overlooking the bay
    A.vaultedBay(T, kit, 0, 10.0, 4.8, 4.4, 1.48, 2.2, 2.2, ochre, 0xb89658, 0x5c422c);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 4.2, 10.0, 3.4, 3.2, 0.94, 1.6, 1.8, ochre, 0xb89658, 0x5c422c);
      A.curvedRoof(T, kit, s * 4.2, 3.25, 10.0, 4.2, 2.6, 0.82, tile, 0xdcd0b2, gold, 0.26);
    }
    A.curvedRoof(T, kit, 0, 4.45, 10.0, 5.8, 3.2, 0.95, tile, 0xdcd0b2, gold, 0.28, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'CHÙA CẦM SƠN', 0, 3.9, 11.18, 3.8, 0.64, { bg: '#782018', fg: '#f8dc76' });

    // Double-tier main hall raised on mountain plinth
    const hz = -3.8;
    box(stone, 0, 1.25, hz, 16.6, 0.95, 10.2);
    box(ochre, 0, 3.55, hz - 0.3, 14.0, 3.6, 7.8);
    for (let i = -3; i <= 3; i++) {
      stamp(round, crimson, i * 2.15, 3.55, hz + 3.95, 0.19, 3.6, 0.19);
    }
    A.curvedRoof(T, kit, 0, 5.4, hz, 16.8, 10.4, 1.6, tile, 0xdcd0b2, gold, 0.32);
    box(crimson, 0, 7.55, hz, 10.6, 1.55, 6.2);
    A.curvedRoof(T, kit, 0, 8.35, hz, 12.6, 8.0, 1.85, tile, 0xdcd0b2, gold, 0.30, { dragons: true, goldColor: gold });

    A.trees(T, kit, [
      { x: -11.6, z: -6.8, h: 10.2, kind: 'pine' },
      { x: 11.6, z: -6.8, h: 10.4, kind: 'pine' },
      { x: -10.8, z: 3.4, h: 9.2, kind: 'pine' }
    ]);
  }

  // 6. Khu tưởng niệm Tổng Bí thư Hà Huy Tập (Cẩm Hưng, Cẩm Xuyên, Hà Tĩnh)
  function khuTuongNiemHaHuyTap(T, kit) {
    const { box, stamp, round } = kit;
    const thatch = 0xb59c6a, wood = 0x5d3d26, tile = 0x8c3f2c, cream = 0xeee4ce, granite = 0xa39e94;
    kit.palette({thatch, timber: wood, tile, plaster: cream, stone: granite});

    box(0xaa9c82, 0, 0.14, 0.5, 28, 0.28, 24);

    // Traditional 3-bay thatched wooden ancestral house of General Secretary Hà Huy Tập on left
    const hx = -6.2, hz = -1.8;
    box(0x8c8478, hx, 0.22, hz, 11.2, 0.44, 6.8);
    box(0x947e57, hx, 1.55, hz - 0.4, 9.8, 2.25, 4.8);
    for (let i = -2; i <= 2; i++) {
      stamp(round, wood, hx + i * 2.2, 1.55, hz + 2.6, 0.13, 2.3, 0.13);
    }
    A.gabledRoof(T, kit, hx, 2.7, hz, 11.4, 7.0, 2.5, thatch, 0x8e764d, { alongX: true, overhang: 0.85, thick: 0.34 });

    // Stately red-tiled memorial & incense sanctuary on right
    const mx = 6.4, mz = -3.4;
    box(granite, mx, 0.45, mz, 11.4, 0.9, 8.2);
    box(cream, mx, 2.65, mz - 0.3, 9.6, 3.4, 6.2);
    for (let i = -2; i <= 2; i++) {
      stamp(round, 0x6c241b, mx + i * 2.05, 2.65, mz + 3.1, 0.17, 3.4, 0.17);
    }
    A.curvedRoof(T, kit, mx, 4.4, mz, 11.8, 8.6, 1.75, tile, 0xd8c8a8, 0xd2a44c, 0.30);

    A.trees(T, kit, [
      { x: -11.6, z: 6.8, h: 8.6, kind: 'palm' },
      { x: -11.6, z: 2.6, h: 8.8, kind: 'palm' },
      { x: 11.8, z: 6.4, h: 7.8, kind: 'banyan' },
      { x: -11.8, z: -7.8, h: 8.4, kind: 'banyan' }
    ]);
  }

  // 7. Khu di tích Hải Thượng Lãn Ông Lê Hữu Trác (Hương Sơn, Hà Tĩnh) — UNESCO physician tomb & hillside memorial temple
  function haiThuongLanOng(T, kit) {
    const { box, stamp, round } = kit;
    const stone = 0x8f8c83, darkStone = 0x6f6c64, ochre = 0xdec895, tile = 0x863f2e, gold = 0xd2a54a, crimson = 0x79251b;
    kit.palette({stone: [stone, darkStone], plaster: ochre, tile});

    // Terraced mountain memorial court with carved stone balustrade steps
    box(stone, 0, 0.22, 1.5, 28, 0.44, 26);
    A.steps(kit, 0, 11.4, 6.8, 2.0, 4, 0.24, 0.42, darkStone);

    // Front symbolic stone Tomb & Medical Heritage Stele Pavilion (Khu mộ Đại danh y)
    box(darkStone, -7.2, 0.52, 5.2, 6.4, 0.85, 6.4);
    box(0xc9c3b6, -7.2, 1.38, 5.2, 2.6, 1.05, 3.8);
    box(0x5b5850, -7.2, 2.25, 3.2, 1.55, 2.2, 0.36); // inscribed medical ethics stele
    // Medicinal herb pond & bridge on right forecourt
    box(stone, 7.4, 0.32, 5.2, 6.6, 0.52, 5.6);
    box(0x2f6c74, 7.4, 0.44, 5.2, 5.8, 0.28, 4.8);

    // Stately double-tier Memorial Temple dedicated to Hải Thượng Lãn Ông
    A.vietnameseHall(T, kit, {
      w: 16.4, d: 9.8, baseH: 1.15, colH: 3.6,
      wall: ochre, wood: crimson, tile, ridge: 0xd9cbb0, eave: gold,
      doubleTier: true, bays: 5,
      title: 'HẢI THƯỢNG LÃN ÔNG'
    });

    // Fragrant mountain pines of Minh Tự / Hương Sơn
    A.trees(T, kit, [
      { x: -12.2, z: -7.8, h: 11.0, kind: 'pine' },
      { x: 12.2, z: -7.8, h: 11.2, kind: 'pine' },
      { x: -12.4, z: 9.2, h: 9.6, kind: 'pine' },
      { x: 12.4, z: 9.2, h: 9.6, kind: 'pine' }
    ]);
  }

  // 8. Di tích Sân bay Tà Cơn — Khe Sanh (Quảng Trị) — Historic steel-matting runway, C-130 Hercules aircraft & UH-1 Huey display!
  function sanBayTaCon(T, kit) {
    const { box, stamp, round, tapered, outline } = kit;
    const runway = 0x5c5b55, redSoil = 0x8f4e34, olive = 0x5a634b, darkOlive = 0x414838, propDisc = 0x2f3335, museumCream = 0xe8e1cf, roofRed = 0x983b2c;

    // Khe Sanh red basalt earth & iconic perforated steel-planking airfield apron (ghi sắt Tà Cơn)
    box(redSoil, 0, 0.10, 0, 42, 0.20, 32);
    box(runway, -2.0, 0.24, 2.5, 34, 0.16, 18);
    // White runway threshold stripes
    for (const sz of [-2.5, 0.5, 3.5, 6.5]) {
      box(0xdcd9ce, -16.8, 0.34, sz, 3.2, 0.06, 0.65);
    }

    // === FULL-SCALE C-130 HERCULES TRANSPORT AIRCRAFT (Iconic centerpiece of Tà Cơn!) ===
    const ax = -4.2, az = 3.2;
    // Cylindrical fuselage oriented along local X (nose at +X)
    stamp(round, olive, ax, 2.65, az, 1.68, 17.5, 1.68, 0, 0, Math.PI / 2);
    // Rounded nose cone & dark cockpit windshield
    const nose = new T.SphereGeometry(1.64, 12, 10);
    stamp(nose, olive, ax + 8.6, 2.55, az, 1.65, 0.95, 0.96);
    nose.dispose();
    box(0x202b33, ax + 8.3, 3.25, az, 1.45, 0.72, 2.15);
    // Rear upswept tail ramp cone
    tapered(olive, ax - 10.6, 3.15, az, 1.64, 0.62, 5.4, 1, 12, 0, 0, Math.PI / 2 + 0.14);
    // High straight-tapered cargo wings (22m wingspan!)
    box(olive, ax + 1.2, 4.18, az, 3.4, 0.42, 22.8);
    box(darkOlive, ax + 0.4, 4.16, az, 2.2, 0.34, 23.4);
    // 4 turboprop engine nacelles + 4-blade propellers under wings
    for (const wz of [-7.4, -3.8, 3.8, 7.4]) {
      stamp(round, darkOlive, ax + 2.4, 3.65, az + wz, 0.52, 2.8, 0.52, 0, 0, Math.PI / 2);
      stamp(round, propDisc, ax + 3.92, 3.65, az + wz, 0.14, 2.95, 0.14);
      stamp(round, propDisc, ax + 3.92, 3.65, az + wz, 0.14, 0.14, 2.95);
    }
    // Iconic towering vertical tail fin + horizontal stabilizers
    outline([[0, 0], [-2.4, 5.4], [-4.2, 5.4], [-3.4, 0]], olive, ax - 8.8, 3.6, az - 0.22, 0.44);
    box(darkOlive, ax - 11.4, 3.85, az, 1.9, 0.26, 8.6);
    // Landing gear struts & tires
    for (const [gx, gz] of [[7.4, 0], [0.6, -1.7], [0.6, 1.7], [-0.8, -1.7], [-0.8, 1.7]]) {
      stamp(round, 0x222426, ax + gx, 0.72, az + gz, 0.55, 0.42, 0.55, 0, Math.PI / 2);
      stamp(round, 0x7d8388, ax + gx, 1.4, az + gz, 0.12, 1.1, 0.12);
    }

    // === PARKED UH-1 HUEY HELICOPTER ON RIGHT APRON ===
    const hx = 10.6, hz = 5.4;
    box(darkOlive, hx, 1.75, hz, 4.6, 1.55, 1.85);
    box(0x21323b, hx + 1.65, 1.85, hz, 1.35, 1.15, 1.68); // helicopter cockpit glass
    box(olive, hx - 4.4, 2.15, hz, 4.8, 0.48, 0.48); // tail boom
    box(darkOlive, hx - 6.6, 2.85, hz, 0.65, 1.65, 0.18); // tail fin
    stamp(round, 0x2a2d30, hx, 2.95, hz, 0.14, 0.95, 0.14); // rotor mast
    box(0x282b2e, hx, 3.38, hz, 8.6, 0.08, 0.34, 0.45); // main rotor blades
    for (const sz of [-0.95, 0.95]) box(0x3a3e42, hx, 0.45, hz + sz, 4.2, 0.12, 0.12); // landing skids

    // Historic Tà Cơn Museum Pavilion & Control Tower behind runway
    box(museumCream, 1.5, 2.9, -10.8, 18.6, 5.4, 7.6);
    A.gabledRoof(T, kit, 1.5, 5.65, -10.8, 19.4, 8.2, 1.85, roofRed, 0xd8cdb6, { alongX: true, overhang: 0.45 });
    box(0xb5aea0, 12.6, 4.6, -10.4, 4.2, 8.8, 4.2); // airfield watchtower
    box(0x223b4a, 12.6, 7.8, -10.4, 4.4, 1.65, 4.4);
    A.plaque(T, kit, 'SÂN BAY TÀ CƠN - KHE SANH', 1.5, 5.2, -6.9, 8.8, 1.02, { bg: '#6e2119', fg: '#f8e082' });
  }

  (window.VietnamSights ??= []).push(
    {
      id: 'bao-tang-tinh-thanh-hoa', name: 'Bảo tàng tỉnh Thanh Hóa', city: 'Thanh Hóa', province: 'Thanh Hóa', region: 'Trung Bộ',
      lon: 105.780387, lat: 19.815102, start: [105.780539,19.814101], yaw: 0,
      width: 119, depth: 38,
      boundary: [[-59,-19],[58,-19],[58,-5],[21,-5],[21,18],[-28,18],[-28,-2],[-59,-2]],
      solids: [[-3.75,-4.2,23.25,5.98],[-3.75,3.82,1.42,2.10],[-46.83,-11.10,11.3,7.15],[49.26,-12.05,7.9,5.2]],
      catalogId: 'osm-way-762771467',
      description: 'Bảo tàng tại 206 Trường Thi gồm ba tòa nhà xây từ thời Pháp thuộc. Hai vế thang dẫn lên cửa chính giữa mặt tiền vàng nhạt. Các dãy bên có hành lang vòm nhìn ra sân cây.',
      photo: 'https://visitthanhhoa.com/vi/bao-tang-thanh-hoa',
      source: 'https://csdl.vietnamtourism.gov.vn/vcgt/?item=177',
      map: 'https://www.openstreetmap.org/way/762771467',
      build: baoTangThanhHoa
    },
    {
      id: 'den-song-son', name: 'Đền Sòng Sơn', city: 'Bỉm Sơn', province: 'Thanh Hóa', region: 'Trung Bộ',
      lon: 105.870500, lat: 20.088500, start: [105.870860, 20.088735], yaw: 2.176,
      width: 28, depth: 26,
      solids: [[0, -4.2, 8.8, 5.4], ...A.archPiers(0, 10.6, 5.0, 1.54, 2.3)],
      description: 'Ngôi đền thờ Thánh Mẫu Liễu Hạnh danh tiếng ("Đền Sòng thiêng nhất xứ Thanh") tại Bỉm Sơn với cổng tam quan, dòng suối cá xanh trong vắt qua cầu đá và chính điện uy nghi.',
      photo: 'https://visitthanhhoa.com/',
      source: 'https://vi.wikipedia.org/wiki/%C4%90%E1%BB%81n_S%C3%B2ng_S%C6%A1n',
      map: 'https://www.openstreetmap.org/?mlat=20.0885&mlon=105.8705#map=17/20.0885/105.8705',
      build: denSongSon
    },
    {
      id: 'dan-te-nam-giao-tay-do', name: 'Đàn Tế Nam Giao Thành Nhà Hồ', city: 'Vĩnh Lộc', province: 'Thanh Hóa', region: 'Trung Bộ',
      lon:105.622368,lat:20.046259,start:[105.6218263,20.0455050],yaw:-.49,width:108,depth:168,
      solids:[[2.5,-64.6,9.55,9.32],[45,36.3,6.5,6.5]],
      description:'Từ chân núi Đốn Sơn, linh đạo dẫn qua các nền đàn lên Viên đàn. Phía đông nam còn Giếng Vua với khung đá vuông và lòng giếng tròn.',
      views:[
        {name:'Linh đạo dưới chân Đốn Sơn',viewAngle:-.19,viewRadius:155,viewElevation:.48,height:7},
        {name:'Viên đàn',offset:[32.62,-55.82],viewAngle:-.12,viewRadius:29,viewElevation:.49,height:3},
        {name:'Giếng Vua',offset:[22.62,53.24],viewAngle:-.75,viewRadius:16,viewElevation:.67,height:2.6}
      ],
      photo:'https://visitthanhhoa.com/vi/ve-xu-thanh-tham-quan-dan-nam-giao-nha-ho-6511',
      source:'https://thanhnhaho.vn/NewsDetail.aspx?Id=22105',
      map:'https://www.openstreetmap.org/?mlat=20.046259&mlon=105.622368#map=18/20.046259/105.622368',
      build: danTeNamGiaoTayDo
    },
    {
      id: 'nha-tho-chinh-toa-thanh-hoa', name: 'Nhà thờ Chính tòa Thanh Hóa', city: 'Thanh Hóa', province: 'Thanh Hóa', region: 'Trung Bộ',
      lon: 105.778850, lat: 19.814020, start: [105.778850, 19.813700], yaw: 0.0,
      width: 24, depth: 30,
      solids: [[0, 0, 7.6, 13.5]],
      description: 'Nhà thờ Chính tòa Giáo phận Thanh Hóa xây dựng năm 1926 theo phong cách Gothic – Roman với tháp chuông vươn cao, cửa sổ hoa hồng và sắc tường vàng đất ấm áp.',
      photo: 'https://vi.wikipedia.org/wiki/Nh%C3%A0_th%E1%BB%9D_ch%C3%ADnh_t%C3%B2a_Thanh_H%C3%B3a',
      source: 'https://vi.wikipedia.org/wiki/Nh%C3%A0_th%E1%BB%9D_ch%C3%ADnh_t%C3%B2a_Thanh_H%C3%B3a',
      map: 'https://www.openstreetmap.org/?mlat=19.81402&mlon=105.77885#map=18/19.81402/105.77885',
      build: nhaThoThanhHoa
    },
    {
      id: 'chua-cam-son', name: 'Chùa Cầm Sơn (Thiên Cầm)', city: 'Cẩm Xuyên', province: 'Hà Tĩnh', region: 'Trung Bộ',
      lon: 106.093750, lat: 18.277720, start: [106.093589, 18.277409], yaw: -0.458,
      width: 28, depth: 26,
      solids: [[0, -3.8, 8.4, 5.2], ...A.archPiers(0, 10.0, 4.8, 1.48, 2.2)],
      description: 'Chùa Cầm Sơn nằm trên núi Thiên Cầm, nhìn xuống bờ biển Cẩm Xuyên. Qua tam quan, lối đi dẫn lên chính điện.',
      photo: 'https://vietnamtourism.vn/index.php/news/items/24863',
      source: 'https://hatinh.gov.vn/vi/page/du-lich/diem-den/bien-thien-cam',
      map: 'https://www.openstreetmap.org/?mlat=18.27772&mlon=106.09375#map=18/18.27772/106.09375',
      build: chuaCamSon
    },
    {
      id: 'khu-tuong-niem-ha-huy-tap', name: 'Khu lưu niệm Tổng Bí thư Hà Huy Tập', city: 'Cẩm Xuyên', province: 'Hà Tĩnh', region: 'Trung Bộ',
      lon: 105.991420, lat: 18.228820, start: [105.991800, 18.228760], yaw: 1.42,
      width: 28, depth: 24,
      solids: [[-6.2, -1.8, 5.6, 3.5], [6.4, -3.4, 5.8, 4.2]],
      description: 'Khu lưu niệm Tổng Bí thư Hà Huy Tập ở xã Cẩm Hưng có ngôi nhà tranh của gia đình và nhà tưởng niệm. Bức tượng bán thân bằng đồng đặt tại gian thờ giữa bên trong nhà tưởng niệm.',
      photo: 'https://baohatinh.vn/nguoi-dan-thanh-kinh-tuong-nho-tri-an-tong-bi-thu-ha-huy-tap-post309548.html',
      source: 'https://baohatinh.vn/nguoi-dan-thanh-kinh-tuong-nho-tri-an-tong-bi-thu-ha-huy-tap-post309548.html',
      map: 'https://www.openstreetmap.org/?mlat=18.22882&mlon=105.99142#map=17/18.22882/105.99142',
      build: khuTuongNiemHaHuyTap
    },
    {
      id: 'khu-luu-niem-hai-thuong-lan-ong', name: 'Khu di tích Hải Thượng Lãn Ông', city: 'Hương Sơn', province: 'Hà Tĩnh', region: 'Trung Bộ',
      lon: 105.435694, lat: 18.529432, start: [105.435680, 18.528840], yaw: -0.023,
      width: 28, depth: 26,
      solids: [[0, 0, 8.4, 5.2], [-7.2, 5.2, 3.2, 3.2], [7.4, 5.2, 3.3, 2.8]],
      description: 'Quần thể di tích mộ và nhà thờ Đại danh y – Danh nhân Văn hóa Thế giới UNESCO Hải Thượng Lãn Ông Lê Hữu Trác dưới chân núi Minh Tự, Hương Sơn.',
      photo: 'https://hatinh.gov.vn/',
      source: 'https://hatinh.gov.vn/',
      map: 'https://www.openstreetmap.org/?mlat=18.529432&mlon=105.435694#map=17/18.529432/105.435694',
      build: haiThuongLanOng
    },
    {
      id: 'san-bay-ta-con', name: 'Di tích Sân bay Tà Cơn (Khe Sanh)', city: 'Hướng Hóa', province: 'Quảng Trị', region: 'Trung Bộ',
      lon: 106.724050, lat: 16.653550, start: [106.723920, 16.653070], yaw: -0.255,
      width: 42, depth: 32,
      solids: [[-4.2, 3.2, 10.5, 11.4], [10.6, 5.4, 4.4, 2.2], [1.5, -10.8, 9.4, 4.0], [12.6, -10.4, 2.2, 2.2]],
      description: 'Di tích Quốc gia đặc biệt Đường 9 – Khe Sanh với đường băng ghi sắt, nhà bảo tàng – đài kiểm soát, máy bay vận tải quân sự C-130 Hercules bốn động cơ và trực thăng UH-1.',
      photo: 'https://vi.wikipedia.org/wiki/S%C3%A2n_bay_T%C3%A0_C%C6%A1n',
      source: 'https://vi.wikipedia.org/wiki/S%C3%A2n_bay_T%C3%A0_C%C6%A1n',
      map: 'https://www.openstreetmap.org/?mlat=16.65355&mlon=106.72405#map=17/16.65355/106.72405',
      build: sanBayTaCon
    }
  );
})();

export default window.VietnamSights;
