// Roadside buildings face the carriageway. All repeated masonry, poles and roofs are instanced.
function distantHills(){
  const group=new T.Group();
  for(let band=0;band<2;band++){
    const vertices=[],colors=[],indices=[],shade=new T.Color(),radius=band?760:970,columns=256;
    for(let i=0;i<=columns;i++){
      const a=i/columns*Math.PI*2;
      const peaks=Math.abs(Math.sin(5*a+.6)+.55*Math.sin(11*a)+.25*Math.cos(23*a+.7));
      const height=(river?43:75)+(river?39:76)*peaks+(band?0:45);
      for(let row=0;row<5;row++){
        const t=row/4,r=radius+t*100;
        vertices.push(Math.cos(a)*r,-16+(height+16)*t,Math.sin(a)*r);
        shade.set(band?0x475f53:0x758984).multiplyScalar(.75+.24*t+.17*Math.cos(5*a)+.1*Math.sin(17*a+t*3));
        colors.push(shade.r,shade.g,shade.b);
      }
      if(i)for(let j=0;j<4;j++){const n=i*5+j;indices.push(n-5,n,n+1,n-5,n+1,n-4);}
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setIndex(indices);
    group.add(new T.Mesh(geo,new T.MeshBasicMaterial({vertexColors:true,side:T.DoubleSide})));
  }scene.add(group);return group;
}
// Join the exact perimeter vertices of the detailed ground to progressively
// wider rings. All ridges stay fixed in local map coordinates as the car turns.
function mountainHorizon(near,relief){
  const {x0,z0,grid,nx,nz}=near,x1=x0+(nx-1)*grid,z1=z0+(nz-1)*grid;
  const vertices=[],normals=[],indices=[],uv=[],marine=[];
  const rings=[0];
  for(let r=18;r<13900;r+=Math.min(190,18+r*.045))rings.push(r);
  for(let side=0;side<4;side++){
    let previous=null;
    for(const offset of rings){
      const west=x0-offset,east=x1+offset,north=z0-offset,south=z1+offset;
      const corners=[[west,north],[west,south],[east,south],[east,north]],a=corners[side],b=corners[(side+1)%4];
      const length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      const count=offset===0?(side%2?nx-1:nz-1):Math.ceil(length/Math.min(190,18+offset*.045));
      const row=[];
      for(let i=0;i<=count;i++){
        const f=i/count,x=a[0]+(b[0]-a[0])*f,z=a[1]+(b[1]-a[1])*f;
        marine.push(relief.depth(x,z));row.push(vertices.length/3);vertices.push(x,relief.ground(x,z),z);uv.push(x/32,z/32);
        const e=Math.max(28,Math.min(110,offset*.04)),dx=(relief.ground(x-e,z)-relief.ground(x+e,z))/(2*e),
          dz=(relief.ground(x,z-e)-relief.ground(x,z+e))/(2*e),len=Math.hypot(dx,1,dz);
        normals.push(dx/len,1/len,dz/len);
      }
      if(previous){
        let i=0,j=0;
        while(i+1<previous.length||j+1<row.length){
          if(j+1===row.length||(i+1<previous.length&&(i+1)*count<=(j+1)*(previous.length-1))){
            indices.push(previous[i],row[j],previous[++i]);
          }else{
            indices.push(previous[i],row[j],row[++j]);
          }
        }
      }
      previous=row;
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
  g.setAttribute('marine',new T.Float32BufferAttribute(marine,1));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setIndex(indices);
  // Reuse near-ground colour in the first band, then grade hills by aspect and
  // canopy density. Distance fog attenuates the ridges in the scene shader.
  const mat=new T.MeshLambertMaterial({color:0x55746b,side:T.DoubleSide,map:meadow});
  mat.onBeforeCompile=shader=>{
    shader.vertexShader='attribute float marine; varying float seaDepth; varying vec3 vistaPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n vistaPoint=position; seaDepth=marine;');
    shader.fragmentShader='varying float seaDepth; varying vec3 vistaPoint;\n'+shader.fragmentShader.replace('#include <map_fragment>',`
      vec2 p=vistaPoint.xz;
      float thickets=sin(p.x*.015+sin(p.y*.009))*sin(p.y*.022-p.x*.008);
      vec3 finer=texture2D(map,vMapUv*2.17+p.yx*.0019).rgb;
      float spur=sin(dot(p,vec2(.0027,.0017))+sin(p.y*.0043));
      vec3 canopy=texture2D(map,vMapUv).rgb;
      diffuseColor.rgb*=mix(vec3(.72,.87,.79),vec3(1.12,1.04,.84),.5+.5*spur);
      diffuseColor.rgb*=.59+dot(canopy,vec3(.36,.49,.15))*.85+dot(finer,vec3(.29,.44,.27))*.45+thickets*.11;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.078,.13,.14),.18);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.047,.134,.139),smoothstep(.3,2.,seaDepth));`);
    passSurface?.shade(shader,'vistaPoint.xz','.87');
  };
  if(route.stage&&marine.some(d=>d>0)){
    const sea=[],profile=[];
    for(let i=0;i<marine.length;i++){
      const j=i*3,depth=relief.seaLevel-vertices[j+1];
      sea.push(vertices[j],relief.seaLevel,vertices[j+2]);
      profile.push(.13,-.08,(marine[i]>0?depth:Math.min(-.02,depth))*2.6);
    }
    addCourseWater(sea,profile,indices,'Coastal waterline');
  }
  const mesh=new T.Mesh(g,mat);mesh.name='Geographic mountain ridges';scene.add(mesh);return mesh;
}
function buildRoadside(){
  const wirePoints=[],loader=new T.TextureLoader();
  const facades=['cafe','bakery','grocer','pho'].map(name=>{
    const image=loader.load('streetscape/surfaces/front-'+name+'.webp');image.colorSpace=T.SRGBColorSpace;image.anisotropy=4;
    return {mat:new T.MeshStandardMaterial({map:image,roughness:.91}),matrices:[]};
  });
  function store(d,l,variant){
    const p=at(d,l),wide=5.8+variant*.46,depth=5.9,h=3.75,side=Math.sign(l);
    // A level slab stepped into the hill supports the facade and its fittings.
    const {low,high}=footing(p,depth+.23,wide+.23);
    if(high-low>2.2||nearest(p.x,p.z).dist<9||besideWater(d)&&low<waterLevel+.4||onBranch(p.x,p.z,6))return;
    const y=high+.06;
    function part(along,across,kind,color,w,h,span,base){
      const q=localPoint(p,across,along);scatter(kind,color,q.x,y+base+h/2,q.z,w,h,span,-p.h);
    }
    scatter('box',0x817d6e,p.x,(y+low-.24)/2,p.z,depth+.23,y-low+.24,wide+.23,-p.h);
    part(0,0,'box',0xbdb39a,depth,h,wide,0);
    scatter('box',variant%2?0x806458:0x637779,p.x,y+h+.115,p.z,depth+.42,.23,wide+.58,-p.h);
    const f=localPoint(p,-side*(depth/2+.022),0);
    temp.position.set(f.x,y+h/2,f.z);temp.rotation.set(0,-p.h-side*Math.PI/2,0);temp.scale.set(wide,h,1);temp.updateMatrix();
    facades[variant].matrices.push(temp.matrix.clone());
    const awning=-side*(depth*.5+.78),porch=localPoint(p,awning,0);
    const porchFloor=Math.min(y-.1,footing({...porch,h:p.h},2.2,wide+.5).low-.12);
    part(0,awning,'box',variant%2?0x796758:0x68807b,1.85,.12,wide+.32,2.58);
    for(let dz=-wide/2;dz<wide/2;dz+=.22)part(dz,awning,'box',0x89918a,1.84,.05,.044,2.67);
    for(const dz of [-1,1])part(dz*(wide*.48),awning-side*.79,'pole',0x596864,.082,2.68,.082,0);
    part(0,awning,'box',0xada89a,2.2,y+.04-porchFloor,wide+.5,porchFloor-y);
    part(wide*.28,side*.35,'pole',0x98aaab,1.05,.95,1.05,h+.23);
    for(const offset of [-1.35,1.35]){
      part(-wide/2-.04,offset,'box',0x88897a,1.48,1.44,.12,1.18);
      part(-wide/2-.12,offset,'box',0x4b615b,1.27,1.24,.07,1.27);
      for(const slit of [-.4,0,.4])part(-wide/2-.17,offset+slit,'box',0x999888,.035,1.24,.035,1.27);
      part(-wide/2-.22,offset,'box',0xb7b3a1,1.68,.10,.45,2.63);
    }
  }
  const clusters=river?[16,145,305,495,935,1235,1510,1830,2080]:[20,355,700,1120,1435,1770,2205];
  for(const [i,d] of clusters.entries()){
    if(d>route.finish-25||route.stage&&i%3!==0||featuredPass&&i===0)continue;
    for(let k=0;k<(i%3===0?3:2);k++)store(d+k*9.3,river?14+k*.7:(i%2?-1:1)*(16+k*.65),(i+k+(river?0:3))%4);
  }
  for(const group of facades){
    const m=new T.InstancedMesh(new T.PlaneGeometry(1,1),group.mat,group.matrices.length);
    group.matrices.forEach((mat,i)=>m.setMatrixAt(i,mat));m.receiveShadow=true;scene.add(m);
  }
  let last;
  for(let d=1;d<route.finish+18;d+=34){
    if(!route.stage&&d>bridgeStart-8&&d<bridgeEnd+8){last=null;continue;}
    const p=at(d,8.8),y=renderedGround(p.x,p.z),height=6.8;
    if(onBranch(p.x,p.z,1)||besideWater(d)&&y<waterLevel+.2){last=null;continue;}
    scatter('pole',0xaaa69a,p.x,y+height/2,p.z,.21,height,.21);
    scatter('box',0x65665f,p.x,y+height-.38,p.z,1.55,.1,.14,-p.h);
    const wires=[];
    for(const dx of [-.62,0,.62]){
      const q=at(d,8.8+dx),top=new T.Vector3(q.x,y+height-.16,q.z);wires.push(top);
      scatter('pole',0x64554b,top.x,top.y-.12,top.z,.11,.27,.11);
    }
    if(last)wires.forEach((tip,index)=>{
      const begin=last[index];let a=begin;
      for(let n=1;n<=8;n++){const t=n/8,b=begin.clone().lerp(tip,t);b.y-=2.6*t*(1-t);wirePoints.push(a.x,a.y,a.z,b.x,b.y,b.z);a=b;}
    });last=wires;
  }
  const line=new T.BufferGeometry();line.setAttribute('position',new T.Float32BufferAttribute(wirePoints,3));
  scene.add(new T.LineSegments(line,new T.LineBasicMaterial({color:0x464840,transparent:true,opacity:.68})));
}
