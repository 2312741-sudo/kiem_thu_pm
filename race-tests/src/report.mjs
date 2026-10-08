// Sinh REPORT.md từ summary.json của một lần chạy. Gọi trực tiếp: node src/report.mjs [thư-mục-kết-quả]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const percentile = (values, p) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
};

export function writeReport(outDir) {
  const summary = JSON.parse(fs.readFileSync(path.join(outDir, "summary.json"), "utf8"));
  const lines = [];
  const modeLabel = summary.mode === "sequential" ? "tuần tự (nhóm đối chứng)" : "đồng thời (race, k6)";
  lines.push(`# Kết quả chạy race test – ${summary.runId}`, "");
  lines.push(`- Chế độ gửi request: **${modeLabel}**`);
  lines.push(`- Hệ thống: Cal.com v6.2.0 tại ${summary.baseUrl}`);
  lines.push(`- Bắt đầu: ${summary.startedAt} · Kết thúc: ${summary.finishedAt}`);
  lines.push(`- Số vòng mỗi scenario: ${summary.rounds}`, "");

  lines.push("## Tổng hợp", "");
  lines.push("| Scenario | Mô tả | N đồng thời | Vòng vi phạm | Tỉ lệ | Kết luận | Độ lệch gửi TB (ms) | p95 latency (ms) |");
  lines.push("|---|---|---|---|---|---|---|---|");
  for (const s of summary.scenarios) {
    const latencies = s.rounds.flatMap((r) => r.latencyMs);
    const spread = Math.round(s.rounds.reduce((a, r) => a + r.sendSpreadMs, 0) / s.rounds.length);
    const rate = Math.round((s.failedRounds / s.rounds.length) * 100);
    lines.push(
      `| ${s.id} | ${s.title} | ${s.n} | ${s.failedRounds}/${s.rounds.length} | ${rate}% | **${s.verdict}** | ${spread} | ${percentile(latencies, 95)} |`
    );
  }
  lines.push("");

  for (const s of summary.scenarios) {
    lines.push(`## ${s.id} – ${s.title}`, "", `Invariant: ${s.invariant}`, "");
    lines.push("| Vòng | Slot | Kết quả | HTTP | Quan sát | Thông điệp lỗi |");
    lines.push("|---|---|---|---|---|---|");
    for (const r of s.rounds) {
      const http = Object.entries(r.statusCounts)
        .map(([code, count]) => `${code}×${count}`)
        .join(" ");
      lines.push(
        `| ${r.round} | ${r.slot.slice(0, 16)} | ${r.pass ? "PASS" : "**FAIL**"} | ${http} | ${JSON.stringify(r.observed).replace(/\|/g, "/")} | ${r.messages.join("; ")} |`
      );
    }
    const violations = s.rounds.flatMap((r) => r.violations.map((v) => ({ ...v, round: r.round })));
    if (violations.length > 0) {
      lines.push("", "Vi phạm ghi nhận:", "");
      for (const v of violations) lines.push(`- Vòng ${v.round} · ${v.invariant}: ${v.detail}`);
    }
    lines.push("");
  }

  const reportPath = path.join(outDir, "REPORT.md");
  fs.writeFileSync(reportPath, lines.join("\n"));
  return reportPath;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const dir = process.argv[2] ?? path.join(root, "results", "latest-race");
  console.log(writeReport(dir));
}
