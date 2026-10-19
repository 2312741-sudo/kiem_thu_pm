# Hướng dẫn thuyết trình báo cáo giữa kỳ (Milestone 2 – 20/10)

Đề tài R05-K15: kiểm thử race condition cho Cal.com v6.2.0, nhóm 14.

| File | Dùng để |
|---|---|
| [BAO_CAO_GIUA_KY_R05-K15_SLIDE.pdf](BAO_CAO_GIUA_KY_R05-K15_SLIDE.pdf) | Thuyết trình chính, 14 slide (có ghi chú thuyết trình trong file `.pptx`) |
| [SLIDE_1_TRANG_TRINH_BAY_LOP.pdf](SLIDE_1_TRANG_TRINH_BAY_LOP.pdf) | Phần "mỗi nhóm trình bày 1 slide nội dung đã hoàn thành" |
| [BAO_CAO_GIUA_KY_THEO_MAU.pdf](BAO_CAO_GIUA_KY_THEO_MAU.pdf) | Báo cáo nộp trên LMS, chủ đề 8 |

## 1. Yêu cầu của thầy và nhóm đáp ứng thế nào

| Yêu cầu trong email của thầy | Nhóm đáp ứng | Slide |
|---|---|---|
| Nộp báo cáo PDF theo cấu trúc đề bài (phần A–H) và lịch (phần 4) | Báo cáo 47 trang, có bảng đối chiếu từng phần A–H với mục trong báo cáo | Báo cáo mục 1.5 |
| Slide PDF dùng để thuyết trình | Bộ 14 slide dạng PDF | Toàn bộ |
| **Mục đích cuối: thuyết phục tính khả thi để được duyệt kế hoạch kiểm thử** | Kế hoạch, chi phí, rủi ro, và bằng chứng đã chạy thật | 8, 9, 10, 11, 12, 14 |
| **Ghi rõ nhiệm vụ và đóng góp từng thành viên** | Bảng nhiệm vụ từng người, mỗi người nói phần của mình | 13 |
| Phải test thật, lỗi là lỗi thật (yêu cầu trước đó) | 6 lỗi tái hiện bằng curl thuần; chạy trên 2 máy | 10, 11, 12 |
| Mỗi nhóm trình bày 1 slide nội dung hoàn thành đến hiện tại | Slide 1 trang riêng | Mục 6 |

## 2. Ba thông điệp xuyên suốt (mỗi người nhớ)

1. **Kế hoạch khả thi, và nhóm đã chứng minh bằng việc làm thật**: hệ thống chạy, bộ test chạy, tìm được lỗi thật.
2. **Chi phí thấp, rủi ro đã kiểm soát**: 0 đồng, dưới 3 phút máy cho lượt chạy chính thức, có nhóm đối chứng.
3. **Mỗi thành viên có phần việc rõ ràng**, và ai cũng hiểu cả bài.

Cuối buổi, người nói slide 14 chốt lại bằng câu đề nghị: "Với các bằng chứng trên, nhóm đề nghị thầy duyệt kế hoạch kiểm thử."

## 3. Phân công nói và thời gian (14 slide, khoảng 15 phút)

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
| 13 | Nhiệm vụ và đóng góp từng thành viên | Cả nhóm, mỗi người 1 câu | 1 phút |
| 14 | Kế hoạch tiếp theo, đề nghị duyệt | Vĩ | 1 phút |

**Quan trọng:** phân công nói này gán theo vai A, B, C, D trong báo cáo. Nhóm xác nhận lại ai làm việc gì thật, và nói **đúng việc thật** của mình. Nếu việc thật khác bảng trong báo cáo thì nói rõ với thầy và sửa báo cáo sau.

Chỉ còn hai ba người trình bày thì gộp: slide 1–5 (5 phút), slide 6–9 (4 phút), slide 10–14 (6 phút).

## 4. Lời nói gợi ý từng slide

