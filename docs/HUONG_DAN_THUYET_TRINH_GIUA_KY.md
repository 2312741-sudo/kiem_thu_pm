# Hướng dẫn thuyết trình báo cáo giữa kỳ (Milestone 2 – 20/10)

Đề tài R05-K15: kiểm thử race condition cho Cal.com v6.2.0, nhóm 14. Slide: [BAO_CAO_GIUA_KY_R05-K15.pptx](BAO_CAO_GIUA_KY_R05-K15.pptx) (13 slide, mỗi slide có ghi chú thuyết trình trong file). Báo cáo: [BAO_CAO_GIUA_KY_R05-K15.docx](BAO_CAO_GIUA_KY_R05-K15.docx).

Thời lượng khoảng 14 đến 15 phút. Bám đúng các yêu cầu giảng viên: quy trình test, danh sách test case, chi phí, kế hoạch giữa kỳ, cách test, kỹ thuật test, và phải là test thật, lỗi thật.

## 1. Cal.com là gì (đọc trước khi nói)

Cal.com là phần mềm **đặt lịch hẹn** mã nguồn mở, giống Calendly.

1. Chủ lịch (host) tạo loại cuộc hẹn và khai báo giờ mình rảnh.
2. Hệ thống cho ra một liên kết công khai, ví dụ `localhost:3000/k15host/k15-30`.
3. Khách mở liên kết, chọn giờ còn trống, điền tên và email rồi đặt lịch. Khách không cần tài khoản.
4. Hệ thống ghi cuộc hẹn và đánh dấu giờ đó đã kín.

Vì sao chọn kiểm thử race: chủ lịch chỉ có **một** khung giờ 9:00. Hai khách cùng bấm "Đặt" trong cùng một phần giây. Hệ thống phải đảm bảo chỉ một người đặt được. Nếu sai, cả hai đều được xác nhận và chủ lịch bị **đặt trùng** (double booking).

Câu trả lời ngắn khi thầy hỏi "Cal.com là gì":

> "Cal.com là phần mềm đặt lịch hẹn mã nguồn mở, tương tự Calendly. Chủ lịch khai báo giờ rảnh, khách mở link chọn giờ và đặt. Nhóm em kiểm thử xem khi nhiều khách đặt cùng lúc thì hệ thống có bị đặt trùng không."

## 2. Phân công và thời gian

| Slide | Nội dung | Người nói | Thời gian |
|---|---|---|---|
| 1 | Bìa | Nguyễn Thanh Tâm | 0,5 phút |
| 2 | Đề tài đã chốt | Tâm | 0,5 phút |
| 3 | Tiến độ so với kế hoạch | Tâm | 1 phút |
| 4 | Kiến trúc | Võ Công Vinh | 1,5 phút |
| 5 | Môi trường, on-boarding, **demo 1** | Tâm | 2 phút |
| 6 | Quy trình test | Nguyễn Đức Tín | 1 phút |
| 7 | Danh sách test case | Tín | 1 phút |
| 8 | Kế hoạch áp dụng kỹ thuật | Tín | 1 phút |
| 9 | Chi phí test | Ngô Quốc Trường Vĩ | 1 phút |
| 10 | Kết quả test, **demo 2** | Vĩ | 2 phút |
| 11 | Chạy lại trên máy Windows | Vĩ | 1 phút |
| 12 | Sáu lỗi, tái hiện độc lập | Vinh | 1,5 phút |
| 13 | Kế hoạch tiếp theo, mời hỏi | Vĩ | 1 phút |

Phân công này gán theo vai A, B, C, D trong báo cáo (môi trường, phân tích, test, báo cáo). Nhóm điều chỉnh nếu chia khác. Chỉ còn một hai người trình bày thì gộp: slide 1 đến 5 (5 phút), slide 6 đến 9 (4 phút), slide 10 đến 13 (5 phút).

## 3. Lời nói gợi ý từng slide

**Slide 1, 2 (đề tài).** "Nhóm 14 làm đề tài R05-K15: kiểm thử race condition cho Cal.com, một hệ thống đặt lịch. Nhóm khóa phiên bản v6.2.0 để test không vỡ khi mã nguồn đổi. Phạm vi là luồng đặt, đổi, hủy lịch."

**Slide 3 (tiến độ).** "Sprint 1 gồm dựng hệ thống, vẽ kiến trúc, viết tài liệu cài đặt và kế hoạch test, đã xong. Nhóm còn làm trước: bộ test 8 test case đã chạy xong, và đã chạy lại trên một máy khác. Còn lại là test qua giao diện bằng Playwright. Board công việc nhóm dùng GitHub Projects, đã có 18 thẻ, nhóm đang gán người."

**Slide 4 (kiến trúc).** "Một request đặt lịch đi qua bốn lớp: route Next.js, dịch vụ đặt lịch, phần ghi, và PostgreSQL. Khi đọc code, nhóm thấy các bước kiểm tra lịch trống, giới hạn số booking đều chỉ đọc rồi quyết định, giữa lúc kiểm tra và lúc ghi không có khóa. Chỗ này nhóm kỳ vọng tìm được race."

