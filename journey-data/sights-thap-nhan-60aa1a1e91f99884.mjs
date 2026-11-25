const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='thap-nhan-tuy-hoa',catalogId='osm-node-4674771389';
  const pin=window.VietnamTourism.byId.get(catalogId);
  if(!pin)return;
  const yaw=Math.PI/2,source='https://dsvh.gov.vn/thap-nhan-3238',tour='https://daklakvrtour.com/tour/42/index.html';
  const red=0xb47452,brown=0x915740,deep=0x7b4d3d,old=0x9b755d,corbel=0xc2855e,crest=0xae8669,stone=0xb4aa88,shade=0x62483b,
    paving=0xaf7663,edge=0x866655,grass=0x738345;
  // Local +z is the eastern portal. Dimensions follow the national heritage
  // inventory. Tour 42 node9 shows the stairs and planters, node21 the roofs.
  // The old stone finish and surviving blind doors also appear in Commons 9984472.
  const views=[
    {name:'Tháp gạch nhìn từ sân phía đông',offset:[0,0],height:22,viewAngle:1.88,viewRadius:31,viewElevation:-.035,viewFov:56},
    {name:'Bậc lên và cửa đông',offset:[6.65,0],height:7.6,viewAngle:1.67,viewRadius:10.5,viewElevation:-.074,viewFov:61},
    {name:'Ba tầng mái nhìn từ phía đông bắc',offset:[0,0],height:39.4,viewAngle:.91,viewRadius:22,viewElevation:.21,viewFov:54},
    {name:'Từ ngưỡng cửa nhìn vào gian thờ',offset:[-1.0,0],height:6.9,viewAngle:Math.PI/2,viewRadius:6.0,viewElevation:.025,viewFov:56,
      photoCatalogId:'phu-yen-gian-tho-thap-nhan',description:'Qua cửa phía đông nhìn vào gian thờ Thiên Y A Na. Mão, khuôn mặt và phần áo phía trên dùng ảnh chụp tại gian thờ. Lư hương đặt trước tượng.'}
  ].map(v=>({...v,viewBase:'monument'}));
  const targetHeights=views.map(v=>v.height);
  function build(T,k){
    k.palette({brick:[red,brown,deep,old,corbel,crest,shade],stone:[stone,edge]});
    function block(tint,w,lo,hi,d=w,x=0,z=0){k.box(tint,x,(lo+hi)/2,z,w,hi-lo,d);}
    function taper(tint,w,top,lo,hi,x=0,z=0,ratio=1){k.tapered(tint,x,(lo+hi)/2,z,w/Math.SQRT2,top/Math.SQRT2,hi-lo,ratio,4);}
    // At the entrance a passage cuts through the plinth and the eastern
    // wall. The heritage survey records a 4.6 m clear chamber.
    function openLayer(tint,w,lo,hi,doorway){
      const t=(w-4.6)/2,side=(w+4.6)/4,toSide=(4.6-doorway)/2;
      block(tint,t,lo,hi,w,-side);block(tint,t,lo,hi,w,side);
      block(tint,4.6,lo,hi,t,0,-side);
      if(toSide>0)for(const x of [-1,1])block(tint,toSide,lo,hi,t,x*(doorway+toSide)/2,side);
    }
    function relief(w,h,tint,x,y,z,depth){
      const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(-w/2,h*.47);
      s.quadraticCurveTo(-w*.45,h*.76,0,h);s.quadraticCurveTo(w*.45,h*.76,w/2,h*.47);s.lineTo(w/2,0);s.closePath();
      k.profile(s,tint,x,y,z,depth);
    }
    function spire(x,z,w,lo,h){
      block(old,w,lo,lo+h*.16,w,x,z);
      for(let i=0;i<3;i++){
        const b=lo+h*(.16+i*.23),r=w*(.91-i*.17);
        block(i%2?brown:crest,r,b,b+h*.11,r,x,z);
        taper(i%2?old:red,r*.94,r*.68,b+h*.11,b+h*.23,x,z);
      }
      taper(old,w*.32,w*.12,lo+h*.85,lo+h,x,z);
    }
    block(edge,38,-.52,.02);block(paving,38,.02,.12);
    // Two low planted borders frame the axial walk in the ground panorama.
    for(const side of [-1,1]){
      block(edge,2.15,.12,.35,5.8,side*4.1,10.8);
      block(grass,1.95,.35,.40,5.58,side*4.1,10.8);
      const leaves=new T.IcosahedronGeometry(1,1);
      for(let i=0;i<40;i++){
        const x=side*4.1+(k.random()-.5)*1.60,z=10.8+(k.random()-.5)*5.30;
        const r=.19+k.random()*.23;
        k.stamp(leaves,i%3?0x718436:0x566e32,x,.40+r*.32,z,r,r*.64,r,k.random()*3);
      }
      leaves.dispose();
    }
    for(const [w,lo,hi,c] of [[12.2,.12,.42,deep],[11.92,.42,.75,old],[11.52,.75,1.32,brown],
      [11.08,1.32,1.98,brown],[10.7,1.98,2.44,old],[10.55,2.44,2.64,red],[10.12,2.64,2.87,deep],
      [9.78,2.87,3.16,corbel],[9.42,3.16,3.39,red]])openLayer(c,w,lo,hi,1.92);
    openLayer(red,9,3.39,5.45,1.85);openLayer(red,9,5.45,11.23,0);
    // Five applied piers per face, with narrow stepped recesses between.
    for(let f=0;f<4;f++)k.place(0,0,f*Math.PI/2,()=>{
      for(const x of [-4.10,-2.04,0,2.04,4.10]){
        if(f===0&&x===0)continue;
        const w=Math.abs(x)>4?.82:.74;
        block(old,w+.26,3.2,3.66,.47,x,4.66);block(corbel,w+.14,3.66,3.94,.46,x,4.65);
        block(Math.abs(x)>4?corbel:red,w,3.94,10.38,.42,x,4.65);
        for(const dx of [-.25,.25])block(old,.115,4.04,10.35,.09,x+dx,4.89);
        block(corbel,w+.16,10.38,10.78,.48,x,4.65);block(old,w+.24,10.78,11.18,.56,x,4.66);
      }
      if(f!==0){
        block(brown,2.80,2.28,5.45,.77,0,4.84);
        relief(2.94,3.7,old,0,3.51,5.17,.20);relief(2.27,3.05,brown,0,3.56,5.37,.18);
        relief(1.52,2.45,deep,0,3.6,5.53,.12);
      }
    });
    for(const [w,lo,hi,c] of [[9.54,11.17,11.42,brown],[9.83,11.42,11.67,corbel],[10.02,11.67,11.88,old],
      [10.28,11.88,12.12,red],[10.54,12.12,12.4,corbel]])block(c,w,lo,hi);
    // The porch retains brick returns beside the door and a corbelled arch.
    // The dark passage continues behind the horizontal lintel at 2.4 m.
    for(const side of [-1,1]){
      block(old,.85,1.25,4.65,2.72,side*1.36,5.90);
      block(corbel,.30,1.28,4.76,2.52,side*1.69,5.80);
    }
    const arch=new T.Shape();arch.moveTo(-1.84,4.58);arch.lineTo(-.96,4.58);
    arch.quadraticCurveTo(-.91,5.82,0,6.94);arch.quadraticCurveTo(.91,5.82,.96,4.58);arch.lineTo(1.84,4.58);
    arch.lineTo(1.76,5.16);arch.quadraticCurveTo(1.52,6.85,0,8.36);arch.quadraticCurveTo(-1.52,6.85,-1.76,5.16);arch.closePath();
    k.profile(arch,brown,0,0,4.62,2.54);
    block(0x94755d,1.94,3.91,4.13,1.68,0,6.18);
    relief(1.90,2.95,0xbea786,0,3.94,6.26,.12);
    for(let i=0;i<7;i++)block(i%2?old:brown,2.91,.12,.32+i*.20,.46,0,9.12-i*.44);
    // Each of the three roofs repeats its blind shrines and corner towers.
    for(const [w,lo,h,corner] of [[7.68,12.4,4.16,4.47],[5.22,16.56,3.10,3.33],[3.48,19.66,2.43,2.22]]){
      block(brown,w,lo,lo+h*.14);block(red,w*.92,lo+h*.14,lo+h*.73);
      for(let f=0;f<4;f++)k.place(0,0,f*Math.PI/2,()=>{
        const z=w*.46;
        for(const x of [-w*.37,w*.37])block(corbel,w*.10,lo+h*.14,lo+h*.72,.36,x,z);
        relief(w*.35,h*.81,brown,0,lo+h*.12,z,.22);
        relief(w*.30,h*.74,corbel,0,lo+h*.15,z+.21,.18);relief(w*.21,h*.59,old,0,lo+h*.17,z+.38,.16);
        relief(w*.14,h*.43,brown,0,lo+h*.20,z+.53,.08);
        for(const x of [-w*.21,w*.21])taper(stone,w*.067,w*.038,lo+h*.20,lo+h*.46,x,z+.17);
      });
      for(const [portion,width] of [[.73,.96],[.80,1],[.87,1.03],[.94,1.06]])
        block(portion===.87?old:corbel,w*width,lo+h*portion,lo+h*Math.min(1,portion+.07));
      for(const x of [-1,1])for(const z of [-1,1])spire(x*corner,z*corner,w*.225,lo,w*.42);
    }
    block(crest,1.36,22.09,22.23);
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4;
      k.stamp(k.round,stone,.54*Math.sin(a),22.24,.54*Math.cos(a),.18,.22,.25,a);
    }
    taper(stone,.91,.18,22.23,23.63);
    // The photographed rectangular sanctuary is visible through the doorway.
    block(shade,4.55,.12,1.55,4.55);
    block(0x806c5a,1.91,.12,1.55,4.15,0,4.31);
    block(0x6a564c,4.56,1.55,6.45,.12,0,-2.25);
    block(stone,1.65,1.55,1.86,.92,0,-1.12);block(old,1.45,1.86,2.38,.79,0,-1.12);
    relief(1.34,1.66,0x504c46,0,2.30,-1.74,.20);
    // The incense burner hides the lower robe in Christophe95's sanctuary photograph.
    const bronze=0x8d764b,robe=0xca9b35;
    k.tapered(robe,0,2.43,-1.33,.255,.204,.26,.67,32);
    window.CentralArch.photoCarving(T,k,{photo:'sight-imagery/thap-nhan-thien-y-a-na.webp',
      width:600,height:800,crop:[200,102,200,248],origin:[301,290],position:[0,2.54,-1.33],scale:.0069,tint:robe,
      forms:[
        {z:-.025,rows:[[108,298,303,.01],[112,291,310,.025],[117,282,317,.057],[124,281,324,.072],
          [135,282,322,.08],[145,279,326,.091],[155,272,330,.10],[168,267,333,.11],[179,259,342,.125],
          [191,258,344,.13],[202,264,338,.13],[211,275,331,.12]]},
        {z:.012,rows:[[197,293,307,.078],[200,290,311,.089],[209,288,315,.097],[217,289,314,.097],
          [224,291,311,.087],[228,296,307,.070],[232,297,305,.053]]},
        {z:.001,rows:[[227,294,308,.075],[233,282,318,.12],[242,272,325,.14],[259,267,330,.16],
          [275,263,332,.162],[285,261,334,.16],[290,261,334,.16]]}
      ]});
    const oval=new T.SphereGeometry(1,12,8);
    k.stamp(oval,bronze,0,2.51,-.74,.19,.105,.14);
    k.tapered(bronze,0,2.55,-.74,.15,.13,.25,1,18);
    for(const side of [-1,1]){
      const x=side*.50;
      k.stamp(oval,0xaeb6a5,x,2.49,-.79,.093,.15,.085);
      for(let i=0;i<4;i++){
        const z=-.82+(i%2)*.09,px=x+side*(i-1.5)*.038,h=2.83+.046*(i%3);
        k.box(0x68783c,px,(2.56+h)/2,z,.013,h-2.56,.012);
        k.stamp(oval,i%2?0xd4bd6c:0xc4ac53,px,h,z,.039,.026,.032);
      }
    }
    oval.dispose();
    window.CentralArch.trees(T,k,[{x:-18.3,z:13,h:8.3},{x:-19,z:-1,h:7.4},{x:-13,z:-18.3,h:7.9},
      {x:16.5,z:-18.6,h:7.0},{x:18.8,z:-8.6,h:8.3},{x:19.4,z:16.7,h:7.2}]);
    const perimeter=[],indices=[];
    for(let side=0;side<4;side++)for(let i=0;i<19;i++){
      const along=-19+2*i;
      const [x,z]=[[-19,along],[along,19],[19,-along],[-along,-19]][side];
      const outer=1.095;
      perimeter.push(x,0,z,x*outer,0,z*outer);
      const a=(side*19+i)*2,b=(a+2)%(4*19*2);
      indices.push(a,a+1,b,b,a+1,b+1);
    }
    const bank=new T.BufferGeometry(),positions=new T.Float32BufferAttribute(perimeter,3);
    bank.setAttribute('position',positions);bank.setIndex(indices);
    const bankMesh=new T.Mesh(bank,new T.MeshLambertMaterial({color:0x766952,side:T.DoubleSide}));
    bankMesh.receiveShadow=true;k.group.add(bankMesh);
    let offsets;
    k.group.userData.fitGround=ground=>{
      let level=0;
      for(let x=-18;x<=18;x+=6)for(let z=-18;z<=18;z+=6)level=Math.max(level,ground(x,z));
      if(!offsets){
        offsets=k.group.children.map(child=>child.position.y);
        const surface=k.group.children.find(child=>child.geometry?.hasAttribute('finishKind'));
        if(surface)weatheredBrick(surface.material);
      }
      k.group.children.forEach((child,i)=>{child.position.y=offsets[i]+level;});
      for(let i=0;i<positions.count;i+=2){
        positions.setY(i,.017);
        positions.setY(i+1,ground(positions.getX(i+1),positions.getZ(i+1))-level-.08);
      }
      positions.needsUpdate=true;bank.computeVertexNormals();bank.computeBoundingSphere();
      views.forEach((v,i)=>{v.height=targetHeights[i]+level/.46;});
    };
  }
  function weatheredBrick(material){
    const scanned=material.onBeforeCompile,key=material.customProgramCacheKey();
    material.onBeforeCompile=function(shader,renderer){
      scanned.call(this,shader,renderer);
      const varying='varying vec3 nhanPoint; varying vec3 nhanNormal;\n';
      shader.vertexShader=varying+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\n nhanPoint=position; nhanNormal=normal;');
      shader.fragmentShader=varying+`
        float nhanHash(vec2 p){vec3 q=fract(p.xyx*.1193);q+=dot(q,q.yzx+37.4);return fract((q.x+q.y)*q.z);}
        float nhanNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
          return mix(mix(nhanHash(i),nhanHash(i+vec2(1,0)),f.x),mix(nhanHash(i+vec2(0,1)),nhanHash(i+1.),f.x),f.y);}
      `+shader.fragmentShader.replace('#include <metalnessmap_fragment>',`#include <metalnessmap_fragment>
        if(nhanPoint.y>.105&&nhanPoint.y<.135&&nhanNormal.y>.95){
          vec2 p=nhanPoint.xz/.4,cell=floor(p),d=min(fract(p),1.-fract(p)),fw=max(fwidth(p),vec2(.0001));
          vec2 line=(1.-smoothstep(vec2(.004),vec2(.016)+fw*.35,d))*(1.-smoothstep(vec2(.20),vec2(.9),fw));
          diffuseColor.rgb*=.93+.11*nhanHash(cell)-.27*max(line.x,line.y);
        }else if(surfaceKind>6.5&&surfaceKind<7.5){
          vec2 uv=nhanNormal.y>.7?nhanPoint.xz:vec2(abs(nhanNormal.x)>abs(nhanNormal.z)?nhanPoint.z:nhanPoint.x,nhanPoint.y);
          float row=uv.y/.08;vec2 units=vec2(uv.x/.40+.5*mod(floor(row),2.),row);
          vec2 d=min(fract(units),1.-fract(units)),fw=max(fwidth(units),vec2(.0001));
          float joint=(1.-smoothstep(.01,.05+fw.y*.28,d.y))*(1.-smoothstep(.18,1.,fw.y));
          float broad=.62*nhanNoise(uv*.80)+.25*nhanNoise(uv*3.2)+.13*nhanNoise(uv*11.);
          float damp=smoothstep(.43,.74,broad)*(.33+.18*(1.-smoothstep(1.5,4.4,nhanPoint.y)));
          diffuseColor.rgb*=vec3(1.-damp*.92,1.-damp*.86,1.-damp*.72)*(.90+.20*nhanHash(floor(units))-.28*joint);
        }`);
    };
    material.customProgramCacheKey=()=>key+'-nhan-masonry';material.needsUpdate=true;
  }
  (window.VietnamSights??=[]).push({...pin,id,catalogId,name:'Tháp Nhạn Tuy Hòa',lon:109.3015984,lat:13.0823143,start:[109.2999132,13.0828095],
    city:'Tuy Hòa',locality:'Núi Nhạn',formerProvince:'Phú Yên',kind:'Tháp Chăm',yaw,width:38,depth:38,structureHeight:23.5,
    mappedEntrance:true,visitOnArrival:true,viewDistance:1400,solids:[[0,0,5.9,5.9]],boundary:[[-6.1,-6.1],[6.1,-6.1],[6.1,8.1],[-6.1,8.1]],
    reserve:(x,z,r)=>Math.abs(x)<19+r&&Math.abs(z)<19+r,source,photo:tour,map:'https://www.openstreetmap.org/node/4674771389',
    description:'Tháp gạch Chăm đứng giữa sân vuông trên núi Nhạn. Một lối bậc lên cửa phía đông, ba mặt còn lại có cửa giả. Năm trụ ốp chạy dọc mỗi mặt thân tháp. Trên ba tầng mái là chóp đá bốn mặt.',
    arrivalNote:'Xe dừng dưới chân núi ở lối vào từ đường Lê Trung Kiên. Từ đây có lối bộ và đường xe điện lên khu tháp.',views,build});
})();

export default window.VietnamSights;