Mỗi slide đều gắn với một ý "vì sao điều này chứng minh kế hoạch khả thi".

**Slide 1, 2 (đề tài).** "Nhóm 14 làm đề tài R05-K15: kiểm thử race condition cho Cal.com, một hệ thống đặt lịch. Nhóm đã chốt phiên bản v6.2.0 để test không vỡ khi mã nguồn đổi, và khoanh phạm vi vào luồng đặt, đổi, hủy lịch."

*Khả thi vì:* phạm vi hẹp, phiên bản cố định.

**Slide 3 (tiến độ).** "Theo kế hoạch, Sprint 1 gồm dựng hệ thống, vẽ kiến trúc, viết tài liệu cài đặt và kế hoạch test, tất cả đã xong. Nhóm còn làm trước: bộ test 8 test case đã chạy xong, và đã chạy lại trên một máy khác. Còn lại là test qua giao diện bằng Playwright. Công việc theo dõi trên GitHub Projects, đã có 18 thẻ, nhóm đang gán người."

*Khả thi vì:* nhóm đang đi nhanh hơn kế hoạch.

**Slide 4 (kiến trúc).** "Một request đặt lịch đi qua bốn lớp: route Next.js, dịch vụ đặt lịch, phần ghi, PostgreSQL. Khi đọc code, nhóm thấy các bước kiểm tra lịch trống và giới hạn đều chỉ đọc rồi quyết định, giữa kiểm tra và ghi không có khóa. Đó là chỗ nhóm kỳ vọng tìm được race."

*Khả thi vì:* nhóm hiểu hệ thống và xác định được điểm yếu trước khi test.

**Slide 5 (môi trường).** Nói phiên bản, bốn khó khăn đã xử lý (không có Docker, lệch múi giờ +7 giờ, CSRF của API hủy lịch, biên dịch lần đầu), rồi chạy **demo 1** (xem mục 5).

*Khả thi vì:* hệ thống chạy được và có tài liệu cài đặt từ máy sạch.

**Slide 6, 7 (quy trình, test case).** "Quy trình bảy bước từ đọc code đến báo cáo. Điểm khác của kiểm thử race là bước sáu: nhóm kiểm trực tiếp dữ liệu trong cơ sở dữ liệu, không tin mã HTTP, và có nhóm đối chứng gửi tuần tự. Có tám test case, mỗi cái thử một cơ chế bảo vệ; TC-01 và TC-04 là hai chỗ hệ thống đã có bảo vệ, dùng để chứng minh bộ test không báo lỗi giả."

*Khả thi vì:* quy trình rõ, có tiêu chí đúng sai kiểm tra được.

**Slide 8 (kế hoạch).** "Phạm vi là luồng booking. Giả định là một Cal.com, một PostgreSQL, chạy local. Tiêu chí: một vòng vi phạm thì test case không đạt; là lỗi race khi tuần tự đúng mà đồng thời sai."

*Khả thi vì:* phạm vi, giả định và tiêu chí đều nêu rõ, đúng yêu cầu của phần giữa kỳ trong đề.

**Slide 9 (chi phí).** "Chi phí tiền là 0 đồng. Lượt chạy chính thức gửi 1 140 request, mất khoảng 3 phút máy. Tính cả thí nghiệm phụ là khoảng 2 080 request, 12 phút máy. Nhân lực nhóm ước lượng 34 đến 46 người-giờ; nhóm chưa theo dõi giờ thực tế từng người."

*Khả thi vì:* chi phí rất thấp.

**Slide 10 (kết quả).** Chạy **demo 2** rồi nói: "Tám test case, mười vòng, hai chế độ. Sáu trên tám test case phát hiện lỗi. TC-01 và TC-04 đúng. Năm test case chỉ sai khi đồng thời là lỗi race. TC-06 sai cả khi tuần tự nên là lỗi logic, không phải race. Mã HTTP đều thành công, chỉ truy vấn cơ sở dữ liệu mới thấy dữ liệu sai."

