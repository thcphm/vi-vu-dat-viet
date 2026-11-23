const ink = '#183c35';
const paper = '#fff6df';
const display = '"Barlow Condensed", system-ui, sans-serif';

function lines(ctx, text, width) {
  const result = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? line + ' ' + word : word;
    if (line && ctx.measureText(next).width > width) { result.push(line); line = word; }
    else line = next;
  }
  if (line) result.push(line);
  return result;
}

// The saved and shared image uses the same print as the dialog preview.
export function printPostcard(scene, {title, note, stamp, mark, portrait = false}) {
  const canvas = document.createElement('canvas');
  const w = canvas.width = portrait ? 900 : 1200;
  const h = canvas.height = portrait ? 1125 : 630;
  const ctx = canvas.getContext('2d');
  const frame = 18, left = 52, bottom = portrait ? 822 : 430;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, w, h);
  const photoW = w - 2 * frame, photoH = bottom - frame;
  const scale = Math.max(photoW / scene.width, photoH / scene.height);
  const sw = photoW / scale, sh = photoH / scale;
  ctx.drawImage(scene, (scene.width - sw) / 2, (scene.height - sh) / 2, sw, sh, frame, frame, photoW, photoH);
  const shade = ctx.createLinearGradient(0, bottom - 175, 0, bottom);
  shade.addColorStop(0, 'transparent'); shade.addColorStop(1, 'rgba(6,32,27,.86)');
  ctx.fillStyle = shade; ctx.fillRect(frame, bottom - 175, photoW, 175);
  const brand = 'Vi vu đất Việt';
  const mode = 'XUYÊN VIỆT';
  ctx.font = 'italic 700 33px ' + display;
  const brandWidth = ctx.measureText(brand).width;
  ctx.font = 'bold 18px system-ui';
  const modeX = left - 10 + brandWidth + 20;
  ctx.fillStyle = ink; ctx.fillRect(frame, frame, modeX + ctx.measureText(mode).width + 22 - frame, 55);
  ctx.fillStyle = paper; ctx.fillText(mode, modeX, 54);
  ctx.fillStyle = '#dbfa87'; ctx.font = 'italic 700 33px ' + display;
  ctx.fillText(brand, left - 10, 56);
  ctx.font = 'italic 700 84px ' + display;
  const size = Math.min(84, 84 * (w - 2*left) / Math.max(1, ctx.measureText(title).width));
  ctx.font = 'italic 700 ' + size + 'px ' + display;
  ctx.fillText(title, left, bottom - 25, w - 2 * left);

  // The postmark is drawn into the print, including discoveries actually made in-game.
  const x = w - 104, y = h - (portrait ? 137 : 98);
  if (mark) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(-.08); ctx.drawImage(mark,-76,-76,152,152); ctx.restore();
  } else {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.14);
    ctx.strokeStyle = '#286052'; ctx.fillStyle = '#286052'; ctx.lineWidth = 3;
    for (const radius of [63, 56]) { ctx.beginPath(); ctx.arc(0, 0, radius, 0, 2*Math.PI); ctx.stroke(); }
    ctx.textAlign = 'center'; ctx.font = 'bold 14px system-ui';
    ctx.fillText('VIỆT NAM', 0, -20);
    ctx.font = 'italic 700 32px ' + display; ctx.fillText(brand, 0, 11, 102);
    ctx.font = 'bold 12px system-ui'; ctx.fillText('BƯU THIẾP', 0, 33);
    ctx.restore();
  }

  const textWidth = w - 240;
  ctx.fillStyle = '#406353'; ctx.font = 'bold 19px system-ui';
  ctx.fillText(stamp ? 'DẤU ĐÃ TÌM  /  ' + stamp : 'LỜI NHẮN TỪ GHẾ PHỤ', left, bottom + 39, textWidth);
  ctx.fillStyle = ink; ctx.font = 'italic 34px "Times New Roman", "Noto Serif", serif';
  const noteLines = lines(ctx, note, textWidth);
  noteLines.forEach((line, i) => ctx.fillText(line, left, bottom + 87 + i * 41));
  ctx.fillStyle = '#466356'; ctx.font = '600 19px system-ui';
  ctx.fillText('thcphm', left, h - 27);
  ctx.font = '16px system-ui'; ctx.fillText('© OpenStreetMap contributors', left + 142, h - 27);
  return canvas;
}

