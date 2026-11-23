'use strict';
(() => {
  const A = window.CentralArch;

  // 1. Cầu Hàm Rồng (TP. Thanh Hóa, sông Mã — 2 nhịp vòm dàn thép lịch sử)
  function cauHamRong(T, kit) {
    const { box, stamp, round } = kit;
    // Iconic massive central granite river pier between the 2 historic parabolic steel spans
    box(0x8c867a, 0, -4.8, 0, 7.6, 8.6, 16.5);
    for (const s of [-1, 1]) stamp(round, 0x827c71, 0, -4.8, s * 8.2, 3.6, 8.4, 3.6);
    A.steelTrussBridge(T, kit, {
      len: 164, w: 12.0, spans: 2, archH: 13.5,
      steel: 0x5c686d, steelDark: 0x3e484d, pierColor: 0x8f897d, arched: true
    });
    // Historic deck slab (since railway/old bridge sits beside the viewing road)
    box(0x737677, 0, -0.35, 0, 164, 0.55, 11.4);
  }

  // 2. Chính điện Lam Kinh (Thọ Xuân, Thanh Hóa — Kinh đô nhà Hậu Lê)
  function chinhDienLamKinh(T, kit) {
    const { box } = kit;
    // Grand Sân Rồng stone terrace & two-tier imperial Later Lê wooden palace
    box(0x8f887b, 0, 0.55, 1.8, 30, 1.1, 24);
    A.vietnameseHall(T, kit, {
      w: 22.0, d: 13.0, baseH: 1.55, colH: 3.9, bays: 7,
      wall: 0xd9c79b, wood: 0x5c2419, tile: 0x99412b, ridge: 0xd9b35a, eave: 0xd4a64a,
      doubleTier: true, atticColor: 0x7e251a,
      title: 'CHÍNH ĐIỆN LAM KINH', plaque: { bg: '#6e1f16', fg: '#f8da74' }
    });
    // Iconic Vĩnh Lăng Stone Stele resting on a carved stone turtle in the forecourt
    box(0x7c766b, 9.2, 1.35, 9.2, 2.2, 0.65, 2.8);
    box(0x4b4640, 9.2, 2.95, 9.2, 1.55, 2.65, 0.36);
    A.curvedRoof(T, kit, 9.2, 4.45, 9.2, 4.2, 4.2, 1.05, 0x99412b, 0xd9b35a, 0xd4a64a, 0.18);
    A.trees(T, kit, [
      { x: -14.2, z: 3.5, h: 11.2, kind: 'banyan' }, { x: 14.2, z: -3.0, h: 10.5, kind: 'banyan' }
    ]);
  }

  // 3. Đền Bà Triệu (Núi Gai, Hậu Lộc, Thanh Hóa)
  function denBaTrieu(T, kit) {
    const { box, stamp, round } = kit;
    A.tamQuan(T, kit, {
      wall: 0xe3cf9e, trim: 0xc2a062, tile: 0x96402c, ridge: 0xd8c290, eave: 0xd2a44c,
      wCenter: 5.2, wSide: 3.6, depth: 2.8, hCenter: 4.8, hSide: 3.5, twoTierSides: true,
      title: 'ĐỀN BÀ TRIỆU', plaque: { bg: '#732118', fg: '#f6d874' }
    });
    // Main sanctuary hall behind Tam Quan
    box(0x90887b, 0, 0.45, -8.5, 16.5, 0.9, 8.8);
    box(0xe3cf9e, 0, 2.65, -8.8, 14.8, 3.6, 7.0);
    A.curvedRoof(T, kit, 0, 4.45, -8.5, 17.4, 9.4, 2.25, 0x96402c, 0xd8c290, 0xd2a44c, 0.32, { dragons: true });
    // Twin kneeling ceremonial stone elephants (voi đá chầu) flanking the forecourt
    for (const s of [-1, 1]) {
      box(0x8a8478, s * 4.4, 0.9, 4.8, 1.5, 1.35, 2.2);
      stamp(round, 0x7f796e, s * 4.4, 1.1, 6.0, 0.55, 0.95, 0.55);
    }
    A.trees(T, kit, [{ x: -11.5, z: -3.5, h: 9.8, kind: 'banyan' }, { x: 11.5, z: -3.5, h: 9.2, kind: 'banyan' }]);
  }

  // 4. Đền Độc Cước (Núi Cổ Giải, Sầm Sơn)
  function denDocCuoc(T, kit) {
    const { stamp } = kit;
    const rock = new T.DodecahedronGeometry(1, 1);
    for (const [rx, ry, rz, sx, sy, sz] of [
      [-10.5, 2.6, -4.5, 4.5, 3.8, 4.2], [10.8, 2.8, -4.2, 4.6, 4.0, 4.4], [0, 3.2, -9.2, 8.8, 4.8, 4.2]
    ]) {
      stamp(rock, 0x838079, rx, ry, rz, sx, sy, sz);
    }
    rock.dispose();
    A.vietnameseHall(T, kit, {
      w: 15.6, d: 9.8, baseH: 1.35, colH: 3.4, bays: 5,
      wall: 0xe4d1a0, wood: 0x622519, tile: 0x9e402c, ridge: 0xd9b862, eave: 0xd6a84c,
      doubleTier: true, atticColor: 0x892b1e,
      title: 'ĐỀN ĐỘC CƯỚC', plaque: { bg: '#752017', fg: '#f8da74' }
    });
    A.trees(T, kit, [{ x: -9.8, z: 4.2, h: 7.4, kind: 'palm' }, { x: 9.8, z: 4.2, h: 7.8, kind: 'palm' }]);
  }

  // 5. Hòn Trống Mái (Núi Trường Lệ, Sầm Sơn — kỳ quan đá xếp cân bằng)
  function honTrongMaiSamSon(T, kit) {
    const {stone,finish}=globalThis.createSightGranite(T,kit.group,kit.random);
    // The provincial photo shows one low outcrop, a horizontal block on the
    // left and a tapering, split block on the right, with scrub at the toe.
    stone(0,.37,-.22,5.57,1.77,3.0,0x938c82,.11,-.27);
    stone(-2.62,2.77,-.43,2.35,1.03,1.51,0x827b72,-.18,.24);
    stone(2.44,3.13,-.29,1.91,1.37,1.35,0x9e9487,.21,-.44,false,.53);
    stone(-.9,.24,4.48,1.1,.59,.75,0x9a938a,-.31,-.05);
    finish();
    A.trees(T,kit,[{x:-7.8,z:-4.9,h:7.1,kind:'banyan'},{x:5.9,z:-6.6,h:7.8,kind:'banyan'},
      {x:8.7,z:-3.3,h:6.7,kind:'banyan'},{x:-8.8,z:-.9,h:5.6,kind:'banyan'}]);
    const shrubs=[];
    for(let i=0;i<22;i++){
      const a=i*2.39996,r=kit.random();
      shrubs.push({x:Math.sin(a)*(5.2+r*.6),z:-.35+Math.cos(a)*(2.7+r*.7),
        h:.68+r*.79,width:1.05+r*1.2,kind:'banyan'});
    }
    A.trees(T,kit,shrubs);
  }

  // 6. Tượng đài Lê Lợi (TP. Thanh Hóa — Hoàng đế cầm gươm Thuận Thiên)
  function tuongDaiLeLoi(T, kit) {
    A.memorialMonument(T, kit, {
      plazaW: 26, plazaD: 22, style: 'statue', wings: false, flags: false,
      stone: 0xa3aa9f, darkStone: 0x828a80,
      sculpt(T,kit,base) {
        const tint=0x969f96, height=15.7-base;
        kit.palette({stone:tint});
        A.statueFigure(T,kit,tint,0,base,-1.2,height,{longCoat:true,beard:true,headcloth:true,
          leftArm:[[.151,.664,.025],[.149,.568,.052],[.140,.533,.067]]});
        const dress=A.carving(T,kit,tint,0,base,-1.2,height);
        dress.sweep([[0,.610,.002,.097,.065],[0,.616,.002,.100,.067],[0,.637,.002,.099,.068],[0,.644,.002,.093,.064]]);
        dress.sweep([[.149,.57,.067,.018,.018],[.130,.541,.074,.022,.023],[.104,.501,.089,.023,.021],
          [.042,.47,.090,.020,.016],[-.010,.433,.088,.018,.014],[-.041,.331,.071,.016,.012],[-.052,.271,.075,.010,.008]]);
        dress.finish();
        A.plaque(T,kit,'LÊ LỢI',0,2.28,1.45,3.3,.74,{bg:'#8b9286',fg:'#454c44',frame:false});
      }
    });
  }

  // 7. Thái Miếu nhà Hậu Lê (TP. Thanh Hóa)
  function thaiMieuHauLe(T, kit) {
    A.tamQuan(T, kit, {
      wall: 0xd5c49c, trim: 0xb39768, tile: 0x84402f, ridge: 0xcab892, eave: 0xc2984e,
      wCenter: 5.0, wSide: 3.5, depth: 2.7, hCenter: 4.6, hSide: 3.4, twoTierSides: false,
      title: 'THÁI MIẾU NHÀ HẬU LÊ'
    });
    kit.box(0x8e8679, 0, 0.45, -8.4, 17.0, 0.9, 9.0);
    kit.box(0xd5c49c, 0, 2.6, -8.6, 15.2, 3.5, 7.2);
    A.curvedRoof(T, kit, 0, 4.35, -8.4, 17.8, 9.6, 2.25, 0x84402f, 0xcab892, 0xc2984e, 0.30, { dragons: true });
    A.trees(T, kit, [{ x: -11.8, z: -3.5, h: 10.0, kind: 'banyan' }, { x: 11.8, z: 3.0, h: 7.4, kind: 'palm' }]);
  }

  // 8. Hải đăng Lạch Trào (Hoằng Hóa, Thanh Hóa)
  function haiDangLachTrao(T, kit) {
    A.lighthouse(T, kit, {
      h: 19, rBase: 2.45, rTop: 1.6, body: 0xf1ece0, band: 0xd69a34, dome: 0xa22f24,
      striped: true, title: 'HẢI ĐĂNG LẠCH TRÀO'
    });
  }

  const sights = [
    {
      id: 'cau-ham-rong', name: 'Cầu Hàm Rồng', city: 'TP. Thanh Hóa', province: 'Thanh Hóa',
      lon: 105.792150, lat: 19.839850, yaw: -0.20, width: 164, depth: 15,
      viewAngle: 0.45, viewElevation: 0.22,
      start: [105.791936, 19.838831], viewDistance: 1500,
      solids: [[0, -6.4, 82, 0.7], [0, 6.4, 82, 0.7]],
      map: 'https://www.openstreetmap.org/#map=17/19.83985/105.79215',
      source: 'https://dsvh.gov.vn/',
      build: cauHamRong
    },
    {
      id: 'chinh-dien-lam-kinh', name: 'Chính điện Lam Kinh', city: 'Thọ Xuân', province: 'Thanh Hóa',
      lon: 105.405700, lat: 19.939400, yaw: 0.064, width: 32, depth: 26,
      start: [105.405723, 19.939060], viewDistance: 1300,
      map: 'https://www.openstreetmap.org/node/10709724419',
      source: 'https://dsvh.gov.vn/',
      build: chinhDienLamKinh
    },
    {
      id: 'den-ba-trieu', name: 'Đền Bà Triệu', city: 'Hậu Lộc', province: 'Thanh Hóa',
      lon: 105.847300, lat: 19.954700, yaw: 0.532, width: 24, depth: 22,
      start: [105.847959, 19.953644], viewDistance: 1200,
      map: 'https://www.openstreetmap.org/#map=17/19.95470/105.84730',
      source: 'https://dsvh.gov.vn/',
      build: denBaTrieu
    },
    {
      id: 'den-doc-cuoc-sam-son', name: 'Đền Độc Cước', city: 'Sầm Sơn', province: 'Thanh Hóa',
      // The roof is at the south end of the mapped Cổ Giải precinct. The porch faces west.
      lon: 105.900226, lat: 19.729316, yaw: -Math.PI / 2, width: 26, depth: 22,
      start: [105.8996951, 19.7295984], mappedEntrance: true, viewDistance: 1300,
      arrivalNote: 'Dừng xe ở cuối đường Hồ Xuân Hương, rồi đi bộ lên các bậc đá tới đền.',
      map: 'https://www.openstreetmap.org/way/647769578',
      source: 'https://visitthanhhoa.vn/vi/dendoccuoc1',
      build: denDocCuoc
    },
    {
      id: 'hon-trong-mai-sam-son', name: 'Hòn Trống Mái Sầm Sơn', city: 'Sầm Sơn', province: 'Thanh Hóa',
      catalogId: 'osm-way-647769584',
      // Provincial tourism pin inside the park. The vehicle stops at the mountain road by its car park.
      lon: 105.8919211, lat: 19.7266986, yaw: 0, width: 14, depth: 10, solids:[[0,-.22,5.4,2.9]],
      views:[{name:'Ba khối đá',height:4.6,viewRadius:15.8,viewAngle:.16,viewElevation:.17},
        {name:'Công viên trên núi Trường Lệ',height:7,viewRadius:53,viewAngle:1.17,viewElevation:.34}],
      start: [105.8920636, 19.7263107], mappedEntrance: true, viewDistance: 1250,
      arrivalNote: 'Dừng xe trên đường Trên Núi Trường Lệ cạnh bãi đỗ xe Hòn Trống Mái, rồi đi bộ lên khu đá.',
      map: 'https://www.openstreetmap.org/way/647769584',
      source: 'https://visitthanhhoa.vn/vi/hontrongmai',
      build: honTrongMaiSamSon
    },
    {
      id: 'tuong-dai-le-loi-thanh-hoa', name: 'Tượng đài Lê Lợi', city: 'TP. Thanh Hóa', province: 'Thanh Hóa',
      lon: 105.775960, lat: 19.807300, yaw: -1.681, width: 26, depth: 22,
      start: [105.775682, 19.807329], viewDistance: 1200,
      map: 'https://www.openstreetmap.org/node/4565113392',
      source: 'https://vnexpress.net/thanh-hoa-tu-bo-xong-tuong-dai-da-xanh-lon-nhat-tinh-3914113.html',
      build: tuongDaiLeLoi
    },
    {
      id: 'thai-mieu-nha-hau-le', name: 'Thái Miếu nhà Hậu Lê', city: 'TP. Thanh Hóa', province: 'Thanh Hóa',
      lon: 105.780300, lat: 19.794700, yaw: 3.123, width: 24, depth: 22,
      start: [105.780305, 19.794970],
      map: 'https://www.openstreetmap.org/#map=18/19.79470/105.78030',
      source: 'https://dsvh.gov.vn/',
      build: thaiMieuHauLe
    }];

  window.VietnamSights = (window.VietnamSights || []).concat(sights);
})();
