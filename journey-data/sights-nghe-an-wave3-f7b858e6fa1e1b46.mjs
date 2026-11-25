const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const A = window.CentralArch;

  // 1. Chợ Vinh — 3-story cream-white Beaux-Arts / modern market hall with arched colonnades & octagonal clock cupola
  function choVinh(T, kit) {
    const { box, stamp, round, tapered, outline } = kit;
    const cream = 0xefe7d6, trim = 0xd6c7aa, roof = 0xa43a2b, cupola = 0x3b786c, glass = 0x2f4354, red = 0x9e2b22, stone = 0xa69f92;
    kit.palette({plaster: cream, glass, stone});

    // Paved market apron & front steps
    box(stone, 0, 0.14, 0, 34, 0.28, 24);
    A.steps(kit, 0, 10.6, 12.5, 1.8, 3, 0.18, 0.36, 0x90897d);

    // Main 3-story market wing
    box(cream, 0, 5.4, -1.0, 28.4, 10.6, 16.4);
    for (const fy of [3.55, 7.15, 10.65]) {
      box(trim, 0, fy, -1.0, 29.0, 0.34, 17.0);
    }
    // Mansard / hipped red-tile roof over main market
    A.gabledRoof(T, kit, 0, 10.8, -1.0, 28.6, 16.6, 2.35, roof, 0xd8c9ad, { alongX: true, overhang: 0.45 });

    // Rounded / octagonal corner pavilions
    for (const s of [-1, 1]) {
      stamp(round, cream, s * 14.2, 6.2, 6.6, 2.7, 12.2, 2.7);
      stamp(round, trim, s * 14.2, 12.4, 6.6, 2.95, 0.38, 2.95);
      tapered(cupola, s * 14.2, 14.3, 6.6, 2.8, 0.35, 3.4, 1, 8);
      stamp(round, 0xd7b357, s * 14.2, 16.3, 6.6, 0.22, 0.85, 0.22);
    }

    // 3-story arched gallery openings & striped market awnings on front facade
    for (let i = -5; i <= 5; i++) {
      if (Math.abs(i) <= 1) continue;
      const x = i * 2.35;
      // Ground shop arcade
      box(0x2d241f, x, 1.75, 7.26, 1.55, 2.95, 0.18);
      box(i % 2 ? red : 0xd9a83c, x, 3.12, 8.05, 2.15, 0.14, 1.45, 0, 0.26);
      // 2nd & 3rd floor arched windows
      for (const wy of [5.35, 8.85]) {
        box(glass, x, wy, 7.25, 1.35, 2.15, 0.14);
        box(trim, x, wy + 1.15, 7.34, 1.6, 0.22, 0.18);
      }
      box(trim, x, 5.35, 7.32, 0.26, 10.3, 0.26);
    }

    // Projecting central entrance portico + clock pediment + octagonal green cupola
    box(cream, 0, 6.2, 7.8, 9.6, 12.2, 2.8);
    A.vaultedBay(T, kit, 0, 8.5, 8.4, 5.2, 2.65, 2.45, 1.6, cream, trim, 0x5c4b3c);
    // Triangular Beaux-Arts pediment
    outline([[-5.2, 0], [0, 2.85], [5.2, 0]], cream, 0, 12.2, 8.0, 1.8);
    outline([[-5.5, -0.08], [0, 3.1], [5.5, -0.08], [5.1, -0.35], [0, 2.68], [-5.1, -0.35]], roof, 0, 12.25, 7.9, 2.0);
    // Central clock face inside pediment
    stamp(round, 0xf7f4e8, 0, 13.55, 9.85, 0.92, 0.16, 0.92, 0, Math.PI / 2);
    stamp(round, 0x262930, 0, 13.55, 9.95, 0.08, 0.08, 0.72);
    // Stepped clock cupola above center
    box(cream, 0, 14.8, 4.6, 4.4, 2.8, 4.4);
    for (const f of [-1, 1]) {
      box(glass, 0, 14.9, 4.6 + f * 2.24, 1.6, 1.65, 0.12);
      box(glass, f * 2.24, 14.9, 4.6, 0.12, 1.65, 1.6);
    }
    tapered(cupola, 0, 17.85, 4.6, 2.85, 0.45, 3.4, 1, 8);
    stamp(round, 0xe0ba56, 0, 20.1, 4.6, 0.14, 1.5, 0.14);

    // Bold crimson CHỢ VINH signboard
    A.plaque(T, kit, 'CHỢ VINH', 0, 6.55, 9.32, 6.2, 1.15, { bg: '#9b231c', fg: '#f8e084' });

    // Front market shade trees
    A.trees(T, kit, [
      { x: -13.5, z: 11.2, h: 6.4, kind: 'banyan' },
      { x: 13.5, z: 11.2, h: 6.4, kind: 'banyan' }
    ]);
  }

  // 2. Ga Vinh — Historic North–South railway station with cantilevered canopy, clock gable & rail tracks
  function gaVinh(T, kit) {
    const { box, stamp, round } = kit;
    const cream = 0xeee5d2, terra = 0xa8553b, slate = 0x4b5863, glass = 0x2a4557, concrete = 0xc5bfb3, railSteel = 0x5c6368;
    kit.palette({plaster: [cream, concrete], glass});

    // Station plaza & concrete platform
    box(0x9b978d, 0, 0.14, 1.5, 34, 0.28, 22);
    box(0x88847b, 0, 0.32, -8.5, 36, 0.64, 5.2); // railway boarding platform

    // Main horizontal concourse hall
    box(cream, 0, 3.6, -1.2, 29.0, 6.8, 9.2);
    box(terra, 0, 7.15, -1.2, 29.8, 0.45, 9.8);
    // Clerestory central hall rising taller
    box(cream, 0, 8.6, -1.2, 13.6, 2.6, 8.4);
    box(terra, 0, 10.1, -1.2, 14.4, 0.45, 9.2);

    // Tall vertical sun-breaker louvers & concourse windows
    for (let i = -6; i <= 6; i++) {
      const x = i * 2.15;
      box(glass, x, 3.7, 3.44, 1.35, 4.1, 0.12);
      box(concrete, x + 1.07, 3.8, 3.62, 0.22, 6.2, 0.48);
    }
    for (let i = -4; i <= 4; i++) {
      box(glass, i * 1.45, 8.6, 3.04, 0.92, 1.55, 0.12);
    }

    // Iconic cantilevered drop-off arrival canopy supported by paired concrete columns
    box(concrete, 0, 4.55, 6.6, 15.6, 0.42, 6.4);
    box(terra, 0, 4.82, 9.75, 15.8, 0.28, 0.26);
    for (const sx of [-6.4, -2.4, 2.4, 6.4]) {
      box(0xd8d2c5, sx, 2.3, 8.6, 0.48, 4.4, 0.48);
    }

    // Rooftop red-and-gold GA VINH station sign + station clock
    A.plaque(T, kit, 'GA VINH', 0, 11.45, 3.2, 7.2, 1.38, { bg: '#9b211c', fg: '#f9e38d' });
    box(cream, 0, 6.2, 9.75, 2.6, 2.4, 0.35);
    stamp(round, 0xf7f4eb, 0, 6.25, 9.96, 0.85, 0.14, 0.85, 0, Math.PI / 2);
    stamp(round, 0x22262b, 0, 6.25, 10.05, 0.08, 0.08, 0.65);

    // Steel canopy shelter over Platform 1 & steel railway tracks behind the building
    box(slate, 0, 4.45, -8.5, 31.0, 0.22, 4.4, 0, -0.06);
    for (let x = -13; x <= 13; x += 6.5) {
      stamp(round, slate, x, 2.45, -8.5, 0.16, 4.2, 0.16);
    }
    // Gravel trackbed, sleepers & twin iron rails
    box(0x6d6860, 0, 0.12, -13.2, 36, 0.24, 4.2);
    for (let x = -17; x <= 17; x += 0.95) {
      box(0x524234, x, 0.25, -13.2, 0.22, 0.12, 2.4);
    }
    for (const rz of [-13.75, -12.65]) {
      box(railSteel, 0, 0.36, rz, 36, 0.12, 0.10);
    }

    A.trees(T, kit, [
      { x: -14.2, z: 7.4, h: 7.0, kind: 'banyan' },
      { x: 14.2, z: 7.4, h: 7.0, kind: 'banyan' }
    ]);
  }

  // 3. Chùa Cần Linh (Chùa Sư Nữ)
  function chuaCanLinh(T, kit) {
    const { box, stamp, round } = kit;
    const ochre = 0xe1c78c, crimson = 0x8b291f, tile = 0x8f3f2b, gold = 0xdba943, stone = 0x9b9487, water = 0x3f6e78;
    kit.palette({plaster: ochre, tile, stone});

    // Red-brick temple forecourt
    box(0x9a5b44, 0, 0.14, 0.5, 30, 0.28, 25);

    // Front 3-bay crimson-and-ochre Tam Quan gate at z = +9.2
    const gz = 9.2;
    A.vaultedBay(T, kit, 0, gz, 4.8, 4.4, 1.48, 2.2, 2.4, ochre, 0xb89658, 0x5c3c28);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 4.2, gz, 3.6, 3.2, 0.96, 1.6, 1.9, ochre, 0xb89658, 0x5c3c28);
      A.curvedRoof(T, kit, s * 4.2, 3.25, gz, 4.4, 2.8, 0.82, tile, 0xd9caa8, gold, 0.28);
    }
    A.curvedRoof(T, kit, 0, 4.45, gz, 6.0, 3.4, 0.95, tile, 0xd9caa8, gold, 0.30);
    box(ochre, 0, 6.15, gz, 3.5, 1.45, 1.95);
    A.curvedRoof(T, kit, 0, 6.9, gz, 5.2, 2.9, 1.05, tile, 0xd9caa8, gold, 0.28, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'CHÙA CẦN LINH', 0, 3.95, gz + 1.28, 3.8, 0.64, { bg: '#7c2019', fg: '#f8da7c' });

    // The lotus pond lies outside the worship halls.
    stamp(round, stone, -7.8, 0.32, 2.8, 2.8, 0.44, 2.8);
    stamp(round, water, -7.8, 0.44, 2.8, 2.45, 0.22, 2.45);

    // 7-tier octagonal Bảo Tháp stupa on right flank
    A.octagonalTower(T, kit, 9.2, 2.2, {
      tiers: 7,
      baseW: 3.1,
      tierH: 1.65,
      wall: 0xe7d6af,
      tile: 0x8f3a29,
      trim: gold
    });

    // Main double-tier Đại Hùng Bảo Điện sanctuary behind courtyard
    const mainZ = -5.4;
    box(stone, 0, 0.55, mainZ, 16.4, 1.1, 10.6);
    A.steps(kit, 0, mainZ + 5.8, 5.6, 1.2, 4, 0.27, 0.35, 0x868075);
    box(ochre, 0, 2.85, mainZ - 0.3, 13.8, 3.6, 8.2);
    for (let i = -3; i <= 3; i++) {
      stamp(round, crimson, i * 2.2, 2.9, mainZ + 4.2, 0.19, 3.6, 0.19);
    }
    A.curvedRoof(T, kit, 0, 4.7, mainZ, 16.8, 10.8, 1.65, tile, 0xd8c9a8, gold, 0.32);
    box(crimson, 0, 6.85, mainZ, 10.6, 1.6, 6.4);
    A.curvedRoof(T, kit, 0, 7.65, mainZ, 12.6, 8.2, 1.85, tile, 0xd8c9a8, gold, 0.30, { dragons: true, goldColor: gold });

    A.trees(T, kit, [
      { x: -12.6, z: -6.8, h: 8.6, kind: 'banyan' },
      { x: 12.4, z: -6.2, h: 8.2, kind: 'banyan' },
      { x: -11.5, z: 8.4, h: 6.8, kind: 'banyan' }
    ]);
  }

  // 4. Đền Hồng Sơn (Võ Miếu) — Historic Vinh sacred temple with square Giếng Ngọc well, 2-tier Tam Quan & crimson hall
  function denHongSon(T, kit) {
    const { box, stamp, round } = kit;
    const ochre = 0xdbc18a, redBrick = 0x995843, tile = 0x823b2c, gold = 0xd2a144, stone = 0x8c8578;
    kit.palette({plaster: ochre, tile, stone});

    // Courtyard paved in traditional terracotta tiles
    box(redBrick, 0, 0.14, 0.5, 26, 0.28, 25);

    // Front square stone sacred well (Giếng Ngọc) with open water rim & corner pillars
    const wz = 8.4;
    box(0x2a6674, 0, 0.52, wz, 4.3, 0.24, 4.3); // clear blue-green well water
    for (const s of [-1, 1]) {
      box(stone, 0, 0.50, wz + s * 2.45, 5.5, 0.92, 0.62);
      box(stone, s * 2.45, 0.50, wz, 0.62, 0.92, 4.3);
    }
    for (const sx of [-2.55, 2.55]) for (const sz of [wz - 2.55, wz + 2.55]) {
      box(0xb5a88d, sx, 1.12, sz, 0.48, 0.52, 0.48);
    }

    // Twin ceremonial bronze braziers & side stele houses
    for (const s of [-1, 1]) {
      stamp(round, 0x5c4f3d, s * 5.6, 0.95, 4.2, 0.52, 1.15, 0.52);
      box(ochre, s * 9.2, 1.65, 1.4, 3.2, 2.8, 3.2);
      A.curvedRoof(T, kit, s * 9.2, 3.05, 1.4, 4.2, 4.2, 1.15, tile, 0xd7c7a7, gold, 0.24);
    }

    // Main double-tier Đền Hồng Sơn sanctuary
    const hz = -4.2;
    box(stone, 0, 0.55, hz, 18.6, 1.1, 11.4);
    A.steps(kit, 0, hz + 6.2, 6.2, 1.4, 4, 0.27, 0.38, 0x817b70);
    box(ochre, 0, 2.95, hz - 0.3, 15.8, 3.7, 8.8);
    for (let i = -3; i <= 3; i++) {
      stamp(round, 0x6f261c, i * 2.45, 2.95, hz + 4.4, 0.20, 3.7, 0.20);
    }
    A.plaque(T, kit, 'HỒNG SƠN LINH TỪ', 0, 4.35, hz + 4.58, 4.8, 0.72, { bg: '#6e1e18', fg: '#f6d46c' });
    A.curvedRoof(T, kit, 0, 4.85, hz, 18.8, 11.8, 1.65, tile, 0xd8c7a7, gold, 0.32);
    box(0x882c21, 0, 7.05, hz, 11.6, 1.65, 6.8);
    A.curvedRoof(T, kit, 0, 7.88, hz, 13.8, 8.8, 1.9, tile, 0xd8c7a7, gold, 0.30, { dragons: true, goldColor: gold });

    A.trees(T, kit, [
      { x: -11.4, z: -6.8, h: 8.8, kind: 'banyan' },
      { x: 11.4, z: -6.8, h: 8.8, kind: 'banyan' },
      { x: -10.8, z: 9.2, h: 6.6, kind: 'banyan' },
      { x: 10.8, z: 9.2, h: 6.6, kind: 'banyan' }
    ]);
  }

  // 5. Quảng trường Bình Minh Cửa Lò — Giant sculpted Hoa Cúc Biển (Sea Daisy) coastal festival plaza
  function quangTruongBinhMinh(T, kit) {
    const { box, stamp, round, tapered, outline, wavingFlag } = kit;
    const granite = 0xd8d3c8, blueWave = 0x2b7294, seaTeal = 0x459ab4, petalGold = 0xf0be32, petalWarm = 0xe39e24, white = 0xf2f0ea;
    kit.palette({stone: granite});

    // Wide circular beachfront granite plaza with concentric ocean wave bands
    stamp(round, granite, 0, 0.16, 0, 15.5, 0.32, 15.5);
    stamp(round, blueWave, 0, 0.28, 0, 11.8, 0.18, 11.8);
    stamp(round, granite, 0, 0.36, 0, 9.6, 0.18, 9.6);
    stamp(round, seaTeal, 0, 0.52, -1.6, 6.4, 0.48, 6.4);

    // Sweeping white amphitheater wave wing walls flanking the monument
    for (const s of [-1, 1]) {
      for (let k = 0; k < 4; k++) {
        const a = s * (0.45 + k * 0.26);
        const rx = Math.sin(a) * 10.2, rz = -1.6 - Math.cos(a) * 5.2;
        box(white, rx, 1.35 + (3 - k) * 0.42, rz, 2.8, 2.3 + (3 - k) * 0.85, 0.65, -a * 0.8);
        box(blueWave, rx, 2.45 + (3 - k) * 0.82, rz, 2.9, 0.24, 0.72, -a * 0.8);
      }
    }

    // Iconic Giant Sculpted Hoa Cúc Biển (Cửa Lò Sea Daisy) rising from central wave pedestal
    tapered(white, 0, 2.4, -1.6, 3.4, 2.2, 3.4, 1, 12);
    stamp(round, 0x266586, 0, 4.25, -1.6, 2.35, 0.35, 2.35);
    // 14 curved golden flower petals fanning upward & outward like a giant blooming chrysanthemum
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const px = Math.sin(a) * 2.1, pz = -1.6 + Math.cos(a) * 2.1;
      outline(
        [[0, 0], [0.85, 1.4], [1.25, 4.4], [0.65, 7.6], [0, 8.9], [-0.65, 7.6], [-1.25, 4.4], [-0.85, 1.4]],
        i % 2 ? petalGold : petalWarm,
        px, 4.3, pz, 0.26, a + Math.PI / 2
      );
    }
    // Inner glowing golden stamen sun dome
    const dome = new T.SphereGeometry(2.05, 14, 10);
    stamp(dome, 0xf6c93e, 0, 7.2, -1.6, 1.0, 0.82, 1.0);
    dome.dispose();
    // Rising golden sun-ray pinnacle
    tapered(0xf8da68, 0, 11.4, -1.6, 0.55, 0.08, 5.2, 1, 6);

    // Coastal signboard & tall twin promenade flagpoles
    A.plaque(T, kit, 'QUẢNG TRƯỜNG BÌNH MINH', 0, 1.9, 2.8, 6.8, 0.92, { bg: '#1e587a', fg: '#f8e48c' });
    if (wavingFlag) {
      for (const s of [-1, 1]) {
        stamp(round, white, s * 11.8, 6.2, 5.2, 0.12, 12.0, 0.12);
      }
      wavingFlag(3.2, 2.1, -11.7, 11.8, 5.2);
    }

    // Seaside coconut palms lining the square
    A.trees(T, kit, [
      { x: -13.6, z: 8.6, h: 8.4, kind: 'palm' },
      { x: -14.2, z: -2.4, h: 9.2, kind: 'palm' },
      { x: 13.6, z: 8.6, h: 8.8, kind: 'palm' },
      { x: 14.2, z: -2.4, h: 8.5, kind: 'palm' }
    ]);
  }

  // 6. Đền thờ Thái sư Nguyễn Xí (Nghi Lộc) — National Special Heritage 4-pillar Nghi Môn, twin stele houses & double-tier hall
  function denNguyenXi(T, kit) {
    const { box, stamp, round, tapered } = kit;
    const laterite = 0x8e6b4f, ochre = 0xd8c398, tile = 0x833c2c, gold = 0xcfa04c, stone = 0x8c867a;
    kit.palette({plaster: ochre, tile, stone});

    // Red-brick forecourt with laterite border wall
    box(0x935942, 0, 0.14, 1.0, 28, 0.28, 26);
    for (const s of [-1, 1]) {
      box(laterite, s * 13.6, 1.1, 1.0, 0.65, 1.9, 25.2);
    }

    // Monumental 4-pillar Nghi Môn gate at front (+Z = 10.6)
    const gz = 10.6;
    for (const [px, ph] of [[-5.6, 5.2], [-2.5, 6.8], [2.5, 6.8], [5.6, 5.2]]) {
      box(stone, px, 0.55, gz, 1.15, 0.85, 1.15);
      box(ochre, px, ph * 0.5 + 0.6, gz, 0.72, ph - 0.6, 0.72);
      box(0x7c291f, px, ph * 0.5 + 0.6, gz + 0.39, 0.26, ph * 0.58, 0.06);
      tapered(gold, px, ph + 0.72, gz, 0.46, 0.12, 0.88, 1, 4); // lồng đèn & nghê chầu
    }
    for (const s of [-1, 1]) {
      box(ochre, s * 4.05, 1.45, gz, 2.35, 2.6, 0.55);
      A.curvedRoof(T, kit, s * 4.05, 2.8, gz, 3.0, 1.6, 0.75, tile, 0xd3c4a2, gold, 0.25);
    }

    // Flanking stone stele pavilions (Nhà bia Tả – Hữu)
    for (const s of [-1, 1]) {
      box(stone, s * 8.4, 0.42, 3.2, 4.2, 0.6, 4.2);
      for (const cx of [-1.5, 1.5]) for (const cz of [-1.5, 1.5]) {
        stamp(round, 0x6b281d, s * 8.4 + cx, 1.85, 3.2 + cz, 0.14, 2.4, 0.14);
      }
      box(0x6c6860, s * 8.4, 1.65, 3.2, 1.15, 1.85, 0.32); // inscribed stone stele
      A.curvedRoof(T, kit, s * 8.4, 3.05, 3.2, 4.9, 4.9, 1.35, tile, 0xd4c4a2, gold, 0.22);
    }

    // Main double-tier sanctuary (Thượng Điện – Trung Điện)
    A.vietnameseHall(T, kit, {
      w: 16.2, d: 9.8, baseH: 1.15, colH: 3.65,
      wall: ochre, wood: 0x5c2219, tile, ridge: 0xd6c6a4, eave: gold,
      doubleTier: true, bays: 5,
      title: 'ĐỀN THỜ NGUYỄN XÍ'
    });

    A.trees(T, kit, [
      { x: -11.5, z: -7.5, h: 9.2, kind: 'banyan' },
      { x: 11.5, z: -7.5, h: 9.2, kind: 'banyan' }
    ]);
  }

  // 7. Đền thờ Vua Mai Hắc Đế (Nam Đàn) — Regal imperial-gold & crimson temple with stone elephant/horse guardians
  function denVuaMaiHacDe(T, kit) {
    const { box, stamp, round } = kit;
    const goldWall = 0xe3c375, crimson = 0x7c2118, tile = 0x9c4527, gold = 0xe0b245, stone = 0x918a7e;
    kit.palette({tile, stone});

    // Grand tiered stone forecourt
    box(0xa48e70, 0, 0.14, 1.2, 28, 0.28, 26);

    // Ceremonial front Tam Quan with golden dragon ridge
    A.vaultedBay(T, kit, 0, 10.4, 5.2, 4.8, 1.62, 2.4, 2.6, goldWall, 0xba9649, 0x5c361f);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 4.5, 10.4, 3.8, 3.5, 1.04, 1.75, 2.0, goldWall, 0xba9649, 0x5c361f);
      A.curvedRoof(T, kit, s * 4.5, 3.55, 10.4, 4.7, 2.9, 0.85, tile, 0xdfcfa8, gold, 0.26);
    }
    A.curvedRoof(T, kit, 0, 4.85, 10.4, 6.4, 3.6, 1.0, tile, 0xdfcfa8, gold, 0.30);
    box(crimson, 0, 6.65, 10.4, 3.8, 1.55, 2.1);
    A.curvedRoof(T, kit, 0, 7.45, 10.4, 5.5, 3.2, 1.1, tile, 0xdfcfa8, gold, 0.28, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'MAI ĐẾ MIẾU', 0, 4.25, 11.76, 3.6, 0.66, { bg: '#791f17', fg: '#f8da72' });

    // Paired carved stone war elephants & war horses lining the royal axis (biểu tượng nghĩa quân Vạn An)
    for (const s of [-1, 1]) {
      // Stone elephant at z = 6.2
      box(stone, s * 4.8, 0.42, 6.2, 1.85, 0.56, 2.6);
      box(0xa8a296, s * 4.8, 1.35, 6.2, 1.18, 1.25, 1.95);
      box(0xa8a296, s * 4.8, 1.15, 7.25, 0.52, 0.85, 0.45); // head & trunk
      // Stone horse at z = 2.6
      box(stone, s * 4.8, 0.42, 2.6, 1.55, 0.56, 2.3);
      box(0xb5afa3, s * 4.8, 1.32, 2.6, 0.78, 0.92, 1.65);
      box(0xb5afa3, s * 4.8, 1.85, 3.25, 0.42, 0.82, 0.52, 0, 0.35);
    }

    // Royal double-eave sanctuary behind the court
    const hz = -4.2;
    box(stone, 0, 0.65, hz, 18.8, 1.3, 11.2);
    A.steps(kit, 0, hz + 6.2, 6.6, 1.5, 4, 0.32, 0.4, 0x868075);
    box(goldWall, 0, 3.15, hz - 0.3, 15.8, 3.8, 8.6);
    for (let i = -3; i <= 3; i++) {
      stamp(round, crimson, i * 2.45, 3.15, hz + 4.35, 0.21, 3.8, 0.21);
    }
    A.curvedRoof(T, kit, 0, 5.1, hz, 18.8, 11.4, 1.65, tile, 0xdfcfa8, gold, 0.32);
    box(crimson, 0, 7.35, hz, 11.8, 1.75, 6.6);
    A.curvedRoof(T, kit, 0, 8.22, hz, 14.0, 8.6, 1.95, tile, 0xdfcfa8, gold, 0.30, { dragons: true, goldColor: gold });

    // Foothills pine backdrop of Hùng Sơn / núi Đụn
    A.trees(T, kit, [
      { x: -12.2, z: -8.4, h: 10.5, kind: 'pine' },
      { x: -8.4, z: -10.8, h: 11.4, kind: 'pine' },
      { x: 8.4, z: -10.8, h: 11.2, kind: 'pine' },
      { x: 12.2, z: -8.4, h: 10.6, kind: 'pine' }
    ]);
  }

  // 8. Khu lưu niệm Phan Bội Châu (Nam Đàn)
  function phanBoiChau(T, kit) {
    const { box, stamp, round, tapered } = kit;
    const thatch = 0xb59b68, thatchRidge = 0x8f774c, wood = 0x5c3c26, bamboo = 0x8f7a53, granite = 0x858983, bronze = 0x927046;
    kit.palette({thatch, timber: [wood, bamboo], stone: granite, metal: bronze});

    // Quiet red-earth courtyard & low clipped hibiscus hedge
    box(0xb59b78, 0, 0.12, 0.5, 28, 0.24, 22);
    for (const s of [-1, 1]) {
      box(0x3a6432, s * 13.4, 0.72, 0.5, 0.85, 1.15, 20.5);
    }
    box(0x3a6432, 0, 0.72, -10.0, 27.6, 1.15, 0.85);

    // Authentic 5-bay thatched wooden ancestral house (Nhà tranh 5 gian quê cụ Phan)
    const hx = -3.8, hz = -2.2;
    box(0x8e8372, hx, 0.24, hz, 14.6, 0.48, 7.6);
    box(bamboo, hx, 1.65, hz - 0.5, 13.2, 2.35, 5.4);
    for (let i = -3; i <= 3; i++) {
      stamp(round, wood, hx + i * 2.15, 1.65, hz + 3.1, 0.13, 2.45, 0.13);
      if (i < 3) box(0x4b2f1c, hx + (i + 0.5) * 2.15, 1.55, hz + 2.22, 1.65, 2.05, 0.10);
    }
    A.gabledRoof(T, kit, hx, 2.85, hz, 14.8, 7.8, 2.85, thatch, thatchRidge, { alongX: true, overhang: 0.95, thick: 0.36 });

    // The 2020 bronze and blue-stone plinth measured 3.2 and 2.2 m at dedication.
    // The memorial board's frontal photograph shows the book against the right
    // chest, a wrapped headcloth, wide trousers and the long diagonal coat fold.
    const mx=8.4,mz=1.6,base=.24;
    box(granite,mx,base+.06,mz,2.62,.12,2.32);
    tapered(granite,mx,base+.72,mz,1.76,1.41,1.20,.88,4);
    tapered(0x9a9d94,mx,base+1.70,mz,1.41,1.09,.76,.88,4);
    box(0x69533e,mx,base+2.14,mz,1.58,.12,1.37);
    const floor=base+2.2,h=3.2;
    A.statueFigure(T,kit,bronze,mx,floor,mz,h,{headcloth:true,longCoat:true,
      rightArm:[[-.181,.638,.045],[-.105,.734,.122],[-.080,.752,.135]],
      leftArm:[[.143,.611,.002],[.147,.492,.034],[.149,.447,.052]]});
    const garment=A.carving(T,kit,bronze,mx,floor,mz,h);
    garment.sweep([[0,.246,-.006,.141,.085],[.003,.268,-.004,.142,.085],[.005,.416,.003,.132,.080],
      [.004,.554,0,.104,.070],[0,.671,-.001,.105,.065],[0,.747,.003,.106,.065]],.036,32);
    garment.sweep([[-.048,.803,.045,.005,.005],[-.009,.741,.073,.010,.008],
      [.044,.525,.069,.009,.006],[.088,.269,.064,.010,.008]],0,16);
    garment.sweep([[0,.798,.053,.005,.005],[.003,.815,.049,.012,.010],[0,.842,.044,.025,.014],
      [0,.864,.037,.031,.016],[0,.876,.029,.028,.013]],.035,20);
    garment.finish();
    box(0x67553f,mx-.095*h,floor+.766*h,mz+.117*h,.105*h,.154*h,.022*h,.07,-.15,.62);

    // Quiet front lotus pond + tall straight areca palms (hàng cau xứ Nghệ)
    box(0x8a8275, -5.2, 0.22, 7.2, 8.6, 0.32, 4.6);
    box(0x3b6c6a, -5.2, 0.32, 7.2, 7.8, 0.16, 3.8);
    A.trees(T, kit, [
      { x: -11.4, z: 6.4, h: 9.2, kind: 'palm' },
      { x: -11.4, z: 2.2, h: 9.6, kind: 'palm' },
      { x: -11.4, z: -2.0, h: 8.8, kind: 'palm' },
      { x: 10.6, z: -6.8, h: 8.2, kind: 'banyan' }
    ]);
  }

  // 9. Đền Quả Sơn (Đô Lương) — "Nhất Cờn, nhì Quả" riverside heritage temple with bell/drum towers
  function denQuaSon(T, kit) {
    const { box, stamp, round } = kit;
    const lime = 0xe0d2b4, tile = 0x873f2e, gold = 0xd0a149, stone = 0x8f897e, crimson = 0x7a271d;
    kit.palette({plaster: lime, tile, stone});

    // Terraced red-brick courtyard
    box(0x9b5a44, 0, 0.14, 1.2, 28, 0.28, 25);

    // Ornate 3-bay lime-washed Tam Quan gate at z = +9.6
    const gz = 9.6;
    A.vaultedBay(T, kit, 0, gz, 5.0, 4.6, 1.55, 2.35, 2.5, lime, 0xb7a076, 0x5c4a38);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 4.4, gz, 3.6, 3.3, 0.98, 1.65, 1.9, lime, 0xb7a076, 0x5c4a38);
      A.curvedRoof(T, kit, s * 4.4, 3.35, gz, 4.4, 2.8, 0.82, tile, 0xd8cab0, gold, 0.26);
    }
    A.curvedRoof(T, kit, 0, 4.65, gz, 6.2, 3.4, 0.98, tile, 0xd8cab0, gold, 0.30, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'QUẢ SƠN LINH TỪ', 0, 4.05, gz + 1.32, 4.0, 0.64, { bg: '#73211a', fg: '#f6d876' });

    // Flanking 2-tier Lầu Chuông & Lầu Trống (Bell & Drum pavilions)
    for (const s of [-1, 1]) {
      const bx = s * 9.4, bz = 2.4;
      box(stone, bx, 0.38, bz, 4.6, 0.56, 4.6);
      for (const cx of [-1.6, 1.6]) for (const cz of [-1.6, 1.6]) {
        stamp(round, crimson, bx + cx, 1.9, bz + cz, 0.16, 2.7, 0.16);
      }
      A.curvedRoof(T, kit, bx, 3.25, bz, 5.4, 5.4, 1.05, tile, 0xd8cab0, gold, 0.25);
      box(lime, bx, 4.9, bz, 3.2, 1.55, 3.2);
      A.curvedRoof(T, kit, bx, 5.7, bz, 4.2, 4.2, 1.2, tile, 0xd8cab0, gold, 0.22);
    }

    // Grand double-tier riverside temple hall of Uy Minh Vương Lý Nhật Quang
    A.vietnameseHall(T, kit, {
      w: 15.8, d: 9.6, baseH: 1.15, colH: 3.6,
      wall: lime, wood: crimson, tile, ridge: 0xd8cab0, eave: gold,
      doubleTier: true, bays: 5
    });

    A.trees(T, kit, [
      { x: -12.2, z: -6.8, h: 9.0, kind: 'banyan' },
      { x: 12.2, z: -6.8, h: 9.0, kind: 'banyan' }
    ]);
  }

  // 10. Đền Bạch Mã (Thanh Chương) — "Tam Bạch Mã" sacred temple with twin white horse statues & ancient banyans
  function denBachMa(T, kit) {
    const { box, stamp, round } = kit;
    const ochre = 0xdcc596, tile = 0x8a412e, gold = 0xd3a44a, stone = 0x908a7f, whiteHorse = 0xf2efe6;
    kit.palette({plaster: ochre, tile, stone});

    // Courtyard & brick path
    box(0x985b46, 0, 0.14, 1.0, 26, 0.28, 25);

    // 3-arch ochre Tam Quan gate at front
    A.vaultedBay(T, kit, 0, 9.8, 4.8, 4.4, 1.48, 2.25, 2.4, ochre, 0xb89a64, 0x5c4632);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 4.2, 9.8, 3.4, 3.2, 0.94, 1.6, 1.85, ochre, 0xb89a64, 0x5c4632);
      A.curvedRoof(T, kit, s * 4.2, 3.25, 9.8, 4.2, 2.7, 0.8, tile, 0xd8cab0, gold, 0.26);
    }
    A.curvedRoof(T, kit, 0, 4.45, 9.8, 5.8, 3.3, 0.95, tile, 0xd8cab0, gold, 0.28, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'ĐỀN BẠCH MÃ', 0, 3.9, 11.08, 3.6, 0.64, { bg: '#79221a', fg: '#f8da7c' });

    // Signature twin White Horse (Bạch Mã) guardian statues on crimson-trimmed pedestals in forecourt
    for (const s of [-1, 1]) {
      const hx = s * 5.2, hz = 4.6;
      box(stone, hx, 0.42, hz, 1.8, 0.64, 2.6);
      box(0x8c281e, hx, 0.78, hz, 1.65, 0.14, 2.45);
      // White horse body, four legs, arched neck & saddle
      for (const lx of [-0.32, 0.32]) for (const lz of [-0.58, 0.58]) {
        stamp(round, whiteHorse, hx + lx, 1.32, hz + lz, 0.11, 0.95, 0.11);
      }
      box(whiteHorse, hx, 1.92, hz, 0.86, 0.72, 1.68);
      box(0xa62a20, hx, 2.28, hz - 0.05, 0.92, 0.18, 0.68); // red brocade saddle
      box(whiteHorse, hx, 2.48, hz + 0.72, 0.44, 0.86, 0.46, 0, 0.38); // neck
      box(whiteHorse, hx, 2.82, hz + 1.04, 0.36, 0.36, 0.66, 0, -0.25); // head
    }

    // Layered wooden sanctuary hall
    A.vietnameseHall(T, kit, {
      w: 15.6, d: 9.4, baseH: 1.08, colH: 3.55,
      wall: ochre, wood: 0x5c241b, tile, ridge: 0xd8c8a8, eave: gold,
      doubleTier: true, bays: 5
    });

    A.trees(T, kit, [
      { x: -11.4, z: -5.8, h: 9.6, kind: 'banyan' },
      { x: 11.4, z: -5.8, h: 9.4, kind: 'banyan' },
      { x: -10.4, z: 7.4, h: 7.6, kind: 'banyan' },
      { x: 10.4, z: 7.4, h: 7.6, kind: 'banyan' }
    ]);
  }

  // 11. Tượng đài Xô Viết Nghệ Tĩnh Thái Lão (Hưng Nguyên) — 12/9/1930 revolutionary flame & relief plaza
  function xoVietHungNguyen(T, kit) {
    A.memorialMonument(T, kit, {
      style: 'flame',
      h: 15.5,
      plazaW: 26,
      plazaD: 22,
      stone: 0xd2ccc0,
      darkStone: 0x6f685f,
      accent: 0xb12a21,
      bronze: 0x73563a,
      wings: true,
      flags: true,
      title: 'XÔ VIẾT NGHỆ TĨNH 12-9-1930'
    });
    A.trees(T, kit, [
      { x: -12.6, z: -8.6, h: 9.8, kind: 'pine' },
      { x: -8.8, z: -10.2, h: 10.6, kind: 'pine' },
      { x: 8.8, z: -10.2, h: 10.6, kind: 'pine' },
      { x: 12.6, z: -8.6, h: 9.8, kind: 'pine' }
    ]);
  }

  // 12. Cầu Yên Xuân — Historic 5-span steel Warren-truss bridge spanning Sông Lam (drive-through!)
  function cauYenXuan(T, kit) {
    A.steelTrussBridge(T, kit, {
      len: 230,
      w: 11.6, // 2-lane undivided clear carriageway inside trusses (`|z| >= 5.8`)
      spans: 5,
      archH: 9.8,
      steel: 0x4c6b78,
      steelDark: 0x354d58,
      pierColor: 0x9c9689,
      arched: true
    });
  }

  (window.VietnamSights ??= []).push(
    {
      id: 'cho-vinh', name: 'Chợ Vinh', city: 'Vinh', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.673842, lat: 18.663430, start: [105.673842, 18.663790], yaw: 3.142,
      width: 34, depth: 24,
      solids: [[0, -0.5, 14.6, 8.6], [0, 7.8, 4.8, 1.5]],
      description: 'Ngôi chợ đầu mối lớn nhất Bắc Trung Bộ bên đường Cao Thắng – Lê Hồng Sơn, nổi bật với ba tầng hành lang cửa vòm, tháp đồng hồ chóp bát giác xanh và mái ngói đỏ.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://vi.wikipedia.org/wiki/Ch%E1%BB%A3_Vinh',
      map: 'https://www.openstreetmap.org/?mlat=18.66343&mlon=105.673842#map=18/18.66343/105.673842',
      build: choVinh
    },
    {
      id: 'ga-vinh', name: 'Ga Vinh', city: 'Vinh', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.664180, lat: 18.687700, start: [105.664534, 18.687664], yaw: 1.466,
      width: 36, depth: 26,
      solids: [[0, -1.2, 14.8, 4.8], [-6.4, 8.6, 0.5, 0.5], [6.4, 8.6, 0.5, 0.5]],
      description: 'Nhà ga trọng điểm trên tuyến đường sắt Bắc – Nam tại số 1 đường Lệ Ninh với sảnh đón vươn mái đua, đồng hồ trung tâm và ke ga đường ray phía sau.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://vi.wikipedia.org/wiki/Ga_Vinh',
      map: 'https://www.openstreetmap.org/?mlat=18.6877&mlon=105.66418#map=18/18.6877/105.66418',
      build: gaVinh
    },
    {
      id: 'chua-can-linh', name: 'Chùa Cần Linh (Chùa Sư Nữ)', city: 'Vinh', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.660800, lat: 18.662080, start: [105.661040, 18.662258], yaw: 2.232,
      width: 30, depth: 25,
      solids: [[0, -5.4, 8.2, 5.4], [-7.8, 2.8, 2.8, 2.8], [9.2, 2.2, 2.2, 2.2], ...A.archPiers(0, 9.2, 4.8, 1.48, 2.4)],
      description: 'Chùa Cần Linh, còn gọi là chùa Sư Nữ, có hồ sen trước khu thờ tự. Các pho tượng được thờ trong nhiều công trình của chùa.',
      photo: 'https://amp.baonghean.vn/chiem-nguong-he-thong-tuong-phat-dac-sac-cua-ngoi-chua-nghin-tuoi-248898.html',
      source: 'https://vi.wikipedia.org/wiki/Ch%C3%B9a_C%E1%BA%A7n_Linh',
      map: 'https://www.openstreetmap.org/?mlat=18.66208&mlon=105.6608#map=18/18.66208/105.6608',
      build: chuaCanLinh
    },
    {
      id: 'den-hong-son', name: 'Đền Hồng Sơn', city: 'Vinh', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.671850, lat: 18.661350, start: [105.672128, 18.661467], yaw: 1.988,
      width: 26, depth: 25,
      solids: [[0, -4.2, 9.2, 5.8], [0, 8.4, 2.7, 2.7], [-9.2, 1.4, 1.8, 1.8], [9.2, 1.4, 1.8, 1.8]],
      description: 'Võ Miếu cổ kính của thành Vinh xưa bên dòng sông Cửa Tiền với Giếng Ngọc hình vuông trước sân gạch đỏ, hai nhà bia và chính điện hai tầng mái cong.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://visitnghean.gov.vn/',
      map: 'https://www.openstreetmap.org/?mlat=18.66135&mlon=105.67185#map=18/18.66135/105.67185',
      build: denHongSon
    },
    {
      id: 'quang-truong-binh-minh-cua-lo', name: 'Quảng trường Bình Minh Cửa Lò', city: 'Cửa Lò', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.730407, lat: 18.797938, start: [105.730061, 18.797688], yaw: -0.921,
      width: 32, depth: 32,
      solids: [[0, -1.6, 3.8, 3.8]],
      description: 'Quảng trường biển trung tâm phố biển Cửa Lò bên đại lộ Bình Minh, nổi bật với cụm biểu tượng Hoa Cúc Biển vàng rực vươn cao trên sân khấu sóng biển và hàng dừa xanh.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://visitnghean.gov.vn/',
      map: 'https://www.openstreetmap.org/?mlat=18.797938&mlon=105.730407#map=18/18.797938/105.730407',
      build: quangTruongBinhMinh
    },
    {
      id: 'den-nguyen-xi', name: 'Đền thờ Thái sư Nguyễn Xí', city: 'Nghi Lộc', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.701320, lat: 18.815220, start: [105.701375, 18.814856], yaw: 0.143,
      width: 28, depth: 26,
      solids: [[0, 0, 8.6, 5.4], [-8.4, 3.2, 2.2, 2.2], [8.4, 3.2, 2.2, 2.2], [-4.05, 10.6, 2.1, 0.8], [4.05, 10.6, 2.1, 0.8]],
      description: 'Di tích Quốc gia đặc biệt thờ khai quốc công thần triều Hậu Lê Cương Quốc Công Nguyễn Xí tại Khánh Hợp, gồm nghi môn tứ trụ, hai nhà bia và chính điện mái đao cổ kính.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://dsvh.gov.vn/',
      map: 'https://www.openstreetmap.org/?mlat=18.81522&mlon=105.70132#map=18/18.81522/105.70132',
      build: denNguyenXi
    },
    {
      id: 'den-vua-mai-hac-de', name: 'Đền thờ Vua Mai Hắc Đế', city: 'Nam Đàn', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.498250, lat: 18.702100, start: [105.498490, 18.702180], yaw: 1.908,
      width: 28, depth: 26,
      solids: [[0, -4.2, 9.4, 5.6], [-4.8, 6.2, 1.0, 1.3], [4.8, 6.2, 1.0, 1.3], ...A.archPiers(0, 10.4, 5.2, 1.62, 2.6)],
      description: 'Di tích Quốc gia đặc biệt tưởng niệm Vua Mai Thúc Loan dưới chân núi Đụn ở Nam Đàn, với tam quan son thiếp vàng, voi đá ngựa đá chầu sân và đền chính uy nghiêm.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://visitnghean.gov.vn/',
      map: 'https://www.openstreetmap.org/?mlat=18.7021&mlon=105.49825#map=18/18.7021/105.49825',
      build: denVuaMaiHacDe
    },
    {
      id: 'khu-luu-niem-phan-boi-chau', name: 'Khu lưu niệm Phan Bội Châu', city: 'Nam Đàn', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.502080, lat: 18.695700, start: [105.502177, 18.695453], yaw: 0.356,
      width: 28, depth: 22,
      solids: [[-3.8, -2.2, 7.4, 3.8], [8.4, 1.6, 1.31, 1.16]],
      description: 'Trong khu lưu niệm ở Nam Đàn, tượng đồng Phan Bội Châu cao 3,2 m đứng trên bệ đá xanh cao 2,2 m. Tay phải cụ cầm sách, tay trái buông, phía dưới tà áo dài lộ hai ống quần rộng.',
      photo: 'https://banquanlyditichnghean.gov.vn/article_details/tuong-dai-cu-phan-boi-chau-mot-cong-trinh-nghe-thuat-cua-the-he-con-chau-tri-an-nha-chi-sy',
      source: 'https://banquanlyditichnghean.gov.vn/article_details/tuong-dai-chi-sy-yeu-nuoc-phan-boi-chau-tai-khu-di-tich-luu-niem-phan-boi-chau-o-thi-tran-nam-dan-huyen-nam-dan',
      map: 'https://www.openstreetmap.org/?mlat=18.6957&mlon=105.50208#map=18/18.6957/105.50208',
      build: phanBoiChau
    },
    {
      id: 'den-qua-son', name: 'Đền Quả Sơn', city: 'Đô Lương', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.280400, lat: 18.935550, start: [105.280384, 18.935149], yaw: -0.037,
      width: 28, depth: 25,
      solids: [[0, 0, 8.2, 5.2], [-9.4, 2.4, 2.3, 2.3], [9.4, 2.4, 2.3, 2.3], ...A.archPiers(0, 9.6, 5.0, 1.55, 2.5)],
      description: 'Ngôi đền cổ đứng thứ hai trong "Nhất Cờn, nhì Quả, tam Bạch Mã, tứ Chiêu Trưng" tại Bồi Sơn, Đô Lương, thờ Uy Minh Vương Lý Nhật Quang với gác chuông gác trống cân xứng.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://visitnghean.gov.vn/',
      map: 'https://www.openstreetmap.org/?mlat=18.93555&mlon=105.2804#map=18/18.93555/105.2804',
      build: denQuaSon
    },
    {
      id: 'den-bach-ma-thanh-chuong', name: 'Đền Bạch Mã', city: 'Thanh Chương', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.335220, lat: 18.741080, start: [105.335220, 18.740740], yaw: 0.0,
      width: 26, depth: 25,
      solids: [[0, 0, 8.0, 5.0], [-5.2, 4.6, 1.0, 1.4], [5.2, 4.6, 1.0, 1.4], ...A.archPiers(0, 9.8, 4.8, 1.48, 2.4)],
      description: 'Di tích Quốc gia đặc biệt thuộc tứ đại đền thiêng xứ Nghệ tại Võ Liệt, Thanh Chương, thờ danh tướng Phan Đà với đôi tượng Bạch Mã uy nghiêm giữa sân gạch cổ.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://visitnghean.gov.vn/',
      map: 'https://www.openstreetmap.org/?mlat=18.74108&mlon=105.33522#map=18/18.74108/105.33522',
      build: denBachMa
    },
    {
      id: 'tuong-dai-xo-viet-hung-nguyen', name: 'Tượng đài Xô Viết Nghệ Tĩnh Thái Lão', city: 'Hưng Nguyên', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.629100, lat: 18.672000, start: [105.629041, 18.672364], yaw: -2.989,
      width: 28, depth: 24,
      solids: [[0, -1.2, 4.2, 3.0], [-7.8, -2.6, 3.8, 0.8], [7.8, -2.6, 3.8, 0.8]],
      description: 'Quảng trường và tượng đài ngọn lửa cách mạng tại thị trấn Hưng Nguyên ghi dấu cuộc biểu tình lịch sử ngày 12/9/1930 trong cao trào Xô Viết Nghệ Tĩnh.',
      photo: 'https://visitnghean.gov.vn/',
      source: 'https://visitnghean.gov.vn/',
      map: 'https://www.openstreetmap.org/?mlat=18.672&mlon=105.6291#map=18/18.672/105.6291',
      build: xoVietHungNguyen
    },
    {
      id: 'cau-yen-xuan', name: 'Cầu Yên Xuân', city: 'Hưng Nguyên', province: 'Nghệ An', region: 'Trung Bộ',
      lon: 105.602341, lat: 18.606268, start: [105.601970, 18.605340], yaw: 1.2074,
      viewAngle: 1.2074 + 0.62, viewElevation: 0.16,
      width: 232, depth: 15,
      solids: [], // Drive-through carriageway clear between trusses (`|z| >= 5.8`)
      description: 'Cây cầu giàn thép năm nhịp bắc qua dòng sông Lam nối Hưng Nguyên với Nam Đàn trên tuyến ĐT.542C, gắn liền với tuyến đường giao thông huyết mạch xứ Nghệ.',
      photo: 'https://vi.wikipedia.org/wiki/C%E1%BA%A7u_Y%C3%AAn_Xu%C3%A2n',
      source: 'https://vi.wikipedia.org/wiki/C%E1%BA%A7u_Y%C3%AAn_Xu%C3%A2n',
      map: 'https://www.openstreetmap.org/?mlat=18.606268&mlon=105.602341#map=17/18.606268/105.602341',
      build: cauYenXuan
    }
  );
})();

export default window.VietnamSights;
