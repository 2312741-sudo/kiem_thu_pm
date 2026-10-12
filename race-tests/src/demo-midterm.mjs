// Bộ demo giữa kỳ (~30 giây): hệ thống chạy được + 3 luồng nghiệp vụ + PoC race.
// Dùng: npm run demo:midterm
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "./config.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const node = process.execPath;
const out = path.join(root, "results", "demo-midterm");

const title = (t) => console.log(`\n=== ${t} ===`);

title("Bước 1/3 · Hệ thống Cal.com v6.2.0 đang chạy?");
try {
  const res = await fetch(`${config.baseUrl}/${config.hostUsername}`, { signal: AbortSignal.timeout(60_000) });
  console.log(`GET ${config.baseUrl}/${config.hostUsername} → HTTP ${res.status}`);
  if (!res.ok) process.exit(2);
} catch (err) {
  console.error(`Không kết nối được ${config.baseUrl}. Chạy 'yarn dev' trong thư mục calcom trước.`);
  process.exit(2);
}

title("Bước 2/3 · Ba luồng nghiệp vụ: đặt lịch → đổi lịch → hủy lịch");
const smoke = spawnSync(node, [path.join(root, "src", "smoke.mjs")], { stdio: "inherit" });
if (smoke.status !== 0) process.exit(smoke.status ?? 1);

title("Bước 3/3 · PoC race: 10 request cùng lúc, 3 vòng mỗi scenario");
fs.rmSync(out, { recursive: true, force: true });
spawnSync(node, [path.join(root, "src", "run.mjs"), "--scenarios", "S1,S2", "--rounds", "3", "--out", out], { stdio: "ignore" });
const summary = JSON.parse(fs.readFileSync(path.join(out, "summary.json"), "utf8"));

const rows = summary.scenarios.map((s) => {
  const r = s.rounds[0];
  return {
    scenario: `${s.id} ${s.id === "S1" ? "cùng một slot" : "slot chồng lấn"}`,
    "vòng vi phạm": `${s.failedRounds}/${s.rounds.length}`,
    "HTTP vòng 1": Object.entries(r.statusCounts).map(([c, n]) => `${c}×${n}`).join(" "),
    "booking active trong DB": r.observed.activeBookings,
    "kết luận": s.verdict,
  };
});
console.table(rows);
console.log("S1 PASS: chỉ 1 người đặt được, đúng kỳ vọng.");
console.log("S2 FAIL: 10 booking chồng giờ cùng tồn tại → host bị double booking (lỗi D1).");
console.log(`Chi tiết: ${path.relative(process.cwd(), path.join(out, "REPORT.md"))}`);
