# Tiến độ cuối kỳ – R05-K15 (lập ngày 24/11/2026)

**Hạn nộp:** trước 23:59 ngày **29/11/2026**, nộp qua LMS, file nén ghi rõ tên nhóm (email thầy ngày 21/11).
**Danh mục file thầy yêu cầu:** (1) báo cáo cuối kỳ (mục A, phần 6 của đề bài); (2) bản phân chia công việc và đóng góp của từng cá nhân thông qua peer review. Ngoài ra, lịch sử công việc và commit Git phải cho thấy sự tham gia đều đặn của các thành viên và được trình bày trong buổi bảo vệ.

## 1. Đã xong

| Hạng mục | Trạng thái | File |
|---|---|---|
| Báo cáo cuối kỳ theo mẫu đồ án của khoa (62 trang, PDF + Word) | Xong, đủ phần A đến H | [BAO_CAO_CUOI_KY.pdf](BAO_CAO_CUOI_KY.pdf), [.docx](BAO_CAO_CUOI_KY.docx) |
| Bản phân chia công việc, lịch sử Git, mẫu peer review (4 trang) | **Bản nháp, cần các thành viên điền và ký** | [PHAN_CHIA_CONG_VIEC_VA_PEER_REVIEW.pdf](PHAN_CHIA_CONG_VIEC_VA_PEER_REVIEW.pdf), [.docx](PHAN_CHIA_CONG_VIEC_VA_PEER_REVIEW.docx) |
| Mã nguồn kiểm thử, kết quả, tài liệu chạy lại | Xong, nằm trong gói zip và trên GitHub | `race-tests/`, `docs/` |
| Gói zip nộp LMS | Xong cấu trúc (xem `README_NOP_BAI.txt` trong zip) | `Nhom14_R05-K15_CuoiKy.zip` |

Nội dung chuyên môn đã có: 20 test case (13 phát hiện lỗi, 7 đạt ở cả hai chế độ), 11 lỗi D1 đến D11 đều tái hiện bằng curl, đánh giá rủi ro, chứng minh tính khả thi, chạy trên hai máy (macOS và Windows, khớp 20/20), pin phiên bản Cal.com v6.2.0 (commit `1c193cca8682b33b9866c792186033f7ef886682`).

## 2. Còn thiếu: việc **chỉ các thành viên làm được** (không thể làm thay)

| # | Việc | Ai | Hạn đề nghị |
|---|---|---|---|
| 1 | Đọc phần phân công (mục 2 của bản phân chia), sửa nếu khác việc thật, **ký xác nhận** (mục 6) | Cả 4 người | 27/11 |
| 2 | **Điền phiếu đánh giá chéo** (mục 5): mỗi người một phiếu cho cả ba bạn và cho mình (điểm 1–5 và % đóng góp) | Cả 4 người | 27/11 |
| 3 | **Tự ghi số giờ làm** thực tế (mục 4). Nhóm chưa theo dõi giờ, nên số này không thể tạo giùm | Cả 4 người | 27/11 |
| 4 | Điền bảng tổng hợp peer review sau khi thu đủ phiếu | Một người được cử | 28/11 |
| 5 | **Lịch sử Git:** hiện 30/30 commit thuộc một tài khoản (2312741-sudo). Thầy yêu cầu thể hiện sự tham gia đều đặn. Cách làm đúng sự thật: mỗi người **tự commit phần việc thật của mình** bằng tài khoản của mình (ví dụ Vĩ đưa kết quả Windows và hướng dẫn, Vinh đưa phân tích nguyên nhân gốc, Tín đưa phần chỉnh sửa test). Không tạo commit giả hoặc đổi tên tác giả của commit cũ | Cả 4 người | trước 29/11 |
| 6 | Thêm các thành viên làm cộng tác viên của kho và gán người phụ trách cho 18 thẻ trên bảng GitHub Projects (hiện chưa gán) | Chủ kho (Tâm) | 27/11 |
| 7 | Nộp zip lên LMS trước 23:59 ngày 29/11 | Một người được cử | 29/11 (nên trước 22:00) |

Sau khi có phiếu peer review và giờ làm, đưa số liệu thật vào bản phân chia (Word) rồi xuất lại PDF. Đừng ước lượng thay.

## 3. Cần chú ý khi nộp

- **Không nộp** `docs/BAO_CAO.md`, `docs/BAO_CAO_R05-K15.docx`, `docs/BAO_CAO_GIUA_KY_THEO_MAU.*`: là bản cũ (8 test case hoặc giữa kỳ).
- Hai file `docs/Nhom14_R05-K15*.pdf` là bản sao cũ của báo cáo và slide giữa kỳ, không phải bản cuối kỳ.
- Slide bảo vệ cuối kỳ (`docs/THUYET_TRINH_R05-K15.pptx`) vẫn là bản cũ (8 test case), chưa cập nhật. Không bắt buộc trong gói LMS nhưng cần cho buổi bảo vệ.
- Phân vai (Tâm: môi trường, Vinh: phân tích, Tín: test, Vĩ: chạy test và báo cáo) là phân vai ban đầu của nhóm. Nếu việc thật khác thì sửa trong cả báo cáo (mục 4.6) lẫn bản phân chia trước khi nộp.
- Điều chưa làm, đã nêu trung thực trong báo cáo: chưa báo lỗi cho Cal.com, chưa sửa mã Cal.com, chưa test qua giao diện bằng Playwright.

## 4. Còn lại sau 29/11

| Việc | Ghi chú |
|---|---|
| Cập nhật slide bảo vệ theo 20 test case, đánh giá rủi ro, chứng minh khả thi | Có thể dùng bộ 17 slide giữa kỳ làm nền |
| Chuẩn bị trình bày lịch sử công việc và commit Git | Thầy yêu cầu nêu trong buổi bảo vệ |
| Tập dượt demo (`npm run demo:midterm`), lệnh trong [docs/HUONG_DAN_THUYET_TRINH_GIUA_KY.md](../HUONG_DAN_THUYET_TRINH_GIUA_KY.md) mục 5 | |
