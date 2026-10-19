# Bổ sung giá trị lưu sẵn cho các trường SEQ (số thứ tự hình, bảng) để mục lục và danh mục lấy được số.
# Chạy: python3 tools/postprocess-docx.py docs/BAO_CAO_GIUA_KY_THEO_MAU.docx
import re, shutil, sys, zipfile

path = sys.argv[1]
tmp = path + ".tmp"
counts = {"Hình": 0, "Bảng": 0}
RPR = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/></w:rPr>'
pattern = re.compile(r'<w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/><w:instrText xml:space="preserve">SEQ (Hình|Bảng)</w:instrText><w:fldChar w:fldCharType="separate"/><w:fldChar w:fldCharType="end"/></w:r>')

def fix(m):
    label = m.group(1)
    counts[label] += 1
    n = counts[label]
    return (f'<w:r>{RPR}<w:fldChar w:fldCharType="begin"/></w:r>'
            f'<w:r>{RPR}<w:instrText xml:space="preserve"> SEQ {label} \\* ARABIC </w:instrText></w:r>'
            f'<w:r>{RPR}<w:fldChar w:fldCharType="separate"/></w:r>'
            f'<w:r>{RPR}<w:t>{n}</w:t></w:r>'
            f'<w:r>{RPR}<w:fldChar w:fldCharType="end"/></w:r>')

with zipfile.ZipFile(path) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "word/document.xml":
            data = pattern.sub(fix, data.decode("utf8")).encode("utf8")
        zout.writestr(item, data)
shutil.move(tmp, path)
print("đã bổ sung giá trị cho", counts)
