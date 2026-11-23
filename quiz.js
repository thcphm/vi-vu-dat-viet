(() => {
  'use strict';
  const dialog = document.getElementById('quiz');
  const key = 'taylai.csgt2025.study.v1';
  const source = window.driveBankSource;
  // Phụ lục III, Công văn 2262/CSGT-P5 ngày 07/05/2025.
  const critical = new Set([
    19,20,21,22,23,24,25,26,27,28,30,32,34,35,47,48,52,53,55,58,
    63,64,65,66,67,68,70,71,72,73,74,85,86,87,88,89,90,91,92,93,
    97,98,102,117,163,165,167,197,198,206,215,226,234,245,246,252,253,254,255,260
  ]);
  const chapters = window.driveChapters;
  let state;
  try { state = JSON.parse(localStorage.getItem(key)); } catch {}
  if (!state || typeof state.results !== 'object' || !state.results) state = {results: {}, run: null};
  const save = () => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} };
  const bank = () => window.driveBank || [];
  const lookup = id => bank().find(q => q.id === Number(id));
  const letter = index => String.fromCharCode(65 + index);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const attempted = id => Object.hasOwn(state.results, id);
  const retry = () => bank().filter(q => attempted(q.id) && state.results[q.id] !== q.correct);
  let road = null;
  let chapterIndex = 0;

  function mount(compact) {
    const parent = document.fullscreenElement || (compact ? document.getElementById('console') : document.body);
    if (dialog.parentNode !== parent) parent.append(dialog);
    dialog.classList.toggle('q-road', compact);
    dialog.setAttribute('aria-labelledby','quiz-title');
    if (!dialog.open) { if (compact) dialog.show(); else dialog.showModal(); }
    if (compact && !document.fullscreenElement && matchMedia('(max-width:820px)').matches) dialog.scrollIntoView({block:'nearest'});
    dialog.scrollTop = 0;
  }

  function chrome(section, content) {
    dialog.innerHTML = '<div class="q-top"><strong>' + escape(section) + '</strong>' +
      (road ? '' : '<button type="button" class="q-close" aria-label="Đóng thư viện" data-action="close">×</button>') + '</div>' + content;
  }
  function library() {
    const all = bank(), done = all.filter(q => attempted(q.id)).length, missed = retry();
    const run = state.run;
    chrome('Thư viện lý thuyết', '<h2 id="quiz-title">Bộ ' + all.length + ' câu sát hạch</h2>' +
      '<div class="q-metrics"><span>Đã làm <b>' + done + ' / ' + all.length + '</b></span><span>Đã trả lời đúng <b>' + (done - missed.length) + '</b></span></div>' +
      '<progress aria-label="Số câu đã làm" value="' + done + '" max="' + all.length + '"></progress>' +
      (run && run.ids?.length && run.index < run.ids.length && lookup(run.ids[run.index]) ? '<button class="q-primary" data-action="resume">Tiếp tục lượt đang ôn · câu ' + run.ids[run.index] + '</button>' : '') +
      '<h3>Chọn chương</h3><div class="q-chapters">' + chapters.map(([first,last,title],index) =>
        '<button class="q-chapter" data-chapter="' + index + '"><strong>' + title + '</strong><small>Câu ' + first + '–' + last + '</small></button>').join('') + '</div>' +
      '<div class="q-tools"><button class="q-secondary" data-action="critical">Ôn câu điểm liệt</button><button class="q-secondary" data-action="missed" ' + (missed.length ? '' : 'disabled') + '>Ôn câu sai (' + missed.length + ')</button>' +
      '<form class="q-jump"><label for="q-number">Đến câu</label><input id="q-number" type="number" min="1" max="' + all.length + '" required inputmode="numeric" placeholder="1–' + all.length + '"><button class="q-secondary">Mở</button></form></div>' +
      '<a class="q-source" href="' + source + '" target="_blank" rel="noopener">Xem tài liệu gốc · Cục CSGT 2025 ↗</a>');
    dialog.scrollTop = 0;
  }

  function chapter() {
    const [first,last,title] = chapters[chapterIndex];
    let chunks = '';
    for (let id = first; id <= last; id += 10) {
      const end = Math.min(id + 9,last);
      const count = bank().filter(q => q.id >= id && q.id <= end && attempted(q.id)).length;
      chunks += '<button class="q-chapter" data-chunk="' + id + '"><strong>Câu ' + id + '–' + end + '</strong><small>Đã làm ' + count + '/' + (end-id+1) + '</small></button>';
    }
    chrome('Chương ' + (chapterIndex + 1), '<h2 id="quiz-title">' + title + '</h2><div class="q-chapters">' + chunks + '</div>' +
      '<button class="q-secondary q-back" data-action="library">Về thư viện</button>');
    dialog.scrollTop = 0;
  }

  function begin(ids) {
    if (!ids.length) return library();
    state.run = {ids,index:0,answers:[]}; save(); question();
  }

  function question() {
    const run = state.run;
    const q = road ? road.question : lookup(run.ids[run.index]);
    const chosen = road ? road.answer : run.answers[run.index];
    const answered = Number.isInteger(chosen);
    const matched = chosen === q.correct;
    const text = road ? 'Quyết định trên đường' : 'Ôn lý thuyết · ' + (run.index + 1) + '/' + run.ids.length;
    let html = '<div class="q-label">Câu ' + q.id + (critical.has(q.id) ? ' · Điểm liệt' : '') + ' · ' + chapters.find(([a,b]) => q.id >= a && q.id <= b)[2] + '</div>' +
      '<h2 id="quiz-title">' + escape(q.prompt) + '</h2>';
    if (q.image) html += '<img class="q-image" src="' + escape(q.image) + '" alt="' + escape(q.imageAlt) + '">';
    html += '<div class="q-options">' + q.choices.map((choice,i) =>
      '<button type="button" class="q-option" data-choice="' + i + '" ' + (answered ? 'disabled' : '') + '><b>' + letter(i) + '</b><span>' + escape(choice) + '</span></button>').join('') + '</div>';
    if (answered) html += '<div class="q-feedback" role="status"><strong>' + (matched ? 'Chính xác' : 'Đáp án đúng là ' + letter(q.correct)) + '</strong>' +
      (road && road.coaching ? '<p>' + escape(road.coaching) + '</p>' : '') + '</div>' +
      '<button class="q-primary" data-action="next">' + (road ? 'Tiếp tục lái' : run.index + 1 === run.ids.length ? 'Xem kết quả' : 'Câu tiếp theo') + '</button>';
    if (!road) html += '<button class="q-secondary q-back" data-action="library">Về thư viện</button>';
    chrome(text,html);
    if (answered) {
      const buttons = dialog.querySelectorAll('[data-choice]');
      markQuizAnswer(buttons[q.correct],true);
      if (!matched) markQuizAnswer(buttons[chosen],false);
      dialog.querySelector('[data-action="next"]').focus({preventScroll:false});
    }
    else {dialog.scrollTop=0;dialog.querySelector('.q-option')?.focus({preventScroll:true});}
  }

  function summary() {
    const {ids,answers} = state.run;
    const missed = ids.filter((id,index) => answers[index] !== lookup(id).correct);
    chrome('Kết quả lượt ôn','<h2 id="quiz-title">Đúng ' + (ids.length - missed.length) + ' / ' + ids.length + ' câu</h2>' +
      (missed.length ? '<button class="q-primary" data-action="round-retry">Làm lại ' + missed.length + ' câu sai</button>' : '') +
      '<button class="q-secondary q-back" data-action="library">Chọn bài tiếp theo</button>');
    dialog.scrollTop=0;
  }

  dialog.addEventListener('cancel', e => { if (road) e.preventDefault(); });
  dialog.addEventListener('submit', e => {
    e.preventDefault();
    const q = lookup(dialog.querySelector('#q-number').value);
    if (q) begin([q.id]);
  });
  dialog.addEventListener('click',e => {
    const button = e.target.closest('button');
    if (!button || button.disabled) return;
    const {action,choice,chapter: selected,chunk} = button.dataset;
    if (choice !== undefined) {
      const q = road ? road.question : lookup(state.run.ids[state.run.index]);
      const picked = Number(choice);
      if (road) { road.answer = picked; window.driveAudio?.cue(picked === q.correct); } else state.run.answers[state.run.index] = picked;
      state.results[q.id] = picked;
      save(); return question();
    }
    if (action === 'next') {
      if (road) {
        const result = road.answer === road.question.correct;
        const resume = road.resume;
        road = null; dialog.close(); resume(result); return;
      }
      state.run.index++; save();
      return state.run.index < state.run.ids.length ? question() : summary();
    }
    if (road) return;
    if (action === 'close') return dialog.close();
    if (action === 'library') return library();
    if (action === 'resume') return question();
    if (action === 'round-retry') return begin(state.run.ids.filter((id,i) => state.run.answers[i] !== lookup(id).correct));
    if (action === 'missed') return begin(retry().map(q=>q.id));
    if (action === 'critical') return begin([...critical]);
    if (selected !== undefined) {chapterIndex=Number(selected);return chapter();}
    if (chunk !== undefined) {
      const first=Number(chunk), last=Math.min(first+9,chapters[chapterIndex][1]);
      begin(bank().filter(q=>q.id>=first && q.id<=last).map(q=>q.id));
    }
  });
  document.addEventListener('fullscreenchange', () => {
    if (road && dialog.open) mount(true);
  });
  document.addEventListener('keydown', event => {
    if (!road || !dialog.open || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    const index = '1234'.indexOf(event.key);
    if (index < 0) return;
    const choice = dialog.querySelector('[data-choice="' + index + '"]:enabled');
    if (choice) { event.preventDefault(); choice.click(); }
  });
  window.openRouteReview = ids => {
    if(road || !ids.length)return;
    begin(ids.slice());mount(false);
  };
  window.openQuiz = chapterNumber => {
    if (road) return;
    if (Number.isInteger(chapterNumber) && chapterNumber >= 1 && chapterNumber <= chapters.length) {
      chapterIndex = chapterNumber - 1;
      chapter();
    } else {
      library();
    }
    mount(false);
  };
  window.openRoadQuestion = (id, coachingText, onContinue) => {
    const q = lookup(id);
    if (!q) throw new Error('Không tìm thấy câu ' + id);
    road = {question:q,coaching:coachingText,resume:onContinue};
    question(); mount(true);
  };
})();
