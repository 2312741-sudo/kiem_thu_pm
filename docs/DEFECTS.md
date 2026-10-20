# Danh sách lỗi và phân tích nguyên nhân gốc

Hệ thống: Cal.com `v6.2.0` (commit `1c193cca`), chạy local với PostgreSQL 16, `yarn dev`.
Dữ liệu: host `k15host`, lịch 24/7 UTC, 5 event type tạo bởi `race-tests/fixtures/fixtures.sql`.
Kết quả gốc đợt 1 (8 test case): `race-tests/results/giua-ky-race/` và `giua-ky-sequential/`.
Kết quả đợt 2 (20 test case, chính thức): `race-tests/results/giua-ky-20-race/` (đồng thời) và `giua-ky-20-sequential/` (tuần tự). Chấm điểm rủi ro: [DANH_GIA_RUI_RO.md](DANH_GIA_RUI_RO.md).

## Tổng quan

| ID | Tóm tắt | Scenario | Đồng thời | Tuần tự | Loại | Mức độ |
|---|---|---|---|---|---|---|
| D1 | Host bị đặt chồng nhiều cuộc hẹn khi các slot lệch giờ bắt đầu hoặc khác event type | S2, S17 | 10/10 vòng vi phạm | 0/10 | Race (TOCTOU) | **Nghiêm trọng (25)** |
| D2 | Event có ghế: nhiều người đặt cùng lúc vào slot trống thì chỉ 1 người được nhận, số còn lại bị 409 dù còn ghế | S3 | 10/10 | 0/10 | Race | Trung bình (8) |
| D3 | Event cần xác nhận (`requiresConfirmationWillBlockSlot`): nhiều booking PENDING cho cùng một slot | S5 | 10/10 | 0/10 | Race | Cao (12) |
| D4 | Booking đã đổi lịch vẫn đổi lịch tiếp được: một booking gốc sinh ra nhiều booking mới | S6 | 10/10 | **10/10** | Lỗi logic (không phải race) | **Cao (16)** |
| D5 | Hủy và đổi lịch cùng lúc: cả hai báo thành công, cuộc hẹn đã hủy vẫn còn hiệu lực ở giờ mới | S7 | 10/10 | 0/10 | Race (TOCTOU) | Trung bình (8) |
| D6 | Vượt giới hạn `bookingLimits` (1 booking/ngày hoặc /tuần) khi đặt đồng thời | S8, S13 | 10/10 | 0/10 | Race (TOCTOU) | **Nghiêm trọng (20)** |
| D7 | Bỏ qua thời gian đệm (`afterEventBuffer` 30 phút): 6 booking sát nhau cùng được nhận | S11 | 10/10 | 0/10 | Race (TOCTOU) | Cao (12) |
| D8 | Vượt giới hạn tổng thời lượng `durationLimits` (180 phút so với 30 phút/ngày) | S12 | 10/10 | 0/10 | Race (TOCTOU) | Cao (15) |
| D9 | Vượt `maxActiveBookingsPerBooker`: 1 người có 6 booking đang hoạt động, giới hạn là 1 | S14 | 10/10 | 0/10 | Race (TOCTOU) | Cao (12) |
| D10 | Hủy một booking nhiều lần đồng thời: cả 6 lệnh trả 200, Cal.com gửi 12 email hủy thay vì 2 | S15 | 10/10 | 0/10 | Race (TOCTOU) | Cao (12) |
| D11 | Cùng một email chiếm 2 ghế trong một slot có ghế dù có cơ chế chống đăng ký trùng | S16 | 10/10 | 0/10 | Race (TOCTOU) | Trung bình (6) |
| O1 | Vượt giới hạn booking trả HTTP **401 Unauthorized** thay vì 403 | S8 tuần tự | – | 70/70 request | Sai mã lỗi | Thấp |
| O2 | `uid` booking sinh từ `username + start + Date.now()`: hai request trong cùng mili-giây trùng `uid` | S3, S5 | – | – | Thiết kế kém an toàn | Thấp |

"Vi phạm" nghĩa là sau vòng đó, truy vấn trực tiếp PostgreSQL cho thấy invariant bị phá. Không dựa vào mã HTTP trả về.

