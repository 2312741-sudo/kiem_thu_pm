import { bookingRequest, cancelRequest, mustBook } from "./api.mjs";
import {
  activeBookingsBetween,
  bookingByUid,
  overlappingPairs,
  rescheduledChildren,
  seatsForSlot,
} from "./db.mjs";

const MIN = 60_000;
const HOUR = 60 * MIN;

const ok = (results) => results.filter((r) => r.status === 200);
const email = (scenario, round, i) => `${scenario.toLowerCase()}-r${round}-u${i}@k15.test`;

// I7 áp dụng cho mọi scenario: không 5xx, không lỗi kết nối/timeout.
function checkNoServerErrors(results) {
  return results
    .filter((r) => r.status >= 500 || r.status === 0 || r.error)
    .map((r) => ({
      invariant: "I7",
      detail: `Request #${r.index} (${r.label}) trả về ${r.status || "không phản hồi"}: ${r.error || r.message}`,
    }));
}

function checkNoOverlap(pairs) {
  if (pairs.length === 0) return [];
  const bookings = new Map();
  for (const p of pairs) {
    bookings.set(p.a_uid, `${iso(p.a_start)}–${iso(p.a_end)} ${p.a_status}`);
    bookings.set(p.b_uid, `${iso(p.b_start)}–${iso(p.b_end)} ${p.b_status}`);
  }
  const list = [...bookings.entries()].map(([uid, span]) => `${uid.slice(0, 8)}(${span})`);
  return [
    {
      invariant: "I1",
      detail: `${pairs.length} cặp chồng giờ giữa ${bookings.size} booking active: ${list.join(", ")}`,
    },
  ];
}

const iso = (d) => new Date(d).toISOString().slice(11, 16);

