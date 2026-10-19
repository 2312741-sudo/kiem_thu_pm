# BÁO CÁO GIỮA KỲ R05-K15

**Kiểm thử Concurrency / Race Condition cho hệ thống đặt lịch Cal.com**

Môn: Kiểm thử phần mềm · Giảng viên: Nguyễn Thế Lâm · Khoa CNTT – Trường Đại học Đà Lạt · Nhóm 14

| Thành viên | MSSV | Vai trò |
|---|---|---|
| Nguyễn Thanh Tâm | 2312741 | A – Môi trường & DevOps |
| Võ Công Vinh | 2312800 | B – Phân tích hệ thống |
| Nguyễn Đức Tín | 2312774 | C – Tác giả test |
| Ngô Quốc Trường Vĩ | 2312796 | D – Verifier & báo cáo |

---

## Tóm tắt

Nhóm kiểm thử **race condition** của hệ thống đặt lịch **Cal.com v6.2.0** chạy trên máy cá nhân. Nhóm thiết kế **8 test case** xoay quanh **7 invariant** (tính chất dữ liệu luôn phải đúng), gửi request đồng thời bằng **k6** và **kiểm tra trực tiếp cơ sở dữ liệu PostgreSQL**. Mỗi test case chạy 10 vòng ở hai chế độ: đồng thời, và tuần tự để đối chứng.

Kết quả của lượt chạy chính thức: **6 trên 8 test case phát hiện lỗi** (5 lỗi race và 1 lỗi logic). Cả 6 lỗi đã được tái hiện lại bằng lệnh `curl` thuần, không dùng bộ test, và dữ liệu sai nhìn thấy được trực tiếp trong cơ sở dữ liệu. Nhóm chưa báo lỗi cho nhóm phát triển Cal.com và chưa sửa mã Cal.com.

## 1. Giới thiệu hệ thống và phạm vi

**Cal.com** là phần mềm đặt lịch hẹn mã nguồn mở, tương tự Calendly:

1. Chủ lịch (host) tạo loại cuộc hẹn và khai báo giờ rảnh.
2. Hệ thống cho ra một liên kết công khai.
3. Khách mở liên kết, chọn giờ còn trống và đặt lịch, không cần tài khoản.
4. Hệ thống ghi cuộc hẹn và đánh dấu giờ đó đã kín.

Nếu hệ thống làm sai, hai khách có thể cùng giữ một khung giờ và chủ lịch bị **đặt trùng** (double booking). Đây là lý do nhóm chọn kỹ thuật kiểm thử race.

| Hạng mục | Giá trị |
|---|---|
| Hệ thống (R05) | Cal.com, TypeScript, Next.js 16, PostgreSQL, Prisma, monorepo |
| Phiên bản đã pin | Tag `v6.2.0`, commit `1c193cca8682b33b9866c792186033f7ef886682` |
| Kỹ thuật (K15) | Concurrency / Race testing |
| Phạm vi | Luồng đặt lịch, đổi lịch, hủy lịch; event 1-1, event có ghế, event cần xác nhận, giới hạn số booking |
| Ngoài phạm vi | Đồng bộ lịch ngoài (Google, Outlook), thanh toán, team, API v2 |

## 2. Quy trình test

```
Đọc code → Chọn invariant → Thiết kế test case → Chuẩn bị dữ liệu
      → Chạy đồng thời (k6) + chạy tuần tự (đối chứng)
      → Kiểm invariant trong CSDL → Phân tích nguyên nhân gốc → Báo cáo
```

| Bước | Việc làm | Sản phẩm |
|---|---|---|
| 1 | Đọc code luồng đặt lịch, tìm chỗ kiểm tra rồi mới ghi | Sơ đồ kiến trúc |
| 2 | Chọn 7 invariant I1 đến I7 | Mục 3 |
| 3 | Thiết kế 8 test case TC-01 đến TC-08 | Mục 3 |
| 4 | Tạo host test và 5 loại cuộc hẹn; mỗi vòng dùng ngày riêng | `fixtures.sql` |
| 5 | Chạy đồng thời bằng k6, rồi chạy lại các request đó tuần tự | `run.mjs` |
| 6 | Truy vấn SQL kiểm invariant sau mỗi vòng | `scenarios.mjs` |
| 7 | Đọc code tìm nguyên nhân, thử khắc phục trên dữ liệu test | `DEFECTS.md` |

