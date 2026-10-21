# Đánh giá rủi ro và chứng minh tính khả thi của test case

Trả lời góp ý của giảng viên: đánh giá rủi ro; chứng minh test case khả thi ("nếu không có test case này thì lỗi lọt qua"); tìm lỗi quan trọng, khó thấy; tăng số test case. Mọi số liệu lấy từ kết quả thật trong `race-tests/results/`.

## 1. Cách chấm điểm rủi ro

Điểm = **khả năng xảy ra × mức ảnh hưởng**, mỗi thang 1 đến 5.

- **Khả năng:** dựa trên số liệu đã đo. 5 nghĩa là lỗi tái hiện ở 10/10 vòng, chỉ cần 2 request đồng thời, và không có khóa nào ở đoạn mã tương ứng. Cửa sổ race đo được 30–60 ms, còn rộng hơn khi chạy thật vì phải gọi lịch ngoài.
- **Ảnh hưởng:** là đánh giá của nhóm theo hậu quả với người dùng. Dữ liệu sai âm thầm (không cảnh báo) nặng hơn thông báo lỗi sai.
- **Mức:** từ 20 là nghiêm trọng; 12 đến 19 là cao; 6 đến 11 là trung bình.

Khả năng xảy ra ngoài đời phụ thuộc lưu lượng thực của từng chủ lịch. Nhóm chưa có dữ liệu lưu lượng thật nên điểm này chỉ là ước lượng từ thực nghiệm.

## 2. Bảng rủi ro của các lỗi đã tìm được

| Lỗi | Test case | Khả năng | Ảnh hưởng | Điểm | Mức | Hậu quả nếu không được kiểm tra |
|---|---|---|---|---|---|---|
| D1 | TC-02, TC-17 | 5 | 5 | **25** | Nghiêm trọng | Chủ lịch bị 2 đến 10 khách cùng một giờ. Hệ thống không báo gì; chỉ biết khi các khách cùng đến |
| D6 | TC-08, TC-13 | 5 | 4 | **20** | Nghiêm trọng | Giới hạn mỗi ngày hoặc tuần bị phá (8 booking một ngày); chủ lịch quá tải, cam kết với chủ lịch không còn giá trị |
| D4 | TC-06 | 4 | 4 | 16 | Cao | Một link đổi lịch dùng lại nhiều lần: 5 lần sinh 5 booking, khách nhận 5 lịch hẹn; có thể bị lợi dụng để chiếm nhiều giờ của chủ lịch |
| D8 | TC-12 | 5 | 3 | 15 | Cao | Tổng thời lượng vượt giới hạn: 180 phút so với 30 phút mỗi ngày |
| D3 | TC-05 | 4 | 3 | 12 | Cao | Chủ lịch nhận 9 đến 10 yêu cầu chờ xác nhận cho một giờ, phải từ chối thủ công; mọi người đặt tưởng đã giữ được chỗ |
| D7 | TC-11 | 4 | 3 | 12 | Cao | Cuộc hẹn xếp sát nhau dù đã cấu hình thời gian đệm; chủ lịch không kịp nghỉ hoặc di chuyển |
| D9 | TC-14 | 4 | 3 | 12 | Cao | Một người đặt 6 giờ thay vì 1; giới hạn chống chiếm chỗ vô tác dụng |
| D10 | TC-15 | 4 | 3 | 12 | Cao | Mỗi lệnh hủy lặp lại gửi email, webhook, xử lý lịch ngoài: 1 booking gửi 12 email thay vì 2. Ảnh hưởng tới hoàn tiền **chưa kiểm chứng** (cần tích hợp thanh toán, ngoài phạm vi) |
| D2 | TC-03 | 4 | 2 | 8 | Trung bình | Còn ghế nhưng người đặt bị báo xung đột lịch; mỗi vòng chỉ bán được 1 trên 3 ghế |
| D5 | TC-07 | 2 | 4 | 8 | Trung bình | Khách tưởng đã hủy nhưng giờ mới vẫn giữ chỗ trong lịch chủ lịch |
| D11 | TC-16 | 2 | 3 | 6 | Trung bình | Một người chiếm 2 trong 3 ghế, người khác mất chỗ |

