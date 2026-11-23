'use strict';

// The builder and browser use the same partition, turn rules and integer costs.
// A portal is a directed OSM edge crossing a tile boundary. Its signed ID is
// also the incoming-turn state in the next tile, including at grade separations.
const RouteNetwork = (() => {
  function tileAt(index, x, y) {
    const a=Math.floor(x/25000), b=Math.floor(y/25000), parent=a+'_'+b;
    const n=index.splits?.[parent];
    return n ? parent+'_'+Math.floor((x-a*25000)*n/25000)+'_'+Math.floor((y-b*25000)*n/25000) : parent;
  }

  class Heap {
    constructor(){this.keys=[];this.values=[];}
    push(key,value){
      let i=this.keys.length;
      while(i){
        const p=(i-1)>>1;
        if(this.values[p]<=value)break;
        this.keys[i]=this.keys[p];this.values[i]=this.values[p];i=p;
      }
      this.keys[i]=key;this.values[i]=value;
    }
    pop(){
      const keys=this.keys, values=this.values, top=keys[0];
      this.value=values[0];
      const key=keys.pop(), value=values.pop();
      if(keys.length){
        let i=0, child;
        while((child=i*2+1)<keys.length){
          if(child+1<keys.length && values[child+1]<values[child])++child;
          if(value<=values[child])break;
          keys[i]=keys[child];values[i]=values[child];i=child;
        }
        keys[i]=key;values[i]=value;
      }
      return top;
    }
  }

  const weights={motorway:1,trunk:1.08,primary:1.24,secondary:1.45,tertiary:1.75,
    unclassified:2.05,residential:2.4,living_street:2.8,service:3};
  function metres(coords){
    const sx=1.1132*Math.cos((coords[1]+coords.at(-1))*Math.PI/36000000);
    let total=0;
    for(let i=2;i<coords.length;i+=2)total+=Math.hypot((coords[i]-coords[i-2])*sx,(coords[i+1]-coords[i-1])*1.109);
    return total;
  }
  // Match VietnamRoads.allows for motorcars. The from/to way IDs are retained
  // for every edge involved in an OSM turn relation in the traffic database.
  function allows(arc,next){
    let only=false,allowed=false;
    for(const [,via,way,rule,mask] of arc.traffic.turns||[]){
      if(via!==arc.head || !(mask&1))continue;
      let matches=next.traffic.way===way;
      if(matches && way===arc.traffic.way && rule.endsWith('_u_turn'))matches=next.id===-arc.id;
      if(rule.startsWith('only_')){only=true;allowed ||= matches;}
      else if(matches)return false;
    }
    return !only || allowed;
  }

  class Tile {
    constructor(index,key,rows,details={}){
      this.key=key;this.arcs=[];this.byId=new Map();this.inputs=[];this.outputs=[];
      const incident=new Map(), empty={};
      for(const [edge,u,v,,kind,oneway,coords] of rows){
        const start=tileAt(index,coords[0],coords[1]),end=tileAt(index,coords.at(-2),coords.at(-1));
        if(start!==key && end!==key)continue;
        const length=metres(coords);
        if(length<.5)continue;
        const weight=weights[kind.split('_link')[0]]||2;
        const cost=Math.max(1,Math.round(length*weight)),traffic=details[edge]||empty;
        const add=(id,tail,head,from,to)=>{
          const n=this.arcs.length;
          const arc={n,id,head,from,to,length,cost,traffic,next:[],prev:[]};
          this.arcs.push(arc);this.byId.set(id,n);
          if(from===key){
            if(!incident.has(tail))incident.set(tail,[]);
            incident.get(tail).push(arc);
          }else this.inputs.push(n);
          if(to!==key)this.outputs.push(n);
        };
        add(edge,u,v,start,end);
        if(!oneway)add(-edge,v,u,end,start);
      }
      for(const arc of this.arcs){
        if(arc.to!==key)continue;
        const options=incident.get(arc.head)||[];
        for(const next of options)if(next.id!==-arc.id && allows(arc,next))arc.next.push(next.n);
        if(!arc.next.length){
          const back=options.find(next=>next.id===-arc.id && allows(arc,next));
          if(back)arc.next.push(back.n);
        }
        for(const n of arc.next)this.arcs[n].prev.push(arc.n);
      }
    }
    // Forward labels include the last arc's cost. Reverse labels include the
    // given arc's cost as well, except the seed is clipped at the destination.
    search(seeds,reverse=false,trace=false,stop=-1){
      const costs=new Float64Array(this.arcs.length).fill(Infinity);
      const parents=trace?new Int32Array(this.arcs.length).fill(-1):null;
      const heap=new Heap();
      for(const [n,cost] of seeds)if(cost<costs[n]){costs[n]=cost;heap.push(n,cost);}
      while(heap.keys.length){
        const n=heap.pop(), d=heap.value;
        if(d!==costs[n])continue;
        if(n===stop)break;
        for(const m of (reverse?this.arcs[n].prev:this.arcs[n].next)){
          const nd=d+this.arcs[m].cost;
          if(nd>=costs[m])continue;
          costs[m]=nd;if(parents)parents[m]=n;heap.push(m,nd);
        }
      }
      return {costs,parents};
    }
    overlay(){
      const from=this.inputs.map(n=>this.arcs[n].id);
      const to=this.outputs.map(n=>[this.arcs[n].id,this.arcs[n].to]);
      const costs=[];
      for(const n of this.inputs){
        const distances=this.search([[n,0]]).costs;
        for(const m of this.outputs)costs.push(Number.isFinite(distances[m])?distances[m]:-1);
      }
      return {from,to,costs};
    }
  }

  // Snap on the detailed polyline using the same local metric as world-roads.
  function nearest(point,rows,best){
    const [lon,lat]=point, x=lon*1e5, y=lat*1e5, sx=1.1132*Math.cos(lat*Math.PI/180);
    for(const [id,,,,,oneway,c] of rows){
      let length=0, hit=null, error=Infinity;
      for(let i=2;i<c.length;i+=2){
        const ax=c[i-2],ay=c[i-1],dx=(c[i]-ax)*sx,dy=(c[i+1]-ay)*1.109;
        const step=Math.hypot(dx,dy);
        if(!step)continue;
        const px=(x-ax)*sx,py=(y-ay)*1.109;
        const f=Math.max(0,Math.min(1,(px*dx+py*dy)/(step*step)));
        const d=(px-f*dx)**2+(py-f*dy)**2;
        if(d<error){error=d;hit={point:[(ax+f*(c[i]-ax))/1e5,(ay+f*(c[i+1]-ay))/1e5],s:length+f*step};}
        length+=step;
      }
      if(length>=.5 && hit && (!best || error<best.error || error===best.error && id<best.id))
        best={id,error,point:hit.point,fraction:hit.s/length,oneway:Boolean(oneway),
          ends:[c[0],c[1],c.at(-2),c.at(-1)]};
    }
    return best;
  }
  return {tileAt,Heap,Tile,nearest};
})();
if(typeof module!=='undefined')module.exports=RouteNetwork;
