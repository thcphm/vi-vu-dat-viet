'use strict';
(() => {
  const A = window.CentralArch;

  // 1. Cầu Sông Hàn (Đà Nẵng) — cầu quay dây văng duy nhất Việt Nam
  function cauSongHan(T, kit) {
    const { stamp, round } = kit;
    // Iconic wide circular central turntable pier under the swing span
    stamp(round, 0x8f8c83, 0, -4.6, 0, 9.8, 6.8, 9.8);
    stamp(round, 0x2d7794, 0, -1.35, 0, 10.4, 0.5, 10.4);
    A.cableStayedBridge(T, kit, {
      len: 260, w: 12.6, pylonH: 38, pylonXs: [0],
      pylonColor: 0xe6e4dc, cableColor: 0xc8dce6, accent: 0x257a99,
      aFrame: true, cables: 10, cableReach: 108
    });
  }

  // 2. Cầu Trần Thị Lý (Đà Nẵng) — trụ tháp nghiêng 12° hình cánh buồm
  function cauTranThiLy(T, kit) {
    A.cableStayedBridge(T, kit, {
      len: 320, w: 27.5, pylonH: 56, pylonXs: [0],
      pylonColor: 0xeeeae0, cableColor: 0xd6dee0, accent: 0xc24930,
      centralMast: true, tilt: 0.21, fanEdges: true, cables: 11, cableReach: 135
    });
  }

  // 3. Cầu Thuận Phước (Đà Nẵng) — cầu treo dây võng cửa sông Hàn
  function cauThuanPhuoc(T, kit) {
    A.suspensionBridge(T, kit, {
      len: 360, w: 19.0, towerX: 98, towerH: 48,
      towerColor: 0xe2dfd6, cableColor: 0xd98732, deckColor: 0x6f7d84
    });
  }

  // 4. Bảo tàng Điêu khắc Chăm Đà Nẵng (1915, kiến trúc Pháp – Chăm)
  function baoTangCham(T, kit) {
    const { box, outline, tapered } = kit;
    A.colonialBuilding(T, kit, {
      w: 32, d: 14.5, floors: 1, floorH: 5.6,
      wall: 0xf1e7ce, trim: 0xd8c398, shutter: 0x6f432b, roof: 0x9b4632,
      bays: 8, title: 'BẢO TÀNG ĐIÊU KHẮC CHĂM',
      plaque: { bg: '#913c28', fg: '#f8e3aa' }
    });
    // Signature Cham-style sculpted entrance pediment & sandstone corner stupas
    outline([[-4.8, 0], [-3.8, 1.8], [-2.2, 2.5], [0, 4.1], [2.2, 2.5], [3.8, 1.8], [4.8, 0]],
      0xdfcaa0, 0, 6.5, 7.6, 1.1);
    for (const s of [-1, 1]) {
      box(0xb59c76, s * 5.2, 1.4, 9.6, 1.6, 1.5, 1.6);
      tapered(0x9b4d35, s * 5.2, 2.75, 9.6, 0.72, 0.25, 1.3, 1, 4);
    }
    A.trees(T, kit, [{ x: -16.5, z: 7.5, h: 8.5, kind: 'banyan' }, { x: 16.5, z: 7.5, h: 8.2, kind: 'banyan' }]);
  }

  // 5. Thành Điện Hải (Đà Nẵng — Di tích Quốc gia đặc biệt)
  function thanhDienHai(T, kit) {
    const { box, stamp, round, profile } = kit;
    const brick = 0x8e4c38, brickDark = 0x723d2d, mortar = 0xc2b69e, plaster = 0xe3d6b8;
    kit.palette({brick, plaster});

    // Square Vauban fortress rampart front wall & flanking angled bastions
    A.vaultedBay(T, kit, 0, 0, 12.6, 5.2, 2.1, 2.5, 5.6, brick, mortar, 0x5c4f44);
    for (const s of [-1, 1]) {
      const wall = new T.Shape();
      wall.moveTo(-6.5, 0); wall.lineTo(6.5, 0); wall.lineTo(5.8, 4.6); wall.lineTo(-5.8, 4.6); wall.closePath();
      profile(wall, brickDark, s * 12.2, 0, -2.4, 4.8);
      box(mortar, s * 12.2, 4.72, 0, 12.0, 0.24, 5.0);
      for (let i = -4; i <= 4; i++) box(brick, s * 12.2 + i * 1.35, 5.25, 2.2, 0.72, 0.85, 0.45);
      // Corner bronze fortress cannon atop bastion parapet
      box(0x5a3b26, s * 15.2, 5.05, 0.6, 1.35, 0.55, 1.85);
      stamp(round, 0x353b3a, s * 15.2, 5.45, 1.2, 0.22, 2.4, 0.22, 0, Math.PI / 2);
    }
    // Parapet & curved gatehouse plaque
    box(mortar, 0, 5.32, 0, 13.2, 0.28, 6.2);
    for (let i = -4; i <= 4; i++) box(plaster, i * 1.4, 5.82, 2.85, 0.76, 0.78, 0.34);
    A.plaque(T, kit, 'THÀNH ĐIỆN HẢI', 0, 4.65, 2.92, 4.2, 0.74, { bg: '#efe2bc', fg: '#782b20' });
    A.curvedRoof(T, kit, 0, 6.25, 0, 8.8, 5.4, 1.45, 0x763f30, mortar, plaster, 0.28);
  }

  // 6. Nhà Trưng bày Hoàng Sa (Sơn Trà — hình tượng Con dấu chủ quyền)
  function nhaTrungBayHoangSa(T, kit) {
    const { box, stamp, round } = kit;
    const stone = 0xe3dfd5, darkGlass = 0x263c46, granite = 0x898780, crimson = 0xa92d22;
    kit.palette({stone: [stone, granite], glass: darkGlass});

    // Coastal stepped granite podium
    box(granite, 0, 0.55, 0, 26, 1.1, 20);
    A.steps(kit, 0, 9.5, 12, 2.2, 5, 0.22, 0.42, 0xa8a49a);

    // Recessed glazed lower gallery floor
    box(darkGlass, 0, 3.1, 0, 17.5, 4.1, 13.5);
    for (let x = -7.5; x <= 7.5; x += 2.5) box(stone, x, 3.1, 6.82, 0.24, 4.1, 0.22);

    // Cantilevered floating Sovereign Seal upper cube ("Con dấu chủ quyền")
    box(stone, 0, 8.4, 0, 22.5, 6.4, 17.0);
    // Vertical architectural louver fins across the cantilevered cube
    for (let x = -10.2; x <= 10.2; x += 1.2) {
      box(0xc9c4b8, x, 8.4, 8.58, 0.22, 5.6, 0.24);
      box(0xc9c4b8, x, 8.4, -8.58, 0.22, 5.6, 0.24);
    }
    // Red sovereign seal vertical band & golden emblem star on facade
    box(crimson, 0, 8.4, 8.66, 3.6, 5.4, 0.16);
    stamp(round, 0xe8be49, 0, 8.8, 8.78, 0.85, 0.14, 0.85, 0, Math.PI / 2);
    A.plaque(T, kit, 'NHÀ TRƯNG BÀY HOÀNG SA', 0, 5.55, 8.68, 8.8, 0.88, { bg: '#8a231b', fg: '#f6df88' });
    // Crown seal handle cap on roof
    box(0xc5c0b5, 0, 12.2, 0, 9.6, 1.2, 7.6);
  }

  // 7. Chùa Tam Thai – Ngũ Hành Sơn (Thủy Sơn)
  function chuaTamThai(T, kit) {
    const { stamp } = kit;
    // Craggy Ngũ Hành Sơn marble-limestone outcrops cradling the pagoda
    const rock = new T.DodecahedronGeometry(1, 1);
    for (const [rx, ry, rz, sx, sy, sz, c] of [
      [-11.5, 3.2, -5.5, 4.6, 4.8, 4.2, 0x939089],
      [11.8, 3.6, -5.2, 4.8, 5.2, 4.4, 0x8a8780],
      [0, 4.2, -10.2, 7.8, 6.2, 4.5, 0x9b978e],
      [-9.8, 1.8, 3.5, 2.8, 2.4, 2.6, 0x84817a]
    ]) {
      stamp(rock, c, rx, ry, rz, sx, sy, sz);
    }
    rock.dispose();
    A.tamQuan(T, kit, {
      wall: 0xe6d3a0, trim: 0xc4a265, tile: 0x993d2b, ridge: 0xd9c28e, eave: 0xd4a448,
      wCenter: 5.0, wSide: 3.6, depth: 2.6, hCenter: 4.7, hSide: 3.3, twoTierSides: false,
      title: 'CHÙA TAM THAI'
    });
    // Sanctuary hall nestled behind gate
    kit.box(0xe4d19f, 0, 2.8, -5.8, 12.4, 3.4, 5.8);
    A.curvedRoof(T, kit, 0, 4.5, -5.8, 14.5, 7.6, 2.1, 0x993d2b, 0xd9c28e, 0xd4a448, 0.30, { dragons: true });
    A.trees(T, kit, [{ x: -8.5, z: -2.0, h: 8.5, kind: 'banyan' }, { x: 9.0, z: -2.5, h: 8.0, kind: 'banyan' }]);
  }

  // 8. Hải đăng Quản Tượng (Bán đảo Sơn Trà)
  function haiDangQuanTuong(T, kit) {
    A.lighthouse(T, kit, {
      h: 17, rBase: 2.4, rTop: 1.65, body: 0xf1ece0, band: 0x3b6e5c, dome: 0x9e3226,
      striped: false, octagonal: true, title: 'HẢI ĐĂNG QUẢN TƯỢNG'
    });
  }

  // 9. Đình Túy Loan (Hòa Vang, Đà Nẵng)
  function dinhTuyLoan(T, kit) {
    const { box } = kit;
    A.vietnameseHall(T, kit, {
      w: 17.5, d: 11.0, baseH: 1.0, colH: 3.3, bays: 5,
      wall: 0xe2ce9e, wood: 0x56281c, tile: 0x8c4230, ridge: 0xd2bd92, eave: 0xc99c4a,
      doubleTier: false, title: 'ĐÌNH TÚY LOAN',
      plaque: { bg: '#6e231a', fg: '#f4d374' }
    });
    // Traditional spirit screen wall (bình phong long mã) in front yard
    box(0xd9c598, 0, 1.35, 9.6, 4.8, 2.2, 0.48);
    box(0x8c4230, 0, 2.58, 9.6, 5.2, 0.32, 0.72);
    A.trees(T, kit, [{ x: -12.0, z: 3.8, h: 10.5, kind: 'banyan' }, { x: 12.2, z: -2.5, h: 7.4, kind: 'palm' }]);
  }

  // 10. Đình Bồ Bản (Hòa Phong, Hòa Vang)
  function dinhBoBan(T, kit) {
    A.vietnameseHall(T, kit, {
      w: 16.2, d: 10.2, baseH: 0.95, colH: 3.2, bays: 5,
      wall: 0xe5d3a4, wood: 0x59261b, tile: 0x8f4331, ridge: 0xd6c298, eave: 0xcca14c,
      doubleTier: false, title: 'ĐÌNH BỒ BẢN'
    });
    // Flanking ceremonial pillars at forecourt entrance
    for (const s of [-1, 1]) {
      kit.box(0xdcc796, s * 3.6, 2.1, 8.8, 0.65, 3.8, 0.65);
      kit.tapered(0xc99c4a, s * 3.6, 4.35, 8.8, 0.42, 0.14, 0.65, 1, 4);
    }
    A.trees(T, kit, [{ x: -11.5, z: 2.2, h: 9.0, kind: 'banyan' }, { x: 11.5, z: 2.2, h: 7.5, kind: 'palm' }]);
  }

  // 11. Hội quán Triều Châu (Phố cổ Hội An)
  function hoiQuanTrieuChau(T, kit) {
    const { box, stamp } = kit;
    // Ornate Chaozhou ochre-and-jade glazed tile facade with red silk lanterns
    A.tamQuan(T, kit, {
      wall: 0xe8c764, trim: 0xc29346, tile: 0x2d6d5a, ridge: 0xdba94c, eave: 0xd9432e,
      wCenter: 5.2, wSide: 3.5, depth: 2.8, hCenter: 4.9, hSide: 3.5, twoTierSides: true,
      pillars: false, title: 'HỘI QUÁN TRIỀU CHÂU',
      plaque: { bg: '#8c221b', fg: '#f8d770' }
    });
    // Hanging glowing Hội An crimson silk lanterns across the entrance
    const orb = new T.SphereGeometry(0.32, 10, 8);
    for (const lx of [-4.4, -1.6, 1.6, 4.4]) {
      stamp(orb, 0xd83226, lx, 3.25, 1.75, 0.92, 1.18, 0.92);
    }
    orb.dispose();
    // Main assembly sanctuary behind courtyard
    box(0xe8c764, 0, 2.6, -7.2, 13.0, 3.6, 6.2);
    A.curvedRoof(T, kit, 0, 4.4, -7.2, 14.8, 7.8, 2.0, 0x2d6d5a, 0xdba94c, 0xd9432e, 0.30, { dragons: true });
  }

  // 12. Chợ Hội An (Phố cổ Hội An)
  function choHoiAn(T, kit) {
    const { box, outline } = kit;
    const ochre = 0xebc558, ochreDark = 0xd6ad43, tile = 0x8b4430, timber = 0x5c341f;
    kit.palette({plaster: ochre, tile, timber});

    // Heritage market hall with iconic triple ochre-yellow arched front gables
    box(0x9a9285, 0, 0.22, 0, 26, 0.44, 17);
    box(ochre, 0, 2.8, 0, 24.5, 4.8, 15.2);
    // Clerestory ventilation monitor roof above main roof
    A.gabledRoof(T, kit, 0, 5.2, 0, 25.0, 15.8, 3.4, tile, ochreDark, { alongX: true });
    box(ochre, 0, 8.6, 0, 18.0, 1.4, 5.2);
    A.gabledRoof(T, kit, 0, 9.3, 0, 18.6, 5.8, 1.5, tile, ochreDark, { alongX: true });

    // Iconic triple arched market portals & scalloped front gables facing the street
    for (const gx of [-7.5, 0, 7.5]) {
      const gw = gx === 0 ? 7.6 : 6.4;
      const gh = gx === 0 ? 6.8 : 5.6;
      box(ochre, gx, gh * 0.5, 7.85, gw, gh, 0.85);
      outline([[-gw * 0.52, 0], [0, gx === 0 ? 2.6 : 1.9], [gw * 0.52, 0]], ochre, gx, gh, 7.45, 0.85);
      box(0x2d231b, gx, 2.1, 8.32, gw * 0.54, 3.6, 0.12);
      box(timber, gx, 4.2, 8.38, gw * 0.72, 0.28, 0.24);
    }
    A.plaque(T, kit, 'CHỢ HỘI AN', 0, 6.2, 8.38, 5.6, 0.92, { bg: '#7d2a1d', fg: '#f8d774' });
  }

  // 13. Hải đăng Cửa Đại (Hội An)
  function haiDangCuaDai(T, kit) {
    A.lighthouse(T, kit, {
      h: 18, rBase: 2.35, rTop: 1.55, body: 0xf1ece0, band: 0xb93728, dome: 0x9e2d22,
      striped: true, title: 'HẢI ĐĂNG CỬA ĐẠI'
    });
  }

  // 14. Tháp Bằng An (Điện Bàn — tháp Chăm bát giác duy nhất Việt Nam)
  function thapBangAn(T, kit) {
    const { box } = kit;
    box(0x8a7e6e, 0, 0.28, 0, 16.5, 0.56, 18.5);
    A.chamTower(T, kit, 0, -1.2, { w: 7.2, h: 20.5, octagonal: true, tiers: 3 });
    // Iconic projecting sandstone-and-brick eastern vestibule (tiền sảnh dài)
    box(0xa7523a, 0, 3.2, 5.2, 4.4, 5.4, 5.8);
    box(0x2a1c17, 0, 2.3, 8.15, 1.85, 3.5, 0.15);
    box(0xc5b293, 0, 4.4, 8.2, 2.8, 0.45, 0.26);
    A.gabledRoof(T, kit, 0, 5.9, 5.2, 4.6, 6.0, 1.85, 0x8a422e, 0xc5b293);
    A.trees(T, kit, [{ x: -9.5, z: 2.5, h: 8.5, kind: 'banyan' }, { x: 9.5, z: -4.5, h: 7.5, kind: 'palm' }]);
  }

  // 15. Nhóm Tháp Chăm Khương Mỹ (Núi Thành — 3 tháp thẳng hàng)
  function thapKhuongMy(T, kit) {
    kit.box(0x8e806e, 0, 0.28, 0, 34, 0.56, 15);
    A.chamTower(T, kit, -10.5, 0, { w: 6.4, h: 15.5, tiers: 3, brick: 0xa85239 });
    A.chamTower(T, kit, 0, 0, { w: 7.4, h: 19.0, tiers: 3, brick: 0x9f4b33 });
    A.chamTower(T, kit, 10.5, 0, { w: 6.0, h: 14.2, tiers: 3, brick: 0xae583f });
    A.trees(T, kit, [{ x: -16.8, z: -5.2, h: 8.0, kind: 'banyan' }, { x: 16.8, z: -5.2, h: 7.5, kind: 'palm' }]);
  }

  // 16. Nhóm Tháp Chăm Chiên Đàn (Phú Ninh, Tam Kỳ — 3 tháp Chăm cổ)
  function thapChienDan(T, kit) {
    kit.box(0x8c7e6c, 0, 0.30, 0, 34, 0.60, 15.5);
    A.chamTower(T, kit, -10.2, 0.2, { w: 6.2, h: 14.8, tiers: 3, brick: 0xa44f36 });
    A.chamTower(T, kit, 0, -0.4, { w: 7.6, h: 19.5, tiers: 4, brick: 0x9b4830 });
    A.chamTower(T, kit, 10.2, 0.2, { w: 6.2, h: 15.2, tiers: 3, brick: 0xa75239 });
    A.trees(T, kit, [{ x: -16.5, z: 4.5, h: 8.2, kind: 'palm' }, { x: 16.5, z: 4.5, h: 8.5, kind: 'banyan' }]);
  }

  const sights = [
    {
      id: 'cau-song-han', name: 'Cầu Sông Hàn', city: 'Hải Châu – Sơn Trà', province: 'Đà Nẵng',
      lon: 108.226830, lat: 16.072155, yaw: 0.1356, width: 220, depth: 16,
      viewAngle: 0.72, viewElevation: 0.22,
      start: [108.22595, 16.07203], viewDistance: 1600,
      solids: [[0, -7.2, 130, 0.8], [0, 7.2, 130, 0.8]],
      map: 'https://www.openstreetmap.org/#map=17/16.07216/108.22683',
      source: 'https://danangfantasticity.com/',
      build: cauSongHan
    },
    {
      id: 'cau-tran-thi-ly', name: 'Cầu Trần Thị Lý', city: 'Hải Châu – Ngũ Hành Sơn', province: 'Đà Nẵng',
      lon: 108.230005, lat: 16.050320, yaw: 0.1410, width: 260, depth: 30,
      viewAngle: 0.78, viewElevation: 0.24,
      start: [108.22920, 16.05012], viewDistance: 1750,
      solids: [[0, -14.5, 160, 0.8], [0, 14.5, 160, 0.8], [0, 0, 1.5, 1.2]],
      map: 'https://www.openstreetmap.org/#map=17/16.05032/108.23001',
      source: 'https://danangfantasticity.com/',
      build: cauTranThiLy
    },
    {
      id: 'cau-thuan-phuoc', name: 'Cầu Thuận Phước', city: 'Hải Châu – Sơn Trà', province: 'Đà Nẵng',
      lon: 108.222165, lat: 16.095955, yaw: -2.6563, width: 280, depth: 22,
      viewAngle: -1.95, viewElevation: 0.24,
      start: [108.222165, 16.095955], viewDistance: 1850,
      solids: [[0, -10.4, 180, 0.8], [0, 10.4, 180, 0.8]],
      map: 'https://www.openstreetmap.org/#map=16/16.09596/108.22217',
      source: 'https://danangfantasticity.com/',
      build: cauThuanPhuoc
    },
    {
      id: 'bao-tang-cham-da-nang', name: 'Bảo tàng Điêu khắc Chăm', city: 'Hải Châu', province: 'Đà Nẵng',
      lon: 108.223168, lat: 16.060196, yaw: -2.365, width: 34, depth: 22,
      start: [108.222937, 16.060423],
      map: 'https://www.openstreetmap.org/way/302872188',
      source: 'https://chammuseum.vn/',
      build: baoTangCham
    },
    {
      id: 'thanh-dien-hai', name: 'Thành Điện Hải', city: 'Hải Châu', province: 'Đà Nẵng',
      lon: 108.221769, lat: 16.076354, yaw: -0.077, width: 36, depth: 12,
      start: [108.221720, 16.075740],
      solids: [...A.archPiers(0, 0, 12.6, 2.1, 5.6), [-12.2, 0, 6.2, 2.5], [12.2, 0, 6.2, 2.5]],
      map: 'https://www.openstreetmap.org/way/118609193',
      source: 'https://dsvh.gov.vn/',
      build: thanhDienHai
    },
    {
      id: 'nha-trung-bay-hoang-sa', name: 'Nhà Trưng bày Hoàng Sa', city: 'Sơn Trà', province: 'Đà Nẵng',
      lon: 108.251206, lat: 16.093469, yaw: 1.240, width: 26, depth: 20,
      start: [108.251452, 16.093388],
      map: 'https://www.openstreetmap.org/way/1474583779',
      source: 'https://hoangsa.danang.gov.vn/',
      build: nhaTrungBayHoangSa
    },
    {
      id: 'chua-tam-thai-ngu-hanh-son', name: 'Chùa Tam Thai – Ngũ Hành Sơn', city: 'Ngũ Hành Sơn', province: 'Đà Nẵng',
      lon: 108.264300, lat: 16.004050, yaw: 0.416, width: 28, depth: 24,
      start: [108.264630, 16.003330], viewDistance: 1300,
      map: 'https://www.openstreetmap.org/relation/8552348',
      source: 'https://nguhanhson.org/',
      build: chuaTamThai
    },
    
    {
      id: 'dinh-tuy-loan', name: 'Đình Túy Loan', city: 'Hòa Vang', province: 'Đà Nẵng',
      lon: 108.136467, lat: 15.997554, yaw: 2.909, width: 24, depth: 22,
      start: [108.136557, 15.997918],
      map: 'https://www.openstreetmap.org/way/1547483081',
      source: 'https://dsvh.gov.vn/',
      build: dinhTuyLoan
    },
    {
      id: 'dinh-bo-ban', name: 'Đình Bồ Bản', city: 'Hòa Vang', province: 'Đà Nẵng',
      lon: 108.151846, lat: 15.987912, yaw: 1.571, width: 22, depth: 20,
      start: [108.152020, 15.987912],
      map: 'https://www.openstreetmap.org/way/597505233',
      source: 'https://dsvh.gov.vn/',
      build: dinhBoBan
    },
    {
      id: 'hoi-quan-trieu-chau', name: 'Hội quán Triều Châu', city: 'Hội An', province: 'Đà Nẵng', formerProvince: 'Quảng Nam',
      lon: 108.333033, lat: 15.877906, yaw: 0.100, width: 16, depth: 18,
      start: [108.333054, 15.877700],
      map: 'https://www.openstreetmap.org/way/448044645',
      source: 'https://hoianheritage.net/',
      build: hoiQuanTrieuChau
    },
    {
      id: 'cho-hoi-an', name: 'Chợ Hội An', city: 'Hội An', province: 'Đà Nẵng', formerProvince: 'Quảng Nam',
      lon: 108.331680, lat: 15.877050, yaw: 1.776, width: 26, depth: 18,
      start: [108.332035, 15.877121],
      map: 'https://www.openstreetmap.org/#map=18/15.87705/108.33168',
      source: 'https://hoianheritage.net/',
      build: choHoiAn
    },
    
    {
      id: 'thap-bang-an', name: 'Tháp Bằng An', city: 'Điện Bàn', province: 'Đà Nẵng', formerProvince: 'Quảng Nam',
      lon: 108.232690, lat: 15.884516, yaw: -1.468, width: 18, depth: 20,
      start: [108.232228, 15.884470], viewDistance: 1200,
      map: 'https://www.openstreetmap.org/node/7520818185',
      source: 'https://dsvh.gov.vn/',
      build: thapBangAn
    },
    {
      id: 'thap-khuong-my', name: 'Tháp Chăm Khương Mỹ', city: 'Núi Thành', province: 'Đà Nẵng', formerProvince: 'Quảng Nam',
      lon: 108.504250, lat: 15.523650, yaw: -0.591, width: 35, depth: 16,
      start: [108.504000, 15.523290], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/#map=17/15.52365/108.50425',
      source: 'https://dsvh.gov.vn/',
      build: thapKhuongMy
    },
    {
      id: 'thap-chien-dan', name: 'Tháp Chăm Chiên Đàn', city: 'Phú Ninh', province: 'Đà Nẵng', formerProvince: 'Quảng Nam',
      lon: 108.458650, lat: 15.619450, yaw: -0.109, width: 35, depth: 16,
      start: [108.458600, 15.619010], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/#map=17/15.61945/108.45865',
      source: 'https://dsvh.gov.vn/',
      build: thapChienDan
    }
  ];

  window.VietnamSights = (window.VietnamSights || []).concat(sights);
})();