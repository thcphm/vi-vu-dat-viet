'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const parts = {
    theory:{title:'Lý thuyết',file:'theory-exam.html',max:30},
    yard:{title:'Sa hình',file:'yard.html',max:100},
    road:{title:'Đường trường',file:'road-exam.html',max:100},
    streets:{title:'Tập lái trên phố',file:'streets.html'},
    library:{title:'Ngân hàng 600 câu',file:'library.html'}
  };
  const hallTitle = document.title;
  // Native links support search, new tabs and direct access to each practice page.
  $('hall').addEventListener('click', event => {
    const link = event.target.closest('a[data-practice]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    location.hash = 'practice/' + link.dataset.practice;
  });
  const order=['theory','yard','road'];
  const lessons=['Xuất phát','Dừng nhường người đi bộ','Dừng và khởi hành trên dốc','Vệt bánh xe và cua vuông','Ngã tư có đèn tín hiệu','Đường vòng quanh co','Ghép xe dọc','Ghép xe ngang','Dừng ở đường sắt','Thay đổi số trên đường bằng','Kết thúc','Tình huống khẩn cấp'];
  for (const [i,title] of lessons.entries()){
    const a=document.createElement('a'),n=document.createElement('i');
    a.href='yard.html?lesson='+i;a.dataset.practice='yard/'+i;n.textContent=i===11?'!':String(i+1).padStart(2,'0');a.append(n,title);$('yardLessons').append(a);
  }
  const key='taylai.exam-B.2026-11.v1';
  let session=null, active=null, lastLocation='';
  function read(){
    try{
      const s=JSON.parse(localStorage.getItem(key));
      if(!s || !Array.isArray(s.results)||s.results.length>3||typeof s.id!=='string')return null;
      for(let i=0;i<s.results.length;i++){
        const r=s.results[i];if(r?.part!==order[i]||typeof r.passed!=='boolean'||!Number.isFinite(r.score)||r.score<0||r.score>parts[r.part].max||(!r.passed&&i!==s.results.length-1))return null;
      }
      return s;
    }catch{return null;}
  }
  function save(){try{localStorage.setItem(key,JSON.stringify(session));}catch{}}
  function nextPart(){return order[(session?.results||[]).filter(r=>r.passed).length];}
  function nextAttempt(){
    if(!session||!nextPart()){session={id:Date.now().toString(36),results:[]};save();}
    if(session.results.at(-1)?.passed===false){
      session.results.pop();session.retry=(Number(session.retry)||0)+1;save();
    }
    const hash='#exam/'+nextPart();
    if(location.hash===hash){lastLocation='';show();}else location.hash=hash;
  }
  function progress(){
    const results=session?.results||[], next=nextPart();
    $('newExam').hidden=!session||!next;
    $('examStart').firstChild.textContent=!session?'Bắt đầu kỳ thi ':next?'Tiếp tục thi thử ':'Thi một lượt mới ';
    $('examStatus').textContent=!session?'3 phần thi theo thứ tự':next?'Phần tiếp theo · '+parts[next].title:'Đã đạt cả 3 phần thi';
    const scores=$('scores');scores.replaceChildren();
    if(!session){scores.textContent='Chưa bắt đầu kỳ thi liên hoàn.';return;}
    const list=document.createElement('ol');
    order.forEach((id,i)=>{const li=document.createElement('li'),r=results[i];li.textContent=parts[id].title+' · '+(r?(r.passed?'Đạt':'Chưa đạt')+' · '+r.score+'/'+parts[id].max:(next===id?'Có thể bắt đầu':'Chờ phần trước'));list.append(li);});scores.append(list);
  }
  function show(){
    const hash=location.hash;if(hash===lastLocation&&active)return;
    const [mode,part,lesson]=hash.slice(1).split('/');
    if(!Object.hasOwn(parts,part) || !['exam','practice'].includes(mode) || (mode==='exam'&&(!session||nextPart()!==part||!order.includes(part)))){
      active=null;lastLocation='';$('module').src='about:blank';$('hall').hidden=false;$('player').hidden=true;
      document.body.classList.remove('playing');document.title=hallTitle;progress();return;
    }
    if(mode==='exam' && session.results.at(-1)?.passed===false){nextAttempt();return;}
    lastLocation=hash;active={mode,part,received:false,id:session?.id};$('outcome').hidden=true;
    const module=$('module'),params=new URLSearchParams({mode});
    if(part==='yard'&&/^\d+$/.test(lesson||'')&&Number(lesson)<12)params.set('lesson',lesson);
    if(part==='road'&&mode==='practice'&&['pass','river'].includes(lesson))params.set('route',lesson);
    if(mode==='exam'){
      params.set('run',session.id+'-'+(session.retry||0));
      if(part==='road'){
        if(!['pass','river'].includes(session.route)){session.route=Math.random()<.5?'pass':'river';save();}
        params.set('route',session.route);
      }
    }
    module.src=parts[part].file+'?'+params.toString();
    $('partName').textContent=module.title=parts[part].title;
    $('modeText').textContent=mode==='exam'?'Thi liên hoàn · phần '+(order.indexOf(part)+1)+'/3':'Luyện tự chọn';
    $('hall').hidden=true;$('player').hidden=false;document.body.classList.add('playing');document.title=parts[part].title+' · Vi vu đất Việt';window.scrollTo(0,0);
  }
  function home(){location.hash='home';}
  window.addEventListener('message',event=>{
    if(event.source!==$('module').contentWindow || event.origin!==location.origin||!active)return;
    const data=event.data;
    if(data?.type==='return-to-exam-hall'){home();return;}
    if(active.mode!=='exam'||active.received||!session||active.id!==session.id||data?.type!=='drive-exam-result'||data.part!==active.part||typeof data.passed!=='boolean')return;
    const max=parts[active.part].max;
    if(!Number.isInteger(data.score)||data.score<0||data.score>max)return;
    active.received=true;
    session.results[order.indexOf(active.part)]={part:active.part,passed:data.passed,score:data.score};save();
    const next=nextPart();
    $('outcome').hidden=false;
    $('outcomeText').textContent=(data.passed?'Đạt ':'Chưa đạt ')+parts[active.part].title+' · '+data.score+'/'+max+(data.passed&&!next?' · Hoàn thành kỳ thi hạng B':'');
    $('continue').textContent=data.passed?(next?'Thi '+parts[next].title:'Xem tổng kết'):'Thi lại phần này';
    $('continue').onclick=next?nextAttempt:home;
  });
  $('examStart').onclick=nextAttempt;$('back').onclick=home;
  $('newExam').onclick=()=>$('confirm').showModal();
  $('confirm').addEventListener('close',()=>{if($('confirm').returnValue==='reset'){session=null;nextAttempt();}});
  window.addEventListener('hashchange',show);
  window.addEventListener('storage',e=>{if(e.key===key){session=read();if(!active)progress();else if(active.mode==='exam'&&(!session||session.id!==active.id||nextPart()!==active.part))home();}});
  session=read();show();

  // Draw the two kinds of practice surface at the same scale as their card illustrations.
  function background(c,palette){
    const g=c.createLinearGradient(0,0,650,270);g.addColorStop(0,palette[0]);g.addColorStop(1,palette[1]);c.fillStyle=g;c.fillRect(0,0,660,270);
    c.strokeStyle='#c1d8b91a';c.lineWidth=1;
    for(let x=-220;x<800;x+=26){c.beginPath();c.moveTo(x,0);c.lineTo(x+150,270);c.stroke();}
    for(let y=0;y<280;y+=24){c.beginPath();c.moveTo(0,y);c.lineTo(660,y);c.stroke();}
  }
  function stripe(c,path,width){
    c.lineJoin=c.lineCap='round';
    c.setLineDash([]);c.strokeStyle='#a9b49c';c.lineWidth=width+4;c.stroke(path);
    c.strokeStyle='#354139';c.lineWidth=width;c.stroke(path);
    c.strokeStyle='#e8cb83';c.lineWidth=2;c.setLineDash([9,10]);c.stroke(path);c.setLineDash([]);
  }
  const y=$('trackArt').getContext('2d');background(y,['#61745b','#31473b']);
  y.translate(24,-30);y.rotate(-.09);const circuit=new Path2D('M -50 220 L 87 220 Q 111 220 111 196 L 111 125 Q 111 101 137 101 L 265 101 Q 294 101 294 129 L 294 169 C 294 212 350 214 366 173 S 426 125 438 163 L 448 197 Q 456 226 489 226 L 569 226 Q 605 226 605 189 L 605 100 Q 605 70 575 70 L 388 70');stripe(y,circuit,31);
  y.strokeStyle='#e9eed4';y.lineWidth=2;for(let i=0;i<4;i++)y.strokeRect(142+i*27,118,25,42);
  y.fillStyle='#edb863';y.fillRect(150,124,15,26);
  const r=$('roadArt').getContext('2d');background(r,['#64745b','#415442']);
  r.strokeStyle='#a9bfac';r.lineWidth=48;const river=new Path2D('M -20 30 Q 103 125 217 96 T 492 174 T 690 183');r.stroke(river);r.lineWidth=42;r.strokeStyle='#547b79';r.stroke(river);
  const road=new Path2D('M -30 260 Q 85 215 145 215 C 267 215 231 79 360 78 S 490 132 566 57 Q 600 17 682 15');stripe(r,road,27);
  r.fillStyle='#e6ed9c';r.beginPath();r.moveTo(362,70);r.lineTo(378,78);r.lineTo(362,85);r.closePath();r.fill();
})();
