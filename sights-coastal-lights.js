'use strict';
(()=>{
  const atlas=new Map(VietnamTourism.entries.map(place=>[place.id,place]));
  const stops=window.VietnamSights??=[];
  const nationalRegister='https://www.vimawa.gov.vn/vi/noi-dung/hien-trang-he-thong-den-bien';
  const notices={
    'hai-dang-hon-dau':{lon:106.816389,lat:20.666417,focalHeight:63.5,source:'https://www.thuvienhaiphong.org.vn/tin-tuc/hai-dang-hon-dau-anh-sang-tram-nam-giua-bien-troi-do-son'},
    'hai-dang-dai-lanh':{focalHeight:110,source:nationalRegister},
    'hai-dang-phuoc-mai':{lon:109.250889,lat:13.761389,source:'https://cangvuhanghaiquynhon.gov.vn/index.aspx?id=5781&page=detail'},
    'hai-dang-sa-huynh':{lon:109.081528,lat:14.667778,source:'https://vmsa.vn/baodam/upload/files/TBHH/TBHH2025/685%281%29.pdf'},
    'hai-dang-ha-mai':{lon:107.454444,lat:20.718250,source:'https://vmsa.vn/thong-bao-hang-hai-247/quang-ninh-252/ve-viec-thay-doi-dac-tinh-hoat-dong-den-bien-ha-mai-11470-2.html'},
    'hai-dang-dao-tran':{lon:107.963222,lat:21.237694,source:'https://vmsa.vn/baodam/upload/files/TBHH/TBHH2025/1071.pdf'},
    'hai-dang-tan-hiep':{source:'https://www.vmsa.vn/thong-bao-hang-hai-247/quang-nam-263/ve-thong-so-hoat-dong-cua-den-bien-tan-hiep-va-thiet-lap-moi-bao-hieu-hang-hai-ais-tai-den-bien-tan-hiep-11826-2.html'},
    'hai-dang-cu-lao-cham':{source:'https://www.vmsa.vn/thong-bao-hang-hai-247/quang-nam-263/ve-thong-so-hoat-dong-cua-den-bien-cu-lao-cham-va-thiet-lap-moi-bao-hieu-hang-hai-ais-tai-den-bien-cu-lao-cham-11827-2.html'},
    'hai-dang-ha-long':{source:'https://vov2.vov.vn/van-hoa-giai-tri/ngon-hai-dang-diem-tham-quan-thu-vi-ben-bo-vinh-ha-long-48766.vov2'},
    'hai-dang-hon-bai':{photo:'https://thanhnien.vn/hon-bai-hai-dang-dac-biet-nhat-viet-nam-1851505832.htm'},
    'hai-dang-hon-hai':{source:'https://tuoitre.vn/mat-bien-o-hon-hai-20190309104804774.htm'},
    'hai-dang-truong-sa-dong':{source:'https://vimawa.gov.vn/vi/noi-dung/du-dtxd-cong-trinh-cac-den-bien',photo:'https://www.nguyenhungvabanbe.com/den-bien-truong-sa-dong'}
  };
  const color={white:0xecebe1,grey:0x899294,slate:0x656e70,charcoal:0x4b504f,
    granite:0x928a78,stone:0x9f927b,gold:0xe6b960,yellow:0xf0cc77,buff:0xe9d6aa,
    red:0xbb443b,black:0x30373a,green:0x315b4f,paleBlue:0xbdcfd5,blue:0x7299a8,
    greenTrim:0x8ab7a0,silver:0x98a5a6,glass:0x6c9299,metal:0x526368,roof:0xab6549};
  const sequences={redWhite:['red','white','red','white','red'],blackWhite:['white','black','white','black','white'],
    greenWhite:['white','green','white','green','white'],redBlack:['red','black','red','black','red'],
    whiteBlackWhite:['white','black','white'],whiteYellowWhite:['white','yellow','white'],
    redWhiteRed:['red','white','red'],redCapWhite:['red','red','red','white'],redBuff:['buff','red','buff','red','buff'],
    buffGrey:['buff','grey'],whiteVertical:['white'],greyVertical:['grey'],spiral:['white']};
  const paints={white:'trắng',grey:'xám',charcoal:'xám sẫm',granite:'đá granit',stone:'đá xây',
    yellow:'vàng',gold:'vàng đất',buff:'vàng kem',red:'đỏ',paleBlue:'xanh nhạt',
    redWhite:'các khoang đỏ và trắng',blackWhite:'các khoang đen và trắng',greenWhite:'các khoang xanh sẫm và trắng',
    redBlack:'các khoang đỏ và đen',whiteBlackWhite:'trắng với một khoang đen',whiteYellowWhite:'trắng với một khoang vàng',
    redWhiteRed:'trắng ở giữa, đỏ ở hai đầu',redCapWhite:'đỏ với khoang trắng phía trên',redBuff:'các khoang đỏ và vàng nhạt',
    buffGrey:'vàng nhạt ở dưới, xám ở trên',whiteVertical:'trắng với một sọc đỏ dọc',greyVertical:'xám với một sọc đỏ dọc',
    spiral:'các dải đen và trắng xoắn ốc'};
  const shapes={round:'tròn',square:'vuông',pent:'ngũ giác',hex:'lục giác',oct:'bát giác'};
  const sidesOf={round:32,square:4,pent:5,hex:6,oct:8};
  // OSM coastline ways 252008827 and 1122839004, east/south metres from the tower.
  // The first is a limestone pinnacle. Hòn Hải is a volcanic island with a low
  // southern tail and a precipitous northern rock supporting the lighthouse.
  const cliffs={
    'hai-dang-hon-bai':{high:43,radius:75,ring:[[40,23],[32,7],[23,7],[11,-7],[-23,-23],[-42,-25],[-50,-17],[-49,-7],[-39,4],[-31,8],[-24,13],[-25,15],[-8,29],[4,27],[19,34],[31,33]]},
    'hai-dang-hon-hai':{high:111,radius:190,ring:[[33,276],[37,257],[35,222],[41,190],[67,118],[76,62],[94,-14],[92,-52],[50,-104],[-1,-150],[-31,-149],[-50,-132],[-57,-75],[-50,-48],[-51,-18],[-47,47],[-33,111],[-16,174],[-15,195],[-16,211],[-23,221],[-21,228],[-9,277],[21,328],[35,349],[45,351],[59,366],[76,390],[78,372],[56,349],[49,330]]}
  };
  function add(catalogId,id,spec,yaw,page,title){
    const entry=atlas.get(catalogId);
    if(!entry)return;
    const features=new Set((spec.details||'').split(' ')),has=f=>features.has(f);
    const {height,diameter,house}=spec;
    const width=house?.[0]||diameter,depth=house?.[1]||diameter;
    const lattice=has('lattice'),coastalPier=has('tidal6')||has('tidal8')||has('tidalOct3');
    const notice=notices[id]||{},photo=notice.photo||'https://www.ibiblio.org/lighthouse/'+page+'.htm#:~:text='+encodeURIComponent(title);
    const shaft=lattice?'Khung thép giằng chéo':has('waist')?'Thân tháp thắt eo':'Thân tháp '+shapes[spec.shape];
    const formattedHeight=String(height).replace('.',',');
    const details=has('stoneTiers')?'Các tầng đế bát giác và thân tháp ốp đá nhìn ra bãi biển Bãi Cháy.':
      shaft+', '+paints[spec.paint]+'. '+(coastalPier?'Nhà trạm kê trên cọc. ':house?'Nhà trạm nằm dưới chân tháp. ':'')+
      (spec.estimatedHeight?'':'Chiều cao công trình khoảng '+formattedHeight+' m.');
    const description=notice.focalHeight?details+' Tâm đèn ở cao độ '+String(notice.focalHeight).replace('.',',')+' m so với mốc 0 hải đồ.':details;
    const cliff=cliffs[id],radius=cliff?.radius??Math.max(8,height*1.37,Math.max(width,depth)*1.18);
    const views=[{name:cliff?'Toàn cảnh đảo và tháp':'Toàn cảnh tháp',viewRadius:radius},
      {name:spec.optic==='monument'?'Đài quan sát':'Đỉnh tháp',height:height*1.92,viewRadius:Math.max(7,diameter*2.25),viewElevation:.22}];
    if(spec.coastView)views.push(spec.coastView);
    const solid=coastalPier?[]:[[0,0,width*.48,depth*.48]];
    // Coastal piles and tower platforms neither reserve infill around a harbour nor manufacture dry land.
    const boundary=[[-width/2,-depth/2],[width/2,-depth/2],[width/2,depth/2],[-width/2,depth/2]];
    const station=has('daiLanhStation');
    if(station){
      Object.assign(views[0],{name:'Từ sân trạm nhìn lên hải đăng',offset:[-1,5],height:20,viewAngle:-.05,viewRadius:41,viewElevation:.04,viewFov:57,viewBase:'monument'});
      solid.push([-3,27,5.5,20],[-11.5,11.5,4.5,4.5]);
    }
    stops.push({...entry,id,catalogId,...notice,photo,source:notice.source||nationalRegister,locality:page==='sprs'?'Trường Sa':entry.locality,
      city:entry.province,kind:'Hải đăng',modelType:'lighthouse',description,structureHeight:height,
      yaw,width,depth,boundary,solids:solid,viewAngle:yaw+.57,viewElevation:.12,viewRadius:radius,
      ...(station?{modeledBuildings:['r12341630'],
        reserve:(x,z,r)=>(Math.abs(x)<5+r&&Math.abs(z)<7+r)||(x>-16.5-r&&x<12+r&&z>6-r&&z<48+r)}:{}),
      views,build:(T,kit)=>{
        coastalLight(T,kit,spec,has);
        if(station)daiLanhStation(T,kit);
        if(cliff)coastalRock(T,kit.group,cliff,yaw,height,views);
      }});
  }
  // Heights are measured from the structure base. Plan sizes and orientation come from
  // the individual mapped footprint. Tower paint and optical housing use the linked
  // station record and photographs. A dated notice supersedes the older directory.
  add('osm-way-1272874767', 'hai-dang-nui-nai', {height:16,diameter:3.4,shape:'square',paint:'grey',optic:'lantern',details:'house2 porch',house:[10.9,7.3]}, 0.824, 'vnms', 'Núi Nai (Mui Nai, Hà Tiên) (3)'); // Núi Nai
  add('osm-way-684599282', 'hai-dang-rach-gia', {height:18.5,diameter:4.3,shape:'square',paint:'white',optic:'lantern',details:'trimMint'}, -0.551, 'vnms', 'Rạch Giá (Hoa Biển) (2)'); // Rạch Giá
  add('osm-way-1273113082', 'hai-dang-an-thoi', {height:14,diameter:3.1,shape:'round',paint:'white',optic:'lantern',details:'twin blackDome'}, -0.456, 'vnms', 'An Thới (3)'); // An Thới
  add('osm-way-1272966047', 'hai-dang-hon-chong', {height:15.5,diameter:3.1,shape:'round',paint:'white',optic:'beacon'}, -0.881, 'vnms', 'Hòn Chông (Mũi Ông Thầy) (2)'); // Hòn Chông
  add('osm-way-1273113081', 'hai-dang-nam-du', {height:11.5,diameter:3.2,shape:'square',paint:'grey',optic:'beacon',details:'house2',house:[10.1,6.8]}, 0.738, 'vnms', 'Nam Du (Nan Du)'); // Nam Du
  add('osm-way-1273113078', 'hai-dang-tho-chu', {height:18,diameter:3.5,shape:'round',paint:'grey',optic:'lantern',details:'corner3 yellowFrame',house:[11.5,8.2]}, 0.574, 'vnms', 'Thổ Chu (Thổ Châu, Poulo Panjang) (2)'); // Thổ Chu
  add('osm-way-1273113080', 'hai-dang-hon-dam', {height:20,diameter:3.3,shape:'hex',paint:'white',optic:'daymark',details:'cabin'}, 0.466, 'vnms', 'Hòn Dăm'); // Hòn Dăm
  add('osm-way-1273113079', 'hai-dang-hon-kho', {height:14,diameter:3,shape:'round',paint:'redBlack',optic:'beacon',details:'waist plinth redLight'}, -3.13, 'vnms', 'Hòn Khô'); // Hòn Khô
  add('osm-way-1241081663', 'hai-dang-hon-khoai', {height:16,diameter:3.8,shape:'square',paint:'granite',optic:'lantern',details:'brownStone'}, -3.131, 'vnms', 'Hòn Khoai (Poulo Obi)'); // Hòn Khoai
  add('osm-way-1272966048', 'hai-dang-ong-doc', {height:19,diameter:3.2,shape:'pent',paint:'white',optic:'lantern',details:'blackHouse1 redFrame',house:[6.6,5.7]}, -2.339, 'vnms', 'Ông Đốc (2)'); // Ông Đốc
  add('osm-way-1273113084', 'hai-dang-bo-de', {height:25,diameter:3.2,shape:'round',paint:'redWhite',optic:'beacon',details:'waist tidal6',house:[10,8.6]}, -0.245, 'vnms', 'Bồ Đề (2)'); // Bồ Đề
  add('osm-way-1273113077', 'hai-dang-hon-chuoi', {height:11,diameter:2.9,shape:'square',paint:'grey',optic:'small',details:'house2',house:[9.9,6.1]}, -0.084, 'vnms', 'Hòn Chuối (2)'); // Hòn Chuối
  add('osm-way-1272966045', 'hai-dang-cu-lao-xanh', {height:17,diameter:3.7,shape:'round',paint:'whiteBlackWhite',optic:'lantern',details:'twin'}, 2.423, 'vnmsc', 'Cù Lao Xanh (Phuoc Chau, Poulo Gambir)'); // Cù Lao Xanh
  add('osm-way-1272966046', 'hai-dang-phuoc-mai', {height:15.9,diameter:3.5,shape:'square',paint:'grey',optic:'lantern'}, 0.187, 'vnmsc', 'Phước Mai (Qui Nhơn ) (2?)'); // Phước Mai
  add('osm-way-1272874766', 'hai-dang-hon-nuoc', {height:22,diameter:3.9,shape:'round',paint:'white',optic:'lantern'}, -0.571, 'vnmsc', 'Hòn Nước'); // Hòn Nước
  add('osm-way-1273256837', 'hai-dang-thuan-an', {height:35,diameter:7,shape:'hex',paint:'redWhiteRed',optic:'lantern',details:'tapered'}, -2.612, 'vnmnc', 'Thuận An (Thai Duong Thuong) (2)'); // Thuận An
  add('osm-way-1273259558', 'hai-dang-chan-may', {height:14,diameter:3.9,shape:'round',paint:'white',optic:'lantern',details:'redFrame'}, 3.675, 'vnmnc', 'Chân Mây (Mui Chon May Dong) (2)'); // Chân Mây
  add('osm-way-1273268454', 'hai-dang-cua-nhuong', {height:15,diameter:3.5,shape:'round',paint:'redWhite',optic:'beacon'}, -2.267, 'vnmnc', 'Cửa Nhượng'); // Cửa Nhượng
  add('osm-way-1273268453', 'hai-dang-cua-sot', {height:13,diameter:3.4,shape:'square',paint:'gold',optic:'beacon',details:'triple'}, -3.049, 'vnmnc', 'Cửa Sót (Mui Lo) (2)'); // Cửa Sót
  add('osm-way-1273268455', 'hai-dang-mui-ron', {height:16,diameter:3.3,shape:'round',paint:'grey',optic:'beacon',details:'cabin'}, 0.252, 'vnmnc', 'Mũi Ròn'); // Mũi Ròn
  add('osm-node-12813372159', 'hai-dang-diem-dien', {height:23,diameter:4.5,shape:'round',paint:'grey',optic:'lantern',details:'ribs8'}, 0, 'vnmn', 'Diêm Điền'); // Diêm Điền
  add('osm-way-1273268446', 'hai-dang-ba-lat', {height:34,diameter:4.7,shape:'oct',paint:'grey',optic:'lantern'}, 2.996, 'vnmn', 'Ba Lạt'); // Ba Lạt
  // Two-storey station centered on the tower. OSM way 594845825 gives its rectangle and axis.
  // Station specification as published by the operator: https://vmsa.vn/bao-hieu-hang-hai-249/he-thong-den-bien-286/den-bien-hon-dau-4306-2.html
  add('osm-way-967471570', 'hai-dang-hon-dau', {height:22.7,diameter:5,shape:'oct',paint:'grey',optic:'lantern',details:'twin house2 whiteLight',house:[36.4,12.1]}, 3.2043, 'vnmn', 'Hòn Dấu (2)'); // Hòn Dấu
  add('osm-way-967471568', 'hai-dang-long-chau', {height:30,diameter:5.7,shape:'round',paint:'granite',optic:'lantern',details:'blackDome greyHouse2',house:[7.6,7.5]}, 0.392, 'vnmn', 'Long Châu (Xuy Nong Chao, Grande Norway Island)'); // Long Châu
  add('osm-way-229301316', 'hai-dang-vung-tau', {height:18,diameter:5.2,shape:'round',paint:'white',optic:'lantern',details:'ribs4 buttresses blackDome'}, 0.683, 'vnmsc', 'Vũng Tàu (Cap St.-Jacques) (3)'); // Vũng Tàu
  add('osm-node-2854454715', 'hai-dang-cao-trang', {height:8,diameter:2.7,shape:'hex',paint:'white',optic:'lantern',details:'trimBlue greenLight'}, 0, 'vnmsc', 'Cao Trang (2)'); // Cao Trang
  add('osm-way-1272966034', 'hai-dang-da-trang', {height:10,diameter:1.8,shape:'round',paint:'redWhite',optic:'beacon',details:'waist plinth redLight'}, -1.208, 'vnms', 'Đá Trắng (Côn Đảo) (2)'); // Đá Trắng
  add('osm-node-1293081456', 'hai-dang-ganh-rai', {height:14,diameter:3,shape:'hex',paint:'greenWhite',optic:'beacon',details:'greenLight'}, 0, 'vnmsc', 'Ghành Rái (Ganh Rai)'); // Gành Rái
  add('osm-way-1272966035', 'hai-dang-ba-kiem', {height:12.5,diameter:3.4,shape:'square',paint:'white',optic:'lantern',details:'whiteHouse2 trimBlue greenLight',house:[10.1,7.3]}, 3.335, 'vnmsc', 'Ba Kiềm'); // Ba Kiềm
  add('osm-way-613351068', 'hai-dang-can-gio-aval', {height:22.5,diameter:2.8,shape:'round',paint:'white',optic:'lantern',details:'tidal8 redHip iron',house:[9,7.8]}, -0.55, 'vnmse', 'Cần Giờ (Aval)'); // Cần Giờ Aval
  add('osm-way-753518095', 'hai-dang-bay-canh', {height:16,diameter:4.1,shape:'square',paint:'white',optic:'lantern',details:'whiteHouse1 redHip',house:[30.8,14.5]}, -2.288, 'vnms', 'Hòn Bảy Cạnh (Con Son, Poulo Condore)'); // Bảy Cạnh
  add('osm-way-1272966041', 'hai-dang-ba-ngoi', {height:9,diameter:2.35,shape:'square',paint:'buff',optic:'beacon',details:'buffHouse1 roundBase',house:[8.8,4.7]}, -1.092, 'vnmsc', 'Ba Ngòi (Vịnh Cam Ranh, Cam Ranh Bay) (2)'); // Ba Ngòi
  add('osm-way-1241245408', 'hai-dang-mui-chut', {height:15,diameter:4.1,shape:'hex',paint:'buff',optic:'mast',details:'creamHouse2',house:[19.8,13.7]}, -1.403, 'vnmsc', 'Mũi Chụt (Bao Đai, Nha Trang)'); // Mũi Chụt
  add('osm-way-243480746', 'hai-dang-hon-chut', {height:16,diameter:3.8,shape:'oct',paint:'grey',optic:'lantern',details:'whiteHouse2',house:[14.7,9.5]}, -1.272, 'vnmsc', 'Hòn Chút (Bình Hưng) (2)'); // Hòn Chút
  add('osm-way-1272966040', 'hai-dang-mui-dinh', {height:16,diameter:4.3,shape:'square',paint:'granite',optic:'lantern'}, -2.36, 'vnmsc', 'Mũi Dinh (Cà Ná, Cap Padaran) (2)'); // Mũi Dinh
  add('osm-way-1272866881', 'hai-dang-hon-lon', {height:16,diameter:4,shape:'round',paint:'blackWhite',optic:'lantern'}, -2.825, 'vnmsc', 'Hòn Lớn (Mũi Rach Trang, Hòn Tre)'); // Hòn Lớn
  add('osm-way-1272966042', 'hai-dang-hon-do', {height:11.5,diameter:3.4,shape:'round',paint:'white',optic:'beacon',details:'trimBlue'}, 2.944, 'vnmsc', 'Hòn Đỏ (Hòn Hèo, Hòn Theo)'); // Hòn Đỏ
  add('osm-way-435366231', 'hai-dang-da-tay', {height:20,diameter:3.7,shape:'round',paint:'grey',optic:'lantern',details:'island3',house:[12,11.5]}, 3.319, 'sprs', 'Đá Tây (West London Reef) B'); // Đá Tây
  add('osm-way-1416763534', 'hai-dang-truong-sa-dong', {height:27,diameter:6.7,shape:'round',paint:'redWhiteRed',optic:'lantern',details:'seaBlue2 tapered',house:[14.3,13.2],estimatedHeight:true}, -2.009, 'sprs', 'Trường Sa Đông'); // Trường Sa Đông
  add('osm-way-614161316', 'hai-dang-da-lat', {height:42,diameter:5.8,shape:'square',paint:'redWhite',optic:'lantern',details:'lattice tidalOct3',house:[8.7,8.7]}, 0.692, 'sprs', 'Đá Lát (Ladd Reef)'); // Đá Lát
  add('osm-way-1119999401', 'hai-dang-an-bang', {height:22,diameter:3.7,shape:'oct',paint:'grey',optic:'lantern',details:'house2 yellowRail',house:[10.5,5.6]}, -3.13, 'sprs', 'An Bang (Amboyna Cay)'); // An Bang
  add('osm-way-1272966039', 'hai-dang-phan-thiet', {height:10,diameter:2.9,shape:'round',paint:'redWhite',optic:'beacon'}, 2.743, 'vnmsc', 'Phan Thiết (Cà Ty) (2)'); // Phan Thiết
  add('osm-way-1272966037', 'hai-dang-phan-ri', {height:16,diameter:2.8,shape:'square',paint:'white',optic:'roofLamp',details:'whiteHouse4',house:[7,6.9]}, 3.12, 'vnmsc', 'Phan Rí'); // Phan Rí
  add('osm-way-1272966038', 'hai-dang-phu-quy', {height:20,diameter:4,shape:'square',paint:'charcoal',optic:'lantern',details:'house2 yellowFrame',house:[18.3,11]}, -2.244, 'vnmsc', 'Phú Quý'); // Phú Quý
  add('osm-way-1160479178', 'hai-dang-hon-hai', {height:10.4,diameter:4.5,shape:'hex',paint:'grey',optic:'lantern',details:'twin'}, -0.101, 'vnmsc', 'Hòn Hải (Poulo Sapate)'); // Hòn Hải
  add('osm-way-1273268452', 'hai-dang-cua-hoi', {height:25,diameter:4.5,shape:'round',paint:'whiteVertical',optic:'lantern',details:'whiteHouse1',house:[10,7]}, 1.555, 'vnmnc', 'Cửa Hội (Vinh River) (2)'); // Cửa Hội
  add('osm-way-1273268451', 'hai-dang-hon-mat', {height:12.5,diameter:3.15,shape:'round',paint:'yellow',optic:'lantern'}, 1.531, 'vnmnc', 'Hòn Mát (Mui Sot)'); // Hòn Mắt
  add('osm-way-1273268448', 'hai-dang-lach-giang', {height:17,diameter:4.1,shape:'round',paint:'greyVertical',optic:'lantern',details:'tapered'}, 3.374, 'vnmn', 'Lạch Giang (2)'); // Lạch Giang
  add('osm-way-1273268447', 'hai-dang-quat-lam', {height:22,diameter:4.7,shape:'hex',paint:'redBuff',optic:'lantern'}, 1.869, 'vnmn', 'Quất Lâm (2)'); // Quất Lâm
  add('osm-way-1273256843', 'hai-dang-ly-son', {height:45,diameter:5.8,shape:'round',paint:'white',optic:'lantern',details:'twin ribs4'}, 0.35, 'vnmnc', 'Lý Sơn (Cù Lao Ré) (3?)'); // Lý Sơn
  add('osm-node-8039014170', 'hai-dang-den-bao-cang-ly-son', {height:13,diameter:2.9,shape:'round',paint:'blackWhite',optic:'beacon'}, 0, 'vnmnc', 'Lý Sơn Harbor (An Vĩnh) (2)'); // Đèn báo cảng Lý Sơn
  add('osm-node-6528563250', 'hai-dang-den-bao-bai-can-ly-son', {height:10,diameter:2.5,shape:'round',paint:'redWhite',optic:'beacon'}, 0, 'vnmnc', 'Lý Sơn East Beakwater (Mù Cu)'); // Đèn báo bãi cạn Lý Sơn
  add('osm-way-1273256845', 'hai-dang-ba-lang-an', {height:22,diameter:3.9,shape:'round',paint:'redWhite',optic:'lantern'}, -0.479, 'vnmnc', 'Ba Làng An (Cap Batangan) (4)'); // Ba Làng An
  add('osm-way-1273256844', 'hai-dang-sa-ky', {height:14,diameter:3.6,shape:'round',paint:'redWhite',optic:'beacon'}, 0.701, 'vnmnc', 'Sa Kỳ'); // Sa Kỳ
  add('osm-way-1273256846', 'hai-dang-sa-huynh', {height:20.9,diameter:4.7,shape:'square',paint:'redCapWhite',optic:'lantern',details:'setback'}, -2.667, 'vnmnc', 'Sa Huỳnh (Cap Sa Hoi) (2)'); // Sa Huỳnh
  add('osm-way-1273256842', 'hai-dang-van-ca', {height:20,diameter:4.1,shape:'round',paint:'white',optic:'lantern'}, 0.775, 'vnmnc', 'Vạn Ca (Dung Quất) (2)'); // Vạn Ca
  add('osm-way-673097051', 'hai-dang-ha-long', {height:55.5,diameter:8.2,shape:'oct',paint:'stone',optic:'monument',details:'stoneTiers',house:[19.3,19.1]}, -0.545, 'vnmn', 'Bãi Cháy (Hạ Long, Hong Gai) (1)'); // Hạ Long
  add('osm-way-1273284473', 'hai-dang-vinh-thuc', {height:18,diameter:4.2,shape:'round',paint:'yellow',optic:'lantern',details:'ribs6 rotunda',house:[8.6,8.6]}, -0.142, 'vnmn', 'Vĩnh Thực'); // Vĩnh Thực
  add('osm-way-1273284475', 'hai-dang-co-to', {height:26,diameter:4.1,shape:'round',paint:'white',optic:'lantern',details:'tapered'}, 3.186, 'vnmn', 'Cô Tô (2)'); // Cô Tô
  add('osm-way-967471565', 'hai-dang-ha-mai', {height:19,diameter:5,shape:'round',paint:'charcoal',optic:'lantern',details:'tapered'}, 2.909, 'vnmn', 'Hạ Mai (2)'); // Hạ Mai
  add('osm-way-1273284476', 'hai-dang-hon-bai', {height:3,diameter:2.1,shape:'square',paint:'white',optic:'beacon',details:'plain'}, -0.75, 'vnmn', 'Hòn Bài'); // Hòn Bài
  add('osm-way-1273284474', 'hai-dang-dao-tran', {height:20.5,diameter:4,shape:'round',paint:'yellow',optic:'lantern',details:'house2',house:[12.4,7.3]}, 0.151, 'vnmn', 'Đảo Trần (Lo Chuc Dan)'); // Đảo Trần
  add('osm-way-1273259557', 'hai-dang-cua-tung', {height:27,diameter:4.3,shape:'round',paint:'spiral',optic:'lantern'}, 0.54, 'vnmnc', 'Cửa Tùng'); // Cửa Tùng
  add('osm-way-1273259556', 'hai-dang-mui-lay', {height:12.5,diameter:3.8,shape:'square',paint:'charcoal',optic:'lantern'}, 2.636, 'vnmnc', 'Mũi Lay (Cap Lai)'); // Mũi Lay
  add('osm-way-1273259555', 'hai-dang-nhat-le', {height:20,diameter:4.8,shape:'hex',paint:'buffGrey',optic:'lantern',details:'twin'}, -2.56, 'vnmnc', 'Nhật Lệ (Dong Hoi)'); // Nhật Lệ
  add('osm-way-1273259554', 'hai-dang-cua-gianh', {height:20,diameter:4.4,shape:'round',paint:'paleBlue',optic:'lantern',details:'blueFrame'}, 0.255, 'vnmnc', 'Cửa Gianh'); // Cửa Gianh
  add('osm-way-946535120', 'hai-dang-con-co', {height:24,diameter:4.3,shape:'round',paint:'yellow',optic:'lantern',details:'house2',house:[13,10]}, 1.61, 'vnmnc', 'Cồn Cỏ (Hon Gio)'); // Cồn Cỏ
  add('osm-way-1273256836', 'hai-dang-cua-viet', {height:22,diameter:3.5,shape:'square',paint:'grey',optic:'lantern',details:'house3 squareCap',house:[12.5,6.8]}, 2.374, 'vnmnc', 'Cửa Việt'); // Cửa Việt
  add('osm-way-1273268449', 'hai-dang-lach-trao', {height:22,diameter:3.7,shape:'oct',paint:'grey',optic:'lantern',details:'yellowFrame'}, 0.489, 'vnmnc', 'Lạch Trào (Lạch Chào)'); // Lạch Trào
  add('osm-way-967471567', 'hai-dang-hon-me', {height:18.5,diameter:4.1,shape:'round',paint:'white',optic:'lantern'}, 2.225, 'vnmnc', 'Hòn Mê (2?)'); // Hòn Mê
  add('osm-way-1273268450', 'hai-dang-bien-son', {height:14,diameter:3.65,shape:'round',paint:'blackWhite',optic:'lantern'}, 0.67, 'vnmnc', 'Biển Sơn (3)'); // Biện Sơn
  add('osm-way-1272966049', 'hai-dang-ba-dong', {height:23,diameter:3.6,shape:'round',paint:'grey',optic:'beacon'}, 2.506, 'vnms', 'Trà Vinh Province Lighthouses Ba Động'); // Ba Động
  add('osm-way-1273113085', 'hai-dang-ho-tau', {height:20,diameter:2.4,shape:'square',paint:'blackWhite',optic:'beacon',details:'lattice'}, -3.103, 'vnms', 'Hồ Tàu (Long Khan Point)'); // Hồ Tàu
  add('osm-way-1248094045', 'hai-dang-cua-dai', {height:23,diameter:3.7,shape:'round',paint:'blackWhite',optic:'lantern'}, 2.041, 'vnmnc', 'Cửa Đại (Hoi An) (2)'); // Cửa Đại
  add('osm-way-1273256838', 'hai-dang-tan-hiep', {height:14.8,diameter:2.4,shape:'round',paint:'blackWhite',optic:'beacon'}, -1.837, 'vnmnc', 'Tân Hiệp (Tian Hep) (2)'); // Tân Hiệp
  add('osm-way-1273256840', 'hai-dang-quan-tuong', {height:5.5,diameter:2.2,shape:'round',paint:'white',optic:'beacon',details:'ladder plain'}, 3.834, 'vnmnc', 'Quản Tượng (Fort Point, Tourane Bay)'); // Quản Tượng
  add('osm-way-695021971', 'hai-dang-ky-ha', {height:26.5,diameter:4.9,shape:'round',paint:'redWhite',optic:'lantern',details:'ribs6'}, 0.704, 'vnmnc', 'An Hòa (Kỳ Hà)'); // Kỳ Hà
  add('osm-way-1263650800', 'hai-dang-tien-sa', {height:9,diameter:4.5,shape:'round',paint:'whiteYellowWhite',optic:'lantern'}, 3.247, 'vnmnc', 'Tiên Sa (Mũi Đà Nẵng, Sơn Trà, Cape Tourane)'); // Tiên Sa
  add('osm-way-1273256841', 'hai-dang-cu-lao-cham', {height:26.1,diameter:4.8,shape:'round',paint:'grey',optic:'lantern'}, 1.435, 'vnmnc', 'Cù Lao Chàm (2)'); // Cù Lao Chàm
  add('osm-way-1273256839', 'hai-dang-son-cha', {height:15.5,diameter:4,shape:'round',paint:'paleBlue',optic:'lantern'}, 0.504, 'vnmnc', 'Sơn Chà'); // Sơn Chà
  add('osm-way-1272966036', 'hai-dang-da-rang', {height:17,diameter:3.3,shape:'square',paint:'white',optic:'beacon',details:'house2',house:[12.1,12]}, -2.795, 'vnmsc', 'Đà Rằng (Tuy Hòa)'); // Đà Rằng
  // The province's Hòn Nưa drone photographed the red beacon from node5,
  // about 39 m east-northeast of the tower. https://daklakvrtour.com/hon-nua.html
  add('osm-way-1272966044','hai-dang-hon-nua',{
    height:10,diameter:3.2,shape:'hex',paint:'red',optic:'beacon',
    coastView:{name:'Tháp đỏ trên sườn Hòn Nưa',height:11,viewBase:'monument',viewRadius:43.4,
      viewAngle:1.933,viewElevation:.46,viewFov:60,
      description:'Nhìn từ trên cao ở phía đông bắc, qua ngọn đèn đỏ về sườn đảo và vùng biển bên kia.'}
  },-.607,'vnmsc','Hòn Nưa');
  // Node12 is on the west balcony, looking toward Bãi Môn. Nodes12 and 13
  // both show the yellow lantern pedestal. https://daklakvrtour.com/mui-dien-bai-mon.html
  add('osm-way-909041150','hai-dang-dai-lanh',{
    height:25.6,diameter:5,shape:'round',paint:'white',optic:'lantern',details:'blackDome whiteLight daiLanhStation',lanternBase:'yellow',
    coastView:{name:'Từ ban công phía tây nhìn xuống Bãi Môn',offset:[-492.5,-47.9],height:-65/.46,viewBase:'monument',
      viewRadius:499.6,viewAngle:1.473,viewElevation:.176,viewFov:62,
      description:'Từ vòng ban công cạnh bệ đèn màu vàng nhìn về phía tây. Dải cát Bãi Môn nằm bên dưới, giữa hai sườn núi.'}
  },-.482,'vnmsc','Mũi Đại Lãnh (Mũi Điện, Cap Varella) (2)');
  // OSM r12341630 includes the western yard. Field panoramas 12, 13 and 15
  // show the long eastern arcade, its tiled roof terrace and a short west wing.
  function daiLanhStation(T,{box,stamp,palette,group}){
    const ochre=0xe4ad61,cream=0xf4d594,terracotta=0xb96e4b,shutter=0x61797d;
    const floor=3.9,deck=floor+4.2,bay=5,front=3.15,first=7;
    const paving=0xbb8b69;
    palette({plaster:[ochre,cream],tile:[terracotta,paving]});
    box(0xa4987f,7.35,1.25,27,8.9,5.08,40);
    const court=new T.PlaneGeometry(8.9,40,6,24);
    court.rotateX(-Math.PI/2);court.translate(7.35,0,27);
    const surface=new T.Mesh(court,new T.MeshStandardMaterial({color:paving,roughness:.96}));
    surface.receiveShadow=true;group.add(surface);
    const previous=group.userData.fitGround;
    group.userData.fitGround=ground=>{
      previous?.(ground);
      const positions=court.attributes.position;
      for(let i=0;i<positions.count;i++){
        const surfaceHeight=ground(positions.getX(i),positions.getZ(i));
        positions.setY(i,Math.max(floor-.007,surfaceHeight+.13));
      }
      positions.needsUpdate=true;court.computeVertexNormals();court.computeBoundingSphere();
    };
    box(0x9c8f75,-2.35,.95,27,11.1,5.9,40.2);
    box(ochre,-3.65,floor+1.95,27,8.35,3.9,40);
    box(cream,-2.35,deck-.22,27,11.45,.46,40.65);
    box(terracotta,-2.35,deck+.03,27,11.12,.14,40.25);
    box(ochre,-11.75,1.9,11.6,8.1,10.8,9.0);
    box(cream,-11.75,deck-.66,11.6,8.55,.34,9.45);
    box(terracotta,-11.75,deck-.43,11.6,8.30,.17,9.18);
    const opening=new T.Shape(),spring=floor+1.95,crown=floor+3.45;
    opening.moveTo(-bay/2,deck-.35);opening.lineTo(bay/2,deck-.35);
    opening.lineTo(bay/2,spring);opening.lineTo(bay*.42,spring);
    opening.quadraticCurveTo(bay*.39,crown,0,crown);opening.quadraticCurveTo(-bay*.39,crown,-bay*.42,spring);
    opening.lineTo(-bay/2,spring);opening.closePath();
    const arch=new T.ExtrudeGeometry(opening,{depth:.43,bevelEnabled:false,curveSegments:8});
    for(let i=0;i<8;i++){
      const z=first+(i+.5)*bay;
      stamp(arch,ochre,front-.44,0,z,1,1,1,Math.PI/2);
      box(shutter,.55,floor+1.34,z, .12,2.64,1.50);
      box(cream,.64,floor+2.70,z,.21,.18,1.84);
      if(i%2===0)box(cream,-2.35,deck+.13,z+bay/2,11.06,.08,.22);
    }
    arch.dispose();
    for(let i=0;i<=8;i++){
      const z=first+i*bay;
      box(ochre,front-.28,floor+.96,z,.56,1.96,.79);
      box(cream,front-.28,floor+.15,z,.71,.30,1.02);
      box(ochre,front-.25,deck+.63,z,.42,1.16,.46);
    }
    for(const x of [-7.86,front-.25]){
      box(cream,x,deck+.30,27,.25,.26,40.25);
      box(cream,x,deck+1.16,27,.33,.17,40.40);
      for(let z=first;z<=47;z+=.94)box(ochre,x,deck+.73,z,.16,.71,.18);
    }
    for(const z of [first,47]){
      box(cream,-2.39,deck+1.16,z,11.45,.20,.33);
      for(let x=-7.72;x<3.2;x+=.94)box(ochre,x,deck+.63,z,.18,1.05,.18);
    }
  }
  add('osm-way-613351065', 'hai-dang-cua-tieu', {height:25,diameter:3.2,shape:'round',paint:'redWhite',optic:'beacon',details:'waist tidal6',house:[10.6,9.2]}, -0.856, 'vnms', 'Cửa Tiểu (Cua Thieu, Banc Norodom) (2)'); // Cửa Tiểu
  function coastalRock(T,group,cliff,yaw,height,views){
    const positions=[],colours=[],index=[],c=Math.cos(yaw),s=Math.sin(yaw),volcanic=cliff.high>100;
    const count=cliff.ring.length*5,loop=[];
    for(let i=0;i<cliff.ring.length;i++){
      const [x,z]=cliff.ring[i],[x1,z1]=cliff.ring[(i+1)%cliff.ring.length];
      for(let j=0;j<5;j++)loop.push([x+(x1-x)*j/5,z+(z1-z)*j/5]);
    }
    const pigment=new T.Color();
    function vertex(x,z,h,tone,shade){
      positions.push(x*c-z*s,h,x*s+z*c);pigment.setHex(tone);
      colours.push(pigment.r*shade,pigment.g*shade,pigment.b*shade);
    }
    const levels=[[1,-.07],[1,0],[.97,.06],[.94,.12],[.93,.17],[.90,.25],[.88,.33],[.86,.41],[.85,.49],
      [.83,.58],[.79,.64],[.77,.71],[.73,.77],[.70,.83],[.65,.88],[.52,.95],[.36,.98],[.17,.993],[.07,1]];
    for(let k=0;k<levels.length;k++)for(let i=0;i<count;i++){
      const [radius,t]=levels[k],[x,z]=loop[i];
      const flute=.04*Math.sin(i*1.97)+.033*Math.cos(i*.66+k*.71)+.014*Math.sin(i*4.6+k*3.3);
      const shrink=radius*(1+(k?flute:0));
      const rim=1-T.MathUtils.smoothstep(t,.70,1);
      const lowTail=volcanic?Math.max(.06,1-.0014*Math.abs(x)-.0012*Math.max(0,-z)-.0036*Math.max(0,z)):1-.10*(1+Math.cos(i*.15))*.5;
      const peak=rim*.027*Math.sin(i*.59+k*.31);
      const y=cliff.high*(t*(1-(1-lowTail)*rim+peak)-1);
      const crown=t>.94,rock=crown?(volcanic?0x85816b:0x6f745e):volcanic?0x827b70:0x8d9083;
      const tail=volcanic?1-T.MathUtils.smoothstep(z,70,350)*T.MathUtils.smoothstep(t,.18,.83)*.79:1;
      vertex(x*shrink,z*shrink*tail,y,rock,.82+.12*Math.sin(i*.71)+.06*Math.cos(k*1.21));
      if(k){
        const a=(k-1)*count+i,b=(k-1)*count+(i+1)%count;
        index.push(a,b,b+count,a,b+count,a+count);
      }
    }
    const center=positions.length/3;vertex(0,0,0,volcanic?0x8c836c:0x747863,1);
    for(let i=0;i<count;i++)index.push(center,(levels.length-1)*count+i,(levels.length-1)*count+(i+1)%count);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.setIndex(index);
    const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();
    const material=new T.MeshStandardMaterial({roughness:1,vertexColors:true,side:T.DoubleSide});
    material.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec3 cliffP;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncliffP=position;');
      shader.fragmentShader=`varying vec3 cliffP;
        float cliffHash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
        float cliffNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
          return mix(mix(mix(cliffHash(i),cliffHash(i+vec3(1,0,0)),f.x),mix(cliffHash(i+vec3(0,0,1)),cliffHash(i+vec3(1,0,1)),f.x),f.z),
                     mix(mix(cliffHash(i+vec3(0,1,0)),cliffHash(i+vec3(1,1,0)),f.x),mix(cliffHash(i+vec3(0,1,1)),cliffHash(i+vec3(1,1,1)),f.x),f.z),f.y);}
      `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec3 p=cliffP;float coarse=cliffNoise(p*vec3(.30,.072,.30));
        float grain=cliffNoise(p*1.16)*.57+cliffNoise(p*3.31)*.29+cliffNoise(p*7.6)*.14;
        float joint=abs(fract(coarse*2.1+p.y*.08+.29*cliffNoise(p*.49))-.5);
        diffuseColor.rgb*=(.64+.68*grain)*(.70+.51*coarse+.13*smoothstep(.017,.08,joint));
        diffuseColor.rgb+=vec3(.027,.031,.025)*smoothstep(.57,.74,grain);`);
    };
    const rock=new T.Mesh(flat,material);rock.receiveShadow=rock.castShadow=true;group.add(rock);
    let last=0;
    group.userData.fitGround=ground=>{
      const reach=volcanic?525:80;
      const water=Math.min(ground(reach,0),ground(-reach,0),ground(0,reach),ground(0,-reach));
      const lift=Math.max(0,cliff.high+water);
      for(const child of group.children)child.position.y+=lift-last;
      group.userData.height=height+lift;views[1].height=(lift+height*.89)/.46;last=lift;
    };
  }
  function coastalLight(T,{group,stamp,box},spec,has){
    const {height,diameter,shape,paint,optic,house}=spec;
    const count=sidesOf[shape],r=diameter/2,unit=Math.min(1,height/9),twoPi=Math.PI*2;
    const paintKeys=sequences[paint]||[paint];
    const bands=paint==='redWhiteRed'?[0,.16,.77]:paintKeys.map((_,i)=>i/paintKeys.length);
    const colourAt=t=>color[paintKeys[bands.reduce((index,edge,i)=>t>=edge?i:index,0)]];
    const light=has('greenLight')?0xb9ffd6:has('redLight')?0xffa996:has('whiteLight')?0xffffff:0xffe8ac;
    const trim=has('trimMint')?color.greenTrim:has('trimBlue')||has('blueFrame')?color.blue:color.white;
    const frame=has('redFrame')?color.red:has('yellowFrame')?color.yellow:has('blueFrame')?color.blue:trim;
    const dome=has('blackDome')?color.charcoal:has('redFrame')?color.red:color.silver;
    const ringPaint=has('yellowRail')?color.yellow:has('redFrame')?color.red:has('trimMint')?color.greenTrim:color.metal;
    // A radius here measures from the centre to a flat face. The shaft,
    // its doors and the handrails therefore agree on triangular and square plans too.
    function section(tint,x,z,y0,y1,lo,hi,n=count,stretch=1){
      if(y1<=y0||lo<0||hi<0)return;
      const k=1/Math.cos(Math.PI/n),geo=new T.CylinderGeometry(hi*k,lo*k,y1-y0,n);
      geo.rotateY(Math.PI/n);stamp(geo,tint,x,(y0+y1)*.5,z,1,1,stretch);geo.dispose();
    }
    function at(x,z,a,rr,y){return [x+rr*Math.sin(a),y,z+rr*Math.cos(a)];}
    function beam(a,b,tint,size,width=size){
      const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],flat=Math.hypot(dx,dz),len=Math.hypot(dy,flat);
      if(len>.001)box(tint,(a[0]+b[0])*.5,(a[1]+b[1])*.5,(a[2]+b[2])*.5,
        width,len,size,Math.atan2(dx,dz),Math.atan2(flat,dy));
    }
    function fence(x,z,y,flatRadius,n,railHeight=.86,metal=ringPaint){
      const rr=flatRadius/Math.cos(Math.PI/n);
      for(let i=0;i<n;i++){
        const angle=(i+.5)*twoPi/n,next=(i+1.5)*twoPi/n;
        const a=at(x,z,angle,rr,y),b=at(x,z,next,rr,y);
        const steps=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[2]-a[2])/1.16));
        for(let j=0;j<steps;j++){
          const px=a[0]+(b[0]-a[0])*j/steps,pz=a[2]+(b[2]-a[2])*j/steps;
          box(metal,px,y+railHeight*.51,pz,.049,railHeight,.049);
        }
        for(const level of [.47,1]){
          const dy=railHeight*level;
          beam([a[0],y+dy,a[2]],[b[0],y+dy,b[2]],metal,level===1?.058:.039);
        }
      }
    }
    function gallery(x,z,y,body,reach,n,metal=ringPaint){
      section(trim,x,z,y-.32*unit,y-.12*unit,body*.99,reach,n);
      section(trim,x,z,y-.12*unit,y,reach,reach,n);
      const supports=n>=16?8:n;
      for(let j=0;j<supports;j++){
        const a=twoPi*j/supports;
        beam(at(x,z,a,body*.96,y-.82*unit),at(x,z,a,reach-.10,y-.13*unit),trim,.105*unit,.13*unit);
      }
      fence(x,z,y,reach-.035,n>=16?16:n,Math.min(.84,height*.086),metal);
    }
    function opening(x,z,angle,wall,y,w,h,door=false){
      const panel=(tint,u,v,recess,ww,hh,dd)=>{
        box(tint,x+Math.sin(angle)*(wall+recess)+Math.cos(angle)*u,y+v,
          z+Math.cos(angle)*(wall+recess)-Math.sin(angle)*u,ww,hh,dd,angle);
      };
      panel(door?color.slate:trim,0,0,.045,w+.17,h+.16,.13);
      panel(door?0x526a70:0x516970,0,-.018,.121,w,h,.058);
      if(door){
        panel(0x354a4e,-w*.3,-.1,.16,.05,.17,.05);
        panel(trim,0,h*.52,.11,w+.25,.11,.24);
      }else{
        panel(trim,0,0,.153,.046,h,.044);
        panel(trim,0,h*.05,.153,w,.05,.044);
        panel(trim,0,-h*.51,.12,w+.20,.10,.23);
      }
    }
    function houseWalls(width,depth,y0,y1,floors,tint,n=4){
      const floorH=(y1-y0)/floors,ww=width/2,dd=depth/2;
      if(n===4)box(tint,0,(y0+y1)*.5,0,width,y1-y0,depth);
      else section(tint,0,0,y0,y1,ww,ww,n,depth/width);
      for(let floor=0;floor<floors;floor++){
        const base=y0+floor*floorH,level=base+floorH*.54;
        if(n===4){
          for(let f=0;f<4;f++){
            const angle=f*Math.PI*.5,len=f%2?depth:width,wall=f%2?ww:dd,openings=Math.max(1,Math.floor(len/2.9));
            for(let j=0;j<openings;j++){
              const offset=(-.5+(j+.5)/openings)*len,door=f===0&&!floor&&j===Math.floor(openings/2);
              const hh=Math.min(door?2.05:1.24,floorH*.76),ww=Math.min(door?1.04:.94,len/openings*.56);
              opening(Math.cos(angle)*offset,-Math.sin(angle)*offset,angle,wall,door?base+hh*.5:level,ww,hh,door);
            }
          }
          box(trim,0,base+floorH-.07,0,width+.28,.18,depth+.28);
        }else{
          for(let j=0;j<n;j++){
            const a=j*twoPi/n,rr=ww,dx=Math.sin(a)*rr,dz=Math.cos(a)*rr*depth/width;
            opening(dx,dz,a,0,level,Math.min(1.02,rr*.55),Math.min(1.24,floorH*.51));
          }
          section(trim,0,0,base+floorH-.17,base+floorH,ww+.17,ww+.17,n,depth/width);
        }
      }
    }
    function hipRoof(w,d,y,rise,n){
      if(n!==4){section(color.roof,0,0,y,y+rise,w*.51,w*.26,n,d/w);return;}
      const v=[-w*.52,y,-d*.53, w*.52,y,-d*.53, w*.52,y,d*.53,-w*.52,y,d*.53,
        -(w-d)*.45,y+rise,0,(w-d)*.45,y+rise,0];
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));
      g.setIndex([0,5,1,0,4,5,1,5,2,2,4,3,2,5,4,3,4,0]);
      const flat=g.toNonIndexed();flat.computeVertexNormals();stamp(flat,color.roof,0,0,0);g.dispose();flat.dispose();
    }
    let tx=0,tz=0,start=0;
    const pier=has('tidal6')||has('tidal8')||has('tidalOct3');
    if(house){
      const [w,d]=house;
      if(has('rotunda')){
        const radius=w*.5,h=4.0;
        section(color.gold,0,0,.12,h,radius*.71,radius*.71,32);
        section(color.white,0,0,0,.22,radius,radius,32);
        for(let i=0;i<12;i++){
          const a=i*twoPi/12,px=Math.sin(a)*(radius-.24),pz=Math.cos(a)*(radius-.24);
          section(trim,px,pz,.19,.45,.22,.17,12);
          section(trim,px,pz,.45,h-.26,.15,.14,12);
          section(trim,px,pz,h-.26,h,.16,.23,12);
        }
        section(trim,0,0,h,h+.24,radius+.13,radius+.13,32);
        section(color.yellow,0,0,h+.24,h+.44,radius,radius,32);
        fence(0,0,.22,radius-.30,16,.72,trim);
        start=h+.44;
      }else if(has('stoneTiers')){
        section(color.stone,0,0,0,2.2,w*.50,w*.50,8,d/w);
        section(color.granite,0,0,2.2,6,w*.47,w*.45,8,d/w);
        gallery(0,0,6,w*.44,w*.47,8,color.slate);
        section(color.stone,0,0,6,11.7,w*.36,w*.34,8,d/w);
        for(let i=0;i<8;i++)opening(0,0,i*twoPi/8,w*.34,8.7,1.15,2.2);
        gallery(0,0,11.8,w*.34,w*.37,8,color.slate);
        start=11.8;
      }else{
        const floors=has('whiteHouse4')?4:has('house3')||has('corner3')||has('island3')||has('tidalOct3')?3:
          has('whiteHouse1')||has('blackHouse1')||has('buffHouse1')||has('tidal8')?1:2;
        const n=has('tidal6')?6:has('tidal8')||has('tidalOct3')||has('island3')?8:4;
        const colour=has('blackHouse1')?color.charcoal:has('seaBlue2')?0x78a7c8:has('greyHouse2')?color.granite:
          has('creamHouse2')||has('buffHouse1')?color.buff:has('whiteHouse1')||has('whiteHouse2')||has('whiteHouse4')||pier?color.white:color.gold;
        const bed=pier?Math.min(3.35,height*.16):.18;
        if(pier){
          const pilings=n,ringRadius=w*.45;
          for(let i=0;i<pilings;i++){
            const a=(i+.5)*twoPi/n,px=ringRadius*Math.sin(a),pz=ringRadius*Math.cos(a)*d/w;
            section(color.slate,px,pz,-1.25,bed,.30,.27,10);
          }
          section(color.grey,0,0,bed-.40,bed,w*.53,w*.53,n,d/w);
        }else box(color.slate,0,.105,0,w+.12,.21,d+.12);
        const heightLimit=optic==='roofLamp'?height*.85:height*(has('corner3')?.61:.56);
        const walls=optic==='roofLamp'?height-1.35-bed:Math.min(heightLimit,floors*(has('seaBlue2')?3.6:3.0)),roofY=bed+walls;
        houseWalls(w,has('porch')?d*.68:d,bed,roofY,floors,colour,n);
        if(has('porch')){
          const reach=d*.49,front=w*.23;
          for(const x of [-front,front])for(const z of [reach,reach-.43])
            section(trim,x,z,bed,roofY,.13,.12,12);
          const face=new T.Shape();face.moveTo(-front-.36,0);face.lineTo(front+.36,0);face.lineTo(0,1.04);face.closePath();
          const pediment=new T.ExtrudeGeometry(face,{depth:.24,bevelEnabled:false});stamp(pediment,trim,0,roofY,reach-.11);pediment.dispose();
          box(trim,0,roofY-.18,reach-.64,front*2+.58,.29,1.5);
          box(trim,0,bed+walls*.50,reach-.61,front*1.86,.19,1.34);
        }
        if(has('redHip'))hipRoof(w,d,roofY,Math.min(2.15,d*.17),n);
        if(has('corner3')){tx=w*.5-r*.91;tz=d*.5-r*.91;}
        if(has('buffHouse1'))tz=d*.5-r*.7;
        if(has('tidal8'))section(color.white,0,0,roofY,roofY+1.0,w*.24,r*1.12,8,d/w);
        start=has('corner3')?.18:roofY;
      }
    }
    if(has('plinth')){
      const side=diameter*1.04;
      box(color.white,0,height*.09,0,side,height*.18,side);
      box(trim,0,height*.18,0,side+.11,.13,side+.11);start=height*.18;
    }
    if(has('roundBase')){
      section(color.buff,tx,tz,start,start+1.25,r*1.30,r*1.19,24);
      start+=1.25;
    }
    if(!house&&!has('plinth')&&!has('lattice')){
      section(paint==='white'?0xcecec4:colourAt(.02),tx,tz,-.52,.23,r*1.075,r*1.075,count);
      section(colourAt(.02),tx,tz,.23,.44,r*1.075,r,count);
    }
    const openOptic=optic==='beacon'||optic==='roofLamp'||optic==='daymark'||optic==='mast';
    const lanternR=Math.min(1.52,Math.max(.56,r*(optic==='small'?.49:.64)))*unit;
    const capHeight=optic==='mast'?Math.min(height*.30,4.5):optic==='daymark'?Math.min(4.6,height*.24):
      openOptic?Math.min(1.35,height*.23):Math.min(4.18,Math.max(height<9?1.62:2.24,lanternR*2.65));
    const galleryY=height-capHeight,bodyHeight=Math.max(.35,galleryY-start);
    function profile(t){
      if(has('lattice'))return r*(1-.58*t);
      if(has('waist'))return r*(.49+.51*Math.pow(Math.abs(t*2-1),1.33));
      if(has('cabin'))return r*(t<.68?.76:t<.78?.76+(t-.68)*3:1.06);
      if(has('setback'))return r*(t<.57?1:.73);
      if(has('stoneTiers'))return r*(1.15-.48*t);
      return r*(1-(has('tapered')?.36:has('ribs4')?.17:.055)*t);
    }
    const shaftRadius=profile(1),floorAt=t=>start+t*bodyHeight;
    const railSides=count===32?28:count;
    const deckR=Math.max(shaftRadius+.38*unit,openOptic?shaftRadius*1.04:lanternR+.38*unit);
    if(has('lattice')){
      const stages=Math.max(5,Math.round(bodyHeight/3.1));
      for(let j=0;j<stages;j++){
        const t=j/stages,t1=(j+1)/stages,base=profile(t)*Math.SQRT2,top=profile(t1)*Math.SQRT2;
        const tint=colourAt((t+t1)*.5),y=floorAt(t),y1=floorAt(t1);
        for(let i=0;i<4;i++){
          const a=(i+.5)*Math.PI/2,b=a+Math.PI/2;
          beam(at(tx,tz,a,base,y),at(tx,tz,a,top,y1),tint,.115,.15);
          beam(at(tx,tz,a,base,y),at(tx,tz,b,base,y),tint,.105);
          beam(at(tx,tz,a,base,y),at(tx,tz,b,top,y1),tint,.08);
          beam(at(tx,tz,b,base,y),at(tx,tz,a,top,y1),tint,.08);
        }
      }
    }else if(optic!=='roofLamp'){
      const rings=new Set([0,1]);
      bands.forEach(edge=>rings.add(edge));
      if(has('waist'))for(let j=1;j<12;j++)rings.add(j/12);
      if(has('cabin')){rings.add(.68);rings.add(.78);}
      if(has('setback')){rings.add(.566);rings.add(.57);}
      const levels=[...rings].sort((a,b)=>a-b);
      for(let j=1;j<levels.length;j++){
        const a=levels[j-1],b=levels[j];
        section(colourAt((a+b)*.5),tx,tz,floorAt(a),floorAt(b),profile(a),profile(b));
      }
      if(['granite','stone'].includes(paint)){
        // Individual mortar courses and staggered joints remain visible at walking distance.
        const rows=Math.ceil(bodyHeight/.57),n=count===32?18:count*3;
        for(let j=0;j<rows;j++){
          const t=j/rows,rr=profile(t)+.013;
          section(has('brownStone')?0x83745f:0x867e6d,tx,tz,floorAt(t),floorAt(t)+.024,rr,rr);
          const facet=count===32?32:count;
          for(let i=0;i<n;i++){
            const a=(i+.5*(j%2))*twoPi/n;
            const delta=((a+Math.PI/facet)%(twoPi/facet))-Math.PI/facet;
            const dist=rr/Math.cos(delta);
            beam(at(tx,tz,a,dist,floorAt(t)),at(tx,tz,a,(profile(Math.min(1,(j+1)/rows))+.012)/Math.cos(delta),floorAt((j+1)/rows)),0x837b6c,.027);
          }
        }
      }
      if(paint.endsWith('Vertical')||paint==='spiral'){
        const spiral=paint==='spiral',rrOffset=.024;
        const verts=[],index=[],rows=spiral?126:2;
        for(let j=0;j<=rows;j++){
          const t=j/rows,y=floorAt(t),rr=profile(t)+rrOffset;
          const begin=spiral?twoPi*(2.15*t-.05):.56,spread=spiral?2.95:.22,steps=spiral?24:4;
          for(let k=0;k<=steps;k++){
            const a=begin+k/steps*spread;verts.push(...at(tx,tz,a,rr,y));
            const q=j*(steps+1)+k;if(j&&k)index.push(q-steps-2,q-steps-1,q,q-steps-2,q,q-1);
          }
        }
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex(index);
        g.computeVertexNormals();stamp(g,spiral?color.black:color.red,0,0,0);g.dispose();
      }
      const ribs=has('ribs8')?8:has('ribs6')?6:has('ribs4')?4:0;
      for(let j=0;j<ribs;j++){
        const angle=j*twoPi/ribs+Math.PI/ribs,wide=has('ribs4')?.50:.19;
        const heel=profile(0)+(has('ribs4')?r*.39:.20);
        beam(at(tx,tz,angle,heel,start+.18),at(tx,tz,angle,profile(.37)+.05,floorAt(.37)),
          trim,wide,wide*1.25);
        const knots=[.37,...bands.filter(t=>t>.37&&t<.91),.91];
        for(let k=1;k<knots.length;k++){
          const a=knots[k-1],b=knots[k];
          beam(at(tx,tz,angle,profile(a)+.05,floorAt(a)),at(tx,tz,angle,profile(b)+.04,floorAt(b)),
            has('ribs6')&&paint==='redWhite'?colourAt((a+b)*.5):trim,.15,.20);
        }
      }
      if(has('buttresses')){
        for(let j=0;j<4;j++){
          const a=(j+.5)*Math.PI/2;
          const ridge=[[r-.12,0],[r*1.50,0],[r*1.28,bodyHeight*.28],[r*1.08,bodyHeight*.51],[profile(.86),bodyHeight*.86],[r*.77,bodyHeight*.86]];
          const wedge=new T.Shape();ridge.forEach(([rr,y],i)=>i?wedge.lineTo(rr,y):wedge.moveTo(rr,y));wedge.closePath();
          const g=new T.ExtrudeGeometry(wedge,{depth:.52,bevelEnabled:false});g.translate(0,0,-.26);
          stamp(g,trim,tx,start,tz,1,1,1,a);g.dispose();
        }
        for(const t of [.39,.72])section(trim,tx,tz,floorAt(t),floorAt(t)+.19,profile(t)*1.075,profile(t)*1.075,32);
      }
      if(optic==='daymark'){
        const y=floorAt(.80),rr=profile(.81);
        section(trim,tx,tz,y-.24,y,rr*1.15,rr*1.15,count);
        for(let j=0;j<count;j++)opening(tx,tz,j*twoPi/count,rr,y+.73,.72,.79);
        for(let j=0;j<4;j++)opening(tx,tz,0,profile(.12),floorAt(.1+j*.15),.53,.86);
      }
      if(!house&&!has('waist')&&!has('plain')&&bodyHeight>4.4){
        opening(tx,tz,0,profile(.05),1.05,Math.min(1.02,r*.53),1.96,true);
      }
      if(!has('waist')&&!has('plain')&&bodyHeight>5.2){
        const rows=Math.max(1,Math.floor(bodyHeight/4.9));
        for(let j=0;j<rows;j++){
          const t=.22+.58*(j+.5)/rows,a=(j%3)*twoPi/(count>=16?4:count);
          opening(tx,tz,a,profile(t),floorAt(t),Math.min(.67,r*.39),Math.min(1.10,r*.60));
        }
      }
      if(has('twin')||has('triple')){
        const t=has('triple')?.57:.78;
        gallery(tx,tz,floorAt(t),profile(t),Math.max(profile(t)+.33,deckR*.97),railSides);
        if(has('triple'))gallery(tx,tz,floorAt(.30),profile(.30),profile(.30)+.36,railSides);
      }
    }
    if(has('ladder')){
      const px=tx+.34,wall=tz+r+.17;
      for(const xx of [px-.21,px+.21])box(ringPaint,xx,galleryY*.53,wall,.044,galleryY*1.06,.044);
      for(let y=.22;y<galleryY+.18;y+=.31)box(ringPaint,px,y,wall,.44,.033,.034);
    }
    gallery(tx,tz,galleryY,shaftRadius,deckR,railSides);
    if(optic==='daymark'||optic==='mast'){
      const foot=galleryY+.13,top=height-.42;
      if(optic==='daymark'){
        section(trim,tx,tz,foot,top,.13,.07,12);
        const geo=new T.ConeGeometry(.66,1.05,3);
        stamp(geo,trim,tx,top-.34,tz);geo.dispose();
      }else{
        for(let j=0;j<3;j++){
          const a=j*twoPi/3,b=(j+1)*twoPi/3;
          beam(at(tx,tz,a,.64,foot),at(tx,tz,a,.34,top),trim,.10);
          for(let k=0;k<3;k++){
            const t=k/3,nt=(k+1)/3;
            beam(at(tx,tz,a,.64-.30*t,foot+(top-foot)*t),at(tx,tz,b,.64-.30*nt,foot+(top-foot)*nt),trim,.065);
          }
        }
      }
      section(light,tx,tz,top,height-.1,.14,.13,12);
      section(ringPaint,tx,tz,height-.10,height,.16,.05,12);
    }else if(openOptic){
      const h=height-galleryY;
      section(frame,tx,tz,galleryY,galleryY+h*.52,Math.min(.40,r*.29),.22*unit,12);
      section(color.metal,tx,tz,galleryY+h*.52,galleryY+h*.59,.29*unit,.29*unit,12);
      section(light,tx,tz,galleryY+h*.59,galleryY+h*.91,.22*unit,.21*unit,12);
      for(const t of [.63,.71,.79,.87])section(trim,tx,tz,galleryY+h*t,galleryY+h*t+.021,.226*unit,.226*unit,12);
      section(frame,tx,tz,galleryY+h*.91,height,.25*unit,.12*unit,12);
    }else{
      const h=height-galleryY,n=has('squareCap')?4:optic==='monument'?8:12;
      const lr=optic==='monument'?Math.min(2.55,deckR*.78):lanternR,plinth=galleryY+h*.20,glassTop=galleryY+h*.64;
      section(color[spec.lanternBase]??frame,tx,tz,galleryY,plinth,lr*1.03,lr,n);
      const transparent=new T.MeshPhysicalMaterial({color:0x95b6bc,metalness:.08,roughness:.17,transparent:true,
        opacity:optic==='monument'?.64:.38,depthWrite:false,side:T.DoubleSide});
      const panes=new T.Mesh(new T.CylinderGeometry(lr,lr,glassTop-plinth,n,1,true),transparent);
      panes.position.set(tx,(glassTop+plinth)*.5,tz);group.add(panes);
      for(let i=0;i<n;i++){
        const a=i*twoPi/n;
        beam(at(tx,tz,a,lr,plinth),at(tx,tz,a,lr,glassTop),frame,.057*unit,.065*unit);
      }
      section(ringPaint,tx,tz,plinth-.045,plinth+.06,lr*1.07,lr*1.07,n);
      section(ringPaint,tx,tz,glassTop-.065,glassTop+.047,lr*1.09,lr*1.09,n);
      if(optic!=='monument'){
        const centre=(plinth+glassTop)*.5,lensR=lr*.36,opticH=(glassTop-plinth)*.79;
        section(color.metal,tx,tz,plinth,centre-opticH*.43,lensR*.50,lensR*.56,12);
        for(let j=0;j<11;j++){
          const t=j/11,rad=lensR*(.72+.28*Math.sin(Math.PI*t));
          section(j%2?0xc6d9cb:light,tx,tz,centre+opticH*(t-.5),centre+opticH*(t+1/11-.5),rad*.91,rad,20);
        }
      }
      const eave=lr*1.13,metal=optic==='monument'?color.slate:dome;
      section(metal,tx,tz,glassTop,glassTop+.09,eave,eave,n);
      const top=height-h*.105;
      const curve=[[0,1],[.18,.99],[.50,.83],[.80,.54],[1,.12]];
      for(let j=1;j<curve.length;j++){
        const [a,ra]=curve[j-1],[b,rb]=curve[j];
        section(metal,tx,tz,glassTop+.075+(top-glassTop-.075)*a,glassTop+.075+(top-glassTop-.075)*b,eave*ra,eave*rb,n);
      }
      section(metal,tx,tz,top,height-h*.047,lr*.13,lr*.08,12);
      section(metal,tx,tz,height-h*.047,height,.065*unit,.011*unit,8);
    }
    if(optic!=='monument'){
      const y=galleryY+(height-galleryY)*(openOptic?.78:.42);
      const lamp=new T.Mesh(new T.SphereGeometry(openOptic?.14*unit:lanternR*.23,12,9),
        new T.MeshBasicMaterial({color:light,toneMapped:false}));
      lamp.position.set(tx,y,tz);group.add(lamp);
    }
  }
})();
