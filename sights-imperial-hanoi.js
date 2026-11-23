'use strict';
(()=>{
  const sites=window.VietnamSights??=[],arch=window.CentralArch;
  function stop(id,data,build){
    const site=VietnamTourism.byId.get(id);
    sites.push({city:'Hà Nội',province:'Hà Nội',region:'Bắc Bộ',kind:'Di tích',...site,id,
      catalogId:site?.id,...data,photo:data.source,visitOnArrival:true,build});
  }
  const entrance={start:[105.8390715,21.0336681],approachMeters:null,mappedEntrance:true,
    arrivalNote:'Xe dừng ở lối vào khu tham quan trên phố Hoàng Diệu.'};
  const ochre=0xd3ad69,trim=0xe6c58a,weathered=0xb09064,tiles=0x655c4e;
  stop('cot-co-ha-noi',{name:'Cột cờ Hà Nội',map:'https://www.openstreetmap.org/way/184959290',
    lon:105.8398256,lat:21.0325905,yaw:-.12,width:42.5,depth:42.5,start:[105.8398093,21.0319953],
    source:'https://scov.gov.vn/dat-nuoc-con-nguoi/1000-nam-thang-long-ha-noi/cot-co-ha-noi-bieu-tuong-hung-thieng.html',
    description:'Ba tầng đế vuông nâng thân Kỳ Đài lên khỏi những tán cây ven đường Điện Biên Phủ. Trên tám mặt của thân cột, ánh sáng lọt qua những ô hoa và khe hẹp lên đến lầu bát giác.',
    views:[{name:'Từ phía đường Điện Biên Phủ',viewAngle:.28,viewRadius:80,viewElevation:.14,height:39},
      {name:'Ô hoa trên thân bát giác',viewAngle:.69,viewRadius:20,viewElevation:.14,height:45},
      {name:'Ba tầng đế vuông',viewAngle:-.81,viewRadius:58,viewElevation:.48,height:15}]},function*(T,k){
    const brick=0x986e58,brick2=0xa07b62,stone=0x918779;
    k.palette({brick:[brick,brick2],stone});
    let level=0;
    for(const [width,h,tint] of [[42.5,3.1,brick],[27,3.7,brick2],[12.8,5.1,brick]]){
      k.box(tint,0,level+h/2,0,width,h,width);
      k.box(stone,0,level+h-.045,0,width+.25,.15,width+.25);
      if(level)for(let i=0;i<4;i++){
        const a=i*Math.PI/2;
        k.place(Math.sin(a)*width/2,Math.cos(a)*width/2,a,()=>{
          k.box(0x55483d,0,level+1.02,.04,1.14,1.98,.09);
          k.box(stone,0,level+2.15,.08,1.5,.18,.18);
        });
      }
      level+=h;
    }
    for(const sx of [-1,1])for(let n=0;n<16;n++){
      const h=3.1*(n+1)/16;
      k.box(stone,sx*16.7,h/2,25.6-n*.32,2.1,h,.33);
    }
    // Cut the light openings through the eight tapering faces of the shaft.
    const rise=18.2,bottom=2.51,top=1.96,slope=(top-bottom)/rise;
    const faces=[];
    for(let pattern=0;pattern<2;pattern++){
      yield;
      const shape=new T.Shape(),half=r=>r*Math.tan(Math.PI/8);
      shape.moveTo(-half(bottom),0);shape.lineTo(half(bottom),0);shape.lineTo(half(top),rise);shape.lineTo(-half(top),rise);shape.closePath();
      for(let row=0;row<6;row++){
        const y=1.6+row*2.85+pattern*.26,hole=new T.Path();
        if(row<5){
          for(let i=0;i<=40;i++){
            const a=i*Math.PI/20,r=.23+.065*Math.cos(8*a),x=r*Math.cos(a),v=y+r*Math.sin(a);
            if(i)hole.lineTo(x,v);else hole.moveTo(x,v);
          }
        }else{hole.moveTo(-.1,y-.31);hole.lineTo(.1,y-.31);hole.lineTo(.1,y+.31);hole.lineTo(-.1,y+.31);}
        hole.closePath();shape.holes.push(hole);
      }
      const g=new T.ExtrudeGeometry(shape,{depth:.2,bevelEnabled:false}),p=g.attributes.position;
      for(let i=0;i<p.count;i++)p.setZ(i,p.getZ(i)+bottom+slope*p.getY(i)-.20);
      g.computeVertexNormals();faces.push(g);
    }
    for(let face=0;face<8;face++){
      yield;
      const angle=face*Math.PI/4;
      k.stamp(faces[face%2],brick2,0,level,0,1,1,1,angle);
      k.place(0,0,angle,()=>{
        // Each observation window is open between the eight corner piers.
        k.box(brick,1.02,31.72,2.42,.37,3.27,.43);
        k.box(stone,0,30.29,2.44,2.18,.34,.49);
        k.box(stone,0,33.1,2.44,2.18,.39,.49);
      });
    }
    for(const face of faces)face.dispose();
    const crown=new T.CylinderGeometry(2.86,2.86,.26,8);k.stamp(crown,stone,0,33.43,0,1,1,1,Math.PI/8);crown.dispose();
    k.stamp(k.round,0x788284,0,37.34,0,.09,7.85,.09);k.wavingFlag(6,4,.09,41.17,0);
  });
  stop('bac-mon-thang-long',{name:'Bắc Môn (Cửa Bắc)',map:'https://www.openstreetmap.org/way/185531691',
    lon:105.8410322,lat:21.0405553,start:[105.8410772,21.0408157],yaw:2.95,width:17.08,depth:20.6,
    solids:arch.archPiers(0,0,17.08,2.28,20.6),
    source:'https://hoangthanhthanglong.vn/cua-bac-thanh-ha-noi-thoi-nguyen/',
    description:'Từ phố Phan Đình Phùng có thể nhìn thẳng vào vòm Bắc Môn, cửa thành thời Nguyễn xây năm 1805. Phía trên cửa là tấm biển Chính Bắc Môn và vọng lâu lợp ngói.',
    views:[{name:'Mặt thành từ phố Phan Đình Phùng',viewAngle:3.19,viewRadius:39,viewElevation:.11,height:15},
      {name:'Vọng lâu trên nền gạch',viewAngle:2.2,viewRadius:30,viewElevation:.35,height:23}]},(T,k)=>{
    const brick=0x8b7463,stone=0x807c70,wood=0x644a3c;
    k.palette({brick,stone:[stone,0xaba08a],timber:wood});
    arch.vaultedBay(T,k,0,0,17.08,8.71,2.28,2.82,20.6,brick,0xa99983,stone);
    k.box(0xaba08a,0,6.2,10.4,3.7,.96,.21);k.sign('正 北 門',0,6.24,10.52,3.16,.82,true);
    for(const x of [-8.31,8.31])k.box(brick,x,9.04,0,.46,.67,20.58);
    for(const z of [-10.06,10.06])k.box(brick,0,9.04,z,16.65,.67,.48);
    k.box(0xaaa18c,0,8.86,-.6,11.8,.28,8.6);
    k.box(ochre,0,10.38,-1.1,7.8,2.86,4.7);
    for(const x of [-4.85,-2.88,0,2.88,4.85])for(const z of [-3.96,2.95]){
      k.stamp(k.round,wood,x,10.48,z,.18,3.2,.18);
    }
    for(const x of [-2.85,0,2.85])shutters(k,x,10.32,1.26,1.38,2.13,0x506659);
    arch.curvedRoof(T,k,0,12.07,-.53,12.7,9.55,2,0x866754,0x776e60,0x9c8b73,.24);
  });
  function shutters(kit,x,y,z,width,height,tint){
    kit.box(0x414940,x,y,z,width+.14,height+.14,.13);
    for(const side of [-1,1]){
      const mid=x+side*width*.26;
      kit.box(tint,mid,y,z+.08,width*.46,height,.075);
      for(let i=0;i<7;i++)kit.box(0x536b5c,mid,y+height*(i-3)/9,z+.14,width*.36,.055,.06);
    }
  }
  stop('osm-way-185531692',{...entrance,yaw:-.096,width:17.85,depth:9.46,
    source:'https://hoangthanhthanglong.vn/lau-tinh-bac-hau-lau/',
    description:'Hậu Lâu còn có tên là Lầu Tĩnh Bắc, dựng thời Minh Mạng. Từ sân nhìn lên có thể thấy ba tầng gạch, những đầu mái cong và lầu nhỏ nhô lên giữa nóc.',
    views:[{name:'Ba tầng nhìn từ sân',viewAngle:.34,viewRadius:29,viewElevation:.15,height:12},
      {name:'Các đầu đao và lầu giữa',viewAngle:-.81,viewRadius:20,viewElevation:.33,height:19}]},function*(T,k){
    k.palette({plaster:[ochre,trim,weathered],stone:[0x918575],timber:[0x506659]});
    k.box(0x918575,0,.24,0,18.2,.48,9.9);
    k.box(ochre,0,2.27,0,17.75,3.62,9.35);
    for(const side of [-1,1]){
      k.box(trim,side*8.45,2.24,4.73,.6,3.56,.32);
      shutters(k,side*6.1,2.25,4.72,1.38,1.91,0x506659);
    }
    k.box(0x514b40,0,1.84,4.71,2.35,2.78,.1);
    for(const x of [-1.33,1.33])k.box(trim,x,1.93,4.83,.18,2.95,.19);
    k.box(trim,0,3.46,4.8,2.84,.18,.19);
    k.box(weathered,0,4.13,0,18.03,.36,9.65);
    for(const x of [-6.38,6.38]){
      yield;
      k.box(ochre,x,5.72,-.23,4.58,3.09,8.25);
      shutters(k,x,5.63,3.91,1.25,1.76,0x506659);
      arch.curvedRoof(T,k,x,7.27,-.23,5.25,8.88,1.28,tiles,0x85806a,trim,.18);
    }
    k.box(ochre,0,6.98,-1.45,8.12,5.38,5.98);
    for(const x of [-2.78,2.78])shutters(k,x,7.23,1.57,1.18,2.38,0x506659);
    k.box(0x4f4940,0,6.42,1.59,1.86,3.84,.12);
    for(const x of [-3.8,-1.55,1.55,3.8]){
      k.box(trim,x,7.04,3.42,.45,5.44,.53);
      k.box(weathered,x,4.55,3.42,.66,.38,.68);
      k.box(weathered,x,9.35,3.42,.61,.2,.63);
    }
    k.box(ochre,0,9.5,3.4,8.16,.65,.56);
    k.box(0x8f8472,0,5.01,3.46,7.9,.12,.12);
    for(let i=-8;i<=8;i++)k.box(0x8f8472,i*.45,4.65,3.46,.055,.72,.07);
    yield;
    arch.curvedRoof(T,k,0,9.83,-.05,9.02,8.95,2.03,tiles,0x777063,trim,.25);
    k.box(ochre,0,11.89,-.05,3.72,1.45,3.52);
    for(const x of [-.93,.93])k.box(0x514a41,x,11.96,1.73,.56,.68,.08);
    yield;
    arch.curvedRoof(T,k,0,12.66,-.05,4.83,4.4,.97,tiles,0x777063,trim,.22);
  });
  stop('osm-way-185535416',{...entrance,yaw:-.096,width:43.02,depth:20.85,
    source:'https://hoangthanhthanglong.vn/en/revolutionary-historical-heritage-house-d67-on-the-central-axis-of-the-imperial-citadel/',
    description:'Nhà D67 được xây dựng năm 1967, phía sau nền điện Kính Thiên. Dãy nhà một tầng nằm dưới tán cây. Mái rộng che hành lang và các cửa chớp chạy dọc mặt nhà.',
    views:[{name:'Hành lang nhìn từ sân',viewAngle:.43,viewRadius:46,viewElevation:.105,height:6.4},
      {name:'Dáng mái dưới tán cây',viewAngle:-.88,viewRadius:44,viewElevation:.49,height:7.4}]},(T,k)=>{
    const green=0x8bb4a2,cream=0xc0c6aa,wood=0x567561;
    k.palette({plaster:[green,cream],stone:[0xadac96],timber:[wood]});
    k.box(0xadac96,0,.23,0,39,.46,15.8);
    k.box(green,0,2.48,-.28,35.75,4.05,12.58);
    for(const side of [-1,1])for(let i=-4;i<=4;i++){
      const x=i*3.8,z=side*6.32-.28;
      if(i%3)k.place(x,z,side<0?Math.PI:0,()=>shutters(k,0,2.55,0,2.13,1.97,wood));
      else k.box(wood,x,1.96,z,1.75,2.96,.19);
      k.box(cream,x-1.8,2.47,side*7.85,.32,4.16,.32);
    }
    k.box(cream,0,4.53,0,40.2,.42,16.75);
    arch.gabledRoof(T,k,0,4.84,0,42.42,20.25,2.94,0x726a60,0x817a6b,{alongX:true,overhang:.3});
    for(let j=0;j<3;j++)k.box(0xabaab0,0,.08+j*.07,8.8-j*.33,8.4,.16+j*.14,.4);
    arch.trees(T,k,[{x:-23,z:5,h:11,width:10},{x:20,z:-13,h:13,width:11},{x:-13,z:-14,h:12,width:9}]);
  });

  // Remains are interpreted inside OSM shelter w185531403 (zone B).
  // The two steel canopies are already drawn from their national building tiles.
  stop('osm-relation-21404421',{yaw:-.126,width:26,depth:50,surveyed:true,solids:[],gardenRadius:40,
    source:'https://hoangthanhthanglong.vn/di-tich-khao-co-hoc-18-hoang-dieu/',
    description:'Khu khai quật ở 18 Hoàng Diệu cho thấy nhiều lớp kiến trúc chồng lên nhau. Dưới mái che khu B, cảnh mô phỏng minh họa cách nhận ra hàng móng trụ, vết nền gạch và giếng cổ.',
    views:[{name:'Dãy móng dưới mái che khu B',offset:[-2,-5],viewAngle:.16,viewRadius:9.6,viewElevation:.17,height:2.1},
      {name:'Thành giếng xây gạch',offset:[5.6,4.4],viewAngle:1.05,viewRadius:5.7,viewElevation:.43,height:1.5},
      {name:'Hai mái che khu khai quật',viewAngle:.48,viewRadius:128,viewElevation:.49,height:11}]},(T,k)=>{
    const earth=0xa08b70,brick=[0x9d6451,0xb37b5c,0xa57054],pad=0xb7a58b;
    k.palette({brick,stone:[pad,0xa99983,0xb5aa96,0x988a74]});
    k.box(earth,0,.055,0,23.2,.16,40);
    const cobble=new T.DodecahedronGeometry(1,0);
    for(let row=0;row<7;row++)for(let col=0;col<4;col++){
      if((row===3||row===4)&&col===3)continue;
      const x=col*5.3-8.7,z=row*5.6-17.8,tints=[pad,0xa99983,0xb5aa96,0x988a74];
      k.box(0xad9b82,x,.155,z,2.15,.12,2.08,k.random()*.13);
      for(let n=0;n<42;n++){
        const u=(k.random()-.5)*1.84,v=(k.random()-.5)*1.77,r=.12+k.random()*.17;
        k.stamp(cobble,tints[n%4],x+u,.22+(1-Math.max(Math.abs(u),Math.abs(v)))*.13,z+v,r,.09+k.random()*.09,r*.76,k.random()*6);
      }
    }
    cobble.dispose();
    for(let i=0;i<39;i++){
      const x=-8+i%6*.52,z=3+Math.floor(i/6)*.28;
      k.box(brick[i%3],x,.25,z,.5,.18,.26);
    }
    const x=5.1,z=5.1;
    k.stamp(k.round,0x4b443a,x,.15,z,1.23,.04,1.23);
    for(let row=0;row<3;row++)for(let i=0;i<24;i++){
      const a=(i+row*.5)*Math.PI/12;
      k.box(brick[(i+row)%3],x+1.15*Math.sin(a),.27+row*.14,z+1.15*Math.cos(a),.295,.135,.25,a);
    }
  });
})();