export const scenarios = [
  {
    id: "S1",
    title: "Nhiều người cùng đặt đúng một slot (event 1-1)",
    invariant: "I1 – host không có 2 booking active chồng giờ",
    defaultN: 10,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-30"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: base, email: email("S1", round, i), label: `book-${i}` })
      );
      return { requests, window: [base, new Date(+base + 30 * MIN)] };
    },
    async verify({ fx, ctx, results }) {
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      const violations = checkNoOverlap(await overlappingPairs(fx.hostId, ...ctx.window));
      if (ok(results).length > 1) {
        violations.push({ invariant: "I1", detail: `${ok(results).length} request cùng nhận HTTP 200 cho một slot` });
      }
      return { violations, observed: { success: ok(results).length, activeBookings: active.length } };
    },
  },
  {
    id: "S2",
    title: "Đặt đồng thời các slot chồng lấn nhưng lệch giờ bắt đầu / khác event type",
    invariant: "I1 – host không có 2 booking active chồng giờ",
    defaultN: 10,
    async prepare({ fx, round, base, n }) {
      const short = fx.eventTypes["k15-30"];
      const long = fx.eventTypes["k15-60"];
      // Mọi khoảng [start, start+len) đều chứa mốc base+29', nên mọi cặp đều chồng nhau.
      const requests = Array.from({ length: n }, (_, i) => {
        const useLong = i % 3 === 2;
        const offset = (i % 10) * 3 * MIN;
        const start = useLong ? new Date(+base - 30 * MIN + offset) : new Date(+base + offset);
        return bookingRequest({
          eventType: useLong ? long : short,
          start,
          email: email("S2", round, i),
          label: `${useLong ? "60" : "30"}m@+${Math.round((start - base) / MIN)}`,
        });
      });
      return { requests, window: [new Date(+base - HOUR), new Date(+base + 2 * HOUR)] };
    },
    async verify({ fx, ctx, results }) {
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      const violations = checkNoOverlap(await overlappingPairs(fx.hostId, ...ctx.window));
      return { violations, observed: { success: ok(results).length, activeBookings: active.length } };
    },
  },
  {
    id: "S3",
    title: "Tranh chấp ghế đầu tiên của event có ghế (seated, 3 chỗ, slot đang trống)",
    invariant: "I2 – không vượt 3 ghế; I2b – còn ghế thì không được từ chối người đặt",
    defaultN: 6,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-seated"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: base, email: email("S3", round, i), label: `seat-${i}` })
      );
      return { requests, et, base, n };
    },
    async verify({ ctx, results }) {
      const rows = await seatsForSlot(ctx.et.id, ctx.base);
      const active = rows.filter((r) => r.status === "accepted");
      const totalSeats = active.reduce((s, r) => s + Math.max(r.seats, r.attendees), 0);
      const capacity = ctx.et.seatsPerTimeSlot;
      const expectedSuccess = Math.min(ctx.n, capacity);
      const violations = [];
      if (totalSeats > capacity) {
        violations.push({ invariant: "I2", detail: `Slot có ${totalSeats} ghế > sức chứa ${capacity}` });
      }
      if (active.length > 1) {
        violations.push({ invariant: "I2", detail: `Slot seated bị tách thành ${active.length} booking riêng` });
      }
      if (ok(results).length < expectedSuccess) {
        const rejected = results.filter((r) => r.status !== 200).map((r) => `${r.status}:${r.message}`);
        violations.push({
          invariant: "I2b",
          detail: `Chỉ ${ok(results).length}/${expectedSuccess} người đặt được dù slot còn ghế; bị từ chối: ${[...new Set(rejected)].join(", ")}`,
        });
      }
      return { violations, observed: { success: ok(results).length, seats: totalSeats, bookingsForSlot: active.length } };
    },
  },
  {
    id: "S4",
    title: "Nhiều người cùng giành 2 ghế còn lại của slot seated đã có 1 người",
    invariant: "I2 – không vượt 3 ghế; I2b – đúng 2 người được nhận",
    defaultN: 6,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-seated"];
      await mustBook({ eventType: et, start: base, email: email("S4", round, "seed") });
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: base, email: email("S4", round, i), label: `seat-${i}` })
      );
      return { requests, et, base, n };
    },
    async verify({ ctx, results }) {
      const rows = await seatsForSlot(ctx.et.id, ctx.base);
      const active = rows.filter((r) => r.status === "accepted");
      const totalSeats = active.reduce((s, r) => s + r.seats, 0);
      const capacity = ctx.et.seatsPerTimeSlot;
      const expectedSuccess = Math.min(ctx.n, capacity - 1);
      const violations = [];
      if (totalSeats > capacity) {
        violations.push({ invariant: "I2", detail: `Slot có ${totalSeats} ghế > sức chứa ${capacity}` });
      }
      if (ok(results).length !== expectedSuccess) {
        violations.push({
          invariant: "I2b",
          detail: `${ok(results).length} request thành công, kỳ vọng đúng ${expectedSuccess}`,
        });
      }
      return { violations, observed: { success: ok(results).length, seats: totalSeats } };
    },
  },
  {
    id: "S5",
    title: "Nhiều người cùng đặt một slot của event cần xác nhận (PENDING giữ chỗ)",
    invariant: "I3 – tối đa 1 booking accepted/pending cho một slot",
    defaultN: 10,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-confirm"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: base, email: email("S5", round, i), label: `pending-${i}` })
      );
      return { requests, window: [base, new Date(+base + 30 * MIN)] };
    },
    async verify({ fx, ctx, results }) {
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      const violations = checkNoOverlap(await overlappingPairs(fx.hostId, ...ctx.window)).map((v) => ({
        ...v,
        invariant: "I3",
      }));
      return {
        violations,
        observed: { success: ok(results).length, activeBookings: active.length, statuses: active.map((b) => b.status) },
      };
    },
  },
  {
    id: "S6",
    title: "Đổi lịch (reschedule) đồng thời cùng một booking sang nhiều slot khác nhau",
    invariant: "I4 – một booking gốc sinh tối đa 1 booking mới còn hiệu lực",
    defaultN: 5,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-30"];
      const attendee = email("S6", round, "owner");
      const original = await mustBook({ eventType: et, start: base, email: attendee });
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({
          eventType: et,
          start: new Date(+base + (i + 1) * HOUR),
          email: attendee,
          rescheduleUid: original.uid,
          label: `reschedule->+${i + 1}h`,
        })
      );
      return { requests, originalUid: original.uid };
    },
    async verify({ ctx, results }) {
      const original = await bookingByUid(ctx.originalUid);
      const children = await rescheduledChildren(ctx.originalUid);
      const alive = children.filter((c) => c.status === "accepted" || c.status === "pending");
      const violations = [];
      if (alive.length > 1) {
        violations.push({
          invariant: "I4",
          detail: `Booking gốc ${ctx.originalUid} sinh ra ${alive.length} booking mới cùng ACCEPTED: ${alive.map((c) => iso(c.startTime)).join(", ")}`,
        });
      }
      if (alive.length >= 1 && original.status !== "cancelled") {
        violations.push({ invariant: "I4", detail: `Đã có booking mới nhưng booking gốc vẫn ${original.status}` });
      }
      return {
        violations,
        observed: { success: ok(results).length, aliveChildren: alive.length, originalStatus: original.status },
      };
    },
  },
  {
    id: "S7",
    title: "Hủy và đổi lịch cùng lúc trên một booking",
    invariant: "I5 – nếu lệnh hủy báo thành công thì không còn booking nào của cuộc hẹn đó active",
    defaultN: 2,
    async prepare({ fx, round, base }) {
      const et = fx.eventTypes["k15-30"];
      const attendee = email("S7", round, "owner");
      const original = await mustBook({ eventType: et, start: base, email: attendee });
      const requests = [
        cancelRequest({ uid: original.uid, label: "cancel" }),
        bookingRequest({
          eventType: et,
          start: new Date(+base + 2 * HOUR),
          email: attendee,
          rescheduleUid: original.uid,
          label: "reschedule->+2h",
        }),
      ];
      return { requests, originalUid: original.uid };
    },
    async verify({ ctx, results }) {
      const cancel = results.find((r) => r.label === "cancel");
      const resched = results.find((r) => r.label !== "cancel");
      const children = await rescheduledChildren(ctx.originalUid);
      const alive = children.filter((c) => c.status === "accepted" || c.status === "pending");
      const violations = [];
      if (cancel?.status === 200 && alive.length > 0) {
        violations.push({
          invariant: "I5",
          detail: `Hủy trả 200 nhưng vẫn còn booking active ${alive.map((c) => c.uid).join(", ")} (reschedule trả ${resched?.status})`,
        });
      }
      return {
        violations,
        observed: { cancel: cancel?.status, reschedule: resched?.status, aliveChildren: alive.length },
      };
    },
  },
  {
    id: "S8",
    title: "Vượt giới hạn 1 booking/ngày khi đặt đồng thời nhiều giờ khác nhau",
    invariant: "I6 – số booking active trong ngày ≤ bookingLimits.PER_DAY (=1)",
    defaultN: 8,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-limit"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({
          eventType: et,
          start: new Date(+base + i * HOUR),
          email: email("S8", round, i),
          label: `limit@+${i}h`,
        })
      );
      const dayStart = new Date(base);
      dayStart.setUTCHours(0, 0, 0, 0);
      return { requests, window: [dayStart, new Date(+dayStart + 24 * HOUR)] };
    },
    async verify({ fx, ctx, results }) {
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      const violations = [];
      if (active.length > 1) {
        violations.push({
          invariant: "I6",
          detail: `${active.length} booking active trong cùng ngày, giới hạn là 1: ${active.map((b) => iso(b.startTime)).join(", ")}`,
        });
      }
      return { violations, observed: { success: ok(results).length, activeBookings: active.length } };
    },
  },
];

export { checkNoServerErrors };
