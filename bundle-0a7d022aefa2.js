'use strict';
// tunnel-mesh.js
'use strict';
(() => {
  const finishes=new WeakMap();
  const motorRoad=edge=>/^(motorway|trunk|primary)(?:_link)?$/.test(edge.kind);
  const tunnel=edge=>Boolean(edge.traffic?.tunnel);

  window.tunnelSection=function(edge,graph){
    const w=worldRoadHalfWidth(edge),name=edge.name||'',info=graph.tunnels?.info(edge);
    const immersed=/sông sài gòn|thủ thiêm/i.test(name),haiVan=/hải vân/i.test(name);
    // Short urban and rural road underpasses generally have a box section. Use
    // connected mapped bores to avoid changing profile at an internal way split.
    const namedMountain=/hải vân|đèo |cù mông|cổ mã|núi |thần vũ|thung thi|phước tượng|phú gia|bình đê/i.test(name);
    const long=edge.length>150||[edge.start,edge.end].some(node=>
      (graph.nodes.get(node)||[]).some(next=>next!==edge&&tunnel(next)&&next.length>150));
    const box=Boolean(info?.passage)||immersed||/chui|chìm|gầm/i.test(name)||!(namedMountain||long&&motorRoad(edge));
    const wall=info?.clearance>0?info.clearance:immersed?4.5:motorRoad(edge)?4.95:3.95;
    // Sài Gòn traffic operator: double-box immersed section, 4.5 m clearance.
    // Đà Nẵng city, Hải Vân I project: its arched main bore is 7.5 m high.
    const crown=box?wall+.27:haiVan?Math.max(wall+.5,7.5):wall+Math.min(2.85,1.1+w*.19);
    const innerHalfWidth=w+(w<3.1?.35:motorRoad(edge)?.85:.62);
    return {roadHalfWidth:w,innerHalfWidth,crown,wall,spring:box?wall:wall-.45,box};
  };
  window.buildTunnelMeshes=function(T,{graph,edges,cx,cz,radius,group,height,ground,material,registerObstacle}){
    const ways=edges.filter(e=>graph.tunnels.info(e));
    if(!ways.length)return;
    if(!finishes.has(material)){
      // Tunnels stay legible at night. The vertex tones bake the variation
      // between lamps without a point light and shadow pass for every fixture.
      const lining=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide,emissive:0x35342f,emissiveIntensity:.43});
      finishes.set(material,{lining,exterior:lining.clone(),light:new T.MeshBasicMaterial({vertexColors:true,side:T.DoubleSide,toneMapped:false})});
    }
    const materials=finishes.get(material),batches=new Map(),color=new T.Color();
    const portals=new Set(),partitions=new Map(),sections=new Map();
    const mix=(a,b,f)=>a+(b-a)*f;
    const section=e=>{
      if(!sections.has(e))sections.set(e,tunnelSection(e,graph));
      return sections.get(e);
    };
    function put(mat,shade,a,b,c,d,w=0){
      let batch=batches.get(mat);
      if(!batch){batch={pos:[],uv:[],road:[],col:[],painted:!w};batches.set(mat,batch);}
      if(!w)color.setHex(shade);
      for(const p of [a,b,d,b,c,d]){
        const x=p.x-cx,z=p.z-cz;batch.pos.push(x,p.y,z);
        if(w){
          if(mat===material.roadSlabs||mat===material.roadWood)batch.uv.push(p.s,p.o);
          else batch.uv.push(x*.25+(cx*.25)%1,z*.25+(cz*.25)%1);
          batch.road.push(p.o,w);
        }
        else{
          const wash=mat===materials.lining&&p.lit ? .88+.12*Math.cos((p.s-5)*Math.PI/7) : 1;
          batch.col.push(color.r*wash,color.g*wash,color.b*wash);
        }
      }
    }
    const face=(a,b,c,d,shade)=>put(materials.lining,shade,a,b,c,d);
    const exteriorFace=(a,b,c,d,shade)=>put(materials.exterior,shade,a,b,c,d);
    const light=(a,b,c,d,shade)=>put(materials.light,shade,a,b,c,d);
    const point=(r,o,h=0)=>({x:r.x+r.nx*o,y:r.y+h,z:r.z+r.nz*o,o,s:r.s,lit:r.lit});
    function band(draw,a,b,offset1,y1,offset2,y2,tint){
      draw(point(a,offset1,y1),point(b,offset1,y1),point(b,offset2,y2),point(a,offset2,y2),tint);
    }
    const openings=node=>(graph.nodes.get(node)||[]).filter(tunnel);
    const clearance=26,tile=64,key=(i,j)=>i+','+j;
    // Neighbouring portals can be separate bores, or parallel mapped vehicle
    // and motorbike ways in a single chamber (for example, Hầm Sông Sài Gòn).
    for(const e of ways)if(tunnel(e)&&e.oneway&&section(e).box){
      for(let i=1;i<e.points.length;i++){
        const a=e.points[i-1],b=e.points[i],l=e.dist[i]-e.dist[i-1];
        const x0=Math.max(cx-radius-clearance,Math.min(a.x,b.x)-clearance),x1=Math.min(cx+radius+clearance,Math.max(a.x,b.x)+clearance);
        const z0=Math.max(cz-radius-clearance,Math.min(a.z,b.z)-clearance),z1=Math.min(cz+radius+clearance,Math.max(a.z,b.z)+clearance);
        const segment={e,a,fx:(b.x-a.x)/l,fz:(b.z-a.z)/l,l,s:e.dist[i-1]};
        for(let x=Math.floor(x0/tile);x<=Math.floor(x1/tile);x++)for(let z=Math.floor(z0/tile);z<=Math.floor(z1/tile);z++){
          const k=key(x,z);if(!partitions.has(k))partitions.set(k,[]);partitions.get(k).push(segment);
        }
      }
    }
    function lanesAt(e,r,q){
      const sides=[{w:q.innerHalfWidth,shared:false},{w:q.innerHalfWidth,shared:false}];
      if(!e.oneway||!q.box)return sides;
      for(const n of partitions.get(key(Math.floor(r.x/tile),Math.floor(r.z/tile)))||[]){
        if(n.e===e||Math.abs(r.tx*n.fx+r.tz*n.fz)<.96)continue;
        const dx=r.x-n.a.x,dz=r.z-n.a.z,d=dx*n.fx+dz*n.fz;
        if(d<-.5||d>n.l+.5)continue;
        const cross=(n.a.x+d*n.fx-r.x)*(-r.tz)+(n.a.z+d*n.fz-r.z)*r.tx;
        const w=section(n.e).roadHalfWidth,gap=Math.abs(cross),combined=q.roadHalfWidth+w;
        if(gap<1.4||gap>combined+2.3||Math.abs(height(n.e,n.s+Math.max(0,Math.min(n.l,d)))-r.y)>1.4)continue;
        const side=sides[cross>0?1:0],boundary=gap*q.roadHalfWidth/combined;
        if(side.matched&&boundary>=side.w)continue;
        side.shared=r.tx*n.fx+r.tz*n.fz>0;side.matched=true;
        side.w=side.shared?boundary:Math.min(side.w,boundary-.08);
      }
      return sides;
    }
    function edgeNormal(e,i){
      const a=e.points[i],b=e.points[i+1],d=e.dist[i+1]-e.dist[i];
      return [(a.z-b.z)/d,(b.x-a.x)/d];
    }
    function miter(a,b){
      const f=1/Math.max(.6,1+a[0]*b[0]+a[1]*b[1]);return [(a[0]+b[0])*f,(a[1]+b[1])*f];
    }
    function join(e,i){
      const last=e.points.length-1;
      if(i>0&&i<last)return miter(edgeNormal(e,i-1),edgeNormal(e,i));
      const first=i===0,node=first?e.start:e.end,normal=edgeNormal(e,first?0:last-1);
      const links=openings(node);
      if(links.length!==2)return normal;
      const other=links.find(o=>o!==e);
      if(!other)return normal;
      const nextStarts=other.start===node,next=edgeNormal(other,nextStarts?0:other.points.length-2);
      return miter(normal,first===nextStarts?[-next[0],-next[1]]:next);
    }
    function boundary(q,side,sign){
      const w=side.w*sign;
      if(q.box)return [[w,0],[w,q.spring],[w*(side.shared?1:.974),q.crown],[w*.64,q.crown],[w*.32,q.crown],[0,q.crown]];
      return [[w,0],[w,q.spring],[w*.925,mix(q.spring,q.crown,.42)],[w*.70,mix(q.spring,q.crown,.76)],
        [w*.38,mix(q.spring,q.crown,.94)],[0,q.crown]];
    }
    function obstacle(a,b,oa,ob,id,h){
      if(!registerObstacle)return;
      const p=point(a,oa),q=point(b,ob),dx=q.x-p.x,dz=q.z-p.z,l=Math.hypot(dx,dz);
      if(l<.02||h<.25)return;
      const baseY=Math.min(p.y,q.y);
      registerObstacle({id,kind:'barrier',x:(p.x+q.x)/2-cx,z:(p.z+q.z)/2-cz,fx:dx/l,fz:dz/l,w:l/2,d:.10,
        baseY,height:h+Math.abs(p.y-q.y),parts:[]});
    }
    const move=(r,d)=>({...r,x:r.x+r.tx*d,z:r.z+r.tz*d});
    function portal(e,r,q,dir){
      const node=dir===1?e.start:e.end;
      const trueEnd=graph.tunnels.portal?graph.tunnels.portal(node):
        openings(node).length===1&&(graph.nodes.get(node)||[]).some(next=>!tunnel(next));
      if(portals.has(node)||!trueEnd||graph.tunnels.info(e).passage)return;
      portals.add(node);
      const out=move(r,-dir*.46),inner=move(r,dir*.84);
      for(const [i,sign] of [[0,-1],[1,1]]){
        const shape=boundary(q,r.sides[i],sign),shared=r.sides[i].shared;
        for(let k=shared?2:0;k<shape.length-1;k++){
          const [o,h]=shape[k],[oo,hh]=shape[k+1];
          const exterior=(offset,y)=>point(out,offset+(shared?0:sign*.52*Math.abs(offset)/r.sides[i].w),y+(y/q.crown)*.54);
          exteriorFace(point(out,o,h),point(out,oo,hh),exterior(oo,hh),exterior(o,h),0xc3c1b5);
          exteriorFace(exterior(o,h),exterior(oo,hh),point(inner,oo+(shared?0:sign*.52*Math.abs(oo)/r.sides[i].w),hh+(hh/q.crown)*.54),
            point(inner,o+(shared?0:sign*.52*Math.abs(o)/r.sides[i].w),h+(h/q.crown)*.54),0xa3a49a);
          exteriorFace(point(out,o,h),point(out,oo,hh),point(inner,oo,hh),point(inner,o,h),0x9b9d93);
        }
        if(shared)continue;
        const x=r.sides[i].w*sign;
        for(let j=0;j<6;j++){
          const h=.22+j*.22,faceRow=move(out,-dir*.016);
          exteriorFace(point(faceRow,x,h),point(faceRow,x+sign*.43,h+.16),point(faceRow,x+sign*.43,h+.36),
            point(faceRow,x,h+.20),j%2?0x494b44:0xe0bd61);
        }
      }
    }
    for(const edge of ways){
      const info=graph.tunnels.info(edge),bore=info.bore,q=section(edge);
      const half=q.roadHalfWidth,joins=edge.points.map((_,i)=>join(edge,i));
      const floorMaterial=material[roadSurfaceClass(edge)]||material.asphalt,layout=roadLaneLayout(edge,half);
      for(let i=1;i<edge.points.length;i++){
        const p=edge.points[i-1],b=edge.points[i],len=edge.dist[i]-edge.dist[i-1],base=edge.dist[i-1];
        const tx=(b.x-p.x)/len,tz=(b.z-p.z)/len,d=(cx-p.x)*tx+(cz-p.z)*tz;
        const lateral=Math.abs((cx-p.x)*tz-(cz-p.z)*tx),reach=radius+q.innerHalfWidth+2;
        if(lateral>=reach)continue;
        const extent=Math.sqrt(reach*reach-lateral*lateral);
        const clipStart=base+Math.max(0,d-extent),clipEnd=base+Math.min(len,d+extent);
        const rows=new Map();
        function row(s){
          if(rows.has(s))return rows.get(s);
          const f=(s-base)/len;
          const r={s,x:mix(p.x,b.x,f),z:mix(p.z,b.z,f),y:height(edge,s),tx,tz,lit:bore&&(motorRoad(edge)||edge.length>40),
            nx:mix(joins[i-1][0],joins[i][0],f),nz:mix(joins[i-1][1],joins[i][1],f)};
          r.sides=lanesAt(edge,r,q);rows.set(s,r);return r;
        }
        for(const [start,end] of info.ranges){
          const lo=Math.max(start,clipStart),hi=Math.min(end,clipEnd);
          if(hi-lo<.01)continue;
          const stations=[lo,hi];
          for(let s=Math.ceil((lo+.0001)/8)*8;s<hi-.0001;s+=8)stations.push(s);
          stations.sort((a,b)=>a-b);
          let a=row(lo);
          if(bore&&lo<.001)portal(edge,a,q,1);
          for(const s of stations.slice(1)){
            const c=row(s);
            put(floorMaterial,0,point(a,-a.sides[0].w,.004),point(a,a.sides[1].w,.004),
              point(c,c.sides[1].w,.004),point(c,-c.sides[0].w,.004),half);
            for(const [idx,sign] of [[0,-1],[1,1]]){
              const side=a.sides[idx],next=c.sides[idx],oa=side.w*sign,ob=next.w*sign;
              const branch=[edge.start,edge.end].some((n,j)=>openings(n).length>2&&(j?edge.length-a.s:s)<q.innerHalfWidth*1.75);
              const open=side.shared&&next.shared||branch;
              if(!bore){
                const pa=point(a,oa),pc=point(c,ob);
                const hA=Math.max(0,ground(pa.x,pa.z)-a.y+.08),hC=Math.max(0,ground(pc.x,pc.z)-c.y+.08);
                if(!open&&Math.max(hA,hC)>.15){
                  exteriorFace(pa,pc,point(c,ob,hC),point(a,oa,hA),0xafb0a2);
                  obstacle(a,c,oa,ob,'trench:'+edge.id+':'+idx+':'+s,Math.min(hA,hC));
                }
                continue;
              }
              const shape=boundary(q,side,sign),shapeNext=boundary(q,next,sign);
              for(let k=open?2:0;k<shape.length-1;k++){
                const [o,h]=shape[k],[oo,hh]=shape[k+1],[u,v]=shapeNext[k],[uu,vv]=shapeNext[k+1];
                face(point(a,o,h),point(c,u,v),point(c,uu,vv),point(a,oo,hh),k===0?0x9a9f95:k===1?0x838c87:0x757d78);
              }
              if(open)continue;
              const nearA=oa-sign*.018,nearC=ob-sign*.018;
              face(point(a,nearA,.23),point(c,nearC,.23),point(c,nearC,1.35),point(a,nearA,1.35),0xc7c6b6);
              face(point(a,nearA-sign*.008,1.19),point(c,nearC-sign*.008,1.19),point(c,nearC-sign*.008,1.29),
                point(a,nearA-sign*.008,1.29),0x96a19b);
              obstacle(a,c,oa,ob,'tunnel:'+edge.id+':'+idx+':'+s,q.spring);
            }
            const paint=(from,to,l,r,col)=>{
              const x=row(from),z=row(to),left=Math.max(l,-x.sides[0].w,-z.sides[0].w),
                right=Math.min(r,x.sides[1].w,z.sides[1].w);
              if(right>left)band(bore?face:exteriorFace,x,z,left,.025,right,.025,col==='yellow'?0xe9c369:0xe4e4d4);
            };
            roadPaint(edge,layout,half,a.s,s,paint);
            if(bore&&(motorRoad(edge)||edge.length>40)){
              for(let station=Math.ceil((a.s-5)/14)*14+5;station<s;station+=14){
                const at=row(station),end=row(Math.min(station+1.55,hi));
                for(const [idx,sign] of [[0,-1],[1,1]]){
                  if(at.sides[idx].shared)continue;
                  const offset=at.sides[idx].w*sign*(q.box?.83:.63);
                  const y=q.box?q.crown-.055:mix(q.spring,q.crown,.778);
                  band(light,at,end,offset-.09,y,offset+.09,y,0xffeec9);
                }
              }
            }
            a=c;
          }
          if(bore&&hi>=edge.length-.001)portal(edge,a,q,-1);
        }
      }
    }
    for(const [mat,batch] of batches){
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(batch.pos,3));
      if(batch.painted)g.setAttribute('color',new T.Float32BufferAttribute(batch.col,3));
      else{g.setAttribute('uv',new T.Float32BufferAttribute(batch.uv,2));g.setAttribute('carriageway',new T.Float32BufferAttribute(batch.road,2));}
      g.computeVertexNormals();
      const mesh=new T.Mesh(g,mat);
      mesh.name=mat===materials.lining?'Tunnel inner lining':mat===materials.exterior?'Tunnel portals and approaches':
        mat===materials.light?'Tunnel luminaires':'Tunnel carriageways';
      // The roof still shades the road. Coarse outdoor shadow maps leave sawtooth edges on the inside wall.
      mesh.castShadow=mat===materials.lining||mat===materials.exterior;
      mesh.receiveShadow=mat!==materials.lining&&mat!==materials.light;group.add(mesh);
    }
    return portals;
  };
})();

