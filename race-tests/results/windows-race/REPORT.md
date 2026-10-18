# Kết quả chạy race test – 2026-10-18T19-14-24-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-18T19:15:22.060Z · Kết thúc: 2026-10-18T19:18:51.956Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S1 | Nhiều người cùng đặt đúng một slot (event 1-1) | 10 | 0/10 | 0% | **PASS** | 1 | 9703 |
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 10/10 | 100% | **FAIL** | 0 | 1631 |
| S3 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 6 | 10/10 | 100% | **FAIL** | 0 | 828 |
| S4 | Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người | 6 | 0/10 | 0% | **PASS** | 0 | 1780 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 10/10 | 100% | **FAIL** | 0 | 1494 |
| S6 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 5 | 10/10 | 100% | **FAIL** | 8 | 832 |
| S7 | Hủy và đổi lịch cùng lúc trên một booking | 2 | 10/10 | 100% | **FAIL** | 0 | 372 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 8 | 10/10 | 100% | **FAIL** | 0 | 761 |

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
| 1 | 2027-04-15T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 2 | 2027-04-16T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 3 | 2027-04-17T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 4 | 2027-04-18T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 5 | 2027-04-19T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 6 | 2027-04-20T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 7 | 2027-04-21T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 8 | 2027-04-22T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 9 | 2027-04-23T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |
| 10 | 2027-04-24T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10} |  |

Vi phạm ghi nhận:

- Vòng 1 · I1: 45 cặp chồng giờ giữa 10 booking active: dSeHaD64(08:36–09:36 accepted), 87RqYBw4(09:03–09:33 accepted), rFQJCrpE(09:21–09:51 accepted), sjRN4gRv(09:00–09:30 accepted), v3Qr1MHx(09:12–09:42 accepted), eYzFonJ1(09:27–09:57 accepted), rqDxxzp9(08:54–09:54 accepted), ad21fnwR(08:45–09:45 accepted), eNy892QX(09:09–09:39 accepted), eY2EN41t(09:18–09:48 accepted)
- Vòng 2 · I1: 45 cặp chồng giờ giữa 10 booking active: kBVKSr32(09:12–09:42 accepted), eRdv8Zj5(09:00–09:30 accepted), otozPg9T(08:36–09:36 accepted), 6r6eBboi(08:45–09:45 accepted), vH3Wr9nr(08:54–09:54 accepted), fVYV3ELS(09:03–09:33 accepted), w2yqNWTk(09:09–09:39 accepted), hLjUaEuQ(09:18–09:48 accepted), kt4w4ZYd(09:27–09:57 accepted), dgqVokkg(09:21–09:51 accepted)
- Vòng 3 · I1: 45 cặp chồng giờ giữa 10 booking active: frP1yxeg(08:54–09:54 accepted), qsFbULW2(08:36–09:36 accepted), kNBHVBCP(09:09–09:39 accepted), w3iUgo73(09:18–09:48 accepted), kXWyUxJm(09:21–09:51 accepted), fz8yYEry(09:12–09:42 accepted), 4Rc6GYdJ(08:45–09:45 accepted), pvRR7fPf(09:03–09:33 accepted), 533167bt(09:27–09:57 accepted), nZQZVb1c(09:00–09:30 accepted)
- Vòng 4 · I1: 45 cặp chồng giờ giữa 10 booking active: d6qkrbYy(09:18–09:48 accepted), nQxzjBwR(09:27–09:57 accepted), xyaDtwZY(09:21–09:51 accepted), nvixZ1sj(08:54–09:54 accepted), 9mwQ8NAj(09:03–09:33 accepted), kKLg8MkP(09:09–09:39 accepted), e7Pgp7y7(09:12–09:42 accepted), 2AUYV2xP(09:00–09:30 accepted), d4JK7o8R(08:36–09:36 accepted), 8JNuC4ai(08:45–09:45 accepted)
- Vòng 5 · I1: 45 cặp chồng giờ giữa 10 booking active: nbrdXACZ(08:54–09:54 accepted), hmzPnZZU(09:00–09:30 accepted), 1K1za3Cb(08:45–09:45 accepted), 8kfx6rDQ(09:09–09:39 accepted), eTL7mzU7(09:21–09:51 accepted), 6BribV86(08:36–09:36 accepted), s92bEi4Z(09:18–09:48 accepted), 3GpGJXZg(09:12–09:42 accepted), 1GPneb9o(09:27–09:57 accepted), tpJoxmFo(09:03–09:33 accepted)
- Vòng 6 · I1: 45 cặp chồng giờ giữa 10 booking active: hnU6hDkE(09:27–09:57 accepted), i75ja4fx(09:12–09:42 accepted), 3Hn2tVE1(09:21–09:51 accepted), 8CXiiKV2(09:00–09:30 accepted), dfRYmFTk(08:36–09:36 accepted), 818hbfvR(09:09–09:39 accepted), 4h1sFfcZ(09:18–09:48 accepted), 6bpe5LCQ(09:03–09:33 accepted), uVygMtBp(08:45–09:45 accepted), 8e12tRNV(08:54–09:54 accepted)
- Vòng 7 · I1: 45 cặp chồng giờ giữa 10 booking active: 6L2R8piG(09:12–09:42 accepted), tYfDZ7dB(08:45–09:45 accepted), rNQKA9iZ(09:27–09:57 accepted), aJBWybVT(09:09–09:39 accepted), 3qyXDXjD(09:18–09:48 accepted), qNrVmG6d(08:54–09:54 accepted), 7Qkcxj5Z(08:36–09:36 accepted), 8gtEjUPD(09:21–09:51 accepted), 6fnm5iYv(09:00–09:30 accepted), twt87TQ5(09:03–09:33 accepted)
- Vòng 8 · I1: 45 cặp chồng giờ giữa 10 booking active: hX8y9rg4(09:12–09:42 accepted), uSy3GSff(09:27–09:57 accepted), pfp1cH1x(08:54–09:54 accepted), cGBbMkoG(09:21–09:51 accepted), 3j7bVm7E(08:45–09:45 accepted), mgL78QU6(09:09–09:39 accepted), pVyxTXyT(09:03–09:33 accepted), 9vtC7Vda(09:00–09:30 accepted), qFsYdqV3(08:36–09:36 accepted), p8zNDyEt(09:18–09:48 accepted)
- Vòng 9 · I1: 45 cặp chồng giờ giữa 10 booking active: pjxSfUxv(09:21–09:51 accepted), qqBLqmFT(08:54–09:54 accepted), dVnihqPE(08:36–09:36 accepted), iKNaUu8n(09:03–09:33 accepted), wtip5cB8(09:27–09:57 accepted), n7enz2LK(09:18–09:48 accepted), b7hQFgeq(08:45–09:45 accepted), cDDf5ubS(09:12–09:42 accepted), 5svfgvV4(09:00–09:30 accepted), xqKhx2CL(09:09–09:39 accepted)
- Vòng 10 · I1: 45 cặp chồng giờ giữa 10 booking active: bPJBPkUz(09:18–09:48 accepted), vV5jnCB5(09:27–09:57 accepted), 8cNrJdoD(08:54–09:54 accepted), hNFe9daD(08:36–09:36 accepted), tvJFrtLa(09:12–09:42 accepted), 5RCHGk8Z(09:03–09:33 accepted), m2gn7p9U(09:21–09:51 accepted), xr3tJiHZ(09:00–09:30 accepted), 6Pyd79Tk(08:45–09:45 accepted), 7gomiHz8(09:09–09:39 accepted)

