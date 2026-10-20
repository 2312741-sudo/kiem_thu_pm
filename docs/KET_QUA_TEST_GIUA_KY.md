# Kết quả test giữa kỳ – R05-K15

Sinh tự động từ kết quả thật bằng `npm run midterm-report`. Không sửa tay.

- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000, PostgreSQL 16
- Gửi đồng thời: `2026-10-20T13-37-16-race` · 20:37:17 20/10/2026 → 20:43:41 20/10/2026
- Gửi tuần tự (đối chứng): `2026-10-20T13-43-46-sequential` · 20:43:46 20/10/2026 → 20:45:02 20/10/2026
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
| TC-09 | Hai booking khác nhau cùng được đổi lịch sang đúng một slot trống | 0/10 | 0/10 | **Đúng** | – | {success:1,activeAtTarget:1} | 200×1 409×1 |
| TC-10 | Đổi lịch một booking sang slot X đúng lúc có người đặt mới vào slot X | 0/10 | 0/10 | **Đúng** | – | {success:1,activeAtTarget:1} | 200×1 409×1 |
| TC-11 | Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn | 10/10 | 0/10 | **Lỗi race** | D7 | {success:6,activeBookings:6} | 200×6 |
| TC-12 | Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau | 10/10 | 0/10 | **Lỗi race** | D8 | {success:6,activeBookings:6,minutes:180} | 200×6 |
| TC-13 | Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần | 10/10 | 0/10 | **Lỗi race** | D6 | {success:6,activeBookings:6} | 200×6 |
| TC-14 | Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt | 10/10 | 0/10 | **Lỗi race** | D9 | {success:6,activeBookings:6} | 200×6 |
| TC-15 | Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab) | 10/10 | 0/10 | **Lỗi race** | D10 | {success:6,finalStatus:cancelled} | 200×6 |
| TC-16 | Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế) | 10/10 | 0/10 | **Lỗi race** | D11 | {success:2,seatsOfSameEmail:2} | 200×2 409×4 |
| TC-17 | Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host | 10/10 | 0/10 | **Lỗi race** | D1 | {success:2,activeBookings:2} | 200×2 409×8 |
| TC-18 | Tải cao: 30 người cùng đặt đúng một slot | 0/10 | 0/10 | **Đúng** | – | {success:1,activeBookings:1} | 200×1 409×29 |
| TC-19 | 20 người đặt 20 slot khác nhau không chồng nhau cùng lúc (không được từ chối nhầm) | 0/10 | 0/10 | **Đúng** | – | {success:20,activeBookings:20} | 200×20 |
| TC-20 | Hủy booking cũ và đặt booking mới vào đúng slot đó cùng lúc | 0/10 | 0/10 | **Đúng** | – | {cancel:200,book:409,activeBookings:0} | 200×1 409×1 |

## 2. Tổng hợp

- Tổng số test case: **20**
- Đúng (không có lỗi): **7**
- Có lỗi race: **12**
- Có lỗi logic: **1**
- Tỉ lệ test case phát hiện lỗi: **13/20**

## 3. Chi phí test (đo thật)

| Lần chạy | Vòng | Request | Thời gian máy |
|---|---|---|---|
| Đồng thời | 200 | 1590 | 383 giây |
| Tuần tự (đối chứng) | 200 | 1590 | 76 giây |
| **Tổng** | | **3180** | **460 giây** |

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
| D7 | TC-11 | Lỗi race | 10/10 |
| D8 | TC-12 | Lỗi race | 10/10 |
| D6 | TC-13 | Lỗi race | 10/10 |
| D9 | TC-14 | Lỗi race | 10/10 |
| D10 | TC-15 | Lỗi race | 10/10 |
| D11 | TC-16 | Lỗi race | 10/10 |
| D1 | TC-17 | Lỗi race | 10/10 |

Mô tả chi tiết, nguyên nhân gốc: [DEFECTS.md](DEFECTS.md). Tái hiện độc lập bằng curl: [QUY_TRINH_TEST.md](QUY_TRINH_TEST.md) mục 6.

## 5. Vi phạm ghi nhận (đồng thời)

- **TC-02**: 10/10 vòng. Ví dụ vòng 1, I1: 45 cặp chồng giờ giữa 10 booking active: k6abWJ8n(09:00–09:30 accepted), x9Td2MVb(08:36–09:36 accepted), 9NagFRq9(08:45–09:45 accepted), 14w2E1KE(08:54–09:54 accepted), tevGnMKX(09:03–09:33 accepted), sEjoZdKa(09:09–09:39 accepted), 9pWLaHng(09:12–09:42 accepted), 4fXtQ3y9(09:18–09:48 accepted), taFxpUoC(09:21–09:51 accepted), rnQXwt8y(09:27–09:57 accepted)
- **TC-03**: 10/10 vòng. Ví dụ vòng 1, I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- **TC-05**: 10/10 vòng. Ví dụ vòng 1, I3: 36 cặp chồng giờ giữa 9 booking active: vD7EbEX8(09:00–09:30 pending), 6Ye1ZGAQ(09:00–09:30 pending), unqL8UJc(09:00–09:30 pending), sAmnc2Go(09:00–09:30 pending), x5fVWwz5(09:00–09:30 pending), vuAyNWQ2(09:00–09:30 pending), 7xK2ra2m(09:00–09:30 pending), tZ4vWzCG(09:00–09:30 pending), ff8BPTLK(09:00–09:30 pending)
- **TC-06**: 10/10 vòng. Ví dụ vòng 1, I4: Booking gốc c5oyzyjsej41QNFXhsV1BW sinh ra 5 booking mới cùng ACCEPTED: 12:00, 11:00, 13:00, 14:00, 10:00
- **TC-07**: 10/10 vòng. Ví dụ vòng 1, I5: Hủy trả 200 nhưng vẫn còn booking active g32rWoLdzM3BKc5sPYLFi2 (reschedule trả 200)
- **TC-08**: 10/10 vòng. Ví dụ vòng 1, I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- **TC-11**: 10/10 vòng. Ví dụ vòng 1, I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- **TC-12**: 10/10 vòng. Ví dụ vòng 1, I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- **TC-13**: 10/10 vòng. Ví dụ vòng 1, I6: 6 booking active trong cùng tuần, giới hạn là 1
- **TC-14**: 10/10 vòng. Ví dụ vòng 1, I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- **TC-15**: 10/10 vòng. Ví dụ vòng 1, I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- **TC-16**: 10/10 vòng. Ví dụ vòng 1, I11: Email s16-r1-udup@k15.test chiếm 2 ghế trong cùng một slot
- **TC-17**: 10/10 vòng. Ví dụ vòng 1, I1: 1 cặp chồng giờ giữa 2 booking active: 6mA9V9NF(09:00–09:30 accepted), bhggZxTZ(09:00–10:00 accepted)

## 6. Bằng chứng

- Báo cáo từng chế độ: [giua-ky-race/REPORT.md](../race-tests/results/giua-ky-race/REPORT.md), [giua-ky-sequential/REPORT.md](../race-tests/results/giua-ky-sequential/REPORT.md)
- Dữ liệu thô từng vòng (request đã gửi, phản hồi): thư mục `raw/` cạnh mỗi báo cáo
- Minh chứng tổng hợp: [MINH_CHUNG_LOI.md](MINH_CHUNG_LOI.md)
