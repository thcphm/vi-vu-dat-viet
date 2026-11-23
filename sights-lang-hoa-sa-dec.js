'use strict';
(() => {
  // Survey 2026-11-22. n13518302230 is a visitor's marker for the flower
  // garden, not the position of an individual bed. VNPT's public scene 18
  // (folder lhsd-canh-20-30m) records 105.74606556 E, 10.31846083 N above
  // the lotus footbridge. This parcel is on the opposite, eastern side
  // of the net strip. Its beds, gaps and service path are traced from the
  // nadir and right faces projected onto a horizontal ground plane.
  // https://vr3d.com.vn/dongthap/langhoasadec/tour.xml
  // The shade house and parcel axes were checked against Esri World Imagery.
  // Estimated registration: 18 m above the field, 1 degree east of north;
  // 20.7 m east of the source camera to the workers' umbrella. The scale,
  // water level and individual pot spacings are approximate. No source
  // panorama pixels are included in the materials, geometry or preview.
  // The province documents pots standing on stakes over shallow water:
  const source='https://dongthap.gov.vn/web/cong-thong-tin-dtp/tin-tuc/chi-tiet?id=5907451';
  const photo='https://vr3d.com.vn/dongthap/langhoasadec/';
  const catalogId='osm-node-13518302230',id='lang-hoa-sa-dec';
  const pin=window.VietnamTourism.entries.find(s=>s.id===catalogId);
  const yaw=-34*Math.PI/180,cs=Math.cos(yaw),sn=Math.sin(yaw),pi2=Math.PI*2;
  const wetEarth=0x70674a,bankEarth=0x8d805e,dryEarth=0x9e8c72,sill=0x897453,straw=0xb7a47a,bamboo=0xb2a183;
  const species={
    silver:{pot:.128,h:.230,pitch:.325,rows:3,spread:.245,height:.52,leaf:0xa3b197},
    lime:{pot:.093,h:.165,pitch:.225,rows:5,spread:.173,height:.32,leaf:0xa6bd52},
    green:{pot:.104,h:.186,pitch:.249,rows:4,spread:.177,height:.32,leaf:0x679947},
    young:{pot:.083,h:.149,pitch:.192,rows:5,spread:.110,height:.177,leaf:0x7c8c51},
    shoots:{pot:.081,h:.147,pitch:.194,rows:5,spread:.072,height:.118,leaf:0x8c805b}
  };
  // Rows are in order across the field; bands are fractions along each
  // rack. The open slats, shorter runs and nursery colour changes appear
  // in the VNPT survey. There are no plotted boats in this parcel.
  const leftRows=[
    [-15.04,'silver'],[-13.48,'silver'],[-11.86,'silver'],[-10.32,'silver'],
    [-8.52,'shoots'],[-6.93,'shoots'],[-5.22,[[.58,'lime'],[.77,'shoots'],[1,'bare']]],
    [-3.78,[[.62,'lime'],[1,'young']]],[-2.23,'young'],[-.56,[[.68,'green'],[1,'lime']]],
    [1.12,'green'],[2.57,'shoots'],[4.04,'lime'],[5.64,'lime'],
    [7.16,[[.77,'shoots'],[1,'bare']]],[8.66,[[.59,'green'],[.73,'bare'],[1,'green']]]
  ];
  const rightRows=[
    [-15.06,'silver'],[-13.49,'silver'],[-11.91,'silver'],[-10.07,[[.57,'young'],[1,'silver']]],
    [-8.26,'shoots'],[-6.69,'shoots'],[-5.08,'shoots'],[-3.49,[[.48,'shoots'],[1,'lime']]],
    [-1.94,'lime'],[-.38,[[.31,'young'],[.44,'shoots'],[.61,'lime'],[1,'green']]],
    [1.17,[[.58,'shoots'],[1,'young']]],[2.65,[[.18,'green'],[1,'silver']]],
    [4.20,'silver'],[5.72,[[.22,'bare'],[1,'silver']]],[7.17,'young']
  ];
  function rand(x,z,n=0){const a=Math.sin(x*128.27+z*37.51+n*55.743)*43758.36;return a-Math.floor(a);}
  function shot(name,x,z,height,viewRadius,angle,viewElevation){return {
    name,offset:[x*cs+z*sn,-x*sn+z*cs],height,viewRadius,viewAngle:yaw+angle,viewElevation,viewBase:'monument'
  };}
  function bufferMesh(T,k,positions,colors,indices,material){
    const geom=new T.BufferGeometry();
    geom.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    if(colors.length)geom.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    geom.setIndex(indices);geom.computeVertexNormals();
    const mesh=new T.Mesh(geom,material);mesh.receiveShadow=true;k.group.add(mesh);return mesh;
  }
  function skin(T,p,i,c,n){
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));
    g.setIndex(i);g.computeVertexNormals();g.name=n;return g;
  }
  function potGeometry(T,detail){
    const p=[],i=[],c=[],n=[9,7,5][detail];
    const rings=detail>0?[[0,.70,0x393a35],[.94,1,0x4e5047],[1,.92,0x616359]]:
      [[0,.69,0x393a35],[.075,.72,0x494940],[.82,.97,0x505049],[.90,1.01,0x373b3c],[.98,1.035,0x595a4f],[1,.93,0x656257],[.90,.86,0x373c33]];
    for(const [y,r,tint] of rings)for(let q=0;q<n;q++){
      const a=q*pi2/n;p.push(Math.cos(a)*r,y,Math.sin(a)*r);c.push(...new T.Color(tint).toArray());
    }
    for(let s=0;s<rings.length-1;s++)for(let q=0;q<n;q++){
      const a=s*n+q,b=s*n+(q+1)%n;i.push(a,a+n,b,b,a+n,b+n);
    }
    const base=p.length/3,inner=(rings.length-1)*n;p.push(0,.89,0);c.push(...new T.Color(0x705947).toArray());
    for(let q=0;q<n;q++)i.push(base,inner+(q+1)%n,inner+q);
    return skin(T,p,i,c,'Bầu ươm và vành chậu');
  }
  function plantGeometry(T,kind,detail){
    const spec=species[kind],p=[],col=[],idx=[],tint=new T.Color(spec.leaf);
    function point(x,y,z,light){
      p.push(x,y,z);col.push(...tint.clone().multiplyScalar(light).toArray());return p.length/3-1;
    }
    const silver=kind==='silver',young=kind==='young'||kind==='shoots';
    const shoots=(silver?[12,8,5]:young?[4,3,2]:[9,6,4])[detail];
    const tiers=(silver?[4,2,1]:young?[2,1,1]:[3,2,1])[detail];
    const compact=detail>0,leafScale=[1,1.16,1.38][detail];
    for(let n=0;n<shoots;n++){
      const a=n*2.39996+.28*Math.sin(n*1.73),ux=Math.cos(a),uz=Math.sin(a);
      const q=rand(n,2),rad=.18+.62*Math.sqrt((n+.5)/shoots),up=.44+.51*(1-.68*rad)+.10*q;
      const root=[.10*ux*rad,0,.10*uz*rad],tip=[rad*ux,up,rad*uz];
      const stem=[point(root[0]-.014*uz,0,root[2]+.014*ux,.52),point(root[0]+.014*uz,0,root[2]-.014*ux,.61),
        point(tip[0]+.008*uz,up,tip[2]-.008*ux,.79),point(tip[0]-.008*uz,up,tip[2]+.008*ux,.70)];
      idx.push(stem[0],stem[1],stem[2],stem[0],stem[2],stem[3]);
      for(let j=0;j<tiers;j++)for(const sign of [-1,1]){
        const t=.26+.68*(j+.20*(sign+1))/tiers,side=sign*(.84+.39*rand(n,j,sign)),az=a+side;
        const vx=Math.cos(az),vz=Math.sin(az),ox=root[0]+(tip[0]-root[0])*t,oz=root[2]+(tip[2]-root[2])*t,oy=tip[1]*t;
        const l=(silver?.32:young?.57:.47)*(.80+.28*q)*leafScale;
        const w=l*(silver?.16:kind==='lime'?.24:.31)*(compact?1.62:1),lift=silver?.086:young?.16:.077;
        const start=point(ox,oy,oz,.70+.18*t);
        const left=point(ox+vx*l*.47-vz*w,oy+lift*.64,oz+vz*l*.47+vx*w,.77+.22*q);
        const right=point(ox+vx*l*.47+vz*w,oy+lift*.62,oz+vz*l*.47-vx*w,1.00+.11*q);
        const end=point(ox+vx*l,oy+lift*(silver?.83:.33),oz+vz*l,1.03+.08*q);
        if(compact)idx.push(start,right,left,left,right,end);
        else{
          const m=point(ox+vx*l*.47,oy+lift,oz+vz*l*.47,1.12);
          const nearTip=point(ox+vx*l*.78-vz*w*.68,oy+lift*.84,oz+vz*l*.78+vx*w*.68,.98);
          idx.push(start,m,left,start,right,m,m,nearTip,left,m,end,nearTip,m,right,end);
        }
      }
    }
    return skin(T,p,idx,col,'Cụm lá '+kind);
  }
  function instances(T,geometry,material,rows,cx,cz){
    const mesh=new T.InstancedMesh(geometry,material,rows.length),pose=new T.Object3D(),color=new T.Color();
    for(let i=0;i<rows.length;i++){
      const [x,y,z,w,h,d,ry,f]=rows[i];pose.position.set(x-cx,y,z-cz);pose.rotation.set(0,ry,0);pose.scale.set(w,h,d);pose.updateMatrix();
      mesh.setMatrixAt(i,pose.matrix);color.setRGB(f,f*.988,f*.958);mesh.setColorAt(i,color);
    }
    mesh.receiveShadow=true;mesh.castShadow=true;mesh.computeBoundingSphere();return mesh;
  }
  function plantsByDistance(T,group,type,rows,material,touch){
    const geometry=detail=>type==='pots'?potGeometry(T,detail):plantGeometry(T,type,detail);
    const near=geometry(0),far=geometry(touch?2:1),cells=new Map();
    for(const row of rows){
      const ix=Math.floor((row[0]+15.5)/8),iz=Math.floor((row[2]+16.8)/9),key=ix+':'+iz;
      let cell=cells.get(key);if(!cell){cell={x:(ix+.5)*8-15.5,z:(iz+.5)*9-16.8,rows:[]};cells.set(key,cell);}
      cell.rows.push(row);
    }
    for(const {x,z,rows:plants} of cells.values()){
      const lod=new T.LOD();lod.position.set(x,0,z);
      lod.addLevel(instances(T,near,material,plants,x,z),0);lod.addLevel(instances(T,far,material,plants,x,z),touch?7:11.5,.10);group.add(lod);
    }
  }
  function distantBeds(T,bands,material){
    // From the approach road the pots read as dark strips under the foliage.
    // Keep their photographed colour changes and empty stretches on each rack.
    const positions=[],colours=[],indices=[];
    for(const {lo,hi,z,width,high,kind,sideways} of bands){
      const spec=species[kind],leaf=new T.Color(spec.leaf),pot=new T.Color(0x4c4940);
      const sections=Math.max(2,Math.ceil((hi-lo)/.38)),base=positions.length/3;
      for(let i=0;i<=sections;i++){
        const x=lo+(hi-lo)*i/sections,variation=rand(x,z);
        const half=width*(.445+.05*variation),rim=high+spec.h;
        const crown=rim+spec.height*(.63+.26*variation);
        const cross=[[-half,high,pot],[-half,rim,pot],[-half*.88,crown-.08,leaf],
          [0,crown,leaf],[half*.88,crown-.08,leaf],[half,rim,pot],[half,high,pot]];
        for(const [offset,y,colour] of cross){
          positions.push(sideways?z+offset:x,y,sideways?x:z+offset);
          const light=.63+.25*variation+.18*rand(offset,x,z);
          colours.push(colour.r*light,colour.g*light,colour.b*light);
        }
        if(i)for(let j=0;j<cross.length-1;j++){
          const a=base+(i-1)*cross.length+j,b=a+cross.length;
          indices.push(a,b,b+1,a,b+1,a+1);
        }
      }
    }
    return new T.Mesh(skin(T,positions,indices,colours,'Dải chậu nhìn từ đường'),material);
  }
  function table(T,k,batch,x0,x1,z,w,content,sideways=false){
    const long=x1-x0,middle=(x1+x0)/2,high=.81+.075*rand(middle,z);
    const at=(x,s)=>sideways?[z+s,x]:[x,z+s];
    const box=(color,x,y,s,l,h,b)=>{
      const [u,v]=at(x,s);k.box(color,u,y,v,sideways?b:l,h,sideways?l:b);
    };
    const n=Math.ceil(long/2.20);
    for(let j=0;j<=n;j++){
      const x=x0+.13+(long-.26)*j/n;
      for(const side of [-1,1]){
        const [u,v]=at(x,side*(w/2-.087));k.stamp(k.round,j%4===0?straw:sill,u,high*.43-.015,v,.048,high*1.17,.046);
      }
      box(straw,x,high-.065,0,.093,.086,w+.075);
    }
    for(let j=0;j<6;j++){
      const side=(j/5-.5)*(w-.07);
      const [u,v]=at(middle,side),r=.028+.003*rand(z,j),tint=j%3?0x998969:0x8e8063;
      k.stamp(k.round,tint,u,high,v,r,long,r,0,sideways?Math.PI/2:0,sideways?0:Math.PI/2);
    }
    const spans=typeof content==='string'?[[1,content]]:content;
    let from=0;
    for(const [end,kind] of spans){
      const lo=x0+long*from,hi=x0+long*end;from=end;
      if(kind==='bare')continue;
      const spec=species[kind],cols=Math.max(1,Math.floor((hi-lo)/spec.pitch));
      batch.bands.push({lo,hi,z,width:w,high,kind,sideways});
      for(let j=0;j<cols;j++)for(let row=0;row<spec.rows;row++){
        const offset=((row+.5)/spec.rows-.5)*w,x=lo+(hi-lo)*(j+.5)/cols;
        const [u,v]=at(x+.018*(rand(x,row)-.5),offset+.015*(rand(row,x)-.5));
        const q=rand(u,v,1),q2=rand(u,v,2),sz=.89+.20*q,az=q2*pi2;
        batch.pots.push([u,high+.035,v,spec.pot*sz,spec.h*sz,spec.pot*sz,az,.78+.33*q2]);
        batch[kind].push([u,high+.035+spec.h*sz*.87,v,spec.spread*sz,spec.height*(.74+.42*q2),spec.spread*sz,az,.80+.30*q]);
      }
    }
  }
  function waterSurface(T,k){
    // The photographed troughs are shallow, brown-green and partly covered
    // in floating vegetation. Long open bands remain between the planted rows.
    const w=32,d=35,cv=document.createElement('canvas');cv.width=768;cv.height=768;const ctx=cv.getContext('2d');
    const mask=document.createElement('canvas');mask.width=88;mask.height=88;
    const g=mask.getContext('2d'),pixels=g.createImageData(88,88);
    for(let y=0;y<88;y++)for(let x=0;x<88;x++){
      const i=4*(y*88+x),u=x/88*w-15.5,v=y/88*d-16.8;
      const s=.5+.19*Math.sin(.62*u+.16*v)+.23*Math.cos(1.16*v-.17*u)+.12*Math.sin(2.50*v+.4*u)+.18*(rand(x,y)-.5);
      const f=Math.max(0,Math.min(1,(s-.47)*2.9)),r=rand(x,y,4)*8;
      pixels.data[i]=84+f*2+r;pixels.data[i+1]=86+f*29+r;pixels.data[i+2]=66-f*22+r*.6;pixels.data[i+3]=255;
    }
    g.putImageData(pixels,0,0);ctx.drawImage(mask,0,0,768,768);
    for(let n=0;n<6100;n++){
      const x=rand(n,54)*768,y=rand(n,92)*768,q=rand(n,4);
      if(q<.40){
        ctx.strokeStyle=q>.15?'rgba(192,187,146,.26)':'rgba(165,177,155,.35)';
        ctx.lineWidth=.6+q;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+2,y-.6,x+3+q*9,y);ctx.stroke();
      }else{
        ctx.fillStyle=q>.86?'rgba(158,164,77,.46)':'rgba(99,129,71,.52)';ctx.beginPath();ctx.ellipse(x,y,1.2+q*1.9,.60+q*.58,q,0,pi2);ctx.fill();
      }
    }
    const tex=new T.CanvasTexture(cv);tex.colorSpace=T.SRGBColorSpace;
    const geom=new T.PlaneGeometry(w,d);geom.rotateX(-Math.PI/2);
    const mat=new T.MeshStandardMaterial({map:tex,roughness:.50,metalness:.13});
    const water=new T.Mesh(geom,mat);water.position.set(.50,.025,.70);water.receiveShadow=true;k.group.add(water);
  }
  function earthPath(T,k,points,width,h){
    const p=[],c=[],idx=[],uv=[];
    for(let i=0;i<points.length;i++){
      const [x,z]=points[i],before=points[Math.max(0,i-1)],after=points[Math.min(points.length-1,i+1)],dx=after[0]-before[0],dz=after[1]-before[1],r=Math.hypot(dx,dz);
      for(let j=0;j<4;j++){
        const s=[-.62,-.45,.45,.62][j]*width*(.91+.13*rand(i,j));
        const xx=x-dz/r*s,zz=z+dx/r*s;
        p.push(xx,j===1||j===2?h+.017*rand(i,5):.004,zz);uv.push(xx/1.60,zz/1.60);
        c.push(...new T.Color(j===1||j===2?dryEarth:wetEarth).multiplyScalar(.88+.17*rand(i,j,66)).toArray());
      }
      if(i)for(let j=0;j<3;j++){const a=i*4+j;idx.push(a-4,a,a-3,a,a+1,a-3);}
    }
    const cv=document.createElement('canvas');cv.width=cv.height=76;const g=cv.getContext('2d');
    g.fillStyle='#dcd6c4';g.fillRect(0,0,76,76);
    for(let i=0;i<650;i++){
      const q=rand(i,33);g.fillStyle=q>.5?'rgba(91,79,61,.19)':'rgba(239,235,211,.32)';
      g.beginPath();g.ellipse(rand(i,31)*76,rand(i,32)*76,.35+1.10*q,.33+.71*q,q*pi2,0,pi2);g.fill();
    }
    const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;
    const mesh=bufferMesh(T,k,p,c,idx,new T.MeshStandardMaterial({map,vertexColors:true,side:T.DoubleSide,roughness:1}));
    mesh.geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));mesh.castShadow=true;
  }
  function shade(T,k,x0,x1,z0,z1,y){
    const nx=Math.max(1,Math.round((x1-x0)/2.85)),nz=Math.max(1,Math.round((z1-z0)/3.02)),p=[],c=[],idx=[],uv=[];
    for(let j=0;j<=nz*3;j++)for(let i=0;i<=nx*3;i++){
      const x=x0+(x1-x0)*i/(nx*3),z=z0+(z1-z0)*j/(nz*3);
      const sag=Math.sin(Math.PI*(i%3)/3)*Math.sin(Math.PI*(j%3)/3);
      const a=p.length/3;p.push(x,y-.195*sag+.037*Math.sin(i*1.8+j),z);uv.push(x*.65,z*.65);
      c.push(...new T.Color(i%9<4?0x3f5050:0x42505b).multiplyScalar(.86+.16*rand(i,j)).toArray());
      if(i&&j){const w=nx*3+1;idx.push(a-w-1,a-1,a,a-w-1,a,a-w);}
    }
    const cv=document.createElement('canvas');cv.width=cv.height=96;const pen=cv.getContext('2d');
    pen.fillStyle='#b2b4b0';pen.fillRect(0,0,96,96);
    for(let x=0;x<96;x+=4){pen.fillStyle='#616862';pen.fillRect(x,0,1,96);}
    for(let z=0;z<96;z+=6){pen.fillStyle='#7e827d';pen.fillRect(0,z,96,1);}
    const netTex=new T.CanvasTexture(cv);netTex.colorSpace=T.SRGBColorSpace;netTex.wrapS=netTex.wrapT=T.RepeatWrapping;
    const mat=new T.MeshStandardMaterial({map:netTex,vertexColors:true,side:T.DoubleSide,roughness:1,transparent:true,opacity:.92});
    const mesh=bufferMesh(T,k,p,c,idx,mat);mesh.geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));mesh.castShadow=true;
    for(let i=0;i<=nx;i++)for(let j=0;j<=nz;j++){
      if(i&&i<nx&&j&&j<nz)continue;
      const x=x0+(x1-x0)*i/nx,z=z0+(z1-z0)*j/nz;k.stamp(k.round,0x85857a,x,y*.50,z,.035,y,.035);
    }
    for(let j=0;j<=nz;j++)k.box(0x6c7772,(x1+x0)/2,y-.025,z0+(z1-z0)*j/nz,x1-x0,.035,.035);
  }
  function workArea(T,k){
    // Alternating blue/white market umbrella and a blue plastic garden tub.
    const x=-.51,z=.13,height=2.37,p=[],cols=[],idx=[];
    k.stamp(k.round,0x9a9990,x,height/2,z,.027,height,.027);
    for(let i=0;i<8;i++){
      const a=i*pi2/8,b=(i+1)*pi2/8,m=(a+b)/2,base=p.length/3;
      const c=new T.Color(i%2?0xeee9d3:0x7296b9);
      for(const [az,r,h] of [[a,0,height],[a,1.03,1.99],[m,1.04,1.95],[b,1.03,1.99],[a,1.03,1.92],[m,1.04,1.89],[b,1.03,1.92]]){
        p.push(x+Math.cos(az)*r,h,z+Math.sin(az)*r);cols.push(...c.toArray());
      }
      for(const q of [0,2,1,0,3,2,1,2,4,2,5,4,2,3,5,3,6,5])idx.push(base+q);
      window.CentralArch.strut(T,k,0x9d9b8a,x,2.04,z,x+Math.cos(a)*.99,1.98,z+Math.sin(a)*.99,.013);
    }
    const umb=bufferMesh(T,k,p,cols,idx,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.95}));umb.castShadow=true;
    const tub=new T.CylinderGeometry(1,.78,1,18,1,true),rim=new T.TorusGeometry(1,.066,5,20);
    k.stamp(tub,0x537c9f,.38,.405,.90,.35,.35,.50,.16);
    k.stamp(rim,0x6e98af,.38,.58,.90,.35,.50,.35,.16,Math.PI/2);
    k.stamp(k.round,0x6c8b99,.38,.30,.90,.28,.035,.41,.16);tub.dispose();rim.dispose();
  }
  function edges(T,k){
    const corners=[[-15.5,-16.8],[16.5,-16.8],[16.5,18.2],[-15.5,18.2]],p=[],c=[],idx=[],verts=[];
    for(let s=0;s<4;s++){
      const a=corners[s],b=corners[(s+1)%4],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
      for(let i=0;i<=15;i++){
        const x=a[0]+dx*i/15,z=a[1]+dz*i/15;
        for(let j=0;j<3;j++){
          const r=[-.08,.17,.69][j],u=x+dz/len*r,v=z-dx/len*r,ind=p.length/3;p.push(u,0,v);verts.push([ind,u,v,j]);c.push(...new T.Color(j===1?0x859151:bankEarth).toArray());
        }
        if(i)for(let j=0;j<2;j++){const v=p.length/3-3+j;idx.push(v-3,v,v-2,v,v+1,v-2);}
      }
    }
    const mesh=bufferMesh(T,k,p,c,idx,new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide}));
    return (g,level)=>{
      const a=mesh.geometry.attributes.position;
      for(const [i,x,z,j] of verts)a.setY(i,j===2?g(x,z)-.18:level+(j===1?.18:.023));
      a.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();
    };
  }
  function fieldMargins(T,k){
    // Only the two planted boundaries that can be followed on the nadir:
    // the raised north bank, and the broken line of greenery beside
    // the covered strip looking towards the ornamental lotus pond.
    earthPath(T,k,[[-13.8,-16.16],[-7.1,-16.43],[-.4,-16.30],[6.9,-16.35],[15.7,-16.25]],1.87,.28);
    earthPath(T,k,[[-14.7,-14.6],[-14.9,-6.5],[-14.7,.4],[-14.9,5],[-14.6,15.9]],1.15,.25);
    const plants=[];
    for(let i=0;i<15;i++){
      const q=rand(i,12),x=-13.8+2.10*i,z=-16.36-.39*rand(i,32);
      plants.push({x,y:.15,z,h:1.5+q*1.80,width:1.8+.74*rand(i,7),kind:'tea'});
      if(i%4===1||i===12)plants.push({x:x+.52,y:.06,z:z-.46,h:4.25+q*1.85,width:2+.86*q,kind:'banyan'});
    }
    for(const [z,h,w] of [[-14.0,2.3,1.8],[-10.7,3.7,2.8],[-8.4,2.7,2.5],[-4.6,3.9,2.6],[4.75,3.5,2.5],[8.55,2.4,2.0],[12.55,3.5,2.4]])
      plants.push({x:-14.96,y:.15,z,h,width:w,kind:'banyan'});
    window.CentralArch.trees(T,k,plants);
  }
  function build(T,k){
    const first=k.vertexCount(),before=k.group.children.length,batch={pots:[],bands:[]};
    for(const type of Object.keys(species))batch[type]=[];
    k.palette({timber:[sill,straw,bamboo]});
    waterSurface(T,k);
    earthPath(T,k,[[.20,-16.8],[.02,-13.5],[-.01,-8.2],[-.06,-3.2],[0,-.4],[.06,4.4],[.03,8.8]],.75,.213);
    earthPath(T,k,[[.05,8.53],[4.6,8.39],[9.3,8.44],[13.8,8.84],[16.5,9.2]],.87,.217);
    earthPath(T,k,[[2.9,17.8],[5.1,15.8],[8.4,12.3],[10.8,9.50],[11.92,8.51]],.64,.195);
    earthPath(T,k,[[12.25,-4.68],[12.25,-.13],[12.47,5.44],[12.67,8.6]],.40,.151);
    for(let i=0;i<leftRows.length;i++){
      const [z,mix]=leftRows[i];table(T,k,batch,-11.37+.095*Math.sin(.47*i),-.46-.045*Math.sin(i),z,i<4?1.24:1.08,mix);
    }
    for(let i=0;i<rightRows.length;i++){
      const [z,mix]=rightRows[i];table(T,k,batch,.45+.02*Math.cos(i),12.12+.12*Math.cos(i*.42),z,i<3?1.28:1.06,mix);
    }
    for(const x of [13.18,14.71]){
      table(T,k,batch,-14.58,-5.02,x,1.08,'lime',true);
      table(T,k,batch,-4.54,6.15,x,1.08,[[.68,'lime'],[1,'green']],true);
    }
    table(T,k,batch,.74,10.38,9.31,1.04,'lime');
    table(T,k,batch,2.35,7.95,10.94,.98,'shoots');table(T,k,batch,3.10,5.58,12.49,.96,'shoots');
    for(let i=0;i<3;i++)table(T,k,batch,9.60,14.15,11.69+i*1.53,1.0,i===1?'bare':'young',true);
    shade(T,k,-14.07,-11.48,-14.70,16.42,2.49);shade(T,k,-11.48,2.98,9.65,17.41,2.64);workArea(T,k);fieldMargins(T,k);
    const opaque=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide});
    const closePlants=new T.Group(),plantedRacks=new T.LOD();
    const touch=globalThis.matchMedia?.('(pointer: coarse)').matches && globalThis.document?.body?.dataset.graphics!=='high';
    for(const type of ['pots',...Object.keys(species)])plantsByDistance(T,closePlants,type,batch[type],opaque,touch);
    plantedRacks.addLevel(closePlants,0);
    plantedRacks.addLevel(distantBeds(T,batch.bands,opaque),touch?42:60,.13);
    k.group.add(plantedRacks);
    const surfaces=k.group.children.slice(before).map(m=>[m,m.position.y]),last=k.vertexCount(),fitEdges=edges(T,k);
    let previous=0;
    k.group.userData.fitGround=ground=>{
      const body=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'));
      if(!body)return;
      let level=ground(0,0);
      for(let x=-15.5;x<=16.51;x+=4)for(let z=-16.8;z<=18.21;z+=3.5)level=Math.max(level,ground(x,z));
      level+=.12;
      if(Math.abs(level-previous)>.001){
        const pos=body.geometry.attributes.position;
        for(let i=first;i<last;i++)pos.setY(i,pos.getY(i)+level-previous);
        pos.needsUpdate=true;body.geometry.computeBoundingBox();body.geometry.computeBoundingSphere();
        for(const [m,y] of surfaces)m.position.y=y+level;previous=level;
      }
      fitEdges(ground,level);
    };
  }
  const sites=window.VietnamSights??=[];
  sites.push({...pin,id,catalogId,name:'Làng hoa Sa Đéc · vườn chậu trên giàn',province:'Đồng Tháp',city:'Sa Đéc',kind:'Làng nghề',
    lon:105.7462542,lat:10.3184704,start:[105.7451414,10.3176792],yaw,width:32,depth:35,mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    map:'https://www.openstreetmap.org/node/13518302230',source,photo,
    boundary:[[-15.5,-16.8],[16.5,-16.8],[16.5,18.2],[-15.5,18.2]],reserve:(x,z,r)=>Math.abs(x-.5)<16.4+r&&Math.abs(z-.7)<17.9+r,
    description:'Cọc giữ các giàn cao trên mặt nước. Người trồng xếp chậu thành hàng và chừa những đoạn giàn trống để chuyển cây. Ô vườn này nằm phía đông cầu qua hồ sen trong ảnh toàn cảnh 18 của VNPT. Vị trí các luống theo thời điểm chụp. Độ cao giàn, mực nước và kích thước chậu được ước theo ảnh.',
    arrivalNote:'Xe dừng trên Đường Hoa Sa Đéc ở đầu lối vào vườn. Đi bộ qua khu tham quan tới luống chậu phía đông hồ sen.',
    solids:[],views:[shot('Các luống hoa kiểng bên lối chăm vườn',.4,-2.5,3.2,23.2,.86,.37),
      shot('Cọc và những thanh giàn còn trống',-1.20,-5.20,2.00,2.77,.52,.34),
      shot('Dãy cây lá bạc bên chậu ươm',4.5,3.01,3.08,8.45,-.96,.23)],build});
})();
