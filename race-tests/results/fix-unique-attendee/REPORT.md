# Kết quả chạy race test – 2026-10-20T13-48-43-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-20T13:48:44.577Z · Kết thúc: 2026-10-20T13:49:02.901Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S16 | Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế) | 6 | 0/10 | 0% | **PASS** | 1 | 240 |

## S16 – Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế)

Invariant: I11 – một email chỉ chiếm tối đa 1 ghế trong một slot

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-02-13T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 2 | 2031-02-14T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 3 | 2031-02-15T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 4 | 2031-02-16T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 5 | 2031-02-17T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 6 | 2031-02-18T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 7 | 2031-02-19T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 8 | 2031-02-20T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 9 | 2031-02-21T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
| 10 | 2031-02-22T09:00 | PASS | 200×1 400×5 | {"success":1,"seatsOfSameEmail":1} | 400 
Invalid `tx.booking.update()` invocation in
/Users/nthtam/Lưu trữ/kiem_thu_pm/calcom/apps/web/.next/dev/server/chunks/packages_features_bookings_1c3c34cb._.js:8843:26

  8840     });
  8841 }
  8842 // Create the attendee and seat atomically within the transaction
→ 8843 await tx.booking.update(
Unique constraint failed on the fields: (`"bookingId"`, `lower(email`) |
