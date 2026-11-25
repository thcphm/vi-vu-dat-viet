const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const A = window.CentralArch;
  const K=globalThis.VietnamKarst,sites=window.VietnamSights??=[];
  const bay='https://halongbay.com.vn/',tau=2*Math.PI;
  // Boats depart from Tuần Châu. Keep the parked car at the same verified
  // harbour road used by the Hòn Trống Mái visit, including for direct links.
  function island(node,data,build){
    K.register(sites,node,{start:[106.9894,20.91974],approachMeters:undefined,mappedEntrance:true,
      arrivalNote:'Xe đỗ ở cảng Tuần Châu. Góc ngắm đưa bạn từ cảng ra đảo.',...data},build);
  }
  function drip(batch,x,y,z,r,h,phase,tint,shape='column'){
    batch.grid(36,19,(u,v)=>{
      const a=tau*u;
      const axis=a+v*.16+.10*Math.sin(3*v+phase);
      const fluting=1+.22*Math.cos(9*axis+phase)+.09*Math.sin(19*axis-2*v)+.04*Math.sin(4*a+19*v);
      const taper=shape==='column'?.51+1.18*(2*v-1)**4+.07*Math.cos(v*13+phase):
        shape==='hang'?(v**.64)*(.8+.21*v):((1-v)**.75)*(.84+.16*Math.cos(v*11));
      const radius=Math.max(.016,taper)*r*fluting;
      return [x+radius*Math.cos(a)+r*.18*Math.sin(v*3+phase),y+h*v,
        z+radius*Math.sin(a),tint,.85+.19*Math.cos(9*axis+.7*v)+.10*Math.sin(4*a+phase)];
    });
  }
  function curtain(rock,x,y,z,w,h,phase,tint){
    rock.grid(58,9,(u,v)=>{
      const fold=Math.sin(36*u+phase)+.33*Math.sin(75*u+phase);
      const drop=h*(.23+.58*Math.sin(Math.PI*u)**.66+.11*Math.cos(u*15+phase))*v;
      return [x+(u-.5)*w+.10*v*fold,y-drop,z+w*fold*(.022+.040*v),
        tint,.82+.18*Math.cos(36*u+phase)];
    });
  }

  island(4730928605,{source:bay+'vi/p/567-dong-thien-cung-cung-dien-huyen-thoai-giua-long-ky-quan',
    yaw:2.42,width:52,depth:53,
    shots:[['Cổng Trời trong động',-.3,-11,15,14,Math.PI-.11,.04],['Rèm nhũ trong ngăn đầu',-4.8,-8.8,12.2,5.3,.83,.035]],
    description:'Qua cửa hẹp, ngăn động mở rộng quanh hai cột nhũ lớn. Ở Cổng Trời, các đường khía chạy từ chân cột lên vòm, bên cạnh là những tấm rèm đá màu kem.'},
    (T,kit)=>{
      const r=K.batch(T);
      K.grotto(r,[[0,0,3.7,4.7,.2],[5,-1,9,10.8,.12],[13,0,14,17.4,.08],[24,-1,15,20,.25],[37,-3,10,12,.5]],24,22,.4);
      for(const [x,z,w,h] of [[-4.1,-12.4,2.05,16.1],[4.2,-14,2.52,16.8],[-8,-21,1.85,14.1]]){
        drip(r,x,.2,z,w,h,x,0xc1a07e);
        for(let i=0;i<8;i++)drip(r,x+Math.cos(i)*w,.35,z+w*.59*Math.sin(i),
          w*.29,2+4*kit.random(),i,0xc9b290,'rise');
      }
      curtain(r,-5.5,9.4,-8.7,6.1,4.2,.5,0xe0c49e);
      curtain(r,5.3,12.1,-10.2,4.6,3.4,1.7,0xc9b5a0);
      curtain(r,-1.6,15.8,-20.9,8.5,3.9,.3,0xf0c99e);
      for(let i=0;i<9;i++)drip(r,-7+kit.random()*14,12+kit.random()*2,-22+kit.random()*7,
        .3+kit.random()*.8,3+i%3,i,0xccb490,'hang');
      K.finish(T,kit,r);
    });

  island(4730928606,{source:bay+'vi/p/572-hang-dau-go-hang-dong-reu-phong-co-kinh-tren-vinh-ha-long',
    yaw:2.34,width:51,depth:44,
    shots:[['Vòm cửa Đầu Gỗ',0,-1,9.6,23,.16,.16],['Măng và chuông đá',3,-3,6.1,11,-.03,.10]],
    description:'Ánh trời qua cửa rộng nuôi mảng rêu trên đá. Bên trong, từng ngăn hẹp lại. Gần cửa có cặp măng đá và chuông đá còn cách nhau một khoảng nhỏ.'},
    (T,kit)=>{
      const r=K.batch(T);
      // Published opening, 17 m wide and 12 m high (Bay Management Board).
      K.grotto(r,[[0,0,8.5,12,0],[5,-.6,10,14,0],[14,-.8,9,12,.25],[23,-4,6.2,8,.5],[30,-5,3.8,5,.6]],24,20,1.74);
      for(let i=0;i<24;i++){
        const t=i/23,x=-7.7+15.2*t,y=11.8*Math.sin(Math.PI*(.07+.86*t))**.72;
        drip(r,x,y-1.4-(i%3)*.26,-1.2+Math.cos(i*.66)*.48,.3+kit.random()*.36,1.64+i%3*.30,i,0xb2b7a0,'hang');
      }
      drip(r,3.4,.18,-3.8,1.05,4.5,1.2,0xb6b79d,'rise');
      drip(r,3.5,5.21,-3.9,.98,6.8,2.3,0xb9b49f,'hang');
      for(const [x,z,w,h] of [[-5.3,-11,1.3,10.7],[4.8,-16,1.23,9.1]])drip(r,x,.1,z,w,h,z,0xb7a58d);
      for(const [x,z] of [[-8.2,1],[-9,-4],[8.7,-1]]){
        K.boulder(r,x,.04,z,1.8,1.75,1.26,x,true);
        r.trees.push([x,.38,z,4.4,5.5,x]);
      }
      K.finish(T,kit,r);
    });

  K.register(sites,4508895511,{source:'https://cathai.haiphong.gov.vn/di-tich-lich-su-van-hoa/kham-pha-hang-quan-y-benh-vien-trong-long-nui-790528',
    yaw:.64,width:34,depth:33,mappedEntrance:true,
    arrivalNote:'Xe đỗ bên đường Hùng Sơn trên đảo Cát Bà. Đường đi bộ và bậc thang dẫn lên cửa hang.',
    shots:[['Bậc lên Hang Quân Y',0,0,5.7,18,.22,.15],['Cửa sắt và hành lang',0,-1.6,5.6,6.7,-.16,.06]],
    description:'Các bậc gỗ đưa khách tới cửa sắt cong dưới mái đá. Qua cửa là đoạn hành lang bê tông của bệnh viện trong núi. Tour ảnh thực địa còn cho thấy các phòng điều trị.'},
    (T,kit)=>{
      const r=K.batch(T),wall=0xabb0a3,door=0x738579,wood=0x8b6e50;
      // Exterior stairs follow the final leg of w454322799; the entrance
      // passage (w454322289) continues northwest behind the concrete portal.
      K.grotto(r,[[0,0,4.5,5.6,.15],[4,0,5.1,6,.2],[12,-.3,5,6,.2],[19,-2,3.5,5,.2]],17,13.2,4.4);
      kit.palette({metal:door,plaster:wall,timber:wood});
      for(let i=0;i<13;i++)kit.box(wood,0,.13+.175*i,4.6-.37*i,1.85,.16,.385);
      for(const side of [-1,1]){
        A.strut(T,kit,wood,side*.78,-.06,4.85,side*.78,2.14,.15,.11);
        A.strut(T,kit,0x757461,side*.91,1.08,4.69,side*.91,3.22,.15,.048);
        for(const j of [0,4,8,12])kit.box(0x757461,side*.91,.68+j*.175,4.6-j*.37,.08,.96,.08);
        kit.box(wall,side*2.32,3.38,-1.6,2.8,3.0,.52);
        kit.box(wall,side*1.48,3.44,-5.6,.30,3.05,7.5);
        kit.box(0x62685f,side*.88,3.45,-1.29,.085,2.45,.10);
      }
      kit.box(0x8a8f82,0,1.13,-1.6,7.45,2.21,1.14);
      kit.box(wall,0,4.96,-1.6,7.5,.45,.54);
      kit.box(0x686b60,0,4.68,-1.29,1.86,.09,.10);
      kit.box(wall,0,2.16,-5.4,3.05,.23,9.85);
      kit.box(wall,0,4.96,-5.5,3.15,.33,7.85);
      kit.box(0x69716a,0,3.44,-9.3,2.8,2.7,.24);
      // A convex, partly open door. Each strip follows the same curved leaf.
      const metal=K.batch(T);
      metal.grid(18,4,(u,v)=>{
        const x=.92-1.67*u*.40+.19*Math.sin(Math.PI*u);
        const z=-1.83-1.67*u*.90-.10*Math.sin(Math.PI*u);
        return [x,2.29+v*2.32,z,door,.74+.22*Math.sin(u*Math.PI)];
      });
      metal.add(kit.group,new T.MeshStandardMaterial({vertexColors:true,metalness:.45,roughness:.72}));
      for(const y of [2.54,4.32])kit.box(0x505a52,.91,y,-1.8,.18,.16,.11);
      // The concrete floor and sill are level. The access flight follows
      // the approach gradient, then meets the fixed landing at the doorway.
      K.finish(T,kit,r,(ground,x,z)=>{
        const blend=Math.min(1,Math.max(0,(Math.abs(x)-4)/5,(z-.3)/5,(-z-9)/5));
        const platform=Math.max(ground(-3,0),ground(3,0),ground(0,-4));
        return platform+(ground(x,z)-platform)*blend;
      });
    });

  island(10821152105,{source:bay+'places/25-hon-dinh-huong-hon-lu-huong',yaw:0,width:34,depth:20,
    shots:[['Dáng lư hương',0,0,21,59,.06,.075],['Chân đá bị biển khoét',1.0,0,4.8,28,.12,.045]],
    description:'Khối đá dẹt đứng riêng giữa mặt vịnh. Sóng và thủy triều đã khoét sâu sát chân đảo, để lại khe sáng dưới thân đá. Phần đỉnh tách thành hai ụ cây.'},
    (T,kit)=>{
      const r=K.batch(T);
      // w251761304 spans 31 by 19 m. The photographed front has a narrow
      // through-notch between two feet and a cleft in the upper skyline.
      r.grid(72,76,(u,v)=>{
        const t=2*u-1,a=v*tau,c=Math.cos(a),s=Math.sin(a);
        const edge=Math.max(0,1-(t/.99)**4);
        const opening=3.5*Math.max(0,1-((t-.06)/.145)**2)**.62;
        const base=-.55+opening+.19*Math.cos(15*t);
        const ridge=edge**.24*(20.3+2.7*Math.sin((t+.38)*4.1)**2-2.6*Math.exp(-((t+.07)**2)/.021));
        const h=(ridge+base)/2+(ridge-base)/2*Math.sign(c)*Math.abs(c)**.50;
        const groove=.24*Math.sin(t*39+h*.085)+.16*Math.cos(t*67+h*.13);
        const recess=.21*Math.exp(-((h-1.1)**2)/3.5),w=8.1*(1-recess)*edge**.38;
        const z=w*Math.sign(s)*Math.abs(s)**.38+groove;
        const x=15.4*t*(.94+.06*Math.sin((h+1)*.14))+1.2*Math.sin(h*.13);
        const tint=h<1.6?0x555f55:h<3.75+.33*Math.sin(x*.9)?0xc5bfa8:0x999c95;
        return [x,h,z,tint,.89+.09*Math.cos(t*43+h*.04)+.07*Math.sin(12*a)];
      });
      for(let i=0;i<31;i++){
        const t=(i*.618%1)*1.62-.81,edge=Math.max(0,1-(t/.99)**4);
        const h=edge**.24*(20.3+2.7*Math.sin((t+.38)*4.1)**2-2.6*Math.exp(-((t+.07)**2)/.021));
        const x=15.4*t*(.94+.06*Math.sin((h+1)*.14))+1.2*Math.sin(h*.13);
        const size=1.25+kit.random()*1.85;
        r.trees.push([x,h-.33,(kit.random()-.5)*4.8,size,size*.8,i*2.4]);
      }
      K.finish(T,kit,r);
    });

  // The east-facing rockshelter of Mê Cung has a level apron and shell beds
  // on either side. The winding passages rise westward into Hòn Lờm Bò.
  function shellBank(T,kit,r,x,z,w,d,h,phase) {
    K.boulder(r,x,.04,z,w,h,d,phase);
    // Calcified freshwater shells appear in clusters along the exposed face.
    for(let i=0;i<90;i++){
      const a=.12+kit.random()*2.8,v=.13+kit.random()*1.04,rx=.034+kit.random()*.043;
      const sx=x+w*Math.cos(v)*Math.cos(a),sy=h*Math.sin(v)-.21,sz=z+d*Math.cos(v)*Math.sin(a);
      r.grid(8,4,(u,t)=>{
        const angle=tau*u,s=rx*(1-t*.9)*(1+.11*Math.cos(5*angle-10*t));
        return [sx+s*Math.cos(angle)+t*rx,sy+t*rx*2.6,sz+s*Math.sin(angle),0xd8ccb2,.91+.08*Math.sin(t*17)];
      });
    }
  }
  island(994065796,{source:bay+'index.php/vi/p/1366-dong-me-cung-noi-ve-dep-thien-nhien-gap-go-chieu-sau-lich-su',
    yaw:Math.PI/2,width:29,depth:36,
    shots:[['Mái đá phía đông',0,0,6.4,18,-.14,.17],['Tầng vỏ ốc ở cửa động',2.9,.1,2.6,4.9,.25,.17]],
    description:'Mái đá mở về phía đông đảo Lờm Bò. Hai bên cửa, những lớp vỏ ốc suối và ốc núi kết dính trong trầm tích. Qua khoảng nền bằng là các ngách hẹp quanh co.'},
    (T,kit)=>{
      const r=K.batch(T);
      K.grotto(r,[[0,0,4.6,3.2,.03],[3,0,5.1,3.8,.12],[7,-1.8,2.1,3.7,.32],[12,.6,2.5,4.1,.77],
        [18,3.4,2.4,3.5,1.2],[25,1.4,1.9,3.2,1.46]],14,10,.4);
      shellBank(T,kit,r,3,.0,1.42,1.03,1.22,.5);
      shellBank(T,kit,r,-3.6,-1.2,1.25,.83,1.03,2.1);
      curtain(r,-1.6,4.15,-6.7,2.6,1.55,.4,0xbba587);
      K.finish(T,kit,r);
    });

  island(3494811567,{source:bay+'en/p/351-hang-bo-nau',yaw:-.76,width:46,depth:33,
    shots:[['Nhìn ra vịnh qua rèm nhũ',0,.2,8.4,14.5,Math.PI,.025],['Vòm cửa Bồ Nâu',0,-1,9,27,.22,.10]],
    description:'Từ trong Bồ Nâu nhìn ra, những dải nhũ rủ xuống trên nền vịnh sáng. Miệng hang bè rộng như vỏ sò úp, hai mép thấp sát sườn đảo.'},
    (T,kit)=>{
      const r=K.batch(T);
      K.grotto(r,[[0,0,12.2,7.6,.1],[5,-.7,13.9,8.8,.16],[12,-1.1,13.1,9.2,.27],
        [20,-3.6,6.5,5.8,.21],[27,-5,6.7,5.2,.13]],23,16.2,2.8);
      for(let i=0;i<25;i++){
        const u=(i+.37)/25,a=Math.PI*u,x=12.2*Math.cos(a),y=.1+7.6*Math.sin(a)**.72;
        const h=.53+2.65*kit.random()**1.6;
        drip(r,x,y-h+.35,-.8+.65*Math.sin(a*5),.22+.45*kit.random(),h,i,0xb5a58e,'hang');
      }
      for(const [x,z,w,h] of [[-7.8,.5,1.5,1.7],[6.8,-.1,1.3,1.45],[-4.6,-8.3,.96,2.5]])
        K.boulder(r,x,0,z,w,h,1.15,x);
      K.finish(T,kit,r);
    });

  island(3560283504,{name:'Hang Luồn',source:bay+'tours/2-hanh-trinh-vhl-2-cang-tau-bai-tam-soi-sim-dao-ti-top-hang-sung-sot-vung-tung-sau-dong-me-cung-hang-bo-nau-hang-luon-hang-trong-hang-trinh-nu-hang-ho-dong-tien',
    yaw:-2.20,width:62,depth:45,
    shots:[['Cửa hang thông áng nước',0,-1,4.4,29,.07,.065],['Ánh sáng cuối hang',0,-31,4.4,8,.015,.04]],
    description:'Thuyền đi dưới vòm thấp để vào áng nước kín trên đảo Bồ Hòn. Đường thông giữa bờ vịnh và hồ trong cảnh bám theo đoạn dòng chảy ngầm trên bản đồ.'},
    (T,kit)=>{
      const r=K.batch(T),length=42.1;
      // Flooded OSM way 1465160749 connects coastline w350325051 and
      // lake w350288583. The open ends and inner tunnel follow that line.
      function vault(u,v,outer){
        const a=Math.PI*u,z=-length*v,px=Math.cos(a),py=Math.sin(a);
        const wrinkle=.16*Math.cos(a*9+v*6)+.08*Math.sin(11*a-v*10);
        const w=outer?26.5+2.9*Math.sin(v*8):6.8+.92*Math.sin(v*5+.36);
        const h=outer?16.4+2.5*Math.cos(v*7)+2.3*Math.sin(v*11):3.8+.44*Math.cos(v*7.2);
        return [px*w+.38*Math.sin(v*8),-.45+h*py**.73+wrinkle,z+wrinkle*.37];
      }
      for(const outer of [false,true])r.grid(55,55,(u,v)=>[...vault(u,v,outer),outer?0xa5aa98:0x9d9e92,
        outer?.87+.12*Math.cos(u*24+v*4):.57+.26*Math.abs(2*v-1)**2]);
      for(const end of [0,1])r.grid(55,9,(u,v)=>{
        const a=vault(u,end,false),b=vault(u,end,true);
        const x=a[0]+(b[0]-a[0])*v,y=a[1]+(b[1]-a[1])*v,z=a[2]+(b[2]-a[2])*v;
        return [x,y,z+Math.sin(v*Math.PI)*(end?-1:1)*(.7+.48*Math.cos(17*u)),y<1.2?0x777e70:0xadad9f,.88+.10*Math.cos(21*u)];
      });
      K.river(T,kit.group,[-length-2,2],()=>0,()=>7.2);
      for(let i=0;i<53;i++){
        const u=.14+kit.random()*.72,v=kit.random(),[x,y,z]=vault(u,v,true),h=1.1+kit.random()*3.1;
        r.trees.push([x,y-.2,z,h,h,i]);
      }
      K.finish(T,kit,r);
    });

  island(5147203123,{name:'Hang Tiên Ông',source:bay+'vi/p/118-nhung-ky-quan-tren-vinh-ha-long',
    yaw:-2.36,width:50,depth:43,
    shots:[['Vòm đá hướng tây bắc',0,-1,12,29,-.08,.15],['Khối nhũ chia hai ngăn',-1,-11,8.8,10,.21,.10]],
    description:'Cửa hang mở về tây bắc hòn Cái Tai. Khối nhũ lớn giữa hang chia khoang ngoài có dấu tích cư trú với các ngăn phía trong. Trầm tích vỏ nhuyễn thể còn thấy ở phần nền gần cửa.'},
    (T,kit)=>{
      const r=K.batch(T);
      K.grotto(r,[[0,0,14,13,.08],[7,0,14.9,13.4,.11],[14,-1,12.8,10.8,.2],[21,-3,7.3,7.5,.28],
        [31,-3.3,9.2,9,.35]],24,23,3.2);
      drip(r,-2.1,.15,-13.6,2.7,9.8,.9,0xc0ab90,'rise');
      drip(r,-3.5,.1,-12.8,1.7,6.6,2,0xc8b39b,'rise');
      drip(r,-1.3,9.1,-13.1,1.35,3.8,2.7,0xc0ac93,'hang');
      for(let i=0;i<5;i++)drip(r,-5+i*1.15,.2,-15.8+i*.25,.8,2.4+2.1*Math.sin(i)**2,i,0xcbb59c,'rise');
      shellBank(T,kit,r,6,.4,1.75,1.5,1.2,1.1);
      K.finish(T,kit,r);
    });
})();

export default window.VietnamSights;
