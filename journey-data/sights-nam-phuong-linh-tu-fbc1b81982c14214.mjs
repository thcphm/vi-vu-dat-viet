const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const atlas=window.VietnamTourism,id='nam-phuong-linh-tu',catalogId='dong-thap-nam-phuong-linh-tu';
  const byId=key=>atlas.byId?.get(key)??atlas.entries.find(e=>e.id===key);
  const precinct=byId('osm-node-8437362637'),raw=byId(catalogId)??precinct;
  const source='https://dulichphuongnam.vn/den-tho-nam-phuong-linh-tu.html';
  const photo='https://dulichphuongnam.vn/img_data/images/1387275687582.jpg';
  // The operator's photograph looks OUT from the main hall: a stone marked
  // NAM PHUONG LINH TU faces the stairs across the short courtyard. Compare
  // the opposite hall in https://dulichphuongnam.vn/den-tho-dang-toc-nam-phuong-linh-tu.html
  // and its much longer courtyard. The adjacent roofs share a light well.
  // The SW roof is c.35 x 18 m including eaves. Both widths are very similar,
  // but the NE roof is 26–27% deeper, independently matching the operator's
  // documented floor areas (509 vs 644 m²) and frame counts (60 vs 80).
  // Orientation and roof envelopes estimated from orthophotos and the public
  // aerial views at https://vr3d.com.vn/public/phuongnam/ . N4723673992, named
  // 'Chùa Nam Phương' on OSM, lies outside the precinct; it is not the datum.
  const yaw=-.468,c=Math.cos(yaw),s=Math.sin(yaw),floor=2.48;
  const timber=0x683e30,deep=0x51352c,carved=0x76503a,tile=0xac6346,upperTile=0xb56b4b;
  const ash=0xaeafa6,highlight=0xc8c7ba,shade=0x898a82,stone=0xb1aca0,gray=0x8b8982;
  const seed=i=>{const n=Math.sin(63.226*i+45.11)*30345.6;return n-Math.floor(n);};
  function beam(T,k,colour,a,b,width,h=width){
    const dir=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),len=dir.length();
    const rot=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),dir.normalize()),r=new T.Euler().setFromQuaternion(rot,'YXZ');
    k.box(colour,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,width,h,len+.018,r.y,r.x,r.z);
  }
  function vine(T,k,colour,coordinates,radius,segments=10){
    const path=new T.CatmullRomCurve3(coordinates.map(p=>new T.Vector3(...p)),false,'centripetal');
    const g=new T.TubeGeometry(path,segments,radius,6,false);k.stamp(g,colour,0,0,0);g.dispose();
  }
  function jewel(T,k,x,y,z,r){
    const ring=new T.TorusGeometry(r,.095*r,7,24);k.stamp(ring,ash,x,y,z);ring.dispose();
    k.stamp(k.ball,shade,x,y,z,r*.82,r*.82,.082);
    for(let i=0;i<9;i++){
      const a=i*Math.PI/9;
      const pts=[[Math.cos(a)*r*.88,y+Math.sin(a)*r*.88],[Math.cos(a)*r*1.10,y+Math.sin(a)*r*1.16],
        [Math.cos(a+.14)*r*1.24,y+Math.sin(a+.14)*r*1.49]];
      vine(T,k,highlight,pts.map(([dx,yy])=>[x+dx,yy,z]),.037,5);
    }
  }
  function ridgeFigure(T,k,x,y,z,angle,scale){
    // Open clay/masonry scrolls photographed on the ridge: a rising neck,
    // projecting muzzle and flowing leaf-like mane above the lower curl.
    k.place(x,z,angle,()=>{
      const path=(points,r)=>vine(T,k,ash,points.map(([xv,yv])=>[xv*scale,y+yv*scale,0]),r*scale);
      path([[-1.65,.02],[-1.13,.18],[-.81,.40],[-.46,.29],[-.09,.19],[.25,.42],[.36,.77],[.25,.96],[.50,1.05]],.085);
      path([[-1.33,.05],[-1.29,.34],[-1.02,.43],[-.95,.34],[-1.01,.27]],.054);
      path([[-.87,.12],[-.57,.47],[-.16,.54],[.08,.76],[.02,.88],[-.07,.84]],.054);
      path([[.22,.79],[.04,.99],[-.24,1.10],[-.35,1.30]],.047);
      path([[.20,.87],[.02,1.11],[-.14,1.17],[-.21,1.38]],.036);
      path([[.32,.88],[.29,1.12],[.17,1.34],[.19,1.48]],.038);
      path([[.43,1.00],[.58,.97],[.70,1.04]],.061);
      path([[-1.32,.05],[-1.60,.35],[-1.78,.28],[-1.83,.12]],.06);
      path([[-.93,.06],[-.67,.25],[-.44,.22],[-.33,.09],[-.20,.17]],.05);
      path([[-.40,.30],[-.38,.60],[-.50,.69],[-.56,.62]],.049);
      path([[-.18,.28],[-.02,.43],[.12,.44],[.14,.32]],.051);
      k.stamp(k.ball,highlight,.36*scale,y+1.012*scale,0,.25*scale,.10*scale,.082*scale);
      k.stamp(k.ball,shade,.46*scale,y+1.064*scale,.071*scale,.037*scale,.042*scale,.018*scale);
      for(let i=0;i<5;i++)path([[-.90+i*.215,.27],[-.79+i*.215,.45+i*.015],[-.80+i*.215,.53+i*.017]],.031);
    });
  }
  function roofs(T,k){
    // Two hipped envelopes. The narrow band between the slopes belongs to the
    // timber frame. Each ring is evaluated on all four faces, including hips.
    function roof({w,d,innerW,innerD,y,rise,turn,top}){
      const sides=[[-1,-1,-1,1],[-1,1,1,1],[1,1,1,-1],[1,-1,-1,-1]];
      const ringPoint=(face,u,v)=>{
        const [ax,az,bx,bz]=sides[face],xx=ax+(bx-ax)*u,zz=az+(bz-az)*u;
        const corner=Math.min(Math.abs(xx),Math.abs(zz))**7;
        return [xx*(w+(innerW-w)*v)/2, y+rise*(.71*v+.29*v*v)+turn*corner*(1-v),zz*(d+(innerD-d)*v)/2];
      };
      const pos=[],underside=[],lip=[],quad=(arr,a,b,c,d)=>arr.push(...a,...d,...b,...b,...d,...c);
      for(let side=0;side<4;side++){
        for(let j=0;j<20;j++){
          const u=j/20,uu=(j+1)/20;
          for(let i=0;i<4;i++){
            const v=i/4,vv=(i+1)/4;
            quad(pos,ringPoint(side,u,v),ringPoint(side,u,vv),ringPoint(side,uu,vv),ringPoint(side,uu,v));
          }
          const a=ringPoint(side,u,0),b=ringPoint(side,uu,0),lower=p=>[p[0],p[1]-.105,p[2]],
            inner=p=>[p[0]*.77,y+.26,p[2]*.70];
          quad(lip,a,b,lower(b),lower(a));quad(underside,lower(a),lower(b),inner(b),inner(a));
        }
        const hip=[];
        for(let i=0;i<7;i++){const p=ringPoint(side,0,i/6);p[1]+=.095;hip.push(p);}
        vine(T,k,ash,hip,.105,8);
        const tip=hip[0],angle=Math.atan2(tip[2],-tip[0]);
        ridgeFigure(T,k,tip[0],tip[1]-.015,tip[2],Math.PI+angle,top?.74:.64);
      }
      function bake(a,col){
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a,3));g.computeVertexNormals();k.stamp(g,col,0,0,0);g.dispose();
      }
      bake(pos,top?upperTile:tile);bake(lip,0x985538);bake(underside,deep);
      if(top){
        k.box(ash,0,y+rise+.065,0,innerW+.15,.19,.255);
        for(const e of [-1,1])ridgeFigure(T,k,e*innerW*.49,y+rise+.11,0,e<0?Math.PI:0,1.02);
        jewel(T,k,0,y+rise+.51,0,.38);
        for(const e of [-1,1])k.place(0,0,e<0?Math.PI:0,()=>{
          vine(T,k,ash,[[.15,y+rise+.16,0],[.48,y+rise+.44,0],[.82,y+rise+.28,0],[1.10,y+rise+.17,0],[1.38,y+rise+.32,0]],.07);
        });
      }
    }
    roof({w:35.0,d:17.8,innerW:29.5,innerD:9.95,y:floor+3.72,rise:1.32,turn:.31,top:false});
    k.box(deep,0,floor+5.16,0,28.7,.61,9.40);
    roof({w:30.90,d:10.80,innerW:20.12,innerD:0,y:floor+5.39,rise:2.82,turn:.29,top:true});
  }
  function door(k,x,w,angle){
    k.place(x,4.53,angle,()=>{
      const col=0x573a2d;k.box(col,w*.5,floor+1.29,0,w,2.58,.067);
      for(const u of [.08,w-.08])k.box(carved,u,floor+1.28,.037,.072,2.51,.04);
      for(const h of [.17,.86,1.04,2.40])k.box(carved,w*.5,floor+h,.038,w-.10,.071,.05);
      for(let i=1;i<=4;i++)k.box(0x7d5540,w*i/5,floor+1.73,.038,.037,1.23,.036);
      for(let j=0;j<3;j++)k.box(carved,w*.5,floor+1.22+j*.34,.04,w-.12,.028,.031);
    });
  }
  function hall(T,k){
    const xcol=[-15.38,-12.67,-9.05,-5.43,-1.81,1.81,5.43,9.05,12.67,15.38];
    const zcol=[-7.36,-4.58,-1.62,1.62,4.58,7.36];
    const plinth=0x9a9488,slab=0x948f85;
    k.box(plinth,0,floor/2,0,32.25,floor,15.78);k.box(slab,0,floor-.075,0,32.90,.15,16.07);
    for(let i=0;i<31;i++)for(let j=0;j<3;j++){
      k.box([0x948f85,0x99958b,0x8f8c84][(i*7+j)%3],(i-15)*1.05,floor+.002,5.42+j*.91,1.032,.012,.889);
    }
    for(let i=0;i<xcol.length;i++)for(let j=0;j<zcol.length;j++){
      const x=xcol[i],z=zcol[j],outer=i===0||i===9||j===0||j===5;
      const h=outer?3.92:(j===2||j===3?6.91:5.21),r=outer?.235:.295;
      k.box(gray,x,floor+.043,z,r*3.26,.086,r*3.26);
      k.tapered(stone,x,floor+.148,z,r*1.52,r*1.23,.134,1,20);
      k.stamp(k.round,timber,x,floor+.218+(h-.218)/2,z,r,h-.218,r);
    }
    // The main 7 bays occupy the middle of this 7-gian + 2-chái frame.
    // With 6 rows front to back there are 60 timber posts, including the hiên.
    const dark=0x382b26;
    k.box(deep,0,floor+3.60,0,25.91,.19,9.72);
    k.box(dark,0,floor+1.80,-4.61,25.42,3.60,.14);
    for(const side of [-1,1]){
      k.box(timber,side*12.64,floor+1.74,0,.18,3.49,9.20);
      k.box(carved,0,floor+3.57,side*7.36,31.3,.32,.32);
      k.box(timber,side*15.37,floor+3.58,0,.32,.31,14.98);
      for(const z of zcol)beam(T,k,timber,[side*14.54,floor+3.23,z],[side*16.94,floor+3.78,z],.15,.24);
    }
    for(let i=0;i<xcol.length;i++){
      const x=xcol[i];k.box(timber,x,floor+3.66,0,.22,.23,16.27);
      beam(T,k,carved,[x,floor+3.21,7.07],[x,floor+3.68,8.52],.15,.23);
      if(i>0&&i<9){
        for(const sign of [-1,1]){
          const base=[x,floor+3.12,7.37],end=[x+sign*.69,floor+3.52,7.37];
          beam(T,k,timber,base,end,.15,.19);
          vine(T,k,carved,[base,[x+.19*sign,floor+3.18,7.40],[x+.48*sign,floor+3.43,7.40],end],.054,5);
        }
      }
    }
    for(let i=1;i<=7;i++){
      const left=xcol[i]+.18,right=xcol[i+1]-.18,w=right-left,mid=(left+right)/2;
      k.box(timber,mid,floor+3.03,4.57,w,.83,.17);k.box(carved,mid,floor+2.68,4.59,w+.05,.13,.26);
      // Fold the doors in the centre and the adjacent bays against their jambs.
      if(i>=3&&i<=5){door(k,left+.04,w*.48,1.36);door(k,right-.04,w*.48,Math.PI-1.36);}
      else{door(k,left,w*.48,0);door(k,right,w*.48,Math.PI);}
      for(let j=0;j<12;j++){
        const x=left+(j+.5)*w/12;k.box(0x875e47,x,floor+2.89+.05*Math.sin(j*1.09),4.674,.061,.19,.032,0,0,.49*Math.cos(j));
      }
    }
    k.box(timber,0,floor+1.02,-2.44,6.45,1.19,1.35);k.box(carved,0,floor+1.67,-2.44,6.64,.14,1.47);
    const bronze=0x514f43;k.tapered(bronze,0,floor+1.86,-2.16,.24,.42,.32,1,24);
    k.tapered(bronze,0,floor+2.05,-2.16,.42,.43,.065,1,24);
  }
  function stoneDragon(T,k,x,z0,z1,h0,h1,side){
    // The guide photograph shows pierced stone dragon rails descending either
    // side of the steps, in contrast to the solid cheek walls of many temples.
    const points=[];
    for(let i=0;i<=32;i++){const t=i/32;points.push([x,h0+(h1-h0)*t+.66+.11*Math.cos(t*8*Math.PI),z0+(z1-z0)*t]);}
    vine(T,k,ash,points,.134,48);
    beam(T,k,shade,[x,h0+.11,z0],[x,h1+.11,z1],.30,.21);
    for(let j=0;j<12;j++){
      const a=j/12,b=(j+1)/12,z=z0+(z1-z0)*a,y=h0+(h1-h0)*a;
      const d=(z1-z0)*(b-a),fall=(h1-h0)*(b-a);
      vine(T,k,ash,[[x,y+.23,z],[x+side*.051,y+.43+fall*.32,z+d*.32],[x,y+.58+fall*.68,z+d*.67],[x,y+.44+fall*.75,z+d*.84]],.072,7);
      vine(T,k,highlight,[[x,y+.70,z],[x,y+.85,z+d*.08],[x,y+.96,z+d*.05]],.040,4);
    }
    const h=h1+.47;vine(T,k,ash,[[x,h,z1-.43],[x,h+.42,z1-.20],[x,h+.56,z1+.12],[x,h+.39,z1+.56]],.145,9);
    k.stamp(k.ball,ash,x,h+.42,z1+.48,.225,.157,.40);
    for(const e of [-1,1]){
      vine(T,k,highlight,[[x+e*.08,h+.61,z1-.02],[x+e*.20,h+.85,z1-.15],[x+e*.27,h+1.01,z1-.07]],.047,6);
      k.stamp(k.ball,shade,x+e*.17,h+.52,z1+.30,.047,.064,.080);
    }
  }
  function grounds(T,k){
    k.box(0xb1a99b,0,-.98,32.50,18.15,2.13,24.0);
    k.box(gray,0,.0,32.1,5.30,.19,7.8);
    // Granite name stone in the short courtyard. Its inscribed face looks
    // towards the stairs, as in the photograph paired with the operator's entry.
    const z=30.4;k.box(0x77766e,0,.22,z,1.94,.26,.96);k.box(0x666862,0,.98,z,1.40,1.33,.53);
    k.box(0x474c49,0,1.26,z-.282,1.27,.63,.04);
    k.place(0,z-.312,Math.PI,()=>k.sign('NAM PHƯƠNG LINH TỪ',0,1.46,0,1.16,.110,true,'#dad7c4'));
    k.box(0xb7afa2,0,floor*.5,8.96,32.42,floor,2.40);
    const start=10.16,run=10.35,total=15;
    for(let i=0;i<total;i++){
      const h=floor*(1-i/total),d=run/total;
      k.box(0xa09c91,0,h/2,start+(i+.5)*d,6.93,h,d+.015);
      k.box(0xb5afa3,0,h-.03,start+(i+.94)*d,6.95,.057,.10);
    }
    for(const e of [-1,1]){
      stoneDragon(T,k,e*3.52,start,start+run,floor,.09,e);
      // The operator's view from these stairs shows flags and pots of yellow
      // flowers immediately outside the stone scrollwork.
      for(let j=0;j<4;j++){
        const zz=start+j*3.29+.17,ground=floor*(1-j/3.6),x=e*(3.95+.14*j);
        k.stamp(k.round,0x949589,x,ground+1.67,zz,.027,3.36,.027);
        const pp=[],col=(e<0?[0x368caa,0xc14b49,0xe0b84e,0xb95056]:[0xd7525e,0xe1be4e,0x4298a6,0xba4350])[j];
        for(let m=0;m<5;m++){
          function edge(t,y){return [x+e*t*.53+.04*Math.sin(y*2.0+t*3),ground+y,zz+.19*Math.sin(t*5.2+j*.7)+.27*t];}
          const a=m/5,b=(m+1)/5,tl=edge(a,3.28-.11*a),tr=edge(b,3.28-.11*b),bl=edge(a,1.69+.15*a),br=edge(b,1.69+.15*b);
          pp.push(...tl,...bl,...br,...tl,...br,...tr,...tl,...br,...bl,...tl,...tr,...br);
        }
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pp,3));g.computeVertexNormals();k.stamp(g,col,0,0,0);g.dispose();
      }
      for(let j=0;j<25;j++){
        const z=start+.22+j*.40,y=floor*(1-j*.40/run),x=e*(3.79+.08*seed(j+e));
        k.stamp(k.ball,0x5d7444,x,y+.14,z,.29,.21,.26);
        for(let m=0;m<4;m++)k.stamp(k.ball,m%2?0xe5bd47:0xd6a23c,x+.16*Math.cos(m*1.71+j),y+.245+seed(m+j)*.059,z+.16*Math.sin(m*1.71+j),.084,.074,.082);
      }
      for(let j=0;j<4;j++){
        const x=e*(4.06+j*3.16);
        k.box(shade,x+e*1.43,floor+.13,9.84,2.98,.25,.30);
        k.box(ash,x+e*1.43,floor+.90,9.84,2.98,.16,.29);
        k.box(ash,x,floor+.52,9.84,.27,1.03,.30);
        for(let b=0;b<5;b++)k.box(ash,x+e*(.39+b*.51),floor+.49,9.84,.12,.59,.12);
      }
    }
    // Planted beds frame the short approach, with low trained shrubs beside
    // the halls. Keep the opposite family temple and the bell/drum pavilions
    // outside this model's footprint.
    const stems=[],gTurf=new T.PlaneGeometry(62,71,28,36);
    gTurf.rotateX(-Math.PI/2);gTurf.translate(0,0,15.5);
    const turf=new T.Mesh(gTurf,new T.MeshLambertMaterial({color:0x687947}));
    turf.receiveShadow=true;k.group.add(turf);
    for(const e of [-1,1]){
      for(let i=0;i<22;i++){
        const x=e*(5.0+seed(i*3+e)*10.05),z=11.35+seed(i*7+e)*9.50;
        const w=.38+.45*seed(i+e),h=.44+.77*seed(i+4);
        for(let j=0;j<5;j++){
          const a=j*1.256+.32*i; k.stamp(k.ball,j%3?0x506744:0x60774a,x+w*.46*Math.cos(a),.10+h*.48+.11*Math.cos(i+j),z+w*.46*Math.sin(a),w*.74,h*.45,w*.72);
        }
      }
      for(let i=0;i<3;i++)stems.push([e*(11.2+i*2.64),.02,13.6+i*2.83,2.9+i*.51,2.74+i*.72,i+e]);
      for(let i=0;i<4;i++)stems.push([e*(22.6+i*.74),.02,-16.5+i*8.2,6.95+seed(i)*2.1,6.95+seed(i+9)*3.11,i+e]);
      for(let i=0;i<5;i++){
        const xx=e*(19.1+seed(i+e)*1.8),zz=-8.5+i*5.35;
        stems.push([xx,.03,zz,3.6+seed(i+e)*2.0,3.2+seed(i+2)*2.9,seed(i*3+e)*6.28]);
      }
    }
    window.createTreeModels(T).grove(k.group,stems);
    return turf;
  }
  function build(T,kit){
    const ball=new T.SphereGeometry(1,12,7),k={...kit,ball};
    k.palette({tile:[tile,upperTile],timber:[timber,deep,carved],stone:[stone,gray,ash,shade,0x9a9488,0x948f85,0x99958b,0x8f8c84,0xa09c91],plaster:highlight});
    hall(T,k);roofs(T,k);const turf=grounds(T,k);ball.dispose();
    const ys=new WeakMap();
    k.group.userData.fitGround=ground=>{
      let lift=0;for(const x of [-16,-7,0,7,16])for(const z of [-8,0,8,17,23,34])lift=Math.max(lift,ground(x,z));
      function grassHeight(x,z){
        const lateral=(Math.abs(x)-18)/11,back=(-10-z)/9,front=(z-42)/8;
        const f=Math.max(0,Math.min(1,Math.max(lateral,back,front))),t=f*f*(3-2*f);
        return lift+.017+(ground(x,z)-lift)*t;
      }
      for(const m of k.group.children){
        if(m===turf){
          const p=m.geometry.attributes.position;
          for(let i=0;i<p.count;i++)p.setY(i,grassHeight(p.getX(i),p.getZ(i)));
          p.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();
        }else if(m.isInstancedMesh){
          if(!ys.has(m))ys.set(m,m.instanceMatrix.array.slice());
          const orig=ys.get(m),a=m.instanceMatrix.array;
          for(let i=12;i<a.length;i+=16)a[i+1]=orig[i+1]+grassHeight(orig[i],orig[i+2]);
          m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
        }else{
          if(!ys.has(m))ys.set(m,m.position.y);m.position.y=ys.get(m)+lift;
        }
      }
    };
  }
  const view=(name,x,z,height,viewRadius,a,viewElevation,viewFov=48)=>({name,offset:[c*x+s*z,-s*x+c*z],height,viewRadius,
    viewAngle:yaw+a,viewElevation,viewFov,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,lon:105.672435,lat:10.352504,name:'Nam Phương Linh Từ',kind:'Công trình tín ngưỡng',
    source,photo,map:'https://www.openstreetmap.org/?mlat=10.352504&mlon=105.672435#map=20/10.352504/105.672435',
    yaw,start:raw.start??[105.6705179,10.3514116],visitOnArrival:true,mappedEntrance:true,approachMeters:undefined,
    width:36,depth:18,foundationAt:[0,0],gardenRadius:18,solids:[[0,0,16.0,7.85]],
    reserve:(x,z,p)=>Math.abs(x)<17+p&&z>=-9-p&&z<35+p,
    arrivalNote:'Xe dừng trên Đường huyện 69, tại lối vào phía tây nam khu du lịch văn hóa Phương Nam. Từ đó đi bộ theo đường nội khu đến sân có bia Nam Phương Linh Từ.',
    description:'Nam Phương Linh Từ thờ các bậc tiền nhân có công với vùng đất phương Nam. Chính điện 509 m² gồm bảy gian, hai chái và ba lòng, với 60 cột gỗ. Mái hạ phủ hàng hiên bao quanh. Dáng mái, bậc đá và các nét trang trí được ước dựng theo ảnh.',
    views:[view('Từ sân bia lên chính điện',0,1.0,12.6,42,.20,.065,45),
      view('Cột gỗ và mái hạ dọc hàng hiên',4.3,6.14,10.0,12.4,1.31,.035,52),
      view('Bờ nóc và đầu đao của hai tầng mái',-7.0,.60,20.7,19,-.72,-.16,43)],build});
})();

export default window.VietnamSights;
