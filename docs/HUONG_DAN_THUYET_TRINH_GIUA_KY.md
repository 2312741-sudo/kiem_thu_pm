# Hướng dẫn thuyết trình báo cáo tiến độ giữa kỳ (Milestone 2 – 20/10)

Đề tài R05-K15: kiểm thử race condition cho Cal.com v6.2.0. Slide: [BAO_CAO_GIUA_KY_R05-K15.pptx](BAO_CAO_GIUA_KY_R05-K15.pptx) (8 slide, mỗi slide có ghi chú thuyết trình trong file).

Thời lượng khoảng 8–10 phút. Giữa kỳ cần trình bày đúng bốn thứ: demo hệ thống chạy, sơ đồ kiến trúc và tài liệu on-boarding, kế hoạch áp dụng kỹ thuật kiểm thử.

## 1. Cal.com là gì (đọc trước khi nói)

Cal.com là phần mềm **đặt lịch hẹn** mã nguồn mở, giống Calendly.

1. Chủ lịch (host) tạo loại cuộc hẹn, ví dụ "Tư vấn 30 phút", và khai báo giờ mình rảnh.
2. Hệ thống cho ra một link công khai, ví dụ `localhost:3000/k15host/k15-30`.
3. Khách mở link, chọn giờ còn trống, điền tên và email rồi bấm "Đặt lịch". Khách không cần tài khoản.
4. Hệ thống ghi cuộc hẹn và đánh dấu giờ đó đã kín. Người sau không đặt được giờ này nữa.

Vì sao chọn kiểm thử race: chủ lịch chỉ có **một** khung giờ 9:00. Hai khách cùng bấm "Đặt" trong cùng một phần giây. Hệ thống phải đảm bảo chỉ một người đặt được. Nếu sai, cả hai đều được xác nhận và chủ lịch bị **đặt trùng** (double booking).

Câu trả lời ngắn khi thầy hỏi "Cal.com là gì":

> "Cal.com là phần mềm đặt lịch hẹn mã nguồn mở, tương tự Calendly. Chủ lịch khai báo giờ rảnh, khách mở link chọn giờ và đặt. Nhóm em kiểm thử xem khi nhiều khách đặt cùng lúc thì hệ thống có bị đặt trùng không."

## 2. Phân công và thời gian

Nhóm 4 người, mỗi người nói khoảng 2 slide để thầy thấy ai cũng nắm bài.

| Slide | Nội dung | Người nói | Thời gian |
|---|---|---|---|
| 1–2 | Bìa, đề tài đã chốt | A (môi trường) | 1 phút |
| 3 | Tiến độ so với kế hoạch | A | 1 phút |
| 4 | Kiến trúc rút gọn | B (phân tích) | 1,5 phút |
| 5 | Môi trường, on-boarding, **demo 1** | A | 2,5 phút |
| 6 | Kế hoạch áp dụng K15 | C (tác giả test) | 1,5 phút |
| 7 | Kết quả thử nghiệm đầu tiên, **demo 2** | D (báo cáo) | 2 phút |
| 8 | Kế hoạch tiếp theo, mời hỏi | D | 1 phút |

Chỉ còn một người trình bày thì gộp: slide 1–4 trong 3 phút, demo, rồi slide 6–8 trong 3 phút.

## 3. Lời nói gợi ý từng slide

**Slide 1–2.** "Nhóm em làm đề tài R05-K15: kiểm thử race condition cho Cal.com, một hệ thống đặt lịch. Nhóm đã chốt phiên bản v6.2.0 để test không vỡ khi mã nguồn đổi. Phạm vi chỉ là luồng đặt, đổi, hủy lịch."

**Slide 3.** "Theo kế hoạch, Sprint 1 gồm dựng hệ thống, vẽ kiến trúc, viết tài liệu cài đặt và kế hoạch test. Tất cả đã xong. Nhóm còn chạy trước harness cho 8 scenario; kết quả đầy đủ nhóm xin trình bày ở buổi cuối kỳ."

**Slide 4.** "Khi đọc code, nhóm thấy các bước kiểm tra như lịch trống, giới hạn số booking đều chỉ đọc rồi quyết định. Giữa lúc kiểm tra và lúc ghi không có khóa. Chỗ này nhóm kỳ vọng tìm được race."

**Slide 5.** Nói phiên bản và các khó khăn đã xử lý (không có Docker, lệch múi giờ +7, CSRF của API hủy lịch), rồi chạy demo 1.

**Slide 6.** "Điểm khác của kiểm thử race là oracle không phải mã HTTP. Nhóm kiểm trực tiếp dữ liệu trong CSDL, và so với nhóm đối chứng gửi tuần tự."