Bảy scenario PASS ở cả hai chế độ (10/10 vòng), cho thấy cơ chế bảo vệ hiện có hoạt động đúng và bộ test không báo lỗi giả:
- **S1:** cùng một slot, cùng event. 1 request được nhận, 9 request bị 409 `booking_conflict_error` nhờ `UNIQUE(idempotencyKey)`.
- **S4:** tranh 2 ghế còn lại. Đúng 2 người được nhận, không vượt 3 ghế, nhờ `SELECT … FOR UPDATE` trong `addSeatToBooking`.
- **S9, S10:** đường đổi lịch cũng bị chặn đúng khi hai booking đổi vào cùng một giờ, hoặc đổi lịch tranh giờ với đặt mới (409 `booking_conflict_error`).
- **S18:** 30 request đồng thời vào một slot: 1 thành công, 29 bị 409, không có 5xx.
- **S19:** 20 slot độc lập đặt cùng lúc: cả 20 thành công, không từ chối nhầm.
- **S20:** hủy và đặt lại đúng giờ vừa hủy cùng lúc: không bao giờ có 2 booking active chồng giờ.

---

## D1. Đặt chồng giờ khi các slot không trùng khít

**Tái hiện**

```bash
cd race-tests && npm run race -- --scenarios S2 --rounds 10
```

- **Tiền điều kiện:** host `k15host` trống lịch ngày test. Hai event type `k15-30` (30 phút) và `k15-60` (60 phút).
- **Input:** 10 request đồng thời `POST /api/book/event`. Giờ bắt đầu lệch nhau 3 phút (vd. 09:00, 09:03, 08:36 cho event 60 phút…), mọi khoảng đều chứa mốc 09:29 nên đôi một chồng nhau.
- **Kỳ vọng (I1):** tối đa 1 booking được nhận, các request còn lại bị 409.
- **Thực tế:** 10/10 request trả 200. DB có 10 booking ACCEPTED chồng nhau, tạo ra 45 cặp chồng giờ mỗi vòng.
- **Với chỉ 2 request:** 20/20 vòng vi phạm (`results/sensitivity-n2`).
- **Đối chứng tuần tự:** 1 request được nhận, 9 request bị 409 `no_available_users_found_error`.

**Độ rộng cửa sổ race** (`results/window-S2/WINDOW.md`): 2 request, request thứ hai gửi trễ Δ ms.

| Δ (ms) | 0 | 10 | 20 | 30 | 35 | 40 | 45 | 50 | 60 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|
| Tỉ lệ vòng vi phạm | 100% | 100% | 100% | 100% | 40% | 20% | 20% | 40% | 0% | 0% |

Cửa sổ khoảng 30–60 ms, xấp xỉ thời gian xử lý một request trên máy test. Trên production, thời gian xử lý dài hơn (gọi Google/Outlook Calendar để lấy busy times, mất hàng trăm ms) nên cửa sổ còn rộng hơn.

**Nguyên nhân gốc**

1. `RegularBookingService.createBooking()` (`packages/features/bookings/lib/service/RegularBookingService.ts`) thực hiện "kiểm tra rồi ghi" không có khóa:
   - dòng ~1029–1089 gọi `ensureAvailableUsers()`, đọc busy times để kết luận host còn trống;
   - dòng ~1939 gọi `createBooking()`, mới INSERT.

   Giữa hai bước không có transaction bao trùm, không có `SELECT … FOR UPDATE` hay advisory lock. Mọi request đồng thời đều "thấy" lịch trống. Đây là lỗi TOCTOU (time-of-check to time-of-use) điển hình.
2. Lớp bảo vệ duy nhất ở CSDL là `UNIQUE("idempotencyKey")`. Prisma extension `packages/prisma/extensions/booking-idempotency-key.ts` gán `idempotencyKey = uuidv5("<start>.<end>.<userId>")`. Khóa này chỉ bắt được trường hợp **trùng khít** start, end và host (S1). Hai khoảng 09:00–09:30 và 09:15–09:45 cho ra hai key khác nhau, nên CSDL không chặn.
3. Bảng `Booking` không có ràng buộc loại trừ (exclusion constraint) theo khoảng thời gian.

**Thí nghiệm khắc phục** (`race-tests/experiments/exclusion-constraint.sql`, kết quả `results/fix-exclusion/`)

Thêm ràng buộc:

```sql
EXCLUDE USING gist ("userId" WITH =, tsrange("startTime","endTime") WITH &&)
WHERE (status IN ('accepted','pending'))
```