**Tiêu chí pass/fail**

- Một vòng PASS khi mọi invariant của test case đúng và không có phản hồi 5xx hay lỗi kết nối.
- Test case PASS khi cả 10 vòng PASS; một vòng vi phạm là đủ để FAIL.
- Là **lỗi race** khi chạy đồng thời FAIL nhưng chạy tuần tự PASS. Nếu tuần tự cũng FAIL thì là **lỗi logic**.

## 3. Danh sách test case

Dữ liệu chung: host `k15host` (múi giờ UTC, rảnh 24/7). Loại cuộc hẹn: `k15-30` (30 phút), `k15-60` (60 phút), `k15-seated` (30 phút, 3 ghế), `k15-confirm` (30 phút, cần xác nhận), `k15-limit` (30 phút, tối đa 1 booking mỗi ngày). Mỗi request dùng một email người đặt khác nhau.

| TC | Test case | Tiền điều kiện | Input (gửi đồng thời) | Kết quả mong đợi | Invariant |
|---|---|---|---|---|---|
| TC-01 | Nhiều người đặt cùng một giờ | Giờ 09:00 trống | 10 người đặt `k15-30` lúc 09:00 | 1 người 200, 9 người 409 | I1 |
| TC-02 | Các giờ chồng lấn, lệch vài phút | Khung 08:00 đến 11:00 trống | 10 người: giờ lệch 3 phút, event 30 và 60 phút | Chỉ 1 booking hiệu lực | I1 |
| TC-03 | Tranh ghế đầu tiên của event có ghế | Giờ trống, event 3 ghế | 6 người đặt `k15-seated` | 3 người 200, 3 người 409; 3 ghế | I2, I2b |
| TC-04 | Tranh 2 ghế còn lại | Giờ đã có 1 người | 6 người đặt `k15-seated` | 2 người 200, 4 người 409 | I2, I2b |
| TC-05 | Event cần xác nhận | Giờ trống | 10 người đặt `k15-confirm` | Chỉ 1 booking chờ xác nhận | I3 |
| TC-06 | Đổi lịch nhiều lần cùng một booking | Booking B lúc 09:00 | 5 lệnh đổi lịch B | 1 lệnh thành công; B bị hủy | I4 |
| TC-07 | Hủy và đổi lịch cùng lúc | Booking B lúc 09:00 | 1 lệnh hủy + 1 lệnh đổi lịch B | Không thể cả hai cùng thành công | I5 |
| TC-08 | Vượt giới hạn 1 booking mỗi ngày | Ngày trống | 8 người đặt 8 giờ khác nhau | Chỉ 1 người thành công | I6 |

**Invariant**

| ID | Tính chất luôn phải đúng | Cách kiểm trong CSDL |
|---|---|---|
| I1 | Một host không có 2 booking hiệu lực chồng giờ | Ghép bảng `Booking` với chính nó theo `userId`, hai khoảng giờ giao nhau |
| I2 | Không vượt số ghế của event | Đếm `BookingSeat` theo giờ |
| I2b | Còn ghế thì người đặt không bị từ chối | So số người thành công với số ghế trống |
| I3 | Một giờ có tối đa 1 booking chờ xác nhận | Như I1, gồm trạng thái `pending` |
| I4 | Một booking gốc sinh tối đa 1 booking mới hiệu lực | Đếm booking có `fromReschedule` bằng mã gốc |
| I5 | Hủy báo thành công thì không còn booking hiệu lực của cuộc hẹn đó | Kết hợp mã HTTP của lệnh hủy và trạng thái các booking con |
| I6 | Số booking trong ngày không vượt giới hạn | Đếm booking hiệu lực theo ngày |
| I7 | Không có 5xx, timeout hay lỗi kết nối | Log của k6 |

## 4. Cách test và kỹ thuật test

