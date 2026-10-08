# Kết quả chạy race test – 2026-10-08T19-56-18-sequential

- Chế độ gửi request: **tuần tự (nhóm đối chứng)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T19:56:18.475Z · Kết thúc: 2026-10-08T19:56:40.648Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S1 | Nhiều người cùng đặt đúng một slot (event 1-1) | 10 | 0/10 | 0% | **PASS** | 254 | 55 |
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 0/10 | 0% | **PASS** | 249 | 55 |
| S3 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 6 | 0/10 | 0% | **PASS** | 222 | 65 |
| S4 | Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người | 6 | 0/10 | 0% | **PASS** | 191 | 50 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 0/10 | 0% | **PASS** | 277 | 53 |
| S6 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 5 | 10/10 | 100% | **FAIL** | 283 | 79 |
| S7 | Hủy và đổi lịch cùng lúc trên một booking | 2 | 0/10 | 0% | **PASS** | 46 | 50 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 8 | 0/10 | 0% | **PASS** | 198 | 63 |

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

- Vòng 1 · I4: Booking gốc eere1pkoFHCmgPAyr1cwac sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 2 · I4: Booking gốc bqiyD8CcJZogQRSvAdZnPp sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 3 · I4: Booking gốc cYmbYgxdNiZVcycWRLsZXM sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 4 · I4: Booking gốc cT3VN14MAT55mvPZMnmNbQ sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 5 · I4: Booking gốc 3dh4ZrJMByPiWcoDanxv8o sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 6 · I4: Booking gốc 9sqedPUS2opudehWkDscvy sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 7 · I4: Booking gốc 7n527mEZRSJgjxfY2d76f7 sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 8 · I4: Booking gốc b8mjGbyWB3f51Dgv8qWec6 sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 9 · I4: Booking gốc 6q9ZK38kgWmXBDTBHaHfeK sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 10 · I4: Booking gốc f8bRUaadWmAbR7C5cBTMBq sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00

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
