# Kế hoạch đề tài R05-K15: Cal.com × Concurrency / Race Testing

- **Repo (R05):** https://github.com/calcom/cal.com – hạ tầng đặt lịch, TypeScript / Next.js / PostgreSQL (Prisma) / monorepo
- **Kỹ thuật (K15):** Concurrency / Race – tạo nhiều request đồng thời để tìm lỗi double booking, lost update
- **Công cụ gợi ý trong đề:** k6, Playwright parallel
- **Yêu cầu tối thiểu của K15:** xác định invariant; ≥ 3 race scenarios; phải kiểm tra tính nhất quán ở CSDL, không chỉ gọi API mù
- **Mốc:** 18/9 đăng ký (đã qua) → **20/10 báo cáo giữa kỳ** → báo cáo nộp **trước bảo vệ 1 tuần** → bảo vệ cuối kỳ (tháng 12, theo lịch trường)

> Các nhận định về mã nguồn Cal.com bên dưới là **giả thuyết cần xác minh** khi đọc code, chưa phải kết luận.

---

## 1. Phạm vi (Scope)

Chỉ tập trung vào **luồng đặt lịch (booking)**, không ôm toàn bộ monorepo.

| Trong phạm vi | Ngoài phạm vi |
|---|---|
| Tạo booking qua public booking page / API (`handleNewBooking`) | Calendar sync (Google/Outlook), video app |
| Giữ chỗ slot (reserve slot) | Payment/Stripe thật, workflows, webhook bên ngoài |
| Seated event (nhiều người cùng 1 slot, có giới hạn chỗ) | Billing, org/team nâng cao, SSO |
| Reschedule / Cancel đồng thời | Test hiệu năng quy mô lớn (đó là K07) |
| Booking limits (giới hạn số booking/ngày/tuần) | |

Giả định: 1 instance chạy local qua Docker, 1 PostgreSQL, user test + event type tạo bằng seed; không gửi email/lịch thật (tắt hoặc dùng mail catcher như Mailhog).

## 2. Invariant cần kiểm chứng (cốt lõi của K15)

| ID | Invariant | Kiểm tra ở đâu |
|---|---|---|
| I1 | Một host không có 2 booking `ACCEPTED/PENDING` chồng thời gian (event 1-1) | Query bảng `Booking` theo `userId`, `startTime`, `endTime`, `status` |
| I2 | Event có `seatsPerTimeSlot = N` không bao giờ vượt N attendee/slot | Đếm `Attendee`/`BookingSeat` theo booking |
| I3 | Cùng một slot được reserve bởi 2 người thì chỉ 1 người đặt thành công (hoặc cả hai hợp lệ theo thiết kế) | `SelectedSlots` + `Booking` |
| I4 | Reschedule đồng thời cùng 1 booking không sinh 2 booking mới / không mất booking | Chuỗi `fromReschedule`, `status` |
| I5 | Cancel + Reschedule/Cancel đồng thời không để dữ liệu ở trạng thái mâu thuẫn | `Booking.status`, `Attendee` |
| I6 | Booking limit (vd. tối đa 1/ngày) không bị vượt khi N request đồng thời | Đếm booking theo ngày |
| I7 | Mọi request thất bại trả mã lỗi rõ ràng (4xx), không 500 / không treo | Log response + log server |

## 3. Race scenarios (≥ 3 theo đề, kế hoạch làm 5–6)

| # | Scenario | Cách tạo tải | Invariant | Ưu tiên |
|---|---|---|---|---|
| S1 | **Double booking**: N user (vd. 10/50) cùng đặt đúng 1 slot của 1 event 1-1 | k6 `shared-iterations`/`per-vu-iterations` bắn đồng thời, hoặc Playwright nhiều context song song | I1 | Bắt buộc |
| S2 | **Seat overbooking**: event có 3 chỗ, 10 request đồng thời | k6 | I2 | Bắt buộc |
| S3 | **Hai host/event type khác nhau cùng 1 người** (cùng availability, 2 event type) đặt cùng giờ | k6 | I1 | Bắt buộc |
| S4 | **Reschedule đồng thời** cùng 1 booking sang 2 slot khác nhau | k6 | I4 | Nên làm |
| S5 | **Cancel vs Reschedule** đồng thời trên cùng booking | k6 | I5 | Nên làm |
| S6 | **Booking limit** bị vượt khi đồng thời | k6 | I6 | Nếu còn thời gian |

