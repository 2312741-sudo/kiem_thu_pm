# Kết quả chạy race test – 2026-10-08T19-59-54-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T19:59:54.082Z · Kết thúc: 2026-10-08T20:00:10.364Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 2 | 10/10 | 100% | **FAIL** | 0 | 140 |

## S2 – Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-04-15T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 2 | 2027-04-16T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 3 | 2027-04-17T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 4 | 2027-04-18T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 5 | 2027-04-19T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 6 | 2027-04-20T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 7 | 2027-04-21T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 8 | 2027-04-22T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 9 | 2027-04-23T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 10 | 2027-04-24T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |

Vi phạm ghi nhận:

- Vòng 1 · I1: 1 cặp chồng giờ giữa 2 booking active: 3QcJE4fD(09:00–09:30 accepted), rni7dCQN(09:03–09:33 accepted)
- Vòng 2 · I1: 1 cặp chồng giờ giữa 2 booking active: 2UTvniT9(09:03–09:33 accepted), eQN8HJMd(09:00–09:30 accepted)
- Vòng 3 · I1: 1 cặp chồng giờ giữa 2 booking active: kEWaEVmN(09:03–09:33 accepted), oj9nyP9t(09:00–09:30 accepted)
- Vòng 4 · I1: 1 cặp chồng giờ giữa 2 booking active: jgg6r2bq(09:03–09:33 accepted), mydQSgV2(09:00–09:30 accepted)
- Vòng 5 · I1: 1 cặp chồng giờ giữa 2 booking active: 9zrUFxmH(09:00–09:30 accepted), fgVsuqdh(09:03–09:33 accepted)
- Vòng 6 · I1: 1 cặp chồng giờ giữa 2 booking active: fY27Wmdu(09:00–09:30 accepted), oxDj2GPg(09:03–09:33 accepted)
- Vòng 7 · I1: 1 cặp chồng giờ giữa 2 booking active: iyfyWBMq(09:03–09:33 accepted), qWaUB2fE(09:00–09:30 accepted)
- Vòng 8 · I1: 1 cặp chồng giờ giữa 2 booking active: bcRrtoNX(09:03–09:33 accepted), xaFNR9v8(09:00–09:30 accepted)
- Vòng 9 · I1: 1 cặp chồng giờ giữa 2 booking active: ba19mFTw(09:00–09:30 accepted), aMYcygXN(09:03–09:33 accepted)
- Vòng 10 · I1: 1 cặp chồng giờ giữa 2 booking active: vvndKSJh(09:00–09:30 accepted), bN5KY6E3(09:03–09:33 accepted)
