'use strict';
(()=>{
  const id='ao-ba-om',catalogId='osm-way-76041615',lon=106.30286,lat=9.91720,start=[106.3056618,9.9178216];
  const mx=111320*Math.cos(lat*Math.PI/180),at=(x,y)=>[(x-lon)*mx,(lat-y)*110900];
  const coast=[[106.3030638,9.9168116],[106.3029297,9.9182309],[106.3050078,9.9186073],[106.3051231,9.9171035]].map(p=>at(...p));
  const centre=coast.reduce(([x,z],p)=>[x+p[0]/4,z+p[1]/4],[0,0]);
  const source='https://vietnamtourism.vn/index.php/tourism/items/1395',photo=n=>'https://commons.wikimedia.org/?curid='+n;
  const rand=i=>{const a=Math.sin(i*47.862+4.81)*35221.6;return a-Math.floor(a);};
  function edge(i,t){
    const a=coast[i],b=coast[(i+1)%4],dx=b[0]-a[0],dz=b[1]-a[1],d=Math.hypot(dx,dz);
    return {x:a[0]+t*dx,z:a[1]+t*dz,nx:dz/d,nz:-dx/d,length:d};
  }
  function fromBank(i,t,off){
    const e=edge(i,t);return [e.x+e.nx*off,e.z+e.nz*off];
  }
  const shore=fromBank(3,.59,3.8),sand=fromBank(0,.44,16.8);
  function view(name,focus,station,h,eye,fov,link,photoCatalogId,description){
    const [x,z]=focus,dx=station[0]-x,dz=station[1]-z,dy=eye-h;
    return {name,offset:[x,z],height:h/.46,viewAngle:Math.atan2(dx,dz),viewRadius:Math.hypot(dx,dz,dy),
      viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewFov:fov,photo:link,photoCatalogId,description};
  }
  const views=[
    view('Khoảng trống dưới bộ rễ cổ thụ',[.06,0],[1.22,-5.35],1.1,1.57,50,photo(25228817),catalogId,
      'Nhìn ngang tầm gốc cây. Rễ lớn tỏa khỏi thân rồi vòng xuống đất, chừa khoảng trống bên dưới. Hình dáng gốc cây dựa theo ảnh tư liệu tại Ao Bà Om.'),
    view('Lá sen và hàng cây bên kia ao',fromBank(3,.58,-68),shore,.42,2.2,57,photo(34578946),'ao-ba-om-mat-nuoc',
      'Từ bờ phía chùa Âng nhìn qua mặt nước. Lá sen và cuống già nằm sát bờ, bên kia là dải cây sao, dầu cao hơn gò cát.'),
    view('Lối cát dưới tán sao dầu',fromBank(0,.22,16),sand,1.72,1.98,58,photo(25228818),'ao-ba-om-loi-cat',
      'Nhìn dọc lối đất dưới tán cổ thụ. Các thân cây thẳng vươn cao trước khi phân cành, dưới chân là rễ nổi và nền cát có lá rụng.'),
    view('Bốn bờ của Ao Vuông',centre,fromBank(3,.43,107),1.8,148,59,source,'ao-ba-om-tu-tren-cao',
      'Nhìn từ phía nam qua mặt ao về dải cây phía bắc. Ao Bà Om còn gọi là Ao Vuông. Bốn cạnh và hướng nghiêng của mặt ao được dựng theo bản đồ.'),
  ];
  function barkMaterial(T,map){
    return new T.MeshStandardMaterial({map,bumpMap:map,bumpScale:.042,color:0xe0d6bf,roughness:.99,vertexColors:true});
  }
  // Sweep irregular sections through the paths of the photographed spreading
  // roots. The gap beneath the cross-root is open on both sides and in orbit.
  function rootedTree(T,mat){
    const pos=[],norm=[],uv=[],idx=[],colors=[],work=new T.Color();
    function sweep(points,sections,sides,phase){
      const curve=new T.CatmullRomCurve3(points.map(([x,y,z])=>new T.Vector3(x,y,z)));
      const frame=curve.computeFrenetFrames(sections,false),samples=curve.getSpacedPoints(sections);
      const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances[i-1]+Math.hypot(...points[i].slice(0,3).map((x,j)=>x-points[i-1][j])));
      const length=curve.getLength(),base=pos.length/3;let row=0;
      for(let j=0;j<=sections;j++){
        const s=j/sections*distances.at(-1);while(row+2<points.length&&s>distances[row+1])row++;
        const f=(s-distances[row])/(distances[row+1]-distances[row]),a=points[row],b=points[row+1];
        const radius=a[3]+(b[3]-a[3])*f,flatten=a[4]+(b[4]-a[4])*f;
        for(let i=0;i<=sides;i++){
          const angle=i/sides*Math.PI*2,r=radius*(1+.075*Math.cos(3*angle+phase)+.043*Math.sin(5*angle+s*.9));
          const nx=frame.normals[j],ny=frame.binormals[j],dx=r*Math.cos(angle),dy=r*flatten*Math.sin(angle);
          const p=samples[j].clone().addScaledVector(nx,dx).addScaledVector(ny,dy);
          const n=nx.clone().multiplyScalar(Math.cos(angle)).addScaledVector(ny,Math.sin(angle)/flatten).normalize();
          pos.push(p.x,p.y,p.z);norm.push(n.x,n.y,n.z);
          uv.push(i/sides*Math.max(1,radius*7.5)+phase,j/sections*length*.48);
          work.setScalar(.78+.15*Math.cos(angle+phase)*Math.sin(s*.26+phase));colors.push(work.r,work.g,work.b);
          if(i<sides&&j<sections){const k=base+j*(sides+1)+i;idx.push(k,k+1,k+sides+1,k+1,k+sides+2,k+sides+1);}
        }
      }
    }
    sweep([[-.17,.58,-.13,.63,1.13],[-.17,1.28,-.18,.64,1.18],[-.29,2.26,-.18,.51,1.02],[-.35,5.1,-.18,.43,.99],
      [-.39,9.2,.18,.41,1.04],[-.24,13,.30,.34,1.02],[.29,17.9,-.16,.22,.96],[.56,20.6,-.38,.10,1]],40,20,.2);
    const limbs=[
      [[-.22,1.92,0,.49,1.03],[.16,1.61,.42,.52,1.08],[.62,1.47,.71,.46,.93],[1.02,1.26,.67,.31,.91],[1.18,.90,.55,.23,.91],[1.53,.10,.44,.16,.86],[2.01,.001,.48,.055,.83],[2.26,-.13,.48,.018,.88]],
      [[-.27,1.52,.14,.43,1.0],[-.66,1.06,.56,.36,.88],[-.82,.85,.76,.33,.86],[-1.19,.43,.94,.22,.67],[-1.74,.10,1.17,.19,.53],[-2.37,-.06,1.26,.06,.84]],
      [[-.7,.97,.55,.24,1.08],[-.43,.81,.82,.21,.83],[.01,.86,1.01,.18,.70],[.49,.89,1.06,.17,.83],[.83,.98,.88,.20,.87],[.91,1.28,.62,.22,1]],
      [[.62,1.36,.62,.30,1.13],[.71,1.14,1.16,.25,.96],[.8,.82,1.42,.14,.90],[.84,.38,1.46,.115,.9],[.86,-.10,1.48,.11,.92]],
      [[-.73,.95,.64,.22,1.1],[-.81,.57,1.02,.14,1],[-.88,-.12,1.23,.085,.95]],
      [[-.28,1.23,-.29,.39,.91],[-.72,.74,-.71,.30,.96],[-1.13,.17,-1.04,.20,.74],[-1.78,-.09,-1.42,.055,.80]],
      [[-.05,1.37,-.32,.39,1.0],[.47,.81,-.81,.27,.88],[.82,.17,-1.1,.15,.74],[1.12,-.11,-1.77,.09,.77]],
      [[-.22,.58,-.13,.42,1.08],[-.24,.31,.01,.35,1.18],[-.43,-.19,.11,.38,1.15]],
      [[-.12,12.4,.22,.29,1.02],[-1.1,14.38,-.61,.23,.96],[-2.9,16.5,-1.25,.14,.92],[-3.91,18.1,-1.54,.07,1]],
      [[-.07,14.75,.27,.24,1.09],[.91,16.46,.58,.20,.95],[2.2,17.5,1.39,.16,1.03],[3.64,19.2,1.84,.06,.95]],
    ];
    limbs.forEach((p,i)=>sweep(p.map(([x,y,z,r,f])=>[x,y-.31*(1-T.MathUtils.smoothstep(y,0,.48)),z,r,f]),12+p.length*2,i<7?15:10,i*.68));
    const g=new T.BufferGeometry();for(const [k,v,n] of [['position',pos,3],['normal',norm,3],['uv',uv,2],['color',colors,3]])
      g.setAttribute(k,new T.Float32BufferAttribute(v,n));
    g.setIndex(idx);g.computeBoundingBox();const mesh=new T.Mesh(g,mat);
    mesh.name='Gốc cổ thụ với rễ nổi ở Ao Bà Om';mesh.rotation.y=Math.PI+.12;mesh.castShadow=mesh.receiveShadow=true;return mesh;
  }
  function sandyBanks(T,k,texture){
    const pos=[],uv=[],idx=[],col=[],rows=[-.25,.45,2.8,6.4,12,19,29,38],sections=[];
    for(let i=0;i<4;i++){
      const current=edge(i,0),prev=edge((i+3)%4,0);
      const n=Math.ceil(current.length/3.2);
      for(let j=0;j<n;j++){
        const t=j/n,e=edge(i,t);
        const m=j===0?{nx:(prev.nx+e.nx)/(1+prev.nx*e.nx+prev.nz*e.nz),nz:(prev.nz+e.nz)/(1+prev.nx*e.nx+prev.nz*e.nz)}:e;
        sections.push([e.x,e.z,m.nx,m.nz,i,t]);
      }
    }
    for(let i=0;i<sections.length;i++){
      const [cx,cz,nx,nz,side,t]=sections[i];
      for(let j=0;j<rows.length;j++){
        const width=rows[j],d=width*(1+.07*Math.sin(t*18+side)+.06*Math.cos(t*39+side));
        const x=cx+nx*d,z=cz+nz*d;pos.push(x,0,z);uv.push(x/3.1,z/2.4);
        const footpath=Math.exp(-((d-(side===0?16:10))**2)/46),grass=1-footpath;
        const a=[.0,.76,.92,.96,.98,.96,.68,0][j],shade=.72+.12*Math.sin(t*68+side)*Math.cos(d*.57)+.1*Math.cos(t*116+d*.26);
        col.push(shade*(.92-.65*grass),shade*(.89-.45*grass),shade*(.76-.60*grass),a);
        if(j+1<rows.length){const p=i*rows.length+j,n=((i+1)%sections.length)*rows.length+j;idx.push(p,n,p+1,p+1,n,n+1);}
      }
    }
    const g=new T.BufferGeometry(),p=new T.Float32BufferAttribute(pos,3);g.setAttribute('position',p);
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('color',new T.Float32BufferAttribute(col,4));g.setIndex(idx);
    const m=new T.MeshStandardMaterial({map:texture,vertexColors:true,transparent:true,depthWrite:false,roughness:1,side:T.DoubleSide});
    const mesh=new T.Mesh(g,m);mesh.name='Gò cát quanh Ao Vuông';mesh.receiveShadow=true;k.group.add(mesh);
    return ground=>{for(let i=0;i<p.count;i++)p.setY(i,ground(p.getX(i),p.getZ(i))+.072);
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();};
  }
  function grove(T,k,bark,hero){
    const treeModels=createTreeModels(T),trees=[],understory=[],pose=new T.Object3D(),copies=[],canopies=[];
    // Tall, clean boles and a continuous high canopy leave the sandy bank
    // visible at eye height. The ground-level forms follow the field photos.
    for(let s=0;s<4;s++){
      const len=edge(s,0).length;
      for(let row=0;row<6;row++){
        const n=Math.floor(len/(row===0?10.9:9.6));
        for(let i=0;i<n;i++){
          const seed=s*700+row*90+i,t=(i+.22+.52*rand(seed+62))/n;
          const off=[4.8,13.6,27,39,49,57][row]+8.1*(rand(seed+30)-.5),[x,z]=fromBank(s,t,off);
          if(Math.hypot(x,z)<7||Math.hypot(x-shore[0],z-shore[1])<4.0)continue;
          if(s===0&&off>15&&off<20)continue;
          if(s===2&&off>37)continue; // Keep the mapped eastern entrance road clear.
          trees.push([x,z,18+12*rand(seed+14),.44+.62*rand(seed+39),rand(seed+18)*6.28,seed]);
          if(row>=3||!row&&s!==0&&Math.abs(t-.59)>.11){
            understory.push([x+2.8,z+1.9,3.9+rand(seed+286)*6,.79,rand(seed+245)*6.28,seed]);
          }
        }
      }
    }
    const pGeo=new T.BufferGeometry(),position=[],uv=[],white=[],faces=[];
    for(const [j,h] of [0,.032,.105,.59,1].entries())for(let i=0;i<=10;i++){
      const a=i/10*Math.PI*2,flare=Math.max(0,1-h*11)*(.14+.96*Math.max(0,Math.cos(3*a+.45))**3);
      const r=1-.32*h+flare;position.push(r*Math.sin(a)+1.45*h*h,h,r*Math.cos(a)-.63*h);
      uv.push(i/10*2.7,h*7.3);const shade=.74+.07*Math.sin(a)+.06*Math.min(1,h*11);white.push(shade,shade,shade);
      const p=j*11+i;if(j<4&&i<10)faces.push(p,p+1,p+11,p+1,p+12,p+11);
    }
    for(const [key,values,size] of [['position',position,3],['uv',uv,2],['color',white,3]])pGeo.setAttribute(key,new T.Float32BufferAttribute(values,size));
    pGeo.setIndex(faces);pGeo.computeVertexNormals();
    const boles=new T.InstancedMesh(pGeo,bark,trees.length);boles.name='Thân sao dầu ven ao';boles.castShadow=boles.receiveShadow=true;k.group.add(boles);
    // A few exposed root systems repeat down the walking path at a different
    // orientation and scale. The primary specimen remains independently orbitable.
    for(const [x,z,s,a] of [[-1.9,12.8,.81,-.32],[-3.4,25.7,.7,.48],[2.3,-12.7,.72,1.23]]){
      const copy=new T.Mesh(hero.geometry,bark);copy.scale.setScalar(s);copy.rotation.y=Math.PI+a;
      copy.position.set(x,0,z);copy.receiveShadow=copy.castShadow=true;k.group.add(copy);copies.push(copy);
    }
    const shadowPos=[],shadowCol=[],shadowIdx=[];
    for(const o of [hero,...copies]){
      const base=shadowPos.length/3;
      for(const [row,r] of [.01,.78,1.6,2.8].entries())for(let i=0;i<=16;i++){
        const a=i/16*Math.PI*2,d=r*o.scale.x*(1+.12*Math.cos(a*3+o.rotation.y));
        shadowPos.push(o.position.x+Math.cos(a)*d,0,o.position.z+Math.sin(a)*d*.79);
        shadowCol.push(.052,.038,.018,[.48,.44,.22,0][row]);
        const b=base+row*17+i;if(i<16&&row<3)shadowIdx.push(b,b+17,b+1,b+1,b+17,b+18);
      }
    }
    const sg=new T.BufferGeometry(),sp=new T.Float32BufferAttribute(shadowPos,3);sg.setAttribute('position',sp);
    sg.setAttribute('color',new T.Float32BufferAttribute(shadowCol,4));sg.setIndex(shadowIdx);
    const shadows=new T.Mesh(sg,new T.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,side:T.DoubleSide}));
    shadows.renderOrder=1;k.group.add(shadows);
    const crowns=[...trees,[0,0,27,1.22,.12,4],...copies.map((o,i)=>[o.position.x,o.position.z,25.5*o.scale.x,.9,o.rotation.y,7+i])];
    for(let v=0;v<4;v++){
      const records=crowns.filter((_,i)=>i%4===v),near=[],far=[];
      for(const r of records){
        (Math.min(Math.hypot(r[0],r[1]),Math.hypot(r[0]-shore[0],r[1]-shore[1]))<44?near:far).push(r);
      }
      const billboard=treeModels.distantGeometry('tree',v),leaves=treeModels.billboardMaterial();
      for(const [rows,geometry,mat,low] of [[near,treeModels.geometry('tree',true,v),treeModels.material,false],
        [far,billboard,leaves,false],[understory.filter((_,i)=>i%4===v),billboard,leaves,true]]){
        const mesh=new T.InstancedMesh(geometry,mat,rows.length);
        mesh.castShadow=rows===near;mesh.receiveShadow=true;k.group.add(mesh);canopies.push([mesh,rows,low]);
      }
    }
    return ground=>{
      for(let i=0;i<sp.count;i++)sp.setY(i,ground(sp.getX(i),sp.getZ(i))+.084);
      sp.needsUpdate=true;sg.computeBoundingSphere();
      for(let i=0;i<trees.length;i++){const [x,z,h,w,a]=trees[i];pose.position.set(x,ground(x,z)-.18,z);
        pose.rotation.set(0,a,0);pose.scale.set(w*.66,h*.73,w*.67);pose.updateMatrix();boles.setMatrixAt(i,pose.matrix);}
      boles.instanceMatrix.needsUpdate=true;boles.computeBoundingSphere();
      for(const [mesh,records,low] of canopies){records.forEach(([x,z,h,w,a,seed],i)=>{
        pose.position.set(x,ground(x,z)+(low?0:h*.44),z);pose.rotation.y=a;
        const width=low?h*(.9+.35*w):12.4+w*5.1+3.8*rand(seed+145);pose.scale.set(width,h*(low?1:.56),width*.98);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);});
        mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}
      hero.position.y=ground(0,0)+.07;for(const o of copies)o.position.y=ground(o.position.x,o.position.z)+.05;
    };
  }
  function lotus(T,k){
    const pos=[0,.014,0],colors=[.13,.27,.09],idx=[];
    for(let i=0;i<=18;i++){const a=.08+i/18*(Math.PI*2-.16),r=.26*(1+.032*Math.sin(5*a));
      pos.push(r*Math.sin(a),.022+.019*Math.sin(a)*Math.cos(4*a),r*Math.cos(a));colors.push(.20+.03*Math.sin(a),.37+.04*Math.cos(a),.14);
      if(i>0)idx.push(0,i,i+1);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(idx);g.computeVertexNormals();
    const records=[];
    for(let i=0;i<2700;i++){
      const near=i>=2050,side=near?3:i%4,t=near?.42+.33*rand(i+577):rand(i+577);
      const wave=.48+.45*Math.sin(t*31+side)*Math.cos(t*8.1-side);
      const inland=-(1.2+(near?9.8:1.5+(side===1?41:14)*wave)*rand(i+124));
      const [x,z]=fromBank(side,t,inland);records.push([x,z,.03+rand(i+978)*.11,.58+rand(i+301)*.94,rand(i+27)*6.28]);
    }
    const mesh=new T.InstancedMesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.86,side:T.DoubleSide}),records.length);
    mesh.name='Lá sen ven Ao Bà Om';k.group.add(mesh);
    const podPos=[],podIdx=[],podCol=[],rings=[[0,.012],[.38,.012],[.42,.023],[.52,.090],[.546,.076],[.55,0]];
    for(const [j,[y,r]] of rings.entries())for(let n=0;n<=8;n++){
      const a=n/8*Math.PI*2;podPos.push(.11*y+r*Math.sin(a),y,r*Math.cos(a));podCol.push(.142,.096,.053);
      const b=j*9+n;if(n<8&&j+1<rings.length)podIdx.push(b,b+1,b+9,b+1,b+10,b+9);
    }
    const pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(podPos,3));pg.setAttribute('color',new T.Float32BufferAttribute(podCol,3));pg.setIndex(podIdx);pg.computeVertexNormals();
    const pods=new T.InstancedMesh(pg,new T.MeshLambertMaterial({vertexColors:true}),Math.ceil(records.length/9));
    pods.name='Cuống và gương sen khô';k.group.add(pods);const pose=new T.Object3D();
    let pending;
    function settle(water){
      records.forEach(([x,z,h,s,a],i)=>{
        const y=water(x,z);
        pose.position.set(x,y+h,z);pose.rotation.set(.07*Math.sin(a),a,.08*Math.cos(a));pose.scale.setScalar(s);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
        if(i%9===0){
          pose.position.set(x-.32,y-.06,z+.27);pose.rotation.set(.17*Math.sin(a),a,.23*Math.cos(a));pose.scale.setScalar(.76+s*.28);pose.updateMatrix();pods.setMatrixAt(i/9,pose.matrix);
        }
      });
      for(const m of [mesh,pods]){m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();}
    }
    mesh.onBeforeRender=pods.onBeforeRender=()=>{
      if(!pending||typeof roads==='undefined'||typeof gfx==='undefined')return;
      const p=roads.point(lon,lat),water=gfx.waterAt(p.x+centre[0],p.z+centre[1]);
      if(!water)return;
      const base=k.group.position.y;
      settle((x,z)=>(gfx.waterAt(p.x+x,p.z+z)?.level??water.level)-base);
      pending=false;
    };
    return ground=>{const stage=ground(...centre);settle(()=>stage);pending=true;};
  }
  function build(T,k){
    const loader=new T.TextureLoader();
    function load(name){const tex=loader.load('sight-imagery/'+name+'.webp');tex.colorSpace=T.SRGBColorSpace;
      tex.wrapS=tex.wrapT=T.MirroredRepeatWrapping;tex.anisotropy=4;return tex;}
    const bark=barkMaterial(T,load('ao-ba-om-vo-cay')),hero=rootedTree(T,bark);k.group.add(hero);
    const fitGrove=grove(T,k,bark,hero),fitBanks=sandyBanks(T,k,load('ao-ba-om-nen-cat')),fitLotus=lotus(T,k);
    k.group.userData.fitGround=g=>{fitGrove(g);fitBanks(g);fitLotus(g);};
  }
  function reserve(x,z,r){
    // Remove generic roadside stalls and trees only inside the surveyed grove.
    return coast.every((a,i)=>{const e=edge(i,0);return (x-a[0])*e.nx+(z-a[1])*e.nz<43+r;});
  }
  (window.VietnamSights??=[]).push({id,catalogId,name:'Ao Bà Om – gò cát và rừng cây cổ thụ',kind:'Hồ',city:'Nguyệt Hóa',locality:'Ao Vuông, Trà Vinh',
    province:'Vĩnh Long',formerProvince:'Trà Vinh',region:'Nam Bộ',lon,lat,start,yaw:0,width:8,depth:7,gardenRadius:4,solids:[],reserve,viewDistance:1150,
    source,photo:photo(25228817),map:'https://www.openstreetmap.org/way/76041615',visitOnArrival:true,mappedEntrance:true,views,
    description:'Ao Bà Om, còn gọi là Ao Vuông, là danh lam thắng cảnh quốc gia ở phường Nguyệt Hóa. Gò cát quanh ao có nhiều cây sao, dầu với bộ rễ trồi lên mặt đất. Đường bờ theo bản đồ. Vị trí từng cây, độ cao tán và mảng sen được ước theo ảnh tư liệu.',
    arrivalNote:'Xe dừng ở đường vào phía đông Ao Bà Om. Góc đi bộ đưa đến gò cát và rừng cây ven nước.',build});
})();