Chạy lại S2 10 vòng: DB luôn chỉ còn **1** booking active, nên invariant I1 được bảo toàn. Tuy nhiên 9 request thua nhận **HTTP 500**, vì Cal.com chỉ ánh xạ lỗi Prisma `P2002` sang 409 (dòng ~2097). Mã lỗi `23P01` (exclusion violation) rơi vào nhánh lỗi chung, nên vi phạm invariant I7.

**Đề xuất sửa**
- Thêm exclusion constraint như trên cho booking không thuộc event seated.
- Ánh xạ `23P01` sang `409 booking_conflict_error`.
- Hoặc dùng `pg_advisory_xact_lock(hostId)` bao quanh bước "kiểm tra lịch trống + INSERT".

---

## D2. Event có ghế: người đặt sau bị từ chối dù slot còn ghế

**Tái hiện:** `npm run race -- --scenarios S3`

- **Tiền điều kiện:** event `k15-seated` có `seatsPerTimeSlot = 3`, slot đang trống.
- **Input:** 6 request đồng thời đặt cùng slot, mỗi request một email khác nhau.
- **Kỳ vọng (I2, I2b):** đúng 3 người được nhận (đủ 3 ghế), 3 người còn lại bị 409 `booking_seats_full_error`.
- **Thực tế:**
  - 9/10 vòng chỉ **1** người được nhận, 1/10 vòng có 2 người; số còn lại bị 409 `booking_conflict_error`.
  - Không vượt sức chứa, nhưng mỗi vòng mất 1–2 chỗ bán được.
  - Người dùng nhận thông báo "xung đột lịch" sai sự thật.
  - Với 2 request đồng thời: 20/20 vòng, người thứ hai bị từ chối.
- **Đối chứng tuần tự:** đúng 3 người được nhận, 3 người bị `booking_seats_full_error`.

**Nguyên nhân gốc**

`handleSeats()` (`packages/features/bookings/lib/handleSeats/handleSeats.ts`) tìm booking hiện có của slot bằng `findFirst({ eventTypeId, startTime, status: ACCEPTED })`:
- Nếu đã có booking, nó gọi `addSeatToBooking()`, hàm này đã khóa `FOR UPDATE` và hoạt động đúng (S4 PASS).
- Nếu **chưa có**, luồng rơi xuống `createBooking()` để tạo booking mới cho slot.

Khi N request đến cùng lúc vào slot trống, tất cả cùng thấy "chưa có booking", nên tất cả cùng INSERT. Request đầu thắng. Các request sau trùng `idempotencyKey` (cùng start, end, host) hoặc trùng `uid` (O2), nhận `P2002` rồi bị ánh xạ thành 409 `booking_conflict_error`. Code không thử lại theo nhánh "thêm ghế vào booking vừa được tạo".

**Đề xuất sửa:** khi bắt được `P2002` với event seated, đọc lại booking của slot rồi gọi `addSeatToBooking()` (retry một lần). Hoặc tạo booking "vỏ" cho slot bằng `INSERT … ON CONFLICT DO NOTHING` trước, rồi mọi request đều đi qua `addSeatToBooking()`.

---

## D3. Nhiều booking PENDING cho cùng một slot

**Tái hiện:** `npm run race -- --scenarios S5`

- **Tiền điều kiện:** event `k15-confirm` có `requiresConfirmation = true` và `requiresConfirmationWillBlockSlot = true`, tức booking chờ xác nhận vẫn giữ chỗ. Cal.com tôn trọng cờ này khi chạy tuần tự: request thứ hai bị 409 `no_available_users_found_error`.
- **Input:** 10 request đồng thời cùng slot.
- **Kỳ vọng (I3):** tối đa 1 booking PENDING cho slot.
- **Thực tế:**
  - 10/10 vòng vi phạm, mỗi vòng có 7–10 booking PENDING cho cùng slot.
  - Với 2 request: 11/20 vòng vi phạm.
  - Host phải tự từ chối thủ công, còn người đặt tưởng mình đã giữ được chỗ.