*Khả thi vì:* kỹ thuật đã phát hiện lỗi thật.

**Slide 11 (máy Windows).** "Bạn Vĩ chạy lại toàn bộ trên máy Windows 11, Core i7-13620H, 16 GB RAM. Kết quả khớp 8 trên 8 với máy Mac. Máy Windows chậm hơn: 210 giây so với 154 giây. Hai lượt chạy đầu trên máy đó bị loại vì thiếu k6 và Cal.com dừng giữa chừng; nhóm chỉ dùng lượt chạy sạch."

*Khả thi vì:* kết quả không phụ thuộc máy và nhóm biết loại kết quả không hợp lệ.

**Slide 12 (lỗi thật).** "Để chắc là lỗi thật, nhóm tái hiện từng lỗi bằng curl thuần, không dùng bộ test, rồi xem dữ liệu trong cơ sở dữ liệu. Ví dụ D1: hai khách đặt hai giờ chồng nhau cùng lúc, cả hai nhận 200, trong cơ sở dữ liệu có hai booking chồng giờ. Gửi tuần tự thì khách thứ hai bị từ chối. Nguyên nhân chung: kiểm tra rồi mới ghi, không khóa."

*Khả thi vì:* lỗi kiểm chứng được độc lập.

**Slide 13 (đóng góp).** Mỗi người nói một câu về phần của mình, theo mẫu: "Em là [tên], em phụ trách [việc], sản phẩm của em là [sản phẩm]."

| Người | Gợi ý một câu |
|---|---|
| Tâm | "Em dựng Cal.com, cơ sở dữ liệu, seed data, ghim phiên bản và chạy test chính thức trên máy Mac." |
| Vinh | "Em đọc mã, vẽ kiến trúc, phân tích nguyên nhân gốc và đề xuất hướng sửa." |
| Tín | "Em thiết kế invariant, test case và viết bộ test bằng k6, Node.js, SQL." |
| Vĩ | "Em chạy test, ghi kết quả, chạy lại trên máy Windows, viết báo cáo và slide." |

**Slide 14 (tiếp theo, đề nghị duyệt).** "Nhóm sẽ thêm test qua giao diện bằng Playwright, rà soát nguyên nhân gốc và đề xuất sửa, hoàn thiện báo cáo và nộp trước bảo vệ một tuần. Với các bằng chứng trên: hệ thống chạy được, kỹ thuật phát hiện được lỗi thật, kết quả không phụ thuộc máy, chi phí thấp, nhóm đề nghị thầy duyệt kế hoạch kiểm thử. Mời thầy đặt câu hỏi."

## 5. Cách demo

**Chuẩn bị trước giờ báo cáo:**

1. Cal.com chạy trong Terminal riêng, đợi dòng `Ready`, để nguyên cửa sổ:

```bash
cd calcom && yarn dev
```

2. Chạy thử một lần để ứng dụng biên dịch sẵn:

```bash
cd race-tests && npm run demo:midterm
```

3. Mở sẵn http://localhost:3000/k15host/k15-30 và [race-tests/results/giua-ky-race/REPORT.md](../race-tests/results/giua-ky-race/REPORT.md) làm phương án dự phòng.

**Hai lần demo:**

- **Demo 1 (slide 5):** mở trang đặt lịch thật cho thầy thấy.
- **Demo 2 (slide 10):** chạy `npm run demo:midterm` (khoảng 20 giây), vừa chờ vừa nói tiếp. Khi bảng hiện ra, chỉ vào S1 (PASS, 1 booking) và S2 (FAIL, 10 booking chồng nhau): "cả 10 request đều trả 200 nhưng dữ liệu sai".

Không cần chạy lại toàn bộ 8 test case, vì mất khoảng 3 phút và kết quả đã có.

## 6. Slide 1 trang trình bày trước lớp (khoảng 2 phút)

