# BÁO CÁO ĐỀ TÀI R05-K15

**Kiểm thử Concurrency / Race Condition cho hệ thống đặt lịch Cal.com**

Môn: Kiểm thử phần mềm · Giảng viên: Nguyễn Thế Lâm · Khoa CNTT – Trường Đại học Đà Lạt

| Thành viên | MSSV | Vai trò | Phần phụ trách |
|---|---|---|---|
| _(điền)_ | _(điền)_ | A – Môi trường & DevOps | Phần C, H |
| _(điền)_ | _(điền)_ | B – Phân tích hệ thống | Phần A, B, RCA |
| _(điền)_ | _(điền)_ | C – Tác giả test | Phần E, F |
| _(điền)_ | _(điền)_ | D – Verifier & báo cáo | Phần D, G |

---

## Tóm tắt

Nhóm dựng Cal.com v6.2.0 trên máy cá nhân và phân tích luồng đặt lịch. Từ đó nhóm thiết kế **8 race scenario** quanh **7 invariant** về tính nhất quán dữ liệu. Harness dùng **k6** để gửi request đồng loạt (độ lệch thời điểm gửi ≤ 1 ms), sau đó **truy vấn trực tiếp PostgreSQL** để kết luận PASS/FAIL. Mỗi scenario chạy 10 vòng, kèm một **nhóm đối chứng gửi tuần tự** để tách lỗi race khỏi lỗi logic.

Kết quả chính:
- **5 lỗi race** (D1, D2, D3, D5, D6): tuần tự thì đúng, đồng thời thì vi phạm ở 10/10 vòng.
- **1 lỗi logic** (D4) do harness race phát hiện nhưng tái hiện được cả khi tuần tự.
- **2 quan sát phụ** (O1, O2).

Lỗi nghiêm trọng nhất (D1): chỉ với **2 request đồng thời**, host bị đặt chồng lịch ở 20/20 vòng. Cửa sổ race đo được khoảng **30–60 ms**. Nguyên nhân gốc là mẫu "kiểm tra rồi ghi" không khóa (TOCTOU). Lớp bảo vệ duy nhất ở CSDL là `UNIQUE(idempotencyKey)`, và nó chỉ bắt được slot trùng khít. Thí nghiệm thêm exclusion constraint chứng minh nguyên nhân này: dữ liệu trở nên toàn vẹn, nhưng đồng thời lộ ra Cal.com chưa xử lý mã lỗi tương ứng (trả 500).

---

## Phần A. Mô tả hệ thống

### A.1. Mục tiêu hệ thống

Cal.com là nền tảng đặt lịch hẹn mã nguồn mở (một lựa chọn thay thế Calendly):
- Chủ lịch (host) công bố các loại cuộc hẹn (event type) cùng khung giờ rảnh.
- Người đặt (booker) chọn slot trống và đặt lịch, không cần tài khoản.
- Hệ thống tự kiểm tra lịch bận, gửi email, đồng bộ Google/Outlook Calendar, tạo phòng họp video và thu phí.

### A.2. Actor và use case chính

| Actor | Use case |
|---|---|
| Booker (khách, không đăng nhập) | Xem trang event, chọn slot, đặt lịch, đổi lịch, hủy lịch qua link trong email |
| Host (người dùng có tài khoản) | Tạo/cấu hình event type (độ dài, số ghế, cần xác nhận, giới hạn số booking…), cấu hình lịch làm việc, xác nhận/từ chối booking, yêu cầu khách đổi lịch |
| Team admin / Org admin | Quản lý team, event round-robin/collective, phân quyền |
| Hệ thống ngoài | Google/Outlook Calendar (busy times), Daily/Zoom (video), Stripe (thanh toán), SMTP (email) |

Đề tài tập trung vào nhóm use case của **Booker**: đặt, đổi, hủy lịch. Đây là nơi nhiều người dùng không quen nhau cùng tranh một tài nguyên chung là lịch của host.

### A.3. Cây thư mục / module

Monorepo Yarn 4 + Turborepo, khoảng 7 950 file TypeScript.

