# Minh chứng lỗi – đề tài R05-K15

Tất cả số liệu lấy từ file kết quả trong repo. Bấm vào liên kết để mở file trực tiếp trên GitHub.

Hệ thống kiểm thử: Cal.com v6.2.0 (commit `1c193cca`), chạy local, PostgreSQL 16.

## 1. Kết quả chính: gửi đồng thời (10 vòng mỗi scenario)

Nguồn: [race-tests/results/latest-race/REPORT.md](../race-tests/results/latest-race/REPORT.md)

| Scenario | Mô tả | Vòng vi phạm | Kết luận |
|---|---|---|---|
| S1 | Nhiều người đặt cùng một giờ | 0/10 | PASS |
| **S2** | **Hai giờ chồng lấn (09:00–09:30 và 09:15–09:45)** | **10/10** | **FAIL – lỗi D1** |
| **S3** | **Event có ghế: còn ghế vẫn bị từ chối** | **10/10** | **FAIL – lỗi D2** |
| S4 | Tranh 2 ghế còn lại | 0/10 | PASS |
| **S5** | **Event cần xác nhận: nhiều booking chờ cho một giờ** | **10/10** | **FAIL – lỗi D3** |
| **S6** | **Đổi lịch nhiều lần từ cùng một booking** | **10/10** | **FAIL – lỗi D4** |
| **S7** | **Hủy và đổi lịch cùng lúc đều thành công** | **10/10** | **FAIL – lỗi D5** |
| **S8** | **Vượt giới hạn 1 booking/ngày** | **10/10** | **FAIL – lỗi D6** |

Điểm quan trọng: với S2, mã HTTP đều là 200, nhưng truy vấn trực tiếp cơ sở dữ liệu cho thấy 10 booking cùng tồn tại trên một host. Đó là lý do nhóm kiểm tra trong DB thay vì tin mã HTTP.

## 2. Đối chứng: gửi tuần tự (cùng request, không đồng thời)

Nguồn: [race-tests/results/latest-sequential/REPORT.md](../race-tests/results/latest-sequential/REPORT.md)

| Scenario | Đồng thời | Tuần tự |
|---|---|---|
| S2 (lỗi D1) | FAIL 10/10 | **PASS 0/10** |
| S3 (lỗi D2) | FAIL 10/10 | **PASS 0/10** |
| S5 (lỗi D3) | FAIL 10/10 | **PASS 0/10** |
| S6 (lỗi D4) | FAIL 10/10 | **FAIL 10/10** |
| S7 (lỗi D5) | FAIL 10/10 | **PASS 0/10** |
| S8 (lỗi D6) | FAIL 10/10 | **PASS 0/10** |

Ý nghĩa: S2, S3, S5, S7, S8 chỉ sai khi có đồng thời, nên là lỗi race. S6 sai cả khi tuần tự, nên là lỗi logic (D4), không phải race.

## 3. Chỉ cần hai người

Nguồn: [race-tests/results/sensitivity-n2/REPORT.md](../race-tests/results/sensitivity-n2/REPORT.md)

Với 2 request đồng thời, 20 vòng: S2 vi phạm **20/20 vòng**, S8 vi phạm **20/20 vòng**. Lỗi không cần tải lớn.

## 4. Cửa sổ race

Nguồn: [race-tests/results/window-S2/WINDOW.md](../race-tests/results/window-S2/WINDOW.md)

Request thứ hai gửi trễ Δ mili-giây so với request thứ nhất:

| Δ (ms) | 0 | 10 | 20 | 30 | 35 | 40 | 45 | 50 | 60 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|
| Vòng vi phạm | 10/10 | 10/10 | 10/10 | 10/10 | 4/10 | 2/10 | 2/10 | 4/10 | 0/10 | 0/10 |

Cửa sổ khoảng 30–60 ms.

## 5. Thí nghiệm khắc phục (kiểm chứng nguyên nhân)

Nguồn: [race-tests/results/fix-exclusion/REPORT.md](../race-tests/results/fix-exclusion/REPORT.md) và [race-tests/experiments/exclusion-constraint.sql](../race-tests/experiments/exclusion-constraint.sql)

Thêm ràng buộc không cho hai booking hiệu lực chồng giờ của cùng host:
- S2 và S5 còn đúng **1 booking** mỗi giờ, nên ràng buộc đã chặn đúng lỗi D1 và D3.
- Nhưng người thua nhận **HTTP 500**, không phải 409, vì mã lỗi chưa được xử lý. Đây là lý do cần sửa cả CSDL lẫn mã trả lỗi.
- S8 không đổi (vẫn 8 booking một ngày), vì ràng buộc này không xử lý được kiểu đếm.

## 6. Bằng chứng trong cơ sở dữ liệu (tự kiểm tra)

Chạy lệnh này trên máy có PostgreSQL và Cal.com test để xem các booking chồng giờ của host test:

```bash
psql -h localhost -U postgres -d calendso -c "select uid,status,\"startTime\",\"endTime\" from \"Booking\" where \"userId\"=(select id from users where username='k15host') and status='accepted' order by \"startTime\" limit 12"
```

Số liệu từng vòng cũng nằm trong file `summary.json` cạnh mỗi báo cáo, mục `observed`.

## 7. Dữ liệu thô từng request

Mỗi vòng có đủ ba file trong thư mục `raw/`:
- `*.requests.json`: đúng danh sách request đã gửi.
- `*.console.log`: phản hồi của từng request.
- `*.k6-summary.json`: tóm tắt của k6.

Ví dụ: [race-tests/results/latest-race/raw/](../race-tests/results/latest-race/raw/).

## 8. Mô tả chi tiết từng lỗi

[DEFECTS.md](DEFECTS.md): cách tái hiện, input, kết quả, dòng code gây lỗi, đề xuất sửa.

Lưu ý: mục 1 và 2 dùng số liệu chạy ngày 8/10. Các booking trong DB hiện có thêm dữ liệu từ những lần chạy sau, không ảnh hưởng số liệu trong báo cáo.
