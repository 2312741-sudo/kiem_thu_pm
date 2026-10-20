-- Thí nghiệm khắc phục D11 (một email chiếm nhiều ghế trong cùng một booking có ghế).
-- Một email chỉ được có 1 dòng Attendee trong mỗi booking. Chỉ dùng trên CSDL test; gỡ bằng DROP INDEX bên dưới.
CREATE UNIQUE INDEX IF NOT EXISTS k15_attendee_booking_email ON "Attendee" ("bookingId", lower(email));
-- DROP INDEX k15_attendee_booking_email;