```
calcom/
├── apps/
│   ├── web/            Next.js 16: UI + API routes (/api/book/event, /api/cancel, tRPC…)
│   └── api/
│       ├── v1/         REST API v1
│       └── v2/         REST API v2 (NestJS) – dành cho platform/atoms
├── packages/
│   ├── features/       nghiệp vụ theo vertical slice: bookings, availability, slots,
│   │                   schedules, eventtypes, ee/(seats, workflows, round-robin)…
│   ├── trpc/           tRPC routers (viewer.slots.reserveSlot, viewer.bookings.*)
│   ├── prisma/         schema.prisma, migrations, extensions (booking-idempotency-key)
│   ├── lib/            tiện ích chung (HttpError, rateLimit, idempotencyKey…)
│   ├── app-store/      ~100 tích hợp (calendar, video, payment, CRM)
│   ├── emails/, sms/   thông báo
│   └── ui/, platform/  component UI, SDK nhúng (atoms)
└── docker-compose.yml, turbo.json, playwright.config.ts…
```

### A.4. Dependency chính

| Nhóm | Thành phần |
|---|---|
| Runtime | Node.js 22, Next.js 16.1.5, React 18.2 |
| Dữ liệu | PostgreSQL, Prisma 6.16.1 (dùng `@prisma/adapter-pg`), Kysely cho một số truy vấn |
| API | Next.js API routes, tRPC, NestJS (v2) |
| Xác thực | NextAuth |
| Khác | dayjs (múi giờ), zod (validate), short-uuid/uuid, Unkey (rate limit, tắt khi không cấu hình) |

### A.5. Luồng dữ liệu

Chi tiết và sơ đồ: [diagrams/kien-truc.md](diagrams/kien-truc.md). Tóm tắt luồng đặt lịch:

1. Booker mở `/<username>/<slug>`. Trang gọi tRPC `slots.getSchedule` để tính các slot trống từ `Schedule/Availability` trừ đi busy times (booking hiện có + lịch ngoài).
2. Booker chọn slot. Frontend gọi tRPC `slots.reserveSlot`, ghi bảng `SelectedSlots` để giữ chỗ tạm thời ở mức UI.
3. Booker điền form. Frontend gửi `POST /api/book/event`, vào `RegularBookingService.createBooking()`:
   1. tải event type, host, booking gốc (nếu đổi lịch);
   2. `checkBookingAndDurationLimits` đếm booking theo `bookingLimits`;
   3. `ensureAvailableUsers` kiểm tra host còn trống;
   4. nếu event có ghế: `handleSeats` thêm ghế vào booking hiện có;
   5. ngược lại: `createBooking` mở transaction, (hủy booking gốc nếu đổi lịch) rồi INSERT `Booking` + `Attendee`;
   6. sau khi ghi: gửi email, webhook, workflow, đồng bộ calendar.
4. Hủy lịch: `POST /api/cancel` (CSRF double-submit cookie) → `handleCancelBooking` → `Booking.status = CANCELLED`.

Điểm mấu chốt cho kiểm thử race: các bước 3.2–3.3 **đọc** trạng thái, bước 3.5 mới **ghi**. Giữa chúng không có khóa nào được giữ.

---

## Phần B. Kiến trúc và module liên quan

Sơ đồ container và sơ đồ module nằm ở [diagrams/kien-truc.md](diagrams/kien-truc.md), mục 1–2. Sơ đồ tuần tự minh họa cửa sổ TOCTOU nằm ở mục 3.

Năm module liên quan trực tiếp tới kiểm thử:

