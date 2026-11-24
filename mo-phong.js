/* Mô phỏng tình huống giao thông · Vi vu đất Việt
 * Phần 1: biên dịch kịch bản (thuần số học, chạy được trong Node để kiểm tra).
 * Phần 2: dựng cảnh three.js r160.   Phần 3: giao diện, chấm điểm, lưu kết quả. */
(function () {
'use strict';
const root = typeof window !== 'undefined' ? window : globalThis;
const DATA = root.MoPhongData;
const PI = Math.PI;
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const kmh = v => v / 3.6;
function rng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ═════════ 1. Kịch bản ═════════ */
const KINDS = {
  car: { L: 4.2, W: 1.75, H: 1.45, veh: 1 }, taxi: { L: 4.4, W: 1.75, H: 1.5, veh: 1 }, suv: { L: 4.6, W: 1.9, H: 1.75, veh: 1 },
  van: { L: 3.6, W: 1.55, H: 1.85, veh: 1 }, pickup: { L: 5.1, W: 1.85, H: 1.75, veh: 1, bed: .95 },
  truck: { L: 7.6, W: 2.4, H: 3.2, veh: 1, bed: 1.2 }, flatbed: { L: 7.6, W: 2.4, H: 2.6, veh: 1, bed: 1.25 },
  container: { L: 13, W: 2.5, H: 3.8, veh: 1 }, bus: { L: 10.5, W: 2.5, H: 3.1, veh: 1 }, bagac: { L: 3, W: 1.3, H: 1.6, veh: 1, bed: .85 },
  moto: { L: 1.9, W: .75, H: 1.6, veh: 1, two: 1 }, bike: { L: 1.75, W: .6, H: 1.6, veh: 1, two: 1 },
  ped: { L: .5, W: .55, H: 1.7, man: 1 }, child: { L: .4, W: .45, H: 1.15, man: 1 }, worker: { L: .5, W: .55, H: 1.7, man: 1 }, cart: { L: 1.7, W: .8, H: 1.7, man: 1 },
  dog: { L: .85, W: .3, H: .6, ani: 1 }, goat: { L: 1, W: .35, H: .8, ani: 1 }, cow: { L: 2.2, W: .8, H: 1.5, ani: 1 },
  ball: { L: .3, W: .3, H: .3, obj: 1 }, box: { L: .9, W: .9, H: .8, obj: 1 }, log: { L: .6, W: 2.6, H: .5, obj: 1 }, tyre: { L: 1, W: .4, H: 1, obj: 1 },
  rock: { L: 1.6, W: 1.6, H: 1.1, obj: 1 }, cone: { L: .4, W: .4, H: .7, obj: 1 }, tree: { L: 1, W: 6.5, H: 1.2, obj: 1 }
};
const ROAD = {
  urban: { lw: 3.3, lanes: 2, sh: .3, med: 0 }, rural: { lw: 3.4, lanes: 1, sh: 1.2, med: 0 }, highway: { lw: 3.75, lanes: 2, sh: 2.8, med: 1 },
  mountain: { lw: 3.2, lanes: 1, sh: .6, med: 0 }, national: { lw: 3.5, lanes: 2, sh: 2, med: 0 }
};
function metrics(env) {
  const m = Object.assign({}, ROAD[env.road]);
  if (env.lanes) m.lanes = env.lanes;
  if (env.road === 'urban' && env.parking) m.sh = 2.3;
  if (env.median && env.road !== 'highway') m.med = .7;
  m.run = m.med + m.lanes * m.lw; m.edge = m.run + m.sh;
  return m;
}
/* Làn → độ lệch ngang (m, dương = bên phải tim đường). */
function laneLat(m, l) {
  if (typeof l === 'number') return l === 0 ? 0 : Math.sign(l) * (m.med + (Math.abs(l) - .5) * m.lw);
  let s = 1, k = String(l);
  if (k[0] === 'x') return parseFloat(k.slice(1));
  if (k[0] === '-') { s = -1; k = k.slice(1); }
  if (k === 'sh') return s * (m.run + m.sh / 2);
  if (k === 'sw') return s * (m.edge + 1.6);
  if (k === 'far') return s * (m.edge + 14);
  return s * parseFloat(k);
}
function buildRoad(env, P, total) {
  const shape = env.shape || (env.road === 'mountain' ? 'sR' : 'straight');
  const sg = /L$/.test(shape) ? -1 : 1, pre = d => Math.max(15, Math.round(P - d));
  let segs = env.path;
  if (!segs) switch (shape.replace(/[RL]$/, '')) {
    case 'bend': segs = [[pre(95), 0], [80, 45 * sg], [total, 0]]; break;
    case 'curve': segs = [[25, 0], [total, total * .14 * sg]]; break;
    case 's': segs = [[pre(135), 0], [60, 38 * sg], [15, 0], [60, -38 * sg], [total, 0]]; break;
    case 'hair': segs = [[pre(82), 0], [56, 150 * sg], [total, 0]]; break;
    case 'hairs': segs = [[pre(175), 0], [52, 140], [45, 0], [52, -140], [total, 0]]; break;
    default: segs = [[total, 0]];
  }
  const n = total + 1, X = new Float32Array(n), Y = new Float32Array(n), Z = new Float32Array(n), H = new Float32Array(n), K = new Float32Array(n);
  let x = 0, z = 0, h = 0, i = 0;
  for (const sgm of segs) {
    const len = Math.round(sgm[0]), dk = sgm[1] * PI / 180 / len;
    for (let j = 0; j < len && i < n; j++, i++) { X[i] = x; Z[i] = z; H[i] = h; K[i] = dk; x += Math.sin(h + dk / 2); z -= Math.cos(h + dk / 2); h += dk; }
  }
  for (; i < n; i++) { X[i] = x; Z[i] = z; H[i] = h; x += Math.sin(h); z -= Math.cos(h); }
  const gr = env.grade, G = new Float32Array(n);
  for (i = 0; i < n; i++) G[i] = gr === 'up' ? .06 : gr === 'down' ? -.06 : gr === 'crest' ? (i < P - 25 ? .06 : -.06) : env.road === 'mountain' ? .03 : 0;
  let y = 0;
  for (i = 0; i < n; i++) { let a = 0, c = 0; for (let j = Math.max(0, i - 15); j <= Math.min(n - 1, i + 15); j++) { a += G[j]; c++; } Y[i] = y; y += a / c; }
  return {
    len: n, X, Y, Z, H, K,
    at(s, lat, o) {
      const u = clamp(s, 0, n - 1.001), k = u | 0, f = u - k, hh = H[k] + (H[k + 1] - H[k]) * f;
      o.x = X[k] + (X[k + 1] - X[k]) * f + Math.cos(hh) * lat; o.z = Z[k] + (Z[k + 1] - Z[k]) * f + Math.sin(hh) * lat;
      o.y = Y[k] + (Y[k + 1] - Y[k]) * f; o.h = hh; return o;
    }
  };
}
/* Tích phân một biểu đồ vận tốc tuyến tính từng đoạn [[t, v], …] → quãng đường s(t). */
function speedPath(k) {
  const n = k.length, cum = [0];
  for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + (k[i][1] + k[i - 1][1]) / 2 * (k[i][0] - k[i - 1][0]);
  return t => {
    if (t <= k[0][0]) return k[0][1] * (t - k[0][0]);
    for (let i = 1; i < n; i++) if (t <= k[i][0]) { const a = k[i - 1], b = k[i], d = t - a[0], T = b[0] - a[0], v1 = T > 0 ? a[1] + (b[1] - a[1]) * d / T : b[1]; return cum[i - 1] + (a[1] + v1) / 2 * d; }
    return cum[n - 1] + k[n - 1][1] * (t - k[n - 1][0]);
  };
}

/* Mẫu hành vi. Mỗi mẫu nhận ngữ cảnh c (v, hs, he, W, P, egoLat, lat(), m…) và tham số a,
 * trả về danh sách diễn viên có hàm p(t) → [s dọc đường, độ lệch ngang]. */
const TEMPLATES = {
  /* Chạy đều theo làn; lk: [dt0, dt1, làn mới] đổi làn quanh hazardStart. */
  flow(c, a) {
    const lat = c.lat(a.lane == null ? 1 : a.lane), dir = a.dir != null ? a.dir : (lat < 0 ? -1 : 1), v = kmh(a.v == null ? 40 : a.v) * dir, s0 = c.S0 + (a.d || 0);
    let latF = () => lat;
    if (a.lk) { const t0 = c.hs + a.lk[0], t1 = c.hs + a.lk[1], l2 = c.lat(a.lk[2]); latF = t => lerp(lat, l2, sm((t - t0) / (t1 - t0))); }
    return [Object.assign({}, a, { p: t => [s0 + v * t, latF(t)] })];
  },
  /* Đứng yên, cách điểm xung đột d mét. */
  park(c, a) {
    const s = c.P + (a.d || 0), lat = c.lat(a.lane == null ? 'sh' : a.lane);
    return [Object.assign({}, a, { parked: 1, p: () => [s, lat] })];
  },
  /* Băng ngang đường tại P: rời mép lúc hazardStart, tới làn xe mình lúc hazardEnd. */
  cross(c, a) {
    const K = KINDS[a.k], side = a.side === 'L' ? -1 : 1;
    const from = c.lat(a.from != null ? a.from : (side > 0 ? 'sw' : '-sw')), to = c.lat(a.to != null ? a.to : (side > 0 ? '-sw' : 'sw'));
    const D = Math.abs(c.egoLat - from), dir = to > from ? 1 : -1, sC = c.P + c.front + K.W / 2 + .25 + (a.ds || 0), n = a.n || 1, out = [];
    const lead = a.lead ? c.W * .3 : 0, u = D / (c.W - lead), gap = a.gap != null ? a.gap : .8;
    for (let i = 0; i < n; i++) {
      const t0 = c.hs + lead + i * gap, s = sC + i * .8;
      out.push(Object.assign({}, a, {
        hz: i === 0 && a.hz ? 1 : 0, gate: 1,
        p: t => { if (t < t0) return [a.pre === 'walk' ? s - 1.3 * (t0 - t) : s, from]; const l = from + dir * u * (t - t0); return [s, dir > 0 ? Math.min(l, to) : Math.max(l, to)]; }
      }));
    }
    if (a.lead) { const span = D + 1.4, tt = c.W * .85; out.push({ k: a.lead, tp: 'cross', noBlock: 1, spin: 1, p: t => { const q = clamp((t - c.hs) / tt, 0, 1); return [sC - .5, from + dir * span * (1 - (1 - q) * (1 - q))]; } }); }
    return out;
  },
  /* Xe từ đường nhánh / hẻm / cổng bên đường ra: join nhập làn, cross băng qua, joinOpp rẽ sang chiều ngược lại, block chắn làn; run = không dừng. */
  pullout(c, a) {
    const K = KINDS[a.k], side = a.side === 'L' ? -1 : 1, m = c.m, tgt = c.egoLat, mode = a.mode || 'join';
    const sC = c.P + c.front + K.W / 2 + .3;
    if (a.run) { const u = kmh(a.vs || 20); return [Object.assign({}, a, { p: t => [sC, tgt + side * u * (c.he - t)] })]; }
    const far = side * (m.edge + 16), stop = side * (m.edge + K.L / 2 + .6), tA = c.hs - 3.6, tB = c.hs - .5;
    const acc = a.acc || 2.2, vmax = kmh(a.vj || 30), t1 = c.hs + .55 * c.W, tv = vmax / acc, uEnd = 2 * (tgt - stop) / c.W, opp = c.lat(-1);
    const g = t => { const d = t - t1; return d <= 0 ? 0 : d < tv ? .5 * acc * d * d : .5 * acc * tv * tv + vmax * (d - tv); };
    const g2 = t => { const d = t - c.he; return d <= 0 ? 0 : d < tv ? .5 * acc * d * d : .5 * acc * tv * tv + vmax * (d - tv); };
    const sBase = mode === 'join' ? sC - g(c.he) + .6 : sC;
    return [Object.assign({}, a, {
      p: t => {
        let lat, s = sBase;
        if (t < tA) lat = far; else if (t < tB) lat = lerp(far, stop, sm((t - tA) / (tB - tA))); else if (t < c.hs) lat = stop;
        else if (t < c.he) { const q = (t - c.hs) / c.W; lat = stop + (tgt - stop) * q * q; }
        else if (mode === 'cross') { lat = tgt + uEnd * (t - c.he); lat = side > 0 ? Math.max(lat, -(m.edge + 18)) : Math.min(lat, m.edge + 18); }
        else if (mode === 'joinOpp') { lat = lerp(tgt, opp, sm((t - c.he) / (.6 * c.W))); s = sC - g2(t); }
        else lat = tgt;
        if (mode === 'join') s = sBase + g(t);
        return [s, lat];
      }
    })];
  },
  /* Xe cùng làn phía trước phanh gấp lúc hazardStart. then: stop | go | turnR | turnL | skid. */
  brake(c, a) {
    const K = KINDS[a.k], vL = kmh(a.vL == null ? c.vK : a.vL), to = kmh(a.to || 0), aL = a.aL || 6, td = c.hs + (vL - to) / aL;
    const knots = [[0, vL], [c.hs, vL]]; if (td > c.hs) knots.push([td, to]);
    const tHold = Math.max(td, c.he) + (a.hold == null ? 1.5 : a.hold);
    if (a.then === 'go') knots.push([tHold, to], [tHold + 4, Math.max(vL, kmh(30))]);
    const sp = speedPath(knots), anchor = c.P + c.front + K.L / 2 - sp(c.he), lat0 = c.egoLat;
    let latF = () => lat0, ind;
    if (a.then === 'turnR' || a.then === 'turnL') {
      const sd = a.then === 'turnR' ? 1 : -1, t0 = Math.max(td, c.he + .4), far = sd * (c.m.edge + 14);
      latF = t => lerp(lat0, far, sm((t - t0) / 3.2)); if (a.sig) ind = [c.hs, t0 + 3, sd > 0 ? 'R' : 'L'];
    } else if (a.then === 'skid') {
      const span = Math.max(.5, td - c.hs);
      latF = t => t <= c.hs ? lat0 : lat0 + Math.sin((t - c.hs) * 3) * .95 * sm((t - c.hs) / .6) * clamp((td - t) / span * 1.5, 0, 1);
    }
    return [Object.assign({}, a, { ind, p: t => [anchor + sp(t), latF(t)] })];
  },
  /* Xe ở làn bên (hoặc lề, vỉa hè) tạt vào làn xe mình. vPre > tốc độ mình = vượt lên rồi tạt đầu. thru: đi tiếp sang làn khác. */
  cutin(c, a) {
    const K = KINDS[a.k], side = a.side === 'L' ? -1 : 1;
    const from = c.lat(a.from != null ? a.from : (c.egoLane + side) || -1);
    const vc = kmh(a.vc != null ? a.vc : Math.max(8, c.vK - 15)), vPre = kmh(a.vPre != null ? a.vPre : (a.vc != null ? a.vc : Math.max(8, c.vK - 15))), vEnd = a.after != null ? kmh(a.after) : vc;
    const tl = (a.tl || .6) * c.W, sp = speedPath([[0, vPre], [c.hs, vPre], [c.hs + .5 * c.W, vc], [c.he, vc], [c.he + 2, vEnd]]);
    const anchor = c.P + c.front + K.L / 2 - sp(c.he), thru = a.thru != null ? c.lat(a.thru) : null;
    return [Object.assign({}, a, {
      ind: a.sig ? [c.hs - .2, c.hs + tl, side > 0 ? 'L' : 'R'] : undefined,
      p: t => { let l = lerp(from, c.egoLat, sm((t - c.hs) / tl)); if (thru != null && t > c.he + .2) l = lerp(c.egoLat, thru, sm((t - c.he - .2) / 2.5)); return [anchor + sp(t), l]; }
    })];
  },
  /* Xe ngược chiều lấn sang làn xe mình (vượt xe khác, cắt cua…). victim: xe bị vượt. back: true trở về làn, 'turn' rẽ ngang qua, false ở lại. */
  oncoming(c, a) {
    const K = KINDS[a.k], vo = kmh(a.vo || 40), from = c.lat(a.from != null ? a.from : -1), sHit = c.P + c.front + K.L / 2, out = [];
    const sgn = Math.sign(from - c.egoLat), back = a.back == null ? true : a.back;
    const tgt = (sgn === 0 || back === 'turn' || a.stop) ? c.egoLat : c.egoLat + sgn * (.9 + K.W / 2 - (a.bite == null ? .55 : a.bite));
    const esc = a.esc != null ? c.lat(a.esc) : from, dec = vo / c.W;
    const sF = t => {
      if (a.stop) return t < c.hs ? sHit + .5 * dec * c.W * c.W + vo * (c.hs - t) : t < c.he ? sHit + .5 * dec * (c.he - t) * (c.he - t) : sHit;
      if (back === 'turn' && t > c.he) { const d = Math.min(t - c.he, 1.2); return sHit - vo * d * (1 - d / 2.4); }
      return sHit + vo * (c.he - t);
    };
    const uT = (tgt - from) / Math.pow(c.W, 2.2), far = c.m.edge + 18;
    const latF = t => {
      if (t < c.hs) return from;
      if (back === 'turn') { const q = t - c.hs; return t < c.he ? from + uT * Math.pow(q, 2.2) : Math.min(far, tgt + 2.2 * (tgt - from) / c.W * (t - c.he)); }
      let l = lerp(from, tgt, sm((t - c.hs) / (.55 * c.W)));
      if (back === true && t > c.he - .1) l = lerp(tgt, esc, sm((t - (c.he - .1)) / (a.backT || .8)));
      return l;
    };
    out.push(Object.assign({}, a, {
      rev: a.rev ? [0, 1e9] : undefined, fallen: a.fallen ? c.hs + .55 * c.W : undefined,
      ind: back === 'turn' ? [c.hs - 1, c.he + 2, 'L'] : undefined, p: t => [sF(t), latF(t)]
    }));
    if (a.victim) {
      const KV = KINDS[a.victim.k], vv = kmh(a.victim.v || 0), s0 = sF(c.hs) - K.L / 2 - (a.victim.gap == null ? 6 : a.victim.gap) - KV.L / 2;
      out.push({ k: a.victim.k, tp: 'oncoming', parked: !vv, face: vv ? undefined : 180, p: t => [s0 - vv * (t - c.hs), from] });
    }
    return out;
  },
  /* Xe đỗ mở cửa phía lòng đường, người bước ra. */
  door(c, a) {
    const k = a.k || 'car', K = KINDS[k], side = a.side === 'L' ? -1 : 1, lat = c.egoLat + side * (a.off || 2.7);
    const sP = c.P + c.front + .5, sCar = sP - .35, t0 = c.hs + .3 * c.W, l0 = lat - side * (K.W / 2 + .1), l1 = lat - side * (K.W / 2 + 1.05), walk = K.L / 2 + 1.3;
    return [
      { k, tp: 'door', parked: 1, door: [c.hs, c.hs + .4 * c.W, side > 0 ? 'L' : 'R'], lit: [0, c.hs - .4], p: () => [sCar, lat] },
      {
        k: 'ped', tp: 'door', hz: a.hz, gate: 1, vis: t => t > t0,
        p: t => {
          if (t < c.he) return [sP, lerp(l0, l1, sm((t - t0) / (c.he - t0)))];
          const q = (t - c.he) * 1.2; if (q < walk) return [sP - q, l1];
          return [sP - walk, lerp(l1, lat + side * 2.6, sm((q - walk) / 3.5))];
        }
      }
    ];
  },
  /* Hàng rơi từ xe chở hàng chạy phía trước. */
  fall(c, a) {
    const k = a.k || 'flatbed', K = KINDS[k], ob = a.obj || 'box', O = KINDS[ob], vt = kmh(a.vt == null ? c.vK : a.vt), fr = a.fr || 7;
    const ts = Math.min(c.W, vt / fr), slide = vt * ts - .5 * fr * ts * ts, sRel = c.P + c.front + O.L / 2 + .2 - slide, sT0 = sRel + K.L / 2 - .6 - vt * c.hs, bed = K.bed || 1;
    return [
      Object.assign({}, a, { hz: 0, load: ob, p: t => [sT0 + vt * t, c.egoLat] }),
      {
        k: ob, tp: 'fall', hz: a.hz, gate: 1, spin: 1,
        p: t => { if (t < c.hs) return [sT0 + vt * t - K.L / 2 + .6, c.egoLat]; const q = Math.min(t - c.hs, ts); return [sRel + vt * q - .5 * fr * q * q, c.egoLat + (a.drift || .3) * Math.min(1, (t - c.hs) / ts)]; },
        y: t => { if (t < c.hs) return bed; const q = t - c.hs; if (q < .5) return bed * (1 - q * q * 4); const b = q - .5; return b < .5 ? .3 * Math.sin(b * 2 * PI) : 0; }
      }
    ];
  },
  /* Chướng ngại đứng yên trong làn (xe hỏng, đá lở, cây đổ, chóp nón…), lộ ra khi vào tầm nhìn. */
  obstacle(c, a) {
    const K = KINDS[a.k], lat = a.lane != null ? c.lat(a.lane) : c.egoLat, ang = (a.face || 0) * PI / 180;
    const half = Math.abs(Math.cos(ang)) * K.L / 2 + Math.abs(Math.sin(ang)) * K.W / 2, s = c.P + c.front + half, out = [];
    out.push(Object.assign({}, a, { parked: 1, p: () => [s, lat] }));
    for (let i = 1; i <= (a.n || 0); i++) {
      const dl = a.k === 'cone' ? -1.2 + i * .45 : (i % 2 ? .9 : -.8), ds = i * (a.sp || 3);
      out.push({ k: a.nk || a.k, tp: 'obstacle', parked: 1, face: i * 47, p: () => [s + ds, lat + dl] });
    }
    if (a.with) out.push({ k: a.with, tp: 'obstacle', parked: 1, face: 200, p: () => [s + half + 1.4, lat + K.W / 2 + .75] });
    return out;
  },
  /* Xe đang dừng bên lề quay đầu cắt ngang đường. */
  uturn(c, a) {
    const K = KINDS[a.k], from = c.lat(a.from != null ? a.from : 'sh'), opp = c.lat(a.to != null ? a.to : -1), tgt = c.egoLat;
    const sMid = c.P + c.front + K.W / 2 + .4 + (K.L - K.W) / 4, s0 = sMid - 4.5, t2 = c.he + .7 * c.W, v2 = 6 / (t2 - c.he);
    return [Object.assign({}, a, {
      ind: [c.hs - 1.2, t2 + 1, 'L'],
      p: t => {
        if (t < c.hs) return [s0, from];
        if (t < c.he) { const q = (t - c.hs) / c.W; return [s0 + 4.5 * Math.sin(q * PI / 2), lerp(from, tgt, q * q)]; }
        if (t < t2) { const q = (t - c.he) / (t2 - c.he); return [sMid - 3 * q * q, tgt + (opp - tgt) * (1 - (1 - q) * (1 - q))]; }
        const d = t - t2; return [sMid - 3 - v2 * d - d * d, opp];
      }
    })];
  },
  /* Xe lùi từ cổng nhà / chỗ đỗ vuông góc ra làn xe mình rồi mới đi tiếp. */
  reverse(c, a) {
    const K = KINDS[a.k], side = a.side === 'L' ? -1 : 1, tgt = c.egoLat + side * .3, home = side * (c.m.edge + K.L / 2 + 1.2);
    const sEnd = c.P + c.front + K.L * .3 + K.W * .2 + .3, tS0 = c.hs + .25 * c.W, tS = c.he + .5, tGo = tS + (a.wait == null ? 1.3 : a.wait);
    return [Object.assign({}, a, {
      rev: [0, tGo],
      p: t => {
        const lat = t < c.hs ? home : lerp(home, tgt, sm((t - c.hs) / (c.W + .3)));
        const s = t < tS0 ? sEnd + 4 : t < tS ? sEnd + 4 - 4 * sm((t - tS0) / (tS - tS0)) : t < tGo ? sEnd : sEnd + (t - tGo) * (t - tGo);
        return [s, lat];
      }
    })];
  }
};

const FPS = 30, S0 = 20, EGO_HALF = 2.2, EGO_HW = .9;
function sample(C, A) {
  const N = C.N, o = {}, K = A.K = KINDS[A.k];
  if (!K) throw new Error('Loại diễn viên lạ: ' + A.k);
  const S = A.S = new Float32Array(N), LT = A.LT = new Float32Array(N), X = A.X = new Float32Array(N), Y = A.Y = new Float32Array(N), Z = A.Z = new Float32Array(N);
  const HD = A.HD = new Float32Array(N), RH = A.RH = new Float32Array(N), VS = A.VS = new Float32Array(N), SP = A.SP = new Float32Array(N), DI = A.DI = new Float32Array(N), RD = new Float32Array(N);
  A.BR = new Uint8Array(N); A.VI = A.vis ? new Uint8Array(N) : null;
  for (let i = 0; i < N; i++) {
    const t = i / FPS, q = A.p(t); S[i] = q[0]; LT[i] = q[1]; C.road.at(q[0], q[1], o);
    X[i] = o.x; Z[i] = o.z; Y[i] = o.y + (A.y ? A.y(t) : 0); RD[i] = o.h; if (A.VI) A.VI[i] = A.vis(t) ? 1 : 0;
  }
  let prev = NaN, first = -1, moved = false;
  for (let i = 0; i < N; i++) {
    const a = Math.max(0, i - 1), b = Math.min(N - 1, i + 1), dt = (b - a) / FPS, dx = X[b] - X[a], dz = Z[b] - Z[a], sp = Math.hypot(dx, dz) / dt;
    SP[i] = sp; VS[i] = (S[b] - S[a]) / dt; DI[i] = i ? DI[i - 1] + sp / FPS : 0;
    if (sp > .25) {
      let h = Math.atan2(dx, -dz); const t = i / FPS;
      if (A.rev && t >= A.rev[0] && t <= A.rev[1]) h += PI;
      if (!isNaN(prev)) { while (h - prev > PI) h -= 2 * PI; while (h - prev < -PI) h += 2 * PI; }
      if (first < 0) first = i; HD[i] = h; prev = h;
    } else HD[i] = prev;
  }
  const flip = K.veh && LT[0] < 0 ? PI : 0, face = A.face != null ? A.face * PI / 180 : 0;
  if (first < 0) for (let i = 0; i < N; i++) HD[i] = RD[i] + (A.face != null ? face : flip);
  else for (let i = 0; i < first; i++) HD[i] = HD[first];
  for (let i = 1; i < N; i++) HD[i] = HD[i - 1] + clamp(HD[i] - HD[i - 1], -.15, .15);
  for (let i = 0; i < N; i++) {
    RH[i] = HD[i] - RD[i]; if (SP[i] > 1) moved = true;
    const t = i / FPS, j = Math.min(N - 1, i + 6);
    if (K.veh) A.BR[i] = (SP[j] - SP[i] < -.26) || (moved && !A.parked && SP[i] < .3 && Math.abs(LT[i]) < C.m.run) || (A.lit && t >= A.lit[0] && t <= A.lit[1]) ? 1 : 0;
  }
  return A;
}
function extents(A, i, o) {
  const c = Math.abs(Math.cos(A.RH[i])), s = Math.abs(Math.sin(A.RH[i]));
  o.hs = c * A.K.L / 2 + s * A.K.W / 2; o.hl = s * A.K.L / 2 + c * A.K.W / 2; return o;
}
function clash(C, A, B) {
  const ra = A.amb || A.tp === 'flow' || A.tp === 'park' ? 0 : Math.max(A.K.L, A.K.W) / 2, rb = B.amb || B.tp === 'flow' || B.tp === 'park' ? 0 : Math.max(B.K.L, B.K.W) / 2;
  const ls = (ra || A.K.L / 2) + (rb || B.K.L / 2) + 3, ll = (ra || A.K.W / 2) + (rb || B.K.W / 2) + .6;
  for (let i = 0; i < C.N; i += 5) if (Math.abs(A.S[i] - B.S[i]) < ls && Math.abs(A.LT[i] - B.LT[i]) < ll) return true;
  return false;
}
/* Xe và người nền, sinh theo hạt giống của tình huống; loại bỏ mọi ứng viên chạm vào diễn viên đã có. */
function ambient(C) {
  const env = C.sc.env, m = C.m, r = C.rnd, d = env.traffic == null ? 1 : env.traffic, reach = C.S0 + C.v * C.dur;
  const pick = a => a[(r() * a.length) | 0], R = (a, b) => a + (b - a) * r();
  const cfg = {
    urban: { on: 2, vo: [25, 40], mix: ['moto', 'moto', 'car', 'taxi', 'moto', 'van', 'bike', 'car'] }, rural: { on: 1, vo: [35, 55], mix: ['moto', 'car', 'truck', 'moto'] },
    highway: { on: 3, vo: [80, 110], mix: ['car', 'suv', 'truck', 'container', 'bus', 'van', 'car'] }, mountain: { on: 1, vo: [25, 35], mix: ['moto', 'car', 'truck'] },
    national: { on: 2, vo: [50, 70], mix: ['car', 'truck', 'bus', 'moto', 'container', 'suv'] }
  }[env.road];
  const add = a => {
    const sp = TEMPLATES[a.tp](C.ctx, a)[0]; sp.amb = 1; sample(C, sp);
    for (const B of C.actors) if (clash(C, sp, B)) return false;
    if (!sp.far) for (let i = 0; i < C.N; i += 5) { const su = C.S0 + C.v * i / FPS; if (Math.abs(sp.LT[i] - C.egoLat) < 2.6 && sp.S[i] > su - 7 && sp.S[i] < su + 38) return false; }
    C.actors.push(sp); return true;
  };
  const some = (n, f) => { let ok = 0; for (let i = 0; i < n * 3 && ok < n; i++) if (add(f())) ok++; };
  some(cfg.on + d, () => { const k = pick(cfg.mix), vo = R(cfg.vo[0], cfg.vo[1]) * (KINDS[k].L > 7 ? .85 : 1); return { tp: 'flow', k, lane: -(1 + ((r() * m.lanes) | 0)), v: vo, d: R(50, reach + kmh(vo) * C.dur * .8 + 60) }; });
  if (m.lanes > 1) some(1 + d, () => {
    let lane = 1 + ((r() * m.lanes) | 0); if (lane === C.egoLane) lane = lane % m.lanes + 1;
    const fast = lane < C.egoLane, v = Math.max(12, C.vK + (fast ? R(6, 20) : -R(8, 22)));
    const k = env.road === 'urban' && lane === m.lanes ? pick(['moto', 'moto', 'bike', 'car']) : env.road === 'highway' && lane === m.lanes ? pick(['truck', 'container', 'bus', 'car']) : pick(cfg.mix);
    return { tp: 'flow', k, lane, v: KINDS[k].two && k === 'bike' ? Math.min(v, 16) : v, d: fast ? R(-18, 50) : R(25, 150) };
  });
  if (d > 0 && r() < .6) add({ tp: 'flow', k: pick(['car', 'suv', 'taxi', 'van']), lane: C.egoLane, v: C.vK + R(7, 14), d: R(48, 85), far: 1 });
  if (env.road === 'rural' || env.road === 'national') some(d, () => { const k = pick(['moto', 'bike', 'moto']); return { tp: 'flow', k, lane: 'sh', v: k === 'bike' ? R(11, 15) : R(18, 30), d: R(30, reach) }; });
  if (env.road === 'urban') {
    if (env.parking) some(4 + 3 * d, () => ({ tp: 'park', k: pick(['car', 'car', 'suv', 'van', 'taxi']), lane: r() < .5 ? 'sh' : '-sh', d: R(-C.P + 30, reach - C.P + 140) }));
    some(3 + 2 * d, () => { const sd = r() < .5 ? -1 : 1, dir = r() < .5 ? -1 : 1; return { tp: 'flow', k: r() < .15 ? 'child' : 'ped', lane: 'x' + (sd * (m.edge + 1.6 + R(-.8, .9))).toFixed(2), v: R(3.5, 5), dir, d: R(15, reach + 90) }; });
  } else if (env.road !== 'highway' && env.road !== 'mountain') {
    some(1 + d, () => ({ tp: 'park', k: 'ped', lane: r() < .5 ? 'sw' : '-sw', d: R(-C.P + 40, reach - C.P + 100), face: R(0, 360) }));
  }
}
/* Người lái mô phỏng: chạy đều, sau thời gian phản ứng thì phanh vừa đủ để không chạm mối nguy. Tính sẵn ở 60 Hz. */
function simEgo(C) {
  const dt = 1 / 60, n = Math.ceil(C.dur * 60) + 3, ES = C.ES = new Float32Array(n), EV = C.EV = new Float32Array(n), e = {};
  const gate = C.hs + (C.sc.react == null ? .42 : C.sc.react) * C.W, amax = C.sc.amax || 9.5;
  let s = C.S0, v = C.v;
  for (let i = 0; i < n; i++) {
    const t = i * dt; ES[i] = s; EV[i] = v; let need = 0;
    for (const A of C.actors) {
      if (A.noBlock || ((A.hz || A.gate) && t < gate)) continue;
      for (let j = 0; j <= 8; j++) {
        const tau = j * .4, k = Math.min(C.N - 1, Math.round((t + tau) * FPS));
        if (A.VI && !A.VI[k]) continue;
        extents(A, k, e);
        if (Math.abs(A.LT[k] - C.egoLat) > 1 + e.hl + .3 || A.S[k] + e.hs < s - EGO_HALF) continue;
        const d = A.S[k] - e.hs - (s + EGO_HALF) - 1.6; let a = 0;
        if (tau === 0) { if (d <= 0) a = amax; else { const cl = v - A.VS[k]; a = cl > 0 ? cl * cl / (2 * d) : 0; } }
        else { const tr = v * tau; if (tr > d) { if (d <= 0) a = amax; else { a = 2 * (tr - d) / (tau * tau); if (a > v / tau) a = v * v / (2 * d); } } }
        if (a > need) need = a;
      }
    }
    const acc = need > .35 ? -Math.min(amax, need * 1.12 + .2) : (v < C.v ? 1.6 : 0);
    v = clamp(v + acc * dt, 0, C.v); s += v * dt;
  }
}
function compile(sc) {
  const env = sc.env, m = metrics(env), v = kmh(sc.v), hs = sc.hazardStart, he = sc.hazardEnd, W = he - hs, P = S0 + v * he, dur = sc.dur;
  const total = Math.ceil(S0 + v * dur + 230), road = buildRoad(env, P, total), egoLane = sc.lane || 1, egoLat = laneLat(m, egoLane);
  const C = { sc, env, m, v, vK: sc.v, hs, he, W, P, S0, dur, road, egoLane, egoLat, N: Math.ceil(dur * FPS) + 2, actors: [], rnd: rng(hash(sc.id)) };
  C.ctx = { v, vK: sc.v, hs, he, W, P, S0, m, egoLane, egoLat, front: EGO_HALF, dur, lat: tok => laneLat(m, tok) };
  C.jn = (env.jn || []).map(j => ({ sd: j.side === 'L' ? -1 : 1, at: P + 3.3 + (j.at || 0), w: j.w || 7 }));
  const needJn = (sd, at, w) => { if (!C.jn.some(j => j.sd === sd && Math.abs(j.at - at) < 8)) C.jn.push({ sd, at, w }); };
  for (const a of sc.a) {
    const f = TEMPLATES[a.tp]; if (!f) throw new Error('Mẫu hành vi lạ: ' + a.tp);
    for (const sp of f(C.ctx, a)) C.actors.push(sample(C, sp));
    const K = KINDS[a.k] || KINDS.car, sd = a.side === 'L' ? -1 : 1;
    if (a.tp === 'pullout' || a.tp === 'reverse') needJn(sd, P + 3.3, K.L > 6 ? 11 : 7);
    if (a.tp === 'brake' && (a.then === 'turnR' || a.then === 'turnL')) needJn(a.then === 'turnR' ? 1 : -1, P + EGO_HALF + K.L / 2 + 5, 10);
    if (a.tp === 'oncoming' && a.back === 'turn') needJn(1, P + 2.2, 9);
  }
  C.hz = C.actors.filter(A => A.hz);
  ambient(C); simEgo(C);
  C.egoAt = (t, o) => { const u = clamp(t * 60, 0, C.ES.length - 2), i = u | 0, f = u - i; o.s = lerp(C.ES[i], C.ES[i + 1], f); o.v = lerp(C.EV[i], C.EV[i + 1], f); o.acc = (C.EV[i + 1] - C.EV[i]) * 60; return o; };
  const iH = Math.round(hs * FPS); C.distHs = C.hz.length ? Math.max(5, C.hz[0].S[iH] - (S0 + v * hs)) : 60;
  C.fogFar = env.vis || clamp(C.distHs * 1.3 + 8, 40, 170);
  return C;
}
/* Số liệu kiểm tra: thời điểm va chạm nếu không phanh, và có chạm khi xe mình phanh theo mô hình hay không. */
function analyze(C) {
  const e = {}, o = {}; let tC = null, hit = null, minGap = 1e9;
  for (let i = 0; i < C.N; i++) {
    const t = i / FPS, su = C.S0 + C.v * t; C.egoAt(t, o);
    for (const A of C.actors) {
      if (A.noBlock || (A.VI && !A.VI[i])) continue; extents(A, i, e);
      if (Math.abs(A.LT[i] - C.egoLat) >= EGO_HW + e.hl) continue;
      if (A.hz && tC == null && Math.abs(A.S[i] - su) < EGO_HALF + e.hs) tC = t;
      const gap = Math.abs(A.S[i] - o.s) - EGO_HALF - e.hs;
      if (A.S[i] > o.s - 1 && gap < minGap) minGap = gap;
      if (gap < 0 && !hit) hit = { t, k: A.k, tp: A.tp };
    }
  }
  return { tC, hit, minGap, distHs: C.distHs, endV: C.EV[Math.min(C.EV.length - 1, Math.round(C.dur * 60))] };
}
function scoreAt(t, hs, he) { if (t == null || t < hs || t > he) return 0; return 5 - Math.min(4, Math.floor((t - hs) / ((he - hs) / 5))); }
root.MoPhongEngine = { templateNames: Object.keys(TEMPLATES), kinds: Object.keys(KINDS), compile, analyze, scoreAt };
if (typeof document === 'undefined' || !DATA) return;

/* ═════════ 2. Dựng cảnh ═════════ */
const THREE = root.THREE;
const col3 = {}; function rgb(hex) { if (!col3[hex]) { const c = new THREE.Color(hex); col3[hex] = [c.r, c.g, c.b]; } return col3[hex]; }
class Col {
  constructor() { this.p = []; this.c = []; this.u = []; this.i = []; this.n = 0; }
  quad(a, b, c, d, color, uv) {
    const k = this.n, cl = rgb(color); this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2], d[0], d[1], d[2]);
    for (let j = 0; j < 4; j++) this.c.push(cl[0], cl[1], cl[2]);
    if (uv) this.u.push(uv[0], uv[1], uv[2], uv[1], uv[2], uv[3], uv[0], uv[3]); else this.u.push(.02, .02, .02, .02, .02, .02, .02, .02);
    this.i.push(k, k + 1, k + 2, k, k + 2, k + 3); this.n += 4;
  }
  tri(a, b, c, color) { const k = this.n, cl = rgb(color); this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); for (let j = 0; j < 3; j++) { this.c.push(cl[0], cl[1], cl[2]); this.u.push(.02, .02); } this.i.push(k, k + 1, k + 2); this.n += 3; }
  mesh(mat, own) {
    if (!this.n) return null; const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(this.u, 2));
    g.setIndex(this.i); g.computeVertexNormals(); own.push(g); return new THREE.Mesh(g, mat);
  }
}
/* Hộp định hướng theo hướng đường h; (cx, cy, cz) là tâm đáy; ls dọc đường, ll ngang đường. */
function obox(col, cx, cy, cz, h, ls, ll, ht, color, uvs, topColor) {
  const fx = Math.sin(h) * ls / 2, fz = -Math.cos(h) * ls / 2, rx = Math.cos(h) * ll / 2, rz = Math.sin(h) * ll / 2, y1 = cy + ht;
  const p = [[cx - fx - rx, cz - fz - rz], [cx - fx + rx, cz - fz + rz], [cx + fx + rx, cz + fz + rz], [cx + fx - rx, cz + fz - rz]];
  for (let k = 0; k < 4; k++) {
    const a = p[k], b = p[(k + 1) % 4], w = k % 2 ? ls : ll;
    col.quad([a[0], cy, a[1]], [b[0], cy, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], color, uvs ? [0, 0, w / uvs[0], ht / uvs[1]] : null);
  }
  col.quad([p[0][0], y1, p[0][1]], [p[1][0], y1, p[1][1]], [p[2][0], y1, p[2][1]], [p[3][0], y1, p[3][1]], topColor || color);
}
function blob(col, x, y, z, r, h, color, seg) {
  seg = seg || 6; const ym = y + h * .42;
  for (let k = 0; k < seg; k++) {
    const a0 = k / seg * 2 * PI, a1 = (k + 1) / seg * 2 * PI, p0 = [x + Math.cos(a0) * r, ym, z + Math.sin(a0) * r], p1 = [x + Math.cos(a1) * r, ym, z + Math.sin(a1) * r];
    col.tri(p0, p1, [x, y + h, z], color); col.tri(p1, p0, [x, y, z], color);
  }
}
let TEX = null;
function textures() {
  if (TEX) return TEX;
  const r = rng(77), n = 64, day = new Uint8Array(n * n * 4), night = new Uint8Array(n * n * 4), lit = [];
  for (let k = 0; k < 16; k++) lit.push(r() < .42);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const cx = x % 16, cy = y % 16, win = cx >= 4 && cx <= 11 && cy >= 4 && cy <= 12, o = (y * n + x) * 4, cell = (y >> 4) * 4 + (x >> 4);
    const sh = win ? 0 : 228 + ((x * 7 + y * 13) % 5) * 5;
    day[o] = win ? 62 : sh; day[o + 1] = win ? 82 : sh; day[o + 2] = win ? 104 : sh; day[o + 3] = 255;
    const on = win && lit[cell]; night[o] = on ? 255 : 0; night[o + 1] = on ? 205 : 0; night[o + 2] = on ? 128 : 0; night[o + 3] = 255;
  }
  const mk = d => { const t = new THREE.DataTexture(d, n, n, THREE.RGBAFormat); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.needsUpdate = true; return t; };
  const gs = 32, gd = new Uint8Array(gs * gs * 4);
  for (let y = 0; y < gs; y++) for (let x = 0; x < gs; x++) { const d = Math.hypot(x - 15.5, y - 15.5) / 15.5, a = Math.pow(clamp(1 - d, 0, 1), 2.2), o = (y * gs + x) * 4; gd[o] = gd[o + 1] = gd[o + 2] = 255; gd[o + 3] = Math.round(a * 255); }
  const glow = new THREE.DataTexture(gd, gs, gs, THREE.RGBAFormat); glow.magFilter = THREE.LinearFilter; glow.minFilter = THREE.LinearFilter; glow.needsUpdate = true;
  return (TEX = { day: mk(day), night: mk(night), glow });
}
const SKY = {
  day: { top: 0x4f8fd8, hor: 0xbcd6ee, fog: 0xbcd6ee, near: 120, far: 620, hemi: 1.05, sun: 2.6, sunC: 0xfff0d8, el: .9 },
  dawn: { top: 0x7396c4, hor: 0xf0c9a2, fog: 0xe3cbb2, near: 90, far: 480, hemi: .8, sun: 1.5, sunC: 0xffc890, el: .3 },
  dusk: { top: 0x34416e, hor: 0xd98a5c, fog: 0x8e7470, near: 70, far: 400, hemi: .5, sun: .9, sunC: 0xff9a60, el: .22 },
  night: { top: 0x04060c, hor: 0x0c121f, fog: 0x090d15, near: 25, far: 200, hemi: .26, sun: .12, sunC: 0x8fa8ff, el: .7 }
};
let GEO = null;
function geos() { return GEO || (GEO = { box: new THREE.BoxGeometry(1, 1, 1), cyl: new THREE.CylinderGeometry(.5, .5, 1, 12), sph: new THREE.SphereGeometry(.5, 10, 7), cone: new THREE.ConeGeometry(.5, 1, 10), rock: new THREE.DodecahedronGeometry(.5) }); }
const MODELS = { car: 'traffic/hatchback.glb', van: 'traffic/kei-van.glb', taxi: 'streetscape/city-taxi.glb' }, modelCache = {};
function loadModel(kind) {
  const url = MODELS[kind]; if (!url || !root.TrafficModels) return null;
  if (!modelCache[url]) { try { modelCache[url] = root.TrafficModels.load.loadAsync(url).then(g => g.scene); modelCache[url].catch(() => {}); } catch (err) { return null; } }
  return modelCache[url];
}
const CAR_COLORS = [0xd8d8d2, 0x2f3338, 0x8f1d1d, 0x1f4f8a, 0x9aa3ab, 0xf2f2ee, 0x4d5a3a, 0xb8802c, 0x5a2d2d, 0x1a1c20];
const SHIRTS = [0xc94f3d, 0x2e6fb0, 0xe0b23c, 0x4d8f5a, 0xe8e4da, 0x7a4fa0, 0x30343a, 0xd97a9a];

