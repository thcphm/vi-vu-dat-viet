'use strict';
(() => {
  const A = window.CentralArch;

  // 1. Nhà hát Trưng Vương (Đà Nẵng) — Classic grand municipal theater with tall fluted portico & sweeping marquee
  function nhaHatTrungVuong(T, kit) {
    const { box, stamp, round } = kit;
    const cream = 0xf2ece0, trim = 0xd8cdb8, cobalt = 0x26547c, glass = 0x243e52, roof = 0x5c6872, gold = 0xdcb452;
    kit.palette({plaster: cream, glass});

    // Stepped granite theater forecourt
    box(0x9e9a92, 0, 0.16, 0.5, 34, 0.32, 24);
    A.steps(kit, 0, 9.6, 18.0, 2.2, 4, 0.22, 0.42, 0x8f8a82);

    // Rear fly-tower (hộp sân khấu) rising behind auditorium
    box(cream, 0, 8.6, -5.8, 18.6, 16.4, 8.6);
    box(trim, 0, 16.9, -5.8, 19.2, 0.45, 9.2);
    // Main auditorium volume
    box(cream, 0, 6.4, 0.8, 28.4, 12.2, 12.6);
    box(roof, 0, 12.75, 0.8, 29.0, 0.55, 13.2);
    // Cobalt glazed lobby recessed behind portico
    box(glass, 0, 5.8, 6.8, 20.6, 10.6, 0.65);

    // Tall monumental portico colonnade across the front
    for (let i = -4; i <= 4; i++) {
      const cx = i * 2.55;
      stamp(round, cream, cx, 6.1, 8.6, 0.42, 11.4, 0.42);
      box(trim, cx, 0.95, 8.6, 1.05, 0.45, 1.05);
      box(trim, cx, 11.85, 8.6, 1.08, 0.42, 1.08);
    }
    // Deep entablature frieze & cantilevered blue-accented arrival canopy
    box(cream, 0, 12.85, 8.2, 24.4, 1.85, 2.6);
    box(cobalt, 0, 12.85, 9.54, 22.8, 0.48, 0.16);
    box(cream, 0, 4.65, 9.8, 16.2, 0.52, 3.6);
    box(cobalt, 0, 4.72, 11.62, 16.4, 0.32, 0.18);

    // Golden-framed theater title signage
    A.plaque(T, kit, 'NHÀ HÁT TRƯNG VƯƠNG', 0, 12.85, 9.64, 9.4, 1.15, { bg: '#1e486e', fg: '#f8e28c' });
    // Sculptural decorative facade medallions on wings
    for (const s of [-1, 1]) {
      box(trim, s * 12.4, 6.4, 7.18, 2.8, 9.4, 0.24);
      stamp(round, gold, s * 12.4, 7.6, 7.36, 0.85, 0.14, 0.85, 0, Math.PI / 2);
    }

    A.trees(T, kit, [
      { x: -15.2, z: 8.4, h: 7.4, kind: 'banyan' },
      { x: 15.2, z: 8.4, h: 7.4, kind: 'banyan' }
    ]);
  }

  // 2. Bảo tàng Đà Nẵng (42 Bạch Đằng — 1898 French Tòa Đốc lý) — Grand yellow Beaux-Arts colonial mansion
  function baoTangDaNang(T, kit) {
    const { box, stamp, round, outline } = kit;
    const ochre = 0xe8d08e, cream = 0xf4eee0, shutter = 0x274c3b, roof = 0x9c422f, stone = 0xa7a194;
    kit.palette({plaster: [ochre, cream], timber: shutter, stone});

    // Terraced waterfront garden court
    box(stone, 0, 0.18, 0, 34, 0.36, 22);
    box(0x4b7440, -11.5, 0.38, 7.2, 8.6, 0.14, 5.2);
    box(0x4b7440, 11.5, 0.38, 7.2, 8.6, 0.14, 5.2);

    // Sweeping grand twin ceremonial stairs rising to piano nobile
    A.steps(kit, 0, 7.8, 8.6, 2.2, 5, 0.24, 0.42, 0xbab3a6);
    box(cream, 0, 0.65, 5.6, 10.6, 1.25, 2.8);

    // 2-story symmetrical Beaux-Arts building body with projecting end pavilions
    box(ochre, 0, 5.4, -1.6, 28.4, 9.6, 11.8);
    for (const s of [-1, 1]) {
      box(ochre, s * 11.8, 5.6, -0.4, 6.8, 10.0, 13.6);
      // Fill front & rear gable triangles cleanly beneath wing roofs
      outline([[-3.4, 0], [0, 2.3], [3.4, 0]], ochre, s * 11.8, 10.6, 5.6, 0.8);
      outline([[-3.4, 0], [0, 2.3], [3.4, 0]], ochre, s * 11.8, 10.6, -7.2, 0.8);
      // Steep French mansard pavilion roofs over wings
      A.gabledRoof(T, kit, s * 11.8, 10.65, -0.4, 7.2, 14.0, 2.45, roof, cream, { overhang: 0.35 });
    }
    A.gabledRoof(T, kit, 0, 10.25, -1.6, 21.0, 12.2, 2.15, roof, cream, { alongX: true, overhang: 0.35 });

    // Classical white horizontal cornices, parapet balustrade & arched colonnade
    for (const y of [1.25, 5.45, 10.25]) {
      box(cream, 0, y, -1.2, 29.8, 0.32, 13.8);
    }
    // Arched loggia bays & green louvered colonial shutters
    for (let i = -5; i <= 5; i++) {
      const x = i * 2.55;
      const zFace = Math.abs(i) >= 4 ? 6.42 : 4.34;
      for (const wy of [3.2, 7.65]) {
        box(0x28343b, x, wy, zFace, 1.28, 2.45, 0.14);
        for (const sf of [-1, 1]) box(shutter, x + sf * 0.78, wy, zFace + 0.06, 0.32, 2.38, 0.08);
        box(cream, x, wy + 1.32, zFace + 0.08, 1.72, 0.20, 0.16);
      }
      box(cream, x + 1.27, 5.4, zFace + 0.06, 0.24, 9.2, 0.22);
    }

    // Central projecting entrance portico with triangular French pediment & clock
    box(ochre, 0, 5.8, 4.9, 8.8, 10.4, 2.4);
    for (const sx of [-3.6, -1.2, 1.2, 3.6]) {
      stamp(round, cream, sx, 5.6, 6.1, 0.26, 9.0, 0.26);
    }
    outline([[-4.8, 0], [0, 2.45], [4.8, 0]], cream, 0, 10.85, 5.1, 1.5);
    outline([[-5.1, -0.06], [0, 2.68], [5.1, -0.06], [4.7, -0.32], [0, 2.26], [-4.7, -0.32]], roof, 0, 10.9, 5.0, 1.7);
    stamp(round, 0xf8f5eb, 0, 11.95, 6.65, 0.72, 0.14, 0.72, 0, Math.PI / 2);

    A.plaque(T, kit, 'BẢO TÀNG ĐÀ NẴNG', 0, 5.55, 6.52, 5.8, 0.85, { bg: '#6e2820', fg: '#f8e084' });
    A.trees(T, kit, [
      { x: -13.8, z: 7.4, h: 7.2, kind: 'banyan' },
      { x: 13.8, z: 7.4, h: 7.2, kind: 'banyan' }
    ]);
  }

  // 3. Tượng Cá Chép Hóa Rồng & Cầu Tình Yêu (Sông Hàn, Đà Nẵng) — White marble Carp-Dragon sculpture + red-heart lantern pier
  // OSM pier 1243663176, east/south metres from the fountain (node 5272119221).
  const lovePier=[[18.7,3.6],[9.2,1.9],[6.3,4.5],[3.2,6],[-1.4,5.8],[-3.7,4.2],[-4.2,0],[-2.3,-3.5],
    [-2.8,-8.2],[-18.2,-27.8],[-26.6,-43.1],[-31.7,-56.5],[-36.1,-73.2],[-33.5,-76.5],[-29.3,-74.9],
    [-25.6,-58.5],[-21.1,-45.9],[-13,-31.1],[-2.9,-18],[15.3,-19.1],[18,-15.2],[23.5,-12.8],[25.1,-4]];
  function caChepHoaRong(T, kit) {
    const {box,stamp,round,tapered,outline}=kit;
    const marble=0xf2f0eb,marbleShade=0xd9d6ce,granite=0x96918a,metal=0x41443f,red=0xc73333;
    kit.palette({stone:[marble,marbleShade,granite],metal});
    const shape=new T.Shape(lovePier.map(([x,z])=>new T.Vector2(x,-z)));
    const slab=new T.ExtrudeGeometry(shape,{depth:.62,bevelEnabled:false});slab.rotateX(-Math.PI/2);
    kit.groundStamp(slab,granite,0,-.12,0);slab.dispose();
    const heart=new T.Shape();
    heart.moveTo(0,-.42);heart.bezierCurveTo(-.20,-.13,-.64,.08,-.44,.37);
    heart.bezierCurveTo(-.28,.61,-.07,.45,0,.30);heart.bezierCurveTo(.07,.45,.28,.61,.44,.37);
    heart.bezierCurveTo(.64,.08,.2,-.13,0,-.42);
    const lantern=new T.ExtrudeGeometry(heart,{depth:.15,bevelEnabled:false,curveSegments:5});
    for(let i=0;i<lovePier.length;i++){
      if(i>=20)continue; // Open connection to the eastern promenade.
      const [x,z]=lovePier[i],[xx,zz]=lovePier[i+1],dx=xx-x,dz=zz-z,length=Math.hypot(dx,dz);
      const yaw=Math.atan2(dx,dz),bays=Math.ceil(length/2.1);
      for(const y of [.72,1.05,1.48])box(metal,x+dx*.5,y,z+dz*.5,.055,.08,length,yaw);
      for(let j=0;j<bays;j++){
        const px=x+dx*j/bays,pz=z+dz*j/bays;
        stamp(round,metal,px,.99,pz,.065,1.04,.065);
      }
      if(i>=8&&i<=17){
        stamp(round,granite,x,-2.8,z,.37,6.1,.37);
        if(length>10){
          stamp(round,metal,x,2.08,z,.085,3.18,.085);
          for(const side of [-1,1])stamp(lantern,red,x+side*.42,3.75,z,.88,.88,1);
        }
      }
    }
    lantern.dispose();
    kit.place(0,0,-1.50,()=>{
      const cx=0,cz=0;
      stamp(round, 0x6f767c, cx, 0.72, cz, 4.4, 0.85, 4.4);
      stamp(round, marbleShade, cx, 1.48, cz, 3.5, 0.72, 3.5);
      // Stylized sculpted sea waves cradling the base
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        const wBall = new T.SphereGeometry(0.95, 10, 8);
        stamp(wBall, marble, cx + Math.sin(a) * 2.2, 1.95, cz + Math.cos(a) * 2.2, 1.1, 0.75, 1.1);
        wBall.dispose();
      }

      // Soaring arched white marble body of the Carp transforming into a Dragon (7.5m tall!)
      const segs = [
        [0, 2.3, 0.2, 1.55], [-0.2, 3.3, -0.5, 1.42], [-0.3, 4.4, -0.9, 1.28],
        [-0.2, 5.6, -0.7, 1.15], [0.0, 6.7, -0.2, 1.05], [0.1, 7.6, 0.5, 0.98]
      ];
      for (const [ox, y, oz, r] of segs) {
        const sp = new T.SphereGeometry(r, 12, 10);
        stamp(sp, marble, cx + ox, y, cz + oz, 0.92, 1.05, 1.12);
        sp.dispose();
      }
      // Sweeping carved side pectoral fins & majestic uplifted carp tail fin
      for (const s of [-1, 1]) {
        outline([[0, 0], [1.4, 0.4], [2.2, -0.8], [0.9, -1.3], [0, -0.7]], marbleShade, cx + s * 0.9, 4.8, cz - 0.5, 0.28, s > 0 ? 0 : Math.PI);
      }
      outline([[0, 0], [-1.9, 1.4], [-2.5, 3.2], [-0.8, 2.2], [0, 0.9]], marble, cx - 0.1, 2.6, cz - 1.2, 0.34, Math.PI / 2);
      // Dragon head crest, horns & arched blue-white water jet spraying toward the river
      box(marble, cx + 0.1, 8.15, cz + 1.25, 1.25, 1.05, 1.65);
      for (const s of [-1, 1]) {
        tapered(marbleShade, cx + 0.1 + s * 0.55, 9.05, cz + 0.55, 0.18, 0.05, 1.35, 1, 6);
      }
      // Curved sparkling water jet arc from mouth into river basin
      for (let k = 0; k < 10; k++) {
        const t = k / 9;
        const jy = 8.1 + Math.sin(t * Math.PI * 0.85) * 1.4 - t * t * 6.8;
        const jz = cz + 2.0 + t * 6.6;
        const drop = new T.SphereGeometry(0.18 + t * 0.14, 8, 6);
        stamp(drop, 0xc7edf7, cx + 0.1, Math.max(0.35, jy), jz);
        drop.dispose();
      }

      A.plaque(T, kit, 'CÁ CHÉP HÓA RỒNG', cx, 1.25, cz + 3.65, 4.8, 0.72, { bg: '#1e5070', fg: '#f8e69a' });
    });
  }

  // 4. Cung Thể thao Tiên Sơn (Đà Nẵng) — Iconic "Đĩa Bay" futuristic flying-saucer indoor arena
  function cungTheThaoTienSon(T, kit) {
    const { box, stamp, round, tapered } = kit;
    const silver = 0xdce1e6, steel = 0x7b8996, cobalt = 0x204d70, concrete = 0xb9b6ae, white = 0xf0f2f4;
    kit.palette({metal: steel, plaster: concrete});

    // Vast tiered circular granite plaza
    stamp(round, concrete, 0, 0.25, 0, 26.5, 0.5, 26.5);
    stamp(round, 0xa8a69e, 0, 0.75, 0, 22.8, 0.65, 22.8);
    A.steps(kit, 0, 23.2, 12.0, 2.2, 4, 0.25, 0.45, 0x999790);

    // Recessed circular blue-glass arena bowl base
    stamp(round, cobalt, 0, 3.9, 0, 17.4, 5.8, 17.4);
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      // Iconic inclined exterior steel-concrete V-struts cradling the saucer rim
      const rBot = 16.5, rTop = 21.8;
      A.strut(T, kit, white, Math.sin(a) * rBot, 1.1, Math.cos(a) * rBot, Math.sin(a + 0.14) * rTop, 7.6, Math.cos(a + 0.14) * rTop, 0.34);
      A.strut(T, kit, white, Math.sin(a) * rBot, 1.1, Math.cos(a) * rBot, Math.sin(a - 0.14) * rTop, 7.6, Math.cos(a - 0.14) * rTop, 0.34);
    }

    // Iconic wide overhanging elliptic Flying-Saucer ("Đĩa bay") roof shell
    tapered(steel, 0, 7.4, 0, 17.6, 23.6, 2.2, 0.84, 24);
    tapered(silver, 0, 10.6, 0, 23.6, 13.8, 4.4, 0.84, 24);
    tapered(white, 0, 13.6, 0, 13.8, 5.2, 1.85, 0.84, 24);
    // Concentric metallic roof ribs & crown skylight ring
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      A.strut(T, kit, steel, Math.sin(a) * 23.4, 8.6, Math.cos(a) * 19.6, Math.sin(a) * 5.2, 14.5, Math.cos(a) * 4.4, 0.22);
    }
    stamp(round, cobalt, 0, 14.65, 0, 4.9, 0.45, 4.1);

    A.plaque(T, kit, 'CUNG THỂ THAO TIÊN SƠN', 0, 4.6, 18.2, 9.6, 1.15, { bg: '#1b476b', fg: '#f6e288' });
  }

  // 5. Hội quán Quảng Đông (176 Trần Phú, Hội An) — Ornate turquoise-mosaic Tam Quan & coiled ceramic dragon fountain
  function hoiQuanQuangDong(T, kit) {
    const { box, stamp, round } = kit;
    const yellow = 0xdfb85a, turquoise = 0x2f7d7a, tile = 0x8a3a29, crimson = 0x86241b, stone = 0x9c9586, gold = 0xdfb147;
    kit.palette({tile, stone});

    // Flagstone Hoi An heritage courtyard
    box(0xa59a86, 0, 0.14, 0, 17.5, 0.28, 19.5);

    // Signature Cantonese porcelain-mosaic Tam Quan entrance gate
    const gz = 7.4;
    A.vaultedBay(T, kit, 0, gz, 4.4, 4.2, 1.32, 2.05, 1.9, yellow, turquoise, 0x4f3d2b);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 3.8, gz, 3.2, 3.1, 0.86, 1.55, 1.5, yellow, turquoise, 0x4f3d2b);
      A.curvedRoof(T, kit, s * 3.8, 3.15, gz, 3.9, 2.3, 0.78, turquoise, 0xdcd4bc, gold, 0.26);
    }
    A.curvedRoof(T, kit, 0, 4.25, gz, 5.4, 2.8, 0.92, turquoise, 0xdcd4bc, gold, 0.28, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'QUẢNG ĐÔNG HỘI QUÁN', 0, 3.72, gz + 1.02, 3.8, 0.58, { bg: '#7d2018', fg: '#f6d874' });

    // Famous courtyard coiled ceramic Dragon Fountain (Đài phun nước Rồng gốm sứ)
    stamp(round, stone, 0, 0.35, 1.8, 2.4, 0.45, 2.4);
    stamp(round, 0x2e6f75, 0, 0.48, 1.8, 2.05, 0.22, 2.05);
    for (let k = 0; k < 10; k++) {
      const a = k * 0.75, y = 0.75 + k * 0.26, r = 0.85 - k * 0.04;
      const seg = new T.SphereGeometry(0.28, 8, 8);
      stamp(seg, k % 2 ? turquoise : gold, Math.sin(a) * r, y, 1.8 + Math.cos(a) * r);
      seg.dispose();
    }

    // Rear main worship hall (Tiền Đường – Hậu Điện) with red pillars & yellow Hoi An walls
    const hz = -4.6;
    box(stone, 0, 0.45, hz, 14.2, 0.9, 8.2);
    box(yellow, 0, 2.65, hz - 0.3, 12.6, 3.6, 6.4);
    for (let i = -3; i <= 3; i++) {
      stamp(round, crimson, i * 1.9, 2.65, hz + 3.2, 0.16, 3.5, 0.16);
    }
    A.curvedRoof(T, kit, 0, 4.5, hz, 14.8, 8.6, 1.65, tile, 0xd8cab0, gold, 0.30, { dragons: true, goldColor: gold });
    // Warm red silk lanterns hanging across the veranda
    for (const lx of [-4.2, -1.4, 1.4, 4.2]) {
      const orb = new T.SphereGeometry(0.28, 8, 8);
      stamp(orb, 0xd93829, lx, 3.65, hz + 3.55);
      orb.dispose();
    }
  }

  // 6. Nhà cổ Tấn Ký (101 Nguyễn Thái Học, Hội An) — 200-year-old heritage wooden tube house with silk lanterns
  function nhaCoTanKy(T, kit) {
    const { box, stamp, round } = kit;
    const ochre = 0xdba94c, timber = 0x4b2e1e, darkWood = 0x362014, mossTile = 0x714734, stone = 0xa29884;
    kit.palette({plaster: ochre, timber: [timber, darkWood], tile: mossTile, stone});

    // Flagstone street veranda
    box(stone, 0, 0.12, 0, 12.6, 0.24, 18.6);

    // Classic 2-story Hoi An tube house stepping deeper into two yin-yang tiled pavilions
    // Front 2-story timber shophouse volume
    box(ochre, 0, 3.4, 3.6, 9.4, 6.5, 7.6);
    box(timber, 0, 1.85, 7.42, 8.2, 3.4, 0.22); // dark timber ground shutters (cửa thượng song hạ bản)
    for (let i = -3; i <= 3; i++) {
      box(darkWood, i * 1.18, 1.85, 7.56, 0.18, 3.4, 0.14);
    }
    // Projecting wooden 2nd-floor veranda balcony + carved louvers
    box(timber, 0, 3.72, 8.05, 8.8, 0.24, 1.25);
    box(darkWood, 0, 4.35, 8.62, 8.8, 0.92, 0.12);
    for (const wx of [-2.4, 0, 2.4]) {
      box(0x2d1a10, wx, 5.15, 7.45, 1.45, 1.65, 0.14);
      box(timber, wx, 5.15, 7.54, 0.12, 1.65, 0.10);
    }
    // Stepped yin-yang moss-tile front gable roof + lower awning eave
    A.gabledRoof(T, kit, 0, 6.65, 3.6, 9.8, 8.2, 2.25, mossTile, 0xb8a68a, { alongX: true, overhang: 0.55 });
    box(mossTile, 0, 3.35, 8.45, 9.6, 0.22, 2.1, 0, 0.34);

    // Rear taller ancestral hall behind interior skywell (giếng trời)
    box(ochre, 0, 4.1, -4.6, 9.4, 7.8, 7.4);
    A.gabledRoof(T, kit, 0, 8.0, -4.6, 9.8, 8.0, 2.35, mossTile, 0xb8a68a, { alongX: true, overhang: 0.5 });
    // Flanking curved Hoi An fire-gables (tường hồi đầu hồi)
    for (const s of [-1, 1]) {
      box(ochre, s * 4.82, 4.2, 0, 0.32, 8.2, 16.4);
    }

    // Hanging red & golden Hoi An silk lanterns + wooden heritage signboard
    for (const [lx, col] of [[-3.4, 0xd83226], [-1.7, 0xe8b236], [1.7, 0xe8b236], [3.4, 0xd83226]]) {
      const lan = new T.SphereGeometry(0.28, 8, 8);
      stamp(lan, col, lx, 2.85, 8.75, 0.9, 1.25, 0.9);
      lan.dispose();
    }
    A.plaque(T, kit, 'NHÀ CỔ TẤN KÝ', 0, 3.92, 8.72, 4.2, 0.68, { bg: '#4e2618', fg: '#f6d878' });
  }

  // Monument to the Vietnamese Heroic Mothers, Tam Kỳ.
  function tuongDaiMeThu(T, kit) {
    const pale=0xbcb7ae,grey=0xa8a39b,dark=0x928e87;
    kit.palette({stone:[pale,grey,dark,0xd3cfc4,0xa8aaa4]});
    kit.box(0xd3cfc4,0,.04,14,92,.20,83);
    const disk=new T.CylinderGeometry(1,1,1,80);
    kit.stamp(disk,0x9c9f98,0,.17,15.7,24,.18,17.05);
    kit.stamp(disk,0x697c70,0,.27,15.7,23.5,.09,16.63);
    kit.stamp(disk,0xaaa99f,0,.32,15.7,22.7,.13,15.82);
    kit.stamp(disk,0x586b60,0,.392,15.7,22.2,.026,15.14);
    disk.dispose();

    // 84.7 m across; the arms follow a 117 m arc. The elevation and successive
    // changes of plane follow the front and oblique photographs from Tam Kỳ.
    const strips=[],surfaces=[[],[],[]],sections=42;
    for(let i=0;i<=sections;i++){
      const u=2*i/sections-1,a=u*1.34,x=42.35*Math.sin(a)/Math.sin(1.34);
      const t=Math.abs(u),z=-2.2+43.5*(1-Math.cos(a)),thickness=24.3-16.3*t;
      const shoulder=12.18-6.92*t+.48*Math.sin(i*1.85)*Math.min(t*4,1);
      const stagger=.38*Math.sin(i*2.33),jag=.44*Math.cos(i*1.73);
      strips.push([
        [x,.15,z],[x,shoulder*.34,z-.63],[x+stagger,shoulder*.53,z-.15+jag],
        [x-stagger,shoulder*.73,z-1.5-jag],[x,shoulder*.88,z-1.12+jag],
        [x,shoulder,z-2.5],[x,shoulder*.88,z-thickness*.68],[x,.15,z-thickness]
      ]);
    }
    for(let i=0;i<sections;i++){
      for(let j=0;j<strips[i].length-1;j++){
        const a=strips[i][j],b=strips[i+1][j],c=strips[i+1][j+1],d=strips[i][j+1];
        const shade=j===0?0:(i*3+j*2+Math.floor(i/3))%7<2?1:0;
        surfaces[shade].push(...a,...b,...d,...b,...c,...d);
      }
    }
    for(const i of [0,sections]){
      const end=strips[i];
      for(let j=1;j<end.length-1;j++)surfaces[2].push(...end[0],...end[j],...end[j+1]);
    }
    for(const [i,coords] of surfaces.entries()){
      const geo=new T.BufferGeometry();
      geo.setAttribute('position',new T.Float32BufferAttribute(coords,3));geo.computeVertexNormals();
      const mesh=new T.Mesh(geo,new T.MeshStandardMaterial({color:[pale,grey,dark][i],side:T.DoubleSide,roughness:.97}));
      mesh.castShadow=mesh.receiveShadow=true;kit.group.add(mesh);
    }

    // The hair sweeps from a side part down behind the jaw into the granite.
    // Keep the broad facial plane continuous in the absence of a measured portrait.
    const bust=A.carving(T,kit,pale,0,0,-2.25,18.37/18.73);
    bust.sweep([[0,3.4,-2.8,5.4,2.6],[0,5.4,-2.55,6.1,3.08],[0,8.2,-2.39,6.38,3.46],
      [-.08,10.2,-2.65,5.38,3.05],[-.10,11.45,-2.72,4.2,2.64],[.04,12.27,-2.15,2.28,1.74],
      [.10,13.55,-1.73,1.51,1.41]],.045,32);
    bust.sweep([[.10,12.63,-1.20,.99,.94],[.17,13.05,-.47,1.36,1.00],
      [.19,13.43,-.32,1.72,1.22],[.17,14.04,-.42,2.17,1.47],[.12,14.77,-.57,2.34,1.58],
      [.04,15.63,-.63,2.42,1.66],[-.02,16.28,-.75,2.39,1.61],[-.09,17.0,-.94,2.22,1.50],
      [-.17,17.57,-1.12,1.91,1.32],[-.25,18.02,-1.19,1.36,1.05],[-.29,18.25,-1.32,.64,.60]],0,32);
    for(const s of [-1,1]){
      bust.sweep([[s*.32,18.15,-1.22,.61,.64],[s*1.34,17.79,-1.35,.82,.75],
        [s*2.01,17.1,-1.49,.78,.83],[s*2.42,15.99,-1.59,.73,.82],[s*2.70,15.14,-1.90,.65,.79],
        [s*2.76,14.12,-2.41,.64,.94],[s*3.05,12.89,-2.89,.87,1.12],[s*3.42,11.66,-3.52,1.05,1.28]],.065,20);
      bust.sweep([[s*1.10,17.85,-1.25,.37,.52],[s*1.82,17.14,-1.07,.34,.44],
        [s*2.28,16.21,-1.17,.35,.45],[s*2.44,15.62,-1.37,.24,.40]],.035,18);
      bust.sweep([[s*2.51,15.28,-1.30,.29,.42],[s*2.68,14.35,-1.66,.29,.42],
        [s*2.73,13.44,-2.29,.36,.66],[s*3.03,12.56,-2.87,.42,.75]],.04,20);
      bust.sweep([[s*1.55,12.26,-.39,.27,.35],[s*2.68,11.11,-.06,.41,.47],
        [s*1.96,10.47,.52,.44,.42],[s*.64,9.78,.62,.38,.32]],.045,16);
    }
    bust.finish();
    for(const s of [-1,1])for(let i=0;i<4;i++){
      const x=s*(21+i*3.30),z=49-i*2.48;
      kit.box(grey,x,.46,z,2.0,.62,2.15);
      kit.tapered(pale,x,4.75,z,.88,.70,8.18,.94,8);
    }
  }

  // 8. Bảo tàng Mỹ thuật Đà Nẵng (78 Lê Duẩn) — Neoclassical cream gallery mansion with pedimented portico
  function baoTangMyThuatDaNang(T, kit) {
    const { box, stamp, round, outline } = kit;
    const cream = 0xf0eadb, warm = 0xdacbb0, terra = 0x9b4634, glass = 0x2c475a, stone = 0x9c968b;
    kit.palette({plaster: cream, glass, stone});

    box(stone, 0, 0.16, 0, 30, 0.32, 22);
    A.steps(kit, 0, 8.2, 11.0, 1.8, 3, 0.22, 0.38, 0x8d877d);

    // 3-story crisp museum gallery body
    box(cream, 0, 5.8, -1.2, 24.4, 11.2, 13.4);
    for (const y of [3.8, 7.6, 11.4]) {
      box(warm, 0, y, -1.2, 25.0, 0.34, 14.0);
    }
    A.gabledRoof(T, kit, 0, 11.55, -1.2, 24.8, 13.8, 2.1, terra, cream, { alongX: true, overhang: 0.45 });

    // Tall recessed gallery windows & pilasters
    for (let i = -4; i <= 4; i++) {
      if (Math.abs(i) <= 1) continue;
      const x = i * 2.65;
      for (const wy of [2.1, 5.7, 9.4]) {
        box(glass, x, wy, 5.56, 1.55, 2.35, 0.14);
        box(warm, x, wy + 1.28, 5.62, 1.82, 0.20, 0.16);
      }
      box(warm, x + 1.32, 5.8, 5.62, 0.26, 11.0, 0.24);
    }

    // Grand pedimented portico with 4 tall classical columns
    box(cream, 0, 5.8, 6.2, 8.8, 11.2, 2.2);
    for (const sx of [-3.6, -1.2, 1.2, 3.6]) {
      stamp(round, cream, sx, 5.8, 7.35, 0.30, 10.6, 0.30);
    }
    outline([[-5.2, 0], [0, 2.65], [5.2, 0]], cream, 0, 11.4, 6.2, 2.4);
    outline([[-5.5, -0.06], [0, 2.88], [5.5, -0.06], [5.1, -0.34], [0, 2.46], [-5.1, -0.34]], terra, 0, 11.45, 6.1, 2.6);

    // Modern bronze abstract art sculpture in front courtyard
    box(0x7c766e, -10.8, 0.65, 6.6, 2.4, 0.9, 2.4);
    const torus = new T.TorusGeometry(0.95, 0.22, 10, 16);
    stamp(torus, 0xb6863d, -10.8, 2.25, 6.6, 1, 1.25, 1, 0.4);
    torus.dispose();

    A.plaque(T, kit, 'BẢO TÀNG MỸ THUẬT ĐÀ NẴNG', 0, 4.45, 7.62, 7.6, 0.92, { bg: '#6c241b', fg: '#f8e28c' });
    A.trees(T, kit, [
      { x: 11.8, z: 7.4, h: 7.2, kind: 'banyan' },
      { x: -12.6, z: -6.8, h: 7.6, kind: 'banyan' }
    ]);
  }

  // 9. Cung An Định — Khải Tường Lâu (Huế) — Iconic 3-story Baroque-Indochine royal chateau + porcelain-mosaic gate
  function cungAnDinh(T, kit) {
    const { box, stamp, round, tapered } = kit;
    const ochre = 0xe5ca82, cream = 0xf4eddc, mosaicTeal = 0x2f757a, tile = 0x8e3d2b, glass = 0x263946, gold = 0xdba942, stone = 0x9e978b;
    kit.palette({plaster: [ochre, cream], tile, glass, stone});

    // Royal palace courtyard
    box(stone, 0, 0.16, 1.0, 32, 0.32, 28);

    // Ornate 3-bay porcelain-mosaic front palace gate (Cổng chính Cung An Định)
    const gz = 11.2;
    A.vaultedBay(T, kit, 0, gz, 4.6, 4.4, 1.38, 2.15, 1.8, ochre, mosaicTeal, 0x5c4835);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 3.9, gz, 3.2, 3.2, 0.88, 1.6, 1.5, ochre, mosaicTeal, 0x5c4835);
      A.curvedRoof(T, kit, s * 3.9, 3.25, gz, 3.8, 2.2, 0.8, mosaicTeal, cream, gold, 0.25);
    }
    A.curvedRoof(T, kit, 0, 4.45, gz, 5.6, 2.8, 0.95, mosaicTeal, cream, gold, 0.28, { dragons: true, goldColor: gold });

    // The forecourt pavilion formerly housed the emperor's bronze.
    const px = 0, pz = 5.4;
    stamp(round, stone, px, 0.45, pz, 2.8, 0.72, 2.8);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      stamp(round, ochre, px + Math.sin(a) * 2.1, 2.25, pz + Math.cos(a) * 2.1, 0.14, 3.0, 0.14);
    }
    tapered(tile, px, 4.55, pz, 3.2, 0.35, 1.85, 1, 8);

    // Grand 3-story Khải Tường Lâu Baroque-Huế palace behind the pavilion
    const kz = -5.6;
    box(stone, 0, 0.65, kz, 22.8, 1.3, 14.4);
    A.steps(kit, 0, kz + 7.6, 7.6, 1.6, 4, 0.32, 0.40, 0x8f887d);
    box(ochre, 0, 6.4, kz, 20.4, 10.6, 12.2);
    // Projecting front & side Baroque bays + classic white pilasters & cornice bands
    box(ochre, 0, 6.8, kz + 5.6, 8.6, 11.2, 2.4);
    for (const y of [1.4, 4.85, 8.35, 11.75]) {
      box(cream, 0, y, kz + 0.4, 21.4, 0.34, 13.6);
    }
    // Ornate roof balustrade parapet + French-imperial hipped roof & central crowning cupola
    for (let x = -9.6; x <= 9.6; x += 1.6) {
      box(cream, x, 12.35, kz + 6.4, 0.24, 0.95, 0.24);
    }
    box(cream, 0, 12.85, kz + 6.4, 20.6, 0.22, 0.32);
    A.gabledRoof(T, kit, 0, 11.95, kz, 20.2, 12.2, 2.4, tile, cream, { alongX: true, overhang: 0.4 });
    // Arched Baroque windows with teal-gold tympanums across all 3 levels
    for (let i = -3; i <= 3; i++) {
      const wx = i * 2.85;
      const fz = Math.abs(i) <= 1 ? kz + 6.86 : kz + 6.16;
      for (const wy of [3.15, 6.55, 9.95]) {
        box(glass, wx, wy, fz, 1.32, 2.25, 0.14);
        box(mosaicTeal, wx, wy + 1.24, fz + 0.05, 1.56, 0.26, 0.14);
      }
      box(cream, wx + 1.42, 6.5, fz + 0.04, 0.26, 10.2, 0.22);
    }
    // Ornate Baroque attic crest above central portico
    box(ochre, 0, 13.25, kz + 6.6, 6.4, 2.1, 0.72);
    stamp(round, mosaicTeal, 0, 13.35, kz + 7.02, 0.85, 0.14, 0.85, 0, Math.PI / 2);

    A.plaque(T, kit, 'CUNG AN ĐỊNH', 0, 4.92, kz + 7.04, 5.4, 0.78, { bg: '#6e211a', fg: '#f8dc7c' });
    A.trees(T, kit, [
      { x: -13.4, z: 3.2, h: 8.6, kind: 'banyan' },
      { x: 13.4, z: 3.2, h: 8.6, kind: 'banyan' }
    ]);
  }

  // 10. Lăng Gia Long (Thiên Thọ Lăng, Huế) — Solemn double stone tomb Bửu Thành, honor guard & royal pine hill
  function langGiaLong(T, kit) {
    const { box } = kit;
    const greyStone = 0x8f8c84, darkStone = 0x6f6c64, lime = 0xcfc8b8, tile = 0x7a4838, gold = 0xcfa44e;
    kit.palette({stone: [greyStone, darkStone], plaster: lime, tile});

    // Three solemn terraced stone esplanades climbing gently toward Thiên Thọ mountain
    box(greyStone, 0, 0.25, 4.5, 28, 0.5, 20);
    box(greyStone, 0, 0.85, -3.5, 25, 1.2, 10);
    box(greyStone, 0, 1.55, -9.8, 22, 2.1, 10);
    A.steps(kit, 0, 1.8, 6.2, 1.8, 4, 0.25, 0.42, darkStone);
    A.steps(kit, 0, -5.2, 5.8, 1.8, 4, 0.25, 0.42, darkStone);

    // Five mandarins per side at Thiên Thọ Lăng, facing across the paved court.
    for (const s of [-1, 1]) {
      for (let i=0;i<5;i++) {
        const z=3.5+i*1.58, x=s*5.2;
        box(0x827f74,x,.565,z,.86,.13,.83);
        A.courtAttendant(T,kit,0x827f74,x,.63,z,1.73,-s*Math.PI/2,i<2?'civil':'military');
      }
    }

    // Bi Đình stele pavilion on middle terrace
    box(lime, 0, 2.75, -3.5, 4.6, 2.8, 4.6);
    box(0x5d5952, 0, 2.65, -3.5, 1.35, 2.35, 0.36);
    A.curvedRoof(T, kit, 0, 4.2, -3.5, 6.2, 6.2, 1.65, tile, lime, gold, 0.22);

    // Signature Bửu Thành walled enclosure housing the twin stone tombs of Emperor Gia Long & Empress Thừa Thiên Cao
    const bz = -10.2;
    box(darkStone, 0, 3.65, bz - 4.2, 17.6, 2.4, 0.85);
    for (const s of [-1, 1]) {
      box(darkStone, s * 8.4, 3.65, bz, 0.85, 2.4, 8.8);
      box(darkStone, s * 5.2, 3.65, bz + 4.2, 6.4, 2.4, 0.85);
    }
    // Twin stone sarcophagi side-by-side (song táng Càn Khôn Hiệp Đức)
    for (const s of [-1, 1]) {
      box(lime, s * 2.4, 3.15, bz, 3.2, 1.15, 4.6);
      box(greyStone, s * 2.4, 3.92, bz, 2.6, 0.45, 4.0);
    }
    A.plaque(T, kit, 'THIÊN THỌ LĂNG - GIA LONG', 0, 1.1, 12.2, 6.4, 0.85, { bg: '#5a3a28', fg: '#f2d988' });

    // Dense ancient imperial Huế pines framing the tomb
    A.trees(T, kit, [
      { x: -13.2, z: -11.5, h: 12.0, kind: 'pine' },
      { x: -11.6, z: -4.2, h: 10.6, kind: 'pine' },
      { x: 11.6, z: -4.2, h: 10.8, kind: 'pine' },
      { x: 13.2, z: -11.5, h: 12.2, kind: 'pine' },
      { x: 0, z: -16.8, h: 13.0, kind: 'pine' }
    ]);
  }

  // 11. Lăng Đồng Khánh (Tư Lăng, Huế) — Golden glazed-tile Ngưng Hy Palace with French-Huế stained glass porch
  function langDongKhanh(T, kit) {
    const { box, stamp, round } = kit;
    const yellowGlaze = 0xc99628, ochre = 0xdec486, crimson = 0x7c231a, stone = 0x928c81, gold = 0xe4b844, glassBlue = 0x2e6488;
    kit.palette({glazedTile: yellowGlaze, plaster: ochre, stone, glass: glassBlue});

    // Terraced granite court & dragon balustrade steps
    box(0x9a9183, 0, 0.18, 1.2, 26, 0.36, 24);
    A.steps(kit, 0, 9.8, 6.4, 1.8, 4, 0.24, 0.4, stone);

    // Ornate French-influenced stucco courtyard Nghi Môn gate
    A.vaultedBay(T, kit, 0, 8.2, 4.8, 4.4, 1.45, 2.2, 1.9, ochre, 0xb89658, 0x5c4632);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 4.0, 8.2, 3.2, 3.2, 0.88, 1.6, 1.5, ochre, 0xb89658, 0x5c4632);
      A.curvedRoof(T, kit, s * 4.0, 3.25, 8.2, 3.9, 2.2, 0.8, yellowGlaze, 0xe4d5b2, gold, 0.26);
    }
    A.curvedRoof(T, kit, 0, 4.45, 8.2, 5.8, 2.8, 0.96, yellowGlaze, 0xe4d5b2, gold, 0.28, { dragons: true, goldColor: gold });

    // Ngưng Hy Palace with signature golden imperial glazed tiles & French polychrome arched windows
    const pz = -3.8;
    box(stone, 0, 0.65, pz, 17.6, 1.3, 10.6);
    A.steps(kit, 0, pz + 5.8, 5.8, 1.4, 4, 0.32, 0.38, 0x827d73);
    box(ochre, 0, 3.1, pz - 0.3, 14.8, 3.7, 8.0);
    for (let i = -3; i <= 3; i++) {
      stamp(round, crimson, i * 2.25, 3.1, pz + 4.1, 0.19, 3.7, 0.19);
      if (i < 3) {
        // Stained-glass French-Huế arched window panel
        box(glassBlue, (i + 0.5) * 2.25, 3.15, pz + 3.74, 1.35, 2.25, 0.12);
        box(gold, (i + 0.5) * 2.25, 4.25, pz + 3.78, 1.55, 0.22, 0.14);
      }
    }
    A.curvedRoof(T, kit, 0, 4.95, pz, 17.8, 10.8, 1.65, yellowGlaze, 0xe6d6b0, gold, 0.32);
    box(crimson, 0, 7.15, pz, 11.2, 1.65, 6.2);
    A.curvedRoof(T, kit, 0, 8.0, pz, 13.2, 8.2, 1.9, yellowGlaze, 0xe6d6b0, gold, 0.30, { dragons: true, goldColor: gold });

    A.plaque(T, kit, 'LĂNG ĐỒNG KHÁNH', 0, 3.9, 9.22, 4.4, 0.64, { bg: '#732018', fg: '#f8dc76' });
    A.trees(T, kit, [
      { x: -11.4, z: -6.8, h: 10.2, kind: 'pine' },
      { x: 11.4, z: -6.8, h: 10.4, kind: 'pine' },
      { x: -10.8, z: 6.2, h: 8.6, kind: 'pine' },
      { x: 10.8, z: 6.2, h: 8.6, kind: 'pine' }
    ]);
  }

  // 12. Chùa Diệu Đế Quốc Tự (Huế) — Royal National Pagoda with blue-glazed Tam Quan & twin hexagonal pavilions
  function chuaDieuDe(T, kit) {
    const { box, stamp, round, tapered } = kit;
    const ochre = 0xe3cb8e, blueGlaze = 0x2c6880, tile = 0x8a422f, gold = 0xd9a844, stone = 0x958f84, crimson = 0x7c251c;
    kit.palette({plaster: ochre, glazedTile: blueGlaze, tile, stone});

    box(0xa4967e, 0, 0.16, 1.0, 28, 0.32, 26);

    // Signature Quốc Tự Diệu Đế canal-front blue-glazed 3-bay Tam Quan gate
    const gz = 10.2;
    A.vaultedBay(T, kit, 0, gz, 5.2, 4.8, 1.58, 2.4, 2.4, ochre, blueGlaze, 0x4b4236);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 4.5, gz, 3.6, 3.5, 0.98, 1.75, 1.9, ochre, blueGlaze, 0x4b4236);
      A.curvedRoof(T, kit, s * 4.5, 3.55, gz, 4.4, 2.7, 0.85, blueGlaze, 0xd8d6ce, gold, 0.26);
    }
    A.curvedRoof(T, kit, 0, 4.85, gz, 6.4, 3.4, 1.0, blueGlaze, 0xd8d6ce, gold, 0.30);
    box(ochre, 0, 6.55, gz, 3.8, 1.55, 2.0);
    A.curvedRoof(T, kit, 0, 7.35, gz, 5.4, 3.0, 1.1, blueGlaze, 0xd8d6ce, gold, 0.28, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'DIỆU ĐẾ QUỐC TỰ', 0, 4.25, gz + 1.28, 4.4, 0.66, { bg: '#1e4e66', fg: '#f8de7c' });

    // Flanking hexagonal bell & imperial stele pavilions (Lầu Chuông – Nhà Bia)
    for (const s of [-1, 1]) {
      const bx = s * 8.6, bz = 2.6;
      stamp(round, stone, bx, 0.38, bz, 2.6, 0.56, 2.6);
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        stamp(round, crimson, bx + Math.sin(a) * 1.9, 2.05, bz + Math.cos(a) * 1.9, 0.14, 2.8, 0.14);
      }
      tapered(blueGlaze, bx, 4.25, bz, 3.0, 0.35, 1.75, 1, 6);
    }

    // Grand Đại Giác Điện main sanctuary hall
    A.vietnameseHall(T, kit, {
      w: 16.2, d: 9.8, baseH: 1.1, colH: 3.6,
      wall: ochre, wood: crimson, tile, ridge: 0xd9cbb0, eave: gold,
      doubleTier: true, bays: 5
    });

    A.trees(T, kit, [
      { x: -11.8, z: -6.8, h: 9.2, kind: 'banyan' },
      { x: 11.8, z: -6.8, h: 9.2, kind: 'banyan' }
    ]);
  }

  // 13. Ga Huế (2 Bùi Thị Xuân) — Iconic 1906 salmon-pink & cream French Indochine railway station
  function gaHue(T, kit) {
    const { box, stamp, round, outline } = kit;
    const pink = 0xd99b8c, cream = 0xf4eee0, shutter = 0x264b3b, roof = 0x984231, steel = 0x4b5862, stone = 0xa29c90;
    kit.palette({plaster: cream, timber: shutter, metal: steel, stone});

    // Station plaza & rear railway platform + tracks
    box(stone, 0, 0.14, 1.5, 34, 0.28, 22);
    box(0x88837a, 0, 0.32, -8.2, 36, 0.64, 4.8);

    // Symmetrical 1-story French Indochine side wings with arched colonnade & green shutters
    box(pink, 0, 3.2, -1.2, 28.6, 5.8, 8.6);
    box(cream, 0, 6.25, -1.2, 29.2, 0.34, 9.2);
    A.gabledRoof(T, kit, 0, 6.45, -1.2, 29.0, 9.0, 2.35, roof, cream, { alongX: true, overhang: 0.45 });

    // Central taller 2-story French pavilion with steep mansard hip roof & classic white clock
    box(pink, 0, 4.65, -0.6, 10.6, 8.8, 9.8);
    box(cream, 0, 9.15, -0.6, 11.2, 0.36, 10.4);
    A.gabledRoof(T, kit, 0, 9.35, -0.6, 11.0, 10.2, 2.65, roof, cream, { alongX: true, overhang: 0.45 });
    // Arched central entrance doors + upper arched French windows
    A.vaultedBay(T, kit, 0, 3.9, 8.6, 4.4, 1.85, 2.2, 1.4, pink, cream, 0x5c463c);
    for (const wx of [-3.1, 0, 3.1]) {
      box(0x283640, wx, 6.85, 4.35, 1.35, 2.15, 0.14);
      for (const sf of [-1, 1]) box(shutter, wx + sf * 0.8, 6.85, 4.42, 0.32, 2.1, 0.08);
    }
    // Side wing arched bays
    for (const sx of [-11.4, -8.2, 8.2, 11.4]) {
      box(0x283640, sx, 3.15, 3.16, 1.45, 2.65, 0.14);
      for (const sf of [-1, 1]) box(shutter, sx + sf * 0.86, 3.15, 3.24, 0.32, 2.6, 0.08);
      box(cream, sx, 4.62, 3.22, 1.9, 0.22, 0.16);
    }

    // Classic front clock gable & crimson-gold GA HUẾ sign
    outline([[-3.2, 0], [0, 1.85], [3.2, 0]], cream, 0, 9.25, 4.1, 0.65);
    stamp(round, 0xf8f5ec, 0, 10.05, 4.82, 0.68, 0.12, 0.68, 0, Math.PI / 2);
    A.plaque(T, kit, 'GA HUẾ', 0, 4.82, 4.78, 4.4, 0.92, { bg: '#8a231c', fg: '#f8e28c' });

    // Rear railway platform shelter & steel rails
    box(steel, 0, 4.25, -8.2, 30.0, 0.20, 4.2, 0, -0.06);
    for (let x = -12; x <= 12; x += 6) {
      stamp(round, steel, x, 2.35, -8.2, 0.14, 3.9, 0.14);
    }
    box(0x6b675f, 0, 0.12, -12.6, 36, 0.24, 4.0);
    for (const rz of [-13.15, -12.05]) box(0x5b6268, 0, 0.32, rz, 36, 0.12, 0.10);

    A.trees(T, kit, [
      { x: -13.8, z: 6.4, h: 7.4, kind: 'banyan' },
      { x: 13.8, z: 6.4, h: 7.4, kind: 'banyan' }
    ]);
  }

  // 14. Đàn Nam Giao (Huế) — Sacred 3-tier Heaven-Earth-Man Sky Altar (Viên Đàn circular top + Phương Đàn square terraces)
  function danNamGiaoHue(T, kit) {
    const { box, stamp, round } = kit;
    const stone = 0x9b9487, darkStone = 0x7b756b, redWall = 0x9e3b2e, blueRim = 0x2b6e88, ochre = 0xd8c390, grass = 0x4b7442;
    kit.palette({stone: [stone, darkStone], plaster: ochre});

    // Tier 1 (Nhân Đàn — outer square walled courtyard)
    box(grass, 0, 0.14, 0, 34, 0.28, 34);
    box(stone, 0, 0.42, 0, 29.6, 0.56, 29.6);
    for (const s of [-1, 1]) {
      box(redWall, s * 14.8, 1.05, 0, 0.55, 1.15, 29.6);
      box(redWall, 0, 1.05, s * 14.8, 29.6, 1.15, 0.55);
    }

    // Tier 2 (Phương Đàn — square Earth terrace with ochre walls & 4 cardinal stairways)
    box(stone, 0, 1.32, 0, 21.4, 1.25, 21.4);
    for (const s of [-1, 1]) {
      box(ochre, s * 10.6, 2.22, 0, 0.42, 0.65, 21.4);
      box(ochre, 0, 2.22, s * 10.6, 21.4, 0.65, 0.42);
    }
    // 4 cardinal ceremonial stairways + blue-tiled Nghi Môn lintel posts
    for (const [sx, sz, rot] of [[0, 12.2, 0], [0, -12.2, Math.PI], [12.2, 0, Math.PI / 2], [-12.2, 0, -Math.PI / 2]]) {
      box(darkStone, sx, 1.0, sz, 3.6, 1.1, 3.2, rot);
    }

    // Tier 3 (Viên Đàn — iconic circular Heaven Altar with stone floor rimmed by imperial turquoise-blue balustrade!)
    stamp(round, stone, 0, 2.68, 0, 8.2, 1.48, 8.2);
    stamp(round, blueRim, 0, 3.52, 0, 8.38, 0.42, 8.38);
    stamp(round, 0xbab3a4, 0, 3.60, 0, 7.55, 0.34, 7.55);
    // Central stone Heaven Offering Altar (Bàn thờ Hoàng Thiên Thượng Đế) & ritual incense burner
    box(darkStone, 0, 4.05, -0.6, 3.2, 1.15, 1.65);
    box(0x8e271e, 0, 4.68, -0.6, 2.9, 0.18, 1.45);
    stamp(round, 0x5c4f3d, 0, 4.15, 1.85, 0.62, 1.15, 0.62);

    A.plaque(T, kit, 'ĐÀN NAM GIAO', 0, 1.65, 15.2, 4.8, 0.72, { bg: '#1e526a', fg: '#f8dc7c' });

    // Sacred royal Huế pine forest enveloping Đàn Nam Giao
    A.trees(T, kit, [
      { x: -16.2, z: -15.6, h: 11.8, kind: 'pine' },
      { x: 16.2, z: -15.6, h: 12.0, kind: 'pine' },
      { x: -16.4, z: 15.2, h: 11.2, kind: 'pine' },
      { x: 16.4, z: 15.2, h: 11.4, kind: 'pine' }
    ]);
  }

  (window.VietnamSights ??= []).push(
    {
      id: 'nha-hat-trung-vuong', name: 'Nhà hát Trưng Vương', city: 'Đà Nẵng', province: 'Đà Nẵng', region: 'Trung Bộ',
      lon: 108.220743, lat: 16.068845, start: [108.220740, 16.068614], yaw: -0.014,
      width: 34, depth: 24,
      solids: [[0, 0.8, 14.5, 7.0], [0, -5.8, 9.5, 4.5]],
      description: 'Nhà hát trung tâm lâu đời của thành phố Đà Nẵng trên đường Hùng Vương với hàng cột mặt tiền cao vút, mái sảnh đua và hộp sân khấu bề thế.',
      photo: 'https://danangfantasticity.com/',
      source: 'https://vi.wikipedia.org/wiki/Nh%C3%A0_h%C3%A1t_Tr%C6%B0ng_V%C6%B0%C6%A1ng',
      map: 'https://www.openstreetmap.org/?mlat=16.068845&mlon=108.220743#map=18/16.068845/108.220743',
      build: nhaHatTrungVuong
    },
    {
      id: 'bao-tang-da-nang', name: 'Bảo tàng Đà Nẵng (42 Bạch Đằng)', city: 'Đà Nẵng', province: 'Đà Nẵng', region: 'Trung Bộ',
      lon: 108.224050, lat: 16.075010, start: [108.224391, 16.075071], yaw: 1.753,
      width: 34, depth: 22,
      solids: [[0, -1.2, 14.8, 7.2]],
      description: 'Tòa Đốc lý Pháp cổ xây dựng năm 1898 tại số 42 Bạch Đằng ven sông Hàn — trụ sở mới của Bảo tàng Đà Nẵng với tường vàng kem, cửa chớp xanh và mái ngói đỏ đối xứng.',
      photo: 'https://danangfantasticity.com/',
      source: 'https://baotangdanang.vn/',
      map: 'https://www.openstreetmap.org/?mlat=16.07501&mlon=108.22405#map=18/16.07501/108.22405',
      build: baoTangDaNang
    },
    {
      id: 'ca-chep-hoa-rong', name: 'Cá Chép Hóa Rồng & Cầu Tình Yêu', city: 'Đà Nẵng', province: 'Đà Nẵng', region: 'Trung Bộ',
      lon:108.229816,lat:16.062925,start:[108.230145,16.062962],yaw:0,width:26,depth:24,
      boundary:lovePier,foundationAt:[22,-8],solids:[[0,0,3.6,3.6]],
      views:[{name:'Tượng bên bờ sông Hàn',height:10,viewRadius:26,viewAngle:-1.0,viewElevation:.20},
        {name:'Cầu Tình Yêu và đường ven sông',offset:[-6,-31],height:6,viewRadius:101,viewAngle:-1.24,viewElevation:.42}],
      description:'Từ đường Trần Hưng Đạo ra bến, tượng Cá Chép Hóa Rồng nhìn về sông Hàn. Dãy lan can với đèn trái tim đỏ theo nhịp cầu tàu uốn cong về phía bắc.',
      photo:'https://danangfantasticity.com/cong-trinh-hien-dai/dhc-marina-ben-du-thuyen-da-nang',
      source:'https://danangfantasticity.com/en/architecture/dhc-marina',
      map:'https://www.openstreetmap.org/way/1243663176',
      build: caChepHoaRong
    },
    {
      id: 'cung-the-thao-tien-son', name: 'Cung Thể thao Tiên Sơn', city: 'Đà Nẵng', province: 'Đà Nẵng', region: 'Trung Bộ',
      lon: 108.226551, lat: 16.036777, start: [108.226490, 16.035850], yaw: -0.063,
      width: 52, depth: 52,
      solids: [[0, 0, 22.0, 22.0]],
      description: 'Nhà thi đấu biểu tượng hình "Đĩa bay" của Đà Nẵng với mái vòm elip bạc vươn rộng trên hệ cột chữ V nghiêng bao quanh khối sảnh kính xanh.',
      photo: 'https://danangfantasticity.com/',
      source: 'https://vi.wikipedia.org/wiki/Cung_Th%E1%BB%83_thao_Ti%C3%AAn_S%C6%A1n',
      map: 'https://www.openstreetmap.org/?mlat=16.036777&mlon=108.226551#map=17/16.036777/108.226551',
      build: cungTheThaoTienSon
    },
    {
      id: 'hoi-quan-quang-dong', name: 'Hội quán Quảng Đông', city: 'Hội An', province: 'Đà Nẵng', region: 'Trung Bộ',
      lon: 108.326561, lat: 15.877315, start: [108.326758, 15.877321], yaw: 1.578,
      width: 18, depth: 20,
      solids: [[0, -4.6, 7.2, 4.2], [0, 1.8, 2.4, 2.4], ...A.archPiers(0, 7.4, 4.4, 1.32, 1.9)],
      description: 'Hội quán Quảng Triệu xây dựng năm 1885 tại 176 Trần Phú, phố cổ Hội An, nổi bật với cổng tam quan ngói xanh lam và đài phun nước rồng gốm sứ cuộn tròn giữa sân.',
      photo: 'https://hoianheritage.net/',
      source: 'https://hoianheritage.net/',
      map: 'https://www.openstreetmap.org/?mlat=15.877315&mlon=108.326561#map=19/15.877315/108.326561',
      build: hoiQuanQuangDong
    },
    {
      id: 'nha-co-tan-ky', name: 'Nhà cổ Tấn Ký', city: 'Hội An', province: 'Đà Nẵng', region: 'Trung Bộ',
      lon: 108.327831, lat: 15.876455, start: [108.327803, 15.876220], yaw: -0.114,
      width: 14, depth: 19,
      solids: [[0, -0.5, 5.0, 8.6]],
      description: 'Ngôi nhà cổ hơn 200 năm tuổi tại 101 Nguyễn Thái Học, Hội An, mang kiến trúc nhà ống hai tầng gỗ lim kết hợp Việt – Hoa – Nhật với mái ngói âm dương rêu phong và đèn lồng lụa.',
      photo: 'https://hoianheritage.net/',
      source: 'https://vi.wikipedia.org/wiki/Nh%C3%A0_c%E1%BB%95_T%E1%BA%A5n_K%C3%BD',
      map: 'https://www.openstreetmap.org/?mlat=15.876455&mlon=108.327831#map=19/15.876455/108.327831',
      build: nhaCoTanKy
    },
    {
      id: 'tuong-dai-me-thu', name: 'Tượng đài Mẹ Việt Nam Anh hùng', city: 'Tam Kỳ', province: 'Đà Nẵng', region: 'Trung Bộ',
      lon: 108.510828, lat: 15.583909, start: [108.512424,15.585730], yaw: 2.42,
      width: 93, depth: 84,
      solids: [[0,-12,18,11],[-29,-2,8,7],[29,-2,8,7],[-39,13,4,8],[39,13,4,8]],
      views:[{name:'Tượng đài nhìn qua hồ',height:16,viewRadius:94,viewAngle:2.42,viewElevation:.115,viewFov:49},
        {name:'Hai cánh cung và hồ nước',height:15,viewRadius:97,viewAngle:2.75,viewElevation:.46,viewFov:53}],
      description: 'Tượng đài trên núi Cấm lấy nguyên mẫu Mẹ Việt Nam anh hùng Nguyễn Thị Thứ. Khối tượng cao 18,37 m, rộng 84,7 m. Hai cánh đá ôm lấy hồ nước phía trước. Khuôn mặt được để trơn trong mô hình.',
      photo: 'https://dltm.vnptit3.vn/vi/tuongdaimevietnam',
      source: 'https://baochinhphu.vn/quang-nam-khanh-thanh-tuong-dai-me-viet-nam-anh-hung-102180934.htm',
      map: 'https://www.openstreetmap.org/?mlat=15.583909&mlon=108.510828#map=19/15.583909/108.510828',
      build: tuongDaiMeThu
    },
    {
      id: 'bao-tang-my-thuat-da-nang', name: 'Bảo tàng Mỹ thuật Đà Nẵng', city: 'Đà Nẵng', province: 'Đà Nẵng', region: 'Trung Bộ',
      lon: 108.217746, lat: 16.071258, start: [108.217778, 16.071029], yaw: 0.133,
      width: 30, depth: 22,
      solids: [[0, -1.2, 12.6, 7.0], [0, 6.2, 4.5, 1.5]],
      description: 'Tòa nhà trưng bày mỹ thuật ba tầng phong cách tân cổ điển tại số 78 Lê Duẩn với mặt tiền bốn cột tròn đỡ trán tường tam giác và tác phẩm điêu khắc ngoài sân.',
      photo: 'https://dnfam.vn/',
      source: 'https://dnfam.vn/',
      map: 'https://www.openstreetmap.org/?mlat=16.071258&mlon=108.217746#map=18/16.071258/108.217746',
      build: baoTangMyThuatDaNang
    },
    {
      id: 'cung-an-dinh', name: 'Cung An Định (Khải Tường Lâu)', city: 'Huế', province: 'Huế', region: 'Trung Bộ',
      lon: 107.598309, lat: 16.456634, start: [107.598438, 16.456394], yaw: 0.479,
      width: 32, depth: 28,
      solids: [[0, -5.6, 11.2, 7.2], [0, 5.4, 2.8, 2.8], ...A.archPiers(0, 11.2, 4.6, 1.38, 1.8)],
      description: 'Lâu đài ba tầng Khải Tường Lâu mang phong cách Baroque kết hợp mỹ thuật cung đình Huế bên bờ sông An Cựu, cùng đình bát giác Trung Lập và cổng chính khảm sành sứ tinh xảo.',
      photo: 'https://hueworldheritage.org.vn/',
      source: 'https://cdt.gov.vn/data/cung-an-dinh',
      map: 'https://www.openstreetmap.org/?mlat=16.456634&mlon=107.598309#map=18/16.456634/107.598309',
      build: cungAnDinh
    },
    {
      id: 'lang-gia-long', name: 'Lăng Gia Long (Thiên Thọ Lăng)', city: 'Huế', province: 'Huế', region: 'Trung Bộ',
      lon: 107.599000, lat: 16.366600, start: [107.599180, 16.366990], yaw: 2.723,
      width: 30, depth: 30,
      solids: [[0, -10.2, 9.2, 5.0], [0, -3.5, 3.0, 3.0]],
      description: 'Lăng vị hoàng đế sáng lập triều Nguyễn giữa rừng thông Đại Thiên Thọ. Sân chầu có hai hàng tượng đá, mỗi bên hai quan văn và ba quan võ. Phía trên là Bửu Thành với hai ngôi mộ đá sóng đôi.',
      photo: 'https://vtcnews.vn/bi-an-ve-nhung-vi-thach-quan-o-lang-vua-gia-long-ar281329.html',
      source: 'https://vi.wikipedia.org/wiki/L%C4%83ng_Gia_Long',
      map: 'https://www.openstreetmap.org/?mlat=16.3666&mlon=107.599#map=17/16.3666/107.599',
      build: langGiaLong
    },
    {
      id: 'lang-dong-khanh', name: 'Lăng Đồng Khánh (Tư Lăng)', city: 'Huế', province: 'Huế', region: 'Trung Bộ',
      lon: 107.568523, lat: 16.429636, start: [107.568750, 16.429760], yaw: 2.087,
      width: 26, depth: 24,
      solids: [[0, -3.8, 8.8, 5.4], ...A.archPiers(0, 8.2, 4.8, 1.45, 1.9)],
      description: 'Tư Lăng tại Thủy Xuân đánh dấu bước giao thoa kiến trúc cung đình Huế và Pháp cổ với điện Ngưng Hy lợp ngói hoàng lưu ly, cửa vòm kính màu và rừng thông trầm mặc.',
      photo: 'https://hueworldheritage.org.vn/',
      source: 'https://vi.wikipedia.org/wiki/L%C4%83ng_%C4%90%E1%BB%93ng_Kh%C3%A1nh',
      map: 'https://www.openstreetmap.org/?mlat=16.429636&mlon=107.568523#map=18/16.429636/107.568523',
      build: langDongKhanh
    },
    {
      id: 'chua-dieu-de', name: 'Chùa Diệu Đế Quốc Tự', city: 'Huế', province: 'Huế', region: 'Trung Bộ',
      lon: 107.587421, lat: 16.477856, start: [107.587672, 16.477506], yaw: 0.603,
      width: 28, depth: 26,
      solids: [[0, 0, 8.4, 5.2], [-8.6, 2.6, 2.6, 2.6], [8.6, 2.6, 2.6, 2.6], ...A.archPiers(0, 10.2, 5.2, 1.58, 2.4)],
      description: 'Quốc tự thời vua Thiệu Trị bên sông Đông Ba, nổi bật với cổng tam quan ngói thanh lưu ly hướng mặt nước, hai lầu lục giác nhà bia – gác chuông và Đại Giác Điện.',
      photo: 'https://hueworldheritage.org.vn/',
      source: 'https://vi.wikipedia.org/wiki/Ch%C3%B9a_Di%E1%BB%87u_%C4%90%E1%BA%BF',
      map: 'https://www.openstreetmap.org/?mlat=16.477856&mlon=107.587421#map=18/16.477856/107.587421',
      build: chuaDieuDe
    },
    {
      id: 'ga-hue', name: 'Ga Huế', city: 'Huế', province: 'Huế', region: 'Trung Bộ',
      lon: 107.578050, lat: 16.456320, start: [107.578050, 16.456580], yaw: Math.PI,
      width: 36, depth: 24,
      solids: [[0, -1.2, 14.5, 4.8]],
      description: 'Nhà ga kiến trúc Pháp cổ xây dựng năm 1906 bên đường Bùi Thị Xuân, nổi bật với tường hồng phấn đặc trưng, cửa vòm chớp xanh, đồng hồ mặt tiền và sân ga Bắc – Nam.',
      photo: 'https://vi.wikipedia.org/wiki/Ga_Hu%E1%BA%BF',
      source: 'https://vi.wikipedia.org/wiki/Ga_Hu%E1%BA%BF',
      map: 'https://www.openstreetmap.org/?mlat=16.45632&mlon=107.57805#map=18/16.45632/107.57805',
      build: gaHue
    },
    {
      id: 'dan-nam-giao-hue', name: 'Đàn Nam Giao', city: 'Huế', province: 'Huế', region: 'Trung Bộ',
      lon: 107.583200, lat: 16.437800, start: [107.583703, 16.437891], yaw: 1.756,
      width: 36, depth: 36,
      solids: [[0, 0, 10.8, 10.8]],
      description: 'Đàn tế Trời Đất còn nguyên vẹn nhất Việt Nam do triều Nguyễn xây dựng năm 1806 giữa rừng thông Trường An, gồm ba tầng theo thuyết Thiên Viên Địa Phương với Viên Đàn tròn lan can xanh trên cùng.',
      photo: 'https://hueworldheritage.org.vn/',
      source: 'https://vi.wikipedia.org/wiki/%C4%90%C3%A0n_Nam_Giao_(nh%C3%A0_Nguy%E1%BB%85n)',
      map: 'https://www.openstreetmap.org/?mlat=16.4378&mlon=107.5832#map=18/16.4378/107.5832',
      build: danNamGiaoHue
    }
  );
})();
