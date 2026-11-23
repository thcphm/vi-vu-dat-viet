'use strict';
(() => {
  const A = window.CentralArch;

  // 1. Khu chứng tích Sơn Mỹ (Quảng Ngãi)
  function chungTichSonMy(T, kit) {
    const limestone = 0xd2d1c7;
    kit.palette({stone:[limestone,0xcacbc2,0xacaaa1,0x777779,0x676768]});
    // Front elevation traced from -JvL-'s photograph of the memorial.
    // Separate sections leave daylight around the raised fist and the child.
    kit.box(0xacaaa1,0,.16,0,17,.32,13.5);
    kit.box(0x777779,0,.70,-.9,7.10,.76,4.5);
    kit.box(0x797975,0,1.63,-.9,8.20,1.10,4.95);
    A.steps(kit,0,2.2,5.8,.32,5,.15,.29,0x999991);
    A.photoCarving(T,kit,{photo:'sight-imagery/son-my-memorial.webp',width:492,height:637,
      origin:[246,626],position:[0,2.18,-1],scale:.0158,tint:limestone,forms:[
        {z:-.28,rows:[[15,206,229,.10],[21,199,229,.15],[29,194,230,.18],[48,200,227,.17],
          [57,179,223,.20],[105,185,224,.24],[154,191,227,.26],[190,192,230,.31],[229,194,231,.34]]},
        {z:-.32,rows:[[121,246,262,.11],[129,237,270,.22],[144,231,276,.32],[163,233,274,.31],
          [175,239,268,.23],[183,244,264,.19],[195,239,264,.21],[206,230,270,.28]]},
        {z:-.37,rows:[[195,211,239,.29],[202,200,267,.37],[217,196,296,.47],[246,195,301,.51],
          [276,194,304,.55],[300,189,294,.66],[338,171,275,.69],[365,173,274,.67],
          [411,188,276,.63],[455,190,281,.63],[505,205,288,.64],[551,201,282,.57],[617,200,274,.50]]},
        {z:.01,rows:[[279,276,305,.15],[287,210,310,.28],[296,204,312,.29],[306,204,329,.34],
          [320,205,336,.35],[333,211,330,.31],[341,223,311,.23]]},
        {z:.15,rows:[[319,293,308,.10],[338,295,309,.14],[355,295,306,.11],[370,297,304,.06]]},
        {z:.14,rows:[[315,216,238,.16],[333,217,246,.23],[353,226,249,.19],[366,230,240,.11]]},
        {z:.16,rows:[[341,148,170,.14],[352,139,181,.25],[370,133,190,.34],[390,136,187,.32],
          [408,138,184,.31],[422,99,202,.48],[435,90,207,.55],[465,89,212,.57],
          [490,88,221,.61],[516,69,228,.58],[550,70,209,.51],[608,102,219,.51],[622,106,222,.44]]},
        {z:.54,rows:[[413,153,180,.15],[421,145,190,.24],[439,139,197,.34],[458,137,195,.35],
          [478,142,180,.31],[488,127,182,.36],[503,90,199,.49],[531,59,210,.53],
          [550,43,204,.52],[572,30,76,.27],[596,29,79,.26],[615,31,81,.20]]},
        {z:.57,rows:[[500,286,305,.16],[508,199,318,.25],[518,174,327,.32],[531,162,330,.28],
          [539,172,310,.24],[547,217,301,.21]]},
        {z:.62,rows:[[492,411,426,.17],[502,383,441,.31],[516,367,448,.40],[537,352,461,.42],
          [555,341,467,.51],[581,350,469,.50],[601,371,462,.43],[620,390,454,.33]]},
        {z:.61,rows:[[547,215,287,.31],[554,154,308,.40],[568,119,334,.48],[585,110,385,.55],
          [605,105,428,.53],[619,64,465,.50],[627,61,474,.42]]}
      ]});
    A.trees(T, kit, [{ x: -11.5, z: 4.0, h: 9.2, kind: 'banyan' }, { x: 11.5, z: 4.0, h: 8.8, kind: 'banyan' }]);
  }

  // 2. Hải đăng Ba Làng An (Bình Sơn, Quảng Ngãi)
  function haiDangBaLangAn(T, kit) {
    A.lighthouse(T, kit, {
      h: 20, rBase: 2.5, rTop: 1.6, body: 0xf1ede2, band: 0x383c40, dome: 0xa22f24,
      striped: true, octagonal: true, title: 'HẢI ĐĂNG BA LÀNG AN'
    });
  }

  // 3. Nhà thờ Gỗ Kon Tum (1913 — gỗ cà chít Romanesque kết hợp nhà sàn Ba Na)
  function nhaThoGoKonTum(T, kit) {
    const {box,stamp,round,tapered,profile,outline} = kit;
    const frame=0x40372f, boards=0x665144, ochre=0xb49b66, lime=0xe6dac2;
    const clay=0x865942, slate=0x544b44, stone=0x9e978b, glass=0x536c81;
    kit.palette({timber:[frame,boards],plaster:lime,stone,tile:[clay,slate],glass});
    // A round-head opening cut through a full spandrel. The paired, slimmer
    // posts underneath it leave sightlines through the raised gallery.
    function arcade(x,y,z,span,spring,angle) {
      const r=span*.455, top=spring+r+.23, shape=new T.Shape();
      shape.moveTo(-span/2,0); shape.lineTo(-r,0); shape.lineTo(-r,spring);
      shape.absarc(0,spring,r,Math.PI,0,true);
      shape.lineTo(r,0); shape.lineTo(span/2,0); shape.lineTo(span/2,top);
      shape.lineTo(-span/2,top); shape.closePath();
      profile(shape,frame,x,y,z,.26,angle);
      const band=new T.TorusGeometry(r,.055,5,24,Math.PI);
      stamp(band,ochre,x+.28*Math.sin(angle),y+spring,z+.28*Math.cos(angle),1,1,1,angle);
      band.dispose();
    }
    box(stone,0,.50,0,19,1,32);
    for(let i=0;i<5;i++)box(stone,0,.1+i*.10,17.15-i*.36,18.8-i*.08,.20+i*.20,.75);
    // White infill and dark structural posts are visible above both lower aisles.
    box(lime,0,6.10,-1.0,10,10.2,28);
    A.gabledRoof(T,kit,0,11.25,-1.0,10.8,29.1,3.55,clay,slate);
    for(const side of [-1,1]){
      for(let j=0;j<9;j++){
        const z=-13.6+3.18*j;
        box(frame,side*5.04,6.02,z,.14,9.9,.15);
        box(boards,side*5.10,9.55,z+1.22,.10,1.35,.58);
      }
      // Row of transverse pitched porches and slender balusters down each aisle.
      for(let j=0;j<5;j++){
        const z=-11.9+5.55*j, x=side*7.05;
        A.gabledRoof(T,kit,x,5.65,z,4.35,5.2,1.62,slate,frame,{alongX:true,overhang:.19});
        outline([[-2.74,0],[0,1.62],[2.74,0]],boards,side*9.1,5.65,z,.12,Math.PI/2);
        arcade(side*8.97,1.02,z,5.48,2.10,side*Math.PI/2);
        box(frame,side*9,2.0,z,.12,.14,5.5);
        for(let i=-4;i<=4;i++)box(boards,side*9,1.48,z+i*.53,.11,.90,.085);
      }
    }
    // Three open bays span the stair landing. Set the inner doors back under the porch.
    for(const [cx,span] of [[-6.1,4.7],[0,7.5],[6.1,4.7]]){
      arcade(cx,1.02,14.75,span,2.50,0);
      box(boards,cx,3.03,12.95,span*.63,4,.14);
    }
    for(const x of [-8.45,-3.77,3.77,8.45]){
      box(frame,x,3.05,14.98,.37,4.05,.41);
      box(ochre,x,4.94,14.98,.57,.18,.55);
    }
    for(const side of [-1,1]){
      outline([[-side*2.35,0],[-side*2.35,3.7],[side*2.35,0]],
        boards,side*6.1,5.65,14.70,.3);
    }
    // Front gable: tall bay, circular stained glass, smaller arched panels and gold-edged posts.
    const face=15.06;
    box(boards,0,9.88,14.1,8.3,7.12,1.72);
    outline([[-4.35,0],[0,3.20],[4.35,0]],boards,0,13.42,13.12,1.84);
    for(const x of [-3.85,-2.15,2.15,3.85])box(frame,x,9.9,face,.18,7.02,.19);
    for(const y of [6.48,8.52,13.37])box(ochre,0,y,face,8.12,.09,.12);
    for(let i=-3;i<=3;i++)arcade(i*.99,6.58,face,.94,.93,0);
    stamp(round,glass,0,10.83,face,1.88,.18,1.88,0,Math.PI/2);
    for(const r of [.34,.91,1.8]){
      const ring=new T.TorusGeometry(r,r>1?.09:.045,6,48);
      stamp(ring,ochre,0,10.83,face+.14);ring.dispose();
    }
    for(let i=0;i<12;i++){
      const a=Math.PI*i/6;
      box(0xa39a87,.99*Math.sin(a),10.83+.99*Math.cos(a),face+.13,.05,1.60,.07,0,0,-a);
    }
    for(const side of [-1,1]){
      A.strut(T,kit,ochre,side*4.32,13.44,face,0,16.53,face,.068);
      box(ochre,side*3.04,10.74,face,.68,2.38,.12);
      box(glass,side*3.04,10.74,face+.09,.49,2.19,.10);
    }
    // Receding square belfry behind the façade, with louvred vents and narrow spire.
    for(const [cy,w,h] of [[15.83,4.40,4.1],[19.07,3.05,2.55]]){
      box(boards,0,cy,11.78,w,h,w);
      for(const side of [-1,1])for(const bay of [-.21,.21]){
        box(frame,bay*w,cy,11.78+side*w*.502,w*.28,h*.65,.16);
        box(frame,side*w*.502,cy,11.78+bay*w,.16,h*.65,w*.28);
        for(let i=-2;i<=2;i++){
          box(ochre,bay*w,cy+i*h*.11,11.78+side*(w*.5+.09),w*.25,.09,.11);
          box(ochre,side*(w*.5+.09),cy+i*h*.11,11.78+bay*w,.11,.09,w*.25);
        }
      }
      box(frame,0,cy+h*.5,11.78,w+.52,.28,w+.52);
    }
    tapered(clay,0,23.15,11.78,2.36,.11,5.66,1,4);
    for(const x of [-1.64,1.64])for(const z of [-1.64,1.64])
      A.strut(T,kit,ochre,x,20.38,11.78+z,0,25.98,11.78,.058);
    box(frame,0,26.46,11.78,.11,1.05,.11);
    box(frame,0,26.65,11.78,.65,.10,.10);
  }

  // 4. Cầu treo Kon Klor (TP. Kon Tum — cầu treo dây võng màu cam rực rỡ)
  function cauTreoKonKlor(T, kit) {
    A.suspensionBridge(T, kit, {
      len: 215, w: 9.8, towerX: 64, towerH: 30,
      towerColor: 0xd96e2c, cableColor: 0xc95224, deckColor: 0x6c7275
    });
  }

  // 5. Quần thể Tháp Bánh Ít (4 tháp Chăm cổ trên đỉnh đồi Bình Định)
  function thapBanhIt(T, kit) {
    const {building,stairs}=createTempleFoundations(T,kit);
    const sandstone=0xbca78a,brick=0xa04c32,dark=0x823e2d;
    kit.palette({brick:[brick,dark],stone:sandstone});
    // Main sanctuary and the kosagrha share the summit. The other two towers
    // stand on their own hillside landings across the eastward approach.
    building(-2,0,1.74,13.2,17.6,()=>{
      A.chamTower(T,kit,0,0,{w:11.15,h:27,tiers:3,brick,darkBrick:dark,sandstone});
    });
    building(5,14,-.175,15.3,7.0,()=>{
      kit.box(dark,0,.53,0,15.3,1.06,7);
      kit.box(brick,0,3.50,0,14.35,5.1,6.3);
      for(const side of [-1,1]){
        for(let k=-3;k<=3;k++){
          kit.box(dark,k*2.04,3.28,side*3.19,.43,4.44,.18);
          kit.box(sandstone,k*2.04,5.55,side*3.24,.56,.22,.31);
        }
        kit.box(dark,0,5.94,side*3.30,15.22,.39,.38);
      }
      // The longitudinal ends rise far above the waist of the boat roof.
      for(let i=0;i<24;i++){
        const x=-7.45+(i+.5)*14.9/24,end=Math.pow(Math.abs(x)/7.45,2.9);
        kit.outline([[-3.62,0],[-2.42,1.26],[0,2.20+end*1.89],[2.42,1.26],[3.62,0]],
          i%7===0?dark:brick,x-.313,6,0,.628,Math.PI/2);
      }
    });
    building(26,54,1.74,9.4,11.5,()=>{
      A.chamTower(T,kit,0,0,{w:8.0,h:14.8,tiers:3,brick:0xaf6040,darkBrick:dark,sandstone});
      for(const side of [-1,1])for(const end of [-1,1]){
        kit.tapered(brick,side*2.73,12.55,end*2.73,.69,1.04,.98,1,8);
        kit.tapered(dark,side*2.73,13.19,end*2.73,1.08,.85,.34,1,8);
      }
    });
    const gate=building(104,-18,1.74,10.2,15,()=>{
      kit.box(dark,0,.06,0,10.2,.12,15);
      // Open east-west passage. Curved brick courses carry the tiers over it.
      const span=2.33,shape=new T.Shape();
      shape.moveTo(-4.35,0);shape.lineTo(-span,0);shape.lineTo(-span,3.5);
      shape.quadraticCurveTo(-span,5.39,0,6.72);shape.quadraticCurveTo(span,5.39,span,3.5);
      shape.lineTo(span,0);shape.lineTo(4.35,0);shape.lineTo(4.35,7.34);shape.lineTo(-4.35,7.34);shape.closePath();
      kit.profile(shape,brick,0,0,-6.5,13);
      for(const side of [-1,1])for(const z of [-5.9,-2.0,2.0,5.9]){
        kit.box(dark,side*4.37,3.62,z,.52,7.18,.67);
        kit.box(brick,side*4.39,6.99,z,.71,.32,.85);
      }
      for(let i=0;i<3;i++){
        const w=9.4-i*2.14,d=14.0-i*3.14,y=7.34+i*1.90;
        kit.box(dark,0,y+.22,0,w,.44,d);
        kit.box(brick,0,y+1.08,0,w-1.42,1.32,d-1.65);
      }
      kit.tapered(sandstone,0,13.57,0,1.10,.34,1.37,1,8);
    });
    stairs(gate,111.3,-19.23,117,-20,4.45,.12,13);
    stairs(gate,96.7,-16.77,90,-15.58,4.45,.12,15);
  }

  // 6. Nhóm Tháp Dương Long (Tây Sơn — cụm tháp Chăm gạch cao nhất Đông Nam Á)
  function thapDuongLong(T, kit) {
    kit.box(0x8b7e6b, 0, 0.42, 0, 38, 0.84, 16);
    A.chamTower(T, kit, -11.5, 0, { w: 7.4, h: 25.5, tiers: 4, brick: 0xa85239, sandstone: 0xd0bf9f });
    A.chamTower(T, kit, 0, 0, { w: 9.0, h: 31.5, tiers: 4, brick: 0x9e4a32, sandstone: 0xd4c3a3 });
    A.chamTower(T, kit, 11.5, 0, { w: 7.2, h: 24.8, tiers: 4, brick: 0xaa553b, sandstone: 0xd0bf9f });
    A.trees(T, kit, [{ x: -18.0, z: -5.5, h: 8.5, kind: 'palm' }, { x: 18.0, z: -5.5, h: 8.8, kind: 'banyan' }]);
  }

  // 7. Bảo tàng Quang Trung & Đền thờ Tây Sơn Tam Kiệt
  function baoTangQuangTrung(T, kit) {
    A.tamQuan(T, kit, {
      wall: 0xe6d29c, trim: 0xc99c4a, tile: 0xa23d28, ridge: 0xdcb85e, eave: 0xdfb24c,
      wCenter: 5.6, wSide: 3.8, depth: 3.0, hCenter: 5.2, hSide: 3.6, twoTierSides: true,
      title: 'BẢO TÀNG QUANG TRUNG', plaque: { bg: '#7c1e16', fg: '#f8da72' }
    });
    kit.box(0x90887b, 0, 0.55, -10.5, 22.0, 1.1, 11.0);
    kit.box(0xe6d29c, 0, 3.1, -10.8, 19.6, 4.0, 8.8);
    A.curvedRoof(T, kit, 0, 5.1, -10.5, 22.4, 11.4, 2.5, 0xa23d28, 0xdcb85e, 0xdfb24c, 0.34, { dragons: true });
    A.trees(T, kit, [{ x: -13.5, z: -4.5, h: 11.2, kind: 'banyan' }, { x: 13.5, z: -4.5, h: 8.0, kind: 'palm' }]);
  }

  // 8. Quảng trường Đại Đoàn Kết (TP. Pleiku, Gia Lai)
  function quangTruongDaiDoanKet(T, kit) {
    const { box, stamp, round } = kit;
    A.memorialMonument(T, kit, {
      plazaW: 30, plazaD: 22, style: 'statue', wings: false, flags: false,
      stone: 0xa8a99b, darkStone: 0x696d65,
      sculpt(T,kit,base) {
        kit.palette({metal:0x986f50,stone:[0x72776d,0xb0b0a2,0xb9b9ac]});
        kit.box(0x72776d,0,(base+4.5)/2,-1.2,7.8,4.5-base,5.35);
        A.statueFigure(T,kit,0x986f50,0,4.5,-1.2,10.8,{beard:true,jacket:true,openHand:true,
          rightArm:[[-.165,.674,.085],[-.154,.822,.13],[-.159,.894,.137]],
          leftArm:[[.142,.651,0],[.153,.472,.018],[.151,.41,.024]]});
        // The stone frieze opens into stepped, splayed lotus petals behind the figure.
        for (let i=-4;i<=4;i++) {
          const k=Math.abs(i),height=[7.3,6.8,5.9,5.2,4.8][k], width=1.85;
          const ring=[[-width,0],[width,0],[width,height-1.45],[width*.63,height-.64],[width*.13,height],
            [-width*.40,height-.44],[-width,height-1.23]];
          kit.outline(ring,k%2?0xb0b0a2:0xb9b9ac,i*3.42,.35,-7.8+k*.61,1.05,i*.082);
        }
      },
      title: 'QUẢNG TRƯỜNG ĐẠI ĐOÀN KẾT'
    });
    // Iconic carved giant Central Highlands stone gong (Cồng chiêng đá) beside the monument
    box(0x76726a, 10.5, 1.35, 3.2, 3.4, 1.4, 2.2);
    stamp(round, 0x4e4842, 10.5, 4.0, 3.2, 2.2, 0.42, 2.2, 0, Math.PI / 2);
    stamp(round, 0xd8ae48, 10.5, 4.0, 3.44, 0.65, 0.24, 0.65, 0, Math.PI / 2);
  }

  // 9. Tượng đài Chiến thắng Buôn Ma Thuột (Ngã Sáu Ban Mê — Xe tăng 980 trên vòm cầu)
  function tuongDaiChienThangBmt(T, kit) {
    const { box, stamp, outline, round } = kit;
    const white = 0xeae6dc, darkStone = 0x76736c, tankGreen = 0x475e3e, darkTrack = 0x2f3c2a;
    kit.palette({stone: darkStone});

    // Circular Ngã Sáu roundabout granite tiered base
    stamp(round, darkStone, 0, 0.45, 0, 11.5, 0.9, 11.5);
    stamp(round, 0x4e793e, 0, 0.96, 0, 9.8, 0.22, 9.8);
    // Iconic crossed sweeping concrete arch pedestal rising 10m into the air!
    const arch = [
      [-6.8, 0], [-5.2, 5.2], [-2.4, 8.8], [0, 9.8], [2.4, 8.8], [5.2, 5.2], [6.8, 0],
      [5.4, 0], [4.0, 4.6], [1.8, 7.6], [0, 8.4], [-1.8, 7.6], [-4.0, 4.6], [-5.4, 0]
    ];
    outline(arch, white, 0, 0.9, -0.75, 1.5);
    outline(arch, white, 0, 0.9, -0.75, 1.5, Math.PI / 2);
    box(white, 0, 10.6, 0, 5.2, 0.85, 7.8);

    // Iconic T-54 Tank #980 mounted proudly atop the soaring arch!
    const ty = 11.45;
    box(tankGreen, 0, ty + 0.55, 0, 3.1, 1.1, 5.6);
    for (const s of [-1, 1]) box(darkTrack, s * 1.55, ty + 0.35, 0, 0.65, 0.85, 5.8);
    stamp(round, 0x526b47, 0, ty + 1.45, 0.2, 1.35, 0.95, 1.55);
    // Cannon barrel angled heroically upward
    A.strut(T, kit, 0x3b4f34, 0, ty + 1.55, 1.2, 0, ty + 2.65, 5.8, 0.14);
    A.plaque(T, kit, 'CHIẾN THẮNG BUÔN MA THUỘT', 0, 2.2, 7.6, 6.2, 0.84, { bg: '#84231b', fg: '#f8da72' });
  }

  // 11. Nhà thờ Mằng Lăng (1892, Tuy An, Phú Yên / Đắk Lắk — Gothic cổ rêu phong)
  function nhaThoMangLang(T, kit) {
    // Surveyed porch and apse of OSM w804128824. The west frontage follows
    // Đông Hồ's Commons photograph 125477301 and node3 of tour 69.
    // Nodes 8, 10, 13 and 14 show the wraparound arcade and its yellow
    // inner walls. The levels follow the photographs, with the bell-tower
    // crest set to architect Hoàng Xuân Thưởng's approximate 23.6 m.
    const k=kit,pi=Math.PI,fc=.72,west=21.52,roundStart=-13.94,rx=11.50,rz=9.58,mid=-.635;
    const pale=0xc8cac4,light=0xd7d8ce,grey=0x9ba4a4,band=0xaab1ac,deep=0x818882,stone=0x9d9b8e,
      dark=0x494943,wood=0x65503c,ochre=0xcead6c,glass=0x536c79,tile=0x9d6a55,ash=0x767368;
    k.palette({plaster:[pale,light,grey,band,deep,ochre],stone:[stone,ash],timber:wood,tile,glass});
    function extrudeXZ(path,lo,hi,tint){
      const shape=new T.Shape(path.map(([x,z])=>new T.Vector2(x,-z)));
      const g=new T.ExtrudeGeometry(shape,{depth:hi-lo,bevelEnabled:false});
      g.rotateX(-pi/2);k.stamp(g,tint,0,lo,0);g.dispose();
    }
    function arcPoint(path,r,spr,tip,back,pointed=true){
      if(!pointed){
        const side=back?1:-1,k=.552285;
        path.bezierCurveTo(side*r,spr+k*tip,side*k*r,spr+tip,0,spr+tip);
        path.bezierCurveTo(-side*k*r,spr+tip,-side*r,spr+k*tip,-side*r,spr);
      }else if(back){
        path.bezierCurveTo(r*.92,spr+tip*.46,r*.40,spr+tip*.88,0,spr+tip);
        path.bezierCurveTo(-r*.40,spr+tip*.88,-r*.92,spr+tip*.46,-r,spr);
      }else{
        path.bezierCurveTo(-r*.92,spr+tip*.46,-r*.40,spr+tip*.88,0,spr+tip);
        path.bezierCurveTo(r*.40,spr+tip*.88,r*.92,spr+tip*.46,r,spr);
      }
    }
    // Positive local z faces the observer. A face includes a real opening,
    // its thick return and a narrow raised moulding, all in the same units.
    function arcade(w,r,spring,rise,h,z,depth,tint,base,lip=.102,pointed=true){
      const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(-r,0);sh.lineTo(-r,spring);
      arcPoint(sh,r,spring,rise,false,pointed);sh.lineTo(r,0);sh.lineTo(w/2,0);sh.lineTo(w/2,h);
      sh.lineTo(-w/2,h);sh.closePath();k.profile(sh,tint,0,base,z-depth,depth);
      if(lip)rim(r,spring,rise,z+.014,base,lip,light,pointed);
    }
    function rim(r,spring,rise,z,y,t,tint,pointed=true){
      const sh=new T.Shape();sh.moveTo(-r-t,0);sh.lineTo(-r-t,spring);
      arcPoint(sh,r+t,spring,rise+t,false,pointed);sh.lineTo(r+t,0);sh.lineTo(r,0);
      sh.lineTo(r,spring);arcPoint(sh,r,spring,rise,true,pointed);sh.lineTo(-r,0);sh.closePath();k.profile(sh,tint,0,y,z,t*.48);
    }
    function lancet(r,spring,rise,z,y,tint,detail){
      const sh=new T.Shape();sh.moveTo(-r,0);sh.lineTo(-r,spring);arcPoint(sh,r,spring,rise,false);
      sh.lineTo(r,0);sh.closePath();k.profile(sh,tint,0,y,z,.044);
      rim(r,spring,rise,z+.048,y,.076,pale);
      if(detail==='shutter'){
        for(let j=0;j<Math.floor(spring/.165);j++)k.box(0xa29b85,0,y+.12+j*.165,z+.096,r*1.78,.080,.059,0,.16);
        k.box(dark,0,y+spring*.51,z+.115,.043,spring,.039);
        for(const sign of [-1,1])k.box(band,sign*r*.51,y+spring+rise*.36,z+.087,.033,rise*.72,.022,0,0,-sign*.40);
      }else if(detail==='glass'){
        k.box(0xa18c4e,0,y+.89,z+.055,.15,1.75,.02);k.box(0xa18c4e,0,y+1.36,z+.056,r*1.31,.14,.023);
        for(const sign of [-1,1])k.box(0x586d82,sign*r*.59,y+.57,z+.056,r*.28,.98,.025);
      }
    }
    function miniBays(x,z,y,w,h,n,tint=grey){
      for(let j=0;j<n;j++)k.place(x+w*((j+.5)/n-.5),z,0,()=>{
        const r=w/n*.353;
        lancet(r,h*.65,h*.28,0,y,deep);
        const inner=new T.Shape(),rr=r*.71,spr=h*.61;
        inner.moveTo(-rr,0);inner.lineTo(-rr,spr);arcPoint(inner,rr,spr,h*.23,false);
        inner.lineTo(rr,0);inner.closePath();k.profile(inner,tint===deep?band:light,0,y+.035,.046,.027);
      });
    }
    function pier(x,y,z,w,h,d,tint){
      k.box(tint,x,y+h/2,z,w,h,d);k.box(pale,x,y+.10,z,w+.12,.20,d+.10);
      k.box(light,x,y+h-.077,z,w+.11,.154,d+.11);
    }
    function sill(x,y,z,w,d){
      k.box(deep,x,y-.05,z,w+.17,.13,d+.15);k.box(pale,x,y+.041,z,w+.30,.083,d+.26);
    }
    function belfry(x){
      const z=west-1.90;
      // Two successive sets of paired louvres sit above the single
      // lancet. The crenellated heads are level; there are no spires.
      const stages=[[7.20,5.85,4.49,4.00,1],[13.05,2.90,4.17,3.84,2],[15.95,3.82,3.94,3.70,2]];
      for(const [y,h,w,d,n] of stages){
        k.box(grey,x,y+h/2,z,w,h,d);
        for(const [ox,oz,a,span] of [[0,d/2+.008,0,w],[0,-d/2-.008,pi,w],[-w/2-.008,0,-pi/2,d],[w/2+.008,0,pi/2,d]]){
          k.place(x+ox,z+oz,a,()=>{
            if(n===1){
              lancet(span*.217,2.23,1.04,.01,y+1.34,dark,'shutter');
              rim(span*.217+.11,2.25,1.06,.14,y+1.34,.067,band);
              miniBays(0,.018,y+.18,span-.34,.64,6,band);
            }else for(const side of [-1,1])k.place(side*span*.205,0,0,()=>{
              const spr=h*.45,rise=h*.20;
              lancet(span*.149,spr,rise,.016,y+.30,dark,'shutter');
              const n=5,r=span*.084,cy=y+.36+spr+rise*.36;
              for(let i=0;i<n;i++){const a=i*2*pi/n,px=Math.cos(a)*r*.65,py=Math.sin(a)*r*.65;
                k.box(pale,px,cy+py,.13,.030,r*.91,.028,0,0,a-pi/2);}
            });
          });
        }
        for(const side of [-1,1])for(const end of [-1,1])pier(x+side*(w/2-.07),y+.16,z+end*(d/2-.065),.27,h-.27,.28,deep);
        sill(x,y+h,z,w,d);
      }
      const top=19.77,w=4.12,d=3.84;
      k.box(deep,x,top+.12,z,w,.24,d);
      for(const side of [-1,1]){
        for(let i=0;i<8;i++){
          const off=w*(i/7-.5)*.92,ht=i===0||i===7?.55:.34;
          k.box(deep,x+off,top+.23+ht/2,z+side*d*.475,.24,ht,.25);
        }
        for(let i=1;i<7;i++)k.box(deep,x+side*w*.466,top+.41,z+d*(i/7-.5)*.92,.25,.34,.23);
      }
    }
    function rosette(){
      const y=10.62,z=west+.13,r=1.54;
      const disk=new T.CylinderGeometry(r,r,.105,56);k.stamp(disk,0x89958c,0,y,z,1,1,1,0,pi/2);disk.dispose();
      function ring(rad,t,tint,offset){
        const g=new T.TorusGeometry(rad,t,7,52);k.stamp(g,tint,0,y,z+offset);g.dispose();
      }
      ring(r+.14,.097,pale,.070);ring(r-.04,.084,deep,.10);ring(r*.89,.079,light,.118);
      ring(.27,.064,pale,.154);
      for(let i=0;i<18;i++){
        const a=2*pi*i/18,rr=r*.54;
        k.box(light,Math.sin(a)*rr,y+Math.cos(a)*rr,z+.149,.067,2*(rr-.17),.078,0,0,-a);
        k.box(0xb5a577,Math.sin(a)*r*.60,y+Math.cos(a)*r*.60,z+.089,.096,r*.42,.047,0,0,-a);
      }
    }
    function frontage(){
      const bays=[[-10.24,2.52,.72,2.45,1.05,5.0],[-6.28,5.40,1.19,3.12,1.38,6.50],
        [0,7.16,1.52,3.24,1.68,6.50],[6.28,5.40,1.19,3.12,1.38,6.50],[10.24,2.52,.72,2.45,1.05,5.0]];
      for(const [x,w,r,spr,rise,h] of bays)k.place(x,0,0,()=>{
        arcade(w,r,spr,rise,h,west,.62,grey,fc,.13);
        rim(r+.18,spr,rise+.20,west+.053,fc,.101,band);
        for(const side of [-1,1]){
          pier(side*(r+.16),fc,west+.103,.23,spr,.27,pale);
          if(w>5)k.box(wood,side*(r-.1),fc+1.25,west-.85,.13,2.45,.86);
        }
        if(w>5){
          arcade(w+.03,r*.78,2.56,1.0,5.09,west-1.33,.30,ochre,fc,.082);
          for(const side of [-1,1]){
            k.box(wood,side*(r*.78-.056),fc+1.36,west-1.30,.112,2.72,.20);
            k.box(dark,side*(r*.78-.11),fc+1.31,west-1.81,.15,2.60,.96);
          }
          if(x!==0)lancet(r*.70,2.42,.99,west-2.02,fc+.06,wood);
        }
      });
      // Arched return on either side of the narthex, plainly visible from
      // both courtyard walks. These returns are open to the outer arcade.
      for(const side of [-1,1])k.place(side*rx,west-2.38,side*pi/2,()=>arcade(4.78,1.43,2.66,1.73,5.32,0,.50,grey,fc,.12));
      for(const x of [-11.30,-8.99,-3.65,3.65,8.99,11.30]){
        const h=Math.abs(x)>10?6.0:6.48;
        pier(x,fc,west+.09,.36,h,.39,deep);
        if(Math.abs(x)>10){k.tapered(deep,x,6.99,west+.06,.20,.13,.38,1,6);k.tapered(pale,x,7.38,west+.06,.17,0,.42,1,6);}
      }
      for(const side of [-1,1]){
        k.box(grey,side*10.23,5.95,west-.21,2.55,.79,.41);
        miniBays(side*10.23,west+.025,5.76,2.21,.56,4,deep);belfry(side*6.28);
      }
      k.box(grey,0,10.40,west-.47,7.52,6.50,.94);
      miniBays(0,west+.017,7.38,7.14,.79,13,deep);
      k.box(pale,0,8.23,west+.007,7.47,.13,.23);
      rosette();
      for(const side of [-1,1])k.place(side*2.96,0,0,()=>{
        lancet(.38,2.43,.64,west+.026,8.68,band);
        pier(side*.49,8.45,west+.108,.17,4.33,.23,deep);
      });
      k.box(grey,0,14.08,west-.44,7.61,2.53,.87);miniBays(0,west+.003,13.10,7.26,1.87,8,band);
      k.box(pale,0,13.02,west+.02,7.69,.15,.23);k.box(deep,0,15.30,west-.02,7.69,.19,1.02);
      const g=new T.Shape();g.moveTo(-3.84,0);g.quadraticCurveTo(-2.28,.06,-1.57,.53);
      g.quadraticCurveTo(-.82,.91,0,1.0);g.quadraticCurveTo(.82,.91,1.57,.53);g.quadraticCurveTo(2.28,.06,3.84,0);g.closePath();
      k.profile(g,deep,0,15.39,west-.66,.65);
      k.box(dark,0,17.25,west-.36,.175,1.87,.22);k.box(dark,0,17.58,west-.36,1.21,.165,.22);
    }
    function apse(t){return [rx*Math.cos(t),roundStart-rz*Math.sin(t)];}
    function floorOutline(){
      const path=[[-rx,west],[rx,west],[rx,roundStart]];
      for(let i=1;i<=24;i++)path.push(apse(pi*i/24));return path;
    }
    function bay(x,z,angle,w,isDoor,pointed,end,lamp,cutback){
      // All side openings correspond to real bays. The outer piers stand
      // free of the ochre inner wall. The return is open under the eaves.
      const opening=w*(isDoor?.395:.368),spring=2.77,rise=pointed?1.54:1.11,eave=5.92;
      k.place(x,z,angle,()=>{
        arcade(w+.045,opening,spring,rise,eave,0,.39,grey,fc,.100,pointed);
        const lampTop=fc+spring+rise;
        k.box(dark,0,lampTop-.12,-.24,.027,.25,.027);
        k.box(lamp,0,lampTop-.44,-.24,.27,.42,.27);
        for(const dx of [-.141,.141])for(const dz of [-.141,.141])k.box(wood,dx,lampTop-.44,-.24+dz,.028,.45,.028);
        for(const h of [.24,.64])k.box(wood,0,lampTop-h,-.24,.318,.048,.318);
        for(const side of [-1,1]){
          const px=side*(w/2-.076);
          k.box(pale,px,3.43,.006,.17,5.43,.17);
          k.box(band,px,3.03,.108,.071,4.15,.042);
          k.box(light,side*opening,fc+spring+.005,.068,.42,.13,.25);
        }
        k.box(pale,0,5.80,.003,w+.05,.11,.15);
        k.box(0xb9ad96,0,6.36,-.006,w+.025,.48,.066);
        const inset=cutback??2.05,zInner=-inset;
        if(isDoor){
          arcade(w+.06,Math.min(opening*.80,1.47),2.51,1.22,5.55,zInner,.21,ochre,fc,.07,pointed);
          for(const side of [-1,1])k.box(wood,side*(Math.min(opening*.80,1.47)-.07),1.91,zInner-.48,.15,2.33,.91);
        }else{
          k.box(ochre,0,3.40,zInner,w+.38,5.36,.28);
          if(!end)lancet(.67,1.63,.73,zInner+.151,1.55,glass,'glass');
          k.box(band,0,1.44,zInner+.152,w+.08,.10,.16);
        }
      });
    }
    function arcades(){
      const sideFront=west-4.76,sideLength=sideFront-roundStart,width=sideLength/6;
      const lamps=[0xbb5440,0x4d86a5,0xc99a3c];
      for(const side of [-1,1])for(let i=0;i<6;i++){
        const z=sideFront-(i+.5)*width;
        bay(side*rx,z,side*pi/2,width,i===3,i>=4,false,lamps[i%3]);
        if(i===3)k.place(side*rx,z,side*pi/2,()=>steps(3.86,.68));
      }
      for(let i=0;i<9;i++){
        const a=apse(i*pi/9),b=apse((i+1)*pi/9),dx=b[0]-a[0],dz=b[1]-a[1];
        const angle=Math.atan2(-dz,dx),w=Math.hypot(dx,dz),cx=(a[0]+b[0])*.5,cz=(a[1]+b[1])*.5;
        bay(cx,cz,angle,w,i===4,true,true,lamps[(i+2)%3],1.58);
        if(i===4)k.place(cx,cz,angle,()=>steps(3.45,.68));
      }
    }
    function steps(w,h){
      for(let i=0;i<4;i++){const rise=h*(1-i/4);k.box(stone,0,rise/2,.13+i*.32,w,rise,.39);}
    }
    function roof(){
      const p=[],soffit=[],lip=[];
      function quad(arr,a,b,c,d){arr.push(...a,...b,...c,...a,...c,...d);}
      const ey=6.71,peak=10.02,zf=west-1.65;
      for(const side of [-1,1]){
        const a=[side*(rx+.37),ey,zf],b=[0,peak,zf],d=[side*(rx+.37),ey,roundStart],cc=[0,peak,roundStart];
        if(side<0)quad(p,a,b,cc,d);else quad(p,b,a,d,cc);
        if(side<0)quad(soffit,d,cc,b,a);else quad(soffit,cc,d,a,b);
        quad(lip,a,d,[d[0],ey-.16,d[2]],[a[0],ey-.16,a[2]]);
      }
      const middle=[0,peak,roundStart];
      for(let i=0;i<27;i++){
        const p0=pi*i/27,p1=pi*(i+1)/27,a=[(rx+.37)*Math.cos(p0),ey,roundStart-(rz+.36)*Math.sin(p0)],
          b=[(rx+.37)*Math.cos(p1),ey,roundStart-(rz+.36)*Math.sin(p1)];
        p.push(...middle,...a,...b);soffit.push(...b,...a,...middle);
        quad(lip,b,a,[a[0],ey-.16,a[2]],[b[0],ey-.16,b[2]]);
      }
      function skin(v,tint){
        const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.computeVertexNormals();
        k.stamp(geo,tint,0,0,0);geo.dispose();
      }
      skin(p,tile);skin(soffit,wood);skin(lip,ash);
      k.box(0x8d6150,0,peak+.028,(zf+roundStart)*.5,.17,.14,zf-roundStart);
    }
    function nave(){
      // Glimpses through the exterior doors: the white inner nave,
      // polygonal timber ceiling, wood pews and raised east chancel are
      // visible in the parish tour. Give the cross-aisle a clear sightline.
      const wallLine=4.46,bayW=4.22,front=16.06;
      for(const sign of [-1,1])for(let i=0;i<7;i++){
        const z=front-(i+.5)*bayW;
        k.place(sign*wallLine,z,sign*pi*.5,()=>arcade(bayW+.025,1.63,3.01,1.83,7.40,0,.37,light,fc,.11));
      }
      k.box(0xa98f6d,0,9.04,-.42,5.35,.16,34.2);
      for(const sign of [-1,1])k.box(0xb19571,sign*3.40,8.64,-.42,1.76,.16,34.2,0,0,-sign*.46);
      for(let i=0;i<14;i++){
        const z=13.60-i*1.64;
        if(Math.abs(z+1.13)<1.35)continue;
        for(const sign of [-1,1]){
          const x=sign*2.65;
          k.box(wood,x,1.16,z,2.93,.10,.44);k.box(wood,x,1.49,z+.23,2.93,.63,.085);
          for(const end of [-1,1])k.box(wood,x+end*1.35,.97,z,.11,.52,.38);
        }
      }
      k.box(stone,0,.97,-15.02,7.25,.58,3.72);
      k.box(pale,0,1.71,-16.04,2.82,.92,.78);k.box(light,0,2.22,-16.04,3.03,.12,.91);
      k.box(0x9d8a73,0,3.82,-18.0,3.25,5.13,.31);
      k.box(0x80684e,0,4.98,-17.78,.13,1.52,.12);k.box(0x80684e,0,5.18,-17.78,1.01,.12,.12);
    }
    function build(){
      const footprint=floorOutline();
      extrudeXZ(footprint,-.28,fc,stone);
      for(let i=0;i<4;i++){
        const path=[[-rx-i*.17,west-.95],[rx+i*.17,west-.95]];
        for(let j=0;j<=28;j++){
          const a=j*pi/28;path.push([(rx+i*.17)*Math.cos(a),west+(1.14+i*.34)*Math.sin(a)]);
        }
        const top=fc*(1-i/4);extrudeXZ(path,0,top,stone);
      }
      frontage();arcades();nave();roof();
    }
    function pavedCourt(){
      // Visible hardstand between the west gate and steps, then the narrow
      // strips along the arcades. The neighboring school and chapels lie
      // outside these edges. The two bonsai bowls have separate positions.
      const court=[[-17.32,58.65],[-16.74,26.94],[-19.27,20.92],[-17.49,-9.12],[-15.48,-24.69],[-11.03,-33.67],
        [-2.63,-36.39],[2.01,-41.21],[6.50,-38.11],[8.64,-22.73],[16.52,-18.76],[17.08,14.91],[17.84,19.16],
        [17.26,57.95],[10.90,60.72]];
      const loop=court.map(([x,z])=>new T.Vector2(x,z)),pos=[],idx=[];
      for(const face of T.ShapeUtils.triangulateShape(loop,[])){
        const [a,b,c]=face.map(j=>loop[j]),n=Math.ceil(Math.max(a.distanceTo(b),b.distanceTo(c),c.distanceTo(a))/4.2);
        const rows=[];
        for(let j=0;j<=n;j++){
          const row=[];rows.push(row);
          for(let i=0;i<=n-j;i++){
            const x=a.x+(b.x-a.x)*i/n+(c.x-a.x)*j/n,z=a.y+(b.y-a.y)*i/n+(c.y-a.y)*j/n;
            row.push(pos.length/3);pos.push(x,0,z);
          }
        }
        for(let j=0;j<n;j++)for(let i=0;i<n-j;i++){
          idx.push(rows[j][i],rows[j+1][i],rows[j][i+1]);
          if(i<n-j-1)idx.push(rows[j+1][i],rows[j+1][i+1],rows[j][i+1]);
        }
      }
      const geo=new T.BufferGeometry(),v=new T.Float32BufferAttribute(pos,3);
      geo.setAttribute('position',v);geo.setIndex(idx);geo.computeVertexNormals();
      const mat=new T.MeshLambertMaterial({color:0xc1bbaa,side:T.DoubleSide});
      mat.onBeforeCompile=sh=>{
        sh.vertexShader='varying vec2 parishGround;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nparishGround=position.xz;');
        sh.fragmentShader='varying vec2 parishGround;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec2 q=parishGround/vec2(4.2,4.8),edge=min(fract(q),1.-fract(q));
          float joint=smoothstep(.001,.001+max(fwidth(q.x),fwidth(q.y))*.61,min(edge.x,edge.y));
          float rough=fract(sin(dot(floor(parishGround*17.),vec2(11.86,75.61)))*31971.);
          diffuseColor.rgb*=mix(.79,.94+.065*rough,joint);`);
      };
      const mesh=new T.Mesh(geo,mat);mesh.name='Sân bê tông trước nhà thờ';mesh.receiveShadow=true;k.group.add(mesh);
      return (land,level)=>{
        for(let i=0;i<v.count;i++){
          const x=v.getX(i),z=v.getZ(i),h=land(x,z),d=Math.max(Math.abs(x-mid)-rx,z-west,roundStart-9.58-z,0);
          const t=Math.min(1,d/8.2);
          v.setY(i,Math.max(h+.115,level+.032+(h-level)*t*t*(3-2*t)));
        }
        v.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();
      };
    }
    function planters(){
      const rims=new T.LatheGeometry([[.62,.23],[.76,.28],[1.19,.49],[1.24,.63],[1.32,.70],[1.32,.75],
        [1.17,.75],[1.13,.63],[.94,.53]].map(([x,y])=>new T.Vector2(x,y)),32);
      const bark=0x706957,canopy=0x687442,foliage=new T.IcosahedronGeometry(1,1);
      function branch(points,r){
        const g=new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),8,r,7);
        k.stamp(g,bark,0,0,0);g.dispose();
      }
      for(const [x,z,a] of [[-11.15,28.75,-.62],[6.81,28.81,.83]])k.place(x,z,a,()=>{
        for(let i=0;i<3;i++)k.stamp(k.round,deep,.62*Math.cos(i*pi*2/3),.15,.62*Math.sin(i*pi*2/3),.19,.30,.19);
        k.stamp(rims,stone,0,0,0);k.stamp(k.round,0x665b48,0,.61,0,1.13,.07,1.13);
        branch([[0,.65,0],[-.13,1.08,-.07],[-.06,1.57,.05],[.21,2.02,.16]],.135);
        for(let i=0;i<7;i++){
          const t=2*pi*i/7+.61,dx=Math.cos(t),dz=Math.sin(t),h=1.43+i%3*.23;
          branch([[0,1.2,0],[.46*dx,h,.36*dz],[.88*dx,h+.19,.81*dz],[1.07*dx,h+.49,.94*dz]],.065);
          if(i%3!==2)k.stamp(foliage,canopy,.96*dx,h+.53,.90*dz,.39,.18,.36);
        }
      });
      rims.dispose();foliage.dispose();
    }
    k.place(mid,0,0,build);
    planters();
    const fitCourt=pavedCourt();
    const outline=floorOutline();
    let body;
    k.group.userData.fitGround=land=>{
      if(!body){
        body=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'));
        body.scale.y=23.6/(19.77+.23+.55);
        k.group.userData.height=23.6;
        const mat=body.material;
        if(!mat.userData.mangLangPatina){
          const previous=mat.onBeforeCompile,cacheKey=mat.customProgramCacheKey();
          mat.customProgramCacheKey=()=>cacheKey+'-mang-lang-render';
          mat.onBeforeCompile=function(sh,renderer){
            previous.call(this,sh,renderer);
            sh.vertexShader='varying vec3 churchP;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nchurchP=position;');
            sh.fragmentShader=`varying vec3 churchP;
              float churchHash(vec2 p){return fract(sin(dot(p,vec2(42.106,18.715)))*34854.76);}
              float churchRain(vec2 p){
                vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
                return mix(mix(churchHash(i),churchHash(i+vec2(1,0)),f.x),mix(churchHash(i+vec2(0,1)),churchHash(i+1.),f.x),f.y);
              }\n`+sh.fragmentShader.replace('#include <alphatest_fragment>',`#include <alphatest_fragment>
              if(surfaceKind>.5 && surfaceKind<1.5 && abs(vColor.r-vColor.g)<.16){
                float fl=churchP.z>16.5?1.:.21+.23*(1.-smoothstep(.6,2.1,churchP.y));
                vec2 p=vec2(churchP.x+churchP.z*.79,churchP.y);
                float broad=churchRain(p*vec2(1.86,.63));
                float mottled=.21*broad+.32*churchRain(p*vec2(4.6,2.1))+.27*churchRain(p*8.1)+.20*churchRain(p*16.7);
                float stainAmt=smoothstep(.435,.715,mottled)*fl;
                diffuseColor.rgb*=mix(vec3(1.10),vec3(.265,.286,.284),stainAmt);
              }`);
          };
          mat.userData.mangLangPatina=true;mat.needsUpdate=true;
        }
      }
      const samples=outline.map(([x,z])=>land(x+mid,z));
      body.position.y=Math.max(land(mid,0),...samples)+.055;
      fitCourt(land,body.position.y);
    };
  }

  // 12. Nhà thờ Núi / Nhà thờ Chính tòa Nha Trang (1928 — đá chẻ xám Gothic)
  function nhaThoNuiNhaTrang(T, kit) {
    A.gothicChurch(T, kit, {
      w: 17.0, d: 35, naveH: 11.2, towerH: 30.0, twinTowers: false,
      wall: 0xb0aba0, trim: 0xd2cdc0, roof: 0x6f7375, dark: 0x2b2d30,
      title: 'NHÀ THỜ NÚI NHA TRANG'
    });
    A.trees(T, kit, [{ x: -11.5, z: 12.0, h: 8.2, kind: 'palm' }, { x: 11.5, z: 12.0, h: 8.5, kind: 'palm' }]);
  }

  // 13. Chùa Long Sơn – Kim Thân Phật Tổ (Nha Trang — tượng Phật trắng khổng lồ trên đài sen)
  function chuaLongSonNhaTrang(T, kit) {
    const { box, stamp, round, tapered } = kit;
    const white = 0xf2f0ea, cream = 0xe4dfd4, stone = 0x8f8a80;
    kit.palette({plaster: cream, stone});

    const {building,stairs}=createTempleFoundations(T,kit);
    // The chánh điện is at street level. The stair landings bend around the
    // east side of the slope before reaching the Kim Thân Phật Tổ above.
    const lowerHall=building(0,0,-.38,28.4,31.6,()=>{
      A.vietnameseHall(T,kit,{w:26,d:29,baseH:1.18,colH:5.30,doubleTier:true,bays:5,
        tile:0xc3653f,wood:0x513a31,wall:0xd3b88d,ridge:0x9c9690,eave:0xaf8c64,
        atticColor:0x79533d,title:'CHÙA LONG SƠN',incense:false});
    });
    stairs(lowerHall,-8,15,-11,24,5.1,1.17,23);
    stairs(lowerHall,5.8,19.25,2,29,3.0,1.17,25);
    building(33,-41,.90,7.8,7.8,()=>{
      box(stone,0,.30,0,7.8,.60,7.8);
      for(const x of [-2.7,2.7])for(const z of [-2.7,2.7]){
        stamp(round,0x82462d,x,2.88,z,.26,4.65,.26);
        stamp(round,stone,x,.82,z,.40,.50,.40);
      }
      box(0x593d2b,0,4.94,0,6.76,.36,.40);
      const bell=new T.LatheGeometry([[0,0],[1.14,0],[1.19,.16],[1.0,.30],[.87,1.48],[.66,2.12],[.32,2.32],[.24,2.54],[0,2.54]]
        .map(([r,y])=>new T.Vector2(r,y)),24);
      stamp(bell,0x6d5742,0,1.62,0);bell.dispose();
      tapered(0x594331,0,4.50,0,.06,.06,.84,1,8);
      A.curvedRoof(T,kit,0,5.00,0,8.45,8.45,2.28,0xb65c39,cream,0xb39365,.40);
    });
    const summit=building(44,-87,.93,21,21,()=>{
      box(stone,0,.55,0,21,1.10,21);
      // The paving makes a flower around the octagonal memorial base.
      for(let i=0;i<8;i++){
        const angle=i*Math.PI/4;
        stamp(round,0xc7b495,Math.sin(angle)*6.36,1.111,Math.cos(angle)*6.36,1.95,.022,2.74,angle);
      }

      kit.place(0,-1.5,0,()=>{
        const drum=0xb8b5a7,trim=0xb38a45,maroon=0x703a34;
        kit.palette({plaster:[white,cream],stone:[stone,drum]});
        kit.place(0,0,Math.PI/8,()=>{
          tapered(drum,0,1.89,0,6.95,6.70,2.22,1,8);
          tapered(drum,0,4.84,0,6.70,6.60,3.68,1,8);
          tapered(trim,0,6.88,0,6.62,6.93,.40,1,8);
          tapered(cream,0,7.28,0,6.96,6.79,.40,1,8);
        });
        A.lotusSeat(T,kit,0,7.42,0,6.44,2.74,white,cream);
        // Seven lotus-shaped memorial tablets. The three facing the camera
        // use their own portraits; the other four retain only their frames.
        for(const index of [-3,-2,-1,0,1,2,3]){
          const a=index*Math.PI/4;
          kit.place(6.17*Math.sin(a),6.17*Math.cos(a),a,()=>{
            kit.outline([[-.51,0],[-.98,.40],[-1.07,1.26],[-.83,1.80],[-.64,2.18],[-.49,1.96],
              [-.18,2.40],[.02,2.20],[.34,2.48],[.53,2.03],[.67,2.12],[.90,1.72],
              [1.02,.89],[.87,.34],[.51,0]],maroon,0,3.28,0,.09);
          });
        }
        const photograph={photo:'sight-imagery/long-son-kim-than.webp',width:664,height:1000,crop:[116,97,417,554]};
        for(const face of [
          {index:-1,cx:171,y:638,span:.044,rows:[[558,174,178,.025],[571,158,187,.06],[588,151,190,.08],
            [605,149,187,.09],[626,146,177,.08],[635,153,167,.055]]},
          {index:0,cx:324,y:640,span:.026,rows:[[550,319,326,.03],[558,305,332,.06],[566,296,350,.08],
            [583,288,356,.095],[610,288,356,.09],[628,296,347,.085],[638,305,337,.045]]},
          {index:1,cx:476,y:643,span:.045,rows:[[561,462,469,.026],[577,457,477,.06],[594,455,482,.08],
            [616,459,489,.09],[634,466,488,.08],[641,475,484,.044]]}
        ]){
          const a=face.index*Math.PI/4;
          kit.place(6.19*Math.sin(a),6.19*Math.cos(a),a,()=>{
            const panel=A.photoCarving(T,kit,{...photograph,origin:[face.cx,face.y],scale:.0265,
              position:[0,3.35,.102],tint:maroon,forms:[{rows:face.rows}]});
            panel.scale.x=face.span/.0265;
          });
        }
        // The front shape follows the seated figure, with separate knees so
        // foreground lotus petals from the reference do not appear on the robe.
        const buddha=A.photoCarving(T,kit,{...photograph,origin:[325,406],position:[0,10,0],scale:14/303,tint:white,
          forms:[
            {z:-.24,rows:[[103,316,334,.22],[107,307,343,.55],[117,298,352,.85],[133,293,359,1.01],
              [153,291,364,1.06],[171,291,365,1.03],[187,292,363,.96],[195,297,358,.88],
              [201,304,351,.81],[211,301,351,.82],[218,294,357,.99]]},
            {z:-.38,rows:[[198,306,348,.83],[205,290,353,.95],[211,280,365,1.16],[217,261,380,1.41],
              [223,238,398,1.57],[232,226,411,1.70],[249,217,422,1.82],[273,210,429,1.88],
              [300,205,439,1.98],[323,200,447,2.05],[342,197,453,2.12],[360,206,444,2.31],
              [369,237,416,2.29],[375,270,388,2.17],[379,302,347,2.04]]},
            {z:.22,rows:[[334,175,205,1.08],[338,156,235,1.59],[347,142,257,1.88],[358,134,280,2.05],
              [374,128,287,2.13],[382,126,281,2.12],[391,126,211,1.81],[399,128,185,1.62],[406,133,164,1.17]]},
            {z:.20,rows:[[339,440,481,1.02],[345,419,499,1.50],[353,401,509,1.92],[364,384,517,2.04],
              [375,371,521,2.10],[384,381,523,2.14],[393,444,523,1.87],[400,467,521,1.57],[406,490,520,1.19]]}
          ]});
        buddha.scale.x=.61;
      });
    });
    stairs(summit,52,-85,75,-64,5.4,1.10,35);
  }

  // 14. Tháp Chăm Pô Sah Inư (Phan Thiết, Bình Thuận / Lâm Đồng)
  function thapPoSahInu(T, kit) {
    kit.box(0x8e806d, 0, 0.35, 0, 28, 0.70, 18);
    A.chamTower(T, kit, -3.5, -1.2, { w: 7.4, h: 17.5, tiers: 3, brick: 0xa65038 });
    A.chamTower(T, kit, 7.2, 2.2, { w: 5.4, h: 13.0, tiers: 3, brick: 0x9c4932 });
    A.chamTower(T, kit, -10.2, 4.8, { w: 3.6, h: 8.5, tiers: 2, brick: 0xae583f });
    A.trees(T, kit, [{ x: 11.8, z: -5.5, h: 7.8, kind: 'palm' }, { x: -12.5, z: -5.2, h: 8.0, kind: 'palm' }]);
  }

  // 15. Tháp Nước Phan Thiết (1934 — tháp bát giác gạch đỏ hình đài sen bên sông Cà Ty)
  function thapNuocPhanThiet(T, kit) {
    const { stamp, tapered, box } = kit;
    const brick = 0xa9523b, darkBrick = 0x8a402d, cream = 0xebe2cc, tile = 0x7c3b2a;
    kit.palette({brick: [brick, darkBrick], plaster: cream, tile});

    // Octagonal riverside park plinth & lower arched brick base
    tapered(0x8c867c, 0, 0.45, 0, 7.2, 6.8, 0.9, 1, 8);
    tapered(brick, 0, 3.2, 0, 5.6, 5.2, 4.8, 1, 8);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      box(0x2d211c, Math.sin(a) * 5.1, 2.8, Math.cos(a) * 5.1, 1.5, 3.0, 0.2, a);
    }
    // Tall slender tapering octagonal red-brick shaft (22m)
    tapered(brick, 0, 13.8, 0, 4.6, 3.3, 16.5, 1, 8);
    // Decorative vertical pilasters & slit vents
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + Math.PI / 8;
      box(darkBrick, Math.sin(a) * 3.9, 13.8, Math.cos(a) * 3.9, 0.35, 16.0, 0.28, a);
    }
    // Iconic projecting corbelled octagonal lotus water reservoir tank (Đài nước bát giác)
    tapered(cream, 0, 22.8, 0, 3.4, 5.6, 1.8, 1, 8);
    tapered(brick, 0, 26.2, 0, 5.5, 5.5, 5.2, 1, 8);
    tapered(cream, 0, 29.0, 0, 5.8, 5.6, 0.45, 1, 8);
    // Conical octagonal roof & finial spire
    tapered(tile, 0, 30.8, 0, 5.7, 0.25, 3.2, 1, 8);
    A.plaque(T, kit, 'THÁP NƯỚC PHAN THIẾT', 0, 5.4, 5.45, 4.2, 0.66, { bg: '#efe2c0', fg: '#782b1e' });
  }

  // 16. Quảng trường Lâm Viên Đà Lạt (Nụ hoa Atiso kính xanh & Khối Hoa Dã Quỳ vàng rực!)
  function quangTruongLamVien(T, kit) {
    const {stamp,tapered}=kit,{building}=createTempleFoundations(T,kit);
    const emerald=[0x1f7270,0x257775,0x2a827a],leaves=[0xa9ce3d,0xabcf30,0x85b832];
    const petals=[0xedbd39,0xe6af31,0xf2c845],frame=0x405b53,base=0x93918a;
    kit.palette({stone:base,metal:frame,glass:[...emerald,...leaves,...petals]});

    // Each panel is set into its steel frame. Twisting the rings carries the
    // spiral bands continuously over the bud and the broad petals across the roof.
    function glazing(rings,segments,tint){
      const swatches=new Map();
      function triangle(vertices,colour){
        if(!swatches.has(colour))swatches.set(colour,[]);
        swatches.get(colour).push(...vertices.flat());
      }
      function point(ring,i){
        const [r,y,twist]=ring,angle=i*Math.PI*2/segments+twist;
        return [Math.sin(angle)*r,y,Math.cos(angle)*r];
      }
      function pane(a,b,c,colour){
        triangle([a,b,c],frame);
        const centre=a.map((v,j)=>(v+b[j]+c[j])/3);
        const face=[a,b,c].map(p=>p.map((v,j)=>(v*.971+centre[j]*.029)*(j===1?1:1.002)+(j===1?.018:0)));
        triangle(face,colour);
      }
      for(let j=0;j<rings.length-1;j++)for(let i=0;i<segments;i++){
        const a=point(rings[j],i),b=point(rings[j],i+1),c=point(rings[j+1],i+1),d=point(rings[j+1],i);
        pane(a,b,c,tint(i,j,0));pane(a,c,d,tint(i,j,1));
      }
      for(const [colour,positions] of swatches){
        const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));
        geo.computeVertexNormals();stamp(geo,colour,0,0,0);geo.dispose();
      }
    }

    // Western café footprint (OSM way 1304080959). Its yellow-green leaves
    // twist around an upright teardrop of teal glass.
    building(0,0,0,19.0,19.0,()=>{
      tapered(base,0,.23,0,10.65,10.65,.46,1,48);
      const rings=[[7.8,.45,0],[9.35,2.0,.17],[10.05,4.0,.36],[10.22,6.2,.56],
        [9.68,8.5,.78],[8.36,10.5,1.01],[6.57,12.4,1.23],[4.39,13.9,1.47],[2.25,15.15,1.67],[.04,15.83,1.89]];
      glazing(rings,48,(i,j,k)=>(i%12<6?leaves:emerald)[(i+j+k)%3]);
    });

    // The opera house (OSM way 777439868) is a low 41 m dome east of the café. The
    // gold lobes sweep down over the blue-green curtain wall toward the lake.
    building(132.98,5.93,0,37.2,37.2,()=>{
      tapered(base,0,.27,0,20.30,20.30,.54,1,60);
      const rings=[[17.35,.53,.05],[19.13,2.48,.09],[20.18,4.85,.14],[20.40,7.15,.18],
        [19.89,9.55,.22],[18.98,11.40,.26],[17.22,13.38,.30],[15.11,15.04,.34],
        [12.39,16.48,.38],[8.77,17.61,.42],[4.81,18.21,.45],[.05,18.51,.47]];
      glazing(rings,60,(i,j,k)=>{
        const bearing=(i+k*.36+.5)/60*Math.PI*2,edge=(1-Math.cos(bearing*5))*.5;
        return (j+.5>1.05+5.2*edge?petals:emerald)[(i+j+k)%3];
      });
    });
  }

  // 17. Nhà thờ Con Gà Đà Lạt (1931 — tường hồng cam & tháp chuông 47m có gà đồng trên đỉnh)
  function nhaThoConGaDaLat(T, kit) {
    A.gothicChurch(T, kit, {
      w: 15.8, d: 35, naveH: 10.6, towerH: 31.5, twinTowers: false,
      wall: 0xdf9f88, trim: 0xf4e4d6, roof: 0x8c3c2e, dark: 0x332825,
      title: 'NHÀ THỜ CON GÀ ĐÀ LẠT'
    });
    // Iconic golden bronze weathercock perched atop the towering spire
    kit.box(0xe6be4c, 0, 35.8, 15.7, 0.95, 0.55, 0.22);
    A.trees(T, kit, [
      { x: -11.5, z: 8.5, h: 13.0, kind: 'pine' }, { x: 11.5, z: 8.5, h: 12.2, kind: 'pine' },
      { x: -11.8, z: -8.0, h: 12.5, kind: 'pine' }, { x: 11.8, z: -8.0, h: 11.8, kind: 'pine' }
    ]);
  }

  // 18. Trường Cao đẳng Sư phạm Đà Lạt (1927 — dãy nhà cong gạch đỏ & tháp chuông cao vút)
  function cdSuPhamDaLat(T, kit) {
    const { box, tapered } = kit;
    const redBrick = 0xa84b36, cream = 0xf2e7d2, roof = 0x7c392a, dark = 0x2b2928;

    // Signature sweeping curved 3-story French red-brick classroom wing (10 arc segments)
    const R = 24.0;
    const segs = 9;
    kit.palette({plaster: cream});
    for (let i = 0; i < segs; i++) {
      const a = -0.58 + (i / (segs - 1)) * 1.16;
      const sx = Math.sin(a) * R;
      const sz = Math.cos(a) * R - R + 2.0;
      const yaw = a;
      // Red brick wall segment + pale arched cloister ground arcade + 2 rows of French windows
      box(redBrick, sx, 4.8, sz, 4.2, 9.2, 6.2, yaw);
      box(cream, sx, 0.35, sz, 4.4, 0.7, 6.6, yaw);
      box(cream, sx, 9.45, sz, 4.4, 0.32, 6.6, yaw);
      // Ground arcade arch opening & upstairs windows facing inner courtyard (+Z)
      const fx = sx + Math.sin(a) * 3.15, fz = sz + Math.cos(a) * 3.15;
      box(dark, fx, 1.9, fz, 2.2, 3.2, 0.14, yaw);
      box(dark, fx, 5.4, fz, 1.8, 2.0, 0.14, yaw);
      box(dark, fx, 8.0, fz, 1.8, 1.7, 0.14, yaw);
      // Steep Dalat tiled roof segment
      tapered(roof, sx, 11.2, sz, 4.4, 2.8, 3.2, 0.9, 4);
    }

    // Iconic 54m-scale slender red-brick Bell Tower anchoring the right end of the curve
    const tx = 14.5, tz = -1.2;
    box(redBrick, tx, 13.5, tz, 4.4, 27.0, 4.4);
    box(cream, tx, 22.0, tz, 4.8, 0.36, 4.8);
    for (const f of [-1, 1]) {
      box(dark, tx, 24.5, tz + f * 2.24, 1.65, 3.8, 0.14);
      box(dark, tx + f * 2.24, 24.5, tz, 0.14, 3.8, 1.65);
    }
    tapered(roof, tx, 29.8, tz, 3.2, 0.18, 5.8, 1, 4);
    A.plaque(T, kit, 'CAO ĐẲNG SƯ PHẠM ĐÀ LẠT', 0, 3.8, 5.4, 6.6, 0.82, { bg: '#f2e6ca', fg: '#7c2b1e' });
    A.trees(T, kit, [
      { x: -16.5, z: 3.5, h: 14.0, kind: 'pine' }, { x: 18.2, z: 4.5, h: 13.5, kind: 'pine' },
      { x: -8.5, z: -8.5, h: 13.0, kind: 'pine' }, { x: 6.5, z: -9.5, h: 13.8, kind: 'pine' }
    ]);
  }

  const sights = [
    {
      id: 'chung-tich-son-my', name: 'Khu chứng tích Sơn Mỹ', city: 'TP. Quảng Ngãi', province: 'Quảng Ngãi',
      lon: 108.872704, lat: 15.177955, yaw: -1.312, width: 25, depth: 20,
      views:[{name:'Nhóm tượng Sơn Mỹ',height:13.0,viewRadius:21,viewAngle:-1.32,viewElevation:.05,viewFov:48}],
      start: [108.871750, 15.177710],
      map: 'https://www.openstreetmap.org/node/13260659280',
      source: 'https://vovworld.vn/vi-VN/media/chung-tich-son-my-sau-50-nam-tham-sat-my-lai-1558953.vov5',
      build: chungTichSonMy
    },
    
    {
      id: 'nha-tho-go-kon-tum', name: 'Nhà thờ Gỗ Kon Tum', city: 'Kon Tum', province: 'Quảng Ngãi', formerProvince: 'Kon Tum',
      lon: 108.013228, lat: 14.345115, yaw: 1.636, width: 20, depth: 36,
      start: [108.013423, 14.345127], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/way/464462559',
      source: 'https://dulichkontum.gov.vn/',
      build: nhaThoGoKonTum
    },
    {
      id: 'cau-treo-kon-klor', name: 'Cầu treo Kon Klor', city: 'Kon Tum', province: 'Quảng Ngãi', formerProvince: 'Kon Tum',
      lon: 108.035525, lat: 14.346990, yaw: -1.0523, width: 185, depth: 13,
      viewAngle: -0.45, viewElevation: 0.22,
      start: [108.03515, 14.34765], viewDistance: 1500,
      solids: [[0, -5.6, 108, 0.7], [0, 5.6, 108, 0.7]],
      map: 'https://www.openstreetmap.org/#map=17/14.34699/108.03553',
      source: 'https://dulichkontum.gov.vn/',
      build: cauTreoKonKlor
    },
    {
      id: 'thap-banh-it', name: 'Tháp Bánh Ít', city: 'Tuy Phước', province: 'Gia Lai', formerProvince: 'Bình Định',
      lon: 109.135186, lat: 13.868437, yaw: 0, width: 24, depth: 18,
      start: [109.137156,13.867346], viewDistance: 1350,
      solids:[[-1,0,9,6.3],[5,14,7.8,3.7],[26,54,5.7,4.5],[104,-21.5,6.4,1.4],[104,-14.5,6.4,1.4]],
      views:[{name:'Tháp chính và tháp Yên Ngựa',offset:[1,6],height:24,viewRadius:64,viewAngle:1.15},
        {name:'Qua tháp cổng',offset:[104,-18],height:12,viewRadius:34,viewAngle:1.73},
        {name:'Toàn cảnh sườn đồi',offset:[47,14],height:18,viewRadius:170,viewAngle:1.8,viewElevation:.52}],
      description:'Từ đường vào phía đông, tháp cổng mở lối lên đồi. Tháp chính và tháp mái cong hình yên ngựa đứng gần nhau ở đỉnh. Tháp còn lại nằm về phía đông nam.',
      map: 'https://www.openstreetmap.org/way/677227553',
      source: 'https://dsvh.gov.vn/Upload/files/Thap%20Cham%20Binh%20Dinh.pdf',
      build: thapBanhIt
    },
    {
      id: 'thap-duong-long', name: 'Tháp Dương Long', city: 'Tây Sơn', province: 'Gia Lai', formerProvince: 'Bình Định',
      lon: 108.990388, lat: 13.924992, yaw: -3.117, width: 38, depth: 18,
      start: [108.990374, 13.925552], viewDistance: 1450,
      map: 'https://www.openstreetmap.org/node/11784634071',
      source: 'https://dsvh.gov.vn/',
      build: thapDuongLong
    },
    {
      id: 'bao-tang-quang-trung', name: 'Bảo tàng Quang Trung', city: 'Tây Sơn', province: 'Gia Lai', formerProvince: 'Bình Định',
      lon: 108.920886, lat: 13.923923, yaw: 1.392, width: 28, depth: 26,
      start: [108.921996, 13.923728], viewDistance: 1300,
      map: 'https://www.openstreetmap.org/way/239866174',
      source: 'https://dsvh.gov.vn/',
      build: baoTangQuangTrung
    },
    {
      id: 'quang-truong-dai-doan-ket', name: 'Quảng trường Đại Đoàn Kết', city: 'Pleiku', province: 'Gia Lai',
      lon: 108.005989, lat: 13.982935, yaw: -2.177, width: 32, depth: 24,
      start: [108.005865, 13.983018], viewDistance: 1250,
      map: 'https://www.openstreetmap.org/node/5997147685',
      source: 'https://baochinhphu.vn/ket-luan-cua-ban-bi-thu-trung-uong-dang-ve-viec-xay-dung-tuong-dai-bac-ho-tai-gia-lai-10240252.htm',
      build: quangTruongDaiDoanKet
    },
    {
      id: 'tuong-dai-chien-thang-bmt', name: 'Tượng đài Chiến thắng Buôn Ma Thuột', city: 'Buôn Ma Thuột', province: 'Đắk Lắk',
      lon: 108.037800, lat: 12.679600, yaw: -2.521, width: 24, depth: 24,
      start: [108.037530, 12.679970], viewDistance: 1300,
      map: 'https://www.openstreetmap.org/#map=18/12.67960/108.03780',
      source: 'https://daklak.gov.vn/',
      build: tuongDaiChienThangBmt
    },
    {
      id: 'nha-tho-mang-lang', name: 'Nhà thờ Mằng Lăng', city: 'Tuy An Đông', province: 'Đắk Lắk', formerProvince: 'Phú Yên',
      catalogId:'osm-way-804128824',lon:109.225948,lat:13.334185,yaw:-1.405299,width:23.01,depth:45.04,
      start:[109.2252868,13.3340986],mappedEntrance:true,visitOnArrival:true,viewDistance:1200,
      map:'https://www.openstreetmap.org/way/804128824',photo:'https://daklakvrtour.com/tour/69/index.html#node3',
      source:'https://baodaklak.vn/van-hoa-du-lich-van-hoc-nghe-thuat/202511/kien-truc-dac-sac-cua-nha-tho-co-mang-lang-2a50145/',
      description:'Nhà thờ Mằng Lăng được khởi công năm 1892 và khánh thành năm 1907. Hai tháp chuông vuông cao khoảng 23,6 m đứng hai bên ô cửa hoa và thánh giá. Từ sân phía tây, đi dọc hành lang vòm sẽ đến vòng cung phía sau cung thánh. Mặt bằng theo đường bao OpenStreetMap. Tỷ lệ các tầng và hoa văn được ước dựng theo ảnh.',
      arrivalNote:'Xe dừng trong sân đỗ ngoài cổng phía tây. Cổng cách xe khoảng 11 m, từ đó đi bộ qua sân đến bậc trước nhà thờ.',
      modeledBuildings:['w804128824'],solids:[],plasterStain:.34,
      boundary:[[-12.14,21.52],[10.87,21.52],[10.88,-13.94],[9.85,-17.12],[8.03,-19.74],[5.57,-21.78],[2.66,-23.07],
        [-.51,-23.52],[-3.75,-23.07],[-6.74,-21.74],[-9.25,-19.63],[-11.07,-16.91],[-12.14,-13.95]],
      reserve:(x,z,r)=>(x>-13-r&&x<12+r&&z>-24.5-r&&z<26.5+r)||
        (Math.abs(x)<16.7+r&&z>=20-r&&z<58.5+r),
      views:[['Hai tháp chuông và ô cửa hoa',-.63,19.5,24.35,38.7,-.069,-.164,47],
        ['Hành lang vòm bên hông nhà thờ',9.5,-1.6,7.3,16.6,.82,-.068,52],
        ['Vòng hành lang sau cung thánh',-.6,-18.5,8.5,21,3.05,-.077,52]]
        .map(([name,x,z,height,viewRadius,a,viewElevation,viewFov])=>{
          const yaw=-1.405299,c=Math.cos(yaw),s=Math.sin(yaw);
          return {name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius,viewAngle:yaw+a,viewElevation,viewFov,viewBase:'monument'};
        }),
      build: nhaThoMangLang
    },
    {
      id: 'nha-tho-nui-nha-trang', name: 'Nhà thờ Núi Nha Trang', city: 'Nha Trang', province: 'Khánh Hòa',
      lon: 109.188128, lat: 12.246788, yaw: -0.512, width: 22, depth: 38,
      start: [109.187820, 12.246250], viewDistance: 1350,
      map: 'https://www.openstreetmap.org/way/162818208',
      source: 'https://nhatrang-travel.com/',
      build: nhaThoNuiNhaTrang
    },
    {
      id: 'chua-long-son-nha-trang', name: 'Chùa Long Sơn – Kim Thân Phật Tổ', city: 'Nha Trang', province: 'Khánh Hòa',
      lon: 109.180556, lat: 12.251258, yaw: 0, width: 29, depth: 32,
      modeledStairWays:[1239863980,1239863982,196896062],
      solids:[[0,0,12,13],[44,-87,6.7,6.7],[33,-41,2.7,2.7]],
      views:[{name:'Kim Thân Phật Tổ',offset:[44,-87],height:26,viewRadius:43,viewAngle:.96,viewElevation:.10,
          photo:'https://commons.wikimedia.org/wiki/File:White_Bouddha_Nha_Trang.jpg'},
        {name:'Chánh điện dưới chân đồi',offset:[0,0],height:10,viewRadius:49,viewAngle:-.32},
        {name:'Từ chánh điện lên đồi Trại Thủy',offset:[20,-40],height:27,viewRadius:138,viewAngle:1.07}],
      description:'Từ chánh điện ở chân đồi Trại Thủy, bậc đá dẫn lên gác chuông và tượng Kim Thân Phật Tổ ngồi trên đài sen trắng.',
      start: [109.180550, 12.250710], viewDistance: 1450,
      map: 'https://www.openstreetmap.org/way/196896036',
      source: 'https://dulichso.khanhhoa.gov.vn/article/chua-long-son-b4e',
      build: chuaLongSonNhaTrang
    },
    {
      id: 'thap-po-sah-inu', name: 'Tháp Pô Sah Inư', city: 'Phan Thiết', province: 'Lâm Đồng', formerProvince: 'Bình Thuận',
      lon: 108.146122, lat: 10.936053, yaw: -2.282, width: 28, depth: 20,
      start: [108.145490, 10.936590], viewDistance: 1300,
      map: 'https://www.openstreetmap.org/node/491586802',
      source: 'https://dsvh.gov.vn/',
      build: thapPoSahInu
    },
    {
      id: 'thap-nuoc-phan-thiet', name: 'Tháp Nước Phan Thiết', city: 'Phan Thiết', province: 'Lâm Đồng', formerProvince: 'Bình Thuận',
      lon:108.1000173,lat:10.9287668,yaw:2.355,width:16,depth:16,
      start:[108.0997649,10.9285053],viewDistance:1450,mappedEntrance:true,approachMeters:40,
      arrivalNote:'Từ đường Bà Triệu đi vào Công viên Tháp Nước ở bờ bắc sông Cà Ty.',
      map:'https://www.openstreetmap.org/node/2666384178',
      source:'https://baolamdong.vn/cong-nhan-thap-nuoc-phan-thiet-la-di-tich-lich-su-van-hoa-cap-tinh-309191.html',
      build: thapNuocPhanThiet
    },
    {
      id: 'quang-truong-lam-vien', name: 'Quảng trường Lâm Viên', city: 'Đà Lạt', province: 'Lâm Đồng',
      lon:108.4441707,lat:11.9385315,yaw:0,width:22,depth:22,
      start:[108.4439198,11.9392552],viewDistance:1350,mappedEntrance:true,approachMeters:85,
      solids:[[0,0,8.5,8.5],[132.98,5.93,16.7,16.7]],
      views:[{name:'Nụ hoa Atisô',offset:[0,0],height:16,viewRadius:38,viewAngle:2.46,viewElevation:.17},
        {name:'Khối hoa Dã Quỳ',offset:[132.98,5.93],height:19,viewRadius:57,viewAngle:2.9,viewElevation:.19},
        {name:'Toàn cảnh quảng trường',offset:[68,3],height:16,viewRadius:181,viewAngle:2.96,viewElevation:.43}],
      arrivalNote:'Từ đường Trần Quốc Toản bên hồ Xuân Hương đi vào quảng trường. Nụ Atisô ở phía tây, khối hoa Dã Quỳ ở phía đông.',
      map:'https://www.openstreetmap.org/way/1304080959',
      source:'https://visitlamdong.vn/vi/quangtruonglamvien',
      build: quangTruongLamVien
    },
    {
      id: 'nha-tho-con-ga-da-lat', name: 'Nhà thờ Con Gà Đà Lạt', city: 'Đà Lạt', province: 'Lâm Đồng',
      lon: 108.437600, lat: 11.936640, yaw: -2.554, width: 22, depth: 38,
      start: [108.437464, 11.936803], viewDistance: 1450,
      map: 'https://www.openstreetmap.org/#map=18/11.93664/108.43760',
      source: 'https://dalat.lamdong.gov.vn/',
      build: nhaThoConGaDaLat
    },
    {
      id: 'cd-su-pham-da-lat', name: 'Cao đẳng Sư phạm Đà Lạt', city: 'Đà Lạt', province: 'Lâm Đồng',
      lon: 108.455750, lat: 11.934750, yaw: -2.816, width: 38, depth: 20,
      start: [108.455220, 11.936290], viewDistance: 1400,
      map: 'https://www.openstreetmap.org/#map=17/11.93475/108.45575',
      source: 'https://dalat.lamdong.gov.vn/',
      build: cdSuPhamDaLat
    }
  ];

  window.VietnamSights = (window.VietnamSights || []).concat(sights);
})();
