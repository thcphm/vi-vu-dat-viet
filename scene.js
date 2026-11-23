/* Metres, with the player's direction of travel along negative Z. */
(() => {
  const T = THREE;
  const canvas = document.getElementById('road');
  const scene = new T.Scene();
  const impactFX = window.createImpactEffects(scene, canvas);
  scene.fog = new T.FogExp2(0xf1cfac, 0.0061);
  const renderer = DrivingRenderer.get(canvas);
  const camera = new T.PerspectiveCamera(48, 1, 0.12, 600);
  scene.add(new T.HemisphereLight(0xe2ecff, 0x958779, 1.56));
  const sun = new T.DirectionalLight(0xffce8a, 2.55);
  sun.position.set(-38, 30, -144);
  sun.target.position.set(0, 0, -95);
  scene.add(sun.target);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate=false;
  renderer.shadowMap.needsUpdate=true;
  sun.castShadow=true;
  const graphics=createDrivingGraphics(renderer,camera,sun);
  Object.assign(sun.shadow.camera,{left:-132,right:132,top:103,bottom:-103,near:.5,far:225});
  sun.shadow.normalBias=.065;
  sun.shadow.bias=-.00024;
  scene.add(sun);
  let seed = 473;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  function texture(w,h,paint) {
    const c=document.createElement('canvas'); c.width=w; c.height=h;
    paint(c.getContext('2d'),w,h);
    const tex=new T.CanvasTexture(c);
    if ('colorSpace' in tex) tex.colorSpace=T.SRGBColorSpace;
    else tex.encoding=T.sRGBEncoding;
    tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    return tex;
  }
  const basic = (map) => new T.MeshBasicMaterial({map});
  const cache=new Map();
  function material(color) {
    if (!cache.has(color)) cache.set(color,new T.MeshLambertMaterial({color}));
    return cache.get(color);
  }
  const box=new T.BoxGeometry(), leaf=new T.IcosahedronGeometry(1,1);
  const staticParts=new Map();
  const routeSets={city:new T.Group(),school:new T.Group(),works:new T.Group()};
  Object.values(routeSets).forEach(group=>scene.add(group));
  let sceneryParent=scene;
  const signalGroup=new T.Group(), speedGroup=new T.Group(), parkingGroup=new T.Group();
  scene.add(signalGroup,speedGroup,parkingGroup);
  function part(geo,mat,x,y,z,w,h,d,ry=0,rz=0,parent=null) {
    mat=typeof mat==='object'?mat:material(mat);
    const mesh=new T.Mesh(geo,mat);
    mesh.position.set(x,y,z); mesh.scale.set(w,h,d); mesh.rotation.set(0,ry,rz); mesh.updateMatrix();
    if(parent) parent.add(mesh);
    else {
      const key=sceneryParent.uuid+geo.uuid+mat.uuid;
      if(!staticParts.has(key)) staticParts.set(key,{geo,mat,matrices:[],host:sceneryParent});
      staticParts.get(key).matrices.push(mesh.matrix);
    }
    return mesh;
  }
  const block=(...args)=>part(box,...args);
  const skyMaterial=new T.ShaderMaterial({
    side:T.BackSide,depthWrite:false, uniforms:{pano:{value:null},hasPano:{value:0}},
    vertexShader:'varying vec3 dir; varying vec2 coord; void main(){dir=position;coord=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec3 dir; varying vec2 coord; uniform sampler2D pano; uniform float hasPano;
      void main(){
        vec3 n=normalize(dir);float y=max(n.y,0.);
        vec3 sky=mix(vec3(.98,.78,.57),vec3(.32,.55,.73),smoothstep(0.,.64,y));
        vec3 photo=texture2D(pano,vec2(fract(coord.x+.085),coord.y)).rgb;
        float luma=dot(photo,vec3(.299,.587,.114));
        vec3 clouds=mix(vec3(.31,.44,.56),vec3(1.,.87,.70),smoothstep(.16,.91,luma));
        sky=mix(sky,clouds,hasPano*smoothstep(.01,.56,y)*.85);
        float beam=max(0.,dot(n,normalize(vec3(-.34,.23,-1.))));
        sky+=vec3(.46,.26,.11)*pow(beam,48.);
        sky=mix(sky,vec3(1.,.96,.81),smoothstep(.99980,.99991,beam));
        gl_FragColor=vec4(sky,1.);
      }`
  });
  const sky=new T.Mesh(new T.SphereGeometry(500,32,20),skyMaterial);scene.add(sky);
  const loader=new T.TextureLoader();
  loader.load('streetscape/sky.jpg',map=>{
    skyMaterial.uniforms.pano.value=map;
    skyMaterial.uniforms.hasPano.value=1;
    const reflections=map.clone();
    reflections.mapping=T.EquirectangularReflectionMapping;
    reflections.colorSpace=T.SRGBColorSpace;
    reflections.needsUpdate=true;
    scene.environment=reflections;
  });
  const asphalt=texture(256,256,(ctx,w,h)=>{
    ctx.fillStyle='#585952';ctx.fillRect(0,0,w,h);
    for(let i=0;i<19000;i++){ctx.fillStyle=random()>.5?'rgba(255,245,221,.1)':'rgba(0,0,0,.15)';ctx.fillRect(random()*w,random()*h,1+random()*2,1);}
  });
  asphalt.wrapS=asphalt.wrapT=T.RepeatWrapping; asphalt.repeat.set(3,75);
  const roadMaterial=new T.MeshLambertMaterial({map:asphalt});
  loader.load('streetscape/asphalt.jpg',map=>{
    map.colorSpace=T.SRGBColorSpace;
    map.wrapS=map.wrapT=T.RepeatWrapping;
    map.repeat.set(4,105);
    map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    roadMaterial.map=map;
    roadMaterial.color.setHex(0xb8b9c1);
    roadMaterial.needsUpdate=true;
  });
  block(roadMaterial,0,-.12,-120,16,.22,420);
  block(0xaaa28e,0,-.29,-110,200,.2,420);
  function roadMarkings(crossing){
    block(roadMaterial,0,-.055,-crossing-10.5,125,.05,13.5);
    for(let z=20;z>-300;z-=6){
      if(z<-crossing+1&&z>-crossing-23)continue;
      block(0xe9ae37,0,.012,z,.12,.02,3.4);
      for(const side of [-1,1])block(0xece8dc,side*4,.012,z,.11,.02,2.4);
    }
    for(const z of [-crossing-3,-crossing-20]){
      for(let x=-7.6;x<8;x+=1.05)block(0xf6f0df,x,.026,z,.51,.023,3);
    }
    block(0xf4ead9,4,.03,-crossing,7.9,.025,.30);
  }
  sceneryParent=routeSets.city;
  roadMarkings(90);
  const shopNames=['CÀ PHÊ PHỐ','BÁNH MÌ','HOA TƯƠI','NHÀ SÁCH','PHỞ HÀ NỘI','TRÀ VIỆT','TẠP HÓA','TIỆM ẢNH'];
  const paints=['#e4c190','#cbd8c5','#e2b9a1','#e7dbbe','#c9cbbb','#e3cc9d','#b4c6bf','#ecd4b5'];
  const boards=['#12594f','#ae4c35','#3d6862','#394e63','#9a342d','#39614a','#ab7031','#374653'];
  function facade(i,floors) {
    return new T.MeshLambertMaterial({map:texture(512,768,(c,w,h)=>{
      c.fillStyle=paints[i];c.fillRect(0,0,w,h);
      const fh=540/floors;
      for(let f=0;f<floors;f++){
        let top=f*fh;
        for(let j=0;j<3;j++){
          let x=25+j*159;
          c.fillStyle='#eee3c9';c.fillRect(x-5,top+12,143,fh*.71);
          const gl=c.createLinearGradient(x,top,x+80,top+fh);gl.addColorStop(0,'#bacbc3');gl.addColorStop(.4,'#749193');gl.addColorStop(1,'#394e52');
          c.fillStyle=gl;c.fillRect(x,top+16,133,fh*.64);
          c.fillStyle='#d9ceb7';c.fillRect(x+61,top+15,5,fh*.65);
          for(let k=0;k<7;k++){c.fillStyle='#566265';c.fillRect(x+k*21,top+fh*.69,3,fh*.2);}
          c.fillRect(x,top+fh*.69,133,4);
        }
        c.fillStyle='#a69d88';c.fillRect(0,top+fh-11,w,5);
        c.fillStyle='#eee2c7';c.fillRect(0,top+fh-6,w,6);
      }
      c.fillStyle=boards[i];c.fillRect(0,544,w,72);
      c.fillStyle='#fff6d9';c.font='bold 49px Arial';c.textAlign='center';c.fillText(shopNames[i],256,598,482);
      c.fillStyle='#344746';c.fillRect(12,625,488,143);
      // Layer a reflected street, shelving and merchandise behind the shop glass.
      for(let j=0;j<6;j++){
        const x=22+j*82;
        const window=c.createLinearGradient(0,628,0,762);
        window.addColorStop(0,'#72898a');window.addColorStop(.24,'#465b5a');window.addColorStop(.53,'#3d4036');window.addColorStop(1,'#7b7565');
        c.fillStyle=window;c.fillRect(x,633,73,124);
        for(let row=0;row<3;row++){
          for(let k=0;k<9;k++){
            c.fillStyle=['#ab9060','#c0b39a','#787b60','#a26443','#6d8182'][Math.floor(random()*5)];
            let hh=4+random()*13;c.fillRect(x+3+k*7.5,677+row*25-hh,4+random()*2,hh);
          }
          c.fillStyle='#514938';c.fillRect(x,677+row*25,73,3);
        }
        c.fillStyle='rgba(209,225,225,.13)';c.beginPath();c.moveTo(x,633);c.lineTo(x+39,633);c.lineTo(x+12,757);c.lineTo(x,757);c.fill();
        c.fillStyle='#283637';c.fillRect(x+36,633,2,124);
      }
      c.fillStyle='#cdc4a6';c.font='bold 11px Arial';c.fillText(['CÀ PHÊ RANG XAY','BÁNH MÌ NÓNG','HOA TƯƠI MỖI NGÀY','SÁCH VÀ VĂN PHÒNG PHẨM','PHỞ BÒ GIA TRUYỀN','TRÀ VÀ CÀ PHÊ','HÀNG TIÊU DÙNG','IN ẢNH KỸ THUẬT SỐ'][i],256,612,475);
    })});
  }
  const facades=shopNames.map((_,i)=>facade(i,2+i%3));
  const panel=new T.PlaneGeometry();
  const streetTrees=createTreeModels(T);
  function tree(x,z){
    const h=6.3+random()*1.8,w=h*(.85+random()*.15);
    const geo=streetTrees.geometry('tree',false,streetTrees.variantAt(x,z));
    part(geo,streetTrees.material,x,.30,z,w,h,w,random()*Math.PI*2);
    block(0x99927f,x,.24,z,1.45,.2,1.5);
  }
  const shadeCloth=boards.map(color=>new T.MeshLambertMaterial({map:texture(128,64,c=>{
    c.fillStyle='#e8d7b5';c.fillRect(0,0,128,64);
    c.fillStyle=color;for(let x=0;x<128;x+=32)c.fillRect(x,0,16,64);
  })}));
  const roof=new T.ConeGeometry(1,1,8);
  const gardenPot=new T.CylinderGeometry(.38,.26,.6,10);
  function flowerPot(x,y,z){
    part(gardenPot,0xb26a4e,x,y+.3,z,1,1,1);
    for(let j=0;j<4;j++){
      const angle=j*Math.PI/2;
      part(leaf,0x538153,x+Math.cos(angle)*.16,y+.71,z+Math.sin(angle)*.16,.25,.35,.19,angle,.25);
    }
  }
  const marketSign=basic(texture(768,160,c=>{
    c.fillStyle='#773c2e';c.fillRect(0,0,768,160);
    c.strokeStyle='#d1ad73';c.lineWidth=5;c.strokeRect(9,9,750,142);
    c.font='bold 70px "Times New Roman", "Noto Serif", serif';c.fillStyle='#fff1c8';c.textAlign='center';c.fillText('CHỢ TRẦN PHÚ',384,107);
  }));
  function market(x,z,side){
    const facing=-side*Math.PI/2;
    block(0xd9b485,x+side*3,2.5,z,6.2,5,8.7);
    for(const offset of [-3.5,0,3.5]){
      block(0x985a40,x-side*.4,2.25,z+offset,.42,4.5,.45);
      for(let k=0;k<2;k++)block(0xe0cba0,x-side*.4,.7+k*3.3,z+offset,.50,.16,.54);
    }
    block(0xb35f41,x+side*2.1,4.7,z,7,.34,9);
    part(panel,marketSign,x-side*1.42,4.2,z,8,1.35,1,facing);
    for(const dz of [-2.1,1.9]){
      const stand=x-side*1.15;
      block(0x765039,stand,.65,z+dz,1,.83,2.4);
      part(roof,0xc78243,stand,2.48,z+dz,1.6,.55,1.6);
      block(0x785d48,stand,1.76,z+dz,.07,1.5,.07);
      for(let i=0;i<15;i++)part(leaf,i%2?0xdb9b37:0x85a058,stand+(i%3-1)*.27,1.14,z+dz+(Math.floor(i/3)-2)*.39,.18,.16,.18);
    }
  }
  const towerFacade=new T.MeshLambertMaterial({map:texture(256,512,c=>{
    c.fillStyle='#a49580';c.fillRect(0,0,256,512);
    for(let row=0;row<16;row++)for(let col=0;col<8;col++){
      c.fillStyle=['#657a82','#92a0a0','#b3baba','#778a90','#9aa8a6'][Math.floor(random()*5)];
      c.fillRect(col*32+2,row*32+4,28,23);
    }
  })});
  for(const side of [-1,1]){
    for(let z=26;z>-265;z-=9){
      if(z<-89&&z>-115)continue;
      let i=Math.floor(random()*8), height=7+i%3*1.5+random()*3, x=side*(12.2+random()*.65);
      block(0xc3b59e,side*9.9,.065,z,3.85,.22,9);
      const lot=(26-z)/9;
      if(lot%12===5 && side===1){market(x,z,side);continue;}
      if(lot%10===6 && side===-1){
        block(0x829c66,x+side*3,.04,z,7,.11,8.8);
        tree(x+side*2,z-1.9);tree(x+side*4,z+2.3);
        block(0x9a7152,x,.61,z,1,.16,3);
        for(const dz of [-1.1,1.1])block(0x5c6560,x,.35,z+dz,.72,.55,.14);
        continue;
      }
      block(paints[i],x+side*3.2,height/2,z,6.6,height,8.87);
      part(panel,facades[i],x-side*.125,height/2,z,8.85,height,1,-side*Math.PI/2);
      block(0xf2e3c7,x+side*2.95,height,z,7,.28,9.1);
      block(boards[i],x-side*.48,height*.28,z,.95,.15,8.8);
      if(lot%3===0){
        block(shadeCloth[i],x-side*.86,2.77,z,1.65,.10,7.2,0,side*.15);
        block(shadeCloth[i],x-side*1.67,2.51,z,.08,.33,7.2);
      }
      if(lot%4===2){
        flowerPot(x-side*.85,.18,z+3.2);
        flowerPot(x-side*.85,.18,z-3.2);
      }
      for(let f=1;f<=2;f++){
        const y=height*(.29+f*.22);
        block(0xc6bba4,x-side*.39,y,z,.79,.15,7.6);
        for(let rail=0;rail<3;rail++)block(0x565e60,x-side*.76,y+.16+rail*.18,z,.038,.035,7.48);
        for(let rail=-3.5;rail<4;rail+=1.17)block(0x565e60,x-side*.76,y+.28,z+rail,.045,.58,.045);
      }
      if(i===0 || i===4 || i===5){
        for(const dz of [-2.3,2.3]){
          const tx=x-side*1.05;
          block(0x564d40,tx,.68,z+dz,.85,.075,.68);
          block(0x625c54,tx,.39,z+dz,.09,.58,.09);
          for(const offset of [-.56,.56]){
            block(boards[i],tx,.39,z+dz+offset,.37,.085,.35);
            for(const sx of [-.14,.14])block(0x514d44,tx+sx,.23,z+dz+offset,.045,.31,.25);
          }
        }
      }
      if(i%2===0) {
        block(0xc7c5b1,x-side*.29,height*.62,z+3,.52,.56,.82);
        block(0xd8d7c6,x+side*2,height+.65,z+1.7,1.5,1.4,1.5);
      }
      if(Math.round((26-z)/9)%2===0)tree(side*9.35,z+2.2);
      if(i%3===0){
        block(0x646f6a,side*8.6,3.5,z,.105,7,.1);
        block(0x6e7872,side*7.65,6.98,z,2.02,.105,.12);
        block(0xe7e0c3,side*6.75,6.88,z,.62,.12,.33);
      }
    }
    for(let j=0;j<36;j++){
      const h=13+random()*24;
      block(towerFacade,side*(27+random()*19),h/2,-j*8,h*.42,h,7+random()*5);
    }
  }
  // Cloth flags and utility cables frame the boulevard at eye level.
  const flagMaterial=basic(texture(128,82,(c,w,h)=>{
    c.fillStyle='#bd3028';c.fillRect(0,0,w,h);c.fillStyle='#f6d055';c.beginPath();
    for(let i=0;i<10;i++){
      const angle=i*Math.PI/5-Math.PI/2,r=i%2?9:23;
      const x=64+Math.cos(angle)*r,y=41+Math.sin(angle)*r;
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.closePath();c.fill();
  }));
  flagMaterial.side=T.DoubleSide;
  for(const side of [-1,1]){
    for(let z=8;z>-218;z-=30){
      if(z<-89&&z>-115)continue;
      block(0x8c7b61,side*10.75,4.25,z,.08,1.58,.08,0,-side*.48);
      part(panel,flagMaterial,side*10.38,4.31,z,1.25,.79,1,side*.64,-side*.13);
    }
    for(let z=8;z>-230;z-=24){
      for(let j=0;j<3;j++){
        const points=[];
        for(let k=0;k<=8;k++)points.push(new T.Vector3(side*(10.8+j*.15),7.4-.49*Math.sin(Math.PI*k/8),z-3*k));
        const wire=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0x605c50}));
        sceneryParent.add(wire);
      }
    }
  }
  const signMat=basic(texture(512,160,(c,w,h)=>{
    c.fillStyle='#28745a';c.fillRect(0,0,w,h);c.strokeStyle='#fffae7';c.lineWidth=5;c.strokeRect(8,8,w-16,h-16);
    c.fillStyle='#fff';c.textAlign='center';c.font='bold 49px Arial';c.fillText('↑  TRUNG TÂM',256,73);
    c.font='31px Arial';c.fillText('Trần Phú   →',256,124);
  }));
  block(0x71766f,8.25,3.7,-36,.15,7.4,.15);
  block(0x71766f,6.6,7.1,-36,3.4,.15,.18);
  part(panel,signMat,5.4,6.45,-35.9,4.8,1.5,1);
  sceneryParent=signalGroup;
  block(0x56625e,8,3.5,-92,.2,7,.19);
  block(0x56625e,5.1,6.85,-92,6,.15,.18);
  block(0x242e30,3,5.97,-92,.61,1.8,.4);
  const bulbs=[];
  for(let i=0;i<3;i++){
    const mat=new T.MeshBasicMaterial({color:0x302e28});
    bulbs.push(mat);
    part(leaf,mat,3,6.51-i*.53,-91.76,.20,.20,.09);
  }
  const speedFace=limit=>texture(256,256,c=>{
    c.fillStyle='#bf281e';c.beginPath();c.arc(128,128,124,0,Math.PI*2);c.fill();
    c.fillStyle='#f8f5e9';c.beginPath();c.arc(128,128,100,0,Math.PI*2);c.fill();
    c.fillStyle='#242424';c.font='bold 120px Arial';c.textAlign='center';c.fillText(String(limit),127,169);
  });
  const speed40=speedFace(40),speed30=speedFace(30);
  const speedMaterial=new T.MeshBasicMaterial({map:speed40,alphaTest:.5});
  sceneryParent=speedGroup;
  block(0xb5b7af,7.95,1.78,-25,.09,3.56,.09);
  part(panel,speedMaterial,7.95,3.32,-24.92,1.02,1.02,1);
  // Mark the curbside bay as it appears in the final parking exercise.
  const parkingSign=basic(texture(200,236,c=>{
    c.fillStyle='#f3eee6';c.fillRect(0,0,200,236);
    c.fillStyle='#1d5994';c.fillRect(6,6,188,224);
    c.fillStyle='white';c.textAlign='center';c.font='bold 196px Arial';c.fillText('P',100,188);
  }));
  sceneryParent=parkingGroup;
  block(0xafb7b7,8.18,1.62,-162,.085,3.24,.085);
  part(panel,parkingSign,8.18,3.18,-161.92,.72,.86,1);
  for(let z=-161;z>-186;z-=3)block(0xe9e6d7,5.68,.032,z,.10,.018,1.6);
  for(const z of [-160,-186])block(0xe9e6d7,6.79,.032,z,2.34,.018,.11);
  const worksObstacles=[];
  function caption(title,color,ink,subtitle=''){
    return basic(texture(768,192,(c,w,h)=>{
      c.fillStyle=color;c.fillRect(0,0,w,h);
      c.strokeStyle=ink;c.lineWidth=3;c.strokeRect(7,7,w-14,h-14);
      c.fillStyle=ink;c.textAlign='center';
      c.font='bold 70px Arial';c.fillText(title,w/2,subtitle?96:123,w-35);
      if(subtitle){c.font='bold 30px Arial';c.fillText(subtitle,w/2,152,w-35);}
    }));
  }
  function lamp(x,z){
    const direction=-Math.sign(x);
    block(0x707c79,x,3.7,z,.13,7.4,.14);
    block(0x81928b,x+direction*.88,7.37,z,1.85,.09,.13);
    block(0xe6e7d5,x+direction*1.7,7.29,z,.66,.12,.42);
  }
  function sidewalks(crossing){
    for(const side of [-1,1]){
      for(let d=-18;d<296;d+=5){
        if(d>crossing+1&&d<crossing+21)continue;
        block(0xbab6a4,side*9.75,.05,-d,3.5,.24,4.99);
      }
      for(let d=-8;d<295;d+=30)if(Math.abs(d-crossing-10)>11)lamp(side*8.7,-d);
    }
  }
  function schoolRoute(){
    sceneryParent=routeSets.school;roadMarkings(60);sidewalks(60);
    const stucco=0xefc881,trim=0xf6e7c9,tile=0xa04f36,gate=0x36645e;
    block(0x89a45d,10,-.16,-100,130,.17,370);
    block(0xd4ae83,27,.035,-27,32,.14,69);
    // Open-air galleries and clay tile roofs overlook the school courtyard.
    for(const [x,z,length] of [[34,-24,52],[29,-88,24]]){
      block(stucco,x,4,z,9,8,length);
      block(tile,x,8.22,z,10.1,.45,length+.85);
      block(trim,x-4.9,4.1,z,2.9,.28,length+.4);
      for(let d=-length/2+1.5;d<length/2;d+=3.1){
        for(const y of [1.85,5.8]){
          block(0x3b625d,x-4.52,y,z+d,.07,2.55,1.95);
          block(trim,x-4.56,y,z+d,.08,2.55,.08);
          block(trim,x-5.9,y,z+d,.28,3.9,.28);
        }
      }
      block(stucco,x-5.85,4.78,z,.17,1.15,length);
    }
    for(let d=-9;d<60;d+=3){
      if(d>17&&d<36)continue;
      block(0xe6c78d,11.8,.62,-d,.43,1.22,3);
      block(trim,11.8,1.6,-d,.55,3.2,.47);
      for(let n=0;n<6;n++)block(gate,11.8,1.75,-d+n*.5,.09,1.18,.055);
      block(gate,11.8,2.25,-d,.08,.09,3);
    }
    for(const d of [17,36]){
      block(stucco,12,2.55,-d,1.25,5.1,1.15);
      block(tile,12,5.1,-d,1.65,.28,1.55);
      block(trim,12,.55,-d,1.4,1.05,1.32);
    }
    block(stucco,12,4.74,-26.5,1,1.06,19.6);
    block(tile,12,5.35,-26.5,1.4,.24,20.4);
    part(panel,caption('TRƯỜNG TIỂU HỌC HOA SEN','#91442e','#ffe9bd'),11.46,4.72,-26.5,18,.95,1,-Math.PI/2);
    const entrance=caption('CỔNG TRƯỜNG','#205751','#fff5cf','GIẢM TỐC ĐỘ');
    block(0x6c7871,8.85,1.7,-6,.11,3.4,.12);
    part(panel,entrance,8.85,2.8,-5.93,2.9,.85,1);
    block(0x96988b,20,5,-25,.1,10,.1);
    part(panel,flagMaterial,20.8,9.1,-25,1.6,1.02,1);
    for(let d=-10;d<245;d+=10){
      if(Math.abs(d-72)<12)continue;
      tree(-10.4,-d);
      if(d<16||d>35)tree(15.3,-d);
      if(d%30===0)flowerPot(12,.2,-d-2);
    }
    for(let d=-10;d<230;d+=19){
      if(Math.abs(d-72)<15)continue;
      const k=Math.abs(Math.floor(d/19))%8,h=5.4+k*.35;
      block(paints[k],-18,h*.5,-d,9,h,10.5);
      part(panel,facades[k],-13.47,h*.5,-d,10.5,h,1,Math.PI/2);
      block(tile,-18,h,-d,10,.38,11.5);
      if(d>103){block(stucco,19,h*.5,-d,11,h,12);part(panel,facades[(k+3)%8],13.47,h*.5,-d,12,h,1,-Math.PI/2);}
    }
  }
  const cone=new T.ConeGeometry(.24,.78,20);
  const band=new T.CylinderGeometry(.091,.145,.16,20);
  const drum=new T.CylinderGeometry(.68,.68,1.25,28);
  const wheelGeo=new T.CylinderGeometry(.58,.58,.30,28);
  const barPattern=basic(texture(512,96,c=>{
    c.fillStyle='#e8e5da';c.fillRect(0,0,512,96);
    c.fillStyle='#cb532f';for(let x=-75;x<575;x+=96){c.beginPath();c.moveTo(x,96);c.lineTo(x+47,96);c.lineTo(x+95,0);c.lineTo(x+48,0);c.fill();}
  }));
  function barrier(id,x,d,w,l){
    block(0xb2aca0,x,.18,-d,w+.2,.36,l+.14);
    block(0xdbd5c3,x,.58,-d,w,.67,l);
    part(panel,barPattern,x,.61,-d+l*.5+.012,w,.32,1);
    if(l>1)part(panel,barPattern,x-w*.5-.012,.61,-d,l,.32,1,-Math.PI/2);
    worksObstacles.push({id,type:'barrier',x,distance:d,halfWidth:(w+.2)/2,halfLength:(l+.14)/2,velocity:0});
  }
  function roadworks(){
    sceneryParent=routeSets.works;roadMarkings(125);sidewalks(125);
    block(0xb9ab8b,22,-.175,-98,110,.18,360);
    const steel=0x656f6a,yellow=0xe4aa3d;
    const depot=caption('BẾN VẬT LIỆU','#345261','#f7ebbd');
    for(let d=-9;d<255;d+=26){
      if(Math.abs(d-136)<17)continue;
      block(0x9da4a0,-19,2.7,-d,13,5.4,20);
      block(0x637676,-19,5.46,-d,14.2,.32,21.1);
      for(let n=0;n<24;n++)block(0x818d87,-12.47,2.6,-d+n*.76-9,.08,4.8,.11);
      block(0x4c5450,-12.39,1.68,-d,.11,3.3,3.3);
      if(d<60)part(panel,depot,-12.36,4,-d,5,.98,1,Math.PI/2);
      if(d>103)tree(11.6,-d);
    }
    for(const [x,d,width] of [[22,44,13],[33,75,16],[25,95,12]]){
      for(let y=0;y<16;y+=3.5){
        block(0xa29c90,x,y+.18,-d,width,.33,15);
        for(const dx of [-width/2+1,0,width/2-1])for(const dz of [-6,0,6])block(0xb5a99b,x+dx,y+1.86,-d+dz,.55,3.44,.55);
      }
      for(let dz=-7;dz<=7;dz+=2.2)block(steel,x-width*.5,7.8,-d+dz,.12,16,.12);
      for(let y=1;y<17;y+=2.1)block(steel,x-width*.5,y,-d,.14,.12,15);
    }
    // A lattice crane silhouetted above the unfinished slabs.
    for(const dx of [-.9,.9])for(const dz of [-.9,.9])block(yellow,23+dx,13,-56+dz,.2,26,.2);
    for(let y=1;y<26;y+=2.2){
      block(yellow,23,y,-56.9,2,.15,.14);
      block(yellow,23,y,-55.1,2,.15,.14);
      block(yellow,23,y,-56.9,.11,2.8,.11,0,.68);
    }
    block(yellow,23,26,-58,1.85,.32,35);
    block(yellow,23,27.25,-58,.3,.22,35);
    for(let d=41;d<76;d+=2)block(yellow,23,26.6,-d,.16,1.1,.16);
    block(0x62645e,23,26.8,-42,2.6,2.1,4);
    block(steel,23,20,-72,.05,12,.05);
    // Trench, roller, barrels and the physical limits of the work enclosure.
    block(0x5d4935,6.94,.023,-73,2.1,.032,46);
    for(let d=45;d<=100;d+=5){
      const x=d<55?6.6-(d-45)*.10:5.6;
      block(0x312e2a,x,.07,-d,.57,.12,.57);part(cone,0xfa7130,x,.5,-d,1,1,1);part(band,0xfff5d5,x,.51,-d,1,1,1);
      worksObstacles.push({id:'cone-'+d,type:'barrier',x,distance:d,halfWidth:.28,halfLength:.28,velocity:0});
    }
    barrier('works-entry',6.85,42,1.75,.56);
    for(let d=57;d<=95;d+=6)barrier('works-wall-'+d,5.9,d,.42,4.9);
    const machine=new T.Group();sceneryParent.add(machine);
    machine.position.set(7.03,0,-72);machine.rotation.y=.04;
    block(yellow,0,1.0,0,1.36,.86,3.6,0,0,machine);
    block(0x293537,0,1.68,.24,1.18,.73,1.8,0,0,machine);
    block(0x476068,0,2.2,.36,1.12,.61,1.28,0,0,machine);
    block(yellow,0,2.59,.37,1.35,.14,1.53,0,0,machine);
    const roller=new T.Mesh(drum,material(0x4e5755));roller.rotation.z=Math.PI/2;roller.position.set(0,.68,-1.25);machine.add(roller);
    for(const dx of [-.58,.58]){const wheel=new T.Mesh(wheelGeo,material(0x323a38));wheel.rotation.z=Math.PI/2;wheel.position.set(dx,.58,1.08);machine.add(wheel);}
    worksObstacles.push({id:'roller',type:'barrier',x:7.03,distance:72,halfWidth:.75,halfLength:1.95,velocity:0});
    for(let d=17;d<106;d+=4){
      block(0x8f9c90,10.3,1.12,-d,.16,2.2,3.95);
      for(let k=0;k<8;k++)block(0x77877c,10.19,1.13,-d+k*.48-1.75,.06,2.2,.07);
    }
    const worksSign=caption('CÔNG TRƯỜNG','#cd702b','#171d1c','LÀN PHẢI ĐANG THI CÔNG');
    block(steel,8.65,1.7,-12,.12,3.4,.12);
    part(panel,worksSign,8.65,2.85,-11.92,3.5,.99,1);
    const clearSign=caption('HẾT CÔNG TRƯỜNG','#2b5b50','#fff4d9');
    block(steel,8.55,1.85,-225,.12,3.7,.12);
    part(panel,clearSign,8.55,3.13,-224.92,3.6,.92,1);
  }
  schoolRoute();roadworks();sceneryParent=scene;
  let selectedCourse='city';
  window.courseObstacles=()=>selectedCourse==='works'?worksObstacles:[];
  window.setDriveCourse=course=>{
    selectedCourse=course.id;
    for(const [id,group] of Object.entries(routeSets))group.visible=id===selectedCourse;
    signalGroup.position.z=90-course.crossing;
    speedGroup.position.z=25-course.sign;
    speedMaterial.map=course.limit===30?speed30:speed40;
    parkingGroup.position.z=180-course.finish;
    parkingGroup.visible=selectedCourse!=='works';
    sun.color.setHex(selectedCourse==='school'?0xffedc9:selectedCourse==='works'?0xffdda9:0xffce8a);
    scene.fog.color.setHex(selectedCourse==='school'?0xe1e5c9:selectedCourse==='works'?0xe4cfb8:0xf1cfac);
    renderer.shadowMap.needsUpdate=true;
  };
  window.setDriveCourse({id:'city',crossing:90,finish:180,limit:40,sign:25});
  function hull(group,mat,rings) {
    const vertices=[],indices=[];
    const sides=8;
    for(const [z,y,w,top,wt] of rings){
      const chamfer=Math.min((top-y)*.2,.07);
      vertices.push(-w*.93,y,z,w*.93,y,z,w,y+chamfer,z,wt+.025,top-chamfer,z,wt*.94,top,z,-wt*.94,top,z,-wt-.025,top-chamfer,z,-w,y+chamfer,z);
    }
    for(let i=0;i<rings.length-1;i++)for(let j=0;j<sides;j++){
      const a=i*sides+j,b=i*sides+(j+1)%sides;indices.push(a,b,b+sides,a,b+sides,a+sides);
    }
    const end=(rings.length-1)*sides;
    for(let j=1;j<sides-1;j++)indices.push(0,j+1,j,end,end+j,end+j+1);
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();
    group.add(new T.Mesh(geo,mat));
  }
  const tire=new T.CylinderGeometry(1,1,1,16); tire.rotateZ(Math.PI/2);
  const shadowTex=texture(64,64,c=>{
    const g=c.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(21,24,23,.8)');g.addColorStop(.56,'rgba(21,24,23,.55)');g.addColorStop(1,'rgba(21,24,23,0)');c.fillStyle=g;c.fillRect(0,0,64,64);
  });
  const glazing=new T.MeshStandardMaterial({color:0x344854,metalness:.78,roughness:.17,side:T.DoubleSide,envMapIntensity:1.1});
  const litLens=new T.MeshBasicMaterial({color:0xff7c5c});
  const hubMetal=new T.MeshStandardMaterial({color:0xacb3b6,metalness:.72,roughness:.22});
  const plate=basic(texture(256,74,c=>{
    c.fillStyle='#f5ebd6';c.fillRect(0,0,256,74);
    c.strokeStyle='#3a413e';c.lineWidth=5;c.strokeRect(3,3,250,68);
    c.fillStyle='#283733';c.font='bold 47px Arial';c.textAlign='center';c.fillText('TẬP LÁI',128,53);
  }));
  function car(color,hero=false){
    const group=new T.Group();
    const shadow=new T.Mesh(panel,new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));
    shadow.rotation.x=-Math.PI/2;shadow.scale.set(3.2,5.8,1);shadow.position.y=.052;group.add(shadow);
    const paint=new T.MeshPhysicalMaterial({color,metalness:.56,roughness:.29,clearcoat:.85,clearcoatRoughness:.19,side:T.DoubleSide});
    hull(group,paint,[[-2.13,.37,.73,.70,.72],[-1.91,.34,.88,.82,.81],[-1.47,.34,.94,.88,.86],[-.93,.34,.96,.96,.86],[.84,.34,.96,.98,.89],[1.37,.34,.93,.95,.88],[1.91,.39,.88,.88,.84],[2.04,.43,.80,.84,.78]]);
    hull(group,glazing,[[-1.19,.88,.84,.93,.8],[-.60,.93,.84,1.48,.66],[.48,.94,.85,1.49,.66],[.76,.94,.85,1.39,.68],[1.34,.94,.81,1,.76]]);
    block(color,0,1.48,-.025,1.33,.09,1.17,0,0,group);
    for(const s of [-1,1]){
      block(0x252f32,s*.81,1.18,-.03,.06,.46,.105,0,0,group);
      block(color,s*.99,1.02,-.61,.24,.13,.21,0,0,group);
      block(0xdc3531,s*.613,.76,2.052,.43,.138,.06,0,0,group);
      block(0xffecbd,s*.60,.68,-2.13,.38,.12,.055,0,0,group);
      if(hero){
        block(litLens,s*.58,.806,2.071,.51,.037,.035,0,0,group);
        for(const z of [-.31,.68])block(hubMetal,s*.936,.88,z,.035,.035,.16,0,0,group);
        block(0x293038,s*.947,.39,0,.06,.08,1.87,0,0,group);
      }
      for(const z of [-1.32,1.34]){
        part(tire,0x222728,s*.9,.36,z,.18,.33,.33,0,0,group);
        part(tire,hero?0x42494b:0x9ba6a3,s*.997,.36,z,.022,.21,.21,0,0,group);
        if(hero){
          for(let spoke=0;spoke<6;spoke++){
            const angle=spoke*Math.PI/3;
            const bar=block(hubMetal,s*1.011,.36+Math.cos(angle)*.095,z+Math.sin(angle)*.095,.03,.18,.041,0,0,group);
            bar.rotation.x=angle;
          }
          part(tire,hubMetal,s*1.018,.36,z,.027,.072,.072,0,0,group);
        }
      }
    }
    block(0x27343a,0,.49,2.04,1.51,.12,.11,0,0,group);
    block(0xfff1cb,0,.68,2.064,.49,.14,.035,0,0,group);
    if(hero){
      part(panel,plate,0,.665,2.083,.49,.145,1,0,0,group);
      block(0x202a30,0,.48,-2.13,1.14,.15,.036,0,0,group);
      for(let i=0;i<3;i++)block(hubMetal,0,.435+i*.044,-2.159,.99,.009,.015,0,0,group);
      for(const sx of [-1,1])part(tire,0x444a4d,sx*.59,.411,2.05,.145,.055,.075,0,0,group);
    }
    scene.add(group);return group;
  }
  const player=car(0xd8a652,true);
  const cabinRig=new T.Group();scene.add(cabinRig);
  const driverCabin=window.buildDriverCabin(T,cabinRig,document.getElementById('map'));
  window.refreshDriveMap=driverCabin.refreshMap;
  // The compact fallback is immediately available while the full vehicle loads.
  async function loadPlayerSedan(){
    const response=await fetch('streetscape/sedan.json.gz');
    if(!response.ok)return;
    const bytes=new Uint8Array(await response.arrayBuffer());
    const packed=bytes[0]===0x1f&&bytes[1]===0x8b;
    const content=packed
      ? await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json()
      : JSON.parse(new TextDecoder().decode(bytes));
    const model=new T.ObjectLoader().parse(content);
    const bounds=new T.Box3().setFromObject(model);
    const scale=4.18/(bounds.max.z-bounds.min.z);
    model.scale.setScalar(scale);
    model.rotation.y=Math.PI;
    model.position.y=-bounds.min.y*scale;
    part(panel,plate,0,.625,-2.445,.496,.101,1,Math.PI,0,model);
    const heaterWire=[];
    for(let row=1;row<=8;row++){
      const t=row/10,y=1.375-t*.23,z=-.98-t*.65,edge=.51+t*.05;
      for(let col=-4;col<4;col++){
        for(const n of [col,col+1]){
          const x=n*edge/4;
          heaterWire.push(x,y-.012*x*x,z+.16*x*x);
        }
      }
    }
    const heaterGlass=new T.BufferGeometry();
    heaterGlass.setAttribute('position',new T.Float32BufferAttribute(heaterWire,3));
    model.add(new T.LineSegments(heaterGlass,new T.LineBasicMaterial({color:0x413b32,transparent:true,opacity:.42,depthWrite:false})));
    const groundShadow=player.children[0];
    player.clear();
    player.add(groundShadow,model);
  }
  loadPlayerSedan().catch(()=>{ /* Keep the lightweight car on older browsers or offline file URLs. */ });
  const traffic=window.createStreetTraffic(scene,shadowTex);
  for(const {geo,mat,matrices,host} of staticParts.values()){
    const mesh=new T.InstancedMesh(geo,mat,matrices.length);
    matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));
    mesh.receiveShadow=true;
    mesh.castShadow=mat!==roadMaterial && mat!==flagMaterial && matrices[0].elements[5]>.03;
    host.add(mesh);
  }


  let cockpit=true;
  let previewOverridden=false;
  window.toggleDriveCamera=()=>{
    cockpit=!cockpit;
    previewOverridden=true;
    return cockpit;
  };
  const targetProjection=new T.Vector3();
  window.projectDriveTarget=(x,y,metres)=>{
    targetProjection.set(x,y,-metres).project(camera);
    const {x:ndcX,y:ndcY,z:depth}=targetProjection;
    return {x:(ndcX+1)*.5,y:(1-ndcY)*.5,visible:depth>=-1&&depth<=1&&Math.abs(ndcX)<=1&&Math.abs(ndcY)<=1};
  };
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const offset=new T.Vector3(),aim=new T.Vector3();
  const desiredOffset=new T.Vector3(),desiredAim=new T.Vector3();
  let previousFrame=0, cabinAmount=0, previousView='', vehicleYaw=0;
  function positionCamera(distance,lateral,time,steering,mode,speed){
    const view=mode==='ready'&&!previewOverridden?'reveal':cockpit?'inside':'follow';
    const now=performance.now();
    const dt=Math.min(.12,(now-previousFrame)/1000);
    const ease=reducedMotion.matches||previousView===''?1:1-Math.exp(-dt*4.8);
    previousFrame=now;previousView=view;
    const heading=steering*Math.min(speed*.14,2.9)/Math.max(.01,speed/3.6);
    vehicleYaw=T.MathUtils.lerp(vehicleYaw,-Math.atan(heading)*Math.min(1,speed/6),ease);
    player.rotation.y=vehicleYaw;
    cabinRig.position.copy(player.position);
    cabinRig.rotation.y=vehicleYaw;
    let fov;
    if(view==='reveal'){
      const arc=reducedMotion.matches?0:Math.sin(time*.13);
      desiredOffset.set(-3.38+arc*.65,1.51+arc*.13,7.33+arc*.57);
      desiredAim.set(.58,.88,1.67);
      fov=47;
    }else if(view==='inside'){
      const sway=reducedMotion.matches?0:Math.min(speed/40,1)*.008*Math.sin(distance*1.25);
      const inset=driverCabin.seatInset(camera.aspect),seatX=-.31+inset*.72;
      desiredOffset.set(seatX,1.095+sway,2.71+inset*2.35);
      desiredAim.set(seatX,-.40,-12);
      const c=Math.cos(vehicleYaw),sn=Math.sin(vehicleYaw);
      for(const local of [desiredAim,desiredOffset]){
        const x=local.x,z=local.z-2.13;
        local.x=x*c+z*sn;local.z=-x*sn+z*c+2.13;
      }
      fov=camera.aspect<1?72:67;
    }else{
      desiredOffset.set(.55,3.25,9);
      desiredAim.set(-.35,1.72,-8);
      fov=48;
    }
    offset.lerp(desiredOffset,ease);aim.lerp(desiredAim,ease);
    camera.position.set(lateral+offset.x,offset.y,offset.z-distance);
    camera.lookAt(lateral+aim.x,aim.y,aim.z-distance);
    if(view==='inside'&&!reducedMotion.matches)camera.rotateZ(vehicleYaw*.035);
    const nextFov=T.MathUtils.lerp(camera.fov,fov,ease);
    if(Math.abs(nextFov-camera.fov)>.002){
      camera.fov=nextFov;camera.updateProjectionMatrix();
    }
    const nearCabin=offset.distanceToSquared(desiredOffset)<.55;
    const entering=view==='inside'&&nearCabin;
    player.visible=offset.z>4.85||Math.abs(offset.x)>1.6;
    cabinAmount=T.MathUtils.lerp(cabinAmount,entering?1:0,ease);

    return cabinAmount>.012;
  }
  window.renderDrive=function(distance=0,lateral=2,time=0,green=false,steering=0,speed=0,mode='driving',now=performance.now()){
    if(!canvas.clientWidth||!canvas.clientHeight)return;
    graphics.frame(now,mode==='driving');
    player.position.set(lateral,0,-distance+2.13);
    const showCabin=positionCamera(distance,lateral,time,steering,mode,speed);
    camera.updateMatrixWorld();
    traffic.update(distance,time,green,lateral,speed);
    impactFX.update(camera);
    sky.position.copy(camera.position);
    bulbs[0].color.setHex(green?0x4d3533:0xff3823);bulbs[2].color.setHex(green?0x41ff82:0x29443b);
    renderer.autoClear=true;
    if(driverCabin){
      driverCabin.update(showCabin,speed,steering,distance,courses.find(c=>c.id===selectedCourse)||courses[0]);
      if(mode==='ready')driverCabin.prepare(renderer,scene,camera);
      if(showCabin)driverCabin.reflect(renderer,scene,cabinRig,distance,lateral,graphics.profile.mirrorMs);
    }
    renderer.render(scene,camera);
  };
  window.renderDrive(0,2,0,false,0,0,'ready');
})();

