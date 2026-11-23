'use strict';
(() => {
  const id='dam-o-loan-tuy-an',catalogId='osm-node-11779827836',pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Thiếu điểm ngắm đầm Ô Loan ở Tuy An');
  const source='https://daklakvrtour.com/dam-o-loan.html',vr='https://daklakvrtour.com/tour/104/index.html';
  const signPhoto='https://commons.wikimedia.org/wiki/File:%C4%90%E1%BA%A7m_%C3%94_Loan,_An_Hi%E1%BB%87p,_Tuy_An,_Ph%C3%BA_Y%C3%AAn.jpeg';
  // Survey 2026-11-23. n11779827836 is the landmark beside QL1, not the
  // centre of the water. n4472649089 is 40 km to the north near Cù Mông.
  // The sign pad at [109.251357,13.268565] is visible below panorama node1.
  // The point used for arrival is on w799591456 off the northbound carriageway.
  // Only the inscription panel is a crop of Linhcandng's Commons field photo,
  // CC BY-SA 3.0 https://creativecommons.org/licenses/by-sa/3.0/ (see signPhoto).
  // Plan of pad and grove, bunds, net pens and islet are checked against
  // the published aerials (node1, node2) and registered overhead imagery.
  // Small embankment elevations and the structure's verticals are estimates.
  // https://vietnamtourism.vn/index.php/tourism/items/2809/2
  // The two bridges seen in separate panoramas are beyond the authored assets.
  // Below, metres east and south of the western monument [109.251362,13.268567].
  // Outer lagoon simplified from w52577929 © OpenStreetMap contributors, ODbL.
  // https://www.openstreetmap.org/way/52577929
  const shore=[[3643,3530],[3538,3631],[3196,3684],[3085,3508],[3063,3278],[2986,3118],[2967,3007],[2968,2940],[3033,2833],[3052,2606],[3079,2529],[3164,2401],[3160,2375],[3074,2292],[2930,2200],[2846,2173],[2774,2193],[2772,2276],[2669,2421],[2626,2569],[2639,2773],[2665,2860],[2645,3016],[2217,2998],[2143,2496],[1920,2235],[1269,1770],[1213,1622],[1436,1305],[1139,1017],[1122,770],[1153,708],[1351,504],[1464,348],[1374,116],[1353,11],[1361,-96],[1323,-142],[1240,-156],[1172,-138],[1127,-92],[1124,108],[1026,244],[875,236],[642,122],[580,-29],[657,-201],[672,-364],[947,-587],[984,-729],[965,-773],[731,-937],[653,-1162],[476,-1331],[470,-1388],[544,-1534],[594,-1549],[615,-1544],[625,-1487],[827,-1346],[940,-1332],[1191,-1420],[1262,-1506],[1243,-1673],[1161,-1823],[1060,-1899],[957,-1910],[864,-1832],[735,-1643],[622,-1585],[546,-1592],[475,-1682],[459,-1756],[490,-1905],[460,-1993],[343,-2024],[296,-2000],[181,-2011],[171,-2030],[50,-2006],[26,-2048],[26,-1969],[-386,-2266],[-442,-2433],[-294,-2508],[116,-2359],[302,-2210],[370,-2261],[425,-2180],[464,-2198],[564,-2177],[692,-2182],[718,-2146],[828,-2208],[990,-2433],[1205,-2540],[1534,-2621],[1675,-2970],[1683,-3037],[1660,-3090],[1528,-3248],[1500,-3317],[1488,-3361],[1542,-3500],[1540,-3561],[1514,-3656],[1407,-3842],[1358,-4088],[1284,-4147],[1126,-4206],[945,-4214],[811,-4396],[791,-4501],[1176,-5074],[1548,-5223],[1790,-5204],[2013,-4888],[1920,-4516],[2087,-4349],[2478,-4256],[2738,-3939],[2980,-3344],[3166,-2805],[3631,-1857],[3780,-1689],[4044,-1636],[4097,-1644],[4113,-1698],[4190,-1697],[4257,-1759],[4295,-1848],[4285,-1866],[4398,-2089],[4362,-2153],[4293,-2142],[4242,-2161],[4150,-2302],[4098,-2412],[4106,-2564],[3842,-3145],[3731,-3315],[3631,-3754],[3450,-4102],[3259,-4774],[3078,-5168],[3053,-5404],[3100,-5583],[3042,-5893],[3016,-6319],[3019,-6563],[3040,-6622],[3067,-6975],[3171,-7234],[3238,-7309],[3266,-7292],[3309,-7308],[3522,-7459],[3537,-7512],[3508,-7587],[3536,-7618],[3861,-7722],[3918,-7662],[4021,-7626],[4055,-7567],[3935,-7468],[3978,-7518],[3993,-7580],[3903,-7594],[3729,-7472],[3646,-7317],[3556,-7243],[3420,-7025],[3297,-6795],[3248,-6605],[3240,-6490],[3278,-6041],[3352,-5446],[3556,-4888],[3705,-4330],[4303,-3007],[4417,-2916],[4530,-2766],[4616,-2565],[4672,-2354],[4692,-2079],[4664,-1905],[4546,-1768],[4414,-1689],[4333,-1690],[4308,-1579],[4279,-1537],[4165,-1492],[4040,-1373],[3798,-1354],[3408,-1280],[3203,-1429],[2980,-1466],[2887,-1392],[2980,-1094],[2775,-685],[2924,-350],[2924,-15],[3147,226],[3352,784],[3352,1082],[3501,1305],[3612,2049],[3575,2700]];
  const island=[[1784,1124],[1787,1105],[1792,1085],[1797,1077],[1810,1056],[1819,1041],[1830,1019],[1832,1011],[1844,1006],[1872,997],[1883,995],[1900,981],[1913,977],[1944,976],[1959,977],[1974,982],[1983,993],[1990,1010],[1990,1016],[1984,1024],[1977,1029],[1969,1040],[1956,1053],[1937,1067],[1919,1084],[1902,1096],[1881,1110],[1862,1115],[1831,1117],[1816,1122],[1805,1134],[1794,1138],[1788,1135]];
  const pondBanks=[[[1332,1950],[1372,1932],[1389,1921],[1441,1947],[1486,1912],[1529,1878],[1567,1913],[1610,1955],[1650,1992],[1698,2029],[1742,2070],[1797,2137]],[[1328,1971],[1369,2020],[1415,1984],[1448,1959],[1482,1989],[1529,2017],[1569,2054],[1611,2092],[1646,2130],[1698,2177]],[[1369,2020],[1398,2086],[1444,2122],[1482,2149],[1561,2188],[1639,2138],[1742,2070]],[[1391,1923],[1369,1899],[1359,1881],[1372,1860],[1401,1834],[1438,1802],[1479,1836],[1521,1876]],[[1391,1923],[1436,1874],[1402,1837]],[[1436,1874],[1479,1838]],[[1437,1947],[1519,1878]],[[1490,1982],[1567,1913]],[[1529,2017],[1609,1955]],[[1569,2054],[1650,1992]],[[1610,2093],[1697,2028]],[[1646,2130],[1742,2068]],[[1331,1976],[1371,1935]],[[1369,2020],[1415,1984],[1468,2036],[1529,2015]],[[1389,2087],[1468,2036]],[[1444,2122],[1530,2046]],[[1482,2149],[1565,2074]],[[1561,2188],[1565,2214],[1667,2163]],[[1667,2163],[1700,2195],[1730,2186],[1795,2138]]];
  const pondNets=[[[1478,1835],[1572,1734],[1608,1717]],[[1522,1875],[1618,1778],[1646,1749]],[[1566,1913],[1664,1819],[1692,1795]],[[1610,1955],[1707,1861],[1738,1832]],[[1651,1992],[1704,1944],[1762,1889],[1784,1865]],[[1698,2028],[1759,1973],[1807,1924],[1838,1889]],[[1740,2070],[1807,2011],[1868,1956]],[[1797,2136],[1871,2061]],[[1470,1831],[1509,1789],[1553,1743],[1583,1717]],[[1526,1717],[1577,1736],[1618,1778],[1665,1818],[1707,1862],[1761,1890],[1808,1924],[1869,1956]],[[1569,1717],[1638,1753],[1693,1795],[1739,1832],[1786,1865],[1836,1889],[1870,1910]]];
  const westernNets=[[[695,-377],[750,-343],[815,-311]],[[685,-320],[748,-292],[795,-279]],[[636,-266],[744,-239]],[[645,-203],[744,-185]],[[634,-140],[742,-113]],[[628,-97],[738,-67]],[[614,-62],[718,-38]],[[581,8],[737,-29]],[[607,64],[731,22]],[[653,128],[738,48],[802,74]],[[701,192],[728,116],[782,137],[803,74]],[[773,198],[804,137],[822,88],[878,106],[861,181],[847,228]],[[804,137],[861,181]],[[876,107],[937,123],[923,189],[861,181]],[[940,121],[954,72],[990,73],[987,193],[924,186]],[[1002,-11],[1087,15],[1119,21]],[[997,31],[1085,59],[1124,66]],[[990,69],[1088,102],[1122,107]],[[1010,-42],[1039,-84],[1104,-55]],[[1043,-83],[1075,-139],[1129,-122]],[[784,-468],[862,-371]],[[813,-487],[900,-391]],[[736,-444],[836,-341]],[[704,-419],[799,-319]]];
  const grove=[[1.8,-51.0,3.3],[-12.6,-51.5,2.0],[9.1,-48.4,2.7],[-16.9,-45.7,2.9],[-7.5,-45.8,2.9],[9.3,-44.1,2.0],[2.7,-41.5,2.3],[-7.0,-41.3,2.1],[7.7,-37.4,1.3],[-11.6,-35.8,2.1],[-6.6,-35.8,1.8],[-15.7,-30.5,1.4],[-6.2,-30.7,1.4],[-6.1,-26.1,1.9],[8.5,-21.1,3.1],[-0.8,-20.9,2.2],[-5.7,-20.9,2.0],[-10.7,-20.9,1.8],[-5.5,-15.9,2.3],[3.8,-15.8,2.9],[-10.3,-16.2,1.8],[-0.2,-10.5,2.5],[9.7,-10.2,3.3],[-5.0,-10.9,2.2],[4.3,-10.3,2.7],[-10.0,-10.7,2.0],[-7.3,-7.8,1.3],[-2.6,9.0,2.4],[4.0,9.9,2.5],[-12.6,11.7,1.4],[-7.1,12.6,2.3],[-2.7,13.8,2.8],[3.5,14.8,2.7],[9.3,16.6,3.2],[2.9,19.9,2.5],[12.0,24.9,2.8],[7.3,26.1,3.3],[-13.4,26.7,2.1],[-8.9,28.0,1.8],[-3.8,28.6,1.7],[1.3,29.5,2.2],[-13.8,31.5,2.1],[-3.9,33.3,2.2],[-8.5,32.6,1],[-9.5,37.9,2.6],[-4.1,38.2,2.2],[-10.0,42.6,2.1],[-4.9,43.1,2.4],[-15.0,47.7,3.1],[-5.6,47.9,2.9],[-6.1,52.7,2.7],[10.8,54.3,2.0],[-15.0,56.8,2.0],[-5.7,58.0,2.8],[0.6,63.4,2.4],[4.0,63.5,1],[-17.5,64.9,2.0]];
  const plots=[[0,[54,-56],[76,-55],[70,8],[50,12]],[1,[59,-157],[86,-160],[82,-110],[51,-102],[43,-125]],[0,[38,-107],[58,-103],[44,-58],[27,-38]],[1,[94,-104],[123,-108],[141,-93],[122,-67],[87,-58]],[2,[112,-40],[152,-77],[162,-70],[129,-32]],[3,[136,-36],[188,-77],[220,-80],[222,-58],[187,-39]],[1,[191,-28],[216,-46],[228,-54],[241,-28],[237,7],[203,9]],[0,[130,-29],[162,-35],[182,-32],[194,6],[151,9]],[3,[152,11],[187,7],[202,37],[193,48],[156,37]],[2,[44,58],[78,43],[77,124],[44,134],[29,117]],[3,[31,130],[76,124],[73,175],[41,178],[26,164]],[3,[74,42],[91,30],[113,56],[101,126],[84,130],[88,66]],[1,[105,58],[138,45],[143,72],[128,122],[108,128]],[2,[149,48],[165,56],[162,101],[148,122],[137,123]],[3,[164,46],[185,59],[193,88],[171,110],[165,93]],[1,[200,45],[222,43],[242,62],[232,93],[209,106],[193,102]],[0,[87,138],[123,134],[116,171],[81,174]],[0,[171,134],[187,128],[191,146],[164,189],[154,189]],[3,[192,151],[213,150],[207,179],[187,214],[165,215],[165,192]],[3,[216,130],[241,103],[258,110],[258,146],[237,148]],[1,[186,218],[224,181],[236,153],[257,152],[259,225],[232,231]],[2,[214,237],[257,233],[260,255],[251,264],[203,262]],[1,[40,192],[71,184],[66,214],[50,229],[37,226]],[1,[80,190],[109,183],[119,207],[101,237],[81,234]],[2,[144,208],[159,198],[150,236],[128,242]],[3,[268,-93],[302,-90],[293,-63],[264,-12],[255,-12],[253,-47]],[4,[300,-88],[322,-85],[322,-72],[305,-29],[272,15],[257,3]],[2,[327,-88],[349,-88],[343,-54],[310,11],[291,22]],[0,[349,-86],[372,-76],[365,-46],[329,15],[310,19]],[3,[258,54],[290,43],[306,30],[318,66],[280,82],[262,86]],[3,[267,93],[307,82],[328,86],[317,117],[282,128],[267,122]],[1,[329,89],[363,94],[372,129],[339,157],[305,137]],[4,[374,92],[403,94],[409,124],[378,137]],[2,[290,172],[321,148],[334,158],[353,217],[329,225]],[3,[331,162],[353,148],[381,192],[385,226],[362,236]],[3,[119,-368],[181,-377],[195,-324],[138,-308],[104,-318]],[4,[130,-307],[214,-318],[223,-304],[188,-272],[160,-269]],[2,[63,-319],[99,-314],[128,-300],[112,-253],[66,-205],[52,-210]],[0,[198,-402],[224,-394],[246,-352],[237,-300],[217,-320],[199,-344]],[3,[277,-324],[309,-330],[316,-298],[300,-254],[271,-215],[246,-194],[248,-250]],[1,[335,-299],[382,-285],[362,-260],[335,-253],[310,-250]],[3,[318,-337],[346,-350],[408,-334],[396,-290],[341,-304]],[0,[403,-262],[429,-254],[400,-212],[371,-198],[359,-219]],[1,[426,-243],[445,-243],[465,-175],[441,-161],[406,-190]],[3,[384,-112],[482,-125],[503,-115],[494,-74],[443,-75],[396,-89]],[0,[403,-2],[428,-18],[463,-43],[477,-28],[443,7],[416,33],[400,33]],[2,[444,60],[471,17],[485,11],[485,62],[466,84]],[3,[548,-208],[592,-210],[618,-194],[608,-153],[570,-144],[550,-164]],[1,[537,-287],[563,-293],[562,-243],[544,-215],[514,-230],[510,-251]],[0,[504,-446],[572,-439],[566,-357],[517,-355]],[3,[570,-437],[609,-448],[613,-402],[596,-357],[573,-360]],[1,[424,-432],[495,-434],[503,-354],[449,-341],[428,-365]]];
  const hedges=[[[16,-14],[38,-25],[50,-63],[76,-82]],[[36,52],[29,88],[19,137],[6,173]],[[30,179],[48,183],[70,179],[113,176]],[[74,45],[119,28],[129,1]],[[150,32],[163,46],[188,42],[200,30]],[[99,240],[137,244],[165,238]],[[36,281],[91,275],[145,274],[193,265]],[[119,-61],[143,-79],[174,-84],[196,-97]],[[188,-82],[220,-89],[235,-103]],[[193,15],[200,28],[214,31]],[[303,-93],[336,-98],[362,-83],[396,-75]],[[362,-55],[360,-32],[343,-2],[324,25]],[[467,-58],[488,-74],[506,-67],[513,-40]],[[414,64],[426,54],[441,40],[466,18]],[[163,-271],[181,-261],[209,-242],[219,-236]],[[221,-318],[237,-299],[242,-265],[231,-229]]];
  const fieldMargin=[[0,-420],[90,-460],[224,-448],[296,-470],[363,-490],[432,-301],[536,10],[592,173],[694,310],[624,308],[521,360],[391,406],[202,328],[123,302],[21,281],[-20,250],[-7,175],[13,109],[30,58],[10,-15],[-5,-55],[-13,-84],[-4,-140],[44,-178],[34,-270],[2,-325]];
  const sailYaw=-1.43,tau=Math.PI*2,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const smooth=(x,a,b)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
  const random=n=>{const k=Math.sin(n*19.295+1.74)*43758.5453;return k-Math.floor(k);};
  function plaque(T,k){
    const base=0.12,slate=0x43483f,bronze=0xab745f,marble=0x9f9d8e,cream=0xd7c5a3;
    k.box(0xdac6a5,0,.065,0,11.50,.14,7.05);
    // Stepped base, hull with raised prow/stern, two granite crescents.
    for(const [y,w,h,d,col] of [[.10,5.47,.20,1.83,slate],[.265,5.45,.13,1.79,cream],
      [.53,5.27,.40,1.66,0x736856],[.83,5.34,.18,1.76,slate],[.969,5.46,.095,1.83,cream],
      [1.086,5.47,.12,1.84,slate],[1.44,5.05,.61,1.55,marble]])k.box(col,0,base+y,0,w,h,d);
    const xs=[-3.33,-2.82,-1.9,0,1.9,2.82,3.33],bow=[0,.35,.66,1,.66,.35,0];
    const crest=bow.map(t=>2.96-.39*t),keel=bow.map(t=>2.12-.36*t);
    const hull=new T.Shape();hull.moveTo(xs[0],crest[0]);
    for(let j=1;j<xs.length;j++)hull.lineTo(xs[j],crest[j]);
    for(let j=xs.length-1;j>=0;j--)hull.lineTo(xs[j]*.836,keel[j]);
    hull.closePath();k.profile(hull,0x9d5945,0,base,-.69,1.38);
    for(let j=1;j<xs.length;j++){
      const len=Math.hypot(xs[j]-xs[j-1],crest[j]-crest[j-1]),ang=Math.atan2(crest[j]-crest[j-1],xs[j]-xs[j-1]);
      k.box(0xc67a5a,(xs[j]+xs[j-1])/2,base+(crest[j]+crest[j-1])/2,0,len,.14,1.55,0,0,ang);
    }
    k.box(bronze,0,base+2.14,.710,.055,.72,.045);
    for(const side of [-1,1]){
      const sh=new T.Shape();sh.moveTo(side*.79,2.69);sh.lineTo(side*.79,6.72);
      sh.bezierCurveTo(side*1.81,6.38,side*2.40,5.60,side*2.51,4.58);
      sh.bezierCurveTo(side*2.54,3.79,side*2.32,3.17,side*2.10,2.74);
      sh.lineTo(side*1.61,2.68);sh.lineTo(side*.79,2.69);
      k.profile(sh,marble,0,base,-.41,.82);
      k.box(0x848880,side*.87,base+6.80,0,.052,.19,.052);
    }
    k.box(0x80493b,0,base+4.59,.485,3.37,2.19,.22);
    const canvas=document.createElement('canvas');canvas.width=768;canvas.height=486;
    const ctx=canvas.getContext('2d'),map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    function repaint(im){
      const fill=ctx.createLinearGradient(0,0,0,486);fill.addColorStop(0,'#673e35');fill.addColorStop(1,'#5e382e');
      ctx.fillStyle=fill;ctx.fillRect(0,0,768,486);
      if(im)ctx.drawImage(im,334.2,188.7,82.6,10.2,9,255,750,90);
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#edcb9d';
      ctx.font='38px Arial';ctx.fillText('DI TÍCH THẮNG CẢNH QUỐC GIA',384,63,723);
      ctx.font='bold 75px Arial';ctx.fillText('ĐẦM Ô LOAN',384,196,685);
      ctx.font='51px Arial';ctx.fillText('O LOAN LAGOON',384,398,660);map.needsUpdate=true;
    }
    repaint();const im=new Image();im.onload=()=>repaint(im);im.src='sight-photos/93539516.webp';
    const g=new T.PlaneGeometry(3.32,2.115);
    const face=new T.Mesh(g,new T.MeshStandardMaterial({map,roughness:.90,emissiveMap:map,emissive:0xada394}));
    face.position.set(0,base+4.59,.604);k.group.add(face);
  }
  function markerGarden(T,k){
    const f=createTempleFoundations(T,k);f.building(0,0,sailYaw,11.50,7.05,()=>plaque(T,k));
    const shapes=createTreeModels(T),trees=[[],[],[]],pose=new T.Object3D();
    grove.forEach(([x,z,size],j)=>trees[j%3].push([x,z,1.8+size*.67,size*1.23,tau*random(j+73)]));
    const meshes=trees.map((pts,j)=>{
      const mesh=new T.InstancedMesh(shapes.geometry('tree',true,j),shapes.material,pts.length);
      mesh.name='Cây trong khuôn viên bia đèo Quán Cau';mesh.castShadow=mesh.receiveShadow=true;k.group.add(mesh);return mesh;
    });
    const pos=[],col=[],ind=[],tint=new T.Color(),lo=new T.Color(0x918b61),hi=new T.Color(0xad9a6b);
    for(let j=0;j<=28;j++)for(let i=0;i<=10;i++){
      const z=-59+j*4.05,x=-19.6+i*3.92-.072*z-.00094*z*z;
      pos.push(x,.075,z);tint.copy(lo).lerp(hi,.20+.51*random(i*52+j));
      const cut=Math.min(1,(5-Math.abs(i-5))*.54,(14-Math.abs(j-14))*.33);
      col.push(tint.r,tint.g,tint.b,cut*.82);
      if(i&&j){const n=j*11+i;ind.push(n-12,n-1,n,n-12,n,n-11);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    const uv=[];for(let j=0;j<pos.length;j+=3)uv.push(pos[j]/4.5,pos[j+2]/4.5);
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('color',new T.Float32BufferAttribute(col,4));g.setIndex(ind);g.computeVertexNormals();
    const soilMap=new T.TextureLoader().load('streetscape/surfaces/verge-color.webp');soilMap.wrapS=soilMap.wrapT=T.RepeatWrapping;
    soilMap.colorSpace=T.SRGBColorSpace;soilMap.anisotropy=4;
    const bed=new T.Mesh(g,new T.MeshStandardMaterial({map:soilMap,side:T.DoubleSide,vertexColors:true,transparent:true,depthWrite:false,roughness:1}));
    bed.name='Đất trồng quanh bia';bed.receiveShadow=true;k.group.add(bed);
    return ground=>{
      const pa=g.attributes.position;
      for(let i=0;i<pa.count;i++)pa.setY(i,ground(pa.getX(i),pa.getZ(i))+.075);
      pa.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
      trees.forEach((pts,j)=>{const m=meshes[j];
        pts.forEach(([x,z,h,w,a],i)=>{pose.position.set(x,ground(x,z),z);pose.rotation.set(0,a,0);pose.scale.set(w,h,w);
          pose.updateMatrix();m.setMatrixAt(i,pose.matrix);});m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
      });
    };
  }
  function cultivatedSlope(T,k){
    const pos=[],uv=[],cols=[],triCols=[0x66824f,0x587d4c,0x8e8459,0x937b65,0x956c5d],tint=new T.Color();
    let turfHeight=-.075,background=true;const offsets=[];
    function borderDistance(x,z){
      let d=Infinity;
      for(let i=0,j=fieldMargin.length-1;i<fieldMargin.length;j=i++){
        const [a,b]=fieldMargin[i],[c,e]=fieldMargin[j],dx=c-a,dz=e-b,u=clamp(((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz),0,1);
        d=Math.min(d,Math.hypot(x-a-u*dx,z-b-u*dz));
      }
      return d;
    }
    function triangle(a,b,c,col,axis){
      const long=Math.max(a.distanceToSquared(b),a.distanceToSquared(c),b.distanceToSquared(c));
      if(long>15*15){
        const ab=a.clone().lerp(b,.5),bc=b.clone().lerp(c,.5),ca=c.clone().lerp(a,.5);
        triangle(a,ab,ca,col,axis);triangle(ab,b,bc,col,axis);triangle(ca,bc,c,col,axis);triangle(ab,bc,ca,col,axis);return;
      }
      for(const v of [a,c,b]){
        pos.push(v.x,turfHeight,v.y);offsets.push(turfHeight);tint.set(col);tint.multiplyScalar(.97+.05*Math.sin(v.x*.087+v.y*.075));
        cols.push(tint.r,tint.g,tint.b,background?smooth(borderDistance(v.x,v.y),2,102)*.89:.88);uv.push((v.x*Math.cos(axis)+v.y*Math.sin(axis))/7,(-v.x*Math.sin(axis)+v.y*Math.cos(axis))/7);
      }
    }
    const boundary=fieldMargin.map(([x,z])=>new T.Vector2(x,z));
    for(const [a,b,c] of T.ShapeUtils.triangulateShape(boundary,[]))triangle(boundary[a],boundary[b],boundary[c],0x71805e,.55);
    background=false;turfHeight=.048;
    plots.forEach(([kind,...points],j)=>{
      const ring=points.map(([x,z])=>new T.Vector2(x,z));
      for(const [a,b,c] of T.ShapeUtils.triangulateShape(ring,[]))triangle(ring[a],ring[b],ring[c],triCols[kind],j*.24);
    });
    const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(pos,3));geom.setAttribute('color',new T.Float32BufferAttribute(cols,4));
    geom.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geom.computeVertexNormals();
    const furrow=new T.TextureLoader().load('streetscape/surfaces/meadow-color.webp');furrow.wrapS=furrow.wrapT=T.RepeatWrapping;
    furrow.colorSpace=T.SRGBColorSpace;furrow.anisotropy=4;
    const mat=new T.MeshStandardMaterial({map:furrow,vertexColors:true,roughness:1,side:T.DoubleSide,transparent:true,depthWrite:false});
    mat.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 plotUV;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nplotUV=uv;');
      shader.fragmentShader='varying vec2 plotUV;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float row=cos(plotUV.x*33.+.2*sin(plotUV.y*2.));float fade=1.-smoothstep(.12,.64,fwidth(plotUV.x*3.));
        diffuseColor.rgb*=1.58+row*.075*fade+.037*sin(plotUV.y+plotUV.x*.3);`);
    };
    const fields=new T.Mesh(geom,openAir(mat));fields.receiveShadow=true;fields.name='Ruộng giữa bia Quán Cau và bờ đầm';k.group.add(fields);
    const pts=[],pose=new T.Object3D(),trees=createTreeModels(T);
    hedges.forEach(path=>{for(let i=1;i<path.length;i++){
      const [a,b]=path[i-1],[c,d]=path[i],length=Math.hypot(c-a,d-b),n=Math.ceil(length/5.8);
      for(let j=0;j<n;j++){const u=(j+.5)/n,q=pts.length;
        pts.push([a+(c-a)*u+random(q+71)-.5,b+(d-b)*u+random(q+577)-.5,2.2+random(q+43)*2.9,tau*random(q+52)]);}
    }});
    const held=new T.InstancedMesh(trees.geometry('tree',true,1),openAir(trees.material.clone()),pts.length);held.receiveShadow=true;k.group.add(held);
    return ground=>{
      const ps=geom.attributes.position;for(let i=0;i<ps.count;i++)ps.setY(i,ground(ps.getX(i),ps.getZ(i))+offsets[i]);
      ps.needsUpdate=true;geom.computeVertexNormals();geom.computeBoundingSphere();
      pts.forEach(([x,z,h,a],i)=>{pose.position.set(x,ground(x,z),z);pose.rotation.set(0,a,0);pose.scale.set(h*1.13,h,h);pose.updateMatrix();held.setMatrixAt(i,pose.matrix);});
      held.instanceMatrix.needsUpdate=true;held.computeBoundingSphere();
    };
  }
  function faceGeometry(T,path,holes=[]){
    const shape=new T.Shape(path.map(([x,z])=>new T.Vector2(x,-z)));
    for(const h of holes)shape.holes.push(new T.Path(h.map(([x,z])=>new T.Vector2(x,-z))));
    const g=new T.ShapeGeometry(shape);g.rotateX(-Math.PI/2);return g;
  }
  // The far terrain uses an open-air haze curve. Match it for distant
  // authored shoreline details seen from the two actual aerial stations.
  function openAir(mat){
    const previous=mat.onBeforeCompile,baseKey=mat.customProgramCacheKey();
    mat.onBeforeCompile=function(shader,renderer){
      previous.call(this,shader,renderer);
      shader.fragmentShader=shader.fragmentShader.replace('#include <fog_fragment>',`
        #ifdef USE_FOG
          float lagoonHaze=.085+.77*(1.-exp(-max(vFogDepth,0.)*.00017));
          gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,lagoonHaze);
        #endif`);
    };
    mat.customProgramCacheKey=()=>baseKey+"|o-loan-air";
    return mat;
  }
  function makeWater(T,k){
    const g=faceGeometry(T,shore,[island]);
    const mat=new T.MeshStandardMaterial({color:0x758e88,roughness:.71,metalness:.065,side:T.DoubleSide});
    mat.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 oLoanWater;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\noLoanWater=position.xz;');
      shader.fragmentShader='varying vec2 oLoanWater;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float wind=dot(oLoanWater,vec2(.75,.41)),crossWind=dot(oLoanWater,vec2(-.33,1.24));
        float closeWave=(1.-smoothstep(.33,2.7,fwidth(wind)))*cos(wind*2.07+1.6*sin(crossWind*.045));
        float shelf=sin(wind*.021+1.9*sin(crossWind*.007))*.022;
        diffuseColor.rgb*=1.+.019*closeWave+shelf;`);
    };
    const water=new T.Mesh(g,openAir(mat));water.name='Mặt đầm Ô Loan theo đường bờ OSM';water.receiveShadow=true;k.group.add(water);
    return water;
  }
  function islet(T,k){
    const cx=1884,cz=1060,L=island.length,pos=[],indices=[],cols=[],tint=new T.Color(),top=new T.Color(0x546e44);
    // Low island visible against the sand barrier in provincial panorama node2.
    // No local name is inferred from the nearby but differently described rocks.
    for(let q=0;q<=7;q++){
      const w=1-q/8;
      island.forEach(([x,z],i)=>{
        const a=Math.atan2(z-cz,x-cx),h=-.35+6.4*(1-w**2)+.74*(1-w)*Math.sin(a*3+.45);
        pos.push(cx+(x-cx)*w,h,cz+(z-cz)*w);
        tint.set(q===0?0x736c5c:0x847b57).lerp(top,(.18+.52*random(i*23+q+11))*(q?1:.12));
        cols.push(tint.r,tint.g,tint.b);
        if(q){const j=q*L+i,n=q*L+(i+1)%L;indices.push(j-L,j,n,n-L,j-L,n);}
      });
    }
    pos.push(cx,6.28,cz);top.toArray(cols,cols.length);
    for(let i=0;i<L;i++)indices.push(7*L+i,8*L,7*L+(i+1)%L);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    g.setAttribute('color',new T.Float32BufferAttribute(cols,3));g.setIndex(indices);g.computeVertexNormals();
    const land=new T.Group(),mesh=new T.Mesh(g,openAir(new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide})));
    mesh.name='Bờ và sườn đảo thấp giữa đầm';land.add(mesh);
    const shape=createTreeModels(T),pts=[];
    for(let i=0;i<230;i++){
      const dx=(random(i+337)-.5)*159,dz=(random(i+916)-.5)*122;
      const u=(.803*dx-.596*dz)/94,v=(.596*dx+.803*dz)/40,r=u*u+v*v;
      if(r>.83||random(i+51)<.21)continue;
      pts.push([cx+dx,5.7*(1-r)+.23,cz+dz,2.9+3.4*random(i+383),tau*random(i+295)]);
    }
    const plants=new T.InstancedMesh(shape.geometry('tree',true,2),openAir(shape.material.clone()),pts.length),pose=new T.Object3D();
    pts.forEach(([x,y,z,h,a],i)=>{pose.position.set(x,y,z);pose.rotation.set(0,a,0);pose.scale.set(h*.96,h,h*1.02);pose.updateMatrix();plants.setMatrixAt(i,pose.matrix);});
    plants.castShadow=true;plants.instanceMatrix.needsUpdate=true;plants.computeBoundingSphere();land.add(plants);k.group.add(land);return land;
  }
  const shallowWater=[[[1332,1964],[1369,1934],[1391,1917],[1443,1944],[1527,1876],[1567,1915],[1609,1956],[1650,1993],[1698,2029],[1743,2071],[1796,2137],[1728,2185],[1700,2192],[1668,2160],[1564,2208],[1556,2189],[1478,2151],[1442,2121],[1397,2085],[1368,2023]],[[1390,1919],[1369,1900],[1358,1884],[1365,1865],[1400,1834],[1439,1802],[1479,1836],[1519,1875],[1439,1942]],[[694,-384],[770,-442],[871,-551],[986,-608],[1008,-606],[1004,-540],[924,-428],[858,-357],[800,-301],[750,-262],[736,-198],[736,-27],[725,30],[807,68],[938,110],[959,67],[988,64],[993,-14],[1038,-88],[1073,-133],[1126,-151],[1135,-117],[1078,174],[1010,244],[861,226],[764,193],[692,150],[623,69],[577,0],[582,-41],[615,-119],[636,-221],[646,-316]]];
  function embankments(T,k){
    const parts=new T.Group();parts.name='Bờ ao và lưới nuôi ven Ô Loan';k.group.add(parts);
    const shallow=new T.MeshStandardMaterial({color:0x75928b,roughness:.79,side:T.DoubleSide});
    for(const path of shallowWater){const m=new T.Mesh(faceGeometry(T,path),shallow);m.position.y=.058;parts.add(m);}
    const bank=[],col=[],ix=[],tint=new T.Color(),banks=[0x84855d,0x9c9878,0x84915d];
    function bund(line,width,h,turf){
      for(let j=1;j<line.length;j++){
        const [a,b]=line[j-1],[c,d]=line[j],length=Math.hypot(c-a,d-b);
        if(length<.1)continue;
        const nx=(d-b)/length,nz=(a-c)/length,cuts=Math.ceil(length/8);
        const base=bank.length/3;
        for(let e=0;e<=cuts;e++){
          const t=e/cuts,x=a+(c-a)*t,z=b+(d-b)*t;
          for(const [side,high] of [[-1,-.24],[-.58,h],[.56,h*.98],[1,-.24]]){
            const r=width*side;bank.push(x+nx*r,high,z+nz*r);
            tint.set(side===-.58||side===.56?banks[turf]:0x766e54);
            tint.multiplyScalar(.87+.19*random(base+e*11+Math.round(side*7)));col.push(tint.r,tint.g,tint.b);
          }
          if(e)for(let r=0;r<3;r++){const n=base+e*4+r;ix.push(n-4,n,n+1,n-4,n+1,n-3);}
        }
      }
    }
    pondBanks.forEach((path,i)=>bund(path,i<3?1.9:1.09,i<3?.61:.43,i%3));
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(bank,3));
    g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(ix);g.computeVertexNormals();
    const bunds=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide}));
    bunds.receiveShadow=true;parts.add(bunds);
    const tints=[0x516c72,0x6c8178,0x527571,0x658888,0x7d8063];
    for(let i=1;i<8;i++){
      const poly=[...pondNets[i-1],...pondNets[i].slice().reverse()];
      const m=new T.Mesh(faceGeometry(T,poly),new T.MeshStandardMaterial({color:tints[i%5],transparent:true,opacity:.70,depthWrite:false,roughness:.84,side:T.DoubleSide}));
      m.position.y=.115;parts.add(m);
    }
    // Unlike the solid earthen approach bunds above, the long, pale blue
    // nets are visibly permeable in the 46 m drone view (node2, faces 0–2).
    const fencing=[],fenceIndex=[],posts=[],floats=[],floatIndex=[];
    for(const line of [...pondNets,...westernNets])for(let i=1;i<line.length;i++){
      const [x,z]=line[i-1],[ex,ez]=line[i],length=Math.hypot(ex-x,ez-z),count=Math.max(1,Math.round(length/7.1)),n=fencing.length/3;
      for(let j=0;j<=count;j++){
        const u=j/count,px=x+(ex-x)*u,pz=z+(ez-z)*u,h=.60+.27*random(posts.length+8);
        fencing.push(px,-.06,pz,px,h,pz);posts.push([px,pz,h+.22]);
        if(j){const a=n+j*2;fenceIndex.push(a-2,a,a+1,a-2,a+1,a-1);
          const [ox,oz,oh]=posts[posts.length-2],sx=(ez-z)/length*.13,sz=(x-ex)/length*.13,v=floats.length/3;
          floats.push(ox-sx,oh-.17,oz-sz,ox+sx,oh-.17,oz+sz,px+sx,h+.03,pz+sz,px-sx,h+.03,pz-sz);
          floatIndex.push(v,v+1,v+2,v,v+2,v+3);}
      }
    }
    const meshGeo=new T.BufferGeometry();meshGeo.setAttribute('position',new T.Float32BufferAttribute(fencing,3));meshGeo.setIndex(fenceIndex);meshGeo.computeVertexNormals();
    const net=new T.Mesh(meshGeo,new T.MeshStandardMaterial({color:0x7faaaa,roughness:1,transparent:true,opacity:.79,side:T.DoubleSide}));
    net.name='Lưới có cọc đỡ trong các ô nước nông';parts.add(net);
    const fg=new T.BufferGeometry();fg.setAttribute('position',new T.Float32BufferAttribute(floats,3));fg.setIndex(floatIndex);fg.computeVertexNormals();
    parts.add(new T.Mesh(fg,new T.MeshStandardMaterial({color:0xa8c5c0,roughness:.88,side:T.DoubleSide})));
    const rods=new T.InstancedMesh(new T.CylinderGeometry(.044,.058,1,5),new T.MeshStandardMaterial({color:0xa09373,roughness:1}),posts.length);
    const pose=new T.Object3D();posts.forEach(([x,z,h],i)=>{pose.position.set(x,h*.5,z);pose.scale.set(1,h,1);pose.updateMatrix();rods.setMatrixAt(i,pose.matrix);});
    rods.instanceMatrix.needsUpdate=true;rods.computeBoundingSphere();parts.add(rods);
    const distinct=new Set(parts.children.map(m=>m.material));for(const mat of distinct)openAir(mat);return parts;
  }
  const view=(name,targetX,targetZ,eyeX,eyeZ,eyeRise,focus,fov,base='monument')=>{
    const dx=eyeX-targetX,dz=eyeZ-targetZ,dy=eyeRise-focus;
    return {name,offset:[targetX,targetZ],height:focus/.46,viewBase:base,viewAngle:Math.atan2(dx,dz),
      viewElevation:Math.atan2(dy,Math.hypot(dx,dz)),viewRadius:Math.hypot(dx,dz,dy),viewFov:fov};
  };
  const views=[
    {...view('Bia danh thắng ở đèo Quán Cau',.0,.0,-14.8,3.1,4.50,3.30,59),
      photoCreditUrl:'landmark-references.txt',photoCredit:'Phần bảng chữ cắt từ ảnh của Linhcandng · CC BY-SA 3.0',
      description:'Hai cánh đá ôm bảng tên đầm trên bệ hình thuyền. Phía sau bia là các ô nuôi ở bờ tây và dải đồi bên kia đầm.'},
    {...view('Từ phía quốc lộ nhìn qua bờ tây đầm',934,26,-19.0,45.9,193.7,7.0,61),
      description:'Góc trên cao từ vị trí máy ảnh toàn cảnh của tỉnh. Đường quanh đầm ôm lấy các mũi đất và dải ao dọc bờ tây.'},
    {...view('Các ô nuôi nước lợ và đảo thấp trong đầm',1622.5,1784,1598.9,1991.3,46.1,-36.2,73,'terrain'),
      description:'Từ điểm chụp trên các ô nuôi sát bờ tây nam, nhìn qua lưới có cọc đỡ ra đảo thấp có cây và dải đất ngăn đầm với biển.'}
  ];
  function build(T,k){
    const groveFit=markerGarden(T,k),fit=k.group.userData.fitGround,plotFit=cultivatedSlope(T,k);
    const water=makeWater(T,k),isle=islet(T,k),farm=embankments(T,k);
    k.group.userData.fitGround=ground=>{
      fit(ground);groveFit(ground);plotFit(ground);
      // Open lagoon samples share a brackish water surface. Never derive a
      // different level from the top of each pen or from the Quán Cau hill.
      const levels=[[1950,100],[2140,390],[2290,860],[1920,1480],[2270,1890]].map(([x,z])=>ground(x,z)).sort((a,b)=>a-b);
      // The blended regional raster rises by up to ~4.6 m across these
      // demonstrably inundated cells. One horizontal level clears their
      // recorded embankment returns across the polygon; land pixels outside
      // its measured outline are not covered.
      const shallows=[[1599,2050],[1834,2130],[1910,2110],[850,175],[930,-60]].map(([x,z])=>ground(x,z));
      const waterLevel=Math.min(levels[2]+5.3,Math.max(levels[2],...shallows)+.17);
      water.position.y=waterLevel;isle.position.y=water.position.y;farm.position.y=water.position.y;
      // Seen from the QL1 drone, the distant target stands over lagoon water.
      // Both the orbit and height honour the DEM underneath the published eye.
      const overview=view(views[1].name,934,26,-19,45.9,ground(-19,45.9)+193.7,water.position.y+7,61);
      Object.assign(views[1],overview);
    };
  }
  (window.VietnamSights??=[]).push({...pin,id,catalogId,name:'Đầm Ô Loan – điểm ngắm đèo Quán Cau',kind:'Điểm ngắm cảnh',
    formerProvince:'Phú Yên',locality:'Tuy An',lon:109.251362,lat:13.268567,start:[109.251142,13.269216],yaw:0,
    mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,width:41,depth:112,viewDistance:1850,
    boundary:[[-20,-60],[18,-59],[15,53],[-23,52]],reserve:(x,z,r)=>x>-23-r&&x<21+r&&z>-62-r&&z<55+r,
    solids:[[-.03,0,1.13,3.15]],source,photo:signPhoto,map:'https://www.openstreetmap.org/node/11779827836',
    description:'Từ đèo Quán Cau có thể nhìn về phía đông qua đầm Ô Loan, vùng nước lợ rộng khoảng 1.570 ha. Những mũi đất và các ô nuôi bám dọc bờ tây. Phía ngoài là dải cát An Hải ngăn đầm với biển.',
    arrivalNote:'Xe dừng trên đường dân cư rẽ khỏi chiều đi bắc của Quốc lộ 1. Từ ngã rẽ đi bộ về phía nam khoảng 75 m tới khuôn viên bia.',views,build});
})();