**Nguyên nhân gốc**
- Cùng lỗi TOCTOU như D1.
- Thêm nữa, extension `booking-idempotency-key` **chỉ gán key khi `status === ACCEPTED`**. Booking PENDING có `idempotencyKey = NULL`, mà PostgreSQL cho phép nhiều NULL trong cột UNIQUE. Vì vậy với booking cần xác nhận, ngay cả slot trùng khít cũng không có lớp bảo vệ nào ở CSDL.
- Các 409 lẻ tẻ quan sát được (13/100 request) không đến từ cơ chế chống trùng. Chúng là va chạm `uid` ngẫu nhiên khi hai request rơi vào cùng mili-giây (O2).

**Đề xuất sửa:** gán `idempotencyKey` cho cả PENDING khi `requiresConfirmationWillBlockSlot = true`, hoặc dùng exclusion constraint của D1 (đã gồm status `pending`; thí nghiệm cho thấy S5 còn đúng 1 booking/slot).

---

## D4. Link đổi lịch cũ dùng lại được: một booking sinh nhiều booking mới

**Tái hiện:** `npm run race -- --mode sequential --scenarios S6`. Lỗi xảy ra **cả khi gửi tuần tự**.

- **Tiền điều kiện:** booking B (ACCEPTED) lúc 09:00.
- **Input:** 5 request lần lượt `POST /api/book/event` với `rescheduleUid = B` sang 10:00, 11:00, 12:00, 13:00, 14:00.
- **Kỳ vọng (I4):** lần đổi lịch đầu thành công. B chuyển sang CANCELLED (`rescheduled = true`). Các lần sau bị từ chối vì B không còn hiệu lực.
- **Thực tế:** cả 5 lần đều 200. DB có **5 booking ACCEPTED** cùng `fromReschedule = B`, người tham dự nhận 5 lịch hẹn. Kết quả giống nhau ở chế độ đồng thời (10/10) và tuần tự (10/10).

**Nguyên nhân gốc**

`getOriginalRescheduledBooking()` (`packages/features/bookings/lib/handleNewBooking/originalRescheduledBookingUtils.ts`) chỉ chặn khi:

```ts
originalBooking.status === BookingStatus.CANCELLED && !originalBooking.rescheduled
```

Trạng thái `CANCELLED + rescheduled = true` được dùng cho **hai** tình huống khác nhau:
1. Host bấm "Yêu cầu đổi lịch" (`requestReschedule.handler.ts`). Lúc này người tham dự cần đổi lịch được, nên điều kiện cho qua là đúng.
2. Booking **đã được đổi lịch xong** (`createBooking.ts`, dòng ~310–320, đặt `rescheduled: true, status: CANCELLED`).

Hàm không phân biệt hai trường hợp, nên trường hợp 2 vẫn được đổi lịch tiếp. Thêm nữa, `createBooking.ts` cập nhật booking gốc chỉ theo `where: { id }`, không kèm điều kiện trạng thái, nên không có chốt chặn nào ở tầng ghi.

**Đề xuất sửa:**
- Từ chối khi đã tồn tại booking active có `fromReschedule = uid`.
- Hoặc đánh dấu riêng trường hợp "host yêu cầu đổi lịch".
- Ở tầng ghi, dùng `updateMany({ where: { id, status: ACCEPTED|PENDING } })` và kiểm tra `count === 1`. Cách này đồng thời chặn được phần race của S6 và S7.

Đây là lỗi tìm được *nhờ* harness race, nhưng nhóm đối chứng tuần tự chứng minh bản chất của nó không phải race. Vì vậy báo cáo phân loại riêng.

---

## D5. Hủy và đổi lịch cùng lúc đều thành công

**Tái hiện:** `npm run race -- --scenarios S7`

- **Tiền điều kiện:** booking B (ACCEPTED).
- **Input:** đồng thời `POST /api/cancel {uid: B}` và `POST /api/book/event {rescheduleUid: B, start: +2h}`.
- **Kỳ vọng (I5):** nếu lệnh hủy báo thành công thì cuộc hẹn không còn booking active nào. Khi tuần tự, Cal.com đúng là từ chối đổi lịch với `400 cancelled_bookings_cannot_be_rescheduled`.
- **Thực tế:**
  - 10/10 vòng cả hai cùng trả 200.
  - Người dùng nhận "Booking successfully cancelled" nhưng vẫn còn một booking ACCEPTED ở giờ mới.
  - Host vẫn bị chiếm lịch, người tham dự lại nghĩ mình đã hủy.

