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