## S3 – Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống)

Invariant: I2 – không vượt 3 ghế; I2b – còn ghế thì không được từ chối người đặt

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-07-24T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 2 | 2027-07-25T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 3 | 2027-07-26T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 4 | 2027-07-27T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 5 | 2027-07-28T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 6 | 2027-07-29T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 7 | 2027-07-30T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 8 | 2027-07-31T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 9 | 2027-08-01T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 10 | 2027-08-02T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |

Vi phạm ghi nhận:

- Vòng 1 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 2 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 3 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 4 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 5 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 6 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 7 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 8 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 9 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 10 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error

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
| 1 | 2028-02-09T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 2 | 2028-02-10T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 3 | 2028-02-11T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 4 | 2028-02-12T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 5 | 2028-02-13T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 6 | 2028-02-14T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 7 | 2028-02-15T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 8 | 2028-02-16T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 9 | 2028-02-17T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 10 | 2028-02-18T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |

Vi phạm ghi nhận:

- Vòng 1 · I3: 45 cặp chồng giờ giữa 10 booking active: s6Zg25TW(09:00–09:30 pending), fqQAVGmk(09:00–09:30 pending), gmjq7zMn(09:00–09:30 pending), ajuRkrt9(09:00–09:30 pending), bSSRH8hW(09:00–09:30 pending), 2UhEkA7J(09:00–09:30 pending), tXrxhFgM(09:00–09:30 pending), 1mmRdZ6L(09:00–09:30 pending), ppG3dY5U(09:00–09:30 pending), ugZSdpVS(09:00–09:30 pending)
- Vòng 2 · I3: 45 cặp chồng giờ giữa 10 booking active: vwDCuaBK(09:00–09:30 pending), 3Z3nf3tq(09:00–09:30 pending), tt5mpEDo(09:00–09:30 pending), 9bJvofNn(09:00–09:30 pending), 9wZTQP75(09:00–09:30 pending), iZ4XenkY(09:00–09:30 pending), sqZAGW7j(09:00–09:30 pending), 8QVj3wV3(09:00–09:30 pending), vRKvzRb7(09:00–09:30 pending), 9ojLhoF9(09:00–09:30 pending)
- Vòng 3 · I3: 45 cặp chồng giờ giữa 10 booking active: fzrg3wSY(09:00–09:30 pending), vJq4vJhL(09:00–09:30 pending), 4TrN7PUr(09:00–09:30 pending), jQvuH1gB(09:00–09:30 pending), cfWJuHC5(09:00–09:30 pending), 2Vancvkq(09:00–09:30 pending), tgK7syTM(09:00–09:30 pending), 76qbX62G(09:00–09:30 pending), 9bbmKYDY(09:00–09:30 pending), snuhyUkL(09:00–09:30 pending)
- Vòng 4 · I3: 45 cặp chồng giờ giữa 10 booking active: 1gd2gFyJ(09:00–09:30 pending), 6wQaUcP5(09:00–09:30 pending), ogAuPKgH(09:00–09:30 pending), fwcTQFmy(09:00–09:30 pending), wpCkXpB2(09:00–09:30 pending), 3nGrjG3u(09:00–09:30 pending), uDJpEpNw(09:00–09:30 pending), qH6PLkhv(09:00–09:30 pending), 6XARSw53(09:00–09:30 pending), 6jQx6bPh(09:00–09:30 pending)
- Vòng 5 · I3: 45 cặp chồng giờ giữa 10 booking active: 8Goq4io6(09:00–09:30 pending), t8G9NjDn(09:00–09:30 pending), 8naHobNB(09:00–09:30 pending), b9ETku3n(09:00–09:30 pending), mwkyDXhb(09:00–09:30 pending), dQ4mvhfG(09:00–09:30 pending), 8s7aY5kw(09:00–09:30 pending), aAyQGguq(09:00–09:30 pending), dGAzomG8(09:00–09:30 pending), 1ytQTqxz(09:00–09:30 pending)
- Vòng 6 · I3: 45 cặp chồng giờ giữa 10 booking active: qqa2GHr1(09:00–09:30 pending), hfEmszv3(09:00–09:30 pending), coQ4eGHK(09:00–09:30 pending), 9Pj7GjBm(09:00–09:30 pending), eEQrJs3f(09:00–09:30 pending), iKmbn3Lc(09:00–09:30 pending), 53v84m1m(09:00–09:30 pending), 1YMnJFMs(09:00–09:30 pending), a1ex7ixT(09:00–09:30 pending), pqLwojNN(09:00–09:30 pending)
- Vòng 7 · I3: 45 cặp chồng giờ giữa 10 booking active: 2A4pQYeg(09:00–09:30 pending), jCzPMiSu(09:00–09:30 pending), fYZx5EfG(09:00–09:30 pending), nFBZjQkA(09:00–09:30 pending), kqgmEGEk(09:00–09:30 pending), s4jECFKz(09:00–09:30 pending), xbuvgFsU(09:00–09:30 pending), ssYZCCAx(09:00–09:30 pending), ggGEPZMm(09:00–09:30 pending), mpUzmJrQ(09:00–09:30 pending)
- Vòng 8 · I3: 45 cặp chồng giờ giữa 10 booking active: bjLKv7HU(09:00–09:30 pending), jtaze4iR(09:00–09:30 pending), 43ix2yzE(09:00–09:30 pending), wz6nE1Fb(09:00–09:30 pending), kgbUMJxe(09:00–09:30 pending), 37XNGTGp(09:00–09:30 pending), geWmKMsE(09:00–09:30 pending), cUQbXDcf(09:00–09:30 pending), 3uKCXJRw(09:00–09:30 pending), gXPsZUJF(09:00–09:30 pending)
- Vòng 9 · I3: 36 cặp chồng giờ giữa 9 booking active: 64i64VVB(09:00–09:30 pending), b6H7JoEK(09:00–09:30 pending), wmLdEhwz(09:00–09:30 pending), qXc6QwaT(09:00–09:30 pending), 95ckz7df(09:00–09:30 pending), seM7RwCY(09:00–09:30 pending), o1EMWLK7(09:00–09:30 pending), 9vM4R288(09:00–09:30 pending), 9qyq69Xp(09:00–09:30 pending)
- Vòng 10 · I3: 45 cặp chồng giờ giữa 10 booking active: fe9pGo6Z(09:00–09:30 pending), rRu5fSpJ(09:00–09:30 pending), v2dJPL32(09:00–09:30 pending), krCc2aL9(09:00–09:30 pending), tsKe54oV(09:00–09:30 pending), qQrTKE9o(09:00–09:30 pending), tz5vRWPW(09:00–09:30 pending), 3MwebWyt(09:00–09:30 pending), k2rSxEPx(09:00–09:30 pending), sgUvgWvd(09:00–09:30 pending)

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

