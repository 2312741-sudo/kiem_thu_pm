# Hướng dẫn người test – báo cáo giữa kỳ R05-K15

Tài liệu dành cho **thành viên thực hiện test**. Làm theo từng bước, ghi kết quả vào phiếu, rồi dùng phiếu để viết báo cáo giữa kỳ. Mỗi bước bám theo yêu cầu của giảng viên:

| Yêu cầu giảng viên | Làm ở đâu trong tài liệu này |
|---|---|
| Đưa ra quy trình test | Phần 2 |
| Danh sách test case là gì | Phần 3 |
| Chi phí cho việc test | Phần 6 |
| Kế hoạch test (giữa kỳ) | Phần 7 |
| Test như thế nào | Phần 4 và 5 |
| Test kỹ thuật test | Phần 5 |
| Phải test thật, lỗi là lỗi thật | Phần 8 |

## 1. Chuẩn bị (người test làm một lần)

**Quy tắc quan trọng: tại một thời điểm chỉ MỘT người chạy test.** Các lệnh test xóa và tạo lại booking của host `k15host`. Hai người chạy cùng lúc sẽ làm hỏng kết quả của nhau. Trước khi chạy, kiểm tra không có lượt nào đang chạy:

```bash
pgrep -fl "src/run.mjs|k6 run" || echo "không có lượt nào đang chạy"
```

**Checklist trước khi test**

| # | Việc | Lệnh kiểm tra | Kỳ vọng |
|---|---|---|---|
| 1 | PostgreSQL chạy | `psql -h localhost -U postgres -d calendso -Atc "select 1"` | `1` |
| 2 | Cal.com chạy | `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/k15host` | `200` |
| 3 | Đúng phiên bản | `git -C calcom rev-parse HEAD` | `1c193cca8682b33b9866c792186033f7ef886682` |
| 4 | Công cụ test | `cd race-tests && npm install && k6 version` | k6 2.x |
| 5 | Dữ liệu test | `npm run fixtures` | In bảng 9 loại cuộc hẹn |

Cài đặt từ máy sạch: xem [README.md](../README.md) mục 2.

## 2. Quy trình test (7 bước)

```
1. Đọc code     → 2. Chọn invariant → 3. Thiết kế test case
4. Chuẩn bị dữ liệu → 5. Chạy đồng thời + tuần tự
6. Kiểm trong CSDL → 7. Ghi kết quả, phân tích, báo cáo
```

Người test phụ trách bước 4 đến 7. Bước 1–3 đã làm xong, kết quả ở phần 3.

## 3. Danh sách test case

| TC | Test case | Input (gửi đồng thời) | Kết quả mong đợi | Invariant |
|---|---|---|---|---|
| TC-01 | Nhiều người đặt cùng một giờ | 10 người đặt `k15-30` lúc 09:00 | 1 người 200, 9 người 409 | I1 |
| TC-02 | Các giờ chồng lấn | 10 người: giờ lệch 3 phút, event 30 và 60 phút | Chỉ 1 booking hiệu lực | I1 |
| TC-03 | Tranh ghế đầu tiên | 6 người đặt event 3 ghế, giờ trống | 3 người 200, 3 người 409; 3 ghế | I2, I2b |
| TC-04 | Tranh 2 ghế còn lại | 6 người, giờ đã có 1 người | 2 người 200, 4 người 409 | I2, I2b |
| TC-05 | Event cần xác nhận | 10 người đặt cùng một giờ | Chỉ 1 booking chờ xác nhận | I3 |
| TC-06 | Đổi lịch nhiều lần | 5 lệnh đổi lịch cùng một booking | 1 lệnh thành công | I4 |
| TC-07 | Hủy và đổi lịch cùng lúc | 1 lệnh hủy + 1 lệnh đổi lịch | Không thể cả hai cùng thành công | I5 |
| TC-08 | Giới hạn 1 booking/ngày | 8 người đặt 8 giờ khác nhau | Chỉ 1 người thành công | I6 |
| TC-09 | Hai booking cùng đổi lịch sang một giờ | 2 lệnh đổi lịch cùng sang giờ trống | 1 thành công, 1 bị 409 | I1 |
| TC-10 | Đổi lịch tranh giờ với đặt mới | 1 lệnh đổi lịch + 1 người đặt mới cùng một giờ | Chỉ 1 trong 2 giữ được giờ | I1 |
| TC-11 | Thời gian đệm 30 phút | 6 người đặt 6 giờ sát nhau | Tối đa 3 booking, cách nhau ≥ 30 phút | I8 |
| TC-12 | Giới hạn thời lượng 30 phút/ngày | 6 người đặt 6 giờ khác nhau | Chỉ 1 người thành công | I9 |
| TC-13 | Giới hạn 1 booking/tuần | 6 người đặt 6 ngày trong tuần | Chỉ 1 người thành công | I6 |
| TC-14 | Giới hạn 1 booking/người đặt | 1 email đặt 6 giờ khác nhau | Chỉ 1 booking thành công | I10 |
| TC-15 | Hủy một booking nhiều lần | 6 lệnh hủy cùng một booking | Đúng 1 lệnh 200 | I5 |
| TC-16 | Một người chiếm nhiều ghế | 1 email đặt 6 lần vào event 3 ghế | Email đó chiếm đúng 1 ghế | I11 |
| TC-17 | Hai loại cuộc hẹn cùng giờ bắt đầu | 5 người 30 phút + 5 người 60 phút, đều 09:00 | Chỉ 1 booking hiệu lực | I1 |
| TC-18 | Tải cao | 30 người đặt cùng một giờ | 1 người 200, 29 người 409, không 5xx | I1, I7 |
| TC-19 | Giờ độc lập không bị từ chối nhầm | 20 người đặt 20 giờ liền kề | Cả 20 người thành công | I12 |
| TC-20 | Hủy và đặt lại đúng giờ vừa hủy | 1 lệnh hủy + 1 người đặt mới cùng giờ | Không có 2 booking hiệu lực cùng giờ | I1 |