| # | Module | Vai trò | Liên quan tới race |
|---|---|---|---|
| 1 | `packages/features/bookings/lib/service/RegularBookingService.ts` (~3 100 dòng) | Điều phối toàn bộ luồng tạo/đổi lịch | Chứa chuỗi "đọc → quyết định → ghi" không có khóa (D1, D3, D5, D6). Ánh xạ `P2002` sang 409 (dòng ~2097) |
| 2 | `packages/features/bookings/lib/handleNewBooking/createBooking.ts` | Ghi `Booking` trong `prisma.$transaction`; khi đổi lịch thì đồng thời chuyển booking gốc sang CANCELLED | `update` booking gốc chỉ theo `id`, không kiểm tra trạng thái (D4, D5) |
| 3 | `packages/prisma/extensions/booking-idempotency-key.ts` + cột `Booking.idempotencyKey @unique` | Chống tạo trùng booking | Chỉ áp cho status ACCEPTED và slot trùng khít → bảo vệ S1, không bảo vệ D1/D3 |
| 4 | `packages/features/bookings/lib/handleSeats/` (`handleSeats.ts`, `create/createNewSeat.ts`) | Event có ghế: thêm attendee vào booking chung của slot | `addSeatToBooking` dùng `SELECT … FOR UPDATE` → S4 an toàn; nhánh "slot chưa có booking" không xử lý tranh chấp (D2) |
| 5 | `packages/features/bookings/lib/checkBookingLimits.ts`, `handleNewBooking/ensureAvailableUsers.ts`, `originalRescheduledBookingUtils.ts` | Các bước kiểm tra trước khi ghi: giới hạn số lượng, lịch trống, booking gốc hợp lệ | Đều là bước "check" của TOCTOU (D1, D5, D6); điều kiện thiếu sót gây D4; sai mã lỗi O1 |

---

## Phần C. Môi trường và bằng chứng hệ thống chạy

Hướng dẫn cài đặt từ máy sạch, từng bước: [../README.md](../README.md) mục 1–3.

| Hạng mục | Giá trị |
|---|---|
| Máy | MacBook (Apple Silicon, 10 nhân, 32 GB RAM), macOS |
| Cal.com | tag `v6.2.0` · commit `1c193cca8682b33b9866c792186033f7ef886682` |
| Node / Yarn | 22.23.2 / 4.12.0 (Corepack) |
| PostgreSQL | 16 (Postgres.app, `initdb` riêng, `max_connections=300`) |
| Chế độ chạy | `yarn dev` (Next.js dev server, cổng 3000) |
| Seed | `yarn workspace @calcom/prisma db-deploy` (toàn bộ migration) + `db-seed` (user `pro`, `free`, team…) |
| Dữ liệu test | `race-tests/fixtures/fixtures.sql`: host `k15host`, lịch 24/7 UTC, 5 event type |
| Biến môi trường quan trọng | `DATABASE_URL`, `NEXTAUTH_SECRET`, `CALENDSO_ENCRYPTION_KEY` (32 ký tự), `CALCOM_TELEMETRY_DISABLED=1`; không đặt `UNKEY_ROOT_KEY` để tắt rate limit |

Khó khăn gặp phải và cách xử lý:
- Máy không có Docker: dùng Postgres.app, khởi tạo cluster riêng trong `.pgdata/`.
- Cột thời gian của Cal.com là `timestamp without time zone` (lưu UTC). Driver `pg` mặc định đổi theo múi giờ máy (+07:00) nên ban đầu kiểm invariant bị lệch 7 giờ. Đã ép UTC trong `race-tests/src/db.mjs`.
- `/api/cancel` yêu cầu CSRF token dài 64 ký tự, kiểu double-submit cookie. Harness gửi cùng một token ở cả cookie và body.

**Bằng chứng ≥ 3 luồng nghiệp vụ chạy được** (`docs/evidence/smoke-test.txt`, lệnh `npm run smoke`):

| Luồng | HTTP | Thời gian | Trạng thái trong DB |
|---|---|---|---|
| 1. Đặt lịch | 200 | 104 ms | `accepted` |
| 2. Đổi lịch | 200 | 92 ms | gốc = `cancelled`, mới = `accepted` |
| 3. Hủy lịch | 200 | 65 ms | `cancelled` |
| 4. Đặt lại slot vừa hủy | 200 | 69 ms | slot được giải phóng |

Ngoài ra, trang công khai `GET /k15host` trả HTTP 200, và log server `yarn dev` báo `✓ Ready`.

---

## Phần D. Kỹ thuật kiểm thử: Concurrency / Race testing

### D.1. Nguyên lý

Race condition xảy ra khi kết quả phụ thuộc vào thứ tự xen kẽ của các thao tác đồng thời trên dữ liệu dùng chung. Dạng phổ biến nhất trong ứng dụng web là **TOCTOU** (time-of-check to time-of-use): request đọc trạng thái, ra quyết định, rồi ghi. Nếu request khác ghi vào giữa hai bước đó, quyết định dựa trên dữ liệu đã cũ.

