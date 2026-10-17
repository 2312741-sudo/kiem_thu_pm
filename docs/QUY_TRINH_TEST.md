# Quy trình test – báo cáo giữa kỳ R05-K15

Đề tài: kiểm thử Concurrency / Race cho Cal.com v6.2.0 (commit `1c193cca8682b33b9866c792186033f7ef886682`).

Tài liệu này trả lời năm câu hỏi giảng viên đặt ra cho giữa kỳ:

1. Danh sách test case là gì?
2. Chi phí cho việc test là bao nhiêu?
3. Kế hoạch test (giữa kỳ) ra sao?
4. Test như thế nào?
5. Test kỹ thuật test: kỹ thuật được áp dụng cụ thể ra sao?

Mọi kết quả dưới đây đến từ **lần chạy thật trên Cal.com đang chạy và PostgreSQL thật**, không có mock. Lỗi nêu ra đã được tái hiện lại bằng lệnh `curl` thuần túy, không phụ thuộc harness (xem mục 6).

## 1. Quy trình test

```
Đọc code → Chọn invariant → Thiết kế test case → Chuẩn bị dữ liệu
      → Chạy đồng thời (k6) + chạy tuần tự (đối chứng)
      → Kiểm invariant trong CSDL → Phân tích nguyên nhân gốc → Báo cáo
```

| Bước | Việc làm | Sản phẩm |
|---|---|---|
| 1 | Đọc `RegularBookingService`, `createBooking`, `handleSeats`, extension `booking-idempotency-key` để tìm chỗ "kiểm tra rồi mới ghi" | [diagrams/kien-truc.md](diagrams/kien-truc.md) |
| 2 | Chọn 7 invariant I1–I7 (tính chất dữ liệu luôn phải đúng) | mục 2 dưới đây |
| 3 | Thiết kế 8 test case TC-01 đến TC-08 | mục 2 |
| 4 | Tạo host `k15host` và 5 loại cuộc hẹn bằng `fixtures.sql`; mỗi vòng dùng ngày riêng | [race-tests/fixtures/fixtures.sql](../race-tests/fixtures/fixtures.sql) |
| 5 | Chạy đồng thời bằng k6, rồi chạy lại đúng các request đó nhưng tuần tự | [race-tests/src/run.mjs](../race-tests/src/run.mjs) |
| 6 | Truy vấn SQL kiểm invariant sau mỗi vòng | [race-tests/src/scenarios.mjs](../race-tests/src/scenarios.mjs) |
| 7 | Đọc code tìm nguyên nhân, thử khắc phục trên dữ liệu test | [DEFECTS.md](DEFECTS.md) |

**Tiêu chí pass/fail**
- Một vòng PASS khi mọi invariant của test case đúng **và** không có phản hồi 5xx hay lỗi kết nối.
- Test case PASS khi cả 10 vòng PASS. Một vòng vi phạm là đủ để FAIL.
- Là **lỗi race** khi chạy đồng thời FAIL nhưng chạy tuần tự PASS. Nếu tuần tự cũng FAIL thì là **lỗi logic**.

## 2. Danh sách test case

Dữ liệu chung: host `k15host` (múi giờ UTC, rảnh 24/7). Loại cuộc hẹn: `k15-30` (30 phút), `k15-60` (60 phút), `k15-seated` (30 phút, 3 ghế), `k15-confirm` (30 phút, cần xác nhận, giữ chỗ), `k15-limit` (30 phút, tối đa 1 booking/ngày). Mỗi request dùng một email người đặt khác nhau.

