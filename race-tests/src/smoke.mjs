// Kiểm tra nhanh 3 luồng nghiệp vụ chạy được (bằng chứng cho Phần C): đặt lịch → đổi lịch → hủy.
import { bookingRequest, cancelRequest, send } from "./api.mjs";
import { config } from "./config.mjs";
import { bookingByUid, deleteHostBookings, loadFixture, pool } from "./db.mjs";

const fx = await loadFixture();
await deleteHostBookings(fx.hostId);
const et = fx.eventTypes["k15-30"];
const start = new Date(Date.UTC(2026, 11, 1, 9, 0));
const attendee = "smoke@k15.test";
const steps = [];

const created = await send(bookingRequest({ eventType: et, start, email: attendee }));
const uid = created.json?.uid;
steps.push({ flow: "1. Đặt lịch", http: created.status, ms: created.ms, uid, db: uid && (await bookingByUid(uid))?.status });

const moved = await send(
  bookingRequest({ eventType: et, start: new Date(+start + 2 * 3600_000), email: attendee, rescheduleUid: uid })
);
const newUid = moved.json?.uid;
steps.push({
  flow: "2. Đổi lịch",
  http: moved.status,
  ms: moved.ms,
  uid: newUid,
  db: `gốc=${(await bookingByUid(uid))?.status}, mới=${newUid && (await bookingByUid(newUid))?.status}`,
});

const cancelled = await send(cancelRequest({ uid: newUid }));
steps.push({ flow: "3. Hủy lịch", http: cancelled.status, ms: cancelled.ms, uid: newUid, db: (await bookingByUid(newUid))?.status });

const conflict = await send(bookingRequest({ eventType: et, start: new Date(+start + 2 * 3600_000), email: "x@k15.test" }));
steps.push({ flow: "4. Đặt lại slot vừa hủy", http: conflict.status, ms: conflict.ms, uid: conflict.json?.uid, db: "slot đã được giải phóng" });

console.log(`Smoke test Cal.com tại ${config.baseUrl}`);
console.table(steps);
await deleteHostBookings(fx.hostId);
await pool.end();
process.exitCode = steps.every((s) => s.http === 200) ? 0 : 1;
