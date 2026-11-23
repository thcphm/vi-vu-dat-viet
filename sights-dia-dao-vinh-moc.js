'use strict';
(()=>{
  const id='dia-dao-vinh-moc',catalogId='osm-node-1016630618';
  const atlas=window.VietnamTourism;
  const raw=atlas?.byId?.get(catalogId)??atlas?.entries?.find(s=>s.id===catalogId);
  const lon=107.1131037,lat=17.0745158,pi=Math.PI;
  const source='https://dsvh.gov.vn/di-tich-lich-su-dia-dao-vinh-moc-va-he-thong-lang-ham-vinh-linh-2989';
  const doorPhoto='https://commons.wikimedia.org/wiki/File:%C4%90%E1%BB%8Ba_%C4%91%E1%BA%A1o_V%E1%BB%8Bnh_M%E1%BB%91c.jpg';
  // East/south metres from the public entrance no. 3. The provincial tour's
  // camera coordinates are distinct from the roof centroids in World Imagery.
  // The visitor reception court is OSM w87628785. The red exhibition room
  // south of node32 is separate from both reception and museum n1016630582.
  const portal=[0,0,-3.04],reception=[-298.8,2.9,-.18],exhibition=[-145.6,83.2,3.09];
  const maternity=[-40.97,67.85,0],shore=[-15.03,88.1,.83];
  function relative([x,z,a],u,v){return [x+u*Math.cos(a)+v*Math.sin(a),z-u*Math.sin(a)+v*Math.cos(a)];}
  function shot(name,part,u,v,ex,ez,h,up,fov){
    const target=relative(part,u,v),eye=relative(part,ex,ez);
    return {name,offset:target,viewAngle:Math.atan2(eye[0]-target[0],eye[1]-target[1]),
      viewRadius:Math.hypot(ex-u,ez-v,up),viewElevation:Math.atan2(up,Math.hypot(ex-u,ez-v)),
      height:h/.46,viewBase:'monument',viewFov:fov};
  }
  const views=[
    shot('Cửa số 3 dưới những bụi tre',portal,0,.08,-.70,4.67,.58,1.42,57),
    shot('Sân nhà đón tiếp và chiếu phim',reception,0,.5,4.1,32,4.4,.83,56),
    shot('Bậc vào phòng trưng bày bổ sung',exhibition,0,5.9,-1.9,21.4,2.75,.26,55),
    {...shot('Gian hộ sinh trong trưng bày',maternity,-.08,-.65,.14,2.95,1.13,1,52),
      photoCatalogId:'quang-tri-phong-ho-sinh-vinh-moc',photo:'https://commons.wikimedia.org/wiki/File:Maternity_Room_in_Vinh_Moc_tunnel.JPG'},
    shot('Bờ biển bên lối ra cửa số 4',shore,2.9,6.4,-.68,-3.0,.30,2.55,67)
  ];
  const seed=n=>{const v=Math.sin(n*77.271+.195)*41271.197;return v-Math.floor(v);};
  function tube(T,k,tint,pts,r){
    const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));
    const g=new T.TubeGeometry(c,Math.max(3,pts.length*2),r,6);k.stamp(g,tint,0,0,0);g.dispose();
  }
  function surface(T,k,points,tint){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));
    g.computeVertexNormals();k.stamp(g,tint,0,0,0);g.dispose();
  }
  function bamboo(T,k,x,z,scale,seed0){
    const leaves=[[],[],[]],quad=(v,a,b,c)=>v.push(...a,...b,...c,...c,...b,...a);
    for(let i=0;i<7;i++){
      const n=seed0+i*11,a=seed(n)*pi*2,h=scale*(.71+.38*seed(n+1));
      const dx=Math.sin(a)*scale*(.20+.19*seed(n+2)),dz=Math.cos(a)*scale*(.20+.19*seed(n+3));
      const x0=x+Math.sin(a)*.28,z0=z+Math.cos(a)*.28;
      const point=v=>[x0+dx*v*v,h*v+.13,z0+dz*v*v];
      tube(T,k,[0x74793f,0x828746,0x677a47][i%3],[point(0),point(.41),point(.76),point(1)],.034+scale*.003);
      for(let j=1;j<8;j++){
        const [xx,yy,zz]=point(j/8);k.stamp(k.round,0x848857,xx,yy,zz,.056,.047,.056);
        if(j<3)continue;
        for(let side=0;side<2;side++){
          const turn=a+side*pi+.35*seed(n+j),r=scale*(.10+.085*seed(n*j+side));
          const end=[xx+Math.sin(turn)*r,yy+.22,zz+Math.cos(turn)*r];
          tube(T,k,0x738248,[[xx,yy,zz],end],.015);
          for(let l=0;l<7;l++){
            const ang=turn+Math.sin(l*2.4+n)*1.24,dist=.25+.55*seed(n+j+l);
            const base=[xx+(end[0]-xx)*(l+1)/8,yy+.21*(l+1)/8,zz+(end[2]-zz)*(l+1)/8];
            const tip=[base[0]+Math.sin(ang)*dist,base[1]-.13-.23*dist,base[2]+Math.cos(ang)*dist];
            const mid=[(tip[0]+base[0])*.5+.074*Math.cos(ang),base[1]+.045,(tip[2]+base[2])*.5-.074*Math.sin(ang)];
            const mid2=[mid[0]-.14*Math.cos(ang),mid[1]-.02,mid[2]+.14*Math.sin(ang)];
            const batch=leaves[(i+j+l)%3];quad(batch,base,mid,tip);quad(batch,base,tip,mid2);
          }
        }
      }
    }
    leaves.forEach((v,i)=>surface(T,k,v,[0x65874c,0x769550,0x506f45][i]));
  }
  function visitorPortal(T,k){
    // Camera node40 looks down into a narrow, approximately rectangular door.
    // Its mossy retaining walls turn out on each side of the approach.
    const stone=new T.IcosahedronGeometry(1,1),moss=[0x8b8c60,0x78815b,0xa49a77,0x74775c,0x938d6c,0x9c8c69];
    k.palette({stone:[...moss,0x8e826d,0x978a73]});
    const opening=y=>.52-.075*Math.max(0,y+.67);
    for(const side of [-1,1]){
      k.box(0x786d56,side*1.51,.18,-.24,2.0,2.38,.63);
      k.box(0x655d4c,side*.52,.10,-.60,.16,2.1,.92);
    }
    k.box(0x787659,0,1.17,-.24,1.10,.52,.65);
    k.box(0x4b342a,0,.09,-1.31,1.16,2.48,.13);
    k.box(0x352c24,.15,.15,-1.21,.78,2.21,.05);
    k.box(0x513e30,0,1.08,-.75,1.10,.11,1.16);
    k.box(0x7b654c,0,-.93,-.12,1.73,.18,2.65);
    for(let i=0;i<10;i++){
      const y=-.84+i*.233;
      for(let j=-9;j<=9;j++){
        const x=j*.279+(i%2)*.127,n=(i+1)*79+j*8;
        if(y<.95&&Math.abs(x)<opening(y)+.065)continue;
        k.stamp(stone,moss[Math.floor(seed(n)*moss.length)],x+.04*seed(n+1),y+.035*seed(n+2),.076+.025*seed(n+3),
          .18+.058*seed(n+4),.143+.035*seed(n+5),.13+.04*seed(n+6),n,.16*seed(n+3),n*.26);
      }
    }
    for(const side of [-1,1]){
      for(let i=0;i<13;i++){
        const v=i*.315,x=side*(.89+.19*v+.026*v*v)-.067*v*v,top=1.42-.046*v;
        const bottom=-.96+.235*v;
        k.stamp(stone,0x767b52,x+side*1.1,top-.12,v+.18,1.19,.27,.89,i*.23);
        k.box(0x79765b,x+side*.59,(top+bottom)*.5,v+.18,1.25,top-bottom,.40);
        for(let r=0;bottom+.12+r*.237<top+.055;r++){
          const n=83*i+7*r+side*19;
          k.stamp(stone,moss[Math.floor(seed(n)*moss.length)],x+side*.022,bottom+.12+r*.237,v+.18+(r%2)*.10,
            .14,.151+.03*seed(n+1),.21+.05*seed(n+2),n,.14,n*.3);
        }
      }
    }
    for(let i=0;i<10;i++){
      const top=-.82+i*.19,z=.55+i*.45;
      const x=-.067*z*z;
      k.box(i%3===0?0x8e826d:0x978a73,x,top-.115,z,1.68+i*.152,.23,.48);
      k.box(0x756c58,x,top-.025,z-.198,1.67+i*.152,.05,.054);
    }
    // Banks remain low behind the masonry; crowns and roots are visible
    // above the door in the photographed view.
    for(let i=0;i<24;i++){
      const n=28+i*17,a=seed(n)*pi*2,xx=Math.sin(a)*(2.4+1.3*seed(n+1)),zz=-1+Math.cos(a)*(1.65+seed(n+2));
      if(zz>.05&&Math.abs(xx)<2.15)continue;
      k.stamp(stone,0x6d7651,xx,1.00,zz,.67+.7*seed(n+3),.37+.25*seed(n+4),.78+.48*seed(n+5),n);
    }
    for(const [x,z,h] of [[-2.5,-.72,5.4],[2.9,-1.1,6.1],[-3.7,2.2,4.9],[3.9,2.7,4.4],[.5,-3.2,5.9]])bamboo(T,k,x,z,h,Math.round((x+5.4)*17));
    for(let i=0;i<8;i++){
      const x=-2.7+i*.77;k.stamp(stone,0x786f51,x,1.12,-.67,.69,.43+.09*seed(i),1.15,seed(i+6));
      k.stamp(stone,0x6f7950,x,1.42,-.71,.69,.17+.09*seed(i),1.08,seed(i+6));
    }
    stone.dispose();
  }
  function receptionHall(T,k){
    const cream=0xe6c992,straw=0xd4a074,red=0xa77859,wall=0xd9b484,shadow=0x544e43;
    k.box(0xb7ab93,0,.07,12.30,31.0,.14,15.5);
    k.box(wall,0,2.13,-.83,23.3,4.21,10.62);
    for(const side of [-1,1]){
      const x=side*8.79;
      k.box(wall,x,2.13,4.93,6.28,4.21,1.69);
      k.box(cream,x,4.19,-.20,6.28,.32,12.11);
      for(let j=-1;j<=1;j++){
        const px=x+j*1.87;k.box(red,px,2.15,5.73,1.46,2.93,.12);
        k.box(shadow,px,2.12,5.80,1.13,2.55,.07);k.box(straw,px,3.73,5.82,.38,.47,.08);
      }
    }
    const gable=new T.Shape();gable.moveTo(-5.65,1.0);gable.lineTo(0,10.05);gable.lineTo(5.65,1.0);gable.closePath();
    k.profile(gable,cream,0,0,4.54,.50);
    for(const side of [-1,1]){
      const x=side*3.15;
      k.box(red,x,5.67,-.65,.33,Math.hypot(6.3,9.89),14.70,0,0,side*.567);
      k.box(cream,x,5.68,6.67,.55,Math.hypot(6.3,9.89),.43,0,0,side*.567);
      k.box(straw,x*1.052,5.57,6.92,.16,Math.hypot(6.3,9.89),.19,0,0,side*.567);
      k.box(0xe1cfa4,x*.94,5.58,6.01,.52,Math.hypot(5.99,9.71),1.42,0,0,side*.553);
    }
    k.box(straw,0,10.58,-.60,.24,.27,14.92);
    k.box(cream,0,4.01,6.08,7.75,.49,1.44);k.box(red,0,2.02,4.69,5.20,3.46,.14);
    k.box(shadow,0,1.85,4.79,4.14,2.92,.088);
    for(const x of [-3.48,3.48])k.box(cream,x,2.11,6.55,.44,3.86,.56);
    for(const x of [-1.2,-.4,.4,1.2])k.box(red,x,5.55,5.06,.20,.56,.078);
    k.box(cream,0,4.60,5.35,6.46,.25,.50);
    for(const s of [-1,1]){
      k.box(cream,s*2.74,2.22,6.32,.29,3.5,.47);
      k.box(0x988b62,s*2.77,1.95,6.41,.18,2.88,.51);
      for(let j=0;j<4;j++)k.box(cream,s*(5.98+j*1.72),2.13,5.89,.20,3.9,.26);
    }
    k.box(0x8c6247,0,3.39,4.855,3.92,.27,.046);k.box(straw,0,1.66,4.865,.064,2.78,.045);
    for(const side of [-1,1]){
      k.box(0x6d6958,side*1.53,2.13,4.865,.65,1.64,.036);
      k.box(cream,side*2.62,2.24,5.59,.23,3.09,1.80);
      k.box(cream,side*3.47,.82,6.53,.71,.36,.79);
    }
    window.CentralArch.trees(T,k,[[-16,4,8.7],[-13,-6,7.9],[14,-8,9.4],[16.5,5,8.8],[-16,15,8.1],[16,19.6,6.4]]
      .map(([x,z,h])=>({x,z,h,width:h*.77})));
    for(let i=0;i<4;i++)k.box(i%2?0xad9782:0xb9a38a,0,.39-i*.096,6.9+i*.36,8.86,.80-i*.20,.44);
  }
  function exhibitHall(T,k){
    const peach=0xad7265,ivory=0xd4cfc0,red=0x975b49;
    k.box(0x877964,0,.21,0,8.55,.42,17.3);
    k.box(peach,0,2.57,-.10,8.51,4.40,17.03);
    k.box(0x95665a,0,4.71,-.06,9.07,.27,17.68);
    for(let j=0;j<3;j++)k.box([ivory,0xaa8f80,0xc3b3a1][j],0,4.88+j*.112,-.06,9.64+j*.18,.116,18.12+j*.12);
    k.box(ivory,0,2.16,8.48,3.99,3.36,.21);k.box(0x4a423e,0,1.90,8.606,3.23,2.68,.08);
    k.box(0x322f2b,0,1.92,8.658,2.71,2.61,.031);
    for(const x of [-1.65,1.65])k.box(0xc1ada4,x,2.01,8.70,.14,2.87,.09);
    for(const sign of [-1,1]){
      const shape=new T.Shape();shape.moveTo(sign*1.47,0);shape.lineTo(sign*1.43,2.66);
      shape.lineTo(sign*.91,2.66);shape.quadraticCurveTo(sign*1.15,2.14,sign*1.30,.91);shape.closePath();
      k.profile(shape,0xc5b4a7,0,.59,8.71,.033);
    }
    for(let i=0;i<5;i++)k.box(red,0,.44-i*.085,8.83+i*.37,4.16,.91-i*.17,.44);
    k.box(0x998a75,0,.036,15.4,4.95,.09,12.1);
    for(const [x,z,h] of [[6.7,9.7,6.6],[-6.7,7.1,6.2],[7.3,16.6,7.4],[-7.8,16.5,6.3]])bamboo(T,k,x,z,h,21+Math.round(z*4));
    window.CentralArch.trees(T,k,[[-8,-6,9.6],[7,-7,8.9],[-10,3,9.1],[12,5,10.4],[8.8,19.8,8.2],[-12,19,8.1]]
      .map(([x,z,h])=>({x,z,h})));
  }
  // Only the publicly displayed niche seen from tour node16 and in the
  // maternity photograph is staged. No underground survey or depth is known.
  // The vignette is only drawn alongside its close-up camera. This keeps the
  // interior out of the aboveground landscape between viewpoints.
  function maternityDisplay(T,k){
    const group=new T.Group();k.group.add(group);
    const ball=new T.SphereGeometry(1,15,11),cube=new T.BoxGeometry(),mats=new Map();
    function material(tint,vertex=false){
      const key=tint+'/'+vertex;if(mats.has(key))return mats.get(key);
      const m=new T.MeshLambertMaterial({color:tint,emissive:vertex?0x5e4132:tint,emissiveIntensity:vertex ? .30 : .33,side:T.DoubleSide,vertexColors:vertex});
      m.onBeforeCompile=s=>{
        s.vertexShader='varying vec3 displayView;varying vec3 soilPosition;\n'+s.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\n displayView=mvPosition.xyz;soilPosition=position;');
        s.fragmentShader='varying vec3 displayView;varying vec3 soilPosition;\n'+s.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\n if(length(displayView)>8.4)discard;');
        if(vertex)s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec3 q=soilPosition;float seam=q.y*21.+sin(9.*q.z+q.x*6.)+3.9*sin(q.x*8.+q.z*11.+q.y*5.);
          float grain=fract(sin(dot(floor(q*118.),vec3(12.13,2.4,72.84)))*4174.26);
          diffuseColor.rgb*=.92+.095*sin(seam)+.22*grain+.16*sin(q.x*3.+q.y*3.-q.z*4.);
        `);
      };
      m.customProgramCacheKey=()=>vertex?'vinh-moc-exhibit-soil':'vinh-moc-exhibit-figures';
      mats.set(key,m);return m;
    }
    function mesh(g,tint,x,y,z,w=1,h=1,d=1,rx=0,rz=0){
      const o=new T.Mesh(g,material(tint));o.position.set(x,y,z);o.scale.set(w,h,d);o.rotation.set(rx,0,rz);group.add(o);return o;
    }
    function limb(tint,a,b,r1,r2){
      const u=new T.Vector3(...a),v=new T.Vector3(...b),delta=v.clone().sub(u);
      const g=new T.CylinderGeometry(r2,r1,delta.length(),10),o=new T.Mesh(g,material(tint));
      o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());o.position.copy(u.add(v).multiplyScalar(.5));group.add(o);
    }
    const geo=new T.BufferGeometry(),p=[],colors=[];
    function tri(a,b,c,n){
      p.push(...a,...b,...c);
      for(const v of [a,b,c]){
        const light=.77+.20*seed(n+v[0]*2.3+v[2])+.085*Math.cos(v[1]*10-v[0]*9);
        const tint=new T.Color().setRGB(.395*light,.206*light,.126*light);
        colors.push(tint.r,tint.g,tint.b);
      }
    }
    const ring=[];
    for(let j=0;j<=17;j++){
      const z=-2.48+j*.356,row=[];
      for(let i=0;i<=21;i++){
        const a=i*pi/21,n=i*233+j*17,disturb=.043*(seed(n)-.48)+.03*Math.sin(3.7*z+i*.44);
        const width=1.68+.10*Math.sin(z*1.7)+disturb;
        row.push([Math.cos(a)*width,Math.pow(Math.max(0,Math.sin(a)),.59)*(2.66+.09*Math.cos(z)+disturb),z]);
      }
      ring.push(row);
      for(let i=1;j&&i<row.length;i++){
        tri(ring[j-1][i-1],row[i-1],row[i],i*13+j);tri(ring[j-1][i-1],row[i],ring[j-1][i],i+j*11);
      }
    }
    for(let i=1;i<ring[0].length;i++)tri([0,.85,-2.54],ring[0][i-1],ring[0][i],i*7);
    tri([0,.85,-2.54],ring[0].at(-1),ring[0][0],31);
    geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    geo.computeVertexNormals();group.add(new T.Mesh(geo,material(0xd5ad8a,true)));
    mesh(cube,0x936747,0,-.045,.1,3.52,.16,7.30);
    const skin=0xcca384,hair=0x392f28,brown=0x6c4b3f,slate=0x494b48,ivory=0xd5ccb4;
    function head(x,y,z,ang=0){
      mesh(ball,hair,x,y+.045,z-.027,.123,.155,.111,ang);
      mesh(ball,skin,x,y+.003,z+.040,.101,.125,.092,ang);
    }
    // The standing attendant holds a wrapped infant; the mother lies on
    // the adjacent wooden bed. These are museum figures, not a live scene.
    const x=-.61,z=-1.13;
    for(const s of [-1,1]){
      limb(slate,[x+s*.115,.08,z],[x+s*.095,.83,z+.015],.068,.087);
      mesh(ball,0x4a3c30,x+s*.117,.066,z+.059,.088,.058,.132);
    }
    mesh(ball,brown,x,1.02,z,.211,.345,.142);mesh(ball,brown,x,1.30,z,.231,.182,.150);
    limb(skin,[x,1.39,z],[x,1.56,z+.01],.064,.060);head(x,1.60,z+.01,.12);
    for(const s of [-1,1]){
      limb(brown,[x+s*.180,1.34,z],[x+s*.218,1.12,z+.115],.074,.063);
      limb(skin,[x+s*.219,1.13,z+.114],[x+s*.082,1.13,z+.265],.054,.040);
      mesh(ball,skin,x+s*.078,1.13,z+.27,.045,.051,.060);
    }
    mesh(ball,ivory,x-.01,1.16,z+.265,.205,.093,.095,0,.22);
    mesh(ball,skin,x+.158,1.185,z+.29,.064,.068,.065);
    for(let i=0;i<3;i++)limb(0xc3bca4,[x-.13+i*.048,1.17,z+.325],[x-.08+i*.048,1.12,z+.33],.009,.008);
    for(let i=0;i<3;i++)mesh(ball,0x9c8170,x,1.33-i*.081,z+.141,.009,.010,.009);
    const bx=.57,bz=-.26;
    for(const dx of [-.34,.34])for(const dz of [-.79,.79])mesh(cube,0x815033,bx+dx,.234,bz+dz,.087,.46,.087);
    mesh(cube,0xa46743,bx,.48,bz,.80,.14,1.84);mesh(cube,0xc5a46f,bx,.57,bz,.74,.057,1.74);
    const teal=0x778477;mesh(ball,0xccc298,bx,.64,bz+.58,.29,.11,.22);
    mesh(ball,hair,bx,.732,bz+.56,.16,.110,.152);mesh(ball,skin,bx-.01,.793,bz+.552,.120,.078,.120);
    mesh(ball,teal,bx,.714,bz+.18,.241,.15,.363);mesh(ball,0xb3a17c,bx,.691,bz-.37,.251,.119,.48);
    limb(teal,[bx-.17,.73,bz+.28],[bx-.22,.688,bz-.03],.073,.060);
    limb(skin,[bx-.22,.69,bz-.03],[bx-.13,.74,bz-.18],.046,.039);
  }
  function seaSteps(T,k){
    // Camera node211 on the lower seawall. The public steps go inland.
    // Smooth wave-breaking blocks stand on the seaward edge of the path.
    const concrete=0xa29b87,edge=0x857f6d;
    k.box(0xa79d84,0,-.14,1.35,58,.30,3.0);
    for(let i=0;i<7;i++){
      const z=-.37-i*.42,y=.13+i*.192;
      k.box(i%2?edge:concrete,0,y*.5,z,2.34,y,.46);
      k.box(0xb4ad92,0,y-.01,z+.18,2.39,.05,.068);
    }
    k.box(edge,-15,.21,-.22,27.4,.53,.35);k.box(edge,15,.21,-.22,27.4,.53,.35);
    for(let i=-7;i<=7;i++){
      const h=.68+.065*seed(i);k.tapered(concrete,i*4.1,h*.5,3.07,.62,.38,h,.98,4);
    }
    const points=[],colours=[0x8b8179,0x9c9283,0xaaa091,0x7d7770],rock=new T.IcosahedronGeometry(1,0);
    for(let i=0;i<250;i++){
      const x=(seed(i*7)-.5)*60,z=3.11+seed(i*7+1)*7.15,r=.075+.20*seed(i*7+2);
      const y=-.21-(z-3.1)*.148;
      k.stamp(rock,colours[i%4],x,y+.025,z,r,.52*r,r*.76,seed(i*7+3)*pi);
    }
    points.push(-34,-.23,2.71,-34,-1.57,12.1,34,-.23,2.71,34,-.23,2.71,-34,-1.57,12.1,34,-1.57,12.1);
    surface(T,k,points,0x918578);
    const foliage=new T.IcosahedronGeometry(1,1);
    for(let i=-12;i<=12;i++){
      if(Math.abs(i)<1)continue;
      const x=i*2.3,z=-3.48-.57*seed(i),ht=.51+.50*seed(i+11);
      for(let j=0;j<7;j++){
        const t=i*13+j*31,xp=x+1.04*(seed(t)-.5),zp=z+.91*(seed(t+1)-.5);
        k.stamp(foliage,[0x59794a,0x6b824f,0x748856,0x517342][j%4],xp,.56+.67*seed(t+2),zp,
          .57+.37*seed(t+3),ht*(.61+.43*seed(t+4)),.55+.38*seed(t+5),seed(t+6)*pi);
      }
    }
    rock.dispose();foliage.dispose();
  }
  function build(T,k){
    const parts=[];
    const fixtures=[[portal,visitorPortal],[reception,receptionHall],[exhibition,exhibitHall],[maternity,maternityDisplay],[shore,seaSteps]];
    for(const [place,builder] of fixtures){
      const [x,z,yaw]=place,first=k.vertexCount(),child=k.group.children.length;
      k.place(x,z,yaw,()=>builder(T,k));
      const children=k.group.children.slice(child);parts.push({x,z,first,end:k.vertexCount(),children,base:children.map(o=>o.position.y)});
    }
    let geometry,rest;
    k.group.userData.fitGround=ground=>{
      geometry??=k.group.children.find(o=>o.geometry?.hasAttribute('finishKind'))?.geometry;if(!geometry)return;
      const p=geometry.attributes.position;rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      for(let j=0;j<parts.length;j++){
        const part=parts[j],level=ground(part.x,part.z)+[.04,.10,.10,3.35,.10][j];
        for(let i=part.first;i<part.end;i++)p.setY(i,rest[i]+level);
        part.children.forEach((o,i)=>{o.position.y=part.base[i]+level;});
        views[j].height=(level+[.58,4.4,2.75,1.13,.30][j])/.46;
      }
      p.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();
    };
  }
  function reserve(x,z,pad=0){
    for(const [site,u,v,w,d] of [[portal,0,2,3.8,5.8],[reception,0,3.8,12.8,14],[exhibition,0,4,5.2,15.7],[shore,0,8,52,10.8]]){
      const dx=x-site[0],dz=z-site[1],a=site[2];
      if(Math.abs(dx*Math.cos(a)-dz*Math.sin(a)-u)<w+pad&&Math.abs(dx*Math.sin(a)+dz*Math.cos(a)-v)<d+pad)return true;
    }
    return false;
  }
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Địa đạo Vịnh Mốc',kind:'Di tích lịch sử',city:'Vĩnh Linh',province:'Quảng Trị',region:'Bắc Trung Bộ',
    lon,lat,yaw:0,width:9,depth:13,start:[107.1101055,17.0742080],mappedEntrance:true,visitOnArrival:true,solids:[],
    foundationAt:[0,0],reserve,gardenRadius:1,viewDistance:1200,modeledStairWays:[87628808],
    caveOpening:{sections:[[-3.2,0,.68,2.0,-.97],[0,0,.83,2.1,-.82],[3,.34,1.35,2.2,.26],[5.5,1.29,1.49,2.1,.95],[6.7,1.65,1.26,1.65,1.03]],approach:3.2},
    source,photo:doorPhoto,map:'https://www.openstreetmap.org/node/1016630618',
    arrivalNote:'Xe vào đến mép sân đón khách. Từ sân, khách đi bộ qua khu trưng bày và theo lối tham quan của di tích.',
    description:'Dưới những bụi tre ở Vịnh Mốc, bậc lát đá dẫn xuống cửa số 3. Có 17 em bé đã chào đời khi người dân sống trong lòng đất. Gian hộ sinh ngày nay trưng bày các hình nhân mô tả một người mẹ và người đỡ trẻ sơ sinh. Kích thước cửa, nhà và gian trưng bày được ước lượng từ ảnh toàn cảnh của tỉnh.',
    views,build});
})();