**Slide 7.** Chạy demo 2 rồi giải thích ba ô bên dưới: mã HTTP vẫn 200, chỉ cần 2 người là đủ gây lỗi, nguyên nhân là khóa idempotency quá hẹp.

**Slide 8.** "Nhóm sẽ thêm Playwright, chạy lại trên máy sạch, đề xuất sửa, hoàn thiện báo cáo và nộp trước bảo vệ một tuần."

## 4. Cách demo

**Chuẩn bị trước 10 phút.** Bảo đảm Cal.com đang chạy, rồi chạy thử một lần để ứng dụng biên dịch sẵn:

```bash
cd race-tests && npm run demo:midterm
```

Nếu Cal.com chưa chạy: `cd calcom && yarn dev` (PostgreSQL phải đang chạy).

**Khi báo cáo (chia demo làm hai lần cho đỡ chờ):**

1. Ở slide 5, mở http://localhost:3000/k15host/k15-30 để cho thầy thấy trang đặt lịch thật.
2. Chạy lại `npm run demo:midterm` (khoảng 20 giây). Vừa chờ vừa nói slide 6.
3. Kết quả hiện ra thì quay lại slide 7 và chỉ vào ba điểm:

| Dòng | Kết quả | Nói gì |
|---|---|---|
| S1: cùng một slot | PASS, 1 booking | Chỉ 1 người đặt được, đúng kỳ vọng |
| S2: slot chồng lấn | FAIL, 10 booking chồng nhau trong DB | Cả 10 request đều trả 200 nhưng dữ liệu sai: host bị double booking |
| Thí nghiệm riêng | 20/20 vòng với 2 request | Chỉ cần 2 người là đủ gây lỗi (`race-tests/results/sensitivity-n2`) |

Tài khoản đăng nhập Cal.com để xem giao diện quản trị: xem `calcom/agents/rules/reference-local-dev.md` (tài khoản seed `pro` và `free`).

## 5. Câu hỏi thầy có thể hỏi

| Câu hỏi | Trả lời ngắn |
|---|---|
| Sao biết là race chứ không phải lỗi thường? | Có nhóm đối chứng gửi tuần tự: S2 tuần tự thì đúng, đồng thời thì sai. |
| Request có thực sự đồng thời không? | Có, k6 đặt cùng mốc giờ gửi, độ lệch đo được 0–1 ms. |
| Sao không tin mã HTTP? | Vì cả 10 request đều trả 200 mà DB vẫn sai. |
| Chạy trên môi trường nào? | Local, một Cal.com và một PostgreSQL, không tấn công server công khai. |
| Còn gì làm tiếp? | Playwright qua giao diện, chạy lại trên máy sạch, đề xuất sửa, hoàn thiện báo cáo. |
| Không có Docker thì cài thế nào? | Dùng Postgres.app; hướng dẫn cài từ máy sạch trong `README.md`. |
| 20/20 ở slide 7 từ đâu? | Thí nghiệm riêng với 2 request đồng thời, 20 vòng; bảng chính là 10 request, 3 vòng demo. |

## 6. Lưu ý

- **Nói trúng điều có trong slide.** Nếu thầy hỏi vượt giữa kỳ (ví dụ "có tìm ra lỗi khác không"), trả lời: nhóm đã chạy đủ 8 scenario, kết quả đầy đủ xin trình bày ở buổi bảo vệ cuối kỳ. Không nói số liệu chưa có trong báo cáo.
- **Nếu demo lỗi:** bình tĩnh nói "xin phép chạy lại". Mở sẵn [race-tests/results/latest-race/REPORT.md](../race-tests/results/latest-race/REPORT.md) làm phương án dự phòng.
- **Nếu Cal.com không lên:** kiểm tra PostgreSQL còn chạy, rồi `yarn dev` lại. Lần đầu sau khi khởi động, request đầu tiên mất khoảng 5 giây vì phải biên dịch.
- **Cảnh báo `element.ref` trong console** (huy hiệu đỏ "1 issue") là cảnh báo deprecation của React trong mã giao diện Cal.com ở chế độ dev. Không liên quan đến test, có thể bỏ qua.
- **Trước giờ báo cáo:** mở slide ở chế độ trình chiếu, chạy thử demo một lần, đóng các cửa sổ không cần thiết.

## 7. Tài liệu liên quan

- [README.md](../README.md): phiên bản đã pin và hướng dẫn cài đặt từ máy sạch.
- [BAO_CAO.md](BAO_CAO.md): báo cáo đầy đủ phần A–H.
- [diagrams/kien-truc.md](diagrams/kien-truc.md): sơ đồ kiến trúc và luồng dữ liệu.
- [board-cards.md](board-cards.md): danh sách thẻ công việc trên board.
