import pg from "pg";

import { config } from "./config.mjs";

// Cal.com lưu thời gian ở cột "timestamp without time zone" theo UTC. Nếu không ép UTC, driver sẽ dùng
// múi giờ máy chạy test (vd. +07:00) và mọi truy vấn theo khoảng thời gian bị lệch.
pg.defaults.parseInputDatesAsUTC = true;
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) => new Date(`${value.replace(" ", "T")}Z`));

export const pool = new pg.Pool({ connectionString: config.databaseUrl, max: 4 });

export async function query(sql, params = []) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function loadFixture() {
  const rows = await query(
    `SELECT u.id AS "userId", e.id, e.slug, e.length, e."seatsPerTimeSlot"
       FROM "EventType" e JOIN users u ON u.id = e."userId"
      WHERE u.username = $1`,
    [config.hostUsername]
  );
  if (rows.length === 0) {
    throw new Error(`Không tìm thấy fixture của '${config.hostUsername}'. Chạy 'npm run fixtures' trước.`);
  }
  const eventTypes = Object.fromEntries(rows.map((r) => [r.slug, r]));
  return { hostId: rows[0].userId, eventTypes };
}

export async function deleteHostBookings(hostId) {
  await query(`DELETE FROM "Booking" WHERE "userId" = $1`, [hostId]);
}

// "Active" = đang chiếm lịch của host. PENDING tính vào vì event k15-confirm bật requiresConfirmationWillBlockSlot.
const ACTIVE = `b.status IN ('accepted', 'pending')`;

export async function activeBookingsBetween(hostId, from, to) {
  return query(
    `SELECT b.id, b.uid, b.status, b."eventTypeId", b."startTime", b."endTime", b."fromReschedule", b."createdAt"
       FROM "Booking" b
      WHERE b."userId" = $1 AND ${ACTIVE} AND b."startTime" < $3 AND b."endTime" > $2
      ORDER BY b."startTime", b.id`,
    [hostId, from, to]
  );
}

// Các cặp booking active chồng thời gian của cùng host — vi phạm invariant I1.
export async function overlappingPairs(hostId, from, to) {
  return query(
    `SELECT a.uid AS a_uid, b.uid AS b_uid, a."startTime" AS a_start, a."endTime" AS a_end,
            b."startTime" AS b_start, b."endTime" AS b_end, a.status AS a_status, b.status AS b_status
       FROM "Booking" a JOIN "Booking" b
         ON a."userId" = b."userId" AND a.id < b.id
        AND a."startTime" < b."endTime" AND b."startTime" < a."endTime"
      WHERE a."userId" = $1
        AND a.status IN ('accepted','pending') AND b.status IN ('accepted','pending')
        AND a."startTime" < $3 AND a."endTime" > $2`,
    [hostId, from, to]
  );
}

export async function seatsForSlot(eventTypeId, start) {
  return query(
    `SELECT b.uid, b.status, count(s.id)::int AS seats, count(a.id)::int AS attendees
       FROM "Booking" b
       LEFT JOIN "Attendee" a ON a."bookingId" = b.id
       LEFT JOIN "BookingSeat" s ON s."attendeeId" = a.id
      WHERE b."eventTypeId" = $1 AND b."startTime" = $2
      GROUP BY b.uid, b.status`,
    [eventTypeId, start]
  );
}

export async function bookingByUid(uid) {
  const rows = await query(
    `SELECT id, uid, status, rescheduled, "fromReschedule", "startTime", "endTime" FROM "Booking" WHERE uid = $1`,
    [uid]
  );
  return rows[0] ?? null;
}

export async function rescheduledChildren(uid) {
  return query(
    `SELECT uid, status, "startTime", "endTime", "createdAt" FROM "Booking"
      WHERE "fromReschedule" = $1 ORDER BY id`,
    [uid]
  );
}
