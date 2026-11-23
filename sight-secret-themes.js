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