**Nguyên nhân gốc:** TOCTOU giữa bước đọc và bước ghi.
- `getOriginalRescheduledBooking()` đọc B lúc còn ACCEPTED. Trong khi phần còn lại của luồng đặt lịch đang chạy, `handleCancelBooking` chuyển B sang CANCELLED.
- Sau đó transaction trong `createBooking.ts` vẫn `update` B theo `id`, không kiểm tra trạng thái, rồi `create` booking mới.
- Hai luồng không dùng chung khóa nào trên bản ghi B.

**Đề xuất sửa:**
- Trong transaction đổi lịch, khóa B bằng `SELECT … FOR UPDATE` và kiểm tra lại trạng thái.
- Hoặc dùng `updateMany` có điều kiện `status IN (ACCEPTED, PENDING)` như đề xuất ở D4.

---

## D6. Vượt giới hạn số booking mỗi ngày

**Tái hiện:** `npm run race -- --scenarios S8`

- **Tiền điều kiện:** event `k15-limit` có `bookingLimits = {"PER_DAY": 1}`.
- **Input:** 8 request đồng thời, 8 giờ khác nhau (không chồng) trong cùng một ngày.
- **Kỳ vọng (I6):** tối đa 1 booking/ngày.
- **Thực tế:** 10/10 vòng có **8/8** booking được nhận. Với 2 request: 20/20 vòng có 2 booking.
- **Đối chứng tuần tự:** đúng 1 booking, 7 request bị từ chối với `booking_limit_reached`.

**Nguyên nhân gốc:** `CheckBookingLimitsService._checkBookingLimit()` (`packages/features/bookings/lib/checkBookingLimits.ts`) gọi `countBookingsByEventTypeAndDateRange()` rồi so sánh với giới hạn. Phép đếm và lệnh INSERT về sau là hai bước tách rời, không có khóa.

**Thí nghiệm khắc phục:** exclusion constraint của D1 **không** sửa được D6 (`results/fix-exclusion`: vẫn 8/8), vì các booking không chồng giờ. Invariant dạng "đếm" cần cơ chế khác:
- `pg_advisory_xact_lock(eventTypeId, ngày)` bao quanh bước đếm + INSERT;
- hoặc transaction mức `SERIALIZABLE` có retry.

---

## D7. Bỏ qua thời gian đệm (buffer) khi đặt đồng thời

**Tái hiện:** `npm run race -- --scenarios S11` hoặc `bash race-tests/repro/repro-curl-2.sh` (phần D7)

- **Tiền điều kiện:** event `k15-buffer` (30 phút, `afterEventBuffer = 30`), khung 09:00–13:00 trống.
- **Input:** 6 request đồng thời đặt 09:00, 09:30, 10:00, 10:30, 11:00, 11:30.
- **Kỳ vọng (I8):** tối đa 3 booking (09:00, 10:00, 11:00), hai booking liền kề cách nhau ≥ 30 phút.
- **Thực tế:** 10/10 vòng cả 6 request trả 200; CSDL có 6 booking cách nhau 0 phút. Với 2 request: 10/10 vòng vi phạm.
- **Đối chứng tuần tự:** 3 thành công, 3 bị `no_available_users_found_error`.

**Nguyên nhân gốc:** thời gian đệm được tính khi đọc lịch bận của host (`ensureAvailableUsers`, truyền `beforeEventBuffer` và `afterEventBuffer`), tức một bước đọc trước khi ghi như D1.

**Đề xuất sửa:** cùng cơ chế với D1: khóa theo host bao quanh bước kiểm tra lịch và INSERT. Exclusion constraint thuần theo `tsrange(startTime, endTime)` chưa đủ, vì phải mở rộng khoảng giờ thêm buffer.

---

## D8. Vượt giới hạn tổng thời lượng mỗi ngày

**Tái hiện:** `npm run race -- --scenarios S12` hoặc `repro-curl-2.sh` (phần D8)

- **Tiền điều kiện:** event `k15-duration` (30 phút) có `durationLimits = {"PER_DAY": 30}`.
- **Input:** 6 request đồng thời, 6 giờ khác nhau trong cùng một ngày.
- **Kỳ vọng (I9):** tổng thời lượng booking active trong ngày ≤ 30 phút, tức 1 booking.
- **Thực tế:** 10/10 vòng cả 6 request trả 200, tổng 180 phút.
- **Đối chứng tuần tự:** 1 thành công, 5 bị 401 `duration_limit_reached` (cùng lỗi mã 401 như O1).