Kiểm thử race khác kiểm thử chức năng ở ba điểm:
1. **Oracle là invariant, không phải mã HTTP.** Cần chỉ ra tính chất luôn đúng của dữ liệu (vd. "host không có 2 booking chồng giờ"), rồi kiểm nó trực tiếp trên CSDL sau khi chạy. API có thể trả 200 cho mọi request mà dữ liệu vẫn sai, như D1.
2. **Phải thực sự đồng thời.** Các request cần chạm vào cửa sổ race cùng lúc. Harness dùng một "rào chắn thời gian": mọi VU của k6 chờ tới cùng mốc `START_AT` rồi mới gửi. Độ lệch thời điểm gửi đo được là 0–1 ms.
3. **Kết quả mang tính xác suất.** Race không xảy ra 100% mỗi lần, nên phải lặp nhiều vòng và báo cáo tỉ lệ vi phạm thay vì một lần PASS/FAIL.

### D.2. Lý do chọn phạm vi

- Đặt lịch là nghiệp vụ cốt lõi của Cal.com. "Double booking" là lỗi người dùng không chấp nhận được, và đề bài cũng ghi chú Cal.com "đặc biệt phù hợp kiểm thử stateful và concurrency".
- Endpoint `POST /api/book/event` công khai, không cần đăng nhập. Bất kỳ ai cũng gửi được request đồng thời, và hai khách thật cũng hoàn toàn có thể đặt cùng lúc.
- Phạm vi gồm 5 biến thể có cơ chế bảo vệ khác nhau: event 1-1, event có ghế, event cần xác nhận, đổi/hủy lịch, giới hạn số lượng. Nhờ vậy nhóm so sánh được chỗ nào đã được bảo vệ (S1, S4) và chỗ nào chưa.
- Ngoài phạm vi: đồng bộ lịch ngoài, thanh toán, team round-robin, API v2, hiệu năng quy mô lớn (thuộc K07).

### D.3. Giả định

1. Một instance Cal.com, một PostgreSQL, chạy local. Không có cache hay hàng đợi phân tán.
2. Chạy bằng `yarn dev`. Logic nghiệp vụ giống bản build production; độ trễ có thể khác. Cửa sổ race trên production thường **rộng hơn** vì có thêm các lời gọi lịch ngoài.
3. Host không kết nối lịch ngoài, nên busy times chỉ đến từ bảng `Booking`.
4. Rate limit tắt (không có `UNKEY_ROOT_KEY`). Bản cloud cal.com bật rate limit theo IP, nhưng nhiều người dùng khác IP vẫn gửi đồng thời được.
5. Mỗi vòng dùng một ngày riêng trong tương lai (2027–2029), nên các vòng độc lập nhau.

### D.4. Rủi ro của phương pháp

| Rủi ro | Cách xử lý |
|---|---|
| Kết luận nhầm lỗi logic là lỗi race | Nhóm đối chứng tuần tự gửi đúng tập request đó. Nhờ vậy D4 được phân loại lại là lỗi logic |
| Request không thực sự đồng thời | Rào chắn `START_AT`, đo `sendSpreadMs` mỗi vòng (0–1 ms) |
| Oracle sai (vd. lệch múi giờ) | Kiểm invariant bằng SQL trên DB. Phát hiện và sửa lỗi lệch 7 giờ của driver ở lần chạy thử |
| Kết quả ngẫu nhiên | 10 vòng/scenario, thêm 20 vòng với N = 2, và thí nghiệm đo độ rộng cửa sổ |
| Ảnh hưởng hệ thống thật | Chỉ chạy local, dữ liệu riêng của host `k15host` |

### D.5. Tiêu chí pass/fail

- Một **vòng** PASS khi mọi invariant của scenario đúng **và** không có phản hồi 5xx hay lỗi kết nối (I7).
- Một **scenario** PASS khi 10/10 vòng PASS. Chỉ cần 1 vòng vi phạm là scenario FAIL, vì với race một lần vi phạm đã đủ chứng minh lỗi tồn tại.
- Một vi phạm được xếp là **lỗi race** khi chế độ đồng thời FAIL **và** nhóm đối chứng tuần tự PASS.

---

## Phần E. Thiết kế test model và test case

### E.1. Invariant (test oracle)

