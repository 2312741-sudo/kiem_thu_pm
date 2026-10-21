# Kết quả chạy race test – 2026-10-21T11-21-25-sequential

- Chế độ gửi request: **tuần tự (nhóm đối chứng)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-21T11:21:26.398Z · Kết thúc: 2026-10-21T11:23:19.639Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S1 | Nhiều người cùng đặt đúng một slot (event 1-1) | 10 | 0/10 | 0% | **PASS** | 432 | 101 |
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 0/10 | 0% | **PASS** | 431 | 96 |
| S3 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 6 | 0/10 | 0% | **PASS** | 416 | 124 |
| S4 | Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người | 6 | 0/10 | 0% | **PASS** | 350 | 92 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 0/10 | 0% | **PASS** | 514 | 105 |
| S6 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 5 | 10/10 | 100% | **FAIL** | 516 | 163 |
| S7 | Hủy và đổi lịch cùng lúc trên một booking | 2 | 0/10 | 0% | **PASS** | 98 | 101 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 8 | 0/10 | 0% | **PASS** | 281 | 96 |
| S9 | Hai booking khác nhau cùng được đổi lịch sang đúng một slot trống | 2 | 0/10 | 0% | **PASS** | 115 | 117 |
| S10 | Đổi lịch một booking sang slot X đúng lúc có người đặt mới vào slot X | 2 | 0/10 | 0% | **PASS** | 113 | 116 |
| S11 | Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn | 6 | 0/10 | 0% | **PASS** | 433 | 130 |
| S12 | Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau | 6 | 0/10 | 0% | **PASS** | 281 | 117 |
| S13 | Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần | 6 | 0/10 | 0% | **PASS** | 298 | 127 |
| S14 | Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt | 6 | 0/10 | 0% | **PASS** | 319 | 171 |
| S15 | Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab) | 6 | 0/10 | 0% | **PASS** | 297 | 112 |
| S16 | Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế) | 6 | 0/10 | 0% | **PASS** | 328 | 142 |
| S17 | Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host | 10 | 0/10 | 0% | **PASS** | 523 | 163 |
| S18 | Tải cao: 30 người cùng đặt đúng một slot | 30 | 0/10 | 0% | **PASS** | 1391 | 54 |
| S19 | 20 người đặt 20 slot khác nhau không chồng nhau cùng lúc (không được từ chối nhầm) | 20 | 0/10 | 0% | **PASS** | 2017 | 131 |
| S20 | Hủy booking cũ và đặt booking mới vào đúng slot đó cùng lúc | 2 | 0/10 | 0% | **PASS** | 84 | 99 |

## S1 – Nhiều người cùng đặt đúng một slot (event 1-1)

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-01-05T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 2 | 2027-01-06T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 3 | 2027-01-07T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 4 | 2027-01-08T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 5 | 2027-01-09T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 6 | 2027-01-10T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 7 | 2027-01-11T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 8 | 2027-01-12T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 9 | 2027-01-13T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 10 | 2027-01-14T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |

## S2 – Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-04-15T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 2 | 2027-04-16T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 3 | 2027-04-17T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 4 | 2027-04-18T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 5 | 2027-04-19T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 6 | 2027-04-20T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 7 | 2027-04-21T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 8 | 2027-04-22T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 9 | 2027-04-23T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 10 | 2027-04-24T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |

## S3 – Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống)

Invariant: I2 – không vượt 3 ghế; I2b – còn ghế thì không được từ chối người đặt

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-07-24T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 2 | 2027-07-25T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 3 | 2027-07-26T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 4 | 2027-07-27T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 5 | 2027-07-28T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 6 | 2027-07-29T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 7 | 2027-07-30T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 8 | 2027-07-31T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 9 | 2027-08-01T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |
| 10 | 2027-08-02T09:00 | PASS | 200×3 409×3 | {"success":3,"seats":3,"bookingsForSlot":1} | 409 booking_seats_full_error |

## S4 – Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người

Invariant: I2 – không vượt 3 ghế; I2b – đúng 2 người được nhận

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-11-01T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 2 | 2027-11-02T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 3 | 2027-11-03T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 4 | 2027-11-04T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 5 | 2027-11-05T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 6 | 2027-11-06T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 7 | 2027-11-07T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 8 | 2027-11-08T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 9 | 2027-11-09T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |
| 10 | 2027-11-10T09:00 | PASS | 200×2 409×4 | {"success":2,"seats":3} | 409 booking_seats_full_error |

## S5 – Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ)

