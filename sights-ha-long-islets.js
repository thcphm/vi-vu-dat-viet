'use strict';
(() => {
  const K=window.VietnamKarst,sites=window.VietnamSights??=[],tau=2*Math.PI;
  const whc='https://whc.unesco.org/uploads/nominations/672bis.pdf#page=158';
  const caveList='https://whc.unesco.org/document/192087';
  const board='https://halongbay.com.vn/';
  const harbour=[106.9894,20.91974];
  function register(data,shots,build){
    const yaw=data.yaw,c=Math.cos(yaw),s=Math.sin(yaw);
    sites.push({region:'Bắc Bộ',province:'Quảng Ninh',city:'Vịnh Hạ Long',kind:'Hang động',
      start:harbour,mappedEntrance:true,gardenRadius:18,solids:[],visitOnArrival:true,
      views:shots.map(([name,x,z,height,radius,angle,elevation])=>({name,offset:[c*x+s*z,c*z-s*x],
        height,viewAngle:yaw+angle,viewRadius:radius,viewElevation:elevation})),...data,build});
  }

  function interpolate(rows,depth){
    const i=rows.findIndex(p=>p[0]>=depth),a=rows[Math.max(0,i<0?rows.length-1:i-1)],b=rows[i<0?rows.length-1:i];
    const t=a===b?0:(depth-a[0])/(b[0]-a[0]);
    return a.map((v,j)=>v+(b[j]-v)*Math.max(0,Math.min(1,t)));
  }
  function covers(rows,x,z,padding){
    const d=-z;
    if(d< -15-padding||d>rows.at(-1)[0]+4+padding)return false;
    const [,centre,halfWidth]=interpolate(rows,d);
    return Math.abs(x-centre)<halfWidth+4+padding;
  }
  // Open-ended solid rock shell, with a separate dry floor and a thick
  // limestone rim at each end. All horizontal samples use the same sections.
  function gallery(r,rows,spec){
    const length=rows[rows.length-1][0];
    function sample(u,v,out){
      const d=v*length,[,cx,w,top,floor]=interpolate(rows,d);
      const a=Math.PI*u,cs=Math.cos(a),sn=Math.sin(a),texture=.29*Math.sin(9*a+d*.21)+.19*Math.cos(18*a-d*.36);
      const cut=spec.skew*cs*Math.max(0,1-d/18);
      const x=cx+w*cs;
      const crown=spec.shafts?spec.shafts(x,d):0;
      const y=floor+(top-floor)*sn**spec.arch+texture*.86*sn+crown+
        .24*Math.cos(3*a+d*.6)*sn+.13*Math.sin(19*a+d*.71)*sn;
      if(!out)return [x+.24*texture,y,-d+cut];
      const flanks=1.3+(spec.shoulder-1.3)*Math.sin(Math.PI*v)**.42;
      const shoulder=spec.crest*(.48+.52*Math.sin(Math.PI*v)**.67);
      return [cx+cs*(w+flanks)+texture*.59,floor+(top+shoulder-floor)*sn**.81+
        1.14*Math.sin(d*.29+3*a)*sn+.43*Math.cos(12*a+d*.21)*sn,-d+cut+.42*Math.sin(9*a)];
    }
    for(const outer of [false,true])r.grid(39,60,(u,v)=>{
      const p=sample(u,v,outer),a=Math.PI*u,stripe=Math.cos(16*a-.34*p[2]+.55*Math.sin(6*a));
      const atEdge=Math.min(1,Math.min(v,1-v)*8);
      return [...p,outer?(u>.25&&u<.76?0x79816c:0x8d9387):0xb1a79a,
        outer?.87+.105*stripe:.86-.27*atEdge+.10*stripe];
    });
    for(const v of [0,1])r.grid(39,7,(u,t)=>{
      const a=sample(u,v,false),b=sample(u,v,true),rim=Math.sin(t*Math.PI);
      return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t+
        (v?-1:1)*rim*(.42+.32*Math.cos(u*34)),0xaaa79b,.78+.17*Math.sin(u*21+t*3)];
    });
    r.grid(25,51,(u,v)=>{
      const d=v*length,[,cx,w,,floor]=interpolate(rows,d),x=(2*u-1)*w;
      return [cx+x,floor+.095*Math.sin(1.9*x+.3*d)+.055*Math.sin(2*d+.43*x),-d+spec.skew*(x/w)*Math.max(0,1-d/18),
        spec.sand?0xb6a78a:0xa89d87,.85+.10*Math.cos(.71*x-.64*d)];
    });
    // Tie the excavated visitor volume back into the elevation tile. This
    // bed extends beneath the portal cuts and drops below the existing shore
    // at its edges. The dry sand apron is present on the Trinh Nữ beach only.
    r.grid(32,47,(u,v)=>{
      const d=-10+(length+15)*v,[,cx,w,,floor]=interpolate(rows,d);
      const spread=w*1.26+2.5,side=2*u-1,x=cx+spread*side;
      const margin=Math.max(0,(Math.abs(side)-.82)/.18),end=Math.max(0,-d/10,(d-length)/5);
      const y=floor-.39-.40*Math.max(0,-d)-margin**1.7*4-end**2*2.8;
      return [x,y+.08*Math.sin(x*1.1+d*.47),-d+spec.skew*side*Math.max(0,Math.min(1,1-d/18)),
        spec.sand?0xbbaa87:0x99978a,.86+.07*Math.cos(d*.27+x*.41)];
    });
    for(let i=0;i<29;i++){
      const u=.18+.65*((i*.618034+.12)%1),v=.04+.91*((i*.381966)%1);
      const [x,y,z]=sample(u,v,true),h=1.4+2.2*Math.sin(i*2.15)**2;
      r.trees.push([x,y-.22,z,h*.88,h,i]);
    }
  }
  function flowstone(r,x,z,y,rx,rz,h,tint,phase,up){
    r.grid(19,9,(u,v)=>{
      const a=u*tau,flute=1+.13*Math.cos(8*a+phase+.59*v)+.08*Math.sin(5*a-v*2);
      const radius=(.035+.965*(1-v)**.73)*flute*(.89+.10*Math.sin(9*v+phase)+.10*Math.cos(15*v-phase));
      return [x+rx*radius*Math.cos(a)+rx*.12*Math.sin(v*2),y+(up?1:-1)*h*v,
        z+rz*radius*Math.sin(a),tint,.90+.12*Math.cos(8*a+phase+.59*v)];
    });
  }
  // Stitch the footprint of the entrance into the actual coarse elevation
  // field. A ground shader can remove the surface of a hill, but cannot
  // supply the bank connecting the surviving hillside and the beach.
  function beach(T,k){
    const rock=K.batch(T),profile=[];
    rock.grid(36,32,(u,v)=>{
      const x=-30+u*57,z=-20+v*44;
      const mouth=1-Math.min(1,Math.max(0,(Math.abs(x)-10)/6,(z-4)/12,(-z-10)/9));
      const weight=Math.min(1,Math.max(0,(1-Math.max(Math.abs(2*u-1),Math.abs(2*v-1)))*6));
      const relief=.06*Math.sin(x*.7+z*.54)+.037*Math.cos(z*1.5-x*1.1);
      const sand=.34+.037*x-.018*z+relief;
      profile.push([x,z,mouth,weight,sand]);
      return [x,sand,z,x<2?0xbfaf91:0xa3957d,.90+.07*Math.cos(x*.43-z*.15)];
    });
    rock.add(k.group,createSightStoneMaterial(T));
    const mesh=k.group.children.at(-1),pos=mesh.geometry.attributes.position;
    const fit=k.group.userData.fitGround;
    k.group.userData.fitGround=height=>{
      fit(height);
      profile.forEach(([x,z,mouth,weight,y],i)=>{
        const grade=height(x,z),low=Math.min(grade-.10,y),surface=grade*(1-weight)+
          weight*(y*mouth+low*(1-mouth))+.028;
        pos.setY(i,surface);
      });
      pos.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();
    };
  }
  function lyingFlowstone(r){
    // A low, horizontal calcite mass at the daylight entrance. The domes,
    // flutes and short apron model natural deposition, including a tapered
    // seaward end; the human likeness belongs to the local oral tradition.
    r.grid(31,13,(u,v)=>{
      const a=Math.PI*v,t=2*u-1;
      const ends=Math.max(.018,Math.sin(Math.PI*u))**.43;
      const back=.81+.24*Math.sin(u*7.1)+.22*Math.cos(u*13.5),rib=.085*Math.cos(u*46+1.6*Math.sin(a*2.5));
      const h=(.83+.60*Math.exp(-((u-.28)**2)/.013)+.35*Math.exp(-((u-.64)**2)/.029))*ends;
      const z=-4.82+.26*Math.sin(u*8.4)+Math.cos(a)*(back+rib)*ends;
      return [-1.32+t*3.38,1.02+Math.sin(a)**.66*h+rib*Math.sin(a),z,
        0xbbad96,.79+.16*Math.sin(a)+.11*Math.cos(u*46+1.6*Math.sin(a*2.5))];
    });
    for(let i=0;i<4;i++)flowstone(r,-3.69+i*.27,-4.48+.12*Math.sin(i),1.06,.29,.53,.37+.11*(i%3),0xc2b49d,i,true);
  }

  // Waltham, UNESCO geological assessment, fig. 17. The 40 m bar scales the
  // outline and section. The north arrow points along the page to the right.
  // The eastern beach is visible on the Bồ Hòn coastline w350325051. The
  // OSM mouth and UNESCO's locality point (inside the hill) are distinct.
  const nuRows=[[0,0,10.6,11.8,.63],[7,3.5,13.3,11.9,.94],[14,7.6,12.5,12.1,1.36],
    [23,11.9,6.6,12.1,2.84],[30,15.4,8.6,12.3,6.45],[37,17.3,10.8,12.2,7.02],
    [45,21.4,11.5,12,6.12],[52,26,15,12,4.56],[59,30.1,19.8,12,3.30],
    [67,31.8,21.3,12.1,3.37],[74,31.0,15.3,12.2,5.28],[77,29.3,9.1,12.1,6.10]];
  const nuCut=[[0,.7,14,12.2,.63],[14,7.6,13.4,12.1,1.36],nuRows[3],nuRows[5],nuRows[9],nuRows[11]];
  register({id:'osm-node-3887715188',catalogId:'osm-node-3887715188',name:'Hang Trinh Nữ',
    lon:107.1085606,lat:20.8344798,yaw:-3.105,width:73,depth:98,foundationAt:[0,0],
    caveOpening:{sections:nuCut,approach:1.4},reserve:(x,z,p)=>covers(nuRows,x,z,p),gardenRadius:84,source:whc,
    photo:board+'vi/p/1180-hang-trinh-nu-noi-thien-nhien-khac-tinh-yeu-len-da',
    map:'https://www.openstreetmap.org/node/3887715188',
    arrivalNote:'Xe ở cảng Tuần Châu. Theo Ban Quản lý Vịnh, từ cảng đến hang Trinh Nữ khoảng 16 km đường thủy. Thuyền tiếp cận bãi cát bên cửa hang.',
    description:'Hình 17 trong hồ sơ địa chất Hạ Long ghi hai cửa cách nhau khoảng 80 m. Nền đá dâng cao ở đoạn thắt giữa các ngăn. Từ cửa bên bãi cát có thể nhìn thấy khối măng đá nằm ngang. Các chi tiết bề mặt là mô phỏng.'},
    [['Từ cửa hang nhìn ra bãi cát',0,-1,12.2,13,1.89,.015],['Măng đá nằm ngang ở cửa',-2.2,-4.7,5.5,8.4,-.15,.115],
      ['Từ ngăn phía nam nhìn ra vịnh',30,-73,16,12,.17,-.055]],
    (T,k)=>{
      const r=K.batch(T);
      // The two ceiling shafts open only into darkness in the survey.
      const shafts=(x,d)=>4.3*Math.exp(-((x-27.4)**2/5+(d-55.9)**2/8))+
        5.4*Math.exp(-((x-30.4)**2/5+(d-63.1)**2/9));
      gallery(r,nuRows,{arch:.40,skew:9.8,crest:8.2,shoulder:5.2,shafts,sand:true});
      // Receding ledges and a natural horizontal formation at the beach end.
      lyingFlowstone(r);
      for(const [x,z,y,rx,rz,h,ph] of [[10,-29,6.46,1.75,2.23,4.37,1],[19,-34,7.15,1.9,2.32,3.9,2.4],
        [26,-45.9,6.05,1.44,1.62,4.18,.6],[33,-69,3.7,1.41,1.79,3.53,1.76]]){
        flowstone(r,x,z,y,rx,rz,h,0xb5a28a,ph,true);
      }
      for(const [x,h,w] of [[-5.3,.8,.31],[-4.9,1.18,.34],[-4.44,.56,.24],[-2.15,.66,.38],
        [.51,1.36,.39],[1.02,1.12,.31],[1.36,.50,.25],[3.91,.63,.24],[4.21,.79,.37]]){
        flowstone(r,x,-.31+x*.97,11.56-.041*x*x,w,w*1.22,h,0xb2aa98,x,false);
      }
      for(const [x,d] of [[30,55],[28,64],[34,60],[38,65],[25,67],[22,61],[35,53]]){
        const f=interpolate(nuRows,d)[4];
        K.boulder(r,x,f+.03,-d,1.15+k.random(),.76+.73*k.random(),.92+k.random(),x);
      }
      K.finish(T,k,r,()=>0);
      beach(T,k);
    });

  // The southern shore of w479910112 has an unnamed surveyed cave mouth
  // (n5246605623). It is 50 m northeast of the Hang Trống inventory point
  // in UNESCO's management dossier. The Board documents a NW and a SE door.
  // Only the visible chamber is interpreted; its area is about 300 m².
  const drumRows=[[0,0,8.4,8.4,2.4],[4,-.5,8.1,9.2,2.68],[8,-.74,7.3,9.35,2.75],
    [12,.48,7.2,9.04,2.78],[16,.71,6.62,8.66,2.82],[20,.12,5.34,8.37,2.85]];
  register({id:'hang-trong-bo-hon',catalogId:'osm-node-5246605623',name:'Hang Trống',
    lon:107.1074494,lat:20.8404008,yaw:.77,width:35,depth:37,foundationAt:[0,5.4],
    viewBase:'monument',reserve:(x,z,p)=>covers(drumRows,x,z,p),
    source:board+'p/1332-hang-trong-hai-giai-doan-moi-truong-mot-dong-chay-van-hoa',
    photo:board+'en/p/652-hang-trong-ky-quan-giua-long-ky-quan-vinh-ha-long',
    map:'https://www.openstreetmap.org/node/5246605623',survey:caveList,
    arrivalNote:'Xe ở cảng Tuần Châu. Thuyền đưa khách đến đảo ở phía bắc hang Trinh Nữ. Từ cảng đến cửa hang khoảng 15,1 km đường chim bay. Lối lên từ mép nước dẫn tới sàn tham quan.',
    description:'Hai cửa tây bắc và đông nam cùng đón ánh trời. Ở cửa tây bắc có lớp vỏ ốc nước ngọt trong trầm tích nâu vàng. Cửa đông nam còn dấu vỏ hàu biển. Vòm đá và sàn tham quan được mô phỏng theo ảnh thực địa.'},
    [['Từ sàn gỗ nhìn qua vòm đông nam',0,-1,12.2,12.3,Math.PI,.06],
      ['Cột đá ở cửa tây bắc',.95,-17.2,13.6,12.5,.10,.028],['Lối lên từ mép nước',.2,.30,12.5,26,.12,.135]],
    (T,k)=>{
      const r=K.batch(T);
      gallery(r,drumRows,{arch:.76,skew:.64,crest:8.2,shoulder:4.4});
      // Photos from the Board show an unrailed plank floor across the
      // viewing chamber and a narrow flight with rails rising from the shore.
      const wood=0x918778,slat=0xa99c87;k.palette({timber:[wood,slat]});
      for(let i=0;i<35;i++)k.box(i%5?wood:slat,(i-17)*.224,2.88,-8.0,.215,.095,14.7);
      for(let j=0;j<10;j++)k.box(wood,-2.48,2.53-j*.206,1.2+j*.32,1.63,.175,.33);
      for(const s of [-1,1]){
        for(const j of [0,3,6,9])k.box(wood,-2.48+s*.80,3.02-j*.206,1.2+j*.32,.093,1.16,.093);
        CentralArch.strut(T,k,wood,-2.48+s*.8,3.58,1.2,-2.48+s*.8,1.72,4.08,.065);
      }
      // The landing is a low natural rock shelf, continuous beneath the
      // steps at the water. It carries patchy boulders rather than a dry pier.
      for(const [x,z,w,h,d] of [[-2.35,3.74,2.08,.72,1.75],[-4.72,2.60,1.84,1.03,1.63],
        [.2,1.92,1.73,.95,1.25],[3.14,1.6,2.4,1.23,1.92],[-6.79,.63,2.1,1.53,1.6]]){
        K.boulder(r,x,.63,z,w,h,d,z);
      }
      // The irregular calcite pillar stands on the daylight side of the
      // chamber. Its profile is taken from the facing interior photograph.
      r.grid(24,17,(u,v)=>{
        const a=tau*u,waist=.74+.55*(1-v)**2+.37*Math.exp(-((v-.69)**2)/.014),w=waist*(1+.19*Math.cos(5*a+v*2));
        return [1.27+w*Math.cos(a)+.22*Math.sin(v*13),2.85+5.16*v,-17.7+w*.81*Math.sin(a),0xa39785,
          .76+.15*Math.cos(a*5+v*2)];
      });
      for(let i=0;i<14;i++){
        const x=-5.3+i*.81,rt=8.97-1.9*(x/7.3)**2;
        flowstone(r,x,-15.7+Math.sin(i*2.69)*1.5,rt,.29+.30*k.random(),.46,
          .59+1.67*k.random(),0xb8aa90,i*.64,false);
      }
      for(const [x,y,z,w,h,d,ph] of [[-5.81,2.43,-16.7,2.16,.99,1.05,.3],
        [-5.74,2.76,-18.75,1.7,.85,.91,1.3],[6.65,2.25,-1.50,1.31,.89,1,1.75]]){
        K.boulder(r,x,y,z,w,h,d,ph);
      }
      K.finish(T,k,r,()=>0);
    });
})();
