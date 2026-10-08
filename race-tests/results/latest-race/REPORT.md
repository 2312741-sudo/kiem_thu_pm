# Kết quả chạy race test – 2026-10-08T19-53-48-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T19:53:48.595Z · Kết thúc: 2026-10-08T19:56:18.328Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S1 | Nhiều người cùng đặt đúng một slot (event 1-1) | 10 | 0/10 | 0% | **PASS** | 1 | 410 |
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 10/10 | 100% | **FAIL** | 0 | 541 |
| S3 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 6 | 10/10 | 100% | **FAIL** | 1 | 241 |
| S4 | Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người | 6 | 0/10 | 0% | **PASS** | 1 | 234 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 10/10 | 100% | **FAIL** | 0 | 464 |
| S6 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 5 | 10/10 | 100% | **FAIL** | 0 | 367 |
| S7 | Hủy và đổi lịch cùng lúc trên một booking | 2 | 10/10 | 100% | **FAIL** | 0 | 158 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 8 | 10/10 | 100% | **FAIL** | 1 | 511 |

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

- Vòng 1 · I1: 45 cặp chồng giờ giữa 10 booking active: p8oWWWjP(09:12–09:42 accepted), 8C8rfhES(09:09–09:39 accepted), xtAA4GGp(09:00–09:30 accepted), j8PLaWcm(09:18–09:48 accepted), 8JJa2YJn(09:21–09:51 accepted), uKbpqvbi(09:27–09:57 accepted), iKcTm69P(08:36–09:36 accepted), xweaYnTY(08:45–09:45 accepted), 5rGx2P7i(08:54–09:54 accepted), btc6PRSE(09:03–09:33 accepted)
- Vòng 2 · I1: 45 cặp chồng giờ giữa 10 booking active: s1QGgPwY(09:00–09:30 accepted), bAqLrWA5(09:09–09:39 accepted), rZemrMid(08:45–09:45 accepted), wNqWCM6j(09:21–09:51 accepted), mGv1BEX4(09:03–09:33 accepted), pzC82VSo(08:36–09:36 accepted), iTs98vss(09:27–09:57 accepted), 6ecJeV1i(09:12–09:42 accepted), vSUmbN4Y(08:54–09:54 accepted), qWqdPLeF(09:18–09:48 accepted)
- Vòng 3 · I1: 45 cặp chồng giờ giữa 10 booking active: 7d8mvPrh(09:00–09:30 accepted), hjo9RLT7(09:12–09:42 accepted), x4ko261g(08:54–09:54 accepted), 64YrAq5E(08:45–09:45 accepted), aKFXsoaM(08:36–09:36 accepted), qnPosmey(09:03–09:33 accepted), 9WdVvUeF(09:21–09:51 accepted), 8Cei2DQq(09:09–09:39 accepted), 41MUEicW(09:18–09:48 accepted), aCRdcywN(09:27–09:57 accepted)
- Vòng 4 · I1: 45 cặp chồng giờ giữa 10 booking active: nADZJvy8(09:09–09:39 accepted), 7CmAcmJh(09:03–09:33 accepted), 2NSykHFV(08:54–09:54 accepted), fAGYDtDU(08:36–09:36 accepted), rdG1jxcC(09:12–09:42 accepted), 4JfmSRJ9(09:00–09:30 accepted), j17d2rrJ(09:18–09:48 accepted), wCbjRTes(09:21–09:51 accepted), i6wevzX6(08:45–09:45 accepted), n9CU2F7X(09:27–09:57 accepted)
- Vòng 5 · I1: 45 cặp chồng giờ giữa 10 booking active: oQFAJhLa(09:27–09:57 accepted), vw4iJSof(08:54–09:54 accepted), oqw9xfvG(09:21–09:51 accepted), cMwwsrLt(09:12–09:42 accepted), c48gFViw(09:03–09:33 accepted), bJLc6Rks(08:36–09:36 accepted), v6wx1d3e(09:09–09:39 accepted), 65JAhXib(09:00–09:30 accepted), vAo3Y5rP(08:45–09:45 accepted), gmxw8nnp(09:18–09:48 accepted)
- Vòng 6 · I1: 45 cặp chồng giờ giữa 10 booking active: 2X1Fnao4(09:12–09:42 accepted), 69c8jAZ7(08:36–09:36 accepted), gihmJGrd(09:00–09:30 accepted), oFRMVkdK(09:03–09:33 accepted), rTvKx49V(09:21–09:51 accepted), 8ARE2Bxh(09:18–09:48 accepted), dQty1Xiw(08:54–09:54 accepted), 36knwScH(08:45–09:45 accepted), fPUiWych(09:09–09:39 accepted), vUiuicJS(09:27–09:57 accepted)
- Vòng 7 · I1: 45 cặp chồng giờ giữa 10 booking active: cAXVGBSs(09:12–09:42 accepted), 9VCuvFGG(09:00–09:30 accepted), iyc6pGNK(09:21–09:51 accepted), 1De1gv7P(08:36–09:36 accepted), nWJwpjhT(09:03–09:33 accepted), 9efbQ31L(09:18–09:48 accepted), 6s4vDoWY(09:09–09:39 accepted), kJzDtFNS(08:45–09:45 accepted), hkbR18T1(08:54–09:54 accepted), ip2m7zVg(09:27–09:57 accepted)
- Vòng 8 · I1: 45 cặp chồng giờ giữa 10 booking active: 7kx4zPdf(09:12–09:42 accepted), wBMSymyZ(08:54–09:54 accepted), bDxgZTzd(09:18–09:48 accepted), 2xup4oLE(09:21–09:51 accepted), jyE42sJA(08:45–09:45 accepted), sUjqtE2W(09:09–09:39 accepted), 87XXXF4t(09:00–09:30 accepted), wqWU9HzG(09:03–09:33 accepted), 86nmDdvP(09:27–09:57 accepted), tqHK7yQV(08:36–09:36 accepted)
- Vòng 9 · I1: 45 cặp chồng giờ giữa 10 booking active: tsNPQJfD(09:03–09:33 accepted), kJt2aESs(08:36–09:36 accepted), 19FjjvzE(09:27–09:57 accepted), 3K5h1SFs(09:21–09:51 accepted), 5ktyHyRi(09:12–09:42 accepted), ujiFpT63(08:45–09:45 accepted), 7jiEvBXT(09:18–09:48 accepted), 7sJyvG2i(08:54–09:54 accepted), pt5E9Q6B(09:00–09:30 accepted), oNzze51P(09:09–09:39 accepted)
- Vòng 10 · I1: 45 cặp chồng giờ giữa 10 booking active: m459pBwi(08:36–09:36 accepted), qEFmmnrh(09:03–09:33 accepted), adWopTbj(09:00–09:30 accepted), ftNZjZ3x(08:45–09:45 accepted), 2Wffxvet(08:54–09:54 accepted), 3sQ8wXNg(09:21–09:51 accepted), srSBSz82(09:18–09:48 accepted), mcMWRhN7(09:27–09:57 accepted), nHrhHoay(09:12–09:42 accepted), vAJzQMPm(09:09–09:39 accepted)