Invariant: I3 – tối đa 1 booking accepted/pending cho một slot

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-02-09T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 2 | 2028-02-10T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 3 | 2028-02-11T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 4 | 2028-02-12T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 5 | 2028-02-13T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 6 | 2028-02-14T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 7 | 2028-02-15T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 8 | 2028-02-16T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 9 | 2028-02-17T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |
| 10 | 2028-02-18T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 no_available_users_found_error |

## S6 – Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau

Invariant: I4 – một booking gốc sinh tối đa 1 booking mới còn hiệu lực

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-05-19T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 2 | 2028-05-20T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 3 | 2028-05-21T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 4 | 2028-05-22T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 5 | 2028-05-23T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 6 | 2028-05-24T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 7 | 2028-05-25T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 8 | 2028-05-26T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 9 | 2028-05-27T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |
| 10 | 2028-05-28T09:00 | **FAIL** | 200×5 | {"success":5,"aliveChildren":5,"originalStatus":"cancelled"} |  |

Vi phạm ghi nhận:

- Vòng 1 · I4: Booking gốc kK1vaTULYkLEwYRTvHc4X5 sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 2 · I4: Booking gốc knBx8uh1rnsT3an9oVCfHJ sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 3 · I4: Booking gốc uHYJrSrdk1ej1tpJRUMHNU sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 4 · I4: Booking gốc 4wbLeVa1RQFBKCL9YxWaEV sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 5 · I4: Booking gốc jDuB1S41NQ2P5jR2Zjjxvp sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 6 · I4: Booking gốc 19YY9XVxPPAQ4BEmqQdPVH sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 7 · I4: Booking gốc mFt4QcTBfxBkzSUPFQPe4u sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 8 · I4: Booking gốc 2QQXbe4APHUioYUy7M6JgQ sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 9 · I4: Booking gốc v8YLYcrwh6MKvWDMjAo6Zd sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 10 · I4: Booking gốc fEewYZBdEkC4J2RskuV3rc sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00

## S7 – Hủy và đổi lịch cùng lúc trên một booking

Invariant: I5 – nếu lệnh hủy báo thành công thì không còn booking nào của cuộc hẹn đó active

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-08-27T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 2 | 2028-08-28T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 3 | 2028-08-29T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 4 | 2028-08-30T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 5 | 2028-08-31T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 6 | 2028-09-01T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 7 | 2028-09-02T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 8 | 2028-09-03T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 9 | 2028-09-04T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |
| 10 | 2028-09-05T09:00 | PASS | 200×1 400×1 | {"cancel":200,"reschedule":400,"aliveChildren":0} | 400 cancelled_bookings_cannot_be_rescheduled |

## S8 – Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau

Invariant: I6 – số booking active trong ngày ≤ bookingLimits.PER_DAY (=1)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-12-05T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 2 | 2028-12-06T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 3 | 2028-12-07T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 4 | 2028-12-08T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 5 | 2028-12-09T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 6 | 2028-12-10T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 7 | 2028-12-11T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 8 | 2028-12-12T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 9 | 2028-12-13T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 10 | 2028-12-14T09:00 | PASS | 200×1 401×7 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |

## S9 – Hai booking khác nhau cùng được đổi lịch sang đúng một slot trống

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2029-03-15T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 2 | 2029-03-16T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 3 | 2029-03-17T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 4 | 2029-03-18T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 5 | 2029-03-19T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 6 | 2029-03-20T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 7 | 2029-03-21T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 8 | 2029-03-22T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 9 | 2029-03-23T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 10 | 2029-03-24T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |

## S10 – Đổi lịch một booking sang slot X đúng lúc có người đặt mới vào slot X

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2029-06-23T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 2 | 2029-06-24T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 3 | 2029-06-25T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 4 | 2029-06-26T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 5 | 2029-06-27T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 6 | 2029-06-28T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 7 | 2029-06-29T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 8 | 2029-06-30T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 9 | 2029-07-01T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |
| 10 | 2029-07-02T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 no_available_users_found_error |

## S11 – Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn

Invariant: I8 – hai booking liền kề của host cách nhau ≥ buffer (30 phút)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2029-10-01T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 2 | 2029-10-02T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 3 | 2029-10-03T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 4 | 2029-10-04T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 5 | 2029-10-05T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 6 | 2029-10-06T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 7 | 2029-10-07T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 8 | 2029-10-08T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 9 | 2029-10-09T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |
| 10 | 2029-10-10T09:00 | PASS | 200×3 409×3 | {"success":3,"activeBookings":3} | 409 no_available_users_found_error |

## S12 – Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau

