'use strict';
// van-mieu.js
'use strict';
// The entrance is on Quốc Tử Giám street. Inside the monument, each stop
// keeps its own mapped location while the car stays at the public approach.
(() => {
  const survey=window.VanMieuSurvey,atlas=window.VietnamTourism;
  const byRef=new Map(survey.features.map(f=>[f.ref,f]));
  const ids=new Map(atlas.entries.map(s=>[s.id,s]));
  const idOf=ref=>'osm-'+({w:'way',n:'node',r:'relation'})[ref[0]]+'-'+ref.slice(1);
  const canonical={w702185155:'khue-van-cac',w1582901993:'osm-relation-21422526'};
  const visitId=ref=>canonical[ref]||idOf(ref);
  const start=[105.8353754,21.0273187];
  const stops=['w702185143','n6594592049','w702241281','w702241280','w702185144','w702241362','w702241363',
    'w702185155','w702185149','w702185150','w37934144','w702185156','w702185157','w702185158','w702185159',
    'w702185160','w702185162','w702185163','w702185164','w702185165','w702185166','w702185176','n1000087430',
    'w702185187','w702185188','w702185189','w702185186','w702185190','w702241331','w37934138','w37934139',
    'w702241326','w702241324','w702241325','n1000087332','w1582901993','w702185145','w178995315','w9964421','n12690252301'];
  const nodes={w702185143:4,w702185144:6,w702185155:8,w37934144:10,w702185157:11,
    w702185176:21,w702185190:22,w702241331:23,w702241326:25,w702241324:31,w702241325:30};
  survey.byRef=byRef;
  survey.stopIds=stops.map(visitId);
  survey.panoramaNodes=new Map(stops.map((ref,i)=>[survey.stopIds[i],nodes[ref]]));
  survey.panoramaNodes.set('van-mieu-quoc-tu-giam',4);
  survey.refStops=new Map(stops.map((ref,i)=>[ref,survey.stopIds[i]]));
  survey.stopName=f=>{
    if(!f.steleRows)return f.name;
    const first=f.steleRows[0].year;
    return f.steleRows.length===1?'Bi đình · khoa '+first:'Nhà bia · dãy có bia khoa '+first;
  };
  survey.refStops.set('w702185142',idOf('w702185143'));
  survey.refStops.set('w702241323',idOf('w702241326'));
  survey.refStops.set('r2388849',idOf('w178995315'));
  // Packed clients already contain the indexed stops. During source builds
  // add them before visitor-atlas creates its spatial index.
  if(atlas.files)return;
  for(const ref of stops){
    if(ref==='w702185155')continue;
    const f=byRef.get(ref),points=f.rings[0];
    const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
    const lon=(Math.min(...xs)+Math.max(...xs))/2,lat=(Math.min(...ys)+Math.max(...ys))/2;
    const existing=ids.get(visitId(ref));
    const entry={...existing,id:visitId(ref),name:survey.stopName(f),
      lon,lat,kind:'Di tích',city:'Hà Nội',locality:'Hà Nội',province:'Hà Nội',region:'Bắc Bộ',start,
      visitOnArrival:true,mappedEntrance:true,arrivalNote:'Xe dừng trên phố Quốc Tử Giám, trước lối vào Văn Miếu.',
      approachMeters:Math.round(Math.hypot((lon-start[0])*111320*Math.cos(lat*Math.PI/180),(lat-start[1])*110900)),
      map:'https://www.openstreetmap.org/'+(ref[0]==='n'?'node/':'way/')+ref.slice(1),source:survey.source};
    if(existing)Object.assign(existing,entry);
    else atlas.entries.push(entry);
  }
})();

;
// visitor-atlas.js
'use strict';
// The catalogue keeps stable OSM IDs for saved trips. Bucket its positions so
// moving the render origin examines only nearby destinations.
(()=>{
  const atlas=window.VietnamTourism,grid=32,cells=new Map();
  atlas.byId=new Map();
  // Start on the public street at the turn for each visitor entrance.
  const arrivals=new Map([
    ['osm-way-197995330',[106.6612130,10.8049114],'Xe dừng ở đường Thăng Long. Đường vào bảo tàng rẽ từ đây đến sân trưng bày.'],
    ['osm-way-165491089',[106.7047032,10.7761032],'Từ đường Đông Du, lối vào sân thánh đường dẫn đến chân bậc thềm.'],
    ['osm-node-7372895085',[107.7470527,16.4954238],'Xe dừng ở đầu đường đi bộ. Theo lối mòn đến cầu thang phía đông để ngắm tháp bên dưới.'],
    ['osm-way-888629812',[105.8275619,21.0079302],'Xe dừng trên phố Chùa Bộc. Lối đi bộ từ vỉa hè vào sân chùa được mô phỏng theo mặt tiền.'],
    ['osm-way-683697174',[106.7058911,10.7655729],'Xe dừng trong hẻm 42 Hoàng Diệu. Lối đi bộ ngắn vào miếu được mô phỏng ở phía hẻm.'],
    ['osm-way-1156119270',[106.6910790,10.7795113],'Xe dừng trên đường Nguyễn Đình Chiểu. Lối đi bộ vào sân được mô phỏng ở mặt tiền số 180.']
  ].map(([id,start,note])=>[id,{start,note}]));
  function index(site){
    const arrival=arrivals.get(site.id);
    if(arrival){
      const {start,note}=arrival,east=(start[0]-site.lon)*111320*Math.cos(site.lat*Math.PI/180);
      Object.assign(site,{start,arrivalNote:note,visitOnArrival:true,
        approachMeters:Math.round(Math.hypot(east,(start[1]-site.lat)*110900))});
    }
    atlas.byId.set(site.id,site);
    const key=Math.floor(site.lon*grid)+','+Math.floor(site.lat*grid);
    if(!cells.has(key))cells.set(key,[]);
    cells.get(key).push(site);
  }
  for(const site of atlas.entries)index(site);
  atlas.nearby=(lon,lat,dx,dy)=>{
    const found=[];
    for(let i=Math.floor((lon-dx)*grid);i<=Math.floor((lon+dx)*grid);i++)
      for(let j=Math.floor((lat-dy)*grid);j<=Math.floor((lat+dy)*grid);j++)
        for(const s of cells.get(i+','+j)||[])
          if(Math.abs(s.lon-lon)<=dx&&Math.abs(s.lat-lat)<=dy)found.push(s);
    return found;
  };
  // Local source already includes the full Atlas. Release assets are split by
  // position for driving and can be fetched in one request for national search.
  const requests=new Map();
  function once(file,load){
    if(!requests.has(file))requests.set(file,load().catch(error=>{requests.delete(file);throw error;}));
    return requests.get(file);
  }
  function loadTile(file){
    return once(file,async()=>{
      const response=await fetch(file);
      if(!response.ok)throw Error('Chưa tải được dữ liệu địa danh. Hãy thử lại.');
      const added=[];
      for(const [site,detail] of RoadTileCodec.decode(await RoadTileCodec.content(response))){
        if(atlas.byId.has(site.id))continue;
        if(detail)window.VietnamSightDetails[site.id]=detail;
        index(site);atlas.entries.push(site);added.push(site);
      }
      atlas.onEntries?.(added);
    });
  }
  atlas.loadAll=async()=>{
    if(atlas.all&&!atlas.complete){
      await loadTile(atlas.all);
      if(!atlas.complete){atlas.complete=true;atlas.onComplete?.();}
    }
  };
  atlas.loadRegion=async(lon,lat)=>{
    const jobs=[];
    if(atlas.files&&!atlas.complete){
      const scale=atlas.tileScale;
      for(let x=Math.floor((lon-.05)*scale);x<=Math.floor((lon+.05)*scale);x++)
        for(let y=Math.floor((lat-.05)*scale);y<=Math.floor((lat+.05)*scale);y++){
          const file=atlas.files[x+'_'+y];if(file)jobs.push(loadTile(file));
        }
    }
    for(const group of atlas.modelGroups||[]){
      if(!group.sites.some(s=>Math.abs(s.lon-lon)<.06&&Math.abs(s.lat-lat)<.06))continue;
      jobs.push(once(group.file,async()=>{
        const {default:sites}=await import('./'+group.file);
        for(let i=0;i<sites.length;i++)Object.assign(group.sites[i],sites[i]);
      }));
    }
    await Promise.all(jobs);
  };
})();

;
// sight-photos.js
'use strict';
function createSightPhotos(){
  const link=document.getElementById('tourReference'),dialog=document.getElementById('sightPhoto');
  const image=dialog.querySelector('img'),credit=dialog.querySelector('figcaption');
  let index,current,sequence=0;
  function external(title,url){
    const a=document.createElement('a');a.textContent=title;a.href=url;a.target='_blank';a.rel='noopener';return a;
  }
  async function select(data){
    const token=++sequence;
    current=null;
    const fallback=data.photo||data.map||data.source;
    link.hidden=!fallback;
    link.href=fallback||'#';link.removeAttribute('aria-haspopup');
    link.textContent=data.photo?'Ảnh tham khảo ↗':data.map?'Bản đồ địa điểm ↗':'Tư liệu địa danh ↗';
    try{
      index??=fetch('sight-photos/index.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).catch(e=>{index=null;throw e;});
      const photos=await index;
      if(sequence!==token)return;
      const ref=data.map?.match(/openstreetmap\.org\/(node|way|relation)\/(\d+)/);
      // A camera may face a different building from the main landmark.
      // Keep its own reference link when that view has no reusable photograph.
      const photo=data.photoCatalogId?photos[data.photoCatalogId]:
        photos[data.catalogId||data.id]||ref&&photos['osm-'+ref[1]+'-'+ref[2]];
      if(!photo)return;
      current={name:data.name,photo};link.href=photo.page;link.textContent='Xem ảnh thực địa';
      link.setAttribute('aria-haspopup','dialog');link.hidden=false;
    }catch{/* The source/map link remains available offline. */}
  }
  link.addEventListener('click',e=>{
    if(!current||e.button!==0||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)return;
    e.preventDefault();
    const {name,photo}=current;
    document.getElementById('sightPhotoTitle').textContent=name;
    image.alt='Ảnh thực địa tại '+name;image.width=photo.width;image.height=photo.height;
    image.hidden=false;image.src='sight-photos/'+photo.file;
    image.onerror=()=>{image.hidden=true;};
    credit.replaceChildren(document.createTextNode(photo.artist+' · '),external(photo.license,photo.licenseUrl),
      document.createTextNode(' · '),external('Ảnh gốc',photo.page),document.createTextNode(' · Đã thu nhỏ, chuyển sang WebP.'));
    dialog.showModal();
  });
  dialog.querySelector('button').onclick=()=>dialog.close();
  dialog.addEventListener('keydown',e=>e.stopPropagation());
  dialog.addEventListener('close',()=>{image.removeAttribute('src');link.focus({preventScroll:true});});
  return {select};
}

;
// nature-field-captures.js
'use strict';
// Publisher-hosted photographic tours. Each key is the actual game destination.
window.NatureFieldCaptures=(()=>{
  function haiPhong(name,folder,scope,media){
    const url='https://vr360dulich.haiphong.gov.vn/teracom-vr360/'+folder+'/index.htm'+
      (media?'?media-name='+encodeURIComponent(media):'');
    return [{name,url,source:url,credit:'Hải Phòng Go · Sở Văn hóa, Thể thao và Du lịch Hải Phòng',scope}];
  }
  function phuYen(name,page,tour,scope){
    return [{name,url:'https://daklakvrtour.com/tour/'+tour+'/index.html',
      source:'https://daklakvrtour.com/'+page+'.html',credit:'Đắk Lắk – Phú Yên VR Tour',scope}];
  }
  function dakLak(node,name,scope){
    const url='https://vr360.com.vn/projects/ban-do-so-du-lich-daklak/#node'+node;
    return {name,url,source:url,credit:'Bản đồ số du lịch tỉnh Đắk Lắk · VR360',scope};
  }
  const vungRoBay=phuYen('Vịnh Vũng Rô từ trên cao','vung-ro',47,
    'Nhìn từ bờ tây ra vịnh và các triền núi bao quanh. Chọn “Bè Nuôi Tôm- Cá” trong ảnh để hạ thấp góc nhìn xuống khu bè.');
  const honYen=phuYen('Hòn Yến, bãi san hô và vùng bè','hon-yen',62,
    'Ảnh mở trên doi đá phía tây Hòn Yến. Chọn “Bãi San Hô” để nhìn từ gần bờ hoặc “Góc Đông Nam” để nhìn từ ngoài khơi về hai hòn.');
  function muiDien(name,scope){
    return phuYen(name,'mui-dien-bai-mon',46,'Ảnh mở ở toàn cảnh Mũi Điện. '+scope);
  }
  function honNua(name,scope){
    return phuYen(name,'hon-nua',171,'Ảnh mở trên cao ở Hòn Nưa. '+scope);
  }
  const thanhLuong=phuYen('Hai hồ và chính điện chùa Thanh Lương','chua-thanh-luong',55,
    'Chọn “Lối Vào” để xuống sân trước chính điện. Từ đây, “Quan Âm Linh Ứng” dẫn tới điện thờ, còn “Quan Âm Nam Hải” dẫn ra hồ Long Ẩn có tượng nhô lên khỏi mặt nước.');
  const nghinhPhong=phuYen('Quảng trường, khe gió và hai tháp Nghinh Phong','thap-nghinh-phong',40,
    'Chọn “Vào Trong” để nhìn dọc khe giữa hai tháp. “View Bên Hông” mở góc bên sườn. Từ đó có thể ra bờ biển hoặc chuyển sang ảnh ban đêm.');
  const baoTangPhuYen=phuYen('Từ sân Bảo tàng Phú Yên tới sảnh và các phòng trưng bày','bao-tang-phu-yen',51,
    'Chọn “Vào Trong” để đến sảnh trống đồng. Hai lối phía đông và phía tây dẫn vào các phòng trưng bày. Ở sân trước, chọn “Khu Ngoài Trời” để đến vườn hiện vật.');
  const vinhXuanDai=phuYen('Ba vũng ven bờ vịnh Xuân Đài','vinh-xuan-dai',66,
    'Chọn “Vũng Sứ” để đến vùng nước dưới chùa Liên Phú ở Dân Phú 2. Ở toàn cảnh trung tâm còn có các góc chụp riêng của Vũng Chào và Vũng Mắm.');
  function baiChua(name,scope){
    return phuYen(name,'tau-khong-so',116,'Ảnh mở ở toàn cảnh Bãi Chùa. '+scope);
  }
  function video(name,id,credit,scope){
    return {name,url:'https://www.youtube-nocookie.com/embed/'+id,source:'https://www.youtube.com/watch?v='+id,credit,scope};
  }
  function goThap(name,scene,scope){
    const url='https://smarttravel-vr.mobifone.vn/vr-tour/khu-di-tich-go-thap/'+scene;
    return {name,url,source:url,credit:'Khu di tích Gò Tháp · Smart Travel MobiFone Khu vực 9',scope};
  }
  function dongThap(folder,scene,name,scope){
    const url='https://vr3d.com.vn/'+folder+'/?startscene='+scene;
    return {name,url,source:url,credit:'Cổng du lịch tỉnh Đồng Tháp · VR3D',scope};
  }
  function nguyenSinhSac(scene,name,scope){
    // The publisher serves X-Frame-Options: SAMEORIGIN. Use its original viewer.
    const source='https://dongthap.hochiminh.vn/?startscene='+scene+'&skipintro=true';
    return {name,source,credit:'Cổng thông tin điện tử Hồ Chí Minh',scope:scope+' Ảnh mở trong tab riêng.'};
  }
  return {
    'osm-way-232410041':baoTangPhuYen,'phu-yen-canh-nha-bao-tang':baoTangPhuYen,'phu-yen-sanh-trong-dong':baoTangPhuYen,
    'osm-relation-16028816':vinhXuanDai,'phu-yen-cu-lao-vung-su':vinhXuanDai,'phu-yen-mui-cay-vung-chao':vinhXuanDai,
    'osm-node-4510077892':phuYen('Từ chân Đèo Cả lên đỉnh Đá Bia','nui-da-bia',115,
      'Ảnh mở ở toàn cảnh chân núi. Theo các điểm chuyển cảnh để xem đường bậc, sườn núi và phiến đá trên đỉnh.'),
    'osm-way-151569083':honYen,
    'osm-way-151569085':honYen,
    'osm-node-4472642290':honYen,
    'osm-node-11779827836':phuYen('Đầm Ô Loan, cầu An Cư và cầu An Hải','dam-o-loan',104,
      'Từ góc toàn cảnh phía đèo Quán Cau, chọn “Cận Cảnh” để ra giữa đầm. Hai điểm “Cầu An Cư” và “Cầu An Hải” cho thấy các dòng nước nối với đầm.'),
    'osm-node-4472649089':phuYen('Từ cầu Bình Phú ra đầm Cù Mông','dam-cu-mong',162,
      'Ảnh mở ở cầu Bình Phú. Chọn hướng bắc để xem vùng bè và các ao ven bờ, hoặc tới cửa đầm để nhìn ra biển.'),
    'osm-node-11055944805':nghinhPhong,'osm-way-1272649341':nghinhPhong,
    'osm-way-1272966043':phuYen('Lối bộ trên ghềnh và hải đăng Gành Đèn','ganh-da-dia',43,
      'Từ toàn cảnh Gành Đá Đĩa chọn “Gành Đèn” để xem tháp và bờ đá từ trên cao, rồi theo điểm nối xuống lối có lan can cạnh tháp.'),
    'osm-node-4674771389':phuYen('Sân Tháp Nhạn, ba tầng mái và Tuy Hòa từ trên cao','nui-nhan',42,
      'Chọn “Tháp Nhạn” để đứng trước lối bậc ở mặt đông. Từ toàn cảnh, có thể tới nhà trưng bày hoặc chuyển sang ảnh ban đêm.'),
    'osm-node-4518976294':phuYen('Từ sân đài tưởng niệm vào nhà bia','nui-nhan',42,
      'Chọn “Đài Liệt Sỹ” để xuống sân trước đài tưởng niệm. Từ sân, chọn “Vào Trong” để xem các trụ và bia.'),
    'osm-node-12856400201':phuYen('Đền thờ và cây bồ đề ở Long Phụng','den-tho-luong-van-chanh',93,
      'Từ sân cổng, chọn “Vào Trong” rồi “Đền Thờ” để theo trục vào chính điện. Điểm “Khu Mộ (500m)” mở một khu riêng ngoài sân đền.'),
    'osm-node-6052212185':thanhLuong,'osm-way-903827683':thanhLuong,'osm-way-903834500':thanhLuong,
    'osm-way-903834501':thanhLuong,'osm-way-903834502':thanhLuong,
    'osm-way-160203374':muiDien('Bãi Môn và đường men sườn núi','Chọn “Bãi Môn” để xuống bãi cát. Từ đó, “Lên Hải Đăng” đưa bạn lên lối đi có lan can nhìn lại bãi.'),
    'osm-way-909041150':muiDien('Ban công và cầu thang hải đăng Đại Lãnh','Chọn “Hải Đăng” để tới ban công đèn. Từ đây có thể vòng sang mặt tây hoặc vào cầu thang trong tháp.'),
    'phu-yen-bia-mom-rang-dong':muiDien('Bia, sân cờ và chòi nghỉ trên mỏm Rạng Đông','Chọn “Điểm Cực Đông” để tới sân có bia. Từ sân nhìn ngược qua những tảng đá về phía hải đăng trên cao.'),
    'osm-way-50540459':honNua('Vòng quanh Hòn Nưa','Chọn “View Từ Mặt Tây” để nhìn toàn đảo hoặc “Bãi Biển” để xuống bãi.'),
    'osm-way-481006392':honNua('Bãi cát phía tây đảo','Chọn “Bãi Biển” để nhìn dọc bờ cát, sau đó chọn “Góc Nam” hoặc “Góc Bắc” để xem hai đầu bãi.'),
    'osm-way-481006394':honNua('Toàn cảnh bờ đá Hòn Nưa','Góc trên cao cho thấy các mỏm đá quanh đảo. Bấm “Góc Bắc” để chuyển sang đầu bắc của bãi cát phía tây.'),
    'osm-way-1272966044':honNua('Hải đăng trên sườn Hòn Nưa','Chọn “Hải Đăng” để nhìn về tháp đỏ và mái nhà trạm trên sườn núi.'),
    'osm-way-804128824':phuYen('Sân, thánh đường và hang trưng bày Mằng Lăng','nha-tho-mang-lang',69,
      'Từ ảnh trên cao, chọn các điểm ngay nhà thờ để xem mặt đứng, hai hành lang và cung thánh. Hang trưng bày sách Quốc ngữ nằm bên sân.'),
    'osm-node-11565227115':vungRoBay,
    'osm-node-4472600793':vungRoBay,
    'osm-node-4292019089':baiChua('Sân đài tưởng niệm ở Bãi Chùa','Chọn “Biểu Tượng Tàu Không Số” để tới sân lễ có tượng hình mũi tàu. Ảnh chụp khi sân đang dựng rạp.'),
    'osm-node-12382639867':baiChua('Lối vào nhà tưởng niệm bên mép nước','Chọn “Di Tích”, rồi “Nhà Tưởng Niệm”. Từ sân gạch chọn “Vào Trong” để xem gian thờ.'),
    'phu-yen-nha-trung-bay-vung-ro':baiChua('Sân và phòng trưng bày Bến Vũng Rô','Chọn “Nhà Trưng Bày” rồi “Vào Trong” để xem các tủ và tranh ảnh trong phòng.'),
    'osm-node-10314905409':[
      dakLak(41,'Cổng đình Lạc Giao','Nhìn từ mặt phố vào cổng và bức tường bao dưới tán cây.'),
      dakLak(39,'Sân trước chính điện','Từ sân lát gạch có thể nhìn bao quát chính điện, dãy nhà bên và cây cổ thụ.'),
      dakLak(35,'Hiên trước chính điện','Góc từ hàng cột nhìn ra sân và quay vào các cánh cửa gỗ.'),
      dakLak(36,'Gian thờ chính','Nhìn quanh bàn thờ, đồ thờ, các hàng cột và bộ binh khí nghi lễ.')
    ],
    'osm-node-1730268393':[
      dakLak(146,'Toàn cảnh Nhà đày Buôn Ma Thuột','Ảnh trên cao cho thấy tường bao và các dãy nhà mái ngói trong khu di tích.'),
      dakLak(147,'Bên trong dãy lao','Ảnh ghi lại không gian trưng bày với các tượng tái hiện sinh hoạt của tù nhân bên sạp nằm.'),
      ...phuYen('Từ cổng vào các dãy lao','nha-day-buon-ma-thuot',446,
        'Bắt đầu ở cổng vàng. Theo các mũi tên trong ảnh để đến sân giữa, các dãy lao, nhà tưởng niệm, phòng trưng bày và khu xà lim.')
    ],
    'biet-dien-bao-dai-bmt':[
      dakLak(5,'Sân và cầu thang biệt điện','Từ sân phía nam nhìn lên hiên vàng giữa hai đầu hồi.'),
      dakLak(6,'Hành lang trên hiên','Từ đầu cầu thang nhìn dọc hiên và qua cửa vào phòng trưng bày.'),
      dakLak(13,'Phòng làm việc','Bàn gỗ đặt dưới chân dung, bên cạnh hai ghế bành và tủ trưng bày.'),
      dakLak(16,'Phòng ngủ','Đứng giữa giường, tủ và các ghế gỗ trong phòng.'),
      dakLak(26,'Hầm rượu','Xuống tầng dưới, có thể nhìn quanh căn hầm và những chiếc ché.')
    ],
    'osm-way-1244769154':[
      dongThap('dongthap/nguyensinhsac','scene_kdtnss-canh-2-30m','Toàn cảnh làng Hòa An','Nhìn từ trên cao xuống khu cây xanh, các mái nhà và ao nước trong khu di tích.'),
      nguyenSinhSac('pano74','Bậc lên vòm mộ','Nhìn gần các bậc đá và mái vòm trắng che nơi an nghỉ của cụ Nguyễn Sinh Sắc.'),
      nguyenSinhSac('pano75','Bên dưới vòm lá sen','Đứng dưới vòm nhìn về phần mộ, bàn thờ và khoảng sân bên ngoài.'),
      nguyenSinhSac('pano14','Cổng vào khu di tích','Góc chụp ngoài đường cho thấy cổng, trạm nhỏ và lối vào dưới hàng cây.'),
      dongThap('dongthap/nguyensinhsac','scene_kdtnss-canh-7','Phòng trưng bày','Nhìn quanh phòng, xem các vật dụng trưng bày và cảnh quan được giới thiệu trên tường.'),
      dongThap('dongthap/nguyensinhsac','scene_kdtnss-canh-13','Nhà gỗ ở làng Hòa An','Điểm chụp bên mái hiên, nơi có thể nhìn dọc vách gỗ và lối đi dưới tán cây.')
    ],
    'osm-node-13518302230':[
      dongThap('dongthap/langhoasadec','scene_lhsd-canh-3-30m','Đường hoa nhìn từ trên cao','Theo trục đường xuyên qua khu trồng hoa, nhìn các nhà vườn ở hai bên.'),
      dongThap('dongthap/langhoasadec','scene_lhsd-canh-15-30m','Luống cây kiểng tán tròn','Nhìn ngang qua những dãy chậu cây được tỉa tán tròn.'),
      dongThap('dongthap/langhoasadec','scene_lhsd-canh-16-30m','Những hàng cây giống','Góc chụp tại vườn cho thấy khoảng cách giữa các hàng cây và lối đi bên luống.'),
      dongThap('dongthap/langhoasadec','scene_lhsd-canh-17-30m','Những luống hoa đang nở','Từ lối giữa vườn nhìn sang các luống hoa màu cam và phần nhà vườn bên kia đường.'),
      dongThap('dongthap/langhoasadec','scene_lhsd-canh-20-30m','Vườn bên Đường Hoa Sa Đéc','Góc từ trên cao ở gần ghim của vườn, nhìn xuống các hàng chậu và mái nhà.')
    ],
    'dong-thap-nam-phuong-linh-tu':[
      dongThap('public/phuongnam','scene_vuonhoasancanh1','Mái đền nhìn từ vườn phía tây','Từ phía tây nhìn qua vườn và mặt nước tới cụm mái của hai ngôi điện.'),
      dongThap('public/phuongnam','scene_vuonhoasancanh2','Sân đền nhìn từ vườn phía đông nam','Góc nhìn chéo qua hàng cây cho thấy mái ngói, sân và những dãy hành lang.')
    ],
    'osm-node-8437362637':[
      dongThap('public/phuongnam','scene_View_flycam_-_t___ng_quan_1','Toàn cảnh khu văn hóa Phương Nam','Từ trên cao nhìn dọc trục qua các sân, dãy hành lang và mái đền.'),
      dongThap('public/phuongnam','scene_View_m___t______t_-_Nh___Chu__ng','Nhà Chuông','Điểm nhìn dưới mái gỗ, cạnh quả chuông và bộ khung treo.'),
      dongThap('public/phuongnam','scene_View_m___t______t_-_Nh___Tr___ng','Nhà Trống','Đứng bên chiếc trống lớn, nhìn qua hàng cột ra ngoài sân.'),
      dongThap('public/phuongnam','scene_View_m___t______t_-_____n_T____Thu','Đàn Tế Thu','Quan sát bậc lên và khoảng sân phía trước đàn.'),
      dongThap('public/phuongnam','scene_View_m___t_____t_nh___c____nam_b____-_Nh___xay_l__a_','Nhà xay lúa','Xem gian nhà mái lá và các dụng cụ đặt bên trong.'),
      dongThap('public/phuongnam','scene_PNam_museum1','Bảo tàng Phương Nam','Góc chụp trong nhà trưng bày hiện vật của khu văn hóa.')
    ],
    'osm-node-8459780109':[
      goThap('Toàn cảnh Gò Tháp','64c1dfd73ac0811fa5dbafcc','Nhìn từ trên cao xuống giồng đất, các mái nhà và đồng ruộng bao quanh khu di tích.'),
      goThap('Nền đền Vishnu ở Gò Tháp Mười','64c7810b3ac0811fa5dbb038','Quan sát phế tích gạch tại điểm khai quật.'),
      goThap('Hiện vật đá văn hóa Óc Eo','64c782223ac0811fa5dbb03a','Xem các khối đá kiến trúc được trưng bày tại di tích.'),
      goThap('Đền thần Mặt Trời phía nam chùa Tháp Linh','64c7d0573ac0811fa5dbb043','Xem nền đền ở phía nam khuôn viên chùa.'),
      goThap('Chánh điện chùa Tháp Linh','64c7d37f3ac0811fa5dbb065','Nhìn quanh không gian thờ Phật trong chánh điện.'),
      goThap('Đền Shiva ở Gò Minh Sư','64c7d0573ac0811fa5dbb047','Xem các lớp gạch còn lại tại Gò Minh Sư.'),
      goThap('Tượng Thiên hộ Võ Duy Dương','64c7d37f3ac0811fa5dbb060','Điểm chụp trong khu đền tưởng niệm nghĩa quân Gò Tháp.'),
      goThap('Chánh điện Miếu Bà Chúa Xứ','64c7d37f3ac0811fa5dbb05e','Xem không gian thờ Bà phía trong tiền điện.')
    ],
    'osm-relation-21425134':[{
      name:'Tham quan trưng bày thường xuyên',url:'https://3d.vnfam.vn/vi',source:'https://3d.vnfam.vn/vi',
      credit:'Bảo tàng Mỹ thuật Việt Nam',scope:'Đi qua các phòng trưng bày trên ba tầng và chọn hiện vật để nghe thuyết minh.'
    }],
    'osm-node-3157796075':[
      {name:'Theo đoàn thám hiểm vào Sơn Đoòng',url:'https://sondoong360.com/?media-name=THE%20ENTRANCE',
        source:'https://edstrom.photo/projects/son-doong-360/',credit:'Martin Edström và đoàn Sơn Đoòng 360 · 2015',
        scope:'Ảnh cầu và âm thanh thu tại hang, từ cửa hang qua dòng sông ngầm tới khu rừng dưới hố sụt.'},
      video('Sơn Đoòng qua ống kính 360°','RLk0M70Rfig','Oxalis Adventure',
        'Phim quay trong hang với lời kể của Hồ Khanh và Howard Limbert.')
    ],
    'osm-node-6358064546':[video('Trong lòng Hang Én','LGjfYE3me0Q','Oxalis Adventure',
      'Phim 360° quay tại Hang Én trong Vườn quốc gia Phong Nha – Kẻ Bàng.')],
    'osm-node-6474418794':haiPhong('Động Trung Trang','Dong-Trung-Trang',
      'Theo cầu thang lên cửa động, nhìn các khoang đá và lối ra trên đảo Cát Bà.'),
    'osm-node-4508895511':haiPhong('Hang Quân Y','Hang-Quan-Y',
      'Từ cửa hang vào hành lang bệnh viện, phòng điều trị và phòng hậu phẫu.'),
    'osm-node-3494799892':haiPhong('Động Hoa Cương','v3/Dong-Hoa-Cuong',
      'Hai nhánh trong động, lối đi bên phải và cầu thang lên nhánh bên trái.'),
    'osm-node-3494827665':haiPhong('Động Thiên Long','v3/Dong-Thien-Long',
      'Nhìn từ cửa động rồi lần theo các điểm chụp trong lòng núi.'),
    'hai-dang-hon-dau':haiPhong('Hải đăng và đảo Hòn Dấu','v2/Dao-Hon-Dau',
      'Chọn “Ngọn Hải Đăng” để ngắm tháp đèn. Các điểm khác đưa tới cảng tàu và rừng trên đảo.'),
    // The tour player matches these media names exactly, including its
    // published combination of precomposed letters and combining tone marks.
    'osm-node-4858968321':[
      ...haiPhong('Toàn cảnh vịnh Lan Hạ','Vinh-Lan-Ha','Nhìn từ trên cao xuống các dải đảo và luồng nước.'),
      ...haiPhong('Làng chài nhìn từ trên cao','Vinh-Lan-Ha','Quan sát các bè nổi giữa những sườn đá.','Flycam La\u0300ng Cha\u0300i'),
      ...haiPhong('Bãi tắm Vạn Bội','Vinh-Lan-Ha','Nhìn từ mép bãi cát ra vịnh.','Ba\u0303i Tă\u0301m Va\u0323n Bô\u0323i'),
      ...haiPhong('Đảo Năm Cát','Vinh-Lan-Ha','Xem cảnh thực địa ở đảo Năm Cát.','Đa\u0309o Năm Ca\u0301t')
    ],
    'osm-node-13388093801':haiPhong('Đảo Cát Dứa (Đảo Khỉ)','Vinh-Lan-Ha','Ảnh cầu trên đảo Cát Dứa.','Đảo Khỉ'),
    'ban-gioc':[{name:'Thác Bản Giốc – Đức Thiên nhìn từ trên cao',url:'https://www.airpano.com/embed.php?3D=detian-falls',
      source:'https://www.airpano.com/360photo/detian-falls/',credit:'Ảnh của Sergey Semenov · AirPano',
      scope:'Ảnh cầu từ trên sông Quây Sơn và các điểm nhìn hai phía thác trên biên giới Việt Nam – Trung Quốc.'}],
    'dray-nur':phuYen('Thác Dray Nur','thac-dray-nur',197,
      'Ngắm dòng thác ở cự ly gần, bãi đá, cầu treo và lối vào hang cạnh thác.'),
    'thac-vuc-hom':phuYen('Thác Vực Hòm','thac-vuc-hom',103,
      'Năm điểm chụp ghi lại toàn cảnh, lòng thác, hai bên vách đá và góc từ trên cao.'),
    'osm-node-10745434207':phuYen('Thác Vực Song','thac-vuc-song',402,
      'Quan sát thác từ giữa lòng suối, từ bờ và từ trên cao.'),
    'osm-node-5841472185':phuYen('Thác Cây Đu','thac-cay-du',333,
      'Đi từ lối vào qua suối tới điểm chụp sát thác.'),
    'ganh-da-dia':phuYen('Gành Đá Đĩa','ganh-da-dia',43,
      'Các điểm chụp trải dọc bãi đá, cả lối phía nam, phía bắc và phần giữa gành.'),
    'hai-dang-dai-lanh':phuYen('Hải đăng Đại Lãnh và Bãi Môn','mui-dien-bai-mon',46,
      'Theo đường lên hải đăng, xem tháp từ phía đông và phía tây rồi nhìn xuống Bãi Môn.'),
    'osm-node-9992439396':[video('Rừng tràm Trà Sư','d1s5-SnOPuQ','NguyenTai1001 Vlog',
      'Phim thực địa 360° giữa vùng rừng tràm ở Tịnh Biên, An Giang.')]
  };
})();

;
// sight-field-views.js
'use strict';
// Open the publisher's interactive capture on demand. The local Mỹ Sơn
// photogrammetry uses the existing glTF loader and needs no third-party viewer.
function createSightFieldViews(onVisit){
  const el=id=>document.getElementById(id),dialog=el('fieldDialog'),stage=el('fieldStage');
  const button=el('fieldView'),plan=el('sitePlan'),caption=el('fieldCaption'),source=el('fieldSource');
  const national='https://images.vietnam.travel/360Tour/';
  const tours=[
    ['HoiAn','Phố cổ Hội An',['pho-co-hoi-an','nha-co-tan-ky','chua-cau']],
    ['Hue','Di tích Cố đô Huế',['di-tich-co-do-hue','ngo-mon','lang-minh-mang']],
    ['PhongNha','Phong Nha – Kẻ Bàng',['phong-nha-ke-bang','phong-nha']],
    ['HaLong','Vịnh Hạ Long',['vinh-ha-long-cat-ba','hon-trong-mai']],
    ['NinhBinh','Danh thắng Ninh Bình',['quan-the-trang-an','ben-thuyen-trang-an']],
    ['DaNang','Đà Nẵng',['cau-rong','chua-tam-thai-ngu-hanh-son']],
    ['NhaTrang2021','Nha Trang',['ponagar']],
    ['DaLat2021','Đà Lạt',['station']],
    ['HaNoi','Hà Nội',['turtle']]
  ];
  const scans={
    'my-son':[
      ['Phế tích Mỹ Sơn','my-son','Robert Szymaniuk','833564ab7c2540b9be6ecefb8bfc2a8a'],
      ['Tháp G4 trước trùng tu · 2019','my-son-g4','Computer Vision and Reverse Engineering Lab','518acfd077b14520bd126dee56cd2dbf']
    ],
    'osm-way-178995262':[['Bên trong đền Ngọc Sơn · 2017','den-ngoc-son','Adam Cigler','cb5b4f68f93b41cf94a6d8e0d2c896a4']]
  };
  const [ruins,g4]=scans['my-son'];
  scans['my-son-nhom-g']=[g4,ruins];
  const cyark={
    'cung-an-dinh':[['Cung An Định','fd6df65eae404a7dbf006f68e7857a2e']],
    'lang-tu-duc':[['Điện Hòa Khiêm','ed319997b5354c1eb9b8dbf810044295'],['Bi đình · từ mặt đất','55b9ce7e35524473bbbe7620102a3811'],['Bi đình · từ trên cao','7194d6083f0142dcb7a047a0082a5d71']]
  };
  let views=[],currentId,dispose=null,generation=0;
  function release(){
    generation++;dispose?.();dispose=null;
    stage.replaceChildren();caption.replaceChildren();
  }
  function select(data,collection){
    const survey=window.VanMieuSurvey,ids=[data.id,collection?.id];
    currentId=data.id;
    plan.hidden=!ids.some(id=>survey.panoramaNodes.has(id));
    views=[];
    const scan=scans[data.id]||scans[data.catalogId]||scans[collection?.id];
    for(const [name,file,author,uid] of scan||[]){
      views.push({name,file:'landmark-scans/'+file+'.glb',credit:author+' · CC BY 4.0',source:'https://sketchfab.com/3d-models/'+uid});
    }
    for(const [name,key] of cyark[data.id]||[])views.push({name,url:'https://sketchfab.com/models/'+key+'/embed',credit:'CyArk · Trung tâm Bảo tồn Di tích Cố đô Huế',source:'https://sketchfab.com/3d-models/'+key});
    for(const v of window.NatureFieldCaptures?.[data.id]||window.NatureFieldCaptures?.[data.catalogId]||[])views.push(v);
    if(!plan.hidden){
      const node=survey.panoramaNodes.get(data.id);
      const url='https://vr360.com.vn/projects/van-mieu-quoc-tu-giam/'+(node?'#node'+node:'');
      views.push({name:node?data.name:'Văn Miếu – Quốc Tử Giám',url,credit:'Ảnh toàn cảnh · VR360',source:url});
    }else{
      const tour=tours.find(([, ,stops])=>ids.some(id=>stops.includes(id)));
      if(tour&&!views.length){
        const url=national+tour[0]+'/index.htm';
        views.push({name:tour[1],url,credit:'Ảnh toàn cảnh · Cục Du lịch Quốc gia Việt Nam',source:url});
      }
    }
    button.hidden=!views.length;
    button.textContent=scan||cyark[data.id]?'Xem bản quét 3D':'Xem cảnh thực 360°';
  }
  function open(title,credit,url){
    release();el('fieldTitle').textContent=title;caption.textContent=credit;source.href=url;
    if(!dialog.open)dialog.showModal();
  }
  async function display(index){
    const v=views[index];open(v.name,[v.credit,v.scope].filter(Boolean).join(' · '),v.source);const token=generation;
    if(v.file){
      const credit=document.createElement('a');credit.href='landmark-scans/CREDITS.txt';credit.target='_blank';credit.rel='noopener';
      credit.textContent='Ghi công bản quét';caption.append(' · ',credit);
    }
    if(views.length>1){
      const select=document.createElement('select');select.setAttribute('aria-label','Chọn cảnh thực địa');
      select.replaceChildren(...views.map((v,i)=>new Option(v.name,i)));select.value=String(index);
      select.onchange=()=>display(Number(select.value));caption.append(' · ',select);
    }
    if(!v.file){
      if(!v.url){
        const link=document.createElement('a');link.href=v.source;link.target='_blank';link.rel='noopener';
        link.textContent='Mở '+v.name;stage.append(link);return;
      }
      const frame=document.createElement('iframe');frame.title=v.name;frame.allowFullscreen=true;
      frame.allow='fullscreen; encrypted-media; gyroscope; accelerometer';frame.src=v.url;stage.append(frame);return;
    }
    const status=document.createElement('p');status.textContent='Đang tải bản quét…';stage.append(status);
    let renderer;
    try{
      const T=window.THREE,gltf=await window.TrafficModels.load.loadAsync(v.file),object=gltf.scene;
      object.traverse(c=>{if(c.isPoints){
        c.material.sizeAttenuation=false;c.material.size=1.8;
        c.material.onBeforeCompile=shader=>{
          shader.vertexShader=shader.vertexShader.replace('#include <fog_vertex>',
            '#include <fog_vertex>\n gl_PointSize=clamp(gl_PointSize,1.2,7.0);');
          shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',
            '#include <clipping_planes_fragment>\n if(dot(gl_PointCoord-0.5,gl_PointCoord-0.5)>.25)discard;');
        };
      }});
      function freeModel(){
        const textures=new Set(),materials=new Set(),geometries=new Set();
        object.traverse(child=>{if(!child.geometry)return;geometries.add(child.geometry);
          for(const m of [].concat(child.material))materials.add(m);});
        for(const m of materials){for(const t of Object.values(m))if(t?.isTexture)textures.add(t);m.dispose();}
        for(const t of textures){t.dispose();t.source?.data?.close?.();}
        for(const g of geometries)g.dispose();
      }
      if(token!==generation){freeModel();return;}
      dispose=freeModel;
      renderer=new T.WebGLRenderer({antialias:true,powerPreference:'low-power'});
      const scene=new T.Scene();scene.background=new T.Color(0x1d2d29);
      scene.add(object,new T.HemisphereLight(0xffffff,0xe3cfad,2));
      const sun=new T.DirectionalLight(0xfff3df,1.1);sun.position.set(2,5,3);scene.add(sun);
      const box=new T.Box3().setFromObject(object),center=box.getCenter(new T.Vector3()),initialCenter=center.clone();
      const radius=box.getBoundingSphere(new T.Sphere()).radius;
      const camera=new T.PerspectiveCamera(41,1,radius*.008,radius*18);
      const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','Xoay bản quét bằng phím mũi tên hoặc kéo tay');
      stage.replaceChildren(canvas);renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
      const pointCloud=v.file.endsWith('/den-ngoc-son.glb'),startZoom=pointCloud ? .59 : .76;
      const eye=box.getSize(new T.Vector3()).multiply(new T.Vector3(.49,.19,.76)).add(box.min);
      let yaw=.96,pitch=.48,zoom=startZoom,inside=false;
      const pointers=new Map();
      function render(){
        if(!canvas.clientWidth||!canvas.clientHeight)return;
        camera.aspect=canvas.clientWidth/canvas.clientHeight;camera.fov=inside?Math.max(38,Math.min(83,zoom*69)):41;
        camera.near=radius*(inside ? .018 : .008);camera.updateProjectionMatrix();
        const angle=Math.atan(Math.tan(camera.fov*Math.PI/360)*Math.min(1,camera.aspect));
        const distance=radius/Math.sin(angle)*zoom;
        const axis=new T.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));
        if(inside){camera.position.copy(eye);camera.lookAt(eye.clone().sub(axis));}
        else{camera.position.copy(center).addScaledVector(axis,distance);camera.lookAt(center);}
        renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);renderer.render(scene,camera);
      }
      function move(dx,dy,factor=1){yaw+=dx;pitch=Math.max(-1.28,Math.min(1.45,pitch+dy));zoom=Math.max(.35,Math.min(2.4,zoom*factor));render();}
      function pan(dx,dy){
        if(inside)return;
        const scale=2*camera.position.distanceTo(center)*Math.tan(camera.fov*Math.PI/360)/canvas.clientHeight;
        center.addScaledVector(new T.Vector3().setFromMatrixColumn(camera.matrixWorld,0),-dx*scale);
        center.addScaledVector(new T.Vector3().setFromMatrixColumn(camera.matrixWorld,1),dy*scale);
      }
      canvas.oncontextmenu=e=>e.preventDefault();
      canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);};
      canvas.onpointermove=e=>{
        const p=pointers.get(e.pointerId);if(!p)return;
        const dx=e.clientX-p[0],dy=e.clientY-p[1];
        if(pointers.size===2){
          const other=[...pointers.entries()].find(([id])=>id!==e.pointerId)[1];
          const prev=Math.hypot(p[0]-other[0],p[1]-other[1]),next=Math.hypot(e.clientX-other[0],e.clientY-other[1]);
          pan(dx*.5,dy*.5);move(0,0,Math.max(1,prev)/Math.max(1,next));
        }else if(e.buttons===2||e.shiftKey){pan(dx,dy);render();}
        else move(-dx*.009,dy*.008);
        pointers.set(e.pointerId,[e.clientX,e.clientY]);
      };
      canvas.onlostpointercapture=e=>pointers.delete(e.pointerId);
      canvas.onwheel=e=>{e.preventDefault();move(0,0,e.deltaY>0?1.1:.91);};
      canvas.onkeydown=e=>{
        const m={ArrowLeft:[-.12,0],ArrowRight:[.12,0],ArrowUp:[0,.1],ArrowDown:[0,-.1],'+':[0,0,.88],'-':[0,0,1.14]}[e.key];
        if(m){e.preventDefault();move(...m);}
      };
      const controls=document.createElement('div');controls.className='scanZoom';
      function pointSize(){
        if(pointCloud)object.traverse(c=>{if(c.isPoints){
          c.material.sizeAttenuation=inside;c.material.size=inside?radius*.0024:1.8;c.material.needsUpdate=true;
        }});
      }
      if(pointCloud){
        const enter=document.createElement('button');enter.type='button';enter.textContent='Trong điện';
        enter.onclick=()=>{inside=true;yaw=.08;pitch=-.12;zoom=1;pointSize();render();};controls.append(enter);
      }
      for(const [label,factor] of [['Phóng to',.8],['Thu nhỏ',1.25]]){
        const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>move(0,0,factor);controls.append(b);
      }
      const reset=document.createElement('button');reset.type='button';reset.textContent='Toàn cảnh';
      reset.onclick=()=>{inside=false;pointSize();center.copy(initialCenter);yaw=.96;pitch=.48;zoom=startZoom;render();};controls.append(reset);
      stage.append(controls);const observer=new ResizeObserver(render);observer.observe(canvas);
      dispose=()=>{observer.disconnect();freeModel();renderer.dispose();renderer.forceContextLoss();};render();
    }catch{
      if(token===generation){release();stage.textContent='Chưa mở được bản quét trên thiết bị này. Bạn có thể xem ở nguồn tư liệu.';}
    }
  }
  function showPlan(){
    const survey=window.VanMieuSurvey;
    open('Văn Miếu – Quốc Tử Giám','Mặt bằng theo OpenStreetMap · Chọn công trình để ngắm','https://vanmieu.gov.vn/vi/introduction/visitor-information');
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
    const g=document.createElementNS(ns,'g');svg.append(g);svg.setAttribute('aria-label','Mặt bằng Văn Miếu, phía bắc ở trên');
    const treeInfo=document.createElement('output');treeInfo.setAttribute('aria-live','polite');
    const [lon,lat]=survey.origin,mx=111320*Math.cos(lat*Math.PI/180);
    const paint={grounds:'#e8dec1',garden:'#c3d8a5',grass:'#a1bd87',courtyard:'#d6bba0',path:'#a99886',water:'#78afaf',well:'#579997',island:'#bcd095',wall:'#8f796d',tree:'#547e52'};
    const order=['grounds','garden','grass','courtyard','water','island','well','path','wall'];
    const features=[...survey.features].sort((a,b)=>(order.includes(a.kind)?order.indexOf(a.kind):10)-(order.includes(b.kind)?order.indexOf(b.kind):10));
    for(const feature of features){
      const {kind,rings}=feature;
      const coords=rings.map(r=>r.map(([x,y])=>[(x-lon)*mx,(lat-y)*110900]));
      const point=coords[0].length===1,shape=document.createElementNS(ns,point?'circle':'path');
      if(point){shape.setAttribute('cx',coords[0][0][0]);shape.setAttribute('cy',coords[0][0][1]);shape.setAttribute('r',kind==='tree'?'2.1':'3.2');}
      else{
        const line=['wall','path'].includes(kind);
        shape.setAttribute('d',coords.map(r=>'M'+r.map(p=>p.join(',')).join('L')+(line?'':'Z')).join(''));
        shape.setAttribute('stroke',line?paint[kind]:'#887964');shape.setAttribute('stroke-width',line?'1.1':'.48');
        shape.setAttribute('fill-rule','evenodd');
      }
      const id=survey.refStops.get(feature.ref);
      shape.setAttribute('fill',kind==='path'||kind==='wall'?'none':id===currentId?'#e67c47':paint[kind]||'#aa7458');
      if(id){shape.style.cursor='pointer';shape.onclick=()=>{dialog.close();onVisit(id);};}
      let title=survey.stopName(feature);
      if(kind==='tree'&&feature.species){
        const species=feature.species.replace(/^vi:/,'').replace(/ \(thực vật\)$/,'');
        title=[species,feature.height?'cao '+feature.height+' m':''].filter(Boolean).join(' · ');
        shape.style.cursor='help';shape.onclick=()=>{treeInfo.textContent=title;};
      }
      if(title){const t=document.createElementNS(ns,'title');t.textContent=title;shape.append(t);}
      g.append(shape);
    }
    const opts=document.createElement('select');opts.setAttribute('aria-label','Ngắm công trình');
    opts.add(new Option('Chọn công trình…',''));
    for(const [ref,id] of survey.refStops){
      if([...opts.options].some(o=>o.value===id))continue;
      opts.add(new Option(survey.stopName(survey.byRef.get(ref)),id));
    }
    opts.onchange=()=>{if(opts.value){dialog.close();onVisit(opts.value);}};
    caption.append(' ',opts,' ',treeInfo);stage.append(svg);
    const b=g.getBBox();
    const labels=[
      ['w702241326','Nhà Thái Học',1],['w702185190','Điện Đại Thành',1],['w702185157','Vườn bia',1],
      ['w37934144','Giếng Thiên Quang',-1],['w702185155','Khuê Văn Các',1],['w702185144','Đại Trung Môn',1],
      ['w1582901993','Vườn Giám',-1],['w702185143','Văn Miếu Môn',1],['r2388849','Hồ Văn',1]
    ];
    for(const [ref,label,side] of labels){
      const ring=survey.byRef.get(ref).rings[0],xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]);
      const x=((Math.min(...xs)+Math.max(...xs))/2-lon)*mx,y=(lat-(Math.min(...ys)+Math.max(...ys))/2)*110900;
      const end=side>0?b.x+b.width+6:b.x-6;
      const line=document.createElementNS(ns,'path');
      line.setAttribute('d','M'+x+','+y+' H'+end);line.setAttribute('stroke','#705f4c');line.setAttribute('stroke-width','.8');
      line.style.pointerEvents='none';svg.append(line);
      const t=document.createElementNS(ns,'text');t.textContent=label;t.setAttribute('x',end+2*side);t.setAttribute('y',y+2);
      t.setAttribute('text-anchor',side>0?'start':'end');t.setAttribute('font-size','7.7');t.setAttribute('fill','#33413a');
      t.style.cursor='pointer';t.onclick=()=>{dialog.close();onVisit(survey.refStops.get(ref));};svg.append(t);
    }
    const extent=svg.getBBox(),width=extent.width+8,height=extent.height+16;
    const homeX=extent.x+extent.width/2,homeY=extent.y+extent.height/2;
    let scale=1,cx=homeX,cy=homeY,drag=null,moved=false;
    function position(){
      const w=width/scale,h=height/scale;
      cx=Math.min(homeX+(width-w)/2,Math.max(homeX-(width-w)/2,cx));
      cy=Math.min(homeY+(height-h)/2,Math.max(homeY-(height-h)/2,cy));
      svg.setAttribute('viewBox',[cx-w/2,cy-h/2,w,h].join(' '));
    }
    function magnify(factor,x=cx,y=cy){
      const next=Math.max(1,Math.min(6,scale*factor));
      cx=x+(cx-x)*scale/next;cy=y+(cy-y)*scale/next;scale=next;position();
    }
    svg.onwheel=e=>{
      e.preventDefault();
      const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
      magnify(e.deltaY>0?.8:1.25,pt.x,pt.y);
    };
    svg.onpointerdown=e=>{moved=false;drag={id:e.pointerId,x:e.clientX,y:e.clientY,cx,cy};};
    svg.onpointermove=e=>{
      if(!drag||drag.id!==e.pointerId||scale===1)return;
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(!moved&&Math.hypot(dx,dy)<5)return;
      moved=true;svg.setPointerCapture(e.pointerId);
      const units=1/svg.getScreenCTM().a;cx=drag.cx-dx*units;cy=drag.cy-dy*units;position();
    };
    svg.onpointerup=svg.onpointercancel=()=>{drag=null;};
    svg.addEventListener('click',e=>{if(moved){e.stopPropagation();moved=false;}},true);
    const zoom=document.createElement('div');zoom.className='scanZoom';
    for(const [label,factor] of [['Phóng to',1.5],['Thu nhỏ',2/3]]){
      const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>magnify(factor);zoom.append(button);
    }
    position();stage.append(zoom);
    const notes=document.createElement('details'),label=document.createElement('summary'),link=document.createElement('a');
    label.textContent='Hai bia Hạ Mã';link.href='https://data.vanmieu.baotangso.com/upload/anpham2024/bia-ha-ma.pdf#page=28';
    link.target='_blank';link.rel='noopener';link.textContent='Sơ đồ hai bia, trang 28 ↗';
    notes.append(label,'Hai bia đứng dọc phố Quốc Tử Giám, hai bên Tứ trụ. Bia phía tây ở đầu giáp Vườn Giám, bia phía đông gần góc phố Văn Miếu. ',link);
    caption.append(notes);
  }
  button.onclick=()=>display(0);plan.onclick=showPlan;
  el('fieldClose').onclick=()=>dialog.close();dialog.addEventListener('close',release);
  dialog.addEventListener('keydown',e=>e.stopPropagation());
  return {select};
}

;
// bach-khoa-grounds.js
'use strict';
// Campus grounds from OpenStreetMap, © OpenStreetMap contributors (ODbL 1.0).
// Paired east/south metres measured from the landmark origin.
// The avenue is mapped as two one-way centrelines leading to one broad
// carriageway at the library plaza. Keys are OSM junctions, stable across tile rebuilds.
const campusRoadWidths=window.VietnamRoadWidths??=new Map();
for(const [halfWidth,nodes] of [
  [3.85,[84832232,8407730170,7984241330]],
  [4.25,[7984241330,1937942184,7984241327,7364293050,7984241325,7702519729,7984241330]],
  [8.6,[7984241325,5684339550,5684339576,7222683784,426927875]]
]){
  for(let i=1;i<nodes.length;i++)
    campusRoadWidths.set(Math.min(nodes[i-1],nodes[i])+':'+Math.max(nodes[i-1],nodes[i]),halfWidth);
}
window.bachKhoaGrounds={
lawns:[
  [36,88,36,94,35,99,59,99,52,88,44,88],
  [109,89,109,94,109,100,85,99,93,89,99,89],
  [-37,-24,-37,-20,-33,-20,-33,-24],
  [-38,-83,-64,-83,-64,-40,-39,-40,-39,-48,-40,-49,-43,-51,-46,-54,-51,-54,-51,-68,-46,-68,-44,-70,-41,-73,-38,-74],
  [-31,-83,-31,-74,-28,-73,-24,-71,-22,-68,-17,-68,-18,-53,-23,-53,-26,-50,-29,-49,-31,-48,-31,-40,-6,-40,-6,-83],
  [-63,-108,-39,-108,-39,-86,-64,-86],
  [-29,-108,-30,-86,-6,-85,-5,-108],
  [-64,-38,-65,-21,-55,-21,-56,-14,-39,-13,-39,-38],
  [-31,-38,-6,-38,-6,-20,-16,-20,-16,-13,-32,-13],
  [-102,-40,-76,-40,-75,-81,-97,-81,-97,-48,-102,-48],
  [-53,-125,-74,-126,-75,-91,-96,-91,-96,-97,-101,-97,-101,-116,-101,-139,-98,-139,-98,-143,-68,-143,-53,-143],
  [-22,-125,22,-125,22,-136,13,-136,13,-142,-6,-142,-22,-142],
  [-102,-36,-76,-36,-76,-10,-84,-10,-84,-23,-102,-23],
  [-156,-72,-156,-57,-162,-57,-162,-72],
  [-154,-72,-154,-57,-136,-57,-136,-72],
  [-169,-72,-169,-57,-164,-57,-163,-72],
  [-169,-54,-170,-32,-157,-32,-157,-54],
  [-154,-54,-140,-54,-140,-31,-155,-31],
  [-136,-36,-137,-24,-110,-24,-110,-36],
  [-168,-115,-163,-115,-163,-99,-169,-99],
  [-162,-115,-155,-114,-155,-99,-162,-99],
  [-154,-114,-135,-114,-136,-98,-154,-99],
  [7,-90,7,-78,21,-78,21,-90],
  [7,-75,7,-63,21,-63,21,-75],
  [7,-47,7,-35,20,-35,21,-46],
  [7,-31,7,-19,20,-19,21,-31],
  [-80,-194,-78,-191,-76,-188,-73,-186,-71,-185,-65,-183,-60,-182,-4,-184,1,-185,3,-186,5,-188,6,-192,6,-198,4,-198],
  [-25,-160,41,-159,52,-159,52,-155,-25,-156],
  [-47,-160,-47,-156,-114,-156,-114,-160,-92,-160],
  [131,158,131,167,143,167,143,158],
  [76,33,76,39,89,40,89,33],
  [29,52,48,52,91,53,91,43,30,43],
  [32,33,32,39,45,39,45,33],
  [49,33,49,39,74,39,74,33],
  [0,42,5,42,6,44,8,45,10,46,12,46,14,46,16,45,17,43,25,43,25,52,6,52],
  [13,43,14,42,14,41,14,40,14,39,13,38,13,38,12,37,11,37,10,38,9,38,8,39,8,40,8,41,8,42,9,43,10,43,11,44,12,44],
  [-5,2,-18,1,-20,2,-20,3,-20,5,-2,38,6,38,7,37,8,36,10,35,12,35,14,35,15,36,16,38,16,38,26,39,26,34,22,34,1,34,2,20,-5,20,-5,5],
  [95,49,94,55,115,55,115,49],
  [-83,50,-82,48,-55,23,-54,22,-49,22,-48,23,-10,48,-10,51],
  [30,-124,52,-124,52,-138,30,-138,30,-136],
  [-107,163,-107,167,-98,167,-98,163],
  [136,-4,136,-1,143,-1,143,-4],
  [146,-4,146,-1,156,-1,156,-4],
  [158,-4,158,-1,165,-1,165,-4],
  [136,-15,136,-12,143,-12,143,-15],
  [146,-15,146,-12,156,-12,156,-15],
  [158,-15,158,-12,165,-12,165,-15],
  [136,21,136,24,143,24,143,21],
  [146,21,146,24,156,24,156,21],
  [158,21,158,24,165,24,165,21],
  [158,31,158,34,165,34,165,31],
  [146,31,146,34,156,34,156,31],
  [136,31,136,34,143,34,143,31],
  [127,36,130,36,130,55,127,55],
  [128,-1,131,-1,130,20,128,20],
  [128,-44,145,-44,145,-41,131,-41,131,-15,128,-15],
  [148,-41,148,-44,194,-44,194,-41]
],
plazas:[
  [-53,-143,-53,-125,-37,-125,-22,-125,-22,-142,-28,-142,-28,-139,-36,-139,-46,-139,-46,-143],
  [-101,-97,-96,-97,-96,-91,-75,-91,-75,-86,-75,-81,-97,-81,-97,-48,-102,-48,-102,-62,-101,-86],
  [120,154,121,90,121,86,122,84,123,82,124,81,126,80,198,81,198,82,197,96,194,96,194,92,191,92,180,92,180,96,158,95,136,95,136,93,136,90,125,90,125,111,124,138,124,154,122,154],
  [113,42,118,42,119,42,120,28,120,4,118,4,114,3,114,20],
  [112,-3,118,-3,120,-3,121,-8,121,-44,119,-44,116,-44,116,-17,110,-17,110,-9,113,-9],
  [-113,83,-114,124,-114,155,-113,155,-111,156,-111,143,-110,108,-77,108,-77,98,-80,98,-80,100,-111,100,-111,83,-112,83],
  [-76,-10,-76,-2,-70,-2,-58,-2,-57,-2,-56,-2,-56,-1,-56,1,-56,3,-107,2,-178,1,-178,-1,-178,-26,-176,-26,-175,-26,-175,-5,-158,-5,-158,-11,-106,-10,-84,-10],
  [-102,-40,-102,-38,-102,-36,-76,-36,-76,-38,-76,-40],
  [148,56,148,61,148,62,194,62,194,62,194,56,172,56],
  [148,-41,148,-39,148,-36,194,-36,194,-38,194,-41]
],
paths:[
  [-181,-1,-178,-1,-177,-1,-107,0,-70,0],
  [-182,-189,-188,-194,-192,-200],
  [148,61,194,62,200,62,213,62,217,62,218,61,219,60,219,56,220,27,220,-18,220,-46,219,-52,218,-57,215,-61,182,-96,170,-108,159,-117,150,-124,143,-129,136,-134,116,-144,95,-156,80,-163,75,-167,68,-172,59,-178,51,-185,46,-190,43,-196,40,-201,39,-203,37,-206,34,-207,31,-208],
  [-182,-189,-176,-193,-168,-196,-158,-198,-84,-199,-49,-199,-27,-201,-2,-203,11,-205,31,-208],
  [121,186,122,176,122,158,122,156,122,154,123,90,123,87,124,85,127,82,130,81,198,82],
  [217,62,217,68,217,77,217,82],
  [-69,-85,-66,-85,-65,-85,-64,-85,-34,-84,-6,-84,-4,-84,-2,-84,0,-84],
  [-34,-120,-34,-115,-34,-112,-34,-108,-34,-84,-34,-72],
  [-25,-67,-27,-70,-31,-72,-34,-72,-38,-72,-41,-70,-44,-68,-45,-64,-46,-61,-45,-58,-43,-55,-40,-52,-37,-51,-35,-50,-34,-50,-30,-51,-27,-53,-24,-56,-23,-60,-24,-64],
  [-35,-50,-35,-39,-35,-31],
  [-38,-19,-35,-13,-32,-19],
  [-32,-24,-35,-31,-38,-24],
  [-32,-19,-32,-24],
  [-38,-24,-38,-19],
  [-35,-13,-35,-12,-35,-10,-36,-4],
  [-70,-39,-66,-39,-66,-39,-64,-39,-35,-39,-6,-39,-4,-39,-3,-39,0,-39],
  [99,83,99,89,99,94,109,94,111,95],
  [32,93,36,94,44,94,44,88,44,83],
  [111,90,113,90,117,90,121,90,123,90],
  [32,90,30,90,27,90,23,90,21,90],
  [-36,-139,-37,-129],
  [-37,-125,-37,-124,-37,-120],
  [-96,-86,-75,-86,-74,-86,-69,-86],
  [-102,-38,-76,-38,-74,-38,-70,-38],
  [-139,-39,-109,-38],
  [-6,-142,-7,-124,-7,-120],
  [-68,-121,-68,-124,-68,-143],
  [-136,-55,-139,-55,-156,-56,-159,-56,-163,-56,-171,-56],
  [-139,-55,-139,-39,-139,-29,-139,-23],
  [-175,-29,-156,-29,-139,-29],
  [-156,-29,-156,-56,-155,-72],
  [-163,-72,-163,-56],
  [-136,-85,-155,-85,-162,-85,-169,-85,-170,-85],
  [-135,-115,-154,-116,-162,-116,-170,-116,-171,-116,-173,-116],
  [-163,-72,-162,-85,-162,-99,-162,-116],
  [-155,-72,-155,-85,-155,-99,-154,-116],
  [23,-33,4,-33,0,-33],
  [22,-76,4,-76,0,-76],
  [-195,73,-192,73,-116,74,-113,74],
  [31,121,32,104,32,93,32,90,32,87,33,85,34,83,37,83,44,83,73,83,99,83,108,84,111,84,111,86,111,90,111,95,111,105,110,126],
  [32,104,72,105],
  [73,83,72,105],
  [-42,76,10,77,13,78,16,80,18,82,20,84,21,88,21,90,20,134,20,137],
  [-117,170,-115,170,-113,170,-50,172,-45,172],
  [-84,-181,-71,-190,-43,-190,-21,-190,-2,-190,11,-181],
  [-43,-190,-44,-173],
  [-21,-190,-21,-172],
  [27,34,27,40,27,56],
  [6,55,8,56,10,56,27,56,45,56],
  [16,40,27,40,47,41,75,41,93,41],
  [93,46,118,46],
  [93,41,93,46,93,57],
  [75,41,75,32],
  [47,41,47,32],
  [93,57,116,57,117,57,117,56],
  [11,45,12,45,14,44,15,43,15,42,16,40,15,39,14,38,13,37,12,36,10,36,9,37,8,38,7,39,7,40,7,42,7,43,8,44,10,45],
  [7,40,-1,40,-3,40],
  [198,82,206,82,213,82],
  [213,82,216,82,217,82,218,82,219,83],
  [-70,0,-57,1,-56,1,-55,2,-54,3,-54,10,-54,12,-55,12,-57,14,-72,27,-84,38,-97,50,-99,52,-100,53,-102,54,-103,54,-105,55,-181,54,-194,54],
  [-86,54,-42,54,-7,54,-5,53,-5,51,-5,51,-6,50,-8,47,-42,24,-45,22,-45,15,-45,14,-46,14,-48,13,-49,14,-50,14,-57,21,-87,48,-88,50,-88,52,-88,52,-88,53],
  [-99,52,-95,52,-91,52,-88,52],
  [22,1,4,1,-20,0,-21,1,-22,2,-23,3,-22,5,-21,8,-3,40,3,51,4,53,6,55],
  [-5,51,-3,51,-1,51,2,51,3,51],
  [6,-111,5,-110,5,-109,4,-76,4,-33,4,1],
  [145,-39,132,-39,132,-8,131,28,131,55,131,57,132,59,133,60],
  [118,4,118,28,118,42,118,46],
  [118,46,118,55,118,56,117,56],
  [118,55,119,55,123,55,127,55,131,55],
  [119,-44,118,-8,118,-3],
  [118,-3,118,0,118,4],
  [30,-112,108,-112,110,-112],
  [6,-111,7,-112,8,-112,22,-112],
  [-66,-14,-66,-13,-65,-12,-63,-12,-35,-12,-6,-12,-5,-12,-4,-13,-4,-39,-4,-84,-3,-107,-3,-108,-4,-109,-4,-111,-5,-112,-6,-112,-34,-112,-63,-113,-64,-112,-64,-112,-64,-111,-65,-85,-66,-39],
  [56,-165,56,-120],
  [72,105,111,105],
  [33,-33,40,-33],
  [119,-48,119,-46,119,-44],
  [119,-48,120,-82,119,-87,119,-89,118,-94,116,-100,113,-106,110,-112],
  [110,-112,110,-113,106,-119,103,-124,96,-134,91,-141,88,-145,84,-147],
  [-112,74,-112,83,-113,155,-113,170],
  [-113,74,-112,74,-48,76],
  [-48,76,-48,76,-45,76,-42,76,-42,76],
  [-70,-5,-70,-2,-70,0],
  [-177,-1,-176,-26,-175,-29,-171,-36,-171,-56,-170,-85,-170,-116],
  [-42,213,-40,214,-38,214,14,218,16,217,17,216,19,216,20,214,21,213,22,211],
  [133,60,134,61,144,61],
  [144,61,146,61,148,61],
  [132,-8,144,-8,157,-8,171,-8],
  [144,-16,144,-8,144,0],
  [157,-16,157,-8,157,0],
  [131,28,144,28,157,28,171,28],
  [144,19,144,28,144,36],
  [157,19,157,28,157,36],
  [132,-8,128,-8,124,-8,121,-8,118,-8],
  [131,28,128,28,123,28,120,28,118,28],
  [194,-38,148,-39],
  [148,-39,147,-39,145,-39],
  [-50,172,-48,76],
  [-43,127,-42,76],
  [-211,32,-202,32,-194,32]
],
treeRows:[
  [89,97,102,92,41,91,54,96,104,110,39,108,131,86,196,86,-22,-69,-22,-51],
  [-16,-60,-47,-69,-53,-60,-47,-51,-60,-105,-52,-17,-41,-16,-61,-23,-49,-35,-28,-16],
  [-18,-16,-9,-23,-29,-24,-28,-35,-17,-35,-60,-46,-8,-36,-9,-78,-8,-49,-61,-57],
  [-8,-104,-54,-131,-19,-130,-84,-102,-84,-68,-84,-46,-11,-129,13,-129,-3,-129,-89,-130],
  [-79,-130,-65,-130,-92,-55,-92,-65,-92,-74,-92,-46,-159,-64,-145,-64,-160,-49,-145,-50],
  [-144,-34,-172,-34,-132,-26,-120,-26,-126,-33,-94,-120,-94,-110,-95,-101,-77,-122,-78,-109],
  [-78,-53,-78,-62,-182,-38,-184,-56,-184,-73,-182,-94,-156,-74,-157,-96,-166,-106,-159,-109],
  [-145,-107,-146,-97,-168,-118,-139,-118,-155,-118,-147,-118,5,-101,10,-108,18,-114,5,-90],
  [5,-79,5,-71,13,-45,19,-40,19,-25,19,-86,19,-68,-188,58,-157,77,-140,77],
  [-130,78,-122,78,-169,57,-4,58,-14,57,-23,57,-41,57,-51,57,-60,57,-70,57],
  [-79,56,-89,56,-80,-32,-80,-17,-80,-7,-80,2,-70,2,-57,3,-140,-4,-132,-4],
  [-127,-119,-111,-120,-120,-131,-166,-131,-158,-141,-149,-148,-154,-188,-144,-167,-181,-163,-181,-174],
  [-177,-183,-183,-118,-178,-129,-127,8,-112,8,-143,7,-152,7,-161,7,-170,7,-172,20],
  [-112,21,-120,21,-129,20,-138,20,-156,20,-170,32,-146,32,-158,32,-94,20,-82,20],
  [-131,32,-123,32,-114,32,-87,33,-96,33,-99,44,-172,43,-112,44,-160,43,-147,44],
  [-136,44,-124,44,4,-1,17,0,-2,4,-8,23,-15,11,-5,30,-1,37,-40,79],
  [-30,80,-20,80,-10,80,0,81,12,129,14,122,-10,117,-10,104,-6,96,15,98],
  [14,84,-5,127,-109,78,-94,78,-85,78,-186,77,-70,79,-55,79,-53,-158,-65,-158],
  [-76,-158,-86,-158,-96,-158,-20,-158,6,-157,26,-157,39,-157,50,-157,16,-157,-69,-187],
  [-45,-187,-59,-187,-1,-187,-23,-187,-36,-187,-14,-187,-74,-193,5,-195,-30,-194,-21,-195],
  [-12,-195,-40,-194,-52,-194,131,176,14,58,37,58,79,37,35,36,52,36,61,36],
  [70,36,18,44,5,44,24,36,16,36,32,44,44,45,89,45,49,51,66,51],
  [75,51,95,59,117,59,104,52,118,44,118,35,118,26,142,86,152,86,160,86],
  [169,86,177,86,127,114,141,113,174,112,157,123,143,122,175,137,167,132,127,122],
  [127,134,58,-84,118,-84,102,-84,94,-84,85,-84,77,-84,68,-84,49,-130,39,-130],
  [40,4,40,13,51,16,62,-38,48,-40,48,-32,55,-20,42,-20,36,-26,40,-67],
  [54,-67,86,-67,100,-66,109,-67,119,-67,40,-86,36,-108,49,-108,74,-108,83,-108],
  [93,-108,89,-131,60,-152,89,-140,111,-93,107,-108,119,-59,118,-50,118,17,107,18],
  [107,9,118,9,118,-14,118,-26,118,-35,101,-40,112,-41,21,180,20,201,-68,213],
  [-60,213,-52,213,-32,216,-22,218,-14,218,-5,219,6,220,18,219,-55,174,-81,165],
  [-89,165,-99,164,-103,176,-47,17,-42,26,-32,33,-22,40,-12,46,-71,36,-77,41],
  [193,60,184,60,130,60,141,60,150,60,160,60,130,-16,130,-30,129,37,129,0],
  [129,12,129,20,139,-13,139,-2,161,-13,161,-3,139,22,139,33,162,22,162,33],
  [148,23,153,34,153,-13,153,-2,171,-42,184,-42,130,-42,141,-42,151,-42,23,155]
]
};

;
// sights-bach-khoa.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[0].sites);

;
// sights-natural.js
'use strict';
(()=>{
  let rockScan;
  function stoneMaterial(T,basalt=false){
    if(!rockScan){
      rockScan=new T.TextureLoader().load('streetscape/surfaces/cut-rock-color.webp');
      rockScan.colorSpace=T.SRGBColorSpace;
      rockScan.wrapS=rockScan.wrapT=T.RepeatWrapping;
      rockScan.anisotropy=4;rockScan.userData.sightShared=true;
    }
    const material=new T.MeshStandardMaterial({vertexColors:true,map:rockScan,roughness:.94});
    material.customProgramCacheKey=()=>basalt?'jointed-basalt':'weathered-granite';
    material.onBeforeCompile=shader=>{
      const varying='varying vec3 rockPoint,rockNormal;\n';
      shader.vertexShader=varying+(basalt?'attribute float shaft;varying float jointAxis;\n':'')+
        shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nrockPoint=position; rockNormal=normal;'+(basalt?'jointAxis=shaft;':''));
      shader.fragmentShader=varying+(basalt?'varying float jointAxis;\n':'')+
        shader.fragmentShader.replace('#include <map_fragment>',`
          vec3 weights=pow(abs(normalize(rockNormal)),vec3(4.));
          weights/=max(.001,weights.x+weights.y+weights.z);
          vec3 p=rockPoint*.41;
          vec3 mineral=texture2D(map,p.zy).rgb*weights.x+texture2D(map,p.xz).rgb*weights.y+texture2D(map,p.xy).rgb*weights.z;
          float grains=dot(mineral,vec3(.21,.72,.07));
          float wash=texture2D(map,vec2((rockPoint.x+rockPoint.z*.63)*.22,rockPoint.y*.032)).g;
          float fracture=texture2D(map,rockPoint.xy*.067+rockPoint.zz*vec2(.09,.042)).g;
          diffuseColor.rgb*=clamp(.48+grains*6.2,.50,1.69);
          ${basalt?`
            float phase=jointAxis/.28+.26*wash+.11*sin(dot(rockPoint,vec3(2.1,.3,1.3)));
            float cut=1.-smoothstep(.012,.10+fwidth(phase),abs(fract(phase)-.5));
            cut*=1.-smoothstep(.16,.70,fwidth(phase));
            diffuseColor.rgb*=1.-.30*cut;
            diffuseColor.rgb*=mix(.58,1.,smoothstep(.35,1.6,rockPoint.y+wash));
          `:`
            float streak=smoothstep(.046,.092,wash)*smoothstep(.18,.60,1.-abs(rockNormal.y));
            diffuseColor.rgb*=mix(vec3(.75,.79,.82),vec3(1.17,1.05,.91),smoothstep(.041,.09,fracture));
            float seam=(1.-smoothstep(.0009,.0036+fwidth(fracture),abs(fracture-.068)))*(1.-smoothstep(.003,.013,fwidth(fracture)));
            diffuseColor.rgb*=1.-.25*seam;
            diffuseColor.rgb*=mix(vec3(1.),vec3(.35,.39,.42),streak*.93);
          `}`)
        .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
          // Screen-space derivatives of the filtered scan yield relief on all three axes.
          vec3 dpdx=dFdx(-vViewPosition),dpdy=dFdy(-vViewPosition);
          vec3 tx=cross(dpdy,normal),ty=cross(normal,dpdx);
          float det=dot(dpdx,tx);
          normal=normalize(normal-sign(det)*.023*(dFdx(grains)*tx+dFdy(grains)*ty)/max(.000001,abs(det)));
        `)
        .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
          roughnessFactor=clamp(roughnessFactor+grains*.23-${basalt?'.33*(1.-smoothstep(.35,1.7,rockPoint.y+wash))':'.08'},.46,1.);`);
    };
    return material;
  }

  window.createSightStoneMaterial=stoneMaterial;

  function granite(T,group,random){
    const xyz=[],rgb=[],indices=[];
    function stone(x,y,z,rx,ry,rz,color,turn=0,lean=0,hand=false,taper=0){
      const c=Math.cos(turn),s=Math.sin(turn),seed=random()*6.28;
      const steps=hand?44:Math.max(rx,ry,rz)>4?14:7,vertices=new Map(),tone=new T.Color(color);
      // Project a welded cube grid onto a rounded, sheared block. On the face
      // with the palm print this leaves enough vertices to cut five separate pits.
      function sample(a,b,d){
        const key=((a+steps)*(2*steps+1)+b+steps)*(2*steps+1)+d+steps;
        if(vertices.has(key))return vertices.get(key);
        const length=Math.pow(Math.abs(a)**3+Math.abs(b)**3+Math.abs(d)**3,1/3);
        const u=a/length,v=b/length,w=d/length;
        const corner=u*v*.08+w*v*.11+Math.sin(u*2.8+w*2.2+seed)*.065;
        const joint=u*.47-v*.65+w*.40+.14*Math.sin(w*3+seed);
        const fracture=.023*Math.exp(-joint*joint*730);
        const shell=1+corner+.035*Math.sin(5*v+seed)*Math.cos(4*w-u)-fracture;
        let hollow=0;
        if(hand&&d===steps){
          const palm=((u+.05)/.34)**2+((v+.24)/.43)**2;
          hollow=.24*Math.exp(-palm*palm);
          for(const [finger,tip] of [[-.34,.07],[-.21,.28],[-.06,.39],[.10,.35],[.24,.23]]){
            const radius=((u-finger-.08*v)/.10)**2+((v-tip)/.26)**2;
            hollow+=.13*Math.exp(-radius*radius);
          }
        }
        const heel=hand?.85+.15*(1-Math.abs(v)):1-taper*Math.max(0,v+.15);
        const px=u*rx*shell*heel+v*lean,pz=(w*shell*heel-hollow)*rz;
        const crest=hand?Math.max(0,v)*(-.21*u+.073*Math.cos(w*3)):.065*u;
        const id=xyz.length/3;vertices.set(key,id);
        xyz.push(x+c*px+s*pz,y+ry*(v*shell+crest-.035*w),z+c*pz-s*px);
        const shade=.91+.08*w-.11*Math.exp(-joint*joint*110)-hollow*.72+.07*Math.sin(v*2.7+seed);
        rgb.push(tone.r*shade,tone.g*shade,tone.b*shade);return id;
      }
      for(const side of [-1,1])for(let axis=0;axis<3;axis++){
        const face=(i,j)=>{
          const point=[0,0,0];
          point[axis]=side*steps;point[(axis+1)%3]=side*i;point[(axis+2)%3]=j;
          return sample(...point);
        };
        for(let j=-steps;j<steps;j+=2)for(let i=-steps;i<steps;i+=2){
          const a=face(i,j),b=face(i+2,j),c=face(i+2,j+2),d=face(i,j+2);
          indices.push(a,b,d,b,c,d);
        }
      }
    }
    function finish(){
      const geo=new T.BufferGeometry();geo.setIndex(indices);
      geo.setAttribute('position',new T.Float32BufferAttribute(xyz,3));
      geo.setAttribute('color',new T.Float32BufferAttribute(rgb,3));geo.computeVertexNormals();
      const mesh=new T.Mesh(geo,stoneMaterial(T));mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
    }
    return {stone,finish};
  }
  window.createSightGranite=granite;

  (window.VietnamSights??=[]).push({
    id:'hon-chong',name:'Hòn Chồng',city:'Nha Trang',lon:109.2066,lat:12.2728,start:[109.2058,12.27203],yaw:-2.28,width:46,depth:29,gardenRadius:45,solids:[],
    photo:'https://tcdulichtphcm.vn/du-khao/ra-hon-chong-xem-dau-tay-khong-lo-bi-an-in-tren-vach-da-c14a59017.html',source:'https://nhatrangguide.vn/vi/canh-dep/hon-chong',
    build(T,{group,random}){
      const {stone,finish}=granite(T,group,random);
      stone(-8,-.65,1,10.8,2.7,6.5,0x978174,-.18);
      stone(7,-.55,-3,10.9,3.0,7.1,0xab927d,.11);
      stone(1,1.85,-1,6.4,1.45,4.7,0x9d8275,.24);
      stone(1.65,6.19,-1.2,3.64,3.42,2.95,0xcdad81,.12,-.51,true);
      // A smaller wedged block spans the slot between two shore boulders.
      stone(-9.8,2.1,2.3,3.75,2.43,3.15,0xa69687,-.21,.39);
      stone(-4.4,2.2,3.7,1.85,2.27,2.43,0x977b66,.44,-.24);
      stone(-6.45,3.37,3.5,1.42,.87,1.26,0xb49a77,.35,.21);
      for(let i=0;i<31;i++){
        const a=i*2.4,r=.72+random()*.30,size=.63+random()**1.45*2.55;
        stone(20*Math.cos(a)*r,-.36+random()*.82,11*Math.sin(a)*r,size*(.9+random()*.5),
          size*(.39+random()*.46),size*(.65+random()*.43),i%3?0xb09a87:0x927d74,a,.18*size);
      }
      finish();
    }
  },{
    id:'da-ba-chong',name:'Đá Ba Chồng',city:'Định Quán',lon:107.3484,lat:11.19079,start:[107.34889,11.19018],yaw:1.0,width:31,depth:23,gardenRadius:26,solids:[[0,0,8,6]],
    photo:'https://commons.wikimedia.org/wiki/File:%C4%90%C3%A1_Ba_Ch%E1%BB%93ng_in_%C4%90%E1%BB%8Bnh_Qu%C3%A1n.jpg',source:'https://hvhnt.dongnai.gov.vn/Pages/newsdetail.aspx?CatId=100&NewsId=4620',
    build(T,{group,random}){
      const {stone,finish}=granite(T,group,random);
      stone(-.9,4.3,.3,14.8,8.9,10.6,0x857f75,-.17,1.7);
      stone(1.5,18.5,-.6,9.7,7.6,7.7,0x968b81,.23,-1.25);
      stone(-2.4,30.,-.5,8.3,6.45,6.6,0x9e9388,-.33,-1.70);
      stone(-7.7,.1,3,3.3,1.65,2.48,0x938571,.23);
      finish();
    }
  });
})();

// Local OSM coastline polygons, cropped around the two coastal viewpoints.
window.VietnamSightCoasts=[{"lon":109.29363,"lat":13.35419,"holes":[[[109.294888,13.35985],[109.294858,13.359763],[109.294903,13.359727],[109.294903,13.359494],[109.294981,13.359341],[109.295075,13.359084],[109.295127,13.359138],[109.295097,13.359222],[109.29512,13.359341],[109.295064,13.359476],[109.295004,13.359523],[109.294989,13.359654],[109.295015,13.359698],[109.295004,13.359756],[109.294888,13.35985]],[[109.29414,13.364703],[109.294098,13.364605],[109.294182,13.364463],[109.294244,13.364399],[109.294355,13.364371],[109.294358,13.364444],[109.294322,13.364507],[109.294224,13.364557],[109.294189,13.364649],[109.29414,13.364703]],[[109.296583,13.356585],[109.296492,13.356475],[109.296509,13.356276],[109.296647,13.355962],[109.296696,13.355921],[109.296724,13.356019],[109.296775,13.35606],[109.296805,13.356],[109.296839,13.356084],[109.29683,13.356355],[109.296773,13.356374],[109.296815,13.356427],[109.29682,13.35649],[109.296766,13.356576],[109.296738,13.356669],[109.296694,13.356662],[109.296583,13.356585]],[[109.29565,13.35801],[109.295646,13.357926],[109.295706,13.357712],[109.295728,13.357527],[109.295713,13.357476],[109.29574,13.35741],[109.295728,13.357301],[109.29577,13.357257],[109.295859,13.357333],[109.295886,13.357393],[109.295874,13.357453],[109.29577,13.357546],[109.295736,13.357738],[109.295751,13.357812],[109.295832,13.357908],[109.295829,13.357942],[109.295793,13.357978],[109.295753,13.357978],[109.295723,13.357942],[109.295726,13.357995],[109.295699,13.358023],[109.29565,13.35801]],[[109.29475,13.354143],[109.294737,13.354076],[109.294752,13.353936],[109.294775,13.353905],[109.294816,13.353901],[109.294866,13.353981],[109.294851,13.354045],[109.294776,13.354159],[109.29475,13.354143]],[[109.294956,13.354318],[109.294922,13.35427],[109.294933,13.354181],[109.294997,13.35413],[109.295051,13.354132],[109.295079,13.354178],[109.295066,13.35427],[109.294991,13.354328],[109.294956,13.354318]],[[109.296474,13.357933],[109.296489,13.357845],[109.296547,13.357788],[109.296594,13.357845],[109.296583,13.357887],[109.296502,13.357937],[109.296474,13.357933]],[[109.296646,13.358632],[109.296637,13.358584],[109.296659,13.3585],[109.296682,13.358488],[109.296693,13.35858],[109.296646,13.358632]]],"ring":[[109.292301,13.36519],[109.30463,13.36519],[109.30463,13.34319],[109.294615,13.34319],[109.294558,13.343379],[109.294422,13.343505],[109.2945,13.343701],[109.294494,13.343828],[109.294415,13.343935],[109.294389,13.344075],[109.294194,13.343879],[109.29396,13.343746],[109.293817,13.343758],[109.293824,13.34386],[109.294103,13.344068],[109.294123,13.344176],[109.293898,13.344072],[109.293863,13.344265],[109.293596,13.34422],[109.293843,13.344404],[109.293811,13.344492],[109.293739,13.344543],[109.29355,13.344568],[109.293362,13.344486],[109.293127,13.344581],[109.292705,13.345081],[109.292581,13.345189],[109.292067,13.345942],[109.29169,13.346606],[109.291469,13.347075],[109.291378,13.347328],[109.291303,13.34764],[109.290986,13.349407],[109.290801,13.350142],[109.290737,13.351102],[109.290771,13.351889],[109.290879,13.352405],[109.291012,13.352717],[109.291482,13.353573],[109.292402,13.354109],[109.292834,13.354255],[109.293018,13.354273],[109.293232,13.354246],[109.293298,13.354209],[109.2934,13.354002],[109.293422,13.35399],[109.293472,13.354029],[109.293518,13.353984],[109.293554,13.353981],[109.293591,13.354009],[109.29362,13.354],[109.293627,13.353966],[109.293701,13.353907],[109.293753,13.353902],[109.29378,13.353918],[109.293779,13.353959],[109.293709,13.354067],[109.293729,13.35412],[109.293762,13.354124],[109.293789,13.354072],[109.293926,13.354013],[109.293964,13.353956],[109.293993,13.354004],[109.293969,13.354074],[109.294009,13.354114],[109.294017,13.354175],[109.293982,13.354285],[109.29383,13.354343],[109.293814,13.35438],[109.293872,13.354471],[109.29391,13.354486],[109.293943,13.354442],[109.293972,13.354451],[109.293944,13.354494],[109.293962,13.354538],[109.29401,13.354498],[109.294049,13.354511],[109.294094,13.354561],[109.294157,13.354577],[109.294167,13.354538],[109.294194,13.354519],[109.294268,13.354583],[109.294294,13.35454],[109.294346,13.354566],[109.294417,13.354662],[109.294468,13.354659],[109.294602,13.354563],[109.294678,13.354609],[109.294707,13.35469],[109.294671,13.354814],[109.294717,13.354876],[109.294868,13.354903],[109.295021,13.354852],[109.295144,13.354838],[109.295193,13.35488],[109.295283,13.354696],[109.295397,13.354634],[109.295433,13.35467],[109.295444,13.354862],[109.295388,13.355079],[109.295489,13.354987],[109.295525,13.354816],[109.29557,13.354789],[109.29562,13.354797],[109.29548,13.355204],[109.295671,13.35501],[109.295688,13.35506],[109.295789,13.355012],[109.295783,13.355119],[109.29574,13.355196],[109.295633,13.355225],[109.295601,13.355288],[109.29556,13.35548],[109.295588,13.35559],[109.295724,13.355717],[109.295894,13.355772],[109.296002,13.355722],[109.296013,13.355954],[109.296217,13.355596],[109.29633,13.35575],[109.296438,13.356317],[109.296313,13.356659],[109.296239,13.356742],[109.296166,13.356725],[109.296109,13.356494],[109.29599,13.356554],[109.295934,13.356698],[109.29582,13.356637],[109.295775,13.357012],[109.295752,13.356907],[109.295673,13.357061],[109.295599,13.357375],[109.295435,13.35753],[109.295237,13.357485],[109.295231,13.35759],[109.295079,13.35759],[109.294954,13.357623],[109.295079,13.357755],[109.295067,13.357937],[109.294931,13.357926],[109.294875,13.358113],[109.294733,13.358158],[109.294552,13.358538],[109.294439,13.35851],[109.294529,13.358984],[109.294654,13.359072],[109.294665,13.359199],[109.294648,13.359381],[109.294733,13.35953],[109.294773,13.359673],[109.294733,13.359855],[109.294665,13.360042],[109.294416,13.360174],[109.294173,13.360653],[109.29402,13.360835],[109.293878,13.360907],[109.293889,13.361215],[109.293867,13.361507],[109.293612,13.361816],[109.293889,13.361783],[109.293855,13.361915],[109.293872,13.362014],[109.294059,13.362141],[109.294025,13.36224],[109.293759,13.362499],[109.29402,13.362394],[109.29415,13.362466],[109.293935,13.362868],[109.294241,13.362549],[109.29432,13.362593],[109.294371,13.362758],[109.293793,13.363337],[109.294139,13.363149],[109.294099,13.363259],[109.294359,13.363133],[109.294382,13.363199],[109.294365,13.363314],[109.294082,13.363568],[109.294127,13.363645],[109.294241,13.363629],[109.294331,13.363656],[109.294399,13.363766],[109.294405,13.363876],[109.29404,13.364337],[109.293869,13.364517],[109.293522,13.364128],[109.293113,13.363972],[109.292584,13.364343],[109.292301,13.36519]]},{"lon":109.2066,"lat":12.2728,"holes":[[[109.207927,12.267217],[109.207643,12.267112],[109.207613,12.267071],[109.207605,12.267013],[109.207649,12.266955],[109.207612,12.266901],[109.20761,12.266861],[109.207629,12.26684],[109.207588,12.266762],[109.207576,12.26669],[109.207596,12.266683],[109.207584,12.266655],[109.207604,12.266609],[109.20784,12.266438],[109.207863,12.266391],[109.207997,12.266369],[109.20806,12.266329],[109.208066,12.266176],[109.208259,12.266071],[109.208295,12.266025],[109.20834,12.266019],[109.20835,12.265982],[109.208401,12.265956],[109.208417,12.265896],[109.208456,12.265864],[109.208466,12.265926],[109.208501,12.265916],[109.208541,12.265942],[109.208572,12.265894],[109.208696,12.265847],[109.208749,12.265789],[109.208771,12.265809],[109.20883,12.265793],[109.208897,12.265815],[109.208962,12.265785],[109.208972,12.265852],[109.208917,12.265841],[109.208859,12.265882],[109.208859,12.265908],[109.209015,12.265952],[109.209058,12.265997],[109.2091,12.266013],[109.209088,12.266107],[109.209192,12.26617],[109.209182,12.266216],[109.209133,12.266244],[109.209224,12.266256],[109.209257,12.266321],[109.209235,12.266391],[109.209271,12.266464],[109.209257,12.266593],[109.209308,12.266665],[109.209247,12.266715],[109.209266,12.266754],[109.209213,12.26678],[109.209215,12.26685],[109.209043,12.266844],[109.209035,12.26689],[109.2091,12.266898],[109.209102,12.266939],[109.20901,12.267025],[109.208903,12.266927],[109.208836,12.26703],[109.208773,12.267036],[109.208826,12.267194],[109.208727,12.267265],[109.208718,12.267337],[109.208639,12.267302],[109.208543,12.267294],[109.208511,12.267223],[109.208241,12.267257],[109.208043,12.267253],[109.208013,12.267199],[109.207927,12.267217]]],"ring":[[109.203826,12.2838],[109.2176,12.2838],[109.2176,12.2618],[109.199187,12.2618],[109.199761,12.263588],[109.199873,12.263582],[109.199946,12.263615],[109.199986,12.26369],[109.199995,12.263767],[109.200227,12.263761],[109.200374,12.263813],[109.200439,12.263893],[109.200646,12.264262],[109.200795,12.264432],[109.201249,12.264865],[109.201553,12.265186],[109.201802,12.265408],[109.201888,12.26547],[109.202132,12.26558],[109.202457,12.265689],[109.202519,12.265698],[109.202596,12.265674],[109.202646,12.265618],[109.203028,12.265722],[109.203284,12.265952],[109.203385,12.266025],[109.203463,12.26604],[109.203541,12.265979],[109.203862,12.265859],[109.204042,12.265825],[109.204201,12.265829],[109.204327,12.265894],[109.204548,12.26617],[109.204783,12.266365],[109.205046,12.266004],[109.205748,12.266406],[109.205887,12.266576],[109.205904,12.266696],[109.205894,12.266866],[109.205958,12.267045],[109.206055,12.267229],[109.206201,12.267407],[109.206326,12.267506],[109.206607,12.267691],[109.206715,12.267629],[109.206775,12.267531],[109.20687,12.267443],[109.206824,12.267338],[109.206582,12.267188],[109.206638,12.267129],[109.206875,12.267274],[109.207006,12.267511],[109.206964,12.267568],[109.206714,12.267754],[109.206709,12.267809],[109.206765,12.268448],[109.206748,12.269298],[109.206786,12.26951],[109.206789,12.269653],[109.206985,12.270215],[109.20699,12.27038],[109.20695,12.270629],[109.206851,12.270918],[109.206751,12.270968],[109.206204,12.271012],[109.206166,12.271022],[109.20616,12.271059],[109.206178,12.271123],[109.206336,12.271276],[109.20643,12.27125],[109.206462,12.271211],[109.206582,12.271261],[109.206698,12.271347],[109.206794,12.271494],[109.206845,12.271683],[109.206741,12.271767],[109.206526,12.27216],[109.206344,12.272375],[109.206301,12.272469],[109.206317,12.272585],[109.206403,12.272621],[109.20651,12.272606],[109.206628,12.272737],[109.20681,12.272779],[109.20688,12.272821],[109.206848,12.272898],[109.206958,12.272957],[109.206922,12.273041],[109.20678,12.273075],[109.20662,12.273194],[109.20649,12.273196],[109.206369,12.273145],[109.206253,12.273022],[109.206277,12.272858],[109.206022,12.27269],[109.205522,12.272668],[109.20519,12.272202],[109.204942,12.272145],[109.204749,12.272206],[109.204547,12.272354],[109.204407,12.272391],[109.204321,12.272379],[109.20404,12.272658],[109.203184,12.273764],[109.203018,12.274078],[109.202904,12.274352],[109.202694,12.274993],[109.202608,12.27537],[109.202553,12.275852],[109.202572,12.276265],[109.202622,12.276445],[109.202711,12.276611],[109.202762,12.276752],[109.202772,12.276869],[109.20282,12.277015],[109.202692,12.277336],[109.202855,12.277583],[109.202885,12.277736],[109.20306,12.278241],[109.20315,12.278576],[109.203173,12.278946],[109.203097,12.279564],[109.202976,12.280103],[109.202899,12.280646],[109.20288,12.281002],[109.202893,12.281368],[109.20321,12.282291],[109.203826,12.2838]]}];

// Shore at Cổng Tò Vò, clipped from OSM coastline way 860597998.
window.VietnamSightCoasts.push({"lon":109.09912,"lat":15.38977,"holes":[],"ring":[[109.095869,15.378945],[109.095837,15.379027],[109.095783,15.379097],[109.095692,15.379148],[109.095638,15.379269],[109.09563,15.379288],[109.095588,15.37938],[109.09558,15.379417],[109.095594,15.379469],[109.095631,15.379552],[109.095662,15.379576],[109.09554,15.379807],[109.095511,15.379872],[109.094787,15.381272],[109.093582,15.383607],[109.093219,15.384152],[109.093126,15.38434],[109.093132,15.384388],[109.093188,15.384422],[109.093271,15.384474],[109.093346,15.384509],[109.09337,15.384498],[109.093508,15.384248],[109.093685,15.384272],[109.093837,15.384443],[109.093952,15.384508],[109.094371,15.384597],[109.094401,15.384532],[109.095257,15.384735],[109.09596,15.384933],[109.096342,15.385095],[109.096854,15.385879],[109.097935,15.387441],[109.09886,15.389069],[109.09886,15.389245],[109.098787,15.389393],[109.098776,15.389415],[109.098763,15.38944],[109.098896,15.389695],[109.099118,15.38974],[109.099221,15.389717],[109.099444,15.389837],[109.09972,15.389865],[109.09974,15.389868],[109.09988,15.389781],[109.100085,15.389782],[109.10037,15.389876],[109.102818,15.39018],[109.103786,15.390203],[109.104581,15.390304],[109.106517,15.390599],[109.107589,15.390815],[109.107811,15.391214],[109.107884,15.391236],[109.10862,15.391346],[109.10962,15.391633],[109.110133,15.39178],[109.111296,15.392099],[109.1116,15.392144],[109.1116,15.401],[109.0874,15.401],[109.0874,15.3779],[109.096166,15.3779]]});

// Bến Yến. The ferry platform (OSM w768420495) follows the northwest bank.
// Reflect its three stations across river w198845102 to estimate the opposite
// bank. Taper back into the mapped stream beyond the mooring, to the southwest.
window.VietnamSightCoasts.push({lon:105.7792825,lat:20.6090699,holes:[],ring:[
  [105.7795473,20.6093864],[105.7795099,20.6093233],[105.7782279,20.6083080],
  [105.7768720,20.6072674],[105.77632,20.60649],[105.77637,20.60644],
  [105.7772428,20.6068793],[105.7784841,20.6080422],[105.7796855,20.6091412],
  [105.7797560,20.6091700],[105.7795473,20.6093864]
]});

// Shorelines visible in the 2023 overhead photograph, registered to the roof
// corners and west bridge. Interpolate the short stretches under tree crowns.
window.VietnamSightCoasts.push({lon:106.30346,lat:9.91596,bankSpacing:2,name:'Hào nước chùa Âng',sharedStage:true,
  ring:[[106.3028974,9.9161563],[106.3037088,9.9162995],[106.3040009,9.9163373],[106.3040672,9.9159780],
    [106.3040915,9.9156373],[106.3040408,9.9155904],[106.3036915,9.9155057],[106.3030779,9.9154314],
    [106.3030705,9.9154570],[106.3030033,9.9154522],[106.3029520,9.9157591]],
  holes:[[[106.3030042,9.9161376],[106.3036650,9.9162497],[106.3037550,9.9162546],[106.3038882,9.9162525],
    [106.3039358,9.9160387],[106.3039608,9.9159641],[106.3039829,9.9157779],[106.3039615,9.9156898],
    [106.3036018,9.9155690],[106.3030935,9.9155155],[106.3030469,9.9158234]]]});

;
// sights-national.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[1].sites);

;
// sights-northern-heritage.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[2].sites);

;
// sights-southern-coast.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[3].sites);

;
// sights-regional-landscapes.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[4].sites);

;
// sights-coastal-lights.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[5].sites);

;
// heritage-visits.js
'use strict';
// Anchor a regional visit on an existing road arrival. Each stop keeps its own
// coordinates and the camera can move out to an island while the car stays parked.
const heritageVisits=[
  ['hai-son-tu-san-tuong-quan-am','Hải Sơn Tự – sân chùa và tượng Quan Thế Âm',[
    'osm-node-4374995102','hai-son-dai-sen','hai-son-phap-y','hai-son-san-cao',
  ]],
  ['kien-luong-hon-phu-tu','Hòn Phụ Tử – từ bờ biển đến ba hòn đá vôi',[
    'osm-way-1223400935','hon-phu-tu-cot-da','hon-phu-tu-be-da','osm-way-1223400936','osm-way-1223400937',
  ]],
  ['chua-hang-san-chua-va-rung-cay','Chùa Hang – từ cổng vòm đến rừng cây cổ thụ',[
    'chua-hang-cong-tay','chua-hang-long-vom','osm-way-1352279406','chua-hang-mai-ngoi','chua-hang-nha-trung-bay','chua-hang-rung-cay',
  ]],
  ['bao-tang-khmer-tra-vinh-tu-cong-den-dan-ngu-am','Bảo tàng Văn hóa dân tộc Khmer Trà Vinh – từ cổng đến dàn ngũ âm',[
    'bao-tang-khmer-cong-vao','osm-node-4793310552','bao-tang-khmer-phu-dieu','bao-tang-khmer-dan-ngu-am',
  ]],
  ['chua-ang-tu-hao-nuoc-den-chanh-dien','Chùa Âng – từ hào nước đến chánh điện',[
    'chua-ang-cong-dong','chua-ang-thap-nam-ngon','osm-way-288574348','chua-ang-hanh-lang','chua-ang-dau-hoi','chua-ang-be-tho','chua-ang-bich-hoa','chua-ang-hao-nuoc','chua-ang-toan-canh',
  ]],
  ['ao-ba-om-qua-go-cat-va-bo-nuoc','Ao Bà Om – từ rừng cây cổ thụ ra bờ nước',[
    'osm-way-76041615','ao-ba-om-loi-cat','ao-ba-om-mat-nuoc','ao-ba-om-tu-tren-cao',
  ]],
  ['vung-chua-tu-bai-xe-len-san-vieng','Vũng Chùa – từ bãi xe lên khu mộ Đại tướng Võ Nguyên Giáp',[
    'vung-chua-bai-xe-khu-mo','vung-chua-loi-bo-khu-mo','osm-way-885335615','osm-node-2495002567','vung-chua-san-dang-huong',
  ]],
  ['vung-chua-tu-hang-phi-lao-ra-dao-yen','Vũng Chùa – từ hàng phi lao đến Đảo Yến',[
    'osm-node-11563767582','osm-node-6841107787','vung-chua-tu-doi-tho-son','osm-way-61973139',
  ]],
  ['deo-ngang-qua-hoanh-son-quan','Đèo Ngang – theo bậc đá qua Hoành Sơn Quan',[
    'deo-ngang-loi-vao-duong-cu','deo-ngang-bac-da-thien-ly','osm-node-8250669293','deo-ngang-mat-nam-hoanh-son-quan',
  ]],
  ['dau-tich-tuong-thanh-dong-hoi','Tường thành Đồng Hới – từ bia cầu Nam Thành đến mũi đông bắc',[
    'osm-node-6346469056','dong-hoi-tuong-gach-cau-nam','dong-hoi-san-trong-cua-dong','dong-hoi-bac-gac-cua-dong','dong-hoi-mui-thanh-dong-bac','dong-hoi-loi-gach-mui-thanh',
  ]],
  ['thanh-dong-hoi-tu-hao-den-bao-tang','Thành Đồng Hới – qua hào Cửa Đông đến sân bảo tàng',[
    'osm-way-319395915','dong-hoi-tu-cau-vao-thanh','dong-hoi-cua-dong','dong-hoi-bao-tang-tu-hao','osm-node-10756203755','dong-hoi-mai-bao-tang',
  ]],
  ['dong-hoi-ven-song-nhat-le','Ven sông Nhật Lệ – từ tượng Mẹ Suốt đến tháp chuông Tam Tòa',[
    'osm-node-8716478190','dong-hoi-phu-dieu-me-suot','dong-hoi-hang-cau-me-suot','osm-node-5323866724','dong-hoi-toan-canh-cau-nhat-le','osm-way-343077412',
  ]],
  ['quang-binh-quan-hai-mat-cong','Quảng Bình Quan – hai mặt cổng giữa Lê Lợi và Quang Trung',[
    'osm-node-8706712863','quang-binh-quan-mat-quang-trung','quang-binh-quan-vuon-le-loi',
  ]],
  ['la-vang-tu-cong-den-linh-dai','La Vang – từ cổng hành hương qua tháp chuông đến Linh đài',[
    'osm-node-3100290389','osm-way-305408028','osm-node-3100293997','osm-way-690204938',
  ]],
  ['hai-ben-tha-hoa-thach-han','Hai bến thả hoa bên sông Thạch Hãn',[
    'osm-node-14309236352','quang-tri-hanh-lang-ben-nam','quang-tri-tu-ben-nam-nhin-an-don','quang-tri-bia-ben-bac','quang-tri-den-ben-bac','osm-node-10605991202',
  ]],
  ['doi-bo-hien-luong-ben-hai','Đôi bờ Hiền Lương – từ Kỳ đài qua cầu đến tượng đài bờ nam',[
    'osm-node-1016631030','osm-node-1016631101','osm-node-11663933869','quang-tri-vach-son-cau-hien-luong','osm-node-4411036589',
  ]],
  ['vinh-moc-tu-san-den-bo-bien','Vịnh Mốc – từ sân đón khách đến cửa số 3 và bờ biển',[
    'quang-tri-san-don-khach-vinh-moc','quang-tri-nha-trung-bay-vinh-moc','osm-node-1016630618','quang-tri-phong-ho-sinh-vinh-moc','osm-node-1016631618',
  ]],
  ['chung-tich-tam-toa','Chứng tích Tam Tòa – tháp chuông và nền nhà thờ bên Nhật Lệ',[
    'quang-binh-mat-tay-tam-toa','quang-binh-nen-nha-tho-tam-toa',
  ]],
  ['vung-su-den-vung-chao','Vịnh Xuân Đài – từ bãi thúng Vũng Sứ đến mũi cây Vũng Chào',[
    'osm-relation-16028816','phu-yen-cu-lao-vung-su','phu-yen-mui-cay-vung-chao',
  ]],
  ['nha-trung-bay-phu-yen','Bảo tàng Phú Yên – từ sân Trần Phú vào sảnh trống đồng',[
    'osm-way-232410041','phu-yen-canh-nha-bao-tang','phu-yen-sanh-trong-dong',
  ]],
  ['ganh-da-dia-den-ganh-den','Từ Gành Đá Đĩa đến hải đăng Gành Đèn',[
    'osm-way-1229067977','osm-way-1272966043',
  ]],
  ['nui-nhan-tuy-hoa','Núi Nhạn – tháp Chăm và đài tưởng niệm',[
    'osm-node-4674771389','phu-yen-gian-tho-thap-nhan','osm-node-4518976294',
  ]],
  ['chua-thanh-luong-hai-ho','Chùa Thanh Lương – chính điện, điện Quan Âm và hai hồ',[
    'osm-way-903827683','osm-way-903834501','osm-way-903834500','osm-way-903834502',
  ]],
  ['bai-huong-ra-hon-nua','Từ Bãi Hương ra Hòn Nưa – bãi cát, ghềnh đá và hải đăng',[
    'phu-yen-loi-xuong-bai-huong','osm-way-50540459','osm-way-481006392','osm-way-481006394','osm-way-1272966044',
  ]],
  ['tu-bai-mon-len-mui-dien','Bãi Môn – từ bờ cát lên hải đăng và mỏm Rạng Đông',[
    'osm-way-160203374','osm-way-909041150','phu-yen-bia-mom-rang-dong',
  ]],
  ['tuy-an-mang-lang-o-loan-hon-yen','Tuy An – nhà thờ Mằng Lăng, đầm Ô Loan và Hòn Yến',[
    'osm-way-804128824','osm-node-11779827836','osm-node-4472642290','osm-way-151569083','osm-way-151569085',
  ]],
  ['vung-ro-ben-tau-khong-so','Vũng Rô – từ sân tượng đài đến bến Tàu Không số',[
    'osm-node-4292019089','phu-yen-nha-trung-bay-vung-ro','osm-node-12382639867','osm-node-4472600793',
  ]],
  ['ho-dambri-va-cau-chu-y','Đambri – từ hồ đến cầu chữ Y dưới thác',[
    'osm-way-304773101','osm-node-3094058858','osm-node-3093994368',
  ]],
  ['bien-ho-che-chua-buu-minh','Biển Hồ Chè – hàng thông và chùa Bửu Minh',[
    'osm-way-741701880','osm-node-5439114923',
  ]],
  ['buon-ma-thuot-biet-dien-nha-day-dinh-lac-giao','Buôn Ma Thuột – biệt điện, Nhà đày và đình Lạc Giao',[
    'osm-way-242705749','osm-node-1730268393','osm-node-10314905409',
  ]],
  ['bien-ho-pleiku-mui-dau-rua','Biển Hồ Pleiku – từ đường thông ra mũi Đầu Rùa',[
    'osm-node-3600339699','osm-node-13105118510','osm-way-506959800',
  ]],
  ['ho-lak-buon-jun-biet-dien','Hồ Lắk – bến buôn Jun và biệt điện Bảo Đại',[
    'dak-lak-ben-thuyen-buon-jun','osm-relation-7074662','osm-node-1765142229','osm-way-52823719',
  ]],
  ['pho-cu-go-cong','Phố cổ Gò Công – Đình Trung, lăng Trương Định và Nhà Đốc Phủ Hải',[
    'osm-way-907749065','dong-thap-lang-mo-truong-dinh','osm-way-1272644423',
  ]],
  ['sa-dec-nha-co-lang-hoa','Sa Đéc – nhà cổ và làng hoa',[
    'osm-node-5227610721','osm-node-13518302230',
  ]],
  ['suoi-cham-thac-hieu-pu-luong','Pù Luông – guồng nước suối Chàm và thác Hiêu',[
    'osm-node-13508679485','osm-node-6215416985',
  ]],
  // https://thanglong.baochinhphu.vn/ung-dung-cong-nghe-de-le-hoi-chua-huong-ngay-cang-an-toan-van-minh-va-hien-dai-10324120923332171.htm
  ['chua-huong-huong-son','Chùa Hương – từ suối Yến đến động Hương Tích',[
    'osm-node-7173617332','osm-node-2669659389','osm-node-2089305124','osm-node-2835735216','osm-node-2089305122',
  ]],
  ['binh-san-thach-dong-ha-tien','Hà Tiên – núi Bình San, Thạch Động và Đá Dựng',[
    'osm-node-2326969109','osm-node-2326969092','osm-node-2327003316','osm-node-11353153265',
  ]],
  // https://dsvh.gov.vn/di-tich-kien-truc-nghe-thuat-khu-den-thap-my-son-2943
  ['my-son','Thánh địa Mỹ Sơn',[
    'bao-tang-my-son','my-son-thap-cong-k','osm-way-198804483','my-son-nhom-h',
    'my-son-nhom-b','my-son-nhom-c','my-son-nhom-d','my-son-nhom-a','osm-way-198804451','osm-node-2088919707',
    'my-son-nhom-g','my-son-nhom-e','my-son-nhom-f',
  ]],
  ['chua-thay-tay-phuong','Chùa Thầy và chùa Tây Phương',[
    'chua-thay-sai-son','thuy-dinh-ho-long-tri','osm-way-550537566','chua-cao-sai-son','chua-mot-mai-boi-am','chua-tay-phuong-thach-xa',
  ]],
  ['dinh-va-thac-bach-ma','Vườn quốc gia Bạch Mã – Hải Vọng Đài, Ngũ Hồ và Đỗ Quyên',[
    'hai-vong-dai-bach-ma','ngu-ho-bach-ma','thac-do-quyen-bach-ma',
  ]],
  ['dat-ngap-nuoc-tram-chim','Vườn quốc gia Tràm Chim – bến khách và trạm C4',[
    'osm-node-12647638907','osm-node-12647714579','osm-node-12647715610','osm-node-4416131389','osm-node-12647689080',
  ]],
  ['rung-va-bau-cat-tien','Vườn quốc gia Cát Tiên – từ Bến Cự đến Bàu Sấu',[
    'ghenh-ben-cu-cat-tien','cay-go-bac-dong','cay-tung-duong-bau-sau','dai-quan-sat-bau-sau','osm-way-141722682',
  ]],
  ['cao-nguyen-da-dong-van','Cao nguyên đá Đồng Văn',[
    'dai-ngam-nui-doi-quan-ba','nui-doi-quan-ba','dong-lung-khuy','dinh-thu-ho-vuong',
    'rung-da-lung-tao','lung-cu','pho-co-dong-van','cho-co-dong-van',
  ]],
  ['vuon-quoc-gia-cuc-phuong','Vườn quốc gia Cúc Phương',[
    'osm-way-481782794','osm-way-201095352','osm-node-1725481657','osm-node-10768945036',
    'osm-node-1995508763','osm-node-1995508761','osm-node-5294733035',
  ]],
  ['ho-ba-be-song-nang','Hồ Ba Bể và sông Năng',[
    'osm-relation-7109450','dao-ba-goa-ba-be','den-an-ma-ba-be','osm-node-1888768316','osm-node-4755846850','osm-node-4879886024',
  ]],
  ['tuong-niem-dien-bien-phu','Điện Biên Phủ – bảo tàng và các điểm tưởng niệm',[
    'bao-tang-chien-thang-dien-bien-phu','nghia-trang-liet-si-a1','san-hanh-le-doi-d1','tuong-dai-chien-thang-dien-bien-phu',
  ]],
  ['di-tich-co-loa','Khu di tích Cổ Loa',[
    'osm-way-776438252','osm-way-497328755','osm-way-776437158','osm-way-1556531233','osm-way-776437157',
  ]],
  ['khu-di-tich-den-hung','Khu di tích Đền Hùng',[
    'osm-node-11395354269','osm-node-7189828683','osm-node-11395352269','osm-node-11395352270',
    'osm-way-1504768248','osm-node-11395352271','osm-node-11395352369','osm-node-11395352469',
  ]],
  ['kien-truc-bao-tang-ha-noi','Kiến trúc ba bảo tàng ở Hà Nội',[
    'bao-tang-my-thuat-viet-nam','bao-tang-phu-nu-viet-nam','bao-tang-ha-noi',
  ]],
  // https://condao.com.vn/vi/news/tai-nguyen-du-lich/nha-tu-con-dao-2750.html
  ['di-tich-con-dao','Côn Đảo – từ Dinh Chúa Đảo đến Cầu tàu 914',[
    'so-co-con-dao','dinh-chua-dao','bia-cau-tau-914','cau-tau-914',
  ]],
  ['cum-thap-hoa-lai','Cụm tháp Hòa Lai',[
    'thap-bac-hoa-lai','thap-hoa-lai','thap-nam-hoa-lai',
  ]],
  // https://bvhttdl.gov.vn/binh-dinh-tu-bo-ton-tao-phat-huy-gia-tri-thap-champa-gan-voi-phat-trien-du-lich-20211015112439839.htm
  ['thap-cham-binh-dinh','Bảy cụm tháp Chăm Bình Định',[
    'thap-doi','thap-binh-lam','thap-banh-it','thap-canh-tien','thap-phu-loc','thap-thu-thien','thap-duong-long',
  ]],
  ['di-tich-pac-bo','Khu di tích Pác Bó',[
    'osm-node-5418467363','osm-node-1490413978','osm-way-1376476251','osm-node-13005765528','hang-coc-bo',
  ]],
  ['ban-gioc-nguom-ngao','Bản Giốc – Khuổi Ky – Ngườm Ngao',[
    'ban-gioc','osm-way-1372358286','osm-way-1415191977','osm-node-13378657667','osm-node-4527762070',
  ]],
  ['di-tich-nui-sam','Các di tích quanh Núi Sam',[
    'osm-way-1159104301','osm-node-1814474832','osm-way-1159104315','osm-way-1189409894','osm-node-4293357289',
  ]],
  ['chua-soc-trang','Các ngôi chùa Sóc Trăng',[
    'osm-way-225364168','osm-way-668640550','osm-way-668640522','osm-way-668649240','bat',
  ]],
  ['oc-eo-ba-the','Óc Eo – Ba Thê',[
    'osm-way-1182462616','osm-way-1182462620','osm-way-1182462619',
  ]],
  // https://halongbay.com.vn/vi/tours/25-hanh-trinh-vhl7-tham-quan-vinh-ha-long-theo-cac-hanh-trinh-vhl1-2-3-4
  // https://daison.haiphong.gov.vn/van-hoa-xa-hoi/hai-phong-ban-hanh-muc-phi-tham-quan-moi-doi-voi-di-tich-danh-thang-837039
  ['vinh-ha-long-cat-ba','Vịnh Hạ Long – quần đảo Cát Bà',[
    'hon-trong-mai','osm-node-4730928605','osm-node-4730928606','osm-node-13570978422','osm-node-4508895511',
    'osm-node-10821152105','osm-node-994065796','osm-node-3494811567','osm-node-3560283504','osm-node-3887715188',
    'hang-trong-bo-hon','osm-node-5147203123','osm-node-6474418794',
  ]],
  ['ben-beo-vinh-lan-ha','Từ Bến Bèo ra vịnh Lan Hạ',[
    'osm-node-778791182','osm-relation-20057203','osm-node-13388093801','osm-node-4858968321',
  ]],
  // https://whc.unesco.org/en/list/678/documents/ and https://vdt.hueworldheritage.org.vn/vedientu
  ['di-tich-co-do-hue','Quần thể di tích Cố đô Huế',[
    'ngo-mon','flag','phu-van-lau','phuoc-duyen','lang-khai-dinh',
    'dien-thai-hoa','hien-lam-cac','cua-hien-nhon','lang-minh-mang','lang-tu-duc','ho-quyen-hue',
    'lang-gia-long','lang-dong-khanh','dan-nam-giao-hue','osm-way-695810710','osm-way-285990348',
    'osm-relation-17957939','osm-way-172763420','osm-way-264285103','osm-way-1075014562','osm-way-172657567','osm-way-172657565',
    'osm-way-1075014568','osm-way-1075016121','unesco-678-014',
  ]],
  // https://hoianheritage.net/vi/bao-chi/bao-chi-ve-di-san/ho-tro-di-tich-tu-nhan-o-hoi-an-mo-cua-don-khach-tham-quan-225.html
  // https://hoianheritage.net/uploads/download/files/ban-tin-1-2010.pdf
  ['pho-co-hoi-an','Phố cổ Hội An',[
    'chua-cau','hoi-quan-phuc-kien','osm-node-4279640089','nha-co-tan-ky','hoi-quan-quang-dong','hoi-quan-trieu-chau','cho-hoi-an',
    'osm-node-2076855954','osm-node-2076855866','osm-way-631064893','osm-node-4582592213','osm-way-565186618',
    'osm-way-210966819','osm-node-2092582318','osm-way-631074714','osm-node-2076856032','osm-node-3189923484',
  ]],
  // https://dsvh.gov.vn/danh-lam-thang-canh-trang-an-tam-coc-bich-dong-2946
  // https://sodulich.ninhbinh.gov.vn/vi/tai-nguyen-du-lich-van-hoa/co-do-hoa-lu-kinh-do-cua-nha-nuoc-phong-kien-tap-quyen-dau-tien-23.html
  ['quan-the-trang-an','Quần thể danh thắng Tràng An',[
    'ben-thuyen-trang-an','ben-thuyen-tam-coc','osm-way-1362974362','osm-way-772041809',
    'osm-way-772041801','osm-node-4424766405','osm-node-1540779110','osm-way-772057039','osm-node-4738232630',
    'osm-node-13388919549','osm-way-1424042953',
  ]],
  // The inner citadel, outer earthen rampart and altar are the three inscribed
  // components. https://whc.unesco.org/en/list/1358/maps/
  ['thanh-nha-ho','Thành Nhà Hồ',[
    'cong-nam-thanh-ho','cong-bac-thanh-ho','cong-dong-thanh-ho','cong-tay-thanh-ho',
    'osm-way-242169982','la-thanh-tay-do','dan-te-nam-giao-tay-do'
  ]],
  // https://phongnhakebang.vn/du-lich/du-lich-vuon-quoc-gia-phong-nha-ke-bang
  ['phong-nha-ke-bang','Phong Nha – Kẻ Bàng',[
    'phong-nha','osm-node-3499295493','osm-node-6358064546','osm-node-3157796075','osm-node-3499399985',
    'osm-node-5063396623','osm-node-5353612634','osm-node-4387487189',
  ]],
  // https://dulichbacninh.gov.vn/kham-pha/vung-dat-con-nguoi-bac-ninh/quan-the-di-tich-yen-tu-vinh-nghiem-con-son-kiep-bac-di-san-van-hoa-the-gioi-1096.html
  ['yen-tu-con-son','Yên Tử – Vĩnh Nghiêm – Côn Sơn, Kiếp Bạc',[
    'osm-way-1579506026','osm-node-4886986961','osm-way-1567975861','osm-way-1567975857','osm-way-1549018362',
    'osm-way-1549018367','osm-way-1567975868','osm-way-1567975866','osm-way-1567975863','osm-way-1567975865',
    'osm-way-1020461321','osm-way-1020716548','osm-way-1567975867','osm-way-1567975864','osm-way-1567975862',
  ]],
  // https://hoangthanhthanglong.vn/khu-di-tich-trung-tam-hoang-thanh-thang-long/
  ['hoang-thanh-thang-long','Hoàng thành Thăng Long',[
    'osm-way-696389268','osm-way-1497572243','osm-way-185535416','osm-relation-21404421','osm-way-185531692',
    'bac-mon-thang-long','cot-co-ha-noi',
  ]],
  // https://btllang.mod.gov.vn/cum-di-tich-lich-su-van-hoa-ba-dinh/lang-chu-tich-ho-chi-minh.html
  ['quang-truong-ba-dinh','Quảng trường Ba Đình và các di tích lân cận',[
    'osm-way-37625751','osm-relation-21401560','osm-way-207178342','osm-way-697326496','osm-way-37629143',
    'osm-way-37629570','osm-relation-17877970',
  ]],
  // https://tgpsaigon.net/bai-viet/cau-nguyen-voi-nu-vuong-hoa-binh-tai-sai-gon-75309
  ['cong-truong-cong-xa-paris','Công trường Công xã Paris',[
    'buu-dien-sai-gon','osm-way-801950766','osm-node-2410639584',
  ]],
];
if(window.VanMieuSurvey)heritageVisits.push(['van-mieu-quoc-tu-giam','Văn Miếu – Quốc Tử Giám',VanMieuSurvey.stopIds]);

;
// sights-monuments.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[6].sites);

;
// sights-heritage.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[7].sites);

;
// sights-south.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[8].sites);

;
// sights-ha-nam-tam-chuc.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[9].sites);

;
// sights-ha-nam-pagodas.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[10].sites);

;
// sights-ha-nam-east.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[11].sites);

;
// sights-ha-nam-so-kien.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[12].sites);

;
// sights-nghe-an.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[13].sites);

;
// sights-ha-tinh-quang-tri.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[14].sites);

;
// sights-nam-trung-bo.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[15].sites);

;
// sights-da-nang.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[16].sites);

;
// sights-hue.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[17].sites);

;
// central-arch.js
'use strict';
(() => {
  // Shared Central Vietnam architectural & bridge building blocks for Three.js landmarks.
  // All geometry is stamped directly into the landmark's single-draw-call buffer via `kit`.

  function plaque(T, kit, title, x, y, z, w, h, opts = {}) {
    const ry = opts.ry || 0;
    const bg = opts.bg || '#f2dfa7';
    const fg = opts.fg || '#6c2d23';
    const border = opts.border ?? 0x8c6d45;
    if (opts.frame !== false) {
      kit.box(border, x - Math.sin(ry) * 0.05, y, z - Math.cos(ry) * 0.05, w + 0.24, h + 0.18, 0.14, ry);
    }
    const c = document.createElement('canvas');
    c.width = 768; c.height = 144;
    const g = c.getContext('2d');
    g.fillStyle = bg; g.fillRect(0, 0, 768, 144);
    g.strokeStyle = fg; g.lineWidth = 5; g.strokeRect(8, 8, 752, 128);
    g.fillStyle = fg;
    g.font = 'bold 70px "Times New Roman", "Noto Serif", serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(title, 384, 74, 710);
    const map = new T.CanvasTexture(c);
    map.colorSpace = T.SRGBColorSpace;
    const mesh = new T.Mesh(
      new T.PlaneGeometry(w, h),
      new T.MeshStandardMaterial({ map, roughness: 0.84 })
    );
    mesh.position.set(x + Math.sin(ry) * 0.04, y, z + Math.cos(ry) * 0.04);
    mesh.rotation.y = ry;
    kit.group.add(mesh);
  }

  function archPiers(x, z, width, radius, depth) {
    const halfPier = Math.max(0.25, (width / 2 - radius) / 2);
    return [-1, 1].map(side => [x + side * (radius + halfPier), z, halfPier, depth / 2]);
  }

  function vaultedBay(T, kit, x, z, w, h, r, sy, d, wallColor, trimColor, darkColor) {
    const { profile, box, outline } = kit;
    const shape = new T.Shape();
    shape.moveTo(-w / 2, 0); shape.lineTo(-r, 0); shape.lineTo(-r, sy);
    shape.absarc(0, sy, r, Math.PI, 0, true);
    shape.lineTo(r, 0); shape.lineTo(w / 2, 0); shape.lineTo(w / 2, h); shape.lineTo(-w / 2, h);
    shape.closePath();
    profile(shape, wallColor, x, 0, z - d / 2, d);
    for (const side of [-1, 1]) {
      const f = z + side * (d / 2 + 0.03);
      for (const s of [-1, 1]) {
        box(trimColor, x + s * (r + 0.14), sy / 2, f, 0.22, sy, 0.12);
        box(darkColor, x + s * (r + 0.18), sy - 0.02, f, 0.32, 0.14, 0.16);
      }
      for (let i = 0; i < 11; i++) {
        const a = i * Math.PI / 11, b = (i + 1) * Math.PI / 11 - 0.014;
        const pt = (q, t) => [q * Math.cos(t), q * Math.sin(t)];
        outline([pt(r, a), pt(r + 0.22, a), pt(r + 0.22, b), pt(r, b)], i % 2 ? trimColor : darkColor, x, sy, f - 0.04, 0.1);
      }
    }
  }

  function curvedRoof(T, kit, x, y, z, w, d, h, tileColor, ridgeColor, eaveColor, ridgeRatio = 0.28, opts = {}) {
    const { stamp, box, outline } = kit;
    kit.palette({tile:tileColor}, true);
    const p = [], ledge = 0.15;
    function quad(a, b, c, dPt) { p.push(...a, ...b, ...dPt, ...b, ...c, ...dPt); }
    const ring = (t) => {
      const v = [];
      for (const [ax, az, bx, bz] of [[-1, -1, -1, 1], [-1, 1, 1, 1], [1, 1, 1, -1], [1, -1, -1, -1]]) {
        for (let i = 0; i < 8; i++) {
          const u = i / 8, xx = ax + (bx - ax) * u, zz = az + (bz - az) * u;
          const corner = Math.pow(Math.min(Math.abs(xx), Math.abs(zz)), 4.5);
          v.push([
            x + xx * (w / 2 * (1 - t) + w * ridgeRatio * t),
            y + h * t * t + corner * (1 - t) * Math.min(0.55, h * 0.44),
            z + zz * (d / 2 * (1 - t))
          ]);
        }
      }
      return v;
    };
    let outer = ring(0), prev = outer;
    for (const t of [0.33, 0.67, 1]) {
      const next = ring(t);
      for (let j = 0; j < 32; j++) { const k = (j + 1) % 32; quad(prev[j], next[j], next[k], prev[k]); }
      prev = next;
    }
    for (let i = 0; i < p.length; i += 9) {
      for (let axis = 0; axis < 3; axis++) [p[i + 3 + axis], p[i + 6 + axis]] = [p[i + 6 + axis], p[i + 3 + axis]];
    }
    for (let j = 0; j < 32; j++) {
      const k = (j + 1) % 32, a = outer[j], b = outer[k];
      const lowerA = [a[0], a[1] - ledge, a[2]], lowerB = [b[0], b[1] - ledge, b[2]];
      quad(b, a, lowerA, lowerB);
      // Return the soffit to the wall so the sky does not show through the eaves.
      const inner = v => [x + (v[0]-x)*.75, y-.12, z + (v[2]-z)*.75];
      quad(lowerA, lowerB, inner(lowerB), inner(lowerA));
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.computeVertexNormals();
    stamp(g, tileColor, 0, 0, 0);
    g.dispose();
    // Raised hip caps follow the four swept pitches right to the corner tile.
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const points=[];
      for (let j=0; j<=4; j++) {
        const t=j/4;
        points.push(new T.Vector3(x+sx*w*((1-t)*.5+ridgeRatio*t),
          y+h*t*t+(1-t)*Math.min(.55,h*.44)+.045, z+sz*d*.5*(1-t)));
      }
      const cap=new T.TubeGeometry(new T.CatmullRomCurve3(points),6,.093,6,false);
      stamp(cap,ridgeColor,0,0,0);
      cap.dispose();
    }
    box(ridgeColor, x, y + h + 0.08, z, Math.max(0.45, w * ridgeRatio * 2.15), 0.19, 0.24);
    for (const s of [-1, 1]) for (const f of [-1, 1]) {
      outline([[-0.30, 0], [0, 0.05], [0.22, 0.24], [0.38, 0.54], [0.40, 0.22], [0.24, -0.02], [0, -0.15]],
        eaveColor, x + s * w * 0.49, y + 0.34, z + f * (d / 2 - 0.1), 0.11, s === 1 ? 0 : Math.PI);
    }
    if (opts.dragons) {
      const span = Math.max(0.65, w * ridgeRatio * 0.82);
      const orb = new T.SphereGeometry(0.24, 10, 8);
      stamp(orb, opts.goldColor || 0xcfa449, x, y + h + 0.34, z, 1, 1, 0.5);
      orb.dispose();
      for (const s of [-1, 1]) {
        outline([[0, 0], [0.35, 0.12], [0.68, 0.42], [0.95, 0.24], [1.18, 0.52], [0.98, 0.65], [0.65, 0.62], [0.24, 0.34]],
          opts.goldColor || 0xb78e46, x + s * span, y + h + 0.14, z, 0.12, s === 1 ? Math.PI : 0);
      }
    }
  }

  function gabledRoof(T, kit, x, y, z, w, d, h, tileColor, ridgeColor, opts = {}) {
    const { outline, box } = kit;
    kit.palette({tile:tileColor}, true);
    const thick = opts.thick || 0.22;
    const over = opts.overhang || 0.35;
    const hw = w / 2 + over;
    const len = d + over * 2;
    const alongX = Boolean(opts.alongX);
    if (alongX) {
      const hd = d / 2 + over;
      outline([[-hd, 0], [0, h], [hd, 0], [hd, -thick], [0, h - thick], [-hd, -thick]], tileColor, x - w / 2 - over, y, z, w + over * 2, Math.PI / 2);
      box(ridgeColor, x, y + h + 0.06, z, w + over * 2.1, 0.2, 0.24);
    } else {
      outline([[-hw, 0], [0, h], [hw, 0], [hw, -thick], [0, h - thick], [-hw, -thick]], tileColor, x, y, z - len / 2, len);
      box(ridgeColor, x, y + h + 0.06, z, 0.24, 0.2, len + 0.12);
    }
  }

  // Cylinder connector between two 3D points (ideal for bridge stay cables, catenary hangers, steel trusses)
  function strut(T, kit, color, x1, y1, z1, x2, y2, z2, radius = 0.08) {
    const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
    const len = Math.hypot(dx, dy, dz);
    if (len < 0.02) return;
    const mx = (x1 + x2) * 0.5, my = (y1 + y2) * 0.5, mz = (z1 + z2) * 0.5;
    const dir = new T.Vector3(dx / len, dy / len, dz / len);
    const quat = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
    const eul = new T.Euler().setFromQuaternion(quat, 'YXZ');
    kit.stamp(kit.round, color, mx, my, mz, radius, len, radius, eul.y, eul.x, eul.z);
  }

  // Stepped masonry foundation plinth
  function steps(kit, x, z, w, d, count, stepH, stepRun, color) {
    for (let i = 0; i < count; i++) {
      kit.box(color, x, stepH * (i + 0.5), z + (count - 1 - i) * stepRun * 0.5, w - i * 0.32, stepH, d + (count - 1 - i) * stepRun);
    }
  }

  // Reusable Vietnamese Tam Quan / Nghi Môn gate
  function tamQuan(T, kit, opts = {}) {
    const { box, tapered } = kit;
    const wall = opts.wall || 0xd6c39c;
    const trim = opts.trim || 0xb79b6b;
    const dark = opts.dark || 0x564638;
    const tile = opts.tile || 0x864232;
    const ridge = opts.ridge || 0xd5c5a3;
    const eave = opts.eave || 0xc79f56;
    const wCenter = opts.wCenter || 5.4;
    const wSide = opts.wSide || 4.0;
    const depth = opts.depth || 3.0;
    const hCenter = opts.hCenter || 5.0;
    const hSide = opts.hSide || 3.6;
    const sideX = (wCenter + wSide) * 0.5 - 0.1;

    // Stone stepped base
    box(0x8e8679, 0, 0.22, 0, wCenter + wSide * 2 + 4.4, 0.44, depth + 2.4);
    vaultedBay(T, kit, 0, 0, wCenter, hCenter, wCenter * 0.30, hCenter * 0.52, depth, wall, trim, dark);
    for (const s of [-1, 1]) {
      vaultedBay(T, kit, s * sideX, 0, wSide, hSide, wSide * 0.27, hSide * 0.50, depth * 0.78, wall, trim, dark);
      curvedRoof(T, kit, s * sideX, hSide + 0.04, 0, wSide + 1.0, depth * 1.15, 0.85, tile, ridge, eave, 0.26);
      if (opts.twoTierSides) {
        box(trim, s * sideX, hSide + 1.05, 0, wSide * 0.72, 1.15, depth * 0.56);
        for (const f of [-1, 1]) box(dark, s * sideX, hSide + 1.05, f * depth * 0.30, wSide * 0.28, 0.68, 0.08);
        curvedRoof(T, kit, s * sideX, hSide + 1.62, 0, wSide + 0.4, depth * 0.92, 0.78, tile, ridge, eave, 0.24);
      }
      // Flanking Tứ Trụ Biểu ceremonial pillars
      if (opts.pillars !== false) {
        const px = s * (sideX + wSide * 0.5 + 1.25);
        box(dark, px, 0.55, 0.15, 1.05, 0.75, 1.05);
        box(wall, px, 2.75, 0.15, 0.70, 3.65, 0.70);
        for (const y of [1.0, 4.4, 4.82]) box(trim, px, y, 0.15, 0.88, 0.15, 0.88);
        tapered(eave, px, 5.32, 0.15, 0.44, 0.14, 0.68, 1, 4);
        box(0x7c2d23, px, 2.75, 0.52, 0.24, 2.35, 0.05);
      }
    }
    // Center roof(s) & upper bell pavilion
    box(trim, 0, hCenter + 0.12, 0, wCenter + 0.45, 0.24, depth + 0.35);
    if (opts.title) {
      plaque(T, kit, opts.title, 0, hCenter - 0.45, depth / 2 + 0.12, Math.min(3.4, wCenter * 0.62), 0.62, opts.plaque || {});
    }
    curvedRoof(T, kit, 0, hCenter + 0.22, 0, wCenter + 1.35, depth + 1.15, 1.02, tile, ridge, eave, 0.30);
    // Upper pavilion tier (gác chuông)
    const upY = hCenter + 1.25;
    box(wall, 0, upY + 0.85, 0, wCenter * 0.74, 1.75, depth * 0.76);
    for (const f of [-1, 1]) {
      box(0x5a261b, 0, upY + 0.85, f * depth * 0.39, wCenter * 0.30, 1.15, 0.08);
      for (const s of [-1, 1]) box(trim, s * wCenter * 0.27, upY + 0.85, f * depth * 0.39, 0.32, 1.25, 0.10);
    }
    curvedRoof(T, kit, 0, upY + 1.72, 0, wCenter + 0.65, depth + 0.65, 1.15, tile, ridge, eave, 0.28, { dragons: true, goldColor: eave });
  }

  // Reusable Vietnamese temple / palace / communal hall (Đình / Đền / Điện / Hội quán)
  function vietnameseHall(T, kit, opts = {}) {
    const { box, stamp, round } = kit;
    const w = opts.w || 16;
    const d = opts.d || 9.5;
    const baseH = opts.baseH || 1.1;
    const colH = opts.colH || 3.6;
    const wall = opts.wall || 0xdccaa2;
    const wood = opts.wood || 0x5c271c;
    const tile = opts.tile || 0x8b4231;
    const ridge = opts.ridge || 0xd6c7a8;
    const eave = opts.eave || 0xc99c4a;
    const stone = opts.stone || 0x918a7f;
    const bays = opts.bays || 5;

    kit.palette({timber:wood,stone,plaster:wall}, true);
    // Terraced stone foundation & front steps
    box(stone, 0, baseH * 0.5, 0, w + 2.4, baseH, d + 2.6);
    steps(kit, 0, d * 0.5 + 1.6, Math.min(7.5, w * 0.42), 1.4, 4, baseH / 4, 0.38, 0x847e74);
    for (const s of [-1, 1]) {
      box(0x7c766c, s * (Math.min(7.5, w * 0.42) * 0.5 + 0.25), baseH * 0.58, d * 0.5 + 1.9, 0.36, baseH * 0.85, 2.4);
    }

    // Main core body & veranda colonnade
    const cy = baseH + colH * 0.5;
    box(wall, 0, cy, -0.5, w - 1.2, colH, d - 1.8);
    for (let i = 0; i <= bays; i++) {
      const px = -w / 2 + 0.5 + (i / bays) * (w - 1.0);
      for (const pz of [-d / 2 + 0.35, d / 2 - 0.35]) {
        stamp(round, wood, px, cy, pz, 0.19, colH, 0.19);
        stamp(round, stone, px, baseH + 0.14, pz, 0.28, 0.28, 0.28);
      }
      if (i < bays) {
        const bx = px + (w - 1.0) / bays * 0.5;
        // Framed leaves, recessed panels and an open lattice above the door rail.
        const span=(w-1.4)/bays*.86, face=d/2-1.38;
        box(0x37271e,bx,cy,face,span,colH*.88,.16);
        for(const side of [-1,1]){
          const leaf=bx+side*span*.25;
          box(wood,leaf,baseH+colH*.36,face+.10,span*.46,colH*.50,.09);
          for(const edge of [-1,1])box(wood,leaf+edge*span*.214,cy,face+.17,.07,colH*.84,.07);
          for(const f of [.13,.44,.60,.84])box(wood,leaf,baseH+colH*f,face+.17,span*.46,.08,.07);
          for(let j=-1;j<=1;j++)box(wood,leaf+j*span*.105,baseH+colH*.72,face+.15,.04,colH*.22,.05);
        }
      }
    }
    // Front veranda beam & optional horizontal plaque
    box(wood, 0, baseH + colH - 0.14, d / 2 - 0.35, w - 0.6, 0.26, 0.24);
    if (opts.title) {
      plaque(T, kit, opts.title, 0, baseH + colH - 0.42, d / 2 - 0.12, Math.min(4.6, w * 0.34), 0.72, opts.plaque || { bg: '#6e231a', fg: '#f4d374' });
    }

    // Sweeping lower curved roof
    const roof1Y = baseH + colH;
    const roof1H = opts.doubleTier ? 1.55 : 2.55;
    curvedRoof(T, kit, 0, roof1Y, 0, w + 2.4, d + 2.4, roof1H, tile, ridge, eave, 0.32, { dragons: !opts.doubleTier, goldColor: eave });

    if (opts.doubleTier) {
      const tierY = roof1Y + roof1H * 0.82;
      const w2 = w * 0.70, d2 = d * 0.66, h2 = 1.65;
      box(opts.atticColor || 0x873024, 0, tierY + h2 * 0.5, 0, w2, h2, d2);
      for (let i = -2; i <= 2; i++) {
        box(eave, i * (w2 * 0.20), tierY + h2 * 0.5, d2 * 0.5 + 0.04, 0.18, h2 * 0.9, 0.08);
        if (i < 2) box(0x3a2018, (i + 0.5) * (w2 * 0.20), tierY + h2 * 0.55, d2 * 0.5 + 0.04, w2 * 0.13, h2 * 0.48, 0.06);
      }
      curvedRoof(T, kit, 0, tierY + h2, 0, w2 + 2.2, d2 + 2.1, 1.85, tile, ridge, eave, 0.30, { dragons: true, goldColor: eave });
    }

    // Courtyard bronze incense burner (đỉnh hương) & low flanking screen
    if (opts.incense !== false) {
      const iz = d / 2 + 4.4;
      stamp(round, stone, 0, 0.28, iz, 0.95, 0.56, 0.95);
      stamp(round, 0x5c4f3d, 0, 0.92, iz, 0.62, 0.78, 0.62);
      stamp(round, 0x6f5f47, 0, 1.38, iz, 0.76, 0.16, 0.76);
    }
  }

  // Authentic Champa fired-brick tower (Tháp Chăm — Kalan)
  function chamTower(T, kit, x, z, opts = {}) {
    const { box, stamp, tapered, outline } = kit;
    const w = opts.w || 7.6;
    const h = opts.h || 18.0;
    const brick = opts.brick || 0xa7523a;
    const darkBrick = opts.darkBrick || 0x843f2c;
    const sandstone = opts.sandstone || 0xc5b293;
    const octagonal = Boolean(opts.octagonal);

    kit.palette({stone:sandstone,brick:[brick,darkBrick]}, true);
    // Molded brick plinth base (chân đế)
    if (octagonal) {
      stamp(new T.CylinderGeometry(w * 0.62, w * 0.68, 1.4, 8), darkBrick, x, 0.7, z);
      stamp(new T.CylinderGeometry(w * 0.58, w * 0.62, 0.45, 8), sandstone, x, 1.6, z);
    } else {
      box(darkBrick, x, 0.65, z, w + 1.3, 1.3, w + 1.3);
      box(brick, x, 1.55, z, w + 0.65, 0.55, w + 0.65);
    }

    // Main vertical tower body with pilasters (trụ ốp tường)
    const bodyY = 1.8;
    const bodyH = h * 0.44;
    if (octagonal) {
      const shaft = new T.CylinderGeometry(w * 0.53, w * 0.56, bodyH, 8);
      stamp(shaft, brick, x, bodyY + bodyH * 0.5, z);
      shaft.dispose();
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4 + Math.PI / 8;
        box(darkBrick, x + Math.sin(a) * w * 0.55, bodyY + bodyH * 0.5, z + Math.cos(a) * w * 0.55, 0.45, bodyH * 0.94, 0.24, a);
      }
    } else {
      box(brick, x, bodyY + bodyH * 0.5, z, w, bodyH, w);
      for (const s of [-1, 1]) for (const f of [-1, 1]) {
        box(darkBrick, x + s * (w * 0.44), bodyY + bodyH * 0.5, z + f * (w * 0.5 + 0.08), 0.52, bodyH * 0.96, 0.18);
        box(darkBrick, x + f * (w * 0.5 + 0.08), bodyY + bodyH * 0.5, z + s * (w * 0.44), 0.18, bodyH * 0.96, 0.52);
      }
      // Projecting entrance vestibule (tiền sảnh) on +Z with sandstone lintel & pointed pediment
      const vw = w * 0.48, vh = bodyH * 0.86, vd = w * 0.34;
      box(brick, x, bodyY + vh * 0.5, z + w * 0.5 + vd * 0.5, vw, vh, vd);
      box(0x2a1b16, x, bodyY + vh * 0.38, z + w * 0.5 + vd + 0.02, vw * 0.46, vh * 0.64, 0.12);
      box(sandstone, x, bodyY + vh * 0.72, z + w * 0.5 + vd + 0.08, vw * 0.72, 0.42, 0.24);
      // Pointed Champa flame-arch tympanum (vòm cuốn mũi giáo)
      outline([[-vw * 0.48, 0], [-vw * 0.34, 1.3], [0, 2.35], [vw * 0.34, 1.3], [vw * 0.48, 0]],
        darkBrick, x, bodyY + vh * 0.78, z + w * 0.5 + vd * 0.45, vd * 0.6);
      // Blind false doors (cửa giả) on the other 3 facades
      for (const [ang, fx, fz] of [[Math.PI, 0, -1], [Math.PI / 2, 1, 0], [-Math.PI / 2, -1, 0]]) {
        const dist = w * 0.5 + 0.12;
        box(darkBrick, x + fx * dist, bodyY + vh * 0.42, z + fz * dist, vw * 0.78, vh * 0.76, 0.24, ang);
        box(sandstone, x + fx * (dist + 0.08), bodyY + vh * 0.76, z + fz * (dist + 0.08), vw * 0.62, 0.32, 0.16, ang);
        outline([[-vw * 0.38, 0], [-vw * 0.26, 0.95], [0, 1.75], [vw * 0.26, 0.95], [vw * 0.38, 0]],
          darkBrick, x + fx * dist, bodyY + vh * 0.80, z + fz * dist, 0.24, ang);
      }
    }

    // Multi-tiered receding pyramidal Champa roof stories + corner turret finials (tháp góc)
    let curY = bodyY + bodyH;
    const tiers = opts.tiers || 3;
    for (let t = 0; t < tiers; t++) {
      const f = 1 - t * 0.22;
      const tw = w * f;
      const th = (h * 0.40) / tiers;
      // Cornice band
      if (octagonal) {
        const corn = new T.CylinderGeometry(tw * 0.60, tw * 0.55, 0.42, 8);
        stamp(corn, sandstone, x, curY + 0.21, z); corn.dispose();
        const mid = new T.CylinderGeometry(tw * 0.46, tw * 0.54, th, 8);
        stamp(mid, t % 2 ? darkBrick : brick, x, curY + 0.42 + th * 0.5, z); mid.dispose();
      } else {
        box(sandstone, x, curY + 0.18, z, tw + 0.55, 0.36, tw + 0.55);
        box(t % 2 ? darkBrick : brick, x, curY + 0.36 + th * 0.5, z, tw * 0.84, th, tw * 0.84);
        // Corner miniature turrets (tháp nhỏ góc mái)
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
          const tx = x + sx * (tw * 0.44), tz = z + sz * (tw * 0.44);
          box(darkBrick, tx, curY + 0.72, tz, tw * 0.16, 0.85, tw * 0.16);
          tapered(brick, tx, curY + 1.38, tz, tw * 0.11, 0.04, 0.58, 1, 4);
        }
      }
      curY += th + 0.36;
    }

    // Lotus sandstone capstone (đỉnh tháp hoa sen)
    tapered(sandstone, x, curY + 0.85, z, w * 0.22, 0.08, 1.75, 1, octagonal ? 8 : 4);
    const orb = new T.SphereGeometry(w * 0.06, 8, 6);
    stamp(orb, sandstone, x, curY + 1.85, z);
    orb.dispose();
  }

  // Multi-tier octagonal Buddhist stupa / pagoda tower (Tháp bát giác)
  function octagonalTower(T, kit, x, z, opts = {}) {
    const { stamp, tapered } = kit;
    const tiers = opts.tiers || 7;
    const baseR = opts.baseR || 3.6;
    const tierH = opts.tierH || 2.15;
    const wall = opts.wall || 0xd4b68c;
    const tile = opts.tile || 0x894230;
    const trim = opts.trim || 0xb78e4d;

    kit.palette({plaster:wall,tile}, true);
    // Stepped octagonal foundation
    tapered(0x888176, x, 0.55, z, baseR + 1.4, baseR + 1.1, 1.1, 1, 8);
    let curY = 1.1;
    for (let i = 0; i < tiers; i++) {
      const f = 1 - i * (0.52 / tiers);
      const r = baseR * f;
      const h = tierH * (1 - i * 0.04);
      tapered(wall, x, curY + h * 0.5, z, r, r * 0.96, h, 1, 8);
      // Arched dark openings on alternating faces
      for (let k = 0; k < 4; k++) {
        const a = k * Math.PI / 2 + (i % 2 ? Math.PI / 4 : 0);
        kit.box(0x3a2820, x + Math.sin(a) * r * 0.92, curY + h * 0.45, z + Math.cos(a) * r * 0.92, r * 0.34, h * 0.54, 0.14, a);
      }
      // Flared octagonal tiled roof eave
      tapered(tile, x, curY + h + 0.35, z, r * 1.38, r * 0.88, 0.72, 1, 8);
      tapered(trim, x, curY + h + 0.02, z, r * 1.42, r * 1.36, 0.12, 1, 8);
      curY += h + 0.62;
    }
    // Lotus pinnacle spire (chóp hồ lô / búp sen)
    tapered(trim, x, curY + 0.95, z, baseR * 0.24, 0.06, 1.9, 1, 8);
    const orb = new T.SphereGeometry(0.28, 10, 8);
    stamp(orb, 0xd8b153, x, curY + 2.05, z);
    orb.dispose();
  }

  // Coastal Vietnamese Lighthouse (Hải đăng) + keeper house
  function lighthouse(T, kit, opts = {}) {
    const { box, stamp, round, tapered } = kit;
    const h = opts.h || 18;
    const rBase = opts.rBase || 2.55;
    const rTop = opts.rTop || 1.65;
    const body = opts.body || 0xebe6d8;
    const band = opts.band || 0xb53c2e;
    const dome = opts.dome || 0x9c3228;
    const striped = Boolean(opts.striped);
    const octagonal = Boolean(opts.octagonal);
    const sides = octagonal ? 8 : 20;

    kit.palette({plaster:[body,band],metal:[dome,0x3a4042],glass:0xadc6c7}, true);
    // Coastal stone seawall terrace
    box(0x888479, 0, 0.65, 0, 14.5, 1.3, 12.5);
    box(0x9a9588, 0, 1.42, 0, 14.8, 0.24, 12.8);

    // Keeper's house beside the tower
    const kx = -3.8, kz = -0.8;
    box(opts.houseWall || 0xe8dfc8, kx, 3.05, kz, 6.2, 3.4, 5.4);
    gabledRoof(T, kit, kx, 4.78, kz, 6.5, 5.6, 1.65, opts.roofColor || 0x9b4634, 0xd9cdb2, { alongX: true });
    for (const wx of [-5.2, -2.4]) box(0x2e4a47, wx, 3.1, kz + 2.72, 1.05, 1.35, 0.08);
    box(0x5a3525, kx, 2.55, kz + 2.72, 1.15, 2.1, 0.10);

    // Main lighthouse shaft
    const tx = 2.6, tz = 0.2;
    const baseY = 1.5;
    if (striped) {
      const segs = 5, sh = h / segs;
      for (let i = 0; i < segs; i++) {
        const rb = rBase + (rTop - rBase) * (i / segs);
        const rt = rBase + (rTop - rBase) * ((i + 1) / segs);
        tapered(i % 2 === 0 ? body : band, tx, baseY + sh * (i + 0.5), tz, rb, rt, sh + 0.02, 1, sides);
      }
    } else {
      tapered(body, tx, baseY + h * 0.5, tz, rBase, rTop, h, 1, sides);
      tapered(band, tx, baseY + 1.0, tz, rBase + 0.14, rBase + 0.06, 2.0, 1, sides);
    }
    // Small vertical slit windows climbing the shaft
    for (let i = 1; i <= 3; i++) {
      const wy = baseY + (h * i) / 4;
      const wr = rBase + (rTop - rBase) * (i / 4);
      box(0x28373b, tx, wy, tz + wr, 0.42, 0.88, 0.16);
    }

    // Corbelled gallery balcony & iron railing
    const galY = baseY + h;
    tapered(0x7c7b74, tx, galY + 0.28, tz, rTop, rTop + 0.65, 0.56, 1, sides);
    stamp(round, 0xd8d3c6, tx, galY + 0.68, tz, rTop + 0.72, 0.24, rTop + 0.72);
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI * 2 / 12;
      box(0x3a4042, tx + Math.sin(a) * (rTop + 0.62), galY + 1.25, tz + Math.cos(a) * (rTop + 0.62), 0.07, 1.0, 0.07);
    }
    const rail = new T.TorusGeometry(rTop + 0.62, 0.06, 6, 20);
    rail.rotateX(Math.PI / 2);
    stamp(rail, 0x3a4042, tx, galY + 1.72, tz);
    rail.dispose();

    // Glazed lantern room + cupola dome + lightning finial
    // Recess the glazing behind the lantern mullions and gallery rail.
    stamp(round, 0xadc6c7, tx, galY + 1.95, tz, rTop * 0.71, 2.25, rTop * 0.71);
    for(const level of [1.0,2.85])
      stamp(round,0x3a4042,tx,galY+level,tz,rTop*.77,.095,rTop*.77);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      box(0x2f3538, tx + Math.sin(a) * rTop * 0.76, galY + 1.95, tz + Math.cos(a) * rTop * 0.76, 0.09, 2.3, 0.09);
    }
    const cup = new T.SphereGeometry(rTop * 0.82, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55);
    stamp(cup, dome, tx, galY + 3.05, tz);
    cup.dispose();
    stamp(round, 0xd6b050, tx, galY + 3.05 + rTop * 0.82 + 0.75, tz, 0.06, 1.5, 0.06);

    if (opts.title) {
      plaque(T, kit, opts.title, kx, 1.85, 6.32, 3.6, 0.64, { bg: '#f2ead4', fg: '#1d4c63' });
    }
  }

  // Vietnamese Catholic Church / Cathedral (Nhà thờ Gothic / Romanesque / Gỗ Tây Nguyên)
  function gothicChurch(T, kit, opts = {}) {
    const { box, stamp, tapered, outline, round } = kit;
    const w = opts.w || 15;
    const d = opts.d || 32;
    const wall = opts.wall || 0xd6cbb8;
    const trim = opts.trim || 0xf0e7d6;
    const roof = opts.roof || 0x8a4232;
    const dark = opts.dark || 0x332b27;
    const twinTowers = Boolean(opts.twinTowers);
    const towerH = opts.towerH || 24;
    const naveH = opts.naveH || 10.5;

    kit.palette({plaster:[wall,trim],glass:0x3b4e63}, true);
    // Stepped stone forecourt
    box(0x8c877d, 0, 0.4, 1.2, w + 3.0, 0.8, d + 4.8);
    steps(kit, 0, d / 2 + 2.4, w * 0.52, 1.6, 4, 0.2, 0.36, 0x999389);

    // Main nave body & side buttresses
    box(wall, 0, 0.8 + naveH * 0.5, -1.0, w, naveH, d - 2.0);
    gabledRoof(T, kit, 0, 0.8 + naveH, -1.0, w + 0.6, d - 1.6, naveH * 0.52, roof, trim);
    const nBays = Math.max(4, Math.round(d / 5.2));
    for (let i = 0; i < nBays; i++) {
      const bz = -d / 2 + 2.5 + (i / (nBays - 1)) * (d - 6.8);
      for (const s of [-1, 1]) {
        box(trim, s * (w / 2 + 0.22), 0.8 + naveH * 0.45, bz, 0.55, naveH * 0.9, 0.65);
        if (i < nBays - 1) {
          const wz = bz + (d - 6.8) / (nBays - 1) * 0.5;
          box(dark, s * (w / 2 + 0.04), 0.8 + naveH * 0.56, wz, 0.10, naveH * 0.46, 1.35);
          box(0xb58f4e, s * (w / 2 + 0.08), 0.8 + naveH * 0.56, wz, 0.06, naveH * 0.42, 0.10);
        }
      }
    }

    // Front gable facade, pointed portal & rose window
    const fz = d / 2 - 2.0;
    box(wall, 0, 0.8 + naveH * 0.58, fz + 0.45, w + 0.4, naveH * 1.15, 1.1);
    outline([[-w * 0.52, 0], [0, naveH * 0.62], [w * 0.52, 0]], wall, 0, 0.8 + naveH * 1.14, fz - 0.08, 1.05);
    // Pointed main portal
    box(dark, 0, 0.8 + 2.5, fz + 1.02, 3.1, 4.9, 0.18);
    outline([[-2.0, 0], [-1.55, 2.2], [0, 3.6], [1.55, 2.2], [2.0, 0]], trim, 0, 0.8 + 3.0, fz + 0.96, 0.24);
    // Rose window
    stamp(round, trim, 0, 0.8 + naveH * 0.82, fz + 1.02, 1.65, 0.24, 1.65, 0, Math.PI / 2);
    stamp(round, 0x3b4e63, 0, 0.8 + naveH * 0.82, fz + 1.09, 1.32, 0.16, 1.32, 0, Math.PI / 2);

    // Bell tower(s) & crosses
    const positions = twinTowers ? [-w * 0.40, w * 0.40] : [0];
    const tw = twinTowers ? Math.min(4.4, w * 0.30) : Math.min(5.2, w * 0.36);
    for (const tx of positions) {
      const baseTop = 0.8 + towerH * 0.64;
      box(wall, tx, 0.8 + towerH * 0.32, fz + 0.2, tw, towerH * 0.64, tw);
      box(trim, tx, baseTop + 0.14, fz + 0.2, tw + 0.48, 0.30, tw + 0.48);
      // Belfry louver tier
      const bh = towerH * 0.16;
      const bellY=baseTop+.28+bh*.5, half=tw*.44;
      for(const sx of [-1,1])for(const sz of [-1,1])
        box(wall,tx+sx*(half-tw*.09),bellY,fz+.2+sz*(half-tw*.09),tw*.18,bh,tw*.18);
      for(const level of [-1,1])box(trim,tx,bellY+level*bh*.44,fz+.2,tw*.91,bh*.12,tw*.91);
      tapered(0x65583e,tx,bellY,fz+.2,tw*.20,tw*.095,bh*.44,1,16);
      for(const side of [-1,1])for(let j=1;j<=4;j++){
        const sy=bellY+bh*(j/5-.5)*.82;
        box(dark,tx,sy,fz+.2+side*half,tw*.53,.07,.16,0,side*.38);
        box(dark,tx+side*half,sy,fz+.2,.16,.07,tw*.53,0,0,-side*.38);
      }
      // Tall spire & cross
      const spireY = baseTop + 0.28 + bh;
      const spireH = towerH * 0.30;
      tapered(roof, tx, spireY + spireH * 0.5, fz + 0.2, tw * 0.64, 0.12, spireH, 1, 4);
      const cy = spireY + spireH;
      box(0xdab254, tx, cy + 1.25, fz + 0.2, 0.16, 2.5, 0.16);
      box(0xdab254, tx, cy + 1.75, fz + 0.2, 1.35, 0.16, 0.16);
    }

    if (opts.title) {
      plaque(T, kit, opts.title, 0, 0.8 + 5.8, fz + 1.12, Math.min(5.2, w * 0.38), 0.62, { bg: '#efe6cf', fg: '#5a2d24' });
    }
  }

  // French-Indochinese / Civic Heritage Building (Trường học, Bảo tàng, Chợ, Biệt điện)
  function colonialBuilding(T, kit, opts = {}) {
    const { box, outline } = kit;
    const w = opts.w || 28;
    const d = opts.d || 13;
    const floors = opts.floors || 2;
    const floorH = opts.floorH || 4.1;
    const h = floors * floorH;
    const wall = opts.wall || 0xe8c97a;
    const trim = opts.trim || 0xf4ecd8;
    const shutter = opts.shutter || 0x2f5a44;
    const roof = opts.roof || 0x9c4532;
    const bays = opts.bays || Math.max(5, Math.round(w / 3.8));

    kit.palette({plaster:[wall,trim],timber:shutter,glass:0x283538}, true);
    // Raised stone plinth
    box(0x8d877c, 0, 0.45, 0, w + 1.4, 0.9, d + 1.4);
    steps(kit, 0, d / 2 + 1.1, Math.min(6.4, w * 0.28), 1.3, 4, 0.22, 0.32, 0x999286);

    // Main block
    box(wall, 0, 0.9 + h * 0.5, 0, w, h, d);
    // Horizontal molding cornices between floors
    for (let fl = 0; fl <= floors; fl++) {
      box(trim, 0, 0.9 + fl * floorH, 0, w + 0.42, 0.26, d + 0.42);
    }

    // Arched loggia piers + green louvered shutters along front & back
    const bayW = (w - 1.6) / bays;
    for (let i = 0; i <= bays; i++) {
      const px = -w / 2 + 0.8 + i * bayW;
      for (const f of [-1, 1]) {
        box(trim, px, 0.9 + h * 0.5, f * (d / 2 + 0.14), 0.36, h, 0.28);
      }
      if (i < bays) {
        const bx = px + bayW * 0.5;
        for (let fl = 0; fl < floors; fl++) {
          const wy = 0.9 + fl * floorH + floorH * 0.52;
          for (const f of [-1, 1]) {
            box(0x283538, bx, wy, f * (d / 2 + 0.04), bayW * 0.52, floorH * 0.56, 0.10);
            box(trim, bx, wy-floorH*.29, f*(d/2+.13), bayW*.86,.13,.33);
            box(shutter, bx, wy, f*(d/2+.11), .064,floorH*.55,.075);
            box(shutter, bx, wy+floorH*.12, f*(d/2+.11), bayW*.52,.075,.075);
            for (const s of [-1, 1]) {
              const sx=bx+s*bayW*.33;
              box(shutter,sx,wy,f*(d/2+.10),bayW*.17,floorH*.56,.08);
              for(let j=-3;j<=3;j++)
                box(shutter,sx,wy+j*floorH*.067,f*(d/2+.16),bayW*.144,.075,.09,0,f*.45);
            }
          }
        }
      }
    }

    // Pitched hipped / gabled terracotta roof + central pediment / clock dormer
    gabledRoof(T, kit, 0, 0.9 + h + 0.1, 0, w + 0.8, d + 0.8, Math.min(4.2, d * 0.30), roof, trim, { alongX: true });
    // Central projecting classical pediment over main entry
    const pw = Math.min(8.5, w * 0.30);
    box(wall, 0, 0.9 + h * 0.52, d / 2 + 0.55, pw, h * 1.04, 1.1);
    const doorway=Math.min(2.65,pw*.57), jamb=d/2+1.15;
    box(0x283538,0,2.25,jamb,doorway,2.70,.12);
    for(const edge of [-1,1]){
      box(trim,edge*(doorway/2+.10),2.25,jamb+.08,.20,2.70,.24);
      box(shutter,edge*doorway*.23,1.62,jamb+.085,doorway*.44,1.42,.09);
    }
    box(trim,0,3.63,jamb+.10,doorway+.52,.22,.38);
    box(shutter,0,2.25,jamb+.085,.08,2.70,.09);
    outline([[-pw * 0.54, 0], [0, 2.25], [pw * 0.54, 0]], trim, 0, 0.9 + h + 0.15, d / 2 + 0.2, 0.95);
    if (opts.clock) {
      kit.stamp(kit.round, 0xf6f0dc, 0, 0.9 + h + 1.05, d / 2 + 1.18, 0.72, 0.14, 0.72, 0, Math.PI / 2);
      kit.box(0x282828, 0, 0.9 + h + 1.18, d / 2 + 1.27, 0.07, 0.42, 0.05);
      kit.box(0x282828, 0.14, 0.9 + h + 1.05, d / 2 + 1.27, 0.34, 0.07, 0.05);
    }
    if (opts.title) {
      plaque(T, kit, opts.title, 0, 0.9 + h - 0.55, d / 2 + 1.16, Math.min(pw - 0.5, 6.2), 0.78, opts.plaque || { bg: '#f4e6c2', fg: '#782b20' });
    }
  }

  // Heroic Vietnamese Memorial / Victory Monument (Tượng đài & Quảng trường)
  // Sweep elliptical cross sections through the carve. Each section records
  // its centre and the two radii, in fractions of the height of one figure.
  function carving(T, kit, tint, x, y, z, size, yaw = 0) {
    const vertices = [], indices = [];
    function sweep(sections, folds = 0, sides = 16) {
      const first = vertices.length / 3;
      const centres = sections.map(([x, y, z]) => new T.Vector3(x, y, z));
      const axis = new T.Vector3(), side = new T.Vector3(), front = new T.Vector3();
      for (let row = 0; row < sections.length; row++) {
        axis.subVectors(centres[Math.min(row + 1, centres.length - 1)], centres[Math.max(0, row - 1)]).normalize();
        // Looking down an arm or leg, keep the carving's broad faces
        // aligned with the front of the statue as the joint bends.
        side.set(axis.y, -axis.x, 0);
        if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
        side.normalize();
        front.crossVectors(side, axis).normalize();
        const [cx, cy, cz, width, depth] = sections[row];
        for (let j = 0; j < sides; j++) {
          const a = j * Math.PI * 2 / sides;
          const ripple = 1 + folds * (Math.cos(5 * a + row * .36) + .4 * Math.cos(3 * a - row * .47));
          const u = Math.sin(a) * width * ripple, v = Math.cos(a) * depth * ripple;
          vertices.push(cx + u * side.x + v * front.x, cy + u * side.y + v * front.y, cz + u * side.z + v * front.z);
          if (row) {
            const p = first + (row - 1) * sides + j, q = first + (row - 1) * sides + (j + 1) % sides;
            indices.push(p, q, p + sides, q, q + sides, p + sides);
          }
        }
      }
      for (let j = 1; j < sides - 1; j++) {
        const last = first + (sections.length - 1) * sides;
        indices.push(first, first + j + 1, first + j, last, last + j, last + j + 1);
      }
    }
    function finish() {
      const geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      kit.stamp(geo, tint, x, y, z, size, size, size, yaw);
      geo.dispose();
    }
    return { sweep, finish };
  }

  // Trace the photographed front in pixel coordinates. Each form has closed
  // elliptical sections; its rear and end caps retain the sculpture material.
  function photoCarving(T,kit,{photo,backPhoto,width,height,crop=[0,0,width,height],origin,scale,
    position=[0,0,0],tint,forms}) {
    const points=[],uv=[],front=[],back=[],sides=32;
    for(const {z=0,rows} of forms){
      const first=points.length/3;
      for(const [y,left,right,radius,offset=0] of rows){
        for(let j=0;j<sides;j++){
          const angle=j*2*Math.PI/sides,pixel=(left+right+(right-left)*Math.cos(angle))/2;
          points.push((pixel-origin[0])*scale,(origin[1]-y)*scale,z+offset+radius*Math.sin(angle));
          uv.push((pixel-crop[0])/crop[2],1-(y-crop[1])/crop[3]);
        }
      }
      for(let i=0;i<rows.length-1;i++){
        for(let j=0;j<sides;j++){
          const a=first+i*sides+j,b=first+i*sides+(j+1)%sides;
          (j<sides/2?front:back).push(a,b,a+sides,b,b+sides,a+sides);
        }
      }
      const last=first+(rows.length-1)*sides;
      for(let j=1;j<sides-1;j++)back.push(first,first+j+1,first+j,last,last+j,last+j+1);
    }
    const geo=new T.BufferGeometry();
    geo.setAttribute('position',new T.Float32BufferAttribute(points,3));
    geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(front.concat(back));
    geo.addGroup(0,front.length,0);geo.addGroup(front.length,back.length,1);geo.computeVertexNormals();
    const stone=new T.MeshStandardMaterial({color:tint,roughness:.94}),image=stone.clone();
    const mesh=new T.Mesh(geo,[image,stone]);
    mesh.position.set(...position);mesh.castShadow=mesh.receiveShadow=true;kit.group.add(mesh);
    function applyPhoto(material,url){
      let disposed=false;
      material.addEventListener('dispose',()=>{disposed=true;});
      new T.TextureLoader().load(url,texture=>{
        if(disposed){texture.dispose();return;}
        texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
        material.color.setHex(0xffffff);material.map=texture;material.needsUpdate=true;
      });
    }
    applyPhoto(image,photo);
    if(backPhoto)applyPhoto(stone,backPhoto);
    return mesh;
  }

  function statueFigure(T, kit, tint, x, y, z, size, pose = {}) {
    const { sweep, finish } = carving(T, kit, tint, x, y, z, size, pose.yaw);
    // Slight offset at the knees puts the weight on the rear foot. The
    // separately carved shoes and flared trouser hems leave space between legs.
    for (const s of [-1, 1]) {
      if (pose.seated) {
        // Fold the leg back across the opposite calf, under the robe.
        sweep([[s*.058,.49,0,.071,.075],[s*.154,.424,.066,.067,.075],[s*.196,.38,.10,.067,.070],
          [s*.130,.375,.15,.062,.065],[-s*.015,.390,.187,.049,.045],[-s*.115,.420,.162,.030,.055]],.065,20);
      } else if (!pose.robe) {
        const rise = s < 0 ? (pose.stepUp||0) : 0;
        const foot = s < 0 ? .04+rise*.54 : -.017, hip = s * .056, ankle = s * .070;
        sweep([[ankle,.012+rise,foot+.015,.04,.072],[ankle,.025+rise,foot+.017,.042,.071],[ankle,.047+rise,foot,.032,.043]]);
        sweep([[ankle,.038+rise,foot,.039,.037],[ankle,.056+rise,foot,.048,.045],[s*.066,.19+rise*.7,foot*.72,.046,.048],
          [s*.064,.255+rise*.66,foot+.008,.049,.052],[hip,.38,0,.062,.061],[hip,.50,0,.063,.064]],.085);
      }
    }
    if (pose.robe) {
      sweep([[0,.015,0,.153,.090],[0,.041,-.005,.154,.094],[.006,.17,-.010,.141,.09],
        [-.014,.36,-.005,.129,.082],[0,.51,0,.108,.073]],.13,32);
      for(const s of [-1,1]) sweep([[s*.084,.808,-.010,.044,.054],[s*.103,.713,-.035,.042,.052],
        [s*.121,.53,-.035,.032,.052],[s*.107,.34,-.020,.024,.043]],.10);
    }
    const hem = pose.longCoat ? .34 : .43;
    sweep([[0,hem,0,.115,.069],[0,hem+.014,0,.118,.071],[.004,.53,0,.095,.066],[0,.615,0,.087,.061],
      [0,.72,.002,.110,.070],[0,.796,-.007,.126,.064],[0,.819,-.008,.086,.044],[0,.836,0,.040,.041]],.048,24);
    if (pose.jacket) {
      sweep([[0,.45,.069,.003,.003],[.002,.61,.064,.004,.004],[0,.73,.071,.004,.005],[0,.795,.057,.004,.005]],0,8);
      for (const s of [-1,1]) {
        sweep([[s*.014,.790,.055,.004,.004],[s*.041,.805,.051,.009,.006],[s*.039,.822,.036,.005,.005]],0,10);
        for (const py of [.53,.72]) {
          sweep([[s*.043,py,.066,.003,.004],[s*.063,py-.003,.062,.006,.005],[s*.082,py,.055,.003,.004]],0,10);
        }
      }
    } else {
      // Raised folds follow the pull from the shoulder to the belted waist.
      for (const s of [-1,1]) {
        sweep([[s*.081,.782,.044,.003,.004],[s*.055,.711,.064,.006,.006],[s*.029,.651,.057,.004,.004]],0,10);
        sweep([[s*.062,hem+.018,.056,.003,.004],[s*.044,(hem+.60)/2,.064,.008,.008],[s*.022,.599,.060,.003,.003]],0,10);
      }
    }
    // One continuous oval from chin to crown keeps the face smooth in close views.
    sweep([[0,.809,0,.044,.044],[0,.837,0,.037,.040],[0,.861,.004,.035,.037]]);
    sweep([[0,.846,.004,.018,.024],[0,.857,.004,.033,.035],[0,.880,.004,.045,.044],
      [0,.908,.004,.053,.050],[0,.939,.004,.055,.052],[0,.962,.004,.053,.050],
      [0,.982,.004,.044,.042],[0,.995,.004,.028,.027],[0,1,.004,.008,.008]],0,32);
    if (pose.seated || pose.robe) {
      sweep([[0,.957,-.009,.053,.052],[0,.987,-.010,.054,.053],[0,1.006,-.012,.040,.039],
        [0,1.016,-.012,.025,.025],[0,1.040,-.012,.018,.020],[0,1.048,-.012,.007,.008]],.06,24);
    }
    if (pose.beard) sweep([[0,.807,.047,.006,.005],[0,.838,.039,.019,.011],[0,.861,.026,.032,.013],[0,.876,.016,.030,.014]],.10);
    if (pose.headcloth) sweep([[0,.940,-.006,.054,.051],[0,.960,-.007,.058,.055],[0,.988,-.006,.048,.048],[0,1.005,-.010,.016,.024]],.04);
    for (const s of [-1, 1]) {
      const arm = (s < 0 ? pose.rightArm : pose.leftArm) || [[s*.139,.65,.005],[s*.141,.50,.025]];
      const [elbow, wrist] = arm;
      sweep([[s*.102,.788,-.004,.042,.047],[s*.122,.754,0,.041,.043],[...elbow,.035,.038],
        [(elbow[0]+wrist[0])/2,(elbow[1]+wrist[1])/2,(elbow[2]+wrist[2])/2,.033,.035],
        [...wrist,.026,.029]],.045);
      const hand = arm[2] || [wrist[0],wrist[1]-.052,wrist[2]+.006];
      const middle = hand.map((v,i) => (v+wrist[i])*.5);
      sweep([[...wrist,.022,.020],[...middle,.030,.020],[...hand,.022,.014]],0,12);
      sweep([[middle[0]-s*.013,middle[1],middle[2]+.008,.014,.014],
        [hand[0]-s*.027,(hand[1]+middle[1])/2,hand[2]+.012,.009,.011],
        [hand[0]-s*.026,hand[1],hand[2]+.013,.006,.008]],0,8);
      if (s < 0 && pose.openHand) {
        for (let finger=0;finger<4;finger++) {
          const shift=(finger-1.5)*.011;
          sweep([[hand[0]+shift,hand[1]-.004,hand[2],.007,.009],
            [hand[0]+shift*1.25,hand[1]+.025,hand[2]+.005,.006,.007],
            [hand[0]+shift*1.38,hand[1]+.042-Math.abs(shift)*.55,hand[2]+.009,.005,.005]],0,8);
        }
      }
    }
    finish();
  }

  function lotusSeat(T,kit,x,y,z,r,h,pale,shadow) {
    for(let row=0;row<2;row++) {
      const radius=r*(row?.92:1), base=y+row*h*.42;
      for (let i=0;i<16;i++) {
        const a=(i+row*.5)*Math.PI/8;
        const petal=carving(T,kit,row?pale:shadow,x+Math.sin(a)*radius,base,z+Math.cos(a)*radius,1,a);
        petal.sweep([[0,0,-r*.15,r*.102,r*.045],[0,h*.24,-r*.10,r*.170,r*.065],
          [0,h*.58,0,r*.192,r*.076],[0,h*.84,r*.035,r*.116,r*.046],[0,h,r*.063,r*.016,r*.017]],0,16);
        petal.finish();
      }
    }
  }

  function courtAttendant(T,kit,stone,x,y,z,height,yaw,role) {
    const {sweep,finish}=carving(T,kit,stone,x,y,z,height,yaw);
    const guard=role==='guard', civil=role==='civil';
    for(const s of [-1,1]){
      sweep([[s*.067,.001,.025,.041,.072],[s*.067,.028,.025,.044,.072],
        [s*.067,.060,0,.037,.044],[s*.063,.31,0,.041,.049]],.025,12);
    }
    const hem=guard?.23:.081;
    sweep([[0,hem,0,.143,.091],[0,hem+.021,0,.145,.091],[0,.35,0,.124,.078],
      [0,.53,-.003,.102,.073],[0,.68,-.006,.119,.082],[0,.756,-.009,.137,.071],
      [0,.789,-.008,.079,.048],[0,.8,0,.038,.038]],.039,20);
    // The sleeves close around the hands in front of the robe.
    for(const s of [-1,1]){
      sweep([[s*.108,.753,-.005,.050,.054],[s*.133,.705,.008,.052,.060],
        [s*.140,.595,.031,.048,.055],[s*.128,.528,.046,.045,.051],
        [s*.080,.548,.085,.045,.052],[s*.035,.590,.100,.034,.039]],.043,14);
      sweep([[s*.043,.580,.100,.025,.026],[s*.022,.603,.110,.025,.024],
        [s*.004,.612,.108,.015,.019]],0,12);
    }
    sweep([[0,.772,0,.037,.042],[0,.806,.012,.042,.047],[0,.828,.018,.052,.053],
      [0,.860,.016,.058,.058],[0,.891,.007,.057,.057],[0,.908,.003,.047,.048]],0,20);
    if(guard){
      // The outer guard rank at Ứng Lăng wears broad, ribbed conical hats.
      sweep([[0,.888,0,.109,.107],[0,.902,0,.112,.110],[0,.980,0,.024,.024],
        [0,.990,0,.011,.011]],.014,24);
    }else if(civil){
      // Tall, flat-topped court headdress; the square-ended tablet rises above the sleeves.
      sweep([[0,.886,0,.064,.062],[0,.899,-.002,.069,.065],[0,.914,-.008,.060,.059],
        [0,.976,-.013,.057,.047],[0,.988,-.014,.050,.043]],0,16);
      sweep([[0,.570,.109,.013,.010],[0,.610,.111,.017,.011],
        [0,.725,.124,.020,.009],[0,.732,.125,.018,.009]],0,8);
    }else{
      sweep([[0,.885,-.004,.066,.064],[0,.902,-.004,.077,.069],[0,.932,-.007,.068,.063],
        [0,.962,-.008,.045,.046],[0,.974,-.008,.018,.023]],0,20);
    }
    finish();
  }

  function memorialMonument(T, kit, opts = {}) {
    const { box, stamp, tapered, round, wavingFlag } = kit;
    const plazaW = opts.plazaW || 24;
    const plazaD = opts.plazaD || 18;
    const h = opts.h || 16;
    const stone = opts.stone || 0xbcb6aa;
    const darkStone = opts.darkStone || 0x76726b;
    const bronze = opts.bronze || 0x5c4a35;
    const accent = opts.accent || 0xa93829;
    const style = opts.style || 'obelisk'; // 'obelisk' | 'statue' | 'flame' | 'arch'
    kit.palette({stone:[stone,darkStone],metal:bronze});

    // Broad stepped granite plaza
    box(darkStone, 0, 0.28, 0, plazaW, 0.56, plazaD);
    box(stone, 0, 0.72, -0.5, plazaW * 0.78, 0.42, plazaD * 0.74);
    steps(kit, 0, plazaD * 0.38, plazaW * 0.45, 1.5, 4, 0.18, 0.42, stone);

    // Sculpted pedestal & red granite inscription slab
    box(darkStone, 0, 2.2, -1.2, 7.6, 2.7, 5.2);
    box(stone, 0, 3.65, -1.2, 8.2, 0.35, 5.8);
    if (opts.title) {
      plaque(T, kit, opts.title, 0, 2.35, 1.48, 6.4, 0.92, { bg: '#7f241c', fg: '#f4d370' });
    }

    // Flanking stone relief wing walls (bức phù điêu)
    if (opts.wings !== false) {
      for (const s of [-1, 1]) {
        box(stone, s * 7.8, 2.45, -2.6, 7.4, 3.2, 0.95, -s * 0.22);
        box(bronze, s * 7.8, 2.45, -2.06, 6.5, 2.15, 0.14, -s * 0.22);
      }
    }

    if (style === 'statue') {
      opts.sculpt(T, kit, 3.825);
    } else if (style === 'flame') {
      // Stylized rising torch / flame / lotus petals (Truông Bồn, Xô Viết Nghệ Tĩnh)
      const sy = 3.85;
      tapered(accent, 0, sy + h * 0.42, -1.2, 2.3, 0.35, h * 0.84, 0.72, 6);
      for (const s of [-1, 1]) {
        tapered(stone, s * 1.9, sy + h * 0.30, -1.2, 1.35, 0.28, h * 0.60, 0.8, 4);
      }
      const star = new T.OctahedronGeometry(1.05, 0);
      stamp(star, 0xe5b842, 0, sy + h * 0.88, -1.2);
      star.dispose();
    } else {
      // Monumental obelisk / twin-blade victory pylon
      const sy = 3.85;
      tapered(stone, 0, sy + h * 0.45, -1.2, 2.2, 0.65, h * 0.90, 0.82, 4);
      box(accent, 0, sy + h * 0.55, -0.15, 0.85, h * 0.48, 0.22);
      const star = new T.OctahedronGeometry(0.85, 0);
      stamp(star, 0xe8bc45, 0, sy + h * 0.94, -1.2);
      star.dispose();
    }

    // Ceremonial twin flagpoles
    if (opts.flags !== false && wavingFlag) {
      for (const s of [-1, 1]) {
        stamp(round, 0xd8d6ce, s * (plazaW * 0.36), 6.0, plazaD * 0.22, 0.11, 11.4, 0.11);
      }
      wavingFlag(3.2, 2.1, -plazaW * 0.36 + 0.1, 11.5, plazaD * 0.22);
    }
  }

  // Drive-through Steel Truss Bridge (local +X along bridge, piers down to y = -8, ZERO road z-fighting!)
  function steelTrussBridge(T, kit, opts = {}) {
    const { box, stamp, round } = kit;
    const len = opts.len || 180;
    const w = opts.w || 11.5; // total width between outer trusses (clear carriageway inside)
    const halfW = w * 0.5;
    const spans = opts.spans || 3;
    const spanLen = len / spans;
    const archH = opts.archH || 10.5;
    const steel = opts.steel || 0x5c727a;
    const steelDark = opts.steelDark || 0x42545c;
    const pierColor = opts.pierColor || 0x9b9588;
    const arched = opts.arched !== false;

    kit.palette({metal:[steel,steelDark],plaster:pierColor}, true);
    // Deck edge girders & railings strictly outside carriageway (`|z| >= halfW`)
    for (const s of [-1, 1]) {
      box(steelDark, 0, -0.45, s * (halfW + 0.35), len + 2, 0.95, 0.72);
      box(0xb5b0a2, 0, 0.18, s * (halfW + 0.32), len, 0.36, 0.48);
      // Handrail
      box(steel, 0, 1.15, s * (halfW + 0.55), len, 0.10, 0.10);
      for (let x = -len / 2; x <= len / 2; x += 4.5) {
        box(steelDark, x, 0.68, s * (halfW + 0.55), 0.10, 0.95, 0.10);
      }
    }

    // Concrete masonry river piers cleanly below asphalt (`y <= -1.0`)
    for (let i = 0; i <= spans; i++) {
      const px = -len / 2 + i * spanLen;
      box(pierColor, px, -5.2, 0, 3.2, 8.2, w + 3.4);
      box(0x868074, px, -1.25, 0, 3.8, 0.55, w + 4.0);
      // Cutwater noses facing upstream/downstream
      for (const s of [-1, 1]) {
        stamp(round, pierColor, px, -5.4, s * (halfW + 1.7), 1.5, 7.8, 1.5);
      }
    }

    // Truss / arch chords along each span
    const segs = 8;
    for (let sp = 0; sp < spans; sp++) {
      const x0 = -len / 2 + sp * spanLen;
      const dx = spanLen / segs;
      for (let j = 0; j < segs; j++) {
        const xa = x0 + j * dx, xb = xa + dx;
        const ta = j / segs, tb = (j + 1) / segs;
        const ya = arched ? (1.2 + archH * Math.sin(Math.PI * ta)) : (j === 0 ? 1.2 : archH);
        const yb = arched ? (1.2 + archH * Math.sin(Math.PI * tb)) : (j === segs - 1 ? 1.2 : archH);
        for (const s of [-1, 1]) {
          const z = s * (halfW + 0.35);
          // Upper chord
          strut(T, kit, steel, xa, ya, z, xb, yb, z, 0.24);
          // Vertical hangers/posts
          if (j > 0) strut(T, kit, steelDark, xa, 0.2, z, xa, ya, z, 0.14);
          // Diagonal web bracing
          strut(T, kit, steel, xa, 0.2, z, xb, yb, z, 0.13);
        }
        // Overhead wind-bracing portals safely above trucks (`y >= 6.8`)
        if (ya >= 6.8 && j > 0) {
          strut(T, kit, steelDark, xa, ya, -halfW - 0.35, xa, ya, halfW + 0.35, 0.18);
          if (yb >= 6.8) {
            strut(T, kit, steel, xa, ya, -halfW - 0.35, xb, yb, halfW + 0.35, 0.11);
          }
        }
      }
    }
  }

  // Drive-through Cable-Stayed Bridge (Cầu Sông Hàn, Cầu Trần Thị Lý, Cầu Cửa Hội)
  function cableStayedBridge(T, kit, opts = {}) {
    const { box, stamp, round } = kit;
    const len = opts.len || 240;
    const w = opts.w || 16.5;
    const halfW = w * 0.5;
    const pylonH = opts.pylonH || 42;
    const pylonXs = opts.pylonXs || [0];
    const pylonColor = opts.pylonColor || 0xe3dfd4;
    const cableColor = opts.cableColor || 0xcfd6d8;
    const accent = opts.accent || 0x2f7088;
    const tilt = opts.tilt || 0; // non-zero for Cầu Trần Thị Lý's iconic leaning mast!
    const centralMast = Boolean(opts.centralMast); // single median pylon (e.g. Cầu Sông Hàn / Trần Thị Lý)

    kit.palette({metal:cableColor,plaster:pylonColor}, true);
    // Deck edge fascia & pedestrian railings outside driving lanes
    for (const s of [-1, 1]) {
      box(0x888b8c, 0, -0.55, s * (halfW + 0.45), len + 2, 1.05, 0.90);
      box(accent, 0, -0.35, s * (halfW + 0.92), len, 0.42, 0.12);
      box(0xd6d9db, 0, 1.05, s * (halfW + 0.65), len, 0.10, 0.10);
      for (let x = -len / 2; x <= len / 2; x += 6) {
        box(0x7c8488, x, 0.55, s * (halfW + 0.65), 0.10, 1.0, 0.10);
      }
    }
    // River piers under deck (`y <= -1.0`)
    const pierStep = Math.max(45, len / 4);
    for (let x = -len / 2; x <= len / 2 + 1; x += pierStep) {
      box(0x9a968c, x, -5.5, 0, 3.6, 8.8, w + 2.6);
      box(0x827e74, x, -1.25, 0, 4.2, 0.55, w + 3.2);
    }

    // Pylon tower(s) + fan stay cables
    for (const px of pylonXs) {
      const topX = px + Math.sin(tilt) * pylonH;
      const topY = Math.cos(tilt) * pylonH;
      // Foundation pier below pylon
      box(0x8d897f, px, -5.2, 0, 6.2, 8.4, w + 4.2);

      if (centralMast) {
        // Central A-frame / leaning mast rising from narrow median (clear traffic on both sides!)
        strut(T, kit, pylonColor, px, -1.0, -0.85, topX, topY, 0, 1.15);
        strut(T, kit, pylonColor, px, -1.0, 0.85, topX, topY, 0, 1.15);
        stamp(round, accent, topX, topY + 1.2, 0, 0.65, 2.4, 0.65);
      } else {
        // Twin-leg portal / A-frame pylon straddling the roadway cleanly (`|z| >= halfW + 0.8`)
        for (const s of [-1, 1]) {
          const zBase = s * (halfW + 1.15);
          const zTop = opts.aFrame ? s * 1.4 : zBase;
          strut(T, kit, pylonColor, px, -5.0, zBase, topX, topY, zTop, 1.18);
        }
        // Overhead crossbeams safely above traffic
        box(pylonColor, px, Math.max(9.5, pylonH * 0.30), 0, 1.8, 1.6, (opts.aFrame ? w * 0.72 : w + 2.4));
        box(pylonColor, px, pylonH * 0.72, 0, 1.6, 1.5, (opts.aFrame ? w * 0.36 : w + 2.2));
        if (opts.aFrame) box(accent, topX, topY + 0.8, 0, 2.2, 2.2, 3.4);
      }

      // Fan stay cables anchoring along the deck edges (or median)
      const pairs = opts.cables || 8;
      const reach = opts.cableReach || Math.min(len * 0.44, pylonH * 2.15);
      for (const dir of [-1, 1]) {
        for (let i = 1; i <= pairs; i++) {
          const f = i / pairs;
          const ax = px + dir * (10 + f * (reach - 10));
          if (Math.abs(ax) > len * 0.49) continue;
          const cy = pylonH * (0.48 + f * 0.46);
          const cx = px + Math.sin(tilt) * cy;
          const cyReal = Math.cos(tilt) * cy;
          if (centralMast) {
            strut(T, kit, cableColor, cx, cyReal, 0, ax, 0.2, 0, 0.085);
            if (opts.fanEdges) {
              for (const s of [-1, 1]) strut(T, kit, cableColor, cx, cyReal, 0, ax, 0.2, s * (halfW + 0.4), 0.075);
            }
          } else {
            for (const s of [-1, 1]) {
              const zDeck = s * (halfW + 0.55);
              const zAnchor = opts.aFrame ? s * (1.4 + (1 - (cy / pylonH)) * (halfW - 0.25)) : zDeck;
              strut(T, kit, cableColor, cx, cyReal, zAnchor, ax, 0.2, zDeck, 0.085);
            }
          }
        }
      }
    }
  }

  // Drive-through Suspension Bridge (Cầu Thuận Phước, Cầu treo Kon Klor)
  function suspensionBridge(T, kit, opts = {}) {
    const { box } = kit;
    const len = opts.len || 260;
    const w = opts.w || 14;
    const halfW = w * 0.5;
    const towerX = opts.towerX || len * 0.26;
    const towerH = opts.towerH || 42;
    const towerColor = opts.towerColor || 0xd6d3c8;
    const cableColor = opts.cableColor || 0xb5442e;
    const deckColor = opts.deckColor || 0x7b8285;

    // Deck edge beams & railings
    kit.palette({metal:[cableColor,deckColor]}, true);
    for (const s of [-1, 1]) {
      box(deckColor, 0, -0.52, s * (halfW + 0.35), len + 2, 0.98, 0.75);
      box(towerColor, 0, 1.08, s * (halfW + 0.52), len, 0.10, 0.10);
      for (let x = -len / 2; x <= len / 2; x += 5) {
        box(deckColor, x, 0.58, s * (halfW + 0.52), 0.10, 0.98, 0.10);
      }
    }

    // Twin tall suspension portal towers
    for (const tx of [-towerX, towerX]) {
      box(0x8e8a80, tx, -5.2, 0, 4.8, 8.4, w + 3.8);
      for (const s of [-1, 1]) {
        box(towerColor, tx, towerH * 0.5 - 1.0, s * (halfW + 0.95), 1.9, towerH + 2.0, 1.9);
      }
      for (const frac of [0.34, 0.66, 0.96]) {
        const y = Math.max(7.2, towerH * frac);
        box(towerColor, tx, y, 0, 1.45, 1.45, w + 2.2);
      }
    }

    // Parabolic main suspension cables + vertical suspenders across center & side spans
    const segs = 16;
    for (const s of [-1, 1]) {
      const z = s * (halfW + 0.82);
      // Main center span catenary
      for (let i = 0; i < segs; i++) {
        const u0 = -1 + (2 * i) / segs, u1 = -1 + (2 * (i + 1)) / segs;
        const x0 = u0 * towerX, x1 = u1 * towerX;
        const y0 = 3.2 + (towerH - 3.6) * u0 * u0;
        const y1 = 3.2 + (towerH - 3.6) * u1 * u1;
        strut(T, kit, cableColor, x0, y0, z, x1, y1, z, 0.24);
        if (i > 0) strut(T, kit, 0xc8cecf, x0, 0.2, z, x0, y0, z, 0.065);
      }
      // Side anchor backstays
      for (const end of [-1, 1]) {
        const tx = end * towerX, ax = end * (len * 0.49);
        const sideSegs = 6;
        for (let i = 0; i < sideSegs; i++) {
          const f0 = i / sideSegs, f1 = (i + 1) / sideSegs;
          const x0 = tx + (ax - tx) * f0, x1 = tx + (ax - tx) * f1;
          const y0 = towerH * (1 - f0) * (1 - f0) + 1.4;
          const y1 = towerH * (1 - f1) * (1 - f1) + 1.4;
          strut(T, kit, cableColor, x0, y0, z, x1, y1, z, 0.22);
          if (i > 0) strut(T, kit, 0xc8cecf, x0, 0.2, z, x0, y0, z, 0.06);
        }
      }
    }
  }

  // Geometry is owned by the landmark so streaming can release it. The leaf
  // atlas is already shared with the roadside trees and survives site eviction.
  function trees(T, { group }, list) {
    const models = createTreeModels(T);
    const crownScale = { pine: 0.80, palm: 0.68, banyan: 1.03 };
    for (const { x, y = 0, z, h = 7, width, kind = 'banyan' } of list) {
      const variant = models.variantAt(x, z);
      const species = kind === 'banyan' ? 'tree' : kind;
      const geometry = models.geometry(species, true, variant);
      const mesh = new T.Mesh(geometry, kind === 'palm' ? models.palmMaterial : models.material);
      const spread = width ?? h * crownScale[kind];
      mesh.position.set(x, y, z);
      mesh.scale.set(spread, h, spread);
      mesh.rotation.y = x * 0.81 + z * 0.57;
      mesh.castShadow = mesh.receiveShadow = true;
      group.add(mesh);
    }
  }

  window.CentralArch = {
    plaque,
    archPiers,
    vaultedBay,
    curvedRoof,
    gabledRoof,
    strut,
    steps,
    tamQuan,
    vietnameseHall,
    chamTower,
    octagonalTower,
    lighthouse,
    gothicChurch,
    colonialBuilding,
    memorialMonument, carving, photoCarving, statueFigure, lotusSeat,
    courtAttendant,
    steelTrussBridge,
    cableStayedBridge,
    suspensionBridge,
    trees
  };
})();

;
// sights-tay-do.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[18].sites);

;
// sights-trang-an.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[19].sites);

;
// karst-landscapes.js
'use strict';
// Shared limestone geometry for the Phong Nha and Hạ Long visitor scenes.
window.VietnamKarst=(()=>{
  const tau=2*Math.PI;
  // All profiles are exterior visitor-scale reconstructions in metres. Surveyed
  // map pins/paths anchor them; the unmeasured cave sections are interpretive.
  function register(sites, node, settings, build) {
    const id = 'osm-node-'+node, atlas = globalThis.VietnamTourism;
    const site = atlas.byId?.get(id) ?? atlas.entries.find(entry => entry.id===id);
    if (!site) throw Error('Thiếu địa danh '+id);
    const {shots,...data}=settings, c=Math.cos(data.yaw), s=Math.sin(data.yaw);
    const views=shots.map(([name,x,z,height,radius,angle,elevation])=>({
      name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius:radius,viewAngle:data.yaw+angle,viewElevation:elevation
    }));
    sites.push({...site,...data,id,catalogId:id,photo:data.source,views,solids:[],visitOnArrival:true,build});
  }

  // Adjacent samples share their normals. Bedrock, flowstone and river pebbles
  // share one draw and the same photographed mineral texture.
  function batch(T) {
    const positions=[],colors=[],indices=[],color=new T.Color();
    function grid(cols,rows,sample) {
      const first=positions.length/3;
      for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++) {
        const [x,y,z,tint,light=1]=sample(i/cols,j/rows);
        positions.push(x,y,z);color.setHex(tint);
        colors.push(color.r*light,color.g*light,color.b*light);
        if(i&&j){
          const d=first+j*(cols+1)+i,a=d-cols-2,b=a+1,c=d-1;
          indices.push(a,b,c,b,d,c);
        }
      }
    }
    function add(group,material) {
      const g=new T.BufferGeometry();
      g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
      g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
      g.setIndex(indices);g.computeVertexNormals();
      material.side=T.DoubleSide;
      const mesh=new T.Mesh(g,material);mesh.receiveShadow=true;mesh.castShadow=!material.isMeshPhongMaterial;
      group.add(mesh);
    }
    return {grid,add,trees:[],ferns:[]};
  }

  function boulder(rock,x,y,z,rx,h,rz,seed,moss=false) {
    rock.grid(20,7,(u,v)=>{
      const a=u*tau,lat=v*Math.PI/2,r=Math.cos(lat);
      const facets=(1+.10*Math.cos(4*a+seed)+.06*Math.sin(7*a+lat+seed))*r;
      const tint=moss&&v>.42+.12*Math.sin(3*a)?0x77804c:0x99998a;
      return [x+rx*(Math.cos(a)*facets+.1*v),y-.45+h*Math.sin(lat),
        z+rz*(Math.sin(a)*facets-.085*v),tint,.78+.17*v+.08*Math.cos(a+seed)];
    });
  }

  // Shape the mouth from its silhouette and loft actual sidewalls and ceiling
  // behind the lip. Each section is [depth, centre X, half-span, height, floor].
  function grotto(rock,sections,wing,crest,phase,upperWindow=false) {
    const [, ,radius,h,floor]=sections[0];
    function lip(u) {
      const a=(1-u)*Math.PI,relief=1+.075*Math.sin(a*5+phase)+.041*Math.cos(a*11-phase);
      return [radius*Math.cos(a),floor+h*Math.sin(a)**.72*relief,
        (.065*Math.sin(a*4+phase)+.03*Math.sin(11*a))*radius];
    }
    for(let j=0;j<sections.length-1;j++){
      const a=sections[j],b=sections[j+1];
      rock.grid(44,5,(u,v)=>{
        const t=(1-u)*Math.PI,z=a[0]+(b[0]-a[0])*v;
        const [lx,ly,lz]=lip(u),w=a[2]+(b[2]-a[2])*v;
        const rise=a[3]+(b[3]-a[3])*v,base=a[4]+(b[4]-a[4])*v;
        const decay=Math.exp(-z/Math.max(radius*.55,1));
        const scallop=.027*Math.sin(8*t+z*.39+phase)*(1-decay);
        return [a[1]+(b[1]-a[1])*v+lx*w/radius*(1+scallop),
          base+(ly-floor)*rise/h*(1+scallop),-z+lz*decay,
          0xb3a992,(.29+.62*decay)*(.94+.08*Math.cos(t*9+phase))];
      });
      rock.grid(30,5,(u,v)=>{
        const z=a[0]+(b[0]-a[0])*v,span=a[2]+(b[2]-a[2])*v;
        const x=a[1]+(b[1]-a[1])*v+(2*u-1)*span;
        const y=a[4]+(b[4]-a[4])*v;
        return [x,y+.025+.018*Math.sin(x*2.9+z*.5),-z,0x958c73,.24+.56*Math.exp(-z/(radius*.82))];
      });
    }
    const last=sections.at(-1);
    rock.grid(38,5,(u,v)=>{
      const [x,y]=lip(u);
      return [last[1]+x*last[2]/radius,last[4]+(y-floor)*last[3]/h*v,-last[0]-.03,
        0x383934,.68];
    });
    function facade(u,v) {
      const x=(2*u-1)*wing,inside=Math.abs(x)<=radius;
      const angle=Math.acos(Math.max(-1,Math.min(1,x/radius)));
      const [,ey,ez]=lip(1-angle/Math.PI);
      const margin=Math.max(0,Math.min(1,(wing-Math.abs(x))/(wing-radius)));
      const base=inside?ey:floor- (1-margin)*floor-.36;
      const top=crest*(.82+.12*Math.cos(5*u+phase)+.12*Math.sin(11*u-phase))*(.04+.96*margin**.45);
      const y=base+(Math.max(base+.3,top)-base)*v;
      const bed=(y*.43+x*.13+.4*Math.sin(u*9+phase));
      const ledge=(1-Math.abs((bed-Math.floor(bed))*2-1))**2;
      const fold=radius*(.095*Math.sin(9*u+phase)+.065*Math.sin(28*u+v*9)+.07*ledge)*(1-Math.exp(-v*8));
      return [x,y,ez+fold-v*v*radius*.48,margin];
    }
    function cliff(u,v) {
      const [x,y,z,m]=facade(u,v);
      const wet=.5+.5*Math.sin(x*.64+phase)*Math.cos(y*.37+z*.4);
      return [x,y,z,v>.81&&wet>.53?0x758060:0xaaa99b,
        (.80+.17*wet+.07*Math.cos(2.8*y+.6*x))*(.88+.12*m)];
    }
    if(upperWindow){
      // The high daylight opening above the stream at Hang Én is distinct
      // from the lower river entrance. Recess its jambs into the massif.
      function edges(u){
        const dx=(u-.545)/.18,aperture=Math.max(0,1-dx*dx);
        return [.38-.10*aperture,.38+.41*aperture**.66];
      }
      rock.grid(100,9,(u,v)=>cliff(u,v*edges(u)[0]));
      rock.grid(100,9,(u,v)=>cliff(u,edges(u)[1]+v*(1-edges(u)[1])));
      for(const edge of [0,1])rock.grid(42,5,(u,v)=>{
        const t=.365+.36*u, [x,y,z]=facade(t,edges(t)[edge]);
        return [x-v*radius*.43,y+(edge?.7:1.4)*v,z-v*radius,0x888575,1-.72*v];
      });
      rock.grid(42,4,(u,v)=>{
        const t=.365+.36*u,[a,b]=edges(t),[x,y,z]=facade(t,a+(b-a)*v);
        return [x-radius*.43,y+1,z-radius-.06,0x3b3d32,.63];
      });
    }else rock.grid(100,16,cliff);
    // Follow the buried passage around its bend. The outer hillside must stay
    // above the ceiling, including where a narrow entrance opens into a hall.
    function hillside(u,v){
      const [frontX,top,frontZ]=facade(u,1),depth=v*(last[0]+crest*.95);
      const i=sections.findIndex(s=>s[0]>=depth);
      const a=sections[i>0?i-1:i===0?0:sections.length-1];
      const b=sections[i<0?sections.length-1:i];
      const mix=b[0]===a[0]?0:(depth-a[0])/(b[0]-a[0]);
      const x=frontX+a[1]+(b[1]-a[1])*mix;
      const caveHeight=a[3]+(b[3]-a[3])*mix+a[4]+(b[4]-a[4])*mix;
      const crestWeight=Math.min(1,(1-Math.abs(2*u-1))/.5);
      const headroom=(caveHeight+crest*.24)*crestWeight*Math.min(1,depth/Math.max(1,radius));
      const tail=Math.max(0,(depth-last[0])/(crest*.95));
      return [x,(Math.max(headroom,top*(1-v*.38))+.45)*(1-tail*tail)-.45,frontZ-depth];
    }
    rock.grid(62,20,(u,v)=>[...hillside(u,v),0x818a70,.83+.15*Math.sin(u*38+v*4+phase)]);
    for(let n=0;n<44;n++){
      const u=(n*.618034)%1,v=((n*.3877+.08)%1)**1.7;
      const [x,y,z]=hillside(u,v),h=(1.7+crest*.20)*(.65+.50*Math.sin(n*11.1)**2);
      rock.trees.push([x,y-.06,z,h*.93,h,n*2.4]);
    }
    for(let i=0;i<105;i++){
      const u=(i*.61413)%1,v=(i*.4171)%1;
      if(v<.18&&Math.abs(2*u-1)*wing<radius)continue;
      const [x,y,z]=facade(u,.64+.36*v);
      rock.ferns.push([x,y,z+.24,Math.min(1.5,.25+crest*.035)*(1.2+.6*Math.sin(i)**2),i*2.4]);
    }
  }

  function river(T,group,length,centre,width,rapids=false,shelterDepth=0) {
    const water=batch(T);
    water.grid(16,40,(u,t)=>{
      const z=length[0]+(length[1]-length[0])*t;
      const x=centre(z)+(2*u-1)*(width(z)+.38*Math.sin(z*1.8)+.21*Math.cos(z*2.6));
      const ripple=.014*Math.cos(z*2.7+x*.8)+.009*Math.sin(z*1.2-x*3);
      const depth=1-Math.abs(u-.5)*2;
      return [x,.105+ripple,z,depth<.14?0x92997b:depth<.34?0x65a698:0x388d89,
        .86+.12*Math.sin(x*.6+z*.31)+.08*Math.cos(x*4+z)];
    });
    const m=new T.MeshPhongMaterial({vertexColors:true,specular:0x9cc8bd,shininess:52,transparent:true,depthWrite:false});
    const clock={value:0},limits={value:new T.Vector2(...length)},quiet=matchMedia('(prefers-reduced-motion: reduce)');
    m.customProgramCacheKey=()=>(rapids?'phong-nha-riffles':'phong-nha-pool')+shelterDepth;
    m.onBeforeRender=()=>{clock.value=quiet.matches?0:(performance.now()%900000)*.001;};
    m.onBeforeCompile=shader=>{
      shader.uniforms.streamTime=clock;shader.uniforms.ends=limits;
      shader.vertexShader='varying vec2 streamPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nstreamPoint=position.xz;');
      shader.fragmentShader='varying vec2 streamPoint;uniform float streamTime;uniform vec2 ends;\n'+
        shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec2 p=streamPoint;
          float wave=sin(p.y*5.8+p.x*.85-streamTime*2.7+1.9*sin(p.x*.95-p.y*.41));
          float crossWave=sin(p.y*3.4-p.x*2.17-streamTime*2.2);
          float crest=smoothstep(.40,.94,wave)*smoothstep(-.46,.72,crossWave);
          float fade=1.-smoothstep(.22,.87,fwidth(p.y));
          diffuseColor.rgb+=vec3(.048,.07,.063)*crest*fade;
          ${rapids?`float bank=sin(p.y*.59+sin(p.x*1.4))+cos(p.x*1.2+p.y*.37);
            float curl=sin(p.x*12.+p.y*4.5+2.8*sin(p.y*2.3)+2.*crossWave);
            float white=smoothstep(.86,1.8,bank)*smoothstep(.13,.88,wave+.26*crossWave)*smoothstep(-.55,.80,curl);
            diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.57,.66,.60),white*fade*.63);`:''}
          diffuseColor.a*=.94*smoothstep(0.,3.8,min(p.y-ends.x,ends.y-p.y));`);
      if(shelterDepth)shader.fragmentShader=shader.fragmentShader.replace('#include <tonemapping_fragment>',
        `gl_FragColor.rgb*=mix(.065,1.,smoothstep(-${shelterDepth.toFixed(1)},4.,streamPoint.y));\n#include <tonemapping_fragment>`);
    };
    water.add(group,m);
  }

  let fernMap;
  function finish(T,kit,rock,groundProfile) {
    rock.add(kit.group,globalThis.createSightStoneMaterial(T));
    if(rock.ferns.length) {
      const p=[],uv=[],order=[];
      for(const [x,y,z,h,angle] of rock.ferns)for(const off of [0,1.57]){
        const dx=h*.74*Math.cos(angle+off),dz=h*.74*Math.sin(angle+off),i=p.length/3;
        p.push(x-dx,y-.12,z-dz,x+dx,y-.12,z+dz,x+dx,y+h,z+dz,x-dx,y+h,z-dz);
        uv.push(0,0,1,0,1,1,0,1);order.push(i,i+1,i+3,i+1,i+2,i+3);
      }
      if(!fernMap){
        fernMap=new T.TextureLoader().load('streetscape/surfaces/bank-fern.webp');
        fernMap.colorSpace=T.SRGBColorSpace;fernMap.userData.sightShared=true;
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));
      g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(order);g.computeVertexNormals();
      const ferns=new T.Mesh(g,new T.MeshLambertMaterial({color:0xb5c49b,map:fernMap,side:T.DoubleSide,alphaTest:.36}));
      ferns.receiveShadow=true;kit.group.add(ferns);
    }
    if(rock.trees.length)globalThis.createTreeModels(T).grove(kit.group,rock.trees);
    // Follow the same hillside used by the camera and the car. Keep the
    // rest positions across district rebuilds and sample only a coarse lattice.
    let layers,groves,previous;
    kit.group.userData.fitGround=height=>{
      if(!layers){
        groves=kit.group.children.filter(m=>m.isInstancedMesh).map(mesh=>({mesh,rest:mesh.instanceMatrix.array.slice()}));
        layers=kit.group.children.filter(m=>m.geometry?.attributes.position&&!m.isInstancedMesh).map(mesh=>{
          const geometry=mesh.geometry,p=geometry.attributes.position;
          return {geometry,p,baseY:Float32Array.from({length:p.count},(_,i)=>p.getY(i)),mesh};
        });
      }
      const spacing=3,heights=new Map();
      function sample(ix,iz){
        const key=ix+','+iz;
        if(!heights.has(key))heights.set(key,groundProfile?groundProfile(height,ix*spacing,iz*spacing):height(ix*spacing,iz*spacing));
        return heights.get(key);
      }
      if(previous) {
        let changed=false;
        for(const [key,old] of previous){
          const [x,z]=key.split(',').map(Number);
          if(Math.abs(sample(x,z)-old)>.006)changed=true;
        }
        if(!changed)return;
      }
      function lift(x,z){
        x/=spacing;z/=spacing;
        const ix=Math.floor(x),iz=Math.floor(z),u=x-ix,v=z-iz;
        const low=sample(ix,iz)*(1-u)+sample(ix+1,iz)*u;
        const high=sample(ix,iz+1)*(1-u)+sample(ix+1,iz+1)*u;
        return low*(1-v)+high*v;
      }
      for(const {geometry,p,baseY,mesh} of layers) {
        for(let i=0;i<p.count;i++)
          p.setY(i,baseY[i]+lift(mesh.position.x+p.getX(i),mesh.position.z+p.getZ(i)));
        p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();geometry.computeBoundingBox();
      }
      for(const {mesh,rest} of groves){
        const m=mesh.instanceMatrix;
        for(let i=12;i<rest.length;i+=16)m.array[i+1]=rest[i+1]+lift(rest[i],rest[i+2]);
        m.needsUpdate=true;mesh.computeBoundingSphere();
      }
      previous=heights;
    };
  }

  function walkway(T,kit,points,width,height,wood) {
    kit.palette({timber:wood});
    for(let j=1;j<points.length;j++){
      const [ax,az]=points[j-1],[bx,bz]=points[j],dx=bx-ax,dz=bz-az;
      const length=Math.hypot(dx,dz),angle=Math.atan2(dx,dz),nx=dz/length,nz=-dx/length;
      const planks=Math.ceil(length/.24);
      for(let i=0;i<planks;i++) {
        const t=(i+.5)/planks;
        kit.box(wood,ax+t*dx,height,az+t*dz,width,.12,length/planks-.015,angle);
      }
      const bays=Math.ceil(length/2.2);
      for(const side of [-1,1]) {
        const x=ax+side*nx*width*.48,z=az+side*nz*width*.48;
        for(let i=0;i<=bays;i++){
          if(j>1&&i===0)continue;
          kit.box(wood,x+i*dx/bays,height+.08,z+i*dz/bays,.105,2,.105,angle);
        }
        for(const y of [height+.55,height+1.06]) globalThis.CentralArch.strut(T,kit,wood,x,y,z,x+dx,y,z+dz,.052);
      }
    }
  }

  return {register,batch,boulder,grotto,river,finish,walkway};
})();

;
// forest-giants.js
'use strict';
window.VietnamForestGiants=(()=>{
  const tau=2*Math.PI;
  function bark(T){
    const m=new T.MeshStandardMaterial({vertexColors:true,roughness:1});
    m.customProgramCacheKey=()=>'forest-giant-bark';
    m.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec3 barkPoint;varying vec3 barkNormal;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nbarkPoint=position;barkNormal=normal;');
      shader.fragmentShader='varying vec3 barkPoint;varying vec3 barkNormal;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        {vec3 p=barkPoint;
        vec2 along=vec2(p.x+.19*sin(p.z*1.3),p.z+.16*sin(p.x*1.5));
        vec2 uv=along+.039*sin(p.y*2.6+along*7.)+.032*sin(p.y*.71-along*13.);
        vec2 ridges=pow(.5+.5*cos(uv*vec2(29.,33.)),vec2(6.));
        vec2 fine=.5+.5*cos(uv*vec2(87.,91.)+p.y*2.6);
        vec2 normalWeight=abs(barkNormal.zx)+.08;normalWeight/=normalWeight.x+normalWeight.y;
        float fade=1.-smoothstep(.12,.68,max(fwidth(p.x),fwidth(p.z)));
        float fissures=dot(ridges,normalWeight),fibre=dot(fine,normalWeight);
        float stain=sin(p.x*2.4+p.y*.81)*cos(p.z*2.16-p.y*.72);
        diffuseColor.rgb*=1.-.39*fade*fissures+.11*fade*(fibre-.5)+.13*stain;
        float lichen=smoothstep(.34,.79,stain)*(.48+.52*sin(p.y*4.2+p.z*3.1));
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.15,.169,.092),lichen*.26);}
      `);
    };
    return m;
  }
  function limb(T,wood,rows,seed,dead=false,hollow=false,tint=dead?0x8a7559:0x8d8170){
    const curve=new T.CatmullRomCurve3(rows.map(([x,y,z])=>new T.Vector3(x,y,z)));
    const n=Math.max(7,Math.ceil(curve.getLength()*.72)),sides=rows[0][3]>.52?36:18;
    const rings=[];
    for(let i=0;i<=n;i++){
      const t=i/n,k=t*(rows.length-1),j=Math.min(rows.length-2,Math.floor(k)),f=k-j;
      const centre=curve.getPoint(t),up=curve.getTangent(t).normalize();
      const cross=new T.Vector3().crossVectors(up,Math.abs(up.z)>.84?new T.Vector3(1,0,0):new T.Vector3(0,0,1)).normalize();
      rings.push({centre,up,cross,back:new T.Vector3().crossVectors(up,cross),r:rows[j][3]+(rows[j+1][3]-rows[j][3])*f});
    }
    function at(u,i,scale=1,drop=0){
      const {centre,up,cross,back,r}=rings[i],a=u*tau,t=i/n;
      const flute=1+.086*Math.cos(7*a+seed+t*.9)+.046*Math.sin(15*a-t*1.6+seed);
      const broken=hollow?r*(.24*Math.sin(a*6+seed)+.33*Math.sin(a*4-seed))*Math.max(0,1-(1-t)*8):0;
      const p=centre.clone().addScaledVector(cross,r*scale*flute*Math.cos(a)).addScaledVector(back,r*scale*flute*Math.sin(a)).addScaledVector(up,broken-drop);
      return [p.x,p.y,p.z];
    }
    wood.grid(sides,n,(u,v)=>{
      const a=u*tau;
      const grooves=.12*Math.sin(a*12+Math.sin(v*5)*.9+seed)+.091*Math.cos(a*19+v*4.1);
      return [...at(u,Math.round(v*n)),tint,.82+grooves+.13*v];
    });
    if(hollow){
      wood.grid(sides,2,(u,v)=>[...at(u,n,1-v*.25),0xb09a75,.77+.13*Math.sin(u*49+seed)]);
      wood.grid(sides,5,(u,v)=>[...at(u,n,.75-v*.16,v*rows.at(-1)[3]*2.7),0x544735,.77-v*.53]);
      wood.grid(sides,2,(u,v)=>[...at(u,n,.59*(1-v),rows.at(-1)[3]*2.72),0x3e362b,.54]);
    }else{
      wood.grid(sides,1,(u,v)=>[...at(u,n,1-v),tint,.67]);
    }
  }
  function buttress(wood,x,z,angle,length,h,width,seed,dead,tint=dead?0x887051:0x8b8069){
    // Two thin faces rise out of the ground and join along an irregular crest.
    for(const side of [-1,1]){
      wood.grid(38,16,(u,v)=>{
        const a=angle+Math.sin(u*5+seed)*.083*u,spine=(1-u)**1.49*h*(1+.12*Math.sin(u*10+seed)+.065*Math.cos(17*u+seed));
        const along=.68+u*length,thick=(.035+width*(1-u)**.74)*(1-.86*v)*side;
        const warp=Math.sin(u*8.2+seed)*.24*u+side*(1-v)*(.15*Math.sin(u*26+v*5+seed)+.073*Math.sin(16*v+u*13));
        return [x+along*Math.cos(a)+(thick+warp)*Math.sin(a),-.27+v*(spine+.32),
          z+along*Math.sin(a)-(thick+warp)*Math.cos(a),v<.26+.075*Math.sin(u*19)&&Math.cos(u*8+seed)>.06?0x676f47:tint,
          .81+.08*Math.cos(u*29+v+seed)+.10*v];
      });
    }
  }
  function crowns(T,kit,rows){
    const trees=globalThis.createTreeModels(T),pose=new T.Object3D();
    // Reuse photographed canopy layers without duplicating their source trunk.
    for(let v=0;v<3;v++){
      const source=trees.geometry('tree',true,v),g=source.clone(),uv=g.attributes.uv,p=g.attributes.position,faces=[];
      for(let j=0;j<g.index.count;j+=3){
        const a=g.index.getX(j),b=g.index.getX(j+1),c=g.index.getX(j+2);
        if(uv.getY(a)>.126&&Math.max(p.getY(a),p.getY(b),p.getY(c))>.22)faces.push(a,b,c);
      }
      g.setIndex(faces);g.translate(0,-.60,0);source.dispose();
      const bunches=rows.filter((_,i)=>i%3===v),mesh=new T.InstancedMesh(g,trees.material,bunches.length);
      bunches.forEach(([x,y,z,rx,ry,rz,a],i)=>{
        pose.position.set(x,y,z);pose.rotation.y=a;pose.scale.set(rx*2.40,ry*2.74,rz*2.40);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
      });
      mesh.castShadow=mesh.receiveShadow=true;kit.group.add(mesh);
    }
  }
  return {bark,limb,buttress,crowns};
})();

;
// sights-phong-nha.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[20].sites);

;
// sights-ha-long.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[21].sites);

;
// sights-ha-long-islets.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[22].sites);

;
// sights-cai-beo.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[23].sites);

;
// sights-ben-beo.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[24].sites);

;
// sights-huong-tich.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[25].sites);

;
// sights-thien-tru.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[26].sites);

;
// sights-giai-oan-huong-son.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[27].sites);

;
// sights-ben-yen.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[28].sites);

;
// sights-ngu-nhac.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[29].sites);

;
// sights-huynh-thuy-le.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[30].sites);

;
// sights-go-thap.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[31].sites);

;
// sights-hon-yen.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[32].sites);

;
// sights-hon-phu-tu.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[33].sites);

;
// sights-hai-son-tu.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[34].sites);

;
// sights-dam-o-loan.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[35].sites);

;
// sights-bai-mon.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[36].sites);

;
// sights-hon-nua.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[37].sites);

;
// sights-ben-bai-huong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[38].sites);

;
// sights-ganh-da-dia.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[39].sites);

;
// sights-thanh-luong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[40].sites);

;
// sights-luong-van-chanh.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[41].sites);

;
// sights-thap-nhan.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[42].sites);

;
// sights-tuong-niem-nui-nhan.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[43].sites);

;
// sights-bao-tang-phu-yen.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[44].sites);

;
// sights-thac-cay-du.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[45].sites);

;
// sights-vinh-xuan-dai.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[46].sites);

;
// sights-tam-toa-dong-hoi.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[47].sites);

;
// sights-me-suot.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[48].sites);

;
// sights-thanh-dong-hoi.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[49].sites);

;
// sights-dong-hoi-ramparts.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[50].sites);

;
// sights-cau-nhat-le.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[51].sites);

;
// sights-quang-binh-quan.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[52].sites);

;
// sights-thanh-dia-la-vang.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[53].sites);

;
// sights-ben-hoa-thach-han.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[54].sites);

;
// sights-hien-luong-ben-hai.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[55].sites);

;
// sights-nha-trung-bay-hien-luong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[56].sites);

;
// sights-dia-dao-vinh-moc.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[57].sites);

;
// sights-nghinh-phong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[58].sites);

;
// sights-ganh-den.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[59].sites);

;
// sights-mui-rang-dong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[60].sites);

;
// sights-nui-da-bia.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[61].sites);

;
// sights-dam-cu-mong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[62].sites);

;
// sights-ho-dambri.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[63].sites);

;
// sights-nha-vung-ro.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[64].sites);

;
// sights-chua-buu-minh.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[65].sites);

;
// sights-thac-dambri.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[66].sites);

;
// sights-vung-ro.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[67].sites);

;
// sights-bien-ho-che.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[68].sites);

;
// sights-bo-dong-nam-ho-lak.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[69].sites);

;
// sights-nha-day-buon-ma-thuot.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[70].sites);

;
// sights-dinh-lac-giao.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[71].sites);

;
// sights-bien-ho-pleiku.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[72].sites);

;
// sights-ben-thuyen-buon-jun.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[73].sites);

;
// sights-biet-dien-ho-lak.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[74].sites);

;
// sights-lang-sen.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[75].sites);

;
// sights-lang-mo-truong-dinh.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[76].sites);

;
// sights-nam-phuong-linh-tu.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[77].sites);

;
// sights-doc-phu-hai.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[78].sites);

;
// sights-lang-hoa-sa-dec.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[79].sites);

;
// sights-nguyen-sinh-sac.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[80].sites);

;
// sights-vuon-chim-bac-lieu.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[81].sites);

;
// sights-dinh-trung-go-cong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[82].sites);

;
// sights-u-minh-ha.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[83].sites);

;
// sights-pu-luong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[84].sites);

;
// sights-mac-cuu.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[85].sites);

;
// sights-thach-dong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[86].sites);

;
// sights-phu-dung.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[87].sites);

;
// sights-hue-heritage.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[88].sites);

;
// sights-hoi-an.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[89].sites);

;
// sights-yen-tu.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[90].sites);

;
// sights-imperial-hanoi.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[91].sites);

;
// sights-ba-dinh-west.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[92].sites);

;
// sights-ba-dinh-east.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[93].sites);

;
// sights-con-dao.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[94].sites);

;
// sights-hanoi-museums.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[95].sites);

;
// sights-cham-coast.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[96].sites);

;
// sights-cham-remains.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[97].sites);

;
// sights-cao-bang.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[98].sites);

;
// sights-ba-be.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[99].sites);

;
// sights-cuc-phuong.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[100].sites);

;
// sights-cat-tien.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[101].sites);

;
// sights-bach-ma.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[102].sites);

;
// sights-my-son-sanctuary.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[103].sites);

;
// sights-xu-doai.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[104].sites);

;
// sights-tram-chim.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[105].sites);

;
// sights-dong-van-karst.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[106].sites);

;
// sights-mekong-heritage.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[107].sites);

;
// sights-den-hung.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[108].sites);

;
// sights-co-loa.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[109].sites);

;
// sights-dien-bien-heritage.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[110].sites);

;
// sights-nghe-an-more.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[111].sites);

;
// sights-thanh-hoa.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[112].sites);

;
// sights-da-nang-more.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[113].sites);

;
// sights-hue-more.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[114].sites);

;
// sights-bac-trung-bo-more.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[115].sites);

;
// sights-nam-trung-bo-more.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[116].sites);

;
// sights-nghe-an-wave3.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[117].sites);

;
// sights-da-nang-hue-wave3.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[118].sites);

;
// sights-north-central-wave3.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[119].sites);

;
// sights-hoanh-son-quan.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[120].sites);

;
// sights-khu-mo-vo-nguyen-giap.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[121].sites);

;
// sights-ao-ba-om.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[122].sites);

;
// sights-bao-tang-khmer-tra-vinh.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[123].sites);

;
// sights-chua-ang.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[124].sites);

;
// sights-chua-hang.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[125].sites);

;
// sights-vung-chua.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[126].sites);

;
// sights-south-highlands-wave3.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[127].sites);

;
// sights-van-mieu-tran-bien.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[128].sites);

;
// sights-dong-nai-bien-hoa.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[129].sites);

;
// sights-dong-nai-east.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[130].sites);

;
// sights-dong-nai-north.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[131].sites);

;
// sights-dong-nai-bien-hoa-center.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[132].sites);

;
// tam-chuc-dien.js
'use strict';
(()=>{
  const timber=0x704733,deepWood=0x50382f,stone=0xb3afa0,lightStone=0xc5c1b4;
  const tiles=[0x605e58,0x67635c,0x65615b,0x6b6761], ridge=0x8f897b;
  // The three halls share a traditional roof construction. Each surface has a
  // bowed slope, four lifted eaves, a solid fascia, hips and a decorated ridge.
  function hipRoof(T,{box,stamp,outline},w,d,y,rise){
    const halfRidge=Math.max(w*.22,(w-d)*.5),corners=[[-1,-1],[-1,1],[1,1],[1,-1]];
    const surfaces=tiles.map(()=>[]),soffit=[],thickness=.48;
    function vertex(side,u,t){
      const a=corners[side],b=corners[(side+1)%4],vx=a[0]+(b[0]-a[0])*u,vz=a[1]+(b[1]-a[1])*u;
      return [vx*(halfRidge+(w/2-halfRidge)*t),y+rise*(1-t**.63)+Math.min(2.75,rise*.35)*(Math.abs(vx*vz)**5)*t**3,vz*d*.5*t];
    }
    for(let side=0;side<4;side++){
      const cols=side%2?48:26,rows=6;
      for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
        const a=vertex(side,i/cols,j/rows),b=vertex(side,(i+1)/cols,j/rows);
        const c=vertex(side,(i+1)/cols,(j+1)/rows),e=vertex(side,i/cols,(j+1)/rows);
        const surface=surfaces[(i+Math.floor(i/6)+Math.floor(j/3))%tiles.length];
        surface.push(...a,...e,...b,...b,...e,...c);
        for(const p of [a,b,e,b,c,e])soffit.push(p[0],p[1]-thickness,p[2]);
        if(j===rows-1)surfaces[0].push(...e,e[0],e[1]-thickness,e[2],...c,...c,e[0],e[1]-thickness,e[2],c[0],c[1]-thickness,c[2]);
      }
      const tip=vertex(side,0,1),[sx,sz]=corners[side];
      outline([[0,-.26],[1.1,-.06],[2.1,.64],[2.96,2.08],[2.8,2.26],[2.23,1.46],[2.28,2.06],[1.7,1.84],[1.16,.94],[.4,.62],[-.15,.45]],
        ridge,...tip,.3,Math.atan2(-sz,sx));
    }
    for(const [vertices,color] of [...surfaces.map((v,i)=>[v,tiles[i]]),[soffit,deepWood]]){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.computeVertexNormals();
      stamp(g,color,0,0,0);g.dispose();
    }
    box(ridge,0,y+rise+.17,0,halfRidge*2+.4,.45,.6);
    for(const side of [-1,1])outline([[0,0],[1.5,.15],[2.4,1.05],[2.15,1.33],[1.36,.78],[.65,.96],[-.45,.5]],ridge,side*(halfRidge-.7),y+rise,0,.35,side===1?0:Math.PI);
  }

  function stairTerrace({box},w,d,level,foundations,deckHeight){
    const slabW=w+6,slabD=d+7;
    const deck=foundations.fixture(deckHeight,()=>{
      box(0x8c887d,0,level/2-.2,0,slabW,level+.4,slabD);
      box(stone,0,level-.10,0,slabW+.5,.24,slabD+.5);
      for(const side of [-1,1])for(let n=0;n<=4;n++){
        const x=side*(w*.265+n*(slabW/2-w*.265)/4),z=slabD/2;
        box(0xa9a599,x,level+.72,z,.52,1.45,.5);box(lightStone,x,level+1.49,z,.64,.23,.62);
        if(n<4)box(lightStone,x+side*(slabW/2-w*.265)/8,level+1.22,z,(slabW/2-w*.265)/4,.24,.27);
      }
    });
    foundations.skirt(0,0,slabW-.03,slabD-.03,-.3,deck);
    const count=Math.ceil(level/.27),step=level/count;
    for(let j=0;j<count;j++){
      const h=(j+1)*step,z=slabD/2+(count-j-.5)*.51;
      const stepAnchor=foundations.fixture(ground=>{
        const entry=ground(0,slabD/2+count*.51),t=(j+.5)/count;
        return entry*(1-t)+deck.height*t;
      },()=>{
        box(j%2?stone:lightStone,0,h/2,z,w*.46,h,.53);
        for(const side of [-1,1])box(0xa19c8c,side*w*.237,h/2+.22,z,.7,h+.44,.54);
      });
      foundations.skirt(0,z,w*.46-.03,.51,.03,stepAnchor);
    }
    return deck;
  }
  function veranda(T,kit,width,depth,base,height,bays){
    const {box,stamp}=kit,post=new T.CylinderGeometry(1,1.07,1,8),widthInside=width-5,depthInside=depth-5;
    box(deepWood,0,base+height/2,0,widthInside,height,depthInside);
    box(0x835b40,0,base+height-.25,0,width+.42,.6,depth+.42);
    function column(x,z){
      box(stone,x,base+.17,z,.95,.34,.95);stamp(post,timber,x,base+height/2,z,.4,height,.4);
      box(0x916546,x,base+height-.57,z,1.43,.42,1.09);
    }
    for(const s of [-1,1]){
      for(let i=0;i<=bays;i++){
        const x=(i/bays-.5)*width;column(x,s*depth/2);
        if(i===bays)continue;
        const bay=width/bays,mid=x+bay/2,z=s*(depthInside/2+.10);
        for(let j=0;j<4;j++){
          const px=mid+(j-1.5)*bay*.186;
          box(j%2?0x684635:0x77513a,px,base+height*.48,z,bay*.174,height*.83,.17);
          box(0x39362e,px,base+height*.64,z+s*.12,bay*.141,height*.30,.08);
          box(timber,px,base+height*.64,z+s*.17,.10,height*.29,.08);
        }
      }
      for(let j=1;j<4;j++)column(s*width/2,depth*(j/4-.5));
    }
    post.dispose();
  }

  function hall(T,kit,plan){
    const {w,d,base,tiers,bays}=plan,foundations=createTempleFoundations(T,kit);
    function deckHeight(ground){
      // A level floor clears the uphill corners; the stair foot meets the forecourt.
      let height=ground(0,0);
      for(const x of [-w/2-3,0,w/2+3])for(const z of [-d/2-3.5,0,d/2+3.5])height=Math.max(height,ground(x,z)-base+.12);
      return height;
    }
    const deck=stairTerrace(kit,w,d,base,foundations,deckHeight);
    foundations.fixture(()=>deck.height,()=>{
      let floor=base;
      for(const [ww,dd,eave,top] of tiers){
        veranda(T,kit,ww-5,dd-5,floor,eave-floor+.25,bays);
        hipRoof(T,kit,ww,dd,eave,top-eave);
        floor=eave+(top-eave)*.50;
      }
    });
    if(plan.cauldronZ)foundations.fixture(g=>g(0,plan.cauldronZ),()=>cauldron(T,kit,plan.cauldronZ));
  }
  function cauldron(T,{stamp,box},z){
    const profile=[[.8,.45],[.98,.62],[1.7,1.05],[2.10,1.85],[2.03,2.30],[1.88,2.54],[2.15,2.63],[2.14,2.79],[1.8,2.77],[1.65,2.51]].map(([x,y])=>new T.Vector2(x,y));
    const bowl=new T.LatheGeometry(profile,24);
    stamp(bowl,0x35392e,0,0,z);bowl.dispose();
    for(const s of [-1,1]){
      box(0x443e30,s*1.86,3.05,z,.25,1,.45);
      box(0x443e30,s*1.53,3.49,z,.89,.23,.45);
      box(0x443e30,s*1.18,3.12,z,.2,.86,.45);
    }
    for(let i=0;i<3;i++){const a=i*2*Math.PI/3;box(0x373a30,Math.cos(a)*.94,.35,z+Math.sin(a)*.94,.54,.76,.54);}
  }
  const common={
    complex:'tam-chuc',city:'Kim Bảng',province:'Ninh Bình',region:'Bắc Bộ',yaw:2.38,gardenRadius:150,
    photo:'https://thesmartlocal.com/vietnam/tam-chuc-pagoda/',
    source:'https://vietnamtourism.gov.vn/en/printer/15748?type=1'
  };
  (window.VietnamSights??=[]).push({
    ...common,id:'dien-quan-am',tourOrder:3,name:'Điện Quan Âm',lon:105.795991,lat:20.553143,
    map:'https://www.openstreetmap.org/way/1386126640',start:[105.79362,20.55243],width:68,depth:56,
    solids:[[0,0,26.9,13.5]],description:'Qua Vườn Cột Kinh, những bậc đá dẫn lên điện thờ Quan Âm. Từ hiên điện, trục bậc thềm nhìn thẳng ra sân cột kinh và mặt hồ.',
    build(T,kit){hall(T,kit,{w:61,d:34,base:2.4,bays:9,tiers:[[61,34,8.9,15.6],[51.2,26.4,13.7,22.4]]});}
  },{
    ...common,id:'dien-phap-chu',tourOrder:4,name:'Điện Pháp Chủ',lon:105.795185,lat:20.552322,
    map:'https://www.openstreetmap.org/way/1386126642',start:[105.79376,20.55191],width:71,depth:65,
    solids:[[0,0,28.5,20]],description:'Điện Pháp Chủ nằm ở giữa trục hành lễ. Dưới hai tầng mái cong là pho tượng Phật Thích Ca và những phù điêu kể về cuộc đời Đức Phật.',
    build(T,kit){hall(T,kit,{w:64,d:48,base:3.1,bays:9,tiers:[[64,48,11.8,20.6],[52.5,36,18.0,29.2]]});}
  },{
    ...common,id:'dien-tam-the',tourOrder:5,name:'Điện Tam Thế',lon:105.794355,lat:20.551562,
    map:'https://www.openstreetmap.org/way/1386126641',start:[105.793850,20.551377],width:84,depth:77,
    solids:[[0,0,34.4,22.1],[0,37,2.1,2.1]],description:'Điện Tam Thế có ba tầng mái và thờ ba pho Phật tượng trưng cho quá khứ, hiện tại và tương lai. Trước bậc thềm là chiếc vạc đồng lớn.',
    build(T,kit){hall(T,kit,{w:75,d:51,base:3.5,bays:11,cauldronZ:37,tiers:[[75,51,11.2,20.0],[65,41,18.45,27.2],[55.7,32.1,25.35,38.6]]});}
  });
})();

;
// tam-chuc-san.js
'use strict';
(() => {
  const yaw=2.39;
  const approach=[105.797968,20.555006];
  const common={city:'Kim Bảng',province:'Ninh Bình',region:'Bắc Bộ',complex:'tam-chuc',yaw,start:approach,
    source:'https://vietnamtourism.gov.vn/en/printer/15748?type=1'};
  const gatePosts=[];
  const towers=[[-35.3,22,18],[-2.8,25.4,22],[34.5,24,18]];
  const galleries=[[-19.9,13.8,10.4],[16.1,14.2,10.4]];
  for(const [x,w,d] of [...towers,...galleries]){
    for(const face of [-1,1])for(let i=0;i<4;i++)gatePosts.push([x-w*.39+i*w*.26,face*d*.38,.55,.55]);
  }
  function gate(T,kit){
    const {stamp,box,outline}=kit,foundations=createTempleFoundations(T,kit);
    const timber=0x51382b,lacquer=0x79523b,stone=0x9b998c,tile=0x65594d;
    const post=new T.CylinderGeometry(1,1,1,10);
    const postAt=(x,y,z,h,r)=>{
      box(stone,x,y+.15,z,r*2.75,.3,r*2.75);
      stamp(post,timber,x,y+h/2,z,r,h,r);
      box(lacquer,x,y+h-.24,z,r*3.6,.46,r*3.6);
    };
    // Sweep both roof hips up into the four lifted corner rafters.
    function roof(cx,y,w,d,rise){
      const vertices=[],colors=[],soffit=[],thickness=.24;
      const halfW=w/2,halfD=d/2,ridge=Math.max(w*.23,halfW-halfD*.92);
      const corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
      for(let side=0;side<4;side++){
        const a=corners[side],b=corners[(side+1)%4],divisions=side%2?8:18;
        function sample(u,v){
          const x=a[0]+u*(b[0]-a[0]),z=a[1]+u*(b[1]-a[1]);
          const lift=Math.pow(Math.abs(x*z),5)*Math.pow(v,2.4)*rise*.54;
          return [cx+x*(ridge+(halfW-ridge)*v),y+rise*(1-Math.pow(v,.70))+lift,z*halfD*v];
        }
        for(let i=0;i<divisions;i++)for(let j=0;j<5;j++){
          const u=i/divisions,v=j/5,un=(i+1)/divisions,vn=(j+1)/5;
          const p=sample(u,v),q=sample(un,v),r=sample(un,vn),s=sample(u,vn);
          const bucket=(i%3===0?colors:vertices);
          // Corners wind clockwise in the horizontal XZ plane.
          bucket.push(...p,...q,...s,...q,...r,...s);
          for(const pnt of [p,s,q,q,s,r])soffit.push(pnt[0],pnt[1]-thickness,pnt[2]);
          if(j===4)vertices.push(...s,...r,r[0],r[1]-thickness,r[2],...s,r[0],r[1]-thickness,r[2],s[0],s[1]-thickness,s[2]);
        }
        const [sx,sz]=a;
        outline([[0,0],[.75,.1],[1.4,.61],[2.08,1.88],[1.89,1.99],[1.37,1.24],[1.26,1.61],[.83,1.1],[.28,.64],[-.19,.48]],
          0x60584d,cx+sx*halfW,y+rise*.54,sz*halfD,.21,Math.atan2(-sz,sx));
      }
      for(const [v,c] of [[vertices,tile],[colors,0x706357],[soffit,timber]]){
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.computeVertexNormals();stamp(g,c,0,0,0);g.dispose();
      }
      box(0x5a5149,cx,y+rise+.11,0,ridge*2+.18,.30,.32);
    }
    function eaves(cx,y,w,d,h,upper){
      for(const side of [-1,1]){
        const z=side*d*.38;
        box(lacquer,cx,y+h-.29,z,w*.86,.64,.53);
        for(let i=0;i<4;i++)postAt(cx-w*.39+i*w*.26,y,z,h,.45);
        if(upper){
          box(0x4f352a,cx,y+h*.49,side*d*.27,w*.70,h*.87,.4);
          for(let k=-3;k<=3;k++){
            box(0x342d27,cx+k*w*.09,y+h*.5,side*(d*.27+.27),w*.065,h*.56,.10);
            box(lacquer,cx+k*w*.09,y+h*.5,side*(d*.27+.37),.09,h*.59,.09);
          }
          box(timber,cx,y+.78,z,w*.8,.15,.17);
          for(let k=-8;k<=8;k++)box(lacquer,cx+k*w*.047,y+.46,z,.11,.64,.13);
        }
      }
      for(const side of [-1,1])box(timber,cx+side*w*.39,y+h-.29,0,.53,.64,d*.78);
    }
    for(const [x,w,d] of towers){
      const center=x===towers[1][0];
      const anchor=foundations.fixture(g=>g(x,0),()=>{
        eaves(x,.2,w,d,5.6,false);roof(x,5.65,w+3,d+1.8,3.3);
        eaves(x,8.1,w*.77,d*.77,3.85,true);roof(x,11.8,w*.90,d*.89,3.5);
        if(center){eaves(x,14.35,w*.56,d*.55,3.35,true);roof(x,17.6,w*.70,d*.68,3.6);}
      });
      foundations.walk(w+.9,d+.6,x);
      for(const side of [-1,1])for(let i=0;i<4;i++){
        foundations.skirt(x-w*.39+i*w*.26,side*d*.38,1.19,1.19,.23,anchor);
      }
    }
    for(const [x,w,d] of galleries){
      const anchor=foundations.fixture(g=>g(x,0),()=>{
        eaves(x,.15,w,d,4.75,false);roof(x,4.76,w+1.3,11.9,2.42);
      });
      for(const side of [-1,1])for(let i=0;i<4;i++){
        foundations.skirt(x-w*.39+i*w*.26,side*d*.38,1.19,1.19,.18,anchor);
      }
    }
    post.dispose();
  }
  const pillars=[];
  for(const side of [-1,1])for(let row=0;row<4;row++)for(let col=0;col<4;col++){
    pillars.push([side*(11+col*11.8),(row-1.5)*12.1]);
  }
  function court(T,kit){
    const {box,stamp,tapered,group}=kit,foundations=createTempleFoundations(T,kit);
    const grey=0xa4a79d,rock=0x93988f,shade=0x737d73;
    foundations.walk(9.3,68);
    const petal=new T.SphereGeometry(1,7,4);
    const bud=new T.LatheGeometry([[0,0],[.54,.07],[.68,.49],[.57,.88],[.24,1.3],[0,1.74]].map(([r,y])=>new T.Vector2(r,y)),10);
    // A single shared inscription texture preserves readable vertical lettering up close.
    const cloth=document.createElement('canvas');cloth.width=256;cloth.height=512;
    const ctx=cloth.getContext('2d');ctx.fillStyle='#98745b';ctx.fillRect(0,0,256,512);
    ctx.strokeStyle='#d2b16b';ctx.lineWidth=5;ctx.strokeRect(8,8,240,496);
    ctx.fillStyle='#e4c682';ctx.textAlign='center';ctx.font='bold 44px "Times New Roman", "Noto Serif", serif';
    for(const [i,word] of ['TÂM','AN','VẠN','SỰ','AN'].entries())ctx.fillText(word,128,83+i*83);
    const texture=new T.CanvasTexture(cloth);texture.colorSpace=T.SRGBColorSpace;
    const panels=new T.InstancedMesh(new T.PlaneGeometry(1.03,7.3),
      new T.MeshLambertMaterial({map:texture}),pillars.length*6);
    const pose=new T.Object3D();let index=0;
    for(const [x,z] of pillars){
      const firstPanel=index;
      const anchor=foundations.fixture(g=>g(x,z),()=>{
        box(0x979887,x,.23,z,6.1,.32,6.1);
        tapered(rock,x,.62,z,2.53,2.53,.55,1,12);
        tapered(grey,x,1.14,z,2.32,1.94,.67,1,12);
        for(let i=0;i<10;i++){
          const a=Math.PI*i/5;
          stamp(petal,i%2?rock:grey,x+1.85*Math.sin(a),1.19,z+1.85*Math.cos(a),.58,.73,.42,a,.24);
        }
        tapered(shade,x,1.80,z,1.75,1.54,.66,1,8);
        tapered(grey,x,6.17,z,1.29,1.24,8.44,1,6);
        for(let face=0;face<6;face++){
          const a=Math.PI*(face+.5)/3;
          pose.position.set(x+1.123*Math.sin(a),6.25,z+1.123*Math.cos(a));pose.rotation.y=a;pose.updateMatrix();
          panels.setMatrixAt(index++,pose.matrix);
        }
        tapered(rock,x,10.65,z,1.34,1.45,.58,1,8);
        tapered(grey,x,11.22,z,1.34,.96,.62,1,10);
        tapered(shade,x,11.62,z,.86,.76,.22,1,10);
        stamp(bud,grey,x,11.75,z);
      },height=>{
        const m=new T.Matrix4();
        for(let face=0;face<6;face++){
          panels.getMatrixAt(firstPanel+face,m);m.elements[13]=6.25+height;panels.setMatrixAt(firstPanel+face,m);
        }
        panels.instanceMatrix.needsUpdate=true;panels.boundingSphere=null;
      });
      foundations.skirt(x,z,6.06,6.06,.15,anchor);
    }
    for(const x of [-30,30])for(const z of [-27.5,27.5])for(let i=0;i<8;i++){
      const w=43/8,px=x+(i-3.5)*w;
      const anchor=foundations.fixture(g=>g(px,z),()=>{
        box(0xb4b3a5,px,.19,z,w,.23,2.9);
        box(0x516549,px,.61,z,w-.08,.79,2.5);
      });
      foundations.skirt(px,z,w-.03,2.87,.13,anchor);
    }
    panels.instanceMatrix.needsUpdate=true;group.add(panels);petal.dispose();bud.dispose();
  }
  (window.VietnamSights??=[]).push({
    ...common,id:'tam-quan-noi-tam-chuc',name:'Cổng Tam Quan nội',tourOrder:1,
    lon:105.797683,lat:20.554722,width:99,depth:29,solids:gatePosts,
    description:'Từ bến hồ nhìn vào, lầu giữa nổi lên với ba lớp mái cong. Hai lầu bên thấp hơn nối với lầu giữa bằng hành lang gỗ mở ra sân cột kinh.',
    photo:'https://pystravel.vn/tin/17354-ban-do-chua-tam-chuc.html',map:'https://www.openstreetmap.org/way/1386126630',build:gate
  },{
    ...common,id:'vuon-cot-kinh',name:'Vườn Cột Kinh',tourOrder:2,
    lon:105.796975,lat:20.554066,width:118,depth:68,solids:pillars.map(([x,z])=>[x,z,2.35,2.35]),
    description:'Hai cụm cột đá mở một lối giữa hướng về điện Quan Âm. Mỗi cột vươn lên từ đài sen, thân sáu cạnh mang chữ và kết thúc bằng một nụ sen đá.',
    photo:'https://danviet.vn/kham-pha-vuon-cot-kinh-bang-da-doc-dao-o-ngoi-chua-lon-nhat-the-gioi-77771055006-d789265.html',
    map:'https://www.openstreetmap.org/way/1518302470',build:court
  });
})();

;
// tam-chuc-nui-ho.js
'use strict';
(()=>{
  // Four pitched faces share a short ridge and lift at the four corners.
  // The longitudinal ribs follow the same surface as the small tile courses.
  function roof(T,k,x,y,z,width,depth,height,yaw,tiles,ridge,stone=false){
    const pos=[],rgb=[],color=new T.Color(),sn=Math.sin(yaw),cs=Math.cos(yaw);
    const a=width/2,b=depth/2,r=Math.max(.1,a-b*.87);
    const outer=[[-a,b],[a,b],[a,-b],[-a,-b]],peak=[[-r,0],[r,0],[r,0],[-r,0]];
    function point(face,s,t){
      const next=(face+1)%4,sx=outer[face][0]*(1-s)+outer[next][0]*s,sz=outer[face][1]*(1-s)+outer[next][1]*s;
      const top=peak[face][0]*(1-s)+peak[next][0]*s;
      const u=sx*(1-t)+top*t,v=sz*(1-t);
      const lift=height*.22*Math.pow(Math.abs(s*2-1),4)*Math.pow(1-t,2);
      return new T.Vector3(x+cs*u+sn*v,y+height*t*(.73+.27*t)+lift,z-sn*u+cs*v);
    }
    function triangle(a,b,c,tint){color.setHex(tint);for(const v of [a,b,c]){pos.push(v.x,v.y,v.z);rgb.push(color.r,color.g,color.b);}}
    function rib(p,q,width){
      const d=q.clone().sub(p),m=q.clone().add(p).multiplyScalar(.5);
      const ang=Math.atan2(d.x,d.z),slope=-Math.atan2(d.y,Math.hypot(d.x,d.z));
      k.box(ridge,m.x,m.y+.05,m.z,width,width*.72,d.length()+.06,ang,slope);
    }
    for(let f=0;f<4;f++){
      const bays=Math.max(8,Math.round((f%2?depth:width)/.58)),rows=5;
      for(let b=0;b<bays;b++)for(let j=0;j<rows;j++){
        const p=point(f,b/bays,j/rows),q=point(f,(b+1)/bays,j/rows);
        const u=point(f,b/bays,(j+1)/rows),v=point(f,(b+1)/bays,(j+1)/rows);
        const tint=tiles[(b*7+j*3+f)%tiles.length];triangle(p,q,u,tint);triangle(q,v,u,tint);
        if(!j)rib(p,q,stone?.17:.15);
        if(!b)rib(p,u,stone?.22:.23);
      }
    }
    rib(point(0,0,1),point(0,1,1),stone?.2:.28);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(rgb,3));g.computeVertexNormals();
    const mesh=new T.Mesh(g,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}));mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);
  }
  function summit(T,k){
    const foundation=createTempleFoundations(T,k);
    const roofStart=k.group.children.length;
    const platform=foundation.fixture(ground=>{
      let highest=ground(0,0);
      for(const u of [-8.4,0,8.4])for(const v of [-7.1,0,7.1])highest=Math.max(highest,ground(u,v));
      return highest;
    },()=>summitStonework(T,k),height=>{
      for(const roof of roofs)roof.position.y=height;
    });
    const roofs=k.group.children.slice(roofStart);
    foundation.skirt(0,0,16.8,14.2,.6,platform);
  }
  function summitStonework(T,k){
    const {box,tapered,stamp,round}=k,red=0xa55445,sand=0xc98671,dark=0x643a33,basalt=0x6c665c;
    const boulder=new T.DodecahedronGeometry(1,0);
    for(let i=0;i<19;i++){
      const angle=i*Math.PI*2/19;
      stamp(boulder,i%3?0x827f71:0x777568,Math.sin(angle)*7.4,-.15,Math.cos(angle)*6.4,2.1+(i%4)*.25,1.7+(i%3)*.35,2.2,angle);
    }
    boulder.dispose();
    box(basalt,0,.3,0,16.8,2.05,14.2);
    box(0xb6aba0,0,1.39,0,17.2,.3,14.6);
    for(const x of [-8.36,8.36]){
      for(let z=-6.85;z<=7;z+=2.25)box(0x9c9588,x,2.15,z,.25,1.45,.25);
      box(basalt,x,2.51,0,.23,.18,14);box(basalt,x,1.98,0,.13,.12,14);
    }
    for(const z of [-7.03,7.03])for(const x of [-5.67,5.67]){
      box(basalt,x,2.52,z,5.56,.16,.22);box(basalt,x,1.98,z,5.56,.12,.12);
      for(const dx of [-2.6,0,2.6])box(0xa49b8f,x+dx,2.12,z,.24,1.24,.25);
    }
    for(let i=0;i<9;i++)box(0xa19788,0,1.43-.19*i,7+.38*i,4.6,.28,.54);
    for(let i=0;i<3;i++)box(i%2?sand:red,0,1.68+i*.19,0,7.55-i*.32,.21,7.55-i*.32);
    const levels=[[2.13,4.1,5.85,8.25,1.19],[7.38,2.38,4.8,7.23,1.12],[10.81,1.8,3.88,6.05,1.28]];
    for(let n=0;n<levels.length;n++){
      const [base,h,w,eave,rise]=levels[n];
      box(red,0,base+h/2,0,w,h,w);
      for(const f of [-1,1]){
        const front=f*(w/2+.03);
        for(const u of [-w*.38,0,w*.38]){
          if(!u){
            const width=w*.38,high=h*.82;
            const arch=new T.Shape();arch.moveTo(-width*.5,0);arch.lineTo(width*.5,0);arch.lineTo(width*.5,high-width*.5);
            arch.absarc(0,high-width*.5,width*.5,0,Math.PI,false);arch.closePath();
            k.profile(arch,dark,0,base,front,.07,f>0?0:Math.PI);
            for(const dx of [-.3,0,.3])box(red,dx,base+high*.4,front+f*.115,.06,high*.77,.08);
            box(dark,f*(w/2+.03),base+h*.46,0,.08,h*.56,w*.29);
          }else{
            box(sand,u,base+h*.49,front,.22,h,.13);
            box(sand,front,base+h*.49,u,.13,h,.22);
          }
        }
      }
      for(const off of [0,.18])box(sand,0,base+h-off,0,w+.42-off,.12,w+.42-off);
      roof(T,k,0,base+h,0,eave,eave*.95,rise,0,[0x66544b,0x69574c,0x746158,0x6c584d],0x5c5048,true);
    }
    tapered(dark,0,14.25,0,.37,.26,.64,1,12);tapered(red,0,14.71,0,.3,.025,.61,1,12);
  }
  // World-metre offsets from the đình; east is +X and north is -Z.
  // Island: OSM 483729468. The bridge knots are surveyed nodes of way 1517604965.
  const shore=[[10,53.8],[18.4,52.2],[46,30.1],[51.7,20.2],[55,5.5],[52.6,-11.3],[47.6,-23],[37.2,-32.9],[23.5,-42.2],[10.1,-46.2],[-6,-47.3],[-18.4,-39.1],[-30.3,-18.3],[-34.3,-5.4],[-34.6,10.9],[-30.1,29.8],[-22.6,41.5],[-12.4,48.2],[-3.4,51.9]];
  const walkway=[[40.1,-24.4],[52.4,-66],[98.7,-75],[111.4,-120.4],[157.3,-128.1],[170,-170]];
  function island(T,k){
    const {box,stamp,round}=k,rock=0x7b7564,deck=0xc6bba9,rail=0x96938a;
    const verts=[],tints=[],col=new T.Color();
    function tri(a,b,c,tint){col.setHex(tint);for(const p of [a,b,c]){verts.push(...p);tints.push(col.r,col.g,col.b);}}
    for(let i=0;i<shore.length;i++){
      const [x,z]=shore[i],[xx,zz]=shore[(i+1)%shore.length];
      const a=[x*.91,1.08,z*.91],b=[xx*.91,1.08,zz*.91],c=[x,.15,z],d=[xx,.15,zz];
      tri([5,1.09,0],a,b,0x788255);tri(a,c,b,i%3?0x747761:rock);tri(b,c,d,i%3?rock:0x91866d);
      tri(c,[x*1.025,-2.1,z*1.025],d,rock);tri(d,[x*1.025,-2.1,z*1.025],[xx*1.025,-2.1,zz*1.025],rock);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setAttribute('color',new T.Float32BufferAttribute(tints,3));g.computeVertexNormals();
    const soil=new T.Mesh(g,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}));soil.receiveShadow=true;k.group.add(soil);
    soil.userData.shoreCover=true;
    k.deck(0xae927c,10,1.23,4,49,.32,42,-.75);
    function hall(cx,cz,w,d,yaw,main){
      const cs=Math.cos(yaw),sn=Math.sin(yaw),timber=0x674231;
      const place=(color,x,y,z,width,height,depth)=>box(color,cx+x*cs+z*sn,y,cz-x*sn+z*cs,width,height,depth,yaw);
      const h=main?4.5:3.2;
      place(0xae9c86,0,1.57,0,w+.55,.55,d+.5);
      place(0xc49c7e,0,h/2+1.8,0,w-1.08,h,d-1.16);
      const bays=main?5:3;
      for(let i=0;i<bays;i++){
        const x=w*((i+.5)/bays-.5);
        place(timber,x,1.8+h*.44,d/2-.53,w/bays*.74,h*.85,.21);
      }
      for(let i=0;i<=bays;i++){
        const x=(i/bays-.5)*(w-.7);
        place(timber,x,1.8+h/2,d/2+.06,.24,h,.24);
      }
      roof(T,k,cx,1.8+h,cz,w+2.8,d+2.6,main?3:2.15,yaw,[0x795b52,0x876359,0x7e6158,0x906e62],0xb59e8e);
    }
    hall(-5,-6,11,9,.74,false);hall(1.2,2.8,21.4,11.9,.74,true);
    hall(.8,24,12,5.7,-.75,false);hall(25.5,4.2,12.6,5.6,-.75,false);
    hall(8.2,-17.5,7.7,3.1,.74,false);hall(5.5,-23,5.6,3.2,.74,false);
    const leaves=new T.IcosahedronGeometry(1,0);
    for(let i=0;i<shore.length;i++){
      const n=shore[(i+1)%shore.length];for(let j=0;j<2;j++){
        const f=j*.5,x=(shore[i][0]*(1-f)+n[0]*f)*.83,z=(shore[i][1]*(1-f)+n[1]*f)*.83;
        if(Math.hypot(x-39,z+24)<8)continue;
        const h=3.1+(i*13+j*7)%3;
        stamp(round,0x736047,x,1+h*.45,z,.27,h,.27);
        stamp(leaves,[0x506642,0x667b4e,0x405f47][(i+j)%3],x,1+h,z,3.8,h*.70,3.45,i+j);
      }
    }
    leaves.dispose();
    for(let i=1;i<walkway.length;i++){
      const [ax,az]=walkway[i-1],[bx,bz]=walkway[i],dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz);
      const cx=(ax+bx)/2,cz=(az+bz)/2,yaw=Math.atan2(dx,dz),nx=dz/len,nz=-dx/len;
      k.deck(deck,cx,1.23,cz,3.15,.46,len+.55,yaw);
      for(const side of [-1,1]){
        box(rail,cx+nx*side*1.48,2.36,cz+nz*side*1.48,.13,.18,len,yaw);
        box(rail,cx+nx*side*1.48,1.94,cz+nz*side*1.48,.10,.11,len,yaw);
      }
      const bays=Math.ceil(len/2.8);
      for(let t=0;t<=bays;t++){
        const x=ax+dx*t/bays,z=az+dz*t/bays;
        for(const side of [-1,1])box(rail,x+nx*side*1.48,1.93,z+nz*side*1.48,.19,1.2,.19,yaw);
        if(t%3===0)box(rock,x,-1.36,z,1.46,4.85,.78,yaw);
      }
    }
  }
  (window.VietnamSights??=[]).push({
    id:'chua-ngoc-tam-chuc',name:'Chùa Ngọc',complex:'tam-chuc',tourOrder:6,city:'Kim Bảng',province:'Ninh Bình',region:'Bắc Bộ',
    lon:105.79278,lat:20.549706,yaw:2.46,viewAngle:2.3,viewElevation:.50,start:[105.793895,20.549502],width:19,depth:21,solids:[[0,0,3.4,3.4]],gardenRadius:66,viewDistance:3800,
    description:'Trên đỉnh núi Thất Tinh, chùa Ngọc có ba tầng mái cong. Thân tháp ghép từ các khối granit đỏ do nghệ nhân Ấn Độ chế tác, phía trước mở ra hồ Tam Chúc.',
    map:'https://www.openstreetmap.org/way/1518302477',photo:'https://dantri.com.vn/du-lich/doc-dao-ngoi-chua-co-pho-tuong-phat-hong-ngoc-nang-4-tan-20190427142245497.htm',source:'https://bnews.vn/photo/ve-dep-chua-ngoc-o-trung-tam-van-hoa-phat-giao-tam-chuc/122136/trang-1.html',build:summit
  },{
    id:'dinh-tam-chuc',name:'Đình Tam Chúc',complex:'tam-chuc',tourOrder:7,city:'Kim Bảng',province:'Ninh Bình',region:'Bắc Bộ',
    lon:105.809254,lat:20.560967,yaw:0,viewAngle:.52,start:[105.815566,20.559786],width:97,depth:102,solids:[[0,0,7.6,8.5],[25.5,4.2,4.1,4.3],[.8,24,4.1,4.3]],gardenRadius:105,
    description:'Đình nằm trên một đảo giữa hồ Lục Nhạc. Cầu đi bộ gấp khúc năm đoạn nối đảo đình với đảo Cò. Qua tán cây ven đảo có thể thấy tiền đường, hậu cung và sân lát gạch.',
    map:'https://www.openstreetmap.org/way/1517604966',photo:'https://ngaynay.vn/phatgiao/canh-sac-chua-tam-chuc-vinh-ha-long-tren-can-post100706.html',source:'https://vietnamtourism.gov.vn/en/printer/15748?type=1',build:island
  });
})();

;
// tam-chuc-paths.js
'use strict';
// OpenStreetMap footways in the inner precinct, microdegree offsets from 105.79 E, 20.54 N.
window.tamChucPaths=[
[false,[7376,15046,6936,15440]],
[false,[8028,14438,8206,14270,8438,14051]],
[false,[6907,15228,7244,14924,7341,14836,7557,14638,7606,14594,7836,14383,7889,14333,8206,14043]],
[true,[7368,14862,7341,14836]],
[true,[7616,14605,7606,14594]],
[true,[7870,14419,7836,14383]],
[false,[8438,14051,8136,13765,7060,12748,6144,11882,6015,11990,5816,11800,5548,12048]],
[false,[6936,15440,6630,15149,5523,14106,4617,13252,4754,13127,4556,12942,4845,12692]],
[false,[6907,15228,6734,15060,6430,14765,5718,14072,5640,13996,5523,14106]],
[false,[8206,14043,8029,13869,7730,13574,7087,12940,7035,12889,6974,12826,7060,12748]],
[false,[5718,14072,6072,13754,6289,13559,6459,13406,6675,13212,7035,12889]],
[false,[6430,14765,6764,14459,7074,14175,7408,13869,7730,13574]],
[false,[5946,13553,5662,13295,5609,13248,6083,12790,6136,12838,6420,13095,6279,13231,6117,13388,5946,13553]],
[true,[6289,13559,6117,13388]],
[true,[6459,13406,6279,13231]],
[false,[6136,12838,6190,12784,6675,13212]],
[false,[5662,13295,5609,13347,6072,13754]],
[false,[6540,15226,6630,15149,6734,15060]],
[false,[8029,13869,8136,13765,8243,13660]],
[false,[4845,12692,5104,12944,5451,12630,5811,12299,5548,12048]],
[true,[5451,12630,5325,12497]],
[false,[4452,12491,5323,11753,5360,11722,5511,11658]],
[false,[4845,12692,4769,12616,4663,12707,4302,13016]],
[false,[4663,12707,4452,12491,4254,12286,4084,12111,4014,12056,3925,12041,3754,12056,3674,12070]],
[false,[4254,12286,4614,11976,4769,11843,5120,11540]],
[false,[5323,11753,5120,11540]],
[true,[4614,11976,4454,11791]],
[true,[4769,11843,4608,11657]],
[true,[6780,10248,7072,10492]],
[false,[7200,10608,8064,11502]],
[true,[7204,10476,7697,10107]],
[false,[7697,10107,7904,9916]],
[false,[5615,16155,5557,15950,5516,15860,5431,15804,5302,15774,5213,15792,5162,15820,5122,15812,5109,15759,5087,15666,5028,15601,4926,15563,4793,15471,4763,15450,4704,15395,4680,15332,4739,15237,4760,15144,4851,15071,4857,14991,4857,14855,4921,14770,4937,14720,4908,14664,4773,14581]],
[false,[4926,15563,5004,15513,5036,15506,5120,15531,5227,15533,5310,15518,5377,15465,5436,15380,5511,15370,5575,15347,5597,15290,5605,15237,5650,15189,5680,15131,5680,15046,5728,14981,5825,14946]],
[false,[6271,15157,6249,15064,6216,15023,6133,15034,6088,15021,6034,14958,5938,14951,5825,14946,5790,14926,5779,14878,5736,14843,5624,14828,5511,14815,5211,14772,5133,14752,5101,14710,5109,14657,5098,14619,5077,14589,5098,14536,5178,14416,5181,14368,5154,14303,5122,14247]],
[false,[4793,15471,4709,15464,4607,15428,4541,15353,4492,15307,4416,15301,4296,15317,4200,15301,4146,15264,4077,15262]],
[false,[7244,14924,6993,14681,6764,14459]],
[false,[7408,13869,7632,14086,7889,14333]],
[false,[7074,14175,7302,14393,7557,14638]],
[false,[6993,14681,7302,14393,7632,14086]],
[false,[2834,9677,3646,9326,3796,9286,3872,9269]],
[false,[2739,9752,2663,9996,2546,10189,2447,10322,2413,10443,2465,10576,2524,10645]],
[false,[4077,15262,4085,14943,4186,14848,4078,14731]],
[false,[5122,14247,5065,14183,4996,14237,4930,14162,4852,14223,4748,14106]],
[false,[3284,13592,3459,13758,3582,13874,3754,14038,3795,14077,3910,14186]],
[false,[3795,14077,4195,13690,4339,13550]],
[false,[3910,14186,4261,13852,4458,13665]],
[false,[4195,13690,3997,13495,3882,13381,3706,13207]],
[false,[3582,13874,3997,13495]],
[false,[3459,13758,3882,13381]],
[false,[3432,14328,3754,14038]]
];

window.tamChucGroundCover=[
["stone",[8697,14760,8895,14432,8756,14280,8568,14075,8091,14502,8008,14575,7930,14644,7892,14606,7815,14674,7846,14704,7765,14776,7686,14845,7655,14814,7562,14897,7598,14933,7502,15017,7420,15090,6920,15540,7118,15748,7247,15884,7612,15764,7881,15738,8152,15670,8393,15504,8569,15314,8637,15170,8696,14932,8722,14804]],
["lawn",[6468,12136,6151,11833,6014,11952,5676,11644,5975,11388,6240,11186,6524,10904,6662,10656,6761,10448,7151,10831,7223,10901,7242,11145,7163,11267,7084,11288,6980,11316,6922,11373]],
["wood",[216,18842,3,18176,-68,17838,-54,17447,66,15969,66,15770,-33,15558,-932,14577,-1392,14332,-1547,14272,-1519,14153,-1342,13980,-988,13815,-790,13742,-217,13702,767,13669,1694,13729,2225,14090,2610,14546,3343,15257,3726,15453,2957,16226,1565,17250]],
["lawn",[6898,15146,5828,14112,6174,13799,6251,13873,6801,13374,6708,13284,7036,12986,8122,14034]],
["lawn",[4060,15383,4211,15491,4366,15654,4535,15900,4642,16159,4691,16222,4739,16249,4790,16252,6214,15905,6265,15847,6276,15759,6289,15641,6351,15569,6441,15497,6179,15239,6271,15157,6376,15064,6512,15198,6579,15143,5427,14060]],
["lawn",[8543,13570,8898,13224,8674,13059,8529,13071,8397,13036,8240,12921,7898,12635,7719,12479,7599,12323,7383,12098,7328,12098,6927,12537,8130,13702,8212,13631,8077,13507,8271,13321]],
["wood",[1813,13545,2104,13567,2375,13545,2560,13326,2863,13042,3518,12535,3585,12394,3590,12236,3582,12126,3692,11935,3700,11724,3700,11572,4039,10497,3784,9528,3763,9220,3823,9004,3932,8848,4216,8638,4627,8349,4794,7954,4877,7675,4884,7309,4728,7016,4638,6817,4426,6758,4141,6746,4001,6766,3652,7026,3401,7532,1972,8850,1866,8869,909,8326,669,8395,-239,9036,284,10538,223,11002,639,11707,1213,12364,1599,12915]],
["wood",[5506,13859,5415,13942,4677,13245,4794,13131,4621,12950,4733,12847,5079,13190,6083,12259,5747,11931,5817,11863,6018,12048,6144,11928,6821,12552,6708,12659,6617,12580,6528,12635,6460,12650,6424,12681,6371,12761,6296,12822,6139,12676,5492,13278,5649,13434,5618,13477,5592,13548,5554,13604,5509,13653,5394,13754]],
["lawn",[7597,11777,7306,11992,6818,12465,6468,12136,6922,11373,6980,11316,7084,11288,7110,11372,7190,11435,7314,11465,7362,11566,7453,11658]],
["wood",[7084,11288,7163,11267,7242,11145,7223,10901,7151,10831,7244,10714,7998,11480,7597,11777,7453,11658,7362,11566,7314,11465,7190,11435,7110,11372]],
["lawn",[-149,20452,-132,20572,-65,20648,8,20680,136,20665,204,20645,3728,16989,2974,16328,2116,16913,1569,17418,1142,17966,426,18804,202,19151,199,19214]],
["lawn",[3792,16915,3075,16327,3046,16287,3322,16061,3700,15652,3934,15458,4097,15579,4234,15699,4414,15948,4545,16189,4567,16310,4497,16415,4339,16483,4210,16543]],
["wood",[4016,15255,4020,14958,4134,14851,4081,14806,3934,14905,3751,14966,3646,14954,2828,14166,2747,14178,2678,14246,2658,14322,2686,14387,3446,15137,3638,15251,3764,15300,3926,15316]],
["wood",[4117,15171,4130,14962,4235,14848,4158,14768,4772,14193,4836,14260,4921,14196,4992,14264,5054,14218,5089,14249]],
["wood",[5126,14215,5060,14147,5010,14188,4957,14124,4872,14185,4799,14109,4907,14002,4256,13388,4454,13226,4329,13089,4484,12946,4551,13016,4578,12990,4716,13125,4584,13243,5360,13991]],
["wood",[3323,14519,2884,14097,2867,14057,2872,14026,3282,13646,3668,14017,3327,14316,3432,14420]],
["lawn",[3609,14743,3894,14490,3841,14437,3882,14401,3837,14357,3596,14570,3510,14646]],
["lawn",[3977,14442,3886,14353,4045,14211,3985,14152,4066,14079,4217,14227]],
["lawn",[3485,13713,3348,13586,3686,13269,3822,13396]],
["lawn",[3837,14008,3664,13843,3770,13746,3942,13911]],
["lawn",[3873,14050,3957,13969,4029,14034,3945,14115]],
["lawn",[3626,13807,3548,13735,3665,13624,3742,13696]],
["wood",[4876,12432,4646,12640,4510,12500,5367,11755,5479,11708,5581,11807,5316,12035,5247,11968,4804,12362]],
["wood",[3927,12723,4308,12383,4605,12688,4405,12856,4205,12647,4011,12811]],
["wood",[3081,13529,3155,13603,3166,13636,3149,13672,2592,14178,2540,14178,2463,14135,2421,14066,2407,14019,2397,13744,2427,13638,2530,13535,2684,13446,2863,13368,2927,13417,2886,13458,3026,13583]],
["stone",[3842,11643,4316,12190,5106,11631,4413,10877]],
["stone",[4389,12627,4996,13199,6017,12433,5446,11777]],
["stone",[5458,13296,5969,13879,6917,13211,6346,12567]],
["stone",[5373,13891,5811,14390,7379,13272,6965,12773]]
];

;
// temple-foundations.js
'use strict';
// The structures stay level. Only their bedding, perimeter walls and garden walk
// follow the sampled relief. Coordinates and heights here are in landmark space.
function createTempleFoundations(T,{group,vertexCount,place}){
  const fixtures=[],walls=[],tops=[],flights=[],walks=[],walkEdges=[];
  function fixture(elevation,build,moved){
    const start=vertexCount();build();
    const anchor={elevation,start,end:vertexCount(),height:0,moved};
    fixtures.push(anchor);return anchor;
  }
  function cornersAt(x,z,w,d,yaw){
    const c=Math.cos(yaw),s=Math.sin(yaw);
    return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>[x+c*u*w/2+s*v*d/2,z-s*u*w/2+c*v*d/2]);
  }
  function skirt(x,z,w,d,top,anchor,yaw=0){
    const corners=cornersAt(x,z,w,d,yaw);
    for(let side=0;side<4;side++){
      const [ax,az]=corners[side],[bx,bz]=corners[(side+1)%4],length=Math.hypot(bx-ax,bz-az);
      const count=Math.ceil(length/2);
      for(let i=0;i<count;i++)walls.push({
        ax:ax+(bx-ax)*i/count,az:az+(bz-az)*i/count,
        bx:ax+(bx-ax)*(i+1)/count,bz:az+(bz-az)*(i+1)/count,top,anchor,u:i*length/count,v:(i+1)*length/count
      });
    }
  }
  function building(x,z,yaw,w,d,build){
    const corners=cornersAt(x,z,w,d,yaw);
    let parts=[];
    const anchor=fixture(ground=>Math.max(ground(x,z),...corners.map(([px,pz])=>ground(px,pz))),()=>{
      parts=place(x,z,yaw,build).map(mesh=>({mesh,y:mesh.position.y}));
    },height=>{for(const part of parts)part.mesh.position.y=part.y+height;});
    skirt(x,z,w,d,.06,anchor,yaw);
    tops.push({corners,anchor});
    return anchor;
  }
  // A flight starts on a level landing and ends on the sampled path. The
  // outer cheek of each tread reaches the slope independently on both sides.
  function stairs(anchor,x,z,endX,endZ,width,top,count){
    const dx=endX-x,dz=endZ-z,length=Math.hypot(dx,dz);
    const sideX=dz*width/(2*length),sideZ=-dx*width/(2*length);
    for(let i=0;i<count;i++){
      const a=i/count,b=(i+1)/count,ax=x+dx*a,az=z+dz*a,bx=x+dx*b,bz=z+dz*b;
      flights.push({anchor,top,endX,endZ,a,b,corners:[
        [ax-sideX,az-sideZ],[ax+sideX,az+sideZ],[bx+sideX,bz+sideZ],[bx-sideX,bz-sideZ]]});
    }
  }
  function walk(width,depth,cx=0,cz=0){
    const count=Math.ceil(depth/2),cols=Math.ceil(width/2.5);
    for(let j=0;j<count;j++)for(let i=0;i<cols;i++){
      const z0=cz+(j/count-.5)*depth,z1=cz+((j+1)/count-.5)*depth,x0=cx+(i/cols-.5)*width,x1=cx+((i+1)/cols-.5)*width;
      walks.push([x0,z0,x0,z1,x1,z1,x0,z0,x1,z1,x1,z0]);
      if(i===0)walkEdges.push([x0,z1,x0,z0]);
      if(i===cols-1)walkEdges.push([x1,z0,x1,z1]);
      if(j===0)walkEdges.push([x0,z0,x1,z0]);
      if(j===count-1)walkEdges.push([x1,z1,x0,z1]);
    }
  }
  let support,body,rest;
  group.userData.fitGround=ground=>{
    // VietnamLandmarks seals its baked draw-call mesh after the builders run.
    if(!body){
      body=group.children[group.children.length-1].geometry;
      const p=body.getAttribute('position');rest=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      const count=(walls.length+tops.length+walks.length+walkEdges.length+flights.length*4)*6;
      const g=new T.BufferGeometry();
      g.setAttribute('position',new T.BufferAttribute(new Float32Array(count*3),3));
      g.setAttribute('uv',new T.BufferAttribute(new Float32Array(count*2),2));
      const material=new T.MeshStandardMaterial({color:0x827e71,roughness:.94});
      material.onBeforeCompile=shader=>{
        shader.vertexShader='varying vec2 blockUV;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nblockUV=uv;');
        shader.fragmentShader='varying vec2 blockUV;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec2 p=blockUV/vec2(.92,.34);p.x+=.5*mod(floor(p.y),2.);
          vec2 joint=min(fract(p),1.-fract(p)),aa=max(fwidth(p),vec2(.001));
          vec2 face=smoothstep(vec2(.013)-aa*.5,vec2(.013)+aa*.5,joint);
          float grain=fract(sin(dot(floor(p),vec2(9.71,75.3)))*35485.76);
          diffuseColor.rgb*=mix(.69,.91+.13*grain,face.x*face.y);`);
      };
      support=new T.Mesh(g,material);support.name='Retaining stonework';support.castShadow=true;support.receiveShadow=true;group.add(support);
      support.userData.shoreCover=true;
    }
    const points=body.getAttribute('position');let moved=false;
    for(const f of fixtures){
      const height=f.elevation(ground);
      if(Math.abs(height-f.height)<.0001)continue;
      for(let i=f.start;i<f.end;i++)points.setY(i,rest[i]+height);
      f.height=height;f.moved?.(height);moved=true;
    }
    if(moved){points.needsUpdate=true;body.computeBoundingSphere();body.computeBoundingBox();group.userData.height=body.boundingBox.max.y;}
    const g=support.geometry,positions=g.getAttribute('position'),uv=g.getAttribute('uv');
    let i=0,changed=g.boundingSphere===null;
    function vertex(x,y,z,u,v){
      if(Math.abs(positions.getY(i)-y)>.0001)changed=true;
      positions.setXYZ(i,x,y,z);uv.setXY(i,u,v);i++;
    }
    for(const wall of walls){
      const {ax,az,bx,bz,u,v}=wall,top=wall.anchor.height+wall.top;
      // Slight overlap at both ends closes the seam when ground triangles break
      // across a side. Buried portions are naturally occluded by the ground.
      const lowA=Math.min(top-.04,ground(ax,az)-.25),lowB=Math.min(top-.04,ground(bx,bz)-.25);
      vertex(ax,top,az,u,top);vertex(bx,top,bz,v,top);vertex(ax,lowA,az,u,lowA);
      vertex(bx,top,bz,v,top);vertex(bx,lowB,bz,v,lowB);vertex(ax,lowA,az,u,lowA);
    }
    for(const {corners,anchor} of tops)for(const k of [0,2,1,0,3,2]){
      const [x,z]=corners[k];vertex(x,anchor.height+.055,z,x,z);
    }
    for(const {anchor,top,endX,endZ,a,b,corners} of flights){
      const start=anchor.height+top,end=ground(endX,endZ)+.025;
      const height=start+(end-start)*a,lip=start+(end-start)*b;
      for(const k of [0,2,1,0,3,2]){
        const [x,z]=corners[k];vertex(x,height,z,x,z);
      }
      for(const [left,right,tread] of [[1,2,false],[2,3,true],[3,0,false]]){
        const [ax,az]=corners[left],[bx,bz]=corners[right],len=Math.hypot(bx-ax,bz-az);
        const lowA=tread?lip:Math.min(height,ground(ax,az)-.15);
        const lowB=tread?lip:Math.min(height,ground(bx,bz)-.15);
        vertex(ax,height,az,0,height);vertex(bx,height,bz,len,height);vertex(ax,lowA,az,0,lowA);
        vertex(bx,height,bz,len,height);vertex(bx,lowB,bz,len,lowB);vertex(ax,lowA,az,0,lowA);
      }
    }
    for(const tile of walks)for(let j=0;j<tile.length;j+=2){
      const x=tile[j],z=tile[j+1];vertex(x,ground(x,z)-.126,z,x,z);
    }
    for(const [ax,az,bx,bz] of walkEdges){
      const a=ground(ax,az)-.126,b=ground(bx,bz)-.126,len=Math.hypot(bx-ax,bz-az);
      vertex(ax,a,az,0,a);vertex(bx,b,bz,len,b);vertex(ax,a-.16,az,0,a-.16);
      vertex(bx,b,bz,len,b);vertex(bx,b-.16,bz,len,b-.16);vertex(ax,a-.16,az,0,a-.16);
    }
    if(changed){positions.needsUpdate=true;uv.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();}
  };
  return {fixture,skirt,walk,building,stairs};
}

;
// sight-finishes.js
'use strict';
function createSightFinishes(T,nightLights){
  const damp={value:0},pending=new Map();
  // Local coordinates in the authored models. The fourth value is the reach
  // in metres of a light on the stonework, under the eaves, or above a deck.
  const fixtures={
    turtle:{tint:0xffce87,bulbs:[[3,.9,4.9,10],[-3.8,1,-2,9],[0,1.5,-5,9]]},
    'ngo-mon':{tint:0xffca90,bulbs:[[-19,2,20,23],[18,2,20,22],[0,7,7.8,16]]},
    rong:{tint:0xffbd75,bulbs:[[-3,2,6.7,9],[3,2,6.7,9],[0,5,-5.8,13]]},
    market:{tint:0xffdaab,bulbs:[[0,13,64,16],[-19,4,65,17],[20,4,65,17]]},
    'cho-noi-cai-rang':{tint:0xffc173,bulbs:[[-6,3,-21,7],[1,2.8,-5,8],[8,3,12,8]]},
    'thanh-co-vinh':{tint:0xffc982,bulbs:[[0,4.5,6,14],[-7,5,4.5,12],[7,5,4.5,12]]},
    'den-cuong':{tint:0xffc985,bulbs:[[0,5,3.5,13],[-6,4,3,11],[6,4,3,11]]},
    'quang-truong-hcm-vinh':{tint:0xffd89c,bulbs:[[0,10,12,24],[-14,5,10,18],[14,5,10,18]]},
    'cau-rong':{tint:0xffb84d,bulbs:[[-22,10,0,28],[0,13,0,32],[24,10,0,28]]},
    'cau-song-han':{tint:0x8ad8ff,bulbs:[[-16,12,0,26],[0,22,0,34],[16,12,0,26]]},
    'cau-tran-thi-ly':{tint:0xffc278,bulbs:[[-18,12,0,28],[0,28,0,38],[18,12,0,28]]},
    'hoi-quan-phuc-kien':{tint:0xffb562,bulbs:[[0,4,6,14],[-6,3.5,5,11],[6,3.5,5,11]]},
    'cau-truong-tien':{tint:0xc8a4ff,bulbs:[[-28,8,0,24],[0,9,0,26],[28,8,0,24]]},
    'phu-van-lau':{tint:0xffc985,bulbs:[[0,4,7,14],[-7,4,6,12],[7,4,6,12]]},
    'dien-thai-hoa':{tint:0xffcf87,bulbs:[[0,5,12,20],[-14,5,10,16],[14,5,10,16]]},
    'quang-binh-quan':{tint:0xffc988,bulbs:[[0,5,6,15],[-6,4,5,12],[6,4,5,12]]},
    'thap-tram-huong':{tint:0xffb67a,bulbs:[[0,8,9,18],[0,18,7,20],[0,28,5,18]]},
    'quang-truong-lam-vien':{tint:0xffe07d,bulbs:[[-14,8,8,20],[0,10,10,22],[14,8,8,20]]},
    'bao-tang-ca-phe':{tint:0xffcc88,bulbs:[[-12,4,8,16],[0,5,10,18],[12,4,8,16]]}
  };
  const finishes={
    'ngo-mon':`
      if(finishPoint.y<5.75 && abs(fn.y)<.6){
        vec2 block=face/vec2(.78,.29);
        block.x+=.5*mod(floor(block.y),2.);
        vec2 edge=min(fract(block),1.-fract(block)),aa=max(fwidth(block),vec2(.002));
        vec2 joint=smoothstep(vec2(.014)-aa*.5,vec2(.034)+aa*.5,edge);
        float detail=1.-smoothstep(.25,1.,max(aa.x,aa.y));
        diffuseColor.rgb*=1.+detail*(.12*(stoneHash(floor(block))-.5)-.28*(1.-joint.x*joint.y));
      }`,
    rong:`
      if(finishPoint.y>5.3 && finishPoint.y<21.4){
        float weave=face.x*38.+.48*sin(face.y*2.7+floor(face.x*5.));
        float fibre=sin(weave*6.283)*(1.-smoothstep(.12,.68,fwidth(weave)));
        float bundles=stoneNoise(face*vec2(8.,.46));
        diffuseColor.rgb*=vec3(1.09,1.035,.93)*(.92+.17*bundles+.11*fibre);
      }`,
    turtle:`
      if(finishPoint.y>.72 && finishPoint.y<6.7 && abs(fn.y)<.6){
        float patina=(1.-smoothstep(.85,3.5,finishPoint.y))*smoothstep(.42,.76,stain);
        diffuseColor.rgb*=mix(vec3(1.),vec3(.68,.78,.61),patina*.72);
      }`
  };
  let worker,sequence=0;
  function occlude(g){
    const p=g.attributes.position,n=g.attributes.normal,color=g.attributes.color;
    if(!color||!n||!p||p.count<60||!window.Worker)return;
    if(!worker){
      worker=new Worker('sight-occlusion.js');
      worker.onmessage=({data:{id,light}})=>{
        const target=pending.get(id);pending.delete(id);
        if(!target||target.count!==light.length)return;
        for(let i=0;i<light.length;i++){
          const f=light[i]/255;target.setXYZ(i,target.getX(i)*f,target.getY(i)*f,target.getZ(i)*f);
        }
        target.needsUpdate=true;
      };
      worker.onerror=()=>{pending.clear();worker.terminate();worker=null;};
    }
    const id=++sequence,positions=p.array.slice(),normals=n.array.slice(),indices=g.index?.array.slice();
    pending.set(id,color);g.addEventListener('dispose',()=>pending.delete(id));
    const buffers=[positions.buffer,normals.buffer];if(indices)buffers.push(indices.buffer);
    worker.postMessage({id,positions,normals,indices},buffers);
  }
  function apply(group){
    const brick=['ponagar','thap-doi','thap-vinh-hung','my-son','pho-minh','phuoc-duyen',
      'thap-bang-an','thap-khuong-my','thap-chien-dan','thap-banh-it','thap-duong-long',
      'thap-canh-tien','thap-nhan-tuy-hoa','po-klong-garai','thap-po-rome','thap-po-sah-inu'].includes(group.name);
    const rig=fixtures[group.name];
    const surface=finishes[group.name]||'';
    const bulbs=rig?.bulbs.map(([x,y,z,r])=>new T.Vector4(x,y,z,r));
    if(rig){
      const point=new T.Vector3();
      group.userData.placeLights=()=>{
        group.updateWorldMatrix(true,false);
        rig.bulbs.forEach(([x,y,z,r],i)=>{
          point.set(x,y,z).applyMatrix4(group.matrixWorld);
          bulbs[i].set(point.x,point.y,point.z,r);
        });
      };
    }
    const seen=new Set();
    group.traverse(obj=>{
      const m=obj.material,g=obj.geometry;
      if(!m?.isMeshStandardMaterial||m.transparent||m.alphaTest||!g)return;
      if(!seen.has(g)){occlude(g);seen.add(g);}
      if(m.userData.sightFinish)return;
      m.userData.sightFinish=true;
      const previous=m.onBeforeCompile,program=m.customProgramCacheKey();
      m.customProgramCacheKey=()=>program+'-sight-'+brick+(rig?'-lit':'')+(surface?group.name:'');
      m.onBeforeCompile=function(shader,renderer){
        previous.call(this,shader,renderer);shader.uniforms.rainOnSight=damp;
        const vary='varying vec3 finishPoint; varying vec3 finishNormal;\n';
        shader.vertexShader=vary+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n finishPoint=position;finishNormal=normal;');
        shader.fragmentShader=vary+`uniform float rainOnSight;
          float stoneHash(vec2 p){vec3 h=fract(p.xyx*.1031);h+=dot(h,h.yzx+33.33);return fract((h.x+h.y)*h.z);}
          float stoneNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(stoneHash(i),stoneHash(i+vec2(1,0)),f.x),mix(stoneHash(i+vec2(0,1)),stoneHash(i+1.),f.x),f.y);}
        `+shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
          vec3 fn=normalize(finishNormal);
          vec2 face=abs(fn.y)>.68?finishPoint.xz:vec2(abs(fn.x)>abs(fn.z)?finishPoint.z:finishPoint.x,finishPoint.y);
          float stain=stoneNoise(face*vec2(.69,.19))*.65+stoneNoise(face*2.9)*.35;
          float wet=rainOnSight*(.25+.64*max(0.,fn.y)+.10*stain);
          diffuseColor.rgb*=1.+(stain-.5)*.18-wet*.23;
          roughnessFactor=mix(roughnessFactor,min(.29,roughnessFactor),wet);
          ${surface}
          ${brick?`if(${g.hasAttribute('finishKind')?'surfaceKind<.5 && ':''}diffuseColor.r>diffuseColor.g*1.38 && abs(fn.y)<.8){
            vec2 course=face/vec2(.31,.095);course.x+=mod(floor(course.y),2.)*.5;
            vec2 edge=min(fract(course),1.-fract(course)),aa=max(fwidth(course),vec2(.005));
            vec2 body=smoothstep(vec2(.026)-aa*.5,vec2(.055)+aa*.5,edge);
            float detail=1.-smoothstep(.24,.91,max(aa.x,aa.y));
            diffuseColor.rgb*=1.+detail*((stoneHash(floor(course))-.5)*.21-(1.-body.x*body.y)*.24);
          }`:''}`);
        if(rig){
          shader.uniforms.sightBulbs={value:bulbs};
          shader.uniforms.sightLampTint={value:new T.Color(rig.tint)};
          shader.uniforms.nightOnSight=nightLights;
          shader.fragmentShader='uniform vec4 sightBulbs[3]; uniform vec3 sightLampTint; uniform float nightOnSight;\n'+
            shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
              if(nightOnSight>.015){
                float spill=0.;
                for(int i=0;i<3;i++){
                  vec3 lightRay=(viewMatrix*vec4(sightBulbs[i].xyz,1.)).xyz+vViewPosition;
                  float d=max(.08,length(lightRay)),f=max(0.,1.-d/sightBulbs[i].w);
                  spill+=f*f*max(dot(normal,lightRay/d),0.);
                }
                reflectedLight.directDiffuse+=diffuseColor.rgb*sightLampTint*(spill*nightOnSight*2.8);
              }`);
        }
      };
    });
  }
  return {apply,weather(value){damp.value=value;}};
}

;
// sights-civic-icons.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[133].sites);

;
// sights-cau-vang.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[134].sites);

;
// sights-thang-long.js
'use strict';
(window.VietnamSights??=[]).push(...VietnamTourism.modelGroups[135].sites);

;
// sight-hydrography-data.js
'use strict';
// OpenStreetMap contributors, ODbL 1.0. Rebuild with tools/build_sight_hydrography.py.
window.VietnamHydrography={
  "osm-node-10220706855":{"yaw":-1.096,"width":1.5,"height":1.8,"way":80254129,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0},
  "osm-node-10239352348":{"yaw":-2.685,"width":2.6,"height":3.6,"way":1119534572,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.36},
  "osm-node-10239352351":{"yaw":2.867,"width":3.8,"height":5.5,"way":1119531976,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.74},
  "osm-node-10239659646":{"yaw":-0.073,"width":3.2,"height":4.6,"way":1119535947,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.56},
  "osm-node-10239660887":{"yaw":1.446,"width":3.7,"height":5.4,"way":1119533003,"evidence":"passage","heightSource":"estimate","widthSource":"estimate","grade":0.71,"trace":[[0.0,0.0],[-29.7,-3.7],[-48.9,-16.4],[-50.2,-17.9]],"traceOrigin":[0.0,0.0]},
  "osm-node-10268906506":{"yaw":1.72,"width":1.5,"height":1.8,"way":1125099258,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0},
  "osm-node-10745434207":{"yaw":-3.091,"width":10.7,"height":2.6,"way":1155450417,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.04,"trace":[[-16.9,50.8],[-9.6,39.4],[-1.1,22.1],[-0.0,-0.0],[-0.0,-0.0],[-1.6,-31.4],[-4.6,-54.8]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-10915418305":{"yaw":2.462,"width":4.9,"height":6.8,"way":930562087,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.3,"trace":[[-34.0,39.2],[0.6,20.6],[10.4,8.3],[18.4,-1.8],[47.2,-32.5]],"traceOrigin":[10.4,8.3]},
  "osm-node-11155986405":{"yaw":-0.299,"width":3.7,"height":5.4,"way":1203761177,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.72},
  "osm-node-11162900606":{"yaw":1.037,"width":2.3,"height":3.0,"way":1204447658,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.25},
  "osm-node-11491560194":{"yaw":1.525,"width":3.8,"height":3.3,"way":1237250744,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.08,"trace":[[-38.0,8.9],[-0.0,0.0],[-0.0,0.0],[49.4,2.3]],"traceOrigin":[-0.0,0.0]},
  "osm-node-11693046937":{"yaw":0.21,"width":4.7,"height":6.1,"way":1257694912,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.25,"trace":[[31.3,-43.8],[29.7,-34.6],[16.9,-20.4],[-0.0,-0.0],[-0.0,0.0],[3.0,11.8],[1.1,53.7],[0.6,54.5]],"traceOrigin":[-0.0,0.0]},
  "osm-node-11693051212":{"yaw":-0.063,"width":5.9,"height":10.1,"way":637367720,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.5,"trace":[[-17.1,-51.9],[-16.4,-51.8],[0.0,-0.1],[0.0,0.0],[-3.4,54.9]],"traceOrigin":[0.0,0.0]},
  "osm-node-11693194897":{"yaw":2.775,"width":11.8,"height":6.2,"way":805174044,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.26,"trace":[[1.5,54.5],[-2.7,26.0],[-0.0,0.0],[-0.0,-0.0],[16.8,-43.9],[18.6,-51.7]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-11752083772":{"yaw":1.114,"width":5.1,"height":7.5,"way":1373932061,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.34,"trace":[[-49.7,-22.5],[-38.9,-15.0],[-29.7,-10.0],[-10.2,-2.5],[-0.0,0.0],[-0.0,0.1],[13.0,6.4],[24.0,15.8],[28.6,21.4],[39.0,37.1]],"traceOrigin":[-0.0,0.1]},
  "osm-node-11797210006":{"yaw":-2.785,"width":10.7,"height":2.7,"way":997126440,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.05,"trace":[[5.9,54.0],[6.7,37.2],[6.7,25.0],[4.9,13.3],[-0.0,0.0],[-8.6,-22.9],[-23.8,-45.7],[-25.9,-48.0]],"traceOrigin":[-0.0,0.0]},
  "osm-node-11808242193":{"yaw":-1.041,"width":10.9,"height":3.2,"way":526178384,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.07,"trace":[[50.6,-16.3],[27.8,-16.3],[0.1,-0.0],[-0.0,-0.0],[-25.9,15.2],[-24.7,39.6],[-24.6,40.1]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-11841319471":{"yaw":1.468,"width":3.7,"height":5.3,"way":1275278378,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.7},
  "osm-node-11841319526":{"yaw":2.212,"width":2.7,"height":3.8,"way":1275278387,"evidence":"passage","heightSource":"estimate","widthSource":"estimate","grade":0.4,"trace":[[-0.0,0.1],[-44.1,33.0]],"traceOrigin":[-0.0,0.1]},
  "osm-node-11841319532":{"yaw":-0.811,"width":1.8,"height":2.3,"way":1275278389,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.09},
  "osm-node-11841319548":{"yaw":2.898,"width":2.2,"height":2.9,"way":1275278389,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.22},
  "osm-node-11841319556":{"yaw":0.205,"width":1.5,"height":1.8,"way":1275278390,"evidence":"passage","heightSource":"estimate","widthSource":"estimate","grade":0,"trace":[[0.0,0.1],[-11.2,-53.8]],"traceOrigin":[0.0,0.1]},
  "osm-node-11860856192":{"yaw":0.665,"width":3.4,"height":2,"way":165365378,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0,"trace":[[-37.9,-39.9],[0.0,-0.0],[0.0,0.0],[25.0,31.9],[32.9,44.0]],"traceOrigin":[0.0,-0.0]},
  "osm-node-11868866769":{"yaw":-0.382,"width":11.9,"height":6.6,"way":1206414553,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.28,"trace":[[-4.3,-53.7],[3.3,-8.0],[0.0,0.0],[0.0,0.0],[-20.5,51.1]],"traceOrigin":[0.0,0.0]},
  "osm-node-11891214381":{"yaw":2.496,"width":3.4,"height":2,"way":773073236,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0,"trace":[[5.9,52.0],[-1.8,39.6],[-4.9,19.6],[0.0,0.0],[0.0,-0.0],[12.3,-16.2],[26.7,-26.9],[30.8,-34.7],[30.5,-42.6]],"traceOrigin":[0.0,0.0]},
  "osm-node-11892522615":{"yaw":1.153,"width":3.0,"height":8.0,"way":481411143,"evidence":"stream","heightSource":"tag","widthSource":"tag","grade":0.6,"trace":[[-53.7,-10.4],[-42.9,-6.4],[-17.9,-4.3],[0.0,-0.0],[0.0,0.0],[16.9,7.5],[33.0,18.6],[44.8,30.7]],"traceOrigin":[0.0,-0.0]},
  "osm-node-11892998247":{"yaw":-1.436,"width":5.0,"height":7.3,"way":789795109,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.33,"trace":[[50.8,-20.4],[47.2,-18.0],[25.0,-7.4],[0.0,0.0],[0.0,0.0],[-28.5,3.9],[-46.6,10.5],[-52.6,14.0]],"traceOrigin":[0.0,0.0]},
  "osm-node-11898330382":{"yaw":0.526,"width":3.4,"height":2,"way":138956557,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0,"trace":[[-38.3,-39.3],[-29.6,-32.2],[-0.0,-0.0],[-0.0,0.0],[13.1,22.7],[17.1,45.5],[20.3,50.1]],"traceOrigin":[-0.0,0.0]},
  "osm-node-11929776256":{"yaw":1.858,"width":11.1,"height":3.8,"way":480403671,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.11,"trace":[[-49.9,23.0],[-45.6,21.9],[-0.0,-0.0],[-0.0,-0.0],[27.4,-8.1],[53.4,-12.9]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-11935665922":{"yaw":0.696,"width":3.9,"height":3.4,"way":799605692,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.09,"trace":[[-25.0,-48.7],[-21.6,-37.4],[-0.0,-0.0],[-0.0,0.0],[19.9,23.9],[25.0,38.0],[24.6,46.9]],"traceOrigin":[-0.0,0.0]},
  "osm-node-11935665927":{"yaw":2.044,"width":10.5,"height":2,"way":480595680,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0,"trace":[[-45.7,0.2],[-43.7,5.8],[-34.1,12.5],[-25.7,13.2],[-0.0,0.1],[0.0,0.0],[24.9,-12.7],[42.5,-15.5],[51.7,-15.2]],"traceOrigin":[0.0,0.0]},
  "osm-node-11941200957":{"yaw":3.119,"width":10.8,"height":2.8,"way":486442104,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.05,"trace":[[7.8,54.4],[7.2,51.8],[-0.0,0.0],[-0.0,-0.0],[0.6,-28.1],[5.0,-54.6]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-11949540736":{"yaw":-0.887,"width":10.6,"height":2.4,"way":479836712,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.02,"trace":[[22.4,-45.1],[23.5,-42.2],[23.7,-30.6],[20.5,-19.6],[14.1,-9.9],[0.0,0.0],[-0.0,0.0],[-17.4,14.2],[-25.6,26.7],[-30.2,43.7]],"traceOrigin":[0.0,0.0]},
  "osm-node-11981151505":{"yaw":1.759,"width":12.0,"height":9.0,"way":1545640295,"evidence":"stream","heightSource":"tag","widthSource":"tag","grade":0.2,"trace":[[-54.9,1.7],[-34.5,2.5],[-0.0,0.0],[-0.0,-0.0],[33.9,-6.5],[53.5,-12.6]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-12718347031":{"yaw":-2.941,"width":7.4,"height":18,"way":1534462057,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":1.14,"trace":[[10.8,53.9],[10.6,52.0],[0.0,-0.0],[0.0,-0.0]],"traceOrigin":[0.0,-0.0]},
  "osm-node-12841393747":{"yaw":0.331,"width":3.5,"height":2.2,"way":1387159306,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.01,"trace":[[25.9,-43.9],[26.9,-35.4],[1.9,-12.2],[-0.0,-0.0],[-0.0,0.0],[3.6,11.6],[6.4,16.6],[36.9,27.3]],"traceOrigin":[-0.0,0.0]},
  "osm-node-13025997447":{"yaw":0.88,"width":10.5,"height":2,"way":800598586,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0,"trace":[[-52.6,-16.0],[0.0,-0.0],[0.0,-0.0],[11.4,9.4],[18.2,20.0],[23.4,38.3],[23.3,46.9]],"traceOrigin":[0.0,-0.0]},
  "osm-node-13025997448":{"yaw":-1.198,"width":11.0,"height":3.7,"way":800598586,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.1,"trace":[[35.5,-41.3],[13.9,-10.5],[-0.0,-0.0],[-0.1,-0.0],[-29.4,11.4],[-52.9,10.5]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-13026556967":{"yaw":-0.645,"width":5.0,"height":7.2,"way":1493930473,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.32,"trace":[[40.2,-35.7],[37.9,-34.6],[19.5,-22.9],[11.3,-17.6],[-0.0,-0.0],[-0.0,0.0],[-8.5,11.3],[-29.1,35.0],[-35.1,42.3]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-13043101392":{"yaw":0.571,"width":13.2,"height":10.7,"way":1419391640,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.55,"trace":[[-48.3,-26.3],[-0.0,0.0],[29.7,46.3]],"traceOrigin":[-0.0,0.0]},
  "osm-node-13195214196":{"yaw":-1.637,"width":6.1,"height":10.6,"way":1435598828,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.53,"trace":[[28.3,1.8],[0.0,-0.1],[0.0,-0.1],[-24.8,-1.7],[-49.5,-5.2],[-54.7,-5.5]],"traceOrigin":[0.0,-0.1]},
  "osm-node-13437193401":{"yaw":1.891,"width":1.5,"height":1.8,"way":1490986490,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0},
  "osm-node-13475984320":{"yaw":0.23,"width":2.6,"height":3.5,"way":1471471119,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.34},
  "osm-node-13570978422":{"yaw":1.782,"width":3.0,"height":4.2,"way":1341568538,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.48},
  "osm-node-13913405701":{"yaw":2.697,"width":5.6,"height":9.2,"way":479436522,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.45,"trace":[[-12.7,53.1],[-8.8,21.6],[1.2,0.6],[13.0,-24.1],[30.6,-45.4]],"traceOrigin":[1.2,0.6]},
  "osm-node-13981250677":{"yaw":0.209,"width":4.6,"height":30.0,"way":1580418187,"evidence":"stream","heightSource":"tag","widthSource":"estimate","grade":0.24,"trace":[[-20.1,-49.8],[-17.1,-26.6],[-0.0,0.0],[0.0,0.1],[11.4,53.8]],"traceOrigin":[-0.0,0.0]},
  "osm-node-13981268740":{"yaw":0.466,"width":4.4,"height":5.2,"way":1580423103,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.2,"trace":[[-29.1,-46.6],[0.0,-0.0],[0.1,0.0],[13.4,26.6],[37.9,20.3]],"traceOrigin":[0.0,-0.0]},
  "osm-node-14060550929":{"yaw":1.117,"width":6.9,"height":13.1,"way":1545902317,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.69,"trace":[[-39.7,-34.9],[-31.3,-18.4],[-21.6,-10.4],[-0.0,0.0],[0.0,0.0],[18.9,9.2],[37.1,21.2],[43.9,31.3]],"traceOrigin":[-0.0,0.0],"intermittent":true},
  "osm-node-14063028460":{"yaw":-0.009,"width":4.4,"height":5.3,"way":248176884,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.2,"trace":[[-23.2,-41.6],[-3.2,-34.3],[-4.2,-25.9],[-7.3,-0.9],[-7.6,0.9],[-7.3,34.4],[-0.2,52.8]],"traceOrigin":[-7.3,-0.9]},
  "osm-node-14063041527":{"yaw":-0.465,"width":3.6,"height":2.8,"way":248176884,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.05,"trace":[[51.5,-26.1],[50.0,-23.3],[33.6,-9.9],[16.0,-5.2],[7.8,2.9],[7.4,3.7],[-0.3,19.2],[-1.5,42.0],[-10.0,54.2]],"traceOrigin":[7.4,3.7]},
  "osm-node-14063061748":{"yaw":-0.349,"width":3.7,"height":3.0,"way":1580416022,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.06,"trace":[[54.3,-8.8],[0.0,0.0],[0.0,0.0],[-5.7,4.1],[-2.7,15.2],[17.4,45.6]],"traceOrigin":[0.0,0.0]},
  "osm-node-1707326178":{"yaw":2.491,"width":1.7,"height":2.1,"way":209027356,"evidence":"passage","heightSource":"estimate","widthSource":"estimate","grade":0.05,"trace":[[0.0,0.0],[-7.5,9.9],[-9.8,12.9],[-14.2,18.7]],"traceOrigin":[0.0,0.0]},
  "osm-node-1725481657":{"yaw":1.152,"width":1.5,"height":1.8,"way":160491130,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0},
  "osm-node-1731350168":{"yaw":1.759,"width":12.1,"height":7.3,"way":481243164,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.33,"trace":[[-27.3,47.7],[-24.6,44.7],[-0.0,0.0],[0.0,0.0],[21.4,-4.0],[33.1,-14.5],[39.7,-30.7]],"traceOrigin":[0.0,0.0]},
  "osm-node-1758586716":{"yaw":2.693,"width":1.5,"height":1.8,"way":199241739,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0},
  "osm-node-1995508763":{"yaw":1.092,"width":2.6,"height":3.6,"way":188918168,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.36},
  "osm-node-2093848434":{"yaw":-1.222,"width":2.1,"height":2.8,"way":627383463,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.2},
  "osm-node-2440165325":{"yaw":-2.165,"width":12.1,"height":40,"way":235934532,"evidence":"river","heightSource":"published","widthSource":"estimate","grade":0.33,"trace":[[54.2,-1.0],[37.4,-5.1],[-0.0,-0.0],[-0.1,-0.0],[-3.8,-0.9],[-10.1,-4.2],[-13.5,-27.2],[-28.2,-41.8]],"traceOrigin":[-0.0,-0.0],"form":"plunge","reference":"https://sapa-tourism.com/golden-stream-and-love-waterfall-an-easy-trip-in-the-middle-of-the-forest/"},
  "osm-node-2455467654":{"yaw":-0.777,"width":3.5,"height":5.0,"way":237667590,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.63},
  "osm-node-3093994368":{"yaw":-2.013,"width":30,"height":57,"way":352915740,"evidence":"river","heightSource":"published","widthSource":"published","grade":0,"trace":[[43.1,29.5],[33.9,27.8],[19.5,23.6],[9.0,12.7],[-0.0,0.0],[-0.0,-0.0],[-13.5,-6.4],[-28.1,-3.4],[-53.1,-0.2]],"traceOrigin":[-0.0,0.0],"form":"plunge","reference":"https://lamdong.gov.vn/sites/book/diemhen2000/bai7.htm"},
  "osm-node-3094061320":{"yaw":-0.305,"width":5.4,"height":8.4,"way":304804944,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.4,"trace":[[30.0,-45.5],[20.7,-33.4],[6.8,-16.6],[0.0,0.0],[-10.3,32.9],[-23.2,48.9]],"traceOrigin":[0.0,0.0]},
  "osm-node-3107525356":{"yaw":-0.461,"width":10.9,"height":3.3,"way":306004346,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.08,"trace":[[-5.0,-54.7],[-0.8,-25.1],[0.0,-0.0],[0.0,0.0],[-11.9,24.1],[-19.1,32.6],[-34.0,31.6],[-36.0,31.4]],"traceOrigin":[0.0,0.0]},
  "osm-node-3189545835":{"yaw":-0.867,"width":1.5,"height":1.8,"way":198842006,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0},
  "osm-node-3266893772":{"yaw":-0.022,"width":20,"height":54,"way":52579688,"evidence":"stream","heightSource":"published","widthSource":"published","grade":0.09,"trace":[[-6.5,-54.6],[-0.0,0.0],[-1.2,55.0]],"traceOrigin":[-0.0,0.0],"form":"overhang","reference":"https://nhandan.vn/ve-dep-ky-vi-thac-hang-en-post659631.html"},
  "osm-node-3494799892":{"yaw":2.339,"width":1.5,"height":1.8,"way":0,"evidence":"direction","heightSource":"estimate","widthSource":"estimate","grade":0},
  "osm-node-3499295493":{"yaw":3.113,"width":1.4,"height":2,"way":343000358,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.96,"form":"fissure","reference":"https://bqlkkt.quangbinh.gov.vn/web/quangbinh/chi-tiet-tin/-/view-article/1/13848241114537/2421362016916379"},
  "osm-node-357411250":{"yaw":-0.347,"width":4.1,"height":4.1,"way":1486727810,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.13,"trace":[[24.4,-49.2],[20.0,-38.6],[2.0,-5.4],[-0.0,-0.0],[-0.0,-0.0],[-6.7,18.6],[-17.3,45.8],[-18.4,51.7]],"traceOrigin":[-0.0,-0.0],"intermittent":true},
  "osm-node-3816819309":{"yaw":0.934,"width":3.4,"height":2,"way":1255604331,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0,"trace":[[-48.0,-21.2],[-33.2,-22.5],[-23.1,-15.6],[-0.1,0.1],[-0.0,0.1],[25.1,18.6],[35.8,39.9]],"traceOrigin":[-0.0,0.1]},
  "osm-node-4097464935":{"yaw":-1.26,"width":3.9,"height":3.4,"way":481324315,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.09,"trace":[[42.1,-34.7],[33.6,-25.0],[17.0,-10.2],[0.0,0.0],[0.0,0.0],[-22.9,7.4],[-52.7,9.5],[-53.7,9.2]],"traceOrigin":[0.0,0.0]},
  "osm-node-4369550847":{"yaw":-1.524,"width":13.3,"height":10.9,"way":439341048,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.56,"trace":[[54.9,3.1],[-0.0,0.0],[-0.0,0.0],[-54.8,2.6],[-54.9,2.6]],"traceOrigin":[-0.0,0.0]},
  "osm-node-4502225092":{"yaw":1.35,"width":5.0,"height":20,"way":753496276,"evidence":"stream","heightSource":"published","widthSource":"estimate","grade":0.33,"trace":[[-42.5,34.1],[-25.6,15.6],[-6.3,3.8],[-0.0,-0.0],[0.0,-0.0],[10.3,0.4],[19.1,8.6],[21.7,18.7],[27.2,40.2]],"traceOrigin":[-0.0,-0.0],"form":"cascade","reference":"https://www.vietnamairlines.com/ph/vi/plan-book/travel/travel-guide/check-in-da-lat"},
  "osm-node-4518601444":{"yaw":0.68,"width":1.6,"height":2.5,"way":455517036,"evidence":"trail","heightSource":"published","widthSource":"published","grade":0.8,"form":"karst","reference":"https://storage-vnportal.vnpt.vn/hgg-edu/5089/vanban/1024_qd-phe-duyet-gddp-4.pdf"},
  "osm-node-4628460533":{"yaw":-3.023,"width":14.0,"height":13.1,"way":1423068611,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.69,"trace":[[25.4,48.8],[0.0,-0.0],[-6.5,-54.6]],"traceOrigin":[0.0,-0.0]},
  "osm-node-4641790394":{"yaw":1.53,"width":5.1,"height":7.4,"way":598499586,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.34,"trace":[[-53.2,-11.8],[-51.4,-12.1],[-36.2,-11.6],[-0.0,0.0],[0.0,0.1],[34.3,1.4],[54.3,-3.8]],"traceOrigin":[-0.0,0.0]},
  "osm-node-4642006489":{"yaw":0.082,"width":3.9,"height":3.5,"way":636635872,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.09,"trace":[[-3.1,-54.9],[0.0,-0.0],[0.0,0.0],[3.4,40.9],[1.7,54.8]],"traceOrigin":[0.0,-0.0]},
  "osm-node-4735888634":{"yaw":-0.915,"width":10.8,"height":3.1,"way":480654334,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.07,"trace":[[51.2,-20.0],[-0.0,-0.0],[-0.0,-0.0],[-43.6,33.5]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-4742627495":{"yaw":-0.074,"width":11.2,"height":4.4,"way":481528304,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.15,"trace":[[32.6,-44.3],[0.0,-0.0],[0.0,0.0],[-1.8,9.0],[-0.3,18.6],[10.3,35.4],[13.2,44.5],[12.8,51.2]],"traceOrigin":[0.0,0.0]},
  "osm-node-4753109965":{"yaw":0.768,"width":1.6,"height":1.9,"way":683662217,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.02},
  "osm-node-4755846850":{"yaw":-0.955,"width":11.0,"height":3.7,"way":482791222,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.1,"trace":[[47.5,-27.8],[0.0,0.0],[0.0,0.0],[-44.9,31.8]],"traceOrigin":[0.0,0.0]},
  "osm-node-4787075848":{"yaw":0.451,"width":11.4,"height":45,"way":480403671,"evidence":"river","heightSource":"published","widthSource":"estimate","grade":0.19,"trace":[[-9.0,-54.0],[-8.3,-35.2],[0.0,-0.0],[0.0,-0.0],[6.0,11.8],[7.6,26.6],[3.0,41.8],[2.7,52.8]],"traceOrigin":[0.0,-0.0],"form":"plunge","reference":"https://betav2.baogialai.com.vn/thuong-ngoan-ve-dep-thac-phu-cuong-post583264.html"},
  "osm-node-4810006123":{"yaw":-0.65,"width":4.9,"height":6.8,"way":470914846,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.3,"trace":[[35.2,-41.0],[31.9,-28.1],[6.7,5.1],[-10.7,27.9],[-15.1,53.8]],"traceOrigin":[6.7,5.1]},
  "osm-node-4810813225":{"yaw":2.948,"width":11.5,"height":5.3,"way":52579028,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.2,"trace":[[1.2,55.0],[1.0,54.1],[0.1,-0.0],[0.1,-0.0],[10.6,-54.0]],"traceOrigin":[0.1,-0.0]},
  "osm-node-4879886024":{"yaw":2.561,"width":4.2,"height":7,"way":1423068596,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":1.16},
  "osm-node-5112141922":{"yaw":-2.088,"width":4.2,"height":6.3,"way":584248758,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.91},
  "osm-node-5239859371":{"yaw":-2.11,"width":3.5,"height":2.4,"way":541930999,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.03,"trace":[[33.7,-15.0],[25.7,-15.7],[24.0,-5.8],[25.7,2.9],[17.0,7.0],[0.0,0.0],[0.0,-0.0],[-14.6,-8.7],[-34.4,-20.4],[-41.4,-32.6],[-41.9,-33.4]],"traceOrigin":[0.0,-0.0]},
  "osm-node-5256406207":{"yaw":-2.767,"width":50.0,"height":50.0,"way":543754951,"evidence":"river","heightSource":"tag","widthSource":"tag","grade":0.23,"trace":[[20.1,51.2],[-0.0,0.0]],"traceOrigin":[-0.0,0.0]},
  "osm-node-5265690822":{"yaw":-2.914,"width":4.5,"height":5.6,"way":1075510891,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.23,"trace":[[3.9,54.8],[3.9,38.0],[2.2,16.1],[-0.0,0.0],[-0.0,-0.0],[-3.5,-14.8],[-3.1,-22.0],[-3.0,-24.6],[-2.6,-32.1],[-3.1,-34.0],[-4.3,-38.1],[-5.5,-42.3],[-0.2,-53.0]],"traceOrigin":[-0.0,0.0]},
  "osm-node-5613572021":{"yaw":2.74,"width":3.6,"height":2.6,"way":1224676119,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.04,"trace":[[-26.6,48.2],[-11.9,17.0],[-4.2,4.9],[-1.8,-0.8],[9.8,-28.1],[18.1,-45.2],[22.6,-49.6]],"traceOrigin":[-1.8,-0.8]},
  "osm-node-5644088368":{"yaw":0.05,"width":10.9,"height":3.4,"way":591222479,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.09,"trace":[[-17.2,-46.2],[-4.7,-41.4],[-0.0,0.0],[-0.0,0.0],[2.2,44.7],[9.9,51.4]],"traceOrigin":[-0.0,0.0]},
  "osm-node-5801773753":{"yaw":-1.575,"width":20,"height":40,"way":318875100,"evidence":"stream","heightSource":"published","widthSource":"published","grade":0.07,"trace":[[45.5,30.5],[24.0,13.4],[-0.0,0.0],[-0.1,0.0],[-31.4,-0.1],[-53.2,9.1]],"traceOrigin":[-0.0,0.0],"form":"plunge","reference":"https://lamdong.gov.vn/sites/dulich/trai-nghiem-du-lich-huyen-tp/Shared%20Documents/Huy%E1%BB%87n%20Di%20linh.pdf"},
  "osm-node-5825064153":{"yaw":-1.011,"width":11.5,"height":5.3,"way":52740986,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.21,"trace":[[11.3,-52.9],[8.5,-16.9],[-0.0,-0.0],[-0.0,0.0],[-13.9,8.7],[-52.1,14.6]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-5832872682":{"yaw":-1.388,"width":4.8,"height":6.3,"way":617005092,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.27,"trace":[[45.9,-30.0],[27.2,-14.9],[0.0,0.0],[-0.0,0.0],[-28.1,5.2],[-50.7,18.8]],"traceOrigin":[0.0,0.0]},
  "osm-node-5922491535":{"yaw":0.972,"width":2.7,"height":3.7,"way":627383469,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.37},
  "osm-node-6008999548":{"yaw":2.325,"width":3.6,"height":2.7,"way":637367758,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.05,"trace":[[16.5,52.5],[0.0,-0.0],[0.0,-0.0],[30.1,-28.3],[34.3,-41.3]],"traceOrigin":[0.0,-0.0]},
  "osm-node-6053669985":{"yaw":2.781,"width":53.6,"height":2,"way":1042095179,"evidence":"river","heightSource":"estimate","widthSource":"bank","grade":0,"trace":[[-27.9,48.3],[-18.0,21.5],[-8.7,-3.3],[-2.7,-19.1],[21.3,-48.7]],"traceOrigin":[-8.7,-3.3],"mappedPool":true},
  "osm-node-6114438286":{"yaw":-2.222,"width":3.5,"height":5.0,"way":1425616226,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.64},
  "osm-node-6215416985":{"yaw":-0.381,"width":4.3,"height":5.0,"way":686360197,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.19,"trace":[[16.2,-51.9],[16.4,-41.2],[-0.0,-0.0],[-0.1,0.0],[-8.9,22.2],[-19.1,46.2],[-20.6,51.0]],"traceOrigin":[-0.0,-0.0],"form":"limestone-steps","reference":"https://csdl.vietnamtourism.gov.vn/dest/?item=1015"},
  "osm-node-6474418794":{"yaw":3.125,"width":2.5,"height":3.4,"way":690104970,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0.32},
  "osm-node-669857800":{"yaw":-3.133,"width":10.7,"height":2.6,"way":481243164,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.03,"trace":[[27.2,47.8],[-0.0,0.0],[-0.0,0.0],[-0.5,-55.0]],"traceOrigin":[-0.0,0.0]},
  "osm-node-6700271828":{"yaw":-2.733,"width":11.0,"height":3.4,"way":480696571,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.09,"trace":[[42.8,34.6],[0.0,0.0],[0.0,-0.0],[-21.7,-50.1],[-21.7,-50.5]],"traceOrigin":[0.0,-0.0]},
  "osm-node-6833063186":{"yaw":1.158,"width":12.0,"height":6.7,"way":528657875,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.3,"trace":[[-38.1,-25.7],[-25.2,-27.9],[-10.9,-25.0],[-0.0,0.0],[0.0,0.0],[38.4,16.7],[29.7,26.6]],"traceOrigin":[-0.0,0.0]},
  "osm-node-7040229623":{"yaw":-2.783,"width":6.2,"height":10.9,"way":753491823,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.56,"trace":[[19.4,45.0],[15.5,35.9],[13.4,32.9],[11.1,30.2],[8.3,26.5],[7.3,20.6],[7.4,15.7],[6.2,11.0],[4.3,7.2],[2.2,4.0],[0.0,0.0],[0.0,-0.0],[-1.3,-3.4],[-1.3,-6.8],[-6.0,-15.0],[-6.5,-18.1]],"traceOrigin":[0.0,-0.0]},
  "osm-node-7141872103":{"yaw":-0.387,"width":4.1,"height":4.4,"way":803121268,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.15,"trace":[[18.8,-51.7],[-0.0,-0.0],[-0.1,-0.0],[-10.3,25.2],[-23.3,49.1],[-23.7,49.5]],"traceOrigin":[-0.1,-0.0]},
  "osm-node-7182961142":{"yaw":0.591,"width":1.5,"height":1.8,"way":1414751981,"evidence":"trail","heightSource":"estimate","widthSource":"estimate","grade":0,"form":"basalt","reference":"https://dulich.daknong.gov.vn/vi/place/details/hang-dong-nui-lua-chu-bluk-1"},
  "osm-node-7244060861":{"yaw":-2.755,"width":4.9,"height":6.9,"way":776409457,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.31,"trace":[[-2.6,54.9],[-1.4,49.3],[-0.3,18.2],[-0.1,0.0],[-8.3,-20.4],[-23.8,-41.5],[-24.8,-48.3]],"traceOrigin":[-0.1,0.0]},
  "osm-node-7319268867":{"yaw":-0.656,"width":3.6,"height":2.5,"way":979760406,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.03,"trace":[[30.0,-46.0],[21.7,-36.3],[0.1,-0.1],[0.0,0.0],[-33.5,43.6]],"traceOrigin":[0.0,0.0]},
  "osm-node-7602091586":{"yaw":-0.711,"width":5.2,"height":30,"way":165365385,"evidence":"stream","heightSource":"published","widthSource":"estimate","grade":0.35,"trace":[[47.6,16.3],[23.4,-2.8],[13.8,-4.3],[0.0,-0.0],[-0.0,-0.0],[-9.2,10.7],[-15.6,30.8],[-24.2,48.6]],"traceOrigin":[-0.0,-0.0],"form":"overhang","reference":"https://dulich.daknong.gov.vn/vi/place/details/thac-lieng-nung-13"},
  "osm-node-7608097885":{"yaw":-2.998,"width":10.5,"height":2,"way":471118053,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0,"trace":[[37.6,45.9],[14.2,11.1],[12.3,-1.8],[4.4,-56.2]],"traceOrigin":[12.3,-1.8]},
  "osm-node-7639000086":{"yaw":-1.778,"width":3.3,"height":4.7,"way":1119533003,"evidence":"passage","heightSource":"estimate","widthSource":"estimate","grade":0.58,"trace":[[0.0,0.0],[25.1,5.3],[44.8,16.9],[46.2,23.3]],"traceOrigin":[0.0,0.0]},
  "osm-node-7790384785":{"yaw":-0.393,"width":4.8,"height":6.5,"way":815995862,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.28,"trace":[[-2.8,-54.3],[0.9,-41.2],[2.4,-16.4],[-0.0,-0.0],[-0.0,-0.0],[-12.9,31.0],[-26.4,47.7]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-7790401185":{"yaw":-0.652,"width":4.1,"height":4.3,"way":800568089,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.15,"trace":[[13.3,-52.5],[6.5,-40.7],[3.5,-10.8],[-0.0,-0.0],[-0.0,0.0],[-9.9,12.9],[-22.8,22.1],[-43.7,31.4]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-7790409785":{"yaw":0.361,"width":11.0,"height":3.7,"way":467059174,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.11,"trace":[[-16.1,-49.4],[1.7,-23.6],[0.0,0.0],[0.0,0.0],[8.2,21.6],[1.2,37.9],[-9.0,39.1],[-12.8,38.7]],"traceOrigin":[0.0,0.0]},
  "osm-node-7843903485":{"yaw":-1.889,"width":4.9,"height":6.8,"way":810669776,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.3,"trace":[[41.1,35.4],[40.7,34.5],[35.4,27.2],[22.9,14.3],[-0.0,0.0],[-0.0,0.0],[-16.7,-5.5],[-43.0,-7.7],[-53.9,-6.1]],"traceOrigin":[-0.0,0.0]},
  "osm-node-8018640188":{"yaw":-0.719,"width":11.7,"height":5.8,"way":383270453,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.24,"trace":[[24.4,-49.1],[18.6,-32.9],[-0.0,-0.0],[-0.0,0.1],[-23.3,26.6],[-34.4,42.8]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-8112449399":{"yaw":-1.598,"width":4.4,"height":5.1,"way":526149341,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.19,"trace":[[54.6,-5.5],[34.1,-1.4],[-0.0,-0.0],[-0.0,-0.0],[-20.9,-0.6],[-45.7,-13.0],[-51.7,-15.0]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-8112455841":{"yaw":2.819,"width":3.9,"height":3.7,"way":526149341,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.1,"trace":[[5.4,54.2],[4.9,52.8],[-1.3,24.6],[-0.0,-0.0],[-0.0,-0.0],[8.6,-25.8],[20.9,-44.2],[24.3,-48.7]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-8569184284":{"yaw":1.881,"width":12.8,"height":9.4,"way":923106673,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.46,"trace":[[-51.1,19.3],[-45.4,15.3],[-27.3,8.8],[-4.7,0.5],[-0.0,-0.0],[-0.0,-0.0],[19.2,-6.2],[29.0,-9.8],[52.6,-15.8]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-8620572905":{"yaw":-1.387,"width":75,"height":8,"way":52815448,"evidence":"river","heightSource":"published","widthSource":"published","grade":0.05,"trace":[[49.4,-24.1],[-0.0,-0.0],[-0.0,-0.0],[-34.4,6.3],[-54.4,6.3]],"traceOrigin":[-0.0,-0.0],"form":"dry-season","reference":"https://bdt.daknong.gov.vn/documents/10184/58882285/1_6%20SU%20KIEN%20LICH%20SUsigned_20190517085940.pdf/73382a9e-6d9d-49cb-97b2-f4f466cd3898"},
  "osm-node-8620693079":{"yaw":-2.921,"width":10.5,"height":2.1,"way":23800535,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.01,"trace":[[-23.3,49.8],[-6.4,16.2],[-0.0,-0.0],[0.0,-0.0],[-1.7,-11.6],[-8.7,-21.5],[-29.1,-45.0]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-9216777055":{"yaw":-2.461,"width":36.1,"height":2.5,"way":882356594,"evidence":"river","heightSource":"estimate","widthSource":"bank","grade":0.03,"trace":[[17.0,52.3],[-0.0,0.0],[-0.0,-0.0],[-29.0,-35.7],[-35.1,-42.3]],"traceOrigin":[-0.0,0.0],"mappedPool":true},
  "osm-node-9789872321":{"yaw":0.948,"width":30.5,"height":6.9,"way":1066054037,"evidence":"stream","heightSource":"estimate","widthSource":"bank","grade":0.31,"trace":[[2.8,-54.8],[3.9,-41.0],[0.1,-0.0],[21.0,15.0],[31.4,29.6],[38.2,38.6]],"traceOrigin":[0.1,-0.0],"mappedPool":true},
  "osm-node-9811545028":{"yaw":0.056,"width":4.0,"height":3.9,"way":1068858440,"evidence":"stream","heightSource":"estimate","widthSource":"estimate","grade":0.12,"trace":[[24.6,-48.0],[9.4,-30.1],[-0.0,-0.0],[-0.0,0.0],[2.4,43.2],[4.7,54.7]],"traceOrigin":[-0.0,-0.0]},
  "osm-node-991996378":{"yaw":-1.655,"width":11.2,"height":4.3,"way":776196111,"evidence":"river","heightSource":"estimate","widthSource":"estimate","grade":0.14,"trace":[[37.2,38.8],[27.5,31.7],[14.8,22.8],[9.6,11.2],[-0.0,0.0],[-0.0,0.0],[-6.6,-3.7],[-13.1,-0.7]],"traceOrigin":[-0.0,0.0]}
};

;
// sight-hydrography.js
'use strict';
// Surveyed flow lines and entrance approaches, © OpenStreetMap contributors.
// The surveyed axis anchors the scene. Rock, spray and the unmeasured section
// are a visual interpretation of the feature rather than a measured cave survey.
(() => {
  const atlas=window.VietnamTourism,profiles=window.VietnamHydrography;
  const byId=atlas.byId??new Map(atlas.entries.map(s=>[s.id,s]));
  const shared=new Map(),reference=window.VietnamSightDetails??{};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function map(T,file,colour) {
    if(!shared.has(file)){
      const t=new T.TextureLoader().load('streetscape/surfaces/'+file);
      t.wrapS=t.wrapT=T.RepeatWrapping;
      if(colour)t.colorSpace=T.SRGBColorSpace;
      t.userData.sightShared=true;shared.set(file,t);
    }
    return shared.get(file);
  }
  function rockMaterial(T){
    const m=new T.MeshStandardMaterial({map:map(T,'cut-rock-color.webp',true),normalMap:map(T,'cut-rock-normal.webp',false),
      normalScale:new T.Vector2(.95,.95),roughness:.92,vertexColors:true,side:T.DoubleSide});
    m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',
      `vec3 scan=texture2D(map,vMapUv*.39).rgb;
       float mineral=dot(scan,vec3(.28,.62,.1));
       float dip=vMapUv.y*2.8+.46*sin(vMapUv.x*.8)+.18*sin(vMapUv.x*2.2);
       float grains=dot(texture2D(map,vMapUv*1.18).rgb,vec3(.28,.62,.1));
       float oxidation=texture2D(map,vMapUv*.095+vec2(.33,.71)).g;
       float crack=1.-smoothstep(.018,.11,abs(fract(dip+mineral*1.9)-.5));
       crack*=smoothstep(.035,.115,oxidation);
       float fade=1.-smoothstep(.14,.72,fwidth(dip));
       diffuseColor.rgb*=clamp(.32+5.7*mineral+2.6*grains-.20*crack*fade,.28,1.60);
       diffuseColor.rgb*=mix(vec3(.65,.73,.68),vec3(1.12,1.06,.99),smoothstep(.028,.095,oxidation));`);};
    return m;
  }
  function waterMaterial(T,fall,limestone=false){
    // Use the normal renderer lighting; moving highlights are visible on the
    // sheets and the downstream pool even when viewed from the riverbank.
    const m=new T.MeshPhongMaterial({vertexColors:true,side:T.DoubleSide,specular:0xa3bdb9,shininess:fall?19:54,
      transparent:true,depthWrite:false});
    const clock={value:0},quiet=matchMedia('(prefers-reduced-motion: reduce)');
    m.onBeforeRender=()=>{clock.value=quiet.matches?0:(performance.now()%600000)*.001;};
    m.customProgramCacheKey=()=>fall?'hydro-falling-water':limestone?'hydro-shallow-stream':'hydro-pool-water';
    m.onBeforeCompile=s=>{
      s.uniforms.streamClock=clock;
      const vary='varying vec2 streamUV; varying float waterCoverage;\n';
      s.vertexShader=vary+'attribute float coverage;\n'+s.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\n streamUV=uv;waterCoverage=coverage;');
      s.fragmentShader=vary+`uniform float streamClock;
        float streamHash(vec2 p){vec3 h=fract(p.xyx*.1031);h+=dot(h,h.yzx+33.33);return fract((h.x+h.y)*h.z);}
        float streamNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
          return mix(mix(streamHash(i),streamHash(i+vec2(1,0)),f.x),mix(streamHash(i+vec2(0,1)),streamHash(i+1.),f.x),f.y);}
        `+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+(fall?
          `vec2 flow=vec2(streamUV.x,streamUV.y+streamClock*3.8);
           float fold=streamNoise(flow*vec2(1.8,.34));
           float filaments=streamNoise(flow*vec2(13.,.83)+fold*2.);
           filaments=mix(filaments,.5,smoothstep(.06,.25,fwidth(flow.x)));
           float aeration=clamp(.46*fold+.65*filaments,0.,1.);
           diffuseColor.rgb=mix(diffuseColor.rgb*.71,vec3(.83,.90,.86),aeration*.76);
           diffuseColor.a=waterCoverage*mix(.38,.97,smoothstep(.21,.80,aeration));`:
          `vec2 p=streamUV;float r=length(p*vec2(.61,1.));
           float drift=streamNoise(p*.54+vec2(0.,-streamClock*.52));
           float ripple=sin(p.y*6.5+p.x*1.4-streamClock*2.6+drift*4.);
           float eddy=sin(r*6.1-streamClock*3.7+drift*4.);
           float nearFall=exp(-r*.17);
           float light=pow(max(0.,mix(ripple,eddy,nearFall)),5.);
           diffuseColor.rgb+=vec3(.08,.13,.12)*light*${limestone?'.22':'1.'}*(1.-smoothstep(.12,.63,fwidth(r)));
           diffuseColor.a=waterCoverage*(.79+.16*drift);`));
    };
    return m;
  }
  // Indexed grids retain a shared normal at neighbouring samples. Each stored
  // point can blend between local terrain and a level pool/cave datum. Rebuilds
  // always use the original section, never accumulate the previous deformation.
  function surface(T,group,parts,material,section=false){
    const p=[],uv=[],c=[],weight=[],coverage=[],indices=[],colour=new T.Color();
    function grid(nx,ny,sample){
      const first=p.length/3;
      for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
        const [x,y,z,u,v,tint,mix,alpha=1]=sample(i/nx,j/ny);
        p.push(x,y,z);uv.push(u,v);colour.setHex(tint);c.push(colour.r,colour.g,colour.b);
        weight.push(mix);if(material.transparent)coverage.push(alpha);
        if(i&&j){const k=first+j*(nx+1)+i;indices.push(k-nx-2,k-1,k-nx-1,k-1,k,k-nx-1);}
      }
    }
    function finish(){
      if(!indices.length){material.dispose();return;}
      const g=new T.BufferGeometry();
      g.setAttribute('position',new T.Float32BufferAttribute(p,3));
      g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.setIndex(indices);
      if(coverage.length)g.setAttribute('coverage',new T.Float32BufferAttribute(coverage,1));
      g.computeVertexNormals();g.computeBoundingSphere();
      const mesh=new T.Mesh(g,material);mesh.receiveShadow=true;mesh.castShadow=material.isMeshStandardMaterial;
      if(material.transparent)mesh.renderOrder=material.customProgramCacheKey()==='hydro-falling-water'?2:1;
      mesh.userData.surveySection=section;
      group.add(mesh);parts.push({g,ys:Float32Array.from(weight,(_,i)=>p[3*i+1]),weight,section});
    }
    return {grid,finish};
  }
  function tint(a,b,t){
    const k=clamp(t,0,1);
    return (Math.round((a>>16)*(1-k)+(b>>16)*k)<<16)+
      (Math.round((a>>8&255)*(1-k)+(b>>8&255)*k)<<8)+Math.round((a&255)*(1-k)+(b&255)*k);
  }
  function stone(x,y,z,phase,wet){
    const moss=Math.sin(x*.63+y*.34+phase)*Math.sin(z*.57-y*.49)+.22*Math.sin(x*2.56-y*.83);
    const grain=.5+.5*Math.cos(y*3.5+Math.sin(x*.31+phase)*.48+z*.12);
    return tint(tint(wet?0x666b65:0xaaa799,wet?0x909283:0xc4bca8,grain*.7),wet?0x55635b:0x82906b,Math.max(0,moss));
  }
  function stones(rock,ridges,phase){
    for(const [cx,cz,rx,h,rz] of ridges){
      rock.grid(14,6,(u,v)=>{
        const theta=u*Math.PI*2,lat=v*Math.PI/2;
        const n=1+.093*Math.sin(theta*3+phase)*Math.cos(lat*2)+.047*Math.cos(theta*7+lat);
        const x=cx+rx*n*Math.cos(lat)*Math.cos(theta),z=cz+rz*n*Math.cos(lat)*Math.sin(theta);
        const y=-.15+h*Math.sin(lat)*(1+.12*Math.sin(theta)*Math.cos(lat));
        return [x,y,z,x*.47,(y+z*.36)*.53,stone(x,y,z,phase,true),0];
      });
    }
  }
  // Reuse one cutout texture for bank vegetation. Cards root in the same
  // weighted bedrock samples as the stepped bank so they follow terrain loads.
  function bankFerns(T,group,parts,roots,phase){
    const plants=surface(T,group,parts,new T.MeshLambertMaterial({
      map:map(T,'bank-fern.webp',true),alphaTest:.40,vertexColors:true,side:T.DoubleSide
    }));
    for(let i=0;i<roots.length;i++){
      const [x,y,z,size,weight]=roots[i],turn=phase+i*2.39996;
      for(let card=0;card<2;card++){
        const a=turn+card*1.43,dx=Math.cos(a)*size,dz=Math.sin(a)*size;
        plants.grid(2,1,(u,v)=>{
          const t=u*2-1,lean=.12*v*(1-t*t);
          return [x+t*dx+lean*dz,y+size*v*.95-.036,z+t*dz-lean*dx,u,v,card?0xdddfc9:0xd1dabf,weight];
        });
      }
    }
    plants.finish();
  }
  function groundFit(group,parts,z,entrance=false){
    group.userData.fitGround=ground=>{
      const datum=ground(0,z);
      for(const {g,ys,weight,section} of parts){
        const pos=g.attributes.position;
        for(let i=0;i<pos.count;i++){
          const local=ground(pos.getX(i),pos.getZ(i));
          // The underlying terrain remains drivable. Follow an uphill cave
          // floor and emerging streambed where a level section would disappear.
          const base=!section&&(entrance||ys[i]<.2)?Math.max(datum,local):datum;
          pos.setY(i,ys[i]+local+(base-local)*weight[i]);
        }
        pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
      }
    };
  }
  function watercourse(profile){
    // Preserve downstream bends present in the sampled mapped line. Samples
    // may coincide when a way begins or ends at the falls.
    const sin=Math.sin(profile.yaw),cos=Math.cos(profile.yaw);
    const trace=profile.trace.map(([east,south])=>[east*cos-south*sin,east*sin+south*cos]);
    if(!trace.length)return ()=>0;
    const [east,south]=profile.traceOrigin??profile.trace[2];
    const cx=east*cos-south*sin,cz=east*sin+south*cos;
    const pts=[];
    for(const [x,z] of trace)if(!pts.length||z-cz>pts.at(-1)[1]+.1)pts.push([x-cx,z-cz]);
    return z=>{
      if(z<pts[0][1])return pts[0][0];
      for(let i=1;i<pts.length;i++){
        const a=pts[i-1],b=pts[i];
        if(z>=a[1]&&z<=b[1])return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]);
      }
      return pts.at(-1)[0];
    };
  }
  // A short reach of the mapped Hiêu stream. The DEM sets the fall between
  // successive pools. The width and shapes of the encrusted sills are estimated.
  function limestoneSteps(T,group,p){
    const parts=[],centre=watercourse(p),levels=[-20,-14.2,-8.5,-1.1,4.8,12.1,20];
    const rock=surface(T,group,parts,rockMaterial(T)),pool=surface(T,group,parts,waterMaterial(T,false,true));
    const whitewater=surface(T,group,parts,waterMaterial(T,true));
    const width=z=>p.width*(.88+.21*Math.sin(z*.49)+.12*Math.cos(z*.73+.4));
    const bend=(x,z)=>.83*Math.sin(.68*x+.14*z)+.26*Math.cos(1.5*x-.12*z);
    const fade=z=>clamp((20-Math.abs(z))/2,0,1);
    rock.grid(32,128,(u,v)=>{
      const z=40*v-20,bank=u*2-1,half=width(z),x=bank*(half+2.4);
      const edge=Math.abs(bank),ripple=Math.cos(x*2.1+z*.91)*Math.sin(z*1.5-x);
      const shoulder=clamp((Math.abs(x)-half*.68)/1.2,0,1);
      const station=z-bend(x,z),moss=.5+.5*Math.sin(x*1.3+.3*z)*Math.sin(z*.94-x*.4);
      let sill=0;
      for(let i=1;i<levels.length;i++){
        const lip=levels[i]-(levels[i]-levels[i-1])*.36;
        sill=Math.max(sill,Math.exp(-((station-lip)**2)*2.1));
      }
      const y=(-.16+shoulder*(.24+.33*ripple)+.16*ripple+sill*(.23+.34*moss))*(1-edge**6)-.24*edge**6;
      const colour=tint(tint(0x807257,0xa19673,shoulder),0x626b38,moss*(.44+.51*sill));
      return [centre(z)+x,y,z,x*.53,z*.54,colour,fade(z)*(1-edge**5)];
    });
    pool.grid(28,128,(u,v)=>{
      const z=40*v-20,across=u*2-1,x=across*width(z);
      const edge=Math.abs(across),opacity=fade(z)*clamp((1-edge)*5,0,1);
      const mineral=.48+.22*Math.sin(x*1.3+z*.42)+.21*Math.cos(z*.73-x*.82);
      return [centre(z)+x,.035,z,x,z,tint(0x385d4b,0x8d9667,mineral+.22*edge),fade(z),opacity*.83];
    });
    for(let i=1;i<levels.length;i++){
      const length=levels[i]-levels[i-1];
      for(let run=0;run<5;run++){
        whitewater.grid(4,12,(u,v)=>{
          const station=levels[i-1]+length*(.57+v*.42);
          const across=-.89+(run+u*.85)*.36,x=across*width(station);
          const z=station+bend(x,station);
          const strength=Math.sin(v*Math.PI)*(.35+.58*Math.sin(u*Math.PI))*(.72+.28*Math.cos(2*x+i));
          return [centre(z)+x,.075,z,x,-z,0xceebdb,fade(z),fade(z)*strength];
        });
      }
    }
    const roots=[],ridges=[];
    for(let i=0;i<36;i++){
      const z=-19+(i*13.81)%38,side=i%2?1:-1,phase=i*2.39996;
      const x=centre(z)+side*(width(z)+.6+1.1*Math.cos(phase));
      const radius=.42+.67*(.5+.5*Math.sin(phase));
      ridges.push([x,z,radius*1.35,radius*(.53+.28*Math.cos(z)),radius]);
      roots.push([x+side*(1.1+radius),.06,z,.72+.49*Math.sin(z*.31)**2,0]);
    }
    stones(rock,ridges,1.39);
    rock.finish();pool.finish();whitewater.finish();bankFerns(T,group,parts,roots,1.39);
    // Woodland closes over the upper reach in field photographs. Leave the
    // downstream bank open for both visitor cameras.
    const woods=[[-7.4,-10,8.6],[8.6,-8.5,10],[-9,-16.7,11.2],[6.4,-18,8.8],
      [1.6,-22.6,9.3],[-4.1,-25,11.4],[12,-19,9.5],[-12,-4.6,8.8],[-8.2,4.3,6.6]];
    const firstTree=group.children.length;
    window.CentralArch.trees(T,{group},woods.map(([x,z,h])=>({x:centre(z)+x,z,h,width:h*.83})));
    const trees=group.children.slice(firstTree);
    group.userData.fitGround=ground=>{
      for(const {position} of trees)position.y=ground(position.x,position.z);
      const heights=levels.map(z=>ground(centre(z),z));
      for(const {g,ys,weight} of parts){
        const pos=g.attributes.position;
        for(let i=0;i<pos.count;i++){
          const x=pos.getX(i),z=pos.getZ(i),mix=weight[i];
          if(mix===0){pos.setY(i,ground(x,z)+ys[i]);continue;}
          const station=clamp(z-bend(x-centre(z),z),levels[0],levels.at(-1));
          let reach=1;
          while(reach<levels.length-1&&station>levels[reach])reach++;
          const t=(station-levels[reach-1])/(levels[reach]-levels[reach-1]);
          const face=clamp((t-.58)/.36,0,1),drop=.18*t+.82*face*face*(3-2*face);
          const waterline=heights[reach-1]+drop*(heights[reach]-heights[reach-1])+.34;
          const base=mix===1?waterline:ground(x,z)*(1-mix)+waterline*mix;
          pos.setY(i,base+ys[i]);
        }
        pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
      }
    };
  }
  function waterfall(T,group,p,seed){
    const parts=[],rock=surface(T,group,parts,rockMaterial(T)),sheets=surface(T,group,parts,waterMaterial(T,true)),
      pool=surface(T,group,parts,waterMaterial(T,false)),w=p.width,h=p.height,centre=watercourse(p);
    const roots=[];
    const tiers=p.form==='cascade'?3:p.form?1:p.heightSource==='estimate'&&p.grade>.30&&p.grade<.82&&h>4?3:h>2.8&&p.grade<.32?2:1;
    const ledge=clamp(w*.22+h*.13,1,9)*(tiers>1?1.3:1),undercut=p.form==='overhang';
    const dz=ledge/tiers,spread=clamp(w*.31+h*.09,1.8,13),phase=(seed%1597)*.013;
    const lip=x=>clamp(w*.097,.26,1.75)*(Math.sin(x/Math.max(2,w)*11+phase)*.75+Math.cos(x*.86+phase)*.24);
    const xAt=(x,z)=>x+centre(z);
    const toe=ledge-.68*dz,pz=toe+spread*.47;
    function cross(x,back){return x*(1-.14*back)+.02*w*Math.sin(phase+back*2.7);}
    for(let j=0;j<tiers;j++){
      const back=1-j/tiers,z0=dz*j,y0=h*back,y1=h*(back-1/tiers),half=w*(.53+.09*j/tiers);
      function point(u,v,shelf) {
        const x=cross((u-.5)*2*half,back),r=lip(x),z=z0+r+(shelf?-dz*(1-v):dz*.32*v);
        const grain=.12*Math.cos(x*3.4+phase)+.08*Math.sin(z*3.7+x*.17);
        const y=(shelf?y0:y0+(y1-y0)*v)+grain;
        return [xAt(x,z),y,z];
      }
      for(const shelf of [false,true])rock.grid(36,shelf?4:16,(u,v)=>{
        const [x,y,face]=point(u,v,shelf);
        const recess=shelf?0:Math.sin(Math.PI*v)**.71*Math.sin(Math.PI*u)**.7*clamp(w*.22,1,6);
        const z=face-(undercut?recess:0)+(shelf?0:Math.sin(y*2.7+x*.3)*.11);
        const colour=stone(x,y,z,phase,true);
        return [x,y,z,x*.38,(y+z*.47)*.43,undercut?tint(colour,0x454b46,clamp(recess*.23,0,.8)):colour,1];
      });
      const runs=clamp(Math.ceil(w/.54),8,100);
      for(let k=0;k<runs;k++){
        const f=(k+.5)/runs;
        const distribution=Math.sin(f*12+phase)+.53*Math.sin(f*23-phase+j*.2)+.34*Math.cos(f*42+j);
        if(distribution<(p.intermittent?.19:p.form==='dry-season'?-.4:-1.06))continue;
        sheets.grid(2,9,(u,v)=>{
          const drop=v*v,fraction=(k+u)/runs,[x,y,z]=point(fraction,drop,false);
          const twist=Math.sin(fraction*33+phase+drop*3);
          const flare=(fraction-.5)*w*.13*drop+twist*.06*w*drop;
          const arc=(v-drop)*Math.min(3.1,.63*h/tiers);
          const aeration=clamp(.15+drop*.61+.16*distribution+.13*twist,.05,1);
          return [x+flare,y+.09,z+.18+arc+drop*twist*.10,x,y,
            tint(0x638c8a,0xe5ece6,aeration),1,.82+.15*drop];
        });
        sheets.grid(1,2,(u,v)=>{
          const [x,y,z]=point((k+u)/runs,.52+v*.48,true);
          return [x,y+.08,z,x,z,0x78a6a5,1];
        });
      }
    }
    // Banks feather down to the rendered relief. A short upstream apron
    // joins the waterfall crest without standing like a wall across the valley.
    const backDepth=Math.max(ledge*1.8,w*.25,h*.59);
    rock.grid(26,8,(u,v)=>{
      const x=(u-.5)*1.18*w,z=lip(x)-dz-backDepth*v;
      const y=h*(1-v)**.6+.12*Math.sin(x+phase)*(1-v)-.18*v;
      return [xAt(x,z),y,z,x*.42,z*.41,stone(x,y,z,phase,true),1-v];
    });
    for(const side of [-1,1]){
      const breadth=w*.29+h*.45+2.1;
      function bluff(u,v,cap){
        const x=side*(w*.44+breadth*u);
        const shoulder=.49+.13*Math.cos(phase+side);
        const t=clamp((u-shoulder)/(1-shoulder),0,1);
        const margin=1-t*t*(3-2*t);
        const joint=.5+.5*Math.cos(u*17+phase+side);
        const height=h*(1+.12*Math.sin(u*5+phase+side)+.045*joint)*margin;
        const line=lip(x)+toe*(.69+.28*Math.sin(u*8+phase))+u*w*.075;
        const y=height*(cap?1-v**1.7:1-v),exposure=h*.045+.12;
        const band=Math.cos(y/Math.max(h*.10,.38)+Math.sin(x*.27+phase)*.57);
        const shelf=clamp((band+.37)*2.8,0,1);
        const ledgeJoint=(shelf*.83+joint*.64-.48)*exposure;
        const front=line+v*(h*.10+.6)+ledgeJoint;
        const z=cap?line+ledgeJoint*(1-v)-(backDepth+dz)*v:front;
        const factor=margin*(cap?1-v:1);
        const colour=tint(stone(x,y,z,phase,false),0x5f6258,Math.max(0,-band)*.37);
        return [xAt(x,z),y-.16*(1-factor),z,x*.47,(y+z*.43)*.45,colour,factor];
      }
      rock.grid(24,24,(u,v)=>bluff(u,v,false));
      rock.grid(24,8,(u,v)=>bluff(u,v,true));
      for(let i=0;i<28;i++){
        const u=.05+.91*((i*.618+Math.abs(Math.sin(phase+side)))%1);
        const t=.05+.73*((i*.386+Math.abs(Math.cos(phase-side)))%1);
        const [x,y,z,,,,weight]=bluff(u,t,true);
        roots.push([x,y,z,.42+.62*Math.abs(Math.sin(phase+i*.69)),weight]);
      }
    }
    // A shallow elliptical pool abuts the foot of the last fall. Vary the
    // colour and foam by depth, with quiet margins against exposed bedrock.
    if(!p.mappedPool)pool.grid(54,11,(u,v)=>{
      const a=Math.PI*2*u,shore=1+.13*Math.sin(a*3+phase)+.074*Math.sin(a*7-phase);
      const x=Math.cos(a)*v*(w*.62+spread*.29)*shore,z=pz+Math.sin(a)*v*(spread+.67)*shore;
      const y=.12+.014*Math.sin(v*18+phase)*(1-v);
      const foam=clamp(1-Math.abs(z-toe)/Math.max(1,spread*.7),0,1)*(1-v*.65);
      return [xAt(x,z),y,z,x,z-toe,tint(tint(0x396360,0x687f71,v),0xc9dfd7,foam*.76),1,1-clamp((v-.77)/.23,0,1)];
    });
    const stonesAt=[];
    for(let i=0;i<13;i++){
      const sign=i%2?1:-1,angle=phase+i*2.4,size=.15+spread*(.07+.115*(.5+.5*Math.sin(angle)));
      stonesAt.push([sign*(w*.54+spread*.45*Math.sin(angle)),toe+spread*.6+spread*.81*Math.cos(angle),
        size*1.57,size*.83,size]);
    }
    stones(rock,stonesAt,phase);
    rock.finish();sheets.finish();pool.finish();
    bankFerns(T,group,parts,roots,phase);groundFit(group,parts,pz);
  }
  function cave(T,group,p,seed){
    const parts=[],rock=surface(T,group,parts,rockMaterial(T)),w=p.width,h=p.height,phase=(seed%2377)*.014;
    const wing=Math.max(w*1.72,3.6),depth=clamp(w*1.47+h*.32,2.3,19),asymmetry=Math.sin(phase)*.18;
    const skew=.09*Math.cos(phase*.71),fissure=p.form==='fissure',basalt=p.form==='basalt';
    function mouth(x){
      const t=x/(w*.5),u=clamp(t,-1,1);
      const dome=fissure?1-Math.abs(u+skew*(1-u*u)):Math.pow(1-Math.abs(u)**(basalt?3.2:2.25),.54);
      const fracture=.086*Math.sin(7*u+phase)+.037*Math.cos(17*u-phase*.4);
      return Math.abs(t)>=1?0:h*dome*(1+u*asymmetry+fracture);
    }
    function front(x,v){
      const side=x<0?-1:1;
      const outer=clamp((wing-Math.abs(x))/(wing*(.43+.09*Math.sin(phase+side))),0,1);
      const flank=outer*outer*(3-2*outer),base=mouth(x);
      const crest=h*(1.47+.20*Math.cos(x/(w*.68)+phase)+.12*Math.sin(x/(w*.22)+phase*.76));
      const level=Math.max(base+h*.19,crest)*flank;
      const y=base+(level-base)*v-.16*(1-flank);
      const dip=x*.17+y+phase,scale=Math.max(.26,Math.min(h*.14,1.7));
      const bed=dip/scale-Math.floor(dip/scale),ledge=(1-Math.abs(bed*2-1))*Math.min(.17,h*.03);
      const recess=clamp(.60-.60*Math.cos(x/Math.max(.73,w*.16)+phase),0,1);
      const z=.19*Math.sin(x*1.57+y*.61+phase)+Math.min(1.4,w*.2)*Math.cos(x/Math.max(1,w*.48)+phase)
        +ledge+v*(1-v)*h*.54*recess-v*v*h*.41;
      return [x,y,z];
    }
    rock.grid(54,13,(u,v)=>{
      const [x,y,z]=front((u*2-1)*wing,v);
      const colour=stone(x,y,z,phase,false);
      return [x,y,z,x*.59,(y-z*.39)*.57,p.form==='basalt'?tint(colour,0x474a42,.67):colour,1-clamp((Math.abs(x)-w*.5)/wing,0,1)];
    });
    // An exterior approach establishes the mouth, not an underground bend.
    // Only extend along a passage if the survey actually traces one.
    const passage=p.evidence==='passage'&&p.trace?.length>1;
    const sin=Math.sin(p.yaw),cos=Math.cos(p.yaw);
    const path=passage?p.trace.map(([e,s])=>[e*cos-s*sin,e*sin+s*cos]):[];
    if(!passage)path.push([0,0],[0,-.65]);
    const sections=[[0,0,0]];
    for(let i=1;i<path.length;i++){
      const [ax,az]=path[i-1],dx=path[i][0]-ax,dz=path[i][1]-az,len=Math.hypot(dx,dz);
      const count=Math.ceil(len/2),along=sections.at(-1)[2];
      for(let j=1;j<=count;j++)sections.push([ax-path[0][0]+dx*j/count,az-path[0][1]+dz*j/count,along+len*j/count]);
    }
    const last=sections.length-1,length=sections[last][2]||1;
    function interior(x0,t){
      const i=Math.round(t*last),[dx,dz,distance]=sections[i],v=distance/length;
      const prev=sections[Math.max(0,i-1)],next=sections[Math.min(last,i+1)];
      const tx=next[0]-prev[0],tz=next[1]-prev[1],span=Math.hypot(tx,tz)||1;
      const lateral=x0*(1-v*.27),mouthZ=front(x0,0)[2]*Math.max(0,1-distance/2);
      return [dx+lateral*(i?-tz/span:1),dz+mouthZ+lateral*(i?tx/span:0),v];
    }
    const lining=surface(T,group,parts,rockMaterial(T),true);
    lining.grid(32,Math.max(1,last),(u,t)=>{
      const x0=(u-.5)*w,[,lipY]=front(x0,0),[x,z,v]=interior(x0,t);
      const y=lipY*(1-.18*v)+.08*Math.sin(v*11+u*14+phase)*Math.sin(v*Math.PI);
      return [x,y,z,(x+z*.37)*.61,(z+y*.36)*.54,tint(0x999b8c,0x272f2c,v**.64),1];
    });
    lining.grid(32,4,(u,v)=>{
      const x0=(u-.5)*w,[,y]=front(x0,0),[x,z]=interior(x0,1);
      return [x,y*.82*(1-v),z,
        u*3,v*2,0x252b28,1];
    });
    lining.grid(22,Math.max(1,last),(u,t)=>{
      const [x,z,v]=interior((u-.5)*w,t),y=.092+.024*Math.sin(x*3+v*15)*v;
      return [x,y,z,x*.53,z*.53,tint(0x827e69,0x242b26,v**.55),1];
    });
    lining.finish();
    rock.grid(38,8,(u,v)=>{
      const [x,y,z]=front((u*2-1)*wing,1);
      return [x,(1-v)**.82*y-.23*v,z-v*depth*1.03,x*.53,(z-v*depth)*.57,stone(x,y,z-v*depth,phase,false),1-v];
    });
    // Eroded flanks extend out of the cliff face. Detached blocks overlap its
    // foot and bury the wall edge; the mapped opening remains clear.
    const rocks=[];
    for(const side of [-1,1]){
      const breadth=wing-w*.55;
      for(let i=0;i<5;i++){
        const t=(i+.45)/5,x=side*(w*.6+breadth*t),crest=front(x,1)[1];
        const mass=Math.max(.18,crest*(.36+.18*Math.sin(phase+i*2.1+side)));
        const cx=x+side*.11*w;
        const cz=front(x,.35)[2]+.04*w;
        rock.grid(18,8,(u,v)=>{
          const a=u*Math.PI*2;
          const face=Math.abs(Math.cos(a+.4*i))*.78+Math.abs(Math.sin(a+.4*i))*.56;
          const strata=(1+.068*Math.sin(15*v+2*a+phase)+.065*Math.cos(6*a+i))/Math.max(.7,face);
          const radius=(1-v*.24)*strata*Math.min(1,(1-v)*5);
          const px=cx+(breadth*.24+.18)*radius*Math.cos(a)+side*v*w*.075;
          const pz=cz+(.45+.27*w)*(1+.25*Math.sin(i+phase))*radius*Math.sin(a)-v*w*.12;
          const py=mass*Math.min(1,v*1.22)*(1+.14*Math.cos(a+phase)*radius)-.22;
          return [px,py,pz,px*.54,(py+.32*pz)*.58,stone(px,py,pz,phase,false),1-t*.6];
        });
      }
      for(let i=0;i<12;i++){
        const k=(i*.618+.19)%1,sz=.18+(.33+.28*Math.cos(phase+i*2.7))*Math.min(2,w*.39);
        rocks.push([side*(w*.59+k*breadth),.29+Math.sin(i*2.4+phase)*1.03+sz,sz*1.41,sz*.86,sz]);
      }
    }
    stones(rock,rocks,phase);rock.finish();
    const roots=[];
    for(let i=0;i<52;i++){
      const x=wing*((i*.61803399%1)*1.84-.92),v=(i*.393+Math.abs(Math.cos(phase)))%1;
      const [,crest,z]=front(x,1);
      roots.push([x,crest*(1-v)**.82-.23*v,z-v*depth*1.03,.32+.42*Math.abs(Math.cos(i+phase)),1-v]);
    }
    bankFerns(T,group,parts,roots,phase);groundFit(group,parts,0,true);
  }
  // Initial views through clearings in the local tree cover (yaw offset, elevation).
  const clearingViews={
    'osm-node-7790401185':[-.46,.64],
    'osm-node-9811545028':[0,.46],
    'osm-node-9789872321':[0,.46]
  };
  const authored=new Set((window.VietnamSights||[]).map(s=>s.catalogId||s.id));
  for(const [id,p] of Object.entries(profiles)){
    if(authored.has(id))continue;
    const site=byId.get(id);
    if(!site)continue;
    const isCave=site.kind==='Hang động',seed=Number(id.slice(id.lastIndexOf('-')+1))||1;
    const span=isCave?Math.max(p.width*3.3,8.3):Math.max(10,p.width*2.25+p.height*.44);
    const [viewOffset,viewElevation]=clearingViews[id]||(isCave?[.14,.18]:[.28,.25]);
    const widthText=p.widthSource==='tag'?' Bề rộng trên bản đồ là '+p.width+' m.':p.widthSource==='published'?' Bề rộng tham khảo khoảng '+p.width+' m.':'';
    const heightText=p.heightSource==='tag'?' Chiều cao được ghi trên bản đồ là '+p.height+' m.':p.heightSource==='published'?' Chiều cao tham khảo khoảng '+p.height+' m.':'';
    const axisText=isCave?(p.evidence==='direction'?'Hướng cửa hang lấy từ ký hiệu bản đồ.':
      p.evidence==='passage'?'Góc nhìn hướng vào đoạn hang có lối ngầm đã lập bản đồ.':'Góc nhìn theo lối đi bộ đã lập bản đồ tới cửa hang.'):
      'Dòng thác đổ theo hướng của '+(p.evidence==='river'?'đoạn sông':'con suối')+' trên bản đồ.';
    const seasonal=p.form==='dry-season'?' Mô hình thể hiện dòng chảy mùa khô.':'';
    (window.VietnamSights??=[]).push({...site,id,catalogId:id,surveyed:true,source:p.reference??(p.way?'https://www.openstreetmap.org/way/'+p.way:site.map),
      photo:reference[id]?.photo??site.photo,width:span,depth:span*.82,solids:[],yaw:p.yaw,
      reserve(x,z,pad=0){
        if(p.form==='limestone-steps')return Math.abs(z)<20+pad&&Math.abs(x)<p.width+pad;
        const across=(isCave?p.width*.62:p.width*.65+1.7)+pad;
        const along=(isCave?1.5:Math.min(19,p.width*.34+p.height*.15+2))+pad;
        return (x/across)**2+(z/along)**2<1;
      },
      viewAngle:p.yaw+viewOffset,viewElevation,viewRadius:Math.max(isCave?7:13,span*.95,p.height*1.95),
      description:axisText+heightText+widthText+seasonal+(isCave?' Hình dáng vách đá ở cửa hang được ước dựng.':' Các bậc đá và dòng nước được ước dựng theo địa hình.'),
      build(T,{group}){
        if(p.form==='limestone-steps'){limestoneSteps(T,group,p);return;}
        if(isCave)cave(T,group,p,seed);else waterfall(T,group,p,seed);
        // Feather decorative rock returns into the terrain before the mapped
        // driving approach. Leave the measured opening and cascade untouched.
        const limit=Math.max(p.width*.66,site.approachMeters-6);
        if(limit>100)return;
        for(const mesh of group.children){
          if(mesh.userData.surveySection||mesh.material.transparent)continue;
          const pos=mesh.geometry.attributes.position;
          let changed=false;
          for(let i=0;i<pos.count;i++){
            const x=pos.getX(i),z=pos.getZ(i),radius=Math.hypot(x,z);
            if(radius<=limit)continue;
            pos.setXYZ(i,x*limit/radius,pos.getY(i),z*limit/radius);
            changed=true;
          }
          if(changed){pos.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();}
        }
      }
    });
  }
})();

;
// landmark-materials.js
'use strict';

// A byte per baked vertex identifies the actual finish of each stamped part.
// The scan packs neutral plaster, cut stone and timber grain in RGB. Sampling
// them together keeps differently finished surfaces in the existing draw call.
const landmarkFinish = Object.freeze({
  plain: 0, plaster: 1, stone: 2, timber: 3, tile: 4, glazedTile: 5,
  thatch: 6, brick: 7, metal: 8, glass: 9
});
let landmarkGrain;
function createLandmarkMaterial(T, id, stainStrength) {
  if (!landmarkGrain) {
    landmarkGrain = new T.TextureLoader().load('streetscape/surfaces/landmark-grain.webp');
    landmarkGrain.wrapS = landmarkGrain.wrapT = T.RepeatWrapping;
    landmarkGrain.anisotropy = 4;
    landmarkGrain.userData.sightShared = true;
  }
  const material = new T.MeshStandardMaterial({
    map: landmarkGrain, vertexColors: true,
    roughness: id === 'coal' ? .23 : .87, metalness: id === 'coal' ? .38 : 0
  });
  material.customProgramCacheKey = () => 'landmark-scan-v1';
  material.onBeforeCompile = shader => {
    shader.uniforms.landmarkWeathering = {value: stainStrength};
    shader.vertexShader = 'attribute float finishKind; varying float surfaceKind;\n' +
      shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n surfaceKind=finishKind;');
    shader.fragmentShader = 'varying float surfaceKind; uniform float landmarkWeathering;\n' + shader.fragmentShader
      .replace('#include <map_fragment>', `
        float kind = floor(surfaceKind+.5);
        vec2 m = vMapUv;
        vec3 grain = texture2D(map, m * .48).rgb - .5;
        float height = grain.r * .0025;
        float patina = grain.r * landmarkWeathering;
        float surfaceRough = roughness, surfaceMetal = metalness;
        if (kind == 1.) {
          patina += grain.r * .37;
          height = grain.r * .005;
          surfaceRough = .87 + grain.r * .12;
        } else if (kind == 2. || kind == 7.) {
          patina += grain.g * .44;
          height = grain.g * .007;
          surfaceRough = .88 + grain.g * .15;
          if (kind == 7.) {
            vec2 course = m / vec2(.30,.088);
            vec2 aa = max(fwidth(course), vec2(.002));
            course.x += .5 * mod(floor(course.y), 2.);
            vec2 edges = min(fract(course), 1. - fract(course));
            vec2 body = smoothstep(vec2(.012)-aa*.5, vec2(.04)+aa*.5, edges);
            float seam = (1.-body.x*body.y) * (1.-smoothstep(.22,.86,max(aa.x,aa.y)));
            patina -= seam * .25;
            height -= seam * .004;
          }
        } else if (kind == 3.) {
          patina = grain.b * .60;
          surfaceRough = .63 + grain.b * .20;
          height = grain.b * .002;
        } else if (kind == 4. || kind == 5.) {
          vec2 tile = m / vec2(.205,.275);
          vec2 aa = fwidth(tile);
          float detail = 1.-smoothstep(.19,.76,max(aa.x,aa.y));
          float roll = .5+.5*cos(6.2831853*tile.x);
          float lap = smoothstep(.68,.97,fract(tile.y));
          float mottling = texture2D(map, (floor(tile)+.5)/37.).g-.5;
          patina = grain.r*.20 + detail*(.32*mottling + .15*(roll-.5) - .13*lap);
          height = grain.r*.001 + detail*(.026*roll - .009*lap);
          surfaceRough = (kind == 5. ? .35 : .78) + grain.r*.17;
        } else if (kind == 6.) {
          float blade = m.x*113.+2.*sin(m.y*3.1);
          float fibre = sin(blade)*(1.-smoothstep(.5,3.,fwidth(blade)));
          patina = grain.b*.52 + fibre*.085;
          height = grain.b*.005 + fibre*.0014;
          surfaceRough = .97;
        } else if (kind == 8.) {
          surfaceMetal = .62;
          surfaceRough = .45+grain.r*.17;
          height = grain.r*.0008;
        } else if (kind == 9.) {
          surfaceMetal = .26;
          surfaceRough = .17;
          patina = grain.r*.045;
          height = 0.;
        }
        diffuseColor.rgb *= 1.+patina;
      `)
      .replace('#include <roughnessmap_fragment>', '#define roughness surfaceRough\n#include <roughnessmap_fragment>\n#undef roughness')
      .replace('#include <metalnessmap_fragment>', '#define metalness surfaceMetal\n#include <metalnessmap_fragment>\n#undef metalness')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        vec3 dx=dFdx(-vViewPosition), dy=dFdy(-vViewPosition);
        vec3 across=cross(dy,normal), along=cross(normal,dx);
        float area=dot(dx,across);
        normal=normalize(normal - sign(area)*(across*dFdx(height)+along*dFdy(height))/max(abs(area),1.e-9));
      `);
  };
  return material;
}

;
// vietnam-landmarks.js
'use strict';
window.VietnamLandmarks=(()=>{
  // OSM footprint centres and axes in WGS84. Positive local Z is the principal façade.
  // Gate centres on OSM way 39514795, in metres in the market's local frame.
  const marketSideGates=[
    {label:'CỬA TÂY',side:-1,x:-49.6,z:10.4},
    {label:'CỬA ĐÔNG',side:1,x:48.7,z:9.2}
  ];
  const marketSolids=[[0,0,44.5,61],[-1.2,-64.4,27,3.9],
    ...marketSideGates.map(({x,z})=>[(x+Math.sign(x)*44)/2,z,(Math.abs(x)-44)/2,8])];
  const entries=[
    {id:'turtle',photo:'https://kienthuc.net.vn/he-lo-hinh-anh-can-canh-ben-trong-thap-rua-ho-guom-post997231.html',name:'Tháp Rùa',city:'Hà Nội',lon:105.852293,lat:21.027873,yaw:0,width:4.54,depth:6.28,
      start:[105.853615,21.02761],bearing:8,map:'https://www.openstreetmap.org/way/178995269',
      source:'https://scov.gov.vn/dat-nuoc-con-nguoi/dat-nuoc-viet-nam/ho-guom-dep-tuyet-qua-goc-nhin-la.html'},
    {id:'cathedral',photo:'https://danangfantasticity.com/en/culture-en/danang-cathedral',name:'Nhà thờ Con Gà',city:'Đà Nẵng',lon:108.2230584,lat:16.0666828,yaw:1.492,width:20,depth:46,
      start:[108.223797,16.067551],map:'https://www.openstreetmap.org/way/404714309',
      source:'https://danangfantasticity.com/en/culture-en/danang-cathedral'},
    {id:'market',photo:'https://www.vietnam.vn/en/cho-ben-thanh-thay-ao-moi-sau-6-ngay-trung-tam-tp-hcm-ruc-ro-don-tet',name:'Chợ Bến Thành',city:'TP. Hồ Chí Minh',lon:106.698017,lat:10.772568,yaw:.532,width:89,depth:122,
      start:[106.698484,10.771409],map:'https://www.openstreetmap.org/way/39514795',
      solids:marketSolids,
      reserve:(x,z,pad)=>marketSolids.some(([cx,cz,w,d])=>Math.abs(x-cx)<w+1.5+pad&&Math.abs(z-cz)<d+1.5+pad)||
        z>=60-pad&&z<113+pad&&Math.abs(x)<39+pad,
      source:'https://visithcmc.vn/vi/kham-pha-cho-ben-thanh-tphcm-tu-a-z-5-phut-doc/'},
    {id:'sapa',photo:'https://clublog.club-t.com/_ct/17777960',name:'Nhà thờ đá Sa Pa',city:'Sa Pa',lon:103.8423215,lat:22.335102,yaw:-2.31,width:12.6,depth:38.5,scale:[1.11,1,1.24],
      start:[103.841426,22.335771],map:'https://www.openstreetmap.org/way/1379648108',source:'https://vietnamtourism.gov.vn/en/post/11269'},
    {id:'coal',photo:'https://vinpearl.com/en/quang-ninh-museum',name:'Bảo tàng Quảng Ninh',city:'Hạ Long',lon:107.097448,lat:20.9485596,yaw:1.386,width:62,depth:45,scale:[1.09,1,.98],
      start:[107.098402,20.949146],map:'https://www.openstreetmap.org/way/674061974',source:'https://dulichso.quangninh.gov.vn/article/bao-tang-quang-ninh-bieu-tuong-than-da-giua-long-ha-long-2d1'},
    {id:'flag',photo:'https://dantri.com.vn/thoi-su/noi-ghi-dau-nhung-khoanh-khac-chuyen-dong-lich-su-20250901183433824.htm',name:'Kỳ Đài',city:'Huế',lon:107.5802849,lat:16.4663006,yaw:.623,width:78,depth:49,scale:[1.18,1,.79],
      start:[107.581668,16.465841],map:'https://www.openstreetmap.org/way/218427614',source:'https://svhtt.hue.gov.vn/tin-trong-tinh/khanh-thanh-cong-trinh-chieu-sang-my-thuat-ky-dai-hue.html'},
    {id:'ponagar',photo:'https://dulichso.khanhhoa.gov.vn/article/thap-ba-po-nagar-77f',name:'Tháp Bà Po Nagar',city:'Nha Trang',lon:109.195463,lat:12.265371,yaw:1.56,width:47,depth:58,
      start:[109.196350,12.265950],map:'https://www.openstreetmap.org/way/146780347',source:'https://vietnam.travel/vi/things-to-do/vietnams-cham-legacy/'},
    {id:'rong',photo:'https://mia.vn/cam-nang-du-lich/ghe-nha-rong-kon-klor-chiem-nguong-net-dep-van-hoa-mien-cao-dac-sac-7869',name:'Nhà rông Kon Klor',city:'Kon Tum',lon:108.0344241,lat:14.3482379,yaw:-1.32,width:16.7,depth:9.9,
      start:[108.033765,14.347389],map:'https://www.openstreetmap.org/node/4133919102',source:'https://nongthon.vietnamtourism.gov.vn/thanh-pho-kon-tum-bao-ton-va-phat-huy-gia-tri-nghe-truyen-thong/'},
    {id:'station',photo:'https://thegioitiepthi.danviet.vn/ga-da-lat-chay-cac-chuyen-tau-co-phuc-vu-du-khach-den-voi-cao-nguyen-20240411210115688-d26878.html',name:'Ga Đà Lạt',city:'Đà Lạt',lon:108.4544254,lat:11.9415757,yaw:-.99,width:66,depth:17,scale:[1.27,1,1.07],
      start:[108.453436,11.941116],map:'https://www.openstreetmap.org/relation/17877171',source:'https://vietnamtourism.gov.vn/post/33922'},
    {id:'bat',photo:'https://datviettour.com.vn/tin-tuc/chua-doi-net-dep-kien-truc-viet-nam',name:'Chùa Dơi',city:'Sóc Trăng',lon:105.9724502,lat:9.5789424,yaw:-1.219,width:13.1,depth:19.7,scale:[.8,1,.68],
      start:[105.972331,9.580009],map:'https://www.openstreetmap.org/way/669125218',source:'https://dantoc.vietnamtourism.gov.vn/kham-pha-chua-doi-noi-hoi-tu-van-hoa-khmer-viet-hoa/'},
    {id:'dinh',photo:'https://thegioianh.diendandoanhnghiep.vn/ngoi-den-nam-canh-ngon-hai-dang-o-phu-quoc-6607.html',name:'Dinh Cậu',city:'Phú Quốc',lon:103.9564106,lat:10.2172171,yaw:1.01,width:11,depth:13,
      start:[103.957484,10.217047],map:'https://www.openstreetmap.org/way/1491082316',source:'https://vietnamtourism.gov.vn/post/54798'}
  ];
  const additions=new Map((window.VietnamSights||[]).map(site=>[site.id,site]));
  entries.push(...additions.values());
  const churchRails=[[-14.7,39,.29,16.4],[14.7,39,.29,16.4],[-10.05,55.1,4,.38],[10.05,55.1,4,.38]];

  // Bake the masonry, roof tiles, trims and ornaments into one draw call per building.
  function* model(T,id){
    const positions=[],normals=[],colours=[],uvs=[],indices=[],group=new T.Group(),pose=new T.Object3D();
    const point=new T.Vector3(),normal=new T.Vector3(),normalMatrix=new T.Matrix3();
    let seed=2043;
    function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
    const cube=new T.BoxGeometry(),round=new T.CylinderGeometry(1,1,1,20),colour=new T.Color();
    const finishKinds=[],swatches=new Map(),footingVertices=[];
    function palette(spec, defaults=false) {
      for(const [kind,tints] of Object.entries(spec))
        for(const tint of [].concat(tints)){
          if(!defaults||!swatches.has(tint))swatches.set(tint,landmarkFinish[kind]);
        }
    }
    function stamp(geo,tint,x,y,z,w=1,h=1,d=1,ry=0,rx=0,rz=0){
      pose.position.set(x,y,z);pose.scale.set(w,h,d);pose.rotation.set(rx,ry,rz,'YXZ');pose.updateMatrix();
      const p=geo.attributes.position,n=geo.attributes.normal,base=positions.length/3;
      const kind=swatches.get(tint)??landmarkFinish.plain;
      // Only the underside of an actual ground-level slab can extend downhill.
      const footing=geo===cube&&rx===0&&rz===0&&Math.min(w,d)>=1&&Math.max(w,d)<=160&&
        y-h/2>=-.60&&y-h/2<=.22&&y+h/2>0;
      normalMatrix.getNormalMatrix(pose.matrix);colour.setHex(tint);
      for(let i=0;i<p.count;i++){
        const {x:px,y:py,z:pz}=point.fromBufferAttribute(p,i).applyMatrix4(pose.matrix);
        const {x:nx,y:ny,z:nz}=normal.fromBufferAttribute(n,i).applyNormalMatrix(normalMatrix);
        positions.push(px,py,pz);normals.push(nx,ny,nz);colours.push(colour.r,colour.g,colour.b);
        if(footing&&p.getY(i)<0)footingVertices.push(base+i);
        const top=Math.abs(ny)>Math.max(Math.abs(nx),Math.abs(nz));
        let u=top||Math.abs(nz)>=Math.abs(nx)?px:pz, v=top?pz:py;
        if(kind===landmarkFinish.tile||kind===landmarkFinish.glazedTile||kind===landmarkFinish.thatch){
          // Across and down the pitch, with the overlap facing the eave.
          const slopesX=Math.abs(nx)>Math.abs(nz);
          u=slopesX?pz:px;
          v=slopesX?px*Math.sign(nx):pz*Math.sign(nz);
        }else if(kind===landmarkFinish.timber){
          // Run the photographed fibres along the post, beam or deck plank.
          const a=p.getX(i)*w,b=p.getY(i)*h,c=p.getZ(i)*d;
          if(h>=w&&h>=d){u=b;v=Math.abs(n.getX(i))>.6?c:a;}
          else if(w>=d){u=a;v=Math.abs(n.getY(i))>.6?c:b;}
          else{u=c;v=Math.abs(n.getY(i))>.6?a:b;}
        }
        uvs.push(u,v);finishKinds.push(kind);
      }
      const order=geo.index;
      for(let i=0;i<(order?.count??p.count);i++)indices.push(base+(order?order.getX(i):i));
    }
    // Place a complete authored building on a surveyed axis. Keep its metre
    // UVs in building space so rotating the hall also rotates its tile rows.
    function place(x,z,yaw,build){
      const start=positions.length,firstChild=group.children.length;
      build();
      const c=Math.cos(yaw),s=Math.sin(yaw);
      for(let i=start;i<positions.length;i+=3){
        const px=positions[i],pz=positions[i+2],nx=normals[i],nz=normals[i+2];
        positions[i]=x+c*px+s*pz;positions[i+2]=z-s*px+c*pz;
        normals[i]=c*nx+s*nz;normals[i+2]=-s*nx+c*nz;
      }
      const matrix=new T.Matrix4().makeRotationY(yaw).setPosition(x,0,z);
      const children=group.children.slice(firstChild);
      for(const child of children)child.applyMatrix4(matrix);
      return children;
    }
    const box=(...args)=>stamp(cube,...args);
    const shoreRanges=[];
    function groundStamp(...args){
      const first=indices.length;
      stamp(...args);shoreRanges.push([first,indices.length]);
    }
    const deck=(...args)=>groundStamp(cube,...args);
    function tapered(tint,x,y,z,base,top,height,depthRatio=1,sides=4){
      const geo=new T.CylinderGeometry(top,base,height,sides);
      if(sides===4)geo.rotateY(Math.PI/4);
      stamp(geo,tint,x,y,z,1,1,depthRatio);geo.dispose();
    }
    function profile(shape,tint,x,y,z,depth,angle=0){
      const geo=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:8});stamp(geo,tint,x,y,z,1,1,1,angle);geo.dispose();
    }
    function outline(points,tint,x,y,z,thickness,angle=0){
      const shape=new T.Shape();points.forEach(([px,py],i)=>i?shape.lineTo(px,py):shape.moveTo(px,py));shape.closePath();
      profile(shape,tint,x,y,z,thickness,angle);
    }
    function arch(tint,x,y,z,width,height,angle=0){
      // A solid spandrel and jambs around a genuinely open passage.
      const span=width*.35,spring=height*.46;
      const s=new T.Shape();s.moveTo(-width/2,0);s.lineTo(-span,0);s.lineTo(-span,spring);
      s.quadraticCurveTo(-span,spring+span,0,spring+span*1.15);s.quadraticCurveTo(span,spring+span,span,spring);
      s.lineTo(span,0);s.lineTo(width/2,0);s.lineTo(width/2,height);s.lineTo(-width/2,height);s.closePath();
      profile(s,tint,x,y,z,.28,angle);
    }
    function sign(title,x,y,z,width,height,glass=false,ink){
      const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;
      const g=canvas.getContext('2d');if(!glass){g.fillStyle='#f2dfa7';g.fillRect(0,0,768,128);}
      g.fillStyle=ink||(glass?'#f1f2ef':'#703d39');g.font=glass?'bold 78px Arial':'bold 76px "Times New Roman", "Noto Serif", serif';g.textAlign='center';g.textBaseline='middle';g.fillText(title,384,67,732);
      const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
      const panel=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshStandardMaterial({map,transparent:glass,alphaTest:glass?.32:0,roughness:.86}));
      panel.position.set(x,y,z);group.add(panel);
    }
    function wavingFlag(width,height,px,py,pz){
      const canvas=document.createElement('canvas');canvas.width=192;canvas.height=128;
      const pen=canvas.getContext('2d');pen.fillStyle='#b92628';pen.fillRect(0,0,192,128);pen.fillStyle='#ffcf3b';pen.beginPath();
      for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?14:36;pen.lineTo(96+r*Math.cos(a),64+r*Math.sin(a));}
      pen.closePath();pen.fill();
      const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
      const cloth=new T.PlaneGeometry(width,height,24,6);cloth.translate(width/2,-height/2,0);
      const flag=new T.Mesh(cloth,new T.MeshStandardMaterial({map:texture,side:T.DoubleSide,roughness:.94}));flag.position.set(px,py,pz);
      const pos=cloth.attributes.position,rest=pos.array.slice();let frame=-1;
      const motion=matchMedia('(prefers-reduced-motion: reduce)');
      flag.onBeforeRender=()=>{const time=motion.matches?0:Math.floor(performance.now()/60);if(time===frame)return;frame=time;
        for(let i=0;i<pos.count;i++){const x=rest[i*3],y=rest[i*3+1],f=x/width,phase=x*.69+y*.22-time*.16;
          pos.setXYZ(i,x*(1-.07*f),y-f*(.7+.18*Math.sin(phase)),f*(1.25*Math.sin(phase)+.33*Math.sin(phase*2.1)));}
        pos.needsUpdate=true;cloth.computeVertexNormals();};
      group.add(flag);
    }
    if(id==='turtle'){
      const stone=0xb5b1a4,band=0x92887a,roof=0x706052;
      palette({stone:[stone,band],tile:roof});
      const island=new T.SphereGeometry(1,40,9);
      for(let i=0;i<island.attributes.position.count;i++){
        const p=island.attributes.position,x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),wave=1+.027*Math.sin(a*7)+.016*Math.cos(a*11);
        p.setXYZ(i,x*wave,y,z*wave);
      }
      island.computeVertexNormals();groundStamp(island,0x726952,0,-.98,0,9.5,1.47,12.7);groundStamp(island,0x617746,0,-.64,0,8.96,1.23,11.95);
      const shrub=new T.IcosahedronGeometry(1,0);
      for(let i=0;i<64;i++){
        const a=random()*Math.PI*2,dist=.61+random()*.28,x=Math.cos(a)*8.9*dist,z=Math.sin(a)*11.9*dist;
        stamp(shrub,i%4?0x647d45:0x85924d,x,-.64+1.23*Math.sqrt(1-dist*dist),z,.2+random()*.4,.12+random()*.25,.3,a);
      }
      shrub.dispose();island.dispose();
      box(stone,0,.59,0,4.95,.28,6.65);
      for(const [base,w,d,h] of [[.72,4.54,6.28,2.22],[3.31,3.64,4.8,1.98]]){
        for(const side of [-1,1]){
          for(let i=0;i<3;i++)arch(stone,side*(w/2-.13),base,(i-1)*d/3,d/3,h,side*Math.PI/2);
          for(let i=0;i<2;i++)arch(stone,(i-.5)*w/2,base,side*(d/2-.13),w/2,h,side<0?Math.PI:0);
        }
        for(const [rise,edge,thick,tint] of [[.04,.23,.16,band],[.21,.36,.18,roof],[.32,.07,.10,band]])box(tint,0,base+h+rise,0,w+edge,thick,d+edge);
      }
      for(const [floor,w,d] of [[3.24,4.63,6.35],[5.66,3.72,4.90]]){
        for(const side of [-1,1]){
          box(band,side*w/2,floor+.25,0,.11,.10,d);
          box(band,0,floor+.25,side*d/2,w,.10,.11);
          for(let i=1;i<14;i++)box(stone,side*w/2,floor+.12,(i/14-.5)*d,.08,.20,.09);
          for(let i=1;i<10;i++)box(stone,(i/10-.5)*w,floor+.12,side*d/2,.09,.20,.08);
          for(const end of [-1,1])box(stone,side*w/2,floor+.18,end*d/2,.23,.42,.23);
        }
      }
      box(stone,0,6.19,0,2.12,1.20,3.02);
      for(const side of [-1,1]){
        for(let i=-1;i<=1;i++){
          box(band,side*1.071,6.15,i*.88,.036,.85,.67);
          box(0xa29d90,side*1.099,6.15,i*.88,.034,.71,.53);
        }
        stamp(round,band,0,6.23,side*1.52,.39,.065,.39,0,Math.PI/2);
        stamp(round,0x433f37,0,6.23,side*1.57,.26,.03,.26,0,Math.PI/2);
      }
      // Paired ridges on two tiled hipped roofs, with curled figures at the four tips.
      for(const [y,w,d,rise] of [[6.79,2.80,3.60,.67],[7.80,2.07,2.85,.59]]){
        const eave=w*.5,top=.36,run=eave-top,len=Math.hypot(run,rise);
        tapered(roof,0,y+rise/2,0,eave*Math.SQRT2,top*Math.SQRT2,rise,d/w);
        for(const side of [-1,1]){
          for(let i=0;i<12;i++){
            const z=(i/11-.5)*d*.78;
            const fraction=Math.min(1,(1-2*Math.abs(z)/d)/(1-top/eave));
            box(i%3?0x827062:0x998877,side*(eave-run*fraction/2),y+rise*fraction/2+.025,z,len*fraction,.054,.055,0,0,-side*Math.atan2(rise,run));
          }
          for(const end of [-1,1]){
            const curl=new T.Shape();curl.moveTo(-.28,-.06);curl.quadraticCurveTo(.1,-.07,.30,.16);
            curl.quadraticCurveTo(.44,.36,.37,.49);curl.lineTo(.30,.40);curl.quadraticCurveTo(.23,.15,-.29,.10);curl.closePath();
            profile(curl,0x918574,side*(eave-.07),y+.035,end*(d/2-.13),.10,side>0?0:Math.PI);
          }
        }
        box(band,0,y+rise+.05,0,top*2.1,.13,d*top/eave);
        if(y<7)box(stone,0,7.62,0,1.39,.40,2.05);
      }
      for(const side of [-1,1])tapered(0x988876,0,8.55,side*.35,.11,.045,.34,1,8);
    }
    if(id==='cathedral'){
      const pink=0xe3a5a0,blush=0xeab1aa,trim=0xffe7d9,glass=0x334958,slate=0x757c7b;
      box(0xc9b59e,0,.03,38,30,.12,35);
      for(let j=0;j<4;j++)box(0xe4d4bd,0,.1+j*.1,24.45-j*.45,10-j*.25,.17+j*.2,1);
      for(const side of [-1,1]){
        box(0x73865c,side*10.7,.12,40,6.7,.17,24);
        box(0xddb7a3,side*14.7,.23,39,.49,.42,35);
        for(let j=0;j<=12;j++){
          const z=23+j*2.6;box(blush,side*14.7,1.07,z,.51,2.1,.5);tapered(trim,side*14.7,2.21,z,.42,.16,.24);
          if(j<12)for(let i=0;i<6;i++)box(0x52645b,side*14.7,1.02,z+.31+i*.37,.07,1.48,.065);
        }
        box(0x52645b,side*14.7,1.55,38.5,.09,.09,31);
        for(const x of [6.5,13.6]){box(blush,x*side,1.47,55.1,.95,2.9,.95);tapered(trim,x*side,3.08,55.1,.77,.22,.54);}
        box(0x52645b,10.1*side,1.5,55.1,6.6,.08,.09);
        for(let i=0;i<15;i++)box(0x52645b,(7.02+i*.44)*side,.92,55.1,.065,1.75,.09);
      }
      box(0xafa397,0,.21,0,20.8,.42,47);box(pink,0,5.2,-1,18.7,10,42);
      const gable=[[-9.7,0],[0,5.7],[9.7,0]];
      outline(gable,slate,0,10.1,-22,42.8);
      function lancet(x,y,z,w,h,a){
        for(const [scale,depth,tint] of [[1,0,trim],[.76,.08,glass]]){
          const width=w*scale,hgt=h*scale;
          const s=new T.Shape();s.moveTo(-width/2,0);s.lineTo(width/2,0);s.lineTo(width/2,hgt*.57);
          s.quadraticCurveTo(width*.36,hgt*.86,0,hgt);s.quadraticCurveTo(-width*.36,hgt*.86,-width/2,hgt*.57);s.closePath();
          profile(s,tint,x+Math.sin(a)*depth,y+(h-hgt)/2,z+Math.cos(a)*depth,.09,a);
        }
        box(trim,x+.18*Math.sin(a),y+h*.42,z+.18*Math.cos(a),.12,h*.61,.11,a);
      }
      for(const side of [-1,1])for(let j=0;j<8;j++){
        const z=-19+j*5.3;
        box(blush,side*9.68,4.55,z,.95,9.1,.82);tapered(trim,side*9.68,9.48,z,.65,.12,.84);
        if(j<7)lancet(side*9.41,2.2,z+2.5,2.8,6.3,side*Math.PI/2);
      }
      box(blush,0,8.8,19,8.1,17.1,6.7);
      for(const side of [-1,1]){
        box(blush,side*7.25,6.4,19,4.25,12.4,6.5);tapered(slate,side*7.25,15.5,19,3.17,.03,5.8);
        lancet(side*7.25,2.1,22.26,2.7,5,0);
        for(const sx of [-1,1])tapered(trim,side*7.25+sx*1.92,14.1,21.94,.39,.02,3.2);
      }
      for(const [y,w,h] of [[16.9,7.9,.4],[20.4,6.7,.36],[26.7,5.94,.35]])box(trim,0,y,19,w,h,w*.85);
      box(pink,0,18.7,19,6.4,3.8,5.3);box(blush,0,23.58,19,5.55,6.3,4.7);
      lancet(0,.59,22.39,5.4,8.25,0);
      // Paired shutters below the dial and pointed hoods on all four belfry faces.
      for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2]){
        const sa=Math.sin(a),ca=Math.cos(a),wall=Math.abs(ca)>.5?2.38:2.8;
        for(const off of [-.74,.74]){
          lancet(sa*wall+ca*off,20.7,19+ca*wall-sa*off,1.27,2.66,a);
          for(let j=0;j<4;j++)box(0x667272,sa*(wall+.19)+ca*off,21.05+j*.28,19+ca*(wall+.19)-sa*off,.70,.09,.10,a);
        }
        const x=sa*(wall+.11),z=19+ca*(wall+.11);
        stamp(round,trim,x,24.95,z,1.02,.15,1.02,a,Math.PI/2);
        stamp(round,0xe4dfc8,x+sa*.12,24.95,z+ca*.12,.83,.1,.83,a,Math.PI/2);
        box(0x514d44,x+sa*.20,25.20,z+ca*.20,.084,.57,.065,a,0,-.2);
        box(0x514d44,x+sa*.21+ca*.18,24.95,z+ca*.21-sa*.18,.43,.072,.065,a);
        outline([[-2.61,0],[0,2.15],[2.61,0],[0,2.72]],trim,x,26.15,z,.18,a);
      }
      lancet(0,17.30,21.68,2.12,2.55,0);
      stamp(round,0xe8dac0,0,18.53,21.96,.31,1.0,.25);
      const head=new T.SphereGeometry(1,8,6);stamp(head,0xe8dac0,0,19.29,22,.23,.28,.21);head.dispose();
      // Rose window, tracery and four corner pinnacles mark the stepped bell tower.
      stamp(round,trim,0,13.4,22.43,2.2,.14,2.2,0,Math.PI/2);stamp(round,glass,0,13.4,22.55,1.82,.12,1.82,0,Math.PI/2);
      for(let i=0;i<6;i++)box(trim,0,13.4,22.67,.1,3.6,.085,0,0,i*Math.PI/6);
      for(const x of [-2.64,2.64])for(const z of [16.8,21.2])tapered(trim,x,27.84,z,.5,.02,3.2);
      tapered(blush,0,30.68,19,3.63,.10,8.0,1,4);stamp(round,0x43474a,0,35.15,19,.07,1.3,.07);
      outline([[-1.32,.88],[-1.06,.82],[-.75,.4],[-.46,.42],[-.21,.63],[.04,.59],[.23,1.08],[.38,1.18],[.45,1.43],[.54,1.22],[.75,1.31],[.69,1.05],[.97,.97],[.65,.82],[.52,.44],[.32,.12],[-.09,0],[-.55,.11],[-.81,.32],[-1.35,.49]],0x504d41,0,35.68,19,.1);
      // Pointed hood moulds and openwork bands span the side aisles.
      for(const side of [-1,1]){
        for(const x of [4.6,8.8])for(const y of [6.9,10.3])box(trim,side*x,y,22.35,.28,.38,.38);
        for(let j=0;j<5;j++)lancet(side*(4.88+j*.88),7.44,22.32,.7,1.58,0);
        outline([[-2,0],[0,1.75],[2,0],[0,2.14]],trim,side*7.25,11.92,22.33,.16);
        for(const y of [10.1,12.4])box(trim,side*7.24,y,22.35,4.58,.21,.33);
        outline([[0,0],[2,2.42],[4,0],[2,3.08]],trim,side*7.25-2,6.04,22.58,.16);
      }
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4,x=Math.sin(a)*1.02,y=13.4+Math.cos(a)*1.02;
        const ring=new T.TorusGeometry(.45,.075,5,14);stamp(ring,trim,x,y,22.77);ring.dispose();
      }
    }
    if(id==='market'){
      const wall=0xeadbbb,trim=0xf3ead6,tile=0xb64639,glass=0x49534d;
      function shell(w,d,h,y,r,tint){
        const shape=new T.Shape(),x=w/2,z=d/2;
        shape.moveTo(-x+r,-z);shape.lineTo(x-r,-z);shape.quadraticCurveTo(x,-z,x,-z+r);
        shape.lineTo(x,z-r);shape.quadraticCurveTo(x,z,x-r,z);shape.lineTo(-x+r,z);
        shape.quadraticCurveTo(-x,z,-x,z-r);shape.lineTo(-x,-z+r);shape.quadraticCurveTo(-x,-z,-x+r,-z);
        const slab=new T.ExtrudeGeometry(shape,{depth:h,curveSegments:6,bevelEnabled:false});slab.rotateX(-Math.PI/2);
        stamp(slab,tint,0,y,0);slab.dispose();
      }
      shell(93.4,129,.18,-.04,4.9,0xb8aea0);
      for(let j=0;j<3;j++)box(0xc9bdad,0,.15,62.0+j*.72,86.4,.025,.043);
      shell(90,123,.32,0,3.5,0xa5a297);shell(88,121,5.65,.32,3.5,wall);
      shell(88.6,121.8,.28,5.82,3.55,trim);shell(88.2,121.5,.22,6.06,3.55,tile);
      function hallRoof(x,z,w,length,eave,rise,angle,colour){
        outline([[-w/2,0],[0,rise],[w/2,0]],colour,x-Math.sin(angle)*length/2,eave,z-Math.cos(angle)*length/2,length,angle);
        box(0xc86b51,x,eave+rise,z,.22,.17,length,angle);
      }
      // A raised cruciform nave separates four fields of parallel ventilated roofs.
      for(const signX of [-1,1])for(const signZ of [-1,1]){
        for(let i=0;i<3;i++){
          const x=signX*(12+i*10.4),z=signZ*31;
          hallRoof(x,z,10.5,46,6.28,2.4,0,i===1?0xb64a3f:tile);
          box(0x7a6252,x,8.17,z,2.65,.85,33);
          hallRoof(x,z,3.45,33.8,8.56,.75,0,0xbc5142);
        }
      }
      hallRoof(0,0,15,110,6.28,4.05,0,tile);hallRoof(0,0,15.5,82,6.28,4.13,Math.PI/2,tile);
      box(0x927159,0,9.82,0,4.85,1.52,96);hallRoof(0,0,6.15,96,10.53,1.18,0,0xbc5142);
      for(const side of [-1,1]){
        box(0x927159,side*23,9.87,0,30,1.30,3.7);hallRoof(side*23,0,4.7,30.5,10.48,.92,Math.PI/2,0xbc5142);
        for(let j=0;j<10;j++){
          const z=(j-4.5)*10;box(trim,side*40.33,6.42,z,3.4,.28,3.2);
          box(0xb2ada2,side*40.33,6.72,z,2.0,.4,1.76);
        }
      }
      for(const side of [-1,1]){
        for(let i=0;i<20;i++){
          const z=(i-9.5)*5.95;box(trim,side*44.1,3.35,z,1.1,6.6,.6);
          box(glass,side*44.08,2.65,z+2.67,.2,4.2,4.25);
          for(let j=0;j<3;j++)box(wall,side*44.25,3.62+j*.4,z+2.67,.22,.16,4.35);
        }
        for(let i=0;i<7;i++){
          const x=side*(9+i*5.25);box(glass,x,2.6,60.7,3.6,4.4,.28);box(trim,x+side*2.23,3.3,61,.53,6.4,.77);
          box(i%3===0?0x8e9d80:0xb26446,x,4.75,61.3,4.85,.16,1.6,0,.09);
          box(0x79684e,x,1.03,61.06,3.5,.34,.56);
          for(let j=0;j<4;j++)box([0xc78a52,0xbba16f,0x909c62,0xaf6145][(i+j)%4],x-1.29+j*.78,1.45,61,.69,.51,.48);
        }
      }
      const cz=56.3;
      box(wall,0,7.5,cz,9.7,14.8,9.1);box(trim,0,14.9,cz,10.2,.68,9.5);
      box(wall,0,17.65,cz,9.2,5.2,8.7);
      for(const a of [0,Math.PI/2,-Math.PI/2,Math.PI]){
        const s=Math.sin(a),c=Math.cos(a),face=Math.abs(c)>.5?4.42:4.66;
        stamp(round,0x896e4a,s*face,17.61,cz+c*face,1.96,.18,1.96,a,Math.PI/2);
        stamp(round,0xfff3d9,s*(face+.12),17.61,cz+c*(face+.12),1.7,.09,1.7,a,Math.PI/2);
        for(let i=0;i<12;i++){
          const rad=i*Math.PI/6,off=Math.sin(rad)*1.4,depth=face+.2;
          box(0x484637,s*depth+c*off,17.61+Math.cos(rad)*1.4,cz+c*depth-s*off,.1,.30,.08,a,0,-rad);
        }
        for(const [ang,len] of [[-.96,1.06],[1.12,.83]]){
          const off=Math.sin(ang)*len/2,depth=face+.27;
          box(0x34392f,s*depth+c*off,17.61+Math.cos(ang)*len/2,cz+c*depth-s*off,.13,len,.08,a,0,-ang);
        }
      }
      for(const side of [-1,1]){
        box(0xd5ad60,side*2.64,17.65,60.69,2.89,4.69,.07);
        box(trim,side*4.36,17.65,60.79,.29,4.75,.19);
      }
      box(trim,0,20.51,cz,10.2,.6,9.7);box(wall,0,21.14,cz,9.55,.78,9);
      tapered(tile,0,22.99,cz,8.0,.21,2.78,.95);
      box(glass,0,3.35,61,6.6,6.4,.28);arch(trim,0,.24,61.21,9.4,7.2);
      for(const side of [-1,1]){
        box(trim,side*4.47,8.5,60.99,.48,16.4,.35);
        for(let i=0;i<6;i++){
          const x=side*(11.5+i*5.44);
          arch(wall,x,.25,61.55,5.42,5.45);
          box(trim,x,5.89,61.63,5.45,.27,.46);
        }
        for(const y of [15.83,19.52])box(trim,side*3.72,y,60.83,.42,.56,.34);
      }
      for(let i=0;i<9;i++)box(0x675c4a,(i-4)*.71,21.22,60.25,.43,.56,.18);
      box(trim,0,21.51,cz,10.65,.19,9.85);
      tapered(0x765746,0,24.92,cz,.24,.025,1.32,1,8);
      outline([[-.52,.92],[.51,.92],[.46,.18],[0,-.26],[-.46,.18]],0x7b7853,0,8.56,61.11,.14);
      sign('CHỢ BẾN THÀNH',0,11.07,61.22,9.23,1.42);

      // The side portals have tall flat parapets, pairs of white pilasters
      // and ceramic panels between perforated ventilation screens.
      for(const {label,side,x,z} of marketSideGates)place(x,z,side*Math.PI/2,()=>{
        const depth=Math.abs(x)-44;
        box(0x3e403a,0,2.2,-depth+.35,8.2,4.4,.25);
        box(wall,0,6.55,-depth/2,8.6,4.7,depth);
        box(trim,0,8.96,-depth/2,8.85,.19,depth+.13);
        for(const hand of [-1,1]){
          box(trim,hand*4.08,4.5,-.25,.48,8.85,.54);
          box(wall,hand*6.15,3.45,-depth/2,3.85,6.8,depth);
          box(trim,hand*6.15,6.91,-depth/2,4,.19,depth+.1);
          box(0x9a927e,hand*3.73,2.17,-depth/2,.32,4.25,depth);
          for(const col of [1.43,2.65]){
            box(glass,hand*col,4.97,.025,.93,1.34,.06);
            for(let row=0;row<6;row++){
              const y=4.44+row*.20,cx=hand*col;
              box(trim,cx-.22,y,.08,.51,.10,.10,0,0,-.25);
              box(trim,cx+.22,y,.08,.51,.10,.10,0,0,.25);
            }
          }
        }
        box(0x45685d,0,5.13,.03,1.52,1.64,.12);
        const relief=side<0
          ? [[-.64,.25],[-.20,.45],[.46,.36],[.66,.04],[.28,-.05],[.01,-.15],[-.43,-.61],[-.20,-.12]]
          : [[-.67,.49],[-.32,.25],[0,.35],[.32,.25],[.67,.49],[.52,.12],[.28,-.02],[.13,-.46],[-.15,-.46],[-.30,-.03],[-.50,.13]];
        outline(relief,0xd7b779,0,5.1,.11,.055);
        sign(label,0,7.36,.08,5.8,.95,true,'#765c42');
      });

      // The Lê Thánh Tôn frontage has a low arcade, flower stalls and a
      // curved nameboard above its central aisle, visible across the street.
      place(-1.2,-68.3,Math.PI,()=>{
        box(0x766553,0,3.88,-3.8,54,.23,7.65);
        for(let bay=-4;bay<=4;bay++){
          const x=bay*6;
          box(0x454740,x,1.82,-7.36,5.55,3.64,.23);
          arch(wall,x,.03,-.3,6,3.85);
          if(Math.abs(bay)<2)continue;
          box(0x705c48,x,.55,-1.75,3.5,.22,1.12);
          for(let pot=0;pot<4;pot++){
            const px=x+(pot-1.5)*.75,pz=-1.73+(pot%2)*.17;
            tapered(0x986443,px,.83,pz,.21,.31,.40,1,7);
            tapered(0x58714b,px,1.22,pz,.37,.17,.52,1,7);
            stamp(round,[0xe3b64b,0xc47780,0xe1d6a4][(bay+4+pot)%3],px,1.46,pz,.25,.17,.21);
          }
        }
        const crest=new T.Shape();
        crest.moveTo(-2.7,0);crest.lineTo(-2.7,1.40);
        crest.quadraticCurveTo(0,3.05,2.7,1.40);crest.lineTo(2.7,0);crest.closePath();
        profile(crest,trim,0,3.02,.025,.15);
        sign('CỬA BẮC',0,4.26,.195,4.6,.73,true,'#483e34');
        sign('CHỢ BẾN THÀNH',0,3.55,.195,3.8,.49,true,'#483e34');
      });
    }
    // The following pieces share the same baked mesh and metric coordinates as the original three sites.
    const stone=0xa3937c,ochre=0xd3a451,cream=0xf3deb0,tileRed=0x95513d,wood=0x633e2e;
    palette({stone,plaster:[cream,ochre],timber:wood,tile:tileRed});
    function gable(x,eaves,z,w,h,d,tint){
      outline([[-w/2,0],[0,h],[w/2,0]],tint,x,eaves,z-d/2,d);
    }
    function steps(x,z,width,count){
      for(let i=0;i<count;i++)box(i%2?0xc1b49a:0xb7ac97,x,(count-i)*.085,z+i*.36,width,(count-i)*.17,.39);
    }
    function dial(x,y,z,r){
      stamp(round,0x6d6253,x,y,z,r,.14,r,0,Math.PI/2);
      stamp(round,0xf2e7c9,x,y,z+.13,r*.89,.09,r*.89,0,Math.PI/2);
      for(let i=0;i<12;i++){
        const a=i*Math.PI/6;box(wood,x+r*.74*Math.sin(a),y+r*.74*Math.cos(a),z+.21,.07,r*.16,.07,0,0,-a);
      }
      for(const [a,l] of [[-.78,.42],[1.15,.7]])box(wood,x+Math.sin(a)*l*r/2,y+Math.cos(a)*l*r/2,z+.25,.08,r*l,.08,0,0,-a);
    }
    function stoneWindow(x,y,z,w,h,angle=0){
      box(0x46504d,x,y+h/2,z,w,h,.16,angle);
      arch(0xc4beb1,x+.13*Math.sin(angle),y,z+.13*Math.cos(angle),w+.3,h+.16,angle);
    }
    if(id==='sapa'){
      const limestone=0xb6b3a5,slate=0x504c47,w=10.4;
      // Draw the irregular rows in metre-space so stones retain their size on the belfry and nave.
      const sheet=document.createElement('canvas');sheet.width=sheet.height=256;
      const brush=sheet.getContext('2d');brush.fillStyle='#77776b';brush.fillRect(0,0,256,256);
      for(let row=0;row<12;row++){
        let x=row%2?-17:0;
        while(x<256){
          const width=28+Math.floor(random()*23),tone=151+Math.floor(random()*39);
          brush.fillStyle='rgb('+tone+','+(tone-2)+','+(tone-13)+')';
          brush.fillRect(x+.6,row*256/12+.7,width-1.2,256/12-1.5);
          for(let p=0;p<28;p++){
            brush.fillStyle=p%2?'rgba(46,42,34,.15)':'rgba(239,237,212,.19)';
            brush.fillRect(x+random()*width,row*256/12+random()*256/12,1+random()*2,.8+random());
          }
          x+=width;
        }
      }
      const blocks=new T.CanvasTexture(sheet);blocks.colorSpace=T.SRGBColorSpace;blocks.wrapS=blocks.wrapT=T.RepeatWrapping;
      const shell=[],shellNormals=[],shellUV=[];
      function stonework(geo,x,y,z){
        const g=geo.index?geo.toNonIndexed():geo,p=g.attributes.position,n=g.attributes.normal;
        for(let i=0;i<p.count;i++){
          const X=p.getX(i)+x,Y=p.getY(i)+y,Z=p.getZ(i)+z,nx=n.getX(i),ny=n.getY(i),nz=n.getZ(i);
          shell.push(X,Y,Z);shellNormals.push(nx,ny,nz);
          shellUV.push((Math.abs(nx)>Math.abs(nz)?Z:X)/4.0,(Math.abs(ny)>.78?Z:Y)/3.72);
        }
        if(g!==geo)g.dispose();geo.dispose();
      }
      function stoneBlock(x,y,z,sx,sy,sz){stonework(new T.BoxGeometry(sx,sy,sz),x,y,z);}
      function stoneGable(x,y,z,width,rise,depth){
        const shape=new T.Shape();shape.moveTo(-width/2,0);shape.lineTo(0,rise);shape.lineTo(width/2,0);shape.closePath();
        stonework(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false}),x,y,z-depth/2);
        for(const side of [-1,1])box(slate,x+side*width*.25,y+rise*.5+.06,z,Math.hypot(width/2,rise)+.18,.20,depth+.23,0,0,-side*Math.atan2(rise,width/2));
      }
      stoneBlock(0,3.25,-1.7,w,6.5,27.9);stoneGable(0,6.48,-1.7,w+.34,4.05,28.1);
      for(const side of [-1,1]){
        for(let i=0;i<6;i++){
          const z=-14+i*4.8;
          stoneBlock(side*5.23,2.14,z,.69,4.28,.68);
          stoneBlock(side*5.23,5.1,z,.53,1.72,.56);
          stoneWindow(side*5.23,1.74,z+2.3,1.42,3.43,side*Math.PI/2);
        }
      }
      stoneBlock(0,8.13,10.63,4.72,16.26,4.78);stoneGable(0,16.25,10.63,4.91,2.80,4.97);
      const lancet=(w,h)=>{const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h*.64);s.quadraticCurveTo(w*.46,h*.82,0,h);s.quadraticCurveTo(-w*.46,h*.82,-w/2,h*.64);s.closePath();return s;};
      for(const side of [-1,1]){
        const x=side*2.12;
        stoneBlock(x,8.18,13.09,.44,16.36,.5);
        box(0x8f8c7c,x,16.36,13.10,.56,.22,.58);
      }
      profile(lancet(3.61,10.88),0x7b7b70,0,7.18,13.03,.09);
      profile(lancet(3.08,10.4),0xb2b0a2,0,7.19,13.14,.07);
      for(const side of [-1,1]){
        const x=side*.79;
        box(0x383b35,x,10.64,13.23,.52,6.48,.10);
        for(let i=0;i<24;i++)box(0x625e52,x,7.55+i*.263,13.31,.5,.072,.08,0,.23);
        box(limestone,x,13.99,13.26,.68,.18,.18);
      }
      stoneBlock(0,3.04,13.10,5.82,6.08,3.63);stoneGable(0,6.07,13.10,6.25,1.88,3.75);
      profile(lancet(4.14,5.67),0x797767,0,.24,14.93,.10);
      profile(lancet(3.64,5.40),0xc0bcac,0,.25,15.04,.08);
      profile(lancet(3.13,5.03),0x4d5041,0,.26,15.13,.08);
      profile(lancet(2.73,4.71),0x553d30,0,.27,15.22,.06);
      box(0x362e25,0,1.96,15.31,.047,3.25,.055);
      for(const x of [-1,1])for(const h of [1.18,2.57])box(0x6b4a37,x*.66,h,15.33,1.03,1.0,.03);
      for(const x of [-2.60,2.60])stoneBlock(x,2.82,14.93,.52,5.64,.47);
      box(0x434846,0,19.45,10.60,.12,1.02,.12);box(0x434846,0,19.58,10.60,.68,.10,.11);
      steps(0,15.48,6.30,4);
      const masonry=new T.BufferGeometry();
      masonry.setAttribute('position',new T.Float32BufferAttribute(shell,3));masonry.setAttribute('normal',new T.Float32BufferAttribute(shellNormals,3));masonry.setAttribute('uv',new T.Float32BufferAttribute(shellUV,2));
      const walls=new T.Mesh(masonry,new T.MeshStandardMaterial({map:blocks,roughness:.92}));walls.castShadow=walls.receiveShadow=true;group.add(walls);
    }
    if(id==='coal'){
      const panes=[],norm=[],shade=[];
      function curtain(x,z,w,h,angle){
        const c=Math.cos(angle),s=Math.sin(angle),nx=Math.ceil(w/3.05),ny=Math.round(h/2.88);
        for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){
          const x0=-w/2+i*w/nx+.025,x1=-w/2+(i+1)*w/nx-.025;
          const y0=3.54+j*h/ny+.021,y1=3.54+(j+1)*h/ny-.021;
          const tint=new T.Color().setHSL(.544+random()*.012,.045+random()*.03,.17+.075*j/ny+.020*random());
          for(const [u,y] of [[x0,y0],[x1,y0],[x1,y1],[x0,y0],[x1,y1],[x0,y1]]){
            panes.push(x+u*c,y,z-u*s);norm.push(s,0,c);shade.push(tint.r,tint.g,tint.b);
          }
        }
      }
      function glassWing(x,z,w,d,h){
        box(0x292e2f,x,3.53+h/2,z,w,h,d);
        curtain(x,z+d/2+.012,w,h,0);curtain(x,z-d/2-.012,w,h,Math.PI);
        curtain(x+w/2+.012,z,d,h,Math.PI/2);curtain(x-w/2-.012,z,d,h,-Math.PI/2);
        box(0x444a49,x,3.54+h,z,w+.08,.11,d+.08);
      }
      box(0x8a8980,0,.31,0,57.2,.61,45.4);
      box(0x454b49,0,2.01,-2.80,55.6,3.1,37.8);
      glassWing(-9.95,-2.53,34.0,37.84,21.0);glassWing(17.4,-3.72,20.55,36.5,18.8);
      const curtainWall=new T.BufferGeometry();
      curtainWall.setAttribute('position',new T.Float32BufferAttribute(panes,3));curtainWall.setAttribute('normal',new T.Float32BufferAttribute(norm,3));curtainWall.setAttribute('color',new T.Float32BufferAttribute(shade,3));
      const glazing=new T.Mesh(curtainWall,new T.MeshPhysicalMaterial({vertexColors:true,color:0xffffff,metalness:.48,roughness:.18,clearcoat:.8,clearcoatRoughness:.17,envMapIntensity:.9}));
      glazing.receiveShadow=true;group.add(glazing);
      // Broad stone steps, steel handrails and the recessed rectangular entrance.
      const doorway=-6.2;
      box(0xaaa89c,0,1.78,16.16,54.5,3.55,2.71);
      for(let i=0;i<18;i++){
        const z=22.8-i*.31,top=(i+1)*.19+.10;
        box(i%3?0xaaa89c:0x9d9d92,0,top/2,z,54.5,top,.33);
        box(0x9b4a40,doorway,top+.012,z,4.8,.018,.30);
      }
      for(const x of [-26.5,-17.7,17.7,26.5]){
        for(const i of [0,4,8,12,16])stamp(round,0xc9cdca,x,.65+(i+1)*.19,22.8-i*.31,.042,1.10,.042);
        box(0xc1c7c4,x,2.96,20.26,.08,.085,5.99,0,.55);
      }
      // The front volume projects over the entrance storey.
      box(0x313837,doorway,4.61,16.45,10.4,2.25,.24);
      for(let i=0;i<5;i++){
        box(0x536461,doorway+(i-2)*1.6,4.6,16.61,1.53,2.03,.10);
        box(0x8e9790,doorway+(i-2)*1.6,4.73,16.70,.042,.47,.06);
      }
      box(0x88918b,doorway,5.84,16.73,10.7,.17,1.18);
      const lettering=document.createElement('canvas');lettering.width=1024;lettering.height=768;
      const pen=lettering.getContext('2d');
      for(const [word,top,w,h] of [['BẢO TÀNG',14,736,280],['QUẢNG NINH',336,995,411]]){
        pen.save();pen.font='200 180px "Segoe UI Light","Segoe UI",sans-serif';
        const m=pen.measureText(word),ascent=m.actualBoundingBoxAscent,descent=m.actualBoundingBoxDescent;
        pen.translate((1024-w)/2,top);pen.scale(w/m.width,h/(ascent+descent));
        pen.fillStyle='#373d3d';pen.fillText(word,3,ascent+2);pen.fillStyle='#e7ebe6';pen.fillText(word,0,ascent);pen.restore();
      }
      const letters=new T.CanvasTexture(lettering);letters.colorSpace=T.SRGBColorSpace;
      const title=new T.Mesh(new T.PlaneGeometry(29.8,16.8),new T.MeshStandardMaterial({map:letters,transparent:true,alphaTest:.24,roughness:.6}));
      title.position.set(-8.8,15.44,16.43);group.add(title);
    }
    if(id==='flag'){
      // The river-facing edge comes to a point. The lower terrace flares into
      // two projecting shoulders, visible in aerial views from the south.
      const lower=[[-33,-27],[-24,-27],[-24,-10],[-17,-10],[-17,-22],[17,-22],[17,-10],[24,-10],[24,-27],[33,-27],[33,16],[0,31],[-33,16]];
      const middle=[[-21,-18],[21,-18],[21,11],[0,22],[-21,11]];
      const upper=[[-11,-10],[11,-10],[11,9],[-11,9]];
      function terrace(ring,y,h,wall,deck,parapet){
        const outline=ring.map(([x,z])=>new T.Vector2(x*.95,z*.95));
        const v=[],colors=[];
        function triangle(a,b,c,tint){
          v.push(...a,...b,...c);const k=new T.Color(tint);for(let i=0;i<3;i++)colors.push(k.r,k.g,k.b);
        }
        for(let i=0;i<ring.length;i++){
          const [x,z]=ring[i],[X,Z]=ring[(i+1)%ring.length],bottom=[x,y,z],next=[X,y,Z],top=[x*.95,y+h,z*.95],end=[X*.95,y+h,Z*.95];
          triangle(bottom,top,end,wall);triangle(bottom,end,next,wall);
          const dx=end[0]-top[0],dz=end[2]-top[2],length=Math.hypot(dx,dz),yaw=Math.atan2(-dz,dx);
          box(0x827970,(top[0]+end[0])/2,y+h-.10,(top[2]+end[2])/2,length+.05,.24,.38,yaw);
          if(parapet){
            const count=Math.max(1,Math.round(length/3.7));
            for(let j=0;j<count;j++){const t=(j+.5)/count;box(0x665b50,top[0]+dx*t,y+h+.27,top[2]+dz*t,length/count*.77,.54,.49,yaw);}
          }
        }
        for(const face of T.ShapeUtils.triangulateShape(outline,[])){
          const [a,b,c]=face.map(i=>[outline[i].x,y+h,outline[i].y]);
          if((b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2])<0)triangle(a,c,b,deck);else triangle(a,b,c,deck);
        }
        const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.computeVertexNormals();
        const n=geo.attributes.normal;
        const first=positions.length/3;
        for(let i=0;i<v.length/3;i++)indices.push(first+i);
        for(let i=0;i<v.length/3;i++){positions.push(v[i*3],v[i*3+1],v[i*3+2]);normals.push(n.getX(i),n.getY(i),n.getZ(i));colours.push(colors[i*3],colors[i*3+1],colors[i*3+2]);uvs.push((Math.abs(n.getX(i))>.7?v[i*3+2]:v[i*3])*.22,(n.getY(i)>.8?v[i*3+2]:v[i*3+1])*.22);}
        geo.dispose();
      }
      terrace(lower.map(([x,z])=>[x*1.04,z*1.04]),-.32,.72,0x696353,0x748044,false);
      terrace(lower,.4,5.15,0x877366,0x98796c,false);
      terrace(middle,5.55,5.8,0x685f57,0x866658,true);
      terrace(upper,11.35,6.12,0x817666,0x96786b,true);
      box(0x878078,0,17.79,0,4.1,.64,3.8);
      tapered(0x938a80,0,18.76,0,1.68,1.02,1.32,1,8);
      tapered(0xaaa59a,0,36.9,0,.42,.18,36,1,16);
      for(let i=0;i<13;i++)stamp(round,0x77766d,0,20+i*2.66,0,.44-i*.018,.1,.44-i*.018);
      wavingFlag(11,7.33,.18,54.6,0);
    }
    if(id==='ponagar'){
      const brick=0xa15d43,terracotta=0xb47851,lintel=0x715142,sandstone=0xc09d72,top=7.55;
      // Mandapa lies below the eastern sanctuary terrace, on the same approach axis.
      const mound=new T.SphereGeometry(1,38,12);
      stamp(mound,0x69774b,0,-3.7,-2,23.4,9.2,24.8);mound.dispose();
      const shrub=new T.IcosahedronGeometry(1,1);
      for(let i=0;i<84;i++){
        const theta=i*2.4,r=.71+.26*random();
        const x=23.4*r*Math.cos(theta),z=-2+24.8*r*Math.sin(theta);
        if(z>4&&Math.abs(x-4)<8||Math.abs(x)<15.6&&z<5.5&&z>-18.5)continue;
        const y=-3.7+9.2*Math.sqrt(1-r*r);
        stamp(shrub,[0x5e703e,0x788541,0x829253,0x6b8145][i%4],x,y+.22,z,1.0+random()*1.65,.70+random()*.9,.85+random(),theta);
      }
      shrub.dispose();
      box(0x926b51,0,3.25,-6.5,31.2,8.2,23.8);
      box(0xb28768,0,7.40,-6.5,31.7,.30,24.25);
      box(0xab8363,4,.72,21.0,14.1,1.44,18.8);
      for(let i=0;i<36;i++){
        const height=7.55-i*.17;
        box(i%4?0x9f7558:0xaf8766,4,height/2,5.9+i*.23,2.9,height,.25);
      }
      for(const side of [-1,1])for(const [offset,count,r,h] of [[3.2,5,.95,5.0],[6.0,6,.60,2.85]]){
        for(let i=0;i<count;i++){
          const x=4+side*offset,z=14.7+i*(12.7/(count-1));
          tapered(terracotta,x,1.44+h/2,z,r,r*.82,h,1,8);
          if(count===5)box(lintel,x+side*r*.89,4.1,z,.03,.34,.37);
        }
      }
      const leaf=[[-.5,0],[-.5,.36],[-.42,.58],[-.23,.79],[0,1],[.23,.79],[.42,.58],[.5,.36],[.5,0]];
      function pointed(tint,x,y,z,w,h,depth,angle=0){
        outline(leaf.map(([u,v])=>[u*w,v*h]),tint,x,y,z,depth,angle);
      }
      function sanctuary(x,z,w,h,type){
        const body=h*(type==='south'?.49:.54);
        box(lintel,x,top+.22,z,w+.62,.44,w+.62);
        box(brick,x,top+.37+body/2,z,w,body,w);
        for(const side of [-1,1])for(const offset of [-.40,-.20,0,.20,.40]){
          const relief=offset===0?.4:.22;
          box(terracotta,x+offset*w,top+.38+body/2,z+side*(w/2+.02),w*.072,body,relief);
          box(terracotta,x+side*(w/2+.02),top+.38+body/2,z+offset*w,relief,body,w*.072);
        }
        const cornice=top+.36+body;
        for(const [dy,k] of [[-.32,1.02],[0,1.13],[.28,1.07]])
          box(dy?terracotta:lintel,x,cornice+dy,z,w*k,.26,w*k);
        if(type==='south'){
          // The south tower has a rounded, nearly continuous cap and no corner towers.
          const curve=[[0,.55],[.17,.51],[.38,.43],[.64,.29],[.85,.13],[1,.025]],rise=h-body-.68;
          const geo=new T.LatheGeometry(curve.map(([dy,r])=>new T.Vector2(w*r,dy*rise)),28);
          stamp(geo,0xb5724b,x,cornice+.22,z,1,1,1.03);geo.dispose();
        }else{
          const rise=h-body-.82,levels=type==='main'?3:2;
          for(let i=0;i<levels;i++){
            const y=cornice+i*rise/levels,k=1-i*.74/levels,levelH=rise/levels;
            tapered(brick,x,y+levelH*.52,z,w*k*.67,w*k*.44,levelH,1);
            box(lintel,x,y+.20,z,w*k*1.05,.36,w*k*1.05);
            for(const a of [-1,1])for(const b of [-1,1]){
              const px=x+a*w*k*.41,pz=z+b*w*k*.41;
              box(terracotta,px,y+levelH*.34,pz,w*k*.16,levelH*.58,w*k*.16);
              tapered(sandstone,px,y+levelH*.8,pz,w*k*.15,.04,levelH*.6);
            }
          }
          tapered(sandstone,x,top+h-.23,z,w*.12,.10,.8,1,8);
        }
        // Alternating brick courses and the projecting corbel frieze catch light at the cornice.
        for(let j=0;j<Math.ceil(w);j++)for(const side of [-1,1]){
          const u=((j+.5)/Math.ceil(w)-.5)*w;
          box(terracotta,x+u,cornice-.40,z+side*w*.52,.22,.27,.27);
          box(terracotta,x+side*w*.52,cornice-.40,z+u,.27,.27,.22);
        }
        for(let i=0;i<48;i++){
          const y=top+1.1+(body-1.4)*random(),u=(random()-.5)*w*.89;
          const tint=[0x9c6148,0xaa6c4d,0x945c44][i%3],side=i%2?1:-1;
          if(i%4<2)box(tint,x+u,y,z+side*(w*.5+.013),.25+random()*.4,.105,.04);
          else box(tint,x+side*(w*.5+.013),y,z+u,.04,.105,.25+random()*.4);
        }
        for(let face=0;face<4;face++){
          const angle=face*Math.PI/2,normalX=Math.sin(angle),normalZ=Math.cos(angle);
          const front=face===0,travel=w*(front?.65:.51),portal=w*(front?.52:.45);
          const location=k=>[x+(travel+k)*normalX,z+(travel+k)*normalZ];
          if(front)box(brick,x,top+body*.27,z+w*.52,portal,body*.55,w*.32);
          for(const [d,k,t] of [[0,1.12,lintel],[.14,1.0,terracotta],[.30,.79,brick]]){
            const [px,pz]=location(d);
            pointed(t,px,top+.45,pz,portal*k,body*.82*k,.16,angle);
          }
          const [px,pz]=location(.53);
          if(front){
            box(0x392d25,px,top+body*.20,pz,portal*.53,body*.39,.16);
            for(const side of [-1,1])stamp(round,sandstone,px+side*portal*.32,top+body*.2,pz+.12,.14,body*.4,.14);
            box(sandstone,px,top+body*.41,pz+.10,portal*.78,.30,.46);
            pointed(sandstone,px,top+body*.44,pz+.08,portal*.52,body*.22,.16);
          }
        }
      }
      sanctuary(4,-1.5,8.8,23,'main');sanctuary(-6.8,-4.1,6.4,18,'south');
      sanctuary(-11.7,1.5,3.9,7.1,'east');sanctuary(4,-13.8,4.15,9,'west');
    }
    if(id==='rong'){
      const beam=0x443429,slat=0x674c34,deck=2.95;
      for(const x of [-6.8,-2.2,2.2,6.8])for(const z of [-2.96,2.96]){
        stamp(round,beam,x,deck*.5,z,.32,deck,.36);
        box(0x66513c,x,2.55,z,.84,.36,.85);
      }
      box(beam,0,deck-.17,0,16.4,.34,7.3);
      box(slat,0,4.17,0,15.9,2.46,6.82);
      for(const side of [-1,1])for(let i=0;i<66;i++){
        const x=-7.82+i*.24;
        if(side>0&&Math.abs(x)<1.05)continue;
        box(i%3?0x71583e:0x7e6444,x,4.2,side*3.43,.19,2.36,.09);
      }
      box(0x221e1b,0,4.08,3.48,1.66,2.16,.12);
      box(beam,0,2.84,3.9,15.8,.21,1.18);
      for(let i=0;i<24;i++){
        const x=-7.52+i*.65;
        for(const dir of [-1,1])box(0xc4b395,x+dir*.12,3.18,3.51,.045,.43,.025,0,0,dir*.89);
      }
      // An arched ridge, inward-sloping gable ends and flared skirts distinguish
      // the thatched hull from a constant-width triangular prism.
      function roofPoint(u,t,face){
        return [u*(8.65-2.26*t),5.24+t*(15.25+.64*(1-u*u)),
          face*(4.52*Math.pow(1-t,1.32)+.11+.32*u*u*(1-t))];
      }
      const thatch=new Map();
      function thatchFace(a,b,c,d,tint){
        if(!thatch.has(tint))thatch.set(tint,[]);
        thatch.get(tint).push(...a,...b,...c,...a,...c,...d);
      }
      for(const face of [-1,1]){
        for(let r=0;r<42;r++)for(let j=0;j<18;j++){
          const u=-1+2*j/18,v=u+2/18,t=r/42,h=(r+1)/42;
          const a=roofPoint(u,t,face),b=roofPoint(v,t,face),c=roofPoint(v,h,face),d=roofPoint(u,h,face);
          a[2]+=face*.045;b[2]+=face*.045;
          const shade=Math.floor(random()*11)+(r%5===0?0:5);
          const tint=0x6f6654+shade*0x010101;
          if(face>0)thatchFace(a,b,c,d,tint);else thatchFace(b,a,d,c,tint);
        }
        // Dark timber fascia around the rim, with pale bound cane around the ridge.
        box(beam,0,5.23,face*4.63,17.2,.18,.23);
      }
      for(const end of [-1,1])for(let row=0;row<42;row++){
        const t=row/42,h=(row+1)/42,a=roofPoint(end,t,-1),b=roofPoint(end,t,1),c=roofPoint(end,h,1),d=roofPoint(end,h,-1);
        if(end<0)thatchFace(a,b,c,d,0x776b53);else thatchFace(b,a,d,c,0x776b53);
      }
      for(const [tint,faces] of thatch){
        const sheet=new T.BufferGeometry();sheet.setAttribute('position',new T.Float32BufferAttribute(faces,3));sheet.computeVertexNormals();
        stamp(sheet,tint,0,0,0);sheet.dispose();
      }
      for(let j=0;j<19;j++){
        const u=-1+j/9,x=u*6.4,y=20.49+.64*(1-u*u);
        box(0xb9ad8a,x,y-.15,0,.74,.45,.45);
        box(beam,x,y+.27,0,.047,.65,.06);
      }
      // Two inclined notched log stairs meet at the central front landing.
      for(const side of [-1,1]){
        box(beam,side*2.75,1.45,4.02,.64,4.64,.77,0,0,side*.92);
        for(let i=0;i<9;i++)box(0x816849,side*(4.48-i*.43),.22+i*.31,4.08,.48,.105,.82);
      }
    }
    if(id==='station'){
      const plaster=0xe9ad40,trim=0xf4ebd6,edge=0x854434,roof=0x975038;
      // The long wings have ridges parallel to the tracks. The three front-facing
      // gables interrupt that roof only over the central booking hall.
      function wing(x,z,width,length,base,rise){
        box(plaster,x,base/2,z,width,base,length);
        const shape=[[-length*.54,0],[0,rise],[length*.54,0]];
        outline(shape,roof,x-width/2-.18,base,z,width+.36,Math.PI/2);
        box(trim,x,base-.07,z+length*.51,width,.18,.22);
      }
      wing(0,-.6,38,12.6,6.15,3.2);
      for(const side of [-1,1]){
        wing(side*21.7,-.65,7.8,11.2,3.45,2.25);
        for(let j=0;j<12;j++){
          const x=side*(10.2+j*.68);
          box(j%3?0x455753:0x647675,x,5.77,5.77,.53,.49,.065);
        }
        for(let j=0;j<3;j++){
          const x=side*(12.2+j*2.8);
          box(edge,x,1.92,5.83,2.2,2.65,.13);
          box(0x59615a,x,1.95,5.92,1.99,2.34,.1);
          box(trim,x,1.9,6.02,.09,2.35,.07);
        }
      }
      const glass=[0x516563,0xd2a43f,0x8fa69b,0x9f5034,0xc5c7af,0x6e8175,0x425451];
      for(let i=-1;i<=1;i++){
        const x=i*6.25;
        const face=[[-3.42,0],[-2.64,5.53],[0,8.85],[2.64,5.53],[3.42,0]];
        outline(face,edge,x,3.38,3.65,4.99);
        outline(face.map(([u,v])=>[u*.935,v*.974]),trim,x,3.38,8.65,.11);
        outline(face.map(([u,v])=>[u*.88,v*.94]),plaster,x,3.41,8.77,.06);
        box(edge,x,8.69,8.87,5.15,.13,.08);
        box(trim,x,5.95,8.88,3.55,4.77,.12);
        for(let row=0;row<6;row++)for(let col=0;col<4;col++){
          if(i===0&&row===5)continue;
          const tint=glass[(row*7+col*13+row*col+Math.abs(i))%glass.length];
          box(tint,x+(col-1.5)*.80,4.06+row*.72,8.98,.65,.54,.055);
        }
        box(0x373d38,x,1.68,6.18,4.35,3.19,.13);
        for(const mullion of [-1,0,1])box(trim,x+mullion*1.15,1.65,6.28,.08,3.13,.07);
      }
      dial(0,10.11,8.92,.85);sign('DALAT',0,7.68,9.04,3.28,.62);
      // Two round-ended tiled porticoes project over the entrance doors.
      for(const side of [-1,1]){
        const x=side*6.15;
        for(const [y,r,tint] of [[3.0,3.1,trim],[3.22,3.02,edge],[3.42,2.87,roof]]){
          stamp(round,tint,x,y,7.55,r,.22,r*.8);box(tint,x,y,6.9,2*r,.22,1.3);
        }
        for(const dx of [-1.65,1.65])stamp(round,edge,x+dx,1.48,8.81,.15,2.96,.15);
      }
      box(trim,0,3.13,7.17,20.5,.21,2.45);
      for(const side of [-1,1])for(const x of [12.2,16.2,19.6])stamp(round,edge,side*x,1.42,6.48,.16,2.84,.16);
      for(const side of [-1,1])box(roof,side*15.25,2.97,6.15,9.7,.21,2.3,0,-.08);
      steps(0,9.1,19,3);
    }
    if(id==='bat'){
      const gold=0xd7a347,ochreRed=0xb67445,cobalt=0x387bb7,white=0xe6dcc6;
      box(cobalt,0,.58,0,17.1,1.16,29.3);box(0xdcbb73,0,1.20,0,17.35,.16,29.5);
      box(ochreRed,0,3.84,-.15,11.7,5.12,23.4);
      // The two entrances flank a painted devotional panel on the main gable end.
      for(const side of [-1,1])for(let i=0;i<7;i++){
        const z=-12+i*4,x=side*7.65;
        box(white,x,3.71,z,.43,4.86,.43);
        for(const y of [1.52,5.63,6.13])box(gold,x,y,z,.72,.23,.72);
        outline([[0,0],[side*.70,.46],[side*1.03,1.30],[side*.48,1.05],[0,.54]],gold,x,5.02,z,.18);
        if(i===6)continue;
        box(cobalt,x,1.53,z+2,.31,.42,3.9);box(gold,x,2.37,z+2,.34,.13,3.94);
        for(let j=0;j<8;j++)tapered(0xdcb35f,x,1.94,z+.29+j*.48,.102,.08,.71,1,8);
      }
      for(let i=-2;i<=2;i++)for(const side of [-1,1]){
        const z=i*4.2;box(gold,side*5.90,3.70,z,.18,2.62,1.56);box(0x433e32,side*6.01,3.70,z,.13,2.29,1.23);
      }
      for(const [w,d,y,h] of [[17.0,29.3,6.25,2.8],[12.8,23.4,8.0,2.65],[8.4,17.7,9.83,3.38]]){
        gable(0,y,0,w,h,d,0xac673f);box(gold,0,y+.01,0,w+.28,.24,d+.23);
        for(const side of [-1,1]){
          const slope=Math.atan2(h,w*.5);
          for(let i=1;i<=12;i++)box(i%2?0xb97849:0x915638,side*(w/2)*(1-i/13),y+h*i/13+.035,0,.08,.06,d,0,0,-side*slope);
          for(const end of [-1,1]){
            const z=end*(d/2+.10);
            box(gold,side*w*.25,y+h*.5,z,.20,Math.hypot(w/2,h),.18,0,0,side*Math.atan2(w/2,h));
            outline([[0,0],[side*.56,.18],[side*.90,.79],[side*.98,1.47],[side*.50,.95]],gold,side*w*.49,y,z,.18);
          }
        }
        box(gold,0,y+h+.07,0,.24,.21,d+.3);
      }
      for(const z of [-6.4,0,6.4]){
        tapered(gold,0,13.62,z,.34,.17,.65,1,8);tapered(0xc99b54,0,14.3,z,.18,.02,.87,1,8);
      }
      for(const end of [-1,1]){
        const z=end*11.87;
        for(const side of [-1,1]){
          const x=side*3.98;
          box(gold,x,3.22,z,2.32,3.85,.17);box(0x49382e,x,3.12,z+end*.10,1.86,3.54,.18);
          outline([[-1.17,0],[0,1.33],[1.17,0]],gold,x,5.13,z,.22,end<0?Math.PI:0);
          for(let j=0;j<7;j++)box(0xa99e88,x,(7-j)*.09,end*(14.3+j*.30),2.60,(7-j)*.18,.32);
        }
        box(gold,0,3.88,z,5.17,4.66,.22);box(0x44695e,0,3.87,z+end*.14,4.76,4.27,.13);
        // A painted frontal panel, with a seated figure and attendants between the doors.
        const panel=document.createElement('canvas');panel.width=384;panel.height=320;
        const art=panel.getContext('2d');
        const grove=art.createLinearGradient(0,0,0,320);
        grove.addColorStop(0,'#244841');grove.addColorStop(.66,'#466e65');grove.addColorStop(1,'#476d6b');
        art.fillStyle=grove;art.fillRect(0,0,384,320);
        function oval(x,y,rx,ry,tint){
          art.fillStyle=tint;art.beginPath();art.ellipse(x,y,rx,ry,0,0,Math.PI*2);art.fill();
        }
        for(let i=0;i<280;i++){
          const u=random(),v=random(),x=u*384,y=v*320;
          if(Math.abs(x-192)>45||y<83)oval(x,y,2+random()*13,1+random()*7,['#647b5f','#2b5548','#3e665a','#75907c'][i%4]);
        }
        for(let j=0;j<3;j++){
          oval(192,243-j*7,82-j*9,14,'#9f743f');
          oval(192,239-j*7,81-j*9,10,'#cfaa63');
        }
        oval(191,115,49,54,'#954f28');oval(191,115,46,51,'#d49f50');oval(191,115,41,46,'#d7b95f');
        oval(192,115,18,24,'#513931');oval(192,122,15,19,'#c59155');oval(192,95,7,7,'#4a3830');
        art.fillStyle='#c3904a';art.beginPath();art.moveTo(174,140);art.quadraticCurveTo(164,148,160,183);
        art.quadraticCurveTo(143,194,133,206);art.bezierCurveTo(129,220,155,222,192,217);
        art.bezierCurveTo(232,224,252,216,250,206);art.lineTo(218,183);art.quadraticCurveTo(219,146,205,139);art.closePath();art.fill();
        art.strokeStyle='#88613a';art.lineWidth=3;art.beginPath();art.moveTo(205,142);art.quadraticCurveTo(188,166,166,184);
        art.moveTo(208,146);art.quadraticCurveTo(196,170,179,184);art.moveTo(144,209);art.quadraticCurveTo(168,200,192,213);
        art.quadraticCurveTo(216,201,240,209);art.stroke();
        oval(182,183,17,4,'#d7b273');oval(202,185,14,4,'#d7b273');
        for(const side of [-1,1])for(let j=0;j<4;j++){
          const u=192+side*(86+j*17),v=190+j*9;
          oval(u,v,7,9,'#c89b69');oval(u,v-5,6,3,'#564231');
          art.fillStyle=j%2?'#bb8649':'#bb6d3d';art.beginPath();art.moveTo(u-side*5,v+8);
          art.quadraticCurveTo(u+side*10,v+3,u+side*11,v+18);art.lineTo(u+side*19,v+32);
          art.quadraticCurveTo(u+side*9,v+40,u-side*13,v+31);art.closePath();art.fill();
          art.strokeStyle='#dfb681';art.lineWidth=3;art.beginPath();art.moveTo(u+side*3,v+13);art.lineTo(u-side*6,v+19);art.lineTo(u-side*11,v+10);art.stroke();
        }
        const paint=new T.CanvasTexture(panel);paint.colorSpace=T.SRGBColorSpace;
        const mural=new T.Mesh(new T.PlaneGeometry(4.70,4.12),new T.MeshStandardMaterial({map:paint,roughness:.93}));
        mural.position.set(0,3.87,z+end*.225);mural.rotation.y=end<0?Math.PI:0;group.add(mural);
        const width=7.35;
        outline([[-width/2,0],[0,2.96],[width/2,0]],gold,0,9.86,end*8.98,.16,end<0?Math.PI:0);
        for(let i=-3;i<=3;i++)for(let j=0;j<3-Math.abs(i)*.5;j++)
          outline([[0,0],[-.14,.18],[.02,.44],[.13,.20]],0xf2cb77,i*.76,10.03+j*.56,end*9.15,.12,end<0?Math.PI:0);
      }
    }
    if(id==='dinh'){
      const rock=new T.IcosahedronGeometry(1,0),deck=4.05;
      // Granite beds fracture into broad horizontal ledges at the waterline.
      for(let i=0;i<38;i++){
        const a=i*2.39996,r=Math.sqrt(i/38),x=11.0*r*Math.cos(a),z=11.2*r*Math.sin(a);
        stamp(rock,[0x9a9481,0x827d6f,0x786e61,0xa39a83][i%4],x,1.3-r*.7,z,3.3+random(),1.8+(1-r)*2.5,2.7+random(),a*.3,.07,-.11);
      }
      rock.dispose();
      box(0x9b9a8e,0,3.70,-.9,13,.70,16.6);box(0xe0d1b2,0,deck,-.9,13.3,.17,16.9);
      // The shrine and its open veranda have separate red roofs.
      box(0xedbd60,0,5.61,-1.8,7.9,3.1,6.8);
      for(const side of [-1,1]){
        for(const z of [-4.5,-2.25,0]){box(0x873e2b,side*3.98,5.75,z,.12,1.67,1.17);box(0x583a29,side*4.04,5.73,z,.09,1.44,.89);}
        for(const z of [1.24,5.35])stamp(round,0xa14531,side*3.51,5.56,z,.20,3.05,.20);
      }
      box(0x775032,0,5.32,1.65,2.65,2.47,.15);
      function hip(x,z,y,width,depth,rise){
        // Four curved roof planes share ridges; ridges rise slightly towards each corner.
        const points=[],ridges=[];
        const corners=[[-width/2,-depth/2],[width/2,-depth/2],[width/2,depth/2],[-width/2,depth/2]];
        for(let f=0;f<4;f++){
          const a=corners[f],b=corners[(f+1)%4];
          const vertex=(u,v)=>{
            const x0=a[0]+(b[0]-a[0])*u,z0=a[1]+(b[1]-a[1])*u;
            const ridgeX=.46*x0,ridgeZ=.25*z0;
            return [x0+(ridgeX-x0)*v,rise*(v*.76+v*v*.24)+.43*Math.pow(Math.abs(2*u-1),4)*(1-v),z0+(ridgeZ-z0)*v];
          };
          for(let j=0;j<5;j++)for(let k=0;k<8;k++){
            const a=vertex(k/8,j/5),b=vertex((k+1)/8,j/5),c=vertex(k/8,(j+1)/5),d=vertex((k+1)/8,(j+1)/5);
            points.push(...a,...c,...b,...b,...c,...d);
          }
          const rim=Array.from({length:11},(_,i)=>new T.Vector3(...vertex(i/10,0)));
          const ridge=Array.from({length:7},(_,i)=>new T.Vector3(...vertex(0,i/6)));
          ridges.push(rim,ridge);
        }
        const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points,3));geo.computeVertexNormals();
        stamp(geo,0xb5503b,x,y,z);geo.dispose();
        box(0xb55342,x,y+rise-.02,z,width*.46,.11,depth*.25);
        for(const curve of ridges){
          const tube=new T.TubeGeometry(new T.CatmullRomCurve3(curve),10,.071,5,false);
          stamp(tube,0xe1ad59,x,y+.045,z);tube.dispose();
        }
      }
      hip(0,-1.8,7.05,9.8,8.1,1.74);hip(0,3.64,7.04,8.5,4.6,1.10);
      box(0xb78445,0,7.01,5.45,7.8,.38,.33);
      box(0xe9b24c,0,8.84,-1.8,4.15,.17,.24);
      const pearl=new T.SphereGeometry(.20,12,9);stamp(pearl,0xdc9847,0,9.24,-1.8);pearl.dispose();
      for(const side of [-1,1]){
        // The paired dragon silhouettes at the roof ridge face the central disc.
        const dragon=[[-.07,.09],[.09,.27],[.34,.31],[.46,.17],[.70,.15],[1.03,.35],[1.37,.32],[1.67,.55],[1.83,.85],[1.76,.35],[1.48,.12],[1.15,.02],[.88,.04],[.63,-.02],[.37,.04],[.19,.13]];
        outline(dragon.map(([u,v])=>[side*(u+.19),v]),0xb99955,0,8.88,-1.78,.16);
      }
      for(const side of [-1,1]){
        for(let j=0;j<12;j++){
          const z=-8.6+j*1.39;box(0xc5c7bf,side*6.36,deck+.47,z,.18,.87,.18);
        }
        for(const y of [.33,.84])box(0xd0d3ca,side*6.36,deck+y,-.90,.11,.09,15.65);
      }
      for(let i=0;i<29;i++){
        const t=i/28,h=deck*(1-t)+.1,angle=t*.9;
        box(0x9a9787,2.5+3.55*Math.sin(angle),h/2,7.1+t*7.3,2.05,h,.47,-angle*.38);
      }
      // Blue-grey masonry gate frames the landward end of the stair.
      const gateX=5.23,gateZ=13.82;
      arch(0x7b96a4,gateX,.16,gateZ,3.30,3.12,-.28);
      for(const side of [-1,1])box(0x75929d,gateX+side*1.48,1.51,gateZ+side*.42,.46,2.86,.70,-.28);
      box(0x98573c,gateX,3.27,gateZ,3.67,.24,.82,-.28);
      box(0xc87643,gateX,3.49,gateZ,2.85,.20,.64,-.28);
      box(0xe4b854,gateX,3.17,gateZ+.39,1.85,.25,.09,-.28);
      const lx=-6.35,lz=-5.75;
      tapered(0xd9d7cb,lx,deck+.31,lz,1.75,1.38,.62,1,20);
      for(let i=0;i<6;i++){
        const r=1.20-i*.066;
        tapered(i%2?0x678b9d:0xe0dfd6,lx,deck+1.20+i*1.14,lz,r,r-.066,1.14,1,24);
      }
      stamp(round,0xd1d4c9,lx,deck+7.62,lz,1.52,.26,1.52);
      for(let i=0;i<12;i++){
        const a=i*Math.PI/6;stamp(round,0x647477,lx+1.35*Math.cos(a),deck+8.02,lz+1.35*Math.sin(a),.033,.75,.033);
      }
      for(const y of [7.89,8.35]){
        const rail=new T.TorusGeometry(1.35,.034,5,30);stamp(rail,0x768484,lx,deck+y,lz,1,1,1,0,Math.PI/2);rail.dispose();
      }
      stamp(round,0x92adb0,lx,deck+8.27,lz,.71,1.10,.71);
      tapered(0xe3dfd4,lx,deck+9.05,lz,.93,.10,.65,1,18);
      stamp(round,0x626e69,lx,deck+9.60,lz,.037,.55,.037);
      window.CentralArch.trees(T,{group},[{x:5.6,y:2.35,z:-4.1,h:7.8,width:10.1}]);
    }
    const addition=additions.get(id);
    if(addition){
      const steps=addition.build(T,{group,place,stamp,groundStamp,box,deck,round,tapered,profile,outline,arch,sign,random,wavingFlag,palette,vertexCount:()=>positions.length/3});
      if(steps?.next)yield* steps;
    }
    cube.dispose();round.dispose();group.name=id;
    if(!positions.length)return group;
    yield;
    const geometry=new T.BufferGeometry();
    geometry.setIndex(indices);
    for(const [name,values] of [['position',positions],['normal',normals],['color',colours]]){
      geometry.setAttribute(name,new T.Float32BufferAttribute(values,3));
      if(values.length>65536)yield;
    }
    geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.computeBoundingSphere();
    geometry.setAttribute('finishKind',new T.Uint8BufferAttribute(finishKinds,1));
    const finish=createLandmarkMaterial(T,id,addition?.plasterStain??.18);
    if(id==='market'||id==='flag'){
      const fort=id==='flag';
      const scanned=finish.onBeforeCompile;
      finish.customProgramCacheKey=()=>fort?'citadel-brick-scan':'market-roof-scan';
      finish.onBeforeCompile=shader=>{
        scanned(shader);
        const vary='varying vec3 masonryPoint; varying vec3 masonryNormal;\n';
        shader.vertexShader=vary+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n masonryPoint=position; masonryNormal=normal;');
        shader.fragmentShader=vary+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+(fort?`
          if(masonryPoint.y<17.7){
            vec2 face=abs(masonryNormal.y)>.65?masonryPoint.xz:vec2(abs(masonryNormal.x)>.65?masonryPoint.z:masonryPoint.x,masonryPoint.y);
            vec2 course=face/vec2(.51,.215);course.x+=mod(floor(course.y),2.)*.5;
            vec2 dist=abs(fract(course)-.5),aa=max(fwidth(course),vec2(.004));
            float joint=max(smoothstep(.466-aa.x,.486+aa.x,dist.x),smoothstep(.435-aa.y,.475+aa.y,dist.y));
            float fade=1.-smoothstep(.28,.78,max(aa.x,aa.y));
            float brick=fract(sin(dot(floor(course),vec2(12.7,81.3)))*4358.7);
            diffuseColor.rgb*=1.+fade*(.19*(brick-.5)-.24*joint);
          }`:`
          if(masonryNormal.y>.55&&vColor.r>vColor.g*2.2){
            vec2 roof=abs(masonryNormal.x)>abs(masonryNormal.z)?masonryPoint.zx:masonryPoint.xz;
            vec2 tile=roof*vec2(4.8,3.45);
            float fade=1.-smoothstep(.24,.85,max(fwidth(tile.x),fwidth(tile.y)));
            float stepLip=smoothstep(.72,.99,fract(tile.y));
            diffuseColor.rgb*=1.+fade*(.10*cos(tile.x*6.28318)-.15*stepLip);
          }`));
      };
    }
    const mesh=new T.Mesh(geometry,finish);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
    if(shoreRanges.length)mesh.userData.shoreCover=shoreRanges;
    if(footingVertices.length&&addition&&!group.userData.fitGround&&!addition.scale&&
       addition.solids?.length!==0&&!id.startsWith('cau-')){
      const p=geometry.getAttribute('position'),feet=new Map();
      for(const i of footingVertices){
        const x=p.getX(i),z=p.getZ(i),rest=p.getY(i),key=x+','+z;
        if(!feet.has(key))feet.set(key,{x,z,vertices:[]});
        feet.get(key).vertices.push([i,rest]);
      }
      group.userData.fitGround=ground=>{
        let changed=false;
        for(const {x,z,vertices} of feet.values()){
          const bed=ground(x,z)-.22;
          for(const [i,rest] of vertices){
            const y=Math.min(rest,bed);
            if(Math.abs(p.getY(i)-y)>.001){p.setY(i,y);changed=true;}
          }
        }
        if(changed){p.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();}
      };
    }
    return group;
  }
  function create(T,scene,nightLights={value:0}){
    const cached=new Map(),shoreCovers=new WeakMap(),finishes=createSightFinishes(T,nightLights);
    let displayed;
    function* prepareSteps(graph,cx,cz,ground=()=>0,deckHeight=null){
    const active=[];
    const buildingAreas=[],gardens=[],modeledBuildings=new Set();
    const naturalSites=new Set(['Thác nước','Hang động','Đỉnh núi','Hồ','Vịnh','Bãi biển','Khu bảo tồn','Vườn quốc gia']);
    const visitorSites=new Set(['Vườn cảnh','Công viên','Khảo cổ','Thành cổ','Lăng mộ','Đền chùa','Công trình tín ngưỡng','Di tích']);
    function gardenRadius(site,extent){
      if(site.gardenRadius)return site.gardenRadius;
      const fallback=naturalSites.has(site.kind)?75:visitorSites.has(site.kind)?35:12;
      // Use the shorter span so a long, narrow site does not clear entire
      // neighbouring blocks. Large parks still keep their surrounding villages.
      return extent?Math.min(120,Math.max(fallback,Math.min(...extent)*.5+8)):fallback;
    }
    function reserveBuildingArea(site,localRing){
      const ring=localRing.map(([u,v])=>new T.Vector2(site.x+u*site.c+v*site.s,site.z-u*site.s+v*site.c));
      buildingAreas.push({ring,bounds:new T.Box2().setFromPoints(ring)});
    }
    function prepareBuildingSites(graph,cx,cz){
      buildingAreas.length=gardens.length=0;modeledBuildings.clear();
      if(!graph)return;
      for(const site of active){
        gardens.push({x:site.x,z:site.z,r:gardenRadius(site.data,[site.data.width,site.data.depth])});
        if(site.data.surveyed)continue;
        const {data}=site,extra=data.id==='cathedral'?8:data.id==='turtle'?12:2;
        const rectangle=(x,z,w,d)=>reserveBuildingArea(site,[[x-w,z-d],[x+w,z-d],[x+w,z+d],[x-w,z+d]]);
        if(data.boundary)reserveBuildingArea(site,data.boundary);
        else rectangle(0,0,data.width/2+extra,data.depth/2+extra);
        if(data.id==='cathedral')rectangle(0,28.5,16,28.5);
        if(!data.boundary)for(const [x,z,w,d] of data.solids||[]){
          if(Math.abs(x)+w>data.width/2+extra||Math.abs(z)+d>data.depth/2+extra)rectangle(x,z,w,d);
        }
        const ref=(data.map||data.source||'').match(/openstreetmap\.org\/(way|relation)\/(\d+)\/?$/);
        if(ref)modeledBuildings.add(ref[1][0]+ref[2]);
        for(const id of data.modeledBuildings||[])modeledBuildings.add(id);
      }
      const precinct=graph.point(105.7956,20.5528);
      if(Math.hypot(precinct.x-cx,precinct.z-cz)<1500)gardens.push({...precinct,r:445});
      const [lon,lat]=graph.geo(cx,cz);
      for(const site of window.VietnamTourism?.nearby(lon,lat,900/graph.mx,900/graph.my)||[]){
        const p=graph.point(site.lon,site.lat);
        gardens.push({...p,r:gardenRadius(site,window.VietnamSightDetails?.[site.id]?.extent)});
      }
    }
    if(graph)for(const data of entries){
        if(additions.has(data.id)&&!data.build)continue;
        const {x,z}=graph.point(data.lon,data.lat);if(Math.hypot(x-cx,z-cz)>(data.viewDistance??1050))continue;
        if(!cached.has(data.id)){
          yield;
          const mesh=yield* model(T,data.id);
          finishes.apply(mesh);mesh.userData.height=new T.Box3().setFromObject(mesh).max.y*(data.scale?.[1]||1);
          mesh.visible=false;scene.add(mesh);cached.set(data.id,mesh);
          yield;
        }
        const foundation=deckHeight&&(modeledBridgeLengths[data.id]||data.foundationOnBridge)?(px,pz)=>deckHeight(px,pz)??ground(px,pz):ground;
        const mesh=cached.get(data.id),c=Math.cos(data.yaw),s=Math.sin(data.yaw);
        const [u,v]=data.foundationAt||[0,0];
        const base=foundation(x+u*c+v*s,z-u*s+v*c);
        active.push({data,x,z,mesh,c,s,base,place(){
          mesh.position.set(x-cx,base,z-cz);mesh.rotation.y=data.yaw;
          if(data.scale)mesh.scale.fromArray(data.scale);
          mesh.userData.placeLights?.();
          mesh.userData.fitGround?.((u,v)=>foundation(x+u*c+v*s,z-u*s+v*c)-base);
        }});
      }
    prepareBuildingSites(graph,cx,cz);
    function activate(){
      for(const site of displayed?.active||[])site.mesh.visible=false;
      for(const site of active){site.place();site.mesh.visible=true;}
      displayed=view;trim();
    }
    function nearest(x,z,maxMeters=650,id){
      let best=null;
      for(const site of active){
        if(id&&site.data.id!==id)continue;
        const distance=Math.hypot(x-site.x,z-site.z);
        if(distance<=maxMeters&&(!best||best.distance>distance))best={data:site.data,distance,x:site.x,z:site.z,base:site.base,height:site.mesh.userData.height};
      }
      return best;
    }
    function reserved(x,z,padding=0){
      return active.some(a=>{
        const dx=x-a.x,dz=z-a.z,extra=a.data.id==='cathedral'?8:a.data.id==='turtle'?12:2;
        const u=dx*a.c-dz*a.s,v=dx*a.s+dz*a.c;
        if(a.data.reserve)return a.data.reserve(u,v,padding);
        if(a.data.id==='cathedral'&&Math.abs(u)<16+padding&&v>0&&v<57+padding)return true;
        return Math.abs(u)<a.data.width/2+extra+padding&&Math.abs(v)<a.data.depth/2+extra+padding;
      });
    }
    function contact(x,z,r=.95,y=null){
      for(const a of active){
        if(y!==null&&modeledBridgeLengths[a.data.id]&&y+1.35<a.base)continue;
        const dx=x-a.x,dz=z-a.z,u=dx*a.c-dz*a.s,v=dx*a.s+dz*a.c;
        function solid(cx,cz,w,d){
          const lx=u-cx,lz=v-cz;
          if(Math.abs(lx)>=w+r||Math.abs(lz)>=d+r)return null;
          let nx=lx-Math.max(-w,Math.min(w,lx)),nz=lz-Math.max(-d,Math.min(d,lz)),depth;
          const length=Math.hypot(nx,nz);
          if(length>=r)return null;
          if(length){depth=r-length;nx/=length;nz/=length;}
          else if(w-Math.abs(lx)<d-Math.abs(lz)){depth=r+w-Math.abs(lx);nx=Math.sign(lx)||1;nz=0;}
          else{depth=r+d-Math.abs(lz);nz=Math.sign(lz)||1;nx=0;}
          const wx=nx*a.c+nz*a.s,wz=-nx*a.s+nz*a.c;
          return {nx:wx,nz:wz,pointX:x+wx*(depth-r),pointZ:z+wz*(depth-r),depth,kind:'building',id:a.data.id};
        }
        if(a.data.solids){
          for(const footprint of a.data.solids){const hit=solid(...footprint);if(hit)return hit;}
        }else{const main=solid(0,0,a.data.width/2,a.data.depth/2);if(main)return main;}
        if(a.data.id==='cathedral')for(const rail of churchRails){const hit=solid(...rail);if(hit)return hit;}
      }
      return null;
    }
    function addShoreCover(patch){
      // A pending district may have another render origin. Transform only the
      // cover meshes for this query and restore the visible landmark before yielding.
      for(const site of active){
        const {mesh}=site;
        let covers=shoreCovers.get(mesh);
        if(!covers){
          covers=[];mesh.traverse(part=>{if(part.userData.shoreCover)covers.push(part);});
          shoreCovers.set(mesh,covers);
        }
        if(!covers.length)continue;
        const previous=displayed?.active.find(a=>a.mesh===mesh);
        try{
          site.place();mesh.updateMatrixWorld(true);
          for(const part of covers){
            const cover=part.userData.shoreCover;
            if(cover===true)patch.addCover(part.geometry,part.matrixWorld);
            else for(const [start,end] of cover)patch.addCover(part.geometry,part.matrixWorld,start,end);
          }
        }finally{if(previous){previous.place();mesh.updateMatrixWorld(true);}}
      }
    }
    const view={active,activate,nearest,reserved,contact,addShoreCover,buildingAreas,gardens,modeledBuildings};
    return view;
    }
    function trim(){
      const limit=Math.max(12,displayed.active.length);
      for(const [id,mesh] of cached){
        if(cached.size<=limit)break;
        if(mesh.visible)continue;
        scene.remove(mesh);cached.delete(id);
        const resources=new Set();
        mesh.traverse(obj=>{
          if(obj.geometry)resources.add(obj.geometry);
          if(!obj.material)return;
          for(const m of [].concat(obj.material)){
            resources.add(m);
            for(const v of Object.values(m))if(v?.isTexture&&!v.userData.sightShared)resources.add(v);
          }
        });
        for(const resource of resources)resource.dispose();
      }
    }
    function prepare(...args){
      const steps=prepareSteps(...args);let result;
      do{result=steps.next();}while(!result.done);
      return result.value;
    }
    displayed=prepare(null,0,0);
    return {prepare,prepareSteps,trim,setOrigin(...args){prepare(...args).activate();},weather:finishes.weather,
      nearest:(...args)=>displayed.nearest(...args),reserved:(...args)=>displayed.reserved(...args),
      contact:(...args)=>displayed.contact(...args),addShoreCover:patch=>displayed.addShoreCover(patch),
      get buildingAreas(){return displayed.buildingAreas;},get gardens(){return displayed.gardens;},
      get modeledBuildings(){return displayed.modeledBuildings;}};

  }
  return {entries,create};
})();

;
// roadside-impact.js
'use strict';

// The geometry stays batched. Only the instance slots touched by a collision move.
function createRoadsideImpact(T,scene,ground=()=>0){
  const objects=new Map(),swings=new Map(),leaves=[],scuffs=[];
  const pivot=new T.Matrix4(),shift=new T.Matrix4(),matrix=new T.Matrix4();
  const axis=new T.Vector3(),dummy=new T.Object3D(),tint=new T.Color();
  let ox=0,oz=0;

  const leaf=new T.BufferGeometry();
  leaf.setAttribute('position',new T.Float32BufferAttribute([
    0,0,-.6, -.21,0,-.14, 0,.07,.13, .2,0,.07, 0,-.02,.65
  ],3));
  leaf.setIndex([0,1,2,0,2,3,1,4,2,2,4,3]);leaf.computeVertexNormals();
  const foliage=new T.InstancedMesh(leaf,new T.MeshLambertMaterial({side:T.DoubleSide}),72);
  foliage.count=0;foliage.visible=false;foliage.frustumCulled=false;foliage.name='Lá rụng do va chạm';scene.add(foliage);

  const canvas=document.createElement('canvas');canvas.width=192;canvas.height=96;
  const g=canvas.getContext('2d');
  // A chipped patch of plaster with rubber transfer near bumper height.
  for(let i=0;i<280;i++){
    const theta=Math.random()*Math.PI*2,r=Math.sqrt(Math.random());
    const x=96+78*r*Math.cos(theta),y=48+22*r*Math.sin(theta)+.065*(x-96);
    g.fillStyle=i%3===0?'#d6c4aa':'#514e48';g.globalAlpha=(1-r*.65)*(.35+Math.random()*.55);
    g.fillRect(x,y,2+Math.random()*12,.8+Math.random()*5);
  }
  const stain=new T.MeshBasicMaterial({map:new T.CanvasTexture(canvas),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  stain.map.colorSpace=T.SRGBColorSpace;
  const stainPlane=new T.PlaneGeometry();

  function reset(){
    for(const s of scuffs){scene.remove(s.mesh);s.mesh.material.dispose();}
    scuffs.length=leaves.length=0;
    foliage.count=0;foliage.visible=false;
    for(const [id] of swings)rotate(objects.get(id),0,0,0);
    swings.clear();
  }
  function rebase(x,z){
    ox=x;oz=z;objects.clear();
  }
  function register(o){
    objects.set(o.id,o);
  }
  function rotate(o,nx,nz,angle){
    if(!o)return;
    if(angle){
      axis.set(nz,0,-nx);pivot.makeRotationAxis(axis,angle);
      pivot.premultiply(shift.makeTranslation(o.x,ground(ox+o.x,oz+o.z),o.z));
      pivot.multiply(shift.makeTranslation(-o.x,-ground(ox+o.x,oz+o.z),-o.z));
    }
    for(const part of o.parts){
      const attr=part.mesh.instanceMatrix;
      part.mesh.setMatrixAt(part.index,angle?matrix.multiplyMatrices(pivot,part.rest):part.rest);
      attr.addUpdateRange(part.index*16,16);attr.needsUpdate=true;
    }
  }
  function react(hit,x,z,strength){
    const o=objects.get(hit.id);
    const s=Math.min(1,Math.max(0,strength)),dx=-hit.nx,dz=-hit.nz;
    if(hit.kind==='building'){
      if(scuffs.length===10){const old=scuffs.shift();scene.remove(old.mesh);old.mesh.material.dispose();}
      const mesh=new T.Mesh(stainPlane,stain.clone());
      mesh.name='Tróc lớp trát';mesh.rotation.y=Math.atan2(hit.nx,hit.nz);
      mesh.scale.set(.4+s*1.7,.22+s*.68,1);scene.add(mesh);
      scuffs.push({mesh,x:x+hit.nx*.045,z:z+hit.nz*.045,ttl:6+s*8});
      mesh.position.set(x+hit.nx*.045-ox,ground(x,z)+.65,z+hit.nz*.045-oz);
      return;
    }
    if(!o||(o.kind!=='pole'&&o.kind!=='tree'))return;
    swings.set(o.id,{dx,dz,strength:s,age:0});
    if(o.kind==='tree'){
      const count=4+Math.ceil(s*19);
      if(leaves.length+count>foliage.instanceMatrix.count)leaves.splice(0,leaves.length+count-foliage.instanceMatrix.count);
      for(let i=0;i<count;i++){
        const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*o.height*.2;
        leaves.push({x:ox+o.x+Math.cos(a)*r,y:o.height*(.50+Math.random()*.34),z:oz+o.z+Math.sin(a)*r,
          vx:dx*s*2+Math.cos(a),vz:dz*s*2+Math.sin(a),vy:-.6+s*Math.random(),phase:a,
          size:.13+Math.random()*.16,tint:[0x54733b,0x809249,0x617d37,0xb4a85b][i%4],age:0});
      }
    }
  }
  function update(dt){
    for(const [id,w] of swings){
      const o=objects.get(id);w.age+=dt;
      if(!o||w.age>2.8){if(o)rotate(o,0,0,0);swings.delete(id);continue;}
      const tree=o.kind==='tree',amplitude=tree?.19:.047;
      const angle=amplitude*w.strength*Math.exp(-w.age*(tree?1.8:3))*Math.sin(w.age*(tree?8.8:17));
      rotate(o,w.dx,w.dz,angle);
    }
    for(let i=scuffs.length-1;i>=0;i--){
      const s=scuffs[i];s.ttl-=dt;
      if(s.ttl<=0){scene.remove(s.mesh);s.mesh.material.dispose();scuffs.splice(i,1);continue;}
      s.mesh.position.set(s.x-ox,ground(s.x,s.z)+.65,s.z-oz);s.mesh.material.opacity=Math.min(.86,s.ttl*.8);
    }
    for(let i=leaves.length-1;i>=0;i--){
      const p=leaves[i];p.age+=dt;
      if(p.y<.06||p.age>7){leaves.splice(i,1);continue;}
      const a=p.age*4.5+p.phase;
      p.vy=Math.max(-2.6,p.vy-dt*3);
      p.x+=(p.vx*Math.exp(-p.age)+.4*Math.sin(a))*dt;
      p.z+=(p.vz*Math.exp(-p.age)+.3*Math.cos(a))*dt;
      p.y+=p.vy*dt;
    }
    foliage.visible=leaves.length>0;foliage.count=leaves.length;
    if(!foliage.visible)return;
    leaves.forEach((p,i)=>{
      dummy.position.set(p.x-ox,ground(p.x,p.z)+Math.max(.06,p.y),p.z-oz);dummy.rotation.set(p.age*4+p.phase,p.phase+p.age*2.2,Math.sin(p.age*5+p.phase));
      dummy.scale.setScalar(p.size);dummy.updateMatrix();foliage.setMatrixAt(i,dummy.matrix);foliage.setColorAt(i,tint.setHex(p.tint));
    });
    foliage.instanceMatrix.needsUpdate=true;foliage.instanceColor.needsUpdate=true;
  }
  return {reset,rebase,register,react,update};
}

;
// vietnam-osm-buildings.js
'use strict';

function createVietnamOsmBuildings(base='vn-osm-buildings/',limit=matchMedia('(pointer: coarse)').matches?750:1500){
  const cache=new Map(),cell=128;
  let index,ready,signature,version=0,active=[];

  function loadIndex(){
    if(!index)index=fetch(base+'index.json').then(r=>{
      if(!r.ok)throw Error('Không tải được mục lục nhà OSM.');
      return r.json();
    }).catch(error=>{index=null;throw error;});
    return index;
  }

  // Index the whole outline, including long factories reaching into a nearby cell.
  function indexTile(rows){
    const cells=new Map();
    for(const row of rows){
      const ring=row[4][0];
      let x=0,y=0,west=Infinity,south=Infinity,east=-Infinity,north=-Infinity;
      for(let n=0;n<ring.length;n+=2){
        x+=ring[n];y+=ring[n+1];
        west=Math.min(west,x);south=Math.min(south,y);east=Math.max(east,x);north=Math.max(north,y);
      }
      const entry={row,west,south,east,north};
      for(let i=Math.floor(west/cell);i<=Math.floor(east/cell);i++)
        for(let j=Math.floor(south/cell);j<=Math.floor(north/cell);j++){
          const key=i+','+j;
          if(!cells.has(key))cells.set(key,[]);
          cells.get(key).push(entry);
        }
    }
    return cells;
  }

  async function load(graph,x,z){
    const stamp=++version;
    try{
      const manifest=await loadIndex();if(stamp!==version)return false;
      const [lon,lat]=graph.geo(x,z),reach=1050,dx=reach/graph.mx,dy=reach/graph.my;
      const w=(lon-dx)*manifest.scale,s=(lat-dy)*manifest.scale;
      const e=(lon+dx)*manifest.scale,n=(lat+dy)*manifest.scale;
      const keys=manifest.tiles.filter(([,left,bottom,right,top])=>right>=w&&left<=e&&top>=s&&bottom<=n)
        .map(tile=>tile[0]);
      const requested=keys.join('/');
      if(ready===graph&&signature===requested)return false;
      const loaded=await Promise.all(keys.map(key=>{
        if(!cache.has(key)){
          const job=fetchMapTile(base+key+'.gz').then(indexTile).catch(()=>{
            if(cache.get(key)===job)cache.delete(key);
            return null;
          });
          cache.set(key,job);
        }
        return cache.get(key);
      }));
      if(stamp!==version)return false;
      const next=keys.filter((_,i)=>loaded[i]).join('/');
      const changed=ready!==graph||signature!==next;
      ready=graph;signature=next;active=loaded.filter(Boolean);
      for(const k of cache.keys())if(!keys.includes(k))cache.delete(k);
      return changed;
    }catch{return false;}
  }

  function rows(graph,x,z){
    if(graph!==ready)return [];
    const [lon,lat]=graph.geo(x,z),px=lon*1e5,py=lat*1e5,reach=650;
    const mx=graph.mx/1e5,my=graph.my/1e5;
    const dx=reach/mx,dy=reach/my,seen=new Set(),candidates=[];
    for(let i=Math.floor((px-dx)/cell);i<=Math.floor((px+dx)/cell);i++){
      for(let j=Math.floor((py-dy)/cell);j<=Math.floor((py+dy)/cell);j++){
        const key=i+','+j;
        for(const tile of active)for(const entry of tile.get(key)||[]){
          if(seen.has(entry))continue;
          seen.add(entry);
          const ax=Math.max(0,entry.west-px,px-entry.east)*mx;
          const ay=Math.max(0,entry.south-py,py-entry.north)*my;
          const d=ax*ax+ay*ay;
          if(d<=reach*reach)candidates.push({row:entry.row,d});
        }
      }
    }
    candidates.sort((a,b)=>a.d-b.d);
    return candidates.slice(0,limit).map(item=>item.row);
  }
  return {load,rows};
}

;
// vietnam-structures.js
'use strict';

function createVietnamStructures(){
  let setup,sources,offlineFootprints,offlineHeights,api,version=0,graphReady;
  let activeTiles=new Map(),activeHeights=[],signature='';
  const footprintCache=new Map(),heightCache=new Map(),step=.001;
  const limit=matchMedia('(pointer: coarse)').matches?750:1500;
  function json(path){
    return fetch('vn-structures/'+path).then(response=>{
      if(!response.ok)throw Error('Missing structure index');
      return response.json();
    });
  }
  async function init(){
    [api,sources]=await Promise.all([import('./vn-structures/source.mjs'),json('source-index.json')]);
    const offline=await json('offline.json');
    offlineFootprints=new Set(offline.footprints);offlineHeights=new Set(offline.heights);
  }
  function cached(cache,key,load){
    if(!cache.has(key)){
      const task=load().catch(error=>{if(cache.get(key)===task)cache.delete(key);throw error;});
      cache.set(key,task);
    }
    return cache.get(key);
  }
  function indexed(rows){
    if(!rows)return null;
    const cells=new Map();
    for(const row of rows){
      const ring=row[4][0];let x=0,y=0,west=Infinity,east=-Infinity,south=Infinity,north=-Infinity;
      for(let i=0;i<ring.length;i+=2){
        x+=ring[i];y+=ring[i+1];west=Math.min(west,x);east=Math.max(east,x);south=Math.min(south,y);north=Math.max(north,y);
      }
      const lon=(west+east)/2e5,lat=(south+north)/2e5;
      const key=Math.floor(lon/step)+'_'+Math.floor(lat/step);
      if(!cells.has(key))cells.set(key,[]);
      cells.get(key).push({row,lon,lat});
    }
    return cells;
  }
  async function localHeight(key){
    const r=await fetch('vn-structures/heights/'+key+'.gz');
    if(!r.ok)throw Error('Missing bundled height');
    const bytes=new Uint8Array(await r.arrayBuffer());
    const pixels=bytes[0]===31&&bytes[1]===139&&bytes.length!==512*512
      ?new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()):bytes;
    if(pixels.length!==512*512)throw Error('Invalid bundled height');
    return pixels;
  }
  async function load(graph,x,z,bundledOnly=false){
    const seq=++version;
    try{
      setup??=init().catch(e=>{setup=null;throw e;});
      await setup;if(seq!==version)return false;
      const [lon,lat]=graph.geo(x,z),keys=api.tileKeys(lon,lat,950);
      const blocks=api.heightBlocks(sources.heightSources,lon,lat,950);
      // At departure, wait for bundled buildings before laying out the street.
      // Districts requiring remote imagery continue streaming while driving.
      if(bundledOnly && (!keys.every(k=>offlineFootprints.has(k)) ||
        !blocks.every(b=>offlineHeights.has(b.key))))return false;
      const tiles=await Promise.allSettled([
        ...keys.map(key=>cached(footprintCache,key,async()=>{
          const rows=offlineFootprints.has(key)?await fetchMapTile('vn-structures/footprints/'+key+'.gz'):
            await api.readFootprints(key,sources.thresholds);
          return indexed(rows);
        })),
        ...blocks.map(b=>cached(heightCache,b.key,()=>offlineHeights.has(b.key)?localHeight(b.key):api.readHeightBlock(b)))
      ]);
      if(seq!==version)return false;
      const local=new Map(),heights=[];
      keys.forEach((k,i)=>{if(tiles[i].status==='fulfilled'&&tiles[i].value)local.set(k,tiles[i].value);});
      blocks.forEach((b,i)=>{const tile=tiles[keys.length+i];if(tile.status==='fulfilled')heights.push({...b,pixels:tile.value});});
      const next=[...local.keys(),...heights.map(h=>h.key)].join('/');
      const changed=graph!==graphReady||next!==signature;
      graphReady=graph;signature=next;activeTiles=local;activeHeights=heights;
      for(const k of footprintCache.keys())if(!keys.includes(k))footprintCache.delete(k);
      const keepHeights=new Set(heights.map(b=>b.key));
      for(const k of heightCache.keys())if(!keepHeights.has(k))heightCache.delete(k);
      return changed;
    }catch{return false;}
  }
  function height(lon,lat){
    for(const b of activeHeights){
      const p=b.project(lon,lat);
      const u=Math.floor((p[0]-b.source[2])/4)-512*b.i,v=Math.floor((b.source[3]-p[1])/4)-512*b.j;
      if(u<0||v<0||u>=512||v>=512)continue;
      const sample=b.pixels[v*512+u];
      if(sample)return sample/2;
    }
    return 0;
  }
  function rows(graph,x,z){
    if(graph!==graphReady)return [];
    const [lon,lat]=graph.geo(x,z),candidates=[],seen=new Set(),reach=650;
    const dx=reach/graph.mx,dy=reach/graph.my;
    for(const key of api.tileKeys(lon,lat,reach)){
      const cells=activeTiles.get(key);if(!cells)continue;
      for(let i=Math.floor((lon-dx)/step);i<=Math.floor((lon+dx)/step);i++)
        for(let j=Math.floor((lat-dy)/step);j<=Math.floor((lat+dy)/step);j++){
          for(const item of cells.get(i+'_'+j)||[]){
            const distance=((item.lon-lon)*graph.mx)**2+((item.lat-lat)*graph.my)**2;
            if(distance<=reach**2&&!seen.has(item.row[0])){
              seen.add(item.row[0]);candidates.push({item,distance});
            }
          }
        }
    }
    candidates.sort((a,b)=>a.distance-b.distance);
    return candidates.slice(0,limit).map(({item})=>{
      const row=item.row;
      return [row[0],row[1],height(item.lon,item.lat),row[3],row[4],row[5]];
    });
  }
  return {load,rows,
    heightAt:(graph,x,z)=>graph===graphReady?height(...graph.geo(x,z)):0,
    covered:(graph,x,z)=>graph===graphReady&&activeTiles.has(api.tileAt(...graph.geo(x,z)).join('_'))};
}

;
// vietnam-environment.js
'use strict';
// Load local raster tiles around the active drive; every lookup is synchronous.
function createVietnamEnvironment(){
  let manifest, manifestRequest, active=new Map(), signature=null, version=0, revision=0;
  const pending=new Map(), estimates=new Float32Array(256);
  for(let i=1;i<256;i++)estimates[i]=2**((i-1)/20)-1;

  function readManifest(){
    if(!manifestRequest){
      manifestRequest=fetch('vn-environment/index.json').then(async response=>{
        if(!response.ok)throw Error('Environment index HTTP '+response.status);
        manifest=await response.json();
        manifest.tiles=new Set(manifest.tiles);
      }).catch(error=>{manifestRequest=null;throw error;});
    }
    return manifestRequest;
  }

  function readTile(key){
    if(active.has(key))return Promise.resolve(active.get(key));
    if(!pending.has(key)){
      const request=fetch('vn-environment/'+key+'.gz').then(async response=>{
        if(!response.ok)throw Error('Environment tile HTTP '+response.status);
        let pixels=new Uint8Array(await response.arrayBuffer());
        const expected=manifest.populationSize**2+manifest.coverSize**2;
        if(pixels.length!==expected&&pixels[0]===31&&pixels[1]===139){
          const stream=new Blob([pixels]).stream().pipeThrough(new DecompressionStream('gzip'));
          pixels=new Uint8Array(await new Response(stream).arrayBuffer());
        }
        if(pixels.length!==expected)throw Error('Invalid environment tile');
        return pixels;
      }).finally(()=>pending.delete(key));
      pending.set(key,request);
    }
    return pending.get(key);
  }

  async function load(graph,x,z){
    const stamp=++version;
    try{await readManifest();}catch{return false;}
    if(stamp!==version)return false;
    const [lon,lat]=graph.geo(x,z),grid=manifest.grid,keys=[];
    const dx=1600/graph.mx,dy=1600/graph.my;
    for(let i=Math.floor((lon-dx)*grid);i<=Math.floor((lon+dx)*grid);i++){
      for(let j=Math.floor((lat-dy)*grid);j<=Math.floor((lat+dy)*grid);j++){
        const key=i+'_'+j;
        if(manifest.tiles.has(key))keys.push(key);
      }
    }
    const next=keys.join('/');
    if(next===signature)return false;
    const tiles=await Promise.allSettled(keys.map(readTile));
    if(stamp!==version)return false;
    const loaded=new Map();
    tiles.forEach((result,i)=>{if(result.status==='fulfilled')loaded.set(keys[i],result.value);});
    const changed=loaded.size!==active.size||[...loaded.keys()].some(key=>!active.has(key));
    if(changed)revision++;
    active=loaded;
    signature=loaded.size===keys.length?next:null;
    return changed;
  }

  function sample(graph,x,z){
    if(!manifest)return {population:null,cover:null};
    const [lon,lat]=graph.geo(x,z),u=lon*manifest.grid,v=lat*manifest.grid;
    const east=Math.floor(u),north=Math.floor(v),bytes=active.get(east+'_'+north);
    if(!bytes)return {population:null,cover:null};
    const fx=u-east,fy=v-north;
    // Raster rows run north to south. Exactly on the south edge is the last row.
    const index=size=>(size-1-Math.floor(fy*size))*size+Math.floor(fx*size);
    const density=bytes[index(manifest.populationSize)];
    return {population:density?estimates[density]:null,
            cover:bytes[manifest.populationSize**2+index(manifest.coverSize)]||null};
  }
  return {load,sample,get revision(){return revision;}};
}

;
// vietnam-amenities.js
'use strict';
// OSM anchors are indexed geographically so scene rebases never move an amenity.
function createVietnamAmenities(){
  const base='vn-amenities/', bucketScale=100, reach=2400;
  const tileCache=new Map();
  let manifest, graphLoaded, signature, request=0, buckets=new Map();

  function loadIndex(){
    if(!manifest)manifest=fetch(base+'index.json').then(response=>{
      if(!response.ok)throw Error('Không tải được mục lục địa điểm.');
      return response.json();
    }).then(index=>({tiles:new Set(index.tiles),scale:index.scale}))
      .catch(error=>{manifest=null;throw error;});
    return manifest;
  }

  async function load(graph,x,z){
    const stamp=++request;
    try{
      const index=await loadIndex();
      if(stamp!==request)return false;
      const [lon,lat]=graph.geo(x,z), dx=reach/graph.mx, dy=reach/graph.my, keys=[];
      for(let i=Math.floor(lon-dx);i<=Math.floor(lon+dx);i++)
        for(let j=Math.floor(lat-dy);j<=Math.floor(lat+dy);j++){
          const key=i+'_'+j;
          if(index.tiles.has(key))keys.push(key);
        }
      const next=keys.join('/');
      if(graphLoaded===graph&&next===signature)return false;
      const tiles=await Promise.all(keys.map(key=>{
        if(!tileCache.has(key)){
          const pending=fetchMapTile(base+key+'.gz').catch(error=>{tileCache.delete(key);throw error;});
          tileCache.set(key,pending);
        }
        return tileCache.get(key);
      }));
      if(stamp!==request)return false;
      const fresh=new Map();
      for(const tile of tiles)for(const [id,kind,name,rawLon,rawLat] of tile){
        const lon=rawLon/index.scale,lat=rawLat/index.scale;
        const key=Math.floor(lon*bucketScale)+','+Math.floor(lat*bucketScale);
        if(!fresh.has(key))fresh.set(key,[]);
        fresh.get(key).push({id,kind,name,...graph.point(lon,lat)});
      }
      for(const key of tileCache.keys())if(!keys.includes(key))tileCache.delete(key);
      buckets=fresh;signature=next;graphLoaded=graph;
      return true;
    }catch{return false;}
  }

  function nearby(graph,x,z,radius){
    if(graph!==graphLoaded||!Number.isFinite(radius)||radius<0)return [];
    const [lon,lat]=graph.geo(x,z), dx=radius/graph.mx, dy=radius/graph.my;
    const result=[];
    for(let i=Math.floor((lon-dx)*bucketScale);i<=Math.floor((lon+dx)*bucketScale);i++)
      for(let j=Math.floor((lat-dy)*bucketScale);j<=Math.floor((lat+dy)*bucketScale);j++)
        for(const point of buckets.get(i+','+j)||[]){
          if((point.x-x)**2+(point.z-z)**2<=radius**2)result.push(point);
        }
    return result;
  }
  return {load,nearby};
}

;
// world-land-cover.js
'use strict';
// A local texture keeps the categorical raster lookup out of the terrain shader.
function createWorldLandCover(T,environment){
  const side=128,metres=2048,rgba=new Uint8Array(side*side*4);
  const texture=new T.DataTexture(rgba,side,side,T.RGBAFormat);
  texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearFilter;
  const origin=new T.Vector2();
  const palette={10:[48,74,44],20:[108,120,75],30:[141,151,88],40:[167,161,93],
    50:[142,139,128],60:[169,151,127],70:[220,226,225],80:[77,113,122],
    90:[101,129,93],95:[57,99,72],100:[143,151,110]};
  let spare=new Uint8Array(rgba.length),displayedGraph,displayedRevision;
  function* prepare(graph,x,z){
    const left=x-metres/2,top=z-metres/2,rgba=spare,pitch=metres/side;
    const dx=(left-origin.x)/pitch,dz=(top-origin.y)/pitch,revision=environment.revision;
    const overlap=graph===displayedGraph&&revision===displayedRevision&&Number.isInteger(dx)&&Number.isInteger(dz);
    const previous=texture.image.data;
    for(let j=0;j<side;j++){
      if(j%4===0)yield;
      const row=j+dz,start=Math.max(0,-dx),end=Math.min(side,side-dx);
      const reuse=overlap&&row>=0&&row<side&&end>start;
      for(let i=0;i<side;){
        if(reuse&&i===start){
          const offset=(row*side+start+dx)*4;
          rgba.set(previous.subarray(offset,offset+(end-start)*4),(j*side+i)*4);
          i=end;continue;
        }
        const cover=environment.sample(graph,left+(i+.5)*pitch,top+(j+.5)*pitch).cover,tint=palette[cover],k=(j*side+i)*4;
        rgba[k]=tint?.[0]||0;rgba[k+1]=tint?.[1]||0;rgba[k+2]=tint?.[2]||0;
        rgba[k+3]=tint?(cover===40?255:170):0;i++;
      }
    }
    return ()=>{
      displayedGraph=graph;displayedRevision=revision;
      origin.set(left,top);spare=texture.image.data;texture.image.data=rgba;texture.needsUpdate=true;
    };
  }
  function shade(shader){
    shader.uniforms.coverMap={value:texture};shader.uniforms.coverOrigin={value:origin};
    shader.fragmentShader='uniform sampler2D coverMap; uniform vec2 coverOrigin;\n'+shader.fragmentShader.replace('#include <color_fragment>',`
      vec4 landClass=texture2D(coverMap,(groundMetres-coverOrigin)/2048.);
      vec3 groundTint=pow(landClass.rgb,vec3(2.2));
      float grain=clamp(dot(diffuseColor.rgb,vec3(.21,.72,.07))*4.,.58,1.32);
      float furrow=cos(dot(groundMetres,vec2(.36,.69)));
      grain*=1.+.07*furrow*smoothstep(.85,.99,landClass.a);
      diffuseColor.rgb=mix(diffuseColor.rgb,groundTint*grain,.74*smoothstep(0.,.65,landClass.a)*(1.-bankWet));
      #include <color_fragment>`);
  }
  return {prepare,shade};
}

;
// world-street-life.js
'use strict';
const vietnamPlaceTypes={
  market:{label:'Chợ',colour:'#904f32'},school:{label:'Trường học',colour:'#39597a'},
  fuel:{label:'Trạm xăng',colour:'#285c61'},cafe:{label:'Cà phê',colour:'#654536'},
  hospital:{label:'Bệnh viện',colour:'#307168'}
};

function createWorldStreetLife(T,scene,small,environment,amenities,prepareActor){
  const walkGroup=new T.Group();
  walkGroup.name='Người đi bộ';scene.add(walkGroup);
  const walkers=new Map(),models=new Map();
  let bins=new Map();
  let graph,places=[],paths=[],originX=0,originZ=0,walkTime=0;
  function localHour(){return (new Date().getUTCHours()+7)%24;}
  function interest(kind,h){
    if(kind==='school')return ((h>=6&&h<=8)||(h>=15&&h<=17)) ? .85 : .17;
    if(kind==='market')return (h>=5&&h<=11) ? .85 : .39;
    if(kind==='hospital')return .36;
    if(kind==='cafe')return (h>=6&&h<=21) ? .28 : .08;
    return .15;
  }
  function activity(g,x,z,kind,trafficLevel='auto',h=localHour(),nearPlaces=g===graph?bins:null){
    const {population,cover}=environment.sample(g,x,z),dark=h<5||h>=22;
    const fast=kind?.startsWith('motorway');
    let attraction=0;
    if(nearPlaces)for(let i=Math.floor((x-115)/128);i<=Math.floor((x+115)/128);i++){
      for(let j=Math.floor((z-115)/128);j<=Math.floor((z+115)/128);j++){
        for(const p of nearPlaces.get(i+','+j)||[]){
          const proximity=1-Math.hypot(p.x-x,p.z-z)/115;
          if(proximity>0)attraction=Math.max(attraction,proximity*interest(p.kind,h));
        }
      }
    }
    const residential=kind==='living_street'||kind==='residential';
    const fallback=cover===50 ? .48 : residential ? .34 : .16;
    const density=population==null?fallback:Math.min(1,Math.log1p(Math.max(0,population))/5);
    const walkers=fast?0:Math.min(1,density*.76+attraction)*(dark ? .32 : 1);
    const main=/^(motorway|trunk|primary)/.test(kind);
    const urban=!fast&&(density>=.68||cover===50);
    const peak=(h>=7&&h<9)||(h>=16&&h<19);
    const base=(3+11*density+attraction*4+(main?3:0))*(dark ? .67 : 1);
    const busy=trafficLevel==='busy'||(trafficLevel==='auto'&&urban&&!dark);
    let vehicles=base;
    if(trafficLevel==='quiet')vehicles=Math.min(7,base*.55);
    if(busy)vehicles=trafficLevel==='busy'?25+density*5:base+(peak?11:6);
    return {walkers,busy,vehicles:Math.min(small?22:30,Math.round(vehicles)),
      scooter:fast?0:Math.min(.80,.18+density*.37+attraction*.22+(busy?.20:0))};
  }
  function* walkingPaths(g,originX,originZ,bins,segments,clear){
    let rows=0;
    const candidates=[],hour=localHour();
    for(const s of segments){
      if((++rows & 15)===0)yield;
      if(s.rank>310||s.len<10||s.graded||s.kind.startsWith('motorway'))continue;
      // Anchor each walking path to a station on the original road segment so
      // a rebase or a clipped long road cannot slide its pedestrians around.
      const span=Math.min(13,s.len*.35),step=42;
      const project=-s.ax*s.fx-s.az*s.fz;
      const first=span+1+s.seed%12;
      const start=Math.max(0,Math.ceil((project-310-first)/step));
      for(let k=start;first+k*step<s.len-span-1&&first+k*step<project+310;k++){
        const station=first+k*step,side=(s.seed+k)%2?1:-1;
        const x=originX+s.ax+s.fx*station+side*s.nx*(s.w+1);
        const z=originZ+s.az+s.fz*station+side*s.nz*(s.w+1);
        const distance=Math.hypot(x-originX,z-originZ);if(distance>310)continue;
          const score=activity(g,x,z,s.kind,'auto',hour,bins).walkers;
        const hash=(Math.imul(s.seed^k,2654435761)>>>0)/4294967296;
        if(hash>score*.88)continue;
        candidates.push({x,z,fx:s.fx,fz:s.fz,span,phase:hash*53,rank:distance/(.45+score),
          key:s.seed+':'+k,model:pathPedestrianModel(s.seed,k)});
      }
    }
    candidates.sort((a,b)=>a.rank-b.rank);
    const paths=[];
    for(const p of candidates){
      yield;
      if(paths.length>=(small?6:11))break;
      if(paths.some(q=>Math.hypot(q.x-p.x,q.z-p.z)<5))continue;
      let valid=true;
      for(let d=-p.span;d<=p.span+.01;d+=p.span/Math.ceil(p.span)){
        if(!clear(p.x+d*p.fx,p.z+d*p.fz,.3)){valid=false;break;}
      }
      if(valid)paths.push(p);
    }
    return paths;
  }
  function trimWalkers(){
    const active=new Set(paths.map(p=>p.key));
    for(const [key,item] of walkers){
      if(active.has(key))continue;
      walkGroup.remove(item.group);
      item.mixer?.stopAllAction();
      item.group.traverse(part=>{if(part.isSkinnedMesh)part.skeleton.dispose();});
      walkers.delete(key);
    }
  }
  function* prepare(g,x,z,segments,clear){
    const nextPlaces=amenities.nearby(g,x,z,500).filter(p=>vietnamPlaceTypes[p.kind]).sort((a,b)=>
      Math.hypot(a.x-x,a.z-z)-Math.hypot(b.x-x,b.z-z));
    const nextBins=new Map();
    for(const p of nextPlaces){
      const key=Math.floor(p.x/128)+','+Math.floor(p.z/128);
      if(!nextBins.has(key))nextBins.set(key,[]);nextBins.get(key).push(p);
    }
    const nextPaths=yield* walkingPaths(g,x,z,nextBins,segments,clear);
    return ()=>{
      graph=g;originX=x;originZ=z;places=nextPlaces;bins=nextBins;paths=nextPaths;trimWalkers();
    };
  }
  function walker(p){
    if(walkers.has(p.key))return walkers.get(p.key);
    const group=new T.Group();walkGroup.add(group);
    const item={group};walkers.set(p.key,item);
    const asset=p.model;
    if(!models.has(asset))models.set(asset,TrafficModels.load.loadAsync('traffic/'+asset+'.glb'));
    item.ready=models.get(asset).then(async data=>{
      await prepareActor(asset,data.scene);
      if(walkers.get(p.key)!==item)return;
      const rig=TrafficModels.clone(data.scene);group.add(rig);
      rig.traverse(part=>{if(part.isMesh){part.castShadow=true;part.receiveShadow=true;}});
      const clip=data.animations.find(c=>c.name==='walk');
      if(clip){item.mixer=new T.AnimationMixer(rig);item.mixer.clipAction(clip).play();item.mixer.setTime(p.phase);}
    }).catch(()=>{});
    return item;
  }
  function render(dt,x,z,ground){
    walkTime+=dt;
    for(const p of paths){
      const visible=Math.hypot(p.x-x,p.z-z)<175;
      if(!visible){const item=walkers.get(p.key);if(item)item.group.visible=false;continue;}
      const actor=walker(p),t=(p.phase+walkTime*(.9+(p.phase%3)*.12))%(4*p.span);
      const along=p.span-Math.abs(t-2*p.span),sign=t<2*p.span?1:-1;
      const wx=p.x+p.fx*along,wz=p.z+p.fz*along;
      actor.group.position.set(wx-originX,ground(wx,wz)+.015,wz-originZ);
      actor.group.rotation.y=Math.atan2(sign*p.fx,sign*p.fz);actor.group.visible=true;
      actor.mixer?.update(dt);
    }
  }
  async function prepareDeparture(){
    // render() has already requested every walker visible from the starting point.
    const departure=small?walkers.values():paths.map(walker);
    await Promise.all(Array.from(departure,item=>item.ready));
    return walkGroup;
  }
  return {activity,prepare,render,prepareDeparture,get places(){return places;}};
}

;
// visitor-roofs.js
'use strict';
// Clip each mapped roof triangle to its pitch planes. This keeps recessed wings,
// courtyard holes and side aisles even on footprints with more than four corners.
function buildVisitorRoof(T,rings,shape,h,rise,roofColor,wallColor,draw,temple,detail={},bottom=0){
  const outer=rings[0],origin=outer[0];
  let longest=0,ux=1,uz=0;
  outer.forEach((a,i)=>{
    const b=outer[(i+1)%outer.length],d=a.distanceTo(b);
    if(d>longest){longest=d;ux=(b.x-a.x)/d;uz=(b.y-a.y)/d;}
  });
  const direction=detail?.['roof:direction'],bearing=parseFloat(direction);
  if(Number.isFinite(bearing)){ux=Math.cos(bearing*Math.PI/180);uz=Math.sin(bearing*Math.PI/180);}
  const project=p=>[(p.x-origin.x)*ux+(p.y-origin.y)*uz,(p.y-origin.y)*ux-(p.x-origin.x)*uz];
  const points=rings.flat().map(project);
  let u0=Infinity,u1=-Infinity,v0=Infinity,v1=-Infinity;
  for(const [u,v] of points){u0=Math.min(u0,u);u1=Math.max(u1,u);v0=Math.min(v0,v);v1=Math.max(v1,v);}
  // The longest straight edge occasionally belongs to the gable end.
  if(!Number.isFinite(bearing)&&((u1-u0<v1-v0)!==(detail?.['roof:orientation']==='across'))){
    [ux,uz]=[-uz,ux];[u0,u1,v0,v1]=[v0,v1,-u1,-u0];
    for(const p of points)[p[0],p[1]]=[p[1],-p[0]];
  }
  const width=v1-v0,length=u1-u0;
  if(width<1||length<1)return false;
  const hip=['hipped','hipped-and-gabled','side_hipped','pyramidal','mansard'].includes(shape);
  const hipLength=shape==='pyramidal'?length/2:Math.min(length*.38,width*.5);
  const lift=Math.min(h-bottom,h*.68,Number.isFinite(rise)&&rise>0?rise:Math.max(.7,Math.min(temple?5.5:4.6,width*(temple?.32:.36))));
  const eave=h-lift;
  const ridge=shape==='saltbox'?.36:.5;
  let planes=[([,v])=>(v-v0)/(width*ridge),([,v])=>(v1-v)/(width*(1-ridge))];
  if(shape==='skillion')planes=[([,v])=>(v-v0)/width];
  if(shape==='round'){
    const y=t=>Math.sqrt(Math.max(0,1-(2*t-1)**2));
    planes=Array.from({length:10},(_,i)=>{
      const a=(1-Math.cos(Math.PI*i/10))/2,b=(1-Math.cos(Math.PI*(i+1)/10))/2;
      const slope=(y(b)-y(a))/(b-a);
      return ([,v])=>y(a)+slope*((v-v0)/width-a);
    });
  }
  if(hip)planes.push(([u])=>(u-u0)/hipLength,([u])=>(u1-u)/hipLength);
  if(shape==='mansard')planes=planes.flatMap(f=>[p=>2.25*f(p),p=>.78+.22*f(p)]);
  function clip(poly,dist){
    const out=[];
    for(let i=0;i<poly.length;i++){
      const a=poly[i],b=poly[(i+1)%poly.length],da=dist(a),db=dist(b);
      if(da>=0)out.push(a);
      if((da>0&&db<0)||(da<0&&db>0)){
        const k=da/(da-db);out.push([a[0]+k*(b[0]-a[0]),a[1]+k*(b[1]-a[1])]);
      }
    }
    return out;
  }
  function xyz([u,v],y){return [origin.x+ux*u-uz*v,y,origin.y+uz*u+ux*v];}
  if((shape==='dome'||shape==='onion')&&rings.length===1){
    const center=[(u0+u1)/2,(v0+v1)/2];
    for(let j=0;j<12;j++){
      function arc(p,level){
        const t=level/12,rad=shape==='dome'?Math.cos(Math.PI*t/2):Math.max(0,1-t+.30*Math.sin(2*Math.PI*t)*(1-t));
        return xyz([center[0]+(p[0]-center[0])*rad,center[1]+(p[1]-center[1])*rad],
          eave+lift*(shape==='dome'?Math.sin(t*Math.PI/2):t));
      }
      for(let i=0;i<points.length;i++){
        const p=points[i],q=points[(i+1)%points.length];
        for(const [v,k] of [[p,j],[q,j],[p,j+1],[q,j],[q,j+1],[p,j+1]])draw(arc(v,k),v,roofColor,false);
      }
    }
    return eave;
  }
  const heights=p=>eave+lift*Math.max(0,Math.min(...planes.map(f=>f(p))));
  const tint=temple?roofColor.clone().multiplyScalar(.88):roofColor;
  for(const tri of T.ShapeUtils.triangulateShape(outer,rings.slice(1))){
    for(const plane of planes){
      let poly=tri.map(i=>points[i]);
      for(const other of planes)if(other!==plane&&poly.length)poly=clip(poly,p=>other(p)-plane(p));
      for(let i=1;i+1<poly.length;i++)
        for(const p of [poly[0],poly[i+1],poly[i]])draw(xyz(p,eave+lift*plane(p)),p,roofColor,true);
    }
  }
  // Close the gable and all cut edges around internal courtyards. Split where
  // a ridge or a hip crosses the wall so the infill follows the pitches exactly.
  for(const ring of rings)ring.forEach((a,i)=>{
    const p=project(a),q=project(ring[(i+1)%ring.length]),ts=[0,1];
    for(let j=0;j<planes.length;j++)for(let k=j+1;k<planes.length;k++){
      const d=planes[j](p)-planes[k](p),e=planes[j](q)-planes[k](q);
      if(d*e<0)ts.push(d/(d-e));
    }
    ts.sort((a,b)=>a-b);
    const at=t=>[p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])];
    for(let j=1;j<ts.length;j++){
      const l=at(ts[j-1]),r=at(ts[j]),lh=heights(l),rh=heights(r);
      if(Math.max(lh,rh)-eave<.005)continue;
      for(const [pos,y] of [[l,eave],[r,eave],[l,lh],[r,eave],[r,rh],[l,lh]])
        draw(xyz(pos,y),pos,wallColor,false);
    }
    // A visible fascia and projecting lip along the actual eave outline.
    if(temple&&Math.abs(heights(p)-eave)<.06&&Math.abs(heights(q)-eave)<.06){
      const dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz);
      if(len<.1)return;
      const s=T.ShapeUtils.isClockWise(ring)=== (ring===outer)?1:-1,over=Math.min(.68,width*.045);
      const l=[p[0]-s*dz/len*over,p[1]+s*dx/len*over],r=[q[0]-s*dz/len*over,q[1]+s*dx/len*over];
      for(const v of [p,q,l,q,r,l])draw(xyz(v,v===p||v===q?eave+.03:eave-.12),v,roofColor,true);
      for(const [v,y] of [[l,-.12],[r,-.12],[l,-.26],[r,-.12],[r,-.26],[l,-.26]])
        draw(xyz(v,eave+y),v,tint,false);
    }
  });
  return eave;
}

;
// central-streetscapes.js
'use strict';
(() => {
  // Regional Central Vietnam streetscapes: authentic district palettes, regional
  // shopfront facades, sidewalk specialty stalls (quán đặc sản vỉa hè), café
  // plastic-stool clusters, and Hội An / Huế silk lantern strings.
  const ZONES = [
    {
      id: 'hoi-an',
      bounds: [108.308, 15.864, 108.352, 15.890],
      walls: [0xeac655, 0xe3bc47, 0xf0d26d, 0xdcb546],
      roofs: [0x874834, 0x763e2d, 0x693b2d],
      gables: [0x8e4b35, 0x7a402e, 0x6b3a2c],
      awnings: [0x7e462d, 0x995333, 0x6c3c27],
      forcePitched: true,
      heritageWood: true,
      lanterns: true,
      signStyle: { bg: '#6e311f', fg: '#f6d67a', trim: '#d5a84c', wall: '#ebd072', shutter: '#5a3520' },
      shops: [
        { title: 'CAO LẦU HỘI AN', sub: 'MÌ QUẢNG • HOÀNH THÁNH', accent: '#8f3021', upstairs: true },
        { title: 'ĐÈN LỒNG HỘI AN', sub: 'LỤA TƠ TẰM • THỦ CÔNG', accent: '#b83c2a', upstairs: false },
        { title: 'CÀ PHÊ PHỐ CỔ', sub: 'TRÀ MÓT • NƯỚC THẢO MỘC', accent: '#6d4428', upstairs: true },
        { title: 'BÁNH MÌ PHỐ HỘI', sub: 'PATE • XÁ XÍU • RAU THƠM', accent: '#9b4a26', upstairs: false },
        { title: 'MAY ĐO ÁO DÀI', sub: 'VẢI LỤA • LẤY NGAY', accent: '#2f5e62', upstairs: true },
        { title: 'MÌ QUẢNG BÀ LỄ', sub: 'ĐẶC SẢN QUẢNG NAM', accent: '#7c3926', upstairs: false }
      ],
      stalls: ['CAO LẦU', 'TRÀ MÓT', 'BÁNH MÌ', 'ĐÈN LỒNG']
    },
    {
      id: 'hue',
      bounds: [107.530, 16.430, 107.628, 16.505],
      walls: [0xecd8a4, 0xe4cc94, 0xf2e4c2, 0xddd0b0],
      roofs: [0x8d4935, 0x7a4231, 0x705140],
      gables: [0x924c38, 0x7d4433, 0x6e4738],
      awnings: [0x7e3746, 0x965743, 0x5c685e],
      forcePitched: false,
      heritageWood: true,
      lanterns: true,
      signStyle: { bg: '#662839', fg: '#f4df9e', trim: '#c79a50', wall: '#ecdab1', shutter: '#4d3a2c' },
      shops: [
        { title: 'BÚN BÒ HUẾ', sub: 'GIÒ HEO • CHẢ CUA • MẮM RUỐC', accent: '#8c2d2c', upstairs: true },
        { title: 'CÀ PHÊ MUỐI', sub: 'CÀ PHÊ PHIN • TRÀ CUNG ĐÌNH', accent: '#5e3c28', upstairs: false },
        { title: 'BÁNH BÈO NẬM LỌC', sub: 'BÁNH KHOÁI • NEM LỤI', accent: '#7a3346', upstairs: true },
        { title: 'CƠM HẾN SÔNG HƯƠNG', sub: 'BÚN HẾN • CHÈ HẺM HUẾ', accent: '#36615d', upstairs: false },
        { title: 'MÈ XỬNG HUẾ', sub: 'TRÀ SEN • QUÀ CỐ ĐÔ', accent: '#99532b', upstairs: true },
        { title: 'CHÈ CUNG ĐÌNH', sub: 'CHÈ HẠT SEN • BỘT LỌC HEO QUAY', accent: '#6d3145', upstairs: false }
      ],
      stalls: ['BÚN BÒ HUẾ', 'CÀ PHÊ MUỐI', 'CƠM HẾN', 'CHÈ HẺM']
    },
    {
      id: 'da-nang',
      bounds: [108.165, 16.005, 108.285, 16.135],
      walls: [0xf2ece0, 0xe1ecec, 0xeee3cc, 0xdce6ed],
      roofs: [0x9c5844, 0x567d8e, 0x7a8a8e],
      gables: [0xa15943, 0x5f7f8c, 0x86614d],
      awnings: [0x2f6c80, 0xb0543a, 0x4c8276],
      forcePitched: false,
      heritageWood: false,
      lanterns: false,
      signStyle: { bg: '#1e5b73', fg: '#fff4d4', trim: '#e0a54b', wall: '#efe9dd', shutter: '#2f5460' },
      shops: [
        { title: 'MÌ QUẢNG ĐÀ NẴNG', sub: 'ẾCH • GÀ TA • TÔM THỊT', accent: '#b34729', upstairs: true },
        { title: 'HẢI SẢN TƯƠI SỐNG', sub: 'TÔM HÙM • CUA GHẸ • ỐC BIỂN', accent: '#1b6380', upstairs: false },
        { title: 'BÁNH TRÁNG CUỐN THỊT', sub: 'MẮM NÊM DÌ VÂN • RAU SỐNG', accent: '#2f7257', upstairs: true },
        { title: 'BÚN CHẢ CÁ SÔNG HÀN', sub: 'CHẢ CÁ THU • BÚN MẮM NÊM', accent: '#a84f2b', upstairs: false },
        { title: 'CÀ PHÊ BIỂN MỸ KHÊ', sub: 'TRÀ SỮA • NƯỚC DỪA TƯƠI', accent: '#2c5c6e', upstairs: true },
        { title: 'ĐẶC SẢN MIỀN TRUNG', sub: 'CHẢ BÒ • MỰC RIM • TRÉ', accent: '#8e362c', upstairs: false }
      ],
      stalls: ['MÌ QUẢNG', 'HẢI SẢN', 'BÚN CHẢ CÁ', 'CÀ PHÊ']
    },
    {
      id: 'nghe-an',
      bounds: [105.42, 18.58, 105.82, 19.32],
      walls: [0xeddac0, 0xe5cca0, 0xf1e5cf, 0xdcd3bf],
      roofs: [0xa44b35, 0x8c412f, 0x7b4c3a],
      gables: [0xa84d36, 0x8d4330, 0x795140],
      awnings: [0x9f3f2d, 0x3b6c63, 0xa86f38],
      forcePitched: false,
      heritageWood: false,
      lanterns: false,
      signStyle: { bg: '#8c2b22', fg: '#fce39c', trim: '#d5a147', wall: '#ede0c6', shutter: '#4f3e2e' },
      shops: [
        { title: 'CHÁO LƯƠN XỨ NGHỆ', sub: 'SÚP LƯƠN • MIẾN LƯƠN ĐỒNG', accent: '#992d22', upstairs: true },
        { title: 'CÀ PHÊ THÀNH VINH', sub: 'TRÀ ĐÁ • HƯỚNG DƯƠNG', accent: '#5a3d29', upstairs: false },
        { title: 'BÁNH MƯỚT NGHỆ AN', sub: 'GIÒ NÓNG • XÁO LÒNG', accent: '#2d6859', upstairs: true },
        { title: 'HẢI SẢN CỬA LÒ', sub: 'MỰC NHÁY • TÔM HẤP SẢ', accent: '#1f5e78', upstairs: false },
        { title: 'NHÚT THANH CHƯƠNG', sub: 'TƯƠNG NAM ĐÀN • BÁNH GAI', accent: '#7c4c27', upstairs: true },
        { title: 'SÚP LƯƠN BÁNH MÌ', sub: 'ĐẶC SẢN THÀNH VINH', accent: '#a84426', upstairs: false }
      ],
      stalls: ['CHÁO LƯƠN', 'SÚP LƯƠN', 'BÁNH MƯỚT', 'CÀ PHÊ']
    },
    {
      id: 'ha-tinh-quang-tri',
      bounds: [105.70, 16.65, 107.28, 18.56],
      walls: [0xede0c8, 0xe3d2b3, 0xe8e2d4, 0xf0e4cd],
      roofs: [0x9b4d38, 0x7e4d3d, 0x6f7e82],
      gables: [0x9e4f39, 0x825140, 0x737d7e],
      awnings: [0x2e6a73, 0x9c4832, 0x6f7c54],
      forcePitched: false,
      heritageWood: false,
      lanterns: false,
      signStyle: { bg: '#275966', fg: '#f8e6b4', trim: '#cc974b', wall: '#ede2cb', shutter: '#3e5256' },
      shops: [
        { title: 'KẸO CU ĐƠ HÀ TĨNH', sub: 'BÁNH ĐA VỪNG • CHÈ XANH', accent: '#8e3824', upstairs: true },
        { title: 'CHÁO CANH QUẢNG BÌNH', sub: 'CÁ LÓC • RAM GIÒN', accent: '#256372', upstairs: false },
        { title: 'BÁNH BỘT LỌC', sub: 'BÁNH KHOÁI • ĐỒNG HỚI', accent: '#a24e2b', upstairs: true },
        { title: 'CÀ PHÊ NHẬT LỆ', sub: 'NƯỚC DỪA • SINH TỐ', accent: '#4b5e3c', upstairs: false },
        { title: 'HẢI SẢN SÔNG GIANH', sub: 'MỰC NƯỚNG • CÁ NỤC HẤP', accent: '#1e5a74', upstairs: true },
        { title: 'BÚN HẾN MAI XÁ', sub: 'CHÁO BỘT • QUẢNG TRỊ', accent: '#7c3f28', upstairs: false }
      ],
      stalls: ['CHÁO CANH', 'CU ĐƠ', 'BÁNH LỌC', 'CHÈ XANH']
    },
    {
      id: 'thanh-hoa',
      bounds: [105.32, 19.62, 105.98, 20.18],
      walls: [0xeee0be, 0xe5d4ad, 0xefe6d4, 0xe2decb],
      roofs: [0xa34c36, 0x8c4230, 0x7a6a5c],
      gables: [0xa64e38, 0x8d4533, 0x7d6b5b],
      awnings: [0x9d3c2b, 0x35696c, 0x8d6738],
      forcePitched: false,
      heritageWood: false,
      lanterns: false,
      signStyle: { bg: '#8a2d24', fg: '#fae4a4', trim: '#cfa04c', wall: '#eee2c4', shutter: '#4c3f32' },
      shops: [
        { title: 'NEM CHUA THANH HÓA', sub: 'NEM NƯỚNG • TƯƠNG ỚT XỨ THANH', accent: '#9e2e24', upstairs: true },
        { title: 'CHẢ TÔM XỨ THANH', sub: 'BÁNH CUỐN NÓNG • RAU SỐNG', accent: '#b04e28', upstairs: false },
        { title: 'HẢI SẢN SẦM SƠN', sub: 'CUA GHẸ • MỰC TRỨNG HẤP', accent: '#1f617a', upstairs: true },
        { title: 'CÀ PHÊ HÀM RỒNG', sub: 'TRÀ CHANH • HƯỚNG DƯƠNG', accent: '#5c412b', upstairs: false },
        { title: 'BÁNH RĂNG BỪA', sub: 'CHÈ LAM PHỦ QUẢNG', accent: '#366855', upstairs: true },
        { title: 'CHÁO CANH SƯỜN', sub: 'BÚN CHẢ • ĐẶC SẢN XỨ THANH', accent: '#8c4228', upstairs: false }
      ],
      stalls: ['NEM CHUA', 'CHẢ TÔM', 'BÁNH CUỐN', 'CÀ PHÊ']
    },
    {
      id: 'quang-ngai-quy-nhon',
      bounds: [108.68, 13.68, 109.32, 15.42],
      walls: [0xf1e4ca, 0xe8d7b4, 0xe4e9e4, 0xf2ead9],
      roofs: [0xa3543d, 0x62828a, 0x8a5b46],
      gables: [0xa6563f, 0x66838b, 0x8c5d47],
      awnings: [0x2e6e7c, 0xb05336, 0x4f7c62],
      forcePitched: false,
      heritageWood: false,
      lanterns: false,
      signStyle: { bg: '#215d6d', fg: '#fff1cc', trim: '#d99c46', wall: '#f0e4cc', shutter: '#35545c' },
      shops: [
        { title: 'BÁNH XÈO TÔM NHẢY', sub: 'BÁNH HỎI LÒNG HEO • QUY NHƠN', accent: '#b24826', upstairs: true },
        { title: 'BÚN CHẢ CÁ QUY NHƠN', sub: 'CHẢ CÁ BIỂN • SỨA TƯƠI', accent: '#1e637a', upstairs: false },
        { title: 'DON QUẢNG NGÃI', sub: 'RAM BẮP • BÁNH TRÁNG NƯỚNG', accent: '#8e3d28', upstairs: true },
        { title: 'CÀ PHÊ BIỂN', sub: 'NƯỚC DỪA • SINH TỐ TƯƠI', accent: '#346b5a', upstairs: false },
        { title: 'NEM CHỢ HUYỆN', sub: 'MẠCH NHA • TỎI LÝ SƠN', accent: '#995328', upstairs: true },
        { title: 'HẢI SẢN GHỀNH RÁNG', sub: 'ỐC HƯƠNG • MỰC NƯỚNG', accent: '#235a78', upstairs: false }
      ],
      stalls: ['BÁNH XÈO', 'BÚN CHẢ CÁ', 'DON', 'CÀ PHÊ']
    },
    {
      id: 'nha-trang-phan-rang',
      bounds: [108.88, 11.48, 109.42, 13.22],
      walls: [0xf4ece0, 0xf0dec4, 0xe2ecef, 0xf5e8d2],
      roofs: [0xa9563d, 0x527f96, 0x8e6248],
      gables: [0xac583f, 0x568298, 0x91644a],
      awnings: [0x26708c, 0xb85838, 0x3b847a],
      forcePitched: false,
      heritageWood: false,
      lanterns: false,
      signStyle: { bg: '#1b6482', fg: '#fff5d8', trim: '#e6aa4c', wall: '#f3ebd9', shutter: '#2a5668' },
      shops: [
        { title: 'NEM NƯỚNG NHA TRANG', sub: 'BÁNH ƯỚT • NƯỚC CHẤM ĐẶC BIỆT', accent: '#b34326', upstairs: true },
        { title: 'BÚN SỨA CHẢ CÁ', sub: 'BÚN CÁ DẦM • NHA TRANG', accent: '#1d6885', upstairs: false },
        { title: 'MẮT CÁ NGỪ ĐẠI DƯƠNG', sub: 'HẢI SẢN TUY HÒA • PHÚ YÊN', accent: '#2d6c68', upstairs: true },
        { title: 'CÀ PHÊ TRẦN PHÚ', sub: 'YẾN SÀO • NƯỚC DỪA XIÊM', accent: '#355c74', upstairs: false },
        { title: 'BÁNH CĂN PHAN RANG', sub: 'NHO TƯƠI • MẬT NHO NINH THUẬN', accent: '#7e3b68', upstairs: true },
        { title: 'HẢI SẢN NƯỚNG BIỂN', sub: 'TÔM HÙM • NHUM NƯỚNG MỠ HÀNH', accent: '#a84f2b', upstairs: false }
      ],
      stalls: ['NEM NƯỚNG', 'BÚN SỨA', 'BÁNH CĂN', 'NƯỚC DỪA']
    },
    {
      id: 'tay-nguyen',
      bounds: [107.78, 12.52, 108.38, 14.48],
      walls: [0xe8d3b3, 0xdac09d, 0xe6dac7, 0xdfc8a5],
      roofs: [0x8e4733, 0x6b4534, 0x7b563c],
      gables: [0x924a35, 0x6e4836, 0x80583e],
      awnings: [0x6d3b26, 0x8c4d2d, 0x456544],
      forcePitched: false,
      heritageWood: true,
      lanterns: false,
      signStyle: { bg: '#512d1d', fg: '#f6d897', trim: '#c98e46', wall: '#e6d2b4', shutter: '#492e1f' },
      shops: [
        { title: 'CÀ PHÊ BAN MÊ', sub: 'ROBUSTA RANG XAY • NGUYÊN CHẤT', accent: '#5a321e', upstairs: true },
        { title: 'PHỞ KHÔ GIA LAI', sub: 'PHỞ HAI TÔ • TƯƠNG ĐEN PLEIKU', accent: '#8e3824', upstairs: false },
        { title: 'BÚN ĐỎ BUÔN MA THUỘT', sub: 'BÁNH ƯỚT THỊT NƯỚNG', accent: '#a63e26', upstairs: true },
        { title: 'GỎI LÁ KON TUM', sub: 'CƠM LAM • GÀ NƯỚNG BẢN ĐÔN', accent: '#356644', upstairs: false },
        { title: 'CÀ PHÊ NGUYÊN CHẤT', sub: 'MẬT ONG HOA CÀ PHÊ • TIÊU ĐEN', accent: '#6d3e24', upstairs: true },
        { title: 'BÒ NHÚNG ME TÂY NGUYÊN', sub: 'LẨU LÁ RỪNG • RƯỢU CẦN', accent: '#8a4326', upstairs: false }
      ],
      stalls: ['CÀ PHÊ BAN MÊ', 'PHỞ KHÔ', 'BÚN ĐỎ', 'CƠM LAM']
    },
    {
      id: 'da-lat',
      bounds: [108.37, 11.87, 108.52, 12.00],
      walls: [0xf3e4c3, 0xecd1bc, 0xe6dfd0, 0xf2ddb0],
      roofs: [0xa84b36, 0x8c3e2e, 0x5b6c75],
      gables: [0xad4e38, 0x8f4130, 0x5f717a],
      awnings: [0x8e3a32, 0x456b5a, 0x6b4b5c],
      forcePitched: true,
      heritageWood: true,
      lanterns: true,
      signStyle: { bg: '#5a2d36', fg: '#fae6b8', trim: '#d6a45c', wall: '#f2e3c6', shutter: '#3b5748' },
      shops: [
        { title: 'BÁNH TRÁNG NƯỚNG', sub: 'SỮA ĐẬU NÀNH NÓNG • ĐÀ LẠT', accent: '#9e3b2e', upstairs: true },
        { title: 'CÀ PHÊ SƯƠNG MÙ', sub: 'ARABICA CẦU ĐẤT • TRÀ ATISO', accent: '#485e4c', upstairs: false },
        { title: 'LẨU GÀ LÁ É', sub: 'BÁNH ƯỚT LÒNG GÀ • CHỢ ĐÊM', accent: '#36684f', upstairs: true },
        { title: 'BÁNH MÌ XÍU MẠI', sub: 'BÁNH CĂN NÓNG • HỒ XUÂN HƯƠNG', accent: '#a8512d', upstairs: false },
        { title: 'HOA TƯƠI ĐÀ LẠT', sub: 'DÂU TÂY • MỨT ĐẶC SẢN', accent: '#8c3554', upstairs: true },
        { title: 'SỮA ĐẬU NÀNH NÓNG', sub: 'BÁNH SU KEM • KHOAI NƯỚNG', accent: '#6d4430', upstairs: false }
      ],
      stalls: ['BÁNH TRÁNG NƯỚNG', 'SỮA ĐẬU NÀNH', 'CÀ PHÊ NÓNG', 'HOA ĐÀ LẠT']
    },
    {
      id: 'phan-thiet',
      bounds: [108.02, 10.86, 108.38, 11.06],
      walls: [0xf3e6ce, 0xefd8be, 0xe4ecee, 0xf4e3c2],
      roofs: [0xa6533b, 0x558296, 0x8d5b44],
      gables: [0xa9563d, 0x58859a, 0x905e46],
      awnings: [0x26708a, 0xb35235, 0x45806f],
      forcePitched: false,
      heritageWood: false,
      lanterns: false,
      signStyle: { bg: '#1e6078', fg: '#fff2d0', trim: '#dfa349', wall: '#f2e4ca', shutter: '#2f5766' },
      shops: [
        { title: 'BÁNH CĂN PHAN THIẾT', sub: 'BÁNH XÈO • CÁ KHO TỘ', accent: '#b04828', upstairs: true },
        { title: 'NƯỚC MẮM PHAN THIẾT', sub: 'MỰC MỘT NẮNG • ĐẶC SẢN', accent: '#8e3824', upstairs: false },
        { title: 'MÌ QUẢNG VỊT', sub: 'BÁNH QUAI VẠC • CHẢ CÁ', accent: '#23647a', upstairs: true },
        { title: 'HẢI SẢN MŨI NÉ', sub: 'GỎI CÁ MAI • RĂNG MỰC NƯỚNG', accent: '#2a6f62', upstairs: false },
        { title: 'CÀ PHÊ ĐỒI DƯƠNG', sub: 'NƯỚC DỪA TƯƠI • THANH LONG', accent: '#7c3658', upstairs: true },
        { title: 'BÁNH RẾ PHAN THIẾT', sub: 'CỐM SỮA • QUÀ BIỂN', accent: '#9c522a', upstairs: false }
      ],
      stalls: ['BÁNH CĂN', 'RĂNG MỰC', 'GỎI CÁ MAI', 'NƯỚC DỪA']
    }
  ];

  function zoneAt(lon, lat) {
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    for (const z of ZONES) {
      const [minLon, minLat, maxLon, maxLat] = z.bounds;
      if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat) return z;
    }
    return null;
  }

  function paintShopfrontTexture(T, zone, shop, renderer) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = shop.upstairs ? 512 : 320;
    const g = c.getContext('2d');
    const st = zone.signStyle;
    const W = c.width, H = c.height;

    // Base plaster wall with subtle vertical weathering
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, st.wall);
    grad.addColorStop(0.85, st.wall);
    grad.addColorStop(1, '#b8aa92');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);

    // Subtle plaster grain lines
    g.fillStyle = 'rgba(70,50,30,0.045)';
    for (let y = 0; y < H; y += 16) g.fillRect(0, y, W, 3);

    const gfTop = shop.upstairs ? 248 : 28;
    // Upstairs floor (windows + shutters + balcony) for 2-story shops
    if (shop.upstairs) {
      // Molding cornice
      g.fillStyle = 'rgba(90,65,40,0.22)';
      g.fillRect(0, 14, W, 12);
      g.fillStyle = '#d9ccb2';
      g.fillRect(0, 224, W, 16);

      // Two shuttered Vietnamese windows (Hội An / Huế / Đà Lạt wood or green louvers)
      for (const wx of [78, 306]) {
        g.fillStyle = '#3b2c20';
        g.fillRect(wx - 6, 56, 140, 148);
        // Dark interior glass
        g.fillStyle = '#243438';
        g.fillRect(wx + 24, 66, 80, 128);
        // Glass mullions
        g.strokeStyle = '#6b5a46';
        g.lineWidth = 4;
        g.strokeRect(wx + 24, 66, 80, 128);
        g.beginPath();
        g.moveTo(wx + 64, 66); g.lineTo(wx + 64, 194);
        g.moveTo(wx + 24, 130); g.lineTo(wx + 104, 130);
        g.stroke();
        // Side louvered shutters
        g.fillStyle = st.shutter;
        g.fillRect(wx - 4, 62, 28, 136);
        g.fillRect(wx + 104, 62, 28, 136);
        g.fillStyle = 'rgba(0,0,0,0.25)';
        for (let ly = 70; ly < 194; ly += 10) {
          g.fillRect(wx - 1, ly, 22, 3);
          g.fillRect(wx + 107, ly, 22, 3);
        }
      }
      // Balcony railing
      g.fillStyle = '#3d3732';
      g.fillRect(42, 184, W - 84, 6);
      g.fillRect(42, 218, W - 84, 6);
      for (let bx = 50; bx <= W - 50; bx += 22) g.fillRect(bx, 184, 4, 38);
    }

    // Shop signboard (biển hiệu tiếng Việt)
    const signY = gfTop;
    const signH = 82;
    g.fillStyle = shop.accent || st.bg;
    g.fillRect(16, signY, W - 32, signH);
    g.strokeStyle = st.trim;
    g.lineWidth = 5;
    g.strokeRect(20, signY + 4, W - 40, signH - 8);

    // Main title
    g.fillStyle = st.fg;
    g.font = 'bold 38px "Segoe UI", Arial, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(shop.title, W / 2, signY + 34, W - 58);

    // Subtitle menu
    g.fillStyle = 'rgba(255,244,218,0.88)';
    g.font = 'bold 17px "Segoe UI", Arial, sans-serif';
    g.fillText(shop.sub, W / 2, signY + 64, W - 64);

    // Striped awning valance strip under signboard
    const valY = signY + signH + 4;
    for (let x = 16, idx = 0; x < W - 16; x += 32, idx++) {
      g.fillStyle = idx % 2 === 0 ? (shop.accent || st.bg) : '#f3ead8';
      g.fillRect(x, valY, Math.min(32, W - 16 - x), 18);
    }

    // Ground floor open doorway / wooden folding panels (cửa gỗ Hội An / cửa kính quán ăn)
    const doorY = valY + 22;
    const doorH = H - doorY - 12;
    if (zone.heritageWood) {
      // Heritage timber folding panels (cửa bức bàn / cửa gỗ cổ)
      g.fillStyle = '#3d2416';
      g.fillRect(36, doorY, W - 72, doorH);
      // Warm interior glow
      const warm = g.createLinearGradient(0, doorY, 0, H);
      warm.addColorStop(0, '#4a2e1b');
      warm.addColorStop(0.5, '#7c532e');
      warm.addColorStop(1, '#3b281c');
      g.fillStyle = warm;
      g.fillRect(136, doorY + 12, W - 272, doorH - 12);
      // Flanking wooden doors with lattice & gold calligraphy panels
      for (const dx of [40, W - 132]) {
        g.fillStyle = '#5e351f';
        g.fillRect(dx, doorY + 6, 92, doorH - 6);
        g.strokeStyle = '#351c0f';
        g.lineWidth = 4;
        g.strokeRect(dx + 6, doorY + 14, 80, doorH * 0.45);
        g.strokeRect(dx + 6, doorY + doorH * 0.52, 80, doorH * 0.42);
      }
      // Two hanging red/gold paper lanterns under lintel
      for (const lx of [185, W - 185]) {
        g.fillStyle = '#d93d2b';
        g.beginPath();
        g.ellipse(lx, doorY + 32, 18, 22, 0, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = '#f2c14e';
        g.fillRect(lx - 8, doorY + 8, 16, 6);
        g.fillRect(lx - 6, doorY + 52, 12, 8);
      }
    } else {
      // Modern Vietnamese tiled shopfront with open glass/metal roll-up entrance & glass food cabinet
      g.fillStyle = '#2d3b3e';
      g.fillRect(36, doorY, W - 72, doorH);
      // Warm interior wall & light bar
      const inner = g.createLinearGradient(0, doorY, 0, H);
      inner.addColorStop(0, '#6a5b44');
      inner.addColorStop(0.35, '#8f7d60');
      inner.addColorStop(1, '#4c463c');
      g.fillStyle = inner;
      g.fillRect(52, doorY + 12, W - 104, doorH - 12);
      // Glass food display cabinet (tủ kính bán bún/cháo/mì)
      g.fillStyle = '#b9d2d8';
      g.fillRect(68, doorY + doorH * 0.36, 130, doorH * 0.62);
      g.fillStyle = '#9aaeb4';
      g.fillRect(68, doorY + doorH * 0.68, 130, doorH * 0.30);
      g.strokeStyle = '#6c797c';
      g.lineWidth = 4;
      g.strokeRect(68, doorY + doorH * 0.36, 130, doorH * 0.62);
      // Stacked bowls/dishes silhouette in cabinet
      g.fillStyle = '#e7decb';
      for (const bx of [86, 118, 152]) g.fillRect(bx, doorY + doorH * 0.56, 22, 12);
      // Ceramic wall tile dado on pillars
      g.fillStyle = '#d8d2c2';
      g.fillRect(0, doorY + doorH * 0.45, 34, H - (doorY + doorH * 0.45));
      g.fillRect(W - 34, doorY + doorH * 0.45, 34, H - (doorY + doorH * 0.45));
    }

    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    if (renderer) tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return new T.MeshStandardMaterial({
      name: 'CentralShop ' + zone.id + ' ' + shop.title,
      map: tex,
      roughness: 0.88,
      metalness: 0.02
    });
  }

  function makeStallSignTexture(T, text, bg, fg) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = bg; g.fillRect(0, 0, 256, 64);
    g.strokeStyle = fg; g.lineWidth = 4; g.strokeRect(4, 4, 248, 56);
    g.fillStyle = fg; g.font = 'bold 30px "Segoe UI", Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, 128, 34, 232);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    return tex;
  }

  function create(T, scene, renderer, materialMap) {
    const root = new T.Group();
    root.name = 'Central Vietnam street life';
    scene.add(root);

    const frontCache = new Map();
    const signCache = new Map();
    const glowMats = [];

    // Shared geometries & materials for sidewalk stalls, plastic stools, tables, umbrellas & lanterns
    const geo = {
      box: new T.BoxGeometry(1, 1, 1),
      cyl: new T.CylinderGeometry(1, 1, 1, 10),
      cone: new T.ConeGeometry(1, 1, 8),
      sphere: new T.SphereGeometry(1, 10, 8),
      plane: new T.PlaneGeometry(1, 1)
    };
    const mat = {
      steel: new T.MeshStandardMaterial({ color: 0xb4bec0, roughness: 0.42, metalness: 0.55 }),
      wood: new T.MeshLambertMaterial({ color: 0x6f4329 }),
      cream: new T.MeshLambertMaterial({ color: 0xf1e5c8 }),
      redStool: new T.MeshLambertMaterial({ color: 0xb83529 }),
      blueStool: new T.MeshLambertMaterial({ color: 0x256588 }),
      umbrellaA: new T.MeshLambertMaterial({ color: 0xb53c2e }),
      umbrellaB: new T.MeshLambertMaterial({ color: 0x286a7a }),
      umbrellaC: new T.MeshLambertMaterial({ color: 0xc98b2e }),
      pot: new T.MeshLambertMaterial({ color: 0x9b543a }),
      foliage: new T.MeshLambertMaterial({ color: 0x3b6e34 }),
      blossom: new T.MeshLambertMaterial({ color: 0xc73b66 }),
      glass: new T.MeshStandardMaterial({ color: 0xaed0d4, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.72 }),
      cord: new T.MeshBasicMaterial({ color: 0x2a2622 })
    };
    const lanternPalette = [0xd93a2b, 0xedb434, 0xd96b27, 0x2a8d82, 0xc74272];
    const lanternMats = lanternPalette.map(hex => {
      const m = new T.MeshStandardMaterial({ color: hex, roughness: 0.5, emissive: hex, emissiveIntensity: 0.22 });
      glowMats.push({ mat: m, base: 0.16, night: 2.4 });
      return m;
    });
    const bulbMat = new T.MeshStandardMaterial({ color: 0xfff3d4, roughness: 0.4, emissive: 0xffc870, emissiveIntensity: 0.25 });
    glowMats.push({ mat: bulbMat, base: 0.15, night: 3.1 });

    function ensureFrontMaterials(zone) {
      if (frontCache.has(zone.id)) return frontCache.get(zone.id);
      const keys = [];
      zone.shops.forEach((shop, i) => {
        const key = 'cfront_' + zone.id + '_' + i;
        if (!materialMap[key]) materialMap[key] = paintShopfrontTexture(T, zone, shop, renderer);
        keys.push(key);
      });
      frontCache.set(zone.id, keys);
      return keys;
    }

    function addPart(parent, g, m, x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) {
      const mesh = new T.Mesh(g, m);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      if (rx || ry || rz) mesh.rotation.set(rx, ry, rz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    // Build a Vietnamese sidewalk specialty food/coffee stall (quán vỉa hè) with low tables & plastic stools
    function buildStall(zone, label, seed) {
      const g = new T.Group();
      const awningMat = [mat.umbrellaA, mat.umbrellaB, mat.umbrellaC][seed % 3];
      const stoolMat = seed % 2 ? mat.blueStool : mat.redStool;

      // Stainless steel / timber food cart counter
      addPart(g, geo.box, zone.heritageWood ? mat.wood : mat.steel, -0.75, 0.46, 0, 1.35, 0.86, 0.68);
      // Glass display top (tủ kính)
      addPart(g, geo.box, mat.glass, -0.75, 1.24, 0, 1.28, 0.68, 0.60);
      // Roof frame poles & sloped awning canopy
      for (const px of [-1.42, -0.08]) for (const pz of [-0.32, 0.32]) {
        addPart(g, geo.cyl, mat.steel, px, 1.54, pz, 0.025, 1.28, 0.025);
      }
      addPart(g, geo.box, awningMat, -0.75, 2.22, 0.06, 1.85, 0.09, 1.18, 0.14);
      // Glowing warm stall light bulb under awning
      addPart(g, geo.sphere, bulbMat, -0.75, 2.02, 0.18, 0.09, 0.09, 0.09);

      // Vietnamese signboard on front & back of stall canopy
      const sKey = zone.id + ':' + label;
      let signMat = signCache.get(sKey);
      if (!signMat) {
        signMat = new T.MeshBasicMaterial({ map: makeStallSignTexture(T, label, zone.signStyle.bg, zone.signStyle.fg) });
        signCache.set(sKey, signMat);
      }
      addPart(g, geo.plane, signMat, -0.75, 1.96, 0.56, 1.55, 0.36, 1);
      addPart(g, geo.plane, signMat, -0.75, 1.96, -0.45, 1.55, 0.36, 1, 0, Math.PI, 0);

      // Low table + 3 plastic stools (ghế nhựa vỉa hè) beside the cart
      addPart(g, geo.box, mat.steel, 0.95, 0.52, 0.05, 0.88, 0.05, 0.62);
      for (const lx of [0.58, 1.32]) for (const lz of [-0.20, 0.30]) {
        addPart(g, geo.cyl, mat.steel, lx, 0.26, lz, 0.022, 0.52, 0.022);
      }
      for (const [sx, sz] of [[0.95, -0.52], [0.95, 0.62], [1.62, 0.05]]) {
        addPart(g, geo.box, stoolMat, sx, 0.34, sz, 0.32, 0.06, 0.32);
        for (const dx of [-0.11, 0.11]) for (const dz of [-0.11, 0.11]) {
          addPart(g, geo.box, stoolMat, sx + dx, 0.17, sz + dz, 0.045, 0.33, 0.045);
        }
      }

      // Market umbrella (dù che nắng) shading the seating area
      addPart(g, geo.cyl, mat.steel, 1.18, 1.24, -0.05, 0.035, 2.45, 0.035);
      addPart(g, geo.cone, awningMat, 1.18, 2.52, -0.05, 1.35, 0.42, 1.35);

      // Potted bougainvillea / ornamental shrub beside the stall
      addPart(g, geo.cyl, mat.pot, -1.78, 0.24, 0.15, 0.26, 0.48, 0.22);
      addPart(g, geo.sphere, mat.foliage, -1.78, 0.78, 0.15, 0.42, 0.46, 0.42);
      addPart(g, geo.sphere, mat.blossom, -1.66, 0.94, 0.26, 0.22, 0.20, 0.22);
      addPart(g, geo.sphere, mat.blossom, -1.90, 0.88, 0.04, 0.20, 0.18, 0.20);
      return g;
    }

    // Build a Hội An / Huế / Đà Lạt silk lantern string slung between two roadside timber posts
    function buildLanternGarland(span, seed) {
      const g = new T.Group();
      const half = span / 2;
      for (const s of [-1, 1]) {
        addPart(g, geo.cyl, mat.wood, s * half, 2.1, 0, 0.06, 4.2, 0.06);
      }
      const count = Math.max(4, Math.min(7, Math.round(span / 1.15)));
      for (let i = 0; i < count; i++) {
        const t = (i + 0.5) / count;
        const x = -half + t * span;
        const sag = 0.55 * 4 * t * (1 - t);
        const y = 3.9 - sag;
        const lm = lanternMats[(seed + i) % lanternMats.length];
        addPart(g, geo.cyl, mat.cord, x, y + 0.20, 0, 0.014, 0.30, 0.014);
        addPart(g, geo.sphere, lm, x, y - 0.06, 0, 0.26, 0.33, 0.26);
        addPart(g, geo.cyl, mat.wood, x, y + 0.22, 0, 0.09, 0.05, 0.09);
        addPart(g, geo.cyl, mat.wood, x, y - 0.36, 0, 0.07, 0.06, 0.07);
      }
      return g;
    }

    // Build an across-the-street overhead Hội An / Huế silk lantern arch (`y = 5.1..5.7m`, safely above traffic!)
    function buildOverheadLanternSpan(span, seed) {
      const g = new T.Group();
      const half = span / 2;
      for (const s of [-1, 1]) {
        addPart(g, geo.cyl, mat.wood, s * half, 2.85, 0, 0.07, 5.7, 0.07);
      }
      const count = Math.max(5, Math.min(9, Math.round(span / 1.15)));
      for (let i = 0; i < count; i++) {
        const t = (i + 0.5) / count;
        const x = -half + t * span;
        const sag = 0.65 * 4 * t * (1 - t);
        const y = 5.65 - sag;
        const lm = lanternMats[(seed + i) % lanternMats.length];
        addPart(g, geo.cyl, mat.cord, x, y + 0.16, 0, 0.014, 0.28, 0.014);
        addPart(g, geo.sphere, lm, x, y - 0.08, 0, 0.25, 0.32, 0.25);
        addPart(g, geo.cyl, mat.wood, x, y + 0.19, 0, 0.085, 0.045, 0.085);
        addPart(g, geo.cyl, mat.wood, x, y - 0.37, 0, 0.065, 0.06, 0.065);
      }
      return g;
    }

    function getShopSignMaterial(zone, shop) {
      const sKey = 'shopSign:' + zone.id + ':' + shop.title;
      let signMat = signCache.get(sKey);
      if (!signMat) {
        const c = document.createElement('canvas');
        c.width = 512; c.height = 160;
        const ctx = c.getContext('2d');
        const st = zone.signStyle;
        ctx.fillStyle = shop.accent || st.bg;
        ctx.fillRect(0, 0, 512, 160);
        ctx.strokeStyle = st.trim; ctx.lineWidth = 8; ctx.strokeRect(6, 6, 500, 148);
        ctx.fillStyle = st.fg; ctx.font = 'bold 44px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(shop.title, 256, 62, 470);
        ctx.fillStyle = 'rgba(255,244,218,0.92)'; ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
        ctx.fillText(shop.sub, 256, 118, 464);
        const tex = new T.CanvasTexture(c);
        tex.colorSpace = T.SRGBColorSpace;
        signMat = new T.MeshStandardMaterial({
          map: tex, roughness: 0.6,
          emissiveMap: tex, emissive: new T.Color(0xffffff), emissiveIntensity: 0.14
        });
        glowMats.push({ mat: signMat, base: 0.10, night: 0.78 });
        signCache.set(sKey, signMat);
      }
      return signMat;
    }

    // Build a free-standing roadside shop signboard (biển hiệu đứng / biển vẫy quán đặc sản)
    function buildRoadsideSign(zone, shop, seed) {
      const g = new T.Group();
      const signMat = getShopSignMaterial(zone, shop);
      for (const px of [-1.05, 1.05]) addPart(g, geo.cyl, mat.steel, px, 1.55, 0, 0.045, 3.1, 0.045);
      addPart(g, geo.box, mat.wood, 0, 2.75, 0, 2.52, 0.86, 0.14);
      addPart(g, geo.plane, signMat, 0, 2.75, 0.075, 2.42, 0.76, 1);
      addPart(g, geo.plane, signMat, 0, 2.75, -0.075, 2.42, 0.76, 1, 0, Math.PI, 0);
      if (zone.lanterns) {
        for (const px of [-0.75, 0.75]) {
          addPart(g, geo.sphere, lanternMats[(seed + (px > 0 ? 1 : 0)) % lanternMats.length], px, 2.12, 0, 0.18, 0.23, 0.18);
        }
      }
      return g;
    }

    // Mount authentic regional Vietnamese shopfront signboards, under-awning silk lanterns,
    // and potted bougainvillea directly onto surveyed OSM shophouse facades from tour-district.js!
    function decorateDistrictFronts(fronts, clearFn) {
      if (!fronts || !fronts.length) return;
      const nearest = fronts
        .filter(f => f.zone && f.half >= 1.35 && Math.hypot(f.x, f.z) <= 155)
        .sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z));
      const mounted = [];
      let count = 0;
      for (const f of nearest) {
        if (count >= 26) break;
        if (mounted.some(p => Math.hypot(p.x - f.x, p.z - f.z) < 5.5)) continue;
        const zone = f.zone;
        const shop = zone.shops[f.seed % zone.shops.length];
        const signMat = getShopSignMaterial(zone, shop);
        const w = Math.min(f.half * 1.72, 4.2);
        const h = Math.min(0.84, Math.max(0.58, w * 0.24));
        const yaw = Math.atan2(f.nx, f.nz);
        const g = new T.Group();
        // Backlit signboard mounted cleanly flush above the awning (or on the 2nd-floor balcony fascia when present!)
        const hasBalcony = f.h >= 6.4 && f.seed % 4 !== 0;
        const sy = hasBalcony ? 3.68 : Math.min(f.h - h * 0.55, f.top + 0.54);
        const sz = hasBalcony ? 0.94 : 0.14;
        if (sy > f.top + 0.18) {
          addPart(g, geo.box, mat.wood, 0, sy, sz, w + 0.14, h + 0.10, 0.10);
          addPart(g, geo.plane, signMat, 0, sy, sz + 0.055, w, h, 1);
        }
        // Hanging glowing silk lanterns under Hội An / Huế / Đà Lạt shop awnings
        if (zone.lanterns) {
          const lx = Math.min(f.half * 0.62, 1.45);
          for (const side of [-1, 1]) {
            const lm = lanternMats[(f.seed + (side > 0 ? 2 : 0)) % lanternMats.length];
            addPart(g, geo.cyl, mat.cord, side * lx, f.top - 0.08, 0.52, 0.012, 0.24, 0.012);
            addPart(g, geo.sphere, lm, side * lx, f.top - 0.34, 0.52, 0.21, 0.27, 0.21);
          }
        }
        // Potted bougainvillea beside the doorway if sidewalk space is clear
        if (f.seed % 3 === 0) {
          const px = f.x + f.nx * 0.72 + f.nz * (f.half * 0.78);
          const pz = f.z + f.nz * 0.72 - f.nx * (f.half * 0.78);
          if (clearFn(px, pz, 0.45)) {
            addPart(g, geo.cyl, mat.pot, f.half * 0.78, 0.24, 0.72, 0.24, 0.46, 0.22);
            addPart(g, geo.sphere, mat.foliage, f.half * 0.78, 0.76, 0.72, 0.38, 0.44, 0.38);
            addPart(g, geo.sphere, mat.blossom, f.half * 0.78 + 0.10, 0.94, 0.78, 0.22, 0.20, 0.22);
          }
        }
        g.position.set(f.x, f.y, f.z);
        g.rotation.y = yaw;
        root.add(g);
        mounted.push({ x: f.x, z: f.z });
        count++;
      }
    }

    function clearProps() {
      while (root.children.length) root.remove(root.children[0]);
    }

    function place(graph, cx, cz, segments, clearFn, groundFn, districtFronts = null, osmPlaces = null) {
      clearProps();
      if (!graph) return;
      const [lon, lat] = graph.geo(cx, cz);
      const zone = zoneAt(lon, lat);
      if (!zone) return;

      // 1. Mount authentic regional Vietnamese shopfront signboards & lanterns onto real OSM shophouses
      decorateDistrictFronts(districtFronts, clearFn);

      // Boost priority of street segments close to real OSM cafes & markets
      const hotSpots = (osmPlaces || [])
        .filter(p => p.kind === 'cafe' || p.kind === 'market')
        .map(p => ({ x: p.x - cx, z: p.z - cz }));

      // Sort nearest segments first (with cafe/market amenity bonus)
      const nearby = segments
        .filter(s => s.len >= 7 && !s.graded && !/^(motorway|trunk)/.test(s.kind))
        .map(s => {
          const mx = (s.ax + s.bx) * 0.5, mz = (s.az + s.bz) * 0.5;
          const dist = Math.hypot(mx, mz);
          const nearCafe = hotSpots.some(h => Math.hypot(h.x - mx, h.z - mz) < 45);
          return { s, dist, rank: dist - (nearCafe ? 35 : 0) };
        })
        .filter(item => item.dist <= 200)
        .sort((a, b) => a.rank - b.rank);

      const placed = [];
      let stallCount = 0;
      let overheadCount = 0;
      let garlandCount = 0;
      let signCount = 0;
      const maxStalls = 14;
      const maxOverhead = (zone.id === 'hoi-an' || zone.id === 'hue') ? 10 : 0;
      const maxGarlands = zone.lanterns ? 10 : 0;
      const maxSigns = 8;

      // 2. String overhead silk lantern canopies right across narrow Hội An & Huế Old Town streets!
      if (maxOverhead > 0) {
        for (const { s } of nearby) {
          if (overheadCount >= maxOverhead) break;
          if (s.w > 4.8 || s.len < 10) continue;
          const step = Math.max(18, s.len * 0.5);
          for (let d = 5; d < s.len - 5 && overheadCount < maxOverhead; d += step) {
            const cxRoad = s.ax + s.fx * d, czRoad = s.az + s.fz * d;
            if (Math.hypot(cxRoad, czRoad) > 155) continue;
            if (placed.some(p => Math.hypot(p.x - cxRoad, p.z - czRoad) < 16)) continue;
            const halfSpan = s.w + 1.35;
            const lx = cxRoad - s.nx * halfSpan, lz = czRoad - s.nz * halfSpan;
            const rx = cxRoad + s.nx * halfSpan, rz = czRoad + s.nz * halfSpan;
            if (!clearFn(lx, lz, 0.35) || !clearFn(rx, rz, 0.35)) continue;
            const wy = groundFn(cxRoad + cx, czRoad + cz);
            const hash = (s.seed ^ Math.imul(Math.round(d) + 31, 73856093)) >>> 0;
            const spanArch = buildOverheadLanternSpan(halfSpan * 2, hash);
            spanArch.position.set(cxRoad, wy, czRoad);
            // Local +X runs across the road along (s.nx, s.nz)
            spanArch.rotation.y = Math.atan2(-s.nz, s.nx);
            root.add(spanArch);
            placed.push({ x: cxRoad, z: czRoad });
            overheadCount++;
          }
        }
      }

      // 3. Place specialty sidewalk food/coffee stalls, plastic stools, umbrellas & projecting shop signs
      for (const { s } of nearby) {
        if (stallCount >= maxStalls && garlandCount >= maxGarlands && signCount >= maxSigns) break;
        const step = Math.max(13, Math.min(26, s.len * 0.45));
        for (let d = 3.5 + (s.seed % 5); d < s.len - 3.5; d += step) {
          for (const side of [-1, 1]) {
            const hash = (s.seed ^ Math.imul(Math.round(d) + 17, side > 0 ? 73856093 : 19349663)) >>> 0;
            const offset = s.w + 2.15;
            const x = s.ax + s.fx * d + side * s.nx * offset;
            const z = s.az + s.fz * d + side * s.nz * offset;
            if (Math.hypot(x, z) > 190) continue;
            if (placed.some(p => Math.hypot(p.x - x, p.z - z) < 12.5)) continue;
            if (!clearFn(x, z, 1.45)) continue;

            const wy = groundFn(x + cx, z + cz);
            const faceRoadYaw = Math.atan2(-s.nx * side, -s.nz * side);
            const pick = hash % 5;

            if (zone.lanterns && garlandCount < maxGarlands && pick === 0 && s.len >= 8) {
              if (!clearFn(x + s.fx * 2.5, z + s.fz * 2.5, 0.45) || !clearFn(x - s.fx * 2.5, z - s.fz * 2.5, 0.45)) continue;
              const garland = buildLanternGarland(5.4, hash);
              garland.position.set(x, wy, z);
              garland.rotation.y = Math.atan2(-s.fz, s.fx);
              root.add(garland);
              placed.push({ x, z });
              garlandCount++;
            } else if (signCount < maxSigns && pick === 1) {
              const shop = zone.shops[hash % zone.shops.length];
              const board = buildRoadsideSign(zone, shop, hash);
              board.position.set(x, wy, z);
              board.rotation.y = Math.atan2(s.fx, s.fz);
              root.add(board);
              placed.push({ x, z });
              signCount++;
            } else if (stallCount < maxStalls) {
              if (!clearFn(x + s.fx * 1.2, z + s.fz * 1.2, 0.65) || !clearFn(x - s.fx * 1.2, z - s.fz * 1.2, 0.65)) continue;
              const label = zone.stalls[hash % zone.stalls.length];
              const stall = buildStall(zone, label, hash);
              stall.position.set(x, wy, z);
              stall.rotation.y = faceRoadYaw;
              root.add(stall);
              placed.push({ x, z });
              stallCount++;
            }
            if (stallCount >= maxStalls && garlandCount >= maxGarlands && signCount >= maxSigns) break;
          }
          if (stallCount >= maxStalls && garlandCount >= maxGarlands && signCount >= maxSigns) break;
        }
      }
    }

    function update(lampLevel) {
      const k = Math.max(0, Math.min(1, lampLevel || 0));
      for (const item of glowMats) {
        item.mat.emissiveIntensity = item.base + k * item.night;
      }
    }

    function themeAt(graph, wx, wz) {
      if (!graph) return null;
      const [lon, lat] = graph.geo(wx, wz);
      const zone = zoneAt(lon, lat);
      if (!zone) return null;
      return {
        zone,
        frontKeys: ensureFrontMaterials(zone)
      };
    }

    return { themeAt, place, update, zoneAt };
  }

  window.CentralStreetscapes = { create, zoneAt };
})();

;
// tour-district.js
'use strict';
const vanMieuArchitectureRefs=new Set(['w702185143','w702241280','w702241281',
  'w702185144','w702185176','w702185189','w702241324','w702241325']);
// Native Văn Miếu models use the monument's floor plans, photographs, and the
// documented order and catalogue sizes of the 82 stelae (VanMieuSurvey).
// Undimensioned roofs, timber, carving profiles, turtle bases and spacing are
// visual reconstructions. No inscription text is synthesized.
function createVanMieuArchitecture(T){
  const colors={clay:0xb66d4c,ridge:0x8e8176,timber:0x653d2e,wood:0x875742,lacquer:0x9c3b2a,
    granite:0x88887b,border:0x989889,brick:0xa97960,plaster:0xcec5af,bronze:0x827454,hide:0xc8aa81};
  for(const k of Object.keys(colors))colors[k]=new T.Color(colors[k]);
  const forms={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(1,1,1,12),
    ellipsoid:new T.SphereGeometry(1,10,5),shell:new T.SphereGeometry(1,16,7)};
  return function draw(survey,ring,graph,put){
    const stele=Boolean(survey.steleRows),drum=survey.kind==='drum',bell=survey.kind==='bell';
    const gate=survey.ref==='w702185144'||survey.ref==='w702185176',hall=survey.ref==='w702185189';
    const mainGate=survey.ref==='w702185143',sideGate=survey.ref==='w702241280'||survey.ref==='w702241281';
    // World north is -z. Rows run from Khuê Văn Các to Đại Thành Môn. Each
    // tablet lies parallel to its gallery and faces across it toward the well.
    const site=window.VanMieuSurvey.byRef,centre=ref=>{
      const xy=site.get(ref).rings[0].slice(0,-1);
      return graph.point(xy.reduce((s,p)=>s+p[0],0)/xy.length,xy.reduce((s,p)=>s+p[1],0)/xy.length);
    };
    const khue=centre('w702185155'),dai=centre('w702185176'),well=centre('w37934144');
    let tx=dai.x-khue.x,tz=dai.z-khue.z;
    if(!stele)[tx,tz]=[-tz,tx];
    const length=Math.hypot(tx,tz);tx/=length;tz/=length;
    let ux=tx,uz=tz,longest=0;
    for(let j=0;j<ring.length;j++){
      const a=ring[j],b=ring[(j+1)%ring.length],dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz),dot=dx*tx+dz*tz;
      if(len>longest&&Math.abs(dot)>.88*len){longest=len;ux=dx/len*Math.sign(dot);uz=dz/len*Math.sign(dot);}
    }
    let vx=-uz,vz=ux;
    const x0=ring[0].x,z0=ring[0].y;
    const front=stele?well:graph.point(105.8353754,21.0273187);
    if((front.x-x0)*vx+(front.z-z0)*vz<0){vx=-vx;vz=-vz;}
    const us=ring.map(p=>(p.x-x0)*ux+(p.y-z0)*uz),vs=ring.map(p=>(p.x-x0)*vx+(p.y-z0)*vz);
    const uMin=Math.min(...us),uMax=Math.max(...us),vMin=Math.min(...vs),vMax=Math.max(...vs);
    const U=(uMax-uMin)/2,V=(vMax-vMin)/2;
    const x=x0+ux*(uMax+uMin)/2+vx*(vMax+vMin)/2,z=z0+uz*(uMax+uMin)/2+vz*(vMax+vMin)/2;
    const solids=[],stelae=[];
    function corner(u,v){return new T.Vector2(x+ux*u+vx*v,z+uz*u+vz*v);}
    function barrier(u,v,ru,rv){solids.push([[corner(u-ru,v-rv),corner(u+ru,v-rv),corner(u+ru,v+rv),corner(u-ru,v+rv)]]);}
    function finishOf(tint){
      if(tint===colors.granite||tint===colors.border)return 3;
      if(tint===colors.wood||tint===colors.timber||tint===colors.lacquer)return 5;
      if(tint===colors.plaster)return 6;
      return 0;
    }
    function point(p,tint,finish=finishOf(tint),uv,normal){
      const [u,y,v]=p;
      const tex=uv||(finish>=3?[u,y]:[u,v]);
      put(x+ux*u+vx*v,y,z+uz*u+vz*v,tex[0],tex[1],tint,finish,normal);
    }
    function planar(a,b,c){
      const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],ex=c[0]-a[0],ey=c[1]-a[1],ez=c[2]-a[2];
      const nx=Math.abs(dy*ez-dz*ey),ny=Math.abs(dz*ex-dx*ez),nz=Math.abs(dx*ey-dy*ex);
      if(ny>nx&&ny>nz)return p=>[p[0],p[2]];
      return nx>nz?p=>[p[2],p[1]]:p=>[p[0],p[1]];
    }
    function face(a,b,c,d,tint,finish=finishOf(tint)){
      const map=finish>=3&&planar(a,b,c);
      for(const p of [a,b,c,a,c,d])point(p,tint,finish,map&&map(p));
    }
    function solid(key,u,y,v,su,sy,sv,tint){
      const geo=forms[key],ind=geo.index.array,positions=geo.attributes.position,uv=geo.attributes.uv,finish=finishOf(tint);
      const pts=Array.from({length:positions.count},(_,i)=>[u+positions.getX(i)*su,y+positions.getY(i)*sy,v+positions.getZ(i)*sv]);
      // Smooth the carved stone and turned posts without splitting the
      // district into additional draws. Mirror normals with the gallery.
      const sign=Math.sign(ux*vz-uz*vx),n=geo.attributes.normal;
      const normals=key!=='box'&&Array.from({length:n.count},(_,i)=>{
        const a=n.getX(i)/su,b=n.getY(i)/sy,c=n.getZ(i)/sv,s=sign/Math.hypot(a,b,c);
        return [(ux*a+vx*c)*s,b*s,(uz*a+vz*c)*s];
      });
      for(let j=0;j<ind.length;j+=3){
        const projection=key==='box'&&planar(pts[ind[j]],pts[ind[j+1]],pts[ind[j+2]]);
        for(let k=j;k<j+3;k++){
          const i=ind[k],p=pts[i];
          const tex=projection?projection(p):[u+.37*v+uv.getX(i)*Math.PI*(su+sv),y+(uv.getY(i)-.5)*sy*(key==='round'?1:2)];
          point(p,tint,finish,tex,normals&&normals[i]);
        }
      }
    }
    function box(u,y,v,w,h,d,tint){solid('box',u,y,v,w,h,d,tint);}
    const piers=survey.kind==='stelePavilion';
    const raised=gate||drum||bell;
    const floor=hall ? 0 : (raised ? .36 : .12);
    const tallest=stele?Math.max(...survey.steleRows.map(a=>a.height)):0;
    const eave=stele?Math.max(tallest+.76,piers?3.05:2.85):hall?4.5:gate?2.82:3.85;
    const rise=stele?(piers?1.95:1.43):Math.min(3,V*.75);
    const apron=Math.min(.32,V*.12);
    box(0,floor/2-.18,0,(U-apron*.65)*2,floor+.36,(V-apron*.65)*2,colors.brick);
    function roofTier(halfU,halfV,edge,pitch,offsetU=0,offsetV=0){
      const gabled=gate||hall;
      const hip=gabled?0:Math.min(halfU*.45,halfV*.73);
      function roofPoint(s,t,side){
        const end=Math.abs(s)**7,upturn=Math.min(.52,halfV*.17)*end;
        return [offsetU+s*(halfU-hip*t),edge+pitch*(.70*t+.30*t*t)+(gabled?.18:1)*upturn*((1-t)**2+.23*t*t),
          offsetV+side*halfV*(1-t)];
      }
      const segments=12,tiers=4;
      for(const side of [-1,1]){
        for(let j=0;j<segments;j++){
          const s=2*j/segments-1,r=2*(j+1)/segments-1;
          for(let k=0;k<tiers;k++)face(roofPoint(s,k/tiers,side),roofPoint(r,k/tiers,side),
            roofPoint(r,(k+1)/tiers,side),roofPoint(s,(k+1)/tiers,side),colors.clay,1);
          const a=roofPoint(s,0,side),b=roofPoint(r,0,side);
          face(a,b,[b[0],b[1]-.12,b[2]],[a[0],a[1]-.12,a[2]],colors.timber);
        }
      }
      for(const s of [-1,1])for(let k=0;k<tiers;k++){
        const t=k/tiers,n=(k+1)/tiers;
        face(roofPoint(s,t,-1),roofPoint(s,t,1),roofPoint(s,n,1),roofPoint(s,n,-1),
          gabled?colors.plaster:colors.clay,gabled?0:1);
      }
      const cap=(s,side)=>{const [u,y]=roofPoint(s,1,1);return [u,y+.09+Math.abs(s)**8*.14,offsetV+side*.10];};
      for(let k=0;k<segments;k++){
        const s=2*k/segments-1,r=2*(k+1)/segments-1;
        face(cap(s,-1),cap(r,-1),cap(r,1),cap(s,1),colors.ridge);
        for(const side of [-1,1]){
          const a=cap(s,side),b=cap(r,side);
          face(a,b,[b[0],b[1]-.16,b[2]],[a[0],a[1]-.16,a[2]],colors.ridge);
        }
      }
    }
    function arch(u,v,halfWidth,halfDepth,halfOpening,spring,top,bottom=0){
      // The round cutout runs through the full depth, so the portal also
      // reads correctly when approached from the other courtyard.
      const c=colors.plaster,postWidth=halfWidth-halfOpening;
      for(const side of [-1,1]){
        const centre=u+side*(halfOpening+postWidth/2);
        box(centre,(bottom+top)/2,v,postWidth,top-bottom,2*halfDepth,c);
        if(bottom<1)barrier(centre,v,postWidth/2,halfDepth);
      }
      const curve=t=>[u+halfOpening*Math.cos(t),spring+halfOpening*Math.sin(t)];
      for(let j=0;j<10;j++){
        const a=curve(j*Math.PI/10),b=curve((j+1)*Math.PI/10);
        for(const side of [-1,1]){
          const z=v+side*halfDepth;
          face([a[0],a[1],z],[b[0],b[1],z],[b[0],top,z],[a[0],top,z],c);
        }
        face([a[0],a[1],v-halfDepth],[b[0],b[1],v-halfDepth],
          [b[0],b[1],v+halfDepth],[a[0],a[1],v+halfDepth],c);
      }
      box(u,top+.045,v,2*halfWidth,.09,2*halfDepth,c);
    }
    if(mainGate||sideGate){
      const lower=sideGate?3.08:4.40,aperture=sideGate?U*.63:U*.42;
      arch(0,0,U,V,aperture,lower-aperture-.40,lower,floor);
      box(0,lower+.12,0,U*2+.18,.19,V*2+.18,colors.ridge);
      if(sideGate)return {solids,height:lower+.24};
      // The upper storey has its own mapped outline. The bell suspended
      // there is 2.10 m high with a 0.99 m mouth (monument operator).
      const upper=site.get('w702185142').rings[0].slice(0,-1).map(p=>graph.point(...p));
      const au=upper.map(p=>(p.x-x)*ux+(p.z-z)*uz),av=upper.map(p=>(p.x-x)*vx+(p.z-z)*vz);
      const halfU=(Math.max(...au)-Math.min(...au))/2,halfV=(Math.max(...av)-Math.min(...av))/2;
      const u=(Math.max(...au)+Math.min(...au))/2,v=(Math.max(...av)+Math.min(...av))/2;
      const low=lower+.24,top=low+3.0;
      for(const sign of [-1,1]){
        for(let bay=-1;bay<=1;bay++)
          arch(u+bay*halfU*2/3,v+sign*(halfV-.10),halfU/3,.10,halfU*.22,low+1.74,top,low);
        box(u+sign*(halfU-.12),low+.38,v,.22,.76,2*halfV,colors.plaster);
      }
      const ih=survey.instrumentHeight,ir=survey.instrumentDiameter/2;
      solid('round',u,top-ih*.56,v,ir*.85,ih*.74,ir*.85,colors.bronze);
      solid('ellipsoid',u,top-ih*.18,v,ir*.85,ih*.18,ir*.85,colors.bronze);
      solid('round',u,top-ih*.95,v,ir,ih*.10,ir,colors.bronze);
      roofTier(halfU+.30,halfV+.30,top,.85,u,v);
      roofTier(halfU*.80,halfV*.80,top+.67,.66,u,v);
      return {solids,height:top+1.64};
    }
    roofTier(U,V,eave,rise);
    // Columns and tie beams keep the approach and sides of the structures open.
    const bays=survey.bays||(piers||drum||bell?1:5);
    const rows=hall?survey.columns/(bays+1):gate?3:2;
    const postU=U-Math.min(.60,U*.17),postV=V-Math.min(.48,V*.22);
    const rad=piers?.34:drum||bell?.30:hall?.20:gate?.16:.125;
    for(let j=0;j<rows;j++){
      const v=-postV+2*postV*j/(rows-1);
      box(0,eave-.15,v,2*postU+.18,.22,piers?.35:.19,colors.timber);
      for(let k=0;k<=bays;k++){
        const u=-postU+2*postU*k/bays,top=eave-.12;
        box(u,floor+.085,v,rad*2.65,.17,rad*2.65,colors.granite);
        if(piers)box(u,(floor+top)/2,v,rad*2,top-floor,rad*2,colors.plaster);
        else solid('round',u,(floor+top)/2,v,rad,top-floor,rad,gate?colors.lacquer:colors.timber);
        barrier(u,v,rad,rad);
        if(j===0)box(u,eave-.13,0,.17,.22,2*postV+.25,colors.timber);
      }
    }
    // Closed end gables frame the open bays of the hall and courtyard gates.
    if(hall||gate)for(const sign of [-1,1]){
      box(sign*postU,(floor+eave)/2,0,.20,eave-floor,postV*2,colors.plaster);
      barrier(sign*postU,0,.10,postV);
    }
    if(gate){
      if(survey.entranceSteps){
        const n=survey.entranceSteps;
        for(const sign of [-1,1])for(let k=1;k<n;k++){
          const y=floor*k/n;
          box(0,y/2,sign*(V+(n-k-.5)*.28),postU*2/bays,y,.29,colors.granite);
        }
      }
      if(survey.doors)for(let k=0;k<bays;k++){
        const u=-postU+(k+.5)*2*postU/bays;
        // Fold each pair of doors back along the centre column line. This keeps
        // the three documented openings clear while retaining the timber leaves.
        for(const side of [-1,1])box(u+side*(postU/bays-rad-.03),floor+1.03,
          -postU/bays*.5,.09,2.06,postU/bays,colors.wood);
      }
    }
    if(drum||bell){
      const h=survey.instrumentHeight,diameter=survey.instrumentDiameter;
      if(drum){
        // The maker's 2.65 m drum stands on a horizontal axis in a wood cradle.
        const centre=floor+diameter*.52+.55;
        for(const v of [-h*.32,h*.32]){
          box(0,floor+.37,v,diameter*.82,.73,.13,colors.wood);
          box(0,floor+.09,v,diameter*1.06,.18,.32,colors.timber);
        }
        const segments=24,circle=(a,r,v)=>[Math.cos(a)*r,centre+Math.sin(a)*r,v];
        for(let j=0;j<segments;j++){
          const a=2*Math.PI*j/segments,b=2*Math.PI*(j+1)/segments;
          for(const sign of [-1,1]){
            const end=sign*h/2,r=diameter*.5;
            face(circle(a,r,end),circle(b,r,end),circle(b,r*1.12,0),circle(a,r*1.12,0),colors.lacquer);
            for(const fraction of [.58,.88]){
              const v1=end*(fraction-.018),v2=end*(fraction+.018);
              const r1=r*(1.12-.12*(fraction-.018))+.012,r2=r*(1.12-.12*(fraction+.018))+.012;
              face(circle(a,r1,v1),circle(b,r1,v1),circle(b,r2,v2),circle(a,r2,v2),colors.timber);
            }
            for(const p of [[0,centre,end],circle(a,r,end),circle(b,r,end)])point(p,colors.hide);
          }
        }
      }else{
        const foot=floor+.65;
        solid('round',0,foot+h*.52,0,.68,h*.74,.68,colors.bronze);
        solid('ellipsoid',0,foot+h*.85,0,.68,h*.15,.68,colors.bronze);
        solid('round',0,foot+h*.09,0,.77,h*.18,.77,colors.bronze);
        box(0,foot+h+(eave-foot-h)*.5,0,.10,eave-foot-h,.10,colors.timber);
      }
      barrier(0,0,drum?diameter*.56:.77,drum?h*.50:.77);
    }
    function tablet(u,height,width,year){
      const photographed=year===1442,ru=width/2,rv=Math.min(.15,width*.14),base=floor+.33;
      const curve=photographed?height*.135:width*.28;
      // A turtle supports each tablet. Its head turns toward Thiên Quang well.
      solid('shell',u,floor+.17,0,ru*1.02,.22,width*.59,colors.granite);
      solid('shell',u,floor+.17,width*.59,ru*.30,.17,width*.27,colors.granite);
      for(const side of [-1,1])for(const end of [-1,1])
        solid('ellipsoid',u+side*ru*.79,floor+.08,end*width*.27,ru*.27,.09,width*.19,colors.granite);
      const profile=[[-ru,0],[ru,0]];
      for(let k=0;k<=10;k++){
        const a=k*Math.PI/10;
        profile.push([Math.cos(a)*ru,height-curve+curve*Math.sin(a)]);
      }
      const place=([a,b],d)=>[u+a,base+b,d];
      const mid=[0,height*.46];
      const inset=p=>[p[0]*.86,p[1]*.90+height*.045];
      for(let k=0;k<profile.length;k++){
        const a=profile[k],b=profile[(k+1)%profile.length];
        face(place(a,-rv),place(b,-rv),place(b,rv),place(a,rv),colors.granite);
        for(const p of [a,b,mid])point(place(p,-rv),colors.granite);
        if(photographed){
          // Only the 1442 stele uses Ngokhong's photograph. The sign keeps
          // the historic inscription legible from the actual viewing side.
          const right=ux*vz-uz*vx;
          for(const p of [a,b,mid])point(place(p,rv+.012),colors.granite,4,[.5+right*p[0]/width,p[1]/height]);
        }else{
          face(place(a,rv),place(b,rv),place(inset(b),rv+.012),place(inset(a),rv+.012),colors.border);
          for(const p of [inset(a),inset(b),mid])point(place(p,rv+.012),colors.granite);
        }
      }
      barrier(u,width*.09,ru,width*.66);
    }
    if(stele){
      const entries=survey.steleRows,usable=2*(U-apron);
      const gap=(usable-entries.reduce((sum,entry)=>sum+entry.width,0))/entries.length;
      let end=-usable/2+gap/2;
      entries.forEach(({year,height,width})=>{
        const u=end+width/2;
        tablet(u,height,width,year);
        stelae.push({x:x+ux*u,z:z+uz*u,year,height,width,viewAngle:Math.atan2(vx,vz)});
        end+=width+gap;
      });
    }
    return {solids,stelae,height:eave+rise+.35};
  };
}

function createTourDistrict(T,scene,plaster,structures,osmBuildings,nightLights){
  const parts=createVietnamOsmBuildings('sight-building-parts/',Infinity);
  const wall=plaster.clone();wall.vertexColors=true;wall.side=T.DoubleSide;
  const roof=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.9});
  const grain={value:null},stelePhoto={value:null},photoReady={value:0};
  function loadMonumentSurfaces(){
    if(grain.value||typeof document==='undefined')return;
    const loader=new T.TextureLoader();
    grain.value=(typeof landmarkGrain!=='undefined'&&landmarkGrain)||loader.load('streetscape/surfaces/landmark-grain.webp');
    grain.value.wrapS=grain.value.wrapT=T.RepeatWrapping;grain.value.anisotropy=4;
    stelePhoto.value=loader.load('landmark-scans/van-mieu-1442-face.webp',()=>{photoReady.value=1;});
    stelePhoto.value.colorSpace=T.SRGBColorSpace;stelePhoto.value.anisotropy=4;
  }
  roof.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,{monumentGrain:grain,stelePhoto,photoReady});
    const vary='varying vec2 visitorRoofUv; varying float visitorRoofFinish;\n';
    shader.vertexShader=vary+'attribute float roofFinish;\n'+shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n visitorRoofUv=uv;visitorRoofFinish=roofFinish;');
    shader.fragmentShader=vary+'uniform sampler2D monumentGrain,stelePhoto; uniform float photoReady;\n'+
      shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float naturalRelief=0.;
      if(visitorRoofFinish>2.5){
        vec2 metres=visitorRoofUv;
        vec3 grain=texture2D(monumentGrain,metres*.56).rgb-.5;
        if(abs(visitorRoofFinish-4.)<.25 && photoReady>.5){
          diffuseColor.rgb=texture2D(stelePhoto,visitorRoofUv).rgb;
        }else if(visitorRoofFinish<4.5){
          float mineral=grain.g+.32*(texture2D(monumentGrain,metres*2.3).g-.5);
          float weather=texture2D(monumentGrain,metres*.21+vec2(.16,.61)).r-.5;
          diffuseColor.rgb*=vec3(1.+.66*mineral+.29*weather);
          diffuseColor.rgb*=mix(vec3(1.),vec3(.79,.85,.72),smoothstep(-.05,.24,weather)*.52);
          naturalRelief=.004*mineral;
        }else if(visitorRoofFinish<5.5){
          diffuseColor.rgb*=1.+.50*grain.b;naturalRelief=.002*grain.b;
        }else{
          float deposit=texture2D(monumentGrain,metres*vec2(.34,.16)).r-.5;
          diffuseColor.rgb*=vec3(1.+.41*grain.r+.24*deposit);
          naturalRelief=.0035*grain.r;
        }
      }else if(visitorRoofFinish>.5){
        vec2 tile=visitorRoofUv*vec2(5.8,3.6);
        vec2 aa=max(vec2(.001),fwidth(tile));float fade=1.-smoothstep(.14,.8,max(aa.x,aa.y));
        float crest=.5+.5*cos(tile.x*6.283);
        float lip=smoothstep(.71,.95,fract(tile.y));
        if(visitorRoofFinish>1.5)lip=0.;
        diffuseColor.rgb*=1.+fade*(.24*(crest-.5)-.16*lip);
      }`).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        if(visitorRoofFinish>2.5 && abs(visitorRoofFinish-4.)>.25){
          vec3 dx=dFdx(-vViewPosition),dy=dFdy(-vViewPosition);
          vec3 across=cross(dy,normal),along=cross(normal,dx);
          float area=dot(dx,across);
          normal=normalize(normal-sign(area)*(across*dFdx(naturalRelief)+along*dFdy(naturalRelief))/max(abs(area),1.e-9));
        }`);
  };
  // Window bays follow the measured edge length and the floor count. Shade them
  // in the wall pass, so a dense city block costs the same two draws on a phone.
  wall.onBeforeCompile=shader=>{
    shader.uniforms.nightLights=nightLights;
    shader.vertexShader='attribute vec2 bays; attribute float openingStyle; varying float opening; varying vec2 vBays;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n vBays=bays;opening=openingStyle;');
    shader.fragmentShader='uniform float nightLights; varying float opening; varying vec2 vBays;\n'+shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
      vec3 roomLight=vec3(0.);
      if(opening<.5)diffuseColor.rgb=mix(vec3(.72),diffuseColor.rgb,.59);
      if(vBays.x>=0.){
        vec2 p=fract(vBays),aa=clamp(fwidth(vBays),vec2(.008),vec2(.18));
        vec2 pane=smoothstep(vec2(.2,.25)-aa,vec2(.2,.25)+aa,p)*(1.-smoothstep(vec2(.8,.78)-aa,vec2(.8,.78)+aa,p));
        float frame=1.-smoothstep(.013,.013+aa.x,abs(p.x-.5));
        float reveal=smoothstep(.20,.26,p.x)*(1.-smoothstep(.69,.78,p.y));
        float light=.77+.22*sin(dot(floor(vBays),vec2(7.2,3.9)));
        vec3 glazing=mix(vec3(.056,.084,.088),vec3(.25,.36,.38),p.y)*light;
        if(opening>.5 && opening<1.5){
          float bars=1.-smoothstep(.04,.12+aa.x,abs(fract(p.x*5.)-.5));
          float rails=1.-smoothstep(.045,.13+aa.y,abs(fract(p.y*4.)-.5));
          glazing=mix(vec3(.063,.05,.035),vec3(.24,.125,.068),max(bars,rails));frame=0.;
        }else if(opening>1.5){
          float side=(p.x-.5)/.3;
          float arch=opening>2.5?sqrt(max(0.,1.-side*side)):1.-abs(side);
          pane.y*=1.-smoothstep(.55+arch*.23-aa.y,.55+arch*.23+aa.y,p.y);
        }
        float openingMask=pane.x*pane.y;
        float sill=smoothstep(.17,.20,p.x)*(1.-smoothstep(.80,.83,p.x));
        sill*=smoothstep(.19-aa.y,.22,p.y)*(1.-smoothstep(.227,.25+aa.y,p.y));
        diffuseColor.rgb*=1.-.24*sill;
        diffuseColor.rgb=mix(diffuseColor.rgb,mix(glazing*(.67+.33*reveal),vec3(.18,.17,.15),frame),openingMask);
        if(opening<.5){
          float room=fract(sin(dot(floor(vBays),vec2(17.3,41.7))+opening*230.)*4375.5);
          roomLight=mix(vec3(.48,.19,.059),vec3(.62,.47,.29),room)
                    *nightLights*smoothstep(.55,.64,room)*openingMask*reveal*(1.-.9*frame);
        }
      }`).replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n totalEmissiveRadiance+=roomLight;');
  };
  const palette=[0xf3e1c6,0xd3d9cc,0xe9d0bb,0xf0d9a7,0xb9c6c9,0xeae6db].map(v=>new T.Color(v));
  const roofs=[0x9f6757,0xa09a8e,0x798d92,0xaca69c].map(v=>new T.Color(v));
  const concrete=new T.Color(0x989186);
  const doorway=new T.Color(0x354647);
  let vanMieuArchitecture;
  // Each material has one draw. Reuse its CPU buffer as the view moves, and
  // hand WebGL only the populated vertices when the new district is complete.
  let indexPromise,available,grid,scale=100000,loadedGraph,signature,loaded=[],serial=0;
  const cache=new Map(),footprints=new WeakMap(),cell=32;
  async function load(graph,x,z){
    const seq=++serial;
    try{
      indexPromise??=fetch('tour-buildings/index.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();})
        .then(data=>{available=new Set(data.tiles);grid=data.grid;scale=data.scale;}).catch(e=>{indexPromise=null;throw e;});
      await indexPromise;
      const [lon,lat]=graph.geo(x,z),keys=[],reach=1100;
      for(let i=Math.floor((lon-reach/graph.mx)*grid);i<=Math.floor((lon+reach/graph.mx)*grid);i++)
        for(let j=Math.floor((lat-reach/graph.my)*grid);j<=Math.floor((lat+reach/graph.my)*grid);j++){
          const key=i+'_'+j;if(available.has(key))keys.push(key);
        }
      const next=keys.join('/');if(graph===loadedGraph&&next===signature)return false;
      const data=await Promise.all(keys.map(k=>{
        if(!cache.has(k))cache.set(k,fetchMapTile('tour-buildings/'+k+'.gz').catch(e=>{cache.delete(k);throw e;}));
        return cache.get(k);
      }));
      if(seq!==serial)return false;
      for(const k of cache.keys())if(!keys.includes(k))cache.delete(k);
      loaded=data.flat();loadedGraph=graph;signature=next;return true;
    }catch{return false;}
  }
  function decode(raw,graph){
    let lon=0,lat=0;
    const ring=[];
    for(let i=0;i<raw.length;i+=2){lon+=raw[i];lat+=raw[i+1];const p=graph.point(lon/scale,lat/scale);ring.push(new T.Vector2(p.x,p.z));}
    if(ring.length>1&&ring[0].equals(ring.at(-1)))ring.pop();
    return ring;
  }
  function projectFootprint(raw,graph,projected,survey){
    const key=survey?.rings||raw,known=projected.get(key);if(known)return known;
    const rings=survey?survey.rings.map(ring=>ring.slice(0,-1).map(([lon,lat])=>{
      const p=graph.point(lon,lat);return new T.Vector2(p.x,p.z);
    })):raw.map(r=>decode(r,graph)).filter(r=>r.length>=3);
    if(!rings.length)return null;
    let minX=Infinity,minZ=Infinity,maxX=-Infinity,maxZ=-Infinity;
    for(const p of rings[0]){minX=Math.min(minX,p.x);minZ=Math.min(minZ,p.y);maxX=Math.max(maxX,p.x);maxZ=Math.max(maxZ,p.y);}
    const shape={rings,box:{minX,minZ,maxX,maxZ},flat:rings.flat()};
    projected.set(key,shape);
    return shape;
  }
  function createView(parent){
  const group=new T.Group();group.name='OSM building footprints';parent.add(group);
  const batches=[wall,roof].map(mat=>({mat,stride:mat===wall?14:12,data:new Float32Array(0),used:0,curved:[]}));
  const cells=new Map(),blocks=new Map(),streetFronts=[];
  function contact(x,z,r){
    let hit;
    for(const b of cells.get(Math.floor(x/cell)+','+Math.floor(z/cell))||[]){
      if(b.bottom>2.2)continue;
      if(x<b.minX-r||z<b.minZ-r||x>b.maxX+r||z>b.maxZ+r)continue;
      for(const rings of b.solids||[b.rings]){
        let inside=false,min=Infinity,px,pz;
        for(const ring of rings){
          for(let j=0,k=ring.length-1;j<ring.length;k=j++){
            const a=ring[k],c=ring[j],dx=c.x-a.x,dz=c.y-a.y;
            if((a.y>z)!==(c.y>z)&&x<a.x+(z-a.y)*dx/dz)inside=!inside;
            const f=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.y)*dz)/(dx*dx+dz*dz||1)));
            const xx=a.x+f*dx,zz=a.y+f*dz,d=(x-xx)**2+(z-zz)**2;
            if(d<min){min=d;px=xx;pz=zz;}
          }
        }
        const d=Math.sqrt(min),depth=r+(inside?d:-d);
        if(depth<=0||hit&&hit.depth>=depth)continue;
        const dir=inside?-1:1;
        hit={nx:d?dir*(x-px)/d:1,nz:d?dir*(z-pz)/d:0,depth,pointX:px,pointZ:pz,height:b.h,kind:'building',id:b.id};
      }
    }
    return hit;
  }
  function insideRing(x,z,ring){
    let inside=false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++){
      const a=ring[i],b=ring[j];
      if((a.y>z)!==(b.y>z)&&x<(b.x-a.x)*(z-a.y)/(b.y-a.y)+a.x)inside=!inside;
    }
    return inside;
  }
  function insideBuilding(x,z,rings){
    if(!insideRing(x,z,rings[0]))return false;
    for(let i=1;i<rings.length;i++)if(insideRing(x,z,rings[i]))return false;
    return true;
  }
  function overlapsModel(landmarks,rings,box){
    if(!landmarks)return false;
    for(const {ring:area,bounds} of landmarks.buildingAreas){
      if(box.maxX<bounds.min.x||box.minX>bounds.max.x||box.maxZ<bounds.min.y||box.minZ>bounds.max.y)continue;
      if(insideRing(rings[0][0].x,rings[0][0].y,area)||insideBuilding(area[0].x,area[0].y,rings))return true;
      for(const ring of rings)for(let i=0,j=ring.length-1;i<ring.length;j=i++){
        const a=ring[j],b=ring[i],dx=b.x-a.x,dz=b.y-a.y;
        for(let k=0,l=area.length-1;k<area.length;l=k++){
          const p=area[l],q=area[k],ex=q.x-p.x,ez=q.y-p.y,det=dx*ez-dz*ex;
          if(Math.abs(det)<1e-8)continue;
          const px=p.x-a.x,pz=p.y-a.y,t=(px*ez-pz*ex)/det,u=(px*dz-pz*dx)/det;
          if(t>=0&&t<=1&&u>=0&&u<=1)return true;
        }
      }
    }
    return false;
  }
  function overlapsGarden(landmarks,rings,box){
    for(const {x,z,r} of landmarks?.gardens||[]){
      if(x+r<box.minX||x-r>box.maxX||z+r<box.minZ||z-r>box.maxZ)continue;
      if(insideBuilding(x,z,rings))return true;
      for(const ring of rings)for(let i=0,j=ring.length-1;i<ring.length;j=i++){
        const a=ring[j],b=ring[i],dx=b.x-a.x,dz=b.y-a.y;
        const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.y)*dz)/(dx*dx+dz*dz||1)));
        if((a.x+t*dx-x)**2+(a.y+t*dz-z)**2<=r*r)return true;
      }
    }
    return false;
  }
  function overlapsMapped(rings,box){
    const seen=new Set();
    for(let i=Math.floor(box.minX/cell);i<=Math.floor(box.maxX/cell);i++){
      for(let j=Math.floor(box.minZ/cell);j<=Math.floor(box.maxZ/cell);j++){
        for(const b of cells.get(i+','+j)||[]){
          if(!b.surveyed||seen.has(b))continue;
          seen.add(b);
          const left=Math.max(box.minX,b.minX),right=Math.min(box.maxX,b.maxX);
          const top=Math.max(box.minZ,b.minZ),bottom=Math.min(box.maxZ,b.maxZ);
          if(right-left<.6||bottom-top<.6)continue;
          const area=Math.min((box.maxX-box.minX)*(box.maxZ-box.minZ),(b.maxX-b.minX)*(b.maxZ-b.minZ));
          if((right-left)*(bottom-top)<area*.18)continue;
          let same=0;
          for(const u of [.2,.5,.8])for(const v of [.2,.5,.8]){
            const x=left+(right-left)*u,z=top+(bottom-top)*v;
            if(insideBuilding(x,z,rings)&&insideBuilding(x,z,b.rings))same++;
          }
          if(same>=3)return true;
        }
      }
    }
    return false;
  }
  function clear(){
    for(const mesh of [...group.children]){group.remove(mesh);mesh.geometry.dispose();}
    cells.clear();blocks.clear();streetFronts.length=0;
  }
  function* buildSteps(graph,cx,cz,landmarks,ground=()=>0,edges=[],openGround=()=>false,radius=620,terrainRevision,memorialAt=()=>false){
    clear();if(!graph)return;
    const pieces=parts.rows(graph,cx,cz);
    const replaced=new Set(pieces.flatMap(row=>[row[6]?.parent,row[6]?.sourceId]).filter(Boolean));
    const shells=[...(graph===loadedGraph?loaded:[]),...osmBuildings.rows(graph,cx,cz)];
    const surveyed=[...pieces,...shells.filter(row=>!replaced.has(row[0]))];
    const monument=window.VanMieuSurvey;
    if(monument?.byRef){
      const anchor=graph.point(...monument.origin);
      if(Math.hypot(anchor.x-cx,anchor.z-cz)<radius+400){
        const mapped=new Set(surveyed.map(row=>row[0]));
        // Some independently mapped gates have no building tag in the national
        // tile. Use the original geometry for the architectural survey itself.
        for(const f of monument.features){
          if(mapped.has(f.ref)||(!f.steleRows&&!vanMieuArchitectureRefs.has(f.ref)))continue;
          const [lon,lat]=f.rings[0][0];
          surveyed.push([f.ref,'temple',0,0,[[Math.round(lon*scale),Math.round(lat*scale)]],'']);
        }
      }
    }
    const extra=structures.rows(graph,cx,cz);
    // Satellite outlines can be displaced onto a carriageway. Only index the
    // road segments close enough to test a footprint in this view.
    const roadCells=new Map(),roadCell=48;
    let roadSegments=0;
    for(const edge of edges)for(let n=1;n<edge.points.length;n++){
      if((++roadSegments&63)===0)yield;
      const a=edge.points[n-1],b=edge.points[n],w=worldRoadHalfWidth(edge),dx=b.x-a.x,dz=b.z-a.z;
      const segment={a,dx,dz,length2:dx*dx+dz*dz,w};
      const margin=w+18;
      const left=Math.max(cx-850,Math.min(a.x,b.x)-margin),right=Math.min(cx+850,Math.max(a.x,b.x)+margin);
      const top=Math.max(cz-850,Math.min(a.z,b.z)-margin),bottom=Math.min(cz+850,Math.max(a.z,b.z)+margin);
      for(let i=Math.floor(left/roadCell);i<=Math.floor(right/roadCell);i++)for(let j=Math.floor(top/roadCell);j<=Math.floor(bottom/roadCell);j++){
        const key=i+','+j;if(!roadCells.has(key))roadCells.set(key,[]);
        roadCells.get(key).push(segment);
      }
    }
    function obstructsRoad(rings,box,x,z){
      const seen=new Set();
      for(let i=Math.floor(box.minX/roadCell);i<=Math.floor(box.maxX/roadCell);i++){
        for(let j=Math.floor(box.minZ/roadCell);j<=Math.floor(box.maxZ/roadCell);j++){
          for(const s of roadCells.get(i+','+j)||[]){
            if(seen.has(s)||!s.length2)continue;
            seen.add(s);
            const t=Math.max(0,Math.min(1,((x-s.a.x)*s.dx+(z-s.a.z)*s.dz)/s.length2));
            const px=s.a.x+t*s.dx,pz=s.a.z+t*s.dz;
            const len=Math.sqrt(s.length2);
            for(const offset of [0,-s.w*.65,s.w*.65]){
              if(insideBuilding(px-offset*s.dz/len,pz+offset*s.dx/len,rings))return true;
            }
          }
        }
      }
      return false;
    }
    for(const b of batches){
      if(b.used < b.data.length/4)b.data=new Float32Array(b.used);
      b.used=0;b.curved.length=0;
    }
    let baseY=0,opening=0,facadeSeed=0;
    function vertex(b,x,y,z,u,v,tint,finish=0,bay=-1,floor=0,normal){
      const i=b.used;
      if(i+b.stride>b.data.length){
        const next=new Float32Array(Math.max(b.stride*256,b.data.length*2));
        next.set(b.data);b.data=next;
      }
      const data=b.data;
      data[i]=x-cx;data[i+1]=baseY+y;data[i+2]=z-cz;
      // The normal pass fills planar sections after the geometry is complete.
      if(normal){
        data[i+3]=normal[0];data[i+4]=normal[1];data[i+5]=normal[2];
        const run=b.curved.at(-1);
        if(run&&run[1]===i)run[1]+=b.stride;
        else b.curved.push([i,i+b.stride]);
      }
      data[i+6]=u;data[i+7]=v;
      data[i+8]=tint.r;data[i+9]=tint.g;data[i+10]=tint.b;
      if(b.mat===wall){
        data[i+11]=opening+facadeSeed;data[i+12]=bay;data[i+13]=floor;
      }else data[i+11]=finish;
      b.used+=b.stride;
    }
    function quad(b,a,c,lo,hi,tint,count,floors){
      const u=a.distanceTo(c)/5,lowFloor=Math.max(0,lo)/hi*floors;
      const left=count?0:-1,right=count||-1;
      vertex(b,a.x,lo,a.y,0,lo/4,tint,0,left,lowFloor);
      vertex(b,c.x,lo,c.y,u,lo/4,tint,0,right,lowFloor);
      vertex(b,a.x,hi,a.y,0,hi/4,tint,0,left,floors);
      vertex(b,c.x,lo,c.y,u,lo/4,tint,0,right,lowFloor);
      vertex(b,c.x,hi,c.y,u,hi/4,tint,0,right,floors);
      vertex(b,a.x,hi,a.y,0,hi/4,tint,0,left,floors);
    }
    // Fit a shaded doorway to the street-facing wall of a narrow low-rise.
    // The outline and height are mapped; the shutter and canopy are scenery.
    function streetFront(outer,h,tint,seed,zone){
      let best=null,bestGap=18;
      for(let i=0;i<outer.length;i++){
        const a=outer[i],b=outer[(i+1)%outer.length],dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz);
        if(len<2.5||len>15)continue;
        const x=(a.x+b.x)/2,z=(a.y+b.y)/2;
        for(const s of roadCells.get(Math.floor(x/roadCell)+','+Math.floor(z/roadCell))||[]){
          if(!s.length2)continue;
          const t=Math.max(0,Math.min(1,((x-s.a.x)*s.dx+(z-s.a.z)*s.dz)/s.length2));
          const rx=s.a.x+t*s.dx-x,rz=s.a.z+t*s.dz-z,dist=Math.hypot(rx,rz),gap=dist-s.w;
          if(gap<1.1||gap>=bestGap||Math.abs(dx*rx+dz*rz)>.45*len*dist)continue;
          let nx=-dz/len,nz=dx/len;
          if(nx*rx+nz*rz<0){nx=-nx;nz=-nz;}
          if(insideRing(x+nx*.2,z+nz*.2,outer))continue;
          best={x,z,nx,nz,ux:dx/len,uz:dz/len,half:Math.min(len*.43,3.2)};bestGap=gap;
        }
      }
      if(!best)return;
      const {x,z,nx,nz,ux,uz,half}=best,top=Math.min(2.8,h*.77);
      const panel=(lo,hi,back,front,col,left=-half,right=half)=>{
        for(const [u,y,d] of [[left,lo,back],[right,lo,back],[right,hi,front],[left,lo,back],[right,hi,front],[left,hi,front]])
          vertex(batches[1],x+ux*u+nx*d,y,z+uz*u+nz*d,0,0,col);
      };
      if(seed%3===0){
        panel(.12,top,.06,.06,concrete);
        for(let y=.25;y<top;y+=.22)panel(y,y+.028,.075,.075,tint);
      }else{
        panel(.12,top,.06,.06,doorway);
        for(let u=-half+.4;u<half-.1;u+=1.3)panel(.12,top,.08,.08,concrete,u,u+.055);
        panel(top*.78,top*.78+.065,.08,.08,concrete);
      }
      panel(top+.22,top,.07,.84,tint);
      if(h>=6.4&&seed%4!==0){
        panel(3.25,3.25,.06,.90,concrete);panel(3.13,3.25,.90,.90,concrete);
        panel(3.28,3.60,.87,.87,concrete);panel(4.09,4.15,.87,.87,tint);
        for(const u of [-half,0,half-.055])panel(3.55,4.12,.87,.87,tint,u,u+.055);
      }
      if(zone)streetFronts.push({x:x-cx,y:baseY,z:z-cz,nx,nz,ux,uz,half,top,h,seed,zone});
    }
    const ids=new Set(),surveyedIds=new Set(surveyed.map(row=>row[0]));
    if(!footprints.has(graph))footprints.set(graph,new WeakMap());
    const projected=footprints.get(graph);
    const [lon,lat]=graph.geo(cx,cz);
    const pins=VietnamTourism.nearby(lon,lat,720/graph.mx,720/graph.my)
      .filter(p=>p.id.startsWith('osm-node-')&&p.kind==='Công trình tín ngưỡng')
      .map(site=>({...graph.point(site.lon,site.lat),site}));
    let rowIndex=0;
    for(const [id,kind,tagH,levels,raw,shape,part] of [...surveyed,...extra]){
      if((rowIndex++ & 3)===0)yield;
      if(ids.has(id)||landmarks?.modeledBuildings.has(id))continue;
      const first=graph.point(raw[0][0]/scale,raw[0][1]/scale);
      if(Math.abs(first.x-cx)>850||Math.abs(first.z-cz)>850)continue;
      const survey=monument?.byRef?.get(id);
      // The upper gate storey is already drawn on this mapped outline by
      // the native main gate. A future national building tile may include it.
      if(survey&&id==='w702185142'&&surveyedIds.has('w702185143'))continue;
      const outline=projectFootprint(raw,graph,projected,survey);if(!outline)continue;
      const {rings,box,flat}=outline,outer=rings[0],{minX,minZ,maxX,maxZ}=box;
      const x=(minX+maxX)/2,z=(minZ+maxZ)/2;
      if(Math.hypot(x-cx,z-cz)>radius+Math.hypot(maxX-minX,maxZ-minZ)/2)continue;
      const original=surveyedIds.has(id);
      if(overlapsModel(landmarks,rings,box))continue;
      const visitorArea=overlapsGarden(landmarks,rings,box)||memorialAt(x,z);
      if(!original){
        if(visitorArea||outer.some(p=>openGround(p.x,p.y))||(openGround(x,z)&&insideBuilding(x,z,rings)))continue;
        if(overlapsMapped(rings,box)||obstructsRoad(rings,box,x,z))continue;
      }
      ids.add(id);
      // Keep floors level, and seat the plinth against the terrain around the
      // entire footprint, including courtyard edges and long downhill walls.
      if(terrainRevision===undefined||outline.terrainRevision!==terrainRevision){
        let foundation=ground(x,z);
        outline.profiles=rings.map(ring=>ring.map((a,j)=>{
          const c=ring[(j+1)%ring.length],steps=Math.max(1,Math.ceil(a.distanceTo(c)/12)),samples=[];
          for(let k=0;k<steps;k++){
            const t=k/steps,px=a.x+(c.x-a.x)*t,pz=a.y+(c.y-a.y)*t,h=ground(px,pz);
            foundation=Math.max(foundation,h);samples.push({x:px,z:pz,h});
          }
          return samples;
        }));
        outline.foundation=foundation;outline.terrainRevision=terrainRevision;
      }
      baseY=outline.foundation+(survey?.platformHeight||0);
      const profiles=outline.profiles;
      let seed=0;for(let i=0;i<id.length;i++)seed=(Math.imul(seed,31)+id.charCodeAt(i))>>>0;
      const warehouse=/warehouse|industrial|shed|garage|roof|barn/.test(kind);
      facadeSeed=(seed%997)/2493;
      const ref='osm-'+(id[0]==='w'?'way':'relation')+'-'+id.slice(1).split(':')[0];
      const pin=original&&pins.find(p=>p.x>=minX&&p.x<=maxX&&p.z>=minZ&&p.z<=maxZ&&insideBuilding(p.x,p.z,rings));
      const site=original&&(VietnamTourism.byId.get(ref)||pin?.site);
      const tagged=original&&(window.VietnamSightDetails?.[ref]||window.VietnamSightDetails?.[pin?.site.id]);
      const historicRoof=survey?.kind==='steleHouse'||survey?.kind==='stelePavilion'||survey?.kind==='wing'||
        ['w702185144','w702185176','w702185189','w702241326'].includes(id);
      let detail=part?{...tagged,...part}:tagged;
      if(historicRoof)detail={...detail,building:'temple','roof:material':'roof_tiles'};
      if(survey?.roofColour)detail={...detail,'roof:colour':survey.roofColour};
      const use=detail?.building||kind,faith=detail?.religion;
      const label=site?.name||'';
      opening=use==='temple'||['buddhist','vietnamese_folk','chinese_folk','Phật_Giáo'].includes(faith)||/^(chùa|đền|đình|miếu)\s/iu.test(label)?1:
        /church|cathedral|chapel/.test(use)||faith==='christian'||/^nhà thờ\s/iu.test(label)?2:use==='mosque'||faith==='muslim'?3:0;
      // A mapped outline establishes that a building exists. In visitor grounds
      // an unclassified outline is insufficient evidence for a house or a shop.
      const unclassified=visitorArea&&!opening&&!part&&(use==='yes'||use==='building');
      const bottom=part?.min_height||part?.['building:min_level']*3.3||0;
      const rise=parseFloat(detail?.['roof:height'])||detail?.['roof:levels']*3.3;
      const fallbackHeight=warehouse?5.4:3.7+(unclassified?0:seed%3*3);
      const h=Math.min(850,Math.max(bottom+.3,2,tagH||parseFloat(detail?.height)||(levels&&levels*3.3+(part&&rise||0))||structures.heightAt(graph,x,z)||fallbackHeight));
      const b={id,h,bottom,baseY,parent:part?.parent,rings,...box,surveyed:original};
      const block=Math.floor(x/70)+','+Math.floor(z/70);blocks.set(block,(blocks.get(block)||0)+1);
      for(let i=Math.floor((minX-12)/cell);i<=Math.floor((maxX+12)/cell);i++)for(let j=Math.floor((minZ-12)/cell);j<=Math.floor((maxZ+12)/cell);j++){
        const key=i+','+j;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(b);
      }
      if(survey&&(survey.steleRows||vanMieuArchitectureRefs.has(id))){
        loadMonumentSurfaces();
        vanMieuArchitecture??=createVanMieuArchitecture(T);
        const built=vanMieuArchitecture(survey,outer,graph,(px,py,pz,u,v,tint,finish,normal)=>
          vertex(batches[1],px,py,pz,u,v,tint,finish,-1,0,normal));
        b.h=built.height;b.solids=built.solids;b.stelae=built.stelae;continue;
      }
      const [bLon,bLat]=graph.geo(x,z),zone=window.CentralStreetscapes?.zoneAt(bLon,bLat);
      const zWalls=zone?zone.walls:null,zRoofs=zone?zone.roofs:null;
      const roofColor=detail?.['roof:colour']?new T.Color(detail['roof:colour']):zRoofs?new T.Color(zRoofs[opening===1?0:seed%zRoofs.length]):roofs[opening===1?0:seed%roofs.length];
      const base=detail?.['building:colour']?new T.Color(detail['building:colour']):detail?.['building:material']==='wood'?new T.Color(0x99765a):zWalls?new T.Color(zWalls[seed%zWalls.length]):palette[seed%palette.length];
      if(!part&&!opening&&!unclassified&&Math.hypot(x-cx,z-cz)<185&&h>=3&&h<17&&maxX-minX<32&&maxZ-minZ<32&&
        /^(yes|residential|house|terrace|apartments|retail|commercial|building)$/.test(kind))streetFront(outer,h,roofColor,seed,zone);
      let eave=h;
      const lowRiseRoof=!part&&!unclassified&&h<(zone?.forcePitched?10.5:7.2)&&(warehouse||zone?.forcePitched||seed%5<2)?'gabled':null;
      const roofShape=shape||detail?.['roof:shape']||(opening===1?'hipped':opening===2?'gabled':lowRiseRoof);
      const pitched=['hipped','gabled','pyramidal','hipped-and-gabled','side_hipped','round','skillion','onion','dome','saltbox','mansard'].includes(roofShape);
      const visitorRoof=original&&(site||opening||part||shape)&&pitched&&buildVisitorRoof(T,rings,roofShape,h,
        rise,roofColor,base,([px,py,pz],[u,v],tint,tiles)=>{
          const finish=tiles&&(/metal/.test(detail?.['roof:material'])?2:opening===1||detail?.['roof:material']==='roof_tiles'?1:0);
          vertex(batches[1],px,py,pz,u,v,tint,Number(finish));
        },opening===1,detail,bottom);
      if(visitorRoof){
        eave=visitorRoof;
      }else if(rings.length===1&&outer.length===4&&pitched){
        const start=outer[0].distanceTo(outer[1])>=outer[1].distanceTo(outer[2])?0:1;
        const [a,c,d,f]=Array.from({length:4},(_,i)=>outer[(start+i)%4]);
        eave=h-Math.min(h*.25,3,a.distanceTo(f)*.25);
        const l=a.clone().lerp(f,.5),r=c.clone().lerp(d,.5);
        const inset=roofShape==='gabled'?0:roofShape==='pyramidal'?.5:.2;
        const highL=l.clone().lerp(r,inset),highR=r.clone().lerp(l,inset);
        for(const tri of [[a,c,highR],[a,highR,highL],[f,highL,highR],[f,highR,d],[f,a,highL],[c,d,highR]]){
          for(const p of tri)vertex(batches[1],p.x,p===highL||p===highR?h:eave,p.y,0,0,roofColor);
        }
      }else{
        outline.triangles??=T.ShapeUtils.triangulateShape(outer,rings.slice(1));
        for(const tri of outline.triangles)for(const index of [tri[0],tri[2],tri[1]]){
          const p=flat[index];vertex(batches[1],p.x,h,p.y,0,0,roofColor);
        }
      }
      if(bottom>0){
        outline.triangles??=T.ShapeUtils.triangulateShape(outer,rings.slice(1));
        for(const tri of outline.triangles)for(const k of tri){
          const p=flat[k];vertex(batches[1],p.x,bottom,p.y,0,0,concrete);
        }
      }
      if(use==='roof'){
        // A mapped roof covers open ground. Only its supports obstruct the car.
        b.solids=[];
        const fascia=bottom>0?Math.max(bottom,eave-.22):eave-.22;
        for(const ring of rings)for(let j=0;j<ring.length;j++){
          const a=ring[j],c=ring[(j+1)%ring.length];
          quad(batches[0],a,c,fascia,eave,roofColor,0,0);
          if(bottom>0)continue;
          const spans=Math.max(1,Math.ceil(a.distanceTo(c)/12));
          for(let k=0;k<spans;k++){
            const p=a.clone().lerp(c,k/spans),r=.16;
            const post=[[-r,-r],[r,-r],[r,r],[-r,r]].map(([u,v])=>new T.Vector2(p.x+u,p.y+v));
            const foot=ground(p.x,p.y)-baseY-.22;
            for(let n=0;n<4;n++)quad(batches[0],post[n],post[(n+1)%4],foot,eave,concrete,0,0);
            b.solids.push([post]);
          }
        }
        continue;
      }
      for(let ri=0;ri<rings.length;ri++)for(let j=0;j<rings[ri].length;j++){
        const ring=rings[ri],profile=profiles[ri];
        const a=ring[j],c=ring[(j+1)%ring.length],length=a.distanceTo(c);
        if(length<.2)continue;
        const count=warehouse||unclassified?0:Math.floor(length/(opening?3.8:2.85)),floors=opening?Math.max(1,levels||1):Math.max(1,Math.round(h/3.3));
        const samples=profile[j],next=profile[(j+1)%ring.length][0],wallBatch=batches[0];
        if(bottom>0){quad(wallBatch,a,c,bottom,Math.max(bottom,eave),base,count,floors);continue;}
        // On nearly level blocks the wall itself can reach beneath the grass.
        if(samples.every(p=>baseY-p.h<.16)&&baseY-next.h<.16){
          quad(wallBatch,a,c,-.39,eave,base,count,floors);continue;
        }
        quad(wallBatch,a,c,0,eave,base,count,floors);
        for(let k=0;k<samples.length;k++){
          const l=samples[k],r=samples[k+1]||profile[(j+1)%ring.length][0];
          // The grass mesh sits 17 cm below the nominal ground.
          const lowL=l.h-baseY-.22,lowR=r.h-baseY-.22;
          for(const [p,y] of [[l,lowL],[r,lowR],[l,0],[r,lowR],[r,0],[l,0]]){
            vertex(wallBatch,p.x,y,p.z,Math.hypot(p.x-a.x,p.z-a.y)/5,y/4,concrete);
          }
        }
      }
    }
    for(const b of batches){
      if(!b.used)continue;
      const data=b.data.subarray(0,b.used);
      let run=0;
      const writePlanar=(start,end)=>{
        if(start>=end)return;
        const chunk=data.subarray(start,end);writeFlatNormals(chunk,chunk,b.stride,3);
      };
      for(let start=0;start<data.length;start+=b.stride*1536){
        const end=Math.min(data.length,start+b.stride*1536);
        let cursor=start;
        while(run<b.curved.length&&b.curved[run][0]<end){
          const [lo,hi]=b.curved[run];writePlanar(cursor,lo);cursor=hi;
          if(hi>end)break;
          run++;
        }
        writePlanar(cursor,end);yield;
      }
      const buffer=new T.InterleavedBuffer(data,b.stride),g=new T.BufferGeometry();
      const attribute=(size,offset)=>new T.InterleavedBufferAttribute(buffer,size,offset);
      g.setAttribute('position',attribute(3,0));g.setAttribute('normal',attribute(3,3));
      g.setAttribute('uv',attribute(2,6));g.setAttribute('color',attribute(3,8));
      g.setAttribute(b.mat===wall?'openingStyle':'roofFinish',attribute(1,11));
      if(b.mat===wall)g.setAttribute('bays',attribute(2,12));
      const mesh=new T.Mesh(g,b.mat);mesh.receiveShadow=true;mesh.castShadow=true;group.add(mesh);
    }
  }
  function footprint(site,x,z){
    const id=site.map?.match(/\/(way|relation)\/(\d+)$/);
    const near=cells.get(Math.floor(x/cell)+','+Math.floor(z/cell))||[];
    if(id){
      const key=id[1][0]+id[2],match=near.find(b=>b.id.split(':')[0]===key||b.parent?.split(':')[0]===key);
      if(match)return match;
    }
    if(!['Công trình tín ngưỡng','Bảo tàng','Kiến trúc','Phòng trưng bày'].includes(site.kind))return null;
    return near.find(b=>b.surveyed&&insideBuilding(x,z,b.rings));
  }
  function footprintViews(b,x,z,approachX,approachZ,ground){
    const ring=b.rings[0],extent=Math.hypot(b.maxX-b.minX,b.maxZ-b.minZ);
    const cx=(b.maxX+b.minX)/2,cz=(b.maxZ+b.minZ)/2,faces=[];
    // A mapped ring can be concave or wound in either direction. Sample just
    // beyond each wall before accepting its outward normal.
    for(let i=0;i<ring.length;i++){
      const a=ring[i],v=ring[(i+1)%ring.length],dx=v.x-a.x,dz=v.y-a.y,len=Math.hypot(dx,dz);
      if(len<1.3)continue;
      const mx=(a.x+v.x)/2,mz=(a.y+v.y)/2;
      let nx=dz/len,nz=-dx/len;
      if(insideBuilding(mx+nx*.15,mz+nz*.15,b.rings)){nx=-nx;nz=-nz;}
      const ax=approachX-mx,az=approachZ-mz;
      faces.push({mx,mz,nx,nz,len,priority:len/Math.max(1,extent)+
        .6*(nx*ax+nz*az)/Math.max(1,Math.hypot(ax,az))});
    }
    if(!faces.length)return null;
    faces.sort((a,b)=>b.priority-a.priority);
    const candidates=faces.slice(0,16);
    function pick(close){
      let best=null;
      for(const face of candidates){
        const {mx,mz,nx,nz,len}=face,tx=close?mx:cx,tz=close?mz:cz;
        const height=close?b.h*.87:b.h;
        const targetY=b.baseY+height*.46;
        const run=close?Math.max(10,b.h*1.38,Math.min(36,len)*.98):
          Math.max(18,extent*1.15,b.h*1.60);
        const eyeX=tx+nx*run,eyeZ=tz+nz*run;
        if(insideBuilding(eyeX,eyeZ,b.rings))continue;
        let slope=close?.15:.36;
        // Find the lowest unobstructed ray from the wall or overview target.
        // Heights share the same terrain datum as the rendered district.
        const steps=Math.min(100,Math.ceil(run/1.8));
        for(let step=1;step<=steps;step++){
          const along=run*step/steps,px=tx+nx*along,pz=tz+nz*along;
          let ceiling=ground(px,pz)+1;
          const near=cells.get(Math.floor(px/cell)+','+Math.floor(pz/cell))||[];
          for(const other of near){
            if((other.id!==b.id||close)&&insideBuilding(px,pz,other.rings))ceiling=Math.max(ceiling,other.baseY+other.h+.8);
          }
          slope=Math.max(slope,(ceiling-targetY)/along);
        }
        const score=face.priority-4*slope;
        if(best&&score<=best.score)continue;
        const compass=['nam','đông nam','đông','đông bắc','bắc','tây bắc','tây','tây nam'];
        const angle=Math.atan2(nx,nz),side=compass[(Math.round(angle/(Math.PI/4))+8)%8];
        const elevation=Math.atan(slope);
        best={score,view:{name:close?'Mặt công trình phía '+side:'Toàn cảnh công trình',
          offset:[tx-x,tz-z],height,focusAltitude:targetY,viewAngle:angle,viewElevation:elevation,viewRadius:run/Math.cos(elevation)}};
      }
      return best?.view;
    }
    const overview=pick(false),detail=pick(true);
    return overview&&detail?[overview,detail]:null;
  }
  return {group,clear,buildSteps,build(...args){for(const step of buildSteps(...args)){}},contact,footprint,footprintViews,overlapsSight:(landmarks,rings,box)=>overlapsModel(landmarks,rings,box)||overlapsGarden(landmarks,rings,box),
    streetFronts,builtUp:(x,z)=>cells.has(Math.floor(x/cell)+','+Math.floor(z/cell)),
    mappedBlock:(x,z)=>(blocks.get(Math.floor(x/70)+','+Math.floor(z/70))||0)>=3};
  }
  return {...createView(scene),createView,load:async(g,x,z)=>(await Promise.all([load(g,x,z),parts.load(g,x,z)])).some(Boolean)};
}

;
// driving-water.js
'use strict';

// XY stores surface current in map coordinates, Z stores distance from the bank.
window.createDrivingWater = function(T, mapped) {
  const time = {value: 0}, origin = {value: new T.Vector2()};
  const rainfall={value:0},wake={value:new T.Vector4()},wakeAge={value:0};
  const field = {value: null}, bounds = {value: new T.Vector3()};
  const mirrorMap={value:null},mirrorMatrix={value:new T.Matrix4()},mirrorStrength={value:0};
  const mirrorLevel={value:0};
  const reflected=new T.PerspectiveCamera(),direction=new T.Vector3(),up=new T.Vector3();
  const plane=new T.Plane(),clip=new T.Vector4(),corner=new T.Vector4();
  let target=null,lastReflection=-Infinity;
  const material = new T.MeshPhysicalMaterial({
    color: 0xffffff, roughness: .43, metalness: 0, ior: 1.333,
    envMapIntensity: .53, side: T.DoubleSide, transparent: true, depthWrite: true, forceSinglePass: true
  });
  material.customProgramCacheKey = () => 'inland-water-' + mapped;
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {waterTime: time, rainfall, wake, wakeAge, waterOrigin: origin, bankField: field, bankBounds: bounds, mirrorMap, mirrorMatrix, mirrorStrength});
    const varying = 'varying vec4 mirrorUV; varying vec2 waterMetres; varying vec2 localWater; varying vec3 waterProfile;\n';
    shader.vertexShader = varying + 'uniform vec2 waterOrigin; uniform mat4 mirrorMatrix;\n' +
      (mapped ? '' : 'attribute vec3 riverProfile;\n') + shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nmirrorUV=mirrorMatrix*modelMatrix*vec4(position,1.0); localWater=position.xz; waterMetres=localWater+waterOrigin; waterProfile=' +
      (mapped ? 'vec3(0.0);' : 'riverProfile;'));
    shader.fragmentShader = varying + `
      uniform sampler2D mirrorMap; uniform float mirrorStrength; uniform float waterTime; uniform float rainfall;
      uniform vec4 wake; uniform float wakeAge; uniform sampler2D bankField;
      uniform vec3 bankBounds;
      float hashBank(vec2 xy){
        vec3 p=fract(vec3(xy.xyx)*.1031);
        p+=dot(p,p.yzx+33.33);
        return fract((p.x+p.y)*p.z);
      }
      float gust(vec2 xy){
        vec2 cell=floor(xy),t=fract(xy);t=t*t*(3.-2.*t);
        return mix(mix(hashBank(cell),hashBank(cell+vec2(1.,0.)),t.x),
                   mix(hashBank(cell+vec2(0.,1.)),hashBank(cell+vec2(1.)),t.x),t.y);
      }
      // Suppress wavelengths smaller than a screen pixel at low viewing angles.
      float band(vec2 p, vec2 k, float phase) {
        float a=dot(p,k);
        return cos(a+phase)*(1.0-smoothstep(.45,2.7,fwidth(a)));
      }
    ` + shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec3 profile=waterProfile;
      ` + (mapped ? `vec4 atlas=texture2D(bankField,(localWater-bankBounds.xy)*bankBounds.z);
      profile=vec3(atlas.rg*2.0-1.0,atlas.b*24.0);` : '') + `
      float flow=clamp(length(profile.xy),0.0,1.0);
      vec2 drift=profile.xy+vec2(.12,.065);
      vec2 p=waterMetres-drift*waterTime;
      float bend=sin(dot(p,vec2(.19,.14)))*1.6+sin(dot(p,vec2(-.37,.23)))*.64;
      vec2 crosswind=normalize(mix(vec2(.84,.54),drift/max(length(drift),.01),flow));
      vec2 across=vec2(-crosswind.y,crosswind.x);
      vec2 channel=vec2(dot(p,crosswind),dot(p,across));
      float eddy=gust(p*.77+vec2(waterTime*.13,0.));
      channel+=vec2(eddy*1.17,gust(p*.46+5.7)*1.54);
      vec2 slope=crosswind*(.062*band(channel,vec2(2.3,.64),bend-waterTime*.9)
                             +.037*band(channel,vec2(7.9,-1.65),bend*1.6-waterTime*1.45))
                +across*(.044*band(channel,vec2(.72,3.7),-bend-waterTime*.54)
                         +.027*band(channel,vec2(2.72,12.1),bend*.64+waterTime));
      // Small capillary waves break up the sky even on slow-moving lake water.
      float windPatch=gust(p*.22+vec2(8.4,waterTime*.027));
      slope*=.55+.92*windPatch;
      slope+=vec2(.04,-.057)*band(p,vec2(-3.3,2.7),waterTime*.8+bend);
      if(rainfall>.015){
        vec2 cell=floor(waterMetres*2.4);
        float seed=fract(sin(dot(cell,vec2(27.1,83.7)))*4375.23);
        vec2 delta=fract(waterMetres*2.4)-vec2(.25+.5*seed,.25+.5*fract(seed*9.3));
        float age=fract(waterTime*1.45+seed);
        float radius=length(delta);
        float ring=exp(-abs(radius-age*.58)*19.)*(1.-age);
        slope+=delta/max(.04,radius)*ring*rainfall*.18;
      }
      float wakeFoam=0.;
      if(wake.w>.015){
        vec2 delta=localWater-wake.xy;
        vec2 forward=vec2(sin(wake.z),-cos(wake.z));
        float aft=-dot(delta,forward),beam=dot(delta,vec2(-forward.y,forward.x));
        float arm=abs(beam)-1.-max(aft,0.)*.31;
        float trail=smoothstep(-.8,1.,aft)*exp(-max(aft,0.)*.16)*exp(-abs(arm)*1.45);
        float wave=sin(arm*8.-waterTime*2.8);
        slope+=vec2(-forward.y,forward.x)*sign(beam)*wave*trail*wake.w*.17;
        float radius=length(delta);
        float splashRing=exp(-abs(radius-1.1-wakeAge*2.8)*1.6)*exp(-wakeAge*.65);
        slope+=delta/max(radius,.01)*splashRing*wake.w*.22;
        wakeFoam=(trail*(.4+.6*wave*wave)+splashRing*.8)*wake.w;
      }
      float depth=max(profile.z,0.0);
      float shallows=exp(-depth*.39);
      diffuseColor.a*=mix(.16,1.,smoothstep(0.,3.4,depth));
      vec3 deep=mix(vec3(.023,.077,.074),vec3(.070,.090,.055),smoothstep(.15,.7,flow));
      deep=mix(deep,vec3(.023,.09,.083),smoothstep(.72,1.0,flow));
      float bed=.5+.25*band(waterMetres,vec2(2.1,1.15),bend*.18)+.25*band(waterMetres,vec2(-3.7,4.2),.4);
      // Suspended sediment varies across the channel and the shallow bed remains visible.
      float silt=gust(waterMetres*.12+bend*.11);
      vec3 body=mix(deep,vec3(.078,.107,.064),silt*(.23+.30*flow));
      vec3 lakeBed=mix(vec3(.13,.12,.074),vec3(.19,.168,.102),bed);
      diffuseColor.rgb=mix(body,lakeBed*(.82+.3*bed),shallows);
      diffuseColor.rgb+=vec3(.15,.18,.17)*wakeFoam;
      float shorePulse=sin(depth*3.1-waterTime*1.65+bend*.5);
      diffuseColor.rgb+=vec3(.030,.034,.027)*smoothstep(.65,.96,shorePulse)*shallows;
      float crest=band(channel,vec2(4.2,.72),bend-waterTime*.77);
      float broken=smoothstep(.38,.85,sin(channel.y*1.8+bend)*sin(channel.x*.53-bend));
      diffuseColor.rgb+=vec3(.075,.092,.084)*smoothstep(.72,.98,crest)*broken*gust(channel*3.4)
                      *smoothstep(.38,.90,flow)*(.12+.88*shallows);
    `).replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      normal=normalize(mat3(viewMatrix)*vec3(-slope.x,1.0,-slope.y));
    `).replace('#include <opaque_fragment>', `
      vec2 reflectionUV=mirrorUV.xy/max(.001,mirrorUV.w)*.5+.5;
      reflectionUV+=slope*(.035+.018*windPatch);
      float edge=min(min(reflectionUV.x,reflectionUV.y),min(1.0-reflectionUV.x,1.0-reflectionUV.y));
      float fresnel=.021+.979*pow(1.0-clamp(dot(normal,normalize(vViewPosition)),0.0,1.0),5.0);
      float blend=mirrorStrength*smoothstep(0.0,.045,edge)*step(.01,mirrorUV.w)*fresnel;
      if(blend>.001){
        // Average the reflected scene across a wave footprint. Long banks should
        // read as interrupted colour bands even at a low viewing angle.
        vec2 spread=vec2(.0035,.009)*(.85+windPatch+rainfall);
        vec2 uv=clamp(reflectionUV,spread,1.0-spread);
        vec3 reflection=.25*(texture2D(mirrorMap,uv+spread).rgb+
                             texture2D(mirrorMap,uv-spread).rgb+
                             texture2D(mirrorMap,uv+vec2(spread.x,-spread.y)).rgb+
                             texture2D(mirrorMap,uv+vec2(-spread.x,spread.y)).rgb);
        outgoingLight=mix(outgoingLight,reflection,blend*(.44-.13*windPatch)*(1.0-shallows*.47));
      }
      #include <opaque_fragment>
    `);
  };
  function setField(pixels,size,x,z,scale,cx,cz) {
    if(!field.value||field.value.image.width!==size){
      field.value?.dispose();
      field.value=new T.DataTexture(pixels,size,size);
      field.value.minFilter=field.value.magFilter=T.LinearFilter;
    }else field.value.image.data=pixels;
    field.value.needsUpdate=true;
    bounds.value.set(x,z,scale/size);
    origin.value.set(cx,cz);lastReflection=-Infinity;
  }
  function sizeTarget(profile){
    if(!target){
      target=new T.WebGLRenderTarget(profile.waterWidth,profile.waterWidth*9/16);
      mirrorMap.value=target.texture;
    }else if(target.width!==profile.waterWidth)target.setSize(profile.waterWidth,profile.waterWidth*9/16);
  }
  function prepare(renderer,profile,work,draw=false){
    sizeTarget(profile);
    const previous=renderer.getRenderTarget(),visible=material.visible,mirror=mirrorMap.value;
    try{
      if(draw){
        target.scissor.set(0,0,1,1);target.scissorTest=true;
        mirrorMap.value=null;material.visible=false;
      }
      renderer.setRenderTarget(target);
      work();
    }finally{
      if(draw){target.scissorTest=false;material.visible=visible;mirrorMap.value=mirror;lastReflection=-Infinity;}
      renderer.setRenderTarget(previous);
    }
  }
  function reflect(renderer,scene,camera,level,now,near,profile){
    if(!profile.waterWidth||!near||camera.position.y<=level){mirrorStrength.value=0;lastReflection=-Infinity;return;}
    if(now-lastReflection<profile.waterMs)return;
    lastReflection=now;
    sizeTarget(profile);
    camera.updateMatrixWorld();
    camera.getWorldDirection(direction);direction.y*=-1;
    up.set(0,1,0).applyQuaternion(camera.quaternion);up.y*=-1;
    reflected.position.copy(camera.position);reflected.position.y=2*level-camera.position.y;
    reflected.up.copy(up);reflected.lookAt(direction.add(reflected.position));
    reflected.updateMatrixWorld();reflected.projectionMatrix.copy(camera.projectionMatrix);
    // Oblique near plane keeps the ground beneath the water out of the reflection.
    plane.normal.set(0,1,0);plane.constant=-level-.015;plane.applyMatrix4(reflected.matrixWorldInverse);
    clip.set(plane.normal.x,plane.normal.y,plane.normal.z,plane.constant);
    const m=reflected.projectionMatrix.elements;
    corner.set((Math.sign(clip.x)+m[8])/m[0],(Math.sign(clip.y)+m[9])/m[5],-1,(1+m[10])/m[14]);
    clip.multiplyScalar(2/clip.dot(corner));m[2]=clip.x;m[6]=clip.y;m[10]=clip.z+1;m[14]=clip.w;
    reflected.projectionMatrixInverse.copy(reflected.projectionMatrix).invert();
    mirrorMatrix.value.multiplyMatrices(reflected.projectionMatrix,reflected.matrixWorldInverse);
    mirrorLevel.value=level;
    const previous=renderer.getRenderTarget(),shadow=renderer.shadowMap.needsUpdate;
    // Wet asphalt may also sample this target. Unbind it in the capture pass.
    mirrorMap.value=null;mirrorStrength.value=0;
    material.visible=false;renderer.shadowMap.needsUpdate=false;
    try{renderer.setRenderTarget(target);renderer.render(scene,reflected);}
    finally{renderer.setRenderTarget(previous);mirrorMap.value=target.texture;material.visible=true;renderer.shadowMap.needsUpdate=shadow;}
    mirrorStrength.value=1;
  }
  return {material,setField,prepare,reflect,reflection:{mirrorMap,mirrorMatrix,mirrorStrength,mirrorLevel},setWake(x,z,yaw,strength,age){wake.value.set(x,z,yaw,strength);wakeAge.value=age;},update(seconds,rain=0){time.value=seconds;rainfall.value=rain;}};
};

// Two chamfer passes estimate the distance to the dry bank on the merged mask.
// Shared polygon cuts, map tile seams and islands therefore need no special edges.
window.waterBankField = function*(mask,current,size,metres) {
  const depth=new Float32Array(size*size),out=new Uint8Array(size*size*4);
  for(let i=0;i<depth.length;i++){
    if((i&2047)===0)yield;
    const alpha=mask[i*4+3];
    depth[i]=alpha>=250?24:alpha/255*metres*.5;
  }
  for(const step of [1,-1]){
    for(let n=0;n<depth.length;n++){
      if((n&2047)===0)yield;
      const i=step===1?n:depth.length-1-n;
      if(!depth[i])continue;
      const x=i%size,j=i-size*step;
      if(x-step>=0&&x-step<size)depth[i]=Math.min(depth[i],depth[i-step]+metres);
      if(j<0||j>=depth.length)continue;
      depth[i]=Math.min(depth[i],depth[j]+metres);
      if(x>0)depth[i]=Math.min(depth[i],depth[j-1]+1.414*metres);
      if(x+1<size)depth[i]=Math.min(depth[i],depth[j+1]+1.414*metres);
    }
  }
  for(let i=0;i<depth.length;i++){
    if((i&2047)===0)yield;
    const j=i*4,a=current[j+3]/255;
    out[j]=128+(current[j]-128)*a;out[j+1]=128+(current[j+1]-128)*a;
    out[j+2]=Math.round(depth[i]*255/24);out[j+3]=255;
  }
  return out;
};

;
// shore-terrain.js
'use strict';

// Sum area-weighted triangle normals in slices while the previous mesh stays visible.
function* updateTerrainNormals(T,geometry){
  const points=geometry.attributes.position.array,triangles=geometry.index.array;
  const attribute=geometry.attributes.normal||new T.BufferAttribute(new Float32Array(points.length),3);
  const normals=attribute.array;normals.fill(0);
  for(let i=0;i<triangles.length;i+=3){
    const a=triangles[i]*3,b=triangles[i+1]*3,c=triangles[i+2]*3;
    const ux=points[b]-points[a],uy=points[b+1]-points[a+1],uz=points[b+2]-points[a+2];
    const vx=points[c]-points[a],vy=points[c+1]-points[a+1],vz=points[c+2]-points[a+2];
    const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
    for(let j=i;j<i+3;j++){const k=triangles[j]*3;normals[k]+=nx;normals[k+1]+=ny;normals[k+2]+=nz;}
    if((i&8191)===0)yield;
  }
  for(let i=0;i<normals.length;i+=3){
    const length=Math.sqrt(normals[i]**2+normals[i+1]**2+normals[i+2]**2)||1;
    normals[i]/=length;normals[i+1]/=length;normals[i+2]/=length;
    if((i&8191)===0)yield;
  }
  geometry.setAttribute('normal',attribute);attribute.needsUpdate=true;
}

// Even when the water mask is antialiased, adjacent IDs must remain distinct
// after the browser stores and reads back its premultiplied RGBA pixels.
function shorePoolColour(id){
  return 'rgb('+((id&7)*36)+','+(((id>>3)&7)*36)+','+((id>>6)*85)+')';
}
function shorePoolIndex(r,g,b){
  return Math.round(r/36)|(Math.round(g/36)<<3)|(Math.round(b/85)<<6);
}

// The mask's metre grid serves both the visible bed and the tyre immersion query.
// Its outer land vertices keep the same height and diagonal as the large terrain mesh.
function* buildMappedShoreSteps(T, options){
  const {mask,field,size,scale,maskX,maskZ,cx,cz,gx,gz,landWidth,land,landIndex,ground,pools,group,waterMaterial}=options;
  const segments=land.geometry.parameters.widthSegments;
  const metres=1/scale,coarse=landWidth/segments,steps=coarse/metres;
  const active=new Uint8Array(segments*segments),count=size*size,dry=new Float32Array(count),ids=new Uint8Array(count);
  const left=gx-cx-landWidth/2,top=gz-cz-landWidth/2;
  function poolId(i,k,j){
    let offset=i*4,alpha=mask[offset+3];
    if(!alpha||pools.length<2)return 0;
    // Canvas stores premultiplied colours. A faint edge cannot reliably
    // distinguish pool IDs. Read its most strongly covered neighbour first.
    if(alpha<32){
      for(let v=Math.max(0,j-1);v<=Math.min(size-1,j+1);v++)for(let u=Math.max(0,k-1);u<=Math.min(size-1,k+1);u++){
        const next=4*(v*size+u);
        if(mask[next+3]>alpha){offset=next;alpha=mask[next+3];}
      }
    }
    if(alpha<32)return 0;
    const id=shorePoolIndex(mask[offset],mask[offset+1],mask[offset+2]);
    return id<pools.length?id:0;
  }
  for(let j=0,i=0;j<size;j++)for(let k=0;k<size;k++,i++){
    if((i & 8191)===0)yield;
    const a=mask[4*i+3]/255;
    dry[i]=a>0?(1-a)*metres:32;ids[i]=poolId(i,k,j);
    if(a<=0)continue;
    const x=maskX+(k+.5)*metres-left,z=maskZ+(j+.5)*metres-top;
    // Include the dry bank outside the silhouette.
    for(let v=Math.max(0,Math.floor((z-10)/coarse));v<=Math.min(segments-1,Math.floor((z+10)/coarse));v++)
      for(let u=Math.max(0,Math.floor((x-10)/coarse));u<=Math.min(segments-1,Math.floor((x+10)/coarse));u++){
        const c=v*segments+u;
        if(field[i*4+2]<240)active[c]=1;
        else if(!active[c])active[c]=2;
      }
  }
  function spread(to,from,step){
    const d=dry[from]+step;
    if(d<dry[to]){dry[to]=d;ids[to]=ids[from];}
  }
  for(const dir of [1,-1])for(let k=0;k<count;k++){
    if((k & 8191)===0)yield;
    const i=dir===1?k:count-1-k,x=i%size,prev=i-size*dir;
    if(x-dir>=0&&x-dir<size)spread(i,i-dir,metres);
    if(prev>=0&&prev<count){
      spread(i,prev,metres);
      if(x>0)spread(i,prev-1,metres*Math.SQRT2);
      if(x<size-1)spread(i,prev+1,metres*Math.SQRT2);
    }
  }
  const signed=new Float32Array(count);
  for(let i=0;i<count;i++){
    const a=mask[i*4+3]/255;
    signed[i]=a>.98?field[i*4+2]*(24/255)-metres*.5:a<.02?metres*.5-dry[i]:(a-.5)*metres;
  }
  function cell(x,z){return x>=0&&z>=0&&x<size&&z<size?z*size+x:-1;}
  function distance(i){return i<0?-32:signed[i];}
  // Only cells near water need samples. Rows share boundary vertices between
  // neighbouring cells and serve the physics queries on the same metre grid.
  const gridSide=segments*steps+1,heights=new Array(gridSide);
  function node(x,z){
    const ix=Math.round((x-left)/metres),iz=Math.round((z-top)/metres);
    const line=heights[iz]??=new Array(gridSide);
    if(line[ix])return line[ix];
    const col=Math.round((x-maskX)*scale),row=Math.round((z-maskZ)*scale);
    const a=cell(col-1,row-1),b=cell(col,row-1),c=cell(col-1,row),e=cell(col,row);
    const da=distance(a),db=distance(b),dc=distance(c),de=distance(e);
    const d=(da+db+dc+de)*.25,closest=Math.max(da,db,dc,de);
    const nearest=da===closest?a:db===closest?b:dc===closest?c:e;
    const natural=ground(x,z)-.17,id=nearest<0?0:ids[nearest];
    // The DEM records embankments as land. Keep the surface below surrounding roads
    // while a named lake shares a level across its OSM islands and polygon cuts.
    const level=id&&pools[id]!==undefined?Math.min(natural-.12,Math.max(natural-3.2,pools[id])):natural-.42;
    const depth=Math.min(5.6,Math.max(0,d)*.33),dryWidth=Math.min(1,Math.max(0,-d/8));
    const blend=dryWidth*dryWidth*(3-2*dryWidth);
    const bed=d>0?level-depth:level+(natural-level)*blend;
    return line[ix]={x,z,bed,level,d,sediment:1-blend,waterIndex:-1};
  }
  const verts=[],uv=[],silt=[],indices=[],remaining=[],water=[],waterIndices=[];
  const waterVertex=(x,y,z)=>{const i=water.length/3;water.push(x,y,z);return i;};
  function waterTriangle(a,b,c,ia,ib,ic){
    if(a.d<=0&&b.d<=0&&c.d<=0)return;
    if(a.d>=0&&b.d>=0&&c.d>=0){waterIndices.push(ia,ib,ic);return;}
    const ring=[],ns=[a,b,c],vs=[ia,ib,ic];
    let p=c;
    for(let i=0;i<3;i++){
      const n=ns[i];
      if((p.d>0)!==(n.d>0)){
        const u=p.d/(p.d-n.d);
        ring.push(waterVertex(p.x+u*(n.x-p.x),p.level+u*(n.level-p.level),p.z+u*(n.z-p.z)));
      }
      if(n.d>0)ring.push(vs[i]);p=n;
    }
    for(let i=2;i<ring.length;i++)waterIndices.push(ring[0],ring[i-1],ring[i]);
  }
  for(let j=0;j<segments;j++)for(let i=0;i<segments;i++){
    const c=j*segments+i;
        if((c & 7)===0)yield;
    if(!active[c]){for(let k=c*6;k<c*6+6;k++)remaining.push(landIndex.array[k]);continue;}
    // Open water has a level surface and a saturated bed profile; shoreline
    // refinement there would produce many duplicate triangles on coastal maps.
    const divisions=active[c]===2?2:steps,spacing=coarse/divisions;
    const first=verts.length/3,ns=[],ws=[];
    for(let v=0;v<=divisions;v++)for(let u=0;u<=divisions;u++){
      const x=left+i*coarse+u*spacing,z=top+j*coarse+v*spacing,n=node(x,z);ns.push(n);
      const px=x+cx-gx,pz=z+cz-gz;
      verts.push(px,-pz,n.bed+.17);uv.push(px/landWidth+.5,.5-pz/landWidth);silt.push(n.sediment);
      if(n.d>=0&&n.waterIndex<0)n.waterIndex=waterVertex(x,n.level,z);
      ws.push(n.waterIndex);
      if(!v||!u)continue;
      const d=v*(divisions+1)+u,a=d-divisions-2,b=d-divisions-1,k=d-1;
      indices.push(first+a,first+k,first+b,first+k,first+d,first+b);
      waterTriangle(ns[a],ns[k],ns[b],ws[a],ws[k],ws[b]);waterTriangle(ns[k],ns[d],ns[b],ws[k],ws[d],ws[b]);
    }
  }
  const patch=new T.BufferGeometry();
  patch.setAttribute('position',new T.Float32BufferAttribute(verts,3));patch.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  patch.setAttribute('shoreSediment',new T.Float32BufferAttribute(silt,1));patch.setIndex(indices);yield* updateTerrainNormals(T,patch);
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(water,3));g.setIndex(waterIndices);yield* updateTerrainNormals(T,g);
  land.geometry.setIndex(remaining);
  const bank=new T.Mesh(patch,land.material);bank.name='Mapped banks and bed';bank.receiveShadow=true;land.add(bank);
  // The shared materials are picked for the current biome by the main renderer.
  bank.onBeforeRender=()=>{bank.material=land.material;};
  const surface=new T.Mesh(g,waterMaterial);surface.name='Mapped water';surface.receiveShadow=true;group.add(surface);
  // Index the actual triangles that cover a bank (verges, paving and gardens).
  // A cover below the waterline reduces the depth, while one above it stays dry.
  const covers=new Map();
  function addCover(geometry,matrix,start=0,end=geometry.index?.count??geometry.attributes.position.count){
    const position=geometry.attributes.position,index=geometry.index;
    const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
    function read(p,i){
      p.fromBufferAttribute(position,index?index.getX(i):i);
      if(matrix)p.applyMatrix4(matrix);
    }
    for(let i=start;i<end;i+=3){
      read(a,i);read(b,i+1);read(c,i+2);
      const bx=b.x-a.x,bz=b.z-a.z,cx=c.x-a.x,cz=c.z-a.z,det=bx*cz-bz*cx;
      if(Math.abs(det)<1e-8)continue;
      const x0=Math.max(0,Math.floor((Math.min(a.x,b.x,c.x)-left)/coarse)),x1=Math.min(segments-1,Math.floor((Math.max(a.x,b.x,c.x)-left)/coarse));
      const z0=Math.max(0,Math.floor((Math.min(a.z,b.z,c.z)-top)/coarse)),z1=Math.min(segments-1,Math.floor((Math.max(a.z,b.z,c.z)-top)/coarse));
      let tri;
      for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){
        const key=z*segments+x;if(!active[key])continue;
        if(!covers.has(key))covers.set(key,[]);
        tri??={x:a.x,y:a.y,z:a.z,bx,bz,cx,cz,by:b.y-a.y,cy:c.y-a.y,det};
        covers.get(key).push(tri);
      }
    }
  }
  function sample(x,z,includeBank=false){
    const tx=Math.floor((x-left)/coarse),tz=Math.floor((z-top)/coarse);
    if(tx<0||tx>=segments||tz<0||tz>=segments||!active[tz*segments+tx])return null;
    const stride=active[tz*segments+tx]===2?steps/2:1,u=(x-left)/(metres*stride),v=(z-top)/(metres*stride);
    const i=Math.floor(u),j=Math.floor(v),f=u-i,h=v-j,col=i*stride,row=j*stride;
    const topRow=heights[row],bottomRow=heights[row+stride];
    const a=topRow?.[col],b=topRow?.[col+stride],c=bottomRow?.[col],d=bottomRow?.[col+stride];
    if(!a||!b||!c||!d)return null;
    const height=k=>f+h<=1?a[k]+f*(b[k]-a[k])+h*(c[k]-a[k]):d[k]+(1-f)*(c[k]-d[k])+(1-h)*(b[k]-d[k]);
    if(!includeBank&&height('d')<=0)return null;
    const level=height('level');let bed=height('bed');
    for(const t of covers.get(tz*segments+tx)||[]){
      const dx=x-t.x,dz=z-t.z,u=(dx*t.cz-dz*t.cx)/t.det,v=(t.bx*dz-t.bz*dx)/t.det;
      if(u>=-1e-7&&v>=-1e-7&&u+v<=1.0000001)bed=Math.max(bed,t.y+u*t.by+v*t.cy);
    }
    return includeBank||level>bed?{level,bed}:null;
  }
  function intersects(x0,z0,x1,z1){
    const firstX=Math.max(0,Math.floor((x0-left)/coarse)),lastX=Math.min(segments-1,Math.floor((x1-left)/coarse));
    const firstZ=Math.max(0,Math.floor((z0-top)/coarse)),lastZ=Math.min(segments-1,Math.floor((z1-top)/coarse));
    for(let j=firstZ;j<=lastZ;j++)for(let i=firstX;i<=lastX;i++)if(active[j*segments+i])return true;
    return false;
  }
  return {sample,addCover,intersects,dispose(){land.remove(bank);patch.dispose();land.geometry.setIndex(landIndex);}};
}

;
// sidewalk-contours.js
'use strict';

// Trace the outside of the whole carriageway with a disc. Its contacts with
// straight streets are straight, and at an inside corner it rolls from one
// tangent to the next. Both sides of a T junction follow the same outline.
function sidewalkRings(segments){
  const radius=2.4,full=Math.PI*2,polygons=[],nodes=new Map();
  const scale=1000,point=(x,z)=>({X:Math.round(x*scale),Y:Math.round(z*scale)});
  for(const s of segments){
    const r=s.w+radius,nx=s.nx*r,nz=s.nz*r;
    polygons.push([point(s.ax+nx,s.az+nz),point(s.ax-nx,s.az-nz),
      point(s.bx-nx,s.bz-nz),point(s.bx+nx,s.bz+nz)]);
    for(const [x,z] of [[s.ax,s.az],[s.bx,s.bz]]){
      const key=x+','+z;
      let node=nodes.get(key);
      if(!node||r>node.r){node={x,z,r,angles:[]};nodes.set(key,node);}
      if(r===node.r){
        const a=Math.atan2(s.nz,s.nx);
        node.angles.push((a+full)%full,(a+Math.PI+full)%full);
      }
    }
  }
  // Circumscribed caps contain the road's end cap even after the radius is
  // subtracted. A tangent parallel to each attached street avoids little steps.
  for(const {x,z,r,angles} of nodes.values()){
    for(let i=0;i<24;i++)angles.push(full*i/24);
    angles.sort((a,b)=>a-b);
    const cap=[];
    for(let i=0;i<angles.length;i++){
      const a=angles[i],b=angles[i+1]??angles[0]+full;
      if(b-a<1e-7)continue;
      const mid=(a+b)/2,d=r/Math.cos((b-a)/2);
      cap.push(point(x+d*Math.cos(mid),z+d*Math.sin(mid)));
    }
    polygons.push(cap);
  }
  if(!polygons.length)return [];
  // Each ring has the roadway on its left, including rings around city blocks.
  const clipper=new ClipperLib.Clipper(),rings=[];
  clipper.AddPaths(polygons,ClipperLib.PolyType.ptSubject,true);
  clipper.Execute(ClipperLib.ClipType.ctUnion,rings,ClipperLib.PolyFillType.pftNonZero,ClipperLib.PolyFillType.pftNonZero);
  return rings;
}
function* traceSidewalkSteps(segments,nearby,emit,fill,worker){
  const radius=2.4,full=Math.PI*2,scale=1000;
  let rings;
  if(worker&&segments.size){
    const task=worker(segments);yield task;
    rings=task.rings;
  }
  rings??=sidewalkRings(segments);
  function owner(x,z){
    let nearest=null,gap=Infinity;
    for(const s of nearby(x,z)){
      const along=Math.max(0,Math.min(s.len,(x-s.ax)*s.fx+(z-s.az)*s.fz));
      const d=Math.hypot(x-s.ax-along*s.fx,z-s.az-along*s.fz)-s.w;
      if(d<gap){nearest=s;gap=d;}
    }
    return nearest;
  }
  for(const outline of rings){
    yield;
    const ring=ClipperLib.Clipper.CleanPolygon(outline,2);
    const edges=[];
    for(let i=0;i<ring.length;i++){
      const a=ring[i],b=ring[(i+1)%ring.length];
      const x=a.X/scale,z=a.Y/scale,dx=(b.X-a.X)/scale,dz=(b.Y-a.Y)/scale,length=Math.hypot(dx,dz);
      if(!length)continue;
      const nx=-dz/length,nz=dx/length;
      // A union can dissolve collinear vertices across a change of road type.
      const count=Math.max(1,Math.ceil(length/12));
      for(let j=0;j<count;j++){
        const t=(j+.5)/count;
        edges.push({x:x+dx*j/count,z:z+dz*j/count,nx,nz,s:owner(x+dx*t,z+dz*t)});
      }
    }
    const sections=[];
    function section(x,z,nx,nz,width,s){
      const row={x:x+radius*nx,z:z+radius*nz,nx:-nx,nz:-nz,width,s};
      sections.push(row);
    }
    for(let i=0;i<edges.length;i++){
      const e=edges[i],p=edges[(i+edges.length-1)%edges.length];
      const before=p.s?.walkWidth||0,after=e.s?.walkWidth||0;
      const width=before&&after?(before+after)/2:before||after;
      const dot=p.nx*e.nx+p.nz*e.nz,cross=p.nx*e.nz-p.nz*e.nx;
      const turn=Math.atan2(cross,dot);
      if(turn<-.012&&(before||after)){
        const start=Math.atan2(p.nz,p.nx),steps=Math.ceil(-turn/(Math.PI/18));
        for(let j=0;j<=steps;j++){
          const angle=start+turn*j/steps;
          // Keep the return on the paved approach when a branch has no walk.
          const side=j===steps?e.s:(j<steps/2?p.s:e.s);
          section(e.x,e.z,Math.cos(angle),Math.sin(angle),width,
            j<steps&&!side?.walkWidth?(before?p.s:e.s):side);
        }
      }else{
        const divisor=1+dot;
        if(divisor<1e-7){section(e.x,e.z,e.nx,e.nz,width,e.s);continue;}
        section(e.x,e.z,(p.nx+e.nx)/divisor,(p.nz+e.nz)/divisor,width,e.s);
      }
    }
    function centre(s,p){
      const t=Math.max(0,Math.min(s.len,(p.x-s.ax)*s.fx+(p.z-s.az)*s.fz));
      return [s.ax+t*s.fx,s.az+t*s.fz];
    }
    for(let i=0;i<sections.length;i++){
      if((i & 31)===0)yield;
      const a=sections[i],b=sections[(i+1)%sections.length];
      if(!a.s?.walkWidth)continue;
      const prev=sections[(i+sections.length-1)%sections.length];
      emit(a,b,!prev.s?.walkWidth,!b.s?.walkWidth);
      // Lay road material up to the kerb around a return. The straight runs
      // already sit on the rendered carriageway.
      const ca=centre(a.s,a),cb=centre(a.s,b),pa=[a.x,a.z],pb=[b.x,b.z];
      const atCap=p=>(p.x-a.s.ax)*a.s.fx+(p.z-a.s.az)*a.s.fz;
      if(Math.min(atCap(a),atCap(b))<=0||Math.max(atCap(a),atCap(b))>=a.s.len||
        Math.max(Math.hypot(a.x-ca[0],a.z-ca[1]),Math.hypot(b.x-cb[0],b.z-cb[1]))>a.s.w+.002){
        fill(a.s,pa,pb,ca);fill(a.s,ca,pb,cb);
      }
      if(prev.s&&prev.s!==a.s)fill(a.s,pa,ca,centre(prev.s,a));
    }
  }
}

function traceSidewalks(...args){for(const step of traceSidewalkSteps(...args)){}}

;
// grounded-walkways.js
'use strict';
// The tops share the ground triangulation used by the road. The vertical faces
// extend into the bank, including on the downhill side of a raised road.
function createGroundedWalkways(T,{cx,cz,step,height,ground,wet,needsDetail}){
  const tops=[],coping=[],frontages=[],faces=[],cells=new Map();
  const cell=(x,z)=>Math.floor(x/16)+','+Math.floor(z/16);
  function face(ax,az,bx,bz,lift){
    const dx=bx-ax,dz=bz-az,breaks=[0,1];
    for(const [start,delta] of [[cx+ax,dx],[cz+az,dz],[cx+cz+ax+az,dx+dz]]){
      if(Math.abs(delta)<.0001)continue;
      const end=start+delta;
      for(let v=(Math.floor(Math.min(start,end)/step)+1)*step;v<Math.max(start,end);v+=step)breaks.push((v-start)/delta);
    }
    breaks.sort((a,b)=>a-b);
    let x=ax,z=az,h=height(x,z)+lift,low=Math.min(h-.15,ground(x,z)-.20);
    for(let i=1;i<breaks.length;i++){
      if(breaks[i]-breaks[i-1]<.000001)continue;
      const u=ax+dx*breaks[i],v=az+dz*breaks[i],high=height(u,v)+lift,bottom=Math.min(high-.15,ground(u,v)-.20);
      faces.push(x,h,z,u,high,v,u,bottom,v,x,h,z,u,bottom,v,x,low,z);
      x=u;z=v;h=high;low=bottom;
    }
  }
  // Use the same triangles for tyre contact and rendering, including the
  // tapered slabs where two streets with different widths meet.
  function slab(target,lift,a,b,c){
    const area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    if(Math.abs(area)<1e-8)return;
    if(area>0)[b,c]=[c,b];
    target.push(...a,...b,...c);
    const tri={a,b,c,lift};
    for(let col=Math.floor(Math.min(a[0],b[0],c[0])/16);col<=Math.floor(Math.max(a[0],b[0],c[0])/16);col++){
      for(let row=Math.floor(Math.min(a[1],b[1],c[1])/16);row<=Math.floor(Math.max(a[1],b[1],c[1])/16);row++){
        const key=col+','+row;
        if(!cells.has(key))cells.set(key,[]);
        cells.get(key).push(tri);
      }
    }
  }
  function band(target,lift,a,b,c,d){
    slab(target,lift,a,b,c);slab(target,lift,c,b,d);
  }
  function sidewalk(a,b,capStart,capEnd){
    const row=p=>[[p.x,p.z],[p.x+.16*p.nx,p.z+.16*p.nz],[p.x+p.width*p.nx,p.z+p.width*p.nz]];
    const start=row(a),end=row(b);
    const mix=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
    const at=t=>start.map((p,i)=>mix(p,end[i],t));
    const centre=r=>mix(r[0],r[2],.5);
    const cap=r=>{face(...r[0],...r[1],.12);face(...r[1],...r[2],.108);};
    const fine=needsDetail(Math.min(a.x,b.x)-3,Math.min(a.z,b.z)-3,Math.max(a.x,b.x)+3,Math.max(a.z,b.z)+3);
    const count=fine?Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/3)):1;
    let left=start;
    for(let i=1;i<=count;i++){
      const right=i===count?end:at(i/count);
      let p=left,q=right;
      left=right;
      const dryP=!wet(...centre(p)),dryQ=!wet(...centre(q));
      if(!dryP&&!dryQ)continue;
      if(dryP!==dryQ){
        let lo=(i-1)/count,hi=i/count;
        for(let k=0;k<8;k++){
          const t=(lo+hi)/2;
          const dry=!wet(...centre(at(t)));
          if(dry===dryP)lo=t;else hi=t;
        }
        const shore=at((lo+hi)/2);
        if(dryP)q=shore;else p=shore;
        cap(shore);
      }
      band(coping,.12,p[0],p[1],q[0],q[1]);band(tops,.108,p[1],p[2],q[1],q[2]);
      face(...p[0],...q[0],.12);face(...p[1],...q[1],.12);face(...p[2],...q[2],.108);
      if(i===1&&capStart&&dryP)cap(p);
      if(i===count&&capEnd&&dryQ)cap(q);
    }
  }
  function porch(s,x,z,width){
    const p=(u,v)=>[x+s.fx*u+s.nx*v,z+s.fz*u+s.nz*v];
    const a=p(-width/2,-1.35),b=p(-width/2,1.35),c=p(width/2,-1.35),d=p(width/2,1.35);
    band(frontages,.105,a,b,c,d);
    face(...a,...b,.105);face(...b,...d,.105);face(...d,...c,.105);face(...c,...a,.105);
  }
  function* buildSteps(group,surface,pavers,stone){
    yield* surface(tops,pavers,.108,1);
    yield* surface(coping,stone,.12,1);
    yield* surface(frontages,pavers,.105,1);
    tops.length=coping.length=frontages.length=0;
    if(!faces.length)return;
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.Float32BufferAttribute(faces,3));setFlatNormals(T,geometry);
    faces.length=0;
    const mesh=new T.Mesh(geometry,stone);mesh.name='Curb and pavement edges';mesh.receiveShadow=true;group.add(mesh);
  }
  function liftAt(x,z){
    let lift=0;
    const inside=(p,q)=>(q[0]-p[0])*(z-p[1])-(q[1]-p[1])*(x-p[0])<=1e-8;
    for(const {a,b,c,lift:h} of cells.get(cell(x,z))||[]){
      if(inside(a,b)&&inside(b,c)&&inside(c,a))lift=Math.max(lift,h);
    }
    return lift;
  }
  function build(group,surface,pavers,stone){
    function* immediate(...args){surface(...args);}
    for(const step of buildSteps(group,immediate,pavers,stone)){}
  }
  return {sidewalk,porch,build,buildSteps,liftAt};
}

;
// temple-surfaces.js
'use strict';

// Geometry UVs are east/south metres in the road graph, independent of the
// movable render origin. All three materials are shared across streamed meshes.
window.createTempleSurfaces=function(T){
  const loader=new T.TextureLoader();
  function channel(name,kind,scale){
    const texture=loader.load('streetscape/surfaces/'+name+'-'+kind+'.webp');
    texture.wrapS=texture.wrapT=T.RepeatWrapping;
    texture.repeat.setScalar(1/scale);
    if(kind==='color')texture.colorSpace=T.SRGBColorSpace;
    return texture;
  }
  const noise=`
    varying vec2 stoneMetres;
    float tileHash(vec2 cell){
      vec3 p=fract(vec3(cell.xyx)*.1031);
      p+=dot(p,p.yzx+33.33);
      return fract((p.x+p.y)*p.z);
    }
    float fieldNoise(vec2 pos){
      vec2 cell=floor(pos),f=fract(pos);
      f=f*f*(3.-2.*f);
      return mix(mix(tileHash(cell),tileHash(cell+vec2(1.,0.)),f.x),
                 mix(tileHash(cell+vec2(0.,1.)),tileHash(cell+vec2(1.)),f.x),f.y);
    }
  `;
  function ground(name,scan,size,strength,fragment,roughness){
    const material=new T.MeshStandardMaterial({
      name,side:T.DoubleSide,roughness:.94,metalness:0,envMapIntensity:.30,
      map:channel(scan,'color',size),normalMap:channel(scan,'normal',size),
      normalScale:new T.Vector2(strength,strength)
    });
    material.userData.templeSurface=true;
    material.customProgramCacheKey=()=>name;
    material.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 stoneMetres;\n'+shader.vertexShader.replace(
        '#include <uv_vertex>','#include <uv_vertex>\n stoneMetres=uv;');
      shader.fragmentShader=noise+shader.fragmentShader.replace('#include <map_fragment>',fragment);
      if(roughness)shader.fragmentShader=shader.fragmentShader.replace(
        '#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n'+roughness);
    };
    return material;
  }
  const paving=ground('Weathered limestone flags','cut-rock',2.7,.12,`
    // Align the long joints with the northeast-facing temple steps.
    vec2 m=mat2(.73,.68,-.68,.73)*stoneMetres;
    float row=floor(m.y/.54);
    vec2 flags=vec2(m.x/1.08+.5*mod(row,2.),m.y/.54);
    vec2 cell=floor(flags),f=fract(flags);
    float visibility=1.-smoothstep(.24,.95,max(fwidth(m.x)/1.08,fwidth(m.y)/.54));
    float key=tileHash(cell),faceTone=mix(.52,tileHash(cell+vec2(41.,15.)),visibility);
    vec2 rockUv=vMapUv+vec2(key,faceTone)*2.79;
    vec3 rock=mix(texture2D(map,vMapUv).rgb,texture2D(map,rockUv).rgb,visibility);
    float mineral=dot(rock,vec3(.299,.587,.114));
    float damp=fieldNoise(stoneMetres*.088);
    float abrasion=fieldNoise(rockUv*2.9);
    vec3 grey=mix(vec3(.144,.155,.151),vec3(.248,.250,.228),faceTone);
    grey*=clamp(.73+mineral*3.2,.72,1.28)*(.85+.20*abrasion);
    grey*=1.-smoothstep(.54,.9,damp)*.20;
    vec2 metresToEdge=min(f,1.-f)*vec2(1.08,.54);
    float edge=min(metresToEdge.x,metresToEdge.y);
    float aa=max(.0006,.65*max(fwidth(m.x),fwidth(m.y)));
    float seam=1.-smoothstep(.006-aa,.006+aa,edge);
    float nearDetail=1.-smoothstep(.04,.19,aa);
    vec3 joint=mix(vec3(.060,.058,.049),vec3(.092,.096,.075),damp);
    diffuseColor.rgb*=mix(grey,joint,seam*nearDetail);
  `, 'roughnessFactor=clamp(.86+.08*mix(.5,key,visibility)-.12*smoothstep(.54,.9,damp)+.08*seam,.62,1.);');

  function vegetation(name,scan,size,strength,baseColor){
    const material=ground(name,scan,size,strength,`
      float moisture=fieldNoise(stoneMetres*.053);
      float cover=fieldNoise(stoneMetres*.19+vec2(7.,-16.));
      vec2 offset=vec2(moisture,cover)*.34;
      vec3 blade=texture2D(map,vMapUv+offset).rgb;
      vec3 broad=texture2D(map,mat2(.82,.57,-.57,.82)*vMapUv*.43+offset).rgb;
      vec3 organic=mix(blade,broad,.18);
      float grain=dot(organic,vec3(.28,.60,.12));
      diffuseColor.rgb*=${baseColor}*(.48+3.0*grain)*(.80+.26*moisture+.19*cover);
      diffuseColor.rgb*=mix(vec3(1.05,.97,.86),vec3(.89,1.05,.95),moisture);
    `);
    // An optional geographic alpha mask feathers surveyed garden boundaries
    // into the underlying soil; opaque stone and footpaths still write depth.
    material.transparent=true;
    material.alphaTest=.012;
    material.depthWrite=false;
    material.forceSinglePass=true;
    return material;
  }
  const lawn=vegetation('Temple lawn','meadow',3.1,.45,'vec3(.18,.252,.112)');
  const wood=vegetation('Temple woodland floor','verge',3.8,.52,'vec3(.128,.143,.078)');
  const masks=[];
  let maskGraph=null;
  function bakeMask(kind,material){
    const rings=(window.tamChucGroundCover||[]).filter(area=>area[0]===kind).map(area=>area[1]);
    if(!rings.length)return;
    let west=Infinity,south=Infinity,east=-Infinity,north=-Infinity;
    for(const coords of rings)for(let i=0;i<coords.length;i+=2){
      west=Math.min(west,coords[i]);east=Math.max(east,coords[i]);
      south=Math.min(south,coords[i+1]);north=Math.max(north,coords[i+1]);
    }
    // Input coordinates are millionths of a degree from 105.79 E, 20.54 N.
    west-=64;east+=64;south-=64;north+=64;
    const canvas=document.createElement('canvas');
    const widthMetres=(east-west)*.1042,heightMetres=(north-south)*.1109;
    const scale=Math.min(1,1024/Math.max(widthMetres,heightMetres));
    canvas.width=Math.ceil(widthMetres*scale);canvas.height=Math.ceil(heightMetres*scale);
    const c=canvas.getContext('2d');
    c.fillStyle='#000';c.fillRect(0,0,canvas.width,canvas.height);
    const path=new Path2D();
    for(const coords of rings){
      for(let i=0;i<coords.length;i+=2){
        const x=(coords[i]-west)/(east-west)*canvas.width;
        const y=(north-coords[i+1])/(north-south)*canvas.height;
        if(i)path.lineTo(x,y);else path.moveTo(x,y);
      }
      path.closePath();
    }
    c.fillStyle='#fff';c.fill(path);
    // Fade inwards. Alpha remains near zero where the triangulated polygon
    // physically ends, including concave corners and thin strips of planting.
    c.lineJoin='round';c.lineCap='round';
    const transition=kind==='wood'?5.2:2.9;
    for(let band=9;band>=1;band--){
      const value=Math.round(255*(band-1)/9);
      c.lineWidth=Math.max(.65,2*transition*scale*band/9);
      c.strokeStyle='rgb('+value+' '+value+' '+value+')';
      c.stroke(path);
    }
    const texture=new T.CanvasTexture(canvas);
    texture.name='Tam Chuc '+kind+' margins';texture.flipY=false;
    material.alphaMap=texture;material.needsUpdate=true;
    masks.push({texture,west:105.79+west/1e6,north:20.54+north/1e6,
      east:105.79+east/1e6,south:20.54+south/1e6});
  }
  function setOrigin(graph){
    if(!graph||graph===maskGraph)return;
    if(!masks.length){bakeMask('lawn',lawn);bakeMask('wood',wood);}
    for(const mask of masks){
      const nw=graph.point(mask.west,mask.north),se=graph.point(mask.east,mask.south);
      const sx=1/(se.x-nw.x),sz=1/(se.z-nw.z);
      mask.texture.repeat.set(sx,sz);
      mask.texture.offset.set(-nw.x*sx,-nw.z*sz);
    }
    maskGraph=graph;
  }
  return {paving,lawn,wood,setOrigin};
};

;
// world-signs.js
'use strict';

// Both the road signs and the driving map use the same landmark entrances.
function localDrivingPlaces(graph, x, z, radius) {
  const [lon, lat] = graph.geo(x, z), places = [], seen = new Set();
  for (const sites of [VietnamLandmarks.entries, window.VietnamTourism?.entries || []]) {
    for (const site of sites) {
      if (Math.abs(site.lon - lon) * graph.mx > radius || Math.abs(site.lat - lat) * graph.my > radius) continue;
      const p = graph.point(site.lon, site.lat);
      const distance = Math.hypot(p.x - x, p.z - z);
      if (distance > radius || seen.has(site.name)) continue;
      seen.add(site.name);
      places.push({...p, name: site.name, start: site.start, distance});
    }
  }
  return places.sort((a, b) => a.distance - b.distance);
}

// Work backwards from mapped vehicle entrances. Each entry stores the shortest
// drivable distance from the start of a directed edge to a local destination.
function* signDestinations(graph, places) {
  const routes = new Map(), queue = [];
  function offer(edge, dir, distance, place) {
    const key = edge.id * dir;
    if (distance > 2400 || (routes.get(key)?.distance ?? Infinity) <= distance) return;
    const entry = {edge, dir, distance, place};
    routes.set(key, entry);
    queue.push(entry);
  }
  for (const place of places.slice(0, 24)) {
    yield;
    const p = place.start ? graph.point(...place.start) : place;
    const near = graph.nearest(p.x, p.z, graph.nearby(p.x, p.z, 60));
    if (!near || near.error > 60 ** 2) continue;
    offer(near.edge, 1, near.s, place);
    if (!near.edge.oneway) offer(near.edge, -1, near.edge.length - near.s, place);
  }
  // A short local search. Re-enqueue improved distances and skip superseded ones.
  for (let i = 0; i < queue.length; i++) {
    if ((i & 127) === 0) yield;
    const entry = queue[i], {edge, dir, distance, place} = entry;
    if (routes.get(edge.id * dir) !== entry) continue;
    const node = dir > 0 ? edge.start : edge.end;
    for (const incoming of graph.nodes.get(node) || []) {
      if (incoming.id === edge.id) continue;
      if (incoming.end === node && graph.allows({edge:incoming, dir:1}, node, edge, dir)) offer(incoming, 1, distance + incoming.length, place);
      if (incoming.start === node && !incoming.oneway && graph.allows({edge:incoming, dir:-1}, node, edge, dir)) offer(incoming, -1, distance + incoming.length, place);
    }
  }
  return routes;
}

function junctionRows(options, routes) {
  const choices = options.filter(o => Math.abs(o.angle) < 2.65).map(o => {
    const route = routes.get(o.edge.id * o.dir);
    const magnitude = Math.abs(o.angle);
    const arrow = magnitude < .20 ? '↑' : magnitude < .68 ? (o.angle < 0 ? '↖' : '↗') : (o.angle < 0 ? '←' : '→');
    return {arrow, road:o.edge.name, route};
  });
  const rows = [], used = new Set();
  for (const choice of choices) {
    const route = choice.route;
    // Two exits can reach the same place. Sign the shorter approach.
    const shortest = route && !choices.some(other => other.route?.place === route.place && other.route.distance < route.distance);
    const label = shortest && !used.has(route.place.name) ? route.place.name : choice.road;
    if (!label || used.has(label)) continue;
    used.add(label);
    rows.push({arrow: choice.arrow, label});
    if (rows.length === 3) break;
  }
  return rows;
}

function createWorldSigns(T, scene, small) {
  const displayed = new T.Group(), faces = new Map();
  displayed.name = 'Biển báo và chỉ hướng';
  scene.add(displayed);
  const plane = new T.PlaneGeometry(), mast = new T.CylinderGeometry(.065, .085, 1, 8);
  const postPaint = document.createElement('canvas');
  postPaint.width = 8; postPaint.height = 64;
  const paint = postPaint.getContext('2d');
  paint.fillStyle = '#eeeae0'; paint.fillRect(0, 0, 8, 64);
  paint.fillStyle = '#b93931';
  for (let y = 0; y < 64; y += 16) paint.fillRect(0, y, 8, 8);
  const stripes = new T.CanvasTexture(postPaint); stripes.colorSpace = T.SRGBColorSpace;
  const postMaterial = new T.MeshLambertMaterial({map: stripes});
  const steel = new T.MeshLambertMaterial({color: 0xa2aaa5});
  const backMetal = new T.MeshLambertMaterial({color: 0x969c99, side:T.BackSide});
  const triangle = new T.Shape();
  triangle.moveTo(0,.47); triangle.lineTo(-.49,-.44); triangle.lineTo(.49,-.44); triangle.closePath();
  const triangularBack = new T.ShapeGeometry(triangle);
  const roundBack = new T.CircleGeometry(.49, 48);

  function faceFor(sign, used) {
    const key = JSON.stringify(sign.rows || sign.type);
    used.add(key);
    if (faces.has(key)) return faces.get(key);
    const guide = Boolean(sign.rows), canvas = document.createElement('canvas');
    canvas.width = guide ? 768 : 192;
    canvas.height = guide ? 104 * sign.rows.length + 28 : sign.type === 'one-way' || sign.type === 'no-entry' ? 192 : 176;
    const g = canvas.getContext('2d');
    g.lineJoin = g.lineCap = 'round';
    if (guide) {
      g.fillStyle = '#145798'; g.fillRect(0, 0, canvas.width, canvas.height);
      g.strokeStyle = '#f4f3de'; g.lineWidth = 5;
      g.strokeRect(9, 9, canvas.width - 18, canvas.height - 18);
      g.fillStyle = '#fffdf0'; g.textBaseline = 'middle';
      sign.rows.forEach(({arrow, label, distance}, i) => {
        const y = 67 + i * 104;
        g.font = 'bold 78px Arial'; g.fillText(arrow, 30, y);
        g.font = 'bold 58px "Segoe UI", sans-serif'; g.fillText(label, 133, y, distance ? 440 : 600);
        if (distance) {
          g.font = '600 39px "Segoe UI", sans-serif'; g.textAlign = 'right';
          g.fillText(distance, 730, y, 140); g.textAlign = 'left';
        }
      });
    } else if (sign.type === 'no-entry') {
      g.fillStyle = '#fffaf0'; g.beginPath(); g.arc(96,96,94,0,2*Math.PI); g.fill();
      g.fillStyle = '#c92727'; g.beginPath(); g.arc(96,96,91,0,2*Math.PI); g.fill();
      g.fillStyle = '#fffaf0'; g.fillRect(32,79,128,34);
    } else if (sign.type === 'one-way') {
      g.fillStyle = '#fffaf0'; g.fillRect(0,0,192,192);
      g.fillStyle = '#155395'; g.fillRect(4,4,184,184);
      g.fillStyle = '#fffaf0'; g.beginPath(); g.moveTo(96,20); g.lineTo(149,82);
      g.lineTo(117,82); g.lineTo(117,166); g.lineTo(75,166); g.lineTo(75,82); g.lineTo(43,82); g.closePath(); g.fill();
    } else {
      g.beginPath(); g.moveTo(96, 12); g.lineTo(182, 160); g.lineTo(10, 160); g.closePath();
      g.fillStyle = '#ffcd38'; g.fill(); g.strokeStyle = '#c32927'; g.lineWidth = 13; g.stroke();
      g.strokeStyle = '#252621'; g.lineWidth = 15; g.beginPath();
      g.moveTo(96, 136);
      if (sign.type.startsWith('junction')) {
        if (sign.type === 'junction-T') {
          g.lineTo(96, 93); g.moveTo(62,93); g.lineTo(130,93);
        } else {
          g.lineTo(96, 66);
          g.moveTo(sign.type === 'junction-right' ? 96 : 62, 103);
          g.lineTo(sign.type === 'junction-left' ? 96 : 130, 103);
        }
      } else {
        const dx = sign.type === 'bend-right' ? 27 : -27;
        g.lineTo(96, 114); g.quadraticCurveTo(96, 97, 96 + dx * .5, 87); g.lineTo(96 + dx, 72);
      }
      g.stroke();
    }
    const map = new T.CanvasTexture(canvas); map.colorSpace = T.SRGBColorSpace;
    const mat = new T.MeshLambertMaterial({map, alphaTest: .45});
    faces.set(key, mat); return mat;
  }

  let displayedFaces = new Set();
  function trim(used) {
    for (const [key, mat] of faces) if (!used.has(key)) {
      mat.map.dispose(); mat.dispose(); faces.delete(key);
    }
  }
  function* prepare(graph, edges, cx, cz, clear, ground, register) {
    const group = new T.Group();
    const used = new Set(), candidates = [], placed = [];
    if (!graph) return () => {displayed.clear();displayedFaces=used;trim(used);};
    const routes = yield* signDestinations(graph, localDrivingPlaces(graph, cx, cz, 1450));
    function candidate(edge, dir, s, type, rows) {
      const at = {edge, dir, s}, p = graph.sample(at);
      const distance = Math.hypot(p.x - cx, p.z - cz);
      if (distance < 470) candidates.push({at, type, rows, distance});
    }
    let scanned = 0;
    for (const edge of edges) {
      if ((++scanned & 15) === 0) yield;
      if (edge.oneway && edge.length >= 10) {
        const inset = Math.min(12, edge.length * .35);
        for (const dir of [1, -1]) {
          const node = dir === 1 ? edge.start : edge.end;
          const links = (graph.nodes.get(node) || []).filter(other => other !== edge);
          // An OSM way can be split mid-block. Sign actual entrances from other streets.
          const entrance = links.some(other => !other.oneway || (links.length > 1 && other.end === node));
          if (entrance) candidate(edge, dir, dir === 1 ? inset : edge.length-inset, dir === 1 ? 'one-way' : 'no-entry');
        }
      }
      if (edge.length < 19) continue;
      for (const dir of edge.oneway ? [1] : [1, -1]) {
        const station = d => dir === 1 ? d : edge.length - d;
        const lead = Math.min(36, edge.length * .58);
        const options = graph.options({edge, dir});
        if (options.length > 1) {
          const rows = junctionRows(options, routes);
          const left = options.some(o => o.angle < -.43), right = options.some(o => o.angle > .43);
          const through = options.some(o => Math.abs(o.angle) <= .43);
          const warning = !through && left && right ? 'junction-T' : left && !right ? 'junction-left'
            : right && !left ? 'junction-right' : 'junction';
          candidate(edge, dir, station(edge.length - lead), warning, rows.length ? rows : null);
          if (rows.length && edge.length > 120) candidate(edge, dir, station(edge.length - 83), warning);
        } else if (options.length === 1 && Math.abs(options[0].angle) > .65) {
          candidate(edge, dir, station(edge.length - lead), options[0].angle > 0 ? 'bend-right' : 'bend-left');
        }
        // Reassurance boards also work on long approaches before the next junction.
        const route = routes.get(edge.id * dir);
        for (let d = 69; route && d < edge.length - 65; d += 280) {
          const left = route.distance - d;
          if (left > 28 && left <= 1600) {
            const distance = left >= 1000 ? (left / 1000).toFixed(1).replace('.', ',') + ' km' : Math.round(left / 10) * 10 + ' m';
            candidate(edge, dir, station(d), 'guide', [{arrow:'↑', label:route.place.name, distance}]);
          }
        }
        for (let i = 1; i < edge.points.length - 1; i++) {
          const s = edge.dist[i], before = s - dir * 20;
          if (before < 5 || before > edge.length - 5) continue;
          const a = graph.sample({edge, dir, s:before}).yaw, b = graph.sample({edge, dir, s:s + dir * 10}).yaw;
          const angle = Math.atan2(Math.sin(b - a), Math.cos(b - a));
          if (Math.abs(angle) > .65) candidate(edge, dir, before, angle > 0 ? 'bend-right' : 'bend-left');
        }
      }
    }
    const rank = sign => sign.distance + (sign.rows ? 40 : 0);
    candidates.sort((a, b) => rank(a) - rank(b) || a.at.edge.id - b.at.edge.id);
    for (const sign of candidates) {
      if ((++scanned & 15) === 0) yield;
      if (placed.length >= (small ? 19 : 32)) break;
      const {at, rows} = sign, width = rows ? 4.45 : 1.22;
      const square = sign.type === 'one-way', round = sign.type === 'no-entry';
      const height = rows ? width * (104 * rows.length + 28) / 768 : (square || round ? width : 1.12);
      const offset = worldRoadHalfWidth(at.edge) + width / 2;
      let p;
      for (const along of [0, -5, 5, -10]) {
        const s = at.s + along * at.dir;
        if (s < 2 || s > at.edge.length - 2) continue;
        const q = graph.sample({...at, s}, offset + 1.1);
        if (!clear(q.x, q.z, width / 2)) continue;
        const crowded = placed.some(a => Math.hypot(q.x-a.x, q.z-a.z) < (Math.cos(a.yaw-q.yaw) > .7 ? 19 : 4));
        if (!crowded) {p = {...q,s}; break;}
      }
      if (!p) continue;
      placed.push(p);
      // The front of a Three.js plane points along +Z. Face approaching traffic.
      const x = p.x - cx, z = p.z - cz, yaw = -p.yaw, base = ground(p.x, p.z, at.edge, p.s), y = base + 2.3 + height / 2;
      const face = new T.Mesh(plane, faceFor(sign, used));
      face.position.set(x, y, z); face.rotation.y = yaw; face.scale.set(width, height, 1);
      face.name = rows ? rows.map(r => r.arrow + ' ' + r.label).join(' / ') : sign.type;
      group.add(face);
      const back = new T.Mesh(rows || square ? plane : round ? roundBack : triangularBack, backMetal);
      back.position.copy(face.position); back.rotation.copy(face.rotation); back.scale.copy(face.scale);
      back.translateZ(-.025); group.add(back);
      for (const lateral of rows ? [-1.28, 1.28] : [0]) {
        const px = x + lateral * Math.cos(yaw), pz = z - lateral * Math.sin(yaw);
        const bottom = ground(px + cx, pz + cz, at.edge, p.s), top = y + height * .32;
        const pole = new T.Mesh(mast, rows ? steel : postMaterial);
        pole.position.set(px, (top + bottom) / 2, pz);
        pole.position.x -= .11 * Math.sin(yaw); pole.position.z -= .11 * Math.cos(yaw);
        pole.scale.y = top - bottom; group.add(pole);
        register({id:'road-sign:' + at.edge.id + ':' + at.dir + ':' + at.s + ':' + lateral,
          kind:'pole', x:pole.position.x, z:pole.position.z, radius:.085, baseY:bottom,height:top-bottom, parts:[]});
      }
    }
    return () => {
      displayed.clear();displayed.add(group);displayedFaces=used;trim(used);
    };
  }
  return {prepare, cancel:()=>trim(displayedFaces)};
}

;
// driving-map.js
'use strict';

function createDrivingMap(getView) {
  const dialog = document.getElementById('drivingMap'), canvas = document.getElementById('areaMap');
  const g = canvas.getContext('2d'), spans = [340, 580, 1000, 1700, 2800];
  let zoom = 2, dx = 0, dz = 0, scale = 1, drag = null, frame = 0;
  function redraw() {
    if (dialog.open && !frame) frame = requestAnimationFrame(() => { frame = 0; if (dialog.open) draw(); });
  }
  function draw() {
    const {graph, car, edge, water, places, duel, guide, amenities,furniture} = getView();
    const w = canvas.clientWidth, h = canvas.clientHeight, ratio = Math.min(devicePixelRatio || 1, 2);
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) {
      canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    }
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.fillStyle = '#d8e1d1'; g.fillRect(0, 0, w, h);
    scale = Math.max(w, h) / spans[zoom];
    const halfW = w / (2 * scale), halfH = h / (2 * scale);
    // Stay inside the local road tiles already streamed for this drive.
    dx = clamp(dx, halfW - 1800, 1800 - halfW); dz = clamp(dz, halfH - 1800, 1800 - halfH);
    const cx = car.x + dx, cz = car.z + dz;
    const px = x => w / 2 + (x - cx) * scale, py = z => h / 2 + (z - cz) * scale;
    function path(points) {
      g.beginPath();
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (i) g.lineTo(px(p.x), py(p.z)); else g.moveTo(px(p.x), py(p.z));
      }
    }
    const labels = [];
    for (const f of water?.features || []) {
      if (f.x1 < cx - halfW || f.x0 > cx + halfW || f.z1 < cz - halfH || f.z0 > cz + halfH) continue;
      path(f.points);
      if (f.kind === 'lake') { g.fillStyle = '#9cc8cf'; g.fill(); }
      else { g.strokeStyle = '#98c4cb'; g.lineWidth = Math.max(1.2, scale * (f.width || 7)); g.stroke(); }
    }
    g.lineCap = g.lineJoin = 'round';
    const edges = graph.nearby(cx, cz, Math.max(halfW, halfH) + 12);
    const major = e => /^(motorway|trunk|primary|secondary)/.test(e.kind);
    const roads = [edges.filter(e => !major(e)), edges.filter(major)];
    for (let kind = 0; kind < roads.length; kind++) {
      const width = Math.min(11, Math.max(kind ? 3 : 1.5, (kind ? 9 : 5) * scale));
      for (const border of [true, false]) {
        g.lineWidth = width + (border ? 1.8 : 0);
        g.strokeStyle = kind ? (border ? '#ab9472' : '#ffe3a2') : (border ? '#afbbae' : '#f6f5e9');
        for (const e of roads[kind]) { path(e.points); g.stroke(); }
      }
    }
    path(edge.points); g.lineWidth = Math.max(3, Math.min(8, 7 * scale)); g.strokeStyle = '#487354'; g.stroke();
    if (guide) {
      g.strokeStyle='#1d7960'; g.lineWidth=4;
      for(const points of guide.visiblePaths(edges)){path(points);g.stroke();}
      if (guide.detour) {
        path(guide.detour.points); g.setLineDash([6,4]); g.strokeStyle='#94421e'; g.stroke(); g.setLineDash([]);
      }
      g.fillStyle='#185443'; g.beginPath(); g.arc(px(guide.finish.x),py(guide.finish.z),6,0,Math.PI*2); g.fill();
    }
    if (duel) {
      const points = [];
      for (let m = duel.player; m < duel.length; m += 4) points.push(graph.sample(duel.at(m)));
      points.push(graph.sample(duel.at(duel.length)));
      path(points); g.strokeStyle = '#558e1b'; g.lineWidth = 4; g.setLineDash([7, 5]); g.stroke(); g.setLineDash([]);
      g.beginPath(); g.arc(px(duel.actor.x), py(duel.actor.z), 5, 0, Math.PI * 2);
      g.fillStyle = '#c74b32'; g.fill();
    }

    // Reserve space before painting text, starting with the car and named sights.
    const vx = px(car.x), vy = py(car.z), occupied = [[vx-17, vy-19, vx+17, vy+19]], names = new Set();
    function label(name, x, y, color, symbol) {
      if (!name || names.has(name)) return;
      g.font = (symbol ? 'bold ' : '600 ') + '13px "Segoe UI", sans-serif';
      const width = g.measureText(name).width, box = [x - 5, y - 11, x + width + (symbol ? 18 : 5), y + 11];
      if (box[0] < 6 || box[1] < 6 || box[2] > w-6 || box[3] > h-6 ||
        occupied.some(b => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) return;
      occupied.push(box); names.add(name);
      if (symbol) {
        g.beginPath(); g.arc(x, y, 4.8, 0, Math.PI * 2); g.fillStyle=color; g.fill();
        g.strokeStyle='#fff9e9'; g.lineWidth=2; g.stroke(); x+=10;
      }
      g.textBaseline = 'middle'; g.lineWidth = 3.5; g.strokeStyle = '#f3f4e7'; g.strokeText(name, x, y);
      g.fillStyle = color; g.fillText(name, x, y);
    }
    for (const p of places) label(p.name, px(p.x), py(p.z), '#754532', true);
    for (const p of amenities) if (p.name) label(p.name, px(p.x), py(p.z), '#305e63', true);
    for (const e of [edge, ...roads[1], ...roads[0]]) {
      if (!e.name || names.has(e.name)) continue;
      const p = graph.sample({edge:e, dir:1, s:e.length/2});
      labels.push({name:e.name, x:px(p.x), y:py(p.z)});
    }
    for (const l of labels) label(l.name, l.x, l.y - 9, '#415347', false);
    g.save(); g.translate(vx, vy); g.rotate(car.yaw);
    g.beginPath(); g.moveTo(0,-13); g.lineTo(9,9); g.lineTo(0,5.5); g.lineTo(-9,9); g.closePath();
    g.fillStyle = '#153f35'; g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke(); g.fill(); g.restore();
    let visibleFixtures=0;
    if(zoom===0)for(const p of furniture||[]){
      const x=px(p.worldX),y=py(p.worldZ);
      if(x<0||y<0||x>w||y>h||Math.hypot(x-px(car.x),y-py(car.z))<13)continue;
      g.beginPath();g.strokeStyle='#364742';g.lineWidth=1;
      if(p.kind==='lamp'){g.fillStyle='#ffe298';g.arc(x,y,2.8,0,Math.PI*2);}
      else{g.fillStyle='#bb7560';g.rect(x-2,y-2,4,4);}
      g.fill();g.stroke();visibleFixtures++;
    }
    document.getElementById('mapFixtureKey').hidden=!visibleFixtures;
    const metres = [20, 50, 100, 200, 500, 1000].filter(m => m * scale <= Math.min(110, w * .27)).at(-1) || 20;
    const bar = document.getElementById('mapScale');
    bar.style.width = metres * scale + 'px'; bar.textContent = metres >= 1000 ? metres/1000 + ' km' : metres + ' m';
    document.getElementById('mapZoomIn').disabled = zoom === 0;
    document.getElementById('mapZoomOut').disabled = zoom === spans.length - 1;
  }
  function changeZoom(step) { zoom = clamp(zoom + step, 0, spans.length - 1); redraw(); }
  document.getElementById('mapZoomIn').onclick = () => changeZoom(-1);
  document.getElementById('mapZoomOut').onclick = () => changeZoom(1);
  document.getElementById('mapRecenter').onclick = () => {dx = dz = 0; redraw();};
  document.getElementById('closeDrivingMap').onclick = () => dialog.close();
  canvas.addEventListener('wheel', e => {e.preventDefault(); if (e.deltaY) changeZoom(Math.sign(e.deltaY));}, {passive:false});
  canvas.addEventListener('pointerdown', e => {
    if (e.button || drag) return;
    canvas.setPointerCapture(e.pointerId); drag = {id:e.pointerId, x:e.clientX, y:e.clientY};
  });
  canvas.addEventListener('pointermove', e => {
    if (drag?.id !== e.pointerId) return;
    dx -= (e.clientX - drag.x) / scale; dz -= (e.clientY - drag.y) / scale;
    drag.x = e.clientX; drag.y = e.clientY; redraw();
  });
  canvas.addEventListener('lostpointercapture', () => {drag = null;});
  dialog.addEventListener('keydown', e => {
    const step = 75 / scale;
    switch (e.key) {
      case 'ArrowLeft': dx -= step; break;
      case 'ArrowRight': dx += step; break;
      case 'ArrowUp': dz -= step; break;
      case 'ArrowDown': dz += step; break;
      case '+': case '=': changeZoom(-1); break;
      case '-': changeZoom(1); break;
      default: return;
    }
    e.preventDefault(); redraw();
  });
  new ResizeObserver(redraw).observe(canvas);
  return {open(street) {
    dx = dz = 0; drag = null;
    document.getElementById('drivingMapStreet').textContent = street;
    dialog.showModal(); draw();
  }};
}

;
// shen-long.js
'use strict';

// All parts share one world-space anchor. The driver can pass the apparition,
// look away, or lose sight of it behind a ridge.
function createShenLong(T, scene, dragonMap) {
  const root = new T.Group();
  root.name = 'Shen Long ban điều ước';
  root.visible = false;
  scene.add(root);
  const quad = new T.PlaneGeometry(1, 1);
  function plane(map, additive = false) {
    const material = new T.MeshBasicMaterial({map, transparent:true, depthWrite:false,
      toneMapped:false, fog:false, side:T.DoubleSide, blending:additive ? T.AdditiveBlending : T.NormalBlending});
    const mesh = new T.Mesh(quad, material);
    root.add(mesh);
    return mesh;
  }
  function texture(size, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    draw(canvas.getContext('2d'), size);
    const map = new T.CanvasTexture(canvas);
    map.colorSpace = T.SRGBColorSpace;
    return map;
  }
  const glow = texture(64, (g, size) => {
    const r = size / 2, halo = g.createRadialGradient(r,r,0,r,r,r);
    halo.addColorStop(0, '#fff7cc'); halo.addColorStop(.14, '#ffdb83ef');
    halo.addColorStop(.5, '#efa73c62'); halo.addColorStop(1, '#e88d2700');
    g.fillStyle = halo; g.fillRect(0,0,size,size);
  });
  const recipient = plane(texture(128, g => {
    const shape = (colour, path) => { g.fillStyle = colour; g.fill(new Path2D(path)); };
    // The summoner raises both hands above a ring of seven amber spheres.
    shape('#765328', 'M14 103 Q30 92 45 96 Q47 89 65 92 Q78 86 88 94 Q105 92 116 102 Q92 115 53 110 Q30 111 14 103Z');
    shape('#f8c765', 'M16 102 Q35 91 52 98 Q68 86 90 95 L110 100 Q88 97 76 102 Q52 99 33 104Z');
    shape('#212629', 'M52 63 L72 63 L76 94 L84 98 L70 99 L63 78 L58 96 L46 97 L49 92Z');
    shape('#bc5c29', 'M51 43 L60 38 L69 40 L77 47 L73 68 Q61 73 49 66Z');
    shape('#e8ad54', 'M49 49 L35 40 L29 24 L34 21 L42 35 L57 42Z M68 42 L81 32 L89 16 L94 18 L87 38 L74 52Z');
    shape('#ffdaa0', 'M29 25 L25 17 L27 12 L34 20 L34 25Z M88 19 L90 10 L94 7 L95 16 L94 21Z');
    shape('#f3bd7b', 'M54 32 Q47 19 61 16 Q73 15 70 27 L73 28 L68 34 L64 39 L56 38Z');
    shape('#20282a', 'M51 31 Q44 25 49 18 L45 17 L53 14 L50 10 L59 13 Q68 7 73 18 L69 21 L62 19 L57 23 L57 30Z');
    for (let i=0; i<7; i++) {
      const a=i*Math.PI*2/7;
      const x=65+47*Math.cos(a), y=101+8*Math.sin(a);
      g.beginPath(); g.arc(x,y,3.4,0,2*Math.PI); g.fillStyle='#ffba46'; g.fill();
      g.beginPath(); g.arc(x-.8,y-1,1.3,0,2*Math.PI); g.fillStyle='#fff4ab'; g.fill();
    }
  }));
  recipient.scale.set(20,20,1); recipient.position.set(66,-20,.4); recipient.renderOrder=3;
  const dragon = plane(dragonMap);
  dragon.scale.set(106,106*608/553,1); dragon.renderOrder=1;
  const aura = plane(glow,true);
  aura.material.color.setHex(0xd7b96e); aura.scale.set(143,148,1); aura.position.z=-1;
  const ray = plane(glow,true), spark = plane(glow,true), blessing = plane(glow,true);
  ray.renderOrder=2; spark.renderOrder=4; blessing.renderOrder=2;
  // The mouth is at (0.764, 0.416) measured from the top left of the dragon texture.
  const mouthX=(.764-.5)*dragon.scale.x, mouthY=(.5-.416)*dragon.scale.y;
  const handX=70, handY=-12;
  const smooth = T.MathUtils.smoothstep;
  return {
    hide() { root.visible=false; },
    render(f, originX, originZ) {
      const t=f.age;
      root.visible=t>1 && t<15;
      root.position.set(f.x-originX,f.altitude,f.z-originZ);
      root.rotation.y=-f.yaw; root.scale.setScalar(f.range/520);
      const reveal=smooth(t,1,3.4)*(1-smooth(t,12.6,15));
      const wish=smooth(t,3.5,5.6)*(1-smooth(t,11.8,13.7));
      dragon.position.y=1.8*Math.sin(t*.7);
      dragon.rotation.z=.018*Math.sin(t*.46);
      dragon.material.opacity=reveal; aura.material.opacity=reveal*.21;
      const c=Math.cos(dragon.rotation.z), s=Math.sin(dragon.rotation.z);
      const x=mouthX*c-mouthY*s, y=mouthX*s+mouthY*c+dragon.position.y;
      const dx=handX-x, dy=handY-y;
      ray.position.set((x+handX)/2,(y+handY)/2,.25);
      ray.rotation.z=Math.atan2(-dx,dy); ray.scale.set(5,Math.hypot(dx,dy)*1.12,1);
      ray.material.opacity=wish*.86;
      const travel=((Math.max(0,t-4))%2.2)/2.2;
      spark.position.set(x+dx*travel,y+dy*travel,.5);
      spark.scale.setScalar(7); spark.material.opacity=wish*Math.sin(Math.PI*travel);
      blessing.position.set(handX,handY,.2); blessing.scale.setScalar(15+6*Math.sin(t*1.5));
      blessing.material.opacity=wish*.92;
      recipient.material.opacity=reveal;
      return smooth(t,0,1.8)*(1-smooth(t,13.3,16));
    }
  };
}

;
// sky-sightings.js
'use strict';

// Small, animated profiles in world space. Foreground trees, ridges and buildings
// can hide a sighting just as they hide other scenery.
function paintSkyProfile(g, kind, phase) {
  g.clearRect(0, 0, 256, 128);
  g.lineCap = g.lineJoin = 'round';
  function shape(color, path) {
    g.fillStyle = color;
    g.fill(new Path2D(path));
  }
  function stroke(color, width, path) {
    g.strokeStyle = color;
    g.lineWidth = width;
    g.stroke(new Path2D(path));
  }
  function oval(color, x, y, rx, ry) {
    g.fillStyle = color;
    g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill();
  }
  if (kind === 'saucer') {
    const metal = g.createLinearGradient(0, 38, 0, 83);
    metal.addColorStop(0, '#ecf4ed'); metal.addColorStop(.48, '#889b9e');
    metal.addColorStop(.64, '#d2ddd4'); metal.addColorStop(.68, '#4b5d67'); metal.addColorStop(1, '#283b4e');
    shape('#456776', 'M92 57 Q100 27 129 28 Q155 28 165 57Z');
    shape('#b2dadc', 'M100 49 Q111 29 131 32 Q113 33 107 49Z');
    shape(metal, 'M19 62 Q42 54 96 47 Q129 51 162 47 Q210 54 237 62 Q213 79 162 82 Q125 95 87 81 Q43 77 19 62Z');
    stroke('#e2eee2', 2, 'M24 63 Q126 75 230 63');
    for (let i = 0; i < 7; i++) {
      const a = phase + i * Math.PI * 2 / 7;
      if (Math.sin(a) > 0) oval('#a9ebda', 128 + 87 * Math.cos(a), 67 + 8 * Math.sin(a), 3, 1.8);
    }
  } else if (kind === 'dragon') {
    const back = x => 62 + 18 * Math.sin(x / 25 - phase);
    const neck = back(191);
    // Taper the coils towards the tail. Spines and claws follow the same spine.
    for (let x = 12; x < 192; x += 2) {
      const y = back(x), next = back(x + 3), r = 1 + 6 * Math.min(1, (x - 12) / 78);
      if (x % 8 === 4) shape('#c18c42', `M${x-4} ${y-r+2} l0 -9 l7 7Z`);
      stroke('#355955', r * 2, `M${x} ${y} L${x+3} ${next}`);
      stroke('#b69c61', r * .55, `M${x} ${y+r*.58} L${x+3} ${next+r*.58}`);
    }
    for (const x of [86, 158]) {
      const y = back(x);
      stroke('#496754', 4, `M${x} ${y} q-6 10 1 15 l-7 6 m7 -6 l-1 8 m1 -8 l4 5`);
    }
    g.save(); g.translate(190, neck);
    shape('#b07a32', 'M1 3 Q-10 6 -19 13 L-12 3 -25 2 -11 -4 -22 -11 -6 -8 -14 -20 3 -9Z');
    stroke('#e3bd73', 3, 'M4 -9 Q-5 -17 -7 -28 M-4 -19 l-8 -2 M9 -8 Q5 -19 9 -26');
    shape('#426956', 'M-5 6 Q-6 -13 7 -15 L15 -11 18 -5 34 -7 39 -3 34 3 16 5 28 8 20 12 8 9 0 12Z');
    oval('#ffcb59', 11, -7, 2.5, 1.8);
    stroke('#d7b575', 1.7, 'M29 1 Q52 5 52 -12 Q50 -18 46 -14 M29 4 Q48 14 55 5');
    g.restore();
  } else if (kind === 'phoenix') {
    const flap = Math.sin(phase), tip = 37 * flap;
    for (let i = 0; i < 5; i++) {
      const y = 68 + (i - 2) * 5, wave = 7 * Math.sin(phase + i * .65);
      shape(i % 2 ? '#d9933c' : '#a74d32', `M136 65 Q91 ${54+i*6} 73 ${y+wave} T${11+i*6} ${y+wave+(i-2)*7} Q37 ${y+wave+14} 78 ${y+6} T136 70Z`);
    }
    const wing = 'M0 0 Q-9 -17 -39 -28 L-78 -43 Q-70 -30 -52 -22 L-73 -31 Q-61 -17 -46 -14 L-62 -18 Q-50 -6 -31 -4 L-43 -5 Q-27 5 -6 8Z';
    g.save(); g.translate(146, 61); g.transform(.77, .1, .32, .65 - .32*flap, 0, 0); shape('#9d5235', wing); g.restore();
    shape('#c97933', 'M104 72 Q125 65 139 56 Q156 51 176 55 Q188 57 197 45 Q199 36 209 36 Q219 36 221 43 L233 46 219 48 Q215 59 205 61 Q190 65 178 72 Q150 87 126 75Z');
    shape('#e1a945', 'M202 40 Q203 26 191 19 Q208 21 212 35 Q213 23 207 17 Q220 24 216 38Z');
    g.save(); g.translate(151, 63); g.transform(1, 0, -.18, .42 + tip / 30, 0, 0);
    shape('#b95e32', wing); stroke('#e0a143', 3, 'M-4 0 Q-26 -17 -61 -32');
    g.restore();
  } else if (kind === 'flyer') {
    shape('#973d38', 'M168 60 Q133 43 110 55 T53 50 Q107 70 135 65 L85 73 Q125 78 158 68Z');
    stroke('#263743', 10, 'M133 67 L101 70 66 67 M132 64 L100 60 75 59');
    shape('#405966', 'M122 60 Q143 52 165 56 L181 62 167 70 131 72Z');
    stroke('#425661', 7, 'M164 61 L188 63 209 56 M158 66 L140 76 127 74');
    oval('#ad8061', 181, 54, 8, 8); oval('#32373a', 180, 51, 8, 5);
    stroke('#b98f72', 5, 'M207 56 l7 -1');
  } else {
    const scarf = Math.sin(phase) * 5;
    shape('#77a7a6', 'M27 98 Q78 93 111 91 L97 98 34 102Z');
    shape('#bfdfd7', 'M60 94 L189 87 229 80 209 91 64 101Z');
    stroke('#99743b', 4, 'M42 99 L67 96 M65 89 l3 13');
    stroke('#30383d', 6, 'M141 64 L134 78 123 90 117 92 M146 63 L154 78 159 88 165 88');
    shape('#455962', 'M136 38 Q143 34 151 40 L155 54 148 59 158 73 Q139 74 115 81 Q126 69 131 56Z');
    stroke('#627579', 6, 'M147 43 L158 52 172 47 M136 44 L123 55 113 52');
    oval('#b68b69', 144, 31, 6, 8); oval('#312f33', 143, 27, 7, 5); oval('#312f33', 140, 21, 4, 4);
    shape('#a15440', `M139 37 Q120 ${35+scarf} 111 42 T83 ${40+scarf} Q101 52 118 44 L140 40Z`);
  }
}

function createSkySightings(T, scene, random = Math.random, ground = () => 0) {
  const kinds = ['saucer', 'dragon', 'phoenix', 'flyer', 'sword'];
  let timer, flight, lastKind, sprite, context, frame = -1;
  let wish, dragonMap;
  function interval() { return 25 + random() * 15; }
  function reset() {
    timer = interval(); flight = null; lastKind = null;
    if (sprite) sprite.visible = false;
    wish?.hide();
  }
  function launch(car, aspect) {
    const choices = kinds.filter(kind => kind !== lastKind);
    const kind = choices[Math.floor(random() * choices.length)];
    const human = kind === 'sword' || kind === 'flyer';
    const range = human ? 120 : 360;
    const sign = random() < .5 ? -1 : 1;
    flight = {kind, age:0, duration:6 + random()*3, x:car.x, z:car.z, yaw:car.yaw,
      altitude:car.y + range * (.22 + random() * .09), range, sign,
      span:range * Math.min(.68, aspect * .46), drift:Math.max(0,car.speed)*.8,
      width:human ? (kind === 'sword' ? 11 : 9) : kind === 'dragon' ? 53 : 39};
    lastKind = kind; frame = -1;
    if (!sprite) {
      const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 128;
      context = canvas.getContext('2d');
      const map = new T.CanvasTexture(canvas);
      map.colorSpace = T.SRGBColorSpace; map.generateMipmaps = false; map.minFilter = T.LinearFilter;
      sprite = new T.Sprite(new T.SpriteMaterial({map, transparent:true, depthWrite:false}));
      sprite.name = 'Thoáng thấy trên trời'; scene.add(sprite);
    }
    sprite.scale.set(flight.width, flight.width / 2, 1);
    sprite.material.map.repeat.x = sign; sprite.material.map.offset.x = sign < 0 ? 1 : 0;
  }
  function summon(car, aspect) {
    const range = 520 + Math.max(0,car.speed)*10;
    const bearing = car.yaw + (.025 + random()*.09)*Math.min(1,aspect);
    const x = car.x+range*Math.sin(bearing), z = car.z-range*Math.cos(bearing);
    const ridge = Math.max(car.y,ground(x,z),ground((car.x+x)/2,(car.z+z)/2));
    flight = {kind:'shen-long', age:0, waiting:0, x,z, range, yaw:bearing, altitude:ridge+range*.305};
    dragonMap ??= new T.TextureLoader().load('sky-shen-long.webp', undefined, undefined, () => {
      dragonMap.dispose(); dragonMap=null;
    });
    dragonMap.colorSpace=T.SRGBColorSpace;
  }
  function update(dt, car, originX, originZ, aspect, sheltered) {
    if (!car.driving || sheltered) {
      if (sprite) sprite.visible = false;
      wish?.hide();
      return 0;
    }
    if (!flight) {
      if (Math.abs(car.speed) < 1 || (timer -= dt) > 0) return 0;
      timer = interval();
      const roll = random();
      if (roll < .04) summon(car, aspect);
      else if (roll < .26) launch(car, aspect);
      else return 0;
    }
    const f = flight;
    if (f.kind === 'shen-long') {
      if (!dragonMap?.image) {
        if (!dragonMap || (f.waiting+=dt)>8) flight=null;
        return 0;
      }
      wish ??= createShenLong(T, scene, dragonMap);
      f.age += dt;
      if (f.age >= 16) { wish.hide(); flight=null; timer+=90; return 0; }
      return wish.render(f, originX, originZ);
    }
    f.age += dt;
    const progress = f.age / f.duration;
    if (progress >= 1) { sprite.visible = false; flight = null; timer += 65; return 0; }
    const ahead = f.range + f.drift * f.age;
    const across = (2 * progress - 1) * f.span * f.sign;
    const sin = Math.sin(f.yaw), cos = Math.cos(f.yaw);
    const lift = f.kind === 'saucer' ? 2 * progress ** 4 : Math.sin(progress * Math.PI);
    sprite.position.set(f.x-originX + ahead*sin + across*cos, f.altitude + .06*f.range*lift,
      f.z-originZ - ahead*cos + across*sin);
    sprite.visible = true;
    sprite.material.opacity = .88 * Math.min(1, f.age / .8, (f.duration-f.age) / 1.1);
    const nextFrame = Math.floor(f.age * 12);
    if (nextFrame !== frame) {
      frame = nextFrame;
      paintSkyProfile(context, f.kind, nextFrame * .24);
      sprite.material.map.needsUpdate = true;
    }
    return 0;
  }
  reset();
  return {update, reset};
}

;
// world-bakery.js
'use strict';

// A street vendor in Hà Nội's old quarter. The stool stays at the same stall
// after breakfast and the cart returns the next morning (Vietnam time).
function createBreakfastStall(T, scene) {
  let stand, cart, site, previousGraph, nextClock = 0, greeted = false;
  function build() {
    stand = new T.Group(); stand.name = 'Góc bánh mì'; scene.add(stand);
    cart = new T.Group(); stand.add(cart);
    const box = new T.BoxGeometry(), tube = new T.CylinderGeometry(1, 1, 1, 12);
    const rim = new T.TorusGeometry(.29, .034, 6, 18), loaf = new T.SphereGeometry(1, 8, 6);
    const paint = color => new T.MeshLambertMaterial({color});
    const red = paint(0xa7422c), cream = paint(0xf3de9e), steel = paint(0x91a3a1),
      rubber = paint(0x343937), bread = paint(0xda983e), blue = paint(0x276986);
    function part(parent, geo, mat, x, y, z, sx=1, sy=1, sz=1) {
      const item = new T.Mesh(geo, mat);
      item.position.set(x,y,z); item.scale.set(sx,sy,sz); parent.add(item); return item;
    }
    part(stand,box,blue,1.08,.34,0,.36,.085,.36);
    for (const dx of [-.13,.13]) for (const dz of [-.13,.13])
      part(stand,box,blue,1.08+dx,.16,dz,.055,.32,.055);
    for (const z of [-.41,.41]) {
      part(cart,rim,rubber,-.42,.30,z);
      for (let i=0;i<4;i++) part(cart,box,steel,-.42,.30,z,.016,.55,.016).rotation.z=i*Math.PI/4;
    }
    part(cart,box,steel,.52,.30,0,.05,.58,.05);
    part(cart,box,red,0,.69,0,1.45,.44,.73);
    part(cart,box,cream,0,.94,0,1.53,.07,.78);
    for (const x of [-.66,.66]) for (const z of [-.32,.32])
      part(cart,tube,steel,x,1.36,z,.025,.82,.025);
    for (let i=0;i<6;i++)
      part(cart,loaf,bread,(i%3-1)*.38,1.04,Math.floor(i/3)*.25-.13,.23,.074,.09).rotation.y=.25;
    part(cart,box,red,0,1.82,0,1.64,.09,.94);
    const label=document.createElement('canvas'); label.width=256; label.height=64;
    const g=label.getContext('2d'); g.fillStyle='#f5dd9a'; g.fillRect(0,0,256,64);
    g.font='bold 47px sans-serif'; g.textAlign='center'; g.fillStyle='#932f21'; g.fillText('BÁNH MÌ',128,50);
    const map=new T.CanvasTexture(label); map.colorSpace=T.SRGBColorSpace;
    const sign=new T.MeshBasicMaterial({map}), panel=new T.PlaneGeometry(1.52,.34);
    for (const side of [-1,1]) part(cart,panel,sign,0,1.63,side*.425).rotation.y=side<0?Math.PI:0;
  }
  function place(graph,cx,cz,segments,clear,ground) {
    if (graph!==previousGraph) { greeted=false; nextClock=0; previousGraph=graph; }
    site=null;
    if (stand) stand.visible=false;
    if (!graph) return;
    const anchor=graph.point(105.8521,21.0343), ax=anchor.x-cx, az=anchor.z-cz;
    if (Math.hypot(ax,az)>400) { greeted=false; return; }
    let best=55;
    for (const s of segments) {
      if (s.len<6||s.graded||/^(motorway|trunk)/.test(s.kind)) continue;
      const t=Math.min(s.len-2, Math.max(2,(ax-s.ax)*s.fx+(az-s.az)*s.fz));
      for (const side of [-1,1]) {
        const x=s.ax+t*s.fx+side*s.nx*(s.w+2.0), z=s.az+t*s.fz+side*s.nz*(s.w+2.0);
        const d=Math.hypot(x-ax,z-az);
        if (d<best&&clear(x,z,1.35)) { best=d; site={x:x+cx,z:z+cz,yaw:Math.atan2(-s.fz,s.fx)}; }
      }
    }
    if (!site) return;
    if (!stand) build();
    stand.position.set(site.x-cx,ground(site.x,site.z),site.z-cz);
    stand.rotation.y=site.yaw;
    stand.visible=true;
  }
  function update(car,dt) {
    if (!site) return false;
    nextClock-=dt;
    if (nextClock<=0) {
      const hour=(new Date().getUTCHours()+7)%24;
      cart.visible=hour>=5&&hour<9; nextClock=2;
    }
    const distance=Math.hypot(site.x-car.x,site.z-car.z);
    if (distance>55) greeted=false;
    if (car.driving&&cart.visible&&distance<25&&!greeted) { greeted=true; return true; }
    return false;
  }
  return {place,update};
}

;