# Kết quả chạy race test – 2026-10-20T13-46-36-race

- Chế độ gửi request: **đồng thời (race, k6)**
- Hệ thống: Cal.com v6.2.0 tại http://localhost:3000
- Bắt đầu: 2026-10-20T13:46:36.481Z · Kết thúc: 2026-10-20T13:48:33.945Z
- Số vòng mỗi scenario: 10

## Tổng hợp

| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |
|---|---|---|---|---|---|---|---|
| S11 | Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn | 2 | 10/10 | 100% | **FAIL** | 0 | 156 |
| S12 | Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau | 2 | 10/10 | 100% | **FAIL** | 0 | 150 |
| S13 | Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần | 2 | 10/10 | 100% | **FAIL** | 0 | 404 |
| S14 | Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt | 2 | 10/10 | 100% | **FAIL** | 0 | 153 |
| S15 | Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab) | 2 | 10/10 | 100% | **FAIL** | 0 | 122 |
| S16 | Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế) | 2 | 10/10 | 100% | **FAIL** | 0 | 134 |
| S17 | Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host | 2 | 10/10 | 100% | **FAIL** | 0 | 166 |

## S11 – Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn

Invariant: I8 – hai booking liền kề của host cách nhau ≥ buffer (30 phút)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2029-10-01T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 2 | 2029-10-02T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 3 | 2029-10-03T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 4 | 2029-10-04T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 5 | 2029-10-05T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 6 | 2029-10-06T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 7 | 2029-10-07T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 8 | 2029-10-08T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 9 | 2029-10-09T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 10 | 2029-10-10T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |

Vi phạm ghi nhận:

- Vòng 1 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 2 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 3 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 4 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 5 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 6 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 7 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 8 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 9 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)
- Vòng 10 · I8: Booking 09:00 và 09:30 chỉ cách nhau 0 phút (buffer yêu cầu 30)

## S12 – Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau

Invariant: I9 – tổng thời lượng booking active trong ngày ≤ durationLimits.PER_DAY (30 phút)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-01-09T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 2 | 2030-01-10T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 3 | 2030-01-11T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 4 | 2030-01-12T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 5 | 2030-01-13T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 6 | 2030-01-14T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 7 | 2030-01-15T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 8 | 2030-01-16T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 9 | 2030-01-17T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |
| 10 | 2030-01-18T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2,"minutes":60} |  |

Vi phạm ghi nhận:

- Vòng 1 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 2 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 3 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 4 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 5 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 6 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 7 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 8 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 9 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút
- Vòng 10 · I9: Tổng thời lượng 60 phút trong ngày (2 booking), giới hạn 30 phút

## S13 – Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần

Invariant: I6 – số booking active trong tuần ≤ bookingLimits.PER_WEEK (=1)

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-04-19T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 2 | 2030-04-20T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 3 | 2030-04-21T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 4 | 2030-04-22T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 5 | 2030-04-23T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 6 | 2030-04-24T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 7 | 2030-04-25T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 8 | 2030-04-26T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 9 | 2030-04-27T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 10 | 2030-04-28T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |

Vi phạm ghi nhận:

- Vòng 1 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 2 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 3 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 4 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 5 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 6 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 7 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 8 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 9 · I6: 2 booking active trong cùng tuần, giới hạn là 1
- Vòng 10 · I6: 2 booking active trong cùng tuần, giới hạn là 1

## S14 – Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt

Invariant: I10 – một người đặt có tối đa maxActiveBookingsPerBooker (=1) booking active

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-07-28T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 2 | 2030-07-29T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 3 | 2030-07-30T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 4 | 2030-07-31T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 5 | 2030-08-01T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 6 | 2030-08-02T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 7 | 2030-08-03T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 8 | 2030-08-04T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 9 | 2030-08-05T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 10 | 2030-08-06T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |

Vi phạm ghi nhận:

