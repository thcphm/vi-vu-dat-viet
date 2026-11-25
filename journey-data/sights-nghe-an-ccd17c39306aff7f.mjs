const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Helper: concave Vietnamese curved hip roof (mái đao cong) matching Ha Nam / Hue style

  // Footprints of the masonry on either side of an open arch, in model coordinates.
  function archPiers(x, z, width, radius, depth) {
    const halfPier = (width / 2 - radius) / 2;
    return [-1, 1].map(side => [x + side * (radius + halfPier), z, halfPier, depth / 2]);
  }

  function vaultedBay(T, {profile, box, outline}, x, z, w, h, r, sy, d, wallColor, trimColor, darkColor) {
    const shape = new T.Shape();
    shape.moveTo(-w / 2, 0); shape.lineTo(-r, 0); shape.lineTo(-r, sy);
    shape.absarc(0, sy, r, Math.PI, 0, true);
    shape.lineTo(r, 0); shape.lineTo(w / 2, 0); shape.lineTo(w / 2, h); shape.lineTo(-w / 2, h); shape.closePath();
    profile(shape, wallColor, x, 0, z - d / 2, d);
    for (const side of [-1, 1]) {
      const f = z + side * (d / 2 + 0.03);
      for (const s of [-1, 1]) {
        box(trimColor, x + s * (r + 0.15), sy / 2, f, 0.24, sy, 0.12);
        box(darkColor, x + s * (r + 0.2), sy - 0.02, f, 0.34, 0.14, 0.16);
      }
      for (let i = 0; i < 13; i++) {
        const a = i * Math.PI / 13, b = (i + 1) * Math.PI / 13 - 0.012, pt = (q, t) => [q * Math.cos(t), q * Math.sin(t)];
        outline([pt(r, a), pt(r + 0.24, a), pt(r + 0.24, b), pt(r, b)], i % 2 ? trimColor : darkColor, x, sy, f - 0.04, 0.1);
      }
    }
  }

  // 1. Cửa Tiền – Thành cổ Vinh (Tiền Môn)
  function thanhCoVinh(T, kit) {
    const {box, stamp, outline, profile, round, sign} = kit;
    const laterite = [0x8c5c45, 0x99674c, 0x7d533e, 0xa27053];
    const brick = 0x8d523d, mortar = 0xb5a892, plaster = 0xc9be9f, timber = 0x613125;
    const tile = 0x6f4335, darkStone = 0x655f57, woodDoor = 0x51261b;
    kit.palette({brick, plaster, timber, tile, stone: darkStone});

    // Approach stone bridge & moat walls in front (+Z)
    box(0x888175, 0, 0.16, 8.2, 6.8, 0.34, 9.6);
    for (const s of [-1, 1]) {
      box(mortar, s * 3.25, 0.68, 8.2, 0.38, 0.72, 9.4);
      for (let i = 0; i < 5; i++) box(darkStone, s * 3.25, 1.08, 4.1 + i * 2.05, 0.52, 0.36, 0.52);
    }

    // Main hexagonal Vauban citadel rampart wall with central Tiền Môn archway
    vaultedBay(T, kit, 0, 0, 14.2, 5.15, 2.35, 2.6, 7.6, laterite[0], mortar, darkStone);
    // Flanking angled citadel rampart wings (battered stone walls)
    for (const s of [-1, 1]) {
      const wing = new T.Shape();
      wing.moveTo(-4.4, 0); wing.lineTo(4.4, 0); wing.lineTo(3.6, 4.75); wing.lineTo(-3.6, 4.75); wing.closePath();
      profile(wing, laterite[1], s * 10.6, 0, -2.5, 5.0);
      // Crenellations (lỗ châu mai) along top of wing walls
      box(mortar, s * 10.6, 4.86, 0, 8.2, 0.24, 5.3);
      for (let i = -3; i <= 3; i++) {
        box(laterite[i & 3], s * 10.6 + i * 1.12, 5.42, 2.35, 0.66, 0.92, 0.48);
        box(laterite[(i + 1) & 3], s * 10.6 + i * 1.12, 5.38, -2.35, 0.66, 0.84, 0.48);
      }
      // Weathered stone courses along the main front wall
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
          box(laterite[(row + col) % 4], s * (3.2 + col * 2.35), 0.42 + row * 0.78, 3.83, 2.22, 0.7, 0.1);
        }
      }
    }

    // Recessed twin heavy wooden citadel doors (slightly open)
    for (const s of [-1, 1]) {
      box(woodDoor, s * 1.92, 1.85, 0.25, 0.2, 3.55, 1.75, s * 0.28);
      for (let r = 0; r < 4; r++) box(0x9d7a47, s * 1.84, 0.6 + r * 0.85, 0.25, 0.24, 0.08, 1.65, s * 0.28);
    }

    // Citadel cornice & stone parapet terrace atop the gate
    box(mortar, 0, 5.28, 0, 14.9, 0.32, 8.2);
    for (const f of [-1, 1]) {
      for (let i = -5; i <= 5; i++) box(plaster, i * 1.32, 5.88, f * 3.82, 0.76, 0.92, 0.36);
      box(mortar, 0, 5.56, f * 3.82, 14.4, 0.28, 0.42);
    }
    for (const s of [-1, 1]) {
      for (let j = -2; j <= 2; j++) box(plaster, s * 7.12, 5.88, j * 1.4, 0.36, 0.92, 0.76);
    }

    // Plaque above main arch
    box(plaster, 0, 4.92, 3.88, 3.3, 0.82, 0.16);
    sign('CỬA TIỀN', 0, 4.92, 3.98, 3.05, 0.62);

    // Upper Watchtower (Vọng Lâu) — 2-tier Nguyen Dynasty pavilion
    box(darkStone, 0, 5.65, 0, 9.6, 0.44, 5.8);
    box(plaster, 0, 7.22, 0, 7.6, 2.75, 4.1);
    for (const x of [-4.2, -1.65, 1.65, 4.2]) for (const z of [-2.45, 2.45]) {
      stamp(round, timber, x, 7.25, z, 0.2, 2.95, 0.2);
      stamp(round, darkStone, x, 5.9, z, 0.3, 0.24, 0.3);
    }
    // Red-lacquered doors & lattice windows on Vọng Lâu
    for (const f of [-1, 1]) {
      for (const dx of [-2.1, 0, 2.1]) {
        box(timber, dx, 7.15, f * 2.09, 1.32, 2.18, 0.1);
        box(0x8a4830, dx, 7.42, f * 2.15, 0.98, 1.05, 0.06);
      }
    }
    // Lower sweeping curved tile roof
    window.CentralArch.curvedRoof(T, kit, 0, 8.62, 0, 11.4, 7.1, 1.55, tile, mortar, plaster, 0.32);

    // Upper attic tier (tầng cổ diêm) of Vọng Lâu
    box(brick, 0, 10.55, 0, 6.2, 1.45, 3.4);
    for (const x of [-2.9, 0, 2.9]) for (const z of [-1.62, 1.62]) box(timber, x, 10.55, z, 0.24, 1.48, 0.24);
    for (const f of [-1, 1]) for (const dx of [-1.45, 1.45]) box(0x3a2a24, dx, 10.6, f * 1.72, 1.05, 0.85, 0.08);
    window.CentralArch.curvedRoof(T, kit, 0, 11.2, 0, 8.6, 5.2, 1.45, tile, mortar, plaster, 0.28);

    // Sunburst crest (mặt trời / hồ lô) on top ridge
    const finial = new T.SphereGeometry(0.28, 10, 8);
    stamp(finial, 0xb89652, 0, 12.92, 0, 1, 1.15, 0.5);
    finial.dispose();
  }

  // 2. Nhà Bác Hồ ở Làng Sen (Kim Liên, Nam Đàn)
  function langSen(T, kit) {
    const {box, stamp, outline, round} = kit;
    const thatch = [0xb39a6e, 0xa58b60, 0x9b8259, 0xbfaa7d];
    const bamboo = 0x87724d, timber = 0x563f2e, earth = 0xb99e77, hedge = 0x3f6632;
    kit.palette({timber: [bamboo, timber]});

    // Packed-earth yard & low foundation platform
    box(earth, 0, 0.08, 1.6, 22.0, 0.16, 16.5);
    box(0x8c7b65, 0, 0.22, -1.8, 15.2, 0.28, 6.2);

    // Main 5-bay thatched-roof timber house (Nhà tranh 5 gian)
    const w = 14.4, halfD = 3.55, eaves = 2.45, rise = 2.55;
    // Bamboo-and-mud walls (vách liếp) recessed behind veranda
    box(0x927c5e, 0, 1.48, -3.55, 13.6, 2.32, 0.2);
    for (const s of [-1, 1]) {
      outline([[-2.95, 0.3], [2.95, 0.3], [2.95, 2.48], [0, 4.92], [-2.95, 2.48]], 0x8b7556, s * 6.85, 0, -1.8, 0.2, Math.PI / 2);
    }
    // 6 rows of wooden pillars (5 bays)
    for (const x of [-6.6, -3.96, -1.32, 1.32, 3.96, 6.6]) {
      for (const z of [-3.45, -1.8, 0.15]) {
        const h = z > -0.5 ? 2.28 : (z < -2.5 ? 2.42 : 3.65);
        stamp(round, timber, x, 0.36 + h / 2, z, 0.13, h, 0.13);
      }
      box(timber, x, 2.55, -1.75, 0.14, 0.18, 3.95);
    }
    box(timber, 0, 2.38, 0.15, 13.6, 0.16, 0.16);
    // Front bamboo lattice walls & propped-up window shutters (cửa liếp chống)
    for (let bay = -2; bay <= 2; bay++) {
      const bx = bay * 2.64;
      if (bay === 0) {
        // Open center bay with low wooden threshold & interior altar table hint
        box(timber, bx, 0.48, -0.52, 2.4, 0.22, 0.14);
        box(0x4a3122, bx, 0.92, -2.5, 1.65, 0.85, 0.72);
      } else if (Math.abs(bay) === 1) {
        // Propped-up shutter canopy
        box(bamboo, bx, 2.08, 0.42, 2.2, 0.08, 1.15, 0, -0.52);
        for (const s of [-1, 1]) stamp(round, 0xa28b59, bx + s * 0.92, 1.48, 0.68, 0.032, 1.28, 0.032, 0, 0.36);
        box(0x3a3026, bx, 1.38, -0.55, 2.1, 1.55, 0.08);
      } else {
        box(0x8c7758, bx, 1.42, -0.52, 2.52, 2.12, 0.12);
        for (let k = -2; k <= 2; k++) box(bamboo, bx + k * 0.48, 1.42, -0.45, 0.06, 2.05, 0.04);
      }
    }

    // Thick layered golden-brown thatched roof (mái tranh dày)
    const section = [[-halfD, 0], [-halfD * 0.55, rise * 0.48], [0, rise], [halfD * 0.55, rise * 0.48], [halfD, 0],
      [halfD, -0.34], [0, rise - 0.36], [-halfD, -0.34]];
    outline(section, thatch[0], -w / 2 - 0.55, eaves, -1.8, w + 1.1, Math.PI / 2);
    // Overlapping thatch ridges & bundles for organic straw texture
    for (const side of [-1, 1]) {
      for (let tier = 0; tier < 7; tier++) {
        const t = tier / 6.5, zz = -1.8 + side * (0.28 + t * (halfD - 0.24));
        const yy = eaves + rise * (1 - t * 0.95) - 0.04;
        box(thatch[tier % 4], 0, yy, zz, w + 1.16 - tier * 0.02, 0.16, 0.56, 0, side * 0.58);
      }
    }
    // Bamboo ridge cap (bờ nóc tre)
    box(0x7c6642, 0, eaves + rise + 0.08, -1.8, w + 1.15, 0.24, 0.38);

    // Side kitchen / outbuilding (nhà ngang 3 gian) on left side (-X)
    box(0x8d7b66, -8.35, 0.18, 3.65, 4.1, 0.22, 7.6);
    box(0x8b7556, -9.95, 1.25, 3.65, 0.22, 1.98, 7.1);
    for (const z of [0.3, 2.55, 4.75, 7.0]) {
      stamp(round, timber, -6.55, 1.22, z, 0.11, 1.92, 0.11);
    }
    outline([[-2.45, 0], [0, 1.85], [2.45, 0], [2.45, -0.28], [0, 1.55], [-2.45, -0.28]],
      thatch[1], -8.35, 2.12, -0.4, 8.1);
    box(0x7c6642, -8.35, 4.02, 3.65, 0.32, 0.2, 8.15);

    // Green hibiscus hedge (hàng rào dâm bụt) & rustic bamboo entrance gate
    for (const [hx, hz, hw, hd] of [[-5.6, 9.5, 9.8, 0.72], [6.2, 9.5, 8.6, 0.72], [-10.7, 1.6, 0.72, 16.2], [10.7, 1.6, 0.72, 16.2], [0, -6.4, 22.0, 0.72]]) {
      box(hedge, hx, 0.72, hz, hw, 1.28, hd);
      box(0x4c793b, hx, 1.38, hz, hw * 0.96, 0.24, hd * 0.85);
    }
    // Small red hibiscus blossoms along front hedge
    for (let i = 0; i < 24; i++) {
      const fx = i < 12 ? -10.1 + i * 0.82 : 2.3 + (i - 12) * 0.72;
      box(0xc93b37, fx, 0.85 + (i % 3) * 0.22, 9.88, 0.13, 0.13, 0.08);
    }
    // Bamboo entrance gate (cổng tre mái tranh)
    for (const s of [-1, 1]) {
      stamp(round, timber, 0.6 + s * 1.32, 1.38, 9.5, 0.14, 2.75, 0.14);
      box(bamboo, 0.6 + s * 0.82, 0.92, 9.55, 0.9, 1.45, 0.08, s * 0.35);
    }
    outline([[-0.9, 0], [0, 0.72], [0.9, 0], [0.9, -0.16], [0, 0.56], [-0.9, -0.16]], thatch[2], -1.1, 2.65, 9.5, 3.4, Math.PI / 2);

    // Brick village well (giếng nước) & areca palms (hàng cau xứ Nghệ)
    stamp(round, 0x8e5642, 7.2, 0.45, 5.2, 0.95, 0.78, 0.95);
    stamp(round, 0x2d484d, 7.2, 0.52, 5.2, 0.72, 0.68, 0.72);
    const palms = [[5.8, 7.8, 6.2], [8.2, 7.5, 6.9], [8.6, 1.5, 6.6],
      [-8.8, -4.2, 7.0], [8.2, -4.5, 6.4], [-4.8, 7.6, 5.9]];
    window.CentralArch.trees(T, kit, palms.map(([x, z, h]) => ({x, z, h, width: 4.4, kind: 'palm'})));
  }

  // 3. Tam Quan Đền Cuông (Diễn Châu, Nghệ An) — ancient banyan roots over triple-arch gate
  function denCuong(T, kit) {
    const {box, stamp, outline, round, tapered, sign, random} = kit;
    const aged = 0xa99b82, moss = 0x6d7557, ochre = 0xb99c6e, tile = 0x6a4337, ridge = 0x8e8677;
    const rootWood = 0x5f4e3d, dark = 0x473e34;
    kit.palette({plaster: ochre, tile});

    // Stepped stone approach terrace
    for (let i = 0; i < 4; i++) {
      box(0x888175, 0, 0.14 + i * 0.24, 3.6 - i * 0.48, 17.5 - i * 0.4, 0.25, 4.6);
    }
    box(0x9a9181, 0, 0.52, 0, 18.6, 1.04, 4.8);

    // Central 3-tier vaulted arch + flanking 2-tier side arches
    vaultedBay(T, kit, 0, 0, 5.4, 5.2, 1.72, 2.65, 3.1, aged, ochre, dark);
    for (const s of [-1, 1]) {
      vaultedBay(T, kit, s * 5.2, 0, 4.2, 3.65, 1.15, 1.85, 2.2, aged, ochre, dark);
      // 2nd tier pavilion on side gates
      box(ochre, s * 5.2, 4.62, 0, 3.25, 1.25, 1.65);
      for (const f of [-1, 1]) box(dark, s * 5.2, 4.62, f * 0.85, 1.1, 0.78, 0.08);
      window.CentralArch.curvedRoof(T, kit, s * 5.2, 3.68, 0, 4.95, 3.1, 0.76, tile, ridge, aged, 0.25);
      window.CentralArch.curvedRoof(T, kit, s * 5.2, 5.18, 0, 4.15, 2.55, 0.74, tile, ridge, aged, 0.24);
      // Outer Tứ Trụ Biểu ceremonial pillars
      const px = s * 8.15;
      box(dark, px, 1.2, 0.2, 1.15, 0.65, 1.15);
      box(aged, px, 3.45, 0.2, 0.76, 3.9, 0.76);
      for (const y of [1.65, 5.2, 5.65]) box(ochre, px, y, 0.2, 0.94, 0.16, 0.94);
      tapered(ochre, px, 6.18, 0.2, 0.52, 0.16, 0.72, 1, 4);
      box(0x6e3529, px, 3.45, 0.61, 0.28, 2.65, 0.04);
    }

    // Center gate 2nd & 3rd tiers (3 tầng lầu)
    box(ochre, 0, 5.38, 0, 5.9, 0.24, 3.55);
    sign('ĐỀN CUÔNG', 0, 4.82, 1.62, 2.95, 0.56);
    box(aged, 0, 6.55, 0, 4.35, 1.85, 2.55);
    for (const f of [-1, 1]) {
      box(0x4c2d22, 0, 6.55, f * 1.3, 1.45, 1.25, 0.08);
      for (const s of [-1, 1]) box(moss, s * 1.55, 6.55, f * 1.3, 0.55, 1.2, 0.1);
    }
    window.CentralArch.curvedRoof(T, kit, 0, 5.55, 0, 6.5, 4.2, 0.96, tile, ridge, aged, 0.3);
    box(ochre, 0, 8.25, 0, 3.1, 1.35, 1.85);
    for (const f of [-1, 1]) box(dark, 0, 8.25, f * 0.96, 1.05, 0.85, 0.08);
    window.CentralArch.curvedRoof(T, kit, 0, 7.45, 0, 5.4, 3.45, 0.88, tile, ridge, aged, 0.28);
    window.CentralArch.curvedRoof(T, kit, 0, 8.85, 0, 4.25, 2.75, 0.85, tile, ridge, aged, 0.25);

    // Twin dragons flanking moon on top ridge
    for (const s of [-1, 1]) {
      outline([[-0.82, 0], [-0.48, 0.22], [-0.14, 0.16], [0.08, 0.54], [0.28, 0.42], [0.44, 0.18], [0.1, 0.04]],
        ochre, s * 0.82, 9.75, -0.09, 0.18, s > 0 ? Math.PI : 0);
    }
    const moon = new T.SphereGeometry(0.24, 10, 8);
    stamp(moon, 0xc39c58, 0, 10.22, 0, 1, 1, 0.45);
    moon.dispose();

    // Signature feature of Đền Cuông: ancient banyan tree & organic clinging roots over right wing
    for (let i = 0; i < 16; i++) {
      const rx = 3.15 + (i % 6) * 0.72 + (random() - 0.5) * 0.22;
      const rz = (i % 2 ? 1 : -1) * (1.06 + random() * 0.1);
      const rh = 1.9 + random() * 2.1;
      const rad = 0.042 + random() * 0.045;
      stamp(round, i % 3 === 0 ? moss : rootWood, rx, 1.0 + rh / 2, rz, rad, rh, rad, 0, 0, (random() - 0.5) * 0.35);
    }
    window.CentralArch.trees(T, kit, [{x: 5.9, y: .9, z: -1.65, h: 9.0, width: 9.3}]);
  }

  // 4. Nghi Môn Đền Ông Hoàng Mười (Hưng Nguyên, Nghệ An)
  function denHoangMuoi(T, kit) {
    const {box, stamp, outline, round, tapered, sign} = kit;
    const goldWall = 0xd6b16b, cream = 0xe8d9b5, redTile = 0xa84632, vermilion = 0x8e2c22;
    const stone = 0x8d887c, brickFloor = 0x9b5a44, gold = 0xd4ad52;
    kit.palette({plaster: cream, stone});

    // Red Bát Tràng brick courtyard & triple stone stairs
    box(brickFloor, 0, 0.16, 0.8, 22.4, 0.32, 12.2);
    for (let s = 0; s < 3; s++) box(stone, 0, 0.08 + s * 0.09, 7.45 - s * 0.36, 7.2, 0.12, 0.42);
    for (const side of [-1, 1]) {
      outline([[0, 0], [1.45, 0], [1.45, 0.38], [0.28, 0.82], [0, 0.82]], stone, side * 3.8, 0.06, 6.2, 0.28, Math.PI / 2);
    }

    // Front Nghi Môn Tứ Trụ (4 grand square ceremonial pillars)
    for (const [px, h, w] of [[-7.6, 5.4, 0.72], [-3.2, 7.1, 0.92], [3.2, 7.1, 0.92], [7.6, 5.4, 0.72]]) {
      box(stone, px, 0.65, 4.8, w * 1.45, 0.68, w * 1.45);
      box(goldWall, px, 0.95 + h / 2, 4.8, w, h, w);
      for (const y of [1.2, 0.95 + h - 0.55, 0.95 + h]) box(cream, px, y, 4.8, w * 1.24, 0.18, w * 1.24);
      // Red-and-gold parallel sentences (câu đối) on front face
      box(vermilion, px, 1.0 + h * 0.48, 4.8 + w * 0.52, w * 0.46, h * 0.62, 0.05);
      for (let j = 0; j < 7; j++) box(gold, px, 1.6 + j * (h * 0.08), 4.8 + w * 0.56, w * 0.22, 0.12, 0.03);
      // Lantern box (lồng đèn) & lotus/nghê finial
      box(cream, px, 1.32 + h, 4.8, w * 0.78, 0.68, w * 0.78);
      box(vermilion, px, 1.32 + h, 4.8 + w * 0.4, w * 0.42, 0.42, 0.04);
      tapered(gold, px, 2.02 + h, 4.8, w * 0.52, 0.12, 0.76, 1, 4);
    }
    // Connecting low ornate walls between outer and inner pillars
    for (const s of [-1, 1]) {
      box(goldWall, s * 5.4, 1.55, 4.8, 3.65, 2.35, 0.48);
      box(redTile, s * 5.4, 2.86, 4.8, 3.85, 0.24, 0.92);
      stamp(round, vermilion, s * 5.4, 1.65, 5.06, 0.58, 0.12, 0.58, 0, Math.PI / 2);
      stamp(round, gold, s * 5.4, 1.65, 5.12, 0.36, 0.1, 0.36, 0, Math.PI / 2);
    }

    // Main Tam Quan gatehouse behind Nghi Môn (3 genuinely open vaulted arches)
    vaultedBay(T, kit, 0, -1.6, 5.0, 4.65, 1.75, 2.35, 3.4, goldWall, cream, vermilion);
    for (const s of [-1, 1]) {
      vaultedBay(T, kit, s * 4.2, -1.6, 3.4, 3.85, 0.96, 1.85, 2.5, goldWall, cream, vermilion);
      // Open red wooden doors
      box(vermilion, s * 1.48, 1.55, -1.6, 0.14, 2.75, 1.15, s * 0.25);
    }
    box(vermilion, 0, 4.35, 0.16, 4.75, 0.78, 0.14);
    sign('ĐỀN ÔNG HOÀNG MƯỜI', 0, 4.35, 0.25, 4.25, 0.52);

    // Double-tier sweeping terracotta roofs over Tam Quan
    window.CentralArch.curvedRoof(T, kit, 0, 4.72, -1.6, 13.4, 5.2, 1.28, redTile, cream, gold, 0.36);
    box(vermilion, 0, 6.28, -1.6, 6.2, 1.48, 2.65);
    for (const x of [-2.4, -0.8, 0.8, 2.4]) box(gold, x, 6.28, -0.24, 0.16, 1.32, 0.08);
    window.CentralArch.curvedRoof(T, kit, 0, 6.95, -1.6, 8.2, 4.15, 1.24, redTile, cream, gold, 0.3);

    // Twin dragons & pearl on main ridge
    for (const s of [-1, 1]) {
      outline([[-0.9, 0], [-0.55, 0.25], [-0.15, 0.18], [0.06, 0.58], [0.3, 0.44], [0.46, 0.18], [0.1, 0.04]],
        gold, s * 1.05, 8.28, -1.7, 0.2, s > 0 ? Math.PI : 0);
    }
    const pearl = new T.SphereGeometry(0.28, 12, 8);
    stamp(pearl, gold, 0, 8.85, -1.6, 1, 1, 0.5);
    pearl.dispose();

    // Flanking octagonal pavilions (Lầu Cô / Lầu Cậu) inside courtyard corners
    for (const s of [-1, 1]) {
      const lx = s * 8.6, lz = -3.2;
      tapered(stone, lx, 0.45, lz, 2.15, 2.02, 0.55, 1, 8);
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        stamp(round, vermilion, lx + Math.sin(a) * 1.58, 2.1, lz + Math.cos(a) * 1.58, 0.12, 2.8, 0.12);
      }
      tapered(redTile, lx, 4.15, lz, 2.55, 0.18, 1.45, 1, 8);
      tapered(gold, lx, 5.05, lz, 0.22, 0.04, 0.45, 1, 8);
    }
  }

  // 5. Cột mốc Km số 0 – Đường Hồ Chí Minh (Tân Kỳ, Nghệ An)
  function km0HoChiMinh(T, kit) {
    const {box, stamp, outline, round, tapered, sign, wavingFlag} = kit;
    const granite = 0xd6d2c7, darkGranite = 0x5c5b58, redCap = 0xb52b27, gold = 0xdcb44c, stone = 0xa9a59b;
    kit.palette({stone: [granite, darkGranite, stone]});

    // Broad octagonal ceremonial plaza
    tapered(stone, 0, 0.14, 0, 13.8, 13.5, 0.28, 1, 8);
    tapered(granite, 0, 0.36, 0, 10.6, 10.3, 0.24, 1, 8);
    tapered(darkGranite, 0, 0.62, 0, 5.6, 5.15, 0.32, 1, 8);
    tapered(granite, 0, 0.96, 0, 3.6, 3.15, 0.38, 1, 4);

    // Approach steps (+Z facing Ho Chi Minh Highway)
    for (let i = 0; i < 3; i++) box(granite, 0, 0.1 + i * 0.13, 12.6 - i * 0.45, 5.8, 0.14, 0.52);

    // Monumental Km 0 Obelisk / Milestone (Cột mốc Km 0 màu trắng đầu đỏ)
    box(darkGranite, 0, 1.55, 0, 2.45, 0.85, 2.45);
    box(granite, 0, 4.25, 0, 1.88, 4.65, 1.88);
    // Beveled red top crown typical of Vietnam highway milestones
    box(redCap, 0, 7.12, 0, 1.94, 1.18, 1.94);
    tapered(redCap, 0, 8.05, 0, 1.36, 0.28, 0.72, 1, 4);
    // Gold emblem & Km 0 signboard on both front (+Z) and back (-Z)
    for (const f of [-1, 1]) {
      box(redCap, 0, 5.35, f * 0.97, 1.48, 0.92, 0.06);
      box(gold, 0, 5.35, f * 1.01, 0.44, 0.44, 0.04, 0, 0, Math.PI / 4);
      sign('KM 0', 0, 3.92, f * 0.99, 1.68, 0.64);
      sign('ĐƯỜNG HỒ CHÍ MINH', 0, 2.95, f * 0.99, 1.76, 0.42);
    }

    // Sculpted Trường Sơn relief wing walls curving behind the milestone (-Z)
    for (const s of [-1, 1]) {
      const rx = s * 5.6, rz = -4.2, a = -s * 0.36;
      const nx = Math.sin(a), nz = Math.cos(a);
      box(darkGranite, rx, 0.55, rz, 6.4, 0.65, 1.1, a);
      box(0xb99d7a, rx, 2.35, rz, 5.8, 3.0, 0.65, a);
      box(0x8c7054, rx + nx * 0.34, 2.35, rz + nz * 0.34, 5.2, 2.2, 0.08, a);
      box(darkGranite, rx, 3.98, rz, 6.2, 0.32, 0.86, a);
    }

    // Ceremonial flagpole with waving Vietnamese flag beside the plaza
    stamp(round, darkGranite, -7.8, 0.55, 2.4, 0.62, 0.72, 0.62);
    stamp(round, 0xbec2c4, -7.8, 6.9, 2.4, 0.1, 12.2, 0.1);
    wavingFlag(3.6, 2.4, -7.7, 12.6, 2.4);

    // Traditional memorial pavilion (Nhà bia) behind the relief walls
    box(stone, 0, 0.52, -9.2, 8.8, 0.64, 5.2);
    for (const x of [-3.4, -1.15, 1.15, 3.4]) for (const z of [-11.1, -7.3]) {
      stamp(round, 0x7c3627, x, 2.25, z, 0.16, 2.9, 0.16);
    }
    box(darkGranite, 0, 2.15, -9.2, 1.75, 2.45, 0.42);
    window.CentralArch.curvedRoof(T, kit, 0, 3.68, -9.2, 9.8, 6.2, 1.45, 0x984231, stone, granite, 0.34);

    // Perimeter stone bollards
    for (let i = 0; i < 8; i++) {
      const a = (i + 0.5) * Math.PI / 4;
      if (Math.cos(a) > 0.72) continue;
      stamp(round, darkGranite, Math.sin(a) * 11.4, 0.72, Math.cos(a) * 11.4, 0.22, 0.92, 0.22);
    }
  }

  // Fit the gate and its ramparts on the island between the two lanes of H?o Th?nh.
  const vinhScale = 0.48;
  const vinhSolids = [...archPiers(0, 0, 14.2, 2.35, 7.6), [-10.6, 0, 4.4, 2.5], [10.6, 0, 4.4, 2.5]];
  (window.VietnamSights ??= []).push({
    id: 'thanh-co-vinh', name: 'Cửa Tiền Thành cổ Vinh', city: 'Vinh', province: 'Nghệ An', region: 'Trung Bộ',
    lon: 105.669318, lat: 18.667836, start: [105.669320, 18.667493], yaw: 0,
    scale: [vinhScale, vinhScale, vinhScale], width: 31 * vinhScale, depth: 26 * vinhScale,
    solids: vinhSolids.map(rect => rect.map(value => value * vinhScale)),
    description: 'Cổng chính phía Nam của Thành cổ Vinh kiểu Vauban thời vua Minh Mạng, gồm vòm đá ong gạch vồ, cầu qua hào và vọng lâu hai tầng mái đao.',
    photo: 'https://baonghean.vn/cong-thanh-co-vinh-lan-dau-tien-dep-lung-linh-duoi-anh-den-10226330.html',
    source: 'https://visitnghean.gov.vn/diem-tham-quan/thanh-co-vinh',
    map: 'https://www.openstreetmap.org/way/1525796404',
    build: thanhCoVinh
  }, {
    id: 'lang-sen', name: 'Nhà Bác Hồ ở Làng Sen', city: 'Nam Đàn', province: 'Nghệ An', region: 'Trung Bộ',
    lon: 105.555320, lat: 18.675350, start: [105.556010, 18.676230], yaw: -0.59, width: 24, depth: 18,
    solids: [[0, -1.8, 7.6, 3.3], [-8.35, 3.65, 2.2, 4.0]],
    description: 'Ngôi nhà tranh năm gian mái rạ, vách liếp tre cùng hàng rào dâm bụt, nhà ngang và hàng cau xanh tại quê nội Kim Liên, Nam Đàn.',
    photo: 'https://baonghean.vn/binh-yen-nhung-nep-nha-tranh-noi-que-bac-10198832.html',
    source: 'https://vi.wikipedia.org/wiki/Khu_di_t%C3%ADch_l%E1%BB%8Bch_s%E1%BB%AD_Kim_Li%C3%AAn',
    map: 'https://www.openstreetmap.org/way/241936043',
    build: langSen
  }, {
    id: 'den-cuong', name: 'Tam Quan Đền Cuông', city: 'Diễn Châu', province: 'Nghệ An', region: 'Trung Bộ',
    lon: 105.60412, lat: 18.90220, start: [105.603762, 18.902334], yaw: -1.85, width: 21, depth: 9.5,
    solids: [
      ...archPiers(0, 0, 5.4, 1.72, 3.1), ...archPiers(-5.2, 0, 4.2, 1.15, 2.2), ...archPiers(5.2, 0, 4.2, 1.15, 2.2),
      [-8.15, 0.2, 0.58, 0.58], [8.15, 0.2, 0.58, 0.58]
    ],
    description: 'Cổng tam quan cổ kính ba tầng lầu bên Quốc lộ 1 dưới chân núi Mộ Dạ, nổi bật với lớp rễ cây si cổ thụ phủ kín tường gạch rêu phong.',
    photo: 'https://baonghean.vn/ve-dep-co-kinh-cua-den-thieng-tren-nui-mo-da-10269873.html',
    source: 'https://visitnghean.gov.vn/diem-tham-quan/den-cuong',
    map: 'https://www.openstreetmap.org/?mlat=18.9022&mlon=105.60412#map=18/18.9022/105.60412',
    build: denCuong
  }, {
    id: 'den-hoang-muoi', name: 'Đền Ông Hoàng Mười', city: 'Hưng Nguyên', province: 'Nghệ An', region: 'Trung Bộ',
    lon: 105.69158, lat: 18.64104, start: [105.691631, 18.640859], yaw: 0.17, width: 24, depth: 16,
    solids: [
      ...archPiers(0, -1.6, 5.0, 1.75, 3.4), ...archPiers(-4.2, -1.6, 3.4, 0.96, 2.5), ...archPiers(4.2, -1.6, 3.4, 0.96, 2.5),
      [-7.6, 4.8, 0.6, 0.6], [-3.2, 4.8, 0.7, 0.7], [3.2, 4.8, 0.7, 0.7], [7.6, 4.8, 0.6, 0.6],
      [-5.4, 4.8, 1.825, 0.24], [5.4, 4.8, 1.825, 0.24]
    ],
    description: 'Nghi môn tứ trụ, sân gạch đỏ và cổng tam quan mái đao lưỡng long chầu nguyệt của Mỏ Hạc Linh Từ bên nhánh sông Lam.',
    photo: 'https://baonghean.vn/hang-van-nguoi-chiem-bai-den-ong-hoang-muoi-nhung-ngay-dau-nam-10268484.html',
    source: 'https://visitnghean.gov.vn/diem-tham-quan/den-hoang-muoi',
    map: 'https://www.openstreetmap.org/node/6322104886',
    build: denHoangMuoi
  }, {
    id: 'km0-ho-chi-minh', name: 'Cột mốc Km 0 Đường Hồ Chí Minh', city: 'Tân Kỳ', province: 'Nghệ An', region: 'Trung Bộ',
    lon: 105.268949, lat: 19.044563, start: [105.268949, 19.044830], yaw: Math.PI, width: 26, depth: 25,
    solids: [[0, 0, 2.2, 2.2], [-5.6, -4.2, 3.0, 1.0], [5.6, -4.2, 3.0, 1.0], [0, -9.2, 4.4, 2.6]],
    description: 'Điểm khởi đầu huyền thoại của tuyến đường Trường Sơn – Đường Hồ Chí Minh tại thị trấn Tân Kỳ, với cột mốc đá granit đầu đỏ, phù điêu và nhà bia.',
    photo: 'https://baonghean.vn/cot-moc-so-0-noi-bat-dau-con-duong-huyen-thoai-10295387.html',
    source: 'https://visitnghean.gov.vn/diem-tham-quan/dia-diem-moc-so-o%2C-duong-chien-luoc-ho-chi-minh-%281973%29',
    map: 'https://www.openstreetmap.org/node/9331310775',
    build: km0HoChiMinh
  });
})();

export default window.VietnamSights;