1. **Gửi đồng thời thật.** Mỗi người dùng ảo của k6 gửi đúng một request; tất cả chờ cùng một mốc giờ rồi mới gửi. Độ lệch thời điểm gửi trong một vòng đo được 0 đến 1 ms. Cửa sổ race của hệ thống khoảng 30 đến 60 ms, nên không thể gửi đồng thời bằng tay.
2. **Oracle là dữ liệu trong CSDL, không phải mã HTTP.** API có thể trả 200 cho mọi request mà dữ liệu vẫn sai.
3. **Nhóm đối chứng tuần tự.** Gửi đúng các request đó lần lượt, để tách lỗi race khỏi lỗi logic thông thường.
4. **Lặp nhiều vòng và báo tỉ lệ.** Mỗi vòng dùng một ngày riêng nên các vòng độc lập nhau.
5. **Đo độ rộng cửa sổ race.** Hai request xung đột, request thứ hai gửi trễ Δ mili-giây: Δ từ 0 đến 30 ms luôn vi phạm, từ 60 ms trở đi không còn.
6. **Tái hiện độc lập bằng `curl`** để xác nhận lỗi không do bộ test.
7. **Thử khắc phục trên dữ liệu test** để kiểm chứng nguyên nhân gốc.

Lệnh chạy (trong thư mục `race-tests`):

```bash
npm run fixtures
npm run race -- --out results/giua-ky-race
npm run race -- --mode sequential --out results/giua-ky-sequential
npm run midterm-report
```

## 5. Kế hoạch test giữa kỳ

**Giả định**

1. Một instance Cal.com, một PostgreSQL, chạy local.
2. Chạy bằng `yarn dev`; trên môi trường thật, cửa sổ race có thể rộng hơn do có thêm lời gọi lịch ngoài.
3. Host không kết nối lịch ngoài nên lịch bận chỉ đến từ bảng `Booking`.
4. Rate limit tắt.
5. Chỉ chạy trên máy local, không bắn tải vào máy chủ công khai.

**Rủi ro và cách xử lý**

| Rủi ro | Cách xử lý |
|---|---|
| Race không tái hiện ổn định | Chạy 10 vòng, báo tỉ lệ vòng vi phạm |
| Kết quả khác trên máy khác | Pin phiên bản, hướng dẫn chạy lại từ máy sạch |
| Máy yếu khi chạy cả hệ thống | Giảm số request đồng thời |
| Hai người chạy test cùng lúc làm hỏng kết quả | Quy tắc: tại một thời điểm chỉ một người chạy test |

**Lịch**

| Giai đoạn | Việc | Trạng thái |
|---|---|---|
| Sprint 1 (đến 20/10) | Dựng hệ thống, kiến trúc, kế hoạch, thử nghiệm đầu tiên | Xong |
| Sprint 2 và 3 | Harness 8 test case, chạy 10 vòng, đối chứng tuần tự, đo cửa sổ race | Đã chạy xong |
| Sprint 2 và 3 | Chạy lại trên máy Windows của thành viên khác | Đã chạy xong, kết quả khớp |
| Sprint 2 và 3 (còn lại) | Test qua giao diện bằng Playwright | Chưa làm |
| Sprint 4 | Rà soát nguyên nhân gốc, đề xuất sửa, hoàn thiện báo cáo | Đang làm |
| Tháng 12 | Slide bảo vệ, tập dượt, đánh giá chéo | Chưa làm |

## 6. Chi phí test

**Chi phí tiền: 0 đồng.** Toàn bộ công cụ miễn phí hoặc mã nguồn mở (Cal.com, PostgreSQL, k6, Node.js), chạy trên máy cá nhân. Máy: MacBook Apple Silicon 10 nhân, 32 GB RAM.

**Lượt chạy chính thức cho giữa kỳ** (đo từ file `summary.json`):

| Lần chạy | Vòng | Request | Thời gian máy |
|---|---|---|---|
| Đồng thời | 80 | 570 | 154 giây |
| Tuần tự (đối chứng) | 80 | 570 | 23 giây |
| **Tổng** | 160 | **1 140** | **176 giây** |