function buildWorld(C, onModel) {
  const env = C.env, m = C.m, road = C.road, own = [], r = rng(hash(C.sc.id) ^ 0x9e3779b9), R = (a, b) => a + (b - a) * r(), G = geos(), T = textures();
  const scene = new THREE.Scene(), night = env.tod === 'night', dim = night || env.tod === 'dusk', wet = env.wx === 'rain', foggy = env.wx === 'fog', lampsOn = dim || foggy || wet;
  const sky = Object.assign({}, SKY[env.tod]);
  if (wet) { sky.fog = night ? 0x0b0e14 : env.tod === 'day' ? 0x8f989f : 0x6f6b70; sky.hor = sky.fog; sky.top = night ? 0x05070b : 0x69737c; sky.far *= .55; sky.near *= .5; sky.hemi *= .8; sky.sun *= .4; }
  if (foggy) { sky.fog = night ? 0x191d23 : env.tod === 'day' ? 0xc6cbce : 0xb9b4b0; sky.hor = sky.top = sky.fog; sky.near = 4; sky.far = C.fogFar; sky.sun *= .35; sky.hemi *= night ? 1.5 : .95; }
  if (night && env.road === 'urban') { sky.hemi = .32; sky.far = 260; }
  if (env.road === 'mountain' && !wet && !foggy && !night) sky.far *= 1.5;
  scene.background = new THREE.Color(sky.fog); scene.fog = new THREE.Fog(sky.fog, sky.near, sky.far);
  scene.add(new THREE.HemisphereLight(night ? 0x8fa2c8 : 0xd4e4ff, night ? 0x20242c : 0x8a8068, sky.hemi));
  const sun = new THREE.DirectionalLight(sky.sunC, sky.sun); sun.position.set(-.5, sky.el, .35); scene.add(sun);
  const camera = new THREE.PerspectiveCamera(58, 16 / 9, .3, 1600); scene.add(camera);
  const mats = {}, M = (hex, o) => { const k = hex + (o || ''); if (!mats[k]) { mats[k] = o === 'b' ? new THREE.MeshBasicMaterial({ color: hex }) : new THREE.MeshLambertMaterial({ color: hex }); own.push(mats[k]); } return mats[k]; };
  const mk = mat => { own.push(mat); return mat; };
  /* bầu trời */
  if (!foggy) {
    const sg = new THREE.SphereGeometry(1200, 16, 10), pa = sg.attributes.position, cs = [], ct = new THREE.Color(sky.top), ch = new THREE.Color(sky.hor), cc = new THREE.Color();
    for (let i = 0; i < pa.count; i++) { cc.copy(ch).lerp(ct, Math.pow(clamp(pa.getY(i) / 1200, 0, 1), .55)); cs.push(cc.r, cc.g, cc.b); }
    sg.setAttribute('color', new THREE.Float32BufferAttribute(cs, 3)); own.push(sg);
    var dome = new THREE.Mesh(sg, mk(new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }))); dome.renderOrder = -1; dome.frustumCulled = false; scene.add(dome);
  }
  /* ─── tĩnh vật ─── */
  const A = new Col(), Mk = new Col(), Gl = new Col(), B = new Col(), Pool = new Col(), o = {}, Lr = road.len - 2;
  const pt = (s, lat, y, safe) => {
    if (safe) { const k = road.K[clamp(s | 0, 0, road.len - 1)]; if (k !== 0) { const lim = .9 / Math.abs(k) - 1; if (Math.sign(lat) === Math.sign(k) && Math.abs(lat) > lim) lat = Math.sign(lat) * lim; } }
    road.at(s, lat, o); return [o.x, o.y + y, o.z];
  };
  const rib = (col, s0, s1, la, ya, lb, yb, color, step, safe) => {
    step = step || 2; s0 = Math.max(0, s0); s1 = Math.min(Lr, s1); if (s1 <= s0) return;
    let a = pt(s0, la, ya, safe), b = pt(s0, lb, yb, safe);
    for (let s = s0; s < s1 - 1e-6;) { const s2 = Math.min(s1, s + step), c = pt(s2, lb, yb, safe), d = pt(s2, la, ya, safe); col.quad(a, b, c, d, color); a = d; b = c; s = s2; }
  };
  const spans = (sd, s0, s1) => { let out = [[s0, s1]]; for (const j of C.jn) if (j.sd === sd) { const a = j.at - j.w / 2, b = j.at + j.w / 2, nx = []; for (const q of out) { if (b <= q[0] || a >= q[1]) nx.push(q); else { if (a > q[0]) nx.push([q[0], a]); if (b < q[1]) nx.push([b, q[1]]); } } out = nx; } return out; };
  const dashed = (lat, w, color, on, off) => { for (let s = 2; s < Lr; s += on + off) rib(Mk, s, s + on, lat - w / 2, .02, lat + w / 2, .02, color, 3); };
  const box = (col, s, lat, y, ls, ll, ht, color, uvs, top, hAdd) => { road.at(s, lat, o); obox(col, o.x, o.y + y, o.z, o.h + (hAdd || 0), ls, ll, ht, color, uvs, top); };
  const inGap = (sd, s, pad) => C.jn.some(j => j.sd === sd && Math.abs(s - j.at) < j.w / 2 + pad);
  const rd = env.road, asphalt = wet ? 0x26282c : 0x3a3c40, white = 0xe6e6e0, yellow = 0xe2b93a;
  rib(A, 0, Lr, -m.edge, 0, m.edge, 0, asphalt);
  /* vạch kẻ */
  if (!m.med) {
    if (m.lanes > 1 || rd === 'mountain') { rib(Mk, 0, Lr, -.2, .02, -.08, .02, yellow, 3); if (m.lanes > 1) rib(Mk, 0, Lr, .08, .02, .2, .02, yellow, 3); }
    else dashed(0, .13, yellow, 3, 4.5);
  }
  for (let i = 1; i < m.lanes; i++) for (const sd of [-1, 1]) dashed(sd * (m.med + i * m.lw), .13, white, 3, 6);
  if (m.sh >= 1) for (const sd of [-1, 1]) for (const q of spans(sd, 0, Lr)) rib(Mk, q[0], q[1], sd * m.run - .07, .02, sd * m.run + .07, .02, white, 3);
  if (m.med) for (const sd of [-1, 1]) rib(Mk, 0, Lr, sd * (m.med + .12), .02, sd * (m.med + .26), .02, rd === 'highway' ? white : yellow, 3);
  if (env.zebra != null) { const sz = C.P + env.zebra; for (let l = -m.run + .3; l < m.run - .5; l += 1) if (Math.abs(l + .25) > m.med) rib(Mk, sz - 1.7, sz + 1.7, l, .02, l + .5, .02, white, 1.7); }
  /* dải phân cách */
  if (rd === 'highway') { rib(A, 0, Lr, -.32, 0, -.2, .85, 0xb9b9b2, 3); rib(A, 0, Lr, .32, 0, .2, .85, 0xb9b9b2, 3); rib(A, 0, Lr, -.2, .85, .2, .85, 0xc8c8c2, 3); }
  else if (m.med) { rib(A, 0, Lr, -.5, 0, -.5, .2, 0xa9a9a2, 3); rib(A, 0, Lr, .5, 0, .5, .2, 0xa9a9a2, 3); rib(A, 0, Lr, -.5, .2, .5, .2, 0x5d7a48, 3); }
  /* đường nhánh */
  for (const j of C.jn) { const a = j.at - j.w / 2, b = j.at + j.w / 2, e = j.sd * m.edge, f = j.sd * (m.edge + 60); rib(A, a, b, Math.min(e, f), .012, Math.max(e, f), .012, rd === 'rural' && j.w < 8 ? 0x6e6250 : asphalt, 4); }
  const grass = night ? 0x2f4a2c : wet ? 0x3f5f38 : 0x4f7a3f, earth = 0x7a6a50;
  const lamp = (s, sd, reach) => {
    const lat = sd * (m.edge + .7); box(A, s, lat, 0, .16, .16, 7.2, 0x55585c); box(A, s, lat - sd * reach / 2, 7.1, .14, reach, .12, 0x55585c);
    box(lampsOn ? Gl : A, s, lat - sd * reach, 6.95, .5, .3, .12, lampsOn ? 0xffe2a8 : 0xd8d8d0);
    if (lampsOn) { const p = pt(s, lat - sd * reach, 6.9); glowAt(p, 0xffd9a0, night ? 3.2 : 2, true); road.at(s, lat - sd * (reach + 1.5), o); const q = 7; Pool.quad([o.x - q, o.y + .03, o.z - q], [o.x + q, o.y + .03, o.z - q], [o.x + q, o.y + .03, o.z + q], [o.x - q, o.y + .03, o.z + q], 0xffd9a0, [0, 0, 1, 1]); }
  };
  const sprites = [], sm_ = {}, SM = (hex, big) => { const k = hex + (big ? 'b' : ''); if (!sm_[k]) sm_[k] = mk(new THREE.SpriteMaterial({ map: T.glow, color: hex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: big ? .9 : .8 })); return sm_[k]; };
  function glowAt(p, hex, sc, isStatic, parent) { const s = new THREE.Sprite(SM(hex, sc > 3)); s.scale.set(sc, sc, 1); s.position.set(p[0], p[1], p[2]); (parent || scene).add(s); if (isStatic) sprites.push(s); return s; }
  const tree = (s, lat, sc) => { road.at(s, lat, o); const h = R(2, 3.2) * sc, y = o.y + (rd === 'urban' ? .15 : -.05); obox(A, o.x, y, o.z, 0, .32, .32, h, 0x5a4530); blob(A, o.x, y + h * .75, o.z, R(1.6, 2.5) * sc, R(3, 4.4) * sc, [0x3f6f38, 0x4d7f3f, 0x37602f, 0x5a8a45][(r() * 4) | 0]); };
  const house = (s, lat, w, d, h, color, roof) => { box(A, s, lat, -.05, w, d, h, color, null, roof); road.at(s, lat, o); const top = o.y + h - .05; blobRoof(o.x, top, o.z, o.h, w, d, roof); };
  function blobRoof(x, y, z, h, w, d, color) { const fx = Math.sin(h) * w / 2, fz = -Math.cos(h) * w / 2, rx = Math.cos(h) * (d / 2 + .3), rz = Math.sin(h) * (d / 2 + .3), a = [x - fx - rx, y, z - fz - rz], b = [x + fx - rx, y, z + fz - rz], c = [x + fx + rx, y, z + fz + rz], e = [x - fx + rx, y, z - fz + rz], r1 = [x - fx, y + 1.5, z - fz], r2 = [x + fx, y + 1.5, z + fz]; A.quad(a, b, r2, r1, color); A.quad(c, e, r1, r2, color); A.tri(a, r1, e, 0xd8cdb8); A.tri(b, c, r2, 0xd8cdb8); }
  const sign = (s, sd, type) => {
    const lat = sd * (m.edge + (rd === 'urban' ? .8 : 1)); box(A, s, lat, 0, .09, .09, 2.5, 0x8d9094); road.at(s, lat, o);
    const fx = Math.sin(o.h), fz = -Math.cos(o.h), rx = Math.cos(o.h), rz = Math.sin(o.h), cx = o.x - fx * .07, cz = o.z - fz * .07, cy = o.y + 2.75, P3 = (u, v, k) => [cx + rx * u - fx * k, cy + v, cz + rz * u - fz * k];
    if (type === 'warn') { A.tri(P3(-.55, -.42, 0), P3(.55, -.42, 0), P3(0, .55, 0), 0xc8322a); A.tri(P3(-.36, -.31, .02), P3(.36, -.31, .02), P3(0, .34, .02), 0xf1c93a); }
    else if (type === 'info') { A.quad(P3(-.42, -.42, 0), P3(.42, -.42, 0), P3(.42, .42, 0), P3(-.42, .42, 0), 0x1d5fb4); A.tri(P3(-.22, -.24, .02), P3(.22, -.24, .02), P3(0, .22, .02), 0xf2f2ee); }
    else for (let k = 0; k < 12; k++) { const a0 = k / 12 * 2 * PI, a1 = (k + 1) / 12 * 2 * PI; A.tri(P3(0, 0, 0), P3(Math.cos(a0) * .48, Math.sin(a0) * .48, 0), P3(Math.cos(a1) * .48, Math.sin(a1) * .48, 0), 0xc8322a); A.tri(P3(0, 0, .02), P3(Math.cos(a0) * .34, Math.sin(a0) * .34, .02), P3(Math.cos(a1) * .34, Math.sin(a1) * .34, .02), 0xf2f2ee); }
  };
  const rail = sd => { const lat = sd * (m.edge + .35); for (const q of spans(sd, 0, Lr)) { rib(A, q[0], q[1], lat, .42, lat, .74, 0xb4b8bc, 2); for (let s = q[0] + 1; s < q[1]; s += 4) box(A, s, lat + sd * .08, 0, .1, .1, .7, 0x7d8286); } };
  if (rd === 'urban') {
    for (const sd of [-1, 1]) {
      for (const q of spans(sd, 0, Lr)) { rib(A, q[0], q[1], sd * m.edge, 0, sd * m.edge, .15, 0x8f8f88); rib(A, q[0], q[1], sd * m.edge, .15, sd * (m.edge + 3.4), .15, 0x9b968c); }
      for (const q of spans(sd, 0, Lr)) rib(A, q[0], q[1], sd * (m.edge + 3.4), .14, sd * 240, .14, 0x6f6c66, 6, true);
      let s = 3;
      while (s < Lr - 12) {
        let w = R(5, 10); const j = C.jn.find(q => q.sd === sd && s + w > q.at - q.w / 2 - .4 && s < q.at + q.w / 2 + .4);
        if (j) { const av = j.at - j.w / 2 - .4 - s; if (av >= 3.5) w = av; else { s = j.at + j.w / 2 + .4; continue; } }
        const corner = C.jn.some(q => q.sd === sd && Math.abs(s + w / 2 - q.at) < q.w / 2 + w + .6), dep = corner ? 36 : R(10, 14), h = (2 + ((r() * 5) | 0)) * 3.4;
        box(B, s + w / 2, sd * (m.edge + 3.6 + dep / 2), .14, w - .12, dep, h, [0xe8dcc8, 0xd9c7a8, 0xc9d6d0, 0xe6c9b8, 0xbfc9d9, 0xd8d2c0, 0xcfc0d0, 0xf0e3c0][(r() * 8) | 0], [8, 13.6], 0x77726a);
        s += w;
      }
      for (let s2 = 14 + (sd > 0 ? 0 : 16); s2 < Lr; s2 += 32) if (!inGap(sd, s2, 1.5)) lamp(s2, sd, 2.2);
      for (let s2 = 9; s2 < Lr; s2 += 13) if (r() < .4 && !inGap(sd, s2, 2)) tree(s2, sd * (m.edge + 1.1), .8);
    }
  } else {
    const gcol = rd === 'mountain' ? 0x5c6048 : grass;
    for (const sd of [-1, 1]) {
      if (rd === 'mountain') continue;
      rib(A, 0, Lr, sd * m.edge, -.02, sd * (m.edge + 1.2), -.05, rd === 'highway' ? gcol : earth, 3);
      rib(A, 0, Lr, sd * (m.edge + 1.2), -.05, sd * 260, -.05, gcol, 6, true);
      if (rd !== 'highway') for (let s = 0; s < Lr; s += 46) if (r() < .6) rib(A, s, s + 40, sd * (m.edge + 13), -.03, sd * (m.edge + 90), -.03, [0x6f9440, 0x86a548, 0xa9a550, 0x4f8a48][(r() * 4) | 0], 8, true);
    }
    if (rd === 'rural' || rd === 'national') {
      for (const sd of [-1, 1]) {
        for (let s = 6; s < Lr; s += rd === 'rural' ? 8 : 15) if (r() < .62 && !inGap(sd, s, 3)) tree(s, sd * (m.edge + R(2.6, 11)), R(.9, 1.5));
        for (let s = 20; s < Lr; s += rd === 'rural' ? 62 : 34) if (r() < .7 && !inGap(sd, s, 9)) house(s + R(-6, 6), sd * (m.edge + R(9, 16)), R(6, 10), R(6, 8), R(3.2, 6.5), [0xe8dcc8, 0xd9c7a8, 0xc9d6d0, 0xf0e3c0][(r() * 4) | 0], [0xa24a34, 0x8f3f2c, 0x6c7078][(r() * 3) | 0]);
      }
      for (let s = 12; s < Lr; s += 45) { box(A, s, -(m.edge + 2), -.05, .2, .2, 8, 0x6a5a48); box(A, s, -(m.edge + 2), 7.3, .12, 1.8, .12, 0x6a5a48); }
      if (rd === 'national' && m.lanes > 1) for (let s = 22; s < Lr; s += 44) if (!inGap(1, s, 2)) lamp(s, 1, 2.6);
    }
    if (rd === 'highway') {
      rail(1); rail(-1);
      for (let s = 120; s < Lr; s += 260) { for (const sd of [-1, 1]) box(A, s, sd * (m.edge + .9), 0, .3, .3, 7, 0x7d8286); box(A, s, 0, 6.6, .3, 2 * m.edge + 2, .35, 0x7d8286); box(A, s - .2, m.run / 2 + .5, 5.2, .12, m.run * .8, 1.5, 0x1f7a4a); }
      for (let s = 10; s < Lr; s += 21) for (const sd of [-1, 1]) if (r() < .5) tree(s, sd * (m.edge + R(9, 34)), R(1, 1.7));
    }
    if (rd === 'mountain') {
      const cs = env.cliff === 'L' ? -1 : 1, vs = -cs, rock = night ? 0x4a463f : 0x7d7466;
      rib(A, 0, Lr, cs * m.edge, 0, cs * (m.edge + 1), .05, 0x6c675c, 2);
      rib(A, 0, Lr, cs * (m.edge + 1), .05, cs * (m.edge + 3.2), 9, rock, 2, true); rib(A, 0, Lr, cs * (m.edge + 3.2), 9, cs * (m.edge + 9), 22, 0x5d6a4a, 2, true);
      rib(A, 0, Lr, vs * m.edge, 0, vs * (m.edge + .9), -.05, 0x6c675c, 2); rail(vs);
      rib(A, 0, Lr, vs * (m.edge + .9), -.05, vs * (m.edge + 42), -30, 0x4a6a3c, 3, true);
      for (let s = 8; s < Lr; s += 11) if (r() < .5) { road.at(s, vs * (m.edge + R(3, 9)), o); const k = road.K[s | 0]; if (!(k && Math.sign(k) === vs)) { const yy = o.y - 3; obox(A, o.x, yy, o.z, 0, .3, .3, 4, 0x5a4530); blob(A, o.x, yy + 3, o.z, R(1.6, 2.4), R(3.4, 4.6), 0x35592f); } }
      for (let k = 0; k < 9; k++) { const a = k / 9 * 2 * PI + .3, rr = R(520, 700); road.at(C.P, 0, o); const x = o.x + Math.cos(a) * rr, z = o.z + Math.sin(a) * rr, hh = R(90, 190), rad = R(140, 200); blob(A, x, o.y - 60 - hh * .72, z, rad, hh * 1.72, night ? 0x1a2230 : 0x6f8aa0, 7); }
    }
  }
  /* biển báo, đèn tín hiệu */
  sign(C.S0 + 38, 1, 'limit');
  if (env.zebra != null) sign(C.P + env.zebra - 14, 1, 'info');
  if (rd === 'mountain' || /^(bend|s|hair)/.test(env.shape || '')) sign(Math.max(30, C.P - 120), 1, 'warn');
  if (env.light) for (const j of C.jn) {
    if (j.sd < 0) continue;
    for (const [s, sd] of [[j.at - j.w / 2 - 1.2, 1], [j.at + j.w / 2 + 1, 1]]) {
      const lat = sd * (m.edge + .8); box(A, s, lat, 0, .18, .18, 5.6, 0x3c3f42); box(A, s, lat - sd * 1.6, 5.3, .16, 3.2, .16, 0x3c3f42); box(A, s, lat - sd * 3.2, 4.3, .34, .46, 1.3, 0x222426);
      ['red', 'yellow', 'green'].forEach((nm, k) => { const on = nm === env.light, hex = on ? { red: 0xff3020, yellow: 0xffc830, green: 0x30ff70 }[nm] : 0x33363a; box(on ? Gl : A, s - .2, lat - sd * 3.2, 5.2 - k * .4, .08, .28, .28, hex); if (on) glowAt(pt(s - .3, lat - sd * 3.2, 5.34 - k * .4), hex, 1.5, true); });
    }
  }
  const addM = (col, mat) => { const ms = col.mesh(mat, own); if (ms) scene.add(ms); return ms; };
  addM(A, mk(new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })));
  addM(Mk, mk(new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })));
  addM(B, mk(new THREE.MeshLambertMaterial({ vertexColors: true, map: T.day, side: THREE.DoubleSide, emissive: dim ? 0xffffff : 0x000000, emissiveMap: dim ? T.night : null, emissiveIntensity: night ? .95 : .5 })));
  addM(Gl, mk(new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })));
  const pm = addM(Pool, mk(new THREE.MeshBasicMaterial({ vertexColors: true, map: T.glow, transparent: true, opacity: night ? .2 : .1, blending: THREE.AdditiveBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })));
  if (pm) pm.renderOrder = 1;

  /* ─── xe mình: nắp ca-pô, đèn pha, mưa ─── */
  const bonnet = new THREE.Mesh(G.box, M(0x8a1f1f)); bonnet.scale.set(1.74, .5, 1.9); bonnet.position.set(.38, -.7, -1.62); bonnet.rotation.x = -.04; camera.add(bonnet);
  const nose = new THREE.Mesh(G.box, M(0x6f1818)); nose.scale.set(1.6, .4, .5); nose.position.set(.38, -.82, -2.7); camera.add(nose);
  if (lampsOn) {
    const spot = new THREE.SpotLight(0xfff0cf, night ? 40 : foggy ? 10 : 7, night ? 100 : 60, .5, .65, 1);
    spot.position.set(.38, -.5, -2.2); spot.target.position.set(.38, -1.2, -32); camera.add(spot); camera.add(spot.target);
  }
  let rain = null, rainBase = null;
  if (wet) {
    const n = 520, pos = new Float32Array(n * 6); rainBase = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { rainBase[i * 3] = R(-11, 11); rainBase[i * 3 + 1] = R(0, 9); rainBase[i * 3 + 2] = R(-26, -1.2); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); own.push(g);
    rain = new THREE.LineSegments(g, mk(new THREE.LineBasicMaterial({ color: night ? 0x8f9aa8 : 0xc4ccd4, transparent: true, opacity: .42 }))); rain.frustumCulled = false; camera.add(rain);
  }

  /* ─── diễn viên ─── */
  const bx = (par, mat, w, h, l, x, y, z, geo) => { const ms = new THREE.Mesh(geo || G.box, mat); ms.scale.set(w, h, l); ms.position.set(x, y, z); par.add(ms); return ms; };
  const wheel = (par, x, z, rad, wid) => { const ms = new THREE.Mesh(G.cyl, M(0x17181a)); ms.scale.set(rad * 2, wid, rad * 2); ms.rotation.z = PI / 2; ms.position.set(x, rad, z); par.add(ms); return ms; };
  const glass = 0x1b242e;
  function person(par, sc, shirt, opt) {
    opt = opt || {}; const g = new THREE.Group(), legs = [], arms = [], pants = M(opt.pants || 0x2d3440), skin = M(0xd9a47a);
    for (const sx of [-1, 1]) {
      const lg = new THREE.Group(); lg.position.set(sx * .11, .86, 0); bx(lg, pants, .17, .86, .19, 0, -.43, 0); g.add(lg); legs.push(lg);
      const ar = new THREE.Group(); ar.position.set(sx * .29, 1.42, 0); bx(ar, M(shirt), .12, .62, .14, 0, -.31, 0); g.add(ar); arms.push(ar);
    }
    bx(g, M(shirt), .44, .62, .26, 0, 1.17, 0); bx(g, skin, .25, .27, .25, 0, 1.62, 0, G.sph);
    if (opt.helmet) bx(g, M(opt.helmet), .3, .2, .3, 0, 1.72, 0, G.sph);
    if (opt.umbrella) { bx(g, M(0x33363a), .03, .9, .03, .2, 1.85, .1); const u = bx(g, M(0x2a4f8a), 1.25, .3, 1.25, .2, 2.35, .1, G.cone); u.material.side = THREE.DoubleSide; }
    if (opt.carry) { bx(g, M(0xa5814e), .5, .4, .4, 0, 1.15, .34); arms.forEach(a => { a.rotation.x = -1.1; }); arms.length = 0; }
    g.scale.setScalar(sc); par.add(g); return { g, legs, arms };
  }
  function animal(par, sc, color) {
    const g = new THREE.Group(), legs = [], mt = M(color);
    bx(g, mt, .28, .28, .72, 0, .47, 0); bx(g, mt, .2, .22, .26, 0, .62, .46); bx(g, mt, .06, .06, .3, 0, .56, -.48);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const lg = new THREE.Group(); lg.position.set(sx * .1, .36, sz * .27); bx(lg, mt, .08, .36, .08, 0, -.18, 0); g.add(lg); legs.push(lg); }
    if (sc > 2) { bx(g, M(0xe8e0cc), .5, .05, .05, 0, .76, .46); }
    g.scale.setScalar(sc); par.add(g); return { g, legs };
  }
  function vehicleLights(A_, g, P, L, Wd, y, single) {
    const K = A_.K; P.brake = mk(new THREE.MeshBasicMaterial({ color: 0x551512 })); P.indL = mk(new THREE.MeshBasicMaterial({ color: 0x5a4210 })); P.indR = mk(new THREE.MeshBasicMaterial({ color: 0x5a4210 }));
    const head = M(lampsOn && !A_.nolight && !A_.parked ? 0xfff2c8 : 0xcfcfc6, 'b');
    if (single) { bx(g, P.brake, .14, .1, .05, 0, y, -L / 2); bx(g, head, .16, .14, .06, 0, y + .15, L / 2); }
    else for (const sx of [-1, 1]) {
      bx(g, P.brake, .32, .14, .06, sx * (Wd / 2 - .26), y, -L / 2 - .01); bx(g, head, .3, .15, .06, sx * (Wd / 2 - .26), y - .04, L / 2 + .01);
      const im = sx > 0 ? P.indL : P.indR; /* trục x cục bộ của xe hướng sang trái */ bx(g, im, .14, .12, .08, sx * (Wd / 2 - .06), y, -L / 2); bx(g, im, .14, .12, .08, sx * (Wd / 2 - .06), y - .04, L / 2);
    }
    if (A_.rev) { P.revL = bx(g, M(0xffffff, 'b'), .2, .1, .06, 0, y - .16, -L / 2 - .02); P.revL.visible = false; }
    if (lampsOn && !A_.nolight && (!A_.parked || A_.hazl)) {
      if (!A_.parked) { P.gF = glowAt([0, y + .05, L / 2 + .15], 0xfff0c8, A_.hi ? 7 : K.two ? 1.5 : 2.4, false, g); }
      P.gR = glowAt([0, y, -L / 2 - .12], 0xff2a18, K.two ? .7 : 1.1, false, g); P.gR.visible = false;
    }
  }
  function makeActor(A_) {
    const K = A_.K, k = A_.k, g = new THREE.Group(), P = { g }, L = K.L, Wd = K.W, body = new THREE.Group(); g.add(body); P.body = body;
    const cr = rng(hash(C.sc.id + k) ^ (A_.S[0] * 131 | 0)), pc = a => a[(cr() * a.length) | 0], paint = A_.col || pc(CAR_COLORS);
    if (K.veh && !K.two && k !== 'bagac') {
      if (k === 'car' || k === 'taxi' || k === 'suv' || k === 'van') {
        const col = k === 'taxi' ? 0x2e9a62 : paint, h1 = k === 'van' ? 1.0 : k === 'suv' ? .8 : .62, y1 = .3 + h1 / 2;
        bx(body, M(col), Wd, h1, L, 0, y1, 0);
        if (k !== 'van') { bx(body, M(glass), Wd * .88, .5, L * .52, 0, .3 + h1 + .25, -L * .04); bx(body, M(col), Wd * .9, .07, L * .5, 0, .3 + h1 + .53, -L * .04); }
        else { bx(body, M(glass), Wd * .92, .5, L * .7, 0, 1.52, -.1); bx(body, M(col), Wd, .08, L * .96, 0, 1.8, 0); }
        if (k === 'taxi') bx(body, M(0xf2e36a, 'b'), .5, .16, .2, 0, 1.58, 0);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) wheel(body, sx * (Wd / 2 - .08), sz * L * .31, .32, .22);
        const req = (k === 'car' ? cr() < .6 : true) && loadModel(k);
        if (req) req.then(src => {
          if (dead) return; const md = src.clone(true), bb = new THREE.Box3().setFromObject(md), sz = bb.max.z - bb.min.z; if (!(sz > 0)) return;
          const sc = L / sz; md.scale.setScalar(sc); md.position.set(-(bb.min.x + bb.max.x) / 2 * sc, -bb.min.y * sc, -(bb.min.z + bb.max.z) / 2 * sc);
          body.clear(); body.add(md); if (onModel) onModel();
        }).catch(() => {});
      } else if (k === 'pickup') {
        bx(body, M(paint), Wd, .6, L, 0, .65, 0); bx(body, M(glass), Wd * .9, .55, L * .34, 0, 1.22, L * .1); bx(body, M(paint), Wd * .92, .07, L * .33, 0, 1.52, L * .1);
        for (const sx of [-1, 1]) { bx(body, M(paint), .08, .35, L * .36, sx * (Wd / 2 - .04), 1.1, -L * .31); for (const sz of [-1, 1]) wheel(body, sx * (Wd / 2 - .08), sz * L * .31, .36, .24); }
        if (A_.load) bx(body, M(0xa5814e), 1.1, .5, 1.2, .1, 1.2, -L * .33);
      } else if (k === 'bus') {
        const col = pc([0xd8a22a, 0x2e6fb0, 0xe8e4da, 0xc94f3d, 0x3d8f6a]);
        bx(body, M(col), Wd, 2.65, L, 0, 1.72, 0); bx(body, M(glass), Wd + .03, .85, L * .9, 0, 2.2, 0); bx(body, M(glass), Wd * .9, 1.1, .06, 0, 2.05, L / 2);
        for (const sx of [-1, 1]) for (const sz of [-.34, .32]) wheel(body, sx * (Wd / 2 - .1), sz * L, .5, .3);
      } else {
        const cabC = pc([0x2e6fb0, 0xe8e4da, 0xc94f3d, 0x3d8f6a, 0xd8a22a]), cabL = k === 'container' ? 2.4 : 1.9, cz = L / 2 - cabL / 2;
        bx(body, M(cabC), Wd * .96, k === 'container' ? 2.4 : 1.9, cabL, 0, k === 'container' ? 1.75 : 1.5, cz); bx(body, M(glass), Wd * .9, .7, .06, 0, k === 'container' ? 2.2 : 1.85, L / 2);
        const cl = L - cabL - .25, ccz = -L / 2 + cl / 2;
        if (k === 'flatbed') { bx(body, M(0x55585c), Wd, .22, cl, 0, 1.14, ccz); for (const sx of [-1, 1]) bx(body, M(0x6c7078), .08, .5, cl, sx * (Wd / 2 - .04), 1.5, ccz); const ld = A_.load === 'log' ? 0x7a5a3a : 0x8a6a45; bx(body, M(ld), Wd * .8, .7, cl * .55, 0, 1.6, ccz + cl * .18); }
        else bx(body, M(k === 'container' ? pc([0x9a3b2e, 0x2f5f8a, 0x3d6a4a, 0x8a8f96]) : pc([0xd8d8d2, 0xc8c2b0, 0x9aa3ab])), Wd, k === 'container' ? 2.7 : 2.25, cl, 0, k === 'container' ? 2.45 : 2.2, ccz);
        bx(body, M(0x26282b), Wd * .7, .3, L * .96, 0, .75, 0);
        const zs = k === 'container' ? [.38, -.2, -.31, -.42] : [.34, -.3]; for (const sx of [-1, 1]) for (const sz of zs) wheel(body, sx * (Wd / 2 - .12), sz * L, .5, .3);
      }
      vehicleLights(A_, g, P, L, Wd, k === 'bus' || L > 7 ? 1.0 : .82);
      if (A_.door) { const dg = new THREE.Group(), sx = A_.door[2] === 'L' ? 1 : -1; dg.position.set(sx * Wd / 2, .95, L * .16); bx(dg, M(paint), .06, .9, 1.05, 0, 0, -.52); g.add(dg); P.door = dg; P.doorSx = sx; }
    } else if (K.veh) {
      const isBike = k === 'bike', tri = k === 'bagac', rw = isBike ? .33 : .29, ww = isBike ? .05 : .12, fz = tri ? L / 2 - .3 : .62;
      wheel(body, 0, fz, rw, ww);
      if (tri) { for (const sx of [-1, 1]) wheel(body, sx * .55, -L / 2 + .55, .3, .14); bx(body, M(0x3d5a8a), 1.25, .1, 1.7, 0, .8, -L / 2 + .9); for (const sx of [-1, 1]) bx(body, M(0x3d5a8a), .06, .4, 1.7, sx * .6, 1.05, -L / 2 + .9); bx(body, M(0x3d5a8a), 1.25, .4, .06, 0, 1.05, -L / 2 + 1.75); bx(body, M(0xa5814e), 1, .55, 1.1, 0, 1.12, -L / 2 + .75); }
      else wheel(body, 0, -.62, rw, ww);
      const fy = isBike ? .62 : .55, frameC = isBike ? pc([0x2e6fb0, 0xc94f3d, 0x30343a]) : pc([0xc94f3d, 0x2e6fb0, 0x30343a, 0xe8e4da, 0x3d8f6a]);
      bx(body, M(frameC), isBike ? .06 : .26, isBike ? .08 : .3, tri ? 1.2 : 1.15, 0, fy, tri ? fz - .65 : 0); bx(body, M(0x30343a), .5, .05, .05, 0, 1.05, fz - .22); bx(body, M(0x30343a), .06, .6, .06, 0, .78, fz - .15);
      if (!isBike) bx(body, M(0x1c1d20), .28, .1, .6, 0, .78, (tri ? fz - .75 : -.25));
      if (!(A_.parked && !A_.rider)) {
        const rd_ = person(body, 1, pc(SHIRTS), { helmet: isBike ? null : pc([0xe8e4da, 0xc94f3d, 0x2e6fb0, 0x30343a, 0xe0b23c]) });
        rd_.g.position.set(0, isBike ? -.02 : -.1, tri ? fz - .75 : -.2); rd_.legs.forEach(l => { l.rotation.x = -1.2; }); rd_.arms.forEach(a => { a.rotation.x = -1.15; }); rd_.g.rotation.x = .16;
      }
      vehicleLights(A_, g, P, tri ? L : 1.6, Wd, .82, true);
    } else if (K.man) {
      const kid = k === 'child', cr2 = pc(SHIRTS);
      const pr = person(g, kid ? .68 : 1, k === 'worker' ? 0xe8822a : cr2, { helmet: k === 'worker' ? 0xf0c020 : null, umbrella: A_.umbrella, carry: k === 'worker', pants: kid ? 0x28407a : null });
      P.legs = pr.legs; P.arms = pr.arms; P.stride = kid ? 6.5 : 4.4;
      if (k === 'cart') { pr.g.position.z = -.55; bx(g, M(0x3d8f6a), .78, .6, .95, 0, .72, .32); bx(g, M(0xe0b23c), .9, .06, 1.05, 0, 1.9, .32); for (const sx of [-1, 1]) { bx(g, M(0x55585c), .04, .9, .04, sx * .36, 1.45, .75); wheel(g, sx * .42, .3, .26, .06); } pr.arms.forEach(a => { a.rotation.x = -1.1; }); P.arms = []; }
    } else if (K.ani) {
      const an = animal(g, k === 'cow' ? 2.5 : k === 'goat' ? 1.25 : 1, k === 'cow' ? pc([0x4a3a2c, 0x2c2a28, 0x6a5038]) : k === 'goat' ? pc([0xe8e0d0, 0xb8a888, 0x5a4a3a]) : pc([0xb89060, 0x3a3430, 0xd8c8a8]));
      P.legs = an.legs; P.stride = k === 'cow' ? 3 : 7;
    } else {
      let ms;
      if (k === 'ball') ms = bx(g, M(0xe04a3a), .3, .3, .3, 0, .15, 0, G.sph);
      else if (k === 'box') ms = bx(g, M(0xa5814e), .9, .8, .9, 0, .4, 0);
      else if (k === 'log') { ms = bx(g, M(0x7a5a3a), .5, 2.6, .5, 0, .25, 0, G.cyl); ms.rotation.z = PI / 2; }
      else if (k === 'tyre') { ms = bx(g, M(0x17181a), 1, .35, 1, 0, .5, 0, G.cyl); ms.rotation.z = PI / 2; }
      else if (k === 'rock') { ms = bx(g, M(0x7d7466), 1.6, 1.1, 1.5, 0, .5, 0, G.rock); bx(g, M(0x6c665a), .8, .6, .7, .9, .28, .5, G.rock); }
      else if (k === 'cone') { bx(g, M(0xff6a1f), .34, .7, .34, 0, .37, 0, G.cone); bx(g, M(0x26282b), .44, .05, .44, 0, .025, 0); bx(g, M(0xf2f2ee), .2, .1, .2, 0, .45, 0, G.cyl); }
      else if (k === 'tree') { ms = bx(g, M(0x5a4530), .5, 6.5, .5, 0, .3, 0, G.cyl); ms.rotation.z = PI / 2; ms = null; bx(g, M(0x3f6f38), 2.6, 2, 2.6, -3.6, .9, 0, G.rock); bx(g, M(0x4d7f3f), 1.8, 1.5, 2, -2.2, .8, .6, G.rock); }
      P.spinM = A_.spin ? ms : null;
    }
    if (K.obj && k !== 'ball') { /* đổ bóng giả */ }
    scene.add(g); A_.P3 = P; return P;
  }
  let dead = false;
  for (const A_ of C.actors) makeActor(A_);
  const ego = {}, e1 = {}, e2 = {};
  let lastRain = -1;
  function update(t) {
    C.egoAt(t, ego);
    road.at(ego.s + .3, C.egoLat - .38, e1); camera.position.set(e1.x, e1.y + 1.24, e1.z);
    road.at(ego.s + 13, C.egoLat - .1, e2); camera.lookAt(e2.x, e2.y + 1.0 + Math.min(0, ego.acc) * .03, e2.z);
    if (dome) dome.position.copy(camera.position);
    const u = clamp(t * FPS, 0, C.N - 1.001), i = u | 0, f = u - i, blink = (t * 2.6) % 1 < .5;
    for (const A_ of C.actors) {
      const P = A_.P3, g = P.g;
      if (A_.VI) { g.visible = !!A_.VI[i]; if (!g.visible) continue; }
      g.position.set(lerp(A_.X[i], A_.X[i + 1], f), lerp(A_.Y[i], A_.Y[i + 1], f), lerp(A_.Z[i], A_.Z[i + 1], f));
      g.rotation.y = PI - lerp(A_.HD[i], A_.HD[i + 1], f);
      const di = lerp(A_.DI[i], A_.DI[i + 1], f), sp = A_.SP[i];
      if (P.legs) { const ph = di * P.stride, amp = Math.min(.75, sp * .45); for (let k = 0; k < P.legs.length; k++) P.legs[k].rotation.x = Math.sin(ph + (k % 2 ? PI : 0) + (k > 1 ? PI : 0)) * amp; if (P.arms) for (let k = 0; k < P.arms.length; k++) P.arms[k].rotation.x = Math.sin(ph + (k % 2 ? 0 : PI)) * amp * .7; }
      if (P.brake) {
        const br = A_.BR[i] === 1; P.brake.color.setHex(br ? 0xff2a18 : (lampsOn && !A_.nolight && !A_.parked ? 0x8a1a12 : 0x551512)); if (P.gR) P.gR.visible = br || (A_.hazl && blink);
        const on = A_.hazl || (A_.ind && t >= A_.ind[0] && t <= A_.ind[1]), sd = A_.hazl ? 'B' : (A_.ind ? A_.ind[2] : '');
        P.indL.color.setHex(on && blink && sd !== 'R' ? 0xffb020 : 0x5a4210); P.indR.color.setHex(on && blink && sd !== 'L' ? 0xffb020 : 0x5a4210);
        if (P.revL) P.revL.visible = t >= A_.rev[0] && t <= A_.rev[1] && sp > .2;
      }
      if (P.door) P.door.rotation.y = -P.doorSx * 1.15 * sm((t - A_.door[0]) / (A_.door[1] - A_.door[0]));
      if (P.spinM) P.spinM.rotation.x = di * 2.2;
      if (A_.fallen != null) P.body.rotation.z = -1.35 * sm((t - A_.fallen) / .5);
    }
    if (rain) {
      const pos = rain.geometry.attributes.position.array, n = rainBase.length / 3;
      for (let k = 0; k < n; k++) { const x = rainBase[k * 3], z = rainBase[k * 3 + 2], y = ((rainBase[k * 3 + 1] - t * 15) % 9 + 9) % 9 - 3.2, zz = z + ego.v * .012; pos[k * 6] = x; pos[k * 6 + 1] = y; pos[k * 6 + 2] = zz; pos[k * 6 + 3] = x + .03; pos[k * 6 + 4] = y + .55; pos[k * 6 + 5] = zz - .04 - ego.v * .012; }
      rain.geometry.attributes.position.needsUpdate = true; lastRain = t;
    }
    return ego;
  }
  function dispose() { dead = true; for (const x of own) x.dispose(); own.length = 0; scene.clear(); camera.clear(); }
  return { scene, camera, update, dispose };
}