const spareNotes = [
  'Đi một vòng cho biết. Giờ biết là nên đi thêm vòng nữa.',
  'Tớ gửi vị trí rồi đấy. Mang theo đồ ăn, ghế phụ còn trống.'
];

async function decodeBlob(blob) {
  const src = URL.createObjectURL(blob);
  try { const picture = new Image(); picture.src = src; await picture.decode(); return picture; }
  finally { URL.revokeObjectURL(src); }
}

export function createPostcardDialog() {
  const el = id => document.getElementById(id);
  const dialog = el('postcard'), photo = el('postcardPrint'), status = el('postcardMessage');
  let session = 0, version = 0, image, details, noteIndex, file, blobUrl;
  function freePrint() {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = null; file = null;
    photo.hidden = true; photo.removeAttribute('src');
    el('postcardSave').hidden = true; el('postcardSave').removeAttribute('href');
    el('postcardShare').disabled = el('postcardNote').disabled = true;
  }
  function showLink(message) {
    const input = el('postcardUrl');
    input.value = details.url; input.hidden = false; input.focus(); input.select();
    status.textContent = message;
  }
  async function draw() {
    const id = session, revision = ++version;
    freePrint();
    const note = [details.note, ...spareNotes][noteIndex];
    const canvas = printPostcard(image, {...details, note, portrait: image.height > image.width});
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .91));
    if (id !== session || revision !== version) return;
    if (!blob) throw Error('Missing print');
    file = new File([blob], 'vi-vu-dat-Viet-' + details.title.replace(/[^\p{L}\p{N}]+/gu, '-') + '.jpg', {type:blob.type});
    blobUrl = URL.createObjectURL(file);
    photo.src = blobUrl; photo.alt = details.title + '. ' + note + (details.stamp ? ' Dấu đã tìm: ' + details.stamp : ''); photo.hidden = false;
    const save = el('postcardSave'); save.href = blobUrl; save.download = file.name; save.hidden = false;
    el('postcardNote').disabled = el('postcardShare').disabled = false;
    status.textContent = '';
  }
  const printError = () => { status.textContent = 'Chưa in được ảnh. Bạn vẫn có thể gửi link điểm hẹn.'; };
  async function open(getPhoto, trip) {
    if (dialog.open) return;
    const id = ++session;
    details = trip; noteIndex = 0;
    freePrint(); el('postcardUrl').hidden = true;
    el('postcardShare').hidden = !navigator.share;
    status.textContent = 'Đang in bưu thiếp…';
    dialog.showModal();
    try {
      const art = trip.stampArt && new XMLSerializer().serializeToString(trip.stampArt);
      const [picture, mark] = await Promise.all([
        getPhoto().then(decodeBlob),
        art ? decodeBlob(new Blob([art],{type:'image/svg+xml'})).catch(()=>null) : null,
        document.fonts.load('italic 700 60px ' + display)
      ]);
      if (id !== session) return;
      image = picture; details.mark = mark; await draw();
    } catch { if (id === session) printError(); }
  }
  el('postcardNote').onclick = () => { noteIndex = (noteIndex + 1) % (1 + spareNotes.length); draw().catch(printError); };
  el('postcardLink').onclick = async () => {
    const id = session;
    try { await navigator.clipboard.writeText(details.url); if (id !== session) return; status.textContent = 'Đã sao chép link đến ' + details.title + '.'; }
    catch { if (id === session) showLink('Giữ hoặc chọn link để sao chép.'); }
  };
  el('postcardShare').onclick = async () => {
    const id = session, text = [details.note, ...spareNotes][noteIndex];
    try {
      const invitation = {title:'Bưu thiếp từ ' + details.title, text, url:details.url};
      const print = {...invitation, files:[file]};
      await navigator.share(navigator.canShare?.(print) ? print : invitation);
    } catch (e) { if (id === session && e.name !== 'AbortError') showLink('Bạn có thể tải ảnh và gửi kèm link này.'); }
  };
  el('closePostcard').onclick = () => dialog.close();
  dialog.addEventListener('close', () => { ++session; freePrint(); image = details = null; });
  return {open};
}
