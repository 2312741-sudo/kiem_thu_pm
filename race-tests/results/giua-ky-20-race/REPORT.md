# Kết quả chạy race test – 2026-10-20T13-37-16-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-20T13:37:17.823Z · Kết thúc: 2026-10-20T13:43:41.227Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S1 | Nhiều người cùng đặt đúng một slot (event 1-1) | 10 | 0/10 | 0% | **PASS** | 1 | 512 |
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 10/10 | 100% | **FAIL** | 1 | 650 |
| S3 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 6 | 10/10 | 100% | **FAIL** | 1 | 365 |
| S4 | Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người | 6 | 0/10 | 0% | **PASS** | 1 | 239 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 10/10 | 100% | **FAIL** | 1 | 471 |
| S6 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 5 | 10/10 | 100% | **FAIL** | 0 | 403 |
| S7 | Hủy và đổi lịch cùng lúc trên một booking | 2 | 10/10 | 100% | **FAIL** | 0 | 157 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 8 | 10/10 | 100% | **FAIL** | 1 | 449 |
| S9 | Hai booking khác nhau cùng được đổi lịch sang đúng một slot trống | 2 | 0/10 | 0% | **PASS** | 0 | 144 |
| S10 | Đổi lịch một booking sang slot X đúng lúc có người đặt mới vào slot X | 2 | 0/10 | 0% | **PASS** | 0 | 133 |
| S11 | Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn | 6 | 10/10 | 100% | **FAIL** | 0 | 335 |
| S12 | Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau | 6 | 10/10 | 100% | **FAIL** | 1 | 360 |
| S13 | Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần | 6 | 10/10 | 100% | **FAIL** | 1 | 338 |
| S14 | Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt | 6 | 10/10 | 100% | **FAIL** | 1 | 370 |
| S15 | Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab) | 6 | 10/10 | 100% | **FAIL** | 0 | 262 |
| S16 | Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế) | 6 | 10/10 | 100% | **FAIL** | 0 | 238 |
| S17 | Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host | 10 | 10/10 | 100% | **FAIL** | 1 | 513 |
| S18 | Tải cao: 30 người cùng đặt đúng một slot | 30 | 0/10 | 0% | **PASS** | 1 | 1185 |
| S19 | 20 người đặt 20 slot khác nhau không chồng nhau cùng lúc (không được từ chối nhầm) | 20 | 0/10 | 0% | **PASS** | 1 | 1051 |
| S20 | Hủy booking cũ và đặt booking mới vào đúng slot đó cùng lúc | 2 | 0/10 | 0% | **PASS** | 0 | 81 |

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

