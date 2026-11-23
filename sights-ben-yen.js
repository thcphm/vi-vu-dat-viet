'use strict';
(() => {
  const catalogId='osm-node-7173617332',atlas=window.VietnamTourism;
  const site=atlas.byId?.get(catalogId)??atlas.entries.find(s=>s.id===catalogId);
  // East/south metres from the ferry terminal. The platform is OSM w768420495.
  const platform=[[22.72,-29.22],[-110.92,83.37],[-252.22,198.81]];
  function hull(T){
    // A folded open hull. The shallow floor, flare and rolled gunwale remain
    // visible from the benches. Join the inner skin back into the rim.
    const points=[],indices=[];
    const stations=[[-3.3,.018,.26],[-2.7,.48,.11],[-1.8,.76,.03],[0,.84,0],[1.8,.78,.04],[2.75,.53,.13],[3.45,.018,.29]];
    for(const [z,w,rise] of stations){
      for(const [fraction,y] of [[-1,.39],[-.82,.0],[-.49,-.20],[.49,-.20],[.82,0],[1,.39],[.93,.38],[.76,.025],[.45,-.135],[-.45,-.135],[-.76,.025],[-.93,.38]])
        points.push(fraction*w,y+rise,z);
    }
    for(let i=0;i<stations.length-1;i++)for(let j=0;j<12;j++){
      const a=i*12+j,b=i*12+(j+1)%12;
      indices.push(a,b,a+12,b,b+12,a+12);
    }
    const mesh=new T.BufferGeometry();
    mesh.setAttribute('position',new T.Float32BufferAttribute(points,3));mesh.setIndex(indices);mesh.computeVertexNormals();return mesh;
  }
  function build(T,k){
    const shell=hull(T),wood=0x93724e,alloy=0x8a9995,landing=0xaaa69a;
    k.palette({timber:wood,metal:[alloy,0x588385,0x5b8076,0x74918d],stone:landing});
    const floats=[],slabs=[];
    function moor(x,z,angle,index){
      const first=k.vertexCount();
      k.place(x,z,angle,()=>{
        k.stamp(shell,[0x588385,alloy,0x5b8076,0x74918d][index%4],0,0,0);
        for(const bench of [-1.75,-.66,.48,1.64])k.box(wood,0,.23,bench,1.27,.075,.24);
        k.box(wood,-.33,.34,-.22,.05,.06,2.7,-.12);
        k.box(0x775e48,-.16,.34,-1.79,.15,.06,.65,-.12);
        if(index%3===1)k.box(0xcb6e3a,.19,.34,.50,.38,.12,.41,.12);
      });
      floats.push({x,z,first,end:k.vertexCount()});
    }
    for(let i=1;i<platform.length;i++){
      const [ax,az]=platform[i-1],[bx,bz]=platform[i],length=Math.hypot(bx-ax,bz-az);
      const ux=(bx-ax)/length,uz=(bz-az)/length,nx=uz,nz=-ux;
      const divisions=Math.ceil(length/5),span=length/divisions,axis=Math.atan2(ux,uz);
      for(let j=0;j<divisions;j++){
        const t=(j+.5)*span,x=ax+t*ux,z=az+t*uz,first=k.vertexCount();
        k.place(x,z,axis,()=>{
          k.box(landing,-.43,-.43,0,2.6,1.28,span+.015);
          k.box(0xb3afa3,1.12,-.57,0,.58,.88,span+.015);
        });
        slabs.push({x,z,first,end:k.vertexCount()});
      }
      // Groups of open rowing boats wait with their bows toward the bank.
      // Their individual positions vary as the boatmen collect passengers.
      let next=5;
      for(let j=0;next<length-4;j++){
        const t=next;next+=j%8===5?11.0:2.4+.30*(1+Math.sin(j*2.2));
        const angle=Math.atan2(-nx,-nz)+.15*Math.sin(j*.88+i);
        moor(ax+t*ux+nx*5.1,az+t*uz+nz*5.1,angle,j);
      }
    }
    // Smaller groups wait along the opposite bank. These are the same
    // estimated bank stations as the channel in sights-natural.js.
    const far=[[42.0,-7.91],[-83.20,113.97],[-212.56,242.93]];
    for(const [section,at,count] of [[0,.08,4],[0,.34,5],[0,.68,6],[1,.12,4],[1,.53,5]]){
      const [ax,az]=far[section],[bx,bz]=far[section+1],length=Math.hypot(bx-ax,bz-az);
      const ux=(bx-ax)/length,uz=(bz-az)/length,nx=-uz,nz=ux;
      for(let j=0;j<count;j++){
        const t=length*at+j*2.85;
        moor(ax+t*ux+nx*5.8,az+t*uz+nz*5.8,Math.atan2(-nx,-nz)+.18*Math.sin(j+at),j+section);
      }
    }
    shell.dispose();
    let rest;
    k.group.userData.fitGround=ground=>{
      const g=k.group.children.find(m=>m.geometry?.attributes.finishKind)?.geometry;
      if(!g)return;
      const p=g.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      for(const r of floats){
        const level=ground(r.x,r.z)-.59;
        for(let i=r.first;i<r.end;i++)p.setY(i,rest[i]+level);
      }
      // Match adjacent slab ends on sloping DEM samples without pitching
      // the boats. The seats and hull of each boat share a single waterline.
      for(const r of slabs)for(let i=r.first;i<r.end;i++)
        p.setY(i,rest[i]+ground(p.getX(i),p.getZ(i)));
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...site,id:'ben-yen-chua-huong',catalogId,name:'Bến Yến (Chùa Hương)',
    yaw:0,width:285,depth:236,solids:[],gardenRadius:1,reserve:()=>false,
    boundary:[[-4,-2],[-3,-2],[-3,-1],[-4,-1]],
    photo:'https://anninhthudo.vn/khung-canh-vang-ve-cua-chua-huong-truoc-gio-chinh-thuc-mo-cua-tro-lai-post495393.antd',
    map:'https://www.openstreetmap.org/way/768420495',
    description:'Dọc bờ tây bắc suối Yến, những chiếc đò chèo tay quay mũi vào bến. Từ đây, đò rời làng Yến Vỹ để vào khu chùa Hương. Vị trí từng chiếc đò được bố trí minh họa.',
    views:[{name:'Dãy đò bên bến Yến',offset:[-30,25],viewAngle:2.45,viewRadius:61,viewElevation:.34,height:2.2},
      {name:'Mạn đò và những hàng ghế',offset:[-8,4],viewAngle:.95,viewRadius:13,viewElevation:.32,height:1.15},
      {name:'Suối Yến rời làng',offset:[-148,133],viewAngle:2.44,viewRadius:131,viewElevation:.38,height:6}],build});
})();
