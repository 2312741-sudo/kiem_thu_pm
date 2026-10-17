// Sinh docs/BAO_CAO_GIUA_KY_BO_SUNG.pptx: 4 slide bổ sung cho báo cáo giữa kỳ
// (quy trình test, danh sách test case, chi phí, lỗi thật). Ghép vào file giữa kỳ khi cần.
// Chạy: NODE_PATH=<nơi cài pptxgenjs> node tools/build-pptx-midterm-extra.cjs
const path = require("path");
const pptxgen = require("pptxgenjs");

const OUT = path.resolve(__dirname, "..", "docs", "BAO_CAO_GIUA_KY_BO_SUNG.pptx");
const INK = "12202B", INK2 = "1D3142", PAPER = "F4F2EC", CARD = "FBFAF6", LINE = "DAD6CC";
const ORANGE = "E07B39", RUST = "B4531A", BLUE = "2558B8", MUTED = "4A5866", MUTED_DARK = "B8C6D2", FOOT = "7A8592";
const BODY = "Calibri", MONO = "Consolas";
const M = 0.7, W = 13.33 - 2 * M;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "R05-K15 – Báo cáo giữa kỳ (bổ sung)";
pres.author = "Nhóm R05-K15";
pres.theme = { headFontFace: BODY, bodyFontFace: BODY };

const titlePh = { placeholder: { options: { name: "title", type: "title", x: M, y: 0.7, w: W, h: 0.95, fontFace: BODY, fontSize: 34, bold: true, color: INK, valign: "top", margin: 0 }, text: "" } };
pres.defineSlideMaster({ title: "LIGHT", background: { color: PAPER }, slideNumber: { x: 12.2, y: 6.95, w: 0.5, h: 0.3, fontFace: BODY, fontSize: 12, color: FOOT, align: "right" }, objects: [titlePh] });

const eyebrow = (s, t) => s.addText(t, { x: M, y: 0.32, w: W, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: RUST, charSpacing: 2, margin: 0, isTextBox: true });
const footer = (s, t) => s.addText(t, { x: M, y: 6.95, w: 11.3, h: 0.3, fontFace: BODY, fontSize: 12, color: FOOT, margin: 0, isTextBox: true });
const card = (s, x, y, w, h, dark) => s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: dark ? INK : CARD }, line: { color: dark ? INK : LINE, width: 1 } });
function tbl(s, rows, { x = M, y, w = W, colW, fontSize = 14, rowH = 0.46, fills = {} }) {
  const b = { type: "solid", pt: 0.75, color: LINE };
  s.addTable(rows.map((r, ri) => r.map((c) => {
    const o = typeof c === "object" ? c : { text: c };
    return { text: o.text, options: { bold: ri === 0 || o.bold, color: INK, fill: { color: ri === 0 ? "E6E2D6" : fills[ri] || "FFFFFF" }, fontFace: BODY, fontSize, valign: "middle", border: [b, b, b, b], margin: [0.04, 0.1, 0.04, 0.1] } };
  })), { x, y, w, colW, rowH, autoPage: false });
}

