# Kết quả chạy race test – 2026-10-20T13-49-14-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-20T13:49:14.395Z · Kết thúc: 2026-10-20T13:50:25.805Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 10/10 | 100% | **FAIL** | 1 | 951 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 10/10 | 100% | **FAIL** | 2 | 948 |
| S17 | Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host | 10 | 10/10 | 100% | **FAIL** | 1 | 761 |

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
- Vòng 1 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
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
- Vòng 5 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #0 (30m@+0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #1 (30m@+3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #2 (60m@+-24) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
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
- Vòng 10 · I7: Request #3 (30m@+9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #4 (30m@+12) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #5 (60m@+-15) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #6 (30m@+18) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #7 (30m@+21) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #8 (60m@+-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #9 (30m@+27) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"

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
| 8 | 2028-02-16T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 9 | 2028-02-17T09:00 | **FAIL** | 200×1 409×1 500×8 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |
| 10 | 2028-02-18T09:00 | **FAIL** | 200×1 500×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |

Vi phạm ghi nhận:

- Vòng 1 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #3 (pending-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #0 (pending-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #1 (pending-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #2 (pending-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #4 (pending-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #5 (pending-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #6 (pending-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #7 (pending-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #8 (pending-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #9 (pending-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"

## S17 – Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-05-24T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |
| 2 | 2031-05-25T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 409 booking_conflict_error; 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 3 | 2031-05-26T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |
| 4 | 2031-05-27T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 409 booking_conflict_error; 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 5 | 2031-05-28T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |
| 6 | 2031-05-29T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |
| 7 | 2031-05-30T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 409 booking_conflict_error; 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap" |
| 8 | 2031-05-31T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |
| 9 | 2031-06-01T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |
| 10 | 2031-06-02T09:00 | **FAIL** | 200×1 409×4 500×5 | {"success":1,"activeBookings":1} | 500 conflicting key value violates exclusion constraint "k15_booking_no_overlap"; 409 booking_conflict_error |

Vi phạm ghi nhận:

- Vòng 1 · I7: Request #0 (30m-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #2 (30m-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #4 (30m-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #6 (30m-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 1 · I7: Request #8 (30m-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #1 (60m-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #3 (60m-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #5 (60m-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #7 (60m-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 2 · I7: Request #9 (60m-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #0 (30m-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #2 (30m-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #4 (30m-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #6 (30m-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 3 · I7: Request #8 (30m-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #1 (60m-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #3 (60m-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #5 (60m-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #7 (60m-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 4 · I7: Request #9 (60m-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #0 (30m-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #2 (30m-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #4 (30m-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #6 (30m-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 5 · I7: Request #8 (30m-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #0 (30m-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #2 (30m-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #4 (30m-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #6 (30m-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 6 · I7: Request #8 (30m-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #1 (60m-1) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #3 (60m-3) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #5 (60m-5) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #7 (60m-7) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 7 · I7: Request #9 (60m-9) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #0 (30m-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #2 (30m-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #4 (30m-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #6 (30m-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 8 · I7: Request #8 (30m-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #0 (30m-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #2 (30m-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #4 (30m-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #6 (30m-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 9 · I7: Request #8 (30m-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #0 (30m-0) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #2 (30m-2) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #4 (30m-4) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #6 (30m-6) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
- Vòng 10 · I7: Request #8 (30m-8) trả về 500: conflicting key value violates exclusion constraint "k15_booking_no_overlap"
