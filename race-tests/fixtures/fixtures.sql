-- Fixture cho bộ kiểm thử K15 (Concurrency/Race) trên Cal.com v6.2.0
-- Chạy lại nhiều lần được: xóa sạch dữ liệu của host k15 rồi tạo lại.
BEGIN;

DELETE FROM "Booking" WHERE "userId" IN (SELECT id FROM users WHERE username = 'k15host');
DELETE FROM "EventType" WHERE "userId" IN (SELECT id FROM users WHERE username = 'k15host');
DELETE FROM "Availability" WHERE "scheduleId" IN (SELECT s.id FROM "Schedule" s JOIN users u ON u.id = s."userId" WHERE u.username = 'k15host');
DELETE FROM "Schedule" WHERE "userId" IN (SELECT id FROM users WHERE username = 'k15host');
DELETE FROM users WHERE username = 'k15host';

INSERT INTO users (username, name, email, "emailVerified", uuid, "timeZone", "completedOnboarding", "weekStart")
VALUES ('k15host', 'K15 Race Host', 'k15host@example.com', now(), gen_random_uuid(), 'UTC', true, 'Monday');

-- Lịch làm việc 24/7 theo UTC để mọi slot trong tương lai đều "trống" trước khi bắn race
INSERT INTO "Schedule" ("userId", name, "timeZone")
SELECT id, 'K15 24/7', 'UTC' FROM users WHERE username = 'k15host';

UPDATE users SET "defaultScheduleId" = (SELECT s.id FROM "Schedule" s WHERE s."userId" = users.id)
WHERE username = 'k15host';

INSERT INTO "Availability" ("scheduleId", days, "startTime", "endTime")
SELECT s.id, ARRAY[0,1,2,3,4,5,6], '00:00', '23:59'
FROM "Schedule" s JOIN users u ON u.id = s."userId" WHERE u.username = 'k15host';

-- Event types dùng cho các scenario
INSERT INTO "EventType" (title, slug, length, "userId", "minimumBookingNotice", locations,
                         "seatsPerTimeSlot", "seatsShowAttendees", "requiresConfirmation", "bookingLimits")
SELECT v.title, v.slug, v.length, u.id, 0, '[{"type":"inPerson","address":"Phong A"}]'::jsonb,
       v.seats, CASE WHEN v.seats IS NULL THEN NULL ELSE false END, v.confirm, v.limits::jsonb
FROM users u,
(VALUES
  ('K15 30 phut',        'k15-30',      30, NULL::int, false, NULL::text),
  ('K15 60 phut',        'k15-60',      60, NULL,      false, NULL),
  ('K15 seated 3 cho',   'k15-seated',  30, 3,         false, NULL),
  ('K15 can xac nhan',   'k15-confirm', 30, NULL,      true,  NULL),
  ('K15 gioi han 1/ngay','k15-limit',   30, NULL,      false, '{"PER_DAY":1}')
) AS v(title, slug, length, seats, confirm, limits)
WHERE u.username = 'k15host';

-- Booking PENDING mặc định không chiếm slot; bật cờ này để PENDING cũng phải "giữ chỗ",
-- nhờ đó có invariant rõ ràng để kiểm tra race cho luồng cần xác nhận.
UPDATE "EventType" SET "requiresConfirmationWillBlockSlot" = true
WHERE slug = 'k15-confirm' AND "userId" = (SELECT id FROM users WHERE username = 'k15host');

INSERT INTO "_user_eventtype" ("A", "B")
SELECT e.id, e."userId" FROM "EventType" e JOIN users u ON u.id = e."userId" WHERE u.username = 'k15host';

COMMIT;

SELECT e.id, e.slug, e.length, e."seatsPerTimeSlot", e."requiresConfirmation", e."bookingLimits"
FROM "EventType" e JOIN users u ON u.id = e."userId" WHERE u.username = 'k15host' ORDER BY e.id;
