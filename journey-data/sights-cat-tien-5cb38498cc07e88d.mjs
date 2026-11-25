const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const sights=window.VietnamSights??=[],K=globalThis.VietnamKarst,A=globalThis.CentralArch;
  const park='https://cattiennationalpark.com.vn/',photos=park+'thu-vien-anh/';
  const woodland=park+'su-ky-vi-cua-nhung-banh-ve/';
  const oldTrees=park+'du-lich-cat-tien-ve-voi-thien-nhien-ve-voi-vong-tay-cua-nui-rung/';
  // Public approach by the east-bank ferry, beside the entrance car park
  // (way 1388867441). The park's forest and lakeside stops are visited on foot.
  const arrival=[107.4307719,11.4232401];
  let litter;
  function add(id,key,name,lon,lat,yaw,w,d,source,description,shots,build,extra={}){
    const c=Math.cos(yaw),s=Math.sin(yaw);
    const views=shots.map(([name,x,z,height,viewRadius,angle,viewElevation,viewBase])=>({
      name,offset:[c*x+s*z,-s*x+c*z],height,viewRadius,viewAngle:yaw+angle,viewElevation,viewBase}));
    sights.push({id,catalogId:key,name,kind:'Tham quan',province:'Đồng Nai',city:'Cát Tiên',region:'Nam Bộ',
      locality:'Vườn quốc gia Cát Tiên',lon,lat,width:w,depth:d,yaw,source,description,photo:source,views,build,
      map:'https://www.openstreetmap.org/'+key.slice(4).replace('-','/'),start:arrival,solids:[],mappedEntrance:true,visitOnArrival:true,
      arrivalNote:'Xe dừng cạnh bến phà Nam Cát Tiên, ở bờ ngoài sông Đồng Nai. Từ đây hành trình tiếp tục trong Vườn.',...extra});
  }
  // The visitor footpath (1368127585) ends just inland of the basalt shelf.
  // Its long axis follows the bank of the Đồng Nai, way 318809251.
  add('ghenh-ben-cu-cat-tien','osm-node-12613087809','Ghềnh Bến Cự',107.4295182,11.4344393,2.397,91,59,
    oldTrees,'Từ đường rừng, lối nhỏ mở ra sông Đồng Nai. Những phiến bazan sẫm màu chạy dọc bờ, xen giữa là các khe hẹp ăn ra mép nước.',
    [['Từ lối rừng nhìn qua ghềnh',0,13,4.7,26,2.85,.31],['Mặt đá bazan sát dòng nước',-8,13,5.6,22,1.93,.19]],
    (T,k)=>{
      const r=K.batch(T);
      for(let i=0;i<94;i++){
        const x=-40+80*k.random(),z=-1+29*k.random()+3*Math.sin(x*.12);
        const length=.84+k.random()**1.7*5.3,width=1.0+k.random()**1.4*3.0,height=.40+k.random()**1.4*1.59,phase=k.random()*6.28;
        r.grid(24,9,(u,v)=>{
          const a=u*6.2832,edge=1+.19*Math.cos(3*a+phase)+.12*Math.sin(5*a-phase);
          const radius=edge*Math.cos(v*Math.PI*.5)**.68,px=Math.cos(a)*radius*length,pz=Math.sin(a)*radius*width;
          const tilt=px*.08*Math.sin(phase)+pz*.13*Math.cos(phase);
          const dip=.17*Math.cos(px*2.6+pz*.73+phase)+.09*Math.sin(pz*3.7-px*1.4);
          const y=-.38+height*Math.sin(v*Math.PI*.5)+tilt+dip*(.35+.65*v);
          const tint=z>14?(v<.38?0x3e423c:0x555951):(v<.28?0x555045:0x706b58);
          return [x+px,y,z+pz,tint,.75+.12*Math.cos(2*a+phase)+.08*Math.sin(px*1.8+pz*2.4)];
        });
      }
      for(let i=0;i<26;i++){
        const x=-43+86*k.random(),z=-10-12*k.random();
        if(Math.abs(x)<13)continue;
        r.trees.push([x,0,z,4.4+k.random()*5,8+k.random()*9,k.random()*6.28]);
      }
      K.finish(T,k,r);
    },{photo:'https://1thegioi.vn/tha-buoc-trong-vuon-quoc-gia-cat-tien-249055.html'});
  function forestTree(T,k,tung){
    const r=K.batch(T),wood=K.batch(T),F=globalThis.VietnamForestGiants;
    const colour=tung?0xb4ae9b:0x897a66,h=tung?38:30,spread=tung?6.4:9.2;
    const trunk=tung?[[0,-.55,0,1.91],[.28,4,-.18,1.41],[.10,13,.22,1.02],[-.48,24,.52,.79],[.70,32,.43,.49],[1.14,37,1.12,.16]]:
      [[0,-.50,0,2.32],[.26,4,.14,1.86],[-.38,10,.18,1.45],[.37,16,-.25,1.18],[-.27,22,.69,.80],[-2.2,28,1.51,.32]];
    F.limb(T,wood,trunk,1.64,false,false,colour);
    const directions=tung?[.18,1.34,2.07,3.26,4.39,5.48]:[.08,1.48,2.58,3.97,5.33];
    const lengths=tung?[13.7,9.1,11.6,7.5,12.0,8.1]:[5.1,6.1,4.7,5.7,4.4],leaves=[];
    for(const [i,a] of directions.entries()){
      const dx=Math.cos(a),dz=Math.sin(a),reach=spread*(.68+.10*(i%4)),height=h*(tung?.69:.49)+i%3*1.5;
      F.buttress(wood,0,0,a,lengths[i],tung?4.1+(i%3)*.43:2.68+(i%2)*.75,tung?.34:.69,i+.34,false,colour);
      F.limb(T,wood,[[0,height,.28,tung?.52:.79],[dx*reach*.40,height+2.6,dz*reach*.40,.50],
        [dx*reach*.71,height+4.9,dz*reach*.71,.35],[dx*reach,height+7.0,dz*reach,.16]],i*1.7,false,false,colour);
      leaves.push([dx*reach,height+8.1,dz*reach,3.9,3.1,4.0,a],
        [dx*reach*.60,height+9.6,dz*reach*.60,3.8,3.4,3.9,a+.9]);
    }
    leaves.push([.6,h,.5,4.2,3.4,4.2,.5]);F.crowns(T,k,leaves);wood.add(k.group,F.bark(T));
    const soil=K.batch(T);
    soil.grid(64,14,(u,v)=>{
      const a=u*2*Math.PI,edge=12.8+1.5*Math.cos(3*a)+1.22*Math.sin(5*a),radius=edge*v;
      const x=Math.sin(a)*radius,z=Math.cos(a)*radius;
      return [x,.028-.47*v**8,z,0xb99f7b,.77+.12*Math.cos(x*.71+z*.60)];
    });
    if(!litter){
      litter=new T.TextureLoader().load('streetscape/verge-earth.webp');litter.colorSpace=T.SRGBColorSpace;
      litter.wrapS=litter.wrapT=T.RepeatWrapping;litter.userData.sightShared=true;
    }
    const earth=new T.MeshStandardMaterial({map:litter,vertexColors:true,roughness:1,transparent:true,depthWrite:false});
    earth.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 forestFloor;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\n forestFloor=position.xz;');
      shader.fragmentShader='varying vec2 forestFloor;\n'+shader.fragmentShader.replace('#include <map_fragment>',
        '#include <map_fragment>\n float edge=length(forestFloor)+.73*sin(forestFloor.x*1.4)*cos(forestFloor.y); diffuseColor.a*=1.-smoothstep(7.8,13.1,edge);');
    };
    soil.add(k.group,earth);
    const ground=k.group.children.at(-1).geometry,vertices=ground.attributes.position,uv=[];
    for(let i=0;i<vertices.count;i++)uv.push(vertices.getX(i)*.33,vertices.getZ(i)*.33);
    ground.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    for(let i=0;i<42;i++){
      const a=i*2.399963,radius=15.3+k.random()*18.6;
      const x=Math.sin(a)*radius,z=Math.cos(a)*radius;
      if((tung?x<0:z>0)&&Math.abs(tung?z:x)<10)continue;
      r.trees.push([x,-.1,z,4.3+k.random()*4.2,10+k.random()*12,k.random()*6.28]);
      if(i%3===0)r.ferns.push([x*.62,.0,z*.62,.8+k.random()*1.13,a]);
    }
    for(let i=0;i<71;i++){
      const a=i*2.39996,dist=9+k.random()*16,x=Math.cos(a)*dist,z=Math.sin(a)*dist;
      if((tung?x<0:z>0)&&Math.abs(tung?z:x)<5.0)continue;
      r.ferns.push([x,.02,z,.46+k.random()*1.0,a]);
    }
    K.finish(T,k,r,(ground,x,z)=>ground(x,z)-ground(0,0));
  }
  add('cay-go-bac-dong','osm-node-4746491491','Cây gõ Bác Đồng',107.4234363,11.4374073,0,47,46,
    oldTrees,'Gõ đỏ cổ thụ mọc cạnh lối đi bộ. Qua lớp vỏ sẫm, thân lớn tách thành những cành cao đỡ một tán rộng.',
    [['Từ đường mòn nhìn lên tán gõ',0,0,33.5,43,.57,.16],['Bạnh và thớ vỏ ở chân cây',0,0,7.2,11,.92,.13]],(T,k)=>forestTree(T,k,false));
  add('cay-tung-duong-bau-sau','osm-node-5366011821','Cây tung trên đường mòn Bàu Sấu',107.3646063,11.4501435,0,55,52,
    woodland,'Bên lối vào Bàu Sấu, các bạnh rễ mỏng xòe xa khỏi thân tung. Vỏ thân sáng màu, tán lá tập trung ở tầng cao.',
    [['Dải rễ nổi bên lối đi bộ',0,0,8.0,18.5,-1.62,.16],['Thân tung vươn qua tầng rừng',0,0,39,48,-1.42,.17]],(T,k)=>forestTree(T,k,true));
  // Five vertices of w1239017262 include the small landing at the top of the
  // stairs. The footway leaves its eastern corner toward the ranger station.
  add('dai-quan-sat-bau-sau','osm-way-1239017262','Đài quan sát Bàu Sấu',107.34509554,11.45974114,0,26,31,
    photos,'Mái đài đỏ nhô lên giữa đám cỏ ven Bàu Sấu. Từ sàn có lan can gỗ, khách nhìn ra mặt bàu và bìa rừng ở bờ xa.',
    [['Mái đài từ lối tới trạm',0,0,8.0,21,.93,.13],['Nhìn qua lan can ra Bàu Sấu',-15,-9,7.2,17.8,1.05,.11,'monument']],
    (T,k)=>{
      const r=K.batch(T),concrete=0xaca99b,wood=0x764c39,roof=0xa14d37;
      const floor=3.42;
      k.palette({timber:[wood],stone:[concrete],tile:[roof]});
      k.place(-.5,-.35,-.49,()=>{
        k.box(wood,0,floor,0,6.85,.25,6.25);
        for(const x of [-2.92,2.92])for(const z of [-2.61,2.61]){
          k.box(concrete,x,1.4,z,.36,4.0,.36);k.box(wood,x,4.89,z,.19,2.93,.19);
        }
        k.tapered(roof,0,7.21,0,5.65,.09,1.86,.95,4);
        k.box(wood,0,6.30,-2.66,6.48,.16,.17);k.box(wood,0,6.30,2.66,6.48,.16,.17);
        function railing(x,z,ex,ez){
          const len=Math.hypot(ex-x,ez-z),n=Math.ceil(len/.43);
          for(let i=0;i<=n;i++){
            const t=i/n;k.box(wood,x+(ex-x)*t,floor+.56,z+(ez-z)*t,.066,.96,.066);
          }
          A.strut(T,k,wood,x,floor+1.12,z,ex,floor+1.12,ez,.075);
        }
        railing(-3.27,-2.95,3.27,-2.95);railing(-3.27,-2.95,-3.27,2.95);railing(-3.27,2.95,3.27,2.95);
        railing(3.27,-2.95,3.27,-.7);railing(3.27,.78,3.27,2.95);
        for(let i=0;i<17;i++)k.box(wood,3.46+i*.245,floor-i*.194,0,.28,.13,1.39);
        for(const z of [-.74,.74])A.strut(T,k,wood,3.27,4.53,z,7.72,1.09,z,.070);
      });
      // One instanced tussock draw for the emergent vegetation on the eastern
      // lake margin. Leave the visitor footway and open water free.
      const blades=K.batch(T),prototype=new T.Group();
      for(let j=0;j<12;j++){
        const a=j*2.39996,dx=Math.cos(a),dz=Math.sin(a),h=.74+k.random()*.82;
        blades.grid(1,3,(u,v)=>[dx*(.12+.49*v*v)+(u-.5)*.12*(1.02-v)*dz,h*v-.07,
          dz*(.12+.49*v*v)-(u-.5)*.12*(1.02-v)*dx,j%3===0?0x929658:0x718c4d,.73+.27*v]);
      }
      blades.add(prototype,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}));
      const stem=prototype.children[0],grass=new T.InstancedMesh(stem.geometry,stem.material,2100),pose=new T.Object3D();
      let count=0;
      for(let i=0;i<2100;i++){
        const x=-16+49*k.random(),z=-30+66*k.random();
        if(Math.hypot(x,z)<3.7||(x>1&&Math.abs(z-.76*x)<1.6))continue;
        const h=.73+.67*k.random()+.30*Math.sin(x*.23+z*.09);
        pose.position.set(x,-.06,z);pose.scale.setScalar(h);pose.rotation.y=k.random()*6.28;pose.updateMatrix();
        grass.setMatrixAt(count++,pose.matrix);
      }
      grass.count=count;grass.computeBoundingSphere();k.group.add(grass);
      // The first section of w1239017263 joins the bottom of the flight.
      r.grid(2,30,(u,v)=>[5.9+21*v+(u-.5)*1.16,.035,4.4+15.5*v-(u-.5)*1.40,0x978872,.81+.06*Math.sin(29*v)]);
      K.finish(T,k,r,(h,x,z)=>Math.hypot(x,z)<7?0:h(x,z));
    });
})();

export default window.VietnamSights;