Dùng [SLIDE_1_TRANG_TRINH_BAY_LOP.pdf](SLIDE_1_TRANG_TRINH_BAY_LOP.pdf). Một người nói, theo thứ tự các ô trên slide:

1. "Nhóm 14 kiểm thử race condition cho Cal.com, một hệ thống đặt lịch."
2. **Đã hoàn thành:** dựng hệ thống, bộ test tự động, 8 test case chạy 10 vòng, 6 lỗi tái hiện độc lập, chạy lại trên máy Windows.
3. **Kết quả chính:** chỉ vào bảng: năm test case chỉ sai khi đồng thời, một test case sai cả khi tuần tự.
4. **Chi phí:** 0 đồng, dưới 3 phút máy.
5. **Còn lại:** test qua giao diện, đề xuất sửa, báo lỗi cho Cal.com, hoàn thiện báo cáo.
6. **Đóng góp:** mỗi người một câu.

## 7. Hỏi đáp (xếp theo chủ đề thầy hay hỏi)

### Về tính khả thi (mục đích chính)

| Câu hỏi | Trả lời ngắn |
|---|---|
| Kế hoạch có khả thi không? | Có. Hệ thống chạy được trên hai máy, bộ test chạy lại dưới 3 phút, đã tìm được 6 lỗi thật, chi phí 0 đồng. |
| Phạm vi có quá rộng không? | Không. Chỉ luồng booking, ngoài phạm vi gồm lịch ngoài, thanh toán, team, API v2. |
| Rủi ro lớn nhất là gì? | Race không tái hiện ổn định, nên nhóm chạy 10 vòng, báo tỉ lệ và có nhóm đối chứng. Rủi ro thứ hai là hai lượt test chạy chồng nhau làm hỏng kết quả, nhóm đã có quy tắc chỉ một lượt tại một thời điểm. |
| Còn bao nhiêu việc, kịp không? | Còn Playwright qua giao diện, đề xuất sửa, hoàn thiện báo cáo. Phần kiểm thử chính đã xong nên còn thời gian đến bảo vệ. |
| Chi phí là bao nhiêu? | Tiền 0 đồng; máy khoảng 3 phút cho lượt chính thức; nhân lực ước lượng 34 đến 46 người-giờ, chưa theo dõi giờ thực tế. |

### Về đóng góp từng thành viên

| Câu hỏi | Trả lời ngắn |
|---|---|
| Ai làm gì? | Mỗi người nói đúng phần của mình như slide 13. |
| Sao lịch sử Git chủ yếu một người? | Nhóm làm việc trên một máy chính cho phần cài đặt; nhóm sẽ commit phần việc của từng người trước bảo vệ. Chỉ nói điều đúng sự thật. |
| Bạn [tên] giải thích lại một phần của bạn khác? | Mỗi người cần hiểu cả bài (xem mục 8). |

### Về kỹ thuật và lỗi

| Câu hỏi | Trả lời ngắn |
|---|---|
| Sao biết là race chứ không phải lỗi thường? | Có nhóm đối chứng gửi tuần tự: TC-02 tuần tự đúng, đồng thời sai. TC-06 sai cả hai nên nhóm xếp là lỗi logic. |
| Request có thực sự đồng thời không? | Có, k6 đặt cùng mốc giờ gửi, độ lệch đo được 0 đến 1 ms. |
| Sao không tin mã HTTP? | Vì cả 10 request đều trả 200 mà cơ sở dữ liệu vẫn sai. |
| Lỗi có phải lỗi thật không? | Tái hiện từng lỗi bằng curl thuần và xem dữ liệu trong DB; chạy trên hai máy cho cùng kết quả. |
| Hướng sửa là gì? | Thêm ràng buộc cơ sở dữ liệu không cho hai booking chồng giờ. Thử trên dữ liệu test thì D1 và D3 hết lỗi nhưng người thua nhận 500 thay vì 409, nên cần sửa cả mã trả lỗi. |
| Đã báo lỗi cho Cal.com chưa? | Chưa. Nhóm chưa sửa mã Cal.com, mới thử một hướng sửa trên dữ liệu test. |
| Hai máy giống nhau không? | Giống 8 trên 8 test case. Khác ở tốc độ và một vòng của TC-05. |
| Con số 20/20 từ đâu? | Thí nghiệm riêng với 2 request đồng thời, 20 vòng. Bảng chính là 10 request, 10 vòng. |

