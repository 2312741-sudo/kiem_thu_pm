# Kết quả chạy race test – 2026-10-08T20-02-17-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T20:02:17.075Z · Kết thúc: 2026-10-08T20:02:33.439Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 2 | 10/10 | 100% | **FAIL** | 0 | 164 |

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

- Vòng 1 · I1: 1 cặp chồng giờ giữa 2 booking active: tuGDX2DA(09:03–09:33 accepted), ieyLTfYM(09:00–09:30 accepted)
- Vòng 2 · I1: 1 cặp chồng giờ giữa 2 booking active: rRKhVyEp(09:00–09:30 accepted), cyBHsbw9(09:03–09:33 accepted)
- Vòng 3 · I1: 1 cặp chồng giờ giữa 2 booking active: ufdfBCmg(09:00–09:30 accepted), 7CsPctJR(09:03–09:33 accepted)
- Vòng 4 · I1: 1 cặp chồng giờ giữa 2 booking active: 94XX6utn(09:00–09:30 accepted), fL1GevEo(09:03–09:33 accepted)
- Vòng 5 · I1: 1 cặp chồng giờ giữa 2 booking active: aKTvKfAA(09:00–09:30 accepted), fPUqi4dj(09:03–09:33 accepted)
- Vòng 6 · I1: 1 cặp chồng giờ giữa 2 booking active: cR5EQwM3(09:00–09:30 accepted), 5yPK99Gz(09:03–09:33 accepted)
- Vòng 7 · I1: 1 cặp chồng giờ giữa 2 booking active: 2p25Rcuu(09:00–09:30 accepted), 5MxLqTFk(09:03–09:33 accepted)
- Vòng 8 · I1: 1 cặp chồng giờ giữa 2 booking active: rxjQYKor(09:03–09:33 accepted), 3g3hCtsJ(09:00–09:30 accepted)
- Vòng 9 · I1: 1 cặp chồng giờ giữa 2 booking active: 8aeWEzn9(09:00–09:30 accepted), tLH2bNyg(09:03–09:33 accepted)
- Vòng 10 · I1: 1 cặp chồng giờ giữa 2 booking active: bnJqBNn1(09:00–09:30 accepted), 7yQdBm2j(09:03–09:33 accepted)
