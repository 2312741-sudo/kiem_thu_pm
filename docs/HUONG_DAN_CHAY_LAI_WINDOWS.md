# Chạy lại bộ test trên máy Windows khác

Mục đích: một thành viên khác chạy lại toàn bộ test trên máy của mình để có kết quả thứ hai độc lập (việc "chạy lại trên máy khác" trong kế hoạch). Mất khoảng 15 phút nếu Cal.com đã chạy được.

**Quy tắc:** tại một thời điểm chỉ một lượt test chạy trên một Cal.com. Các lệnh test xóa và tạo lại booking của host test.

## 1. Cần có

| Thứ | Kiểm tra bằng | Cần |
|---|---|---|
| Node.js 22 | `node -v` | v22.x |
| k6 | `k6 version` | k6 v1.x hoặc v2.x |
| Cal.com v6.2.0 đang chạy | mở http://localhost:3000 | Trang Cal.com hiện lên |
| PostgreSQL có database `calendso` | `npm run fixtures` (bước 3) | In được bảng 5 loại cuộc hẹn |

Cài đặt Cal.com và PostgreSQL: xem [README.md](../README.md) mục 2. Cal.com phải đúng tag `v6.2.0` (commit `1c193cca8682b33b9866c792186033f7ef886682`), nếu không kết quả không so sánh được.

## 2. Cài k6 (nếu chưa có)

Đây là lý do lượt chạy đồng thời bị lỗi `k6 lỗi (exit null): undefined`: máy chưa có k6.

```powershell
winget install k6
```

Đóng hẳn Terminal (và VS Code nếu dùng terminal trong đó), mở lại, rồi kiểm tra:

```powershell
k6 version
```

Nếu `winget` không có, tải bản cài đặt tại https://grafana.com/docs/k6/latest/set-up/install-k6/ rồi mở lại Terminal.

## 3. Lấy mã nguồn và chuẩn bị

Đặt thư mục ở **đường dẫn không có dấu tiếng Việt hay khoảng trắng**, ví dụ `C:\dev\kiem_thu_pm`.

```powershell
git clone https://github.com/2312741-sudo/kiem_thu_pm.git C:\dev\kiem_thu_pm
cd C:\dev\kiem_thu_pm\race-tests
npm install
```

Nếu đã có thư mục từ trước thì `git pull` để lấy bản mới nhất (có bản sửa báo lỗi k6 rõ ràng hơn).

**Nếu PostgreSQL trên máy có mật khẩu** (bản cài đặt thường đặt mật khẩu), khai báo trước khi chạy, thay `MATKHAU` bằng mật khẩu của bạn:

```powershell
$env:DATABASE_URL = "postgresql://postgres:MATKHAU@localhost:5432/calendso"
```

Nếu Cal.com chạy ở địa chỉ khác `http://localhost:3000`:

```powershell
$env:CALCOM_URL = "http://localhost:3000"
```

Tạo dữ liệu test:

```powershell
npm run fixtures
```

Kỳ vọng: in bảng 5 dòng `k15-30`, `k15-60`, `k15-seated`, `k15-confirm`, `k15-limit`.

## 4. Chạy test (theo đúng thứ tự, không chạy song song)

Lượt 1, đồng thời (khoảng 3 phút):

```powershell
npm run race -- --out results/windows-race
```

Lượt 2, tuần tự để đối chứng (khoảng 30 giây):

```powershell
npm run race -- --mode sequential --out results/windows-sequential
```

## 5. Kết quả đúng trông như thế nào

| Test case | Lượt 1: đồng thời | Lượt 2: tuần tự |
|---|---|---|
| S1, S4 | PASS (0/10) | PASS |
| S2, S3, S5, S7, S8 | **FAIL (10/10)** | PASS |
| S6 | **FAIL (10/10)** | **FAIL (10/10)** |

Lượt tuần tự đã chạy đúng như bảng này trên máy Windows. Nếu lượt đồng thời cho tỉ lệ khác 10/10 ở một test case (máy chậm hoặc nhanh hơn có thể lệch), **ghi đúng số thật, không sửa cho giống**. Đó là kết quả của máy đó.

## 6. Gửi lại cho người phụ trách

1. Hai thư mục `results/windows-race` và `results/windows-sequential` (có `REPORT.md`, `summary.json`, `raw/`).
2. Ảnh chụp Terminal sau khi mỗi lượt chạy xong (thấy dòng PASS/FAIL của 8 test case).
3. Cấu hình máy, dán kết quả của lệnh sau:

```powershell
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores
[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB)
node -v
k6 version
```

4. Số giờ người test bỏ ra (để điền mục chi phí).

## 7. Nếu gặp lỗi

| Thông báo | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Không tìm thấy chương trình 'k6'` | Chưa cài k6 hoặc Terminal chưa nạp PATH mới | Làm bước 2, mở lại Terminal |
| `k6 lỗi (exit null): undefined` | Cùng nguyên nhân, trên bản mã cũ | `git pull`, rồi làm bước 2 |
| `Không tìm thấy fixture của 'k15host'` | Chưa chạy fixtures | `npm run fixtures` |
| `password authentication failed` | Thiếu hoặc sai mật khẩu PostgreSQL | Đặt `$env:DATABASE_URL` như bước 3 |
| `ECONNREFUSED` đến cổng 3000 | Cal.com chưa chạy | Chạy `yarn dev` trong thư mục `calcom`, đợi `Ready` |
| `ECONNREFUSED` đến cổng 5432 | PostgreSQL chưa chạy | Khởi động dịch vụ PostgreSQL |
| `Cal.com không phản hồi tại ...` | Cal.com chưa chạy hoặc đã tắt | Chạy `yarn dev` trong thư mục `calcom`, đợi `Ready`, rồi chạy lại |
| `Mất kết nối tới Cal.com giữa lúc đang chạy` | Cal.com bị dừng hoặc crash giữa chừng (thường do thiếu RAM) | Kết quả lượt đó không hợp lệ; đóng bớt ứng dụng, chạy lại Cal.com và chạy lại từ đầu |
| S1 báo FAIL (đáng lẽ PASS) | Có request trả 5xx/timeout, hoặc Cal.com sai phiên bản/thiếu ràng buộc CSDL | Chạy `npm run inspect -- results/windows-race/raw/S1-r1.console.log` rồi gửi kết quả cho người phụ trách |
| Request đầu tiên rất chậm | Cal.com biên dịch lần đầu | Bộ test đã tự khởi động nóng; nếu vẫn chậm, mở http://localhost:3000/k15host trên trình duyệt trước |
| Kết quả bất thường (ví dụ S1 FAIL) | Có lượt test khác chạy chồng | Dừng mọi lượt, chạy lại từ đầu |

Nếu vẫn lỗi, chụp cả cửa sổ Terminal (từ dòng lệnh đến thông báo lỗi) và gửi người phụ trách.
