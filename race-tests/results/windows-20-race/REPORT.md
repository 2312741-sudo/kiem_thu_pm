# Kết quả chạy race test – 2026-10-21T11-12-54-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-21T11:13:44.617Z · Kết thúc: 2026-10-21T11:21:12.832Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S1 | Nhiều người cùng đặt đúng một slot (event 1-1) | 10 | 0/10 | 0% | **PASS** | 0 | 624 |
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 10 | 10/10 | 100% | **FAIL** | 0 | 801 |
| S3 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 6 | 10/10 | 100% | **FAIL** | 0 | 326 |
| S4 | Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người | 6 | 0/10 | 0% | **PASS** | 0 | 331 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 10 | 10/10 | 100% | **FAIL** | 0 | 723 |
| S6 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 5 | 10/10 | 100% | **FAIL** | 0 | 782 |
| S7 | Hủy và đổi lịch cùng lúc trên một booking | 2 | 9/10 | 90% | **FAIL** | 0 | 1348 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 8 | 10/10 | 100% | **FAIL** | 0 | 698 |
| S9 | Hai booking khác nhau cùng được đổi lịch sang đúng một slot trống | 2 | 0/10 | 0% | **PASS** | 0 | 153 |
| S10 | Đổi lịch một booking sang slot X đúng lúc có người đặt mới vào slot X | 2 | 0/10 | 0% | **PASS** | 0 | 157 |
| S11 | Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn | 6 | 10/10 | 100% | **FAIL** | 0 | 500 |
| S12 | Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau | 6 | 10/10 | 100% | **FAIL** | 0 | 469 |
| S13 | Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần | 6 | 10/10 | 100% | **FAIL** | 0 | 879 |
| S14 | Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt | 6 | 10/10 | 100% | **FAIL** | 0 | 765 |
| S15 | Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab) | 6 | 10/10 | 100% | **FAIL** | 0 | 344 |
| S16 | Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế) | 6 | 10/10 | 100% | **FAIL** | 0 | 428 |
| S17 | Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host | 10 | 10/10 | 100% | **FAIL** | 0 | 859 |
| S18 | Tải cao: 30 người cùng đặt đúng một slot | 30 | 0/10 | 0% | **PASS** | 1 | 1502 |
| S19 | 20 người đặt 20 slot khác nhau không chồng nhau cùng lúc (không được từ chối nhầm) | 20 | 0/10 | 0% | **PASS** | 1 | 2660 |
| S20 | Hủy booking cũ và đặt booking mới vào đúng slot đó cùng lúc | 2 | 0/10 | 0% | **PASS** | 0 | 100 |

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