root.MoPhongEngine.buildWorld = buildWorld;

/* ═════════ 3. Giao diện ═════════ */
const $ = id => document.getElementById(id), KEY = 'vvdv-mo-phong-v1';
const NOTE = 'Tình huống giả định do Vi vu đất Việt dựng để luyện phản xạ, không phải bộ 120 tình huống mô phỏng chính thức. Điểm số chỉ để tham khảo.';
const TOD = { day: 'Ban ngày', dawn: 'Sáng sớm', dusk: 'Chạng vạng', night: 'Ban đêm' }, WX = { clear: '', rain: 'mưa', fog: 'sương mù' };
let store = { best: {}, exam: null };
try { const raw = localStorage.getItem(KEY); if (raw) { const v = JSON.parse(raw); if (v && typeof v === 'object') store = { best: v.best || {}, exam: v.exam || null }; } } catch (err) { /* không lưu được thì thôi */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (err) { /* bỏ qua */ } };
const byCh = id => DATA.scenarios.filter(s => s.ch === id);
const views = ['home', 'chapter', 'player', 'examRes'];
let renderer = null, world = null, cur = null, state = 'idle', clock = 0, lastTs = 0, raf = 0, pressed = null, chapterId = 1, exam = null, review = false, lastSpeed = -1, glFail = false;