;
// bridge-mesh.js
'use strict';
(() => {
  const concrete=0xb9b7ab,soffit=0x898b86,girder=0x9b9e98,steel=0x99a5a4;
  const shared=new WeakMap();
  const mix=(a,b,t)=>a+(b-a)*t;
  function assets(T,materials){
    if(!shared.has(materials))shared.set(materials,{
      box:new T.BoxGeometry(),
      beams:new T.MeshLambertMaterial({color:0xffffff}),
      faces:new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide})
    });
    return shared.get(materials);
  }
  // Positions stay in graph metres until they are written to a render buffer.
  // A new district origin therefore does not move an expansion joint or a pier.
  function* buildBridgeMeshSteps(T,options){
    const {edges,graph,cx,cz,radius,group,material,height,ground,bridgeInfo,registerObstacle,signatureHeight}=options;
    if(!graph)return;
    const kit=assets(T,material),decks=new Map(),faces=[],colors=[],poses=[],tints=[];
    let work=0;
    let activeDeck;
    const tint=new T.Color(),matrix=new T.Matrix4();
    const inRange=(x,z,margin=0)=>Math.hypot(x-cx,z-cz)<=radius+margin;
    function beam(a,b,width,depth,color){
      const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
      const length=Math.hypot(dx,dy,dz);
      if(length<.002)return;
      const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2;
      if(!inRange(mx,mz,length/2+width))return;
      const horiz=Math.hypot(dx,dz),rx=horiz>.001?dz/horiz:1,rz=horiz>.001?-dx/horiz:0;
      // Local Z spans the endpoints. Local Y is the upward section normal.
      const ux=dy*rz/length,uy=(dz*rx-dx*rz)/length,uz=-dy*rx/length;
      matrix.set(rx*width,ux*depth,dx,mx-cx,0,uy*depth,dy,(a.y+b.y)/2,
        rz*width,uz*depth,dz,mz-cz,0,0,0,1);
      poses.push(...matrix.elements);tints.push(color);
    }
    function polygon(points,color,halfWidth=0){
      if(!halfWidth)tint.setHex(color);
      for(const p of points){
        const x=p.x-cx,z=p.z-cz;
        if(halfWidth){
          const {positions,uv,finish}=activeDeck;
          positions.push(x,p.y,z);
          const freq=finish==='earth' ? .48 : .25;
          if(finish==='roadSlabs'||finish==='roadWood')uv.push(p.s,p.offset);
          else if(finish==='pavers')uv.push(p.x,p.z);
          else uv.push(x*freq+(cx*freq)%1,z*freq+(cz*freq)%1);
          if(finish==='asphalt')activeDeck.carriageway.push(p.offset,halfWidth);
        }else{
          faces.push(x,p.y,z);colors.push(tint.r,tint.g,tint.b);
        }
      }
    }
    function quad(a,b,c,d,color,halfWidth=0){polygon([a,b,d,b,c,d],color,halfWidth);}
    function at(row,offset,y=0){
      return {x:row.x+row.nx*offset,y:row.y+y,z:row.z+row.nz*offset,s:row.s,offset};
    }
    function ribbon(a,b,left,right,y,color,halfWidth=0){
      quad(at(a,left,y),at(a,right,y),at(b,right,y),at(b,left,y),color,halfWidth);
    }
    function intermediate(a,b,s){
      const t=(s-a.s)/(b.s-a.s);
      return {s,x:mix(a.x,b.x,t),z:mix(a.z,b.z,t),y:mix(a.y,b.y,t),nx:mix(a.nx,b.nx,t),nz:mix(a.nz,b.nz,t)};
    }
    function clearRail(edge,segment,a,b,offset){
      const p=at(a,offset),q=at(b,offset);
      const ax=p.x-cx,az=p.z-cz,bx=q.x-cx,bz=q.z-cz;
      return guardrailFits(ax,az,bx,bz,options.railRoads(ax,az,bx,bz),.12,null,(r,u,t)=>{
        if(r.source===edge&&r.station>=edge.dist[segment]-.001&&r.station<edge.dist[segment+1]-.001)return false;
        const roadY=options.roadHeight(r,u),railY=mix(a.y,b.y,t);
        // Match the vehicle clearance and parapet used by physical contact.
        return roadY+1.35>=railY&&roadY<=railY+1.20;
      });
    }
    function barrier(edge,a,b,side,offset){
      const p=at(a,offset),q=at(b,offset),dx=q.x-p.x,dz=q.z-p.z,len=Math.hypot(dx,dz);
      if(len<.05)return;
      registerObstacle({id:'bridge:'+edge.id+':'+side+':'+a.s.toFixed(2),kind:'barrier',
        x:(p.x+q.x)/2-cx,z:(p.z+q.z)/2-cz,fx:dx/len,fz:dz/len,w:len/2,d:.12,
        baseY:Math.min(a.y,b.y),height:1.08+Math.abs(a.y-b.y),parts:[]});
    }
    const width=window.worldRoadHalfWidth,signatures=window.VietnamBridgeSignatures;
    // Pick the same mitre on both sides of a two-way graph join, including
    // joins between separately mapped OSM ways and the ground approaches.
    function outward(edge,node){
      const pts=edge.points,first=edge.start===node;
      const a=first?pts[0]:pts.at(-1),b=first?pts[1]:pts.at(-2),len=Math.hypot(b.x-a.x,b.z-a.z);
      return [(b.x-a.x)/len,(b.z-a.z)/len];
    }
    function endpoint(edge,node,tangent,first){
      const links=graph.nodes.get(node)||[];
      if(links.length!==2)return tangent;
      const next=links.find(e=>e!==edge);
      if(!next)return tangent;
      const [tx,tz]=outward(next,node),nx=first?tz:-tz,nz=first?-tx:tx;
      return miter(tangent.nx,tangent.nz,nx,nz);
    }
    function miter(ax,az,bx,bz){
      const scale=1/Math.max(.5,1+ax*bx+az*bz);
      return {nx:(ax+bx)*scale,nz:(az+bz)*scale};
    }
    function rowSampler(edge,elevation=height,joinRoads=true){
      const tangents=edge.points.slice(1).map((b,i)=>{
        const a=edge.points[i],length=edge.dist[i+1]-edge.dist[i];
        return {nx:(a.z-b.z)/length,nz:(b.x-a.x)/length};
      });
      const joins=tangents.map((u,i)=>i?miter(tangents[i-1].nx,tangents[i-1].nz,u.nx,u.nz):joinRoads?endpoint(edge,edge.start,u,true):u);
      joins.push(joinRoads?endpoint(edge,edge.end,tangents.at(-1),false):tangents.at(-1));
      return (s,i)=>{
        if(i===undefined){
          let lo=0,hi=edge.dist.length-1;
          while(hi-lo>1){const mid=(lo+hi)>>1;if(edge.dist[mid]>s)hi=mid;else lo=mid;}
          i=lo;
        }
        const len=edge.dist[i+1]-edge.dist[i],t=(s-edge.dist[i])/len;
        const a=edge.points[i],b=edge.points[i+1],u=joins[i],v=joins[i+1];
        return {s,x:mix(a.x,b.x,t),z:mix(a.z,b.z,t),y:elevation(edge,s),nx:mix(u.nx,v.nx,t),nz:mix(u.nz,v.nz,t)};
      };
    }
    function roomForPier(edge,row){
      for(const other of graph.nearby(row.x,row.z,12)){
        if(other===edge)continue;
        const gap=width(other)+1.75;
        if(row.x<other.minX-gap||row.x>other.maxX+gap||row.z<other.minZ-gap||row.z>other.maxZ+gap)continue;
        for(let i=1;i<other.points.length;i++){
          const a=other.points[i-1],b=other.points[i];
          if(row.x<Math.min(a.x,b.x)-gap||row.x>Math.max(a.x,b.x)+gap||
             row.z<Math.min(a.z,b.z)-gap||row.z>Math.max(a.z,b.z)+gap)continue;
          const dx=b.x-a.x,dz=b.z-a.z,len=other.dist[i]-other.dist[i-1];
          const t=Math.max(0,Math.min(1,((row.x-a.x)*dx+(row.z-a.z)*dz)/(len*len)));
          if(Math.hypot(row.x-a.x-t*dx,row.z-a.z-t*dz)<gap&&height(other,other.dist[i-1]+t*len)<row.y-1.8)return false;
        }
      }
      return true;
    }
    function addPier(edge,row,w,depth){
      const top=row.y-depth-.53,base=ground(row.x,row.z)-3;
      if(top<base+1)return;
      const cap=Math.max(1.4,w*.80),stem=Math.min(1.8,w*.36);
      const center={x:row.x,z:row.z};
      beam({...center,y:base},{...center,y:top},stem*1.38,stem*1.22,0xa9aaa0);
      const arm=(side,outer,y)=>at(row,side*(outer?cap:stem*.44),y);
      for(const side of [-1,1])
        beam(arm(side,false,-depth-1.54),arm(side,true,-depth-.53),1.3,.58,concrete);
      beam(at(row,-cap,-depth-.45),at(row,cap,-depth-.45),1.47,.64,concrete);
      for(const side of [-1,1]){
        const p=at(row,side*w*.63);
        beam({...p,y:row.y-depth-.21},{...p,y:row.y-depth-.04},.62,.55,0x525b59);
      }
      registerObstacle({id:'pier:'+edge.id+':'+row.s.toFixed(1),kind:'barrier',x:row.x-cx,z:row.z-cz,
        radius:stem*.82,baseY:base,height:top-base,parts:[]});
    }
    function structureOnSpan(type,row,start,end,w){
      const mid=row((start+end)/2),length=end-start;
      if(!inRange(mid.x,mid.z,length/2)||signatures?.covers(graph,mid.x,mid.z)||length<14)return;
      const arch=type==='arch',truss=type==='truss';
      if(!arch&&!truss)return;
      // Deck arches carry the roadway on spandrels, through trusses frame the carriageway.
      const rise=arch?Math.min(length*.16,mid.y-ground(mid.x,mid.z)-1.2,8):Math.min(7.2,Math.max(4.8,w*.93));
      if(arch&&rise<1)return;
      const n=Math.max(3,Math.ceil(length/(truss?7:4.5)));
      for(const side of [-1,1]){
        const offset=side*(truss?w+.52:w*.68);
        let lastTop=null,lastBase=null;
        for(let i=0;i<=n;i++){
          const t=i/n,r=row(mix(start,end,t)),level=arch?-1.16-rise*(2*t-1)**2:rise;
          const top=at(r,offset,level),base=at(r,offset,truss?.54:-.76);
          if(lastTop){
            beam(lastTop,top,arch?.54:.30,arch?.71:.33,arch?concrete:0x697b79);
            if(truss){
              beam(i%2?lastBase:lastTop,i%2?top:base,.18,.20,0x71847f);
              if(side===1&&i%2===0)beam(at(r,-offset,rise),top,.18,.23,0x768681);
            }
          }
          if(i<n||truss)beam(base,top,arch?.34:.19,arch?.38:.21,arch?girder:0x748480);
          lastTop=top;lastBase=base;
        }
      }
    }
    function cableSpan(edge,row,start,end,w,depth,type){
      const length=end-start,mid=row((start+end)/2);
      if(signatures?.covers(graph,mid.x,mid.z))return;
      if(type==='simple-suspension'){
        const n=Math.max(6,Math.ceil(length/5.5)),h=Math.min(5.4,2.1+length*.027);
        for(const side of [-1,1]){
          const o=side*(w+.28);
          let prev=null;
          for(let k=0;k<=n;k++){
            const t=k/n,r=row(mix(start,end,t)),cable=at(r,o,1.28+(h-1.28)*(2*t-1)**2);
            beam(at(r,o,.25),cable,k===0||k===n?.18:.052,k===0||k===n?.20:.052,steel);
            if(prev)beam(prev,cable,.095,.095,0x737d79);prev=cable;
          }
        }
        return;
      }
      const stayed=type==='cable-stayed';
      // A mapped structure tag supplies the family, while the visible span
      // supplies its scale. Individually surveyed landmarks own their towers.
      const first=start+length*.18,second=end-length*.18,span=second-first;
      const h=Math.min(50,Math.max(5,length*(stayed?.13:.10)));
      for(const station of [first,second]){
        const r=row(station);
        if(inRange(r.x,r.z,4)&&roomForPier(edge,r))addPier(edge,r,w,depth);
      }
      for(const side of [-1,1]){
        const out=side*(w+.48),p=(s,h)=>at(row(s),out,h);
        for(const station of [first,second]){
          beam(p(station,-.43),p(station,h+.50),.5+h*.021,.59+h*.026,concrete);
          if(side===1)beam(at(row(station),-out,h*.80),p(station,h*.80),.48+h*.012,.46+h*.014,girder);
        }
        if(stayed){
          for(const [station,left,right] of [[first,start,(first+second)/2],[second,(first+second)/2,end]])
            for(let i=1;i<=7;i++)for(const anchor of [left,right])
              beam(p(station,h*(.72+.28*i/7)),p(mix(station,anchor,i/7),.49),.095,.095,0xc6cbca);
        }else{
          beam(p(start,.6),p(first,h),.18,.18,0x798a87);beam(p(second,h),p(end,.6),.18,.18,0x798a87);
          const n=Math.max(8,Math.ceil(span/7));
          let prev=p(first,h);
          for(let i=1;i<=n;i++){
            const t=i/n,station=mix(first,second,t),next=p(station,h*(.26+.74*(2*t-1)**2));
            beam(prev,next,.18,.18,0x798a87);if(i<n)beam(p(station,.5),next,.075,.075,steel);
            prev=next;
          }
        }
      }
    }
    // A bridge may be divided at an ordinary junction, virtual routing vertex,
    // or into two parallel one-way carriageways. Fit one main span to the
    // physical crossing and keep the approach viaducts on their own piers.
    const cableTypes=new Set(['cable-stayed','suspension','simple-suspension']);
    const cables=[],handled=new Set(),suspended=new Map();
    for(const initial of edges){
      const type=bridgeInfo(initial)?.structure;
      if(!cableTypes.has(type)||handled.has(initial))continue;
      const chain=[{edge:initial,forward:true}];handled.add(initial);
      for(const front of [true,false]){
        let node=front?initial.start:initial.end;
        for(;;){
          const links=(graph.nodes.get(node)||[]).filter(e=>bridgeInfo(e)?.structure===type);
          if(links.length!==2)break;
          const edge=links.find(e=>!handled.has(e));
          if(!edge)break;
          handled.add(edge);
          const item={edge,forward:front?edge.end===node:edge.start===node};
          if(front)chain.unshift(item);else chain.push(item);
          node=edge.start===node?edge.end:edge.start;
        }
      }
      let length=0;
      for(const item of chain){
        item.from=length;length+=item.edge.length;item.to=length;item.row=rowSampler(item.edge);
      }
      if(length<30)continue;
      function sample(s){
        const item=chain.find(i=>i.to>=s)||chain.at(-1),d=item.forward?s-item.from:item.to-s;
        const r=item.row(Math.max(0,Math.min(item.edge.length,d)));
        if(!item.forward){r.nx=-r.nx;r.nz=-r.nz;}
        r.s=s;r.edge=item.edge;r.distance=d;return r;
      }
      const a=sample(0),b=sample(length);
      cables.push({initial,chain,length,sample,a,b,type});
    }
    const separation=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
    const paired=new Set();
    for(const c of cables){
      if(paired.has(c))continue;
      let twin=null,reverse=false;
      if(c.initial.oneway){
        for(const next of cables){
          if(next===c||paired.has(next)||!next.initial.oneway||next.type!==c.type||
             Math.abs(next.length-c.length)>Math.max(12,c.length*.07))continue;
          const f=Math.max(separation(c.a,next.a),separation(c.b,next.b));
          const r=Math.max(separation(c.a,next.b),separation(c.b,next.a));
          if(Math.min(f,r)>Math.max(width(c.initial)+width(next.initial)+7,16))continue;
          twin=next;reverse=r<f;paired.add(next);break;
        }
      }
      paired.add(c);
      const half=width(c.initial),mid=c.length/2,limit=c.type==='cable-stayed'?520:430;
      const length=Math.min(c.length,limit),lo=mid-length/2,hi=mid+length/2;
      const mate=s=>twin.sample((reverse?1-s/c.length:s/c.length)*twin.length);
      const row=s=>{
        const p=c.sample(s);
        if(twin){
          const q=mate(s);p.x=(p.x+q.x)/2;p.z=(p.z+q.z)/2;p.y=(p.y+q.y)/2;
        }
        return p;
      };
      let modeled=false;
      const checks=Math.max(2,Math.ceil(c.length/80));
      for(let i=0;i<=checks&&!modeled;i++){
        const r=row(c.length*i/checks);
        modeled=signatures?.covers(graph,r.x,r.z)||options.authoredAt?.(r.edge,r.distance);
      }
      if(modeled)continue;
      const w=twin?(half+width(twin.initial)+separation(c.sample(mid),mate(mid)))/2:half;
      cableSpan(c.initial,row,lo,hi,w,Math.max(.56,Math.min(1.38,w*.14)),c.type);
      for(const part of twin?[c,twin]:[c]){
        const start=lo*part.length/c.length,end=hi*part.length/c.length;
        for(const item of part.chain){
          if(item.to<=start||item.from>=end)continue;
          const u=Math.max(item.from,start),v=Math.min(item.to,end);
          suspended.set(item.edge,item.forward?[u-item.from,v-item.from]:[item.to-v,item.to-u]);
        }
      }
    }
    const capped=new Set();
    for(const edge of edges){
      const info=bridgeInfo(edge);
      if(!info)continue;
      const w=width(edge),row=rowSampler(edge),major=/^(motorway|trunk)/.test(edge.kind);
      const heavy=major||w>=6,depth=Math.min(1.38,Math.max(.56,w*.14));
      const layout=roadLaneLayout(edge,w),finish=roadSurfaceClass(edge);
      if(!decks.has(finish))decks.set(finish,{finish,positions:[],uv:[],carriageway:[]});
      activeDeck=decks.get(finish);
      const apron=node=>(graph.nodes.get(node)?.length||0)>2?w+1.4:0;
      const railMin=apron(edge.start),railMax=edge.length-apron(edge.end);
      for(const [start,end] of info.ranges){
        for(const [s,node,mouth] of [[0,edge.start,railMin],[edge.length,edge.end,edge.length-railMax]]){
          if(!mouth||s<start||s>end||capped.has(node))continue;
          capped.add(node);
          const p=row(s),r=Math.max(...graph.nodes.get(node).map(width));
          if(!inRange(p.x,p.z,r)||p.y-ground(p.x,p.z)<.2)continue;
          // Merge elevated slip roads around their mapped node. The connected
          // strips keep their top at y+.004; this small apron sits below them.
          const center={...p,offset:0};
          for(let k=0;k<16;k++){
            const rim=i=>({...center,x:p.x+r*Math.sin(i*Math.PI/8),z:p.z+r*Math.cos(i*Math.PI/8)});
            polygon([center,rim(k),rim(k+1)],0,r);
          }
        }
        for(let i=0;i<edge.points.length-1;i++){
          const lo=Math.max(start,edge.dist[i]),hi=Math.min(end,edge.dist[i+1]);
          if(lo>=hi)continue;
          const a=edge.points[i],b=edge.points[i+1],len=edge.dist[i+1]-edge.dist[i];
          const tx=(b.x-a.x)/len,tz=(b.z-a.z)/len,along=(cx-a.x)*tx+(cz-a.z)*tz;
          const side=Math.abs((cx-a.x)*tz-(cz-a.z)*tx),reach=radius+w+5;
          if(side>reach)continue;
          const extent=Math.sqrt(reach*reach-side*side);
          const from=Math.max(lo,edge.dist[i]+along-extent),to=Math.min(hi,edge.dist[i]+along+extent);
          if(to<=from)continue;
          // Anchor the subdivision on the OSM segment, even when it leaves the view.
          const stations=[from,to];
          for(let s=edge.dist[i]+Math.ceil((from-edge.dist[i])/6)*6;s<to;s+=6)if(s>from)stations.push(s);
          if(railMin>from&&railMin<to)stations.push(railMin);
          if(railMax>from&&railMax<to)stations.push(railMax);
          stations.sort((a,b)=>a-b);
          let prev=row(from,i);
          for(const s of stations.slice(1)){
            if((++work&7)===0)yield;
            if(s-prev.s<.0001)continue;
            const next=row(s,i);
            ribbon(prev,next,-w,w,.004,0,w);
            roadPaint(edge,layout,w,prev.s,s,(lo,hi,left,right,color)=>
              ribbon(intermediate(prev,next,lo),intermediate(prev,next,hi),left,right,.028,
                color==='yellow'?0xf0ca63:0xe8e8d7),{lines:prev.s>=railMin&&s<=railMax});
            const owned=options.authoredAt?.(edge,(prev.s+s)/2)??info.landmark;
            if(!owned){
              for(const side of [-1,1]){
                const outer=side*(w+.38),lip=side*(w+.16);
                ribbon(prev,next,side*w,outer,.005,concrete);
                quad(at(prev,outer,.005),at(next,outer,.005),at(next,lip,-.39),at(prev,lip,-.39),girder);
                if(info.bridge){
                  const offset=side*w*.63;
                  beam(at(prev,offset,-(depth+.32)/2),at(next,offset,-(depth+.32)/2),Math.max(.4,w*.17),depth-.30,0x989c97);
                }else{
                  const foot=r=>{
                    const p=at(r,outer),level=ground(p.x,p.z),fill=Math.max(0,r.y-level);
                    const f=at(r,side*(w+.4+Math.min(5,fill*.8)));f.y=ground(f.x,f.z)-.25;return f;
                  };
                  quad(at(prev,lip,-.28),at(next,lip,-.28),foot(next),foot(prev),0x918f77);
                }
                if(prev.s>=railMin&&s<=railMax){
                  const o=side*(w+.16);
                  const raised=info.bridge||Math.max(prev.y-ground(prev.x,prev.z),next.y-ground(next.x,next.z))>.45;
                  if(raised&&clearRail(edge,i,prev,next,o)){
                    beam(at(prev,o,.14),at(next,o,.14),.35,.29,concrete);
                    if(heavy){
                      beam(at(prev,o,.49),at(next,o,.49),.23,.48,0xc8c7ba);
                      beam(at(prev,o,.82),at(next,o,.82),.20,.16,0xbabcb4);
                    }else{
                      for(const h of [.57,.95])beam(at(prev,o,h),at(next,o,h),.095,.095,steel);
                    }
                    for(let d=Math.ceil(prev.s/(heavy?12:3))* (heavy?12:3);d<s;d+=heavy?12:3){
                      const stand=intermediate(prev,next,d);
                      if(heavy)beam(at(stand,o,.89),at(stand,o,.97),.15,.095,0xe9b24f);
                      else beam(at(stand,o,.23),at(stand,o,.98),.11,.13,0x87938e);
                    }
                    barrier(edge,prev,next,side,o);
                  }
                }
              }
              if(info.bridge)ribbon(prev,next,-w-.16,w+.16,-.38,soffit);
            }
            prev=next;
          }
        }
        if(!info.bridge)continue;
        const length=end-start,bays=Math.max(1,Math.ceil(length/(major?39:31))),bay=length/bays;
        const type=info.structure,architecturalBays=Math.max(1,Math.round(length/65));
        if(type==='truss'||type==='arch'){
          for(let k=0;k<architecturalBays;k++)if(!(options.authoredAt?.(edge,start+length*(k+.5)/architecturalBays)??info.landmark))
            structureOnSpan(type,row,start+length*k/architecturalBays,start+length*(k+1)/architecturalBays,w);
        }
        if(type==='floating'||type==='low_water_crossing')continue;
        const gap=suspended.get(edge);
        for(let k=1;k<bays;k++){
          if((++work&7)===0)yield;
          if(gap&&start+bay*k>gap[0]&&start+bay*k<gap[1])continue;
          for(const delta of [0,-5,5,-9,9]){
            if(Math.abs(delta)>=bay*.37)continue;
            const r=row(start+bay*k+delta);
            if(!inRange(r.x,r.z,4)||signatures?.covers(graph,r.x,r.z)||(options.authoredAt?.(edge,r.s)??info.landmark))break;
            if(roomForPier(edge,r)){addPier(edge,r,w,depth);break;}
          }
        }
      }
    }
    // Mapped footbridges have their own path and supports. Their stair or ramp
    // ways run from street level to the shared endpoint of the elevated deck.
    const footWays=[],ends=new Map();
    const pointKey=p=>Math.round(p.x*100)+','+Math.round(p.z*100);
    for(const way of options.footbridges||[]){
      if((++work&15)===0)yield;
      const points=[],dist=[];
      let length=0,visible=false;
      for(const p of way.points){
        const prev=points.at(-1);
        if(prev){
          const d=Math.hypot(prev.x-p.x,prev.z-p.z);
          if(d<.05)continue;
          length+=d;visible||=inRange((p.x+prev.x)/2,(p.z+prev.z)/2,d/2+8);
        }
        points.push(p);dist.push(length);
      }
      if(!visible||length<.5)continue;
      const foot={...way,points,dist,length,half:Math.min(4.5,Math.max(.55,(way.width||2.1)/2))};
      footWays.push(foot);
      if(foot.kind!=='deck')continue;
      const clearance=6.1+Math.max(0,(foot.layer||1)-1)*6.8;
      let top=-Infinity;
      for(const p of points)top=Math.max(top,ground(p.x,p.z)+clearance);
      for(let j=1;j<points.length;j++){
        const a=points[j-1],b=points[j],dx=b.x-a.x,dz=b.z-a.z;
        if((++work&7)===0)yield;
        for(const road of graph.nearby((a.x+b.x)/2,(a.z+b.z)/2,Math.hypot(dx,dz)/2+2)){
          const profile=bridgeInfo(road);
          if(!profile||profile.layer>=(foot.layer||1))continue;
          for(let k=1;k<road.points.length;k++){
            const c=road.points[k-1],d=road.points[k],rx=d.x-c.x,rz=d.z-c.z,det=dx*rz-dz*rx;
            if(Math.abs(det)<.0001)continue;
            const x=c.x-a.x,z=c.z-a.z,u=(x*rz-z*rx)/det,v=(x*dz-z*dx)/det;
            if(u>=0&&u<=1&&v>=0&&v<=1)top=Math.max(top,height(road,mix(road.dist[k-1],road.dist[k],v))+5.9);
          }
        }
      }
      foot.top=top;
      for(const p of [points[0],points.at(-1)]){
        const key=pointKey(p);
        if(!ends.has(key))ends.set(key,[]);
        ends.get(key).push(foot);
      }
    }
    const unseen=new Set(footWays.filter(way=>way.kind==='deck'));
    for(const first of unseen){
      const chain=[first];unseen.delete(first);
      let top=first.top;
      for(let i=0;i<chain.length;i++){
        const way=chain[i];top=Math.max(top,way.top);
        for(const p of [way.points[0],way.points.at(-1)])for(const next of ends.get(pointKey(p)))
          if(unseen.delete(next))chain.push(next);
      }
      for(const way of chain)way.top=top;
    }
    function landingHeight(foot,p){
      const adjacent=ends.get(pointKey(p))?.find(deck=>deck.layer===foot.layer);
      if(adjacent)return adjacent.top;
      // A stair sometimes joins an interior node of a long or simplified deck.
      for(const deck of footWays){
        if(deck.kind!=='deck'||deck.layer!==foot.layer)continue;
        for(let i=1;i<deck.points.length;i++){
          const a=deck.points[i-1],b=deck.points[i],dx=b.x-a.x,dz=b.z-a.z;
          const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));
          if(Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz)<1.35)return deck.top;
        }
      }
      return ground(p.x,p.z)+6.1+Math.max(0,(foot.layer||1)-1)*6.8;
    }
    for(const foot of footWays){
      yield;
      const {points,length,half,kind}=foot,first=points[0],last=points.at(-1);
      const bottom=ground(first.x,first.z)+.06;
      const top=foot.top??landingHeight(foot,last);
      const isDeck=kind==='deck',stairs=kind==='steps',rises=Math.max(1,Math.round(Math.abs(top-bottom)/.165));
      const row=rowSampler(foot,(_,s)=>isDeck?top:mix(bottom,top,s/length),false);
      const stations=new Set(foot.dist);
      for(let s=0;s<length;s+=12)stations.add(s);
      if(stairs)for(let i=1;i<rises;i++)stations.add(i*length/rises);
      let a=row(0);
      for(const s of [...stations].sort((u,v)=>u-v)){
        if((++work&15)===0)yield;
        if(s-a.s<.0001)continue;
        const b=row(s);
        if(inRange((a.x+b.x)/2,(a.z+b.z)/2,(s-a.s)/2+half)){
          const treadY=stairs?mix(bottom,top,Math.floor((a.s+s)*.5*rises/length)/rises):null;
          const front=treadY==null?a:{...a,y:treadY},back=treadY==null?b:{...b,y:treadY};
          ribbon(front,back,-half,half,.005,0xadafa6);
          if(stairs&&Math.abs(s*rises/length-Math.round(s*rises/length))<.00001)
            quad(at(back,-half),at(back,half),at(b,half),at(b,-half),0x878a83);
          ribbon(a,b,-half,half,-.34,soffit);
          for(const side of [-1,1]){
            const o=side*half;
            quad(at(front,o,.005),at(back,o,.005),at(b,o,-.34),at(a,o,-.34),girder);
            for(const h of [.47,1.04])beam(at(a,o,h),at(b,o,h),.065,.07,steel);
          }
        }
        a=b;
      }
      for(let s=0;s<length;s+=1.5){
        const r=row(s);
        if(!inRange(r.x,r.z,half)||(s%3&&Math.hypot(r.x-cx,r.z-cz)>320))continue;
        for(const side of [-1,1])beam(at(r,side*half,-.025),at(r,side*half,1.05),.075,.08,steel);
      }
      if(isDeck){
        const bays=Math.max(1,Math.ceil(length/28));
        for(let i=0;i<=bays;i++){
          const r=row(i*length/bays);
          if(!inRange(r.x,r.z,4)||!roomForPier(foot,r))continue;
          // Adjacent deck ways share one bent at their join.
          if((i===0||i===bays)&&ends.get(pointKey(r))?.[0]!==foot)continue;
          const base=ground(r.x,r.z)-.5;
          beam({...r,y:base},{...r,y:r.y-.67},.65,.79,0xa5aaa3);
          beam(at(r,-half*.94,-.5),at(r,half*.94,-.5),.78,.34,concrete);
          registerObstacle({id:'foot-pier:'+foot.id+':'+i,kind:'barrier',x:r.x-cx,z:r.z-cz,radius:.42,
            baseY:base,height:r.y-.65-base,parts:[]});
        }
      }
    }
    if(signatureHeight)signatures?.draw({graph,x:cx,z:cz,radius,deckHeight:signatureHeight,groundHeight:ground,beam});
    function mesh(vertices,mat,name,attributes){
      if(!vertices.length)return;
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
      for(const [key,buffer,size] of attributes)g.setAttribute(key,new T.Float32BufferAttribute(buffer,size));
      g.computeVertexNormals();
      const m=new T.Mesh(g,mat);m.name=name;m.castShadow=m.receiveShadow=true;group.add(m);
    }
    for(const {finish,positions,uv,carriageway} of decks.values()){
      yield;
      const attributes=[['uv',uv,2]];
      if(finish==='asphalt')attributes.push(['carriageway',carriageway,2]);
      mesh(positions,material[finish],'Mapped bridge decks',attributes);
    }
    if(faces.length)yield;
    mesh(faces,kit.faces,'Bridge fascia and markings',[['color',colors,3]]);
    if(tints.length){
      const members=new T.InstancedMesh(kit.box,kit.beams,tints.length);
      members.name='Bridge piers, rails and superstructures';members.castShadow=members.receiveShadow=true;
      members.instanceMatrix.array.set(poses);
      tints.forEach((color,i)=>members.setColorAt(i,tint.setHex(color)));
      group.add(members);
    }
  }
  window.buildBridgeMeshSteps=buildBridgeMeshSteps;
  window.buildBridgeMeshes=function(T,options){
    for(const step of buildBridgeMeshSteps(T,options)){ /* Finish synchronous builds. */ }
  };
})();

