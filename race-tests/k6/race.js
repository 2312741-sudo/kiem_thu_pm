// Bắn đồng loạt một tập request (mỗi VU đúng 1 request) để tạo race condition.
// Danh sách request do src/run.mjs sinh ra, truyền vào qua biến môi trường REQUESTS_FILE.
import encoding from "k6/encoding";
import exec from "k6/execution";
import http from "k6/http";
import { sleep } from "k6";

const requests = JSON.parse(open(__ENV.REQUESTS_FILE));
const startAt = Number(__ENV.START_AT || 0);

export const options = {
  scenarios: {
    race: {
      executor: "per-vu-iterations",
      vus: requests.length,
      iterations: 1,
      maxDuration: "5m",
    },
  },
  summaryTrendStats: ["min", "avg", "med", "p(90)", "p(95)", "max"],
};

export default function () {
  const index = exec.vu.idInTest - 1;
  const req = requests[index];

  // Rào chắn thời gian: mọi VU chờ tới cùng một mốc rồi mới gửi, để các request thực sự chồng nhau.
  // delayMs > 0 dùng để đo độ rộng cửa sổ race (request thứ i gửi trễ i×Δ ms).
  const waitMs = startAt + (req.delayMs || 0) - Date.now();
  if (waitMs > 0) sleep(waitMs / 1000);

  const sentAt = Date.now();
  const res = http.request(req.method, req.url, JSON.stringify(req.body), {
    headers: req.headers,
    timeout: "120s",
    tags: { label: req.label },
    responseCallback: http.expectedStatuses({ min: 200, max: 499 }),
  });

  let message = null;
  let uid = null;
  try {
    const json = res.json();
    message = json.message ?? null;
    uid = json.uid ?? json.bookingUid ?? null;
  } catch (_e) {
    message = (res.body || "").slice(0, 200);
  }

  // base64 để log console của k6 không làm hỏng JSON (k6 escape dấu nháy trong msg="...")
  const result = {
    index,
    label: req.label,
    status: res.status,
    error: res.error || null,
    message,
    uid,
    sentAt,
    durationMs: Math.round(res.timings.duration),
  };
  console.log("K15RESULT " + encoding.b64encode(JSON.stringify(result)));
}

export function handleSummary(data) {
  return { [__ENV.SUMMARY_FILE]: JSON.stringify(data, null, 2) };
}