- Vòng 1 · I4: Booking gốc tLUM2U5CKh6mUTb9dv8QTc sinh ra 5 booking mới cùng ACCEPTED: 12:00, 13:00, 10:00, 14:00, 11:00
- Vòng 2 · I4: Booking gốc j5EiBhx27KHNsFJF9mFRsS sinh ra 5 booking mới cùng ACCEPTED: 13:00, 14:00, 11:00, 12:00, 10:00
- Vòng 3 · I4: Booking gốc oWrdEtYdEziVTDuVSZAQor sinh ra 5 booking mới cùng ACCEPTED: 11:00, 10:00, 14:00, 13:00, 12:00
- Vòng 4 · I4: Booking gốc heGSjaCS6j6HqPfGCiD6Dm sinh ra 5 booking mới cùng ACCEPTED: 11:00, 10:00, 14:00, 13:00, 12:00
- Vòng 5 · I4: Booking gốc 1TUCEUz34TE7cYH64vGYWJ sinh ra 5 booking mới cùng ACCEPTED: 14:00, 11:00, 10:00, 12:00, 13:00
- Vòng 6 · I4: Booking gốc jbpkgNXYQyF9YuPxCTjiXY sinh ra 5 booking mới cùng ACCEPTED: 13:00, 14:00, 11:00, 10:00, 12:00
- Vòng 7 · I4: Booking gốc noE6R3Je36WkDJsVVXrLZ8 sinh ra 5 booking mới cùng ACCEPTED: 11:00, 13:00, 10:00, 14:00, 12:00
- Vòng 8 · I4: Booking gốc 1hP5YTKZvHoZzp27Xrm6PZ sinh ra 5 booking mới cùng ACCEPTED: 14:00, 12:00, 13:00, 11:00, 10:00
- Vòng 9 · I4: Booking gốc cCDkibd1erX6emq9WN6K1H sinh ra 5 booking mới cùng ACCEPTED: 12:00, 13:00, 14:00, 10:00, 11:00
- Vòng 10 · I4: Booking gốc g1DJRmmieuQpQqVjzk85w9 sinh ra 5 booking mới cùng ACCEPTED: 12:00, 14:00, 10:00, 11:00, 13:00

