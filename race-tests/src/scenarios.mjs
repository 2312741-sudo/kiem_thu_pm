import { bookingRequest, cancelRequest, mustBook } from "./api.mjs";
import {
  activeBookingsBetween,
  activeByAttendee,
  activeByEventType,
  attendeeRows,
  bookingByUid,
  overlappingPairs,
  rescheduledChildren,
  seatsForSlot,
} from "./db.mjs";

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

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
  {
    id: "S9",
    title: "Hai booking khác nhau cùng được đổi lịch sang đúng một slot trống",
    invariant: "I1 – host không có 2 booking active chồng giờ",
    defaultN: 2,
    async prepare({ fx, round, base }) {
      const et = fx.eventTypes["k15-30"];
      const target = new Date(+base + 6 * HOUR);
      const a = await mustBook({ eventType: et, start: new Date(+base + HOUR), email: email("S9", round, "a") });
      const b = await mustBook({ eventType: et, start: new Date(+base + 3 * HOUR), email: email("S9", round, "b") });
      const requests = [
        bookingRequest({ eventType: et, start: target, email: email("S9", round, "a"), rescheduleUid: a.uid, label: "reschedule-A" }),
        bookingRequest({ eventType: et, start: target, email: email("S9", round, "b"), rescheduleUid: b.uid, label: "reschedule-B" }),
      ];
      return { requests, window: [target, new Date(+target + 30 * MIN)] };
    },
    async verify({ fx, ctx, results }) {
      const violations = checkNoOverlap(await overlappingPairs(fx.hostId, ...ctx.window));
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      return { violations, observed: { success: ok(results).length, activeAtTarget: active.length } };
    },
  },
  {
    id: "S10",
    title: "Đổi lịch một booking sang slot X đúng lúc có người đặt mới vào slot X",
    invariant: "I1 – host không có 2 booking active chồng giờ",
    defaultN: 2,
    async prepare({ fx, round, base }) {
      const et = fx.eventTypes["k15-30"];
      const target = new Date(+base + 6 * HOUR);
      const a = await mustBook({ eventType: et, start: new Date(+base + HOUR), email: email("S10", round, "a") });
      const requests = [
        bookingRequest({ eventType: et, start: target, email: email("S10", round, "a"), rescheduleUid: a.uid, label: "reschedule-A" }),
        bookingRequest({ eventType: et, start: target, email: email("S10", round, "new"), label: "book-new" }),
      ];
      return { requests, window: [target, new Date(+target + 30 * MIN)] };
    },
    async verify({ fx, ctx, results }) {
      const violations = checkNoOverlap(await overlappingPairs(fx.hostId, ...ctx.window));
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      return { violations, observed: { success: ok(results).length, activeAtTarget: active.length } };
    },
  },
  {
    id: "S11",
    title: "Đặt các slot sát nhau trong khi event có thời gian đệm (buffer) 30 phút sau cuộc hẹn",
    invariant: "I8 – hai booking liền kề của host cách nhau ≥ buffer (30 phút)",
    defaultN: 6,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-buffer"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: new Date(+base + i * 30 * MIN), email: email("S11", round, i), label: `buffer@+${i * 30}m` })
      );
      return { requests, et, window: [base, new Date(+base + n * 30 * MIN + HOUR)] };
    },
    async verify({ ctx, results }) {
      const rows = await activeByEventType(ctx.et.id, ...ctx.window);
      const violations = [];
      for (let i = 1; i < rows.length; i++) {
        const gap = (+rows[i].startTime - +rows[i - 1].endTime) / MIN;
        if (gap < 30) {
          violations.push({
            invariant: "I8",
            detail: `Booking ${iso(rows[i - 1].startTime)} và ${iso(rows[i].startTime)} chỉ cách nhau ${gap} phút (buffer yêu cầu 30)`,
          });
        }
      }
      return { violations, observed: { success: ok(results).length, activeBookings: rows.length } };
    },
  },
  {
    id: "S12",
    title: "Vượt giới hạn tổng thời lượng 30 phút/ngày khi đặt đồng thời nhiều giờ khác nhau",
    invariant: "I9 – tổng thời lượng booking active trong ngày ≤ durationLimits.PER_DAY (30 phút)",
    defaultN: 6,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-duration"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: new Date(+base + i * HOUR), email: email("S12", round, i), label: `duration@+${i}h` })
      );
      const dayStart = new Date(base);
      dayStart.setUTCHours(0, 0, 0, 0);
      return { requests, et, window: [dayStart, new Date(+dayStart + 24 * HOUR)] };
    },
    async verify({ ctx, results }) {
      const rows = await activeByEventType(ctx.et.id, ...ctx.window);
      const minutes = rows.reduce((s, r) => s + (+r.endTime - +r.startTime) / MIN, 0);
      const violations =
        minutes > 30
          ? [{ invariant: "I9", detail: `Tổng thời lượng ${minutes} phút trong ngày (${rows.length} booking), giới hạn 30 phút` }]
          : [];
      return { violations, observed: { success: ok(results).length, activeBookings: rows.length, minutes } };
    },
  },
  {
    id: "S13",
    title: "Vượt giới hạn 1 booking/tuần khi đặt đồng thời vào các ngày khác nhau trong tuần",
    invariant: "I6 – số booking active trong tuần ≤ bookingLimits.PER_WEEK (=1)",
    defaultN: 6,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-week"];
      // Cách nhau đúng 7 ngày giữa các vòng để mỗi vòng nằm trong một tuần riêng.
      const shifted = new Date(+base + 6 * round * DAY);
      const monday = new Date(shifted);
      monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
      monday.setUTCHours(9, 0, 0, 0);
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: new Date(+monday + i * DAY), email: email("S13", round, i), label: `week@day+${i}` })
      );
      const weekStart = new Date(monday);
      weekStart.setUTCHours(0, 0, 0, 0);
      return { requests, et, window: [weekStart, new Date(+weekStart + 7 * DAY)] };
    },
    async verify({ ctx, results }) {
      const rows = await activeByEventType(ctx.et.id, ...ctx.window);
      const violations =
        rows.length > 1
          ? [{ invariant: "I6", detail: `${rows.length} booking active trong cùng tuần, giới hạn là 1` }]
          : [];
      return { violations, observed: { success: ok(results).length, activeBookings: rows.length } };
    },
  },
  {
    id: "S14",
    title: "Một người đặt nhiều slot cùng lúc khi event giới hạn 1 booking đang hoạt động cho mỗi người đặt",
    invariant: "I10 – một người đặt có tối đa maxActiveBookingsPerBooker (=1) booking active",
    defaultN: 6,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-booker"];
      const who = email("S14", round, "same");
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: new Date(+base + i * HOUR), email: who, label: `booker@+${i}h` })
      );
      return { requests, et, who };
    },
    async verify({ ctx, results }) {
      const rows = await activeByAttendee(ctx.et.id, ctx.who);
      const violations =
        rows.length > 1
          ? [{ invariant: "I10", detail: `Cùng một người đặt có ${rows.length} booking active, giới hạn là 1` }]
          : [];
      return { violations, observed: { success: ok(results).length, activeBookings: rows.length } };
    },
  },
  {
    id: "S15",
    title: "Hủy cùng một booking nhiều lần đồng thời (bấm hủy hai lần, nhiều tab)",
    invariant: "I5 – đúng 1 lệnh hủy thành công, các lệnh còn lại bị từ chối; booking cuối cùng ở trạng thái cancelled",
    defaultN: 6,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-30"];
      const original = await mustBook({ eventType: et, start: base, email: email("S15", round, "owner") });
      const requests = Array.from({ length: n }, (_, i) => cancelRequest({ uid: original.uid, label: `cancel-${i}` }));
      return { requests, originalUid: original.uid };
    },
    async verify({ ctx, results }) {
      const booking = await bookingByUid(ctx.originalUid);
      const successes = ok(results).length;
      const violations = [];
      if (successes !== 1) {
        violations.push({ invariant: "I5", detail: `${successes} lệnh hủy cùng nhận HTTP 200 cho một booking (kỳ vọng đúng 1: mỗi lần 200 là một lần gửi mail/webhook hủy)` });
      }
      if (booking.status !== "cancelled") {
        violations.push({ invariant: "I5", detail: `Sau khi hủy booking vẫn ở trạng thái ${booking.status}` });
      }
      return { violations, observed: { success: successes, finalStatus: booking.status } };
    },
  },
  {
    id: "S16",
    title: "Cùng một người đặt nhiều lần đồng thời vào slot có ghế (không được chiếm nhiều ghế)",
    invariant: "I11 – một email chỉ chiếm tối đa 1 ghế trong một slot",
    defaultN: 6,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-seated"];
      const first = await mustBook({ eventType: et, start: base, email: email("S16", round, "first") });
      const who = email("S16", round, "dup");
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: base, email: who, label: `dup-${i}` })
      );
      return { requests, firstUid: first.uid, who };
    },
    async verify({ ctx, results }) {
      const seats = await attendeeRows(ctx.firstUid, ctx.who);
      const violations =
        seats > 1 ? [{ invariant: "I11", detail: `Email ${ctx.who} chiếm ${seats} ghế trong cùng một slot` }] : [];
      return { violations, observed: { success: ok(results).length, seatsOfSameEmail: seats } };
    },
  },
  {
    id: "S17",
    title: "Hai event type khác độ dài cùng đặt đúng một giờ bắt đầu của cùng host",
    invariant: "I1 – host không có 2 booking active chồng giờ",
    defaultN: 10,
    async prepare({ fx, round, base, n }) {
      const short = fx.eventTypes["k15-30"];
      const long = fx.eventTypes["k15-60"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: i % 2 ? long : short, start: base, email: email("S17", round, i), label: `${i % 2 ? "60" : "30"}m-${i}` })
      );
      return { requests, window: [base, new Date(+base + HOUR)] };
    },
    async verify({ fx, ctx, results }) {
      const violations = checkNoOverlap(await overlappingPairs(fx.hostId, ...ctx.window));
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      return { violations, observed: { success: ok(results).length, activeBookings: active.length } };
    },
  },
  {
    id: "S18",
    title: "Tải cao: 30 người cùng đặt đúng một slot",
    invariant: "I1 – không chồng giờ; I7 – không lỗi 5xx / hết kết nối khi tải cao",
    defaultN: 30,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-30"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: base, email: email("S18", round, i), label: `book-${i}` })
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
    id: "S19",
    title: "20 người đặt 20 slot khác nhau không chồng nhau cùng lúc (không được từ chối nhầm)",
    invariant: "I12 – slot độc lập không ảnh hưởng nhau: mọi request hợp lệ đều thành công",
    defaultN: 20,
    async prepare({ fx, round, base, n }) {
      const et = fx.eventTypes["k15-30"];
      const requests = Array.from({ length: n }, (_, i) =>
        bookingRequest({ eventType: et, start: new Date(+base + i * 30 * MIN), email: email("S19", round, i), label: `slot-${i}` })
      );
      return { requests, window: [base, new Date(+base + n * 30 * MIN)], n };
    },
    async verify({ fx, ctx, results }) {
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      const violations = [];
      const rejected = results.filter((r) => r.status !== 200);
      if (rejected.length > 0) {
        violations.push({
          invariant: "I12",
          detail: `${rejected.length}/${ctx.n} request hợp lệ bị từ chối: ${[...new Set(rejected.map((r) => `${r.status} ${r.message}`))].join("; ")}`,
        });
      }
      if (active.length !== ok(results).length) {
        violations.push({ invariant: "I12", detail: `${ok(results).length} request 200 nhưng CSDL có ${active.length} booking` });
      }
      return { violations, observed: { success: ok(results).length, activeBookings: active.length } };
    },
  },
  {
    id: "S20",
    title: "Hủy booking cũ và đặt booking mới vào đúng slot đó cùng lúc",
    invariant: "I1 – host không có 2 booking active chồng giờ",
    defaultN: 2,
    async prepare({ fx, round, base }) {
      const et = fx.eventTypes["k15-30"];
      const old = await mustBook({ eventType: et, start: base, email: email("S20", round, "old") });
      const requests = [
        cancelRequest({ uid: old.uid, label: "cancel-old" }),
        bookingRequest({ eventType: et, start: base, email: email("S20", round, "new"), label: "book-new" }),
      ];
      return { requests, window: [base, new Date(+base + 30 * MIN)] };
    },
    async verify({ fx, ctx, results }) {
      const violations = checkNoOverlap(await overlappingPairs(fx.hostId, ...ctx.window));
      const active = await activeBookingsBetween(fx.hostId, ...ctx.window);
      return {
        violations,
        observed: { cancel: results.find((r) => r.label === "cancel-old")?.status, book: results.find((r) => r.label === "book-new")?.status, activeBookings: active.length },
      };
    },
  },
];

export { checkNoServerErrors };