function show(v) { views.forEach(k => { $(k).hidden = k !== v; }); document.body.classList.toggle('playing', v === 'player'); if (v !== 'player') stop(); window.scrollTo(0, 0); }
function stop() { cancelAnimationFrame(raf); raf = 0; state = 'idle'; if (world) { world.dispose(); world = null; } if (renderer) renderer.renderLists.dispose(); cur = null; }
function tagText(sc) { const w = WX[sc.env.wx]; return TOD[sc.env.tod] + (w ? ', ' + w : '') + ' · ' + sc.v + ' km/h'; }
function chapterDone(id) { const l = byCh(id); let n = 0, pts = 0; for (const s of l) if (store.best[s.id] != null) { n++; pts += store.best[s.id]; } return { n, pts, total: l.length }; }

function renderHome() {
  const box = $('chapters'); box.textContent = '';
  for (const ch of DATA.chapters) {
    const d = chapterDone(ch.id), b = document.createElement('button'); b.type = 'button'; b.className = 'chapterCard';
    b.innerHTML = '<small>CHƯƠNG ' + ch.id + '</small><strong></strong><span></span><i><b style="width:' + Math.round(d.n / d.total * 100) + '%"></b></i>';
    b.querySelector('strong').textContent = ch.name; b.querySelector('span').textContent = d.total + ' tình huống · đã luyện ' + d.n + ' · ' + d.pts + '/' + d.total * 5 + ' điểm';
    b.addEventListener('click', () => openChapter(ch.id)); box.appendChild(b);
  }
  const le = $('lastExam');
  if (store.exam) le.textContent = 'Lần thi thử gần nhất: ' + store.exam.total + '/50 điểm, ' + (store.exam.pass ? 'đạt' : 'chưa đạt') + (store.exam.date ? ' (' + store.exam.date + ')' : '') + '.';
  else le.textContent = 'Bạn chưa thi thử lần nào.';
}
function openChapter(id) {
  chapterId = id; const ch = DATA.chapters.find(c => c.id === id), list = $('list'); list.textContent = '';
  $('chTitle').textContent = 'Chương ' + id + ' · ' + ch.name;
  const d = chapterDone(id); $('chMeta').textContent = d.total + ' tình huống · đã luyện ' + d.n + ' · tổng điểm cao nhất ' + d.pts + '/' + d.total * 5;
  for (const sc of byCh(id)) {
    const li = document.createElement('li'), b = document.createElement('button'), best = store.best[sc.id]; b.type = 'button';
    b.innerHTML = '<i></i><span><strong></strong><small></small></span><b></b>';
    b.querySelector('i').textContent = sc.n; b.querySelector('strong').textContent = sc.t; b.querySelector('small').textContent = tagText(sc);
    const bd = b.querySelector('b'); bd.textContent = best == null ? '–' : best + '/5'; bd.className = best == null ? '' : 's' + best;
    b.setAttribute('aria-label', 'Tình huống ' + sc.n + ': ' + sc.t + (best == null ? ', chưa luyện' : ', điểm cao nhất ' + best + ' trên 5'));
    b.addEventListener('click', () => { exam = null; load(sc, false); }); li.appendChild(b); list.appendChild(li);
  }
  show('chapter');
}
function ensureRenderer() {
  if (renderer || glFail) return !!renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: $('view'), antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  } catch (err) { glFail = true; renderer = null; }
  return !!renderer;
}
function resize() {
  if (!renderer) return; const st = $('stage'), w = st.clientWidth, h = st.clientHeight; if (!w || !h) return;
  renderer.setSize(w, h, false); if (world) { world.camera.aspect = w / h; world.camera.updateProjectionMatrix(); draw(); }
}
function draw() {
  if (!world || !renderer) return; const e = world.update(clock), sp = Math.round(e.v * 3.6);
  if (sp !== lastSpeed) { lastSpeed = sp; $('speed').textContent = sp; }
  renderer.render(world.scene, world.camera);
  $('tlFill').style.width = (clamp(clock / cur.dur, 0, 1) * 100).toFixed(2) + '%';
}
function load(sc, isReview) {
  cancelAnimationFrame(raf); raf = 0; if (world) { world.dispose(); world = null; }
  $('flagBtn').classList.remove('done'); $('live').textContent = '';
  show('player'); cur = sc; review = !!isReview; pressed = null; clock = 0; lastSpeed = -1; state = 'ready';
  const pos = exam ? 'Thi thử · ' + (exam.i + 1) + '/10' : 'Chương ' + sc.ch + ' · tình huống ' + sc.n + '/' + byCh(sc.ch).length;
  $('pCount').textContent = pos; $('pTitle').textContent = exam ? 'Tình huống ' + (exam.i + 1) : sc.t; $('pTags').textContent = tagText(sc);
  $('res').hidden = true; $('pre').hidden = false; $('flagBtn').disabled = true; $('tlFlag').hidden = true; $('tl').classList.toggle('reveal', review);
  $('preText').textContent = review ? 'Xem lại với vùng tính điểm hiện sẵn trên thanh thời gian.' : 'Nhấn phím Cách (Space) hoặc nút “Phát hiện nguy hiểm” ngay khi tình huống bắt đầu trở nên nguy hiểm. Chỉ lần nhấn đầu tiên được tính.';
  $('start').textContent = review ? 'Xem lại' : 'Bắt đầu';
  bands(sc); $('glMsg').hidden = true;
  if (!ensureRenderer()) { $('glMsg').hidden = false; $('start').disabled = true; return; }
  $('start').disabled = false;
  let C; try { C = compile(sc); world = buildWorld(C, () => { if (state !== 'playing') draw(); }); } catch (err) { $('glMsg').hidden = false; $('glMsg').textContent = 'Không dựng được tình huống này: ' + err.message; $('start').disabled = true; return; }
  resize(); draw(); $('start').focus();
}
function bands(sc) {
  const el = $('tlBands'), a = sc.hazardStart / sc.dur * 100, w = (sc.hazardEnd - sc.hazardStart) / sc.dur * 100; el.style.left = a + '%'; el.style.width = w + '%';
}
function play() {
  if (state !== 'ready' || !world) return; state = 'playing'; $('pre').hidden = true; $('flagBtn').disabled = review; lastTs = 0; if (!review) $('flagBtn').focus();
  const step = ts => {
    if (state !== 'playing') return; if (lastTs) clock += Math.min(.1, (ts - lastTs) / 1000); lastTs = ts;
    if (clock >= cur.dur) { clock = cur.dur; draw(); finish(); return; }
    draw(); raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}
function flag() {
  if (state !== 'playing' || review || pressed != null) return; pressed = clock;
  const f = $('tlFlag'); f.style.left = (pressed / cur.dur * 100).toFixed(2) + '%'; f.hidden = false; $('flagBtn').disabled = true; $('flagBtn').classList.add('done');
  $('live').textContent = 'Đã ghi nhận lúc ' + pressed.toFixed(1).replace('.', ',') + ' giây.';
}
function finish() {
  state = 'done'; $('flagBtn').classList.remove('done'); $('flagBtn').disabled = true; $('tl').classList.add('reveal');
  const sc = cur, hs = sc.hazardStart, he = sc.hazardEnd;
  if (review) { $('resScore').textContent = 'Xem lại'; $('resText').textContent = 'Vùng tính điểm từ giây ' + fmt(hs) + ' đến giây ' + fmt(he) + '.'; }
  else {
    const pts = scoreAt(pressed, hs, he); $('resScore').textContent = pts + '/5 điểm';
    $('resText').textContent = pressed == null ? 'Bạn chưa đánh dấu tình huống nguy hiểm.' : pressed < hs ? 'Bạn nhấn lúc ' + fmt(pressed) + ' giây, sớm hơn thời điểm tình huống bắt đầu nguy hiểm (' + fmt(hs) + ' giây).' : pressed > he ? 'Bạn nhấn lúc ' + fmt(pressed) + ' giây, sau khi vùng tính điểm đã kết thúc (' + fmt(he) + ' giây).' : 'Bạn nhấn lúc ' + fmt(pressed) + ' giây; vùng tính điểm từ ' + fmt(hs) + ' đến ' + fmt(he) + ' giây.';
    if (exam) { exam.scores.push({ id: sc.id, pts }); }
    if (store.best[sc.id] == null || pts > store.best[sc.id]) store.best[sc.id] = pts; save();
  }
  $('resTitle').textContent = sc.t; $('resEx').textContent = sc.ex;
  const list = byCh(sc.ch), hasNext = !exam && sc.n < list.length;
  $('again').hidden = !!exam; $('reviewBtn').hidden = !!exam || review; $('toList').hidden = !!exam;
  $('next').hidden = !exam && !hasNext; $('next').textContent = exam ? (exam.i < 9 ? 'Tình huống tiếp theo' : 'Xem kết quả') : 'Tình huống tiếp theo';
  $('res').hidden = false; ($('next').hidden ? $('again') : $('next')).focus();
}
const fmt = x => x.toFixed(1).replace('.', ',');
function nextOne() {
  if (exam) { exam.i++; if (exam.i >= exam.list.length) return examDone(); return load(exam.list[exam.i], false); }
  const list = byCh(cur.ch), nx = list[cur.n]; if (nx) load(nx, false);
}
function startExam() {
  const list = []; DATA.exam.forEach((n, k) => { const pool = byCh(k + 1).slice(); for (let j = 0; j < n && pool.length; j++) list.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]); });
  for (let i = list.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0, t = list[i]; list[i] = list[j]; list[j] = t; }
  exam = { list, i: 0, scores: [] }; load(list[0], false);
}
function examDone() {
  const total = exam.scores.reduce((a, s) => a + s.pts, 0), pass = total >= 35, d = new Date();
  store.exam = { total, pass, date: d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(), items: exam.scores }; save();
  $('examTotal').textContent = total + '/50'; $('examVerdict').textContent = pass ? 'Đạt (từ 35 điểm trở lên)' : 'Chưa đạt (cần từ 35 điểm)'; $('examVerdict').className = pass ? 'pass' : 'fail';
  const rows = $('examRows'); rows.textContent = '';
  exam.scores.forEach((s, k) => { const sc = DATA.scenarios.find(q => q.id === s.id), li = document.createElement('li'); li.innerHTML = '<span></span><b></b>'; li.querySelector('span').textContent = (k + 1) + '. ' + sc.t; const b = li.querySelector('b'); b.textContent = s.pts + '/5'; b.className = 's' + s.pts; rows.appendChild(li); });
  exam = null; show('examRes'); $('examAgain').focus();
}
function leave() { const wasExam = !!exam; exam = null; if (wasExam || !cur) { renderHome(); show('home'); } else openChapter(cur.ch); }