| ID | Invariant | Cách kiểm (SQL trên DB) |
|---|---|---|
| I1 | Một host không có 2 booking ACCEPTED/PENDING chồng thời gian | Self-join `Booking` theo `userId` với điều kiện `a.start < b.end AND b.start < a.end` |
| I2 | Slot của event seated không vượt `seatsPerTimeSlot` ghế và chỉ có 1 booking chung | Đếm `BookingSeat` theo `(eventTypeId, startTime)` |
| I2b | Còn ghế thì người đặt không bị từ chối (đúng `min(N, ghế trống)` người được nhận) | So số response 200 với số ghế trống |
| I3 | Tối đa 1 booking ACCEPTED/PENDING cho một slot khi `requiresConfirmationWillBlockSlot` | Như I1 |
| I4 | Một booking gốc sinh tối đa 1 booking mới còn hiệu lực qua đổi lịch | Đếm `Booking` active có `fromReschedule = uid gốc` |
| I5 | Nếu lệnh hủy trả 200 thì không còn booking active nào của cuộc hẹn đó | Kết hợp HTTP của `/api/cancel` và trạng thái các booking con |
| I6 | Số booking active trong ngày ≤ `bookingLimits.PER_DAY` | Đếm `Booking` active theo ngày |
| I7 | Không có HTTP 5xx, timeout hay lỗi kết nối | Từ log k6 |

### E.2. Test model

Hệ thống được mô hình hóa như một tài nguyên dùng chung (lịch của host) với các thao tác `book(slot)`, `reschedule(B → slot')`, `cancel(B)`. Mỗi thao tác gồm hai pha: `check` (đọc) và `commit` (ghi). Test case là một **tổ hợp thao tác xung đột**, được bắn sao cho các pha `check` cùng xảy ra trước mọi pha `commit`. Oracle là các invariant ở E.1.

Biến thể xung đột được chọn theo **loại cơ chế bảo vệ** cần thử:
- trùng khít slot: idempotencyKey;
- chồng lấn không trùng khít: không có ràng buộc;
- ghế: `FOR UPDATE`;
- PENDING: không có key;
- trạng thái booking gốc: kiểm tra ở tầng ứng dụng;
- đếm giới hạn: kiểm tra ở tầng ứng dụng.

### E.3. Test case

Dữ liệu chung: host `k15host` (UTC, rảnh 24/7). Event type:
- `k15-30`: 30 phút;
- `k15-60`: 60 phút;
- `k15-seated`: 30 phút, 3 ghế;
- `k15-confirm`: 30 phút, cần xác nhận, PENDING giữ chỗ;
- `k15-limit`: 30 phút, tối đa 1/ngày.

Mỗi request có email người đặt riêng (`<scenario>-r<vòng>-u<i>@k15.test`). Slot vòng *r* của scenario *k* là `2027-01-04T09:00Z + (100k + r) ngày`.

| ID | Tiền điều kiện | Input (gửi đồng thời) | Kết quả mong đợi | Invariant |
|---|---|---|---|---|
| S1 | Slot 09:00 trống | 10 × đặt `k15-30` lúc 09:00 | 1 × 200, 9 × 409 | I1, I7 |
| S2 | Khung 08:00–11:00 trống | 10 × đặt: 7 × `k15-30` bắt đầu 09:00 + 3i phút, 3 × `k15-60` bắt đầu 08:30 + 3i phút (mọi khoảng chứa 09:29) | 1 × 200, 9 × 409 | I1, I7 |
| S3 | Slot seated trống | 6 × đặt `k15-seated` lúc 09:00 | 3 × 200, 3 × 409 `booking_seats_full_error`; 1 booking, 3 ghế | I2, I2b, I7 |
| S4 | Slot seated đã có 1 ghế (đặt tuần tự trước) | 6 × đặt `k15-seated` lúc 09:00 | 2 × 200, 4 × 409; tổng 3 ghế | I2, I2b, I7 |
| S5 | Slot 09:00 trống | 10 × đặt `k15-confirm` lúc 09:00 | 1 × 200 (PENDING), 9 × 409 | I3, I7 |
| S6 | Booking B lúc 09:00 (ACCEPTED) | 5 × đổi lịch B sang 10:00, 11:00, …, 14:00 | 1 × 200; B → CANCELLED; 1 booking con | I4, I7 |
| S7 | Booking B lúc 09:00 | 1 × hủy B + 1 × đổi lịch B sang 11:00 | Không thể cả hai cùng 200 | I5, I7 |
| S8 | Ngày trống | 8 × đặt `k15-limit` lúc 09:00, 10:00, …, 16:00 | 1 × 200, 7 bị từ chối | I6, I7 |

