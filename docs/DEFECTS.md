# Danh sách lỗi và phân tích nguyên nhân gốc

Hệ thống: Cal.com `v6.2.0` (commit `1c193cca`), chạy local với PostgreSQL 16, `yarn dev`.
Dữ liệu: host `k15host`, lịch 24/7 UTC, 5 event type tạo bởi `race-tests/fixtures/fixtures.sql`.
Kết quả gốc: `race-tests/results/latest-race/` (đồng thời) và `race-tests/results/latest-sequential/` (tuần tự).

## Tổng quan

| ID | Tóm tắt | Scenario | Đồng thời | Tuần tự | Loại | Mức độ |
|---|---|---|---|---|---|---|
| D1 | Host bị đặt chồng nhiều cuộc hẹn khi các slot lệch giờ bắt đầu hoặc khác event type | S2 | 10/10 vòng vi phạm | 0/10 | Race (TOCTOU) | **Cao** |
| D2 | Event có ghế: nhiều người đặt cùng lúc vào slot trống thì chỉ 1 người được nhận, số còn lại bị 409 dù còn ghế | S3 | 10/10 | 0/10 | Race | Trung bình |
| D3 | Event cần xác nhận (`requiresConfirmationWillBlockSlot`): nhiều booking PENDING cho cùng một slot | S5 | 10/10 | 0/10 | Race | Trung bình |
| D4 | Booking đã đổi lịch vẫn đổi lịch tiếp được: một booking gốc sinh ra nhiều booking mới | S6 | 10/10 | **10/10** | Lỗi logic (không phải race) | **Cao** |
| D5 | Hủy và đổi lịch cùng lúc: cả hai báo thành công, cuộc hẹn đã hủy vẫn còn hiệu lực ở giờ mới | S7 | 10/10 | 0/10 | Race (TOCTOU) | Trung bình |
| D6 | Vượt giới hạn `bookingLimits` (1 booking/ngày) khi đặt đồng thời | S8 | 10/10 | 0/10 | Race (TOCTOU) | Trung bình |
| O1 | Vượt giới hạn booking trả HTTP **401 Unauthorized** thay vì 403 | S8 tuần tự | – | 70/70 request | Sai mã lỗi | Thấp |
| O2 | `uid` booking sinh từ `username + start + Date.now()`: hai request trong cùng mili-giây trùng `uid` | S3, S5 | – | – | Thiết kế kém an toàn | Thấp |

"Vi phạm" nghĩa là sau vòng đó, truy vấn trực tiếp PostgreSQL cho thấy invariant bị phá. Không dựa vào mã HTTP trả về.

Hai scenario PASS ở cả hai chế độ, cho thấy cơ chế bảo vệ hiện có hoạt động đúng:
- **S1:** cùng một slot, cùng event. 1 request được nhận, 9 request bị 409 `booking_conflict_error` nhờ `UNIQUE(idempotencyKey)`.
- **S4:** tranh 2 ghế còn lại. Đúng 2 người được nhận, không vượt 3 ghế, nhờ `SELECT … FOR UPDATE` trong `addSeatToBooking`.

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
