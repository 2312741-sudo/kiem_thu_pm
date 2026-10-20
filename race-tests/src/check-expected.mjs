// Kiểm kết quả một lần chạy trong CI.
// Dùng: node src/check-expected.mjs <thư-mục-kết-quả> race|sequential
// - sequential: nhóm đối chứng, kết quả xác định → phải đúng bảng kỳ vọng (chỉ S6 FAIL, lỗi logic không phải race).
// - race: S1, S4, S9, S10, S18, S19, S20 là scenario cơ chế bảo vệ đã chịu được tải (phải PASS). Các scenario còn lại chỉ ghi nhận tỉ lệ tái hiện, vì race không tất định.
import fs from "node:fs";
import path from "node:path";

const [dir, mode] = process.argv.slice(2);
if (!dir || !["race", "sequential"].includes(mode)) {
  console.error("Dùng: node src/check-expected.mjs <thư-mục> race|sequential");
  process.exit(2);
}
const summary = JSON.parse(fs.readFileSync(path.join(dir, "summary.json"), "utf8"));
const expectedSequential = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`S${i + 1}`, i + 1 === 6 ? "FAIL" : "PASS"]));
// S1, S4 là đối chứng cơ chế bảo vệ; S9, S10, S18, S19, S20 đã PASS ổn định 10/10 vòng khi đồng thời.
const mustPassInRace = new Set(["S1", "S4", "S9", "S10", "S18", "S19", "S20"]);

const rows = [];
let bad = 0;
for (const s of summary.scenarios) {
  let note = "";
  if (mode === "sequential" && expectedSequential[s.id] !== s.verdict) {
    bad++;
    note = `LỆCH (kỳ vọng ${expectedSequential[s.id]})`;
  }
  if (mode === "race" && mustPassInRace.has(s.id) && s.verdict !== "PASS") {
    bad++;
    note = "LỆCH (scenario đối chứng phải PASS)";
  }
  rows.push(`| ${s.id} | ${s.title} | ${s.verdict} | ${s.failedRounds}/${s.rounds.length} | ${note || "đúng kỳ vọng"} |`);
}
const md = [
  `### ${mode === "race" ? "Đồng thời (race)" : "Tuần tự (đối chứng)"}`,
  "",
  "| Scenario | Mô tả | Kết luận | Vòng vi phạm | Đối chiếu |",
  "|---|---|---|---|---|",
  ...rows,
  "",
].join("\n");
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`);
process.exit(bad ? 1 : 0);