document.querySelectorAll('.note').forEach(n => { n.textContent = NOTE; });
$('examStart').addEventListener('click', startExam); $('examAgain').addEventListener('click', startExam);
$('examHome').addEventListener('click', () => { renderHome(); show('home'); });
$('chBack').addEventListener('click', () => { renderHome(); show('home'); });
$('quit').addEventListener('click', leave); $('toList').addEventListener('click', leave);
$('start').addEventListener('click', play); $('flagBtn').addEventListener('click', flag);
$('again').addEventListener('click', () => load(cur, false)); $('reviewBtn').addEventListener('click', () => load(cur, true)); $('next').addEventListener('click', nextOne);
document.addEventListener('keydown', ev => {
  if ($('player').hidden) return; const tag = ev.target && ev.target.tagName, onCtl = (tag === 'BUTTON' || tag === 'A') && ev.target.id !== 'flagBtn';
  if (ev.code === 'Space' || ev.key === ' ') { if (state === 'playing') { ev.preventDefault(); flag(); } else if (state === 'ready' && !onCtl) { ev.preventDefault(); play(); } }
  else if (ev.key === 'Enter' && !onCtl) { if (state === 'playing') { ev.preventDefault(); flag(); } else if (state === 'ready') { ev.preventDefault(); play(); } }
  else if (ev.key === 'Escape' && !exam) leave();
});
document.addEventListener('visibilitychange', () => { lastTs = 0; });
if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe($('stage')); else window.addEventListener('resize', resize);
renderHome(); show('home');
})();