- Vòng 1 · I1: 45 cặp chồng giờ giữa 10 booking active: p6Bv4BjR(09:00–09:30 accepted), cmZKrdG2(09:09–09:39 accepted), tiqiwMXK(09:03–09:33 accepted), f48bUesT(08:54–09:54 accepted), 9yGf6nUU(09:12–09:42 accepted), 9rnrMGVy(09:27–09:57 accepted), mZ9Tw9E3(09:21–09:51 accepted), bpDwsRZv(08:36–09:36 accepted), nR1rYesF(08:45–09:45 accepted), t86XmKzr(09:18–09:48 accepted)
- Vòng 2 · I1: 45 cặp chồng giờ giữa 10 booking active: wQHYp3qp(08:45–09:45 accepted), 37dBvn81(09:21–09:51 accepted), 3DkebRbM(09:09–09:39 accepted), bcKpe8dc(09:18–09:48 accepted), uav2Ct83(09:27–09:57 accepted), 19tH1vfA(08:36–09:36 accepted), hhD66bZT(09:03–09:33 accepted), fuWTbbUU(09:00–09:30 accepted), oGJPjbiw(08:54–09:54 accepted), 2orVeizB(09:12–09:42 accepted)
- Vòng 3 · I1: 45 cặp chồng giờ giữa 10 booking active: j6SZ19HB(09:12–09:42 accepted), qouCmjcn(09:09–09:39 accepted), nnjsQtS8(09:00–09:30 accepted), qeX4YQbA(09:03–09:33 accepted), qRK4CzYv(08:54–09:54 accepted), skk6mu47(09:27–09:57 accepted), 99WtnRBv(09:18–09:48 accepted), nt6bAKwp(08:36–09:36 accepted), qZSb6gRf(08:45–09:45 accepted), nxARvSgQ(09:21–09:51 accepted)
- Vòng 4 · I1: 45 cặp chồng giờ giữa 10 booking active: dhPg3KsR(09:18–09:48 accepted), gGiAgNZS(08:45–09:45 accepted), tJ3Fe2Aj(08:36–09:36 accepted), 8ATdKZpD(08:54–09:54 accepted), wK4uiPPS(09:21–09:51 accepted), uRkv4j8B(09:12–09:42 accepted), djCYBreB(09:27–09:57 accepted), sCxwVeDK(09:03–09:33 accepted), 238Jn5k6(09:00–09:30 accepted), eQRdLRyJ(09:09–09:39 accepted)
- Vòng 5 · I1: 45 cặp chồng giờ giữa 10 booking active: uccCnY9k(09:27–09:57 accepted), 1m9CYpRd(09:03–09:33 accepted), 9iTxG3Qu(09:18–09:48 accepted), 4itVDgms(09:12–09:42 accepted), x54nXi2u(08:36–09:36 accepted), ubUA1NDa(09:09–09:39 accepted), ccZdUw1J(08:45–09:45 accepted), ow7wqTP2(08:54–09:54 accepted), eJ1j8ktn(09:00–09:30 accepted), ipeMA8n1(09:21–09:51 accepted)
- Vòng 6 · I1: 45 cặp chồng giờ giữa 10 booking active: qBt6c4MF(09:03–09:33 accepted), 16vu8tGM(09:09–09:39 accepted), faxWMZZ3(09:00–09:30 accepted), gGEZVEeh(08:54–09:54 accepted), d52f6tKN(09:18–09:48 accepted), m6vjVXSL(08:45–09:45 accepted), q8XYcEpj(09:12–09:42 accepted), snvjbk4e(09:21–09:51 accepted), aUTkvQT5(09:27–09:57 accepted), t5pSidkU(08:36–09:36 accepted)
- Vòng 7 · I1: 45 cặp chồng giờ giữa 10 booking active: 1uzVU6GY(09:03–09:33 accepted), 5b23KtAm(09:18–09:48 accepted), uSYgP6qH(09:21–09:51 accepted), iqx2Wy2A(09:09–09:39 accepted), cSHjUHQA(08:54–09:54 accepted), dVMBmWB9(09:00–09:30 accepted), fiNiNwNy(09:12–09:42 accepted), f3Fkc7hT(08:36–09:36 accepted), 6mjvV382(09:27–09:57 accepted), rkivP9S8(08:45–09:45 accepted)
- Vòng 8 · I1: 45 cặp chồng giờ giữa 10 booking active: p3vUdk7Q(09:00–09:30 accepted), 7NPdM6hT(09:09–09:39 accepted), f2QQYXi6(08:54–09:54 accepted), ie744pmh(08:36–09:36 accepted), w7WEL9hN(08:45–09:45 accepted), mEiF4u9U(09:12–09:42 accepted), f63LDqHQ(09:03–09:33 accepted), hNGiEimm(09:18–09:48 accepted), bNzvWSVz(09:27–09:57 accepted), 9TANNy2r(09:21–09:51 accepted)
- Vòng 9 · I1: 45 cặp chồng giờ giữa 10 booking active: xuyotZon(09:00–09:30 accepted), 35yFEvKa(08:45–09:45 accepted), tMDVeFYy(09:03–09:33 accepted), 7LGz46MK(08:36–09:36 accepted), h39yycKR(09:09–09:39 accepted), rCCzq2J3(09:12–09:42 accepted), dk515Pvh(09:18–09:48 accepted), fFBMtsTH(09:27–09:57 accepted), cpgnMkbP(08:54–09:54 accepted), jZAVNXkW(09:21–09:51 accepted)
- Vòng 10 · I1: 45 cặp chồng giờ giữa 10 booking active: o4qR1nNb(09:00–09:30 accepted), jFgajAui(08:45–09:45 accepted), rbtLmhgk(09:03–09:33 accepted), aLs7VS4B(08:36–09:36 accepted), 1eXVysEy(09:09–09:39 accepted), 7DiWBwCo(09:18–09:48 accepted), 9F2YfZDd(08:54–09:54 accepted), nyffc5XB(09:21–09:51 accepted), 2yCdsBW6(09:27–09:57 accepted), khgNiMdT(09:12–09:42 accepted)

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
| 5 | 2028-02-13T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 6 | 2028-02-14T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 7 | 2028-02-15T09:00 | **FAIL** | 200×9 409×1 | {"success":9,"activeBookings":9,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending"]} | 409 booking_conflict_error |
| 8 | 2028-02-16T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 9 | 2028-02-17T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |
| 10 | 2028-02-18T09:00 | **FAIL** | 200×10 | {"success":10,"activeBookings":10,"statuses":["pending","pending","pending","pending","pending","pending","pending","pending","pending","pending"]} |  |

Vi phạm ghi nhận:

- Vòng 1 · I3: 45 cặp chồng giờ giữa 10 booking active: 3J3poDLJ(09:00–09:30 pending), pqHaU56m(09:00–09:30 pending), mzFuzeap(09:00–09:30 pending), 5T13toyk(09:00–09:30 pending), gR7hqxMi(09:00–09:30 pending), 7nd41jR1(09:00–09:30 pending), bmcqMESg(09:00–09:30 pending), bZpMTwmc(09:00–09:30 pending), pJyjBnJH(09:00–09:30 pending), tRiGyQA6(09:00–09:30 pending)
- Vòng 2 · I3: 45 cặp chồng giờ giữa 10 booking active: evoRWBz6(09:00–09:30 pending), vEjZu1oZ(09:00–09:30 pending), 6mbU65xq(09:00–09:30 pending), brKSX43x(09:00–09:30 pending), 2uMqERLk(09:00–09:30 pending), frFbRc7u(09:00–09:30 pending), f8ZCRJFy(09:00–09:30 pending), 2rjwYK5c(09:00–09:30 pending), wHwuT8WM(09:00–09:30 pending), 8BTSx6Dm(09:00–09:30 pending)
- Vòng 3 · I3: 45 cặp chồng giờ giữa 10 booking active: 1ocXmFs2(09:00–09:30 pending), riqXDaYQ(09:00–09:30 pending), jmVYDWMH(09:00–09:30 pending), rxXzKb24(09:00–09:30 pending), j8frF36H(09:00–09:30 pending), t59cCDb7(09:00–09:30 pending), w29Hzq7j(09:00–09:30 pending), kdNtcz52(09:00–09:30 pending), vitvotr8(09:00–09:30 pending), 5uxZef79(09:00–09:30 pending)
- Vòng 4 · I3: 45 cặp chồng giờ giữa 10 booking active: 1bCmmLSw(09:00–09:30 pending), 9KakCPUf(09:00–09:30 pending), 8iEXbLZP(09:00–09:30 pending), fCrYVYdK(09:00–09:30 pending), bnPy2SNQ(09:00–09:30 pending), rgKe6U7N(09:00–09:30 pending), 2B35otmj(09:00–09:30 pending), gC1AVBqU(09:00–09:30 pending), 251DWJRH(09:00–09:30 pending), 52fRQFMM(09:00–09:30 pending)
- Vòng 5 · I3: 36 cặp chồng giờ giữa 9 booking active: dHkxgmpR(09:00–09:30 pending), a7V7yXLk(09:00–09:30 pending), d9rnQ3FC(09:00–09:30 pending), iLiLe45j(09:00–09:30 pending), wyq5xGuq(09:00–09:30 pending), vhH71CjW(09:00–09:30 pending), pbUxVFV7(09:00–09:30 pending), 7a91uCBp(09:00–09:30 pending), drFA5kcd(09:00–09:30 pending)
- Vòng 6 · I3: 36 cặp chồng giờ giữa 9 booking active: hoVd5RNH(09:00–09:30 pending), fJamkuyd(09:00–09:30 pending), 4Qe7hWNj(09:00–09:30 pending), 3Fs6DqHj(09:00–09:30 pending), uhRJrvp8(09:00–09:30 pending), aVhpoyWd(09:00–09:30 pending), rzi2C8Ko(09:00–09:30 pending), gAtK3Pvy(09:00–09:30 pending), bAmct3nD(09:00–09:30 pending)
- Vòng 7 · I3: 36 cặp chồng giờ giữa 9 booking active: 2UrwLG2T(09:00–09:30 pending), jH6oif3N(09:00–09:30 pending), cbNeY8NX(09:00–09:30 pending), fWZLZWHb(09:00–09:30 pending), 1eTkic8F(09:00–09:30 pending), vEBw8xtU(09:00–09:30 pending), 5FyCFTqf(09:00–09:30 pending), sTLp7QXz(09:00–09:30 pending), dd9f4pmu(09:00–09:30 pending)
- Vòng 8 · I3: 45 cặp chồng giờ giữa 10 booking active: kKmovPQJ(09:00–09:30 pending), ug9f1f5M(09:00–09:30 pending), fa5REZ5s(09:00–09:30 pending), n639un5q(09:00–09:30 pending), 848whNQV(09:00–09:30 pending), 788yPxve(09:00–09:30 pending), krtQBVcf(09:00–09:30 pending), 4xFgHJC6(09:00–09:30 pending), kQE84n6X(09:00–09:30 pending), tdjynr7T(09:00–09:30 pending)
- Vòng 9 · I3: 45 cặp chồng giờ giữa 10 booking active: pAWjGzGQ(09:00–09:30 pending), ojzpyMce(09:00–09:30 pending), kS3HwfTo(09:00–09:30 pending), pWPKTFhg(09:00–09:30 pending), iBApT667(09:00–09:30 pending), 3Znho6Wx(09:00–09:30 pending), 6neXbjLB(09:00–09:30 pending), 92ayWrBy(09:00–09:30 pending), 8qduw8do(09:00–09:30 pending), hSbN1Uf1(09:00–09:30 pending)
- Vòng 10 · I3: 45 cặp chồng giờ giữa 10 booking active: x2XhtBKf(09:00–09:30 pending), 7HrngvnM(09:00–09:30 pending), rP8E5577(09:00–09:30 pending), obdmzpFf(09:00–09:30 pending), wYM59mYg(09:00–09:30 pending), cWXD5h6S(09:00–09:30 pending), 43oxUeip(09:00–09:30 pending), bs86nkDy(09:00–09:30 pending), anStWhfE(09:00–09:30 pending), 3o6PtXUi(09:00–09:30 pending)

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

- Vòng 1 · I4: Booking gốc bQTKGQoPEp6w2Pzkcay2fY sinh ra 5 booking mới cùng ACCEPTED: 14:00, 10:00, 12:00, 11:00, 13:00
- Vòng 2 · I4: Booking gốc 7ZZFB5vfWbFuY2bJbtYwkQ sinh ra 5 booking mới cùng ACCEPTED: 11:00, 12:00, 13:00, 10:00, 14:00
- Vòng 3 · I4: Booking gốc hqyqxgpf1arooN4FRdzugc sinh ra 5 booking mới cùng ACCEPTED: 14:00, 11:00, 12:00, 13:00, 10:00
- Vòng 4 · I4: Booking gốc ruxRATMWDFKfWZCtqSMEH7 sinh ra 5 booking mới cùng ACCEPTED: 11:00, 12:00, 10:00, 13:00, 14:00
- Vòng 5 · I4: Booking gốc rgrwTmrUcaHuuar3jCQnA7 sinh ra 5 booking mới cùng ACCEPTED: 11:00, 14:00, 13:00, 12:00, 10:00
- Vòng 6 · I4: Booking gốc nHc3wXhGFrom6ggjBmhRzV sinh ra 5 booking mới cùng ACCEPTED: 11:00, 10:00, 13:00, 12:00, 14:00
- Vòng 7 · I4: Booking gốc v2GNCUSYcpuhzmNaLe21aZ sinh ra 5 booking mới cùng ACCEPTED: 11:00, 12:00, 10:00, 13:00, 14:00
- Vòng 8 · I4: Booking gốc gP3oPcCTervBZ7ySKZVQe3 sinh ra 5 booking mới cùng ACCEPTED: 10:00, 12:00, 13:00, 14:00, 11:00
- Vòng 9 · I4: Booking gốc wDBpa5MqoBvZfZE5bEzn5b sinh ra 5 booking mới cùng ACCEPTED: 11:00, 14:00, 12:00, 10:00, 13:00
- Vòng 10 · I4: Booking gốc htoWdz8Rxx4m3JBYKm3MhF sinh ra 5 booking mới cùng ACCEPTED: 10:00, 14:00, 11:00, 12:00, 13:00

## S7 – Hủy và đổi lịch cùng lúc trên một booking

Invariant: I5 – nếu lệnh hủy báo thành công thì không còn booking nào của cuộc hẹn đó active

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-08-27T09:00 | PASS | 200×1 400×1 | {"cancel":400,"reschedule":200,"aliveChildren":1} | 400 This booking has already been cancelled. |
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

- Vòng 2 · I5: Hủy trả 200 nhưng vẫn còn booking active mcJxJvkHd7Fa1k89i4MquS (reschedule trả 200)
- Vòng 3 · I5: Hủy trả 200 nhưng vẫn còn booking active s98X19XfQ7abYCjkNXh2Fc (reschedule trả 200)
- Vòng 4 · I5: Hủy trả 200 nhưng vẫn còn booking active a23gZhp6QZKph47v4oxEEx (reschedule trả 200)
- Vòng 5 · I5: Hủy trả 200 nhưng vẫn còn booking active ejiD4kVqrSLjWCs2ZYBBtm (reschedule trả 200)
- Vòng 6 · I5: Hủy trả 200 nhưng vẫn còn booking active 5NPc2RsXkDN6wbSd3Sk2jQ (reschedule trả 200)
- Vòng 7 · I5: Hủy trả 200 nhưng vẫn còn booking active 5qiLkD1CNGk925YGa7zggo (reschedule trả 200)
- Vòng 8 · I5: Hủy trả 200 nhưng vẫn còn booking active oyXLj8TJm8C1azgYXigB99 (reschedule trả 200)
- Vòng 9 · I5: Hủy trả 200 nhưng vẫn còn booking active qhKvunnSaE52xurcYfcE7C (reschedule trả 200)
- Vòng 10 · I5: Hủy trả 200 nhưng vẫn còn booking active 23Go7NLfhsQtf9NTvdSBFh (reschedule trả 200)

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
| 2 | 2031-02-14T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 3 | 2031-02-15T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 4 | 2031-02-16T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 5 | 2031-02-17T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
| 6 | 2031-02-18T09:00 | **FAIL** | 200×2 409×4 | {"success":2,"seatsOfSameEmail":2} | 409 booking_seats_full_error |
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

- Vòng 1 · I1: 1 cặp chồng giờ giữa 2 booking active: xi8gVNEF(09:00–09:30 accepted), 3Lq1a2oB(09:00–10:00 accepted)
- Vòng 2 · I1: 1 cặp chồng giờ giữa 2 booking active: 2MiwvsTM(09:00–09:30 accepted), 43QXfSYK(09:00–10:00 accepted)
- Vòng 3 · I1: 1 cặp chồng giờ giữa 2 booking active: vRhUaT6a(09:00–10:00 accepted), wyMt4aYH(09:00–09:30 accepted)
- Vòng 4 · I1: 1 cặp chồng giờ giữa 2 booking active: 9XC6L7AZ(09:00–09:30 accepted), 7caLZz2o(09:00–10:00 accepted)
- Vòng 5 · I1: 1 cặp chồng giờ giữa 2 booking active: 6YAgRs12(09:00–10:00 accepted), jR9C2aB8(09:00–09:30 accepted)
- Vòng 6 · I1: 1 cặp chồng giờ giữa 2 booking active: k1hCXgr9(09:00–10:00 accepted), 66bM73Qm(09:00–09:30 accepted)
- Vòng 7 · I1: 1 cặp chồng giờ giữa 2 booking active: pxZC2qha(09:00–09:30 accepted), x2bVASST(09:00–10:00 accepted)
- Vòng 8 · I1: 1 cặp chồng giờ giữa 2 booking active: mBGazXub(09:00–09:30 accepted), h1FaoP1k(09:00–10:00 accepted)
- Vòng 9 · I1: 1 cặp chồng giờ giữa 2 booking active: bdwN4K4n(09:00–09:30 accepted), j6wgwYZ1(09:00–10:00 accepted)
- Vòng 10 · I1: 1 cặp chồng giờ giữa 2 booking active: kXtSi6J6(09:00–09:30 accepted), vicuoL52(09:00–10:00 accepted)

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
