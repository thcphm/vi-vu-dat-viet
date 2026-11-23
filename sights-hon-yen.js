'use strict';
(()=>{
  const id='hon-yen-phu-yen',catalogId='osm-way-151569083',lon=109.30878,lat=13.22564;
  const source='https://daklak.gov.vn/-/di-tich-quoc-gia',tour='https://daklakvrtour.com/tour/62/index.html';
  // OSM w151569083 includes the tidal ledges west of the stack. W151569085 is
  // the separate islet between it and the mainland, labelled Hòn Sụn in Fig. 4
  // of Khang et al., Tạp chí Khoa học & Công nghệ Đại học Duy Tân 4(53), 2022.
  // https://duytan.edu.vn/upload/file/4(53).-Nghiên-cứu-khả-năng-ứng-dụng-công-nghệ-UAV-trong-thành-lập-bản-đồ-hiện-trạng-nuôi-trồng-thủy-sản-(Nguyễn-Hoàng-Thái-Khang)-53.pdf
  // https://www.openstreetmap.org/way/151569085
  // https://phuyen.baodaklak.vn/377/197502/hon-yen-ngay-cang-hut-du-khach.html
  // https://www.google.com/maps/@13.22568,109.30868,245m/data=!3m1!1e3
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=109.30868,13.22568&level=18
  // Local metres, X east and Z south. Left and right trace the visible rock
  // on the aerial, excluding surf; the inner ridge and intermediate heights
  // are fitted to the west, NE and SE photographs (tour nodes 4, 7 and 8).
  // Row format: south coordinate, west edge, east edge, spine, crest height.
  const sections=[
    [-113,12,15,14,1.6],[-109,-9,21,9,3.3],[-98,-17,21,7,5.2],[-85,-22,16,5,7.8],
    [-70,-32,12,2,13],[-54,-38,10,-1,32],[-47,-40,11,-1,42],[-41,-42,12,0,48],
    [-37,-46,23,0,51],[-31,-52,33,1,55],[-19,-57,43,2,62],[-5,-53,51,3,67.2],[9,-49,53,3,69.2],
    [16,-48,55,5,70],[28,-43,54,5,68.5],[41,-37,53,5,63],[52,-19,49,7,54],
    [61,-17,44,9,44],[69,-4,36,12,26],[74,7,27,17,10],[76,15,20,17,1.6]
  ];
  const small=[[-228,-140],[-238,-140],[-247,-127],[-245,-112.5],[-224,-94],[-198,-93],[-182.4,-115],[-203.5,-132.5]];
  const ledges=[
    [[-211,-43],[-197,-50],[-179,-55],[-169,-52],[-152,-49],[-138,-43],[-135,-34],[-141,-24],[-135,-15],[-158,-7],[-174,-11],[-185,-23],[-202,-28]],
    [[-133,-35],[-126,-31],[-118,-23],[-105,-21],[-93,-16],[-82,-7],[-84,2],[-92,6],[-99,11],[-112,7],[-126,-2],[-134,-10]],
    [[-85,-15],[-73,-11],[-66,-7],[-57,-2],[-48,5],[-49,14],[-59,18],[-69,15],[-76,11],[-85,2]],
    [[-109,14],[-102,15],[-96,20],[-101,23],[-108,20]],
    [[-82,15],[-75,16],[-73,20],[-81,21],[-86,19]]
  ];
  const clip=(v,lo=0,hi=1)=>Math.min(hi,Math.max(lo,v));
  const smooth=v=>{const t=clip(v);return t*t*(3-2*t);};
  const mix=(a,b,t)=>a+(b-a)*t;
  function rockSurface(T){
    // One tile contains weathering at two scales and distances to the
    // boundaries of irregular cells. In the cliff band its coordinates
    // turn to follow the inclined joints in the NE photograph.
    const n=256,data=new Uint8Array(n*n*4),hash=(x,y,salt)=>{
      let h=Math.imul(x+59,374761393)^Math.imul(y+19,668265263)^salt;
      h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;
    };
    function field(x,y,period,salt){
      const u=x*period,v=y*period,i=Math.floor(u),j=Math.floor(v),a=smooth(u-i),b=smooth(v-j);
      const h=(dx,dy)=>hash((i+dx)%period,(j+dy)%period,salt);
      return mix(mix(h(0,0),h(1,0),a),mix(h(0,1),h(1,1),a),b);
    }
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){
      const u=x/n,v=y/n,gx=u*12,gy=v*12,cx=Math.floor(gx),cy=Math.floor(gy);
      let d1=8,d2=8;
      for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){
        const a=(cx+i+12)%12,b=(cy+j+12)%12;
        const dx=cx+i+.13+.74*hash(a,b,14)-gx,dy=cy+j+.13+.74*hash(a,b,93)-gy,d=dx*dx+dy*dy;
        if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;
      }
      const k=4*(x+y*n);
      data[k]=255*(.59*field(u,v,4,1)+.27*field(u,v,13,17)+.14*field(u,v,47,13));
      data[k+1]=255*(.53*field(u,v,17,3)+.27*field(u,v,47,13)+.20*hash(x,y,11));
      data[k+2]=255*clip(2.1*(Math.sqrt(d2)-Math.sqrt(d1)));data[k+3]=255;
    }
    const noise=new T.DataTexture(data,n,n,T.RGBAFormat);noise.needsUpdate=true;
    noise.wrapS=noise.wrapT=T.RepeatWrapping;noise.generateMipmaps=true;
    noise.magFilter=T.LinearFilter;noise.minFilter=T.LinearMipmapLinearFilter;
    // Reuse the terrain's photographed rock texture. Only its small-scale
    // mineral pattern is used here; banding is oriented in island coordinates.
    const material=window.createSightStoneMaterial(T);
    material.vertexColors=false;material.side=T.DoubleSide;material.roughness=.99;
    material.customProgramCacheKey=()=>'hon-yen-basalt';
    material.addEventListener('dispose',()=>noise.dispose());
    material.onBeforeCompile=shader=>{
      shader.uniforms.yenNoise={value:noise};
      shader.vertexShader='attribute vec3 strata;varying vec3 yenStrata;varying vec3 yenPoint;\n'+
        shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nyenStrata=strata;yenPoint=position;');
      shader.fragmentShader='uniform sampler2D yenNoise;varying vec3 yenStrata;varying vec3 yenPoint;\n'+
        shader.fragmentShader.replace('#include <map_fragment>','').replace('#include <color_fragment>',`#include <color_fragment>
        vec3 p=yenPoint;
        float fan=yenStrata.y,ledge=yenStrata.z;
        vec2 uv=mix(vec2(p.z+.31*p.x,p.y-.19*p.x),p.xz,ledge);
        vec3 blot=texture2D(yenNoise,uv*.041+vec2(.41,.73)).rgb;
        vec3 grit=texture2D(yenNoise,uv*.16+vec2(.07,.53)).rgb;
        float tilt=mix(.05,-.40,fan)+.10*sin(p.z*.06+1.);
        vec2 joints=vec2(uv.x+tilt*p.y,uv.y);
        vec3 vein=texture2D(yenNoise,joints*mix(vec2(.105,.013),vec2(.065,.066),ledge)
          +vec2(.17,.38)+.028*(blot.rg-.5)).rgb;
        float wash=1.-smoothstep(.45,1.95,p.y+1.1*(blot.r-.5));
        float rust=smoothstep(.31,.67,blot.r*.57+vein.r*.43)*smoothstep(2.,13.,p.y);
        vec3 basalt=mix(vec3(.069,.061,.053),vec3(.312,.192,.114),rust);
        basalt=mix(basalt,vec3(.105,.103,.087),.87*ledge);
        basalt=mix(basalt,vec3(.17,.16,.131),wash*.68);
        vec3 scan=texture2D(map,uv*vec2(.243,.219)+vec2(.31,.07)).rgb;
        float mineral=clamp((dot(scan,vec3(.25,.56,.19))-.040)*9.0,-.28,.64);
        basalt*=.88+.46*(grit.g-.5)+.49*(vein.g-.5)+mineral;
        float cracks=mix(.66,.96,smoothstep(.005,.31,vein.b));
        float fault=abs(p.y-(14.-.46*(p.z+28.)+1.3*sin(.113*p.z)));
        float crown=26.-.31*(p.z+25.)+2.4*sin(.17*p.z);
        float band=fan*smoothstep(1.3,4.5,p.y)*(1.-smoothstep(crown,crown+4.4,p.y));
        float phase=(p.z+.40*p.x-.36*p.y+smoothstep(.15,1.2,fault)*.43)*.87
          +.68*sin(.34*p.z)+.13*sin(.71*p.z)+.12*sin(.38*p.y);
        float aa=fwidth(phase),gap=abs(fract(phase)-.5);
        float joint=(1.-smoothstep(.025,.095+aa*.32,gap))*(1.-smoothstep(.32,.70,aa));
        basalt*=1.-band*(.67*joint+.40*(1.-smoothstep(.18,.95,fault)));
        basalt*=1.+.26*band*cos(phase*6.283185);
        float leaves=(1.-ledge)*smoothstep(.36,.68,yenStrata.x+.64*(blot.r-.5)+1.07*(grit.g-.5)+.32*mineral);
        vec3 turf=mix(vec3(.049,.067,.019),vec3(.191,.200,.053),blot.r);
        diffuseColor.rgb*=mix(basalt*cracks,turf*(.72+.66*grit.g+.74*mineral),leaves);`);
    };
    return material;
  }
  function build(T,k){
    const positions=[],surface=[],indices=[];
    function vertex(x,y,z,green,fan,ledge){positions.push(x,y,z);surface.push(green,fan,ledge);}
    function runRows(rows,cols,make){
      const start=positions.length/3;
      for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++)make(j/rows,i/cols);
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
        const a=start+j*(cols+1)+i,b=a+cols+1;
        indices.push(a,b,a+1,b,b+1,a+1);
      }
    }
    let section=0;
    runRows(152,58,(along,across)=>{
      const z0=mix(-113,76,along);
      while(section<sections.length-2&&z0>sections[section+1][0])section++;
      const a=sections[section],b=sections[section+1],t=(z0-a[0])/(b[0]-a[0]);
      const at=i=>mix(a[i],b[i],t),side=across<.5?-1:1,u=Math.abs(2*across-1),span=at(side<0?1:2)-at(3);
      const z=z0+.47*Math.sin(at(3)*.2+across*8.7)*Math.sin(along*Math.PI);
      const height=at(4),fan=side>0?Math.exp(-Math.pow((z+36)/29,2))*smooth((u-.32)/.48):0;
      let y=-2.7+(height+2.7)*Math.pow(Math.max(0,1-Math.pow(u,1.65)),.75-.26*fan);
      const wet=smooth((y+1)/7),fray=Math.sin(z*.89+.085*y+.017*z*side)+.54*Math.sin(z*2.05+.17*y);
      // The NE band is a united fan of inclined columns, with the rock broken
      // back in the re-entrant. On the west face a dark recess opens low down.
      const ribs=.9*Math.sin((z-.28*y)*1.78)+.4*Math.sin((z-.37*y)*3.57);
      const edge=u*(.9*fray+fan*(ribs-2.8*Math.sin(u*Math.PI)));
      const recess=side<0?Math.exp(-Math.pow((z-2.5)/6.3,4))*smooth((y-3)/5)*(1-smooth((y-20)/8)):0;
      const x=at(3)+span*u+side*(edge-5.3*recess);
      y+=wet*(.36*Math.sin(x*1.12+z*.57)+.72*Math.sin(.29*z+.37*x))*smooth((height-2)/8);
      y-=4.6*Math.exp(-Math.pow((x-5.7)/2.4,2))*smooth((-z-91)/15);
      const cover=clip(.07+.58*smooth((y-14)/44)+.11*(1-u)+.14*Math.sin(.25*z+.1*x)
        +.12*Math.cos(z*.65-.22*x)-fan*.37+recess*.24);
      vertex(x,y,z,cover,fan,0);
    });
    // Ring contours are sorted round their own centre. The detached Hòn Đụn
    // rises towards its short east cliff. The west benches remain low and
    // have channels between them; the view from node 4 shows water in these.
    function outcrop(outline,stack,number){
      const cx=outline.reduce((s,p)=>s+p[0],0)/outline.length,cz=outline.reduce((s,p)=>s+p[1],0)/outline.length;
      const ordered=outline.map(([x,z])=>({x,z,a:Math.atan2(z-cz,x-cx)})).sort((a,b)=>a.a-b.a);
      const perSide=stack?8:4,around=ordered.length*perSide;
      const tipX=stack?-199.6:cx,tipZ=stack?-119.8:cz;
      runRows(stack?24:10,around,(r,s)=>{
        const pos=(s===1?0:s)*ordered.length,i=Math.floor(pos),t=pos-i,a=ordered[i],b=ordered[(i+1)%ordered.length];
        const rx=mix(a.x,b.x,t),rz=mix(a.z,b.z,t),theta=Math.atan2(rz-cz,rx-cx);
        const inner=stack?.055:.05,rad=mix(1,inner,r);
        let x=mix(tipX,rx,rad),z=mix(tipZ,rz,rad);
        const e=(rx-cx)/29,n=(rz-cz)/25;
        const teeth=(.75*Math.sin(18*theta+.46*number)+.46*Math.sin(31*theta))*rad;
        x+=Math.cos(theta)*teeth;z+=Math.sin(theta)*teeth;
        let y;
        if(stack){
          const sideRise=clip(.56+.40*e-.21*n,.12,1);
          const top=clip(13.4+(x+215)*.36-(z+121)*.12,4.1,19.3)+.5*Math.sin(z*.16+x*.11);
          const slope=clip((r-.12)/mix(.46,.21,sideRise));
          y=-1.8+3.1*smooth(r/.12)+(top-1.3)*Math.pow(slope,mix(.86,.33,sideRise));
          y+=.46*Math.sin(x*.74-z*.23)*rad;
        }else{
          y=-2.8+(number<3?6.05:4.35)*smooth(r/.24)-.6*r;
          y+=.50*Math.sin(x*.68-z*.47)+.48*Math.sin(x*.34+z*.52)+.21*Math.sin(z*1.7);
        }
        const cap=stack?smooth((y-10)/8)*(.56+.12*Math.cos(z*.37)+.1*Math.sin(x*.57)):.005;
        vertex(x,y,z,cap,0,stack?0:1);
      });
      const i=positions.length/3-around-1;
      for(let j=1;j<around;j++)indices.push(i,i+j+1,i+j);
    }
    outcrop(small,true,0);ledges.forEach((outline,i)=>outcrop(outline,false,i));
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    g.setAttribute('strata',new T.Float32BufferAttribute(surface,3));g.setIndex(indices);g.computeVertexNormals();
    const rock=new T.Mesh(g,rockSurface(T));rock.name='Hòn Yến, bãi đá triều và Hòn Đụn';
    rock.castShadow=rock.receiveShadow=true;k.group.add(rock);
    let fit=false;
    k.group.userData.fitGround=ground=>{rock.position.y=ground(100,0);fit=true;};
    rock.onBeforeRender=()=>{
      if(!fit)return;
      const origin=typeof roads!=='undefined'&&roads?.point?.(lon,lat);
      const sea=origin&&typeof gfx!=='undefined'&&gfx?.waterAt?.(origin.x+100,origin.z);
      if(Number.isFinite(sea?.level)){rock.position.y=sea.level-k.group.position.y;fit=false;}
    };
  }
  const mx=111320*Math.cos(lat*Math.PI/180);
  function view(name,longitude,latitude,eyeY,target,fov,description){
    const dx=(longitude-lon)*mx-target[0],dz=(lat-latitude)*111320-target[2],dy=eyeY-target[1];
    return {name,offset:[target[0],target[2]],height:target[1]/.46,viewBase:'monument',
      viewRadius:Math.hypot(dx,dy,dz),viewAngle:Math.atan2(dx,dz),
      viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,description};
  }
  const stop=window.VietnamTourism.byId.get(catalogId);
  (window.VietnamSights??=[]).push({...stop,id,catalogId,lon,lat,name:'Hòn Yến',kind:'Danh thắng',locality:'Nhơn Hội',
    yaw:0,width:316,depth:226,gardenRadius:0,solids:[],
    reserve:(x,z,p=0)=>(x>-60-p&&x<62+p&&z>-119-p&&z<82+p)||(x>-252-p&&x< -178+p&&z>-145-p&&z< -89+p),
    source,photo:'https://daklakvrtour.com/hon-yen.html',map:'https://www.openstreetmap.org/way/151569083',
    start:[109.3045388,13.2267462],mappedEntrance:true,visitOnArrival:true,
    arrivalNote:'Xe dừng ở cuối đường làng Nhơn Hội. Từ chỗ ngắm bên bờ, Hòn Đụn cách khoảng 200 m, còn Hòn Yến cách hơn 400 m về phía đông. Bãi đá giữa biển chỉ lộ từng phần theo thủy triều.',
    description:'Từ Nhơn Hội nhìn ra, Hòn Đụn nằm gần bờ, Hòn Yến cao khoảng 70 m ở xa hơn. Dáng hai đảo và các bãi đá thấp dựa trên đường bờ bản đồ, ảnh vệ tinh và ảnh 360°. Bề mặt các vách, thảm cây bụi và mực triều trong cảnh được mô phỏng.',
    views:[
      view('Hai hòn đảo từ bờ Nhơn Hội',109.305045,13.226458,5,[-72,23,-65],33,
        'Từ lối đi ven Mũi Yến nhìn về phía đông. Hòn Đụn thấp hơn ở bên trái, Hòn Yến ở xa bên phải.'),
      view('Từ bãi đá triều nhìn vách tây',109.307490,13.225758,10.6,[0,28,-10],55,
        'Góc đặt theo ảnh 360° trên bãi đá phía tây. Qua những rãnh nước là vách cao có một khe tối, với từng vạt cây bám trên đá.'),
      view('Vách đá dạng cột phía đông bắc',109.309524,13.226448,47.5,[4,28,-21],62,
        'Góc trên không theo ảnh khảo sát phía đông bắc. Một dải cột đá nghiêng chạy vào hõm vách, ngay trên mép sóng.'),
      {...view('Hòn Đụn từ bãi đá ngoài khơi',109.307490,13.225758,10.6,[-213,9.1,-117],43,
        'Nhìn ngược về phía tây bắc từ bãi đá, Hòn Đụn có sườn thoải quay vào đất liền và một mép đá dốc hướng biển. Trong bản đồ khảo sát UAV, đảo mang tên Hòn Sụn.'),title:'Hòn Đụn (Hòn Sụn)'}
    ],scan:tour+'#node4',build});
})();
