'use strict';
(() => {
  // Gate openings and elevations from the 2022 excavations. Local X runs along
  // the wall. Its ends are projected from the corners of OSM way 242169982.
  const source = 'https://thanhnhaho.vn/NewsDetail.aspx?Id=12784';
  const stone = [0x898b7f,0xa4a397,0x928f84,0x979e90,0x7f857a,0xa3a698];
  const gates = [
    {key:'nam',name:'Nam',way:641694093,lon:105.6066352,lat:20.0745846,yaw:.53825,start:[105.6068784,20.0741993],
      width:34.85,depth:15.2,top:7.65,openings:[[-10.65,5.4,5.4],[0,5.85,5.9],[10.65,5.4,5.4]],
      ends:[-430.8,432.1],cornerZ:-5.6,wallHeight:3.7,
      description:'Đường Hoàng Gia đi qua cổng chính ba vòm. Vòm giữa rộng 5,85 m. Trên đỉnh cổng còn nền đá từng đỡ lầu gỗ.'},
    {key:'bac',name:'Bắc',way:641694095,lon:105.6023486,lat:20.0813629,yaw:-2.59889,start:[105.6018405,20.0821312],
      width:21.4,depth:13.8,top:8.05,openings:[[0,5.85,5.9]],ends:[-434.2,440.4],cornerZ:1.1,wallHeight:6.9,
      description:'Từ ngoài thành nhìn vào, các hàng đá ở cổng Bắc nhỏ và sít hàng hơn ở mặt Nam. Dấu chân cột trên nóc cho biết ở đây từng có một kiến trúc gỗ.'},
    {key:'dong',name:'Đông',way:641694094,lon:105.608082,lat:20.0799767,yaw:2.10612,start:[105.6085203,20.0802086],
      width:21.4,depth:13.4,top:6.9,openings:[[0,5.8,5.9]],ends:[-430.3,442.4],cornerZ:-3.1,wallHeight:4.35,
      description:'Các khối đá hình nêm ôm lấy một lối qua thành sâu 13,4 m. Hai bên cổng còn những hàng đá lớn, phía trong là đất đắp gia cố.'},
    {key:'tay',name:'Tây',way:641694096,lon:105.6009041,lat:20.0759262,yaw:-1.02212,start:[105.6004479,20.0756687],
      width:21.5,depth:13.4,top:7,openings:[[0,5.8,5.9]],ends:[-439.4,429.4],cornerZ:-3,wallHeight:3.55,
      description:'Cổng Tây mở một vòm đá qua lũy thấp. Phần đá lát trên nóc đã mất, để lộ dáng cuốn và hai vai cổng nối tiếp mặt tường.'}
  ];

  function archway(T,kit,gate) {
    const {box,outline,profile,palette}=kit, half=gate.width/2, depth=gate.depth;
    const paved=gate.key==='bac'||gate.key==='nam',northern=gate.key==='bac';
    palette({stone});
    gate.openings.forEach(([cx,span,rise],i)=>{
      const r=span/2,spring=rise-r;
      const left=i?(cx+gate.openings[i-1][0])/2:-half;
      const right=i+1<gate.openings.length?(cx+gate.openings[i+1][0])/2:half;
      const shoulder=paved?gate.top-.12:gate.wallHeight+.25;
      const silhouette=new T.Shape();
      silhouette.moveTo(left,-.55);silhouette.lineTo(cx-r,-.55);silhouette.lineTo(cx-r,spring);
      silhouette.absarc(cx,spring,r,Math.PI,0,true);silhouette.lineTo(cx+r,-.55);
      silhouette.lineTo(right,-.55);silhouette.lineTo(right,shoulder);
      silhouette.lineTo(cx+r+.85,paved?gate.top:rise-.7);silhouette.lineTo(cx,gate.top);
      silhouette.lineTo(cx-r-.85,paved?gate.top:rise-.7);silhouette.lineTo(left,shoulder);silhouette.closePath();
      profile(silhouette,stone[4],0,0,-depth/2,depth);
      // Wedges continue through the barrel. Small open joints delineate the
      // successive rings when the camera looks up from the threshold.
      const rings=Math.round(depth/1.8),steps=15;
      for(let ring=0;ring<rings;ring++)for(let k=0;k<steps;k++){
        const a=k*Math.PI/steps+.004,b=(k+1)*Math.PI/steps-.004;
        const point=(radius,t)=>[radius*Math.cos(t),radius*Math.sin(t)];
        outline([point(r-.045,a),point(r+.73,a),point(r+.73,b),point(r-.045,b)],
          stone[(ring+3*k+i)%stone.length],cx,spring,-depth/2-.11+ring*(depth+.22)/rings,(depth+.22)/rings-.021);
      }
      const step=northern?.70:.94;
      for(const face of [-1,1])for(let y=0,row=0;y<gate.top;y+=step,row++){
        const ringRadius=r+.74,dy=Math.max(0,y-spring);
        const gap=dy>=ringRadius?0:Math.sqrt(ringRadius**2-dy**2);
        const topHalf=paved||y+step<shoulder?half:Math.max(.1,(gate.top-y-step)/(gate.top-shoulder)*half);
        for(const [l,h] of [[Math.max(left,cx-topHalf),cx-gap],[cx+gap,Math.min(right,cx+topHalf)]]){
          if(h-l<.14)continue;
          const cols=Math.ceil((h-l)/(northern?1.65:2.65)),w=(h-l)/cols;
          for(let c=0;c<cols;c++){
            const height=Math.min(step,gate.top-y)-.037;
            box(stone[(row+c*5+i)%6],l+(c+.5)*w,y+height/2,face*(depth/2+.035),w-.035,height,.11);
          }
        }
      }
    });
  }

  // One indexed mesh per face material for the entire side, including the
  // inward sloping earth bank. Resample its base when the terrain origin moves.
  function rampart(T,group,gate) {
    const positions=[],uv=[],indices=[],sections=[],half=gate.width/2;
    const g=new T.BufferGeometry(),sectionsPerWing=60;
    for(const end of gate.ends){
      const side=Math.sign(end);
      for(let i=0;i<=sectionsPerWing;i++){
        const t=i/sectionsPerWing, x=side*half+(end-side*half)*t;
        const faceZ=(gate.depth/2-4)*(1-t)+gate.cornerZ*t;
        const crest=gate.wallHeight+.37*Math.sin(x*.032)*Math.sin(t*Math.PI);
        const section=positions.length/3;
        const cross=[[.3,-.65],[0,crest],[-3.8,crest+.16],[-12,-.36]];
        sections.push({first:section,x,z:faceZ,t});
        for(const [z,y] of cross){positions.push(x,y,faceZ+z);uv.push(x,y+.88*z);}
        if(!i)continue;
        for(let j=0;j<3;j++){
          const a=section-4+j,b=section+j;
          indices.push(a,b,b+1,a,b+1,a+1);
        }
      }
    }
    // Keep two contiguous draw ranges instead of switching material per bay.
    const wall=[],grass=[];
    for(let i=0;i<indices.length;i+=18){
      wall.push(...indices.slice(i,i+6));grass.push(...indices.slice(i+6,i+18));
    }
    g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    g.setIndex(wall.concat(grass));g.addGroup(0,wall.length,0);g.addGroup(wall.length,grass.length,1);
    const masonry=new T.MeshStandardMaterial({color:0x929487,roughness:1,side:T.DoubleSide});
    masonry.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 courseUv;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n courseUv=uv;');
      shader.fragmentShader='varying vec2 courseUv;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 course=courseUv/vec2(${gate.key==='bac'?'1.64,.72':'2.8,.98'});
        course.x+=fract(floor(course.y)*.618)*.92;
        vec2 edge=.5-abs(fract(course)-.5), aa=max(fwidth(course),vec2(.001));
        float stone=smoothstep(.006,.029+aa.x,edge.x)*smoothstep(.008,.024+aa.y,edge.y);
        float tint=fract(sin(dot(floor(course),vec2(12.39,77.83)))*43758.23);
        float fade=1.-smoothstep(.19,.85,max(aa.x,aa.y));
        diffuseColor.rgb*=mix(.90,.60+.33*stone+.20*(tint-.5),fade);`);
    };
    masonry.customProgramCacheKey=()=>gate.key==='bac'?'tay-do-north':'tay-do-masonry';
    const turf=new T.MeshStandardMaterial({color:0x83945c,roughness:1,side:T.DoubleSide,map:grassTexture(T)});
    const mesh=new T.Mesh(g,[masonry,turf]);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
    const pos=g.attributes.position;
    group.userData.fitGround=ground=>{
      for(const {first,x,z,t} of sections){
        const blend=Math.min(1,t*35),base=ground(x,z)*blend,back=ground(x,z-12)*blend;
        for(let j=0;j<4;j++)pos.setY(first+j,positions[3*(first+j)+1]+(j===3?back:base));
      }
      pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
    };
    g.computeVertexNormals();
  }
  let grass;
  function grassTexture(T){
    if(!grass){
      grass=new T.TextureLoader().load('streetscape/surfaces/grass-color.webp');
      grass.wrapS=grass.wrapT=T.RepeatWrapping;grass.repeat.set(.22,.22);
      grass.colorSpace=T.SRGBColorSpace;grass.userData.sightShared=true;
    }
    return grass;
  }

  for(const gate of gates){
    const {width,depth,top,yaw,ends}=gate,half=width/2;
    const solids=[];
    let start=-half;
    for(const [cx,span] of gate.openings){
      const edge=cx-span/2;
      solids.push([(start+edge)/2,0,(edge-start)/2,depth/2]);
      start=cx+span/2;
    }
    solids.push([(start+half)/2,0,(half-start)/2,depth/2]);
    const front=depth/2-4,back=front-12;
    for(const end of ends){
      const first=Math.sign(end)*half;
      for(let i=0;i<8;i++){
        const t=(i+.5)/8;
        solids.push([first+(end-first)*t,front+(gate.cornerZ-front)*t-4,Math.abs(end-first)/16,4]);
      }
    }
    const boundary=[[ends[0],gate.cornerZ],[-half,front],[-half,depth/2],[half,depth/2],
      [half,front],[ends[1],gate.cornerZ],[ends[1],gate.cornerZ-12],[half,back],[-half,back],[ends[0],gate.cornerZ-12]];
    (window.VietnamSights??=[]).push({
      id:'cong-'+gate.key+'-thanh-ho',name:'Cổng '+gate.name+' Thành Nhà Hồ',city:'Vĩnh Lộc',province:'Thanh Hóa',region:'Trung Bộ',
      lon:gate.lon,lat:gate.lat,start:gate.start,yaw,width,depth,solids,boundary,gardenRadius:20,
      map:'https://www.openstreetmap.org/way/'+gate.way,source,photo:source,description:gate.description,
      reserve(x,z,pad=0){return x>=ends[0]-pad&&x<=ends[1]+pad&&Math.abs(z+3)<13+pad;},
      views:[
        {name:'Mặt ngoài cổng '+gate.name,viewAngle:yaw+.16,viewRadius:width*1.43,viewElevation:.13,height:top*.75},
        {name:'Nhìn qua vòm cuốn',viewAngle:yaw,viewRadius:depth*.80,viewElevation:.09,height:3.8},
        {name:'Mặt trong và lũy đất',viewAngle:yaw+2.58,viewRadius:width*2.8,viewElevation:.28,height:top*.75}
      ],
      build(T,kit){archway(T,kit,gate);rampart(T,kit.group,gate);}
    });
  }

  // Inscribed component 1358-002. The exposed bank and the wooded crest
  // follow the trace through the fields at the UNESCO reference point.
  // https://whc.unesco.org/en/list/1358/maps/
  (window.VietnamSights??=[]).push({
    id:'la-thanh-tay-do',name:'La Thành – lũy đất Tây Đô',city:'Vĩnh Lộc',province:'Thanh Hóa',region:'Trung Bộ',
    lon:105.618608,lat:20.098056,start:[105.6219823,20.1010273],yaw:2.67,width:266,depth:37,
    solids:[],surveyed:true,gardenRadius:22,
    source:'https://thanhnhaho.vn/NewsDetail.aspx?Id=12788',photo:'https://thanhnhaho.vn/NewsDetail.aspx?Id=12788',
    map:'https://www.openstreetmap.org/?mlat=20.098056&mlon=105.618608#map=17/20.098056/105.618608',
    description:'Ngoài vòng thành đá còn có La Thành đắp bằng đất. Đoạn lũy giữa cánh đồng được mô phỏng với mặt ngoài dốc, đỉnh hẹp và chân trải rộng khoảng 37 m.',
    arrivalNote:'Xe đỗ ở đường làng phía đông bắc. Góc ngắm đưa bạn ra đoạn lũy giữa đồng.',visitOnArrival:true,
    views:[{name:'Dọc theo đỉnh lũy',viewAngle:1.19,viewRadius:75,viewElevation:.17,height:10},
      {name:'Mặt cắt lũy giữa đồng',viewAngle:2.60,viewRadius:145,viewElevation:.37,height:6}],
    build(T,{group}){
      const g=new T.BufferGeometry(),positions=[],uv=[],colors=[],indices=[];
      const crest=[[-21,0],[-17,1.3],[-12,1.8],[-10,3],[-6,3.6],[-4,5.6],[4.6,5.9],[9.1,3.1],[16,-.22]];
      const colour=new T.Color();
      for(let i=0;i<=52;i++){
        const x=(i-26)*5.1,turn=2.8*Math.sin(x*.017);
        const end=Math.min(1,i/5,(52-i)/5);
        for(let j=0;j<crest.length;j++){
          const [width,height]=crest[j],z=width+turn;
          positions.push(x,(height+.22*Math.sin(x*.11+j*.3))*end-.14,z);
          uv.push(x*.75,z*.56);colour.setHex(j===7?0xc0a077:j<4?0x88985d:0x799257);colors.push(colour.r,colour.g,colour.b);
          if(i&&j){const n=i*crest.length+j;indices.push(n-crest.length-1,n-1,n,n-crest.length-1,n,n-crest.length);}
        }
      }
      g.setIndex(indices);g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
      g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
      const mesh=new T.Mesh(g,new T.MeshStandardMaterial({map:grassTexture(T),vertexColors:true,roughness:1,side:T.DoubleSide}));
      mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
      group.userData.fitGround=ground=>{
        const pos=g.attributes.position;
        for(let i=0;i<pos.count;i++)pos.setY(i,positions[i*3+1]+ground(pos.getX(i),pos.getZ(i)));
        pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();g.computeBoundingBox();
      };
      g.computeVertexNormals();
    }
  });
})();
