'use strict';
(() => {

  // 1. Chùa Thiên Ấn – Quảng Ngãi (Hilltop pagoda beside Trà Khúc River)
  function chuaThienAn(T, kit) {
    const {box, stamp, profile, round, tapered, sign} = kit;
    const ochre = 0xd6b874, cream = 0xece3ca, redTile = 0x9b402f, crimson = 0x7d2920;
    const stone = 0x8e897f, gold = 0xd4ad4a;
    kit.palette({plaster: [ochre, cream], stone});

    // Deep hilltop stone terrace
    box(stone, 0, -1.2, 0, 24.5, 2.8, 22.0);
    box(0xa59e90, 0, 0.28, 0, 23.2, 0.28, 20.8);

    // Front Tam Quan Gate (+Z)
    for (const [cx, w, h, r, sy] of [[0, 4.8, 4.6, 1.55, 2.2], [-4.4, 3.6, 3.3, 0.96, 1.6], [4.4, 3.6, 3.3, 0.96, 1.6]]) {
      const sh = new T.Shape();
      sh.moveTo(-w / 2, 0); sh.lineTo(-r, 0); sh.lineTo(-r, sy);
      sh.absarc(0, sy, r, Math.PI, 0, true);
      sh.lineTo(r, 0); sh.lineTo(w / 2, 0); sh.lineTo(w / 2, h); sh.lineTo(-w / 2, h); sh.closePath();
      profile(sh, ochre, cx, 0.42, 7.6, 1.8);
    }
    sign('CHÙA THIÊN ẤN', 0, 4.35, 9.48, 3.6, 0.55);
    window.CentralArch.curvedRoof(T, kit, 0, 5.0, 8.5, 6.2, 3.2, 1.05, redTile, cream, gold, 0.3);
    for (const s of [-1, 1]) window.CentralArch.curvedRoof(T, kit, s * 4.4, 3.7, 8.5, 4.4, 2.6, 0.78, redTile, cream, gold, 0.26);

    // Main Sanctuary Hall (Chính Điện) at rear (-Z)
    box(stone, 0, 0.75, -3.5, 16.0, 0.75, 9.4);
    box(ochre, 0, 3.1, -3.5, 13.8, 4.0, 7.2);
    for (const x of [-6.4, -3.2, 0, 3.2, 6.4]) stamp(round, crimson, x, 3.1, 0.65, 0.18, 4.1, 0.18);
    for (const dx of [-3.2, 0, 3.2]) box(crimson, dx, 2.65, 0.14, 1.85, 2.75, 0.1);
    window.CentralArch.curvedRoof(T, kit, 0, 5.15, -3.5, 16.8, 10.6, 2.05, redTile, cream, gold, 0.36);
    box(ochre, 0, 7.55, -3.5, 9.2, 1.45, 5.2);
    window.CentralArch.curvedRoof(T, kit, 0, 8.25, -3.5, 11.4, 7.2, 1.65, redTile, cream, gold, 0.3);

    // Iconic Thiên Ấn Bell Pavilion (Lầu Chuông Thần) on the right courtyard
    const bx = 8.4, bz = 2.6;
    tapered(stone, bx, 0.75, bz, 2.65, 2.5, 0.75, 1, 6);
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      stamp(round, crimson, bx + Math.sin(a) * 1.95, 2.8, bz + Math.cos(a) * 1.95, 0.14, 3.4, 0.14);
    }
    tapered(0x745c3f, bx, 2.55, bz, 0.72, 0.46, 1.45, 1, 12);
    tapered(redTile, bx, 5.15, bz, 3.1, 0.35, 1.65, 1, 6);
    tapered(gold, bx, 6.3, bz, 0.28, 0.04, 0.75, 1, 6);
  }

  // 2. Chùa Minh Thành – Pleiku (Gia Lai) — 9-story Bảo Tháp Xá Lợi + Curved Sanctuary
  function chuaMinhThanh(T, kit) {
    const {box, stamp, round, tapered} = kit;
    const red = 0xa8362a, gold = 0xdfb74a, cream = 0xeee5d1, darkTile = 0x4b4744, stone = 0x99958c;
    kit.palette({plaster: cream, stone});

    // Raised granite terrace & lotus pool court
    box(stone, 0, 0.25, 0, 29.0, 0.5, 24.0);
    box(0x3a646e, 0, 0.52, 7.2, 12.0, 0.08, 6.0);
    box(cream, 0, 0.58, 7.2, 3.4, 0.24, 6.4); // stone bridge across lotus pond

    // Dramatic 9-story Red & Gold Bảo Tháp Xá Lợi (left-rear focal tower)
    const tx = -7.6, tz = -3.0;
    tapered(stone, tx, 0.95, tz, 4.8, 4.4, 1.15, 1, 8);
    let ty = 1.5;
    for (let tier = 0; tier < 9; tier++) {
      const r = 3.65 - tier * 0.24, h = 2.45 - tier * 0.08;
      tapered(red, tx, ty + h * 0.45, tz, r, r * 0.96, h * 0.85, 1, 8);
      for (let f = 0; f < 4; f++) {
        const a = f * Math.PI / 2;
        box(gold, tx + Math.sin(a) * (r * 0.93), ty + h * 0.44, tz + Math.cos(a) * (r * 0.93), r * 0.34, h * 0.52, 0.12, a);
      }
      tapered(darkTile, tx, ty + h * 0.95, tz, r * 1.42, r * 0.92, 0.52, 1, 8);
      for (let c = 0; c < 8; c++) {
        const ca = (c + 0.5) * Math.PI / 4;
        box(gold, tx + Math.sin(ca) * (r * 1.38), ty + h * 0.78, tz + Math.cos(ca) * (r * 1.38), 0.14, 0.32, 0.32, ca, -0.4);
      }
      ty += h + 0.2;
    }
    tapered(gold, tx, ty + 1.85, tz, 0.55, 0.05, 3.6, 1, 8);

    // Ornate Japanese-Vietnamese Grand Sanctuary Hall (Chính Điện) to the right
    const hx = 5.4, hz = -3.2;
    box(stone, hx, 0.95, hz, 14.5, 1.1, 11.5);
    for (let st = 0; st < 4; st++) box(cream, hx, 0.35 + st * 0.26, hz + 6.8 - st * 0.38, 5.2, 0.24, 0.44);
    box(cream, hx, 3.6, hz, 12.2, 4.3, 9.2);
    for (const x of [-5.8, -2.9, 0, 2.9, 5.8]) stamp(round, red, hx + x, 3.7, hz + 4.95, 0.2, 4.4, 0.2);
    for (const dx of [-3.2, 0, 3.2]) box(red, hx + dx, 3.1, hz + 4.65, 1.95, 3.1, 0.12);
    window.CentralArch.curvedRoof(T, kit, hx, 5.85, hz, 16.2, 12.8, 2.2, darkTile, gold, gold, 0.36);
    box(red, hx, 8.65, hz, 8.6, 1.9, 6.2);
    for (const dx of [-2.4, 0, 2.4]) box(gold, hx + dx, 8.65, hz + 3.16, 1.15, 1.15, 0.08);
    window.CentralArch.curvedRoof(T, kit, hx, 9.6, hz, 11.8, 8.8, 2.1, darkTile, gold, gold, 0.32);
  }

  // 3. Bảo tàng Thế giới Cà phê – Buôn Ma Thuột (Đắk Lắk) — 5 Dramatic Curved Basalt Longhouse Domes
  function baoTangCaPhe(T, {palette, box, stamp, outline, profile, sign}) {
    const basalt = 0x4e4e52, darkBasalt = 0x3b3b3f, slate = 0x626268;
    const cream = 0xd9d2c4, glass = 0x3f5862, stone = 0x9b968d, wood = 0x7b563a;
    palette({stone: [basalt, stone], plaster: cream, glass, timber: wood});

    // Expansive stepped basalt-and-stone museum plaza
    box(stone, 0, 0.18, 0, 36.0, 0.36, 26.0);
    box(cream, 0, 0.4, 3.5, 28.0, 0.16, 16.0);

    // Signature curved Ê Đê Longhouse Vault helper (mái nhà dài uốn cong ốp đá bazan)
    function longhouseDome(cx, cz, span, height, length, angle = 0, shade = basalt) {
      const sh = new T.Shape();
      sh.moveTo(-span / 2, 0);
      sh.bezierCurveTo(-span * 0.44, height * 0.55, -span * 0.18, height * 0.96, 0, height);
      sh.bezierCurveTo(span * 0.18, height * 0.96, span * 0.44, height * 0.55, span / 2, 0);
      sh.closePath();
      profile(sh, shade, cx, 0.42, cz - length / 2, length, angle);

      // Arched timber-and-glass end façade recessed slightly
      const s = Math.sin(angle), c = Math.cos(angle);
      const gl = new T.Shape();
      const gs = span * 0.72, gh = height * 0.72;
      gl.moveTo(-gs / 2, 0);
      gl.bezierCurveTo(-gs * 0.4, gh * 0.6, -gs * 0.16, gh * 0.95, 0, gh);
      gl.bezierCurveTo(gs * 0.16, gh * 0.95, gs * 0.4, gh * 0.6, gs / 2, 0);
      gl.closePath();
      // Place front glass aperture aligned with local +Z rotated by angle
      const fx = cx + s * (length / 2 + 0.04), fz = cz + c * (length / 2 + 0.04);
      profile(gl, glass, fx, 0.42, fz - 0.12, 0.24, angle);
      // Horizontal wood mullions across the arched glass wall
      for (const frac of [0.28, 0.52]) {
        box(wood, fx + s * 0.14, 0.42 + gh * frac, fz + c * 0.14, gs * (1 - frac * 0.65), 0.14, 0.14, angle);
      }
      box(wood, fx + s * 0.14, 0.42 + gh * 0.45, fz + c * 0.14, 0.16, gh * 0.88, 0.14, angle);
    }

    // 5 interlocking dramatic curved longhouse volumes fanned around the front courtyard
    longhouseDome(0, -3.5, 13.5, 9.8, 15.0, 0, darkBasalt);
    longhouseDome(-10.2, 0.8, 10.4, 7.6, 12.2, 0.26, basalt);
    longhouseDome(10.2, 0.8, 10.4, 7.6, 12.2, -0.26, basalt);
    longhouseDome(-6.5, -7.8, 9.6, 8.4, 11.0, -0.2, slate);
    longhouseDome(6.5, -7.8, 9.6, 8.4, 11.0, 0.2, slate);

    // Sculptural basalt museum monument sign slab in the front court
    box(darkBasalt, 0, 1.35, 10.2, 6.2, 1.75, 0.55);
    sign('BẢO TÀNG THẾ GIỚI CÀ PHÊ', 0, 1.45, 10.52, 5.8, 0.68);
  }

  // 4. Tháp Po Klong Garai – Phan Rang (Khánh Hòa / Ninh Thuận cũ)
  function poKlongGarai(T, {palette, box, outline, tapered, random}) {
    const brick = [0xa84d35, 0x99452f, 0xb6593f, 0x873c28];
    const sandstone = 0xc2b49a, dark = 0x35241e, hill = 0x9e8c72;
    palette({stone: sandstone});

    // Trầu Hill stepped stone terrace & brick courtyard
    box(hill, 0, -1.2, 0, 29.0, 2.8, 22.0);
    box(sandstone, 0, 0.34, 0, 27.2, 0.32, 20.4);

    // Cham Kalan Tower helper with crisp corner flame ornaments & tiered pilasters
    function chamTower(cx, cz, w, h, main = true) {
      for (let j = 0; j < 3; j++) box(j === 1 ? sandstone : brick[0], cx, 0.65 + j * 0.36, cz, w + 1.5 - j * 0.35, 0.36, w + 1.5 - j * 0.35);
      box(brick[0], cx, 1.65 + h * 0.27, cz, w, h * 0.54, w);
      for (let face = 0; face < 4; face++) {
        const a = face * Math.PI / 2, s = Math.sin(a), c = Math.cos(a);
        for (const t of [-0.42, -0.27, 0.27, 0.42]) {
          box(brick[2], cx + c * w * t + s * w * 0.5, 1.65 + h * 0.27, cz - s * w * t + c * w * 0.5, w * 0.08, h * 0.5, 0.34, a);
        }
        // Steep pointed Cham Kala arch (vòm cửa mũi giáo)
        const d = w * 0.51, dw = w * 0.27, dh = h * 0.33;
        outline([[-dw, 0], [-dw, dh * 0.65], [-dw * 0.48, dh * 0.96], [0, dh * 1.48], [dw * 0.48, dh * 0.96], [dw, dh * 0.65], [dw, 0]],
          brick[3], cx + s * d, 1.7, cz + c * d, 0.38, a);
        outline([[-dw * 0.6, 0], [-dw * 0.6, dh * 0.62], [0, dh * 1.05], [dw * 0.6, dh * 0.62], [dw * 0.6, 0]],
          face === 0 ? dark : brick[1], cx + s * (d + 0.34), 1.7, cz + c * (d + 0.34), 0.14, a);
      }
      // Projecting front vestibule (Tiền sảnh) with sandstone Shiva relief lintel
      if (main) {
        box(brick[2], cx, 3.65, cz + w * 0.66, w * 0.54, 4.1, w * 0.4);
        box(dark, cx, 2.95, cz + w * 0.88, w * 0.22, 2.75, 0.14);
        outline([[-1.4, 0], [-1.2, 0.9], [0, 1.95], [1.2, 0.9], [1.4, 0]], sandstone, cx, 4.45, cz + w * 0.87, 0.18);
        for (let st = 0; st < 5; st++) box(sandstone, cx, 0.5 + st * 0.24, cz + w * 0.96 + (4 - st) * 0.36, w * 0.38, 0.24, 0.42);
      }
      // 3 stepped pyramid tiers with white-sandstone flame finials at every corner
      let ty = 1.65 + h * 0.54;
      for (let tier = 0; tier < 3; tier++) {
        const tw = w * (0.85 - tier * 0.19), th = h * (0.145 - tier * 0.02);
        box(brick[tier % 3], cx, ty + th * 0.5, cz, tw, th, tw);
        box(brick[3], cx, ty + th, cz, tw * 1.08, 0.26, tw * 1.08);
        for (const dx of [-1, 1]) for (const dz of [-1, 1]) {
          tapered(sandstone, cx + dx * tw * 0.48, ty + th * 0.78, cz + dz * tw * 0.48, 0.45, 0.12, 1.25, 1, 4);
        }
        ty += th + 0.18;
      }
      tapered(sandstone, cx, ty + 1.15, cz, w * 0.19, 0.08, 2.35, 1, 4);
    }

    // 1. Main Sanctuary Tower (Tháp Chính — 20.5m)
    chamTower(0, -2.6, 7.6, 18.2, true);
    // 2. Gate Tower (Tháp Cổng) to the front-right
    chamTower(9.2, 3.6, 4.8, 9.8, false);
    // 3. Fire Tower (Tháp Lửa — iconic curved boat-shaped saddle roof) to the front-left
    const fx = -9.0, fz = 3.6;
    box(sandstone, fx, 0.68, fz, 5.6, 0.65, 7.8);
    box(brick[0], fx, 2.95, fz, 4.8, 3.9, 7.0);
    const saddle = [[-2.8, 0], [-2.55, 1.75], [-1.65, 3.1], [0, 4.05], [1.65, 3.1], [2.55, 1.75], [2.8, 0]];
    outline(saddle, brick[2], fx, 4.9, fz - 3.7, 7.4);
    for (const s of [-1, 1]) {
      outline([[-3.05, 0], [-2.35, 2.5], [0, 4.75], [2.35, 2.5], [3.05, 0]], sandstone, fx, 4.9, fz + s * 3.6, 0.34);
    }
    box(dark, fx + 2.42, 2.55, fz, 0.16, 2.45, 1.45);
  }

  // 5. Tháp Trầm Hương – Nha Trang (Khánh Hòa) — 6-tier Coral-Pink Stylized Lotus-Sail Tower
  function thapTramHuong(T, {palette, box, stamp, outline, tapered, round}) {
    const coral = 0xe37762, peach = 0xec9781, cream = 0xf0e9dc, gold = 0xe0b64e;
    const glass = 0x487482, stone = 0xb5b1a6;
    palette({plaster: cream, glass, stone});

    // 2/4 Square stepped circular granite podium
    tapered(stone, 0, 0.25, 0, 12.2, 11.8, 0.5, 1, 20);
    tapered(cream, 0, 0.72, 0, 9.4, 8.9, 0.48, 1, 16);

    // Lower 2-story circular exhibition base with coral-pink colonnade
    tapered(cream, 0, 2.55, 0, 6.8, 6.5, 3.25, 1, 16);
    tapered(glass, 0, 2.6, 0, 6.58, 6.3, 2.35, 1, 16);
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI / 5;
      box(coral, Math.sin(a) * 6.55, 2.7, Math.cos(a) * 6.55, 0.78, 3.45, 0.92, a);
    }
    tapered(peach, 0, 4.38, 0, 7.2, 6.4, 0.52, 1, 16);

    // Iconic mid-tower sculpted coral-pink lotus petals / wind-swept sails rising around central glass core
    tapered(glass, 0, 10.6, 0, 3.2, 2.55, 12.2, 1, 12);
    tapered(cream, 0, 10.6, 0, 2.85, 2.25, 12.4, 1, 12);
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      // Sweeping sculpted lotus-sail wing curving gracefully outward then inward toward top
      const petal = [
        [2.2, 0], [5.8, 2.2], [6.4, 6.2], [5.2, 11.0], [2.9, 14.8],
        [1.9, 14.2], [3.6, 10.4], [4.4, 6.0], [3.8, 2.6], [1.8, 0.2]
      ];
      outline(petal, i % 2 ? coral : peach, 0, 4.4, -0.34, 0.68, a);
    }

    // Upper glowing lotus-bud crown (búp sen hồng cam trên đỉnh tháp)
    tapered(coral, 0, 17.8, 0, 2.65, 3.35, 2.4, 1, 10);
    tapered(peach, 0, 20.2, 0, 3.3, 1.55, 2.6, 1, 10);
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      box(coral, Math.sin(a) * 2.8, 19.6, Math.cos(a) * 2.8, 1.4, 3.2, 0.36, a, -0.18);
    }
    // Translucent golden agarwood pearl finial at summit
    const bud = new T.SphereGeometry(1.15, 12, 10);
    stamp(bud, gold, 0, 22.3, 0, 0.85, 1.45, 0.85);
    bud.dispose();
  }

  // 6. Khu di tích Trường Dục Thanh – Phan Thiết (Lâm Đồng / Bình Thuận cũ)
  function truongDucThanh(T, kit) {
    const {box, stamp, outline, round, sign} = kit;
    const timber = 0x5c3926, wood = 0x7b4f34, ochre = 0xd6bd82, tile = 0x984632;
    const brickFloor = 0x9c5a44, stone = 0x8f8a7f, cream = 0xebe0c5;
    kit.palette({timber: [timber, wood], plaster: [ochre, cream], tile, stone});

    // Red brick heritage schoolyard & low plastered boundary walls
    box(brickFloor, 0, 0.14, 0.8, 23.0, 0.28, 19.0);
    for (const [wx, wz, ww, wd] of [[-7.2, 9.8, 7.6, 0.38], [7.2, 9.8, 7.6, 0.38], [-11.2, 0.8, 0.38, 18.2], [11.2, 0.8, 0.38, 18.2], [0, -8.4, 22.8, 0.38]]) {
      box(ochre, wx, 0.85, wz, ww, 1.25, wd);
      box(tile, wx, 1.55, wz, ww + 0.16, 0.18, wd + 0.22);
    }

    // Front Heritage Gate ("TRƯỜNG DỤC THANH 1907")
    for (const s of [-1, 1]) {
      box(ochre, s * 2.8, 2.0, 9.8, 0.78, 3.6, 0.78);
      box(cream, s * 2.8, 3.9, 9.8, 0.96, 0.24, 0.96);
    }
    box(ochre, 0, 3.55, 9.8, 6.2, 0.85, 0.52);
    sign('TRƯỜNG DỤC THANH', 0, 3.55, 10.1, 4.4, 0.56);
    window.CentralArch.curvedRoof(T, kit, 0, 4.05, 9.8, 6.9, 1.85, 0.72, tile, cream, ochre, 0.35);

    // Main 1907 Timber Schoolhouse (Nhà học chính)
    box(stone, 0, 0.42, -2.5, 16.4, 0.56, 8.6);
    box(wood, 0, 2.35, -2.5, 14.8, 3.4, 6.8);
    // Classical Southern-Central wooden louvered shutters & veranda columns
    for (const x of [-6.8, -4.1, -1.35, 1.35, 4.1, 6.8]) {
      stamp(round, timber, x, 2.35, 1.45, 0.15, 3.45, 0.15);
    }
    for (const dx of [-5.4, -2.7, 0, 2.7, 5.4]) {
      box(0x3a2419, dx, 2.25, 0.95, 1.65, 2.45, 0.08);
      box(timber, dx, 2.25, 1.0, 0.08, 2.4, 0.06);
    }
    // Broad terracotta hip roof (mái ngói âm dương Nam Trung Bộ)
    window.CentralArch.curvedRoof(T, kit, 0, 4.05, -2.5, 18.2, 10.6, 2.55, tile, cream, ochre, 0.42);

    // Ngọa Du Sào scholar pavilion (nhà đọc sách cổ) on the left yard
    const nx = -6.8, nz = 4.6;
    box(stone, nx, 0.35, nz, 5.4, 0.42, 4.8);
    for (const dx of [-2.1, 2.1]) for (const dz of [-1.8, 1.8]) stamp(round, timber, nx + dx, 1.75, nz + dz, 0.13, 2.5, 0.13);
    box(wood, nx, 1.65, nz - 1.75, 4.1, 2.1, 0.16);
    window.CentralArch.curvedRoof(T, kit, nx, 3.0, nz, 6.2, 5.4, 1.45, tile, cream, ochre, 0.32);

    // Century-old Starfruit Tree (Cây khế trăm tuổi) & well on the right yard
    stamp(round, 0x8e5642, 6.8, 0.52, 4.2, 0.88, 0.78, 0.88);
    stamp(round, 0x2c484c, 6.8, 0.58, 4.2, 0.66, 0.68, 0.66);
    window.CentralArch.trees(T, kit, [{x: 7.6, y: .35, z: 6.4, h: 6.6, width: 7.1}]);
  }

  (window.VietnamSights ??= []).push({
    id: 'chua-thien-an', name: 'Chùa Thiên Ấn', city: 'Quảng Ngãi', province: 'Quảng Ngãi', region: 'Trung Bộ',
    lon: 108.8075, lat: 15.1462, start: [108.807874, 15.146130], yaw: 1.38, width: 25, depth: 23,
    solids: [[0, -3.5, 7.5, 4.5], [8.4, 2.6, 2.6, 2.6], [-4.4, 8.5, 1.8, 1.0], [4.4, 8.5, 1.8, 1.0]],
    description: 'Ngôi cổ tự danh thắng bậc nhất Quảng Ngãi trên đỉnh núi Thiên Ấn bên sông Trà Khúc với tam quan, chính điện hai tầng mái và lầu chuông thần.',
    photo: 'https://vinwonders.com/vi/wonderpedia/news/chua-thien-an-quang-ngai/',
    source: 'https://vi.wikipedia.org/wiki/Ch%C3%B9a_Thi%C3%AAn_%E1%BA%A4n',
    map: 'https://www.openstreetmap.org/?mlat=15.1462&mlon=108.8075#map=17/15.1462/108.8075',
    build: chuaThienAn
  }, {
    id: 'chua-minh-thanh', name: 'Chùa Minh Thành', city: 'Pleiku', province: 'Gia Lai', region: 'Trung Bộ',
    lon: 107.9977, lat: 13.9722, start: [107.997828, 13.971821], yaw: 0.32, viewElevation: 0.22, width: 30, depth: 25,
    solids: [[-7.6, -3.0, 4.4, 4.4], [5.4, -3.2, 7.2, 5.6]],
    description: 'Công trình kiến trúc Phật giáo nổi tiếng ở phố núi Pleiku với bảo tháp Xá Lợi chín tầng sơn son thếp vàng và chính điện mái đao cong.',
    photo: 'https://vinwonders.com/vi/wonderpedia/news/chua-minh-thanh-gia-lai/',
    source: 'https://vi.wikipedia.org/wiki/Ch%C3%B9a_Minh_Th%C3%A0nh',
    map: 'https://www.openstreetmap.org/?mlat=13.9722&mlon=107.9977#map=18/13.9722/107.9977',
    build: chuaMinhThanh
  }, {
    id: 'bao-tang-ca-phe', name: 'Bảo tàng Thế giới Cà phê', city: 'Buôn Ma Thuột', province: 'Đắk Lắk', region: 'Trung Bộ',
    lon: 108.044709, lat: 12.690864, start: [108.044505, 12.691486], yaw: -2.83, viewElevation: 0.24, width: 36, depth: 26,
    solids: [[0, -3.5, 6.8, 7.5], [-10.2, 0.8, 5.2, 6.1], [10.2, 0.8, 5.2, 6.1], [0, 10.2, 3.1, 0.4]],
    description: 'Biểu tượng kiến trúc đương đại của Buôn Ma Thuột gồm năm khối vòm uốn cong ốp đá bazan lấy cảm hứng từ nhà dài truyền thống Tây Nguyên.',
    photo: 'https://baotangthegioicaphe.com/',
    source: 'https://vi.wikipedia.org/wiki/B%E1%BA%A3o_t%C3%A0ng_Th%E1%BA%BF_gi%E1%BB%9Bi_C%C3%A0_ph%C3%AA',
    map: 'https://www.openstreetmap.org/way/1545026830',
    build: baoTangCaPhe
  }, {
    id: 'po-klong-garai', name: 'Tháp Po Klong Garai', city: 'Phan Rang', province: 'Khánh Hòa', region: 'Trung Bộ', formerProvince: 'Ninh Thuận',
    lon: 108.94643, lat: 11.601827, start: [108.9476, 11.601634], yaw: 1.40, viewElevation: 0.23, width: 30, depth: 23,
    solids: [[0, -2.6, 4.2, 4.5], [9.2, 3.6, 2.7, 2.7], [-9.0, 3.6, 2.9, 3.9]],
    description: 'Cụm đền tháp Chăm Pa nguyên vẹn bậc nhất Việt Nam trên đồi Trầu gồm Tháp Chính nhiều tầng gạch nung, Tháp Cổng và Tháp Lửa mái hình thuyền.',
    photo: 'https://vinwonders.com/vi/wonderpedia/news/thap-po-klong-garai-ninh-thuan/',
    source: 'https://vi.wikipedia.org/wiki/Th%C3%A1p_Po_Klong_Garai',
    map: 'https://www.openstreetmap.org/way/804729100',
    build: poKlongGarai
  }, {
    id: 'thap-tram-huong', name: 'Tháp Trầm Hương', city: 'Nha Trang', province: 'Khánh Hòa', region: 'Trung Bộ',
    lon: 109.19655, lat: 12.23892, start: [109.196676, 12.238935], yaw: 1.69, viewElevation: 0.21, width: 22, depth: 22,
    solids: [[0, 0, 6.8, 6.8]],
    description: 'Ngọn tháp biểu tượng màu hồng cam bên đường biển Trần Phú – Quảng trường 2/4 Nha Trang với cánh buồm cách điệu và đỉnh búp sen trầm hương.',
    photo: 'https://vinwonders.com/vi/wonderpedia/news/thap-tram-huong-nha-trang/',
    source: 'https://vi.wikipedia.org/wiki/Th%C3%A1p_Tr%E1%BA%A7m_H%C6%B0%C6%A1ng',
    map: 'https://www.openstreetmap.org/?mlat=12.23892&mlon=109.19655#map=19/12.23892/109.19655',
    build: thapTramHuong
  }, {
    id: 'truong-duc-thanh', name: 'Trường Dục Thanh', city: 'Phan Thiết', province: 'Lâm Đồng', region: 'Trung Bộ', formerProvince: 'Bình Thuận',
    lon: 108.096125, lat: 10.928253, start: [108.096281, 10.928427], yaw: 2.42, width: 24, depth: 21,
    solids: [[0, -2.5, 8.2, 4.4], [-6.8, 4.6, 2.7, 2.4]],
    description: 'Ngôi trường gỗ mái ngói âm dương thành lập năm 1907 tại Phan Thiết – nơi thầy giáo Nguyễn Tất Thành từng giảng dạy, cùng nhà Ngọa Du Sào và cây khế cổ.',
    photo: 'https://vinwonders.com/vi/wonderpedia/news/truong-duc-thanh-phan-thiet/',
    source: 'https://vi.wikipedia.org/wiki/Tr%C6%B0%E1%BB%9Dng_D%E1%BB%A5c_Thanh',
    map: 'https://www.openstreetmap.org/way/261710309',
    build: truongDucThanh
  });
})();
