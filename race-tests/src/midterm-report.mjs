// Dựng docs/KET_QUA_TEST_GIUA_KY.md từ kết quả thật của hai lần chạy:
//   results/giua-ky-20-race        (gửi đồng thời)
//   results/giua-ky-20-sequential  (đối chứng tuần tự)
// Chạy: npm run midterm-report
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const load = (name) => JSON.parse(fs.readFileSync(path.join(root, "results", name, "summary.json"), "utf8"));
const race = load("giua-ky-20-race");
const seq = load("giua-ky-20-sequential");

const TC = (id) => `TC-${id.slice(1).padStart(2, "0")}`;
const DEFECT = { S2: "D1", S17: "D1", S3: "D2", S5: "D3", S6: "D4", S7: "D5", S8: "D6", S13: "D6", S11: "D7", S12: "D8", S14: "D9", S15: "D10", S16: "D11" };
const seqById = Object.fromEntries(seq.scenarios.map((s) => [s.id, s]));

const duration = (s) => (new Date(s.finishedAt) - new Date(s.startedAt)) / 1000;
const requests = (s) => s.scenarios.reduce((a, x) => a + x.n * x.rounds.length, 0);
const fmt = (d) => new Date(d).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

function classify(r, q) {
  const rf = r.failedRounds > 0, qf = q.failedRounds > 0;
  if (rf && !qf) return "Lỗi race";
  if (rf && qf) return "Lỗi logic (sai cả khi tuần tự)";
  if (!rf && !qf) return "Đúng";
  return "Bất thường, cần kiểm tra lại";
}

const lines = [];
lines.push("# Kết quả test giữa kỳ – R05-K15", "");
lines.push("Sinh tự động từ kết quả thật bằng `npm run midterm-report`. Không sửa tay.", "");
lines.push(`- Hệ thống: Cal.com v6.2.0 tại ${race.baseUrl}, PostgreSQL 16`);
lines.push(`- Gửi đồng thời: \`${race.runId}\` · ${fmt(race.startedAt)} → ${fmt(race.finishedAt)}`);
lines.push(`- Gửi tuần tự (đối chứng): \`${seq.runId}\` · ${fmt(seq.startedAt)} → ${fmt(seq.finishedAt)}`);
lines.push(`- Số vòng mỗi test case: ${race.rounds}`, "");

lines.push("## 1. Kết quả từng test case", "");
lines.push("| TC | Mô tả | Đồng thời (vòng vi phạm) | Tuần tự (vòng vi phạm) | Kết luận | Lỗi | Dữ liệu trong CSDL (vòng 1, đồng thời) | HTTP vòng 1 (đồng thời) |");
lines.push("|---|---|---|---|---|---|---|---|");
let pass = 0, failRace = 0, failLogic = 0, odd = 0;
for (const s of race.scenarios) {
  const q = seqById[s.id];
  const verdict = classify(s, q);
  if (verdict === "Đúng") pass++;
  else if (verdict.startsWith("Lỗi race")) failRace++;
  else if (verdict.startsWith("Lỗi logic")) failLogic++;
  else odd++;
  const r1 = s.rounds[0];
  const http = Object.entries(r1.statusCounts).map(([c, n]) => `${c}×${n}`).join(" ");
  const observed = JSON.stringify(r1.observed).replace(/"/g, "").replace(/\|/g, "/");
  lines.push(`| ${TC(s.id)} | ${s.title} | ${s.failedRounds}/${s.rounds.length} | ${q.failedRounds}/${q.rounds.length} | **${verdict}** | ${DEFECT[s.id] ?? "–"} | ${observed} | ${http} |`);
}
lines.push("");

const total = race.scenarios.length;
lines.push("## 2. Tổng hợp", "");
lines.push(`- Tổng số test case: **${total}**`);
lines.push(`- Đúng (không có lỗi): **${pass}**`);
lines.push(`- Có lỗi race: **${failRace}**`);
lines.push(`- Có lỗi logic: **${failLogic}**`);
if (odd) lines.push(`- Bất thường, cần kiểm tra lại: **${odd}**`);
lines.push(`- Tỉ lệ test case phát hiện lỗi: **${failRace + failLogic}/${total}**`, "");

lines.push("## 3. Chi phí test (đo thật)", "");
lines.push("| Lần chạy | Vòng | Request | Thời gian máy |");
lines.push("|---|---|---|---|");
for (const [label, s] of [["Đồng thời", race], ["Tuần tự (đối chứng)", seq]]) {
  lines.push(`| ${label} | ${s.scenarios.reduce((a, x) => a + x.rounds.length, 0)} | ${requests(s)} | ${duration(s).toFixed(0)} giây |`);
}
lines.push(`| **Tổng** | | **${requests(race) + requests(seq)}** | **${(duration(race) + duration(seq)).toFixed(0)} giây** |`, "");
lines.push("Chi phí tiền: 0 đồng. Công sức người-giờ: ghi ở phiếu trong [HUONG_DAN_NGUOI_TEST.md](HUONG_DAN_NGUOI_TEST.md) mục 6.", "");

lines.push("## 4. Lỗi tìm được", "");
lines.push("| Lỗi | Test case | Loại | Số vòng vi phạm (đồng thời) |");
lines.push("|---|---|---|---|");
for (const s of race.scenarios) {
  if (!DEFECT[s.id] || s.failedRounds === 0) continue;
  lines.push(`| ${DEFECT[s.id]} | ${TC(s.id)} | ${classify(s, seqById[s.id])} | ${s.failedRounds}/${s.rounds.length} |`);
}
lines.push("", "Mô tả chi tiết, nguyên nhân gốc: [DEFECTS.md](DEFECTS.md). Tái hiện độc lập bằng curl: [QUY_TRINH_TEST.md](QUY_TRINH_TEST.md) mục 6.", "");

lines.push("## 5. Vi phạm ghi nhận (đồng thời)", "");
for (const s of race.scenarios) {
  const rounds = s.rounds.filter((r) => !r.pass);
  if (rounds.length === 0) continue;
  const sample = rounds[0].violations[0];
  lines.push(`- **${TC(s.id)}**: ${rounds.length}/${s.rounds.length} vòng. Ví dụ vòng ${rounds[0].round}, ${sample.invariant}: ${sample.detail}`);
}
lines.push("", "## 6. Bằng chứng", "");
lines.push("- Báo cáo từng chế độ: [giua-ky-race/REPORT.md](../race-tests/results/giua-ky-race/REPORT.md), [giua-ky-sequential/REPORT.md](../race-tests/results/giua-ky-sequential/REPORT.md)");
lines.push("- Dữ liệu thô từng vòng (request đã gửi, phản hồi): thư mục `raw/` cạnh mỗi báo cáo");
lines.push("- Minh chứng tổng hợp: [MINH_CHUNG_LOI.md](MINH_CHUNG_LOI.md)", "");

const out = path.join(root, "..", "docs", "KET_QUA_TEST_GIUA_KY.md");
fs.writeFileSync(out, lines.join("\n"));
console.log("wrote", path.relative(process.cwd(), out));
