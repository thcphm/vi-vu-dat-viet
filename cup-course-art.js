'use strict';

function buildCupCourseArt(breads,ramp){
  // One baked crust texture for the whole route. The UV seam runs under the loaf.
  const canvas=document.createElement('canvas');
  canvas.width=512;canvas.height=256;
  const ctx=canvas.getContext('2d');
  const crust=ctx.createLinearGradient(0,0,0,256);
  for(const [t,color] of [[0,'#935326'],[.23,'#df9347'],[.47,'#bf6c29'],[.57,'#c37832'],[.77,'#edab5c'],[1,'#935326']])crust.addColorStop(t,color);
  ctx.fillStyle=crust;ctx.fillRect(0,0,512,256);
  let seed=71;
  function noise(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
  function flecks(count,area,light,dark){
    for(let i=0;i<count;i++){
      ctx.fillStyle=i%3?light:dark;
      ctx.fillRect(noise()*512,noise()*area,1+noise()*2,1+noise());
    }
  }
  flecks(8000,256,'rgba(255,229,175,.18)','rgba(111,55,23,.19)');
  for(const x of [92,193,296,399]){
    ctx.save();ctx.translate(x,116);ctx.rotate(-.56);
    ctx.beginPath();ctx.moveTo(-12,-57);
    ctx.bezierCurveTo(12,-43,27,28,11,57);ctx.bezierCurveTo(-5,41,-24,-25,-12,-57);ctx.closePath();
    const cut=ctx.createLinearGradient(-19,0,21,0);
    for(const [stop,color] of [[0,'#8e4822'],[.19,'#ffdda1'],[.65,'#ffe5b2'],[.88,'#ecc18a'],[1,'#925026']])cut.addColorStop(stop,color);
    ctx.fillStyle=cut;ctx.fill();ctx.clip();
    for(let i=0;i<90;i++){
      ctx.fillStyle='rgba(147,86,40,.3)';ctx.fillRect(noise()*40-20,noise()*120-60,2,2);
    }
    ctx.restore();
  }
  const crustMap=new T.CanvasTexture(canvas);crustMap.colorSpace=T.SRGBColorSpace;
  const breadMaterial=new T.MeshStandardMaterial({map:crustMap,roughness:.85,emissive:0x40210b,emissiveIntensity:.35});
  const haloMaterial=new T.MeshBasicMaterial({color:0xffcc56,toneMapped:false});
  const haloGeometry=new T.TorusGeometry(.73,.033,6,40);
  const vertices=[],uv=[],indices=[];
  const rings=28,sides=24;
  for(let i=0;i<=rings;i++){
    const u=i/rings,x=(2*u-1)*.99;
    const radius=.35*Math.pow(Math.max(0,Math.sin(Math.PI*u)),.54);
    for(let j=0;j<=sides;j++){
      const v=j/sides,a=(v-.5)*2*Math.PI;
      vertices.push(x,radius*Math.cos(a)*.9+.07*x*x,radius*Math.sin(a));
      uv.push(u,v);
      const n=i*(sides+1)+j;
      if(i&&j)indices.push(n-sides-2,n,n-1,n-sides-2,n-sides-1,n);
    }
  }
  const breadGeometry=new T.BufferGeometry();
  breadGeometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
  breadGeometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  breadGeometry.setIndex(indices);breadGeometry.computeVertexNormals();
  for(const bread of breads){
    const p=at(bread.d,bread.offset);
    const group=new T.Group();group.name='Bánh mì nitro';
    const loaf=new T.Mesh(breadGeometry,breadMaterial);
    loaf.rotation.set(.53,-.17,.26);loaf.castShadow=true;group.add(loaf);
    const halo=new T.Mesh(haloGeometry,haloMaterial);halo.rotation.x=Math.PI/2;halo.position.y=-.51;group.add(halo);
    bread.baseY=p.y+1.43;bread.mesh=group;
    group.position.set(p.x,bread.baseY,p.z);group.rotation.y=-p.h;scene.add(group);
  }

  // Batch the course markings by finish. All vertices use the same ramp profile as the tyres.
  const batches=new Map();
  function vertex(d,l,dy=0){const p=at(d,l);return [p.x,p.y+dy,p.z,l/6,d/6];}
  function quad(surface,a,b,c,d){
    let batch=batches.get(surface);
    if(!batch){batch={positions:[],uv:[],indices:[]};batches.set(surface,batch);}
    const n=batch.positions.length/3;
    for(const [x,y,z,u,v] of [a,b,c,d]){batch.positions.push(x,y,z);batch.uv.push(u,v);}
    batch.indices.push(n,n+1,n+2,n,n+2,n+3);
  }
  const amber=0xf9b33b,white=0xf7eed8,steel=0x383e40,asphaltSpur=0xb8b9af,shoulder=0x8e8878;
  function deckPoint(d,l){return vertex(d,l,.035+cupRampHeight(d,l));}
  function markPoint(d,l){return vertex(d,l,.055+cupRampHeight(d,l));}
  const outerEdge=d=>-roadHalfWidth-cupSpurWidth(d);
  function verge(d,l){
    const p=vertex(d,l-.65);p[1]=renderedGround(p[0],p[2])-.025;return p;
  }
  for(let d=ramp.entry;d<ramp.exit;d++){
    const next=d+1,e=outerEdge(d),f=outerEdge(next);
    quad(asphaltSpur,vertex(d,e,.015),vertex(d,-roadHalfWidth,.015),vertex(next,-roadHalfWidth,.015),vertex(next,f,.015));
    quad(shoulder,verge(d,e),vertex(d,e,.014),vertex(next,f,.014),verge(next,f));
    if(cupSpurWidth(d)<.45||cupSpurWidth(next)<.45)continue;
    quad(white,vertex(d,e+.12,.038),vertex(d,e+.25,.038),vertex(next,f+.25,.038),vertex(next,f+.12,.038));
  }
  const left=ramp.offset-ramp.halfWidth,right=ramp.offset+ramp.halfWidth;
  for(let d=ramp.start;d<ramp.lip+3;d+=.5){
    const next=d+.5;
    for(let j=0;j<16;j++){
      const a=left+j*(right-left)/16,b=left+(j+1)*(right-left)/16;
      quad(steel,deckPoint(d,a),deckPoint(d,b),deckPoint(next,b),deckPoint(next,a));
    }
    for(const edge of [left,right]){
      const sign=edge===left?1:-1,color=Math.floor((d-ramp.start)/1.5)%2?steel:amber;
      quad(color,vertex(d,edge),deckPoint(d,edge),deckPoint(next,edge),vertex(next,edge));
      const a=edge+.12*sign,b=edge+.28*sign;
      quad(color,markPoint(d,a),markPoint(d,b),markPoint(next,b),markPoint(next,a));
    }
  }
  function chevron(d,l,halfWidth,length,color,veer=0){
    const tip=markPoint(d+length,l+veer),back=markPoint(d+length-.53,l+veer);
    for(const side of [-1,1]){
      const edge=l+side*halfWidth;
      quad(color,markPoint(d,edge),tip,back,markPoint(d-.53,edge));
    }
  }
  for(const d of [ramp.start-10,ramp.start+2,ramp.start+6,ramp.start+10]){
    chevron(d,ramp.offset,1.12,1.22,amber);
  }
  // Paired edge dashes leave the centre of the landing area clear.
  for(let d=ramp.lip+8;d<=ramp.exit-28;d+=7){
    for(const side of [-1,1]){
      const l=Math.max(outerEdge(d+2)+.4,ramp.offset+side*1.21);
      quad(white,markPoint(d,l-.075),markPoint(d,l+.075),markPoint(d+2,l+.075),markPoint(d+2,l-.075));
    }
  }
  for(const d of [ramp.exit-21,ramp.exit-12]){
    const mid=-roadHalfWidth-cupSpurWidth(d)*.5;
    const wide=Math.min(.72,cupSpurWidth(d)*.29);
    chevron(d,mid,wide,1.15,white,wide*.7);
  }
  for(const [color,batch] of batches){
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.Float32BufferAttribute(batch.positions,3));
    geometry.setAttribute('uv',new T.Float32BufferAttribute(batch.uv,2));geometry.setIndex(batch.indices);geometry.computeVertexNormals();
    const material=new T.MeshLambertMaterial({color,side:T.DoubleSide,map:color===asphaltSpur?asphalt:null});
    const mesh=new T.Mesh(geometry,material);mesh.receiveShadow=true;scene.add(mesh);
  }
  const signStation=ramp.entry-14,postOffset=-roadHalfWidth-3.2;
  board(signStation,postOffset,'↖  DỐC BAY','#80451c',4.8,2.65);
  const p=at(signStation,postOffset),ground=renderedGround(p.x,p.z);
  const postHeight=Math.max(.35,p.y+2.65-ground);
  const post=new T.Mesh(new T.BoxGeometry(.14,postHeight,.14),new T.MeshLambertMaterial({color:0x69716c}));
  post.position.set(p.x+.08*Math.sin(p.h),p.y+2.65-postHeight/2,p.z-.08*Math.cos(p.h));scene.add(post);
}
