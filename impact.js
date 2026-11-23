/* Continuous intersection of the car's footprint against moving traffic. Positions are metres. */
window.firstRoadContact = function (before, after, dt, obstacles) {
  let first = null;
  for (const other of obstacles) {
    const dx = before.x - other.x;
    const dz = before.d - 2.1 - other.distance;
    const vx = after.x - before.x - (other.velocityX || 0) * dt;
    const vz = after.d - before.d - (other.velocity || 0) * dt;
    let entry = 0, exit = 1;
    for (const [offset, motion, radius] of [[dx, vx, .93 + other.halfWidth], [dz, vz, 2.07 + other.halfLength]]) {
      if (Math.abs(motion) < 1e-8) {
        if (Math.abs(offset) > radius) { entry = 2; break; }
      } else {
        const a = (-radius - offset) / motion, b = (radius - offset) / motion;
        entry = Math.max(entry, Math.min(a, b)); exit = Math.min(exit, Math.max(a, b));
      }
    }
    if (entry <= exit && (!first || entry < first.fraction)) {
      const atX=dx+entry*vx,atD=dz+entry*vz;
      const side=Math.abs(atX)/(.93+other.halfWidth)>Math.abs(atD)/(2.07+other.halfLength);
      first = {other,fraction:entry,relative:Math.hypot(vx,vz)/Math.max(.001,dt)*3.6,
        nx:side?(Math.sign(atX)||1):0,nz:side?0:-(Math.sign(atD)||1),depth:0,
        vx:(after.x-before.x)/Math.max(dt,.001),vz:-(after.d-before.d)/Math.max(dt,.001)};
    }
  }
  return first;
};

window.createImpactEffects = function(scene, canvas) {
  const T = window.THREE, particles = [];
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = textureCanvas.height = 64;
  const brush = textureCanvas.getContext('2d');
  const cloud = brush.createRadialGradient(32,32,0,32,32,32);
  cloud.addColorStop(0,'rgba(255,255,255,.9)');cloud.addColorStop(.5,'rgba(255,255,255,.48)');cloud.addColorStop(1,'rgba(255,255,255,0)');
  brush.fillStyle=cloud;brush.fillRect(0,0,64,64);
  const dustTexture=new T.CanvasTexture(textureCanvas), chip=new T.BoxGeometry(.055,.025,.085);
  const metal=new T.MeshStandardMaterial({color:0x685d4c,metalness:.35,roughness:.8});
  // Keep tyre marks in a bounded pool so several laps never grow the scene.
  const tread=new T.PlaneGeometry(.15,1);
  tread.rotateX(-Math.PI/2);
  const rubber=new T.MeshBasicMaterial({color:0x242421,transparent:true,opacity:.52,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const marks=[];
  let markIndex=0;
  window.markDriveTyres=(before,after)=>{
    const dx=after.x-before.x, dz=after.d-before.d, length=Math.hypot(dx,dz);
    if(length<.015)return;
    for(const offset of [-.76,.76]){
      const i=markIndex++%320;
      if(!marks[i]){marks[i]=new T.Mesh(tread,rubber);scene.add(marks[i]);}
      const mark=marks[i];
      mark.position.set((before.x+after.x)/2+offset,.033,3.35-(before.d+after.d)/2);
      mark.rotation.y=-Math.atan2(dx,dz);mark.scale.z=length+.025;mark.visible=true;
    }
  };
  window.resetDriveTyres=()=>{for(const mark of marks)mark.visible=false;markIndex=0;};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let start=0,last=0,strength=0,side=1;
  function clear(){
    for(const p of particles){scene.remove(p.mesh);if(p.dust)p.mesh.material.dispose();}
    particles.length=0;strength=0;
  }
  const glass=document.getElementById('impactGlass');
  const pen=glass.getContext('2d');
  window.clearWindscreen=()=>pen.clearRect(0,0,glass.width,glass.height);
  function fracture(side,force){
    const x=side>0?755:191,y=95+Math.random()*49;
    pen.lineWidth=.9;pen.strokeStyle='rgba(237,248,250,.66)';
    const rays=[];
    for(let i=0;i<9;i++){
      let a=i*Math.PI*2/9+Math.random()*.25,px=x,py=y;
      const points=[];pen.beginPath();pen.moveTo(px,py);
      for(let j=0;j<5;j++){a+=(Math.random()-.5)*.43;const step=4+Math.random()*20*force;
        px+=Math.cos(a)*step;py+=Math.sin(a)*step;points.push([px,py]);pen.lineTo(px,py);}
      rays.push(points);pen.stroke();
    }
    pen.strokeStyle='rgba(206,230,238,.42)';
    for(let i=0;i<rays.length;i++){
      const end=rays[(i+1)%rays.length][1];
      pen.beginPath();pen.moveTo(...rays[i][1]);pen.lineTo(...end);pen.stroke();
    }
  }
  window.showDriveImpact = ({x,distance,intensity,type,direction}) => {
    clear(); start=last=performance.now();strength=intensity;side=direction || 1;
    if(intensity>.4 && type!=='person' && type!=='curb')fracture(side,intensity);
    const amount = type==='person' ? 0 : Math.round(6+14*intensity);
    for(let i=0;i<amount;i++){
      const dust=i%2===0;
      const mesh=dust?new T.Sprite(new T.SpriteMaterial({map:dustTexture,color:0xa49984,transparent:true,depthWrite:false})):new T.Mesh(chip,metal);
      mesh.position.set(x,.35+Math.random()*.35,-distance);
      scene.add(mesh);
      particles.push({mesh,dust,dx:(Math.random()-.5)*4,dy:1+Math.random()*3,dz:Math.random()*3-.5});
    }
    if(!reduced.matches && navigator.vibrate)navigator.vibrate([40,30,Math.round(30+strength*45)]);
  };
  window.clearDriveImpact=clear;
  return { update(camera) {
    if(!strength)return;
    const now=performance.now(),age=(now-start)/1000,dt=Math.min(.08,(now-last)/1000);last=now;
    if(age>1.35){clear();return;}
    if(!reduced.matches){
      const recoil=strength*Math.exp(-age*7.5);
      camera.rotation.z+=Math.sin(age*34)*recoil*.045*side;
      camera.rotateX(Math.cos(age*28)*recoil*.04);
    }
    for(const p of particles){
      p.mesh.position.x+=p.dx*dt;p.mesh.position.z+=p.dz*dt;p.mesh.position.y+=p.dy*dt;
      if(p.dust){p.dy*=Math.exp(-dt*4);p.mesh.scale.setScalar(.13+age*.9);p.mesh.material.opacity=.46*Math.max(0,1-age/1.35);}
      else {p.dy-=9.8*dt;if(p.mesh.position.y<.04){p.mesh.position.y=.04;p.dy=Math.abs(p.dy)*.24;}p.mesh.rotation.x+=dt*7;}
    }
  }};
};