## S3 – Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống)

Invariant: I2 – không vượt 3 ghế; I2b – còn ghế thì không được từ chối người đặt

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-07-24T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 2 | 2027-07-25T09:00 | **FAIL** | 200×1 409×5 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 3 | 2027-07-26T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seats":2,"bookingsForSlot":1} | 409 booking_conflict_error |
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
- Vòng 3 · I2b: Chỉ 2/3 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
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
| 1 | 2028-02-09T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 2 | 2028-02-10T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 3 | 2028-02-11T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 4 | 2028-02-12T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 5 | 2028-02-13T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 6 | 2028-02-14T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 7 | 2028-02-15T09:00 | **FAIL** | 200×8 409×2 | {"success":8,"activeBookings":8,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 8 | 2028-02-16T09:00 | **FAIL** | 200×7 409×3 | {"success":7,"activeBookings":7,"statuses":["pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 9 | 2028-02-17T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 10 | 2028-02-18T09:00 | **FAIL** | 200×8 409×2 | {"success":8,"activeBookings":8,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |

Vi phạm ghi nhận:

- Vòng 1 · I3: 36 cặp chồng giờ giữa 9 booking active: eb8GX1cx(09:00–09:30 pending), repaPx5z(09:00–09:30 pending), pqk8JJXu(09:00–09:30 pending), a4zhpBGG(09:00–09:30 pending), hCFxSCX8(09:00–09:30 pending), 8rkQzuxK(09:00–09:30 pending), pfLd84bH(09:00–09:30 pending), 7wa2kdmk(09:00–09:30 pending), iuvXfavY(09:00–09:30 pending)
- Vòng 2 · I3: 36 cặp chồng giờ giữa 9 booking active: otA7EYHQ(09:00–09:30 pending), qFDvhwJz(09:00–09:30 pending), s9q8H8Ri(09:00–09:30 pending), 4fHrKJ5j(09:00–09:30 pending), x3GrEJ7M(09:00–09:30 pending), eVJMpkvf(09:00–09:30 pending), sSqVjHB7(09:00–09:30 pending), gA4o1pgH(09:00–09:30 pending), 1CcvHR7Q(09:00–09:30 pending)
- Vòng 3 · I3: 36 cặp chồng giờ giữa 9 booking active: kqNBEQoj(09:00–09:30 pending), qVmMwrk2(09:00–09:30 pending), f8FLPZh1(09:00–09:30 pending), xBqiX5JB(09:00–09:30 pending), v5aLseGE(09:00–09:30 pending), 5nfR5DCL(09:00–09:30 pending), 79uu4uvK(09:00–09:30 pending), g18X497A(09:00–09:30 pending), dCEn4SY3(09:00–09:30 pending)
- Vòng 4 · I3: 36 cặp chồng giờ giữa 9 booking active: 3DARwUzv(09:00–09:30 pending), m6EEa8me(09:00–09:30 pending), m15Jg9x9(09:00–09:30 pending), wGVfb81s(09:00–09:30 pending), kVTYdcJZ(09:00–09:30 pending), t8WbPYkn(09:00–09:30 pending), ugDecKhU(09:00–09:30 pending), kgtu5Nvq(09:00–09:30 pending), 8NRfLudG(09:00–09:30 pending)
- Vòng 5 · I3: 36 cặp chồng giờ giữa 9 booking active: 4khGxC1o(09:00–09:30 pending), 5yLQtveL(09:00–09:30 pending), 3oaA7NvC(09:00–09:30 pending), 8U3eEZyb(09:00–09:30 pending), aoUDqyna(09:00–09:30 pending), 1oiTZriJ(09:00–09:30 pending), sy2a2pfS(09:00–09:30 pending), pUTH1Q3M(09:00–09:30 pending), m4C41cHW(09:00–09:30 pending)
- Vòng 6 · I3: 45 cặp chồng giờ giữa 10 booking active: rpzEcgdU(09:00–09:30 pending), tyd8afAP(09:00–09:30 pending), xqBPKYGg(09:00–09:30 pending), 4Sgm3msR(09:00–09:30 pending), 7gDoQPnF(09:00–09:30 pending), 6jh15yGq(09:00–09:30 pending), aXHU2xUW(09:00–09:30 pending), nNStiU1v(09:00–09:30 pending), bzchDk1i(09:00–09:30 pending), vhoUvLTL(09:00–09:30 pending)
- Vòng 7 · I3: 28 cặp chồng giờ giữa 8 booking active: 4wDqWJcX(09:00–09:30 pending), 4X7D5mLi(09:00–09:30 pending), 4XyhsCeT(09:00–09:30 pending), ffPJCndL(09:00–09:30 pending), n3vKUjdK(09:00–09:30 pending), 4YEDDAb8(09:00–09:30 pending), f88wA5zZ(09:00–09:30 pending), ih6fLtM6(09:00–09:30 pending)
- Vòng 8 · I3: 21 cặp chồng giờ giữa 7 booking active: us7C8Vi2(09:00–09:30 pending), gXzLMWG4(09:00–09:30 pending), co1ZX4hN(09:00–09:30 pending), nGgv4S6t(09:00–09:30 pending), r8T43xWF(09:00–09:30 pending), gxRDfyva(09:00–09:30 pending), pD3sqy5c(09:00–09:30 pending)
- Vòng 9 · I3: 36 cặp chồng giờ giữa 9 booking active: 64qffWz8(09:00–09:30 pending), fmXmSJmG(09:00–09:30 pending), fjtBq2j8(09:00–09:30 pending), 5NEV3uRU(09:00–09:30 pending), fuR8ZJUv(09:00–09:30 pending), prTCMTwu(09:00–09:30 pending), riDwBeT4(09:00–09:30 pending), kscQ8B9r(09:00–09:30 pending), eMZ5t5kP(09:00–09:30 pending)
- Vòng 10 · I3: 28 cặp chồng giờ giữa 8 booking active: rXxw3bdT(09:00–09:30 pending), 49GYKwVq(09:00–09:30 pending), k2hAdzoW(09:00–09:30 pending), ia6NJm4d(09:00–09:30 pending), 6PNax57D(09:00–09:30 pending), 3Ya4aRge(09:00–09:30 pending), ddG86F6P(09:00–09:30 pending), rg9aoFwj(09:00–09:30 pending)

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

- Vòng 1 · I4: Booking gốc bgJLbBXRKHsu1Mrn6M1nSb sinh ra 5 booking mới cùng ACCEPTED: 11:00, 13:00, 12:00, 14:00, 10:00
- Vòng 2 · I4: Booking gốc kJuyj5MddgUTT7bvZ7DZd7 sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 12:00, 13:00, 14:00
- Vòng 3 · I4: Booking gốc 2KS8AmFQkCc1u2dUQV5mK5 sinh ra 5 booking mới cùng ACCEPTED: 10:00, 11:00, 14:00, 12:00, 13:00
- Vòng 4 · I4: Booking gốc gk99gX1aLdzENpfqJiNrio sinh ra 5 booking mới cùng ACCEPTED: 12:00, 11:00, 13:00, 10:00, 14:00
- Vòng 5 · I4: Booking gốc dG3zDhvJfZ3ZbWPea73vyP sinh ra 5 booking mới cùng ACCEPTED: 14:00, 13:00, 10:00, 12:00, 11:00
- Vòng 6 · I4: Booking gốc sKKNqDMEPswBRBJbLAzJz9 sinh ra 5 booking mới cùng ACCEPTED: 10:00, 14:00, 12:00, 11:00, 13:00
- Vòng 7 · I4: Booking gốc aP1eX83eE1TFWaGrjcBgd3 sinh ra 5 booking mới cùng ACCEPTED: 13:00, 10:00, 11:00, 14:00, 12:00
- Vòng 8 · I4: Booking gốc uw3kKjxmgukgmTCCrKnDb9 sinh ra 5 booking mới cùng ACCEPTED: 11:00, 13:00, 14:00, 10:00, 12:00
- Vòng 9 · I4: Booking gốc qdvcZgqc5aKkxDe5vwur4L sinh ra 5 booking mới cùng ACCEPTED: 13:00, 12:00, 10:00, 14:00, 11:00
- Vòng 10 · I4: Booking gốc s67k3953pUZVpFWVKTMxYT sinh ra 5 booking mới cùng ACCEPTED: 13:00, 10:00, 14:00, 12:00, 11:00

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

- Vòng 1 · I5: Hủy trả 200 nhưng vẫn còn booking active 1ERctCrWLgyrxGp7RwK9pP (reschedule trả 200)
- Vòng 2 · I5: Hủy trả 200 nhưng vẫn còn booking active 6i7bB1M5sSRRhw1xnjm6ve (reschedule trả 200)
- Vòng 3 · I5: Hủy trả 200 nhưng vẫn còn booking active cfzLmQFXzFFtd5korwFKYV (reschedule trả 200)
- Vòng 4 · I5: Hủy trả 200 nhưng vẫn còn booking active 1XVgvqYR9BrjTXYSiwJvEB (reschedule trả 200)
- Vòng 5 · I5: Hủy trả 200 nhưng vẫn còn booking active h9pD5X2qqjWjtyLQ2JSGuq (reschedule trả 200)
- Vòng 6 · I5: Hủy trả 200 nhưng vẫn còn booking active pdqARSSWUJvEbmhZEZ1fnA (reschedule trả 200)
- Vòng 7 · I5: Hủy trả 200 nhưng vẫn còn booking active dh9AWjekyrKa4LJvHsBnqU (reschedule trả 200)
- Vòng 8 · I5: Hủy trả 200 nhưng vẫn còn booking active j9KTX4iZhVsSi8LD7yNYed (reschedule trả 200)
- Vòng 9 · I5: Hủy trả 200 nhưng vẫn còn booking active tiSUneuQ1LYmf9g827hgsm (reschedule trả 200)
- Vòng 10 · I5: Hủy trả 200 nhưng vẫn còn booking active tr8nFndt6uXTjEudwSTEjX (reschedule trả 200)

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
