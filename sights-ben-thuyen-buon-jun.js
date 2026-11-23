'use strict';
(()=>{
  const id='ben-thuyen-buon-jun',catalogId='dak-lak-ben-thuyen-buon-jun';
  const stop=window.VietnamTourism.byId?.get(catalogId)??window.VietnamTourism.entries.find(p=>p.id===catalogId);
  const lon=108.1675231,lat=12.4165578;
  const source='https://ttthlak.gov.vn/tin-tuc/can-bao-ton-thuyen-doc-moc-net-dep-van-hoa-cua-ho-lak';
  const photo='https://vietnam.vnanet.vn/english/tin-tuc/wild-lak-lake-72006.html';
  // The provincial transport report identifies Y Jút as the approach to Bến
  // đò Buôn Jun. Its GPS-traced terminus w779496939 meets the paved shoreline
  // road w1357712128 at the northern tip. The waterline follows w1300843482.
  // https://khdt.daklak.gov.vn/CMS/Content/1.%20ThuyetminhBao%20cao%20tong%20hop27.9.2022%20%28LayykienBonganh%29.pdf
  // https://www.openstreetmap.org/way/1357712128
  // https://www.google.com/maps/@12.4165578,108.1675231,150m/data=!3m1!1e3
  // The contemporary headland has an embanked edge and several different
  // types of boat. The dugouts shown here are an illustrative group, based
  // on Tất Sơn's VNP photos and the district broadcaster's close view.
  // https://imagevietnam.vnanet.vn/Upload//2014/12/31/3112201415263186DL6.jpg
  // https://ttthlak.gov.vn/media/2022/08/IMG_20220819_140708.jpg
  // The field report describes hulls around 12 m × 0.6 m. The provincial
  // newspaper records a different family's 9 m boat, almost 1 m wide.
  // https://baodaklak.vn/file/fb9e3a03798789de0179a1704dea238e/upload/xdata/202510/20251017233843so_95.pdf
  const yaw=.309,cs=Math.cos(yaw),sn=Math.sin(yaw);
  const offset=(x,z)=>[cs*x+sn*z,-sn*x+cs*z];
  const view=(name,x,z,height,viewRadius,a,viewElevation)=>({name,offset:offset(x,z),height,viewRadius,
    viewAngle:yaw+a,viewElevation,viewBase:'monument'});
  const rawWood=0x745642,lightWood=0x977654,darkWood=0x514338,paddleWood=0x987950;
  // Dimensions are metres. Shape both faces of the same log; the inner
  // trough ends before the outer prow, leaving a solid raised wooden tip.
  function hull(T,length,width,depth,wood,paint,seed){
    const stations=36,ring=18,verts=[],colors=[],indices=[];
    const colour=new T.Color();
    function vertex(x,y,z,tint,factor){
      verts.push(x,y,z);colour.setHex(tint).multiplyScalar(factor);
      colors.push(colour.r,colour.g,colour.b);
    }
    // Cross section from the left lip around the outside, then back along
    // the hollow inner face. The upper edges retain a visible thickness.
    const section=[[-1,1],[-.99,.73],[-.91,.43],[-.69,.16],[-.35,.035],[0,0],[.35,.035],[.69,.16],
      [.91,.43],[.99,.73],[1,1],[.81,.965],[.78,.69],[.59,.47],[0,.37],[-.59,.47],[-.78,.69],[-.81,.965]];
    for(let i=0;i<=stations;i++){
      const u=i/stations,v=2*u-1,a=Math.abs(v),nose=v<0?1:.69;
      const taper=.034+.966*(1-Math.pow(a,3.3+.35*seed));
      const lift=.27*nose*Math.pow(a,3.4)+.20*nose*Math.pow(a,9);
      for(let j=0;j<ring;j++){
        const [across,h]=section[j],inside=j>=11;
        const heel=inside?.63*Math.pow(a,4.3):0;
        const radius=width*.5*taper;
        const y=lift-.103+depth*(h+heel*(1-h));
        const z=-length*.5+length*u;
        const tint=inside?wood:paint&&h>.60?paint:wood;
        const grain=.90+.043*Math.sin(j*1.32+seed)+.055*Math.cos(u*9+seed*j);
        vertex(across*radius,y,z,tint,grain);
      }
    }
    for(let i=0;i<stations;i++)for(let j=0;j<ring;j++){
      const a=i*ring+j,b=i*ring+(j+1)%ring,c=a+ring,d=b+ring;
      indices.push(a,b,c,c,b,d);
    }
    for(const n of [0,stations]){
      const at=n*ring;
      for(let j=1;j<ring-1;j++)n===0?indices.push(at,at+j+1,at+j):indices.push(at,at+j,at+j+1);
    }
    const geo=new T.BufferGeometry();
    geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));
    geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();
    // Keep the varied old wood and inner gouge marks on one material. The
    // landmark kit bakes monochrome meshes, so this hull retains its own
    // vertex colours and shares its material with all the other dugouts.
    return geo;
  }
  function paddle(T,k,x,y,z,angle){
    k.place(x,z,angle,()=>{
      const blade=new T.Shape();
      blade.moveTo(-.027,-.62);blade.quadraticCurveTo(-.075,-.39,-.132,-.14);
      blade.quadraticCurveTo(-.14,.03,0,.115);blade.quadraticCurveTo(.14,.03,.132,-.14);
      blade.quadraticCurveTo(.075,-.39,.027,-.62);blade.closePath();
      const g=new T.ExtrudeGeometry(blade,{depth:.028,bevelEnabled:false,curveSegments:5});
      g.rotateX(-Math.PI/2);k.stamp(g,paddleWood,0,y,0);g.dispose();
      k.box(paddleWood,0,y+.015,1.24,.046,.046,1.32);
    });
  }
  // The newer Esri image resolves the paved apron and regularly spaced young
  // trees along the outside of the curve. Its toe extends several metres
  // beyond the OSM water polygon in the game. Match that local stretch only.
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=108.16753,12.41651&level=18
  const bank=x=>x>0?x*.086:-x*.006;
  function promenade(T,k){
    const corners=[],faces=[],colors=[],tags=[],col=new T.Color();
    const edgeBlend=x=>Math.min(1,Math.max(0,(x+30)/6),Math.max(0,(33-x)/6));
    function strip(x1,x2,a,b,tint){
      const at=corners.length/3;col.setHex(tint);
      for(const [x,v] of [[x1,a],[x1,b],[x2,b],[x2,a]]){
        const z=bank(x)+2.55+[0,-6.25,-6.75,-7.50][v]*edgeBlend(x);
        corners.push(x,0,z);tags.push(v);colors.push(col.r,col.g,col.b);
      }
      faces.push(at,at+2,at+1,at,at+3,at+2);
    }
    for(let i=0;i<42;i++){
      const x=-30+i*1.5,xx=x+1.5;
      strip(x,xx,0,1,0xbaa991);strip(x,xx,1,2,0xb4a38b);
      strip(x,xx,2,3,i%3===1?0x8b806e:0x857c6d);
    }
    const g=new T.BufferGeometry();
    const pos=new T.Float32BufferAttribute(corners,3);
    g.setAttribute('position',pos);g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(faces);g.computeVertexNormals();
    const mat=new T.MeshStandardMaterial({vertexColors:true,roughness:.99,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 pavedPoint;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\npavedPoint=position.xz;');
      s.fragmentShader='varying vec2 pavedPoint;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        {
        vec2 p=pavedPoint/vec2(.53,.34);p.x+=.5*mod(floor(p.y),2.);
        vec2 joint=min(fract(p),1.-fract(p));vec2 aa=max(fwidth(p),vec2(.001));
        vec2 face=smoothstep(vec2(.013)-aa*.42,vec2(.013)+aa*.42,joint);
        float tone=fract(sin(dot(floor(p),vec2(8.61,53.9)))*16275.2);
        diffuseColor.rgb*=mix(.80,.93+.078*tone,face.x*face.y);
        }`);
    };
    const mesh=new T.Mesh(g,mat);mesh.receiveShadow=true;mesh.userData.shoreCover=true;k.group.add(mesh);
    function fit(ground,level){
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i),a=ground(x,bank(x)+2.55)+.03;
        // Leave the central access open and grade the paved lip towards it.
        const lip=.54+.22*Math.min(1,Math.abs(x)/5.2);
        const heights=[a,level+lip+.16,level+lip,level-.42];
        pos.setY(i,a+(heights[tags[i]]-a)*edgeBlend(x));
      }
      pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    }
    return fit;
  }
  function build(T,k){
    const fixtures=[],apron=promenade(T,k);
    const mat=new T.MeshStandardMaterial({vertexColors:true,roughness:.88,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec3 timberPoint;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntimberPoint=position;');
      s.fragmentShader='varying vec3 timberPoint;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float ring=timberPoint.y*29.0+timberPoint.x*8.0+sin(timberPoint.z*.98)*.65;
        float streak=sin(ring*6.0+sin(timberPoint.z*2.4)*.41);
        float aa=clamp(1.-fwidth(ring)*2.,0.,1.);
        diffuseColor.rgb*=.97+aa*.048*streak+.026*sin(timberPoint.z*7.6+ring); `);
    };
    k.palette({timber:[rawWood,lightWood,darkWood,paddleWood]});
    const fleet=[[-8.85,-11.9,-.18,12.0,.62,.47,0x624f41,0],
      [-6.83,-10.9,-.125,10.4,.69,.45,0x8b6b4d,0x8e8b52],
      [-4.79,-9.76,-.06,9.1,.89,.50,rawWood,0],
      [-1.91,-10.9,.12,11.5,.72,.46,0x79624d,0xa27c42],
      [1.8,-11.3,.19,12.2,.61,.45,0x594c40,0],
      [6.56,-10.94,.31,10.3,.73,.47,0x856a4f,0]];
    // Canoes are moored bow-to-bank. A crosspiece and loose paddles occur
    // only in a few hulls. The others show the hollow uninterrupted bole.
    fleet.forEach(([x,z,angle,length,width,depth,wood,paint],i)=>{
      const mesh=new T.Mesh(hull(T,length,width,depth,wood,paint,i*.107),mat);
      mesh.name='Thuyền độc mộc';mesh.position.set(x,0,z);mesh.rotation.y=angle;
      mesh.receiveShadow=mesh.castShadow=true;k.group.add(mesh);
      const first=k.vertexCount();
      k.place(x,z,angle,()=>{
        if(i===1||i===4)k.box(lightWood,0,depth-.19,-length*.14,width*.80,.045,.24,-.018);
        if(i===2||i===4)paddle(T,k,-.07,.125,i===2?-.71:.10,-.115);
      });
      fixtures.push({first,end:k.vertexCount(),mesh});
    });
    // The thin stakes visible at the waterline are moorings. They go into
    // the lake bed and stay separate from the promenade along the bank.
    for(const [x,z,h,index] of [[-8.0,-5.49,1.03,0],[-4.7,-4.97,1.34,2],[2.2,-5.14,1.05,4],[6.1,-5.64,.91,5]]){
      const first=k.vertexCount();
      k.tapered(0x685b44,x,h*.5-1.05,z,.042,.033,h+2.10,1,7);
      const [cx,cz,angle,length]=fleet[index];
      const bx=cx+Math.sin(angle)*length*.47,bz=cz+Math.cos(angle)*length*.47;
      const rope=new T.TubeGeometry(new T.QuadraticBezierCurve3(
        new T.Vector3(bx,.43,bz),new T.Vector3((bx+x)/2,.26,(bz+z)/2),new T.Vector3(x,.52,z)),6,.016,5,false);
      k.stamp(rope,0x76664a,0,0,0);rope.dispose();
      fixtures.push({first,end:k.vertexCount()});
    }
    const stems=[[-24,4.0],[-16,3.7],[11.8,4.3],[19.9,3.9],[27.8,3.7]];
    const groves=k.group.children.length;
    createTreeModels(T).grove(k.group,stems.map(([x,h])=>[x,0,bank(x)-.87,h*.68,h,x*.23]));
    const trees=k.group.children.slice(groves);
    let solid,rest;
    k.group.userData.fitGround=ground=>{
      solid??=k.group.children.find(o=>o.geometry?.attributes.finishKind)?.geometry;
      if(!solid)return;
      const p=solid.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      // A named lake's stage is computed per streamed district. Sample the
      // actual water away from its blended shore, rather than the lake bed.
      const pin=typeof roads!=='undefined'&&roads?.point?roads.point(lon,lat):null;
      const [dx,dz]=offset(0,-19);
      const water=pin&&typeof gfx!=='undefined'&&gfx?.waterAt?.(pin.x+dx,pin.z+dz);
      const level=water&&Number.isFinite(water.level)?water.level-k.group.position.y:ground(0,-.4)-.58;
      apron(ground,level);
      for(const {first,end,mesh} of fixtures){
        if(mesh)mesh.position.y=level;
        for(let i=first;i<end;i++)p.setY(i,rest[i]+level);
      }
      for(const tree of trees){
        const m=tree.instanceMatrix;
        for(let j=0;j<tree.count;j++){
          const at=j*16+12,x=m.array[at];
          m.array[at+1]=(ground(x,bank(x)+2.55)+.03)*.45+(level+.92)*.55-.07;
        }
        m.needsUpdate=true;tree.computeBoundingSphere();
      }
      p.needsUpdate=true;solid.computeBoundingBox();solid.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...stop,id,catalogId,name:'Bến thuyền độc mộc buôn Jun',kind:'Bến tàu',locality:'Buôn Jun',
    lon,lat,yaw,start:[108.1675773,12.4164342],approachMeters:15,mappedEntrance:true,visitOnArrival:true,
    source,photo,map:'https://www.openstreetmap.org/way/779496939',
    arrivalNote:'Xe dừng gần cuối đường Y Jút. Từ đây đi bộ khoảng 15 m qua đường ven hồ đến mép bến ở đầu bắc buôn Jun.',
    description:'Người M’nông R’lâm ven hồ Lắk đẽo thuyền độc mộc từ một thân gỗ sao. Nhìn vào lòng thuyền thấy hai mạn và đáy liền nhau. Các thuyền được xếp minh họa tại bờ bến theo ảnh chụp trên hồ. Mực nước và chỗ neo thay đổi theo mùa.',
    foundationAt:[0,-.5],width:24,depth:18,gardenRadius:1,solids:[],reserve:()=>false,
    boundary:[[-10.6,-15.1],[9.7,-15.1],[9.7,-.7],[-10.6,-.7]],
    views:[view('Những mũi thuyền nhìn ra hồ',-1.4,-10.85,1.05,18.4,.58,.21),
      {...view('Lòng gỗ và mái chèo',-4.8,-9.75,-.56,6.98,-.97,.62),photo:source},
      view('Dọc bờ bắc buôn Jun',-1.8,-9.55,2.0,23.0,-1.53,.21)],build});
})();
