#!/bin/bash
# Đóng gói bài nộp LMS cuối kỳ: docs/cuoi-ky/Nhom14_R05-K15_CuoiKy.zip
set -e
cd "$(dirname "$0")/.."
OUT=docs/cuoi-ky; NAME=Nhom14_R05-K15_CuoiKy; TMP=$(mktemp -d)/$NAME
mkdir -p "$TMP/1_Bao_cao_cuoi_ky" "$TMP/2_Phan_chia_cong_viec_va_peer_review" "$TMP/3_Ma_nguon_kiem_thu" "$TMP/4_Tai_lieu_ho_tro"
cp $OUT/BAO_CAO_CUOI_KY.pdf $OUT/BAO_CAO_CUOI_KY.docx "$TMP/1_Bao_cao_cuoi_ky/"
cp $OUT/PHAN_CHIA_CONG_VIEC_VA_PEER_REVIEW.pdf $OUT/PHAN_CHIA_CONG_VIEC_VA_PEER_REVIEW.docx "$TMP/2_Phan_chia_cong_viec_va_peer_review/"
# mã nguồn kiểm thử: bỏ node_modules và các kết quả thăm dò; giữ kết quả chính thức
rsync -a --exclude node_modules --exclude 'results/' race-tests/ "$TMP/3_Ma_nguon_kiem_thu/race-tests/"
for r in giua-ky-20-race giua-ky-20-sequential windows-20-race windows-20-sequential sensitivity-n2-new fix-unique-attendee fix-exclusion-20 giua-ky-race giua-ky-sequential windows-race windows-sequential; do
  [ -d race-tests/results/$r ] && { mkdir -p "$TMP/3_Ma_nguon_kiem_thu/race-tests/results"; cp -R race-tests/results/$r "$TMP/3_Ma_nguon_kiem_thu/race-tests/results/"; }
done
cp README.md "$TMP/3_Ma_nguon_kiem_thu/"
cp docs/DEFECTS.md docs/DANH_GIA_RUI_RO.md docs/QUY_TRINH_TEST.md docs/MINH_CHUNG_LOI.md docs/HUONG_DAN_CHAY_LAI_WINDOWS.md docs/KET_QUA_TEST_GIUA_KY.md "$TMP/4_Tai_lieu_ho_tro/"
cp -R docs/evidence "$TMP/4_Tai_lieu_ho_tro/evidence"
SHA=$(git rev-parse --short HEAD)
cat > "$TMP/README_NOP_BAI.txt" <<TXT
NHOM 14 - DE TAI R05-K15 - KIEM THU RACE CONDITION CHO CAL.COM v6.2.0
Mon Kiem thu phan mem - Giang vien Nguyen The Lam - Dai hoc Da Lat

1_Bao_cao_cuoi_ky/                       Bao cao cuoi ky (PDF va Word)
2_Phan_chia_cong_viec_va_peer_review/    Ban phan chia cong viec, dong gop, mau danh gia cheo
3_Ma_nguon_kiem_thu/                     Ma nguon bo test (race-tests), ket qua chinh thuc, README chay lai
4_Tai_lieu_ho_tro/                       Danh sach loi, danh gia rui ro, quy trinh test, bang chung

Kho GitHub: https://github.com/2312741-sudo/kiem_thu_pm (nhanh main, goi nay tao tu commit $SHA)
He thong duoc kiem thu: Cal.com v6.2.0, commit 1c193cca8682b33b9866c792186033f7ef886682 (khong dua ma Cal.com vao goi; tai theo README)
Chay lai: xem 3_Ma_nguon_kiem_thu/README.md muc 2 va 3, hoac 4_Tai_lieu_ho_tro/HUONG_DAN_CHAY_LAI_WINDOWS.md
TXT
rm -f "$OUT/$NAME.zip"
(cd "$(dirname "$TMP")" && zip -qr "$OLDPWD/$OUT/$NAME.zip" "$NAME" -x '*.DS_Store')
ls -la "$OUT/$NAME.zip"; unzip -l "$OUT/$NAME.zip" | tail -1