;
// world-verges.js
'use strict';

// Bent leaves share one small mesh. Vertex colours keep the roots in shade
// while the thinner tips pick up light from the sky.
function createVergeGrass(T,blades=21){
  const verts=[], colours=[], bottom=new T.Color(0x56643a), tip=new T.Color(0xaba65e);
  for(let i=0;i<blades;i++){
    const a=i*2.39996, spread=.53*Math.sqrt(i/blades), dx=Math.cos(a), dz=Math.sin(a);
    const x=dx*spread,z=dz*spread,h=.32+.38*(.5+.5*Math.sin(7.1*i+1.7));
    const w=.012+.006*(i%4),lean=.21+.21*spread;
    const l=[x-dz*w,0,z+dx*w],r=[x+dz*w,0,z-dx*w];
    const m=[x+dx*lean*.36,h*.64,z+dz*lean*.36],end=[x+dx*lean,h,z+dz*lean];
    const ml=[m[0]-dz*w*.56,m[1],m[2]+dx*w*.56];
    const mr=[m[0]+dz*w*.56,m[1],m[2]-dx*w*.56];
    for(const p of [l,r,ml,r,mr,ml,ml,mr,end]){
      verts.push(...p);
      const f=.12+.88*p[1]/h;
      colours.push(bottom.r+(tip.r-bottom.r)*f,bottom.g+(tip.g-bottom.g)*f,bottom.b+(tip.b-bottom.b)*f);
    }
  }
  const geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute(verts,3));
  geometry.setAttribute('color',new T.Float32BufferAttribute(colours,3));
  geometry.computeVertexNormals();
  return geometry;
}

