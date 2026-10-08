// Đo độ rộng cửa sổ race: chạy một scenario với 2 request, request thứ hai gửi trễ Δ ms,
// rồi ghi tỉ lệ vòng vi phạm theo từng Δ.
// Dùng: node src/window.mjs [--scenario S2] [--rounds 10] [--deltas 0,25,50,100,200,400,800]
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { values: args } = parseArgs({
  options: {
    scenario: { type: "string", default: "S2" },
    rounds: { type: "string", default: "10" },
    deltas: { type: "string", default: "0,25,50,100,200,400,800" },
  },
});

const outRoot = path.join(root, "results", `window-${args.scenario}`);
const rows = [];
for (const delta of args.deltas.split(",").map(Number)) {
  const out = path.join(outRoot, `delta-${delta}ms`);
  spawnSync(
    process.execPath,
    [path.join(root, "src", "run.mjs"), "--scenarios", args.scenario, "--n", "2", "--rounds", args.rounds, "--stagger", String(delta), "--out", out],
    { stdio: "ignore" }
  );
  const summary = JSON.parse(fs.readFileSync(path.join(out, "summary.json"), "utf8"));
  const s = summary.scenarios[0];
  const latency = s.rounds.flatMap((r) => r.latencyMs);
  rows.push({
    deltaMs: delta,
    violatedRounds: `${s.failedRounds}/${s.rounds.length}`,
    rate: `${Math.round((100 * s.failedRounds) / s.rounds.length)}%`,
    medianLatencyMs: latency.sort((a, b) => a - b)[Math.floor(latency.length / 2)],
  });
  console.log(rows.at(-1));
}

const md = [
  `# Độ rộng cửa sổ race – ${args.scenario}`,
  "",
  "2 request xung đột, request thứ hai gửi trễ Δ ms so với request thứ nhất.",
  "",
  "| Δ (ms) | Vòng vi phạm | Tỉ lệ | Latency trung vị (ms) |",
  "|---|---|---|---|",
  ...rows.map((r) => `| ${r.deltaMs} | ${r.violatedRounds} | ${r.rate} | ${r.medianLatencyMs} |`),
  "",
].join("\n");
fs.writeFileSync(path.join(outRoot, "WINDOW.md"), md);
console.log(md);
