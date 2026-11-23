'use strict';
(()=>{
  const id='thac-dambri',catalogId='osm-node-3093994368';
  const stop=window.VietnamTourism.byId.get(catalogId),K=window.VietnamKarst;
  const source='https://www.dambri.com.vn/vi/tin-tuc/tin-tuc-damb-ri/mot-ngay-o-khu-du-lich-thac-dambri-381.html';
  const photo='https://commons.wikimedia.org/wiki/File:Dambri_Waterfall_1.jpg';
  // Both aerial surveys locate the crest some 18 m west of the OSM waterfall
  // node, on Suối Đạ M’Bri w352915740. Local +z follows the downstream reach.
  // https://www.google.com/maps/@11.642035,107.74275,221m/data=!3m1!1e3
  // https://www.arcgis.com/apps/mapviewer/index.html?basemap=satellite&center=107.74275,11.642035&level=18
  // https://www.openstreetmap.org/way/352915740
  // The operator gives 60 m height and 30 m width. Its photo shows a detached
  // northern strand, the undercut ledge, a lower spill over boulders and the
  // curving pedestrian bridge. Flow and the exact rock profiles are seasonal.
  // https://www.dambri.com.vn/uploads/news/2023_01/thac-dambri-1.jpg
  // https://www.dambri.com.vn/uploads/uu-dai-dac-biet/dambri-2026-trifold-brochure-mat-sau.jpg
  const lon=107.74275,lat=11.642035,yaw=-1.43,cs=Math.cos(yaw),sn=Math.sin(yaw);
  const smooth=t=>{t=Math.min(1,Math.max(0,t));return t*t*(3-2*t);};
  const offset=(x,z)=>[x*cs+z*sn,-x*sn+z*cs];
  function view(name,x,z,height,radius,a,e,description){
    return {name,offset:offset(x,z),height,viewRadius:radius,viewAngle:yaw+a,viewElevation:e,
      viewFov:62,viewBase:'monument',description};
  }
  function crest(x){
    return 1.2*Math.sin(x*.15)+.52*Math.sin(x*.51)+Math.max(0,Math.abs(x)-12)*.32;
  }
  function span(x){return 1-smooth((Math.abs(x)-33)/36);}
  function rimHeight(x){return (50.8+1.2*Math.cos(x*.13)-.65*Math.cos(x*.38))*span(x);}
  function top(x,z){
    return rimHeight(x)*(1-smooth((crest(x)-z-27)/52));
  }
  function riverX(z){
    if(z<0)return Math.min(39,-z*.90);
    if(z<38)return 1.8*Math.sin(z*.058)-.38+1.3*Math.sin(z*.019);
    if(z<68)return 2.1-2.99*(z-38)/30;
    return -.89-15.98*smooth((z-68)/22)-4.07*smooth((z-90)/17);
  }
  function stoneFace(x,t){
    const rough=.8*Math.sin(x*.27+t*6)+.43*Math.cos(x*.74-t*7);
    const tilted=t-.025*Math.sin(x*.108)-.008*x/4;
    const shelf=2.4*Math.exp(-(((tilted-.77)/.046)**2))+1.6*Math.exp(-(((tilted-.63)/.028)**2))+
      1.2*Math.exp(-(((tilted-.28)/.04)**2));
    const cave=4.5*Math.sin(Math.PI*t)**2+.8*Math.sin(t*18);
    return crest(x)+3.7*(1-t)**2-cave+(rough+shelf)*Math.sin(Math.PI*t);
  }
  function waterFinish(T,clock,noise,falling){
    const mat=new T.MeshPhongMaterial({vertexColors:true,shininess:falling?18:23,specular:falling?0x667473:0x303e3c,side:T.DoubleSide});
    mat.customProgramCacheKey=()=>falling?'dambri-falling-water':'dambri-outflow';
    mat.onBeforeCompile=s=>{
      s.uniforms.dambriTime=clock;
      s.uniforms.dambriNoiseMap={value:noise};
      s.vertexShader='varying vec3 dambriPoint;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ndambriPoint=position;');
      s.fragmentShader=`uniform float dambriTime; uniform sampler2D dambriNoiseMap; varying vec3 dambriPoint;
        float dambriNoise(vec2 p){return texture2D(dambriNoiseMap,(p+.5)/128.).r;}
        `+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+(falling?`
          vec2 p=vec2(dambriPoint.x,dambriPoint.y+dambriTime*8.7);
          float w=dambriNoise(p*vec2(.43,.10));
          float sh=dambriNoise(p*vec2(2.5,.64)+w*1.75);
          float fine=dambriNoise(p*vec2(4.7,1.4)+w*1.5);
          diffuseColor.rgb*=.53+.41*w+.34*sh+.15*fine;
          diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.88,.94,.94),smoothstep(.55,.82,sh)*.44);
        `:`
          vec2 p=dambriPoint.xz;float n=dambriNoise(p*vec2(.27,.83)-vec2(0,dambriTime*.96));
          float fine=dambriNoise(p*vec2(2.4,4.3)+1.3*n-vec2(dambriTime*.15,dambriTime*1.7));
          float wisp=smoothstep(.74,.96,fine)*smoothstep(.44,.72,n);
          diffuseColor.rgb*=.69+.26*n+.32*fine;
          diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.45,.48,.42),wisp*.53);
        `));
      if(falling)s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',
        'float skyFill=clamp(6.*length(reflectedLight.indirectDiffuse)+2.*length(reflectedLight.directDiffuse),0.,1.);\noutgoingLight+=diffuseColor.rgb*(.04+skyFill*.63);\n#include <opaque_fragment>');
    };
    return mat;
  }
  function build(T,k){
    const rock=K.batch(T),fall=K.batch(T),reach=K.batch(T),clock={value:0};
    // A small repeatable scalar field works on mobile GPUs with mediump
    // precision. Use the same thread of noise for the spray and water.
    const noiseData=new Uint8Array(128*128*4),noise=new T.DataTexture(noiseData,128,128,T.RGBAFormat);
    for(let i=0;i<noiseData.length;i+=4){
      noiseData[i]=noiseData[i+1]=noiseData[i+2]=Math.floor(255*k.random());noiseData[i+3]=255;
    }
    noise.wrapS=noise.wrapT=T.RepeatWrapping;noise.magFilter=T.LinearFilter;
    noise.generateMipmaps=true;noise.minFilter=T.LinearMipmapLinearFilter;noise.needsUpdate=true;
    const fallingFinish=waterFinish(T,clock,noise,true),poolFinish=waterFinish(T,clock,noise,false);
    fallingFinish.addEventListener('dispose',()=>noise.dispose());
    rock.grid(92,36,(u,t)=>{
      const x=(u*2-1)*67,z=stoneFace(x,t),y=-1+(rimHeight(x)+1)*t;
      const beds=stoneFace(x,t)-crest(x);
      const bedding=.47+.22*Math.cos(t*39+x*.06+.97*Math.sin(x*.17))+.15*Math.sin(x*.25+t*11)+.16*Math.sin(x*.83+t*75);
      const wet=Math.exp(-Math.abs(x)/25),green=t<.55?.56+.44*Math.sin(x*.25+z*.45+y*.21):0;
      const tint=green>.74?0x647450:wet>.56?0x5e655a:beds< -4.5?0x5f5945:bedding>.75?0x988972:0x827761;
      return [x,y,z,tint,.71+.23*bedding+.10*Math.cos(x*.77+y*.41)];
    });
    rock.grid(80,39,(u,t)=>{
      const x=(u*2-1)*67,z=crest(x)-80*t,dist=Math.abs(x-riverX(z));
      const cover=smooth((dist-12)/9);
      return [x,top(x,z)-.11+.28*cover*Math.cos(x*.37+z*.19),z,
        cover>.32?0x626b46:0x77705c,.78+.19*Math.sin(x*.31+z*.22)];
    });
    // Two main sheets emerge at the same lip; the thinner northern strand
    // stays detached. Fine vertical rivulets vary in width as the flow falls.
    for(const [left,right] of [[-14.8,-10.1],[-9.0,13.8]]){
      fall.grid(Math.ceil((right-left)*2),72,(u,t)=>{
        const x=left+(right-left)*u,edge=2*u-1;
        const side=x+edge*t*t*(1.65+.57*Math.cos(t*15+x*.14))+.25*Math.sin(x*.38+t*8)*t;
        const turbulence=.37*Math.sin(x*1.3+1.13*Math.sin(t*6+x*.29))+.24*Math.cos(x*2.2+t*8);
        const z=crest(x)+1.59+5.3*t+.57*Math.sin(t*5+x*.17)*t+turbulence*(.22+t*.54);
        const y=(rimHeight(x)-.16)*(1-t)+1.52*t;
        const seam=.55+.32*Math.cos(x*1.04+.65*Math.sin(t*8+x*.22))+.13*Math.cos(x*2.29);
        return [side,y,z,seam>.52?0xe1ece6:seam>.28?0xc4d6d1:0xa1b6af,.92+.07*Math.sin(t*11+x*.62)];
      });
    }
    rock.grid(15,7,(u,t)=>{
      const a=2*Math.PI*u,r=Math.cos(Math.PI*.5*t)*(1+.09*Math.sin(3*a));
      const x=-9.56+r*.80*Math.cos(a),z=crest(-9.56)-.55+1.53*r*Math.sin(a);
      return [x,top(x,z)+.09+.58*Math.sin(Math.PI*.5*t),z,t>.72?0x686d4e:0x59594d,.85+.12*Math.sin(a)];
    });
    // One continuous upper pool wraps over the irregular lip. The shallow
    // rock shelves close its banks on the perched rim of the coarse terrain.
    function upper(t,side,extra=0){
      const s=-41+41*t,c=riverX(s)*smooth((-s-2)/16)-.5;
      const half=9.6+4.7*smooth(t/.70),x=c+side*(half+extra);
      const z=s+(crest(x)+1.64)*smooth((t-.70)/.30);
      return [x,z];
    }
    reach.grid(56,62,(u,t)=>{
      const [x,z]=upper(t,2*u-1),round=smooth((z-crest(x)+1.15)/2.79);
      const y=top(x,z)+.48-.63*round**2+.05*Math.cos(x*1.31+z*.22);
      const broken=z>crest(x)+.20+.68*Math.sin(x*1.11);
      return [x,y,z,broken?0xc7d6cd:round>.22?0x829f91:0x59756b,.93+.07*Math.sin(u*15+z*.3)];
    });
    for(const side of [-1,1])rock.grid(8,52,(u,t)=>{
      const [x,z]=upper(t,side,-.49+u*(4.05+.65*Math.sin(t*19+side)));
      const y=top(x,z)+.14+1.18*Math.sin(u*Math.PI)-u*.61+.10*Math.sin(z*.73+side);
      return [x,y,z,u<.48?0x737767:0x6b7652,.86+.13*Math.cos(x*.49+z*.39)];
    });
    function bed(z){
      return z<27?1.5:1.5-1.28*smooth((z-27)/8)-2.35*smooth((z-88)/15);
    }
    function bankWidth(z){
      return (9.2+10.7*Math.exp(-(((z-16)/14)**2))+3.4*Math.sin((z-4)*.15)**2)*(1-.92*smooth((z-78)/25));
    }
    reach.grid(42,74,(u,t)=>{
      const z=4+99*t,c=riverX(z),a=2*u-1,w=bankWidth(z);
      const x=c+a*w*(1+.07*Math.sin(z*.32+a*3));
      const broken=(z<18||z>27&&z<36)&&Math.cos(x*.84+.8*Math.sin(z*.73))+.41*Math.sin(z*.71)>.03;
      const wash=z<17&&Math.abs(a)<.82||z>28&&z<35&&Math.abs(a)<.72;
      return [x,bed(z)+.09*Math.sin(x*.94+z*.65),z,
        wash?(broken?0xd5e4da:0x91aea0):broken?0x899b89:0x4a5b4d,.9+.11*Math.cos(x*.36+z*.65)];
    });
    for(const side of [-1,1])rock.grid(6,70,(u,t)=>{
      const z=5+95*t,width=bankWidth(z)*(1+.07*Math.sin(z*.32+side*3));
      const x=riverX(z)+side*(width-.7+u*4.8);
      const toe=(1-smooth(u))*Math.max(.0,bed(z));
      const y=toe-.36+1.06*Math.sin(u*Math.PI)-1.4*u*u;
      return [x,y,z,u<.42?0x746f60:u<.72?0x768064:0x63754f,.78+.17*Math.cos(z*.65+u*4.8)];
    });
    for(let i=0;i<35;i++){
      const z0=9+k.random()*28,x0=(k.random()-.5)*(z0<24?24:14),run=.6+k.random()*1.65,phase=k.random()*6.3;
      reach.grid(2,9,(u,t)=>{
        const z=z0+run*t,x=x0+Math.sin(t*2.1+phase)*.26+(u-.5)*(.03+.09*Math.sin(t*Math.PI));
        return [x,bed(z)+.14+.09*Math.sin(x*.94+z*.65),z,i%5?0x9aab9a:0xbfc8bc,.90];
      });
    }
    // Wet boulders lining the plunge pool and the second, lower rock shelf.
    for(let i=0;i<59;i++){
      const z=i<17?27+4*k.random():5+74*k.random(),a=i%2?1:-1;
      const x=i<17?(k.random()-.5)*30:riverX(z)+a*(10.4+10*Math.exp(-(((z-17)/16)**2))+2.5*k.random());
      const size=.75+2.7*k.random(),seed=k.random()*7;
      rock.grid(10,4,(u,t)=>{
        const angle=u*2*Math.PI,r=Math.cos(t*Math.PI*.5)*(1+.14*Math.cos(3*angle+seed)+.06*Math.cos(6*angle));
        return [x+size*r*Math.cos(angle),-.24+size*.66*Math.sin(t*Math.PI*.5),z+size*.8*r*Math.sin(angle),
          t>.66&&i%4!==0?0x75804b:0x66675b,.77+.15*t+.09*Math.cos(angle+seed)];
      });
    }
    // Both surveyed ways share n3094058852. Preserve the junction and all
    // three arms. The ground-level photograph resolves the irregular rails.
    // https://www.openstreetmap.org/way/304804673
    // https://www.openstreetmap.org/way/304804674
    // https://www.dambri.com.vn/uploads/news/2023_01/mung5.17.jpg
    const joint=[2.27,67.11];
    const arms=[[[-9.80,55.45],[-7.44,58.86],[-5.95,61.68],[-1.84,64.39],joint],
      [[11.53,65.23],[7.71,67.16],joint],
      [[-14.59,67.55],[-14.92,73.19],[-6.52,74.02],[-.04,69.98],joint]];
    const strut=(col,a,b,r)=>window.CentralArch.strut(T,k,col,...a,...b,r);
    const old=0x68614e;
    for(const arm of arms)for(let j=1;j<arm.length;j++){
      const a=arm[j-1],b=arm[j],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      const fx=(b[0]-a[0])/length,fz=(b[1]-a[1])/length,steps=Math.ceil(length/1.85);
      const point=(t,side)=>[a[0]+(b[0]-a[0])*t+fz*side,1.38+.24*Math.sin((j-1+t)/(arm.length-1)*Math.PI),
        a[1]+(b[1]-a[1])*t-fx*side];
      const [mx,my,mz]=point(.5,0);
      k.box(0x88806c,mx,my-.16,mz,1.54,.33,length+.31,Math.atan2(fx,fz));
      k.box(0x716c5b,a[0],.27,a[1],1.05,2.06,.51,Math.atan2(fx,fz));
      for(let i=0;i<steps;i++)for(const side of [-1,1]){
        const p=point(i/steps,side*.74),q=point((i+1)/steps,side*.74);
        const high=[p[0]+.055*Math.cos(j*2+i),p[1]+1.01,p[2]];
        strut(old,p,high,.085);
        if(j===arm.length-1&&i===steps-1)continue;
        strut(i%3?0x716c54:0x6f7651,high,[q[0],q[1]+.96,q[2]],.076);
        if((j+i)%2===0)strut(old,[p[0],p[1]+.25,p[2]],[q[0],q[1]+.88,q[2]],.05);
      }
    }
    k.box(0x88806c,joint[0],1.20,joint[1],2.35,.40,2.18,.18);
    // Trees follow the forested rock rim and both banks; leave the plunge
    // pool, the photographed gap above the lip and both bridge ends open.
    for(let i=0;i<178;i++){
      const x=(k.random()-.5)*128,z=crest(x)-k.random()*72;
      const v=Math.max(0,Math.min(1,((x+16)*13+(z+12)*17)/(13**2+17**2)));
      if(Math.abs(x-riverX(z))<16.6||Math.hypot(x+16-13*v,z+12-17*v)<12.6)continue;
      const h=7.8+8.7*k.random();rock.trees.push([x,top(x,z)-.23,z,h*(.63+.16*k.random()),h,6.28*k.random()]);
    }
    for(let i=0;i<78;i++){
      const z=3+85*k.random(),x=(i%2?1:-1)*(26+19*k.random()),h=6+8*k.random();
      rock.trees.push([x,-.25,z,h*.70,h,k.random()*6.28]);
    }
    for(let i=0;i<130;i++){
      const side=i%2?1:-1,x=side*(15.7+41*k.random()),t=.08+.91*k.random(),z=stoneFace(x,t)+.82;
      const y=(rimHeight(x)+1)*t-1;
      if(i%3===0||t>.86){
        const h=2.5+4.8*k.random();rock.trees.push([x,y-.7,z,h*.82,h,k.random()*6.28]);
      }
    }
    for(let i=0;i<36;i++){
      const z=9+74*k.random(),side=i%2?1:-1,x=riverX(z)+side*(13+6*k.random()+8*Math.exp(-(((z-16)/14)**2)));
      rock.ferns.push([x,.12,z,.5+.67*k.random(),k.random()*6.28]);
    }
    fall.add(k.group,fallingFinish);const moving=k.group.children.at(-1);
    moving.castShadow=moving.receiveShadow=false;moving.onBeforeRender=()=>{clock.value=performance.now()*.001%512;};
    reach.add(k.group,poolFinish);k.group.children.at(-1).castShadow=false;
    // Feathered spray at the collision zone leaves the ledge visible.
    const spray=new T.MeshBasicMaterial({color:0xd5e1de,transparent:true,opacity:.36,depthWrite:false,side:T.DoubleSide});
    spray.onBeforeCompile=s=>{
      s.uniforms.dambriTime=clock;
      s.vertexShader='varying vec2 mistUV;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nmistUV=uv;');
      s.fragmentShader='uniform float dambriTime; varying vec2 mistUV;\n'+s.fragmentShader.replace('#include <color_fragment>',
        `#include <color_fragment>
        vec2 p=(mistUV-vec2(.5,.31))*vec2(2.05,2.6);
        float w=.93+.12*sin(p.x*8.+dambriTime*.43)+.09*cos(6.*p.y-p.x*2.+dambriTime*.35);
        diffuseColor.a*=1.-smoothstep(.19,w,length(p));`);
    };
    for(const [x,y,z,w,h] of [[-5,7.3,12,30,17],[4.3,5.7,16,27,13]]){
      const puff=new T.Mesh(new T.PlaneGeometry(w,h,6,3),spray);puff.position.set(x,y,z);k.group.add(puff);
    }
    K.finish(T,k,rock,(ground,x,z)=>{
      const c=riverX(z),blend=smooth((Math.abs(x-c)-13)/21);
      const lift=ground(c,z),edge=blend*(z<4?.38:1);
      return lift+(ground(x,z)-lift)*edge;
    });
  }
  (window.VietnamSights??=[]).push({...stop,id,catalogId,lon,lat,yaw,kind:'Thác nước',locality:'Bảo Lộc',
    width:135,depth:165,gardenRadius:70,solids:[],reserve:(x,z,p)=>Math.abs(x)<57+p&&z>-68-p&&z<82+p,
    foundationAt:[0,60],source,photo,map:'https://www.openstreetmap.org/node/3093994368',
    start:[107.7445308,11.6412412],mappedEntrance:true,visitOnArrival:true,
    arrivalNote:'Xe trong trò chơi dừng tại đầu đường vào Khu du lịch Đambri. Ngoài thực địa, đường nội bộ dẫn tới các bãi đỗ. Từ đó du khách đi bộ rồi xuống chân thác bằng bậc đá hoặc thang máy.',
    description:'Suối Đạ M’Bri đổ qua gờ đá rộng khoảng 30 m xuống vực sâu khoảng 60 m, rồi tràn qua một bậc đá thấp. Vị trí gờ thác và cầu hạ lưu theo ảnh vệ tinh và bản đồ. Lưu lượng, mặt vách và tán rừng được mô phỏng.',
    views:[view('Từ cầu hạ lưu nhìn lên thác',0,3,65,69,0,-.395,
      'Nhìn từ phía cầu đi bộ lên màn nước chính. Dưới chân vách, nước cuộn lại rồi tràn qua bậc đá thấp.'),
      view('Mép thác từ phía thang máy',-3,5,109,29,-2.48,.79,
        'Góc trên cao đặt về phía điểm ngắm bên thang máy. Dòng suối từ phía đông đổi hướng tại gờ đá trước khi đổ xuống vực.'),
      view('Ba nhánh cầu chữ Y dưới chân thác',0,66,7.6,31,-1.54,.635,
        'Từ lối đi bên bờ bắc, nhìn xuống ba nhánh cầu gặp nhau trên suối. Hai đường cầu được đặt theo các nút của bản đồ đi bộ.')],build});
})();
