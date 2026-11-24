/* 120 tình huống giả định do Vi vu đất Việt tự dựng. Không sao chép bộ 120 tình huống mô phỏng chính thức.
 *
 * Mỗi dòng: sc(chương, tiêu đề, môi trường, tốc độ km/h, độ dài clip s, hazardStart s, hazardEnd s, diễn viên, lời giải thích)
 *
 * Môi trường là chuỗi từ khoá:
 *   loại đường  urban | rural | highway | mountain | national
 *   thời điểm   day | dawn | dusk | night          thời tiết  clear | rain | fog
 *   L1..L3      số làn mỗi chiều                   e1..e3     làn xe mình (1 = sát tim đường)
 *   park        có dải đỗ xe      med  có dải phân cách      zebra / zebra@9   vạch sang đường tại điểm xung đột (+ mét)
 *   jnR jnL jnX ngã ba phải / trái / ngã tư        lightG lightR   đèn tín hiệu
 *   cliffL cliffR  vách núi bên trái / phải         t0..t3     mật độ xe nền
 *   hình dạng   straight bendR bendL curveR curveL sR sL hairR hairL hairs      dốc   up down crest
 *
 * Diễn viên: hz(mẫu, loại, tham số) là mối nguy được chấm điểm; x(...) là diễn viên phụ theo mẫu;
 *   flow(loại, cách xe mình lúc đầu m, làn, km/h) chạy đều; park(loại, cách điểm xung đột m, làn) đứng yên.
 *   Làn: số (âm = chiều ngược lại), 'sh' lề/dải đỗ, 'sw' vỉa hè, 'x4.2' = lệch 4,2 m so với tim đường.
 * Điểm xung đột P là nơi xe mình sẽ tới đúng lúc hazardEnd nếu không phanh; các mẫu hành vi tự tính quỹ đạo quanh P.
 */
