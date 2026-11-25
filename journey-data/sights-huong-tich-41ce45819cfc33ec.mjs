const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const karst=window.VietnamKarst,atlas=window.VietnamTourism,catalogId='osm-node-2089305122';
  const stop=atlas.byId?.get(catalogId)??atlas.entries.find(s=>s.id===catalogId);
  const inventory='https://nguoihanoi.vn/quan-the-di-tich-danh-thang-huong-son-huyen-my-duc-76350.html';
  // Hà Nội Danh thắng và Di tích II records 34 × 41 m at the mouth and
  // 82 m total depth. Intermediate sections are an interpretation, not a survey.
  const sections=[[0,0,17,41,0],[8,-.6,16.2,28.5,-.05],[20,-2.1,14.1,18.5,-.15],
    [38,-3.3,13.2,14.4,-.16],[60,.4,10.2,10.8,-.25],[82,2,7.4,7.2,-.19]];
  const yaw=.34,c=Math.cos(yaw),s=Math.sin(yaw),tau=2*Math.PI;
  // Normalise the shared irregular arch so that its highest lobe, rather
  // than its centreline parameter, reaches the documented 41 m.
  const archPeak=1.07534;
  const local=(x,z)=>[x*c-z*s,x*s+z*c];
  const mapOffset=(x,z)=>[x*c+z*s,-x*s+z*c];
  // Last part of the cobbled footway w279360036 in east/south metres. The
  // gate position along it, 120 riser heights and masonry widths are estimated.
  const route=[[0,0],[9.4,13.4],[10.5,21.6],[6.1,39.2],[4.3,47.8],[2.0,55.7]].map(p=>local(...p));
  const lengths=route.map((p,i)=>i?Math.hypot(p[0]-route[i-1][0],p[1]-route[i-1][1]):0);
  const length=lengths.reduce((sum,l)=>sum+l,0),rise=19.8;
  const beyond=[[2,55.7],[10.7,67.2],[26.5,78],[49.1,89]].map(p=>local(...p));
  function at(t){
    let d=Math.max(0,Math.min(1,t))*length;
    for(let i=1;i<route.length;i++){
      const a=route[i-1],b=route[i],l=lengths[i];
      if(d<=l||i===route.length-1)return [a[0]+(b[0]-a[0])*d/l,a[1]+(b[1]-a[1])*d/l];
      d-=l;
    }
  }
  function stairPoint(t,across=0){
    const p=at(t),a=at(t-.032),b=at(t+.032),angle=Math.atan2(b[0]-a[0],b[1]-a[1]);
    return [p[0]+across*Math.cos(angle),p[1]-across*Math.sin(angle),angle];
  }
  // Interpolate by local Z as well as distance to tie the limestone and
  // vegetation flanking the descent to the exact surface supporting its steps.
  function routeAtZ(z){
    let run=0;
    for(let i=1;i<route.length;i++){
      const a=route[i-1],b=route[i];
      if(z<=b[1]){
        const t=Math.max(0,Math.min(1,(z-a[1])/(b[1]-a[1])));
        return [a[0]+(b[0]-a[0])*t,(run+t*lengths[i])/length];
      }
      run+=lengths[i];
    }
    for(let i=1;i<beyond.length;i++){
      const a=beyond[i-1],b=beyond[i];
      if(z<=b[1]||i===beyond.length-1){
        const t=Math.max(0,Math.min(1,(z-a[1])/(b[1]-a[1])));
        return [a[0]+(b[0]-a[0])*t,1];
      }
    }
  }
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  function bank(x,z){
    const [centre,t]=routeAtZ(z),w=Math.abs(x-centre),base=rise*t;
    const stone=smooth((w-2.9)/8.2),downslope=smooth((z+3)/8);
    return base-.42+downslope*stone*(2.5+2.4*Math.sin(.2*z+.32*x)+1.55*Math.cos(.73*x-.21*z)+.11*w);
  }
  function forecourt(rock){
    // The central flags continue under the tread noses, with natural stone
    // banks on either side. Grow vegetation outside this route only.
    for(const side of [-1,1])rock.grid(34,100,(u,v)=>{
      const z=-2+v*(beyond.at(-1)[1]+2),[centre]=routeAtZ(z),x=centre+side*u*32;
      const foot=z>=route.at(-1)[1]&&u<.08;
      return [x,bank(x,z)+(foot?.55:0),z,foot?0xbab6a2:u<.11?0xa39d88:u<.24?0x8c8a71:0x798265,
        .79+.12*Math.sin(.79*x+.42*z)+.07*Math.cos(1.32*x-.70*z)];
    });
    for(let j=0;j<120;j++){
      const t=j/120,tt=(j+1)/120,h=.14+rise*tt,colour=[0xc1bba9,0xb5b2a4,0xc7c1ae,0xbcb8aa][j%4];
      rock.grid(8,1,(u,v)=>{
        const [x,z]=stairPoint(t+(tt-t)*v,(u-.5)*5.15);
        return [x,h+.014*Math.cos(u*14+j),z,colour,.96-.09*Math.abs(u-.5)];
      });
      rock.grid(8,1,(u,v)=>{
        const [x,z]=stairPoint(t,(u-.5)*5.15);
        return [x,h-(1-v)*.19,z,0x998f7f,.9];
      });
      if(j%2===0)for(const side of [-1,1]){
        const z0=j/120,z1=(j+2)/120,y=.1+rise*z1;
        rock.grid(3,1,(u,v)=>{
          const [x,z]=stairPoint(z0+(z1-z0)*v,side*(2.57+.43*u));
          return [x,y+.50+Math.sin(u*Math.PI)*.025,z,0xabaa96,.93];
        });
        rock.grid(1,1,(u,v)=>{
          const [x,z]=stairPoint(z0+(z1-z0)*u,side*2.57);
          return [x,y-.28+.78*v,z,0x9b9380,.78+.15*v];
        });
        rock.grid(1,1,(u,v)=>{
          const [x,z]=stairPoint(z0,side*(2.57+.43*u));
          return [x,y+.10+v*.40,z,0x898775,.85];
        });
      }
    }
    for(let i=0;i<64;i++){
      const side=i%2?1:-1,z=2+(i*.618034%1)*81,[centre]=routeAtZ(z);
      const x=centre+side*(4.8+(i*.32693%1)*20),y=bank(x,z);
      if(i%3<2){
        const r=.66+(i*.78273%1)*1.6;
        karst.boulder(rock,x,y-.18,z,r,r*(.85+.72*(i*.322%1)),r*1.19,i,true);
      }else{
        const h=5.6+4.8*(i*.89723%1);
        rock.trees.push([x,y-.12,z,h*.77,h,i*2.6]);
      }
      rock.ferns.push([x+side*.86,bank(x+side*.86,z)-.14,z,.66+(i*.3838%1)*.96,i*2.3]);
    }
    for(let i=0;i<16;i++){
      const side=i%2?1:-1,z=13+(i*.61803%1)*54,[centre]=routeAtZ(z);
      const x=centre+side*(7.8+(i*.4334%1)*4.5),h=7.8+(i*.33113%1)*5.2;
      rock.trees.push([x,bank(x,z)-.13,z,h*.65,h,i*2.35]);
    }
  }
  function stoneGate(T,kit){
    const [x,z,angle]=stairPoint(.985),h=.14+rise*.985,stone=0x9a9987,grey=0xb0ad9e;
    kit.place(x,z,angle,()=>{
      const span=1.48,sh=new T.Shape();
      sh.moveTo(-2.38,0);sh.lineTo(-span,0);sh.lineTo(-span,2.52);
      sh.quadraticCurveTo(-1.41,3.35,0,4.02);sh.quadraticCurveTo(1.41,3.35,span,2.52);
      sh.lineTo(span,0);sh.lineTo(2.38,0);sh.lineTo(2.38,4.48);sh.lineTo(-2.38,4.48);sh.closePath();
      kit.profile(sh,stone,0,h,-.45,.90);
      for(const side of [-1,1]){
        kit.box(grey,side*2,h+.17,0,.96,.35,1.05);
        for(const y of [1.23,2.35])kit.box(0x858675,side*1.93,h+y,0,.89,.051,.94);
        kit.box(grey,side*1.96,h+2.48,0,.99,.14,1.03);
      }
      kit.box(grey,0,h+4.50,0,4.91,.16,1.10);
      kit.box(0x93927d,0,h+4.89,0,4.66,.61,.88);
      for(const side of [-1,1])kit.box(0x8b8978,0,h+4.89,side*.455,2.80,.41,.063);
      kit.box(grey,0,h+5.25,0,5.02,.18,1.10);
      kit.box(0x8d8d76,0,h+5.39,0,4.75,.13,.93);
      kit.box(0xb9b4a1,0,h+.04,.2,4.67,.12,1.78);
      for(const side of [-1,1])for(let j=0;j<6;j++){
        const block=.67,xx=(2.37+(j+.5)*block)*side,top=1.32+.32*Math.sin(.87*j);
        kit.box(j%3===1?0x837d68:0x96917e,xx,h+top/2-.1,0,block-.014,top,.82);
        kit.box(0xa49f89,xx,h+top-.08,0,block-.012,.12,.91);
      }
      // Photographs of the gateway show a string of small cloth pennants
      // between trees above the stone. Its sag and spacing are approximate.
      const cord=x=>h+5.77+.015*x*x-.035*x,forward=x=>1.12+.17*x;
      const colours=[0xcb713f,0xbbb05d,0x557e85,0xb55754,0x749267];
      for(let i=0;i<12;i++){
        const a=-8+i*1.3,b=a+1.30;
        window.CentralArch.strut(T,kit,0x695c42,a,cord(a),forward(a),b,cord(b),forward(b),.016);
        const xx=a+.35,flag=new T.Shape();flag.moveTo(0,0);flag.lineTo(.49,.005);
        flag.lineTo(.32,-.64+.16*Math.sin(2.1*i));flag.lineTo(.11,-.48);flag.closePath();
        kit.profile(flag,colours[i%colours.length],xx,cord(xx),forward(xx),.013,-.17);
      }
    });
  }
  // The inventory photograph shows a flared, fluted lower skirt, a slender
  // mossy crown and an altar directly in front. Their proportions follow that
  // photograph. No unseen Buddhist figures or deep shrines are reconstructed.
  function dunGao(T,kit,rock){
    const form=[[.05,2.52],[1.4,2.62],[3.0,3.10],[4.55,4.78],[6.8,4.63],[9.4,3.95],[12.10,3.15],[14.60,2.02],[16.5,.92],[17.42,.13],[17.52,.04]];
    function flank(a,y,r){
      const f=.095*Math.cos(9*a+.13*y)+.049*Math.sin(17*a-.09*y)+.031*Math.cos(31*a+.11*y);
      const twist=.082*Math.sin(y*.32)+.055*Math.sin(3*a+y*.31);
      return [.78+.42*Math.sin(y*.20)+(1+f)*r*Math.cos(a+twist),-13.1-.038*y+(1+f)*r*.82*Math.sin(a+twist)];
    }
    for(let j=1;j<form.length;j++)rock.grid(116,4,(u,v)=>{
      const a=tau*u,[lo,ra]=form[j-1],[hi,rb]=form[j],y=lo+(hi-lo)*v,r=ra+(rb-ra)*v;
      const [x,z]=flank(a,y,r);
      const moss=.33*Math.sin(a*6+y*.41)+.27*Math.cos(a*15+y*.57)+.24*Math.sin(a*39-.88*y)+.18*Math.cos(3.51*y-23*a);
      const tongue=.65+.25*Math.cos(a*9+.13*y)+.10*Math.sin(a*22);
      const tint=y<3.15?0x56594b:y>5.2+1.1*Math.sin(a*3.2)&&moss>-.045?moss>.39?0x71824c:0x747b5a:
        (tongue>.79?0xc6bba0:tongue>.54?0xadb09a:0x8a8b7a);
      return [x,y+(.10+.18*Math.sin(y*.19))*Math.sin(9*a+.2*y),z,tint,.81+.15*tongue];
    });
    for(let j=0;j<43;j++){
      const a=j/43*tau,[x,z]=flank(a,4.56,4.72),h=.75+1.75*(.5+.5*Math.sin(j*7.76)),w=.25+.13*Math.sin(j*6.93);
      rock.grid(12,7,(u,v)=>{
        const phi=tau*u,rr=w*(.10+.90*v**.67)*(1+.14*Math.cos(4*phi+j));
        return [x-(1-v)*.24*Math.cos(a)+rr*Math.cos(phi),4.79-h*(1-v),z-(1-v)*.19*Math.sin(a)+.94*rr*Math.sin(phi),
          j%5?0xc7b38c:0xa19878,.72+.22*v];
      });
    }
    const table=0x957d68,lip=0xae947e,wood=0x8c5444,brass=0xb39b64;
    kit.palette({stone:[table,lip],timber:wood,metal:brass});
    kit.place(.9,-7.25,0,()=>{
      for(const xx of [-1.26,0,1.26])kit.box(table,xx,.55,0,.23,1.07,.76);
      kit.box(wood,0,.92,.395,2.70,.31,.12);
      kit.box(table,0,1.11,0,3.11,.19,.96);kit.box(lip,0,1.25,0,3.24,.10,1.04);
      kit.tapered(brass,0,1.55,.10,.18,.29,.35,1,22);kit.tapered(brass,0,1.75,.10,.30,.28,.075,1,22);
      for(const xx of [-1.03,1.03]){
        kit.tapered(brass,xx,1.43,-.02,.145,.065,.25,1,16);
        kit.tapered(brass,xx,1.64,-.02,.055,.05,.23,1,14);
        kit.tapered(brass,xx,1.79,-.02,.063,.13,.09,1,16);
      }
    });
  }
  function nearWalls(rock){
    // Fractured, tilted rock beds flank the two shaded spaces visible beside
    // Đụn Gạo in the inventory photo. Leave both passages and the forecourt open.
    for(const [side,shift] of [[-1,.28],[1,2.13]]){
      rock.grid(64,35,(u,v)=>{
        const depth=32*u,i=sections.findIndex(p=>p[0]>=depth),a=sections[Math.max(0,i-1)],b=sections[i];
        const t=(depth-a[0])/Math.max(.01,b[0]-a[0]),lerp=(k)=>a[k]+t*(b[k]-a[k]);
        const angle=side>0?1.42*v:Math.PI-1.42*v;
        const relief=1+.075*Math.sin(5*angle+1.07)+.041*Math.cos(11*angle-1.07);
        const y=lerp(4)-.11+lerp(3)*Math.sin(angle)**.72*relief/archPeak;
        const plane=Math.abs(Math.sin(y*.43-depth*.28+shift+.76*Math.sin(.39*depth)));
        const ledge=(1-plane)**1.7*(1.4+1.3*Math.cos(y*.37-depth*.17)**2);
        const envelope=.24+Math.sin(Math.PI*u)**.53*Math.sin(Math.PI*v)**.55;
        const x=lerp(1)+lerp(2)*Math.cos(angle)-side*(.29+envelope*(1.05+ledge));
        return [x,y,-depth-1.45,plane>.72?0x858c81:0x737e73,
          (.91-.61*smooth(depth/31))*(.74+.26*plane)];
      });
    }
  }
  function build(T,kit){
    const rock=karst.batch(T);
    const interior={...rock,grid(cols,rows,sample){rock.grid(cols,rows,(u,v)=>{
      const point=sample(u,v),[x,y,z,tint]=point;
      point[1]/=archPeak;
      if(tint===0xb3a992||tint===0x958c73){
        const dim=smooth((-z-6)/21);
        if(tint===0x958c73)point[0]*=1.13;
        point[3]=tint===0x958c73?(z>-11?0xb4b0a2:0x898e82):0x8c928a;
        point[4]*=(1-.82*dim)*(.93+.09*Math.cos(.7*y+.31*x));
      }
      return point;
    });}};
    karst.grotto(interior,sections,45,58,1.07);
    for(const plants of [rock.trees,rock.ferns])for(const p of plants)p[1]/=archPeak;
    nearWalls(rock);forecourt(rock);stoneGate(T,kit);dunGao(T,kit,rock);
    karst.finish(T,kit,rock,(ground,x,z)=>{
      const [centre]=routeAtZ(z);
      const side=z<=0?smooth((Math.abs(x)-18)/24):smooth((Math.abs(x-centre)-8)/22);
      const outer=Math.max(side,smooth((z-61)/(beyond.at(-1)[1]-61)));
      return outer*(ground(x,z)-(z>0?bank(x,z):0));
    });
  }
  function shot(name,x,z,height,run,angle,elevation){
    return {name,offset:mapOffset(x,z),height,viewRadius:run,viewAngle:yaw+angle,viewElevation:elevation,viewBase:'monument'};
  }
  const gate=stairPoint(.985);
  (window.VietnamSights??=[]).push({...stop,id:'dong-huong-tich-huong-son',catalogId,name:'Động Hương Tích',
    kind:'Hang động',province:'Hà Nội',city:'Hương Sơn',region:'Bắc Bộ',lon:105.7337296,lat:20.614065,
    source:inventory,photo:inventory,map:'https://www.openstreetmap.org/node/2089305122',
    start:stop.start,approachMeters:undefined,mappedEntrance:true,visitOnArrival:true,
    arrivalNote:'Xe dừng cạnh Bến xe Hương Sơn ở chợ Đục Khê. Từ đây đi bộ hoặc đi xe điện đến Bến Yến, đi đò theo suối Yến rồi qua Thiên Trù và lên núi đến lối xuống động.',
    description:'Qua cổng đá là 120 bậc đi xuống cửa động Hương Tích. Khối nhũ đá Đụn Gạo đứng gần giữa cửa, phía trước có bàn thờ. Tư liệu ghi cửa rộng 34 m, cao 41 m, động sâu 82 m. Các mặt cắt phía trong và tỉ lệ Đụn Gạo được ước dựng theo ảnh.',
    yaw,width:90,depth:176,solids:[],caveOpening:{sections,approach:60},foundationAt:[18,56],
    views:[shot('Từ bậc đá nhìn vào cửa động',.35,-6.4,31,41,-.035,.095),
      shot('Đụn Gạo và bàn thờ trước cửa',.9,-11.6,20,27,.075,.09),
      shot('Từ lòng động nhìn lên bậc đá',3,19,31,45,Math.PI+.26,-.21),
      shot('Cổng đá ở đầu lối xuống',gate[0],gate[1],50,12,gate[2]+.18,.08)],build});
})();

export default window.VietnamSights;
