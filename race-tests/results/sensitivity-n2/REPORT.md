# Kết quả chạy race test – 2026-10-08T19-56-51-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-08T19:56:51.967Z · Kết thúc: 2026-10-08T19:59:35.978Z
- Số vòng mỗi scenario: 20

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S2 | Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type | 2 | 20/20 | 100% | **FAIL** | 0 | 150 |
| S3 | Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống) | 2 | 20/20 | 100% | **FAIL** | 0 | 121 |
| S5 | Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ) | 2 | 11/20 | 55% | **FAIL** | 0 | 122 |
| S6 | Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau | 2 | 20/20 | 100% | **FAIL** | 0 | 145 |
| S8 | Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau | 2 | 20/20 | 100% | **FAIL** | 0 | 144 |

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
| 11 | 2027-04-25T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 12 | 2027-04-26T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 13 | 2027-04-27T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 14 | 2027-04-28T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 15 | 2027-04-29T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 16 | 2027-04-30T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 17 | 2027-05-01T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 18 | 2027-05-02T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 19 | 2027-05-03T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 20 | 2027-05-04T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |

Vi phạm ghi nhận:

- Vòng 1 · I1: 1 cặp chồng giờ giữa 2 booking active: f8RkG597(09:00–09:30 accepted), jib8tHQf(09:03–09:33 accepted)
- Vòng 2 · I1: 1 cặp chồng giờ giữa 2 booking active: r4fuvHy9(09:03–09:33 accepted), 714MkNRk(09:00–09:30 accepted)
- Vòng 3 · I1: 1 cặp chồng giờ giữa 2 booking active: 5FJFB8a2(09:00–09:30 accepted), myG7Qwwg(09:03–09:33 accepted)
- Vòng 4 · I1: 1 cặp chồng giờ giữa 2 booking active: xqXJ8EFw(09:03–09:33 accepted), 1d9mTbA6(09:00–09:30 accepted)
- Vòng 5 · I1: 1 cặp chồng giờ giữa 2 booking active: aT4eKr3H(09:00–09:30 accepted), fkfCigv9(09:03–09:33 accepted)
- Vòng 6 · I1: 1 cặp chồng giờ giữa 2 booking active: w3mtCFJR(09:00–09:30 accepted), gsBBe7rD(09:03–09:33 accepted)
- Vòng 7 · I1: 1 cặp chồng giờ giữa 2 booking active: efENNxE9(09:03–09:33 accepted), m6j1aWhE(09:00–09:30 accepted)
- Vòng 8 · I1: 1 cặp chồng giờ giữa 2 booking active: rmoDGtDo(09:03–09:33 accepted), ntxjCx6J(09:00–09:30 accepted)
- Vòng 9 · I1: 1 cặp chồng giờ giữa 2 booking active: 9Ee5GLR8(09:03–09:33 accepted), mUbcGZWB(09:00–09:30 accepted)
- Vòng 10 · I1: 1 cặp chồng giờ giữa 2 booking active: tyXxTncH(09:03–09:33 accepted), 4kqae18F(09:00–09:30 accepted)
- Vòng 11 · I1: 1 cặp chồng giờ giữa 2 booking active: pcQZRdYp(09:00–09:30 accepted), cikiRCu9(09:03–09:33 accepted)
- Vòng 12 · I1: 1 cặp chồng giờ giữa 2 booking active: 6iyisuza(09:03–09:33 accepted), fZKhxXc7(09:00–09:30 accepted)
- Vòng 13 · I1: 1 cặp chồng giờ giữa 2 booking active: uBtB5oSf(09:03–09:33 accepted), qpxZtrR2(09:00–09:30 accepted)
- Vòng 14 · I1: 1 cặp chồng giờ giữa 2 booking active: c6BqKt3a(09:00–09:30 accepted), 3VeNBetr(09:03–09:33 accepted)
- Vòng 15 · I1: 1 cặp chồng giờ giữa 2 booking active: 2asY2vMb(09:03–09:33 accepted), wJoaj15p(09:00–09:30 accepted)
- Vòng 16 · I1: 1 cặp chồng giờ giữa 2 booking active: hkbo5kbG(09:03–09:33 accepted), 6unuMBwz(09:00–09:30 accepted)
- Vòng 17 · I1: 1 cặp chồng giờ giữa 2 booking active: cMA15SXb(09:00–09:30 accepted), 4nPKEwGE(09:03–09:33 accepted)
- Vòng 18 · I1: 1 cặp chồng giờ giữa 2 booking active: bTeF9Eex(09:00–09:30 accepted), 49AFtwAQ(09:03–09:33 accepted)
- Vòng 19 · I1: 1 cặp chồng giờ giữa 2 booking active: j5Prbpxk(09:03–09:33 accepted), pfwbAFAo(09:00–09:30 accepted)
- Vòng 20 · I1: 1 cặp chồng giờ giữa 2 booking active: bGzdjjdR(09:00–09:30 accepted), o7ADuv7Q(09:03–09:33 accepted)

