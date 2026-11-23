'use strict';
(() => {
  const sites=window.VietnamSights??=[],atlas=window.VietnamTourism.byId;
  function register(catalogId,id,name,yaw,width,depth,source,photo,description,refs,solids,views,build){
    sites.push({...atlas.get(catalogId),catalogId,id,name,yaw,width,depth,source,photo,description,
      visitOnArrival:true,modeledBuildings:refs,solids,
      views:views.map(([name,offset,height,viewRadius,viewAngle,viewElevation])=>({name,offset,height,viewRadius,viewAngle,viewElevation})),build});
  }
  // The square screens outside the upper galleries use a repeating interlocking
  // pattern. A single mipmapped texture keeps the fine lattice legible at distance.
  function screenMaterial(T){
    const size=96,data=new Uint8Array(size*size*4);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const line=(u,v,span)=>Math.abs(Math.max(Math.abs(u),Math.abs(v))-span)<1.9;
      const u=x%48-24,v=y%48-24;
      const lit=line(u,v,17)||line((x+24)%48-24,(y+24)%48-24,11)||Math.abs(u)<1.7||Math.abs(v)<1.7;
      const i=(y*size+x)*4;
      data[i]=lit?169:92;data[i+1]=lit?173:109;data[i+2]=lit?170:116;data[i+3]=255;
    }
    const texture=new T.DataTexture(data,size,size,T.RGBAFormat);
    texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.magFilter=T.LinearFilter;
    texture.generateMipmaps=true;texture.minFilter=T.LinearMipmapLinearFilter;
    texture.colorSpace=T.SRGBColorSpace;texture.needsUpdate=true;
    return new T.MeshStandardMaterial({map:texture,metalness:.23,roughness:.62});
  }
  function cityMuseum(T,k){
    const f=createTempleFoundations(T,k),metal=0x626970,stone=0xc5c7c1,glass=0x65818a;
    // The three mapped annular building parts encode the projecting floors.
    // The architect's elevation places the glazing behind each floor edge.
    f.building(0,0,0,45,45,()=>{
      const facePositions=[],uv=[];
      for(const [i,w] of [44,60,77,93].entries()){
        const base=i*7.5,h=6.9;
        k.box(stone,0,base+.17,0,w+.8,.36,w+.8);
        k.box(i?metal:glass,0,base+3.64,0,w-.28,h,w-.28);
        k.box(stone,0,base+7.18,0,w+1.1,.45,w+1.1);
        for(let side=0;side<4;side++){
          const a=side*Math.PI/2,s=Math.sin(a),c=Math.cos(a);
          const bays=i?Math.round(w/8):Math.round(w/4.4),pitch=w/bays;
          k.place(0,0,a,()=>{
            for(let n=0;n<=bays;n++)k.box(metal,-w/2+n*pitch,base+3.77,w/2,.21,6.6,.47);
            if(!i){
              k.box(stone,0,base+4.7,w/2+.12,w,.14,.18);
              k.box(glass,0,2.0,w/2+.18,5.7,3.6,.19);
              k.box(metal,0,1.98,w/2+.30,.14,3.72,.08);
            }
          });
          if(!i)continue;
          const extent=w/2-.22,z=w/2-.01,y0=base+.55,y1=base+6.94;
          for(const [u,y] of [[-extent,y0],[extent,y0],[extent,y1],[-extent,y0],[extent,y1],[-extent,y1]]){
            facePositions.push(c*u+s*z,y,-s*u+c*z);uv.push(u/.65,y/.65);
          }
        }
      }
      const mesh=new T.BufferGeometry();mesh.setAttribute('position',new T.Float32BufferAttribute(facePositions,3));
      mesh.setAttribute('uv',new T.Float32BufferAttribute(uv,2));mesh.computeVertexNormals();
      const screen=new T.Mesh(mesh,screenMaterial(T));screen.receiveShadow=true;k.group.add(screen);
      k.box(stone,0,30,0,105,.40,105);
      for(let side=0;side<4;side++)k.place(0,0,side*Math.PI/2,()=>{
        k.box(metal,0,30.36,51.6,105,.20,1.2);
        for(let n=-6;n<=6;n++)k.box(stone,n*7.5,29.76,49.7,.17,.27,5.3);
        k.outline([[-9,0],[9,0],[9,1.5]],glass,-13,30.21,1,17);
      });
    });
  }
  function womensMuseum(T,k){
    const f=createTempleFoundations(T,k),ivory=0xe5e6dc,stone=0xc6c8bd,frame=0x777e7a,glass=0x556675;
    // Way 704147278 is the whole parcel. Its L-shaped main building is 704147279.
    const entrance=f.building(2.4,-23.6,0,31.4,21.8,()=>{
      k.box(ivory,0,12.02,0,31.4,23.82,21.8);
      for(const x of [-13.2,13.2]){
        k.box(stone,x,13.1,11.0,3.30,19.3,.22);
        k.box(glass,x,13.4,11.14,2.33,17.7,.10);
        k.box(frame,x,13.4,11.22,.10,17.7,.09);
        for(let h=5.3;h<22;h+=1.8)k.box(frame,x,h,11.24,2.38,.075,.08);
      }
      for(const [row,y] of [8.8,13.8,18.1].entries()){
        const colors=[0xb56480,0x98748a,0xb15a79,0x688393,0x8b8b77,0x678c81];
        for(let n=0;n<6;n++){
          const x=(n-2.5)*2.85;
          k.box(stone,x,y,10.97,1.69,2.85,.19);
          k.box(row===2?glass:colors[(n+row*2)%colors.length],x,y,11.10,1.13,2.44,.10);
        }
      }
      k.box(ivory,0,22.74,11.44,20,.56,1.6);
      k.box(glass,0,21.25,10.99,18.7,2.14,.18);
      for(let i=-3;i<=3;i++)k.box(frame,i*2.66,21.25,11.13,.13,2.14,.12);
      k.box(0x604654,0,2.55,11.13,13.20,4.50,.26);
      for(const x of [-6,-3,0,3,6])k.box(frame,x,2.41,11.33,.15,3.86,.14);
      k.box(ivory,0,5.84,13.07,23.2,1.04,5.30);
      k.sign('BẢO TÀNG PHỤ NỮ VIỆT NAM',0,5.83,15.74,14.90,.79,true,'#3f4548');
      for(const x of [-10.72,10.72])k.stamp(k.round,stone,x,2.67,14.78,.93,5.33,.93);
      k.box(stone,0,.65,12.26,18.4,1.30,2.81);
    });
    f.stairs(entrance,2.4,-9.97,2.4,-6.63,18.4,1.3,7);
    f.building(-12.0,-6.2,0,8.5,47.5,()=>{
      k.box(ivory,0,9.1,0,8.5,18.2,47.5);
      for(const y of [3.4,7.5,11.6,15.7])for(let n=0;n<9;n++){
        const z=(n-4)*5;
        k.box(glass,4.29,y,z,.14,2.03,2.7);k.box(frame,4.39,y,z,.08,2.04,.085);
        k.box(frame,4.39,y+.47,z,.08,.075,2.7);
      }
      k.box(stone,0,18.25,0,8.82,.28,47.9);
    });
  }
  function fineArts(T,k){
    const f=createTempleFoundations(T,k),cream=0xf3ddbb,rose=0xc28d72,frame=0x85513d,timber=0x563e33,tile=0x9b533b;
    k.palette({tile,plaster:[cream,rose],timber:frame});
    function windows(w,count,front){
      for(let i=0;i<count;i++){
        const x=w*((i+.5)/count-.5),bay=w/count;
        for(const [level,y] of [2.37,6.84,11.34].entries()){
          k.box(cream,x,y,front,bay*.62,2.97,.20);
          const a=bay*.27;
          k.outline([[-a,0],[a,0],[a,2.31],[a-.24,2.70],[-a+.24,2.70],[-a,2.31]],frame,x,y-1.35,front+.10,.16);
          k.outline([[-a+.13,0],[a-.13,0],[a-.13,2.18],[a-.34,2.46],[-a+.34,2.46],[-a+.13,2.18]],timber,x,y-1.22,front+.27,.08);
          k.box(frame,x,y,front+.35,.09,2.53,.07);
          k.box(frame,x,y+.58,front+.35,bay*.47,.10,.07);
          if(level){
            k.box(cream,x-bay*.48,y,front+.16,.20,4.40,.36);
            k.box(cream,x,y-1.48,front+.24,bay*.68,.16,.42);
            for(const u of [-.15,.15])k.box(rose,x+bay*u,y-1.76,front+.12,bay*.25,.22,.19);
          }
        }
      }
    }
    function hall(w,d,count){
      k.box(rose,0,2.26,0,w,4.52,d);
      k.box(cream,0,9.16,0,w,9.28,d);
      for(const y of [4.52,8.83,13.84])k.box(cream,0,y,0,w+.54,.24,d+.48);
      k.outline([[-d/2-.6,0],[0,3.08],[d/2+.6,0]],tile,-w/2-.48,13.90,0,w+.96,Math.PI/2);
      windows(w,count,d/2+.025);
    }
    // The main block faces the garden on Nguyễn Thái Học. The semicircular
    // portico and the short return at the east end project beyond its south wall.
    const portico=f.building(.48,-20.25,0,52.8,21,()=>{
      hall(52.8,21,15);
      for(const x of [-4.92,4.92])k.box(cream,x,9.4,10.91,.52,10.23,.70);
      k.place(.07,10.64,0,()=>{
        k.box(timber,0,2.13,.15,5.60,4.24,.25);
        const width=4.27;
        for(let i=0;i<7;i++){
          const a=-Math.PI/2+i*Math.PI/6;
          k.stamp(k.round,rose,Math.sin(a)*width,2.12,Math.cos(a)*width,.57,4.24,.57);
          k.stamp(k.round,cream,Math.sin(a)*width,4.04,Math.cos(a)*width,.77,.27,.77);
        }
        for(const [y,h,r,col] of [[.16,.32,4.69,rose],[4.38,.31,4.73,cream],[4.68,.32,4.76,tile],[5.05,.45,4.25,cream]]){
          const drum=new T.CylinderGeometry(r,r,h,24,1,false,-Math.PI/2,Math.PI);
          k.stamp(drum,col,0,y,0);drum.dispose();
        }
        k.box(cream,0,14.28,.3,10.24,2.18,2.05);
        k.outline([[-5.18,0],[0,3.64],[5.18,0]],cream,0,14.85,-1.25,1.0);
        k.outline([[-5.50,0],[0,3.86],[5.50,0],[5.10,0],[0,3.47],[-5.10,0]],tile,0,14.85,-.19,.23);
        CentralArch.curvedRoof(T,k,0,14.70,.80,11.84,3.65,1.05,tile,tile,frame,.28,{});
      });
    });
    f.stairs(portico,.55,-4.98,.55,-1.98,6.85,.30,5);
    f.building(-31,15.0,0,13.9,36.6,()=>{
      k.place(0,0,Math.PI/2,()=>hall(36.6,13.9,9));
    });
  }
  const city='https://www.gmp.de/en/projects/526/hanoi-museum';
  const women='https://myhanoi.vn/vi/baotangphunuviet',arts='https://vnfam.vn/en/about';
  register('osm-way-208255133','bao-tang-ha-noi','Bảo tàng Hà Nội',-.923,105,105,city,'https://www.wernersobek.com/projects/museum-of-hanoi/',
    'Bốn tầng nhà vuông mở rộng dần lên phía mái. Sau mép sàn là các tấm chắn nắng đan ô vuông trước lớp kính.',
    ['w208255133','w1328336057','r18211851','r18211852','r18211853'],[[0,0,22.5,22.5]],
    [['Kim tự tháp ngược',[0,0],27,135,-.92,.10],['Lớp chắn nắng dưới mái',[-27,23],41,63,-.63,.05],['Bốn ô lấy sáng trên mái',[0,0],52,128,-.40,.73]],cityMuseum);
  register('osm-way-704147278','bao-tang-phu-nu-viet-nam','Bảo tàng Phụ nữ Việt Nam',-.289,40,55,women,women,
    'Từ sân phố Lý Thường Kiệt, bậc thang dẫn qua mái sảnh vào tòa nhà trắng. Hai dải kính cao ôm lấy các ô cửa màu ở giữa mặt đứng.',
    ['w704147279'],[[2.4,-23.6,15.7,10.9],[-12,-6.2,4.25,23.75]],
    [['Mặt đứng từ sân bảo tàng',[6,-18],24,48,-.22,.09],['Bậc thềm và mái sảnh',[5,-8],7.40,25,-.04,.10]],womensMuseum);
  register('osm-relation-21425134','bao-tang-my-thuat-viet-nam','Bảo tàng Mỹ thuật Việt Nam',-.218,68,65,arts,'https://vnfam.vn/introduce-og-image.png',
    'Từ sân vườn ở số 66 Nguyễn Thái Học nhìn vào, một sảnh bán nguyệt nhô khỏi dãy nhà ba tầng. Mái ngói giữa mặt tiền có hai đầu vút lên.',
    ['w1230610835','w1230610836'],[[.48,-20.25,26.4,10.5],[-31,15,6.95,18.3]],
    [['Sảnh cong nhìn từ vườn',[4,-13],16.4,62,-.21,.12],['Hàng cột và mái ngói giữa nhà',[4,-10],17.5,31,.15,.14]],fineArts);
})();
