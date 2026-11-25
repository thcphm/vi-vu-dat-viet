const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const id='lang-chai-cai-beo', catalogId='osm-relation-20057203';
  const site=window.VietnamTourism.byId.get(catalogId);
  const photograph='https://commons.wikimedia.org/wiki/File:Cat_Ba_island_fishing_village.jpg';
  const source='https://haiphongnews.gov.vn/vn/du-lich/song-cham-o-lang-chai-cai-beo-ct133.html';
  // Foreground detail in Kris Martyn's aerial photograph, 1 July 2017, CC BY-SA 4.0.
  // These rectified, simplified cage rows and roof outlines are adapted from that
  // photograph under https://creativecommons.org/licenses/by-sa/4.0/ (same license).
  // Waterline control: OSM w311362982 + w1495799373 and w311362980. The
  // village relation is the aquaculture zone, not a set of individual rafts.
  // Coordinates in metres east/south of the Atlas pin (107.062080, 20.737548).
  // Surveyed from the photo on 22 Nov 2026. Moorings can change; outlines,
  // cell subdivisions and construction details are approximate.
  const cageRows=[
    [-110.5,216.2,0.04,8.9,18.4,2,4],[-77.8,213.9,0.35,9.5,16.2,2,3],[-55.6,201.9,0.45,9.9,20.9,2,4],
    [-43.1,196.6,0.52,8.6,22.6,2,5],[-112.7,235.1,-0.23,33.0,10.8,7,3],[-107.4,258.1,0.08,17.2,19.8,4,5],
    [-92.6,260.8,0.12,15.1,22.0,3,5],[-84.6,273.8,0.09,11.5,16.6,3,4],[-119.7,265.2,0.09,11.5,14.4,3,3],
    [-97.8,279.3,0.16,20.6,21.4,5,5],[-98.8,289.8,0.13,19.8,10.8,4,3],[-82.3,286.1,0.18,9.8,15.6,2,4],
    [-73.8,236.5,0.41,9.8,17.7,2,3],[-59.7,264.2,0.39,15.1,23.1,4,5],[-45.6,284.7,0.43,16.1,20.3,3,4],
    [-28.9,302.3,0.66,11.7,16.6,2,3],[-22.5,316.8,0.56,16.8,16.4,3,3],[-32.4,249.7,0.46,10.4,22.8,2,5],
    [-27.0,268.6,0.37,13.0,8.9,3,2],[-15.9,263.9,0.32,10.2,15.5,2,3],[82.1,250.2,-0.38,28.1,10.9,6,3],
    [74.9,269.6,-0.36,23.3,17.8,5,4],[72.0,283.4,-0.38,29.6,17.0,6,4],[61.9,301.6,-0.37,23.4,29.4,5,6],
  ];
  const b=0x6e9cad, r=0xb56d51, g=0xabb0a5;
  const shelters=[
    [-110.1,205.2,0.14,7.6,5.8,b],[-107.3,216.3,-0.07,10.0,4.7,r],[-79.6,207.6,0.35,7.2,5.2,b],
    [-59.4,192.5,0.49,6.1,4.8,r],[-48.7,186.2,0.57,5.9,5.9,g],[-128.2,230.8,-0.18,4.0,9.6,b],
    [-99.2,236.8,-0.24,7.4,8.5,r],[-95.3,251.6,0.08,13.3,6.5,g],[-94.7,259.6,0.09,12.2,6.8,b],
    [-83.0,269.5,0.12,6.1,6.2,r],[-120.8,268.9,0.19,5.8,6.9,r],[-102.7,276.6,0.21,6.9,7.0,r],
    [-83.2,282.7,0.22,6.6,9.9,b],[-76.5,231.4,0.41,6.2,5.1,g],[-65.5,253.0,0.46,8.0,5.9,r],
    [-61.7,265.1,0.49,6.9,8.6,r],[-50.6,281.1,0.48,11.7,6.1,r],[-43.2,289.6,0.46,8.0,4.8,b],
    [-26.2,298.7,0.59,6.4,5.3,r],[-19.9,307.6,0.51,6.6,4.6,r],[-27.7,316.5,0.60,9.5,9.3,g],
    [-29.0,251.3,0.46,4.8,7.7,g],[-18.9,261.3,0.38,5.8,9.0,b],[73.4,245.2,-0.32,7.9,6.9,r],
    [71.4,261.7,-0.35,7.2,5.5,r],[63.6,269.5,-0.30,6.0,4.6,b],[75.1,286.4,-0.33,8.7,6.8,r],
    [59.3,283.5,-0.37,5.0,4.8,g],[53.9,298.0,-0.41,6.2,5.4,b],
  ];
  const timber=0x967f62, weathered=0x806f59, joist=0x5d5542;
  const drum=0x31536d, drumRim=0x334653, net=0x36534b;
  // OSM ways 311362982 and 1495799373 enclose the one elongated island
  // between the pens. Its thin southern spur is smoothed out in the 30 m
  // height raster. These elevations approximate its photographed skyline.
  const shore=[[-84,18],[-100,25],[-98,53],[-86,70],[-45,130],[-18,177],[7,217],
    [14,230],[4,234],[7,256],[1,293],[8,312],[16,313],[30,304],[39,272],
    [46,253],[43,237],[34,220],[26,208],[22,191],[34,181],[43,150],[30,138],
    [0,120],[-4,108],[-5,95],[-5,73],[-10,58],[-10,37],[-17,30],[-24,3],[-45,7],[-70,12]];
  const ridge=[[3,0],[18,22],[43,47],[64,53],[98,44],[129,41],[153,43],[181,34],
    [202,25],[222,14],[238,22],[255,30],[272,27],[293,17],[306,10],[313,0]];
  function island(T,k){
    const bedrock=VietnamKarst.batch(T),canopy=VietnamKarst.batch(T);
    function section(z){
      const hits=[];
      for(let i=0;i<shore.length;i++){
        const [a,b]=shore[i],[c,d]=shore[(i+1)%shore.length];
        if((b<=z&&d>z)||(d<=z&&b>z))hits.push(a+(c-a)*(z-b)/(d-b));
      }
      const i=ridge.findIndex(p=>p[0]>=z),[z0,h0]=ridge[i-1],[z1,h1]=ridge[i];
      return [Math.min(...hits),Math.max(...hits),h0+(h1-h0)*(z-z0)/(z1-z0)];
    }
    function profile(z,t){
      const [left,right,peak]=section(z),x=left+(right-left)*t;
      const shape=Math.pow(Math.sin(t*Math.PI),.56);
      const rock=.74*Math.sin(x*.72+z*.15)+1.23*Math.cos(z*.33+x*.19)+1.48*Math.sin(x*.23-z*.072);
      return [x,-.80+shape*(peak+rock),z];
    }
    bedrock.grid(43,153,(u,v)=>{
      const z=3.01+309.98*v,[x,y]=profile(z,1-u);
      const stripe=Math.sin(x*.79+z*.103),sheltered=Math.sin(x*.22-z*.17)+Math.cos(x*.13+z*.073);
      const tint=y<1.3?0x7e8174:y>5&&sheltered>-.47?0x536343:stripe>.15?0x959487:0x777b72;
      return [x,y,z,tint,.87+.11*Math.cos(z*.41+x*.22)];
    });
    bedrock.add(k.group,globalThis.createSightStoneMaterial(T));
    // Low, irregular scrub above the exposed, pale limestone waterline.
    for(let row=0;row<76;row++){
      for(let j=0;j<5;j++){
        const z=5+(row+k.random())*4,t=.065+(j+k.random())*.174;
        const [x,y]=profile(z,t);
        const [west,east]=section(z),probe=Math.min(.04,1.5/(east-west));
        const slope=Math.abs(profile(z,t+probe)[1]-profile(z,t-probe)[1])/(2*probe*(east-west));
        if(y<3||slope>1.35)continue;
        const radius=2.2+k.random()*1.9,height=1.4+k.random()*1.7,phase=k.random()*6.28;
        const tint=[0x465b3c,0x576e45,0x6e7a4a,0x586842][(row+j)%4];
        canopy.grid(7,4,(u,v)=>{
          const a=u*2*Math.PI,r=radius*Math.cos(v*Math.PI*.5)*(1+.19*Math.cos(3*a+phase));
          const px=x+r*Math.cos(a),pz=Math.max(3.02,Math.min(312.98,z+r*Math.sin(a)));
          const [left,right]=section(pz),f=Math.max(.001,Math.min(.999,(px-left)/(right-left)));
          const floor=Math.max(y-1.0,Math.min(y+1.0,profile(pz,f)[1])),shade=.79+.22*v+.10*Math.sin(5*a+phase);
          return [px,floor-.25+height*Math.sin(v*Math.PI*.5),pz,tint,shade];
        });
      }
    }
    canopy.add(k.group,new T.MeshLambertMaterial({vertexColors:true}));
  }
  function build(T,k){
    k.palette({timber:[timber,weathered,joist,0x718f7c,0xa19c88]});
    const barrel=new T.CylinderGeometry(1,1,1,8);
    const ranges=[];
    function floating(x,z,yaw,draw,anchor=[x,z]){
      const first=k.vertexCount();
      k.place(x,z,yaw,draw);
      ranges.push({first,end:k.vertexCount(),anchor,shift:0});
    }
    function nearestRaft(x,z){
      let best=null,nearest=Infinity;
      for(const row of cageRows){
        const [east,south,a,w,d]=row,c=Math.cos(a),s=Math.sin(a),dx=x-east,dz=z-south;
        const u=Math.max(0,Math.abs(dx*c-dz*s)-w/2),v=Math.max(0,Math.abs(dx*s+dz*c)-d/2);
        if(u*u+v*v<nearest){nearest=u*u+v*v;best=row;}
      }
      return [best[0],best[1]];
    }
    function float(x,z){
      k.stamp(barrel,drum,x,.12,z,.30,.89,.30,0,Math.PI/2);
      for(const side of [-.32,.32])k.stamp(barrel,drumRim,x,.12,z+side,.315,.07,.315,0,Math.PI/2);
    }
    for(const [x,z,yaw,width,depth,cols,rows] of cageRows){
      floating(x,z,yaw,()=>{
        const left=-width/2,back=-depth/2;
        for(let i=0;i<=cols;i++){
          const u=left+width*i/cols;
          k.box(i%2?timber:weathered,u,.47,0,.37,.14,depth);
          if(i===0||i===cols)k.box(net,u,.04,0,.035,.62,depth);
          for(let j=0;j<=rows;j++){
            if(i>0&&i<cols&&j>0&&j<rows&&(i+j)%2)continue;
            float(u,back+depth*j/rows+.08);
          }
        }
        for(let j=0;j<=rows;j++){
          const v=back+depth*j/rows;
          k.box(j%2?weathered:timber,0,.48,v,width,.14,.36);
          if(j===0||j===rows)k.box(net,0,.04,v,width,.62,.035);
        }
      });
    }
    barrel.dispose();
    for(const [x,z,yaw,w,d,tint] of shelters){
      floating(x,z,yaw,()=>{
        const wall=tint===r?0x829889:tint===b?0x718f7c:0xa19c88;
        const eave=w>8?2.9:2.5,rise=Math.min(.86,d*.105),run=d*.5+.16;
        const slope=Math.atan2(rise,run),panel=Math.hypot(run,rise);
        k.box(joist,0,.34,0,w+.30,.16,d+.46);
        k.box(timber,0,.51,0,w+.35,.18,d+.76);
        k.box(wall,0,(eave+.51)/2,-d*.43,w-.47,eave-.51,.095);
        for(const side of [-1,1]){
          k.box(wall,side*(w*.5-.24),(eave+.51)/2,-d*.015,.11,eave-.51,d*.85);
          const sideWindow=side*(w*.5-.168),sill=1.38;
          k.box(joist,sideWindow,sill+.35,-d*.09,.06,.87,Math.min(1.8,d*.32));
          k.box(0x405b5a,sideWindow+side*.035,sill+.36,-d*.09,.045,.61,Math.min(1.55,d*.27));
          k.box(timber,sideWindow+side*.055,sill+.35,-d*.09,.05,.67,.075);
          k.box(wall,side*w*.34,(eave+.51)/2,d*.34,w*.27,eave-.51,.10);
          k.box(joist,side*(w*.5-.18),(eave+.51)/2,d*.46,.115,eave-.51,.115);
          k.box(tint,0,eave+rise*.5,side*run*.5,w,.12,panel,0,side*slope);
          const ribs=Math.max(6,Math.round(w/.54));
          for(let i=1;i<ribs;i++)
            k.box(tint,w*(i/ribs-.5),eave+rise*.5+.075,side*run*.5,.045,.065,panel,0,side*slope);
        }
        k.box(joist,0,eave-.13,d*.34,w-.40,.14,.14);
        k.box(tint,0,eave+rise+.09,0,w+.13,.13,.17);
      },nearestRaft(x,z));
    }
    // Long, open workboat tied to the blue-roofed platform, visible beside
    // the two short rows of pens west of the headland in the aerial photo.
    floating(-12.4,280.0,-.11,()=>{
      const stations=[[-10.0,.12],[-8.5,.93],[-5.8,1.26],[4.8,1.30],[8.1,.99],[9.0,.32]];
      const hull=new T.BufferGeometry(),points=[];
      for(let i=1;i<stations.length;i++){
        const [za,a]=stations[i-1],[zb,b]=stations[i];
        for(const side of [-1,1]){
          const near=[side*a,.65,za],far=[side*b,.65,zb],low=[side*a*.54,-.04,za],lowFar=[side*b*.54,-.04,zb];
          for(const p of [near,low,far,low,lowFar,far,far,low,near,far,lowFar,low])points.push(...p);
        }
        const span=zb-za;
        k.box(timber,0,.18,(za+zb)/2,Math.min(a,b)*1.62,.13,span+.02);
      }
      hull.setAttribute('position',new T.Float32BufferAttribute(points,3));hull.computeVertexNormals();
      k.stamp(hull,0x725647,0,0,0);hull.dispose();
      for(const v of [-5,-1,3,6.7])k.box(weathered,0,.57,v,2.15,.11,.38);
    });
    island(T,k);
    k.group.userData.fitGround=ground=>{
      const mesh=k.group.children.find(child=>child.geometry?.attributes.finishKind);
      if(!mesh)return;
      const p=mesh.geometry.attributes.position;
      for(const range of ranges){
        // The sea in shore-terrain.js lies .17 + .42 m below the local DEM.
        // A raft and its rooms share one waterline and keep a level deck.
        const shift=ground(...range.anchor)-.59,change=shift-range.shift;
        if(Math.abs(change)<.002)continue;
        for(let i=range.first;i<range.end;i++)p.setY(i,p.getY(i)+change);
        range.shift=shift;
      }
      p.needsUpdate=true;mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();
    };
  }
  (window.VietnamSights??=[]).push({...site,id,catalogId,name:'Làng chài Cái Bèo',kind:'Làng chài',
    lon:107.062080,lat:20.737548,start:[107.057865,20.731873],visitOnArrival:true,
    map:'https://www.openstreetmap.org/relation/20057203',source,photo:photograph,
    yaw:0,width:236,depth:157,viewDistance:1550,gardenRadius:1,solids:[],reserve:()=>false,
    // A small boundary in open water leaves the actual inhabited shore and
    // the limestone island available to the ordinary terrain/building layer.
    boundary:[[-31,249],[-29,249],[-29,251],[-31,251]],foundationAt:[-30,250],
    description:'Theo ảnh bay ngày 1/7/2017, các dãy bè quây quanh hai phía mũi đảo đá. Mái tôn thấp nép bên những ô nuôi để hở mặt nước, giữa các dãy là luồng cho thuyền qua. Cảnh tái hiện một đoạn làng chài vào thời điểm chụp.',
    arrivalNote:'Xe dừng trên phố Cái Bèo, đầu đường vào bến. Từ bến, người dân và du khách đi thuyền ra làng chài.',
    views:[
      {name:'Hai nhánh bè bên mũi đá · 2017',offset:[-18,260],height:10,viewBase:'monument',viewRadius:200,viewAngle:-.21,viewElevation:.63},
      {name:'Lối ván và các ô nuôi cá',offset:[-98,266],height:4.8,viewBase:'monument',viewRadius:35,viewAngle:-.79,viewElevation:.32},
      {name:'Thuyền dài bên bè mái xanh',offset:[-18,268],height:3.8,viewBase:'monument',viewRadius:38,viewAngle:-.72,viewElevation:.34}
    ],build});
})();

export default window.VietnamSights;
