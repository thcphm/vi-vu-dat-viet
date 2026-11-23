(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const exam = params.get('mode') === 'exam';
  const sessionName = 'taylai.theory.b.2026.' + (exam ? 'exam' : 'practice') + '.' + (params.get('run') || 'standalone');
  const bank = new Map(window.driveBank.map(question => [question.id, question]));
  // Phụ lục III, Công văn 2262/CSGT-P5.
  const critical = new Set([19,20,21,22,23,24,25,26,27,28,30,32,34,35,47,48,52,53,55,58,63,64,65,66,67,68,70,71,72,73,74,85,86,87,88,89,90,91,92,93,97,98,102,117,163,165,167,197,198,206,215,226,234,245,246,252,253,254,255,260]);
  const groups = [[1,180,8],[181,205,1],[206,263,1],[264,300,1],[301,485,9],[486,600,9]];
  const duration = 20 * 60 * 1000;
  let state = null;
  function shuffled(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  function save() { try { localStorage.setItem(sessionName, JSON.stringify(state)); } catch {} }
  function valid(s) {
    return s && Array.isArray(s.ids) && s.ids.length === 30 && new Set(s.ids).size === 30 &&
      s.ids.every(id => bank.has(id)) && s.ids.filter(id => critical.has(id)).length === 1 &&
      Array.isArray(s.answers) && s.answers.length === 30 && s.answers.every((a,i) => a === null || (Number.isInteger(a) && a >= 0 && a < bank.get(s.ids[i]).choices.length)) &&
      Array.isArray(s.flags) && s.flags.length === 30 && Number.isInteger(s.index) && s.index >= 0 && s.index < 30 &&
      Number.isFinite(s.deadline) && ['running','done'].includes(s.status);
  }
  function start() {
    const picked = groups.flatMap(([lo,hi,count]) => shuffled([...bank.keys()].filter(id => id >= lo && id <= hi && !critical.has(id))).slice(0,count));
    picked.push(shuffled(critical)[0]);
    state = {ids:shuffled(picked),answers:Array(30).fill(null),flags:Array(30).fill(false),index:0,status:'running',deadline:Date.now()+duration};
    save(); display(); tick();
  }
  function grade() {
    let score = 0, criticalOK = true;
    state.ids.forEach((id,i) => {
      const ok = state.answers[i] === bank.get(id).correct;
      if (ok) score++;
      if (critical.has(id) && !ok) criticalOK = false;
    });
    return {score,criticalOK,passed:score >= 27 && criticalOK};
  }
  function finish(expired) {
    if (!state || state.status !== 'running') return;
    state.status='done'; state.expired=expired; state.index=0; save();
    if ($('confirm').open) $('confirm').close();
    const result=grade();
    if (exam && parent !== window && location.origin !== 'null') {
      parent.postMessage({type:'drive-exam-result',part:'theory',passed:result.passed,score:result.score,maxScore:30}, location.origin);
    }
    display();
  }
  function tick() {
    if (!state || state.status !== 'running') return;
    const seconds = Math.ceil((state.deadline-Date.now())/1000);
    if(seconds<=0) { finish(true); return; }
    $('clock').textContent = Math.floor(seconds/60) + ':' + String(seconds%60).padStart(2,'0');
    $('clock').classList.toggle('urgent',seconds<=60);
  }
  function go(index) {
    state.index=index; save(); display();
    $('prompt').scrollIntoView({block:'nearest'});
  }
  function display() {
    const done = state.status === 'done', q = bank.get(state.ids[state.index]), choice = state.answers[state.index];
    const reveal = done || (!exam && choice !== null);
    $('welcome').hidden = true; $('workspace').hidden = false;
    $('heading').textContent= done ? 'Kết quả lý thuyết' : 'Lý thuyết hạng B';
    $('clock').hidden=done;
    $('result').hidden=!done;
    if(done) {
      const {score,criticalOK,passed}=grade();
      const title=document.createElement('strong'); title.textContent=(passed?'Đạt':'Chưa đạt')+' · '+score+'/30';
      const detail=document.createElement('p');detail.textContent=(state.expired?'Hết giờ. ':'')+(criticalOK?'Đúng câu điểm liệt.':'Câu điểm liệt chưa được trả lời đúng.')+(score<27?' Cần đúng ít nhất 27 câu.':'');
      $('result').replaceChildren(title,detail);
    }
    $('counter').textContent='CÂU '+String(state.index+1).padStart(2,'0')+' / 30'+(done?' · NGÂN HÀNG #'+q.id+(critical.has(q.id)?' · ĐIỂM LIỆT':''):'');
    $('prompt').textContent=q.prompt; const image=$('diagram'); image.hidden=!q.image;
    image.alt=q.imageAlt||'';
    if(q.image)image.src=q.image;else image.removeAttribute('src');
    $('choices').replaceChildren(...q.choices.map((text,i)=>{
      const button=document.createElement('button'),letter=document.createElement('b'),body=document.createElement('span');
      letter.textContent=String.fromCharCode(65+i);body.textContent=text;button.append(letter,body);
      button.disabled=done;button.setAttribute('aria-pressed', String(i===choice));
      if(reveal && (i===q.correct || i===choice))markQuizAnswer(button,i===q.correct);
      else if(i===choice)button.className='selected';
      button.onclick=()=>{if(Date.now()>=state.deadline)return finish(true);state.answers[state.index]=i;save();display();$('choices').children[i].focus({preventScroll:true});};
      return button;
    }));
    $('answerNote').textContent=reveal?(choice===null?'Đã bỏ trống. ':choice===q.correct?'Bạn đã chọn đúng. ':'Bạn đã chọn sai. ')+'Đáp án '+String.fromCharCode(65+q.correct)+'.':'';
    $('grid').replaceChildren(...state.ids.map((id,i)=>{
      const button=document.createElement('button');button.textContent=String(i+1);
      const answered=state.answers[i]!==null,correct=state.answers[i]===bank.get(id).correct;
      button.className=[i===state.index?'here':'',done?(correct?'picked':'bad'):answered?'picked':'',state.flags[i]?'tag':''].join(' ');
      button.setAttribute('aria-label','Câu '+(i+1)+(done?(correct?', đúng':', cần ôn'):answered?', đã chọn':', chưa chọn')+(state.flags[i]?', đã đánh dấu':''));
      if(i===state.index)button.setAttribute('aria-current','step');button.onclick=()=>go(i);return button;
    }));
    const count=state.answers.filter(a=>a!==null).length;
    $('progress').textContent=count+'/30 câu đã trả lời';
    $('prev').disabled=state.index===0;$('next').disabled=state.index===29;
    $('mark').hidden=done;$('mark').setAttribute('aria-pressed',String(state.flags[state.index]));
    $('mark').textContent=state.flags[state.index]?'Bỏ đánh dấu':'Đánh dấu';
    $('submit').hidden=done;$('newPaper').hidden=!done||(exam&&window!==parent);
    $('legend').textContent=done?'Xanh là câu đúng · đỏ là câu cần ôn':'Ô sáng đã trả lời · góc vàng đã đánh dấu';
  }
  $('modeLabel').textContent=exam?'Kỳ thi thử · Phần lý thuyết':'Luyện đề hạng B';
  $('begin').onclick=$('newPaper').onclick=start;
  $('prev').onclick=()=>go(state.index-1);$('next').onclick=()=>go(state.index+1);
  $('mark').onclick=()=>{state.flags[state.index]=!state.flags[state.index];save();display();};
  $('submit').onclick=()=>{
    tick();if(state.status==='done')return;
    const blanks=state.answers.filter(a=>a===null).length;
    $('confirmText').textContent=blanks?'Còn '+blanks+' câu chưa trả lời. Bạn muốn nộp bài ngay?':'Bạn đã chọn đáp án cho cả 30 câu.';
    $('confirm').showModal();
  };
  $('cancel').onclick=()=>$('confirm').close();$('send').onclick=()=>finish(Date.now()>=state.deadline);
  try {const stored=JSON.parse(localStorage.getItem(sessionName));if(valid(stored))state=stored;}catch{}
  if(state){display();tick();}
  setInterval(tick,350);
  document.addEventListener('visibilitychange',tick);
})();
