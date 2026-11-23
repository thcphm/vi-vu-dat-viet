'use strict';
(() => {
  const sites=window.VietnamSights??=[],K=globalThis.VietnamKarst,A=globalThis.CentralArch;
  const park='https://nbca.gov.vn/wp-content/uploads/BachMa/';
  const summitPhotos='https://baotintuc.vn/anh/ve-dep-hung-vi-tu-vong-hai-dai-bach-ma-20260628163108848.htm';
  const geology='https://tapchi.humg.edu.vn/images/paper/2020/61_2/02.%20Vu%20Quang%20Lan%2010-21.pdf';
  const waterfallPhotos='https://huetourism.gov.vn/Kham-pha-thac-Do-Quyen.html/?pid=MjAwMDZ8Y3NkbGRs0';
  // Shared node of the named Bạch Mã road (game edge 287626) and OSM
  // service way 484001511. The upper service road is outside the driving graph.
  const road=[107.87232,16.24944],tau=Math.PI*2,oct=Math.PI/4;
  function view(name,x,z,height,viewRadius,viewAngle,viewElevation,viewFov=53){
    return {name,offset:[x,z],height,viewRadius,viewAngle,viewElevation,viewFov};
  }
  function register(id,osm,name,lon,lat,details,build){
    sites.push({id,catalogId:'osm-'+osm.replace('/','-'),name,lon,lat,yaw:0,start:road,mappedEntrance:true,
      arrivalNote:'Xe trong trò chơi dừng ở đầu đường nội bộ của Vườn. Ngoài thực địa, đường này tiếp tục lên núi rồi mới tới lối đi bộ.',
      province:'Huế',city:'Bạch Mã',region:'Trung Bộ',visitOnArrival:true,
      map:'https://www.openstreetmap.org/'+osm,...details,build});
  }

  // Both horses stand on all four feet, looking out from the summit. The
  // sculpted saddle and bridle are visible on the TTXVN and Tuổi Trẻ photos.
  function horse(T,k,x,z,yaw){
    const ivory=0xd8d7ca;
    k.place(x,z,yaw,()=>{
      k.box(0x918f81,0,.105,0,.78,.21,2.24);
      const h=A.carving(T,k,ivory,0,.19,0,1);
      h.sweep([[0,1.02,-.83,.13,.19],[0,1.07,-.66,.36,.43],[0,1.06,-.37,.41,.41],
        [0,1.06,.04,.40,.39],[0,1.11,.37,.34,.45],[0,1.16,.54,.22,.31]]);
      h.sweep([[0,1.19,.36,.34,.38],[0,1.49,.49,.28,.31],[0,1.79,.56,.22,.25],[0,2.05,.65,.18,.20]]);
      h.sweep([[0,2.04,.57,.16,.20],[0,2.04,.75,.20,.19],[0,1.92,.93,.14,.13],[0,1.86,1.03,.115,.105]]);
      for(const side of [-1,1]){
        h.sweep([[side*.105,2.10,.61,.068,.069],[side*.12,2.20,.57,.058,.06],[side*.157,2.31,.55,.013,.012]]);
        const step=side*.07;
        h.sweep([[side*.215,1.06,.35,.14,.16],[side*.205,.76,.41,.111,.118],[side*.215,.52,.44+step,.089,.088],
          [side*.216,.20,.45+step,.062,.052],[side*.216,.075,.48+step,.075,.067],[side*.216,.032,.51+step,.079,.087]]);
        h.sweep([[side*.22,1.10,-.54,.19,.20],[side*.23,.80,-.57,.13,.15],[side*.222,.53,-.73+step,.092,.10],
          [side*.225,.19,-.66+step,.066,.061],[side*.228,.07,-.68+step,.078,.073],[side*.228,.033,-.64+step,.085,.092]]);
      }
      h.sweep([[0,1.26,-.71,.12,.12],[0,1.07,-.85,.102,.095],[.035,.71,-.95,.115,.091],
        [.05,.43,-.93,.116,.09],[.07,.31,-.86,.035,.037]],.055);
      h.sweep([[0,1.41,.18,.16,.05],[0,1.58,.32,.14,.065],[0,1.80,.40,.12,.07],[0,2.075,.52,.075,.042]],.11);
      h.finish();
      const saddle=A.carving(T,k,0xada99b,0,.19,0,1);
      saddle.sweep([[0,1.30,-.37,.28,.085],[0,1.39,-.24,.36,.09],[0,1.40,-.01,.33,.072],[0,1.44,.095,.29,.105]]);
      saddle.finish();
      for(const s of [-1,1]){
        A.strut(T,k,0xaaa79b,s*.175,2.26,.70,s*.155,2.10,.91,.016);
        A.strut(T,k,0xada99b,s*.155,2.10,.91,s*.228,1.77,.35,.014);
        k.stamp(k.round,0x807e70,s*.177,2.218,.775,.037,.040,.034);
      }
    });
  }

  // Octagonal walls have two genuinely open round-headed lights per face.
  // Upper and lower masonry are separate rings. Only the east/south gates
  // are open to the floor. The eaves follow surveyed OSM way 484001513.
  function pavilion(T,k){
    const render=0xb4b0a1,trim=0xc7bcad,slate=0x6c6b62,mullion=0x9d695d;
    const f=createTempleFoundations(T,k);
    k.palette({stone:[render,slate,trim],metal:[0x686965],tile:0x77766f});
    const terrace=f.fixture(g=>{
      let level=g(0,0);for(let a=0;a<tau;a+=oct)level=Math.max(level,g(7.6*Math.cos(a),7.6*Math.sin(a)));return level;
    },()=>{
      function ring(base,top,y,h,tint){
        const g=new T.CylinderGeometry(top,base,h,8);g.rotateY(Math.PI/8);
        k.stamp(g,tint,0,y,0);g.dispose();
      }
      ring(10.05,10.05,-.76,1.75,0x939286);
      ring(10.0,10.05,.16,.17,0xa09c8e);
      function wall(faceRadius,bottom,height,entry,upper){
        const width=2*faceRadius*Math.tan(oct/2),sill=entry?.04:upper?.22:.89;
        const rad=entry?width*.30:width*(upper?.153:.148),spring=height-(upper?.26:.37)-rad;
        const centres=entry?[0]:[-width*.227,width*.227];
        const shape=new T.Shape();shape.moveTo(-width/2,0);
        for(const cx of centres){
          shape.lineTo(cx-rad,0);shape.lineTo(cx-rad,spring);
          shape.absarc(cx,spring,rad,Math.PI,0,true);shape.lineTo(cx+rad,0);
        }
        shape.lineTo(width/2,0);shape.lineTo(width/2,height);shape.lineTo(-width/2,height);shape.closePath();
        k.profile(shape,render,0,bottom,0,.27);
        if(!entry)k.box(render,0,bottom+sill/2,.135,width,sill,.27);
        // Irregular courses of dark local stone within the pale jointing.
        const tones=[0x77766e,0x898679,0x676960,0x979083,0x72786c],unit=upper?.20:.30;
        const rows=Math.max(2,Math.floor(height/unit)),rh=height/rows;
        for(let j=0;j<rows;j++){
          let left=-width/2+.055;
          while(left<width/2-.12){
            const right=Math.min(width/2-.05,left+unit*(.62+1.08*k.random())),y=(j+.5)*rh;
            const blocked=centres.some(cx=>y+rh*.55>sill&&Math.max(0,Math.abs((left+right)/2-cx)-(right-left)*.54)**2+
              Math.max(0,y-spring-rh*.59)**2<(rad+.069)**2);
            if(!blocked&&right-left>.09){
              const dy=rh*(.31+.13*k.random()),mid=(right+left)/2;
              k.outline([[left,y-dy*.42],[mid-.04,y-dy],[right-.02,y-dy*.70],[right,y+dy*.46],
                [mid+.045,y+dy],[left+.025,y+dy*.75]],tones[Math.floor(k.random()*tones.length)],0,bottom,.268,.026);
            }
            left=right+.035;
          }
        }
        for(const cx of centres){
          for(const side of [-1,1])k.box(trim,cx+side*(rad+.04),bottom+(spring+sill)*.5,.298,.083,spring-sill,.105);
          for(let i=0;i<12;i++){
            const a=i*Math.PI/12,b=(i+1)*Math.PI/12;
            A.strut(T,k,trim,cx+(rad+.046)*Math.cos(a),bottom+spring+(rad+.046)*Math.sin(a),.305,
              cx+(rad+.046)*Math.cos(b),bottom+spring+(rad+.046)*Math.sin(b),.305,.057);
          }
          if(!entry)k.box(trim,cx,bottom+sill,.28,2*rad+.21,.085,.20);
        }
        k.box(mullion,width/2-.055,bottom+height/2,.21,.125,height+.04,.19);
      }
      function tier(radius,bottom,height,upper){
        for(let i=0;i<8;i++){
          const a=i*oct;
          k.place(Math.sin(a)*radius,Math.cos(a)*radius,a,()=>wall(radius,bottom,height,!upper&&(i===2||i===0),upper));
        }
      }
      tier(6.74,.26,3.36,false);
      ring(8.67,8.66,3.74,.24,slate);ring(8.74,3.69,4.54,1.50,0x77766f);
      tier(3.19,5.26,1.53,true);
      ring(3.87,3.86,6.85,.14,slate);ring(3.91,.15,7.34,.87,0x73726b);
      for(let i=0;i<8;i++){
        const a=(i+.5)*oct;
        for(const [outer,inner,y,h] of [[8.74,3.69,3.81,1.50],[3.92,.10,6.94,.86]])
          A.strut(T,k,0x62635f,Math.sin(a)*outer,y,Math.cos(a)*outer,Math.sin(a)*inner,y+h,Math.cos(a)*inner,.075);
      }
      k.stamp(k.round,0x71726a,0,8.68,0,.041,2.0,.041);
    });
    f.stairs(terrace,-.4,8.64,-.5,12.8,1.89,.235,7);
    const horseLevel=g=>Math.max(g(17.65,-5.64),g(18.14,.29))+.08;
    for(const [x,z,a] of [[17.65,-5.64,1.68],[18.14,.29,1.80]]){
      f.fixture(horseLevel,()=>horse(T,k,x,z,a));
    }
    // DEM pixels are wider than the pavilion terrace. Rebuild the surveyed
    // summit and approach as two level landings with a planted bank between
    // them. A terraced apron prevents either horse hanging off the hillside.
    const bank=K.batch(T),lifts=[];
    function sample(x,z,tint,light,calc){lifts.push(calc);return [x,0,z,tint,light];}
    bank.grid(96,12,(u,v)=>{
      const a=tau*u,face=Math.cos((a+oct/2)%oct-oct/2),r=(9.23+6.1*v)/face;
      const x=r*Math.sin(a),z=r*Math.cos(a),t=v*v*(3-2*v);
      return sample(x,z,v<.11?0x989488:0x73805e,.83+.11*Math.cos(a*23+v*7),
        (g,h)=>h-.15+(g(x,z)-h-.30)*t);
    });
    function grade(x,top,lower){
      const t=Math.min(1,Math.max(0,(x-9.15)/8.5));return top+(lower-top)*t;
    }
    bank.grid(18,34,(u,v)=>{
      const x=8.6+19.5*v,mid=-1.52-(x-8.6)*.113;
      const side=2*u-1,z=mid+side*6.07;
      const shoulder=Math.min(1,Math.max(0,(1-Math.abs(side))/.40))*Math.min(1,(1-v)/.23);
      return sample(x,z,Math.abs(side)<.20?0x9c9989:0x758462,.83+.14*Math.cos(v*22+u*25),
        (g,h,l)=>g(x,z)+(grade(x,h,l)-g(x,z))*shoulder-.035-.13*(1-shoulder));
    });
    for(let i=0;i<12;i++){
      const ax=9.15+i*.72,bx=ax+.73,mid=x=>-1.60-(x-9.15)*.113;
      bank.grid(1,1,(u,v)=>{
        const x=ax+(bx-ax)*v,z=mid(x)+(2*u-1)*1.12;
        return sample(x,z,0xb1aa97,.92,(g,h,l)=>grade(ax,h,l)+.24);
      });
      bank.grid(1,1,(u,v)=>{
        const z=mid(bx)+(2*u-1)*1.12;
        return sample(bx,z,0x979182,.9,(g,h,l)=>grade(ax+v*.73,h,l)+.24);
      });
    }
    const lawn=new T.TextureLoader().load('streetscape/surfaces/grass-color.webp');
    lawn.wrapS=lawn.wrapT=T.RepeatWrapping;lawn.colorSpace=T.SRGBColorSpace;
    const grass=new T.MeshLambertMaterial({vertexColors:true});
    grass.onBeforeCompile=s=>{
      s.uniforms.lawn={value:lawn};
      s.vertexShader='varying vec2 bankPoint;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbankPoint=position.xz;');
      s.fragmentShader='varying vec2 bankPoint; uniform sampler2D lawn;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        if(vColor.g>vColor.r*1.04){
          vec3 turf=texture2D(lawn,bankPoint*.41).rgb;
          diffuseColor.rgb*=.58+1.45*dot(turf,vec3(.32,.51,.17));
        }`);
    };
    grass.addEventListener('dispose',()=>lawn.dispose());bank.add(k.group,grass);
    const terrain=k.group.children.at(-1).geometry,attr=terrain.attributes.position,fit=k.group.userData.fitGround;
    k.group.userData.fitGround=g=>{
      fit(g);const low=horseLevel(g),hi=terrace.height;
      for(let i=0;i<lifts.length;i++)attr.setY(i,lifts[i](g,hi,low));
      attr.needsUpdate=true;terrain.computeVertexNormals();terrain.computeBoundingSphere();terrain.computeBoundingBox();
    };
  }
  register('hai-vong-dai-bach-ma','way/484001513','Hải Vọng Đài',107.857564,16.199557,{
    kind:'Điểm ngắm cảnh',width:42,depth:23,gardenRadius:24,solids:[[0,0,6.9,6.9]],
    source:'https://visithue.vn/chiem-nguong-dai-ngan-ngua-trang-xu-hue/?pid=MjMzNDJ8Y3NkbGRs0',photo:summitPhotos,
    description:'Trên đỉnh Bạch Mã, đôi ngựa đá trắng đứng hai bên lối lên Hải Vọng Đài. Hai tầng cửa vòm và mái tám cạnh mở tầm nhìn khắp các sườn núi. Mô hình bám theo mặt bằng của lầu và vị trí hai tượng.',
    views:[view('Đôi ngựa đá bên đường lên lầu',14.4,-2.65,7.6,29,1.85,.13),
      view('Hai tầng cửa vòm',.5,0,7.9,24,-.73,.15),view('Mái bát giác trên đỉnh núi',.8,0,7.3,38,.87,.44)]
  },pavilion);

  // Offsets from OSM n11841089975. Each lip is on stream w616829740.
  // Measured reach and ranges of dimensions: Vũ Quang Lân et al., JMES 61(2)
  // (2020), p.19. Individual basin outlines interpret the NBCA descriptions.
  const course=[[61.9,-106.4],[61.4,-78.2],[53.4,-48.1],[51.1,-8.5],[24.1,16],[-48.1,36.3],
    [-72.3,50.3],[-101.1,84.6],[-130.2,110.4]];
  const basins=[
    {lip:1,run:24.7,half:5.9,rise:3,bend:4.6},
    {lip:2,run:26.0,half:3.55,rise:5,bend:-1.90},
    {lip:4,run:19.1,half:9.0,rise:5,bend:.50},
    {lip:5,run:19.4,half:7.8,rise:4,bend:-1.25},
    {lip:7,run:19.9,half:4.5,rise:3,bend:3.15}
  ];
  function streamTangent(path,i){
    const [x,z]=path[i],dx=path[i+1][0]-x,dz=path[i+1][1]-z,len=Math.hypot(dx,dz);
    return [dx/len,dz/len];
  }
  function nearStream(path,x,z){
    let best=Infinity;
    for(let i=1;i<path.length;i++){
      const [a,b]=path[i-1],dx=path[i][0]-a,dz=path[i][1]-b;
      const t=Math.min(1,Math.max(0,((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz)));
      best=Math.min(best,Math.hypot(x-a-dx*t,z-b-dz*t));
    }
    return best;
  }
  function waterMaterial(T){
    const m=new T.MeshLambertMaterial({vertexColors:true});
    const time={value:0},quiet=matchMedia('(prefers-reduced-motion: reduce)');
    m.onBeforeRender=()=>{time.value=quiet.matches?0:performance.now()*.001%600;};
    m.onBeforeCompile=s=>{
      s.uniforms.waterClock=time;
      s.vertexShader='varying vec3 brookP;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbrookP=position;');
      s.fragmentShader='varying vec3 brookP; uniform float waterClock;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=brookP.xz;
        float a=sin(p.x*1.3+p.y*2.7+1.35*sin(p.x*.74)-waterClock*1.63);
        float b=sin(p.y*4.8-p.x*2.6+sin(p.y*.77)-waterClock*2.34);
        float fade=1.-smoothstep(.18,1.1,length(fwidth(p)));
        diffuseColor.rgb+=vec3(.008,.015,.012)*smoothstep(.79,.97,a)*smoothstep(-.35,.84,b)*fade;`);
    };
    return m;
  }
  function fiveLakes(T,k){
    const rock=K.batch(T),water=K.batch(T);
    const poolData=basins.map((p,n)=>{
      const [ax,az]=course[p.lip],[dx,dz]=streamTangent(course,p.lip);
      function curve(t){
        const v=Math.sin(Math.PI*t);
        return p.bend*v*(n===1?Math.cos(1.33*Math.PI*t):n===4?1.1-.74*t:1);
      }
      function width(t){
        const end=Math.sin(Math.PI*Math.max(.00015,Math.min(.99985,t)))**.49;
        return p.half*end*(n===4?.51+.81*t:n===1?.79+.20*Math.cos(2*Math.PI*t):1);
      }
      function point(s,u){return [ax+dx*s+dz*u,az+dz*s-dx*u];}
      function poolPoint(t,u){
        const w=width(t),rockEdge=1+.042*Math.sin(t*17+n)+.032*Math.cos(t*29+n*.77);
        return point(t*p.run,curve(t)+u*w*rockEdge);
      }
      rock.grid(28,38,(u,t)=>{
        const [x,z]=poolPoint(t,(2*u-1)*1.18);
        return [x,.48+.14*Math.sin(6*t+3*u),z,0x777e6d,.81+.12*Math.cos(x*1.8-z)];
      });
      water.grid(26,42,(u,t)=>{
        const cross=2*u-1,[x,z]=poolPoint(t,cross),shoal=Math.abs(cross);
        const deep=shoal>.92?0x708374:shoal>.73?0x618574:shoal>.48?0x4c776a:0x3d6e64;
        return [x,1.15+.009*Math.sin(x*1.13+z*.75),z,deep,.84+.075*Math.sin(t*9+n)+.022*Math.cos(cross*8+t*4)];
      });
      // Rock aprons run beyond the water edge and taper below the forest floor.
      rock.grid(96,19,(u,v)=>{
        const a=tau*u,t=.5-.5*Math.cos(a),side=Math.sign(Math.sin(a)),w=width(t);
        const apron=(3.8+2.5*Math.sin(2*a+n)**2+1.8*Math.cos(5*a+n)**2)*v;
        const s=t*p.run-Math.cos(a)*apron,cross=curve(t)+side*w*.88+Math.sin(a)*apron;
        const [x,z]=point(s,cross);
        const cut=Math.abs(Math.cos(a))**20;
        const h=.74+Math.sin(Math.PI*v)*(.73+.71*Math.cos(4*a+n)**2)+.37*Math.sin(16*a+n)*v-2.3*v**3-cut*.52;
        return [x,h,z,v<.24?0x687269:v>.80?0x70725b:0x918e81,.83+.095*Math.sin(15*a+v*3.8)];
      });
      // Rounded, jointed granite slabs cross the waterline at the inlet and
      // outlet. Their uneven top faces break up the margin into small coves.
      for(let j=0;j<18;j++){
        const t=(j+.12+.75*k.random())/18,s=j%2?1:-1,centre=point(t*p.run,curve(t)+s*width(t)*(.85+.26*k.random()));
        const long=(.85+k.random()*1.35)*(n===2?.82:1),wide=.61+k.random()*.87,high=.38+k.random()*.79;
        const rot=k.random()*tau,seed=k.random()*9;
        rock.grid(12,5,(u,v)=>{
          const a=tau*u,ux=Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.56,uz=Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.56;
          const rim=(.99-.16*v-.42*Math.max(0,v-.68)/.32)*(1+.09*Math.sin(5*a+seed));
          const xx=long*ux*rim,zz=wide*uz*rim,x=centre[0]+xx*Math.cos(rot)+zz*Math.sin(rot),z=centre[1]+zz*Math.cos(rot)-xx*Math.sin(rot);
          return [x,.62+high*(v<.68?v/.68:.99+.08*Math.cos(a+seed)*(1-v)),z,v>.68?0x9b9d8e:0x777e74,.85+.12*Math.cos(a+seed)];
        });
        rock.grid(12,1,(u,v)=>{
          const a=tau*u,ux=Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.56,uz=Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.56;
          const rim=.41*(1+.09*Math.sin(5*a+seed))*(1-v),xx=long*ux*rim,zz=wide*uz*rim;
          return [centre[0]+xx*Math.cos(rot)+zz*Math.sin(rot),.62+high*(.99+v*.03),
            centre[1]+zz*Math.cos(rot)-xx*Math.sin(rot),0x9b9d8e,.90+.035*Math.cos(a+seed)*(1-v)];
        });
      }
      for(let j=0;j<35;j++){
        const t=.06+.88*k.random(),side=j%2?1:-1,[x,z]=point(t*p.run,curve(t)+side*(width(t)+k.random()*3.1));
        const scale=n===4?1.12:n===2?.57:.86;
        K.boulder(rock,x,1.10,z,(.38+k.random()*1.24)*scale,(.49+k.random()*1.48)*scale,
          (.45+k.random()*1.49)*scale,j*.86+n,j%4===0);
        if(j%4===1){const [fx,fz]=point(t*p.run,curve(t)+side*(width(t)+3.5));rock.ferns.push([fx,.62,fz,.90+k.random()*.93,j]);}
      }
      // Actual published heights are 2–7 m. A broad fan, twin chutes and a
      // stepped last lip reproduce the different watercourses of pools 3–5.
      const streams=n===3?[[-1.52,.65],[1.1,1.14]]:[[0,n===2?1.78:n===1?.79:1.13]];
      const deck=(t,u)=>{
        const fall=n===4?(.47/(1+Math.exp((t-.32)*29))+.53/(1+Math.exp((t-.65)*31))):1/(1+Math.exp((t-.52)*17));
        return 1.18+p.rise*fall+.12*Math.sin(4*t+u*.66)+.085*Math.cos(t*11+u*1.77)*Math.sin(t*Math.PI);
      };
      rock.grid(33,40,(u,v)=>{
        const s=-12+18.3*v,t=Math.max(0,Math.min(1,(s+3)/7.8));
        const w=6.8+1.85*Math.cos(v*7+n),side=(2*u-1)*w,[x,z]=point(s,side);
        const ledge=Math.max(0,1-Math.max(0,(Math.abs(side)-2.4)/(w-2.4)));
        const across=ledge*ledge*(3-2*ledge),along=Math.min(1,Math.max(0,(s+12)/8.9),Math.max(0,(6.3-s)/1.65));
        const mask=across*along,crack=(.43*Math.cos(s*1.26+side)+.27*Math.sin(s*.62-side*1.42))*Math.min(1,Math.abs(side)/2.5);
        return [x,-.72+(deck(t,side)+.53+crack)*mask,z,Math.abs(side)<1.4?0x63726b:0x787d70,.79+.12*Math.cos(side*1.48+t*4)];
      });
      for(const [shift,span] of streams)water.grid(13,32,(u,t)=>{
        const ridge=Math.sin(Math.PI*t),cross=(2*u-1)*span*(.78+(n===2?.57:.27)*ridge),meander=.20*Math.sin(t*6+n);
          const side=shift+cross+meander,[x,z]=point(t*7.8-3,side);
        const thread=Math.sin(u*38+2.5*Math.sin(t*9+u*4)+t*14+n);
        return [x,deck(t,side)+.078+.041*thread,z,t<.26?0x76938a:thread>.20?0xd2dfd5:0x9ab8ad,.87+.12*ridge];
      });
      for(let j=0;j<37;j++){
        const t=k.random(),s=j%2?1:-1,[x,z]=point(t*(p.run+16)-8,curve(t)+s*(width(t)+6.6+k.random()*13));
        const height=5.4+k.random()*7.9;rock.trees.push([x,-.32,z,height*.86,height,k.random()*tau]);
        if(j%3===0)rock.ferns.push([x,0,z,1.3+k.random()*1.4,k.random()*tau]);
      }
      return {...p,dx,dz,ax,az,curve,width,point};
    });
    // Intervening reaches follow the mapped stream. End the streams underneath
    // the basin surfaces instead of running a second strip across each lake.
    for(let i=0;i<course.length-1;i++){
      const [x,z]=course[i],[dx,dz]=streamTangent(course,i),run=Math.hypot(course[i+1][0]-x,course[i+1][1]-z);
      const above=poolData.find(p=>p.lip===i),start=above?above.run*.94:0;
      if(start>=run)continue;
      water.grid(8,Math.ceil((run-start)/1.7),(u,t)=>{
        const s=start+(run-start)*t,cross=(2*u-1)*(1.13+.29*Math.sin(s*.19))+Math.sin(Math.PI*t)*Math.sin(s*.11)*.63;
        const outlet=above?.76*Math.max(0,1-(s-start)/6.5):0;
        return [x+dx*s+dz*cross,.36+outlet+.018*Math.sin(s*1.45+u),z+dz*s-dx*cross,0x628e80,.83+.12*Math.cos(u*7+s*.64)];
      });
    }
    water.add(k.group,waterMaterial(T));k.group.children.at(-1).castShadow=false;
    let previous,levels;
    K.finish(T,k,rock,(ground,x,z)=>{
      if(previous!==ground){
        previous=ground;
        levels=poolData.map(p=>{
          let h=-Infinity;
          for(const t of [.06,.31,.56,.84,.97])for(const side of [-1,0,1]){
            const [px,pz]=p.point(p.run*t,p.curve(t)+p.width(t)*side);h=Math.max(h,ground(px,pz));
          }
          return h+.12;
        });
      }
      const raw=ground(x,z);
      for(let j=0;j<poolData.length;j++){
        const p=poolData[j],sx=x-p.ax,sz=z-p.az,s=sx*p.dx+sz*p.dz,t=Math.min(1,Math.max(0,s/p.run));
        const cross=Math.abs(sx*p.dz-sz*p.dx-p.curve(t));
        const beyond=Math.max(0,-4-s,s-p.run,cross-Math.max(s<6?4.3:0,p.width(t))-.35);
        if(beyond>7.9)continue;
        const blend=Math.max(0,1-beyond/7.9);return raw+(levels[j]-raw)*blend*blend*(3-2*blend);
      }
      return raw;
    });
  }
  register('ngu-ho-bach-ma','node/11841089975','Ngũ Hồ Bạch Mã',107.8553187,16.1914315,{
    kind:'Thác nước',width:210,depth:234,solids:[],gardenRadius:8,reserve:(x,z,p)=>nearStream(course,x,z)<13+p,
    source:park,photo:park,description:'Năm hồ nối nhau trên thượng nguồn suối Đỗ Quyên. Mô hình đặt các bậc nước theo bản đồ suối và phỏng theo mô tả của từng hồ, từ lòng hồ đầu uốn cong tới hai nhánh nước cùng đổ vào hồ thứ tư.',
    views:[view('Hồ thứ ba dưới dòng thác xòe',16,18.3,7.0,33,-1.42,.42),
      view('Lòng hồ đầu cong như lưỡi liềm',61,-65,6.9,33,-.72,.55),
      view('Hồ thứ hai và rãnh nước hẹp',54,-37,8.7,38,.05,.61),
      view('Hai nhánh đổ vào hồ thứ tư',-54,40.5,8.3,30,-1.11,.45),
      view('Bậc đá trước hồ thứ năm',-108,92.5,7.7,31,-.62,.45)]
  },fiveLakes);

  // The lip is the intersection of stream w616829740 and cliff w1275050156.
  // The upper viewpoint n6338347813 is 19 m north. Downstream offsets are
  // actual bends in the mapped watercourse, not a vertical 300 m billboard.
  const dropPath=[[6.8,-70.3],[0,0],[18.8,78.6],[29.8,133.4],[29.1,184.2],[25.9,188.7]];
  function thacDoQuyen(T,k){
    const rock=K.batch(T),water=K.batch(T);
    function spine(z){
      let i=1;while(i<dropPath.length-1&&dropPath[i][1]<z)i++;
      const [ax,az]=dropPath[i-1],[bx,bz]=dropPath[i];return ax+(bx-ax)*(z-az)/(bz-az);
    }
    function granite(z,d){
      const lip=Math.exp(-(((z-(d<0?.225:.888)*d)/6.7)**2));
      const ledge=1.3*Math.cos(z*.16+d*.19)+.65*Math.cos(z*.51-d*.22);
      const ribs=Math.sin(d*.63+.91*Math.sin(z*.071)+z*.024)*.91;
      const outcrop=Math.max(0,1-Math.abs(d)/(23+5.2*Math.sin(z*.083)));
      return .58+outcrop*(2.18+.49*ledge+ribs+.95*lip)+.40*Math.max(0,Math.abs(d)-11)/12;
    }
    function channel(z){return .5*Math.sin(z*.16)+1.21*Math.sin(z*.081)+.18*Math.sin(z*.47);}
    function faceWidth(z){return 22.4+3.8*Math.sin(z*.061)+3.1*Math.cos(z*.107);}
    rock.grid(46,186,(u,t)=>{
      const z=-23+213*t,side=(2*u-1)*faceWidth(z),edge=Math.abs(2*u-1),dist=Math.abs(side-channel(z));
      const dark=dist<3.3+.8*Math.sin(z*.17),ribbon=.5+.5*Math.sin(side*.83+z*.12);
      return [spine(z)+side,granite(z,side)-4.2*edge**6,z,dark?0x626d68:edge>.82&&ribbon>.65?0x728164:0x96958a,
        .72+.22*ribbon+.09*Math.cos(z*.42+side*.28)];
    });
    function line(z){return z<0?1.65+.71*Math.cos(z*.17):1.74+.39*Math.cos(z*.17)+.58*Math.sin(z*.054);}
    water.grid(18,205,(u,t)=>{
      const z=-31+219*t,u2=2*u-1,d=channel(z)+u2*(line(z)+.22*Math.cos(z*.72+u2*2)+.14*Math.sin(z*.93+u2*4));
      const strands=.58*Math.sin(u*48+1.3*Math.sin(z*.13)+z*.046)+.27*Math.cos(u*76-z*.051);
      const tint=z<-.8?(Math.abs(u2)>.85?0x9ea69a:0x688e84):(strands>.11?0xe0e8df:strands>-.42?0xb6cdc3:0x93b4a9);
      return [spine(z)+d,granite(z,d)+.19+.055*strands,z,tint,.89+.09*Math.cos(z*.19+u*5)];
    });
    for(const [lo,hi,side] of [[18,46,-1],[57,79,1],[98,134,-1],[146,168,1]]){
      water.grid(8,28,(u,t)=>{
        const z=lo+(hi-lo)*t,offset=Math.sin(Math.PI*t);
        const d=channel(z)+side*(.84+2.24*offset)+(.18+.28*offset)*(2*u-1);
        return [spine(z)+d,granite(z,d)+.19,z,0xc2d3c8,.83+.13*Math.sin(t*11+u*5)];
      });
    }
    for(let i=0;i<85;i++){
      const z=-18+200*k.random(),s=i%2?1:-1,d=s*(.76+.25*k.random())*faceWidth(z);
      const x=spine(z)+d;
      K.boulder(rock,x,1.14,z,1.02+2.0*k.random(),.68+1.67*k.random(),1.35+2.0*k.random(),i*.74,i%3!==0);
      if(i%2===0)rock.ferns.push([x,1.36,z,.88+.80*k.random(),i]);
    }
    // Moist montane forest frames the exposed corridor. Preserve a clear
    // sightline along the water and do not insert plants in the fall itself.
    for(let j=0;j<285;j++){
      const z=-30+233*k.random(),s=j%2?1:-1,d=s*(faceWidth(z)*(.84+.18*k.random())+k.random()*29);
      const h=6.0+10*k.random();rock.trees.push([spine(z)+d,-.4,z,h*(.64+.23*k.random()),h,k.random()*tau]);
    }
    water.add(k.group,waterMaterial(T));k.group.children.at(-1).castShadow=false;K.finish(T,k,rock);
  }
  register('thac-do-quyen-bach-ma','node/11805703977','Thác Đỗ Quyên',107.8488791,16.1861401,{
    kind:'Thác nước',width:97,depth:211,solids:[],gardenRadius:7,reserve:(x,z,p)=>nearStream(dropPath,x,z)<22+p,
    source:geology,photo:waterfallPhotos,description:'Suối Đỗ Quyên đổ qua vách đá xuống sườn nam Bạch Mã. Khảo sát địa chất ước tính thác cao khoảng 280 m. Cảnh mô phỏng đoạn từ mép thác tới khúc suối phía dưới theo địa hình của trò chơi.',
    views:[view('Nhìn ngược dải thác trên sườn nam',18,108,5,301,.16,-.25,60),
      view('Mép thác nhìn từ phía sườn tây',1.9,7,7.2,34,-.82,.47),
      view('Dòng nước xẻ vách đá',25,121,6.3,49,.28,-.14)]
  },thacDoQuyen);
})();