**Tổng chi phí chạy của cả quá trình** (gồm thí nghiệm độ nhạy, đo cửa sổ race, thí nghiệm khắc phục): khoảng 2 080 request, khoảng 12 phút máy.

**Chi phí xây dựng bộ test:** khoảng 970 dòng mã (Node.js, k6, SQL).

**Công sức của nhóm (người-giờ):**

| Thành viên | Việc | Số giờ |
|---|---|---|
| Nguyễn Thanh Tâm | | |
| Võ Công Vinh | | |
| Nguyễn Đức Tín | | |
| Ngô Quốc Trường Vĩ | | |

## 7. Kết quả test

Nguồn: lượt chạy chính thức ngày 18/10/2026, mỗi test case 10 vòng ở mỗi chế độ.

| TC | Đồng thời (vòng vi phạm) | Tuần tự (vòng vi phạm) | Kết luận | Lỗi |
|---|---|---|---|---|
| TC-01 | 0/10 | 0/10 | Đúng | – |
| TC-02 | 10/10 | 0/10 | Lỗi race | D1 |
| TC-03 | 10/10 | 0/10 | Lỗi race | D2 |
| TC-04 | 0/10 | 0/10 | Đúng | – |
| TC-05 | 10/10 | 0/10 | Lỗi race | D3 |
| TC-06 | 10/10 | 10/10 | Lỗi logic | D4 |
| TC-07 | 10/10 | 0/10 | Lỗi race | D5 |
| TC-08 | 10/10 | 0/10 | Lỗi race | D6 |

**Tổng hợp**

- Tổng số test case: 8.
- Đúng (không có lỗi): 2 (TC-01 và TC-04, hai cơ chế bảo vệ của hệ thống hoạt động đúng).
- Có lỗi race: 5.
- Có lỗi logic: 1.
- Tỉ lệ test case phát hiện lỗi: 6 trên 8.

**Độ nhạy:** chỉ với 2 request đồng thời, TC-02 vi phạm ở 20 trên 20 vòng và TC-08 vi phạm ở 20 trên 20 vòng. Lỗi không cần tải lớn.

### Chạy lại trên máy thứ hai (Windows)

Một thành viên chạy lại toàn bộ bộ test trên máy Windows của mình, với cùng phiên bản mã (Cal.com v6.2.0, bộ test cùng commit) để kiểm tra kết quả có phụ thuộc vào máy hay không.

- Người test: Ngô Quốc Trường Vĩ (2312796)
- Cấu hình máy: MSI, Intel Core i7-13620H 2,40 GHz, RAM 16 GB (15,7 GB dùng được), Windows 64-bit; phiên bản Node và k6: [điền]
- Thời điểm chạy: lượt đồng thời bắt đầu lúc 19:15 UTC ngày 18/10/2026, tức 02:15 sáng ngày 19/10/2026 giờ Việt Nam
- Kết quả đồng thời: [race-tests/results/windows-race/REPORT.md](../race-tests/results/windows-race/REPORT.md)
- Kết quả tuần tự: [race-tests/results/windows-sequential/REPORT.md](../race-tests/results/windows-sequential/REPORT.md)

| TC | Mac: đồng thời | Windows: đồng thời | Windows: tuần tự | Khớp |
|---|---|---|---|---|
| TC-01 | 0/10 | 0/10 | 0/10 | Có |
| TC-02 | 10/10 | 10/10 | 0/10 | Có |
| TC-03 | 10/10 | 10/10 | 0/10 | Có |
| TC-04 | 0/10 | 0/10 | 0/10 | Có |
| TC-05 | 10/10 | 10/10 | 0/10 | Có |
| TC-06 | 10/10 | 10/10 | 10/10 | Có |
| TC-07 | 10/10 | 10/10 | 0/10 | Có |
| TC-08 | 10/10 | 10/10 | 0/10 | Có |

**Nhận xét**

