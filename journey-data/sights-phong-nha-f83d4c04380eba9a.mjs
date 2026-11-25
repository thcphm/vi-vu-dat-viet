const window = Object.create(globalThis);
window.VietnamSights = [];
'use strict';
(() => {
  const A = window.CentralArch;
  const park = 'https://phongnhakebang.vn/';
  const oxalis = 'https://oxalisadventure.com/';
  const tau = 2*Math.PI;
  const sites = window.VietnamSights ??= [];

  const {batch,boulder,grotto,river,finish,walkway}=globalThis.VietnamKarst;
  const register=(node,settings,build)=>globalThis.VietnamKarst.register(sites,node,settings,build);

  // w874635531 follows the visible river to the southern, active entrance.
  // w1150913681 gives only the bearing to the distant outlet. The first bend
  // is interpreted here; the expedition's large sunlit campsite is farther in.
  const enSections=[[0,0,10.2,7.7,-.32],[5,-1.4,11.4,9.5,-.34],[13,-5.4,13.2,12.9,-.36],
    [22,-11.7,13.5,15.3,-.37],[33,-21.6,12.7,13.9,-.39],[42,-31,10.2,11.4,-.40]];
  function enChannel(z){
    if(z>=0)return z<22.7?.30*z/22.7:.30+(z-22.7)*1.1/16.7;
    const d=-z,i=enSections.findIndex(row=>row[0]>=d);
    if(i<0)return enSections.at(-1)[1];
    const a=enSections[Math.max(0,i-1)],b=enSections[i];
    return a[1]+(b[1]-a[1])*(d-a[0])/Math.max(.01,b[0]-a[0]);
  }
  const enWidth=z=>4.05+.83*Math.cos(.103*z)+.42*Math.sin(.27*z);
  register(6358064546,{source:oxalis+'cave/hang-en-cave/',yaw:0,width:73,depth:89,
    caveOpening:{sections:enSections,approach:43},foundationAt:[.08,5.2],
    mappedEntrance:true,arrivalNote:'Xe đỗ trên đường ô tô, cách Hang Én khoảng 2,6 km theo đường thẳng. Góc ngắm đưa bạn tới cửa hang bên dòng Rào Thương.',
    shots:[['Rào Thương vào cửa thấp',0,-.6,12.7,30,.13,.12],['Theo mép cát vào vòm đá',-4.1,-11,8.3,16,.31,.065]],
    description:'Ở cửa thấp của Hang Én, Rào Thương chảy từ lòng thung lũng vào dưới vòm đá vôi. Qua bãi cát và cuội ven bờ, dòng sông tiếp tục về tây bắc trong núi. Cửa lớn đón nắng nằm sâu hơn trên hành trình.'},
    (T,kit)=>{
      const rock=batch(T);
      grotto(rock,enSections,34,28,.7);
      river(T,kit.group,[-42,42],enChannel,enWidth,false,32);
      for(const side of [-1,1])rock.grid(28,64,(u,t)=>{
        const z=-40+t*84,w=enWidth(z),outer=z<0?Math.min(12,12+z*.035):23+.25*z;
        const x=enChannel(z)+side*(w-.84+u*(outer-w+.84));
        const bank=(.51+.45*Math.cos(.10*z+.71*side))*Math.sin(Math.min(1,u*2.3)*Math.PI*.49);
        const bar=side===1?1.19*Math.exp(-(((z+6)/12)**2))*Math.sin(u*Math.PI):0;
        const grain=.038*Math.sin(3.6*x+1.8*z)+.022*Math.cos(5*z+.8*x);
        return [x,-.13+bank+bar+grain,z,u<.17?0xa89c73:side===1?0xc1ab82:0xa59d80,
          (.40+.53/(1+Math.exp((-z-7)*.16)))*(.90+.09*Math.cos(1.7*x-.3*z))];
      });
      for(let i=0;i<57;i++){
        const z=-27+kit.random()*54,side=i%2?1:-1,sz=.13+kit.random()**2*1.08;
        const edge=enWidth(z)+.1+kit.random()*(side===1?2.3:4.0);
        boulder(rock,enChannel(z)+side*edge,.30,z,sz*1.57,sz*.86,sz*1.21,i);
      }
      // Keep one fluvial datum through both banks, throat and underground
      // river. Beyond the banks the outer aprons meet the uncut valley sides.
      finish(T,kit,rock,(ground,x,z)=>{
        const outside=Math.abs(x-enChannel(z))-(z<0?14:9),t=Math.min(1,Math.max(0,outside/(z<0?19:14)));
        return .0027*Math.max(-42,Math.min(42,z))+t*t*(3-2*t)*ground(x,z);
      });
    });

  register(3157796075,{source:oxalis+'vi/tour/tham-hiem-son-doong-4n3d/',yaw:.32,width:38,depth:25,
    mappedEntrance:true,arrivalNote:'Xe đỗ trên đường ô tô, cách hang khoảng 3,3 km theo đường thẳng. Từ đây máy ảnh chuyển tới Sơn Đoòng.',
    shots:[['Miệng hang trong rừng',0,0,10,26,.04,.31],['Khe đá xuống hang',.2,-1.8,7,12,-.12,.25]],
    description:'Lối vào Sơn Đoòng khuất trong rừng. Qua khe mở hẹp là dốc đá đổ xuống bóng tối. Góc ngắm mô phỏng đoạn đầu, còn ảnh 360° cho thấy hành trình tới các hố sụt.'},
    (T,kit)=>{
      const rock=batch(T);
      grotto(rock,[[0,0,3.7,5.4,3.4],[3,-.5,3.1,6.3,1.7],[7,-1.7,3.4,6.6,.6],[12,-4,2.8,5.3,.1]],18,14,3.4);
      // Uneven limestone lip falls away into the cleft.
      rock.grid(26,22,(u,v)=>{
        const z=-9+16*v,x=(2*u-1)*(2.65+.45*Math.cos(v*4))-.22*Math.max(0,-z);
        const y=z<0?Math.max(0,3.4+z*.41):3.4*Math.max(0,1-z/7);
        return [x,.12+y+.18*Math.cos(x*2+z*.5),z,0xa6a392,.58+.32*v];
      });
      for(let i=0;i<24;i++){
        const side=i%2?1:-1,x=side*(4+kit.random()*9),z=-1+kit.random()*8;
        const size=1+kit.random()*2.2;
        boulder(rock,x,0,z,size*1.15,size*(1.1+.7*kit.random()),size,i,true);
      }
      for(let i=0;i<22;i++){
        const x=(kit.random()-.5)*4.8,z=kit.random()*6;
        const y=3.4*(1-z/7),size=.22+kit.random()*.45;
        boulder(rock,x,y,z,size*1.3,size*.82+.36,size,i,true);
      }
      finish(T,kit,rock);
    });

  // w1416099207 reaches the entrance from the north, then its mapped axis
  // continues under the mountain. Only its outer 18.6 m sit on the surface.
  function tienSonStairs(T,kit){
    const count=49,spans=10,run=18.6,dx=-.60,angle=Math.atan2(dx,run);
    const group=new T.Group(),pose=new T.Object3D(),up=new T.Vector3(0,1,0);
    const blocks=new T.InstancedMesh(new T.BoxGeometry(),new T.MeshStandardMaterial({color:0xa49a87,roughness:.97}),count);
    const rails=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,8),new T.MeshStandardMaterial({color:0x736a5d,roughness:.77}),2*(2*spans+1));
    for(const m of [blocks,rails]){m.castShadow=m.receiveShadow=true;group.add(m);}kit.group.add(group);
    const fit=kit.group.userData.fitGround;
    function update(ground){
      const tread=t=>ground(dx*t,run*t)+1.41*(1-t)+.11*t;
      for(let j=0;j<count;j++){
        const t=(j+.5)/count,h=tread(t),riser=Math.max(.27,Math.abs(tread(j/count)-tread((j+1)/count))+.16);
        pose.rotation.set(0,angle,0);pose.position.set(dx*t,h-riser/2,run*t);pose.scale.set(2.38,riser,Math.hypot(dx,run)/count+.016);pose.updateMatrix();blocks.setMatrixAt(j,pose.matrix);
      }
      let index=0;
      function bar(a,b,r){
        const axis=b.clone().sub(a);pose.position.copy(a).lerp(b,.5);pose.quaternion.setFromUnitVectors(up,axis.clone().normalize());
        pose.scale.set(r,axis.length(),r);pose.updateMatrix();rails.setMatrixAt(index++,pose.matrix);
      }
      for(const side of [-1,1]){
        let previous;
        for(let j=0;j<=spans;j++){
          const t=j/spans,p=new T.Vector3(dx*t+side*1.14,tread(t),run*t),q=p.clone().addScaledVector(up,.97);
          bar(p,q,.045);if(previous)bar(previous,q,.052);previous=q;
        }
      }
      for(const m of [blocks,rails]){m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();m.computeBoundingBox();}
    }
    update(()=>0);kit.group.userData.fitGround=ground=>{fit(ground);update(ground);};
  }
  const tienSections=[[0,0,4.6,4.8,1.38],[4,0,6.4,5.9,.8],[9,.4,7.8,7.1,.5],[18,1.4,7,6,.3]];
  register(3499399985,{source:park+'cave/dong-tien-son-1',yaw:Math.PI,width:30,depth:40,
    caveOpening:{sections:tienSections,approach:1.2},modeledStairWays:[1416099207],
    shots:[['Bậc đá trước cửa động',0,0,6.5,18,.32,.12],['Rèm nhũ đá',-1.7,-4.7,9.6,6.55,.38,.075]],
    description:'Từ sườn núi, các bậc cấp dẫn vào động khô Tiên Sơn. Dưới trần hang, những nếp rèm và cột nhũ đá đón ánh sáng từ cửa động.'},
    (T,kit)=>{
      const rock=batch(T);
      grotto(rock,tienSections,15,12,1.9);
      rock.grid(32,15,(u,v)=>{
        const edge=Math.abs(2*u-1),z=-.62+4.3*v+.19*edge*Math.sin(12*u);
        const apron=Math.min(1,Math.max(0,(z-1.1)/2.25)),x=(2*u-1)*(6.13-2.45*apron+.12*Math.cos(8*v));
        const level=1.25*(1-apron)-.25*apron-.18*edge**2;
        return [x,level+.045*Math.cos(x*3.2+z*.8),z,0xa39984,.71+.12*Math.cos(x*.7+z*.46)];
      });
      rock.grid(12,6,(u,v)=>[-6.6+u*16.1,-.65+v*7.3,-18.24,0x494339,.45]);
      walkway(T,kit,[[0,-.25],[-.30,-3.1],[-.79,-8.1],[-1.43,-15.8]],1.56,1.45,0x866744);
      // Interleaved calcite curtains sag along their hem. Keep channels
      // between the folds so the close camera can see the warmer lining.
      for(let i=0;i<3;i++)rock.grid(64,10,(u,v)=>{
        const x=-3.2+u*(3.7-i*.38),drop=(1.15+.26*i+1.4*Math.sin(Math.PI*u)**.72+
          .37*Math.cos(u*19+i))*v;
        const flutes=Math.sin(41*u+.7*i)+.29*Math.sin(77*u-i);
        return [x+.12*drop*Math.sin(7*u),6.05-drop,-4.45-i*.44+flutes*(.12+.29*v),
          i%2?0xcba77d:0xe3caa1,.77+.18*Math.cos(41*u+.7*i)];
      });
      for(const [x,z,height,r] of [[-3.4,-4.6,5.6,.68],[-3.95,-5.4,4.7,.77],[3.8,-7.1,5.4,.52]]){
        rock.grid(28,16,(u,v)=>{
          const a=tau*u,w=r*(.52+1.2*(2*v-1)**4+.14*Math.cos(8*a+v*3));
          return [x+w*Math.cos(a),.4+height*v,z+w*Math.sin(a),0xcbb28e,.80+.13*Math.cos(8*a+v*3)];
        });
      }
      for(let i=0;i<5;i++)boulder(rock,4+i*.45,0,-3+i*.68,.8,1.6+i*.27,.7,i);
      finish(T,kit,rock,(ground,x,z)=>{
        const margin=Math.min(1,Math.max(0,(Math.abs(x)-6.5)/8));
        const approach=Math.min(1,Math.max(0,(z-1.2)/2.15));
        return Math.max(margin,approach)*ground(x,z);
      });
      tienSonStairs(T,kit);
    });

  const darkSections=[[0,0,7.1,8.2,-.40],[4,-.2,7.65,8.8,-.42],[10,-.9,7.35,8.3,-.44],[17,-2.2,6.6,7.1,-.45],[26,-4.1,5.9,6.8,-.47]];
  const darkChannel=z=>.9+.17*Math.min(z,0)+.54*Math.sin(z*.16);
  const darkWidth=z=>3.31+.39*Math.cos(z*.15)+.48*Math.sin(z*.30);
  register(5063396623,{source:park+'du-lich/tuyen-du-lich-song-chay-hang-toi5',yaw:Math.PI,width:42,depth:57,
    caveOpening:{sections:darkSections,approach:29},foundationAt:[0,3.4],
    shots:[['Lối gỗ ven Hang Tối',-.55,-1.2,10.4,25,-.13,.14],['Từ vòm đá nhìn ra sông Chày',-.65,-3.4,9.7,15.3,-3.02,.045]],
    description:'Lối gỗ có lan can men theo một bên vách. Ánh sáng từ phía sông Chày soi rõ nước xanh và các mỏm đá sát cửa, rồi nhạt dần trong hang.'},
    (T,kit)=>{
      const rock=batch(T);
      grotto(rock,darkSections,22,20,4.1);
      river(T,kit.group,[-25.9,35],darkChannel,darkWidth,false,23);
      // Operator photographs look outward along the boardwalk, with the
      // channel to the left and small limestone shelves under the timber.
      walkway(T,kit,[[-3.9,19],[-2.65,12],[-3.07,7],[-4.23,1.3],[-4,-2.3],[-5.4,-7],[-5.9,-12],[-6.7,-16.7]],1.24,1.23,0x826b50);
      for(const side of [-1,1])rock.grid(17,52,(u,t)=>{
        const z=-24+t*60,centre=darkChannel(z),edge=darkWidth(z)-.65;
        const w=z<0?5.7:10+z*.24,x=centre+side*(edge+u*w);
        const ridge=(.65+.28*Math.sin(.67*z+side)+.28*Math.cos(.8*x+.19*z))*Math.min(1,u*5);
        return [x,-.25+ridge+.07*Math.cos(z*.9+x*2.2),z,side<0?0x758065:0x8e927d,.68+.23*Math.cos(.6*x+z*.3)];
      });
      for(let i=0;i<40;i++){
        const z=-13+kit.random()*42,sz=.31+kit.random()*.83,side=i%3?1:-1;
        boulder(rock,darkChannel(z)+side*(darkWidth(z)+kit.random()*2.6),.21,z,sz*1.52,sz*.92,sz*1.33,i,true);
      }
      for(const [x,z,r,h] of [[-7,1.5,1.55,2.5],[-6.3,5.9,1.38,1.7],[5.5,2.8,1.69,2.3],[6.6,8.3,2.45,3.7],
        [6.4,13.9,1.65,2.5],[-6.8,12.1,1.84,2.6],[-6.1,18,1.53,1.9],[4.6,20.6,1.44,1.7]])boulder(rock,x,.15,z,r,h,r*1.18,z,true);
      for(const [x,z,h] of [[-7.8,8.1,6.3],[8.3,9.7,7.5],[8.8,14.5,5.4],[-7.6,15.8,7.1],[-8.3,21.3,6.4],[7.5,22.9,8.1],[-9,28,8.4],[9.3,30.3,6.7]])rock.trees.push([x,.22,z,h*.77,h,z*.27]);
      finish(T,kit,rock,(ground,x,z)=>{
        const side=Math.abs(x-darkChannel(z)),t=Math.min(1,Math.max(0,(side-8.4)/11.5));
        return .0019*Math.max(-26,Math.min(35,z))+t*t*(3-2*t)*ground(x,z);
      });
    });

  register(5353612634,{source:park+'tin-tuc/hang-tam-co-khong-chi-la-mot-dia-danh-lich-su',yaw:-1.21,width:14,depth:12,
    shots:[['Cửa hang và lư hương',0,0,3.2,9.5,.1,.14],['Bậc thềm và bia tưởng niệm',3,1,3,6,.18,.14]],
    description:'Dưới vách đá bên Đường 20 Quyết Thắng là bàn thờ nhỏ. Trước cửa hang có lư hương bằng đồng, bậc thềm và tấm bia tưởng niệm.'},
    (T,kit)=>{
      const rock=batch(T),stone=0xaaa698,bronze=0x8e7852;
      grotto(rock,[[0,0,1.48,2.3,.38],[1.5,-.3,1.17,1.9,.38],[2.7,-.45,.9,1.5,.38]],6.4,5.7,.2);
      for(const [x,z,r,h] of [[-2.4,.35,1.3,2.5],[-3.9,-.9,1.6,3.5],[2.4,-1,1.1,3.1]])
        boulder(rock,x,0,z,r,h,r*1.1,x,true);
      kit.palette({stone,metal:bronze,timber:0x603c2d});
      for(let i=0;i<4;i++)kit.box(stone,.5,.07+i*.13,2.65-i*.62,7.2,.14+i*.26,.64);
      kit.box(0x603c2d,0,.86,-.59,1.55,.17,.66);
      for(const x of [-.63,.63])for(const z of [-.8,-.38])kit.box(0x603c2d,x,.58,z,.12,.52,.12);
      // Arc-topped stone surround and inset dark plaque. No invented epitaph.
      const frame=new T.Shape();frame.moveTo(-.78,0);frame.lineTo(.78,0);frame.lineTo(.78,1.76);
      frame.quadraticCurveTo(0,2.56,-.78,1.76);frame.closePath();
      kit.box(stone,3,.44,.5,2,.27,1.02);
      kit.profile(frame,stone,3,.57,.35,.23);
      kit.box(0x444642,3,1.48,.596,1.22,1.58,.04);
      kit.sign('NƠI ĐÂY',3,2.08,.62,.97,.16,true);
      const urnX=1.73,urnZ=1.17;
      for(const side of [-1,1])kit.box(bronze,urnX+.22*side,.61,urnZ,.13,.38,.14,0,0,-side*.18);
      kit.tapered(bronze,urnX,.86,urnZ,.22,.45,.33,1,28);
      kit.tapered(bronze,urnX,1.12,urnZ,.45,.36,.19,1,28);
      kit.tapered(bronze,urnX,1.24,urnZ,.39,.46,.08,1,28);
      const ring=new T.TorusGeometry(.18,.045,6,18);
      for(const side of [-1,1])kit.stamp(ring,bronze,urnX+side*.44,1.18,urnZ,.75,1.15,.9);
      ring.dispose();
      finish(T,kit,rock);
    });

  // The atlas pin is the roadside marker. The recreation area is about 136 m
  // NE at OSM n4409288093. Retain the original saved ID and driving arrival.
  register(4387487189,{name:'Suối Nước Moọc',source:park+'du-lich/diem-du-lich-sinh-thai-suoi-nuoc-mooc7',
    lon:106.2367793,lat:17.5561169,approachMeters:undefined,yaw:.18,width:40,depth:49,
    shots:[['Cầu tre qua ghềnh',0,0,4.2,27,.38,.42],['Ghềnh đá giữa dòng',-.5,3.8,3,10,.08,.23]],
    description:'Dưới tán rừng, nhánh nước trong chảy giữa những tảng đá tròn phủ rêu. Cầu ván hẹp với tay vịn tre gấp khúc qua ghềnh. Cảnh mô phỏng một đoạn ở khu du lịch.'},
    (T,kit)=>{
      const rock=batch(T),centre=z=>2*Math.sin(z*.1+.2),width=z=>6.9+1.9*Math.cos(z*.16);
      river(T,kit.group,[-24,24],centre,width,true);
      for(let i=0;i<62;i++){
        const z=(kit.random()-.5)*45,side=i%2?1:-1;
        const x=centre(z)+side*width(z)*(.72+kit.random()*.79);
        const sz=.45+2.05*kit.random();
        boulder(rock,x,0,z,sz*1.46,sz,sz*1.14,i,true);
      }
      for(const [x,z,r] of [[-1.4,5.7,1.6],[3.4,-7.1,1.35],[.7,-2,1],[-1.4,10.6,1.45]])
        boulder(rock,x,0,z,r*1.2,r,r*.85,x,true);
      for(let i=0;i<48;i++){
        const z=-22+kit.random()*44,side=i%2?1:-1;
        const x=centre(z)+side*(width(z)+2+kit.random()*6),h=3.5+kit.random()*6.5;
        if(x>4&&z>3)continue;
        rock.trees.push([x,0,z,h*.87,h,i*2.4]);
      }
      for(let i=0;i<80;i++){
        const z=kit.random()*42-21,side=i%2?1:-1;
        rock.ferns.push([centre(z)+side*(width(z)+kit.random()*2.6),.08,z,.45+.65*kit.random(),i*2.4]);
      }
      walkway(T,kit,[[-11,7],[-2.6,2.3],[2.4,-3.6],[9.6,-4.8]],1.35,1.55,0xa48359);
      finish(T,kit,rock);
    });
})();

export default window.VietnamSights;