Request mẫu (đặt lịch):

```json
POST /api/book/event
{ "eventTypeId": 1159, "start": "2027-01-05T09:00:00.000Z", "end": "2027-01-05T09:30:00.000Z",
  "timeZone": "UTC", "language": "en", "metadata": {}, "user": "k15host",
  "responses": { "name": "s1-r1-u0", "email": "s1-r1-u0@k15.test",
                 "location": { "value": "inPerson", "optionValue": "" } } }
```

Đổi lịch: thêm `"rescheduleUid": "<uid>"`. Hủy: `POST /api/cancel {uid, cancellationReason, csrfToken}` kèm cookie `calcom.csrf_token`.

---

## Phần F. Mã nguồn harness

Thư mục [`race-tests/`](../race-tests/). Hướng dẫn chạy và dependency ở [README](../README.md) mục 3.

| File | Chức năng |
|---|---|
| `fixtures/fixtures.sql` | Tạo lại host và event type test (idempotent) |
| `k6/race.js` | Mỗi VU gửi đúng 1 request; mọi VU chờ mốc `START_AT` chung rồi mới gửi; `delayMs` để đo cửa sổ race; log kết quả từng request (base64 JSON) |
| `src/scenarios.mjs` | 8 scenario. Mỗi scenario có `prepare()` (tạo dữ liệu tiền điều kiện + sinh request) và `verify()` (kiểm invariant bằng SQL) |
| `src/run.mjs` | Điều phối từng vòng: prepare → k6 (hoặc tuần tự) → verify → ghi `summary.json`, `REPORT.md`, log thô |
| `src/window.mjs` | Đo độ rộng cửa sổ race: 2 request, lệch Δ ms |
| `src/db.mjs` | Truy vấn invariant (ép UTC cho cột `timestamp`) |
| `src/smoke.mjs` | Smoke test 3 luồng nghiệp vụ |
| `experiments/exclusion-constraint.sql` | Thí nghiệm khắc phục D1/D3 |

Lệnh chạy chính:

```bash
cd race-tests && npm install && npm run fixtures && npm run race
```

Mã thoát: `0` khi mọi scenario PASS, `1` khi có FAIL, `2` khi harness lỗi. Nhờ vậy có thể gắn vào CI.

---

## Phần G. Kết quả, lỗi và phân tích nguyên nhân

### G.1. Kết quả chính (10 vòng/scenario)

Nguồn: `race-tests/results/latest-race/REPORT.md` và `race-tests/results/latest-sequential/REPORT.md`.

| Scenario | N | Đồng thời: vòng vi phạm | HTTP (tổng 10 vòng) | Quan sát trên DB | Tuần tự: vòng vi phạm | Kết luận |
|---|---|---|---|---|---|---|
| S1 slot trùng khít | 10 | 0/10 | 200×10, 409×90 | 1 booking/slot | 0/10 | **PASS** – idempotencyKey hiệu quả |
| S2 slot chồng lấn | 10 | **10/10** | 200×100 | 10 booking chồng nhau/vòng | 0/10 | **FAIL – D1** |
| S3 ghế đầu tiên | 6 | **10/10** | 200×11, 409×49 | chỉ 1–2/3 ghế được bán | 0/10 | **FAIL – D2** |
| S4 ghế còn lại | 6 | 0/10 | 200×20, 409×40 | đúng 3 ghế | 0/10 | **PASS** – `FOR UPDATE` hiệu quả |
| S5 PENDING trùng slot | 10 | **10/10** | 200×87, 409×13 | 7–10 PENDING/slot | 0/10 | **FAIL – D3** |
| S6 đổi lịch nhiều lần | 5 | **10/10** | 200×50 | 5 booking con active | **10/10** | **FAIL – D4 (logic)** |
| S7 hủy vs đổi lịch | 2 | **10/10** | 200×20 | hủy "thành công" nhưng còn booking active | 0/10 | **FAIL – D5** |
| S8 giới hạn 1/ngày | 8 | **10/10** | 200×80 | 8 booking/ngày | 0/10 | **FAIL – D6** |

