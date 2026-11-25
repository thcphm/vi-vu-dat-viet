const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  // Survey 2026-11-23. Named OSM tea parcel w741701880 touches the north-east
  // end of the avenue. The straight avenue itself follows residential way
  // w741701067 between n6943315928 and n6943315929, about 785 m at 46–47°.
  // The commune and the 2025 trail organisers put the avenue on this route:
  const source='https://bienho.gialai.gov.vn/thong-bao-van-ban-moi/gioi-thieu-diem-van-hoa-du-lich-tren-dia-ban-xa-bien-ho.html';
  // https://maps.app.goo.gl/3viQa2Akkg3oYuL38 (2025 Gia Lai City Trail, point Đ7).
  // The tree-lined cadastral road and the retained tea bed are visible in
  // both satellite image sets. The selected rectangular green bed is near
  // the avenue, outside the named OSM polygon. A dark adjacent plot in an
  // older scene is largely bare in the newer scene.
  // https://www.openstreetmap.org/way/741701067
  // https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer
  // https://www.google.com/maps/@14.0632,108.01235,260m/data=!3m1!1e3
  const photo='https://nhandan.vn/anh-hang-thong-tram-tuoi-mot-diem-den-hap-dan-du-khach-tai-gia-lai-post873040.html';
  // Field-relief reference: deeply fissured plate bark, high crooked forks,
  // irregular interlocking crowns, reddish shoulders and small blue inventory
  // plaques. The commune numbered individual trees; their sequence has not
  // been surveyed here. The positions within each observed crown group,
  // branch profiles, hedge heights and signs are approximate.
  // https://dantri.com.vn/du-lich/rung-thong-tram-tuoi-dep-lang-man-hut-khach-check-in-o-gia-lai-20230131180132930.htm
  const id='hang-thong-bien-ho-che',catalogId='osm-way-741701880';
  const raw=window.VietnamTourism.entries.find(site=>site.id===catalogId);
  if(!raw)throw Error('Missing Chè Biển Hồ catalog entry');
  const yaw=-.82013,c=Math.cos(yaw),s=Math.sin(yaw),tau=Math.PI*2;
  function random(seed){
    return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
  }
  function texture(T,w,h,draw,repeat=false){
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;draw(canvas.getContext('2d'),w,h);
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    if(repeat)map.wrapS=map.wrapT=T.RepeatWrapping;
    return map;
  }
  function materialSet(T){
    const rand=random(8859);
    const bark=texture(T,256,384,(g,w,h)=>{
      g.fillStyle='#51463a';g.fillRect(0,0,w,h);
      // Overlapping ash-grey and warm russet scaly plates inch up the trunk.
      for(let j=-2;j<28;j++)for(let i=-2;i<=19;i++){
        const x=i*15+(j%2)*5+rand()*7,y=j*17+rand()*9,a=7+rand()*7,b=14+rand()*19;
        const value=Math.floor(72+rand()*56);
        g.fillStyle='rgb('+(value+19)+','+(value+6)+','+(value-7)+')';
        g.beginPath();g.moveTo(x-1,y-b*.12);g.lineTo(x+a*.44,y-b*.23);g.lineTo(x+a*.96,y+b*.15);
        g.lineTo(x+a*.72,y+b*.66);g.lineTo(x+a*.25,y+b);g.lineTo(x-1,y+b*.69);g.lineTo(x+a*.12,y+b*.42);g.closePath();g.fill();
        g.strokeStyle='rgba(172,158,126,.48)';g.lineWidth=.95;g.beginPath();g.moveTo(x+1,y+b*.55);g.lineTo(x+a*.18,y+b*.24);g.lineTo(x+a*.12,y);g.stroke();
        for(let n=0;n<5;n++){g.fillStyle=rand()<.55?'rgba(44,35,30,.25)':'rgba(198,185,151,.35)';g.fillRect(x+rand()*a,y+rand()*b,.8+rand()*1.6,1+rand()*4);}
      }
    },true);
    const needles=texture(T,256,256,(g,w,h)=>{
      // A spray spreads into separate tufts of fine needles, leaving gaps
      // between the terminal twigs. No reference-photo pixels are used.
      for(let j=0;j<78;j++){
        const t=rand()*tau,r=Math.sqrt(rand()),x=127+r*107*Math.cos(t),y=129+r*96*Math.sin(t);
        const dx=x-127,dy=y-129;
        g.strokeStyle='rgba(102,93,59,.7)';g.lineWidth=.8;g.beginPath();g.moveTo(125+dx*.34,130+dy*.34);g.quadraticCurveTo(128+dx*.72-4,128+dy*.69+5,x,y);g.stroke();
        for(let q=0;q<13;q++){
          const fx=x+(rand()-.5)*22,fy=y+(rand()-.5)*19,reach=4+rand()*9;
          const tone=Math.floor(79+rand()*60);
          g.strokeStyle='rgb('+(tone+9)+','+(tone+24)+','+(tone-16)+')';g.lineWidth=1.1+rand()*.65;g.beginPath();
          for(let k=0;k<8;k++){const a=t+(k-3)*.33+rand()*.6;g.moveTo(fx,fy);g.lineTo(fx+Math.cos(a)*reach,fy+Math.sin(a)*reach);}
          g.stroke();
        }
      }
    });
    const leaf=texture(T,192,192,(g,w,h)=>{
      g.fillStyle='#698451';g.fillRect(0,0,w,h);
      for(let i=0;i<1850;i++){
        const x=rand()*w,y=rand()*h,r=1.5+rand()*3.8,a=rand()*tau,v=Math.floor(74+rand()*86);
        g.save();g.translate(x,y);g.rotate(a);g.fillStyle='rgb('+(v*.77|0)+','+(v+25)+','+(v*.51|0)+')';
        g.beginPath();g.moveTo(-r,0);g.quadraticCurveTo(-r*.15,-r*.68,r*1.28,0);g.quadraticCurveTo(r*.07,r*.6,-r,0);g.fill();g.restore();
      }
    },true);
    const soil=texture(T,192,192,(g,w,h)=>{
      g.fillStyle='#95785b';g.fillRect(0,0,w,h);
      for(let i=0;i<7500;i++){
        const v=(55+rand()*100)|0;g.fillStyle='rgba('+(v+25)+','+(v+7)+','+(v-12)+',.44)';
        g.fillRect(rand()*w,rand()*h,1+rand()*2.8,1+rand()*2.1);
      }
    },true);
    const tips=texture(T,128,128,(g,w,h)=>{
      for(let j=0;j<26;j++){
        const a=rand()*tau,r=Math.sqrt(rand())*48,x=64+r*Math.cos(a),y=65+r*Math.sin(a);
        const b=rand()*tau,reach=6+rand()*9;
        g.save();g.translate(x,y);g.rotate(b);g.fillStyle=['#829c56','#8ca95e','#9cb65f','#779557','#a7b95f'][j%5];
        g.beginPath();g.moveTo(-reach,0);g.quadraticCurveTo(-1,-reach*.50,reach*1.16,0);g.quadraticCurveTo(reach*.12,reach*.53,-reach,0);g.fill();
        g.strokeStyle='#b1c17a';g.lineWidth=.8;g.beginPath();g.moveTo(-reach*.67,0);g.lineTo(reach*.78,-.22);g.stroke();g.restore();
      }
    });
    const tag=texture(T,150,93,(g,w,h)=>{
      g.fillStyle='#398aa2';g.fillRect(0,0,w,h);g.strokeStyle='#b8c4ae';g.lineWidth=2;g.strokeRect(2,2,w-4,h-4);
      g.fillStyle='#e0deba';g.textAlign='center';g.font='bold 19px Georgia';g.fillText('THÔNG BIỂN HỒ',w/2,34,140);
    });
    return {wood:new T.MeshStandardMaterial({map:bark,roughness:.98}),
      foliage:new T.MeshLambertMaterial({map:needles,emissive:0x2c3823,emissiveIntensity:.49,alphaTest:.32,side:T.DoubleSide,vertexColors:true}),
      tea:new T.MeshStandardMaterial({map:leaf,roughness:.89,emissive:0x283320,emissiveIntensity:.48,vertexColors:true,side:T.DoubleSide}),
      tips:new T.MeshLambertMaterial({map:tips,alphaTest:.40,side:T.DoubleSide}),
      soil:new T.MeshStandardMaterial({map:soil,roughness:1,vertexColors:true,side:T.DoubleSide}),
      tag:new T.MeshStandardMaterial({map:tag,roughness:.89,side:T.DoubleSide})};
  }
  function buffer(T,p,uv,ix,cols){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    if(cols)g.setAttribute('color',new T.Float32BufferAttribute(cols,3));
    g.setIndex(ix);g.computeVertexNormals();g.computeBoundingSphere();return g;
  }
  function maturePine(T,variant){
    const rand=random(2940+variant*997),p=[],uv=[],ix=[],canopy=[],tex=[],faces=[],col=[];
    const vec=p=>new T.Vector3(...p),tilt=(rand()-.5)*1.5,sweep=(rand()-.45)*1.42,h=18.1+rand()*2.90;
    function limb(points,radii,sides){
      const start=p.length/3;let run=0;
      const ref=Math.abs(points.at(-1)[1]-points[0][1])<1?new T.Vector3(0,1,0):new T.Vector3(1,0,0);
      for(let j=0;j<points.length;j++){
        const q=vec(points[j]),delta=vec(points[Math.min(points.length-1,j+1)]).sub(vec(points[Math.max(0,j-1)])).normalize();
        const y=new T.Vector3().crossVectors(delta,ref).normalize(),x=new T.Vector3().crossVectors(y,delta).normalize();
        if(j)run+=q.distanceTo(vec(points[j-1]));
        for(let i=0;i<=sides;i++){
          const a=tau*i/sides,r=radii[j]*(1+.062*Math.cos(3*a+.21*j)+.032*Math.sin(5*a-.1*j));
          const v=q.clone().addScaledVector(x,r*Math.cos(a)).addScaledVector(y,r*Math.sin(a));p.push(v.x,v.y,v.z);
          uv.push(i/sides*Math.max(1,radii[0]*3.2),run/2.13);
          const k=start+j*(sides+1)+i;if(j&&i)ix.push(k-sides-2,k-sides-1,k,k-sides-2,k,k-1);
        }
      }
    }
    function spray(x,y,z,size){
      for(let j=0;j<6;j++){
        const a=rand()*tau,b=.12+rand()*1.24,cos=Math.cos(a),sin=Math.sin(a),w=size*(.72+rand()*.46),hh=w*(.59+rand()*.24);
        const right=[w*cos,0,w*sin],up=[-hh*sin*Math.cos(b),hh*Math.sin(b),hh*cos*Math.cos(b)],base=canopy.length/3;
        const spread=size*.78,cx=x+(rand()-.5)*spread,cz=z+(rand()-.5)*spread,cy=y+(rand()-.5)*spread*.52;
        const v=.82+rand()*.29;
        for(const [u,t] of [[-1,-1],[1,-1],[1,1],[-1,1]]){
          canopy.push(cx+u*right[0]+t*up[0],cy+t*up[1],cz+u*right[2]+t*up[2]);tex.push((u+1)/2,(t+1)/2);col.push(v,v,v*.96);
        }
        faces.push(base,base+1,base+2,base,base+2,base+3);
      }
    }
    const main=[[0,0,0],[-.038,.40,-.022],[tilt*.12,3.1,sweep*.20],[tilt*.38,7.3,sweep*.39],[tilt*.72,10.5,sweep*.67],[tilt,13.7,sweep],[tilt-.34,16.15,sweep+.30],[tilt-.11,h,sweep-.07]];
    limb(main,[.67,.545,.436,.342,.28,.205,.116,.031],13);
    for(let i=0;i<7;i++){
      const a=tau*i/7+rand()*.42,len=.65+rand()*.68;
      limb([[.24*Math.cos(a),.76,.24*Math.sin(a)],[.54*Math.cos(a),.21,.54*Math.sin(a)],[len*Math.cos(a),.017,len*Math.sin(a)]],[.139,.13,.018],6);
    }
    for(let i=0;i<11;i++){
      const a=i*2.399+rand()*.55,level=i<3?6.0+i*.85+rand():9.0+(i-3)*.91,at=level/h;
      const dx=Math.cos(a),dz=Math.sin(a),length=(1-at*.44)*(4.4+rand()*3.6);
      const base=[tilt*at,level,sweep*at],elbow=[base[0]+dx*length*.40,level+1.09+rand()*.81,base[2]+dz*length*.40];
      const tip=[base[0]+dx*length,Math.min(h+.54,level+2.71+rand()*2.40),base[2]+dz*length];
      limb([base,elbow,tip],[i<4?.237:.168,.144,.045],8);
      for(const side of [-1,1]){
        const b=a+side*(.39+rand()*.42),r=1.30+rand()*1.88;
        const t=[tip[0]+Math.cos(b)*r,tip[1]+.54+rand()*1.1,tip[2]+Math.sin(b)*r];
        limb([elbow,[tip[0],tip[1]-.13,tip[2]],t],[.096,.06,.017],5);
        spray(t[0],t[1],t[2],1.80+rand()*1.03);
      }
      spray(tip[0]*.79,tip[1]+.20,tip[2]*.79,2.00+rand()*.70);
    }
    spray(tilt,h+.32,sweep,2.25);
    return [buffer(T,p,uv,ix),buffer(T,canopy,tex,faces,col)];
  }
  // The intervals cover the crown groups visible from -147 to +144 m along
  // this section. The cross-road gaps at the parking shoulder and the field
  // access paths have been left open. Each stem lies outside the carriageway.
  const northwest=[-145,-132,-118,-104,-92,-78,-65,-52,-40,-29,-13,0,13,26,39,51,70,86,99,113,125,141];
  const southeast=[-140,-124,-111,-98,-86,-73,-58,-46,-33,-10,3,15,31,47,72,88,102,117,133];
  function pineStand(T,k,mats){
    const rand=random(9745),rows=[];
    for(const [side,list] of [[-1,northwest],[1,southeast]])for(const [i,z] of list.entries()){
      const x=side*(5.18+rand()*.89),h=.93+rand()*.17,w=.85+rand()*.26;
      rows.push({x,z,turn:rand()*tau,h,w,type:(i+(side>0?2:0))%4});
    }
    const transforms=[],pose=new T.Object3D();
    for(let variant=0;variant<4;variant++){
      const subset=rows.filter(r=>r.type===variant),geos=maturePine(T,variant);
      for(const [i,mat] of [mats.wood,mats.foliage].entries()){
        const mesh=new T.InstancedMesh(geos[i],mat,subset.length);mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);
        transforms.push(ground=>{subset.forEach((r,j)=>{pose.position.set(r.x,ground(r.x,r.z)-.04,r.z);pose.rotation.set(0,r.turn,0);pose.scale.set(r.w,r.h,r.w);pose.updateMatrix();mesh.setMatrixAt(j,pose.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();});
      }
    }
    const tags=new T.InstancedMesh(new T.PlaneGeometry(.25,.17),mats.tag,rows.length);tags.receiveShadow=true;k.group.add(tags);
    transforms.push(ground=>{rows.forEach((r,i)=>{const side=Math.sign(r.x);pose.position.set(r.x-side*.50*r.w,ground(r.x,r.z)+2.10*r.h,r.z);pose.rotation.set(0,-side*Math.PI/2,0);pose.scale.set(1,1,1);pose.updateMatrix();tags.setMatrixAt(i,pose.matrix);});tags.instanceMatrix.needsUpdate=true;tags.computeBoundingSphere();});
    return g=>transforms.forEach(fn=>fn(g));
  }
  function plots(T,k,mats){
    const follow=[];
    // Mesh grids follow the DEM independently, including the slight fall
    // to the south-eastern headland. Slender soil paths divide the parcels.
    function grid(corners,nu,nv,tint,raise,furrows=false){
      const p=[],uv=[],ix=[],cols=[],colour=new T.Color(tint);
      for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){
        const u=i/nu,v=j/nv,weights=[(1-u)*(1-v),(1-u)*v,u*v,u*(1-v)];
        let x=0,z=0;corners.forEach((q,k)=>{x+=q[0]*weights[k];z+=q[1]*weights[k];});
        const n=p.length/3;p.push(x,raise,z);uv.push(x/2.30,z/2.30);
        const variation=.93+.07*Math.sin(x*.47+Math.sin(z*.36))*(furrows?.70:.36)+(furrows?.085*Math.sin(j*2.07):0);
        cols.push(colour.r*variation,colour.g*variation,colour.b*variation);
        if(i&&j)ix.push(n-nu-2,n-1,n,n-nu-2,n,n-nu-1);
      }
      const mesh=new T.Mesh(buffer(T,p,uv,ix,cols),mats.soil);mesh.receiveShadow=true;k.group.add(mesh);follow.push(mesh.geometry);
    }
    // Actual head and tail of the standing green rows, metres in a road-
    // aligned frame (positive x towards the south-eastern field).
    const green=[[11.26,-19.04],[14.94,25.98],[96.53,22.08],[98.13,-23.96]];
    grid(green,27,15,0x82664f,.105);
    grid([[10.2,-62.2],[10.6,-20.3],[98.4,-25.4],[98.1,-61.4]],24,49,0xb28e73,.096,true);
    grid([[14.5,27.6],[12.6,135.0],[95.2,131.6],[96.4,23.9]],24,98,0xa7826b,.096,true);
    grid([[12.3,-19.6],[14.7,27.8],[97.25,23.8],[97.9,-24.0]],24,7,0xa78965,.074);
    grid([[14.86,25.7],[14.9,27.8],[97.25,23.8],[96.7,22.05]],26,2,0xc7a881,.128);
    // Exposed shoulders in the photos, wider at the turnout (-22 m). The
    // existing routed asphalt is the road surface throughout the avenue.
    for(const side of [-1,1]){
      const p=[],uv=[],ix=[],cols=[],colour=new T.Color(0xe2bf93);
      for(let i=0;i<=100;i++){
        const z=-150+i*3,centre=-.60+.0026*z,inner=3.45,outer=(side===1?9.65:8.55)+.60*Math.sin(z*.13)+Math.max(0,1-Math.abs(z+22)/16)*(side<0?4.75:.75);
        for(let j=0;j<4;j++){
          const f=j/3,x=centre+side*(inner+(outer-inner)*f),v=.92+.095*Math.sin(z*.36+j*.64),n=p.length/3;
          p.push(x,j===3?.04:.096,z);uv.push(x/1.7,z/1.7);cols.push(colour.r*v,colour.g*v,colour.b*v);
          if(i&&j){ix.push(n-5,n-1,n,n-5,n,n-4);}
        }
      }
      const mesh=new T.Mesh(buffer(T,p,uv,ix,cols),mats.soil);mesh.receiveShadow=true;k.group.add(mesh);follow.push(mesh.geometry);
    }
    // The standing rows run roughly 135° across the avenue (47°). Six
    // independent cross sections in the detailed overhead image gave
    // 1.49–1.52 m between hedge centres. The 30 rows span the mapped bed.
    const p=[],uv=[],ix=[],cols=[],hedges=[],rand=random(9864),colour=new T.Color(),rings=68;
    const profile=[[-.61,.08],[-.64,.38],[-.56,.64],[-.42,.77],[-.19,.81],[.08,.83],[.35,.78],[.56,.65],[.63,.36],[.60,.08]];
    for(let i=0;i<30;i++){
      const axis=(i+.50)/30,from=11.26+3.68*axis,to=98.13-1.60*axis,begin=-19.04+45.02*axis,end=-23.96+46.04*axis;
      const length=to-from,base=p.length/3,h=.87+rand()*.20,offset=rand()*tau,upper=[];hedges.push(upper);
      for(let j=0;j<=rings;j++){
        const u=j/rings,x=from+u*length,centre=begin+(end-begin)*u+.19*Math.sin(u*6.7+offset)*Math.sin(Math.PI*u)+.05*Math.sin(x*.93+i);
        const transition=.56+.44*Math.min(1,Math.min(j,rings-j)/1.5),width=transition*(.97+.071*Math.cos(x*1.17+i)+.029*Math.sin(x*1.94-i));
        for(const [a,b] of profile){
          const zz=centre+a*width,y=b*h*transition*(.94+.064*Math.sin(x*2.38+i)+rand()*.11);
          if(a===-.19)upper.push([centre,y]);
          p.push(x,y,zz);uv.push(x/.84,(centre+y*1.53+a*.60)/.83);
          colour.setHex(b<.5?0xb3c9aa:0xe1ecbd);const v=.89+.15*rand()+.04*Math.sin(x*.16+i*.4);
          cols.push(colour.r*v,colour.g*v,colour.b*v);
        }
        if(j)for(let a=0;a<profile.length-1;a++){
          const n=base+j*profile.length+a;ix.push(n-profile.length,n+1,n,n-profile.length,n-profile.length+1,n+1);
        }
      }
    }
    const tea=new T.Mesh(buffer(T,p,uv,ix,cols),mats.tea);tea.castShadow=tea.receiveShadow=true;k.group.add(tea);follow.push(tea.geometry);
    // The open ends reveal short woody stems under the clipped leaves.
    const twigsX=[],twigsUV=[],twigsI=[];
    for(let i=0;i<30;i++){
      const a=(i+.5)/30,from=11.26+3.68*a,to=98.13-1.60*a;
      for(let j=0;j<170;j++)for(let rank=0;rank<2;rank++){
        const u=(j+.44+rand()*.28)/170,x=from+(to-from)*u,ring=u*rings,index=Math.floor(ring),next=Math.min(rings,index+1),mix=ring-index;
        const [z0,y0]=hedges[i][index],[z1,y1]=hedges[i][next];
        const z=z0+(z1-z0)*mix+.24*(rank?1:-1)+(rand()-.5)*.19;
        const size=.21+rand()*.19,turn=rand()*tau,tilt=(rand()-.22)*.65,dx=Math.cos(turn),dz=Math.sin(turn);
        const y=y0+(y1-y0)*mix+.009+rand()*.021,n=twigsX.length/3;
        for(const [t,v] of [[-1,-1],[1,-1],[1,1],[-1,1]]){
          twigsX.push(x+size*(dx*t-dz*v),y+size*tilt*v,z+size*(dz*t+dx*v));
          twigsUV.push((t+1)/2,(v+1)/2);
        }
        twigsI.push(n,n+2,n+1,n,n+3,n+2);
      }
    }
    const tuftMesh=new T.Mesh(buffer(T,twigsX,twigsUV,twigsI),mats.tips);
    tuftMesh.receiveShadow=true;const detail=new T.LOD();
    // Centre the distance test on the crop so the detailed leaf layer is
    // only drawn on approaches to this plot or at ground-level stops.
    detail.position.set(53,0,1.4);tuftMesh.position.set(-53,0,-1.4);
    detail.addLevel(tuftMesh,0);detail.addLevel(new T.Group(),86,.12);k.group.add(detail);follow.push(tuftMesh.geometry);
    const stems=[];
    for(let i=0;i<30;i++){
      const t=(i+.5)/30,xx=11.26+3.68*t,z=-19.04+45.02*t;
      for(let j=0;j<3;j++)stems.push([xx+.12+j*.06,z+(j-1)*.215,.40+.03*Math.cos(i),.024+(j%2)*.011]);
    }
    const trigs=new T.CylinderGeometry(1,1,1,5),wood=new T.MeshStandardMaterial({color:0x675541,roughness:.96});
    const twigs=new T.InstancedMesh(trigs,wood,stems.length);twigs.castShadow=true;k.group.add(twigs);
    const roots=follow.map(g=>Array.from(g.attributes.position.array)),pose=new T.Object3D();
    return ground=>{
      for(const [j,geometry] of follow.entries()){
        const pos=geometry.attributes.position,rest=roots[j];
        for(let i=0;i<pos.count;i++)pos.setY(i,rest[i*3+1]+ground(rest[i*3],rest[i*3+2]));
        pos.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
      }
      stems.forEach(([x,z,h,w],i)=>{pose.position.set(x,ground(x,z)+h*.5+.09,z);pose.rotation.set(0,0,(i%3-1)*.12);pose.scale.set(w,h,w);pose.updateMatrix();twigs.setMatrixAt(i,pose.matrix);});
      twigs.instanceMatrix.needsUpdate=true;twigs.computeBoundingSphere();
    };
  }
  function build(T,k){
    const mats=materialSet(T),trees=pineStand(T,k,mats),field=plots(T,k,mats);
    k.group.userData.fitGround=ground=>{
      // The DEM is coarser than the rows. Interpolating a small local grid
      // avoids repeating the same terrain lookups for individual leaf tips.
      const cache=new Map();
      const sample=(x,z)=>{const key=x+','+z;if(!cache.has(key))cache.set(key,ground(x,z));return cache.get(key);};
      function bedHeight(x,z){
        const u=2*Math.floor(x/2),v=2*Math.floor(z/2),a=(x-u)*.5,b=(z-v)*.5;
        return (1-b)*((1-a)*sample(u,v)+a*sample(u+2,v))+b*((1-a)*sample(u,v+2)+a*sample(u+2,v+2));
      }
      trees(ground);field(bedHeight);
    };
  }
  const shot=(name,x,z,height,viewRadius,angle,viewElevation,viewFov=62)=>({
    name,offset:[x*c+z*s,-x*s+z*c],height,viewRadius,viewAngle:yaw+angle,viewElevation,viewFov,viewBase:'monument'
  });
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Biển Hồ Chè – hàng thông trăm tuổi',kind:'Điểm ngắm cảnh',province:'Gia Lai',city:'Biển Hồ',
    lon:108.01201095,lat:14.06344900,start:[108.0121527,14.0635859],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    yaw,width:108,depth:300,source,photo,map:'https://www.openstreetmap.org/way/741701880',solids:[],
    boundary:[[-9,-146],[10.5,-145],[11,-62],[98,-62],[99,132],[11,136],[10,146],[-9,146]],
    reserve:(x,z,r)=>z>-149-r&&z<148+r&&x>-11-r&&x<(z>=-62-r&&z<=136+r?100:11)+r,
    description:'Con đường qua nông trường chè ở Nghĩa Hưng có hai hàng thông cổ thụ. Thân thông mang biển kiểm kê màu xanh; tán các cây gặp nhau trên cao. Trong ô chè phía đông nam đường, các luống cắt tán cách nhau khoảng 1,5 m, chạy gần vuông góc với đường. Cảnh dựng một đoạn khoảng 290 m của hàng thông và một ô chè còn nhận rõ trên ảnh vệ tinh.',
    arrivalNote:'Từ đập Nghĩa Hưng theo đường vào nông trường. Xe dừng cạnh chỗ lề đất mở rộng phía tây bắc của hàng thông. Từ đây có thể đi bộ dọc hàng cây và nhìn sang luống chè bên kia đường.',
    views:[shot('Dưới hai hàng thông cổ thụ',-.16,-9.4,7.0,19.5,-.14,.03,61),
      shot('Những luống chè chạy ngang hàng thông',29,8.8,7.3,17.8,.88,.19,60),
      shot('Đường thông và ô chè nhìn từ trên cao',29,1,12.6,88,.64,.61,60)],build});
})();

export default window.VietnamSights;
