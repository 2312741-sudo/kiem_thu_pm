# Kết quả chạy race test – 2026-10-18T06-04-28-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-18T06:04:28.876Z · Kết thúc: 2026-10-18T06:07:02.534Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S1 | Nhiều người cùng đặt đúng một slot (event 1-1) | 10 | 0/10 | 0% | **PASS** | 1 | 417 |
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 10/10 | 100% | **FAIL** | 1 | 1245 |
| S3 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 6 | 10/10 | 100% | **FAIL** | 1 | 292 |
| S4 | Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người | 6 | 0/10 | 0% | **PASS** | 0 | 254 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 10/10 | 100% | **FAIL** | 1 | 500 |
| S6 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 5 | 10/10 | 100% | **FAIL** | 0 | 364 |
| S7 | Hủy và đổi lịch cùng lúc trên một booking | 2 | 10/10 | 100% | **FAIL** | 0 | 184 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 8 | 10/10 | 100% | **FAIL** | 1 | 1116 |

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

- Vòng 1 · I1: 45 cặp chồng giờ giữa 10 booking active: 3MPLBLLg(09:00–09:30 accepted), d2mMn4pt(09:21–09:51 accepted), wc3ymq5F(08:54–09:54 accepted), rJnrjk8K(09:03–09:33 accepted), fKYUSSjE(08:36–09:36 accepted), v1PnErpA(09:12–09:42 accepted), cfG6F7Dx(08:45–09:45 accepted), hRJVu5eE(09:09–09:39 accepted), sSLS4rmT(09:18–09:48 accepted), 5B5z5rZR(09:27–09:57 accepted)
- Vòng 2 · I1: 45 cặp chồng giờ giữa 10 booking active: vvQahHnR(09:00–09:30 accepted), 3hY2ZV1d(08:45–09:45 accepted), mnp8mBpj(08:36–09:36 accepted), mgz4KEXG(09:21–09:51 accepted), 2yTmpdmX(09:18–09:48 accepted), s11QgnYD(09:27–09:57 accepted), 2iS9cUvL(09:03–09:33 accepted), ksWkuHfD(09:09–09:39 accepted), gJcpRDnC(09:12–09:42 accepted), jCTrQAA2(08:54–09:54 accepted)
- Vòng 3 · I1: 45 cặp chồng giờ giữa 10 booking active: h5pAs731(09:00–09:30 accepted), trPqjLLf(09:12–09:42 accepted), cRy8c5iW(08:45–09:45 accepted), gDfBuEo8(08:36–09:36 accepted), rrmmjcMr(09:09–09:39 accepted), 3rpT33Xe(09:21–09:51 accepted), 7Ygh6abh(09:03–09:33 accepted), tDXunfFu(09:27–09:57 accepted), 1azRJyNe(09:18–09:48 accepted), h51LKtdR(08:54–09:54 accepted)
- Vòng 4 · I1: 45 cặp chồng giờ giữa 10 booking active: mKzLW9vF(09:00–09:30 accepted), 99Mq4qZW(09:03–09:33 accepted), nZmnmTsG(08:45–09:45 accepted), 6wNLP7zc(08:36–09:36 accepted), 2LMabsJD(09:27–09:57 accepted), 1d6wgbNG(09:09–09:39 accepted), kknuPwcF(09:18–09:48 accepted), qeCLFUPZ(08:54–09:54 accepted), aCpZeWgV(09:12–09:42 accepted), noy9ZUFT(09:21–09:51 accepted)
- Vòng 5 · I1: 45 cặp chồng giờ giữa 10 booking active: 55T8Mw1s(09:00–09:30 accepted), 6LNgbssT(08:54–09:54 accepted), arYtLvbw(09:18–09:48 accepted), hXbQkCrq(09:21–09:51 accepted), tmQ6m4mc(09:03–09:33 accepted), riisYQ9E(09:27–09:57 accepted), cx3oejw5(09:09–09:39 accepted), x5ZaLKSv(08:45–09:45 accepted), 16CV2yzE(08:36–09:36 accepted), cJwR6tSy(09:12–09:42 accepted)
- Vòng 6 · I1: 45 cặp chồng giờ giữa 10 booking active: jThdGSpP(09:00–09:30 accepted), a7fLehXb(08:54–09:54 accepted), uxyZXN5n(08:36–09:36 accepted), udBgUYHG(09:27–09:57 accepted), nLB1KH4m(09:21–09:51 accepted), s9m4NB4j(09:03–09:33 accepted), krrvahhb(09:18–09:48 accepted), 3pfNqhcB(09:09–09:39 accepted), f34bU1jT(09:12–09:42 accepted), hiMkQ9rS(08:45–09:45 accepted)
- Vòng 7 · I1: 45 cặp chồng giờ giữa 10 booking active: bZYQkjei(09:00–09:30 accepted), bTuWJssp(08:36–09:36 accepted), mrizZ9iy(09:03–09:33 accepted), etoWTpqx(09:21–09:51 accepted), xvXzv9o5(08:54–09:54 accepted), n7qsP2w2(09:18–09:48 accepted), cyPKoMhG(09:09–09:39 accepted), wPGhNs1D(09:12–09:42 accepted), hwshxYPf(08:45–09:45 accepted), nCP9d8bc(09:27–09:57 accepted)
- Vòng 8 · I1: 45 cặp chồng giờ giữa 10 booking active: tJ43E8QA(09:00–09:30 accepted), 4GwbL1JV(08:36–09:36 accepted), dp8A5Lyv(08:45–09:45 accepted), 1oki27cD(09:27–09:57 accepted), fyqV39Ca(09:03–09:33 accepted), hepCcA5m(09:09–09:39 accepted), na1qbk8z(09:12–09:42 accepted), ap6yFx71(09:18–09:48 accepted), rHeagAEa(09:21–09:51 accepted), qzpTeXXW(08:54–09:54 accepted)
- Vòng 9 · I1: 45 cặp chồng giờ giữa 10 booking active: 5xAhHsZu(09:00–09:30 accepted), 9Z1mm9Bn(08:36–09:36 accepted), vbSwsLyW(09:03–09:33 accepted), v57vi8pA(09:12–09:42 accepted), r631iq8u(09:09–09:39 accepted), mJwonE4T(09:27–09:57 accepted), 9oPGYYye(09:21–09:51 accepted), gCwGGHcR(08:45–09:45 accepted), wTVGgEKk(09:18–09:48 accepted), ecB8dUH4(08:54–09:54 accepted)
- Vòng 10 · I1: 45 cặp chồng giờ giữa 10 booking active: mx1FphH5(09:00–09:30 accepted), op2qf1zn(08:45–09:45 accepted), bi4Za14J(09:09–09:39 accepted), msg9FchW(09:03–09:33 accepted), 1T6f2T8i(09:21–09:51 accepted), tqWaKWsX(09:12–09:42 accepted), rLSC5uhA(09:18–09:48 accepted), mhJcamV4(08:36–09:36 accepted), kQCEvn2p(08:54–09:54 accepted), gZD7RYo5(09:27–09:57 accepted)

