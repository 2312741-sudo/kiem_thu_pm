-- Thí nghiệm khắc phục cho D1 (đặt chồng giờ) và D3 (PENDING trùng slot).
-- Ý tưởng: chuyển invariant I1 từ "kiểm tra ở tầng ứng dụng rồi mới ghi" (TOCTOU) xuống thành
-- ràng buộc của CSDL, để PostgreSQL tự từ chối bản ghi vi phạm dù có bao nhiêu request đồng thời.
--
-- Chỉ áp cho host k15 để không đụng dữ liệu seed sẵn (vốn đã có booking chồng giờ).
-- Bản sửa thật sẽ áp cho mọi booking không thuộc event seated.
-- Gỡ bỏ: xem cuối file.

CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
DECLARE
  host_id int := (SELECT id FROM users WHERE username = 'k15host');
BEGIN
  EXECUTE 'ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS k15_booking_no_overlap';
  EXECUTE format(
    'ALTER TABLE "Booking" ADD CONSTRAINT k15_booking_no_overlap
       EXCLUDE USING gist ("userId" WITH =, tsrange("startTime", "endTime") WITH &&)
       WHERE ("userId" = %s AND status IN (''accepted'', ''pending''))',
    host_id
  );
END $$;

-- Gỡ bỏ:
-- ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS k15_booking_no_overlap;