| TC | Test case | Tiền điều kiện | Input (gửi đồng thời) | Kết quả mong đợi | Invariant |
|---|---|---|---|---|---|
| TC-01 | Nhiều người đặt cùng một giờ | Giờ 09:00 trống | 10 người đặt `k15-30` lúc 09:00 | 1 người 200, 9 người 409 | I1 |
| TC-02 | Các giờ chồng lấn, lệch vài phút, khác độ dài | Khung 08:00–11:00 trống | 10 người: 7 đặt `k15-30` bắt đầu 09:00 + 3i phút, 3 đặt `k15-60` bắt đầu 08:30 + 3i phút | Chỉ 1 booking hiệu lực | I1 |
| TC-03 | Tranh ghế đầu tiên của event có ghế | Giờ trống, event 3 ghế | 6 người đặt `k15-seated` lúc 09:00 | 3 người 200, 3 người 409 `seats_full`; 1 booking, 3 ghế | I2, I2b |
| TC-04 | Tranh 2 ghế còn lại | Giờ đã có 1 người (đặt trước) | 6 người đặt `k15-seated` | 2 người 200, 4 người 409; tổng 3 ghế | I2, I2b |
| TC-05 | Event cần xác nhận | Giờ trống | 10 người đặt `k15-confirm` | Chỉ 1 booking chờ xác nhận | I3 |
| TC-06 | Đổi lịch nhiều lần cùng một booking | Booking B 09:00 | 5 lệnh đổi lịch B sang 10:00, 11:00, 12:00, 13:00, 14:00 | 1 lệnh thành công; B bị hủy | I4 |
| TC-07 | Hủy và đổi lịch cùng lúc | Booking B 09:00 | 1 lệnh hủy B + 1 lệnh đổi lịch B sang 11:00 | Không thể cả hai cùng thành công | I5 |
| TC-08 | Vượt giới hạn 1 booking/ngày | Ngày trống | 8 người đặt `k15-limit` ở 8 giờ khác nhau | Chỉ 1 người thành công | I6 |

**Invariant**

| ID | Tính chất luôn phải đúng | Cách kiểm trong CSDL |
|---|---|---|
| I1 | Một host không có 2 booking hiệu lực chồng giờ | Ghép bảng `Booking` với chính nó theo `userId`, điều kiện hai khoảng giờ giao nhau |
| I2 | Không vượt số ghế của event | Đếm `BookingSeat` theo giờ |
| I2b | Còn ghế thì người đặt không bị từ chối | So số người thành công với số ghế trống |
| I3 | Một giờ có tối đa 1 booking chờ xác nhận | Như I1, gồm cả trạng thái `pending` |
| I4 | Một booking gốc sinh tối đa 1 booking mới hiệu lực | Đếm booking có `fromReschedule` bằng mã gốc |
| I5 | Hủy báo thành công thì không còn booking hiệu lực của cuộc hẹn đó | Kết hợp mã HTTP của hủy và trạng thái các booking con |
| I6 | Số booking trong ngày không vượt giới hạn | Đếm booking hiệu lực theo ngày |
| I7 | Không có 5xx, timeout hay lỗi kết nối | Log của k6 |

Tổng cộng 8 test case × 10 vòng = 80 lần chạy cho mỗi chế độ (đồng thời và tuần tự).

## 3. Chi phí test

**Chi phí tiền: 0 đồng.** Toàn bộ công cụ miễn phí hoặc mã nguồn mở (Cal.com, PostgreSQL, k6, Node.js). Chạy trên máy cá nhân, không thuê hạ tầng.

**Tài nguyên máy** (một máy duy nhất): MacBook Apple Silicon 10 nhân, 32 GB RAM; chạy đồng thời Cal.com (`yarn dev`), PostgreSQL 16 và k6. Dung lượng kết quả: khoảng 7 MB.

**Chi phí chạy test đo thật** (từ `summary.json` của từng lần chạy):

| Lần chạy | Mục đích | Vòng | Request | Thời gian máy |
|---|---|---|---|---|
| Chạy đồng thời chính | 8 test case × 10 vòng | 80 | 570 | 150 giây |
| Chạy tuần tự đối chứng | Cùng request, gửi lần lượt | 80 | 570 | 22 giây |
| Độ nhạy N = 2 | Chỉ 2 request đồng thời, 20 vòng | 100 | 200 | 164 giây |
| Thí nghiệm khắc phục | Sau khi thêm ràng buộc CSDL | 40 | 380 | 85 giây |
| Đo cửa sổ race | 18 mốc độ trễ Δ | 180 | 360 | 300 giây |
| **Tổng** | | | **2 080** | **khoảng 12 phút** |

Chạy lại toàn bộ bộ test chính (đồng thời + tuần tự) tốn dưới 3 phút máy. Bộ demo giữa kỳ (`npm run demo:midterm`) chạy khoảng 20 giây.

