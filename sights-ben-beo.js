'use strict';
(()=>{
  const atlas=window.VietnamTourism,catalogId='osm-node-778791182';
  const stop=atlas.byId?.get(catalogId)??atlas.entries.find(s=>s.id===catalogId);
  // OSM w1275176935 version 2. Local east/south metres from the ferry terminal.
  // The first vertex is shared by the street (w62343792) and footway (w62343793).
  const quay=[[-14.13,-4.85],[-13.76,-13.02],[-12.96,-15.00],[-8.75,-13.31],[-10.91,-7.93],
    [-3.04,-4.77],[-.72,-10.50],[6.23,-7.72],[3.82,-1.76],[1.15,-2.84],[-.99,2.43],
    [.92,3.19],[-1.47,10.37],[-14.47,8.35]];
  const road=[107.057865,20.731873],deckLevel=.20;
  function build(T,k){
    const wall=0x958f7d,wet=0x686f60,concrete=0xbdb5a3,cap=0xc4b9a4,iron=0x504d43,rubber=0x383b38;
    k.palette({stone:[wall,wet,cap],plaster:concrete,metal:iron});
    const outline=new T.Shape(quay.map(([x,z])=>new T.Vector2(x,-z)));
    // Keep the concave re-entrants open and carry the quay face below the tidal surface.
    function layer(bottom,top,colour,cover=false){
      const g=new T.ExtrudeGeometry(outline,{depth:top-bottom,bevelEnabled:false});
      g.rotateX(-Math.PI/2);(cover?k.groundStamp:k.stamp)(g,colour,0,bottom,0);g.dispose();
    }
    layer(-5.5,-1.68,wet);layer(-1.68,-.20,wall);layer(-.20,deckLevel,concrete,true);
    // Horizontal construction joints end at the polygon boundary, including both notches.
    for(let z=-11.5;z<9;z+=4.45){
      const cross=[];
      for(let i=0;i<quay.length;i++){
        const [x,a]=quay[i],[xx,b]=quay[(i+1)%quay.length];
        if((a>z)!==(b>z))cross.push(x+(xx-x)*(z-a)/(b-a));
      }
      cross.sort((a,b)=>a-b);
      for(let i=0;i+1<cross.length;i+=2)k.box(0x8e897c,(cross[i]+cross[i+1])/2,deckLevel+.004,z,cross[i+1]-cross[i],.012,.031);
    }
    const tire=new T.TorusGeometry(.336,.105,8,24),ring=new T.TorusGeometry(.118,.032,6,16);
    function edge(i){
      const [ax,az]=quay[i],[bx,bz]=quay[(i+1)%quay.length],dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz);
      const ux=dx/len,uz=dz/len;return {ax,az,ux,uz,nx:uz,nz:-ux,len};
    }
    // Only edges 1–11 meet the water on the mapped coastline w1573997409.
    for(let i=1;i<=11;i++){
      const {ax,az,ux,uz,nx,nz,len}=edge(i),angle=Math.atan2(ux,uz);
      const count=Math.ceil(len/2.25),run=len/count;
      for(let j=0;j<count;j++){
        const t=run*(j+.5);
        k.box(cap,ax+ux*t-nx*.10,deckLevel+.017,az+uz*t-nz*.10,.20,.045,run-.035,angle);
      }
    }
    // The operator's harbour photos show a low quayside with small tie-off
    // fittings and dark fenders on the berth edges. Keep the gangway clear.
    for(const [i,t] of [[6,.42],[7,.55],[9,.64],[11,.38]]){
      const {ax,az,ux,uz,nx,nz,len}=edge(i),x=ax+ux*len*t,z=az+uz*len*t,angle=Math.atan2(nx,nz);
      k.stamp(tire,rubber,x+nx*.12,-.64,z+nz*.12,1,1,.90,angle);
      k.stamp(ring,iron,x+nx*.10,-.16,z+nz*.10,.73,1,.78,angle);
      for(const off of [-.13,.13])k.box(iron,x+ux*off+nx*.10,-.30,z+uz*off+nz*.10,.034,.29,.038,angle);
    }
    tire.dispose();ring.dispose();
    for(const [i,t] of [[3,.34],[6,.27],[7,.22],[11,.71]]){
      const {ax,az,ux,uz,nx,nz,len}=edge(i),x=ax+ux*len*t-nx*.48,z=az+uz*len*t-nz*.48;
      k.stamp(k.round,iron,x,deckLevel+.045,z,.24,.09,.24);
      k.tapered(iron,x,deckLevel+.20,z,.145,.125,.23,1,14);
      k.tapered(iron,x,deckLevel+.355,z,.145,.205,.10,1,14);
    }
    // The land rises at the northwest corner of the quay. Join only that
    // corner to the bank. The road threshold and seaward loading face stay level.
    const faces=T.ShapeUtils.triangulateShape(outline.getPoints(),[]),weights=quay.map((_,i)=>i===1||i===2?1:0);
    function bankWeight(x,z){
      if(x>-7||z>-4.84)return 0;
      let closest=Infinity,value=0;
      for(const [i,j,n] of faces){
        const [ax,az]=quay[i],[bx,bz]=quay[j],[cx,cz]=quay[n];
        const det=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);
        const a=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/det,b=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/det,c=1-a-b;
        const outside=Math.max(0,-a,-b,-c);
        if(outside<closest){closest=outside;value=a*weights[i]+b*weights[j]+c*weights[n];}
        if(outside<1e-6)break;
      }
      return Math.max(0,Math.min(1,value));
    }
    let rest,influence;
    k.group.userData.fitGround=ground=>{
      const g=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;
      if(!g)return;
      const p=g.attributes.position;
      if(!rest){
        rest=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
        influence=Float32Array.from({length:p.count},(_,i)=>bankWeight(p.getX(i),p.getZ(i)));
      }
      const rise=Math.max(0,Math.max(ground(...quay[1]),ground(...quay[2]))-deckLevel+.055);
      for(let i=0;i<p.count;i++)p.setY(i,rest[i]+influence[i]*rise);
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...stop,id:'ben-tau-cai-beo',catalogId,name:'Bến Bèo',kind:'Bến tàu',
    lon:107.0589122,lat:20.732131,yaw:0,start:road,visitOnArrival:true,mappedEntrance:true,
    source:'https://catba.com.vn/pic/general/files/Th%C3%B4ng%20tin%20Du%20l%E1%BB%8Bch%20huy%E1%BB%87n%20C%C3%A1t%20H%E1%BA%A3i.pdf',
    photo:'https://quangthangcatba.com/ben-beo-habour',map:'https://www.openstreetmap.org/way/1275176935',
    description:'Cuối phố Cái Bèo, hai phần mặt bến nhô ra phía nước và để hở một khoảng giữa để tàu áp sát. Nhìn dọc bờ về phía nam còn thấy những cầu tàu khác của bến.',
    arrivalNote:'Xe dừng trên phố Cái Bèo, tại lối vào bãi xe. Đi bộ theo phố ra cầu tàu chính ở cuối đường.',
    foundationAt:quay[0],width:32,depth:34,boundary:quay,solids:[],gardenRadius:12,
    views:[{name:'Cầu tàu ở cuối phố Cái Bèo',offset:[-4.6,-2.4],viewAngle:1.88,viewRadius:38,viewElevation:.42,height:4,viewBase:'monument'},
      {name:'Dọc bờ Bến Bèo',offset:[-11,28],viewAngle:2.70,viewRadius:87,viewElevation:.35,height:6}],
    build});
})();