**Slide 5 (môi trường).** Nói phiên bản và các khó khăn đã xử lý: không có Docker nên dùng Postgres.app, lệch múi giờ +7 giờ, CSRF của API hủy lịch. Rồi chạy **demo 1** (xem mục 4).

**Slide 6 (quy trình).** "Quy trình bảy bước, từ đọc code đến báo cáo. Điểm khác của kiểm thử race là bước sáu: nhóm kiểm trực tiếp dữ liệu trong cơ sở dữ liệu, không tin mã HTTP. Và có nhóm đối chứng gửi tuần tự để tách lỗi race khỏi lỗi logic."

**Slide 7 (test case).** "Tám test case, mỗi cái thử một cơ chế bảo vệ. TC-01 và TC-04 là hai chỗ hệ thống đã có bảo vệ, dùng để kiểm chứng bộ test không báo lỗi giả. Sáu test case còn lại thử những chỗ đọc code cho thấy chưa có bảo vệ."

**Slide 8 (kế hoạch).** "Phạm vi là luồng booking. Giả định là một Cal.com, một PostgreSQL, chạy local. Tiêu chí: một vòng vi phạm thì test case FAIL; là lỗi race khi tuần tự đúng mà đồng thời sai."

**Slide 9 (chi phí).** "Chi phí tiền là 0 đồng, công cụ miễn phí, chạy trên máy cá nhân. Lượt chạy chính thức gửi 1 140 request, mất khoảng 3 phút máy. Tính cả các thí nghiệm phụ là khoảng 2 080 request, 12 phút máy. Công sức nhân lực nhóm ước lượng 34 đến 46 người-giờ; nhóm chưa theo dõi giờ thực tế từng người."

**Slide 10 (kết quả).** Chạy **demo 2** rồi nói: "Tám test case, mười vòng, hai chế độ. Sáu trên tám test case phát hiện lỗi. TC-01 và TC-04 đúng. Năm test case chỉ sai khi đồng thời là lỗi race. TC-06 sai cả khi tuần tự nên là lỗi logic, không phải race. Mã HTTP đều là 200, chỉ truy vấn cơ sở dữ liệu mới thấy dữ liệu sai."

**Slide 11 (máy Windows).** "Bạn Vĩ chạy lại toàn bộ trên máy Windows 11, Core i7-13620H, 16 GB RAM. Kết quả khớp 8 trên 8 với máy Mac. Máy Windows chậm hơn: 210 giây so với 154 giây. Hai lượt chạy đầu trên máy đó bị loại vì thiếu công cụ k6 và vì Cal.com dừng giữa chừng; nhóm chỉ dùng lượt chạy sạch."

**Slide 12 (lỗi thật).** "Để chắc đây là lỗi thật, nhóm tái hiện từng lỗi bằng lệnh curl thuần, không dùng bộ test, rồi xem dữ liệu trong cơ sở dữ liệu. Ví dụ lỗi D1: hai khách đặt hai giờ chồng nhau cùng lúc, cả hai nhận 200, trong cơ sở dữ liệu có hai booking chồng giờ. Gửi tuần tự thì khách thứ hai bị từ chối 409. Nguyên nhân chung: hệ thống kiểm tra rồi mới ghi, không khóa."

**Slide 13 (tiếp theo).** "Nhóm sẽ thêm test qua giao diện bằng Playwright, rà soát nguyên nhân gốc và đề xuất sửa, hoàn thiện báo cáo và nộp trước bảo vệ một tuần. Mời thầy đặt câu hỏi."

## 4. Cách demo

**Chuẩn bị trước 10 phút.** Chạy Cal.com trong Terminal riêng, đợi dòng `Ready`, để nguyên cửa sổ đó:

```bash
cd calcom && yarn dev
```

Chạy thử một lần để ứng dụng biên dịch sẵn:

```bash
cd race-tests && npm run demo:midterm
```

**Hai lần demo**

1. **Demo 1 (slide 5):** mở http://localhost:3000/k15host/k15-30 cho thầy thấy trang đặt lịch thật.
2. **Demo 2 (slide 10):** chạy lại `npm run demo:midterm` (khoảng 20 giây). Vừa chờ vừa nói tiếp slide.

**Khi bảng kết quả hiện ra, chỉ vào ba điểm**

| Dòng | Kết quả | Nói gì |
|---|---|---|
| S1: cùng một giờ | PASS, 1 booking | Chỉ 1 người đặt được, đúng kỳ vọng |
| S2: giờ chồng lấn | FAIL, 10 booking chồng nhau trong DB | Cả 10 request đều trả 200 nhưng dữ liệu sai: host bị đặt trùng |
| Slide 10, bảng | 6 trên 8 test case có lỗi | Kết quả đầy đủ 8 test case, mở được trong `race-tests/results/giua-ky-race/REPORT.md` |

**Không cần chạy lại toàn bộ 8 test case** trong buổi báo cáo vì mất khoảng 3 phút. Nếu thầy yêu cầu thì nói trước "mất khoảng 3 phút" và vừa chờ vừa giải thích.