- Kết luận 8/8 test case giống nhau trên hai máy. Số vòng vi phạm và dữ liệu trong CSDL ở vòng 1 giống hệt, trừ TC-05: máy Mac nhận 9 booking chờ xác nhận (1 request bị 409), máy Windows nhận 10. Cả hai đều vi phạm 10/10 vòng, khác nhau ở thời điểm chạm cửa sổ race.
- Máy Windows chậm hơn: lượt đồng thời chạy 210 giây so với 154 giây trên máy Mac. Độ trễ p95 của TC-01 là 9 703 ms trên Windows so với 417 ms trên Mac. Nhiều khả năng do Cal.com biên dịch lần đầu ở vòng đầu, nhóm chưa kiểm chứng.
- Lượt tuần tự trên Windows: chỉ TC-06 FAIL (10/10), khớp máy Mac; chạy 43 giây so với 23 giây trên máy Mac.
- Hai lượt chạy đầu trên máy Windows **không hợp lệ và đã bị loại**: lượt thứ nhất do máy chưa cài k6, lượt thứ hai do Cal.com dừng giữa chừng (TC-01 báo FAIL bất thường). Kết quả dùng ở trên là lượt chạy sạch sau khi khắc phục. Đây là lý do bộ test hiện có bước khởi động nóng và báo lỗi rõ khi Cal.com dừng.

**Dữ liệu thô:** `race-tests/results/giua-ky-race/` và `race-tests/results/giua-ky-sequential/` (request đã gửi, phản hồi từng request, tóm tắt k6).

## 8. Lỗi tìm được

| Lỗi | Hiện tượng | Loại | Mức độ |
|---|---|---|---|
| D1 | Host bị đặt chồng giờ khi các giờ lệch nhau | Race | Cao |
| D2 | Event có ghế: còn ghế nhưng người đặt sau bị từ chối | Race | Trung bình |
| D3 | Nhiều booking chờ xác nhận cho cùng một giờ | Race | Trung bình |
| D4 | Một booking gốc đổi lịch được nhiều lần, sinh nhiều booking mới | Logic | Cao |
| D5 | Hủy và đổi lịch cùng lúc đều báo thành công | Race | Trung bình |
| D6 | Vượt giới hạn 1 booking mỗi ngày | Race | Trung bình |

**Nguyên nhân gốc chung của các lỗi race:** hệ thống kiểm tra rồi mới ghi, giữa hai bước không có khóa. Hai request cùng đọc thấy giờ còn trống rồi cùng ghi. Lớp chặn duy nhất trong CSDL là ràng buộc duy nhất trên khóa tính từ giờ bắt đầu, giờ kết thúc và host, nên chỉ bắt được trường hợp hai request trùng khít. D4 do trạng thái "đã hủy và đã đổi lịch" mang hai nghĩa nên hàm kiểm tra không phân biệt được.

**Các lỗi là lỗi thật.** Mỗi lỗi đã được tái hiện độc lập bằng `curl` thuần trên Cal.com đang chạy, rồi đối chiếu dữ liệu trong CSDL:

| Lỗi | Tái hiện bằng `curl` | Dữ liệu trong CSDL |
|---|---|---|
| D1 | 2 khách đặt 2 giờ chồng nhau cùng lúc: cả hai trả 200 | 2 booking hiệu lực chồng giờ: 09:00 đến 09:30 và 09:15 đến 09:45 |
| D2 | 6 người đặt event 3 ghế: 1 trả 200, 5 trả 409 | Chỉ bán được 1 trên 3 ghế |
| D3 | 10 người đặt event cần xác nhận: 8 trả 200 | 8 booking chờ xác nhận cùng một giờ |
| D4 | Đổi lịch liên tiếp một booking gốc 3 lần: cả 3 trả 200 | 3 booking hiệu lực từ cùng một booking gốc (cả khi gửi tuần tự) |
| D5 | Hủy và đổi lịch cùng lúc: cả hai trả 200 | Booking 09:00 đã hủy nhưng vẫn còn booking 11:00 hiệu lực |
| D6 | 8 người đặt 8 giờ, giới hạn 1 mỗi ngày: cả 8 trả 200 | 8 booking hiệu lực trong một ngày |

Đối chứng: gửi tuần tự hai request chồng giờ thì request thứ hai bị từ chối (HTTP 409). Hệ thống có kiểm tra chồng giờ, nhưng chỉ đúng khi các request đến lần lượt.