// 1 · Quy trình test
{
  const s = pres.addSlide({ masterName: "LIGHT" });
  eyebrow(s, "QUY TRÌNH TEST");
  s.addText("Từ đọc code đến báo cáo: 7 bước, có nhóm đối chứng", { placeholder: "title" });
  const steps = [
    ["1", "Đọc code", "Tìm chỗ kiểm tra rồi mới ghi"],
    ["2", "Chọn invariant", "7 tính chất dữ liệu phải đúng"],
    ["3", "Thiết kế test case", "8 test case TC-01 đến TC-08"],
    ["4", "Chuẩn bị dữ liệu", "Host test, 5 loại cuộc hẹn"],
    ["5", "Chạy", "Đồng thời (k6) và tuần tự"],
    ["6", "Kiểm trong CSDL", "SQL kiểm từng invariant"],
    ["7", "Nguyên nhân gốc", "Đọc code, thử khắc phục"],
  ];
  const bw = 1.55, gap = (W - 7 * bw) / 6;
  steps.forEach(([n, h, b], i) => {
    const x = M + i * (bw + gap), dark = i === 4;
    card(s, x, 1.95, bw, 2.3, dark);
    s.addText(n, { x: x + 0.15, y: 2.05, w: 0.5, h: 0.5, fontFace: BODY, fontSize: 24, bold: true, color: dark ? ORANGE : BLUE, margin: 0, isTextBox: true });
    s.addText(h, { x: x + 0.15, y: 2.6, w: bw - 0.3, h: 0.6, fontFace: BODY, fontSize: 15, bold: true, color: dark ? "F4F2EC" : INK, margin: 0, valign: "top", isTextBox: true });
    s.addText(b, { x: x + 0.15, y: 3.25, w: bw - 0.3, h: 0.9, fontFace: BODY, fontSize: 13, color: dark ? MUTED_DARK : MUTED, margin: 0, valign: "top", isTextBox: true });
    if (i < 6) s.addShape(pres.ShapeType.line, { x: x + bw + 0.02, y: 3.1, w: gap - 0.04, h: 0, line: { color: FOOT, width: 1.5, endArrowType: "triangle" } });
  });
  s.addText("Tiêu chí pass / fail", { x: M, y: 4.6, w: W, h: 0.4, fontFace: BODY, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText([
    { text: "Một vòng PASS khi mọi invariant đúng và không có phản hồi 5xx hay lỗi kết nối.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Test case PASS khi cả 10 vòng PASS; một vòng vi phạm là FAIL.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Là lỗi race khi gửi đồng thời FAIL nhưng gửi tuần tự PASS; nếu tuần tự cũng FAIL thì là lỗi logic.", options: { bullet: true } },
  ], { x: M, y: 5.05, w: W, h: 1.7, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Chi tiết: docs/QUY_TRINH_TEST.md mục 1");
  s.addNotes("Quy trình gồm bảy bước. Điểm khác của kiểm thử race là bước 6: oracle là dữ liệu trong cơ sở dữ liệu, không phải mã HTTP. Bước 5 chạy cả đồng thời và tuần tự để tách lỗi race khỏi lỗi logic thông thường.");
}

// 2 · Danh sách test case
{
  const s = pres.addSlide({ masterName: "LIGHT" });
  eyebrow(s, "DANH SÁCH TEST CASE");
  s.addText("8 test case, mỗi cái chạy 10 vòng", { placeholder: "title" });
  tbl(s, [
    ["TC", "Input (gửi đồng thời)", "Kết quả mong đợi", "Invariant"],
    ["TC-01", "10 người đặt cùng một giờ 09:00", "1 người 200, 9 người 409", "I1"],
    ["TC-02", "10 giờ lệch 3 phút, event 30 và 60 phút, chồng lấn", "Chỉ 1 booking hiệu lực", "I1"],
    ["TC-03", "6 người đặt event 3 ghế, giờ trống", "3 người 200, 3 người 409; 3 ghế", "I2, I2b"],
    ["TC-04", "6 người tranh 2 ghế còn lại", "2 người 200, 4 người 409", "I2, I2b"],
    ["TC-05", "10 người đặt event cần xác nhận", "Chỉ 1 booking chờ xác nhận", "I3"],
    ["TC-06", "5 lệnh đổi lịch cùng một booking", "1 lệnh thành công, booking gốc bị hủy", "I4"],
    ["TC-07", "1 lệnh hủy + 1 lệnh đổi lịch cùng booking", "Không thể cả hai cùng thành công", "I5"],
    ["TC-08", "8 người đặt 8 giờ khác nhau, giới hạn 1/ngày", "Chỉ 1 người thành công", "I6"],
  ], { y: 1.75, colW: [1.0, 5.2, 4.3, W - 10.5], fontSize: 14, rowH: 0.47 });
  s.addText("Dữ liệu: host k15host (UTC, rảnh 24/7); 5 loại cuộc hẹn; mỗi request dùng một email người đặt khác nhau. I7 (không có 5xx) áp dụng cho mọi test case.", { x: M, y: 6.0, w: W, h: 0.7, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Đầy đủ tiền điều kiện và invariant: docs/QUY_TRINH_TEST.md mục 2");
  s.addNotes("Mỗi test case chọn một cơ chế bảo vệ khác nhau để thử. TC-01 và TC-04 là hai trường hợp hệ thống đã có bảo vệ, dùng để kiểm chứng harness không báo lỗi giả. Sáu test case còn lại thử những chỗ đọc code cho thấy chưa có bảo vệ ở tầng cơ sở dữ liệu.");
}

// 3 · Chi phí test
{
  const s = pres.addSlide({ masterName: "LIGHT" });
  eyebrow(s, "CHI PHÍ TEST");
  s.addText("Chi phí đo thật: 0 đồng, khoảng 12 phút máy", { placeholder: "title" });
  const stats = [["0 đồng", "Công cụ miễn phí, chạy trên máy cá nhân"], ["2 080", "Request đã gửi trong mọi lần chạy"], ["≈ 12 phút", "Tổng thời gian máy chạy test"], ["≈ 970", "Dòng mã bộ test (Node.js, k6, SQL)"]];
  const cw = (W - 3 * 0.3) / 4;
  stats.forEach(([n, l], i) => {
    const x = M + i * (cw + 0.3);
    card(s, x, 1.85, cw, 1.7);
    s.addText(n, { x: x + 0.2, y: 1.95, w: cw - 0.4, h: 0.8, fontFace: BODY, fontSize: 32, bold: true, color: BLUE, margin: 0, valign: "middle", isTextBox: true });
    s.addText(l, { x: x + 0.2, y: 2.8, w: cw - 0.4, h: 0.7, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  tbl(s, [
    ["Lần chạy", "Request", "Thời gian máy"],
    ["Đồng thời chính (8 test case × 10 vòng)", "570", "150 giây"],
    ["Tuần tự đối chứng", "570", "22 giây"],
    ["Độ nhạy: chỉ 2 request, 20 vòng", "200", "164 giây"],
    ["Thí nghiệm khắc phục", "380", "85 giây"],
    ["Đo cửa sổ race (18 mốc độ trễ)", "360", "300 giây"],
  ], { y: 3.85, colW: [7.2, 2.2, W - 9.4], fontSize: 14, rowH: 0.42 });
  s.addText("Công sức nhóm (người-giờ): [nhóm điền số giờ thực tế của từng thành viên]. Máy: MacBook Apple Silicon 10 nhân, 32 GB RAM.", { x: M, y: 6.5, w: W, h: 0.4, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, isTextBox: true });
  footer(s, "Số liệu lấy từ summary.json của từng lần chạy: docs/QUY_TRINH_TEST.md mục 3");
  s.addNotes("Số liệu chi phí máy đo thật từ thời điểm bắt đầu và kết thúc trong file summary.json của mỗi lần chạy. Chạy lại bộ test chính cả đồng thời và tuần tự mất dưới ba phút. Phần công sức người-giờ nhóm tự điền theo thực tế.");
}

// 4 · Lỗi thật
{
  const s = pres.addSlide({ masterName: "LIGHT" });
  eyebrow(s, "LỖI THẬT, TÁI HIỆN ĐỘC LẬP");
  s.addText("6 lỗi, đều tái hiện được bằng curl thuần", { placeholder: "title" });
  tbl(s, [
    ["Lỗi", "Tái hiện bằng curl (không dùng harness)", "Dữ liệu trong CSDL"],
    ["D1", "2 khách đặt 2 giờ chồng nhau cùng lúc: cả hai 200", "2 booking accepted chồng giờ 09:00–09:30 và 09:15–09:45"],
    ["D2", "6 người đặt event 3 ghế: 1×200, 5×409", "Chỉ bán 1/3 ghế dù còn ghế"],
    ["D3", "10 người đặt event cần xác nhận: 8×200", "8 booking chờ xác nhận cùng một giờ"],
    ["D4", "Đổi lịch liên tiếp một booking gốc 3 lần: cả 3 đều 200", "3 booking accepted từ cùng một gốc (cả khi tuần tự)"],
    ["D5", "Hủy và đổi lịch cùng lúc: cả hai 200", "Booking 09:00 đã hủy nhưng vẫn còn booking 11:00"],
    ["D6", "8 người đặt 8 giờ, giới hạn 1/ngày: 8×200", "8 booking hiệu lực trong một ngày"],
  ], { y: 1.75, colW: [0.9, 5.9, W - 6.8], fontSize: 14, rowH: 0.55 });
  s.addText("Đối chứng: gửi tuần tự hai request chồng giờ thì request thứ hai bị 409. Nhóm chưa báo lỗi cho Cal.com và chưa sửa mã Cal.com.", { x: M, y: 5.9, w: W, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "race-tests/repro/repro-curl.sh · docs/evidence/repro-curl.txt · docs/MINH_CHUNG_LOI.md");
  s.addNotes("Để chứng minh đây là lỗi thật, nhóm tái hiện lại từng lỗi bằng lệnh curl thuần, không dùng bộ test, rồi xem trực tiếp dữ liệu trong cơ sở dữ liệu. D4 là lỗi logic xảy ra cả khi gửi tuần tự; năm lỗi còn lại chỉ xảy ra khi đồng thời. Nhóm chưa báo lỗi cho nhóm phát triển Cal.com và chưa sửa mã Cal.com, nên nói là lỗi nhóm tìm được trên bản v6.2.0 chạy local.");
}

pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
