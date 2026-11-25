const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const sites=window.VietnamSights??=[];
  const atlas=window.VietnamTourism.byId;
  const official='https://condao.com.vn/vi/news/';
  const history=official+'tai-nguyen-du-lich/nha-tu-con-dao-2750.html';
  const palaceSource=official+'tin-dia-phuong/dinh-chua-dao-975.html';
  const pierSource=official+'Tin-tuc/cau-tau-lich-su-914-con-dao-977.html';
  const wall=0xe0b85e,trim=0xf3d993,tile=0xa7492f,timber=0x544a38,shutter=0x41635a;

  function hip(T,k,x,z,w,d,eave,rise){
    const a=w/2,b=d/2,r=Math.max(0,a-b),s=Math.max(0,b-a);
    const corners=[[-a,0,b],[a,0,b],[a,0,-b],[-a,0,-b]];
    const peaks=[[-r,rise,s],[r,rise,s],[r,rise,-s],[-r,rise,-s]],p=[];
    for(let i=0;i<4;i++){
      const j=(i+1)%4;p.push(...corners[i],...corners[j],...peaks[i]);
      if(peaks[i][0]!==peaks[j][0]||peaks[i][2]!==peaks[j][2])p.push(...corners[j],...peaks[j],...peaks[i]);
    }
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();
    k.stamp(g,tile,x,eave,z);g.dispose();
    k.box(tile,x,eave+rise,z,Math.max(.17,2*r),.16,Math.max(.17,2*s));
  }
  function rail(k,x,z,len){
    k.box(wall,x,.92,z,len,.48,.37);k.box(trim,x,1.83,z,len+.08,.16,.4);
    const bays=Math.ceil(len/.68);
    for(let i=0;i<bays;i++)k.box(wall,x+len*((i+.5)/bays-.5),1.40,z,.16,.70,.26);
  }
  function palace(T,k){
    k.palette({tile,plaster:[trim,wall],timber});
    // Way 751056576. The long front gallery, narrow link and rear wing have separate roofs.
    const f=createTempleFoundations(T,k);
    f.building(-.95,6.1,0,25.9,21.2,()=>{
      k.box(wall,0,.41,0,25.9,.82,21.2);
      k.box(wall,0,3.06,-1.3,25.2,4.5,17.4);
      for(let i=-3;i<=3;i++){
        const x=i*3.43;
        k.box(trim,x,2.82,7.46,2.25,3.37,.16);
        k.box(shutter,x,2.84,7.57,1.91,3.03,.10);
        k.box(timber,x,2.84,7.65,.09,3.00,.07);
      }
      for(let i=0;i<=8;i++){
        const x=-12.55+i*3.14;
        k.box(wall,x,2.92,10.24,.40,4.24,.46);
        k.box(trim,x,4.94,10.24,.57,.27,.61);
        if(i<8&&i!==3&&i!==4)rail(k,x+1.57,10.24,2.82);
      }
      k.box(trim,0,5.16,10.24,26,.35,.54);
      hip(T,k,0,-.70,26.6,20.9,5.40,3.10);
      k.outline([[.12,0],[-3.65,-.85],[-3.65,-.65],[.12,.22]],tile,-13.05,6.10,7.3,26.10,Math.PI/2);
    });
    f.building(-2,-8.0,0,4.2,7.1,()=>{k.box(wall,0,2.02,0,4.2,4.04,7.1);hip(T,k,0,0,4.8,7.65,4.04,1.18);});
    f.building(-.75,-15,0,20.7,7.4,()=>{k.box(wall,0,2.27,0,20.7,4.54,7.4);hip(T,k,0,0,21.5,8.2,4.55,1.7);});
  }
  function office(T,k){
    k.palette({tile,plaster:[wall,trim],timber});
    const f=createTempleFoundations(T,k);
    // The Atlas feature is the parcel. Way 751056574 is the smaller house within it.
    f.building(-3.05,-2.45,0,10.72,22.25,()=>{
      k.box(wall,0,1.85,0,10.72,3.70,22.25);
      for(const side of [-1,1])for(const z of [-7.6,-2.5,2.5,7.6]){
        if(side<0&&z===2.5)continue;
        k.box(trim,side*5.39,1.98,z,.14,2.54,1.91);
        k.box(shutter,side*5.48,2.04,z,.11,2.18,1.53);
        k.box(timber,side*5.56,2.04,z,.07,2.18,.08);
      }
      k.place(-5.36,3.45,-Math.PI/2,()=>{
        k.box(trim,0,1.48,.075,2.08,2.96,.15);
        k.box(timber,0,1.44,.18,1.70,2.76,.10);
        k.box(0x443a2d,0,1.43,.24,.06,2.70,.04);
        for(let i=0;i<3;i++)k.box(0xb2a38c,0,(3-i)*.065,.40+i*.34,2.31,(3-i)*.13,.36);
      });
      hip(T,k,0,0,11.63,23.24,3.77,2.38);
    });
    f.walk(7.15,2.4,-11.95,1);
    // Curving yellow entrance walls return to the small gateway on the street.
    k.place(-15.5,1.0,-Math.PI/2,()=>{
      for(const side of [-1,1]){
        for(let i=0;i<9;i++){
          const a=i/9*Math.PI/2,b=(i+1)/9*Math.PI/2;
          const x=side*(2.6+5.4*Math.sin(a)),z=2.6*(1-Math.cos(a));
          const dx=side*5.4*(Math.sin(b)-Math.sin(a)),dz=2.6*(Math.cos(a)-Math.cos(b));
          k.place(x+dx/2,z+dz/2,-Math.atan2(dz,dx),()=>{
            const len=Math.hypot(dx,dz);
            k.box(wall,0,.41,0,len+.03,.82,.36);k.box(trim,0,1.55,0,len+.05,.24,.43);
            k.box(wall,0,1.13,0,len*.32,.69,.33);
          });
        }
        k.box(wall,side*2.35,1.21,0,.68,2.42,.72);
        k.box(trim,side*2.35,2.48,0,.89,.15,.91);
      }
    });
  }
  // The traced pier widens at the seaward head and has one rectangular side landing.
  // East/south offsets in metres from Atlas way 751056510. Stonework follows the
  // entire outline, including the recesses, instead of bridging the water between them.
  const pierRing=[[-34.9,-54.9],[-26.7,-36.6],[8.6,41.9],[6.2,44.2],[4.3,46],[3.2,47.4],[4.1,50.9],[7.3,57.3],[20.2,52.2],[19.2,48.9],[34.9,41.8],[31.7,36.9],[28.6,38.2],[25,39.7],[24.3,38.3],[22.8,38],[20.2,38.9],[18.8,39.7],[15.4,41.5],[3.3,15.5],[12,11.4],[7.5,3.1],[5.2,4.3],[-.6,7.2],[-28.1,-52.9],[-28.7,-54.3],[-30.1,-57.3]];
  function pier(T,k){
    const points=pierRing.map(([x,z])=>new T.Vector2(x,z)),p=[];
    for(const [i,j,l] of T.ShapeUtils.triangulateShape(points,[]))
      for(const v of [i,l,j])p.push(points[v].x,.44,points[v].y);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));
    g.computeVertexNormals();k.stamp(g,0xa7a093,0,0,0);g.dispose();
    const block=[0x68645b,0x777063,0x847c6e,0x8c8375];
    for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length],dx=b.x-a.x,dz=b.y-a.y;
      const len=Math.hypot(dx,dz),count=Math.ceil(len/1.75);
      k.place((a.x+b.x)/2,(a.y+b.y)/2,-Math.atan2(dz,dx),()=>{
        k.box(0x685f52,0,-1.21,0,len+.05,3.18,.40);
        for(let row=0;row<3;row++)for(let n=0;n<count;n++){
          const x=len*((n+.5)/count-.5);
          k.box(block[(i+3*n+row)%4],x,.07-row*.65,0,len/count-.05,.61,.51+(n+row)%3*.09);
        }
      });
    }
  }
  function stele(T,k){
    const f=createTempleFoundations(T,k);
    f.building(0,0,0,4.4,2.8,()=>{
      k.box(0x777267,0,.19,0,4.4,.38,2.8);k.box(0x494842,0,.52,0,3.90,.30,2.28);
      k.outline([[-1.57,0],[1.57,0],[1.57,3.9],[-1.57,1.12]],0xaa6a57,0,.67,-.35,.70);
      k.box(0x373832,0,1.42,.39,2.34,1.24,.10);
      k.sign('CẦU TÀU 914',0,1.55,.452,1.86,.36,true);
    });
  }
  function add(catalogId,id,name,yaw,width,depth,source,description,settings,views,build){
    sites.push({...atlas.get(catalogId),catalogId,id,name,yaw,width,depth,source,photo:source,
      visitOnArrival:true,description,...settings,
      views:views.map(([name,offset,height,viewRadius,viewAngle,viewElevation])=>({name,offset,height,viewRadius,viewAngle,viewElevation})),build});
  }
  add('osm-way-751056576','dinh-chua-dao','Dinh Chúa Đảo',.408,27,37,palaceSource,
    'Dinh nhìn qua sân về phía Cầu tàu 914. Dưới mái ngói đỏ là hiên sâu, những cột vuông và lan can thấp.',
    {modeledBuildings:['w751056576'],solids:[[-.95,6.1,12.95,10.6],[-.75,-15,10.35,3.7],[-2,-8,2.1,3.55]]},
    [['Mặt dinh nhìn từ sân',[2,5],6.8,40,.46,.11],['Dọc hàng hiên',[4,12],4.9,22,1.13,.09]],palace);
  add('osm-way-751056573','so-co-con-dao','Di tích Sở Cò',.401,34,37,history,
    'Con đường từ cổng đi qua hai đoạn tường vàng uốn cong rồi vào ngôi nhà mái ngói. Di tích Sở Cò nằm gần Dinh Chúa Đảo.',
    {modeledBuildings:['w751056574'],solids:[[-3.05,-2.45,5.36,11.13]]},
    [['Cổng và ngôi nhà',[-5,1],4.9,40,-1.39,.26],['Hai cánh tường cổng',[-14,7],2.6,20,-1.24,.11]],office);
  add('osm-way-751056510','cau-tau-914','Cầu tàu 914',0,70,115,pierSource,
    'Từ đường Tôn Đức Thắng, cầu tàu bằng đá vươn ra vịnh Côn Sơn. Đầu ngoài mở rộng ở hai bên. Đây là nơi tưởng niệm những người tù đã hy sinh khi xây dựng cầu.',
    {foundationAt:[-30,-54],solids:[]},
    [['Từ vịnh nhìn về bờ',[0,0],3.5,132,1.47,.43],['Bến đá cuối cầu',[19,44],2.5,51,.66,.21]],pier);
  add('osm-node-8581608679','bia-cau-tau-914','Bia tưởng niệm Cầu tàu 914',-.66,4.4,2.8,pierSource,
    'Bia tưởng niệm đứng ở đầu cầu phía đường Tôn Đức Thắng. Từ đây có thể nhìn dọc thân cầu ra vịnh.',
    {solids:[[0,0,2.2,1.4]]},
    [['Bia ở đầu cầu',[0,0],3.6,11,-.68,.11],['Bia và lối ra vịnh',[0,0],3.8,20,-2.85,.18]],stele);
})();

export default window.VietnamSights;