Mỗi scenario lặp nhiều vòng (vd. 20–50 lần) vì race không tái hiện 100% mỗi lần; ghi lại tần suất xảy ra.

## 4. Kiến trúc harness

```
k6 script (đa VU, đồng thời)  ──HTTP──▶  Cal.com (Docker)  ──▶  PostgreSQL
        │                                                          ▲
        └── kết quả/response (JSON) ─▶ Verifier (Node/Python) ─────┘
                                       truy vấn DB kiểm invariant
```

- **Setup:** script seed tạo user, event type (1-1, seated, có limit), availability cố định; reset DB giữa các lần chạy.
- **Chạy:** k6 bắn request; Playwright parallel dùng bổ sung cho ít nhất 1 scenario qua UI thật.
- **Verify:** script truy vấn Postgres trực tiếp sau mỗi lần chạy → báo PASS/FAIL theo invariant → xuất log/JSON.
- **Tái chạy:** 1 lệnh (`make test` hoặc `npm run race:all`) + README liệt kê dependency.

## 5. Kế hoạch theo Sprint

Hôm nay là 9/10 nên **sprint đầu rất gấp: còn 11 ngày đến giữa kỳ.**

### Sprint 1 — 9/10 → 20/10: Setup + Phân tích + Kế hoạch test (→ Giữa kỳ)

| Việc | Đầu ra | Phần báo cáo |
|---|---|---|
| Chốt thành viên, Trello/Jira/GitHub Projects, repo Git của nhóm | Board + repo | – |
| **Pin phiên bản**: chọn tag release ổn định, ghi commit SHA | File `VERSION.md` | H |
| Dựng Cal.com local/Docker, seed data, chạy được | Ảnh/clip bằng chứng | C |
| Chạy được ≥ 3 luồng: tạo event type, đặt lịch qua trang public, reschedule/cancel | Bằng chứng từng luồng | C |
| Đọc code: cây module, dependency, luồng dữ liệu 3–5 nghiệp vụ | Sơ đồ component + data flow | A, B |
| Khoanh vùng 3–5 module liên quan (booking, slots/availability, Prisma schema, API route, reserve slot) | Mô tả module | B |
| Viết **kế hoạch test**: phạm vi, giả định, invariant, scenario, tiêu chí pass/fail | Tài liệu kế hoạch | D, E (khung) |
| Làm thử 1 PoC race nhỏ (S1) để chứng minh hướng khả thi | Script PoC | – |
| Slide + demo giữa kỳ | Slide, demo chạy | – |

**Checklist demo 20/10:** hệ thống chạy trên máy · sơ đồ kiến trúc · tài liệu on-boarding · kế hoạch K15 (scope, giả định, tiêu chí).

### Sprint 2 — 21/10 → 3/11: Thiết kế và viết harness
- Hoàn thiện test model: bảng input / precondition / expected / invariant / dữ liệu test cho S1–S6.
- Script seed + reset DB, hàm verifier truy vấn DB.
- Viết k6 cho S1, S2, S3; chạy lần đầu, chỉnh độ ổn định.

### Sprint 3 — 4/11 → 17/11: Mở rộng và chạy hàng loạt
- Viết S4, S5 (và S6 nếu kịp); thêm 1 scenario Playwright parallel qua UI.
- Chạy mỗi scenario nhiều vòng, thu log/metrics (tỉ lệ vi phạm, p95 latency, error rate).
- Ghi nhận và tái hiện defect; lưu reproducer.

