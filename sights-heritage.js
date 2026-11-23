'use strict';
(() => {
  function coveredBridge(T,{palette, box,deck,outline,stamp,round}) {
    const wood=0x613c32,red=0xb8543b,tile=0x55504c,ridge=0x9b9180;
    const z=2.4;
    palette({timber: wood, tile});
    function roof(x,y,cz,length,half,rise){
      const points=[[-half,0],[-half*.58,rise*.31],[0,rise],[half*.58,rise*.31],[half,0],[half,-.18],[0,rise-.28],[-half,-.18]];
      outline(points,tile,x-length/2,y,cz,length,Math.PI/2);
      for(let i=0;i<=length/.54;i++)outline(points,0x645c54,x-length/2+i*.54,y+.025,cz,.05,Math.PI/2);
      box(ridge,x,y+rise+.07,cz,length+.24,.22,.3);
      for(const s of [-1,1]){
        const end=x+s*length/2;
        outline([[-.43,0],[.42,0],[.43,.24],[.23,.14],[0,.48],[-.18,.24],[-.38,.28]],0x889990,end,y+rise,cz-.1,.2);
      }
    }
    deck(0x9b8a79,0,.38,z,19.2,.72,5.9);
    roof(0,4.55,z,8.0,3.5,1.48);
    for(const s of [-1,1]){
      const x=s*6.68;
      roof(x,4.27,z,5.58,3.55,1.32);
      for(const f of [-1,1]){
        const edge=z+f*2.63;
        box(red,x,1.43,edge,5.33,1.49,.34);
        for(const xx of [-1.94,0,1.94]){
          box(red,x+xx,3.12,edge,.54,2.1,.46);
          box(0x987352,x+xx,4.08,edge,.83,.2,.61);
        }
        box(red,x,4.05,edge,5.45,.49,.4);
        box(wood,x,2.21,edge,5.4,.17,.39);
        for(let i=0;i<13;i++)box(wood,x-2.24+i*.37,2.58,edge,.074,.67,.12);
      }
      for(const foot of [-1,1])box(0x877e70,s*4.4,-.57,z+foot*1.63,1.28,2.3,1.44);
    }
    for(const f of [-1,1]){
      const edge=z+f*2.64;
      for(const x of [-3.65,-1.2,1.2,3.65]){
        stamp(round,wood,x,2.66,edge,.2,3.88,.2);
        box(0x82614c,x,4.39,edge,.87,.23,.53);
      }
      for(const h of [1.04,1.86,4.33])box(wood,0,h,edge,7.65,.18,.28);
      for(let i=0;i<25;i++)box(wood,-3.6+i*.3,1.45,edge,.09,.72,.14);
    }
    box(red,0,1.86,-3.62,5.24,3.65,5.95);
    roof(0,3.75,-3.62,6.05,3.38,1.57);
    for(const side of [-1,1])for(const p of [-1.6,0,1.6])box(wood,side*2.64,2.12,-3.62+p,.11,1.13,.84);
  }

  function phoMinh(T,{palette, tapered,box,outline}){
    const stone=0x918d7e,brick=[0x867363,0x8a7566,0x786b60],lip=0x655e53;
    const square=(c,y,h,b,t)=>tapered(c,0,y+h/2,0,b/Math.SQRT2,t/Math.SQRT2,h);
    palette({stone});
    square(stone,0,.6,6,5.65);square(0xb0a795,.6,.66,5.5,5.16);
    let y=1.26;
    for(let i=0;i<14;i++){
      const w=4.75-i*.239,h=1.573-i*.054,wall=i<2?stone:brick[i%3];
      square(wall,y,h*.69,w,w*.977);
      square(lip,y+h*.69,h*.1,w*.985,w*1.1);
      square(i<2?0xb2a998:0x998979,y+h*.79,h*.085,w*1.12,w*1.12);
      square(wall,y+h*.875,h*.125,w*1.12,w*.86);
      for(let f=0;f<4;f++){
        const a=f*Math.PI/2, d=w*.5+.012, ww=w*.16,hh=h*.49;
        outline([[-ww*.5,0],[ww*.5,0],[ww*.5,hh*.63],[ww*.34,hh*.85],[0,hh],[-ww*.34,hh*.85],[-ww*.5,hh*.63]],0x39332c,Math.sin(a)*d,y+.1,Math.cos(a)*d,.025,a);
        for(const s of [-1,1])box(i<2?0xa39a89:0x958373,Math.sin(a)*d+Math.cos(a)*s*w*.34,y+h*.34,Math.cos(a)*d-Math.sin(a)*s*w*.34,w*.075,h*.63,.1,a);
      }
      y+=h;
    }
    for(const [h,b,t] of [[.23,.69,.53],[.49,.48,.29],[.42,.29,.08]]){tapered(0x897e6d,0,y+h/2,0,b,t,h,1,8);y+=h;}
    for(const x of [-3.65,3.65]){
      box(stone,x,.22,4.2,.93,.44,.93);
      tapered(stone,x,1.4,4.2,.35,.24,2);
      tapered(0xa89b86,x,2.53,4.2,.43,.24,.31);
      tapered(stone,x,2.86,4.2,.25,.04,.36);
    }
  }

  function phuocDuyen(T,{stamp,box,outline,tapered}){
    const red=0x995b43,terra=0xc28260,roof=0x71665c,gold=0xc7a262;
    function oct(c,y,h,b,t){
      const geom=new T.CylinderGeometry(t,b,h,8);geom.rotateY(Math.PI/8);stamp(geom,c,0,y+h/2,0);geom.dispose();
    }
    oct(0xa19482,0,.6,5.4,5.18);
    let y=.6;
    for(let i=0;i<7;i++){
      const r=4.65-i*.414,h=3.12-i*.112;
      oct(red,y,h*.77,r,r*.975);
      for(let f=0;f<8;f++){
        const a=f*Math.PI/4, d=r*Math.cos(Math.PI/8),rx=Math.sin(a),rz=Math.cos(a),w=r*.207,hh=h*.57;
        outline([[-w*.5,0],[w*.5,0],[w*.5,hh*.69],[w*.36,hh*.88],[0,hh],[-w*.36,hh*.88],[-w*.5,hh*.69]],0x483b32,rx*(d+.012),y+.18,rz*(d+.012),.03,a);
        for(const s of [-1,1])box(terra,rx*d+rz*s*r*.292,y+h*.405,rz*d-rx*s*r*.292,r*.09,h*.69,.15,a);
      }
      oct(terra,y+h*.77,h*.07,r,r*1.085);
      oct(roof,y+h*.84,h*.06,r*1.13,r*1.07);
      oct(0x96816d,y+h*.9,h*.1,r*1.07,r*.8);
      for(let j=0;j<8;j++){
        const a=(j+.5)*Math.PI/4;
        tapered(gold,Math.sin(a)*r*1.1,y+h*.95,Math.cos(a)*r*1.1,.11,.028,.33,1,5);
      }
      y+=h;
    }
    oct(roof,y,.49,2.1,.77);tapered(gold,0,y+1,0,.43,.03,1.04,1,8);
    for(const x of [-6.1,-3.65,3.65,6.1]){
      box(0xb4a38a,x,.19,9.5,.9,.38,.9);
      box(0xc5a276,x,1.68,9.5,.59,2.61,.59);
      box(0x657c7c,x,1.7,9.81,.26,1.97,.05);
      box(0xd1ad73,x,3.12,9.5,.88,.3,.88);
      tapered(roof,x,3.42,9.5,.66,.33,.4);
      tapered(gold,x,3.75,9.5,.2,.04,.37,1,8);
    }
  }

  (window.VietnamSights??=[]).push(
    {id:'chua-cau',name:'Chùa Cầu',city:'Hội An',lon:108.326026,lat:15.877148,yaw:-.085,width:19.5,depth:15,start:[108.325448,15.876197],solids:[[-6.7,-.23,2.68,.22],[6.7,-.23,2.68,.22],[0,-.23,3.8,.17],[-6.7,5.03,2.68,.22],[6.7,5.03,2.68,.22],[0,5.03,3.8,.17],[0,-3.62,2.62,2.98]],photo:'https://en.baodanang.vn/new-appearance-of-the-japanese-covered-bridge-3139049.html',source:'https://www.openstreetmap.org/way/631074476',build:coveredBridge},
    {id:'pho-minh',name:'Tháp Phổ Minh',city:'Nam Định',lon:106.16316,lat:20.45434,yaw:.32,width:9,depth:10,start:[106.162367,20.454008],solids:[[0,0,2.95,2.95],[-3.65,4.2,.46,.46],[3.65,4.2,.46,.46]],photo:'https://dantri.com.vn/doi-song/thap-pho-minh-dau-tich-hao-khi-dong-a-20171212070120584.htm',source:'https://www.openstreetmap.org/way/1151575774',build:phoMinh},
    {id:'phuoc-duyen',name:'Tháp Phước Duyên',city:'Huế',lon:107.54503,lat:16.45239,yaw:.28,width:14,depth:21,start:[107.545547,16.45216],solids:[[0,0,4.28,4.28],...[-6.1,-3.65,3.65,6.1].map(x=>[x,9.5,.45,.45])],photo:'https://timtour.vn/kham-pha-chua-thien-mu-net-dep-tam-linh-va-van-hoa-o-hue',source:'https://www.openstreetmap.org/way/205795043',build:phuocDuyen}
  );
})();
