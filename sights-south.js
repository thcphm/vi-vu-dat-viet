'use strict';
(() => {
  function holySee(T,{palette, stamp,box,round,tapered,outline,arch}) {
    const buff=0xe8ad63,cream=0xffdf98,pink=0xc96858,blue=0x568eb0,red=0xac4936,shade=0x473c37;
    const globe=new T.SphereGeometry(1,16,10);
    palette({plaster: cream});
    function dome(x,y,z,r,h){
      stamp(globe,cream,x,y,z,r,h,r);
      stamp(round,pink,x,y+.2,z,r*1.05,.28,r*1.05);
      tapered(cream,x,y+h+.8,z,.42,.06,1.7,1,10);
    }
    function roof(z,width,depth,y,rise){
      outline([[-width/2,0],[0,rise],[width/2,0]],red,0,y,z-depth/2,depth);
      box(cream,0,y+rise,z,.46,.36,depth+.4);
      for(const side of [-1,1])box(buff,side*width/2,y,z,.44,.34,depth);
    }
    box(0xae8068,0,.19,0,25.2,.38,96);
    box(buff,0,4.7,-2,18.5,8.8,80);
    roof(-2,21.9,76,9,3.7);
    for(const side of [-1,1]){
      for(let i=0;i<10;i++){
        const z=30-i*7.1;
        box(0x807055,side*9.34,4.2,z,.2,5.2,4.1);
        arch(cream,side*9.64,1.4,z,5.25,6.8,side*Math.PI/2);
        box(pink,side*9.51,4.8,z+3,.45,8.45,.48);
        stamp(globe,blue,side*9.56,6.2,z,.32,.72,.83);
      }
    }
    tapered(buff,0,12.1,-33,10,8.5,7.5,1,8);
    for(const [y,r,rt,h,c] of [[15.9,10,7,2.2,red],[17.9,6.5,6,2.1,cream],[19.8,7,3.3,2.4,red]])
      tapered(c,0,y,-33,r,rt,h,1,8);
    dome(0,21.5,-33,2.6,1.6);
    box(buff,0,6.5,39,15,12.3,9.2);
    for(const x of [-4.2,0,4.2]){
      box(shade,x,2.8,43.74,3.2,4.8,.22);arch(cream,x,.42,44,4.25,5.6);
      box(shade,x,8.15,43.74,2.85,3.2,.22);arch(cream,x,6.25,44,4.25,4.3);
    }
    for(const y of [5.9,10.9])box(pink,0,y,44,14,.48,1.2);
    outline([[-7.5,0],[0,6.2],[7.5,0]],buff,0,11.3,35.8,8.1);
    stamp(globe,cream,0,13.7,44.08,2.1,1.55,.23);
    stamp(globe,blue,0,13.7,44.34,.85,.71,.15);
    stamp(globe,shade,0,13.7,44.48,.35,.40,.07);
    for(const side of [-1,1]){
      const x=side*9;
      box(buff,x,11,40,5.7,21.4,7.1);
      for(const dx of [-2.55,2.55])box(cream,x+dx,11.1,43.65,.48,21.1,.64);
      for(const [y,w,d] of [[.64,6.5,7.7],[6.2,6.5,7.9],[9,6.85,8],[19.5,6.6,8],[22.2,7,8.2]]){
        box(pink,x,y,40,w,.47,d);box(cream,x,y+.34,40,w-.25,.23,d-.18);
      }
      box(blue,x,14.75,43.62,1.72,6.7,.24);
      box(cream,x,14.75,43.79,.25,5.8,.15);
      for(const dx of [-1.4,1.4])box(blue,x+dx,4.2,43.61,.8,2.3,.2);
      for(const [y,w,h] of [[22.5,5.6,3.15],[26.2,4.6,2.7]]){
        box(buff,x,y+h/2,40,w,h,w);
        arch(cream,x,y,40+w/2, w-.3,h);
        stamp(globe,shade,x,y+1.52,40+w/2+.05,.74,.92,.10);
        tapered(red,x,y+h+.28,40,w*.94,w*.54,1.36,1,4);
      }
      dome(x,30.1,40,1.75,1.25);
    }
    globe.dispose();
  }

  function hatTheatre(T,{stamp,box,round,tapered}) {
    const tau=Math.PI*2,leaf=[0xd9d2ba,0xe8e0cc,0xded9c6,0xe5dec9,0xd5d0bb];
    function crown(cx,cz,r,base,rise,tilt){
      const slope=Math.tan(tilt);
      function panel(a,b,inner,outer,color,offset){
        const point=(angle,f)=>[Math.cos(angle)*f*r,base+rise*(1-f)+Math.cos(angle)*f*r*slope+offset,Math.sin(angle)*f*r];
        const av=point(a,inner),bv=point(b,inner),cv=point(a,outer),dv=point(b,outer);
        const vertices=inner===0?[...av,...dv,...cv]:[...av,...bv,...cv,...bv,...dv,...cv];
        if(inner===0&&outer===1&&offset===0)vertices.push(...av,...cv,...dv);
        const geo=new T.BufferGeometry();
        geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();
        stamp(geo,color,cx,0,cz);geo.dispose();
      }
      for(let i=0;i<48;i++){
        const a=tau*i/48,b=tau*(i+1)/48;
        panel(a,b,0,1,leaf[(i*7+Math.floor(i/7))%5],0);
        for(const f of [.32,.60,.82,.982])panel(a,b,f,f+.011,0xb7af94,.065);
        panel(a,a+.003,0,1,0xc3baa1,.07);
      }
      const body=r*.73;
      tapered(0x435d65,cx,base*.51,cz,body,body*.99,base*.94,1,32);
      stamp(round,0xb7aba0,cx,.66,cz,body+1,.87,body+1);
      stamp(round,0xb4aa9a,cx,base*.62,cz,body+.2,.36,body+.2);
      for(let i=0;i<24;i++){
        const a=tau*i/24;
        box(0xb3ada1,cx+Math.cos(a)*body,base*.52,cz+Math.sin(a)*body,.19,base*.88,.3,-a);
      }
      tapered(0x8d806b,cx,base+rise+.14,cz,.31,.06,.39,1,10);
    }
    crown(-14,-10,16,8.9,11.3,.20);crown(15,-9,17.5,9.8,12.4,-.22);
    crown(0,10,22.5,10,14,-.12);
    for(let i=0;i<5;i++)box(i%2?0xbeb4a3:0xcac0b0,0,.12+i*.12,28.7-i*.62,11.2,.24+i*.24,.68);
  }

  function oldTower(T,{box,outline,random}) {
    const colors=[0x995a34,0xae693e,0x864c2e,0xb27048,0x985738,0xbd8255,0x89563c];
    const brick=()=>colors[Math.floor(random()*colors.length)];
    box(0x7d654e,0,.13,0,8.9,.26,9.1);
    for(let n=0;n<4;n++)box(brick(),0,.32+n*.19,0,8.75-n*.19,.2,8.9-n*.13);
    const rows=27;
    for(let n=0;n<rows;n++){
      const y=1+n*.289,hw=3.93-.047*n,hd=4.08-.048*n;
      // The western opening cuts through the ruined vault up to the broken crown.
      const opening=.95+.045*n;
      for(const side of [-1,1]){
        if(n>23&&side===1&&n%3===0)continue;
        const front=hd-(n>21?(n-21)*.18:0);
        const start=side<0?-hw:opening,end=side<0?-opening:hw;
        const count=Math.max(1,Math.ceil((end-start)/.75));
        for(let k=0;k<count;k++)box(brick(),start+(k+.5)*(end-start)/count,y,front-.82,(end-start)/count-.018,.284,1.64);
        box(brick(),side*(hw-.58),y,-.07,1.15,.29,hd*2-1.56);
        for(let j=0;j<7;j++){
          const d=(hd*2-1.58)/7;
          box(brick(),side*(hw-.008),y,-hd+(j+.5)*d,.055,.281,d-.016);
        }
      }
      if(n<24)box(brick(),0,y,-hd+.58,hw*2,.285,1.16);
    }
    box(0x3b312a,0,.97,-.64,2,.18,4.65);
    for(let i=0;i<5;i++)box(0x886247,0,.12+i*.15,5.3-i*.42,2.10,.24+i*.3,.48);
    for(const side of [-1,1])outline([[-.24,0],[.24,0],[.17,2.22],[-.17,2.22]],0x7c5137,side*.77,.98,1.72,.43);
    box(0x765039,0,3.23,1.92,1.93,.29,.48);
  }
  (window.VietnamSights??=[]).push(
    {id:'toa-thanh-tay-ninh',name:'Tòa Thánh Tây Ninh',city:'Tây Ninh',lon:106.1334,lat:11.3039,yaw:-1.63,width:25.2,depth:96,start:[106.13273,11.30515],photo:'https://www.greensm.com/vn-vi/news/toa-thanh-tay-ninh',source:'https://baobinhphuoc.com.vn/news/19/94114/toa-thanh-lon-nhat-cua-dao-cao-dai-nhin-tu-tren-cao',build:holySee},
    {id:'nha-hat-cao-van-lau',name:'Nhà hát Cao Văn Lầu',city:'Bạc Liêu',lon:105.726037,lat:9.2940663,yaw:-1.8,width:65,depth:62,start:[105.726233,9.293553],solids:[[-14,-10,10.5,10.5],[15,-9,11.2,11.2],[0,10,13.9,13.9]],photo:'https://vov.vn/van-hoa/di-san/nha-hat-3-non-la-cong-trinh-kien-truc-van-hoa-doc-dao-giua-long-mien-tay-post1014124.vov',source:'https://toquoc.vn/o-bac-lieu-co-mot-nha-hat-kien-truc-vo-cung-dac-biet-lay-cam-hung-tu-bieu-tuong-nguoi-viet-nam-20220927183232983.htm',build:hatTheatre},
    {id:'thap-vinh-hung',name:'Tháp Vĩnh Hưng',city:'Bạc Liêu',lon:105.5781,lat:9.39202,yaw:-.785,width:8.9,depth:9.1,start:[105.579314,9.390523],photo:'https://mientay.giadinhonline.vn/thap-co-nghin-nam-tai-bac-lieu-minh-chung-mot-thoi-vang-son-cua-nen-van-hoa-oc-eo-d4832.html',source:'https://thayungkhiem.vn/en/van-dao/places/thap-vinh-hung',build:oldTower}
  );
})();