- Vòng 1 · I1: 45 cặp chồng giờ giữa 10 booking active: k6abWJ8n(09:00–09:30 accepted), x9Td2MVb(08:36–09:36 accepted), 9NagFRq9(08:45–09:45 accepted), 14w2E1KE(08:54–09:54 accepted), tevGnMKX(09:03–09:33 accepted), sEjoZdKa(09:09–09:39 accepted), 9pWLaHng(09:12–09:42 accepted), 4fXtQ3y9(09:18–09:48 accepted), taFxpUoC(09:21–09:51 accepted), rnQXwt8y(09:27–09:57 accepted)
- Vòng 2 · I1: 45 cặp chồng giờ giữa 10 booking active: kwtYVZZE(09:21–09:51 accepted), npbkU1RX(08:36–09:36 accepted), vs5Wb7jQ(08:45–09:45 accepted), hMhcAMmZ(08:54–09:54 accepted), q2pmebTd(09:00–09:30 accepted), dKey37vH(09:12–09:42 accepted), 8jt3gQPB(09:18–09:48 accepted), oS98qoy5(09:09–09:39 accepted), dGgNcEtp(09:03–09:33 accepted), 78Kopwhc(09:27–09:57 accepted)
- Vòng 3 · I1: 45 cặp chồng giờ giữa 10 booking active: eDPVP5ZZ(09:03–09:33 accepted), mLyDkfvy(08:54–09:54 accepted), 91axCN7J(09:09–09:39 accepted), 79xLccoJ(09:21–09:51 accepted), bRHSfBQ4(08:45–09:45 accepted), r2L5VzYz(09:00–09:30 accepted), dDDWnbKt(09:18–09:48 accepted), v1VwdAFY(09:27–09:57 accepted), mWEDWFGr(08:36–09:36 accepted), hknY1dY8(09:12–09:42 accepted)
- Vòng 4 · I1: 45 cặp chồng giờ giữa 10 booking active: 5eyhRF8a(08:45–09:45 accepted), 6Wwe6BVK(08:54–09:54 accepted), tJVcMjMX(09:03–09:33 accepted), ib2LVwQj(09:09–09:39 accepted), cdSCpqkc(09:12–09:42 accepted), 7Nq5LVaF(09:18–09:48 accepted), nZdvBGH9(09:21–09:51 accepted), aegi3ueK(09:27–09:57 accepted), 8caA6CyC(09:00–09:30 accepted), q314Xu62(08:36–09:36 accepted)
- Vòng 5 · I1: 45 cặp chồng giờ giữa 10 booking active: ivmheYdb(08:54–09:54 accepted), 1SBmuJTV(08:36–09:36 accepted), oveohZab(08:45–09:45 accepted), rLuEM7A3(09:00–09:30 accepted), jh3uf9Qv(09:03–09:33 accepted), uomRPaiM(09:12–09:42 accepted), pworsmDy(09:18–09:48 accepted), b1HzSF88(09:27–09:57 accepted), cHnALYQZ(09:09–09:39 accepted), 2wvmTLYj(09:21–09:51 accepted)
- Vòng 6 · I1: 45 cặp chồng giờ giữa 10 booking active: pK8oz5Dt(09:03–09:33 accepted), wQoQ5QR8(08:36–09:36 accepted), cctJWjwp(08:45–09:45 accepted), tq8Wpfqy(08:54–09:54 accepted), kEZAmY6c(09:00–09:30 accepted), e39YgEnK(09:12–09:42 accepted), aodb4APd(09:18–09:48 accepted), 8qUw1dzz(09:27–09:57 accepted), oS6xmC7d(09:21–09:51 accepted), ezLfWV94(09:09–09:39 accepted)
- Vòng 7 · I1: 45 cặp chồng giờ giữa 10 booking active: cjvdnHyk(08:54–09:54 accepted), qY1QozC1(08:36–09:36 accepted), axFWtGgg(08:45–09:45 accepted), bJGdDVi5(09:03–09:33 accepted), udbipbFU(09:09–09:39 accepted), wP2XrPCn(09:12–09:42 accepted), 9dLYgb7t(09:18–09:48 accepted), hxr3BurA(09:27–09:57 accepted), m4Q8qsci(09:21–09:51 accepted), eJpr92Z7(09:00–09:30 accepted)
- Vòng 8 · I1: 45 cặp chồng giờ giữa 10 booking active: jcMHYpFf(09:18–09:48 accepted), qihp4jck(08:54–09:54 accepted), vKNA5Ya6(09:03–09:33 accepted), imPE4imV(09:09–09:39 accepted), 3PMJngKc(09:12–09:42 accepted), 18cYJTVc(09:27–09:57 accepted), vVVj9F2q(08:45–09:45 accepted), sKeKtL14(08:36–09:36 accepted), fDKR2Lfu(09:00–09:30 accepted), 3tdtaz4X(09:21–09:51 accepted)
- Vòng 9 · I1: 45 cặp chồng giờ giữa 10 booking active: iCQgJCzq(09:12–09:42 accepted), k3Z6Rso3(08:36–09:36 accepted), uBXeg8ED(08:45–09:45 accepted), xpPh7ZgB(08:54–09:54 accepted), vh7vY2t2(09:27–09:57 accepted), 2KdCyM9H(09:18–09:48 accepted), 8aRuPTXV(09:09–09:39 accepted), 9THtsdLJ(09:03–09:33 accepted), utmhyv5x(09:00–09:30 accepted), 1RdTqv4Q(09:21–09:51 accepted)
- Vòng 10 · I1: 45 cặp chồng giờ giữa 10 booking active: o4Mwd1Hs(08:54–09:54 accepted), bhCPs4xJ(09:12–09:42 accepted), eMdFGyJF(09:21–09:51 accepted), wG9WCtiF(09:27–09:57 accepted), i1HqKPXx(08:36–09:36 accepted), sP3BN6o7(09:00–09:30 accepted), pk2zok8a(09:03–09:33 accepted), aUzVWjjG(09:09–09:39 accepted), tBVrGAzN(08:45–09:45 accepted), rdUnQkKN(09:18–09:48 accepted)

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
| 1 | 2028-02-09T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 2 | 2028-02-10T09:00 | **FAIL** | 200×7 409×3 | {"success":7,"activeBookings":7,"statuses":["pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 3 | 2028-02-11T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 4 | 2028-02-12T09:00 | **FAIL** | 200×8 409×2 | {"success":8,"activeBookings":8,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 5 | 2028-02-13T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 6 | 2028-02-14T09:00 | **FAIL** | 200×6 409×4 | {"success":6,"activeBookings":6,"statuses":["pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 7 | 2028-02-15T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 8 | 2028-02-16T09:00 | **FAIL** | 200×7 409×3 | {"success":7,"activeBookings":7,"statuses":["pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 9 | 2028-02-17T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 10 | 2028-02-18T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |

Vi phạm ghi nhận:

- Vòng 1 · I3: 36 cặp chồng giờ giữa 9 booking active: vD7EbEX8(09:00–09:30 pending), 6Ye1ZGAQ(09:00–09:30 pending), unqL8UJc(09:00–09:30 pending), sAmnc2Go(09:00–09:30 pending), x5fVWwz5(09:00–09:30 pending), vuAyNWQ2(09:00–09:30 pending), 7xK2ra2m(09:00–09:30 pending), tZ4vWzCG(09:00–09:30 pending), ff8BPTLK(09:00–09:30 pending)
- Vòng 2 · I3: 21 cặp chồng giờ giữa 7 booking active: xrkJedTU(09:00–09:30 pending), hEDKaDVJ(09:00–09:30 pending), gaGizpUQ(09:00–09:30 pending), 4uKRZgmR(09:00–09:30 pending), cZkJ2NcQ(09:00–09:30 pending), f717UWPr(09:00–09:30 pending), 1Gp4kQ6A(09:00–09:30 pending)
- Vòng 3 · I3: 45 cặp chồng giờ giữa 10 booking active: xacYiLNc(09:00–09:30 pending), vhfvtAk9(09:00–09:30 pending), 91mP9ijE(09:00–09:30 pending), juSkU2Gs(09:00–09:30 pending), csX9Wrvi(09:00–09:30 pending), un5LLhLG(09:00–09:30 pending), rpBMnLnw(09:00–09:30 pending), jivkFLhL(09:00–09:30 pending), op6w4W4r(09:00–09:30 pending), jTNXJSnk(09:00–09:30 pending)
- Vòng 4 · I3: 28 cặp chồng giờ giữa 8 booking active: wjHFRP6D(09:00–09:30 pending), 86XEnCEu(09:00–09:30 pending), ngkayBTH(09:00–09:30 pending), 1nxBGTRV(09:00–09:30 pending), i1axUpQ3(09:00–09:30 pending), 2dkAdTyk(09:00–09:30 pending), txXdmDDf(09:00–09:30 pending), 6JwUdcAh(09:00–09:30 pending)
- Vòng 5 · I3: 36 cặp chồng giờ giữa 9 booking active: xatYhQK5(09:00–09:30 pending), bV3iiEX6(09:00–09:30 pending), wMn7oVim(09:00–09:30 pending), gDgT2dJU(09:00–09:30 pending), cwpY4Jys(09:00–09:30 pending), vU9ya2at(09:00–09:30 pending), 2b3nJRqH(09:00–09:30 pending), 7ZqL62gZ(09:00–09:30 pending), u28dxnAh(09:00–09:30 pending)
- Vòng 6 · I3: 15 cặp chồng giờ giữa 6 booking active: ok2b7cZB(09:00–09:30 pending), 3MNecBEB(09:00–09:30 pending), vCWc2aXJ(09:00–09:30 pending), gXMnDDXr(09:00–09:30 pending), aVYCXWTU(09:00–09:30 pending), eoVV1P2L(09:00–09:30 pending)
- Vòng 7 · I3: 36 cặp chồng giờ giữa 9 booking active: n15egfDy(09:00–09:30 pending), r2ym5YkQ(09:00–09:30 pending), mQ4m7UjF(09:00–09:30 pending), rifEqmF1(09:00–09:30 pending), eRy8Ftpq(09:00–09:30 pending), 8MqXH9mb(09:00–09:30 pending), 2vo4BMGn(09:00–09:30 pending), wnHKTuLU(09:00–09:30 pending), gktHpQ6A(09:00–09:30 pending)
- Vòng 8 · I3: 21 cặp chồng giờ giữa 7 booking active: 9chnLhUh(09:00–09:30 pending), 5WUVkxnu(09:00–09:30 pending), 6K6xAnHr(09:00–09:30 pending), pwUu7AcP(09:00–09:30 pending), fMeG8q7J(09:00–09:30 pending), dcTE4i61(09:00–09:30 pending), e62psCBX(09:00–09:30 pending)
- Vòng 9 · I3: 36 cặp chồng giờ giữa 9 booking active: 6kXFr5J3(09:00–09:30 pending), uYvMmK1W(09:00–09:30 pending), dr9jcps2(09:00–09:30 pending), 2oYFeggw(09:00–09:30 pending), cnm6SEfr(09:00–09:30 pending), byu9BWtG(09:00–09:30 pending), vMoJAqfF(09:00–09:30 pending), 2FpQLv44(09:00–09:30 pending), jpEgFHa5(09:00–09:30 pending)
- Vòng 10 · I3: 36 cặp chồng giờ giữa 9 booking active: juACMuCw(09:00–09:30 pending), veT9D9gV(09:00–09:30 pending), v7QyTTNP(09:00–09:30 pending), uBejPGCk(09:00–09:30 pending), 8L9GoP3z(09:00–09:30 pending), cp6S8oQH(09:00–09:30 pending), tJTSjDDQ(09:00–09:30 pending), 3nCjwAgU(09:00–09:30 pending), aGXSSYKk(09:00–09:30 pending)

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

- Vòng 1 · I4: Booking gốc c5oyzyjsej41QNFXhsV1BW sinh ra 5 booking mới cùng ACCEPTED: 12:00, 11:00, 13:00, 14:00, 10:00
- Vòng 2 · I4: Booking gốc v86oVFVtUnBoi2XHWQZLaX sinh ra 5 booking mới cùng ACCEPTED: 12:00, 11:00, 14:00, 10:00, 13:00
- Vòng 3 · I4: Booking gốc 5JeJFUVjGp5AXVpnLdSm9a sinh ra 5 booking mới cùng ACCEPTED: 14:00, 10:00, 11:00, 13:00, 12:00
- Vòng 4 · I4: Booking gốc v9a5ou85NeNCLwqkqKAwKB sinh ra 5 booking mới cùng ACCEPTED: 12:00, 11:00, 10:00, 14:00, 13:00
- Vòng 5 · I4: Booking gốc 8Hwf2kyeuKe5FsNKay99US sinh ra 5 booking mới cùng ACCEPTED: 10:00, 12:00, 13:00, 11:00, 14:00
- Vòng 6 · I4: Booking gốc wywxJackC5NRvmU5rbMRdZ sinh ra 5 booking mới cùng ACCEPTED: 13:00, 10:00, 11:00, 12:00, 14:00
- Vòng 7 · I4: Booking gốc jD8GpbpUSH5rxNDs1jYwty sinh ra 5 booking mới cùng ACCEPTED: 13:00, 11:00, 10:00, 14:00, 12:00
- Vòng 8 · I4: Booking gốc ny3ykZ6jShMhNzsB8HLjuX sinh ra 5 booking mới cùng ACCEPTED: 12:00, 10:00, 14:00, 13:00, 11:00
- Vòng 9 · I4: Booking gốc e1ptjN2bJCsZJbnDJstj7Y sinh ra 5 booking mới cùng ACCEPTED: 13:00, 10:00, 12:00, 14:00, 11:00
- Vòng 10 · I4: Booking gốc 4Sr1rFGcuRt4LMR4d8LGK7 sinh ra 5 booking mới cùng ACCEPTED: 11:00, 14:00, 12:00, 10:00, 13:00

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

- Vòng 1 · I5: Hủy trả 200 nhưng vẫn còn booking active g32rWoLdzM3BKc5sPYLFi2 (reschedule trả 200)
- Vòng 2 · I5: Hủy trả 200 nhưng vẫn còn booking active izZxDsEckEncdLPJvVdg3R (reschedule trả 200)
- Vòng 3 · I5: Hủy trả 200 nhưng vẫn còn booking active v3awZYymstCCf4gCsKpuCE (reschedule trả 200)
- Vòng 4 · I5: Hủy trả 200 nhưng vẫn còn booking active 3Az7guqTzSx5QW8Jh6zh9u (reschedule trả 200)
- Vòng 5 · I5: Hủy trả 200 nhưng vẫn còn booking active jGYwJ5r7TtqcnBjJvW1ejz (reschedule trả 200)
- Vòng 6 · I5: Hủy trả 200 nhưng vẫn còn booking active gV1fuqd7tybjce8wPcV6gK (reschedule trả 200)
- Vòng 7 · I5: Hủy trả 200 nhưng vẫn còn booking active 4YeZAeHPWEg6MdSMCeDF8x (reschedule trả 200)
- Vòng 8 · I5: Hủy trả 200 nhưng vẫn còn booking active otqzD5pnHYBtaXuRAi5xJN (reschedule trả 200)
- Vòng 9 · I5: Hủy trả 200 nhưng vẫn còn booking active qWSmZEMFJVvhTGdKaNhbp7 (reschedule trả 200)
- Vòng 10 · I5: Hủy trả 200 nhưng vẫn còn booking active rE8NpBHeupk36kaaKkJCGJ (reschedule trả 200)

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

## S9 – Hai booking khác nhau cùng được đổi lịch sang đúng một slot trống

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2029-03-15T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 2 | 2029-03-16T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 3 | 2029-03-17T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 4 | 2029-03-18T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 5 | 2029-03-19T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 6 | 2029-03-20T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 7 | 2029-03-21T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 8 | 2029-03-22T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 9 | 2029-03-23T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 10 | 2029-03-24T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |

## S10 – Đổi lịch một booking sang slot X đúng lúc có người đặt mới vào slot X

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2029-06-23T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 2 | 2029-06-24T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 3 | 2029-06-25T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 4 | 2029-06-26T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 5 | 2029-06-27T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 6 | 2029-06-28T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 7 | 2029-06-29T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 8 | 2029-06-30T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 9 | 2029-07-01T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |
| 10 | 2029-07-02T09:00 | PASS | 200×1 409×1 | {"success":1,"activeAtTarget":1} | 409 booking_conflict_error |

## S11 – Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn

Invariant: I8 – hai booking liền kề của host cách nhau ≥ buffer (30 phút)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2029-10-01T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 2 | 2029-10-02T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 3 | 2029-10-03T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 4 | 2029-10-04T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 5 | 2029-10-05T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 6 | 2029-10-06T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 7 | 2029-10-07T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 8 | 2029-10-08T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 9 | 2029-10-09T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 10 | 2029-10-10T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |

Vi phạm ghi nhận:

- Vòng 1 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 1 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 1 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 1 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 1 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 2 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 2 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 2 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 2 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 2 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 3 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 3 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 3 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 3 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 3 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 4 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 4 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 4 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 4 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 4 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 5 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 5 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 5 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 5 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 5 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 6 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 6 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 6 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 6 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 6 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 7 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 7 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 7 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 7 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 7 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 8 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 8 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 8 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 8 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 8 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 9 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 9 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 9 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 9 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 9 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 10 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 10 · I8: Booking 09:30 và 10:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 10 · I8: Booking 10:00 và 10:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 10 · I8: Booking 10:30 và 11:00 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 10 · I8: Booking 11:00 và 11:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)

## S12 – Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau

Invariant: I9 – tổng thời lượng booking active trong ngày ≤ durationLimits.PER_DAY (30 phút)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-01-09T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 2 | 2030-01-10T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 3 | 2030-01-11T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 4 | 2030-01-12T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 5 | 2030-01-13T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 6 | 2030-01-14T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 7 | 2030-01-15T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 8 | 2030-01-16T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 9 | 2030-01-17T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |
| 10 | 2030-01-18T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6,"minutes":180} |  |

Vi phạm ghi nhận:

- Vòng 1 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 2 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 3 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 4 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 5 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 6 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 7 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 8 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 9 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút
- Vòng 10 · I9: Tổng thời lượng 180 phút trong ngày (6 booking), giới hạn 30 phút

## S13 – Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần

Invariant: I6 – số booking active trong tuần ≤ bookingLimits.PER_WEEK (=1)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-04-19T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 2 | 2030-04-20T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 3 | 2030-04-21T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 4 | 2030-04-22T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 5 | 2030-04-23T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 6 | 2030-04-24T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 7 | 2030-04-25T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 8 | 2030-04-26T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 9 | 2030-04-27T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 10 | 2030-04-28T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |

Vi phạm ghi nhận:

- Vòng 1 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 2 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 3 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 4 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 5 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 6 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 7 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 8 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 9 · I6: 6 booking active trong cùng tuần, giới hạn là 1
- Vòng 10 · I6: 6 booking active trong cùng tuần, giới hạn là 1

## S14 – Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt

Invariant: I10 – một người đặt có tối đa maxActiveBookingsPerBooker (=1) booking active

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-07-28T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 2 | 2030-07-29T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 3 | 2030-07-30T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 4 | 2030-07-31T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 5 | 2030-08-01T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 6 | 2030-08-02T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 7 | 2030-08-03T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 8 | 2030-08-04T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 9 | 2030-08-05T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |
| 10 | 2030-08-06T09:00 | **FAIL** | 200×6 | {"success":6,"activeBookings":6} |  |

Vi phạm ghi nhận:

- Vòng 1 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 2 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 3 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 4 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 5 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 6 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 7 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 8 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 9 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1
- Vòng 10 · I10: Cùng một người đặt có 6 booking active, giới hạn là 1

## S15 – Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab)

Invariant: I5 – đúng 1 lệnh hủy thành công, các lệnh còn lại bị từ chối; booking cuối cùng ở trạng thái cancelled

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-11-05T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 2 | 2030-11-06T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 3 | 2030-11-07T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 4 | 2030-11-08T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 5 | 2030-11-09T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 6 | 2030-11-10T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 7 | 2030-11-11T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 8 | 2030-11-12T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 9 | 2030-11-13T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |
| 10 | 2030-11-14T09:00 | **FAIL** | 200×6 | {"success":6,"finalStatus":"cancelled"} |  |

Vi phạm ghi nhận:

- Vòng 1 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 2 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 3 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 4 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 5 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 6 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 7 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 8 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 9 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 10 · I5: 6 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)

## S16 – Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế)

Invariant: I11 – một email chỉ chiếm tối đa 1 ghế trong một slot

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-02-13T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 2 | 2031-02-14T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error; 409 already_signed_up_for_this_booking_error |
| 3 | 2031-02-15T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 4 | 2031-02-16T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 5 | 2031-02-17T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error; 409 already_signed_up_for_this_booking_error |
| 6 | 2031-02-18T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 already_signed_up_for_this_booking_error; 409 booking_seats_full_error |
| 7 | 2031-02-19T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 8 | 2031-02-20T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 9 | 2031-02-21T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 10 | 2031-02-22T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |

Vi phạm ghi nhận:

- Vòng 1 · I11: Email s16-r1-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 2 · I11: Email s16-r2-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 3 · I11: Email s16-r3-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 4 · I11: Email s16-r4-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 5 · I11: Email s16-r5-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 6 · I11: Email s16-r6-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 7 · I11: Email s16-r7-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 8 · I11: Email s16-r8-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 9 · I11: Email s16-r9-udup@k15.test chiếm 2 ghế trong cùng một slot
- Vòng 10 · I11: Email s16-r10-udup@k15.test chiếm 2 ghế trong cùng một slot

## S17 – Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host

Invariant: I1 – host không có 2 booking active chồng giờ

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-05-24T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 2 | 2031-05-25T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 3 | 2031-05-26T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 4 | 2031-05-27T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 5 | 2031-05-28T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 6 | 2031-05-29T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 7 | 2031-05-30T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 8 | 2031-05-31T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 9 | 2031-06-01T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |
| 10 | 2031-06-02T09:00 | **FAIL** | 200×2 409×8 | {"success":2,"activeBookings":2} | 409 booking_conflict_error |

Vi phạm ghi nhận:

- Vòng 1 · I1: 1 cặp chồng giờ giữa 2 booking active: 6mA9V9NF(09:00–09:30 accepted), bhggZxTZ(09:00–10:00 accepted)
- Vòng 2 · I1: 1 cặp chồng giờ giữa 2 booking active: tDh7gU6A(09:00–09:30 accepted), tb1DcYAL(09:00–10:00 accepted)
- Vòng 3 · I1: 1 cặp chồng giờ giữa 2 booking active: aToXYuRa(09:00–10:00 accepted), nhjQoLEv(09:00–09:30 accepted)
- Vòng 4 · I1: 1 cặp chồng giờ giữa 2 booking active: cemAQx25(09:00–10:00 accepted), ccptijdb(09:00–09:30 accepted)
- Vòng 5 · I1: 1 cặp chồng giờ giữa 2 booking active: qBuQi2s2(09:00–10:00 accepted), 5pompDY8(09:00–09:30 accepted)
- Vòng 6 · I1: 1 cặp chồng giờ giữa 2 booking active: 85fhd9ir(09:00–10:00 accepted), jY7iENuQ(09:00–09:30 accepted)
- Vòng 7 · I1: 1 cặp chồng giờ giữa 2 booking active: j51Rs7Yb(09:00–09:30 accepted), 2KnmBKDL(09:00–10:00 accepted)
- Vòng 8 · I1: 1 cặp chồng giờ giữa 2 booking active: fGU2Jodr(09:00–10:00 accepted), mDn8vjoA(09:00–09:30 accepted)
- Vòng 9 · I1: 1 cặp chồng giờ giữa 2 booking active: xmgGMj9q(09:00–10:00 accepted), 7iRjh6PB(09:00–09:30 accepted)
- Vòng 10 · I1: 1 cặp chồng giờ giữa 2 booking active: g77Wi1BP(09:00–09:30 accepted), sy79zSkh(09:00–10:00 accepted)

## S18 – Tải cao: 30 người cùng đặt đúng một slot

Invariant: I1 – không chồng giờ; I7 – không lỗi 5xx / hết kết nối khi tải cao

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-09-01T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 2 | 2031-09-02T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 3 | 2031-09-03T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 4 | 2031-09-04T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 5 | 2031-09-05T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 6 | 2031-09-06T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 7 | 2031-09-07T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 8 | 2031-09-08T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 9 | 2031-09-09T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |
| 10 | 2031-09-10T09:00 | PASS | 200×1 409×29 | {"success":1,"activeBookings":1} | 409 booking_conflict_error |

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
| 1 | 2032-03-19T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 2 | 2032-03-20T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 3 | 2032-03-21T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 4 | 2032-03-22T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 5 | 2032-03-23T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 6 | 2032-03-24T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 7 | 2032-03-25T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 8 | 2032-03-26T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 9 | 2032-03-27T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
| 10 | 2032-03-28T09:00 | PASS | 200×1 409×1 | {"cancel":200,"book":409,"activeBookings":0} | 409 no_available_users_found_error |
