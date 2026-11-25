const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='thanh-dia-la-vang',lon=107.19547570,lat=16.70697798,yaw=.236;
  const directory='https://maps.giolelavang.com/';
  const source='https://tonggiaophanhue.org/la-vang/luoc-su/tap-sach-trung-tam-thanh-mau-toan-quoc-la-vang-chuong-4-phan-2/';
  const present='https://www.tonggiaophanhue.org/tin-tuc/tin-giao-phan/uoc-mo-ve-ben-duc-me-la-vang-sau-bao-ngay-cho-mong-nay-da-thanh-toan/';
  // Align the old tower, concrete banyans and basilica separately. The
  // pedestrian diagram's POIs label the precincts rather than their roofs.
  // https://www.google.com/maps/@16.70685,107.19555,509m/data=!3m1!1e3
  // https://www.openstreetmap.org/way/305408028
  // https://www.openstreetmap.org/node/3100293997
  // https://www.openstreetmap.org/way/690204938
  // https://hdgmvietnam.com/chi-tiet/la-vang-cong-trinh-den-tho-cua-toan-giao-hoi-viet-nam-46379
  // https://thanhnien.vn/vuong-cung-thanh-duong-duc-me-la-vang-voi-mai-ngoi-mai-dao-dam-net-viet-185260814102241067.htm
  // The chapel, the outdoor altar and the VCTĐ are separate places. The
  // October 2026 report still describes the new church as under construction.
  const towerId='osm-way-305408028',shrineId='osm-node-3100293997',basilicaId='osm-way-690204938';
  const white=0xe9e8df,shade=0xc8c9bd,stone=0xa6a39a,old=0x936750,plaster=0xa59d87,brick=0x966950,
    blue=0x3c7796,eaves=0xe2e0cf,walk=0xc1baab,green=0x80935d,bark=0x777965,leaf=0x56634a;
  function build(T,k){
    const ball=new T.SphereGeometry(1,14,10),sections=[],children=[],trees=createTreeModels(T);
    k.palette({brick:[old,brick],stone:[stone,plaster],plaster:[white,shade,eaves],glazedTile:blue,tile:0x945548});
    function zone(name,fn){
      const first=k.vertexCount(),j=k.group.children.length;fn();sections.push({name,first,last:k.vertexCount()});
      for(const mesh of k.group.children.slice(j))children.push({mesh,name,y:mesh.position.y});
    }
    function oval(color,x,y,z,w,h,d,rz=0){k.stamp(ball,color,x,y,z,w,h,d,0,0,rz);}
    function clippedPlant(x,z,r,height){
      k.tapered(0x806c56,x,.31,z,r*.61,r*.86,.55,1,12);
      k.tapered(0x786a50,x,height*.48,z,.075,.061,height*.8,1,7);
      oval(0x68793f,x,height*.76,z,r,.34,r*.85);
      oval(0x5d7043,x+.08,height,z,r*.78,.28,r*.67);
    }
    function rod(color,a,b,r0,r1=r0,n=9){
      const dv=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),length=dv.length();
      const shape=new T.CylinderGeometry(r1,r0,length,n);
      shape.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),dv.normalize()));
      k.stamp(shape,color,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);shape.dispose();
    }
    function archPath(path,x,y,w,h){
      const r=w/2,spring=y+h-r;
      path.moveTo(x-r,y);path.lineTo(x+r,y);path.lineTo(x+r,spring);
      path.absarc(x,spring,r,0,Math.PI,false);path.lineTo(x-r,y);path.closePath();
    }
    function wall(tint,w,h,z,openings,depth){
      const shape=new T.Shape();shape.moveTo(-w/2,0);shape.lineTo(w/2,0);shape.lineTo(w/2,h);shape.lineTo(-w/2,h);shape.closePath();
      for(const [x,y,wide,tall] of openings){const hole=new T.Path();archPath(hole,x,y,wide,tall);shape.holes.push(hole);}
      k.profile(shape,tint,0,0,z,depth);
    }
    function archTrim(x,y,z,w,h,b,color){
      const p=new T.Shape(),r=w/2,spring=y+h-r;
      p.moveTo(x-r-b,y);p.lineTo(x-r,y);p.lineTo(x-r,spring);
      p.absarc(x,spring,r,Math.PI,0,true);p.lineTo(x+r,y);p.lineTo(x+r+b,y);p.lineTo(x+r+b,spring);
      p.absarc(x,spring,r+b,0,Math.PI,false);p.closePath();k.profile(p,color,0,0,z,.14);
    }
    function cross(x,y,z,h,material=0x80796d){
      k.box(material,x,y+h*.48,z,h*.067,h,.12);
      k.box(material,x,y+h*.63,z,h*.51,h*.063,.13);
    }
    // The surviving square belfry projects in front of a wider fragment
    // of the former church wall. Openings pass through the masonry.
    zone('tower',()=>{
      k.box(walk,.1,-.14,2.3,16,.34,15.5);
      for(const [ax,az,rot] of [[0,-2.10,Math.PI],[0,3.62,0],[-2.90,.76,-Math.PI/2],[2.90,.76,Math.PI/2]]){
        k.place(ax,az,rot,()=>{
          const opt=[[0,.13,2.98,5.95],[0,9.25,1.34,6.45],
            [-1.60,19.30,.98,2.66],[0,19.30,.98,2.66],[1.60,19.30,.98,2.66]];
          wall(old,5.90,22.82,-.42,opt,.43);
          for(const [x,y,w,h] of opt)archTrim(x,y,-.016,w,h,h>3?.21:.138,plaster);
          k.box(0x796854,0,3.00,.08,3.0,.30,.22);
          for(const side of [-1,1])k.box(plaster,side*2.66,10.14,.085,.39,19.7,.31);
          for(const y of [7.86,18.97,22.48,22.81])k.box(plaster,0,y,.084,6.14,.20,.35);
          for(let i=-3;i<=3;i++){
            k.box(0x68564c,i*.64,7.58,.062,.23,.34,.19);
            k.box(0x695b4e,i*.63,17.42,.068,.23,.39,.17);
          }
        });
      }
      k.box(0x3b3731,0,12.52,1.24,2.01,6.53,.19);
      k.box(0x5a7262,0,22.93,.76,5.62,.15,5.56);cross(0,23.11,-1.66,2.34,0x87795a);
      // Exposed rear gable with three bays; the former nave remains open.
      k.place(0,4.34,0,()=>{
        wall(brick,12.7,11.74,-.58,[[-3.87,.16,2.65,4.08],[0,.16,2.78,4.22],[3.87,.16,2.65,4.08],
          [0,6.03,2.51,4.83],[-3.86,5.99,.86,2.22],[3.86,5.99,.86,2.22]],.73);
        k.outline([[-6.35,11.74],[0,15.25],[6.35,11.74]],brick,0,0,-.58,.73);
        for(const side of [-1,1]){
          k.box(plaster,side*6.05,5.91,-.07,.63,11.82,1.02);
          rod(0x646d5c,[0,15.27,-.28],[side*6.39,11.78,-.28],.12,.12,6);
        }
      });
      for(const [x,z,r,h] of [[-5.3,-4.5,.81,1.8],[4.9,-4.6,.72,1.94],[7.9,-1.1,1.1,2.4],[-6.3,4.9,1.0,2.1]])
        clippedPlant(x,z,r,h);
      trees.grove(k.group,[[-13.7,0,1.9,7.3,9.3,.91],[13.4,0,4.5,6.2,8.6,2.01]]);
    });
    function risers(x,z,width,depth,count,rise,tint){
      for(let i=0;i<count;i++)k.box(tint,x,(i+1)*rise/2,z-i*depth,width,(i+1)*rise,Math.abs(depth)+.02);
    }
    zone('shrine',()=>k.place(76.1,-16.25,-Math.PI/2,()=>{
      // The worshippers' aisle is west of the sanctuary. The two forward
      // trunks frame the Marian figure, with the tallest trunk behind her.
      k.box(walk,0,-.05,17.0,22,.18,26);
      k.box(0xb38e80,0,.055,18.0,3.16,.05,27);
      k.box(stone,0,1.49,-.68,17.4,3.06,10.8);
      risers(0,11.0,15.9,.40,17,.178,0xb7b1a3);
      risers(0,11.0,3.4,.40,17,.179,0xb68a78);
      for(const [tx,tz,h,side] of [[-4.92,.9,18.12,-1],[4.51,1.5,16.5,1],[.26,-3.0,21,1]]){
        const foot=3.03;
        rod(bark,[tx,foot,tz],[tx+.12,foot+h*.47,tz-.16],1.12,.88,13);
        rod(bark,[tx+.12,foot+h*.47,tz-.16],[tx+side*.16,foot+h*.81,tz-.05],.88,.53,12);
        rod(bark,[tx+side*.16,foot+h*.81,tz-.05],[tx+side*.31,foot+h,tz+.12],.53,.16,9);
        for(let i=0;i<7;i++){
          const a=i*2.41+side*.5+(tz<0?.48:0),level=.21+i*.070,offset=i>4?1.6:2.9;
          const dx=Math.cos(a)*offset,dz=Math.sin(a)*offset;
          const mid=[tx+dx*.67,foot+h*level+.52,tz+dz*.67],tip=[tx+dx,foot+h*level+2.20,tz+dz];
          rod(bark,[tx,foot+h*level,tz],mid,.50,.36);rod(bark,mid,tip,.36,.29);
          const rad=(2.7-i*.21)*(tz<0?.94:1);
          const crown=new T.CylinderGeometry(rad*.42,rad,.62,11,1);
          k.stamp(crown,leaf,tip[0],tip[1]+.17,tip[2],1,.91,.78,a);
          crown.dispose();oval(0x5d6950,tip[0],tip[1]+.40,tip[2],rad*.70,.33,rad*.58);
        }
      }
      const ivory=0xf3edda,gold=0xd1ad55,skin=0xd2b193,hair=0x665444;
      for(let i=0;i<14;i++){
        const a=i*2.40,r=i<8?1.25:.49;
        oval(i%3?ivory:0xc6c4b5,Math.sin(a)*r,3.24+.12*(i%4),Math.cos(a)*r+.44,.81,.53,.68);
      }
      const y=3.58,z=.56;
      const robe=new T.LatheGeometry([[.48,0],[.52,.07],[.44,.43],[.30,1.62],[.29,2.06],[.37,2.44],[.14,2.60]]
        .map(([r,h])=>new T.Vector2(r,h)),18);
      k.stamp(robe,ivory,0,y,z,1,1,.80);robe.dispose();
      for(const side of [-1,1])rod(gold,[side*.40,y+.10,z+.18],[side*.17,y+2.36,z+.23],.025,.025,5);
      oval(hair,0,y+2.83,z,.235,.30,.17);oval(skin,0,y+2.83,z+.085,.17,.245,.14);
      const crown=new T.CylinderGeometry(.335,.333,.099,28);crown.rotateX(Math.PI/2);
      k.stamp(crown,gold,0,y+2.96,z-.084);crown.dispose();
      for(const side of [-1,1]){
        rod(ivory,[side*.30,y+2.38,z],[side*.30,y+1.90,z+.24],.108,.107);
        rod(ivory,[side*.30,y+1.90,z+.24],[side*.045,y+2.04,z+.37],.10,.072);
      }
      oval(gold,-.11,y+2.01,z+.39,.186,.345,.17);oval(skin,-.13,y+2.37,z+.40,.137,.169,.121);
      k.box(0xb8a182,0,3.99,3.27,2.58,.14,.96);
      for(const x of [-.87,.87])k.box(0xb2a38c,x,3.51,3.27,.24,.89,.63);
      for(const x of [-4.93,4.51]){
        const words=x<0?['LẠY','MẸ','LA','VANG']:['CON','YÊU','MẾN','MẸ'];
          for(let i=0;i<4;i++)k.sign(words[i],x,6.64-i*.45,x<0?2.10:2.71,.75,.40,true,'#f3eedb');
      }
      for(const side of [-1,1])for(let j=0;j<6;j++){
        const x=side*(5.8+(j%2)*1.50),p=13+j*2.16;
        k.box(0xd4d5cd,x,.62,p,2.24,.15,.49);k.box(0xc8ccc4,x,.98,p-.24,2.24,.58,.10);
        for(const dx of [-.74,.74])k.box(stone,x+dx,.28,p,.14,.55,.38);
      }
      const grove=[];
      for(const side of [-1,1]){
        for(let j=0;j<5;j++){
          const z=-1.1+j*2.49;clippedPlant(side*(8.9+j*.2),z,1.04+(j%2)*.13,1.3+.25*(j%3));
        }
        for(const [x,z,w,h] of [[11.2,-7.8,8.0,13.5],[12.7,-1.5,7.0,9.35],[15.2,7.7,8.0,11.3],
          [13.6,15.8,9.3,12.45],[16.5,25.4,10.7,15.5],[6.2,-12.1,8.45,10.6]]){
          grove.push([side*x,0,z,w,h+(side<0?.6:0),z*.64]);
        }
      }
      trees.grove(k.group,grove);
    }));
    function tiledRoof(x,z,w,d,y,h,sw=1,tint=blue,edge=eaves){
      // Hipped Vietnamese roofs use a ridge parallel to the front and an
      // upturned corner. The exposed pale fascia follows the same curve.
      const g=[],ind=[],ridge=Math.max(.56,w/2-Math.min(w*.34,d*.48)),corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
      function edging(points,r){
        const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
        const tube=new T.TubeGeometry(path,points.length-1,r,6,false);
        k.stamp(tube,edge,0,0,0);tube.dispose();
      }
      for(let face=0;face<4;face++){
        const a=corners[face],b=corners[(face+1)%4],rows=5,cols=14,base=g.length/3;
        function sample(t,s){
          const u=a[0]+t*(b[0]-a[0]),v=a[1]+t*(b[1]-a[1]),corner=Math.abs(u*v)**5;
          const px=(u*w/2)*(1-s)+u*ridge*s,pz=v*d/2*(1-s);
          return [x+px,y+h*(.76*s+.24*s*s)+sw*corner*(1-s)**2,z+pz];
        }
        for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
          g.push(...sample(i/cols,j/rows));if(i&&j){const n=base+j*(cols+1)+i;ind.push(n-cols-2,n-1,n-cols-1,n-cols-1,n-1,n);}
        }
        edging(Array.from({length:cols+1},(_,i)=>sample(i/cols,0)),.16);
        edging(Array.from({length:rows+1},(_,j)=>sample(0,j/rows)),.15);
        const corner=sample(0,0);
        rod(edge,corner,[corner[0]+a[0]*.36,corner[1]+sw*.46,corner[2]+a[1]*.27],.14,.065,6);
      }
      const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(g,3));geom.setIndex(ind);
      geom.computeVertexNormals();
      k.stamp(geom,tint,0,0,0);
      // The exposed underside under the cantilevered eave is pale.
      for(let i=0;i<ind.length;i+=3)[ind[i],ind[i+2]]=[ind[i+2],ind[i]];
      geom.setIndex(ind);geom.computeVertexNormals();k.stamp(geom,edge,0,-.14,0);geom.dispose();
      rod(edge,[x-ridge,y+h,z],[x+ridge,y+h,z],.21,.21,8);
    }
    function frame(x,y,z,w,h,depth=.18){
      for(const s of [-1,1]){
        k.box(shade,x+s*w/2,y,z,.22,h+.22,depth);k.box(shade,x,y+s*h/2,z,w+.22,.22,depth);
      }
    }
    function rose(x,y,z,r){
      const ring=new T.TorusGeometry(r,r*.071,6,36);k.stamp(ring,white,x,y,z);ring.dispose();
      const petal=new T.TorusGeometry(r*.285,r*.041,5,16);
      for(let j=0;j<8;j++){
        const a=j*Math.PI/4;k.stamp(petal,white,x+r*.42*Math.sin(a),y+r*.42*Math.cos(a),z,1,.82,1,0,0,-a);
      }
      petal.dispose();
    }
    zone('basilica',()=>{
      const base=3.45;
      k.box(0xb6b2a6,-1,1.62,168.5,103.3,3.4,141.5);
      k.box(walk,-1,3.39,168.4,103.5,.18,141.7);
      for(const x of [-34.8,-11.7,11.5,34.2])risers(x,91.5,11.8,-.38,18,.191,0xb7b3a7);
      for(const x of [-46.5,-23.2,0,22.9,45.7])for(let j=0;j<5;j++)
        k.box(0x698345,x,.29+j*.32,91.8+j*1.34,10,.58+j*.64,1.37);
      // Main nave to the south: three stacked blue roofs beneath a cross.
      // The newly built north/front portico is separate and has two wings.
      k.box(white,-4,base+6.0,183.7,69.5,12.0,55.0);
      for(const [x,z,w,d,h] of [[-4,184,74,60,5.0],[-4,184.4,61.6,47,6.3],[-4,189.5,42,27.3,8.7]]){
        const y=w>70?14.9:w>50?20.85:28.3;
        if(w<70)k.box(shade,x,y-.86,z,w-4.3,2.0,d-4.0);
        tiledRoof(x,z,w,d,y,h,1.85);
      }
      for(const side of [-1,1])k.place(-4+side*33.8,188.8,side*Math.PI/2,()=>{
        k.box(white,0,8.88,0,18.6,10.84,13);tiledRoof(0,0,21.8,15.3,14.36,5.1,1.21);
      });
      k.box(white,-4,7.8,225.4,19.4,8.8,19.7);tiledRoof(-4,225.4,24,22,12.5,4.3,1.38);
      k.box(shade,-4,17.5,225.4,13.2,3.3,13.6);tiledRoof(-4,225.4,17.0,16.8,19.1,4.6,1.04);
      cross(-4,37.15,189.5,3.75,0x918b78);
      const cz=143.5;
      k.box(white,-4,9.40,153.1,72.0,12.0,6.1);
      for(const [x,w] of [[-30.4,8.1],[-19.2,6.2],[-4,17.7],[11.2,6.2],[23.5,8.8]])
        k.box(0x3a403b,x,6.34,149.96,w,5.8,.19);
      for(const [x,w,y,h] of [[-29.5,19.5,11.9,4.4],[23.0,21.0,11.9,4.4],[-4,36.3,21.0,5.9]]){
        const front=132.2;
        for(const side of [-1,1]){
          const dx=x+side*(w/2-1.7);
          k.box(white,dx,(y+base)/2,cz,2.54,y-base,18.7);
          k.box(shade,dx,y-.36,front,2.84,.86,1.79);
        }
        k.box(white,x,y-1.00,cz+4,w-1,2.0,13.1);
        // Deep open bays retain the shaded recesses below the balcony.
        for(const side of [-1,1])k.box(white,x+side*w*.27,(base+8.82)/2,front,1.07,8.82-base,1.65);
        k.box(white,x,9.30,front,w-1.9,1.68,1.72);
        for(const side of [-1,1]){
          k.box(shade,x+side*(w/2-2.26),7.30,front-.87,.32,7.65,.28);
          k.box(shade,x+side*(w/2-2.26),10.64,front-.89,1.81,.36,.34);
        }
        if(w>30){
          k.box(white,x,15.39,front,w-2.1,10.49,1.45);
          for(const side of [-1,1])for(const d of [0,1]){
            const wx=x+side*(6.7+d*5.93);
            k.box(0x798079,wx,16.23,front-.745,d?4.24:2.4,3.65,.12);
            frame(wx,16.23,front-.84,d?4.33:2.45,3.72);
            rose(wx,16.23,front-.86,d?1.31:.92);
          }
          k.box(0x798079,x,16.24,front-.745,4.12,4.29,.12);rose(x,16.24,front-.89,1.98);
          for(const y of [11.82,12.30,19.05,20.16])k.box(eaves,x,y,front-.77,w-1.32,.23,.35);
          for(const a of [-15.6,-14.7,-5.16,5.16,14.7,15.6])k.box(eaves,x+a,15.55,front-.82,.31,8.93,.33);
        }else{
          const wx=x+(x<0?-2.1:2.1);k.box(white,wx,7.65,front,5.65,7.51,1.66);
          k.box(0x778078,wx,7.99,front-.87,3.2,3.37,.12);rose(wx,7.99,front-.98,1.19);
        }
        tiledRoof(x,cz,w+3.3,w>30?25.7:21.0,y,h,w>30?1.83:1.28);
      }
      k.box(white,-4,28.46,cz,12.2,6.11,10.64);
      k.box(0x6e7772,-4,28.50,cz-5.38,3.75,3.25,.11);rose(-4,28.50,cz-5.49,1.43);
      tiledRoof(-4,cz,16.5,14.7,31.51,4.59,1.37);cross(-4,36.24,cz,2.92);
    });
    zone('axis',()=>{
      // Two parallel paved promenades frame the Rosary lawn. The OSM raw
      // polygon is a park; the centre of the grass is not a car approach.
      for(const x of [-18.4,21.25])k.box(walk,x,.075,-186.7,2.4,.15,320.2);
      for(let j=0;j<16;j++){
        const z=-36.5-j*19.72;k.box(green,1.4,.053,z,37.05,.10,19.77);
      }
      for(const z of [-281,-206,-78])k.box(walk,1.4,.126,z,39.5,.15,3.24);
      for(const z of [21.3,49.4,75.4])k.box(walk,-.5,.077,z,97.8,.15,3.2);
      for(const x of [-41,-17,0,21.5,43.8])for(let j=0;j<4;j++)k.box(walk,x,.064,15+j*21,3.03,.14,21.06);
    });
    zone('gate',()=>k.place(3.56,-346.1,0,()=>{
      for(const x of [-8.0,-4.0,4.0,8.0]){
        k.box(0xb9af9c,x,2.26,0,.64,4.52,.73);
        k.box(0xb8ae92,x,.38,0,.94,.76,1.05);
        for(const y of [3.66,4.03])k.box(0xe5d8b5,x,y,0,.88,.22,.96);
      }
      const rim=0xe5d8b5;
      k.box(rim,0,4.47,0,16.75,.36,2.23);
      tiledRoof(0,0,17.25,3.85,4.60,1.0,.59,0x945548,rim);
      k.box(0xd8c7a0,0,5.83,0,9.72,1.19,1.76);
      tiledRoof(0,0,11.1,3.2,6.24,1.03,.46,0x945548,rim);
      cross(0,7.23,0,1.34,0x978567);
      k.box(0x3c5b69,0,5.76,-.925,8.66,1.05,.12);
      k.place(0,-1.0,Math.PI,()=>{
        k.sign('HỘI THÁNH CÔNG GIÁO VIỆT NAM',0,6.04,0,4.36,.24,true,'#f0c869');
        k.sign('TRUNG TÂM HÀNH HƯƠNG ĐỨC MẸ LA VANG',0,5.65,0,7.95,.44,true,'#f0c869');
      });
      for(const side of [-1,1]){
        k.box(rim,side*12.9,.65,0,9.02,1.3,.38);
        k.box(0x945548,side*12.9,1.36,0,9.02,.14,.51);
        for(let i=0;i<8;i++)k.box(0xaa9e7a,side*(4.26+i*.48),1.44,.12,.035,2.78,.06);
        for(let i=0;i<7;i++)k.box(0xaa9e7a,side*(.46+i*.50),1.60,.12,.035,3.1,.06);
        for(const y of [.38,.68,2.52])k.box(0xaa9e7a,side*3.92,y,.12,7.61,.052,.07);
      }
      trees.grove(k.group,[[-11.6,0,10.1,8.4,10.1,1.3],[12.4,0,11.4,8.9,9.1,2.7],[-12.2,0,26,9.1,10.4,1.6],[12.9,0,24.7,8.6,11.4,3]]);
      const palms=new T.InstancedMesh(trees.geometry('palm',true,1),trees.palmMaterial,6),pose=new T.Object3D();
      [[-10.7,4.4,10.0],[-12.7,11.8,12.1],[-10.6,21.7,10.9],[10.2,6.8,9.1],[10.6,16.3,10.8],[13.3,4.7,11.6]].forEach(([x,z,h],i)=>{
        pose.position.set(x,0,z);pose.rotation.y=i*2.40;pose.scale.setScalar(h);pose.updateMatrix();palms.setMatrixAt(i,pose.matrix);
      });
      palms.castShadow=palms.receiveShadow=true;k.group.add(palms);
    }));
    ball.dispose();
    let geometry,rest,oldHeights;
    k.group.userData.fitGround=ground=>{
      if(!geometry){
        const baked=k.group.children.at(-1);geometry=baked.geometry;
        // Apply the worn lime render and exposed brick only to the ruin.
        // Reuse the baked buffer and existing surface scan in one draw call.
        const worn=new Uint8Array(geometry.attributes.position.count),kind=geometry.attributes.finishKind;
        const tower=sections.find(s=>s.name==='tower');
        for(let i=tower.first;i<tower.last;i++){
          const type=kind.getX(i);if(type===7||type===2)worn[i]=1;
        }
        geometry.setAttribute('oldRender',new T.BufferAttribute(worn,1));
        const mat=baked.material,scan=mat.onBeforeCompile;
        mat.customProgramCacheKey=()=>'la-vang-old-render-v1';
        mat.onBeforeCompile=(shader,renderer)=>{
          scan.call(mat,shader,renderer);
          shader.vertexShader='attribute float oldRender;varying float ruin;\n'+shader.vertexShader
            .replace('#include <begin_vertex>','#include <begin_vertex>\n ruin=oldRender;');
          shader.fragmentShader=`varying float ruin;
            float brickHash(vec2 p){vec3 n=fract(vec3(p.xyx)*.1231);n+=dot(n,n.yzx+33.33);return fract((n.x+n.y)*n.z);}
            float renderNoise(vec2 p){vec2 i=floor(p),t=fract(p);t=t*t*(3.-2.*t);
              return mix(mix(brickHash(i),brickHash(i+vec2(1,0)),t.x),mix(brickHash(i+vec2(0,1)),brickHash(i+vec2(1,1)),t.x),t.y);}
          `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
            if(ruin>.5){
              vec2 p=vMapUv;
              float footprint=length(fwidth(p));
              float detail=mix(renderNoise(p*7.5),.5,smoothstep(.042,.14,footprint));
              float body=.58*renderNoise(p*vec2(1.14,.63))+.30*renderNoise(p*2.85)+.12*detail;
              float lime=smoothstep(.37,.55,body);
              float spotting=.68*renderNoise(p*vec2(2.9,1.8))+.32*detail;
              vec3 aged=mix(vec3(.10,.089,.066),vec3(.35,.32,.253),smoothstep(.18,.84,spotting));
              diffuseColor.rgb=mix(diffuseColor.rgb*.98,aged,kind==7.?lime*.92:lime*.45);
            }`);
        };
        mat.needsUpdate=true;
      }
      const p=geometry.attributes.position;
      rest??=Float32Array.from({length:p.count},(_,i)=>p.getY(i));
      const highs={tower:ground(0,1),shrine:ground(76.1,-16.25),basilica:ground(-4,146),gate:ground(3.56,-346.1)};
      const vals=Object.values(highs);if(oldHeights&&vals.every((h,i)=>Math.abs(h-oldHeights[i])<.009))return;
      const cache=new Map();
      function sample(i,j){
        const key=i+','+j;if(!cache.has(key))cache.set(key,ground(i*6,j*6));return cache.get(key);
      }
      function terrain(x,z){
        const a=x/6,b=z/6,i=Math.floor(a),j=Math.floor(b),u=a-i,v=b-j;
        return (sample(i,j)*(1-u)+sample(i+1,j)*u)*(1-v)+(sample(i,j+1)*(1-u)+sample(i+1,j+1)*u)*v;
      }
      for(const {name,first,last} of sections)for(let i=first;i<last;i++){
        const h=name==='axis'?terrain(p.getX(i),p.getZ(i))+.06:highs[name];p.setY(i,rest[i]+h);
      }
      for(const child of children)child.mesh.position.y=child.y+highs[child.name];
      p.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();oldHeights=vals;
    };
  }
  function camera(name,u,v,eu,ev,focus,eye,fov,description,photoCatalogId,photo){
    const c=Math.cos(yaw),s=Math.sin(yaw),dist=Math.hypot(eu-u,ev-v),rise=eye-focus;
    return {name,offset:[u*c+v*s,-u*s+v*c],height:focus/.46,viewRadius:Math.hypot(dist,rise),viewAngle:yaw+Math.atan2(eu-u,ev-v),
      viewElevation:Math.atan2(rise,dist),viewFov:fov,description,photoCatalogId,...(photo?{photo}:{})};
  }
  (window.VietnamSights??=[]).push({id,name:'Thánh địa La Vang',city:'Hải Lăng',province:'Quảng Trị',kind:'Trung tâm hành hương',
    region:'Trung Bộ',lon,lat,yaw,source,photo:present,map:'https://www.openstreetmap.org/way/305408028',width:20,depth:28,solids:[],
    gardenRadius:19,viewDistance:1350,start:[107.1947094,16.7101806],mappedEntrance:true,visitOnArrival:true,
    modeledBuildings:['w305408028','w305408023','w690204938','w305408025'],boundary:[[-53,94],[50,94],[50,242],[-53,242]],
    reserve:(u,v,p=0)=>Math.abs(u)<25+p&&v>-351-p&&v<19+p||Math.abs(u+3)<55+p&&v>16-p&&v<242+p||
      u>37-p&&u<91+p&&Math.abs(v+16)<13+p,
    arrivalNote:'Xe dừng ở điểm đón trả khách trước cổng chính phía bắc. Từ đây đi bộ dọc Công trường Mân Côi khoảng 365 m tới tháp chuông cũ. Bản đồ hành hương chỉ bãi đỗ xe khách riêng trên đường về phía đông bắc.',
    description:'Tháp chuông là phần còn đứng của nhà thờ được cung hiến năm 1928. Bên phía đông có Linh đài Ba Cây Đa. Thánh đường mới ở phía nam mang nhiều lớp mái ngói xanh. Đại hội tháng 8/2026 đã sử dụng lễ đài, tầng hầm và quảng trường. Ngoại thất phỏng theo ảnh năm 2026.',
    views:[camera('Tháp chuông cũ và trục nhà thờ',0,0,-11,-34,11.65,2.45,53,'Qua lối lát cuối Công trường Mân Côi, ba ô vòm trên tháp gạch mở ra nền trời. Về phía sau, mái ngói xanh thuộc thánh đường xây sau này.',towerId),
      camera('Linh đài dưới ba cây đa',75,-16.2,47.4,-16.0,11.2,2.37,57,'Từ lối chính của Linh đài nhìn qua bậc cấp. Tượng Đức Mẹ mặc áo dài và bồng Chúa Hài Đồng ở giữa ba cây đa bê tông cốt thép cao từ 16,5 đến 21 m.',shrineId),
      camera('Ngoại thất Vương cung Thánh đường mới',-4,143,-17,73,16.7,4.3,54,'Từ quảng trường nhìn lên tiền sảnh mở và những mái đao xanh. Theo ghi nhận tháng 10/2026, công trình vẫn đang hoàn thiện.',basilicaId,directory+'img/poi/vuong-cung-thanh-duong/1.webp'),
      camera('Cổng chính và Công trường Mân Côi',3.6,-345.5,2.8,-362.3,3.8,2.03,66,'Từ điểm đón trả khách trên đường công cộng nhìn xuyên qua cổng vào trục đi bộ. Hai bên Công trường Mân Côi là vườn cây và các lối ngang.','osm-node-3100290389',directory+'img/poi/cong-chinh/1.webp')],build});
})();

export default window.VietnamSights;
