// Sinh docs/SLIDE_1_TRANG_TRINH_BAY_LOP.pptx: một slide tóm tắt nội dung đã hoàn thành đến thời điểm hiện tại.
// Chạy: NODE_PATH=<nơi cài pptxgenjs> node tools/build-pptx-1slide.cjs
const path = require("path");
const pptxgen = require("pptxgenjs");
const OUT = path.resolve(__dirname, "..", "docs", "SLIDE_1_TRANG_TRINH_BAY_LOP.pptx");
const INK = "12202B", PAPER = "F4F2EC", CARD = "FBFAF6", LINE = "DAD6CC", ORANGE = "E07B39", RUST = "B4531A", BLUE = "2558B8", MUTED = "4A5866", GREEN = "2E7D4F";
const BODY = "Calibri", MONO = "Consolas";
const M = 0.6, W = 13.33 - 2 * M;
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "R05-K15 – Nội dung đã hoàn thành đến hiện tại";
pres.author = "Nhóm 14";
pres.theme = { headFontFace: BODY, bodyFontFace: BODY };
const s = pres.addSlide();
s.background = { color: PAPER };
s.addText("NHÓM 14 · R05-K15 · NỘI DUNG ĐÃ HOÀN THÀNH ĐẾN HIỆN TẠI", { x: M, y: 0.3, w: W, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: RUST, charSpacing: 2, margin: 0, isTextBox: true });
s.addText("Kiểm thử race condition cho Cal.com: 6 lỗi thật, tái hiện trên 2 máy", { x: M, y: 0.7, w: W, h: 0.7, fontFace: BODY, fontSize: 30, bold: true, color: INK, margin: 0, isTextBox: true });
// cột trái: đã làm
const colW = (W - 0.5) / 2;
const card = (x, y, w, h) => s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.1, fill: { color: CARD }, line: { color: LINE, width: 1 } });
card(M, 1.6, colW, 3.1);
s.addText("Đã hoàn thành", { x: M + 0.25, y: 1.7, w: colW - 0.5, h: 0.4, fontFace: BODY, fontSize: 18, bold: true, color: GREEN, margin: 0, isTextBox: true });
s.addText([
  "Dựng Cal.com v6.2.0, chạy 3 luồng đặt, đổi, hủy lịch",
  "Bộ test tự động: k6 gửi đồng thời + SQL kiểm CSDL",
  "8 test case × 10 vòng, có nhóm đối chứng tuần tự",
  "6 lỗi (5 race, 1 logic), tái hiện độc lập bằng curl",
  "Chạy lại trên máy Windows: khớp 8/8",
].map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 5 } })), { x: M + 0.25, y: 2.15, w: colW - 0.5, h: 2.5, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
card(M + colW + 0.5, 1.6, colW, 3.1);
s.addText("Kết quả chính", { x: M + colW + 0.75, y: 1.7, w: colW - 0.5, h: 0.4, fontFace: BODY, fontSize: 18, bold: true, color: BLUE, margin: 0, isTextBox: true });
const b = { type: "solid", pt: 0.75, color: LINE };
const cell = (text, o = {}) => ({ text, options: { fontFace: BODY, fontSize: 13, color: INK, bold: o.bold, fill: { color: o.fill || "FFFFFF" }, border: [b, b, b, b], margin: [0.03, 0.08, 0.03, 0.08], valign: "middle" } });
s.addTable([
  [cell("Test case", { bold: true, fill: "E6E2D6" }), cell("Đồng thời", { bold: true, fill: "E6E2D6" }), cell("Tuần tự", { bold: true, fill: "E6E2D6" }), cell("Kết luận", { bold: true, fill: "E6E2D6" })],
  [cell("TC-01, TC-04"), cell("0/10"), cell("0/10"), cell("Đúng")],
  [cell("TC-02, 03, 05, 07, 08", { fill: "F6E2D3" }), cell("10/10", { bold: true, fill: "F6E2D3" }), cell("0/10", { fill: "F6E2D3" }), cell("Lỗi race", { fill: "F6E2D3" })],
  [cell("TC-06", { fill: "DCE5F4" }), cell("10/10", { bold: true, fill: "DCE5F4" }), cell("10/10", { bold: true, fill: "DCE5F4" }), cell("Lỗi logic", { fill: "DCE5F4" })],
], { x: M + colW + 0.75, y: 2.2, w: colW - 0.5, colW: [1.9, 0.95, 0.85, colW - 0.5 - 3.7], rowH: 0.38 });
s.addText("Mã HTTP đều 200 nhưng CSDL sai; chỉ cần 2 yêu cầu đồng thời là đủ gây lỗi.", { x: M + colW + 0.75, y: 3.85, w: colW - 0.5, h: 0.7, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
// hàng dưới: chi phí, việc còn lại, đóng góp
const w3 = (W - 1.0) / 3;
const boxes = [
  ["Chi phí", "0 đồng · lượt chạy chính thức dưới 3 phút máy · bộ test khoảng 970 dòng mã"],
  ["Còn lại", "Test qua giao diện (Playwright), đề xuất sửa D1 và D4, báo lỗi cho Cal.com, hoàn thiện báo cáo"],
  ["Đóng góp", "Tâm: môi trường · Vinh: phân tích, nguyên nhân gốc · Tín: test case, bộ test · Vĩ: chạy test, báo cáo"],
];
boxes.forEach(([h, t], i) => {
  const x = M + i * (w3 + 0.5);
  card(x, 4.95, w3, 1.85);
  s.addText(h, { x: x + 0.2, y: 5.03, w: w3 - 0.4, h: 0.35, fontFace: BODY, fontSize: 16, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText(t, { x: x + 0.2, y: 5.45, w: w3 - 0.4, h: 1.3, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
});
s.addNotes("Một slide tóm tắt nội dung nhóm đã hoàn thành đến thời điểm hiện tại, dùng để trình bày trước lớp. Nhóm đã dựng Cal.com, viết bộ test tự động gửi yêu cầu đồng thời và kiểm tra trực tiếp cơ sở dữ liệu, chạy 8 test case mỗi cái 10 vòng ở hai chế độ, tìm được 6 lỗi thật và tái hiện độc lập bằng curl, và chạy lại trên máy Windows cho cùng kết quả. Chi phí 0 đồng. Việc còn lại là test qua giao diện, đề xuất sửa và báo lỗi cho Cal.com.");
pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