## S3 – Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống)

Invariant: I2 – không vượt 3 ghế; I2b – còn ghế thì không được từ chối người đặt

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2027-07-24T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 2 | 2027-07-25T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 3 | 2027-07-26T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 4 | 2027-07-27T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 5 | 2027-07-28T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 6 | 2027-07-29T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 7 | 2027-07-30T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 8 | 2027-07-31T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 9 | 2027-08-01T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 10 | 2027-08-02T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 11 | 2027-08-03T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 12 | 2027-08-04T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 13 | 2027-08-05T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 14 | 2027-08-06T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 15 | 2027-08-07T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 16 | 2027-08-08T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 17 | 2027-08-09T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 18 | 2027-08-10T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 19 | 2027-08-11T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |
| 20 | 2027-08-12T09:00 | **FAIL** | 200×1 409×1 | {"success":1,"seats":1,"bookingsForSlot":1} | 409 booking_conflict_error |

Vi phạm ghi nhận:

- Vòng 1 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 2 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 3 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 4 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 5 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 6 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 7 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 8 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 9 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 10 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 11 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 12 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 13 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 14 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 15 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 16 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 17 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 18 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 19 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error
- Vòng 20 · I2b: Chỉ 1/2 người đặt được dù slot còn ghế; bị từ chối: 409:booking_conflict_error

## S5 – Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ)

Invariant: I3 – tối đa 1 booking accepted/pending cho một slot

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-02-09T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 2 | 2028-02-10T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 3 | 2028-02-11T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 4 | 2028-02-12T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 5 | 2028-02-13T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 6 | 2028-02-14T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 7 | 2028-02-15T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 8 | 2028-02-16T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 9 | 2028-02-17T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 10 | 2028-02-18T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 11 | 2028-02-19T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 12 | 2028-02-20T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 13 | 2028-02-21T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 14 | 2028-02-22T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 15 | 2028-02-23T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 16 | 2028-02-24T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 17 | 2028-02-25T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 18 | 2028-02-26T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |
| 19 | 2028-02-27T09:00 | PASS | 200×1 409×1 | {"success":1,"activeBookings":1,"statuses":["pending"]} | 409 booking_conflict_error |
| 20 | 2028-02-28T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"statuses":["pending","pending"]} |  |

Vi phạm ghi nhận:

- Vòng 1 · I3: 1 cặp chồng giờ giữa 2 booking active: fodzMfHf(09:00–09:30 pending), mg79WW59(09:00–09:30 pending)
- Vòng 3 · I3: 1 cặp chồng giờ giữa 2 booking active: 8jCHB6Xt(09:00–09:30 pending), krv7dLtJ(09:00–09:30 pending)
- Vòng 5 · I3: 1 cặp chồng giờ giữa 2 booking active: aMunA8uT(09:00–09:30 pending), mrieD7a7(09:00–09:30 pending)
- Vòng 7 · I3: 1 cặp chồng giờ giữa 2 booking active: tPCrYSPj(09:00–09:30 pending), 3efHmKju(09:00–09:30 pending)
- Vòng 11 · I3: 1 cặp chồng giờ giữa 2 booking active: oMXsTTTZ(09:00–09:30 pending), mv4859Bf(09:00–09:30 pending)
- Vòng 12 · I3: 1 cặp chồng giờ giữa 2 booking active: 7uZ9oGLT(09:00–09:30 pending), 98orz2wf(09:00–09:30 pending)
- Vòng 14 · I3: 1 cặp chồng giờ giữa 2 booking active: icsSqkQJ(09:00–09:30 pending), k3P1pFvB(09:00–09:30 pending)
- Vòng 15 · I3: 1 cặp chồng giờ giữa 2 booking active: 6No8wXTZ(09:00–09:30 pending), ajDDVRGe(09:00–09:30 pending)
- Vòng 17 · I3: 1 cặp chồng giờ giữa 2 booking active: pNxDWa49(09:00–09:30 pending), 2LNvEnhM(09:00–09:30 pending)
- Vòng 18 · I3: 1 cặp chồng giờ giữa 2 booking active: 31KuQ8vs(09:00–09:30 pending), 1bzi8ukG(09:00–09:30 pending)
- Vòng 20 · I3: 1 cặp chồng giờ giữa 2 booking active: vwbSu2By(09:00–09:30 pending), nXR3aQJQ(09:00–09:30 pending)

