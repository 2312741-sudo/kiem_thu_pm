# Kết quả chạy race test – 2026-10-08T20-02-49-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T20:02:49.778Z · Kết thúc: 2026-10-08T20:03:06.010Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 2 | 10/10 | 100% | **FAIL** | 20 | 117 |

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

- Vòng 1 · I1: 1 cặp chồng giờ giữa 2 booking active: a2niNoQU(09:00–09:30 accepted), 866kuBFu(09:03–09:33 accepted)
- Vòng 2 · I1: 1 cặp chồng giờ giữa 2 booking active: 7pnQt2RG(09:00–09:30 accepted), 34iCHE5C(09:03–09:33 accepted)
- Vòng 3 · I1: 1 cặp chồng giờ giữa 2 booking active: m7WnYEVd(09:00–09:30 accepted), czyRmDqM(09:03–09:33 accepted)
- Vòng 4 · I1: 1 cặp chồng giờ giữa 2 booking active: kB4c8bJR(09:00–09:30 accepted), qJucMagH(09:03–09:33 accepted)
- Vòng 5 · I1: 1 cặp chồng giờ giữa 2 booking active: qd652hr4(09:00–09:30 accepted), pEFacbRA(09:03–09:33 accepted)
- Vòng 6 · I1: 1 cặp chồng giờ giữa 2 booking active: fbRzRfWr(09:00–09:30 accepted), 7yjRrvkK(09:03–09:33 accepted)
- Vòng 7 · I1: 1 cặp chồng giờ giữa 2 booking active: iBcySYKA(09:00–09:30 accepted), 4njKH5LF(09:03–09:33 accepted)
- Vòng 8 · I1: 1 cặp chồng giờ giữa 2 booking active: sD4c4fhr(09:00–09:30 accepted), u9A9aNom(09:03–09:33 accepted)
- Vòng 9 · I1: 1 cặp chồng giờ giữa 2 booking active: n71v7QLs(09:00–09:30 accepted), nmCihBHJ(09:03–09:33 accepted)
- Vòng 10 · I1: 1 cặp chồng giờ giữa 2 booking active: wVuNLPxb(09:00–09:30 accepted), qeEeg8om(09:03–09:33 accepted)
