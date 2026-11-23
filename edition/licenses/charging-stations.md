# Trạm sạc điện tại Việt Nam

Trong `electric-stations.json` có 426 điểm, trong đó 2 điểm thuộc địa giới Đồng Nai đang dùng trong dự án. Mỗi bản ghi gồm tên, vĩ độ, kinh độ (WGS 84). Tệp `osm-ids.txt` đối chiếu lần lượt từng bản ghi đến đường dẫn `https://www.openstreetmap.org/<loại>/<id>`.

Nguồn tọa độ là **© OpenStreetMap contributors**, giấy phép [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/). [Bản quyền và ghi công OpenStreetMap](https://www.openstreetmap.org/copyright). Bản trích Việt Nam của Humanitarian OpenStreetMap Team có mốc dữ liệu 15/11/2026, xuất ngày 16/11/2026. [Bộ dữ liệu trên HDX](https://data.humdata.org/dataset/hotosm_vnm_points_of_interest) và [GeoJSON nguồn](https://production-raw-data-api.s3.amazonaws.com/ISO3/VNM/points_of_interest/hotosm_vnm_points_of_interest_osm_geojson.zip).

Ngày 23/11/2026, đã kiểm tra cả 478 mã thực thể qua OSM API. Chọn đối tượng `amenity=charging_station`, bỏ 3 điểm ghi riêng tư và 46 điểm ghi chỉ phục vụ xe hai bánh, ghi không cho ô tô, hoặc chỉ có chỉ dấu phục vụ xe hai bánh. Giữ các điểm không có thông tin kiểu phương tiện khi OSM không ghi hạn chế. Dùng tọa độ nút hoặc một điểm bên trong đa giác trạm rồi đối chiếu với ranh giới 34 tỉnh, thành. Đã gộp ba bản ghi trùng tọa độ. Điểm không có tên riêng dùng nhãn chung. Trạm thuộc Đồng Nai có thêm tên phường, xã tra từ đa giác hành chính của dự án. Đây là các điểm cộng đồng đã lập bản đồ. Loại đầu sạc, quyền tiếp cận thực tế, tình trạng vận hành và độ phủ toàn quốc thay đổi. [Bản đồ do VinFast vận hành](https://vinfastauto.com/vn_vi/tim-kiem-showroom-tram-sac).

Hai điểm tại Đồng Nai gồm [Trạm sạc điện VinFast, phường Tam Hiệp](https://www.openstreetmap.org/node/11329202535) và [Trạm sạc điện, xã Phước Sơn](https://www.openstreetmap.org/node/12670246354).
