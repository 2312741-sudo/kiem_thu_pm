# Kết quả chạy race test – 2026-10-08T20-04-43-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T20:04:43.444Z · Kết thúc: 2026-10-08T20:04:59.808Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 2 | 0/10 | 0% | **PASS** | 100 | 96 |

## S2 – Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-04-15T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 2 | 2027-04-16T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 3 | 2027-04-17T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 4 | 2027-04-18T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 5 | 2027-04-19T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 6 | 2027-04-20T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 7 | 2027-04-21T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 8 | 2027-04-22T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 9 | 2027-04-23T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 10 | 2027-04-24T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
