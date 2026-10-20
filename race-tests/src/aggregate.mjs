// Gộp kết quả nhiều lượt CI: tỉ lệ tái hiện (lượt có FAIL / tổng lượt) cho từng scenario.
// Dùng: node src/aggregate.mjs <thư-mục-chứa-các-lượt>
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
if (!root) {
  console.error("Dùng: node src/aggregate.mjs <thư-mục>");
  process.exit(2);
}
const stats = {};
let runs = 0;
for (const entry of fs.readdirSync(root, { recursive: true })) {
  if (path.basename(entry) !== "summary.json") continue;
  const s = JSON.parse(fs.readFileSync(path.join(root, entry), "utf8"));
  runs++;
  for (const sc of s.scenarios) {
    const key = `${s.mode}/${sc.id}`;
    const st = (stats[key] ??= { title: sc.title, mode: s.mode, id: sc.id, lượt: 0, fail: 0, vòng: 0, vòngFail: 0 });
    st.lượt++;
    if (sc.verdict === "FAIL") st.fail++;
    st.vòng += sc.rounds.length;
    st.vòngFail += sc.failedRounds;
  }
}
const lines = [`## Tổng hợp ${runs} lượt chạy (summary.json)`, "", "| Chế độ | Scenario | Mô tả | Lượt có FAIL | Vòng vi phạm |", "|---|---|---|---|---|"];
for (const st of Object.values(stats).sort((a, b) => (a.mode + a.id).localeCompare(b.mode + b.id))) {
  lines.push(`| ${st.mode} | ${st.id} | ${st.title} | ${st.fail}/${st.lượt} | ${st.vòngFail}/${st.vòng} |`);
}
const md = lines.join("\n");
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`);
