'use strict';
(() => {
  // Sa Đéc survey, 2026-11-22. Google Open Buildings v3 / CC BY 4.0:
  // https://sites.research.google/gr/open-buildings/ . The two adjoining roofprints
  // (VIDA tile features 66187940 and 66187993) measure 111.27 and 146.66 m².
  // Together they match the 258 m² recorded by the tourism authorities.
  // https://dulich.dongthap.gov.vn/vi/nhacohuynhthuyle
  // https://csdl.vietnamtourism.gov.vn/dest/?item=1040
  // The riverfront court aligns with the eastern end of the smaller roof and
  // reaches Nguyễn Huệ (OSM w150237043). The 1895 timber house received its
  // masonry casing in 1917. Only the surviving main house and its forecourt
  // are shown. Arcade and fittings are proportioned from on-site photographs.
  const source='https://dulich.dongthap.gov.vn/vi/nhacohuynhthuyle';
  const photo='https://commons.wikimedia.org/wiki/File:La_maison_de_Huynh_Thuy_Le_(Sa_Dec,_Vietnam)_(6662996139).jpg';
  // Facade: Jean-Pierre Dalbéra, CC BY 2.0, photograph above.
  // Altar portrait: crop of “Bàn thờ Quan Công (2).jpg”, Bùi Thụy Đào Nguyên,
  // CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:B%C3%A0n_th%E1%BB%9D_Quan_C%C3%B4ng_(2).jpg .
  // The public exhibit and crop are credited again in the interior camera.
  const A=window.CentralArch,sites=window.VietnamSights??=[],catalogId='osm-node-5227610721';
  const pin=window.VietnamTourism.entries.find(p=>p.id===catalogId);
  if(!pin)throw Error('Missing Sa Đéc house');
  const yaw=1.987,c=Math.cos(yaw),s=Math.sin(yaw),id='nha-co-huynh-thuy-le';
  const lime=0xc5c1ad,cream=0xdedbc5,shadow=0xa9a392,darkStone=0x888575,blue=0x436c72,gold=0xc8a651;
  const tile=0x725747,tileEdge=0x97816b,timber=0x514237,ebony=0x453c34,ochre=0xc0a77b;
  const gilt=0xc3974b,vermilion=0x864538,bronze=0x86734a,green=0x667546;
  const Z=10.90;
  function round(k,col,x,y,z,r,h){k.stamp(k.round,col,x,y,z,r,h,r);}
  function turn(T,k,x,y,z,shade,points,n=12){
    const g=new T.LatheGeometry(points.map(([r,v])=>new T.Vector2(r,v)),n);
    k.stamp(g,shade,x,y,z);g.dispose();
  }
  function curve(T,k,col,z,pts,r){
    const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(([x,y])=>new T.Vector3(x,y,z))),
      Math.max(6,pts.length*2),r,5,false);k.stamp(g,col,0,0,0);g.dispose();
  }
  function oval(T,k,col,x,y,z,rx,ry,rz){
    const g=new T.SphereGeometry(1,12,7);k.stamp(g,col,x,y,z,rx,ry,rz);g.dispose();
  }
  function reliefLeaf(k,col,x,y,z,size,sign=1){
    k.outline([[0,0],[.13,.01],[.26,.075],[.40,.23],[.37,.33],[.25,.24],[.20,.19],[.17,.24],[.10,.19],[.075,.09]]
      .map(([u,v])=>[u*size*sign,v*size]),col,x,y,z,.039);
  }
  function crest(T,k,x,y,z,scale){
    for(const sign of [-1,1]){
      const pts=[[.03,.16],[.22,.21],[.34,.41],[.56,.43],[.70,.31],[.80,.33],[.87,.43]];
      curve(T,k,shadow,z,pts.map(([u,v])=>[x+u*sign*scale,y+v*scale]),.070*scale);
      reliefLeaf(k,cream,x+.39*sign*scale,y+.37*scale,z+.017,scale*.85,sign);
      reliefLeaf(k,cream,x+.11*sign*scale,y+.23*scale,z+.014,scale*.64,sign);
    }
    oval(T,k,shadow,x,y+.53*scale,z,.29*scale,.36*scale,.085);
    oval(T,k,cream,x,y+.53*scale,z+.06,.22*scale,.275*scale,.068);
    oval(T,k,lime,x,y+.54*scale,z+.09,.145*scale,.205*scale,.056);
    reliefLeaf(k,cream,x-.08*scale,y+.80*scale,z+.008,.57*scale,1);
  }
  function band(T,k,x,z,span,sy,rx,ry){
    const section=new T.Shape();
    section.moveTo(-span/2,0);section.lineTo(-rx,0);section.lineTo(-rx,sy);
    section.absellipse(0,sy,rx,ry,Math.PI,0,true,0);
    section.lineTo(rx,0);section.lineTo(span/2,0);section.lineTo(span/2,4.00);
    section.lineTo(-span/2,4.00);section.closePath();
    k.profile(section,lime,x,.49,z-.25,.43);
    const pts=[];
    for(let i=0;i<=14;i++){
      const a=Math.PI*i/14;pts.push([x+Math.cos(a)*rx,.49+sy+Math.sin(a)*ry]);
    }
    curve(T,k,cream,z+.203,pts,.078);
    curve(T,k,shadow,z+.181,pts.map(([u,v])=>[x+(u-x)*1.075,.49+sy+(v-.49-sy)*1.085]),.041);
    for(const side of [-1,1]){
      const xx=x+side*rx;
      round(k,cream,xx,.49+sy*.5,z+.20,.095,sy);
      for(const [yy,w,h] of [[.55,.36,.13],[.72,.29,.14],[sy+.42,.33,.10],[sy+.55,.35,.10]])
        k.box(cream,xx,yy,z+.20,w,h,.24);
      reliefLeaf(k,cream,x+side*rx*.76,.49+sy+ry*.83,z+.208,.50,side);
    }
    if(rx>.65){
      k.outline([[-.11,.07],[.12,.07],[.08,-.12],[0,-.19],[-.085,-.12]],cream,x,.49+sy+ry+.10,z+.19,.14);
      for(const sign of [-1,1]){
        reliefLeaf(k,shadow,x+sign*.068,.49+sy+ry+.02,z+.21,.90,sign);
        const crown=.49+sy+ry;
        curve(T,k,shadow,z+.23,[[x+sign*.08,crown+.015],[x+sign*.32,crown+.091],[x+sign*.47,crown+.073],
          [x+sign*.57,crown+.16],[x+sign*.49,crown+.20],[x+sign*.43,crown+.14]],.031);
        for(let j=0;j<3;j++)reliefLeaf(k,cream,x+sign*(.29+j*.19),crown+.046-j*.058,z+.23,.43,sign);
      }
    }
  }
  function balustrade(T,k,x,y,z,w,height,n){
    k.box(lime,x,y+.07,z,w,.14,.19);k.box(cream,x,y+height,z,w,.12,.225);
    const g=new T.LatheGeometry([[.075,0],[.085,.045],[.04,.10],[.048,.16],[.078,.22],[.073,.27],
      [.042,.34],[.047,.39],[.072,.43]].map(([r,v])=>new T.Vector2(r,v)),9);
    for(let j=0;j<n;j++){const xx=x+((j+.5)/n-.5)*w;k.stamp(g,cream,xx,y+.12,z,1,(height-.17)/.43,1);}
    g.dispose();
  }
  function facade(T,k){
    for(const [x,span,rx,sy,ry] of [[-4.04,3.63,1.03,2.47,.98],[-1.83,.99,.416,2.46,.48],
      [0,2.67,1.09,2.48,.93],[1.83,.99,.416,2.46,.48],[4.04,3.63,1.03,2.47,.98]])
      band(T,k,x,Z,span,sy,rx,ry);
    for(const x of [-5.64,-2.59,2.59,5.64]){
      k.box(lime,x,2.40,Z+.17,.43,3.81,.30);
      for(let j=0;j<10;j++){
        const y=.72+j*.345;
        k.box(shadow,x,y,Z+.326,.40,.285,.049);k.box(lime,x,y+.02,Z+.35,.34,.226,.052);
      }
      for(const [y,w,h] of [[.54,.60,.14],[.71,.51,.14],[3.86,.50,.14],[4.02,.64,.13],[4.12,.69,.10]])
        k.box(cream,x,y,Z+.20,w,h,.39);
    }
    for(const x of [-3.05,-1.83,1.83,3.05])balustrade(T,k,x,.53,Z-.018,x===-1.83||x===1.83?.78:.75,.73,4);
    for(const [y,w,h,d,col] of [[4.10,11.90,.17,.56,shadow],[4.25,11.98,.13,.68,cream],[4.38,12.12,.10,.82,lime],
      [4.54,11.94,.20,.64,shadow],[4.67,12.18,.095,.85,cream],[4.78,12.23,.092,.91,lime]])
      k.box(col,0,y,Z,w,h,d);
    for(let j=-26;j<=26;j++)k.box(cream,j*.222,4.47,Z+.35,.104,.12,.16);
    for(const side of [-1,1]){
      for(const x of [2.76,5.55]){
        const xx=x*side;k.box(lime,xx,5.16,Z,.35,.81,.46);
        k.box(cream,xx,5.53,Z,.45,.10,.54);
      }
      balustrade(T,k,side*4.20,4.83,Z,2.58,.56,12);
      crest(T,k,side*4.12,5.43,Z+.015,.60);
      const px=side*1.84;k.box(cream,px,5.10,Z,1.71,.57,.46);
      k.box(shadow,px,5.10,Z+.244,1.45,.40,.05);k.box(blue,px,5.10,Z+.275,1.24,.29,.032);
      oval(T,k,gold,px,5.10,Z+.30,.20,.108,.025);
      for(const sign of [-1,1]){reliefLeaf(k,gold,px+.18*sign,5.035,Z+.30,.49,sign);
        curve(T,k,ochre,Z+.31,[[px+.12*sign,5.12],[px+.31*sign,5.16],[px+.46*sign,5.13],[px+.52*sign,5.18]],.017);}
    }
    k.box(lime,0,5.14,Z,2.25,.67,.47);k.box(cream,0,5.14,Z+.247,1.99,.44,.08);
    k.box(lime,0,5.15,Z+.296,1.84,.30,.034);
    for(const side of [-1,1])crest(T,k,side*.72,5.45,Z+.01,.48);
    crest(T,k,0,5.44,Z+.05,1.02);
  }
  function gableRoof(T,k,center,depth,height){
    const w=11.79,base=4.59,rowMesh=[];
    const rise=x=>height+.48*Math.pow(Math.abs(x)/(w/2),5);
    for(let j=0;j<14;j++){
      const x0=-w/2+w*j/14,x1=-w/2+w*(j+1)/14;
      for(const e of [-1,1]){
        const a=[x0,base,center+e*depth/2],b=[x1,base,center+e*depth/2],u=[x0,base+rise(x0),center],v=[x1,base+rise(x1),center];
        if(e>0)rowMesh.push(...a,...b,...v,...a,...v,...u);else rowMesh.push(...a,...v,...b,...a,...u,...v);
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(rowMesh,3));g.computeVertexNormals();k.stamp(g,tile,0,0,0);g.dispose();
    const ridge=[];for(let j=0;j<=14;j++){const x=(j/14-.5)*w;ridge.push([x,base+rise(x)+.015]);}
    curve(T,k,tileEdge,center,ridge,.105);
    for(const e of [-1,1]){
      k.outline([[-depth/2,0],[depth/2,0],[0,rise(w/2)]],ochre,e*(w/2-.06),base,center,.13,e*Math.PI/2);
      curve(T,k,tileEdge,center,[[e*4.95,base+rise(e*4.95)],[e*5.47,base+rise(e*5.47)+.10],
        [e*5.80,base+rise(e*5.80)+.20],[e*5.97,base+rise(e*5.97)+.30]],.053);
    }
  }
  function carving(T,k,x,y,z,w,h){
    // Paired phoenixes in the central transom. The remaining pierced foliage
    // is drawn as separate branches with open spaces back to the dark frame.
    const left=x-w/2,right=x+w/2;
    k.box(timber,x,y+h*.49,z,w,.11,.125);
    for(const side of [-1,1]){
      const len=w*.47;
      const line=[[0,.26],[.12,.19],[.23,.34],[.30,.63],[.42,.72],[.46,.55],[.52,.38],[.68,.36],[.79,.57],[.88,.72],[1,.91]];
      curve(T,k,gilt,z+.007,line.map(([u,v])=>[x+side*u*len,y+(v-.5)*h]),.039);
      curve(T,k,ochre,z+.021,[[x,y+h*.36],[x+side*len*.17,y+h*.34],[x+side*len*.37,y+h*.13],
        [x+side*len*.57,y-h*.19],[x+side*len*.76,y-h*.20],[x+side*len*.89,y-h*.06],[x+side*len,y+h*.25]],.029);
      for(let j=1;j<=7;j++){
        const a=j*.116,xx=x+side*a*len,yy=y+Math.sin(j*1.4)*h*.12;
        curve(T,k,gilt,z+.013,[[xx-side*.11,yy-.10],[xx,yy],[xx+side*.13,yy+.11]],.022);
        reliefLeaf(k,gilt,xx,yy,z+.029,Math.min(.61,w*.19),side);
        reliefLeaf(k,ochre,xx-side*.03,yy-.16*h,z+.034,Math.min(.44,w*.17),-side);
      }
      const bx=x+side*len*.40,by=y+.08*h;
      k.outline([[0,0],[.09,.12],[.15,.13],[.19,.08],[.28,.065],[.18,.037],[.13,.051],[.07,-.066],[-.04,-.09],[-.17,-.045],[-.32,-.087],[-.19,.012]]
        .map(([u,v])=>[u*side*w*.24,v*h]),gilt,bx,by,z+.054,.042);
    }
    for(const xx of [left,right])k.box(gilt,xx,y+h*.30,z,.062,h*.49,.10);
  }
  function framed(T,k,x,y,z,w,h,body){
    k.box(body,x,y,z,w,h,.12);
    for(const sign of [-1,1]){k.box(gilt,x+sign*(w/2-.026),y,z+.09,.048,h,.064);
      k.box(gilt,x,y+sign*(h/2-.024),z+.09,w,.048,.064);}
  }
  function table(k,x,z,w,d,h){
    k.box(timber,x,h,z,w,.095,d);
    for(const dx of [-1,1])for(const dz of [-1,1]){
      k.box(ebony,x+dx*(w/2-.091),(.50+h)/2,z+dz*(d/2-.084),.107,h-.50,.116);
    }
    k.box(timber,x,h-.19,z+d*.46,w-.10,.27,.068);
  }
  function altar(T,k){
    const portraitZ=-.45;
    k.box(timber,0,2.53,-.78,3.39,4.11,.22);
    framed(T,k,0,2.81,portraitZ,1.49,2.24,vermilion);
    for(const e of [-1,1]){
      framed(T,k,e*.92,2.79,portraitZ,.265,2.33,vermilion);
      for(let j=0;j<7;j++)reliefLeaf(k,gilt,e*.92-.059,1.79+j*.30,portraitZ+.12,.35,1);
    }
    // Five planes at the measured visual breaks in the image. Separate depths
    // retain the projection of the original mouldings around the recessed art.
    const map=new T.TextureLoader().load('sight-imagery/quan-cong-sa-dec.webp');
    map.colorSpace=T.SRGBColorSpace;
    const pts=[],uv=[];
    function crop(u0,v0,u1,v1,z){
      for(const [u,v] of [[u0,v1],[u1,v1],[u1,v0],[u0,v1],[u1,v0],[u0,v0]]){
        pts.push((u-.5)*3.06,1.63+(.805-v)*4.01,z);uv.push(u,1-v);
      }
    }
    crop(.020,.115,.975,.304,portraitZ+.148);
    crop(.020,.304,.354,.772,portraitZ+.136);crop(.669,.304,.975,.772,portraitZ+.136);
    crop(.354,.304,.669,.772,portraitZ+.121);crop(.020,.772,.975,.805,portraitZ+.145);
    const panel=new T.BufferGeometry();panel.setAttribute('position',new T.Float32BufferAttribute(pts,3));
    panel.setAttribute('uv',new T.Float32BufferAttribute(uv,2));panel.computeVertexNormals();
    const painting=new T.Mesh(panel,new T.MeshStandardMaterial({map,color:0xc2b59e,roughness:.83,emissiveMap:map,emissive:0x32291e}));
    painting.receiveShadow=true;k.group.add(painting);
    k.box(timber,0,4.59,portraitZ-.012,3.29,.28,.35);
    carving(T,k,0,4.55,portraitZ+.16,3.15,.38);
    table(k,0,.16,3.12,.91,1.60);table(k,0,1.24,2.43,.75,1.19);
    carving(T,k,0,1.02,1.59,2.13,.39);
    for(const e of [-1,1]){
      framed(T,k,e*1.17,1.81,-.15,.45,.37,timber);
      turn(T,k,e*.91,1.65,.20,cream,[[.10,0],[.13,.09],[.12,.28],[.06,.34],[.072,.40]],16);
      for(let j=0;j<4;j++)oval(T,k,j%2?gilt:ochre,e*.91+(j-1.5)*.045,2.10+Math.sin(j)*.045,.20,.064,.072,.059);
    }
    turn(T,k,0,1.65,.23,bronze,[[.10,0],[.08,.055],[.16,.091],[.17,.16],[.21,.20],[.18,.22]],16);
    for(const e of [-1,1])round(k,bronze,e*.15,1.47,1.21,.055,.41);
    for(const x of [-2.08,2.08,-4.78,4.78]){
      round(k,ebony,x,2.65,2.09,.16,4.26);round(k,shadow,x,.56,2.09,.24,.20);
      for(let j=0;j<8;j++){
        const xx=x+Math.sin(j*1.21)*.046;reliefLeaf(k,gilt,xx,.97+j*.41,2.245,.47,j%2===0?-1:1);
      }
    }
    k.box(ebony,0,4.69,2.06,10.64,.28,.29);
    for(const x of [-3.43,0,3.43])carving(T,k,x,4.31,2.09,x===0?4.04:2.54,.94);
    framed(T,k,0,4.79,1.99,2.47,.53,ebony);
    for(const side of [-1,1]){
      k.box(timber,side*3.35,2.60,-.94,2.42,4.24,.17);
      for(const x of [-.69,.69]){
        const px=side*3.35+x;framed(T,k,px,2.76,-.81,.89,2.86,ebony);
        for(let j=0;j<7;j++){const yy=1.57+j*.35,dir=j%2?1:-1;
          curve(T,k,ochre,-.682,[[px,yy-.12],[px+dir*.09,yy-.01],[px+dir*.18,yy+.11]],.015);
          reliefLeaf(k,gilt,px+dir*.10,yy+.02,-.66,.37,dir);}
      }
    }
  }
  function house(T,k){
    k.box(shadow,0,.23,0,11.70,.46,21.95);
    k.box(cream,0,.48,0,11.62,.063,21.85);
    for(const e of [-1,1])k.box(ochre,e*5.70,2.58,-.07,.35,4.20,21.55);
    k.box(ochre,0,2.58,-10.82,11.56,4.20,.33);
    // Three timber doorways set back from the five facade openings.
    for(const x of [-4.04,0,4.04]){
      for(const e of [-1,1]){
        k.box(ochre,x+e*1.45,2.55,8.85,.81,4.09,.30);
        k.box(timber,x+e*.98,2.08,8.80,.10,3.11,.22);
        k.place(x+e*.98,8.78,e*.49,()=>{
          k.box(ebony,0,2.03,-.40,.095,3.03,.84);
          for(const y of [.78,1.95,3.27])k.box(timber,-e*.054,y,-.40,.030,.10,.78);
          for(const z of [-.68,-.41,-.14])k.box(timber,-e*.054,2.42,z,.034,.79,.035);
        });
      }
      k.box(timber,x,3.62,8.82,2.13,.15,.26);
      k.box(ochre,x,4.12,8.85,2.15,.86,.31);
    }
    k.box(ochre,0,5.30,4.49,11.38,.15,12.36);
    k.box(timber,0,4.64,-5.96,11.45,.16,9.82);
    k.box(ebony,0,4.98,-1.49,11.46,.80,.21);
    for(const side of [-1,1])k.box(ochre,side*5.71,4.98,4.38,.33,.86,12.40);
    k.box(ochre,0,4.94,-10.79,11.45,.73,.32);
    // A small inlaid central floor with the square-and-flower repeat visible in
    // the photographs. Keep it under the three publicly documented front bays.
    const cv=document.createElement('canvas');cv.width=cv.height=96;const ctx=cv.getContext('2d');
    ctx.fillStyle='#aaa79a';ctx.fillRect(0,0,96,96);ctx.strokeStyle='#7a7a70';ctx.lineWidth=2;ctx.strokeRect(0,0,96,96);
    ctx.strokeStyle='#798681';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(48,5);ctx.lineTo(91,48);ctx.lineTo(48,91);ctx.lineTo(5,48);ctx.closePath();ctx.stroke();
    for(let j=0;j<4;j++){ctx.save();ctx.translate(48,48);ctx.rotate(j*Math.PI/2);ctx.fillStyle='#848c7b';ctx.beginPath();ctx.ellipse(0,-12,7,14,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(31,32);
    const floor=new T.Mesh(new T.PlaneGeometry(11.23,12.5),new T.MeshStandardMaterial({map,roughness:.84}));
    floor.rotation.x=-Math.PI/2;floor.position.set(0,.525,3.99);floor.receiveShadow=true;k.group.add(floor);
    facade(T,k);gableRoof(T,k,6.11,9.78,2.12);gableRoof(T,k,-4.80,12.07,1.69);altar(T,k);
  }
  function courtWall(k,left){
    const sign=left?1:-1,length=left?22.62:18.26,col=left?0x9ebabe:0xd0cec4;
    k.box(col,0,3.48,0,.33,6.96,length);k.box(shadow,0,.27,0,.35,.54,length+.02);
    k.box(col,-sign*.58,6.91,0,1.43,.22,length+.11);
    k.box(col,-sign*.58,3.44,-length/2+.13,1.43,6.88,.27);
    for(const z of (left?[-6.38,-4.50]:[-3.03,1.12])){
      const y=left?5.10:4.70,w=left?1.04:1.16,h=left?.54:1.29;
      k.box(cream,sign*.18,y,z,.10,h+.18,w+.16);k.box(left?blue:0x58666a,sign*.24,y,z,.034,h,w);
      if(left){for(let j=0;j<4;j++)k.box(col,sign*.27,y+(j-1.5)*.113,z,.045,.041,w*.96);}
      else{k.box(cream,sign*.266,y,z,.04,.055,w);k.box(cream,sign*.266,y,z,.04,h,.051);}
    }
  }
  function courtyard(T,k){
    k.box(shadow,0,.12,0,11.04,.24,24.3);
    for(const e of [-1,1])for(let j=0;j<4;j++){
      const x=e*(2.28+(j%2)*.08),z=-7.90+j*4.10;
      const wide=j%2?.49:.61,clay=j%2?0x9d7159:0x8b8f77;
      turn(T,k,x,.24,z,clay,[[wide*.56,0],[wide*.68,.08],[wide*.80,.40],[wide,.57],[wide,.63],[wide*.85,.64]],j%2?6:18);
      round(k,0x574e3d,x,.87,z,wide*.84,.046);
      const trees=window.createTreeModels(T),tree=new T.Mesh(trees.geometry('tea',true,j+1),trees.material);
      tree.scale.set(1.80+(j%2)*.30,1.48+(j%3)*.18,1.60);tree.position.set(x,.88,z);tree.rotation.y=(e+j)*1.72;tree.castShadow=true;k.group.add(tree);
      for(const side of [-1,1]){const xx=x+side*.56,zz=z+.53;
        turn(T,k,xx,.24,zz,cream,[[.11,0],[.15,.21],[.16,.25]],9);
        oval(T,k,green,xx,.61,zz,.23,.20,.20);oval(T,k,0xc4a345,xx,.77,zz,.12,.07,.10);}
    }
  }
  function view(name,x,z,height,viewRadius,angle,viewElevation){return {name,offset:[c*x+s*z,-s*x+c*z],height,viewRadius,viewAngle:yaw+angle,viewElevation};}
  sites.push({...pin,id,catalogId,name:'Nhà cổ Huỳnh Thủy Lê',kind:'Di tích',lon:105.7682602,lat:10.2939100,yaw,
    width:12.2,depth:22.0,start:[105.7685973,10.2940567],mappedEntrance:true,visitOnArrival:true,approachMeters:undefined,source,photo,
    description:'Nếp nhà gỗ ba gian dựng năm 1895. Lần sửa năm 1917 tạo mặt tiền xây với ba vòm lớn xen hai vòm nhỏ, lan can con tiện và phù điêu. Qua hiên là gian thờ Quan Công với khung chạm sơn son thếp vàng. Tỷ lệ trang trí và vị trí các đồ thờ trong gian giữa được ước theo ảnh.',
    arrivalNote:'Xe dừng trên đường Nguyễn Huệ ven sông Sa Đéc. Đi bộ qua sân cây kiểng, lên bậc đá giữa mặt tiền để vào hiên.',
    boundary:[[-6.0,-11.1],[6.0,-11.1],[6.0,11.22],[5.55,35.62],[-5.55,35.62],[-6.0,11.22]],
    reserve:(x,z,r)=>Math.abs(x)<6.10+r&&z>-11.2-r&&z<36+r,
    solids:[[0,0,5.83,10.99]],views:[
      view('Từ sân cây kiểng nhìn vào năm vòm',0,10.05,8.1,13.4,.035,.018),
      view('Lan can, ô khảm và đầu hồi cong',.05,10.30,11.50,12.3,.42,.085),
      {...view('Gian thờ Quan Công và bao lam',0,.65,5.70,5.7,.14,.007),
        photoCredit:'Tranh và khung thờ cắt từ ảnh của Bùi Thụy Đào Nguyên · CC BY-SA 3.0',
        description:'Tranh Quan Công nằm giữa hai lối đi. Hai cột gỗ và bao lam thếp vàng đóng khung gian thờ. Tranh và các dải trang trí ở khung được cắt từ ảnh chụp tại nhà cổ.',arrivalNote:''}
    ],build(T,k){
      k.palette({stone:[shadow,darkStone],plaster:[lime,cream,ochre],timber:[timber,ebony],tile:[tile]});
      const f=createTempleFoundations(T,k),main=f.building(0,0,0,11.71,21.96,()=>house(T,k));
      main.elevation=g=>Math.max(g(0,10.97),g(0,-7.5));
      const court=f.building(0,23.54,0,11.04,24.3,()=>courtyard(T,k));
      court.elevation=g=>main.elevation(g)-.48;
      // Only the two courtyard elevations visible in Commons image 170139943.
      // Their axes follow the neighboring Google footprints, not the house axis.
      const left=f.building(-7.84,18.55,-.043,.34,22.62,()=>courtWall(k,true));
      const right=f.building(6.47,20.77,.072,.34,18.26,()=>courtWall(k,false));
      left.elevation=right.elevation=court.elevation;
      f.stairs(main,0,10.99,0,12.59,3.64,.50,4);
    }});
})();
