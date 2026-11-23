'use strict';
(() => {
  const sites=window.VietnamSights??=[];
  const brick=0xa86647, fired=0xb77751, umber=0x80513e, worn=0x98745b, sandstone=0xada68f;
  const steel=0x8b9890, lead=0x58605a, sand=0xb6a687;
  function view(name,height,viewRadius,viewAngle,viewElevation,offset=[0,0],viewFov=54){
    return {name,height,viewRadius,viewAngle,viewElevation,offset,viewFov};
  }
  function register(id,node,name,province,city,lon,lat,start,yaw,width,depth,extra,build){
    sites.push({id,catalogId:'osm-node-'+node,name,province,city,kind:'Di tích',region:'Trung Bộ',
      lon,lat,start,yaw,width,depth,visitOnArrival:true,map:'https://www.openstreetmap.org/node/'+node,...extra,build});
  }
  function offset(yaw,x,z){return [Math.cos(yaw)*x+Math.sin(yaw)*z,Math.cos(yaw)*z-Math.sin(yaw)*x];}
  function finish(k){k.palette({brick:[brick,fired,umber,worn,0x8c6450,0xa8795e],stone:[sandstone,0x8e8a78,0x7e7968]});}
  function rod(T,k,color,a,b,radius){CentralArch.strut(T,k,color,...a,...b,radius);}

  // The only tall surviving fabric of Đồng Dương is at Tháp Sáng. From the
  // west the two jambs and the horizontal stone between them can be seen
  // through a breach in the upper brickwork. Both sides are visible.
  function dongDuong(T,k){
    finish(k);
    const tones=[0x8d5e49,0x97644c,0xa06d52,0x8c6450,0xa57154,0x966b50];
    k.palette({brick:tones});
    const front=[[-3.12,1.46],[-2.85,2.37],[-2.43,3.43],[-2.17,4.65],[-1.72,5.68],[-1.2,5.95],
      [-.63,5.77],[-.24,5.31],[.10,4.92],[.45,5.37],[.85,5.62],[1.34,5.87],[1.77,5.72],[2.06,5.03],[2.39,4.69],[2.80,3.28],[3.07,1.72]];
    function heightAt(x){
      let j=1;while(j<front.length-1&&front[j][0]<x)j++;
      const [ax,ay]=front[j-1],[bx,by]=front[j];return ay+(by-ay)*(x-ax)/(bx-ax);
    }
    // Lay individual broken courses along the unequal shoulders. Each whole
    // brick bridges the wall thickness, avoiding a hollow card at the edges.
    const courses=Array.from({length:36},()=>[]);
    for(let row=0;row<courses.length;row++)for(let col=0;col<21;col++){
      const n=(row*7+col*19+row*col*5)%31;
      const x=-3.06+col*.301+(row%2)*.125,y=.115+row*.165;
      if(y>heightAt(x)+(n-15)*.013)continue;
      const aperture=y<2.84?.57:Math.max(.18,.85-(y-2.84)*.23);
      if(Math.abs(x-.10)<aperture)continue;
      if(Math.abs(x)>2.37&&y<.62&&n%4!==1)continue;
      if(row&&!courses[row-1].some(below=>Math.abs(x-below)<.25))continue;
      courses[row].push(x);
      const ragged=Math.abs(x)>2.20||y>heightAt(x)-.48||Math.abs(x-.10)<aperture+.33;
      const d=ragged?.84+n*.024:1.36+.065*(n%3);
      k.box(tones[n%tones.length],x,y,-.06+.02*((n%5)-2),.325,.168,d,(n%7-3)*(ragged?.016:.001));
    }
    // Smooth sandstone jambs contrast with chipped, leafy mouldings on the
    // brick pilasters beside them. The lintel has lost its upper moulding.
    for(const s of [-1,1]){
      k.box(sandstone,.10+s*.82,1.49,.54,.48,2.94,.63);
      k.box(0x8e8a78,.10+s*.83,.23,.60,.67,.43,.72);
      for(let j=0;j<18;j++){
        const n=(j*13+(s+1)*7)%23;
        if(n%6===0)continue;
        const xx=s*(1.42+.017*(n%4)),y=.34+j*.255;
        k.box(n%3?0x8c6450:worn,xx,y,.68,.39,.251,.35);
        k.outline([[-.12,-.08],[-.14,.04],[-.07,.13],[.012,.12],[.08,.16],[.13,.10],[.026,.07],[-.06,-.052]],
          n%3?0xa8795e:sandstone,xx,y,.865,.036);
      }
      for(let i=0;i<4;i++){
        const w=1.35-.10*i;
        k.box(i===1?worn:umber,s*(1.83-.025*i),4.12+i*.14,.56,w,.12,.72-.07*i);
      }
    }
    k.box(0x8e8a78,.10,2.98,.50,2.28,.32,.68);
    k.box(sandstone,-.40,3.17,.49,1.27,.095,.70);
    // The documented temporary support consists of tubes with footplates,
    // tall uprights and raking props on the two faces of the ruin.
    for(const s of [-1,1]){
      const z=s*1.58;
      for(const x of [-2.75,-.94,1.04,2.82]){
        k.box(lead,x,.04,z,.32,.08,.33);
        rod(T,k,steel,[x,.08,z],[x,5.53,z],.057);
        const foot=z+s*(x<0?1.76:2.0);
        rod(T,k,steel,[x,.10,foot],[x,3.97,z],.062);
        k.box(lead,x,.055,foot,.41,.11,.35);
        for(const y of [2.7,4.67]){
          rod(T,k,steel,[x,y,z],[x,y,s*.59],.041);
          k.box(lead,x,y,s*.74,.22,.24,.07);
        }
      }
      for(const y of [.74,2.05,4.70,5.52])rod(T,k,steel,[-2.79,y,z],[2.84,y,z],.046);
      for(const x of [-2.75,2.82])rod(T,k,steel,[x,.75,z+s*1.50],[x,.75,z],.043);
    }
    for(const x of [-2.75,-.94,1.04,2.82])rod(T,k,steel,[x,5.52,-1.58],[x,5.52,1.58],.05);
    for(let j=0;j<16;j++){
      const a=j*2.4,r=2.7+j%4*.31;
      k.box(tones[j%6],Math.cos(a)*r,.10,Math.sin(a)*r*.40,.29+j%3*.12,.15+j%3*.06,.25,a);
    }
  }
  const dongYaw=-1.68;
  register('phat-vien-dong-duong','11784634072','Phật viện Đồng Dương','Đà Nẵng','Đồng Dương',108.294395,15.675329,
    [108.294908,15.675746],dongYaw,6.6,7.6,{
      source:'https://baotanglichsu.vn/vi/Articles/3101/76728/phat-vien-djong-duong-canh-cua-ket-noi-lich-su-ngan-nam.html',
      photo:'https://dantri.com.vn/du-lich/tim-cach-bao-ton-di-tich-noi-tung-la-thanh-dia-phat-giao-o-dong-nam-a-20260516170107153.htm',
      description:'Năm 875, vua Indravarman II cho lập Phật viện Đồng Dương. Giữa khu di tích ngày nay còn mảng tường Tháp Sáng. Qua giàn chống thép có thể thấy hai trụ cửa, thanh đá ngang và những hàng gạch đã mất ở mép vòm.',
      gardenRadius:7,solids:[[-1.83,0,1.23,.80],[1.84,0,1.20,.80]],
      views:[view('Mảng tường Tháp Sáng và giàn chống',6.5,13.5,dongYaw+.32,.12),
        view('Trụ cửa và thanh đá bắc ngang',5.95,5.75,dongYaw-.18,.045,offset(dongYaw,.12,.38),51),
        view('Mép gạch vỡ ở mặt sau',7.5,8.3,dongYaw+2.76,.18)]},dongDuong);

  function hollowCourse(k,tint,w,d,innerW,innerD,y,h,opening=0){
    const side=(w-innerW)/2,end=(d-innerD)/2;
    for(const sign of [-1,1])k.box(tint,sign*(w-side)/2,y,0,side,h,d);
    k.box(tint,0,y,-(d-end)/2,innerW,h,end);
    const cheek=(innerW-opening)/2;
    for(const sign of [-1,1])k.box(tint,sign*(cheek+opening)/2,y,(d-end)/2,cheek,h,end);
  }
  function phuChamber(T,k){
    // Measured east door, its three steps, the 3.9 × 3.3 m interior and the
    // moulded return below the lost roof. Leave the top and doorway open.
    k.box(0x8c6450,0,.05,0,7.12,.10,8.22);
    k.box(0xa8795e,0,.158,0,3.32,.085,3.93);
    for(const [y,h,w,d,color] of [[.17,.18,6,6.25,worn],[.33,.15,5.82,6.06,umber],
      [.47,.15,5.54,5.80,fired],[.59,.12,5.17,5.58,brick],
      [1.46,1.62,5,5.35,brick],[2.33,.12,5.12,5.47,umber],[2.46,.12,5.03,5.38,brick],
      [2.63,.21,5.24,5.58,fired],[2.86,.25,5.48,5.82,brick],[3.06,.16,5.60,5.94,worn]]){
      hollowCourse(k,color,w,d,3.3,3.9,y,h,.89);
    }
    for(const s of [-1,1]){
      k.box(brick,s*1.03,1.56,3.30,1.10,2.20,1.72);
      for(const x of [.57,1.42])k.box(fired,s*x,1.58,4.14,.17,1.88,.23);
      for(const [y,w,h] of [[.20,1.45,.18],[.40,1.39,.19],[.58,1.25,.13],[2.57,1.17,.13],[2.74,1.32,.14],[2.91,1.45,.17]])
        k.box(y<1?worn:fired,s*1.04,y,3.34,w,h,1.79);
    }
    // Corbelled passage: a narrow slot of sky separates the surviving cheeks.
    for(const s of [-1,1])for(let j=0;j<6;j++){
      k.box(j%3?brick:worn,s*(.44-j*.053),2.53+j*.108,3.06,.24,.115,1.12);
    }
    for(let j=0;j<3;j++)k.box(worn,0,.085*(3-j),4.23+.24*j,1.06,.17*(3-j),.26);
    for(let n=1;n<=3;n++)k.place(0,0,n*Math.PI/2,()=>{
      const z=n===2?2.675:2.50;
      for(const sign of [-1,1]){
        k.box(fired,sign*1.99,1.51,z+.055,.40,1.93,.19);
        k.box(worn,sign*1.99,.53,z+.10,.51,.48,.26);
      }
      k.box(umber,0,.29,z+.24,2.03,.49,.82);
      k.box(fired,0,1.26,z+.31,1.73,1.57,.72);
      k.box(brick,0,1.32,z+.69,1.23,1.38,.16);
      for(const sign of [-1,1])k.box(fired,sign*.64,1.31,z+.76,.12,1.42,.17);
      for(let j=0;j<6;j++)k.box(j%2?fired:brick,0,2.09+j*.107,z+.32,1.75-j*.23,.112,.67-j*.045);
    });
    k.box(umber,0,.43,0,.84,.74,.80);
    k.box(sandstone,0,.84,0,.87,.13,.83);
    k.box(sandstone,0,.83,-.53,.20,.12,.30);
    // A separate brick pedestal outside the glass shelter is visible from
    // the steps on the eastern edge of the excavation.
    k.place(-.72,12.33,0,()=>{
      for(const [y,w,h] of [[.17,1.55,.34],[.40,1.44,.12],[.52,1.37,.13],[.83,1.18,.52],[1.15,1.31,.13],[1.28,1.45,.12]]){
        k.box(y>.5?brick:worn,0,y,0,w,h,w);
      }
      const ring=new T.Shape();ring.absarc(0,0,.39,0,Math.PI*2,false);
      const hole=new T.Path();hole.absarc(0,0,.098,0,Math.PI*2,true);ring.holes.push(hole);
      const cap=new T.ExtrudeGeometry(ring,{depth:.10,bevelEnabled:false,curveSegments:14});cap.rotateX(-Math.PI/2);
      k.stamp(cap,fired,0,1.34,0);cap.dispose();
    });
  }
  function excavation(T,k){
    // OSM ways 1145070775 (retaining wall) and 1145070774–85 (stairs)
    // locate the inner court and the four access flights around the canopy.
    // The surrounding sand rises to the rim so the gallery and the masonry
    // can both sit on the continuous terrain surface used for driving.
    const rings=[[-2.15,4.2,13.7,12.8,.11],[-2.15,4.2,14.2,13.3,.62],[-.9,4.0,19,18.15,1.91],
      [-.9,4.0,19.5,18.65,2.12],[.1,3.3,28.8,28.5,3.89],[.1,3.3,29.3,29.0,4.12],[.1,3.3,30.8,30.5,4.06],
      [.1,3.3,35.8,35.5,2.04],[.1,3.3,42,42,-1.4]];
    const colors=[0x8e8a78,sand,worn,sand,0x8e8a78,0xab9e82,0xb0a386,0xa79d82];
    const corners=(r)=>[[-1,-1],[-1,1],[1,1],[1,-1]].map(([x,z])=>[r[0]+x*r[2],r[4],r[1]+z*r[3]]);
    k.box(sand,-2.15,.01,4.2,27.5,.20,25.7);
    const surveySurface=[];
    const floor=corners(rings[0]);
    surveySurface.push(...floor[0],...floor[1],...floor[2],...floor[0],...floor[2],...floor[3]);
    for(let j=0;j<rings.length-1;j++){
      const a=corners(rings[j]),b=corners(rings[j+1]),coords=[];
      for(let t=0;t<4;t++){const n=(t+1)%4;coords.push(...a[t],...b[t],...b[n],...a[t],...b[n],...a[n]);}
      if([1,3,5,6,7].includes(j))surveySurface.push(...coords);
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(coords,3));g.computeVertexNormals();
      k.stamp(g,colors[j],0,0,0);g.dispose();
    }
    const uv=[];for(let i=0;i<surveySurface.length;i+=3)uv.push(surveySurface[i]/3.2,surveySurface[i+2]/3.2);
    const groundMesh=new T.BufferGeometry();
    groundMesh.setAttribute('position',new T.Float32BufferAttribute(surveySurface,3));
    groundMesh.setAttribute('uv',new T.Float32BufferAttribute(uv,2));groundMesh.computeVertexNormals();
    const texture=new T.TextureLoader().load('streetscape/verge-earth.webp');
    texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.colorSpace=T.SRGBColorSpace;
    const earth=new T.MeshStandardMaterial({map:texture,color:0xc7b592,roughness:1});
    earth.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',
      'vec3 soil=texture2D(map,vMapUv).rgb; diffuseColor.rgb*=vec3(.56)+soil*1.8;');};
    const groundSurface=new T.Mesh(groundMesh,earth);groundSurface.position.y=.016;groundSurface.receiveShadow=true;k.group.add(groundSurface);
    const flights=[[4.1,17,1.3,32.2],[-6,-8.4,-.8,-25.3],[-15.7,8.8,-29.1,4.8],[11.7,-2.3,29.2,1]];
    function bankLevel(x,z){
      let inside=rings[0],a=Math.max(Math.abs(x-inside[0])-inside[2],Math.abs(z-inside[1])-inside[3]);
      if(a<=0)return inside[4];
      for(const outside of rings.slice(1)){
        const b=Math.max(Math.abs(x-outside[0])-outside[2],Math.abs(z-outside[1])-outside[3]);
        if(b<=0)return inside[4]+(outside[4]-inside[4])*a/(a-b);
        inside=outside;a=b;
      }
      return inside[4];
    }
    for(const [x,z,x1,z1] of flights){
      const length=Math.hypot(x1-x,z1-z),yaw=Math.atan2(x1-x,z1-z),run=length/23;
      const level=t=>bankLevel(x+(x1-x)*t,z+(z1-z)*t);
      k.place(x,z,yaw,()=>{
        for(let j=0;j<23;j++){
          const top=level((j+1)/23)+.11;
          k.box(j%4===0?umber:brick,0,top-.12,(j+.5)*run,2.03,.24,run+.03);
        }
        const breaks=[0,.20,.38,.64,.85,1];
        for(const s of [-1,1])for(let j=1;j<breaks.length;j++){
          const a=breaks[j-1],b=breaks[j];
          rod(T,k,umber,[s*1.08,level(a)+.24,a*length],[s*1.08,level(b)+.24,b*length],.075);
        }
      });
    }
  }
  function phuShelter(T,k){
    // Curved, blue light-transmitting canopy and clear glass gables are
    // documented in the 2026 on-site photographs. The OSM shelter's long
    // axis is 70° in game coordinates (20° south of east).
    const half=4.99,front=6.34,back=-6.59;
    const contour=x=>2.86+3.44*Math.cos(Math.abs(x/half)*Math.PI*.5)**.77;
    const ribs=[back,-4.44,-2.28,-.13,2.03,4.18,front],slices=16;
    const roof=[],glass=[];
    function quad(store,a,b,c,d){store.push(...a,...b,...c,...a,...c,...d);}
    for(const z of ribs){
      for(const s of [-1,1])rod(T,k,steel,[s*half,.13,z],[s*half,2.86,z],.046);
      for(let i=0;i<slices;i++){
        const x=half*(2*i/slices-1),next=half*(2*(i+1)/slices-1);
        rod(T,k,steel,[x,contour(x),z],[next,contour(next),z],.052);
        if(z===front){
          quad(roof,[x,contour(x),back],[next,contour(next),back],[next,contour(next),front],[x,contour(x),front]);
          for(const face of [front,back])quad(glass,[x,2.87,face],[next,2.87,face],[next,contour(next),face],[x,contour(x),face]);
        }
      }
    }
    for(const s of [-1,1]){
      const x=s*half;
      quad(glass,[x,.16,back],[x,.16,front],[x,2.86,front],[x,2.86,back]);
      for(const y of [.15,1.4,2.86])rod(T,k,steel,[x,y,back],[x,y,front],.041);
    }
    for(const face of [back,front]){
      for(let i=-3;i<=3;i++){
        const x=i*1.39,lo=face===front&&i===0?2.38:.16,hi=contour(x);
        rod(T,k,steel,[x,lo,face],[x,hi,face],.038);
      }
      for(const y of [1.44,2.86,4.15,5.13]){
        const w=y<=2.86?half:half*Math.acos(((y-2.86)/3.44)**(1/.77))*2/Math.PI;
        if(face===front&&y===1.44){
          for(const s of [-1,1])rod(T,k,steel,[s*.89,y,face],[s*w,y,face],.041);
        }else rod(T,k,steel,[-w,y,face],[w,y,face],.041);
      }
      for(const s of [-1,1])quad(glass,[s*.89,.16,face],[s*half,.16,face],[s*half,2.86,face],[s*.89,2.86,face]);
    }
    for(const s of [-1,1]){
      rod(T,k,steel,[s*1.02,.15,front],[s*1.02,2.12,front],.046);
      rod(T,k,steel,[s*1.02,2.12,front],[0,3.09,front],.046);
    }
    for(const frac of [-.78,-.40,0,.40,.78]){
      const x=frac*half;rod(T,k,steel,[x,contour(x),back],[x,contour(x),front],.037);
    }
    for(const [coords,color,opacity] of [[roof,0x37c7d5,.36],[glass,0xaccdcc,.075]]){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(coords,3));g.computeVertexNormals();
      const m=new T.MeshStandardMaterial({color,transparent:true,opacity,roughness:.45,depthWrite:false,side:T.DoubleSide});
      k.group.add(new T.Mesh(g,m));
    }
  }
  const phuYaw=70*Math.PI/180;
  register('thap-phu-dien','7372895085','Tháp Phú Diên','Huế','Phú Diên',107.746106,16.495795,
    [107.745687,16.495325],phuYaw,10.1,13.0,{
      source:'https://joshusc.edu.vn/UPLOADS/numbers/3/51_fulltext_9.1.%20Kientruc%20-%20Tran%20Dinh%20Hieu.pdf',
      photo:'https://huengaynay.vn/van-hoa-nghe-thuat/thong-tin-van-hoa/bao-ton-thap-phu-dien-truoc-thach-thuc-bien-doi-khi-hau-168952.html',
      description:'Dưới cồn cát Mỹ Khánh, cửa tháp mở về phía biển, lệch nam 20 độ so với hướng đông. Nhà kính che phần kiến trúc cao hơn 3 m còn lại. Qua lối cửa hẹp có thể thấy bệ thờ giữa lòng tháp.',
      modeledBuildings:['w1145070786'],boundary:[[-5,-6.6],[5,-6.6],[5,6.35],[-5,6.35]],gardenRadius:31,
      solids:[[0,0,2.53,2.68],[-1.04,3.39,.61,.87],[1.04,3.39,.61,.87],[-.72,12.33,.77,.77]],
      views:[view('Cửa tháp dưới mái che',5.20,9.3,phuYaw+.065,.055,offset(phuYaw,0,2.45),55),
        view('Lòng tháp và bệ thờ',2.2,4.0,phuYaw+2.74,1.00,[0,0],54),
        view('Nhà kính và bậc xuống hố khai quật',7.2,31.5,phuYaw+.54,.30,offset(phuYaw,-.7,1.9),58)]},
    (T,k)=>{finish(k);createTempleFoundations(T,k).building(0,0,0,32,34,()=>{
      excavation(T,k);phuChamber(T,k);phuShelter(T,k);
    });});

  function yangProng(T,k){
    finish(k);
    const baseStone=0x7e7968,earthBrick=0x8c6450;
    k.box(0xaaa28e,0,.055,1.15,7.55,.12,10.3);
    for(const [y,w,h,color] of [[.25,5.79,.35,baseStone],[.48,5.56,.15,umber],[.64,5.42,.15,worn],
      [.78,5.19,.15,earthBrick],[.92,5.08,.14,fired]]){
      hollowCourse(k,color,w,w,2.26,2.26,y,h,1.06);
    }
    hollowCourse(k,earthBrick,5,5,2.26,2.26,2.58,3.20,1.06);
    k.box(0x463b30,0,1.78,-1.09,2.18,2.45,.07);
    k.box(earthBrick,0,3.52,1.80,1.16,1.36,1.41);
    k.box(baseStone,0,2.76,2.32,1.67,.30,.72);
    for(let side=0;side<4;side++)k.place(0,0,side*Math.PI/2,()=>{
      for(const s of [-1,1]){
        k.box(brick,s*2.13,2.54,2.57,.61,3.31,.24);
        k.box(worn,s*2.13,1.00,2.62,.76,.34,.31);
        k.box(umber,s*2.13,4.11,2.63,.83,.25,.34);
      }
      if(side===0){
        // The entrance's ribbed, low triangular hood and the broken cheeks
        // of the forehall are visible in the museum's frontal photograph.
        for(const s of [-1,1]){
          k.box(earthBrick,s*.87,1.64,2.83,.65,1.92,.88);
          for(let j=0;j<4;j++)k.box(j%2?fired:umber,s*.88,2.39+j*.106,2.86,.72+j*.04,.11,.96);
          k.box(worn,s*1.08,.79,3.72,.60,1.04,.90);
          k.box(baseStone,s*1.08,1.36,3.72,.70,.16,.96);
          k.box(worn,s*1.31,1.13,4.30,.44,1.64,.48);
          k.box(umber,s*1.31,1.99,4.30,.57,.14,.61);
        }
        for(let j=0;j<9;j++){
          const w=3.24-j*.309;
          k.box(j%2===0?earthBrick:fired,0,2.90+j*.148,2.79,w,.151,1.06-j*.074);
        }
      }else{
        // A central stepped false portal sits between narrow rectangular
        // recesses. Their profiles are shallow and have no open arch.
        for(const s of [-1,1]){
          const x=s*1.25;
          for(const e of [-1,1])k.box(umber,x+e*.19,2.66,2.54,.088,2.49,.12);
          k.box(umber,x,3.92,2.54,.47,.095,.13);
          k.box(worn,x,1.40,2.55,.47,.10,.15);
        }
        for(let j=0;j<12;j++){
          const width=1.77-j*.092;
          k.box(j%3?earthBrick:umber,0,1.02+j*.194,2.57,width,.199,.70-j*.035);
        }
        k.box(worn,0,3.69,2.54,.54,.60,.13);
      }
    });
    for(const [y,w,h] of [[4.24,5.26,.14],[4.42,5.47,.19],[4.59,5.32,.15],[4.77,5.67,.24]]){
      k.box(y<4.5?earthBrick:umber,0,y,0,w,h,w);
    }
    // One continuous, square corbelled roof, broad at the eaves. Brick
    // weathering and shaded vegetation form broken lines across the courses.
    const moss=[0x837052,0x817154,0x907a5b];
    for(let i=0;i<23;i++){
      const p=i/22,w=5.55-4.75*(.61*p+.39*p*p),y=4.99+i*.184;
      k.box(i%6===1?worn:earthBrick,0,y,0,w,.214,w);
      // Nguyễn Thị Hòa's field photograph (Di sản văn hóa, no. 3/2016,
      // p. 2 of the linked PDF) shows successive hooked birds climbing the
      // sloping corner, one on the end of each projecting horizontal band.
      if(i%2===0&&i<=18){
        const span=w+.11,base=y+.087;
        k.box(umber,0,base,0,span,.078,span);
        for(const x of [-1,1])for(const z of [-1,1]){
          k.place(x*(span/2-.025),z*(span/2-.025),Math.atan2(x,z),()=>{
            k.outline([[-.12,0],[-.10,.12],[.02,.15],[.11,.21],[.15,.32],[.20,.39],[.26,.42],
              [.32,.415],[.37,.38],[.39,.31],[.37,.275],[.345,.31],[.30,.32],[.27,.29],
              [.265,.22],[.29,.14],[.27,.09],[.21,.046],[.17,.025],[.02,.015]],
              0xa8795e,0,base+.024,0,.112,-Math.PI/2);
          });
        }
      }
      if(i%2===1)for(let side=0;side<4;side++)k.place(0,0,side*Math.PI/2,()=>{
        for(let j=0;j<10;j++){
          const n=(j*17+side*13+i*7+i*j)%23;
          if(n>11)continue;
          const rw=w*(.031+.003*(n%4)),h=.030+(n%4)*.009;
          k.outline([[-rw,0],[-rw*.6,h*.7],[-rw*.25,h*.45],[0,h],[rw*.63,h*.78],[rw,0],[rw*.54,-h*.23],[0,-h*.12]],
            moss[n%3],w*(j-4.5)/10,y+.032,w/2+.005,.010);
        }
      });
    }
    k.tapered(baseStone,0,9.25,0,.38,.26,.24,1,8);
    k.tapered(baseStone,0,9.46,0,.26,.065,.24,1,8);
    // Low paving and stone-faced stairs continue the central eastern approach.
    for(let j=0;j<4;j++)k.box(worn,0,.12*(4-j),4.01+.33*j,1.78,.24*(4-j),.35);
    for(const s of [-1,1]){
      k.box(worn,s*1.69,.33,4.34,1.09,.58,1.85);
      k.box(baseStone,s*1.69,.65,4.34,1.15,.13,1.94);
    }
    // The forest edge frames the small clearing in the museum's wide view.
    CentralArch.trees(T,k,[{x:-8.8,z:-7.3,h:14.0,width:8.3},{x:8.4,z:-5.9,h:13.5,width:8.0},
      {x:3.6,z:-12,h:16,width:8.1},{x:-11.6,z:2.2,h:12.9,width:7.0},{x:12.5,z:4.4,h:14.7,width:8.3}]);
  }
  const yangYaw=1.59;
  register('thap-yang-prong','11784634070','Tháp Yang Prong','Đắk Lắk','Ea Súp',107.830768,13.209903,
    [107.83238,13.20845],yangYaw,6.1,8.0,{region:'Tây Nguyên',
      source:'https://dsvh.gov.vn/Upload/files/5613_Thap%20Yang%20Prong.pdf',
      photo:'https://daklakmuseum.vn/tin-tuc-su-kien/bai-viet/thap-yang-prong',
      description:'Dưới tán rừng Ea Rốk, thân tháp vuông cạnh 5 m chỉ mở một cửa về hướng đông. Những hàng gạch thu dần thành một khối mái. Dọc các góc mái, đầu chim có mỏ quặp nhô ra ở từng dải diềm.',
      gardenRadius:6.1,solids:[[0,0,2.55,2.55],[-1.29,3.74,.70,.82],[1.29,3.74,.70,.82]],
      views:[view('Cửa phía đông dưới tán rừng',9.7,20.2,yangYaw+.34,.10),
        view('Đầu chim dọc góc mái',13.75,5.2,yangYaw+1.71,.07,offset(yangYaw,2.12,2.12),50),
        view('Cửa giả và các hàng gạch thu mái',8.6,14.9,yangYaw+1.91,.15)]},yangProng);
})();
