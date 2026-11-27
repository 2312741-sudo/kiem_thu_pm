// Sinh docs/cuoi-ky/THUYET_TRINH_CUOI_KY_R05-K15.pptx (slide bảo vệ cuối kỳ, 16:9).
// Dựa trên bộ slide giữa kỳ (build-pptx-midterm.cjs), thêm phần trả lời góp ý của giảng viên,
// vai trò từng test case, nguyên nhân gốc và thí nghiệm khắc phục, kết luận.
// Chạy: NODE_PATH=<nơi cài pptxgenjs> node tools/build-pptx-cuoi-ky.cjs
const path = require("path");
const pptxgen = require("pptxgenjs");

const OUT = path.resolve(__dirname, "..", "docs", "cuoi-ky", "THUYET_TRINH_CUOI_KY_R05-K15.pptx");
const INK = "12202B", INK2 = "1D3142", PAPER = "F4F2EC", CARD = "FBFAF6", LINE = "DAD6CC";
const ORANGE = "E07B39", RUST = "B4531A", BLUE = "2558B8", SKY = "7FB0FF", GREEN = "2E7D4F";
const MUTED = "4A5866", MUTED_DARK = "B8C6D2", FOOT = "7A8592";
const BODY = "Calibri", MONO = "Consolas";
const M = 0.7, W = 13.33 - 2 * M;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "R05-K15 – Bảo vệ cuối kỳ";
pres.author = "Nhóm R05-K15";
pres.theme = { headFontFace: BODY, bodyFontFace: BODY };

const num = (color) => ({ x: 12.2, y: 6.95, w: 0.5, h: 0.3, fontFace: BODY, fontSize: 12, color, align: "right" });
const titlePh = (color) => ({ placeholder: { options: { name: "title", type: "title", x: M, y: 0.7, w: W, h: 0.95, fontFace: BODY, fontSize: 34, bold: true, color, valign: "top", margin: 0 }, text: "" } });
pres.defineSlideMaster({ title: "LIGHT", background: { color: PAPER }, slideNumber: num(FOOT), objects: [titlePh(INK)] });
pres.defineSlideMaster({ title: "DARK", background: { color: INK }, slideNumber: num("8C9AA8"), objects: [titlePh("F4F2EC")] });
pres.defineSlideMaster({ title: "DARK_BLANK", background: { color: INK } });

// Số thứ tự trên eyebrow được đánh tự động theo thứ tự slide (bỏ số cũ nếu có).
let EB = 1; // slide 1 là bìa, không có eyebrow
const eyebrow = (s, t, dark) => s.addText(`${String(++EB).padStart(2, "0")} · ${t.replace(/^\d+ · /, "")}`, { x: M, y: 0.32, w: W, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: dark ? ORANGE : RUST, charSpacing: 2, margin: 0, isTextBox: true });
const footer = (s, t, dark) => s.addText(t, { x: M, y: 6.95, w: 11.3, h: 0.3, fontFace: BODY, fontSize: 12, color: dark ? "8C9AA8" : FOOT, margin: 0, isTextBox: true });
const card = (s, x, y, w, h, dark) => s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: dark ? INK : CARD }, line: { color: dark ? INK : LINE, width: 1 } });
function tbl(s, rows, { x = M, y, w = W, colW, fontSize = 14, rowH = 0.46, fills = {} }) {
  const b = { type: "solid", pt: 0.75, color: LINE };
  s.addTable(rows.map((r, ri) => r.map((c) => {
    const o = typeof c === "object" ? c : { text: c };
    return { text: o.text, options: { bold: ri === 0 || o.bold, color: o.color || INK, fill: { color: ri === 0 ? "E6E2D6" : fills[ri] || "FFFFFF" }, fontFace: BODY, fontSize, valign: "middle", border: [b, b, b, b], margin: [0.04, 0.1, 0.04, 0.1] } };
  })), { x, y, w, colW, rowH, autoPage: false });
}

let sec = "";
const add = (master, section) => {
  if (section && section !== sec) { pres.addSection({ title: section }); sec = section; }
  return pres.addSlide({ masterName: master, sectionTitle: sec });
};