function scatterVergeGrass(segments, reach, clear, plant){
  for(const s of segments){
    if(s.rank>reach||s.authoredPavement||s.graded||s.len<7)continue;
    let seed=s.seed;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    for(const sign of [-1,1]){
      for(let d=2+random()*5;d<s.len-1;d+=4+random()*7){
        const beyond=s.w+1.05+random()**2*5;
        const x=s.ax+s.fx*d+sign*s.nx*beyond,z=s.az+s.fz*d+sign*s.nz*beyond;
        const size=.40+random()*.65,angle=random()*Math.PI*2;
        if(x*x+z*z>reach*reach||!clear(x,z))continue;
        for(let i=-1;i<=1;i++){
          const px=x+s.fx*i*.7,pz=z+s.fz*i*.7;
          plant(px,pz,size*(1-.24*Math.abs(i)),angle+i*1.75);
        }
      }
    }
  }
}

;
// world-atmosphere.js
'use strict';

// The sky, its reflection in water, and the key light share a sun direction.
function createWorldAtmosphere(T, scene, sun, loader, bearing=0, clearFog=.00078) {
  const skyMap = loader.load('streetscape/sky.jpg');
  skyMap.colorSpace = T.SRGBColorSpace;
  skyMap.wrapS = T.RepeatWrapping;
  const solar = new T.Vector3(), direction = new T.Vector3();
  const up = new T.Vector3(0,1,0);
  const morning = new T.Vector3(.94,.115,-.32).normalize();
  const uniforms = {
    panorama: {value:skyMap}, sunRay: {value:direction}, overcast: {value:0},
    dusk: {value:0}, daylight: {value:1}, eclipse: {value:0}, horizon: {value:scene.fog.color}
  };
  const sky = new T.Mesh(new T.SphereGeometry(1,40,20), new T.ShaderMaterial({
    uniforms, side:T.BackSide, depthWrite:false,
    vertexShader:`
      varying vec3 ray;
      void main() {
        ray=position;
        vec4 clip=projectionMatrix*vec4(mat3(viewMatrix)*position,1.);
        gl_Position=clip.xyww;
      }`,
    fragmentShader:`
      uniform sampler2D panorama;
      uniform vec3 sunRay, horizon;
      uniform float overcast, dusk, daylight, eclipse;
      varying vec3 ray;
      void main() {
        vec3 d=normalize(ray);
        float height=max(0.,d.y), rim=exp(-height*5.);
        // Use photographed cloud detail without inheriting the photograph's sun position.
        vec2 uv=vec2(atan(d.z,d.x)*.15915494+.5,asin(clamp(height,0.,1.))*.31830989+.5);
        vec3 photograph=texture2D(panorama,uv).rgb;
        float cloud=smoothstep(.035,.75,min(photograph.r,photograph.g))*(1.-.72*rim);
        float facing=max(0.,dot(d,sunRay)), separation=length(d-sunRay);
        vec3 zenith=mix(vec3(.012,.023,.057),vec3(.075,.25,.55),daylight);
        zenith=mix(zenith,vec3(.155,.23,.42),dusk*.76);
        vec3 air=mix(zenith,horizon,rim);
        vec3 cloudLight=mix(vec3(.036,.053,.09),vec3(1.10,1.15,1.19),daylight);
        cloudLight=mix(cloudLight,vec3(1.28,.65,.37),dusk*(.32+.62*facing));
        vec3 colour=mix(air,cloudLight,cloud*.91);
        vec3 storm=mix(vec3(.15,.205,.26),vec3(.45,.51,.54),cloud+.17*rim)*(.14+.86*daylight);
        colour=mix(colour,storm,overcast*.89);
        float glow=exp(-separation*5.)*.30+exp(-separation*33.)*.96;
        vec3 sunlight=mix(vec3(1.,.89,.68),vec3(1.55,.62,.24),dusk);
        colour+=sunlight*(glow+5.*(1.-smoothstep(.005,.0085,separation)))*daylight*(1.-overcast);
        gl_FragColor=vec4(colour*mix(vec3(1.),vec3(.31,.45,.52),eclipse),1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  }));
  // The sky is at the far depth. Shade only the sky pixels left by opaque scenery.
  sky.frustumCulled=false; sky.renderOrder=1000; scene.add(sky);
  const fill=new T.HemisphereLight(0xcde4ff,0x8c7761,1);
  scene.add(fill);
  const warmSun=new T.Color(0xffb065), daySun=new T.Color(0xfff0d6), moon=new T.Color(0x9cbeef);
  const clearAir=new T.Color(0xaac4d4), warmAir=new T.Color(0xefaa79);
  const greyAir=new T.Color(0xa0adb8), nightAir=new T.Color(0x354761);
  const skyFill=new T.Color(0xc3ddff), lowFill=new T.Color(0xa7b5df), nightFill=new T.Color(0x8faddb);
  const mixColour=new T.Color();
  const wetness={value:0}, lamps={value:0};
  const finishes=new Set();
  let reflectionLight=1;
  function registerFinish(mat){
    if(!mat?.isMeshStandardMaterial||finishes.has(mat))return;
    // GLTF paints are cloned per vehicle. Keep the unscaled value across clones.
    mat.userData.dayReflection??=mat.envMapIntensity;
    mat.envMapIntensity=mat.userData.dayReflection*reflectionLight;
    finishes.add(mat);
  }
  let lastMinute=-1, longitude=105.8, latitude=21, localHour=null;
  function setHour(hour){
    if(hour!==localHour){localHour=hour;lastMinute=-1;}
  }
  function setLocation(lon,lat) {
    longitude=lon; latitude=lat; lastMinute=-1;
  }
  function update(dawn,cloud,wet,fog,blend) {
    const minute=Math.floor(Date.now()/60000);
    if(minute!==lastMinute){
      lastMinute=minute;
      const day=new Date(minute*60000);
      const yearDay=(minute*60000-Date.UTC(day.getUTCFullYear(),0,1))/86400000;
      const rad=Math.PI/180, declination=.409*Math.sin((yearDay-80)*2*Math.PI/365.24);
      const utcMinutes=localHour==null?minute%1440:(localHour-7)*60;
      const angle=(utcMinutes/4+longitude-180)*rad, lat=latitude*rad;
      const cd=Math.cos(declination), sd=Math.sin(declination);
      solar.set(-cd*Math.sin(angle),sd*Math.sin(lat)+cd*Math.cos(angle)*Math.cos(lat),
        cd*Math.cos(angle)*Math.sin(lat)-sd*Math.cos(lat)).applyAxisAngle(up,bearing);
    }
    direction.copy(solar).lerp(morning,dawn).normalize();
    const eclipse=uniforms.eclipse.value;
    const day=T.MathUtils.smoothstep(direction.y,-.14,.08)*(1-eclipse);
    const dusk=(1-T.MathUtils.smoothstep(direction.y,.10,.54))*day;
    uniforms.overcast.value+=(Math.max(cloud*.85,wet*.97,fog)-uniforms.overcast.value)*blend;
    const cover=uniforms.overcast.value;
    const intensity=.15+day*(.92-.34*cover-.20*dusk);
    if(Math.abs(reflectionLight-intensity)>.009){
      reflectionLight=intensity;
      for(const mat of finishes)mat.envMapIntensity=mat.userData.dayReflection*intensity;
    }
    uniforms.dusk.value=dusk; uniforms.daylight.value=day;
    wetness.value+=(wet-wetness.value)*blend;
    lamps.value=Math.max(1-day,T.MathUtils.smoothstep(cover,.65,.98)*.24);
    mixColour.copy(clearAir).lerp(warmAir,dusk*.88).lerp(greyAir,cover).lerp(nightAir,1-day);
    scene.fog.color.copy(mixColour).multiplyScalar(1-.48*eclipse);
    scene.fog.density=Math.max(clearFog*(1.+dusk*.55+cover*.92),.010*fog,.0032*wetness.value);
    sun.color.copy(daySun).lerp(warmSun,dusk).lerp(greyAir,cover*.65).lerp(moon,1-day);
    sun.intensity=(.29+day*(3.25-.54*dusk))*(1.-.79*cover);
    fill.color.copy(skyFill).lerp(lowFill,dusk*.60).lerp(nightFill,1-day);
    fill.intensity=.31+day*(.85+.34*cover);
    // Keep a raking moonlight after sunset so silhouettes and road edges stay legible.
    sun.position.copy(direction);
    if(direction.y<0) sun.position.negate();
    sun.position.y=Math.max(.17,sun.position.y);
    sun.position.normalize().multiplyScalar(68).add(sun.target.position);
  }
  return {update,setLocation,setHour,registerFinish,wetness,lamps,eclipse:uniforms.eclipse};
}

;
// world-family-sedan.js
'use strict';

async function loadWorldFamilySedan(T,path){
  const data=await fetchMapTile(path);
  const model=new T.ObjectLoader().parse(data);
  const mounts=new Map();
  // The sedan export batches four identical corners per material. Each corner
  // occupies a contiguous quarter of both the indexed faces and the vertices.
  for(const part of ['tire','rim_paint','rim_machined','brake_disc','caliper']){
    const batch=model.getObjectByName(part),source=batch.geometry;
    const vertexCount=source.attributes.position.count/4,indexCount=source.index.count/4;
    for(let i=0;i<4;i++){
      const geometry=new T.BufferGeometry(),start=i*vertexCount;
      for(const [name,attribute] of Object.entries(source.attributes)){
        const size=attribute.itemSize;
        const values=attribute.array.subarray(start*size,(start+vertexCount)*size);
        geometry.setAttribute(name,new T.BufferAttribute(values,size,attribute.normalized));
      }
      const indices=source.index.array.subarray(i*indexCount,(i+1)*indexCount);
      geometry.setIndex(new T.BufferAttribute(indices.map(index=>index-start),1));
      geometry.computeBoundingBox();
      const center=geometry.boundingBox.getCenter(new T.Vector3());
      const front=center.z>0,left=center.x>0,id=(front?'F':'R')+(left?'L':'R');
      if(part==='tire'){
        const axle=new T.Group(),wheel=new T.Group();
        if(front)axle.name='steer_'+id;
        axle.position.copy(center);
        wheel.name='wheel_'+id;
        if(!left)wheel.rotation.y=Math.PI;
        model.add(axle);axle.add(wheel);mounts.set(id,{axle,wheel});
      }
      const {axle,wheel}=mounts.get(id);
      // Keep the faces in their authored pose when reparenting. Calipers
      // follow the steering knuckle while the wheel and disc spin together.
      const mesh=new T.Mesh(geometry,batch.material);
      (part==='caliper'?axle:wheel).attach(mesh);
    }
    model.remove(batch);
    source.dispose();
  }
  return model;
}

;