(function () {
  'use strict';
  var list = [], seq = {};
  var ROADS = { urban: 1, rural: 1, highway: 1, mountain: 1, national: 1 };
  var TODS = { day: 1, dawn: 1, dusk: 1, night: 1 }, WXS = { clear: 1, rain: 1, fog: 1 };
  var SHAPES = { straight: 1, bendR: 1, bendL: 1, curveR: 1, curveL: 1, sR: 1, sL: 1, hairR: 1, hairL: 1, hairs: 1 };
  function env(str) {
    var e = { road: 'urban', tod: 'day', wx: 'clear', traffic: 1, jn: [] }, lane = 1;
    str.split(/\s+/).forEach(function (k) {
      var m;
      if (ROADS[k]) e.road = k; else if (TODS[k]) e.tod = k; else if (WXS[k]) e.wx = k; else if (SHAPES[k]) e.shape = k;
      else if ((m = /^L([123])$/.exec(k))) e.lanes = +m[1];
      else if ((m = /^e([123])$/.exec(k))) lane = +m[1];
      else if ((m = /^t([0-3])$/.exec(k))) e.traffic = +m[1];
      else if (k === 'park') e.parking = true; else if (k === 'med') e.median = true;
      else if ((m = /^zebra(?:@(-?[\d.]+))?$/.exec(k))) e.zebra = m[1] ? +m[1] : 3;
      else if (k === 'jnR') e.jn.push({ side: 'R' }); else if (k === 'jnL') e.jn.push({ side: 'L' });
      else if (k === 'jnX') e.jn.push({ side: 'R', w: 12 }, { side: 'L', w: 12 });
      else if (k === 'lightG') e.light = 'green'; else if (k === 'lightR') e.light = 'red';
      else if (k === 'cliffL') e.cliff = 'L'; else if (k === 'cliffR') e.cliff = 'R';
      else if (k === 'up' || k === 'down' || k === 'crest') e.grade = k;
      else if (k) throw new Error('Từ khoá môi trường lạ: ' + k);
    });
    return { env: e, lane: lane };
  }
  function sc(ch, t, envStr, v, dur, hs, he, a, ex) {
    var p = env(envStr); seq[ch] = (seq[ch] || 0) + 1;
    list.push({ id: 'c' + ch + '-' + (seq[ch] < 10 ? '0' : '') + seq[ch], ch: ch, n: seq[ch], t: t, env: p.env, lane: p.lane, v: v, dur: dur, hazardStart: hs, hazardEnd: he, a: a, ex: ex });
  }
  function ext(o, e) { if (e) for (var k in e) o[k] = e[k]; return o; }
  function hz(tp, k, o) { return ext({ tp: tp, k: k, hz: 1 }, o); }
  function x(tp, k, o) { return ext({ tp: tp, k: k }, o); }
  function flow(k, d, lane, v, o) { return ext({ tp: 'flow', k: k, d: d, lane: lane, v: v }, o); }
  function park(k, d, lane, o) { return ext({ tp: 'park', k: k, d: d, lane: lane }, o); }

  /* ───────── Chương 1 · Đường phố đô thị (29) ───────── */
  sc(1, 'Xe máy từ hẻm bên phải lao ra', 'urban day clear L2 e2 t2', 40, 15, 7.5, 10.5,
    [hz('pullout', 'moto', { side: 'R', mode: 'join' }), flow('car', 45, 1, 44)],
    'Xe máy chạy thẳng từ hẻm ra mà không dừng quan sát; qua miệng hẻm cần giảm ga, đặt chân lên phanh và sẵn sàng dừng.');
  sc(1, 'Người đi bộ bước ra giữa hai ô tô đỗ', 'urban day clear L2 e2 park t2', 30, 15, 8, 10.6,
    [hz('cross', 'ped', { side: 'R', from: 'sh' }), park('car', -4, 'sh'), park('suv', 5.6, 'sh')],
    'Người đi bộ bị hai xe đỗ che khuất rồi bước xuống lòng đường; đi cạnh dãy xe đỗ phải chạy chậm, giữ khoảng cách ngang và phanh ngay khi thấy người ló ra.');
  sc(1, 'Ô tô đỗ sát lề bất ngờ mở cửa', 'urban day clear L2 e2 park t1', 35, 14, 7, 9.8,
    [hz('door', 'car', {}), park('van', 9, 'sh')],
    'Xe vừa đỗ còn sáng đèn phanh, người lái mở cửa bước xuống phía lòng đường; cần giữ khoảng cách ngang với xe đỗ và giảm tốc khi thấy xe vừa dừng.');
  sc(1, 'Trẻ nhỏ chạy theo quả bóng lăn ra đường', 'urban day clear L1 t1', 30, 15, 7.5, 10.5,
    [hz('cross', 'child', { side: 'R', lead: 'ball' }), park('ped', 8, 'sw')],
    'Quả bóng lăn ra đường báo trước sẽ có trẻ chạy theo; thấy bóng là phải phanh ngay chứ không chờ thấy trẻ.');
  sc(1, 'Xe buýt dừng trả khách, người vòng qua đầu xe', 'urban day clear L2 e1 t2', 35, 15, 8, 11,
    [hz('cross', 'ped', { side: 'R', from: 'x6.2' }), park('bus', -4.2, 2), park('ped', -9, 'sw'), park('ped', -6, 'sw')],
    'Khách xuống xe buýt đi vòng qua đầu xe để sang đường, bị thân xe che khuất; vượt xe buýt đang dừng phải đi chậm và sẵn sàng dừng.');
  sc(1, 'Taxi phía trước phanh gấp để đón khách', 'urban day clear L2 e2 t2', 40, 15, 7, 10,
    [hz('brake', 'taxi', { aL: 6 }), park('ped', 9, 'sw'), flow('moto', 25, 1, 38)],
    'Taxi thấy khách vẫy liền phanh gấp và tấp vào lề; luôn giữ khoảng cách an toàn với xe phía trước và phanh ngay khi đèn phanh sáng.');
  sc(1, 'Xe phía trước giảm tốc rẽ phải mà không bật xi nhan', 'urban dusk clear L2 e2 t1', 40, 15, 7, 10.2,
    [hz('brake', 'car', { aL: 4.5, to: 8, then: 'turnR' })],
    'Xe phía trước giảm tốc đột ngột để rẽ vào ngõ mà không báo hiệu; đèn phanh sáng là tín hiệu để giảm tốc theo và giữ khoảng cách.');
  sc(1, 'Ô tô vượt đèn đỏ từ đường ngang bên trái', 'urban day clear L2 e1 jnX lightG t1', 45, 14, 7, 9.8,
    [hz('pullout', 'car', { side: 'L', run: 1, vs: 20 }), flow('car', 60, 2, 40)],
    'Đèn của mình xanh nhưng ô tô ở đường ngang vẫn băng qua; đến giao lộ phải quan sát hai bên và giảm tốc, không lao qua chỉ vì đèn xanh.');
  sc(1, 'Xe máy vượt đèn đỏ từ bên phải lúc trời mưa', 'urban day rain L2 e1 jnX lightG t1', 40, 15, 7.5, 10.3,
    [hz('pullout', 'moto', { side: 'R', run: 1, vs: 15 })],
    'Trời mưa, xe máy từ đường ngang bên phải cố vượt đèn đỏ; đường trơn nên phải giảm tốc sớm trước giao lộ và phanh từ khi thấy xe không có ý dừng.');
  sc(1, 'Người đi bộ sang đường ở vạch kẻ lúc trời tối', 'urban night clear L1 zebra t1', 35, 16, 7.5, 12,
    [hz('cross', 'ped', { side: 'L' }), flow('moto', 110, -1, 30)],
    'Người đi bộ bước xuống vạch sang đường từ phía bên trái trong đêm; gần vạch kẻ đường phải giảm tốc và nhường đường.');
  sc(1, 'Xe đạp từ vỉa hè lao xuống lòng đường', 'urban day clear L2 e2 t1', 30, 15, 7, 10,
    [hz('cutin', 'bike', { side: 'R', from: 'sw', vc: 13 })],
    'Xe đạp đang đi trên vỉa hè bất ngờ lao xuống làn xe; cần quan sát cả vỉa hè, giảm tốc và giữ khoảng cách ngang khi vượt.');
  sc(1, 'Xe máy phía trước lách ổ gà sang làn ô tô', 'urban day clear L2 e1 t2', 40, 15, 8, 10.8,
    [hz('cutin', 'moto', { side: 'R', vc: 26 }), flow('moto', 55, 2, 30)],
    'Xe máy ở làn bên phải đánh lái sang trái để tránh ổ gà mà không nhìn gương; đi song song xe hai bánh phải dự phòng họ đổi hướng.');
  sc(1, 'Ô tô đang đỗ bên phải bất ngờ quay đầu', 'urban day clear L1 park t1', 35, 15, 7, 10,
    [hz('uturn', 'car', {}), park('car', -14, 'sh'), park('van', 16, 'sh')],
    'Xe đỗ bật xi nhan trái rồi quay đầu chắn ngang đường; thấy xe đỗ nhá đèn, bánh lái đánh ra là phải giảm tốc và sẵn sàng dừng.');
  sc(1, 'Xe tải nhỏ lùi ra từ cổng nhà', 'urban day clear L1 t1', 30, 15, 7.5, 10.5,
    [hz('reverse', 'van', { side: 'R' })],
    'Xe tải nhỏ lùi ra đường, người lái không nhìn thấy phía sau; thấy đèn lùi sáng phải giảm tốc, dừng lại nhường và bấm còi báo hiệu.');
  sc(1, 'Ô tô ngược chiều lấn làn để vượt xe buýt đang dừng', 'urban day clear L1 t0', 35, 15, 7, 10,
    [hz('oncoming', 'car', { vo: 30, victim: { k: 'bus', v: 0 } })],
    'Xe ngược chiều lấn sang làn của mình để vượt xe buýt đang dừng; cần giảm tốc, đi sát bên phải và dừng lại nếu không đủ chỗ.');
  sc(1, 'Thùng hàng rơi từ xe ba gác phía trước', 'urban day clear L1 t1', 30, 15, 8, 11,
    [hz('fall', 'bagac', { obj: 'box' })],
    'Hàng chằng buộc lỏng rơi khỏi xe ba gác; không bám sát xe chở hàng cồng kềnh và phanh ngay khi thấy hàng xô lệch.');
  sc(1, 'Chó chạy ngang đường lúc chạng vạng', 'urban dusk clear L1 t1', 35, 14, 8, 10.6,
    [hz('cross', 'dog', { side: 'L' })],
    'Con chó từ bên trái lao qua đường khi trời nhá nhem; giảm tốc, giữ thẳng lái và phanh, không đánh lái gấp sang làn khác.');
  sc(1, 'Xe máy đi ngược chiều sát lề rồi lấn vào làn', 'urban day clear L2 e2 t1', 35, 15, 7.5, 10.5,
    [hz('oncoming', 'moto', { vo: 22, from: 'x6.3' })],
    'Xe máy đi ngược chiều sát lề phải rồi lấn vào làn để tránh chướng ngại; phải giảm tốc, nhường khoảng trống và sẵn sàng dừng.');
  sc(1, 'Ô tô từ bãi đỗ bên trái rẽ ngang đầu xe', 'urban day clear L1 t0', 35, 15, 7, 10.2,
    [hz('pullout', 'car', { side: 'L', mode: 'join' })],
    'Ô tô từ bãi đỗ bên trái cắt qua làn ngược chiều để nhập vào làn của mình; thấy xe nhô đầu ra là phải giảm tốc, nhường khi cần.');
  sc(1, 'Người đẩy xe hàng rong băng qua đường', 'urban day clear L1 t1', 30, 16, 7, 11.5,
    [hz('cross', 'cart', { side: 'R' }), flow('moto', 120, -1, 28)],
    'Người bán hàng rong đẩy xe chậm rãi băng qua đường; phải giảm tốc và dừng lại nhường, không cố lách qua trước mặt.');
  sc(1, 'Học sinh ùa ra trước cổng trường', 'urban day clear L1 zebra t1', 25, 15, 7, 9.8,
    [hz('cross', 'child', { side: 'R', n: 3 }), park('ped', -6, 'sw'), park('child', 8, 'sw')],
    'Giờ tan học, học sinh chạy thành nhóm qua đường; qua khu vực trường học phải đi thật chậm và dừng hẳn khi có trẻ bước xuống.');
  sc(1, 'Xe máy vượt bên trái rồi tạt đầu', 'urban day clear L2 e2 t1', 35, 15, 7.5, 10.3,
    [hz('cutin', 'moto', { side: 'L', vPre: 50, vc: 22 })],
    'Xe máy vượt lên từ bên trái rồi tạt vào ngay trước đầu xe và giảm tốc; cần nhả ga, tạo lại khoảng cách và không tăng tốc ganh đua.');
  sc(1, 'Mưa lớn, xe phía trước dừng đột ngột trước đoạn ngập', 'urban day rain L2 e1 t1', 35, 15, 8, 11,
    [hz('brake', 'suv', { aL: 5 })],
    'Xe phía trước gặp đoạn ngập nên phanh gấp; trời mưa quãng đường phanh dài hơn, cần giữ khoảng cách gấp đôi bình thường.');
  sc(1, 'Người đi bộ lao ra từ sau xe tải đang đỗ trong đêm', 'urban night clear L2 e2 park t1', 30, 15, 8, 10.5,
    [hz('cross', 'ped', { side: 'R', from: 'sh' }), park('truck', -5.6, 'sh')],
    'Người đi bộ bị xe tải đỗ che khuất, bước ra trong vùng tối; ban đêm đi cạnh xe lớn đang đỗ phải giảm tốc và giữ khoảng cách ngang.');
  sc(1, 'Xe phía trước dừng nhường người đi bộ ở vạch sang đường', 'urban day clear L2 e1 zebra@9.5 t2', 40, 15, 7, 10.2,
    [hz('brake', 'car', { aL: 5, then: 'go', hold: 2.5 }), x('cross', 'ped', { side: 'R', ds: 6.8, from: 'x6.4' })],
    'Xe phía trước phanh dừng để nhường người đi bộ; khi xe trước giảm tốc gần vạch sang đường, phải giảm theo và tuyệt đối không vượt.');
  sc(1, 'Xe máy ngược chiều rẽ trái cắt ngang đầu xe ở ngã tư', 'urban day clear L1 jnX t1', 35, 15, 7.5, 10.5,
    [hz('oncoming', 'moto', { vo: 18, back: 'turn' })],
    'Xe máy ngược chiều rẽ trái cắt ngang mà không nhường xe đi thẳng; đến ngã tư cần giảm tốc và theo dõi xe ngược chiều đang bật xi nhan.');
  sc(1, 'Xe buýt rời trạm tạt vào làn', 'urban day clear L2 e1 t1', 40, 16, 8, 11.5,
    [hz('cutin', 'bus', { side: 'R', vPre: 6, vc: 16, sig: 1 }), park('ped', -20, 'sw')],
    'Xe buýt rời trạm và chuyển ngay sang làn trong với tốc độ thấp; thấy xe buýt nhá xi nhan trái thì giảm tốc nhường cho xe ra.');
  sc(1, 'Sương mù sáng sớm, xe máy hỏng dừng giữa làn', 'urban dawn fog L2 e2 t0', 30, 16, 8, 11.5,
    [hz('obstacle', 'moto', { with: 'ped' })],
    'Xe máy chết máy nằm giữa làn chỉ hiện ra khi tới gần vì sương mù; phải chạy với tốc độ dừng được trong tầm nhìn và bật đèn chiếu gần.');
  sc(1, 'Ô tô lùi khỏi chỗ đỗ trước cửa hàng trong đêm mưa', 'urban night rain L2 e2 t1', 30, 15, 7.5, 10.5,
    [hz('reverse', 'car', { side: 'R' })],
    'Ô tô lùi từ chỗ đỗ ra làn xe trong đêm mưa, tầm nhìn của cả hai xe đều kém; thấy đèn lùi trắng sáng phải giảm tốc và dừng nhường.');

  /* ───────── Chương 2 · Đường ngoại thành ban đêm, quanh co (14) ───────── */
  sc(2, 'Trâu băng qua đường ngay sau khúc cua phải', 'rural night clear bendR t0', 40, 17, 9, 13,
    [hz('cross', 'cow', { side: 'R' })],
    'Con trâu thả rông đi ra giữa đường ngay sau khúc cua; ban đêm vào cua phải giảm tốc để dừng được trong tầm đèn chiếu.');
  sc(2, 'Xe máy không đèn đi ngược chiều sát lề', 'rural night clear curveL t0', 45, 15, 8, 11,
    [hz('oncoming', 'moto', { vo: 25, from: 'sh', nolight: 1 })],
    'Xe máy không bật đèn đi ngược chiều sát lề phải rồi lấn vào làn; trong đêm phải quan sát xa, giảm tốc khi thấy bóng xe không đèn.');
  sc(2, 'Ô tô ngược chiều lấn làn khi ôm cua trái', 'rural night clear curveL t0', 50, 15, 8.5, 11.5,
    [hz('oncoming', 'car', { vo: 50 })],
    'Xe ngược chiều cắt cua lấn qua vạch tim đường; vào cua khuất tầm nhìn phải đi sát bên phải làn và giảm tốc.');
  sc(2, 'Người đi bộ từ lề bước xuống lòng đường trong đêm', 'rural night clear sR t0', 45, 15, 8, 11,
    [hz('cutin', 'ped', { side: 'R', from: 'sh', vc: 5 })],
    'Người đi bộ mặc đồ tối màu từ lề bước xuống mặt đường; đường quê không đèn phải dùng đèn hợp lý, giảm tốc và đi cách xa lề.');
  sc(2, 'Xe tải chết máy không đèn cảnh báo sau khúc cua trái', 'rural night clear bendL t0', 45, 16, 8.5, 12,
    [hz('obstacle', 'truck', { nolight: 1 })],
    'Xe tải hỏng dừng trong làn mà không có đèn hay biển cảnh báo; ra khỏi khúc cua thấy vật tối phía trước phải phanh ngay.');
  sc(2, 'Xe đạp không đèn bất ngờ tạt ra giữa đường', 'rural dusk clear curveR t1', 40, 15, 8, 11,
    [hz('cutin', 'bike', { side: 'R', from: 'sh', vc: 12, thru: -1, nolight: 1 })],
    'Xe đạp đi sát lề bất ngờ chuyển hướng sang trái để rẽ; vượt xe đạp phải giảm tốc, báo hiệu và giữ khoảng cách ngang rộng.');
  sc(2, 'Hai con chó đuổi nhau chạy qua đường làng', 'rural night clear sR t0', 40, 16, 9, 11.6,
    [hz('cross', 'dog', { side: 'R', n: 2 })],
    'Hai con chó nối nhau lao qua đường; thấy một con vật chạy ra phải nghĩ ngay còn con thứ hai phía sau và phanh giảm tốc.');
  sc(2, 'Xe ba gác từ đường đất bên phải ra đường nhựa', 'rural night clear sL t0', 45, 16, 8, 11.5,
    [hz('pullout', 'bagac', { side: 'R', mode: 'join', vj: 20 })],
    'Xe ba gác chạy chậm từ đường đất ra và nhập ngay vào làn; qua các lối rẽ ban đêm phải giảm tốc và chú ý ánh đèn từ đường nhánh.');
  sc(2, 'Trời mưa, xe con ngược chiều vượt xe tải ở đoạn cua', 'rural night rain curveR t0', 50, 15, 8, 11.2,
    [hz('oncoming', 'car', { vo: 60, victim: { k: 'truck', v: 35 } })],
    'Xe con ngược chiều vượt xe tải ngay đoạn cua trong mưa; thấy hai cặp đèn song song phải phanh và nép phải nhường đường.');
  sc(2, 'Sương mù dày, xe phía trước phanh gấp', 'rural night fog curveL t0', 40, 15, 8, 11,
    [hz('brake', 'car', { aL: 6 })],
    'Trong sương mù xe phía trước phanh gấp; phải giữ khoảng cách lớn, bật đèn sương mù hoặc đèn chiếu gần và phanh ngay khi đèn phanh xe trước sáng.');
  sc(2, 'Cây đổ chắn đường sau cơn mưa đêm', 'rural night rain sL t0', 40, 17, 9, 12.5,
    [hz('obstacle', 'tree', {})],
    'Thân cây đổ nằm chắn làn xe; sau mưa bão phải chạy chậm, nhìn xa theo tầm đèn và dừng lại trước chướng ngại.');
  sc(2, 'Xe máy từ sân nhà bên trái vọt ra lúc nhá nhem', 'rural dusk clear bendR t1', 45, 15, 8, 11,
    [hz('pullout', 'moto', { side: 'L', mode: 'join' })],
    'Xe máy từ sân nhà bên trái băng qua làn ngược chiều để nhập vào làn của mình; qua khu dân cư phải giảm tốc và quan sát cả hai bên.');
  sc(2, 'Người đi xe đạp chậm rãi băng qua đoạn đường tối', 'rural night clear curveR t0', 40, 16, 8, 11.5,
    [hz('cross', 'bike', { side: 'R' })],
    'Xe đạp không đèn băng ngang đường ở đoạn không có chiếu sáng; phải giảm tốc và dừng nhường, không bấm còi thúc giục.');
  sc(2, 'Xe khách ngược chiều bật pha chói mắt rồi lấn làn', 'rural night clear sR t0', 50, 15, 8, 11,
    [hz('oncoming', 'bus', { vo: 50, hi: 1 })],
    'Bị đèn pha xe ngược chiều làm chói, lại thêm xe đó lấn làn; phải giảm tốc, nhìn chếch về mép đường bên phải và nép sát lề.');

  /* ───────── Chương 3 · Đường cao tốc (20) ───────── */
  sc(3, 'Xe tải chuyển làn đột ngột không xi nhan', 'highway day clear L2 e1 t2', 100, 16, 8, 11.5,
    [hz('cutin', 'truck', { side: 'R', vc: 65 })],
    'Xe tải chạy chậm ở làn phải bất ngờ lấn sang làn vượt; khi vượt xe tải phải dự phòng xe chuyển làn, nhả ga và phanh sớm.');
  sc(3, 'Xe con vượt bên phải rồi tạt đầu phanh lại', 'highway day clear L2 e1 t1', 90, 15, 8, 11,
    [hz('cutin', 'car', { side: 'R', vPre: 115, vc: 70, after: 60 })],
    'Xe con vượt phải rồi tạt vào sát đầu xe và giảm tốc; phải nhả ga, phanh để tạo lại khoảng cách an toàn.');
  sc(3, 'Xe phía trước phanh gấp vì ùn tắc', 'highway day clear L2 e2 t1', 90, 16, 8, 12,
    [hz('brake', 'car', { aL: 7 }), park('truck', 13, 2), park('car', 23, 2), park('suv', 11, 1), park('car', 18.5, 1), park('van', 26, 1)],
    'Dòng xe phía trước dừng lại vì ùn tắc; thấy đèn phanh sáng hàng loạt phải phanh sớm, bật đèn khẩn cấp cảnh báo xe sau.');
  sc(3, 'Lốp xe tải văng ra giữa làn', 'highway day clear L2 e2 t1', 90, 16, 8, 11.5,
    [hz('fall', 'flatbed', { obj: 'tyre', vt: 80, fr: 5 })],
    'Chiếc lốp dự phòng tuột khỏi xe tải và lăn trong làn; giữ khoảng cách xa với xe tải, phanh giảm tốc chứ không đánh lái gấp.');
  sc(3, 'Xe chết máy dừng ở làn sát dải phân cách trong đêm', 'highway night clear L2 e1 t1', 100, 17, 8, 12.5,
    [hz('obstacle', 'car', { hazl: 1 })],
    'Xe hỏng dừng ngay trong làn vượt, chỉ có đèn khẩn cấp nhấp nháy; thấy đèn nháy phía trước phải giảm tốc ngay và chuyển làn khi an toàn.');
  sc(3, 'Xe khách từ làn dừng khẩn cấp nhập làn với tốc độ thấp', 'highway day clear L2 e2 t1', 90, 16, 8, 12,
    [hz('cutin', 'bus', { side: 'R', from: 'sh', vPre: 25, vc: 45, sig: 1 })],
    'Xe khách từ làn dừng khẩn cấp lấn vào làn xe chạy khi tốc độ còn rất thấp; thấy xe trên làn khẩn cấp lăn bánh phải giảm tốc sớm.');
  sc(3, 'Xe con lỡ lối ra, lùi trên làn khẩn cấp rồi lấn vào làn', 'highway day clear L2 e2 t1', 80, 16, 8, 12,
    [hz('oncoming', 'car', { vo: 8, from: 'sh', rev: 1, stop: 1 })],
    'Xe lỡ lối ra đang lùi ngược lại và lấn vào làn xe chạy; thấy đèn lùi trên cao tốc phải giảm tốc mạnh và giữ khoảng cách.');
  sc(3, 'Sương mù, xe tải phía trước giảm tốc đột ngột', 'highway dawn fog L2 e2 t0', 80, 16, 8, 12,
    [hz('brake', 'truck', { aL: 5, to: 20, then: 'go' })],
    'Trong sương mù xe tải phía trước giảm tốc mạnh; phải giảm tốc độ, giữ khoảng cách theo tầm nhìn và không bám đuôi.');
  sc(3, 'Mưa to, xe phía trước trượt ngang khi phanh', 'highway day rain L2 e1 t1', 90, 16, 8, 11.8,
    [hz('brake', 'car', { aL: 6, then: 'skid' })],
    'Mặt đường đọng nước làm xe phía trước trượt ngang khi phanh; trời mưa phải giảm tốc, giữ khoảng cách dài và phanh nhẹ nhàng từ sớm.');
  sc(3, 'Người từ xe hỏng bước ra làn xe chạy', 'highway day clear L2 e2 t1', 80, 15, 8, 10.8,
    [hz('cross', 'ped', { side: 'R', from: 'x8.7', to: 'x4.6' }), park('car', 2.6, 'sh', { hazl: 1 })],
    'Người lái xe hỏng bước ra khỏi làn khẩn cấp vào làn xe chạy; thấy xe dừng trên làn khẩn cấp phải giảm tốc và chuyển làn ra xa nếu được.');
  sc(3, 'Chó chạy ngang qua đường cao tốc', 'highway day clear L2 e2 t1', 90, 15, 8, 10.6,
    [hz('cross', 'dog', { side: 'R', to: 'x1.6' })],
    'Con chó lạc vào đường cao tốc và chạy cắt ngang; phanh giảm tốc, giữ thẳng lái, không đánh lái gấp ở tốc độ cao.');
  sc(3, 'Xe container lấn làn trong đoạn đường cong', 'highway day clear L2 e2 curveR t1', 90, 16, 8, 11.5,
    [hz('cutin', 'container', { side: 'L', vc: 70 })],
    'Xe container ở làn trái văng đuôi lấn sang làn của mình trong đoạn cong; không chạy song song lâu với xe dài, giảm tốc để lùi lại phía sau.');
  sc(3, 'Công trường sửa đường chắn làn ngoài cùng', 'highway day clear L2 e2 t1', 80, 17, 8, 12.5,
    [hz('obstacle', 'cone', { n: 5, sp: 2.2 }), park('flatbed', 22, 2), park('worker', 15, 'x8.2')],
    'Làn đang chạy bị rào để sửa đường; thấy chóp nón và xe công trình phải giảm tốc, bật xi nhan và chuyển làn sớm.');
  sc(3, 'Xe phía trước đánh lái tránh, lộ ra thùng hàng giữa làn', 'highway day clear L2 e1 t0', 100, 16, 8, 11.5,
    [hz('obstacle', 'box', { n: 1, sp: 1.5 }), flow('car', 32, 1, 100, { lk: [-0.6, 1.2, 2] })],
    'Xe phía trước chuyển làn gấp để tránh thùng hàng rơi trên đường; khi xe trước đột ngột đánh lái phải phanh ngay vì có vật cản phía trước.');
  sc(3, 'Sương mù, xe máy đi ngược chiều sát dải phân cách', 'highway day fog L2 e1 t0', 80, 15, 8, 11.5,
    [hz('oncoming', 'moto', { vo: 30, from: 1, esc: 'x1.5' })],
    'Xe máy đi nhầm vào cao tốc và chạy ngược chiều trong sương mù; phải giảm tốc mạnh, nép sang phải và bấm còi, nháy đèn cảnh báo.');
  sc(3, 'Xe con phanh gấp cắt ngang làn để kịp lối ra', 'highway day clear L3 e3 t1', 90, 15, 8, 11,
    [hz('cutin', 'car', { side: 'L', vPre: 100, vc: 55, thru: 'sh' })],
    'Xe con cắt ngang các làn và phanh gấp để kịp lối ra; gần lối ra phải chú ý xe làn trong và sẵn sàng giảm tốc.');
  sc(3, 'Xe tải phía trước nổ lốp, đảo lái', 'highway day clear L2 e2 t1', 80, 16, 8, 12,
    [hz('brake', 'truck', { aL: 4.5, to: 15, then: 'skid' })],
    'Xe tải nổ lốp, lảo đảo và giảm tốc nhanh; phải phanh sớm, giữ khoảng cách và không vượt khi xe phía trước đang mất ổn định.');
  sc(3, 'Đêm mưa, xe dừng thay lốp lấn một phần làn phải', 'highway night rain L2 e2 t0', 80, 17, 8, 12.5,
    [hz('obstacle', 'car', { lane: 'x8.3', hazl: 1, with: 'ped' })],
    'Xe dừng thay lốp lấn vào làn phải, người đứng cạnh xe; đêm mưa thấy đèn khẩn cấp phải giảm tốc và chuyển sang làn trái khi an toàn.');
  sc(3, 'Xe con nhập làn từ đường dẫn với tốc độ thấp', 'highway dawn clear L3 e3 t1', 90, 16, 8, 12,
    [hz('cutin', 'car', { side: 'R', from: 'sh', vPre: 40, vc: 55, sig: 1 })],
    'Xe con nhập vào cao tốc khi chưa tăng đủ tốc độ; thấy xe trên làn tăng tốc phải giảm ga hoặc chuyển làn trái để nhường.');
  sc(3, 'Hai xe phía trước va chạm rồi dừng giữa làn', 'highway dusk clear L2 e1 t1', 100, 16, 8, 12,
    [hz('brake', 'suv', { aL: 8.5 }), park('car', 9.8, 1, { face: 25, hazl: 1 })],
    'Xe phía trước đâm vào xe đang dừng rồi đứng lại giữa làn; phải phanh hết lực ngay khi thấy đèn phanh và bật đèn khẩn cấp.');

  /* ───────── Chương 4 · Đường đèo núi (10) ───────── */
  sc(4, 'Xe tải đổ đèo lấn làn ở cua tay áo', 'mountain day clear hairR cliffR t0', 32, 17, 10, 13,
    [hz('oncoming', 'truck', { vo: 28 })],
    'Xe tải dài phải mở rộng vòng cua nên lấn sang làn của mình; vào cua tay áo phải bấm còi, đi chậm và dừng trước cua nhường xe lớn.');
  sc(4, 'Đá lở nằm giữa làn sau khúc cua khuất', 'mountain day clear hairL cliffL t0', 32, 17, 10, 13.2,
    [hz('obstacle', 'rock', { n: 2, sp: 2.4 })],
    'Đá từ vách núi rơi xuống nằm trong làn ngay sau cua; đường đèo phải chạy với tốc độ dừng được trong đoạn nhìn thấy.');
  sc(4, 'Xe máy vượt xe khách ngược chiều ngay trong cua', 'mountain day clear sR cliffL t0', 35, 16, 9, 12,
    [hz('oncoming', 'moto', { vo: 45, victim: { k: 'bus', v: 25 } })],
    'Xe máy vượt xe khách đang đổ đèo và lao sang làn của mình; phải phanh, nép sát phải để chừa lối cho xe máy trở về làn.');
  sc(4, 'Sương mù trên đèo, xe phía trước dừng đột ngột', 'mountain day fog sL cliffR up t0', 30, 16, 9, 12,
    [hz('brake', 'van', { aL: 5 })],
    'Sương mù dày, xe phía trước dừng lại đột ngột; lên đèo trong sương phải bật đèn, đi chậm và giữ khoảng cách đủ dừng.');
  sc(4, 'Bò thả rông băng qua đường đèo', 'mountain day clear curveL cliffL t0', 35, 17, 9, 13,
    [hz('cross', 'cow', { side: 'L', from: '-sh', to: 'x3.3', n: 2, gap: 1.6 })],
    'Đàn bò từ chân vách núi đi ra giữa đường; phải giảm tốc, dừng chờ gia súc qua hết, không bấm còi làm chúng hoảng.');
  sc(4, 'Xe khách đổ dốc vượt xe tải, lấn hết làn', 'mountain dusk clear curveR cliffR down t0', 35, 16, 9, 12.2,
    [hz('oncoming', 'bus', { vo: 40, victim: { k: 'truck', v: 20 } })],
    'Xe khách vượt xe tải trên đoạn dốc và chiếm trọn làn của mình; phải phanh mạnh, nép sát phải và dừng nếu cần.');
  sc(4, 'Khúc gỗ rơi từ xe tải đang leo dốc', 'mountain day clear sR cliffL up t0', 30, 16, 9, 12,
    [hz('fall', 'flatbed', { obj: 'log', vt: 28 })],
    'Khúc gỗ tuột khỏi thùng xe tải và lăn về phía sau trên dốc; leo dốc sau xe chở gỗ phải giữ khoảng cách thật xa.');
  sc(4, 'Người chụp ảnh lùi ra giữa đường đèo', 'mountain day clear curveL cliffL t0', 30, 16, 9, 12,
    [hz('cross', 'ped', { side: 'R', from: 'sh', to: 'x0.9' }), park('moto', 4.5, 'sh'), park('ped', 7, 'sh')],
    'Du khách mải chụp ảnh lùi dần ra lòng đường; thấy người và xe dừng ở điểm ngắm cảnh phải giảm tốc, bấm còi báo hiệu.');
  sc(4, 'Trời mưa, xe máy ngược chiều trượt ngã văng sang làn', 'mountain day rain sL cliffR t0', 32, 16, 9, 12,
    [hz('oncoming', 'moto', { vo: 35, stop: 1, fallen: 1, back: false })],
    'Xe máy đổ đèo trượt bánh trên mặt đường ướt và ngã văng sang làn của mình; phải phanh dừng ngay, không cố lách qua.');
  sc(4, 'Xe tải hỏng dừng ngay sau cua tay áo lúc chiều tối', 'mountain dusk clear hairR cliffR t0', 30, 18, 10, 13.5,
    [hz('obstacle', 'truck', { hazl: 1, with: 'ped' })],
    'Xe tải hỏng đỗ ngay sau cua khuất tầm nhìn; vào cua tay áo phải đi chậm, sẵn sàng dừng và chỉ vượt khi nhìn rõ phía trước.');

  /* ───────── Chương 5 · Quốc lộ (17) ───────── */
  sc(5, 'Xe khách đón khách dọc đường rồi tạt ra', 'national day clear L2 e2 t2', 60, 16, 8, 12,
    [hz('cutin', 'bus', { side: 'R', from: 'sh', vPre: 5, vc: 22 }), park('ped', -30, 'sw')],
    'Xe khách vừa đón khách xong liền tạt ra làn mà không nhường; thấy xe khách dừng bên lề có khách lên xuống phải giảm tốc dự phòng.');
  sc(5, 'Xe máy chở hàng cồng kềnh sang đường không quan sát', 'national day clear L2 e2 t1', 55, 15, 8, 11,
    [hz('cutin', 'moto', { side: 'R', from: 'sh', vc: 22, thru: -1 })],
    'Xe máy chở hàng che khuất gương, tạt từ lề sang trái để qua đường; phải giảm tốc, bấm còi báo và không vượt khi xe hai bánh có dấu hiệu chuyển hướng.');
  sc(5, 'Xe tải từ trạm xăng bên phải chạy ra', 'national day clear L2 e2 t1', 60, 16, 8, 11.5,
    [hz('pullout', 'truck', { side: 'R', mode: 'join', acc: 1.8 })],
    'Xe tải từ trạm xăng chạy ra nhập làn với tốc độ rất chậm; qua lối ra vào cây xăng phải giảm tốc và sẵn sàng nhường.');
  sc(5, 'Xe con ngược chiều vượt xe tải, lấn sang làn', 'national day clear L1 t1', 60, 15, 8, 11,
    [hz('oncoming', 'car', { vo: 75, victim: { k: 'truck', v: 45 } })],
    'Xe con ngược chiều vượt xe tải khi không đủ khoảng trống; phải phanh giảm tốc, nép vào lề phải để tạo lối thoát cho cả hai.');
  sc(5, 'Xe container phía trước phanh gấp', 'national day clear L2 e2 t1', 60, 16, 8, 11.5,
    [hz('brake', 'container', { aL: 5.5 })],
    'Xe container che hết tầm nhìn rồi phanh gấp; đi sau xe lớn phải giữ khoảng cách xa hơn để nhìn được phía trước và kịp dừng.');
  sc(5, 'Học sinh băng qua quốc lộ trước cổng trường', 'national day clear L2 e2 zebra t1', 50, 15, 8, 11,
    [hz('cross', 'child', { side: 'R', n: 2 }), park('child', -5, 'sw'), park('ped', 7, 'sw')],
    'Học sinh chạy qua quốc lộ lúc tan trường; qua khu vực trường học phải giảm tốc dưới mức biển báo và dừng nhường.');
  sc(5, 'Xe máy rẽ trái từ làn ngoài cùng', 'national day clear L2 e1 t1', 60, 15, 8, 11,
    [hz('cutin', 'moto', { side: 'R', vc: 28, thru: -1 })],
    'Xe máy từ làn ngoài cắt ngang sang trái để rẽ mà không xi nhan; khi vượt xe máy gần lối rẽ phải giảm tốc và bấm còi báo.');
  sc(5, 'Xe ba gác chạy chậm không đèn lúc chạng vạng', 'national dusk clear L1 t0', 60, 16, 8, 12,
    [hz('brake', 'bagac', { vL: 15, to: 15, nolight: 1 })],
    'Xe ba gác chạy rất chậm, không đèn, lẫn vào nền trời tối; khoảng cách thu hẹp rất nhanh nên phải giảm tốc ngay khi phát hiện.');
  sc(5, 'Ô tô từ đường nhánh bên trái băng qua quốc lộ', 'national day clear L1 t1', 60, 15, 8, 11,
    [hz('pullout', 'car', { side: 'L', mode: 'cross' })],
    'Ô tô từ đường nhánh băng ngang quốc lộ mà không nhường xe trên đường chính; đến nơi giao nhau phải giảm tốc và quan sát đường nhánh.');
  sc(5, 'Xe đạp điện đi sát lề bất ngờ lấn vào làn', 'national day clear L1 t1', 55, 15, 8, 11,
    [hz('cutin', 'bike', { side: 'R', from: 'sh', vc: 18 })],
    'Học sinh đi xe đạp điện đang sát lề thì lấn ra làn ô tô; vượt xe hai bánh phải giảm tốc và giữ khoảng cách ngang tối thiểu một mét rưỡi.');
  sc(5, 'Người bước ra từ đầu xe tải đỗ bên lề', 'national day clear L2 e2 t1', 55, 15, 8, 10.6,
    [hz('cross', 'ped', { side: 'R', from: 'x7.3' }), park('truck', -5.6, 'sh')],
    'Tài xế xe tải đỗ bên lề bước vòng qua đầu xe ra đường; đi ngang xe lớn đang đỗ phải giảm tốc và tránh xa một khoảng.');
  sc(5, 'Xe con làn phải lấn sang để tránh xe tải đỗ trong đêm', 'national night clear L2 e1 t0', 60, 15, 8, 11,
    [hz('cutin', 'car', { side: 'R', vc: 40 }), park('truck', 26, 2, { hazl: 1 })],
    'Xe ở làn phải gặp xe tải đỗ nên lấn sang làn của mình; thấy chướng ngại ở làn bên phải nghĩ ngay xe làn đó sẽ chuyển làn.');
  sc(5, 'Đàn bò băng qua quốc lộ lúc chiều muộn', 'national dusk clear L1 t0', 55, 17, 8, 12,
    [hz('cross', 'cow', { side: 'R', n: 3, gap: 1.5 })],
    'Đàn bò nối nhau đi qua quốc lộ; phải giảm tốc từ xa, dừng chờ cả đàn qua hết rồi mới đi tiếp.');
  sc(5, 'Xe máy dừng bên lề bất ngờ quay đầu', 'national day clear L1 t1', 55, 15, 8, 11,
    [hz('uturn', 'moto', {})],
    'Xe máy đang dừng bên lề bất ngờ quay đầu cắt ngang đường; thấy xe hai bánh dừng ở lề với bánh trước hướng ra phải giảm tốc dự phòng.');
  sc(5, 'Mưa to, xe phía trước trượt bánh khi phanh gấp', 'national day rain L2 e1 t1', 60, 16, 8, 11.5,
    [hz('brake', 'pickup', { aL: 5.5, then: 'skid' })],
    'Xe bán tải phía trước phanh gấp trên đường ướt và trượt lệch; trời mưa phải giảm tốc, tăng khoảng cách và phanh sớm, đều chân.');
  sc(5, 'Xe khách ngược chiều lấn hẳn sang làn để tránh ổ gà ban đêm', 'national night clear L1 t0', 60, 15, 8, 11,
    [hz('oncoming', 'bus', { vo: 55 })],
    'Xe khách ngược chiều đánh lái tránh ổ gà và lấn sang làn của mình; ban đêm thấy đèn xe lệch sang phần đường mình phải phanh và nép phải.');
  sc(5, 'Thùng hàng rơi từ xe bán tải phía trước', 'national day clear L2 e1 t1', 70, 16, 8, 11.5,
    [hz('fall', 'pickup', { obj: 'box' })],
    'Thùng hàng không chằng buộc rơi khỏi thùng xe bán tải; giữ khoảng cách với xe chở hàng hở và phanh giảm tốc khi thấy hàng rơi.');

  /* ───────── Chương 6 · Tình huống hỗn hợp, dễ xảy ra va chạm (30) ───────── */
  sc(6, 'Xe máy vượt phải rồi rẽ trái trước đầu xe', 'urban day clear L2 e1 t1', 35, 15, 7.5, 10.5,
    [hz('cutin', 'moto', { side: 'R', vPre: 48, vc: 20, thru: -1, sig: 1 })],
    'Xe máy vượt lên bên phải rồi cắt ngang đầu xe để rẽ trái; phải nhả ga, phanh nhường và theo dõi gương phải khi đi trong phố.');
  sc(6, 'Người che ô băng qua đường trong đêm mưa', 'urban night rain L1 t1', 30, 16, 8, 12.5,
    [hz('cross', 'ped', { side: 'L', umbrella: 1 })],
    'Người đi bộ che ô nên không quan sát được xe, băng qua trong đêm mưa; phải giảm tốc và dừng nhường, tránh té nước vào người đi bộ.');
  sc(6, 'Xe máy từ dốc đê lao xuống cắt ngang đường', 'rural day clear L1 t1', 50, 15, 8, 10.8,
    [hz('pullout', 'moto', { side: 'R', run: 1, vs: 18 })],
    'Xe máy từ đường đê lao xuống và băng ngang mà không giảm tốc; qua các lối nhỏ ven đê phải giảm tốc và quan sát từ xa.');
  sc(6, 'Xe con chuyển liền hai làn tạt đầu', 'highway dusk clear L3 e3 t1', 90, 15, 8, 11.5,
    [hz('cutin', 'car', { side: 'L', from: 1, vPre: 105, vc: 72, tl: .8 })],
    'Xe con cắt liền hai làn từ làn trong cùng sang sát đầu xe; phải nhả ga, phanh nhẹ để giữ khoảng cách và không bám sát.');
  sc(6, 'Xe con ngược chiều cắt cua tay áo', 'mountain day clear hairL cliffL t0', 30, 17, 10, 13,
    [hz('oncoming', 'car', { vo: 32 })],
    'Xe con ngược chiều cắt cua lấn sang làn của mình; vào cua tay áo phải bấm còi, bám sát bên phải và đi chậm.');
  sc(6, 'Xe tải đỗ không đèn lấn làn trên quốc lộ ban đêm', 'national night clear L2 e2 t0', 60, 16, 8, 12,
    [hz('obstacle', 'truck', { nolight: 1 })],
    'Xe tải đỗ lấn làn mà không có đèn cảnh báo; ban đêm phải chạy với tốc độ dừng được trong tầm đèn chiếu gần.');
  sc(6, 'Xe phía trước phanh gấp khi đèn vừa chuyển đỏ', 'urban day clear L2 e2 jnX lightR t1', 45, 15, 7, 10.2,
    [hz('brake', 'car', { aL: 6.5 }), flow('moto', 30, 1, 40)],
    'Xe phía trước phanh dừng hẳn khi đèn chuyển đỏ; đến gần giao lộ có đèn phải nhả ga sớm và giữ khoảng cách đủ dừng.');
  sc(6, 'Xe máy lạng lách cắt ngang hai làn', 'urban day clear L2 e2 t2', 40, 15, 7.5, 10.3,
    [hz('cutin', 'moto', { side: 'L', vPre: 55, vc: 28, thru: 'sh' })],
    'Xe máy lạng lách từ làn trái cắt ngang đầu xe để tấp vào lề; phải nhả ga, giữ thẳng lái và nhường cho xe đó đi qua.');
  sc(6, 'Xe đạp chở cỏ đi giữa đường trong sương sớm', 'rural dawn fog L1 t0', 45, 16, 8, 12,
    [hz('brake', 'bike', { vL: 10, to: 10 })],
    'Xe đạp chở cỏ cồng kềnh đi chậm giữa làn, chỉ hiện ra khi tới gần; trong sương mù phải giảm tốc và giữ tầm dừng an toàn.');
  sc(6, 'Trời mưa, ô tô ngược chiều lấn làn vượt xe máy', 'national day rain L1 t1', 55, 15, 8, 11,
    [hz('oncoming', 'car', { vo: 60, victim: { k: 'moto', v: 30 } })],
    'Ô tô ngược chiều lấn sang làn của mình để vượt xe máy khi trời mưa; phải phanh sớm trên đường ướt và nép sang phải.');
  sc(6, 'Ô tô chạy ra từ hầm gửi xe bên phải', 'urban dusk clear L2 e2 t1', 35, 15, 7.5, 10.5,
    [hz('pullout', 'car', { side: 'R', mode: 'join' })],
    'Ô tô từ dốc hầm gửi xe chạy lên và nhập ngay vào làn; qua cổng toà nhà, lối ra hầm phải giảm tốc và quan sát đầu xe nhô ra.');
  sc(6, 'Khúc gỗ nằm giữa làn cao tốc ban đêm', 'highway night clear L2 e2 t0', 90, 16, 8, 12.3,
    [hz('obstacle', 'log', {})],
    'Vật rơi nằm trong làn chỉ thấy được khi vào tầm đèn; ban đêm trên cao tốc phải nhìn xa, phanh giảm tốc ngay khi thấy vật lạ.');
  sc(6, 'Xe buýt phía trước phanh gấp trước trạm', 'urban day clear L2 e2 t2', 40, 15, 7, 10.2,
    [hz('brake', 'bus', { aL: 5.5 }), flow('moto', 40, 1, 36)],
    'Xe buýt phanh gấp và che kín tầm nhìn phía trước; đi sau xe buýt phải giữ khoảng cách xa và sẵn sàng phanh gần các trạm dừng.');
  sc(6, 'Xe máy ngược chiều rẽ ngang vào nhà bên phải', 'rural day clear L1 t1', 50, 15, 8, 11,
    [hz('oncoming', 'moto', { vo: 16, back: 'turn' })],
    'Xe máy ngược chiều rẽ trái cắt ngang để vào nhà mà không nhường; thấy xe ngược chiều chậm lại sát tim đường phải giảm tốc.');
  sc(6, 'Sương mù trên đèo, xe máy ngược chiều lấn làn', 'mountain day fog curveL cliffR t0', 30, 16, 9, 12,
    [hz('oncoming', 'moto', { vo: 30 })],
    'Trong sương mù xe máy ngược chiều đi lấn sang làn của mình; phải bật đèn, đi chậm sát bên phải và bấm còi ở đoạn khuất.');
  sc(6, 'Ô tô đỗ ven quốc lộ mở cửa phía lòng đường', 'national day clear L2 e2 t1', 50, 15, 8, 10.8,
    [hz('door', 'suv', {})],
    'Người trong xe đỗ bên lề mở cửa về phía làn xe chạy; đi ngang xe đỗ phải giảm tốc và giữ khoảng cách ngang rộng hơn một cánh cửa.');
  sc(6, 'Taxi quay đầu giữa phố ban đêm', 'urban night clear L2 e2 park t1', 35, 15, 7, 10,
    [hz('uturn', 'taxi', {}), park('car', 18, 'sh')],
    'Taxi đang đỗ bên phải quay đầu cắt ngang phố; thấy xi nhan trái của xe đỗ phải giảm tốc và dừng nhường.');
  sc(6, 'Mưa trên cao tốc, xe tải tạt sang tránh xe hỏng', 'highway day rain L2 e1 t0', 90, 16, 8, 11.8,
    [hz('cutin', 'truck', { side: 'R', vc: 60 }), park('car', 34, 2, { hazl: 1 })],
    'Xe tải gặp xe hỏng ở làn phải nên tạt sang làn của mình; thấy đèn khẩn cấp ở làn bên phải dự phòng xe làn đó chuyển làn và giảm tốc trước.');
  sc(6, 'Xe gầm cao lùi từ vỉa hè bên trái xuống đường', 'urban day clear L1 t0', 30, 15, 7.5, 10.8,
    [hz('reverse', 'suv', { side: 'L' })],
    'Ô tô lùi từ vỉa hè bên trái, cắt qua làn ngược chiều sang làn của mình; thấy xe lùi phải giảm tốc, dừng lại chờ xe ổn định hướng.');
  sc(6, 'Đàn dê băng qua đường quê', 'rural day clear L1 curveR t0', 45, 16, 8, 11,
    [hz('cross', 'goat', { side: 'L', n: 4, gap: .7 })],
    'Đàn dê nối đuôi nhau chạy qua đường; phải giảm tốc và dừng chờ, vì con sau thường lao theo con trước.');
  sc(6, 'Người đi bộ băng qua quốc lộ lúc chiều muộn', 'national dusk clear L1 t1', 55, 16, 8, 12.5,
    [hz('cross', 'ped', { side: 'L' })],
    'Người đi bộ băng qua quốc lộ ở nơi không có vạch sang đường, trời đã nhá nhem; phải bật đèn sớm, giảm tốc và nhường đường.');
  sc(6, 'Trời mưa, ô tô ngược chiều rẽ trái cắt mặt ở ngã tư', 'urban day rain L2 e1 jnX lightG t1', 40, 15, 7.5, 10.8,
    [hz('oncoming', 'car', { vo: 20, back: 'turn' })],
    'Ô tô ngược chiều rẽ trái cắt mặt dù mình đang đi thẳng; qua ngã tư trong mưa phải giảm tốc và không tin tuyệt đối vào quyền ưu tiên.');
  sc(6, 'Đá lăn từ vách núi xuống đường trong mưa', 'mountain day rain sR cliffR t0', 30, 16, 9, 12,
    [hz('cross', 'rock', { side: 'R', from: 'x4.4', to: 'x0.4' })],
    'Đá từ vách núi bên phải lăn xuống làn xe; mùa mưa qua đoạn có biển đá lở phải đi chậm, quan sát vách núi và dừng xa chỗ sạt.');
  sc(6, 'Xe phía trước giảm tốc mạnh rồi đi tiếp trên cao tốc', 'highway day clear L3 e2 t2', 100, 16, 8, 11.8,
    [hz('brake', 'suv', { aL: 6, to: 40, then: 'go', hold: 1 })],
    'Xe phía trước phanh mạnh vì bị xe khác chèn; phải phanh theo ngay, giữ khoảng cách ít nhất bằng quãng đường đi trong ba giây.');
  sc(6, 'Người chạy bộ băng qua đường lúc sáng sớm', 'urban dawn clear L1 t0', 35, 15, 8, 11,
    [hz('cross', 'ped', { side: 'L', jog: 1 })],
    'Người chạy bộ đeo tai nghe băng qua đường mà không nhìn xe; sáng sớm gần công viên phải giảm tốc và sẵn sàng dừng.');
  sc(6, 'Xe tải quay đầu chắn ngang quốc lộ trong sương mù', 'national dawn fog L1 t0', 50, 17, 8, 12.5,
    [hz('uturn', 'truck', {})],
    'Xe tải quay đầu chắn hết chiều rộng mặt đường trong sương mù; phải chạy chậm theo tầm nhìn và dừng hẳn chờ xe quay xong.');
  sc(6, 'Đêm mưa, xe máy không đèn từ ngõ bên phải chạy ra', 'rural night rain L1 t0', 45, 16, 8, 11.2,
    [hz('pullout', 'moto', { side: 'R', mode: 'join', nolight: 1 })],
    'Xe máy không đèn từ ngõ chạy ra trong đêm mưa; qua khu dân cư ban đêm phải giảm tốc và quan sát kỹ các lối ra.');
  sc(6, 'Người bốc hàng lùi ra từ sau thùng xe tải', 'urban day clear L2 e2 park t1', 30, 15, 8, 10.8,
    [hz('cross', 'worker', { side: 'R', from: 'sh', to: 'x3.6' }), park('truck', 7.2, 'sh'), park('box', 1.2, 'sw')],
    'Người bốc hàng bê thùng lùi ra lòng đường phía sau xe tải; qua xe đang bốc dỡ hàng phải đi chậm và giữ khoảng cách ngang.');
  sc(6, 'Xe dừng khẩn cấp không đèn trong sương mù cao tốc', 'highway dawn fog L2 e2 t0', 70, 17, 8, 12.5,
    [hz('obstacle', 'van', { nolight: 1 })],
    'Xe hỏng dừng trong làn không bật đèn, bị sương mù che khuất; trong sương mù phải giảm tốc sâu và tăng khoảng cách quan sát.');
  sc(6, 'Xe khách vượt lên rồi phanh gấp đón khách', 'national day clear L2 e2 t1', 60, 16, 8, 11.8,
    [hz('cutin', 'bus', { side: 'L', vPre: 82, vc: 32, after: 0 })],
    'Xe khách vượt lên, tạt vào trước đầu xe rồi phanh gấp để đón khách; phải nhả ga khi bị vượt và phanh ngay khi xe đó chuyển làn.');

  window.MoPhongData = {
    chapters: [
      { id: 1, name: 'Đường phố đô thị', count: 29 },
      { id: 2, name: 'Đường ngoại thành ban đêm, quanh co', count: 14 },
      { id: 3, name: 'Đường cao tốc', count: 20 },
      { id: 4, name: 'Đường đèo núi', count: 10 },
      { id: 5, name: 'Quốc lộ', count: 17 },
      { id: 6, name: 'Tình huống hỗn hợp, dễ xảy ra va chạm', count: 30 }
    ],
    exam: [2, 1, 2, 1, 2, 2],
    scenarios: list
  };
})();