Tiền điều kiện đầy đủ và định nghĩa invariant: [QUY_TRINH_TEST.md](QUY_TRINH_TEST.md) mục 2.

## 4. Cách chạy test (người thật làm theo)

### 4.1. Chạy tự động (bắt buộc, vì cần gửi đồng thời trong vài mili-giây)

Một người bấm trên giao diện không thể gửi hai request cách nhau dưới 30 ms. Cửa sổ race của hệ thống chỉ khoảng 30–60 ms. Vì vậy phần "gửi đồng thời" phải dùng công cụ (k6). **Người test vẫn là người chạy lệnh, đọc và xác nhận kết quả.**

| Bước | Lệnh | Thời gian | Kết quả |
|---|---|---|---|
| a | `npm run race -- --out results/giua-ky-race` | khoảng 2,5 phút | `results/giua-ky-race/REPORT.md` |
| b | `npm run race -- --mode sequential --out results/giua-ky-sequential` | khoảng 30 giây | `results/giua-ky-sequential/REPORT.md` |

Chạy trong thư mục `race-tests`. Chạy (a) rồi mới chạy (b), không chạy song song.

### 4.2. Kiểm tra độc lập bằng tay (mỗi lỗi một lần, để chắc đó là lỗi thật)

Người test tự chạy lệnh thuần, không dùng bộ test, rồi **đối chiếu dữ liệu trong CSDL**:

```bash
bash race-tests/repro/repro-curl.sh
```

Kết quả mong đợi (dạng số, có thể lệch chút giữa các lần): D2 bán được 1/3 ghế, D3 có nhiều booking chờ xác nhận cùng giờ, D5 cả hủy và đổi lịch đều 200, D6 nhiều booking trong một ngày dù giới hạn là 1. Hai lỗi D1 và D4 tái hiện theo [QUY_TRINH_TEST.md](QUY_TRINH_TEST.md) mục 6.

### 4.3. Kiểm tra trực quan trên giao diện

1. Mở http://localhost:3000/k15host/k15-30 và chụp màn hình trang đặt lịch (chứng minh hệ thống chạy).
2. Sau khi chạy test, chạy lệnh SQL dưới đây và chụp kết quả (các booking chồng giờ):

```bash
psql -h localhost -U postgres -d calendso -c "select uid,status,\"startTime\",\"endTime\" from \"Booking\" where \"userId\"=(select id from users where username='k15host') and status='accepted' order by \"startTime\" limit 12"
```

## 5. Kỹ thuật test: Concurrency / Race

Người test cần hiểu và giải thích được:

1. **Gửi đồng thời thật.** Mỗi "người dùng ảo" của k6 gửi đúng một request, tất cả chờ cùng một mốc giờ rồi mới gửi. Độ lệch thời điểm gửi đo được 0–1 ms.
2. **Oracle là dữ liệu trong CSDL, không phải mã HTTP.** API có thể trả 200 cho mọi request mà dữ liệu vẫn sai.
3. **Nhóm đối chứng tuần tự.** Gửi đúng các request đó lần lượt. Đây là cách tách lỗi race khỏi lỗi logic.
4. **Lặp nhiều vòng và báo tỉ lệ**, vì race không xảy ra 100% mỗi lần.

**Cách phân loại kết quả**

| Đồng thời | Tuần tự | Kết luận |
|---|---|---|
| FAIL | PASS | Lỗi **race** |
| FAIL | FAIL | Lỗi **logic** (không phải race) |
| PASS | PASS | Hệ thống **đúng** với test case này |
| PASS | FAIL | Bất thường, kiểm tra lại bộ test |

## 6. Chi phí test (người test ghi)

Ghi **thời gian thực tế** của mình và thời gian máy:

| Hạng mục | Người test | Số giờ (người-giờ) | Ghi chú |
|---|---|---|---|
| Chuẩn bị môi trường | | | |
| Chạy test tự động (a, b) | | | máy chạy khoảng 3 phút |
| Kiểm tra độc lập bằng tay | | | |
| Ghi phiếu kết quả và phân tích | | | |

