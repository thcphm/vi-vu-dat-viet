'use strict';
(()=>{
  const id='bai-mon-mui-dien',catalogId='osm-way-160203374';
  const raw=window.VietnamTourism.byId.get(catalogId);
  if(!raw)return;
  // North-up trace of the sand, lagoon and rock margins, centred at 109.45227 E,
  // 12.89712 N. The stream's broad southern bend migrates across the sand.
  // OSM w160203374 and w909041149 locate the beach and its outlet, but do
  // not record this low-water outline. Tour 46 nodes 4, 6 and 10 show the
  // two headlands, flat foreshore and concrete walk with a green seaward rail.
  const local=([u,v])=>[(u-539.95)*.58210,(v-499.60)*.57991];
  const trace=p=>p.map(local);
  const shore=trace([[325,54],[339,86],[353,122],[375,164],[402,210],[433,254],[469,301],[508,353],
    [548,394],[595,438],[638,471],[679,498],[724,520],[759,539],[793,555],[815,573]]);
  const back=trace([[824,583],[801,597],[780,595],[749,603],[714,610],[694,604],[677,587],[664,576],
    [646,568],[625,571],[608,580],[591,601],[584,621],[580,650],[566,686],[541,710],[505,724],[459,738],
    [408,754],[379,771],[348,790],[302,808],[262,829],[231,853],[213,883],[194,919],[175,967],[139,1002],
    [128,961],[153,900],[173,856],[152,817],[119,782],[134,743],[144,707],[176,677],[200,637],[220,601],
    [212,564],[183,529],[160,480],[171,447],[191,427],[197,398],[200,376],[214,341],[224,317],[244,300],
    [246,264],[264,250],[271,259],[281,253],[279,237],[252,226],[258,206],[282,196],[264,182],[278,149],[299,112]]);
  const sand=[...shore,...back];
  const river=trace([[173,968],[181,927],[196,892],[210,864],[234,837],[259,822],[288,814],[315,801],[347,791],
    [378,773],[405,754],[461,736],[509,721],[539,709],[560,691],[578,653],[583,622],[590,601],[604,582],
    [625,570],[646,568],[663,575],[679,589],[694,604],[713,609],[744,605],[774,593],[790,588],[801,598],
    [815,583],[821,571],[830,558],[836,551],[831,579],[821,598],[803,611],[781,618],[750,631],[719,637],
    [695,637],[671,638],[650,631],[633,638],[611,643],[599,655],[591,675],[575,700],[545,718],[517,732],
    [463,749],[412,766],[388,781],[356,805],[316,822],[287,831],[261,846],[235,867],[221,890],[206,925],[187,973]]);
  // Pebbles and broken outcrops occupy narrow bands at the base of each
  // wooded slope. Keep open water and the broad central sand clear of them.
  const rockSouth=trace([[816,585],[837,554],[843,529],[853,510],[874,490],[901,470],[929,460],[954,438],
    [977,428],[1008,404],[1034,404],[1077,381],[1120,359],[1144,341],[1166,330],[1175,355],[1142,390],
    [1094,414],[1082,436],[1034,460],[1017,472],[980,485],[955,509],[923,528],[902,531],[884,556],[863,573],[838,593]]);
  const rockNorth=trace([[287,135],[301,105],[299,81],[310,43],[332,17],[362,-23],[391,-63],[414,-104],
    [456,-137],[469,-151],[485,-151],[466,-120],[447,-97],[424,-72],[404,-32],[377,3],[365,35],[343,56],[330,87],[314,112]]);
  const ledge=trace([[753,647],[768,638],[821,610],[829,598],[837,586],[846,579],[862,571],[880,559],
    [883,549],[887,546],[891,543],[920,532],[951,515],[961,503],[995,485],[1045,464],[1082,451],
    [1093,450],[1105,446],[1107,439],[1115,436],[1127,433],[1137,433]]);
  const bushesSouth=trace([[198,953],[213,885],[260,849],[321,830],[371,809],[408,780],[470,757],[518,744],
    [546,725],[578,706],[605,673],[625,655],[675,653],[706,649],[766,637],[810,618],[855,592],[901,558],
    [931,533],[961,513],[998,496],[1061,469],[1110,451],[1158,452],[1230,500],[1200,775],[980,896],[650,1030],[360,1150]]);
  const bushesNorth=trace([[263,134],[297,76],[337,17],[375,-30],[432,-104],[454,-147],[354,-167],[239,-79],
    [164,76],[118,194],[78,345],[33,490],[34,704],[52,891],[115,891],[122,827],[102,780],[127,702],
    [166,660],[193,616],[200,585],[169,543],[139,494],[140,465],[153,434],[171,397],[192,339],[214,285],[233,220]]);
  const wide=points=>points.map(([x,z])=>local([x*2-822,z*2-531]));
  // Vegetated capes and hillside from the wider aerial. Their open margins
  // stop short of QL29, the entrance clearing, the tide line and the light.
  const highway=[[314,778],[337,743],[364,685],[381,638],[389,602],[401,495],[406,461],[414,430],[423,404],
    [435,359],[447,297],[454,277],[465,260],[548,146],[563,116],[571,93],[589,-10],[596,-38],[609,-64],
    [630,-99],[643,-128],[648,-160],[647,-173]];
  const northSlope=wide([[810,-173],[730,26],[675,151],[645,203],[602,244],[573,282],
    [553,325],[532,366],[521,402],[496,461],[491,497],[484,513],[493,544],[503,562],
    [507,578],[484,626],[482,653],[450,682],[411,737],[375,775],...highway.map(([x,z])=>[x+12,z])]);
  const inland=wide([...highway.map(([x,z])=>[x-12,z]),[-135,-210],[-210,825]]);
  const southSlope=wide([[487,702],[545,679],[605,655],[666,637],[703,621],[715,604],[730,589],
    [751,596],[796,578],[816,576],[839,550],[858,529],[893,509],[937,475],[965,452],[993,451],
    [1035,449],[1062,447],[1080,460],[1050,510],[1038,568],[1042,626],[1056,680],[1102,740],
    [1040,862],[760,959],[480,922],[430,835]]);
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const noise=i=>{const n=Math.sin(i*127.13+1.63)*42758.61;return n-Math.floor(n);};
  function within(poly,x,z){
    let inside=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const [a,b]=poly[j],[c,d]=poly[i];if((b>z)!==(d>z)&&x<a+(c-a)*(z-b)/(d-b))inside=!inside;
    }
    return inside;
  }
  function distance(line,x,z){
    let best=1e10;
    for(let i=1;i<line.length;i++){
      const [a,b]=line[i-1],[c,d]=line[i],dx=c-a,dz=d-b;
      const f=clamp(((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz));best=Math.min(best,(x-a-f*dx)**2+(z-b-f*dz)**2);
    }return Math.sqrt(best);
  }
  function material(T,color,finish){
    const mat=new T.MeshLambertMaterial({color,vertexColors:true,side:T.DoubleSide});
    mat.onBeforeCompile=s=>{
      s.vertexShader='varying vec2 bayUv;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbayUv=position.xz;');
      s.fragmentShader=`varying vec2 bayUv;
        float bh(vec2 p){return fract(sin(dot(p,vec2(17.17,89.79)))*43751.89);}
        float bn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
          return mix(mix(bh(i),bh(i+vec2(1,0)),f.x),mix(bh(i+vec2(0,1)),bh(i+1.),f.x),f.y);}\n`+s.fragmentShader.replace('#include <color_fragment>',
        '#include <color_fragment>\n'+finish);
    };
    mat.customProgramCacheKey=()=>finish;return mat;
  }
  function patch(T,k,outline,mat,colour,spacing,alpha){
    const verts=[],idx=[],rgb=[],keyed=new Map(),colourAt=new T.Color();
    function point(p){
      const key=p[0].toFixed(3)+','+p[1].toFixed(3);let n=keyed.get(key);if(n!==undefined)return n;
      n=verts.length/3;keyed.set(key,n);verts.push(p[0],0,p[1]);colour(p[0],p[1],colourAt);rgb.push(colourAt.r,colourAt.g,colourAt.b);return n;
    }
    const len=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2;
    function tri(a,b,c){
      const ab=len(a,b),bc=len(b,c),ca=len(c,a),long=Math.max(ab,bc,ca);
      if(long<=spacing*spacing){idx.push(point(a),point(c),point(b));return;}
      if(ab<long){if(bc===long)tri(b,c,a);else tri(c,a,b);return;}
      const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];tri(a,m,c);tri(m,b,c);
    }
    for(const f of T.ShapeUtils.triangulateShape(outline.map(([x,z])=>new T.Vector2(x,z)),[]))tri(...f.map(i=>outline[i]));
    const g=new T.BufferGeometry(),v=new T.Float32BufferAttribute(verts,3);g.setAttribute('position',v);
    if(alpha){
      const fade=[];for(let i=0;i<verts.length;i+=3)fade.push(alpha(verts[i],verts[i+2]));
      g.setAttribute('bayFade',new T.Float32BufferAttribute(fade,1));
    }
    g.setAttribute('color',new T.Float32BufferAttribute(rgb,3));g.setIndex(idx);g.computeVertexNormals();
    const m=new T.Mesh(g,mat);m.receiveShadow=true;if(alpha)m.renderOrder=4;k.group.add(m);
    return fn=>{for(let i=0;i<v.count;i++)v.setY(i,fn(v.getX(i),v.getZ(i)));v.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();};
  }
  function terrain(T,k){
    const sandMat=material(T,0xffffff,`float broad=bn(bayUv*.23),fine=bn(bayUv*2.1);
      float ripple=sin(bayUv.y*12.+bayUv.x*3.8+bn(bayUv*.76)*6.);
      float nearDetail=1.-smoothstep(.1,.8,length(fwidth(bayUv)));
      diffuseColor.rgb*=.94+.055*broad+.047*fine+.017*ripple*nearDetail;`);
    const pale=new T.Color(0xe5cd9e),wet=new T.Color(0xaf9672);
    const sandFit=patch(T,k,sand,sandMat,(x,z,c)=>{
      const surf=distance(shore,x,z),fresh=distance(river,x,z),a=clamp(Math.min(surf/13,fresh/3.7));
      c.copy(wet).lerp(pale,.08+.92*a).multiplyScalar(.98+.04*Math.sin(x*.04-z*.067));
    },7.25);
    const waterMat=material(T,0xffffff,`float wav=bn(vec2(bayUv.x*.55+bayUv.y*.13,bayUv.y*3.1));
      diffuseColor.rgb*=.92+.16*wav;
      diffuseColor.rgb+=vec3(.014,.018,.012)*smoothstep(.72,.89,wav);`);
    const outer=local([812,582]),pond=new T.Color(0x808b6b),green=new T.Color(0x435e4b);
    const freshFit=patch(T,k,river,waterMat,(x,z,c)=>c.copy(pond).lerp(green,clamp((Math.hypot(x-outer[0],z-outer[1])-63)/116)),3.5);
    const southBank=trace([[830,558],[831,579],[821,598],[803,611],[781,618],[750,631],[719,637],[695,637],
      [671,638],[650,631],[633,638],[611,643],[599,655],[591,675],[575,700],[545,718],[517,732],[463,749],
      [412,766],[388,781],[356,805],[316,822],[287,831],[261,846],[235,867],[221,890],[206,925],[187,973],
      [207,978],[232,925],[250,889],[272,864],[306,848],[344,835],[392,805],[427,784],[486,770],
      [533,749],[565,732],[598,707],[622,670],[652,659],[694,655],[725,655],[770,643],[807,624],[840,596],[856,566]]);
    const sandBankFit=patch(T,k,southBank,sandMat,(x,z,c)=>c.copy(wet).lerp(pale,.42+.17*Math.sin(x*.12+z*.06)),4.5);
    // Restrict the wash to the sand margin. Offshore water belongs to the
    // shared sea renderer. White flecks break up into the shallows.
    const band=shore.map(([x,z],i)=>{
      const a=shore[Math.max(i-1,0)],b=shore[Math.min(i+1,shore.length-1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);
      const width=86;return [x+width*dz/l,z-width*dx/l];
    });
    const washMat=material(T,0xffffff,`float ripple=bn(vec2(bayUv.x*.23+bayUv.y*.14,bayUv.y*.78));
      diffuseColor.rgb*=.92+.12*ripple;
      diffuseColor.a*=bayOpacity;`);washMat.transparent=true;washMat.depthWrite=false;
    const compileWash=washMat.onBeforeCompile;
    washMat.onBeforeCompile=s=>{
      compileWash(s);s.vertexShader='attribute float bayFade;varying float bayOpacity;\n'+s.vertexShader.replace('bayUv=position.xz;','bayUv=position.xz;bayOpacity=bayFade;');
      s.fragmentShader='varying float bayOpacity;\n'+s.fragmentShader;
    };
    const foam=new T.Color(0xe3e1c8),surfTint=new T.Color(0xaabb9a),outerTint=new T.Color(0x48796f);
    const washFit=patch(T,k,[...shore,...band.reverse()],washMat,(x,z,c)=>{
      const d=distance(shore,x,z),breaking=.44+.48*Math.sin(x*.33+z*.14+.61*Math.cos(z*.32));
      c.copy(surfTint).lerp(outerTint,clamp(d/37)).lerp(foam,clamp(1-Math.abs(d-1.28)/1.3)*breaking);
    },3.65,(x,z)=>{const d=distance(shore,x,z),t=clamp((d-44)/38);return 1-t*t*(3-2*t);});
    const mountainMat=material(T,0xffffff,`float growth=.48*bn(bayUv*.26)+.32*bn(bayUv*.81)+.20*bn(bayUv*1.91);
      diffuseColor.rgb*=.76+.39*growth;`);
    const darkLeaf=new T.Color(0x476443),paleLeaf=new T.Color(0x75804d);
    const slopes=[northSlope,inland,southSlope].map(poly=>patch(T,k,poly,mountainMat,(x,z,c)=>{
      const n=.5+.24*Math.sin(x*.072+Math.cos(z*.045))+.21*Math.sin(z*.041+x*.017);
      c.copy(darkLeaf).lerp(paleLeaf,n);
    },12.5));
    const gravel=new T.Color(0xa78862),lichen=new T.Color(0x858775);
    const rockBeds=[rockNorth,rockSouth].map(poly=>patch(T,k,poly,sandMat,(x,z,c)=>
      c.copy(gravel).lerp(lichen,.43+.35*Math.sin(z*.17+Math.sin(x*.19))),5.0));
    const streamAxis=trace([[178,967],[205,885],[243,847],[306,818],[353,796],[407,760],[513,726],[561,701],
      [584,663],[595,622],[613,600],[644,595],[673,610],[706,623],[752,618],[792,604],[814,587],[835,553]]);
    return (ground,level)=>{
      // A coarse coastal DEM includes the hillside in cells occupied by the
      // outlet. Keep the lagoon near sea level. Along its rocky south margin
      // higher ground can emerge as a bank, as in the low-water photograph.
      const profile=streamAxis.map(([x,z],i)=>i<7?Math.max(level+.45,ground(x,z)+.14):level+.41-.026*(i-7));
      for(let i=6;i>=0;i--)profile[i]=Math.max(profile[i],profile[i+1]);
      function streamLevel(x,z){
        let best=Infinity,h=level;
        for(let i=1;i<streamAxis.length;i++){
          const a=streamAxis[i-1],b=streamAxis[i],dx=b[0]-a[0],dz=b[1]-a[1];
          const t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)),d=(x-a[0]-t*dx)**2+(z-a[1]-t*dz)**2;
          if(d<best){best=d;h=profile[i-1]+(profile[i]-profile[i-1])*t;}
        }return h;
      }
      function sandSurface(x,z){
        const front=distance(shore,x,z),edge=distance(river,x,z),wind=clamp((front-38)/88)*clamp(edge/19);
        const dry=level+.06+Math.min(3.8,front*.034)+wind*(.53+.43*Math.sin(x*.054+z*.032))+.11*wind*Math.cos(x*.099-z*.11);
        const t=clamp(edge/19),bank=streamLevel(x,z)+.10+Math.min(.65,edge*.052);
        return Math.max(ground(x,z)+.22,bank+(dry-bank)*t*t*(3-2*t));
      }
      sandFit(sandSurface);
      freshFit(streamLevel);
      sandBankFit((x,z)=>Math.max(ground(x,z)+.18,streamLevel(x,z)+.06+Math.min(.54,distance(river,x,z)*.063)));
      // Keep the estuary and the immediately adjoining intertidal sea on a
      // common datum; beyond the nearshore band feather back to native water.
      washFit((x,z)=>{
        const t=clamp((distance(shore,x,z)-17)/62),offshore=ground(0,0)+.30;
        return Math.max(level+.19+(offshore-level)*t*t*(3-2*t),ground(x,z)+.21);
      });
      for(const fit of slopes)fit((x,z)=>ground(x,z)+.18);
      for(const fit of rockBeds)fit((x,z)=>ground(x,z)+.27);
      return sandSurface;
    };
  }
  function scrub(T,k){
    const anchor=[],rocks=[],foliage=[],grass=[];
    function scatter(poly,spacing,list,salt){
      const xs=poly.map(p=>p[0]),zs=poly.map(p=>p[1]);let i=salt;
      for(let z=Math.min(...zs);z<Math.max(...zs);z+=spacing)for(let x=Math.min(...xs);x<Math.max(...xs);x+=spacing){
        i++;const u=x+noise(i)*spacing,v=z+noise(i+2000)*spacing;if(within(poly,u,v)&&distance(ledge,u,v)>1.8)list.push([u,v,i]);
      }
    }
    scatter(rockSouth,4.0,rocks,13);scatter(rockNorth,4.3,rocks,891);
    scatter(bushesSouth,4.3,foliage,74);scatter(bushesNorth,4.4,foliage,74923);
    // Low patches on the older dune behind the active shore. In the beach
    // panorama the newer sand closer to the sea is nearly bare.
    const backDunes=[[[253,220],[286,208],[311,226],[320,258],[295,278],[277,242]],
      [[274,302],[312,303],[362,334],[395,379],[369,396],[336,352],[290,353]],
      [[400,387],[437,396],[481,430],[516,471],[492,469],[441,434]],
      [[260,453],[296,401],[339,396],[367,433],[342,483],[299,522]],
      [[396,512],[430,491],[476,506],[507,537],[545,546],[564,578],[541,577],[485,547],[443,540]],
      [[224,645],[270,621],[311,630],[347,650],[331,674],[291,672],[267,690],[237,676]]];
    backDunes.forEach((shape,i)=>scatter(trace(shape),2.72,grass,4800+i*200));
    const pose=new T.Object3D(),col=new T.Color();
    function instances(list,stone,variant){
      const g=new T.IcosahedronGeometry(1,stone?2:1),v=g.attributes.position,shades=[],hue=new T.Color();
      for(let i=0;i<v.count;i++){
        const x=v.getX(i),y=v.getY(i),z=v.getZ(i),wave=1+.13*Math.sin(x*5+y*3+z*7+variant);
        v.setXYZ(i,x*wave,stone?y*wave:y*(1+.19*Math.cos(x*9+z*3)),z*wave);
        const tint=clamp(.86+.15*y+.055*Math.sin(x*11+y*7+z*9),.64,1.05);hue.setRGB(tint,tint,tint);shades.push(hue.r,hue.g,hue.b);
      }g.setAttribute('color',new T.Float32BufferAttribute(shades,3));g.computeVertexNormals();
      const skin=new T.MeshLambertMaterial({color:0xffffff,vertexColors:true});
      skin.onBeforeCompile=s=>{
        s.vertexShader='varying vec3 coastP;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncoastP=(instanceMatrix*vec4(position,1.)).xyz;');
        s.fragmentShader=`varying vec3 coastP;
          float coastHash(vec2 q){return fract(sin(dot(q,vec2(24.416,87.51)))*36754.28);}
          float coastNoise(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);
            return mix(mix(coastHash(i),coastHash(i+vec2(1,0)),f.x),mix(coastHash(i+vec2(0,1)),coastHash(i+1.),f.x),f.y);}\n`+
          s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+(stone?`
            vec2 p=coastP.xz+coastP.y*vec2(.77,.46);
            float grain=.42*coastNoise(p*4.)+.33*coastNoise(p*14.)+.25*coastNoise(p*29.);
            diffuseColor.rgb*=.72+.47*grain+.11*coastNoise(p*.63);
            diffuseColor.rgb+=.057*smoothstep(.63,.80,grain);`:`
            vec2 p=coastP.xz+coastP.y*vec2(.56,.82);
            float leaf=.39*coastNoise(p*1.6)+.39*coastNoise(p*6.2)+.22*coastNoise(p*16.);
            diffuseColor.rgb*=.56+.78*leaf;diffuseColor.rgb+=vec3(.025,.033,.012)*smoothstep(.62,.72,leaf);`));
      };skin.customProgramCacheKey=()=>stone?'bai-mon-weathered-rock':'bai-mon-shrub-leaves';
      const m=new T.InstancedMesh(g,skin,list.length);k.group.add(m);
      const ramp=stone?[0xa4977c,0x8a8976,0xb0a28a,0x898779]:[0x536e3d,0x5d793d,0x425f36,0x658345,0x445f34];
      const y=[];
      list.forEach(([x,z,i],j)=>{
        const maxR=Math.max(.30,(distance(ledge,x,z)-1.38)/1.45);
        const r=Math.min(maxR,stone?.72+4.4*noise(i+922)**1.87:1.7+2.7*noise(i+34));
        const h=stone?r*(.40+.55*noise(i+223)):r*(.63+.65*noise(i+128));
        const dx=variant&&!stone?1.0:0,dz=variant&&!stone?.67:0;
        y.push([x+dx,z+dz,h*(stone?.18:.25)]);pose.position.set(x+dx,0,z+dz);
        pose.rotation.set(stone?(noise(i+45)-.5)*.51:0,noise(i+340)*6.28,(noise(i+16)-.5)*.36);
        pose.scale.set(r,h,r*(.72+noise(i+644)*.64));pose.updateMatrix();m.setMatrixAt(j,pose.matrix);
        m.setColorAt(j,col.setHex(ramp[Math.floor(noise(i+155)*ramp.length)]));
      });anchor.push([m,y]);
    }
    instances(rocks,true,0);instances(foliage,false,0);
    const blade=[],bladeTint=[];
    for(let i=0;i<23;i++){
      const a=noise(i+43)*6.283,r=noise(i+17)*.49,dx=Math.cos(a),dz=Math.sin(a),x=r*dx,z=r*dz,w=.018+noise(i+23)*.03;
      const h=.11+noise(i+51)*.23,lean=.12+noise(i+87)*.20;
      blade.push(x-w*dz,0,z+w*dx,x+w*dz,0,z-w*dx,x+dx*lean,h,z+dz*lean);
      bladeTint.push(.65,.62,.46,.67,.67,.50,.87,.83,.60);
    }
    const bg=new T.BufferGeometry();bg.setAttribute('position',new T.Float32BufferAttribute(blade,3));
    bg.setAttribute('color',new T.Float32BufferAttribute(bladeTint,3));bg.computeVertexNormals();
    const tufts=new T.InstancedMesh(bg,new T.MeshLambertMaterial({color:0xa9aa83,vertexColors:true,side:T.DoubleSide}),grass.length);
    const tuftsAt=[];grass.forEach(([x,z,i],j)=>{
      const s=.42+1.25*noise(i+67);pose.position.set(x,0,z);pose.rotation.set(0,noise(i)*6.28,0);
      pose.scale.set(s,s,s);pose.updateMatrix();tufts.setMatrixAt(j,pose.matrix);tuftsAt.push([x,z,0]);
    });k.group.add(tufts);anchor.push([tufts,tuftsAt]);
    return (ground,sandSurface)=>{for(const [m,y] of anchor){const a=m.instanceMatrix.array;for(let j=0;j<y.length;j++){
      const [x,z,h]=y[j];a[j*16+13]=(m===tufts?sandSurface(x,z)+.045:ground(x,z))+h;
    }m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();}};
  }
  function coastWalk(T,k){
    // Georeferenced section of w909041152. The node10 panorama looks along
    // this concrete ledge, with scrub, boulders and a tubular green railing.
    const line=[];
    for(let i=1;i<ledge.length;i++){
      const a=ledge[i-1],b=ledge[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2.25);
      for(let j=0;j<n;j++)line.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);
    }line.push(ledge.at(-1));
    const mesh=new T.Mesh(new T.BufferGeometry(),new T.MeshLambertMaterial({color:0xb3a88e,side:T.DoubleSide}));
    const idx=[],p=[],seaward=[];
    for(let i=0;i<line.length;i++){
      const [x,z]=line[i],a=line[Math.max(0,i-1)],b=line[Math.min(i+1,line.length-1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);
      for(const width of [-.83,.83])p.push(x+width*dz/l,0,z-width*dx/l);
      seaward.push([x+.73*dz/l,z-.73*dx/l]);
      if(i)idx.push(i*2-2,i*2-1,i*2,i*2-1,i*2+1,i*2);
    }
    const v=new T.Float32BufferAttribute(p,3),g=mesh.geometry;g.setAttribute('position',v);g.setIndex(idx);g.computeVertexNormals();k.group.add(mesh);
    const steel=new T.MeshLambertMaterial({color:0x60a799}),tube=new T.CylinderGeometry(1,1,1,7);
    const rails=new T.InstancedMesh(tube,steel,line.length*3-2);k.group.add(rails);
    const pose=new T.Object3D(),up=new T.Vector3(0,1,0);
    function bar(i,a,b,r){const d=new T.Vector3().subVectors(b,a);pose.position.copy(a).lerp(b,.5);pose.scale.set(r,d.length(),r);
      pose.quaternion.setFromUnitVectors(up,d.normalize());pose.updateMatrix();rails.setMatrixAt(i,pose.matrix);}
    return (ground,level)=>{
      let off=0,prev=null;
      for(let i=0;i<line.length;i++){
        const [x,z]=line[i],h=Math.max(level,ground(x,z),ground(v.getX(i*2),v.getZ(i*2)),ground(v.getX(i*2+1),v.getZ(i*2+1)))+.36;
        v.setY(i*2,h);v.setY(i*2+1,h);
        const [u,w]=seaward[i],a=new T.Vector3(u,h,w),b=new T.Vector3(u,h+.89,w),knee=new T.Vector3(u,h+.39,w);
        bar(off++,a,b,.047);if(prev){bar(off++,prev[0],b,.057);bar(off++,prev[1],knee,.030);}prev=[b,knee];
      }
      v.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();rails.instanceMatrix.needsUpdate=true;rails.computeBoundingSphere();
    };
  }
  function build(T,k){
    const fitBeach=terrain(T,k),fitScrub=scrub(T,k),fitWalk=coastWalk(T,k);
    let stamp='';
    k.group.userData.fitGround=ground=>{
      const key=[ground(0,0),ground(100,92),ground(-122,-175),ground(-155,141)].join('/');
      if(stamp===key)return;stamp=key;
      // At the headland the elevation grid includes the hill in several
      // low-water cells. One datum above those cells keeps water continuous
      // from the lagoon to the sea and preserves the bank gradient.
      const lip=trace([[755,622],[775,615],[799,601],[816,588],[824,575],[831,561],[837,546]]);
      const level=Math.max(ground(0,0)+.30,...lip.map(([x,z])=>ground(x,z)+.30));
      const sandSurface=fitBeach(ground,level);fitScrub(ground,sandSurface);fitWalk(ground,level);
      for(const v of views)v.height=(v.shoreFocus+level)/.46;
    };
  }
  function view(name,target,eye,focus,raise,fov){
    const t=local(target),p=local(eye),dx=p[0]-t[0],dz=p[1]-t[1],run=Math.hypot(dx,dz);
    return {name,offset:t,shoreFocus:focus,height:focus/.46,viewAngle:Math.atan2(dx,dz),viewElevation:Math.atan2(raise,run),
      viewRadius:Math.hypot(raise,run),viewFov:fov,viewBase:'monument'};
  }
  const views=[view('Toàn cảnh bờ cát và cửa suối Bãi Môn',[560,477],[1120,705],2.3,202,52),
    view('Khúc suối cuối trước khi ra biển',[687,611],[538,683],1.15,4.6,53),
    view('Dọc mép nước về Mũi Điện',[749,574],[414,287],6.0,-3.6,58),
    view('Theo lan can xanh xuống Bãi Môn',[855,528],[1002,482],3.25,8,63)];
  (window.VietnamSights??=[]).push({...raw,id,catalogId,name:'Bãi Môn dưới Mũi Điện',kind:'Bãi biển',
    lon:109.45227,lat:12.89712,city:'Hòa Xuân',province:'Đắk Lắk',formerProvince:'Phú Yên',
    start:raw.start,mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,
    map:'https://www.openstreetmap.org/way/160203374',photo:'https://daklakvrtour.com/tour/46/index.html#node6',
    source:'https://csdl.vietnamtourism.gov.vn/dest/?item=351',yaw:0,width:415,depth:505,solids:[],gardenRadius:0,
    reserve:(x,z)=>within(sand,x,z)||within(river,x,z)||within(rockNorth,x,z)||within(rockSouth,x,z),
    description:'Bờ cát Bãi Môn uốn cong khoảng 400 m giữa hai sườn núi. Con suối nước ngọt từ phía tây men theo chân núi phía nam rồi gặp biển. Từ lối bộ có lan can xanh bên ghềnh, có thể nhìn xuống cả vụng cát. Mép nước và bãi bồi được dựng theo một ảnh vệ tinh. Hình dáng cửa suối thay đổi theo mùa và thủy triều.',
    arrivalNote:'Rời Quốc lộ 29 theo đường vào khu đón khách dưới chân núi. Từ quầy vé đi bộ xuống bãi cát hoặc qua cầu ở lối lên hải đăng.',
    views,build});
})();