## S7 – Hủy và đổi lịch cùng lúc trên một booking

Invariant: I5 – nếu lệnh hủy báo thành công thì không còn booking nào của cuộc hẹn đó active

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-08-27T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 2 | 2028-08-28T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 3 | 2028-08-29T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 4 | 2028-08-30T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 5 | 2028-08-31T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 6 | 2028-09-01T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 7 | 2028-09-02T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 8 | 2028-09-03T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 9 | 2028-09-04T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |
| 10 | 2028-09-05T09:00 | **FAIL** | 200×2 | {"cancel":200,"reschedule":200,"aliveChildren":1} |  |

Vi phạm ghi nhận:

- Vòng 1 · I5: Hủy trả 200 nhưng vẫn còn booking active 1PrHJ2XUxB74UZNPyVrf5Q (reschedule trả 200)
- Vòng 2 · I5: Hủy trả 200 nhưng vẫn còn booking active sTYHoZ82oHz6481vjfKW43 (reschedule trả 200)
- Vòng 3 · I5: Hủy trả 200 nhưng vẫn còn booking active 7SSNzC1C3CP9tuJVBnkif4 (reschedule trả 200)
- Vòng 4 · I5: Hủy trả 200 nhưng vẫn còn booking active kiDYD4Gc26QRq5PCxtUkkv (reschedule trả 200)
- Vòng 5 · I5: Hủy trả 200 nhưng vẫn còn booking active pLpcSepuC5pcS4MmyLjeGv (reschedule trả 200)
- Vòng 6 · I5: Hủy trả 200 nhưng vẫn còn booking active pJw2J8aQd7oYqKi84PNvMU (reschedule trả 200)
- Vòng 7 · I5: Hủy trả 200 nhưng vẫn còn booking active dC71QuDfgfuVGNVUbxoByM (reschedule trả 200)
- Vòng 8 · I5: Hủy trả 200 nhưng vẫn còn booking active 4NVYJNt4X5DSxXcVyuQ7QX (reschedule trả 200)
- Vòng 9 · I5: Hủy trả 200 nhưng vẫn còn booking active 7wfdSitezSrDJxQZ5NN6SG (reschedule trả 200)
- Vòng 10 · I5: Hủy trả 200 nhưng vẫn còn booking active hF395udiGoVc5mwm56EvcB (reschedule trả 200)

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
