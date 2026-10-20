#!/bin/bash
# Tái hiện độc lập D7–D11 (lỗi mới của đợt mở rộng 20 testcase) bằng curl thuần, không dùng k6 hay harness.
# Cần: Cal.com chạy ở localhost:3000, PostgreSQL, đã chạy `npm run fixtures`.
# Cảnh báo: xóa toàn bộ booking của host k15host trước khi chạy.
# Đếm email hủy đọc từ log của `yarn dev` (mặc định ../../.calcom-dev.log, đổi bằng biến CALCOM_LOG).
Q(){ psql -h localhost -U postgres -d calendso -At -c "$1"; }
eid(){ Q "select e.id from \"EventType\" e join users u on u.id=e.\"userId\" where u.username='k15host' and e.slug='$1'"; }
body(){ # eventId start end email [extra]
  echo "{\"eventTypeId\":$1,\"start\":\"$2\",\"end\":\"$3\",\"timeZone\":\"UTC\",\"language\":\"en\",\"metadata\":{},\"user\":\"k15host\"$5,\"responses\":{\"name\":\"$4\",\"email\":\"$4@thu.test\",\"location\":{\"value\":\"inPerson\",\"optionValue\":\"\"}}}"; }
book(){ curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/book/event -H 'content-type: application/json' -d "$1"; }
LOG="${CALCOM_LOG:-$(dirname "$0")/../../.calcom-dev.log}"
HOST="(select id from users where username='k15host')"
Q "delete from \"Booking\" where \"userId\"=$HOST" >/dev/null

echo "######## D7: event co buffer 30 phut, 6 nguoi dat cac slot sat nhau cung luc ########"
E=$(eid k15-buffer); R=$(mktemp)
for H in 09:00 09:30 10:00 10:30 11:00 11:30; do M=${H#*:}; HH=${H%:*}; END=$([ "$M" = 00 ] && echo "$HH:30" || echo "$((10#$HH+1)):00"); book "$(body $E 2027-08-10T$H:00.000Z 2027-08-10T${END/#9:/09:}:00.000Z buf${H/:/})" >>$R & done; wait
echo "HTTP: $(sort $R | uniq -c | tr '\n' ' ')   (ky vong: 3x200 cach nhau >=30 phut, 3 bi tu choi)"
echo "Booking hieu luc trong DB (gio bat dau): $(Q "select string_agg(to_char(\"startTime\",'HH24:MI'), ' ' order by \"startTime\") from \"Booking\" where \"eventTypeId\"=$E and status='accepted'")"

echo; echo "######## D8: gioi han tong thoi luong 30 phut/ngay, 6 nguoi dat 6 gio khac nhau cung luc ########"
E=$(eid k15-duration); R=$(mktemp)
for H in 09 10 11 12 13 14; do book "$(body $E 2027-08-11T$H:00:00.000Z 2027-08-11T$H:30:00.000Z dur$H)" >>$R & done; wait
echo "HTTP: $(sort $R | uniq -c | tr '\n' ' ')   (ky vong: 1x200, 5 bi tu choi)"
echo "Tong thoi luong booking hieu luc ngay 11/8: $(Q "select coalesce(sum(extract(epoch from \"endTime\"-\"startTime\")/60),0)::int from \"Booking\" where \"eventTypeId\"=$E and status='accepted'") phut   (gioi han 30)"

echo; echo "######## D9: moi nguoi dat toi da 1 booking dang hoat dong, cung mot nguoi dat 6 slot cung luc ########"
E=$(eid k15-booker); R=$(mktemp)
for H in 09 10 11 12 13 14; do book "$(body $E 2027-08-12T$H:00:00.000Z 2027-08-12T$H:30:00.000Z samebooker)" >>$R & done; wait
echo "HTTP: $(sort $R | uniq -c | tr '\n' ' ')   (ky vong: 1x200, 5 bi tu choi)"
echo "Booking hieu luc cua samebooker@thu.test: $(Q "select count(*) from \"Booking\" b join \"Attendee\" a on a.\"bookingId\"=b.id where b.\"eventTypeId\"=$E and a.email='samebooker@thu.test' and b.status='accepted'")   (gioi han 1)"

echo; echo "######## D10: huy MOT booking 6 lan cung luc (bam huy nhieu lan / nhieu tab) ########"
E=$(eid k15-30)
GOC=$(curl -s -X POST localhost:3000/api/book/event -H 'content-type: application/json' -d "$(body $E 2027-08-13T09:00:00.000Z 2027-08-13T09:30:00.000Z d10user)" | python3 -c "import sys,json;print(json.load(sys.stdin)['uid'])")
T=$(printf 'k%.0s' {1..64}); R=$(mktemp)
BEFORE=$(grep -a "subject: Canceled" "$LOG" 2>/dev/null | grep -a -c "d10user")
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/cancel -H 'content-type: application/json' -H "cookie: calcom.csrf_token=$T" -d "{\"uid\":\"$GOC\",\"cancellationReason\":\"thu\",\"csrfToken\":\"$T\"}" >>$R & done; wait
sleep 3
AFTER=$(grep -a "subject: Canceled" "$LOG" 2>/dev/null | grep -a -c "d10user")
echo "HTTP: $(sort $R | uniq -c | tr '\n' ' ')   (ky vong: 1x200, 5x400 'da huy')"
echo "Email huy Cal.com cu gui cho booking nay: $((AFTER-BEFORE))   (ky vong 2: 1 cho host + 1 cho nguoi dat)"

echo; echo "######## D11: event 3 ghe, CUNG MOT email dat 6 lan cung luc vao slot da co 1 nguoi ########"
E=$(eid k15-seated)
FIRST=$(curl -s -X POST localhost:3000/api/book/event -H 'content-type: application/json' -d "$(body $E 2027-08-14T09:00:00.000Z 2027-08-14T09:30:00.000Z seatfirst)" | python3 -c "import sys,json;print(json.load(sys.stdin)['uid'])")
R=$(mktemp)
for i in 1 2 3 4 5 6; do book "$(body $E 2027-08-14T09:00:00.000Z 2027-08-14T09:30:00.000Z dupseat)" >>$R & done; wait
echo "HTTP: $(sort $R | uniq -c | tr '\n' ' ')   (ky vong: 1x200, 5x409 'da dang ky')"
echo "So ghe cua dupseat@thu.test trong booking: $(Q "select count(*) from \"Attendee\" a join \"Booking\" b on b.id=a.\"bookingId\" where b.uid='$FIRST' and a.email='dupseat@thu.test'")   (ky vong 1; tong ghe 3)"