## 8. Mỗi người phải tự trả lời được (để phần đóng góp đáng tin)

| Người | Phải giải thích được |
|---|---|
| Tâm | Cách dựng Cal.com, các biến môi trường, vì sao ghim phiên bản, bốn khó khăn đã gặp |
| Vinh | Luồng đặt lịch, vì sao thiếu khóa, nguyên nhân gốc D1 đến D6, thí nghiệm khắc phục |
| Tín | 7 invariant, 8 test case, vì sao dùng oracle trong DB, cách k6 đồng bộ thời điểm gửi |
| Vĩ | Cách đọc kết quả, vì sao hai máy khớp, vì sao loại hai lượt chạy đầu, chi phí |

Ngoài phần của mình, mỗi người nắm một câu tóm tắt cho phần của ba người còn lại.

## 9. Điều phải nói thật

- Nhóm **chưa báo lỗi cho Cal.com**, **chưa sửa mã Cal.com**, **chưa test qua giao diện** bằng Playwright.
- Giờ làm chỉ là **ước lượng**, chưa theo dõi thực tế.
- Một số lỗi có thể bị phía Cal.com coi là hành vi chấp nhận được (ví dụ D2). Nhóm gọi là lỗi vì dữ liệu sai so với kỳ vọng đã nêu.
- Nếu thầy hỏi vượt giữa kỳ, trả lời: nhóm đã chạy đủ 8 test case, phần chưa làm đã ghi trong kế hoạch.

## 10. Nếu có sự cố

- **Demo lỗi:** bình tĩnh nói "xin phép dùng kết quả đã chạy sẵn", mở `REPORT.md` ở mục 5.
- **Cal.com không lên:** kiểm tra PostgreSQL còn chạy, rồi `yarn dev` lại. Request đầu mất vài giây vì biên dịch.
- **Cảnh báo `element.ref` trong console** (huy hiệu đỏ "1 issue"): cảnh báo của React trong mã giao diện Cal.com ở chế độ dev, không liên quan đến test.
- **Chỉ một người chạy test tại một thời điểm.**

## 11. Danh sách kiểm tra trước giờ

- [ ] Đã nộp báo cáo PDF và slide PDF lên LMS, chủ đề 8.
- [ ] Cal.com và PostgreSQL đang chạy; `npm run demo:midterm` đã chạy thử một lần.
- [ ] Mở sẵn slide PDF ở chế độ trình chiếu, trang đặt lịch và `REPORT.md`.
- [ ] Mỗi người nói đúng đóng góp thật của mình.
- [ ] Đã xem lại bảng đóng góp trong báo cáo (mục 4.6) cho khớp việc thật.

## 12. Tài liệu liên quan

- [BAO_CAO_GIUA_KY.md](BAO_CAO_GIUA_KY.md): nội dung báo cáo cũ dạng markdown.
- [QUY_TRINH_TEST.md](QUY_TRINH_TEST.md), [HUONG_DAN_NGUOI_TEST.md](HUONG_DAN_NGUOI_TEST.md), [KET_QUA_TEST_GIUA_KY.md](KET_QUA_TEST_GIUA_KY.md), [MINH_CHUNG_LOI.md](MINH_CHUNG_LOI.md), [HUONG_DAN_CHAY_LAI_WINDOWS.md](HUONG_DAN_CHAY_LAI_WINDOWS.md).
- [../README.md](../README.md): phiên bản đã pin và hướng dẫn cài đặt.
