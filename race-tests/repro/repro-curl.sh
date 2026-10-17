#!/bin/bash
# Tái hiện độc lập D2, D3, D5, D6 bằng curl thuần (không k6, không harness).
# Cần: Cal.com chạy ở localhost:3000, PostgreSQL, đã chạy `npm run fixtures`.
# Cảnh báo: xóa toàn bộ booking của host k15host trước khi chạy.
Q(){ psql -h localhost -U postgres -d calendso -At -c "$1"; }
eid(){ Q "select e.id from \"EventType\" e join users u on u.id=e.\"userId\" where u.username='k15host' and e.slug='$1'"; }
body(){ # eventId start end email [extra]
  echo "{\"eventTypeId\":$1,\"start\":\"$2\",\"end\":\"$3\",\"timeZone\":\"UTC\",\"language\":\"en\",\"metadata\":{},\"user\":\"k15host\"$5,\"responses\":{\"name\":\"$4\",\"email\":\"$4@thu.test\",\"location\":{\"value\":\"inPerson\",\"optionValue\":\"\"}}}"; }
book(){ curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/book/event -H 'content-type: application/json' -d "$1"; }
HOST="(select id from users where username='k15host')"
Q "delete from \"Booking\" where \"userId\"=$HOST" >/dev/null

echo "######## D2: event 3 ghe, 6 nguoi dat cung luc vao gio trong ########"
E=$(eid k15-seated); R=$(mktemp)
for i in 1 2 3 4 5 6; do book "$(body $E 2027-07-10T09:00:00.000Z 2027-07-10T09:30:00.000Z seat$i)" >>$R & done; wait
echo "HTTP: $(sort $R | uniq -c | tr '\n' ' ')   (ky vong: 3x200, 3x409 ghe day)"
echo "So ghe ban duoc trong DB: $(Q "select count(s.id) from \"BookingSeat\" s join \"Booking\" b on b.id=s.\"bookingId\" where b.\"eventTypeId\"=$E and b.\"startTime\"='2027-07-10 09:00'")  / 3 ghe"

echo; echo "######## D3: event can xac nhan, 10 nguoi dat cung gio ########"
E=$(eid k15-confirm); R=$(mktemp)
for i in $(seq 1 10); do book "$(body $E 2027-07-11T09:00:00.000Z 2027-07-11T09:30:00.000Z pend$i)" >>$R & done; wait
echo "HTTP: $(sort $R | uniq -c | tr '\n' ' ')   (ky vong: 1x200, 9 bi tu choi)"
echo "Booking cho xac nhan cung gio trong DB: $(Q "select count(*) from \"Booking\" where \"eventTypeId\"=$E and \"startTime\"='2027-07-11 09:00' and status='pending'")   (ky vong: 1)"

echo; echo "######## D6: gioi han 1 booking/ngay, 8 nguoi dat 8 gio khac nhau cung luc ########"
E=$(eid k15-limit); R=$(mktemp)
for H in 09 10 11 12 13 14 15 16; do book "$(body $E 2027-07-12T$H:00:00.000Z 2027-07-12T$H:30:00.000Z lim$H)" >>$R & done; wait
echo "HTTP: $(sort $R | uniq -c | tr '\n' ' ')   (ky vong: 1x200, 7 bi tu choi)"
echo "Booking hieu luc trong ngay 12/7 trong DB: $(Q "select count(*) from \"Booking\" where \"eventTypeId\"=$E and \"startTime\"::date='2027-07-12' and status='accepted'")   (gioi han la 1)"

echo; echo "######## D5: huy va doi lich CUNG LUC tren mot booking ########"
E=$(eid k15-30)
GOC=$(curl -s -X POST localhost:3000/api/book/event -H 'content-type: application/json' -d "$(body $E 2027-07-13T09:00:00.000Z 2027-07-13T09:30:00.000Z d5user)" | python3 -c "import sys,json;print(json.load(sys.stdin)['uid'])")
T=$(printf 'k%.0s' {1..64}); RC=$(mktemp); RR=$(mktemp)
curl -s -o /dev/null -w "%{http_code}" -X POST localhost:3000/api/cancel -H 'content-type: application/json' -H "cookie: calcom.csrf_token=$T" -d "{\"uid\":\"$GOC\",\"cancellationReason\":\"thu\",\"csrfToken\":\"$T\"}" >$RC &
curl -s -o /dev/null -w "%{http_code}" -X POST localhost:3000/api/book/event -H 'content-type: application/json' -d "$(body $E 2027-07-13T11:00:00.000Z 2027-07-13T11:30:00.000Z d5user ",\"rescheduleUid\":\"$GOC\"")" >$RR &
wait
echo "Lenh HUY -> HTTP $(cat $RC) ; lenh DOI LICH -> HTTP $(cat $RR)   (ky vong: khong the ca hai cung thanh cong)"
echo "Booking cua d5user trong DB:"
Q "select status, to_char(\"startTime\",'HH24:MI') from \"Booking\" b join \"Attendee\" a on a.\"bookingId\"=b.id where a.email='d5user@thu.test' order by b.id" | sed 's/^/   /'
