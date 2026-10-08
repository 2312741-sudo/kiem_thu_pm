# Kết quả chạy race test – 2026-10-08T20-05-06-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T20:05:06.774Z · Kết thúc: 2026-10-08T20:06:31.413Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S1 | Nhiều người cùng đặt đúng một slot (event 1-1) | 10 | 0/10 | 0% | **PASS** | 1 | 365 |
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 10/10 | 100% | **FAIL** | 1 | 827 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 10/10 | 100% | **FAIL** | 1 | 897 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 8 | 10/10 | 100% | **FAIL** | 1 | 472 |

## S1 – Nhiều người cùng đặt đúng một slot (event 1-1)

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-01-05T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 2 | 2027-01-06T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 3 | 2027-01-07T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 4 | 2027-01-08T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 5 | 2027-01-09T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 6 | 2027-01-10T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 7 | 2027-01-11T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 8 | 2027-01-12T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 9 | 2027-01-13T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 10 | 2027-01-14T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |

## S2 – Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-04-15T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 2 | 2027-04-16T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 3 | 2027-04-17T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 4 | 2027-04-18T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 5 | 2027-04-19T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 6 | 2027-04-20T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 7 | 2027-04-21T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 8 | 2027-04-22T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 9 | 2027-04-23T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 10 | 2027-04-24T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |

Vi phạm ghi nhận:

- Vòng 1 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"

## S5 – Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ)

Invariant: I3 – tối đa 1 booking accepted/pending cho một slot

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-02-09T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 2 | 2028-02-10T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 3 | 2028-02-11T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 4 | 2028-02-12T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 5 | 2028-02-13T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 6 | 2028-02-14T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 7 | 2028-02-15T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 8 | 2028-02-16T09:00 | **FAIL** | 200×1 409×1 500×8 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |
| 9 | 2028-02-17T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 10 | 2028-02-18T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |

Vi phạm ghi nhận:

- Vòng 1 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"

## S8 – Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau

Invariant: I6 – số booking active trong ngày ≤ bookingLimits.PER_DAY (=1)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-12-05T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 2 | 2028-12-06T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 3 | 2028-12-07T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 4 | 2028-12-08T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 5 | 2028-12-09T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 6 | 2028-12-10T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 7 | 2028-12-11T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 8 | 2028-12-12T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 9 | 2028-12-13T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |
| 10 | 2028-12-14T09:00 | **FAIL** | 200×8 | {"success":8,"activeBookings":8} |  |

Vi phạm ghi nhận:

- Vòng 1 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 2 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 3 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 4 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 5 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 6 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 7 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 8 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 9 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
- Vòng 10 · I6: 8 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
