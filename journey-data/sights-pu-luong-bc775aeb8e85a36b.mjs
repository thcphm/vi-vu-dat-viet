const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(()=>{
  const id='guong-nuoc-suoi-cham',catalogId='osm-node-13508679485',atlas=window.VietnamTourism;
  const raw=atlas.byId?.get(catalogId)??atlas.entries.find(p=>p.id===catalogId);
  const source='https://nhandan.vn/tre-chieng-lau-post789295.html';
  const photo='https://puluongjunglelodge.com/diary/pu-luong-discovery-handbook';
  const tau=2*Math.PI;
  // The OSM point is in a paddy, some 31 m west of the narrow irrigation channel.
  // The broad bend of the main river w40032263 lies farther west. Keep it intact.
  // The visitor photograph and the aerial photo both show wheels within the fields:
  // https://puluongjunglelodge.com/media/puluong-waterwheels.webp
  // https://st5.depositphotos.com/3019609/67997/i/450/depositphotos_679970754-stock-photo-water-wheels-mountainous-ripen-rice.jpg
  // Offsets in metres run east/south from the channel at 105.21111 E, 20.38135 N.
  const channel=[[-155,-14],[-129.9,-1.9],[-102.4,5.9],[-82.9,7.6],[-58.2,9.8],[-39.2,10.9],[-20.2,8.2],[-7.3,3.1],[3.9,-1.4],[15.1,-4.2],[26.3,-7.0],[38.6,-10.9],[48.1,-16.5],[61.6,-23.8],[73.3,-29.9],[90.1,-35.5],[106.4,-40.5],[116.3,-44.0]];
  function axis(z){
    let i=1;while(i<channel.length-1&&z>channel[i][0])i++;
    const [a,x]=channel[i-1],[b,xx]=channel[i],t=Math.max(0,Math.min(1,(z-a)/(b-a)));return x+(xx-x)*t;
  }
  const seed=i=>{const n=Math.sin(i*24.785+1.21)*27972.5;return n-Math.floor(n);};
  const reachStart=-24,reachEnd=26;
  const widths=z=>1.30+.16*Math.sin(z*.25)+.11*Math.sin(z*.49);
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  const toLocal=([u,v])=>[(u-356.44)*.5598,(v-378.01)*.5598];
  // Paddy boundaries traced on the alluvial flat. Leave the access path, roads,
  // tree belts and west riverbank between the cultivated polygons.
  const plots=[
    [[332,148],[351,146],[360,182],[361,220],[323,218],[320,187]],[[315,198],[322,225],[317,257],[267,258],[275,236]],
    [[326,225],[353,224],[360,249],[357,271],[329,267]],[[266,261],[315,264],[320,281],[308,325],[270,325]],
    [[322,277],[353,278],[363,308],[361,329],[312,335]],[[209,315],[257,285],[267,286],[264,323],[207,341]],
    [[209,346],[267,336],[269,359],[208,370]],[[281,331],[308,327],[305,355],[281,360]],[[313,333],[349,331],[353,345],[313,354]],
    [[197,385],[215,374],[238,372],[228,410],[211,427],[192,422]],[[236,375],[267,369],[266,412],[245,441],[217,439]],
    [[280,369],[304,365],[305,391],[289,407]],[[314,360],[350,351],[342,388],[315,402]],
    [[293,410],[309,397],[340,390],[331,423],[318,458],[294,442]],[[250,444],[272,415],[290,422],[310,456],[293,493],[258,488]],
    [[201,448],[238,442],[248,465],[239,492],[191,490]],[[164,471],[189,451],[187,510],[164,542],[143,543]],
    [[167,542],[190,496],[242,497],[235,554],[215,583],[168,594]],[[243,494],[288,499],[276,545],[253,576],[221,583],[239,551]],
    [[374,145],[382,138],[457,139],[473,173],[468,205],[378,204]],[[378,209],[462,209],[454,240],[460,264],[382,270]],
    [[382,274],[459,267],[470,288],[473,322],[386,328]],[[379,346],[423,333],[461,334],[453,387],[370,390]],
    [[367,397],[451,396],[448,461],[351,461]],[[349,466],[446,468],[455,507],[414,531],[339,529]],
    [[336,536],[410,535],[399,565],[381,578],[304,583]],[[417,533],[453,516],[478,545],[470,574],[402,576]],
    [[465,369],[533,354],[568,369],[592,391],[588,408],[458,408]],[[456,428],[594,430],[590,464],[527,457],[498,444],[453,453]],
    [[458,465],[524,469],[590,465],[578,526],[535,545],[481,530]],[[486,535],[534,550],[567,536],[556,570],[480,568]]
  ].map(poly=>poly.map(toLocal));
  function mesh(T,p,colors,indices,material,uv){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));
    if(colors)g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    if(uv)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    g.setIndex(indices);g.computeVertexNormals();return new T.Mesh(g,material);
  }
  function wheel(T,r,width,tag,deliverySide){
    const p=[],colors=[],idx=[],tint=new T.Color(),up=new T.Vector3(0,1,0);
    function vertex(x,y,z,c,light=1){p.push(x,y,z);tint.setHex(c).multiplyScalar(light);colors.push(tint.r,tint.g,tint.b);}
    function rod(a,b,ra,rb,c,hollow=false){
      const u=new T.Vector3(...a),v=new T.Vector3(...b),n=v.clone().sub(u).normalize();
      const side=new T.Vector3().crossVectors(n,Math.abs(n.y)<.93?up:new T.Vector3(0,0,1)).normalize(),other=new T.Vector3().crossVectors(n,side);
      const off=p.length/3,sides=hollow?10:6;
      function circle(o,rad,color,light){
        for(let j=0;j<sides;j++){const f=j*tau/sides,h=o.clone().addScaledVector(side,rad*Math.cos(f)).addScaledVector(other,rad*Math.sin(f));vertex(h.x,h.y,h.z,color,light);}
      }
      circle(u,ra,c,1);circle(v,rb,c,1);
      if(hollow){circle(v,rb*.76,0x938452,.86);circle(v.clone().addScaledVector(n,-rb*1.85),rb*.69,0x473c24,.77);}
      for(let l=0;l<(hollow?3:1);l++)for(let j=0;j<sides;j++){
        const a=off+l*sides+j,b=off+l*sides+(j+1)%sides;idx.push(a,b,a+sides,b,b+sides,a+sides);
      }
    }
    const count=26,half=width/2;
    const point=(x,a,r)=>[x,Math.sin(a)*r,Math.cos(a)*r];
    const cane=[0x957649,0xae9059,0x897341,0x727244,0xb09a63];
    rod([-half-.30,0,0],[half+.30,0,0],.115,.104,0x685037);
    for(const s of [-1,1])rod([s*(half-.14),0,0],[s*half,0,0],.18,.16,0x73593d);
    for(let j=0;j<count;j++){
      const a=j*tau/count,b=(j+1)*tau/count,c=cane[Math.floor(seed(j+tag)*cane.length)];
      for(const s of [-1,1]){
        const hub=[s*(half-.14),Math.sin(a)*.080,Math.cos(a)*.080];
        rod(hub,point(s*half,a,r),.030,.021,c);
        for(const f of [.88,.985])rod(point(s*half,a,r*f),point(s*half,b,r*f),.032,.032,cane[(j+1)%5]);
      }
      // Flat woven paddles take the current. Separate open-ended bamboo pots
      // are inclined across the rim and spill into a fixed collector at the top.
      const mid=a+.048,root=point(-deliverySide*half*.78,mid-.085,r*.988),lip=point(deliverySide*(half+.055),mid+.125,r*.85);
      rod(root,lip,.072,.079,cane[(j+2)%5],true);
      for(let n=0;n<5;n++){
        const x=(n/4-.5)*width*.83;
        rod(point(x,a-.012,r*.81),point(x,a+.04,r*.995),.036,.043,seed(n+j)>.51?0xa38a57:0x8b764b);
      }
      rod(point(-half,a,r*.96),point(half,a,r*.96),.025,.027,0x705e3c);
    }
    return mesh(T,p,colors,idx,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}));
  }
  function gutter(T,k,a,b,r){
    const p=[],idx=[],dx=b[0]-a[0],dz=b[2]-a[2],l=Math.hypot(dx,dz),nx=dz/l,nz=-dx/l;
    for(let shell=0;shell<=1;shell++)for(let j=0;j<=8;j++)for(const t of [0,1]){
      const f=j*Math.PI/8,rad=r+shell*.015,h=-Math.sin(f)*rad,x=Math.cos(f)*rad;
      p.push(a[0]+dx*t+nx*x,a[1]+(b[1]-a[1])*t+h,a[2]+dz*t+nz*x);
      const v=p.length/3-1;
      if(j&&t){if(shell)idx.push(v-3,v-2,v,v-3,v,v-1);else idx.push(v-3,v,v-2,v-3,v-1,v);}
    }
    idx.push(0,1,19,0,19,18,16,34,35,16,35,17);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();
    k.stamp(g,0xb59c60,0,0,0);g.dispose();
    const strip=new T.BufferGeometry(),stream=[];
    for(const t of [0,1])for(const side of [-1,1]){
      const d=side*r*.48;stream.push(a[0]+dx*t+nx*d,a[1]+(b[1]-a[1])*t-r*.86,a[2]+dz*t+nz*d);
    }
    strip.setAttribute('position',new T.Float32BufferAttribute(stream,3));strip.setIndex([0,2,3,0,3,1]);strip.computeVertexNormals();
    k.stamp(strip,0x91a393,0,0,0);strip.dispose();
  }
  function bankwork(T,k,wheels){
    const A=window.CentralArch,log=0x776044,tan=0xa38b5c,lash=0x594e39;
    const rod=(color,a,b,r)=>A.strut(T,k,color,...a,...b,r);
    const fixtures=[];
    for(const [i,z,r,w] of [[0,-15.0,2.19,.91],[1,-8.67,1.95,.85],[2,-2.72,2.11,.91],[3,3.52,2.29,.95],[4,10.44,2.09,.89],[5,16.65,1.93,.83]]){
      const x=axis(z),a=Math.atan2(axis(z+1)-axis(z-1),2),pivot=r-.13,east=i===2||i===4?-1:1;
      const start=k.vertexCount();const children=k.place(x,z,a,()=>{
        const stand=.83;
        for(const s of [-1,1]){
          const xx=s*stand;
          for(const dz of [-.42,.42])rod(log,[xx+s*.23,-.32,dz],[xx,pivot+.12,0],.077);
          rod(log,[xx-.16,pivot-.08,0],[xx+.16,pivot-.08,0],.12);
          for(const y of [pivot-.17,pivot-.12])rod(lash,[xx-.12,y,0],[xx+.12,y,0],.019);
        }
        const catchY=1.83*r-.22;
        gutter(T,k,[east*(w/2+.08),catchY+.035,-1.01],[east*(w/2+.08),catchY-.01,.19],.14);
        gutter(T,k,[east*(w/2+.08),catchY-.04,-.37],[east*1.63,catchY-.07,-.37],.15);
        const length=4.7+2.3*seed(i+51),end=[east*length,catchY-.43,-.37+i*.14];
        gutter(T,k,[east*1.55,catchY-.1,-.37],end,.097);
        for(const xx of [1.52,length*.80]){
          const y=catchY-.10-(xx-1.5)*.065;
          rod(tan,[east*xx-.15,-.24,-.54],[east*xx,y,-.35],.045);
          rod(tan,[east*xx+.21,-.21,-.04],[east*xx,y,-.35],.052);
        }
        const rotor=wheel(T,r,w,i+90,east);rotor.position.y=pivot;rotor.castShadow=rotor.receiveShadow=true;
        const frame=new T.Group();frame.add(rotor);k.group.add(frame);wheels.push({rotor,r,phase:i*.49});
      });
      fixtures.push({x,z,start,end:k.vertexCount(),children});
    }
    // Short plank walk along the west bank, as seen beside the row in the local guide's photo.
    for(let z=-17;z<8;z+=1.9){
      const x=axis(z)-2.04,a=Math.atan2(axis(z+1)-axis(z-1),2),start=k.vertexCount();
      const children=k.place(x,z,a,()=>{
        for(const s of [-1,1]){rod(log,[s*.38,-.44,0],[s*.38,.59,0],.061);k.box(log,s*.37,.49,0,.099,.12,1.94);}
        for(let j=0;j<7;j++)k.box(j%3?0xb8a27e:0xa99271,0,.58,(j-3)*.271,.99,.085,.258);
      });fixtures.push({x:axis(z),z,start,end:k.vertexCount(),children});
    }
    return fixtures;
  }
  function landscape(T,k){
    const p=[],cols=[],idx=[],uv=[],color=new T.Color(),surface=[];
    const palette=[0x8c9d53,0x8eaa50,0xa4b45f,0x98aa54,0x7c9c4e,0x899c57,0xa6a664,0xacca69];
    function add(a,b,c,tint,depth=0){
      const length=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1]);
      const lens=[length(a,b),length(b,c),length(c,a)],max=Math.max(...lens);
      if(max>6&&depth<8){
        const pts=[a,b,c],i=lens.indexOf(max),u=pts[i],v=pts[(i+1)%3],w=pts[(i+2)%3],m=[(u[0]+v[0])/2,(u[1]+v[1])/2];
        add(u,m,w,tint,depth+1);add(m,v,w,tint,depth+1);return;
      }
      const start=p.length/3;
      for(const [x,z] of [a,b,c]){p.push(x,.22,z);color.setHex(tint);cols.push(color.r,color.g,color.b);uv.push(x/11,z/11);}
      idx.push(start,start+1,start+2);
    }
    for(const [i,poly] of plots.entries()){
      const faces=T.ShapeUtils.triangulateShape(poly.map(([x,z])=>new T.Vector2(x,z)),[]);
      for(const [a,b,c] of faces)add(poly[a],poly[b],poly[c],palette[(i*7)%palette.length]);
    }
    const canvas=document.createElement('canvas');canvas.width=canvas.height=192;
    const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(192,192);
    for(let y=0;y<192;y++)for(let x=0;x<192;x++){
      const a=x*tau/192,b=y*tau/192,q=4*Math.cos(11*a+.65*Math.sin(2*b))+5*Math.cos(a+2*b)+9*(seed(y*192+x)-.5);
      pixels.data.set([220+q,225+q,189+q,255],(y*192+x)*4);
    }
    ctx.putImageData(pixels,0,0);
    for(let i=0;i<2900;i++){
      const x=seed(i)*192,y=seed(i+318)*192;
      ctx.strokeStyle=['#cdcda7','#e5e4bc','#fbf3ca','#c0c699'][i%4];ctx.lineWidth=.56+seed(i-35);
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+1.1,y-1.8-seed(i+52)*2.4);ctx.stroke();
    }
    const fieldmap=new T.CanvasTexture(canvas);fieldmap.colorSpace=T.SRGBColorSpace;fieldmap.wrapS=fieldmap.wrapT=T.RepeatWrapping;fieldmap.anisotropy=4;
    const fields=mesh(T,p,cols,idx,new T.MeshLambertMaterial({vertexColors:true,map:fieldmap,side:T.DoubleSide}),uv);fields.receiveShadow=true;k.group.add(fields);surface.push([fields.geometry,'field']);
    const soil=[0x807154,0x8c8059,0x809449,0x8b9854];
    for(const side of [-1,1]){
      const p=[],c=[],idx=[];
      for(let i=0;i<=54;i++){
        const z=reachStart-18+i*1.6,x=axis(z),w=widths(z),end=smooth(Math.min(z-reachStart+2,reachEnd+2-z)/2);
        for(const [j,[out,h]] of [[-.1,-.03],[.20,.09],[.64,.28],[1.10,.37],[2.1,.32],[4.4,.26],[7.5,.18],[11,.14],[16,.07],[23,.035],[31,.02],[41,.012]].entries()){
          p.push(x+side*(w+out),h*end,z);color.setHex(soil[Math.min(j,3)]).multiplyScalar(.88+.10*seed(i*9+j));c.push(color.r,color.g,color.b);
          const v=p.length/3-1;if(j&&i)idx.push(v-13,v-1,v,v-13,v,v-12);
        }
      }
      const uv=[];for(let j=0;j<p.length;j+=3)uv.push(p[j]/7,p[j+2]/7);
      const m=mesh(T,p,c,idx,new T.MeshLambertMaterial({map:fieldmap,side:T.DoubleSide,vertexColors:true}),uv);m.receiveShadow=true;k.group.add(m);surface.push([m.geometry,'bank']);
    }
    const wp=[],wc=[],wi=[],wuv=[];
    for(let i=0;i<=50;i++){
      const z=reachStart+i,x=axis(z),w=widths(z);
      for(let j=0;j<=4;j++){
        const xx=x+(j-2)*w*.5;wp.push(xx,0,z);wuv.push(xx,z);
        color.setHex(j===0||j===4?0x818567:0x567c70);wc.push(color.r,color.g,color.b);
        const v=wp.length/3-1;if(j&&i)wi.push(v-6,v-1,v,v-6,v,v-5);
      }
    }
    const water=new T.MeshPhongMaterial({vertexColors:true,side:T.DoubleSide,specular:0x57766a,shininess:31}),clock={value:0};
    water.onBeforeCompile=shader=>{
      shader.uniforms.streamTime=clock;
      shader.vertexShader='varying vec2 streamXZ;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nstreamXZ=position.xz;');
      shader.fragmentShader='varying vec2 streamXZ; uniform float streamTime;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        vec2 uv=streamXZ;float t=uv.y*7.0+1.35*sin(uv.x*3.3+uv.y*.51)-streamTime*2.4;
        float ripple=pow(max(0.,cos(t)),11.)*(1.-smoothstep(.3,1.6,fwidth(t)));
        diffuseColor.rgb+=vec3(.042,.056,.047)*ripple*(.55+.45*sin(uv.x*4.5+uv.y*.43));`);
    };
    const stream=mesh(T,wp,wc,wi,water,wuv);stream.receiveShadow=true;k.group.add(stream);surface.push([stream.geometry,'water']);
    return {surface,clock};
  }
  function riceAndReeds(T,k){
    // Low planted rows and the wilder grass on the channel banks interrupt the
    // field edges; keep water, paddles and the visitor walkway unobstructed.
    const p=[],col=[],idx=[],t=new T.Color(),pose=new T.Object3D(),rows=[];
    for(let l=0;l<9;l++){
      const a=l*2.399,dx=Math.cos(a),dz=Math.sin(a),x=dx*.067,z=dz*.067,h=.35+.20*seed(l),w=.012+.010*seed(l+11),sway=.13+.14*seed(l+2),start=p.length/3;
      for(let i=0;i<=3;i++){
        const u=i/3,ww=w*(1-u*.96),px=x+dx*sway*u*u,pz=z+dz*sway*u*u;
        for(const side of [-1,1]){
          p.push(px-dz*ww*side,h*(u-.19*u*u),pz+dx*ww*side);
          t.setHex([0x698343,0x869647,0xa59c52,0xbbb46d][i]);col.push(t.r,t.g,t.b);
        }
        if(i){const j=start+i*2;idx.push(j-2,j-1,j,j-1,j+1,j);}
      }
    }
    function contains(poly,x,z){
      let inside=false;
      for(let i=0,j=poly.length-1;i<poly.length;j=i++){
        const [ax,az]=poly[i],[bx,bz]=poly[j];if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)inside=!inside;
      }return inside;
    }
    for(let j=-49;j<=49;j++)for(let i=-49;i<=49;i++){
      const n=(j+70)*141+i+62,x=i*.63+seed(n)*.13,z=j*.67+seed(n+32)*.18,d=Math.abs(x-axis(z));
      if(d<3.55||!plots.some(poly=>contains(poly,x,z)))continue;
      rows.push([x,z,.89+seed(n+91)*.46,n]);
    }
    for(let i=0;i<640;i++){
      const z=reachStart-3+seed(i+4)*(reachEnd-reachStart+6),x=axis(z)+(i%2?1:-1)*(widths(z)+.33+seed(i+331)*1.22);
      if(x<axis(z)&&z>-17.9&&z<9.1&&Math.abs(x-axis(z)+2.04)<.59)continue;
      rows.push([x,z,1.0+seed(i+61)*1.14,10000+i]);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    const normals=g.attributes.normal;
    for(let i=0;i<normals.count;i++){
      const x=normals.getX(i)*.67,z=normals.getZ(i)*.67;normals.setXYZ(i,x,Math.sqrt(Math.max(0,1-x*x-z*z)),z);
    }
    const m=new T.InstancedMesh(g,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}),rows.length);
    rows.forEach(([x,z,h,n],i)=>{
      pose.position.set(x,0,z);pose.rotation.y=n*2.40;pose.scale.setScalar(h);pose.updateMatrix();m.setMatrixAt(i,pose.matrix);
    });
    k.group.add(m);return m;
  }
  function planting(T,k){
    const groves=[],leaves=[],colors=[],indices=[],stems=[],color=new T.Color();
    // Banana clumps line portions of the field channel. Keep the open paddy vistas.
    for(const [j,[cx,cz,h]] of [[-4.2,-12,4.1],[-4.5,-13,3.3],[-4.1,-11.15,3.1],[-4.4,14,3.9],[-4.0,15.3,3.4],[4.3,-29.8,3.8],[4.5,-32,4.1],[-4.1,38,3.7],[-4.3,39,3.1]].entries()){
      const x=axis(cz)+cx;stems.push([x,cz,h]);
      for(let l=0;l<8;l++){
        const a=l*2.399+j*.76,len=h*(.44+.13*seed(l+61)),lift=.44+.60*seed(l+j),off=leaves.length/3;
        for(let i=0;i<=8;i++){
          const t=i/8,rad=len*t,w=len*.134*Math.sin(Math.PI*t)**.72,mid=h*.79+lift*Math.sin(Math.PI*t)-.52*t*t;
          for(let side=-1;side<=1;side++){
            const ww=side*w*(1-.17*seed(i+l*11));
            leaves.push(x+Math.sin(a)*rad+Math.cos(a)*ww,mid-Math.abs(ww)*.39,cz+Math.cos(a)*rad-Math.sin(a)*ww);
            color.setHex(!side?0x94a058:i%2?0x6f8f46:0x80a050);colors.push(color.r,color.g,color.b);
          }
          if(i)for(let b=0;b<2;b++){const v=off+i*3+b;indices.push(v-3,v,v+1,v-3,v+1,v-2);}
        }
      }
    }
    const bananas=mesh(T,leaves,colors,indices,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}));k.group.add(bananas);
    for(const [x,z,h] of stems)k.tapered(0x98a25b,x,h*.40,z,.094,.056,h*.80,1,7);
    for(const [cx,cz,w,d,count,h] of [[-107,-86,53,45,51,8.8],[124,-34,57,136,77,10],[13,148,165,38,82,10],[-98,80,30,26,18,7.1]]){
      for(let i=0;i<count;i++){
        const x=cx+w*(seed(i+count)-.5),z=cz+d*(seed(i+87)-.5),height=h*(.65+.50*seed(i+61));
        groves.push([x,0,z,height*.75,height,i*2.399]);
      }
    }
    const before=k.group.children.length,trees=createTreeModels(T);trees.grove(k.group,groves);
    // The wooded slopes immediately east and south of the field roads bound
    // the valley in imagery. Leave the stream's alluvial floor open to the west.
    const distant=[[],[],[],[]],pose=new T.Object3D();
    for(let zi=-29;zi<=32;zi++)for(let xi=-28;xi<=36;xi++){
      const i=(zi+31)*71+xi+29,x=(xi+seed(i+31)-.5)*8.1,z=(zi+seed(i+87)-.5)*8.1;
      const east=106+25*Math.sin(z/78+.7),south=121-18*Math.sin(x/86);
      if(x<east&&z<south)continue;
      const h=7+seed(i+510)*6.4;distant[i%4].push([x,z,h,i]);
    }
    for(let v=0;v<4;v++){
      const rows=distant[v],m=new T.InstancedMesh(trees.distantGeometry('tree',v),trees.billboardMaterial(),rows.length);
      rows.forEach(([x,z,h,i],j)=>{
        pose.position.set(x,0,z);pose.rotation.y=i*2.399;pose.scale.set(h*.84,h,h*.84);pose.updateMatrix();
        m.setMatrixAt(j,pose.matrix);m.setColorAt(j,new T.Color(.74,.89,.78));
      });k.group.add(m);
    }
    return {groves:k.group.children.slice(before),bananas:bananas.geometry};
  }
  function build(T,k){
    const wheels=[],quiet=matchMedia('(prefers-reduced-motion: reduce)'),A=bankwork(T,k,wheels),{surface,clock}=landscape(T,k);
    const firstStem=k.vertexCount(),{groves,bananas}=planting(T,k),lastStem=k.vertexCount(),rice=riceAndReeds(T,k),rest=new WeakMap();
    function baseline(a){if(!rest.has(a))rest.set(a,a.array.slice());return rest.get(a);}
    function rebox(g){g.attributes.position.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();}
    // The visitor's mill row is too narrow for the coarse valley DEM. Carry its
    // water, bearings and adjacent bank together; fit the outer paddies to terrain.
    k.group.userData.fitGround=ground=>{
      let high=-Infinity;
      for(let z=reachStart;z<=reachEnd;z+=2)for(const dx of [-1.5,0,1.5])high=Math.max(high,ground(axis(z)+dx,z)+z*.011);
      const level=z=>high+.19-z*.011;
      function field(x,z){
        const native=ground(x,z),d=Math.abs(x-axis(z));
        const along=1-smooth(Math.max(0,reachStart-z,z-reachEnd)/18),across=1-smooth(Math.max(0,d-2.05)/34);
        return native+Math.max(0,level(z)-native)*along*across;
      }
      const drawing=k.group.children.find(m=>m.geometry?.hasAttribute('finishKind'))?.geometry;
      if(drawing){
        const p=drawing.attributes.position,a=baseline(p);
        for(const {x,z,start,end,children} of A){
          const y=level(z);
          for(let i=start;i<end;i++)p.setY(i,a[3*i+1]+y);
          for(const child of children)child.position.y=y;
        }
        for(let i=firstStem;i<lastStem;i++)p.setY(i,a[3*i+1]+field(a[3*i],a[3*i+2]));
        rebox(drawing);
      }
      for(const [g,kind] of [...surface,[bananas,'leaf']]){
        const p=g.attributes.position,a=baseline(p);
        for(let i=0;i<p.count;i++){
          const x=a[3*i],z=a[3*i+2],soil=kind==='water'?level(z):field(x,z);
          p.setY(i,a[3*i+1]+soil);
        }
        rebox(g);g.computeVertexNormals();
      }
      for(const m of [...groves,rice]){
        const a=baseline(m.instanceMatrix),b=m.instanceMatrix.array;
        for(let i=12;i<a.length;i+=16){
          const x=a[i],z=a[i+2],d=Math.abs(x-axis(z)),tuft=m===rice;
          b[i+1]=a[i+1]+(tuft?field(x,z)+(d<3.55?.30:.23):ground(x,z));
        }
        m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
      }
    };
    for(const {rotor,r,phase} of wheels)rotor.onBeforeRender=()=>{
      const t=quiet.matches?0:(performance.now()%600000)*.001;
      rotor.rotation.x=phase-t*.26/r;rotor.updateMatrixWorld(true);clock.value=t;
    };
  }
  const shot=(name,x,z,h,r,a,e)=>({name,offset:[x,z],height:h,viewRadius:r,viewAngle:a,viewElevation:e,viewBase:'monument'});
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Guồng nước suối Chàm – Pù Luông',province:'Thanh Hóa',city:'Thanh Hóa',locality:'Bá Thước',region:'Trung Bộ',kind:'Tham quan',
    lon:105.21111,lat:20.38135,start:[105.2107981,20.3802488],source,photo,map:'https://www.openstreetmap.org/node/13508679485',
    width:14,depth:43,yaw:0,foundationAt:[-5.5,26],gardenRadius:25,solids:[],mappedEntrance:true,visitOnArrival:true,approachMeters:140,
    reserve:(x,z,p)=>z>-30-p&&z<40+p&&Math.abs(x-axis(z))<5+p,
    description:'Bên suối Chàm, người Thái dẫn nước qua mương giữa ruộng. Những bánh tre quay theo dòng, nâng nước trong các ống nghiêng ở vành rồi đổ vào máng cao để tưới. Cảnh tái hiện một đoạn dãy guồng. Kích thước, khoảng cách giữa các bánh và độ dốc mặt nước là ước lượng.',
    arrivalNote:'Xe dừng trên đường làng ở phía nam cánh đồng. Từ đây đi bộ theo lối bên mương khoảng 140 m đến dãy guồng.',
    views:[shot('Dãy guồng tre giữa những thửa ruộng',0,1,5.9,20.5,-1.06,.19),
      shot('Ống múc nước và máng dẫn',-.30,3.6,7.35,6.8,2.22,.12)],build});
})();

export default window.VietnamSights;
