'use strict';
(() => {
  function baKien(T,{palette, box,outline,round,stamp,random,group}) {
    const timber=0x544538,oldWood=0x766653,lime=0x999186;
    const tile=[0x985e48,0x9e664d,0x925e47,0x886047,0xa3694e];
    const width=13.8,halfDepth=3.63,eaves=3.05,rise=2.5;
    const section=[[-halfDepth,0],[-2,.82],[0,rise],[2,.82],[halfDepth,0],
      [halfDepth,-.16],[2,.63],[0,rise-.18],[-2,.63],[-halfDepth,-.16]];
    palette({timber, plaster: lime});
    box(0x986f56,0,.09,4.1,15.4,.18,6.4);
    box(0x74695d,0,.27,0,13.8,.54,6.6);
    for(let step=0;step<2;step++)box(0xa68269,0,.14+step*.1,3.73-step*.25,8.6,.19,.48);
    box(0x766d60,0,1.7,-2.63,13.3,2.8,.31);
    box(0x37332c,0,1.83,-1.2,13.2,2.6,.1);
    for(const s of [-1,1]){
      const x=s*6.59;
      outline([[-3.36,.34],[3.36,.34],[3.36,3.14],[.14,5.58],[-.14,5.58],[-3.36,3.14]],
        lime,x,0,0,.22,Math.PI/2);
      for(let n=0;n<3;n++)box(0xa59c87,x+.11,3.06+n*.12,s*(3.44-n*.09),.46,.19,.26);
      outline([[-.24,0],[.28,0],[.15,.29],[.06,.58],[-.04,.83],[-.18,.55]],0x838077,x+.1,5.41,-.14,.28);
    }
    // Four frames with four ironwood posts each, raised on individual stone footings.
    for(const x of [-6.15,-2.13,2.13,6.15]){
      for(const z of [-2.36,-.91,.91,2.65]){
        const h=3.55-.23*Math.abs(z);
        stamp(round,0x908b78,x,.58,z,.28,.2,.28);
        stamp(round,timber,x,.63+h/2,z,.165,h,.165);
      }
      box(oldWood,x,3.19,0,.18,.24,5.7);
      for(const z of [-2.45,2.45])box(timber,x,3.38,z,.23,.22,.92,0,z>0?.21:-.21);
    }
    box(timber,0,2.64,2.62,width-.69,.23,.2);
    for(const x of [-4.13,0,4.13]){
      for(const side of [-1,1]){
        // Partly open bức bàn leaves behind a low, weathered timber grille.
        const dx=x+side*1.28;
        box(oldWood,dx,1.55,1.12,1.47,1.91,.11,side*.09);
        box(timber,dx,1.36,1.203,1.22,.94,.045);
        for(let j=0;j<6;j++)box(0x99866e,dx-.57+j*.225,2.17,1.22,.059,.53,.065);
      }
      box(oldWood,x,2.58,1.15,3.93,.27,.19);
      for(const dx of [-1.45,0,1.45])box(timber,x+dx,2.62,1.26,.8,.09,.06);
    }
    outline(section,tile[0],-width/2,eaves,0,width,Math.PI/2);
    // Stagger overlapping clay tiles across each pitch; the scalloped tips catch grazing light.
    const skin=[],tones=[],height=z=>eaves+(z<2?rise+(.82-rise)*z/2:.82*(halfDepth-z)/(halfDepth-2));
    for(const side of [-1,1])for(let row=0;row<19;row++){
      const za=row*halfDepth/19,zb=(row+1)*halfDepth/19;
      for(let col=-1;col<53;col++){
        const xa=Math.max(-width/2,-width/2+(col+(row%2)*.5)*width/53);
        const xb=Math.min(width/2,-width/2+(col+1+(row%2)*.5)*width/53);
        if(xb-xa<.04)continue;
        const tint=new T.Color(tile[Math.floor(random()*tile.length)]);
        const corners=[[xa+.006,height(za)+.027,side*za],[xb-.006,height(za)+.027,side*za],
          [xb-.008,height(zb)+.046,side*zb],[(xa+xb)/2,height(zb)+.031,side*(zb+.029)],[xa+.008,height(zb)+.046,side*zb]];
        for(const index of (side>0?[0,2,1,0,3,2,0,4,3]:[0,1,2,0,2,3,0,3,4])){
          skin.push(...corners[index]);tones.push(tint.r,tint.g,tint.b);
        }
      }
    }
    const surface=new T.BufferGeometry();surface.setAttribute('position',new T.Float32BufferAttribute(skin,3));
    surface.setAttribute('color',new T.Float32BufferAttribute(tones,3));surface.computeVertexNormals();
    const roof=new T.Mesh(surface,new T.MeshLambertMaterial({vertexColors:true}));roof.castShadow=roof.receiveShadow=true;group.add(roof);
    box(0x8c7866,0,eaves+rise+.09,0,width+.18,.19,.25);
    const leaves=new T.BufferGeometry(),xyz=[],rgb=[];
    function leafTri(a,b,c,color){
      const tint=new T.Color(color);
      for(const p of [a,b,c,c,b,a]){xyz.push(...p);rgb.push(tint.r,tint.g,tint.b);}
    }
    for(const [x,z,h] of [[-7.65,4.8,3.15],[7.95,1.9,3.5],[6.95,5.6,2.65],[-7.4,-2.8,2.9]]){
      stamp(round,0x9c9868,x,h/2,z,.105,h,.105);
      for(let j=0;j<6;j++){
        const a=j*2.4+random()*.7,dx=Math.sin(a),dz=Math.cos(a),l=1.6+random()*.78;
        let prev=null;
        for(let k=0;k<=6;k++){
          const t=k/6,reach=l*t,w=.31*Math.sin(Math.PI*t),height=h+.85*Math.sin(Math.PI*t)-.45*t;
          const m=[x+dx*reach,height,z+dz*reach];
          const left=[m[0]+dz*w,height-w*.48,m[2]-dx*w],right=[m[0]-dz*w,height-w*.58,m[2]+dx*w];
          if(prev){
            leafTri(prev[0],prev[1],m,0x5d804a);leafTri(m,prev[1],left,0x64874d);
            leafTri(prev[0],m,prev[2],0x476f46);leafTri(m,right,prev[2],0x557c49);
          }
          prev=[m,left,right];
        }
      }
    }
    // stamp accepts a single tint, so retain the separate leaf colours as two-sided geometry in the group.
    leaves.setAttribute('position',new T.Float32BufferAttribute(xyz,3));
    leaves.setAttribute('color',new T.Float32BufferAttribute(rgb,3));leaves.computeVertexNormals();
    return leaves;
  }

  function tranThuong(T,{palette, box,outline,profile,stamp,round,tapered}) {
    const base=0x8a8780,aged=0xaaa69a,plaster=0xbcb7a7,edge=0x797972,roof=0x585952;
    palette({plaster});
    function vaulted(x,z,w,h,r,sy,d){
      const shape=new T.Shape();
      shape.moveTo(-w/2,0);shape.lineTo(-r,0);shape.lineTo(-r,sy);
      shape.absarc(0,sy,r,Math.PI,0,true);shape.lineTo(r,0);shape.lineTo(w/2,0);shape.lineTo(w/2,h);
      shape.lineTo(-w/2,h);shape.closePath();profile(shape,aged,x,0,z-d/2,d);
      for(const side of [-1,1]){
        const f=z+side*(d/2+.025);
        for(const s of [-1,1]){
          box(plaster,x+s*(r+.115),sy/2,f,.19,sy,.10);
          box(edge,x+s*(r+.16),sy-.02,f,.29,.105,.14);
        }
        for(let i=0;i<13;i++){
          const a=i*Math.PI/13,b=(i+1)*Math.PI/13-.012,p=(q,t)=>[q*Math.cos(t),q*Math.sin(t)];
          outline([p(r,a),p(r+.19,a),p(r+.19,b),p(r,b)],i%3===0?base:plaster,x,sy,f-.03,.08);
        }
      }
    }
    function roofTier(x,y,z,w,d,h){
      const p=[], ledge=.19;
      function quad(a,b,c,d){p.push(...a,...b,...d,...b,...c,...d);}
      // A shallow concave hip with swept-up corners and a short, level ridge.
      const ring=(t)=>{const v=[];for(const [ax,az,bx,bz] of [[-1,-1,-1,1],[-1,1,1,1],[1,1,1,-1],[1,-1,-1,-1]]){
        for(let i=0;i<8;i++){const u=i/8,xx=ax+(bx-ax)*u,zz=az+(bz-az)*u;
          const corner=Math.pow(Math.min(Math.abs(xx),Math.abs(zz)),5);
          v.push([x+xx*(w/2*(1-t)+w*.15*t),y+h*t*t+corner*(1-t)*.42,z+zz*d/2*(1-t)]);
        }
      }return v;};
      let outer=ring(0),prev=outer;
      for(const t of [.32,.66,1]){
        const next=ring(t);for(let j=0;j<32;j++){const k=(j+1)%32;quad(prev[j],next[j],next[k],prev[k]);}prev=next;
      }
      // Reversed ring winds upwards on the top surface.
      for(let i=0;i<p.length;i+=9)for(let axis=0;axis<3;axis++)[p[i+3+axis],p[i+6+axis]]=[p[i+6+axis],p[i+3+axis]];
      for(let j=0;j<32;j++){const k=(j+1)%32,a=outer[j],b=outer[k];quad(a,b,[b[0],b[1]-ledge,b[2]],[a[0],a[1]-ledge,a[2]]);}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();stamp(g,roof,0,0,0);g.dispose();
      box(base,x,y+h+.06,z,w*.34,.15,.19);
      for(const s of [-1,1])for(const f of [-1,1]){
        outline([[-.40,0],[0,.06],[.26,.3],[.46,.80],[.5,.33],[.34,-.02],[0,-.23]],aged,x+s*w*.49,y+.46,z+f*(d/2-.1),.14,s===1?0:Math.PI);
      }
    }
    vaulted(0,0,4.57,4.75,1.53,2.37,2.65);
    for(const side of [-1,1]){
      const x=side*5.33;
      vaulted(x,0,3.35,2.75,.94,1.48,1.52);
      roofTier(x,2.86,0,3.83,2.23,.68);
      for(const px of [side*3.03,side*7.68]){
        box(base,px,.27,0,1.10,.53,1.09);box(aged,px,2.26,0,.76,3.5,.78);
        for(const y of [.72,3.65,4.03])box(plaster,px,y,0,.9,.16,.92);
        tapered(base,px,4.42,0,.56,.37,.55,1,4);
        outline([[-.3,0],[-.12,.26],[-.19,.49],[.06,.44],[.18,.67],[.37,.51],[.23,.19],[.32,.04]],aged,px,4.68,-.15,.29,side>0?Math.PI:0);
        box(0x57574e,px,2.17,.411,.26,2.32,.035);
        for(let j=0;j<8;j++)box(0xc5c0ad,px,1.27+j*.25,.44,.11+(j%3)*.022,.08,.02);
      }
      box(aged,side*3.65,1.75,0,1.64,1.23,.45);
    }
    box(plaster,0,4.77,0,4.9,.18,3.08);
    for(const x of [-1.86,1.86])for(const z of [-1.12,1.12])box(base,x,5.22,z,.5,.91,.52);
    box(aged,0,5.45,0,3.24,1.11,1.82);
    for(const f of [-1,1])for(let j=0;j<12;j++){
      const x=-2.11+j*.383;box(plaster,x,5.02,f*1.41,.14,.51,.14,0,0,j%2?.36:-.36);
    }
    roofTier(0,5.65,0,4.8,3.16,.88);
    for(const x of [-1.04,1.04])for(const z of [-.65,.65])box(aged,x,6.96,z,.35,1.22,.34);
    stamp(round,0x756a4c,0,6.86,0,.4,.61,.4);tapered(0x776f52,0,6.56,0,.53,.39,.19,1,14);
    roofTier(0,7.48,0,3.63,2.79,.82);
    for(const s of [-1,1]){
      outline([[-.9,0],[-.63,.19],[-.38,.14],[-.11,.28],[.02,.58],[.11,.42],[.27,.52],[.24,.29],[.39,.16],[.16,.14],[-.08,.05],[-.34,-.03]],plaster,s*.86,8.37,-.10,.20,s>0?Math.PI:0);
    }
    const disk=new T.SphereGeometry(.25,12,8);stamp(disk,0x9e8665,0,8.96,0,1,1,.46);disk.dispose();
  }

  (window.VietnamSights??=[]).push({
    id:'nha-ba-kien',name:'Nhà Bá Kiến',city:'Lý Nhân',province:'Ninh Bình',region:'Bắc Bộ',formerProvince:'Hà Nam',
    lon:106.1572355,lat:20.4799196,start:[106.157234,20.479689],yaw:-.12,width:18,depth:16,
    solids:[[0,-.69,6.85,2.19]],
    description:'Ở làng Đại Hoàng xưa, mái ngói thấp che ba gian nhà gỗ lim. Sau hàng cửa bức bàn là bốn bộ khung với mười sáu cột kê trên chân đá xanh.',
    photo:'https://paivietnam.vn/en/locations/all-locations/nha-ba-kien-2034',
    source:'https://nhandan.vn/tham-nha-ba-kien-post764631.html',
    map:'https://www.google.com/maps?cid=790440860444881714',
    build(T,kit){const geometry=baKien(T,kit);const foliage=new T.Mesh(geometry,new T.MeshLambertMaterial({vertexColors:true}));foliage.castShadow=true;foliage.receiveShadow=true;kit.group.add(foliage);}
  },{
    id:'den-tran-thuong',name:'Nghi môn ngoại đền Trần Thương',city:'Lý Nhân',province:'Ninh Bình',region:'Bắc Bộ',formerProvince:'Hà Nam',
    lon:106.106185,lat:20.57518,start:[106.106298,20.574828],yaw:.20,width:17,depth:4.6,
    solids:[[-7.68,0,.52,.54],[-6.63,0,.37,.76],[-4.01,0,.37,.76],[-3.16,0,.58,.49],[-1.91,0,.38,1.32],[1.91,0,.38,1.32],[3.16,0,.58,.49],[4.01,0,.37,.76],[6.63,0,.37,.76],[7.68,0,.52,.54]],
    description:'Ba cửa vòm mở vào đường chính đạo của đền thờ Trần Hưng Đạo. Nhìn lên cổng giữa sẽ thấy gác chuông, các tầng mái đao và đôi rồng chầu mặt nguyệt.',
    photo:'https://baoxuan.vov.vn/van-hoa/hanh-huong-ve-kho-luong-huyen-thoai-tran-thuong-dau-nam-binh-ngo-post1269859.vov',
    source:'https://dsvh.gov.vn/di-tich-lich-su-va-kien-truc-nghe-thuat-den-tran-thuong-1313',
    map:'https://www.openstreetmap.org/?mlat=20.57518&mlon=106.106185#map=19/20.57518/106.106185',
    build:tranThuong
  });
})();