Độ lệch thời điểm gửi giữa các request trong một vòng: 0–1 ms. Latency p95 khi đồng thời: 160–550 ms; khi tuần tự: 50–80 ms.

### G.2. Độ nhạy theo mức đồng thời (N = 2, 20 vòng)

Nguồn: `results/sensitivity-n2/REPORT.md`.

| Scenario | Vòng vi phạm | Ý nghĩa |
|---|---|---|
| S2 | 20/20 | Chỉ cần 2 khách bấm "Đặt" gần như cùng lúc là host bị đặt chồng lịch |
| S3 | 20/20 | Người thứ 2 luôn bị từ chối dù còn 2 ghế |
| S5 | 11/20 | 55% vòng có 2 PENDING cho cùng slot; số vòng còn lại bị chặn "nhờ may" do trùng `uid` (O2) |
| S6 | 20/20 | – |
| S8 | 20/20 | – |

### G.3. Độ rộng cửa sổ race của D1

Nguồn: `results/window-S2/WINDOW.md`. 2 request, request thứ hai gửi trễ Δ ms.

| Δ (ms) | 0 | 10 | 20 | 30 | 35 | 40 | 45 | 50 | 60 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|
| Vi phạm | 100% | 100% | 100% | 100% | 40% | 20% | 20% | 40% | 0% | 0% |

Cửa sổ khoảng 30–60 ms, tương ứng thời gian từ lúc bắt đầu xử lý request (bước đọc lịch trống) tới lúc INSERT. Hệ thống thật có lời gọi Google/Outlook Calendar ở bước đọc nên cửa sổ có thể lên tới hàng trăm ms.

### G.4. Danh sách lỗi

Chi tiết đầy đủ (cách tái hiện, input, kết quả, nguyên nhân gốc theo file/dòng, đề xuất sửa): [DEFECTS.md](DEFECTS.md).

| ID | Lỗi | Mức độ | Nguyên nhân gốc (tóm tắt) |
|---|---|---|---|
| D1 | Đặt chồng giờ khi slot lệch giờ/khác event type | Cao | TOCTOU giữa `ensureAvailableUsers` (đọc) và `createBooking` (ghi). `idempotencyKey` chỉ bắt slot trùng khít; không có exclusion constraint |
| D2 | Event seated: còn ghế vẫn bị từ chối | Trung bình | `handleSeats` không thấy booking của slot → mọi request cùng INSERT → `P2002` → 409, không retry theo nhánh thêm ghế |
| D3 | Nhiều PENDING cho một slot | Trung bình | TOCTOU + extension chỉ gán `idempotencyKey` khi ACCEPTED, PENDING có key NULL |
| D4 | Đổi lịch lặp lại từ một booking gốc | Cao | `getOriginalRescheduledBooking` cho phép `CANCELLED && rescheduled`; trạng thái này trùng với "host yêu cầu đổi lịch" |
| D5 | Hủy và đổi lịch cùng thành công | Trung bình | Kiểm tra trạng thái booking gốc ở đầu luồng; transaction đổi lịch `update` theo `id`, không kiểm lại |
| D6 | Vượt `bookingLimits` | Trung bình | Đếm rồi mới INSERT, không khóa |
| O1 | Vượt giới hạn trả 401 | Thấp | `checkBookingLimits.ts:44` bọc lỗi 403 thành 401 |
| O2 | `uid` có thể trùng trong cùng mili-giây | Thấp | `uid = uuidv5(username:start:Date.now())` |

### G.5. Thí nghiệm khắc phục (kiểm chứng nguyên nhân gốc)

Nhóm thêm ràng buộc `EXCLUDE USING gist ("userId" WITH =, tsrange("startTime","endTime") WITH &&) WHERE status IN ('accepted','pending')` cho host test, rồi chạy lại (`results/fix-exclusion/`):

