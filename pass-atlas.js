'use strict';

(() => {
  const byId=id=>document.getElementById(id);
  const stages=new Map(mountainStages.map(stage=>[stage.id,stage]));
  // Without scripting these links open the corresponding descriptions in the guide.
  for (const link of byId('passChoices').querySelectorAll('a')) {
    link.hash = link.hash.replace('#guide-', '#');
  }
  function select(){
    const key=location.hash.slice(1).replace(/^guide-/,''),id=scenicPasses.has(key)?key:scenicPasses.keys().next().value;
    const pass=scenicPasses.get(id),stage=stages.get(id),heights=smoothRoadProfile(stage);
    for(const a of byId('passChoices').children){
      if(a.hash==='#'+id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
    }
    byId('region').textContent=pass.region;
    byId('passTitle').textContent=stage.name;
    byId('description').textContent=pass.description;
    byId('passGuideLink').href=byId('guide-'+id).querySelector('a').href;
    byId('passGuideLink').textContent='Bản đồ và thông số chặng '+stage.name;
    byId('plate').src='pass-plates/'+id+'.webp';
    byId('plate').alt='Chặng '+stage.name+' qua vùng '+pass.landscape.toLocaleLowerCase('vi')+'. Vòng tròn đánh dấu điểm đầu, hình thoi đánh dấu đích.';
    byId('length').textContent=(stage.angles.length*stage.step/1000).toLocaleString('vi-VN')+' km';
    const gain=heights.reduce((sum,h,i)=>i?sum+Math.max(0,h-heights[i-1]):0,0);
    byId('ascent').textContent=Math.round(gain)+' m';
    const light=byId('light').value,lighting=light==='local'?'':'&light='+light;
    byId('explore').href='./?pass='+id+lighting;byId('race').href='cup.html?route='+id+lighting;
    const c=byId('elevation'),g=c.getContext('2d'),lo=Math.min(...heights),hi=Math.max(...heights);
    g.clearRect(0,0,c.width,c.height);g.lineWidth=1;g.strokeStyle='#486251';
    for(const y of [16,46,76]){g.beginPath();g.moveTo(0,y);g.lineTo(c.width,y);g.stroke();}
    g.beginPath();heights.forEach((h,i)=>{
      const x=i/(heights.length-1)*c.width,y=80-68*(h-lo)/Math.max(1,hi-lo);
      if(i)g.lineTo(x,y);else g.moveTo(x,y);
    });
    g.strokeStyle='#d5ee9c';g.lineWidth=3;g.stroke();g.lineTo(c.width,92);g.lineTo(0,92);g.closePath();
    const fill=g.createLinearGradient(0,10,0,92);fill.addColorStop(0,'#c9e99d60');fill.addColorStop(1,'#a9cc8608');g.fillStyle=fill;g.fill();
  }
  addEventListener('hashchange',select);byId('light').onchange=select;select();
})();
