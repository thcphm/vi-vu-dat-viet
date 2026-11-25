const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const A = window.CentralArch;

  // 1. Quảng trường Hồ Chí Minh (TP. Vinh) — tượng đài Bác Hồ & bức tường cánh sen đá
  function quangTruongHcmVinh(T, kit) {
    const { box, stamp, round, wavingFlag } = kit;
    const granite = 0xd6cab3, darkStone = 0x767067, redGranite = 0x7f2b22, lawn = 0x4f783d;
    kit.palette({stone: [granite, darkStone]});

    // Vast stepped granite ceremonial plaza & flanking lawn strips
    box(darkStone, 0, 0.25, 1.5, 34, 0.50, 26);
    box(granite, 0, 0.65, 0.5, 28, 0.36, 20);
    for (const s of [-1, 1]) box(lawn, s * 14.5, 0.54, 4.5, 4.2, 0.14, 15.5);
    A.steps(kit, 0, 11.2, 16, 1.8, 5, 0.16, 0.45, granite);

    // The low, planted rise behind the statue recalls Mount Chung in Nam Dan.
    const hill = new T.SphereGeometry(1,32,12,0,Math.PI*2,0,Math.PI*.51);
    stamp(hill,0x61714a,0,.1,-9.8,17,3.7,5.0);
    hill.dispose();
    A.trees(T,kit,[-1,1].flatMap(side=>[1,2,3].map(i=>({
      x:side*(3+i*3.25),z:-9.7+i*.62,h:4.1+i*.32,kind:'banyan'
    }))));

    // Stepped red-granite & pale-stone statue pedestal
    box(redGranite, 0, 1.9, -1.0, 8.8, 2.2, 6.2);
    box(granite, 0, 3.65, -1.0, 6.6, 1.5, 4.6);
    A.plaque(T, kit, 'QUẢNG TRƯỜNG HỒ CHÍ MINH', 0, 2.05, 2.16, 7.2, 0.96, { bg: '#7b221a', fg: '#f4d26e' });

    const figureStone = 0xcfc8b4;
    kit.palette({stone:[figureStone,redGranite]});
    A.statueFigure(T,kit,figureStone,0,4.4,-1,18,{jacket:true,beard:true,
      rightArm:[[-.135,.656,.004],[-.129,.49,.035],[-.127,.443,.047]],
      leftArm:[[.146,.653,.013],[.112,.608,.074],[.087,.595,.10]]});

    // Flagpole & national flag + ornamental palms
    stamp(round, 0xe0ddd4, -11.8, 8.5, 7.5, 0.14, 16.5, 0.14);
    stamp(round, 0xe0ddd4, 11.8, 8.5, 7.5, 0.14, 16.5, 0.14);
    wavingFlag(4.2, 2.8, -11.7, 16.6, 7.5);
    A.trees(T, kit, [
      { x: -14.8, z: -4.2, h: 7.2, kind: 'palm' }, { x: 14.8, z: -4.2, h: 7.5, kind: 'palm' },
      { x: -14.8, z: 2.2, h: 6.8, kind: 'palm' }, { x: 14.8, z: 2.2, h: 6.8, kind: 'palm' }
    ]);
  }

  // 2. Bảo tàng Xô Viết Nghệ Tĩnh (TP. Vinh)
  function baoTangXoVietNgheTinh(T, kit) {
    const { box, tapered } = kit;
    A.colonialBuilding(T, kit, {
      w: 28, d: 13.5, floors: 2, floorH: 4.1,
      wall: 0xe6d4ae, trim: 0xf4ecda, shutter: 0x6b2c22, roof: 0x993e2c,
      bays: 7, title: 'BẢO TÀNG XÔ VIẾT NGHỆ TĨNH',
      plaque: { bg: '#8a261e', fg: '#f6d573' }
    });
    // Forecourt revolutionary monument pylon ("Kiên cường bất khuất")
    box(0x7c766d, 0, 0.45, 11.4, 7.2, 0.9, 5.2);
    tapered(0xa93124, 0, 4.4, 11.4, 1.35, 0.42, 7.2, 0.72, 4);
    box(0xe5b842, 0, 8.2, 11.4, 0.75, 0.75, 0.25, 0, 0, Math.PI / 4);
    A.trees(T, kit, [{ x: -13.5, z: 9.5, h: 7.5, kind: 'banyan' }, { x: 13.5, z: 9.5, h: 7.5, kind: 'banyan' }]);
  }

  // 3. Cửa Tả Thành cổ Vinh (Cổng Đông)
  function cuaTaThanhVinh(T, kit) {
    const { box, stamp, profile, round } = kit;
    const laterite = [0x8d5b44, 0x9b684d, 0x7e533e, 0xa37154];
    const mortar = 0xb8ab95, plaster = 0xcfc4a6, tile = 0x6f4335, timber = 0x5c2c20;
    kit.palette({plaster, tile, timber});

    A.vaultedBay(T, kit, 0, 0, 12.8, 4.9, 2.15, 2.45, 6.8, laterite[0], mortar, 0x645e56);
    for (const s of [-1, 1]) {
      const wing = new T.Shape();
      wing.moveTo(-3.6, 0); wing.lineTo(3.6, 0); wing.lineTo(2.9, 4.45); wing.lineTo(-2.9, 4.45); wing.closePath();
      profile(wing, laterite[1], s * 9.2, 0, -2.2, 4.4);
      box(mortar, s * 9.2, 4.55, 0, 6.6, 0.22, 4.65);
      for (let i = -2; i <= 2; i++) box(laterite[(i + 4) % 4], s * 9.2 + i * 1.25, 5.05, 2.1, 0.65, 0.82, 0.44);
      for (let row = 0; row < 5; row++) for (let col = 0; col < 4; col++) {
        box(laterite[(row + col) % 4], s * (2.9 + col * 2.1), 0.45 + row * 0.82, 3.44, 1.98, 0.72, 0.10);
      }
    }
    box(mortar, 0, 5.02, 0, 13.4, 0.28, 7.3);
    for (const f of [-1, 1]) for (let i = -4; i <= 4; i++) box(plaster, i * 1.45, 5.54, f * 3.42, 0.74, 0.82, 0.34);
    A.plaque(T, kit, 'CỬA TẢ', 0, 4.55, 3.48, 2.8, 0.62);

    // Watch pavilion atop Cửa Tả
    box(plaster, 0, 6.72, 0, 6.6, 2.55, 3.6);
    for (const x of [-3.6, -1.4, 1.4, 3.6]) for (const z of [-2.1, 2.1]) stamp(round, timber, x, 6.72, z, 0.18, 2.65, 0.18);
    for (const f of [-1, 1]) for (const dx of [-1.8, 0, 1.8]) box(timber, dx, 6.65, f * 1.84, 1.12, 1.95, 0.10);
    A.curvedRoof(T, kit, 0, 8.02, 0, 9.8, 6.2, 1.65, tile, mortar, plaster, 0.30, { dragons: true });
  }

  // 4. Cửa Hữu Thành cổ Vinh (Cổng Tây)
  function cuaHuuThanhVinh(T, kit) {
    const { box, stamp, profile, round } = kit;
    const laterite = [0x885741, 0x946349, 0x79503b, 0x9e6d50];
    const mortar = 0xb4a790, plaster = 0xcbbda0, tile = 0x6b4133, timber = 0x58291e;
    kit.palette({plaster, tile, timber});

    // Stone approach causeway
    box(0x888176, 0, 0.16, 6.6, 5.8, 0.32, 6.8);
    for (const s of [-1, 1]) box(mortar, s * 2.75, 0.58, 6.6, 0.34, 0.56, 6.6);
    A.vaultedBay(T, kit, 0, 0, 12.6, 4.85, 2.10, 2.42, 6.6, laterite[0], mortar, 0x615c54);
    for (const s of [-1, 1]) {
      const wing = new T.Shape();
      wing.moveTo(-3.4, 0); wing.lineTo(3.4, 0); wing.lineTo(2.7, 4.4); wing.lineTo(-2.7, 4.4); wing.closePath();
      profile(wing, laterite[2], s * 9.0, 0, -2.1, 4.2);
      box(mortar, s * 9.0, 4.5, 0, 6.2, 0.22, 4.45);
      for (let i = -2; i <= 2; i++) box(laterite[(i + 3) % 4], s * 9.0 + i * 1.2, 5.0, 1.95, 0.62, 0.80, 0.42);
    }
    box(mortar, 0, 4.98, 0, 13.2, 0.28, 7.1);
    for (const f of [-1, 1]) for (let i = -4; i <= 4; i++) box(plaster, i * 1.42, 5.48, f * 3.35, 0.72, 0.80, 0.32);
    A.plaque(T, kit, 'CỬA HỮU', 0, 4.52, 3.38, 2.8, 0.62);

    box(plaster, 0, 6.68, 0, 6.4, 2.5, 3.5);
    for (const x of [-3.5, -1.35, 1.35, 3.5]) for (const z of [-2.05, 2.05]) stamp(round, timber, x, 6.68, z, 0.18, 2.6, 0.18);
    A.curvedRoof(T, kit, 0, 7.95, 0, 9.6, 6.0, 1.60, tile, mortar, plaster, 0.30, { dragons: true });
  }

  // 5. Đền thờ Hoàng đế Quang Trung (Núi Dũng Quyết)
  function denThoQuangTrung(T, kit) {
    const { box } = kit;
    // Broad hilltop granite terrace & dragon stairs
    box(0x8e877c, 0, 0.55, 1.2, 26, 1.1, 20);
    A.vietnameseHall(T, kit, {
      w: 19, d: 11.2, baseH: 1.65, colH: 3.9, bays: 5,
      wall: 0xe6d3a5, wood: 0x6c2419, tile: 0xa6412b, ridge: 0xd9b35a, eave: 0xd9ad4a,
      doubleTier: true, atticColor: 0x8a281d,
      title: 'ĐỀN THỜ HOÀNG ĐẾ QUANG TRUNG',
      plaque: { bg: '#7c1e16', fg: '#f8d872' }
    });
    // Flanking stone stele pavilions (nhà bia tả hữu)
    for (const s of [-1, 1]) {
      box(0x918a7f, s * 11.8, 1.0, 5.8, 3.4, 0.8, 3.4);
      box(0x4a4640, s * 11.8, 2.25, 5.8, 0.95, 1.75, 0.24);
      A.curvedRoof(T, kit, s * 11.8, 3.35, 5.8, 4.0, 4.0, 1.05, 0xa6412b, 0xd9b35a, 0xd9ad4a, 0.18);
    }
    A.trees(T, kit, [
      { x: -13.2, z: -5.5, h: 10.5, kind: 'pine' }, { x: 13.2, z: -5.5, h: 11.2, kind: 'pine' },
      { x: -14.0, z: 0.5, h: 9.2, kind: 'pine' }, { x: 14.0, z: 0.5, h: 9.6, kind: 'pine' }
    ]);
  }

  // 6. Chùa Đại Tuệ (Núi Đại Huệ, Nam Đàn)
  function chuaDaiTue(T, kit) {
    // Grand mountaintop two-tier main sanctuary + 5-tier octagonal Dai Tue stupa
    A.vietnameseHall(T, kit, {
      w: 17.5, d: 10.5, baseH: 1.35, colH: 3.8, bays: 5,
      wall: 0xe5d3aa, wood: 0x63271a, tile: 0x993f2b, ridge: 0xd8b45c, eave: 0xd4a948,
      doubleTier: true, atticColor: 0x862b1f,
      title: 'CHÙA ĐẠI TUỆ',
      plaque: { bg: '#6e2118', fg: '#f7d674' }
    });
    A.octagonalTower(T, kit, 12.6, -1.2, {
      tiers: 5, baseR: 3.1, tierH: 2.05, wall: 0xdfd0ad, tile: 0x993f2b, trim: 0xd1a74b
    });
    A.trees(T, kit, [
      { x: -12.5, z: -4.2, h: 11.0, kind: 'pine' }, { x: -13.2, z: 3.5, h: 9.5, kind: 'pine' },
      { x: 15.8, z: -6.0, h: 10.2, kind: 'pine' }
    ]);
  }

  // 7. Khu lăng mộ Bà Hoàng Thị Loan (Núi Động Tranh, Nam Đàn)
  function moBaHoangThiLoan(T, kit) {
    const { box, outline, stamp, round } = kit;
    const granite = 0xd6cfc2, darkStone = 0x7f7970, marble = 0xede7db, lotus = 0xc5a87a;
    kit.palette({stone: [granite, darkStone, marble]});

    // Ascending granite hillside sanctuary terrace
    box(darkStone, 0, 0.42, 0, 22, 0.84, 20);
    A.steps(kit, 0, 9.2, 11.5, 2.4, 6, 0.16, 0.45, granite);
    // Low stone balustrades flanking the terrace
    for (const s of [-1, 1]) {
      box(granite, s * 10.6, 1.25, 0, 0.45, 0.85, 19.4);
      for (let z = -8.5; z <= 8.5; z += 3.4) box(darkStone, s * 10.6, 1.55, z, 0.62, 1.15, 0.62);
    }

    // Iconic stylized curved weaving-loom canopy (khung cửi dệt vải cách điệu) overarching the tomb
    const archShape = [
      [-6.8, 0], [-6.2, 3.6], [-4.2, 6.2], [0, 7.6], [4.2, 6.2], [6.2, 3.6], [6.8, 0],
      [5.5, 0], [5.0, 3.1], [3.3, 5.2], [0, 6.3], [-3.3, 5.2], [-5.0, 3.1], [-5.5, 0]
    ];
    for (const zOff of [-3.4, 0.0, 3.4]) {
      outline(archShape, granite, 0, 0.84, zOff - 0.42, 0.84);
    }
    // Connecting longitudinal ribbed weaving-loom beams across the top
    for (const [rx, ry] of [[-4.8, 5.3], [-2.5, 6.7], [0, 7.3], [2.5, 6.7], [4.8, 5.3]]) {
      box(lotus, rx, 0.84 + ry, 0, 0.55, 0.34, 8.2);
    }

    // Stepped marble tomb & floral incense altar beneath the canopy
    box(darkStone, 0, 1.32, -0.4, 5.6, 0.96, 6.8);
    box(marble, 0, 2.02, -0.8, 3.4, 0.68, 4.4);
    box(0x6e241b, 0, 2.55, -2.7, 2.4, 1.25, 0.28);
    stamp(round, 0x5c4f3d, 0, 1.98, 4.2, 0.72, 0.76, 0.72);
    A.plaque(T, kit, 'MỘ BÀ HOÀNG THỊ LOAN', 0, 2.55, -2.52, 2.25, 0.58, { bg: '#6e231a', fg: '#f6d575' });

    A.trees(T, kit, [
      { x: -12.5, z: -6.5, h: 11.5, kind: 'pine' }, { x: 12.5, z: -6.5, h: 10.8, kind: 'pine' },
      { x: -13.0, z: 2.0, h: 9.8, kind: 'pine' }, { x: 13.0, z: 2.0, h: 10.2, kind: 'pine' }
    ]);
  }

  // 8. Quê ngoại Hoàng Trù (Kim Liên, Nam Đàn)
  function queNgoaiHoangTru(T, kit) {
    const { box, stamp, outline, round } = kit;
    const thatch = [0xb39a6e, 0xa4895e, 0x987f56], timber = 0x563f2e, bamboo = 0x87724d;
    kit.palette({timber: [timber, bamboo]});

    // Earthen village courtyard & hibiscus hedge
    box(0xba9f78, 0, 0.08, 1.2, 20.5, 0.16, 15.5);
    for (const [hx, hz, hw, hd] of [[-5.2, 8.8, 8.8, 0.68], [5.8, 8.8, 7.6, 0.68], [-9.9, 1.2, 0.68, 15.2], [9.9, 1.2, 0.68, 15.2], [0, -6.2, 20.4, 0.68]]) {
      box(0x3f6632, hx, 0.68, hz, hw, 1.2, hd);
    }

    // Main 3-bay thatched house (Nhà thờ cụ Hoàng Xuân Đường)
    box(0x8e7c64, -1.6, 0.22, -2.0, 11.6, 0.28, 5.8);
    box(0x907b5d, -1.6, 1.42, -3.6, 10.8, 2.2, 0.20);
    for (const x of [-6.4, -3.2, 0, 3.2]) for (const z of [-3.4, -1.9, 0.1]) {
      stamp(round, timber, x, 1.55, z, 0.12, 2.4, 0.12);
    }
    outline([[-3.25, 0], [0, 2.45], [3.25, 0], [3.25, -0.32], [0, 2.12], [-3.25, -0.32]],
      thatch[0], -7.8, 2.42, -2.0, 12.4, Math.PI / 2);
    box(0x7c6642, -1.6, 4.92, -2.0, 12.5, 0.24, 0.36);

    // Adjacent 3-bay thatched birthplace cottage of Bác Hồ on the right (+X)
    box(0x8c7b64, 6.2, 0.20, 2.6, 4.2, 0.24, 7.2);
    box(0x8e7859, 7.8, 1.22, 2.6, 0.22, 1.9, 6.6);
    outline([[-2.45, 0], [0, 1.85], [2.45, 0], [2.45, -0.28], [0, 1.56], [-2.45, -0.28]],
      thatch[1], 6.2, 2.08, -1.2, 7.6);
    box(0x7c6642, 6.2, 3.98, 2.6, 0.30, 0.20, 7.65);

    // Rustic bamboo gate & plaque
    for (const s of [-1, 1]) stamp(round, timber, 0.4 + s * 1.25, 1.35, 8.8, 0.14, 2.7, 0.14);
    outline([[-0.88, 0], [0, 0.68], [0.88, 0], [0.88, -0.15], [0, 0.54], [-0.88, -0.15]], thatch[2], -1.2, 2.62, 8.8, 3.2, Math.PI / 2);
    A.plaque(T, kit, 'QUÊ NGOẠI HOÀNG TRÙ', 0.4, 2.95, 9.55, 3.4, 0.58, { bg: '#f2e1b2', fg: '#6b3320' });
    A.trees(T, kit, [
      { x: -6.8, z: 5.4, h: 6.4, kind: 'palm' }, { x: -8.2, z: 1.5, h: 6.8, kind: 'palm' },
      { x: 4.5, z: -4.2, h: 6.2, kind: 'palm' }, { x: -4.2, z: 6.2, h: 5.9, kind: 'palm' }
    ]);
  }

  // 9. Đền Cờn (Quỳnh Phương, Hoàng Mai)
  function denConQuynhPhuong(T, kit) {
    // Famous coastal Tam Quan + Main Hall ensemble
    A.tamQuan(T, kit, {
      wall: 0xdccaa1, trim: 0xbda06d, tile: 0x8f3f2c, ridge: 0xd8c499, eave: 0xd1a44d,
      wCenter: 5.2, wSide: 3.8, depth: 2.8, hCenter: 4.8, hSide: 3.4, twoTierSides: true,
      title: 'ĐỀN CỜN'
    });
    // Main crimson coastal sanctuary slightly behind the Tam Quan
    const { box, stamp, round } = kit;
    box(0x90887b, 0, 0.45, -8.5, 15.2, 0.9, 8.4);
    box(0xdccaa2, 0, 2.65, -8.8, 13.8, 3.5, 6.8);
    for (const x of [-5.8, -2.9, 0, 2.9, 5.8]) stamp(round, 0x62241a, x, 2.65, -5.2, 0.17, 3.5, 0.17);
    A.curvedRoof(T, kit, 0, 4.4, -8.5, 16.4, 9.2, 2.35, 0x8f3f2c, 0xd8c499, 0xd1a44d, 0.30, { dragons: true });
    A.trees(T, kit, [{ x: -10.5, z: -3.5, h: 8.5, kind: 'banyan' }, { x: 10.5, z: -3.5, h: 7.2, kind: 'palm' }]);
  }

  // 10. Hải đăng Cửa Hội (Cửa Lò)
  function haiDangCuaHoi(T, kit) {
    A.lighthouse(T, kit, {
      h: 19, rBase: 2.5, rTop: 1.65, body: 0xf0ece0, band: 0xb93728, dome: 0xa22c22,
      striped: true, title: 'HẢI ĐĂNG CỬA HỘI'
    });
  }

  // 11. Cầu Cửa Hội (Vinh – Nghi Xuân, sông Lam)
  function cauCuaHoi(T, kit) {
    A.cableStayedBridge(T, kit, {
      len: 360, w: 19.5, pylonH: 48, pylonXs: [-82, 82],
      pylonColor: 0xe9e4d9, cableColor: 0xd5dcde, accent: 0x267486,
      aFrame: true, cables: 9, cableReach: 82
    });
  }

  // 12. Cầu Bến Thủy 1 (TP. Vinh – Nghi Xuân, QL1A)
  function cauBenThuy(T, kit) {
    A.steelTrussBridge(T, kit, {
      len: 230, w: 13.5, spans: 4, archH: 10.5,
      steel: 0x5c7580, steelDark: 0x3f545e, pierColor: 0x9a9488, arched: true
    });
  }

  // 13. Nhà thờ chính tòa Xã Đoài (Nghi Diên, Nghi Lộc)
  function nhaThoXaDoai(T, kit) {
    A.gothicChurch(T, kit, {
      w: 17.5, d: 36, naveH: 11.5, towerH: 27, twinTowers: true,
      wall: 0xe6d8bd, trim: 0xf6f0e2, roof: 0x994230, dark: 0x332b26,
      title: 'NHÀ THỜ CHÍNH TÒA XÃ ĐOÀI'
    });
  }

  // 14. Đình Trung Cần (Nam Đàn — Di tích Quốc gia)
  function dinhTrungCan(T, kit) {
    A.vietnameseHall(T, kit, {
      w: 18.5, d: 11.5, baseH: 0.95, colH: 3.1, bays: 5,
      wall: 0xc9b492, wood: 0x4b2a1c, tile: 0x7a4232, ridge: 0xb9aa92, eave: 0xa99272,
      doubleTier: false, title: 'ĐÌNH TRUNG CẦN',
      plaque: { bg: '#5a2419', fg: '#f3d478' }
    });
    A.trees(T, kit, [
      { x: -12.8, z: 3.2, h: 10.5, kind: 'banyan' },
      { x: 12.5, z: -2.0, h: 7.4, kind: 'palm' }
    ]);
  }

  // 15. Khu di tích lịch sử Truông Bồn (Đô Lương)
  function tuongDaiTruongBon(T, kit) {
    A.memorialMonument(T, kit, {
      plazaW: 26, plazaD: 20, h: 17, style: 'flame',
      stone: 0xc8c1b4, darkStone: 0x736e66, accent: 0xb33426, bronze: 0x624d36,
      title: 'KHU DI TÍCH TRUÔNG BỒN'
    });
    A.trees(T, kit, [
      { x: -14.2, z: -6.5, h: 10.5, kind: 'pine' }, { x: 14.2, z: -6.5, h: 10.2, kind: 'pine' },
      { x: -13.8, z: 3.0, h: 9.0, kind: 'pine' }, { x: 13.8, z: 3.0, h: 9.2, kind: 'pine' }
    ]);
  }

  // 16. Bảo tàng Quân khu 4 (Đường Lê Duẩn, TP. Vinh)
  function baoTangQuanKhu4(T, kit) {
    const { box, stamp, round } = kit;
    A.colonialBuilding(T, kit, {
      w: 30, d: 14, floors: 2, floorH: 4.3,
      wall: 0xe6d6b0, trim: 0xf4eee0, shutter: 0x355c44, roof: 0x993f2c,
      bays: 7, title: 'BẢO TÀNG QUÂN KHU 4',
      plaque: { bg: '#7f241c', fg: '#f6d470' }
    });
    // Outdoor commemorative tank display plinth in forecourt
    box(0x88837a, -6.5, 0.35, 11.2, 6.8, 0.7, 4.2);
    box(0x475c3e, -6.5, 1.15, 11.2, 4.8, 0.9, 2.6);
    box(0x374730, -6.5, 1.0, 12.5, 4.9, 0.65, 0.45);
    box(0x374730, -6.5, 1.0, 9.9, 4.9, 0.65, 0.45);
    stamp(round, 0x4f6645, -6.2, 1.85, 11.2, 1.15, 0.75, 1.15);
    box(0x3e5236, -3.5, 1.92, 11.2, 4.2, 0.16, 0.16);
    // Victory star & flagpole on right
    box(0x88837a, 6.5, 0.45, 11.2, 4.4, 0.9, 4.4);
    kit.tapered(0xa93124, 6.5, 3.6, 11.2, 0.95, 0.35, 5.4, 1, 4);
  }

  const sights = [
    {
      id: 'quang-truong-hcm-vinh', name: 'Quảng trường Hồ Chí Minh', city: 'TP. Vinh', province: 'Nghệ An',
      lon: 105.69195, lat: 18.66935, yaw: 2.746, width: 34, depth: 26,
      start: [105.692042, 18.669560], viewDistance: 1200,
      map: 'https://www.openstreetmap.org/#map=18/18.66935/105.69195',
      source: 'https://dulichnghean.gov.vn/',
      build: quangTruongHcmVinh
    },
    {
      id: 'bao-tang-xo-viet-nghe-tinh', name: 'Bảo tàng Xô Viết Nghệ Tĩnh', city: 'TP. Vinh', province: 'Nghệ An',
      lon: 105.669381, lat: 18.672078, yaw: 2.895, width: 29, depth: 24,
      start: [105.669490, 18.672490],
      map: 'https://www.openstreetmap.org/node/5344833035',
      source: 'https://btxvnt.org.vn/',
      build: baoTangXoVietNgheTinh
    },
    {
      id: 'cua-ta-thanh-vinh', name: 'Cửa Tả Thành cổ Vinh', city: 'TP. Vinh', province: 'Nghệ An',
      lon: 105.67215, lat: 18.67070, yaw: -1.396, width: 24, depth: 9,
      start: [105.671929, 18.670663],
      solids: [...A.archPiers(0, 0, 12.8, 2.15, 6.8), [-9.2, 0, 3.4, 2.3], [9.2, 0, 3.4, 2.3]],
      map: 'https://www.openstreetmap.org/#map=18/18.67070/105.67215',
      source: 'https://dsvh.gov.vn/',
      build: cuaTaThanhVinh
    },
    {
      id: 'cua-huu-thanh-vinh', name: 'Cửa Hữu Thành cổ Vinh', city: 'TP. Vinh', province: 'Nghệ An',
      lon: 105.66675, lat: 18.67065, yaw: -2.072, width: 24, depth: 12,
      start: [105.666631, 18.670712],
      solids: [...A.archPiers(0, 0, 12.6, 2.10, 6.6), [-9.0, 0, 3.2, 2.2], [9.0, 0, 3.2, 2.2]],
      map: 'https://www.openstreetmap.org/#map=18/18.67065/105.66675',
      source: 'https://dsvh.gov.vn/',
      build: cuaHuuThanhVinh
    },
    {
      id: 'den-tho-quang-trung', name: 'Đền thờ Hoàng đế Quang Trung', city: 'TP. Vinh', province: 'Nghệ An',
      lon: 105.69960, lat: 18.64580, yaw: 0.723, width: 28, depth: 20,
      start: [105.699965, 18.645407], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/#map=17/18.64580/105.69960',
      source: 'https://dulichnghean.gov.vn/',
      build: denThoQuangTrung
    },
    {
      id: 'chua-dai-tue', name: 'Chùa Đại Tuệ', city: 'Nam Đàn', province: 'Nghệ An',
      lon: 105.535647, lat: 18.758028, yaw: 0.409, width: 32, depth: 18,
      start: [105.535710, 18.757890], viewDistance: 1300,
      map: 'https://www.openstreetmap.org/node/10723109605',
      source: 'https://dulichnghean.gov.vn/',
      build: chuaDaiTue
    },
    {
      id: 'mo-ba-hoang-thi-loan', name: 'Mộ bà Hoàng Thị Loan', city: 'Nam Đàn', province: 'Nghệ An',
      lon: 105.584309, lat: 18.708251, yaw: 0.257, width: 24, depth: 22,
      start: [105.584358, 18.708072], viewDistance: 1150,
      map: 'https://www.openstreetmap.org/way/241936050',
      source: 'https://kimlienmuseum.org.vn/',
      build: moBaHoangThiLoan
    },
    {
      id: 'que-ngoai-hoang-tru', name: 'Quê ngoại Hoàng Trù', city: 'Nam Đàn', province: 'Nghệ An',
      lon: 105.55442, lat: 18.66918, yaw: 1.50, width: 21, depth: 16,
      start: [105.554625, 18.669207],
      map: 'https://www.openstreetmap.org/#map=18/18.66918/105.55442',
      source: 'https://kimlienmuseum.org.vn/',
      build: queNgoaiHoangTru
    },
    {
      id: 'den-con-quynh-phuong', name: 'Đền Cờn', city: 'Hoàng Mai', province: 'Nghệ An',
      lon: 105.73681, lat: 19.23084, yaw: 1.05, width: 22, depth: 20,
      start: [105.736980, 19.230740],
      map: 'https://www.openstreetmap.org/node/4349411090',
      source: 'https://dulichnghean.gov.vn/',
      build: denConQuynhPhuong
    },

    {
      id: 'cau-cua-hoi', name: 'Cầu Cửa Hội', city: 'Cửa Lò – Nghi Xuân', province: 'Nghệ An',
      lon: 105.746905, lat: 18.751042, yaw: -0.6426, width: 260, depth: 23,
      viewAngle: 0.22, viewElevation: 0.22,
      start: [105.746873, 18.751001], viewDistance: 1700,
      solids: [[0, -10.8, 180, 0.8], [0, 10.8, 180, 0.8]],
      map: 'https://www.openstreetmap.org/#map=16/18.75104/105.74691',
      source: 'https://dulichnghean.gov.vn/',
      build: cauCuaHoi
    },
    {
      id: 'cau-ben-thuy', name: 'Cầu Bến Thủy', city: 'TP. Vinh', province: 'Nghệ An',
      lon: 105.708545, lat: 18.646380, yaw: -0.5410, width: 170, depth: 16,
      viewAngle: 0.28, viewElevation: 0.22,
      start: [105.708545, 18.646380], viewDistance: 1500,
      solids: [[0, -7.2, 115, 0.7], [0, 7.2, 115, 0.7]],
      map: 'https://www.openstreetmap.org/#map=16/18.64638/105.70855',
      source: 'https://dulichnghean.gov.vn/',
      build: cauBenThuy
    },
    {
      id: 'nha-tho-chinh-toa-xa-doai', name: 'Nhà thờ chính tòa Xã Đoài', city: 'Nghi Lộc', province: 'Nghệ An',
      lon: 105.66246, lat: 18.76760, yaw: 1.54, width: 20, depth: 40,
      start: [105.662702, 18.767597], viewDistance: 1200,
      map: 'https://www.openstreetmap.org/#map=17/18.76760/105.66246',
      source: 'https://dulichnghean.gov.vn/',
      build: nhaThoXaDoai
    },
    {
      id: 'dinh-trung-can', name: 'Đình Trung Cần', city: 'Nam Đàn', province: 'Nghệ An',
      lon: 105.579270, lat: 18.603496, yaw: -1.535, width: 24, depth: 16,
      start: [105.579029, 18.603488],
      map: 'https://www.openstreetmap.org/way/1564813304',
      source: 'https://dsvh.gov.vn/',
      build: dinhTrungCan
    },
    {
      id: 'tuong-dai-truong-bon', name: 'Khu di tích Truông Bồn', city: 'Đô Lương', province: 'Nghệ An',
      lon: 105.396868, lat: 18.810669, yaw: -0.520, width: 28, depth: 22,
      start: [105.396733, 18.810445], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/node/5346677124',
      source: 'https://truongbon.vn/',
      build: tuongDaiTruongBon
    },
    {
      id: 'bao-tang-quan-khu-4', name: 'Bảo tàng Quân khu 4', city: 'TP. Vinh', province: 'Nghệ An',
      lon: 105.694656, lat: 18.657962, yaw: 2.241, width: 32, depth: 24,
      start: [105.695283, 18.658435],
      map: 'https://www.openstreetmap.org/node/9401725185',
      source: 'https://baotangquankhu4.vn/',
      build: baoTangQuanKhu4
    }
  ];

  window.VietnamSights = (window.VietnamSights || []).concat(sights);
})();
export default window.VietnamSights;