Ma trận: [figures/hinh-ma-tran-rui-ro.png](figures/hinh-ma-tran-rui-ro.png).

## 3. Mấu chốt của lỗi: nếu không kiểm tra thì sao?

- **Không có lỗi nào làm hệ thống sập.** Trong TC-18, 30 request đồng thời không sinh ra phản hồi 5xx nào.
- **Nguy hiểm hơn là dữ liệu sai âm thầm.** Hệ thống trả HTTP 200, giao diện báo thành công, người vận hành không nhận cảnh báo. Lỗi lộ ra ngoài đời: hai khách cùng đến, chủ lịch quá tải, khách nhận nhiều email hủy.
- **Sửa thiếu cũng nguy hiểm.** Thêm ràng buộc loại trừ ở CSDL mà không ánh xạ lỗi thì request thua nhận HTTP 500 (vi phạm I7): lỗi chuyển từ "sai dữ liệu" sang "báo lỗi máy chủ" (`results/fix-exclusion-20/`).

## 4. Vì sao các lỗi này khó tìm

Mười lỗi race (D1 đến D3, D5 đến D11) có chung bốn đặc điểm:

1. **Cửa sổ hẹp:** chỉ xảy ra khi hai request đến trong khoảng 30–60 ms. Thử bằng tay gần như không gặp.
2. **Phản hồi trông bình thường:** mọi request trả 200.
3. **Kiểm thử tuần tự cho kết quả đúng:** nhóm đối chứng đạt 19/20. Mọi cơ chế giới hạn, chống trùng, chống hủy lặp đều chạy đúng khi request đến lần lượt, và còn trả mã lỗi riêng cho từng cơ chế (`duration_limit_reached`, `booker_limit_exceeded_error`, `already_signed_up_for_this_booking_error`, "đã hủy").
4. **Chỉ lộ ra khi đối chiếu dữ liệu hoặc đếm tác dụng phụ.** D10: booking cuối vẫn là `cancelled`, mọi lệnh trả 200; chỉ khi đếm email gửi đi mới thấy 12 thay vì 2.

Hai lỗi đáng chú ý nhất vì dễ bị coi là đã an toàn:
- **D10:** không để lại dấu vết trong dữ liệu booking.
- **D11:** nằm đúng trong cơ chế chống đăng ký trùng mà Cal.com đã viết, và cơ chế đó chạy tốt khi test tuần tự.

## 5. Chứng minh tính khả thi của test case

| # | Tiêu chí | Bằng chứng | Nơi lưu |
|---|---|---|---|
| 1 | Chạy được, đo được | 20/20 test case chạy tự động, 3 180 request, mỗi vòng kiểm dữ liệu trong CSDL | `results/giua-ky-20-race/` |
| 2 | Không báo lỗi giả | 7 test case đạt ở cả hai chế độ (TC-01, 04, 09, 10, 18, 19, 20). Khi tuần tự, cơ chế bảo vệ từ chối đúng bằng mã lỗi riêng, tức test case thật sự kiểm tra, không đạt rỗng | `results/giua-ky-20-sequential/` |
| 3 | Lặp lại được | 13 test case vi phạm 10/10 vòng; vẫn 10/10 khi chỉ 2 request đồng thời (7 test case mới) | `results/sensitivity-n2-new/` |
| 4 | Công cụ khác cho cùng kết quả | `curl` thuần (không k6, không bộ test) tái hiện cả 11 lỗi; D7–D11 chạy 2 lần liên tiếp cho kết quả y hệt | `evidence/repro-curl.txt`, `evidence/repro-curl-2.txt` |
| 5 | Sửa lỗi thì test đạt | Thêm chỉ mục duy nhất theo người tham dự: TC-16 từ FAIL 10/10 sang PASS 10/10 (1 người được nhận, 5 người bị 400, không có 500). Thêm ràng buộc loại trừ: TC-02, 05, 17 hết vi phạm I1/I3, chỉ còn vi phạm I7 do trả 500 | `results/fix-unique-attendee/`, `results/fix-exclusion-20/` |
| 6 | Chi phí chấp nhận được | 20 test case, 10 vòng, hai chế độ: khoảng 8 phút máy, 0 đồng | báo cáo bảng chi phí |
| 7 | Nhiều máy | Cả 20 test case khớp 20/20 về kết luận giữa macOS và Windows (21/10). Chỉ lệch TC-07: 9/10 vòng thay vì 10/10, vì ở vòng 1 yêu cầu đổi lịch đến trước nên lệnh hủy bị từ chối (400), dữ liệu nhất quán | `results/windows-20-race/`, `windows-20-sequential/` |

