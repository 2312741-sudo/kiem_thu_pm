# Đối chiếu nguyên nhân gốc với mã nguồn Cal.com v6.2.0

- **Người đối chiếu:** Võ Công Vinh (2312800)
- **Ngày đối chiếu:** 28/11/2026
- **Mã nguồn:** Cal.com commit `1c193cca8682b33b9866c792186033f7ef886682` (tag v6.2.0), lấy trực tiếp từ GitHub bằng `git fetch --depth 1` đúng commit này. Đây cũng là commit nhóm đã ghim khi chạy test.
- **Cách làm:** với từng lỗi D1 đến D11 và hai quan sát O1, O2, mở đúng file và số dòng mà [DEFECTS.md](../DEFECTS.md) nêu, đọc đoạn mã và trả lời hai câu: (1) file và dòng có đúng không; (2) đoạn mã có đúng là "kiểm tra rồi mới ghi" (hoặc lỗi logic) như DEFECTS.md mô tả không.
- **Giới hạn:** chỉ đọc mã, không chạy lại test. Số dòng có dấu "~" là vị trí gần đúng của lời gọi hàm.

Đường dẫn viết tắt: `bookings/` = `packages/features/bookings/lib/`, `RBS` = `bookings/service/RegularBookingService.ts`.

## Kết quả