Chi phí máy đo thật được sinh tự động trong báo cáo kết quả. Chi phí tiền: 0 đồng (công cụ miễn phí, chạy trên máy cá nhân).

## 7. Kế hoạch test giữa kỳ (người test nắm)

- **Phạm vi:** luồng đặt, đổi, hủy lịch; event 1-1, event có ghế, event cần xác nhận, giới hạn số booking.
- **Giả định:** một Cal.com, một PostgreSQL, chạy local, rate limit tắt, host không nối lịch ngoài.
- **Tiêu chí:** một vòng vi phạm là test case FAIL; lỗi là race khi tuần tự PASS.
- **Lịch:** Sprint 1 xong; harness và 20 test case đã chạy; còn lại Playwright qua giao diện, chạy lại trên máy khác, đề xuất sửa, hoàn thiện báo cáo.

## 8. Phiếu ghi kết quả (người test điền)

Điền ngay sau khi chạy từng test case. Mỗi dòng phải có **bằng chứng** (đường dẫn file hoặc ảnh chụp).

| TC | Người test | Ngày giờ | Đồng thời: số vòng vi phạm / 10 | Tuần tự: số vòng vi phạm / 10 | Dữ liệu trong CSDL (số booking, ghế…) | Kết luận | Bằng chứng |
|---|---|---|---|---|---|---|---|
| TC-01 | | | | | | | |
| TC-02 | | | | | | | |
| TC-03 | | | | | | | |
| TC-04 | | | | | | | |
| TC-05 | | | | | | | |
| TC-06 | | | | | | | |
| TC-07 | | | | | | | |
| TC-08 | | | | | | | |
| TC-09 | | | | | | | |
| TC-10 | | | | | | | |
| TC-11 | | | | | | | |
| TC-12 | | | | | | | |
| TC-13 | | | | | | | |
| TC-14 | | | | | | | |
| TC-15 | | | | | | | |
| TC-16 | | | | | | | |
| TC-17 | | | | | | | |
| TC-18 | | | | | | | |
| TC-19 | | | | | | | |
| TC-20 | | | | | | | |

Số liệu có sẵn trong `results/giua-ky-race/REPORT.md` và `results/giua-ky-sequential/REPORT.md`. Bảng kết quả dựng sẵn từ số liệu thật: [KET_QUA_TEST_GIUA_KY.md](KET_QUA_TEST_GIUA_KY.md).

## 9. Phiếu báo lỗi (cho mỗi lỗi tìm thấy)

Dùng mẫu sau cho từng lỗi để lỗi là **lỗi thật, có thể kiểm chứng**:

| Trường | Nội dung |
|---|---|
| Mã lỗi | D1, D2… |
| Tóm tắt | Một câu nói rõ hiện tượng |
| Loại | Race hoặc logic (theo bảng phân loại ở phần 5) |
| Mức độ | Cao / Trung bình / Thấp, kèm lý do |
| Tiền điều kiện | Dữ liệu và cấu hình cần có |
| Các bước tái hiện | Lệnh cụ thể, theo thứ tự |
| Kết quả thực tế | Mã HTTP và dữ liệu trong CSDL |
| Kết quả mong đợi | Theo invariant |
| Tái hiện độc lập | Có hay không (bằng `curl`), số lần thử |
| Bằng chứng | Đường dẫn file kết quả hoặc ảnh |

Lỗi đã được ghi theo mẫu này trong [DEFECTS.md](DEFECTS.md).

## 10. Dựng báo cáo giữa kỳ từ kết quả

Dùng phiếu kết quả để điền báo cáo theo đúng thứ tự yêu cầu của giảng viên:

| Mục của báo cáo | Lấy dữ liệu ở đâu |
|---|---|
| 1. Quy trình test | Phần 2 của tài liệu này |
| 2. Danh sách test case | Phần 3 |
| 3. Chi phí test | Phần 6 và mục chi phí trong `KET_QUA_TEST_GIUA_KY.md` |
| 4. Kế hoạch test | Phần 7 và [QUY_TRINH_TEST.md](QUY_TRINH_TEST.md) mục 4 |
| 5. Cách test, kỹ thuật test | Phần 4 và 5 |
| 6. Kết quả test và lỗi | Phiếu kết quả (phần 8), [KET_QUA_TEST_GIUA_KY.md](KET_QUA_TEST_GIUA_KY.md), [MINH_CHUNG_LOI.md](MINH_CHUNG_LOI.md) |
| 7. Kết luận, việc còn lại | Tỉ lệ test case PASS/FAIL, danh sách lỗi, kế hoạch tiếp theo |

## 11. Nguyên tắc khi trình bày kết quả

- Chỉ nêu số liệu **có trong file kết quả** và có bằng chứng.
- Nói đúng loại lỗi: race hay logic.
- Nói rõ điều chưa làm: chưa báo lỗi cho Cal.com, chưa sửa mã Cal.com, chưa kiểm tra trên bản mới hơn.
- Nếu một lần chạy bị chạy chồng với lượt khác, **chạy lại từ đầu** thay vì dùng kết quả đó.
