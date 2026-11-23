'use strict';
(()=>{
  const id='thac-cay-du',catalogId='osm-node-5841472185';
  const stop=window.VietnamTourism.byId.get(catalogId),tour='https://daklakvrtour.com/tour/333/index.html';
  const source='https://phuyen.baodaklak.vn/141/220676/vi-vu-o-thac-cay-du.html';
  // Tour 333, scene 6, 22 June 2025: two wet slots, two uneven overhangs,
  // a pale rock apron and a plank across the narrow outlet. All six panoramas
  // repeat the same unrelated GPS pair. Register by the pool, the direction
  // of flow and that short crossing on the east bank instead.
  // https://daklakvrtour.com/thac-cay-du.html
  // https://www.google.com/maps/@13.489116,109.17863,119m/data=!3m1!1e3
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=109.17863,13.489116&level=18
  // https://www.openstreetmap.org/way/1448358262
  // https://phuyentourist.com/thac-cay-du-noi-canh-dep-va-binh-yen-den-nao-long/
  const lon=109.178630,lat=13.489116,yaw=1.78;
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  const weight=x=>1-smooth((Math.abs(x)-11)/21);
  // Each pair gives downstream distance and height on the representative
  // fall line. The two negative setbacks are the undersides of the ledges.
  const strata=[[-3.3,14.75],[-1.8,14.7],[-.98,14.48],[-.63,13.25],
    [-.30,11.42],[.08,9.52],[.50,9.18],[1.48,8.99],[1.62,8.65],[.55,8.41],
    [.81,7.22],[1.52,6.49],[2.13,5.80],[3.58,5.50],[4.23,5.06],[3.13,4.68],
    [3.02,4.34],[3.40,3.61],[4.28,3.14],[5.13,2.74],[5.88,2.11],[6.49,1.32],
    [7.66,.91],[8.74,.56],[9.42,.39],[10.50,.26],[11.0,.10]];
  function point(x,t){
    const f=Math.max(0,Math.min(1,t))*(strata.length-1),i=Math.min(strata.length-2,Math.floor(f));
    const s=f-i,a=strata[i],b=strata[i+1],y=a[1]+(b[1]-a[1])*s;
    const crest=.63*Math.sin(x*.28+.54)+.30*Math.sin(x*.83)+.15*Math.cos(x*1.89);
    const split=.24*Math.tanh(6*Math.sin(x*.99+.22*y))+.31*Math.tanh(5*Math.sin(x*.43-.08*y+.5));
    const seam=.19*Math.sin(.47*x+.7)+.17*Math.cos(x*.93+.36*y)+split;
    const shoulder=smooth((x-4)/8);
    const swell=Math.exp(-(((t-.53)/.24)**2))*(.78*Math.cos(x*.27)+.39*Math.sin(x*.82));
    // Each shelf terminates in broken slabs. Across a vertical joint,
    // the neighbouring block can be set back or tilted by several decimetres.
    const joints=(.6*split+.22*Math.tanh(4*Math.sin(x*.83+t*3.9))+.11*Math.sin(2.8*x+t*31));
    const upper=smooth((x+12)/3)*(1-smooth((x-2.0)/4.6));
    const lower=smooth((x+11)/3.6)*(1-smooth((x+1.2)/5.8));
    const shelf=t<.39?upper:lower;
    const bank=t>.69?smooth((t-.69)/.27):0;
    const base=a[0]+(b[0]-a[0])*s;
    const z=base*shelf+(t*9.15-3.05)*(1-shelf)+crest+swell+.25*Math.cos(x*.62+t*8)
      +joints*(.36+1.12*Math.sin(t*Math.PI))+shoulder*3*t;
    const high=(y*(1-.14*shoulder)+(.060*-x+seam)*smooth(y/2.5)
      +(.31*Math.sin(1.2*x)+joints*.7)*Math.sin(t*Math.PI)+bank*.17*split)*weight(x);
    return [x,Math.max(-.33,high),z];
  }
  const lines=[
    t=>-4.72+1.72*Math.sin(t*2.15)-.81*Math.sin(t*7.9)-.48*t,
    t=>2.82+1.99*t-.73*Math.sin(t*7)+.32*Math.sin(t*11)
  ];
  function top(x,z){return point(x,0)[1]*(1-smooth((-z-22)/40));}
  // Left and right banks of the lower pool and its ENE outlet. The
  // photographed open rock platform projects from the north side.
  const banks=[[6,-8.8,6.7],[9,-11.4,8.4],[12,-11.8,7.4],[15,-10,6.4],
    [18,-6.8,7.8],[21,-3.8,8.8],[23,-2.0,10.4],[27,.6,11.5],[34,3.9,12.8],
    [43,7.7,14.8],[53,8.8,15.5]];
  function bounds(z){
    let i=1;while(i<banks.length-1&&z>banks[i][0])i++;
    const a=banks[i-1],b=banks[i],t=smooth((z-a[0])/(b[0]-a[0]));
    return [a[1]+(b[1]-a[1])*t,b[2]+(b[2]-a[2])*t];
  }
  function build(T,k){
    const K=window.VietnamKarst,rock=K.batch(T),water=K.batch(T),streams=K.batch(T),grass=K.batch(T);
    const wet=(x,t)=>Math.min(...lines.map(line=>Math.abs(line(t)-x)));
    rock.grid(145,78,(u,t)=>{
      const x=(u*2-1)*32,p=point(x,t),y=p[1],d=wet(x,t);
      const vein=Math.sin(x*1.49+.39*y+.84*Math.sin(x*.43+y*.49));
      const beds=Math.cos(x*.59+.73*y)+.38*Math.cos(x*2.1-.57*y);
      const flank=Math.abs(x)>11.8+.6*Math.sin(y*.65);
      const stain=d<1.47+.46*Math.cos(x*.83+y*.76)||((t>.27&&t<.64)&&d<3.9+.9*vein);
      const under=(t>.32&&t<.39&&x<2.4||t>.55&&t<.66&&x<1.8)&&Math.abs(x)<9;
      const tint=flank?0x99916c:under?0x736858:stain?0x73727b:
        (vein>.3&&beds>.31?0xd7b48d:vein<-.74?0xa79c96:t>.75?0xb6aba2:0xc8b1a0);
      return [...p,tint,.82+.14*vein+.10*Math.sin(x*1.81+y*2.13)+.06*beds];
    });
    rock.grid(68,42,(u,t)=>{
      const x=(u*2-1)*32,z=point(x,0)[2]-(2+59*t)*t;
      return [x,top(x,z)-.03,z,Math.abs(x)>11?0x777650:0x8f8477,.88+.11*Math.sin(x*.67+z*.74)];
    });
    // The upstream pond is broader than the narrow slots at its lip, then
    // turns to the northwest under the trees.
    const upperCentre=z=>1.2+Math.max(0,-z-10)*.33;
    water.grid(32,38,(u,t)=>{
      const s=-36+33*t,half=(2.5+5.7*Math.sin(Math.PI*t)**.69)*smooth(t/.21)+.20;
      const x=upperCentre(s)+(u*2-1)*half,z=s+point(x,0)[2]+3.61;
      return [x,top(x,z)+.075,z,Math.abs(2*u-1)>.86?0x817e57:0x566f64,.92+.06*Math.cos(s*.66+x*.73)];
    });
    // Slender summer runnels cross each landing separately. At a setback
    // the water detaches from the rock and reconnects on the next ledge.
    for(const [branch,line] of lines.entries()){
      for(const [start,end,shift,width] of [[0,1,0,branch?.36:.43],[.14,.55,-.48,.10],[.48,.90,.56,.14]]){
        streams.grid(5,85,(u,v)=>{
          const t=start+(end-start)*v,c=line(t)+shift*Math.sin(v*Math.PI);
          const w=width*(.47+.47*Math.sin(t*13+branch)**2+.22*Math.sin(t*41)**2);
          const x=c+(2*u-1)*w,p=point(x,t),i=t*(strata.length-1);
          for(const [from,to] of [[7,10],[14,18]])if(i>from&&i<to){
            const a=point(x,from/(strata.length-1)),b=point(x,to/(strata.length-1)),f=(i-from)/(to-from);
            p[2]=Math.max(p[2],a[2]+(b[2]-a[2])*f+.16*Math.sin(Math.PI*f));
          }
          return [p[0],p[1]+.085,p[2]+.097,Math.abs(2*u-1)>.76?0x82939b:0xe5eeea,.92+.09*Math.sin(t*21+u*7)];
        });
      }
    }
    function shoreY(x,z){
      const [left,right]=bounds(z),side=x<left?left-x:x-right;
      return -.22+Math.max(0,Math.min(4,side))*.20+smooth(side/8)*(.75+.54*Math.cos(z*.37+x*.41));
    }
    // Mottled, weathered slabs form the basin and the gently rising banks.
    for(const side of [-1,1])rock.grid(33,51,(u,t)=>{
      const z=5.3+t*49,edge=bounds(z)[side>0?1:0],x=edge+side*(-1.0+u*26);
      const bare=u<.32+.17*Math.cos(z*.21);
      return [x,shoreY(x,z)+.045*Math.sin(x*1.53+z*1.1),z,bare?0xa99a8b:0x737851,.86+.12*Math.cos(x*.75+z*.68)];
    });
    water.grid(32,75,(u,t)=>{
      const z=6.15+t*47,[left,right]=bounds(z),x=left+(right-left)*u;
      const deep=smooth(Math.sin(Math.PI*u)*1.17),r=Math.round(171-47*deep),g=Math.round(153-28*deep),b=Math.round(107-19*deep);
      return [x,.21+.009*Math.sin(z*2.4+x*.72),z,r*65536+g*256+b,
        .93+.09*Math.sin(x*.49+z*.23)];
    });
    function slab(x,y,z,w,h,l,angle,seed){
      const c=Math.cos(angle),s=Math.sin(angle);
      rock.grid(15,5,(u,v)=>{
        const a=2*Math.PI*u,r=(1-v**1.8)*(.98+.14*Math.sin(4*a+seed)+.083*Math.cos(7*a+seed));
        const dx=w*r*Math.cos(a),dz=l*r*Math.sin(a),top=v>.42;
        return [x+dx*c+dz*s,y+h*(Math.min(1,v*2.15)*.84+.16*dx/w+.085*Math.cos(3*a+seed)*(1-v))-.13,z-dx*s+dz*c,
          top?0xb5a596:0x8b8076,.84+.14*Math.cos(a+seed)+.08*Math.sin(v*7+a*3)];
      });
    }
    for(const [x,y,z,w,h,l,a] of [[7.8,.15,10.4,3.8,2.24,4,.64],[9.6,.42,14.6,3.15,1.25,4.5,-.4],
      [6.85,-.1,18.1,1.3,.92,2.6,.18],[3.7,-.15,23.45,1.89,1.01,2.7,-.39],[-6.3,.04,17.1,2.5,.95,3.2,-.43],
      [-1.1,-.16,25.4,3.1,1.14,4.6,-.03],[-8.6,-.02,13.8,1.35,.65,1.7,.61],
      [-7.6,-.17,11,.96,.46,1.35,-.34],[9.4,-.07,28,1.7,.86,2.1,.32]])slab(x,y,z,w,h,l,a,k.random()*6.28);
    // Scale and exact joinery of the board are estimated from scene 6.
    const ax=6.70,az=18.90,bx=4.13,bz=22.46,dx=bx-ax,dz=bz-az,n=20;
    for(let j=0;j<n;j++){
      const t=(j+.5)/n;
      k.box(j%3?0xb29e85:0x9e8a76,ax+t*dx,.78+.034*t,az+t*dz,.7,.105,Math.hypot(dx,dz)/n-.011,Math.atan2(dx,dz));
    }
    for(const [x,y,z,w,h,l] of [[-6.1,.06,9.2,1.56,.43,1.10],[-7.8,-.04,10.2,.74,.41,.72],
      [-.3,-.03,11.4,.52,.37,.41],[.8,-.18,12.8,.41,.48,.38],[5.2,.04,9.2,1.02,.46,1.19],
      [7.9,.11,16.9,1.27,.79,1.47],[-7.3,.3,17.9,.71,.49,1.03],[-5.8,.07,12.9,.41,.45,.51]]){
      slab(x,y,z,w,h,l,k.random()*3.14,k.random()*6.28);
    }
    for(let j=0;j<150;j++){
      const x=(k.random()-.5)*64,z=-4-k.random()*46,h=3.3+k.random()*6.2;
      if(Math.abs(x-upperCentre(z))<9.4||Math.abs(x)<11&&z>-21)continue;
      rock.trees.push([x,top(x,z)-.16,z,h*.69,h,k.random()*6.28]);
    }
    for(let j=0;j<125;j++){
      const z=1+k.random()*53,[l,r]=bounds(z),side=j%2?1:-1;
      const x=(side>0?r:l)+side*(6.7+k.random()*13),h=3.4+5.7*k.random();
      if(z<9&&Math.abs(x)<15)continue;
      rock.trees.push([x,shoreY(x,z)-.21,z,h*.71,h,k.random()*6.28]);
    }
    for(let j=0;j<95;j++){
      const z=9+42*k.random(),side=j%2?1:-1,edge=bounds(z)[side>0?1:0];
      const x=edge+side*(.2+5.4*k.random()),h=.30+.40*k.random();
      tuft(x,shoreY(x,z)-.03,z,h);
    }
    for(let j=0;j<135;j++){
      const side=j%4?1:-1,x=side*(10.1+k.random()*13.4),t=k.random()*.95,p=point(x,t);
      tuft(x,p[1]-.09,p[2]+.12,.36+.64*k.random());
      if(j%5===0){
        const h=2.9+3.7*k.random();rock.trees.push([x,p[1]-.58,p[2]-.1,h*.82,h,k.random()*6.28]);
      }
    }
    // Pockets of grass grow in the sand against the emergent slabs, above
    // the summer waterline. Blades bend out from several neighbouring tufts.
    function tuft(x,y,z,h){
      for(let i=0;i<9;i++){
        const a=k.random()*Math.PI*2,c=Math.cos(a),s=Math.sin(a),l=h*(.43+.72*k.random());
        const foot=.10*k.random(),lean=.3+.56*k.random(),w=.025+.022*k.random();
        grass.grid(1,2,(u,t)=>{
          const r=foot+lean*l*t*t,side=(2*u-1)*w*(1-.97*t);
          return [x+c*r+s*side,y+.87*l*t,z+s*r-c*side,t>.64?0x9aa94d:0x648742,.76+.35*t];
        });
      }
    }
    for(const [cx,cy,cz,n] of [[-7.6,.37,16.6,13],[-7.2,.31,14.8,8],[8.0,.45,15.9,11],
      [-1.55,.89,24.6,17],[1.3,.72,24.4,6],[3.25,.78,23.6,6],[8.0,.3,17.76,9],
      [-6.7,.17,12.4,7],[10.9,1.11,12.3,12],[-10.8,.37,10.5,10]]){
      for(let i=0;i<n;i++)tuft(cx+(k.random()-.5)*1.65,cy,cz+(k.random()-.5)*1.55,.26+.45*k.random());
    }
    grass.add(k.group,new T.MeshLambertMaterial({vertexColors:true}));
    const size=64,noiseData=new Uint8Array(size*size*4);
    for(let i=0;i<noiseData.length;i+=4){
      noiseData[i]=noiseData[i+1]=noiseData[i+2]=Math.floor(255*k.random());noiseData[i+3]=255;
    }
    const noise=new T.DataTexture(noiseData,size,size,T.RGBAFormat);
    noise.wrapS=noise.wrapT=T.RepeatWrapping;noise.magFilter=T.LinearFilter;noise.generateMipmaps=true;
    noise.minFilter=T.LinearMipmapLinearFilter;noise.needsUpdate=true;
    const reach=new T.MeshPhongMaterial({vertexColors:true,shininess:16,specular:0x33372a});
    const film=new T.MeshPhongMaterial({vertexColors:true,shininess:31,specular:0x738d94,transparent:true,depthWrite:false});
    film.addEventListener('dispose',()=>noise.dispose());
    const clock={value:0};
    for(const [material,flow] of [[reach,false],[film,true]]){
      material.customProgramCacheKey=()=>flow?'cay-du-summer-film':'cay-du-stream-pool';
      material.onBeforeCompile=shader=>{
        shader.uniforms.brookTime=clock;shader.uniforms.streamNoise={value:noise};
        shader.vertexShader='varying vec3 brookP;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbrookP=position;');
        const wave=flow?`vec2 p=vec2(brookP.x,brookP.y+brookTime*3.);
          float eddy=brookNoise(p*vec2(1.6,.7));
          float spray=brookNoise(p*vec2(21.,6.1)+2.1*eddy);
          float thread=brookNoise(p*vec2(9.1,2.83)+vec2(2.6*eddy,.7));
          diffuseColor.rgb*=.40+.69*spray+.16*thread;
          diffuseColor.a*=.08+.86*smoothstep(.31,.68,.64*thread+.36*spray);`:
          `vec2 p=brookP.xz;float n=brookNoise(p*vec2(.90,.17)-vec2(0.,brookTime*.37));
          float ripple=brookNoise(p*vec2(3.2,7.1)+2.4*n-vec2(.15,1.3)*brookTime);
          diffuseColor.rgb*=.82+.23*n+.14*ripple;
          diffuseColor.rgb+=vec3(.13,.14,.11)*smoothstep(.66,.94,ripple)*smoothstep(.40,.75,n);`;
        shader.fragmentShader='uniform float brookTime; uniform sampler2D streamNoise; varying vec3 brookP; float brookNoise(vec2 p){return texture2D(streamNoise,(p+.5)/64.).r;}\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+wave);
      };
    }
    water.add(k.group,reach);k.group.children.at(-1).castShadow=false;
    streams.add(k.group,film);k.group.children.at(-1).onBeforeRender=()=>clock.value=(performance.now()*.001)%256;
    K.finish(T,k,rock,(ground,x,z)=>{
      const edge=Math.max(smooth((Math.abs(x)-13)/18),smooth((-z-24)/30),smooth((z-30)/25));
      const datum=ground(12,6);
      return datum+edge*(ground(x,z)-datum);
    });
    const bedrock=k.group.children.find(m=>m.material?.customProgramCacheKey?.()==='weathered-granite')?.material;
    if(bedrock){
      const prepare=bedrock.onBeforeCompile;bedrock.customProgramCacheKey=()=>'cay-du-weathered-shelves';
      bedrock.onBeforeCompile=shader=>{
        prepare(shader);
        shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          vec2 slabUV=vec2(rockPoint.x*.41+rockPoint.y*.09,rockPoint.y*.62-rockPoint.x*.07+rockPoint.z*.23);
          slabUV+=.060*vec2(sin(rockPoint.x*2.4+rockPoint.y*2.8),cos(rockPoint.x+rockPoint.z*2.6));
          vec2 cell=floor(slabUV),q=fract(slabUV);float first=8.,second=8.;
          for(int a=-1;a<=1;a++)for(int b=-1;b<=1;b++){
            vec2 d=vec2(float(a),float(b)),h=cell+d;
            vec2 j=.5+.39*sin(vec2(dot(h,vec2(2.03,1.74)),dot(h,vec2(1.67,3.34)))*13.51);
            float r=length(d+j-q);
            if(r<first){second=first;first=r;}else{second=min(second,r);}
          }
          float joint=1.-smoothstep(.006,.029+fwidth(second-first),second-first);
          float broken=.51+.49*sin(rockPoint.y*.72+rockPoint.x*.4+sin(rockPoint.z*1.18));
          diffuseColor.rgb*=1.-joint*.39*broken;
          diffuseColor.rgb*=.91+.12*sin(5.5*first+rockPoint.z*.72)*broken;`);
      };
    }
  }
  function view(name,x,z,eyeX,eyeZ,focus,eyeY,fov,description){
    const dx=eyeX-x,dz=eyeZ-z,up=eyeY-focus,c=Math.cos(yaw),s=Math.sin(yaw);
    return {name,offset:[x*c+z*s,-x*s+z*c],height:focus/.46,viewAngle:yaw+Math.atan2(dx,dz),
      viewRadius:Math.hypot(dx,dz,up),viewElevation:Math.atan2(up,Math.hypot(dx,dz)),viewFov:fov,viewBase:'monument',description};
  }
  (window.VietnamSights??=[]).push({...stop,id,catalogId,lon,lat,yaw,lookout:{lon,lat,kind:'Thác nước'},
    name:'Thác Cây Đu',kind:'Thác nước',locality:'Bình Nông, Xuân Thọ',source,photo:tour,scan:tour,
    map:'https://www.openstreetmap.org/node/5841472185',width:64,depth:108,gardenRadius:46,solids:[],foundationAt:[12,6],
    reserve:(x,z,p=0)=>Math.abs(x)<32+p&&z>-54-p&&z<49+p,
    start:[109.17807246,13.48849790],mappedEntrance:true,visitOnArrival:true,
    arrivalNote:'Xe dừng trên ĐT.644 cạnh lối rẽ vào vườn. Từ đây đi bộ khoảng 200 m, qua bậc xuống suối rồi men bờ đá tới chân thác.',
    description:'Suối chảy từ vũng phía tây qua hai gờ vách xuống vũng nước phía đông. Vị trí vách đối chiếu theo ảnh vệ tinh; độ cao khoảng 15 m và hình dáng từng phiến đá là ước lượng. Hai dòng nhỏ theo ảnh toàn cảnh ngày 22/6/2025. Lượng nước thay đổi theo mùa.',
    views:[view('Hai gờ thác từ bờ đá',-.45,1.85,-4.1,24.65,6.8,3.65,59,'Từ bờ đá hạ lưu nhìn ngược dòng qua vũng nước. Hai vệt nước mảnh tách nhau ở đỉnh rồi đổi hướng khi gặp những gờ đá nhô ra.'),
      view('Những khe ướt trên vách đá',-1.05,2.3,7.9,19.6,7.35,3.0,54,'Từ phía tấm ván bắc qua dòng hẹp, nhìn chéo lên các rãnh đá sẫm màu. Dải đá ngang thứ hai nhô ra trên một hốc tối.'),
      view('Tấm ván ở lối thoát của vũng nước',5.54,20.58,.67,23.82,1.0,2.92,65,'Từ phiến đá nhô ra ở bờ đông, nhìn sang tấm ván thấp nối hai bờ đá. Cỏ mọc trong các khe sát mặt nước.')],build});
})();