**Nguyên nhân gốc:** `checkBookingAndDurationLimits` (`RegularBookingService.ts` dòng ~944) cộng thời lượng các booking hiện có rồi so với giới hạn; INSERT sau đó, không khóa. Cùng họ với D6.

**Đề xuất sửa:** như D6: `pg_advisory_xact_lock(eventTypeId, ngày)` bao quanh bước đếm và INSERT.

---

## D9. Vượt giới hạn số booking đang hoạt động của một người đặt

**Tái hiện:** `npm run race -- --scenarios S14` hoặc `repro-curl-2.sh` (phần D9)

- **Tiền điều kiện:** event `k15-booker` có `maxActiveBookingsPerBooker = 1`.
- **Input:** cùng một email đặt 6 giờ khác nhau, đồng thời.
- **Kỳ vọng (I10):** đúng 1 booking active của email đó.
- **Thực tế:** 10/10 vòng cả 6 request trả 200, email đó có 6 booking active.
- **Đối chứng tuần tự:** 1 thành công, 5 bị 400 `booker_limit_exceeded_error`.

**Nguyên nhân gốc:** `checkActiveBookingsLimitForBooker` (`RegularBookingService.ts` dòng ~702) đếm booking active của email rồi mới tiếp tục luồng đặt lịch; ghi ở bước sau, không khóa theo email.

**Đề xuất sửa:** khóa theo `(eventTypeId, email)` bao quanh bước đếm + INSERT.

---

## D10. Hủy một booking nhiều lần đồng thời đều thành công

**Tái hiện:** `npm run race -- --scenarios S15` hoặc `repro-curl-2.sh` (phần D10)

- **Tiền điều kiện:** booking B (ACCEPTED).
- **Input:** 6 lệnh `POST /api/cancel {uid: B}` đồng thời (mô phỏng bấm hủy nhiều lần hoặc nhiều tab).
- **Kỳ vọng (I5):** đúng 1 lệnh trả 200, 5 lệnh còn lại trả 400 "This booking has already been cancelled."
- **Thực tế:** 10/10 vòng cả 6 lệnh trả 200. Booking cuối cùng vẫn ở trạng thái cancelled nên **dữ liệu không dấu hiệu lỗi**. Nhưng đếm email: một booking bị hủy 6 lần làm Cal.com cố gửi **12 email hủy** (mỗi lần 2: host và người đặt), đối chứng tuần tự là 2. Số 12 đã đo ở `repro-curl-2.sh` (2 lần chạy liên tiếp đều 12) và đối chiếu được với tổng 28 email của một booking qua 4 lần chạy (2 + 12 + 12 + 2).
- **Đối chứng tuần tự:** 1 lệnh 200, 5 lệnh 400.

**Nguyên nhân gốc:** `handleCancelBooking.ts` kiểm tra `bookingToDelete.status === CANCELLED` (dòng ~197, trả 400) trên bản đọc ở đầu hàm; sau đó cập nhật trạng thái bằng `where: { uid }` (dòng ~566, không điều kiện trạng thái) và chạy các tác dụng phụ: webhook `BOOKING_CANCELLED`, email, nhắc nhở workflow, xóa sự kiện lịch ngoài, xử lý hoàn tiền (nếu đã thanh toán, dòng ~605). Không có khóa và không có điều kiện ghi "chỉ khi chưa hủy".

**Chưa kiểm chứng:** ảnh hưởng tới hoàn tiền với booking có thanh toán (cần tích hợp Stripe, ngoài phạm vi đề tài). Chỉ khẳng định được email lặp; webhook và lịch ngoài suy ra từ mã nhưng chưa quan sát.

**Đề xuất sửa:** cập nhật có điều kiện `updateMany({ where: { uid, status: { not: CANCELLED } } })` và chỉ chạy tác dụng phụ khi `count === 1`.

---

## D11. Một người chiếm nhiều ghế trong cùng một slot

**Tái hiện:** `npm run race -- --scenarios S16` hoặc `repro-curl-2.sh` (phần D11)