**Chi phí xây dựng bộ test:** khoảng 970 dòng mã (Node.js, k6, SQL).

**Công sức của nhóm (người-giờ):** [điền số giờ thực tế của từng thành viên theo bảng dưới; các số ước lượng chỉ để tham khảo]

| Hạng mục | Ước lượng | Thực tế (nhóm điền) |
|---|---|---|
| Dựng Cal.com, seed data, chạy 3 luồng | 6–8 giờ | |
| Đọc code, vẽ kiến trúc | 6–8 giờ | |
| Thiết kế test case, viết harness | 10–14 giờ | |
| Chạy, phân tích kết quả, nguyên nhân gốc | 6–8 giờ | |
| Báo cáo, slide | 6–8 giờ | |

## 4. Kế hoạch test (giữa kỳ)

**Phạm vi:** luồng đặt lịch, đổi lịch, hủy lịch của Cal.com; event 1-1, event có ghế, event cần xác nhận, giới hạn số booking. Không gồm lịch ngoài (Google/Outlook), thanh toán, team, API v2.

**Giả định**
1. Một instance Cal.com, một PostgreSQL, chạy local.
2. Chạy `yarn dev`; trên production cửa sổ race có thể rộng hơn vì có thêm lời gọi lịch ngoài.
3. Host không kết nối lịch ngoài, nên lịch bận chỉ đến từ bảng `Booking`.
4. Rate limit tắt (không đặt `UNKEY_ROOT_KEY`).
5. Chỉ chạy trên máy local, không bắn tải vào server công khai.

**Rủi ro:** race không tái hiện ổn định (xử lý bằng chạy 10 vòng, báo tỉ lệ vòng vi phạm); máy yếu khi chạy cả hệ thống (xử lý bằng giảm số request đồng thời); kết quả có thể khác trên máy khác (xử lý bằng pin phiên bản, hướng dẫn chạy lại từ máy sạch).

**Lịch**

| Giai đoạn | Việc | Trạng thái |
|---|---|---|
| Sprint 1 (đến 20/10) | Dựng hệ thống, kiến trúc, kế hoạch, PoC | Xong |
| Sprint 2–3 | Harness 8 test case, chạy 10 vòng, đối chứng tuần tự, đo cửa sổ race | Đã chạy xong |
| Sprint 2–3 còn lại | Scenario Playwright qua giao diện; chạy lại trên máy của thành viên khác | Chưa làm |
| Sprint 4 | Rà soát nguyên nhân gốc, đề xuất sửa, hoàn thiện báo cáo | Đang làm |
| Tháng 12 | Slide bảo vệ, tập dượt, đánh giá chéo | Chưa làm |

## 5. Test như thế nào (kỹ thuật Concurrency / Race)

1. **Gửi đồng thời thật.** Mỗi "người dùng ảo" của k6 gửi đúng một request; tất cả chờ cùng một mốc giờ `START_AT` rồi mới gửi. Độ lệch thời điểm gửi trong một vòng đo được 0–1 ms.
2. **Oracle là dữ liệu trong CSDL, không phải mã HTTP.** API có thể trả 200 cho mọi request mà dữ liệu vẫn sai (đúng như lỗi D1).
3. **Nhóm đối chứng tuần tự.** Gửi đúng các request đó lần lượt. Đây là cách tách lỗi race khỏi lỗi logic thông thường.
4. **Lặp nhiều vòng và báo tỉ lệ.** Mỗi vòng dùng một ngày riêng để các vòng độc lập nhau.
5. **Đo độ rộng cửa sổ race.** Hai request xung đột, request thứ hai gửi trễ Δ mili-giây; cửa sổ khoảng 30–60 ms.
6. **Thử khắc phục để kiểm chứng nguyên nhân.** Thêm ràng buộc trong CSDL rồi chạy lại.

Lệnh chạy:

```bash
cd race-tests
npm run fixtures                          # tạo dữ liệu test
npm run race                              # 8 test case, đồng thời, 10 vòng
npm run race -- --mode sequential         # đối chứng tuần tự
npm run demo:midterm                      # demo giữa kỳ, khoảng 20 giây
```

