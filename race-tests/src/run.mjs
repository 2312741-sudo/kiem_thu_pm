// Điều phối: chuẩn bị dữ liệu → bắn race bằng k6 → kiểm invariant trực tiếp trên PostgreSQL → ghi kết quả.
// Dùng: node src/run.mjs [--mode race|sequential] [--scenarios S1,S6] [--rounds 10] [--n 10] [--stagger ms]
// --mode sequential gửi đúng tập request đó nhưng lần lượt từng cái: nhóm đối chứng để tách lỗi race
// khỏi lỗi logic thông thường (nếu tuần tự cũng vi phạm thì nguyên nhân không phải do đồng thời).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { send } from "./api.mjs";
import { config } from "./config.mjs";
import { deleteHostBookings, loadFixture, pool } from "./db.mjs";
import { writeReport } from "./report.mjs";
import { checkNoServerErrors, scenarios } from "./scenarios.mjs";

const DAY = 24 * 60 * 60_000;
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const { values: args } = parseArgs({
  options: {
    scenarios: { type: "string", default: scenarios.map((s) => s.id).join(",") },
    mode: { type: "string", default: "race" },
    rounds: { type: "string", default: "10" },
    n: { type: "string" },
    stagger: { type: "string", default: "0" },
    out: { type: "string" },
  },
});

const selected = args.scenarios.split(",").map((id) => {
  const s = scenarios.find((x) => x.id === id.trim().toUpperCase());
  if (!s) throw new Error(`Không có scenario ${id}`);
  return s;
});
const rounds = Number(args.rounds);
const mode = args.mode;
if (!["race", "sequential"].includes(mode)) throw new Error(`--mode phải là race hoặc sequential`);
const runId = `${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}-${mode}`;
const outDir = path.resolve(args.out ?? path.join(root, "results", runId));
fs.mkdirSync(path.join(outDir, "raw"), { recursive: true });

function runK6(requests, tag) {
  const requestsFile = path.join(outDir, "raw", `${tag}.requests.json`);
  const consoleFile = path.join(outDir, "raw", `${tag}.console.log`);
  const summaryFile = path.join(outDir, "raw", `${tag}.k6-summary.json`);
  fs.writeFileSync(requestsFile, JSON.stringify(requests, null, 2));
  fs.rmSync(consoleFile, { force: true });

  const proc = spawnSync(
    config.k6Bin,
    ["run", "--quiet", "--no-usage-report", "--console-output", consoleFile, path.join(root, "k6", "race.js")],
    {
      env: {
        ...process.env,
        REQUESTS_FILE: requestsFile,
        SUMMARY_FILE: summaryFile,
        // để k6 kịp khởi tạo hết VU trước khi tất cả cùng bắn
        START_AT: String(Date.now() + 1500),
      },
      encoding: "utf8",
    }
  );
  if (proc.status !== 0) {
    throw new Error(`k6 lỗi (exit ${proc.status}): ${proc.stderr || proc.stdout}`);
  }
  const results = fs
    .readFileSync(consoleFile, "utf8")
    .split("\n")
    .map((line) => line.match(/K15RESULT ([A-Za-z0-9+/=]+)/))
    .filter(Boolean)
    .map((m) => JSON.parse(Buffer.from(m[1], "base64").toString("utf8")))
    .sort((a, b) => a.index - b.index);
  if (results.length !== requests.length) {
    throw new Error(`k6 chỉ trả về ${results.length}/${requests.length} kết quả (xem ${consoleFile})`);
  }
  return results;
}

async function runSequential(requests) {
  const results = [];
  for (const [index, req] of requests.entries()) {
    const sentAt = Date.now();
    const res = await send(req);
    results.push({
      index,
      label: req.label,
      status: res.status,
      error: null,
      message: res.json?.message ?? null,
      uid: res.json?.uid ?? res.json?.bookingUid ?? null,
      sentAt,
      durationMs: res.ms,
    });
  }
  return results;
}

async function main() {
  const fx = await loadFixture();
  await deleteHostBookings(fx.hostId);
  console.log(`Run ${runId} → ${path.relative(process.cwd(), outDir)}`);
  console.log(`Cal.com: ${config.baseUrl} | host id ${fx.hostId} | chế độ ${mode} | ${rounds} vòng/scenario\n`);

  const summary = { runId, mode, stagger: Number(args.stagger), startedAt: new Date().toISOString(), baseUrl: config.baseUrl, rounds, scenarios: [] };

  for (const scenario of selected) {
    const n = Number(args.n ?? scenario.defaultN);
    const scenarioIndex = scenarios.indexOf(scenario);
    const record = { id: scenario.id, title: scenario.title, invariant: scenario.invariant, n, rounds: [] };
    process.stdout.write(`${scenario.id} ${scenario.title}\n   `);

    for (let round = 1; round <= rounds; round++) {
      const base = new Date(config.slotEpoch + (scenarioIndex * 100 + round) * DAY);
      const ctx = await scenario.prepare({ fx, round, base, n });
      ctx.requests.forEach((req, i) => {
        req.delayMs = i * Number(args.stagger);
      });
      const results =
        mode === "race" ? runK6(ctx.requests, `${scenario.id}-r${round}`) : await runSequential(ctx.requests);
      const { violations, observed } = await scenario.verify({ fx, ctx, results });
      violations.push(...checkNoServerErrors(results));

      const spreadMs = Math.max(...results.map((r) => r.sentAt)) - Math.min(...results.map((r) => r.sentAt));
      record.rounds.push({
        round,
        slot: base.toISOString(),
        pass: violations.length === 0,
        violations,
        observed,
        statusCounts: results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {}),
        messages: [...new Set(results.filter((r) => r.status !== 200).map((r) => `${r.status} ${r.message}`))],
        sendSpreadMs: spreadMs,
        latencyMs: results.map((r) => r.durationMs),
      });
      process.stdout.write(violations.length === 0 ? "." : "F");
    }

    const failed = record.rounds.filter((r) => !r.pass).length;
    record.failedRounds = failed;
    record.verdict = failed === 0 ? "PASS" : "FAIL";
    summary.scenarios.push(record);
    console.log(`  ${record.verdict} (${failed}/${rounds} vòng vi phạm)`);
  }

  summary.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
  const reportPath = writeReport(outDir);
  // Thí nghiệm phụ (có --out riêng) không được ghi đè kết quả chuẩn.
  if (!args.out) {
    const latest = path.join(root, "results", `latest-${mode}`);
    fs.rmSync(latest, { force: true, recursive: true });
    fs.cpSync(outDir, latest, { recursive: true });
  }
  console.log(`\nBáo cáo: ${path.relative(process.cwd(), reportPath)}`);
  await pool.end();
  process.exitCode = summary.scenarios.some((s) => s.verdict === "FAIL") ? 1 : 0;
}

main().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(2);
});
