'use strict';
(()=>{
  const sights=window.VietnamSights??=[],A=window.CentralArch,park='https://tramchim.net.vn/';
  const ticketArticle=park+'thong-tin-chi-tiet-hoat-djong-trekking-dji-giua-mua-sen-tram-chi-b98.html';
  const tour=park+'chuong-trinh-tham-quan-tour-binh-minh-tram-chim-b79.html';
  // OSM n12647719811 at the junction of ĐT843 and the car park driveway w1365751045.
  // Projected 0.34 m onto the game's surveyed road edge 3562971.
  const parking=[105.55707071,10.68193993];
  const tau=Math.PI*2,wood=0x786446,rail=0x987f5c,thatch=0x88775a,steel=0x367e77;
  const townArrival='Xe dừng ở lối vào bãi xe khu đón khách, chỗ đường nhánh gặp ĐT843.';
  function stop(node,data,shots,build){
    const id='osm-node-'+node;
    sights.push({id,catalogId:id,province:'Đồng Tháp',city:'Tràm Chim',region:'Nam Bộ',locality:'Vườn quốc gia Tràm Chim',
      ...data,yaw:0,source:data.source??tour,photo:data.photo??data.source??tour,map:'https://www.openstreetmap.org/node/'+node,
      start:parking,mappedEntrance:true,visitOnArrival:true,solids:data.solids??[],build,
      views:shots.map(([name,x,z,height,viewRadius,viewAngle,viewElevation])=>({name,offset:[x,z],height,viewRadius,viewAngle,viewElevation}))});
  }
  function beam(T,k,c,a,b,r){A.strut(T,k,c,...a,...b,r);}
  function seed(i){const n=Math.sin(i*93.735+2.4)*18341.322;return n-Math.floor(n);}
  function post(k,c,x,z,low,high,r){k.stamp(k.round,c,x,(low+high)/2,z,r,high-low,r);}
  function thatchedRoof(T,k,x,y,z,w,d,h){
    k.palette({thatch},true);
    A.gabledRoof(T,k,x,y,z,w,d,h,thatch,0x776347,{overhang:.14,thick:.22});
    for(const side of [-1,1])for(let i=0;i<Math.ceil(d*3);i++){
      const yy=.13+seed(i)*.16;
      k.box(i%3?thatch:0x9b8969,x+side*(w*.5+.08),y-yy*.5,z+(i+.5)*d/Math.ceil(d*3)-d*.5,.17,yy,.32);
    }
  }
  // Cross-sections clipped from canal multipolygon OSM r17281102, including its islands.
  // The general water tile retains the distant lakes. These sections restore the narrow public waterfronts.
  const quayChannel=[[-185,-48,13],[-145,-44.6,16.6],[-130,-60.9,14.9],[-116,-46.8,13.3],[-100,-46.8,11.5],[-85,-49.7,9.8],[-76,-109.6,8.8],[-65,-109,7.6],[-45,-106,5.3],[-22,-116.8,2.7],[0,-114.5,0],[20,-68.3,-2.8],[44,-70.4,-6.2],[70,-72.7,-9.8],[94,-75.1,-13.2],[118,-77.6,-16.5],[145,-80.4,-20.3]];
  const c4Channel=[[-180,-70.8,-37.5],[-153,-67.1,-33.5],[-117,-62.3,-28.3],[-80,-57.3,-23],[-48,-53,-18.4],[-10,-47.8,-12.9],[0,-46.5,-11.5],[20,-43.3,-7.9],[40,-39.1,-3.5],[60,-34.9,.8],[85,-32,6.2],[110,-28,10],[136,-24,10.7],[154,-23,13.5],[180,-21,17.6]];
  function banks(rows,v){
    let j=1;while(j<rows.length-1&&v>rows[j][0])j++;
    const a=rows[j-1],b=rows[j],t=Math.max(0,Math.min(1,(v-a[0])/(b[0]-a[0])));
    return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  }
  function onChannel(rows,alongX,x,z,p){
    const v=alongX?x:z,u=alongX?z:x;
    if(v<rows[0][0]-p||v>rows.at(-1)[0]+p)return false;
    const [lo,hi]=banks(rows,v);return u>lo-p&&u<hi+p;
  }
  // A height callback receives the terrain relative to the active landmark.
  // Fit channel samples and stems independently, leaving huts, stairs and boat hulls rigid.
  function floodplain(T,k){
    const surfaces=[],stems=[],structures=[];
    function piece(x,z,yaw,fn){
      const start=k.vertexCount(),children=k.place(x,z,yaw,fn);
      structures.push({x,z,start,end:k.vertexCount(),children,ys:children.map(m=>m.position.y)});
    }
    function canal(rows,alongX){
      const pts=[],uv=[],colors=[],indices=[],tint=new T.Color();
      const samples=rows.flatMap((r,i)=>i?Array.from({length:Math.ceil((r[0]-rows[i-1][0])/7)},(_,j)=>rows[i-1][0]+(r[0]-rows[i-1][0])*(j+1)/Math.ceil((r[0]-rows[i-1][0])/7)):[r[0]]);
      for(let i=0;i<samples.length;i++){
        const v=samples[i],[lo,hi]=banks(rows,v);
        for(let j=0;j<=8;j++){
          const u=lo+(hi-lo)*j/8,x=alongX?v:u,z=alongX?u:v,idx=pts.length/3;
          pts.push(x,.14,z);uv.push(x,z);
          tint.setHex(j===0||j===8?0x606342:j===1||j===7?0x526447:0x465e50);
          colors.push(tint.r,tint.g,tint.b);
          if(i&&j)indices.push(idx-10,idx-1,idx,idx-10,idx,idx-9);
        }
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
      const m=new T.MeshPhongMaterial({vertexColors:true,side:T.DoubleSide,specular:0x455749,shininess:25});
      const clock={value:0},quiet=matchMedia('(prefers-reduced-motion: reduce)');
      m.onBeforeRender=()=>{clock.value=quiet.matches?0:(performance.now()%900000)*.001;};
      m.onBeforeCompile=s=>{
        s.uniforms.canaltime=clock;
        s.vertexShader='varying vec2 canalXZ;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncanalXZ=position.xz;');
        s.fragmentShader='varying vec2 canalXZ; uniform float canaltime;\n'+s.fragmentShader.replace('#include <color_fragment>',
          '#include <color_fragment>\nvec2 p=canalXZ;float phase=p.y*4.6+p.x*.9+1.8*sin(p.x*.52+p.y*.27)+canaltime*1.8;float crest=pow(max(0.,sin(phase)),8.)*(1.-smoothstep(.18,1.45,fwidth(phase)));float patch=.24+.76*pow(.5+.5*sin(p.x*1.26+p.y*.38+sin(p.y*.87)),3.);diffuseColor.rgb+=vec3(.022,.033,.028)*crest*patch;');
      };
      const mesh=new T.Mesh(g,m);mesh.receiveShadow=true;k.group.add(mesh);surfaces.push([g,.14]);
    }
    function paving(ring,tint){
      const s=new T.Shape(ring.map(([x,z])=>new T.Vector2(x,-z))),g=new T.ShapeGeometry(s);g.rotateX(-Math.PI/2);
      const surface=new T.MeshStandardMaterial({color:tint,roughness:1,side:T.DoubleSide});
      surface.onBeforeCompile=s=>{
        s.vertexShader='varying vec2 yardXZ;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nyardXZ=position.xz;');
        s.fragmentShader='varying vec2 yardXZ;\n'+s.fragmentShader.replace('#include <color_fragment>',
          '#include <color_fragment>\nvec2 p=yardXZ*5.;float grit=fract(sin(dot(floor(p),vec2(29.71,87.16)))*17371.41);diffuseColor.rgb*=.88+.12*sin(yardXZ.x*.43+sin(yardXZ.y*.71))+.14*(grit-.5)*(1.-smoothstep(.2,1.4,fwidth(p.x)+fwidth(p.y)));');
      };
      const m=new T.Mesh(g,surface);
      m.receiveShadow=true;k.group.add(m);surfaces.push([g,.10]);
    }
    function wetland(trees,grass){
      const crowns=[],parts=[],pose=new T.Object3D(),up=new T.Vector3(0,1,0);
      for(const [i,[x,z,h]] of trees.entries()){
        const bend=.10*h,angle=i*2.399,dx=bend*Math.cos(angle),dz=bend*Math.sin(angle);
        const fork=[x+dx*.54,h*.43,z+dz*.54];
        parts.push([[x,-.28,z],fork,h*.022,0xbba991]);
        for(let j=0;j<3;j++){
          const a=angle+j*2.33,r=h*(j?.14:.038),end=[x+dx+Math.cos(a)*r,h*(j?.75:.93),z+dz+Math.sin(a)*r];
          parts.push([fork,end,h*(j?.009:.016),j?0xc9c3aa:0xd0c5ab]);
          crowns.push([end[0],end[1],end[2],h*(.15+seed(i+j)*.06),h*(.11+seed(i-j)*.063),h*(.15+seed(i+2*j)*.06),a]);
        }
      }
      if(parts.length){
        const m=new T.InstancedMesh(new T.CylinderGeometry(.76,1,1,7),new T.MeshStandardMaterial({roughness:.98}),parts.length);
        parts.forEach(([a,b,r,color],i)=>{
          const p=new T.Vector3(...a),q=new T.Vector3(...b),delta=q.clone().sub(p);
          pose.position.copy(p).lerp(q,.5);pose.quaternion.setFromUnitVectors(up,delta.clone().normalize());pose.scale.set(r,delta.length(),r);pose.updateMatrix();
          m.setMatrixAt(i,pose.matrix);m.setColorAt(i,new T.Color(color));
        });m.castShadow=m.receiveShadow=true;k.group.add(m);stems.push(m);
        const first=k.group.children.length;globalThis.VietnamForestGiants.crowns(T,k,crowns);stems.push(...k.group.children.slice(first));
      }
      if(grass.length){
        const p=[],col=[],t=new T.Color();
        for(let j=0;j<13;j++){
          const a=j*2.399,dx=Math.cos(a),dz=Math.sin(a),r=.15+.27*seed(j),h=.65+.48*seed(j+10);
          const x=dx*r,z=dz*r,w=.025+seed(j-3)*.027;
          p.push(x-dz*w,0,z+dx*w,x+dz*w,0,z-dx*w,x+dx*.31,h,z+dz*.31);
          for(let i=0;i<3;i++){t.setHex(i===2?0xa5a452:[0x707940,0x758848,0x536d42][j%3]);col.push(t.r,t.g,t.b);}
        }
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.computeVertexNormals();
        const m=new T.InstancedMesh(g,new T.MeshStandardMaterial({side:T.DoubleSide,vertexColors:true,roughness:1}),grass.length);
        grass.forEach(([x,z,h],i)=>{pose.position.set(x,.09,z);pose.rotation.set(0,i*2.4,0);pose.scale.set(h,h,h);pose.updateMatrix();m.setMatrixAt(i,pose.matrix);});
        k.group.add(m);stems.push(m);
      }
    }
    let rest;const originals=new WeakMap();
    k.group.userData.fitGround=ground=>{
      const g=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;
      if(g){
        const p=g.attributes.position;rest??=p.array.slice();
        for(const {x,z,start,end,children,ys} of structures){
          const h=ground(x,z);for(let i=start;i<end;i++)p.setY(i,rest[3*i+1]+h);
          children.forEach((m,i)=>{m.position.y=ys[i]+h;});
        }p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();
      }
      for(const [g,lift] of surfaces){
        const p=g.attributes.position;
        for(let i=0;i<p.count;i++)p.setY(i,ground(p.getX(i),p.getZ(i))+lift);
        p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
      }
      for(const m of stems){
        if(!originals.has(m))originals.set(m,m.instanceMatrix.array.slice());const poses=originals.get(m);
        for(let i=12;i<poses.length;i+=16)m.instanceMatrix.array[i+1]=poses[i+1]+ground(poses[i],poses[i+2]);
        m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
      }
    };
    return {piece,canal,paving,wetland};
  }
  function reedsOnBank(rows,alongX,count,side){
    const out=[];
    for(let i=0;i<count;i++){
      const v=rows[0][0]+seed(i)*(rows.at(-1)[0]-rows[0][0]),[lo,hi]=banks(rows,v),d=seed(i+317)*3.8-.7;
      const u=side?hi+d:lo-d;out.push(alongX?[v,u,.7+.76*seed(i+122)]:[u,v,.7+.76*seed(i+122)]);
    }
    return out;
  }
  function stairs(T,k,a,b,w,mat,handrail){
    const [x,y,z]=a,[xx,yy,zz]=b,l=Math.hypot(xx-x,zz-z),n=Math.ceil(Math.abs(yy-y)/.19),ang=Math.atan2(xx-x,zz-z);
    for(let i=0;i<n;i++){const t=(i+.5)/n;k.box(mat,x+(xx-x)*t,y+(yy-y)*(i+1)/n-.065,z+(zz-z)*t,w,.13,l/n+.025,ang);}
    for(const side of [-1,1]){
      const dx=side*w*.48*Math.cos(ang),dz=-side*w*.48*Math.sin(ang);
      beam(T,k,handrail,[x+dx,y+.94,z+dz],[xx+dx,yy+.94,zz+dz],.044);
      beam(T,k,mat,[x+dx,y-.10,z+dz],[xx+dx,yy-.10,zz+dz],.103);
      for(let j=0;j<=Math.ceil(l/2.2);j++){const t=j/Math.ceil(l/2.2),h=y+(yy-y)*t;post(k,handrail,x+(xx-x)*t+dx,z+(zz-z)*t+dz,h,h+.93,.039);}
    }
  }
  function footbridge(T,k,a,b,w,y){
    const [x,z]=a,[xx,zz]=b,l=Math.hypot(xx-x,zz-z),ang=Math.atan2(xx-x,zz-z);
    k.box(0x8f7962,(x+xx)/2,y-.14,(z+zz)/2,w,.26,l+.02,ang);
    for(const side of [-1,1]){
      const dx=side*w*.48*Math.cos(ang),dz=-side*w*.48*Math.sin(ang);
      for(const h of [.57,1.05])beam(T,k,rail,[x+dx,y+h,z+dz],[xx+dx,y+h,zz+dz],.058);
      const count=Math.ceil(l/2);
      for(let j=0;j<=count;j++){const t=j/count;post(k,wood,x+(xx-x)*t+dx,z+(zz-z)*t+dz,y,y+1.08,.065);}
    }
  }
  stop(12647638907,{name:'Quầy vé Vườn quốc gia Tràm Chim',kind:'Tham quan',lon:105.5572995,lat:10.6820318,width:67,depth:47,
    source:ticketArticle,modeledBuildings:['w1365744090'],solids:[[0,0,2,1.5],[25.1,12.5,6.6,6.6]],gardenRadius:31,
    description:'Cổng có hai trụ gỗ, mái tranh và bảng tên uốn cong. Từ quầy vé nhìn qua cổng có thể thấy nhà đón khách mái tròn nằm trên sân.',
    arrivalNote:townArrival+' Đi theo lối vào khoảng 40 m đến quầy vé.'},
    [['Cổng mái tranh và quầy vé',1,9.1,6.4,19,-1.64,.10],['Nhà mái tròn sau cổng',24.7,12.5,6.3,25,-1.99,.15]],(T,k)=>{
      const f=floodplain(T,k);k.palette({timber:[wood,rail],thatch,plaster:0xd6ceb3});
      f.paving([[-22.1,7.1],[-2,6.5],[4.5,3.5],[10,-6.2],[21,-9],[34,-8.2],[43,-4.8],[48,4],[50,16.5],[47,25],[34,28],[17,28.2],[8.3,22.7],[3.7,15.4],[-22.6,14.2]],0x9b988b);
      f.wetland([[-8.6,-3.1,7.4],[-7.2,-12,8.6],[-5.1,-19,8.2],[-2.4,-13.5,6.6],[1.6,-15.9,9.1],[4.7,-9.8,7.3],[9,-14.4,8.8],[15,-16.8,9.7],[20,-17.5,7.7],[24,-20,8.3],[31,-14.2,7.6],[39,-14.5,8.8],[-7.3,24.6,6.6],[-5.6,30.6,7.8],[2.4,26.9,5.4],[9.7,30.9,8.6],[19.9,33.4,7.6],[27,35.7,9.4],[38.7,32.7,8.5]],[]);
      f.piece(0,10.5,-Math.PI/2,()=>{
        for(const x of [-4.23,4.23]){post(k,wood,x,0,-.2,5.18,.25);for(const side of [-1,1])beam(T,k,wood,[x,3.56,0],[x+side*1.02,4.9,0],.10);}
        k.outline([[-4.0,3.32],[-2.5,3.56],[0,3.67],[2.5,3.56],[4,3.32],[3.9,3.95],[1.8,4.12],[0,4.17],[-1.8,4.12],[-3.9,3.95]],0x755539,0,0,-.10,.20);
        k.sign('VƯỜN QUỐC GIA',0,4.03,.115,3.87,.34,true);k.sign('TRÀM CHIM',0,3.73,.119,6.65,.61,true);
        k.place(0,0,Math.PI/2,()=>thatchedRoof(T,k,0,4.91,0,3.03,11.2,1.03));
        k.box(0x799da1,7,1.76,-.45,3.98,2.79,.15);k.box(0xa7b77b,7,.75,-.36,3.96,.75,.035);
        k.sign('Vườn Quốc Gia',7,2.55,-.36,2.99,.40,true);k.sign('Tràm Chim',7,1.93,-.36,4.12,.76,true);
        for(const x of [-5.5,5.4]){
          k.tapered(0xa26048,x,.34,.72,.36,.59,.52,1,14);
          const p=new T.SphereGeometry(1,8,5);for(let i=0;i<10;i++)k.stamp(p,i%3?0x66894c:0x839b53,x+Math.cos(i*2.4)*.32,.77+seed(i)*.29,.72+Math.sin(i*2.4)*.31,.24,.33,.24);p.dispose();
        }
      });
      f.piece(0,0,-Math.PI/2,()=>{
        for(const x of [-2.13,2.13])for(const z of [-1.16,1.16])post(k,wood,x,z,0,2.93,.105);
        k.box(0xc9c7a5,0,.50,-.27,4.1,1.02,1.61);k.box(wood,0,1.07,-.23,4.28,.15,1.84);
        k.place(0,0,Math.PI/2,()=>thatchedRoof(T,k,0,2.78,0,3.3,5.47,1.04));
        k.box(wood,0,2.25,1.17,2.52,.50,.13);k.sign('QUẦY VÉ',0,2.25,1.25,2.25,.34,true);
      });
      f.piece(25.1,12.5,0,()=>{
        const n=12;for(let i=0;i<n;i++){const a=tau*i/n;post(k,wood,6.6*Math.cos(a),6.6*Math.sin(a),.12,3.52,.16);}
        k.tapered(0xa1927d,0,.13,0,8.9,8.9,.26,1,32);k.tapered(0xd6ceb3,0,1.65,0,3.15,3.15,3.05,1,24);
        for(const [y,base,top,h] of [[3.52,8.85,8.40,.62],[4.39,8.4,6.08,1.12],[5.31,6.10,3.17,.76],[5.92,3.19,1.03,.48],[6.29,1.08,.12,.30]])k.tapered(thatch,0,y,0,base,top,h,1,36);
      });
    });
  stop(12647714579,{name:'Đài quan sát khu đón khách Tràm Chim',kind:'Tháp',lon:105.5567875,lat:10.680716,width:34,depth:30,
    source:'https://ussh.vnu.edu.vn/uploads/ussh/dao-tao/2026_01/phung-anh-kien-la2.pdf',photo:'https://daidoanket.vn/tram-chim-10183553.html',
    gardenRadius:23,solids:[[-2.2,-2.2,.25,.25],[2.2,-2.2,.25,.25],[-2.2,2.2,.25,.25],[2.2,2.2,.25,.25]],
    description:'Bốn chân thép xanh đỡ sàn ngắm cảnh tròn. Vành sàn màu vàng cam ôm lấy chóp trắng hình trứng. Ngay phía nam tháp, cầu đi bộ bắc qua ĐT843.',
    arrivalNote:townArrival+' Theo lối đi bộ trong khu đón khách rồi qua cầu vượt, khoảng 220 m đến đài bên kênh.'},
    [['Tháp hình trứng bên bờ kênh',0,0,30,51,-1.91,.12],['Vành sàn và khung cầu thang',0,0,43.5,25,.94,.07],['Cầu đi bộ qua đường tỉnh',18,8.5,10,33,.17,.22]],(T,k)=>{
      const gray=0x7f908a,gold=0xdc9a3e;k.palette({metal:[steel,gray,gold],timber:[rail,wood]});
      k.box(0xb1ad98,.35,.18,.15,6.1,.44,5.8);
      for(const x of [-2.22,2.22])for(const z of [-2.22,2.22]){
        k.box(0xa9a79b,x,.16,z,.92,.45,.92);post(k,steel,x,z,.25,19.1,.142);
      }
      for(let j=0;j<5;j++){
        const y=1.1+3.49*j,y2=y+3.49;
        for(const s of [-1,1]){
          beam(T,k,steel,[-2.22,y,s*2.22],[2.22,y2,s*2.22],.066);
          beam(T,k,steel,[s*2.22,y,-2.22],[s*2.22,y2,2.22],.066);
          k.box(steel,0,y2,s*2.22,4.52,.15,.13);k.box(steel,s*2.22,y2,0,.13,.15,4.52);
        }
        const s=j%2?-1:1;
        stairs(T,k,[-s*1.23,y,-s*1.8],[s*1.23,y+1.745,s*1.8],.87,gray,steel);
        stairs(T,k,[s*1.57,y+1.745,s*1.8],[-s*1.57,y2,-s*1.8],.87,gray,steel);
        k.box(gray,0,y-.07,-s*1.83,3.87,.16,1.03);k.box(gray,s*1.34,y+1.67,s*1.82,1.56,.16,.92);
      }
      k.tapered(0x315c54,0,18.81,0,2.96,4.43,.73,1,40);
      k.tapered(gold,0,19.53,0,4.41,4.53,.76,1,40);k.tapered(0xe0a149,0,20.07,0,4.53,4.02,.32,1,40);
      const roof=new T.LatheGeometry([new T.Vector2(2.38,20.10),new T.Vector2(2.36,20.84),new T.Vector2(2.13,22.03),new T.Vector2(1.70,23.16),new T.Vector2(1.08,24.01),new T.Vector2(.48,24.43),new T.Vector2(.03,24.5)],36);
      k.stamp(roof,0xe7e5d6,0,0,0);roof.dispose();
      for(let i=0;i<10;i++){
        const a=i*tau/10,r=2.34;
        k.box(0x455653,r*Math.sin(a),20.61,r*Math.cos(a),.61,.65,.10,a);
      }
      const high=5.04;
      footbridge(T,k,[2.28,6.88],[6.02,7.09],2.15,high);
      footbridge(T,k,[6.02,7.09],[30.67,8.55],2.15,high);
      stairs(T,k,[4.91,.16,22.02],[6.02,high,7.09],2.13,0xa39c87,rail);
      stairs(T,k,[32.43,.85,-.87],[30.67,high,8.55],2.13,0xa39c87,rail);
      for(const [x,z] of [[6.02,7.09],[30.67,8.55]])k.box(0xb6b3a2,x,2.46,z,.48,4.96,2.22);
      for(const [a,b] of [[[32.43,-.87],[33.69,-5.76]],[[33.69,-5.76],[49.24,-4.67]],[[49.24,-4.67],[51.22,-22.15]]])footbridge(T,k,a,b,1.81,.85);
    });
  function skiff(T,k,len,width,covered,tone){
    const rows=[[-.50,.02,.78],[-.45,.45,.57],[-.32,.88,.51],[-.12,1,.49],[.24,.97,.49],[.42,.78,.54],[.49,.35,.66]],v=[],idx=[];
    for(const [z,w,h] of rows){
      const half=w*width/2;
      for(const [x,y] of [[-half,h],[-half*.78,.14],[0,-.02],[half*.78,.14],[half,h]])v.push(x,y,z*len);
    }
    for(let j=1;j<rows.length;j++)for(let i=0;i<4;i++){const n=j*5+i;idx.push(n-5,n,n-4,n,n+1,n-4);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();
    // An open gunwale and separate seats leave the occupants' well visible.
    const hull=new T.Mesh(g,new T.MeshStandardMaterial({color:tone,side:T.DoubleSide,roughness:.68}));k.group.add(hull);
    for(const side of [-1,1])for(let i=1;i<rows.length;i++){
      const [a,w,h]=rows[i-1],[b,ww,hh]=rows[i];beam(T,k,0x96bebc,[side*w*width*.5,h,a*len],[side*ww*width*.5,hh,b*len],.044);
    }
    k.box(0x617778,0,.20,0,width*.65,.09,len*.68);
    for(let j=0;j<6;j++)k.box(0xa1774e,0,.49,(j-2.5)*len*.113,width*.83,.11,.25);
    if(covered){
      for(const x of [-width*.42,width*.42])for(const z of [-len*.33,0,len*.33])post(k,0x81968f,x,z,.43,2.02,.036);
      const profile=[[-width*.53,0],[-width*.43,.18],[-width*.21,.29],[0,.32],[width*.21,.29],[width*.43,.18],[width*.53,0],[width*.49,-.05],[0,.23],[-width*.49,-.05]];
      k.outline(profile,0x83a69a,0,2.03,-len*.378,len*.756);
    }
  }
  function dock(T,k,len,w){
    k.box(wood,0,.79,0,w,.28,len);
    for(let j=0;j<Math.ceil(len/.29);j++)k.box(j%5?0xaf9472:rail,0,.947,-len/2+(j+.5)*len/Math.ceil(len/.29),w-.03,.045,len/Math.ceil(len/.29)-.024);
    for(const x of [-w*.42,w*.42])for(let j=0;j<=Math.ceil(len/2.6);j++)post(k,wood,x,-len/2+j*len/Math.ceil(len/2.6),-.42,1.02,.093);
  }
  stop(12647715610,{name:'Bến xuồng Tràm Chim',kind:'Bến tàu',lon:105.5567336,lat:10.6801238,width:42,depth:58,
    source:'https://dulich.dongthap.gov.vn/vi/detailnews/?id=news_956&t=update',gardenRadius:32,
    reserve:(x,z,p)=>Math.abs(x-1)<10+p&&Math.abs(z)<34+p||onChannel(quayChannel,false,x,z,p),
    description:'Cầu ván ngắn đưa khách từ bờ đông ra những chiếc xuồng dài. Dọc mạn xuồng có hàng ghế ngang, vài chiếc mắc mái che nhẹ. Bên kia lòng kênh là bờ cỏ và tràm thấp.',
    arrivalNote:townArrival+' Theo lối đi bộ qua cầu vượt, rồi men theo bờ kênh, khoảng 270 m đến bến xuồng.'},
    [['Mũi xuồng bên cầu ván',-5,-1,5.4,20,-.63,.21],['Từ mặt kênh nhìn vào bến',-5,1,5.6,28,-1.49,.13],['Dọc lòng kênh Tràm Chim',-24,-14,9.0,49,-.27,.24]],(T,k)=>{
      const f=floodplain(T,k);k.palette({timber:[wood,rail,0xaf9472]});f.canal(quayChannel,false);
      f.piece(1.45,.21,-.13,()=>dock(T,k,21,2.35));
      f.piece(-4.23,2.12,Math.PI/2-.11,()=>dock(T,k,9.9,1.73));
      for(const [x,z,a,len,w,cover,c] of [[-12,3,-.18,8.6,1.67,true,0x457c91],[-8.9,-5,-.12,7.4,1.44,false,0x377894],[-3.6,-13,-.10,9.4,1.75,true,0x486f80],[-3.8,12.8,-.11,8.5,1.63,false,0x5b8a98]]){
        f.piece(x,z,a,()=>skiff(T,k,len,w,cover,c));
      }
      const trees=[];
      for(let i=0;i<52;i++){
        const z=-116+seed(i)*237,[lo]=banks(quayChannel,z);
        trees.push([lo-2.6-seed(i+92)*19,z,5.4+seed(i+377)*6.9]);
      }
      for(const [x,z,h] of [[4,-.7,6.8],[4.9,-14,8.7],[5.1,-19,7.4],[6.4,-29,9.4],[2.9,18.4,8.4],[-1,28,7.2]])trees.push([x,z,h]);
      f.wetland(trees,reedsOnBank(quayChannel,false,670,false));
    });
  const c4Arrival=townArrival+' Đi bộ khoảng 270 m qua cầu vượt đến bến khách rồi đi xuồng vào khu A1 tới C4.';
  stop(4416131389,{name:'Trạm dừng chân C4 – Tràm Chim',kind:'Tham quan',lon:105.522492,lat:10.6818875,width:58,depth:42,
    source:ticketArticle,photo:tour,gardenRadius:34,
    reserve:(x,z,p)=>Math.abs(x)<28+p&&Math.abs(z)<16+p||onChannel(c4Channel,true,x,z,p),
    description:'Trạm C4 nằm trên tuyến đê số 1, khu A1. Một bên đê là kênh dẫn xuồng vào Vườn. Bờ đối diện có vạt tràm thấp, thân sáng và cỏ mọc sát mép nước.',
    arrivalNote:c4Arrival},
    [['Bờ đê ở điểm dừng C4',0,0,5.1,17,-.58,.16],['Qua kênh nhìn rặng tràm',-11,-45,10,37,.29,.15],['Lòng kênh men theo đê',16,-23,13,52,-1.34,.29]],(T,k)=>{
      const f=floodplain(T,k);f.canal(c4Channel,true);k.palette({timber:[wood,rail]});
      f.paving([[-5.3,-1.25],[-1.3,-1.77],[4.5,-1],[5.5,1.7],[4.4,3.4],[-5.3,2.4]],0xb6aa90);
      f.piece(0,0,.17,()=>{
        for(const x of [-1.08,1.08])post(k,wood,x,0,-.13,2.29,.12);
        k.box(0x536548,0,1.80,0,2.45,.85,.115);k.sign('ĐIỂM DỪNG C4',0,1.80,.078,2.29,.42,true);
        for(const side of [-1,1]){k.box(rail,side*2.92,.52,1.12,1.86,.11,.45);for(const u of [-.65,.65])k.box(wood,side*2.92+u,.24,1.12,.13,.49,.37);}
      });
      const trees=[];
      for(let i=0;i<183;i++){
        const x=-173+seed(i)*341,[low]=banks(c4Channel,x),z=low-2.4-seed(i+743)*51;
        trees.push([x,z,5.8+seed(i+29)*7.2]);
      }
      for(let i=0;i<55;i++){
        const x=-144+seed(i+183)*215,[,high]=banks(c4Channel,x),z=high+2.6+seed(i+20)*2.3;
        if(Math.abs(x)>9)trees.push([x,z,5.2+seed(i+7)*5.7]);
      }
      f.wetland(trees,[...reedsOnBank(c4Channel,true,950,false),...reedsOnBank(c4Channel,true,430,true)]);
    });
  stop(12647689080,{name:'Đài quan sát C4 – Tràm Chim',kind:'Tháp',lon:105.5232779,lat:10.6817167,width:25,depth:24,
    source:tour,gardenRadius:17,solids:[[-2.18,-2.18,.25,.25],[2.18,-2.18,.25,.25],[-2.18,2.18,.25,.25],[2.18,2.18,.25,.25]],
    description:'Từ sàn cao khoảng 15 m ở C4 có thể nhìn qua rừng tràm và các nhánh kênh khu A1. Đài khung bê tông nằm cạnh đường đê, gần cống điều tiết nước.',
    arrivalNote:c4Arrival+' Đài nằm phía đông điểm dừng chân.'},
    [['Đài bên đường đê khu A1',0,0,24.5,41,-1.98,.21],['Sàn ngắm cảnh và mái che',0,0,35.6,19,.45,.10],['Từ cao nhìn xuống rừng tràm',-16,-32,14,39,.40,.42]],(T,k)=>{
      const cream=0xbab9a4,dark=0x718277,roof=0xa76444;
      k.palette({plaster:cream,metal:dark,tile:roof});
      k.place(0,0,-.15,()=>{
        for(const x of [-2.18,2.18])for(const z of [-2.18,2.18]){
          k.box(0x929487,x,.22,z,.82,.6,.82);k.box(cream,x,8.83,z,.35,17.66,.35);
        }
        for(let j=0;j<5;j++){
          const y=j*3+.18;
          k.box(cream,0,y,-1.55,4.7,.23,1.43);
          k.box(cream,0,y+1.5,1.56,4.7,.23,1.43);
          stairs(T,k,[-.98,y+.13,-1.00],[-.98,y+1.63,1.03],1.20,cream,dark);
          stairs(T,k,[.98,y+1.63,1.03],[.98,y+3.13,-1.00],1.20,cream,dark);
          for(const side of [-1,1])k.box(cream,side*2.18,y,-.02,.31,.32,4.52);
        }
        k.box(cream,0,15.1,0,5.58,.30,5.59);
        for(const s of [-1,1]){
          for(const y of [15.68,16.27]){k.box(dark,s*2.66,y,0,.085,.085,5.32);k.box(dark,0,y,s*2.66,5.32,.085,.085);}
          for(let j=-2;j<=2;j++){post(k,dark,s*2.66,j,15.19,16.30,.046);post(k,dark,j,s*2.66,15.19,16.30,.046);}
        }
        k.tapered(cream,0,17.61,0,4.5,4.5,.26,1,4);k.tapered(roof,0,18.57,0,4.68,.47,1.83,1,4);
      });
    });
})();
