# Kết quả test giữa kỳ – R05-K15

Sinh tự động từ kết quả thật bằng `npm run midterm-report`. Không sửa tay.

- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000, PostgreSQL 16
- Gửi đồng thời: `2026-10-18T06-04-28-race` · 13:04:28 18/10/2026 → 13:07:02 18/10/2026
- Gửi tuần tự (đối chứng): `2026-10-18T06-07-02-sequential` · 13:07:02 18/10/2026 → 13:07:25 18/10/2026
- Số vòng mỗi test case: 10

## 1. Kết quả từng test case

| TC | Mô tả | Đồng thời (vòng vi phạm) | Tuần tự (vòng vi phạm) | Kết luận | Lỗi | Dữ liệu trong CSDL (vòng 1, đồng thời) | HTTP vòng 1 (đồng thời) |
|---|---|---|---|---|---|---|---|
| TC-01 | Nhiều người cùng đặt đúng một slot (event 1-1) | 0/10 | 0/10 | **Đúng** | – | {success:1,activeBookings:1} | 200×1 409×9 |
| TC-02 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10/10 | 0/10 | **Lỗi race** | D1 | {success:10,activeBookings:10} | 200×10 |
| TC-03 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 10/10 | 0/10 | **Lỗi race** | D2 | {success:1,seats:1,bookingsForSlot:1} | 200×1 409×5 |
| TC-04 | Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người | 0/10 | 0/10 | **Đúng** | – | {success:2,seats:3} | 200×2 409×4 |
| TC-05 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10/10 | 0/10 | **Lỗi race** | D3 | {success:9,activeBookings:9,statuses:[pending,pending,pending,pending,pending,pending,pending,pending,pending]} | 200×9 409×1 |
| TC-06 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 10/10 | 10/10 | **Lỗi logic (sai cả khi tuần tự)** | D4 | {success:5,aliveChildren:5,originalStatus:cancelled} | 200×5 |
| TC-07 | Hủy và đổi lịch cùng lúc trên một booking | 10/10 | 0/10 | **Lỗi race** | D5 | {cancel:200,reschedule:200,aliveChildren:1} | 200×2 |
| TC-08 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 10/10 | 0/10 | **Lỗi race** | D6 | {success:8,activeBookings:8} | 200×8 |

## 2. Tổng hợp

- Tổng số test case: **8**
- Đúng (không có lỗi): **2**
- Có lỗi race: **5**
- Có lỗi logic: **1**
- Tỉ lệ test case phát hiện lỗi: **6/8**

## 3. Chi phí test (đo thật)

| Lần chạy | Vòng | Request | Thời gian máy |
|---|---|---|---|
| Đồng thời | 80 | 570 | 154 giây |
| Tuần tự (đối chứng) | 80 | 570 | 23 giây |
| **Tổng** | | **1140** | **176 giây** |

Chi phí tiền: 0 đồng. Công sức người-giờ: ghi ở phiếu trong [HUONG_DAN_NGUOI_TEST.md](HUONG_DAN_NGUOI_TEST.md) mục 6.

## 4. Lỗi tìm được

| Lỗi | Test case | Loại | Số vòng vi phạm (đồng thời) |
|---|---|---|---|
| D1 | TC-02 | Lỗi race | 10/10 |
| D2 | TC-03 | Lỗi race | 10/10 |
| D3 | TC-05 | Lỗi race | 10/10 |
| D4 | TC-06 | Lỗi logic (sai cả khi tuần tự) | 10/10 |
| D5 | TC-07 | Lỗi race | 10/10 |
| D6 | TC-08 | Lỗi race | 10/10 |

Mô tả chi tiết, nguyên nhân gốc: [DEFECTS.md](DEFECTS.md). Tái hiện độc lập bằng curl: [QUY_TRINH_TEST.md](QUY_TRINH_TEST.md) mục 6.

## 5. Vi phạm ghi nhận (đồng thời)

- **TC-02**: 10/10 vòng. Ví dụ vòng 1, I1: 45 cặp chồng giờ giữa 10 booking active: 3MPLBLLg(09:00–09:30 accepted), d2mMn4pt(09:21–09:51 accepted), wc3ymq5F(08:54–09:54 accepted), rJnrjk8K(09:03–09:33 accepted), fKYUSSjE(08:36–09:36 accepted), v1PnErpA(09:12–09:42 accepted), cfG6F7Dx(08:45–09:45 accepted), hRJVu5eE(09:09–09:39 accepted), sSLS4rmT(09:18–09:48 accepted), 5B5z5rZR(09:27–09:57 accepted)
- **TC-03**: 10/10 vòng. Ví dụ vòng 1, I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- **TC-05**: 10/10 vòng. Ví dụ vòng 1, I3: 36 cặp chồng giờ giữa 9 booking active: wBRWTikF(09:00–09:30 pending), fCn7ssMv(09:00–09:30 pending), 2t3Q7wcD(09:00–09:30 pending), mB4sPBJ9(09:00–09:30 pending), vXgnjdXN(09:00–09:30 pending), iuKijYJJ(09:00–09:30 pending), sYvCWyQi(09:00–09:30 pending), 9aBy4bJN(09:00–09:30 pending), ezHuFXu1(09:00–09:30 pending)
- **TC-06**: 10/10 vòng. Ví dụ vòng 1, I4: Booking gốc ddyLtzKCZR4K17ZLCSzpTF sinh ra 5 booking mới cùng ACCEPTED: 11:00, 14:00, 10:00, 13:00, 12:00
- **TC-07**: 10/10 vòng. Ví dụ vòng 1, I5: Hủy trả 200 nhưng vẫn còn booking active viV2kBUXGQiH7FUxmXVQht (reschedule trả 200)
- **TC-08**: 10/10 vòng. Ví dụ vòng 1, I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00

## 6. Bằng chứng

- Báo cáo từng chế độ: [giua-ky-race/REPORT.md](../race-tests/results/giua-ky-race/REPORT.md), [giua-ky-sequential/REPORT.md](../race-tests/results/giua-ky-sequential/REPORT.md)
- Dữ liệu thô từng vòng (request đã gửi, phản hồi): thư mục `raw/` cạnh mỗi báo cáo
- Minh chứng tổng hợp: [MINH_CHUNG_LOI.md](MINH_CHUNG_LOI.md)