## S3 – Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống)

Invariant: I2 – không vượt 3 ghế; I2b – còn ghế thì không được từ chối người đặt

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-07-24T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 2 | 2027-07-25T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seats":2,"bookingsForSlot":1} | 409 booking_conflict_error |
| 3 | 2027-07-26T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 4 | 2027-07-27T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seats":2,"bookingsForSlot":1} | 409 booking_conflict_error |
| 5 | 2027-07-28T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seats":2,"bookingsForSlot":1} | 409 booking_conflict_error |
| 6 | 2027-07-29T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 7 | 2027-07-30T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 8 | 2027-07-31T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seats":2,"bookingsForSlot":1} | 409 booking_conflict_error |
| 9 | 2027-08-01T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 10 | 2027-08-02T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |

Vi phạm ghi nhận:

- Vòng 1 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 2 · I2b: Chỉ 2/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 3 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 4 · I2b: Chỉ 2/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 5 · I2b: Chỉ 2/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 6 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 7 · I2b: Chỉ 1/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 8 · I2b: Chỉ 2/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
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
| 1 | 2028-02-09T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 2 | 2028-02-10T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 3 | 2028-02-11T09:00 | **FAIL** | 200×8 409×2 | {"success":8,"activeBookings":8,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 4 | 2028-02-12T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 5 | 2028-02-13T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 6 | 2028-02-14T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 7 | 2028-02-15T09:00 | **FAIL** | 200×8 409×2 | {"success":8,"activeBookings":8,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 8 | 2028-02-16T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 9 | 2028-02-17T09:00 | **FAIL** | 200×8 409×2 | {"success":8,"activeBookings":8,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 10 | 2028-02-18T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |

Vi phạm ghi nhận:

- Vòng 1 · I3: 36 cặp chồng giờ giữa 9 booking active: wBRWTikF(09:00–09:30 pending), fCn7ssMv(09:00–09:30 pending), 2t3Q7wcD(09:00–09:30 pending), mB4sPBJ9(09:00–09:30 pending), vXgnjdXN(09:00–09:30 pending), iuKijYJJ(09:00–09:30 pending), sYvCWyQi(09:00–09:30 pending), 9aBy4bJN(09:00–09:30 pending), ezHuFXu1(09:00–09:30 pending)
- Vòng 2 · I3: 36 cặp chồng giờ giữa 9 booking active: gQjYAT3F(09:00–09:30 pending), vjq4XKZj(09:00–09:30 pending), pMyaRfQb(09:00–09:30 pending), fAshGSsw(09:00–09:30 pending), 5fG3Qa8F(09:00–09:30 pending), fesRUzDd(09:00–09:30 pending), cEjHxfNR(09:00–09:30 pending), wFMRrx5F(09:00–09:30 pending), ecavhzZ5(09:00–09:30 pending)
- Vòng 3 · I3: 28 cặp chồng giờ giữa 8 booking active: kX1AKQiD(09:00–09:30 pending), 29jMbFPz(09:00–09:30 pending), jXYFpZc4(09:00–09:30 pending), 5kA5kvFN(09:00–09:30 pending), pemvrxJC(09:00–09:30 pending), iryVHsRd(09:00–09:30 pending), euvXSqxp(09:00–09:30 pending), j7MLbRVF(09:00–09:30 pending)
- Vòng 4 · I3: 36 cặp chồng giờ giữa 9 booking active: sJSf43qg(09:00–09:30 pending), hVDstgEz(09:00–09:30 pending), f8L89wAV(09:00–09:30 pending), m2s7WqNB(09:00–09:30 pending), vpmJMwyc(09:00–09:30 pending), nAq8adhY(09:00–09:30 pending), opzLh8UQ(09:00–09:30 pending), bzBg1ueo(09:00–09:30 pending), erLZ3XFK(09:00–09:30 pending)
- Vòng 5 · I3: 36 cặp chồng giờ giữa 9 booking active: kSYmwMHa(09:00–09:30 pending), 9KbRB3jj(09:00–09:30 pending), otRWg8pc(09:00–09:30 pending), vaRUTs8p(09:00–09:30 pending), r1ePKC6b(09:00–09:30 pending), 96reeqxa(09:00–09:30 pending), wpb3ryxK(09:00–09:30 pending), vQKgJcKY(09:00–09:30 pending), 3AUqqMd4(09:00–09:30 pending)
- Vòng 6 · I3: 36 cặp chồng giờ giữa 9 booking active: rSttAGfD(09:00–09:30 pending), iKRNgaS1(09:00–09:30 pending), cYvhxwT8(09:00–09:30 pending), pNgNapbm(09:00–09:30 pending), o6TRccLi(09:00–09:30 pending), t1MvwjX9(09:00–09:30 pending), mTEMLJjD(09:00–09:30 pending), 2szgwrmZ(09:00–09:30 pending), 2Cdtvkci(09:00–09:30 pending)
- Vòng 7 · I3: 28 cặp chồng giờ giữa 8 booking active: fPty8m92(09:00–09:30 pending), cZoausno(09:00–09:30 pending), 31Wak2wn(09:00–09:30 pending), pWftnMWd(09:00–09:30 pending), tVnqU6EN(09:00–09:30 pending), p4ubD7Ye(09:00–09:30 pending), 6z7bJMoJ(09:00–09:30 pending), g4A7FDKW(09:00–09:30 pending)
- Vòng 8 · I3: 45 cặp chồng giờ giữa 10 booking active: kHpt37us(09:00–09:30 pending), nL4ZEzKg(09:00–09:30 pending), hTrWsU7b(09:00–09:30 pending), 3NMZeP57(09:00–09:30 pending), 8onMvawo(09:00–09:30 pending), dSMorKKb(09:00–09:30 pending), wCreiWqK(09:00–09:30 pending), 2Sa12nga(09:00–09:30 pending), nQYJAomt(09:00–09:30 pending), sYbNkRS3(09:00–09:30 pending)
- Vòng 9 · I3: 28 cặp chồng giờ giữa 8 booking active: mwSjK2tU(09:00–09:30 pending), ovQp1HQg(09:00–09:30 pending), hooLrok2(09:00–09:30 pending), 4ht1pm3K(09:00–09:30 pending), csKavZkd(09:00–09:30 pending), wauj41uL(09:00–09:30 pending), 8ZZP9wdb(09:00–09:30 pending), maGRHAL2(09:00–09:30 pending)
- Vòng 10 · I3: 36 cặp chồng giờ giữa 9 booking active: 6yJTSnAX(09:00–09:30 pending), bc1tcJJL(09:00–09:30 pending), bgN2Estq(09:00–09:30 pending), 5xDMR2bU(09:00–09:30 pending), tBvx9GZa(09:00–09:30 pending), kJiUK2kF(09:00–09:30 pending), 8wrLj6YY(09:00–09:30 pending), vYGdJXXc(09:00–09:30 pending), cc3zX78c(09:00–09:30 pending)

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

- Vòng 1 · I4: Booking gốc ddyLtzKCZR4K17ZLCSzpTF sinh ra 5 booking mới cùng ACCEPTED: 11:00, 14:00, 10:00, 13:00, 12:00
- Vòng 2 · I4: Booking gốc i3z2Wrh6cZh7cSFmPwUi9a sinh ra 5 booking mới cùng ACCEPTED: 11:00, 10:00, 14:00, 12:00, 13:00
- Vòng 3 · I4: Booking gốc ngev1fDgvpUi4wzK2iDaSm sinh ra 5 booking mới cùng ACCEPTED: 14:00, 11:00, 13:00, 10:00, 12:00
- Vòng 4 · I4: Booking gốc cMZps7r33jPqgwjqhY8RhU sinh ra 5 booking mới cùng ACCEPTED: 12:00, 14:00, 13:00, 11:00, 10:00
- Vòng 5 · I4: Booking gốc 8qYhoTKeCdcDo67Ay7JQar sinh ra 5 booking mới cùng ACCEPTED: 14:00, 12:00, 10:00, 11:00, 13:00
- Vòng 6 · I4: Booking gốc 4ZkDgycuTtLVGbB3JkQxhk sinh ra 5 booking mới cùng ACCEPTED: 10:00, 14:00, 12:00, 11:00, 13:00
- Vòng 7 · I4: Booking gốc 9m8cfcFHq3SeJaYh8k5brW sinh ra 5 booking mới cùng ACCEPTED: 10:00, 12:00, 11:00, 14:00, 13:00
- Vòng 8 · I4: Booking gốc vyFPWPvPn98V5WBvMK9MMS sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 14:00, 13:00
- Vòng 9 · I4: Booking gốc uLUYkQjAVrwuVHurcDETqh sinh ra 5 booking mới cùng ACCEPTED: 13:00, 10:00, 14:00, 12:00, 11:00
- Vòng 10 · I4: Booking gốc uU5RdiSXbNhdjwz2jqe3k8 sinh ra 5 booking mới cùng ACCEPTED: 11:00, 13:00, 10:00, 12:00, 14:00

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

- Vòng 1 · I5: Hủy trả 200 nhưng vẫn còn booking active viV2kBUXGQiH7FUxmXVQht (reschedule trả 200)
- Vòng 2 · I5: Hủy trả 200 nhưng vẫn còn booking active rHAe9atjY6WzSRBe8ce2Jj (reschedule trả 200)
- Vòng 3 · I5: Hủy trả 200 nhưng vẫn còn booking active hJdcxG1Z38qDbMD57FzoF6 (reschedule trả 200)
- Vòng 4 · I5: Hủy trả 200 nhưng vẫn còn booking active aLtEzt5tQezMGMUVS4iHkJ (reschedule trả 200)
- Vòng 5 · I5: Hủy trả 200 nhưng vẫn còn booking active cX9xSVSNP9syzzqNRrhYHx (reschedule trả 200)
- Vòng 6 · I5: Hủy trả 200 nhưng vẫn còn booking active wSMUvjXHt3onhu46Exm3se (reschedule trả 200)
- Vòng 7 · I5: Hủy trả 200 nhưng vẫn còn booking active 2aytSCys4YHYAH4DmTH26r (reschedule trả 200)
- Vòng 8 · I5: Hủy trả 200 nhưng vẫn còn booking active nixj9jpHaw4AzqrDx535P8 (reschedule trả 200)
- Vòng 9 · I5: Hủy trả 200 nhưng vẫn còn booking active 2NsCLywJgsCsMRvqr4Q32m (reschedule trả 200)
- Vòng 10 · I5: Hủy trả 200 nhưng vẫn còn booking active aQZsqnkmrMkA7aZPgmDP3K (reschedule trả 200)

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