- **Tiền điều kiện:** event `k15-seated` (3 ghế), slot đã có 1 người đặt trước.
- **Input:** cùng một email đặt 6 lần đồng thời vào slot đó.
- **Kỳ vọng (I11):** email đó chiếm đúng 1 ghế; các request còn lại bị 409 `already_signed_up_for_this_booking_error`.
- **Thực tế:** 10/10 vòng email đó chiếm **2 ghế**, 2 request 200, 4 request 409 `booking_seats_full_error` (hết ghế). Một người chiếm 2/3 ghế của event.
- **Đối chứng tuần tự:** 1 thành công, 5 bị 409 `already_signed_up_for_this_booking_error`: cơ chế chống trùng hoạt động tốt khi các request đến lần lượt.

**Nguyên nhân gốc:** `handleSeats.ts` (dòng ~205–215) kiểm tra người này đã đăng ký slot chưa trên bản `seatedBooking` đọc **trước** khi khóa. Khóa `FOR UPDATE` nằm ở `createNewSeat.ts` (dòng ~53), sau bước kiểm tra, và không kiểm tra lại. Nhiều request cùng email qua kiểm tra rồi lần lượt thêm ghế.

**Thí nghiệm khắc phục** (`race-tests/experiments/unique-attendee.sql`, kết quả `results/fix-unique-attendee/`): thêm chỉ mục duy nhất `("bookingId", lower(email))` trên bảng `Attendee`. Chạy lại S16 10 vòng: **PASS 10/10**, mỗi vòng 1 người được nhận, 5 người bị HTTP 400, không có 500. Chứng minh test case phát hiện đúng lỗi này. (Chỉ mục chỉ dùng trên CSDL test và đã gỡ sau thí nghiệm; bản sửa thật cần xem xét các luồng hợp lệ có cùng email nhiều lần trong một booking.)

**Đề xuất sửa:** kiểm tra lại "đã đăng ký chưa" bên trong transaction sau khi khóa dòng, hoặc dùng chỉ mục duy nhất như trên.

---

## Thí nghiệm khắc phục bổ sung cho D1 và D3 (đợt 2)

`results/fix-exclusion-20/` (ràng buộc loại trừ của D1 trên CSDL test, đã gỡ sau thí nghiệm):

| Test case | Không có ràng buộc | Có ràng buộc loại trừ |
|---|---|---|
| S2 (D1) | 10 booking chồng giờ | 1 booking; 9 request thua nhận HTTP 500 |
| S5 (D3) | 9 đến 10 booking pending cùng giờ | 1 booking pending; 9 request thua nhận HTTP 500 |
| S17 (D1) | 2 booking chồng giờ | 1 booking; 4 request thua 409, 5 request thua HTTP 500 |

Invariant I1 và I3 được bảo toàn (không còn vi phạm), nhưng người thua nhận 500 (vi phạm I7) vì Cal.com chưa ánh xạ mã lỗi `23P01` của ràng buộc loại trừ sang 409. Sửa phải làm ở cả hai tầng.

---

## O1. Vượt giới hạn booking trả 401 Unauthorized

Trong `checkBookingLimits.ts:44`:

```ts
} catch (error) {
  throw new HttpError({ message: getErrorFromUnknown(error).message, statusCode: 401 });
}
```

Lỗi gốc `booking_limit_reached` (403) bị bọc lại thành 401. Client hiểu nhầm là chưa đăng nhập. Nhóm quan sát được 70/70 request ở S8 tuần tự trả 401. Đề xuất: giữ nguyên `statusCode` của `HttpError` gốc.

## O2. `uid` booking có thể trùng giữa các request đồng thời

`RegularBookingService.ts:1441`:

```ts
const seed = `${organizerUser.username}:${dayjs(reqBody.start).utc().format()}:${new Date().getTime()}`;
const uid = translator.fromUUID(uuidv5(seed, uuidv5.URL));
```

Hai request cùng host, cùng giờ bắt đầu, xử lý trong cùng mili-giây sẽ có cùng `uid`. Log server ghi nhận 45 lần `Unique constraint failed on the fields: (uid)` trong quá trình chạy test. Hậu quả hiện tại: request bị 409 ngẫu nhiên. Đây là cơ chế "chống trùng" vô tình, phụ thuộc thời điểm, không thể dựa vào. Đề xuất: sinh `uid` ngẫu nhiên (`uuidv4`), giao việc chống trùng cho ràng buộc chuyên biệt.