## 6. Lỗi tìm được là lỗi thật

"Thật" ở đây nghĩa là: tái hiện trên Cal.com đang chạy với PostgreSQL thật, dữ liệu sai nhìn thấy được trong CSDL, và tái hiện lại bằng `curl` thuần túy.

**Tái hiện độc lập lỗi D1 (không dùng harness).** Hai khách đặt hai giờ chồng nhau cùng lúc:

```bash
# cùng gửi, chạy song song
curl -X POST localhost:3000/api/book/event -H 'content-type: application/json' -d '{... khách A, 09:00–09:30 ...}' &
curl -X POST localhost:3000/api/book/event -H 'content-type: application/json' -d '{... khách B, 09:15–09:45 ...}' &
wait
```

Kết quả đã chạy thật: cả hai trả HTTP **200**, và trong CSDL host `k15host` có hai booking `accepted` chồng giờ:

```
f5EvwbKstCupp9HfR2f24w | accepted | 09:00-09:30 | khach-a@thu.test
qEeB3JRUTF4q7sNYioASzW | accepted | 09:15-09:45 | khach-b@thu.test
```

**Đối chứng:** gửi tuần tự hai request chồng giờ tương tự thì request thứ hai bị từ chối **HTTP 409**. Vậy hệ thống có kiểm tra chồng giờ, nhưng chỉ đúng khi các request đến lần lượt.

Cả 6 lỗi đều đã được tái hiện bằng `curl` thuần: D1, D4 xem dưới đây; D2, D3, D5, D6 chạy bằng [race-tests/repro/repro-curl.sh](../race-tests/repro/repro-curl.sh), kết quả lưu ở [evidence/repro-curl.txt](evidence/repro-curl.txt).

**Tái hiện độc lập lỗi D4 (cũng xảy ra khi gửi tuần tự).** Đổi lịch liên tiếp cùng một booking gốc sang 13:00, 14:00, 15:00: cả ba trả HTTP 200, và CSDL có ba booking `accepted` cùng trỏ về một booking gốc, trong khi kỳ vọng chỉ lần đầu thành công.

**Danh sách lỗi và mức độ chắc chắn**

| Lỗi | Hiện tượng | Đã tái hiện bằng harness | Đã tái hiện độc lập bằng curl |
|---|---|---|---|
| D1 | Host bị đặt chồng giờ | 10/10 vòng; 20/20 vòng với 2 request | Có |
| D4 | Đổi lịch lặp từ một booking gốc | 10/10 vòng, cả tuần tự | Có |
| D2 | Event 3 ghế: còn ghế vẫn bị từ chối | 10/10 vòng | Có: 6 người đặt cùng lúc, chỉ bán được 1/3 ghế (1×200, 5×409) |
| D3 | Nhiều booking chờ xác nhận cho một giờ | 10/10 vòng | Có: 10 người đặt cùng lúc, DB có 8 booking chờ xác nhận cùng giờ |
| D5 | Hủy và đổi lịch cùng lúc | 10/10 vòng | Có: cả hai trả 200, DB có booking 09:00 đã hủy nhưng vẫn còn booking 11:00 hiệu lực |
| D6 | Vượt giới hạn 1 booking/ngày | 10/10 vòng | Có: 8 người đặt 8 giờ khác nhau cùng lúc, cả 8 được nhận, DB có 8 booking trong ngày |

**Điều cần nói thật khi bị hỏi**
- Đây là lỗi tìm được trên bản `v6.2.0` chạy local. Nhóm **chưa** báo cho nhóm phát triển Cal.com và chưa kiểm tra trên bản mới hơn, nên chưa thể khẳng định họ coi tất cả là lỗi.
- Nhóm **chưa sửa** mã Cal.com. Hướng sửa mới thử trên dữ liệu test: thêm ràng buộc CSDL chặn được D1 và D3 nhưng người thua nhận 500 thay vì 409; D6 chưa sửa được bằng cách này.
- D4 là lỗi logic, không phải race.

Bằng chứng từng lỗi: [MINH_CHUNG_LOI.md](MINH_CHUNG_LOI.md). Mô tả chi tiết và nguyên nhân gốc: [DEFECTS.md](DEFECTS.md).
