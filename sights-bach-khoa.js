'use strict';
(() => {
  // East/south metres from 105.84346 E, 21.00568 N. C1 faces the fountain
  // to the south; the library clock faces north across the double avenue.
  const blocks = [
    // Name, centre, width, depth, storeys. Separate wings leave the courts open.
    ['C2',-118,-80,32,73,2], ['C9',-129,-17,88,16,4],
    ['C3',55,-98,92,14,3], ['C4',60,-55,104,14,3], ['C4b',87,-76,60,11,3],
    ['C5',60,-11,104,14,3], ['C10',62,25,81,14,4], ['C10b',106,31,13,20,4],
    ['ITIMS',9,20,24,26,4], ['HiTech',72,-138,24,17,5], ['C3b',145,-107,29,19,4],
    ['C6',163,-56,48,13,4], ['C15',202,-39,13,31,4], ['C7',182,10,21,91,6],
    ...[-26,10,46].map(z=>['',153,z,37,17,6]),
    ['D2A',-94,92,32,15,3], ['D2B',-59,98,21,27,3], ['Việt Đức',-31,105,19,36,4],
    ['',-173.5,81,14,15,1], ['',-136,86,27,8,2], ['',-128,105,8,28,2], ['',-156,118,47,10,2],
    ['D4',-144,159,45,19,5], ['D6',-81,150,60,12,4], ['D8',-82,191,64,20,11],
    ['D3',161,102,70,14,5], ['D5',155,147,59,15,5], ['D9',70,208,86,14,5]
  ];
  const boundary=[[-202,-194],[40,-204],[125,-140],[188,-94],[222,-46],[222,130],
    [122,221],[19,226],[-119,214],[-121,174],[-170,174],[-185,144],[-185,83],[-204,81]];
  function reserve(x,z,pad){
    if(x < -204-pad || x > 222+pad || z < -204-pad || z > 226+pad)return false;
    let inside=false;
    for(let i=0,j=boundary.length-1;i<boundary.length;j=i++){
      const [ax,az]=boundary[j],[bx,bz]=boundary[i],dx=bx-ax,dz=bz-az;
      if((az>z)!==(bz>z)&&x<ax+(z-az)*dx/dz)inside=!inside;
      const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
      if((x-ax-dx*t)**2+(z-az-dz*t)**2 <= pad*pad)return true;
    }
    return inside;
  }
  const gateX=-173,gateZ=64.55,trees=[];
  function avenue(x,z,dx,dz,count,height,palm=false){
    for(let i=0;i<count;i++)trees.push([x+i*dx,z+i*dz,height+1.8*Math.sin(i*2.4+x),palm]);
  }
  avenue(-59,-106,0,18,6,11); avenue(-10,-106,0,18,6,11);
  trees.push([-52,-131,14,false],[-18,-131,13,false],[-180,55,16,false],[-180,76,17,false]);
  for(const x of [39,45,96,102])trees.push([x,108,11.6,true]);
  const benches=[[-44,-106],[-25,-106],[-44,-89],[-25,-89],[-52,-126],[-18,-126],
    ...[-65,-57,-49,-39,-29,-20,-11,-4].map(x=>[x,-191])];
  const lamps=[[-42,-108],[-27,-108],[-42,-87],[-27,-87],[-46,-126],[-23,-126]];
  const solids=blocks.map(([,x,z,w,d])=>[x,z,w/2,d/2]);
  solids.push([-80.5,-149,33.5,7],[13.5,-149,38.5,7],[-28.8,-152.5,3.2,14.5],
    [-45.9,-152.5,1.1,14.5],[-36,-133.3,11,2.1],[-35.8,-127.8,1.3,.49],
    [70,145,41,18.5],[70,121.6,27,9.6],[70,106.6,17.8,2.8],[70,92,2.8,.46],
    [gateX,gateZ-4.38,1.4,.44],[gateX,gateZ+4.38,1.4,.44],
    [-165,57,2.6,1.5],[-34.4,-49.8,2.85,1.2],[-173.7,-6.1,3.5,1.4],
    ...benches.map(([x,z])=>[x,z,1.05,.34]),...lamps.map(([x,z])=>[x,z,.14,.14]));
  for(const side of [-1,1])solids.push([gateX,gateZ+side*10,.46,3], [gateX,gateZ+side*5,.46,.4]);
  for(let offset=-8;offset<=8;offset+=2)
    solids.push([-34.4,-61.9+offset,Math.sqrt(8.6**2-offset**2),.9]);
  for(const coords of bachKhoaGrounds.treeRows)for(let i=0;i<coords.length;i+=2){
    const x=coords[i],z=coords[i+1];
    if(solids.some(([cx,cz,w,d])=>Math.abs(x-cx)<w+1.3&&Math.abs(z-cz)<d+1.3))continue;
    if(trees.some(([cx,cz])=>(x-cx)**2+(z-cz)**2<5**2))continue;
    trees.push([x,z,9.8+3.8*Math.sin(x*.73+z*.34),false]);
  }
  solids.push(...trees.map(([x,z])=>[x,z,.31,.31]));

  function build(T,kit){
    const {group,stamp,box,round,outline,random,wavingFlag}=kit;
    const stone=0xe1dfd2,white=0xf0eee4,trim=0xb4b4a9,blue=0x344f63,red=0xa93932;
    const foundations=createTempleFoundations(T,kit);
    kit.palette({stone});
    function fixture(x,z,create){
      const start=group.children.length;
      let mounted=[];
      foundations.fixture(ground=>ground(x,z),()=>{
        create();
        mounted=group.children.slice(start).map(mesh=>[mesh,mesh.position.y]);
      },height=>{for(const [mesh,y] of mounted)mesh.position.y=y+height;});
    }
    function canvasMap(w,h,paint){
      const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
      paint(canvas.getContext('2d'),w,h);
      const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
      return map;
    }
    function panel(map,x,y,z,w,h,angle=0,transparent=false){
      const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshLambertMaterial({map,transparent,alphaTest:transparent?.3:0}));
      mesh.position.set(x,y,z);mesh.rotation.y=angle;group.add(mesh);
    }
    function lettering(words,ink,x,y,z,w,h,angle=0){
      const map=canvasMap(Math.min(1024,Math.ceil(96*w/h)),96,(g,cw,ch)=>{
        g.fillStyle=ink;g.textAlign='center';g.textBaseline='middle';
        g.font='bold 74px Arial';g.fillText(words,cw/2,ch/2,cw-12);
      });
      panel(map,x,y,z,w,h,angle,true);
    }
    // One repeating four-light window bay. The balconies and sunshades in
    // front of it have depth and cast their own shadows.
    const windows=canvasMap(256,192,(g,w,h)=>{
      g.fillStyle='#dbd8c8';g.fillRect(0,0,w,h);
      const glass=g.createLinearGradient(0,12,148,141);
      glass.addColorStop(0,'#354952');glass.addColorStop(.47,'#799195');glass.addColorStop(1,'#405556');
      g.fillStyle='#666f6b';g.fillRect(13,19,231,124);
      for(let i=0;i<4;i++){
        g.fillStyle=glass;g.fillRect(17+i*57,23,53,27);g.fillRect(17+i*57,54,53,84);
        if(i===1||i===3){g.fillStyle='#a4a99a';g.fillRect(18+i*57,54,10,84);}
      }
      g.fillStyle='#999b8e';g.fillRect(10,141,236,5);
    });
    windows.wrapS=windows.wrapT=T.RepeatWrapping;
    const windowMaterial=new T.MeshLambertMaterial({map:windows});
    function facade(x,z,w,d,base,floors,pitch){
      const geometry=new T.BoxGeometry(w,floors*pitch,d),uv=geometry.attributes.uv;
      for(let i=0;i<uv.count;i++){
        const face=Math.floor(i/4);
        uv.setXY(i,uv.getX(i)*Math.max(1,Math.round((face<2?d:w)/4.3)),uv.getY(i)*floors);
      }
      const mesh=new T.Mesh(geometry,windowMaterial);mesh.position.set(x,base+floors*pitch/2,z);
      mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
    }
    function block(x,z,w,d,floors){
      const pitch=3.35;
      box(trim,x,.1,z,w+.5,.8,d+.5);
      facade(x,z,w-.65,d-1,.38,floors,pitch);
      for(let j=0;j<=floors;j++){
        const y=.38+j*pitch;
        box(j===floors?stone:white,x,y,z,w+.52,.28,d+1.1);
        if(j===floors)continue;
        for(const side of [-1,1]){
          box(0xb99378,x,y+.62,z+side*(d/2+.35),w,.68,.25);
          box(trim,x,y+1.06,z+side*(d/2+.35),w,.09,.12);
        }
      }
      const bays=Math.max(2,Math.round(w/6));
      for(let i=0;i<=bays;i++)for(const side of [-1,1]){
        box(stone,x+(i/bays-.5)*(w-.35),.38+floors*pitch/2,z+side*d/2,.34,floors*pitch,.45);
      }
      box(0xafa99a,x,.62+floors*pitch,z,w-.15,.17,d-.2);
    }
    for(const [name,x,z,w,d,floors] of blocks)fixture(x,z,()=>{
      block(x,z,w,d,floors);
      if(['C9','C3','C4','C5','C10'].includes(name))
        lettering(name,'#93392d',x+w/2-.65,3.1,z+d/2+.53,3.1,1.25);
    });

    fixture(-36,-148,()=>{
      // Set the classrooms behind the open galleries. The two wings stop at
      // the central hall so daylight is visible through the ground-floor passage.
      for(const [x,w] of [[-80.5,67],[13.5,77]]){
        facade(x,-149,w,9,.38,4,3.65);
        for(let j=0;j<=4;j++){
          const y=.38+j*3.65;
          box(white,x,y,-149,w,.26,j===4?15.1:14);
          if(j===4)break;
          for(const side of [-1,1])for(const h of [.52,.79,1.02])
            box(0x984940,x,y+h,-149+side*6.85,w,.052,.055);
        }
        const bays=Math.round(w/4.8);
        for(let i=0;i<=bays;i++)for(const side of [-1,1]){
          const xx=x+(i/bays-.5)*(w-.28),z=-149+side*6.7;
          box(white,xx,7.6,z,.30,14.5,.38);
          box(0x85423c,xx,7.6,z+side*.22,.095,14.5,.085);
        }
      }
      box(stone,-36,10.45,-152,22,12.1,27.4);
      box(white,-28.75,8.32,-152,6.4,16.64,28.1);
      box(white,-46.2,2.2,-152,1.6,4.4,24);
      box(0x46504c,-39,10.15,-138.7,14.6,11.6,.34);
      const screen=canvasMap(512,512,(g,w,h)=>{
        g.fillStyle='#f2f1e8';g.fillRect(0,0,w,h);
        for(let j=0;j<24;j++)for(let i=0;i<21;i++){
          const x=i*w/21,y=j*h/24,shift=(i+j)%2?3:0;
          for(const [dx,dy,ww,hh] of [[2,2,5,13],[10,2+shift,8,7],[11,12,4,7],[20,6,2,10]]){
            g.fillStyle='#a6a69e';g.fillRect(x+dx,y+dy,ww,hh);
            g.fillStyle='#424744';g.fillRect(x+dx+1,y+dy+1,ww-1,hh-1);
          }
        }
      });
      panel(screen,-39.15,10.45,-137.92,14.35,11.82);
      for(let i=0;i<=3;i++){
        box(white,-46.33+4.79*i,10.45,-137.84,.27,12,.27);
        box(white,-39.15,4.52+3.96*i,-137.84,14.55,.27,.27);
      }
      lettering('C1','#ae762c',-27.6,4.8,-137.91,1.9,1.3);
      box(white,-35.8,16.65,-138.22,22.6,.23,.85);
      for(let j=0;j<9;j++){
        const cx=-51.2+j*3.8,curve=[];
        for(let i=0;i<=12;i++){const t=i/6-1;curve.push([1.9*t,.62*(1-t*t)]);}
        outline([...curve,...curve.slice().reverse().map(([x,y])=>[x,y-.14])],white,cx,15.91,-165.9,26.6);
        box(white,cx-1.85,15.42,-140,.17,.98,.18);
      }
      for(const [z,side] of [[-137.5,1],[-165.6,-1]]){
        box(white,-38.6,4.32,z,16.5,.66,3.3);
        for(const x of [-45.6,-40.95,-35.95,-31.8])box(white,x,2.35,z+side*.62,.5,3.8,.52);
      }
      const northGlass=canvasMap(512,240,(g,w,h)=>{
        g.fillStyle='#455b60';g.fillRect(0,0,w,h);
        for(let j=0;j<3;j++)for(let i=0;i<9;i++){
          g.fillStyle=(i+j)%3?'#819595':'#a4b1ab';g.fillRect(i*57+3,j*80+4,52,67);
          g.fillStyle='#c5cbbe';g.fillRect(i*57+3,j*80+21,52,2);
        }
      });
      panel(northGlass,-39.2,10.45,-165.74,14.5,11.8,Math.PI);
      for(const x of [-46.5,-41.6,-36.7,-31.8])box(white,x,10.5,-165.8,.38,12,.42);
      for(const x of [-50,-43,-36,-29,-22])box(trim,x,16.8,-165.8,.08,1.8,.10);
      lettering('ĐẠI HỌC BÁCH KHOA HÀ NỘI','#ad1525',-36,17.58,-165.92,33,2,Math.PI);
      for(let i=0;i<6;i++)box(0x858681,-36,.065+i*.07,-131.7-i*.38,22,.13+i*.14,.41);
      box(0xb9b3a4,-36,.42,-135,22,.84,2.7);
      stamp(round,trim,-36,20,-149,.065,7.5,.065);wavingFlag(2.8,1.85,-36,23.73,-149);
    });

    fixture(-170,-16,()=>{
      for(let i=0;i<4;i++){
        const y=.55+i*3.35,s=i%2?1:-1;
        box(white,-173.7,y+1.55,-5.9,6.2,.24,1.8,0,0,s*.51);
        box(red,-173.7,y+2.42,-4.97,6.2,.10,.10,0,0,s*.51);
        for(let j=-2;j<=2;j++)box(red,-173.7+j,y+1.93+s*j*.56,-4.97,.055,.88,.055);
        box(white,-173.7+s*2.72,y+3.08,-6.75,1.7,.24,3.3);
      }
    });

    fixture(70,137,()=>{
      // A bowed white front with six ranks of dark ribbon windows. The open
      // upper loggia and the clock canopy stand in front of the glazing.
      facade(70,145,81,36,.5,9,3.55);
      box(white,70,32.7,145,82.4,.65,37.2);
      facade(70,135,54,36,.5,10,3.55);
      const front=x=>111.7+3.2*(x/27)**2;
      function band(halfWidth,base,height,back,tint){
        const shape=new T.Shape();shape.moveTo(-halfWidth,-back);
        for(let i=0;i<=20;i++){
          const x=halfWidth*(i/10-1);shape.lineTo(x,-front(x));
        }
        shape.lineTo(halfWidth,-back);shape.closePath();
        const geo=new T.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false});
        geo.rotateX(-Math.PI/2);stamp(geo,tint,70,base,0);geo.dispose();
      }
      box(0x354959,70,19,116.6,46,35.7,1.2);
      function bay(x,base,width,height,tint,depth=.44){
        const tangent=Math.atan(6.4*x/27**2);
        box(tint,70+x,base+height/2,front(x)+depth/2,width,height,depth,-tangent);
      }
      for(const x of [-23.65,23.65])bay(x,.4,6.9,37.3,white,5.6);
      band(27,6.72,1.33,117.7,white);
      for(let row=0;row<6;row++){
        const y=8.05+row*3.37;
        band(23,y,1.47,117.7,white);
        for(let i=-5;i<=5;i++){
          const x=i*3.95;
          // The window reveals are shallow on the office floors. Only the
          // double-height loggia above has deeply recessed glazing.
          const angle=-Math.atan(6.4*x/27**2);
          box((row+i)%3?0x405562:0x506573,70+x,y+2.42,front(x)+.22,4,1.93,.17,angle);
          bay(x,y+1.45,.48,2.0,white);
          bay(x+1.85,y+1.45,.09,2.0,0x8e9b9e);
        }
      }
      band(27,28.2,1.05,117.7,white);
      for(let i=-4;i<=4;i++)bay(i*4.85,29.25,.68,5.55,0xe2e5e1,1.1);
      band(27.2,34.76,.54,119,0x284a82);band(27.3,35.3,1.12,153.4,white);
      for(const x of [42.6,97.4]){
        box(0x314756,x,17.4,120.6,.57,33.7,6.1);
        for(let j=1;j<=9;j++)box(white,x,j*3.56,120.6,.64,.14,6.1);
      }
      for(let i=0;i<8;i++)box(0xa2a4a1,70,.075+i*.075,103.9+i*.41,35,.15+i*.15,.44);
      box(0x283b47,70,3.7,112.32,32,5.8,.54);
      for(const x of [56,61,66,71,76,81,84])box(0x929d9d,x,3.6,111.98,.12,4.9,.14);
      for(const x of [54,62,78,86])stamp(round,0xb4b8b6,x,3.6,108.7,.56,6.6,.56);
      box(white,70,6.92,109.6,38.4,.8,5.4);
      for(const x of [59.45,80.55]){
        box(0x2b3742,x,9.54,109.2,16.9,4.6,3.5);
        for(let i=0;i<8;i++)box(0xc0c6c8,x,7.55+i*.56,107.25,17.1,.12,.76);
        for(let i=-3;i<=3;i++)box(0x53646b,x+i*2.35,9.52,107.32,.10,4.22,.25);
        box(white,x,12.24,109.3,17.4,1.35,4.4);
        box(0x264b90,x,12.97,109.2,17.6,.21,4.65);
      }
      box(0x485563,70,9.86,108.95,4.6,5.42,3.9);
      lettering('TẠ QUANG BỬU','#926623',59.4,12.23,107.06,9.8,.9,Math.PI);
      const clock=canvasMap(256,256,(g)=>{
        g.fillStyle='#f4f1df';g.beginPath();g.arc(128,128,119,0,Math.PI*2);g.fill();
        g.strokeStyle='#334554';g.lineWidth=8;g.stroke();
        g.save();g.translate(128,128);
        for(let i=0;i<12;i++){g.fillStyle='#354956';g.fillRect(-3,-105,6,14);g.rotate(Math.PI/6);}
        g.beginPath();g.moveTo(-40,-34);g.lineTo(0,0);g.lineTo(55,-60);g.stroke();g.restore();
      });
      panel(clock,70,9.75,106.91,4.1,4.1,Math.PI,true);
      box(0x453e3b,70,.15,92,5.6,.3,.92);
      lettering('HUST','#c32233',70,.87,91.94,5.35,1.56,Math.PI);
    });

    fixture(gateX,gateZ,()=>{
      // The ribs fall all the way to the footings. The concrete shell is
      // wider along the direction of travel at the feet than at the crown.
      function archShell(flange){
        const vertices=[],indices=[],span=4.03,rise=12.05;
        for(let j=0;j<=48;j++){
          const u=j/24-1,slope=2*rise*u/span,n=Math.hypot(1,slope);
          const halfDepth=.72+.57*u*u;
          const inner=flange?-.13:0,outer=.45+.36*u*u;
          const a=flange>0?halfDepth-.145:flange<0?-halfDepth:-halfDepth+.145;
          const b=flange<0?-halfDepth+.145:flange>0?halfDepth:halfDepth-.145;
          for(const [x,offset] of [[a,inner],[b,inner],[b,outer],[a,outer]]){
            vertices.push(x,rise*(1-u*u)+offset/n,span*u+offset*slope/n);
          }
          if(j)for(let k=0;k<4;k++){
            const p=(j-1)*4+k,q=(j-1)*4+(k+1)%4;
            indices.push(p,q,p+4,q,q+4,p+4);
          }
        }
        // In z order the inside runs left-to-right when viewed from below.
        const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
        geo.setIndex(indices);const flat=geo.toNonIndexed();flat.computeVertexNormals();
        stamp(flat,flange?0xf5efdd:0xe0dbc8,gateX,0,gateZ);flat.dispose();geo.dispose();
      }
      archShell(0);archShell(-1);archShell(1);
      for(const side of [-1,1]){
        for(const y of [1.8,4.15,6.4,8.5,10.3,11.55]){
          const u=side*Math.sqrt(1-y/12.05),tilt=Math.atan2(2*12.05*u,4.03);
          const z=gateZ+4.03*u;
          stamp(round,0xc6bfaa,gateX,y-.018*Math.cos(tilt),z-.018*Math.sin(tilt),.31,.07,.31,0,tilt);
          stamp(round,0xe9e3d0,gateX,y-.065*Math.cos(tilt),z-.065*Math.sin(tilt),.235,.055,.235,0,tilt);
        }
        box(stone,gateX,.15,gateZ+side*4.41,2.72,.34,.87);
        // Open pedestrian portals flank the arch; the sliding leaves park
        // against the outer piers, clear of both vehicle lanes.
        const z=gateZ+side*7.65;
        box(white,gateX,3.58,z,1.34,.28,6.6);
        for(const offset of [5,10.6])box(stone,gateX,1.78,gateZ+side*offset,.82,3.56,.44);
        box(0x3f504b,gateX,1.13,gateZ+side*9.4,.15,2.24,2.15);
        for(let i=0;i<9;i++)box(0x263e39,gateX-.11,2.32,gateZ+side*(8.4+i*.24),.09,1.3,.055);
        box(0x344b44,gateX-.1,2.97,gateZ+side*9.4,.1,.10,2.18);
      }
      box(0xd2c4aa,-165,1.35,57,5.2,2.7,3);
      box(blue,-165,1.6,58.52,4.4,1.05,.08);box(stone,-165,2.89,57,6,.3,3.8);
    });

    fixture(-34.4,-61.9,()=>{
      for(const [r,y,h,color] of [[8.6,.05,.34,trim],[7.85,.26,.37,stone],[7.5,.47,.09,0x71a6a6]])
        stamp(round,color,-34.4,y,-61.9,r,h,r);
      for(let i=0;i<20;i++){
        const a=i*Math.PI/10,points=[];
        for(let j=0;j<=8;j++){
          const t=j/8,r=5.6-2.15*t;
          points.push(new T.Vector3(r*Math.cos(a),.52+5.7*t*(1-t),r*Math.sin(a)));
        }
        const jet=new T.TubeGeometry(new T.CatmullRomCurve3(points),8,.034,5,false);
        stamp(jet,0xd4e9e5,-34.4,0,-61.9);jet.dispose();
      }
      box(trim,-34.4,.08,-49.8,5.7,.23,2.36);box(0x677f41,-34.4,.21,-49.8,5.55,.14,2.22);
      const rock=new T.Shape();
      [[-2.35,.16],[-2.61,.47],[-2.55,1.1],[-2.39,1.61],[-2.13,1.86],[-1.63,1.91],
        [-1.32,2.05],[-.66,1.98],[-.25,2.08],[.52,1.94],[1.14,1.98],[1.6,1.88],
        [2.05,1.95],[2.37,1.63],[2.54,.94],[2.49,.38],[2.25,.20],[1.36,.13],
        [.64,.21],[-.32,.15],[-1.34,.21]].forEach(([x,y],i)=>i?rock.lineTo(x,y):rock.moveTo(x,y));
      rock.closePath();
      const geo=new T.ExtrudeGeometry(rock,{depth:.63,bevelEnabled:true,bevelThickness:.21,bevelSize:.11,bevelSegments:2});
      stamp(geo,0xe5e6dc,-34.4,.16,-50.13);geo.dispose();
      lettering('ĐẠI HỌC BÁCH KHOA HÀ NỘI','#272d2b',-34.4,1.40,-49.27,4.43,.47);
      lettering('HANOI UNIVERSITY OF SCIENCE AND TECHNOLOGY','#343936',-34.4,1.02,-49.27,4.32,.25);
    });
    fixture(-35.8,-127.8,()=>{
      const x=-35.8,z=-127.8;
      box(0x322e30,x,.15,z,2.6,.3,.98);
      // Stacked white letters and a freestanding red heart on the C1 forecourt.
      const b=new T.Shape();b.moveTo(-1,.30);b.lineTo(-1,1.30);b.lineTo(-.48,1.30);
      b.bezierCurveTo(-.04,1.30,.06,.98,-.22,.83);b.bezierCurveTo(.14,.64,.02,.30,-.44,.30);b.closePath();
      for(const y of [.53,1.05]){
        const hole=new T.Path();hole.absellipse(-.54,y,.20,.105,0,Math.PI*2,true);b.holes.push(hole);
      }
      function letter(shape,tint){
        const geo=new T.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:true,bevelThickness:.025,bevelSize:.022,bevelSegments:1});
        stamp(geo,tint,x,0,z);geo.dispose();
      }
      letter(b,white);
      outline([[.13,.3],[.37,.3],[.37,.72],[.79,.3],[1.13,.3],[.58,.88],[1.1,1.30],[.75,1.30],[.37,.96],[.37,1.30],[.13,1.30]],white,x,0,z,.24);
      box(white,x-.61,1.75,z+.12,.24,.90,.24);
      for(const y of [1.36,2.15])box(white,x-.61,y,z+.12,.51,.10,.24);
      const heart=new T.Shape();heart.moveTo(.27,1.29);
      heart.bezierCurveTo(.02,1.51,-.33,1.78,-.21,2.04);
      heart.bezierCurveTo(-.10,2.29,.18,2.27,.29,2.07);heart.bezierCurveTo(.54,2.46,.94,2.32,.91,2.04);
      heart.bezierCurveTo(.87,1.8,.51,1.48,.27,1.29);letter(heart,0xc51e28);
    });
    for(const [x,z] of benches)fixture(x,z,()=>{
      const granite=z===-191;
      for(const dx of [-.72,.72])box(granite?trim:0x37413c,x+dx,.25,z,.13,.5,.53);
      for(let i=0;i<3;i++)box(granite?stone:0xad7953,x,.49,z-.19+i*.18,2.1,.095,.16);
      for(const dx of [-.82,.82])box(0x48514d,x+dx,.67,z-.26,.065,.65,.07);
      for(const y of [.79,.96])box(granite?stone:0xa7774f,x,y,z-.28,2.1,.14,.07);
    });
    const globe=new T.SphereGeometry(1,12,8);
    for(const [x,z] of lamps)fixture(x,z,()=>{
      const iron=0x34574e;
      stamp(round,iron,x,.3,z,.16,.6,.16);stamp(round,iron,x,1.65,z,.076,2.7,.076);
      box(iron,x,2.90,z,.86,.08,.08);
      for(const dx of [-.42,.42]){
        stamp(round,iron,x+dx,3.05,z,.058,.30,.058);
        stamp(globe,0xf5f0d8,x+dx,3.34,z,.22,.25,.22);
      }
    });
    globe.dispose();
    campusGarden(T,group,trees,random);
  }

  function campusGarden(T,group,trees,random){
    // Textured planted beds and brick walks sit below the road ribbons.
    const loader=new T.TextureLoader(),gardens=[];
    const grass=loader.load('streetscape/surfaces/meadow-color.webp');
    grass.colorSpace=T.SRGBColorSpace;grass.wrapS=grass.wrapT=T.RepeatWrapping;
    const lawn=new T.MeshLambertMaterial({color:0xa9cc8d,map:grass});
    const pavers=document.createElement('canvas');pavers.width=pavers.height=128;
    const pen=pavers.getContext('2d');pen.fillStyle='#ad9585';pen.fillRect(0,0,128,128);
    for(let j=0;j<8;j++)for(let i=-1;i<4;i++){
      pen.fillStyle=['#baa195','#c4ac9a','#c1a695','#bda596'][Math.floor(random()*4)];
      pen.fillRect(i*32+j%2*16,j*16,31,15);
    }
    const tile=new T.CanvasTexture(pavers);tile.colorSpace=T.SRGBColorSpace;tile.wrapS=tile.wrapT=T.RepeatWrapping;
    const brick=new T.MeshLambertMaterial({map:tile});
    const graniteCanvas=document.createElement('canvas');graniteCanvas.width=graniteCanvas.height=192;
    const paving=graniteCanvas.getContext('2d');
    paving.fillStyle='#9b998e';paving.fillRect(0,0,192,192);
    for(let j=0;j<6;j++)for(let i=0;i<6;i++){
      const tone=171+Math.floor(random()*14);
      paving.fillStyle='rgb('+tone+','+(tone-3)+','+(tone-12)+')';paving.fillRect(i*32,j*32,31,31);
    }
    const graniteMap=new T.CanvasTexture(graniteCanvas);graniteMap.colorSpace=T.SRGBColorSpace;
    graniteMap.wrapS=graniteMap.wrapT=T.RepeatWrapping;
    const granite=new T.MeshLambertMaterial({map:graniteMap});
    function bed(x,z,w,d,material,lift){
      const geo=new T.PlaneGeometry(w,d,Math.ceil(w/9),Math.ceil(d/9));geo.rotateX(-Math.PI/2);geo.translate(x,0,z);
      const p=geo.attributes.position,uv=geo.attributes.uv;
      const scale=material===lawn?5:2.4;
      for(let i=0;i<p.count;i++)uv.setXY(i,p.getX(i)/scale,p.getZ(i)/scale);
      const mesh=new T.Mesh(geo,material);mesh.receiveShadow=true;mesh.userData.shoreCover=true;group.add(mesh);gardens.push({geo,lift});
    }
    bed(-34,-71,72,135,granite,-.14);
    bed(gateX+3,gateZ,24,27,granite,-.11);
    bed(71,97,86,32,brick,-.14);
    bed(-156,95,59,44,lawn,-.13);
    function mappedSurface(material,lift,polygons,paths=[]){
      const vertices=[],uv=[];
      function triangle(a,b,c){
        const scale=material===lawn?5:2.4;
        for(const p of [a,b,c]){vertices.push(p.x,0,p.y);uv.push(p.x/scale,p.y/scale);}
      }
      for(const ring of polygons){
        const points=[];for(let i=0;i<ring.length;i+=2)points.push(new T.Vector2(ring[i],ring[i+1]));
        for(const [a,b,c] of T.ShapeUtils.triangulateShape(points,[]))triangle(points[c],points[b],points[a]);
      }
      for(const line of paths)for(let i=2;i<line.length;i+=2){
        const a=new T.Vector2(line[i-2],line[i-1]),b=new T.Vector2(line[i],line[i+1]);
        const n=new T.Vector2(a.y-b.y,b.x-a.x).normalize().multiplyScalar(.95);
        const a1=a.clone().add(n),a2=a.clone().sub(n),b1=b.clone().add(n),b2=b.clone().sub(n);
        triangle(a1,b1,a2);triangle(a2,b1,b2);
      }
      material.side=T.DoubleSide;
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
      geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.computeVertexNormals();
      const mesh=new T.Mesh(geo,material);mesh.receiveShadow=true;mesh.userData.shoreCover=true;group.add(mesh);gardens.push({geo,lift});
    }
    mappedSurface(lawn,-.085,bachKhoaGrounds.lawns);
    mappedSurface(granite,-.10,bachKhoaGrounds.plazas,bachKhoaGrounds.paths);
    const vegetation=[],pose=new T.Object3D(),plane=new T.PlaneGeometry(1,1);
    // Rotate each photographed tree toward the driver. Tilt the crown into
    // view overhead; the same silhouette also renders in the sun's shadow pass.
    function faceCamera(shader){
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`
        vec3 eye = normalize(cameraPosition - (modelMatrix * instanceMatrix[3]).xyz);
        vec3 right = normalize(vec3(eye.z + .00001, 0., -eye.x));
        vec3 top = normalize(mix(vec3(0.,1.,0.), cross(eye,right), smoothstep(.65,1.,eye.y)));
        vec3 transformed = right * position.x + top * position.y;
      `).replace('#include <beginnormal_vertex>','vec3 objectNormal = vec3(0.,1.,0.);');
    }
    for(const palm of [false,true]){
      const map=loader.load('streetscape/roadside-'+(palm?'palm':'tree')+'.webp');map.colorSpace=T.SRGBColorSpace;
      const mat=new T.MeshLambertMaterial({map,alphaTest:.45,side:T.DoubleSide,emissive:0x242920});
      const row=trees.filter(t=>t[3]===palm),mesh=new T.InstancedMesh(plane,mat,row.length);
      mat.onBeforeCompile=faceCamera;
      const depth=new T.MeshDepthMaterial({map,alphaTest:.45,depthPacking:T.RGBADepthPacking,side:T.DoubleSide});
      depth.onBeforeCompile=faceCamera;mesh.customDepthMaterial=depth;
      mat.addEventListener('dispose',()=>depth.dispose());
      mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
      for(let i=0;i<row.length;i++){
        const tint=new T.Color().setHSL(.20+random()*.09,.08+random()*.19,.73+random()*.15);
        if(row[i][1]===-131)tint.setRGB(1.64,.97,.48);
        mesh.setColorAt(i,tint);
      }
      vegetation.push(ground=>{
        row.forEach(([x,z,h],i)=>{
          const width=h*(palm?.85:1.02);
          pose.position.set(x,ground(x,z)+h*.48,z);pose.scale.set(width,h,width);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
        });
        mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
      });
    }
    const fitStructures=group.userData.fitGround;
    group.userData.fitGround=ground=>{
      fitStructures(ground);
      for(const {geo,lift} of gardens){
        const p=geo.attributes.position;
        for(let i=0;i<p.count;i++)p.setY(i,ground(p.getX(i),p.getZ(i))+lift);
        p.needsUpdate=true;geo.computeBoundingSphere();
      }
      for(const fit of vegetation)fit(ground);
    };
  }
  (window.VietnamSights??=[]).push({
    id:'bach-khoa-ha-noi',name:'Đại học Bách khoa Hà Nội',city:'Hà Nội',province:'Hà Nội',region:'Bắc Bộ',
    lon:105.84346,lat:21.00568,start:[105.84156,21.00510],bearing:90,yaw:0,
    width:445,depth:452,viewAngle:.18,viewElevation:.72,plasterStain:.024,reserve,boundary,solids,build,
    views:[
      {name:'Sân C1',offset:[-35.8,-142],viewRadius:39,height:14,viewAngle:.015,viewElevation:-.09,
        description:'Từ sân lát đá nhìn về sảnh C1, biểu tượng I ♥ BK nằm trước bậc thềm. Phía trên là chín ô hoa gió và mái chín nhịp sóng.'},
      {name:'Cổng Parabol',offset:[gateX,gateZ],viewRadius:23.5,height:13.3,viewAngle:-1.52,viewElevation:-.13,
        description:'Nhìn từ phía đường Giải Phóng qua vòm bê tông vào đường đôi trong trường.'},
      {name:'Quảng trường Tạ Quang Bửu',offset:[70,113],viewRadius:51,height:34,viewAngle:Math.PI+.01,viewElevation:-.21,
        description:'Đối diện quảng trường là đồng hồ lớn giữa hai mảng lam ngang của thư viện Tạ Quang Bửu.'},
      {name:'Toàn cảnh khuôn viên'}
    ],
    searchNames:'HUST ĐHBK BKHN Đại Cồ Việt Giải Phóng Cổng Parabol C1 Thư viện Tạ Quang Bửu',
    description:'Từ Giải Phóng, lái qua cổng Parabol rồi theo đường đôi vào trường. Rẽ trái lên sân C1 để ngắm mặt đứng hoa gió và đài phun nước, hoặc đi tiếp tới thư viện Tạ Quang Bửu bên Hồ Tiền.',
    map:'https://www.openstreetmap.org/#map=18/21.00568/105.84346',
    source:'https://hust.edu.vn/uploads/sys/quality-assurance/2019/05/cea-00-02-map-of-hust-da-chuyen-doi.399630.20688.pdf',
    photo:'https://library.hust.edu.vn/vi/node/826'
  });
})();
