'use strict';
(() => {
  function buildWaterPavilion(T,{palette, stamp,box,deck,outline}) {
    const timber=0x513522, beam=0x6c4c33, trim=0x896d50, stone=0xaca99e;
    const tile=[0x605e58,0x68675f,0x64615b,0x5f5c57,0x68645e];
    const post=new T.CylinderGeometry(1,1,1,8);
    const point=(x,y,z)=>new T.Vector3(x,y,z);
    palette({timber, stone});

    function column(x,z,y,h,r){
      box(0xaaa69a,x,y+.2,z,r*2.65,.4,r*2.65);
      stamp(post,timber,x,y+h/2,z,r,h,r);
      box(beam,x,y+h-.33,z,r*3.8,.55,r*3.3);
    }
    function balustrade(x,z,length,rotate=false){
      const segments=Math.ceil(length/3.45),step=length/segments;
      const piece=(color,u,y,w,h,d)=>box(color,x+(rotate?0:u),y,z+(rotate?u:0),rotate?d:w,h,rotate?w:d);
      piece(stone,0,2.37,length,.29,.35);
      piece(0xc5c1b3,0,3.24,length,.18,.36);
      for(let i=0;i<=segments;i++){
        const u=i*step-length/2;
        piece(0xb5b1a3,u,2.74,.42,1.63,.42);
        piece(0xc8c3b5,u,3.59,.50,.16,.50);
        if(i<segments)piece(0x99988e,u+step/2,2.76,step-.48,.49,.21);
      }
    }
    function gallery(width,depth,z,y,h,bays){
      const inner=width-6.4;
      box(0x382e27,0,y+h*.50,z,inner,h,depth-5.4);
      box(beam,0,y+h-.43,z,width+.4,.64,depth+.45);
      for(const side of [-1,1]){
        const edge=z+side*depth/2;
        box(trim,0,y+.23,edge,width,.26,.37);
        for(let i=0;i<=bays;i++){
          const x=-width/2+i*width/bays;
          column(x,edge,y,h,.43);
          if(i===bays)continue;
          const mid=x+width/(bays*2),bay=width/bays;
          box(0x98734c,mid,y+h*.55,z+side*(depth/2-2.67),bay*.80,h*.63,.12);
          for(let j=0;j<4;j++)box(0x42362b,mid+(j-1.5)*bay*.18,y+h*.55,z+side*(depth/2-2.56),bay*.137,h*.55,.14);
          if(y>4){
            box(beam,mid,y+1.15,edge,bay,.17,.18);
            for(let j=1;j<6;j++)box(trim,x+j*bay/6,y+.73,edge,.09,.8,.10);
          }
        }
      }
      for(const side of [-1,1])for(let i=1;i<4;i++)column(side*width/2,z-depth/2+depth*i/4,y,h,.43);
    }
    // Sweep each hip from the ridge down a concave slope. The four corner
    // rafters turn up above the eave, while the central eave stays level.
    function roof(width,depth,z,y,rise,ridge){
      const faces=tile.map(()=>[]),soffit=[],thickness=.44,hw=width/2,hd=depth/2;
      const corners=[[-1,-1],[-1,1],[1,1],[1,-1]];
      const sample=(side,u,v)=>{
        const a=corners[side],b=corners[(side+1)%4];
        const x=a[0]+(b[0]-a[0])*u,d=a[1]+(b[1]-a[1])*u;
        const corner=Math.pow(Math.abs(x*d),6);
        return point(x*(ridge+(hw-ridge)*v),y+rise*(1-Math.pow(v,.65))+
          corner*Math.pow(v,3)*Math.min(2.8,rise*.46),z+d*hd*v);
      };
      function tri(bucket,a,b,c){for(const p of [a,b,c])bucket.push(p.x,p.y,p.z);}
      for(let side=0;side<4;side++){
        const divisions=side%2?69:29,rows=7;
        for(let i=0;i<divisions;i++)for(let j=0;j<rows;j++){
          const a=sample(side,i/divisions,j/rows),b=sample(side,(i+1)/divisions,j/rows);
          const c=sample(side,(i+1)/divisions,(j+1)/rows),d=sample(side,i/divisions,(j+1)/rows);
          const bucket=faces[(i*3+Math.floor(i/5)+Math.floor(j/3))%faces.length];
          tri(bucket,a,d,b);tri(bucket,b,d,c);
          for(const p of [a,b,d,b,c,d])soffit.push(p.x,p.y-thickness,p.z);
          if(j===rows-1){
            const e=d.clone(),f=c.clone();e.y-=thickness;f.y-=thickness;
            tri(faces[0],d,e,c);tri(faces[0],c,e,f);
          }
        }
        const horn=corners[side],tip=sample(side,0,1);
        const shape=[[0,-.2],[1.1,0],[1.92,.72],[2.45,1.85],[2.28,2.1],[1.68,1.33],[1.7,1.93],[1.24,1.76],[1.02,.86],[.43,.58],[-.16,.47]];
        outline(shape,0x756d5d,tip.x,tip.y,tip.z,.24,Math.atan2(-horn[1],horn[0]));
      }
      box(0x878174,0,y+rise+.16,z,ridge*2+.45,.43,.53);
      for(const [pos,color] of [...faces.map((v,i)=>[v,tile[i]]),[soffit,timber]]){
        const geom=new T.BufferGeometry();
        geom.setAttribute('position',new T.Float32BufferAttribute(pos,3));geom.computeVertexNormals();
        stamp(geom,color,0,0,0);geom.dispose();
      }
    }

    // OSM places the long building NW–SE, with twin footbridges to the NE bank.
    box(0x7f7e76,0,.05,0,88,3.6,50);
    deck(stone,0,1.9,0,89,.34,51);
    box(0x96958a,0,.30,29,60,3.30,16);
    deck(stone,0,1.9,29,61,.34,17);
    for(const x of [-15.5,24.5]){
      deck(0x8a8b81,x,1.15,-66.5,5.4,1.24,82);
      for(const side of [-1,1])balustrade(x+side*2.47,-66.5,82,true);
      for(let z=-32;z>=-104;z-=13)box(0x85867a,x,-.85,z,3.55,3.15,1.2);
    }
    for(const [x,length] of [[-31.35,26.3],[4.5,34.3],[35.9,17]])balustrade(x,-25.4,length);
    for(const side of [-1,1]){
      balustrade(side*44.2,0,50.5,true);
      balustrade(side*37.3,25.1,13.9);
      balustrade(side*30.1,31.1,12.4,true);
    }
    balustrade(0,37.3,60.6);
    gallery(73,36,0,2.08,6.45,12);
    roof(84,48,0,8.2,6.8,26);
    gallery(61,26.5,0,12.25,4.62,10);
    roof(73.6,37.8,0,16.45,5.1,23.6);
    gallery(54,20,0,19.35,4.75,10);
    roof(65,29.9,0,23.85,7.1,21);
    // Projecting one-storey porch between the open stairs and the main gallery.
    gallery(41,7,23,2.08,5.8,8);
    roof(48,15.1,23.2,7.65,4.9,17.6);
    for(let n=0;n<4;n++)box(n%2?0xaba79a:0xb9b4a7,0,2.03+n*.12,30.7-n*.64,40,.18,1.2);
    post.dispose();
  }

  (window.VietnamSights??=[]).push({
    id:'thuy-dinh-tam-chuc', name:'Nhà khách Thủy Đình – Tam Chúc', city:'Kim Bảng',
    complex:'tam-chuc',tourOrder:0,formerProvince:'Hà Nam',province:'Ninh Bình',region:'Bắc Bộ',
    lon:105.812833,lat:20.569363,start:[105.813556,20.570100],yaw:-.733,viewAngle:-.24,
    gardenRadius:370,width:89,depth:74,solids:[[0,0,44.5,25.5],[0,29,30.5,8.5],[-15.5,-66.5,2.7,41],[24.5,-66.5,2.7,41]],
    description:'Từ ĐH.05 nhìn qua hồ Tam Chúc, hai cầu đi bộ dẫn tới tòa Thủy Đình. Dưới ba tầng mái cong là Trung tâm Hội nghị quốc tế, nơi khai mạc Đại lễ Vesak năm 2019.',
    photo:'https://catbaexpress.com/khu-du-lich-chua-tam-chuc-ha-nam.html',
    source:'https://nhandan.vn/ha-nam-san-sang-cac-dieu-kien-cung-ruoc-ton-tri-xa-loi-duc-phat-post879333.html',
    map:'https://www.openstreetmap.org/way/1346643096',build:buildWaterPavilion
  });
})();
