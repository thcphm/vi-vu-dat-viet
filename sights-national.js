'use strict';
(()=>{
  const atlas=new Map(VietnamTourism.entries.map(s=>[s.id,s]));
  function stop(id,catalogId,details,build){
    const site=atlas.get(catalogId);
    (window.VietnamSights??=[]).push({...site,id,catalogId,approachMeters:undefined,...details,build});
  }
  const textures=new Map();
  function texture(T,file,colour=false){
    if(!textures.has(file)){
      const map=new T.TextureLoader().load('streetscape/'+file);
      map.wrapS=map.wrapT=T.RepeatWrapping;map.userData.sightShared=true;
      if(colour)map.colorSpace=T.SRGBColorSpace;textures.set(file,map);
    }
    return textures.get(file);
  }
  function rockMaterial(T){
    const m=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.89,
      map:texture(T,'surfaces/cut-rock-color.webp',true),normalMap:texture(T,'surfaces/cut-rock-normal.webp'),normalScale:new T.Vector2(.78,.78)});
    // Use the relief of the rock scan while retaining the local lithology's colour.
    m.onBeforeCompile=s=>{
      s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`
        vec3 scan=texture2D(map,vMapUv).rgb;
        diffuseColor.rgb*=clamp(.47+3.3*dot(scan,vec3(.21,.72,.07)),.50,1.38);`);
    };
    return m;
  }
  function trees(T,group,stems){
    createTreeModels(T).grove(group,stems.map(([x,y,z,h,a])=>[x,y,z,h,h,a]));
  }
  // Stratified limestone or volcanic banks, with trees rooted in the surface samples.
  function outcrop(T,{group,random},cx,cz,w,d,h,forested,stems,base=-3){
    const p=[],uv=[],colors=[],idx=[],tint=new T.Color(),n=35,rows=9,seed=random()*10;
    for(let j=0;j<=rows;j++)for(let i=0;i<=n;i++){
      const a=i/n*Math.PI*2,t=j/rows,shape=1+.09*Math.cos(a*3+seed)+.06*Math.sin(a*5-seed)+.04*Math.cos(a*9);
      const radius=(1-Math.pow(t,2.8))*(1+.034*Math.sin(j*4.1+a*5));
      const x=cx+w*radius*shape*Math.cos(a),z=cz+d*radius*shape*Math.sin(a);
      const y=base+h*(t+.087*Math.sin(a*4+seed)*Math.sin(Math.PI*t)+.035*Math.cos(a*11+t*5)*Math.sin(Math.PI*t));
      p.push(x,y,z);uv.push(a*(w+d)*.18,y*.26);
      const growth=forested&&(t>.61+.12*Math.sin(a*4)||t>.23&&Math.cos(a*5+seed)>.61);
      tint.setHex(growth?0x738351:0xb3ad94).multiplyScalar(.83+.14*Math.sin(j*2.4+a*3)+.08*Math.sin(i*1.9));
      colors.push(tint.r,tint.g,tint.b);
      if(i&&j){const k=j*(n+1)+i;idx.push(k-n-2,k-1,k-n-1,k-n-1,k-1,k);}
      if(i<n&&j<rows&&growth&&random()<.20)stems.push([x,y-.8,z,3.3+random()*5.8,a]);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(idx);g.computeVertexNormals();
    const m=new T.Mesh(g,rockMaterial(T));m.castShadow=m.receiveShadow=true;group.add(m);
  }

  // All coordinates below are metres. Local +Z is downstream or towards the façade.
  // Each terrace has a dark exposed face, a ledge, and separated runs of falling water.
  function cascade(T,{group,stamp,random},span,height,tiers,ledge,limestone){
    const rock=[],water=[],uv=[],colours=[],foam=[],foamUV=[],tint=new T.Color();
    const widthAt=t=>span*(1-.16*t);
    function vertex(x,t,lip){
      const n=x/span,bend=limestone?11:6;
      const z=(.49-t)*tiers*ledge+bend*Math.sin(n*8+t*1.5)+3.6*Math.sin(n*17-t*.9)+.65*Math.sin(x*1.3+t);
      const crown=limestone?.74+.26*Math.sin(n*6.2+1.2):.95+.05*Math.sin(n*8);
      return [x,(height*crown+1.85*Math.sin(n*12.4+.7)+.72*Math.sin(n*28+t*5))*t,z+(lip?0:-ledge*.72)];
    }
    function rockQuad(a,b,c,d,colour){
      tint.setHex(colour).multiplyScalar(.86+.21*random());
      for(const p of [a,c,b,b,c,d]){rock.push(...p);colours.push(tint.r,tint.g,tint.b);}
    }
    function sheet(a,b,c,d,u,v,length){
      water.push(...a,...c,...b,...b,...c,...d);
      uv.push(u,v,u,v-length,u+1,v,u+1,v,u,v-length,u+1,v-length);
    }
    const slabs=limestone?[0xa4ac85,0x959d78,0xb5b19c]:[0x9a8f82,0xa89b89,0x918778];
    for(let j=0;j<tiers;j++){
      const top=(tiers-j)/tiers,low=(tiers-j-1)/tiers,w=widthAt(top),count=Math.ceil(w/1.65);
      for(let i=0;i<count;i++){
        const a=(i/count-.5)*w,b=((i+1)/count-.5)*w;
        const p=vertex(a,top,true),q=vertex(b,top,true),r=vertex(a,low,false),s=vertex(b,low,false);
        const back=p.map((v,k)=>k===2?v-ledge-2:v),back2=q.map((v,k)=>k===2?v-ledge-2:v);
        rockQuad(p,q,r,s,slabs[i%3]);rockQuad(back,back2,p,q,slabs[(j+1)%3]);
        const runoff=Math.sin(a*.146+j*.36)+.86*Math.cos(a*.32-j*.42)+.45*Math.sin(a*.8);
        if(runoff<(tiers===1?-1.3:limestone?-.56:-.25)||limestone&&Math.abs(a+span*.16)<13+j*1.7)continue;
        const edge=[p,q].map(([x,y,z])=>[x,y+.22,z+.36]);
        const feet=[r,s].map(([x,y,z])=>[x,y+.27,z+1.02]);
        sheet(...edge,...feet,a*.6,p[1],height/tiers);
        sheet(...edge.map(([x,y,z])=>[x,y,z-2.2]),...edge,a*.6,p[1]+2.2,2.2);
        if(j<tiers-1){
          const next=[a,b].map(x=>{const [u,v,z]=vertex(x,low,true);return [u,v+.27,z+.44];});
          sheet(...feet,...next,a*.6,r[1],ledge*.8);
        }else{
          const front=[r,s].map(([x,,z])=>[x,.04,z+.75]),reach=[r,s].map(([x,,z])=>[x,-.12,z+5.1+1.6*Math.sin(x*.32)]);
          foam.push(...front[0],...reach[0],...front[1],...front[1],...reach[0],...reach[1]);
          foamUV.push(a,0,a,1,b,0,b,0,a,1,b,1);
        }
      }
    }
    function mesh(positions,attr,name,mat){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
      g.setAttribute(name,new T.Float32BufferAttribute(attr,name==='uv'?2:3));g.computeVertexNormals();
      const m=new T.Mesh(g,mat);m.receiveShadow=true;group.add(m);return m;
    }
    const cliff=mesh(rock,colours,'color',rockMaterial(T)),rockUV=[];
    for(let i=0;i<rock.length;i+=3)rockUV.push(rock[i]*.24,(rock[i+1]+rock[i+2]*.74)*.25);
    cliff.geometry.setAttribute('uv',new T.Float32BufferAttribute(rockUV,2));cliff.castShadow=true;
    const flow={value:0},surface=new T.MeshStandardMaterial({color:0xcadfdd,roughness:.33,side:T.DoubleSide,transparent:true,depthWrite:false});
    surface.onBeforeCompile=s=>{
      s.uniforms.fallTime=flow;
      s.vertexShader='varying vec2 fallsUV;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n fallsUV=uv;');
      s.fragmentShader=`uniform float fallTime; varying vec2 fallsUV;
        float hashFall(vec2 p){vec3 h=fract(p.xyx*.1031);h+=dot(h,h.yzx+33.33);return fract((h.x+h.y)*h.z);}
        float noiseFall(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hashFall(i),hashFall(i+vec2(1,0)),f.x),mix(hashFall(i+vec2(0,1)),hashFall(i+1.),f.x),f.y);}
      `+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 p=fallsUV;float t=fallTime;float drift=noiseFall(vec2(p.x*.5,p.y*.28+t*1.2));
        float veil=noiseFall(vec2(p.x*2.+drift,p.y*.11+t*1.2));
        float silk=noiseFall(vec2(p.x*7.+drift*2.,p.y*.45+t*3.));
        float foam=smoothstep(.17,.84,veil*.68+silk*.32);
        diffuseColor.rgb=mix(vec3(.28,.39,.36),vec3(.94,.97,.93),foam*.71+.24);
        diffuseColor.a=.35+.61*foam;`);
    };
    const curtain=mesh(water,uv,'uv',surface);
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    curtain.onBeforeRender=()=>{flow.value=motion.matches?0:performance.now()*.001%4000;};
    const froth=new T.MeshBasicMaterial({color:0xd0ded7,transparent:true,depthWrite:false,side:T.DoubleSide});
    froth.onBeforeCompile=s=>{
      s.uniforms.fallTime=flow;s.vertexShader='varying vec2 shoreFoam;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nshoreFoam=uv;');
      s.fragmentShader='uniform float fallTime;varying vec2 shoreFoam;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float swirl=sin(shoreFoam.x*2.3+shoreFoam.y*9.-fallTime*1.8+sin(shoreFoam.x*.64+fallTime*.4));
        float ripple=sin(shoreFoam.y*27.+swirl*2.-fallTime*2.);
        diffuseColor.a=(1.-smoothstep(.02,1.,shoreFoam.y))*(.19+.46*smoothstep(-.52,.7,ripple));`);
    };
    if(foam.length){const whitewater=mesh(foam,foamUV,'uv',froth);whitewater.renderOrder=1;}
    const toe=vertex(0,0,false)[2];
    const stems=[],kit={group,random};
    for(const side of [-1,1]){
      outcrop(T,kit,side*span*.48,-ledge*.22,span*.17,ledge*tiers*.78+5,height*.92,true,stems);
      outcrop(T,kit,side*span*.53,toe+1,span*.095,12,height*.31,true,stems);
    }
    if(limestone)outcrop(T,kit,-span*.16,1,span*.16,ledge*tiers*.76,height*.94,true,stems);
    for(let k=0;k<6;k++)outcrop(T,kit,(k/5-.5)*span,-tiers*ledge*.69-9,span*.19,18+random()*8,
      height*(.96+.18*random()),true,stems);
    trees(T,group,stems);
    const points=[],phases=[];
    for(let i=0;i<95;i++){
      const x=(random()-.5)*span*.94;
      points.push(x,.7+random()*1.6,vertex(x,0,false)[2]+random()*3);phases.push(random());
    }
    const mist=new T.BufferGeometry();mist.setAttribute('position',new T.Float32BufferAttribute(points,3));
    mist.setAttribute('phase',new T.Float32BufferAttribute(phases,1));mist.computeBoundingSphere();mist.boundingSphere.radius+=10;
    const spray=new T.Points(mist,new T.ShaderMaterial({uniforms:{t:flow},transparent:true,depthWrite:false,
      vertexShader:`attribute float phase;uniform float t;varying float alpha;
      void main(){float age=fract(t*.21+phase);vec3 p=position+vec3(sin(phase*63.+age*2.)*age*2.,age*4.,age*3.);
      vec4 eye=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*eye;
      gl_PointSize=clamp((3.+age*5.)*390./max(1.,-eye.z),1.,90.);alpha=.16*sin(age*3.14159);}`,
      fragmentShader:`varying float alpha;void main(){vec2 p=gl_PointCoord*2.-1.;float f=max(0.,1.-dot(p,p));
      gl_FragColor=vec4(.88,.95,.95,alpha*f*f); #include <colorspace_fragment>
      }`.replace('; #include',';\n#include')}));
    spray.renderOrder=2;group.add(spray);
  }
  stop('ban-gioc','osm-node-4759574761',{lon:106.7232,lat:22.8559,width:174,depth:100,yaw:1.28,viewElevation:.22,solids:[],kind:'Thác nước',
    photo:'https://vietnam.travel/vi/things-to-do/ban-gioc-waterfall-majestic-beauty-northern-border/',
    description:'Dòng Quây Sơn tách thành nhiều rèm nước giữa các bậc đá vôi. Bụi nước lan thấp trên vũng xanh dưới chân thác.'},
    (T,kit)=>cascade(T,kit,145,32,3,14,true));
  stop('pongour','osm-node-4961718824',{lon:108.26544,lat:11.6875,width:133,depth:100,yaw:-2.4,viewElevation:.24,
    solids:[],kind:'Thác nước',photo:'https://vietgoing.com/article/329-cac-diem-du-lich-o-huyen-duc-trong-lam-dong.html',
    description:'Bảy bậc đá rộng xòe ra phía lòng sông. Từng dòng nước mảnh tràn qua mép đá, để lộ những khoảng bazan sẫm màu.'},
    (T,kit)=>cascade(T,kit,107,32,7,6.7,false));
  stop('dray-nur','osm-node-5744397029',{width:145,depth:73,yaw:1.05,viewElevation:.18,solids:[],kind:'Thác nước',
    photo:'https://vhttdl.daklak.gov.vn/Articles/Detail/1435',
    description:'Nước sông Sêrêpốk đổ từ một vách đá dài. Những khoảng đá lộ giữa các dòng thác làm nổi bật màn sương ở chân vách.'},
    (T,kit)=>cascade(T,kit,118,27,1,13,false));

  function cave(T,kit){
    const {group,random,stamp,box}=kit,stems=[],p=[],c=[],uv=[],index=[],tint=new T.Color();
    // The river enters a low irregular opening. Build the ceiling continuously
    // through the mouth, then close the line of sight at the bend underground.
    const rings=[[-29,7,4.2],[-19,8.3,5],[-7,10.5,5.9],[2,11.8,7.1],[4,15,14],[0,20,22],[-6,25,26],[-21,30,25]];
    rings.forEach(([z,rx,ry],j)=>{
      for(let i=0;i<=54;i++){
        const a=i*Math.PI/54,k=j*55+i;
        const notch=.93+.065*Math.sin(a*7+j*.55)+.036*Math.cos(a*17+j*.32);
        const x=rx*Math.cos(a)*notch+(j<3?(3-j)*1.8:0),y=-1.4+ry*Math.sin(a)*notch;
        p.push(x,y,z+1.45*Math.sin(3*a)+.49*Math.sin(13*a+j));uv.push(x*.26,(y-z*.71)*.24);
        tint.setHex(j<4?0x9b9889:0xbabca8).multiplyScalar((j<4?.18+j*.18:1)*(.84+.15*Math.sin(a*15+j)));
        c.push(tint.r,tint.g,tint.b);if(j&&i)index.push(k-56,k-1,k-55,k-55,k-1,k);
        if(j>=6&&i%3===0)stems.push([x,y-.45,z,4+random()*4,a]);
      }
    });
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();const m=new T.Mesh(g,rockMaterial(T));m.castShadow=m.receiveShadow=true;group.add(m);
    box(0x1b201d,5,2,-29,20,7,2);
    for(const side of [-1,1]){
      outcrop(T,kit,side*23,-5,15,16,28,true,stems);outcrop(T,kit,side*37,-13,19,25,37,true,stems);
    }
    trees(T,group,stems);
    const boat=new T.SphereGeometry(1,20,8,0,Math.PI*2,Math.PI/2,Math.PI/2);
    for(const [x,z,a] of [[-3,16,.18],[5,28,-.22]]){
      stamp(boat,0x345f68,x,.72,z,.88,.63,5.3,a);
      for(const s of [-1,1])for(const v of [-2,2]){
        const dx=.72*s,dz=v;box(0x70563b,x+dx*Math.cos(a)+dz*Math.sin(a),1.35,z-dx*Math.sin(a)+dz*Math.cos(a),.08,1.4,.08,a);
      }
      box(0x39828c,x,2.05,z,1.85,.13,5.6,a);
    }
    boat.dispose();
  }
  stop('phong-nha','osm-node-3093700681',{width:102,depth:74,yaw:-2.94,viewElevation:.19,solids:[],gardenRadius:80,
    photo:'https://plo.vn/trai-nghiem-di-thuyen-10-km-ngam-ky-quan-de-nhat-dong-phong-nha-tien-son-post832221.html',
    description:'Thuyền theo sông Son vào cửa động thấp dưới vách đá vôi. Vòm đá thu dần vào bóng tối, phía trên là sườn núi phủ cây.'},cave);

  function palace(T,{palette, box,stamp,round,wavingFlag,group}){
    const ivory=0xe9e0cb,edge=0xc4bda9,slate=0x666b61,glass=0x405354,wood=0x715545;
    palette({glass, timber: wood});
    for(const [x,z,w,d,h] of [[0,8,82,19,18],[-25,-13,23,29,13],[25,-13,23,29,13],[0,-20,39,14,12]]){
      box(edge,x,.8,z,w+1.1,1.6,d+1.2);
      box(glass,x,h*.5+1.2,z,w,h,d);
      for(const y of [2.6,7.4,12.7,h+1.25])if(y<=h+1.3)box(ivory,x,y,z,w+1.9,.54,d+2.6);
      for(const side of [-1,1])for(let u=-w/2+1;u<w/2;u+=3.45)box(wood,x+u,h*.5+1.2,z+side*(d*.5+.06),.17,h,.26);
    }
    for(let i=-19;i<=19;i++){
      if(Math.abs(i)<2)continue;
      const x=i*1.72,z=19.55;
      for(const y of [9.9,15.4]){
        box(ivory,x,y,z,.21,5.18,.47);
        for(const s of [-1,1]){
          box(ivory,x+s*.16,y+.45,z,.15,1.22,.42,0,0,-s*.25);
          box(ivory,x+s*.16,y-.49,z,.15,1.16,.42,0,0,s*.25);
        }
      }
    }
    box(edge,0,18.1,19.5,83,.48,1.1);box(ivory,0,7.22,20,83,.59,2.1);
    for(const side of [-1,1]){
      for(const x of [26,34.5,40])box(ivory,side*x,12.7,19.3,.94,10.65,.97);
      for(const x of [36.1,38.6])box(ivory,side*x,12.6,19.15,1.1,10.5,.61);
      for(const y of [9.7,15.2])box(edge,side*37.25,y,19.55,5.4,.45,.8);
    }
    for(const x of [-11,-5.5,5.5,11])box(wood,x,4.6,22.4,.78,6.3,.84);
    box(ivory,0,7.4,22,29,.56,9);box(slate,0,20.35,5,22,3.6,15);
    box(ivory,0,22.5,5,24,.61,17);stamp(round,0x97988c,0,27.3,5,.11,9.4,.11);
    wavingFlag(4.8,3.15,0,31.7,5);
    for(let i=0;i<9;i++)box(0xcec8b7,0,.09*(9-i),23+i*.53,21,.18*(9-i),.64);
    stamp(round,0xc6bbaa,0,.09,75,26,.28,39);
    stamp(round,0x759354,0,.26,75,24.7,.20,37.8);
    for(const [r,y,h,tint] of [[7.1,.44,.48,edge],[6.85,.65,.12,0x70918a],[1.4,1.05,.8,edge]])
      stamp(round,tint,0,y,43,r,h,r);
    for(let i=0;i<18;i++){
      const a=i*Math.PI/9,dx=Math.cos(a),dz=Math.sin(a);
      const path=new T.QuadraticBezierCurve3(new T.Vector3(dx*.9,1.1,43+dz*.9),new T.Vector3(dx*3.3,6.6,43+dz*3.3),new T.Vector3(dx*5.6,.78,43+dz*5.6));
      const jet=new T.TubeGeometry(path,10,.046,4,false);stamp(jet,0xc6d8d0,0,0,0);jet.dispose();
    }
    const garden=[];
    for(const side of [-1,1])for(let i=0;i<13;i++)garden.push([side*(38+4*Math.sin(i*1.4)),-.6,24+i*6.5,10+4*Math.sin(i*.9)**2,i]);
    trees(T,group,garden);
  }
  stop('dinh-doc-lap','osm-way-39598493',{name:'Dinh Độc Lập',yaw:2.32,width:86,depth:69,start:[106.69722,10.77694],
    viewAngle:2.38,viewElevation:.19,gardenRadius:105,solids:[[0,8,41,9.5],[-25,-13,11.5,14.5],[25,-13,11.5,14.5],[0,-20,19.5,7]],
    photo:'https://dinhdoclap.gov.vn/kien-truc-dinh-doc-lap/',description:'Các dải ban công chạy ngang mặt đứng. Lớp rèm hoa đá gợi hình đốt trúc, che nắng cho hành lang phía sau.'},palace);

  function lighthouse(T,{palette, group,stamp,round,tapered,box}){
    const granite=0xc7c5b8,band=0xb2afa5,iron=0x5c605d;
    palette({stone:[granite,band],metal:iron});
    // An octagonal plinth spans the 7.1 m OSM outline. Average shaft width across flats is 4 m.
    const bodyBase=1.1,bodyTop=35,baseRadius=2.68,topRadius=1.65;
    const radiusAt=y=>baseRadius+(topRadius-baseRadius)*(y-bodyBase)/(bodyTop-bodyBase);
    function masonry(tint,y0,y1,r0,r1){
      const stone=new T.CylinderGeometry(r1,r0,y1-y0,8);
      stamp(stone,tint,0,(y1+y0)/2,0,1,1,1,Math.PI/8);stone.dispose();
    }
    masonry(band,0,bodyBase,3.55,3.39);
    masonry(granite,bodyBase,bodyTop,baseRadius,topRadius);
    for(let i=0;i<6;i++){
      const y=4+i*4.9,face=radiusAt(y)*Math.cos(Math.PI/8);
      box(band,0,y,face,.81,1.43,.13);box(0x555650,0,y,face+.08,.58,1.12,.06);
    }
    for(const [y,r,h] of [[35.09,1.94,.26],[35.35,2.16,.32],[35.61,2.32,.24]])stamp(round,band,0,y,0,r,h,r);
    for(let i=0;i<20;i++){
      const a=i*Math.PI/10;stamp(round,iron,2.19*Math.sin(a),36.26,2.19*Math.cos(a),.04,1.06,.04);
    }
    const rail=new T.TorusGeometry(2.19,.045,6,32);stamp(rail,iron,0,36.78,0,1,1,1,0,Math.PI/2);rail.dispose();
    stamp(round,iron,0,36.9,0,1.56,2.35,1.56);
    const glassBottom=38.07,glassTop=40.41,glassHeight=glassTop-glassBottom;
    const glass=new T.Mesh(new T.CylinderGeometry(1.49,1.49,glassHeight,12,1,true),
      new T.MeshStandardMaterial({color:0xcad8d8,roughness:.18,transparent:true,opacity:.21,depthWrite:false}));
    glass.position.y=(glassBottom+glassTop)/2;group.add(glass);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;stamp(round,iron,1.49*Math.sin(a),glass.position.y,1.49*Math.cos(a),.047,glassHeight,.047);
    }
    tapered(iron,0,40.66,0,1.69,.21,.50,1,24);stamp(round,iron,0,40.95,0,.055,.10,.055);
    // The 2019 station survey gives 66 m to the tower top and 65 m to the lens, both above chart datum.
    const optic=new T.Mesh(new T.SphereGeometry(.29,16,12),new T.MeshBasicMaterial({color:0xffffff}));
    optic.position.set(0,40,0);group.add(optic);
    const glow=new T.PlaneGeometry(2,2),flare=new T.Mesh(glow,new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,
      uniforms:{beam:{value:0}},blending:T.AdditiveBlending,
      vertexShader:'varying vec2 lens;void main(){lens=uv*2.-1.;vec4 eye=modelViewMatrix*vec4(0.,0.,0.,1.);eye.xy+=position.xy;gl_Position=projectionMatrix*eye;}',
      fragmentShader:'varying vec2 lens;uniform float beam;void main(){float r=dot(lens,lens);gl_FragColor=vec4(1.,1.,.98,exp(-r*8.)*beam);}'
    }));
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    flare.position.copy(optic.position);flare.renderOrder=2;group.add(flare);
    const flashes=[0,3.4,6.8,13.4];
    flare.onBeforeRender=()=>{
      const phase=(performance.now()/1000)%20;
      const on=flashes.some(start=>phase>=start&&phase<start+.1);
      flare.material.uniforms.beam.value=motion.matches?.27:on?.9:.025;
      optic.material.color.setScalar(motion.matches?.65:on?1:.32);
    };
  }
  stop('ke-ga','osm-way-1272874768',{lon:107.9915556,lat:10.6951944,width:7.1,depth:7.1,yaw:-.35,solids:[[0,0,2.6,2.6]],
    structureHeight:41,focalHeight:65,source:'https://cangvuhanghaibinhthuan.gov.vn/wp-content/uploads/2025/05/378-TBHH-TCTBDATHHMN-Den-Ke-Ga.pdf',
    photo:'https://commons.wikimedia.org/wiki/Category:K%C3%AA_G%C3%A0_Lighthouse',
    description:'Tháp đá granit xám trắng tám cạnh cao 41 m từ móng. Tâm đèn nằm ở cao độ 65 m so với mốc 0 hải đồ. Đèn chớp trắng theo nhóm ba rồi một trong chu kỳ 20 giây.'},lighthouse);

  function islets(T,{group}){
    // Horizontal sections traced from the bay authority's water-level photograph.
    for(const side of [-1,1]){
      const sections=side<0?
        [[-.7,-12,-2.9,2.5],[.65,-12.7,-3.4,2.7],[1.45,-14.0,-1.0,4.1],[2.8,-13.5,-.7,4.65],[4.1,-12.7,-1.25,4.3],
        [5.8,-11.3,-.94,4.4],[7.2,-10.7,-1.08,4.1],[8.8,-9.55,-.48,3.9],[10.0,-8.9,-.22,3.6],[11.05,-9.45,-1.12,3.0],[11.8,-8.9,-1.62,2.55],[12.3,-7.3,-3.7,1.45],[12.55,-5.9,-5.1,.5]]:
        [[-.7,2.9,10.8,2.3],[.60,3.4,11.0,2.7],[1.54,2.12,14.75,4.15],[2.48,2.32,14.34,4.38],[3.8,2.1,13.56,4.04],
        [5.1,2.18,11.73,3.71],[6.7,1.78,9.38,3.27],[8.3,2.12,7.26,2.87],[9.5,1.4,6.05,2.63],[10.8,1.35,4.97,2.2],[11.63,1.94,4.25,1.58],[12.0,2.65,3.6,.7]];
      const p=[],uv=[],colors=[],idx=[],tint=new T.Color(),n=49;
      sections.forEach(([y,left,right,deep],j)=>{
        for(let i=0;i<=n;i++){
          const a=i/n*2*Math.PI,k=j*(n+1)+i;
          const crag=1+.059*Math.sin(a*13+j*.18)+.062*Math.cos(a*7-j*.27);
          const rounded=v=>Math.sign(v)*Math.abs(v)**.72;
          const x=(right+left)/2+rounded(Math.cos(a))*(right-left)*.5*crag;
          const z=rounded(Math.sin(a))*deep*crag+.32*Math.sin(y*.8+a);
          p.push(x,y+.25*Math.cos(a*7+j*.6),z);uv.push(a*2.65,y*.36);
          tint.setHex(j<2?0x626762:j===2?0xdbd6bd:0x959990);
          tint.multiplyScalar(.9+.13*Math.sin(a*14+y*.14)+.10*Math.sin(a*6+y*.7));
          colors.push(tint.r,tint.g,tint.b);
          if(i&&j)idx.push(k-n-2,k-1,k-n-1,k-n-1,k-1,k);
        }
      });
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
      g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(idx);g.computeVertexNormals();
      const m=new T.Mesh(g,rockMaterial(T));m.castShadow=m.receiveShadow=true;group.add(m);
    }
  }
  (window.VietnamSights??=[]).push({id:'hon-trong-mai',name:'Hòn Trống Mái',city:'Vịnh Hạ Long',province:'Quảng Ninh',region:'Bắc Bộ',
    lon:107.02623,lat:20.89049,start:[106.9894,20.91974],width:31,depth:11,yaw:-.65,viewAngle:-.64,viewElevation:.14,solids:[],
    map:'https://www.openstreetmap.org/way/480056722',photo:'https://halongbay.com.vn/vi/p/610-hon-trong-mai-bieu-tuong-doc-dao-cua-vinh-ha-long',
    description:'Từ cảng Tuần Châu, góc ngắm đưa ra giữa vịnh. Hai khối đá vôi đối mặt nhau, phần chân bị thủy triều khoét hẹp sát mặt nước.',build:islets});

  function marketBoats(T,{group,random}){
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    // One combined mesh per hull keeps its cabin, produce and pole moving together.
    for(let i=0;i<11;i++){
      const g=new T.Group(),length=8+random()*5,w=length*.105,verts=[],rgb=[],col=new T.Color();
      function face(a,b,c,d,tone){
        col.setHex(tone);for(const v of [a,b,c,b,d,c]){verts.push(...v);rgb.push(col.r,col.g,col.b);}
      }
      function section(t,y,s){
        const beam=w*(.10+.90*Math.sin(t*Math.PI)**.61),rise=(2*t-1)**4*.65;
        return [s*beam*(y<0?.40:1),y+rise,(t-.5)*length];
      }
      for(let k=0;k<18;k++)for(const s of [-1,1]){
        const a=k/18,b=(k+1)/18;
        face(section(a,-.48,s),section(b,-.48,s),section(a,.28,s),section(b,.28,s),0x634c37);
        face(section(a,.28,s),section(b,.28,s),section(a,.53,s),section(b,.53,s),i%3?0x547477:0x934e36);
        face(section(a,.49,s),section(b,.49,s),section(a,.55,s),section(b,.55,s),0xd9b36d);
        if(s===1)face(section(a,.31,-1),section(b,.31,-1),section(a,.31,1),section(b,.31,1),0x947255);
      }
      function cuboid(x,y,z,dx,dy,dz,tint){
        const a=(u,v,t)=>[x+u*dx/2,y+v*dy/2,z+t*dz/2];
        face(a(-1,1,-1),a(1,1,-1),a(-1,1,1),a(1,1,1),tint);
        for(const s of [-1,1]){
          face(a(s,-1,-1),a(s,-1,1),a(s,1,-1),a(s,1,1),tint);
          face(a(-1,-1,s),a(1,-1,s),a(-1,1,s),a(1,1,s),tint);
        }
      }
      for(const side of [-1,1])for(const z of [-.36,-.09])cuboid(side*w*.60,.94,z*length,.10,1.32,.10,0x947552);
      const tarp=i%2?[0x427675,0x88aaa0]:[0x836244,0xc0a47a];
      for(let strip=0;strip<7;strip++){
        const z=(-.41+strip*.051)*length,end=z+length*.051;
        for(const side of [-1,1])
          face([0,1.89,z],[0,1.89,end],[side*w*.87,1.58,z],[side*w*.87,1.58,end],tarp[strip%3===0?1:0]);
      }
      function fruit(x,y,z,r,h,tint){
        const top=[x,y+h,z],low=[x,y-h*.77,z];
        for(let k=0;k<6;k++){
          const a=k*Math.PI/3,b=(k+1)*Math.PI/3;
          const left=[x+r*Math.cos(a),y,z+r*Math.sin(a)],right=[x+r*Math.cos(b),y,z+r*Math.sin(b)];
          col.setHex(tint);for(const v of [top,right,left,low,left,right]){verts.push(...v);rgb.push(col.r,col.g,col.b);}
        }
      }
      const produce=[0xb28f37,0x839742,0xbfa142][i%3];
      for(let k=0;k<10;k++){
        const x=((k%2)-.5)*w*.79,z=(.04+Math.floor(k/2)*.066)*length;
        cuboid(x,.52,z,w*.72,.34,length*.061,0x987045);
        cuboid(x,.68,z,w*.75,.06,length*.065,0xcaa16e);
        for(let j=0;j<4;j++)fruit(x+((j%2)-.5)*w*.34,.74,z+(Math.floor(j/2)-.5)*length*.031,.14,.17,produce);
      }
      cuboid(w*.58,2.15,length*.23,.093,3.6,.093,0x9b8662);
      cuboid(w*.58-.19,3.86,length*.23,.42,.045,.045,0x90704c);
      fruit(w*.58-.36,3.59,length*.23,.13,.25,produce);
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setAttribute('color',new T.Float32BufferAttribute(rgb,3));geo.computeVertexNormals();
      const boat=new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.79}));
      boat.castShadow=boat.receiveShadow=true;g.add(boat);group.add(g);
      g.position.set((i%3-1)*7.3+random()*2,-.42,(Math.floor(i/3)-1.5)*16+random()*5);
      g.rotation.y=(random()-.5)*.27;
      boat.onBeforeRender=()=>{const t=motion.matches?0:performance.now()*.001;boat.position.y=.07*Math.sin(t*1.3+i);boat.rotation.z=.018*Math.sin(t*.93+i*2.6);};
    }
  }
  stop('cho-noi-cai-rang','osm-way-1455066447',{name:'Chợ nổi Cái Răng',lon:105.74446,lat:10.00276,width:30,depth:72,yaw:-.36,viewAngle:1.1,viewElevation:.24,solids:[],
    photo:'https://canthotourism.vn/vi/chocairang',description:'Những ghe chở nông sản neo dọc sông. Mỗi cây bẹo treo một món hàng để người mua từ ghe khác nhìn thấy từ xa.'},marketBoats);
  function sampans(T,{box,stamp,random}){
    const shells=new T.SphereGeometry(1,22,6,0,Math.PI*2,Math.PI/2,Math.PI/2);
    const lifeRing=new T.TorusGeometry(.20,.055,5,14);
    for(let j=0;j<3;j++)for(let i=0;i<11-j*2;i++){
      const a=(i-5)*.042+.13*j,x=(i-5)*1.49+j*.92,z=(j-1)*6.4-.052*(i-5)**2;
      stamp(shells,i%4?0x486b62:0x746b54,x,-.13,z,.65,.51,2.75,a);
      for(const v of [-1.25,-.12,1.05])box(0x9b8367,x+Math.sin(a)*v,-.15,z+Math.cos(a)*v,1.03,.13,.32,a);
      stamp(lifeRing,0xca6039,x+.30,-.035,z+random()*.24,1,1,1,a,Math.PI/2);
      box(0x9a886a,x-.21,-.025,z,.065,.055,3.1,a+.14);
    }
    shells.dispose();lifeRing.dispose();
  }
  (window.VietnamSights??=[]).push({id:'ben-thuyen-trang-an',name:'Bến thuyền Tràng An',city:'Ninh Bình',province:'Ninh Bình',region:'Bắc Bộ',
    lon:105.91875,lat:20.25213,start:[105.91886,20.25290],yaw:1.9,width:29,depth:25,viewElevation:.43,solids:[],
    map:'https://www.openstreetmap.org/?mlat=20.25213&mlon=105.91875#map=17/20.25213/105.91875',
    photo:'https://dantri.com.vn/du-lich/toan-canh-trang-an-dia-diem-tong-thong-my-muon-den-tham-nhin-tu-tren-cao-20190307143029291.htm',
    description:'Những thuyền chèo tay xếp thành dãy ở bến. Từ đây, các tuyến tham quan theo dòng nước uốn quanh núi đá vôi của Tràng An.',build:sampans});
})();
