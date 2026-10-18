// In phản hồi từng request của một vòng đã chạy (đọc file *.console.log trong thư mục raw).
// Dùng: npm run inspect -- results/windows-race/raw/S1-r1.console.log
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Dùng: npm run inspect -- <đường dẫn tới file .console.log>");
  process.exit(2);
}
const rows = fs
  .readFileSync(file, "utf8")
  .split("\n")
  .map((line) => line.match(/K15RESULT ([A-Za-z0-9+/=]+)/))
  .filter(Boolean)
  .map((m) => JSON.parse(Buffer.from(m[1], "base64").toString("utf8")));
console.table(rows.map((r) => ({ "#": r.index, request: r.label, HTTP: r.status, lỗi: r.error, "thông điệp": r.message, "ms": r.durationMs })));
const counts = rows.reduce((a, r) => ({ ...a, [r.status]: (a[r.status] ?? 0) + 1 }), {});
console.log("Tổng hợp HTTP:", counts);