**Thí nghiệm khắc phục (trên dữ liệu test).** Thêm ràng buộc CSDL không cho hai booking hiệu lực chồng giờ của cùng host: D1 và D3 chỉ còn đúng 1 booking mỗi giờ, nghĩa là nguyên nhân đã đúng. Tuy nhiên người thua nhận HTTP 500 thay vì 409, vì mã lỗi chưa được xử lý. D6 không sửa được bằng cách này vì các booking không chồng giờ.

## 9. Kết luận và việc còn lại

**Kết luận giữa kỳ**

- Bộ test tự động chạy lại được, có đối chứng tuần tự và tái hiện độc lập, phát hiện **6 lỗi thật** trên Cal.com v6.2.0.
- Một hệ thống chạy đúng khi tuần tự chưa chắc đúng khi đồng thời. Chỉ kiểm thử race với oracle trên CSDL mới làm lộ các lỗi này.

**Điều nhóm chưa làm**

- Chưa báo lỗi cho nhóm phát triển Cal.com và chưa kiểm tra trên bản mới hơn, nên chưa thể khẳng định phía Cal.com coi tất cả là lỗi.
- Chưa sửa mã Cal.com. Hướng sửa mới thử trên dữ liệu test.
- Chưa test qua giao diện bằng Playwright.
- Mới chạy lại trên một máy khác (Windows); chưa ghi phiên bản Node và k6 của máy đó.

**Việc tiếp theo**

1. Test qua giao diện bằng Playwright.
2. Rà soát nguyên nhân gốc, đề xuất sửa cho D1 và D4, chuẩn bị báo lỗi cho Cal.com.
3. Hoàn thiện báo cáo cuối và nộp trước bảo vệ một tuần.

## Phụ lục A. Phiếu ghi kết quả test

Phần kết quả đã điền từ lượt chạy chính thức. Người test điền cột "Người test" và "Ngày giờ" khi tự chạy lại.

| TC | Người test | Ngày giờ | Đồng thời | Tuần tự | Kết luận | Bằng chứng |
|---|---|---|---|---|---|---|
| TC-01 | | | 0/10 | 0/10 | Đúng | giua-ky-race/REPORT.md |
| TC-02 | | | 10/10 | 0/10 | Lỗi race D1 | giua-ky-race/REPORT.md |
| TC-03 | | | 10/10 | 0/10 | Lỗi race D2 | giua-ky-race/REPORT.md |
| TC-04 | | | 0/10 | 0/10 | Đúng | giua-ky-race/REPORT.md |
| TC-05 | | | 10/10 | 0/10 | Lỗi race D3 | giua-ky-race/REPORT.md |
| TC-06 | | | 10/10 | 10/10 | Lỗi logic D4 | giua-ky-sequential/REPORT.md |
| TC-07 | | | 10/10 | 0/10 | Lỗi race D5 | giua-ky-race/REPORT.md |
| TC-08 | | | 10/10 | 0/10 | Lỗi race D6 | giua-ky-race/REPORT.md |

## Phụ lục B. Tài liệu và bằng chứng

| Nội dung | Đường dẫn |
|---|---|
| Mã nguồn bộ test và kết quả | https://github.com/2312741-sudo/kiem_thu_pm |
| Quy trình test đầy đủ | docs/QUY_TRINH_TEST.md |
| Hướng dẫn người test | docs/HUONG_DAN_NGUOI_TEST.md |
| Kết quả test giữa kỳ (sinh tự động) | docs/KET_QUA_TEST_GIUA_KY.md |
| Kết quả chạy lại trên máy Windows | race-tests/results/windows-race/REPORT.md, race-tests/results/windows-sequential/REPORT.md |
| Mô tả chi tiết từng lỗi | docs/DEFECTS.md |
| Minh chứng lỗi | docs/MINH_CHUNG_LOI.md |
| Tái hiện độc lập bằng curl | race-tests/repro/repro-curl.sh, docs/evidence/repro-curl.txt |
| Board công việc | https://github.com/users/2312741-sudo/projects/1 |