## S6 – Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau

Invariant: I4 – một booking gốc sinh tối đa 1 booking mới còn hiệu lực

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-05-19T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 2 | 2028-05-20T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 3 | 2028-05-21T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 4 | 2028-05-22T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 5 | 2028-05-23T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 6 | 2028-05-24T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 7 | 2028-05-25T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 8 | 2028-05-26T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 9 | 2028-05-27T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 10 | 2028-05-28T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 11 | 2028-05-29T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 12 | 2028-05-30T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 13 | 2028-05-31T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 14 | 2028-06-01T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 15 | 2028-06-02T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 16 | 2028-06-03T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 17 | 2028-06-04T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 18 | 2028-06-05T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 19 | 2028-06-06T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |
| 20 | 2028-06-07T09:00 | **FAIL** | 200×2 | {"success":2,"aliveChildren":2,"originalStatus":"cancelled"} |  |

Vi phạm ghi nhận:

- Vòng 1 · I4: Booking gốc kWZhAE9tpbGxEc4VGXdGPF sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 2 · I4: Booking gốc wq4fS9kR9y9ekjB6jjd7Gj sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 3 · I4: Booking gốc mcqQwVrKeoHBQmRAc87pot sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 4 · I4: Booking gốc ewxQM8iA1D5p52gaesAGuk sinh ra 2 booking mới cùng ACCEPTED: 10:00, 11:00
- Vòng 5 · I4: Booking gốc ngdgMC5v7LAkdGC8DmJDBg sinh ra 2 booking mới cùng ACCEPTED: 10:00, 11:00
- Vòng 6 · I4: Booking gốc j2K2o9crUrgX3rwRBuinp9 sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 7 · I4: Booking gốc 6GFmnh1ysnxGEje7PKyyvP sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 8 · I4: Booking gốc fNzcJL8veuHF2nteYQBedJ sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 9 · I4: Booking gốc 4LAeAZD8cB3f4zPhiAGX5j sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 10 · I4: Booking gốc nLB1wYMWrfqx2PgVeYZ8uf sinh ra 2 booking mới cùng ACCEPTED: 10:00, 11:00
- Vòng 11 · I4: Booking gốc bdtjCRFNzEbpb63DtkpSRV sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 12 · I4: Booking gốc b6Su4SR5oEShuFXCPYmNWY sinh ra 2 booking mới cùng ACCEPTED: 10:00, 11:00
- Vòng 13 · I4: Booking gốc 8U4itZwUEV86WmZasnRGpg sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 14 · I4: Booking gốc 342dc2jBangwDXEiixAuMC sinh ra 2 booking mới cùng ACCEPTED: 10:00, 11:00
- Vòng 15 · I4: Booking gốc 8muq7VB6uCVMroh6BM6bhY sinh ra 2 booking mới cùng ACCEPTED: 10:00, 11:00
- Vòng 16 · I4: Booking gốc 2D6Xh4a15nFJeP7Go9C17U sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 17 · I4: Booking gốc rRUk6TNDJfNUTxWdjkt1JH sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 18 · I4: Booking gốc aydVsB7F4hLCqNf7duvntU sinh ra 2 booking mới cùng ACCEPTED: 10:00, 11:00
- Vòng 19 · I4: Booking gốc dBgiv7TQyomP7ETtLWYyok sinh ra 2 booking mới cùng ACCEPTED: 11:00, 10:00
- Vòng 20 · I4: Booking gốc oEvH5YJgUKkMczJZUfJBD9 sinh ra 2 booking mới cùng ACCEPTED: 10:00, 11:00

## S8 – Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau

Invariant: I6 – số booking active trong ngày ≤ bookingLimits.PER_DAY (=1)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2028-12-05T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 2 | 2028-12-06T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 3 | 2028-12-07T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 4 | 2028-12-08T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 5 | 2028-12-09T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 6 | 2028-12-10T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 7 | 2028-12-11T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 8 | 2028-12-12T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 9 | 2028-12-13T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 10 | 2028-12-14T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 11 | 2028-12-15T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 12 | 2028-12-16T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 13 | 2028-12-17T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 14 | 2028-12-18T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 15 | 2028-12-19T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 16 | 2028-12-20T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 17 | 2028-12-21T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 18 | 2028-12-22T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 19 | 2028-12-23T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 20 | 2028-12-24T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |

Vi phạm ghi nhận:

- Vòng 1 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 2 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 3 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 4 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 5 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 6 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 7 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 8 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 9 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 10 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 11 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 12 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 13 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 14 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 15 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 16 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 17 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 18 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 19 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
- Vòng 20 · I6: 2 booking active trong cùng ngày, giới hạn là 1: 09:00, 10:00
