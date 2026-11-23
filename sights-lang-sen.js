'use strict';
(()=>{
  const atlas=window.VietnamTourism,catalogId='osm-relation-17189466',id='kenh-tram-lang-sen';
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(e=>e.id===catalogId);
  const source='https://documents1.worldbank.org/curated/en/099440201272236943/pdf/2a0ESIA0SWLC00270Jan020220clean0pdf.pdf#page=142';
  const photo='https://commons.wikimedia.org/wiki/File:Rungtram_1.jpg';
  // Fig. 3.5 in the 2022 Southern Waterways Logistics Corridors ESIA marks
  // the reserve headquarters. Registration to the Ramsar/OSM outline places
  // its approximate dot at 105.7109106,10.7750837. The actual roof cluster
  // is some 35 m west. The datum below is at that cluster, also the public
  // map POI (CID b756c3635bbf9d36). Local coordinates in metres east/south.
  // Canal edges, the connecting ditches, roof planes and bridge were traced
  // against orthophotos from Esri and Google. Their wet and vegetated margins
  // differ, so widths and water level are estimates.
  // OSM w503113237 confirms the OUTER canal. The small bridge crosses the
  // separate inner watercourse. Neither it nor the levee is a car approach.
  const inner=[[140,-159,4.8],[122,-123,5.0],[113,-98,4.8],[100,-73,4.4],[95,-57,4.9],[86,-41,7.5],
    [84,-28,7.5],[83,-15,7.0],[78,-5,7.1],[68,4,6.7],[60,13,6.4],[57,23,6.9],[50,31,7.8],
    [43,40,7.8],[37,50,7.0],[29,61,6.5],[20,76,5.5],[12,88,4.4],[7,100,4.7],[-4,113,4.6],[-19,138,4.8],[-36,164,4.7]];
  const outer=[[221,-155,6.0],[182,-93,5.2],[157,-54,5.7],[132,-14,5.6],[113,16,5.8],[94,46,5.7],[75,74,5.2],[49,111,5.5],[14,164,5.1]];
  const ditch=[[86,-41,4.4],[70,-50,4.8],[51,-65,4.8],[34,-79,5.5],[17,-96,4.7],[-1,-111,4.1],[-15,-122,4.2],
    [-22,-123,4.4],[-30,-119,4.9],[-44,-104,5.5],[-61,-83,5.8],[-78,-62,6.0],[-99,-40,5.8],
    [-112,-27,5.4],[-124,-11,5.8],[-131,2,5.1],[-128,13,4.9],[-117,25,4.6],[-95,46,4.8],[-72,64,4.5],
    [-45,83,4.6],[-22,98,4.5],[-7,108,4.3],[0,108,4.1]];
  const levee=[[-4,92],[-31,73],[-67,49],[-99,24],[-111,11],[-102,-3],[-78,-33],[-57,-63],[-33,-93],
    [-18,-111],[-10,-112],[10,-94],[34,-73],[60,-53],[79,-34]];
  const pool=[[-49,-12],[-44,-10],[-46,-5],[-50,0],[-52,9],[-55,15],[-48,19],[-43,17],[-37,19],[-34,24],
    [-29,26],[-30,31],[-35,33],[-40,28],[-48,27],[-51,25],[-58,29],[-65,27],[-67,24],[-65,19],[-63,15],
    [-58,12],[-55,6],[-54,-1],[-59,-5],[-57,-10]];
  const island=[[-126,8],[-18,-119],[85,-40],[73,0],[42,40],[14,86],[-1,106]];
  const seed=i=>{const n=Math.sin(i*34.763+7.79)*24794.81;return n-Math.floor(n);};
  function inside(poly,x,z){
    let yes=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const [a,b]=poly[j],[c,d]=poly[i];if((b>z)!==(d>z)&&x<a+(c-a)*(z-b)/(d-b))yes=!yes;
    }
    return yes;
  }
  function nearest(line,x,z,radii=false,closed=false){
    let dist=1e7;
    for(let i=1;i<line.length+(closed?1:0);i++){
      const a=line[i-1],b=line[i%line.length],dx=b[0]-a[0],dz=b[1]-a[1];
      const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));
      const d=Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)-(radii?a[2]+(b[2]-a[2])*t:0);
      dist=Math.min(dist,d);
    }
    return dist;
  }
  function waterDistance(x,z){
    let d=Math.min(nearest(inner,x,z,true),nearest(outer,x,z,true),nearest(ditch,x,z,true));
    if(x>=-71&&x<-26&&z>=-16&&z<36){const edge=nearest(pool,x,z,false,true);d=Math.min(d,inside(pool,x,z)?-edge:edge);}
    return d;
  }
  function yard(x,z){return Math.abs(x+2)<18&&z>-21&&z<21;}
  function woody(x,z){
    if(inside(island,x,z)){
      const grove=((x+1)/46)**2+((z+2)/35)**2;
      return grove<.75?1:grove<1.13?.53:.065;
    }
    // A dense, narrow forest belt follows the two nearly parallel canals.
    const bank=122-z*.645;
    if(x>bank-58&&x<bank+8)return .96;
    if(x>bank+8)return .78+.15*Math.sin(.052*x)*Math.cos(.072*z);
    if(z<-97&&x>-46)return .83;
    return .18+.32*Math.max(0,Math.sin(.049*x+.024*z)*Math.cos(.065*z));
  }
  function geometry(T,positions,indices,colours,uv){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    if(indices)g.setIndex(indices);if(colours)g.setAttribute('color',new T.Float32BufferAttribute(colours,3));
    if(uv)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
  }
  function land(T,k){
    const p=[],idx=[],col=[],tint=new T.Color();
    function axis(start,stop,near,far){
      const values=[];for(let v=start;v<stop;v+=v>=near&&v<far?1.15:2.65)values.push(v);values.push(stop);return values;
    }
    const xs=axis(-165,225,17,107),zs=axis(-169,179,-58,79),wide=xs.length-1,deep=zs.length-1;
    for(let j=0;j<=deep;j++)for(let i=0;i<=wide;i++){
      const x=xs[i],z=zs[j],dist=waterDistance(x,z),dike=nearest(levee,x,z),onDike=Math.exp(-.059*dike*dike);
      const wave=Math.sin(x*.073+1.4*Math.sin(z*.038))*Math.cos(z*.061),bank=Math.max(0,Math.min(1,dist/3.0));
      const y=dist<0?Math.max(-.69,dist*.33+.10):.10+bank*(.19+.10*wave)+onDike*.48;
      const grassy=inside(island,x,z),bare=yard(x,z)&&Math.abs(x)<10&&Math.abs(z)<14;
      tint.setHex(dist<0?0x566349:bare?0x807c60:onDike>.75?0x91896b:dist<1.1?0x6d7650:grassy?0x657946:0x596f41);
      tint.multiplyScalar(.86+wave*.10+seed(i+149*j)*.12);
      p.push(x,y,z);col.push(tint.r,tint.g,tint.b);
      if(i&&j){const n=j*(wide+1)+i;idx.push(n-wide-2,n-1,n,n-wide-2,n,n-wide-1);}
    }
    const g=geometry(T,p,idx,col),m=new T.MeshLambertMaterial({vertexColors:true});
    m.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 langField;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nlangField=position.xz;');
      s.fragmentShader='varying vec2 langField;\n'+s.fragmentShader.replace('#include <color_fragment>',
        '#include <color_fragment>\nfloat cover=sin(langField.x*3.43+sin(langField.y*4.23))*cos(langField.y*2.88+langField.x*.75);diffuseColor.rgb*=1.+cover*.097*(1.-smoothstep(.3,1.7,length(fwidth(langField))));');
    };
    const mesh=new T.Mesh(g,m);mesh.receiveShadow=true;k.group.add(mesh);return mesh;
  }
  const watercourses=[inner,outer,ditch];
  function bankProfiles(T,trees){
    // A metre-scale elevation strip for either bank of each watercourse.
    // Each reflected stem and crown is located from the corresponding tree
    // in the scene. The six strips avoid a second render of the whole park.
    const width=1024,height=80,extent=512,ceiling=18;
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height*6;
    const ctx=canvas.getContext('2d');
    for(const [index,path] of watercourses.entries()){
      let length=0;
      const segments=path.slice(1).map((b,i)=>{
        const a=path[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
        const s={x:a[0],z:a[1],dx:dx/len,dz:dz/len,len,along:length,r:a[2]};length+=len;return s;
      });
      const rows=[[],[]];
      for(const tree of trees){
        let nearest=Infinity,projected=0,side=0;
        for(const s of segments){
          const x=tree.x-s.x,z=tree.z-s.z,t=Math.max(0,Math.min(s.len,x*s.dx+z*s.dz));
          const d=Math.hypot(x-t*s.dx,z-t*s.dz);
          if(d>=nearest||d>s.r+21)continue;
          nearest=d;projected=t+s.along;side=x*s.dz-z*s.dx>0?1:0;
        }
        if(nearest<Infinity)rows[side].push({tree,u:projected,order:nearest});
      }
      for(const [side,row] of rows.entries()){
        ctx.save();ctx.translate(0,(index*2+side+1)*height);ctx.scale(width/extent,-height/ceiling);
        ctx.beginPath();ctx.rect(0,0,extent,ceiling);ctx.clip();
        row.sort((a,b)=>b.order-a.order);
        for(const {tree:{h,r,n},u} of row){
          const lean=(seed(n+83)-.5)*1.8,w=.84+h*.13;
          ctx.fillStyle=['#696e55','#92947a','#64715b'][n%3];
          ctx.beginPath();ctx.moveTo(u-r,0);ctx.lineTo(u+lean-r*.5,h*.85);ctx.lineTo(u+lean+r*.5,h*.85);ctx.lineTo(u+r,0);ctx.fill();
          for(let j=0;j<5;j++){
            ctx.fillStyle=['#405a40','#536948','#374d38','#516244','#475837'][(n+j)%5];
            ctx.beginPath();ctx.ellipse(u+lean+Math.cos(j*2.4+n)*w*.49,h*(.70+.062*j),w*(.67+.11*seed(n+j)),h*.105,0,0,Math.PI*2);ctx.fill();
          }
        }
        ctx.fillStyle='#596349';ctx.fillRect(0,0,extent,.27);ctx.restore();
      }
    }
    const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;return texture;
  }
  function waters(T,k,trees){
    const profile=bankProfiles(T,trees);
    const mat=new T.MeshLambertMaterial({side:T.DoubleSide});
    mat.addEventListener('dispose',()=>profile.dispose());
    const clock={value:0},quiet=matchMedia('(prefers-reduced-motion: reduce)');
    mat.onBeforeRender=()=>{clock.value=quiet.matches?0:(performance.now()%1000000)*.001;};
    mat.onBeforeCompile=s=>{
      s.uniforms.langClock=clock;s.uniforms.langProfiles={value:profile};
      const vary='varying vec3 langWorld;varying vec2 langLocal;varying vec3 langSection;varying vec3 langAcross;\n';
      s.vertexShader=vary+'attribute vec3 section;attribute vec3 across;\n'+s.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nlangWorld=(modelMatrix*vec4(position,1.)).xyz;langLocal=position.xz;langSection=section;langAcross=across;');
      s.fragmentShader=vary+'uniform float langClock;uniform sampler2D langProfiles;\n'+s.fragmentShader.replace('#include <color_fragment>',`
        #include <color_fragment>
        vec2 p=langSection.xy;float stretch=langSection.z;
        float wave=sin(p.x*3.7+p.y*.91-.62*langClock+1.9*sin(.61*p.y+.29*p.x));
        float ripple=sin(p.y*4.7+p.x*1.75+.44*langClock+1.7*sin(.87*p.x-.62*p.y));
        float dist=max(.01,stretch-abs(p.y));
        vec3 eye=normalize(cameraPosition-langWorld);
        float shore=clamp(1.-dist/stretch,0.,1.);
        vec2 across=normalize(langAcross.xy),forward=vec2(-across.y,across.x);
        float wavescale=1.-smoothstep(.24,1.85,length(fwidth(p)));
        vec2 tilt=(across*wave*.008+forward*ripple*.011)*wavescale;
        vec3 ray=reflect(-eye,normalize(vec3(tilt.x,1.,tilt.y)));
        float crossRay=dot(ray.xz,across);
        float travel=min(180.,(stretch+3.2-sign(crossRay)*p.y)/max(.018,abs(crossRay)));
        float h=max(0.,travel*ray.y);
        float along=clamp(p.x+travel*dot(ray.xz,forward),0.,511.);
        float strip=langAcross.z*2.+step(0.,crossRay);
        vec4 trees=texture2D(langProfiles,vec2(along/512.,1.-(strip+1.-clamp(h/18.,.009,.991))/6.));
        float cloud=.5+.5*sin(along*.044+h*.057+1.8*sin(along*.061));
        vec3 sky=mix(vec3(.18,.295,.345),vec3(.29,.39,.41),smoothstep(.56,.91,cloud));
        vec3 reflection=mix(sky,trees.rgb,trees.a*(1.-smoothstep(17.,18.,h)));
        vec2 bridge=langLocal+ray.xz*.43/max(.015,ray.y)-vec2(43.15,33.40);
        float girder=abs(dot(bridge,vec2(.595,-.804)));
        float alongDeck=abs(dot(bridge,vec2(.804,.595)));
        float reflectedDeck=(1.-smoothstep(.52,.86,girder))*(1.-smoothstep(13.5,13.9,alongDeck));
        reflection=mix(reflection,vec3(.12,.134,.108),reflectedDeck);
        float fresnel=.08+.78*pow(1.-clamp(eye.y,0.,1.),2.2);
        vec3 surface=mix(vec3(.029,.058,.044),reflection,fresnel);
        float raft=sin(.37*p.x+1.6*sin(.27*p.y))+.61*cos(.53*p.y-.19*p.x)+.35*sin(2.5*p.x+.94*p.y);
        float plants=smoothstep(.48,.69,raft+shore*1.08-.59-.13*dist);
        float flecks=.5+.5*cos(17.1*p.x+5.2*sin(19.2*p.y))*sin(17.*p.y+.92*p.x);
        diffuseColor.rgb=mix(surface,vec3(.075,.143,.041)+vec3(.048,.060,.020)*flecks,plants*.93);
      `);
    };
    const surfaces=[];
    function add(g,section,across){
      g.setAttribute('across',new T.Float32BufferAttribute(across,3));
      g.setAttribute('section',new T.Float32BufferAttribute(section,3));const mesh=new T.Mesh(g,mat);
      mesh.receiveShadow=true;k.group.add(mesh);surfaces.push(mesh);
    }
    for(const [index,path] of watercourses.entries()){
      const p=[],idx=[],attr=[],across=[],smooth=[];
      for(let i=1;i<path.length;i++){
        const a=path[i-1],b=path[i],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3);
        for(let n=0;n<steps;n++){const t=n/steps;smooth.push(a.map((v,j)=>v+(b[j]-v)*t));}
      }
      smooth.push(path.at(-1));let distance=0;
      for(let i=0;i<smooth.length;i++){
        const a=smooth[i],prev=smooth[Math.max(0,i-1)],next=smooth[Math.min(smooth.length-1,i+1)];
        const dx=next[0]-prev[0],dz=next[1]-prev[1],len=Math.hypot(dx,dz);
        distance+=Math.hypot(a[0]-prev[0],a[1]-prev[1]);
        for(let j=0;j<=8;j++){
          const v=(j/4-1)*(a[2]+.35);
          p.push(a[0]+dz*v/len,.10+(path===ditch?.006:0),a[1]-dx*v/len);
          attr.push(distance,v,a[2]+.35);across.push(dz/len,-dx/len,index);
          if(i&&j){const n=i*9+j;idx.push(n-10,n-1,n,n-10,n,n-9);}
        }
      }
      add(geometry(T,p,idx),attr,across);
    }
    const ring=pool.map(([x,z])=>new T.Vector2(x,-z)),shape=new T.Shape(ring),g=new T.ShapeGeometry(shape);g.rotateX(-Math.PI/2);g.translate(0,.095,0);
    const v=g.attributes.position,sec=[],across=[];
    for(let i=0;i<v.count;i++){sec.push(v.getZ(i)+180,v.getX(i)+53,9.5);across.push(1,0,2);}add(g,sec,across);
    return surfaces;
  }
  function structure(T,k){
    // Only the outlined pale and weathered roof planes visible in imagery
    // are represented. Storeys, eave heights and pitches are approximate.
    function roof(x,z,yaw,w,d,eave,h,a,b){
      k.place(x,z,yaw,()=>{
        k.box(0xada995,0,.30+eave*.46,0,w-.57,eave*.92,d-.57);
        const len=Math.hypot(w/2,h),angle=Math.atan2(h,w/2);
        for(const side of [-1,1])k.box(side<0?a:b,side*w*.25,eave+h*.5,0,len,.105,d,0,0,-side*angle);
        k.box(0xb1b0a1,0,eave+h+.045,0,.14,.11,d+.08);
      });
    }
    roof(-5.99,-9.51,-.68,6.97,13.42,2.75,1.33,0xc1beb2,0x987f71);
    roof(-1.40,.44,.82,9.09,12.40,2.70,.94,0xb1ada2,0xa19b91);
    roof(.80,10.52,.78,6.15,10.43,2.55,.74,0xc3c1b7,0xd3cdb9);
    // Narrow land-to-land crossing across the inner ditch. The imagery gives
    // its alignment and width, but it does not resolve parapet construction.
    const a=[32.2,25.3],b=[54.1,41.5],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),angle=Math.atan2(dx,dz);
    k.box(0x9d9a88,(a[0]+b[0])/2,.64,(a[1]+b[1])/2,1.27,.22,len,angle);
    for(const t of [.23,.51,.77]){
      const x=a[0]+t*dx,z=a[1]+t*dz;k.box(0x686e5c,x,.04,z,.75,1.11,.29,angle);
    }
  }
  function woodyBark(T){
    const canvas=document.createElement('canvas');canvas.width=96;canvas.height=192;
    const g=canvas.getContext('2d');g.fillStyle='#c4bdab';g.fillRect(0,0,96,192);
    for(let i=0;i<570;i++){
      const x=seed(i*3)*96,y=seed(i*3+1)*204-12,h=3+seed(i*3+2)*37;
      g.strokeStyle=['#8e8c7e','#d7d2bf','#acae98','#c5c2ae','#e4ded0'][i%5];
      g.lineWidth=.35+seed(i+92)*2.9;g.beginPath();g.moveTo(x,y);
      g.bezierCurveTo(x-.7,y+h*.36,x+1.9,y+h*.63,x-.3,y+h);g.stroke();
    }
    const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(2,3);
    return new T.MeshLambertMaterial({map:t});
  }
  function growth(T,k){
    const pose=new T.Object3D(),up=new T.Vector3(0,1,0),trees=createTreeModels(T),stems=[],branches=[],crowns=[],far=[[],[],[],[]],reeds=[],wood=[],shrubs=[];
    for(let j=0;j<78;j++)for(let i=0;i<92;i++){
      const n=j*93+i,x=-163+(i+.86*seed(n*2))*4.20,z=-163+(j+.86*seed(n*2+1))*4.22;
      const dist=waterDistance(x,z),cover=woody(x,z),crossing=Math.abs((x-43.0)*.595-(z-33.4)*.804)<2.05&&x>30&&x<57;
      if(dist<.05||yard(x,z)||crossing||seed(n+900)>cover*.83||nearest(levee,x,z)<2.2)continue;
      const h=4.3+seed(n+443)*5.5+cover*3.5,r=.072+seed(n+341)*.125,a=seed(n-232)*Math.PI*2;
      const near=Math.hypot((x-38)*.99,(z-18)*.93)<94;
      wood.push({x,z,h,r,n});
      if(!near){far[n%4].push([x,0,z,h*(.88+.37*seed(n-90)),h,a]);continue;}
      if(seed(n+43)<.65){
        const height=.85+seed(n+27)*2.65;
        shrubs.push([x+.55,z+.77,height*(1.15+.8*seed(n-54)),height,a]);
      }
      const dx=Math.cos(a)*h*.095,dz=Math.sin(a)*h*.095;
      const fork=[x+dx*.47,h*.49,z+dz*.47],tip=[x+dx,h*.88,z+dz];
      stems.push({x,z,a:[x,-.20,z],b:fork,r,n},{x,z,a:fork,b:tip,r:r*.76,n:n+12});
      const spread=1.40+h*.135,cy=h*.78;
      crowns.push([tip[0],cy+.082*h,tip[2],spread*.91,h*.205,spread*.90,a]);
      for(let l=0;l<2;l++){
        const angle=a+2.44*l+.49,reach=spread*(.54+.26*seed(n+l+22));
        const branch=[tip[0]+reach*Math.cos(angle),cy-.55+.63*l,tip[2]+reach*Math.sin(angle)];
        branches.push({x,z,a:fork,b:branch,r:r*.54,n:n+l+1});
        crowns.push([branch[0],branch[1]+.16,branch[2],spread*.73,h*.158,spread*.71,angle]);
      }
    }
    const groups=[],coords=new Map();
    function register(mesh,spots){
      k.group.add(mesh);groups.push(mesh);coords.set(mesh,spots);
    }
    function batched(elements,geo,mat){
      const m=new T.InstancedMesh(geo,mat,elements.length),roots=[];
      for(const [j,d] of elements.entries()){
        const a=new T.Vector3(...d.a),b=new T.Vector3(...d.b),dir=b.clone().sub(a);
        pose.position.copy(a).lerp(b,.5);pose.quaternion.setFromUnitVectors(up,dir.clone().normalize());pose.scale.set(d.r,dir.length(),d.r);
        pose.updateMatrix();m.setMatrixAt(j,pose.matrix);
        const shade=.78+.22*seed(d.n+73);m.setColorAt(j,new T.Color(shade,shade*.99,shade*.90));
        roots.push([d.x,d.z]);
      }
      m.castShadow=m.receiveShadow=true;register(m,roots);
    }
    const bark=woodyBark(T),sub=new T.CylinderGeometry(.72,1,1,7);
    batched(stems,sub,bark);batched(branches,sub,bark);
    const begin=k.group.children.length;window.VietnamForestGiants.crowns(T,k,crowns);
    for(const m of k.group.children.slice(begin))groups.push(m);
    for(let v=0;v<4;v++){
      const rows=far[v],mesh=new T.InstancedMesh(trees.distantGeometry('tree',v),trees.billboardMaterial(),rows.length);
      rows.forEach(([x,y,z,w,h,ang],j)=>{
        pose.position.set(x,y,z);pose.rotation.set(0,ang,0);pose.scale.set(w,h,w);pose.updateMatrix();mesh.setMatrixAt(j,pose.matrix);
        mesh.setColorAt(j,new T.Color(.72,.82,.66));
      });
      register(mesh,null);
    }
    const scrub=new T.InstancedMesh(trees.distantGeometry('tea',0),trees.billboardMaterial(),shrubs.length);
    shrubs.forEach(([x,z,w,h,ang],j)=>{
      pose.position.set(x,0,z);pose.rotation.set(0,ang,0);pose.scale.set(w,h,w);pose.updateMatrix();scrub.setMatrixAt(j,pose.matrix);
      scrub.setColorAt(j,new T.Color(.73,.84,.64));
    });register(scrub,null);
    // Banks and the open grass patches have irregular clumps of upright
    // sedges. Leave the centre of each watercourse navigably open.
    const pos=[],colors=[],col=new T.Color();
    for(let i=0;i<17;i++){
      const a=i*2.399,dx=Math.cos(a),dz=Math.sin(a),len=.35+seed(i)*.62,rx=dx*.17,rz=dz*.17,bend=.12+seed(i+58)*.29;
      const l=[rx-dz*.027,0,rz+dx*.027],r=[rx+dz*.027,0,rz-dx*.027],tip=[rx+dx*bend,len,rz+dz*bend];
      pos.push(...l,...r,...tip);for(let j=0;j<3;j++){col.setHex(j===2?0x8b995c:i%3?0x596e40:0x627f46);colors.push(col.r,col.g,col.b);}
    }
    for(let i=0;i<7600;i++){
      const x=-137+320*seed(2*i+17),z=-136+279*seed(2*i+18),d=waterDistance(x,z);
      if(yard(x,z)||d<-.65||((d>2.9||d<-.20)&&seed(i+99)>.15))continue;
      reeds.push([x,0,z,.70+seed(i+23)*1.36,.55+seed(i-4)*1.12,seed(i+109)*6.28]);
    }
    const sedge=new T.InstancedMesh(geometry(T,pos,null,colors),new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}),reeds.length);
    reeds.forEach(([x,y,z,w,h,ang],j)=>{pose.position.set(x,y,z);pose.rotation.set(0,ang,0);pose.scale.set(w,h,w);pose.updateMatrix();sedge.setMatrixAt(j,pose.matrix);});register(sedge,null);
    return {groups,coords,wood};
  }
  function build(T,k){
    const terrain=land(T,k),plants=growth(T,k),water=waters(T,k,plants.wood);
    k.palette({stone:0x9d9a88,metal:[0xc1beb2,0x987f71,0xb1ada2,0xa19b91,0xc3c1b7,0xd3cdb9]});
    structure(T,k);const rest=new WeakMap();
    k.group.userData.fitGround=ground=>{
      // A canal here is one water surface. Fit a common level above the coarse
      // DEM and taper only the outer edge of the model into the native terrain.
      let level=0;
      for(const path of [inner,outer,ditch])for(const [x,z,r] of path)
        if(x>-147&&x<185&&Math.abs(z)<135)level=Math.max(level,ground(x,z),ground(x-r,z),ground(x+r,z));
      level+=.10;
      function datum(x,z){
        const t=Math.max(0,Math.min(1,Math.max((-139-x)/24,(x-191)/31,(Math.abs(z)-140)/27)));
        return level+(ground(x,z)-level)*t*t*(3-2*t);
      }
      const g=terrain.geometry,p=g.attributes.position;
      if(!rest.has(p))rest.set(p,p.array.slice());const height=rest.get(p);
      for(let i=0;i<p.count;i++)p.setY(i,height[i*3+1]+datum(p.getX(i),p.getZ(i)));
      p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
      for(const mesh of water)mesh.position.y=level;
      const buildings=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'));if(buildings)buildings.position.y=level;
      for(const mesh of plants.groups){
        const mat=mesh.instanceMatrix;if(!rest.has(mat))rest.set(mat,mat.array.slice());
        const a=rest.get(mat),b=mat.array,coords=plants.coords.get(mesh);
        for(let i=12,j=0;i<a.length;i+=16,j++){
          const x=coords?.[j]?.[0]??a[i],z=coords?.[j]?.[1]??a[i+2];
          b[i+1]=a[i+1]+datum(x,z)+.20;
        }
        mat.needsUpdate=true;mesh.computeBoundingSphere();
      }
    };
  }
  const view=(name,x,z,height,viewRadius,viewAngle,viewElevation,viewFov=51)=>({name,offset:[x,z],height,viewRadius,viewAngle,viewElevation,viewFov,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Kênh tràm Láng Sen',kind:'Khu bảo tồn',lon:105.7105959,lat:10.7750997,
    source,photo,map:'https://www.openstreetmap.org/relation/17189466',start:[105.7210387,10.7871526],mappedEntrance:true,visitOnArrival:true,
    approachMeters:undefined,width:23,depth:33,yaw:0,solids:[],gardenRadius:25,foundationAt:[0,0],
    reserve:(x,z,p)=>x>-145-p&&x<183+p&&z>-140-p&&z<140+p,
    description:'Bên khu trạm Láng Sen, ba đoạn mương bao lấy vạt cỏ và nối vào dòng nước phía đông. Một cây cầu hẹp bắc ngang dòng này sang dải tràm. Mực nước, chiều cao cây và hình dáng các mái nhỏ được ước dựng theo ảnh.',
    arrivalNote:'Xe dừng trên ĐT.819, cạnh Kênh 79, phía đông nam cầu Kênh Tỉnh. Góc quan sát mô phỏng đoạn kênh trong khu bảo tồn cách điểm dừng khoảng 1,75 km theo đường chim bay.',
    views:[view('Cầu hẹp giữa hai bờ tràm',45,34,7.7,36,-.49,.107,49),
      view('Ba mặt mương bao khu trạm',-16,-6,7.0,213,.67,.71,51),
      view('Vạt tràm soi bóng xuống kênh',96,-9,13.3,27,-2.19,.045,55)],build});
})();