// 1 · Bìa
{
  const s = add("DARK_BLANK", "Mở đầu");
  s.addText("BẢO VỆ CUỐI KỲ · ĐỀ TÀI R05-K15 · NHÓM 14", { x: M, y: 0.7, w: W, h: 0.4, fontFace: MONO, fontSize: 16, bold: true, color: ORANGE, charSpacing: 3, margin: 0, isTextBox: true });
  s.addText("R05-K15\nKiểm thử race condition cho Cal.com", { x: M, y: 1.9, w: 11.5, h: 2.4, fontFace: BODY, fontSize: 54, bold: true, color: "F4F2EC", margin: 0, valign: "top", isTextBox: true });
  s.addText("20 test case, 11 lỗi thật tái hiện bằng curl, nguyên nhân gốc và đánh giá rủi ro", { x: M, y: 4.5, w: 10.5, h: 0.9, fontFace: BODY, fontSize: 24, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  s.addText("Môn Kiểm thử phần mềm · GV Nguyễn Thế Lâm\nKhoa CNTT – Trường Đại học Đà Lạt", { x: M, y: 6.1, w: 7, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED_DARK, margin: 0, isTextBox: true });
  s.addText("Nhóm 14\n2312741 - Nguyễn Thanh Tâm\n2312800 - Võ Công Vinh\n2312774 - Nguyễn Đức Tín\n2312796 - Ngô Quốc Trường Vĩ", { x: 7.6, y: 5.5, w: 5.03, h: 1.45, fontFace: BODY, fontSize: 16, color: MUTED_DARK, align: "right", valign: "bottom", margin: 0, isTextBox: true });
  s.addNotes("Nhóm 14 trình bày đề tài R05-K15: kiểm thử race condition cho Cal.com. So với giữa kỳ, nhóm đã sửa theo bốn góp ý của thầy: đánh giá rủi ro, chứng minh test case cần thiết, tìm mấu chốt của lỗi, và tăng từ 8 lên 20 test case.");
}

// 2 · Chốt đề tài
{
  const s = add("LIGHT");
  eyebrow(s, "01 · ĐỀ TÀI ĐÃ CHỐT");
  s.addText("Một tổ hợp Repo + Kỹ thuật, đã cố định phiên bản", { placeholder: "title" });
  const cols = [
    ["REPO · R05", "Cal.com", "Nền tảng đặt lịch mã nguồn mở. TypeScript, Next.js 16, PostgreSQL + Prisma, monorepo."],
    ["KỸ THUẬT · K15", "Concurrency / Race", "Gửi nhiều request đồng thời, kiểm invariant trực tiếp trong CSDL."],
    ["PHIÊN BẢN ĐÃ PIN", "v6.2.0", "Commit 1c193cca8682b33b9866c792186033f7ef886682, tránh nhánh main thay đổi giữa kỳ."],
  ];
  const cw = (W - 0.7) / 3;
  cols.forEach(([tag, head, body], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 1.95, cw, 3.3);
    s.addText(tag, { x: x + 0.3, y: 2.15, w: cw - 0.6, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: BLUE, margin: 0, isTextBox: true });
    s.addText(head, { x: x + 0.3, y: 2.6, w: cw - 0.6, h: 0.6, fontFace: BODY, fontSize: 26, bold: true, color: INK, margin: 0, isTextBox: true });
    s.addText(body, { x: x + 0.3, y: 3.35, w: cw - 0.6, h: 1.7, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  s.addText("Phạm vi: chỉ luồng đặt lịch, đổi lịch, hủy lịch (booking). Không ôm toàn bộ monorepo.", { x: M, y: 5.65, w: W, h: 0.5, fontFace: BODY, fontSize: 18, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Đề tài đã đăng ký là R05-K15. Nhóm khóa phiên bản ở tag v6.2.0 để test chạy lại được. Phạm vi hẹp vào luồng booking theo lưu ý của giảng viên.");
}

// 3 · Sửa theo góp ý giữa kỳ
{
  const s = add("LIGHT", "Góp ý giữa kỳ");
  eyebrow(s, "SỬA THEO GÓP Ý CỦA THẦY");
  s.addText("Bốn góp ý ở buổi báo cáo tiến độ và cách nhóm đã sửa", { placeholder: "title" });
  tbl(s, [
    ["Góp ý của thầy", "Nhóm đã làm", "Slide"],
    ["1. Đánh giá rủi ro", "Chấm rủi ro theo khu vực chức năng trước khi viết test case (khả năng × ảnh hưởng); chấm lại từng lỗi D1–D11 sau khi có kết quả, đặt lên ma trận rủi ro", "10, 19"],
    ["2. Chứng minh test case: không có thì sót lỗi", "Bảng vai trò từng test case: bỏ đi thì sót lỗi nào; 7 bằng chứng test case chạy được và đúng; sửa lỗi thì test chuyển sang đạt (TC-16)", "14, 15"],
    ["3. Tìm mấu chốt của lỗi (không kiểm tra thì xảy ra gì)", "Nguyên nhân gốc từng lỗi tới tên hàm trong mã Cal.com; thí nghiệm thêm ràng buộc CSDL để kiểm chứng; hậu quả nếu không kiểm tra", "17, 18, 19"],
    ["4. 8 test case là ít", "Tăng lên 20 test case (thêm buffer, giới hạn tuần, thời lượng, người đặt, hủy lặp, ghế, tải cao); tìm thêm 5 lỗi mới D7–D11", "7, 8, 12"],
  ], { y: 1.75, colW: [3.3, W - 4.6, 1.3], fontSize: 14, rowH: [0.45, 0.85, 0.85, 0.85, 0.85] });
  s.addText("Kết quả sau khi sửa: 20 test case, 13 phát hiện lỗi, 11 lỗi khác nhau đều tái hiện bằng curl; chạy lại trên Windows khớp 20/20.", { x: M, y: 6.3, w: W, h: 0.5, fontFace: BODY, fontSize: 15, bold: true, color: INK, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Báo cáo cuối kỳ: mục 3.4.3, 4.4.4, 4.5.3–4.5.6");
  s.addNotes("Ở buổi báo cáo tiến độ, thầy góp ý bốn điểm. Một, phải có đánh giá rủi ro. Hai, phải chứng minh được test case cần thiết: nếu không có test case đó thì lỗi lọt qua. Ba, phải tìm ra mấu chốt của lỗi: nếu không kiểm tra thì chuyện gì xảy ra. Bốn, 8 test case là ít. Bảng này cho thấy nhóm đã sửa từng điểm ở đâu; cột cuối là số slide để thầy đối chiếu.");
}

// 4 · Kiến trúc
{
  const s = add("LIGHT", "Hệ thống và kiểm thử");
  eyebrow(s, "03 · KIẾN TRÚC");
  s.addText("Một request đặt lịch đi qua 4 lớp", { placeholder: "title" });
  const boxes = [
    ["apps/web", "POST /api/book/event\nPOST /api/cancel", true],
    ["RegularBookingService", "Kiểm tra giới hạn, lịch trống, booking gốc", false],
    ["createBooking / handleSeats", "Ghi Booking, Attendee, BookingSeat", false],
    ["PostgreSQL", "UNIQUE(uid)\nUNIQUE(idempotencyKey)", true],
  ];
  const bw = 2.55, gap = (W - 4 * bw) / 3;
  boxes.forEach(([h, b, dark], i) => {
    const x = M + i * (bw + gap);
    card(s, x, 1.9, bw, 1.8, dark);
    s.addText(h, { x: x + 0.15, y: 2.0, w: bw - 0.3, h: 0.5, fontFace: MONO, fontSize: 13, bold: true, color: dark ? ORANGE : BLUE, margin: 0, valign: "top", isTextBox: true });
    s.addText(b, { x: x + 0.15, y: 2.55, w: bw - 0.3, h: 1.0, fontFace: BODY, fontSize: 14, color: dark ? "F4F2EC" : MUTED, margin: 0, valign: "top", isTextBox: true });
    if (i < 3) s.addShape(pres.ShapeType.line, { x: x + bw + 0.04, y: 2.8, w: gap - 0.08, h: 0, line: { color: FOOT, width: 2, endArrowType: "triangle" } });
  });
  s.addText("Điểm cần chú ý cho kiểm thử race", { x: M, y: 4.1, w: W, h: 0.4, fontFace: BODY, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText([
    { text: "Các bước kiểm tra (giới hạn, lịch trống, trạng thái booking gốc) chỉ đọc rồi quyết định; không giữ khóa tới lúc ghi.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Chỉ có hai ràng buộc ở CSDL: UNIQUE uid và UNIQUE idempotencyKey (tính từ start, end, host).", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Event có ghế dùng SELECT … FOR UPDATE khi thêm ghế vào booking đã có.", options: { bullet: true } },
  ], { x: M, y: 4.6, w: W, h: 1.9, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Sơ đồ container và luồng tuần tự đầy đủ: docs/diagrams/kien-truc.md");
  s.addNotes("Đây là phần kiến trúc rút gọn. Sơ đồ đầy đủ ở docs/diagrams/kien-truc.md. Điểm mấu chốt rút ra khi đọc code: các bước kiểm tra chỉ đọc, giữa kiểm tra và ghi không có khóa, nên đây là nơi nhóm kỳ vọng tìm ra race.");
}

// 5 · Môi trường
{
  const s = add("LIGHT");
  eyebrow(s, "04 · MÔI TRƯỜNG VÀ ON-BOARDING");
  s.addText("Hệ thống chạy trên máy, 3 luồng nghiệp vụ đạt", { placeholder: "title" });
  const half = (W - 0.5) / 2;
  tbl(s, [
    ["Thành phần", "Phiên bản"],
    ["Cal.com", "v6.2.0 · 1c193cca"],
    ["Node / Yarn", "22.23 / 4.12.0"],
    ["PostgreSQL", "16 (300 kết nối)"],
    ["k6", "2.3.0"],
    ["Dữ liệu test", "host k15host, 5 event type"],
  ], { y: 1.95, w: half, colW: [2.2, half - 2.2], fontSize: 15, rowH: 0.5 });
  tbl(s, [
    ["Smoke test", "HTTP", "Trong DB"],
    ["1. Đặt lịch", "200", "accepted"],
    ["2. Đổi lịch", "200", "bản cũ cancelled"],
    ["3. Hủy lịch", "200", "cancelled"],
    ["4. Đặt lại slot", "200", "đã giải phóng"],
  ], { x: M + half + 0.5, y: 1.95, w: half, colW: [2.4, 1.0, half - 3.4], fontSize: 15, rowH: 0.5 });
  s.addText([{ text: "Khó khăn đã xử lý: " , options: { bold: true, color: INK } }, { text: "không có Docker (dùng Postgres.app); cột timestamp lưu UTC nên driver bị lệch +7 giờ; /api/cancel cần CSRF 64 ký tự." }], { x: M, y: 5.4, w: W, h: 0.9, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Cài đặt từ máy sạch: README.md · demo: npm run demo:midterm");
  s.addNotes("Tài liệu on-boarding gồm phiên bản, lệnh cài đặt, biến môi trường, seed data. Smoke test chạy ba luồng: đặt, đổi, hủy lịch. Trong demo, nhóm chạy lệnh npm run demo:midterm để chứng minh.");
}

// 1 · Quy trình test
{
  const s = add("LIGHT");
  eyebrow(s, "05 · QUY TRÌNH TEST");
  s.addText("Từ đọc code đến báo cáo: 7 bước, có nhóm đối chứng", { placeholder: "title" });
  const steps = [
    ["1", "Đọc code", "Tìm chỗ kiểm tra rồi mới ghi"],
    ["2", "Chọn invariant", "12 tính chất dữ liệu phải đúng"],
    ["3", "Thiết kế test case", "20 test case TC-01 đến TC-20"],
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

// 2 · Danh sách test case (1/2)
{
  const s = add("LIGHT");
  eyebrow(s, "06 · DANH SÁCH TEST CASE (1/2)");
  s.addText("20 test case, mỗi cái chạy 10 vòng", { placeholder: "title" });
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
    ["TC-09", "2 booking khác nhau cùng đổi lịch sang một giờ trống", "1 thành công, 1 bị 409", "I1"],
    ["TC-10", "1 lệnh đổi lịch + 1 người đặt mới cùng nhắm một giờ", "Chỉ 1 trong 2 giữ được giờ", "I1"],
  ], { y: 1.75, colW: [1.0, 5.4, 4.1, W - 10.5], fontSize: 13, rowH: 0.39 });
  s.addText("Dữ liệu: host k15host (UTC, rảnh 24/7); 9 loại cuộc hẹn; mỗi request dùng một email người đặt khác nhau (trừ TC-14, 15, 16). I7 (không có 5xx) áp dụng cho mọi test case.", { x: M, y: 6.4, w: W, h: 0.5, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Đặc tả đầy đủ (tiền điều kiện, input, kết quả mong đợi): báo cáo mục 3.3.6 · docs/QUY_TRINH_TEST.md");
  s.addNotes("Nhóm đã tăng từ 8 lên 20 test case theo góp ý của thầy. Mười test case đầu: TC-01 và TC-04 là hai trường hợp hệ thống đã có bảo vệ, dùng để kiểm chứng bộ test không báo lỗi giả. TC-02, 03, 05, 06, 07, 08 thử những chỗ đọc mã cho thấy chưa có khóa. TC-09 và TC-10 mới: kiểm tra đường đổi lịch có được bảo vệ chống trùng giờ giống đường đặt mới hay không. Mỗi test case có đặc tả đầy đủ trong báo cáo mục 3.3.6.");
}

// 2 · Danh sách test case (2/2)
{
  const s = add("LIGHT");
  eyebrow(s, "07 · DANH SÁCH TEST CASE (2/2)");
  s.addText("12 test case bổ sung: giới hạn, buffer, hủy, ghế, tải", { placeholder: "title" });
  tbl(s, [
    ["TC", "Input (gửi đồng thời)", "Kết quả mong đợi", "Invariant"],
    ["TC-11", "6 người đặt 6 giờ sát nhau, buffer 30 phút", "Tối đa 3 booking, cách nhau ≥ 30 phút", "I8"],
    ["TC-12", "6 người đặt 6 giờ, giới hạn 30 phút/ngày", "Chỉ 1 người thành công", "I9"],
    ["TC-13", "6 người đặt 6 ngày trong tuần, giới hạn 1/tuần", "Chỉ 1 người thành công", "I6"],
    ["TC-14", "1 người (cùng email) đặt 6 giờ, giới hạn 1 booking/người", "Chỉ 1 booking thành công", "I10"],
    ["TC-15", "6 lệnh hủy cùng một booking", "Đúng 1 lệnh 200, 5 lệnh bị từ chối", "I5"],
    ["TC-16", "1 email đặt 6 lần vào event 3 ghế đã có 1 người", "Email đó chiếm đúng 1 ghế", "I11"],
    ["TC-17", "5 người đặt event 30 phút + 5 người đặt event 60 phút, đều 09:00", "Chỉ 1 booking hiệu lực", "I1"],
    ["TC-18", "Tải cao: 30 người đặt cùng một giờ", "1 người 200, 29 người 409, không 5xx", "I1, I7"],
    ["TC-19", "20 người đặt 20 giờ liền kề, không chồng nhau", "Cả 20 người thành công", "I12"],
    ["TC-20", "1 lệnh hủy + 1 người đặt mới đúng giờ vừa hủy", "Không có 2 booking hiệu lực cùng giờ", "I1"],
  ], { y: 1.75, colW: [1.0, 5.6, 3.9, W - 10.5], fontSize: 13, rowH: 0.39 });
  s.addText("TC-09, 10, 18, 19, 20 là test case đối chứng: cơ chế đang bảo vệ tốt, dùng để chứng minh bộ test không báo lỗi giả. TC-11 đến TC-17 là các chỗ nhóm nghi có lỗi sau khi đọc mã.", { x: M, y: 6.4, w: W, h: 0.5, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Đặc tả đầy đủ: báo cáo mục 3.3.6 · mã: race-tests/src/scenarios.mjs");
  s.addNotes("Mười hai test case bổ sung đi vào những tính năng mà thầy nhắc là khó thấy: các loại giới hạn đặt lịch (ngày, tuần, thời lượng, số booking của mỗi người), thời gian đệm, hủy nhiều lần, một người chiếm nhiều ghế, hai loại cuộc hẹn cùng giờ bắt đầu, và hai kiểm tra độ ổn định là tải 30 người và 20 giờ độc lập. Năm test case TC-09, 10, 18, 19, 20 cuối cùng đều đạt, nên cho thấy bộ test không báo lỗi giả.");
}

// 6 · Kế hoạch kỹ thuật
{
  const s = add("DARK", "Kế hoạch kiểm thử");
  eyebrow(s, "08 · KẾ HOẠCH ÁP DỤNG K15", true);
  s.addText("Phạm vi, giả định và tiêu chí đánh giá", { placeholder: "title" });
  const cw = (W - 0.7) / 3;
  const cols = [
    ["PHẠM VI", ORANGE, ["Đặt lịch 1-1 và event có ghế", "Event cần xác nhận (PENDING)", "Đổi lịch, hủy lịch", "Giới hạn: ngày, tuần, thời lượng, người đặt; thời gian đệm", "Ngoài phạm vi: lịch ngoài, thanh toán, team, API v2"]],
    ["GIẢ ĐỊNH", SKY, ["Một instance, một PostgreSQL, chạy local", "Chạy yarn dev; production có thể rộng cửa sổ hơn", "Host không nối lịch ngoài", "Rate limit tắt", "Mỗi vòng dùng một ngày riêng"]],
    ["TIÊU CHÍ PASS / FAIL", ORANGE, ["Oracle là invariant trong CSDL, không phải mã HTTP", "I1: host không có 2 booking chồng giờ", "I2, I11: không vượt số ghế, một người một ghế", "I4–I6, I8–I10: đổi lịch, hủy, giới hạn, đệm", "FAIL khi 1 vòng vi phạm; so với nhóm đối chứng tuần tự"]],
  ];
  cols.forEach(([h, color, items], i) => {
    const x = M + i * (cw + 0.35);
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.85, w: cw, h: 4.7, rectRadius: 0.12, fill: { color: INK2 }, line: { color: INK2, width: 0 } });
    s.addText(h, { x: x + 0.3, y: 2.05, w: cw - 0.6, h: 0.4, fontFace: MONO, fontSize: 14, bold: true, color, margin: 0, isTextBox: true });
    s.addText(items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < items.length - 1, paraSpaceAfter: 8 } })), { x: x + 0.3, y: 2.6, w: cw - 0.6, h: 3.8, fontFace: BODY, fontSize: 15, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "Chi tiết: báo cáo cuối kỳ mục 3.3", true);
  s.addNotes("Kế hoạch áp dụng kỹ thuật gồm phạm vi test, giả định và tiêu chí đánh giá. Oracle là điểm khác biệt của kiểm thử race: không tin mã HTTP mà kiểm dữ liệu thật trong CSDL.");
}

// Đánh giá rủi ro theo khu vực (trước khi viết test case)
{
  const s = add("LIGHT");
  eyebrow(s, "ĐÁNH GIÁ RỦI RO TRƯỚC KHI VIẾT TEST CASE");
  s.addText("Rủi ro quyết định chỗ nào cần nhiều test case", { placeholder: "title" });
  const sc = (k, a) => ({ text: String(k * a), bold: true, color: k * a >= 20 ? RUST : k * a >= 12 ? BLUE : MUTED });
  tbl(s, [
    ["Khu vực", "Vì sao rủi ro (đọc mã)", "Khả năng", "Ảnh hưởng", "Điểm", "Test case"],
    ["Chống trùng giờ", "Kiểm tra giờ trống rồi mới ghi, không khóa", "5", "5", sc(5, 5), "01, 02, 17, 18, 19"],
    ["Giới hạn đặt lịch", "Đếm trước rồi ghi sau (ngày, tuần, thời lượng, người đặt)", "5", "4", sc(5, 4), "08, 12, 13, 14"],
    ["Đổi lịch", "Một booking sinh booking mới; trạng thái gốc mang hai nghĩa", "4", "4", sc(4, 4), "06, 09, 10"],
    ["Hủy lịch", "Email, webhook chạy sau bước kiểm tra trạng thái", "4", "3", sc(4, 3), "07, 15, 20"],
    ["Cuộc hẹn có ghế", "Khóa dòng chỉ ở nhánh thêm ghế", "4", "3", sc(4, 3), "03, 04, 16"],
    ["Cần xác nhận", "Booking chờ không có khóa chống trùng ở CSDL", "4", "3", sc(4, 3), "05"],
    ["Thời gian đệm", "Tính lúc tìm giờ trống, cùng điểm yếu đọc rồi ghi", "4", "3", sc(4, 3), "11"],
    ["Tải cao", "Mỗi request giữ một kết nối CSDL, có thể 5xx", "3", "4", sc(3, 4), "18, 19"],
  ], { y: 1.7, colW: [2.2, 5.2, 1.2, 1.3, 0.9, W - 10.8], fontSize: 14, rowH: 0.44 });
  s.addText("Điểm = khả năng × ảnh hưởng (thang 1–5). ≥ 20 nghiêm trọng, 12–19 cao. Mỗi khu vực có test case đối chứng (đạt) và test case cố ý tạo tranh chấp, nên khi FAIL biết ngay cơ chế nào hỏng.", { x: M, y: 6.2, w: W, h: 0.65, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Báo cáo cuối kỳ mục 3.4.3, Bảng 36 · docs/DANH_GIA_RUI_RO.md");
  s.addNotes("Đây là góp ý thứ nhất của thầy: đánh giá rủi ro. Nhóm chấm rủi ro trước khi viết test case để dồn test vào chỗ hỏng thì nặng nhất. Khả năng xảy ra dựa vào đọc mã: có nhiều người cùng thao tác lên một tài nguyên không, và có khóa hay giao dịch bao trùm bước kiểm tra và bước ghi không. Ảnh hưởng dựa vào hậu quả: dữ liệu sai mà không cảnh báo là nặng nhất. Chống trùng giờ và giới hạn đặt lịch điểm cao nhất nên có nhiều test case nhất. Sau khi chạy test, nhóm chấm lại từng lỗi ở slide 19.");
}

// 3 · Chi phí test
{
  const s = add("LIGHT");
  eyebrow(s, "09 · CHI PHÍ TEST");
  s.addText("Chi phí đo thật: 0 đồng, khoảng 33 phút máy", { placeholder: "title" });
  const stats = [["0 đồng", "Công cụ miễn phí, chạy trên máy cá nhân"], ["8 940", "Request đã gửi trong mọi lần chạy"], ["≈ 8 phút", "Chạy lại 20 test case, cả hai chế độ"], ["≈ 1 600", "Dòng mã bộ test (Node.js, k6, SQL, bash)"]];
  const cw = (W - 3 * 0.3) / 4;
  stats.forEach(([n, l], i) => {
    const x = M + i * (cw + 0.3);
    card(s, x, 1.85, cw, 1.7);
    s.addText(n, { x: x + 0.2, y: 1.95, w: cw - 0.4, h: 0.8, fontFace: BODY, fontSize: 32, bold: true, color: BLUE, margin: 0, valign: "middle", isTextBox: true });
    s.addText(l, { x: x + 0.2, y: 2.8, w: cw - 0.4, h: 0.7, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  tbl(s, [
    ["Lần chạy", "Request", "Thời gian máy"],
    ["Đợt 1: 8 test case, đồng thời + tuần tự", "1 140", "177 giây"],
    ["Đợt 2: 20 test case, đồng thời (chính thức)", "1 590", "383 giây"],
    ["Đợt 2: 20 test case, tuần tự (đối chứng)", "1 590", "76 giây"],
    ["Đợt 2 trên máy Windows (đồng thời + tuần tự)", "3 180", "561 giây"],
    ["Thí nghiệm phụ: độ nhạy 2 request, khắc phục, cửa sổ race", "1 440", "755 giây"],
  ], { y: 3.85, colW: [7.2, 2.2, W - 9.4], fontSize: 14, rowH: 0.42 });
  s.addText("Công sức nhóm: ước lượng 34–46 người-giờ (chưa theo dõi giờ thực tế, chưa gồm đợt mở rộng lên 20 test case). Máy: MacBook Apple Silicon 10 nhân, 32 GB RAM.", { x: M, y: 6.5, w: W, h: 0.4, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, isTextBox: true });
  footer(s, "Số liệu lấy từ summary.json của từng lần chạy: báo cáo bảng 'Chi phí chạy kiểm thử đo được' · docs/QUY_TRINH_TEST.md mục 3");
  s.addNotes("Số liệu chi phí máy đo thật từ thời điểm bắt đầu và kết thúc trong file summary.json của mỗi lần chạy. Chạy lại bộ test chính 20 test case, cả đồng thời và tuần tự, mất khoảng tám phút. Tổng cộng mọi lần chạy, cả hai máy, khoảng 33 phút và 8 940 request. Công sức nhân lực là ước lượng 34 đến 46 người-giờ, nhóm chưa theo dõi giờ thực tế từng người và ước lượng này chưa gồm đợt mở rộng.");
}

// Kết quả test
{
  const s = add("LIGHT", "Kết quả");
  eyebrow(s, "10 · KẾT QUẢ TEST");
  s.addText("13 trên 20 test case phát hiện lỗi", { placeholder: "title" });
  s.addImage({ path: path.resolve(__dirname, "..", "docs", "figures", "hinh-ket-qua-20.png"), x: M, y: 1.7, w: 8.3, h: 8.3 * 850 / 1850 });
  const stats = [["13 / 20", "test case phát hiện lỗi: 12 lỗi race, 1 lỗi logic (TC-06)"], ["7 / 20", "đạt ở cả hai chế độ: bộ test không báo lỗi giả"], ["19 / 20", "đạt khi chạy tuần tự: kiểm thử thường không thấy lỗi"]];
  stats.forEach(([n, l], i) => {
    const y = 1.7 + i * 1.3;
    card(s, 9.3, y, W - 8.6, 1.15);
    s.addText(n, { x: 9.5, y: y + 0.05, w: 1.9, h: 1.05, fontFace: BODY, fontSize: 28, bold: true, color: i === 0 ? RUST : BLUE, margin: 0, valign: "middle", isTextBox: true });
    s.addText(l, { x: 11.35, y: y + 0.05, w: W - 10.75 + 0.05, h: 1.05, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("Cột là số vòng vi phạm trên 10 vòng. TC-02: mã HTTP của cả 10 request đều là 200 nhưng CSDL có 10 booking chồng giờ. TC-15: một booking bị hủy 6 lần, Cal.com gửi 12 email thay vì 2. Chỉ cần 2 request đồng thời, 7 test case mới vẫn vi phạm 10/10 vòng.", { x: M, y: 5.75, w: W, h: 1.0, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Lượt chạy chính thức 20/10/2026 · docs/KET_QUA_TEST_GIUA_KY.md · race-tests/results/giua-ky-20-race và giua-ky-20-sequential");
  s.addNotes("Kết quả thật của lượt chạy chính thức: 20 test case, mỗi test case 10 vòng ở hai chế độ đồng thời và tuần tự, tổng 3 180 request. Mười ba test case phát hiện lỗi: mười hai lỗi race chỉ sai khi đồng thời, một lỗi logic TC-06 sai cả khi tuần tự. Bảy test case đạt ở cả hai chế độ, cho thấy các cơ chế bảo vệ hiện có hoạt động và bộ test không báo lỗi giả. Điểm quan trọng: khi chạy tuần tự thì mười chín trên hai mươi test case đạt, nghĩa là kiểm thử chức năng thông thường sẽ kết luận hệ thống đúng; lỗi chỉ lộ ra khi gửi đồng thời và đối chiếu cơ sở dữ liệu.");
}

// Chạy lại trên máy thứ hai
{
  const s = add("LIGHT");
  eyebrow(s, "11 · CHẠY LẠI TRÊN MÁY THỨ HAI");
  s.addText("Máy Windows: cả 20 test case khớp 20/20", { placeholder: "title" });
  tbl(s, [
    ["Test case", "Mac: đồng thời", "Windows: đồng thời", "Windows: tuần tự", "Khớp"],
    ["TC-01, 04, 09, 10, 18, 19, 20", "0/10", "0/10", "0/10", "Có"],
    ["TC-02, 03, 05, 08, 11–17", "10/10", "10/10", "0/10", "Có"],
    ["TC-06", "10/10", "10/10", "10/10", "Có"],
    ["TC-07", "10/10", "9/10", "0/10", "Có (lệch 1 vòng)"],
  ], { y: 1.75, colW: [4.2, 2.1, 2.4, 2.3, W - 11.0], fontSize: 14, rowH: 0.45 });
  const cw = (W - 0.7) / 3;
  [["Thời gian", "20 test case: đồng thời 448 giây (Mac 383 giây); tuần tự 113 giây (Mac 76 giây)."], ["Hai lượt đầu bị loại", "Thiếu k6 và Cal.com dừng giữa chừng. Chỉ dùng lượt chạy sạch."], ["Máy Windows", "Người test: Ngô Quốc Trường Vĩ. Máy MSI, Core i7-13620H, RAM 16 GB. TC-07 lệch 1 vòng (9/10): bình thường với 2 request."]].forEach(([h, b], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 4.4, cw, 2.0);
    s.addText(h, { x: x + 0.3, y: 4.6, w: cw - 0.6, h: 0.5, fontFace: BODY, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true });
    s.addText(b, { x: x + 0.3, y: 5.2, w: cw - 0.6, h: 1.1, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "race-tests/results/windows-20-race · race-tests/results/windows-20-sequential");
  s.addNotes("Bạn Vĩ chạy lại bộ test trên máy Windows với cùng phiên bản mã. Ngày 18/10 là tám test case đầu, khớp tám trên tám. Ngày 21/10 chạy đủ hai mươi test case: kết luận khớp hai mươi trên hai mươi với máy Mac. Chỗ khác duy nhất là TC-07 vi phạm chín trên mười vòng thay vì mười: ở vòng một, yêu cầu đổi lịch đến trước nên lệnh hủy bị từ chối, dữ liệu nhất quán, không phải lỗi. Điều này bình thường với bài toán chỉ có hai yêu cầu. Máy Windows chậm hơn: bốn trăm bốn mươi tám giây so với ba trăm tám mươi ba giây. Hai lượt chạy đầu trên máy Windows lần trước bị loại vì thiếu k6 và Cal.com dừng giữa chừng; nhóm chỉ dùng lượt chạy sạch.");
}

// Chứng minh tính khả thi
{
  const s = add("LIGHT");
  eyebrow(s, "12 · CHỨNG MINH TEST CASE KHẢ THI");
  s.addText("Bảy bằng chứng test case chạy được và đúng", { placeholder: "title" });
  tbl(s, [
    ["Tiêu chí", "Bằng chứng đã thực hiện"],
    ["1. Chạy được, đo được", "20/20 test case chạy tự động, 3 180 request, mỗi vòng kiểm dữ liệu trong CSDL"],
    ["2. Không báo lỗi giả", "7 test case đạt ở cả hai chế độ; khi tuần tự, cơ chế bảo vệ từ chối đúng bằng mã lỗi riêng"],
    ["3. Lặp lại được", "13 test case vi phạm 10/10 vòng, vẫn 10/10 khi chỉ 2 request đồng thời"],
    ["4. Công cụ khác cho cùng kết quả", "curl thuần tái hiện cả 11 lỗi; D7–D11 chạy 2 lần liên tiếp, giống hệt"],
    ["5. Sửa lỗi thì test đạt", "Chỉ mục duy nhất theo người tham dự: TC-16 từ FAIL 10/10 sang PASS 10/10; ràng buộc loại trừ: TC-02, 05, 17 hết chồng giờ"],
    ["6. Chi phí chấp nhận được", "20 test case, 10 vòng, hai chế độ: ≈ 8 phút máy, 0 đồng"],
    ["7. Nhiều máy", "Cả 20 test case khớp 20/20 giữa macOS và Windows (TC-07 lệch 1 vòng, 9/10)"],
  ], { y: 1.75, colW: [3.5, W - 3.5], fontSize: 14, rowH: 0.56 });
  s.addText("Nếu bỏ một test case thì mất một lỗi mà kiểm thử tuần tự không thấy, hoặc mất một mốc đối chứng: xem slide tiếp theo.", { x: M, y: 6.35, w: W, h: 0.5, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Báo cáo mục 4.4.4 · docs/DANH_GIA_RUI_RO.md · results/fix-unique-attendee, fix-exclusion-20, sensitivity-n2-new");
  s.addNotes("Đây là phần chứng minh tính khả thi của test case. Một: tất cả chạy tự động. Hai: bảy test case đạt ở cả hai chế độ và khi chạy tuần tự các cơ chế bảo vệ từ chối bằng mã lỗi riêng như duration_limit_reached hay booker_limit_exceeded_error, nghĩa là test case thật sự kiểm tra chứ không đạt rỗng. Ba: lặp lại mười trên mười vòng và vẫn như vậy khi chỉ có hai request. Bốn: curl thuần cho cùng kết quả. Năm là bằng chứng mạnh nhất: khi nhóm thêm chỉ mục duy nhất theo người tham dự trên cơ sở dữ liệu test thì TC-16 chuyển từ không đạt sang đạt, tức test case đúng là phát hiện lỗi đó. Với ràng buộc loại trừ thì dữ liệu hết chồng giờ nhưng người thua nhận lỗi 500, nên sửa phải làm ở cả hai tầng. Bảy: hai máy khớp hai mươi trên hai mươi test case; TC-07 lệch một vòng vì chỉ có hai request nên thứ tự đến thay đổi.");
}

// Vai trò của từng test case: nếu không có thì sót gì
{
  const s = add("LIGHT");
  eyebrow(s, "NẾU KHÔNG CÓ TEST CASE NÀY THÌ SAO");
  s.addText("Bỏ test case nào cũng sót lỗi hoặc mất mốc đối chứng", { placeholder: "title" });
  const R = (t) => ({ text: t, bold: true, color: RUST }), G = (t) => ({ text: t, bold: true, color: GREEN });
  const half = (W - 0.4) / 2;
  tbl(s, [
    ["TC", "Kết quả", "Bỏ đi thì sót"],
    ["02", R("D1"), "Đặt chồng giờ, nghiêm trọng nhất"],
    ["03", R("D2"), "Bán thiếu ghế, báo xung đột sai"],
    ["05", R("D3"), "Hàng loạt yêu cầu chờ cùng một giờ"],
    ["06", R("D4"), "Link đổi lịch dùng lại nhiều lần"],
    ["07", R("D5"), "Hủy + đổi lịch để lại booking ma"],
    ["08", R("D6"), "Giới hạn 1 booking/ngày bị phá"],
    ["11", R("D7"), "Bỏ qua thời gian đệm 30 phút"],
    ["12", R("D8"), "Vượt giới hạn thời lượng/ngày"],
    ["13", R("D6"), "Giới hạn theo tuần bị phá"],
    ["14", R("D9"), "Một người đặt nhiều chỗ"],
  ], { x: M, y: 1.75, w: half, colW: [0.7, 1.1, half - 1.8], fontSize: 14, rowH: 0.41 });
  tbl(s, [
    ["TC", "Kết quả", "Bỏ đi thì sót"],
    ["15", R("D10"), "Hủy lặp gửi email, webhook nhiều lần"],
    ["16", R("D11"), "Một người chiếm nhiều ghế"],
    ["17", R("D1"), "Hai loại cuộc hẹn cùng giờ bắt đầu"],
    ["01", G("Đạt"), "Mốc: UNIQUE chặn slot trùng khít"],
    ["04", G("Đạt"), "Mốc: khóa dòng ở nhánh thêm ghế"],
    ["09", G("Đạt"), "Đổi lịch có chống trùng như đặt mới?"],
    ["10", G("Đạt"), "Đổi lịch và đặt mới tranh một giờ?"],
    ["18", G("Đạt"), "Tải gấp ba có sập, có 5xx không?"],
    ["19", G("Đạt"), "Có từ chối nhầm request hợp lệ không?"],
    ["20", G("Đạt"), "Hủy rồi đặt lại đúng giờ có an toàn?"],
  ], { x: M + half + 0.4, y: 1.75, w: half, colW: [0.7, 1.1, half - 1.8], fontSize: 14, rowH: 0.41 });
  s.addText("12 trên 13 test case phát hiện lỗi chỉ FAIL khi gửi đồng thời: chạy tuần tự thì 19/20 test case đạt. Test case đạt là mốc đối chứng: chứng minh bộ test không báo lỗi giả.", { x: M, y: 6.4, w: W, h: 0.5, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Báo cáo cuối kỳ mục 4.4.4, Bảng 43");
  s.addNotes("Đây là góp ý thứ hai của thầy: chứng minh nếu không có test case thì lỗi lọt qua. Mười ba test case bên trái và phần trên bên phải đều tìm ra một lỗi; nếu bỏ test case đó thì lỗi tương ứng không ai thấy, vì khi chạy tuần tự hệ thống đều đúng, trừ D4. Bảy test case đạt là mốc đối chứng: chúng cho thấy cơ chế bảo vệ nào đang hoạt động, nên khi một test case khác FAIL ta biết chính xác cơ chế nào hỏng, và cho thấy bộ test không báo lỗi giả. Bằng chứng mạnh nhất là TC-16: thêm chỉ mục duy nhất thì test chuyển từ FAIL sang PASS, tức test case bắt đúng lỗi.");
}

// 4 · Lỗi thật
{
  const s = add("LIGHT");
  eyebrow(s, "13 · LỖI THẬT, TÁI HIỆN ĐỘC LẬP");
  s.addText("11 lỗi, đều tái hiện được bằng curl thuần", { placeholder: "title" });
  tbl(s, [
    ["Lỗi", "Tái hiện bằng curl (không dùng harness)", "Dữ liệu trong CSDL"],
    ["D1", "2 khách đặt 2 giờ chồng nhau cùng lúc: cả hai 200", "2 booking accepted chồng giờ"],
    ["D2", "6 người đặt event 3 ghế: 1×200, 5×409", "Chỉ bán 1/3 ghế dù còn ghế"],
    ["D3", "10 người đặt event cần xác nhận: 8×200", "8 booking chờ xác nhận cùng giờ"],
    ["D4", "Đổi lịch một booking gốc 3 lần liên tiếp: 3×200", "3 booking accepted từ một gốc (cả khi tuần tự)"],
    ["D5", "Hủy và đổi lịch cùng lúc: cả hai 200", "Booking 09:00 đã hủy nhưng còn booking 11:00"],
    ["D6", "8 người đặt 8 giờ, giới hạn 1/ngày: 8×200", "8 booking hiệu lực trong một ngày"],
    ["D7", "6 người đặt 6 giờ sát nhau, buffer 30 phút: 6×200", "6 booking cách nhau 0 phút"],
    ["D8", "6 người đặt 6 giờ, giới hạn 30 phút/ngày: 6×200", "Tổng 180 phút trong ngày"],
    ["D9", "1 người đặt 6 giờ, giới hạn 1 booking/người: 6×200", "6 booking hiệu lực của cùng một email"],
    ["D10", "Hủy 1 booking 6 lần cùng lúc: 6×200", "12 email hủy được gửi (kỳ vọng 2)"],
    ["D11", "1 email đặt 6 lần vào event 3 ghế: 2×200, 4×409", "Email đó chiếm 2 ghế"],
  ], { y: 1.7, colW: [0.8, 6.2, W - 7.0], fontSize: 13, rowH: 0.36 });
  s.addText("Đối chứng: gửi tuần tự thì cơ chế bảo vệ từ chối đúng (trừ D4). Nhóm chưa báo lỗi cho Cal.com và chưa sửa mã Cal.com.", { x: M, y: 6.45, w: W, h: 0.55, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "race-tests/repro/repro-curl.sh, repro-curl-2.sh · docs/evidence/repro-curl*.txt · docs/MINH_CHUNG_LOI.md");
  s.addNotes("Để chứng minh đây là lỗi thật, nhóm tái hiện lại từng lỗi bằng lệnh curl thuần, không dùng bộ test, rồi xem trực tiếp dữ liệu trong cơ sở dữ liệu. Năm lỗi đầu D1 đến D6 đã có từ đợt một, năm lỗi D7 đến D11 là phát hiện của đợt mở rộng. D4 là lỗi logic xảy ra cả khi gửi tuần tự; mười lỗi còn lại chỉ xảy ra khi đồng thời. D10 đáng chú ý: mọi lệnh hủy đều thành công nên nhìn bề ngoài không có gì sai, chỉ khi đếm email mới thấy 12 thay vì 2. Nhóm chưa báo lỗi cho nhóm phát triển Cal.com và chưa sửa mã Cal.com, nên nói là lỗi theo tính chất dữ liệu bất biến, chưa phải được nhóm phát triển xác nhận.");
}

// Nguyên nhân gốc: mấu chốt của lỗi
{
  const s = add("LIGHT", "Nguyên nhân gốc");
  eyebrow(s, "MẤU CHỐT CỦA LỖI");
  s.addText("Kiểm tra rồi mới ghi, giữa hai bước không có khóa", { placeholder: "title" });
  const iw = 5.6;
  s.addImage({ path: path.resolve(__dirname, "..", "docs", "figures", "hinh-toctou.png"), x: M, y: 1.75, w: iw, h: iw * 748 / 1590 });
  s.addText("Hai request cùng đọc “giờ còn trống” trước khi request kia kịp ghi, nên cả hai cùng ghi. Cửa sổ chỉ 30–60 ms.", { x: M, y: 1.75 + iw * 748 / 1590 + 0.15, w: iw, h: 0.9, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  const tx = M + iw + 0.35, tw = W - iw - 0.35;
  tbl(s, [
    ["Lỗi", "Bước kiểm tra bị bỏ qua (mã Cal.com)"],
    ["D1, D3", "ensureAvailableUsers đọc giờ trống; UNIQUE idempotencyKey chỉ chặn giờ trùng khít, booking chờ có khóa rỗng"],
    ["D6, D8, D9", "checkBookingAndDurationLimits, checkActiveBookingsLimitForBooker: đếm rồi mới ghi"],
    ["D7", "Thời gian đệm tính lúc tìm giờ trống, không kiểm tra lại khi ghi"],
    ["D2, D11", "handleSeats kiểm tra trước khi khóa; FOR UPDATE nằm sau, không kiểm tra lại"],
    ["D5, D10", "handleCancelBooking kiểm tra “đã hủy chưa” rồi cập nhật chỉ theo uid"],
    ["D4 (logic)", "getOriginalRescheduledBooking: trạng thái “đã hủy + đã đổi lịch” mang hai nghĩa"],
  ], { x: tx, y: 1.75, w: tw, colW: [1.35, tw - 1.35], fontSize: 13, rowH: 0.62 });
  s.addText("Nếu không kiểm tra: hệ thống không sập, nhưng dữ liệu sai âm thầm và vẫn trả HTTP 200.", { x: M, y: 6.3, w: W, h: 0.5, fontFace: BODY, fontSize: 16, bold: true, color: RUST, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Báo cáo cuối kỳ mục 4.5.3 · docs/DEFECTS.md");
  s.addNotes("Đây là góp ý thứ ba của thầy: tìm ra mấu chốt của lỗi. Mấu chốt chung của mười lỗi race là mẫu kiểm tra rồi mới ghi, tiếng Anh gọi là TOCTOU. Cal.com kiểm tra giờ trống, đếm số booking, kiểm tra trạng thái trước, rồi mới ghi; giữa hai bước không có giao dịch hay khóa bao trùm. Hai request đến trong khoảng 30 đến 60 mili-giây cùng đọc thấy hợp lệ và cùng ghi. Lớp bảo vệ duy nhất ở CSDL là ràng buộc duy nhất trên idempotencyKey, chỉ chặn được hai giờ trùng khít. D4 khác: là lỗi logic, một trạng thái mang hai nghĩa nên booking đã đổi vẫn đổi tiếp được. Hậu quả nếu không kiểm tra: hệ thống không sập mà dữ liệu sai một cách âm thầm.");
}

// Thí nghiệm khắc phục
{
  const s = add("LIGHT");
  eyebrow(s, "KIỂM CHỨNG NGUYÊN NHÂN BẰNG THÍ NGHIỆM");
  s.addText("Thêm ràng buộc ở CSDL test: lỗi biến mất đúng như dự đoán", { placeholder: "title" });
  tbl(s, [
    ["Test case", "Trước", "Sau khi thêm ràng buộc", "Nhận xét"],
    ["TC-02 (D1)", "10 booking chồng giờ", { text: "1 booking", bold: true, color: GREEN }, "9 request thua nhận HTTP 500"],
    ["TC-05 (D3)", "7–10 booking chờ", { text: "1 booking chờ", bold: true, color: GREEN }, "9 request thua nhận HTTP 500"],
    ["TC-17 (D1)", "2 booking chồng giờ", { text: "1 booking", bold: true, color: GREEN }, "4 thua nhận 409, 5 thua nhận 500"],
    ["TC-08 (D6)", "8 booking mỗi ngày", { text: "8 booking mỗi ngày", bold: true, color: RUST }, "Không đổi: bài toán đếm, cần khóa theo chủ lịch và ngày"],
    ["TC-16 (D11), chỉ mục duy nhất", "1 email chiếm 2 ghế", { text: "1 ghế", bold: true, color: GREEN }, "5 thua nhận 400, không 500: FAIL 10/10 → PASS 10/10"],
  ], { y: 1.75, colW: [2.9, 2.4, 2.4, W - 7.7], fontSize: 13, rowH: 0.5 });
  const cw = (W - 0.7) / 3;
  [["Kết luận 1", "Thiếu ràng buộc ở CSDL đúng là nguyên nhân của D1, D3, D11."], ["Kết luận 2", "Sửa thiếu cũng nguy hiểm: thêm ràng buộc mà không ánh xạ lỗi thì người thua nhận 500 (vi phạm I7)."], ["Kết luận 3", "D6 cần cơ chế khác: advisory lock theo chủ lịch và ngày, hoặc serializable có thử lại."]].forEach(([h, b], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 5.2, cw, 1.5);
    s.addText(h, { x: x + 0.25, y: 5.3, w: cw - 0.5, h: 0.4, fontFace: MONO, fontSize: 13, bold: true, color: BLUE, margin: 0, isTextBox: true });
    s.addText(b, { x: x + 0.25, y: 5.7, w: cw - 0.5, h: 0.95, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "Báo cáo cuối kỳ mục 4.5.4 · results/fix-exclusion-20, fix-unique-attendee · nhóm chưa sửa mã Cal.com");
  s.addNotes("Để chắc nguyên nhân là đúng, nhóm thêm ràng buộc loại trừ vào CSDL test, không cho hai booking hiệu lực của cùng chủ lịch có giờ giao nhau, rồi chạy lại. Dữ liệu trở nên đúng ở D1 và D3, nhưng người thua nhận lỗi 500 vì mã Cal.com chỉ ánh xạ lỗi ràng buộc duy nhất sang 409. Với D11, thêm chỉ mục duy nhất theo người tham dự thì TC-16 chuyển từ FAIL 10 trên 10 sang PASS 10 trên 10, không có 500. D6 không đổi vì đây là bài toán đếm, cần khóa theo chủ lịch. Đây là thí nghiệm trên CSDL test; nhóm chưa sửa mã Cal.com.");
}

// Lỗi khó tìm và rủi ro
{
  const s = add("LIGHT");
  eyebrow(s, "14 · LỖI KHÓ TÌM VÀ ĐÁNH GIÁ RỦI RO");
  s.addText("Vì sao khó tìm, và lỗi nào nguy hiểm nhất", { placeholder: "title" });
  s.addImage({ path: path.resolve(__dirname, "..", "docs", "figures", "hinh-ma-tran-rui-ro.png"), x: M, y: 1.65, w: 4.9, h: 4.9 * 960 / 1300 });
  s.addText("Rủi ro = khả năng × ảnh hưởng (thang 1–5). Đỏ: nghiêm trọng (D1: 25, D6: 20).", { x: M, y: 5.35, w: 4.9, h: 0.7, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  const cx = M + 5.3, cw2 = W - 5.3;
  card(s, cx, 1.65, cw2, 2.35);
  s.addText("VÌ SAO KHÓ PHÁT HIỆN", { x: cx + 0.25, y: 1.75, w: cw2 - 0.5, h: 0.35, fontFace: MONO, fontSize: 13, bold: true, color: BLUE, margin: 0, isTextBox: true });
  s.addText([
    { text: "Cửa sổ chỉ 30–60 ms: thử tay gần như không gặp", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Mọi request trả 200, giao diện báo thành công", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Chạy tuần tự thì đúng: 19/20 test case đạt", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Chỉ lộ ra khi đối chiếu CSDL hoặc đếm tác dụng phụ", options: { bullet: true } },
  ], { x: cx + 0.25, y: 2.15, w: cw2 - 0.5, h: 1.75, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  card(s, cx, 4.15, cw2, 2.4);
  s.addText("MẤU CHỐT: NẾU KHÔNG KIỂM TRA THÌ SAO", { x: cx + 0.25, y: 4.25, w: cw2 - 0.5, h: 0.35, fontFace: MONO, fontSize: 13, bold: true, color: RUST, margin: 0, isTextBox: true });
  s.addText([
    { text: "Không có lỗi nào làm sập hệ thống (30 request: không 5xx)", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Nguy hiểm hơn: dữ liệu sai âm thầm, hai khách cùng đến một giờ", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "D10: 1 lần hủy gửi 12 email; D11: 1 người chiếm 2/3 ghế", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Sửa thiếu cũng nguy hiểm: ràng buộc CSDL mà không ánh xạ lỗi thì thua nhận 500", options: { bullet: true } },
  ], { x: cx + 0.25, y: 4.65, w: cw2 - 0.5, h: 1.85, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Báo cáo mục 3.4.3, 4.5.5, 4.5.6 · docs/DANH_GIA_RUI_RO.md");
  s.addNotes("Phần này trả lời hai yêu cầu của thầy: tìm ra lỗi quan trọng mà khó thấy, và đánh giá rủi ro. Khó thấy vì bốn lý do trên slide. Nổi bật là D10 và D11: D10 mọi lệnh hủy đều thành công, chỉ khi đếm email gửi đi mới thấy mỗi lệnh chạy lại toàn bộ tác dụng phụ; D11 nằm đúng trong cơ chế chống đăng ký trùng mà Cal.com đã viết, và cơ chế đó chạy tốt khi test tuần tự. Về rủi ro, nhóm chấm điểm bằng khả năng nhân ảnh hưởng. D1, tức chủ lịch bị đặt trùng giờ, và D6, tức vượt giới hạn đặt lịch, ở mức nghiêm trọng. Điểm mấu chốt: không có lỗi nào làm hệ thống sập, mà dữ liệu sai một cách âm thầm. Điểm khả năng là đánh giá dựa trên số liệu đã đo (tái hiện 10 trên 10 vòng, chỉ cần 2 request), điểm ảnh hưởng là đánh giá của nhóm.");
}

// Nhiệm vụ và đóng góp
{
  const s = add("LIGHT");
  eyebrow(s, "15 · NHIỆM VỤ VÀ ĐÓNG GÓP");
  s.addText("Nhiệm vụ và đóng góp của từng thành viên", { placeholder: "title" });
  tbl(s, [
    ["Thành viên", "Vai trò", "Nhiệm vụ đã thực hiện", "Sản phẩm"],
    ["Nguyễn Thanh Tâm · 2312741", "Môi trường, DevOps", "Dựng Cal.com, CSDL, seed data; ghim phiên bản; chạy test trên macOS", "README, kết quả chạy chính thức"],
    ["Võ Công Vinh · 2312800", "Phân tích hệ thống", "Đọc mã, vẽ kiến trúc, luồng dữ liệu; phân tích nguyên nhân gốc", "Sơ đồ, DEFECTS.md, thí nghiệm khắc phục"],
    ["Nguyễn Đức Tín · 2312774", "Tác giả test", "Thiết kế invariant và test case; viết bộ test (k6, Node.js, SQL)", "race-tests/, đặc tả test case"],
    ["Ngô Quốc Trường Vĩ · 2312796", "Chạy test, báo cáo", "Chạy test, ghi kết quả; chạy lại trên Windows; báo cáo, slide", "windows-race, báo cáo, slide"],
  ], { y: 1.85, colW: [3.1, 2.1, 4.6, W - 9.8], fontSize: 14, rowH: 0.75 });
  s.addText("Quản lý công việc: bảng GitHub Projects (18 thẻ, 3 cột), mã nguồn trên GitHub. Đóng góp được đánh giá chéo (peer review) trong bản phân chia công việc nộp kèm báo cáo.", { x: M, y: 5.9, w: W, h: 0.8, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Chi tiết: báo cáo mục 4.6 · github.com/users/2312741-sudo/projects/1");
  s.addNotes("Mỗi thành viên có vai trò và nhiệm vụ riêng, theo phân công của nhóm. Công việc được theo dõi trên bảng GitHub Projects. Phần trình bày lịch sử công việc và commit Git: mở kho GitHub và bảng Projects trực tiếp khi bảo vệ. Đóng góp từng người được đánh giá chéo trong bản phân chia công việc nộp kèm.");
}

// Kết luận
{
  const s = add("DARK", "Kết luận");
  eyebrow(s, "KẾT LUẬN", true);
  s.addText("Kết quả, hạn chế và hướng phát triển", { placeholder: "title" });
  const cw = (W - 0.7) / 3;
  const cols = [
    ["ĐẠT ĐƯỢC", ORANGE, ["Cal.com v6.2.0 chạy trên macOS và Windows", "20 test case, 12 invariant, oracle là CSDL", "13/20 phát hiện lỗi: 10 lỗi race + 1 lỗi logic", "Cả 11 lỗi tái hiện bằng curl", "Nguyên nhân gốc tới tên hàm, kiểm chứng bằng thí nghiệm", "0 đồng, ≈ 8 phút máy chạy lại toàn bộ"]],
    ["HẠN CHẾ", SKY, ["Chưa báo lỗi cho Cal.com, chưa sửa mã Cal.com", "Chạy yarn dev, một máy chủ, CSDL cục bộ", "Chưa test qua giao diện bằng Playwright", "Chưa test API v2, luồng team, giữ chỗ tạm", "Nhân lực là ước lượng, chưa theo dõi giờ"]],
    ["HƯỚNG PHÁT TRIỂN", ORANGE, ["Playwright song song minh họa D1 trên giao diện", "Đề xuất bản sửa: ràng buộc loại trừ + ánh xạ lỗi; khóa theo chủ lịch", "Báo lỗi cho Cal.com kèm bộ tái hiện curl", "Đưa bộ test vào CI nhờ mã thoát của lệnh chạy"]],
  ];
  cols.forEach(([h, color, items], i) => {
    const x = M + i * (cw + 0.35);
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.85, w: cw, h: 4.55, rectRadius: 0.12, fill: { color: INK2 }, line: { color: INK2, width: 0 } });
    s.addText(h, { x: x + 0.3, y: 2.05, w: cw - 0.6, h: 0.4, fontFace: MONO, fontSize: 14, bold: true, color, margin: 0, isTextBox: true });
    s.addText(items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < items.length - 1, paraSpaceAfter: 8 } })), { x: x + 0.3, y: 2.6, w: cw - 0.6, h: 3.7, fontFace: BODY, fontSize: 15, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "Cảm ơn thầy và các bạn. Mời đặt câu hỏi.", true);
  s.addNotes("Tóm lại: kỹ thuật kiểm thử đồng thời tìm ra lỗi thật mà kiểm thử tuần tự bỏ sót, kết quả lặp lại được trên hai máy, chi phí thấp. Nhóm nêu trung thực các phần chưa làm: chưa báo lỗi và chưa sửa mã Cal.com, chưa test qua giao diện bằng Playwright. Kết thúc phần trình bày, mời thầy đặt câu hỏi. Có thể demo bằng lệnh npm run demo:midterm.");
}

pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