### Sprint 4 — 18/11 → 30/11: Root cause + báo cáo
- Phân tích nguyên nhân gốc (đọc code `handleNewBooking`, transaction/lock/unique constraint, mức isolation của Postgres).
- Nếu **không tìm thấy lỗi**: trình bày bằng chứng (số vòng chạy, 0 vi phạm, thiết kế cơ chế bảo vệ) — đề yêu cầu phải chứng minh.
- Viết báo cáo đủ phần A–H; đóng băng mã nguồn test; tag release của repo test.
- **Nộp báo cáo ≥ 1 tuần trước ngày bảo vệ** (cần xác nhận ngày thi cụ thể để lùi mốc này cho đúng).

### Sprint 5 — đầu tháng 12 → bảo vệ
- Làm slide, phân đoạn thuyết trình, tập dượt 2 lần.
- Kiểm tra chạy lại trên máy sạch (clone mới → chạy ra kết quả).
- Peer-review nội bộ.

## 6. Phân vai (giả sử 4 người; 3 người thì gộp, 5 người thì tách)

| Vai | Trách nhiệm chính |
|---|---|
| **A – Môi trường & DevOps** | Docker, seed/reset, pin version, tài liệu cài đặt (Phần C, H) |
| **B – Phân tích hệ thống** | Đọc code, sơ đồ kiến trúc/data flow, RCA (Phần A, B, G) |
| **C – Tác giả test** | k6 scripts, Playwright, scenario (Phần E, F) |
| **D – Verifier & báo cáo** | Truy vấn DB kiểm invariant, thu log/metrics, tổng hợp báo cáo, slide (Phần D, G) |

Tất cả: commit đều đặn (phục vụ tiêu chí lịch sử Git), mỗi người đứng tên task trên board.

## 7. Rủi ro và đối phó

| Rủi ro | Đối phó |
|---|---|
| Cal.com cài khó, nặng, nhiều env var | Bắt đầu cài ngay; ưu tiên Docker Compose của repo; ghi lại mọi lỗi để làm tài liệu on-boarding |
| Main branch thay đổi làm vỡ test | Pin tag/SHA, không `git pull` giữa kỳ |
| Race không tái hiện ổn định | Tăng số VU, lặp nhiều vòng, báo tỉ lệ thay vì 1 lần |
| Không tìm thấy lỗi (Cal.com đã có cơ chế bảo vệ) | Chuẩn bị sẵn phương án "chứng minh bằng coverage": số vòng/scenario, 0 vi phạm; thêm S4–S6 để mở rộng bề mặt |
| Booking cần email/lịch/OAuth ngoài | Tắt/giả lập integration, chỉ dùng API nội bộ |
| Giả định sai về cơ chế (vd. unique constraint, lock) | Đọc code + schema Prisma trước khi viết scenario |
| Máy yếu khi chạy Cal.com + Postgres + k6 | Giảm VU, chạy k6 ở máy khác trong nhóm hoặc chạy lần lượt |
| Thành viên đóng góp không đều | Board có người phụ trách, review chéo hàng tuần |

## 8. Tiêu chí pass/fail (Phần D)

- **Test PASS** khi toàn bộ invariant I1–I7 đúng sau tất cả vòng chạy của scenario.
- **Phát hiện lỗi** khi ≥ 1 invariant bị vi phạm và tái hiện lại được (có reproducer + log + trạng thái DB).
- **Hành vi bất thường** (500, treo, timeout) ghi nhận riêng dù invariant DB không bị vi phạm.

## 9. Việc làm ngay trong tuần này

1. Xác nhận với giảng viên/nhóm: đề tài R05-K15 đã được duyệt chưa (hạn đăng ký 18/9 đã qua) và ngày bảo vệ cụ thể.
2. Lập board và repo Git; chia vai.
3. Chọn tag Cal.com, ghi SHA; clone và dựng bằng Docker.
4. Đặt lịch họp nhóm ngắn đầu/cuối mỗi tuần (Scrum mini).
5. Chạy được luồng đặt lịch bằng tay → bắt đầu đọc `handleNewBooking`.