## 5. Câu hỏi thầy có thể hỏi

| Câu hỏi | Trả lời ngắn |
|---|---|
| Sao biết là race chứ không phải lỗi thường? | Có nhóm đối chứng gửi tuần tự: TC-02 tuần tự thì đúng, đồng thời thì sai. TC-06 sai cả hai nên nhóm xếp là lỗi logic. |
| Request có thực sự đồng thời không? | Có, k6 đặt cùng mốc giờ gửi, độ lệch đo được 0 đến 1 ms. |
| Sao không tin mã HTTP? | Vì cả 10 request đều trả 200 mà cơ sở dữ liệu vẫn sai. |
| Lỗi có phải lỗi thật không? | Nhóm tái hiện từng lỗi bằng curl thuần và xem dữ liệu trong DB; chạy trên hai máy cho cùng kết quả. |
| Chi phí test là bao nhiêu? | Tiền 0 đồng; máy khoảng 3 phút cho lượt chính thức; nhân lực ước lượng 34 đến 46 người-giờ, chưa theo dõi giờ thực tế. |
| Test trên môi trường nào? | Local, một Cal.com và một PostgreSQL; Mac 10 nhân 32 GB và Windows 11 i7-13620H 16 GB. Không bắn tải vào máy chủ công khai. |
| Hai máy khác nhau có kết quả giống nhau không? | Giống 8 trên 8 test case. Khác ở tốc độ và một vòng của TC-05. |
| Còn gì làm tiếp? | Test qua giao diện bằng Playwright, rà soát nguyên nhân gốc, đề xuất sửa, hoàn thiện báo cáo. |
| Đã báo lỗi cho Cal.com chưa? | Chưa. Nhóm chưa sửa mã Cal.com, mới thử một hướng sửa trên dữ liệu test. |
| Hướng sửa là gì? | Thêm ràng buộc cơ sở dữ liệu không cho hai booking chồng giờ. Thử trên dữ liệu test thì D1 và D3 hết lỗi nhưng người thua nhận 500 thay vì 409, nên cần sửa cả mã trả lỗi. |
| Không có Docker thì cài thế nào? | Dùng Postgres.app; hướng dẫn cài từ máy sạch trong `README.md`. |
| Con số 20/20 từ đâu? | Thí nghiệm riêng với 2 request đồng thời, 20 vòng. Bảng chính là 10 request, 10 vòng. |

## 6. Lưu ý

- **Nói trúng điều có trong slide.** Nếu thầy hỏi vượt giữa kỳ, trả lời: nhóm đã chạy đủ 8 test case, phần chưa làm đã ghi trong kế hoạch.
- **Nói thật điều chưa làm:** chưa báo lỗi cho Cal.com, chưa sửa mã Cal.com, chưa test qua giao diện, giờ làm chỉ là ước lượng.
- **Một số lỗi có thể bị phía Cal.com coi là hành vi chấp nhận được** (ví dụ D2). Nhóm gọi là lỗi vì dữ liệu sai so với kỳ vọng.
- **Nếu demo lỗi:** bình tĩnh nói "xin phép dùng kết quả đã chạy sẵn". Mở sẵn [race-tests/results/giua-ky-race/REPORT.md](../race-tests/results/giua-ky-race/REPORT.md).
- **Nếu Cal.com không lên:** kiểm tra PostgreSQL còn chạy, rồi `yarn dev` lại. Lần đầu sau khi khởi động, request đầu mất vài giây vì phải biên dịch. Bộ test đã có bước khởi động nóng.
- **Cảnh báo `element.ref` trong console** (huy hiệu đỏ "1 issue") là cảnh báo của React trong mã giao diện Cal.com ở chế độ dev, không liên quan đến test.
- **Chỉ một người chạy test tại một thời điểm.** Hai lượt chạy chồng nhau làm hỏng kết quả của nhau.
- **Trước giờ báo cáo:** mở slide ở chế độ trình chiếu, chạy thử demo một lần, đóng các cửa sổ không cần thiết.

## 7. Tài liệu liên quan

- [BAO_CAO_GIUA_KY.md](BAO_CAO_GIUA_KY.md): nội dung báo cáo giữa kỳ.
- [QUY_TRINH_TEST.md](QUY_TRINH_TEST.md): quy trình test đầy đủ.
- [HUONG_DAN_NGUOI_TEST.md](HUONG_DAN_NGUOI_TEST.md): hướng dẫn người test, phiếu ghi kết quả.
- [KET_QUA_TEST_GIUA_KY.md](KET_QUA_TEST_GIUA_KY.md): kết quả test sinh tự động.
- [MINH_CHUNG_LOI.md](MINH_CHUNG_LOI.md): minh chứng từng lỗi.
- [HUONG_DAN_CHAY_LAI_WINDOWS.md](HUONG_DAN_CHAY_LAI_WINDOWS.md): chạy lại trên máy khác.
- [../README.md](../README.md): phiên bản đã pin và hướng dẫn cài đặt.
