/* Fictional vehicles and fictional VietForward (VF) models. Capacities and driving characteristics below are simulation settings. */
(() => {
  const entries=[
    ['apex','Apex GT','Coupé','Coupé thể thao','cam','#ff771e',4.79,1.91,1.35,1350,145,7.2,'petrol',60,8.2],
    ['terra','Terra 4×4','SUV','SUV hai cầu','xám băng','#aec2ca',4.81,1.96,1.82,1850,116,5.8,'petrol',70,9.1],
    ['atlas','Atlas Pickup','Bán tải','Bán tải địa hình','vàng cát','#c49d65',5.39,2,1.87,2120,108,5,'diesel',75,9.5],
    ['minivan','City Minivan','Minivan','MPV gia đình','đỏ mận','#733e5c',5.102,1.92,1.901,1830,120,5.6,'petrol',65,8.5],
    ['limo','Grand Limousine','Limousine','Limousine thân dài','xanh than','#253447',7.222,1.94,1.533,2800,118,4.6,'petrol',85,14],
    ['bus','City Bus','Xe buýt','Xe buýt đô thị','xanh ngọc','#067974',10.884,2.48,3.202,10300,82,2.7,'diesel',180,28],
    ['truck','Cargo Truck','Xe tải','Xe tải thùng kín','xanh dương','#326eae',7.636,2.25,3.368,6800,95,3.6,'diesel',145,21],
    ['vf3','VietForward VF 3','VF 3','Mini SUV điện · 2 cửa','vàng','#efb91e',3.19,1.68,1.62,860,100,5.2,'electric',18.6,12],
    ['vf5','VietForward VF 5','VF 5','SUV điện cỡ nhỏ','xanh biển','#409db3',3.967,1.723,1.578,1360,125,6.3,'electric',37.2,14.3],
    ['vf7','VietForward VF 7','VF 7','Crossover điện','đồng','#ac6748',4.545,1.89,1.636,2000,150,7.5,'electric',75,18],
    ['vf8','VietForward VF 8','VF 8','SUV điện cỡ trung','đỏ ruby','#ac2b3f',4.75,1.934,1.667,2420,155,7.1,'electric',87.7,20.5],
    ['vf9','VietForward VF 9','VF 9','SUV điện ba hàng ghế','xanh đêm','#354e67',5.118,2.004,1.696,2840,148,6.8,'electric',123,24]
  ];
  globalThis.DuongVietFleet=entries.map(([id,name,tab,type,paint,hex,length,width,height,mass,top,accel,fuel,capacity,rate])=>({
    id,name,tab,type,paint,hex,length,width,height,mass,top,accel,fuel,capacity,rate,electric:fuel==='electric',
    group:id.startsWith('vf')?'VietForward':['bus','truck','limo'].includes(id)?'Dịch vụ':'Cá nhân'
  }));
})();
