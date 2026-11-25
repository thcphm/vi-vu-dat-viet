const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const A = window.CentralArch;
  const sites = window.VietnamSights ??= [];
  const stone = 0xa59b88, darkStone = 0x797669, tile = 0xa25d3f, goldTile = 0xc99643;
  const brick = 0x975f48, lacquer = 0x79412f, mortar = 0xcdba9a, ridge = 0xaa9a7c;

  // Centres, axes and spans from the named OSM ways (© OpenStreetMap
  // contributors, ODbL). Heights and ornamental profiles are approximations.
  // Keep independent registration data so the release can lazy-import this pack.
  function register(id, ref, name, lon, lat, start, yaw, width, depth, details, build) {
    const catalogId = ref.startsWith('unesco') ? ref : 'osm-' + ref.replace('/', '-');
    sites.push({id, catalogId, name, province:'Huế', city:'Huế', region:'Trung Bộ', kind:'Di tích',
      lon, lat, start, yaw, width, depth, visitOnArrival:true,
      map:ref.startsWith('unesco') ? 'https://whc.unesco.org/en/list/678/maps/' : 'https://www.openstreetmap.org/' + ref,
      ...details, build});
  }
  // Offsets in tour views are east/south metres, independent of the façade axis.
  function view(name, height, radius, yaw, elevation, offset) {
    return {name, height, viewRadius:radius, viewAngle:yaw, viewElevation:elevation, offset};
  }
  function stairs(kit, x, front, width, totalHeight, count, run=.34) {
    for(let i=0;i<count;i++) {
      const h=totalHeight*(count-i)/count;
      kit.box(stone,x,h/2,front+(i+.5)*run,width,h,run+.012);
    }
  }
  // Each hall has its own hip span, sheltered doors, column spacing and raised ridge.
  function timberHall(T,kit,{x=0,z=0,w,d,bays,eave=4.5,rise=2.1,base=.7,wood=lacquer,
      roof=tile,wall=0xcbb894,upper=false,open=false,dragons=false,ground=0}) {
    const {box,stamp,round}=kit, columnLine=z+d*.40, doorLine=z+d*.27;
    const clear=eave-ground-base,span=w*.83,pitch=span/bays;
    kit.palette({stone:[stone,darkStone,ridge],timber:wood,plaster:[wall,mortar],
      [roof===goldTile?'glazedTile':'tile']:roof});
    box(darkStone,x,ground+base/2,z,w-.45,base,d-.45);
    box(stone,x,ground+base-.06,z,w-.13,.14,d-.13);
    if(!open) {
      box(wall,x,eave-clear*.50,z-d*.09,w*.92,clear,d*.69);
      box(0x3b3027,x,eave-clear*.50,doorLine,w*.87,clear,.13);
    }
    for(let i=0;i<=bays;i++){
      const bx=x-span/2+i*pitch;
      for(const cz of [columnLine,z-d*.40]){
        stamp(round,stone,bx,ground+base+.10,cz,.26,.20,.26);
        stamp(round,wood,bx,eave-clear*.5,cz,.17,clear,.17);
      }
      if(open||i===bays)continue;
      for(let leaf=0;leaf<4;leaf++){
        const lx=bx+(leaf+.5)*pitch/4;
        box(wood,lx,ground+base+.66,doorLine+.11,pitch*.231,1.3,.12);
        box(wood,lx+pitch*.108,eave-clear*.40,doorLine+.13,.07,clear*.69,.12);
        for(let rail=0;rail<3;rail++)
          box(wood,lx,ground+base+1.42+rail*.43,doorLine+.13,pitch*.225,.06,.10);
      }
    }
    box(wood,x,eave-.20,columnLine,span+.45,.42,.32);
    const cap=(cy,cw,cd,ch)=>A.curvedRoof(T,kit,x,cy,z,cw,cd,ch,roof,ridge,mortar,.31,{dragons,goldColor:mortar});
    if(upper){
      cap(eave,w,d,rise*.78);
      box(wood,x,eave+rise*.62,z,w*.79,rise*.93,d*.59);
      for(let i=0;i<bays;i++){
        const bx=x+(i-(bays-1)/2)*w*.77/bays;
        box(mortar,bx,eave+rise*.86,z+d*.30,w*.68/bays,rise*.31,.12);
      }
      cap(eave+rise*1.10,w*.85,d*.70,rise*.87);
    } else cap(eave,w,d,rise);
  }

  function pairedPalace(T,kit,w,d,frontBays,rearBays,opts={}) {
    const base=opts.base??.8, eave=opts.eave??4.7, rise=opts.rise??2.4;
    timberHall(T,kit,{...opts,z:d*.247,w,d:d*.51,bays:frontBays,eave,rise,base,upper:opts.tieredFront});
    timberHall(T,kit,{...opts,z:-d*.232,w:w*.97,d:d*.54,bays:rearBays,eave:eave+.65,rise:rise+.20,
      base,upper:true});
    stairs(kit,0,d/2-.1,w*.24,base,4);
  }

  // VNA's façade photographs show thirteen red openings on each floor. The
  // end pavilions project in front of the side bays, with a shallow middle porch.
  function kienTrung(T,kit) {
    const {box,stamp,round,outline}=kit;
    const ivory=0xdccab0,yellow=0xd5a348,red=0x8c322a,blue=0x447e87,green=0x648765;
    kit.palette({stone:[stone,darkStone],plaster:[yellow,ivory],glazedTile:[goldTile,blue,green],timber:red});
    box(stone,0,.56,1.7,40.2,1.12,25.2);
    box(yellow,0,5.02,-.3,39.4,7.8,17.0);
    box(yellow,.5,4.7,-9.3,21.1,7.2,5.8);
    const bays=[[-17.1,1,4.95,11.5],[-11.2,3,2.62,8.6],[0,5,2.74,9.9],[11.2,3,2.62,8.6],[17.1,1,4.95,11.5]];
    function mosaic(cx,cy,cz){
      for(let j=0;j<7;j++){
        const a=j*2*Math.PI/7;
        box([blue,ivory,green][j%3],cx+.24*Math.cos(a),cy+.15*Math.sin(a),cz,.23,.105,.07,0,0,a);
      }
      stamp(round,ivory,cx,cy,cz+.045,.10,.055,.10,0,Math.PI/2);
    }
    for(const [cx,n,pitch,front] of bays){
      const width=n*pitch+.37,end=n===1;
      box(yellow,cx,5.10,(front+7.8)/2,width,7.95,front-7.8);
      for(const level of [0,1]){
        const floor=1.12+level*3.95;
        for(let i=0;i<n;i++){
          const x=cx+(i-(n-1)/2)*pitch,doorW=end?1.75:pitch*.69;
          const lower=floor+.36, spring=lower+2.05;
          const arch=new T.Shape();arch.moveTo(-doorW/2,lower);arch.lineTo(doorW/2,lower);arch.lineTo(doorW/2,spring);
          arch.quadraticCurveTo(0,spring+.72,-doorW/2,spring);arch.closePath();
          kit.profile(arch,red,x,0,front+.04,.09);
          box(0x773126,x,lower+.91,front+.15,.06,1.82,.075);
          box(ivory,x,lower-.07,front+.12,doorW+.25,.17,.26);
          for(const side of [-1,1]){
            const ox=x+side*doorW*.5;
            box(ivory,ox,lower+1.06,front+.15,.115,2.10,.12);
            const curve=new T.CatmullRomCurve3([
              new T.Vector3(ox,spring,front+.15),
              new T.Vector3(x+side*doorW*.34,spring+.23,front+.15),
              new T.Vector3(x,spring+.37,front+.15)]);
            const rim=new T.TubeGeometry(curve,5,.069,5,false);
            stamp(rim,ivory,0,0,0);rim.dispose();
            for(let k=0;k<4;k++){
              const px=x+side*(.30+k*.18);
              box(k%2?blue:green,px,spring+.90-.12*Math.sin(k),front+.15,.19,.085,.085,0,0,side*(k*.45-.7));
            }
          }
          mosaic(x,spring+.92,front+.12);
        }
        for(let i=0;i<=n;i++){
          const x=cx+(i-n/2)*pitch;
          stamp(round,ivory,x,floor+1.65,front+.11,.15,2.97,.15);
          box(mortar,x,floor+.22,front+.10,.50,.42,.48);
          box(ivory,x,floor+3.22,front+.12,.51,.30,.44);
        }
        box(ivory,cx,floor+3.77,front-.26,width+.38,.32,.98);
        box(blue,cx,floor+3.91,front+.22,width+.33,.08,.16);
      }
      if(end){
        box(yellow,cx,9.33,front-2.9,3.8,.67,4.9);
        A.curvedRoof(T,kit,cx,9.65,front-2.9,4.45,5.5,1.10,goldTile,blue,ivory,.22);
        outline([[-1.63,0],[0,1.03],[1.63,0]],ivory,cx,9.78,front-.20,.23);
        outline([[-1.27,0],[0,.77],[1.27,0]],yellow,cx,9.84,front+.045,.15);
      }else{
        for(let i=0;i<=n;i++){
          const x=cx+(i-n/2)*pitch;
          outline([[-.41,0],[0,.57],[.42,.1],[.56,.03]],ivory,x,9.06,front-.29,.25);
        }
      }
    }
    A.curvedRoof(T,kit,0,9.02,-.12,32.7,17.1,3.2,goldTile,blue,ivory,.39,{dragons:true,goldColor:green});
    for(const face of [-1,1])for(let i=0;i<6;i++){
      const z=-6.5+i*2.6;
      for(const y of [3.08,7.0])box(red,face*19.72,y,z,.12,2.1,1.33);
    }
    for(const x of [-17,0,17])stairs(kit,x,14.2,x?3.2:6.8,1.12,7,.38);
    for(const side of [-1,1]){
      const cx=side*9.4;
      box(ivory,cx,1.22,13.78,11.1,.17,.43);
      box(ivory,cx,1.99,13.78,11.1,.16,.38);
      for(let i=0;i<=24;i++){
        const x=cx-5.4+i*.45;
        kit.tapered(ivory,x,1.50,13.78,.070,.115,.40,1,8);
        kit.tapered(ivory,x,1.80,13.78,.115,.062,.23,1,8);
      }
    }
  }
  function longAn(T,kit) {
    pairedPalace(T,kit,40,30.7,7,5,{wood:0x604633,roof:goldTile,rise:1.90,base:1.1,
      tieredFront:true,dragons:true});
    // Bronze courtyard collection as photographed by Huế city's visitor portal.
    // https://hue.gov.vn/Du-khach/Thong-tin-du-khach/Kham-pha-Hue/tb/Dien-Long-An-698711
    const bronze=0x697965,stonePlinth=0xa8a18d;kit.palette({metal:bronze,stone:stonePlinth});
    const bowl=new T.LatheGeometry([[.29,.34],[.69,.51],[.88,.90],[.82,1.17],[.89,1.22],
      [.82,1.28],[.72,1.16],[.61,.77],[.12,.62]].map(([x,y])=>new T.Vector2(x,y)),40);
    kit.stamp(bowl,bronze,0,0,24);bowl.dispose();
    for(let i=0;i<3;i++){
      const angle=i*2*Math.PI/3;
      kit.tapered(bronze,.44*Math.sin(angle),.26,24+.44*Math.cos(angle),.15,.10,.52,1,8);
    }
    for(const x of [-4.6,4.6]){
      kit.box(stonePlinth,x,.32,24,1.42,.65,2.28);
      const barrel=new T.LatheGeometry([[.025,-1.18],[.22,-.96],[.32,-.75],[.27,-.36],[.22,.90],
        [.25,1.19],[.185,1.19],[.177,.96]].map(([r,y])=>new T.Vector2(r,y)),20);
      kit.stamp(barrel,bronze,x,.91,24,1,1,1,0,Math.PI*.46);barrel.dispose();
    }
  }
  const courtArrival='Xe dừng ở đường ô tô bên ngoài Hoàng thành. Từ điểm dừng, mở góc ngắm để tới công trình.';
  register('dien-kien-trung','way/285990348','Điện Kiến Trung',107.5765108,16.4711085,
    [107.57572,16.47213],.6399,39.5,24.4,{
      arrivalNote:courtArrival,source:'https://nvsk.vnanet.vn/chiem-nguong-kien-truc-viet-nam-phap-italy-trong-dai-noi-hue-1-148998.vna',
      photo:'https://vtcnews.vn/can-canh-cung-dien-thoi-nha-nguyen-ton-hang-trieu-usd-phuc-dung-o-hue-ar856049.html',
      description:'Hai tầng cửa đỏ nhô ra ở giữa và ở hai đầu điện. Trên nền tường vàng, những mảng khảm sành sứ chạy theo trụ, diềm cửa và bờ mái.',
      views:[view('Mặt tiền nhìn từ sân',12,44,.73,.14),view('Dãy cửa và diềm khảm',15,23,.85,.07,[4.1,6.0])]},kienTrung);
  register('dien-long-an','way/695810710','Bảo tàng Cổ vật Cung đình Huế – điện Long An',107.5819361,16.4713172,
    [107.581719,16.471591],.6337,40.1,33.1,{
      source:'https://huetourism.gov.vn/DIEN-LONG-AN-KIET-TAC-KIEN-TRUC-MY-THUAT-THOI-NGUYEN.html/?pid=MjAzMDB8Y3NkbGRs0',
      photo:'https://hue.gov.vn/Du-khach/Thong-tin-du-khach/Kham-pha-Hue/tb/Dien-Long-An-698711',
      description:'Qua chiếc vạc đồng ở sân trước là hàng cột gỗ màu nâu. Tiền điện có bảy gian giữa, chính điện phía sau có năm gian giữa.',
      solids:[[0,0,19.5,15.6],[0,24,.86,.86],[-4.6,24,.72,1.17],[4.6,24,.72,1.17]],
      views:[view('Sân trưng bày và điện Long An',12,48,.83,.15),view('Cổ vật đồng trước điện',4.4,12,.87,.14,[13.2,18.1]),
        view('Hiên gỗ tiền điện',8,22,.54,.11,[7.7,10.5])]},longAn);
  register('chinh-dien-dien-tho','way/172763420','Cung Diên Thọ',107.5754007,16.4688914,
    [107.57487,16.46791],.629,36.9,26.9,{
      arrivalNote:courtArrival,modeledBuildings:['w531031538'],
      solids:[[0,0,17.8,12.8],[42.1,-10.7,4.9,6.6]],
      source:'https://cdt.gov.vn/data/cung-dien-tho',
      photo:'https://artsandculture.google.com/asset/truong-du-pavilion-of-dien-tho-palace/JQHB7LPqFCL4lg?hl=vi',
      description:'Phía đông chính điện của các Hoàng thái hậu có tạ Trường Du, mái ngói xanh trên hồ. Hai lớp mái vàng của chính điện nổi cao hơn mái nhà tạ.',
      views:[view('Chính điện Diên Thọ',12,44,.77,.21),view('Trường Du Tạ bên hồ',7.5,18,.93,.17,[27.7,-33.7])]},
    (T,kit)=>{
      pairedPalace(T,kit,36.9,26.9,7,5,{roof:goldTile,wood:0x854834});
      kit.place(42.2,-10.9,0,()=>timberHall(T,kit,{w:9.8,d:13.2,bays:3,eave:3.35,base:.65,
        rise:1.85,wood:0x814736,roof:0x56795c,open:true}));
    });
  register('the-to-mieu','way/172657567','Thế Tổ Miếu',107.5767400,16.4671613,
    [107.5757,16.466436],.634,56.1,29.1,{
      arrivalNote:courtArrival,source:'https://huetourism.gov.vn/The-To-Mieu.html/?pid=MjAzMDd8Y3NkbGRs0',
      description:'Qua sân đối diện Hiển Lâm Các, mười một gian tiền doanh trải dài trước chín gian chính doanh. Đây là nơi thờ các vua triều Nguyễn.',
      views:[view('Mười một gian tiền doanh',14,53,.72,.18),view('Bờ nóc và hai nếp mái',17,39,1.67,.35)]},
    (T,kit)=>pairedPalace(T,kit,56,29.1,11,9,{roof:0xa97c4f,wood:0x783f31,dragons:true}));
  register('hung-to-mieu','way/172657565','Hưng Tổ Miếu',107.5764287,16.4675459,
    [107.575401,16.46683],.628,19.0,20.0,{
      arrivalNote:courtArrival,source:'https://www.archives.org.vn/hung-mieu-%E2%80%93-noi-tho-song-than-cua-vua-gia-long.htm',
      photo:'https://redsvn.net/chum-anh-hung-to-mieu-ngoi-mieu-dac-biet-cua-trieu-nguyen-o-hue2/',
      description:'Ngôi miếu thờ song thân vua Gia Long nằm sau Thế Miếu. Năm gian tiền đường nối với ba gian chính đường trong một mặt bằng gần vuông.',
      views:[view('Tiền đường và chính đường',10,27,.95,.23),view('Hiên miếu',6.2,15,.52,.10,[3.5,5.1])]},
    (T,kit)=>pairedPalace(T,kit,19,20,5,3,{roof:goldTile,wood:0x914535,eave:3.75,rise:1.60,base:.63}));

  function bird(T,kit,x,y,z,side) {
    const pts=[[-.82,.30],[-.64,.19],[-.74,.64],[-.35,.36],[-.36,.72],[-.06,.34],[.21,.47],
      [.33,.78],[.47,.84],[.51,.73],[.69,.67],[.48,.62],[.37,.29],[.20,.16],[-.11,.12],[-.50,.08]];
    kit.outline(pts,0x66898c,x,y,z,.13,side<0?Math.PI:0);
    kit.outline([[-.67,.38],[-.20,.29],[.10,.38],[-.10,.21],[-.36,.17]],mortar,x,y,z+.075,.09,side<0?Math.PI:0);
  }
  function honChen(T,kit) {
    const ground=createTempleFoundations(T,kit);
    const base=ground.building(0,0,0,23.3,11.6,()=>{
      // Three roof ridges ascend away from the river and follow the hillside.
      for(let tier=0;tier<3;tier++){
        const z=3.85-tier*3.85,y=tier*.70;
        timberHall(T,kit,{z,w:23.55-tier*.55,d:4.15,bays:7,ground:y,eave:y+3.65,base:.39,
          rise:1.28,roof:0x93785c,wood:0x604637});
        for(const side of [-1,1])bird(T,kit,side*(7.3-tier*.18),y+4.93,z,side);
      }
    });
    ground.stairs(base,0,5.8,0,10.6,7.2,.38,10);
  }
  register('dien-hon-chen','way/1075014568','Điện Hòn Chén (điện Huệ Nam)',107.5629208,16.4219646,
    [107.563060,16.423090],.861,23.6,11.8,{
      source:'https://vietnamtourism.vn/index.php/tourism/items/482/5',
      photo:'https://vnexpress.net/di-tich-gan-voi-nhieu-giai-thoai-bac-nhat-xu-hue-3552769.html',
      arrivalNote:'Xe dừng trên đường làng Hải Cát. Mặt chính của điện nằm ở phía sông Hương.',
      description:'Minh Kính Đài tựa vào núi Ngọc Trản. Từ phía sông nhìn lên, ba cung thờ nối nhau lên cao dần. Hình chim phụng trang trí các bờ nóc.',
      views:[view('Từ phía sông Hương',10,32,1.00,.24),view('Các lớp mái Minh Kính Đài',12,20,1.55,.29)]},honChen);

  function voiRe(T,kit) {
    const grounds=createTempleFoundations(T,kit);
    grounds.building(0,-14.4,0,13.2,12.2,()=>pairedPalace(T,kit,13.2,12.2,3,3,
      {eave:3.03,rise:1.24,base:.52,wood:0x604333,roof:0x886d54}));
    for(const s of [-1,1])
      grounds.building(s*15.1,-.37,-s*Math.PI/2,8.25,7.8,()=>timberHall(T,kit,{w:8.25,d:7.8,
        bays:3,eave:2.70,rise:1.32,base:.38,wood:0x665547,roof:0x756653}));
    const front=grounds.building(0,20.1,0,9.2,1.8,()=>{
      for(const i of [-1,0,1]){
        const center=i===0,w=center?3.65:2.65,h=center?3.6:2.67,x=i*3.05;
        A.vaultedBay(T,kit,x,0,w,h,center?1.05:.69,center?1.89:1.42,1.35,0x9a9078,stone,darkStone);
        A.curvedRoof(T,kit,x,h,0,w+.30,1.94,center?.67:.49,0x7b6d57,ridge,mortar,.25);
      }
    });
    grounds.stairs(front,0,21.1,0,26.5,7.9,.11,17);
    grounds.building(0,8.5,0,4.75,1.1,()=>{
      kit.box(stone,0,.20,0,4.75,.40,1.05);
      kit.outline([[-2.2,0],[2.2,0],[2.2,1.35],[1.28,1.52],[.84,1.95],
        [-.84,1.95],[-1.28,1.52],[-2.2,1.35]],0x978b76,0,.37,-.23,.46);
      kit.box(darkStone,0,1.24,.25,2.07,1.26,.07);
    });
    function wall(x0,z0,x1,z1){
      const dx=x1-x0,dz=z1-z0,length=Math.hypot(dx,dz),count=Math.ceil(length/3),angle=Math.atan2(dx,dz);
      for(let i=0;i<count;i++){
        const t=(i+.5)/count,x=x0+dx*t,z=z0+dz*t;
        grounds.fixture(ground=>ground(x,z),()=>{
          kit.box(0x978e7c,x,.69,z,.39,1.75,length/count+.04,angle);
          kit.box(0xb6ab92,x,1.61,z,.53,.14,length/count+.06,angle);
        });
      }
    }
    for(const side of [-1,1]){
      wall(side*4.46,20.1,side*21.6,20.1);
      wall(side*21.6,20.1,side*21.6,-21.2);
      wall(side*21.6,-21.2,0,-21.2);
      wall(side*2.3,8.5,side*7.8,8.5);
      wall(side*11.2,8.5,side*21.6,8.5);
      grounds.building(side*9.5,8.5,0,3.42,1.05,()=>{
        A.vaultedBay(T,kit,0,0,3.42,2.92,.82,1.54,.83,0x898571,darkStone,stone);
        A.curvedRoof(T,kit,0,2.96,0,3.73,1.48,.63,0x756653,ridge,mortar,.31);
      });
    }
  }
  register('dien-voi-re','way/1075016121','Điện Voi Ré (miếu Long Châu)',107.5527367,16.4481203,
    [107.552950,16.447922],.791,44.2,44.8,{
      source:'https://tuongtac.hue.gov.vn/phan-anh/dien-voi-re-xuong-cap-a42144.html',
      photo:'https://thanhnien.vn/di-tich-dien-voi-re-noi-tho-voi-chien-trieu-nguyen-dang-xuong-cap-185260407123350328.htm',
      modeledBuildings:['w896415500','w1296023838','w1296023839'],
      solids:[[0,-14.4,6.5,6.0],[-15.1,-.37,3.9,4.1],[15.1,-.37,3.9,4.1],[0,8.5,2.39,.58],
        ...A.archPiers(0,20.1,3.65,1.05,1.35),...A.archPiers(-3.05,20.1,2.65,.69,1.35),...A.archPiers(3.05,20.1,2.65,.69,1.35)],
      arrivalNote:'Xe dừng gần đầu lối đi bộ vào điện Voi Ré ở Trường Đá.',
      description:'Đi qua cổng gạch và bình phong sẽ thấy miếu Long Châu ở cuối sân. Hai phối điện nhỏ quay mặt vào nhau hai bên trục thờ.',
      views:[view('Cổng và sân điện',9,47,.90,.27),view('Miếu Long Châu',7,18,.58,.15,[-10,-10])]},voiRe);

  function vanThanh(T,kit) {
    const grounds=createTempleFoundations(T,kit),tablet=0x858778,back=0x969787;
    const body=new T.SphereGeometry(1,12,7);
    kit.palette({stone:[tablet,back,stone,darkStone],tile});
    for(const s of [-1,1]){
      grounds.building(s*14.95,0,Math.PI/2,35.9,4.3,()=>{
        // The two covered ranks flank the same courtyard. Each carved face
        // points into the aisle, with a tortoise base projecting in front.
        kit.box(stone,0,.18,0,35.7,.36,4.04);
        for(let i=0;i<16;i++){
          const x=(i-7.5)*2.15, v=-s*.18;
          kit.stamp(body,tablet,x,.55,0,.47,.22,.68);
          kit.stamp(body,back,x,.57,v*3.45,.18,.16,.21);
          kit.outline([[-.36,0],[.36,0],[.36,.91],[.32,1.02],[.15,1.14],[0,1.19],
            [-.15,1.14],[-.32,1.02],[-.36,.91]],back,x,.67,-.13,.26);
          kit.box(tablet,x,1.22,v*.84,.50,.82,.052);
        }
        for(let i=0;i<=8;i++)for(const z of [-1.66,1.66])
          kit.stamp(kit.round,lacquer,(i-4)*4.18,1.72,z,.125,2.81,.125);
        A.curvedRoof(T,kit,0,3.13,0,35.9,4.3,1.06,0x947557,ridge,mortar,.44);
      });
    }
    body.dispose();
  }
  register('van-thanh-mieu-hue','way/1075014562','Văn Thánh Miếu',107.5388145,16.4532423,
    [107.539054,16.452635],.274,35.2,35.9,{
      source:'https://huetourism.gov.vn/Ghe-tham-Van-mieu-Hue--noi-ton-tho-duc-Khong-Tu.html/?pid=MTkzOTN8Y3NkbGRs0',
      modeledBuildings:['w1494518260','w1494518261'],solids:[[-14.95,0,2.12,17.9],[14.95,0,2.12,17.9]],
      description:'Hai nhà che bia đối diện qua lối đi giữa sân. Mỗi dãy có mười sáu bia tiến sĩ triều Nguyễn đặt trên lưng rùa đá.',
      views:[view('Sân giữa hai dãy bia',7,43,.32,.35),view('Bia đá và rùa đội bia',2.8,4.4,1.79,.15,[-14.7,2.9])]},vanThanh);

  function ducDuc(T,kit) {
    const grounds=createTempleFoundations(T,kit);
    grounds.building(0,0,0,24.4,24.3,()=>pairedPalace(T,kit,24.4,24.3,5,3,
      {wood:0x78432e,roof:0xae824a,eave:4.18,rise:2.02}));
    grounds.building(110.3,-60.1,0,8.9,8.65,()=>{
      timberHall(T,kit,{w:8.9,d:8.65,bays:3,eave:3.25,rise:1.76,base:.61,open:true,upper:true,
        wood:0x734332,roof:0xb58a54});
      kit.box(stone,0,.91,0,2.75,.53,1.48);
      kit.box(darkStone,0,1.24,0,3.1,.17,1.62);
    });
  }
  register('an-lang-duc-duc','relation/17957939','Lăng Dục Đức',107.5931494,16.4522238,
    [107.593209,16.452599],-2.069,24.4,24.3,{
      source:'https://huetripo.hue.gov.vn/diem-tham-quan/di-tich/lang-duc-duc-511996',
      photo:'https://hanoimoi.vn/thanh-pho-hue-mo-ban-ve-tham-quan-lang-vua-duc-duc-689216.html',
      modeledBuildings:['w674765719','w1341767946'],boundary:[[-12.2,-12.2],[12.2,-12.2],[12.2,12.2],[-12.2,12.2]],
      solids:[[0,0,12.2,12.1],[110.3,-60.1,4.45,4.33]],
      description:'Điện Long Ân là nơi thờ ba vua Dục Đức, Thành Thái và Duy Tân. Ở khu lăng mộ, nhà Huỳnh Ốc có bốn mặt thông thoáng và chiếc sập đá dùng trong lễ cúng.',
      views:[view('Điện Long Ân',10,33,-1.89,.19),view('Nhà Huỳnh Ốc ở khu mộ',6,14,-1.88,.16,[.08,125.4])]},ducDuc);

  // A swept masonry segment leaves a true open centre and open end passages.
  function wallArc(T,kit,radius,depth,height,start,end,colour) {
    const points=[], n=Math.ceil((end-start)*radius/3);
    const p=(r,a,h)=>[r*Math.sin(a),h,r*Math.cos(a)];
    function face(a,b,c,d){points.push(...a,...b,...c,...a,...c,...d);}
    for(let i=0;i<n;i++){
      const a=start+(end-start)*i/n,b=start+(end-start)*(i+1)/n,inner=radius-depth;
      face(p(radius,a,-.65),p(radius,b,-.65),p(radius,b,height),p(radius,a,height));
      face(p(inner,b,-.65),p(inner,a,-.65),p(inner,a,height),p(inner,b,height));
      face(p(radius,a,height),p(radius,b,height),p(inner,b,height),p(inner,a,height));
    }
    for(const [a,sign] of [[start,-1],[end,1]]){
      const r=sign<0?radius-depth:radius,s=sign<0?radius:radius-depth;
      face(p(r,a,-.65),p(s,a,-.65),p(s,a,height),p(r,a,height));
    }
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.Float32BufferAttribute(points,3));geometry.computeVertexNormals();
    kit.stamp(geometry,colour,0,0,0);geometry.dispose();
  }
  function tombEntrance(T,kit) {
    const grounds=createTempleFoundations(T,kit);
    const gate=grounds.building(0,0,0,5.4,2.1,()=>{
      for(const x of [-1.89,1.89]){
        kit.box(darkStone,x,1.6,0,.80,3.20,1.15);
        kit.box(stone,x,3.12,0,.99,.29,1.31);
        kit.tapered(stone,x,3.6,0,.56,.34,.70,1,4);
      }
      kit.box(stone,0,3.07,0,4.88,.46,.98);
      kit.box(0x564838,0,1.49,0,2.96,2.97,.19);
      for(const x of [-.78,.78])kit.box(0x89724b,x,1.51,.13,1.30,2.67,.08);
      A.curvedRoof(T,kit,0,3.32,0,4.6,1.78,.56,0x828276,stone,darkStone,.33);
    });
    grounds.stairs(gate,0,1.15,0,18.0,4.68,.18,19);
  }
  register('xuong-lang-thieu-tri','way/264285103','Lăng Thiệu Trị',107.5735611,16.4171959,
    [107.57069,16.41588],-2.17,5.4,2.1,{
      source:'https://luutru.moha.gov.vn/cong-bo-gioi-thieu-tai-lieu/lang-vua-thieu-tri-duoc-xay-cat-nhu-the-nao.htm',
      description:'Bậc đá dẫn lên cửa Bửu Thành, nơi kết thúc trục thăm khu mộ của Xương Lăng. Hai bên cửa, tường thành ôm theo vòng đồi.',
      // End of OSM stairway w1075011941 at the wall w1075011936.
      views:[view('Bậc đá lên Bửu Thành',5.7,23,-2.17,.17),view('Cửa đá thanh',5.5,10.8,-2.03,.11)]},tombEntrance);

  const fortRadius=48.1, fortWidth=12.6;
  function fortWall(T,kit) {
    kit.palette({brick,stone:[stone,darkStone]});
    const gap=.063;
    for(const a of [0,Math.PI]){
      wallArc(T,kit,fortRadius,fortWidth,3.35,a+gap,a+Math.PI-gap,brick);
      wallArc(T,kit,fortRadius,1.10,4.40,a+gap,a+Math.PI-gap,brick);
      kit.place(Math.sin(a)*(fortRadius-fortWidth/2),Math.cos(a)*(fortRadius-fortWidth/2),a,()=>{
        A.vaultedBay(T,kit,0,0,6.13,3.36,1.08,1.53,fortWidth,brick,darkStone,stone);
        kit.box(brick,0,3.83,fortWidth/2-.52,6.10,1.05,1.10);
        kit.box(darkStone,0,4.37,fortWidth/2-.51,6.25,.13,1.21);
      });
    }
  }
  function fortSolid(x,z,pad=0){
    const r=Math.hypot(x,z);
    return r>=fortRadius-fortWidth-pad&&r<=fortRadius+pad&&Math.abs(x)>1.08-pad;
  }
  // Collision boxes approximate only the brick ring. The courtyard and
  // historic passages are open, and surrounding mapped buildings keep their meshes.
  const ramparts=[],innerRadius=fortRadius-fortWidth;
  // Narrower strips at the tangencies keep the circular edge smooth. The
  // first strip begins at the jamb, leaving both gates traversable.
  for(const [from,to,count] of [[1.08,innerRadius,25],[innerRadius,fortRadius,15]]){
    let left=from;
    for(let i=1;i<=count;i++){
      const right=from+(to-from)*Math.sin(i*Math.PI/(2*count));
      const x=(left+right)/2,halfWidth=(right-left)/2;
      const far=Math.sqrt(fortRadius**2-x**2);
      const near=Math.sqrt(Math.max(0,innerRadius**2-x**2));
      for(const side of [-1,1]){
        if(!near)ramparts.push([side*x,0,halfWidth,far]);
        else for(const end of [-1,1])ramparts.push([side*x,end*(far+near)/2,halfWidth,(far-near)/2]);
      }
      left=right;
    }
  }
  register('tran-hai-thanh','unesco-678-014','Trấn Hải Thành',107.6549333,16.5546833,
    [107.654199,16.555779],0,96.2,96.2,{
      surveyed:true,solids:ramparts,reserve:fortSolid,gardenRadius:14,
      source:'https://thanhnien.vn/theo-dau-nguoi-xua-ky-40-trang-su-bi-thuong-cua-bien-thuan-an-185371236.htm',
      photo:'https://tienphong.vn/bi-an-ngoi-thanh-co-nam-ven-bien-va-dam-pha-o-hue-post1866772.tpo',
      description:'Hình dung vòng thành gạch thời Nguyễn ở cửa biển Thuận An. Cửa phía nam xuyên qua thân thành dày. Đường kính được ước từ chu vi ghi trong địa chí.',
      arrivalNote:'Điểm ngắm tái hiện tường thành lịch sử. Xe dừng ở giao lộ Lê Sỹ và Trấn Hải Thành.',
      views:[view('Vòng thành thời Nguyễn',7,114,.27,.67),view('Vòm cửa phía nam',5,15,.13,.12,[0,46.2])]},fortWall);
})();

export default window.VietnamSights;
