'use strict';
(() => {
  const A = window.CentralArch;

  // 1. Điện Thái Hòa (Đại Nội Huế) — trùng thiềm điệp ốc mái hoàng lưu ly
  function dienThaiHoa(T, kit) {
    const { box, stamp, round } = kit;
    const goldTile = 0xd9a232, crimson = 0x7e2119, gold = 0xe8bd4c, stone = 0xa7a194, darkStone = 0x7c766c;
    const lacquer=0x6e3329, shadow=0x392b26, lime=0xe5d9c3, ridge=0x837861;
    kit.palette({glazedTile:goldTile,stone:[stone,darkStone,ridge],timber:[crimson,lacquer],plaster:lime});

    // Two-tier imperial stone terrace (Sân Đại Triều Nghi)
    box(darkStone, 0, 0.55, 0.8, 34, 1.1, 24);
    box(stone, 0, 1.45, -0.5, 29, 0.75, 19);
    // Triple imperial stone stairs with dragon balustrades
    for (const sx of [-7.5, 0, 7.5]) {
      A.steps(kit, sx, 10.6, sx === 0 ? 5.6 : 3.2, 1.8, 6, 0.28, 0.42, stone);
    }
    // Front & rear interconnected twin halls (trùng thiềm điệp ốc)
    for (const [hz, hw, hd] of [[2.8, 25.5, 7.8], [-4.8, 23.0, 7.6]]) {
      // Recess the screen doors behind the columns. Each leaf has a solid
      // lower panel and narrow slats across the shaded upper opening.
      box(shadow,0,3.85,hz-.5,hw-1.5,4.08,hd-2.4);
      const doorZ=hz+hd*.5-1.64, bay=hw*.11;
      for(let i=-4;i<4;i++){
        const bx=(i+.5)*bay;
        for(let j=0;j<4;j++){
          const lx=bx+(j-1.5)*bay*.226;
          box(lacquer,lx,2.76,doorZ,bay*.214,1.62,.13);
          box(crimson,lx,2.72,doorZ+.08,bay*.155,1.22,.08);
          for(const sign of [-1,1])box(crimson,lx+sign*bay*.094,4.53,doorZ,.062,1.88,.10);
          box(lacquer,lx,5.34,doorZ,bay*.224,.22,.13);
        }
      }
      for(const side of [-1,1]){
        box(lime,side*(hw*.5-.57),3.86,hz,1.15,4.08,hd-.32);
        stamp(round,shadow,side*(hw*.5-.57),4.15,hz+hd*.5-.13,.38,.12,.38,0,Math.PI/2);
      }
      box(lacquer,0,5.68,hz+hd*.45,hw-.35,.36,.35);
      for (let i = -4; i <= 4; i++) {
        for (const dz of [-hd * 0.45, hd * 0.45]) {
          stamp(round, crimson, i * (hw * 0.11), 3.85, hz + dz, 0.22, 4.2, 0.22);
          stamp(round, stone, i * (hw * 0.11), 1.95, hz + dz, 0.34, 0.30, 0.34);
        }
      }
      A.curvedRoof(T, kit, 0, 5.9, hz, hw + 2.6, hd + 2.4, 2.05, goldTile, ridge, ridge, 0.34, { dragons: true, goldColor: gold });
    }
    // Upper clerestory frieze (cổ diêm) & second golden roof tier over main hall
    box(0x8c281e, 0, 7.9, -4.8, 17.5, 1.55, 5.6);
    for (let i=-8;i<=8;i++){
      const x=i*.98;
      box(0xbba782,x,7.92,-1.965,.94,.89,.14);
      box(i%2===0?0x667f82:0xb0a06e,x,7.92,-1.87,.78,.68,.07);
      box(0x987442,x,7.92,-1.816,.27,.26,.038,0,0,Math.PI/4);
    }
    A.curvedRoof(T, kit, 0, 8.68, -4.8, 20.5, 8.0, 2.25, goldTile, ridge, ridge, 0.32, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'THÁI HÒA ĐIỆN', 0, 5.44, 6.56, 3.6, 0.66, { bg: '#7c1c14', fg: '#f8dc76' });
  }

  // 2. Hiển Lâm Các & Cửu Đỉnh (Thế Miếu, Đại Nội Huế)
  function hienLamCac(T, kit) {
    const { box, stamp, round } = kit;
    const tile = 0x8f4230, crimson = 0x78231a, ochre = 0xe4cf9d, gold = 0xd8ad4a;
    kit.palette({tile, plaster: ochre});

    // Stepped courtyard platform
    box(0x9a9386, 0, 0.45, 1.5, 22, 0.9, 18);
    // 3-tier towering timber royal pavilion (17m tall)
    box(ochre, 0, 2.8, -2.2, 12.2, 3.8, 7.6);
    for (const x of [-5.6, -2.8, 0, 2.8, 5.6]) for (const z of [-5.8, 1.4]) stamp(round, crimson, x, 2.8, z, 0.19, 3.9, 0.19);
    A.curvedRoof(T, kit, 0, 4.7, -2.2, 14.8, 9.8, 1.65, tile, gold, gold, 0.32);

    box(crimson, 0, 7.6, -2.2, 8.4, 3.0, 5.6);
    for (const dx of [-2.4, 0, 2.4]) box(gold, dx, 7.6, 0.65, 1.1, 1.75, 0.08);
    A.curvedRoof(T, kit, 0, 9.1, -2.2, 11.2, 7.8, 1.55, tile, gold, gold, 0.30);

    box(ochre, 0, 11.6, -2.2, 5.4, 2.2, 4.0);
    A.curvedRoof(T, kit, 0, 12.7, -2.2, 8.2, 6.0, 1.65, tile, gold, gold, 0.26, { dragons: true, goldColor: gold });
    A.plaque(T, kit, 'HIỂN LÂM CÁC', 0, 4.9, 2.1, 3.6, 0.68, { bg: '#6e2018', fg: '#f6d874' });

    // Nine Dynastic Bronze Urns (Cửu Đỉnh) standing in a line across the forecourt!
    for (let i = -4; i <= 4; i++) {
      const ux = i * 2.15, uz = 6.2 + (i === 0 ? 0.55 : 0);
      box(0x888276, ux, 1.05, uz, 1.15, 0.42, 1.15);
      stamp(round, 0x4b4235, ux, 1.95, uz, 0.44, 1.38, 0.44);
      stamp(round, 0x5c503e, ux, 2.65, uz, 0.52, 0.22, 0.52);
    }
  }

  // 3. Cửa Hiển Nhơn (Cổng Đông Đại Nội — khảm sành sứ ngũ sắc rực rỡ)
  function cuaHienNhon(T, kit) {
    A.tamQuan(T, kit, {
      wall: 0xe6d298, trim: 0x2e7d78, dark: 0x3b4844, tile: 0x2c7864, ridge: 0xdca846, eave: 0xd94b32,
      wCenter: 5.8, wSide: 3.8, depth: 3.4, hCenter: 5.4, hSide: 3.8, twoTierSides: true,
      title: 'HIỂN NHƠN MÔN', plaque: { bg: '#1e5b54', fg: '#f8da76' }
    });
  }

  // 4. Lăng Minh Mạng (Hiếu Lăng) — Minh Lâu 2 tầng mái hoàng lưu ly & hồ sen
  function langMinhMang(T, kit) {
    const { box, stamp, round } = kit;
    const goldTile = 0xd69f34, crimson = 0x7c231b, stone = 0x9b9487, water = 0x386670;
    kit.palette({glazedTile: goldTile, stone});

    // Reflecting Tân Nguyệt / Trừng Minh lotus basin & stone bridge approach
    box(water, 0, 0.08, 7.6, 26, 0.16, 8.2);
    box(stone, 0, 0.32, 7.6, 4.6, 0.52, 8.8);
    for (const s of [-1, 1]) box(0xb8b0a2, s * 2.15, 0.88, 7.6, 0.28, 0.68, 8.6);

    // Three-tier stepped square stone mound supporting Minh Lâu (Pavilion of Light)
    box(0x888175, 0, 0.75, -2.5, 19.5, 1.5, 17.5);
    box(stone, 0, 1.85, -2.5, 15.0, 0.85, 13.5);
    A.steps(kit, 0, 4.8, 5.2, 1.6, 6, 0.34, 0.38, stone);

    // Iconic 2-tier square Minh Lâu pavilion with royal yellow-glazed curved eaves
    box(crimson, 0, 4.35, -2.5, 9.6, 4.1, 9.6);
    for (const x of [-4.5, -1.6, 1.6, 4.5]) for (const z of [-7.0, 2.0]) stamp(round, crimson, x, 4.35, z, 0.18, 4.2, 0.18);
    A.curvedRoof(T, kit, 0, 6.4, -2.5, 12.6, 12.6, 1.75, goldTile, 0xe8bd4c, 0xe8bd4c, 0.24);
    box(0x8a2a20, 0, 9.1, -2.5, 6.2, 2.4, 6.2);
    A.curvedRoof(T, kit, 0, 10.3, -2.5, 9.0, 9.0, 1.85, goldTile, 0xe8bd4c, 0xe8bd4c, 0.18, { dragons: true });
    A.plaque(T, kit, 'LĂNG MINH MẠNG', 0, 6.55, 2.6, 3.8, 0.68, { bg: '#751e16', fg: '#f8da74' });
    A.trees(T, kit, [
      { x: -12.5, z: -8.5, h: 11.5, kind: 'pine' }, { x: 12.5, z: -8.5, h: 11.0, kind: 'pine' },
      { x: -13.0, z: -1.5, h: 10.2, kind: 'pine' }, { x: 13.0, z: -1.5, h: 10.5, kind: 'pine' }
    ]);
  }

  // 5. Lăng Tự Đức (Khiêm Lăng) — Thủy tạ Xung Khiêm Tạ bên hồ Lưu Khiêm
  function langTuDuc(T, kit) {
    const { box, stamp, round } = kit;
    const water = 0x3b6a6e, wood = 0x5c2d1f, tile = 0x7c4a38, gold = 0xc99c4a;
    kit.palette({timber: wood, tile});

    // Lưu Khiêm lotus lake surrounding the poetic water pavilion
    box(water, 0, 0.08, 2.5, 28, 0.16, 20);
    // Stone lotus-pond shore embankment on back
    box(0x8f887b, 0, 0.55, -8.5, 28, 1.1, 5.2);

    // Xung Khiêm Tạ wooden pavilion perched on stone stilts over the water
    for (const x of [-6.2, -3.1, 0, 3.1, 6.2]) for (const z of [-1.2, 2.6, 6.4]) {
      stamp(round, 0x7c766b, x, 0.72, z, 0.18, 1.45, 0.18);
    }
    box(wood, 0, 1.52, 2.6, 13.8, 0.24, 9.2);
    // Intricate crimson wooden balustrade around water deck
    for (const s of [-1, 1]) {
      box(0x7c291e, s * 6.8, 2.08, 2.6, 0.14, 0.85, 9.0);
      box(0x7c291e, 0, 2.08, 2.6 + s * 4.5, 13.6, 0.85, 0.14);
    }
    // Timber pillars & curved roof of Xung Khiêm Tạ
    for (const x of [-5.8, -2.9, 0, 2.9, 5.8]) for (const z of [-1.0, 6.2]) {
      stamp(round, wood, x, 3.45, z, 0.17, 3.8, 0.17);
    }
    box(0xd9c79c, 0, 3.35, 1.6, 10.6, 3.4, 5.2);
    A.curvedRoof(T, kit, 0, 5.35, 2.6, 15.8, 11.4, 2.35, tile, 0xcab998, gold, 0.32, { dragons: true });
    // Wooden bridge linking to shore + Hòa Khiêm Điện hint
    box(wood, 0, 1.48, -4.5, 3.2, 0.22, 6.4);
    A.plaque(T, kit, 'LĂNG TỰ ĐỨC', 0, 5.45, 7.25, 3.6, 0.66, { bg: '#5e241b', fg: '#f6d876' });
    A.trees(T, kit, [
      { x: -11.5, z: -9.0, h: 11.8, kind: 'pine' }, { x: 11.5, z: -9.0, h: 11.2, kind: 'pine' },
      { x: -7.5, z: -9.2, h: 9.8, kind: 'pine' }, { x: 7.5, z: -9.2, h: 10.2, kind: 'pine' }
    ]);
  }

  // 6. Trường THPT Chuyên Quốc Học Huế (1896 — tường đỏ sậm đặc trưng)
  function truongQuocHocHue(T, kit) {
    const { box } = kit;
    const crimson = 0x8f332c, cream = 0xf4ead4, roof = 0x994230;
    kit.palette({plaster: cream});
    // Iconic deep-burgundy French-Indochinese school building
    A.colonialBuilding(T, kit, {
      w: 32, d: 13.5, floors: 2, floorH: 4.1,
      wall: crimson, trim: cream, shutter: 0x2c5642, roof,
      bays: 8, title: 'TRƯỜNG QUỐC HỌC HUẾ',
      plaque: { bg: '#73231d', fg: '#f8e4a8' }
    });
    // Iconic triple-arched crimson front gate facing Lê Lợi street
    A.vaultedBay(T, kit, 0, 11.2, 13.2, 4.6, 1.9, 2.35, 1.6, crimson, cream, 0x5c201b);
    for (const s of [-1, 1]) {
      A.vaultedBay(T, kit, s * 8.4, 11.2, 4.2, 3.4, 1.05, 1.75, 1.3, crimson, cream, 0x5c201b);
    }
    A.curvedRoof(T, kit, 0, 4.65, 11.2, 14.4, 3.2, 1.25, roof, cream, cream, 0.34);
    A.plaque(T, kit, 'QUỐC HỌC HUẾ', 0, 4.15, 12.1, 4.2, 0.68, { bg: '#73231d', fg: '#f8e29c' });
    A.trees(T, kit, [{ x: -13.5, z: 9.8, h: 9.2, kind: 'banyan' }, { x: 13.5, z: 9.8, h: 9.0, kind: 'banyan' }]);
  }

  // 7. Nhà thờ chính tòa Phủ Cam (Huế — KTS Ngô Viết Thụ, tháp đôi Kinh Thánh mở)
  function nhaThoPhuCam(T, kit) {
    const { box, outline, tapered } = kit;
    const concrete = 0xd6d1c6, darkConc = 0x8c887f, glass = 0x354b5e, gold = 0xdab252;
    kit.palette({plaster: [concrete, darkConc], glass});

    // Elevated hillside terrace & monumental broad entrance stairs
    box(darkConc, 0, 0.65, 1.0, 24, 1.3, 38);
    A.steps(kit, 0, 18.2, 14, 3.2, 7, 0.20, 0.45, concrete);

    // Modernist concrete ribbed nave with soaring vertical structural fins
    box(concrete, 0, 7.6, -2.5, 17.5, 12.6, 28);
    for (let z = -15.5; z <= 10.5; z += 3.25) {
      for (const s of [-1, 1]) {
        box(darkConc, s * 9.0, 7.8, z, 0.72, 13.4, 0.65);
        box(glass, s * 8.85, 7.8, z + 1.6, 0.14, 10.6, 1.85);
      }
    }
    // Sweeping concrete curved roof ribs
    A.gabledRoof(T, kit, 0, 13.9, -2.5, 18.8, 29.0, 4.2, darkConc, concrete);

    // Iconic twin soaring open-Bible concave bell towers (tháp đôi Phủ Cam)
    for (const s of [-1, 1]) {
      const tx = s * 6.4;
      const fin = [[-2.1 * s, 0], [-1.5 * s, 11.5], [-0.4 * s, 24.5], [1.4 * s, 26.8], [2.2 * s, 13.0], [2.1 * s, 0]];
      outline(s > 0 ? fin : [...fin].reverse(), concrete, tx, 1.3, 9.6, 3.6);
      box(glass, tx, 13.5, 13.28, 1.5, 18.5, 0.18);
      // Tall golden cross solidly anchored atop each tower peak
      box(gold, tx + s * 0.9, 28.6, 11.4, 0.22, 3.6, 0.22);
      box(gold, tx + s * 0.9, 29.4, 11.4, 1.8, 0.22, 0.22);
    }
    // Recessed modernist triple portal & overhanging concrete canopy
    box(0x282d32, 0, 4.2, 12.0, 8.8, 5.8, 0.35);
    box(concrete, 0, 8.6, 13.2, 11.2, 0.9, 4.2);
    A.plaque(T, kit, 'NHÀ THỜ PHỦ CAM', 0, 8.6, 15.38, 5.8, 0.78, { bg: '#e8e2d4', fg: '#443d36' });
  }

  // 8. Nhà thờ Dòng Chúa Cứu Thế Huế (giao thoa Á – Âu mái đao cong)
  function nhaThoDongChuaCuuThe(T, kit) {
    const { box, tapered } = kit;
    const wall = 0xe8d9be, brick = 0x994230, trim = 0xf4eee0;
    kit.palette({brick});
    // Nave topped with Vietnamese curved tile eaves!
    box(0x8e887d, 0, 0.45, 0, 18, 0.9, 32);
    box(wall, 0, 5.8, -1.5, 15.0, 9.8, 25.0);
    A.curvedRoof(T, kit, 0, 10.7, -1.5, 17.8, 27.5, 4.2, brick, trim, 0xd4a948, 0.36);

    // Tall central East-West pagoda-steeple bell tower
    box(wall, 0, 10.2, 11.2, 6.2, 18.6, 6.2);
    box(0x2d2420, 0, 3.2, 14.36, 3.2, 4.6, 0.15);
    for (const ty of [11.5, 16.5, 19.6]) {
      A.curvedRoof(T, kit, 0, ty, 11.2, 8.8 - (ty - 11.5) * 0.24, 8.8 - (ty - 11.5) * 0.24, 1.35, brick, trim, 0xd4a948, 0.22);
    }
    tapered(brick, 0, 22.8, 11.2, 1.85, 0.18, 4.4, 1, 4);
    box(0xe2b84c, 0, 26.2, 11.2, 0.18, 2.8, 0.18);
    box(0xe2b84c, 0, 26.8, 11.2, 1.45, 0.18, 0.18);
    A.plaque(T, kit, 'DÒNG CHÚA CỨU THẾ HUẾ', 0, 6.4, 14.4, 5.2, 0.72, { bg: '#f4e6c6', fg: '#782b20' });
  }

  // 9. Chợ Đông Ba (Bên sông Hương — lầu chuông bát giác trung tâm)
  function choDongBa(T, kit) {
    const { box, stamp, round } = kit;
    const ochre = 0xebce7a, cream = 0xf4ecd8, tile = 0x994230;
    kit.palette({plaster: [ochre, cream], tile});
    A.colonialBuilding(T, kit, {
      w: 34, d: 15, floors: 2, floorH: 3.9,
      wall: ochre, trim: cream, shutter: 0x385e4d, roof: tile,
      bays: 9, clock: true, title: 'CHỢ ĐÔNG BA',
      plaque: { bg: '#8a2b20', fg: '#f8dc7c' }
    });
    // Iconic central octagonal clock-bell tower rising from the center of Chợ Đông Ba
    const oct = new T.CylinderGeometry(3.4, 3.7, 4.4, 8);
    stamp(oct, ochre, 0, 12.6, 0); oct.dispose();
    const dome = new T.ConeGeometry(4.2, 2.8, 8);
    stamp(dome, tile, 0, 16.2, 0); dome.dispose();
    stamp(round, 0xdcb44e, 0, 18.2, 0, 0.12, 1.6, 0.12);
  }

  // 10. Hổ Quyền (Đấu trường voi – hổ hình vành khăn triều Nguyễn)
  function hoQuyenHue(T, kit) {
    const { box } = kit;
    const brick = 0x8f553d, mossBrick = 0x7b5642, mortar = 0xb9ac95, sand = 0xcbb68e;
    const segs = 28;
    const rOut = 17.5, rIn = 13.8, hOut = 5.4, hIn = 4.6;

    // Sandy circular fighting arena floor
    const floor = new T.CylinderGeometry(rIn + 0.4, rIn + 0.4, 0.24, segs);
    kit.palette({brick});
    kit.stamp(floor, sand, 0, 0.12, 0); floor.dispose();

    // Twin concentric circular brick arena walls
    for (let i = 0; i < segs; i++) {
      const a = (i + 0.5) * (Math.PI * 2) / segs;
      const segLenOut = (2 * Math.PI * rOut / segs) + 0.35;
      const segLenIn = (2 * Math.PI * rIn / segs) + 0.35;
      // Leave arched elephant entrance gap at i === 0 (+Z)
      if (i !== 0) {
        box(i % 3 ? brick : mossBrick, Math.sin(a) * rOut, hOut * 0.5, Math.cos(a) * rOut, segLenOut, hOut, 0.95, a);
        box(i % 2 ? mossBrick : brick, Math.sin(a) * rIn, hIn * 0.5, Math.cos(a) * rIn, segLenIn, hIn, 0.85, a);
        // Connecting terrace walkway between outer and inner ring walls
        box(mortar, Math.sin(a) * ((rOut + rIn) * 0.5), hIn - 0.15, Math.cos(a) * ((rOut + rIn) * 0.5), segLenOut * 0.92, 0.35, rOut - rIn + 0.4, a);
      }
      // Tiger cage arched dark openings around inner ring wall (5 cages on west/south arc)
      if (i >= 11 && i <= 15) {
        box(0x281e1a, Math.sin(a) * (rIn - 0.45), 1.45, Math.cos(a) * (rIn - 0.45), 1.65, 2.6, 0.25, a);
      }
    }
    // Royal viewing stand (Khán đài nhà vua) on the north rim (-Z)
    box(0xd9c698, 0, hOut + 1.15, -rOut + 1.6, 9.5, 2.2, 4.6);
    A.curvedRoof(T, kit, 0, hOut + 2.25, -rOut + 1.6, 11.4, 6.2, 1.45, 0x8b4230, mortar, 0xd4a84c, 0.30);
    // Arched elephant entry gate on +Z
    A.vaultedBay(T, kit, 0, rOut - 1.2, 6.2, 5.8, 1.8, 2.5, 4.2, brick, mortar, 0x5c4f44);
    A.plaque(T, kit, 'HỔ QUYỀN', 0, 5.15, rOut + 1.0, 3.2, 0.62, { bg: '#efe0b8', fg: '#6b2d22' });
  }

  // 11. Chùa Từ Hiếu (Huế — hồ bán nguyệt & thiền viện rừng thông)
  function chuaTuHieu(T, kit) {
    const { box } = kit;
    // Crescent half-moon lotus pond (hồ bán nguyệt) in front of the pagoda
    const pond = new T.CylinderGeometry(8.5, 8.5, 0.18, 20, 1, false, -Math.PI / 2, Math.PI);
    kit.stamp(pond, 0x3b6a64, 0, 0.09, 7.2); pond.dispose();
    box(0x8e877a, 0, 0.28, 11.2, 3.2, 0.45, 8.6);
    A.tamQuan(T, kit, {
      wall: 0xcabca0, trim: 0x998e7b, tile: 0x764232, ridge: 0xbcb099, eave: 0xa69478,
      wCenter: 4.8, wSide: 3.4, depth: 2.6, hCenter: 4.4, hSide: 3.2, twoTierSides: false,
      title: 'CHÙA TỪ HIẾU'
    });
    // Quiet dark-timber Zen sanctuary behind the courtyard
    box(0x90877a, 0, 0.4, -7.8, 15.2, 0.8, 8.2);
    box(0x633a28, 0, 2.4, -8.0, 13.6, 3.2, 6.6);
    A.curvedRoof(T, kit, 0, 4.0, -7.8, 16.4, 9.2, 2.2, 0x764232, 0xbcb099, 0xa69478, 0.30);
    A.trees(T, kit, [
      { x: -11.5, z: -4.0, h: 11.5, kind: 'pine' }, { x: 11.5, z: -4.0, h: 12.0, kind: 'pine' },
      { x: -10.8, z: 4.5, h: 10.2, kind: 'pine' }, { x: 10.8, z: 4.5, h: 10.5, kind: 'pine' }
    ]);
  }

  // 12. Chùa Báo Quốc (Đồi Hàm Long, Huế)
  function chuaBaoQuoc(T, kit) {
    A.tamQuan(T, kit, {
      wall: 0xe2ce9e, trim: 0xc2a165, tile: 0x94402e, ridge: 0xd9c292, eave: 0xd2a44c,
      wCenter: 5.2, wSide: 3.6, depth: 2.8, hCenter: 4.8, hSide: 3.5, twoTierSides: true,
      title: 'CHÙA BÁO QUỐC'
    });
    A.octagonalTower(T, kit, 10.8, -5.5, {
      tiers: 5, baseR: 2.4, tierH: 1.85, wall: 0xeee6d4, tile: 0x94402e, trim: 0xd2a44c
    });
    kit.box(0xe2ce9e, -1.5, 2.5, -7.8, 14.0, 3.6, 6.8);
    A.curvedRoof(T, kit, -1.5, 4.3, -7.8, 16.2, 8.8, 2.25, 0x94402e, 0xd9c292, 0xd2a44c, 0.30, { dragons: true });
    A.trees(T, kit, [{ x: -11.5, z: -3.5, h: 9.8, kind: 'banyan' }]);
  }

  // 13. Tàng Thư Lâu (Thư viện Hoàng gia triều Nguyễn giữa hồ Học Hải)
  function tangThuLau(T, kit) {
    const { box } = kit;
    // Square masonry island surrounded by Học Hải moat water + stone access bridge
    box(0x3a6772, 0, 0.08, 0, 34, 0.16, 26);
    box(0x8c8578, 0, 0.65, 0, 24, 1.3, 16);
    box(0x9a9284, 0, 0.68, 10.4, 3.6, 1.25, 6.5);
    A.colonialBuilding(T, kit, {
      w: 20.5, d: 11.2, floors: 2, floorH: 3.6,
      wall: 0xe6d3a0, trim: 0xf0e4c6, shutter: 0x6b2c22, roof: 0x8d4230,
      bays: 7, title: 'TÀNG THƯ LÂU',
      plaque: { bg: '#6e231a', fg: '#f6d876' }
    });
  }

  // 14. Hải đăng Thuận An (Cửa biển Thuận An)
  function haiDangThuanAn(T, kit) {
    A.lighthouse(T, kit, {
      h: 18, rBase: 2.4, rTop: 1.6, body: 0xf1ece0, band: 0xd69a38, dome: 0x9c3226,
      striped: false, title: 'HẢI ĐĂNG THUẬN AN'
    });
  }

  const sights = [
    {
      id: 'dien-thai-hoa', name: 'Điện Thái Hòa', city: 'Đại Nội Huế', province: 'Huế',
      lon: 107.578387, lat: 16.468743, yaw: 0.623, width: 35, depth: 26,
      start: [107.578560, 16.465820], viewDistance: 1350,
      map: 'https://www.openstreetmap.org/way/531031566',
      source: 'https://hueworldheritage.org.vn/',
      build: dienThaiHoa
    },
    {
      id: 'hien-lam-cac', name: 'Hiển Lâm Các & Cửu Đỉnh', city: 'Đại Nội Huế', province: 'Huế',
      lon: 107.577063, lat: 16.466738, yaw: -2.489, width: 22, depth: 20,
      start: [107.5785552, 16.4658240], viewDistance: 1200, visitOnArrival: true,
      arrivalNote: 'Xe dừng trên đường dẫn tới Ngọ Môn. Hiển Lâm Các và Cửu Đỉnh nằm trong khu Thế Miếu của Hoàng thành.',
      catalogId: 'osm-way-172657564', map: 'https://www.openstreetmap.org/way/172657564',
      source: 'https://hueworldheritage.org.vn/',
      build: hienLamCac
    },
    {
      id: 'cua-hien-nhon', name: 'Cửa Hiển Nhơn', city: 'Đại Nội Huế', province: 'Huế',
      lon: 107.580250, lat: 16.471650, yaw: 2.218, width: 18, depth: 8,
      start: [107.580409, 16.471765],
      solids: [...A.archPiers(0, 0, 5.8, 1.74, 3.4), [-6.2, 0, 2.2, 1.8], [6.2, 0, 2.2, 1.8]],
      map: 'https://www.openstreetmap.org/#map=18/16.47165/107.58025',
      source: 'https://hueworldheritage.org.vn/',
      build: cuaHienNhon
    },
    {
      id: 'lang-minh-mang', name: 'Lăng Minh Mạng', city: 'Hương Trà', province: 'Huế',
      lon: 107.570750, lat: 16.387950, yaw: 0.876, width: 28, depth: 24,
      start: [107.571760, 16.387140], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/#map=17/16.38795/107.57075',
      source: 'https://hueworldheritage.org.vn/',
      build: langMinhMang
    },
    {
      id: 'lang-tu-duc', name: 'Lăng Tự Đức', city: 'TP. Huế', province: 'Huế',
      lon: 107.565950, lat: 16.432650, yaw: 0.606, width: 28, depth: 24,
      start: [107.566797, 16.431472], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/#map=17/16.43265/107.56595',
      source: 'https://hueworldheritage.org.vn/',
      build: langTuDuc
    },
    {
      id: 'truong-quoc-hoc-hue', name: 'Trường Quốc Học Huế', city: 'TP. Huế', province: 'Huế',
      lon: 107.584450, lat: 16.461650, yaw: 2.293, width: 34, depth: 26,
      start: [107.584560, 16.461743],
      map: 'https://www.openstreetmap.org/#map=18/16.46165/107.58445',
      source: 'https://visithue.vn/',
      build: truongQuocHocHue
    },
    {
      id: 'nha-tho-phu-cam', name: 'Nhà thờ Phủ Cam', city: 'TP. Huế', province: 'Huế',
      lon: 107.587743, lat: 16.452642, yaw: -0.051, width: 24, depth: 38,
      start: [107.587724, 16.452278], viewDistance: 1300,
      map: 'https://www.openstreetmap.org/way/118792054',
      source: 'https://visithue.vn/',
      build: nhaThoPhuCam
    },
    {
      id: 'nha-tho-dong-chua-cuu-the', name: 'Nhà thờ Dòng Chúa Cứu Thế Huế', city: 'TP. Huế', province: 'Huế',
      lon: 107.595360, lat: 16.457966, yaw: 0.440, width: 18, depth: 34,
      start: [107.595549, 16.457578], viewDistance: 1200,
      map: 'https://www.openstreetmap.org/way/1172894102',
      source: 'https://visithue.vn/',
      build: nhaThoDongChuaCuuThe
    },
    {
      id: 'cho-dong-ba', name: 'Chợ Đông Ba', city: 'TP. Huế', province: 'Huế',
      lon: 107.586100, lat: 16.471550, yaw: -1.946, width: 35, depth: 18,
      start: [107.585706, 16.471699],
      map: 'https://www.openstreetmap.org/#map=18/16.47155/107.58610',
      source: 'https://visithue.vn/',
      build: choDongBa
    },
    {
      id: 'ho-quyen-hue', name: 'Hổ Quyền', city: 'TP. Huế', province: 'Huế',
      lon: 107.554480, lat: 16.448548, yaw: -1.571, width: 38, depth: 38,
      start: [107.554310, 16.448548], viewDistance: 1200,
      map: 'https://www.openstreetmap.org/relation/19381147',
      source: 'https://hueworldheritage.org.vn/',
      build: hoQuyenHue
    },
    {
      id: 'chua-tu-hieu', name: 'Chùa Từ Hiếu', city: 'TP. Huế', province: 'Huế',
      lon: 107.571989, lat: 16.438910, yaw: -2.439, width: 26, depth: 26,
      start: [107.571465, 16.439506],
      map: 'https://www.openstreetmap.org/way/519775822',
      source: 'https://visithue.vn/',
      build: chuaTuHieu
    },
    {
      id: 'chua-bao-quoc', name: 'Chùa Báo Quốc', city: 'TP. Huế', province: 'Huế',
      lon: 107.579682, lat: 16.454238, yaw: 0.469, width: 28, depth: 22,
      start: [107.580059, 16.453521],
      map: 'https://www.openstreetmap.org/way/1170979640',
      source: 'https://visithue.vn/',
      build: chuaBaoQuoc
    },
    {
      id: 'tang-thu-lau', name: 'Tàng Thư Lâu', city: 'TP. Huế', province: 'Huế',
      lon: 107.576631, lat: 16.480918, yaw: -0.929, width: 34, depth: 26,
      start: [107.575939, 16.480420],
      map: 'https://www.openstreetmap.org/way/173151284',
      source: 'https://hueworldheritage.org.vn/',
      build: tangThuLau
    }];

  window.VietnamSights = (window.VietnamSights || []).concat(sights);
})();
