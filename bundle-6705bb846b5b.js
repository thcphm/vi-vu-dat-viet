'use strict';
// sight-secret-art.js
'use strict';

// The three plates of each small print use the paper itself for the carved highlights.
(() => {
  const paper = 'var(--stamp-paper)', ink = 'currentColor', accent = 'var(--stamp-accent)';
  const shape = (d, fill = ink) => '<path d="' + d + '" fill="' + fill + '"/>';
  const line = (d, stroke = ink, width = 2) =>
    '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + width + '"/>';
  const dot = (cx, cy, r, fill = ink) => '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"/>';
  const cut = (d, width = 1.8) => line(d, paper, width);
  const water = line('M8 76q9 4 20 0m5 4q11 3 22-1m8-5q10 3 21-1m-66 11q9 2 17 0m21 3q9 1 15-2', ink, 1.4);

  function cog() {
    const points = [];
    for (let tooth = 0; tooth < 10; tooth++) {
      for (const [fraction, radius] of [[-.50,24],[-.30,24],[-.24,30],[.24,30],[.30,24]]) {
        const a = (tooth + fraction) * Math.PI / 5;
        points.push([(48 + radius * Math.sin(a)).toFixed(1), (48 - radius * Math.cos(a)).toFixed(1)].join(' '));
      }
    }
    return shape('M' + points.join('L') + 'Z');
  }

  const prints = {
    turtle:
      shape('M6 59q9-3 14-2c3-14 14-22 29-24 16-2 28 6 33 16 3 0 5-3 7-8 2-4 8-4 9 0 2 6-4 17-12 20l-13 2 4 6-3 3-10-7-19 1-10 7-5-1 6-8-14-2-9 1z') +
      shape('M22 55c5-12 15-18 28-19 13-1 22 4 29 14-16 8-40 10-57 5z', accent) +
      line('M24 53q23-13 51-5m-41-7 6 5 8-3 2-6m-9 10-2 7m23-15-4 5 6 7', ink, 1.6) +
      cut('M24 59q24 7 54-4m10 1 5-6') + dot(93,42,1.5,paper) + water,

    lantern:
      line('M11 12q32 11 74-5M49 18v9', ink, 2.5) +
      shape('M32 29q17-5 34-1l-1 5c16 9 17 25 3 37l-6 4-2 4-21 1-3-4c-20-9-22-29-6-40z') +
      shape('M34 35q14-4 28-2 19 15 2 35-13 5-26 4-19-15-4-37z', accent) +
      line('M39 34q-17 20 2 38m5-39q-9 22-1 39m8-39q6 18-1 38m8-39q15 17 0 37', ink, 1.55) +
      cut('M34 31q14-3 28-2m-22 46 20-2', 1.2) +
      line('M50 79v5m0 0-3 6m3-6 1 7m0-7 3 5', accent, 2.2),

    lotus:
      line('M49 69q-3 11-3 17m4-16q11 6 26 3', ink, 2) +
      shape('M49 69C32 66 19 55 18 36c13 4 22 9 31 21 7-12 18-21 32-25 0 18-10 31-27 36z') +
      shape('M49 64C35 52 37 35 50 15c14 17 17 33-1 49z', accent) +
      shape('M48 67q-1-23-23-37 0 25 23 37zm4 0q1-23 24-38-1 26-24 38z', accent) +
      line('M48 65q-2-14 2-34m1 34q9-11 15-23m-20 23q-8-9-13-19', ink, 1.55) +
      shape('M49 70Q20 73 7 49q17-2 40 13 24-17 44-17-10 23-42 25z') +
      cut('M14 53q15 11 29 13m12-1q18-5 28-14') + water,

    sail:
      dot(24,26,8,accent) +
      line('M53 15 50 68m-1-46L19 63m37-43 24 38', ink, 1.65) +
      shape('M49 22q-16 13-27 38 13-4 27-2z') +
      shape('M55 22q17 14 23 35-12-2-25 3z', accent) +
      cut('M45 31q-9 9-14 19m15-12-6 10m14 5q8-2 15-1', 1.4) +
      shape('M9 61q18 7 38 5 24-1 44-11-6 14-20 18l-38 2Q18 72 9 61z') +
      cut('M21 67q27 7 56-2', 1.5) + water,

    wing:
      shape('M7 25c17 2 29 8 40 21l8 1C62 32 74 22 91 14l-9 13 8-4-11 12 9-4-14 12 5-1-15 12-6 10-8 6 2-9-9 4-12 13 4-12-17 9 16-16-4-5C20 54 12 45 6 38l12 5L6 31l12 5z') +
      shape('M47 51q-12-14-32-20 20 9 30 24zm10-1q11-15 25-24-9 11-21 25z', accent) +
      cut('M17 41q11 8 23 11m-21-4q8 5 15 7m31-14 11-9m-11 16 12-10', 1.6) +
      shape('M51 57q3-4 8-7l9 1-8 4-4 5z') + dot(58,52,1,paper) +
      line('M10 79q9-6 21-7m32-7q13-5 25-16m-16 15q8-3 13-7', accent, 1.8),

    echo:
      shape('M5 28q16-8 31-12 16-3 29 2 14 4 29 0v46l-6 8-3-30-5 10-6-23-3 10-3-12-8 24-3 14-6-24-4 7-3-17-7 14-4-17-4 9-2-14-5 10-5-4-6 28-5 6z') +
      shape('M8 70q9-9 20-9l3-14 6 14 5-4 4 9-8 5-21 7z', accent) +
      cut('M12 33q9-8 19-9m15-2q14-1 20 4m-7 5-1 12m-3-8 1 12m21-20 2 8', 1.45) +
      line('M47 76q8-5 15 0m-20 4q14-9 27-1m-31 6q19-11 37-1', ink, 1.7) +
      dot(56,68,2.2,accent),

    beacon:
      shape('M13 53 40 30l-3 11z', accent) +
      shape('M56 29 87 9 68 30z', accent) +
      shape('M30 74q7-12 11-35l14-1q3 18 11 35zm7-38v-7h2v-8l8-7 9 7v8h3v7zm7-22 3-6 3 6z') +
      shape('M39 31h17v3H39zm4-8h9v6h-9z', paper) + line('M47 22v8', ink, 1.6) +
      shape('M39 50q9 2 19-1l3 9q-12 2-24 0z', accent) +
      cut('M43 41 41 47m-6 20 2-5m16-1 2 7', 1.5) +
      shape('M8 76 24 68l7 3 13-6 5 4 13-2 8 5 9-1 10 6-50 2z') + water,

    leaf:
      shape('M21 72C12 42 40 22 84 14c-8 10-7 22-12 33-8 20-29 28-51 25z') +
      shape('M25 65q10-32 50-45-9 12-12 23-13 18-38 22z', accent) +
      line('M14 85q14-31 54-59', ink, 3.3) +
      cut('M26 66q10-17 37-35m-29 25 1-14m8 5 2-13m7 6 1-9m-17 26 19-4m-12-4 17-6m-7-3 12-5', 1.5) +
      line('M12 72q-6-12-2-24m65 9q7-9 11-23', accent, 1.6),

    ink:
      shape('M26 67c3-6 5-10 6-17l13-12 11 9-12 14q-10 1-18 6z') +
      shape('M39 40 69 11q5-5 9 0t-1 9L52 50z', accent) +
      line('M42 38 69 12q6-5 9 0t-1 8L53 49m-16-5 11 9', ink, 2) +
      cut('M30 63q6-8 12-14m-5 11 8-8', 1.4) +
      shape('M27 66c-8 2-16 8-14 14 3 7 20 8 41 3 13-3 25-9 32-16-16 8-31 11-48 12 12-3 21-6 25-10-14 5-27 8-35 7-6 0-7-3-1-10z') +
      dot(77,78,2.4,accent) + dot(82,74,1.2,accent),

    star:
      dot(50,47,29,ink) + dot(50,47,25,paper) +
      shape('M50 17 57 38 79 38 61 52 68 74 50 61 31 74 38 52 20 38 43 38z',accent) +
      shape('M50 17v30l-7-9zm29 21L50 47l11 5zM68 74 50 47v14zM31 74l19-27-12 5zM20 38l30 9-7-9z') +
      line('M50 7v4m28 3-4 5m14 30h5m-9 23-5-4M50 83v5m-23-12-4 5M9 48h5m4-31 6 5', ink, 1.7),

    shell:
      shape('M44 76q-4-5-15-10C12 57 6 46 10 39q1-4 8-5-1-10 7-12 3-1 6 0 3-10 12-9 4 0 7 4 5-8 12-4 4 2 5 8 10-3 15 4 2 3 1 8 8 1 9 9 1 13-20 27l-11 7 4 6q-12 5-26 0z') +
      shape('M47 71q-14-16-21-39 12 15 23 39h3q0-25 7-49-1 26-4 48l3-1q11-21 23-31-9 18-21 32l-5 6z', accent) +
      cut('M46 71Q23 55 16 42m33 28Q38 49 33 29m18 40q-2-23-7-47m11 45q5-25 15-40m-9 42q14-11 23-23m-41 33 16 1', 1.8),

    arch:
      shape('M7 42q15-3 21-10l12-1 9-8 10 8h12q8 7 20 9-9 6-21 5l-2 3H31l-3-3q-11 1-21-3z') +
      shape('M16 40q14-3 17-6h10l6-6 8 6h10q4 4 14 6-14-1-23 0H40z', accent) +
      shape('M22 47h9v27l6 2v4H16v-4l6-2zm44 0h10v27l7 2v4H60v-4l6-2zM31 48h36v15h-7q-2-12-10-12t-12 12h-7z') +
      cut('M26 50v19m44-19v19m-35-24h29', 1.5) +
      line('M33 77h24m-23 4h24M10 85h77', ink, 1.75) + dot(49,19,2.5,accent),

    gear:
      cog() + dot(48,48,19,paper) + dot(48,48,15,accent) +
      line('M34 54 62 42m-21-7 14 26m-8-28 2 30', ink, 3) +
      dot(48,48,6,ink) + dot(48,48,2.7,paper) +
      cut('M31 36q6-10 17-10m9 42q9-4 12-12', 1.6) +
      line('M8 57q-1 10 8 20m-2-19q1 9 8 14m49-53q9 6 13 16m-10-21q10 7 15 19', accent, 2),

    drop:
      shape('M6 27q14-8 30-5l13 1 10-7 12 2 13-5 10 2v48l-12-3-5-13-5 6-5-14-6-3q-5 16-5 30l-9 5-15-6 1-11-11 7-5-6-12 5z') +
      shape('M22 27q15-4 39 0-9 15-9 31l-1 10-15 4 3-18-7 9q7-23 6-31-7-4-16-5z', paper) +
      shape('M40 28q7 0 13 1-8 18-8 33l-5 6q4-24 5-35z', accent) +
      cut('M9 35q11-6 19-4M68 25l12-4m-6 7 13-3m-8 7 10-3', 1.6) +
      line('M26 73q3-7 8-5 2-7 8-5 6-7 12-2 5-2 8 3 9-1 10 5M18 79q10-5 21-3m6-2q12-4 23 0m-36 8q12-1 30-1', ink, 1.8),

    dragon:
      shape('M8 76q8 3 13-3-8-1-12-9 10 4 16-2-6 0-11-8 9 5 19 0l7 1q9-8 19-5-5-5-6-11l-7-2 4-4-8-9 13 4-7-15 13 11 1-18 6 17 8-10-3 14 8 2 4 5 8-1-1 8-8 5-12-1c1 9 7 14 3 24-4 12-17 19-31 13 12 1 17-7 15-13-3-9-12-9-20-2-8 8-18 14-31 9z') +
      shape('M57 33q8-6 16-3l5 6 12 1-7 5-9-2-5-6-11 4z', accent) +
      cut('M17 71q10 2 20-7t20-6m8-13q2 7 5 12m-7 9q4 6-1 13m-34-16 4-3m5-1 4-3',1.7) +
      dot(72,32,1.5,ink) +
      line('M79 39q5 4 13 0m-10 4q7 7 13 1m-34-9q-6-4-11-2', ink,1.4),

    ridge:
      dot(74,24,9,accent) +
      shape('M4 64 25 37l6 7 19-29 19 32 6-8 20 29q-18-5-32-3-32 8-59-1z') +
      shape('M23 48 50 20 41 44l8-5-12 15 8-4-13 14-18 1z',accent) +
      cut('m22 48 4-6 5 6m17-20 3-5 8 14m13 12 3-5 9 13',1.8) +
      shape('M5 73q17-5 28-4 17 1 35-4 13-4 27 0-18-1-32 5-20 8-37 4-12-2-21-1z',accent) +
      line('M9 81q14-4 28-1t33-5m-43 11q11-1 18 0m31-13 11-2',ink,1.6)
  };

  // Shape the bridge deck between the far fingers and the near thumb of each hand.
  const stoneHand =
    shape('M17 56c0-5-2-8-6-11C6 41 3 36 2 29L0 18q0-4 3-3l4 13L4 9q0-4 3-4 2 0 3 4l4 16-1-21q0-4 3-4 3 0 3 4l2 20 2-17q1-4 4-3 2 1 1 5l-1 19c0 5 0 8 3 9 4 0 6-6 7-12 1-4 5-3 5 1l-1 9c-1 8-7 15-15 20z') +
    cut('M6 30q2 6 7 9m-2-13 2 3m6-6 1 6m5-3v4m-11 6q4 5 10 6m-6 2q4 5 8 5',1.25);
  const thumb =
    shape('M25 43c4-1 8-5 10-12l2-8q1-3 4-2 2 1 1 5l-2 10q-2 6-9 10z') +
    cut('M37 28q1-4 2-4m-9 18 4-3',1.15);
  const nearHand = 'translate(6 29) rotate(-6 21 32)';
  const farHand = 'translate(60 16) scale(.72)';
  const groupAt = (transform, art) => '<g transform="' + transform + '">' + art + '</g>';

  function basalt(x, y, width, height) {
    const a = width/2, b = width*.22;
    return groupAt('translate('+x+' '+y+')',
      shape('M-'+a+' 0 -'+b+' -4 '+b+' -4 '+a+' 0 '+b+' 4 -'+b+' 4z',accent) +
      shape('M-'+a+' 0 -'+b+' 4 '+b+' 4 '+a+' 0 '+a+' '+height+' '+b+' '+(height+4)+' -'+b+' '+(height+4)+' -'+a+' '+height+'z') +
      cut('M'+b+' 5v'+(height-2),1));
  }

  const sitePrints = {
    'cau-vang-ba-na':
      line('M3 65q12-5 19-14m12-9q10-7 19-8m24-6 15-4',accent,1.35) +
      groupAt(farHand,stoneHand) + groupAt(nearHand,stoneHand) +
      shape('M3 60Q57 25 96 33v4Q56 31 3 69z',paper) +
      shape('M3 61Q57 27 96 33v4Q58 33 3 69z',accent) +
      line('M3 59Q56 25 96 31m-93 38Q57 32 96 37',ink,1.4) +
      line('m12 54v4m9-10v5m11-11v5m12-10v4m12-8v4m14-6v3m12-3v3m9-3v3',ink,1) +
      groupAt(farHand,thumb) + groupAt(nearHand,thumb) +
      line('M3 80q5-4 10-4m35-6q6-6 13-5m-4 8q7-6 13-5m10-11q6-4 12-4',ink,1.4),

    turtle:
      dot(72,19,5.5,accent) +
      shape('M9 58q7-4 16-4h9V41h-3v-3h8V27h-3v-2l8-4 4-6 3-5 3 5 5 6 8 4v2h-3v11h7v3h-4v13q10-1 17 4-27 5-75 0z') +
      shape('M39 25q11-1 12-10 3 8 13 10z',accent) +
      shape('M37 54v-7q3-6 6 0v7zm10 0v-8q3-7 6 0v8zm11 0v-7q3-6 6 0v7zm-16-17v-5q2-5 4 0v5zm8 0v-6q2-4 4 0v6zm8 0v-5q2-4 4 0v5z',paper) +
      cut('M34 40h34m-28-12h23m-29 28h34',1.15) +
      shape('M21 73q8-2 11-6 6-8 16-7 8 0 14 7 4 1 7-4 4-6 7-3 3 4-2 8-6 5-15 5z') +
      shape('M34 68q11-14 23-1-11 5-23 1z',accent) +
      line('M13 75q23 6 55 0m-43 6q23 3 45-2m-1-7q10-1 17-5',ink,1.5),

    'nha-co-tan-ky':
      shape('M12 40 25 22l49-3 14 18-3 3v37l-10 3H15V42z') +
      shape('M13 37 26 23l46-2 9 13z',accent) +
      cut('M19 35 28 25m-3 9 6-8m4 7 6-8m7 7 5-7m6 6 5-7m-48 17 60-4m-56 22v15m10-18v18m9-18v17m14-18v18m9-18v16',1.2) +
      shape('M22 47h8v7h-8zm13-1h8v7h-8zm13-1h8v7h-8z',paper) +
      line('M4 83 93 75m-82 12 31-3',ink,1.5) +
      groupAt('translate(50 16) scale(.49 .63)',prints.lantern),

    'ben-thuyen-trang-an':
      shape('M4 58q2-11 8-14l6-20 6-6 4 4 4 18 7 5 4-4 8-24 6-5 4 3 3 17 5 8 5-11 6-4 5 5 4 17 6 7v5z') +
      shape('m6 56 11-12 4-15 2 13 8 9-6 5zm33 0 12-24 5-14 2 19 6 12-5 6z',accent) +
      cut('m21 30 3-6m29 6 4-12m22 17 3-5',1.4) +
      shape('M19 65q21 7 51 0-5 9-20 10l-19-1q-6-2-12-9z') +
      shape('m44 59 4-7 7 7z',accent) + dot(49,60,2) +
      shape('m46 61 6-1 4 7H42z') +
      line('m48 64-21 13m27-15 23 11',ink,2) +
      line('M16 77q9 4 17 3m36-5q11 2 18-2m-49 9q15 2 25-1',ink,1.45),

    'tam-chuc':
      shape('M4 60q1-10 8-16l7-14 5 1 5 10 4 3 7-12 9-17 5-3 7 4 5 13 8 10 5-5 7 6 8 18z') +
      shape('M10 57q12-8 15-18l3 8 6 4-6 6zm22 1 18-34 6-6-2 14-8 12 4-2-8 15z',accent) +
      shape('M46 17q4-2 5-5h2v-2l2-4 2 4v2h2l3 4-3 1v4H49v-4z') +
      cut('M51 17h7m-5 3v-2m3 2v-2',1) +
      shape('M6 63q31 2 84-3l-10 6-8-1-9 5-9 10-6-5-4 1-9-10-7 4-8-4z',accent) +
      line('M5 61q34 3 89-2m-75 14h16m19 7 18-1m-35 5 12 1',ink,1.35),

    'hon-trong-mai':
      shape('M8 62q3-10 11-18l7-11-1-6 4-4 4 2 4-4 6 5 4 6 5 6-6 2-4 11-1 9 2 5-12 3-21-1z') +
      shape('M53 40l3-7 2-8 4-4 6 4 6 12 7 7 10 11 4 7-9 5-21-1-6-3 2-7-4-11z',accent) +
      line('M54 41q4 2 7 8l4 13m-2-32 8 15 12 12',ink,1.6) +
      cut('M17 57q8-12 13-23m4-5 3-2m-9 32q5-5 8-17',1.6) +
      shape('M9 70q14 3 33-1l-4 7-9-2-8 5zm52 0q17 3 31-2l-11 9-8-3-6 3z',accent) +
      line('M4 68q9-3 19 0m20 1q7 2 13-1m19 13q8 1 14-3m-61 5q10 2 19-1',ink,1.5),

    'ganh-da-dia':
      line('M53 26q9-4 14-2m4 4q11-2 20 0m-15 6q10-1 17 0',ink,1.5) +
      basalt(20,34,16,12) + basalt(38,32,18,17) + basalt(55,37,16,13) +
      basalt(11,45,14,13) + basalt(29,43,18,17) + basalt(47,44,17,18) + basalt(63,47,15,14) +
      basalt(15,56,16,13) + basalt(34,55,19,18) + basalt(53,56,17,16) + basalt(70,57,16,12) +
      line('M6 74q10-2 17 1m24 4q15 2 28-4m0-7q11 1 18-3m-29 17 14-2',ink,1.5) +
      dot(49,51,1.9,paper) + dot(54,20,1.8,accent) + dot(58,16,1.2,accent),

    'ban-gioc':
      shape('M4 42q7-6 11-19l7-7 6 4 5 15 9-3 7-15 6-5 6 4 5 13 6-4 8-10 7 4 4 14 5 5v20H4z') +
      shape('M5 39q12-4 25 1l-1 13-6 9-18-1zm27-2q25-9 57-2l-3 16-7 10-47 2 4-12z',paper) +
      shape('M4 59q11-4 24-4l9 1-6 6q27-7 54-9l-4 6-14 4-29 2-11 6-19 3z',accent) +
      line('m11 43-1 9m9-9-3 11m24-15-2 10m9-11-3 16m12-19-5 19m15-20-3 14m10-14-3 15m11-13-3 13',accent,1.9) +
      shape('M11 72q11-7 22-7l-3 5q15-7 24-6l-4 5 26-7-8 6-33 8z') +
      line('M6 77q9-4 21-3m4 5q12-4 22-4m6-2q12-1 22-6m-59 15 15-1',ink,1.5),

    'khue-van-cac':
      shape('M9 34q14-4 24-12h10l7-8 7 8h10q10 9 24 12l-8 3-8 1v21h5l-1 6H22l-2-6h5V38z') +
      shape('M17 34q14-4 19-9h11l3-5 4 5h10q8 6 18 9z',accent) +
      shape('M23 64h7v16h3v3H19v-3h4zm47 0h7v16h3v3H66v-3h4z') +
      dot(50,47,10,paper) + dot(50,47,6,accent) +
      line('M50 37v4m0 12v4m-10-10h4m12 0h4m-17-7 3 3m8 8 3 3m-14 0 3-3m8-8 3-3',ink,1.25) +
      cut('M28 39h8v15h-8zm36 0h8v15h-8zM24 61h52',1.4) +
      line('M13 85h72m-59 3h47',ink,1.5),

    'cau-rong':
      shape('M5 54q15-21 25-6 10-26 23-10 8-14 17-13l4-4-2-6 6 3 1-8 4 7 5-4-1 8 7 5-1 5-8 3-7-2q-11 0-19 14l-6 4q-10-17-19 6l-6 2q-9-13-21 0z',accent) +
      line('M7 54q15-17 23-5 10-23 22-8 11-16 21-15m5 5 8 1 7-3',ink,1.8) + dot(83,24,1.55) +
      shape('M5 62q38-14 88-15l-1 5q-46 1-86 16zm15 3 5-1-1 9-5 1zm38-9 6-1-1 11-5 1zm25-3 4-1v11h-4z') +
      line('M8 74q15 1 29-4m9-1q12 1 29-4m-51 16q17 0 34-5m9-4 14-3',ink,1.4),

    'nha-hat-cao-van-lau':
      shape('M7 50 26 29l22 20q-22 8-41 1zm42-6 20-24 23 22q-20 8-43 2z') +
      shape('M22 54 48 23l28 29q-29 9-54 2z',accent) +
      line('M22 54q27 10 54-2m-28-28-15 27m16-24 8 25m10-27-8 13m-33-4-7 12',ink,1.5) +
      shape('M12 55h4v7h14v-5l5 1v5h25v-5l4-1v6h14V49l4-1v15h6v3H9v-3h3z') +
      line('M8 70q13 3 25 0m7 4q20 2 42-4m-60 9q14 2 24 0',ink,1.4) +
      dot(62,76,2.7,accent) + line('M64 75v-7l4-2',accent,1.5)
  };
  sitePrints['quan-the-trang-an'] = sitePrints['ben-thuyen-trang-an'];
  sitePrints['pho-co-hoi-an'] = sitePrints['nha-co-tan-ky'];
  const artwork = (key, siteId) => Object.hasOwn(sitePrints, siteId) ? sitePrints[siteId] : prints[key];

  // Dark ink, second ink, and unprinted paper. Each subject keeps its own colour family.
  const palettes = [
    ['#163f47','#d1803d','#f6e8c8'], ['#15394c','#d4964f','#f8edce'],
    ['#224a41','#9aab65','#f3eacc'], ['#24463c','#ca8751','#f6eaca'],
    ['#552e33','#d56946','#faebcc'], ['#58384b','#cf8663','#f7e8d2'],
    ['#293950','#779b93','#f3eacf'], ['#303b50','#b76a4d','#f6e6c6']
  ];
  const paletteFamilies = {
    turtle:2, lantern:4, lotus:4, sail:0, wing:6, echo:6, beacon:0, leaf:2,
    ink:6, star:4, shell:4, arch:4, gear:0, drop:0, dragon:2, ridge:2
  };
  const edge = 'M4 4' + 'h2a2 2 0 0 0 4 0h2'.repeat(14) +
    'v2a2 2 0 0 0 0 4v2'.repeat(14) + 'h-2a2 2 0 0 0-4 0h-2'.repeat(14) +
    'v-2a2 2 0 0 0 0-4v-2'.repeat(14) + 'z';

  function hashSeed(seed) {
    if (typeof seed === 'number' && Number.isFinite(seed)) return seed >>> 0;
    let hash = 2166136261;
    for (const ch of String(seed)) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
    return hash >>> 0;
  }

  function postmark(seed) {
    const points = Array.from({length:4}, (_, i) => [85 + i * 3, 97 + ((seed >>> (4+i*3)) & 7)-3]);
    const route = line('M' + points.map(([x,y]) => x+' '+y).join('L'), ink, 1.2) +
      points.map(([x,y]) => dot(x,y,.95)).join('');
    const angle = (seed >>> 18) % 21 - 10;
    return '<g transform="rotate(' + angle + ' 90 97)"><g class="sight-stamp-postmark">' +
      '<circle cx="90" cy="97" r="10.3" fill="' + paper + '" stroke="currentColor" stroke-width="1.4"/>' +
      line('M83 93q6-6 13 0m-12 9q6 5 12-1m4-7q4-2 9-1m-8 4q4-2 8-1m-9 5q4-2 9-2', ink, 1) +
      route + '</g></g>';
  }

  function plate(key, code, size, className, siteId) {
    const [dark, second, stock] = palettes[paletteFamilies[key] + (code >>> 11 & 1)];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 '+size+' '+size);
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', className);
    svg.style.color = dark;
    svg.style.setProperty('--stamp-accent',siteId === 'cau-vang-ba-na' ? '#ce9634' : second);
    svg.style.setProperty('--stamp-paper',stock);
    return svg;
  }

  window.createSightSecretGlyph = (motif, seed, siteId) => {
    const key = Object.hasOwn(prints, motif) ? motif : 'ridge';
    const svg = plate(key, hashSeed(seed), 100, 'sight-secret-glyph', siteId);
    svg.innerHTML = '<g stroke-linejoin="round" stroke-linecap="round">' + artwork(key,siteId) + '</g>';
    return svg;
  };

  window.createSightSecretArt = (motif, seed, siteId, localityMark) => {
    const key = Object.hasOwn(prints, motif) ? motif : 'ridge';
    const code = hashSeed(seed), svg = plate(key, code, 120, 'sight-secret-art', siteId);
    const mark = typeof localityMark === 'string' ? localityMark.trim() : '';
    svg.innerHTML = shape(edge,paper) +
      '<g stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M12 12h96v96H12z" fill="none" stroke="currentColor" stroke-width=".95"/>' +
      line('M15 17v-2h6m78 0h6v5m-90 65v4h6m76 0h8v-5', ink, 1.4) +
      '<g transform="translate(15 8) scale(.91)"><g class="sight-stamp-print">' + artwork(key,siteId) + '</g></g>' +
      (mark ? '' : line('M18 92h58m-58 2h23', ink, .8)) +
      '<text x="18" y="103" fill="currentColor" font-family="Times New Roman, Noto Serif, serif" font-size="7.4" font-weight="bold" letter-spacing="1.4">VIỆT NAM</text>' +
      postmark(code) + '</g>';
    if (mark) {
      const country = svg.querySelector('text'), origin = document.createElementNS(svg.namespaceURI,'text');
      country.setAttribute('y','95');
      country.setAttribute('font-size','5.6');
      origin.setAttribute('x','18');
      origin.setAttribute('y','104');
      origin.setAttribute('fill',ink);
      origin.setAttribute('font-family','monospace');
      origin.setAttribute('font-size','6.8');
      // Reserve the right-hand quarter for the cancellation. Keep every coordinate digit.
      if (Array.from(mark).length * 4.1 > 58) {
        origin.setAttribute('textLength','58');
        origin.setAttribute('lengthAdjust','spacingAndGlyphs');
      }
      origin.textContent = mark;
      country.after(origin);
    }
    return svg;
  };
})();

;
// sight-secret-stories.js
'use strict';

// Clues belong to the tour camera. The little scenes in the reveals are original
// keepsakes inspired by the place, including the imagined voices and movements.
window.sightSecretStories = {
  'hai-son-tu-san-tuong-quan-am':['lotus','Một sân chùa trên cao','Từ chân cầu thang nhìn ngang dưới sân lát gạch, có thể thấy gì?',
    'Các hàng cột đỡ sàn để hở khoảng trống bên dưới. Lên hết cầu thang, qua sân gạch mới nhìn thấy trọn những lớp cánh sen.'],
  'kien-luong-hon-phu-tu':['shell','Ba đảo ngoài khơi','Qua khỏi hòn Tử, giữa hòn Bà và hòn Ông còn thấy gì?',
    'Một luồng nước rộng tách hai đảo đá vôi. Hòn Bà ở gần bệ đá hòn Phụ Tử, còn hòn Ông nằm xa hơn về phía tây.'],
  'chua-hang-san-chua-va-rung-cay':['wing','Chim giữa sân chùa','Giữa các chậu kiểng trước nhà trưng bày, trên ngọn cột đỏ có hình gì?','Một con chim đậu trên đỉnh cột có thân xoắn. Ra phía rừng, những đốm trắng trong tán lá là đàn cò về đậu.'],
  'bao-tang-khmer-tra-vinh-tu-cong-den-dan-ngu-am':['arch','Ngồi giữa vòng cồng','Người chơi ngồi ở đâu khi gõ dàn cồng trong phòng trưng bày?','Hai đầu khung gỗ để hở một lối vào. Người chơi ngồi giữa lòng khung, dùng dùi gõ lên các núm cồng xếp quanh mình.'],
  'chua-ang-tu-hao-nuoc-den-chanh-dien':['arch','Qua hào vào sân chùa','Từ lối vượt hào tới chánh điện, phải đi lên mấy bậc nền chính?','Nền đá xanh bên ngoài cao 1,4 m. Qua sân lát gạch còn một nền thứ hai cao thêm 0,6 m, nâng gian thờ lên phía trên hai vòng rào.'],
  'ao-ba-om-qua-go-cat-va-bo-nuoc':['leaf','Đường rễ trên gò cát','Từ mặt ao đi vào dưới rừng cây có thể thấy phần nào của những cây cổ thụ nổi hẳn lên?','Các bộ rễ lớn nhô khỏi nền cát. Có đoạn rễ vươn ngang rồi lại cắm xuống đất, tạo thành khoảng trống ở chân cây.'],
  'vung-chua-tu-bai-xe-len-san-vieng':['leaf','Trên sườn núi Thọ','Trước khi tới sân viếng, từ đường đi bộ có thể nhìn thấy mái của công trình nào?','Giữa sườn cây là hai tầng mái của tháp chuông. Con đường lát đá vòng lên phía trên, nơi Đại tướng và phu nhân an nghỉ.'],
  'vung-chua-tu-hang-phi-lao-ra-dao-yen':['shell','Hòn Nồm ngoài cửa vũng','Hòn đảo xanh đối diện dải cát Vũng Chùa còn có tên nào?','Hòn Nồm là tên khác của Đảo Yến. Đứng ở bãi cát nhìn qua tán phi lao có thể nhận ra sườn bắc cao và mũi phía nam thấp hơn.'],
  'deo-ngang-qua-hoanh-son-quan':['arch','Tấm biển phía bắc','Người đi theo bậc đá từ phía Hà Tĩnh sẽ gặp chi tiết gì trên cửa?','Qua hết bậc đá, nhìn lên giữa mặt cổng thấy tấm biển mang tên Hoành Sơn Quan. Ở mặt nam, phần tường trên vòm để trơn.'],
  'dau-tich-tuong-thanh-dong-hoi':['arch','Góc gấp của hào','Từ phía Quách Xuân Kỳ nhìn về thành, dòng nước rẽ ở đâu?','Đến mũi đông bắc, hào đổi hướng ôm theo hai cạnh của thành. Lối gạch đỏ trên bờ cũng gấp theo góc đó.'],
  'thanh-dong-hoi-tu-hao-den-bao-tang':['arch','Một vòm qua hào','Từ bờ hào có thể đếm được bao nhiêu vòm dưới cầu Cửa Đông?','Một vòm cuốn có diềm gạch đỏ nằm giữa thân cầu đá xám. Qua đầu kia của cầu mới đến vòm thứ hai, nằm dưới gác canh của cửa thành.'],
  'dong-hoi-ven-song-nhat-le':['sail','Phù điêu bên mái chèo','Ở phía đường Quách Xuân Kỳ có thể thấy gì dưới chân tượng Mẹ Suốt?','Các gương mặt được chạm nổi trên mũi thuyền. Phía hướng ra sông có những nếp đá hình sóng.'],
  'quang-binh-quan-hai-mat-cong':['arch','Hai mặt của cổng','Bên nào của Quảng Bình Quan mở ra khu vườn nhỏ?','Mặt có vòm gạch và khu vườn quay về đường Lê Lợi. Phía đối diện, từ đường Quang Trung có thể thấy các bậc lên gác.'],
  'la-vang-tu-cong-den-linh-dai':['leaf','Ba cây bên Linh đài','Tượng Đức Mẹ La Vang đứng giữa những cây gì?','Ba cây đa bằng bê tông cốt thép bao quanh tượng ở Linh đài. Từ tháp chuông cũ, có thể thấy Linh đài ở phía đông.'],
  'hai-ben-tha-hoa-thach-han':['sail','Hai bờ sông Thạch Hãn','Bến tám cạnh nằm ở bờ nào?','Bến tám cạnh nằm trước đền tưởng niệm ở An Đôn, bên bờ bắc. Từ bậc đá trước nhà hành lễ ở bờ nam, có thể nhìn sang bến.'],
  'ganh-da-dia-den-ganh-den':['beacon','Từ bậc đá đến chân đèn','Qua Gành Đá Đĩa về phía bắc, dấu hiệu nào hiện rõ trên tháp đèn?','Trên những tảng đá ở Gành Đèn, các khoang sơn đỏ và trắng xen nhau trên sáu mặt tháp.'],
  'nui-nhan-tuy-hoa':['wing','Hai dáng hình trên núi Nhạn','Sau khi rời sân tháp gạch, có thể gặp hình cánh nhạn ở đâu?','Ở phía nam ngọn núi, những cánh nhạn trong kiến trúc đài tưởng niệm vươn lên trên mái nhà bia.'],
  'nha-trung-bay-hien-luong':['echo','Hai chiếc loa trước thềm','Chi tiết nào nằm hai bên cầu thang trong ảnh nhà trưng bày?','Hai loa hình nón hướng ra sân. Sau bậc thềm là nhà trưng bày về đời sống hai bờ sông Bến Hải trong những năm chia cắt.'],
  'doi-bo-hien-luong-ben-hai':['sail','Hai màu trên sông','Đứng ở vạch trắng giữa cầu và nhìn về Kỳ đài, lan can có màu gì?','Lan can phía bắc sơn xanh. Phía nam là nửa cầu màu vàng và tượng mẹ con nhìn qua sông.'],
  'vinh-moc-tu-san-den-bo-bien':['shell','Bờ cuội ngoài cửa số 4','Sau khoảng tối ở cửa số 4, lối bậc mở ra đâu?','Từ bậc cuối thấy bờ cuội và mặt biển Vĩnh Linh. Trong khu di tích còn có sân đón khách, nhà trưng bày và gian hộ sinh.'],
  'chung-tich-tam-toa':['arch','Nhìn qua vòm Tam Tòa','Từ phía đường Nguyễn Du, qua cửa vòm có thể thấy gì ở nền nhà thờ cũ?','Một trụ gạch còn đứng trên nền phía đông tháp, về hướng sông Nhật Lệ.'],
  'nha-trung-bay-phu-yen':['arch','Chiếc trống ở lối vào','Từ sân Trần Phú, nhìn vào khoảng trống giữa hai cánh nhà. Nó gợi hình gì?','Khoảng cửa sảnh phác hình chiếc trống đồng. Dải cột trắng phía trên xòe ra như chiếc mũ vua Hùng.'],
  'vung-su-den-vung-chao':['sail','Hai bờ vũng','Ở bãi thúng dưới chùa Liên Phú, nhìn ra mặt nước có thể thấy gì?','Một cù lao nhỏ phủ cây nằm ngoài Vũng Sứ. Xa hơn về phía bắc là mũi cây và bãi triều Vũng Chào.'],
  'chua-thanh-luong-hai-ho':['drop','Hai mặt nước trong sân chùa','Tượng Quan Âm Nam Hải nhô lên từ hồ nào?','Ở hồ Long Ẩn, bàn tay và vai tượng nhô lên trên mặt nước. Thủy tạ nằm ở hồ Long Thủy, phía trước chính điện.'],
  'tuy-an-mang-lang-o-loan-hon-yen':['shell','Hai hòn ngoài bờ Nhơn Hội','Nhìn từ Mũi Yến ra biển, hòn nào nằm gần đất liền hơn?','Hòn Đụn thấp nằm gần bờ. Qua một khoảng nước nữa là khối Hòn Yến cao hơn, có những vách đá dốc.'],
  'tu-bai-mon-len-mui-dien':['beacon','Từ bãi cát lên ngọn đèn','Từ bãi nhìn thấy đèn biển ở đâu?','Tháp đèn đứng trên mũi núi phía nam Bãi Môn. Men theo lối bộ trên sườn có thể nhìn lại cửa suối trước khi đến khu hải đăng.'],
  'bai-huong-ra-hon-nua':['sail','Qua vịnh tới bãi cát','Rời Bãi Hương bằng ca nô, bãi cát chính nằm ở mặt nào của Hòn Nưa?','Bãi nằm ở phía tây đảo, giữa các doi đá. Từ trên bãi có thể nhìn ngược về bờ vịnh Vũng Rô.'],
  'vung-ro-ben-tau-khong-so':['sail','Mũi tàu trên sân lễ','Ở Bãi Chùa, hình gì nhô ra giữa hai bức phù điêu?','Một mũi tàu trắng mang hai mỏ neo. Phía trên có bánh lái và ngọn lửa đỏ.'],
  'ho-dambri-va-cau-chu-y':['drop','Chỗ rẽ giữa dòng','Hai lối cầu đi bộ gặp nhau dưới chân thác Đambri tạo thành hình chữ gì?','Cầu có hình chữ Y. Từ chỗ các nhánh gặp nhau có thể nhìn ngược dòng lên màn nước chính.'],
  'bien-ho-che-chua-buu-minh':['leaf','Con đường qua đồi chè','Từ loài cây nào bên đường có thể nhìn qua các luống chè trước khi tới chùa Bửu Minh?','Hai hàng thông cao vươn tán trên mặt đường. Ô chè bên đường có những luống thấp chạy gần vuông góc với hàng cây.'],
  'buon-ma-thuot-biet-dien-nha-day-dinh-lac-giao':['arch','Sân đình giữa phố','Qua cổng đình Lạc Giao ở đường Điện Biên Phủ, bạn thấy gì dưới tán cây trước chính điện?','Bình phong và đôi hạc đứng trong sân gạch. Từ sân nhìn vào có thể thấy hai cột rồng đỡ mái hiên chính điện.'],
  'bien-ho-pleiku-mui-dau-rua':['lotus','Đài sen trên mũi đất','Ở đầu mũi Đầu Rùa, bộ phận nào nằm giữa thân tượng trắng và bệ tám cạnh?','Đó là đài sen cao 3 m. Từ lối đi quanh sân, có thể nhìn qua lan can xuống mặt hồ ở cả hai phía mũi đất.'],
  'ho-lak-buon-jun-biet-dien':['sail','Từ mũi buôn Jun','Con đường nào dẫn đến bến thuyền ở đầu mũi buôn Jun?','Đường Y Jút đi dọc mũi đất rồi gặp đường lát ven bờ. Từ đầu bến có thể nhìn qua lòng hồ tới những dải đồi xa.'],
  'pho-cu-go-cong':['arch','Ba nếp nhà của đình','Từ phố Phan Chu Trinh, ba nếp nhà của Đình Trung nối nhau theo thứ tự nào?','Phía chợ là võ ca. Qua võ quy ở giữa mới đến chánh điện. Cách đó một quãng đi bộ, Nhà Đốc Phủ Hải có tiền sảnh quay ra đường Hai Bà Trưng.'],
  'sa-dec-nha-co-lang-hoa':['leaf','Chậu hoa trên mặt nước','Trong nhà vườn Tân Quy Đông, người trồng kê chậu hoa lên đâu?','Những hàng chậu nằm trên giàn bắc phía trên mặt nước. Lối nhỏ giữa các giàn giúp người trồng tiếp cận từng luống để chăm hoa.'],
  'suoi-cham-thac-hieu-pu-luong':['drop','Nước về bản','Ở Chiềng Lau, nước suối theo đường nào mới tới ruộng?','Dọc mương, những ống tre trên vành guồng múc nước lên cao rồi đổ vào máng dẫn về ruộng. Ở bản Hiêu, nước từ vùng núi đá vôi chảy tự nhiên qua các bậc thác.'],
  'chua-thay-tay-phuong':['arch','Hai ngôi chùa xứ Đoài','Ở chùa Thầy và chùa Tây Phương, hai con đường dẫn người xem tới các tòa chùa khác nhau thế nào?','Chùa Thầy nhìn ra hồ Long Trì với thủy đình và hai cầu ngói. Đến Tây Phương, đường bậc đá ong lên đỉnh đồi dẫn tới ba tòa chùa song song.'],
  'dinh-va-thac-bach-ma':['drop','Từ lầu ngắm tới dòng suối','Sau khi ngắm núi ở Hải Vọng Đài, nước hiện ra dưới những dạng nào trên tuyến?','Ở Ngũ Hồ, nước tụ trong các lòng hồ và tràn qua ghềnh đá. Tới Đỗ Quyên, dòng thác đổ xuống vách núi.'],
  'dat-ngap-nuoc-tram-chim':['leaf','Nhìn Tràm Chim từ hai độ cao','Từ đài quan sát xuống bến khách, tầm mắt thay đổi ra sao?','Ở trên đài có thể nhìn qua tán tràm và các khoảng cỏ. Xuống gần mặt nước, bờ kênh và những thân tràm hai bên hiện rõ hơn.'],
  'cao-nguyen-da-dong-van':['ridge','Hai ngọn núi bên ruộng','Đứng ở đài ngắm Quản Bạ nhìn xuống, có thể nhận ra Núi Đôi bằng dáng nào?','Hai đỉnh tròn nhô lên sát nhau giữa cánh đồng. Đi tiếp về Đồng Văn, đá vôi còn hiện ra thành những mỏm nhọn ở Lũng Táo.'],
  'vuon-quoc-gia-cuc-phuong':['leaf','Dấu rừng trên đường tới Bống','Đi qua Hồ Mạc rồi theo đường rừng về Bống, những thân cây nào có tên riêng trên tuyến?','Cây Sấu cổ thụ và cây Chò ngàn năm là hai điểm dừng khác nhau. Từ các lối mòn có thể dừng lại quan sát gốc cây và tầng lá phía trên.'],
  'tuong-niem-dien-bien-phu':['ridge','Từ sân lễ lên đồi','Sau khoảng sân ở chân đồi D1, con đường tham quan dẫn tới đâu?','Từng vế bậc đưa người xem lên đỉnh đồi, nơi đặt tượng đài Chiến thắng. Quãng dừng ở Nghĩa trang liệt sĩ A1 dành để tưởng niệm.'],
  'di-tich-co-loa':['drop','Vòng nước trước đền','Từ đền thờ An Dương Vương nhìn ra, vòng nước nhỏ nằm ở đâu?','Trong lòng hồ trước đền có giếng Ngọc. Từ mép hồ đi tiếp tới đình Ngự Triều Di Quy, am Mỵ Châu và chùa Cổ Loa.'],
  'khu-di-tich-den-hung':['ridge','Ba tên trên một đường lên núi','Theo lối lên Nghĩa Lĩnh, ba ngôi đền mang tên chỉ vị trí nào?','Từ chân núi, đường đi lần lượt qua Đền Hạ, Đền Trung rồi lên Đền Thượng. Cổng cũ dưới chân núi khác với cổng lớn ngoài quảng trường lễ hội.'],
  'bao-tang-ha-noi':['gear','Ô vuông lồng nhau','Nhìn gần mặt ngoài Bảo tàng Hà Nội, lớp kính nằm phía sau thứ gì?','Trước kính là một lớp chắn nắng có họa tiết ô vuông. Tầng phía trên vươn xa hơn, đổ bóng xuống mép tầng phía dưới.'],
  'bao-tang-phu-nu-viet-nam':['ink','Những ô màu trên phố','Từ bậc thềm bảo tàng ở phố Lý Thường Kiệt, em nhìn thấy những mảng màu ở đâu?','Phía trên mái sảnh, những ô cửa màu nằm giữa hai dải kính cao. Dãy nhà bên trái kéo dài về phía sân.'],
  'bao-tang-my-thuat-viet-nam':['arch','Nửa vòng tròn giữa sân','Ở Bảo tàng Mỹ thuật Việt Nam, lối vào nhô ra khỏi dãy cửa sổ theo nét gì?','Nhìn từ vườn, hàng cột ôm lấy một nửa vòng tròn. Trên cao, mái ngói giữa nhà uốn lên ở hai đầu.'],
  'kien-truc-bao-tang-ha-noi':['ink','Ba mặt đứng thủ đô','Có thể nhận ra ba bảo tàng từ ba chi tiết nào ngoài sân?','Một sảnh tròn dưới mái ngói, một hàng cửa màu trên nền trắng, rồi bốn tầng vuông vươn dần ra ngoài. Mỗi hình là một điểm dừng trong sổ ký họa Hà Nội.'],
  'dinh-chua-dao':['leaf','Bóng mát dưới hàng hiên','Ở Dinh Chúa Đảo, lớp mái nào che cho người đứng ngoài cửa?','Phía dưới mái chính còn một lớp ngói thấp che hàng hiên. Bóng cột vuông nằm dọc theo lan can.'],
  'so-co-con-dao':['arch','Hai cánh cổng vàng','Hai bức tường trước Sở Cò dẫn mắt về đâu?','Theo đường cong của tường vàng, mắt gặp khoảng mở giữa hai trụ cổng rồi nhìn tới mái ngói phía trong.'],
  'bia-cau-tau-914':['ink','Trang đá bên vịnh','Bia nằm ở đoạn nào trên đường từ phố ra biển?','Ngay đầu cầu phía bờ, người đến thăm có thể dừng lại trước bia để tưởng nhớ những người đã mất khi xây cầu.'],
  'cau-tau-914':['sail','Bến đá giữa vịnh','Đi hết dải cầu hẹp, đường viền của bến thay đổi thế nào?','Hai mép đá mở rộng ở đầu ngoài. Nhìn từ đó về bờ, thân cầu thành một nét dài nối vịnh Côn Sơn với phố.'],
  'di-tich-con-dao':['ink','Từ hiên dinh ra biển','Đứng ở đầu Cầu tàu 914 nhìn về đất liền sẽ gặp di tích nào?','Qua con đường ven vịnh và khoảng sân là Dinh Chúa Đảo. Những nơi ở rất gần nhau lưu giữ những phần khác nhau của lịch sử Côn Đảo.'],
  'cum-thap-hoa-lai':['arch','Khoảng trống giữa hai tháp','Ở Hòa Lai, dấu vết tháp nào nằm thấp hơn hai tháp còn đứng?','Ở giữa tháp Bắc và tháp Nam là nền gạch của tháp Giữa. Nền thấp còn giữ vị trí của công trình trong hàng ba tháp.'],
  'thap-cham-binh-dinh':['arch','Đếm bóng tháp','Từ Tháp Đôi tới Dương Long, đường chân trời đổi ra sao?','Hai tháp đứng cạnh nhau ở Quy Nhơn. Lên tới Dương Long, ba khối tháp lại in bóng trên nền trời.'],
  'di-tich-pac-bo':['drop','Màu nước Pác Bó','Dòng nước nào đưa mắt từ chân núi về phía hang Cốc Bó?','Suối Lê Nin chảy dưới chân núi Các Mác. Bờ đá, mặt nước và vòm hang xuất hiện lần lượt trên đường tham quan.'],
  'ban-gioc-nguom-ngao':['echo','Một miền đá vôi','Qua Khuổi Ky tới Ngườm Ngao, đá xuất hiện dưới những hình dáng nào?','Đá nằm trong tường nhà ở Khuổi Ky, rồi cao dần thành vách và vòm ở Ngườm Ngao. Phía Bản Giốc, dòng nước trắng đổ qua bậc đá.'],
  'di-tich-nui-sam':['ridge','Nhìn lại từ Núi Sam','Quanh Núi Sam, hai góc nhìn nào cách nhau cả một sườn núi?','Sau khi ngắm các mái chùa và miếu ở chân núi, lên cao có thể nhìn xa qua đồng bằng Châu Đốc.'],
  'chua-soc-trang':['leaf','Sổ ký họa Sóc Trăng','Nếu vẽ một chi tiết ở mỗi chùa, em sẽ chọn gì?','Trang dành cho Chùa Đất Sét giữ một nét riêng bên những trang vẽ chùa Khmer. Mỗi điểm dừng làm quyển sổ của Sóc Trăng dày thêm.'],
  'oc-eo-ba-the':['ink','Nét nền dưới chân Ba Thê','Ở Gò Cây Thị, điều gì vẫn đọc được từ những lớp gạch thấp?','Đường viền nền gạch ghi lại hình dáng kiến trúc xưa. Từ gò sang Nam Linh Sơn là một trang khác của Óc Eo.'],
  'cot-co-ha-noi':['star','Ô hoa của Kỳ Đài','Dọc theo thân bát giác, ánh sáng đi qua những ô cửa hình gì?','Một ô hoa lọt lên trang giấy. Phía trên nó, lá cờ vẫn đang mở ra trong gió.'],
  'bac-mon-thang-long':['arch','Một ô phố qua Cửa Bắc','Đứng từ phố Phan Đình Phùng, em thấy gì phía trên vòm cổng?','Nét vòm ôm lấy bóng phố. Ba chữ trên biển đá nằm ngay dưới mái vọng lâu.'],
  'osm-way-185531692':['lantern','Đầu đao Hậu Lâu','Nhìn qua khung cửa trên lầu, em thấy mái nào cao hơn?','Từ bờ mái thấp, nét vẽ lần theo góc đao rồi dừng lại ở lầu nhỏ giữa nóc.'],
  'osm-way-185535416':['leaf','Một mái nhà dưới tán xanh','Những ô chớp bên hành lang bắt lấy màu gì?','Một góc lá lọt vào ô cửa xanh của nhà D67. Mái hiên đổ bóng dài trên trang vở.'],
  'osm-relation-21404421':['ink','Dưới mái che Hoàng Diệu','Giữa nền đất khai quật, dấu tích nào khép lại thành vòng?','Các hàng móng vuông dừng bên vòng gạch của giếng cổ. Nét chì lần theo từng lớp gạch trên trang.'],
  'thanh-nha-ho':['arch','Bốn ngả về Tây Đô','Mặt thành nào có ba khoảng trời dưới đá?','Ba vòm cửa Nam mở thành ba ô nhỏ trên trang sổ. Ba cổng còn lại mỗi cổng giữ một ô trời riêng.'],
  'cong-bac-thanh-ho':['arch','Một vệt nắng ở cửa Bắc','Mạch đá nào dẫn mắt từ chân tường lên nóc cổng?','Nét bút lần qua những hàng đá nhỏ rồi dừng trên nền lầu cũ. Một vệt nắng hẹp vừa qua khỏi vòm.'],
  'cong-dong-thanh-ho':['echo','Tiếng bước dưới vòm Đông','Một tiếng bước chân đi được bao xa dưới trần đá?','Âm vang chạy theo từng khoanh đá ghép, tới ngưỡng bên kia mới tan vào cánh đồng.'],
  'cong-tay-thanh-ho':['ridge','Vai đá cổng Tây','Chỗ nào trên cổng còn giữ đường cong sau khi những phiến lát nóc đã mất?','Một nét cong in giữa hai vai tường thấp. Bên dưới, con đường làng lọt qua khuôn dấu.'],
  'la-thanh-tay-do':['leaf','Sống đất giữa đồng','Lần theo đường cỏ nào sẽ thấy lũy ngoài của Tây Đô?','Cánh đồng ngắt quãng ở một dải đất cao. Dọc sống lũy, ngọn cỏ để lại một đường xanh trên giấy.'],
  'van-mieu-quoc-tu-giam': ['ink', 'Nét mực bên giếng', 'Cửa sổ tròn của gác Khuê Văn soi xuống đâu?', 'Trên trang giấy hiện một vòng tròn đỏ. Bóng gác chạm mặt giếng Thiên Quang, giữa hai dãy nhà bia.'],
  'turtle': ['turtle', 'Bọt tăm Hồ Gươm', 'Ai vừa làm bóng Tháp Rùa rung lên?', 'Một chiếc mai nhỏ nổi lên giữa bóng tháp. Nó lặn mất, để lại ba vòng nước cứ rộng dần.'],
  'cathedral': ['wing', 'Chú gà đón gió', 'Trên nền hồng có ai biết gió từ đâu tới?', 'Chú gà trên đỉnh tháp xoay mỏ về phía sông Hàn. Một chiếc lông đồng lấp lánh trên nền trời.'],
  'market': ['gear', 'Một phút ở Bến Thành', 'Nếu đồng hồ chợ có túi, nó sẽ cất gì trong đó?', 'Từ mặt đồng hồ cửa Nam rơi ra một phút gói trong tờ giấy nâu. Mở ra còn thơm mùi cà phê chợ sớm.'],
  'sapa': ['echo', 'Chuông trong túi sương', 'Một tiếng chuông có đi lạc giữa sương Sa Pa?', 'Sương ôm tháp chuông của nhà thờ đá. Một tiếng ngân thoát ra, lăn xuống từng bậc thềm như hạt nước.'],
  'coal': ['ink', 'Nét ký họa bằng than', 'Khối nhà màu than sẽ vẽ gì nếu được cầm bút?', 'Một nét đen sắc như cạnh kính phác dãy núi trên vịnh. Bụi than dính ở mép tranh lấp lánh dưới nắng.'],
  'flag': ['sail', 'Mảnh gió Kỳ Đài', 'Lá cờ trên Kỳ Đài giữ được thứ gì của sông Hương?', 'Gió sông Hương căng lá cờ rồi trốn vào một nếp vải. Trên mảnh vải nhỏ vẫn còn một gợn sóng.'],
  'ponagar': ['arch', 'Màu nắng trong gạch', 'Qua một vòm tháp Bà, nắng sẽ đổi màu gì?', 'Nắng qua khung cửa Po Nagar thành một dải màu đất nung. Dải màu thu lại vừa khít một viên gạch nhỏ.'],
  'nghinh': ['echo', 'Khe gió biết hát', 'Giữa hai khối tháp, gió Tuy Hòa chừa lại một nốt.', 'Hai dãy cột Nghinh Phong hóa thành những phím đàn. Gió từ biển chạy dọc các phím rồi nghỉ ở khoảng trống giữa tháp.'],
  'rong': ['ridge', 'Nếp gấp Kon Klor', 'Một tờ giấy phải gấp cao đến đâu mới giống mái nhà rông?', 'Tờ giấy gấp đôi, nếp giữa vươn lên thành mái nhà rông Kon Klor. Hai mép giấy bên dưới còn nguyên khoảng sân để ngồi chơi.'],
  'station': ['gear', 'Vé qua ba chóp mái', 'Ở ga Đà Lạt, đường chân trời có ba nhịp nhô lên.', 'Tấm vé nhỏ chạy dọc đường ray bằng mực. Dấu bấm trên vé để lại ba chóp mái nhà ga thay cho ba lỗ tròn.'],
  'bat': ['wing', 'Đôi cánh xếp', 'Có chiếc lá nào ở Chùa Dơi biết tự gấp mình?', 'Chiếc lá sẫm treo ngược bỗng mở thành hai cánh dơi. Một nhịp vỗ nhẹ là nó lẫn vào tán cây.'],
  'dinh': ['shell', 'Ốc nghe sóng Dinh Cậu', 'Chiếc vỏ ốc bên ghềnh Dinh Cậu giữ hộ tiếng gì?', 'Áp tai vào vỏ ốc tưởng tượng, nghe một con sóng Phú Quốc vỡ vào đá. Sau con sóng là tiếng nước rút tí tách.'],
  'bach-khoa-ha-noi': ['gear', 'Đường cong trong vở nháp', 'Một nét bút nào đưa được cả cổng trường vào vở?', 'Trên trang giấy ô ly, đầu bút vạch một parabol. Hai chân nét vẽ vừa chạm dòng kẻ thì cổng Bách khoa hiện ra.'],
  'ganh-da-dia': ['drop', 'Chiếc đĩa của thủy triều', 'Những chiếc đĩa đá ngoài gành mời biển món gì?', 'Nước mặn đọng trên một mặt cột bazan rộng như chiếc đĩa. Một bọt sóng nhảy vào giữa, vừa kịp bữa cơm của biển.'],
  'hon-chong': ['ridge', 'Khoảng trời giữa hai đá', 'Có một mẩu trời mắc kẹt trong chồng đá Nha Trang.', 'Hai khối đá Hòn Chồng giữ một khe sáng mỏng tang. Nhìn qua khe, mặt vịnh đủ nhỏ để mang về trong túi áo.'],
  'da-ba-chong': ['ridge', 'Ba viên sỏi đứng thẳng', 'Ba hòn đá cao giữa Định Quán giấu mẹo thăng bằng nào?', 'Ba viên sỏi thu nhỏ xếp chồng trên trang giấy. Viên trên cùng nhích một chút rồi nằm yên, hệt khối đá bên đường.'],
  'ban-gioc': ['drop', 'Mũi khâu Quây Sơn', 'Ai khâu những tấm rèm trắng giữa dòng Quây Sơn?', 'Một giọt nước luồn qua các bậc đá vôi như mũi kim. Khi giọt cuối rơi xuống, cả tấm rèm Bản Giốc bung thành bụi nước.'],
  'pongour': ['echo', 'Bảy phím Pongour', 'Dòng nước sẽ chơi bản gì trên bảy bậc đá?', 'Bảy bậc thác thành bảy phím đàn xòe rộng. Dòng nước lướt một lượt từ trên xuống, bỏ lại nốt cuối trong lòng sông.'],
  'dray-nur': ['drop', 'Đường chỉ Sêrêpốk', 'Màn nước Dray Nur để lọt màu gì qua kẽ trắng?', 'Giữa thác trắng, một đường đá sẫm hiện ra. Chớp mắt, dòng Sêrêpốk đã kéo sợi nước mới qua chỗ hở.'],
  'phong-nha': ['echo', 'Một mái chèo, hai tiếng nước', 'Sông Son mang vào động một âm thanh. Có mấy âm thanh trở ra?', 'Mái chèo khua nước ngay cửa Phong Nha. Vòm đá trả lại một tiếng khua nhỏ hơn, như có chiếc thuyền thứ hai trong bóng tối.'],
  'my-son': ['arch', 'Dấu tháp trong thung lũng', 'Ở nhóm A, còn dấu nào cho thấy người xưa xây tháp ngay trên nền gạch này?', 'Trên nền A1 còn dấu hai cửa theo trục đông – tây. Đi tiếp sang A10 có thể nhìn thấy đài thờ bằng sa thạch.'],
  'ben-beo-vinh-lan-ha': ['sail', 'Từ phố ra vịnh', 'Đến cuối phố Cái Bèo, hành trình ra vịnh tiếp tục bằng cách nào?', 'Phố dừng ở cầu tàu Bến Bèo. Từ đó, thuyền men theo các đảo đá vôi để ra vịnh Lan Hạ.'],
  'chua-huong-huong-son':['sail','Từ suối Yến lên Hương Tích','Rời đò ở bến Trò, bạn đến chùa nào trước khi lên động Hương Tích?','Con đường từ bến Trò dẫn lên chùa Thiên Trù. Từ sân chùa, đường bộ trên núi tiếp tục qua Giải Oan rồi tới lối xuống động Hương Tích.'],
  'binh-san-thach-dong-ha-tien':['ridge','Từ Bình San đến Thạch Động','Trên tuyến Hà Tiên, ngôi chùa nào nằm ngay trong lòng núi đá vôi?','Rời đền họ Mạc và chùa Phù Dung dưới chân Bình San, đi về phía Thạch Động sẽ đến chùa Tiên Sơn. Phía trên mái chùa là vòm đá của hang.'],
  'dinh-doc-lap': ['leaf', 'Bóng trúc bằng đá', 'Có hàng trúc nào ở Dinh Độc Lập đứng yên cả khi gió thổi?', 'Rèm hoa đá mặt dinh in một dãy đốt trúc lên sàn. Nắng nhích đi một chút, cả hàng bóng cùng bước.'],
  'ke-ga': ['beacon', 'Vệt sáng tám cạnh', 'Tám cạnh tháp Kê Gà chia nhau một vòng trời thế nào?', 'Ngọn đèn quay một vòng trên tháp đá. Vệt sáng thu nhỏ lại, xếp thành tám nếp quanh một con sóng.'],
  'hon-trong-mai': ['wing', 'Hai chiếc bóng chạm mỏ', 'Giữa hai hòn đá còn vừa một khoảng trời bằng bao nhiêu?', 'Hai bóng đá trên mặt vịnh nghiêng về nhau. Một con sóng khép khoảng trống giữa hai chiếc mỏ lại rồi mở ra.'],
  'cho-noi-cai-rang': ['sail', 'Lời rao trên cây bẹo', 'Ở Cái Răng, lời rao nào cần một cây sào mà chẳng cần tiếng nói?', 'Một trái thơm đung đưa trên đầu cây bẹo. Ghe bên kia sông đã biết ghe này bán gì trước khi hai mũi ghe chạm sóng.'],
  'ben-thuyen-trang-an': ['sail', 'Dấu ngoặc của mái chèo', 'Có ai viết được lên mặt nước Tràng An?', 'Hai mái chèo mở một cặp ngoặc trên mặt sông. Trong ngoặc vừa khéo có bóng một ngọn núi đá vôi.'],
  'bao-tang-chien-thang-dien-bien-phu': ['ink', 'Mắt lưới Điện Biên', 'Một mắt lưới nhỏ có thể gợi hình cả khối bảo tàng.', 'Một nét chì lần theo những ô quả trám của mặt đứng. Khép trang ký họa lại, đường cong của chiếc mũ vẫn in trên giấy.'],
  'dinh-thu-ho-vuong': ['drop', 'Hạt mưa qua ba sân', 'Giọt mưa trên ngói máng sẽ hẹn nhau ở sân nào?', 'Hạt mưa lăn theo lòng viên ngói rồi nhỏ xuống hiên dinh họ Vương. Trên trang ký họa, ba sân trong lần lượt thẫm màu.'],
  'hang-coc-bo': ['ink', 'Một nét ở cửa hang', 'Khoảng sáng trước cửa Cốc Bó vừa đủ đặt một nét chì.', 'Nét chì dừng ngay cửa hang hẹp. Trên trang giấy còn lại lối đá đi vào nơi Chủ tịch Hồ Chí Minh từng sống và làm việc.'],
  'buu-dien-sai-gon': ['ink', 'Con tem chưa có địa chỉ', 'Dưới đồng hồ bưu điện, có lá thư nào gửi cho chính chuyến đi?', 'Một con tem viền răng cưa in vòm cửa vàng và đôi cánh chớp xanh. Góc dấu bưu điện còn chừa chỗ cho ngày bạn ghé.'],
  'cot-co-mui-ca-mau': ['leaf', 'Lá đước ở cuối bản đồ', 'Mũi đất cuối bản đồ sẽ chọn chiếc lá nào để làm dấu trang?', 'Chiếc lá đước nằm ngang bản đồ ngay chân cột cờ. Cuống lá thò ra mép giấy, chỉ đường trở về Đất Mũi.'],
  'bau-trang': ['ridge', 'Bức thư gió viết trên cát', 'Chữ của gió ở Bàu Trắng có dấu thanh chăng?', 'Gió vạch những dòng song song trên cồn cát. Một bụi cỏ nghiêng sang, đặt dấu phẩy ngay bên mép bàu.'],
  'doi-che-tan-cuong': ['leaf', 'Búp chè làm dấu trang', 'Nếu gấp nhỏ cả đồi chè Tân Cương, còn lại hình gì?', 'Những luống chè thu lại thành đường gân trên một búp non. Đường đất giữa hai luống vừa thành cuống lá.'],
  'quyt-hong-lai-vung': ['leaf', 'Mặt trời của nhà vườn', 'Mương tưới ở Lai Vung soi được bao nhiêu mặt trời?', 'Một trái quýt hồng cúi sát mặt mương. Hai đốm cam đung đưa, một trên cành, một ở dưới nước.'],
  'thac-vuc-hom': ['echo', 'Đàn đá Vực Hòm', 'Những đầu cột bazan nhô bên thác đang chờ nhịp gì?', 'Giọt nước gõ lần lượt lên các đầu cột đá. Nốt trầm nhất rơi xuống vũng ở chân Vực Hòm.'],
  'rung-tram-u-minh-thuong': ['leaf', 'Trang thư vỏ tràm', 'Rừng U Minh có loại giấy nào tự bong khỏi thân cây?', 'Một lớp vỏ tràm mỏng cuộn như lá thư bên con rạch. Mặt nước màu sẫm chép lên đó một hàng thân cây trắng.'],
  'hai-dang-hon-bai': ['beacon', 'Đốm sáng bỏ túi', 'Cần bao nhiêu tầng tháp để thắp một chấm Hòn Bài?', 'Ngọn hải đăng trắng thấp bé thu gọn vừa góc tranh. Một nét sáng từ đỉnh tháp thì chạy mãi ra tận mép giấy.'],
  'hai-dang-cua-tung': ['shell', 'Vỏ ốc Cửa Tùng', 'Dải đen trắng ở Cửa Tùng đang cuốn quanh điều gì?', 'Những vòng màu trên thân tháp kéo dài thành một đường xoắn. Cuộn gọn đường ấy trong tay, bạn được chiếc vỏ ốc mang màu hải đăng.'],
  'lung-cu': ['ridge', 'Đường viền cực Bắc', 'Một nếp gấp nào sẽ giữ được gió trên đỉnh Lũng Cú?', 'Mép cờ gấp lại một nếp khi gió đổi chiều. Phía sau nếp vải, đường núi Hà Giang hiện thành một nét răng cưa.'],
  'nha-hat-cao-van-lau': ['echo', 'Điệu đàn dưới ba vành nón', 'Ba chiếc nón khổng lồ ở Bạc Liêu đang cùng nghe gì?', 'Ba vành mái nghiêng xuống như người ngồi nghe đàn. Một nốt nhạc tròn lăn dọc vành nón rồi rơi xuống mặt nước.'],
  'cong-nam-thanh-ho': ['arch', 'Viên đá khóa vòm', 'Nếu vòm cổng biết vẽ, nét cuối cùng sẽ nằm ở đâu?', 'Từng nét chì xếp thành vòm đá của cổng Nam. Viên ở chính giữa khép vòng cung lại, chừa khoảng trời nằm yên bên dưới.'],
  'tam-chuc': ['ridge', 'Hồ gấp thành núi', 'Có thể gấp mặt hồ Tam Chúc vào đúng đường viền núi không?', 'Tờ ký họa gập lại ngay ở mép hồ. Dãy núi chạm vào bóng mình, còn Chùa Ngọc nằm vừa trên nếp gấp.'],
  'thuy-dinh-tam-chuc': ['sail', 'Hai nét bút ra hồ', 'Có hai đường mảnh nào cùng dẫn tới một mái nhà trên hồ?', 'Hai chiếc cầu bộ vươn từ bờ như hai nét bút. Giữa trang nước, ba tầng mái Thủy Đình hiện lên đúng chỗ đầu bút gặp nhau.'],
  'tam-quan-noi-tam-chuc': ['arch', 'Ba nhịp mở sân', 'Mái tam quan gấp khúc như một nhịp lên, hai nhịp xuống.', 'Nét mái từ lầu bên vươn lên lầu giữa rồi hạ xuống. Từ ba nếp gấp ấy mở ra khoảng sân dẫn đến Vườn Cột Kinh.'],
  'vuon-cot-kinh': ['lotus', 'Nụ sen sáu mặt', 'Trong Vườn Cột Kinh, bông sen nào nở trên đá?', 'Sáu mặt cột đón sáu vệt sáng mảnh. Ở đầu cột, các vệt chụm vào nhau thành một nụ sen đá.'],
  'dien-quan-am': ['lotus', 'Con đường trong cánh sen', 'Từ hiên điện Quan Âm, một đường thẳng nối bậc thềm với mặt hồ.', 'Một cánh sen khẽ khum lại. Trên đường gân giữa cánh là bậc thềm, sân cột kinh và một vạt hồ xa.'],
  'dien-phap-chu': ['ink', 'Nét chì trên phù điêu', 'Một đường viền của bức phù điêu sẽ kể được bao xa?', 'Nét chì men theo phù điêu ở điện Pháp Chủ, dừng lại dưới hai tầng mái cong. Trên tờ giấy còn một đoạn trong câu chuyện về cuộc đời Đức Phật.'],
  'dien-tam-the': ['echo', 'Ba nếp thời gian', 'Ba nếp mái ở điện Tam Thế có thể nằm trên cùng một trang.', 'Nếp đầu giữ chuyện đã qua, nếp giữa giữ giây phút đứng ở đây. Nếp cuối vẫn mở, như khoảng trời trên mái điện.'],
  'chua-ngoc-tam-chuc': ['star', 'Hạt sáng trên Thất Tinh', 'Từ đỉnh Thất Tinh, mặt hồ nhỏ đi đến mức nào?', 'Một hạt sáng đậu trên mái Chùa Ngọc. Trong hạt sáng có màu đỏ của đá granit và cả một chấm xanh của hồ dưới núi.'],
  'dinh-tam-chuc': ['wing', 'Cánh cò qua năm nhịp', 'Một nét gấp khúc trên hồ Lục Nhạc dẫn đến đảo mang tên loài chim nào?', 'Đường cầu năm đoạn in xuống mặt hồ. Một cánh cò giấy lướt hết năm chỗ ngoặt rồi đậu bên đảo đình.'],
  'chua-ba-danh': ['echo', 'Khoảng lặng bên sông Đáy', 'Ở chùa Bà Đanh, một tiếng nước đủ làm đầy khoảng lặng nào?', 'Một tiếng nước vỗ bờ sông Đáy lọt qua ba cửa gỗ. Khi âm thanh tan hết, bóng tam quan còn nằm yên trên trang giấy.'],
  'khu-luu-niem-nguyen-du': ['ink', 'Cặp dòng sáu tám', 'Một dòng ngắn đứng cạnh một dòng dài, cùng nhớ Tiên Điền.', 'Sáu chấm mực rồi tám chấm mực nối nhau trên trang. Nhịp lục bát vừa đủ làm dấu cho lần ghé quê Nguyễn Du.'],
  'nga-ba-dong-loc': ['leaf', 'Một cành lá ở ngã ba', 'Giữa những lối rẽ Đồng Lộc, có khoảng lặng dành để nhớ.', 'Một cành lá nhỏ đặt trên trang ghi hai chữ Đồng Lộc. Khoảng giấy dưới tên địa danh dành để tưởng nhớ mười nữ thanh niên xung phong.'],
  'hien-luong': ['sail', 'Hai bờ một dòng', 'Đường nước Bến Hải đi qua dưới cầu bằng bao nhiêu nét?', 'Một nét mực xanh nối bóng đôi bờ dưới cầu Hiền Lương. Nét bút đi từ bờ này đến bờ kia trong một hơi.'],
  'thanh-co-quang-tri': ['drop', 'Giọt nước thành cổ', 'Một giọt nước bên Thạch Hãn sẽ giữ được ký ức gì?', 'Một gợn nước nhỏ chạm bờ rồi lặng xuống. Trang sổ dành riêng một dòng để ghi nhớ những người đã ngã xuống ở Thành cổ Quảng Trị.'],
  'cong-tien-thanh-co-quang-tri': ['arch', 'Vòm cửa Nam', 'Từ đầu cầu qua hào, nhìn lên phía trên vòm gạch.', 'Đường qua cầu dẫn đến cổng Tiền của Thành cổ Quảng Trị. Vọng lâu nằm ngay trên vòm cửa.'],
  'cau-rong': ['dragon', 'Chiếc vảy nhìn ra biển', 'Con rồng thép trên sông Hàn để rơi chút nắng nào?', 'Một vệt nắng trượt từ đuôi qua ba nhịp vòm vàng. Tới đầu rồng, nó cuộn lại thành chiếc vảy nhỏ nhìn ra biển.'],
  'cau-vang-ba-na': ['arch', 'Sợi chỉ giữa hai tay', 'Hai bàn tay Bà Nà đang chuyền cho nhau thứ gì?', 'Một sợi nắng mắc giữa hai đầu ngón tay đá. Sợi chỉ cong dần thành dáng Cầu Vàng, đủ cho một bóng mây đi ngang.'],
  'hai-van-quan': ['ridge', 'Mây qua cửa ải', 'Một áng mây cần tấm vé nào để qua Hải Vân Quan?', 'Mây lọt qua vòm cửa, ra phía bên kia mang theo một viền núi. Dưới mép tranh đèo Hải Vân vẫn còn màu biển.'],
  'chua-cau': ['lantern', 'Mái ngói bắc qua trăng', 'Nếu mặt nước cũng có một cây cầu Hội An, ai sẽ đi qua?', 'Bóng mái Chùa Cầu nằm vắt qua dòng nước. Một đốm đèn lồng theo sóng chui qua nhịp cầu trong bóng.'],
  'hoi-quan-phuc-kien': ['dragon', 'Viên châu màu men', 'Giữa đôi rồng trên cổng hội quán có một khoảng sáng tròn.', 'Hai đường rồng trên nóc chầu về một viên châu. Trong lòng viên châu có màu xanh của ngói và màu đỏ của hàng đèn lồng.'],
  'hoi-quan-quang-dong': ['dragon', 'Một vảy gốm trong nước', 'Con rồng nào của Hội An có vảy ghép từ những mảnh gốm?', 'Nước trong sân hội quán làm bóng rồng gốm rung rinh. Một chiếc vảy xanh trong bóng bơi riêng ra, vòng một vòng rồi trở về.'],
  'nha-co-tan-ky': ['lantern', 'Nếp lụa Tấn Ký', 'Đèn lồng nhà Tấn Ký gấp phố cổ vào được mấy nếp?', 'Đèn lụa khép lại như chiếc quạt. Trong nếp lụa còn màu ngói cũ, vân gỗ sẫm và một vệt nắng của phố Nguyễn Thái Học.'],
  'cho-hoi-an': ['ink', 'Tờ giấy gói phố Hội', 'Một góc chợ Hội An gói được trong thứ gì?', 'Tờ giấy gói mở ra thành mái chợ tí hon. Chút nghệ vàng còn dính ở mép giấy tô vừa đủ màu cho một căn phố Hội.'],
  'ngo-mon': ['wing', 'Bóng cánh Ngũ Phụng', 'Một đường mái Ngọ Môn có thể giấu được đôi cánh nào?', 'Đường mái Lầu Ngũ Phụng xòe ra trên trang vẽ. Màu vàng và xanh của ngói đậu bên nhau như hai lớp lông cánh.'],
  'phuoc-duyen': ['echo', 'Bảy tầng tiếng chuông', 'Bóng tháp bên sông Hương cũng có từng tầng.', 'Tiếng chuông hóa thành gợn nước dưới bóng tháp Phước Duyên. Mỗi gợn đi qua mang theo một tầng của chiếc bóng.'],
  'cau-truong-tien': ['arch', 'Chiếc lược sông Hương', 'Những nhịp cong của cầu Trường Tiền xếp cạnh nhau gợi ra vật gì?', 'Dãy vòm thép soi xuống sông Hương như một chiếc lược bạc. Dòng nước chảy qua từng răng lược mà chẳng vướng vào đâu.'],
  'ga-hue': ['gear', 'Tấm vé màu tường hồng', 'Ga Huế có thể in vé tàu bằng màu tường nào?', 'Tấm vé nhỏ có màu hồng phấn của mặt ga. Ô giờ tàu là chiếc đồng hồ nằm giữa hai cửa chớp xanh.'],
  'cung-an-dinh': ['shell', 'Mảnh sành giữ màu sông', 'Một mảnh khảm ở cổng An Định giữ lại bao nhiêu sắc?', 'Chút hồng của tường cung và chút xanh của sông An Cựu nằm sát nhau trong một mảnh khảm. Nghiêng mảnh sành, hai màu lại đổi chỗ.'],
  'cho-vinh': ['gear', 'Buổi chợ trong mặt số', 'Kim đồng hồ trên chợ Vinh đang đếm những gì?', 'Qua mỗi nhịp kim, một vòm hành lang chợ hiện ra. Đủ một vòng mặt số thì cả mái ngói đỏ nằm gọn dưới chiếc chóp xanh.'],
  'ga-vinh': ['gear', 'Hai dòng kẻ qua ga', 'Từ ga Vinh, hai dòng kẻ song song muốn kể chuyện gì?', 'Hai đường ray chạy ngang tấm vé rồi khuất dưới mái sảnh ga Vinh. Ngay giữa tấm vé, kim đồng hồ vừa chạm giờ lên đường.'],
  'chua-can-linh': ['lotus', 'Mái chùa trong giọt sương', 'Lá sen ở chùa Cần Linh đang đỡ cả tòa tháp nào?', 'Giọt nước trên lá sen in bóng bảo tháp bảy tầng. Lá nghiêng một chút, cả bóng tháp lăn êm xuống hồ.'],
  'den-hong-son': ['drop', 'Mảnh trời vuông', 'Khoảng trời trước đền Hồng Sơn có bốn góc ở đâu?', 'Giếng Ngọc viền một mảnh trời xanh thành hình vuông. Một cánh lá rơi xuống đặt cái chấm nhỏ ngay giữa bức tranh.'],
  'quang-truong-binh-minh-cua-lo': ['star', 'Bông cúc đón bình minh', 'Ở Cửa Lò, mặt trời mọc thêm một lần trên cánh hoa nào?', 'Nắng vướng vào hoa cúc biển của quảng trường. Tách khỏi đường chân trời, bông hoa thành một mặt trời thứ hai cầm vừa trong tay.'],
  'bao-tang-tinh-thanh-hoa': ['star', 'Nắng trên bậc thềm', 'Từ sân bảo tàng, hai vế cầu thang gặp nhau ở đâu?', 'Hai vế thang men theo mặt tường vàng, cùng dẫn lên cửa chính. Từ chiếu nghỉ nhìn xuống, bóng cây trải dài trên sân.'],
  'ca-chep-hoa-rong': ['dragon', 'Giọt nước vượt vảy', 'Một giọt sông Hàn có thể đi từ cá sang rồng chăng?', 'Giọt nước men theo lớp vảy cẩm thạch rồi vọt khỏi miệng rồng. Bóng cá chép của nó còn ở lại dưới sông Hàn.'],
  'cung-the-thao-tien-son': ['star', 'Đĩa bay đậu lại', 'Vật gì trông sắp cất cánh mà vẫn đậu ngay Tiên Sơn?', 'Mái bạc hình elip nhấc khỏi những cột chữ V trong bức ký họa. Bóng của nó bay một vòng rồi đáp đúng vị trí nhà thi đấu.'],
  'tuong-dai-me-thu': ['arch', 'Vòng tay dưới núi Cấm', 'Nét cong sau chân dung Mẹ giữ trọn một khoảng trời.', 'Nét bút men theo cánh cung của tượng đài dưới chân núi Cấm. Giữa vòng cung, gương mặt Mẹ Thứ hiện ra trong yên lặng.'],
  'dan-nam-giao-hue': ['star', 'Trời tròn giữa rừng thông', 'Một vòng tròn đặt lên hình vuông gợi nhớ nơi nào ở Huế?', 'Cánh thông rơi vào vòng tròn trên nền vuông của trang vẽ. Trong hai nét hình học ấy là khoảng trời ở đàn Nam Giao.'],
  'cong-to-vo-ly-son': ['arch', 'Con dấu của biển Lý Sơn', 'Nếu vòm đá Tò Vò là một con dấu, biển sẽ in màu gì?', 'Vòm đá nham thạch in một nửa vòng cung sẫm. Phần rỗng bên trong được sóng Lý Sơn tô bằng màu xanh ngọc.'],
  'thap-canh-tien': ['wing', 'Cánh tiên bằng đá', 'Có đôi cánh nào ở Đồ Bàn nặng mà vẫn trông như sắp bay?', 'Mấy nét đá ở góc tầng tháp vút lên khỏi nền gạch đỏ. Khi tờ giấy nghiêng đi, đôi cánh sa thạch tưởng như vừa đón gió.'],
  'vien-hai-duong-hoc-nha-trang': ['shell', 'Mẫu vật của một con sóng', 'Nếu sóng Nha Trang có nhãn mẫu vật, nhãn ấy sẽ ghi gì?', 'Một chiếc vỏ ốc nhỏ nằm trong ô ký họa của Viện Hải dương học. Dòng nhãn bên dưới chỉ ghi “Một lần nghe vịnh thở”.'],
  'chua-linh-phuoc-da-lat': ['dragon', 'Vảy rồng ve chai', 'Mảnh chai ở Trại Mát có thể đổi thành chiếc vảy màu gì?', 'Một mảnh thủy tinh xanh bắt nắng giữa đường cong thân rồng. Sắc xanh lan từ vảy này sang vảy khác rồi lẫn vào hoa văn sành sứ.'],
  'cho-dong-ba': ['sail', 'Nón bài thơ đi chợ', 'Một vòng vành nón có thể che vừa bao nhiêu phố chợ?', 'Vành nón nghiêng trên trang chợ Đông Ba. Một mép che được hàng quán, mép còn lại hứng vừa vệt nắng sông Hương.'],
  'bao-tang-ca-phe': ['leaf', 'Dấu vân hạt cà phê', 'Hạt cà phê ở Buôn Ma Thuột có một con đường chạy giữa mình.', 'Rãnh nhỏ giữa hạt cà phê mở ra như con đường dẫn vào bảo tàng. Hạt khép lại, trên trang còn một dấu màu nâu thơm.'],
  'lang-chu-tich-ho-chi-minh': ['ink', 'Một dòng Ba Đình', 'Hàng cột nhìn ra quảng trường tạo thành những nét đứng đều nhau.', 'Nét ký họa dừng ở hàng cột vuông của Lăng. Bên dưới là một dòng ghi ngày ghé Quảng trường Ba Đình.'],
  'nha-tho-duc-ba-sai-gon': ['star', 'Hoa hồng giữa hai tháp', 'Có đóa hồng nào giữa hai tháp Đức Bà nở bằng ánh sáng?', 'Những cánh của ô cửa hoa hồng chia tia nắng thành từng múi. Dưới hai chóp tháp, đóa hoa ấy nằm trọn trong một vòng tròn.'],
  'doan-mon-thang-long': ['arch', 'Năm ô trời Đoan Môn', 'Một dãy cổng có thể đóng khung được mấy mảnh trời?', 'Năm vòm Đoan Môn cắt trời xanh thành năm ô nhỏ. Ô giữa rộng nhất, vừa chỗ cho một đám mây đi qua.'],
  'dien-kinh-thien': ['dragon', 'Đám mây mọc vảy', 'Ở thềm Kính Thiên, nét mây nào đã bắt đầu hóa rồng?', 'Nét mây ở thành bậc cuộn mình, dần hiện đường vảy đá. Ba lối đi của thềm nam mở ra giữa những nét chạm ấy.'],
  'khue-van-cac': ['star', 'Ngôi sao có khung gỗ', 'Ở Văn Miếu, ngôi sao nào có thể nhìn thấy giữa ban ngày?', 'Tia gỗ tỏa ra quanh ô cửa tròn Khuê Văn Các. Một mẩu trời lọt vào tâm cửa, thắp ngôi sao ngay trên trang vẽ.'],
  'chua-mot-cot': ['lotus', 'Một cuống sen bằng đá', 'Bông sen hồ Linh Chiểu đứng trên chiếc cuống nào?', 'Các thanh chống xòe lên từ cột đá như những đường gân. Liên Hoa Đài thu nhỏ thành một bông sen gỗ vừa chạm bóng mình.'],

  // Atlas stops in regional heritage tours.
  'osm-node-4279640089': ['lantern', 'Một trang phố Phùng Hưng', 'Nhà cổ Phùng Hưng sẽ lên đèn thế nào trên một trang giấy?', 'Một vệt sáng màu mật ong trườn qua nét gỗ của căn nhà. Góc trang giấy tối đi vừa đủ để giữ màu đèn phố Hội.'],
  'osm-node-4730928605': ['star', 'Bầu trời dưới đá', 'Có một khoảng trời ở Hạ Long nằm gọn bên trong lòng núi.', 'Một giọt nước treo nơi vòm động Thiên Cung hóa thành ngôi sao nhỏ. Bầu trời trong đá sáng lên vừa một nhịp.'],
  'osm-node-4730928606': ['echo', 'Chiếc hộp tiếng vang', 'Điều gì ở lại trong Hang Đầu Gỗ khi con thuyền đã rời vịnh?', 'Một tiếng gọi chạm vòm hang rồi quay lại nhỏ hơn. Đến lần cuối, âm thanh nằm vừa trong chiếc hộp mang tên Đầu Gỗ.'],
  'osm-node-13570978422': ['arch', 'Dấu chấm than của vịnh', 'Ai để quên một dấu chấm than trong Hang Sửng Sốt?', 'Một nét đá từ trần hang chúc xuống, một giọt nước đang rơi bên dưới. Trong khoảnh khắc, hai nét ghép thành dấu chấm than.'],
  'osm-node-4508895511': ['ink', 'Trang sổ trong lòng núi', 'Trong hai chữ Quân Y có một câu chuyện được núi Cát Bà gìn giữ.', 'Nét chì mở một lối sáng nhỏ giữa khối núi. Trang sổ dừng ở tên Hang Quân Y để nhớ những người từng chăm sóc thương binh nơi đây.'],
  'osm-way-1362974362': ['ridge', 'Thành lũy bằng nét núi', 'Nếu Hoa Lư có một đường viền, nét bút sẽ đi theo đâu?', 'Một nét mực lần theo núi đá vôi bao quanh cố đô. Vòng nét khép lại mà vẫn để hở một lối trở về Hoa Lư.'],
  'osm-node-6358064546': ['wing', 'Chữ ký của Hang Én', 'Một nét chữ nào viết được bằng đường chim bay qua cửa hang?', 'Cánh én chao một vòng dưới vòm đá. Đường bay gấp thành hai nét chữ V trước khi tan vào khoảng sáng ngoài hang.'],
};

;
// sight-secret-coasts.js
'use strict';

Object.assign(window.sightSecretStories, {
  'chua-hang-hai-son-kien-luong':['lotus','Cành liễu nhỏ','Từ sân nhìn lên, cành lá nhỏ nằm phía nào của tượng Quan Âm?',
    'Cành dương liễu ở bàn tay phải giơ lên, phía trái người đứng nhìn. Bàn tay bên kia nâng bình nghiêng trước ngực.'],
  'hon-phu-tu-kien-luong':['ridge','Cột đá còn lại','Từ Bãi Dương, cột đá cao đứng ở đầu nào của dãy đá thấp?',
    'Cột hòn Tử đứng bên phải dãy đá thấp khi nhìn từ bờ. Qua một khoảng nước nữa mới tới vách hòn Bà có cây phủ trên đỉnh.'],
  'vung-chua-dao-yen':['shell','Qua hàng phi lao','Đứng giữa các thân phi lao ở Vũng Chùa, đường chân trời có bị ngắt ở đâu?','Một sườn đảo nhô lên giữa biển. Mép rừng xanh thoải dần xuống bãi sáng màu ở bờ tây Đảo Yến.'],
  'phat-vien-dong-duong': ['arch','Thanh đá giữa hai trụ','Qua các thanh chống ở Tháp Sáng, tìm một đường ngang bằng đá nằm giữa hai trụ cửa.','Đầu bút đi lên theo vết gạch vỡ rồi rẽ ngang trên thanh đá. Dưới nét ngang ấy, hai trụ vẫn để ngỏ một lối cho mắt nhìn xuyên sang phía bên kia.'],
  'thap-phu-dien': ['drop','Giữa lòng cồn cát','Qua cửa phía đông ở Phú Diên, có gì còn lại giữa bốn bức tường gạch?','Từ ba bậc cửa, một nét bút luồn vào lòng tháp và dừng ở bệ thờ nhỏ. Phía trên trang ký họa, mái nhà kính hắt một quầng xanh xuống phần diềm mái xưa.'],
  'thap-yang-prong': ['wing','Mỏ chim ở mép rừng','Hãy lần theo diềm mái Yang Prong ra góc tháp để tìm chiếc mỏ quặp.','Bên mảng gạch phủ rêu, một chiếc mỏ nhỏ ngoặt xuống từ góc mái. Người vẽ nối nó với đường cong của tán rừng, rồi chừa trắng một khoảng trời ngay bên dưới.'],
  'thap-hoa-lai': ['ridge','Khoảng trống giữa hai tháp','Từ nền thấp giữa Hòa Lai, quay nhìn hai đầu trục tháp.','Hai ngọn tháp đứng ở hai mép trang. Ở khoảng trống giữa chúng, người vẽ chỉ đặt một nét vuông thấp bằng gạch, đúng nơi cuộc khai quật tìm thấy nền tháp Giữa.'],
  'thap-bac-hoa-lai': ['leaf','Móc lá trên cột gạch','Lần theo dải lá cuộn giữa cột ốp của tháp Bắc.','Đầu một chiếc lá đổi chiều, khớp vào chiếc kế bên. Người vẽ đi hết dải móc gạch rồi khép nét thành bông hoa ở chân cột.'],
  'thap-nam-hoa-lai': ['arch','Nét phác bên tiền sảnh','Quanh cửa đông tháp Nam, chỗ nào người thợ xưa mới phác dáng trên gạch?','Khối ốp dưới chân cột còn nét vuông của viên gạch. Nhìn lên một tầng, ô khám trên mái đã hiện đủ đường chạm.'],
  'thap-thu-thien': ['ridge','Mũi lao trong vòm cửa','Đứng bên mặt tây Thủ Thiện, tìm những đầu vòm xếp lồng nhau.','Nét cửa giả trên giấy vút lên giữa hai đường cột trơn. Chẳng cần thêm hoa văn nào, trang sổ vẫn nhận ra dáng tháp giữa cánh đồng sông Kôn.'],
  'thap-phu-loc': ['arch','Khoảng trời trên đồi Phú Lốc','Từ cửa phía đông, nhìn theo gờ dọc tới nơi dải đá trên mái bị đứt.','Đầu bút dừng ở chỗ mạch đá mất một đoạn. Qua khoảng hở giữa những viên gạch sẫm, một mẩu trời của đồi Phú Lốc lọt vào trang.'],
  'thap-po-dam': ['star','Hai mái nhìn về nam','Nhìn hai cửa tháp nhỏ trên thềm núi Ông Xiêm. Mái nào giật thành từng nấc?','Một nét bậc thang, một nét mái thu dần. Hai hình khác nhau cùng quay về phía nam trên trang ký họa Pô Đam.'],
  'duc-ba-hoa-binh-sai-gon': ['drop','Quả địa cầu trước ngực','Từ giữa Công trường Công xã Paris, tìm cây thánh giá nhỏ nằm giữa hai bàn tay tượng.','Quả địa cầu chỉ vừa hai bàn tay bằng đá. Người ký họa chừa một nét trắng ở đỉnh quả cầu cho cây thánh giá, rồi ghi hai chữ Regina Pacis từ tấm bảng đồng dưới chân.'],
  'nha-co-phung-hung': ['sail','Cá chép dưới ban công','Con cá nào ở nhà Phùng Hưng quanh năm nép dưới hiên?','Một con cá chép bằng gỗ đỡ lấy ban công. Chỉ khi bóng nó chạm nền phố, con cá mới có dòng nước riêng để bơi.'],
  'nha-co-quan-thang': ['lantern','Quầng đèn Quân Thắng','Đứng giữa hai ngọn đèn, nhìn lên tấm biển nhỏ dưới hiên.','Hai quầng đỏ khép lại bên dòng chữ Quân Thắng. Trong trang ký họa, khoảng sáng ở giữa vừa bằng một cánh cửa mở hàng.'],
  'nha-co-duc-an': ['ink','Tấm ván mở hàng','Ở Đức An, vì sao cửa hai bên lại có những đường ngang?','Từng tấm ván xáng rút khỏi rãnh, một khoảng cửa lại mở rộng. Đặt chúng nằm cạnh nhau trên giấy, bạn có chiếc bàn nhỏ để giở sách ở hiệu Đức An xưa.'],
  'bao-tang-gom-su-mau-dich': ['sail','Theo thuyền vào phố','Sau ban công gỗ ở số 80 Trần Phú, món gì từng theo thuyền buôn qua biển?','Một nét men lam cuộn vào lòng chiếc bát trong sổ. Men theo vòng nét ấy, người xem đi từ căn nhà phố đến những bến buôn xưa.'],
  'bao-tang-sa-huynh': ['gear','Vòng xoay ở phố Trần Phú','Tìm những con tiện phình ở giữa trên ban công số 149.','Một con tiện nhỏ trên giấy quay như con vụ. Vòng quay dừng lại trên nét vẽ một chiếc chum của cư dân Sa Huỳnh.'],
  'bao-tang-van-hoa-dan-gian-hoi-an': ['wing','Hai đầu mái phố','Theo những nếp nhà gỗ từ Nguyễn Thái Học ra Bạch Đằng.','Một cánh chim qua mặt phố, lướt ngang khoảng sân lấy sáng rồi bay ra phía sông. Bóng nó đã lần hết chiều dài ngôi nhà bảo tàng.'],
  'nha-tho-toc-tran-hoi-an': ['leaf','Hoa gạch bên cửa','Hai ô thông gió ở cửa phụ nhà thờ tộc Trần có cùng hoa văn không?','Một tia nắng đi qua ô gạch, in bông hoa lên nền. Tia nắng từ cửa bên kia chọn một hình khác, thế là trang giấy có đủ hai dấu cửa.'],
  'nha-tho-toc-nguyen-tuong': ['ridge','Bậc đá từ đường','Đếm từng bậc từ sân thấp lên nền nhà thờ tộc Nguyễn Tường.','Một đường bút đi lên theo bậc đá cuối rồi dừng ở ngưỡng. Phía trên, ba bộ cửa đứng cùng một hàng, chấn song chia nắng thành sọc nhỏ.'],
  'quan-cong-mieu-hoi-an': ['dragon','Hai mắt tròn Chùa Ông','Dưới bờ nóc có rồng, tìm hai ô cửa xanh nhìn ra phố.','Vòm tròn bên phải giữ một khoanh nắng, vòm bên trái cắt nó thành vạch qua chấn song. Hai khoanh sáng chầu về tấm biển Quan Công Miếu.'],
  'dinh-cam-pho': ['arch','Hai tầng mái giữa sân','Từ nhà bên này nhìn sang nhà bên kia, mái nào nằm ở giữa?','Giữa hai dãy nhà của đình Cẩm Phô, phương đình gấp bóng mái thành hai lớp. Một khoảng trời hẹp nằm gọn dưới lớp trên.'],
  'tuy-tien-duong-minh-huong': ['ink','Mực dưới hiên Minh Hương','Tên Tụy Tiên Đường nằm ở đâu giữa các cột gỗ?','Dưới hàng hiên, chữ vàng trên nền hoành phi theo nét bút đi vào sổ. Chờ mực ráo, người vẽ mới gấp trang mang tên ngôi đình Minh Hương.'],
  'dien-kien-trung': ['arch','Mảnh men bên cửa đỏ','Ở Kiến Trung, tìm vệt men xanh nhỏ trên dãy cửa đỏ.','Một mảnh men xanh nằm gọn trong vành vòm. Khi trang giấy khép lại, mảnh nhỏ vẫn giữ nguyên màu nắng của mặt điện.'],
  'dien-long-an': ['ink','Nét gỗ điện Long An','Dưới mái ngói, thử lần theo màu gỗ của những hàng cột.','Đầu bút dừng dưới hiên điện Long An. Bảy gian nhà trước in xuống giấy thành bảy khoảng tối có màu gỗ lim.'],
  'chinh-dien-dien-tho': ['drop','Hai mái bên hồ','Theo bóng mái xanh tới mép hồ ở phía đông chính điện.','Trong một giọt nước, mái xanh của Trường Du Tạ nằm cạnh mái vàng của cung Diên Thọ. Chỉ cần nghiêng trang giấy là hai màu chạm nhau.'],
  'the-to-mieu': ['ridge','Hai đường bờ nóc','Qua sân Hiển Lâm Các, tìm đường nóc dài phía sau tiền doanh.','Hai nét bút chạy song song, một nét giữ mười một gian nhà trước, một nét ôm chín gian nhà sau. Dưới hai đường nóc là Thế Tổ Miếu.'],
  'hung-to-mieu': ['ink','Năm gian ba nhịp','Từ hiên Hưng Miếu, nhìn sang nếp nhà nhỏ hơn phía sau.','Năm vệt son từ tiền đường in xuống mép giấy. Gấp tờ giấy lại, giữa những vệt son hiện ra ba gian chính đường.'],
  'dien-hon-chen': ['wing','Phụng nhìn xuống sông','Ở đỉnh mái Minh Kính Đài có cánh chim nào hướng về sông Hương?','Cánh phụng trên nóc nhà hắt xuống một bóng nhỏ. Dòng sông mang bóng ấy lướt qua đủ ba nếp điện bên núi Ngọc Trản.'],
  'dien-voi-re': ['echo','Sân nghe tiếng voi','Qua bình phong trước miếu Long Châu, âm thanh sẽ vọng từ đâu?','Một tiếng chân trầm đi từ phối điện bên này sang phối điện bên kia. Trang ký họa giữ lại khoảng sân tĩnh giữa hai tiếng vọng.'],
  'van-thanh-mieu-hue': ['turtle','Mai rùa dưới nhà bia','Giữa hai dãy nhà che bia, hãy tìm chiếc mai nâng phiến đá.','Một đường cong dưới chân bia lộ ra thành mai rùa. Qua sân Văn Thánh, dãy bia bên kia có một chiếc bóng giống hệt.'],
  'an-lang-duc-duc': ['ink','Dấu vuông của Huỳnh Ốc','Ở khu mộ An Lăng, nắng đi qua bốn mặt của ngôi nhà nào?','Một vệt nắng vuông nằm trên sập đá giữa nhà Huỳnh Ốc. Dấu nắng vừa đủ làm khung cho trang ký họa về An Lăng.'],
  'xuong-lang-thieu-tri': ['ridge','Nếp đá Xương Lăng','Lần theo các bậc đá cho đến nơi chúng chạm cửa Bửu Thành.','Từng nét đá nâng mép giấy lên một bậc. Ở nếp gấp cuối, cánh cửa Bửu Thành khép giữa sườn đồi.'],
  'tran-hai-thanh': ['arch','Vòng gạch Thuận An','Vòm nào xuyên qua nét tròn của tường thành phía nam?','Một cung gạch mở lối vào vòng thành thời Nguyễn. Nhìn qua vòm, khoảng sáng bên trong vừa thành con dấu Thuận An.'],
  'hai-dang-nui-nai': ['ridge', 'Bốn mẩu sáng Núi Nai', 'Ánh chiều chọn ở lại mặt nào của tháp vuông?', 'Một mặt tháp xám còn nắng, ba mặt kia đã mát. Bốn mẩu giấy xếp quanh mái nhà trạm thành một buổi chiều ở Núi Nai.'],
  'hai-dang-rach-gia': ['sail', 'Góc trắng Rạch Giá', 'Một góc tháp có thể theo thuyền ra khơi không?', 'Một góc trắng của tháp vuông gập xuống, hóa thành cánh buồm giấy. Mũi thuyền giấy vừa rời Rạch Giá đã gặp gió.'],
  'hai-dang-an-thoi': ['shell', 'Vòng tay của sóng', 'Biển An Thới chọn đường cong nào làm vòng tay?', 'Một nét bọt trắng quấn quanh bóng tháp tròn. Khi sóng rút, nét bọt khép thành chiếc vòng đeo vừa cổ tay.'],
  'hai-dang-hon-chong': ['drop', 'Viên phấn Hòn Chông', 'Ngọn đèn trắng muốn tập viết lên nền nước.', 'Chiếc tháp tròn hóa thành viên phấn nhỏ. Nó viết hai chữ Hòn Chông lên mặt biển trước khi một con sóng xóa bảng.'],
  'hai-dang-nam-du': ['beacon', 'Bao diêm Nam Du', 'Nhà trạm và tháp vuông sẽ vừa trong chiếc hộp nào?', 'Nắp bao diêm hé mở để ngọn tháp xám đứng dậy. Một đầu diêm sáng lên cạnh mái nhà trạm, đủ soi dòng chữ Nam Du trên vỏ hộp.'],
  'hai-dang-tho-chu': ['ink', 'Chấm xám Thổ Chu', 'Đảo xa giữ một dấu chấm nào cho trang hải đồ?', 'Ngòi bút lấy màu xám từ thân tháp tròn. Một dấu chấm nhỏ hiện giữa trang biển rộng, bên cạnh hai chữ Thổ Chu.'],
  'hai-dang-hon-dam': ['star', 'Hoa sáu cánh Hòn Dăm', 'Sáu mặt tháp trắng mở ra thành hình gì?', 'Các mặt tháp Hòn Dăm xòe ra như cánh hoa bằng giấy. Buồng đèn nằm giữa làm nhụy, một hạt nắng lọt vừa vào trong.'],
  'hai-dang-hon-kho': ['shell', 'Con quay Hòn Khô', 'Vòng đỏ và vòng đen gặp nhau ở chỗ thắt nào?', 'Bóng ngọn đèn thắt eo quay tròn trên một mẩu sóng. Hai màu đỏ đen chạy thành vòng, hệt con quay vừa rời tay.'],
  'hai-dang-hon-khoai': ['ink', 'Hạt muối trong trang đá', 'Trên thân tháp Hòn Khoai, một hạt sáng nép vào màu granit.', 'Một hạt muối bé hơn dấu chấm nằm bên đốm sáng của đá granit. Trên góc tháp vuông, khó biết hạt nào đến từ đất, hạt nào đến từ biển.'],
  'hai-dang-ong-doc': ['star', 'Ngôi sao năm nếp', 'Từ tháp Ông Đốc có thể gấp sao mấy cánh?', 'Năm mặt trắng để lại năm nếp trên bìa giấy. Chụm các nếp ở đỉnh, ngọn đèn Ông Đốc thành một ngôi sao nhỏ.'],
  'hai-dang-bo-de': ['sail', 'Lá thư đi cà kheo', 'Làm sao nhà trạm Bồ Đề giữ khô mép thư?', 'Phong thư đỏ trắng đứng trên những chiếc cọc mảnh như chân nhà trạm. Triều dâng bên dưới, hàng chữ Bồ Đề còn nguyên nét mực.'],
  'hai-dang-hon-chuoi': ['leaf', 'Bóng mát gấp tư', 'Bốn mặt xám của tháp Hòn Chuối cất bóng ở đâu?', 'Bóng tháp gập làm tư như một tàu lá. Mở từng nếp ra sẽ gặp buồng đèn, mái trạm, bờ đảo rồi đến biển.'],
  'hai-dang-cu-lao-xanh': ['ink', 'Vạch mực Cù Lao Xanh', 'Trong lọ mực còn đúng một nét cho ngọn tháp trắng.', 'Nét đen quấn một vòng quanh eo tháp Cù Lao Xanh. Phần trắng ở hai đầu làm đường mực mảnh mà từ xa vẫn rõ.'],
  'hai-dang-phuoc-mai': ['arch', 'Ô cửa Phước Mai', 'Nếu cắt hình tháp khỏi bức tranh thì biển có khung nào?', 'Một ô vuông màu xám được nhấc khỏi bìa tranh. Nhìn qua khoảng trống mang dáng tháp Phước Mai, mặt biển hóa thành tranh có khung.'],
  'hai-dang-hon-nuoc': ['drop', 'Giọt nước đứng thẳng', 'Giọt nào ở Hòn Nước đứng mãi giữa trời?', 'Một giọt mặn kéo dài trong bóng tháp trắng. Khi bóng gãy theo mặt sóng, giọt nước lại tròn xoe như vừa rơi xuống.'],
  'hai-dang-thuan-an': ['lantern', 'Lục giác viền son', 'Lọ màu son ở Thuận An đã chấm vào hai đầu tờ giấy.', 'Hai vệt son kẹp một dải giấy trắng. Sáu nếp gấp dựng cả ba dải màu thành chiếc đèn giấy mang dáng tháp Thuận An.'],
  'hai-dang-chan-may': ['wing', 'Mảnh mây trốn ở cảng', 'Có đám mây nào ở Chân Mây thích đứng im?', 'Một mẩu mây trắng nấp vừa sau thân tháp tròn. Khi mây nhấc mình bay, trên giấy còn lại một vệt trắng và khoảng trời xanh.'],
  'hai-dang-cua-nhuong': ['sail', 'Dây phơi màu ở Cửa Nhượng', 'Ai đã hong hai màu đỏ trắng ngoài gió biển?', 'Những khoang màu rời thân tháp thành các dải vải ướt. Gió Cửa Nhượng thổi một lượt, dải nào cũng khô vừa kịp cuộn về.'],
  'hai-dang-cua-sot': ['ink', 'Thỏi màu Cửa Sót', 'Cửa biển này giấu màu của đất trong vật gì?', 'Tháp vuông vàng đất thu lại thành một thỏi màu. Chỉ một nét đã đủ vẽ lại ngọn đèn Cửa Sót giữa trang biển xanh.'],
  'hai-dang-mui-ron': ['echo', 'Tiếng lăn ở Mũi Ròn', 'Một tiếng sỏi lăn sẽ còn vang tới đâu?', 'Bóng tháp tròn màu xám rời mặt nước như một viên sỏi. Nó lăn dọc mép trang, mang tiếng sóng Mũi Ròn đi cùng.'],
  'hai-dang-diem-dien': ['star', 'Hạt sáng Diêm Điền', 'Một hạt muối bắt nắng giống đèn biển đến đâu?', 'Hạt muối trên giấy lóe lên bên hình tháp xám. Ở Diêm Điền, khoảng cách giữa một hạt sáng và một ngọn đèn chỉ bằng nét bút.'],
  'hai-dang-ba-lat': ['sail', 'Tám nếp buồm Ba Lạt', 'Một mặt tháp Ba Lạt đủ làm được bao nhiêu nếp gấp?', 'Tám mặt tháp hắt tám sắc xám lên tờ giấy. Chúng xếp thành một cánh buồm quạt, đón ngọn gió từ cửa Ba Lạt.'],
  'hai-dang-hon-dau': ['ink', 'Con dấu tám cạnh', 'Nếu Hòn Dấu có một con dấu riêng, viền của nó sẽ ra sao?', 'Thân tháp bát giác chấm vào màu xanh nhạt. Nhấc lên, trên giấy có một dấu tám cạnh bao quanh tên đảo Hòn Dấu.'],
  'hai-dang-long-chau': ['beacon', 'Đốm đèn trong hạt đá', 'Nắng nấp trong hạt đá nào của ngọn đèn Long Châu?', 'Một hạt granit từ bức vẽ hải đăng bắt được nắng. Hạt đá sáng lách tách như một ngọn đèn thu nhỏ dưới chân tháp.'],
  'hai-dang-vung-tau': ['gear', 'Cuộn phim Vũng Tàu', 'Một vòng quanh thân tháp Vũng Tàu đủ cho mấy khung hình?', 'Một dải phim cuốn quanh ngọn hải đăng trắng. Khung đầu là trời, khung cuối là biển, còn giữa hai khung là một buổi đứng ngắm.'],
  'hai-dang-cao-trang': ['shell', 'Nắp hộp sáu cạnh', 'Có ngọn đèn nào ở Cao Trang thu gọn vừa chiếc nắp hộp?', 'Tháp lục giác thấp khép xuống thành nắp hộp trắng. Mở nắp ra, một chút gió mặn lúc ghé Cao Trang vẫn còn ở trong.'],
  'hai-dang-da-trang': ['drop', 'Đồng hồ cát Đá Trắng', 'Giữa hai vạch màu, chỗ nào sóng phải đi qua từng giọt?', 'Phần thắt giữa tháp Đá Trắng thu hẹp trong bức hình. Một giọt biển rơi qua eo đỏ trắng, vừa đúng một nhịp đồng hồ cát.'],
  'hai-dang-ganh-rai': ['leaf', 'Chiếc lá gấp sáu', 'Dải xanh ở Gành Rái đã tìm được màu trắng để gấp cùng.', 'Sáu mặt tháp gập lại thành một chiếc lá xanh sẫm. Những khoang trắng chạy ngang lá như từng gợn sóng còn giữ trên mặt nước.'],
  'hai-dang-ba-kiem': ['ink', 'Tấm bưu thiếp đứng', 'Một tờ bìa gấp vuông có thể dựng được ngôi nhà và cả tháp?', 'Tấm thiếp Ba Kiềm vừa mở, tháp trắng đã đứng lên ở nếp giữa. Ngay bên dưới tháp, mái nhà trạm bật lên từ một nếp giấy nhỏ hơn.'],
  'hai-dang-can-gio-aval': ['echo', 'Nhịp gõ dưới sàn trạm', 'Nhà trạm Cần Giờ Aval nghe biển qua bộ phận nào?', 'Nước vỗ lần lượt vào chân cọc dưới trạm. Tháp tròn trắng đứng trên đầu nhịp gõ như một dấu lặng dài.'],
  'hai-dang-bay-canh': ['beacon', 'Bài toán của Bảy Cạnh', 'Hòn mang tên Bảy Cạnh, còn tháp thì có mấy mặt?', 'Mảnh giấy khẽ xoay cho thấy bốn mặt của chiếc tháp vuông. Tên Bảy Cạnh nằm nguyên dưới chân bức vẽ, làm ai đếm vội cũng bật cười.'],
  'hai-dang-ba-ngoi': ['ink', 'Ô màu Ba Ngòi', 'Ở Ba Ngòi có một ô màu vàng kem đứng thẳng ngoài trời.', 'Chiếc tháp thấp đóng lên giấy một ô vuông màu kem. Cạnh ô vuông là nét mái nhà trạm, đủ để nhận ra ngọn đèn Ba Ngòi.'],
  'hai-dang-mui-chut': ['shell', 'Sáu múi vỏ sò', 'Vỏ sò nào ở Mũi Chụt có màu của thân tháp?', 'Sáu vệt màu kem xòe như các múi vỏ sò. Khép vỏ lại, sáu đường gân thẳng vừa khớp với sáu cạnh của ngọn tháp.'],
  'hai-dang-hon-chut': ['star', 'La bàn Hòn Chút', 'Tám cạnh tháp có vừa với một vòng la bàn?', 'Hình bát giác xám đứng giữa mặt la bàn vẽ tay. Từ mỗi góc tỏa ra một hướng gió, còn buồng đèn giữ đúng tâm.'],
  'hai-dang-mui-dinh': ['ridge', 'Mẩu nắng trên góc đá', 'Màu nắng Mũi Dinh đổi ra sao khi đi qua một cạnh vuông?', 'Nửa mẩu granit sáng trắng trong nắng, nửa còn lại dịu màu. Ranh giới thẳng như kẻ chỉ đúng góc tháp vuông Mũi Dinh.'],
  'hai-dang-hon-lon': ['gear', 'Cuộn chỉ Hòn Lớn', 'Tháo những khoang đen khỏi thân tháp trắng sẽ được thứ gì?', 'Sợi chỉ đen quấn vòng quanh thân tròn của tháp Hòn Lớn. Nó chừa những khoảng đều nhau cho nền trắng lọt ra.'],
  'hai-dang-hon-do': ['wing', 'Cánh thư Hòn Đỏ', 'Đảo mang tên đỏ gửi đi một phong thư màu gì?', 'Một cánh thư trắng tách khỏi bóng hải đăng. Nó chỉ cần hàng chữ Hòn Đỏ ở góc giấy để nhớ đúng đường về.'],
  'hai-dang-da-tay': ['drop', 'Đốm mưa Đá Tây', 'Trên nền trời màu mưa, điều gì còn tách được tháp khỏi biển?', 'Thân tròn xám chìm giữa nét mưa chì. Một ô giấy được để trắng trên đỉnh tháp Đá Tây, vừa đủ cho ánh đèn hiện ra.'],
  'hai-dang-truong-sa-dong': ['sail', 'Dải trắng giữa hai đầu đỏ', 'Trường Sa Đông chừa một dải màu nào giữa những nét son?', 'Hai dải đỏ giữ một khoảng trắng làm chỗ ghi tên đảo. Dải màu khép quanh tấm thiếp, hóa thành ngọn hải đăng bên nhà trạm.'],
  'hai-dang-da-lat': ['arch', 'Tấm lưới giữ chân trời', 'Ở Đá Lát, đường chân trời lọt qua những mắt lưới nào?', 'Thanh giằng chéo đỏ trắng cắt biển thành từng mảnh tam giác. Phía dưới sàn trạm kê trên cọc, các mảnh ghép thành một đường sóng liền.'],
  'hai-dang-an-bang': ['star', 'Ngôi sao của phiên trực', 'Tám mặt xám đón bao nhiêu mép trời ở An Bang?', 'Bóng ngọn đèn đổ tám tia tưởng tượng quanh mái nhà trạm. Trên trang sổ, chúng thành một ngôi sao chỉ có ở An Bang.'],
  'hai-dang-phan-thiet': ['sail', 'Mẩu cờ Phan Thiết', 'Hai màu của tháp thấp có thể gửi lời chào ra khơi.', 'Một dải đỏ rời tháp cùng một dải trắng. Gió Phan Thiết buộc cả hai lên cột buồm của con thuyền giấy tí hon.'],
  'hai-dang-phan-ri': ['shell', 'Chiếc hộp Phan Rí', 'Bốn mặt tháp Phan Rí đựng vừa món quà gì?', 'Chiếc hộp vuông trắng mở nắp để lộ một vỏ sò bé bằng hạt gạo. Đậy nắp lại, ngọn đèn đứng ngay ngắn bên mái nhà trạm.'],
  'hai-dang-phu-quy': ['star', 'Viền bạc Phú Quý', 'Màu nào hiện rõ nhất khi trời vừa tối quanh tháp xám sẫm?', 'Một nét bạc chạy trên góc vuông của tháp Phú Quý. Chỉ đường viền mảnh ấy thôi đã đủ tách hải đăng khỏi bầu trời đêm.'],
  'hai-dang-hon-hai': ['ridge', 'Chiếc đuôi của đảo đá', 'Sau ngọn đèn Hòn Hải, nét đảo cao phía bắc hay phía nam?', 'Nét vẽ dựng đứng thành vách đá phía bắc rồi hạ thấp dần về đuôi đảo phía nam. Ngọn tháp sáu cạnh nằm gọn trên phần đá cao.'],
  'hai-dang-cua-hoi': ['ink', 'Sợi chỉ đỏ Cửa Hội', 'Vạch đỏ ở Cửa Hội đi vòng quanh hay đi thẳng?', 'Sợi chỉ đỏ chạy dọc xuống thân trắng rồi thòng một đầu khỏi mép bưu thiếp. Kéo nhẹ trong tưởng tượng, cả ngọn đèn thành chiếc thước kẻ.'],
  'hai-dang-hon-mat': ['beacon', 'Con ngươi vàng Hòn Mắt', 'Hòn Mắt có thể chớp mắt bằng màu gì?', 'Chấm vàng của thân tháp tròn nằm giữa đường mí mắt bằng sóng. Đốm đèn sáng một nhịp, như hòn đảo vừa nhận ra người quen.'],
  'hai-dang-lach-giang': ['ink', 'Gáy sổ màu son', 'Một vạch đỏ chạy dọc trang xám sẽ đánh dấu chỗ nào?', 'Trang vẽ ngọn đèn Lạch Giang gập lại đúng theo sọc đỏ dọc tháp. Vết gấp thành gáy của cuốn sổ đi biển vừa bằng lòng bàn tay.'],
  'hai-dang-quat-lam': ['lantern', 'Quạt màu Quất Lâm', 'Mở hết sáu mặt của tháp Quất Lâm sẽ được chiếc quạt màu gì?', 'Sáu nan quạt giấy mang những khoang đỏ xen vàng nhạt. Quạt mở ra, một thoáng gió mặn từ Quất Lâm theo ra ngoài.'],
  'hai-dang-ly-son': ['beacon', 'Nét trắng cao nhất trang', 'Có nét nào đi từ mặt biển Lý Sơn lên gần hết trang vẽ?', 'Ngọn tháp trắng cao vút kéo nét bút sát tới lề trên. Dưới chân trang, hai chấm nhỏ hơn đánh dấu những ngọn đèn khác quanh đảo.'],
  'hai-dang-den-bao-cang-ly-son': ['sail', 'Hai màu đón tàu', 'Ngọn đèn báo cảng Lý Sơn chọn cặp màu nào cho lời chào?', 'Hai dải đen trắng của đèn cảng biến thành mép một cánh thư. Chiếc thuyền giấy mang thư rẽ sóng vào bờ Lý Sơn.'],
  'hai-dang-den-bao-bai-can-ly-son': ['drop', 'Dấu phẩy bãi cạn', 'Dấu nào trên trang sóng bảo con thuyền đi chậm một nhịp?', 'Ngọn đèn báo bãi cạn thu thành dấu phẩy đỏ trắng. Con thuyền trong bức vẽ uốn đường đi quanh dấu phẩy rồi tiếp tục.'],
  'hai-dang-ba-lang-an': ['shell', 'Vòng vân Ba Làng An', 'Từng khoang đỏ trắng trên ngọn đèn sẽ vừa vỏ ốc nào?', 'Vỏ ốc giấy cuộn quanh hình đèn biển Ba Làng An. Khi cả hai trùng nhau, những vệt đỏ trắng chạy liền từ ngọn tháp ra đầu vỏ.'],
  'hai-dang-sa-ky': ['sail', 'Lằn sóng Sa Kỳ', 'Dải đỏ trên bờ có gửi được tín hiệu sang trang giấy bên kia?', 'Con thuyền giấy rời nét tháp đỏ trắng của Sa Kỳ. Đuôi thuyền kéo một lằn sóng nhỏ, dài vừa đủ nối sang trang mang tên Lý Sơn.'],
  'hai-dang-sa-huynh': ['star', 'Hạt muối trên vai đỏ', 'Chút trắng ở đỉnh tháp Sa Huỳnh trông giống thứ gì?', 'Khoang trắng phía trên tháp vuông tan thành một nhúm muối trên giấy. Một hạt bắt nắng, lóe sáng trên nền tháp đỏ.'],
  'hai-dang-van-ca': ['echo', 'Câu ca của sóng', 'Nếu Vạn Ca có một khuông nhạc thì nốt trắng sẽ nằm đâu?', 'Mấy lằn sóng xếp song song làm dòng kẻ. Hình ngọn tháp trắng nằm ở đầu khuông nhạc như một nốt kéo dài.'],
  'hai-dang-ha-long': ['ridge', 'Bậc đá ngắm Bãi Cháy', 'Một góc của đế tháp Hạ Long có giữ được cả bãi biển?', 'Các bậc bát giác thu lại thành khung hình bằng đá. Ngoài khung, một nét nước xanh chạm bờ cát Bãi Cháy.'],
  'hai-dang-vinh-thuc': ['leaf', 'Cánh hoa ngoài Vĩnh Thực', 'Màu vàng nào vẫn còn trên đảo khi mặt trời khuất?', 'Một cánh hoa vàng áp sát thân tháp Vĩnh Thực. Cả hai hòa cùng màu một lát, rồi cánh hoa bay về phía mái nhà trạm.'],
  'hai-dang-co-to': ['wing', 'Trang trắng Cô Tô', 'Tờ giấy trắng có thể tự đứng trên đảo bằng cách nào?', 'Một mép giấy cuộn lại thành thân hải đăng tròn ở Cô Tô. Góc còn thừa mở ra như cánh hải âu sắp chạm biển.'],
  'hai-dang-ha-mai': ['ink', 'Nét chì Hạ Mai', 'Chỉ còn thỏi chì đậm, có vẽ được ngọn đèn ngoài Hạ Mai?', 'Một nét chì xám sẫm dựng lên giữa trang giấy trắng. Nơi đầu bút nhấc khỏi giấy chính là chỗ để dành cho ánh đèn Hạ Mai.'],
  'hai-dang-dao-tran': ['star', 'Hạt nắng Đảo Trần', 'Một ngày biển khép lại, đốm nắng nào còn nằm trên bản đồ?', 'Thân tháp vàng cuộn tròn thành hạt nắng ngoài Đảo Trần. Đặt hạt cạnh hình nhà trạm, bức hải đồ bỗng có một góc ấm.'],
  'hai-dang-mui-lay': ['ink', 'Bóng vuông ở Mũi Lay', 'Tên gọi là Lay, còn cái bóng xám đứng yên hay động?', 'Trên giấy, chiếc tháp vuông đứng im. Bóng nó dưới nước cứ lay qua lay lại, như muốn nhắc đúng tên mũi đất.'],
  'hai-dang-nhat-le': ['drop', 'Hai nửa hoàng hôn Nhật Lệ', 'Màu xám và vàng nhạt ở Nhật Lệ gặp nhau trên đường nào?', 'Sáu mặt tháp mang vệt vàng nhạt bên dưới, vệt xám bên trên. Đường nối hai màu giống một hoàng hôn bé xíu ở cửa sông.'],
  'hai-dang-cua-gianh': ['sail', 'Chỗ sông đổi màu', 'Một tháp xanh nhạt có thể giấu mình giữa mấy sắc nước?', 'Màu sông Gianh trôi vào màu biển trong trang giấy ướt. Một nét xanh nhạt ở giữa dựng lên, vừa đúng dáng tròn của ngọn đèn cửa sông.'],
  'hai-dang-con-co': ['leaf', 'Chiếc cúc áo đảo xanh', 'Giữa màu xanh Cồn Cỏ có một chiếc cúc áo màu gì?', 'Ngọn tháp vàng thu nhỏ thành chiếc cúc trên áo lá. Mái nhà trạm nép ở chân cúc như một mũi chỉ vừa khâu xong.'],
  'hai-dang-cua-viet': ['beacon', 'Ngọn đèn gấp góc', 'Một chiếc thuyền vẽ về Cửa Việt nhận bờ ở nếp nào?', 'Bốn nếp xám bật thành góc vuông của tháp Cửa Việt. Từ thuyền nhìn vào, ngọn đèn và mái nhà trạm hiện trên cùng một mép giấy.'],
  'hai-dang-lach-trao': ['gear', 'Bánh xe tám góc', 'Thân tháp ở Lạch Trào có thể lăn êm như đốm sáng trên đỉnh?', 'Hình bát giác xám lăn trên giấy thành từng bước ngắn. Đốm sáng bên trong thì vẽ một vòng tròn liền tăm tắp.'],
  'hai-dang-hon-me': ['shell', 'Viên sỏi ngủ quên', 'Có gì trắng tròn đứng giữa giấc mơ của Hòn Mê?', 'Một viên sỏi trắng nằm dưới bóng đèn biển Hòn Mê. Trong giấc ngủ, nó mơ mình cao thêm thành chiếc tháp tròn.'],
  'hai-dang-bien-son': ['ink', 'Mảnh bàn cờ Biện Sơn', 'Hai màu tháp Biện Sơn có thể chơi ván cờ nào trên giấy?', 'Dải đen và dải trắng tách ra thành các ô bàn cờ nhỏ. Một con thuyền thế chỗ quân cờ, đi thẳng ra phía biển.'],
  'hai-dang-ba-dong': ['drop', 'Bóng tháp trên cát ướt', 'Mỗi lần sóng qua Ba Động, trang cát lại được lật một lần.', 'Dải cát ướt soi một nét tháp tròn xám. Con nước kéo bức tranh đi, rồi trả lại cho Ba Động một trang cát mới.'],
  'hai-dang-ho-tau': ['arch', 'Ô cửa hình chữ X', 'Có mấy mẩu biển lọt giữa hai thanh giằng của đèn Hồ Tàu?', 'Khung thép bắt chéo chia biển thành những ô tam giác. Từng khoang đen trắng ôm lấy một ô trời xanh khác nhau.'],
  'hai-dang-cua-dai': ['sail', 'Cánh buồm hai mặt', 'Ở Cửa Đại, một mặt buồm hứng nắng, mặt kia hứng màu gì?', 'Hai dải đen trắng mượn từ tháp tròn đứng hai bên nếp buồm. Khi buồm đổi chiều, bức vẽ Cửa Đại cũng thay từ bóng râm sang nắng.'],
  'hai-dang-tan-hiep': ['gear', 'Ống nhòm bằng giấy', 'Các khoang đen trắng của đèn Tân Hiệp cuộn vừa vật gì?', 'Tờ giấy kẻ khoang cuộn thành một ống nhòm. Ở đầu kia, đèn biển Tân Hiệp hiện ra, đen trắng y hệt chiếc ống đang nhìn qua.'],
  'hai-dang-quan-tuong': ['beacon', 'Chiếc đèn bằng ngón tay', 'Một ngọn đèn cao hơn năm mét thu vào trang sẽ nhỏ thế nào?', 'Ngón tay cái che vừa chiếc tháp trắng Quản Tượng trong tranh. Tia sáng từ đỉnh thì thò ra xa hơn cả bàn tay.'],
  'hai-dang-ky-ha': ['wing', 'Chim giấy khoang đỏ', 'Một nét gập ở Kỳ Hà có thể cho tháp đôi cánh.', 'Mảnh giấy mang những khoang đỏ trắng xếp lại thành con chim. Gió Kỳ Hà đỡ lấy nó trước khi đầu cánh chạm nước.'],
  'hai-dang-tien-sa': ['lantern', 'Chiếc nhẫn Tiên Sa', 'Một khoang màu vàng có thể rời khỏi ngọn tháp trắng không?', 'Khoang vàng trượt khỏi hình tháp Tiên Sa thành chiếc nhẫn. Nhìn qua lòng nhẫn, cả ngọn đèn trắng vừa lọt trong một vòng nắng.'],
  'hai-dang-cu-lao-cham': ['shell', 'Vỏ ốc đeo bóng tháp', 'Ở Cù Lao Chàm, vỏ ốc mượn bóng xám nào để trang điểm?', 'Một vỏ ốc trắng nhích vào bóng tháp tròn. Trên bụng vỏ có thêm một nét xám cong, nhỏ như hình Cù Lao Chàm thu gọn.'],
  'hai-dang-son-cha': ['drop', 'Chút xanh Sơn Chà', 'Màu tháp Sơn Chà hòa vào trời hay vào nước?', 'Một vệt xanh nhạt tan ở cả hai mép trang. Chỗ màu đọng giữa trời và biển giữ lại đường cong của ngọn đèn Sơn Chà.'],
  'hai-dang-da-rang': ['sail', 'Phong bì cửa Đà Rằng', 'Bốn góc tháp Đà Rằng có thể gấp thành vật gì gửi ra biển?', 'Các góc trắng xếp thành một phong bì vuông. Nhà trạm thành con tem ở góc, dòng sông viết địa chỉ người nhận là biển.'],
  'hai-dang-ganh-den': ['star', 'Hạt xúc xắc Gành Đèn', 'Sáu mặt tháp Gành Đèn sẽ in loạt màu nào?', 'Sáu mặt của thân tháp in sắc đỏ trắng lên sáu mặt của hạt xúc xắc. Hạt lăn xuống trang giấy, mặt nào ngửa lên cũng ra tên Gành Đèn.'],
  'hai-dang-hon-nua': ['lantern', 'Hạt son ngoài Hòn Nưa', 'Viền đỏ nào ngắn vừa một đường gấp sáu cạnh?', 'Sáu mặt đỏ khép thành một hạt son nhỏ. Chấm lên trang giấy là hiện ngay ngọn hải đăng trên Hòn Nưa.'],
  'hai-dang-dai-lanh': ['star', 'Giọt bình minh Đại Lãnh', 'Một giọt nắng đầu ngày tìm chỗ đậu ở Đại Lãnh.', 'Giọt sáng lăn quanh thân tháp trắng rồi đứng lại ở đỉnh. Trong bức ký họa, bình minh đã lên dù cả mặt biển còn chưa tô màu.'],
  'hai-dang-cua-tieu': ['drop', 'Con nước qua chân cọc', 'Ngọn tháp thắt eo giữ sắc đỏ trắng bên trên điều gì?', 'Một lá thư nhỏ trôi giữa những chân cọc nhà trạm Cửa Tiểu. Trong thư vẽ đúng chiếc tháp thắt eo in bóng đỏ trắng xuống nước.'],

  'thap-doi': ['arch', 'Hai dấu nhấn Quy Nhơn', 'Hai ngọn tháp đứng kề có chia cùng một cái bóng?', 'Hai nét tháp Chăm in đậm trên nền giấy đỏ gạch. Mặt trời dịch sang bên, giữa hai bóng xuất hiện một khe sáng mảnh.'],
  'tam-quan-rach-gia': ['arch', 'Ba khung cửa xứ biển', 'Có tấm thiệp Rạch Giá nào mở ra bằng ba cửa?', 'Thiệp giấy bật dậy thành ba lối vòm của cổng Tam Quan. Qua lối giữa hiện con đường, qua hai lối bên là hai mảnh nắng thành phố.'],
  'pho-minh': ['ridge', 'Mười bốn nếp Phổ Minh', 'Tháp Phổ Minh cần bao nhiêu nếp giấy để lên tới chóp?', 'Hai nếp đầu giữ màu đá. Mười hai nếp còn lại nhỏ dần, cho đến khi đỉnh tháp vừa chạm đầu ngón tay.'],
  'toa-thanh-tay-ninh': ['star', 'Khoảng trời Tây Ninh', 'Giữa hai gác chuông của Tòa Thánh có một điểm nhìn rất riêng.', 'Đường viền mái hiện giữa hai gác chuông cân xứng. Nét vẽ dừng lại ở Thiên Nhãn, chừa phần trời quanh đó nguyên màu giấy.'],
  'thap-vinh-hung': ['ink', 'Mạch gạch Vĩnh Hưng', 'Một khe nhỏ trên mặt tháp hé ra màu gì của thời gian?', 'Nét mực lần theo vết khuyết trên mặt tháp Vĩnh Hưng. Đường viền đỏ gạch tách dần khỏi khoảng tối của lòng tháp.'],
  'chua-dia-tang-phi-lai': ['ridge', 'Dòng sỏi dưới núi Phi Lai', 'Viên sỏi nào giữ được dáng hai chú voi đá bên thềm?', 'Một viên sỏi trắng dừng bên nét phiến đá trên sân. Bề mặt nhẵn ôm lấy hai cái bóng voi quỳ và màu xanh của núi Phi Lai.'],
  'nha-ba-kien': ['ink', 'Vân lim làng Đại Hoàng', 'Mười sáu chiếc cột giữ điều gì dưới mái nhà ba gian?', 'Một vân gỗ chạy từ cột lim xuống chân đá xanh rồi in sang mép giấy. Vừa mở trang mang tên Đại Hoàng là thấy mái nhà Bá Kiến.'],
  'den-tran-thuong': ['dragon', 'Mảnh trăng trên nghi môn', 'Đôi rồng của nghi môn Trần Thương cùng nhìn về đâu?', 'Một nét tròn ở giữa hai đầu rồng thành vầng trăng nhỏ. Bên dưới, ba cửa vòm đóng khung con đường vào đền.'],
  'so-kien': ['gear', 'Hai đồng hồ cùng giờ', 'Hai chiếc đồng hồ Sở Kiện dành chỗ giữa cho hình gì?', 'Hai mặt số đứng cân nhau hai bên ô cửa hoa hồng. Trong tấm thiếp Kẻ Sở, kim phút hai bên vừa kịp cùng chỉ vào đóa hoa.'],
  'thanh-co-vinh': ['arch', 'Ô trời màu đá ong', 'Đá ở Cửa Tiền đóng khung trời thành dáng gì?', 'Vòm cổng đá ong mở một khoảng xanh dưới bóng vọng lâu. Qua mép cầu bắc ngang hào, ô trời ấy vừa khít tầm mắt.'],
  'lang-sen': ['leaf', 'Mảnh vườn Kim Liên', 'Sắc đỏ nào đứng sát liếp tre ở Làng Sen?', 'Một cánh dâm bụt ép vào trang sổ, cạnh nét mái tranh năm gian và hàng cau. Lật lại trang ấy là gặp một góc quê nội của Bác.'],
  'den-cuong': ['leaf', 'Nét rễ ôm cổng cũ', 'Có một nét vẽ ở đền Cuông lớn lên từng năm.', 'Rễ si men theo gạch tam quan, rủ xuống như những đường mực sống. Chỗ rễ ôm lấy vòm gạch dưới chân núi Mộ Dạ là góc trang đậm nhất.'],
  'den-hoang-muoi': ['dragon', 'Vầng trăng bên Mỏ Hạc', 'Hai nét rồng trên nóc cổng gặp bóng mình ở đâu?', 'Giữa đôi rồng trên cổng đền Ông Hoàng Mười hiện một vầng trăng nhỏ. Dòng nước bên nhánh sông Lam làm vầng trăng trong bóng chao đi rất khẽ.'],
  'km0-ho-chi-minh': ['ridge', 'Số không khởi hành', 'Ở Tân Kỳ, con số nào nhìn về quãng đường dài nhất?', 'Nét số 0 trên cột mốc đầu đỏ mở ra thành một vòng đường. Từ mép vòng ấy, nét bút bắt đầu chuyến đi Trường Sơn.'],
  'quang-binh-quan': ['arch', 'Vòm thành gói phố', 'Một vòm gạch Đồng Hới đóng khung được góc phố nào?', 'Từ khu vườn phía Lê Lợi có thể nhìn qua vòm gạch ra phía đường Quang Trung. Phía trên vòm là gác hai tầng mái.'],
  'nha-tho-tam-toa': ['ink', 'Nét gạch bên Nhật Lệ', 'Một nét đứng màu gạch còn in nơi bờ sông Đồng Hới.', 'Trong ký họa Tam Tòa, tháp chuông được giữ bằng một đường gạch đỏ. Trang giấy để trống bên cạnh dành chỗ cho ký ức của người trở về.'],
  'chua-thien-an': ['echo', 'Tiếng ngân qua Trà Khúc', 'Một hồi chuông từ núi Thiên Ấn sẽ đi theo đường nào?', 'Nét âm thanh từ lầu chuông xuôi dần theo triền núi. Chạm dòng Trà Khúc, nó tan vào bình yên của trang tranh.'],
  'chua-minh-thanh': ['lantern', 'Chín nếp son Pleiku', 'Chín tầng bảo tháp cần mấy lượt màu son?', 'Mỗi nếp gấp mang một đường son và một đường vàng. Mở hết chín nếp, bảo tháp chùa Minh Thành đứng thẳng trên trang phố núi.'],
  'po-klong-garai': ['sail', 'Chiếc thuyền trên đồi Trầu', 'Ở cụm tháp Po Klong Garai, con thuyền nào đứng trên mái?', 'Đường mái Tháp Lửa vút thành dáng thuyền. Bên dưới thuyền, những lớp gạch nung của đồi Trầu xếp thành con sóng đỏ.'],
  'thap-tram-huong': ['lotus', 'Nụ hồng ven đường Trần Phú', 'Ngọn tháp vừa mang dáng buồm, vừa giấu một nụ gì?', 'Các nét buồm màu hồng cam chụm dần thành nụ sen của tháp Trầm Hương. Sau lưng nụ sen bé ấy là cả một đường biển Nha Trang.'],
  'truong-duc-thanh': ['leaf', 'Dấu trang cây khế', 'Ở sân trường Dục Thanh, chiếc lá nào có thể ép vào vở?', 'Một chiếc lá khế nằm giữa trang ghi tên ngôi trường ở Phan Thiết. Gân lá rọi bóng lên dòng nhắc nhớ thầy giáo Nguyễn Tất Thành.'],
  'chua-linh-ung-son-tra': ['lotus', 'Vịnh nằm trong cánh sen', 'Đài sen trắng ở Bãi Bụt hướng về vùng nước nào?', 'Một cánh sen trắng khẽ khum lấy nét cong của vịnh Đà Nẵng. Trên nền trời Sơn Trà, bóng tượng Quan Âm vẫn hướng ra biển.'],

  'vinh-ha-long-cat-ba': ['sail', 'Thuyền luồn qua trang đá', 'Từ Hòn Trống Mái đến những cửa hang, thứ gì vẫn theo chân thuyền?', 'Mũi thuyền giấy lướt giữa hai hòn đá đối mặt rồi chui vào vòng tối của cửa hang. Nước vùng vịnh còn vương trên mép giấy lúc thuyền sang Cát Bà.'],
  'di-tich-co-do-hue': ['ink', 'Trang gấp hai bờ sông Hương', 'Một đường gấp nào nối được Ngọ Môn với tháp Phước Duyên?', 'Trang ký họa trải các mái lầu, ngọn cờ và bóng tháp dọc một nét sông Hương. Gấp trang theo dòng nước, những góc của Cố đô Huế lại xích gần.'],
  'pho-co-hoi-an': ['lantern', 'Một phố trong đèn xếp', 'Có chiếc đèn nào đưa vừa Chùa Cầu, nhà cổ và hội quán vào lòng?', 'Mỗi nếp giấy in một ngả phố Hội. Khi chiếc đèn xếp mở tròn, mái Chùa Cầu nằm cạnh vân gỗ nhà Phùng Hưng và sắc cổng Phúc Kiến.'],
  'quan-the-trang-an': ['sail', 'Bản đồ bằng mái chèo', 'Mái chèo Tràng An vẽ bản đồ bằng nét nào?', 'Tấm bản đồ mở ra từ bến thuyền, đường mực luồn giữa những khối núi đá vôi. Mỗi khúc quanh chừa một khoảng xanh để nhớ Tam Cốc và Hoa Lư.'],
  'phong-nha-ke-bang': ['echo', 'Ba vòm một tiếng gọi', 'Một tiếng gọi sẽ đổi nét ra sao từ Phong Nha tới Hang Én?', 'Trên giấy, tiếng gọi qua vòm Phong Nha, Động Thiên Đường rồi Hang Én. Mỗi vòm trả về một nét sóng khác nhau cho cuốn sổ đường hang.'],
  'yen-tu-con-son': ['leaf', 'Đường núi làm gân lá', 'Một chiếc lá có bao nhiêu ngả đường về miền núi chùa?', 'Gân lá tỏa thành những lối mảnh ghi tên Yên Tử, Vĩnh Nghiêm và Côn Sơn. Ở mép lá cuối cùng vẫn còn một nét đi về Kiếp Bạc.'],
  'hoang-thanh-thang-long': ['dragon', 'Đường rồng qua hai trang', 'Nét đá nào đợi người qua Đoan Môn đến nền Kính Thiên?', 'Trang đầu mở năm cửa vòm Đoan Môn. Lật sang trang sau, một đường mây hóa rồng đang ôm bậc thềm Kính Thiên.'],
  'quang-truong-ba-dinh': ['ink', 'Sổ tay một vòng Ba Đình', 'Trang sổ Ba Đình giữ những nét nào bên cạnh nhau?', 'Nét cột vuông của Lăng đứng cạnh hình mái nhà sàn và dáng sen Chùa Một Cột. Khoảng giấy rộng ở giữa dành cho Quảng trường Ba Đình.'],
  'cong-truong-cong-xa-paris': ['ink', 'Tem đôi Công xã Paris', 'Chỉ một bước xoay giữa công trường có thể in ra hai con tem.', 'Trên cặp tem liền mép, vòm đồng hồ bưu điện nhìn sang hai tháp nhà thờ Đức Bà. Hai nửa bưu thiếp cùng mang dòng địa chỉ Công trường Công xã Paris.'],
});

;
// sight-secret-inland.js
'use strict';

Object.assign(window.sightSecretStories, {
  'chua-hang-tra-vinh':['ridge','Nơi các đầu hồi gặp nhau','Hãy nhìn lên giữa mái chánh điện. Bên trên chỗ hai trục mái giao nhau có gì?','Một tháp nhọn vươn lên ở chính giữa. Từ góc ngắm mái ngói có thể lần theo các dải màu tới chân tháp.'],
  'bao-tang-khmer-tra-vinh':['arch','Một ô cửa dưới mái nhọn','Những ô kính nhỏ trên đầu hồi có hình gì?','Nhìn từ sân, các ô tam giác sáng và tối xếp thành từng hàng trong khung đầu hồi lớn. Bên dưới là mảng phù điêu trên mặt đứng nhà trưng bày.'],
  'chua-ang-tra-vinh':['arch','Mảng chạm trên mái','Nhìn vào giữa đầu hồi phía đông. Màu gì nằm sau những nét chạm vàng?','Phía sau những nét chạm vàng là nền xanh lục. Mảng gỗ hình tam giác nằm giữa hai bờ mái dốc.'],
  'mieu-ba-chua-xu-nui-sam': ['ridge', 'Ba vành ngói xanh', 'Từ sân miếu, hãy đếm những lần mái ngói xanh rút vào bên trên chánh điện.', 'Một vành mái che cả hàng cột; vành tiếp theo lọt vào trong, vành trên cùng hứng nắng. Ba mép ngói cùng in lên nền trời Châu Đốc.'],
  'ao-ba-om':['leaf','Vòm rễ ở Ao Vuông','Ở gốc cổ thụ, khoảng sáng phía dưới rễ có hình gì?','Một nhánh rễ đi ngang từ thân rồi hạ xuống cát, tạo thành một vòm thấp. Những cây sao, dầu quanh ao có nhiều dáng rễ khác nhau.'],
  'khu-mo-vo-nguyen-giap':['leaf','Tiếng chuông ở Vũng Chùa','Quả chuông treo dưới hai tầng mái có tên gì?','Vũng Chùa Hồng Chung là bốn chữ trên quả chuông đồng gần khu mộ. Dưới sườn núi Thọ là vũng biển nhìn ra Đảo Yến.'],
  'chua-tay-an-nui-sam': ['shell', 'Đôi voi dưới mái vòm', 'Hai tượng voi đứng dưới chân lầu, mỗi con có bao nhiêu ngà?', 'Voi sẫm màu mang hai ngà, voi trắng mang sáu ngà. Sau lưng chúng, những vành vòm Tây An nhô lên trên thềm gạch.'],
  'lang-thoai-ngoc-hau': ['ink', 'Khoảng sân Sơn Lăng', 'Qua cửa vòm trắng, hãy tìm ba ngôi mộ cùng quay mặt về phía cổng.', 'Mộ Thoại Ngọc Hầu ở giữa, hai bên là mộ hai phu nhân. Từ trên bậc đá, bạn nhìn thấy khoảng sân nối cả ba ngôi mộ.'],
  'chua-hang-phuoc-dien': ['echo', 'Đôi rắn ở Phước Điền', 'Dưới vòm hang, bên bệ thờ có hai sắc màu nào?', 'Thanh xà kề bạch xà, một xanh một trắng. Cặp tượng nhắc lại câu chuyện dân gian về Bà Thợ tu hành trên sườn núi Sam.'],
  'be-da-ba-ngu-nui-sam': ['star', 'Ô vuông đỉnh núi', 'Hãy cúi nhìn mặt sa thạch sẫm màu nơi Bà từng ngự.', 'Giữa bệ có một lỗ vuông. Nhìn từ mép ngoài, bạn thấy ánh sáng dừng lại ở thành hốc, để lòng đá tối màu hơn mặt trên.'],
  'chua-khleang-soc-trang': ['leaf', 'Đôi cánh dưới diềm', 'Nhìn lên nơi đầu cột hành lang gặp mái chánh điện.', 'Đôi cánh Krud xòe ra dưới mép ngói. Men theo hàng cột, bạn gặp lại dáng cánh ấy dưới từng nhịp mái.'],
  'chua-dat-set-soc-trang': ['ridge', 'Mười ba tầng đất', 'Thử đếm các vành nhỏ dần trên ngôi tháp Đa Bảo.', 'Từ chân tháp lên đến đỉnh có mười ba tầng. Người nặn tháp, ông Ngô Kim Tòng, làm cả những cửa tí hon dưới từng vành mái.'],
  'lang-ca-co-tu-soc-trang': ['ink', 'Cánh cổng Lăng Ca', 'Đứng ngoài đường Tôn Đức Thắng, bạn đọc được chữ gì dưới mái cổng?', 'Bốn chữ Lăng Ca Cổ Tự nằm ở giữa tam quan. Qua khỏi bóng mái ngói thấp này, sân chùa mở ra trước cầu thang lên chánh điện.'],
  'chua-som-rong': ['lotus', 'Bàn tay đỡ má', 'Nhìn từ sân lớn, Đức Phật nằm tựa đầu vào đâu?', 'Bàn tay phải nâng má, khuỷu tay đặt xuống bệ. Đường nếp áo dẫn mắt từ vai ra đến hai bàn chân ở đầu kia của sân.'],
  'go-cay-thi-oc-eo': ['ink', 'Bốn ô trên gò A', 'Trong nền chính điện cũ, các tường gạch chia ra bao nhiêu ô lớn?', 'Một hàng gạch ngang gặp một hàng dọc. Dưới mái bảo tồn, bốn ô chữ nhật còn ghi lại cách người xưa chia gian thờ.'],
  'nam-linh-son-oc-eo': ['drop', 'Lối nhỏ của dòng nước', 'Qua các nền gạch Nam Linh Sơn, hãy tìm hai vách hẹp đi song song.', 'Khoảng trống giữa hai vách là rãnh thoát nước. Sau bao lớp kiến trúc chồng lên nhau, đường nước vẫn hiện ra dưới nền cổ.'],
  'linh-son-co-tu-ba-the': ['ink', 'Hai bia bên bệ thờ', 'Hai bên tượng bốn tay ở Linh Sơn có vật gì màu sẫm?', 'Hai tấm bia đá đứng cạnh bệ thờ. Từ ngưỡng cửa, màu đá trầm làm nổi rõ thân tượng màu vàng ở chính giữa.'],
  'phu-chu-tich-ha-noi': ['ink', 'Sắc vàng dưới hàng vòm', 'Đứng ngoài sân, hãy tìm hai hàng cửa cong nằm giữa hai khối nhà nhô ra.', 'Nắng đọng trên nét gờ vàng quanh từng ô cửa. Lên tới mái, hai hàng vòm nhường chỗ cho dải con tiện và lá cờ trên cao.'],
  'dai-tuong-niem-bac-son': ['ridge', 'Mái đình trong lòng đá', 'Đường cong óng vàng nào mở ra giữa tấm đá trắng ở Bắc Sơn?', 'Ánh sáng lướt xuống lòng mái đình khoét sâu vào thân đài. Qua khoảng trống giữa hai chân mái, bạn còn nhìn thấy một mảnh trời.'],
  'chua-hoa-yen': ['ridge', 'Dải mái Hoa Yên', 'Hãy lần theo mái hành lang chạy ngang sườn núi.', 'Sau lớp ngói trước sân là một dải mái hẹp nối các nếp nhà. Đứng lệch sang bên, bạn nhìn được cả khoảng trời giữa hai dải mái.'],
  'chua-dong-yen-tu': ['ridge', 'Màu đồng trên đỉnh đá', 'Trên mỏm đá cao nhất, vật gì mang hình mái ngói mà đúc bằng đồng?', 'Màu đồng sẫm phủ từ hàng cột tới đầu đao của ngôi chùa nhỏ. Nắng vượt qua sống núi, bốn góc mái bừng lên trước tiên.'],
  'chua-vinh-nghiem-duc-la': ['echo', 'Nhịp chuông Đức La', 'Giữa các nếp chùa, hãy tìm sàn gỗ nâng tiếng chuông lên cao.', 'Từ sân nhìn vào gác, quả chuông sẫm nổi bật giữa các cột. Khoảng trống sau chuông còn để lọt một dải trời.'],
  'chua-con-son': ['lotus', 'Chín tầng đài sen', 'Qua hàng cột nhà Phẩm, bạn đếm được mấy tầng sen?', 'Cánh sen xếp từng vòng quanh trụ gỗ. Đếm tới tầng thứ chín, mắt đã lên gần chỗ ba lớp mái thu lại.'],
  'den-kiep-bac': ['arch', 'Ba cửa về Lục Đầu', 'Từ bên sông Lục Đầu, hãy nhìn đường vào đền qua các vòm cửa.', 'Vòm giữa mở ra một khoảng sân rộng. Hai cửa bên giữ bóng mát dưới mái nghi môn.'],
  'thai-mieu-nha-tran': ['ridge', 'Nếp chữ Vương', 'Nhìn từ trên nghiêng xuống, những mái ngang nối với nhau ra sao?', 'Ba dải ngói ngang gặp mái dọc giữa các nếp điện. Dưới chân đồi, trục ấy khuất sau bậc đá của Thái miếu.'],
  'bai-coc-yen-giang': ['drop', 'Dấu gỗ bên sông Chanh', 'Trong ô nước phẳng, vệt sẫm nào vẫn nhô lên?', 'Mặt nước phản chiếu bờ kè. Những đầu gỗ mòn giữ nguyên vị trí khi gợn nước chạy qua.'],
  'dong-kinh-chu': ['echo', 'Hai cửa Kính Chủ', 'Từ chân núi nhìn lên, ánh sáng vào vòm động qua mấy cửa?', 'Gờ đá chia vùng sáng phía nam làm hai. Từ ban thờ trong động nhìn ra, viền sáng nhấn rõ từng nếp gồ của vòm đá.'],
  'chua-thanh-mai': ['ink', 'Bóng bia Viên Thông', 'Sau nhà Tổ, hãy tìm tấm đá đứng cạnh lối tham quan.', 'Mảng nắng lướt qua trán bia. Trên bệ thấp, đường cong của lưng rùa dẫn mắt về phía ngôi tháp.'],
  'chua-nham-duong': ['echo', 'Hốc núi Thánh Hóa', 'Từ mái Phật điện, lối ngắm nào đưa bạn vào lòng đá?', 'Ở cửa động sau chùa, màu núi chuyển dần sang tối. Dưới chân du khách là nơi từng tìm thấy những chiếc răng hóa thạch.'],
  'chua-giai-oan': ['leaf', 'Bóng cây Giải Oan', 'Tán cây bên hiên vừa in bóng vào chỗ nào trên sân?', 'Giữa quãng leo núi, bóng lá rơi mát trên bậc chùa. Sau tán cây là hàng hiên thấp dẫn vào chính điện.'],
  'chua-bao-sai': ['ink', 'Am Ngộ Ngữ', 'Hãy vòng mắt qua mái chùa tới am bên vách đá.', 'Sau mái chùa, vòm đá che nơi gắn với việc biên soạn kinh. Ánh sáng dừng lại ở cửa am Ngộ Ngữ Viện.'],
  'chua-lan-yen-tu': ['drop', 'Vòng sáng Như Ý', 'Trước Đại Hùng Bảo Điện, hãy tìm một mặt đá tròn hứng nắng.', 'Một đốm sáng trượt qua quả cầu Như Ý. Bệ đá giữ khối cầu ngay ngắn giữa sân, trước hàng cột của điện.'],
  'am-chua-ngoa-van': ['ridge', 'Hồ lô trên tháp', 'Bên am Ngọa Vân, nét tháp vuông đổi thành đường cong ở đâu?', 'Trên hai tầng thân đá là chóp tháp hình hồ lô. Đường cong nhỏ khép nét tháp giữa sườn Bảo Đài.'],
  'chua-bo-da': ['leaf', 'Lối đất Bổ Đà', 'Dọc lối vào chùa, những mảnh gốm nằm ở đâu trên bờ đất?', 'Nhìn ngang vai thấy bức tường đất, ngẩng lên mới gặp hàng mảnh gốm che trên đầu tường. Xa hơn, vườn tháp hiện ra sau lối hẹp.'],
  'den-vua-dinh-tien-hoang': ['dragon', 'Lưng rồng bên long sàng', 'Tìm đôi nét cong ôm lấy phiến đá trước bái đường.', 'Giữa sân, đôi rồng chầu hai bên long sàng. Ánh xiên lướt qua lưng rồng rồi rọi vào đường khắc trên mặt đá.'],
  'den-vua-le-dai-hanh': ['ridge', 'Ba nếp mái đền Lê', 'Từ sân rồng, hãy lần theo nếp mái nhỏ ở giữa hai tòa điện.', 'Qua bái đường, mái thiêu hương chạy dọc vào chính cung. Nhìn nghiêng từ sân, ba nếp mái mới tách rõ khỏi nhau.'],
  'den-thai-vi': ['echo', 'Chuông giữa tám mái', 'Đứng phía nghi môn nhìn vào sân, nơi nào còn giữ tiếng ngân?', 'Phía bên phải sân, quả chuông nằm trong bóng mát của hai tầng mái. Khoảng trống giữa các cột mở ra những ngọn núi của thung lũng.'],
  'chua-bich-dong': ['arch', 'Vòm cửa sau cầu đá', 'Hãy theo dãy phiến đá bắc qua hồ sen tới chân tam quan.', 'Ở cuối cầu, lối đi thu lại dưới vòm giữa. Ngẩng lên một chút mới thấy hàng ô cửa nhỏ giữa các tầng mái.'],
  'chua-nhat-tru-hoa-lu': ['lotus', 'Búp sen trên cột kinh', 'Mắt bạn có đi hết được một cạnh cột đá đến tận đỉnh?', 'Tám mặt thân cột cùng đưa mắt lên cao. Dưới hai tầng mái, búp sen đá đón lấy ánh sáng từ một khoảng hở bên lầu.'],
  'den-tran-noi-lam': ['dragon', 'Nét chạm Nội Lâm', 'Hãy nhìn gần một trong bốn cột đá trước hiên đền.', 'Trên nền đá xanh, nét chạm nổi sáng lên khi ánh xiên ngang qua. Lùi ra một bước, bốn cây cột lại khuất vào bóng mái tiền bái.'],
  'phu-khong-trang-an': ['leaf', 'Rễ thị ôm đá', 'Dưới tán thị cạnh phủ, những đường nâu bò đến đâu?', 'Một chiếc rễ nổi lên khỏi mặt đá, chẻ nhánh rồi khuất sau bậc thềm. Bóng của nó mảnh hơn nét rễ một chút.'],
  'hanh-cung-vu-lam': ['drop', 'Ô nước giữa hàng cột', 'Hãy nhìn xuyên qua hàng cột thủy đình về phía dòng nước.', 'Đôi cột đứng yên giữa dòng. Một con thuyền vừa đi qua, bóng hai cột trên nước đứt thành những đoạn ngắn.'],
  'ben-thuyen-tam-coc': ['sail', 'Mái chèo Văn Lâm', 'Giữa dãy thuyền nép bờ, hãy tìm một mái chèo đang nghỉ.', 'Mái chèo nằm chéo qua chiếc ghế ngang. Ngoài mũi thuyền, dòng Ngô Đồng dẫn về phía những cửa hang.'],
  'phu-van-lau': ['ink', 'Tờ chiếu màu sông', 'Gió sông Hương vừa lật góc tờ giấy nào?', 'Trên tờ giấy vẽ Phu Văn Lâu, một hàng cột son đứng làm lề. Mặt sông lấp lánh chảy qua khoảng trống để dành cho chữ.'],
  'cau-ngoi-thanh-toan': ['drop', 'Bảy gian mưa', 'Mưa qua cầu Thanh Toàn phải đi qua mấy mái nhà?', 'Một hạt mưa lăn trên mái ngói, qua bảy gian cầu như qua một xóm nhỏ. Đến mép hiên, nó thả mình xuống nước.'],
  'lang-khai-dinh': ['dragon', 'Bậc thềm Châu Chữ', 'Trên sườn núi, đường cong nào đi cùng bậc thẳng?', 'Nắng lên từng bậc đá ở Ứng Lăng. Chiếc bóng uốn theo thành rồng, dừng lại ngay trước sân Bái Đính.'],
  'quang-truong-hcm-vinh': ['lotus', 'Chín cánh đá', 'Chín phiến đá ở Vinh có thể nở thành hình gì?', 'Một nét chì đi qua bức tường đá sau tượng Bác. Từng phiến nối nhau thành những cánh sen đang mở.'],
  'bao-tang-xo-viet-nghe-tinh': ['ink', 'Hai tiếng Nghệ Tĩnh', 'Có hai tiếng nào đi liền nhau trên bìa sổ ở Vinh?', 'Trên bìa sổ màu ngói là hai tiếng Nghệ Tĩnh. Trang đầu dành cho những người đã xuống đường năm ấy.'],
  'cua-ta-thanh-vinh': ['arch', 'Nửa vòng mặt trời', 'Cổng phía đông thành Vinh đón ngày mới ra sao?', 'Mặt trời bằng mực đỏ mới in được một nửa. Vòm Cửa Tả khép vừa nửa còn lại.'],
  'cua-huu-thanh-vinh': ['ink', 'Lối về phía tây', 'Đường mực nào đi hết một ngày ở Thành Vinh?', 'Nét mực theo lối đá đến Cửa Hữu rồi dừng. Bóng cổng phía tây kéo dài nét ấy tới tận mép tranh.'],
  'den-tho-quang-trung': ['ridge', 'Dáng núi Dũng Quyết', 'Có nét mái nào nối tiếp được đường núi ở Vinh?', 'Trên đỉnh Dũng Quyết, đường cong mái đền chạm đúng chỗ nét núi ngừng lại. Một nét vẽ giữ được cả hai.'],
  'chua-dai-tue': ['ridge', 'Tầng mây Đại Huệ', 'Tầng nào của ngôi tháp trên núi tan được trong nắng?', 'Sương ghé ngang ngọn tháp Đại Tuệ, thêm vào một tầng trắng mỏng. Nắng qua, ngôi tháp lại trả tầng ấy cho núi.'],
  'mo-ba-hoang-thi-loan': ['ink', 'Sợi chỉ Động Tranh', 'Đường cong trên mộ bà gợi lại công việc nào?', 'Một sợi chỉ chạy qua nét vẽ khung cửi trên núi Động Tranh. Đường chỉ khép lại bên tên bà Hoàng Thị Loan.'],
  'que-ngoai-hoang-tru': ['leaf', 'Bông râm bụt Hoàng Trù', 'Màu đỏ nào vừa đủ cho một góc sân quê ngoại?', 'Giữa màu đất sân và màu rạ của mái nhà, một bông râm bụt hé qua hàng rào. Góc sân Hoàng Trù có thêm một chấm son.'],
  'den-con-quynh-phuong': ['shell', 'Hạt muối Quỳnh Phương', 'Gió ở cổng đền Cờn mang theo vị gì?', 'Một hạt muối nhỏ nép dưới nét vẽ mái đền. Hạt trắng bé bằng đầu kim mà giữ được vị gió cả vùng biển Quỳnh Phương.'],
  'cau-cua-hoi': ['sail', 'Đường chỉ cửa sông', 'Sông Lam khâu liền hai bờ ở chỗ nào gần biển?', 'Sợi chỉ căng từ Vinh sang Nghi Xuân thành một nhịp cầu. Bên dưới Cửa Hội, đầu chỉ còn lại tuột ra biển cùng con nước.'],
  'cau-ben-thuy': ['echo', 'Nhịp xe qua Lam', 'Dòng sông có đếm nhịp giống người qua Bến Thủy?', 'Trên cầu là nhịp bánh xe lăn. Dưới cầu, sông Lam chỉ đếm những quãng sáng giữa hai bóng trụ.'],
  'nha-tho-chinh-toa-xa-doai': ['echo', 'Âm cuối Xã Đoài', 'Sau tiếng chuông, chiều Xã Đoài còn giữ được gì?', 'Dưới tên Xã Đoài, nét bút ngân dài như âm cuối một tiếng chuông. Đến mép giấy mới thật yên.'],
  'dinh-trung-can': ['arch', 'Bóng hiên Trung Cần', 'Đốm nắng trước sân đình dừng ở đâu?', 'Đốm nắng đi hết mấy viên gạch sân Trung Cần rồi chạm bóng hiên. Ngay ranh giới ấy, màu đỏ gạch bỗng dịu đi.'],
  'tuong-dai-truong-bon': ['leaf', 'Nhành cỏ Truông Bồn', 'Một nhành cỏ bên đường đủ chừa lại bao nhiêu khoảng lặng?', 'Trên trang ghi tên Truông Bồn chỉ có một nhành cỏ nghiêng. Người vẽ để phần giấy còn lại tưởng nhớ những người đã nằm xuống.'],
  'bao-tang-quan-khu-4': ['star', 'Ngôi sao trước sân', 'Có ánh sáng nào đứng yên trước sân bảo tàng?', 'Giữa khoảng sân trưng bày ở Vinh, một ngôi sao nổi lên bằng nét khắc. Nắng đổi hướng, nét sao còn nguyên trên trang sổ.'],
  'cau-ham-rong': ['dragon', 'Hai nét lưng rồng', 'Sông Mã giữ hình con rồng bằng mấy nét cong?', 'Hai vòm thép nối lưng giữa sông Mã. Trong bóng nước, những thanh giằng đã thành hàng vảy nhỏ.'],
  'chinh-dien-lam-kinh': ['turtle', 'Lưng rùa giữ chữ', 'Ở Lam Kinh, ai kiên nhẫn mang cả một trang đá?', 'Con rùa đá trong ký họa khom lưng đỡ tấm bia. Qua bao lần lật sổ, hàng chữ vẫn đứng thẳng trên mai.'],
  'den-ba-trieu': ['ridge', 'Dáng voi chân núi Gai', 'Tảng đá nào ở sân đền có đôi tai lớn?', 'Nắng tách vành tai khỏi màu đá xám. Hai dáng voi chầu hiện ra bên lối đến đền Bà Triệu dưới chân núi Gai.'],
  'den-doc-cuoc-sam-son': ['shell', 'Vỏ ốc núi Cổ Giải', 'Sóng Sầm Sơn đi theo lối nào lên núi?', 'Trong tranh có một vỏ ốc nằm bên triền đá. Sóng chỉ cần để tiếng rì rào vào đó là lên tới đền Độc Cước.'],
  'hon-trong-mai-sam-son': ['wing', 'Hai mỏ đá Trường Lệ', 'Đôi chim nào đứng mãi giữa gió Sầm Sơn?', 'Trên phiến đá Trường Lệ, hai chiếc mỏ nghiêng về nhau. Gió biển luồn qua, đôi chim đá vẫn đứng nguyên chỗ cũ.'],
  'tuong-dai-le-loi-thanh-hoa': ['star', 'Điểm sáng Thuận Thiên', 'Trên bức vẽ tượng Lê Lợi, chỗ nào chạm nắng trước?', 'Ánh sáng đậu lên mũi gươm thành một ngôi sao nhỏ. Dọc sống gươm, nét sáng chạy xuống đến bàn tay tượng.'],
  'thai-mieu-nha-hau-le': ['ink', 'Nét son Thái Miếu', 'Tên một triều đại nằm gọn dưới mái nào ở xứ Thanh?', 'Bóng mái ngói che lên dòng chữ Hậu Lê vừa viết. Người vẽ chấm một nét son ở đầu trang dành cho Thái Miếu.'],
  'cau-song-han': ['gear', 'Kim đồng hồ trên sông', 'Chiếc kim lớn nào quay mà vẫn nối được hai bờ Đà Nẵng?', 'Mặt sông thành mặt số. Nhịp giữa cầu Sông Hàn xoay đi như một chiếc kim, để con thuyền trôi qua đúng chỗ vừa mở.'],
  'cau-tran-thi-ly': ['sail', 'Cánh buồm neo bằng thép', 'Buồm nào trên sông Hàn căng gió mà neo cả hai bờ?', 'Trụ nghiêng làm cột buồm, những sợi dây văng xòe ra đón gió. Dưới cánh buồm Trần Thị Lý, một con thuyền thật vừa đi qua.'],
  'cau-thuan-phuoc': ['drop', 'Đáy võng Thuận Phước', 'Nếu một giọt mưa được đi theo nét cáp trong tranh?', 'Giọt mưa trượt theo đường cáp võng xuống thấp nhất rồi đứng lại. Ngay bên dưới, sông Hàn đang tìm đường ra biển.'],
  'bao-tang-cham-da-nang': ['ink', 'Màu sa thạch', 'Nét chì nào giữ được độ sâu của một đường chạm?', 'Nắng lướt qua đường chạm Chăm, để lại một phía sáng và một phía sẫm. Người họa sĩ chỉ tô phía sẫm mà hình sa thạch đã nổi lên.'],
  'thanh-dien-hai': ['arch', 'Nếp gấp tường thành', 'Mảnh giấy vẽ Điện Hải cần gấp ở đâu?', 'Nét tường chạy thẳng rồi ngoặt ở góc pháo đài. Gấp giấy theo nét ngoặt ấy, thành Điện Hải nhô lên khỏi trang.'],
  'nha-trung-bay-hoang-sa': ['ink', 'Dấu son hướng biển', 'Mặt tiền nhà trưng bày gợi đến dụng cụ nào trên bàn viết?', 'Khối nhà bên biển thu lại thành một con dấu. Trên nền giấy trắng hiện ra hai chữ Hoàng Sa màu son.'],
  'chua-tam-thai-ngu-hanh-son': ['ridge', 'Khoảng trời Thủy Sơn', 'Trên Thủy Sơn, mái ngói vừa chạm vào đường gì?', 'Một bên là nét núi đá gồ ghề, một bên là mép mái Tam Thai thanh mảnh. Giữa hai nét vẽ còn vừa một lát trời xanh.'],
  'dinh-tuy-loan': ['dragon', 'Nét cong bình phong', 'Ai đang đợi sau nét cong trên bình phong Túy Loan?', 'Nét đầu trông như bờm ngựa. Nét sau uốn thành vảy rồng, để lộ hình long mã trên bình phong trước đình.'],
  'dinh-bo-ban': ['arch', 'Khoảng sân hai trụ', 'Khung tranh của sân đình Bồ Bản bắt đầu ở đâu?', 'Hai trụ trước sân thành hai cạnh khung. Mép mái đình khép cạnh trên, còn cạnh dưới người vẽ để mở cho khách vào.'],
  'hoi-quan-trieu-chau': ['lantern', 'Quả hồng bằng lụa', 'Giữa sắc ngói xanh, cái gì đỏ như một quả chín?', 'Chiếc đèn lụa Triều Châu đung đưa trước mái hội quán. Tua đèn rủ xuống, hé lộ bí mật của quả hồng trên sợi dây.'],
  'thap-bang-an': ['arch', 'Tờ giấy tám nếp', 'Phải gấp mấy nếp mới ôm hết thân tháp Bằng An?', 'Tờ giấy quấn quanh thân tháp rồi mở ra thành tám mặt gấp. Nắng chọn đúng một nếp để tô đậm màu gạch Điện Bàn.'],
  'thap-khuong-my': ['arch', 'Ba dấu gạch Khương Mỹ', 'Có hàng chữ nào chỉ cần ba dấu gạch đỏ?', 'Ba tháp đứng thẳng hàng như ba dấu gạch trên đất Khương Mỹ. Một đường nắng chạy ngang, nối chúng thành hàng chữ riêng của làng.'],
  'thap-chien-dan': ['ink', 'Ba bóng Chiên Đàn', 'Ba tháp Chiên Đàn có chung một nét vẽ không?', 'Người vẽ đặt ba khối gạch lên trang rồi chỉ kẻ một đường chân đất. Ba bóng tháp tách ra nằm trên cùng đường ấy.'],
  'dien-thai-hoa': ['dragon', 'Vệt vàng giữa cột son', 'Giữa những cột son, đường cong vàng đang dẫn về đâu?', 'Một nét rồng vàng vòng quanh sắc son trong ký họa điện Thái Hòa. Đuôi nét uốn vào trong, để khoảng sân phía trước thật rộng.'],
  'hien-lam-cac': ['ink', 'Chín vòng miệng đỉnh', 'Vẽ Cửu Đỉnh, nét nào phải lặp lại chín lần?', 'Chín vòng miệng đỉnh lần lượt hiện trên tờ giấy màu đồng. Bóng Hiển Lâm Các phủ ngang qua, nối chúng lại thành một hàng.'],
  'cua-hien-nhon': ['lantern', 'Mảnh màu Hiển Nhơn', 'Một mảnh sành nhỏ giữ được mấy màu nắng?', 'Các mảnh sành sứ trên cửa Hiển Nhơn hứng nắng ở những góc khác nhau. Một mảnh xanh vừa tắt thì mảnh vàng bên cạnh sáng lên.'],
  'lang-minh-mang': ['lotus', 'Hai lầu trong một hồ', 'Lầu nào ở Hiếu Lăng chỉ dựng được khi mặt hồ yên?', 'Minh Lâu hiện dưới hồ thêm một lần nữa. Một chiếc lá sen lay nhẹ, lầu trong nước tan ra trước lầu trên bờ.'],
  'lang-tu-duc': ['ink', 'Dòng thơ Lưu Khiêm', 'Gió viết dòng đầu ở hồ Lưu Khiêm bằng thứ mực nào?', 'Bóng lan can Xung Khiêm Tạ nằm thành một hàng trên mặt hồ. Gió lùa qua, hàng bóng ngắt nhịp như câu thơ mới viết.'],
  'truong-quoc-hoc-hue': ['ink', 'Mực đỏ Quốc Học', 'Màu nào ở Quốc Học vẽ kín được cả trang lưu bút?', 'Một góc tường đỏ in sang tờ giấy học trò. Giữa nền đỏ, ba vòm cổng để hở ba khoảng trắng vừa lọt ánh chiều Huế.'],
  'nha-tho-phu-cam': ['wing', 'Hai trang mở Phủ Cam', 'Cuốn sách bằng nét trời nào mở ra trên đồi?', 'Hai tháp nhà thờ Phủ Cam nghiêng ra như hai trang sách. Một cánh chim qua khoảng giữa, làm dấu ngay chỗ gáy.'],
  'nha-tho-dong-chua-cuu-the': ['echo', 'Tiếng chuông qua góc mái', 'Tiếng ngân rời ngọn tháp sẽ gặp đường cong nào?', 'Trên nét vẽ nhà thờ Dòng Chúa Cứu Thế, tiếng chuông loang xuống. Đường ngân cuối lướt qua góc mái cong rồi tan vào chiều Huế.'],
  'ho-quyen-hue': ['echo', 'Vòng vang Hổ Quyền', 'Một tiếng bước chân đi được mấy vòng sân?', 'Nét âm thanh chạy men theo vòng tường gạch Hổ Quyền. Trở về đúng điểm đầu, nó chỉ còn nhỏ bằng tiếng cát dưới chân.'],
  'chua-tu-hieu': ['leaf', 'Kim thông trên trăng nước', 'Trước chùa Từ Hiếu, sao trăng khuyết giữa ban ngày?', 'Hồ bán nguyệt giữ hình một vầng trăng bằng nước. Một lá thông mảnh chạm xuống, khẽ gạch một nét qua trăng.'],
  'chua-bao-quoc': ['leaf', 'Bóng lá Hàm Long', 'Đồi Hàm Long gửi gì vào trang vẽ chùa Báo Quốc?', 'Một bóng lá nằm trên nét bậc thềm. Người vẽ để nguyên khoảng xanh ấy làm dấu cho ngôi chùa trên đồi Hàm Long.'],
  'tang-thu-lau': ['ink', 'Cuốn sách giữa hồ', 'Cuốn sách nào có hào nước làm đường viền?', 'Mặt hồ Học Hải thành bìa quyển sách, chiếc cầu là dải đánh dấu trang. Chính giữa bìa hiện lên Tàng Thư Lâu.'],
  'chua-huong-tich-ha-tinh': ['ridge', 'Mây ghé Can Lộc', 'Mẩu mây qua mái chùa Hương Tích sẽ mắc vào đâu?', 'Một dải mây nằm vắt giữa sườn núi và mái chùa ở Can Lộc. Gió kéo nhẹ, dải trắng tuột về bên kia núi.'],
  'den-cho-cui': ['sail', 'Mẩu gỗ xuôi Lam', 'Vật nhỏ nào có thể chở bóng mái đền Chợ Củi?', 'Mẩu gỗ trong bức vẽ theo nước dạt vào bờ Nghi Xuân. Nó dừng một thoáng ngay chỗ bóng mái đền in trên sông.'],
  'den-vo-mieu-ha-tinh': ['arch', 'Dấu dừng trước Võ Miếu', 'Nét bút từ phố Hà Tĩnh sẽ dừng ở đâu?', 'Nét phố rộn ràng đến cổng Võ Miếu thì thu nhỏ lại. Bên trong khung cổng, người vẽ chỉ đặt một nét mái và một khoảng sân yên.'],
  'tuong-dai-xo-viet-can-loc': ['ink', 'Trang sổ ngã ba Nghèn', 'Ba đường chì gặp nhau ở địa danh nào của Can Lộc?', 'Ba đường mảnh gặp nhau trước tượng đài ở ngã ba Nghèn. Bên giao điểm là dòng chữ tưởng nhớ người dân Can Lộc trong phong trào Xô viết Nghệ Tĩnh.'],
  'cau-nhat-le': ['drop', 'Nhịp cầu qua Nhật Lệ', 'Từ bờ Đồng Hới nhìn dọc cầu, phần dầm dày lên ở đâu?', 'Dầm dày lên trên các trụ giữa sông. Phía trên là mặt đường, lề bộ hành và hàng đèn dẫn sang Bảo Ninh.'],
  'tuong-dai-me-suot': ['sail', 'Nét chèo Nhật Lệ', 'Một mái chèo có thể vẽ cả bến đò không?', 'Người vẽ theo dáng mái chèo bên tượng Mẹ Suốt rồi thêm một nét nước Nhật Lệ. Hai nét vừa đủ để nhớ một người đưa đò.'],
  'dia-dao-vinh-moc': ['leaf', 'Khoảng xanh trên đất đỏ', 'Đất Vịnh Mốc giữ hai màu nào trong cùng một trang sổ?', 'Trên lát cắt màu đất đỏ là một vệt cỏ xanh. Bên dưới, một đường chì men theo lòng đất, gợi ngôi làng từng sống dưới địa đạo.'],
  'thanh-dia-la-vang': ['arch', 'Ô trời La Vang', 'Bức tường cũ ở La Vang còn giữ được mảnh màu nào?', 'Qua ô vòm của tháp chuông cũ, bầu trời thành một mảng xanh nguyên vẹn. Quanh mảng xanh là nét gạch sẫm màu thời gian.'],
  'chung-tich-son-my': ['ink', 'Dòng chữ Sơn Mỹ', 'Có trang nhật ký chỉ cần ghi tên nơi mình dừng chân.', 'Trên trang giấy là hai chữ Sơn Mỹ. Phần còn lại dành cho một phút tưởng niệm những thường dân đã mất.'],
  'nha-tho-go-kon-tum': ['leaf', 'Đường vân biết uốn', 'Đường nào đi từ gốc cây vào được vòm nhà thờ?', 'Một đường vân gỗ trong ký họa chạy hết cây cột rồi vòng qua mái hiên. Nét ấy giữ lại màu cây cho nhà thờ Gỗ Kon Tum.'],
  'cau-treo-kon-klor': ['sail', 'Sợi võng màu cam', 'Mắc võng qua dòng sông ở Kon Klor cần sợi màu gì?', 'Một sợi cáp cong nối hai tháp cầu màu cam. Dưới chiếc võng ấy, dòng sông trôi qua mà chẳng làm sợi dây chùng thêm.'],
  'thap-banh-it': ['sail', 'Chiếc thuyền trên đồi', 'Trong những mái tháp Bánh Ít, mái nào có thể bồng bềnh?', 'Hai đầu mái tháp Yên Ngựa cong lên như mũi thuyền. Người vẽ thêm một nét mây dưới chân, chiếc thuyền gạch vừa rời đồi.'],
  'thap-duong-long': ['ridge', 'Ba đỉnh màu gạch', 'Có dãy núi nào ở Tây Sơn chỉ có ba chóp đỏ?', 'Ba bóng tháp Dương Long nối nhau thành đường chân trời. Chạm gần mới thấy từng đỉnh được xếp bằng những viên gạch nhỏ.'],
  'bao-tang-quang-trung': ['echo', 'Nhịp trống Tây Sơn', 'Âm nào trong tên Tây Sơn làm rung cả mặt giấy?', 'Một dùi trống vừa nhấc lên trong tranh. Vòng mực trên mặt trống loang rộng tới dòng chữ Bảo tàng Quang Trung.'],
  'quang-truong-dai-doan-ket': ['echo', 'Vòng chiêng Pleiku', 'Giữa quảng trường, một vòng tròn có thể ngân xa đến đâu?', 'Từ tâm chiếc chiêng đá trong ký họa, những vòng nét lan qua quảng trường Đại Đoàn Kết. Vòng ngoài cùng chạm đến dòng tên Pleiku.'],
  'tuong-dai-chien-thang-bmt': ['arch', 'Sáu đường về Ban Mê', 'Sáu nét phố ở Buôn Ma Thuột cùng gặp nhau ở đâu?', 'Sáu nét chì tỏa từ chân tượng đài Ngã Sáu. Nơi chúng gặp nhau, hai vòm đỡ in bóng xuống mặt đường.'],
  'thap-nhan-tuy-hoa': ['wing', 'Cánh nhạn bằng mực', 'Dấu thanh nào vừa bay khỏi tên ngọn tháp?', 'Bên chữ Nhạn, ngòi bút chợt rẽ thành hai cánh. Con chim giấy vòng qua chóp tháp trên núi rồi trở về bên tên Tuy Hòa.'],
  'nha-tho-mang-lang': ['arch', 'Đăng ten Mằng Lăng', 'Hai tháp nhà thờ cắt nền trời Tuy An thành hình gì?', 'Những ô vòm sáng lên trên nền tường sẫm. Ghép các khoảng trời ấy lại, mặt tiền Mằng Lăng hóa thành một tấm đăng ten mỏng.'],
  'nha-tho-nui-nha-trang': ['ridge', 'Màu xám giữa phố biển', 'Hộp màu vẽ nhà thờ Núi cần đến mấy thỏi chì?', 'Chỉ một thỏi chì xám đi từ chân đồi lên đỉnh tháp. Ấn đậm ở kẽ đá, nhấc nhẹ ở vòm cao, nhà thờ Núi đã hiện hình.'],
  'chua-long-son-nha-trang': ['lotus', 'Cánh sen trắng Long Sơn', 'Màu trắng trên đồi Nha Trang được đỡ bằng những cánh gì?', 'Từng cánh sen trắng mở quanh chân tượng Phật. Trên nền trời xanh, người vẽ để khoảng giấy sáng nhất cho dáng Phật ngồi yên.'],
  'thap-po-sah-inu': ['ink', 'Đốm nắng Pô Sah Inư', 'Một viên gạch ở tháp Chăm giữ được màu nắng bao lâu?', 'Nắng Phan Thiết lùi khỏi tường tháp. Trên tranh Pô Sah Inư, viên gạch cuối cùng vẫn đỏ như còn giữ một đốm nắng bên trong.'],
  'thap-nuoc-phan-thiet': ['lotus', 'Bông sen sông Cà Ty', 'Bông sen nào ở Phan Thiết có đến tám mặt?', 'Các cạnh bầu nước trên thân tháp xòe thành một đài sen. Dòng Cà Ty mượn bóng bông sen ấy mang xuống dưới chân cầu.'],
  'quang-truong-lam-vien': ['leaf', 'Nụ kính bên hồ', 'Loài cây nào ở Lâm Viên có thể giấu cả bầu trời trong nụ?', 'Từng lá kính xanh khép lại thành nụ atisô. Một mẩu trời Đà Lạt còn in trên lá ngoài cùng, cạnh sắc vàng của bông dã quỳ.'],
  'nha-tho-con-ga-da-lat': ['wing', 'Tiếng gáy bằng đồng', 'Con gà thức dậy trước phố núi bằng cách nào?', 'Một tia nắng đậu lên mào gà đồng ở đỉnh tháp. Trong ký họa Đà Lạt, đó là tiếng gáy đầu tiên của buổi sáng.'],
  'cd-su-pham-da-lat': ['ink', 'Chiếc thước cong', 'Thước kẻ của ngôi trường gạch đỏ bị uốn ở đâu?', 'Một nét cong ôm dãy lớp học Đà Lạt rồi dừng ở tháp chuông. Đường cong đặt lên trang vở bỗng thành chiếc thước riêng của trường.'],
  'den-nguyen-xi': ['ink', 'Bốn nét nghi môn', 'Tên Nguyễn Xí đứng sau mấy nét thẳng ngoài nghi môn?', 'Bốn trụ cổng hóa thành bốn nét sổ trên giấy. Lọt giữa những nét thẳng là đầu mái đao cong của đền.'],
  'den-vua-mai-hac-de': ['ridge', 'Bờm đá núi Đụn', 'Dưới chân núi Đụn, chiếc bờm nào đứng yên trước gió?', 'Gió đi qua sân đền Vua Mai, lay tán cây trên cao. Chiếc bờm ngựa đá phía dưới vẫn nguyên từng nét khắc.'],
  'khu-luu-niem-phan-boi-chau': ['ink', 'Dòng kẻ hàng cau', 'Trang sổ ở Nam Đàn lấy đâu ra dòng kẻ thẳng?', 'Những thân cau bên nhà tranh đổ bóng lên giấy thành hàng kẻ. Trên dòng đầu tiên là tên nhà chí sĩ Phan Bội Châu.'],
  'den-qua-son': ['echo', 'Hai nửa tiếng ngân', 'Hai gác ở Quả Sơn sẽ lên tiếng bằng hai nét nào?', 'Một nét tròn dành cho mặt trống, một nét loe cho miệng chuông. Hai nét đối nhau qua khoảng sân đền Quả Sơn.'],
  'den-bach-ma-thanh-chuong': ['leaf', 'Lá rơi giữa đôi ngựa', 'Chiếc lá trước đền Bạch Mã sẽ đáp xuống ô gạch nào?', 'Một chiếc lá nghiêng qua bờm đôi ngựa trắng rồi nằm xuống sân. Viên gạch ngay giữa hai bóng ngựa vừa có một dấu xanh.'],
  'tuong-dai-xo-viet-hung-nguyen': ['ink', 'Nét đỏ Thái Lão', 'Trang ký ức Hưng Nguyên mở đầu bằng ngày nào?', 'Nét đỏ theo hình ngọn lửa trên tượng đài Thái Lão. Dưới chân nét vẽ là ngày 12 tháng 9 năm 1930, ngày người dân Hưng Nguyên xuống đường.'],
  'cau-yen-xuan': ['gear', 'Năm ô cửa sông Lam', 'Dòng Lam hiện qua mấy ô khung thép ở Yên Xuân?', 'Mỗi nhịp giàn thép đóng khung một mảnh nước. Đặt năm ô tranh cạnh nhau, cây cầu Yên Xuân đã nối liền hai mép giấy.'],
  'nha-hat-trung-vuong': ['echo', 'Khuông nhạc mặt tiền', 'Những cột cao trên phố Hùng Vương đang giữ nhịp cho ai?', 'Một hàng cột nhà hát chia mặt tiền thành từng phách. Dưới mái sảnh Trưng Vương, nét rèm vừa hé đúng phách đầu.'],
  'bao-tang-da-nang': ['ink', 'Bảng màu số 42', 'Căn nhà bên sông Hàn ghi địa chỉ bằng ba màu nào?', 'Vàng kem của tường, xanh của cửa chớp, đỏ của mái ngói cùng in lên một góc giấy. Bức bưu họa chỉ cần đề số 42 Bạch Đằng.'],
  'bao-tang-my-thuat-da-nang': ['star', 'Tam giác phố Lê Duẩn', 'Bức tranh nào ở bảo tàng được bốn cây cột nâng lên?', 'Bốn cột tròn giữ một mảng tam giác ở đầu hồi. Người vẽ đặt mẩu trời sáng nhất vào giữa hình tam giác ấy.'],
  'lang-gia-long': ['ridge', 'Hai nét song song', 'Trên triền Thiên Thọ, có hai nét đá nào luôn đi cạnh nhau?', 'Giữa những đường thông dọc sườn núi, hai nét đá nằm song song trong Bửu Thành. Bức ký họa giữ nguyên khoảng cách nhỏ giữa hai ngôi mộ.'],
  'lang-dong-khanh': ['drop', 'Giọt màu Ngưng Hy', 'Trên trang vẽ Tư Lăng, mảng kính nào vừa để rơi một giọt màu?', 'Một vệt sáng lọc qua cửa kính màu, đậu xuống nền điện Ngưng Hy. Nó nằm yên như một giọt nước màu còn ướt.'],
  'chua-dieu-de': ['drop', 'Màu men sông Đông Ba', 'Sông Đông Ba có thể mượn màu gì từ cổng chùa?', 'Mái ngói thanh lưu ly soi xuống nước. Mỗi gợn sóng nhặt một mảnh xanh, mang màu cổng Diệu Đế đi xa thêm một đoạn.'],
  'den-song-son': ['drop', 'Nét bơi dưới cầu đá', 'Đường mực nào ở Sòng Sơn cứ chạy ngược con suối?', 'Dưới cầu đá, một nét bạc lách qua dòng nước xanh. Tới bóng cổng đền, nét bạc quẫy đuôi thành con cá.'],
  'dan-te-nam-giao-tay-do': ['star', 'Trời vuông Đốn Sơn', 'Dưới chân núi Đốn Sơn, bầu trời nằm trong khung gì?', 'Miệng Giếng Vua đóng khung vuông một mảnh trời. Chung quanh, ba cấp nền đá mở dần ra như những đường viền lớn hơn.'],
  'nha-tho-chinh-toa-thanh-hoa': ['lotus', 'Bông hồng trên tường vàng', 'Bông hoa nào ở nhà thờ Chính tòa Thanh Hóa nở nhờ ánh sáng?', 'Những cánh cửa sổ hoa hồng rọi lên trang giấy. Giữa màu tường vàng đất, bông hoa ấy có cả một bầu trời làm nhụy.'],
  'chua-cam-son': ['shell', 'Vỏ ốc nghe thông', 'Từ triền Thiên Cầm, vỏ ốc nghe được hai tiếng gì?', 'Một mặt vỏ hướng xuống biển, mặt kia nghiêng về rừng thông. Trong tranh chùa Cầm Sơn, tiếng sóng và tiếng lá gặp nhau đúng ở vành ốc.'],
  'khu-tuong-niem-ha-huy-tap': ['leaf', 'Cọng rạ Cẩm Hưng', 'Một cọng rạ có thể gợi mái nhà quê hương của ai?', 'Cọng rạ nằm ngang nét mái nhà gỗ ở Cẩm Hưng. Phía dưới, người vẽ cẩn thận ghi tên Hà Huy Tập.'],
  'khu-luu-niem-hai-thuong-lan-ong': ['leaf', 'Lá đánh dấu trang thuốc', 'Cuốn sổ dưới núi Minh Tự dùng gì để đánh dấu trang?', 'Một chiếc lá nhỏ giữ chỗ trong trang sổ dành cho danh y Lê Hữu Trác. Gân lá mảnh chạy xuống tận dòng chữ Hải Thượng Lãn Ông.'],
  'san-bay-ta-con': ['wing', 'Bốn bóng cánh quạt', 'Có thể vẽ Tà Cơn chỉ bằng những khoảng bóng nào?', 'Bốn bóng cánh quạt nằm im bên đường băng trong bức phác họa. Phía trên sân bay cũ, trang giấy dành một khoảng trời yên tĩnh.'],
  'bao-tang-tong-hop-quang-binh': ['arch', 'Bốn chóp ngói', 'Nhìn từ sân, có gì nhô lên ở bốn góc của bảo tàng?', 'Bốn tháp góc có chóp ngói riêng. Ở giữa là khối mái ngói lớn, nhô cao hơn vành tường màu vàng đất.'],
  'cua-dong-thanh-dong-hoi': ['arch', 'Hai mái trên gác trắng', 'Đi từ ngoài hào vào thành, bạn nhìn thấy vật gì ngay sau cây cầu đá?', 'Qua hết lan can là vòm cửa bằng gạch đỏ. Phía trên có gác canh trắng và hai tầng mái ngói của Cửa Đông sau khi tôn tạo.'],
  'mui-thanh-dong-bac-dong-hoi': ['leaf', 'Lối gạch sát hào', 'Từ mũi thành, lối đi đỏ men theo bờ nào?', 'Lối đi men theo bờ trong của hào. Bên kia mặt nước là đường Quách Xuân Kỳ và dòng sông Nhật Lệ.'],
  'bia-thanh-dong-hoi': ['arch', 'Bia đá bên cầu Nam Thành', 'Đứng trước bia đá có thể thấy vật liệu gì dưới lớp vữa của tường?', 'Những viên gạch đỏ lộ ra nơi lớp vữa cũ đã bong. Đoạn tường kết thúc gần vỉa hè phía tây cầu Nam Thành.'],
  'cau-da-cua-dong-dong-hoi': ['arch', 'Diềm gạch trên mặt nước', 'Viền gạch đỏ dưới thân cầu tạo thành hình gì?', 'Một vòm cuốn nối hai chân cầu. Nhìn xiên từ mép hào có thể thấy mặt nước chạy xuyên qua khoảng mở dưới vòm.'],
  'hoanh-son-quan': ['arch', 'Một bước qua mây', 'Trên Đèo Ngang, có cửa nào khép vừa một đám mây?', 'Mây đi qua vòm Hoành Sơn Quan, hóa thành mảng trắng có mép cong. Bậc đá bên kia đèo vừa hiện ra dưới chân mây.'],
  'bao-tang-tong-hop-quang-ngai': ['ink', 'Đường cong chiếc chum', 'Một vòng cung ngoài sân bảo tàng kể chuyện gì về Sa Huỳnh?', 'Ngòi bút từ vai chum lượn xuống thân rồi thu lại ở đáy. Trong đường viền mảnh là cả dáng chum Sa Huỳnh của Quảng Ngãi.'],
  'thap-binh-lam': ['leaf', 'Vệt dừa trên gạch', 'Ai kẻ sọc xanh lên màu gạch Bình Lâm?', 'Tàu dừa nghiêng trước tháp, từng lá con cắt nắng thành sọc mảnh. Chút gió đồng bằng đủ đổi cả hoa văn trên bức tường.'],
  'tuong-dai-tran-hung-dao-quy-nhon': ['sail', 'Nét chỉ ra khơi', 'Từ mũi Hải Minh, đường chỉ tay còn đi tiếp đến đâu?', 'Nét bút theo cánh tay tượng Trần Hưng Đạo kéo dài ra vịnh Quy Nhơn. Ngoài đường chân trời, một cánh buồm nhỏ đón lấy đầu nét.'],
  'biet-dien-bao-dai-bmt': ['leaf', 'Mùi lá trong trang sổ', 'Chiếc lá nào có thể làm cả trang giấy gợi nhớ Ban Mê?', 'Một lá long não lọt vào nếp gấp trang vẽ biệt điện. Mở sổ ra, hàng hiên dài đã nằm gọn dưới tán cây.'],
  'chua-thanh-luong': ['shell', 'Hai mặt của biển', 'Biển Tuy An để lại hai chất liệu nào trong nét vẽ chùa?', 'Một nét xù xì dành cho đá san hô, một nét nâu nhẵn cho gáo dừa. Bên nhau ở Thanh Lương, hai nét nhỏ mang theo hơi biển.'],
  'thap-po-rome': ['ridge', 'Nếp đồi Hậu Sanh', 'Tờ giấy Hậu Sanh phải gấp ở đâu để tháp đứng cao lên?', 'Một nếp gấp dựng lên sườn đồi đá. Ngay trên đỉnh nếp giấy, tháp gạch Po Rome đỏ sẫm dưới trời.'],
  'thien-vien-truc-lam-da-lat': ['leaf', 'Nốt lặng Tuyền Lâm', 'Lá thông từ đồi Phượng Hoàng sẽ viết gì lên hồ?', 'Một chiếc lá thông kẻ nét mảnh trên bóng nước Tuyền Lâm. Xa hơn một chút là mái thiền viện màu nâu vàng giữa rừng.'],
  'dinh-3-bao-dai-da-lat': ['drop', 'Góc kính đồi Ái Ân', 'Đồi thông uốn mình ở chỗ nào trên Dinh III?', 'Hàng thông đứng thẳng ngoài vườn nhưng cong nhẹ trong ô kính bo tròn. Một bông hồng ở bậc dưới điểm màu vào góc phản chiếu.'],
});

;
// sight-secret-fieldnotes.js
'use strict';

// OSM identifiers distinguish individual stops, including separate cave
// entrances. The miniature stories are original fiction.
(()=>{
  const notes=[
    [5418467363,'ridge','Nếp gấp cây số không','Mở đầu con đường bằng dấu gì?','Một nếp gấp dựng đứng giữa trang thành trụ đá. Số không nằm ngay chân trụ, còn con đường chạy dài tới tận mép sổ.'],
    [1490413978,'ink','Hàng cột trên sân cỏ','Một giọt mực vừa đi qua mấy hàng hiên?','Bóng cột nhà trưng bày kẻ những dòng ngắn trên bãi cỏ. Giọt mực lướt qua hàng cuối rồi nằm im dưới mái đón.'],
    [13005765528,'ridge','Vân núi Các Mác','Đường vân nào đi từ mặt đá sang chiếc lá?','Một khe đá trên sườn núi thu nhỏ thành nét xám. Ở rìa tem nét ấy chạm cuống lá, đổi sang màu rêu.'],
    [4527762070,'lotus','Cánh sen ngược','Cánh hoa nào nở từ trần hang xuống?','Giọt nước men theo một nếp nhũ ở Ngườm Ngao. Khi giọt rơi vào ô đá bậc thang, bóng đài sen lật lên trên mặt nước.'],
    [13378657667,'arch','Khe đá Khuổi Ky','Vệt nắng nào đang đứng thay cho một cột nhà?','Nắng sớm lọt qua gầm sàn đá thành một vệt dài. Con dấu giữ vệt ấy ngay dưới mái ngói, sát chân cầu thang.'],
    [10821152105,'arch','Khe sáng dưới Đỉnh Hương','Mặt nước vừa lộ ra ở đâu dưới chân hòn đá?','Trên tem, thủy triều rút khỏi chân Đỉnh Hương. Một khe sáng mở ra giữa hai chân đá, vừa đủ cho con sóng giấy lướt qua.'],
    [994065796,'shell','Vòng xoắn ở Mê Cung','Đường vào mê cung nào nằm gọn trên đầu ngón tay?','Chiếc vỏ ốc nhỏ ở cửa động lần lượt mở từng vòng xoắn trên trang giấy. Nét cuối quay về đúng chỗ khởi đầu.'],
    [3494811567,'sail','Khung đá Bồ Nâu','Qua tấm rèm đá, cánh buồm nào vừa sang bờ sáng?','Từ trong vòm hang, những đầu nhũ sẫm màu viền quanh mặt vịnh. Một cánh buồm đỏ nhỏ như nét bút lướt qua khung ấy.'],
    [3560283504,'drop','Một chèo qua Hang Luồn','Làm sao nối hai khoảng trời bằng một mái chèo?','Ngoài cửa là vịnh, bên kia là áng nước. Mái chèo kéo một nét bạc qua vòm thấp, nối hai khoảng trời vào nhau.'],
    [5147203123,'shell','Một lớp nền Tiên Ông','Vệt trắng nào dưới chân khối nhũ đã ở đó từ lâu?','Nhìn sát nền hang trên tem thấy một vỏ nhỏ nằm trong lớp đất. Trang sổ khép lại vẫn chừa một khe sáng cho mép vỏ.'],
    [3157796075,'leaf','Làn gió Sơn Đoòng','Chiếc lá nào vừa đổi hướng trước khe đá?','Một chiếc lá trên tem xoay ngang rồi khựng lại ở miệng hang. Luồng gió từ trong khe lật nó lên, để lộ đường gân bạc.'],
    [3499399985,'echo','Tiếng ngân sau rèm đá','Âm cuối nấp ở nếp nào trong rèm nhũ?','Một gợn âm chạy dọc nếp đá Tiên Sơn. Khi gợn âm tắt, trên tem còn những đường song song như khuông nhạc.'],
    [5063396623,'ink','Một nét sông Chày','Thử lần theo bóng tay vịn trên mặt nước.','Vệt bóng dưới lối gỗ kéo thành nét mực xanh. Tới chỗ nước khuất dưới vòm Hang Tối, nét mực đổi sang màu than.'],
    [5353612634,'leaf','Lá bên bậc đá','Làn khói hương dừng lại ở mép lá nào?','Bên cửa Hang Tám Cô, một chiếc lá nghiêng trên bậc đá. Trên trang sổ còn nét khói mảnh và một khoảng lặng.'],
    [4387487189,'drop','Một vòng nước Moọc','Viên sỏi dưới cầu đang giữ chiếc vòng nào?','Dưới cầu tre, nước ôm lấy hòn sỏi rồi tỏa sang hai bên. Một vòng gợn nhỏ đọng lại trên con dấu Suối Nước Moọc.'],
    [10220706855,'ink','Nét mực khuất ở Hoa Lư','Một con đường vừa đi đâu mất giữa trang?','Lối mòn bằng mực đi đến Dông hoàng hô thì chui qua một nếp gấp. Lật nếp giấy lên, nét đường còn nối tiếp.'],
    [10239352348,'echo','Tiếng khô ở Hang Ken','Âm nào gõ vào giấy mà chẳng làm nhòe mực?','Ở cửa Hang Ken Dry, một tiếng cốc nảy qua ba vệt đá vẽ chì. Mép sổ hứng trọn tiếng cuối.'],
    [10239352351,'star','Đốm nắng Hang Sun','Mẩu nắng đi lạc dưới vòm sẽ trốn vào đâu?','Qua miệng hang trên tem, mẩu nắng rút nhỏ thành một chấm sao. Nó rọi vừa đủ chữ Sun.'],
    [10239659646,'drop','Dấu ướt ở Hang Ken','Lần này Hang Ken trả lời bằng một vòng tròn?','Một giọt mực đáp xuống chữ Wet. Cả cái tên rung ra thành vòng nước, còn chữ Ken vẫn đọc được ở giữa.'],
    [10239660887,'wing','Cánh thư ra khỏi hang Tôn','Một phong thư sắp gặp lại ánh sáng.','Từ lối ngầm ở hang Tôn, lá thư lần theo dải sáng ra ngoài. Hai góc phong bì bật lên thành cánh.'],
    [10268906506,'arch','Ô cửa bên nếp Đà Bắc','Mép đồi gập xuống để hở hình gì?','Tấm bản đồ Đà Bắc gấp đôi ngay tại Hang Sung. Nếp gấp đội lên thành cửa nhỏ vừa một đầu bút.'],
    [10745434207,'drop','Hai nét Vực Song','Hai vệt mực đổ xuống có về chung một dòng?','Chữ Song chia dòng sông giấy làm đôi. Tới chân thác, hai vệt nhập lại thành một giọt tròn.'],
    [10915418305,'leaf','Chiếc lá gửi từ Minh Long','Chiếc lá vượt thác bằng mặt nào?','Tới Savannah, chiếc lá giấy lật ngửa giữa dòng suối. Mặt dưới mang một bưu dấu nhỏ của Minh Long.'],
    [11155986405,'ink','Nét ria trong Rat Cave','Dấu chấm ở vòm tối có mấy nét ria?','Một dấu mực mọc thêm những nét ria mảnh. Chú chuột giấy tha hạt sáng chạy tót vào tên hang.'],
    [11162900606,'star','Lỗ kim của Hang Tối','Đặt một chấm sáng vào bóng tối, cái nào còn lại?','Hang Tối nuốt cả mảng mực trên tem. Một lỗ kim xuyên qua trang lại trả về đúng một vì sao.'],
    [11491560194,'drop','Làng tí hon trong bọt thác','Một ngôi làng nhỏ đến mức nào mới chui lọt giọt nước?','Tên làng Xì Trum thu bé cả con tem. Trong giọt bọt thác Bảo Đại hiện ra một mái nhà chỉ bằng đầu bút.'],
    [11693046937,'beacon','Đèn nước Ia Kha','Giọt nào ở thác Ánh Sáng biết tự thắp đèn?','Vệt thác gập lại thành tim đèn trong suốt. Từ Ia Kha, nó gửi một tia sáng xuyên ngang mặt tem.'],
    [11693051212,'drop','Nốt thứ chín ở Ia Kha','Dòng chữ Chín Tầng còn thiếu một chấm.','Một hạt nước lăn xuống chín dòng kẻ ở Ia Kha. Đến dòng cuối, nó nằm im thành dấu chấm câu.'],
    [11693194897,'echo','Hai tiếng Krông Kmar','Hai tiếng trong tên thác đổi nhịp ở đâu?','Dòng nước giấy gõ tiếng Krông vào mép đá. Từ khoảng trống dưới thác bật lên tiếng Kmar.'],
    [11752083772,'leaf','Lá thư thác Grăng','Một vệt xanh vừa tách khỏi dòng suối trắng.','Chiếc lá len qua vệt thác Grăng rồi mắc lại ở lề trang. Trên cuống là hai chữ Thạnh Mỹ.'],
    [11797210006,'sail','Thuyền gấp An Viễn','Góc giấy ở Dầu Giây có thể nổi không?','Dòng sông trên tem gấp góc giấy thành một chiếc thuyền. Nó xoay đúng một vòng dưới thác An Viễn.'],
    [11808242193,'echo','Lời đáp thác Vọng','Một tiếng gọi ở Nam Ban trở về bằng đường nào?','Chữ Vọng rơi xuống mặt sông rồi dội trở lên. Bản sao bằng nước của nó treo ngược bên dưới con tem.'],
    [11841319471,'ink','Nét vằn thứ nhất','Con hổ giấy để gì trước cửa số một?','Một nét vằn rời lưng hổ và nằm ngang cửa hang số một. Nó thành dấu gạch đầu tiên của bộ tem Tiger Cave.'],
    [11841319526,'echo','Bốn bước dưới vòm hổ','Ở cửa số bốn có một nhịp chân không thấy bóng.','Bốn dấu chân mực lách theo lối ngầm. Dấu cuối biến vào mép giấy, để tiếng vọng quay về cửa số bốn.'],
    [11841319532,'star','Sáu chấm mắt hổ','Sáu đốm sáng ở cửa hang ghép thành hình gì?','Sáu chấm trên tem chụm thành ba đôi mắt. Chúng chớp lần lượt, chỉ để lại số sáu ở cửa Tiger Cave.'],
    [11841319548,'arch','Dấu ngoặc Hang Over','Ở cửa phía Ba Đồn, nửa dấu ngoặc đang đợi ai?','Nét lối đi bộ khom mình thành một dấu ngoặc mở. Bên trong, tờ tem ghi riêng lần ghé Hang Over ở Ba Đồn.'],
    [11841319556,'ink','Mặt sau của Hang Over','Nửa dấu ngoặc nào còn ở phía Đồng Hới?','Một nét mực theo lối ngầm vào mặt sau trang giấy. Đến cửa Hang Over phía Đồng Hới, nó khép lại thành dấu ngoặc.'],
    [11860856192,'drop','Bọt trắng Búk So','Một hạt bọt vừa nhảy khỏi chữ nào?','Giọt bọt tung khỏi dòng suối trên tem, lấp vừa dấu sắc trong chữ Búk. Tên thác sáng lên được một nhịp.'],
    [11868866769,'ridge','Nếp nước Khau Lan','Đường sông ở Quản Bạ gặp nếp núi sẽ ra sao?','Tờ bản đồ gấp dọc một nếp núi. Nét sông ở Khau Lan chảy qua nếp gấp, thành thác nước thu nhỏ.'],
    [11891214381,'wing','Cánh bay Phi Liêng','Chữ Phi giấu một đôi cánh ở nét nào?','Một hạt bọt ở Phi Liêng xòe thành cánh. Nó bay ngược lên qua dải nước rồi nằm lại bên chữ Phi.'],
    [11892522615,'drop','Mưa bay ngược ở Đa Mi','Một dải nước hẹp có thể bung rộng đến đâu?','Dải nước trên tem Đa Mi chạy xuống rồi tẽ thành bụi mưa. Một hạt đi ngược gió, lạc vào dấu chấm của chữ i.'],
    [11892998247,'leaf','Lá nghiêng ở Lạc Tánh','Lá thư thác Bà gửi từ bờ suối nào?','Dưới dòng suối giấy ở Lạc Tánh, một chiếc lá nghiêng mình hứng bọt. Mỗi giọt in lên lá một chữ Bà tí xíu.'],
    [11898330382,'star','Bình minh Đắk Mai','Có một chấm ban mai còn mắc giữa dòng.','Chữ Mai làm hạt bọt đầu tiên trên tem ửng sáng. Theo dòng thác, chút bình minh ấy trôi về phía Đức Phong.'],
    [11929776256,'drop','Vòng chữ O','Chữ nào trong tên thác Kueng O giữ được một giọt sông?','Chữ O tuột khỏi hàng, lăn xuống chân thác. Trở về dòng chữ, nó còn đựng một giọt nước Chư Sê.'],
    [11935665922,'ink','Nét dăng ngang suối','Nếu nối hai bờ bằng một nét bút thật mảnh?','Dòng suối Dray Dăng chạm vào sợi mực căng ngang trang. Những giọt nước xếp thành hàng trên sợi chỉ ấy.'],
    [11935665927,'drop','Dấu mũ Dray Êga','Một giọt sông đang đội chiếc mũ nhỏ.','Dấu mũ ở chữ Ê rơi xuống dòng sông trên tem Buôn Hồ. Một giọt bọt đội nó lên rồi trả về đầu chữ.'],
    [11941200957,'star','Giọt lệ ánh kim','Có hạt nước nào sáng đến mức tưởng là kim loại?','Một giọt Lệ Kim lăn xuống khung tem. Lúc nó đi qua, đường mực đen ánh lên một vệt vàng.'],
    [11949540736,'echo','Phách nước Rô Sia','Tên thác này vừa vặn mấy nhịp?','Rô chạm đá, Sia chạm sông. Hai âm nhảy trên con tem gửi từ Măng Đen thành một nhịp thác nhỏ.'],
    [11981151505,'arch','Chiếc thang La Dạ','Tên Chín Tầng có xếp được thành một chiếc thang?','Chín nếp giấy mở ngang thành rèm nước La Dạ. Khi tem gấp lại, từng nếp khít nhau như bậc thang bỏ túi.'],
    [12718347031,'ink','Ba âm ở Háng Đề Chơ','Ba âm nào có thể bước qua một con suối?','Háng, Đề, Chơ hóa ba hòn cuội chữ trên giấy. Dòng trắng len qua từng khe rồi tụ lại ở mép tem Văn Chấn.'],
    [12841393747,'drop','Khe mực Chi Lăng','Dòng nước mảnh đến mức nào mới lọt giữa hai trang?','Ở Khe Dầu, một sợi suối trốn vào đường chỉ khâu sổ. Chỗ nó ló ra bên kia còn đọng một giọt.'],
    [13025997447,'echo','Nhịp đôi Pa Pết','Tiếng thứ hai ngắn hơn tiếng đầu một chút.','Pa và Pết đập vào hai bờ của con sông bằng giấy. Hai tiếng dừng cùng lúc dưới một nét thác.'],
    [13025997448,'sail','Con số biết nổi','Trong số 16, chữ số nào giấu được nước?','Số một làm cột buồm, số sáu giữ một giọt trong bụng. Cả con số lênh đênh trên tem của Thác Thôn 16.'],
    [13026556967,'drop','Ba giọt Tam Tham','Có mấy giọt khởi hành và mấy giọt về tới cuối trang?','Chữ Tam nhả ba giọt xuống con suối trên giấy. Tới lề tem Lạc Dương, chúng nhập làm một dấu chấm tròn.'],
    [13043101392,'ink','Sợi bạc Sa Pa','Ai vừa kéo một sợi chỉ sáng qua sườn giấy?','Thác Bạc se vệt nước thành sợi chỉ mảnh. Sợi chỉ khâu một đường lấp lánh quanh hai chữ Sa Pa.'],
    [13195214196,'leaf','Chiếc thìa lá Seo Ho','Lá nào giữ được một ngụm suối?','Chiếc lá gấp lòng thành chiếc thìa bé xíu. Nó múc một giọt Seo Ho vào giữa trang Thuận Hòa.'],
    [13437193401,'wing','Cánh dơi gấp ngược','Con dấu Phú Quốc này treo ngược rồi mới đọc được?','Hai nếp giấy xòe thành cánh dơi. Lúc tem trở chiều, đôi cánh khép lại vừa khít cửa Hang Dơi.'],
    [13475984320,'ink','Gai bút Mai Châu','Mấy ngòi bút đang chụm lưng dưới vòm?','Chữ Nhim trong tên hang cuộn lại thành một chú nhím mực. Mỗi chiếc gai của nó ký một nét nhỏ lên tem.'],
    [13913405701,'wing','Sợi chỉ treo mây','Đám mây ở tên thác treo bằng sợi gì?','Thác Mây Treo nhả một sợi nước thật mảnh. Đám mây giấy móc vào sợi ấy, lơ lửng mãi trên con tem.'],
    [13981250677,'drop','Dòng cao Liêng Ài','Nét trắng nào dài quá một ô sổ?','Vệt Liêng Ài chạy qua mép trang thứ nhất. Lật sang trang kế bên mới thấy giọt nước chạm chân thác.'],
    [13981268740,'leaf','Ba đường về Tam Hợp','Ba nét gân lá gặp nước sẽ hẹn nhau ở đâu?','Trên tem Tam Hợp, ba đường gân đi ba ngả rồi gặp nhau ở cuống lá. Một giọt suối đang đợi ở đó.'],
    [14060550929,'echo','Tiếng tròn Rapora','Đọc tên thác theo nhịp một giọt rơi.','Ra, po, ra bật qua ba vòng nước trên tem. Vòng sau cùng quay lại, ôm vừa chữ Ra đầu tiên.'],
    [14063028460,'ink','Nét nối Đam Rông','Hai tiếng nằm hai bên bờ có viết liền được không?','Chữ Đam đứng một bên dòng mực, chữ Rông ở bên kia. Vệt nước từ thác trên tem nối liền hai bờ.'],
    [14063041527,'leaf','Tàu cau hứng thác','Từ hai chữ Cây Cau có chiếc lá nào trổ ra?','Một tàu cau giấy nghiêng xuống đỡ dòng thác. Nước lần từng nếp lá, hết nếp cuối thì rơi vào sổ.'],
    [14063061748,'arch','Khung nước Hang Ka','Chữ Hang có thể mở một ô cửa trong dòng thác?','Trong tên Cheo Hang Ka, chữ Hang mở một vòm trống. Dải thác giấy đổ ngay trước vòm như tấm mành.'],
    [1707326178,'shell','Vỏ thư Cát Hải','Có một chiếc phong bì cong như vỏ ốc.','Từ cửa Tien Duc, lá thư cuộn theo đường xoắn trên vỏ ốc giấy. Tới vòng ngoài mới đọc thấy bưu dấu Cát Hải.'],
    [1725481657,'ink','Khoảng trống Người Xưa','Trên tờ tem còn khoảng trắng bằng một bàn tay.','Một bàn tay giấy che ngang cửa Động Người Xưa. Khi bàn tay rời đi, khoảng trắng của nó nằm nguyên trong khung.'],
    [1731350168,'drop','Bọt mắc chữ Băng','Bọt có chịu đứng yên trong chữ Băng?','Dòng thác Băng Rup đóng khung một hạt bọt giữa trang. Vừa khép sổ, hạt nước lại chảy dưới chân chữ.'],
    [1758586716,'wing','Mây qua cửa Vân Thông','Một sợi mây có lọt qua lỗ kim?','Chữ Vân thả xuống sợi mây mảnh. Nó luồn qua cửa hang trên tem, nối hai mặt giấy như sợi chỉ khâu.'],
    [1995508763,'arch','Cung điện gấp Sơn Cung','Tờ giấy cùng lắm gấp được bao nhiêu gian?','Tờ tem dựng đứng quanh cửa Sơn Cung, mỗi nếp giấy thành một gian nhỏ. Cung điện bé đến mức vừa nằm trên ngón tay.'],
    [2093848434,'ink','Linh Nham thu nét','Nếu thu nhỏ một vách đá còn bằng đầu bút?','Hai nét chì tựa vào nhau quanh cửa Linh Nham. Một khoảng hang sâu hiện lên giữa chỗ hai đầu bút chưa chạm.'],
    [2440165325,'drop','Giọt hẹn Sa Pa','Hai giọt nước rơi cách nhau có gặp lại không?','Trên tem Thác Tình Yêu, chúng rơi từ hai mép khác nhau. Tới cuối dải nước dài, cả hai in chung một vòng tròn.'],
    [2455467654,'star','Ngân hà dưới giấy','Ai giấu cả bầu trời vào Galaxy Grotto?','Tấm tem Tam Điệp gập mặt tối lên trên. Những lỗ kim trên vòm hang nối nhau thành một dải ngân hà.'],
    [3093994368,'drop','Cuộn rèm Đambri','Cuộn chỉ nào mở mãi mới tới chân thác?','Nét nước dài Đambri xổ ra thành một bức rèm rộng trên tem. Cuộn lại hết rèm mới lộ được dấu Lộc Thắng.'],
    [3094061320,'leaf','Gấp lá Dasara','Một chiếc lá có bao nhiêu mép thác?','Lá thư Dasara gấp hình đàn xếp. Đi qua mỗi nếp, giọt nước lại rơi thêm một đoạn thật ngắn.'],
    [3107525356,'sail','Nửa buồm Sông Ray','Nhìn vệt trắng nghiêng bên dòng chữ Ray.','Một nửa vệt trắng làm thác, nửa còn lại căng thành buồm. Hai nửa liền nhau trên dòng sông giấy Phước Bửu.'],
    [3189545835,'lantern','Đèn nhỏ trong động Tiên','Ai để quên một hạt sáng ở Tam Điệp?','Ở cửa Tien Grotto, lớp giấy mỏng bao lấy hạt sáng thành lồng đèn. Ánh đèn hắt một khoanh nhỏ lên vòm.'],
    [3266893772,'star','Dấu nước K50','Hai chữ số ấy có làm được một mật hiệu?','Dòng nước dài vạch chữ K lên tem. Số năm bật khỏi đá, còn số không đựng gọn bọt trắng ở chân thác.'],
    [3494799892,'star','Hoa nở trong chữ đá','Chữ Hoa trong Hoa Cương có mấy cánh?','Một chấm sáng nhân lên theo các nét góc cạnh. Khi nhìn lại, trong chữ Cương đã có một bông hoa bằng đá giấy.'],
    [3499295493,'arch','Thiên Đường lọt qua khe','Một cánh cửa nhỏ có thể mở ra khoảng sáng nào?','Hai mép giấy ở Động Thiên Đường từ từ tách ra. Cả khoảng trắng phía sau ùa vào con tem qua một khe thật mảnh.'],
    [357411250,'ink','Bức tranh tự chảy','Tranh ở Suối Tranh dùng loại mực nào?','Dòng suối trên tem Phú Quốc nhấc một giọt làm bút. Bức tranh vừa xong, nét cuối đã trôi sang trang khác.'],
    [3816819309,'echo','Tiếng gầm bằng nước','Tên Hang Cọp có gửi được một tiếng gầm qua thác?','Chữ Cọp mở miệng trên giấy. Tiếng gầm đi qua bức rèm nước, ra bên kia chỉ còn một tiếng róc rách.'],
    [4097464935,'ink','Dòng ký tên Cam Ly','Một dòng thác biết viết chữ cuối thế nào?','Nước Cam Ly kéo nét chữ y thật dài xuống dưới dòng kẻ. Đầu nét cuộn lại thành một xoáy bọt trên tem Đà Lạt.'],
    [4369550847,'wing','Cánh nhỏ Đăk Ruồi','Một đôi cánh nhẹ đến đâu mới đậu được trên bọt?','Từ chữ Ruồi, đôi cánh giấy bay ra trên dòng Đăk Pék. Nó đậu đúng một nhịp lên hạt bọt đang rơi.'],
    [4502225092,'drop','Con dốc Datanla','Có một giọt nước đi qua mép khung nhanh hơn cả nét bút.','Vệt thác Datanla nghiêng trang giấy thành một con dốc. Giọt nước trượt qua hết dốc rồi để lại một đuôi mực dài.'],
    [4518601444,'arch','Khuy áo Lùng Khúy','Khung cửa hang nhỏ có luồn qua một lỗ khuy được không?','Cửa Lùng Khúy thu lại thành chiếc khuy áo bằng đá giấy. Một sợi chỉ từ Lùng Tám vừa đủ xuyên qua.'],
    [4628460533,'ink','Mép lụa Đồng Phúc','Dải trắng của Silk Waterfall còn một sợi chưa dệt.','Sợi nước cuối cùng luồn qua mép tem rồi nằm vào thớ lụa. Bức thác bằng giấy mềm hẳn ở chỗ ấy.'],
    [4641790394,'leaf','Chén giấy Đăk Chè','Chữ Chè mời một giọt thác vào chén nào?','Một chiếc lá gập lòng thành chén, giọt thác rơi vừa tới miệng. Chữ Chè trên tem Đăk Pék ướt mất một nét.'],
    [4642006489,'echo','Phách rơi Pa Sỹ','Dấu ngã có thể nảy trên mặt nước không?','Một hạt bọt Pa Sỹ lướt qua chữ y. Nó bật hai nhịp, thành đúng dấu ngã còn thiếu trên tem Măng Đen.'],
    [4735888634,'sail','Mảnh buồm chữ Y','Trên tấm tem Ea Pôk, ai đang xòe hai cánh tay?','Chữ Y ở Dray Yông hóa cột buồm chẻ ngọn. Dải thác giấy mắc vào một bên thành cánh buồm nhỏ.'],
    [4742627495,'drop','Giọt cuối Liên Guich','Một hạt nước kéo theo được bao nhiêu chữ?','Chữ Liên và chữ Guich in ngược trong cùng một giọt. Nó lăn tới mép tem Đinh Văn, cả tên thác trở chiều.'],
    [4753109965,'ridge','Sơn thủy trong Thiên Cảnh','Một khung hang ôm vừa bức tranh rộng cỡ nào?','Hai chữ Cảnh Sơn mở ra thành tranh núi trên tem. Khung cửa hang khép quanh tranh, chỉ chừa một đường trời mảnh.'],
    [4787075848,'wing','Bóng cánh trước Phú Cường','Một vệt cánh cắt ngang dải nước rất dài.','Cánh chim giấy lướt giữa chừng vệt thác Phú Cường. Cái bóng rơi tiếp xuống chân thác, còn cánh chim bay ra ngoài khung.'],
    [4810006123,'drop','Mây tan thành thác','Khi đám mây trên tem Vụ Bản chạm suối thì sao?','Chữ Mây kéo một góc trời xuống sát mặt giấy. Đám mây tách thành hạt, hạt rơi thành một dải thác.'],
    [4810813225,'wing','Cánh chữ Bay','Tên Yang Bay giấu một chuyển động ngay cuối dòng.','Hai nét cuối chữ Bay xòe thành cánh nước. Chúng lướt một vòng phía trên con sông giấy ở Khánh Vĩnh.'],
    [5112141922,'star','Một lát chiều Mai Châu','Chữ Chiều giữ nắng cuối ngày bằng cách nào?','Vòm Hang Chiều khép lại như mí mắt bằng giấy. Một lát sáng mỏng còn sót ở mép, vàng đến hết trang.'],
    [5239859371,'leaf','Lá thư Lơ Man','Một chiếc lá đang giữ thăng bằng ở nét cuối.','Dòng nước trên tem Lơ Man chảy qua sống lá. Hai bên phiến lá nghiêng luân phiên, đỡ giọt nước về đến Lạc Dương.'],
    [5256406207,'ink','Vuông nước Bảo Đại','Nếu chiều rộng và chiều cao của thác gặp nhau trên giấy?','Thác Bảo Đại ở Liên Nghĩa in thành một vuông nước ngay ngắn. Khép đủ bốn cạnh, cả con tem hóa ô cửa trong veo.'],
    [5265690822,'wing','Gió lật trang Ba Đồn','Một nét nước bỗng bị thổi ngược lên trên.','Tờ tem mang tên Thâc Gîo vừa chạm dòng suối đã lật mặt. Vệt nước còn in lên mặt sau như một chiếc lông nghiêng.'],
    [5613572021,'arch','Cánh cửa mực Đại Từ','Một cái tên có thể mở ra rồi khép lại?','Hai chữ Cửa Tử hé một khe mảnh trên giấy. Sợi suối luồn qua khe, để lại một tay nắm hình giọt nước.'],
    [5644088368,'ink','Nét sào qua Thoong Sào','Nét bút dài nhất chống vào đâu giữa dòng thác?','Chữ Sào thả một nét dài chống xuống đáy trang. Vệt nước Đình Phong lách qua hai bên nét bút ấy.'],
    [5801773753,'drop','Khăn nước Bobla','Dải nước cao và hẹp sẽ gấp vừa mấy lần?','Bức rèm Bobla trên tem gấp đôi dọc theo dòng rơi. Lúc mở ra, ở nếp giữa vẫn còn một hạt nước Di Linh.'],
    [5825064153,'sail','Chuyến thư Liên Khương','Phong thư Liên Nghĩa rời bờ bằng mép nào?','Góc phong bì gập lên thành mũi thuyền. Dòng Liên Khương luồn dưới đáy, chở tem đi hết một đường viền.'],
    [5832872682,'echo','Ba nhịp Măng Đen','Có ba bậc giấy, mỗi bậc giữ được một âm.','Giọt nước Thác Ba Tầng rơi lần lượt xuống ba dòng kẻ. Ba tiếng tách nằm cạnh nhau thành bản nhạc ngắn nhất sổ.'],
    [5922491535,'lantern','Đèn sau lớp giấy Tàng Chơn','Ai che ánh đèn sau hai lớp giấy mỏng?','Một ngọn đèn tí hon nằm giữa hai lớp tem Tàng Chơn. Qua cửa hang, ánh đèn hắt thành quầng sáng bằng đồng xu.'],
    [6008999548,'drop','Hạt suối Phú Hòa','Có giọt nào mang chữ Bà qua hết con suối?','Một dấu huyền tuột khỏi chữ Bà trên tem Phú Hòa. Giọt suối đỡ lấy rồi đưa về đúng chỗ nét chữ nghiêng.'],
    [6053669985,'echo','Ba tiếng Ky Sa Coon','Ba nhịp Ky, Sa, Coon rơi cách nhau thế nào?','Giọt đầu chạm kêu Ky, giọt thứ hai kêu Sa. Âm Coon tròn hơn cả, lăn một vòng quanh tem Đak Đoa.'],
    [6114438286,'ink','Vòi voi vẽ cửa hang','Nét nào trong Elephant Cave có thể tự uốn cong?','Một nét chì dài thò ra như vòi voi. Nó vẽ cửa hang lên mặt tem rồi cuộn gọn dưới chữ Elephant.'],
    [6215416985,'leaf','Lá thư Cổ Lũng','Tờ thư ở Bản Hiêu gấp bằng giấy hay bằng lá?','Dòng suối trên tem ngấm qua tờ giấy. Những đường gân hiện ra, biến lá thư Bản Hiêu thành một chiếc lá thật mỏng.'],
    [6474418794,'arch','Trang trong Trung Trang','Giữa hai chữ Trang có thêm một trang nào?','Tem Trung Trang mở một cánh cửa bằng giấy. Bên trong là trang nhỏ hơn, trên đó cửa hang lại vừa hé.'],
    [669857800,'ink','Nét phẩy H’Linh','Dấu nhỏ nào có thể tách ra khỏi một tên thác?','Dấu phẩy trên cao rơi khỏi tên H’Linh xuống sông giấy. Nó trôi một vòng rồi ngoi về giữa hai chữ.'],
    [6700271828,'drop','Mắt nước Dray Knao','Chữ nào còn chừa một khoảnh tròn ở cuối dòng?','Một giọt thác mắc vào lòng chữ o của Knao. Nhìn qua ô tròn ấy, cả dòng M’Drắk nằm vừa trong giọt.'],
    [6833063186,'shell','Tiếng nước Tà Gụ','Có chỗ nào giữ được tiếng thác khi trang sổ đã khép?','Vệt sông Tà Gụ cuộn thành vỏ ốc giấy. Trong đường xoắn còn giữ một tiếng nước vọng từ Tô Hạp.'],
    [7040229623,'star','Đốm dương Hoài Dương','Một mẩu nắng mắc trên đầu vệt suối.','Chữ Dương thả đốm nắng nhỏ xuôi theo dòng thác. Đến khung tem, nắng khô lại thành một ngôi sao.'],
    [7141872103,'lotus','Hoa nổi Thủy Tiên','Nếu một cái tên có thể nở trên mặt nước?','Hai chữ Thủy Tiên tách thành những cánh hoa bằng giấy. Một giọt thác nằm ngay giữa bông hoa đang trôi.'],
    [7182961142,'ink','Nét lửa C3','Nét cong nào viết được cả tên hang và một đường lửa?','Chữ C mở một vòng trong nét mực màu than. Chữ số ba lóe lên ở giữa như vệt lửa chưa nguội trên tem hang núi lửa.'],
    [7244060861,'wing','Thiệp mời Quy Khach','Ai gửi một tấm thiệp trống từ Sa Pa?','Tên thác Quy Khach mở mép thiệp bằng một giọt suối. Từ trong bay ra cánh giấy bé xíu, mang theo lời mời ghé lại.'],
    [7319268867,'arch','Khe ghép Đá Hàn','Hai mảnh đá giấy nối nhau bằng thứ gì?','Dòng nước len vào khe giữa hai mảnh tem rồi bắt sáng. Từ Đá Hàn, nó gửi về một đường nối mảnh như sợi bạc.'],
    [7602091586,'drop','Sợi rơi Liêng Nung','Một sợi nước dài đã chạm đáy trang chưa?','Trên tem Gia Nghĩa, dòng Liêng Nung thả một sợi chỉ trắng xuống. Đầu sợi khâu vào vòng bọt tròn ở chân thác.'],
    [7608097885,'ink','Lòng trang Suối Tráng','Cái tên nào vừa tráng một lớp sáng lên mép sổ?','Dòng Suối Tráng quét ngang lớp mực đậm. Nửa trang phản sáng, nửa còn lại giữ bóng của dòng nước Cao Phong.'],
    [7639000086,'arch','Thư đi vào hang Tôn','Ở cửa vào, phong thư phải gấp lại đến cỡ nào?','Tờ thư Ba Đồn thu hai cánh lại, lách vào khe giấy ở hang Tôn. Từ phía ngoài chỉ còn thấy mũi phong bì.'],
    [7790384785,'drop','Bàu Cạn còn một giọt','Chữ Cạn sẽ làm gì với giọt nước cuối cùng?','Dòng mực trên tem cạn dần đến tận mép Bàu Cạn. Một giọt bé xíu vẫn nép an toàn dưới chân chữ.'],
    [7790401185,'star','Giấc mơ Chư Ty','Một con thác nằm mơ thì nước sẽ rơi về đâu?','Trên tem Thác Mơ, một giọt nước rơi lên trời thành sao. Khi trang lật lại, nó trở về dòng suối Chư Ty.'],
    [7790409785,'echo','Âm tròn Xung Khoeng','Hai tiếng ấy có nảy được khỏi mặt sông?','Xung dội xuống vệt nước, Khoeng bật lên vách giấy. Cặp tiếng vang khép thành một vòng mực trên tem Chư Prông.'],
    [7843903485,'wing','Bóng cánh Bìm Bịp','Tên chim vừa nhô khỏi tên thác ở đâu?','Hai chữ Bìm Bịp hóa thành đôi cánh nghiêng trên tem. Chúng bay qua dòng Liên Sơn, để một chiếc lông giấy chạm nước.'],
    [8018640188,'ridge','Giọt nước chênh vênh','Nếu chỉ một góc tem chạm vào lòng suối?','Tờ tem Chênh Vênh đứng nghiêng trên mép đá vẽ chì. Một giọt nước giữ thăng bằng ở góc thấp nhất.'],
    [8112449399,'ink','Nét cuối Ankroet','Tên Ankroet còn một nét ngang chờ ở đâu?','Bọt ở thác nhảy ngang chữ t, bổ sung nét cuối cùng. Dòng nước Lạc Dương lại chảy xuống dưới hàng chữ.'],
    [8112455841,'star','Vàng đọng ở đáy thung','Vệt vàng trong Golden Valley chảy xuống đâu?','Dải sáng từ chữ Golden chạm nước rồi vỡ thành hạt. Một hạt vàng đọng ở nếp thung lũng trên tem.'],
    [8569184284,'leaf','Chiếc phao Edu','Một hạt bọt có cần chiếc phao không?','Lá giấy trôi ngang chân thác Edu. Một hạt bọt Khánh Vĩnh leo lên chiếc phao lá, đi hết mép sông trên tem.'],
    [8620572905,'ink','Những nét thưa Dray Sáp','Một dòng sông rất rộng giấu khoảng trắng ở đâu?','Trên tem mùa khô, những dải nước Dray Sáp đứng cách nhau như nét chải mực. Nhìn qua các khe mới thấy màu giấy bên dưới.'],
    [8620693079,'lotus','Cánh tĩnh trên Thác Phật','Giữa dòng rơi có một nếp giấy rất yên.','Một cánh sen bằng giấy đỡ hạt nước trên tem Thác Phật. Dòng sông vẫn chảy mà hạt nước ở lòng cánh chưa rơi.'],
    [9216777055,'sail','Cánh buồm Giang Điền','Một chữ Giang có đủ nước cho con thuyền bé nhất?','Nét sông mở ra dưới cánh buồm bằng tem. Thuyền trôi qua chữ Giang Điền rồi mắc vào vòng bưu dấu Long Thành.'],
    [9789872321,'wing','Đuôi chữ Yavly','Hai chữ y trong Yavly cất được thứ gì ở giữa?','Hai đuôi chữ y duỗi ra như hai cánh chuồn chuồn. Dòng nước Thạnh Mỹ nằm gọn trong khoảng giữa đôi cánh.'],
    [9811545028,'drop','Giọt mũ Dray Dlông','Hạt nước trên mũ chữ ô sẽ lăn về bên nào?','Giọt nước thăng bằng một thoáng trên chữ ô của Dlông. Nó lăn xuống, vẽ thêm một vệt thác nhỏ trên tem Quảng Phú.'],
    [991996378,'wing','Dải lụa Tiên Sa','Một góc trời vừa rơi xuống dòng nước Sa Pa?','Tờ giấy Tiên Sa thả xuống một dải lụa mỏng. Hai đầu dải lụa khẽ bay, phần giữa chạm nước thành thác.']
  ];
  Object.assign(window.sightSecretStories,Object.fromEntries(
    notes.map(([node,motif,title,clue,reveal])=>['osm-node-'+node,[motif,title,clue,reveal]])
  ),{
    'osm-way-1376476251':['drop','Viên sỏi suối Lê Nin','Dưới màu xanh của nước có gì bắt sáng?','Một viên sỏi hiện rõ giữa lòng suối. Sợi sáng trên lưng sỏi cong đi khi chiếc lá chạm nước, rồi tự nối lại.'],
    'osm-way-1372358286':['drop','Sợi nước Bản Giốc','Có thể lần riêng một sợi trong rèm thác không?','Một sợi nước ở thác phụ tách khỏi màn trắng. Tới chân gờ đá, nó uốn thành một vòng nhỏ trên con dấu Quây Sơn.'],
    'osm-way-1415191977':['ridge','Góc mái Phia Nhằm','Nét cong nào vừa chạm vào đường núi?','Một góc mái chùa nhô lên trên trang. Qua khe giữa mái và sườn Phia Nhằm ló ra vệt nước trắng của thác Bản Giốc.'],
    'osm-way-207178342':['leaf','Bóng mành bên ao','Chiếc lá nhìn qua mành tre thấy mặt ao thành mấy dải?','Một chiếc lá nép vào mành. Nắng qua từng khe, in lên lá những dòng kẻ mảnh như bóng hàng hiên trên ao cá.'],
    'osm-way-37629143':['lotus','Cánh sen của bảo tàng','Có thể gấp một cánh sen bằng bóng đổ không?','Ánh chiều kéo bóng một khối bê tông trắng qua bậc đá. Trên tờ tem, đường gấp ấy vừa khít một cánh sen.']
  });
})();

;
// sight-secret-pilgrimage.js
'use strict';
Object.assign(window.sightSecretStories,{
  'cong-trung-tam-le-hoi-den-hung':['ridge','Ba mái từ quảng trường','Hai bên tòa cổng lớn còn có những mái nào?','Lùi ra sân, ba tòa đá hiện rõ thành ba khối riêng. Tòa giữa cao hơn, mang hai tầng mái trên chiếc vòm lớn nhất.'],
  'cong-cu-den-hung':['ink','Bốn chữ trên cổng son','Ở đầu bậc núi Nghĩa Lĩnh, thử đếm những ô chữ tròn nằm phía trên vòm cổng.','Cao sơn cảnh hành được viết trong bốn ô. Dưới bức đại tự là một lối vòm, hai bên có các vị võ sĩ đứng chầu.'],
  'den-ha-nghia-linh':['leaf','Khoảng trời giữa hai mái','Hãy tìm khoảng hở giữa hai tòa thấp của đền Hạ.','Tiền bái và hậu cung đứng song song. Một dải trời hẹp lọt xuống giữa chúng, vừa đủ để bạn nhận ra hình chữ Nhị của ngôi đền.'],
  'den-trung-nghia-linh':['ink','Nhịp cửa Tổ miếu','Trên lưng núi, tòa trước của đền Trung chia mặt tiền ra mấy gian?','Ba gian mở về hướng nam. Sau mái trước còn một mái khác của hậu cung, nơi đặt ngai và bài vị thờ các vua Hùng.'],
  'den-thuong-nghia-linh':['star','Đại tự trên đỉnh núi','Qua hai trụ giữa nghi môn, hãy tìm bức đại tự có chữ “Triệu Tổ”.','Nam Việt Triệu Tổ hiện trên vòm chính. Đứng lệch ra sân, bạn còn nhìn thấy hai cửa nhỏ và các lớp điện sau nghi môn.'],
  'den-gieng-ngoc-tinh':['drop','Vành giếng Ngọc Tỉnh','Trước ban thờ hai công chúa, hãy nhìn xuống giữa vành giếng tròn.','Ánh sáng từ phía phương đình chạm vào thành giếng. Trong lòng vành đá là mặt nước gắn với chuyện Tiên Dung và Ngọc Hoa soi gương.'],
  'den-to-mau-au-co-nui-van':['lotus','Sân đền trên núi Vặn','Từ bậc cuối, hai mái nhà thấp nào đứng dọc hai bên sân?','Tả vu và hữu vu dẫn mắt về nếp chính điện. Từ giữa sân, đầu đao sáng màu hiện lên trên mái ngói sẫm của đền Tổ Mẫu.'],
  'bao-tang-hung-vuong-cong-quan':['echo','Ngôi sao trên mặt đồng','Bước vào sảnh Công Quán, ở tâm những vòng tròn trên mặt trống có hình gì?','Một ngôi sao tỏa tia từ giữa mặt đồng. Lần theo các vành khắc quanh nó, bạn gặp nhịp hoa văn Đông Sơn của vùng Đất Tổ.']
});

;
// sight-secret-co-loa.js
'use strict';
Object.assign(window.sightSecretStories,{
  'osm-way-776438252':['dragon','Vảy đá trước nghi môn','Nét cong nào theo đôi rồng lên tận bậc cuối?','Một vệt nắng chạy dọc lưng rồng đá trước đền Thượng. Lên đến bậc cuối, nó chia đôi rồi nằm lại trong hai mắt giếng của sân rồng.'],
  'osm-way-497328755':['drop','Hai vòng nước Giếng Ngọc','Vì sao một giọt nước lại có hai đường viền?','Một vòng là bờ hồ, một vòng là gờ giếng đá ong. Giữa hai vòng, con dấu giữ lại một bóng cây nghiêng.'],
  'osm-way-776437158':['leaf','Bóng hiên Ngự Triều','Chiếc lá dừng dưới hàng cột nào?','Gió đưa chiếc lá qua sân gạch Bát Tràng. Lá nằm ngay mép hiên gỗ lim, vừa chạm bóng cong của đầu mái đình.'],
  'osm-way-1556531233':['arch','Qua vòm am Bà Chúa','Trang giấy còn giữ dáng một bộ rễ bằng cách nào?','Lối gạch trên tem đi xuyên qua vòm cổng am. Một nhánh lá rủ xuống làm khung, để giữa khoảng trống vẫn nhìn thấy mái nhà ba gian.'],
  'osm-way-776437157':['echo','Tiếng chuông phía bắc','Âm nhỏ đi đâu sau khi rời gác chuông?','Tiếng chuông khẽ lướt qua hai dãy hành lang Bảo Sơn tự. Nó đọng trên nét cuối của mái ngói phía nam, vừa đủ cho một dấu chấm.']
});

;
// sight-secret-dien-bien.js
'use strict';
Object.assign(window.sightSecretStories,{
  'tuong-dai-chien-thang-dien-bien-phu':['leaf','Bó hoa trên đỉnh D1','Giữa lá cờ đồng và ba người lính, bàn tay nhỏ nào đang nâng bó hoa?','Nét bút men theo cánh tay người lính rồi chuyển sang bàn tay của em bé Thái. Trên nền trời Mường Thanh, bó hoa nhỏ vừa chạm đến mép lá cờ.'],
  'san-hanh-le-doi-d1':['ridge','Hai hàng đá lên đồi','Từ sân hành lễ, nhìn theo hai hàng cột mốc. Chúng đi tiếp ra sao ở những đoạn bậc bằng?','Hai hàng cột nhỏ dừng nhịp bên chiếu nghỉ rồi nối nhau lên cao. Trang sổ còn ở chân đồi mà đầu bút đã tìm thấy tượng đồng ở cuối trục bậc.'],
  'nghia-trang-liet-si-a1':['star','Ánh sáng qua cánh tường','Ở nhà tưởng niệm hình chữ A, ánh sáng lọt qua những hình gì?','Người ghi sổ vẽ một ngôi sao nhỏ rồi để trống lòng sao. Quanh nó là những ô sáng trên hai cánh tường, mỗi ô gìn giữ ký ức về một người đang yên nghỉ ở nghĩa trang A1.']
});

;
// sight-secret-ba-be.js
'use strict';
Object.assign(window.sightSecretStories,{
  'ho-ba-be-song-nang':['sail','Nét sông dưới núi','Từ lòng hồ theo sông Năng, ở đâu con thuyền có thể đi khuất dưới một ngọn núi?','Dòng sông xuyên núi đá vôi Lũng Nham qua động Puông. Ở chỗ khác trên hành trình, giữa nền nước rộng của Ba Bể, những hòn đảo nhỏ lại nổi lên.'],
  'dao-ba-goa-ba-be':['leaf','Đuôi đảo trên mặt hồ','Nhìn Pò Giả Mải từ mặt nước, tán cây dày hơn ở đầu nào?','Đầu tây bắc giữ một cụm tán cao. Về phía đông nam, dải đá thu hẹp và những tán thấp dần về mép nước.'],
  'den-an-ma-ba-be':['lantern','Mái hiên trên đảo','Đền An Mạ nằm trên bờ hay trên một hòn đảo?','An Mạ là một hòn đảo giữa hồ Ba Bể. Qua những tán cây, mái ngói thấp và hàng cột gỗ hiện ra trước sân đền.'],
  'osm-node-1888768316':['echo','Khúc sông có mái','Ở động Puông, điều gì tiếp tục đi qua cửa hang cùng con thuyền?','Sông Năng vẫn chảy dưới vòm núi. Âm thanh mái chèo dội lại trên đá khi ánh sáng cửa hang lùi dần về phía sau.'],
  'osm-node-4755846850':['drop','Những dải nước tách đôi','Dòng nước ở Đầu Đẳng làm gì khi gặp một khối đá nhô lên giữa dòng?','Nước rẽ thành hai nhánh rồi lại nhập vào nhau. Một vệt bọt trắng trôi theo ra khỏi bãi đá.'],
  'osm-node-4879886024':['ridge','Từ cửa hẹp tới vòm cao','Phía trong cửa động Hua Mạ, khoảng trống đổi hình thế nào?','Sau các bậc lên núi là một cửa đá hẹp. Đi sâu thêm, lòng động nở ra và những tấm rèm nhũ kéo dài từ trên cao.']
});

;
// sight-secret-ha-long-islets.js
'use strict';
Object.assign(window.sightSecretStories,{
  'osm-node-3887715188':['shell','Từ bãi cát sang cửa nhìn vịnh','Trần các ngăn gần ngang nhau. Vì sao lối giữa hang Trinh Nữ vẫn hẹp lại?','Đá vôi kết tủa thành măng đá, nâng nền ở đoạn giữa. Qua đoạn thắt, lòng hang mở sang ngăn nhận ánh sáng từ phía bên kia bán đảo.'],
  'hang-trong-bo-hon':['echo','Hai cửa lưu dấu hai môi trường','Ở hai cửa hang Trống, người ta tìm thấy những vỏ nhuyễn thể nào?','Cửa tây bắc giữ các lớp vỏ ốc nước ngọt và ốc núi. Gần cửa đông nam, những mảnh vỏ hàu và hà biển kết lại trên nền đá vôi.']
});

;
// sight-secret-cai-beo.js
'use strict';
Object.assign(window.sightSecretStories,{
  'lang-chai-cai-beo':['sail','Đi giữa các ô cá','Trên bè, người nuôi đi từ ô lồng này sang ô kế bên bằng cách nào?','Những thanh ván hẹp bắc dọc và ngang trên phao. Giữa các lối ván, mặt nước để hở cho người nuôi theo dõi cá trong lồng.']
});

;
// sight-secret-ben-beo.js
'use strict';
Object.assign(window.sightSecretStories,{
  'ben-tau-cai-beo':['sail','Nét gấp ở cầu tàu','Vì sao đường viền mặt bến đang thẳng lại gấp vào?','Ở cuối phố Cái Bèo, mép cầu tàu gấp vào rồi nhô ra một lần nữa. Mặt nước lọt giữa hai phần bến, để mạn tàu có chỗ áp sát.']
});

;
// sight-secret-ben-hoa-thach-han.js
'use strict';
Object.assign(window.sightSecretStories,{
  'ben-tha-hoa-bo-nam-thach-han':['sail','Bậc đá xuống sông Thạch Hãn','Ở bờ Nam, mái ngói nhỏ giữa bến che cho lối nào?','Mái nhỏ che lối xuống giữa hai dải bậc đá. Người dân theo các bậc này tới mép sông để thả hoa tưởng niệm.'],
  'tuong-dai-bo-bac-thach-han':['arch','Tám cạnh trước đền An Đôn','Từ sân dưới của đền, lối hẹp dẫn ra một bến đá có mấy cạnh?','Bến có tám cạnh. Các bậc xếp quanh tấm bia và thấp dần đến mặt nước.']
});

;
// sight-secret-huong-tich.js
'use strict';
Object.assign(window.sightSecretStories,{
  'dong-huong-tich-huong-son':['ridge','Nếp nhũ trên Đụn Gạo','Ở cửa động Hương Tích, Đụn Gạo trông thế nào?','Đụn Gạo bằng đá. Những nếp nhũ rủ xuống thành diềm trên phần chân xòe rộng. Ngước lên từ bàn thờ nhỏ, bạn thấy khối đá thu dần về phía ngọn.']
});

;
// sight-secret-thien-tru.js
'use strict';
Object.assign(window.sightSecretStories,{
  'chua-thien-tru-huong-son':['ridge','Hoành phi giữa hai tầng mái','Từ bậc đá trước Tam Bảo, hãy tìm bốn chữ nằm giữa hai hàng chấn song. Hoành phi đặt ở tầng nào?','Tấm hoành phi Hương Thiên Bảo Sát nằm ở mặt trước tầng mái trên. Đứng dưới sân nhìn lên, lư hương trên tòa sen nằm cùng trục với tấm biển.']
});

;
// sight-secret-giai-oan-huong-son.js
'use strict';
Object.assign(window.sightSecretStories,{
  'chua-giai-oan-huong-son':['ink','Bốn chữ trên sân chùa','Từ sân gạch nhìn lên, bốn chữ nào nằm phía trên cửa giữa?','Giải Oan Khê Tự. Bốn chữ đọc từ phải sang trái trên nền vàng, cao hơn hàng mái chạy qua ba cửa vòm.']
});

;
// sight-secret-ben-yen.js
'use strict';
Object.assign(window.sightSecretStories,{
  'ben-yen-chua-huong':['sail','Mũi đò bên suối Yến','Nhìn từ trên xuống bến, đầu nào của những chiếc đò quay vào bờ?','Những mũi đò hướng vào bờ thành từng dãy. Ghế ngang và mái chèo nằm trong lòng đò, còn giữa dòng là luồng cho những chuyến đò rời bến.']
});

;
// sight-secret-ngu-nhac.js
'use strict';
Object.assign(window.sightSecretStories,{
  'den-trinh-ngu-nhac-huong-son':['ink','Ba tòa bên suối Yến','Từ sân đò nhìn vào trong, ba tòa của đền Ngũ Nhạc có mấy tầng mái?',
    'Tòa ngoài có một tầng mái, tòa giữa có hai tầng với hàng chấn song đón sáng. Tòa trong cùng có mặt bằng vuông và ba tầng mái, mỗi tầng bốn mái.']
});

;
// sight-secret-huynh-thuy-le.js
'use strict';
Object.assign(window.sightSecretStories,{
  'nha-co-huynh-thuy-le':['arch','Qua năm vòm nhìn vào gian giữa','Trên mặt tiền nhà cổ, hai vòm nhỏ nằm ở đâu so với ba vòm lớn?','Mỗi vòm nhỏ nằm giữa cửa vòm lớn ở chính giữa và một vòm lớn ở bên. Bước qua cửa giữa, nhìn thẳng vào nhà sẽ thấy gian thờ Quan Công.']
});

;
// sight-secret-go-thap.js
'use strict';
Object.assign(window.sightSecretStories,{
  'vishnu-go-thap-muoi':['ridge','Từ lan can nhìn xuống gò','Dưới mái tôn, những hàng gạch cổ nằm ở cao độ nào so với lối đi của khách?','Các hàng gạch nằm thấp hơn lối quan sát có lan can. Đứng ở góc thụt vào của lối đi, có thể nhìn xuống những mảng nền vỡ và vị trí phát hiện hai tượng Vishnu.']
});

;
// sight-secret-hon-yen.js
'use strict';
Object.assign(window.sightSecretStories,{
  'hon-yen-phu-yen':['ridge','Hai dáng đảo ngoài Nhơn Hội','Từ bờ Nhơn Hội, làm sao nhận ra Hòn Đụn giữa hai hòn đá ngoài biển?',
    'Hòn Đụn nằm gần bờ hơn. Dải cây thấp trên đỉnh nghiêng dần về phía đất liền rồi kết thúc đột ngột ở mép đá hướng biển. Xa hơn là khối Hòn Yến cao khoảng 70 m.']
});

;
// sight-secret-dam-o-loan.js
'use strict';
Object.assign(window.sightSecretStories,{
  'dam-o-loan-tuy-an':['sail','Hai cánh đá nhìn ra đầm','Hãy tìm hình dáng ở bên dưới hai cánh đá ôm bảng tên Ô Loan.','Bảng tên đứng trên bệ dáng chiếc thuyền có hai đầu vểnh lên. Từ bia nhìn về phía đông là vùng nước lợ và các ô nuôi dọc bờ tây.']
});

;
// sight-secret-bai-mon.js
'use strict';
Object.assign(window.sightSecretStories,{
  'bai-mon-mui-dien':['drop','Con suối bên ghềnh','Con suối nước ngọt tìm đường ra biển ở phía nào của Bãi Môn?','Men chân núi phía nam, con suối uốn một vòng qua cát rồi đổ ra biển ngay bên ghềnh đá.']
});

;
// sight-secret-hon-nua.js
'use strict';
Object.assign(window.sightSecretStories,{
  'hon-nua-phu-yen':['sail','Bờ cát khuất sau ghềnh đá','Từ mặt nước phía tây Hòn Nưa, chi tiết nào giúp nhận ra bãi thuyền thường ghé?',
    'Bờ cát sáng uốn thành một vòng cung dưới chân hai ngọn đồi. Đi dọc bãi về phía nam, cát dần nhường chỗ cho những khối đá nứt tảng và doi đá dài vươn ra biển.']
});

;
// sight-secret-ben-bai-huong.js
'use strict';
Object.assign(window.sightSecretStories,{
  'ben-bai-huong-vung-ro':['sail','Khúc gấp ngoài vịnh','Vì sao hai ảnh chụp cùng một lối ra bè lại có khúc gấp khác nhau?','Hai ảnh vệ tinh năm 2023 và 2025 cho thấy cầu dẫn bắt đầu ở cùng một đoạn bờ Bãi Hương. Ở ngoài nước, sàn bè đổi chỗ neo nên phần cầu gần bè cũng đổi hướng.']
});

;
// sight-secret-luong-van-chanh.js
'use strict';
Object.assign(window.sightSecretStories,{
  'den-tho-luong-van-chanh':['leaf','Ba lối qua gốc bồ đề','Nhìn qua những khoảng trống dưới gốc bồ đề trước chính điện, bạn đang nhìn qua dấu tích nào?',
    'Đó là ba cửa của ngôi miếu xưa. Rễ bồ đề mọc ôm lấy phần tường còn lại. Năm 2014, cây được công nhận là Cây Di sản Việt Nam.']
});

;
// sight-secret-tuong-niem-nui-nhan.js
'use strict';
Object.assign(window.sightSecretStories,{
  'dai-tuong-niem-nui-nhan':['wing','Cánh nhạn trên mặt đứng','Đứng ở sân, vì sao vẫn nhìn được hình đàn nhạn mà không cần lên cao?','Kiến trúc sư Lê Hiệp đưa hình cánh nhạn từ mặt bằng của phương án cũ lên mặt đứng. Nhìn chéo từ sân sẽ thấy khoảng trời giữa những cánh bê tông xếp nối nhau.']
});

;
// sight-secret-bao-tang-phu-yen.js
'use strict';
Object.assign(window.sightSecretStories,{
  'bao-tang-phu-yen':['arch','Dáng trống ở cửa bảo tàng','Vì sao viền đồng hai bên cửa sảnh thắt lại ở giữa rồi mở rộng?','Kiến trúc sư dùng hình âm bản của trống đồng cho lối vào. Ngước lên từ sân còn thấy các dải trắng xòe hai bên mặt đứng lấy ý từ chiếc mũ vua Hùng.']
});

;
// sight-secret-thac-cay-du.js
'use strict';
Object.assign(window.sightSecretStories,{
  'thac-cay-du':['drop','Hai dòng nước tháng sáu','Vì sao có thể lần theo dòng thác ngay cả trên những đoạn vách chỉ còn rất ít nước?',
    'Trong ảnh tháng sáu, hai dòng hẹp để lại những rãnh sẫm màu giữa đá xám và đá vàng hồng. Qua mỗi gờ nhô ra, nước lại nhảy xuống một bậc trước khi tụ vào vũng ở chân thác.']
});

;
// sight-secret-vinh-xuan-dai.js
'use strict';
Object.assign(window.sightSecretStories,{
  'vinh-xuan-dai':['sail','Vòng thúng trên bãi Vũng Sứ','Những chiếc thuyền nhỏ nào có miệng tròn như một chiếc rổ?','Trên bãi Dân Phú 2, người đi biển kéo thúng tròn lên cát. Những chiếc còn neo dưới nước in thành từng vòng xanh sát bờ.']
});

;
// sight-secret-mui-rang-dong.js
'use strict';
Object.assign(window.sightSecretStories,{
  'bia-mom-rang-dong':['star','Vầng mặt trời trên bia đá','Đứng từ sân chào cờ và tìm hình nổi lên ở giữa hai mép bia cong.','Một đĩa đá tròn màu nâu đỏ nhô lên như mặt trời. Đứng ở chòi mái xanh bên sân, bạn có thể nhìn qua bia ra biển.']
});

;
// sight-secret-nui-da-bia.js
'use strict';
Object.assign(window.sightSecretStories,{
  'nui-da-bia-deo-ca':['ridge','Tảng đá trên chóp','Hãy nhìn đường viền trên cùng của phiến Đá Bia từ mặt nam. Phần nào tách khỏi vách cao?','Một tảng đá nhỏ nằm chồng lên chóp của phiến granit cao khoảng 76 m. Khe tách giữa hai khối hiện rõ khi nhìn từ sườn nam.']
});

;
// sight-secret-dam-cu-mong.js
'use strict';
Object.assign(window.sightSecretStories,{
  'long-be-bac-dam-cu-mong':['sail','Lối thuyền giữa các bè','Giữa những dãy ô lồng, dải nào cho thuyền đi qua?','Mỗi cụm có các lối hẹp chạy giữa ô lồng. Khoảng nước rộng giữa hai cụm dành chỗ cho thuyền di chuyển.']
});

;
// sight-secret-ho-dambri.js
'use strict';
Object.assign(window.sightSecretStories,{
  'bo-ho-du-lich-dambri':['sail','Những đôi cánh sơn màu','Điều gì khiến chiếc thuyền hai chỗ ở bến hồ Đambri trông như một con thiên nga?',
    'Ở mũi thuyền, chiếc cổ trắng uốn cao và kết thúc bằng mỏ vàng. Hai cánh sơn màu nằm dọc hai bên khoang, nơi hai người ngồi đạp thuyền.']
});

;
// sight-secret-nha-vung-ro.js
'use strict';
Object.assign(window.sightSecretStories,{
  'nha-trung-bay-ben-vung-ro':['lantern','Hàng hiên ở Bãi Chùa','Trên hồi mái vàng của nhà trưng bày có hai hàng chữ gì?','Hai hàng chữ đỏ ghi “Nhà trưng bày” và “Di tích lịch sử Vũng Rô”. Bên dưới là hiên sáu cột vuông và ba lối cửa kính.'],
  'nha-tuong-niem-ben-vung-ro':['leaf','Hai mái ngói bên vịnh','Từ sân gạch bên bờ vịnh, phải qua bao nhiêu bậc đá để lên cửa thờ?','Ba bậc đá dẫn lên thềm. Hai bên là trụ có linh vật đá, phía trên cửa là hai tầng mái ngói cong.']
});

;
// sight-secret-chua-buu-minh.js
'use strict';
Object.assign(window.sightSecretStories,{
  'chua-buu-minh-bien-ho':['ridge','Ngọn tháp sau đòn dông','Phía sau mái chánh điện màu sẫm là một ngọn tháp vuông. Có mấy tầng mái đỏ uốn cong?','Ba tầng mái đỏ. Chánh điện có một đòn dông và hai mặt mái dốc. Ngọn tháp phía sau vươn lên 47,25 m tính từ nền đất đến đỉnh.']
});

;
// sight-secret-thac-dambri.js
'use strict';
Object.assign(window.sightSecretStories,{
  'thac-dambri':['drop','Hai bậc nước Đambri','Từ chiếc cầu nhỏ ở hạ lưu, có thể nhìn thấy dòng nước đổi dáng ở đâu?',
    'Qua gờ đá cao, nước rơi thành màn gần thẳng đứng. Tới chân vách, dòng nước dội lên rồi tỏa ra thành một bậc tràn thấp trước khi chảy qua cầu.']
});

;
// sight-secret-vung-ro.js
'use strict';
Object.assign(window.sightSecretStories,{
  'tuong-dai-ben-tau-khong-so-vung-ro':['sail','Bánh lái giữa hai vệt lửa','Đứng giữa sân Bãi Chùa, phía trên hai mỏ neo nhìn thấy biểu tượng gì?','Một bánh lái màu vàng nằm giữa hai vệt lửa hồng. Từ chân bậc bên sườn có thể nhìn thấy cả bệ đá đỏ phía sau mũi tàu.']
});

;
// sight-secret-bien-ho-che.js
'use strict';
Object.assign(window.sightSecretStories,{
  'hang-thong-bien-ho-che':['lotus','Những luống chè bên hàng thông','Đứng ở đầu luống nhìn qua ô chè, các rãnh chạy theo hướng nào so với đường thông?','Các rãnh chạy gần vuông góc với đường, hướng về phía đông nam. Người trồng chừa lối đất giữa những dải chè xanh cắt thấp.']
});

;
// sight-secret-bo-dong-nam-ho-lak.js
'use strict';
Object.assign(window.sightSecretStories,{
  'bo-dong-nam-ho-lak':['sail','Mặt cầu ở bờ đông nam','Từ khoảng sân của Lắk Resort, cây cầu tàu ngắn vươn ra hồ theo hướng nào?',
    'Từ gốc ở bờ tới mút ngoài nước là gần 12 m theo hướng nam tây nam, khoảng 203° trên la bàn.']
});

;
// sight-secret-nha-day-buon-ma-thuot.js
'use strict';
Object.assign(window.sightSecretStories,{
  'nha-day-buon-ma-thuot':['leaf','Hai hàng cây giữa sân','Từ cổng vòm phía nam, hàng cây xén dẫn đến đâu?','Lối dạo gặp đường ngang ở giữa sân. Qua ngã tư, hàng cây dẫn thẳng đến cửa vòm của dãy lao phía bắc.']
});

;
// sight-secret-dinh-lac-giao.js
'use strict';
Object.assign(window.sightSecretStories,{
  'dinh-lac-giao-buon-ma-thuot':['arch','Đôi hạc trong sân đình Lạc Giao','Dưới chân mỗi con hạc đứng hai bên lư hương là con vật gì?','Mỗi con hạc đứng trên một con rùa. Từ chính điện nhìn ra, sau đôi hạc là bình phong đá đục chữ thọ, rồi đến bốn trụ cổng bên đường Điện Biên Phủ.']
});

;
// sight-secret-bien-ho-pleiku.js
'use strict';
Object.assign(window.sightSecretStories,{
  'mui-ngam-bien-ho-pleiku':['lotus','Đài sen trên mũi Đầu Rùa','Bên dưới tòa sen là bệ đá có bao nhiêu mặt?','Tám mặt đá đỡ đài sen và tượng Quán Thế Âm. Từ bậc cuối, nhìn qua lan can thấy mặt hồ ôm hai bên mũi đất.']
});

;
// sight-secret-ben-thuyen-buon-jun.js
'use strict';
Object.assign(window.sightSecretStories,{
  'ben-thuyen-buon-jun':['sail','Lòng thuyền bằng gỗ sao','Nhìn dọc lòng chiếc thuyền ở bến buôn Jun, đáy và hai mạn được làm từ gì?',
    'Cả ba liền một thân gỗ sao. Người thợ khoét rỗng lòng thân cây rồi đẽo hai đầu thuôn và nhấc lên khỏi mặt nước.']
});

;
// sight-secret-biet-dien-ho-lak.js
'use strict';
Object.assign(window.sightSecretStories,{
  'biet-dien-bao-dai-ho-lak':['ridge','Đôi thang gỗ bên hồ Lắk','Giữa sân đá và sảnh biệt điện có hai thang gỗ hẹp. Chúng khác lối lên còn lại ở điểm nào?','Hai thang gỗ đục bậc hướng thẳng ra sân. Cầu thang bê tông có tay vịn chạy ngang theo mặt nhà để lên cùng sảnh tầng hai.']
});

;
// sight-secret-lang-sen.js
'use strict';
Object.assign(window.sightSecretStories,{
  'kenh-tram-lang-sen':['leaf','Mương vòng bên khu trạm','Qua cây cầu hẹp, đoạn nước nào ôm lấy vạt cỏ?','Dòng nước trước cầu nối với ba đoạn mương chạy men bờ bao. Nhìn từ trên cao có thể lần theo chúng qua cả ba cạnh của khu trạm.']
});

;
// sight-secret-lang-mo-truong-dinh.js
'use strict';
Object.assign(window.sightSecretStories,{
  'lang-mo-truong-dinh-go-cong':['arch','Hai tấm bia trong vòng thành đá','Phần mộ nằm giữa hai kiến trúc nhỏ có mái. Bia ở cuối mộ khắc hai chữ nào?','“Trung Nghĩa”. Bia ở đầu kia ghi tên và tước của Trương Định. Phía sau khu mộ là ngôi đền được dựng năm 1973.']
});

;
// sight-secret-nam-phuong-linh-tu.js
'use strict';
Object.assign(window.sightSecretStories,{
  'nam-phuong-linh-tu':['ridge','Mái hạ trên hàng hiên','Nhìn từ hiên lên, vì sao thấy hai đường mái ngói?','Mái trên che các gian thờ. Mái hạ thấp hơn, chạy ra hàng cột ngoài để che hiên đi quanh chính điện.']
});

;
// sight-secret-doc-phu-hai.js
'use strict';
Object.assign(window.sightSecretStories,{
  'nha-doc-phu-hai-go-cong':['arch','Ba nhịp trên tiền sảnh','Từ sân trước nhìn lên, đỉnh sảnh giữa khác gì hai đầu mặt tiền?',
    'Sảnh giữa nhô ra dưới một trán cong có phù điêu hoa lá. Hai đầu mặt tiền lại có trán tam giác trên cửa chớp gỗ. Giữa ba phần là những nhịp vòm và hàng con tiện trắng.']
});

;
// sight-secret-lang-hoa-sa-dec.js
'use strict';
Object.assign(window.sightSecretStories,{
  'lang-hoa-sa-dec':['lotus','Chỗ trống trên giàn hoa','Nhìn vào chỗ chưa đặt chậu ở cuối luống. Điều gì giữ các chậu cao hơn mặt nước?','Các thanh giàn nằm song song trên đà ngang. Những hàng cọc đỡ cả giàn, chừa khoảng trống giữa đáy chậu và mương nước.']
});

;
// sight-secret-nguyen-sinh-sac.js
'use strict';
Object.assign(window.sightSecretStories,{
  'mo-cu-pho-bang-nguyen-sinh-sac':['lotus','Chín đầu rồng dưới cánh sen','Từ bậc mộ, nhìn theo chín đầu rồng sẽ thấy gì?','Chín đầu rồng ở mép vòm hướng ra hồ hình ngôi sao năm cánh. Một búp sen đá cao 6,5 m vươn lên giữa mặt hồ.']
});

;
// sight-secret-vuon-chim-bac-lieu.js
'use strict';
Object.assign(window.sightSecretStories,{
  'vuon-chim-bac-lieu':['leaf','Khoảng nước giữa tán rừng','Nhìn về phía nam từ lối qua nhà trưng bày, rừng mở ra ở đâu?','Qua khung đài và mái nhà đa giác là những khoảng nước xen giữa bụi chà là và tán cây lá rộng. Chim nước bay qua bìa rừng khi trở về vườn.']
});

;
// sight-secret-dinh-trung-go-cong.js
'use strict';
Object.assign(window.sightSecretStories,{
  'dinh-trung-go-cong':['arch','Ô song chữ thọ ở đình Trung','Giữa hai ô cửa hoa của mặt võ ca có hình gì lặp lại trên cửa song?','Chữ thọ nằm trong khung tròn bằng những nan gỗ sơn đỏ. Các cửa hướng ra phố Phan Chu Trinh, phía chợ Gò Công.']
});

;
// sight-secret-u-minh-ha.js
'use strict';
Object.assign(window.sightSecretStories,{
  'vuon-quoc-gia-u-minh-ha':['leaf','Ngã tư giữa rừng tràm','Từ sàn đài, hai dải xanh thẳng gặp nhau ở đâu?','Ngay phía nam đài, một con kênh cắt ngang dòng kênh chạy dọc rừng. Những mảng thực vật nổi xen mặt nước, kéo thành hai vệt xanh giữa những tán tràm.']
});

;
// sight-secret-pu-luong.js
'use strict';
Object.assign(window.sightSecretStories,{
  'guong-nuoc-suoi-cham':['drop','Ống tre đưa nước lên ruộng','Nước rời bánh guồng ở đâu?','Những ống tre nghiêng gần vành bánh múc nước trong mương. Lên đến đỉnh, ống nghiêng miệng, đổ nước vào chiếc máng đặt cao bên ruộng.']
});

;
// sight-secret-mac-cuu.js
'use strict';
Object.assign(window.sightSecretStories,{
  'den-tho-ho-mac-ha-tien':['arch','Qua nhà Võ Ca','Đi qua nhà Võ Ca, nhìn về phía chánh điện. Biển Trung Nghĩa Từ treo trên lối nào?','Biển Trung Nghĩa Từ treo trên cửa giữa có mái ngói. Hai lối bên mở qua tường xây, còn cổng ngoài trên đường Mạc Cửu đề tên Mạc Công Miếu.']
});

;
// sight-secret-thach-dong.js
'use strict';
Object.assign(window.sightSecretStories,{
  'thach-dong-ha-tien':['ridge','Cánh cửa trong tháp đá','Dưới khe đá thẳng đứng, ba chữ vàng ở đâu?','Cuối lối bậc, ngay trên vòm cổng ốp đá xám là hoành phi Tiên Sơn động. Qua ngưỡng cửa là lòng tháp đá vôi, nơi có chùa Tiên Sơn.']
});

;
// sight-secret-phu-dung.js
'use strict';
Object.assign(window.sightSecretStories,{
  'chua-phu-dung-ha-tien':['lantern','Những chiếc nón dưới giàn hiên','Trong góc dựng theo ảnh năm 2022, bên dưới mỗi chóp nón lá trước hiên điện mới có bộ phận gì?','Dưới chóp nón là thân đèn nhỏ đan bằng nan. Những hàng đèn lồng chạy hết chiều ngang hiên gỗ, trong khi tượng Quan Thế Âm trắng đứng ở sân chánh điện cũ bên cạnh.']
});

;
// sight-secret-cuc-phuong.js
'use strict';
// Động Người Xưa and Động Sơn Cung already have their individual field notes.
Object.assign(window.sightSecretStories,{
  'osm-way-481782794':['ink','Tán rừng trên mái sảnh','Một mảng rừng có thể nằm vừa trong một hình tam giác?','Dưới mái xám, những vòm lá trên mặt hồi xanh nối nhau thành đường viền. Chà nhẹ trang giấy, bóng cây còn nguyên trên dấu mực.'],
  'osm-way-201095352':['drop','Mái ngói đôi trên hồ Mạc','Căn nhà sàn có chiếc mái thứ hai ở đâu?','Một mái ngói ở trên hàng cột, mái kia lặng dưới mặt hồ. Gợn nước chạy tới, chiếc mái phía dưới khẽ rung.'],
  'osm-node-10768945036':['leaf','Nếp gấp của bạnh sấu','Chiếc lá lọt vào ngách nào ở gốc cây?','Giữa hai bạnh rễ dựng như vách, chiếc lá sấu rơi nằm nghiêng. Một nét gấp trên trang giữ lại cả gân lá và đường rễ.'],
  'osm-node-1995508761':['arch','Cửa sổ trên thân chò','Ánh sáng đi xuyên qua thân cây bằng lối nào?','Ở chạc gãy trên cao, lòng cây rỗng thành một ô cửa sẫm. Một vệt trời qua đó in lên trang giấy, hai bên là hai thân chò.'],
  'osm-node-5294733035':['ridge','Nếp núi Mây Bạc','Dải núi nào nhạt dần ở mép trang?','Từ mỏm đá, những sườn cây xanh xếp sau nhau. Nét in cuối cùng pha màu trời rồi biến mất bên mép dấu.']
});

;
// sight-secret-cat-tien.js
'use strict';
Object.assign(window.sightSecretStories,{
  'rung-va-bau-cat-tien':['leaf','Từ ghềnh đến bàu','Đi qua cây tung trên đường rừng, mặt nước nào mở ra ở cuối tuyến?','Bàu Sấu nằm sau đoạn đi bộ xuyên rừng. Đài ven bàu cho phép nhìn qua cỏ ngập nước đến bờ cây phía xa.'],
  'ghenh-ben-cu-cat-tien':['drop','Màu đá bên sông','Giữa những khe nước ở Bến Cự, mặt ghềnh hiện ra màu gì?','Những phiến đá bazan sẫm lộ ra dọc sông Đồng Nai. Nước luồn qua từng khe hẹp giữa các phiến.'],
  'cay-go-bac-dong':['leaf','Dưới tán gõ','Đứng bên đường mòn, nhìn từ chân cây lên sẽ thấy thân gõ thay đổi thế nào?','Thân gỗ lớn vươn lên rồi chia thành các cành đỡ tán. Cây gõ đỏ này mang tên Bác Đồng.'],
  'cay-tung-duong-bau-sau':['leaf','Bức vách ở chân cây','Đi dọc gốc tung trên lối vào Bàu Sấu, bộ phận nào vươn cao như một bức vách?','Các bạnh rễ dựng đứng sát thân rồi thấp dần khi tỏa ra trên nền rừng. Phía trên, thân sáng màu vươn tới tầng tán cao.'],
  'dai-quan-sat-bau-sau':['sail','Qua tầng cỏ nước','Đài quan sát Bàu Sấu nâng sàn lên cao để nhìn qua đâu?','Nhìn qua những vạt cỏ nước, mặt bàu rộng dần tới đường viền của rừng. Mái đài và lan can tạo khoảng nghỉ ở cuối lối bộ.'],
});

;
// sight-secret-bach-ma.js
'use strict';
Object.assign(window.sightSecretStories,{
  'hai-vong-dai-bach-ma':['ridge','Đôi ngựa trước lầu','Qua giữa hai tượng ngựa trắng ở Hải Vọng Đài, bạn thấy hai tầng lầu có cùng hình gì?','Cả hai tầng đều có tám cạnh. Tầng trên thu nhỏ vào giữa mái, còn bên dưới là những ô cửa vòm nhìn ra các sườn Bạch Mã.'],
  'ngu-ho-bach-ma':['drop','Một hồ, hai dòng thác','Ở hồ thứ tư, vì sao có thể nhìn thấy hai luồng nước đổ về cùng một lòng hồ?','Các tảng đá chia dòng suối. Một nhánh trượt theo máng nghiêng, nhánh kia đập vào đá trước khi cả hai cùng chảy vào hồ.'],
  'thac-do-quyen-bach-ma':['leaf','Vệt trắng trên vách núi','Đứng bên mép thác Đỗ Quyên rồi nhìn lại từ phía dưới, dòng suối hiện ra thế nào?','Ngay mép thác, nước trượt trên đá. Từ phía sườn nam nhìn ngược lên, dòng thác thành một dải trắng dài giữa hai bờ rừng.']
});

;
// sight-secret-my-son.js
'use strict';
Object.assign(window.sightSecretStories,{
  'my-son-nhom-a':['arch','Hai cửa của A1','Nhìn dọc nền A1, khách đi qua điện theo hướng nào?','Hai cửa đối diện mở về phía đông và phía tây. Sáu điện nhỏ nằm sát hai sườn của điện chính.'],
  'my-son-nhom-b':['ridge','Mái yên ngựa B5','Hai đầu mái B5 thay đổi độ cao thế nào so với đoạn giữa?','Hai đầu mái nhô cao. Nhìn từ cửa phía bắc, dải mái dài gợi dáng yên ngựa.'],
  'my-son-nhom-c':['arch','Hai khối mái C1','Theo cửa phía đông vào C1, bạn gặp gian nào trước?','Tiền sảnh nằm trước gian thờ. Cả hai khối gạch đều có bộ mái thuôn dài và những hàng trụ ốp.'],
  'my-son-nhom-d':['echo','Hai đầu nhà dài','Hai cửa của nhà dài D1 nằm ở mặt bên hay đầu hồi?','Mỗi đầu hồi có một cửa. Dọc mặt bên có những cửa sổ hẹp lắp con tiện đá, đưa ánh sáng vào lòng nhà.'],
  'my-son-nhom-e':['arch','Cửa bắc E7','Nếu mái E7 kéo dài từ đông sang tây, lối chính vào tháp nằm ở đâu?','Cửa mở ở phía bắc. Hai đầu hồi của tháp kho đỡ bộ mái cong trên khối thân xây gạch.'],
  'my-son-nhom-f':['ridge','Hai lớp thời gian F1','Mái nhà che trên F1 thuộc giai đoạn nào của ngôi đền?','Mái kim loại và các thanh đỡ là thiết bị bảo tồn hiện đại. Phía dưới còn các mảng gạch cổ với bề mặt đã mòn.'],
  'my-son-nhom-g':['arch','Cổng dưới chân điện G1','Từ điện G1, nhìn theo cửa chính sẽ gặp công trình nào trước?','Cổng G2 nằm ngay phía tây, tiếp đó là nhà dài G3. Trên đồi, các nền còn lại giúp lần theo trục hành lễ.'],
  'my-son-nhom-h':['ridge','Một mảng tường trên nền H1','Từ sân nhóm H, điều gì khiến vị trí điện H1 dễ nhận ra?','Ở một đầu nền H1 vẫn có mảng tường gạch cao. Gần đó, những bậc thấp đánh dấu lối vào H2 và H4.'],
  'my-son-thap-cong-k':['arch','Giữa hai vách cổng','Qua bậc giữa hai vách gạch của K, dấu tích nào còn chỉ lối đi tiếp?','Hai đoạn tường thấp chạy song song. Các cuộc khai quật ở phía đông cổng giúp xác định lại đường dẫn vào khu đền.'],
  'bao-tang-my-son':['echo','Ánh sáng trên tường gạch','Bảo tàng lấy sáng tự nhiên ở đâu trên hai khối phòng dài?','Những dải lấy sáng được đặt trên mái. Phía sân, tấm màn gạch rỗng để ánh sáng lọt qua những khe hẹp.']
});

;
// sight-secret-xu-doai.js
'use strict';
Object.assign(window.sightSecretStories,{
  'chua-thay-sai-son':['ridge','Qua cầu sang đảo','Từ sân Thiên Phúc tự, cây cầu có mái nào dẫn ra một ngôi đền nhỏ trên gò giữa nước?','Nhật Tiên kiều dẫn sang đền Tam Phủ. Ở phía bên kia sân, Nguyệt Tiên kiều nối bờ hồ với lối đi lên núi Sài.'],
  'thuy-dinh-ho-long-tri':['drop','Khoang nước giữa sân khấu','Hãy nhìn xuống bên dưới mái kép của thủy đình. Sàn diễn ở đâu?','Có hai cánh xây cao để đồ diễn, còn gian giữa mở thẳng xuống mặt hồ. Từ sau mành diễn, nghệ nhân điều khiển con rối bơi ra trước thủy đình.'],
  'chua-cao-sai-son':['echo','Chuông trên núi Sài','Gác chuông nhỏ đứng qua bên kia sân, phía dưới chiếc mái thứ hai có gì?','Một quả chuông đồng treo trong khung gỗ trên cao. Chuông Đỉnh Sơn tự được đúc năm 1796.'],
  'chua-mot-mai-boi-am':['leaf','Một mái tựa núi','Bên hồi điện Mẫu, hãy nhìn dọc theo sườn mái nhà lưu niệm.','Mái chạy một dốc từ vách núi xuống hiên. Gian nhà Tổ ấy là nơi Chủ tịch Hồ Chí Minh ở và làm việc vào đầu năm 1947.'],
  'chua-tay-phuong-thach-xa':['lotus','Cửa tròn trên tường gạch','Theo lối đi bên ba đầu hồi, hình gì lặp lại giữa những mảng gạch Bát Tràng để mộc?','Những vành cửa tròn sáng màu hiện ra dưới các đầu đao. Phía trên, mỗi nếp chùa có hai tầng mái ngói mũi hài.']
});

;
// sight-secret-tram-chim.js
'use strict';
Object.assign(window.sightSecretStories,{
  'osm-node-12647638907':['arch','Cánh cổng mái tranh','Hai chữ nào nằm ngay dưới hàng tranh?','Mép mái rủ xuống như một chiếc rèm. Trên tấm gỗ cong, hai chữ Tràm Chim hiện ra trước mái nhà tròn phía trong sân.'],
  'osm-node-12647714579':['wing','Quả trứng trên đài','Quả trứng nào nhìn được qua ngọn cây?','Qua những nhịp thang thép xanh là một vành sàn tròn màu mật. Chiếc chóp trắng bên trên in lên trang giấy như vỏ trứng.'],
  'osm-node-12647715610':['sail','Mạn xuồng bên cầu ván','Dãy ghế nào nổi ngay dưới chân cầu?','Những tấm ván ngang nối hai bên mạn xuồng. Từ đầu cầu nhìn xuống, mỗi hàng ghế để một vạch nhỏ trên nền nước xanh.'],
  'osm-node-4416131389':['leaf','Vỏ tràm ven kênh','Đường sáng nào còn lại khi tách màu lá?','Bên bờ kênh C4, thân tràm sáng màu chẻ thành nhiều nhánh. Tán lá đọng thành từng cụm nhỏ phía trên, nhường chỗ cho những vệt vỏ in xuống nước.'],
  'osm-node-12647689080':['drop','Khúc kênh nhìn từ C4','Dòng nước ẩn ở đâu khi đứng dưới hàng cây?','Lên sàn cao, nhìn qua mái lá tràm, khúc kênh dọc bờ đê mới hiện đủ hai bờ. Trên dấu mực, nó luồn giữa hai dải xanh.']
});

;
// sight-secret-dong-van.js
'use strict';
Object.assign(window.sightSecretStories,{
  'dai-ngam-nui-doi-quan-ba':['ridge','Trên sàn bát giác','Từ lối bậc, thử tìm cầu thang ngắn dẫn lên sàn cao nhất.','Sàn trên có tám cạnh. Hàng lan can thưa mở tầm mắt qua thung lũng Tam Sơn tới hai gò xanh ở Nà Khoang.'],
  'nui-doi-quan-ba':['leaf','Hai chóp ở Nà Khoang','Nhìn theo đường viền trời từ chóp này tới chóp kia. Sườn núi gặp nhau ở đâu?','Hai vòm xanh cùng nhô lên khỏi ruộng. Đường viền hạ xuống một khoảng yên rồi mới vút lên ở chóp kế bên.'],
  'dong-lung-khuy':['drop','Giọt nước dưới trần đá','Qua cửa hẹp, hãy tìm những mũi đá rủ xuống ngay cạnh tay vịn.','Đó là thạch nhũ hình thành khi nước nhỏ từ trần động. Dưới chân chúng, con đường có tay vịn uốn theo khoang mở rộng.'],
  'rung-da-lung-tao':['ridge','Rãnh mưa trên đá tai mèo','Lại gần một mũi đá vôi và lần theo rãnh từ đỉnh xuống thấp.','Những rãnh dọc ăn sâu vào mặt đá, chừa lại gờ bén ở hai bên. Dưới chân các cụm đá, từng vạt đất nhỏ vẫn nuôi được cây.'],
  'pho-co-dong-van':['lantern','Sân trời sau ba vòm','Đi qua mặt tiền có ba vòm của ngôi nhà cổ. Điều gì mang ánh sáng vào giữa nhà?','Các dãy nhà hai tầng vây quanh một sân trời. Từ sân nhìn lên thấy hành lang gỗ, mái ngói và đèn lồng phía dưới hiên.'],
  'cho-co-dong-van':['echo','Nếp ngang cuối chợ','Đứng ngoài sân, tìm mái nhà nằm ngang với hai dãy dài hai bên.','Nếp ngang nối hai bên thành hình chữ U mở về phía sân. Dưới những mái sẫm, đường mạch ngang cho thấy từng khối đá ghép thành cột.']
});

;
// sight-secret-dong-nai.js
'use strict';
Object.assign(window.sightSecretStories,{
  'van-mieu-tran-bien':['ink','Nét mực hồ Tịnh Quang','Mặt hồ vuông giữa Văn miếu đang soi bóng mái nào?','Hồ Tịnh Quang nằm giữa trục thần đạo. Bóng mái ngói xanh của Khuê Văn Các in xuống nước như một nét mực chưa kịp khô.'],
  'cho-bien-hoa':['lantern','Đèn sớm chợ Biên Hòa','Dưới mái tôn đỏ, ô sáng nào thức dậy trước tiên?','Những tấm lợp sáng xen giữa mái tôn đỏ sẫm. Khi trời còn mờ, ánh đèn từ nhà lồng hắt lên qua đúng các ô ấy.'],
  'thanh-co-bien-hoa':['arch','Vòm cửa Thành Kèn','Tám ô cửa vòm của ngôi nhà phía tây nhìn về đâu?','Dãy cửa vòm lá sách nâu chạy dọc tầng trên. Qua mỗi ô cửa là một khoảng sân nằm trong vòng tường đá ong.'],
  'khu-du-lich-buu-long':['ridge','Răng đá Bửu Long','Dãy đá nhọn bên hồ có bao nhiêu đỉnh soi xuống nước?','Những mỏm đá xám nhạt đứng thành một sống lưng sát mép hồ. Mặt nước lặng nhân đôi từng đỉnh đá.'],
  'cho-long-thanh':['gear','Bốn cửa chợ Long Thành','Đứng giữa sân trong, cửa nào đón nắng trước?','Chợ mở bốn cổng có mái quanh một khoảng sân trồng cây. Buổi sáng, cổng phía đông sáng lên trước ba cổng còn lại.'],
  'dinh-tam-an':['dragon','Mái đình Tam An','Trên nóc ngói cam của ngôi đình có ai đang canh cổng?','Mái ngói cam chụm về một đường nóc. Chiếc cổng nhỏ lệch sang một bên, như để dành lối thẳng cho gió vào sân.'],
  'cho-ma-da':['leaf','Lá rừng Mã Đà','Chiếc lá nào theo xe về tới mái chợ?','Chợ nằm giữa vùng rừng. Một chiếc lá rơi trên mái tôn xanh nhạt, còn nguyên cuống.'],
  'cho-hieu-liem':['drop','Giọt mưa đầu hồi','Mưa rơi xuống mái chợ nhỏ theo phía nào?','Ngôi chợ quay đầu hồi ra đường. Nước mưa chạy theo hai mái rồi nhỏ xuống thành hai hàng thẳng.'],
  'nha-tho-xuan-loc':['beacon','Tháp chuông Xuân Lộc','Ngọn tháp hồng thu nhỏ dần qua mấy tầng?','Tháp chuông đứng giữa mặt tiền, mỗi tầng hẹp hơn tầng dưới. Trên cùng là chóp nhọn mảnh nhìn thấy từ cuối phố.'],
  'suoi-tre':['leaf','Bóng cây Suối Tre','Dưới tán cây già, ngôi nhà vàng đứng trên mấy hàng cột?','Ngôi nhà vàng nâng sàn trên hàng cột, cầu thang để lộ ra ngoài. Bóng lá phủ gần kín mái ngói đỏ nâu.'],
  'ben-xe-tri-an':['star','Bảng xanh bến xe','Dòng chữ trắng trên nền xanh chào ai ở cổng?','Hai trụ trắng đỡ tấm bảng xanh ghi tên bến. Xe ra vào đều đi qua bên dưới dòng chữ ấy.'],
  'cau-chien-khu-d':['wing','Gió qua cầu Chiến khu D','Tấm biển nhỏ bên đầu cầu ghi con số gì?','Dưới biển tròn báo tải trọng là tấm biển xanh ghi tên cầu. Gió từ lòng hồ thổi ngang làm hàng cọc tiêu như đang đếm nhịp.'],
  'suoi-mo':['drop','Màn nước Suối Mơ','Dòng thác đổ xuống hồ tròn thành mấy dải?','Nước chảy qua gờ đá sẫm thành một màn mỏng. Bên hồ tròn có ngọn hải đăng nhỏ sơn đỏ trắng.'],
  'cho-dong-xoai':['lantern','Bảng đỏ chợ Đồng Xoài','Hàng chữ trắng trên nền đỏ dài bằng mấy gian hàng?','Tên chợ chạy trên dải bảng đỏ dọc mặt tiền. Bên dưới là những mái hiên đủ màu che cho hàng quán.'],
  'di-tich-phu-rieng-do':['star','Ngọn tháp Phú Riềng','Trên thân trụ trắng có dấu hiệu gì ánh vàng?','Thân trụ thuôn dần lên cao trên bệ bậc đỏ. Gần đỉnh có một biểu tượng ánh vàng bắt nắng buổi sáng.'],
  'ho-long-thuy':['sail','Hai mái chòi bên hồ','Hai nhà chòi mái cam cùng nhìn về phía nào?','Sân kè vươn ra mép nước với hai nhà chòi lợp ngói cam. Cả hai cùng quay mặt ra mặt hồ lặng.'],
  'quang-truong-6-thang-1':['echo','Tiếng vọng quảng trường','Hai hồ nước hai bên trục đường giữ lại âm thanh gì?','Hai hồ bầu dục nằm đối nhau qua lối đi giữa. Tiếng vòi phun bên này dội sang bên kia như có người đáp lời.'],
  'cong-vien-chon-thanh':['leaf','Hàng cây Chơn Thành','Những hàng cây trong công viên thẳng theo hướng nào?','Cây được trồng thành hàng đều nhau quanh một bãi đất trống. Đứng ở đầu hàng có thể nhìn suốt tới cuối.'],
  'di-tich-tau-o':['arch','Gò tượng đài Tàu Ô','Bậc đá dẫn lên tượng đài có mấy hướng lên?','Tượng đài đá sẫm đứng trên một gò tròn có bậc. Phía sau là nhà tưởng niệm mái ngói đỏ, hai bên là hai nhà bát giác.'],
  'san-van-dong-dong-nai':['wing','Khán đài nhiều màu','Dãy ghế trên khán đài đổi màu mấy lần quanh sân?','Khán đài ôm quanh mặt cỏ, mỗi khu ghế một màu. Nhìn từ trên cao, sân như một chiếc vòng nhiều mảnh ghép.'],
  'quang-truong-tinh-dong-nai':['star','Sân lớn quảng trường tỉnh','Giữa sân lát rộng, hàng cây đứng thành hình gì?','Sân lát trải rộng giữa các tòa nhà. Hai cụm cây đứng đối nhau, chừa một lối thẳng ở giữa.'],
  'cong-vien-bien-hung':['lotus','Mặt nước Biên Hùng','Giữa công viên, khoảng sáng nào nằm im dưới tán cây?','Công viên ôm một khoảng nước giữa phố. Buổi tối, đèn đường quanh hồ in xuống thành một vòng sáng.'],
  'chua-buu-phong':['lotus','Bậc đá chùa Bửu Phong','Ba cửa vòm của ngôi chùa trên núi mở về hướng nào?','Bậc đá dẫn lên mặt tiền có ba cửa vòm. Từ thềm chùa nhìn xuống là hồ nước và những mỏm đá Bửu Long.'],
  'cau-ghenh':['gear','Nhịp thép cầu Ghềnh','Ba vòm thép nối nhau qua sông bằng bao nhiêu thanh giằng?','Ba nhịp giàn thép cong nối nhau qua sông Đồng Nai. Mỗi nhịp là một dãy tam giác lặp lại đều đặn.'],
  'ga-bien-hoa':['beacon','Sân ga Biên Hòa','Tấm bảng tên ga sáng lên lúc tàu nào về?','Nhà ga thấp và dài, mái hiên che trước cửa. Bảng tên ga nằm trên mặt tiền, nhìn ra khoảng sân đón khách.'],
  'den-tho-nguyen-huu-canh':['dragon','Sân đền Lễ Thành hầu','Pho tượng đứng giữa sân nhìn về phía nào?','Ngôi đền mái ngói đỏ nằm trên cù lao Phố. Trước sân có pho tượng đứng hướng ra dòng sông.']
});

;
// sight-secret-themes.js
'use strict';
// The illustrations are imaginary keepsakes. Name a species, trade or faith
// only when the mapped place gives us that detail.
window.sightSecretTheme=(()=>{
  const passes={
    'deo-hai-van':['sail','Biển trong khúc cua','Có một túi áo đủ rộng để đựng cả đường chân trời.','Tờ giấy gấp theo sống đèo Hải Vân. Mở nếp gấp cuối cùng, một cánh buồm nhỏ trượt ra biển.'],
    'deo-ma-pi-leng':['drop','Dải lụa Nho Quế','Kẽ giữa hai nét đá còn chừa một lối rất hẹp.','Một giọt mực lách qua hẻm đá Mã Pí Lèng. Phía dưới, nó kéo thành dải Nho Quế uốn quanh chân núi.'],
    'deo-khau-pha':['leaf','Bậc thang trên lá','Gân của chiếc lá này có những chỗ bằng phẳng lạ lùng.','Gân lá tẽ ra thành từng bậc ruộng dưới đèo Khau Phạ. Một hạt sương nghỉ ở bậc cuối cùng.'],
    'deo-o-quy-ho':['wing','Thư qua Hoàng Liên','Phong thư vượt đèo này có một góc biết vỗ cánh.','Mép phong thư bật lên thành cánh chim. Nó lượn qua những lớp núi của Ô Quy Hồ rồi đáp xuống trang sổ.'],
    'deo-pha-din':['ridge','Một đèo trong lòng bàn tay','Nét bút đi lên một sườn giấy rồi mất hút sau nếp gấp.','Pha Đin nằm gọn trên một tờ giấy xếp. Lật từ Thuận Châu sang Tuần Giáo, nét đường xuất hiện ở sườn bên kia.'],
    'deo-ngoan-muc':['ridge','Cuộn chỉ Sông Pha','Sợi chỉ này xuống hết một con dốc mà vẫn còn cuộn.','Từ mép cao nguyên, sợi chỉ lần qua các khúc ngoặt đèo Ngoạn Mục. Đến Sông Pha, nó mới chịu duỗi thẳng.']
  };
  // Each clue and its answer travel together so the art cannot contradict a
  // shuffled line. @ stands for the mapped locality used as the postal origin.
  const themes={
    memorial:[
      ['ink','Khoảng trắng bên dòng ghi nhớ','Ở cuối dòng mực có một khoảng giấy được để trống.','Nét bút dừng lại. Khoảng giấy nhỏ ấy dành cho một phút tưởng nhớ.'],
      ['leaf','Nhành lá để lại','Một nhành lá mảnh nằm ngang mép trang.','Giữa trang sổ, nhành lá giữ yên một chỗ. Dòng ghi nhớ nằm ngay bên dưới.'],
      ['star','Ánh sao trong trang giấy','Một đốm sáng nhỏ đọng lại sau dòng chữ.','Trên trang ghi nhớ, ngôi sao chỉ bằng một chấm mực. Khép sổ lại vẫn còn thấy ánh sáng ấy.']
    ],
    buddhist:[
      ['lotus','Nếp giấy thành sen','Có mấy nếp giấy chụm vào nhau như những cánh hoa.','Tờ giấy mở từng nếp thành một đóa sen. Giữa các cánh còn nguyên một khoảng tĩnh lặng.'],
      ['drop','Giọt nước yên','Có một hạt nước vừa đủ tròn để soi cả khoảng trời.','Giọt nước nằm yên ở đầu nét mực. Trong khoảnh tròn tí xíu ấy, cả trang giấy như lắng xuống.'],
      ['leaf','Chiếc lá nghỉ chân','Một nét mảnh vừa rời cành đã tìm được chỗ nghỉ.','Chiếc lá khẽ chạm vào lề giấy. Những đường gân thôi rung và thành dấu trang cho buổi ghé chùa.']
    ],
    church:[
      ['arch','Dải sáng qua vòm','Một nét cong giữ mấy vệt sáng đứng sát bên nhau.','Trên dấu mực, ánh sáng lọt qua một vòm giấy. Những vệt màu trải dài vừa đủ một trang sổ.'],
      ['wing','Cánh giấy đầu hồi','Có đôi cánh còn khép ở chỗ hai nét xiên gặp nhau.','Hai nét mái nghiêng tách thành đôi cánh. Cánh chim giấy đậu lại ngay trên tên nhà thờ.']
    ],
    mosque:[
      ['star','Ngôi sao trong hoa văn','Một chấm sáng đợi ở nơi các nét thẳng gặp nhau.','Từng đường mực nối nhau thành hoa văn hình sao. Một góc giấy trắng làm hoa văn sáng lên.'],
      ['arch','Vòm trong vòm','Nét cong nhỏ đang nép trong bóng của nét cong lớn.','Những đường vòm lồng vào nhau trên mặt giấy. Khoảng sáng ở giữa vừa bằng một ô cửa.']
    ],
    bamboo:[
      ['leaf','Dóng trúc khép trang','Vài nét ngang chia một đường thẳng mảnh thành từng đốt.','Từ hai chữ Trúc Lâm, một cành trúc giấy mọc qua lề tem. Chiếc lá ngoài cùng rủ xuống làm dấu trang.']
    ],
    lotus:[
      ['lotus','Cánh sen trong tên','Một nét chữ đang mở ra như cánh hoa.','Chữ trên trang nhường chỗ cho một đóa sen bằng giấy. Cánh ngoài cùng vừa khít với vòng dấu.']
    ],
    cloud:[
      ['ridge','Đám mây chạm mép giấy','Có một nét cong trôi ra ngoài đường đỉnh.','Đám mây trên tem quấn lấy một nếp núi. Khi hai nét tách ra, mây còn dính một chấm mực.']
    ],
    dragon:[
      ['dragon','Con rồng uốn nét','Có một nét dài cuộn mình mà vẫn còn thừa chiếc đuôi.','Nét mực uốn thêm một vòng thành dáng rồng. Cái đuôi rẽ qua đường viền để ký tên lên tem.']
    ],
    turtle:[
      ['turtle','Chiếc mai đội nét chữ','Có một nét cong đang đội cả hoa văn trên lưng.','Những ô mực ghép vừa thành mai rùa. Chú rùa giấy thò đầu ra khỏi vòng tem, đủng đỉnh bò sang trang.']
    ],
    gem:[
      ['drop','Hạt ngọc giữa tên','Một chữ nhỏ như đang giữ một hạt sáng.','Chữ Ngọc trên trang nhả ra một giọt sáng bằng đầu bút. Khung tem khép lại quanh viên ngọc giấy.']
    ],
    caodai:[
      ['ink','Vệt nắng ba màu','Mấy vệt sáng nằm cạnh nhau như những dải lụa.','Ba vệt mực vàng, xanh và đỏ đi cùng nhau qua trang giấy. Đến mép dấu, chúng vẫn giữ nguyên từng màu.']
    ],
    floatingMarket:[
      ['sail','Gánh hàng trên sóng','Tờ giấy gói vừa nhô lên một mũi thuyền.','Một chiếc ghe bằng giấy chở gói hàng bé xíu qua chợ nổi trên tem. Vệt nước sau lái còn chưa kịp khép.']
    ],
    quay:[
      ['sail','Dây neo bằng mực','Cánh buồm đứng lại, còn một nét mảnh nối về bờ.','Con thuyền giấy tấp vào bến. Sợi dây neo vẽ một vòng quanh đầu nét bút rồi dừng.']
    ],
    clan:[
      ['ink','Những nét cùng gốc','Nhiều nét mực nhỏ rẽ ra từ cùng một nét đầu.','Cành mực chia thêm nhánh thành một cây gia phả bằng hình. Lề sổ giữ chỗ cho chiếc lá sau cùng.'],
      ['leaf','Hai mặt một chiếc lá','Có một vệt gân nối hai nửa chiếc lá.','Mỗi bên gân lá có những đường rẽ khác nhau. Lần về cuống, chúng lại gặp nhau ở một chỗ.']
    ],
    shrine:[
      ['arch','Ngưỡng cửa bằng mực','Hai vệt mực ngừng đúng trước một ngưỡng cửa.','Khung cửa vừa khít trong lòng con dấu. Phần giấy sáng ở giữa giữ lại chút tĩnh tại của lần ghé thăm.'],
      ['ink','Nét mực hồi bút','Một nét bút sắp rời trang rồi nhẹ nhàng quay lại.','Chỗ đầu bút quay về thành một nét cong mềm. Bên dưới là dấu bưu trạm @.']
    ],
    bridge:[
      ['arch','Nhịp cuối còn thiếu','Đôi bờ trong hình chỉ còn cách nhau một nét cong.','Nét mực võng xuống rồi bắc sang bên kia. Hai mép giấy bỗng chung một cây cầu.'],
      ['sail','Chuyến thư qua gầm cầu','Có một phong thư đi đường nước, vừa lọt dưới nét cong.','Phong thư gấp thành thuyền. Nó chui qua nhịp cầu bằng mực và cập vào lề sổ.']
    ],
    stone:[
      ['arch','Viên đá khóa vòm','Nét cong chừa chỗ cho một miếng ghép nhỏ ở đỉnh.','Miếng giấy cuối cùng rơi vào đỉnh vòm. Hai nửa khung cổng đứng vừa khít bên nhau.'],
      ['ink','Bản dập bên thềm','Mấy nét đứt đoạn in từ mặt giấy bên kia.','Một lượt mực mỏng làm hiện đường viền cũ. Trang sổ mang về một bản dập tí hon.']
    ],
    ruin:[
      ['ink','Mảnh hoa văn tìm lại','Một nét hoa văn còn dang dở ở rìa mảnh giấy.','Hai mảnh nét mực khớp nhau. Hoa văn tưởng đã mất một nửa nằm trọn trong khung tem.'],
      ['arch','Dấu dưới lớp giấy','Một góc trang hơi đội lên, như còn giấu gì bên dưới.','Lớp mực nhạt lùi vào sau lớp đậm. Đường viền ẩn bên dưới hiện lên như một mảnh thời gian.']
    ],
    museum:[
      ['ink','Ô nhãn bé xíu','Tấm nhãn giấy này có một nét mực trốn ra ngoài lề.','Nét mực quay về đúng ô, biến thành bức ký họa tí hon. Trang sổ có thêm cả một tủ trưng bày.'],
      ['arch','Khung trong khung','Còn một khung nhỏ lồng bên trong viền tem.','Cửa tủ trên giấy hé mở. Khung trống bên trong vừa khít kỷ niệm bạn mang từ @.']
    ],
    art:[
      ['ink','Nét cọ bỏ quên','Một đầu cọ nhỏ còn để hở ở mép tranh.','Chiếc cọ xoay nửa vòng và để lại một vệt mực. Vệt cuối ấy vừa hay ký tên cho bức tranh.'],
      ['leaf','Tranh in từ một chiếc lá','Có một đường gân rất nhỏ dưới lớp màu.','Nhấc chiếc lá tưởng tượng lên, từng gân mảnh còn in trên giấy. Trang sổ trở thành một bức tranh độc bản.']
    ],
    grotto:[
      ['echo','Tiếng vọng gấp đôi','Một nét cong vừa mất hút thì có nét thứ hai đáp lại.','Nét vẽ dội qua thành hang trên tem, rồi nhỏ dần. Đến mép giấy chỉ còn một dấu chấm.'],
      ['drop','Giọt nước đếm nhịp','Một hạt nước lơ lửng giữa hai dấu mực.','Giọt nước từ vòm hang rơi xuống trang giấy. Vòng mực lan ra đánh dấu đúng nơi nó chạm.']
    ],
    peak:[
      ['ridge','Nếp núi bỏ túi','Mép giấy này gấp lại khéo đến mức trông như một đường chân trời.','Những nếp gấp nhô lên thành dãy núi nhỏ. Khép trang sổ, đỉnh cuối cùng vẫn thò ra một chút.'],
      ['wing','Cánh chim vượt nét núi','Một nét nghiêng vừa cao hơn đường đỉnh núi.','Nét nghiêng xòe thành đôi cánh. Bóng chim lướt qua đỉnh trên tem rồi dừng ở mép trời.'],
      ['star','Chấm sáng trên đường đỉnh','Một chấm mực nhỏ mắc ngay trên đường gấp khúc.','Chấm mực mở ra thành sao. Đỉnh núi bên dưới bỗng giống một chiếc giá đỡ cả bầu trời.']
    ],
    pass:[
      ['ridge','Nét cua gấp giấy','Đường mực ôm một nếp gấp rồi biến sang mặt bên kia.','Tấm tem gấp lên thành sườn đèo. Nét cua trên mặt giấy nối lại ở phía bên kia dốc.'],
      ['wing','Bóng cánh qua đèo','Có một nét cong lướt ngang các đường đồng mức.','Bóng cánh chim lượn qua khúc cua trên giấy. Mấy đường đồng mức trôi qua dưới đôi cánh nhỏ.']
    ],
    waterfall:[
      ['drop','Dấu chấm dưới chân thác','Dải mực trắng đứt thành hạt ở ngay cuối dòng.','Thác giấy rơi qua một bậc mực. Giọt nước bắn cao nhất đọng lại thành dấu chấm trên tem.'],
      ['echo','Bọt nước viết nhạc','Những chấm nước đang xếp hàng như nốt nhạc.','Bọt thác vỡ ra thành một hàng chấm tròn. Bản nhạc của dòng nước nằm yên trong sổ.']
    ],
    stream:[
      ['drop','Hòn cuội chia dòng','Giữa đường mực có một khoảnh tròn để trắng.','Dòng nước giấy lách sang hai bên hòn cuội rồi lại gặp nhau. Chút nước đọng cuối dòng hóa thành tem.'],
      ['leaf','Chiếc bè một lá','Có một chiếc lá nhỏ vừa rời bờ mực.','Chiếc lá trôi theo dòng nước uốn trên mặt tem. Cuống lá chạm lề sổ, như một chiếc bè vừa cập bến.']
    ],
    lake:[
      ['drop','Giọt nước mang trời','Mặt nước bé xíu còn chừa một khoảng cho bầu trời.','Một giọt nước lọt vào giữa trang sổ. Trong lòng giọt, đường chân trời bỗng lộn ngược.'],
      ['wing','Bóng cánh trên hồ','Có hai nét cánh đối xứng qua một đường ngang.','Một cánh chim nghiêng trên mặt tem. Cái bóng dưới nước nghiêng theo, chậm hơn đúng một gợn sóng.'],
      ['leaf','Lá thả vòng nước','Một chiếc lá vừa khẽ chạm vào giữa những vòng mực.','Vòng nước rộng dần quanh chiếc lá. Vòng cuối cùng chạm khung tem rồi dừng lại.']
    ],
    ocean:[
      ['shell','Vỏ ốc giữ sóng','Một con sóng đã cuộn tròn mà chưa chịu tan.','Con sóng nhỏ cuộn thêm một vòng, thành đường xoắn trong vỏ ốc. Cả bờ biển vừa gọn trong lòng tem.'],
      ['sail','Lá thư căng buồm','Góc thư nhô lên khỏi một đường chân trời bằng mực.','Gió giấy thổi căng góc thư thành cánh buồm. Con thuyền rời mép sóng và cập vào trang sổ.']
    ],
    bay:[
      ['sail','Cánh buồm trong ngoặc','Đường bờ như hai dấu ngoặc ôm lấy một chấm trắng.','Chấm trắng bung thành cánh buồm. Hai bờ vịnh trên tem khép vừa vặn quanh chuyến đi nhỏ.'],
      ['shell','Mảnh vịnh bỏ túi','Đường cong nào vừa giữ được cả một khoảnh nước?','Viền vịnh thu mình thành miệng vỏ sò. Bên trong còn đọng một dải nước mảnh.']
    ],
    light:[
      ['beacon','Thư gửi bằng ánh sáng','Có một nét sáng quét qua mép giấy tối.','Tia sáng đi trọn một vòng quanh ngọn đèn biển tí hon. Đầu tia chạm khung tem như vừa gửi xong một tín hiệu.'],
      ['star','Ngôi sao đứng gác','Một chấm sao nằm thấp hơn tất cả những chấm còn lại.','Ngôi sao hạ xuống đầu nét tháp và sáng lên. Từ ngoài mép tem cũng nhận ra đốm sáng dẫn đường.']
    ],
    fish:[
      ['drop','Bong bóng lạc đàn','Một chấm tròn đang nổi ngược chiều những nét cá bơi.','Bong bóng nổi qua một đàn cá bằng mực. Lên tới mép nước, nó hóa thành một hạt sáng trên tem.'],
      ['shell','Bức thư dưới nước','Hai nét khép lại, giữ một chấm sáng ở bên trong.','Chiếc vỏ mở ra trên nền nước giấy. Trong lòng vỏ là một lá thư nhỏ đến mức chỉ viết vừa tên @.']
    ],
    forest:[
      ['leaf','Tán rừng trong gân lá','Những đường gân nhỏ chia nhau một vệt sáng.','Một chiếc lá mở ra, mỗi nhánh gân lại giống một lối qua tán rừng. Cả khu rừng nằm gọn trong đường viền.'],
      ['wing','Bóng cánh qua vòm lá','Giữa các tán mực xanh có một khoảng trống hình đôi cánh.','Khoảng trống bỗng thành cánh chim giấy. Lá hai bên khép lại sau đường bay của nó.']
    ],
    wetland:[
      ['leaf','Hai nửa tán rừng','Một tán lá đang soi bóng xuống nửa tem còn lại.','Cành lá và bóng nước ghép vừa một khung. Ở chỗ hai nửa gặp nhau còn một gợn sóng.'],
      ['drop','Lạch nước trong tay','Một nét nước nhỏ uốn giữa hai mảng lá.','Con lạch bằng mực luồn qua lớp lá, chia đôi rồi nhập lại. Trang sổ giữ cả một dòng chảy trong lòng bàn tay.']
    ],
    bird:[
      ['wing','Bức thư có lông vũ','Một góc thư nhú ra chiếc lông nhỏ.','Góc thư xòe thêm một chiếc lông rồi thành cánh. Đường bay khép lại đúng trên dấu bưu trạm @.'],
      ['ink','Chữ ký đường bay','Một nét ký tên vừa liệng qua khung.','Đôi cánh nhỏ vẽ một vòng giữa khoảng trời giấy. Đó là chữ ký của một đường bay.']
    ],
    fauna:[
      ['leaf','Vết chân sau chiếc lá','Dưới mép lá có một chuỗi dấu bé bằng hạt mực.','Chiếc lá giấy hé ra. Mấy dấu chân nhỏ chạy mất khỏi khung, để lại một lối mòn trong trang sổ.'],
      ['ink','Dấu chân đi lạc','Có một dấu chân li ti ở ngoài đường viền.','Hàng dấu chân bằng mực đi một vòng quanh tem. Dấu cuối in lệch ra ngoài như còn muốn đi chơi tiếp.']
    ],
    garden:[
      ['leaf','Chiếc lá đi ép','Một đường gân vẫn còn nổi trên mặt giấy phẳng.','Trang giấy mở ra, hiện một chiếc lá ép. Từng đường gân nhỏ vẫn giữ nguyên dáng cong ban đầu.'],
      ['drop','Giọt sương làm kính','Một đường gân bỗng to hơn ở giữa hạt nước.','Giọt sương trên lá thành chiếc kính lúp tí hon. Nhìn qua nó, cả khu vườn chỉ còn một màu xanh.']
    ],
    flower:[
      ['leaf','Cuống hoa làm dấu trang','Giữa hai mép giấy có một cuống hoa nhỏ nhô ra.','Trang sổ hé mở, những cánh hoa giấy duỗi ra. Cuống hoa ở lại làm dấu cho lần ghé @.'],
      ['drop','Giọt sương trên cánh','Một hạt nước đang níu lấy mép cánh hoa.','Cánh hoa nghiêng đi, hạt sương lăn qua đường gân. Chỗ nó dừng lấp lánh như một hạt thủy tinh.']
    ],
    tea:[
      ['leaf','Búp trà vào sổ','Hai lá nhỏ còn ôm một nét búp ở giữa.','Búp trà bằng giấy hé nở. Hai chiếc lá non giữ lại nếp gấp xanh giữa trang sổ.'],
      ['ridge','Luống trà quấn đồi','Những dòng mực xanh không chịu nằm thẳng hàng.','Từng luống trà trên tem uốn theo sườn đồi. Dòng cuối nối vào cuống một chiếc lá nhỏ.']
    ],
    grain:[
      ['leaf','Lá lúa gấp thuyền','Một lá dài đang cuộn hai mép như sắp rời đồng.','Lá lúa bằng giấy gặp một vệt nước và hóa thuyền. Mũi lá nhọn còn vương một hạt mực.'],
      ['drop','Hạt sương ngoài ruộng','Một nét xanh đang đỡ hạt nước tròn xoe.','Hạt sương lăn từ ngọn lúa xuống mép giấy. Trong lòng hạt vẫn soi được màu đồng.']
    ],
    village:[
      ['ink','Nét tay người thợ','Có một nét đi chậm hơn hẳn những đường còn lại.','Nét mực theo nhịp tay, tới góc trang mới ngừng. Mép tem giữ lại một dấu tay thợ bé xíu.'],
      ['gear','Nhịp tay trong xưởng','Mấy nét ngắn vừa khớp nhau thành một vòng.','Vòng mực quay một nhịp theo bàn tay người thợ. Trang sổ có thêm một dấu in của làng nghề.']
    ],
    weave:[
      ['ink','Sợi ngang trốn việc','Một sợi ngang đang thò đầu khỏi mép hoa văn.','Sợi giấy luồn qua những nét dọc, lần lượt trên rồi dưới. Ô hoa văn cuối cùng hiện ra nơi nó dừng.'],
      ['leaf','Sợi mảnh trong lá','Có mấy nét mảnh đan chéo nhau kín cả một góc nhỏ.','Từng sợi giấy luồn qua nhau. Vệt đan xong ô cuối và chừa lại một đầu sợi trên lề sổ.']
    ],
    clay:[
      ['drop','Vòng xoay của đất','Một giọt nước đang nằm đúng giữa những vòng tròn.','Giọt nước gặp vòng đất xoay trên giấy. Mấy đường cong nâng lên thành miệng bát tròn xoe.'],
      ['ink','Nét men còn ướt','Một vệt màu cong đang bám theo miệng tròn.','Đầu cọ trên tem đi đúng một vòng. Miệng gốm vừa khép, nét men còn đọng ở chỗ hai đầu gặp nhau.']
    ],
    food:[
      ['ink','Hơi nóng vẽ chữ','Một sợi hơi mảnh vừa luồn ra ngoài khung.','Làn hơi lượn một vòng trên giấy, tự viết thành chữ ký cho món quà mang từ @.'],
      ['leaf','Gói quà bé xíu','Nếp giấy gói này vừa khéo nằm gọn trong lòng tem.','Các góc giấy mở ra như chiếc lá gói quà. Hương vị của làng được gửi bằng một con tem nhỏ.']
    ],
    market:[
      ['lantern','Phiên chợ trong ô sáng','Mấy ô nhỏ chen vai nhau, chỉ một ô còn sáng.','Ánh đèn giấy rọi vừa một góc chợ trên tem. Tờ giấy gói quà hiện ra dưới quầng sáng ấy.'],
      ['ink','Gói giấy cuối phiên','Có một tờ giấy đã gấp cả bốn góc vào nhau.','Gói giấy tí hon bung ra. Bên trong chỉ có một con dấu ghi nơi gửi là @.']
    ],
    machine:[
      ['gear','Răng cưa vào khớp','Hai đường răng chỉ còn lệch nhau một nhịp.','Hai bánh răng mực ăn khớp. Ngay cả chấm nhỏ ngoài rìa con tem cũng nhích theo một nấc.'],
      ['ink','Bản vẽ biết chạy','Một đường nét đứt còn thiếu nhịp cuối.','Nét cuối nối vào bản vẽ, và vòng quay trên giấy khép kín. Một chấm dầu bé bằng hạt mực đánh dấu điểm đầu.']
    ],
    playground:[
      ['gear','Vòng quay trong túi','Một chiếc vòng đang chờ đúng chiếc răng cuối.','Bánh xe giấy quay một vòng, đưa chấm sáng trở về vạch đầu. Chuyến chơi nhỏ vừa gọn trong trang sổ.'],
      ['star','Tấm vé thêm một sao','Tờ vé giấy còn một ô trống chưa bấm.','Chiếc vé gập đôi rồi mở ra. Một lỗ nhỏ hình sao cho ánh sáng lọt qua.']
    ],
    resort:[
      ['leaf','Thư nghỉ chân','Có một chiếc lá gấp làm đôi như tấm thiệp.','Chiếc lá mở ra thành thiệp gửi từ @. Chỗ dành cho lời nhắn vẫn thảnh thơi để trống.'],
      ['star','Đêm trong tấm thiệp','Mặt trong tấm thiệp có một lỗ kim nhỏ.','Qua lỗ kim, ánh sáng hóa thành một ngôi sao. Khoảnh nghỉ chân nằm vừa trong khung tem.']
    ],
    park:[
      ['leaf','Ghế nghỉ cho chiếc lá','Một chiếc lá còn khuyết nằm ngay chỗ nét mực đổi hướng.','Chiếc lá đậu xuống một băng ghế bằng nét bút. Dọc lề sổ, con đường giấy vẫn còn đi tiếp.'],
      ['wing','Bóng chim trên lối dạo','Một vệt cánh thoáng qua ngay chỗ đường nét uốn cong.','Cánh chim bằng giấy bay tắt ngang lối dạo trên tem. Cái bóng của nó chạm vào ô nắng cuối cùng.']
    ],
    lookout:[
      ['star','Ô cửa bỏ túi','Có một ô trống vừa đủ cho một chấm sáng.','Khung giấy ôm lấy một góc trời. Chấm sáng chính giữa thành dấu riêng của lần ngắm cảnh này.'],
      ['wing','Cánh chim đo trời','Một dấu phẩy đang treo cao hơn đường chân trời.','Dấu phẩy xòe thành cánh chim trên nền trời bé xíu. Khoảng trống quanh nó bỗng có chiều sâu.']
    ],
    town:[
      ['ink','Góc phố gấp tư','Một góc bản đồ đang nhô ra khỏi phong bì.','Bản đồ tí hon mở ra đúng chỗ hai nét đường gặp nhau. Mép thư in dấu bưu trạm @.'],
      ['arch','Ô cửa nhìn ra phố','Hai mép giấy xếp vào nhau để hở một ô vuông.','Ô cửa mở trên mặt tem. Vài nét phố vừa đủ lấp khoảng sáng bên trong.']
    ],
    post:[
      ['ink','Dấu thư đi nhờ','Có một nét mực còn dang dở trên đường bưu dấu.','Vệt mực vòng về điểm đầu, khép quanh tên @. Chuyến thư vừa có con dấu của riêng mình.'],
      ['star','Lỗ kim trên bản đồ','Nhìn kỹ khoảng giấy trống có một chấm sáng bằng đầu kim.','Một ngôi sao in khít vào lỗ kim. Trang sổ đã đánh dấu được nơi chuyến đi dừng lại.'],
      ['wing','Phong thư có cánh','Góc giấy mỏng cong lên tựa một đầu cánh.','Gấp thêm một nếp, chiếc phong bì hóa cánh chim. Nó mang theo bưu dấu @ rồi đậu giữa hai trang sổ.']
    ]
  };
  const kindThemes={
    'Bảo tàng':'museum','Đỉnh núi':'peak','Tham quan':'post','Khu bảo tồn':'forest',
    'Công trình tín ngưỡng':'shrine','Khảo cổ':'ruin','Hải đăng':'light',
    'Thành cổ':'stone','Thác nước':'waterfall','Hang động':'grotto','Công viên':'park',
    'Di tích':'ruin','Lăng mộ':'memorial','Hồ':'lake','Bãi biển':'ocean','Thủy cung':'fish',
    'Vịnh':'bay','Vườn thú':'fauna','Điểm ngắm cảnh':'lookout','Vườn cảnh':'garden',
    'Kiến trúc':'stone','Phòng trưng bày':'art','Đường đèo':'pass'
  };
  function words(value){
    return ' '+String(value||'').normalize('NFC').toLocaleLowerCase('vi')
      .replace(/[^\p{L}\p{N}]+/gu,' ').trim()+' ';
  }
  // Match whole words on both ends. Vietnamese accents distinguish địa danh
  // such as đền from đèn, đảo from đạo and họ from hồ.
  const remembered=/ (?:tưởng niệm|liệt sĩ|liệt sỹ|nghĩa trang|nghĩa trủng|thảm sát|trại giam|nhà tù|nhà lao|tử tù|ghi công|chiến trường|trận đánh|chiến thắng|kháng chiến|nhà bia|an nghỉ|cổ mộ|lăng mộ|mộ phần|khu mộ|chiến tranh|martyrs|memorial) /;
  const family=/ (?:nhà thờ (?:họ(?! đạo)|tộc|dòng họ|gia tộc)|từ đường) /;
  const religiousNames=[
    [/ (?:thánh đường hồi giáo|hồi giáo|masjid|mosque) /,'mosque'],
    [/ (?:giáo xứ|giáo họ|giáo phận|giáo hội công giáo|đức mẹ|nhà thờ chính tòa|nhà thờ chánh tòa|họ đạo|tin lành|vương cung thánh đường|chủng viện|cathedral|church) /,'church'],
    [/ (?:chùa|thiền viện|tịnh thất|tịnh xá|phật giáo|thích ca|phật bà|tượng phật|ni viện|tổ đình|pagoda) /,'buddhist'],
    [/ (?:cao đài|thánh thất) /,'caodai']
  ];
  const signals=[
    [/ (?:làng nghề|làng|xưởng|bảo tàng|triển lãm|trung tâm|khu trưng bày|nghề) [\p{L} ]*?(?:gốm|gốm sứ|nồi đất|làm gạch|sành sứ) /u,'clay'],
    [/ (?:làng|nghề|xưởng|bảo tàng) [\p{L} ]*?(?:mây tre|đan lát|làm nón|nón lá|chiếu cói|dệt|làng lụa|lụa|thổ cẩm|thêu) /u,'weave'],
    [/ (?:làng|nghề|xưởng|bảo tàng) [\p{L} ]*?(?:ẩm thực|bánh|bún|miến|nem|nấu rượu|nước mắm|mắm|cốm|phở|kẹo|làm tương) /u,'food'],
    [/ (?:làng bích họa|làng bích hoạ|tranh|art gallery|art foundation|phòng tranh|mỹ thuật|mĩ thuật|điêu khắc) /,'art'],
    [/ (?:làng nghề|làng mộc|làng đúc|làng rèn|làng nón|làng nặn|làng khảm|làng làm|làng đá mỹ nghệ) /,'village'],
    [/ (?:đồi chè|nương chè|đồi trà|vườn chè|vườn trà|chè xanh|búp trà|tea hill|tea plantation) /,'tea'],
    [/ (?:ruộng bậc thang|đồng lúa|cánh đồng lúa|ruộng lúa|rice field|rice terraces) /,'grain'],
    [/ (?:thủy cung|thuỷ cung|aquarium|underwater world|cá cảnh|ngắm cá|hồ cá) /,'fish'],
    [/ (?:hải đăng|đèn biển|đèn báo|lighthouse) /,'light'],
    [/ (?:hang động|thạch nhũ|hố sụt|hang dơi|động đá|grotto|cave|hang én) /,'grotto'],
    [/ (?:vườn chim|sân chim|sân cò|vườn cò|khu bảo tồn chim|bird sanctuary|vườn vạc) /,'bird'],
    [/ (?:ngập mặn|ngập nước|rừng tràm|rừng đước|rừng sú|rừng u minh) /,'wetland'],
    [/ (?:bảo tồn biển|bãi san hô|rạn san hô|san hô) /,'fish'],
    [/ chợ nổi /,'floatingMarket'],
    [/ (?:làng chài|bến thuyền|bến đò|bến tàu) /,'quay'],
    [/ (?:đầm phá|vịnh|bay) /,'bay'],
    [/ (?:thác|waterfall|falls) /,'waterfall'],
    [/ (?:suối|stream) /,'stream'],
    [/ (?:vườn hoa|làng hoa|đồi hoa|hoa hướng dương|vườn hồng|vườn lan) /,'flower'],
    [/ (?:safari|vườn thú|sở thú|cứu hộ linh trưởng|zoo) /,'fauna'],
    [/ (?:nhà máy|đường sắt|đầu máy|xi măng|ga xe lửa|xe lửa|thủy điện|thuỷ điện) /,'machine'],
    [/ (?:tàu lượn|tàu lộn vòng|trò chơi|vòng xoay mặt trời|khu vui chơi|công viên nước|water park|theme park) /,'playground'],
    [/ (?:đảo|bãi biển|bãi tắm|bờ biển|biển|beach) /,'ocean'],
    [/ (?:cầu|cầu treo|bridge) /,'bridge'],
    [/ (?:khu du lịch|khu nghỉ dưỡng|resort|kdl) /,'resort'],
    [/ (?:đền|miếu|đình làng|thánh thất|tòa thánh|toà thánh|thánh tịnh|linh từ) /,'shrine'],
    [/ (?:rừng|vườn quốc gia|khu bảo tồn|forest|national park) /,'forest'],
    [/ (?:bảo tàng|museum) /,'museum'],
    [/ (?:chợ|market) /,'market'],
    [/ (?:cổng|cung điện|thành cổ|thành lũy|hoàng thành|tháp cổ|cổ thành|ngọ môn|lầu|nhà cổ|kiến trúc) /,'stone']
  ];
  const placePrefixes=[
    [/^ (?:đình|am|điện thờ|phủ thờ) /,'shrine'],
    [/^ (?:mộ|lăng) /,'memorial'],[/^ (?:hang|động) /,'grotto'],
    [/^ (?:hồ|đầm|bàu|ao|lake) /,'lake'],[/^ (?:núi|đỉnh|đồi|mount) /,'peak'],
    [/^ (?:đèo|dốc đèo) /,'pass'],[/^ (?:hòn|bãi|cù lao) /,'ocean'],
    [/^ (?:vườn|vườn ươm|miệt vườn) /,'garden'],[/^ (?:sông|rạch|kênh|kinh|river) /,'stream'],
    [/^ (?:quảng trường|phố|nhà hát|hội quán|tòa thị chính|toà thị chính) /,'town']
  ];
  const faithThemes={buddhist:'buddhist',christian:'church',muslim:'mosque',
    caodaism:'caodai',vietnamese_folk:'shrine',chinese_folk:'shrine',taoist:'shrine',hindu:'shrine',folk:'shrine'};
  const fixedKinds=new Set(['Đỉnh núi','Thác nước','Hang động','Hồ','Hải đăng','Bãi biển','Vịnh','Thủy cung','Khảo cổ','Đường đèo','Phòng trưng bày','Vườn thú']);
  function pickTheme(site){
    const name=words(site.name),mapped=kindThemes[site.kind]||'post';
    const detail=window.VietnamSightDetails?.[site.catalogId||site.id];
    // A family memorial house and a Christian church can both begin “Nhà thờ”.
    if(remembered.test(name)||site.kind==='Lăng mộ')return 'memorial';
    if(family.test(name))return 'clan';
    // Primary physical features outrank namesakes such as Hồ Sao Biển and
    // Núi Chùa. Generic points, reserves and parks have richer name hints.
    if(/ (?:rồng|long vương|thần long) /.test(name))return 'dragon';
    if(/ (?:rùa|turtle) /.test(name))return 'turtle';
    if(/ (?:bạch vân|núi mây|đồi mây) /.test(name))return 'cloud';
    if(fixedKinds.has(site.kind))return mapped;
    const faith=faithThemes[detail?.religion]||religiousNames.find(([pattern])=>pattern.test(name))?.[1];
    if(faith||mapped==='shrine'){
      if(/ trúc lâm /.test(name))return 'bamboo';
      if(/ (?:liên hoa|liên trì|hoa sen) /.test(name))return 'lotus';
      if(/ ngọc /.test(name))return 'gem';
      return faith||(/^ (?:nhà thờ|hội thánh) /.test(name)?'church':'shrine');
    }
    if(/^ (?:nhà thờ|hội thánh) /.test(name))return 'church';
    for(const [pattern,theme] of signals)if(pattern.test(name))return theme;
    for(const [pattern,theme] of placePrefixes)if(pattern.test(name))return theme;
    if(mapped!=='post')return mapped;
    const town=words(site.locality||site.city);
    if(/ (?:côn đảo|lý sơn|phú quốc|cát bà|cô tô) /.test(town))return 'ocean';
    if(/ (?:mộc châu|sa pa|tam đảo|đồng văn|mèo vạc) /.test(town))return 'peak';
    if(/ (?:cái bè|cái răng|ngã năm|long xuyên|sa đéc) /.test(town))return 'quay';
    if(/ (?:hội an|hà nội|huế|hải phòng|đà nẵng|sài gòn|thủ đức|cần thơ|vinh) /.test(town))return 'town';
    return 'post';
  }
  return (site,seed)=>{
    const pass=site.id==='osm-node-1036552571'?'deo-hai-van':site.id;
    if(Object.hasOwn(passes,pass))return passes[pass].slice();
    const pool=themes[pickTheme(site)];
    const entry=pool[(seed>>>0)%pool.length];
    const origin=site.locality||site.city||site.province||site.name;
    return entry.map(line=>line.replaceAll('@',()=>origin));
  };
})();

;