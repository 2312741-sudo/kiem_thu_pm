#!/bin/bash
# Dựng báo cáo theo mẫu: hình -> Word (.docx) -> bổ sung số thứ tự -> xuất PDF bằng Microsoft Word (cập nhật mục lục).
# Cần: macOS có Microsoft Word, NODE_PATH trỏ tới nơi cài thư viện docx. Chạy từ thư mục gốc của kho.
set -e
cd "$(dirname "$0")/.."
python3 tools/make-figures.py > /dev/null
node tools/build-docx-theo-mau.cjs
python3 tools/postprocess-docx.py docs/BAO_CAO_GIUA_KY_THEO_MAU.docx
C=~/Library/Containers/com.microsoft.Word/Data/Documents   # Word chỉ mở được tệp trong thư mục của nó mà không hỏi quyền
osascript -e 'tell application "Microsoft Word" to close every document saving no' >/dev/null 2>&1 || true
cp docs/BAO_CAO_GIUA_KY_THEO_MAU.docx "$C/bc.docx"; rm -f "$C/bc.pdf"
osascript -e 'tell application "Microsoft Word" to open POSIX file "'"$C"'/bc.docx"' >/dev/null; sleep 6
osascript - <<APPLESCRIPT
tell application "Microsoft Word"
  set d to active document
  try
    repeat with t in (tables of contents of d)
      update t
    end repeat
  end try
  try
    repeat with t in (tables of figures of d)
      update t
    end repeat
  end try
  delay 2
  save as d file name "$C/bc.pdf" file format format PDF
end tell
APPLESCRIPT
osascript -e 'tell application "Microsoft Word" to close every document saving no' >/dev/null 2>&1 || true
cp "$C/bc.pdf" docs/BAO_CAO_GIUA_KY_THEO_MAU.pdf
echo "xong: docs/BAO_CAO_GIUA_KY_THEO_MAU.pdf"
