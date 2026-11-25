const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(window.VietnamSights??=[]).push({
  id:'so-kien',name:'Vương cung thánh đường Sở Kiện',city:'Thanh Liêm',province:'Ninh Bình',region:'Bắc Bộ',formerProvince:'Hà Nam',
  lon:105.89674,lat:20.49988,start:[105.895985,20.499923],width:31.2,depth:67.2,yaw:-1.77,
  map:'https://www.openstreetmap.org/way/1177046931',
  photo:'https://baoquangninh.vn/ve-dep-thanh-duong-hon-140-tuoi-cach-ha-noi-70km-goc-chup-nao-cung-nhu-troi-au-3272692.html',
  source:'https://www.vietnamplus.vn/vuong-cung-thanh-duong-so-kien-nha-tho-lau-doi-nhat-ha-nam-post589755.vnp',
  description:'Ở Kẻ Sở, hai tháp chuông đỉnh bằng kẹp lấy mặt tiền Gothic. Phía trên ba cửa vòm nhọn là ô hoa hồng ở giữa và hai mặt đồng hồ hai bên.',
  build(T,{box,stamp,outline,round,tapered}){
    const stone=0x756e61,light=0xc6b99f,brick=0xb16d52,shade=0x3b3630,door=0x56362a,roof=0x864c38;
    function lancet(x,y,z,w,h,tint,angle=0){
      outline([[-w/2,0],[w/2,0],[w/2,h*.62],[w*.34,h*.81],[0,h],[-w*.34,h*.81],[-w/2,h*.62]],tint,x,y,z,.09,angle);
    }
    function dial(x,y,r,rose){
      const z=33.28;
      for(const [size,tint,depth] of [[1.15,stone,0],[1.04,light,.13],[.93,rose?shade:0xd8caab,.23]]){
        stamp(round,tint,x,y,z+depth,r*size,.15,r*size,0,Math.PI/2);
      }
      for(let i=0;i<12;i++){
        const a=i*Math.PI/6;
        box(rose?light:stone,x+Math.sin(a)*r*(rose?.56:.76),y+Math.cos(a)*r*(rose?.56:.76),z+.38,.09,r*(rose?.76:.20),.10,0,0,-a);
      }
      if(rose)stamp(round,light,x,y,z+.42,.24,.15,.24,0,Math.PI/2);
      else {box(shade,x,y+r*.24,z+.44,.12,r*.54,.10);box(shade,x-r*.18,y,z+.44,r*.42,.12,.10);}
    }
    box(stone,0,.30,0,31.2,.6,67.2);
    box(0xb7a58d,0,5.65,-1,29,10.3,62);
    box(0xa8927e,0,10.1,-1,16.4,15.5,62);
    outline([[-8.95,0],[0,6.1],[8.95,0]],roof,0,17.7,-32,63.85);
    for(const side of [-1,1]){
      box(roof,side*11.72,12.55,-1,8.5,.55,62.5,0,0,-side*.49);
      for(let z=-27;z<=24;z+=7.25){
        const a=side*Math.PI/2;
        lancet(side*14.57,3,z,3.0,5.8,stone,a);
        lancet(side*14.69,3.3,z,2.44,5.12,0x4e5a58,a);
        box(light,side*14.81,5.44,z,.2,4.3,.16);
        lancet(side*8.28,14.65,z,1.8,2.75,shade,a);
        box(stone,side*14.75,4.3,z+3.2,1.15,8.4,1.02);
        box(light,side*14.75,8.65,z+3.2,1.24,.42,1.12);
      }
    }
    outline([[-10.5,0],[10.5,0],[10.5,16.1],[0,21.9],[-10.5,16.1]],stone,0,.6,31.4,1.48);
    for(const [x,w,h] of [[0,5.7,8.7],[-7,4.4,7.25],[7,4.4,7.25]]){
      lancet(x,.62,32.94,w+1,h+.75,light);lancet(x,.62,33.05,w+.3,h+.2,stone);lancet(x,.62,33.16,w,h,door);
      box(shade,x,h*.36,33.29,.08,h*.59,.11);
    }
    for(const x of [-9.9,-8.3,-6.6,-5,-3.4,-1.7,0,1.7,3.4,5,6.6,8.3,9.9]){
      const h=21.75-Math.abs(x)*.54;
      lancet(x,15.1,32.94,1.18,Math.max(1,h-15.3),light);
      tapered(stone,x,h+.92,32.4,.27,.035,1.32);
    }
    for(const x of [-8.5,-7,-5.5,5.5,7,8.5])lancet(x,8.3,32.97,1.1,4.14,light);
    dial(0,13.65,1.94,true);dial(-7,12.15,1.02,false);dial(7,12.15,1.02,false);
    for(const side of [-1,1]){
      const x=side*12.55;
      box(brick,x,13.65,29.6,5.55,26.2,6.35);
      for(const dx of [-2.58,2.58])box(stone,x+dx,13.85,32.85,.56,26.6,.62);
      for(const y of [5.8,10.85,16.05,20.95,26.65]){
        box(stone,x,y,29.6,5.96,.38,6.77);
        box(light,x,y+.25,29.6,5.82,.15,6.62);
      }
      for(const y of [1.0,6.45,11.5,16.7,21.6])for(const dx of [-1.32,0,1.32]){
        lancet(x+dx,y,32.85,1.20,3.96,light);lancet(x+dx,y+.18,32.97,.80,3.32,y>16?shade:stone);
        lancet(x+side*2.83,y,29.6+dx,1.14,3.92,shade,side*Math.PI/2);
      }
      for(let i=-2;i<=2;i++)box(stone,x+i,27.22,32.65,.31,.85,.49);
    }
    box(light,0,23.34,32.25,.29,2.53,.32);box(light,0,23.9,32.25,1.51,.26,.32);
  }
});

export default window.VietnamSights;
