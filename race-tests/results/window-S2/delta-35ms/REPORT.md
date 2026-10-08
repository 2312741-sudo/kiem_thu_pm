# Kết quả chạy race test – 2026-10-08T20-03-22-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T20:03:22.497Z · Kết thúc: 2026-10-08T20:03:38.590Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 2 | 4/10 | 40% | **FAIL** | 35 | 109 |

## S2 – Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-04-15T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 2 | 2027-04-16T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 3 | 2027-04-17T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 4 | 2027-04-18T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 5 | 2027-04-19T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 6 | 2027-04-20T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 7 | 2027-04-21T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 8 | 2027-04-22T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |
| 9 | 2027-04-23T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 10 | 2027-04-24T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1} | 409 no_available_users_found_error |

Vi phạm ghi nhận:

- Vòng 1 · I1: 1 cặp chồng giờ giữa 2 booking active: 5jUSuNGU(09:00–09:30 accepted), j9ZjNFi9(09:03–09:33 accepted)
- Vòng 3 · I1: 1 cặp chồng giờ giữa 2 booking active: uPpkAtZk(09:00–09:30 accepted), 86kkotVZ(09:03–09:33 accepted)
- Vòng 6 · I1: 1 cặp chồng giờ giữa 2 booking active: imoKxkHa(09:00–09:30 accepted), 7qmQCnww(09:03–09:33 accepted)
- Vòng 9 · I1: 1 cặp chồng giờ giữa 2 booking active: 76uSz5uj(09:00–09:30 accepted), fsr3g2Y1(09:03–09:33 accepted)
