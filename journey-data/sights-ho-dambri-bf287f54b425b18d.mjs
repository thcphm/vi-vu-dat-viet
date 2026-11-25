const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='bo-ho-du-lich-dambri',catalogId='osm-way-304773101';
  const stop=window.VietnamTourism.byId.get(catalogId),A=window.CentralArch;
  const source='https://www.dambri.com.vn/vi/dich-vu/hoat-dong-ngoai-troi/khu-vui-choi-giai-tri-ben-thuyen-11.html';
  // The park's photo shows two low hip roofs, steps and the swan pedalos.
  // The second photo resolves their open seats, painted wings and sunshades.
  // https://www.dambri.com.vn/uploads/dich-vu/hoat-dong-ngoai-troi/dscn0134-fileminimizer.jpg
  // https://www.dambri.com.vn/uploads/dich-vu/hoat-dong-ngoai-troi/dsc_0072-copy-copy.jpg
  // https://www.dambri.com.vn/uploads/news/2023_01/toan-canh-dambri-1_1.jpg
  // Google z20 and Esri z18 anchor the two roof footprints and the paved edge
  // on the north bank. Neither image shows a complete deck across w304774519.
  // https://www.google.com/maps/@11.640688,107.742760,142m/data=!3m1!1e3
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=107.74280,11.64068&level=18
  const lon=107.7427602,lat=11.6406876,yaw=.234,cs=Math.cos(yaw),sn=Math.sin(yaw);
  const offset=(x,z)=>[x*cs+z*sn,-x*sn+z*cs];
  const view=(name,x,z,h,r,a,e,description)=>({name,offset:offset(x,z),height:h,viewRadius:r,viewAngle:yaw+a,
    viewElevation:e,viewFov:58,viewBase:'monument',description});
  const lakeView=stop.views[0],survey=stop.lookout;
  const wide={...lakeView,offset:[(survey.lon-lon)*111320*Math.cos(lat*Math.PI/180)+lakeView.offset[0],
    (lat-survey.lat)*111320+lakeView.offset[1]]};
  const edgePoints=[[-16,5.9],[-13.5,5.5],[-4.8,3.7],[6.8,2.8],[17.7,4.1],[26.2,4.9]];
  function edge(x){
    let i=1;while(i<edgePoints.length-1&&x>edgePoints[i][0])i++;
    const [a,b]=edgePoints[i-1],[c,d]=edgePoints[i];return b+(d-b)*(x-a)/(c-a);
  }
  const snow=0xeee9db,wood=0x65503d,cream=0xe8ddb9,metal=0x9faaa1;
  function shelter(T,k,x,z,w,d,hi,rise){
    const w2=w/2,d2=d/2,r=(w-d*.93)/2;
    const corners=[[-w2,hi,-d2],[w2,hi,-d2],[w2,hi,d2],[-w2,hi,d2]];
    const ridges=[[-r,hi+rise,0],[r,hi+rise,0]],p=[];
    const tri=(a,b,c)=>p.push(...a,...b,...c);
    const [a,b,c,f]=corners,[l,h]=ridges;
    tri(a,l,h);tri(a,h,b);tri(b,h,c);tri(f,c,h);tri(f,h,l);tri(f,l,a);
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.computeVertexNormals();
    k.place(x,z,0,()=>{
      for(const side of [-1,1])for(const u of [-w2+1.1,0,w2-1.1]){
        k.tapered(wood,u,hi*.5,side*(d2-1),.16,.135,hi,1,10);
        A.strut(T,k,wood,u,hi-.74,side*(d2-1),u+(u>0?-.69:.69),hi-.13,side*(d2-1),.075);
      }
      k.box(0x655b46,0,hi-.12,0,w,.24,d);
      for(const [u,v] of [[a,l],[b,h],[c,h],[f,l]])A.strut(T,k,0x82775c,...u,...v,.072);
      A.strut(T,k,0x809184,...l,...h,.13);
      for(const s of [-1,1])k.box(0x60523f,0,hi-.24,s*(d2-.70),w-1.08,.23,.18);
    });
    geo.translate(x,0,z);
    const mat=new T.MeshStandardMaterial({color:0x786e58,roughness:.98,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec3 shelterPoint; varying vec3 shelterNormal;\n'+s.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nshelterPoint=position; shelterNormal=normal;');
      s.fragmentShader='varying vec3 shelterPoint; varying vec3 shelterNormal;\n'+s.fragmentShader.replace('#include <color_fragment>',
        `#include <color_fragment>
        float side=abs(shelterNormal.x)>.30?shelterPoint.z:shelterPoint.x;
        float grain=side*10.7+.22*sin(side*2.9+shelterPoint.y*.69);
        float faded=1.-smoothstep(.16,.61,fwidth(grain));
        diffuseColor.rgb*=.89+.06*cos(side*4.7+shelterPoint.y*.35)+.08*faded*sin(grain*6.28318);`);
    };
    const mesh=new T.Mesh(geo,mat);mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);return mesh;
  }
  function makeHull(T){
    // Sections include both sides of the shell and the recessed cockpit.
    const cross=[[-1,1],[-.96,.69],[-.76,.26],[-.38,.02],[0,0],[.38,.02],[.76,.26],[.96,.69],[1,1],
      [.84,.98],[.76,.69],[.57,.49],[0,.44],[-.57,.49],[-.76,.69],[-.84,.98]];
    const verts=[],inds=[],rows=23,n=cross.length;
    for(let j=0;j<=rows;j++){
      const t=2*j/rows-1,span=.08+.69*(1-Math.abs(t)**3.2)**.47;
      for(const [w,h] of cross)verts.push(w*span,-.15+h*(.49+.15*Math.abs(t)**3),t*1.42);
    }
    for(let j=0;j<rows;j++)for(let i=0;i<n;i++){
      const a=j*n+i,b=j*n+(i+1)%n;inds.push(a,b,a+n,b,b+n,a+n);
    }
    for(let i=1;i<n-1;i++)inds.push(0,i+1,i,rows*n,rows*n+i,rows*n+i+1);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex(inds);g.computeVertexNormals();return g;
  }
  function swan(T,k,hull,wing,canopy){
    k.stamp(hull,snow,0,0,0);
    const bird=A.carving(T,k,snow,0,0,0,1);
    bird.sweep([[0,.34,.76,.245,.30],[0,.53,.91,.205,.24],[0,.78,1.04,.16,.19],
      [0,1.03,1.07,.13,.15],[0,1.27,.99,.107,.14],[0,1.46,1.00,.114,.14],
      [0,1.59,1.11,.131,.153],[0,1.62,1.26,.143,.14],[0,1.56,1.37,.103,.099]],0,14);
    bird.finish();
    const bill=A.carving(T,k,0xe9a330,0,0,0,1);
    bill.sweep([[0,1.56,1.33,.095,.082],[0,1.53,1.43,.094,.062],[0,1.48,1.59,.035,.031],[0,1.47,1.62,.018,.013]],0,10);
    bill.finish();
    const wingShape=new T.Shape();
    wingShape.moveTo(-1.05,.42);wingShape.quadraticCurveTo(-1.07,.80,-.96,.89);
    wingShape.quadraticCurveTo(-.78,.99,-.44,.71);wingShape.quadraticCurveTo(.04,.38,.59,.44);
    wingShape.quadraticCurveTo(.80,.29,.47,.27);wingShape.lineTo(-.84,.26);wingShape.closePath();
    const wingGeo=new T.ExtrudeGeometry(wingShape,{depth:.044,bevelEnabled:false,curveSegments:8});
    for(const side of [-1,1]){
      k.stamp(wingGeo,wing,side*.67,0,0,1,1,1,-Math.PI/2);
      k.stamp(k.round,0x353730,side*.123,1.647,1.271,.032,.031,.034);
      for(let i=0;i<3;i++){
        const z=-.89+i*.22,y=.71-i*.115;
        A.strut(T,k,cream,side*.716,y,z,side*.716,y-.10,z+.18,.014);
      }
    }
    wingGeo.dispose();
    k.box(0xd5d6c7,0,.28,-.24,.96,.115,.47);
    k.box(0xddd9c9,0,.47,-.47,.98,.39,.075,0,-.09);
    if(canopy){
      for(const side of [-1,1]){
        A.strut(T,k,metal,side*.56,.37,-.82,side*.64,1.25,-.73,.021);
        A.strut(T,k,metal,side*.55,.36,.26,side*.64,1.21,.34,.021);
        A.strut(T,k,metal,side*.56,.42,-.52,side*.64,1.21,.33,.015);
      }
      for(let i=0;i<9;i++)k.box(i%2?cream:canopy,(i-4)*.154,1.24+.075*(1-((i-4)/4)**2),-.20,.155,.041,1.19);
    }
  }
  function quay(T,k){
    const positions=[],colors=[],order=[],data=[],col=new T.Color();
    function vertex(x,r,tint){
      const e=edge(x),z=r===0?e+2.25:r===1?e+2.05:r===2?e-2.02:r===16?-10.1:r===17?-13.0:
        e-2.02-Math.ceil((r-3)/2)*.55;
      const grassy=r>2&&(x>12.7||x< -14.5);
      positions.push(x,0,z);data.push({x,z,r});col.setHex(grassy?0x707d55:tint);colors.push(col.r,col.g,col.b);
    }
    function face(x0,x1,r){
      const start=data.length,tint=r===0?0x928e7e:r>15?0x9b9a85:r===1||r%2===0?0xb1ad97:0x9c9986;
      vertex(x0,r,tint);vertex(x0,r+1,tint);vertex(x1,r+1,tint);vertex(x1,r,tint);
      order.push(start,start+1,start+2,start,start+2,start+3);
    }
    for(let i=0;i<37;i++)for(let r=0;r<17;r++)face(-16+i*1.15,-16+(i+1)*1.15,r);
    const g=new T.BufferGeometry(),pos=new T.Float32BufferAttribute(positions,3);
    g.setAttribute('position',pos);g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(order);g.computeVertexNormals();
    const mat=new T.MeshStandardMaterial({vertexColors:true,roughness:.97,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 apronPoint;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\napronPoint=position.xz;');
      s.fragmentShader='varying vec2 apronPoint;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=apronPoint/vec2(1.1,.73);p.x+=.5*mod(floor(p.y),2.);
        vec2 joint=min(fract(p),1.-fract(p)),aa=max(fwidth(p),vec2(.003));
        vec2 interior=smoothstep(vec2(.013)-aa*.36,vec2(.013)+aa*.36,joint);
        if(diffuseColor.r>diffuseColor.g*.97)diffuseColor.rgb*=.77+.23*interior.x*interior.y;`);
    };
    const mesh=new T.Mesh(g,mat);mesh.receiveShadow=true;k.group.add(mesh);
    return (ground,level,upper)=>{
      const landings=new Map(),heights=new Map();
      function surface(x,z){
        const key=x+','+z;if(!heights.has(key))heights.set(key,ground(x,z));
        return heights.get(key);
      }
      for(let i=0;i<pos.count;i++){
        const {x,z,r}=data[i];
        if(!landings.has(x))landings.set(x,Math.max(level(x,edge(x)+3.2)+.46,surface(x,edge(x)-2.02)+.17));
        const h=landings.get(x),rear=surface(x,z),blend=Math.min(1,(x+16)/1.9,(26.55-x)/2);
        const step=r<=2?0:r>=15?1:Math.ceil((r-2)/2)/7;
        const slope=Math.max(0,Math.min(1,(edge(x)-2.02-z)/3.85));
        const flight=Math.max(0,Math.min(1,(x+4.6)/.56,(4.55-x)/.56));
        const rise=slope+(step-slope)*flight;
        const cover=r>2?Math.max(0,Math.min(1,(16.6-x)/3.8,(x+16)/1.8)):1;
        const peak=rear+.12+(upper-rear-.12)*cover;
        const y=r===0?Math.min(h-1.05,rear-.22):r===17?rear-.06:Math.max(rear+.12,h+(peak-h)*rise);
        pos.setY(i,rear+(y-rear)*Math.max(0,blend));
      }
      pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();g.computeBoundingBox();
    };
  }
  function build(T,k){
    const fitQuay=quay(T,k),structures=[],boats=[],hull=makeHull(T);
    const first=k.vertexCount();
    const roofs=[shelter(T,k,-8.54,-5.47,13.78,9.52,2.78,2.22),
      shelter(T,k,4.79,-6.00,14.92,7.69,2.66,1.83)];
    structures.push([first,k.vertexCount()]);
    const moorings=[[-8.0,9.75,-2.75,0xd95240,0x617fbb],[-4.65,9.15,2.88,0x497c63,0],
      [-1.0,8.45,3.03,0x4b7eb0,0xd8823a],[3.0,8.5,-2.94,0xd55743,0],
      [7.1,8.94,2.89,0x547b52,0x5194b0],[8.9,17.4,-1.02,0xbc543b,0],[17.3,24.0,.78,0x537c70,0]];
    for(const [x,z,heading,color,canopy] of moorings){
      const start=k.vertexCount();k.place(x,z,heading,()=>swan(T,k,hull,color,canopy));
      boats.push({x,z,start,end:k.vertexCount()});
    }
    hull.dispose();
    const treesStart=k.group.children.length;
    createTreeModels(T).grove(k.group,[[-19.1,0,-2.9,8.4,9.5,.4],[-22.6,0,2.2,7.2,8.4,1.7],
      [-23.2,0,7.6,7.7,9.4,2.43],[-26.5,0,13.2,8.7,10.6,.84],[-28.2,0,20.4,8.2,9.2,2.2],[-22.1,0,-8.2,7.4,9.3,.65],
      [26.6,0,-.87,3.1,4.1,.45],[30,0,-1.3,3.3,4.3,.91],[35.4,0,-1.1,3.9,4.9,2.2]]);
    const trees=k.group.children.slice(treesStart);let solid,rest,dirty=false,shapeGround;
    function adjust(){
      const p=solid.attributes.position,loc=typeof roads!=='undefined'&&roads?.point?roads.point(lon,lat):null;
      const upper=shapeGround(0,-8.6)+.10;
      for(const roof of roofs)roof.position.y=upper;
      function level(x,z){
        if(loc&&typeof gfx!=='undefined'&&gfx?.waterAt){
          for(const shift of [0,1.7,3.8,7]){
            const [dx,dz]=offset(x,z+shift),w=gfx.waterAt(loc.x+dx,loc.z+dz);
            if(w&&Number.isFinite(w.level))return w.level-k.group.position.y;
          }
        }
        return shapeGround(x,edge(x))-.60;
      }
      for(const [a,b] of structures)for(let i=a;i<b;i++)p.setY(i,rest[i]+upper);
      for(const b of boats){
        const h=level(b.x,b.z);for(let i=b.start;i<b.end;i++)p.setY(i,rest[i]+h);
      }
      function bank(x,z){
        if(!loc||typeof gfx==='undefined'||!gfx?.ground)return shapeGround(x,z);
        const [dx,dz]=offset(x,z);return gfx.ground(loc.x+dx,loc.z+dz)-k.group.position.y;
      }
      fitQuay(bank,level,upper);
      p.needsUpdate=true;solid.computeBoundingSphere();solid.computeBoundingBox();
    }
    k.group.userData.fitGround=ground=>{
      shapeGround=ground;
      const mesh=k.group.children.find(m=>m.geometry?.attributes.finishKind);
      if(!mesh)return;
      solid=mesh.geometry;const p=solid.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      adjust();dirty=true;
      mesh.onBeforeRender=()=>{if(dirty){dirty=false;adjust();}};
      for(const tree of trees){
        const m=tree.instanceMatrix;
        for(let i=0;i<tree.count;i++){const j=i*16+12;m.array[j+1]=ground(m.array[j],m.array[j+2])-.07;}
        m.needsUpdate=true;tree.computeBoundingSphere();
      }
    };
  }
  (window.VietnamSights??=[]).push({...stop,id,catalogId,lon,lat,yaw,lookout:{lon,lat,kind:'Bến thuyền'},
    kind:'Hồ',name:'Hồ Đambri',locality:'Bảo Lộc',source,photo:source,map:'https://www.openstreetmap.org/way/304773101',
    start:[107.7445308,11.6412412],mappedEntrance:true,visitOnArrival:true,
    width:57,depth:44,gardenRadius:13,foundationAt:[0,-3],solids:[],
    reserve:(x,z,p)=>x>-31-p&&x<33+p&&z>-13-p&&z<9+p,
    boundary:[[-30,-12],[27,-12],[28,6],[-16,9],[-28,22],[-32,17]],
    arrivalNote:'Xe dừng ở đầu đường vào Khu du lịch Đambri. Từ các bãi đỗ bên trong, đường đi bộ men theo bờ bắc đến bến thuyền.',
    description:'Bến đạp vịt nằm bên hồ Đambri, ở phía nam khu thác. Hai mái che và sân bậc sát nước được đặt theo ảnh vệ tinh. Thuyền hình thiên nga phỏng theo ảnh chụp của đơn vị quản lý. Số thuyền và vị trí neo thay đổi theo buổi.',
    views:[view('Thuyền thiên nga ở bến bờ bắc',-2.8,8.1,-4.4,19.5,1.85,.15,
      'Nhìn dọc bến từ phía đông, qua dãy thuyền bàn đạp có cổ thiên nga, cánh sơn màu và khoang ngồi cho hai người.'),
      view('Hai mái bến và bậc xuống nước',-.5,-1.1,5.7,34,.44,.21,
        'Từ phía hồ nhìn vào hai mái che nối tiếp và những bậc đưa khách từ sân xuống sát thuyền.'),
      wide],build});
})();

export default window.VietnamSights;