Invariant: I9 – tổng thời lượng booking active trong ngày ≤ durationLimits.PER_DAY (30 phút)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-01-09T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 2 | 2030-01-10T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 3 | 2030-01-11T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 4 | 2030-01-12T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 5 | 2030-01-13T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 6 | 2030-01-14T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 7 | 2030-01-15T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 8 | 2030-01-16T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 9 | 2030-01-17T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |
| 10 | 2030-01-18T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1,"minutes":30} | 401 duration_limit_reached |

## S13 – Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần

Invariant: I6 – số booking active trong tuần ≤ bookingLimits.PER_WEEK (=1)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-04-19T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 2 | 2030-04-20T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 3 | 2030-04-21T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 4 | 2030-04-22T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 5 | 2030-04-23T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 6 | 2030-04-24T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 7 | 2030-04-25T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 8 | 2030-04-26T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 9 | 2030-04-27T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |
| 10 | 2030-04-28T09:00 | PASS | 200×1 401×5 | {"success":1,"activeBookings":1} | 401 booking_limit_reached |

## S14 – Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt

Invariant: I10 – một người đặt có tối đa maxActiveBookingsPerBooker (=1) booking active

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-07-28T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 2 | 2030-07-29T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 3 | 2030-07-30T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 4 | 2030-07-31T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 5 | 2030-08-01T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 6 | 2030-08-02T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 7 | 2030-08-03T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 8 | 2030-08-04T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 9 | 2030-08-05T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |
| 10 | 2030-08-06T09:00 | PASS | 200×1 400×5 | {"success":1,"activeBookings":1} | 400 booker_limit_exceeded_error |

## S15 – Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab)

Invariant: I5 – đúng 1 lệnh hủy thành công, các lệnh còn lại bị từ chối; booking cuối cùng ở trạng thái cancelled

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-11-05T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 2 | 2030-11-06T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 3 | 2030-11-07T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 4 | 2030-11-08T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 5 | 2030-11-09T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 6 | 2030-11-10T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 7 | 2030-11-11T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 8 | 2030-11-12T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 9 | 2030-11-13T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |
| 10 | 2030-11-14T09:00 | PASS | 200×1 400×5 | {"success":1,"finalStatus":"cancelled"} | 400 This booking has already been cancelled. |

## S16 – Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế)

Invariant: I11 – một email chỉ chiếm tối đa 1 ghế trong một slot

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-02-13T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 2 | 2031-02-14T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 3 | 2031-02-15T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 4 | 2031-02-16T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 5 | 2031-02-17T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 6 | 2031-02-18T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 7 | 2031-02-19T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 8 | 2031-02-20T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 9 | 2031-02-21T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |
| 10 | 2031-02-22T09:00 | PASS | 200×1 409×5 | {"success":1,"seatsOfSameEmail":1} | 409 already_signed_up_for_this_booking_error |

## S17 – Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-05-24T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 2 | 2031-05-25T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 3 | 2031-05-26T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 4 | 2031-05-27T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 5 | 2031-05-28T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 6 | 2031-05-29T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 7 | 2031-05-30T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 8 | 2031-05-31T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 9 | 2031-06-01T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 10 | 2031-06-02T09:00 | PASS | 200×1 409×9 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |

## S18 – Tải cao: 30 người cùng đặt đúng một slot

Invariant: I1 – không chồng giờ; I7 – không lỗi 5xx / hết kết nối khi tải cao

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-09-01T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 2 | 2031-09-02T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 3 | 2031-09-03T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 4 | 2031-09-04T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 5 | 2031-09-05T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 6 | 2031-09-06T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 7 | 2031-09-07T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 8 | 2031-09-08T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 9 | 2031-09-09T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 10 | 2031-09-10T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |

## S19 – 20 người đặt 20 slot khác nhau không chồng nhau cùng lúc (không được từ chối nhầm)

Invariant: I12 – slot độc lập không ảnh hưởng nhau: mọi request hợp lệ đều thành công

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-12-10T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 2 | 2031-12-11T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 3 | 2031-12-12T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 4 | 2031-12-13T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 5 | 2031-12-14T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 6 | 2031-12-15T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 7 | 2031-12-16T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 8 | 2031-12-17T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 9 | 2031-12-18T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |
| 10 | 2031-12-19T09:00 | PASS | 200×20 | {"success":20,"activeBookings":20} |  |

## S20 – Hủy booking cũ và đặt booking mới vào đúng slot đó cùng lúc

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2032-03-19T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 2 | 2032-03-20T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 3 | 2032-03-21T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 4 | 2032-03-22T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 5 | 2032-03-23T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 6 | 2032-03-24T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 7 | 2032-03-25T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 8 | 2032-03-26T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 9 | 2032-03-27T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
| 10 | 2032-03-28T09:00 | PASS | 200×2 | {"cancel":200,"book":200,"activeBookings":1} |  |
