# R05-K15: Kiểm thử Concurrency/Race cho Cal.com

Đề tài môn Kiểm thử phần mềm (GV Nguyễn Thế Lâm, Khoa CNTT – ĐH Đà Lạt).

- **Hệ thống (R05):** [calcom/cal.com](https://github.com/calcom/cal.com), hạ tầng đặt lịch (TypeScript, Next.js, PostgreSQL/Prisma, monorepo Yarn + Turbo)
- **Kỹ thuật (K15):** Concurrency / Race testing, dùng k6 để bắn request đồng thời và kiểm invariant trực tiếp trên CSDL
- **Phạm vi:** luồng đặt lịch, đổi lịch, hủy lịch, event có ghế (seated), event cần xác nhận, giới hạn số booking

| Tài liệu | Nội dung |
|---|---|
| [docs/BAO_CAO.md](docs/BAO_CAO.md) | Báo cáo đầy đủ phần A–H |
| [docs/DEFECTS.md](docs/DEFECTS.md) | Danh sách lỗi, cách tái hiện, phân tích nguyên nhân gốc |
| [docs/diagrams/kien-truc.md](docs/diagrams/kien-truc.md) | Sơ đồ kiến trúc, module, luồng dữ liệu (Mermaid) |
| [Slide bảo vệ](https://claude.ai/artifact/F5BpD71znEGvUL3d34wKRe) | 15 slide, tải được dạng .pptx/PDF |
| [ke_hoach_R05-K15.md](ke_hoach_R05-K15.md) | Kế hoạch đề tài |
| [race-tests/](race-tests/) | Mã nguồn harness (k6 + Node.js) |
| [race-tests/results/](race-tests/results/) | Log và báo cáo kết quả từng lần chạy |

## 1. Phiên bản được cố định (Phần H)

| Thành phần | Phiên bản |
|---|---|
| Cal.com | tag `v6.2.0`, commit `1c193cca8682b33b9866c792186033f7ef886682` (01/03/2026) |
| Node.js | 22.x (đã chạy với 22.23.2) |
| Yarn | 4.12.0 (qua Corepack, khai báo trong `packageManager` của Cal.com) |
| PostgreSQL | 16 |
| k6 | 2.3.0 |
| Driver `pg` (harness) | 8.x |

Không dùng nhánh `main` của Cal.com, vì mã nguồn thay đổi liên tục và có thể làm vỡ test.

## 2. Dựng Cal.com từ máy sạch

### 2.1. Lấy mã nguồn đúng phiên bản

```bash
git clone --depth 1 --branch v6.2.0 https://github.com/calcom/cal.com.git calcom
```

```bash
git -C calcom rev-parse HEAD   # phải ra 1c193cca8682b33b9866c792186033f7ef886682
```

### 2.2. PostgreSQL

Có thể dùng Docker:

```bash
docker run -d --name calcom-db -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_DB=calendso postgres:16 -c max_connections=300
```

Hoặc dùng PostgreSQL cài sẵn (cách nhóm đã làm trên macOS với Postgres.app, không có Docker):

```bash
initdb -D .pgdata/data -U postgres --auth=trust -E UTF8
```

```bash
pg_ctl -D .pgdata/data -l .pgdata/pg.log -o "-p 5432 -c max_connections=300" start
```

```bash
psql -h localhost -U postgres -c "create database calendso;"
```

`max_connections=300` cần thiết vì mỗi request đồng thời giữ một kết nối Prisma.

### 2.3. Biến môi trường

```bash
cd calcom && cp .env.example .env && cp .env.appStore.example .env.appStore
```

Sửa trong `calcom/.env`:

| Biến | Giá trị |
|---|---|
| `DATABASE_URL`, `DATABASE_DIRECT_URL` | `postgresql://postgres:@localhost:5432/calendso` |
| `NEXTAUTH_SECRET` | kết quả `openssl rand -base64 32` |
| `CALENDSO_ENCRYPTION_KEY` | kết quả `openssl rand -base64 24` (đúng 32 ký tự) |
| `CALCOM_TELEMETRY_DISABLED` | `1` |
| `NEXTAUTH_URL`, `NEXT_PUBLIC_WEBAPP_URL` | giữ `http://localhost:3000` |

Để trống `UNKEY_ROOT_KEY` (rate limit sẽ tự tắt; nếu bật, k6 sẽ bị chặn ở mức 429 thay vì đo được race). Không cần cấu hình SMTP: email lỗi gửi không làm hỏng booking.

### 2.4. Cài đặt, migrate, seed, chạy

```bash
corepack enable && yarn install
```

```bash
yarn workspace @calcom/prisma db-deploy
```

```bash
yarn workspace @calcom/prisma db-seed
```

```bash
yarn dev
```

Ứng dụng chạy tại http://localhost:3000. Tài khoản seed: `pro`/`pro`, `free`/`free`.

## 3. Chạy bộ kiểm thử race

```bash
cd race-tests && npm install
```

Cần cài k6 (`brew install k6` trên macOS, hoặc xem https://grafana.com/docs/k6/latest/set-up/install-k6/).

| Lệnh | Tác dụng |
|---|---|
| `npm run fixtures` | Tạo host `k15host` với lịch 24/7 UTC và 5 event type test (chạy lại nhiều lần được) |
| `npm run smoke` | Kiểm tra 3 luồng nghiệp vụ: đặt lịch, đổi lịch, hủy |
| `npm run race` | Chạy 8 scenario, mỗi scenario 10 vòng, gửi đồng thời bằng k6 |
| `npm run race -- --mode sequential` | Nhóm đối chứng: gửi đúng các request đó nhưng tuần tự |
| `npm run race -- --scenarios S2,S6 --rounds 20 --n 15` | Chạy một số scenario, đổi số vòng và mức đồng thời |
| `npm run report -- results/<thư-mục>` | Sinh lại `REPORT.md` từ `summary.json` |

Biến môi trường tùy chọn: `CALCOM_URL` (mặc định `http://localhost:3000`), `DATABASE_URL` (mặc định `postgresql://postgres@localhost:5432/calendso`), `K6_BIN`.

Mỗi lần chạy tạo thư mục `race-tests/results/<thời-điểm>-<chế-độ>/` gồm:
- `REPORT.md`: bảng tổng hợp và chi tiết từng vòng
- `summary.json`: dữ liệu thô
- `raw/`: request đã gửi, log k6 từng vòng, summary k6

Bản mới nhất được sao vào `results/latest-race/` và `results/latest-sequential/`.

Mã thoát của `npm run race`: `0` khi mọi scenario PASS, `1` khi có scenario FAIL, `2` khi harness lỗi.

## 4. Cấu trúc thư mục

```
.
├── README.md                 hướng dẫn này
├── ke_hoach_R05-K15.md       kế hoạch đề tài
├── docs/                     báo cáo, defect, sơ đồ, bằng chứng
├── race-tests/
│   ├── fixtures/fixtures.sql dữ liệu test (host + 5 event type)
│   ├── k6/race.js            script k6: mỗi VU gửi 1 request, đồng bộ bằng mốc START_AT
│   ├── src/
│   │   ├── config.mjs        cấu hình URL, DB
│   │   ├── api.mjs           dựng request đặt/đổi/hủy lịch
│   │   ├── db.mjs            truy vấn kiểm invariant trên PostgreSQL
│   │   ├── scenarios.mjs     8 scenario S1–S8: chuẩn bị + kiểm tra
│   │   ├── run.mjs           điều phối: chuẩn bị → k6 → kiểm DB → ghi kết quả
│   │   ├── report.mjs        sinh REPORT.md
│   │   ├── fixtures.mjs      nạp fixtures.sql
│   │   └── smoke.mjs         smoke test 3 luồng nghiệp vụ
│   └── results/              kết quả các lần chạy
└── calcom/                   mã nguồn Cal.com v6.2.0 (không commit, clone theo mục 2.1)
```

## 5. Lưu ý an toàn

Chỉ chạy kiểm thử trên instance cài ở máy local. Không bắn tải vào cal.com hay bất kỳ server công khai nào. Cal.com dùng giấy phép AGPLv3: nhóm chỉ clone, chạy và kiểm thử trong môi trường học tập, không phân phối lại.