**Hạn chế:** lượt Windows ngày 21/10 chỉ còn `REPORT.md` (không có `summary.json` và `raw/`); số liệu đã đối chiếu từ `REPORT.md`. Nhóm chưa báo lỗi cho Cal.com và chưa sửa mã Cal.com (thí nghiệm khắc phục chỉ ở mức CSDL test, đã gỡ sau khi chạy).

## 6. Vai trò của từng test case: nếu không có thì bỏ sót gì

| TC | Đồng thời | Tuần tự có thấy lỗi? | Nếu không có test case này |
|---|---|---|---|
| 01 | Đạt | Không có lỗi | Không biết ràng buộc duy nhất còn bảo vệ slot trùng khít; mất mốc đối chứng cho TC-02 |
| 02 | D1 | Không | Lỗi đặt chồng giờ, nghiêm trọng nhất, lọt qua |
| 03 | D2 | Không | Không thấy việc bán thiếu ghế và thông báo xung đột sai |
| 04 | Đạt | Không có lỗi | Không biết khóa dòng ở nhánh thêm ghế hoạt động; mất mốc đối chứng cho TC-03, TC-16 |
| 05 | D3 | Không | Chủ lịch nhận hàng loạt yêu cầu chờ cho một giờ mà không ai phát hiện |
| 06 | D4 | **Có** (lỗi logic) | Link đổi lịch cũ dùng lại nhiều lần, sinh nhiều booking |
| 07 | D5 | Không | Hủy và đổi lịch cùng lúc để lại booking ma |
| 08 | D6 | Không | Giới hạn 1 booking mỗi ngày bị phá |
| 09 | Đạt | Không có lỗi | Không biết đường đổi lịch có chống trùng như đường đặt mới |
| 10 | Đạt | Không có lỗi | Không biết đổi lịch và đặt mới có tranh nhau một giờ được không |
| 11 | D7 | Không | Thời gian đệm bị bỏ qua |
| 12 | D8 | Không | Giới hạn thời lượng mỗi ngày bị vượt |
| 13 | D6 | Không | Giới hạn theo tuần bị phá, khác khung thời gian với TC-08 |
| 14 | D9 | Không | Một người chiếm nhiều chỗ dù có giới hạn mỗi người đặt |
| 15 | D10 | Không | Hủy lặp lại gửi email, webhook nhiều lần mà phản hồi vẫn bình thường |
| 16 | D11 | Không | Một người chiếm nhiều ghế |
| 17 | D1 | Không | Hai loại cuộc hẹn cùng giờ bắt đầu không được kiểm tra |
| 18 | Đạt | Không có lỗi | Không biết hệ thống có sập hoặc trả 5xx khi tải gấp ba |
| 19 | Đạt | Không có lỗi | Không biết yêu cầu hợp lệ có bị từ chối nhầm khi nhiều người đặt cùng lúc |
| 20 | Đạt | Không có lỗi | Không biết hủy rồi đặt lại đúng giờ vừa hủy có an toàn |