| Lỗi | File và dòng đã xem | Kết quả | Giải thích |
|---|---|---|---|
| D1 | `RBS` dòng 1029, 1044, 1063, 1089 (`ensureAvailableUsers`), 1939 (`createBooking`), 2097 (bắt `P2002`); `packages/prisma/extensions/booking-idempotency-key.ts` | Khớp | Hàm đọc lịch bận của host ở các dòng ~1029–1089, còn lệnh ghi booking ở dòng 1939. Trong `RBS` không có `$transaction`, `FOR UPDATE` hay advisory lock nào bao hai bước này. Khóa chống trùng được tạo từ `startTime.valueOf()`, `endTime.valueOf()` và `userId`, nên hai khoảng giờ chồng nhau nhưng khác giờ bắt đầu vẫn có khóa khác nhau. Dòng 2097 chỉ đổi `P2002` sang 409, đúng như DEFECTS.md nói về mã `23P01` bị rơi vào nhánh lỗi chung. |
| D2 | `bookings/handleSeats/handleSeats.ts` dòng 170–204; `bookings/handleSeats/create/createNewSeat.ts` dòng 47–53 | Khớp, đã sửa nhỏ | `handleSeats` tìm booking `ACCEPTED` của slot (dòng 170). Nếu không có thì `return` ở dòng 204, luồng quay về tạo booking mới. Nhiều request vào slot trống cùng đi nhánh này. DEFECTS.md gọi đúng tên `addSeatToBooking()` nhưng không ghi file; hàm này nằm trong `createNewSeat.ts` (dòng 47), không phải `handleSeats.ts`. Đã bổ sung đường dẫn vào DEFECTS.md. |
| D3 | `packages/prisma/extensions/booking-idempotency-key.ts` dòng 28 | Khớp | Extension chỉ gán `idempotencyKey` khi `status === ACCEPTED`. Booking `PENDING` để khóa rỗng, nên ràng buộc duy nhất không chặn được gì với event cần xác nhận. |
| D4 | `bookings/handleNewBooking/originalRescheduledBookingUtils.ts` dòng 16–17; `bookings/handleNewBooking/createBooking.ts` dòng 311–320; `packages/trpc/server/routers/viewer/bookings/requestReschedule.handler.ts` dòng 110–111 | Khớp | Hàm chỉ từ chối khi booking đã hủy **và** `rescheduled` là false. Cả hai nơi ghi (đổi lịch xong ở `createBooking.ts`, host yêu cầu đổi lịch ở `requestReschedule.handler.ts`) đều đặt `CANCELLED` + `rescheduled: true`, nên hàm không phân biệt được hai trường hợp. Lệnh cập nhật booking gốc chỉ có `where: { id }`. |
| D5 | `bookings/handleNewBooking/createBooking.ts` dòng 182–187 và 311–320; `RBS` dòng 515, 758 | Khớp | Booking gốc được đọc ở đầu luồng (`getOriginalRescheduledBooking`, `RBS` dòng 515 và 758). Mãi đến transaction ở `createBooking.ts` dòng 182 mới `update` booking gốc theo `id`, không kiểm tra lại trạng thái. Nếu lệnh hủy chen vào giữa thì bước ghi vẫn chạy. |
| D6 | `bookings/checkBookingLimits.ts` dòng 93 (đếm), 104 (trả 403); `RBS` dòng 944 | Khớp, đã sửa nhỏ | Hàm đếm số booking trong khoảng thời gian rồi so với giới hạn, sau đó mới tới lệnh ghi ở `RBS` dòng 1939. Không có khóa giữa hai bước. Đã thêm số dòng của phép đếm vào DEFECTS.md. |
| D7 | `bookings/handleNewBooking/ensureAvailableUsers.ts` dòng 103–104 | Khớp | Thời gian đệm (`beforeEventBuffer`, `afterEventBuffer`) chỉ được dùng khi đọc lịch bận của host trong `ensureAvailableUsers`, tức là cũng ở bước đọc trước khi ghi như D1. |
| D8 | `RBS` dòng 944; `bookings/handleNewBooking/checkBookingAndDurationLimits.ts` dòng 44–46; `bookings/checkDurationLimits.ts` dòng 33, 59 | Lệch nhẹ, đã sửa | DEFECTS.md viết `checkBookingAndDurationLimits` "cộng thời lượng". Thật ra hàm này chỉ gọi tiếp `checkDurationLimits`, và phép cộng nằm ở `getTotalBookingDuration` (`checkDurationLimits.ts` dòng 59). Kết luận "đọc tổng rồi mới ghi, không khóa" vẫn đúng. Mã 401 ở chế độ tuần tự là do `checkDurationLimits.ts` dòng 33 bọc lỗi 403 thành 401, giống O1. Đã ghi rõ vào DEFECTS.md. |
| D9 | `RBS` dòng 702; `bookings/handleNewBooking/checkActiveBookingsLimitForBooker.ts` dòng 45–62 | Khớp, đã bổ sung | Phép đếm `prisma.booking.count` theo email ở dòng 45, so với giới hạn ở dòng 62, rồi luồng mới đi tiếp tới bước ghi. Phép đếm chỉ tính booking `ACCEPTED` có giờ bắt đầu trong tương lai; test S14 đặt giờ tương lai nên không ảnh hưởng kết quả. Đã ghi chi tiết này vào DEFECTS.md. |
| D10 | `bookings/handleCancelBooking.ts` dòng 197–200, 567–572, 600 | Khớp, đã sửa nhỏ | Kiểm tra "đã hủy chưa" ở dòng 197 trên bản đọc đầu hàm. Lệnh cập nhật ở dòng 567 chỉ có `where: { uid }`, không kèm điều kiện trạng thái. Sau đó mới gửi email, webhook, hoàn tiền. Lời gọi hoàn tiền `processPaymentRefund` ở dòng 600 chứ không phải ~605 (605 là dòng ghi log lỗi); đã sửa trong DEFECTS.md. |
| D11 | `bookings/handleSeats/handleSeats.ts` dòng 208–214; `bookings/handleSeats/create/createNewSeat.ts` dòng 50–83 | Khớp | Kiểm tra "email này đã đăng ký chưa" ở `handleSeats.ts` dòng 209, trên bản đọc chưa khóa. Khóa `FOR UPDATE` ở `createNewSeat.ts` dòng 53. Sau khi khóa, hàm đọc lại booking nhưng chỉ đếm số ghế (dòng 56–77), không kiểm tra lại email. Vì vậy cùng một email đi qua được nhiều lần. |
| O1 | `bookings/checkBookingLimits.ts` dòng 43–44 và 104 | Khớp | Lỗi gốc là 403 (dòng 104) nhưng khối `catch` ở dòng 44 bọc lại thành 401. `checkDurationLimits.ts` dòng 33 có cùng cách viết. |
| O2 | `RBS` dòng 1441 | Khớp | `uid` sinh từ `username`, giờ bắt đầu và `new Date().getTime()`. Hai request cùng mili-giây cho cùng `uid`. |

## Tổng kết

- 13 mục (D1–D11, O1, O2): đúng file, đúng đoạn mã, cơ chế lỗi khớp với mô tả. Không có lỗi nào bị mô tả sai bản chất.
- Mã nguồn khớp với kết luận "kiểm tra rồi mới ghi" ở D1–D3 và D5–D11; D4 đúng là lỗi logic, không phải race.
- Đã sửa trong `DEFECTS.md`: thêm vị trí `addSeatToBooking` (D2), thêm dòng phép đếm (D6), chỉ đúng nơi cộng thời lượng là `checkDurationLimits.ts` (D8), thêm chi tiết phép đếm của D9, sửa dòng hoàn tiền 605 thành 600 (D10).
- Chưa kiểm: các đề xuất sửa trong `DEFECTS.md` mới là đề xuất, chưa được thử trên mã Cal.com.
