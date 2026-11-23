/* Traffic models face +Z. Distances in the lesson increase towards world -Z. */
window.createStreetTraffic = function(scene,contactMap) {
  const T=window.THREE;
  const {load,clone}=window.TrafficModels;
  const library=new Map();
  const actors=[];
  const roadUsers=[];
  const shadowGeometry=new T.PlaneGeometry();
  const shadowMaterial=new T.MeshBasicMaterial({map:contactMap,transparent:true,opacity:.72,depthWrite:false});
  let courseId='', previousTime=0,previousDistance=0,crossingElapsed=0;
  function asset(name){
    if(!library.has(name))library.set(name,load.loadAsync('traffic/'+name+'.glb'));
    return library.get(name);
  }
  function actor(id,type,x,distance,width,length,velocity){
    const group=new T.Group();
    const shadow=new T.Mesh(shadowGeometry,shadowMaterial);
    shadow.rotation.x=-Math.PI/2;shadow.scale.set(width*3,length*2.8,1);
    shadow.position.y=.04;group.add(shadow);scene.add(group);
    const body={id,type,x,distance,halfWidth:width,halfLength:length,velocity,vx:0};
    const item={body,group,shadow,homeX:x,initial:distance,cruise:velocity,wheels:[],loaded:false};
    actors.push(item);
    return item;
  }
  const direction=new T.Vector3(), desired=new T.Vector3(), start=new T.Vector3();
  const rotation=new T.Quaternion(), jointRotation=new T.Quaternion(), parentRotation=new T.Quaternion();
  function pointJoint(rig,boneName,childName,target){
    const bone=rig.getObjectByName(boneName),child=rig.getObjectByName(childName);
    if(!bone || !child)return;
    bone.getWorldPosition(start);child.getWorldPosition(direction).sub(start).normalize();
    desired.copy(target).sub(start).normalize();
    rotation.setFromUnitVectors(direction,desired);
    bone.getWorldQuaternion(jointRotation);
    bone.parent.getWorldQuaternion(parentRotation).invert();
    bone.quaternion.copy(parentRotation.multiply(rotation).multiply(jointRotation));
    bone.updateWorldMatrix(true,true);
  }
  const helmetGeometry=new T.SphereGeometry(1,20,12,0,Math.PI*2,0,1.85);
  function seatDriver(rig,helmetColor){
    rig.updateWorldMatrix(true,true);
    const pelvis=rig.getObjectByName('hips').getWorldPosition(new T.Vector3());
    rig.position.set(-pelvis.x,.78-pelvis.y,-.10-pelvis.z);
    rig.updateWorldMatrix(true,true);
    for(const [suffix,s] of [['L',1],['R',-1]]){
      pointJoint(rig,'thigh_'+suffix,'calf_'+suffix,new T.Vector3(.19*s,.49,.27));
      pointJoint(rig,'calf_'+suffix,'foot_'+suffix,new T.Vector3(.17*s,.20,.19));
      pointJoint(rig,'foot_'+suffix,'toe_'+suffix,new T.Vector3(.16*s,.17,.46));
      pointJoint(rig,'upperarm_'+suffix,'forearm_'+suffix,new T.Vector3(.25*s,1.04,.14));
      pointJoint(rig,'forearm_'+suffix,'hand_'+suffix,new T.Vector3(.29*s,1.04,.43));
    }
    if(helmetColor===undefined)return;
    const head=rig.getObjectByName('head');
    const helmet=new T.Mesh(helmetGeometry,new T.MeshStandardMaterial({color:helmetColor,roughness:.28,metalness:.17}));
    helmet.scale.set(.123,.117,.135);
    head.getWorldPosition(helmet.position);helmet.position.y+=.12;
    rig.worldToLocal(helmet.position);rig.add(helmet);
  }
  function attachPerson(item,name,riderColor){
    return asset(name).then(data=>{
      const rig=clone(data.scene);rig.name=name;
      if(riderColor!==undefined){
        seatDriver(rig,riderColor);
      }else{
        rig.traverse(part=>{if(part.isMesh){part.castShadow=true;part.receiveShadow=true;}});
        const mixer=new T.AnimationMixer(rig),actions={};
        for(const clip of data.animations)actions[clip.name]=mixer.clipAction(clip);
        item.animate=(state,delta)=>{
          if(item.lastAction!==state){
            const next=actions[state]||actions.idle;
            const old=actions[item.lastAction];
            next.reset().play();
            if(old)old.crossFadeTo(next,.22,false);
            item.lastAction=state;
          }
          mixer.update(delta);
        };
        item.animate('idle',Math.abs(item.initial%3));
      }
      item.group.add(rig);
      item.loaded=true;
    });
  }
  function vehicle(id,model,x,d,width,length,v,color,riderColor){
    const item=actor(id,riderColor===undefined?'car':'bike',x,d,width,length,v);
    item.group.rotation.y=v>0?Math.PI:0;
    asset(model).then(data=>{
      const mesh=data.scene.clone(true);
      const paint=new Map();
      mesh.traverse(part=>{
        if(/^wheel_(FL|FR|RL|RR|F|R)$/.test(part.name)){
          item.wheels.push({part,rest:part.quaternion.clone()});
        }
        if(part.isMesh && color && /^(paint|paint_body)$/.test(part.material.name)){
          if(!paint.has(part.material)){
            const replacement=part.material.clone();replacement.color.setHex(color);paint.set(part.material,replacement);
          }
          part.material=paint.get(part.material);
        }
      });
      item.group.add(mesh);item.loaded=true;
      if(riderColor!==undefined)return attachPerson(item,'casual-walker',riderColor);
      return asset('casual-walker').then(person=>{
        const rig=clone(person.scene);
        seatDriver(rig);
        rig.scale.setScalar(.89);
        rig.position.add(new T.Vector3(.36,model==='kei-van'?-.07:-.23,.12));
        item.group.add(rig);
      });
    }).catch(error=>console.warn('Không tải được mô hình '+model,error));
    return item;
  }
  const cars=[
    vehicle('hatch-red','hatchback',-2.1,27,.91,2.05,-6.4,0xaa3931),
    vehicle('van-white','kei-van',-5.8,74,.78,1.7,-5.7),
    vehicle('hatch-blue','hatchback',-2.15,145,.91,2.05,-6.4,0x567c8d),
    vehicle('van-delivery','kei-van',5.8,79,.78,1.70,4.8,0x86b0a9)
  ];
  const bikes=[
    vehicle('scooter-blue','motor-scooter',6.15,19,.35,.93,4.3,null,0x345e72),
    vehicle('scooter-green','motor-scooter',-6.65,46,.35,.93,-4.8,null,0x43382d),
    vehicle('scooter-cream','motor-scooter',-2.0,101,.35,.93,-4.2,null,0xe4dbc3)
  ];
  const crossingPerson=actor('crosswalk','person',-8.65,93,.27,.27,0);
  const people=[
    [crossingPerson,'casual-walker'],
    [actor('foot-west','person',-8.9,15,.23,.27,-.86),'hiker'],
    [actor('foot-east','person',8.9,8,.23,.27,.83),'casual-walker'],
    [actor('shopper','person',9.1,54,.23,.27,0),'hiker'],
    [actor('worker','person',8.4,70,.25,.27,0),'road-worker'],
    [actor('foot-far','person',-9,136,.23,.27,.92),'casual-walker'],
    [actor('school-parent','person',8.8,27,.23,.27,0),'hiker'],
    [actor('school-student','person',9.4,29,.23,.27,0),'casual-walker'],
    [actor('school-walker','person',9.5,39,.22,.25,-.6),'hiker']
  ];
  for(const [person,ordinary] of people){
    const model=choosePedestrianModel(Math.random(),ordinary);
    attachPerson(person,model).catch(e=>console.warn(model,e));
  }
  const vehicles=cars.concat(bikes);
  let previousFrame=performance.now();
  window.strikeStreetTraffic=(other,hit,event,x,z)=>{
    const item=vehicles.find(a=>a.body.id===other.id);if(!item)return;
    item.bike=other.type==='bike';
    DriveBody.strikeTraffic(item,hit,event,item.cruise<0?Math.PI:0,x,z,other.x,-other.distance);
  };
  const axle=new T.Vector3(1,0,0),wheelAngle=new T.Quaternion();
  function updateVehicles(course,dt,red,playerDistance,playerX,playerSpeed){
    for(const a of vehicles){
      const b=a.body,sign=Math.sign(a.cruise);
      if(a.recoil?.fallen){b.velocity=b.vx=0;continue;}
      const limit=course.finish+48;
      const requiredStop=sign>0?course.crossing-2.5-b.halfLength:course.crossing+15+b.halfLength;
      let target=a.cruise;
      if(red && (requiredStop-b.distance)*sign>=-.03){
        const stopGap=Math.max(0,(requiredStop-b.distance)*sign);
        target=sign*Math.min(Math.abs(target),Math.sqrt(4*stopGap));
      }
      // Keep same-direction vehicles spaced apart, including while waiting at lights.
      for(const other of vehicles){
        if(other===a || Math.sign(other.cruise)!==sign || Math.abs(other.body.x-b.x)>1.2)continue;
        const gap=(other.body.distance-b.distance)*sign-b.halfLength-other.body.halfLength;
        if(gap>=0)target=sign*Math.min(Math.abs(target),Math.max(0,(gap-1.6)*1.2));
      }
      const behind=sign>0 && b.distance<playerDistance-2.1 && Math.abs(b.x-playerX)<b.halfWidth+1.1;
      const rearLimit=playerDistance-4.23-b.halfLength-.55;
      if(behind){
        const free=rearLimit-b.distance;
        target=Math.min(target,Math.max(0,playerSpeed/3.6+(free-1.6)*.85));
      }
      const change=Math.min(1,dt*3);
      b.velocity+=(target-b.velocity)*change;
      let next=b.distance+b.velocity*dt;
      if(behind && b.distance<=rearLimit && next>=rearLimit){next=rearLimit;b.velocity=Math.min(b.velocity,playerSpeed/3.6);}
      if(red && (requiredStop-b.distance)*sign>=0 && (next-requiredStop)*sign>0){
        b.distance=requiredStop;b.velocity=0;
      }else b.distance=next;
      if(b.distance < -28)b.distance=limit;
      if(b.distance > limit)b.distance=-28;
      const lastX=b.x;
      if(sign>0){
        const merge=course.id==='works'?1:Math.min(1,Math.max(0,(b.distance-course.finish+63)/22));
        b.x=a.homeX*(1-merge)+(course.id==='works'?2.5:4.65)*merge;
      }
      b.vx=dt?(b.x-lastX)/dt:0;
      a.spin=(a.spin||0)+Math.abs(b.velocity)*dt/(b.type==='bike'?.245:.31);
      wheelAngle.setFromAxisAngle(axle,a.spin);
      for(const wheel of a.wheels)wheel.part.quaternion.copy(wheel.rest).multiply(wheelAngle);
    }
  }
  function update(distance,time,green,playerX=2,playerSpeed=0){
    const now=performance.now(),visualDt=document.hidden?0:Math.min(.06,(now-previousFrame)/1000);previousFrame=now;
    const c=window.activeCourse || {id:'city',crossing:90,finish:180};
    const reset=courseId!==c.id || time<previousTime || distance<previousDistance-3;
    let dt=Math.min(.15,Math.max(0,time-previousTime));
    if(reset){
      for(const a of actors){
        a.body.x=a.homeX;a.body.distance=a.initial;a.body.velocity=a.cruise;a.body.vx=0;
        delete a.recoil;
      }
      courseId=c.id;crossingElapsed=0;dt=0;
    }
    previousTime=time;previousDistance=distance;
    const hasCrossing=Number.isFinite(c.crossing);
    if(hasCrossing && distance>=c.crossing-40 && !green)crossingElapsed+=dt;
    updateVehicles(c,dt,hasCrossing && distance>=c.crossing-42 && !green,distance,playerX,playerSpeed);
    const progress=green?1:Math.min(1,crossingElapsed/10.5);
    for(const [a] of people){
      const b=a.body;
      if(a===crossingPerson){
        b.x=-8.65+progress*17.3;b.distance=c.crossing+3;
        b.vx=progress>0 && progress<1?17.3/10.5:0;
        a.group.rotation.y=Math.PI/2;
        a.animate?.(b.vx?'walk':'look_around',dt);
      }else{
        b.distance+=a.cruise*dt;
        if(b.distance<0)b.distance=c.finish;
        if(b.distance>c.finish+18)b.distance=0;
        if(b.id==='worker')b.distance=c.id==='works'?65:c.crossing+11;
        a.group.rotation.y=a.cruise<0?0:a.cruise>0?Math.PI:-Math.PI/2;
        a.animate?.(a.cruise?'walk':b.id==='worker' && c.id==='works'?'wave':'look_around',dt);
      }
    }
    roadUsers.length=0;
    for(const a of actors){
      const b=a.body;
      DriveBody.advanceRecoil(a,visualDt);const r=a.recoil;
      a.group.position.set(b.x,b.type==='person' && Math.abs(b.x)>8.2?.12:0,-b.distance);
      if(b.type!=='person'){
        a.group.position.x+=r?.x||0;a.group.position.z+=r?.z||0;
        a.group.position.y=(r?.y||0)+(r?.fallen ? .25*Math.abs(Math.sin(r.roll)) : 0);
        a.group.rotation.set(-(r?.pitch||0),(a.cruise>0?Math.PI:0)-(r?.angle||0),-(r?.roll||0),'YXZ');
        a.shadow.visible=!r?.fallen;
      }
      b.velocityX=b.vx;
      const gateCrowd=b.id.startsWith('school-');
      if(gateCrowd && b.id!=='school-parent')a.group.scale.setScalar(.87);
      a.group.visible=(!gateCrowd || c.id==='school') && a.loaded && Math.abs(distance-b.distance)<125 && (a!==crossingPerson || hasCrossing);
      if(a.group.visible&&!(r?.y>1.35))roadUsers.push(r?{...b,x:a.group.position.x,distance:-a.group.position.z,
        velocityX:b.vx+r.vx,velocity:b.velocity-r.vz}:b);
    }
  }
  window.getDriveObstacles=()=>roadUsers;
  return {update};
};
