'use strict';
(() => {
  const A = window.CentralArch;

  // 1. Chùa Hương Tích (Can Lộc, Hà Tĩnh — Hoan Châu đệ nhất danh lam)
  function chuaHuongTich(T, kit) {
    const { stamp, box, round } = kit;
    const stone=0x9b927e, trim=0xb7b7aa, brick=0xa16849, wood=0x675246, dark=0x3e342d;
    kit.palette({stone:[stone,trim,0x8f9187],brick:[brick,0xab856b],timber:[wood,dark]});
    // The old Tam Bảo hall faces south. A continuous low roof shelters the
    // shuttered central bays between stone end walls (Võ Văn Tường, photos 7–8).
    const base=createTempleFoundations(T,kit);
    const platform=base.fixture(g=>g(0,0)+.18,()=>{
      kit.deck(0xab856b,0,.02,6.15,20.8,.16,12.4);
      box(brick,0,.42,0,18.3,.84,9.1);
      for(let i=0;i<4;i++)box(brick,0,(4-i)*.10,4.7+i*.33,11.5,(4-i)*.20,.36);
      box(stone,0,2.34,-.63,17.6,3,7.4);
      box(dark,0,2.39,3.24,11.15,3.05,.35);
      for(let bay=-1;bay<=1;bay++){
        for(let leaf=0;leaf<4;leaf++){
          const x=bay*3.54+(leaf-1.5)*.80;
          box(wood,x,1.64,3.46,.73,1.36,.16);
          box(dark,x,1.68,3.55,.53,.98,.04);
          for(let bar=-2;bar<=2;bar++)box(wood,x+bar*.13,2.78,3.48,.052,1.08,.12);
          box(wood,x,3.37,3.47,.75,.10,.14);
        }
      }
      for(const side of [-1,1]){
        const x=side*7.18;
        box(stone,x,2.34,3.5,3.42,3,1);
        box(trim,x,2.65,4.04,1.35,1.40,.11);
        box(dark,x,2.65,4.11,1.12,1.16,.06);
        for(const a of [-1,1])box(trim,x,2.65,4.17,.08,1.38,.08,0,0,a*.77);
        const post=side*9.32;
        for(const [y,w,h] of [[.26,1.30,.50],[.60,1.14,.22],[2.15,.91,2.9],[3.64,1.10,.22],[4.04,1,.63],[4.43,1.21,.15]]){
          box(trim,post,y,4.17,w,h,w);
        }
        box(0x8f9187,post,2.18,4.64,.48,2.48,.06);
      }
      for(const x of [-5.45,-1.77,1.77,5.45])stamp(round,wood,x,2.44,3.79,.16,3.2,.16);
      box(wood,0,3.89,3.78,17.9,.32,.31);
      A.curvedRoof(T,kit,0,3.96,-.2,19.5,10,2.03,0x82624d,0x706e63,0x777568,.42);
      // The front court has a bronze censer and the stone steps continue
      // behind the north wall towards Am Phật Bà.
      for(const [y,r,h] of [[.22,.64,.34],[.56,.36,.34],[.84,.69,.36],[1.09,.73,.14]]){
        stamp(round,0x58564c,0,y,7.5,r,h,r);
      }
    });
    base.skirt(0,6.15,20.8,12.4,.085,platform);
    base.skirt(0,0,18.3,9.1,.12,platform);
    base.stairs(platform,10,3.1,10,-14.2,2.2,.12,28);
    for(const tree of [{x:-12,z:-4,h:10.1,kind:'banyan'},{x:12.7,z:-8,h:9.4,kind:'banyan'}]){
      let parts;
      base.fixture(g=>g(tree.x,tree.z),()=>{
        parts=kit.place(tree.x,tree.z,0,()=>A.trees(T,kit,[{...tree,x:0,z:0}])).map(mesh=>({mesh,y:mesh.position.y}));
      },dy=>{for(const {mesh,y} of parts)mesh.position.y=y+dy;});
    }
  }

  // 2. Đền Chợ Củi (Đền Ông Hoàng Mười, Nghi Xuân, Hà Tĩnh)
  function denChoCui(T, kit) {
    A.tamQuan(T, kit, {
      wall: 0xe8d08e, trim: 0xc99c4a, tile: 0xa63f2a, ridge: 0xdfc16a, eave: 0xe0b44c,
      wCenter: 5.4, wSide: 3.8, depth: 3.0, hCenter: 5.0, hSide: 3.6, twoTierSides: true,
      title: 'ĐỀN CHỢ CỦI', plaque: { bg: '#7c1e16', fg: '#f8da72' }
    });
    kit.box(0xe8d08e, 0, 2.7, -8.5, 15.2, 3.8, 7.2);
    A.curvedRoof(T, kit, 0, 4.6, -8.5, 17.8, 9.5, 2.35, 0xa63f2a, 0xdfc16a, 0xe0b44c, 0.32, { dragons: true });
    A.trees(T, kit, [{ x: -11.5, z: -4.0, h: 9.2, kind: 'banyan' }, { x: 11.5, z: -4.0, h: 7.4, kind: 'palm' }]);
  }

  // 3. Đền Võ Miếu (TP. Hà Tĩnh)
  function denVoMieu(T, kit) {
    A.vietnameseHall(T, kit, {
      w: 16.5, d: 10.0, baseH: 1.0, colH: 3.3, bays: 5,
      wall: 0xdfd0a8, wood: 0x5c271c, tile: 0x8c4230, ridge: 0xd0be96, eave: 0xc99c4a,
      doubleTier: false, title: 'ĐỀN VÕ MIẾU'
    });
    kit.box(0xd9c79b, 0, 1.35, 9.2, 4.6, 2.1, 0.48);
    kit.box(0x8c4230, 0, 2.52, 9.2, 5.0, 0.30, 0.72);
    A.trees(T, kit, [{ x: -11.2, z: 3.2, h: 9.5, kind: 'banyan' }, { x: 11.2, z: -2.0, h: 7.2, kind: 'palm' }]);
  }

  // 4. Tượng đài Xô Viết Nghệ Tĩnh (Ngã ba Nghèn, Can Lộc)
  function tuongDaiXoVietCanLoc(T, kit) {
    const base=.94;
    kit.box(0x777971,0,.18,0,25,.36,19);
    kit.box(0xa4a69c,0,.51,-.4,19.5,.34,14.1);
    kit.box(0x898d85,0,.81,-.95,9.5,.26,5.6);
    A.steps(kit,0,6.9,12,1.4,4,.16,.39,0x9b9d95);
    const slate = 0x92958d;
    kit.palette({stone:[slate,0x9b9d94,0xa0a297,0x777971,0xa4a69c,0x898d85]});
    // The Nghèn group rises against a tall, cantilevered stone banner.
    kit.outline([[-3,0],[-3,5.3],[-4.1,6.3],[-4.35,10.2],[-3.4,9.7],[-2.1,10.1],[-2.2,12.2],
      [1.35,12.8],[1.52,12.2],[4.4,13.8],[3.22,10.0],[3.08,8.9],[1.92,8.55],[-.45,6.7],[.65,6.4],[2.8,7.4],
      [2.5,6.5],[.85,5.6],[.7,0]],slate,0,base,-2.8,1.05);
    kit.outline([[-2.05,10.08],[-2.12,12.08],[1.29,12.65],[1.39,11.95],[.45,10.6]],0x9b9d94,0,base,-1.81,.21);
    kit.outline([[-.43,7.55],[1.47,12.06],[4.27,13.65],[3.05,9.05],[1.91,8.7]],0xa0a297,0,base,-1.82,.32);
    // Seven figures share the same stone as the banner, on three levels.
    // The raised pair, woman in front and drummer overlap in the frontal view.
    kit.box(slate,-2.78,base+.43,-.35,2.65,.86,2.1);
    kit.box(slate,.03,base+1.22,-.95,4.1,2.44,2.45);
    kit.box(slate,2.65,base+.55,-.65,1.54,1.1,2.1);
    function woman(x,y,z,height,pose){
      A.statueFigure(T,kit,slate,x,y,z,height,{...pose,headcloth:true});
      const skirt=A.carving(T,kit,slate,x,y,z,height,pose.yaw);
      skirt.sweep([[-.038,.135,.010,.133,.071],[-.036,.16,.006,.141,.075],
        [-.017,.30,0,.123,.067],[0,.49,0,.101,.067],[0,.58,0,.091,.064]],.075,24);
      skirt.finish();
    }
    woman(-.57,base+2.44,-.49,4.15,{rightArm:[[-.22,.89,.025],[-.30,.99,.04],[-.33,1.035,.05]],
      leftArm:[[.148,.68,.035],[.16,.82,.085],[.14,.87,.093]]});
    A.statueFigure(T,kit,slate,.78,base+2.44,-.56,4.42,{leftArm:[[.155,.92,.010],[.142,1.06,.024],[.138,1.12,.026]]});
    A.statueFigure(T,kit,slate,2.68,base+1.1,-.27,4.30,{yaw:.12,
      rightArm:[[-.18,.73,.03],[-.263,.849,.071],[-.288,.873,.079]],
      leftArm:[[.19,.62,.046],[.156,.709,.139],[.136,.742,.145]]});
    A.statueFigure(T,kit,slate,-3.04,base+.86,-.54,3.95,{
      rightArm:[[-.19,.61,.028],[-.286,.711,.060],[-.309,.74,.068]]});
    A.strut(T,kit,slate,-4.19,base+.20,-.26,-4.29,base+5.45,-.24,.070);
    kit.outline([[-.11,0],[0,.38],[.105,.055],[.065,-.16],[-.053,-.14]],slate,-4.29,base+5.4,-.25,.13);
    A.statueFigure(T,kit,slate,-2.15,base+.86,-.76,3.66,{
      leftArm:[[.18,.77,.017],[.187,.913,.04],[.176,.95,.046]]});
    woman(-2.47,base,.92,3.99,{yaw:-.061,
      rightArm:[[-.142,.564,.038],[-.156,.420,.081]],leftArm:[[.137,.623,.045],[-.018,.471,.119],[-.078,.435,.114]]});
    A.statueFigure(T,kit,slate,-.82,base,1.00,3.26,{stepUp:.13,yaw:-.12,
      rightArm:[[-.185,.7,.033],[-.206,.875,.093],[-.208,.911,.097]],
      leftArm:[[.127,.574,.079],[-.01,.409,.132],[-.032,.38,.143]]});
    kit.stamp(kit.round,0x9b9d94,-1.21,base+.92,1.24,.49,.45,.49,0,.72);
  }

  // 5. Hải đăng Cửa Nhượng (Thiên Cầm, Cẩm Xuyên)
  function haiDangCuaNhuong(T, kit) {
    A.lighthouse(T, kit, {
      h: 18.5, rBase: 2.4, rTop: 1.55, body: 0xf1ece0, band: 0xd89d34, dome: 0x9e3226,
      striped: true, title: 'HẢI ĐĂNG CỬA NHƯỢNG'
    });
  }

  // 8. Hải đăng Nhật Lệ (Cửa biển Nhật Lệ, Đồng Hới)
  function haiDangNhatLe(T, kit) {
    A.lighthouse(T, kit, {
      h: 19, rBase: 2.5, rTop: 1.65, body: 0xf1ede2, band: 0xb83828, dome: 0x9c2e22,
      striped: true, title: 'HẢI ĐĂNG NHẬT LỆ'
    });
  }

  const sights = [
    {
      id: 'chua-huong-tich-ha-tinh', name: 'Chùa Hương Tích', city: 'Can Lộc', province: 'Hà Tĩnh',
      lon: 105.7890804, lat: 18.5342785, yaw: 0, width: 28, depth: 31,
      start: [105.78468, 18.52661], viewDistance: 1500, approachMeters: 969,
      mappedEntrance: true, visitOnArrival: true,
      views:[{name:'Tam Bảo trên sườn Hồng Lĩnh',offset:[0,2],height:7,viewAngle:.82,viewElevation:.23,viewRadius:53},
        {name:'Toàn cảnh sườn núi',offset:[-12,5],height:10,viewAngle:-.88,viewElevation:.24,viewRadius:165}],
      arrivalNote: 'Xe dừng ở cuối đường gần ga Miếu Cô. Từ đây có thể đi bộ hoặc đi cáp treo lên ga Hương Tích, rồi đi tiếp đến chùa chính.',
      description: 'Tiền đường và Tam Bảo nằm trên sườn núi Hồng Lĩnh, gần ga Hương Tích. Sau chùa là lối lên Am Phật Bà. Nền Trang Vương nằm cao hơn về phía bắc.',
      map: 'https://www.openstreetmap.org/node/11701538536',
      source: 'https://baotang.hatinh.gov.vn/huong-tichngoi-chua-thieng-tren-dinh-nui-hong-1673514625.html',
      photo: 'https://www.chuaviettoancau.com/chua-mien-trung/chua-huong-tich-ha-tinh-725.html',
      build: chuaHuongTich
    },
    {
      id: 'den-cho-cui', name: 'Đền Chợ Củi', city: 'Nghi Xuân', province: 'Hà Tĩnh',
      lon: 105.736700, lat: 18.590750, yaw: -1.724, width: 24, depth: 22,
      start: [105.734718, 18.591040], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/#map=17/18.59075/105.73670',
      source: 'https://dulichhatinh.com.vn/',
      build: denChoCui
    },
    {
      id: 'den-vo-mieu-ha-tinh', name: 'Đền Võ Miếu Hà Tĩnh', city: 'TP. Hà Tĩnh', province: 'Hà Tĩnh',
      lon: 105.908582, lat: 18.342182, yaw: -1.366, width: 22, depth: 20,
      start: [105.908338, 18.342134],
      map: 'https://www.openstreetmap.org/node/5373874858',
      source: 'https://dsvh.gov.vn/',
      build: denVoMieu
    },
    {
      id: 'tuong-dai-xo-viet-can-loc', name: 'Tượng đài Xô Viết Nghệ Tĩnh', city: 'Can Lộc', province: 'Hà Tĩnh',
      lon: 105.776010, lat: 18.452689, yaw: 2.193, width: 26, depth: 20,
      start: [105.776153, 18.452787],
      map: 'https://www.openstreetmap.org/node/4409318890',
      photo: 'https://hatinh.gov.vn/vi/bai-viet/am-vang-hao-khi-xo-viet-tren-que-huong-ha-tinh',
      source: 'https://sknc.qdnd.vn/dia-chi-do/vang-danh-nga-ba-nghen-501999',
      build: tuongDaiXoVietCanLoc
    }
  ];

  window.VietnamSights = (window.VietnamSights || []).concat(sights);
})();
