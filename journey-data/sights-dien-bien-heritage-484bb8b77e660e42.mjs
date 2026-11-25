const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const sites=window.VietnamSights??=[];
  const granite=0x797b77,slate=0x545c59,cream=0xd8ccae,sand=0xb3a38c,rose=0xa56e59;
  const bronze=0xa47f50,patina=0x876746,bronzeLight=0xb39360,leaf=0x566c40;
  const peakYaw=-1.67,stairYaw=-1.62,cemeteryYaw=-1.65;
  const provincial='https://dienbien.gov.vn/vi/bai-viet/VPUB--Mot-so-cong-trinh-van-hoa-nghe-thuat-noi-batvgrnzj';
  const statuePhotos='https://nvsk.vnanet.vn/print/photo-nhung-dia-chi-do-khong-the-bo-qua-khi-toi-manh-dat-dien-bien-anh-hung--145629.vna';
  function local(yaw,x,z){return [x*Math.cos(yaw)+z*Math.sin(yaw),z*Math.cos(yaw)-x*Math.sin(yaw)];}
  function view(name,height,viewRadius,viewAngle,viewElevation,offset=[0,0],viewFov=55){
    return {name,height,viewRadius,viewAngle,viewElevation,offset,viewFov};
  }
  function add(id,node,name,lon,lat,start,yaw,width,depth,details,build){
    sites.push({id,name,catalogId:'osm-node-'+node,lon,lat,start,yaw,width,depth,city:'Điện Biên Phủ',province:'Điện Biên',
      region:'Bắc Bộ',kind:'Di tích',visitOnArrival:true,map:'https://www.openstreetmap.org/node/'+node,...details,build});
  }
  function finishes(k){k.palette({stone:[granite,slate,cream,sand,rose,0x8d857c,0x555653,0xa6a29a,0xa7816e,0xbc9581],
    metal:[bronze,patina,bronzeLight,0xb49055]});}
  function star(k,x,y,z,r,color,depth){
    const p=[];for(let i=0;i<10;i++){const a=i*Math.PI/5,v=r*(i%2?.403:1);p.push([Math.sin(a)*v,Math.cos(a)*v]);}
    k.outline(p,color,x,y,z,depth);
  }
  function victoryGroup(T,k){
    // The measured group is 12.6 m from the feet to the tip of the cast flag.
    // These sections follow Ioe2015's frontal photograph. The three soldiers
    // surround a common centre, with the child supported above the left arm.
    CentralArch.photoCarving(T,k,{
      photo:'sight-imagery/dien-bien-d1-tuong-dong.webp',width:360,height:480,
      crop:[85,26,191,308],origin:[178,330],scale:12.6/298,position:[0,3.69,0],tint:0x79634e,forms:[
        // Curled free edge of the flag, spreading across the figures below.
        {z:-.45,rows:[[32,215,217,.04],[37,216,231,.19],[45,217,239,.34],[72,220,242,.41],
          [89,220,245,.39],[102,204,246,.47],[115,190,247,.54],[133,174,247,.57],[145,157,234,.54],
          [152,147,224,.31],[161,143,218,.37],[166,125,215,.28],[174,147,207,.23],[180,161,192,.12]]},
        // Separated shafts of the far and near legs leave two open triangles.
        {z:-.42,rows:[[192,193,214,.40],[207,188,233,.69],[232,189,233,.83],[253,202,239,.65],
          [274,216,246,.54],[293,227,251,.47],[312,238,261,.44],[327,248,270,.38]]},
        {z:.28,rows:[[176,128,136,.11],[181,125,143,.28],[188,124,146,.36],[194,119,157,.49],
          [205,110,168,.62],[216,120,172,.72],[235,132,177,.67],[249,132,174,.65],[265,129,175,.73],
          [277,128,160,.58],[290,123,149,.49],[308,118,140,.41],[324,113,132,.39],[330,108,127,.31]]},
        {z:.19,rows:[[252,153,169,.32],[269,149,178,.64],[282,154,182,.55],[298,163,185,.47],[326,165,188,.41]]},
        {z:.76,rows:[[174,166,178,.19],[180,162,185,.37],[189,162,185,.43],[195,162,194,.41],
          [205,158,207,.57],[221,161,217,.75],[241,166,220,.79],[262,164,219,.78],[281,167,218,.66],
          [304,181,212,.53],[325,188,207,.44]]},
        // Raised forearm before the staff and the hand at the flag edge.
        {z:.94,rows:[[135,216,222,.13],[146,209,220,.20],[161,200,216,.28],[177,191,209,.37],
          [190,181,204,.41],[200,173,201,.38],[210,169,193,.31]]},
        {z:.13,rows:[[138,226,229,.065],[170,228,233,.10],[174,226,237,.17],[183,228,236,.16],
          [200,228,239,.22],[214,217,237,.26],[216,213,234,.15]]},
        // The child, bouquet, raised hands and the supporting soldier's elbow.
        {z:.70,rows:[[141,106,117,.14],[146,103,121,.30],[154,104,121,.33],[161,102,119,.24],
          [170,102,120,.31],[179,99,121,.37],[190,98,123,.42],[202,96,121,.35],[218,96,120,.30],[227,99,117,.25]]},
        {z:.78,rows:[[111,98,101,.055],[116,89,106,.14],[122,94,110,.14],[129,95,103,.10],[137,95,102,.13],
          [150,97,105,.15],[164,100,109,.18]]},
        {z:.75,rows:[[133,126,135,.065],[140,124,132,.13],[155,119,128,.18],[169,112,122,.17]]},
        {z:.84,rows:[[195,139,150,.17],[199,111,155,.28],[205,96,160,.38],[213,95,145,.38],[224,97,119,.27]]}
      ]
    });
  }


  function peak(T,k){
    finishes(k);
    const f=createTempleFoundations(T,k);
    f.building(0,0,0,22,17,()=>{
      k.box(granite,0,.14,0,22,.28,17);
      // Three rectangular stone-faced tiers are slightly rotated relative
      // to one another, as in the national tourism inventory.
      for(const [yaw,w,d,y,h,color] of [[.07,17.1,11.2,.58,.72,0x555653],[-.10,14.8,10,1.39,.90,slate],[.03,12.8,8.9,2.66,1.66,0x555653]]){
        k.box(color,0,y,0,w,h,d,yaw);k.box(granite,0,y+h/2,0,w+.13,.105,d+.13,yaw);
      }
      k.box(patina,0,3.58,0,8.54,.24,5.03,.035);
      victoryGroup(T,k);
      const rock=new T.SphereGeometry(1,12,7);
      for(const s of [-1,1])for(let j=0;j<4;j++){
        const x=s*(3.75+j*.69),z=4.86;
        k.box(slate,x,.52,z,.79,.32,.85);k.stamp(rock,leaf,x,.99,z,.47,.55,.46);
      }
      rock.dispose();
    });
  }
  add('tuong-dai-chien-thang-dien-bien-phu','4275610390','Tượng đài Chiến thắng Điện Biên Phủ',103.018884,21.392106,
    [103.019837,21.390958],peakYaw,22,17,{
      source:'https://vietnamtourism.vn/index.php/tourism/items/2073',photo:statuePhotos,
      description:'Trên đỉnh D1, ba người lính trong tác phẩm của Nguyễn Hải tựa lưng vào nhau. Một người nâng em bé Thái cầm hoa, một người giương cờ. Cụm tượng đồng cao 12,6 m trên bệ đá ba tầng.',
      gardenRadius:12,solids:[[0,0,8.50,5.65]],modeledBuildings:['w1333769529'],
      views:[view('Nhóm tượng đồng nhìn từ phía tây',16.8,34,peakYaw+.27,.13),
        view('Em bé cầm hoa dưới nếp cờ',22.4,13.0,peakYaw-.21,.06,local(peakYaw,-1.15,.5)),
        view('Bệ đá ba tầng trên đỉnh đồi',10,34,peakYaw+.82,.31)]},peak);

  function stoneRelief(T,k){
    // The 58 m Thanh Hóa stone wall follows the south side of the plaza.
    const curve=u=>Math.sin(Math.PI*u)*3+.44*Math.sin(2*Math.PI*u);
    const height=u=>5.25+1.52*Math.sin(Math.PI*u)+1.10*Math.abs(Math.sin(6.5*u+.35))+.46*Math.sin(19*u+.60);
    const shades=[0x959a94,0x999d98,0x939891,0x969b95];
    for(let j=0;j<29;j++){
      const u=j/29,v=(j+1)/29,x0=curve(u),x1=curve(v),x=(x0+x1)*.5;
      const span=Math.hypot(x1-x0,2),half=span*.5;
      k.place(x,-28+2*j,-Math.PI/2+Math.atan2(x1-x0,2),()=>{
        k.box(slate,0,.32,0,span+.04,.64,1.13);
        const a=height(u),b=height(v);
        k.outline([[-half,.57],[half+.017,.57],[half+.017,b],[-half,a]],0x7f8580,0,0,-.20,.37);
        for(let level=0;.62+level*1.08<Math.max(a,b);level++){
          const y=.62+level*1.08;
          const left=Math.min(a,y+1.063),right=Math.min(b,y+1.063);
          if(Math.min(left,right)<=y)continue;
          k.outline([[-half+.008,y],[half-.008,y],[half-.008,right],[-half+.008,left]],
            shades[(j+3*level)%shades.length],0,0,.165,.040);
        }
      });
    }
    // Both photographs show the bottom register directly above the stone plinth.
    // Their exact spacing along the 58 m panorama has not been surveyed.
    function panel(file,centre,width,panelHeight,forms){
      const geometry=new T.PlaneGeometry(width,panelHeight,48,28);
      const p=geometry.attributes.position;
      for(let i=0;i<p.count;i++){
        const s=p.getX(i)/width+.5,t=p.getY(i)/panelHeight+.5;
        const z=centre+(s-.5)*width,u=.5+z/58;
        const slope=(curve(u+.001)-curve(u-.001))/.116;
        const normal=1/Math.hypot(1,slope);
        let projection=0;
        for(const [cx,cy,rx,ry] of forms){
          const r=((s-cx)/rx)**2+((t-cy)/ry)**2;
          if(r<1)projection=Math.max(projection,.115*(1-r)**2);
        }
        const offset=.229+projection;
        p.setXYZ(i,curve(u)-normal*offset,.625+t*panelHeight,z+normal*slope*offset);
      }
      geometry.computeVertexNormals();
      const map=new T.TextureLoader().load('sight-imagery/doi-d1-phu-dieu-'+file+'.webp');
      map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
      const material=new T.MeshStandardMaterial({map,transparent:true,depthWrite:false,roughness:.97});
      const mesh=new T.Mesh(geometry,material);mesh.receiveShadow=true;k.group.add(mesh);
    }
    panel('dan-cong',-9.2,6.95,4.00,[[.16,.36,.081,.34],[.26,.4,.062,.39],
      [.328,.46,.077,.34],[.418,.33,.071,.34],[.759,.45,.13,.25],[.868,.31,.065,.30]]);
    panel('dau-hang',15.4,5.78,4.04,[[.044,.65,.063,.27],[.165,.7,.087,.27],
      [.333,.62,.082,.27],[.514,.64,.072,.28],[.570,.43,.112,.26],
      [.798,.54,.083,.26],[.858,.31,.115,.23]]);
  }
  function ceremonial(T,k){
    finishes(k);const f=createTempleFoundations(T,k);
    // Offsets are measured from the visitor pin at the northern edge of the
    // lower plaza. Its centre and the stair axis are distinct on the imagery.
    f.building(24,10,0,40,53,()=>{
      k.box(0xa6a29a,0,.19,0,40,.30,53);
      for(let j=0;j<8;j++)k.box(j%2?granite:sand,-16+j*4.5,.346,4,.08,.022,42);
      k.place(18.9,0,0,()=>stoneRelief(T,k));
      for(let j=0;j<4;j++){
        const x=-13+j*7.7;
        k.box(slate,x,.47,22.5,1.11,.24,1.11);
        k.stamp(k.round,0xa8a9a1,x,3.35,22.5,.075,5.65,.075);
      }
    });
    const runs=[[0,35,64],[35,40,0],[40,118,128],[118,134,0],[134,164,64],[164,170,0],[170,199,64]];
    const axis=[[0,11.25],[117.6,10.86],[122.0,10.65],[134.0,9.96],[175.0,10.14],[199.0,11.16]];
    const cross=m=>{
      let j=1;while(j<axis.length-1&&axis[j][0]<m)j++;
      const [a,x]=axis[j-1],[b,y]=axis[j];return x+(y-x)*(m-a)/(b-a);
    };
    const along=m=>-17.15-m;
    const parts=[];
    for(const [lo,hi,count] of runs){
      const steps=count||1,run=(hi-lo)/steps;
      for(let i=0;i<steps;i++){
        const m=lo+(i+.5)*run,x=cross(m),z=along(m),index=parts.length;
        parts.push({start:lo+i*run,end:lo+(i+1)*run,landing:!count,m,x,z});
        f.fixture(g=>levels(g)[index],()=>{
          k.box(rose,x,-.29,z,9.14,.60,run+.028);
          for(const s of [-1,1]){
            k.box(granite,x+s*5.49,-.29,z,1.84,.60,run+.028);
            k.box(0xa6a29a,x+s*6.95,-.14,z,1.13,.36,run+.028);
          }
          if(count&&i%4===0)k.box(0x8d857c,x,.018,z+run*.45,9.10,.032,.038);
        });
      }
    }
    // A landing cannot simply take the height of its centre: the DEM may
    // climb several metres between its two ends. Fit one continuous profile
    // above the sampled relief, sharing the landing height with its steps.
    let sampled,heights;
    function levels(g){
      if(sampled===g)return heights;
      sampled=g;
      heights=parts.map(({start,end,landing})=>{
        let h=-Infinity;const n=landing?Math.ceil(end-start):1;
        for(let j=0;j<=n;j++){
          const m=start+(end-start)*j/n,x=cross(m),z=along(m);
          h=Math.max(h,g(x,z),g(x-6.4,z),g(x+6.4,z));
        }
        return h+.28;
      });
      for(let i=heights.length-2;i>=0;i--)heights[i]=Math.max(heights[i],heights[i+1]-.205);
      for(let i=1;i<heights.length;i++)heights[i]=Math.max(heights[i],heights[i-1]+.015);
      return heights;
    }
    // Twenty-eight pairs of small stone markers line the public ascent.
    for(let j=0;j<28;j++)for(const s of [-1,1]){
      const m=2+j*7.19,x=cross(m)+s*7.06,z=along(m);
      const i=parts.findIndex(p=>p.end>=m);
      f.fixture(g=>Math.max(g(x,z),levels(g)[i]),()=>{
        k.box(slate,x,.14,z,.74,.28,.75);
        k.box(cream,x,.89,z,.48,1.28,.50);
        k.outline([[-.23,0],[-.27,.38],[-.40,.58],[-.43,.90],[-.18,.66],[.05,.45],[.26,.34],[.22,0]],
          cream,x,1.42,z-.22,.46,s<0?0:Math.PI);
      });
    }
    const trees=[];
    for(let j=0;j<10;j++)for(const s of [-1,1]){
      const m=8+j*19.7+(s<0?2.6:0);
      trees.push({x:cross(m)+s*(13.6+2.6*Math.sin(j*1.7)),z:along(m),h:5.8+(j%4)*.65,width:4.0+(j%3)*.53});
    }
    const firstTree=k.group.children.length;
    CentralArch.trees(T,k,trees);
    trees.forEach((tree,i)=>{
      const mesh=k.group.children[firstTree+i];
      f.fixture(g=>g(tree.x,tree.z),()=>{},h=>{mesh.position.y=h;});
    });
    let skirt;
    const baseFit=k.group.userData.fitGround;
    k.group.userData.fitGround=g=>{
      baseFit(g);
      if(!skirt){
        const geom=new T.BufferGeometry();
        geom.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(parts.length*2*18),3));
        const texture=new T.TextureLoader().load('streetscape/verge-grass.webp');texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.colorSpace=T.SRGBColorSpace;
        geom.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(parts.length*2*12),2));
        skirt=new T.Mesh(geom,new T.MeshStandardMaterial({map:texture,color:0xa6ae8b,roughness:.97,side:T.DoubleSide}));
        skirt.castShadow=skirt.receiveShadow=true;k.group.add(skirt);
      }
      const levelsNow=levels(g),{position,uv}=skirt.geometry.attributes;let index=0;
      for(const [i,{start,end}] of parts.entries())for(const s of [-1,1]){
        const xa=cross(start)+s*7.48,xb=cross(end)+s*7.48,za=along(start),zb=along(end),top=levelsNow[i]-.04;
        const outerA=xa+s*6.70,outerB=xb+s*6.70;
        const a=[xa,top,za],b=[xb,top,zb],c=[outerB,g(outerB,zb)-.16,zb],d=[outerA,g(outerA,za)-.16,za];
        for(const p of [a,b,c,a,c,d]){position.setXYZ(index,...p);uv.setXY(index,p[0]/3.7,p[2]/3.7);index++;}
      }
      position.needsUpdate=true;uv.needsUpdate=true;skirt.geometry.computeVertexNormals();skirt.geometry.computeBoundingSphere();
    };
  }
  add('san-hanh-le-doi-d1','5492241221','Sân hành lễ và trục bậc đồi D1',103.016610,21.392356,
    [103.016674,21.392736],stairYaw,52,235,{
      source:'https://www.qdnd.vn/quoc-phong-an-ninh/chien-thang-dien-bien-phu-moc-son-lich-su/dien-bien-hom-nay/tuong-dai-chien-thang-dien-bien-phu-diem-den-cua-chien-thang-va-hoa-binh-771459',photo:provincial,
      description:'Từ sân lễ dưới chân đồi, 320 bậc đá và ba chiếu nghỉ dẫn lên tượng đài. Bức phù điêu đá xanh dài 58 m ở phía nam sân kể lại chiến dịch Điện Biên Phủ. Trong các cảnh ở tầng dưới có đoàn dân công vận tải và quân Pháp giơ tay đầu hàng.',
      photoCredit:'Hai cảnh phù điêu cắt từ ảnh Adam Jones chụp ngày 1/7/2019 · CC BY-SA 2.0',
      photoCreditUrl:'landmark-scans/CREDITS.txt',
      gardenRadius:22,boundary:[[3,38],[3,-17],[3,-216],[18,-216],[18,-17],[47,-17],[47,38]],
      reserve:(x,z,r)=>(Math.abs(x-11)<8+r&&z>=-217-r&&z<=-16+r)||(x>=3-r&&x<=47+r&&z>=-18-r&&z<=38+r),
      solids:[[44,10,1.1,27],[11,-116.7,6.45,99.6]],
      views:[view('Phù điêu đá xanh ở sân hành lễ',8.8,53,stairYaw-Math.PI/2-.14,.11,local(stairYaw,43,10)),
        view('Đoàn dân công trên phù điêu',6.6,9.5,stairYaw-Math.PI/2-.06,.035,local(stairYaw,45.7,.8)),
        view('Trục bậc nhìn về đỉnh D1',5.4,32,stairYaw+.05,.09,local(stairYaw,11.3,-34),49),
        view('Chiếu nghỉ và cột mốc đá',5.1,20,stairYaw+.26,.17,local(stairYaw,12,-135)),
        view('Quân Pháp đầu hàng trên phù điêu',6.6,8.8,stairYaw-Math.PI/2+.09,.035,local(stairYaw,44.3,25.4))]},ceremonial);

  function memorialWing(T,k,sign){
    const outline=[[0,4.95],[3.78,0],[14.25,0],[0,12.45]],shape=new T.Shape();
    outline.forEach(([x,y],i)=>i?shape.lineTo(sign*x,y):shape.moveTo(sign*x,y));shape.closePath();
    // Leave a small unpierced crown and margins along the aperture and
    // the roof edge. There are 322 small perforations on each folded leaf.
    let points=[],pitch=.53;
    while(points.length<322){
      pitch-=.003;points=[];
      for(let y=.66;y<11.55;y+=pitch)for(let u=.47;u<13.54;u+=pitch){
        if(y>12.45-u*12.45/14.25-.51||y<4.95-u*4.95/3.78+.40||u<1.08&&y>10.2)continue;
        points.push([u,y]);
      }
    }
    for(const [u,y] of points.slice(0,322)){
      const hole=new T.Path();
      for(let j=0;j<10;j++){
        const a=j*Math.PI/5,r=pitch*(j%2?.21:.41),x=sign*u+Math.sin(a)*r,yy=y+Math.cos(a)*r;
        j?hole.lineTo(x,yy):hole.moveTo(x,yy);
      }
      hole.closePath();shape.holes.push(hole);
    }
    const g=new T.ShapeGeometry(shape);k.stamp(g,cream,0,0,0);
    const reverse=g.clone(),idx=reverse.index.array;
    for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
    reverse.computeVertexNormals();k.stamp(reverse,cream,0,0,-.28);reverse.dispose();g.dispose();
    for(let i=0;i<outline.length;i++){
      const a=outline[i],b=outline[(i+1)%outline.length];
      CentralArch.strut(T,k,cream,sign*a[0],a[1],-.14,sign*b[0],b[1],-.14,.16);
    }
  }
  function remembrance(T,k){
    for(let i=0;i<5;i++)k.box(i%2?rose:0x8d857c,0,.11+i*.15,2.5,42.2-i*.62,.22,15.4-i*.57);
    k.box(slate,0,.85,1.8,37.9,.34,11.25);
    // The central opening is triangular and the two perforated walls fold
    // away from the ridge. Dark polished stone is visible behind the altar.
    for(const s of [-1,1])k.place(0,3.2,s*.34,()=>{
      memorialWing(T,k,s);
      k.box(slate,s*8.81,.58,-.09,9.97,.96,.69);
    });
    k.outline([[-3.88,0],[0,5.25],[3.88,0]],0x393b37,0,.96,-1.32,.31);
    k.box(slate,0,1.52,.94,3.43,.55,1.16);
    k.box(0x555653,0,1.87,.94,3.76,.16,1.33);
    star(k,0,11.10,3.24,.49,0x5a5b51,.06);
    // Groups on either side of the memorial are gilded, against the dark
    // granite. To the left, two women and a child lift a ribbon together.
    for(const s of [-1,1])k.box(slate,s*16.31,1.25,3.5,3.85,.49,3.14);
    // Adam Jones photographed the complete silk ribbon, the kneeling child and
    // the two women. Each end of the ribbon stands free of the bodies.
    const gilt=0xbda153;
    CentralArch.photoCarving(T,k,{photo:'sight-imagery/dien-bien-a1-dai-lua.webp',width:640,height:480,
      crop:[244,123,204,303],origin:[345,422],scale:.0121,position:[-16.31,1.50,3.53],tint:gilt,forms:[
        {rows:[[129,300,309,.045],[135,294,316,.092],[146,291,317,.15],[157,293,313,.14],[165,296,310,.098],
          [172,293,312,.105],[180,273,332,.20],[190,269,339,.24],[206,268,341,.25],[225,269,341,.22],
          [240,266,341,.24],[258,276,341,.23],[278,273,336,.24],[301,270,338,.26],[334,260,336,.27],
          [360,254,334,.28],[389,249,335,.29],[410,253,339,.28],[420,263,342,.24]]},
        {z:-.12,rows:[[143,358,373,.06],[149,347,382,.13],[159,345,378,.16],[168,346,374,.14],[179,349,368,.10],
          [186,340,381,.20],[194,337,389,.24],[213,337,391,.25],[233,336,391,.24],[252,341,385,.21],[269,337,393,.24],
          [295,331,398,.26],[320,331,393,.25],[374,332,389,.27],[419,341,389,.24]]},
        {z:.24,rows:[[260,353,361,.06],[267,345,366,.11],[277,343,365,.128],[289,346,363,.11],[296,337,371,.16],
          [308,335,382,.18],[322,336,383,.19],[346,338,380,.20],[360,339,392,.25],[374,340,394,.23],[393,344,380,.18],
          [412,346,388,.17],[420,354,385,.14]]},
        {z:.30,rows:[[352,397,406,.07],[359,383,411,.14],[371,379,411,.18],[389,388,408,.14],[411,390,404,.115],[422,394,423,.12]]},
        {z:.19,rows:[[235,388,398,.063],[240,385,426,.099],[245,393,438,.086],[253,414,438,.09],[278,420,439,.086],
          [310,421,441,.11],[344,419,443,.12],[376,412,440,.14],[397,406,434,.12],[409,404,416,.053]]},
        {z:.26,rows:[[225,357,375,.052],[231,349,379,.072],[245,344,363,.073],[262,340,356,.072],[281,326,346,.086],
          [291,315,339,.084],[297,291,333,.083],[303,287,326,.065],[307,295,317,.028]]},
        {z:.25,rows:[[227,269,277,.044],[232,262,281,.086],[243,263,277,.069],[263,263,271,.06],[297,262,270,.063],
          [334,258,268,.071],[370,251,267,.09],[407,256,273,.1],[421,262,279,.074]]},
        {z:.28,rows:[[232,373,385,.05],[245,375,390,.071],[266,385,401,.088],[281,392,408,.087],[290,398,436,.09],
          [298,403,434,.075],[303,414,429,.035]]}
      ]});
    // Jones's close view ends above the knees. The full view by Xuan Tien
    // shows the soldier kneeling, his hand on his knee and the sloping rock
    // behind the group. Continue the gilded surface over those lower sections.
    const sx=16.31;
    CentralArch.photoCarving(T,k,{photo:'sight-imagery/dien-bien-a1-chien-si.webp',width:480,height:640,
      crop:[93,30,547,767],origin:[345,791],scale:.0047,position:[sx,1.50,3.53],tint:gilt,forms:[
        {z:-.12,rows:[[34,234,253,.05],[44,215,273,.12],[60,196,289,.18],[77,188,300,.21],[96,188,305,.22],
          [118,197,301,.205],[130,211,283,.16],[143,214,273,.135],[151,207,329,.17],[167,191,394,.23],
          [191,179,412,.29],[221,165,438,.32],[246,163,455,.34],[279,167,457,.36],[333,178,456,.35],
          [370,189,449,.34],[400,207,436,.34],[432,219,435,.37],[466,232,457,.4],[521,232,475,.42],
          [570,224,493,.44],[623,209,513,.45],[656,220,539,.47],[703,232,566,.47],
          [747,244,592,.46],[778,256,613,.42],[791,264,623,.37]]},
        {z:.18,rows:[[273,135,161,.05],[278,116,178,.13],[289,102,193,.17],[306,96,201,.19],[329,101,210,.18],
          [348,117,201,.17],[365,133,190,.14],[379,136,199,.13],[393,132,219,.19],[417,120,241,.245],
          [439,115,249,.26],[472,120,250,.265],[505,137,249,.24],[533,140,230,.255],[559,125,233,.26],
          [584,114,239,.26],[623,116,243,.26],[651,119,247,.25],[681,118,270,.275],
          [708,108,266,.30],[733,99,257,.31],[753,106,256,.32],[774,111,262,.30],[788,134,260,.25]]},
        {z:.17,rows:[[616,296,348,.21],[634,284,354,.26],[664,279,368,.27],[693,285,393,.30],
          [717,302,423,.32],[742,309,478,.31],[763,319,501,.28],[779,315,502,.21],[790,307,469,.12]]},
        {z:.23,rows:[[213,212,223,.045],[228,203,238,.08],[255,216,260,.075],[295,244,290,.086],[332,263,316,.103],
          [346,270,337,.14],[367,271,344,.146],[392,288,337,.115],[403,300,329,.058]]}
      ]});
  }
  function cemeteryGate(T,k){
    const white=0xd1d1be,verde=0x737c70;
    const face=new T.Shape();
    face.moveTo(-10.8,0);face.lineTo(-2.14,0);face.lineTo(-2.14,3.04);
    face.absarc(0,3.04,2.14,Math.PI,0,true);face.lineTo(2.14,0);face.lineTo(10.8,0);
    face.lineTo(9.47,6.24);face.lineTo(-9.47,6.24);face.closePath();
    k.profile(face,granite,0,.42,-3.05,6.10);
    for(const s of [-1,1]){
      const x=s*6.17;
      k.outline([[-1.32,0],[-1.32,2.43],[-.82,2.78],[0,2.92],[.79,2.78],[1.32,2.43],[1.32,0]],
        0x8a4c35,x,.42,3.075,.085);
      for(const d of [-.70,0,.70])k.box(0x80523a,x+d,1.73,3.17,.035,2.53,.034);
    }
    for(let i=0;i<13;i++){
      const a=i*Math.PI/13,b=(i+1)*Math.PI/13-.006;
      const pt=(r,t)=>[r*Math.cos(t),r*Math.sin(t)];
      k.outline([pt(2.145,a),pt(2.42,a),pt(2.42,b),pt(2.145,b)],i%2?0xa6a29a:sand,0,3.46,3.08,.18);
    }
    k.box(white,0,6.80,0,19.5,.27,6.47);
    for(const z of [-2.96,2.96]){
      for(let i=-10;i<=10;i++)k.box(white,i*.89,7.16,z,.22,.63,.25);
      k.box(white,0,7.51,z,19.17,.17,.32);
    }
    for(const x of [-2.86,2.86])for(const z of [-1.81,1.81])k.box(cream,x,7.93,z,.37,2.55,.37);
    CentralArch.curvedRoof(T,k,0,8.99,0,8.67,6.32,1.3,verde,0x889082,white,.23);
    for(const x of [-1.96,1.96])for(const z of [-1.23,1.23])k.box(cream,x,10.91,z,.24,1.54,.24);
    const bell=new T.LatheGeometry([[.03,.89],[.27,.79],[.40,.60],[.45,.18],[.57,.07],[.55,0]].map(([x,y])=>new T.Vector2(x,y)),18);
    k.stamp(bell,bronze,0,10.25,0);bell.dispose();
    CentralArch.curvedRoof(T,k,0,11.69,0,6.18,4.57,1.12,verde,0x889082,white,.24);
    k.stamp(k.round,0xb1b1a6,.24,10.62,2.75,.043,7.67,.043);
    k.wavingFlag(2.4,1.5,.25,14.4,2.75);
    for(let t=0;t<4;t++)k.box(granite,0,.062*(4-t),3.10+(t+.5)*.35,9.2,.124*(4-t),.38);
    // A narrow footbridge reaches across the water in front of the gate.
    k.box(0xa6a29a,0,.20,7.62,5.08,.41,6.43);
    for(const s of [-1,1])k.box(slate,s*2.48,.58,7.60,.24,.63,6.42);
  }
  function remembranceGallery(T,k){
    const white=0xcfd0c4;
    k.box(granite,0,.19,0,46,.38,6.55);
    k.box(0xaeafa1,0,2.31,0,45.75,4.22,.36);
    k.box(0x454a48,0,2.10,-.23,44.70,3.24,.12);
    k.box(0xba9452,0,2.01,.24,44.68,2.52,.25);
    for(let j=0;j<15;j++){
      const x=-21.1+j*3.015;
      // Perforated paving, glazed plaques and the open concrete galleries
      // appear on opposite sides of the wall in the press photographs.
      k.box(0xb8ac84,x,2.06,-.31,.027,3.23,.018);
      for(let n=0;n<12;n++)k.box(0x8e8065,x-.04+(n%3)*.03,.74+n*.25,-.312,1.9+.16*((n+j)%4),.018,.016);
      k.outline([[-1.3,-.45],[-.85,.15],[-.61,.44],[-.53,.28],[-.78,.03],[-.36,.17],[-.18,.62],[.06,.67],
        [.22,.52],[.13,.39],[.34,.28],[.72,.60],[.88,.58],[.51,.11],[.19,-.03],[.07,-.58],[-.267,-.56],[-.40,-.16],[-.74,-.42]],
        0xc6a05c,x,2.02,.42,.085);
    }
    for(let j=0;j<=8;j++){
      const x=-22.65+j*5.66;
      for(const z of [-2.45,2.62])k.box(white,x,2.54,z,.28,4.79,.30);
      k.box(white,x,4.92,.08,.30,.31,5.51);
    }
    for(const z of [-2.45,2.62])k.box(white,0,4.92,z,45.92,.33,.34);
    k.box(0xbdbaa9,0,4.83,-1.37,45.7,.18,2.38);
    k.box(0x7a9284,0,.092,6.65,45.7,.17,5.65);
    for(const z of [3.65,9.65])k.box(granite,0,.19,z,46,.37,.23);
  }
  function markerGeometry(T){
    const loop=[[-.28,0],[.28,0]];
    for(let i=0;i<=8;i++){
      const a=i*Math.PI/8;loop.push([.28*Math.cos(a),.53+.23*Math.sin(a)]);
    }
    const v=[],ix=[],n=loop.length;
    for(const z of [-.075,.075])for(const [x,y] of loop)v.push(x,y,z);
    for(let j=0;j<n;j++){
      const q=(j+1)%n;ix.push(j,q,q+n,j,q+n,j+n);
      if(j>0&&j<n-1)ix.push(0,j+1,j,n,n+j,n+j+1);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();return g;
  }
  function graves(T,k,f){
    const head=markerGeometry(T),tiny=new T.Shape();
    for(let i=0;i<10;i++){
      const a=i*Math.PI/5,r=i%2?.034:.081;
      i?tiny.lineTo(r*Math.sin(a),r*Math.cos(a)):tiny.moveTo(r*Math.sin(a),r*Math.cos(a));
    }
    tiny.closePath();const emblem=new T.ShapeGeometry(tiny);
    for(const s of [-1,1])for(const [strip,xMid] of [10.4,20.5,32.1,42.4].entries()){
      // Inner plots leave room for the altar court and four large named
      // graves. The outer plots continue further east on both flanks.
      const inner=strip<2,count=inner?16:24,first=inner?55:21.4;
      for(let row=0;row<count;row++){
        const z=first+row*(inner?4.02:3.87)+Math.floor(row/4)*.72;
        f.fixture(g=>g(s*xMid,z),()=>{
          for(let col=0;col<4;col++){
            const x=s*(xMid+(col-1.5)*1.93);
            k.box(0xa7816e,x,.12,z,1.53,.25,2.34);
            k.box(0xbc9581,x,.315,z,1.37,.15,2.19);
            k.stamp(head,0x595c57,x,.39,z-.68);
            k.stamp(emblem,0xc3a359,x,.95,z-.595);
          }
        });
      }
    }
    for(const s of [-1,1])for(const z of [38.4,45.9]){
      const x=s*13.95;
      f.building(x,z,0,3.74,4.14,()=>{
        k.box(0x555653,0,.26,0,3.60,.52,4.03);
        k.box(slate,0,.59,0,3.18,.20,3.68);
        k.stamp(head,0x555653,0,.69,-.79,2.5,2.28,2.0);
        k.stamp(emblem,0xc3a359,0,1.96,-.62,2.0,2.0,1);
      });
    }
    head.dispose();emblem.dispose();
  }
  function cemetery(T,k){
    finishes(k);const f=createTempleFoundations(T,k);
    // OSM way 403835051 is the cemetery boundary. The A-shaped memorial is
    // mapped separately as way 1334668993. The entrance is some 140 m west
    // of the visitor pin, rather than at the centre of the grave plots.
    f.building(0,3.2,0,44,22,()=>remembrance(T,k));
    f.building(0,139.0,0,22,10,()=>cemeteryGate(T,k));
    for(const s of [-1,1])f.building(s*33.60,141.1,0,46,6.6,()=>remembranceGallery(T,k));
    f.building(-55.0,107.9,0,14.7,25.0,()=>{
      // The caretaker's building on the northern boundary is a raised
      // Thai-style house. Its terracotta roof is visible on the aerial image.
      k.box(0x8d857c,0,.12,0,14.7,.24,25);
      for(const x of [-5.85,5.85])for(const z of [-9.0,-2.95,2.95,9.0])k.box(0x826a56,x,1.41,z,.39,2.70,.39);
      k.box(0x977a60,0,2.68,0,12.82,.30,21.32);
      k.box(0xad8769,0,3.96,0,11.52,2.40,19.94);
      for(const z of [-7.5,-2.5,2.5,7.5])k.box(0x51483c,5.81,4.02,z,.14,1.31,1.7);
      k.place(0,0,Math.PI/2,()=>CentralArch.curvedRoof(T,k,0,5.18,0,24.35,14.18,3.6,0xb56f4d,0x905b43,0x88543d,.33));
    });
    graves(T,k,f);
    // Ground-fitting continuous paving joins the entry, plot paths and the
    // memorial court. Level grave plinths remain independent of the paths.
    const walks=[];
    function paving(x,z,w,d,color,h=.094,map=null){
      const geom=new T.PlaneGeometry(w,d,Math.max(1,Math.ceil(w/3)),Math.max(1,Math.ceil(d/3)));
      geom.rotateX(-Math.PI/2);geom.translate(x,0,z);
      if(map){
        const uv=geom.attributes.uv;
        for(let j=0;j<uv.count;j++)uv.setXY(j,uv.getX(j)*w/3.7,uv.getY(j)*d/3.7);
      }
      const path=new T.Mesh(geom,new T.MeshStandardMaterial({map,color,roughness:.94}));
      path.receiveShadow=true;k.group.add(path);walks.push({geom,h});
    }
    paving(0,22.0,26.8,26.30,granite);
    paving(0,83.05,5.18,96.3,0xa6a29a);
    paving(0,135.1,12.35,8.7,0xa6a29a);
    const lawn=new T.TextureLoader().load('streetscape/verge-grass.webp');
    lawn.wrapS=lawn.wrapT=T.RepeatWrapping;lawn.colorSpace=T.SRGBColorSpace;
    const bush=new T.SphereGeometry(1,10,7);
    for(const s of [-1,1]){
      paving(s*17.75,85.65,23.4,75.0,0x9ca278,.034,lawn);
      paving(s*38.9,70.4,18.8,105.7,0x9ca278,.032,lawn);
      for(const x of [25.9,37.3])paving(s*x,71.6,1.08,108.4,0xa6a29a,.082);
      for(const z of [52.25,70.5,89.2,107.4])paving(s*25.8,z,41.6,.96,0xa6a29a,.080);
      for(const z of [25.0,43.7,62.1,80.2,98.7,118.8])for(const x of [24.9,47.11]){
        f.fixture(g=>g(s*x,z),()=>{
          k.stamp(k.round,0x796950,s*x,.44,z,.14,.85,.14);
          k.stamp(bush,0x66794a,s*x,1.13,z,.88,.84,.78);
          k.stamp(bush,0x5b7142,s*x+.14,1.87,z,.61,.50,.58);
        });
      }
    }
    bush.dispose();
    for(let j=0;j<12;j++){
      const z=39.9+j*7.6;
      for(const s of [-1,1]){
        const x=s*3.59;
        f.fixture(g=>g(x,z),()=>{
          for(let i=-2;i<=2;i++){
            const q=z+i*1.47;
            k.box(i%2?0x657643:0x627644,x,.30,q,.75,.62,1.48);
          }
          if(j%2===0){
            k.stamp(k.round,0x677169,x,.92,z,.07,1.84,.07);
            const ball=new T.SphereGeometry(.24,8,5);k.stamp(ball,0xd8d7bc,x,1.99,z);ball.dispose();
          }
        });
      }
    }
    const trees=[{x:-12,z:8,h:8.3,width:7.2},{x:11.8,z:8.1,h:8.8,width:7.4},
      {x:-46,z:126,h:11,width:8.3},{x:48,z:124,h:10,width:9.0},{x:-49,z:12,h:12,width:8.4}];
    for(const s of [-1,1])for(let j=0;j<7;j++)trees.push({x:s*5.17,z:40+j*13.7,h:3.3+j%3*.28,width:3.02,kind:'palm'});
    const first=k.group.children.length;
    CentralArch.trees(T,k,trees);
    trees.forEach((tree,i)=>{
      const object=k.group.children[first+i],base=object.position.y;
      f.fixture(g=>g(tree.x,tree.z),()=>{},h=>{object.position.y=base+h;});
    });
    const fit=k.group.userData.fitGround;
    k.group.userData.fitGround=g=>{
      fit(g);
      for(const {geom,h} of walks){
        const p=geom.attributes.position;
        for(let j=0;j<p.count;j++)p.setY(j,g(p.getX(j),p.getZ(j))+h);
        p.needsUpdate=true;geom.computeVertexNormals();geom.computeBoundingSphere();
      }
    };
  }
  add('nghia-trang-liet-si-a1','4411037089','Nghĩa trang liệt sĩ quốc gia A1',103.018328,21.381026,
    [103.018595,21.381007],cemeteryYaw,122,192,{
      source:'https://svhttdl.dienbien.gov.vn/ditich/pages/2013/Cac-cong-trinh-the-hien-truyen-thong-va-dao-ly-Uon-8734.aspx',
      photo:'https://nvsk.vnanet.vn/nghia-trang-liet-sy-a1-nhan-chung-lich-su-ve-tinh-than-quat-cuong-cua-dan-toc-1-145620.vna',
      description:'Qua cổng đá và gác chuông phía tây, lối đi giữa hai hàng cây dẫn tới nhà tưởng niệm hình chữ A. Những ngôi sao nhỏ trên hai cánh tường gợi nhớ 644 liệt sĩ yên nghỉ tại đây.',
      gardenRadius:53,modeledBuildings:['w1334668993'],boundary:[[-61,-26],[61,-26],[61,149],[-61,149]],
      reserve:(x,z,r)=>Math.abs(x)<60+r&&z>=-17-r&&z<150+r,
      solids:[[0,0,14,6],[-7,139,4,3.1],[7,139,4,3.1],[-33.6,141.1,23,3.3],[33.6,141.1,23,3.3],[-55,107.9,7.35,12.50]],
      views:[view('Nhà tưởng niệm hình chữ A',13.9,38,cemeteryYaw+.09,.09,local(cemeteryYaw,0,3.6),54),
        view('Cổng đá và gác chuông phía tây',13.8,37.5,cemeteryYaw-.20,.13,local(cemeteryYaw,0,139)),
        view('Lối giữa những hàng mộ',6.1,36,cemeteryYaw-.04,.16,local(cemeteryYaw,0,78)),
        view('Hai cánh tường sao của nhà tưởng niệm',15.0,16.5,cemeteryYaw+.61,.09,local(cemeteryYaw,1.75,2.95),54),
        view('Phụ nữ và em bé nâng dải lụa',9.0,8.0,cemeteryYaw+.04,.035,local(cemeteryYaw,-16.31,6.73),41),
        view('Hai chiến sĩ bên phải nhà tưởng niệm',8.5,8.0,cemeteryYaw-.04,.045,local(cemeteryYaw,16.31,6.73),41)]},cemetery);
})();

export default window.VietnamSights;