| Scenario | Trước | Sau | Nhận xét |
|---|---|---|---|
| S1 | PASS | PASS | Không ảnh hưởng chức năng đúng |
| S2 (D1) | 10 booking chồng/vòng | **1 booking/vòng** | Dữ liệu toàn vẹn → xác nhận nguyên nhân gốc là thiếu ràng buộc ở CSDL; nhưng 9 request thua nhận **HTTP 500** (I7) vì code chỉ ánh xạ `P2002`, chưa ánh xạ `23P01` |
| S5 (D3) | 7–10 PENDING/slot | **1 PENDING/slot** | Như trên, kèm 500 |
| S8 (D6) | 8 booking/ngày | 8 booking/ngày | Không sửa được: invariant dạng "đếm" cần advisory lock hoặc SERIALIZABLE |

Kết luận: cần sửa ở **cả hai tầng**:
1. **CSDL:** exclusion constraint hoặc advisory lock, để đảm bảo toàn vẹn bất kể mức đồng thời.
2. **Ứng dụng:** ánh xạ lỗi ràng buộc sang 409 và thử lại theo nhánh đúng (seated); kiểm tra lại trạng thái trong transaction khi đổi/hủy lịch.

---

## Phần H. Khả năng tái lập

| Hạng mục | Cách cố định |
|---|---|
| Phiên bản hệ thống | Tag `v6.2.0`, SHA `1c193cca8682b33b9866c792186033f7ef886682`, ghi trong README và báo cáo |
| Runtime | Node 22, Yarn 4.12.0 (khóa qua `packageManager`), PostgreSQL 16, k6 2.3.0 |
| Dependency harness | `race-tests/package.json` + `package-lock.json` |
| Dữ liệu | `fixtures.sql` tạo lại từ đầu; mỗi lần chạy xóa booking của `k15host`; mỗi vòng dùng ngày riêng |
| Cấu hình test | Tham số dòng lệnh `--scenarios --rounds --n --stagger --mode`, ghi lại trong `summary.json` |
| Kết quả | Mỗi lần chạy lưu `summary.json`, `REPORT.md`, request đã gửi, log k6 thô |

Chạy lại trên máy mới:
1. Làm theo README mục 2 để dựng Cal.com (khoảng 15 phút, phần lớn là `yarn install`).
2. Chạy:

   ```bash
   cd race-tests && npm install && npm run fixtures && npm run smoke && npm run race && npm run race -- --mode sequential
   ```

3. So sánh `results/latest-race/REPORT.md` với bảng G.1.

Vì race mang tính xác suất, tỉ lệ có thể khác đôi chút trên máy khác. Với các lỗi nhóm báo cáo, cửa sổ race (30–60 ms) rộng hơn nhiều so với độ lệch gửi (≤ 1 ms), nên kết quả FAIL ổn định.

---

## Hạn chế và hướng phát triển

- Chạy ở chế độ `yarn dev`, chưa đo trên bản build production hay nhiều instance sau load balancer.
- Chưa kiểm thử API v2 (NestJS) và luồng team (round-robin, collective). Hai luồng này có logic chọn host riêng, khả năng cao cũng bị D1.
- Chưa kiểm thử `slots.reserveSlot` (giữ chỗ tạm ở UI). Cơ chế này chỉ giảm xác suất, không thay thế ràng buộc phía server.
- Có thể bổ sung Playwright chạy song song nhiều trình duyệt để minh họa D1 qua giao diện thật.
- Đề xuất đóng góp ngược cho Cal.com: báo cáo D1, D4 qua kênh bảo mật/issue, kèm reproducer `race-tests`.

## Tài liệu tham khảo

1. Cal.com, mã nguồn v6.2.0 – https://github.com/calcom/cal.com
2. Grafana k6 – Scenarios & executors – https://grafana.com/docs/k6/latest/using-k6/scenarios/
3. PostgreSQL 16 – Exclusion constraints, `btree_gist` – https://www.postgresql.org/docs/16/ddl-constraints.html
4. PostgreSQL 16 – Explicit locking, advisory locks – https://www.postgresql.org/docs/16/explicit-locking.html
5. Prisma – Transactions and concurrency – https://www.prisma.io/docs/orm/prisma-client/queries/transactions
6. MITRE CWE-367: Time-of-check Time-of-use (TOCTOU) Race Condition – https://cwe.mitre.org/data/definitions/367.html
