'use strict';

const practice = document.getElementById('practice');
practice.hidden = false;
practice.addEventListener('click', () => window.openQuiz());
const chapterNumber = Number(new URLSearchParams(location.search).get('chuong'));
if (parent !== window || (chapterNumber >= 1 && chapterNumber <= window.driveChapters.length)) {
  window.openQuiz(chapterNumber);
}
document.getElementById('quiz').addEventListener('close', () => {
  if (parent !== window) parent.postMessage({type:'return-to-exam-hall'}, location.origin);
});