- Vòng 1 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 2 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 3 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 4 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 5 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 6 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 7 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 8 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 9 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1
- Vòng 10 · I10: Cùng một người đặt có 2 booking active, giới hạn là 1

## S15 – Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab)

Invariant: I5 – đúng 1 lệnh hủy thành công, các lệnh còn lại bị từ chối; booking cuối cùng ở trạng thái cancelled

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2030-11-05T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 2 | 2030-11-06T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 3 | 2030-11-07T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 4 | 2030-11-08T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 5 | 2030-11-09T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 6 | 2030-11-10T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 7 | 2030-11-11T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 8 | 2030-11-12T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 9 | 2030-11-13T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |
| 10 | 2030-11-14T09:00 | **FAIL** | 200×2 | {"success":2,"finalStatus":"cancelled"} |  |

Vi phạm ghi nhận:

- Vòng 1 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 2 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 3 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 4 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 5 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 6 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 7 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 8 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 9 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)
- Vòng 10 · I5: 2 lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)

## S16 – Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế)

Invariant: I11 – một email chỉ chiếm tối đa 1 ghế trong một slot

| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |
|---|---|---|---|---|---|
| 1 | 2031-02-13T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 2 | 2031-02-14T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 3 | 2031-02-15T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 4 | 2031-02-16T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 5 | 2031-02-17T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 6 | 2031-02-18T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 7 | 2031-02-19T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 8 | 2031-02-20T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 9 | 2031-02-21T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |
| 10 | 2031-02-22T09:00 | **FAIL** | 200×2 | {"success":2,"seatsOfSameEmail":2} |  |

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
| 1 | 2031-05-24T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 2 | 2031-05-25T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 3 | 2031-05-26T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 4 | 2031-05-27T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 5 | 2031-05-28T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 6 | 2031-05-29T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 7 | 2031-05-30T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 8 | 2031-05-31T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 9 | 2031-06-01T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |
| 10 | 2031-06-02T09:00 | **FAIL** | 200×2 | {"success":2,"activeBookings":2} |  |

Vi phạm ghi nhận:

- Vòng 1 · I1: 1 cặp chồng giờ giữa 2 booking active: a6GYNEM1(09:00–10:00 accepted), efZhiU8R(09:00–09:30 accepted)
- Vòng 2 · I1: 1 cặp chồng giờ giữa 2 booking active: ccVRvLbP(09:00–09:30 accepted), 5k3k4hzg(09:00–10:00 accepted)
- Vòng 3 · I1: 1 cặp chồng giờ giữa 2 booking active: xAd8eeLd(09:00–10:00 accepted), rubXWpmR(09:00–09:30 accepted)
- Vòng 4 · I1: 1 cặp chồng giờ giữa 2 booking active: tG74Z6Vx(09:00–10:00 accepted), 41y7a69a(09:00–09:30 accepted)
- Vòng 5 · I1: 1 cặp chồng giờ giữa 2 booking active: ddWKAdRJ(09:00–10:00 accepted), iPRUxoTi(09:00–09:30 accepted)
- Vòng 6 · I1: 1 cặp chồng giờ giữa 2 booking active: qT8LuBYX(09:00–09:30 accepted), 8WVx5f4b(09:00–10:00 accepted)
- Vòng 7 · I1: 1 cặp chồng giờ giữa 2 booking active: dqeoDGVh(09:00–10:00 accepted), 1cJfbQiN(09:00–09:30 accepted)
- Vòng 8 · I1: 1 cặp chồng giờ giữa 2 booking active: ucHbGPuu(09:00–09:30 accepted), dFFp9U4X(09:00–10:00 accepted)
- Vòng 9 · I1: 1 cặp chồng giờ giữa 2 booking active: spUFJqPK(09:00–09:30 accepted), eA3soG2s(09:00–10:00 accepted)
- Vòng 10 · I1: 1 cặp chồng giờ giữa 2 booking active: rrtLU78x(09:00–10:00 accepted), fTnqNgk7(09:00–09:30 accepted)
